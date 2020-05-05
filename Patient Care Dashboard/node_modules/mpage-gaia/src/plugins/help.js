"use strict";

const chalk = require("chalk");
const { pluginList, resolvePlugin } = require("../plugin-manager");
const manpage = require("../cli/manpage");
const man = require("../cli/man");


/**
 * Small helper to invert an object to an array.
 * @param {Object} obj - Object to invert.
 * @param {string} key - The key in which to assign the actual object.
 * @returns {Array<Object>} The inverted object.
 */
const invert = (obj, key) =>
    Object.keys(obj).map((id) => ({
        id: id,
        [key]: obj[ id ]
    }));

/**
 * Logs example of how to run a plugin command as an http request.
 * @param {string} pluginId - The plugin id.
 * @param {string} commandId - The command id.
 * @param {Array<Object>} args - Array of arguments.
 * @param {string} url - The api url route.
 * @returns {undefined} Returns nothing.
 */
const logHttpExample = (pluginId, commandId, args, url) => {
    console.log("\nRest example:");
    console.log(`http://host:port/api/${url}/${pluginId}/${commandId}?`);
    console.log("\t" + args.map(({ id, arg }) => {
            return `${ arg.optional ? `[${id}]` : id }=<${arg.type}>`;
        }).join("\n\t&"));
};

/**
 * Logs an array of arguments, if any.
 * @param {Array<Object>} args - Array of arguments.
 * @returns {undefined} Returns nothing.
 */
const logArguments = (args = []) => {
    if(args.length) {
        console.log("Args:");
    }
    args.forEach(({ id, arg }) => {
        console.log(`${id}`);
        console.log(`\tdesc: ${arg.description || "Not provided"}`);
        console.log(`\ttype: ${arg.type || "Not provided"}`);
    });
};

/**
 * Logs arguments for the plugin command.
 * @param {string} pluginId - The plugin id.
 * @param {string} commandId - The command id.
 * @param {Object} args - The command args object.
 * @returns {undefined} Returns nothing.
 */
const logCommandArgs = (pluginId, commandId, args = []) => {
    logArguments(args);

    console.log("\nExample:");
    console.log(`npm run gaia ${pluginId}:${commandId}`);
    args.forEach(({ id, arg }) => {
        console.log(`\t${ arg.optional ? `[${id}]` : id }=<${arg.type}>`);
    });
    logHttpExample(pluginId, commandId, args, "commands");
};

const logRouteArgs = (pluginId, commandId, args = []) => {
    logArguments(args);
    logHttpExample(pluginId, commandId, args, "routes");
};

/**
 * Logs a plugin command.
 * @param {string} pluginId - The plugin id.
 * @param {Array<Object>} commands - Array of plugin commands.
 * @returns {undefined} Returns nothing.
 */
const logCommand = (pluginId, commands) => {
    console.log(chalk.magenta("\n=== Commands =="));

    commands.forEach(({ id, command }) => {
        console.log(chalk.green(`Command: ${id}`));
        console.log(`Description: ${command.description}`);

        logCommandArgs(
            pluginId,
            id,
            command.args ? invert(command.args, "arg") : []
        );
    });
};

/**
 * Logs routes for a plugin.
 * @param {string} pluginId - The plugin id.
 * @param {Array<Object>} routes - Array of routes.
 * @returns {undefined} Returns nothing.
 */
const logRoute = (pluginId, routes) => {
    console.log(chalk.magenta("\n=== Routes =="));
    routes.forEach(({ id, route }) => {
        console.log(chalk.green(`Route: ${id}`));
        console.log(`Description: ${route.description}`);

        logRouteArgs(
            pluginId,
            id,
            route.args ? invert(route.args, "arg") : []
        );
    });
};

/**
 * Lists commands for a specified plugin.
 * @param {Object} plugin - Plugin definition.
 * @returns {undefined} Returns nothing.
 */
const listCommands = (plugin) => {
    logCommand(plugin.id, invert(plugin.commands, "command"));
    logRoute(plugin.id, invert(plugin.routes, "route"));
};


/**
 * Runs the default help command.
 * @param {Object} args - Arguments for the help command.
 * @returns {Promise} Command promise.
 */
const runHelp = (gaia, args) => new Promise((resolve, reject) => {
    const { plugin } = args;
    if (plugin) {
        listCommands(resolvePlugin(plugin));
        resolve();
    } else {
        man.show(manpage.json());
    }
});

/**
 * Outputs a list of available plugins.
 * @param {Object} args - Arguments for the listing.
 * @returns {Promise} Command promise.
 */
const runList = (gaia, args) => new Promise((resolve, reject) => {
    const manEntry = [
        { "Available plugins": pluginList().concat("server") },
        { "See also": [
            `Type ${man.command("npm run gaia help plugin=[pluginname]")} for help`,
            "for a particular plugin."
        ] }
    ];
    man.show(manEntry);
    resolve(manEntry);
});

module.exports = {
    id: "gaia-plugin-help",
    commands: {
        run: {
            description: "Gaia Help",
            handler: runHelp
        },
        plugins: {
            description: "Gaia Plugin Listing",
            handler: runList
        }
    }
};
