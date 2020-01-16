const express = require("express");
const {
  ChannelMessage,
  DirectMessage,
  ChannelThread,
  DirectThread,
} = require("../models");

const router = express.Router();
