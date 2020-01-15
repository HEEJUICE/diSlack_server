const express = require("express");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { Workspace, User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { name, user_id } = req.body;

  shortid.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@",
  );
  // 중복된 code가 있으면 다시 generate
  let code = shortid.generate();
  for (let i = 0; i < 9; i += 1) {
    const result = await Workspace.findOne({ where: { code } });
    if (result) {
      if (i === 8) {
        return next(new Error("Server Error"));
      }
      code = shortid.generate();
    }
  }

  Workspace.findOrCreate({
    where: { name },
    defaults: { code, owner_id: req.user.id },
  })
    .then(([workSpace, created]) => {
      if (!created) {
        return res.sendStatus(409);
      }
      return res
        .status(201)
        .json({ url: `http://${req.headers.host}/${code}`, code });
    })
    .catch(err => {
      next(err);
    });
});

router.post("/join", isLoggedIn, async (req, res) => {
  const { code } = req.body;
  // const workspace = await Workspace.findOne({ where: { id: 1 } });
  // console.log("WORKD", await workspace.getUsers());

  const workspace = await Workspace.findOne({ where: { code } });
  if (!workspace) {
    return res.sendStatus(401);
  }
  workspace.addUsers(req.user.id);
  res.status(201).send("OK");
});

router.get("/invite", (req, res) => {});
module.exports = router;
