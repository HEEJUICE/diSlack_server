const express = require("express");
const cookieParser = require("cookie-parser");
// const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const logger = require("./logger"); // winston - error log 저장
const { sequelize } = require("./models");
const webSocket = require("./socket"); // websocket
const indexRouter = require("./routes");
const authRouter = require("./routes/auth");
const workspaceRouter = require("./routes/workspace");
const mapRouter = require("./routes/map");

const { isLoggedIn, verifyToken } = require("./middlewares/auth"); // 인증

const app = express();
sequelize.sync();
// const sessionMiddleware = session({
//   secret: process.env.COOKIE_SECRET,
//   resave: false,
//   cookie: {
//     httpOnly: true,
//     secure: false,
//   },
//   saveUninitialized: true,
// });

// Middlewares
// NODE_ENV는 .env에 넣을 수 없다.
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(helmet());
} else {
  app.use(morgan("dev"));
}
app.use(
  cors({
    origin: ["http://localhost:4000", process.env.URL],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(sessionMiddleware);

// Routes
app.post("/verify", verifyToken, (req, res) => {
  res.send("VERIFY");
});
app.use("/user", authRouter);
app.use("/workspace", isLoggedIn, workspaceRouter);
app.use("/:code", isLoggedIn, (req, res, next) => {
  req.code = req.params.code;
  indexRouter(req, res, next);
});
app.use("/", mapRouter);

// 404
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error
app.use((err, req, res) => {
  logger.error(err.message);
  return res.status(err.status || 500).send(err.message || "SERVER ERROR!");
});

const server = app.listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log("server listen on 4000");
});

webSocket(server, app);
