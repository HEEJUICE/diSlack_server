module.exports = channelThread => {
  channelThread.on("connection", socket => {
    console.log("channelThread 네임스페이스 접속!");
    socket.on("disconnect", () => {
      console.log("chat 네임스페이스 접속 해제!");
    });
    socket.on("joinChannelThread", data => {
      socket.join(`channelThread${data}`);
    });
  });
};
