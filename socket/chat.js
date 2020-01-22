module.exports = chat => {
  chat.on("connection", socket => {
    socket.on("disconnect", () => {});
    socket.on("joinchannel", data => {
      console.log(data);
      socket.join(`channel${data}`);
    });
    socket.on("joindirect", data => {
      console.log(data);
      socket.join(`direct${data}`);
    });
  });
};
