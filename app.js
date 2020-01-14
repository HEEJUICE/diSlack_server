const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./models");

const channelRouter = require("./Routes/channel");
const userRouter = require("./Routes/user");
const workspaceRouter = require("./Routes/workspace");
const messagesRouter = require("./Routes/messages");

const app = express();
sequelize.sync();

app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    saveUninitialized: true,
  }),
);

app.use((req, res, next) => {
  const err = new Error("Not Founded");
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.status(err.status || 500).send("ERROR!");
});

app.use("/channel", channelRouter);
app.use("/user", userRouter);
app.use("/workspace", workspaceRouter);
app.use("/messages", messagesRouter);

app.listen(4000, () => {
  console.log("server listen on 4000");
});
