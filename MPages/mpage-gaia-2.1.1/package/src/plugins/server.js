"use strict";

const run = require("../server/index");

module.exports = {
    id: "gaia-plugin-server",
    commands: {
        run: {
            description: "Gaia Server Runner",
            handler: (args) => run({ port: 9001 })
        }
    }
};
