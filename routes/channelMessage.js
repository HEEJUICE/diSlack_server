const express = require("express");
const { ChannelMessage, Channel, ChannelThread, User } = require("../models");

const channelThread = require("./channelThread");

const router = express.Router();

// /:code/channelmessage/:id(channel)/list
router.get("/list", (req, res, next) => {
  const { channel_id } = req;

  ChannelMessage.findAll({
    where: { channel_id },
    include: [
      {
        model: ChannelThread,
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
          replyCount: message.channelThreads.length,
        };
      });
      res.json(result);
    })
    .catch(err => next(err));
});

// /:code/channelmessage/:id(channel)
router.post("/", (req, res, next) => {
  const { message } = req.body;
  const { channel_id } = req;

  Channel.findOne({
    where: { id: channel_id },
  })
    .then(result => {
      if (result) {
        return ChannelMessage.create({
          message,
          user_id: req.user.id,
          channel_id,
        }).then(cm => {
          res.json({
            id: cm.id,
            message: cm.message,
            createdAt: cm.createdAt,
            updatedAt: cm.updatedAt,
            user: {
              id: req.user.id,
              email: req.user.email,
              name: req.user.name,
            },
          });
        });
      }
      return res.status(404).send("Channel does not exist");
    })
    .catch(err => next(err));
});

// /:code/channelmessage/:id(channel)/:id(message)
router.use("/:id", (req, res, next) => {
  req.msgId = req.params.id;
  channelThread(req, res, next);
});

module.exports = router;
