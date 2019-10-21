"use strict";

const express = require("express");
const router = express.Router();
const makeIndexHtml = require("./lib/makeIndexHtml");
const { pluginList, pluginPackageName } = require("../plugin-manager");

router.get("/", (req, res) => {
    res.send(makeIndexHtml(pluginList().map(pluginPackageName)));
});

module.exports = router;
