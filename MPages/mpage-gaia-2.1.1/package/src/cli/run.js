#!/usr/bin/env node

const {
    set,
    lensProp
} = require("ramda");
const runCommand = require("../plugin-manager").runCommand;
const man = require("./man");
const manpage = require("./manpage");

const defaultCommand = "run";


/**
 * Entry point for the command line
 * @param {Array} cliArgs - the command line args
 */
const entry = (cliArgs) =>
    !cliArgs.length
    ? man.show(manpage.json())
    : runCommand(
        cliArgs[0].split(":")[0],
        cliArgs[0].split(":")[1] || defaultCommand,
        parseArgs(cliArgs.slice(1))
    )
    .catch((err) => { throw err; });

/**
 * Creates a args JSON by parsing the args array
 * @param {Array<String>} args - array of strings in the format "arg=val"
 * @returns {*} JSON map with all the args
 */
const parseArgs = (args) =>
    args.reduce(
        (result, arg) =>
            set(lensProp(argName(arg)), argValue(arg), result)
        , {}
    );

/**
 * The argument name
 * @param {String} arg - argument in the format "arg=val"
 * @returns {String} the name
 */
const argName = (arg) =>
    arg.split("=")[0];

/**
 * The argument value
 * @param {String} arg - argument in the format "arg=val"
 * @returns {String} the value
 */
const argValue = (arg) =>
      arg.split("=")[1];

entry(process.argv.slice(2));
