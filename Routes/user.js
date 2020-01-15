const express = require("express");
const { User } = require("../models");

const router = express.Router();

router.post("/signup", (req, res) => {
  const { email, username, password } = req.body;

  User.findOrCreate({
    where: {
      email,
    },
    defaults: {
      username,
      password,
    },
  })
    .then(([result, created]) => {
      if (!created) {
        return res.status(409).send("Already exsits user");
      }
      return res.status(200).send(result.dataValues);
    })
    .catch(err => console.log(err));
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  User.findOne({
    where: {
      email,
      password,
    },
  }).then(result => {
    if (!result) {
      res.status(404).send("입력 정보를 다시 한 번 확인해 주십시오");
    } else {
      req.session.id = result.dataValues.id;
      res.send({ id: result.dataValues.id });
    }
  });
});

router.post("/signout", (req, res) => {
  req.session.destroy();
  res.sendStatus(201);
});

module.exports = router;
