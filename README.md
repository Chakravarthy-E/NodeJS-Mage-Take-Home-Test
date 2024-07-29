# Betacrew Exchange Server

## Overview

This project demonstrates a simple packet-based communication system using `socket.io`. The server emits packets of data to the client, which requests all packets and handles any missing packets by re-requesting them from the server. The received packets are then saved to an `output.json` file.

## Prerequisites

- Node.js v20.9.0 or later
- npm (Node Package Manager)

## Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/Chakravarthy-E/NodeJS-Mage-Take-Home-Test/
   cd NodeJS-Mage-Take-Home-Test
   ```
2. **Install the Packages**
   ```
   npm install
   ```
3. **Start the Server**
   ```
   node server.js
   ```
4. **Run the Client**
   ```
   node client.js
   ```
   -The client will connect to the server, request all packets, handle any missing packets, and save the received packets to output.json.
5. **Project Structure**
  ```
├── node_modules/
├── server.js
├── client.js
├── package.json
├── package-lock.json
└── README.md
  ```

   

