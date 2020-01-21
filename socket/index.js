const SocketIO = require("socket.io");
const chatModule = require("./chat");
const roomModule = require("./room");
const channelThreadModule = require("./channelThread");

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);

  const room = io.of("/room");
  const chat = io.of("/chat");
  const channelThread = io.of("/channelThread");

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  chatModule(chat);
  roomModule(room);
  channelThreadModule(channelThread);
};
