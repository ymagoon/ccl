"use strict";

const express = require("express");
const app = express();
const commands = require("./commands");
const apiRoutes = require("./routes");
const appRoute = require("./app");
const chalk = require("chalk");
const path = require("path");
const { ROUTES } = require("./lib/const");
const { pluginList, pluginFolder, moduleRootFolder, resolvePlugin } = require("../plugin-manager");
const { registerWebsockets } = require("./websockets");

/**
 * Reads the plugin list provided and creates a new express route
 * for each, pointing to the directory that node js resolves for
 * that particular plugin module.
 * @param {*} app the express app
 * @param {Array<String>} plugins list of plugin names
 * @return {undefined}
 */
const registerStaticPluginRoutes = (app, plugins) =>
      plugins
      .map(
          (plugin) => app.use(
              `${ROUTES.STATIC.PLUGINS.ROOT}/${plugin}`,
              express.static(pluginFolder(plugin))
          )
      );

/**
 * Starts the Gaia server.
 * @param {Object} args - Arguments for the server.
 * @returns {Promise} Promise to start the server.
 */
const run = (args) => new Promise((resolve, reject) => {
    const plugins = pluginList();
    const resolvedPlugins = plugins.map(resolvePlugin);

    // App route (UI)
    app.use(ROUTES.APP.ROOT, appRoute);

    // Plugin routes
    app.use(ROUTES.API.COMMANDS.ROOT, commands);
    app.use(ROUTES.API.ROUTES.ROOT, apiRoutes(args));

    // Websockets
    registerWebsockets(app, args, resolvedPlugins);

    // Static assets
    // -> App
    app.use(ROUTES.STATIC.APP.ROOT, express.static(path.join(__dirname, "../../dist")));
    // -> Favicon
    app.use(ROUTES.STATIC.FAVICON, express.static(path.join(__dirname, "../../logo.PNG")));
    // -> Plugin
    registerStaticPluginRoutes(app, plugins);
    // -> Babel Polyfill
    app.use(ROUTES.STATIC.BABEL_POLYFILL, express.static(moduleRootFolder("babel-polyfill")));


    // Start the server
    app.listen(args.port, () => {
        console.log(chalk.magenta(`\n=== (Gaia Server) ===`));
        console.log(`Access Gaia UI: http://localhost:${args.port}/app`);
        console.log(`Host: http://localhost`);
        console.log(`Port: ${args.port}`);
        console.log(`App: /app`);
        console.log(`Commands: /api/commands`);
        console.log(`Routes: /api/routes`);
        console.log(chalk.magenta(`=====================`));
        resolve();
    });
});

module.exports = run;
