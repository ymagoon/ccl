const fs = require("fs");
const path = require("path");
const R = require("ramda");
const { PLUGIN_PREFIX, PRESET_PREFIX } = require("./const");

/**
 * Reads the specified file and parses its contents
 * as JSON.
 * @param {String} filePath - the file path
 * @returns {*} the json or empty object if file doesn't exist
 */
const jsonFromFile = (filePath) =>
    JSON.parse(fs.readFileSync(filePath));

/**
 * Gaia's package JSON object
 * @returns {*} the package JSON for Gaia
 */
const gaiaPackageJson = () =>
    jsonFromFile(
        path.resolve(
            __dirname,
            "../../package.json"
        )
    );

/**
 * Returns the package json stored in the current process location.
 * @returns {*} the package json
 */
const retrievePackageJson = () =>
    ((jsonPath) =>
       fs.existsSync(jsonPath)
       ? jsonFromFile(jsonPath)
       : {}
    )(path.join(process.cwd(), "package.json"));

/**
 * The package.json contents of the specified module/package.
 * @param {String} moduleName the name of the package
 * @return {*} package.json parsed in JSON format
 */
const modulePackageJson = (moduleName) =>
    jsonFromFile(
        path.join(moduleRootFolder(moduleName), "package.json")
    );

/**
 * The absolute path for a node module root directory
 * @param {String} module module name
 * @returns {String} the absolute path
 */
const moduleRootFolder = (module) => {
    const fullPath = require.resolve(module);
    return fullPath.substr(
        0,
        fullPath.lastIndexOf(module) + module.length
    );
};

/**
 * All the dependencies listed in dependencies and devDependencies for a
 * package.json JSON.
 * @param {*} json package.json JSON
 * @returns {Array<String>} all dependencies
 */
const packageJsonDependencies = (json) =>
    Object
      .keys(json.dependencies || {})
      .concat(Object.keys(json.devDependencies || {}));

/**
 * Returns all the plugins in the specified package JSON.
 * It will resolve all the package presets to a flat list of plugins.
 * If you want ONLY plugins, without resolving presets, use listPluginsInPackageJson
 * @param {*} json in the package.json format
 * @returns {Array} a list of plugin ids
 */
const listAllPluginsInPackageJson = (json) =>
    listPluginsInPackageJson(json)
      .concat(listPluginsFromPresetsInPackageJson(json));

/**
 * All the plugins in the specified package JSON. This will not do any preset resolution.
 * @param {*} json a package.json JSON object
 * @returns {Array<String>} all the dependencies
 */
const listPluginsInPackageJson = (json) =>
    packageJsonDependencies(json)
      .filter((name) => name.substr(0, PLUGIN_PREFIX.length) == PLUGIN_PREFIX)
      .map((name) => name.substr(PLUGIN_PREFIX.length));

/**
 * Looks for all presets in a package.json object and returns all the plugins contained in
 * those presets.
 * @param {*} json package.json Object
 * @returns {Array<String>} list of plugins
 */
const listPluginsFromPresetsInPackageJson = (json) =>
    R.chain(
        (preset) => listAllPluginsInPackageJson(modulePackageJson(preset)),
        packageJsonDependencies(json)
            .filter((name) => name.substr(0, PRESET_PREFIX.length) == PRESET_PREFIX)
    );

module.exports ={
    retrievePackageJson,
    gaiaPackageJson,
    listAllPluginsInPackageJson,
    moduleRootFolder
};
