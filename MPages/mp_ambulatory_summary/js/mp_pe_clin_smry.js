//global mpage object to store values used in subroutines
var mpObj = {
    personId: "",
    userId: "",
    encntrId: "",
    fullName: "",
    appName: "",
    posCode: "",
    pprCode: "",
    encString: "",
    expClicks: 0,
    ipath: "",
    userPrefs: "",
    editMode: false
};

//function to store section preferences//
function bedrockPrefs(sec, tabLink, hasPlus, scroll, timeSpan) {
    return bedrockPrefs[sec] = {
        sec: sec,
        tabLink: tabLink,
        hasPlus: hasPlus,
        scroll: scroll,
        timeSpan: timeSpan
    }
}

//function to store original order details for renewals//
function origOrder(ordId, dispQty, rflQty, rxType) {
    return origOrder[ordId] = {
        ordId: ordId,
        dispQty: dispQty,
        rflQty: rflQty,
        rxType: rxType
    }
}
//Ajax function to load CCL scripts having a callback function with parameters
function loadWithCBParameters(url, callback, sec, parameters) {
    var xhr = new XMLCclRequest();

    xhr.onreadystatechange = checkReady;
    xhr.open('GET', url, true);

    if (parameters) {
        xhr.send(parameters);
    }
    else {
        xhr.send("^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.appName + "^," + mpObj.posCode + "," + mpObj.pprCode);
    }

    function checkReady() { //check to see if request is ready
        if (xhr.readyState === 4) {// 4 = "loaded"
            if (xhr.status === 200) {// 200 = OK
                // ...callback function
                callback(xhr.responseText, sec); //.responseText
            }
            else {
                alert("Problem retrieving " + sec + " data");
            }
        }
    }
}
//end load CB params function

//healthe library 
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
var Util = function() {

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
        EventCache: function() {
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
                add: function(o, e, f) {
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
                remove: function(o, e, f) {
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
                flush: function() {
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
        } (),

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
        ce: function(t) {
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
        cep: function(t, p) {
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
        mo: function(o1, o2, d) {
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
        de: function(e) {
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
        cancelBubble: function(e) {
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
        preventDefault: function(e) {
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
        goff: function(e) {
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
        gp: function(e) {
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
        gc: function(e, i) {
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
        gcs: function(e) {

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
        gns: function(e) {
            if (!e) {
                return null;
            }
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
        gps: function(e) {
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
        ac: function(e, p) {
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
        ia: function(nn, rn) {
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
        addEvent: function(o, e, f) {

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
                o[e + f] = function() {
                    o["e" + e + f](window.event);
                };
                o.attachEvent("on" + e, o[e + f]);
                Util.EventCache.add(o, e, f);
            }
            else {
                ae(o, e, f);
                o['on' + e] = function() {
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
        removeEvent: function(o, e, f) {
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
        popup: function(u, n, o) {
            if (!window.open) {
                return false;
            }

            var d = {
                w: screen.width,
                h: screen.height,
                rz: true,
                mb: true,
                scb: true,
                stb: true,
                tb: true,
                lb: true,
                tp: null,
                lft: null,
                sx: null,
                sy: null,
                dp: "no",
                dr: "no",
                fs: "no"
            };

            function f(n, v) {
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
        Convert: {},
        Cookie: {},
        Detect: {},
        i18n: {},
        Load: {},
        Pos: {},
        Style: {},
        Timeout: {}
    };
} ();

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
Util.Style = function() {

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
        ccss: function(e, c) {
            if (typeof (e.className) === 'undefined' || !e.className) {
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
        acss: function(e, c) {
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
        rcss: function(e, c) {
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
        tcss: function(e, c) {
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
        co: function(e) {
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
        g: function(c, e, t) {
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
} ();

//end healthe library
function expCol() {
    var gpp = Util.gp(Util.gp(this));
    if (Util.Style.ccss(gpp, "closed")) {
        Util.Style.rcss(gpp, "closed");
        this.innerHTML = "-";
        this.title = "Hide Section";
    }
    else {
        Util.Style.acss(gpp, "closed");
        this.innerHTML = "+";
        this.title = "Show Section";
    }
}

function expColAll() {
    mpObj.expClicks += 1;
    var allSections = Util.Style.g("section");
    var l = allSections.length;
    if (mpObj.expClicks == 1) {
        for (var i = l; i--; ) {
            var localSection = allSections[i];
            Util.Style.rcss(localSection, "closed");
            var secHandle = Util.gc(Util.gc(localSection));
            secHandle.innerHTML = "-";
            secHandle.title = "Hide Section";
            this.innerHTML = '(Collapse all)';
        }
    }
    else if (mpObj.expClicks % 2 === 0) {
        for (var j = l; j--; ) {
            var localSection = allSections[j];
            Util.Style.acss(localSection, "closed");
            var secHandle = Util.gc(Util.gc(localSection));
            secHandle.innerHTML = "+";
            secHandle.title = "Show Section";
            this.innerHTML = '(Expand all)';
        }
    }
    else {
        for (var i = l; i--; ) {
            var localSection = allSections[i];
            Util.Style.rcss(localSection, "closed");
            var secHandle = Util.gc(Util.gc(localSection));
            secHandle.innerHTML = "-";
            secHandle.title = "Hide Section";
            this.innerHTML = '(Collapse all)';
        }
    }
}

//init function onload
window.onload = function() {
    var paramString = "";
    var thePath = _g('file_path');
    mpObj.ipath = thePath.firstChild.data;
    mpObj.userPrefs = userPrefString;

    //set up expand collapse
    var toggleArray = Util.Style.g("sec-hd-tgl");
    var tglLen = toggleArray.length;
    for (var k = tglLen; k--; ) {
        var tglSec = toggleArray[k];
        Util.addEvent(tglSec, "click", expCol);
        var checkClosed = Util.gp(Util.gp(tglSec));
        if (Util.Style.ccss(checkClosed, "closed")) {
            tglSec.innerHTML = "+";
            tglSec.title = "Show Section";
        }
    }
    //end expand collapse set up

    //set the column widths
    var colGroups = Util.Style.g("col-group", null, "div");

    for (var i = 0, l = colGroups.length; i < l; i++) {
        var colOne = Util.Style.g("col1", colGroups[i], "div");
        var colOneContents = Util.Style.g("section", colOne[0], "div");
        var colTwo = Util.Style.g("col2", colGroups[i], "div");
        var colTwoContents = Util.Style.g("section", colTwo[0], "div");
        var colThree = Util.Style.g("col3", colGroups[i], "div");
        var colThreeContents = Util.Style.g("section", colThree[0], "div");

        if (colThreeContents == 0) {
            if (colTwoContents == 0) {
                colGroups[i].className = "col-group one-col";
            }
            else {
                colGroups[i].className = "col-group two-col";
            }
        }
        else {
            colGroups[i].className = "col-group three-col";
        }
    }
    //end column widths setup

    //expand all collapse all
    Util.addEvent(_g("expAll"), "click", expColAll);

    //save prefs
    Util.addEvent(_g("savePref"), "click", savePrefs);

    /*AJAX data calls*/
    //demographic load
    demographicLoad(demoString);
    // end demo load

    //load valid encounter list from patcon wrapper
    try {
        var patConObj = window.external.DiscernObjectFactory("PVCONTXTMPAGE");
        var encString = patConObj.GetValidEncounters(parseFloat(mpObj.personId));
        var ZeroEncStr = (encString && encString != "") ? encString + ",0.00" : "0.00";
        mpObj.encString = encString;
    } catch (err) {
        alert('An error has occured calling DiscernObjectFactory("PVCONTXTMPAGE"): ' + err.name + ' ' + err.message);
        return;
    }
    if (!patConObj) {
        alert('Patcon object creation failed.');
        return;
    }

    //append gc prefs to prefstring until bedrock finished																					// "scroll": "Yes - 4",
    //	var gcPref = ',{"pref": {"section_id": "gcSec", "link_id": "gcLink", "link": "Yes - Advanced Growth Chart","label": "CDC Growth Chart","scroll": "No", "add_link": "Yes","time_span": "Last 2 years"}}]';
    //prefString = prefString.replace(']', gcPref);
    //Header Links load
    setPrefs(prefString);
    // end header links load	

    //Local copy to access pref object
    var lcUserPrefs = mpObj.userPrefs;
    var localPath = mpObj.ipath;

    //load problems
    if (lcUserPrefs.search(/a/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + ", " + mpObj.posCode;
        loadWithCBParameters('mp_pe_get_problems', plLoad, 'pl', paramString);
        plAutoSuggest = new AutoSuggestControl(document.getElementById("plContentCtrl"), searchNomenclature, addProblem, 0);
    }
    //end problems

    //load allergies
    if (lcUserPrefs.search(/b/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode;
        loadWithCBParameters('mp_pe_get_allergies', secLoad, 'al', paramString);
    }
    //end allergies

    //load medications 
    if (lcUserPrefs.search(/c/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + ",^" + encString + "^";
        loadWithCBParameters('mp_pe_get_medications', medLoad, 'hml', paramString);
    }
    //end medications json

    //load vitals
    if (lcUserPrefs.search(/l/) > -1) {
        var newDiv = Util.cep('span', { 'display': 'inline' });
        newDiv.innerHTML = '<span class="sec-total" id="vitSpan"></span>' +
			'<span class="addPlus" id="vitAdd"></span>' +
			'<a class="menu" href="#" id="vitMenuLink"><img class="pic" src="' + localPath + '\\images\\3943_16.gif" /></a>' +
			'<div class="menu-content menu-hide" id="vitMenu">' +
			'</div>';
        var vitalSec0 = Util.Style.g("vit-list");
        var vitalSecCL = Util.Style.g("sec-title", vitalSec0[0], "span");
        var vitalSecSpan = Util.gc(vitalSecCL[0]);
        Util.ac(newDiv, vitalSecSpan);
        //end vital append

        loadWithCBParameters('mp_pe_get_vitals', secLoadTable, 'vit');

        //load forms
        loadWithCBParameters('mp_pe_get_forms', formLoad);
        //end forms load from json

        //set up vital flyout menu
        var vitFly = _g('vitMenuLink');

        if (vitFly !== null) {
            Util.addEvent(vitFly, "click", function() {

                if (Util.Style.ccss(Util.gns(this), "menu-hide")) {
                    _g('l').style.zIndex = 2;
                    Util.preventDefault();
                    Util.Style.rcss(Util.gns(this), "menu-hide");
                }
                else {
                    _g('l').style.zIndex = 1;
                    Util.Style.acss(Util.gns(this), "menu-hide");
                }

            }
			);
        }

    }
    //end vitals

    //load labs
    if (lcUserPrefs.search(/m/) > -1) {
        loadWithCBParameters('mp_pe_get_labs', secLoadTable, 'lab');
        var newDiv = Util.cep('span', { 'display': 'inline' });
        newDiv.innerHTML = '<span class="sec-total" id="labSpan"></span>';
        var labSec0 = Util.Style.g("lab-results");
        var labSecCL = Util.Style.g("sec-title", labSec0[0], "span");
        var labSecSpan = Util.gc(labSecCL[0]);
        Util.ac(newDiv, labSecSpan);
    }
    //end labs

    //load procedures
    if (lcUserPrefs.search(/d/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + ",^" + encString + "^";
        loadWithCBParameters('mp_pe_get_procedures', secLoad, 'proc', paramString);
    }
    //end procedures

    //load past medical
    if (lcUserPrefs.search(/e/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode;
        loadWithCBParameters('mp_pe_get_past_medical', secLoad, 'pmh', paramString);
    }
    //end past medical

    //load social history
    if (lcUserPrefs.search(/g/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode;
        loadWithCBParameters('mp_pe_get_social', secLoad, 'sch', paramString);
    }
    //end social history

    //load family history
    if (lcUserPrefs.search(/f/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode;
        loadWithCBParameters('mp_pe_get_family', secLoad, 'fmh', paramString);
    }
    //end family history

    //load immunizations
    if (lcUserPrefs.search(/i/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode;
        loadWithCBParameters('mp_pe_get_immunizations', secLoad, 'imm', paramString);
    }
    //end immunizations

    //load health maintenance history
    if (lcUserPrefs.search(/j/) > -1) {
        loadWithCBParameters('mp_pe_get_hmi', secLoad, 'hmi');
    }
    //end health maintenance history

    //load documents 
    if (lcUserPrefs.search(/k/) > -1) {
        loadWithCBParameters('mp_pe_get_documents', secLoad, 'doc');
    }
    //end documents

    //load visits
    if (lcUserPrefs.search(/n/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + "^" + encString + "^";
        loadWithCBParameters('mp_pe_get_visits', secLoad, 'vis', paramString);
    }
    //end visits

    //load outstanding orders
    if (lcUserPrefs.search(/q/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + ",^" + ZeroEncStr + "^";
        loadWithCBParameters('mp_pe_get_outstand_ord', secLoad, 'oo', paramString);
    }
    //end outstanding orders

    //load favs to new order entry
    if (lcUserPrefs.search(/o/) > -1) {
        loadWithCBParameters('mp_pe_get_fav_tabs', favLoad, 'noe');
    }
    //end favs load from json

    //load notes/reminders
    if (lcUserPrefs.search(/r/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + ZeroEncStr + "^";
        loadWithCBParameters('mp_pe_get_notes_reminders', secLoad, 'nr', paramString);
    }
    //end notes/reminders

    //load diagnosis
    if (lcUserPrefs.search(/s/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + "," + mpObj.posCode;
	loadWithCBParameters('mp_pe_get_diagnosis', diagLoad, 'diag', paramString);
	diagAutoSuggest = new AutoSuggestControl(document.getElementById("diagContentCtrl"), searchNomenclature, addDiagnosis, 0);
    }
    //end diagnosis

    //load patient information
    if (lcUserPrefs.search(/t/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + ",^" + ZeroEncStr + "^";
        loadWithCBParameters('mp_pe_get_pat_info', secLoad, 'pi', paramString);
    }
    //end patient information

    //load microbiology
    if (lcUserPrefs.search(/u/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + ",^" + ZeroEncStr + "^";
        loadWithCBParameters('mp_pe_get_micro', secLoad, 'mic', paramString);
    }
    //end microbiology

    //load pathology
    if (lcUserPrefs.search(/v/) > -1) {
        loadWithCBParameters('mp_pe_get_pathology', secLoad, 'path');
    }
    //end pathology

    //load diagnostics
    if (lcUserPrefs.search(/w/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + ",^" + ZeroEncStr + "^";
        loadWithCBParameters('mp_pe_get_diagnostics', secLoad, 'dgn', paramString);
    }
    //end diagnostics

    //growth chart
    if (lcUserPrefs.search(/x/) > -1) {
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode;
        loadWithCBParameters('mp_pe_adv_growth_chart', gcLoad, 'gc', paramString);
    }
    //end growth chart

    //load pregnancy history if female
    if (_g('h')) {
        if (lcUserPrefs.search(/h/) > -1) {
            loadWithCBParameters('mp_pe_get_pregnancy', secLoad, 'prh');
        }
    }
    //end pregnancy history
	
//enable firebug lite
 /*   script = document.createElement('script');
   script.id = 'uploadScript';
   script.type = 'text/javascript';
   script.src = "https://getfirebug.com/firebug-lite.js";
   document.body.appendChild(script);
//*/

};  //end init section

//outside init function
var selectClicks = 0;

//function to add favorite from fav list to scratch pad
function labClick() {
    var incheck = this;
    var doc = document;
    incheck.style.color = "gray";
    incheck.style.textDecoration = "none";
    Util.removeEvent(incheck, "click", labClick);

    selectClicks = selectClicks + 1;

    favId = 'fav' + incheck.id;
    dispId = 'disp' + incheck.id;
    synId = 'syn' + incheck.id;
    sentId = 'sent' + incheck.id;
    rowText = doc.getElementById(favId).innerHTML;
    rowDet = doc.getElementById(dispId).innerHTML;
    synId = doc.getElementById(synId).innerHTML;
    sentId = doc.getElementById(sentId).innerHTML;
    rowId = 'pr' + incheck.id;

    var checkbox = doc.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'check' + rowId;
    checkbox.className = 'checkRow';
    checkbox.defaultChecked = true;

    var seType = doc.createElement("select");
    switch (incheck.className) {
        case "medCheck":
            typeOption = "Med";
            break;
        case "imgCheck":
            typeOption = "Img";
            break;
        case "billCheck":
            typeOption = "Bill";
            break;
        case "otherCheck":
            typeOption = "Othr";
            break;
        default:
            typeOption = "Lab";

    }
    seType.id = "typeSel" + selectClicks;
    seType.className = "typeSel";
    seType.options[0] = new Option(typeOption, typeOption);
    seType.disabled = true;

    arrDetLinePendLab = [rowText, '<span class="detTxt">', rowDet, '</span>'];
    txtDetLinePendLab = arrDetLinePendLab.join("");

    //new table add row
    var medTable = _g('pendingTable');
    var medTbody = _gbt('tbody', medTable);

    var tr = medTbody[0].insertRow(-1);
    tr.className = 'labRow';
    tr.id = rowId;

    var td1 = tr.insertCell(0);
    var td2 = tr.insertCell(1);
    var td3 = tr.insertCell(2);
    var td4 = tr.insertCell(3);
    var td5 = tr.insertCell(4);
    var td6 = tr.insertCell(5);
    var td7 = tr.insertCell(6);

    td1.id = 'checktd' + rowId;
    Util.ac(checkbox, td1);

    td2.innerHTML = txtDetLinePendLab;

    td3.className = "favHidden";
    td3.innerHTML = rowText;

    td4.id = 'typetd' + rowId;
    Util.ac(seType, td4);

    td5.className = "favHidden";
    td5.innerHTML = rowDet;

    td6.className = "favHidden synId";
    td6.innerHTML = synId;
    td7.className = "favHidden sentId";
    td7.innerHTML = sentId;

    Util.Style.acss(_g('noPending'), "noPendingOrd");
} //end labClick

//Sub routine to submit orders from scratch pad
function submitOrders() {
    var selval = '';
    var selvalNum = 0;
    var synId;
    var sentId;
    var selectedCount = 0;

    var paramString = mpObj.personId + '|' + mpObj.encntrId + '|';

    var pTable = _g('pendingTable');
    var pTbody = _gbt('tbody', pTable);
    var pRows = _gbt('tr', pTbody[0]);

    for (var i = 0; i < pRows.length; i++) {
        var checkRow = Util.gc(pRows[i]);
        var curCheck = Util.gc(checkRow);
        if (curCheck.checked === true) {
            selectedCount += 1;

            selval = Util.gc(Util.gc(Util.gc(pRows[i], 3), 0), 0).innerHTML;
            synId = Util.gc(pRows[i], 5).innerHTML;
            sentId = Util.gc(pRows[i], 6).innerHTML;

            if (selval == "Med") {
                selvalNum = 1; //Submit the order as a perscription
            }
            else {
                selvalNum = 0; //Submit the order as a standard order
            }
            paramString += '{ORDER|' + synId + '|' + selvalNum + '|' + sentId + '|0|1}';
        }
    }

    var chkSearchMode = _g('pendingCheck');
    if (selectedCount === 0) {
        paramString = "No Orders Selected";
        alert("No Orders Selected");
    }
    else if (chkSearchMode.checked === true) {
        paramString += '|0|{2|127}{3|127}|8';
        javascript: MPAGES_EVENT('ORDERS', paramString);
        submitOrdRefresh();
    }
    else {
        paramString += '|0|{2|127}{3|127}|32';
        javascript: MPAGES_EVENT('ORDERS', paramString);
        submitOrdRefresh();
    }

} //end submitOrders

//refresh related sections after order submit
function submitOrdRefresh() {
    var paramString = '';
    //Make sure the sections are available before refreshing
    var lcUserPrefs = mpObj.userPrefs;
    if (lcUserPrefs.search(/c/) > -1) {
        //loadWithCBParameters('mp_pe_get_medications', secLoad, 'hml');
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + ",^" + mpObj.encString + "^";
        loadWithCBParameters('mp_pe_get_medications', medLoad, 'hml', paramString);
    }

    if (lcUserPrefs.search(/o/) > -1) {
        loadWithCBParameters('mp_pe_get_fav_tabs', favLoad, 'noe');
    }

    if (lcUserPrefs.search(/q/) > -1) {
        //loadWithCBParameters('mp_pe_get_outstand_ord', secLoad, 'oo')
        var encString = mpObj.encString;
        var ZeroEncStr = (encString && encString != "") ? encString + ",0.00" : "0.00";
        paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + ",^" + ZeroEncStr + "^";
        loadWithCBParameters('mp_pe_get_outstand_ord', secLoad, 'oo', paramString);
    }

    var pendTable = _g('pendingTable');
    var pendTbody = _gbt('tbody', pendTable);

    if (pendTbody[0].hasChildNodes()) {
        while (pendTbody[0].childNodes.length >= 1) {
            pendTbody[0].removeChild(pendTbody[0].firstChild);
        }
    }
    Util.Style.rcss(_g('noPending'), "noPendingOrd");
}


function fnAddMode(sec) { //add tab from pref object. replace hardcoded tab to make generic
    var objSec = sec + "Sec";

    if (objSec == "vitSec") {
        addVital();
    }
    else {
        var tabHREF = 'javascript:APPLINK(0,"' + mpObj.appName + '","/PERSONID=' + mpObj.personId + '/ENCNTRID=' + mpObj.encntrId + '/FIRSTTAB=^' + bedrockPrefs[objSec].tabLink + '+^")';
        document.getElementById(sec + 'Add').href = tabHREF;
    }

} // end fnAddMode

function hoverRefresh(o, l) {
    for (var i = 0; i < l; i++) {
        var curDet = o[i];
        curDet.style.display = 'none';
    }
}

function addVital() {
    //reset hover display for reload
    refreshLVGC();

    var formId = '000000.00';
    var paramString = mpObj.personId + "|" + mpObj.encntrId + "|" + formId + "|0|0";
    javascript: MPAGES_EVENT("POWERFORM", paramString);

    //reload sections
    reloadLVGC();
} //end addVital

function addVitalDet() {
    //reset hover display for reload
    refreshLVGC();

    var formId = this.id;
    var paramString = mpObj.personId + "|" + mpObj.encntrId + "|" + formId + "|0|0";
    javascript: MPAGES_EVENT("POWERFORM", paramString);

    //reload sections
    reloadLVGC();
} //end addVitalDet

// addDocDet
function addDocDet() {
    var menuVal = Util.gns(this);
    var cki = menuVal.firstChild.data;

    var paramString = mpObj.personId + "|" + mpObj.encntrId + "|" + cki + "|0.0";
    javascript: MPAGES_EVENT("POWERNOTE", paramString);  //uncomment these two and comment alert
    loadWithCBParameters('mp_pe_get_documents', secLoad, 'doc');
} //end addDocDet

//secinit
// The following functions were copied from Util.Core, a module within the Healthe Widget Library
// http://prototyping.healthe.cerner.corp/repo/release/site/com.cerner.healthe.navigator/healthe-widget-library/1.2/jsdoc/
function getPosition(e) {
    e = e || window.event;
    var cursor = { x: 0, y: 0 };
    if (e.pageX || e.pageY) {
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    }
    else {
        var de = document.documentElement;
        var b = document.body;
        cursor.x = e.clientX +
                               (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
        cursor.y = e.clientY +
                               (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
    }
    return cursor;
}

// The following functions were copied from Util.Style, a module within the Healthe Widget Library
// http://prototyping.healthe.cerner.corp/repo/release/site/com.cerner.healthe.navigator/healthe-widget-library/1.2/jsdoc/
function gvs() {
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

function gso() {
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
}

// Prepare the public API.
/* Hover Mouse Over */
function hmo(evt, n, disbl) {

    if (mpObj.editMode && disbl) {
        //do nothing
    }
    else {
        var s = n.style, p = getPosition(evt), top = p.y + 30, left = p.x + 20;
        evt = evt || window.event;
        //    n._ps = n.previousSibling;
        document.body.appendChild(n);
        s.display = "block";
        s.left = left + "px";
        s.top = top + "px";

    }
}

/* Hover Mouse Move */
function hmm(evt, n, disbl) {
    if (mpObj.editMode && disbl) {
        //do nothing
    }
    else {
        var s = n.style, p = getPosition(evt), vp = gvs(), so = gso(), left = p.x + 20, top = p.y + 30;

        if (left + n.offsetWidth > vp[1] + so[1]) {
            left = left - 40 - n.offsetWidth;
        }

        if (top + n.offsetHeight > vp[0] + so[0]) {
            if (top - 40 - n.offsetHeight < so[0]) {
                top = 20 + so[0];
            }
            else {
                top = top - 40 - n.offsetHeight;
            }
        }
        evt = evt || window.event;
        s.top = top + "px";
        s.left = left + "px";

    }
}

/* Hover Mouse Out*/
function hmt(evt, n, disbl) {
    if (mpObj.editMode && disbl) {
        //do nothing
    }
    else {
        evt = evt || window.event;
        n.style.display = "";
        Util.ia(n, n.previousSibling /*n._ps*/);

    }
}

/* Hover Setup */
function hs(e, n, disbl) {
    var priorBgColor = e.style.backgroundColor;
    var priorBorderColor = e.style.borderColor;

    if (n && n.tagName == "DL") {
        e.onmouseenter = function(evt) {
            e.onmouseover = null;
            e.onmouseout = null;
            hmo(evt, n, disbl);
        };
        e.onmouseover = function(evt) {
            if (mpObj.editMode && disbl) {
                //do nothing
            }
            else {
                e.style.backgroundColor = "#FFFFCC";
                e.style.borderColor = "#CCCCCC";
                hmo(evt, n, disbl);

            }
        };
        e.onmousemove = function(evt) {
            if (mpObj.editMode && disbl) {
                //do nothing
            }
            else {
                e.style.backgroundColor = "#FFFFCC";
                e.style.borderColor = "#CCCCCC";
                hmm(evt, n, disbl);
            }
        };
        e.onmouseout = function(evt) {
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
            hmt(evt, n, disbl);
        };
        e.onmouseleave = function(evt) {
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
            e.onmouseover = null;
            e.onmouseout = null;
            hmt(evt, n, disbl
			);
        };
        Util.Style.acss(n, "hover");

    }
}

// Setup Section hovers
function secInit(sec, el) {
    //med test flag
    var disbl;
    if (sec == 'hml') {
        disbl = true;
    }
    else {
        disbl = false;
    }
    //end med test flag
    var list = sec + '-info';
    var det = sec + '-det';
    var parentCont = _g(sec + 'Content');

    var ah = Util.Style.g(list, parentCont, el);
    var l = ah.length;
    for (var i = l; i--; ) {
        var m = ah[i];

        if (m) {
            var nm = Util.gns(Util.gns(m));
            if (nm) {
                if (Util.Style.ccss(nm, det)) {

                    hs(m, nm, disbl);
                }
            }
        }
    }
}
// end secinit

//load callback functions 
//load section with table 
function secLoadTable(xhr, sec) {
    //check for pref object
    var prefSec = sec + 'Body';

    if (bedrockPrefs[prefSec]) {
        var hasPlus = bedrockPrefs[prefSec].hasPlus;
        var scrollNum = bedrockPrefs[prefSec].scroll;
    }

    //clear for reload
    var secTable = _g(sec + 'table');
    var secTbody = _gbt('tbody', secTable);
    var doc = document;
    //Clear if result table present
    var newTableBody = _g(sec + 'body');

    if (newTableBody) {
        Util.de(newTableBody);
    }
    //clear if no results present
    var nrSpan = _g(sec + 'NR');
    if (nrSpan) {
        Util.de(nrSpan);
    }

    var secTableHTML = xhr
    if (secTableHTML.search(/no-doc/) > -1) {
        var tempSpan = doc.createElement("span");
        tempSpan.id = sec + 'NR';
        tempSpan.innerHTML = secTableHTML;
        Util.ia(tempSpan, secTable);
    }
    else {
        var secDiv = _g(sec + "BodyDiv")
        if (secDiv) {
            secDiv.innerHTML = secTableHTML;
        }

        var secTR = _gbt('tr', _g(sec + "body"));
        for (var i = 0; i < secTR.length; i++) {
            if (i % 2 === 0) {
                Util.Style.acss(secTR[i], "even");
            }
        }
        secInit('vs', 'DL');
    }

    //Set time span display
    var timeSpan = _g(sec + "Span");
    if (timeSpan && bedrockPrefs[prefSec].timeSpan != null) {
        timeSpan.innerHTML = bedrockPrefs[prefSec].timeSpan;
    }

    //Add or remove the +Add
    if (hasPlus) {
        appendPlusAdd(sec, mpObj.ipath)
    }

    //scroll vitals section
    if (secDiv) {
        var secTr = _gbt('tr', secDiv);
        if (scrollNum > 0) {
            var numOfRows = secTr.length;
            if (numOfRows <= scrollNum) {
                secDiv.style.height = 'auto';
            }
            else {
                var th = 0;
                var totalHeight;
                th = 2.6 * scrollNum;
                totalHeight = th + 'em';
                secDiv.style.height = totalHeight;
                Util.Style.acss(secDiv, "sec-scrl");
            }
        }

        //set up graphs
        var graphLinks = Util.Style.g("graph-link", secDiv, "a");
        var grLen = graphLinks.length;
        for (var i = grLen; i--; ) {
            Util.addEvent(graphLinks[i], "click", function() { graphIt(this) });
        }

    }
    //clear loading...
    if (_g('vitLoading')) {
        var vitLoading = _g('vitLoading');
        Util.de(vitLoading);
    }
    else if (_g('labLoading')) {
        var labLoading = _g('labLoading');
        Util.de(labLoading);
    }
    //add expand/collapse functionality for Lab groups
    var labGroups = Util.Style.g(sec + "-sub-sec-hd-tgl");
    var tglLen = labGroups.length;
    for (var k = tglLen; k--; ) {
        var labGroup = labGroups[k];
        Util.addEvent(labGroup, "click", expCol);
        var groupParent = Util.gp(Util.gp(labGroup));
        if (Util.Style.ccss(groupParent, "closed")) {
            labGroup.innerHTML = "+";
            labGroup.title = "Show Section";
        }
    }
}
//end load section with table

function graphIt(graphLink) {
    var idParams = graphLink.id;
    var graphParams = idParams.split("_");

    var sParam = "'^MINE^," + mpObj.personId + ",^" + graphParams[0] + "^," + graphParams[1] + ",^" + mpObj.fullName + "^," + mpObj.userId + "," + mpObj.pprCode + "'";
    //  var sParam = "'^MINE^," + mpObj.personId + ",^" + graphParams[0] + "^," + graphParams[1] + "," + mpObj.userId + "'";
    var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
    var graphCall = "javascript:CCLLINK('mp_pe_clin_smry_graph', " + sParam + ",1)";
    javascript: CCLNEWSESSIONWINDOW(graphCall, "_self", wParams, 0, 1);

    Util.preventDefault();
}

//load common sections
function secLoad(xhr, sec) {
    //notation to access pref object
    var prefSec = sec + 'Sec';

    if (bedrockPrefs[prefSec]) {
        var hasPlus = bedrockPrefs[prefSec].hasPlus;
        var scrollNum = bedrockPrefs[prefSec].scroll;
    }

    //clear for reload
    var contentSec = _g(sec + 'Content');
    if (contentSec) {
        contentSec.innerHTML = '';
        var totSec = Util.Style.g(sec + "-list", null, 'div');
        var totalCount = Util.Style.g("sec-total", totSec[0], "span");
        if (totalCount) {
            Util.de(totalCount[0]);
        }
        var secHTML = xhr
        contentSec.innerHTML = secHTML;
    }
    secInit(sec, 'DL');

    var totalAmt = sec + 'Count';
    if (_g(totalAmt)) {
        var sectotalTxt = _g(totalAmt).firstChild.data;

        var totalSpan = Util.cep('span'); //add class w/ display
        totalSpan.innerHTML = '<span class="sec-total">' + sectotalTxt + '</span>';
        var secMain = Util.Style.g(sec + "-list", null, 'div');
        var secCL = Util.Style.g("sec-title", secMain[0], "span");
        var secSpan = Util.gc(secCL[0]);

        if (hasPlus) {
            appendPlusAdd(sec, mpObj.ipath)
            var totalBefore = _g(sec + 'Add');
            if (totalBefore) {
                totalBefore.parentNode.insertBefore(totalSpan, totalBefore);
            }
            if (sec == "doc") {
                loadWithCBParameters('mp_pe_get_doc_favs', epathLoad);
            }
        }
        else {
            if (sec == "doc") {
                //Remove the document encounter pathway menu if +add is off
                Util.de(_g("docMenuLink"));
            }

            Util.ac(totalSpan, secSpan);
        }

    }
    //set up if scroll amount is set up
    if (scrollNum > 0) {
        if (secHTML.search(/<tr>/) > -1) {
            var results = _gbt('tr', contentSec);
        }
        else {
            var results = Util.Style.g(sec + "-info", contentSec, "dl");
        }

        var numberOfResults = results.length;

        if (numberOfResults <= scrollNum) {
            contentSec.style.height = 'auto';
        }
        else {
            var th = 0;
            var totalHeight;
            th = 1.3 * scrollNum //using line height factor for now due to closed sections not having clientHeight
            totalHeight = th + "em";

            contentSec.style.height = totalHeight;
            Util.Style.acss(contentSec, "sec-scrl");

        }

    }
} //end load section generic

//builds the favorite lists from json ajax response
function favLoad(tabFav, sec) {
    //check for pref object
    var prefSec = sec + 'Sec';

    if (bedrockPrefs[prefSec]) {
        var hasPlus = bedrockPrefs[prefSec].hasPlus;
        var scrollNum = bedrockPrefs[prefSec].scroll;
    }

    //clear loading...
    if (_g('noeLoading')) {
        var noeLoading = _g('noeLoading');
        Util.de(noeLoading);
    }

    if (hasPlus) {
        appendPlusAdd(sec, mpObj.ipath)
    }
    //Remove any existing event from this node
    Util.removeEvent(_g("pendingSubmit"), "click", submitOrders);
    //Add the click action to the node
    Util.addEvent(_g("pendingSubmit"), "click", submitOrders);

    var doc = document;
    //clear for reload
    doc.getElementById('tabs-1').innerHTML = ' ';
    doc.getElementById('tabs-2').innerHTML = ' ';
    doc.getElementById('tabs-3').innerHTML = ' ';
    doc.getElementById('tabs-4').innerHTML = ' ';
    doc.getElementById('tabs-5').innerHTML = ' ';

    var msgTabFav = tabFav

    try {
        var jsonFav = (JSON.parse(msgTabFav)).TAB_FAV.FAVORITE;
    }
    catch (err) {
        alert(err.description);
    }
    var htmlMedFav = ['<div class="tbContentDiv1"><table class="favs-tbl" id="favsTable">'];
    var htmlLabFav = ['<div class="tbContentDiv2"><table class="favs-tbl" id="labfavsTable">'];
    var htmlImgFav = ['<div class="tbContentDiv3"><table class="favs-tbl" id="imagefavsTable">'];
    var htmlBillFav = ['<div class="tbContentDiv4"><table class="favs-tbl" id="billfavsTable">'];
    var htmlOtherFav = ['<div class="tbContentDiv5"><table class="favs-tbl" id="otherfavsTable">'];
    var folderName = '';
    var currFav = '';
    var currSyn = '';
    var currSent = '';
    var currDisp = '';
    var numId = 0;
    var medCnt = 0, labCnt = 0, imgCnt = 0, billCnt = 0, otherCnt = 0;

    jsonFav.sort(function(obj1, obj2) {
        function checkStrings(s1, s2) {
            return (s1 === s2) ? 0 : ((s1 > s2) ? 1 : -1);
        }
        return checkStrings(obj1.MNEM.toUpperCase(), obj2.MNEM.toUpperCase());
    });

    for (var j = 0, l = jsonFav.length; j < l; j++) {
        numId = numId + 1;
        var localFav = jsonFav[j];
        currSyn = localFav.SYNID;
        currSent = localFav.SENTID;
        currFav = localFav.MNEM;
        currDisp = localFav.DISPLINE;
        currType = localFav.FAVTYPE;
        arrDetLineLab = [currFav, '</a><span class="detTxt">', currDisp, '</span>'];
        txtDetLineLab = arrDetLineLab.join("");

        function addToFav(favArray, type) {
            favArray.push('<tr id="lmed', numId, '">',
				'<td><a class="', type, '" id="lab', numId + '" >', txtDetLineLab, '</td>',
				'<td class="favHidden" id="favlab', numId, '">', currFav, '</td>',
				'<td class="favHidden" id="displab', numId, '">', currDisp, '</td>',
				'<td class="favHidden" id="synlab', numId, '">', currSyn, '</td>',
				'<td class="favHidden" id="sentlab', numId, '">', currSent, '</td></tr>');
        }

        if (currType == "Meds") {
            addToFav(htmlMedFav, "medCheck");
            medCnt += 1;
        }
        else if (currType == "Labs") {
            addToFav(htmlLabFav, "labCheck");
            labCnt += 1;
        }
        else if (currType == "Imaging") {
            addToFav(htmlImgFav, "labCheck");
            imgCnt += 1;
        }
        else if (currType == "Billing") {
            addToFav(htmlBillFav, "labCheck");
            billCnt += 1;
        }
        else {
            addToFav(htmlOtherFav, "labCheck");
            otherCnt += 1;
        }

    }

    htmlMedFav.push('</table></div>');
    htmlLabFav.push('</table></div>');
    htmlImgFav.push('</table></div>');
    htmlBillFav.push('</table></div>');
    htmlOtherFav.push('</table></div>');

    if (medCnt === 0) {
        htmlMedFav = ['<div class="tbContentDiv1"><table class="favs-tbl" id="favsTable"><tr><td>No Med Favorites Found</td></tr></table></div>'];
    }
    if (labCnt === 0) {
        htmlLabFav = ['<div class="tbContentDiv2"><table class="favs-tbl" id="labfavsTable"><tr><td>No Lab Favorites Found</td></tr></table></div>'];
    }
    if (imgCnt === 0) {
        htmlImgFav = ['<div class="tbContentDiv3"><table class="favs-tbl" id="imagefavsTable"><tr><td>No Imaging Favorites Found</td></tr></table></div>'];
    }
    if (billCnt === 0) {
        htmlBillFav = ['<div class="tbContentDiv4"><table class="favs-tbl" id="billfavsTable"><tr><td>No Billing Favorites Found</td></tr></table></div>'];
    }
    if (otherCnt === 0 || currFav == "No Favorites Found") {
        htmlOtherFav = ['<div class="tbContentDiv5"><table class="favs-tbl" id="otherfavsTable"><tr><td>No Other Favorites Found</td></tr></table></div>'];
    }

    var medarray = htmlMedFav.join('');
    var labarray = htmlLabFav.join('');
    var imgarray = htmlImgFav.join('');
    var billarray = htmlBillFav.join('');
    var otherarray = htmlOtherFav.join('');

    doc.getElementById('tabs-1').innerHTML = medarray;
    doc.getElementById('tabs-2').innerHTML = labarray;
    doc.getElementById('tabs-3').innerHTML = imgarray;
    doc.getElementById('tabs-4').innerHTML = billarray;
    doc.getElementById('tabs-5').innerHTML = otherarray;

    //set to scroll if fav count greater than scrollNum
    if (scrollNum > 0) {
        if (medCnt <= scrollNum) {
            Util.Style.g("tbContentDiv1")[0].style.height = 'auto';
        }
        else {
            var content1 = Util.Style.g("tbContentDiv1")[0];
            content1.style.height = (scrollNum * 1.3) + 'em';
            content1.style.overflowY = 'scroll';
        }
        if (labCnt <= scrollNum) {
            Util.Style.g("tbContentDiv2")[0].style.height = 'auto';
        }
        else {
            var content2 = Util.Style.g("tbContentDiv2")[0];
            content2.style.height = (scrollNum * 1.3) + 'em';
            content2.style.overflowY = 'scroll';
        }
        if (imgCnt <= scrollNum) {
            Util.Style.g("tbContentDiv3")[0].style.height = 'auto';
        }
        else {
            var content3 = Util.Style.g("tbContentDiv3")[0];
            content3.style.height = (scrollNum * 1.3) + 'em';
            content3.style.overflowY = 'scroll';
        }
        if (billCnt <= scrollNum) {
            Util.Style.g("tbContentDiv4")[0].style.height = 'auto';
        }
        else {
            var content4 = Util.Style.g("tbContentDiv4")[0];
            content4.style.height = (scrollNum * 1.3) + 'em';
            content4.style.overflowY = 'scroll';
        }
        if (otherCnt <= scrollNum) {
            Util.Style.g("tbContentDiv5")[0].style.height = 'auto';
        }
        else {
            var content5 = Util.Style.g("tbContentDiv5")[0];
            content5.style.height = (scrollNum * 1.3) + 'em';
            content5.style.overflowY = 'scroll';
        }
    }
    //set up tabs
    var tabList = _gbt("a", _g('toc'));
    var len = tabList.length;
    for (var i = len; i--; ) {

        Util.addEvent(tabList[i], "click", function() {
            Util.preventDefault();
            var hrefStart = this.href.lastIndexOf("#");
            var theId = this.href.substr(hrefStart + 1);
            var theActives = Util.Style.g("active");
            var aLen = theActives.length;
            for (var j = aLen; j--; ) {
                var localActive = theActives[j];
                Util.Style.rcss(localActive, "active");
                Util.Style.acss(localActive, "inactive");
            }
            Util.Style.acss(this, "active");
            Util.Style.rcss(_g(theId), "inactive");
            Util.Style.acss(_g(theId), "active");

        }
		);
    }

    //add click events to favorite links
    var checks = Util.Style.g("medCheck");
    var cLen = checks.length;
    for (var i = cLen; i--; ) {
        Util.addEvent(checks[i], "click", labClick);
    }

    var checks = Util.Style.g("labCheck");
    var cLen = checks.length;
    for (var i = cLen; i--; ) {
        Util.addEvent(checks[i], "click", labClick);
    }

}  //end favLoad

function formLoad(forms) {
    var msgForms = forms
    try {
        var jsonForms = (JSON.parse(msgForms)).FORM_REC;
    }
    catch (err) {
        alert(err.description);
    }

    var tempDiv = document.createElement('div');
    var tempHTML = '';
    var jForms = jsonForms.FORMS;
    if (jForms[0].POWER_FORM === "None_Found") {
        tempDiv = _g("vitMenu");
        Util.de(tempDiv); 		//Remove the drop-down menu
        tempDiv = _g("vitMenuLink");
        Util.de(tempDiv); 		//Remove the drop-down icon
    }
    else {
        var fLen = jsonForms.FORMS.length;
        for (var i = 0; i < fLen; i++) {
            var localForm = jForms[i];
            tempHTML += '<div><a id="' + localForm.FORM_ID + '" href="#">' + localForm.POWER_FORM + '</a></div>';
        }

        tempDiv.innerHTML = tempHTML;
        Util.ac(tempDiv, _g("vitMenu"));

        //set up form click events
        var vitMenu0 = _g("vitMenu");
        var vitMenuList = _gbt('a', vitMenu0);
        var fmLen = vitMenuList.length;
        for (var i = fmLen; i--; ) {
            Util.addEvent(vitMenuList[i], "click", addVitalDet);
        }
        //set up menu close
        closeMenuInit(_g('vitMenu'));
    }
} //end formLoad

//builds favorite encounter pathways for doc section from json ajax response
function epathLoad(epFav) {
    //load documents
    var localPath = mpObj.ipath;
    var msgEP = epFav
    try {
        var jsonEpFav = JSON.parse(msgEP);
    }
    catch (err) {
        alert(err.description);
    }

    if (_g('docMenuLink') == null) {
        var htmlEpFav = ['<a class="menu" id="docMenuLink" href="#"><img class="pic" src="' + localPath + '\\images\\3943_16.gif" /></a><div class="menu-content menu-hide" id="docMenu"><div>'];
        var numId = 0;
        var ep = jsonEpFav.ENC_PATH.PATHWAY;
        ep.sort(function(obj1, obj2) {
            function checkStrings(s1, s2) {
                return (s1 === s2) ? 0 : ((s1 > s2) ? 1 : -1);
            }
            return checkStrings(obj1.DISPLAY.toUpperCase(), obj2.DISPLAY.toUpperCase());
        }
		);

        if (ep[0].DISPLAY === "NONE_FOUND") {
            htmlEpFav.push('<div>', 'No Favs Found', '<span class="favHidden" id="docCKI', numId, '">', ' ', '</span></div>');
        }
        else {
            for (var j = 0, l = ep.length; j < l; j++) {
                var epPathway = ep[j]
                numId = numId + 1;
                htmlEpFav.push('<div><a id="doc', numId, '" href="#">', epPathway.DISPLAY, '</a>',
					'<span class="favHidden" id="docCKI', numId, '">', epPathway.CKI, '</span></div>');
            }
        }
        htmlEpFav.push('</div>');

        var eparray = htmlEpFav.join('');
        var newDiv = Util.cep('span');
        newDiv.innerHTML = eparray;

        var docSec0 = Util.Style.g("doc-list");
        var docSecCL = Util.Style.g("sec-title", docSec0[0], "span");
        var docSecSpan = Util.gc(docSecCL[0]);
        Util.ia(newDiv, docSecSpan); //previous plusadd sec

        //doc more add options
        var docMenu0 = _g("docMenu");
        var docMenuList = _gbt('a', docMenu0);
        var dmLen = docMenuList.length;
        for (var i = dmLen; i--; ) {
            Util.addEvent(docMenuList[i], "click", addDocDet);
        }
        //set up menu close
        closeMenuInit(docMenu0);

        //set up doc flyout menu
        var docFly = _g('docMenuLink');
        Util.addEvent(docFly, "click",
			function() {
			    if (Util.Style.ccss(Util.gns(this), "menu-hide")) {
			        _g('k').style.zIndex = 2;
			        Util.preventDefault();
			        Util.Style.rcss(Util.gns(this), "menu-hide");
			    }
			    else {
			        _g('k').style.zIndex = 1;
			        Util.Style.acss(Util.gns(this), "menu-hide");
			    }

			}
		);
    }
}
//end epath load

//function to close the flyout menu
function closeMenuInit(inMenu) {
    var menuId;

    if (inMenu.id == 'docMenu') {
        menuId = 'k';
    }
    else if (inMenu.id == 'vitMenu') {
        menuId = 'l';
    }
    else if (inMenu.id == 'moreOptMenu') {
        menuId = 'c';
    }


    if (!e) var e = window.event;
    if (window.attachEvent) {
        Util.addEvent(inMenu, "mouseleave", function() {
            Util.Style.acss(inMenu, "menu-hide");
            _g(menuId).style.zIndex = 1;
        });
    }
    else {
        Util.addEvent(inMenu, "mouseout", menuLeave);
    }

    function menuLeave(e) {
        if (!e) var e = window.event;
        var relTarg = e.relatedTarget || e.toElement;
        if (e.relatedTarget.id == inMenu.id) {
            Util.Style.acss(inMenu, "menu-hide");
            _g(menuId).style.zIndex = 1;
        }
        e.stopPropagation();
        Util.cancelBubble(e);
    }
} //end closeMenuInit

function demographicLoad(demoInput) {
    var jsonDemo = JSON.parse(demoInput);
    var jsonDmIds = jsonDemo.ids;
    mpObj.personId = jsonDmIds.person_id;
    mpObj.userId = jsonDmIds.user_id;
    mpObj.encntrId = jsonDmIds.encntr_id;
    mpObj.fullName = jsonDmIds.name;
    mpObj.appName = jsonDmIds.app_name;
    mpObj.posCode = jsonDmIds.pos_code;
    mpObj.pprCode = jsonDmIds.ppr_code;
    var sexCd = jsonDmIds.sex.toUpperCase();
    var sexDisplay = "U";
    if (sexCd == "FEMALE") {
        sexDisplay = "F";
    }
    else if (sexCd == "MALE") {
        sexDisplay = "M";
    }

    var demoHTML = ['<dl class="dmg-info"><dt class="dmg-pt-name-lbl"><span>Patient Name:</span></dt><dd class="dmg-pt-name"><span>',
					jsonDmIds.name, '</span></dd><dt class="dmg-sex-age-lbl"><span>Sex, Age:</span></dt><dd class="dmg-sex-age"><span>',
					sexDisplay, ' ', jsonDmIds.age, '</span></dd><dt><span>DOB:</span></dt><dd class="dmg-dob"><span>',
					jsonDmIds.dob, '</span></dd><dt><span>MRN:</span></dt><dd class="dmg-mrn"><span>',
					jsonDmIds.mrn, '</span></dd><dt><span>FIN:</span></dt><dd class="dmg-fin"><span>',
					jsonDmIds.fin, '</span></dd><dt><span>Visit Reason:</span></dt><dd class="dmg-rfv"><span>',
					jsonDmIds.rfv, '</span></dd></dl><span class="disclaimer">This page is not a complete source of visit information.</span>'];

    var demoarray = demoHTML.join('');
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = demoarray;

    _g('banner').appendChild(tempDiv);
} //end demographicLoad

//set up section header links	
function setPrefs(p) {
    var link = "";
    var scrollNum = "";
    var plusAdd = false;
    var timeSpan = "";

    try {
        var prefJSON = JSON.parse(p);
    }
    catch (err) {
        alert('Error Setting Preferences: ' + err.description);
    }
    var pLen = prefJSON.Prefs.length;
    for (var i = pLen; i--; ) {
        var lPrefs = prefJSON.Prefs[i].pref;

        /*Load the time span display*/
        if (lPrefs.time_span !== "") {
            timeSpan = lPrefs.time_span;
        }

        /*Set the scroll preferences*/
        if (lPrefs.scroll.search(/Yes/) > -1) {
            scrollNum = lPrefs.scroll.replace("Yes - ", "");
        }
        else {
            scrollNum = null;
        }

        /*Set the +Add preferences*/
        if (lPrefs.add_link === "default") {
            //Default actions taken
            if (lPrefs.link.search(/Yes/) > -1) {
                //make the +Add link the same as the link 
                plusAdd = true;
            }
            else {
                //Remove the +Add
                plusAdd = false;

            }
        }
        else if (lPrefs.add_link.search(/Yes/) > -1) {
            //Add the +add link the +Add icon
            link = (lPrefs.link).replace("Yes - ", "");
            plusAdd = true;
        }
        else {
            //Remove the +Add
            plusAdd = false;
        }

        bedrockPrefs(lPrefs.section_id, link, plusAdd, scrollNum, timeSpan);

    } //end for loop
}  //end setPrefs

function savePrefs() {
    paramString = "^MINE^," + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", ^" + mpObj.appName + "^," + mpObj.posCode + "," + mpObj.pprCode;
    javascript: CCLLINK('mp_pe_clin_smry_set', paramString, 1);
}

function appendPlusAdd(sec, path) {
    var img = Util.cep("img", { "src": path + '\\images\\3941.gif' });
    var link = Util.cep("a", { 'className': 'addPlus', 'id': sec + 'Add' });
    var linkText = document.createTextNode('Add');

    //clear for reload
    if (_g(sec + 'Add')) {
        Util.de(_g(sec + 'Add'));
    }

    Util.ac(img, link);
    Util.ac(linkText, link);
    var sec0 = Util.Style.g(sec + "-list");
    var secCL = Util.Style.g("sec-title", sec0[0], "span");
    var secSpan = Util.gc(secCL[0]);

    if (sec == "vit") {
        Util.ia(link, _g(sec + "Span"))
    }
    else {
        Util.ac(link, secSpan);
    }

    Util.addEvent(_g(sec + "Add"), "click", function() { fnAddMode(sec) });
}

//Load meds
function medLoad(xhr, sec) {
    var prefSec = sec + 'Sec';
	var hasPlus, scrollNum, timeSpan;
    if (bedrockPrefs[prefSec]) {
        hasPlus = bedrockPrefs[prefSec].hasPlus;
        scrollNum = bedrockPrefs[prefSec].scroll;
        timeSpan = bedrockPrefs[prefSec].timeSpan;
    }

    var medData = xhr;
    var jsonEval = JSON.parse(medData);
    var jsMedHTML = []; 
    var medHTML = "";
    var medLen = 0;
    var medHd = "";
    var medFt = "";
    var countText = "";
	var evCsInit = jsonEval.CS_INIT;
    var medMod = evCsInit.MED_REFILL; //pref to turn on modification functionality
    var medCount = evCsInit.MED_CNT;
	var ipath = mpObj.ipath;
    //make sure edit mode is reset after refresh
    mpObj.editMode = false;

    if (medCount !== 0) {
        var medObj = evCsInit.MED;
        medLen = medObj.length;
        countText = "( " + medLen + " )";

        medHd = '';
        if (medMod) {
            medFt = '<div id="medRnwRow"><button class="rnw-btn" id="medRnwBtn" disabled="true"><img id="medRnwImg" src="' + ipath + '\\images\\renew_disabled.gif" alt="" /> Renew </button>'
					+ '<button class="rnw-btn" id="medCnclBtn" disabled="true"><img id="medCnclImg" src="' + ipath + '\\images\\cancel_disabled.gif" alt="" /> Cancel/DC </button>'
					+ '<button class="rnw-btn" id="medCmpltBtn" disabled="true"><img id="medCmpltImg" src="' + ipath + '\\images\\complete_disabled.gif" alt="" /> Complete </button></div>'
					+ '<div id="medSgnRow"> <span class="med-route">Routing: <a id="routeLink" class="dthrd" title="Go To Orders">None Defined</a></span>'
					+ '<button class="rnw-btn" id="medSgnBtn" disabled="true"> Sign </button></div>';
        }

        for (var i = 0; i < medLen; i++) {
            var medItem = medObj[i];
            var medName = medItem.NAME;
            var sigLine = medItem.DOSE + " " + medItem.DOSE_UNIT + " " + medItem.VOLUME + " " + medItem.VOLUME_UNIT + " " + medItem.ROUTE + " " + medItem.FREQ + " " + medItem.PRN;
            var orderedAs = medItem.ORD_AS_MN;
            var ordDate = medItem.ORIG_DATE;
            var clinSig = medItem.CLIN_SIG;
            var orderedBy = medItem.ORDERED_BY;
            var ordType = medItem.TYPE;
            var ordId = medItem.ORDER_ID;
            var dur = medItem.DURATION;
            var durUC = medItem.DURATION_UNIT_CD;
            var dispDur = medItem.DISP_DURATION;
            var dispDurUC = medItem.DISP_DURATION_UNIT_CD;
            var dispQty = medItem.DISPENSE_QTY;
            var dispQtyUnit = medItem.DISPENSE_QTY_UNIT;
            var dispQtyUC = medItem.DISPENSE_QTY_UNIT_CD;
            var numRfl = medItem.NBR_REFILLS;
            var imgType;   
            var imgClass;
            var edtCls;

            if (medItem.TYPE == 'Documented') {
                imgType = 'hx.gif'; 
                imgClass = 'hx';
                edtCls = "-hx";
            }
            else { //Prescribed
                imgType = 'rx.gif';
                imgClass = 'rx';
                edtCls = "";
            }

            if (dispQty) {
                if (parseInt(dispQty, 10)) {
                    dispQty = parseInt(dispQty, 10);
                }
                else {
                    dispQty = 0;
                }
                sigLine += ' <span class="disp-q' + edtCls + '" id="dq' + ordId + '"><span class="dq-qty" id="dqQty' + ordId + '">' + dispQty + '</span><span class="dq-tp"> ' + dispQtyUnit + '</span></span>';
            }

            if (numRfl) {
                if (parseInt(numRfl, 10)) {
                    numRfl = parseInt(numRfl, 10);
                }
                else {
                    numRfl = 0;
                }
                sigLine += ' <span class="rfl' + edtCls + '" id="rfl' + ordId + '">' + numRfl + ' refills</span>';
            }
            else if (imgClass == 'rx') {
                numRfl = 0;
                sigLine += ' <span class="rfl" id="rfl' + ordId + '">' + numRfl + ' refills</span>';
            }

            jsMedHTML.push('<h3 class="hml-med"><span>', orderedAs, '</span></h3><dl class="hml-info ', imgClass, '" id="', ordId, '"><dt class="hml-name"><span>Medication Name</span></dt>',
			'<span class="rx-hx"><img src="', ipath, '\\images\\', imgType, '" alt="" class="', imgClass, '" /></span><dd class="hml-name"><span>', orderedAs,
			'</span></dd><dt class="hml-sig"><span><abbr title="Signature Line">Sig. Line</abbr></span></dt><dd class="hml-sig"><span>', sigLine,
			'</span></dd><dd class="dur">', dur, '</dd><dd class="dur-cd">', durUC, '</dd><dd class="disp-dur">', dispDur, '</dd><dd class="disp-dur-cd">', dispDurUC, '</dd><dd class="disp-qty-cd">', dispQtyUC, '</dd></dl>',
			'<h4 class="hml-det-hd"><span>Medication Details</span></h4><dl class="hml-det"><dt class="hml-det-name"><span>Medication:</span></dt><dd class="hml-det-name">', medName,
			'</dd><dt class="hml-det-date"><span>Ordered As:</span></dt><dd class="hml-det-date">', orderedAs,
			'</dd><dt class="hml-det-ld"><span>Order Date:</span></dt><dd class="hml-det-ld">', ordDate,
			'</dd><dt class="hml-det-ld"><span>SIG:</span></dt><dd class="hml-det-ld">', clinSig,
			'</dd><dt class="hml-det-ld"><span>Ordered By:</span></dt><dd class="hml-det-ld">', orderedBy,
			'</dd><dt class="hml-det-ld"><span>Type:</span></dt><dd class="hml-det-ld">', ordType,
			'</dd></dl>');
        }
    }
    //else no doc
    else {
        jsMedHTML.push("<h3 class='no-doc' ><span class='no-gc'>No Results Found</span></h3>");
        countText = "( 0 )";
    }

    medHTML = jsMedHTML.join("");
    secLoadJSON(medHd, medHTML, medFt, "hml", countText, scrollNum);

    var hmlLspan = _g('hmlLoading');

    if (hasPlus) { 
        var menuHTML = '<span id="hmlSpan">' + countText + '</span>'
						+ '<a class="addPlus" id="hmlAdd"><img class="pic" src="' + ipath + '\\images\\3941.gif" />Add</a>'; 
        hmlLspan.innerHTML = menuHTML;

        //plusadd click event
        Util.addEvent(_g('hmlAdd'), "click", function() { fnAddMode(sec) });

    }
    else {
        hmlLspan.innerHTML = '<span id="hmlSpan">' + countText + '</span>';
    }
    if (medMod && medCount !== 0) {
        //reset med mod menu if it exists
		var mnuMoreOpt = _g('moreOpt');
        if (mnuMoreOpt) {
            Util.de(mnuMoreOpt);
        }

        var menuFrag = Util.ce('span');
        menuFrag.innerHTML = '<span id="moreOpt">&nbsp;'
							+ '<div class="menu-content menu-hide" id="moreOptMenu">'
							+ '<div class="med-opt dthrd" id="mnuRenew">Renew Prescription</div>'
							+ '<div class="med-opt dthrd" id="mnuCancel">Cancel/DC</div>'   
							+ '<div class="med-opt dthrd" id="mnuComplete">Complete</div>'   
							+ '<div class="med-opt dthrd" id="rnwReset">Reset</div>'
							+ '<div class="med-opt dthrd" id="gtOrders">Go To Orders</div>'
							+ '<div class="med-opt dthrd" id="mnuSign">Sign</div>'
							+ '<div>'
							+ '</span>';
        var secHdTgl = Util.Style.g('sec-hd-tgl', _g('c'), 'span')[0];
        Util.ia(menuFrag, secHdTgl);

        //init menu
        var optMenu = _g("moreOptMenu");
        Util.addEvent(_g('moreOpt'), "click", function() {
            if (Util.Style.ccss(optMenu, "menu-hide")) {
                Util.Style.rcss(optMenu, "menu-hide");
            }
            else {
                Util.Style.acss(optMenu, "menu-hide");
            }
        });
        closeMenuInit(optMenu);

        var menuRows = Util.Style.g("med-opt", optMenu, 'div');
        var mnLen = menuRows.length;
        for (var i = mnLen; i--; ) {
            Util.addEvent(menuRows[i], "mouseover", hltRow);
            Util.addEvent(menuRows[i], "mouseout", unHltRow);
        }

        //add reset button click event		
        Util.addEvent(_g("rnwReset"), "click", resetRows);

        if (medCount !== 0) {
            //add row click events
            var medRows = Util.Style.g("hml-info");
            var mrLen = medRows.length;
            for (var i = mrLen; i--; ) {
                Util.addEvent(medRows[i], "click", medRowSel);
            }

            //add button click events
            Util.addEvent(_g("medRnwBtn"), "click", queueOrder);
            Util.addEvent(_g("medCnclBtn"), "click", queueOrder);
            Util.addEvent(_g("medCmpltBtn"), "click", queueOrder);

            //add menu click events
            Util.addEvent(_g("mnuRenew"), "click", queueOrder);
            Util.addEvent(_g("mnuCancel"), "click", queueOrder);
            Util.addEvent(_g("mnuComplete"), "click", queueOrder);

            Util.addEvent(_g("medSgnBtn"), "click", signMedMods);
            Util.addEvent(_g("mnuSign"), "click", signMedMods);
            Util.addEvent(_g("gtOrders"), "click", signMedMods);
            /////////Get Default routing
            var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
            var m_dPersonId = parseFloat(mpObj.personId);
            var m_dEncounterId = parseFloat(mpObj.encntrId);
            //create moew to get default routing
            var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(m_dPersonId, m_dEncounterId, 0, 2, 127);
            var m_defaultRoutingStr = PowerOrdersMPageUtils.GetDefaultRoutingDisplay(m_hMOEW);
            PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);

            var rtLink = _g('routeLink');
            if (m_defaultRoutingStr) {
                rtLink.innerHTML = m_defaultRoutingStr;
            }

            Util.addEvent(rtLink, "click", signMedMods);
        }
    }
    //end renewal menu

	//remove user selection for med section so it doesn't interfere with custom shift + click behavior
	var mSec = _g('c');
	mSec.onselectstart = function() {
		return false;
	}
	//end range disable
} //end medload

//highlight/unhighlights rows to queue and enabled/disables buttons/menu items based on selection
var lastMedSel;
function medRowSel(e) {
   if (!e) {
     e = window.event;
  }   
	//allow multi select if shift key pressed
	if (e.shiftKey && lastMedSel) {
		var startPos = _g(lastMedSel);
		var strtIndx;
		var endIndx;
		var medRows = Util.Style.g("hml-info", _g('c'), 'dl');
		var medLen = medRows.length;
		//get start and end position of multi select
		for (var i=0; i<medLen; i++) {
			var curId = medRows[i].id;
			if (curId == lastMedSel) {
				strtIndx = i;
			}
			else if (curId == this.id) {
				endIndx = i;
			}
		}
		//flip positions for multi select up
		if (strtIndx > endIndx) {
			var tempIndx = strtIndx;
			strtIndx = endIndx;
			endIndx = tempIndx;
		}				

		for (var j= strtIndx; j<=endIndx; j++) {
			Util.Style.acss(medRows[j], "med-selected");
			var curImg = _gbt('img', medRows[j])[0];
			var curSrc = curImg.src;
			if (curSrc.search(/_selected/) == -1) {
				var newSrc = curSrc.replace(".gif", "_selected.gif");
				curImg.src = newSrc;
			}
		}
		//reset last med row selected
		lastMedSel = null;
	}
		
	else {
    this.style.background = '#0000FF';

    var curImg = _gbt('img', this)[0];
    var curSrc = curImg.src;
    if (Util.Style.ccss(this, "med-selected")) {
        Util.Style.rcss(this, "med-selected");
		//reset last row selected on deselect
		lastMedSel = null;
        //switch images for selected/unselected rows
        if (curSrc.search(/_selected/) > -1) {
            var newSrc = curSrc.replace("_selected.gif", ".gif");
            curImg.src = newSrc;
            this.style.background = '#FFFFFF';
        }
    }
    else {
        Util.Style.acss(this, "med-selected");
		//set last row selected for multi select
		lastMedSel = this.id;
        if (curSrc.search(/_selected/) == -1) {
            var newSrc = curSrc.replace(".gif", "_selected.gif");
            curImg.src = newSrc;
        }
    }
	}
    var selectLen = Util.Style.g('med-selected').length;
    if (selectLen > 0) {
        //refresh hovers when not in edit mode
        if (selectLen == 1 && !mpObj.editMode) {
            var hmlDets = Util.Style.g('hml-det');
            var detLen = hmlDets.length;
            for (var i = detLen; i--; ) {
                hmlDets[i].style.display = 'none';
            }
        }
        mpObj.editMode = true;
        enableActions();

        var selectedRows = Util.Style.g("med-selected", _g("hmlBody"), "dl");
        //enable reset if row(s) selected
        for (var j = selectLen; j--; ) {
            if (Util.Style.ccss(selectedRows[j], "rnwd") || Util.Style.ccss(selectedRows[j], "cncld") || Util.Style.ccss(selectedRows[j], "cmplt")) {
                Util.Style.rcss(_g("rnwReset"), "dthrd");
                break;
            }
            else {
                if (j === 0) {
                    Util.Style.acss(_g("rnwReset"), "dthrd");
                }
            }
        }
    }
    else {
        var rnwdLen = Util.Style.g('rnwd').length;
        var cncldLen = Util.Style.g('cncld').length;
		var cmpltLen = Util.Style.g('cmplt').length;
        if (rnwdLen === 0 && cncldLen === 0 && cmpltLen === 0) {
            mpObj.editMode = false;
        }
        disableActions();
    }
}

function hltRow() {
    if (!Util.Style.ccss(this, "dthrd")) {
        Util.Style.acss(this, "mnu-hvr");
    }
}
function unHltRow() {
    if (!Util.Style.ccss(this, "dthrd")) {
        Util.Style.rcss(this, "mnu-hvr");
    }
}

function enableActions() {
    //enable buttons and switch to active image
	var ipath = mpObj.ipath;
    _g("medRnwBtn").disabled = false;
    _g("medCnclBtn").disabled = false;
    _g("medCmpltBtn").disabled = false;
    _g("medRnwImg").src = ipath + "\\images\\renew.gif";
    _g("medCnclImg").src = ipath + "\\images\\cancel.gif";
    _g("medCmpltImg").src = ipath + "\\images\\complete.gif";
    //activate menu items
    Util.Style.rcss(_g("mnuRenew"), "dthrd");
    Util.Style.rcss(_g("mnuComplete"), "dthrd");
    Util.Style.rcss(_g("mnuCancel"), "dthrd");
}

function disableActions() {
    //disable buttons and switch to disabled image
	var ipath = mpObj.ipath;
    _g("medRnwBtn").disabled = true;
    _g("medCnclBtn").disabled = true;
    _g("medCmpltBtn").disabled = true;
    _g("medRnwImg").src = ipath + "\\images\\renew_disabled.gif";
    _g("medCnclImg").src = ipath + "\\images\\cancel_disabled.gif";
    _g("medCmpltImg").src = ipath + "\\images\\complete_disabled.gif";
    //disable menu items
    Util.Style.acss(_g("mnuRenew"), "dthrd");
    Util.Style.acss(_g("mnuComplete"), "dthrd");
    Util.Style.acss(_g("mnuCancel"), "dthrd");
    //reset disable
    Util.Style.acss(_g("rnwReset"), "dthrd");
}

//marks row(s) with appropriate class for action to take on submit
function queueOrder(e) {
    if (Util.Style.ccss(this, "dthrd")) {
        if (!e) var e = window.event;
        Util.cancelBubble(e);
    }
    else {
        var rType;
        if (this.id == 'medRnwBtn' || this.id == 'mnuRenew') {
            rType = 'rnwd';
        }
        else if (this.id == 'medCnclBtn' || this.id == 'mnuCancel') {
            rType = 'cncld';
        }
        else if (this.id == 'medCmpltBtn' || this.id == 'mnuComplete') {
            rType = 'cmplt';
        }
        var selectedRows = Util.Style.g("med-selected", _g("hmlBody"), "dl");
        var selRowLen = selectedRows.length;
        for (var i = 0; i < selRowLen; i++) {
            var selRow = selectedRows[i];
            var origDispQty;
            var origRflQty;

            var curDispQ = Util.Style.g("disp-q", selRow, "span")[0];
            if (curDispQ) {
                origDispQty = Util.Style.g("dq-qty", curDispQ, "span")[0].innerHTML;
                Util.Style.acss(curDispQ, "disp-q-rnw");
                Util.addEvent(curDispQ, "click", changeDispQ);
            }

            var curRfl = Util.Style.g("rfl", selRow, "span")[0];
            if (curRfl) {
                Util.Style.acss(curRfl, "rfl-rnw");
                origRflQty = (curRfl.innerHTML).replace(" refills", '');
                Util.addEvent(curRfl, "click", changeRfl);
            }

            var imgSpan = Util.Style.g("rx-hx", selRow, "span");
            var curImg = Util.gc(imgSpan[0]);
            //create object to store original values if none exists
            if (!origOrder[selRow.id]) {
				var origSrc;
                if (curImg.src.search(/_selected/) > -1) {
                    origSrc = curImg.src.replace("_selected.gif", ".gif");
                }
                else {
                    origSrc = curImg.src;
                }
                origOrder(selRow.id, origDispQty, origRflQty, origSrc);
            }

            Util.Style.rcss(selRow, "med-selected");
            Util.Style.rcss(selRow, "rnwd");
            Util.Style.rcss(selRow, "cncld");
            Util.Style.rcss(selRow, "cmplt");
            Util.Style.acss(selRow, rType);

            if (rType == "rnwd") {
                curImg.src = mpObj.ipath + '\\images\\renew.gif';
            }
            else if (rType == "cncld") {
                curImg.src = mpObj.ipath + '\\images\\cancel.gif';
            }
            else {
                curImg.src = mpObj.ipath + '\\images\\complete.gif';
            }
        }
        _g("medSgnBtn").disabled = false;
        Util.Style.rcss(_g("mnuSign"), "dthrd");
        Util.Style.rcss(_g("gtOrders"), "dthrd");
        Util.Style.rcss(_g("routeLink"), "dthrd");
        disableActions();

    }
	//reset highlight
	Util.Style.rcss(this, "mnu-hvr");
} //end queueOrder

function rflTblInit(e, tId, selTable) {
    var tempTbl = Util.ce('span');
    tempTbl.innerHTML = selTable;
    document.body.appendChild(tempTbl);
    var tblAdded = _g(tId);
    var p = getPosition(e), top = p.y - 10, left = p.x - 25;
    tblAdded.style.display = "block";
    tblAdded.style.left = left + "px";
    tblAdded.style.top = top + "px";

    var txtBox = _g('tb' + tId);
    txtBox.select();

    Util.addEvent(tblAdded, "click", function(e) {
        if (!e) var e = window.event;
        Util.cancelBubble(e);
    });

    return tblAdded;
}

//change dispense quantity
function changeDispQ(e) {
    if (!e) var e = window.event;
    Util.cancelBubble(e);

    var idStr = this.id;
    var idNum = idStr.replace('dq', '');
    var pRow = _g(idNum);
    var cDispQ = this;

    if (Util.Style.ccss(pRow, "rnwd")) {

        if (Util.Style.ccss(cDispQ, "disp-q-rnw")) {
            var dqTab = cDispQ.innerHTML;
            var dispSpnId = cDispQ.id;
            var tId = 'Tbl' + cDispQ.id;
            var qty = Util.Style.g("dq-qty", cDispQ, "span")[0].innerHTML; 
            var typ = Util.Style.g("dq-tp", cDispQ, "span")[0].innerHTML; 
            var curTable = _g(tId);
            if (curTable) {
                Util.Style.rcss(curTable, "hide-tbl");
            }
            else {
                var selTable = "<table class='hvr-tbl' id='" + tId + "'>"
								+ "<tr><td class='ref-tab'><span class='rnw-t'>" + dqTab + "</span></td><td class='rt-crnr'></td></tr>"
								+ "<tr class='row-hd'><td class='row-tl'>&nbsp; </td><td class='row-tr'>&nbsp;</td></tr>"
								+ "<tr class='row'><td class='row-l' colspan='2'><input type='text' class='qty-txt' id='tb" + tId + "' value='" + qty + "' /><span>" + typ + "</span> </td></tr>"
								+ "<tr class='row'><td class='row-l' colspan='2'>&nbsp; </td></tr>"
								+ "<tr class='row-hd'><td class='row-bl'>&nbsp; </td><td class='row-br'>&nbsp;</td></tr></table>";

                var tblAdded = rflTblInit(e, tId, selTable);

                Util.Style.g("row-tl", tblAdded, "td")[0].style.width = cDispQ.offsetWidth;
				 var closeTbl = function(e) {
                    if (!e) var e = window.event;

                    var newQty = parseFloat(Util.Style.g("qty-txt", tblAdded, "input")[0].value);
                    if (newQty) {
                        Util.Style.acss(tblAdded, "hide-tbl");
                        Util.Style.g("dq-qty", _g(dispSpnId), "span")[0].innerHTML = newQty;
                        Util.cancelBubble(e);
                    }
                    else {
                        alert('Please Enter a Valid Quantity');
                    }
                    Util.cancelBubble(e);
                    Util.de(tblAdded);
                }

                if (window.attachEvent) {
                    Util.addEvent(tblAdded, "mouseleave", closeTbl);
                }
                else {
                    Util.addEvent(tblAdded, "mouseout", closeTbl);
                }
				
				var rtCorners = Util.Style.g("rt-crnr", tblAdded, "td");
				Util.addEvent(rtCorners[0], "mouseover", closeTbl);
            }
        }
    }
} //end change dispense quantity

//change number of refills
function changeRfl(e) {
    if (!e) var e = window.event;
    Util.cancelBubble(e);

    var idStr = this.id;
    var idNum = idStr.replace('rfl', '');
    var pRow = _g(idNum);
    var cRfl = this;

    if (Util.Style.ccss(pRow, "rnwd")) {

        if (Util.Style.ccss(cRfl, "rfl-rnw")) {
            var rflTab = cRfl.innerHTML; // 
            var rflId = cRfl.id;
            var tId = 'Tbl' + cRfl.id;
            var qty = rflTab.replace(" refills", '');
            var curRflTbl = _g(tId);
            if (curRflTbl) {
                Util.Style.rcss(curRflTbl, "hide-tbl");
            }
            else {
                var selTable = "<table class='rfl-hvr-tbl' id='" + tId + "'>"
								+ "<tr><td class='ref-tab'><span class='rnw-t'>" + rflTab + "</span></td><td class='rt-crnr'></td></tr>"
								+ "<tr class='row-hd'><td class='row-tl'>&nbsp; </td><td class='row-tr'>&nbsp;</td></tr>"
								+ "<tr class='row'><td class='row-l' colspan='2'><input type='text' class='qty-txt' id='tb" + tId + "' value='" + qty + "' /><span> refills</span> </td></tr>"
								+ "<tr class='row'><td class='row-l' colspan='2'><label><input type='checkbox' id='rflAll' value='Apply to All' />Apply to all</label></td></tr>"
								+ "<tr class='row-hd'><td class='row-bl'>&nbsp; </td><td class='row-br'>&nbsp;</td></tr></table>";

                var tblAdded = rflTblInit(e, tId, selTable);

                Util.Style.g("row-tl", tblAdded, "td")[0].style.width = cRfl.offsetWidth;
				
				var closeRflTbl = function(e) {
                    if (!e) var e = window.event;

                    var newQty;
                    var origQty = Util.Style.g("qty-txt", tblAdded, "input")[0].value;
                    if (origQty == '0') {
                        newQty = origQty;
                    }
                    else {
                        newQty = parseInt(origQty, 10);
                    }
                    if (newQty) {
                        var refillAll = _g('rflAll');
                        if (refillAll.checked) {
							var allRenewals = Util.Style.g("rnwd", _g("hmlBody"), "dl");
							var renLen = allRenewals.length;
							for (var i = renLen; i--; ) {
								var curRefill = Util.Style.g("rfl-rnw", allRenewals[i], "span");
								if (curRefill[0]) {
									curRefill[0].innerHTML = newQty + ' refills';
								}
                            }
                        }
                        else {
                            _g(rflId).innerHTML = newQty + ' refills';
                        }

                        Util.Style.acss(tblAdded, "hide-tbl");
                        Util.cancelBubble(e);
                    }
                    else {
                        alert('Please Enter a Valid Quantity');
                    }
                    Util.cancelBubble(e);
                    Util.de(tblAdded);
                }

                if (window.attachEvent) {
                    Util.addEvent(tblAdded, "mouseleave", closeRflTbl);
                }
                else {
                    Util.addEvent(tblAdded, "mouseout", closeRflTbl);
                }
				
				var rtCorners = Util.Style.g("rt-crnr", tblAdded, "td");
				Util.addEvent(rtCorners[0], "mouseover", closeRflTbl);
            }
        }
    }
} //change number of refills


function resetRows(e) {
    if (Util.Style.ccss(this, "dthrd")) {
        if (!e) var e = window.event;
        Util.cancelBubble(e);
    }
    else {
        var selectedRows = Util.Style.g("med-selected", _g("hmlBody"), "dl");
        var selRowLen = selectedRows.length;

        for (var i = selRowLen; i--; ) {
            var curRow = selectedRows[i];
            var curId = curRow.id;
            var imgSpan = Util.Style.g("rx-hx", curRow, "span");
			var curImg =  Util.gc(imgSpan[0]);
			var curSrc = curImg.src;
            var origDispQty;
            var origRflQty;
            if (origOrder[curId]) {
                origDispQty = origOrder[curId].dispQty;
                origRflQty = origOrder[curId].rflQty;
                //set to original image
               curImg.src = origOrder[curId].rxType;
            }
			else if (curSrc.search(/_selected/) > -1) {
				var newSrc = curSrc.replace("_selected.gif", ".gif");
				curImg.src = newSrc;
        }

            Util.Style.rcss(curRow, "med-selected");
            Util.Style.rcss(curRow, "cncld");
            Util.Style.rcss(curRow, "rnwd");
            Util.Style.rcss(curRow, "cmplt");
            var renewEl = Util.Style.g("disp-q-rnw", curRow, "span")[0];
            if (renewEl) {
                Util.Style.rcss(renewEl, "disp-q-rnw");
                if (origDispQty) {
                    Util.Style.g("dq-qty", renewEl, "span")[0].innerHTML = origDispQty;
                }
            }

            var rflEl = Util.Style.g("rfl-rnw", curRow, "span")[0];
            if (rflEl) {
                Util.Style.rcss(rflEl, "rfl-rnw");
                if (origRflQty) {
                    rflEl.innerHTML = origRflQty + ' refills';
                }
            }
        }
		
		disableActions();
		
        var totRenews = Util.Style.g("rnwd", _g("hmlBody"), "dl").length;
        var totCancels = Util.Style.g("cncld", _g("hmlBody"), "dl").length;
        var totCompletes = Util.Style.g("cmplt", _g("hmlBody"), "dl").length;
        if (totRenews === 0 && totCancels === 0 && totCompletes === 0) {
            _g("medSgnBtn").disabled = true;
            Util.Style.acss(_g("mnuSign"), "dthrd");
            Util.Style.acss(_g("gtOrders"), "dthrd");
            Util.Style.acss(_g("routeLink"), "dthrd");
            mpObj.editMode = false;
        }
    }
	//reset highlight
	Util.Style.rcss(this, "mnu-hvr");
} //end resetRows	


//loop through queued orders and add for the appropriate action 
function signMedMods(e) {
    if (Util.Style.ccss(this, "dthrd")) {
        if (!e) var e = window.event;
        Util.cancelBubble(e);
    }
    else {
//	_g("medSgnBtn").value = "Signing...";
        var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
        var m_dPersonId = parseFloat(mpObj.personId);
        var m_dEncounterId = parseFloat(mpObj.encntrId);

        var bDefRt = true;
        if (this.id == "routeLink" || this.id == "gtOrders") {
            bDefRt = false;
        }
        var medSec = _g("hmlBody");
        var failedOrders = "";

        //create moew
        var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(m_dPersonId, m_dEncounterId, 0, 2, 127);

        //cancel orders
        var cancels = Util.Style.g('cncld', medSec, 'dl');
        var canLen = cancels.length;
        var curCancel;
        if (canLen > 0) {
            var m_dCancelDCReason = 0.0; //default
            var d = new Date();
            //make sure leading zero is present
            var twoDigit = function(num) {
                (String(num).length < 2) ? num = String("0" + num) : num = String(num);
                return num;
            }
            //YYYYMMDDhhmmsscc -- cc is dropped but needed for format
            var cancelDate = "" + d.getFullYear() + twoDigit((d.getMonth() + 1)) + twoDigit(d.getDate()) + twoDigit(d.getHours()) + twoDigit(d.getMinutes()) + twoDigit(d.getSeconds()) + "99";

            for (var i = 0; i < canLen; i++) {
                var cancelId = parseFloat(cancels[i].id) || 0.0;
                //add date time and reason
                curCancel = PowerOrdersMPageUtils.InvokeCancelDCAction(m_hMOEW, cancelId, cancelDate, m_dCancelDCReason);
                if (!curCancel) {
                    failedOrders += Util.gc(Util.Style.g('hml-name', cancels[i], 'dd')[0]).innerHTML + "\n";
                }
            }
        }

        //complete orders
        var completes = Util.Style.g('cmplt', medSec, 'dl');
        var curComplete;
        for (var i = 0, l = completes.length; i < l; i++) {
            var completeId = parseFloat(completes[i].id) || 0.0;
            curComplete = PowerOrdersMPageUtils.InvokeCompleteAction(m_hMOEW, completeId);
            if (!curComplete) {
                failedOrders += Util.gc(Util.Style.g('hml-name', completes[i], 'dd')[0]).innerHTML + "\n";
            }
        }

        //renew orders
        var renewals = Util.Style.g('rnwd', medSec, 'dl');
        var curRenewal;
        for (var i = 0, l = renewals.length; i < l; i++) {
            var numRfls, dispQty;
            var curRenewal = renewals[i];
            var renewalId = parseFloat(curRenewal.id) || 0.0;
        //  var dur = parseFloat(Util.Style.g('dur', curRenewal, 'dd')[0].innerHTML) || 0.0; //possible future use, for now set to 0
			var dur = 0.0;
        //  var durCd = parseFloat(Util.Style.g('dur-cd', curRenewal, 'dd')[0].innerHTML) || 0; //possible future use, for now set to 0
			var durCd = 0.0;
        //  var dispDur = parseFloat(Util.Style.g('disp-dur', curRenewal, 'dd')[0].innerHTML) || 0.0; //possible future use, for now set to 0
			var dispDur = 0.0;
        //  var dispDurCd = parseFloat(Util.Style.g('disp-dur-cd', curRenewal, 'dd')[0].innerHTML) || 0; //possible future use, for now set to 0
			var dispDurCd = 0.0;
			
            var rflSpan = Util.Style.g('rfl', curRenewal, 'span')[0];
            if (rflSpan) {
                numRfls = parseFloat(rflSpan.innerHTML) || 0;
            }
			else {
				numRfls = 0.0;
			}

            var dispQtySpan = Util.Style.g('dq-qty', curRenewal, 'span')[0];
            if (dispQtySpan) {
                dispQty = parseFloat(dispQtySpan.innerHTML) || 0.0;
            }
			else {
				dispQty = 0.0;
			}
			
			var dispQtyCd = parseFloat(Util.Style.g('disp-qty-cd', curRenewal, 'dd')[0].innerHTML) || 0;
			
            curRenewal = PowerOrdersMPageUtils.InvokeRenewAction(m_hMOEW, renewalId, dur, durCd, dispDur, dispDurCd, numRfls, dispQty, dispQtyCd, bDefRt);
            if (!curRenewal) {
                failedOrders += Util.gc(Util.Style.g('hml-name', renewals[i], 'dd')[0]).innerHTML + "\n";
            }
        }

        //attempt to sign silently or display moew based on default routing
        var bSign;
        var showMOEW;

        if (failedOrders != "") {
            if (curRenewal || curCancel || curComplete) {
                failedOrders = "The following orders failed:\n\n" + failedOrders + "\n Continue to Sign Valid Orders?";
                var confirmFailed = confirm(failedOrders);
                if (confirmFailed) {
                    //alert('continue to sign');
                    if (bDefRt) {
                        bSign = PowerOrdersMPageUtils.SignOrders(m_hMOEW);
                    }
                    else {
                        //displays moew
                        showMOEW = PowerOrdersMPageUtils.DisplayMOEW(m_hMOEW);
                    }
                }
                else {
                    //alert('cancel sign');
				//	_g("medSgnBtn").value = "Sign";
                }
            }
            else {
                failedOrders = "The following orders failed:\n\n" + failedOrders + "\n No Valid Orders Selected";
                alert(failedOrders);
			//	_g("medSgnBtn").value = "Sign";
            }
        }
        else {
            if (bDefRt) {
                bSign = PowerOrdersMPageUtils.SignOrders(m_hMOEW);
                //	if(bSign){..... 
            }
            else {
                //displays moew
                showMOEW = PowerOrdersMPageUtils.DisplayMOEW(m_hMOEW);
            }
        }

        //alert(showMOEW);
        PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);

        //destroy moew
        if (bSign || showMOEW) {
            paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + ",^" + mpObj.encString + "^";
            loadWithCBParameters('mp_pe_get_medications', medLoad, 'hml', paramString);
        }
		else {
		//	_g("medSgnBtn").value = "Sign";
		}
    }
} //end signMedMods

function gcLoad(xhr, sec) {
    //notation to access pref object
    var prefSec = sec + 'Sec';

    if (bedrockPrefs[prefSec]) {
        var hasPlus = bedrockPrefs[prefSec].hasPlus;
        var scrollNum = bedrockPrefs[prefSec].scroll;
        var timeSpan = bedrockPrefs[prefSec].timeSpan;
    }

    var gcData = xhr;
    var jsonEval = JSON.parse(gcData);
    var jsGcHTML = ["<table class='gc-table'>"];
    var gcHTML = "";
    var gcLen = 0;
    var gcHd = "";
    var countText = "";

    if (jsonEval.RECORD_DATA.AGC_CNT != '0') {
        var gcObj = jsonEval.RECORD_DATA.AGC;
        gcLen = gcObj.length;
        countText = "( " + gcLen + " )";

        gcHd = "<table class='gc-table'><thead><tr class='x'><th class='gc-lbl'><span>&nbsp;</span></th><th class='gc-res1'><span>Latest</span></th><th class='gc-res2'><span>Previous</span></th><th class='gc-res3'><span>Previous</span></th></tr></thead></table>";

        for (var i = 0; i < gcLen; i++) {
            var gcItem = gcObj[i];
            var gcName = gcItem.EVENT_NAME;

            var oddEven = "odd";
            if (i % 2 == 0) {
                oddEven = "even";
            }
            jsGcHTML.push("<tbody><tr class='", oddEven, "'><td class='gc-lbl'><span>", gcName, "</span></td>");
            var gcMeas = gcItem.MEASUREMENTS;
            var gcResLen = gcMeas.length;
            if (gcResLen > 3) {
                gcResLen = 3;
            }
            for (var j = 0; j < 3; j++) {
                if (j < gcResLen) {
                    var gcRes = gcMeas[j];
                    var gcVal = gcRes.VALUE;
                    var gcPct = gcRes.PERCENTILE;
                    var gcResultVal = "";
                    var gcHvrVal = ""

                    gcResultVal = gcVal + " (" + gcPct + "%)";
                    gcHvrVal = gcVal;

                    jsGcHTML.push("<td class='gc-res", j + 1, "'><dl class='gc-info'><dt><span>", gcName, "</span></dt><dd class='gc-res'>", gcResultVal, "<br /><span class='within'>",
								gcRes.WITHIN, "</span></dd></dl><h4 class='gc-det-hd'><span>Result Details</span></h4><dl class='gc-det'>",
								"<dt><span>Age:</span></dt><dd>",
								gcRes.MEAS_AGE, "</dd>",
								"<dt><span>Result dt/tm:</span></dt><dd>",
								gcRes.MEAS_DT_TM, "</dd>",
								"<dt><span>Result:</span></dt><dd>",
								gcHvrVal + " " + gcRes.RESULT_UNITS, "</dd><dt><span>Percentile:</span></dt><dd><span>",
								gcPct, "</span></dd><dt><span>Z-score:</span></dt><dd><span>", gcRes.Z_SCORE, "</span></dd></dl></td>"); //fmtDt
                }
                else {
                    jsGcHTML.push("<td class='gc-res", j + 1, "'><span>--</span></td>");
                }
            }
            jsGcHTML.push("</tr></tbody>");
        }
    }
    else {
        jsGcHTML.push("<h3 class='no-doc' ><span class='no-gc'>No Results Found</span></h3>");
        countText = "( 0 )";
    }
    jsGcHTML.push("</table>");
    gcHTML = jsGcHTML.join("");

    secLoadJSON(gcHd, gcHTML, null, "gc", countText, scrollNum);

    var gcLspan = _g('gcLoading')
    if (timeSpan != '') {
        var ts = timeSpan;
    }
    else {
        var ts = '';
    }
    if (hasPlus) {
        var menuHTML = '<span id="gcSpan">' + ts + '</span>'
						+ '<a class="addPlus" id="gcAdd"><img class="pic" src="' + mpObj.ipath + '\\images\\3941.gif" />Add</a>';

        gcLspan.innerHTML = menuHTML

        //plusadd click event
        var plusAddForm = jsonEval.RECORD_DATA.PLUS_ADD_FORM.REF_ID;
        Util.addEvent(_g('gcAdd'), "click", function() { addGc(plusAddForm) });

    }
    else {
        gcLspan.innerHTML = '<span id="gcSpan">' + ts + '</span>';
    }
}

function addGc(formId) {
    //reset hover display for reload
    refreshLVGC();

    var paramString = mpObj.personId + "|" + mpObj.encntrId + "|" + formId + "|0|0";
    javascript: MPAGES_EVENT("POWERFORM", paramString);

    //reload sections
    reloadLVGC();
}

function addGcDet() {
    //reset hover display for reload
    refreshLVGC();

    var formId = this.id;
    var paramString = mpObj.personId + "|" + mpObj.encntrId + "|" + formId + "|0|0";
    javascript: MPAGES_EVENT("POWERFORM", paramString);

    //reload sections
    reloadLVGC();
}

function refreshLVGC() {
    //reset hover display for reload
    var vitHoverDet = Util.Style.g('vs-info', _g('l'), 'dl');
    var gcHoverDet = Util.Style.g('gc-info', _g('x'), 'dl');
    var labHoverDet = Util.Style.g('vs-info', _g('m'), 'dl');
    if (vitHoverDet) {
        hoverRefresh(vitHoverDet, vitHoverDet.length);
    }
    if (gcHoverDet) {
        hoverRefresh(gcHoverDet, gcHoverDet.length);
    }
    if (labHoverDet) {
        hoverRefresh(labHoverDet, labHoverDet.length);
    }
}

function reloadLVGC() {
    var lcUserPrefs = mpObj.userPrefs;
    if (lcUserPrefs.search(/l/) > -1) {
        loadWithCBParameters('mp_pe_get_vitals', secLoadTable, 'vit');
    }
    if (lcUserPrefs.search(/x/) > -1) {
        var paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode;
        loadWithCBParameters('mp_pe_adv_growth_chart', gcLoad, 'gc', paramString);

    }
    if (lcUserPrefs.search(/m/) > -1) {
        loadWithCBParameters('mp_pe_get_labs', secLoadTable, 'lab');
    }
}

function secLoadJSON(secHd, secBody, secFt, pre, count, scrollNum) {
    // Clear for reload
    var secContent = _g(pre + "Content");
    var secContent = document.getElementById(pre + "Content");
    secContent.innerHTML = "";

    // Populate section and initialize hovers
    var secHTML = [];
    if (secHd != "") {
        secHTML.push("<div id='", pre, "Hd' class='content-hd'>", secHd, "</div>");
    }
    secHTML.push("<div id='", pre, "Body' class='content-body'>", secBody, "</div>");
    if (secFt != "") {
        secHTML.push("<div id='", pre, "Ft' class='content-ft'>", secFt, "</div>");
    }


    secContent.innerHTML = secHTML.join("");

    secInit(pre, 'DL');

    // Add scroll functionality
    var secBody = _g(pre + "Body");
    if (scrollNum > 0) {
        var results = Util.Style.g(pre + "-info", secBody, "dl");
        var numberOfResults = results.length;

        if (numberOfResults <= scrollNum) {
            secBody.style.height = 'auto';
        }
        else {
			var lh;
			if ( pre === 'gc' || pre === 'vit' || pre === 'lab' ) { //if added to fix medication scrolling issue for SR
				lh = 2.6
			}
			else {
				lh = 1.3
			}
            setScroll(secBody, scrollNum, lh); // default line height + .1em for the bottom border
        }
    }
}

function setScroll(sec, num, ht) {
    var th = num * ht
    var totalHeight = th + "em";
    sec.style.height = totalHeight;
    //	sec.style.overflowY = 'auto';
    Util.Style.acss(sec, "sec-scrl");
}

//global mpage object to store values used in subroutines
var nextSearchCounter = 0;
var	curSearchCounter = 0;
var	replySearchCounter = 0;

//function to load CCL script having a callback function with parameters
function diagLoad(xhr, sec) {
	var searchBoxDiv = _g('s01');
	var diagContent = _g('diagContent');
	var lastIdx = 0;
	var braceCnt = 0;
	
	do
	{
		if (xhr.charAt(lastIdx) == '{' )
		{
			braceCnt++;
		}
		if (xhr.charAt(lastIdx) == '}' )
		{
			braceCnt--;
		}

		lastIdx++;
	} while (braceCnt > 0);

	//end new code
	var jsonString = "";
	var htmlString = xhr;
	var jsonDiagnosis = "";
	if (lastIdx > 0) {
		jsonString = xhr.substring(0, lastIdx);
		htmlString = xhr.substring(lastIdx);
		
		if (jsonString) {
			jsonDiagnosis = JSON.parse(jsonString);
		}
		
		if (jsonDiagnosis){
			if (jsonDiagnosis.ADD_DX_ATTRIBUTES.DX_CAN_ADD == 1){
				// If DX_CAN_ADD, change class name to match content section for colapse purposes
				searchBoxDiv.className = diagContent.className;
				searchBoxDiv.style.overflow = 'hidden';
			}
			else{
				// Kill display of the search box at Div level
				searchBoxDiv.style.display = 'none';
			}

			// Set the default search type.  This is a quick way of doing it since the preference matches the script values
			diagAutoSuggest.iFlag = jsonDiagnosis.ADD_DX_ATTRIBUTES.DX_SEARCH_TYPE;
		}
	}

	var diagHoverDet = Util.Style.g('diag-det');
	hoverRefresh(diagHoverDet,diagHoverDet.length);
	secLoad(htmlString, sec);
}

function plLoad(xhr, sec) {
	var lastIdx = 0;
	var plContent = _g('plContent');
	var braceCnt = 0;
	var searchBoxDiv = _g('s02');

	do
	{
		if (xhr.charAt(lastIdx) == '{' )
		{
			braceCnt++;
		}
		if (xhr.charAt(lastIdx) == '}' )
		{
			braceCnt--;
		}

		lastIdx++;
	} while (braceCnt > 0);
	
	var jsonString = "";
	var htmlString = xhr;
	var jsonProblem = "";
	if (lastIdx > 0) {
		jsonString = xhr.substring(0, lastIdx);
		htmlString = xhr.substring(lastIdx);

		if (jsonString) {
			jsonProblem = JSON.parse(jsonString);
		}
		
		if (jsonProblem){
			if (jsonProblem.ADD_PL_ATTRIBUTES.PL_CAN_ADD == 1){
				// If PL_CAN_ADD, change class name to match content section for colapse purposes
				searchBoxDiv.className = plContent.className;
				searchBoxDiv.style.overflow = 'hidden';
			}
			else{
				// Kill display of the search box at Div level
				searchBoxDiv.style.display = 'none';
			}
			
			// Set the default search type.  This is a quick way of doing it since the preference matches the script values
			plAutoSuggest.iFlag = jsonProblem.ADD_PL_ATTRIBUTES.PL_SEARCH_TYPE;
		}
	}
	
	var plHoverDet = Util.Style.g('pl-det');
	hoverRefresh(plHoverDet,plHoverDet.length);
	secLoad(htmlString, sec);
}

//function to load CCL script having a callback function with parameters
function searchNomenclature(callback, textBox, iSearchTypeFlag) {
	
	// Initialize the request object
	var xhr = new XMLCclRequest ();
	var returnData;
	var searchPhrase         = textBox.value;
	var limit                = 10;

	curSearchCounter = curSearchCounter + 1;
	
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
			
            var msg = xhr.responseText; 
            var jsonMsg = "";

			if (msg) 
			{
				jsonMsg = JSON.parse(msg);
			}

			if (jsonMsg)
			{
				replySearchCounter = jsonMsg.SEARCHRESULTS.SEARCHINDEX;
				if (replySearchCounter > nextSearchCounter && textBox.value != "")
				{
					nextSearchCounter = replySearchCounter;
					returnData = jsonMsg.SEARCHRESULTS.NOMENCLATURE;
					callback.autosuggest(returnData);
				}
			}
		}
	}	
	
	xhr.open('GET', "mp_pe_search_nomenclatures");
	xhr.send("^MINE^, ^" + searchPhrase + "^," + limit + "," + curSearchCounter + "," + iSearchTypeFlag);
}

//function to load CCL script that performs an add diagnosis
function addDiagnosis(nomenclature_id) {
	var paramString = "^MINE^," + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + "," + mpObj.pprCode + "," + nomenclature_id + "," +  mpObj.posCode;
	loadWithCBParameters('mp_pe_add_diagnosis', diagAddLoad, 'diag', paramString);
}

function addProblem(nomenclature_id) {
	var paramString = "^MINE^," + mpObj.personId + "," + mpObj.encntrId + "," + mpObj.userId + "," +  mpObj.posCode + "," + mpObj.pprCode + "," +  nomenclature_id;
	loadWithCBParameters('mp_pe_add_problem', plAddLoad, 'pl', paramString);
}
//end add addDiagnosis function

function diagAddLoad(xhr, sec) {
	var msgDiagnosis = xhr;
	var alertMsg = "";	
	var jsonDiagnosis = "";
	if (msgDiagnosis) {
		jsonDiagnosis = JSON.parse(msgDiagnosis);
	}

	if (jsonDiagnosis && jsonDiagnosis.REPLY.PRIVILEGE_IND == 0){
		alertMsg = "You do not have privileges to add the selected diagnosis";
		alert(alertMsg);
	}
	else if (jsonDiagnosis && jsonDiagnosis.REPLY.DUPLICATES.length > 0){
		alertMsg = "This action would create a duplicate diagnosis.  You are unable to add this diagnosis.";
		alert(alertMsg);
	}
	
	var diagSearch = _g('diagContentCtrl');
	var paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + "," + mpObj.pprCode + "," + mpObj.posCode;
	loadWithCBParameters('mp_pe_get_diagnosis', diagLoad, 'diag', paramString);
	diagSearch.value = "";
}

function plAddLoad(xhr, sec) {
	var msgProblem = xhr;
	var alertMsg = "";	
	var jsonProblem = "";
	var probSearch = _g('plContentCtrl');
	probSearch.value = "";
	
	if (msgProblem) {
		jsonProblem = JSON.parse(msgProblem);
	}

	if (jsonProblem && jsonProblem.REPLY.PRIVILEGE_IND == 0)
	{
		alertMsg = "You do not have privileges to add the selected problem";
		alert(alertMsg);
	}
	else if (jsonProblem && jsonProblem.REPLY.DUPLICATE_IND == 1)
	{
		alertMsg = "This action would create a duplicate problem.  You are unable to add this problem.";
		alert(alertMsg);
	}
	else 
	{
		paramString = "^MINE^, " + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ", " + mpObj.pprCode + ", " + mpObj.posCode;
		loadWithCBParameters('mp_pe_get_problems', plLoad, 'pl', paramString);
	}
}

var diagAutoSuggest;
var plAutoSuggest;

/************************************************************************
*               	   AUTO SUGGEST FUNCTIONS                           *
************************************************************************/
/**
 * An autosuggest textbox control.
 * @class
 * @scope public
 */
function AutoSuggestControl(oTextbox /*:HTMLInputElement*/, 
                            oQueryHandler /*:SuggestionProvider*/,
                            oSelectionHandler /*:SelectionHandler*/,
                            oFlag /*:Flag*/) {
    /**
     * The currently selected suggestions.
     * @scope private
     */   
    this.cur /*:int*/ = 0;

    /**
     * The dropdown list layer.
     * @scope private
     */
    this.layer = null;
    
    /**
     * Suggestion provider for the autosuggest feature.
     * @scope private.
     */
    this.queryHandler /*:SuggestionProvider*/ = oQueryHandler;
	
	 /**
     * Selection Handler for the autosuggest feature.
     * @scope private.
     */
    this.selectionHandler /*:SelectionHandler*/ = oSelectionHandler;
    
	/**
    * Optional flag for autosuggest feature.
    * @scope private.
    */
    this.iFlag /*:Flag*/ = oFlag
	
    /**
    * Optional flag for autosuggest feature.
    * @scope private.
    */
    this.iFlag /*:Flag*/ = oFlag
	
    /**
     * The textbox to capture.
     * @scope private
     */
    this.textbox /*:HTMLInputElement*/ = oTextbox;
	
	 /**
     * The JSON string.
     * @scope private
     */
    this.objArray /*JSON*/ = "";
    
    //initialize the control
    this.init();
    
}
/**
 * Autosuggests one or more suggestions for what the user has typed.
 * If no suggestions are passed in, then no autosuggest occurs.
 * @scope private
 * @param aSuggestions An array of suggestion strings.
 * @param bTypeAhead If the control should provide a type ahead suggestion.
 */
AutoSuggestControl.prototype.autosuggest = function (aSuggestion /*:Array JSON*/) {
	this.layer.style.width = this.textbox.offsetWidth;
    //make sure there's at least one suggestion
	this.objArray = aSuggestion;
	
	var aSuggestions = [];
	for (var i=0 ; i < aSuggestion.length ; i++){
		aSuggestions.push(aSuggestion[i].NAME);
	}
	
    if (aSuggestions.length > 0) {
       this.showSuggestions(aSuggestions);
    } else {
        this.hideSuggestions();
    }
};

/**
 * Creates the dropdown layer to display multiple suggestions.
 * @scope private
 */
AutoSuggestControl.prototype.createDropDown = function () {
    var oThis = this;
    //create the layer and assign styles
    this.layer = document.createElement("div");
    this.layer.className = "suggestions";
    this.layer.style.visibility = "hidden";
    this.layer.style.width = this.textbox.offsetWidth;
    
    //when the user clicks on the a suggestion, get the text (innerHTML)
    //and place it into a textbox
    this.layer.onmousedown = 
    this.layer.onmouseup = 
    this.layer.onmouseover = function (oEvent) {
        oEvent = oEvent || window.event;
        oTarget = oEvent.target || oEvent.srcElement;
        if (oEvent.type == "mousedown") {
			var index = AutoSuggestControl.prototype.indexOf(this,oTarget);
			oThis.textbox.value = oThis.objArray[index].NAME;
			oThis.selectionHandler(oThis.objArray[index].VALUE);
			oThis.hideSuggestions();
        } else if (oEvent.type == "mouseover") {
			var index = AutoSuggestControl.prototype.indexOf(this,oTarget);
			oThis.cur = index;
            oThis.highlightSuggestion(oTarget);
        } else {
            oThis.textbox.focus();
        }
    };
    
    document.body.appendChild(this.layer);
};

/**
 * Gets the left coordinate of the textbox.
 * @scope private
 * @return The left coordinate of the textbox in pixels.
 */
AutoSuggestControl.prototype.getLeft = function () /*:int*/ {
    var oNode = this.textbox;
    var iLeft = 0;
    
    while(oNode && oNode.tagName != "BODY") {
        iLeft += oNode.offsetLeft;
        oNode = oNode.offsetParent;   		
    }
    
    return iLeft;
};

/**
 * Gets the top coordinate of the textbox.
 * @scope private
 * @return The top coordinate of the textbox in pixels.
 */
AutoSuggestControl.prototype.getTop = function () /*:int*/ {
	var oNode = this.textbox;
    var iTop = 0;
	
    while(oNode && oNode.tagName != "BODY") {
        iTop += oNode.offsetTop;
        oNode = oNode.offsetParent;
    }
    
    return iTop;
};

/**
 * Handles three keydown events.
 * @scope private
 * @param oEvent The event object for the keydown event.
 */
AutoSuggestControl.prototype.handleKeyDown = function (oEvent /*:Event*/) {

	if (this.layer.style.visibility != "hidden"){
		switch(oEvent.keyCode) {
			case 38: //up arrow
				this.previousSuggestion();
				break;
			case 40: //down arrow 
				this.nextSuggestion();
				break;
			case 13: //enter
				this.selectionHandler(this.objArray[this.cur].VALUE);
				this.hideSuggestions();
				break;
		}
	}
};

/**
 * Handles keyup events.
 * @scope private
 * @param oEvent The event object for the keyup event.
 */
AutoSuggestControl.prototype.handleKeyUp = function (oEvent /*:Event*/) {

    var iKeyCode = oEvent.keyCode;

    //for backspace (8) and delete (46), shows suggestions without typeahead
    if (iKeyCode == 8 || iKeyCode == 46) {
		if (this.textbox.value.length > 0)
			this.queryHandler(this, this.textbox, this.iFlag);
		else
			this.hideSuggestions();
        
    //make sure not to interfere with non-character keys
    } else if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode < 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
        //ignore
    } else {
        //request suggestions from the suggestion provider with typeahead
        this.queryHandler(this, this.textbox, this.iFlag);
    }
};

/**
 * Hides the suggestion dropdown.
 * @scope private
 */
AutoSuggestControl.prototype.hideSuggestions = function () {
    this.layer.style.visibility = "hidden";
};

/**
 * Highlights the given node in the suggestions dropdown.
 * @scope private
 * @param oSuggestionNode The node representing a suggestion in the dropdown.
 */
AutoSuggestControl.prototype.highlightSuggestion = function (oSuggestionNode) {

    for (var i=0; i < this.layer.childNodes.length; i++) {
        var oNode = this.layer.childNodes[i];
        if (oNode == oSuggestionNode || oNode == oSuggestionNode.parentNode) {
            oNode.className = "current";
        } else if (oNode.className == "current") {
            oNode.className = "";
        }
    }
};

/**
 * Initializes the textbox with event handlers for
 * auto suggest functionality.
 * @scope private
 */
AutoSuggestControl.prototype.init = function () {

    //save a reference to this object
    var oThis = this;
    
    //assign the onkeyup event handler
    this.textbox.onkeyup = function (oEvent) {
    
        //check for the proper location of the event object
        if (!oEvent) {
            oEvent = window.event;
        }    
        
        //call the handleKeyUp() method with the event object
        oThis.handleKeyUp(oEvent);
    };
    
    //assign onkeydown event handler
    this.textbox.onkeydown = function (oEvent) {
    
        //check for the proper location of the event object
        if (!oEvent) {
            oEvent = window.event;
        }    
        
        //call the handleKeyDown() method with the event object
        oThis.handleKeyDown(oEvent);
    };
    
    //assign onblur event handler (hides suggestions)    
    this.textbox.onblur = function () {
        oThis.hideSuggestions();
    };
    
    //create the suggestions dropdown
    this.createDropDown();
};

/**
 * Highlights the next suggestion in the dropdown and
 * places the suggestion into the textbox.
 * @scope private
 */
AutoSuggestControl.prototype.nextSuggestion = function () {
    var cSuggestionNodes = this.layer.childNodes;
    if (cSuggestionNodes.length > 0 && this.cur < cSuggestionNodes.length-1) {
        var oNode = cSuggestionNodes[++this.cur];
        this.highlightSuggestion(oNode);
    }
};

/**
 * Highlights the previous suggestion in the dropdown and
 * places the suggestion into the textbox.
 * @scope private
 */
AutoSuggestControl.prototype.previousSuggestion = function () {
    var cSuggestionNodes = this.layer.childNodes;
    if (cSuggestionNodes.length > 0 && this.cur > 0) {
        var oNode = cSuggestionNodes[--this.cur];
        this.highlightSuggestion(oNode); 
    }
};

/**
 * Builds the suggestion layer contents, moves it into position,
 * and displays the layer.
 * @scope private
 * @param aSuggestions An array of suggestions for the control.
 */
AutoSuggestControl.prototype.showSuggestions = function (aSuggestions /*:Array*/) {

    var oDiv = null;
    this.layer.innerHTML = "";  //clear contents of the layer
    for (var i=0; i < aSuggestions.length; i++) {
        oDiv = document.createElement("div");
		if (i == 0)
			oDiv.className = "current";
			this.cur = 0;
		var domText = this.highlight(aSuggestions[i],this.textbox.value);
		oDiv.innerHTML = domText;
		oDiv.appendChild(document.createTextNode(""));
        this.layer.appendChild(oDiv);
    }
    
	this.layer.style.left = this.getLeft() + "px";
	this.layer.style.top = (this.getTop()+this.textbox.offsetHeight) + "px";
    	this.layer.style.visibility = "visible";
	this.layer.style.position = "absolute";
};

AutoSuggestControl.prototype.indexOf = function (parent,el) {

    var nodeList = parent.childNodes;
	for (var i=0; i < nodeList.length; i++) {
		var oNode = nodeList[i];
		//Parent Node grabs the BODY element if user clicked on a bolded section of the suggestions
        if (oNode == el || oNode == el.parentNode) {
			return i;
		}
	}
    return -1;
}

AutoSuggestControl.prototype.highlight = function(value, term) {
	return "<strong>" + value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong>$1<strong>") + "</strong>";
}

/************************************************************************
*                           END AUTOSUGGEST                             *
************************************************************************/
