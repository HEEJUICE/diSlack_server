const express = require("express");
const { channelMessage } = require("../models/channelMessage");
const { directMessage } = require("../models/directMessage");

const router = express.Router();

router.get("/", (req, res, next) => {});

module.exports = router;
