/* Hover Mouse Over */
function hmo(evt, n)
{
    evt = evt || window.event;
    var s = n.style, p = getPosition(evt), top = p.y + 30, left = p.x + 20;
    n._ps = n.previousSibling;
    n.hmo = true;

    function hover()
    {
        if (n.hmo == true)
        { //make sure the cursor has not moused out prior to displaying
            document.body.appendChild(n);
            s.display = "block";
            s.left = left + "px";
            s.top = top + "px";
            n.show = true;
        }
    }
    n.timer = setTimeout(hover, 500);
}

/* Hover Mouse Move */
function hmm(evt, n)
{
    if (!n.show)
    {
        return;
    }
    var s = n.style, p = getPosition(evt), vp = gvs(), so = gso(), left = p.x + 20, top = p.y + 20;

    if (left + n.offsetWidth > vp[1] + so[1])
    {
        left = left - 40 - n.offsetWidth;
        if (left < 0)
        {
            left = 0;
        }
    }

    if (top + n.offsetHeight > vp[0] + so[0])
    {
        if (top - 40 - n.offsetHeight < so[0])
        {
            if (left > 0)
            {
                top = 10 + so[0];
            }
        }
        else
        {
            top = top - 40 - n.offsetHeight;
        }
    }
    evt = evt || window.event;
    s.top = top + "px";
    s.left = left + "px";
}

/* Hover Mouse Out*/
function hmt(evt, n)
{
    n.hmo = false;
    if (!n._ps)
        n._ps = n.previousSibling;
    clearTimeout(n.timer);
    evt = evt || window.event;
    n.style.display = "";
    Util.ia(n, n._ps);
    n.show = false;
}

/* Hover Setup */
function hs(e, n)
{
    var priorBgColor = e.style.backgroundColor;
    var priorBorderColor = e.style.borderColor;
    if (n && n.tagName == "DIV")
    {
        e.onmouseenter = function (evt)
        {
            e.onmouseover = null;
            e.onmouseout = null;
            hmo(evt, n);
        };
        e.onmouseover = function (evt)
        {
            e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
            hmo(evt, n);
        };
        e.onmousemove = function (evt)
        {
            e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
            hmm(evt, n);
        };
        e.onmouseout = function (evt)
        {
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
            hmt(evt, n);
        };
        e.onmouseleave = function (evt)
        {
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
            e.onmouseover = null;
            e.onmouseout = null;
            hmt(evt, n);
        };
        Util.Style.acss(n, "hover");
    }
}

////// Healthe library 
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
function _g(i)
{
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
function _gbt(t, e)
{
    e = e || document;
    return e.getElementsByTagName(t);
}

/**
* Utility methods
* @namespace Util
* @static
* @global
*/
var Util = function ()
{

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
        EventCache: function ()
        {
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
                add: function (o, e, f)
                {
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
                remove: function (o, e, f)
                {
                    var n;
                    for (var i = l.length - 1; i >= 0; i = i - 1)
                    {
                        if (o == l[i][0] && e == l[i][1] && f == l[i][2])
                        {
                            n = l[i];
                            if (n[0].removeEventListener)
                            {
                                n[0].removeEventListener(n[1], n[2], n[3]);
                            }
                            else if (n[0].detachEvent)
                            {
                                if (n[1].substring(0, 2) != "on")
                                {
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
                flush: function ()
                {
                    var e;
                    for (var i = l.length - 1; i >= 0; i = i - 1)
                    {
                        var o = l[i];
                        if (o[0].removeEventListener)
                        {
                            o[0].removeEventListener(o[1], o[2], o[3]);
                        }
                        e = o[1];
                        if (o[1].substring(0, 2) != "on")
                        {
                            o[1] = "on" + o[1];
                        }
                        if (o[0].detachEvent)
                        {
                            o[0].detachEvent(o[1], o[2]);
                            if (o[0][e + o[2]])
                            {
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
        ce: function (t)
        {
            var a = _e[t];
            if (!a)
            {
                a = _e[t] = _d.createElement(t);
            }
            if (!a)
            {
                return null;
            }
            else
            {
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
        cep: function (t, p)
        {
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
        mo: function (o1, o2, d)
        {
            o1 = o1 || {};
            o2 = o2 || {};
            var p;
            for (p in o2)
            {
                if (p)
                {
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
        de: function (e)
        {
            if (e)
            {
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
        cancelBubble: function (e)
        {
            e = _w.event || e;
            if (!e)
            {
                return;
            }

            if (e.stopPropagation)
            {
                e.stopPropagation();
            }
            else
            {
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
        preventDefault: function (e)
        {
            e = _w.event || e;

            if (!e)
            {
                return;
            }

            if (e.preventDefault)
            {
                e.preventDefault();
            }
            else
            {
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
        goff: function (e)
        {
            var l = 0, t = 0;
            if (e.offsetParent)
            {
                while (e.offsetParent)
                {
                    l += e.offsetLeft;
                    t += e.offsetTop;
                    e = e.offsetParent;
                }
            }
            else if (e.x || e.y)
            {
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
        gp: function (e)
        {
            if (!e.parentNode)
            {
                return e;
            }
            e = e.parentNode;
            while (e.nodeType === 3 && e.parentNode)
            {
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
        gc: function (e, i)
        {
            i = i || 0;
            var j = -1;

            if (!e.childNodes[i])
            {
                return null;
            }

            e = e.childNodes[0];
            while (e && j < i)
            {
                if (e.nodeType === 1)
                {
                    j++;
                    if (j === i)
                    {
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
        gcs: function (e)
        {

            var r = [], es = e.childNodes;
            for (var i = 0; i < es.length; i++)
            {
                var x = es[i];
                if (x.nodeType === 1)
                {
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
        gns: function (e)
        {
            if (!e)
            {
                return null;
            }
            var a = e.nextSibling;
            while (a && a.nodeType !== 1)
            {
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
        gps: function (e)
        {
            var a = e.previousSibling;
            while (a && a.nodeType !== 1)
            {
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
        ac: function (e, p)
        {
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
        ia: function (nn, rn)
        {
            var p = Util.gp(rn), n = Util.gns(rn);
            if (n)
            {
                p.insertBefore(nn, n);
            }
            else
            {
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
        addEvent: function (o, e, f)
        {

            function ae(obj, evt, fnc)
            {
                if (!obj.myEvents)
                {
                    obj.myEvents = {};
                }

                if (!obj.myEvents[evt])
                {
                    obj.myEvents[evt] = [];
                }

                var evts = obj.myEvents[evt];
                evts[evts.length] = fnc;
            }

            function fe(obj, evt)
            {

                if (!obj || !obj.myEvents || !obj.myEvents[evt])
                {
                    return;
                }

                var evts = obj.myEvents[evt];

                for (var i = 0, len = evts.length; i < len; i++)
                {
                    evts[i]();
                }
            }

            if (o.addEventListener)
            {
                o.addEventListener(e, f, false);
                Util.EventCache.add(o, e, f);
            }
            else if (o.attachEvent)
            {
                o["e" + e + f] = f;
                o[e + f] = function ()
                {
                    o["e" + e + f](window.event);
                };
                o.attachEvent("on" + e, o[e + f]);
                Util.EventCache.add(o, e, f);
            }
            else
            {
                ae(o, e, f);
                o['on' + e] = function ()
                {
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
        removeEvent: function (o, e, f)
        {
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
        popup: function (u, n, o)
        {
            if (!window.open)
            {
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

            function f(n, v)
            {
                if (!v)
                {
                    return "";
                }
                return n + '=' + v + ',';
            }

            function fs()
            {
                o = o || {};
                var p, n = {};
                for (p in d)
                {
                    if (p)
                    {
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

            if (nw.focus)
            {
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
function insertAfter(nn, rn)
{
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
Util.Style = function ()
{

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
        ccss: function (e, c)
        {
            if (typeof (e.className) === 'undefined' || !e.className)
            {
                return false;
            }
            var a = e.className.split(' ');
            for (var i = 0, b = a.length; i < b; i++)
            {
                if (a[i] === c)
                {
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
        acss: function (e, c)
        {
            if (this.ccss(e, c))
            {
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
        rcss: function (e, c)
        {
            if (!this.ccss(e, c))
            {
                return e;
            }
            var a = e.className.split(' '), d = "";
            for (var i = 0, b = a.length; i < b; i++)
            {
                var f = a[i];
                if (f !== c)
                {
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
        tcss: function (e, c)
        {
            if (this.ccss(e, c))
            {
                this.rcss(e, c);
                return false;
            }
            else
            {
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
        co: function (e)
        {
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
        g: function (c, e, t)
        {
            e = e || document;
            t = t || '*';
            var ns = [], es = _gbt(t, e), l = es.length;
            for (var i = 0, j = 0; i < l; i++)
            {
                if (this.ccss(es[i], c))
                {
                    ns[j] = es[i];
                    j++;
                }
            }
            return ns;
        }
    };
} ();

//////end healthe library

// The following functions were copied from Util.Core, a module within the Healthe Widget Library
// http://prototyping.healthe.cerner.corp/repo/release/site/com.cerner.healthe.navigator/healthe-widget-library/1.2/jsdoc/

function getPosition(e)
{
    e = e || window.event;
    var cursor = { x: 0, y: 0 };
    if (e.pageX || e.pageY)
    {
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    }
    else
    {
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

function gvs()
{
    var n = window, d = document, b = d.body, e = d.documentElement;
    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof n.innerWidth !== 'undefined')
    {
        return [n.innerHeight, n.innerWidth];
    }
    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof e !== 'undefined' && typeof e.clientWidth !== 'undefined' && e.clientWidth !== 0)
    {
        return [e.clientHeight, e.clientWidth];
    }
    // older versions of IE
    else
    {
        return [b.clientHeight, b.clientWidth];
    }
}

function gso()
{
    var d = document, b = d.body, w = window, e = d.documentElement, et = e.scrollTop, bt = b.scrollTop, el = e.scrollLeft, bl = b.scrollLeft;
    if (typeof w.pageYOffset === "number")
    {
        return [w.pageYOffset, w.pageXOffset];
    }
    if (typeof et === "number")
    {
        if (bt > et || bl > el)
        {
            return [bt, bl];
        }
        return [et, el];
    }
    return [bt, bl];
}