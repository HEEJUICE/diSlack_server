const express = require("express");
const { Workspace } = require("../../models");

const router = express.Router();

// /:code/user/list
router.get("/list", async (req, res, next) => {
  const { code } = req;
  try {
    const workspace = await Workspace.findOne({ where: { code } });
    const users = await workspace.getUsers();
    const result = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// /:code/user/profile/:id
router.get("/profile/:id", async (req, res, next) => {
  const { id } = req.params;
  const { code } = req;
  try {
    const workspace = await Workspace.findOne({ where: { code } });
    const users = await workspace.getUsers();

    const [result] = users.filter(user => parseInt(id, 10) === user.id);
    res.json({ id: result.id, name: result.name, email: result.email });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
