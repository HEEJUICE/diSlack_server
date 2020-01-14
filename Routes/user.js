const { user } = require("../models/user");
const express = require("express");

const router = express.Router();

router.post("/signup", (req, res) => {
  const { email, username, password } = req.body;

  user
    .findOrCreate({
      where: {
        email: email,
      },
      defaults: {
        username: username,
        password: password,
      },
    })
    .then(([result, created]) => {
      if (!created) {
        return res.status(409).send("Already exsits user");
      }
      res.status(200).send(result.dataValues);
    })
    .catch(err => console.log(err));
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  user
    .findOne({
      where: {
        email: email,
        password: password,
      },
    })
    .then(result => {
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
