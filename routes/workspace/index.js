const express = require("express");
const shortid = require("shortid");
const { Workspace, Channel, User } = require("../../models");

const router = express.Router();

// /workspace/create
router.post("/create", async (req, res, next) => {
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
  return Workspace.findOrCreate({
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
        await channel.addUsers(req.user.id); // 다 대 다로 연결하면 가운데 테이블이 생기는데, join method를 이런 식으로... add는 추가 get은 join...
        await workSpace.addChannels(channel.id);

        return res
          .status(201)
          .json({ url: `http://${req.headers.host}/${code}`, code });
      } catch (err) {
        return next(err);
      }
    })
    .catch(err => {
      return next(err);
    });
});

// /workspace/join
router.post("/join", async (req, res, next) => {
  const { code } = req.body;

  try {
    const workspace = await Workspace.findOne({ where: { code } });
    if (!workspace) {
      return res.status(401).send("잘못된 code");
    }
    workspace.addUsers(req.user.id);

    return res.status(200).send("Join OK");
  } catch (err) {
    return next(err);
  }
});

// /workspace/list/my
router.get("/list/my", async (req, res, next) => {
  try {
    const workspaces = await req.user.getWorkspaces();
    const result = workspaces.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
      code: workspace.code,
    }));
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

// /workspace/list/all
router.get("/list/all", async (req, res, next) => {
  try {
    // 머리가 안돌아감
    // workspaces LEFT JOIN users
    const workspaces = await Workspace.findAll({
      include: [
        {
          model: User,
        },
      ],
    });

    // 내가 속하지 않는 채널만 filter and map
    const result = workspaces
      .filter(cur => {
        for (let i = 0; i < cur.users.length; i += 1) {
          if (cur.users[i].id === req.user.id) {
            return false;
          }
        }
        return true;
      })
      .map(workspace => ({
        id: workspace.id,
        name: workspace.name,
        code: workspace.code,
      }));

    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
