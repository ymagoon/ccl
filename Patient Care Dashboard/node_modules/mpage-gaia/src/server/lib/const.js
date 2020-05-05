"use strict";

const path = require("path");

/**
 * Enumeration for server response statuses.
 * @type {{SUCCESS: string, ERROR: string}}
 */
const STATUS_CODES = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
};

/**
 * Enumeration for common server routes
 * @type {{STATIC: {ROOT: string, PLUGINS: {ROOT: string}}, API: {ROOT: string, COMMANDS: {ROOT: string}, ROUTES: {ROOT: string}}, APP: {ROOT: string}}}
 */
const ROUTES = {
    STATIC: {
        ROOT: "/static",
        FAVICON: "/static/favicon",
        FUSION: "/static/fusion",
        BABEL_POLYFILL: "/static/babel-polyfill",
        APP: {
            ROOT: "/static/app"
        },
        PLUGINS: {
            ROOT: "/static/plugins"
        }
    },
    API: {
        ROOT: "/api",
        COMMANDS: {
            ROOT: "/api/commands"
        },
        ROUTES: {
            ROOT: "/api/routes"
        },
        WEBSOCKET: {
            ROOT: "/api/websockets"
        }
    },
    APP: {
        ROOT: "/app"
    }
};

const PLUGIN_COMMAND_MATCH = "/:pluginId/:commandId";
const PLUGIN_ROUTE_MATCH = "/:pluginId/:routeId*";

module.exports = {
    STATUS_CODES,
    PLUGIN_COMMAND_MATCH,
    PLUGIN_ROUTE_MATCH,
    ROUTES
};
