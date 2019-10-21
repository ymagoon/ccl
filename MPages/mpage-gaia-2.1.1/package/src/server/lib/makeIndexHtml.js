"use strict";

const { ROUTES } = require("./const");
const path = require("path");

/**
 * generates the script tags for the HTML
 * @param {Array.<string>} pluginList - list of plugin names
 * @returns {Array.<string>} Collection of url tags
 * @private
 */
const generatePluginScriptTag = pluginList =>
    pluginList
        .map(require)
        .map(
            plugin =>
                plugin && plugin.id && plugin.ui
                    ? `<script src='${path.join(
                          ROUTES.STATIC.PLUGINS.ROOT,
                          plugin.id,
                          plugin.ui
                      )}'></script>`
                    : ""
        );

/**
 * Generates the index.html for the Gaia app.
 * @returns {string} The index html.
 */
const makeIndexHtml = (pluginList) =>
    `
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0">
                <meta name="theme-color" content="#3949ab"/>
                <link rel="shortcut icon" href="${ROUTES.STATIC.FAVICON}">
                <title>MPage Gaia</title>
                <!-- MPageFusion depends on babel-polyfill but is not built with it -->
                <script src="${ROUTES.STATIC.BABEL_POLYFILL}/dist/polyfill.js"></script>
                <!-- Gaia UI -->
                <script src='./static/app/js/bundle.js'> </script>
                <!-- All Plugins -->
                ${generatePluginScriptTag(pluginList).join("\n")}
                <script>
                    window.startApp(${JSON.stringify(pluginList)});
                </script>
            </head>
            <body>
                <div id="root" class="gaia-Root"></div>
            </body>
        </html>
    `;

module.exports = makeIndexHtml;
