module.exports = chat => {
  chat.on("connection", socket => {
    console.log("chat 네임스페이스 접속!");
    // const req = socket.request;
    // const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // const {
    //   headers: { referer },
    // } = req;

    socket.on("disconnect", () => {
      console.log("chat 네임스페이스 접속 해제!");
    });

    socket.on("joinchannel", data => {
      console.log("channel id", data);
      socket.join(`channel${data}`);
    });
  });
};
