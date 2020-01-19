const express = require("express");
const { Workspace } = require("../models");

const userRouter = require("./workspace/user");
const channelRouter = require("./channel");
const roomRouter = require("./direct");
const channelMessageRouter = require("./channel/channelMessage");
const directMessageRouter = require("./direct/directMessage");

const router = express.Router();

// /:code/user
router.use("/user", userRouter);

// /:code/room
router.use("/room", roomRouter);
// /:code/channel
router.use("/channel", channelRouter);

// /:code/channelmessage/:id(channel)
router.use("/channelmessage/:id", (req, res, next) => {
  req.channel_id = req.params.id;
  channelMessageRouter(req, res, next);
});
// /:code/directmessage/:id(room)
router.use("/directmessage/:id", (req, res, next) => {
  req.room_id = req.params.id;
  directMessageRouter(req, res, next);
});

// /workspace/join과 중복됨
router.get("/join", async (req, res, next) => {
  const { code } = req;
  try {
    const workspace = await Workspace.findOne({ where: { code } });
    if (!workspace) {
      return res.status(401).send("잘못된 code");
    }
    workspace.addUsers(req.user.id);
    res.status(200).send("Join OK");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
