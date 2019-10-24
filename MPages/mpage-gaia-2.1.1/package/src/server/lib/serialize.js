"use strict";

const { STATUS_CODES } = require("./const");

/**
 * Serializes a plugin command response, handling it accordingly and
 * sending the response via the http response object.
 * @param {Promise} commandResult - The plugin command promise.
 * @param {HttpResponse} res - The http response object.
 * @returns {Promise} The serialization promise.
 */
const serialize = (commandResult, res) =>
    commandResult
        .then((r) => res.send({
            status: STATUS_CODES.SUCCESS,
            response: r
        }))
        .catch((e) => res.send({
			status: STATUS_CODES.ERROR,
			response: e instanceof Error ? ({ message: e.message, stack: e.stack}) : e
		}));

module.exports = serialize;
