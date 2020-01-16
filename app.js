const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const { sequelize, Workspace } = require("./models");

const channelRouter = require("./Routes/channel");
const userRouter = require("./Routes/user");
const workspaceRouter = require("./Routes/workspace");
const messagesRouter = require("./Routes/messages");
const indexRouter = require("./Routes");
const passportConfig = require("./passport");
const webSocket = require("./socket");

const app = express();
sequelize.sync();
passportConfig(passport);
const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  saveUninitialized: true,
});

app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Route
app.use("/workspace", workspaceRouter);
app.use("/user", userRouter);
app.use("/:code", (req, res, next) => {
  req.code = req.params.code;
  indexRouter(req, res, next);
});

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

const server = app.listen(4000, () => {
  console.log("server listen on 4000");
});

webSocket(server, app);
