import JsonForm from "./lib_controls/JsonForm";
import { EVENTS } from "./constants/Events";

/**
 * The path used to invoke command URLs
 * @param {String} plugin the plugin name
 * @param {String} command the command name
 * @returns {String} the path
 */
const commandPath = (plugin, command) =>
    `/api/commands/${plugin}/${command}`;

/**
 * Returns the path used to invoke route URLs
 * @param {String} plugin the plugin name
 * @param {String} route the route name
 * @returns {String} the path
 */
const routePath = (plugin, route) =>
    `/api/routes/${plugin}/${route}`;

/**
 * Returns the path used to invoke static plugin assets
 * @param {String} plugin the plugin name
 * @param {String} file the asset file name
 * @returns {String} the path
 */
const staticPath = (plugin, file) =>
    `/static/plugins/${plugin}/${file}`;

/**
 * The root URL that the browser used to load gaia
 * @returns {String} the URL
 */
const rootUrl = () => {
    const hostAndPort = window.location.href.split("/")[2];
    return window.location.protocol + "//" + hostAndPort;
};

/**
 * The full URL to a route
 * @param {String} plugin the plugin name
 * @param {String} command the command name
 */
const routeUrl = (plugin, command) =>
    rootUrl() + routePath(plugin, command);

/**
 * Calls the promise ok or err with the message value depending on
 * the message status
 * @param {XMLHttpRequest} request - the current request
 * @param {function} ok - promise ok function
 * @param {function} err - promise error function
 * @returns {undefined}
 */
const handleHttpResponse = (request, ok, err) => {
    const response = JSON.parse(request.responseText);
    if (response.status == "SUCCESS") {
        ok(response.response);
    } else {
        err(response.response);
    }
};

/**
 * Makes an HTTP request to run the specified command on the server.
 * @param {String} plugin - the plugin name
 * @param {String} command - the command name
 * @param {*} args - args in JSON format
 * @returns {Promise} promise that will be resolved when the call is completed
 */
const runCommand = (plugin, command, args) =>
      new Promise((ok, err) => {
          const req = new XMLHttpRequest();
          req.onreadystatechange = function () {
              if (this.readyState === 4 && this.status === 200) {
                  handleHttpResponse(this, ok, err);
              }
          };
          req.open("POST", `/api/commands/${plugin}/${command}`, true);
          req.setRequestHeader("Content-Type", "application/json");
          req.send(JSON.stringify(args));
      });

/**
 * Creates a new websocket connection with a websocket that is registered
 * in the plugin configuration file.
 * @param {String} plugin the plugin name
 * @param {String} websocket the websocket endpoint name
 * @returns {Promise} promise that resolves once the connection is established
 */
const openWebsocket = (plugin, websocket) =>
    new Promise((ok, err) => {
        const hostAndPort = window.location.href.split("/")[2];
        const ws = new WebSocket(`ws://${hostAndPort}/api/websockets/${plugin}/${websocket}`);
        ws.onopen = (event) => ok(ws);
    });

const controls = {
    JsonForm
};

export {
    runCommand,
    openWebsocket,
    controls,
    commandPath,
    rootUrl,
    routePath,
    routeUrl,
    staticPath,
    EVENTS
};
