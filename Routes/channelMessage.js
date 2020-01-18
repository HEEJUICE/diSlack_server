const express = require("express");
const { ChannelMessage, Channel, ChannelThread, User } = require("../models");
const channelThread = require("./channelThread");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/list", isLoggedIn, (req, res, next) => {
  // eslint-disable-next-line camelcase
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
        console.log(message);
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

router.post("/", isLoggedIn, (req, res, next) => {
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
          console.log(cm);
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

// router.get("/direct/:id", (req, res, next) => {
//   const to_id = req.params.id;

//   DirectMessage.findAll({
//     where: {
//       from_id: 1,
//       to_id,
//     },
//   }).then(result => {
//     res.json(result);
//   });
// });

// router.post("/direct", (req, res, next) => {
//   const { message, from_id, to_id } = req.body;

//   return DirectMessage.create({
//     message,
//     from_id,
//     to_id,
//   }).then(dm => {
//     res.status(200).send(dm);
//   });
// });
router.use("/:id", (req, res, next) => {
  req.msgId = req.params.id;
  channelThread(req, res, next);
});
module.exports = router;
