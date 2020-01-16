const SocketIO = require("socket.io");

module.exports = (server, app) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);

  io.on("connection", socket => {
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    // const channel_id = referer.split("/")[referer.split("/").length - 1];
    // socket.join(channel_id);
    // console.log(req.headers);
    socket.on("init", () => {
      console.log("hi");
      socket.emit("welcome", "hi");
    });

    socket.on("disconnect", () => {
      // socket.leave(channel_id);
    });
  });
};
