"use strict";

// TODO: Uncomment when MPageFusion is available
import Root from "./Root";
import "MPageFusion/dist/lib/css/mpage-fusion.css"
import "../styles/App.less";

const MPageFusion = require("MPageFusion");
window.MPageFusion = MPageFusion;

import * as Fusion from "MPageFusion";

const retrievePluginId = (pluginName) =>
    pluginName.substr("gaia-plugin-".length);

window.startApp = (pluginList) => {
    const root = new Root({
        plugins: pluginList
            .filter((plugin) => window[plugin] !== undefined)
            .map((plugin) =>
                 Object.assign(
                     {},
                     window[plugin].default,
                     { id: retrievePluginId(plugin) })
                )
    });

    root.mount("root");
    root.update();
};
