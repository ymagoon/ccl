import * as Fusion from "MPageFusion";

import { rootUrl, staticPath } from "../lib";

/**
 * Checks if the path is a directory candidate
 * @param {String} path the path
 * @returns {boolean} true if directory, false otherwise
 */
const isDir = (path) => path.split("/").length > 1;

/**
 * Extracts the directory name of a path
 * @param {String} path the path
 * @returns {String} the directory
 */
const dirname = (path) =>
    isDir(path) ? path
        .replace(/\\/g, '/')
        .replace(/\/[^/]*\/?$/, '') : "";

/**
 * Creates a full URL that points to a file path that is relative to
 * the folder of markdownFilePath.
 *
 * @param {String} plugin the plugin id
 * @param {String} markdownFilePath path where the root file is
 * @param {String} path the file path, relative to markdownFilePath's folder
 * @returns {String} the normalized file path
 */
const normalizedFilePath = (plugin, markdownFilePath, path) =>
    staticPath(plugin, dirname(markdownFilePath) + "/" + path);

/**
 * Normalizes all the image urls in the html provided so that they point
 * to a file that is accessible from the gaia UI.
 * @param {String} plugin id of the plugin that is hosting the html
 * @param {String} filePath path of a file or folder that is the root of the document
 * @param {String} html the html
 * @returns {String} normalized html
 */
const fixImageUrls = (plugin, filePath, html) =>
    html.replace(
        new RegExp(/(<img.*src=['"])([^'"]*)(['"])/, "g"),
        (all, prefix, image, suffix) =>
            `${prefix}${rootUrl()}${normalizedFilePath(plugin, filePath, image)}${suffix}`
    );

export default class DocPanel extends Fusion.UIComponent {
    initialProps() {
        return {
            html: "",
            pluginId: "",
            markdownFilePath: ""
        };
    }

    view(el, props, children, mappedChildren) {
        return el(
            "div",
            { class: "markdown-body"},
            el.trust(
                fixImageUrls(props.pluginId, props.markdownFilePath, props.html)
            )
        );
    }
}
