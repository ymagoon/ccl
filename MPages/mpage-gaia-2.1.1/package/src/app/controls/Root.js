"use strict";

import * as Fusion from "MPageFusion";
import Content from "./Content";
import { EVENTS } from "../constants/Events";

const TabControl = Fusion.composite.navigation.TabControl;

const STARTUP_TIMEOUT = 1000;

export default class Root extends Fusion.UIComponent {
    constructor(props, children) {
        super(props, children);
        this._plugins = [];
        this._pluginViews = [];
    }

    initialProps() {
        return {
            plugins: []
        };
    }

    propChangeHandlers() {
        return {
            plugins: (plugins) => {
                this._pluginViews = plugins.map(plugin => new Content({
                    pluginName: plugin.label,
                    content: new plugin.control({
                        id: plugin.id
                    }),
                    pluginId: plugin.id,
                    showHelp: plugin.showHelp
                }));
                this._pluginViews.forEach((pluginView, i) => {
                    this.replaceMappedChild(plugins[i].id, pluginView);
                });
                this._plugins = plugins.map(
                    (plugin, i) => ({
                        id: plugin.id,
                        display: plugin.label,
                        view: this._pluginViews[i]
                    })
                );
                this.getChild("tabControl").setProp("content", this._plugins);
            }
        };
    }

    createChildren() {
        return [
            {
                tabControl: new TabControl({
                    orientation: TabControl.ORIENTATION.VERTICAL
                })
            }
        ];
    }

    afterCreate() {
        this.on(EVENTS.TAB_LABEL_CHANGE, ({ id, label, icon }) => {
            this.stopPropagation(EVENTS.TAB_LABEL_CHANGE);

            const pluginIndex = this._plugins.findIndex(plugin => plugin.id === id);

            if (label) {
                this._plugins[pluginIndex].display = label;
            }

            if (icon !== undefined) {
                this._plugins[pluginIndex].leftAccessory = icon;
            }

            this.getChild("tabControl").setProp("content", this._plugins);
            this.update();
        });

        setTimeout(() => {
            this._pluginViews.forEach((pluginView) => {
                pluginView.emitDown(EVENTS.STARTUP);
            });
        }, STARTUP_TIMEOUT);
    }

    view() {
        return this.renderChildren();
    }
}
