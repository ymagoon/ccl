"use strict";
/**
 * @fileOverview
 * Copy node_module contents to MPAGE_GAIA node_modules directory.
 * @description We dont move the contents to the parent directory since any npm update
 * would essentially wipe out the copied contents since they are not part
 * of the parent's dependency tree.
 */

const cp = require("shelljs").cp;
const path = require("path");
const fs = require("fs");
const GAIA_MODULE = "mpage-gaia";
const GAIA_PACKAGE_JSON = "package.json";
const fileName = "[npm-post-install]";
const getDependencyFolder = dep =>
    path.join(__dirname, "../../", `node_modules/${dep}`);
/**
 * Determines if the mpage-gaia module exists.
 *
 * @private
 * @returns {Promise.<Boolean, Error>}
 */
const doesGaiaExist = () =>
    new Promise((ok, error) =>
        fs.access(
            path.resolve(getDependencyFolder(GAIA_MODULE), GAIA_PACKAGE_JSON),
            fs.constants.F_OK,
            err => (err ? error(err) : ok())
        )
    );
/**
 * Returns a string with message if gaia is not installed
 * @private
 * @returns {undefined} returns nothing
 */
const fail = err => {
  console.error(err);
  console.error(`\nWARN: "${GAIA_MODULE}" has not been installed yet.\n`);
};
/**
 * Copies preset node modules into mpage-gaia node_modules
 * @private
 * @returns {undefined} returns nothing
 */
const copyModules = () => {
  const pwd = path.join(__dirname, "node_modules");
  cp("-R", pwd, path.join(__dirname, "../mpage-gaia"));
  console.info(fileName, "* Copy modules from Preset to Gaia complete");
};

doesGaiaExist()
    .then(copyModules)
    .catch(fail);
