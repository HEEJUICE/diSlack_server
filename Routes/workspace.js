const express = require("express");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { Workspace, User } = require("../models");

const router = express.Router();

router.post("/create", async (req, res, next) => {
  const { name, user_id } = req.body;
  shortid.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@",
  );
  let code = shortid.generate();

  // 중복된 code가 있으면 다시 generate
  for (let i = 0; i < 9; i += 1) {
    const result = await Workspace.findOne({ where: { code } });
    if (result) {
      code = shortid.generate();
    }
  }

  Workspace.findOrCreate({
    where: { name },
    // owner_id:user_id
    defaults: { code },
  })
    .then(([workSpace, created]) => {
      if (!created) {
        return res.sendStatus(409);
      }
      res.status(201).json({ url: `http://${req.headers.host}/${code}` }, code);
    })
    .catch(err => {
      next(err);
    });
});
router.post("/join", async (req, res) => {
  const { email, password, code } = req.body;
  // const workspace = await Workspace.findOne({ where: { id: 1 } });
  // console.log("WORKD", await workspace.getUsers());
  const user = await User.findOne({
    where: { email },
  });
  const result = bcrypt.compareSync(password, user.password);
  if (result) {
    const wid = await Workspace.findOne({ where: { code } });
    if (!wid) {
      return res.sendStatus(401);
    }
    const succ = await user.addWorkspaces(wid);
    res.sendStatus(201);
  } else {
    return res.sendStatus(401);
  }
});
router.get("/invite", (req, res) => {});
module.exports = router;
