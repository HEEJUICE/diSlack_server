const express = require("express");
// const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models");
const {
  isLoggedIn,
  isNotLoggedIn,
  verifyToken,
} = require("../../middlewares/auth");

const router = express.Router();

// /user/signup
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

// /user/signin
router.post("/signin", isNotLoggedIn, async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(409).send("회원가입 되지 않은 사용자입니다");
  }
  const flag = bcrypt.compareSync(password, user.password);
  if (!flag) {
    return res.status(409).send("비밀번호가 일치하지 않습니다");
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
      issuer: "Crong",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
  });
  return res.json({ id: user.id, name: user.name, email: user.email });
});

// /user/signout
router.post("/signout", isLoggedIn, (req, res) => {
  res.clearCookie("token");
  res.sendStatus(205);
});

module.exports = router;
