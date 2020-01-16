const express = require("express");
const { ChannelMessage, DirectMessage, Channel, User } = require("../models");

const router = express.Router();

router.get("/channel/:id", (req, res, next) => {
  // eslint-disable-next-line camelcase
  const channel_id = req.params.id;

  Channel.findOne({
    where: { id: channel_id },
  })
    .then(result => {
      if (!result) {
        res.status(404).send("Channel does not exist");
      } else {
        ChannelMessage.findAll({
          where: { channel_id },
        })
          .then(messages => {
            res.json(messages);
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

router.post("/channel", (req, res, next) => {
  const { message, user_id, channel_id } = req.body;

  Channel.findOne({
    where: { id: channel_id },
  })
    .then(result => {
      if (result) {
        return ChannelMessage.create({
          message,
          from_id: user_id,
          channel_id,
        }).then(cm => {
          res.status(200).send(cm);
        });
      }
      return res.status(404).send("Channel does not exist");
    })
    .catch(err => next(err));
});

router.get("/direct/:id", (req, res, next) => {
  const to_id = req.params.id;

  DirectMessage.findAll({
    where: {
      from_id: 1,
      to_id,
    },
  }).then(result => {
    res.json(result);
  });
});

router.post("/direct", (req, res, next) => {
  const { message, from_id, to_id } = req.body;

  return DirectMessage.create({
    message,
    from_id,
    to_id,
  }).then(dm => {
    res.status(200).send(dm);
  });
});

module.exports = router;
