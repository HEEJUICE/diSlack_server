const SocketIO = require("socket.io");
const chatModule = require("./chat");
const roomModule = require("./room");

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);

  const room = io.of("/room");
  const chat = io.of("/chat");

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  chatModule(chat);
  roomModule(room);
};
