const express = require("express");
const {
  Workspace,
  ChannelThread,
  Channel,
  ChannelMessage,
  User,
} = require("../../models");

const router = express.Router();

<<<<<<< HEAD:Routes/channelThread.js
// /:code(workspace)/channelmessage/:id(channel)/:id(message)/thread/list
router.get("/list", isLoggedIn, async (req, res, next) => {
=======
// /:code/channelmessage/:id(channel)/:id(message)/list
router.get("/list", async (req, res, next) => {
>>>>>>> bbb4c335b6425b834d46b0398d0e76ae39d4c503:routes/channel/channelThread.js
  // 이전 미들웨어에서 저장한 정보를 변수에 저장한다
  const { code, channel_id, msgId } = req;

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
      attributes: ["id", "reply", "createdAt", "updatedAt"],
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    return res.json(lists);
  } catch (err) {
    next(err);
  }
});

<<<<<<< HEAD:Routes/channelThread.js
// /:code(workspace)/channelmessage/:id(channel)/:id(message)/thread
router.post("/", isLoggedIn, async (req, res, next) => {
=======
// /:code/channelmessage/:id(channel)/:id(message)
router.post("/", async (req, res, next) => {
>>>>>>> bbb4c335b6425b834d46b0398d0e76ae39d4c503:routes/channel/channelThread.js
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
