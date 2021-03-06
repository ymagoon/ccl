"use strict";

const express = require("express");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const { PLUGIN_ROUTE_MATCH } = require("./lib/const");
const { runRoute } = require("../plugin-manager/index");

/**
 * Middleware for the routes endpoint
 * @param {*} args - command line arguments
 * @param {router} router - express router object
 */
const middleware = (router) =>
    router.use((req, res, next) => {
        console.log(chalk.magenta("\n=== /api/routes/ ==="));
        next();
    });

/**
 * Handles plugin routes issued with a GET.
 * @param {*} args - command line arguments
 * @param {router} router - express router object
 */
const get = (args, router) =>
    router.get(PLUGIN_ROUTE_MATCH, (req, res, next) => {
        console.log(req.params);
        console.log(req.query);
        console.log(chalk.magenta("====================="));
        const { pluginId, routeId } = req.params;
        runRoute(pluginId, routeId, args, req, res, next);
    });

/**
 * Handles plugin routes issued with a POST.
 * @param {*} args - command line arguments
 * @param {router} router - express router object
 */
const post = (args, router) =>
    router.post(PLUGIN_ROUTE_MATCH, bodyParser.json(),(req, res, next) => {
        console.log(req.body);
        console.log(chalk.magenta("====================="));
        const { pluginId, routeId } = req.params;
        runRoute(pluginId, routeId, args, req, res, next);
    });

/**
 * Creates the express router object.
 * @param {*} args - command line arguments
 * @returns {Router} the express router
 */
const makeRouter = (args) => {
    const router = express.Router();
    middleware(router);
    get(args, router);
    post(args, router);
    return router;
};

module.exports = makeRouter;
