const express = require("express");
const { Channel, User, Workspace } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.post("/join", isLoggedIn, async (req, res, next) => {
  const { email, channel_id, code } = req.body;
  // 존재하는 workspace 인지
  const workspace = await Workspace.findOne({ where: { code } });
  if (!workspace) {
    return res.status(409).send("Workspace does not exist");
  }
  // workspace에 등록된 user인지
  const users = await workspace.getUsers({ where: { email } });
  if (!users[0]) {
    return res.status(409).send("Not a user registered in the workspace");
  }

  const user = await User.findOne({ where: { email } });
  user.addChannels(channel_id);

  res.status(201).send("OK");
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { email, name, type, code } = req.body;

  // 존재하는 workspace 인지
  const workspace = await Workspace.findOne({ where: { code } });
  if (!workspace) {
    return res.status(409).send("Workspace does not exist");
  }
  // workspace에 등록된 user인지
  const users = await workspace.getUsers({ where: { email } });
  if (!users[0]) {
    return res.status(409).send("Not a user registered in the workspace");
  }

  // channel 중복된 이름이 있는지
  Channel.findOrCreate({
    where: { name },
    defaults: { workspace_id: workspace.id, type },
  }).then(([channel, created]) => {
    if (!created) {
      return res.status(409).send("Channel already exist");
    }
    return res
      .status(201)
      .json({ id: channel.id, name: channel.name, type: channel.type });
  });
});

router.get("/list", isLoggedIn, async (req, res) => {
  const { code } = req.body;
  // 존재하는 workspace 인지
  const workspace = await Workspace.findOne({ where: { code } });
  if (!workspace) {
    return res.status(409).send("Workspace does not exist");
  }
  console.log(await workspace.getChannels());
  res.send("H");
});
module.exports = router;
