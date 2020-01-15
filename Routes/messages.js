const express = require("express");
const { ChannelMessage, DirectMessage, Channel } = require("../models");

const router = express.Router();

// channel_id가 일치하는 지 확인한다.
// 일치하면

// router.get("/channel", (req, res, next) => {
//   // eslint-disable-next-line camelcase
//   const { channelMessage, user_id, channel_id } = req.body;
//   console.log(req.body);

//   Channel.findOne({
//     where: { id: channel_id },
//   })
//     .then(result => {})
//     .catch(err => next(err));
// });

router.post("/channel", (req, res, next) => {
  const { message, user_id, channel_id } = req.body;
  console.log(req.body.message);

  Channel.findOne({
    where: { id: channel_id },
  })
    .then(result => {
      if (result) {
        ChannelMessage.create({
          message,
          from_id: user_id,
          channel_id,
        });
        res.status(200).send(result);
      } else {
        return res.status(404).send("Channel does not exist");
      }
    })
    .catch(err => next(err));
});

// router.get("/direct", (req, res, next) => {
//   const { message, from_id, to_id } = req.body;

//   DirectMessage.findOne({
//     where: { to_id },
//     defaults: { message, from_id },
//   });
// });

// router.post("/direct", (req, res, next) => {
//   const { message, from_id, to_id } = req.body;

//   DirectMessage.findOrCreate({
//     where: { to_id },
//     defaults: { message, from_id },
//   });
// });

module.exports = router;
