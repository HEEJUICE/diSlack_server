const express = require("express");
const { Channel, Workspace } = require("../models");
const { isLoggedIn } = require("./middlewares");
const db = require("../models");

const router = express.Router();

// router.post("/join", isLoggedIn, async (req, res, next) => {
//   const { channel_id } = req.body;
//   // 존재하는 workspace 인지
//   try {
//     const workspace = await Workspace.findOne({ where: { code } });
//     if (!workspace) {
//       return res.status(409).send("Workspace does not exist");
//     }
//     // workspace에 등록된 user인지
//     const users = await workspace.getUsers({ where: { id: req.user.id } });
//     if (!users[0]) {
//       return res.status(409).send("Not a user registered in the workspace");
//     }

//     await req.user.addChannels(channel_id);

//     res.status(201).send("Join OK");
//   } catch (err) {
//     next(err);
//   }
// });

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { name, type } = req.body;
  const { code } = req;

  // 존재하는 workspace 인지
  try {
    const workspace = await Workspace.findOne({ where: { code } });
    if (!workspace) {
      return res.status(409).send("Workspace does not exist");
    }
    // workspace에 등록된 user인지
    const users = await workspace.getUsers({ where: { id: req.user.id } });
    if (!users[0]) {
      return res.status(409).send("Not a user registered in the workspace");
    }

    const channel = await Channel.create({
      name,
      workspace_id: workspace.id,
      type: "public",
    });

    //    await channel.addUsers(req.user.id);

    res
      .status(201)
      .json({ id: channel.id, name: channel.name, type: channel.type });
  } catch (err) {
    next(err);
  }
});

router.get("/list", isLoggedIn, async (req, res, next) => {
  const { code } = req;
  try {
    // 존재하는 workspace 인지
    const workspace = await Workspace.findOne({ where: { code } });
    if (!workspace) {
      return res.status(409).send("Workspace does not exist");
    }
    let channels = await workspace.getChannels();
    channels = channels.map(channel => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
    }));
    res.json(channels);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
