const SocketIO = require("socket.io");
const chatModule = require("./chat");
const roomModule = require("./room");
const channelThreadModule = require("./channelThread");

module.exports = (server, app) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);

  const room = io.of("/room");
  const chat = io.of("/chat");
  const channelThread = io.of("/channelThread");

  roomModule(room);
  chatModule(chat);
  channelThreadModule(channelThread);
};
