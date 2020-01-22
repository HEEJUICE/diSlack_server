const express = require("express");
const {
  Workspace,
  DirectMessage,
  DirectThread,
  Room,
  User,
} = require("../../models");

const router = express.Router();

// /:code/directmessage/:id(room)/:id(message)/list
router.get("/list", async (req, res, next) => {
  // 이전 미들웨어에서 저장한 정보를 변수에 저장한다
  const { code, room_id, msgId } = req;

  // DB에서 데이터를 찾는다
  try {
    const [workspace, room, message] = await Promise.all([
      Workspace.findOne({ where: { code } }),
      Room.findOne({ where: { id: room_id } }),
      DirectMessage.findOne({ where: { id: msgId } }),
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

    const lists = await message.getDirectThreads({
      attributes: ["id", "reply", "createdAt", "updatedAt"],
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    return res.json(lists);
  } catch (err) {
    return next(err);
  }
});

// /:code/directmessage/:id(room)/:id(message)
router.post("/", async (req, res, next) => {
  // 이전 미들웨어에서 저장한 정보를 변수에 저장한다
  const { code, room_id, msgId, user } = req;
  const { reply } = req.body;

  // DB에서 데이터를 찾는다
  try {
    const [workspace, room, message] = await Promise.all([
      Workspace.findOne({ where: { code } }),
      Room.findOne({ where: { id: room_id } }),
      DirectMessage.findOne({ where: { id: msgId } }),
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

    const result = await DirectThread.create({
      reply,
      user_id: user.id,
      dm_id: msgId,
    });

    const io = req.app.get("io");
    io.of("channelThread")
      .to(`directThread${msgId}`)
      .emit(
        "message",
        JSON.stringify({
          id: result.id,
          reply: result.reply,
          createdAt: result.createdAt,
          user: { id: user.id, name: user.name, email: user.email },
        }),
      );
    return res.status(201).json({
      id: result.id,
      reply: result.reply,
      createdAt: result.createdAt,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
