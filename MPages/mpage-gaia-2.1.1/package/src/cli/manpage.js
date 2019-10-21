
const man = require("./man");

const json = () =>
      [
          { name: ["gaia - extensible build automation system"] },
          { synopsis: ["npm run gaia plugin[:command] [argument=argumentValue]..."] },
          { description: [
              "Runs a gaia plugin with a specified command. If no command is",
              "provided, runs the default \"run\" command.",
              "",
              `Type ${man.command("npm run gaia help:plugins")} for a list of available plugins.`
          ]},
          { example: [man.command("npm run gaia linter:saveSrcPath srcDir=src/main2")]},
          { "see also": [
              "See the gaia manual for full reference: ",
              man.url("https://github.cerner.com/MPagesEcosystem/mpage-gaia/blob/master/docs/manual.md")
          ]}
      ];

module.exports = {
    json
};
