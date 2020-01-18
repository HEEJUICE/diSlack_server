const express = require("express");
const { DirectMessage, Room, DirectThread, User } = require("../../models");

const directThread = require("./directThread");

const router = express.Router();

// /:code/directmessage/:id(room)/list
router.get("/list", (req, res, next) => {
  const { room_id } = req;

  DirectMessage.findAll({
    where: { room_id },
    include: [
      {
        model: DirectThread,
      },
      {
        model: User,
      },
    ],
  })
    .then(messages => {
      const result = messages.map(message => {
        return {
          id: message.id,
          message: message.message,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          user: {
            id: message.user.id,
            name: message.user.name,
            email: message.user.email,
          },
          replyCount: message.directThreads.length,
        };
      });
      res.json(result);
    })
    .catch(err => next(err));
});

// /:code/directmessage/:id(room)
router.post("/", (req, res, next) => {
  const { message } = req.body;
  const { room_id } = req;

  Room.findOne({
    where: { id: room_id },
  })
    .then(result => {
      if (result) {
        return DirectMessage.create({
          message,
          user_id: req.user.id,
          room_id,
        }).then(dm => {
          res.status(201).json({
            id: dm.id,
            message: dm.message,
            createdAt: dm.createdAt,
            user: {
              id: req.user.id,
              email: req.user.email,
              name: req.user.name,
            },
          });
        });
      }
      return res.status(409).send("Room does not exist");
    })
    .catch(err => next(err));
});

// /:code/directmessage/:id(room)/:id(message)
router.use("/:id", (req, res, next) => {
  req.msgId = req.params.id;
  directThread(req, res, next);
});

module.exports = router;
