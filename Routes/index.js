const express = require("express");
const channelRouter = require("./channel");
const messagesRouter = require("./messages");
const { isLoggedIn } = require("./middlewares");

const { Workspace } = require("../models");

const router = express.Router();

// router.use((req, res, next) => {
//   console.log(req.workspace_id);
//   next();
// });
router.get("/join", isLoggedIn, async (req, res, next) => {
  const { code } = req;
  try {
    const workspace = await Workspace.findOne({ where: { code } });
    if (!workspace) {
      return res.status(401).send("잘못된 code");
    }
    workspace.addUsers(req.user.id);
    res.status(201).send("Join OK");
  } catch (err) {
    next(err);
  }
});

router.use("/channel", channelRouter);
router.use("/:id", (req, res, next) => {
  req.channel_id = req.params.id;
  messagesRouter(req, res, next);
});

module.exports = router;
