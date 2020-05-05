const {
    retrieveUiMarkdownAbsoluteFilePath,
    retrieveUiMarkdownFile
} = require("../plugin-manager");
const fs = require("fs");
const showdown = require("showdown");

/**
 * Returns the markdown for the plugin's UI documentation
 * @param {*} gaia gaia context
 * @param {*} args command line arguments
 * @returns {Promise} a promise with the plugin markdown
 */
const uiMarkdown = (gaia, args) =>
    new Promise(
        (resolve, reject) => {
            const file = retrieveUiMarkdownAbsoluteFilePath(args.plugin);
            if (!file) {
                reject(`Could not find markdown UI file for plugin ${args.plugin}`);
                return;
            }
            resolve(fs.readFileSync(file).toString());
        }
    );

/**
 * Returns the html for the plugin's UI documentation
 * @param {*} gaia gaia context
 * @param {*} args command line arguments
 * @returns {Promise} a promise with the plugin markdown
 */
const uiHtml = (gaia, args) =>
    uiMarkdown(gaia, args)
      .then(
          (md) =>
              Promise.resolve(
                  (new showdown.Converter({
                      simplifiedAutoLink: true,
                      tables: true
                  })).makeHtml(md)
              )
      );

/**
 * Returns the relative path to the markdown file for the UI
 * @param {*} gaia gaia context
 * @param {*} args command line args
 * @returns {Promise} promise with the file path
 */
const uiMarkdownFile = (gaia, args) =>
    Promise.resolve(retrieveUiMarkdownFile(args.plugin));

module.exports = {
    id: "pluginDocs",
    commands: {
        uiMarkdown: {
            description: "Returns the markdown for the plugin's UI documentation.",
            args: {
                plugin: "the plugin ID"
            },
            handler: uiMarkdown
        },
        uiMarkdownFile: {
            description: "The relative location of the markdown UI file",
            args: {
                plugin: "the plugin ID"
            },
            handler: uiMarkdownFile
        },
        uiHtml: {
            description: "Returns the html for the plugin's UI documentation.",
            args: {
                plugin: "the plugin ID"
            },
            handler: uiHtml
        }
    }
};
