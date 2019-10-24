const { runWebsocket } = require("../plugin-manager");
const { ROUTES } = require("./lib/const");
const expressWs = require('express-ws');

/**
 * Reducer that converts websockets from the gaia json into a name / pluginId
 * pair to be used for registration.
 * @param {*} wsDescriptions websocket descriptions as it is in gaia json
 * @param {*} plugin gaia json plugin descriptor
 * @returns {*} the list of websocket descriptions to concatenate the description to
 **/
const toWebsocketDescriptions = (wsDescriptions, plugin) =>
    wsDescriptions.concat(
        Object.keys(plugin.websockets).map(
            (websocketName) => ({
                name: websocketName,
                pluginId: plugin.id
            })
        )
    );

	
/**
 * Registers a websocket description into the webserver
 * @param {ExpressApp} app the express app
 * @param {*} args gaia command line arguments
 * @param {*} wsDescription websocket description to register
 * @returns {undefined}
 **/
const registerWebsocketDescription = (app, args) => (wsDescription) =>
          app.ws(
              `${ROUTES.API.WEBSOCKET.ROOT}/${wsDescription.pluginId}/${wsDescription.name}`,
              (ws, req) => {
                  runWebsocket(wsDescription.pluginId, wsDescription.name, args, ws, req);
              }
          );
		  
		  
/**
 * Registers all the websockets in the gaia json as entries in the expres 
 * server.
 * @param {ExpressApp} app the express app
 * @param {*} args gaia command line arguments
 * @param {*} plugins all registered gaia plugins
 * @returns {undefined}
 **/
const registerWebsockets = (app, args, plugins) => {
    expressWs(app);
    return plugins
        .filter((plugin) => plugin.websockets)
        .reduce(toWebsocketDescriptions, [])
        .forEach(registerWebsocketDescription(app, args));
};

module.exports = { registerWebsockets };
