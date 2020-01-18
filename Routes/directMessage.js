const express = require("express");
const { DirectMessage, Room, DirectThread, User } = require("../models");
const directThread = require("./directThread");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/list", isLoggedIn, (req, res, next) => {
  // eslint-disable-next-line camelcase
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

router.post("/", isLoggedIn, (req, res, next) => {
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
          res.json({
            id: dm.id,
            message: dm.message,
            createdAt: dm.createdAt,
            updatedAt: dm.updatedAt,
            user: {
              id: req.user.id,
              email: req.user.email,
              name: req.user.name,
            },
          });
        });
      }
      return res.status(404).send("Room does not exist");
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
  directThread(req, res, next);
});
module.exports = router;
