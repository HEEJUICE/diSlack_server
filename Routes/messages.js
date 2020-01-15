const express = require("express");
const { ChannelMessage } = require("../models");
const { DirectMessage } = require("../models");

const router = express.Router();

router.get("/", (req, res, next) => {});

module.exports = router;
