const express = require("express");
const { Room, Workspace } = require("../models");
const { isLoggedIn } = require("./middlewares");
const db = require("../models");

const router = express.Router();

module.exports = router;
