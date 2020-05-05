const chalk = require("chalk");

/**
 * Returns the formatted entry title
 * @param {*} entry - single entry in {name:[lines]} format
 * @returns {String} the formatted string
 *
 */
const makeTitle = (entry) =>
    chalk.bold.white(Object.keys(entry)[0].toUpperCase());

/**
 * Adds spaces to the beginning of line
 * @param {String} line - the line
 * @returns {String} line with spaces
 */
const indent = (line) => `       ${line}`;

/**
 * Returns the formatted entry contents
 * @param {*} entry - single entry in {name:[lines]} format
 * @returns {String} the formatted string
 */
const makeContents = (entry) =>
    entry[Object.keys(entry)[0]]
      .map(indent)
      .join("\r\n");

const url = (str) =>
    `<${chalk.blue.underline(str)}>`;

/**
 * Default formatting for an inline command in an entry.
 * @param {String} str - the command
 * @returns {String} the formatted string
 */
const command = (str) =>
    chalk.bold.white(str);

/**
 * Makes the formatted string according to Unix Man standards.
 * @param {*} manJson - an array of entries in {name:[lines]} format
 * @returns {String} the formatted string
 */
const makeString = (manJson) =>
    manJson.reduce(
        (result, entry) =>
            `${result}${makeTitle(entry)}\r\n${makeContents(entry)}\r\n\r\n`,
        ""
    );

/**
 * Displays the formatted man json entry into the console.
 * @param {*} manJson - an array of entries in {name:[lines]} format
 * @returns {undefined}
 */
const show = (manJson) =>
    console.log(makeString(manJson));

module.exports = {
    makeTitle,
    makeContents,
    command,
    indent,
    url,
    makeString,
    show
};
