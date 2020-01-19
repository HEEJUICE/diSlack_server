const express = require("express");
const { Room, Workspace, User } = require("../../models");

const router = express.Router();

// /:code(workspace)/room/create
router.post("/create", async (req, res, next) => {
  const { friend_id } = req.body;
  const { code } = req;
  try {
    const workspace = await Workspace.findOne({ where: { code } });
    if (!workspace) {
      return res.status(409).send("Workspace does not exist");
    }
    const users = await workspace.getUsers({
      where: {
        id: friend_id,
      },
    });
    if (!users[0]) {
      return res.status(409).send("Not a user registered in the workspace");
    }
    const rooms = await req.user.getRooms({
      include: [
        {
          model: User,
          where: { id: friend_id },
        },
      ],
    });
    if (!rooms[0]) {
      const room = await Room.create({ workspace_id: workspace.id });
      await room.addUsers([req.user.id, friend_id]);

      const friend = await User.findOne({ where: { id: friend_id } });

      return res.status(201).json({
        id: room.id,
        users: [
          { id: req.user.id, email: req.user.email, name: req.user.name },
          { id: friend.id, email: friend.email, name: friend.name },
        ],
      });
    }

    return res.status(201).json({
      id: rooms[0].id,
      users: [
        { id: req.user.id, name: req.user.name, email: req.user.email },
        {
          id: rooms[0].users[0].id,
          name: rooms[0].users[0].name,
          email: rooms[0].users[0].email,
        },
      ],
    });
  } catch (err) {
    next(err);
  }
});

// /:code(workspace)/room/list
router.get("/list", async (req, res, next) => {
  const { code } = req;

  try {
    const workspace = await Workspace.findOne({ where: { code } });
    if (!workspace) {
      return res.status(409).send("Workspace does not exist");
    }
    const rooms = await workspace.getRooms({
      include: [
        {
          model: User,
          attributes: ["name", "id", "email"],
        },
      ],
      attributes: ["id"],
    });
    const result = rooms.filter(room => {
      return room.users.map(cur => cur.id).includes(req.user.id);
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
