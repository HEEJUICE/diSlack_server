const express = require("express");
const { Channel, Workspace } = require("../../models");

const router = express.Router();

// /:code/channel/create
router.post("/create", async (req, res, next) => {
  const { name } = req.body;
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
      owner_id: req.user.id,
      type: "public",
    });

    await channel.addUsers(req.user.id);

    res
      .status(201)
      .json({ id: channel.id, name: channel.name, type: channel.type });
  } catch (err) {
    next(err);
  }
});

// /:code/channel/list
router.get("/list", async (req, res, next) => {
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
      channel: true,
    }));
    res.json(channels);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
