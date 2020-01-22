module.exports = chat => {
  chat.on("connection", socket => {
    socket.on("disconnect", () => {});
    socket.on("joinchannel", data => {
      socket.join(`channel${data}`);
    });
  });
};
