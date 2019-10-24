"use strict";

import classNames from "classnames";
import * as Fusion from "MPageFusion";
import { runCommand } from "../lib";
import DocPanel from "./DocPanel";

const DetailPanel = Fusion.composite.detailPanel.DetailPanel;
const Button = Fusion.atomic.button.Button;
const HELP_CLICK = "Content::HelpClick";
const PANEL_CLOSE = "Content::PanelClose";


export default class Content extends Fusion.UIComponent {
    initialProps() {
        return {
            content: null,
            pluginName: null,
            pluginId: null,
            showHelp: false
        };
    }

    propChangeHandlers() {
        return {
            content: (content) => this.replaceMappedChild("content", content)
        };
    }

    createChildren() {
        return [
            {
                detailPanel: new DetailPanel({
                    toolbarContent: new Button({
                        display: "Full Screen",
                        label: "Full Screen",
                        type: Button.TYPE.SECONDARY
                    }),
                    bodyContent: new DocPanel()
                })
            },
            {
                helpButton: new Button({
                    display: "Help",
                    type: Button.TYPE.LINK,
                    clickEventName: HELP_CLICK
                })
            }
        ];
    }

    afterCreate() {
        this.on(Button.EVENTS.CLICK, (payload) => {
            this.stopPropagation(Button.EVENTS.CLICK);
            if (payload.getProp("isSelected")) {
                this._state.size = "";
                payload.setProp("isSelected", false);
            }
            else {
                this._state.size = DetailPanel.SIZE.FULL_SCREEN;
                payload.setProp("isSelected", true);
            }
            this.update();
        });

        this.on(HELP_CLICK, () => {
            Promise.all([
                runCommand(
                    "pluginDocs",
                    "uiHtml",
                    { plugin: this.getProp("pluginId")}
                ),
                runCommand(
                    "pluginDocs",
                    "uiMarkdownFile",
                    { plugin: this.getProp("pluginId")}
                )
            ])
            .then(([html, markdownFile]) => {
                this.setState({ isOpen: true });
                this
                    .getChild("detailPanel")
                    .getProp("bodyContent")
                    .setProp("html", html)
                    .setProp("markdownFilePath", markdownFile)
                    .setProp("pluginId", this.getProp("pluginId"))
                    .update();
            });
        });

        this.on(DetailPanel.EVENTS.REQUEST_CLOSE, (panel) => {
            this.setState({ isOpen: false }).update();
        });
    }

    view(el, props, children, mappedChildren, context) {
        return el("div",
            {
                class:
                    classNames({
                        "mpageui-DetailPanelLayout": true,
                        "is-open": this._state.isOpen,
                        [ this._state.size ]: !!this._state.size
                    })
            },
                  [
                      el(
                          "div",
                          { class: "gaia-content mpageui-DetailPanelLayout-content" },
                          [
                              el("div", { class: "mpageui-u-flexgrid-row" }, [
                                  el(
                                      "h1",
                                      { class: "mpageui-u-flexgrid-col "},
                                      props.pluginName
                                  ),
                                  props.showHelp ? mappedChildren.helpButton.render() : []
                              ]),
                              mappedChildren.content ? mappedChildren.content.render() : []
                          ]
                      ),
                      el(
                          "div",
                          { class: "mpageui-DetailPanelLayout-panel" },
                          mappedChildren.detailPanel.render()
                      )
                  ]
        );
    }
}
