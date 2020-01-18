const express = require("express");
const channelRouter = require("./channel");
const roomRouter = require("./room");
const channelMessageRouter = require("./channelMessage");
const directMessageRouter = require("./directMessage");
const channelThreadRouter = require("./channelThread");
const directThreadRouter = require("./directThread");
const { isLoggedIn } = require("./middlewares");

const { Workspace, User } = require("../models");

const router = express.Router();

// router.use((req, res, next) => {
//   console.log(req.workspace_id);
//   next();
// });
router.get("/join", isLoggedIn, async (req, res, next) => {
  const { code } = req;
  try {
    const workspace = await Workspace.findOne({ where: { code } });
    if (!workspace) {
      return res.status(401).send("잘못된 code");
    }
    workspace.addUsers(req.user.id);
    res.status(201).send("Join OK");
  } catch (err) {
    next(err);
  }
});

router.get("/user/list", async (req, res, next) => {
  const { code } = req;
  try {
    const workspace = await Workspace.findOne({ where: { code } });
    const users = await workspace.getUsers();
    const result = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/user/profile/:id", async (req, res, next) => {
  const { id } = req.params;
  const { code } = req;
  try {
    const workspace = await Workspace.findOne({ where: { code } });
    const users = await workspace.getUsers();

    const [result] = users.filter(user => parseInt(id) === user.id);
    res.json({ id: result.id, name: result.name, email: result.email });
  } catch (err) {
    next(err);
  }
});

router.use("/channel", channelRouter);
router.use("/channelmessage/:id", (req, res, next) => {
  req.channel_id = req.params.id;
  channelMessageRouter(req, res, next);
});
router.use("/directmessage/:id", (req, res, next) => {
  req.room_id = req.params.id;
  directMessageRouter(req, res, next);
});

module.exports = router;
