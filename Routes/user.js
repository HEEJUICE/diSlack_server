const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

const { User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.post("/signup", isNotLoggedIn, (req, res, next) => {
  const { email, name, password } = req.body;

  User.findOrCreate({
    where: {
      email,
    },
    defaults: {
      name,
      password: bcrypt.hashSync(password, 12),
    },
  })
    .then(([user, created]) => {
      if (!created) {
        return res.status(409).send("Already exists user");
      }

      return res
        .status(201)
        .json({ id: user.id, name: user.name, email: user.email });
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
      return res.json({ id: user.id, email: user.email, name: user.name });
    });
  })(req, res, next);
});

router.post("/signout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.sendStatus(205);
});

module.exports = router;
