const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.post("/signup", isNotLoggedIn, (req, res, next) => {
  const { email, username, password } = req.body;
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
    .catch(err => next(err));
});

router.post("/signin", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      return next(authError);
    }
    if (!user) {
      return res.status(409).send(info.message);
    }
    return req.login(user, loginError => {
      if (loginError) {
        return next(loginError);
      }
      return res.json({ user_id: user.id });
    });
  })(req, res, next);
});

router.get("/signout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.sendStatus(201);
});

module.exports = router;
