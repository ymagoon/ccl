/*extern window, document*/

/**
 * @fileOverview

    <h1>Utility Methods</h1>
    <p>
    These are universal utility methods, designed for speed, size and agnostic browser support. There are several namespaces:
    </p>
    <dl>
        <dt>Util</dt>
        <dd>General Utility methods</dd>
        <dd>Included in util.core.js</dd>
        <dt>Util.EventCache</dt>
        <dd>Object for ensuring proper garbage collection.</dd>
        <dd>Included in util.core.js</dd>
        <dt>Util.Convert</dt>
        <dd>Conversion Utility methods</dd>
        <dd>External module; will be an <strong>empty object</strong> if util.convert.js is not included.</dd>
        <dt>Util.Cookie</dt>
        <dd>Cookie Management Utility methods</dd>
        <dd>External module; will be an <strong>empty object</strong> if util.cookie.js is not included.</dd>
        <dt>Util.Detect</dt>
        <dd>Detection Utility methods</dd>
        <dd>External module; will be an <strong>empty object</strong> if util.detect.js is not included.</dd>
        <dt>Util.i18n</dt>
        <dd>Internationalization (i18n) Utility methods</dd>
        <dd>External module; will be an <strong>empty object</strong> if util.i18n.js is not included.</dd>
        <dt>Util.Load</dt>
        <dd>DOM-Loaded event Utility methods</dd>
        <dd>External module; will be an <strong>empty object</strong> if util.load.js is not included.</dd>
        <dt>Util.Pos</dt>
        <dd>Positioning Utility methods</dd>
        <dd>External module; will be an <strong>empty object</strong> if util.pos.js is not included.</dd>
        <dt>Util.Style</dt>
        <dd>CSS Utility methods</dd>
        <dd>External module; will be an <strong>empty object</strong> if util.style.js is not included.</dd>
        <dt>Util.Timeout</dt>
        <dd>Session Management methods</dd>
        <dd>External module; will be an <strong>empty object</strong> if util.timeout.js is not included.</dd>
    </dl>
    <h2>Notes</h2>
    <p>All modules are aggregated together by Maven into a single file, util.js.</p>
    <p>Validated with JSLint.</p>
 */

/**
 * Returns an element based on the id provided, <code>null</code> if no element exists.
 * @param {String} i The id.
 * @return {Node} An element with the id specified, <code>null</code> if no such element exists.
 * @static
 * @global
 * @fullname Get Element By ID
 */
function _g(i) {
    return document.getElementById(i);
}

/**
 * Returns all elements from within the specified context matching the tag name provided, <code>null</code> if no
 * elements exist.
 * @param {String} t The tag name.
 * @param {Node} [e] The element to search within. Defaults to the document body.
 * @return {array} An array of elements with the tag name specified, <code>null</code> if no elements exist.
 * @static
 * @global
 * @fullname Get Elements By Tag Name
 */
function _gbt(t, e) {
    e = e || document;
    return e.getElementsByTagName(t);
}

/**
 * Utility methods
 * @namespace Util
 * @static
 * @global
 */
var Util = function () {

    var _e = [], _d = document, _w = window;

    return {
        /**
         * The Event Cache makes it possible to ensure all events attached to the DOM or browser instances are
         * properly "flushed away" after the page is unloaded. This prevents memory leaks in some implementations.
         *
         * @property
         * @memberof Util
         * @name EventCache
         */
        EventCache : function () {
            var l = [];
            return {

                /**
                 * Add an event to the Event Cache.
                 * @param {Node} o The element or object to which the event is attached.
                 * @param {String} e The event name, e.g. "click" or "mouseover".
                 * @param {Function} f The function attached.
                 *
                 * @static
                 * @function
                 * @memberof Util.EventCache
                 * @name add
                 */
                add : function (o, e, f) {
                    l.push(arguments);
                },

                /**
                 * Remove an event from the Event Cache.
                 * @param {Node} o The element or object to which the event is attached.
                 * @param {String} e The event name, e.g. "click" or "mouseover".
                 * @param {Function} f The function to detach.
                 *
                 * @static
                 * @function
                 * @memberof Util.EventCache
                 * @name remove
                 */
                remove : function (o, e, f) {
                    var n;
                    for (var i = l.length - 1; i >= 0; i = i - 1) {
                        if (o == l[i][0] && e == l[i][1] && f == l[i][2]) {
                            n = l[i];
                            if (n[0].removeEventListener) {
                                n[0].removeEventListener(n[1], n[2], n[3]);
                            }
                            else if (n[0].detachEvent) {
                                if (n[1].substring(0, 2) != "on") {
                                    n[1] = "on" + n[1];
                                }
                                n[0].detachEvent(n[1], n[0][e + f]);
                            }
                        }
                    }
                },

                /**
                 * Remove all events from the Cache.
                 *
                 * @static
                 * @function
                 * @memberof Util.EventCache
                 * @name flush
                 */
                flush : function () {
                    var e;
                    for (var i = l.length - 1; i >= 0; i = i - 1) {
                        var o = l[i];
                        if (o[0].removeEventListener) {
                            o[0].removeEventListener(o[1], o[2], o[3]);
                        }
                        e = o[1];
                        if (o[1].substring(0, 2) != "on") {
                            o[1] = "on" + o[1];
                        }
                        if (o[0].detachEvent) {
                            o[0].detachEvent(o[1], o[2]);
                            if (o[0][e + o[2]]) {
                                o[0].detachEvent(o[1], o[0][e + o[2]]);
                            }
                        }
                    }
                }
            };
        }(),

        /**
         * Creates an element within the document, without a parent, as if by <code>document.createElement</code>. This method
         * has better performance, as it caches instances of created objects and clones them, rather than manipulate the
         * document directly.
         * @param {String} t The tag name of the element to create.
         * @return {Node} A new element.
         *
         * @static
         * @function
         * @memberof Util
         * @name ce
         * @fullname Create Element
         */
        ce : function (t) {
            var a = _e[t];
            if (!a) {
                a = _e[t] = _d.createElement(t);
            }
            if (!a) {
                return null;
            }
            else {
                return a.cloneNode(false);
            }
        },

        /**
         * Creates an element within the document, without a parent, as if by <code>document.createElement</code>. Any
         * given properites will then be set onto the newly created element. This method has better performance, as it
         * caches instances of created objects and clones them, rather than manipulate the document directly.
         * @param {String} t The tag name of the element to create.
         * @param {Object} [p] The properties to set onto the created element, (e.g. <code>{ "href" : "index.html", "name" : "theName"}</code>).
         * @return {Node} A new element.
         * 
         * @static
         * @function
         * @memberof Util
         * @name cep
         * @fullname Create Element with Properties
         */
        cep : function (t, p) {
            var e = this.ce(t);
            return this.mo(e, p);
        },

        /**
         * Merges two option objects.
         * @param {Object} o1 The option object to be modified.
         * @param {Object} o2 The option object containing properties to be copied.
         * @param {Boolean} d True if properties on o1 should be immutable, false otherwise.
         * @return {Object} An object containing properties.
         *
         * @static
         * @function
         * @memberof Util
         * @name mo
         * @fullname Merge Objects
         */
        mo : function (o1, o2, d) {
            o1 = o1 || {};
            o2 = o2 || {};
            var p;
            for (p in o2) {
                if (p) {
                    o1[p] = (o1[p] === undefined) ? o2[p] : !d ? o2[p] : o1[p];
                }
            }
            return o1;
        },

        /**
         * Deletes an element from the DOM.
         * @param {Node} e The element to delete.
         *
         * @static
         * @function
         * @memberof Util
         * @name de
         * @fullname Delete Element
         */
        de : function (e) {
            if (e) {
                this.gp(e).removeChild(e);
            }
        },

        /**
         * Universal event-bubbling cancel method.
         * @param {event} e The event object, (not required in IE).
         *
         * @static
         * @function
         * @memberof Util
         * @name cancelBubble
         * @fullname Cancel Event Bubble
         */
        cancelBubble : function (e) {
            e = _w.event || e;
            if (!e) {
                return;
            }

            if (e.stopPropagation) {
                e.stopPropagation();
            }
            else {
                e.cancelBubble = true;
            }
        },

        /**
         * Universal event default behavior prevention method.
         * @param {event} e The event object, (not required in IE).
         *
         * @static
         * @function
         * @memberof Util
         * @name preventDefault
         * @fullname Prevent Default Behavior
         */
        preventDefault : function (e) {
            e = _w.event || e;

            if (!e) {
                return;
            }

            if (e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }
        },

        /**
         * Returns the an element's offset values, traversing the tree for an accurate value.
         * @param {Node} e The element to evaluate.
         * @return {array} The offset left and offset top, in pixels, in the form of [left, top].
         *
         * @static
         * @function
         * @memberof Util
         * @name goff
         * @fullname Get Element Offset Values
         */
        goff : function (e) {
            var l = 0, t = 0;
            if (e.offsetParent) {
                while (e.offsetParent) {
                    l += e.offsetLeft;
                    t += e.offsetTop;
                    e = e.offsetParent;
                }
            }
            else if (e.x || e.y) {
                l += e.x || 0;
                t += e.y || 0;
            }
            return [l, t];
        },

        /**
         * Returns an accurate parent node; Some browsers will return a Text Node.
         * @param {Node} e The element to evaluate.
         * @return {Node} The actual parent node.
         *
         * @static
         * @function
         * @memberof Util
         * @name gp
         * @fullname Get Parent
         */
        gp : function (e) {
            if (!e.parentNode) {
                return e;
            }
            e = e.parentNode;
            while (e.nodeType === 3 && e.parentNode) {
                e = e.parentNode;
            }
            return e;
        },

        /**
         * Some browsers will return a Text Node, so this method returns an accurate child node.
         * @param {Node} e The element to evaluate.
         * @param {int} [i] The child node index, default is 0.
         * @return {Node} The actual child node.
         *
         * @static
         * @function
         * @memberof Util
         * @name gc
         * @fullname Get Child Node
         */
        gc : function (e, i) {
            i = i || 0;
            var j = -1;

            if (!e.childNodes[i]) {
                return null;
            }

            e = e.childNodes[0];
            while (e && j < i) {
                if (e.nodeType === 1) {
                    j++;
                    if (j === i) {
                        break;
                    }
                }
                e = this.gns(e);
            }
            return e;
        },

        /**
         * For a given node, returns a list of children of NODETYPE 1, (Element).
         * @param {Node} e The node to evaluate.
         * @return {array} A collection of child nodes.
         *
         * @static
         * @function
         * @memberof Util
         * @name gcs
         * @fullname Get All Child Nodes
         */
        gcs : function (e) {

            var r = [], es = e.childNodes;
            for (var i = 0; i < es.length; i++) {
                var x = es[i];
                if (x.nodeType === 1) {
                    r.push(x);
                }
            }
            return r;
        },

        /**
         * Returns an accurate next sibling node; Some browsers will return a Text Node.
         * @param {Node} e The element to evaluate.
         * @return {Node} The actual next sibling node.
         *
         * @static
         * @function
         * @memberof Util
         * @name gns
         * @fullname Get Next True Sibling
         */
        gns : function (e) {
            var a = e.nextSibling;
            while (a && a.nodeType !== 1) {
                a = a.nextSibling;
            }
            return a;
        },

        /**
         * Returns an accurate previous sibling node; Some browsers will return a Text Node.
         * @param {Node} e The element to evaluate.
         * @return {Node} The actual previous sibling node.
         *
         * @static
         * @function
         * @memberof Util
         * @name gps
         * @fullname Get Previous True Sibling
         */
        gps : function (e) {
            var a = e.previousSibling;
            while (a && a.nodeType !== 1) {
                a = a.previousSibling;
            }
            return a;
        },

        /**
         * Appends a child to the specified node.
         * @param {Node} e The element to append.
         * @param {Node} p The new parent node.
         * @return {Node} The appended element.
         *
         * @static
         * @function
         * @memberof Util
         * @name ac
         * @fullname Append Child
         */
        ac : function (e, p) {
            p.appendChild(e);
            return e;
        },

        /**
         * Insert a node after a specified node.
         * @param {Node} nn The new node to insert.
         * @param {Node} rn The reference node for insertion.
         *
         * @static
         * @function
         * @memberof Util
         * @name ia
         * @fullname Insert After
         */
        ia : function (nn, rn) {
            var p = Util.gp(rn), n = Util.gns(rn);
            if (n) {
                p.insertBefore(nn, n);
            }
            else {
                Util.ac(nn, p);
            }
        },

        /**
         * Adds a Javscript event to the given element with full browser compatiblity and plugs for any memory leaks.
         * @param {Node} o The object receiving the event.
         * @param {String} e The event name to attach.
         * @param {Function} f The function to run when the event is invoked.
         *
         * @static
         * @function
         * @memberof Util
         * @name addEvent
         * @fullname Add Javascript Event
         */
        addEvent : function (o, e, f) {

            function ae(obj, evt, fnc) {
                if (!obj.myEvents) {
                    obj.myEvents = {};
                }

                if (!obj.myEvents[evt]) {
                    obj.myEvents[evt] = [];
                }

                var evts = obj.myEvents[evt];
                evts[evts.length] = fnc;
            }

            function fe(obj, evt) {

                if (!obj || !obj.myEvents || !obj.myEvents[evt]) {
                    return;
                }

                var evts = obj.myEvents[evt];

                for (var i = 0, len = evts.length; i < len; i++) {
                    evts[i]();
                }
            }

            if (o.addEventListener) {
                o.addEventListener(e, f, false);
                Util.EventCache.add(o, e, f);
            }
            else if (o.attachEvent) {
                o["e" + e + f] = f;
                o[e + f] = function () {
                    o["e" + e + f](window.event);
                };
                o.attachEvent("on" + e, o[e + f]);
                Util.EventCache.add(o, e, f);
            }
            else {
                ae(o, e, f);
                o['on' + e] = function () {
                    fe(o, e);
                };
            }
        },

        /**
         * Remove a Javscript event from the given element with full browser compatiblity and plugs for any memory leaks.
         * @param {Node} o The object honoring the event.
         * @param {String} e The event name.
         * @param {Function} f The function to remove.
         *
         * @static
         * @function
         * @memberof Util
         * @name removeEvent
         * @fullname Remove Javascript Event
         */
        removeEvent : function (o, e, f) {
            Util.EventCache.remove(o, e, f);
        },

        /**
        * Uses the native browser window object to create a new window.
        * <p>
        * <strong>NOTE:</strong> This method will utilize DOM methodology only <em>truly</em> supported by desktop
        * browsers. While some mobile browsers may allow this call, most will not. Use with caution, in specific use
        * cases.
        * </p>
        *
        * @param {String} u The url of the popup to open.
        * @param {String} n The name of the popup window.
        * @param {Object} [o The object params. If an object is not provided, the browser defaults will be used.
        * @param {String} [o.lb]  Include location bar, (default is true).
        * @param {String} [o.mb] Include menu bar, (default is true).
        * @param {String} [o.rz] Allow resize, (default is true).
        * @param {String} [o.scb] Include scrollbars, (default is true).
        * @param {String} [o.stb] Include status bar, (default is true).
        * @param {String} [o.tb] Include toolbar, (default is true).
        * @param {int} [o.w] The value for the width of the popup window.
        * @param {int} [o.h] The value for the height of the popup window.
        * @param {int} [o.tp] The value for top. (NOT SUPPORTED YET)
        * @param {int} [o.lft] The value for the left position of the popup. (NOT SUPPORTED YET)
        * @param {int} [o.sx] The screen x value. (NOT SUPPORTED YET)
        * @param {int} [o.sy] The screen y value. (NOT SUPPORTED YET)
        * @param {String} [o.dp] The value for the dependent popup property (yes or no). (NOT SUPPORTED YET)
        * @param {String} [o.dr] The value for the directories property (yes or no). (NOT SUPPORTED YET)
        * @param {String} [o.fs] The value for the fullscreen property (yes or no). (NOT SUPPORTED YET)
        * @return <code>True</code> if the window popup was successful, <code>false</code> otherwise or if the client
        * does not support popup windows.
        *
        * @static
        * @function
        * @memberof Util
        * @name popup
        * @fullname Popup New Window
        */
        popup : function (u, n, o) {
            if (!window.open) {
                return false;
            }

            var d = {
                w : screen.width,
                h : screen.height,
                rz : true,
                mb : true,
                scb : true,
                stb : true,
                tb : true,
                lb : true,
                tp : null,
                lft : null,
                sx : null,
                sy : null,
                dp : "no",
                dr : "no",
                fs : "no"
            };

            function f(n, v)
            {
                if (!v) {
                    return "";
                }
                return n + '=' + v + ',';
            }

            function fs() {
                o = o || {};
                var p, n = {};
                for (p in d) {
                    if (p) {
                        n[p] = o[p] !== undefined ? o[p] : d[p];
                    }
                }
                return n;
            }

            o = fs();
            var p = f("dependent", o.dp) + f("directories", o.dr) + f("fullscreen", o.fs) + f("location", o.lb ? 1 : 0) + f("menubar", o.mb) + f("resizable", o.rz ? 1 : 0) + f("scrollbars", o.scb ? 1 : 0) + f("status", o.stb ? 1 : 0) + f("toolbar", o.tb ? 1 : 0) + f("top", o.tp) + f("left", o.lft) + f("width", o.w) + f("height", o.h) + f("screenX", o.sx) + f("screenY", o.sy);
            p = p.substring(0, p.length - 1);
            var nw = window.open(u, n, p);
            window.blur();

            if (nw.focus) {
                nw.focus();
            }

            return true;
        },
        Convert : {},
        Cookie : {},
        Detect : {},
        i18n : {},
        Load : {},
        Pos : {},
        Style : {},
        Timeout : {}
    };
}();

/**
 * Insert a node after a specified node.
 * @param {Node} nn The new node to insert.
 * @param {Node} rn The reference node for insertion.
 *
 * @deprecated
 * @static
 * @global
 */
function insertAfter(nn, rn) {
    Util.ia(nn, rn);
}

Util.addEvent(window, 'unload', Util.EventCache.flush);

/*extern Util*/

/**
 * @fileOverview
 *
 * <h1>Browser Detection Utility module and namespace</h1>
 * <p>This module assists with properly detecting rendering engines and browsers.</p>
 * <h2>Usage</h2>
 * <p>Import this file <em>after</em> util.core.js.</p>
 * <h2>Warning</h2>
 * <p>These should ONLY be used to avoid browser-specific bugs, and then only as a last resort!</p>
 */

/**
 * Detection Utility methods.
 * @namespace Util.Detect
 * @global
 * @static
 */
Util.Detect = function () {

    return {
        /**
         * Returns <code>true</code> if the browser uses the Gecko rendering engine,
         * which is used in Firefox, Camino and other minor browsers, <code>false</code> otherwise.
         * <p>
         * <strong>NOTE:</strong> This method uses the proprietary <code>navigator.product</code> attribute
         * specific to Gecko-based browsers; it will not return a version number. Gecko 1.9 is due to be released
         * with Firefox 3.
         * </p>
         * @return {Boolean} <code>True</code> if the browser uses the Gecko rendering engine, <code>false</code>
         * otherwise.
         *
         * @static
         * @function
         * @memberof Util.Detect
         * @name gecko
         * @fullname Detect Gecko
         */
        gecko : function () {
            return navigator.product === "Gecko";
        },

        /**
         * Returns <code>true</code> if the browser seems to use the WebKit rendering engine,
         * which is used in Safari and other minor browsers, <code>false</code> otherwise.
         * <p>
         * <strong>NOTE:</strong> This method will return true if the browser has a compatible User
         * Agent string. This is not a <em>guaranteed</em> method of detection.
         * </p>
         * @return {Boolean} <code>True</code> if the browser seems to use WebKit, <code>false</code>
         * otherwise.
         *
         * @static
         * @function
         * @memberof Util.Detect
         * @name webkit
         * @fullname Detect WebKit
         */
        webkit : function () {
            return new RegExp(" AppleWebKit/").test(navigator.userAgent);
        },

        /**
         * Returns <code>true</code> if the browser seems to use the WebKit rendering engine
         * <strong>and</strong> indicates it is a mobile device, such as the iPhone,
         * <code>false</code> otherwise.
         * <p>
         * <strong>NOTE:</strong> This method will return true if the browser has a compatible User
         * Agent string. This is not a <em>guaranteed</em> method of detection.
         * </p>
         * @return {Boolean} <code>True</code> if the browser seems to use mobile WebKit,
         * <code>false</code> otherwise.
         *
         * @static
         * @function
         * @memberof Util.Detect
         * @name webkitmob
         * @fullname Detect Mobile WebKit
         */
        webkitmob : function () {
            if (this.webkit() && new RegExp(" Mobile/").test(navigator.userAgent)) {
                var f = new RegExp("(Mozilla/5.0 \\()([^;]+)").exec(navigator.userAgent);
                return (!f || f.length < 3);
            }
        },

        /**
         * Returns <code>true</code> if the browser resembles IE6 or earlier, <code>false</code> otherwise.
         * <p><strong>NOTE:</strong> This method will return true if the browser has similar inequities in terms of capability,
         * and could therefore return <code>true</code> if used in a browser with similar lack of functionality.</p>
         * @return {Boolean} <code>True</code> if the browser resembles IE6 or earlier, <code>false</code> otherwise.
         *
         * @static
         * @function
         * @memberof Util.Detect
         * @name ie6
         * @fullname Detect Internet Explorer v6.
         */
        ie6 : function () {
            return typeof document.all !== "undefined" && typeof window.XMLHttpRequest === "undefined" && typeof document.body.style.maxWidth === "undefined";
        }
    };
}();

/*extern Util*/

/**
 * @fileOverview
 *
 * <h1>Internationalization Utility module and namespace</h1>
 * <p>This module assists with creating and using i18n strings supplied by the server.</p>
 * <h2>Usage</h2>
 * <p>Import this file <em>after</em> util.core.js.</p>
 */

/**
 * Internationalization (i18n) Namespace.
 * @namespace Util.i18n
 * @global
 * @static
 */
Util.i18n = function () {
    var _i = {};

    /**
     * Function: Update i18n.
     * @param {String} n Namespace.
     * @param {Object} o An object containing i18n strings by property name.
     * @private
     */
    function fu(n, o) {
        var b = _i[n] || {};
        _i[n] = Util.mo(b, o, true);
    }

    // Prepare the public API.
    return {

        /**
         * Set i18n strings to a namespace.  For example, a namespace by name "NS" which contains the strings
         * "string1" and "string2" could be added by calling
         * <code>Util.i18n.add("NS", { s1 : "string1", s2 : "string2" };</code>
         * <p><strong>NOTE:</strong> This implementation will not, by design, support overriding existing i18n strings.</p>
         * @param {String} n Namespace.
         * @param {Object} o An object containing i18n strings by property name.
         * @return {Object} The full object of i18n strings associated with the provided Namespace.
         *
         * @static
         * @function
         * @memberof Util.i18n
         * @name set
         * @fullname Set i18n Namespace
         */
        set : function (n, o) {
            if(!n) {
                return null;
            }

            fu(n, o);
            return _i[n];
        },

        /**
         * Set a single i18n string to a namespace.  For example, a namespace by name "NS" which contains the string
         * "string1" under the key "s1" could be added by calling.
         * <code>Util.i18n.add("NS", "s1", "string1");</code>
         * <p><strong>NOTE:</strong> This implementation will not, by design, support overriding existing i18n strings.</p>
         * @param {String} n Namespace.
         * @param {String} k Key.
         * @param {String} s String.
         * @return {Object} The full object of i18n strings associated with the provided Namespace.
         *
         * @static
         * @function
         * @memberof Util.i18n
         * @name setString
         * @fullname Set String
         */
        setString : function (n, k, s) {
            if(!n || !k) {
                return null;
            }

            s = s || "";
            var o = {};
            o[k] = s;
            fu(n, o);
            return _i[n];
        },

        /**
         * Retrieve an object containing i18n strings from a particular namespace.
         * @param {String} n Namespace.
         * @return {Object} An object containing keys corresponding to a particular namespace, an empty object if the
         * namespace has not been defined.
         *
         * @static
         * @function
         * @memberof Util.i18n
         * @name get
         * @fullname Get i18n Namespace
         */
        get : function (n) {
            return _i[n] || {};
        },

        /**
         * Retrieve a specific string from a particular namespace.
         * @param {String} n Namespace.
         * @param {String} k Key.
         * @return {String} The corresponding String, or an empty String if there is no entry for the given key in the
         * given namespace.
         *
         * @static
         * @function
         * @memberof Util.i18n
         * @name getString
         * @fullname Get String
         */
        getString : function (n, k) {
            return this.get(n)[k] || "";
        },

        /**
         * Retreive a list of active namespaces within the i18n space.
         *
         * @static
         * @function
         * @memberof Util.i18n
         * @name getNamespaces
         * @fullname Get Namespaces
         */
        getNamespaces : function() {
            var n = [], a = 0, i;
            for(i in _i) {
                n[a++] = i;
            }
            return n;
        }
    };
}();

/*extern _g, _gbt, Util*/

/**
 * @fileOverview
 *
 * <h1>Loading Utility module and namespace</h1>
 * <p>This module assists with properly detecting when the DOM is prepared and the page is loaded.</p>
 * <h2>Usage</h2>
 * <p>Import this file <em>after</em> util.core.js.</p>
 */

/**
 * Page Loading Utility methods.
 * @namespace Util.Load
 * @global
 * @static
 */
Util.Load = function () {
    var U = Util, c = false, e = [], d = document, w = window, t, s, l, rs, dm, am, sc = U.ce("LINK");

    if (sc) {
        sc.rel = "script";
        sc.href = "javascript:void(0);";
        sc.id = "__onload";
        _gbt("HEAD")[0].appendChild(sc);
        s = _g("__onload");
    }

    /**
     * Loaded function.
     * @private
     */
    l = function () {

        // kill the timer
        if (t) {
            clearInterval(t);
            t = null;
        }

        // execute each function in the stack in the order they were added
        for (var i = 0; i < e.length; i++) {
            e[i].call(this);
        }

        // detach all detection methods
        dm();
        e = [];
        c = true;
    };

    /**
     * Ready State detection for those browsers that support it.
     */
    rs = function () {
        if (/loaded|complete/.test(d.readyState)) {
            l();
        }
    };

    dm = function () {
        var r = U.removeEvent;
        clearInterval(t);
        r(w, "load", l);
        r(d, "DOMContentLoaded", l);

        if (sc) {
            r(sc, "readystatechange", rs);
        }
    };

    am = function () {
        var a = U.addEvent;
        a(w, "load", l);
        a(d, "DOMContentLoaded", l);

        if (sc) {
            a(sc, "readystatechange", rs);
        }

        if (d.readyState) {
            t = setInterval(function () {
                rs();
            }, 10);
        }
    };
    am();

    return {

        /**
         * Add an event to the window load queue.  If the window has already reached a complete state, the
         * method is invoked immediately.
         * @param {Object} f The function to add to the queue.
         *
         * @static
         * @function
         * @memberof Util.Load
         * @name add
         * @fullname Add Load Event
         */
        add : function (f) {
            if (c) {
                if (U.Detect.webkit()) {
                    setTimeout(f, 1);
                }
                else {
                    f.call();
                }
                return;
            }
            e.push(f);
        }
    };
}();

/*extern Util*/

/**
 * @fileOverview
 *
 * <h1>Positioning Utility module and namespace</h1>
 * <p>This module assists with properly determining object position.</p>
 * <h2>Usage</h2>
 * <p>Import this file <em>after</em> util.core.js.</p>
 */

/**
 * Positioning Utility methods.
 * @namespace Util.Pos
 * @global
 * @static
 */
Util.Pos = function () {

    return {
        /**
         * Returns the actual scrolled offset within the window.
         * @return {array} A Javascript array containing the distance scrolled within the window as [top distance, left distance].
         *
         * @static
         * @function
         * @memberof Util.Pos
         * @name
         * @fullname Get Scrolled Offset
         */
        gso : function () {
            var d = document, b = d.body, w = window, e = d.documentElement, et = e.scrollTop, bt = b.scrollTop, el = e.scrollLeft, bl = b.scrollLeft;
            if (typeof w.pageYOffset === "number") {
                return [w.pageYOffset, w.pageXOffset];
            }
            if (typeof et === "number") {
                if (bt > et || bl > el) {
                    return [bt, bl];
                }
                return [et, el];
            }
            return [bt, bl];
        },

        /**
         * Returns an array of offset parameters for a given element.
         * @param {Node} e The element to evaluate. If null, undefined or invalid, zeroed offsets are returned.
         * @return {array} A Javascript array of the given element's offsets, relative to any scrolled distance within the window,
         * indexed as [top, left, height, width].  The array will be zeroed out if the element provided is invalid.
         *
         * @static
         * @function
         * @memberof Util.Pos
         * @name goo
         * @fullname Get Object Offsets
         */
        goo : function (e) {
            if (e) {
                return [e.offsetTop, e.offsetLeft, e.offsetHeight, e.offsetWidth];
            }
            return [0, 0, 0, 0];
        },

        /**
         * Returns the true position of a given object by parsing the offset tree.
         * @param {Node} e The DOM element.
         * @return {array} A Javascript array containing the "true" top and left of the given element indexed as [top, left].  The
         * array will be zeroed out if the element provided is invalid.
         *
         * @static
         * @function
         * @memberof Util.Pos
         * @name gop
         * @fullname Get Object Position
         */
        gop : function (e) {
            var l = 0, t = 0;
            if (e.offsetParent)
            {
                l = e.offsetLeft;
                t = e.offsetTop;
                e = e.offsetParent;
                while (e)
                {
                    l += e.offsetLeft;
                    t += e.offsetTop;
                    e = e.offsetParent;
                }
            }
            return [t, l];
        },

        /**
         * Returns an array of size characteristics for the viewport.
         * @return {array} The size of the viewport as a Javascript array, indexed as [height, width].
         *
         * @static
         * @function
         * @memberof Util.Pos
         * @name gvs
         * @fullname Get Viewport Size
         */
        gvs : function () {
            var n = window, d = document, b = d.body, e = d.documentElement;
             // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
            if (typeof n.innerWidth !== 'undefined') {
                return [n.innerHeight, n.innerWidth];
            }
            // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
            else if (typeof e !== 'undefined' && typeof e.clientWidth !== 'undefined' && e.clientWidth !== 0) {
                return [e.clientHeight, e.clientWidth];
            }
            // older versions of IE
            else {
                return [b.clientHeight, b.clientWidth];
            }
        }
    };
}();


/*extern _gbt, Util*/

/**
 * @fileOverview
 *
 * <h1>CSS Utility module and namespace</h1>
 * <p>This module assists with managing CSS selectors and classnames.</p>
 * <h2>Usage</h2>
 * <p>Import this file <em>after</em> util.core.js.</p>
 */

/**
 * Style Utility methods.
 * @namespace Util.Style
 * @global
 * @static
 */
Util.Style = function () {

    return {
        /**
         * Indicates if an element has been applied with a single given CSS Classname.
         * @param {Node} e The element to evaluate.
         * @param {String} c The single CSS Classname to check.
         * @return {Boolean} True if the classname contains the given class, false otherwise.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name ccss
         * @fullname Contains CSS Class
         */
        ccss : function (e, c) {
            if (typeof(e.className) === 'undefined' || !e.className) {
                return false;
            }
            var a = e.className.split(' ');
            for (var i = 0, b = a.length; i < b; i++) {
                if (a[i] === c) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Adds a given CSS Classname to the given element.
         * @param {Node} e The element to evaluate.
         * @param {String} c The classname to apply.
         * @return {Node} The element with the CSS Classname applied.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name acss
         * @fullname Add CSS Class
         */
        acss : function (e, c) {
            if (this.ccss(e, c)) {
                return e;
            }
            e.className = (e.className ? e.className + ' ' : '') + c;
            return e;
        },

        /**
         * Removes a given CSS Classname from the given element.
         * @param {Node} e The element to evaluate.
         * @param {String} c The classname to remove.
         * @return {Node} The element, with the CSS Classname removed.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name rcss
         * @fullname Remove CSS Class
         */
        rcss : function (e, c) {
            if (!this.ccss(e, c)) {
                return e;
            }
            var a = e.className.split(' '), d = "";
            for (var i = 0, b = a.length; i < b; i++) {
                var f = a[i];
                if (f !== c) {
                    d += d.length > 0 ? (" " + f) : f;
                }
            }
            e.className = d;
            return e;
        },

        /**
         * Toggles a given CSS Classname on a given element.
         * @param {Node} e The element to evaluate.
         * @param {String} c The classname to toggle.
         * @return {Boolean} True if the element now contains the classname, false if it was removed.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name tcss
         * @fullname Toggle CSS Class
         */
        tcss : function (e, c) {
            if (this.ccss(e, c)) {
                this.rcss(e, c);
                return false;
            }
            else {
                this.acss(e, c);
                return true;
            }
        },

        /**
         * Clears any opacity setting back to whatever is defined in CSS.
         * @param {Node} e The element whose opacity setting should be reset.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name co
         * @fullname Clear Opacity
         */
        co : function (e) {
            e.style.MozOpacity = "";
            e.style.opacity = "";
            e.style.filter = "";
        },

        /**
         * Returns an array of elements with the designated classname.
         * @param {String} c The CSS classname.
         * @param {Node} [e] The parent element to search within, defaults to document.
         * @param {String} [t] The tagname to scope the results, defaults to all tags.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name g
         * @fullname Get Elements by Classname
         */
        g : function (c, e, t) {
            e = e || document;
            t = t || '*';
            var ns = [], es = _gbt(t, e), l = es.length;
            for (var i = 0, j = 0; i < l; i++) {
                if (this.ccss(es[i], c)) {
                    ns[j] = es[i];
                    j++;
                }
            }
            return ns;
        }
    };
}();

/*extern _gbt, Util, Ajax*/

/**
 * @fileOverview
 *
 * <h1>Session Timeout Utility module and namespace</h1>
 * <p>This module assists with warning the user if their session is about to time out.</p>
 * <h2>Usage</h2>
 * <p>Import this file <em>after</em> util.core.js.</p>
 */

/**
 * Session and Timeout Management Utility
 * @namespace Util.Timeout
 * @global
 * @static
 */
Util.Timeout = function () {

    // Create the defaults.
    var _d = {
        "duration" : 5,
        "restart" : true,
        "confirm" : false,
        "namespace" : "Timeout",
        "key" : "Warning",
        "warning" : "",
        "url" : null
    }, _o = _d, _t;

    function fs(o) {
        var p, n = {};
        for (p in _o) {
            if (p) {
                n[p] = o[p] !== undefined ? o[p] : _o[p];
            }
        }
        return n;
    }

    function fe(e) {
        var s = _gbt("SCRIPT", e);
        for (var i = 0; i < s.length; ++i) {
            eval(s[i].innerHTML);
        }
    }

    function fr(t) {
        if (t && t.length > 0) {
            var d = Util.ce("DIV"), y = d.style;
            y.position = "absolute";
            y.visibility = "hidden";
            Util.ac(d, document.body);
            d.innerHTML = t;
            fe(d);
        }
    }

    function fst() {
        if (!_o.url) {
            return;
        }

        _t = setTimeout(fc, (_o.duration * 60 * 1000));
    }

    function fc() {
        var s = _o.warning.length > 0 ? _o.warning : Util.i18n.getString(_o.namespace, _o.key);
        
        if (_o.confirm && confirm(s)) {
            Ajax.load(_o.url, fr);
        }
        else {
            Ajax.load(_o.url, fr);
        }

        if(_o.restart) {
            fst();
        }
    }

    // Prepare the public API.
    return {
        /**
         * Sets up the
         * @param {String} u The url of a session enforcement action, (cannot be <code>null</code> or
         * <code>undefined</code>.
         * @param {Object} [o] options
         * @param {Object} [o.duration] The duration of the timeout in minutes, (default is <code>5</code>).
         * @param {Object} [o.restart] Indicates if the timer should be restarted after the user interacts with the message, (default is <code>true</code>).
         * @param {Object} [o.confirm] Indicates if the popup should be a <code>confirm</code> versus a simple <code>alert</code>, (default is <code>false</code>).
         * @param {Object} [o.namespace] The i18n namespace containing the message, (default is <code>"Timeout"</code>).
         * @param {Object} [o.key] The i18n key containing the message, , (default is <code>"Warning"</code>).
         * @param {Object} [o.warning] The warning text to display. If set, the i18n namespace and key will be ignored.
         *
         * @static
         * @function
         * @memberof Util.Timeout
         * @name setup
         */
        setup : function (u, o) {
            if (!u) {
                return;
            }

            o.url = u;
            _o = fs(o);
        },

        /**
         * Reset this object to its default configuration.
         *
         * @static
         * @function
         * @memberof Util.Timeout
         * @name reset
         */
        reset : function () {
            _o = _d;
        },

        /**
         * Start the Timeout countdown.
         *
         * @static
         * @function
         * @memberof Util.Timeout
         * @name start
         */
        start : function () {
            fst();
        },

        /**
         * Stop the Timeout countdown.
         *
         * @static
         * @function
         * @memberof Util.Timeout
         * @name cancel
         */
        cancel : function () {
            clearTimeout(_t);
        }
    };
}();

/*extern Util*/

/**
 * @fileOverview
 *
 * <h1>Unit Conversion Utility module and namespace</h1>
 * <p>This module assists with accurately converting units of measure, (e.g. em to px).</p>
 * <h2>Usage</h2>
 * <p>Import this file <em>after</em> util.core.js.</p>
 */

/**
 * Conversion Utility methods.
 * @namespace Util.Convert
 * @global
 * @static
 */
Util.Convert = function () {

    var _a;

    function _c() {
        if (!_a) {
            var _b = document.body;
            _a = Util.ce("DIV");
            var s = _a.style;
            s.position = "absolute";
            s.left = s.top = "-999px";
            s.height = "100em";
            s.width = "1px";
            s.innerHTML = "&nbsp;";
            s.background = "#FFF";
            _b.insertBefore(_a, Util.gc(_b));
        }
        return _a;
    }

    return {
        /**
         * Converts a pixel value to EMs, based on the screen's pixel-to-EM ratio.
         * @param {int} p A pixel value.
         * @return {number} A value in terms of EM units.
         *
         * @static
         * @function
         * @memberof Util.Convert
         * @name px2em
         * @fullname Convert px to EM
         */
        px2em : function (p) {
            return (p / _c().offsetHeight) * 100;
        },

        /**
         * Converts an EM value to pixels, based on the screen's pixel-to-EM ratio.
         * @param {Number} e A value in terms of EM units.
         * @return {int} A pixel value
         *
         * @static
         * @function
         * @memberof Util.Convert
         * @name em2px
         * @fullname Convert EM to px
         */
        em2px : function (e) {
            return Math.round((e * _c().offsetHeight) / 100);
        }
    };
}();


/*extern window, document, XMLHttpRequest, ActiveXObject, Util, _gbt */

var Ajax;

/**
 * @fileoverview
 * <strong>ajax.js</strong>
 * <p>
 * This file contains an encapsulating object, XMLHttpObject, for the XmlHttpRequest object. The XmlHttpObject
 * wraps the browsers's native XML HTTP Request Object.
 * </p>
 * <p>
 * This file contains a utility object, Ajax, for sending and receiving Ajax requests.
 * </p>
 * Copyright 2009. Cerner Corporation
 * @author Healthe Navigator
 */

/**
 * Construct an XmlHttpObject.
 * @class XmlHttpObject
 * The XmlHttpObject wraps the browser's native XML HTTP Request Object,
 * providing simplified, public functions to access the object's
 * properties and methods.
 * <p>
 * <strong>Disclaimer:</strong> The XmlHttpRequest object is not a standard browser
 * element and therefore there is no guarantee that this utility will be valid for
 * all implementations. Please use at your own risk.
 * </p>
 * <p>
 * <em><strong>Note:</strong> All methods and variables prefixed with an underscore
 * and marked as <code>&#64;private</code> are private functions and should not be called.</em>
 * </p>
 * <p>
 * Public functions of the XmlHttpObject object:<ul>
 *   <li>loadContent(url, callback, errorhandle) = Perform load</li>
 *   <li>postContent(url, callback, errorhandle) = Perform Post</li>
 *   <li>status() = Return the status</li>
 *   <li>statusText() = Return the status text</li>
 *   <li>readyState() = Return the ready state</li>
 *   <li>responseText() = Return the response text</li></ul></p>
 * @constructor
 */
function XmlHttpObject() {

    /**
     * @private
     */
    function _g() {
        var x = null;
        if (window.XMLHttpRequest) {
            // If IE7, Mozilla, Safari, and so on: Use native object
            x = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            // ...otherwise, use the ActiveX control for IE5.x and IE6
            x = new ActiveXObject('MSXML2.XMLHTTP.3.0');
        }
        return x;
    }

    var x = _g();

    /**
     * Perform open method, attach callback, and send the request.
     * @param {String} u URL to be opened
     * @param {Object} c Callback function to be executed onreadystatechange (optional)
     * @param {Object} eh Custom error handler function if exception is thrown.
     *                    The String error message will be passed as a parameter to this function. (optional)
     * @param {Boolean} p True if the transaction should be sent as a "POST", false otherwise. (optional).
     * @throws Exception If an expected parameter (XmlHttpRequest object or URL) is not defined
     * @private
     */
    function _l(u, c, eh, p) {
        try
        {
            // Split the url into the action and the params.
            var s = u.split("?"), ps = s[1] || "";

            // Open the URL using POST or GET.
            x.open(p ? "POST" : "GET", p ? s[0] : u, true);

            // When the XML HTTP request is complete and status is OK, check for timeout and execute the logout
            // action if a timeout has occurred. If no timeout occurred, execute the supplied callback.
            x.onreadystatechange = c;
            x.setRequestHeader("XMLHttpRequest", "true");

            // If name/value pairs exist, send them. Otherwise, send null.
            if (p) {
                x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                x.setRequestHeader("Content-length", ps.length);
                x.setRequestHeader("Connection", "close");
                x.send(ps);
            }
            else {
                x.send(null);
            }
        }
        catch (e) {
            if (eh) {
                try {
                    eh.call(this, e);
                }
                catch (e2) {
                    throw e2;
                }
            }
        }
    }

    return {
        /**
         * Post the XmlHttpRequest with a custom callback function attached to the onreadystatechange event.
         * @param {String} url      The url to be posted
         * @param {Object} cb	    A custom callback function (optional)
         * @param {Object} eh       Custom error handler function if exception is thrown.
         *                          The String error message will be passed as a parameter to this function. (optional)
         */
        postContent : function (url, cb, eh) {
            _l(url, cb, eh, true);
        },

        /**
         * Load the XmlHttpRequest with a custom callback function attached to the onreadystatechange event.
         * @param {String} url      The url to be loaded
         * @param {Object} cb	    A custom callback function (optional)
         * @param {Object} eh       Custom error handler function if exception is thrown.
         *                          The String error message will be passed as a parameter to this function. (optional)
         */
        loadContent : function (url, cb, eh) {
            _l(url, cb, eh, 0);
        },

        /**
         * Return the status of the most recent XmlHttpRequest.
         * NOTE: Primarily for use within custom callback methods.
         * @return {int} The status (e.g. 404, 200, etc) of the most recent XmlHttpRequest. May return undefined.
         */
        status : function () {
            return x.status;
        },

        /**
         * Return the status text of the most recent XmlHttpRequest.
         * NOTE: Primarily for use within custom callback methods.
         * @return {String} The status text (e.g. "Not Found" or "OK") of the most recent XmlHttpRequest. May return undefined.
         */
        statusText : function () {
            return x.statusText;
        },

        /**
         * Return the ready state of the most recent XmlHttpRequest.
         * NOTE: Primarily for use within custom callback methods.
         * <br />
         * Possible return values:
         * <ul>
         *    <li>0 = uninitialized</li>
         *    <li>1 = loading</li>
         *    <li>2 = loaded</li>
         *    <li>3 = interactive</li>
         *    <li>4 = complete</li>
         * </ul>
         * @return {int} The ready state of the most recent XmlHttpRequest. May return undefined.
         */
        readyState : function () {
            return x.readyState;
        },

        /**
         * Return the response text of the most recent XmlHttpRequest.
         * NOTE: Primarily for use within custom callback methods.
         * @return {String} The response text of the most recent XmlHttpRequest. May return undefined.
         */
        responseText : function () {
            return x.responseText;
        },

        /**
         * @return True if the object has reached a ready state where it can be interrogated, false otherwise.
         */
        ready : function () {
            return this.readyState() === 4;
        },

        /**
         * This results of this method will depend on the environment in which the object is executed and its
         * configuration. If the transaction is executed locally, on disk for example, this method will not return
         * true unless <code>Ajax.local</code> is <code>true</code>.
         * <p>Note: this method currently only uses a status code of <code>200</code> as its measure of success.</p>
         * @return True if the object has successfully loaded information from the supplied url, false otherwise.
         */
        loaded : function () {
            var s = this.status();
            return Ajax.local ? s === 200 || s === 0 : s === 200;
        }
    };
}

/**
 * Utility methods
 * @namespace Ajax
 * @static
 * @global
 */
Ajax = function () {
    /**
     * Returns the given input/select objects as a parameter string for a GET call. The action is prepended if b is set to true.
     * @param {Array} o A traversable Collection (e.g. Array, NodeList, etc) of input and/or select objects used to build the url parameters (cannot be null).
     * @param {Boolean} [b] True if the given action needs to be prepended to the url parameters with a ? delimiter, false otherwise.
     * @param {String} [a] The action to prepend to the url parameters if necessary.
     * @param {Node} [s] The submit input to append to the url. If undefined, all submit input name/value pairs will be appended.
     * @return A GET-formatted parameter string to follow a url.
     * @private
     */
    function _bu(o, b, a, s) {
        var u = "";
        for (var i = 0; i < o.length; ++i) {
            var e = o[i], t = e.type, v = null;
            if (t == "select-one" || t == "select-multiple") {
                for (var q = 0; q < e.options.length; ++q)
                {
                    var r = e.options[q];
                    if (r.selected)
                    {
                        v = r.value;
                        break;
                    }
                }
            }
            else if (t == "radio" || t == "checkbox") {
                if (!e.checked) {
                    continue;
                }
            }
            else if (t == "file" || t == "reset") {
                continue;
            } else if (t == "submit" && s && e != s) {
            	continue;
            }

            if (e.name) {
                u += u !== "" ? "&" : "";
                v = v === null ? e.value : v;
                u += e.name + "=" + encodeURIComponent(v);
            }
        }

        return b ? a + "?" + u : u;
    }

    /**
     * Finds and executes any script tags within the given dom element. This is necessary any time you are using innerHTML
     * to directly set the contents of an element to a string that may contain script tags. Just setting the innerHTML will not
     * execute any of the scripts.
     * @param {Node} e An html element reference (cannot be null or undefined).
     * @private
     */
    function _exs(e) {
        var s = _gbt("SCRIPT", e);
        for (var i = 0; i < s.length; ++i) {
            eval(s[i].innerHTML);
        }
    }

    function fl(u, f, e, ps) {
        var x = new XmlHttpObject(); // The xmlHttp result.

        var r = function (r) {
            var n = new Ajax.Error(x, r);
            if (e) {
                e.call(this, n);
            }
            else {
                throw n.error;
            }
        };

        // The callBack function containing the logic to monitor and evaluate the result of the xmlHttp request.
        var c = function () {
            try {
                if (x.ready()) {
                    if (x.loaded()) {
                        if (f) {
                            f.call(this, x.responseText());
                        }
                    }
                    else {
                        r.call(this);
                    }
                }
            }
            catch (e) {
                r.call(this, e, x);
            }
        }, v = ps ? function () {
            x.postContent(u, c, r);
        } : function () {
            x.loadContent(u, c, r);
        };

        if (Ajax.local) {
            setTimeout(v, 1000);
        }
        else {
            v();
        }
    }

    function fp(u, o, f, e, p) {

        if (!u && !o) {
            return null;
        }

        p = p || {};

        var U = Util, S = U.Style, r = ("clear" in p) ? p.clear : false, s = ("wait" in p) ? p.wait : true, n = function (t) {
            S.rcss(o, "wait");
            o.innerHTML = t;
            _exs(o);
            
            if (f) {
                f.call(this, t);
            }
        };

        if (s) {
            S.acss(o, "wait");
        }

        if (r) {
            var c = U.gc(o);
            while (c) {
                o.removeChild(c);
                c = U.gc(o);
            }
        }

        function ee(err) {
            S.rcss(o, "wait");

            if(e) {
                e.call(this, err);
            }
        }
        
        return fl(u, n, ee, p.post);
    }

    // Prepare the public API.
    return {
        /**
         * This variable indicates if the Ajax transactions are being executed locally. Default is false.
         */
        local : false,

        /**
         * Loads the given url using the light-framework's XmlHttp object.
         * @param {String} u The fully qualified url to use to load the content.
         * @param {Function} [f] The function to call once the data has loaded successfully. The function supplied should
         * be prepared to accept the response text as its sole parameter.
         * @param {Function} [e] The function to call if there is an error. The function supplied should
         * be prepared to accept an <code>Ajax.Error</code> object as its sole parameter.
         * @return The response text from the call.
         *
         * @static
         * @function
         * @memberof Ajax
         * @name load
         */
        load : function (u, f, e) {
            fl(u, f, e, 0);
        },

        /**
         * Posts the given url using the light-framework's XmlHttp object.
         * @param {String} u The fully qualified url to use to load the content.
         * @param {Function} [f] The function to call once the data has loaded successfully. The function supplied should
         * be prepared to accept the response text as its sole parameter.
         * @param {Function} [e] The function to call if there is an error. The function supplied should
         * be prepared to accept an <code>Ajax.Error</code> object as its sole parameter.
         * @return The response text from the call.
         *
         * @static
         * @function
         * @memberof Ajax
         * @name post
         */
        post : function (u, f, e) {
            fl(u, f, e, true);
        },

        /**
         * Loads the given url using the light-framework's XmlHttp object and places the response
         * text within a given element.
         * @param {String} u The fully qualified url to use to load the content.
         * @param {Node} o The element node in which to place the response text.
         * @param {Function} [f] The function to call once the data has loaded successfully. The function supplied should
         * be prepared to accept the response text as its sole parameter.
         * @param {Function} [e] The function to call if there is an error. The function supplied should
         * be prepared to accept an <code>Ajax.Error</code> object as its sole parameter.
         * @param {Object} [p] Options for loading and placing content.
         * @param {Boolean} [p.wait] Determines if the wait icon classname is applied to the container, (default is true).
         * @param {Boolean} [p.clear] Determines if the content of the container should be deleted prior to requesting content, (default is false).
         * @param {Boolean} [p.post] Determines if the content should be loaded using a POST, (default is false).
         *
         * @static
         * @function
         * @memberof Ajax
         * @name place
         */
        place : function (u, o, f, e, p) {
            fp(u, o, f, e, p);
        },

        /**
         * Returns the fields of a given form as a parameter string for a GET call. The form's action is prepended to the parameters if b is set to true.
         * @param {Node} f The form object containing the fields (cannot be null).
         * @param {Boolean} [b] True if the action of the form should be prepended to the parameter string returned, false otherwise.
         * @param {Node} [s] The submit input to append to the url. If undefined, all submit input name/value pairs will be appended.
         * @return A GET-formatted parameter string for a url.
         *
         * @static
         * @function
         * @memberof Ajax
         * @name getFormParams
         */
        getFormParams : function (f, b, s) {
            return _bu(f.elements, b, b ? f.action : "", s);
        },

        /**
         * Returns the fields of a given fieldset as a parameter string for a GET call.
         * @param {Node} [f] The fieldset object containing the fields (cannot be null).
         * @param {Node} [s] The submit input to append to the url. If undefined, all submit input name/value pairs will be appended.
         * @return A GET-formatted parameter string for a url.
         *
         * @static
         * @function
         * @memberof Ajax
         * @name getFSParams
         */
        getFSParams : function (f, s) {
            var u = _bu(_gbt("input", f), false, "", s), r = _bu(_gbt("select", f), false, "");
            return u === "" ? r : u + (r !== "" ? "&" : "") + r;
        }
    };
}();

/**
 *
 * Ajax Error object
 * @param {Object} x The XMLHttpObject in error.
 * @param {Object} e The exception thrown.
 */
Ajax.Error = function (x, e) {
    return {
        /**
         * The XMLHttpRequest object in error.
         *
         * @property
         * @memberOf Ajax.Error
         * @name xmlHttp
         */
        xmlHttp : x,

        /**
         * The exception thrown.
         *
         * @property
         * @memberOf Ajax.Error
         * @name error
         */
        error : e,

        /**
         * Return a complete message of the error when attempting an Ajax transaction.
         *
         * @function
         * @memberOf Ajax.Error
         * @name message
         */
        message : function () {
            return "[JavaScript Error] " + (this.errorError() || "None") + ", [XMLHttp Error] " + (this.xmlError() || "None");
        },

        /**
         * Return the error message from the exception.
         *
         * @function
         * @memberOf Ajax.Error
         * @name errorError
         */
        errorError : function () {
            return e ? e.message : null;
        },

        /**
         * Return a descriptive, diagnostic error message based on properties within the XMLHttpRequest object.
         *
         * @function
         * @memberOf Ajax.Error
         * @name xmlError
         */
        xmlError : function () {
            try {
                if(!x) {
                    return "XMLHTTP object is null";
                }
                else {
                    var s = x.status();
                    return "Status: " + (s === undefined ? "unknown" : s) + ", Ready State: " + (x.readyState() || "unknown") + ", Response: " + (x.responseText() || "unknown");
                }
            }
            catch (e) {
                return e.message;
            }
        }
    };
};

/**
 * @fileOverview

   <h1>Animator</h1>
   <p>
        The Animator is a work queue for animations. Animations can be added to the queue, and the Animator
        is then "played" or "rewound" using its exposed API.
   </p>
   <h2>Requirements</h2>
   <p>
        None.
   </p>
   <h2>Notes</h2>
   <p>Validated with JSLint.</p>

 */

 /**
  * Create a new Animator.
  * @param {Object} [o] Options for animations run by the Animator.
  * @param {int} [o.inv] The interval between frames, (default is 15).
  * @param {int} [o.dur] The duration of the animation, (default is 450).
  * @param {Animator.TX} [o.trans] The transition equation for the animation, (default is Animator.TX.linear).
  * @param {Function} [o.step] The function to call on each frame.
  * @param {Function} [o.fin] The function to call when finished.
  * @constructor
  */
function Animator(o) {

    // _a  : The group of Animations.
    // _t  : The targeted state.
    // _s  : The current state.
    // _lt : The last time recorded.
    // _n  : The Timer interval identifier.
    // _p  : Object containing default parameters.
    var _a = [], _t = 0, _s = 0, _lt, _n, _p = {
        // Interval between frames.
        inv: 15,
        // Duration of animation.
        dur: 450,
        // The transition.
        trans: Animator.TX.linear,
        // The function to execute on each frame.
        step: function () {},
        // The function to run at finish.
        fin: function () {}
    };

    /**
     * Function: Set up defaults.  This function will parse through the options
     * provided as an argument and merge them with the defaults.
     *
     * This simple method was copied from the Util library to avoid an unnecessary dependency.
     * @private
     */
    function fs(o) {
        var p, n = {};
        for (p in _p) {
            if (p) {
                n[p] = o[p] !== undefined ? o[p] : _p[p];
            }
        }
        return n;
    }

    /**
     * Function: Go.  This function applies the animation.
     * @private
     */
    function fg() {
        // Apply the transition to the current state.
        var v = _p.trans(_s);

        // For each animation object...
        for (var i = 0; i < _a.length; i++) {
            // ...set the state.
            _a[i].set(v);

            // If the animation will continue...
            if (_t != _s) {
                // ... call the step function.
                _a[i].step.call(this);
            }
            //... otherwise call the finish function.
            else {
                _a[i].fin.call(this);
            }
        }
    }

    /**
     * Function: On Timer Fire. This function is called on each interval fire.
     * @private
     */
    function fot() {
        // n : Now.
        // d : Delta between now and last time.
        // m : Movement, based on duration, start and target.
        var n = new Date().getTime(), d = n - _lt, m = (d / _p.dur) * (_s < _t ? 1 : -1);
        _lt = n;

        // If the movement is greater than remaining difference...
        if (Math.abs(m) >= Math.abs(_s - _t)) {
            // ...set the state to the target.
            _s = _t;
        }
        // ... otherwise, add the movement to the state.
        else {
            _s += m;
        }

        try {
            // Apply the animation frame.
            fg();
        } finally {
            // Call the Animator's onStep.
            _p.step.call(this);
            // If the animation is over, clean house.
            if (_t == _s) {
                window.clearInterval(_n);
                _n = null;
                // Call the Animator's onFinish.
                _p.fin.call(this);
            }
        }
    }

    /**
     * Function: Animate From To.  Animates from a state to a state.
     * @param from The value, between 0 and 1, to animate from.
     * @param to The value, between 0 and 1, to animate toward.
     * @private
     */
    function fft(from, to) {
        _t = Math.max(0, Math.min(1, to));
        _s = Math.max(0, Math.min(1, from));
        _lt = new Date().getTime();
        if (!_n) {
            _n = window.setInterval(fot, _p.inv);
        }
    }

    /**
     * Function: Animate To. Animates from the current state to provided value. Used mostly
     * for toggling.
     * @param to The value, between 0 and 1, to animate toward.
     * @private
     */
    function ft(to) {
        fft(_s, to);
    }

    // Populate the optional parameters with a merged object, taking the options
    // argument into account.
    o = o || {};
    _p = fs(o);

    // Return the public API
    return {
        /**
         * Toggles the Animation based on the current state.
         *
         * @function
         * @memberOf Animator
         * @name toggle
         */
        toggle : function () {
            ft(1 - _t);
        },

        /**
         * Add an animation to the queue.
         * @param {Animator.Animation} a The animation to add to the queue.
         * @return {Animator} The current Animator instance.
         *
         * @function
         * @memberOf Animator
         * @name add
         */
        add : function (a) {
            _a[_a.length] = a;
            return this;
        },

        /**
         * Clear animations from the instance.
         *
         * @function
         * @memberOf Animator
         * @name clear
         */
        clear : function () {
            _a = [];
            _lt = null;
        },

        /**
         * Play the animation.
         *
         * @function
         * @memberOf Animator
         * @name play
         */
        play : function () {
            fft(0, 1);
        },

        /**
         * Reverse the animation.
         *
         * @function
         * @memberOf Animator
         * @name reverse
         */
        reverse : function () {
            fft(1, 0);
        },

        /**
         * Set Options.  This could be used to change options, such as transition, on
         * an existing Animator object.
         * @param {Object} o Options to set to the Animator.
         *
         * @function
         * @memberOf Animator
         * @name setOptions
         */
        setOptions : function (o) {
            _p = fs(o);
        },

        /**
         * Get Options. Returns the options object for the Animator.
         * @return {Object} An object containing options for the Animator.
         *
         * @function
         * @memberOf Animator
         * @name getOptions
         */
        getOptions : function () {
            return _p;
        }
    };
}

/**
 * An Animator Queue.  Animation objects provided as an array will be executed in sequence.
 * @param {Array} as An array of Animator instances to be executed in sequence.
 * @constructor
 */
Animator.Queue = function (as) {

    var a = false;

    /**
     * Function to ensure that the elements array is, in fact, an elements array. If only a single
     * element was passed, place it in an array.
     * @param {Element||Array} e An element or array of elements.
     * @return {array} An array of elements.
     * @private
     * @static
     */
    function ft(e) {
        if (e === null) {
            return [];
        }
        if (e.tagName || !e.length) {
            return [e];
        }
        return e;
    }

    /**
     * Function: Setup for Play.
     * @param {Animator} o1 The first object, triggering the second.
     * @param {Animator} o2 The second object, triggered by the first.
     */
    function fp(o1, o2) {
        o1.setOptions({ fin : function () {
            o1._of.call();
            o2.play();
        }});
    }


    /**
     * Function: Setup for Reverse.
     * @param {Animator} o1 The first object, triggering the second.
     * @param {Animator} o2 The second object, triggered by the first.
     */
    function fr(o1, o2) {
        o1.setOptions({ fin : function () {
            o2.reverse();
            o1._of.call();
        }});
    }

    /**
     * Function: Setup the last object.
     * @param {Animator} o The last object in the queue chain.
     */
    function fl(o) {
        var p = o.getOptions(), f = p.fin;
        o.setOptions({ fin : function () {
            a = false;
            f.call();
            for (var i = 0; i < as.length; i++) {
                as[i].setOptions({ fin : as[i]._of });
            }
        }});
    }

    // Ensure an array.
    ft(as);

    // Loop and extract the finish event.
    for (var i = 0; i < as.length; i++) {
        as[i]._of = as[i].getOptions().fin;
    }

    // Prepare the Public API
    return {
        play : function () {
            if (a) {
                return;
            }
            a = true;
            for (var i = 0; i < as.length - 1; i++) {
                fp(as[i], as[i + 1]);
            }
            fl(as[as.length - 1]);
            as[0].play();
        },

        reverse : function () {
            if (a) {
                return;
            }

            a = true;

            for (var i = as.length - 1; i > 0; i--) {
                fr(as[i], as[i - 1]);
            }
            fl(as[0]);
            as[as.length - 1].reverse();
        }
    };
};

 /**
  * Animator Transitions for use with Animations.
  * @namespace
  */
Animator.TX = function () {

    /**
     * Create an "Ease In" Transition. Animations will accellerate from their start
     * value, based on the acceleration argument provided.
     * @param {Number} [a] Acceleration, where larger values create more pronounced effects.
     * Default is 1.
     * @return {Function} A state-based determinant function.
     * @private
     */
    function ei(a) {
        a = a || 1;
        return function (s) {
            return Math.pow(s, a * 2);
        };
    }

    /**
     * Create an "Ease Out" Transition. Animations will accellerate toward their ending
     * value, based on the acceleration argument provided.
     * @param {Number} [a] Acceleration, where larger values create more pronounced effects.
     * Default is 1.
     * @return {Function} A state-based determinant function.
     * @private
     */
    function eo(a) {
        a = a || 1;
        return function (s) {
            return 1 - Math.pow(1 - s, a * 2);
        };
    }

    /**
     * Create an "Elastic" Transition. Animations will "bounce" past their target, only to return
     * again based on the accelerant value.
     * @param {Number} [a] Acceleration, where larger values create more pronounced effects.
     * Default is 1.
     * @return {Function} A state-based determinant function.
     * @private
     */
    function el(a) {
        return function (s) {
            s = Animator.TX.easeInOut(s);
            return ((1 - Math.cos(s * Math.PI * a)) * (1 - s)) + s;
        };
    }

    return {
        /**
         * Linear Transition
         * @static
         * @property
         * @memberof Animator.TX
         * @name linear
         */
        linear : function (x) {
            return x;
        },

        /**
         * An "Ease In" Transition. Animations will accellerate from their start
         * value.
         * @static
         * @property
         * @memberof Animator.TX
         * @name easeIn
         */
        easeIn : ei(1.5),

        /**
         * An "Ease Out" Transition. Animations will accellerate from their end
         * value.
         * @static
         * @property
         * @memberof Animator.TX
         * @name easeOut
         */
        easeOut : eo(1.5),

        /**
         * A stronger "Ease In" Transition. Animations will accellerate from their
         * start value.
         * @static
         * @property
         * @memberof Animator.TX
         * @name strongEaseIn
         */
        strongEaseIn : ei(2.5),

        /**
         * A stronger "Ease Out" Transition. Animations will accellerate from their end
         * value.
         * @static
         * @property
         * @memberof Animator.TX
         * @name strongEaseOut
         */
        strongEaseOut : eo(2.5),

        /**
         * An "Ease In and Out" Transition.
         * @static
         * @property
         * @memberof Animator.TX
         * @name easeOut
         */
        easeInOut : function (pos) {
            return ((-Math.cos(pos * Math.PI) / 2) + 0.5);
        },

        /**
         * An "Elastic" Transition. Animations will "bounce" past their target, only to return
         * again.
         * @static
         * @property
         * @memberof Animator.TX
         * @name elastic
         */
        elastic : el(1),

        /**
         * A stronger "Elastic" Transition. Animations will "bounce" past their target, only to return
         * again.
         * @static
         * @property
         * @memberof Animator.TX
         * @name veryElastic
         */
        veryElastic : el(3)
    };
}();

/**
 * Create a new Animation for use by the Animator.
 * @param {Function} set The function to call on each interval, accepting the state
 * as an argument to determine movement.
 * @param {Function} step The function to call on each step.
 * @param {Function} fin The function to call when finished.
 *
 * @constructor
 */
Animator.Animation = function (set, step, fin) {
    return {
        set : set || function () {

        },
        step : step || function () {

        },
        fin : fin || function () {

        }
    };
};

/**
 * This namespace contains Animations to be used by the Animator.
 * @namespace Animator.Animations
 */
Animator.Animations = function () {

    /**
     * Function to ensure that the elements array is, in fact, an elements array. If only a single
     * element was passed, place it in an array.
     * @param {Element||Array} e An element or array of elements.
     * @return {Array} An array of elements.
     * @private
     * @static
     */
    function ft(e) {
        if (e === null) {
            return [];
        }
        if (e.tagName || !e.length) {
            return [e];
        }
        return e;
    }

    return {
        /**
         * A Numeric Animator.  This animator will animate a CSS style property over a start and
         * finish value, incorporating a specified unit.
         * @param {Element||Array} es The element or array of elements to be animated.
         * @param {String} p The CSS style property to be animated.
         * @param {Number||Function} f The start value.
         * @param {Number||Function} t The end value.
         * @param {String} [u] The unit of measure; defaults to 'px'.
         * @param {Object} [o] Options for the animation.
         * @param {Object} [o.enf0] Enforce zero; this will complete the animation and set the value to 0.
         * @param {Object} [o.step] Function to execute on each step.
         * @param {Object} [o.fin] Function to execute on finish.
         * @return {Animator.Animation} An Animation for use by the Animator.
         *
         * @memberof Animator.Animations
         * @name Numeric
         * @constructor
         */
        Numeric : function (es, p, f, t, u, o) {
            var ff, tf;
            es = ft(es);
            u = u || "px";
            o = o || {};

            if (typeof f === "function") {
                ff = function () {
                    return f();
                };
            }
            else {
                ff = function () {
                    return f;
                };
            }

            if (typeof t === "function") {
                tf = function () {
                    return t();
                };
            }
            else {
                tf = function () {
                    return t;
                };
            }

            /*for (var i = 0; i < es.length; i++) {
                es[i].style[p] = ff() + u;
            }*/

            // Create the setter function.
            var set = function (v) {
                for (var i = 0; i < es.length; i++) {
                    var x = ff() + ((tf() - ff()) * v);
                    if (o.enf0) {
                        x = x < 0 ? 0 : x;
                    }
                    es[i].style[p] = x + u;
                }
            };

            // Create the step function.
            var step = o.step || function () {
            };

            // Create the finish function.
            var fin = function () {
                if (o.fin) {
                    o.fin.call(this);
                }
            };

            return new Animator.Animation(set, step, fin);
        },

        /**
         * A Color Animator. This animator will animate a color transition for a given property.
         * @param {Element||Array} es The element or array of elements to be animated.
         * @param {String} p The CSS color-based style property to be animated. If the style property is not
         * color-based, other styles could be given a color-based value with adverse effects.
         * @param {Hex} f The fully-qualified start value, as a hex-based color representation, e.g. #FFFFFF or #000000.
         * @param {Hex} t The fully-qualified end value, as a hex-based color representation, e.g. #FFFFFF or #000000.
         * @return {Animator.Animation} An Animation for use by the Animator.
         *
         * @memberof Animator.Animations
         * @name Color
         * @constructor
         */
        Color : function (es, p, f, t) {

            /**
             * Function: Convert Hex color to Array of indexed decimal colors.
             * @param {String} c The properly formatted hex color, as "#RRGGBB"
             * @return {Array} An array of colors in decimal format, as [R, G, B].
             * @private
             */
            function fca(c) {
                return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
            }

            /**
             * Function: Convert Decimal to Hex.  Converts a decimal color value to a proper
             * two digit/letter combination.
             * @param {int} n The decimal value for the color.
             * @return {String} The proper two-digit/letter HEX value.
             * @private
             */
            function fh(n) {
                n = n > 255 ? 255 : n;
                var d = n.toString(16);
                if (n < 16) {
                    return '0' + d;
                }
                return d;
            }

            /**
             * Function: Process. Animate the color in the specified index based on the state.
             * @param i The color index.
             * @param s The state.
             * @private
             */
            function fp(i, s) {
                return Math.round(f[i] + ((t[i] - f[i]) * s));
            }

            // Create the setter function.
            var set = function (state) {
                var c = '#' + fh(fp(0, state)) + fh(fp(1, state)) + fh(fp(2, state));
                for (var i = 0; i < es.length; i++) {
                    es[i].style[p] = c;
                }
            };

            // Create the finish function.
            var fin = function () {
                for (var i = 0; i < es.length; i++) {
                    es[i].style[p] = t;
                }
            };

            // Create the element array.
            es = ft(es);

            // Initialize all elements to have the start color.
            for (var i = 0; i < es.length; i++) {
                es[i].style[p] = f;
            }

            // Create the from and to decimal color arrays.
            t = fca(t);
            f = fca(f);

            return new Animator.Animation(set, null, fin);
        },

        /**
         * Opacity animator with cross-browser compatibility.
         * @param {Element||Array} es An element or array of elements to animate.
         * @param {Number} f The start value, ranging from 0, for full opacity, to 1, for no opacity.
         * @param {Number} t The end value, ranging from 0, for full opacity, to 1, for no opacity.
         * @return {Animator.Animation} An Animation for use by the Animator.
         *
         * @memberof Animator.Animations
         * @name Opacity
         * @constructor
         */
        Opacity : function (es, f, t) {

            // Create the element array.
            es = ft(es);

            function st(v) {
                for (var i = 0; i < es.length; i++) {
                    var e = es[i].style, x = f + (t - f) * v;
                    // Standards && Mozilla
                    e.opacity = e.mozOpacity = x;
                    // IE 6+
                    e.zoom = 1;
                    e.filter = x === 1 ? "" : "alpha(opacity=" + x * 100 + ")";
                }
            }

            function fin() {
                for (var i = 0; i < es.length; i++) {
                    var e = es[i].style;
                    if (e.opacity === 1) {
                        e.filter = "";
                    }
                }
            }

            return new Animator.Animation(st, null, fin);
        }

    };
}();