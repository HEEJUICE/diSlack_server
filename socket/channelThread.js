module.exports = channelThread => {
  channelThread.on("connection", socket => {
    socket.on("disconnect", () => {});
    socket.on("joinChannelThread", data => {
      socket.join(`channelThread${data}`);
    });
    socket.on("joinDirectThread", data => {
      socket.join(`directThread${data}`);
    });
  });
};
