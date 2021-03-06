"use strict";

const fs = require("fs");
const path = require("path");
const { PLUGIN_PREFIX } = require("./const");
const {
    retrievePackageJson,
    gaiaPackageJson,
    listAllPluginsInPackageJson,
    moduleRootFolder
} = require("./filesystem");
const R = require("ramda");

const pluginStates = {};

const getPluginState = (pluginId) => {
    if (!pluginStates[pluginId]) {
        pluginStates[pluginId] = retrieveInitialState(pluginId);
    }
    return pluginStates[pluginId];
};

/**
 * Shortcut to throw an error, so that it can be used
 * within pure expressions.
 * @param {*} err the error to be thrown
 * @throws {*} the error
 */
const error = (err) => {
    throw new Error(err);
};

/**
 * Arguments that are sent to commands by default.
 */
const defaultArgs = () => ({
    packageJson: retrievePackageJson(),
    cwd: process.cwd()
});

/**
 * Attempts to load an installed (external plugin).
 * @param {string} pluginId - The plugin id.
 * @returns {Object | false} The plugin, if installed.
 */
const installedPlugin = (pluginId) =>
    require(pluginPackageName(pluginId));

/**
 * Attempts to load a core plugin.
 * @param {string} pluginId - The plugin id.
 * @returns {Object} The core plugin.
 */
const corePlugin = (pluginId) =>
    fs.existsSync(path.join(__dirname, "../plugins", `${pluginId}.js`)) ?
        require(`../plugins/${pluginId}`) : false;

/**
 * Attempts to resolve a plugin by checking either installed plugins or
 * core plugins.
 * @param {string} pluginId - The id of the plugin.
 * @returns {Object} The loaded plugin.
 */
const resolvePlugin = (pluginId) => (
    corePlugin(pluginId) ||
    installedPlugin(pluginId) ||
    error(`Could not find plugin: ${pluginId}`)
);

/**
 * Returns the initial state for a particular plugin.  If no initial state is set, empty object returned
 * @param  {String} pluginId
 * @returns {*} The initial plugin state
 */
const retrieveInitialState = (pluginId) => resolvePlugin(pluginId).initialState || {};

/**
 * Returns the command definition for a particular plugin.
 * @param {String} pluginId
 * @param {String} commandId
 * @returns {*} the command definition
 */
const retrieveCommand = (pluginId, commandId) =>
      resolvePlugin(pluginId).commands[ commandId]
      || error(`Could not find the ${commandId} command in the ${pluginId} plugin.`);


/**
 * Runs the command with the specified command id on the plugin with the
 * specified plugin id.
 * @param {string} pluginId - The id of the plugin on which to execute the
 * command.
 * @param {string} commandId - The id of the command to execute.
 * @param {Object} args - Arguments for the plugin command.
 * @returns {Promise} The handler promise of the plugin command.
 */
const runCommand = (pluginId, commandId, args) =>
    (
        retrieveCommand(pluginId, commandId).handler
        || error(`The ${commandId} command for the ${pluginId} plugin has no handler.`)
    )
    (gaiaObj, Object.assign(defaultArgs(), args), getPluginState(pluginId));

const gaiaObj = { runCommand };

/**
 * Runs the route with the specified route id on the plugin with the specified
 * plugin id.
 * @param {string} pluginId - The id of the plugin on which to execute the
 * route.
 * @param {string} routeId - The id of the route to execute.
 * @param {HttpRequest} req - The http request object.
 * @param {HttpResponse} res - The http response object.
 * @returns {undefined} Returns nothing.
 */
const runRoute = (pluginId, routeId, args, req, res, next) =>
      resolvePlugin(pluginId)
      .routes[ routeId ]
      .handler(
          gaiaObj,
          Object.assign(defaultArgs(), args),
          req,
          res,
          next,
          getPluginState(pluginId)
      );


const runWebsocket = (pluginId, socketId, args, ws, req) =>
    resolvePlugin(pluginId).websockets[ socketId ]
      .handler(gaiaObj, args, ws, req, getPluginState(pluginId));

/**
 * Small helper to resolve the plugin package name.
 * @param {string} pluginId - The id of the plugin.
 * @returns {string} The package name of the plugin.
 */
const pluginPackageName = (pluginId) =>
    (PLUGIN_PREFIX + pluginId);

/**
 * Returns all of the standard gaia plugins
 * as well as those defined in the package.json
 * in the directory where gaia was invoked
 */
const pluginList = () =>
    R.uniq(
        listAllPluginsInPackageJson(gaiaPackageJson())
            .concat(listAllPluginsInPackageJson(retrievePackageJson()))
    );

const resolvedPluginList = () =>
    pluginList.map(resolvePlugin);


/**
 * Returns the absolute path for the plugin node_modules folder.
 * @param {String} pluginName the plugin name
 * @returns {String} the absolute path
 */
const pluginFolder = (pluginName) =>
    moduleRootFolder(pluginPackageName(pluginName));

/**
 * The markdown.ui entry for the specific plugin. Null if it doesn't exist.
 * @param {String} pluginId the plugin id
 * @returns {String} the file entry
 */
const retrieveUiMarkdownFile = (pluginId) => {
    const markdown = resolvePlugin(pluginId).markdown;
    return markdown ? markdown.ui : null;
};

/**
 * Returns the markdown path for the specified plugin from
 * the file specified in the plugin's manifest (plugin.js) mardown.ui
 * entry.
 * @param {String} pluginId the plugin id
 */
const retrieveUiMarkdownAbsoluteFilePath = (pluginId) =>
    path.join(pluginFolder(pluginId), retrieveUiMarkdownFile(pluginId));


module.exports = {
    gaiaPackageJson,
    pluginList,
    pluginPackageName,
    resolvePlugin,
    runCommand,
    runRoute,
    runWebsocket,
    pluginFolder,
    moduleRootFolder,
    resolvedPluginList,
    retrieveUiMarkdownAbsoluteFilePath,
    retrieveUiMarkdownFile
};
