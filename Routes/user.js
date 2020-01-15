const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.post("/signup", isNotLoggedIn, (req, res) => {
  const { email, username, password } = req.body;
  console.log(req.query);
  User.findOrCreate({
    where: {
      email,
    },
    defaults: {
      username,
      password: bcrypt.hashSync(password, 12),
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

router.post("/signin", isNotLoggedIn, (req, res, next) => {
  // const { email, password } = req.body;

  // User.findOne({
  //   where: {
  //     email,
  //     password,
  //   },
  // }).then(result => {
  //   if (!result) {
  //     res.status(404).send("입력 정보를 다시 한 번 확인해 주십시오");
  //   } else {
  //     req.session.id = result.dataValues.id;
  //     res.send({ id: result.dataValues.id });
  //   }
  // });
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      return next(authError);
    }
    if (!user) {
      return res.status(409).send(info.message);
    }
    return req.login(user, loginError => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.json({ user_id: user.id });
    });
  })(req, res, next);
});

router.get("/signout", isLoggedIn, (req, res) => {
  console.log(req.user);
  req.logout();
  req.session.destroy();
  res.sendStatus(201);
});

module.exports = router;
