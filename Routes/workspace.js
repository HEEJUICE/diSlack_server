const express = require("express");
const shortid = require("shortid");
const { Workspace, Channel } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { name } = req.body;

  shortid.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@",
  );

  // 중복된 워크스페이스 code가 있으면 다시 생성
  let code = shortid.generate();
  for (let i = 0; i < 4; i += 1) {
    const result = await Workspace.findOne({ where: { code } });
    if (result) {
      if (i === 3) {
        return next(new Error("Server Error"));
      }
      code = shortid.generate();
    }
  }

  // 워크스페이스를 생성
  Workspace.findOrCreate({
    where: { name },
    defaults: { code, owner_id: req.user.id },
  })
    .then(async ([workSpace, created]) => {
      try {
        if (!created) {
          return res.status(409).send("Already exists workspace name");
        }

        await workSpace.addUsers(req.user.id);
        const channel = await Channel.create({
          name: "general",
          workspace_id: workSpace.id,
          owner_id: req.user.id,
        });
        await channel.addUsers(req.user.id);
        await workSpace.addChannels(channel.id);

        return res
          .status(201)
          .json({ url: `http://${req.headers.host}/${code}`, code });
      } catch (err) {
        next(err);
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post("/join", isLoggedIn, async (req, res, next) => {
  const { code } = req.body;

  try {
    const workspace = await Workspace.findOne({ where: { code } });
    if (!workspace) {
      return res.status(401).send("잘못된 code");
    }
    workspace.addUsers(req.user.id);

    return res.status(200).send("Join OK");
  } catch (err) {
    next(err);
  }
});

router.get("/list/my", isLoggedIn, async (req, res, next) => {
  try {
    const workspaces = await req.user.getWorkspaces();
    const result = workspaces.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
      code: workspace.code,
    }));
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/list/all", isLoggedIn, async (req, res, next) => {
  try {
    const workspaces = await Workspace.findAll();
    const result = workspaces.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
      code: workspace.code,
    }));
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
