const io = require("socket.io-client");
const fs = require("fs");

const PACKET_CONTENTS = [
  { name: "symbol", type: "ascii", size: 4 },
  { name: "buysellindicator", type: "ascii", size: 1 },
  { name: "quantity", type: "int32", size: 4 },
  { name: "price", type: "int32", size: 4 },
  { name: "packetSequence", type: "int32", size: 4 },
];

const PACKET_SIZE = PACKET_CONTENTS.reduce((sum, field) => sum + field.size, 0);

const parsePacket = (buffer) => {
  let offset = 0;
  const packet = {};
  PACKET_CONTENTS.forEach((field) => {
    if (field.type === "int32") {
      packet[field.name] = buffer.readInt32BE(offset);
      offset += field.size;
    } else {
      packet[field.name] = buffer
        .toString("ascii", offset, offset + field.size)
        .trim();
      offset += field.size;
    }
  });
  return packet;
};

const receivedPackets = [];
const client = io.connect("http://localhost:3000");

client.on("connect", () => {
  console.log("Connected to server.");
  client.emit("request_all_packets");
});

client.on("packet", (data) => {
  const packet = parsePacket(data);
  receivedPackets.push(packet);
});

client.on("disconnect", async () => {
  console.log("Disconnected from server.");
  const maxSequence = Math.max(...receivedPackets.map((p) => p.packetSequence));
  const missingSequences = [];
  for (let i = 1; i <= maxSequence; i++) {
    if (!receivedPackets.find((p) => p.packetSequence === i)) {
      missingSequences.push(i);
    }
  }

  for (const seq of missingSequences) {
    await new Promise((resolve) => {
      const tempClient = io.connect("http://localhost:3000");
      tempClient.on("connect", () => {
        tempClient.emit("request_packet", seq);
      });
      tempClient.on("packet", (data) => {
        const packet = parsePacket(data);
        receivedPackets.push(packet);
        tempClient.disconnect();
      });
      tempClient.on("disconnect", resolve);
    });
  }

  receivedPackets.sort((a, b) => a.packetSequence - b.packetSequence);
  fs.writeFileSync("output.json", JSON.stringify(receivedPackets, null, 2));
  console.log("All packets received and written to output.json.");
});

client.on("error", (err) => {
  console.error("Client error:", err.message);
});
