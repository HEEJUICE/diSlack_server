const express = require("express");
const {
  Workspace,
  ChannelThread,
  Channel,
  ChannelMessage,
  User,
} = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

// /:code(workspace)/message/channel/:id(channel)/:id(message)/list
router.get("/list", isLoggedIn, async (req, res, next) => {
  // 이전 미들웨어에서 저장한 정보를 변수에 저장한다
  const { code, channel_id, msgId, user } = req;

  // DB에서 데이터를 찾는다
  try {
    const [workspace, channel, message] = await Promise.all([
      Workspace.findOne({ where: { code } }),
      Channel.findOne({ where: { id: channel_id } }),
      ChannelMessage.findOne({ where: { id: msgId } }),
    ]);

    // 필요한 데이터가 하나라도 없으면 응답한다
    if (!workspace) {
      return res.status(409).send("no workspace");
    }
    if (!channel) {
      return res.status(409).send("no room");
    }
    if (!message) {
      return res.status(409).send("no message");
    }

    const lists = await message.getChannelThreads({
      attributes: ["id", "reply", "createdAt"],
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    return res.json(lists);
  } catch (err) {
    next(err);
  }
});

// /:code(workspace)/message/direct/:id(room)/:id(message)
router.post("/", isLoggedIn, async (req, res, next) => {
  // 이전 미들웨어에서 저장한 정보를 변수에 저장한다
  const { code, channel_id, msgId, user } = req;
  const { reply } = req.body;

  // DB에서 데이터를 찾는다
  try {
    const [workspace, room, message] = await Promise.all([
      Workspace.findOne({ where: { code } }),
      Channel.findOne({ where: { id: channel_id } }),
      ChannelMessage.findOne({ where: { id: msgId } }),
    ]);

    // 필요한 데이터가 하나라도 없으면 응답한다
    if (!workspace) {
      return res.status(409).send("no workspace");
    }
    if (!room) {
      return res.status(409).send("no room");
    }
    if (!message) {
      return res.status(409).send("no message");
    }

    const result = await ChannelThread.create({
      reply,
      user_id: user.id,
      cm_id: msgId,
    });

    return res.status(201).json({
      id: result.id,
      reply: result.reply,
      createdAt: result.createdAt,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
