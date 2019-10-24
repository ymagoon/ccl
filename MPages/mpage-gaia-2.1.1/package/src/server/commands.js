"use strict";

const express = require("express");
const router = express.Router();
const chalk = require("chalk");
const bodyParser = require("body-parser");
const serialize = require("./lib/serialize");
const { PLUGIN_COMMAND_MATCH } = require("./lib/const");
const { runCommand } = require("../plugin-manager");
const MASK_LIST = [
    "password"
];
/**
 * Masks passwords and other properties provided in MASK_LIST
 * @param {Object} obj - object from which the property is masked
 * @returns {Object} Object containing masked values
 */
const maskConsoleProperty = obj =>
    MASK_LIST.reduce(
        (o, m) =>
            o[m]
                ? Object.assign({}, o, {
                      [m]: "*******"
                  })
                : o,
        obj
    );
/**
 * Middleware for the commands endpoint.
 */
router.use((req, res, next) => {
    next();
});

/**
 * Handles plugin commands issued with a GET.
 */
router.get(PLUGIN_COMMAND_MATCH, (req, res) => {
    const { pluginId, commandId } = req.params;
    console.log(chalk.magenta(`\n=== /api/command/${pluginId}/${commandId} ===`));
    console.log(req.params);
    console.log(req.query);
    console.log(chalk.magenta("====================="));
    serialize(runCommand(pluginId, commandId, req.query), res);
});

/**
 * Handles plugin commands issued with a POST
 */
router.post(PLUGIN_COMMAND_MATCH, bodyParser.json(),(req, res) => {
    const { pluginId, commandId } = req.params;
    console.log(chalk.magenta(`\n=== /api/command/${pluginId}/${commandId} ===`));
    console.log(maskConsoleProperty(req.body));
    console.log(chalk.magenta("====================="));
    serialize(runCommand(pluginId, commandId, req.body), res);
});

module.exports = router;
