const io = require('./socket.config');

const nameToSocketMapping = new Map();
const socketToNameMapping = new Map();

io.on("connection", (socket) => {
  console.log("A user connected!");

  // Handle chat message event
  socket.on("chat message", (msg) => {
    console.log(`Message received: ${msg} by user ${socket.name}`);
    if (socket.room) {
      io.to(socket.room).emit("chat message", { msg, name: socket.name });
    } else {
      console.error("Socket is not in any room!");
    }
  });

  // Handle room creation event
  socket.on("create-room", (data, callback) => {
    if (socket.room) {
      console.error("Socket is already in a room!");
      if (typeof callback === 'function') {
        callback({ success: false, error: "Already in a room" });
      }
      return;
    }

    const room = `room_${Math.random().toString(36).substr(2, 9)}`;
    socket.join(room);
    socket.name = data.name;
    socket.room = room;
    nameToSocketMapping.set(data.name, room);
    socketToNameMapping.set(room, socket.name);
    console.log(`Room created: ${room}`);

    if (typeof callback === 'function') {
      callback({ success: true, room });
    }
  });

  // Handle joining a room
  socket.on("join-room", (data, callback) => {
    if (socket.room) {
      console.error("Socket is already in a room!");
      if (typeof callback === 'function') {
        callback({ success: false, error: "Already in a room" });
      }
      return;
    }

    if (io.sockets.adapter.rooms.get(data.room)) {
      socket.join(data.room);
      socket.name = data.name;
      socket.room = data.room;
      nameToSocketMapping.set(data.name, data.room);
      socketToNameMapping.set(data.room, data.name);
      console.log(`User ${data.name} joined room: ${data.room}`);

      if (typeof callback === 'function') {
        callback({ success: true, room: data.room });
      }
      io.to(data.room).emit('room-joined', { room: data.room, name: socket.name });
    } else {
      console.error(`Attempted to join non-existent room: ${data.room}`);
      if (typeof callback === 'function') {
        callback({ success: false, error: "Room does not exist" });
      }
    }
  });

  // Handle socket disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected!");
    if (socket.room) {
      console.log(`Socket left room: ${socket.room}`);
      io.to(socket.room).emit('room-left', socket.name);
      nameToSocketMapping.delete(socket.name);
      socketToNameMapping.delete(socket.room);
      socket.leave(socket.room);
    }
  });

  // Handle call user
  socket.on("call-user", ({ name, offer }) => {
    const roomId = nameToSocketMapping.get(name);
    if (roomId) {
      const from = socketToNameMapping.get(roomId);
      io.to(roomId).emit('incoming-call', { from, offer });
    } else {
      console.error(`User ${name} not found or not in any room`);
    }
  });

  // Handle call accepted
  socket.on("call-accepted", ({ name, answer }) => {
    const roomId = nameToSocketMapping.get(name);
    if (roomId) {
      io.to(roomId).emit('call-accepted', { answer });
    }
  });

  // Handle connect (reconnection case)
  socket.on("connect", () => {
    if (socket.room) {
      io.to(socket.room).emit("username", socket.name);
    }
  });
});

// Log room creation
io.of("/").adapter.on("create-room", (room) => {
  console.log(`Room ${room} was created`);
});

module.exports = io;
