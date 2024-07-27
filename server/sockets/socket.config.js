// socket.config.js
const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {},
});

io.of("/").adapter.setMaxListeners(20);

module.exports = io;
