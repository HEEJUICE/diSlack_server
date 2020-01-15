const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const { sequelize, Workspace } = require("./models");

const channelRouter = require("./Routes/channel");
const userRouter = require("./Routes/user");
const workspaceRouter = require("./Routes/workspace");
const messagesRouter = require("./Routes/messages");

const app = express();
sequelize.sync();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

// Route
app.use("/*", (req, res, next) => {
  Workspace.findOne({ where: { code: req.params[0] } }).then(result => {
    if (result) {
      next();
    }
  });
  const err = new Error("Workspace does not exist.");
  err.status = 404;
  next(err);
});
app.use("/channel", channelRouter);
app.use("/user", userRouter);
app.use("/workspace", workspaceRouter);
app.use("/messages", messagesRouter);

// 404
app.use((req, res, next) => {
  const err = new Error("Not Founded");
  err.status = 404;
  next(err);
});
// Error
app.use((err, req, res) => {
  res.status(err.status || 500).send("ERROR!");
});

app.listen(4000, () => {
  console.log("server listen on 4000");
});
