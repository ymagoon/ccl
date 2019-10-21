/* Hover Mouse Over */
/* Hover Mouse Over */
function hmo(evt, n, comp){
    evt = evt || window.event;
    var s = n.style, p = getPosition(evt), vp = gvs(), so = gso(), left = p.x + 20, top = p.y + 20;
    n._ps = n.previousSibling;
    n.hmo = true;
    
    function hover(){
        if (n.hmo === true) { //make sure the cursor has not moused out prior to displaying
        	
			if (comp) {
				if (comp.isEditMode()) {
					 clearTimeout(n.timer);
					return;
				}
			}
			
			s.display = "block";	
		    if(left + n.offsetWidth > vp[1] + so[1]) {
				left = left - 40 - n.offsetWidth;
				if(left < 0) {
					left = 0;
				}
			}

			if(top + n.offsetHeight > vp[0] + so[0]) {
				if(top - 40 - n.offsetHeight < so[0]) {
					if(left > 0) {
						top = 10 + so[0];
					}
				} else {
					top = top - 40 - n.offsetHeight;
				}
			}
			document.body.appendChild(n);	
            s.left = left + "px";
            s.top = top + "px";
            n.show = true;
        }
    }
    n.timer = setTimeout(hover, 500);
}
/* Hover Mouse Move */
function hmm(evt, n, comp){
	
    if (!n.show) {
        return;
    }
    
    if (comp) {
		if (comp.isEditMode()) {
			clearTimeout(n.timer);
			return;
		}
	}
    var s = n.style, p = getPosition(evt), vp = gvs(), so = gso(), left = p.x + 20, top = p.y + 20;
    
    if (left + n.offsetWidth > vp[1] + so[1]) {
        left = left - 40 - n.offsetWidth;
        if (left < 0) {
            left = 0;
        }
    }
    
    if (top + n.offsetHeight > vp[0] + so[0]) {
        if (top - 40 - n.offsetHeight < so[0]) {
            if (left > 0) {
                top = 10 + so[0];
            }
        }
        else {
            top = top - 40 - n.offsetHeight;
        }
    }
    evt = evt || window.event;
    s.top = top + "px";
    s.left = left + "px";
}

/* Hover Mouse Out*/
function hmt(evt, n, comp){
	if (comp) {
		if (comp.isEditMode()) {
			clearTimeout(n.timer);
			return;
		}
	}
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
function hs(e, n, comp){
    var priorBgColor = e.style.backgroundColor;
    var priorBorderColor = e.style.borderColor;
	var editMode;
	if (n && n.tagName == "DIV") {
        e.onmouseenter = function(evt){
		if (comp) {
			 if (comp.isEditMode()) {
				return;
			}
		}	
			e.onmouseover = null;
			e.onmouseout = null;
			hmo(evt, n, comp);
        };
        e.onmouseover = function(evt){
		if (comp) {
			 if (comp.isEditMode()|| Util.Style.ccss(this, "row-selected")) {
				return;
			}
		}
			e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
            hmo(evt, n, comp);
        };
        e.onmousemove = function(evt){
		if (comp) {
			 if (comp.isEditMode()|| Util.Style.ccss(this, "row-selected")) {
				return;
			}
		}
			e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
            hmm(evt, n, comp);
        };
        e.onmouseout = function(evt){
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
            hmt(evt, n, comp);
        };
        e.onmouseleave = function(evt){
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
            e.onmouseover = null;
            e.onmouseout = null;
            hmt(evt, n, comp);
        };
        e.onmouseup = function(evt){
            if (comp) {
                if (!comp.isEditMode()) {
                    return;
                }
                
                e.style.backgroundColor = priorBgColor;
                e.style.borderColor = priorBorderColor;
                hmt(evt, n, comp);
            }
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
 
 Util.Pos = function () {

    return {
        /**
         * Returns the actual scrolled offset within the window.
         * @return {array} A Javascript array containing the distance scrolled within the window as [top distance, left distance].
         *
         * @static
         * @function
         * @memberof Util.Pos
         * @name gso
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

//////end healthe library

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
 * Project: mp_component_defs
 * Version 1.0.0
 * Released 7/6/2010
 * @author Greg Howdeshell
 */

Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
};

Function.method('inherits', function(Parent) {
	var d = {}, p = (this.prototype = new Parent());
	this.method('uber', function uber(name) {
		if(!( name in d)) {
			d[name] = 0;
		}
		var f, r, t = d[name], v = Parent.prototype;
		if(t) {
			while(t) {
				v = v.constructor.prototype;
				t -= 1;
			}
			f = v[name];
		}
		else {
			f = p[name];
			if(f == this[name]) {
				f = v[name];
			}
		}
		d[name] += 1;
		r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
		d[name] -= 1;
		return r;
	});
	return this;
});
/**
 * Creates getters and setters for the class based on attributeName.
 *
 * Example:
 *
 * MyClass.createAttribute("Color", "blue");
 *
 * The call above will create this.getColor() and this.setColor(value).
 * A member variable mColor will also be created, with the default value of
 * "blue".
 *
 */
Function.prototype.createAttribute = function(attributeName, defaultValue) {
	this.prototype["m_" + attributeName] = defaultValue;

	this.prototype["get" + attributeName] = function() {
		return this["m_" + attributeName];
	};
	this.prototype["set" + attributeName] = function(value) {
		this["m_" + attributeName] = value;
	};
};
/**
 * MPageComponent constructor
 * @constructor
 */
function MPageComponent() {
	this.m_componentId = 0.0;
	this.m_reportId = 0;
	this.m_reportMean = "";
	this.m_label = "";
	this.m_subLabel = "";
	this.m_column = 0;
	this.m_sequence = 0;
	this.m_link = "";
	this.m_totalResults = false;
	this.m_xOFy = false;
	this.m_isExpanded = false;
	this.m_isAlwaysExpanded = false;
	this.m_scrollNumber = 0;
	this.m_isScrollEnabled = false;
	this.m_styles = null;
	this.m_groups = null;
	this.m_pageGroupSeq = 0;
	this.m_lookbackDays = 0;
	this.m_newLink = false;
	this.criterion = null;
	this.m_isPlusAdd = false;
	//m_scope: 1=person,2=encounter
	this.m_scope = 0;
	this.m_rootComponentNode = null;
	this.m_sectionContentNode = null;
	this.m_compLoadTimerName = "";
	this.m_compRenderTimerName = "";
	this.m_includeLineNumber = false;
	//m_lookbackUnitTypeFlag: 1 = hours,2=Days,3=Weeks,4= Months,5= Years
	this.m_lookbackUnitTypeFlag = 0;
	this.m_lookbackUnits = 0;
	this.m_brlookbackUnitTypeFlag = 0;
	this.m_brlookbackUnits = 0;
	//m_dateFormat: 1 = date only,2= date/time and 3 = elapsed time
	this.m_dateFormat = 2;
	this.m_isCustomizeView = false;
	this.m_menuItems = null;
	this.m_lookBackMenuItems = null;
	this.m_iViewMenuItems = null;
	this.m_displayFilters = null;
	this.m_AutoSuggestScript = "";
	this.m_AutoSuggestAddTimerName = "";
	this.m_editMode = false;
	this.m_compDisp = true;
	this.m_footerText = "";
	this.m_hasLookBackDropDown = false;
	this.m_ScopeHTML = "";
	this.m_compLoad = false;
	this.m_hasCompFilters = false;
	//m_grouper_arr: an array of objects structure like {"label":"group label", "eventSets": []}
	this.m_grouper_arr = [];
	this.m_grouperFilterLabel = "";
	this.m_grouperFilterCriteria = null;
	this.m_grouperFilterEventSets = null;
	this.m_grouperFilterCatLabel = "";
	this.m_grouperFilterCatalogCodes = null;
	this.m_selectedTimeFrame = null;
	this.m_selectedDataGroup = null;
	this.m_menuOptions = [];
	this.m_menuOptionNames = [];
	this.m_hasActionsMenu = false;
	this.m_resourceRequired = false;
	this.m_iViewItemsArr = [];
	this.m_toggleStatus = 1;
	//0 - component off, 1 - component on, 2 - component retuired

	MPageComponent.method("getHasActionsMenu", function() {
		return this.m_hasActionsMenu;
	});
	MPageComponent.method("setHasActionsMenu", function(value) {
		this.m_hasActionsMenu = value;
	});
	MPageComponent.method("getCompColor", function() {
		var style = this.getStyles();
		if(style) {
			return style.getColor();
		}
		else {
			return;
		}
	});
	MPageComponent.method("setCompColor", function(color) {
		var style = this.getStyles();
		if(style) {
			if(color && color.length > 0) {
				style.setColor(color);
			}
		}
	});
	MPageComponent.method("getMenuOptions", function() {
		return this.m_menuOptions;
	});
	MPageComponent.method("setMenuOptions", function(value) {
		if(value) {
			this.m_menuOptions = value;
		}
		else {
			this.m_menuOptions = [];
		}
	});
	MPageComponent.method("getMenuOptionNames", function() {
		return this.m_menuOptionNames;
	});
	MPageComponent.method("setMenuOptionNames", function(value) {
		if(value) {
			this.m_menuOptionNames = value;
		}
		else {
			this.m_menuOptionNames = [];
		}
	});
	MPageComponent.method("addMenuDither", function(itemName) {
		var menuItem = _g(this.m_menuOptions[itemName].id);
		if(menuItem) {
			Util.Style.acss(menuItem, "opts-menu-item-dthr");
			this.m_menuOptions[itemName].isMenuDithered = true;
		}
	});
	MPageComponent.method("removeMenuDither", function(itemName) {
		var menuItem = _g(this.m_menuOptions[itemName].id);
		if(menuItem) {
			Util.Style.rcss(menuItem, "opts-menu-item-dthr");
			this.m_menuOptions[itemName].isMenuDithered = false;
		}
	});
	MPageComponent.method("isMenuDithered", function(itemName) {
		return this.m_menuOptions[itemName].isMenuDithered;
	});
	MPageComponent.method("setMenuOptionText", function(itemName, text) {
		if(text) {
			this.m_menuOptions[itemName].text = text;
			var menuItem = _g(this.m_menuOptions[itemName].id);
			if(menuItem) {
				menuItem.innerHTML = text;
			}
		}
	});
	MPageComponent.method("addMenuOption", function(itemName, id, text, ditherOnLoad, evtType, fn) {
		var actionSec = _g("optsMenuActions" + this.m_componentId);
		if(actionSec) {
			if(!actionSec.hasChildNodes()) {
				var isMenuDithered = (ditherOnLoad) ? ditherOnLoad : false;
				this.m_menuOptions[itemName] = {
					itemName: itemName,
					id: id,
					text: text,
					ditherOnLoad: ditherOnLoad,
					isMenuDithered: isMenuDithered,
					evtType: evtType,
					fn: fn
				};
				this.m_menuOptionNames.push(itemName);
			}
		}
	});
	MPageComponent.method("createMenu", function() {
		var arr = this.m_menuOptionNames;
		var l = arr.length;
		var actionSec = _g("optsMenuActions" + this.m_componentId);
		if(actionSec) {
			if(actionSec.hasChildNodes()) {
				actionSec.innerHTML = "";
			}

			var d = Util.ce('div');
			for(var i = 0; i < l; i++) {
				var optClass = 'opts-menu-item';
				var curOpt = this.m_menuOptions[arr[i]];
				if(curOpt.ditherOnLoad) {
					optClass += ' opts-menu-item-dthr';
				}

				var t = Util.cep("div", {
					id: curOpt.id,
					className: optClass
				});
				t.innerHTML = curOpt.text;
				if(curOpt.evtType && typeof curOpt.fn === 'function') {

					Util.addEvent(t, curOpt.evtType, curOpt.fn);
				}
				d.appendChild(t);
			}

			if(l > 0) {
				var personalizeSec = _g("optsMenupersonalize" + this.m_componentId);
				if(personalizeSec) {
					Util.Style.acss(personalizeSec, "opts-personalize-sec-divider");
				}
			}
			actionSec.appendChild(d);
		}
	});
	MPageComponent.method("isDisplayable", function() {
		if(this.m_displayFilters !== null && this.m_displayFilters.length > 0) {
			for(var x = this.m_displayFilters.length; x--; ) {
				var displayFilter = this.m_displayFilters[x];
				if(displayFilter.checkFilters() === false) {
					CERN_EventListener.removeAllListeners(this, this);
					return false;
				}
			}
		}
		return this.m_compDisp;
	});

	MPageComponent.method("getDisplayFilters", function() {
		return this.m_displayFilters;
	});
	MPageComponent.method("setDisplayFilters", function(value) {
		this.m_displayFilters = value;
	});
	MPageComponent.method("addDisplayFilter", function(value) {
		if(this.m_displayFilters === null) {
			this.m_displayFilters = [];
		}
		this.m_displayFilters.push(value);
	});

	MPageComponent.method("getLookbackMenuItems", function() {
		return this.m_lookBackMenuItems;
	});
	MPageComponent.method("setLookbackMenuItems", function(value) {
		this.m_lookBackMenuItems = value;
	});
	MPageComponent.method("addLookbackMenuItem", function(value) {
		if(this.m_lookBackMenuItems === null) {
			this.m_lookBackMenuItems = [];
		}
		this.m_lookBackMenuItems.push(value);
	});

	MPageComponent.method("getIViewMenuItems", function() {
		return this.m_iViewMenuItems;
	});
	MPageComponent.method("setIViewMenuItems", function(value) {
		this.m_iViewMenuItems = value;
	});
	MPageComponent.method("addIViewMenuItem", function(value) {
		if(this.m_iViewMenuItems === null) {
			this.m_iViewMenuItems = [];
		}
		this.m_iViewMenuItems.push(value);
	});

	MPageComponent.method("getMenuItems", function() {
		return this.m_menuItems;
	});
	MPageComponent.method("setMenuItems", function(value) {
		this.m_menuItems = value;
	});
	MPageComponent.method("addMenuItem", function(value) {
		if(this.m_menuItems === null) {
			this.m_menuItems = [];
		}
		this.m_menuItems.push(value);
	});

	MPageComponent.method("getCustomizeView", function() {
		return this.m_isCustomizeView;
	});
	MPageComponent.method("setCustomizeView", function(value) {
		this.m_isCustomizeView = value;
	});

	MPageComponent.method("InsertData", function() {
		alert("ERROR: InsertData has not been implemented within the component");
	});
	MPageComponent.method("HandleSuccess", function() {
		alert("ERROR: HandleSuccess has not been implemented within the component");
	});
	MPageComponent.method("RetrieveRequiredResource", function() {
		alert("ERROR: RetrieveRequiredResource has not been implemented within the component");
	});
	MPageComponent.method("openTab", function() {
		alert("ERROR: openTab has not been implemented within the component");
	});
	MPageComponent.method("isIViewAdd", function() {
	});

	MPageComponent.method("getComponentLoadTimerName", function() {
		return (this.m_compLoadTimerName);
	});
	MPageComponent.method("setComponentLoadTimerName", function(value) {
		this.m_compLoadTimerName = value;
	});
	MPageComponent.method("getComponentRenderTimerName", function() {
		return (this.m_compRenderTimerName);
	});
	MPageComponent.method("setComponentRenderTimerName", function(value) {
		this.m_compRenderTimerName = value;
	});
	MPageComponent.method("getRootComponentNode", function() {
		if(this.m_rootComponentNode === null) {
			var style = this.getStyles();
			this.m_rootComponentNode = _g(style.getId());
		}
		return (this.m_rootComponentNode);
	});
	MPageComponent.method("setRootComponentNode", function(value) {
		this.m_rootComponentNode = value;
	});
	MPageComponent.method("getSectionContentNode", function() {
		if(this.m_sectionContentNode === null) {
			var style = this.getStyles();
			this.m_sectionContentNode = _g(style.getContentId());
		}
		return (this.m_sectionContentNode);
	});
	MPageComponent.method("setSectionContentNode", function(value) {
		this.m_sectionContentNode = value;
	});
	MPageComponent.method("getMPageName", function() {
		return (this.m_MPageName);
	});
	MPageComponent.method("setMPageName", function(value) {
		this.m_MPageName = value;
	});

	MPageComponent.method("getScope", function() {
		return (this.m_scope);
	});
	MPageComponent.method("setScope", function(value) {
		this.m_scope = value;
	});
	MPageComponent.method("isPlusAddEnabled", function() {
		return (this.m_isPlusAdd);
	});
	MPageComponent.method("setPlusAddEnabled", function(value) {
		this.m_isPlusAdd = value;
	});
	/**
	 * For each compoent a criterion is defined for usage.  This criterion contains information such
	 * as the person, encounter, personnel, etc.
	 * @return {Criterion} Returns a Criterion object containing information such as the patient, encounter, personnel.
	 */
	MPageComponent.method("getCriterion", function() {
		return (this.criterion);
	});
	/**
	 * Sets the criterion
	 * @param {Criterion} value The Criterion object in which to initialize the component with.
	 */
	MPageComponent.method("setCriterion", function(value) {
		this.criterion = value;
	});
	/**
	 *
	 */
	MPageComponent.method("isNewLink", function() {
		return (this.m_newLink);
	});
	MPageComponent.method("setNewLink", function(value) {
		this.m_newLink = value;
	});
	MPageComponent.method("getPageGroupSequence", function() {
		return (this.m_pageGroupSeq);
	});
	MPageComponent.method("setPageGroupSequence", function(value) {
		this.m_pageGroupSeq = value;
	});
	MPageComponent.method("getLookbackDays", function() {
		return (this.m_lookbackDays);
	});
	MPageComponent.method("setLookbackDays", function(value) {
		this.m_lookbackDays = value;
	});

	MPageComponent.method("getComponentId", function() {
		return (this.m_componentId);
	});
	MPageComponent.method("setComponentId", function(value) {
		this.m_componentId = value;
		var styles = this.getStyles();
		if(styles !== null) {
			styles.setComponentId(value);
		}
	});
	MPageComponent.method("getReportId", function() {
		return (this.m_reportId);
	});
	MPageComponent.method("setReportId", function(value) {
		this.m_reportId = value;
	});
	MPageComponent.method("getReportMean", function() {
		return (this.m_reportMean);
	});
	MPageComponent.method("setReportMean", function(value) {
		this.m_reportMean = value;
	});
	MPageComponent.method("getLabel", function() {
		return (this.m_label);
	});
	MPageComponent.method("setLabel", function(value) {
		this.m_label = value;
	});
	MPageComponent.method("updateLabel", function(value) {
		this.m_label = value;
		var rootComponentNode = this.getRootComponentNode();
		var secHead = Util.gc(rootComponentNode, 0);
		var secTitle = Util.gc(Util.Style.g('sec-title', secHead, 'span')[0], 0);
		var anchor = _gbt("a", secTitle);
		if(anchor[0]) {//If secTitle is a link update the link
			anchor[0].innerHTML = value;
		}
		else {//otherwise update just the title
			secTitle.innerHTML = value;
		}
	});
	MPageComponent.method("getSubLabel", function() {
		return (this.m_subLabel);
	});
	MPageComponent.method("setSubLabel", function(value) {
		this.m_subLabel = value;
	});
	MPageComponent.method("updateSubLabel", function(value) {
		//Update the Label sub header
		this.m_subLabel = value;
		var rootComponentNode = this.getRootComponentNode();
		var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
		totalCount[0].innerHTML = this.m_subLabel;
	});
	MPageComponent.method("getColumn", function() {
		return (this.m_column);
	});
	MPageComponent.method("setColumn", function(value) {
		this.m_column = value;
	});
	MPageComponent.method("getSequence", function() {
		return (this.m_sequence);
	});
	MPageComponent.method("setSequence", function(value) {
		this.m_sequence = value;
	});
	MPageComponent.method("getLink", function() {
		return (this.m_link);
	});
	MPageComponent.method("setLink", function(value) {
		this.m_link = value;
	});
	/**
	 * @deprecated Number of results is to be displayed at all times.  Removing the ability to modify.
	 */
	MPageComponent.method("isResultsDisplayEnabled", function() {
		return (this.m_totalResults);
	});
	/**
	 * @deprecated Number of results is to be displayed at all times.  Removing the ability to modify.
	 */
	MPageComponent.method("setResultsDisplayEnabled", function(value) {
		this.m_totalResults = value;
	});
	/**
	 * @deprecated Number of results is to be displayed in the (X) format.  Removing the ability to modify.
	 */
	MPageComponent.method("isXofYEnabled", function() {
		return (this.m_xOFy);
	});
	/**
	 * @deprecated Number of results is to be displayed in the (X) format.  Removing the ability to modify.
	 */
	MPageComponent.method("setXofYEnabled", function(value) {
		this.m_xOFy = value;
	});
	MPageComponent.method("isExpanded", function() {
		return (this.m_isExpanded);
	});
	MPageComponent.method("setExpanded", function(value) {
		this.m_isExpanded = value;
	});
	MPageComponent.method("setExpandCollapseState", function(value) {
		this.m_isExpanded = value;
		var i18nCore = i18n.discernabu;
		var parentNode = this.getRootComponentNode();
		var expColNode = Util.Style.g("sec-hd-tgl", parentNode, "span");
		if(value) {
			Util.Style.rcss(parentNode, "closed");
			expColNode[0].innerHTML = "-";
			expColNode[0].title = i18nCore.HIDE_SECTION;
		}
		else {
			Util.Style.acss(parentNode, "closed");
			expColNode[0].innerHTML = "+";
			expColNode[0].title = i18nCore.SHOW_SECTION;
		}
	});
	MPageComponent.method("isAlwaysExpanded", function() {
		return (this.m_isAlwaysExpanded);
	});
	MPageComponent.method("setAlwaysExpanded", function(value) {
		this.m_isAlwaysExpanded = value;
	});
	MPageComponent.method("getScrollNumber", function() {
		return (this.m_scrollNumber);
	});
	MPageComponent.method("setScrollNumber", function(value) {
		this.m_scrollNumber = value;
	});
	MPageComponent.method("isScrollingEnabled", function() {
		return (this.m_isScrollEnabled);
	});
	MPageComponent.method("setScrollingEnabled", function(value) {
		this.m_isScrollEnabled = value;
	});
	MPageComponent.method("getStyles", function() {
		return (this.m_styles);
	});
	MPageComponent.method("setStyles", function(value) {
		this.m_styles = value;
	});
	MPageComponent.method("getFilters", function() {
		return (this.m_filters);
	});
	MPageComponent.method("getGroups", function() {
		if(this.m_groups === null) {
			this.m_groups = [];
		}
		return (this.m_groups);
	});
	MPageComponent.method("setGroups", function(value) {
		this.m_groups = value;
	});
	MPageComponent.method("addGroup", function(value) {
		if(this.m_groups === null) {
			this.m_groups = [];
		}
		this.m_groups.push(value);
	});

	MPageComponent.method("getLookbackUnitTypeFlag", function() {
		return (this.m_lookbackUnitTypeFlag);
	});
	MPageComponent.method("setLookbackUnitTypeFlag", function(value) {
		this.m_lookbackUnitTypeFlag = value;
	});
	MPageComponent.method("getLookbackUnits", function() {
		return (this.m_lookbackUnits);
	});
	MPageComponent.method("setLookbackUnits", function(value) {
		this.m_lookbackUnits = value;
	});
	MPageComponent.method("getBrLookbackUnitTypeFlag", function() {
		return (this.m_brlookbackUnitTypeFlag);
	});
	MPageComponent.method("setBrLookbackUnitTypeFlag", function(value) {
		this.m_brlookbackUnitTypeFlag = value;
	});
	MPageComponent.method("getBrLookbackUnits", function() {
		return (this.m_brlookbackUnits);
	});
	MPageComponent.method("setBrLookbackUnits", function(value) {
		this.m_brlookbackUnits = value;
	});
	/**
	 * Return true if the component has been defined as including the line number within the
	 * title text of the component.
	 */
	MPageComponent.method("isLineNumberIncluded", function() {
		return this.m_includeLineNumber;
	});
	/**
	 * Allows each component to define, based on requirements, whether or not to display the number of
	 * line items within the title text of the component.
	 * @param {Boolean} value If true, the line number associated to the component will display within the
	 * title text of the component.  Else, the line number will not display within the title text of the
	 * component.
	 */
	MPageComponent.method("setIncludeLineNumber", function(value) {
		this.m_includeLineNumber = value;
	});
	MPageComponent.method("getDateFormat", function() {
		//1 = date only,2= date/time and 3 = elapsed time
		return (this.m_dateFormat);
	});
	MPageComponent.method("setDateFormat", function(value) {
		this.m_dateFormat = value;
	});
	MPageComponent.method("setAutoSuggestAddScript", function(value) {
		this.m_AutoSuggestScript = value;
	});
	MPageComponent.method("getAutoSuggestAddScript", function() {
		return (this.m_AutoSuggestScript);
	});
	MPageComponent.method("setAutoSuggestAddTimerName", function(value) {
		this.m_AutoSuggestAddTimerName = value;
	});
	MPageComponent.method("getAutoSuggestAddTimerName", function() {
		return (this.m_AutoSuggestAddTimerName);
	});
	MPageComponent.method("setEditMode", function(value) {
		this.m_editMode = value;
	});
	MPageComponent.method("isEditMode", function() {
		return (this.m_editMode);
	});
	MPageComponent.method("setDisplayEnabled", function(value) {
		this.m_compDisp = value;
	});
	MPageComponent.method("getDisplayEnabled", function() {
		return (this.m_compDisp);
	});
	MPageComponent.method("setFooterText", function(value) {
		this.m_footerText = value;
	});
	MPageComponent.method("getFooterText", function() {
		return (this.m_footerText);
	});
	MPageComponent.method("hasLookBackDropDown", function() {
		return (this.m_hasLookBackDropDown);
	});
	MPageComponent.method("setLookBackDropDown", function(value) {
		this.m_hasLookBackDropDown = value;
	});
	MPageComponent.method("setScopeHTML", function(value) {
		this.m_ScopeHTML = value;
	});
	MPageComponent.method("getScopeHTML", function() {
		return (this.m_ScopeHTML);
	});
	MPageComponent.method("isLoaded", function() {
		return (this.m_compLoad);
	});
	MPageComponent.method("setLoaded", function(value) {
		this.m_compLoad = value;
	});
	MPageComponent.method("hasCompFilters", function() {
		return (this.m_hasCompFilters);
	});
	MPageComponent.method("setCompFilters", function(value) {
		this.m_hasCompFilters = value;
	});
	MPageComponent.method("getGrouperFilterLabel", function() {
		return this.m_grouperFilterLabel;
	});
	MPageComponent.method("setGrouperFilterLabel", function(value) {
		this.m_grouperFilterLabel = value;
	});
	MPageComponent.method("getGrouperFilterEventSets", function() {
		return (this.getGrouperFilterCriteria());
	});
	MPageComponent.method("setGrouperFilterEventSets", function(value) {
		this.setGrouperFilterCriteria(value);
	});
	MPageComponent.method("addGrouperFilterEventSets", function(value) {
		this.addGrouperFilterCriteria(value);
	});
	MPageComponent.method("getGrouperFilterCriteria", function() {
		return this.m_grouperFilterCriteria;
	});
	MPageComponent.method("setGrouperFilterCriteria", function(value) {
		this.m_grouperFilterCriteria = value;
	});
	MPageComponent.method("addGrouperFilterCriteria", function(value) {
		if(this.m_grouperFilterCriteria === null) {
			this.m_grouperFilterCriteria = [];
		}
		this.m_grouperFilterCriteria.push(value);
	});
	MPageComponent.method("getGrouperFilterCatLabel", function() {
		return this.m_grouperFilterCatLabel;
	});
	MPageComponent.method("setGrouperFilterCatLabel", function(value) {
		this.m_grouperFilterCatLabel = value;
	});
	MPageComponent.method("getGrouperFilterCatalogCodes", function() {
		return this.m_grouperFilterCatalogCodes;
	});
	MPageComponent.method("setGrouperFilterCatalogCodes", function(value) {
		this.m_grouperFilterCatalogCodes = value;
	});
	MPageComponent.method("addGrouperFilterCatalogCodes", function(value) {
		if(this.m_grouperFilterCatalogCodes === null) {
			this.m_grouperFilterCatalogCodes = [];
		}
		this.m_grouperFilterCatalogCodes.push(value);
	});
	MPageComponent.method("setGrp1Label", function(value) {
		this.setGrouperLabel(0, value);
	});
	MPageComponent.method("getGrp1Label", function() {
		return this.getGrouperLabel(0);
	});
	MPageComponent.method("setGrp1EventSets", function(value) {
		this.setGrouperCriteria(0, value);
	});
	MPageComponent.method("getGrp1EventSets", function() {
		return this.getGrouperCriteria(0);
	});
	MPageComponent.method("setGrp1Criteria", function(value) {
		this.setGrouperCriteria(0, value);
	});
	MPageComponent.method("getGrp1Criteria", function() {
		return this.getGrouperCriteria(0);
	});
	MPageComponent.method("setGrp2Label", function(value) {
		this.setGrouperLabel(1, value);
	});
	MPageComponent.method("getGrp2Label", function() {
		return this.getGrouperLabel(1);
	});
	MPageComponent.method("setGrp2EventSets", function(value) {
		this.setGrouperCriteria(1, value);
	});
	MPageComponent.method("getGrp2EventSets", function() {
		return this.getGrouperCriteria(1);
	});
	MPageComponent.method("setGrp2Criteria", function(value) {
		this.setGrouperCriteria(1, value);
	});
	MPageComponent.method("getGrp2Criteria", function() {
		return this.getGrouperCriteria(1);
	});
	MPageComponent.method("setGrp3Label", function(value) {
		this.setGrouperLabel(2, value);
	});
	MPageComponent.method("getGrp3Label", function() {
		return this.getGrouperLabel(2);
	});
	MPageComponent.method("setGrp3EventSets", function(value) {
		this.setGrouperCriteria(2, value);
	});
	MPageComponent.method("getGrp3EventSets", function() {
		return this.getGrouperCriteria(2);
	});
	MPageComponent.method("setGrp3Criteria", function(value) {
		this.setGrouperCriteria(2, value);
	});
	MPageComponent.method("getGrp3Criteria", function() {
		return this.getGrouperCriteria(2);
	});
	MPageComponent.method("setGrp4Label", function(value) {
		this.setGrouperLabel(3, value);
	});
	MPageComponent.method("getGrp4Label", function() {
		return this.getGrouperLabel(3);
	});
	MPageComponent.method("setGrp4EventSets", function(value) {
		this.setGrouperCriteria(3, value);
	});
	MPageComponent.method("getGrp4EventSets", function() {
		return this.getGrouperCriteria(3);
	});
	MPageComponent.method("setGrp4Criteria", function(value) {
		this.setGrouperCriteria(3, value);
	});
	MPageComponent.method("getGrp4Criteria", function() {
		return this.getGrouperCriteria(3);
	});
	MPageComponent.method("setGrp5Label", function(value) {
		this.setGrouperLabel(4, value);
	});
	MPageComponent.method("getGrp5Label", function() {
		return this.getGrouperLabel(4);
	});
	MPageComponent.method("setGrpEventSets", function(value) {
		this.setGrouperCriteria(4, value);
	});
	MPageComponent.method("getGrp5EventSets", function() {
		return this.getGrouperCriteria(4);
	});
	MPageComponent.method("setGrp5Criteria", function(value) {
		this.setGrouperCriteria(4, value);
	});
	MPageComponent.method("getGrp5Criteria", function() {
		return this.getGrouperCriteria(4);
	});
	MPageComponent.method("setGrp6Label", function(value) {
		this.setGrouperLabel(5, value);
	});
	MPageComponent.method("getGrp6Label", function() {
		return this.getGrouperLabel(5);
	});
	MPageComponent.method("setGrp6EventSets", function(value) {
		this.setGrouperCriteria(5, value);
	});
	MPageComponent.method("getGrp6EventSets", function() {
		return this.getGrouperCriteria(5);
	});
	MPageComponent.method("setGrp6Criteria", function(value) {
		this.setGrouperCriteria(5, value);
	});
	MPageComponent.method("getGrp6Criteria", function() {
		return this.getGrouperCriteria(5);
	});
	MPageComponent.method("setGrp7Label", function(value) {
		this.setGrouperLabel(6, value);
	});
	MPageComponent.method("getGrp7Label", function() {
		return this.getGrouperLabel(6);
	});
	MPageComponent.method("setGrp7EventSets", function(value) {
		this.setGrouperCriteria(6, value);
	});
	MPageComponent.method("getGrp7EventSets", function() {
		return this.getGrouperCriteria(6);
	});
	MPageComponent.method("setGrp7Criteria", function(value) {
		this.setGrouperCriteria(6, value);
	});
	MPageComponent.method("getGrp7Criteria", function() {
		return this.getGrouperCriteria(6);
	});
	MPageComponent.method("setGrp8Label", function(value) {
		this.setGrouperLabel(7, value);
	});
	MPageComponent.method("getGrp8Label", function() {
		return this.getGrouperLabel(7);
	});
	MPageComponent.method("setGrp8EventSets", function(value) {
		this.setGrouperCriteria(7, value);
	});
	MPageComponent.method("getGrp8EventSets", function() {
		return this.getGrouperCriteria(7);
	});
	MPageComponent.method("setGrp8Criteria", function(value) {
		this.setGrouperCriteria(7, value);
	});
	MPageComponent.method("getGrp8Criteria", function() {
		return this.getGrouperCriteria(7);
	});
	MPageComponent.method("setGrp9Label", function(value) {
		this.setGrouperLabel(8, value);
	});
	MPageComponent.method("getGrp9Label", function() {
		return this.getGrouperLabel(8);
	});
	MPageComponent.method("setGrp9EventSets", function(value) {
		this.setGrouperCriteria(8, value);
	});
	MPageComponent.method("getGrp9EventSets", function() {
		return this.getGrouperCriteria(8);
	});
	MPageComponent.method("setGrp9Criteria", function(value) {
		this.setGrouperCriteria(8, value);
	});
	MPageComponent.method("getGrp9Criteria", function() {
		return this.getGrouperCriteria(8);
	});
	MPageComponent.method("setGrp10Label", function(value) {
		this.setGrouperLabel(9, value);
	});
	MPageComponent.method("getGrp10Label", function() {
		return this.getGrouperLabel(9);
	});
	MPageComponent.method("setGrp10EventSets", function(value) {
		this.setGrouperCriteria(9, value);
	});
	MPageComponent.method("getGrp10EventSets", function() {
		return this.getGrouperCriteria(9);
	});
	MPageComponent.method("setGrp10Criteria", function(value) {
		this.setGrouperCriteria(9, value);
	});
	MPageComponent.method("getGrp10Criteria", function() {
		return this.getGrouperCriteria(9);
	});
	MPageComponent.method("setGrp1CatLabel", function(value) {
		this.setGrouperCatLabel(0, value);
	});
	MPageComponent.method("getGrp1CatLabel", function() {
		return this.getGrouperCatLabel(0);
	});
	MPageComponent.method("setGrp1CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(0, value);
	});
	MPageComponent.method("getGrp1CatalogCodes", function() {
		return this.getGrouperCatalogCodes(0);
	});
	MPageComponent.method("setGrp2CatLabel", function(value) {
		this.setGrouperCatLabel(1, value);
	});
	MPageComponent.method("getGrp2CatLabel", function() {
		return this.getGrouperCatLabel(1);
	});
	MPageComponent.method("setGrp2CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(1, value);
	});
	MPageComponent.method("getGrp2CatalogCodes", function() {
		return this.getGrouperCatalogCodes(1);
	});
	MPageComponent.method("setGrp3CatLabel", function(value) {
		this.setGrouperCatLabel(2, value);
	});
	MPageComponent.method("getGrp3CatLabel", function() {
		return this.getGrouperCatLabel(2);
	});
	MPageComponent.method("setGrp3CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(2, value);
	});
	MPageComponent.method("getGrp3CatalogCodes", function() {
		return this.getGrouperCatalogCodes(2);
	});
	MPageComponent.method("setGrp4CatLabel", function(value) {
		this.setGrouperCatLabel(3, value);
	});
	MPageComponent.method("getGrp4CatLabel", function() {
		return this.getGrouperCatLabel(3);
	});
	MPageComponent.method("setGrp4CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(3, value);
	});
	MPageComponent.method("getGrp4CatalogCodes", function() {
		return this.getGrouperCatalogCodes(3);
	});
	MPageComponent.method("setGrp5CatLabel", function(value) {
		this.setGrouperCatLabel(4, value);
	});
	MPageComponent.method("getGrp5CatLabel", function() {
		return this.getGrouperCatLabel(4);
	});
	MPageComponent.method("setGrp5CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(4, value);
	});
	MPageComponent.method("getGrp5CatalogCodes", function() {
		return this.getGrouperCatalogCodes(4);
	});
	MPageComponent.method("setGrp6CatLabel", function(value) {
		this.setGrouperCatLabel(5, value);
	});
	MPageComponent.method("getGrp6CatLabel", function() {
		return this.getGrouperCatLabel(5);
	});
	MPageComponent.method("setGrp6CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(5, value);
	});
	MPageComponent.method("getGrp6CatalogCodes", function() {
		return this.getGrouperCatalogCodes(5);
	});
	MPageComponent.method("setGrp7CatLabel", function(value) {
		this.setGrouperCatLabel(6, value);
	});
	MPageComponent.method("getGrp7CatLabel", function() {
		return this.getGrouperCatLabel(6);
	});
	MPageComponent.method("setGrp7CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(6, value);
	});
	MPageComponent.method("getGrp7CatalogCodes", function() {
		return this.getGrouperCatalogCodes(6);
	});
	MPageComponent.method("setGrp8CatLabel", function(value) {
		this.setGrouperCatLabel(7, value);
	});
	MPageComponent.method("getGrp8CatLabel", function() {
		return this.getGrouperCatLabel(7);
	});
	MPageComponent.method("setGrp8CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(7, value);
	});
	MPageComponent.method("getGrp8CatalogCodes", function() {
		return this.getGrouperCatalogCodes(7);
	});
	MPageComponent.method("setGrp9CatLabel", function(value) {
		this.setGrouperCatLabel(8, value);
	});
	MPageComponent.method("getGrp9CatLabel", function() {
		return this.getGrouperCatLabel(8);
	});
	MPageComponent.method("setGrp9CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(8, value);
	});
	MPageComponent.method("getGrp9CatalogCodes", function() {
		return this.getGrouperCatalogCodes(8);
	});
	MPageComponent.method("setGrp10CatLabel", function(value) {
		this.setGrouperCatLabel(9, value);
	});
	MPageComponent.method("getGrp10CatLabel", function() {
		return this.getGrouperCatLabel(9);
	});
	MPageComponent.method("setGrp10CatalogCodes", function(value) {
		this.setGrouperCatalogCodes(9, value);
	});
	MPageComponent.method("getGrp10CatalogCodes", function() {
		return this.getGrouperCatalogCodes(9);
	});

	MPageComponent.method("setGrouperLabel", function(index, label) {
		if(index !== null && !isNaN(index)) {
			if(this.m_grouper_arr[index]) {
				this.m_grouper_arr[index].label = label;
			}
			else {
				this.m_grouper_arr[index] = {};
				this.m_grouper_arr[index].label = label;
			}
		}
	});
	MPageComponent.method("getGrouperLabel", function(index) {
		if(index !== null && !isNaN(index)) {
			return (this.m_grouper_arr[index]) ? this.m_grouper_arr[index].label : "";
		}
	});
	MPageComponent.method("setGrouperEventSets", function(index, EventSetItem) {
		this.setGrouperCriteria(index, EventSetItem);
	});
	MPageComponent.method("getGrouperEventSets", function(index) {
		return this.getGrouperCriteria(index);
	});
	MPageComponent.method("setGrouperCriteria", function(index, Criteria) {
		if(index !== null && !isNaN(index)) {
			if(this.m_grouper_arr[index]) {
				this.m_grouper_arr[index].criteria = Criteria;
			}
			else {
				this.m_grouper_arr[index] = {};
				this.m_grouper_arr[index].criteria = Criteria;
			}
		}
	});
	MPageComponent.method("getGrouperCriteria", function(index) {
		if(index !== null && !isNaN(index)) {
			return (this.m_grouper_arr[index]) ? this.m_grouper_arr[index].criteria : "";
		}
	});

	MPageComponent.method("setGrouperCatLabel", function(index, label) {
		if(index !== null && !isNaN(index)) {
			if(this.m_grouper_arr[index]) {
				this.m_grouper_arr[index].catLabel = label;
			}
			else {
				this.m_grouper_arr[index] = {};
				this.m_grouper_arr[index].catLabel = label;
			}
		}
	});
	MPageComponent.method("getGrouperCatLabel", function(index) {
		if(index !== null && !isNaN(index)) {
			return (this.m_grouper_arr[index]) ? this.m_grouper_arr[index].catLabel : "";
		}
	});

	MPageComponent.method("setGrouperCatalogCodes", function(index, CatalogCodeItem) {
		if(index !== null && !isNaN(index)) {
			if(this.m_grouper_arr[index]) {
				this.m_grouper_arr[index].catalogCodes = CatalogCodeItem;
			}
			else {
				this.m_grouper_arr[index] = {};
				this.m_grouper_arr[index].catalogCodes = CatalogCodeItem;
			}
		}
	});
	MPageComponent.method("getGrouperCatalogCodes", function(index) {
		if(index !== null && !isNaN(index)) {
			return (this.m_grouper_arr[index]) ? this.m_grouper_arr[index].catalogCodes : "";
		}
	});

	MPageComponent.method("setIViewItemsArrElement", function(index, sBandName, sSectionName, sItemName) {
		if(index !== null && !isNaN(index)) {
			this.m_iViewItemsArr[index] = {
				bandName: sBandName,
				sectionName: sSectionName,
				itemName: sItemName
			};
		}
	});
	MPageComponent.method("getIViewItemsArrElement", function(index, nameSelect) {
		if(index !== null && !isNaN(index)) {
			switch(nameSelect) {
				case "BAND":
					return (this.m_iViewItemsArr[index]) ? this.m_iViewItemsArr[index].bandName : "";
				case "SECTION":
					return (this.m_iViewItemsArr[index]) ? this.m_iViewItemsArr[index].sectionName : "";
				case "ITEM":
					return (this.m_iViewItemsArr[index]) ? this.m_iViewItemsArr[index].itemName : "";
				default:
					return "";
			}
		}
	});
	MPageComponent.method("sortGrouperArrayByLabel", function() {
		this.m_grouper_arr.sort(function(a, b) {
			if(a["label"] && b["label"]) {
				a = a["label"].toUpperCase();
				b = b["label"].toUpperCase();
				if(a < b) {
					return -1;
				}
				else {
					if(a === b) {
						return 0;
					}
					else {
						return 1;
					}
				}
			}
			else if(a["catLabel"] && b["catLabel"]) {
				a = a["catLabel"].toUpperCase();
				b = b["catLabel"].toUpperCase();
				if(a < b) {
					return -1;
				}
				else {
					if(a === b) {
						return 0;
					}
					else {
						return 1;
					}
				}
			}
			else if(a["label"] || a["catLabel"]) {
				return 1;
			}
			else {
				return -1;
			}
		});
	});
	MPageComponent.method("getSelectedTimeFrame", function() {
		return (this.m_selectedTimeFrame);
	});
	MPageComponent.method("setSelectedTimeFrame", function(value) {
		this.m_selectedTimeFrame = value;
	});
	MPageComponent.method("getSelectedDataGroup", function() {
		return (this.m_selectedDataGroup);
	});
	MPageComponent.method("setSelectedDataGroup", function(value) {
		this.m_selectedDataGroup = value;
	});
	MPageComponent.method("isResourceRequired", function() {
		return (this.m_resourceRequired);
	});
	MPageComponent.method("setResourceRequired", function(value) {
		this.m_resourceRequired = value;
	});
	MPageComponent.method("renderAccordion", function(component) {
		var i18nCore = i18n.discernabu;
		var mnuDisplay = i18nCore.FACILITY_DEFINED_VIEW;
		var dispVar = i18nCore.FACILITY_DEFINED_VIEW;
		var compID = component.getComponentId();
		var style = component.getStyles();
		var ns = style.getNameSpace();
		var styleId = style.getId();
		var loc = component.getCriterion().static_content;
		var mnuId = styleId + "TypeMenu";
		var z = 0;

		component.sortGrouperArrayByLabel();

		//User Prefs:  If user prefs available then set display type and filter applied msg appropriately
		if(component.getGrouperFilterCriteria()) {
			mnuDisplay = component.getGrouperFilterLabel();
			var filterAppliedSpan = _g("cf" + compID + "msg");
			if(filterAppliedSpan) {
				// Remove the old span element
				Util.de(filterAppliedSpan);
			}
			if(component.getGrouperFilterLabel() !== dispVar) {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf", compID, "msg' class='filter-applied-msg' title='", component.getGrouperFilterLabel(), "'>", i18nCore.FILTER_APPLIED, "</span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join('');
				var lbDropDownDiv = _g("lbMnuDisplay" + compID);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}
		}
		if(component.getGrouperFilterCatalogCodes()) {
			mnuDisplay = component.getGrouperFilterCatLabel();
			var filterAppliedSpan = _g("cf" + compID + "msg");
			if(filterAppliedSpan) {
				// Remove the old span element
				Util.de(filterAppliedSpan);
			}
			if(component.getGrouperFilterCatLabel() !== dispVar) {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf", compID, "msg' class='filter-applied-msg' title='", component.getGrouperFilterCatLabel(), "'>", i18nCore.FILTER_APPLIED, "</span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join('');
				var lbDropDownDiv = _g("lbMnuDisplay" + compID);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}
		}
		//Find the content div
		var contentDiv = _g("Accordion" + compID + "ContentDiv");

		//Create the new content div innerHTML with the select list
		var contentDivArr = [];
		var groupLen = component.m_grouper_arr.length;
		contentDivArr.push("<div id='cf", mnuId, "' class='acc-mnu'>");
		contentDivArr.push("<span id='cflabel", compID, "' onclick='MP_Util.LaunchMenu(\"", mnuId, "\", \"", styleId, "\");'>", i18nCore.FILTER_LABEL, mnuDisplay, "<a id='compFilterDrop", compID, "'><img src='", loc, "\\images\\3943_16.gif'></a></span>");
		contentDivArr.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='", mnuId, "'><div class='acc-mnu-contentbox'>");
		contentDivArr.push("<div><span id='cf", styleId, "' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compID, ",\"", dispVar, "\",\"\",1);'>", i18nCore.FACILITY_DEFINED_VIEW, "</span></div>");
		for( z = 0, c = 0; c < groupLen && z < 10; z++) {
			if(component.getGrouperLabel(z)) {
				c++;
				var esIndex = z;
				contentDivArr.push("<div><span id='cf", styleId, z, "' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compID, ",\"", component.getGrouperLabel(z), "\",", esIndex, ",1);'>", component.getGrouperLabel(z), "</span></div>");
			}
			if(component.getGrouperCatLabel(z)) {
				c++;
				var esIndex = z;
				contentDivArr.push("<div><span id='cf", styleId, z, "' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compID, ",\"", component.getGrouperCatLabel(z), "\",", esIndex, ",1);'>", component.getGrouperCatLabel(z), "</span></div>");
			}
		}
		contentDivArr.push("</div></div></div>");
		contentDiv.innerHTML = contentDivArr.join('');
	});
	MPageComponent.method("setToggleStatus", function(toggleStatus) {
		if( typeof toggleStatus === "string") {
			this.m_toggleStatus = parseInt(togleStatus, 10);
		}
		else if( typeof toggleStatus === "number") {
			this.m_toggleStatus = toggleStatus;
		}
	});
	MPageComponent.method("getToggleStatus", function() {
		return this.m_toggleStatus;
	});
	/**
	 * This function will be used to handle any processing that needs to take place prior to the component being rendered
	 */
	MPageComponent.method("postProcessing", function() {
		//Resize the component appropriately if it is shown within a workflow
		this.resizeComponent();
		
		//Any additional functionality that needs to happen after the component is rendered can happen here.
	});
	/**
	 * This function will be used to resize the component based on the type.
	 */
	MPageComponent.method("resizeComponent", function() {
		var calcHeight = "";
		var compHeight = 0;
		var compDOMObj = null;
		var compType = null;
		var container = null;
		var contentBodyHeight = 0;
		var contentBodyObj = null;
		var miscHeight = 20;
		var viewHeight = 0;
		
		compType = this.getStyles().getComponentType();
		switch(compType){
			//case CERN_COMPONENT_TYPE_SUMMARY:
				//return;
			case CERN_COMPONENT_TYPE_WORKFLOW:
				container = $("#vwpBody");
				if(!container.length){
					return;
				}
				viewHeight = $(container).height();
				
				//Make sure component is rendered
				compDOMObj = $("#" + this.getStyles().getId());
				if(!compDOMObj.length){
					return;
				}
				
				//Get the overall height of the content-body section if available at this time
				contentBodyObj = $(compDOMObj).find(".content-body");
				if(contentBodyObj.length){
					//Get the overall component height
					compHeight = compDOMObj.height();
					//Get the height of the content-body
					contentBodyHeight = $(contentBodyObj).height();
					//Calculate the estimated max height of the components content-body element
					calcHeight = (viewHeight - (compHeight - contentBodyHeight + miscHeight)) + "px";
					//apply the max-height settings
					$(contentBodyObj).css("max-height", calcHeight).css("overflow-y", "auto");
				}
				return;
			default:
				return;
		}
	});
}

function MPageComponentInteractive() {
	this.m_DocPrivObj = null;
	this.m_DocPrivMask = 0;

	MPageComponentInteractive.method("setPrivObj", function(value) {
		this.m_DocPrivObj = value;
	});
	MPageComponentInteractive.method("getDocPrivObj", function() {
		return (m_DocPrivObj);
	});
	MPageComponentInteractive.method("setIsCompViewable", function(value) {
		this.m_isCompViewable = value;
	});
	MPageComponentInteractive.method("setIsCompAddable", function(value) {
		this.m_isCompAddable = value;
	});
	MPageComponentInteractive.method("setIsCompModifiable", function(value) {
		this.m_isCompModifiable = value;
	});
	MPageComponentInteractive.method("setIsCompUnchartable", function(value) {
		this.m_isCompUnchartable = value;
	});
	MPageComponentInteractive.method("setIsCompSignable", function(value) {
		this.m_isCompSignable = value;
	});
	MPageComponentInteractive.method("getCompPrivMask", function() {
		var VIEW_MASK = parseInt("1", 2);
		var ADD_MASK = parseInt("10", 2);
		var MODIFY_MASK = parseInt("100", 2);
		var UNCHART_MASK = parseInt("1000", 2);
		var SIGN_MASK = parseInt("10000", 2);
		var privMask = 0;
		privMask = ((this.m_isCompViewable) ? VIEW_MASK : 0) | //Add View Privs if true
		((this.m_isCompAddable) ? ADD_MASK : 0) | //Add Add Privs if true
		((this.m_isCompModifiable) ? MODIFY_MASK : 0) | //Add Mod Privs if true
		((this.m_isCompUnchartable) ? UNCHART_MASK : 0) | //Add Uchart Privs if true
		((this.m_isCompSignable) ? SIGN_MASK : 0);
		//Add Sign Privs if true

		return (privMask);
	});

	MPageComponentInteractive.method("getPrivFromArray", function(eventCd, array) {
		var i = array.length;
		while(i--) {
			if(eventCd == array[i].EVENT_CD) {
				return (true);
			}
		}
		return (false);
	});

	MPageComponentInteractive.method("isResultEventCodeSignable", function(eventCd) {
		if(this.getPrivFromArray(eventCd, m_DocPrivObj.getResponse().EVENT_PRIVILEGES.VIEW_RESULTS.GRANTED.EVENT_CODES)) {
			return (true);
		}
		else {
			return (false);
		}
	});

	MPageComponentInteractive.method("isResultEventCodeAddable", function(eventCd) {
		if(this.getPrivFromArray(eventCd, m_DocPrivObj.getResponse().EVENT_PRIVILEGES.ADD_DOCUMENTATION.GRANTED.EVENT_CODES)) {
			return (true);
		}
		else {
			return (false);
		}
	});
	MPageComponentInteractive.method("isResultEventCodeModifiable", function(eventCd) {
		if(this.getPrivFromArray(eventCd, m_DocPrivObj.getResponse().EVENT_PRIVILEGES.MODIFY_DOCUMENTATION.GRANTED.EVENT_CODES)) {
			return (true);
		}
		else {
			return (false);
		}
	});
	MPageComponentInteractive.method("isResultEventCodeUnchartable", function(eventCd) {
		if(this.getPrivFromArray(eventCd, m_DocPrivObj.getResponse().EVENT_PRIVILEGES.UNCHART_DOCUMENTATION.GRANTED.EVENT_CODES)) {
			return (true);
		}
		else {
			return (false);
		}
	});
	MPageComponentInteractive.method("isResultEventCodeSignable", function(eventCd) {
		if(this.getPrivFromArray(eventCd, m_DocPrivObj.getResponse().EVENT_PRIVILEGES.SIGN_DOCUMENTATION.GRANTED.EVENT_CODES)) {
			return (true);
		}
		else {
			return (false);
		}
	});

	MPageComponentInteractive.method("getEventCdPrivs", function(component, eventArr) {
		var criterion = this.getCriterion();
		var paramEventCd = MP_Util.CreateParamArray(eventArr, 1);
		var paramPrivMask = this.getCompPrivMask();
		var sendAr = ["^MINE^", criterion.provider_id + ".0", paramEventCd, "0.0", paramPrivMask, criterion.ppr_cd + ".0"];
		var request = new MP_Core.ScriptRequest(this, "ENG:MPG.MPCINTERACTIVE - Get Doc prefs");
		request.setParameters(sendAr);
		request.setName("getCompPrivs");
		request.setProgramName("MP_GET_PRIVS_BY_CODE_JSON");
		request.setAsync(false);
		MP_Core.XMLCCLRequestCallBack(component, request, this.processEventCdReply);

	});

	MPageComponentInteractive.method("processEventCdReply", function(reply) {
		m_DocPrivObj = reply;
	});
}

MPageComponentInteractive.inherits(MPageComponent);

/*
 * The MPage grouper provides a means in which to group MPageGroups together into an
 * array for results such as Blood Pressure where each group is a sequence of events.
 */
function MPageGrouper() {
	this.m_groups = null;
	MPageGrouper.method("setGroups", function(value) {
		this.m_groups = value;
	});
	MPageGrouper.method("getGroups", function() {
		return this.m_groups;
	});
	MPageGrouper.method("addGroup", function(value) {
		if(this.m_groups === null) {
			this.m_groups = [];
		}
		this.m_groups.push(value);
	});
}

MPageGrouper.inherits(MPageGroup);

function MPageGroup() {
	this.m_groupName = "";
	this.m_groupSeq = 0;
	this.m_groupId = 0;
	MPageGroup.method("setGroupId", function(value) {
		this.m_groupId = value;
	});
	MPageGroup.method("getGroupId", function() {
		return this.m_groupId;
	});
	MPageGroup.method("setGroupName", function(value) {
		this.m_groupName = value;
	});
	MPageGroup.method("getGroupName", function() {
		return this.m_groupName;
	});
	MPageGroup.method("setSequence", function(value) {
		this.m_groupSeq = value;
	});
	MPageGroup.method("getSequence", function() {
		return this.m_groupSeq;
	});
}

function MPageEventSetGroup() {
	this.m_eventSets = null;
	this.m_isSequenced = false;
	MPageEventSetGroup.method("isSequenced", function() {
		return this.m_isSequenced;
	});
	MPageEventSetGroup.method("setSequenced", function(value) {
		this.m_isSequenced = value;
	});
	MPageEventSetGroup.method("getEventSets", function() {
		return this.m_eventSets;
	});
	MPageEventSetGroup.method("setEventSets", function(value) {
		this.m_eventSets = value;
	});
	MPageEventSetGroup.method("addEventSet", function(value) {
		if(this.m_eventSets === null) {
			this.m_eventSets = [];
		}
		this.m_eventSets.push(value);
	});
}

MPageEventSetGroup.inherits(MPageGroup);

function MPageCatalogCodeGroup() {
	this.m_catalogCodes = null;
	this.m_isSequenced = false;
	MPageCatalogCodeGroup.method("isSequenced", function() {
		return this.m_isSequenced;
	});
	MPageCatalogCodeGroup.method("setSequenced", function(value) {
		this.m_isSequenced = value;
	});
	MPageCatalogCodeGroup.method("getCatalogCodes", function() {
		return this.m_catalogCodes;
	});
	MPageCatalogCodeGroup.method("setCatalogCodes", function(value) {
		this.m_catalogCodes = value;
	});
	MPageCatalogCodeGroup.method("addCatalogCode", function(value) {
		if(this.m_catalogCodes === null) {
			this.m_catalogCodes = [];
		}
		this.m_catalogCodes.push(value);
	});
}

MPageCatalogCodeGroup.inherits(MPageGroup);

function MPageEventCodeGroup() {
	this.m_eventCodes = null;
	this.m_isSequenced = false;
	MPageEventCodeGroup.method("isSequenced", function() {
		return this.m_isSequenced;
	});
	MPageEventCodeGroup.method("setSequenced", function(value) {
		this.m_isSequenced = value;
	});
	MPageEventCodeGroup.method("getEventCodes", function() {
		return this.m_eventCodes;
	});
	MPageEventCodeGroup.method("setEventCodes", function(value) {
		this.m_eventCodes = value;
	});
	MPageEventCodeGroup.method("addEventCode", function(value) {
		if(this.m_eventCodes === null) {
			this.m_eventCodes = [];
		}
		this.m_eventCodes.push(value);
	});
}

MPageEventCodeGroup.inherits(MPageGroup);

function MPageCodeValueGroup() {
	this.m_codes = null;
	MPageCodeValueGroup.method("getCodes", function() {
		return this.m_codes;
	});
	MPageCodeValueGroup.method("setCodes", function(value) {
		this.m_codes = value;
	});
	MPageCodeValueGroup.method("addCode", function(value) {
		if(this.m_codes === null) {
			this.m_codes = [];
		}
		this.m_codes.push(value);
	});
}

MPageCodeValueGroup.inherits(MPageGroup);

//The MPageSequenceGroup is a grouper of items such as filter means, event codes, event sets, etc.
function MPageSequenceGroup() {
	this.m_items = null;
	this.m_mapItems = null;
	this.m_isMultiType = false;
	MPageSequenceGroup.method("getItems", function() {
		return this.m_items;
	});
	MPageSequenceGroup.method("setItems", function(value) {
		this.m_items = value;
	});
	MPageSequenceGroup.method("addItem", function(value) {
		if(this.m_items === null) {
			this.m_items = [];
		}
		this.m_items.push(value);
	});
	MPageSequenceGroup.method("setMultiValue", function(value) {
		this.m_isMultiType = value;
	});
	MPageSequenceGroup.method("isMultiValue", function() {
		return (this.m_isMultiType);
	});
	MPageSequenceGroup.method("getMapItems", function() {
		return this.m_mapItems;
	});
	MPageSequenceGroup.method("setMapItems", function(value) {
		this.m_mapItems = value;
	});
}

MPageSequenceGroup.inherits(MPageGroup);

function MPageGroupValue() {
	this.m_id = 0.0;
	this.m_name = "";

	MPageGroupValue.method("getId", function() {
		return this.m_id;
	});
	MPageGroupValue.method("setId", function(value) {
		this.m_id = value;
	});
	MPageGroupValue.method("getName", function() {
		return this.m_name;
	});
	MPageGroupValue.method("setName", function(value) {
		this.m_name = value;
	});
}

var CERN_COMPONENT_TYPE_SUMMARY = 1;
var CERN_COMPONENT_TYPE_WORKFLOW = 2;

function ComponentStyle() {
	this.m_nameSpace = "";
	this.m_id = "";
	this.m_className = "section";
	this.m_contentId = "";
	this.m_contentClass = "sec-content";
	this.m_headerClass = "sec-hd";
	this.m_headToggle = "sec-hd-tgl";
	this.m_secTitle = "sec-title";
	this.m_aLink = "";
	this.m_secTotal = "sec-total";
	this.m_info = "";
	this.m_subSecHeaderClass = "sub-sec-hd";
	this.m_subSecTitleClass = "sub-sec-title";
	this.m_subSecContentClass = "sub-sec-content";
	this.m_contentBodyClass = "content-body";
	this.m_searchBoxDiv = "search-box-div";
	this.m_subTitleDisp = "sub-title-disp";
	// If a component may be on a page multiple times, a unique identifier such as the component id will need to be set on the style
	// The unique identifier is only utilized on styles that are placeholders to be replaced at a later point.
	this.m_componentId = 0;
	this.m_color = "";
	//This is the component type which determines how it will be rendered in the View
	this.m_componentType = null;

	/**
	 * Initializes the component style with the provided namespace to utilize throughout the component.
	 * @param {Object} value
	 */
	ComponentStyle.method("initByNamespace", function(value) {
		this.m_nameSpace = value;
		this.m_id = value;
		this.m_className += (" " + value + "-sec");
		this.m_contentId = value + "Content";
		this.m_aLink = value + "Link";
		this.m_info = value + "-info";
	});

	ComponentStyle.method("getNameSpace", function() {
		return this.m_nameSpace;
	});
	ComponentStyle.method("getId", function() {
		return this.m_id + this.m_componentId;
	});
	ComponentStyle.method("getClassName", function() {
		return this.m_className;
	});
	ComponentStyle.method("getColor", function() {
		return this.m_color;
	});
	ComponentStyle.method("getContentId", function() {
		return this.m_contentId + this.m_componentId;
	});
	ComponentStyle.method("getContentBodyClass", function() {
		return this.m_contentBodyClass;
	});
	ComponentStyle.method("getContentClass", function() {
		return this.m_contentClass;
	});
	ComponentStyle.method("getHeaderClass", function() {
		return this.m_headerClass;
	});
	ComponentStyle.method("getHeaderToggle", function() {
		return this.m_headToggle;
	});
	ComponentStyle.method("getTitle", function() {
		return this.m_secTitle;
	});
	ComponentStyle.method("getLink", function() {
		return this.m_aLink;
	});
	ComponentStyle.method("getTotal", function() {
		return this.m_secTotal;
	});
	ComponentStyle.method("getInfo", function() {
		return this.m_info;
	});
	ComponentStyle.method("getSearchBoxDiv", function() {
		return this.m_searchBoxDiv;
	});
	ComponentStyle.method("getSubSecContentClass", function() {
		return this.m_subSecContentClass;
	});
	ComponentStyle.method("getSubSecContentClass", function() {
		return this.m_subSecContentClass;
	});
	ComponentStyle.method("getSubSecHeaderClass", function() {
		return this.m_subSecHeaderClass;
	});
	ComponentStyle.method("getSubSecTitleClass", function() {
		return this.m_subSecTitleClass;
	});
	ComponentStyle.method("getSubTitleDisp", function() {
		return this.m_subTitleDisp;
	});
	ComponentStyle.method("getComponentType", function() {
		return this.m_componentType;
	});
	ComponentStyle.method("setComponentId", function(value) {
		this.m_componentId = value;
	});
	ComponentStyle.method("setNameSpace", function(value) {
		this.m_nameSpace = value;
	});
	ComponentStyle.method("setId", function(value) {
		this.m_id = value;
	});
	ComponentStyle.method("setClassName", function(value) {
		this.m_className = value;
	});
	ComponentStyle.method("setColor", function(value) {
		this.m_color = value;
		this.setClassName(this.getClassName() + " " + value);
	});
	ComponentStyle.method("setContextId", function(value) {
		this.m_contentId = value;
	});
	ComponentStyle.method("setContentBodyClass", function(value) {
		this.m_contentBodyClass = value;
	});
	ComponentStyle.method("setContentClass", function(value) {
		this.m_contentClass = value;
	});
	ComponentStyle.method("setContextClass", function(value) {
		this.m_contentClass = value;
	});
	ComponentStyle.method("setHeaderClass", function(value) {
		this.m_headerClass = value;
	});
	ComponentStyle.method("setHeaderToggle", function(value) {
		this.m_headToggle = value;
	});
	ComponentStyle.method("setSearchBoxDiv", function(value) {
		this.m_searchBoxDiv = value;
	});
	ComponentStyle.method("setSubSecContentClass", function(value) {
		this.m_subSecContentClass = value;
	});
	ComponentStyle.method("setSubSecHeaderClass", function(value) {
		this.m_subSecHeaderClass = value;
	});
	ComponentStyle.method("setSubSecTitleClass", function(value) {
		this.m_subSecTitleClass = value;
	});
	ComponentStyle.method("setSubTitleDisp", function(value) {
		this.m_subTitleDisp = value;
	});
	ComponentStyle.method("setTitle", function(value) {
		this.m_secTitle = value;
	});
	ComponentStyle.method("setLink", function(value) {
		this.m_aLink = value;
	});
	ComponentStyle.method("setTotal", function(value) {
		this.m_secTotal = value;
	});
	ComponentStyle.method("setInfo", function(value) {
		this.m_info = value;
	});
	ComponentStyle.method("setComponentType", function(value) {
		this.m_componentType = value;
	});
}

/**
 * The MPageView object
 * @constructor
 * @author Greg Howdeshell
 * @author Steven Lewis
 */
function MPageView() {

	/*Variables*/
	this.banner = true;
	this.components = null;
	this.componentIds = null;
	this.criterion = null;
	this.helpFileName = "";
	this.helpFileURL = "https://wiki.ucern.com/display/r1mpagesHP/MPages+Help+Pages";
	this.isCustomizeView = false;
	this.m_categoryMean = "";
	this.m_capTimerName = "";
	this.m_csEnabled = false;
	this.m_dpEnabled = false;
	this.m_filterMappingsObj = {};
	this.m_helpFilePath = "";
	this.m_helpFileURL = "";
	this.m_isCustomizeEnabled = true;
	this.m_pageSettings = null;
	this.m_printableReportName = null;
	this.m_subTimerName = "";
	this.m_titleAnchors = null;
	this.name = null;
	this.pageId = 0.0;
	this.viewpointIndicator = false;
	this.allExpanded = false;

	/** Adders **/

	/**
	 * Adds the id of a component to the list of component ids contained in this MPageView object.
	 * @param (Number) compId The primary key of a component contained in this MPageView object.
	 */
	this.addComponentId = function(compId) {
		if(this.componentIds === null) {
			this.componentIds = [];
		}
		this.componentIds.push(compId);
	};
	/**
	 * Adds a component to the existing MPage
	 * @param {MPageComponent} componentObj The MPageComponent object to add to the MpageView
	 */
	this.addComponent = function(componentObj) {
		if(this.components === null) {
			this.components = [];
		}
		this.components.push(componentObj);
	};
	/**
	 * Add a filter mapping object to the collection of mappings.  Filter mappings are referenced by name, so if a filter already exists with the same name it will
	 * be overwritten.
	 * @param {String} filterName The name of the filter object to add.
	 * @param {Object} filterObject The object containing all of the filter properties used when loading settings.
	 */
	this.addFilterMappingObject = function(filterName, filterObject) {
		this.m_filterMappingsObj[filterName] = filterObject;
	};
	/**
	 * Adds the HTML code for an anchor tag to be shown at the top of an MPages View.  The parameter passed in should be syntactically correct HTML as it will be
	 * placed directly into the DOM.
	 * @param {String} anchorHTML The HTML markup for the anchor to be added to the MPages View.
	 */
	this.addTitleAnchor = function(anchorHTML) {
		if(this.m_titleAnchors === null) {
			this.m_titleAnchors = [];
		}
		this.m_titleAnchors.push(anchorHTML);
	};
	/** Getters **/

	/**
	 * Gets the name of the capitalization timer for this instance of the MPageView object.
	 * @return {String} The name of the capitalization timer.
	 */
	this.getCapTimerName = function() {
		return this.m_capTimerName;
	};
	/**
	 * Gets the category mean assigned to this instance of the MPageView object.
	 * @return {String} The category mean of this MPageView object.
	 */
	this.getCategoryMean = function() {
		return this.m_categoryMean;
	};
	/**
	 * Gets the array of component ids that are set to load with this instance of the MPageView object.
	 * @return {Array[Number]} An array of components ids
	 */
	this.getComponentIds = function() {
		return (this.componentIds);
	};
	/**
	 * Gets the array of MPageComponent objects associated to this instance of the MPageView object.
	 * @return {Array[MPageComponent]} An array of MPageComponent objects.
	 */
	this.getComponents = function() {
		return this.components;
	};
	/**
	 * Returns the criterion object stored in the MPageView object.  The criterion object contains information such as the person_id, encntr_id, personnel_id, etc.
	 * @return {Criterion} A Criterion object containing information such as the person_id, encntr_id, personnel_id, etc.
	 */
	this.getCriterion = function() {
		return (this.criterion);
	};
	/**
	 * Gets the the flag which determines if the user is allowed to customize a MPages View or not.
	 * @return {Boolean} A boolean flag which determines if the user is allowed to customize a MPages View or not.
	 */
	this.getCustomizeEnabled = function() {
		return this.m_isCustomizeEnabled;
	};
	/**
	 * Gets the the flag which determines whether or not to add the customization option to the MPages View.
	 * @return {Boolean} A boolean flag which determines whether or not to add the customization option to the MPages View.
	 */
	this.getCustomizeView = function() {
		return this.isCustomizeView;
	};
	/**
	 * Gets the array of filter mapping objects used to apply MPages View level settings.
	 * @return {Array[Object]} An array of filter mapping objects.
	 */
	this.getFilterMappingsObj = function() {
		return this.m_filterMappingsObj;
	};
	/**
	 * Return the help file name that is to be loaded when the help file icon is clicked.
	 * @return {String} An string containing the file path location of a help file.
	 */
	this.getHelpFileName = function() {
		return this.helpFileName;
	};
	/**
	 * Return the help file URL that is to be loaded when the help file icon is clicked.
	 * @return {String} The URL of the help file
	 */
	this.getHelpFileURL = function() {
		return this.helpFileURL;
	};
	/**
	 * Gets the name associated to the MPages View
	 * @return {String} The name of the MPages View
	 */
	this.getName = function() {
		return this.name;
	};
	/**
	 * Gets the primary key associated to the MPageView object.
	 * @return {Number} The key of the MPageView object
	 */
	this.getPageId = function() {
		return this.pageId;
	};
	/**
	 * Gets the page level settings object loaded from the preferences model.
	 * @return {Object} The preferences object used to set the MPageView object settings.
	 */
	this.getPageSettings = function() {
		return this.m_pageSettings;
	};
	/**
	 * Returns the printable report name if it has been set.
	 * @return {String} The name given to the printable report.
	 */
	this.getPrintableReportName = function() {
		return this.m_printableReportName;
	};
	/**
	 * Gets the subtimer name to be associated with the capitalization timer.
	 * @return {String} The name of the subtimer
	 */
	this.getSubTimerName = function() {
		return this.m_subTimerName;
	};
	/**
	 * Gets the array of HTML anchor elements that will be added to the MPages View.
	 * @return {Array[String]} An array of HTML string which makeup the MPages options
	 */
	this.getTitleAnchors = function() {
		return this.m_titleAnchors;
	};
	/** Boolean Checks **/

	/**
	 * A check for the banner flag which determines if the demographic banner should be displayed in the MPages View.
	 * @return {Boolean} True if the patient demographic banner should be displayed within the MPages View.  False otherwise.
	 */
	this.isBannerEnabled = function() {
		return this.banner;
	};
	/**
	 * A check for the viewpoint indicator flag which determines if the MPageView is being shown in a Viewpoint or not.
	 * @return {Boolean} True if the MPageView is being shown in a viewpoint.  False otherwise.
	 */
	this.getViewpointIndicator = function() {
		return this.viewpointIndicator;
	};
	/**
	 * A check for the m_csEnabled flag which determines if the chart search functionality should be available for the user.
	 * @return {Boolean} True if chart search is to be displayed within the MPage.  False otherwise.
	 */
	this.isChartSearchEnabled = function() {
		return this.m_csEnabled;
	};
	/**
	 * A check for the m_dpEnabled flag which determines if the discharge process functionality should be available for the user.
	 * @return {Boolean} True if discharge process icon is to be displayed within the MPage.  False otherwise.
	 */
	this.isDischargeProcessEnabled = function() {
		return this.m_dpEnabled;
	};
	/**
	 * A check for the allExpanded flag which determines if all the components are currently expanded or not.
	 * @return {Boolean} True if all components are expanded.  False otherwise.
	 */
	this.isAllExpanded = function() {
		return this.allExpanded;
	};
	/** Setters **/

	/**
	 * Sets whether or not to display the patient demographic banner.
	 * @param {Boolean} value The boolean value in which to note to display or not display the patient demographic banner.
	 */
	this.setBannerEnabled = function(bannerEnabled) {
		this.banner = bannerEnabled;
	};
	/**
	 * Sets the name of the capitalization timer for this instance of the MPageView object.  The capTimerName parameter must be a string, otherwise it is
	 * ignored.
	 * @param {String} The name of the capitalization timer.
	 * @return {Boolean} True if the capitalization timer name was set, false otherwise.
	 */
	this.setCapTimerName = function(capTimerName) {
		if(capTimerName && typeof capTimerName == "string") {
			this.m_capTimerName = capTimerName;
			return true;
		}
		return false;
	};
	/**
	 * Sets the category mean of the MPageView object.  The categoryMean parameter must be a string, otherwise it is ignored.
	 * @param {String} categoryMean The category mean of the MPageView object
	 */
	this.setCategoryMean = function(categoryMean) {
		if(categoryMean && typeof categoryMean == "string") {
			this.m_categoryMean = categoryMean;
			return true;
		}
		return false;
	};
	/**
	 * Sets whether or not to display chart search functionality
	 * @param {Boolean} showChartSearch The boolean value in which to note to display or not display chart search.
	 */
	this.setChartSearchEnabled = function(showChartSearch) {
		this.m_csEnabled = showChartSearch;
	};
	/**
	 * Sets whether or not to discharge process functionality
	 * @param {Boolean} discharge process The boolean value in which to note to display or not display discharge process.
	 */
	this.setDischargeProcessEnabled = function(showDischargeProcess) {
		this.m_dpEnabled = showDischargeProcess;
	};
	/**
	 * Sets the array of components ids which are the primary keys to the MPageComponent objects that are part of this MPageView object.
	 * @param {Array[Number]} compIdArr The array of component ids.
	 */
	this.setComponentIds = function(compIdArr) {
		this.componentIds = compIdArr;
	};
	/**
	 * Sets the list of MPageComponent objects which are contained within this MPageView object.
	 * @param {Array[MPageComponent]} componentArr The array of MPageComponent objects which are contained within this MPageView object.
	 */
	this.setComponents = function(componentArr) {
		this.components = componentArr;
	};
	/**
	 * Sets the Criterion object for this instance of the MPageView object.
	 * @param {Criterion} criterionObj The Criterion object in which to initialize the MPageView object with.
	 */
	this.setCriterion = function(criterionObj) {
		this.criterion = criterionObj;
	};
	/**
	 * Sets the flag which determines if the customization option will be enabled or disabled within the MPages View.
	 * @param {Boolean} customizedEnabled A flag which determines if customization of the MPages View is enabled or disabled.
	 */
	this.setCustomizeEnabled = function(customizedEnabled) {
		this.m_isCustomizeEnabled = customizedEnabled;
	};
	/**
	 * Sets the flag which determines if the customization option will be shown to the user or not on the MPages View.
	 * @param {Boolean} customizeView A flag which determines if the customization option will be shown to the user or not.
	 */
	this.setCustomizeView = function(customizeView) {
		this.isCustomizeView = customizeView;
	};
	/**
	 * Sets the filter mappings object which will be used when loading settings from the preferences model.  The filterObj parameter must not be null.  If it is
	 * null it will be ignored.
	 * @param {Object} filterObj An object which contains the filter mappings of the MPageView object
	 * @return {Boolean} True if the m_filterMappingsObj was set to filterObj, false otherwise
	 */
	this.setFilterMappingsObj = function(filterObj) {
		if(filterObj) {
			this.m_filterMappingsObj = filterObj;
			return true;
		}
		return false;
	};
	/**
	 * Sets the help file name that is to be loaded when the help file icon is clicked.
	 * @param {String} fileName The name of the help file to be loaded when the help icon is clicked.
	 */
	this.setHelpFileName = function(fileName) {
		this.helpFileName = fileName;
	};
	/**
	 * Sets the help file URL that is to be loaded when the help file icon is clicked.
	 * @param {String} fileURL The name of the help file to be loaded when the help icon is clicked.
	 */
	this.setHelpFileURL = function(fileURL) {
		this.helpFileURL = fileURL;
	};
	/**
	 * Sets the name given to the MPages View.  The mpageName parameter must not be blank or null.  If it is the existing name will not be modified.
	 * @param {String} mpageName the name to be given to the MPages View
	 * @return {Boolean} True if the MPages View name was set, otherwise false.
	 */
	this.setName = function(mpageName) {
		if(mpageName && typeof mpageName == "string") {
			this.name = mpageName;
			return true;
		}
		return false;
	};
	/**
	 * Sets the primary key associated to the MPageView object.
	 * @param {Number} mpageId The primary key to be associated to the MPageView object.
	 */
	this.setPageId = function(mpageId) {
		this.pageId = mpageId;
	};
	/**
	 * Sets the page settings object used when initializing MPageView object elements.
	 * @param {Object} settingsObj The settings object from the preferences model.
	 */
	this.setPageSettings = function(settingsObj) {
		if(settingsObj) {
			this.m_pageSettings = settingsObj;
			return true;
		}
		return false;
	};
	/**
	 * Sets the printable report script/name of the MPages View iff the reportName is a string.
	 * @param {String} value The reportName value will hold the script name (from bedrock) that will be used/executed to print a report.
	 */
	this.setPrintableReportName = function(reportName) {
		if(reportName && typeof reportName == "string") {
			this.m_printableReportName = reportName;
			return this.m_printableReportName;
		}
		return null;
	};
	/**
	 * Sets the name of the capitalization subtimer.
	 * @param {String} timerName The name to give to the capitalization subtimer
	 */
	this.setSubTimerName = function(timerName) {
		if(timerName && typeof timerName == "string") {
			this.m_subTimerName = timerName;
			return true;
		}
		return false;
	};
	/**
	 * Sets the array of anchors/additional options to be shown on MPages View.  The strings passed in the anchorArr should be syntactically correct HTML as it
	 * will be placed directly into the DOM.
	 * @param {Array[String]} anchorArr An array of HTML strings which will be loaded into the MPages View.
	 */
	this.setTitleAnchors = function(anchorArr) {
		this.m_titleAnchors = anchorArr;
	};
	/**
	 * Sets the flag which determines if all components are expanded or collapsed.
	 * @param {Boolean} allExpandedInd A flag which determines if all the components are expanded or collapsed. True means
	 * all are expanded, false means all are collapsed.
	 */
	this.setIsAllExpanded = function(allExpandedInd) {
		this.allExpanded = allExpandedInd;
	};
	/**
	 * Sets the flag which determines if the MPageView is being shown in a viewpoint or not.
	 * @param {Boolean} viewpointInd A flag which determines if the MPageView is being shown in a viewpoint or not.
	 */
	this.setViewpointIndicator = function(viewpointInd) {
		this.viewpointIndicator = viewpointInd;
	};
}

/** Initialization and rendering functions for the MPageView objects **/

/**
 * Initializes the MPageView with the basic information needed to render the MPages View.  This includes registering unload and resize events with the custom
 * component framework, loading the default filtermappings for the MPageView, creating timers based on the timer names in m_capTimerName and m_subTimerName and
 * finally creating and storing the criterion object in the MPageView object.  This function can be extended and/or overwritten in a MPageView prototyped object.
 * @this {MPageView}
 * @return {boolean} True if the MPagesView was initialized successfully, false otherwise
 */
MPageView.prototype.initializeMPageView = function() {
	try {
		//Register events for the Custom Components Standard
		MPage.registerUnloadEvent();
		MPage.registerResizeEvent();

		//Load the filter mappings
		this.loadFilterMappings();

		//Load the timer information
		this.setCapTimerName("CAP:MPG Launch MPage");
		this.setSubTimerName(this.getCategoryMean());

		//Create the MPage timers based on names set in the MPageView object
		this.createMPageTimerObject();

		//Create and set the criterion object for the MPageView
		this.setCriterion(createPageCriterion(this.getCategoryMean()));

		//Set the viewpoint indicator to true if this is a viewpoint, otherwise false
		this.setViewpointIndicator(( typeof m_viewpointJSON == "undefined") ? false : true);

		return true;
	}
	catch(err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "initializeMPageView");
		throw err;
	}
};
/**
 * Loads and stores the settings from the preferences model into the MPageView object.  This includes setting the page id, loading the application and user
 * preferences model and applying the filter mappings loaded in the MPageView.loadFilterMappings() function.  It is not recommended to override or extend this
 * function.
 * @this {MPageView}
 * @return {boolean} True if the page settings were loaded successfully, false otherwise
 */
MPageView.prototype.loadPageSettings = function() {
	var bValue = "";
	var filter = null;
	var filterMappingsObj = null;
	var pageFilters = null;
	var pageSettings = null;
	var sValue = "";
	var x = 0;

	try {
		//Retrieve and store the page level settings from the preference model
		pageSettings = this.getPageSettingsObject();
		if(!pageSettings) {
			throw new Error(i18n.VIEW_SETTINGS_UNAVAILABLE);
		}
		this.setPageSettings(pageSettings);

		//Set the page id from the bedrock contents
		this.setPageId(pageSettings.BR_DATAMART_CATEGORY_ID);

		//Create the preference manager for user preferences
		MP_Core.AppUserPreferenceManager.Initialize(this.getCriterion(), this.getCategoryMean());
		if(pageSettings.USER_PREFS.PREF_STRING.length > 0) {
			MP_Core.AppUserPreferenceManager.SetPreferences(pageSettings.USER_PREFS.PREF_STRING);
		}

		//Set the page level settings
		filterMappingsObj = this.getFilterMappingsObj();
		pageFilters = pageSettings.PARAMS;
		for( x = pageFilters.length; x--; ) {
			filter = filterMappingsObj[pageFilters[x].FILTER_MEAN];
			if(filter) {
				sValue = "";
				bValue = "";
				switch (filter.type.toUpperCase()) {
					case "BOOLEAN":
						if(pageFilters[x].VALUES[0] && typeof pageFilters[x].VALUES[0][filter.field] != 'undefined') {
							sValue = pageFilters[x].VALUES[0][filter.field];
							bValue = (sValue === "0") ? false : true;
							filter.setFunction.call(this, bValue);
						}
						break;
					case "STRING":
						if(pageFilters[x].VALUES[0] && typeof pageFilters[x].VALUES[0][filter.field] != 'undefined') {
							sValue = pageFilters[x].VALUES[0][filter.field];
							filter.setFunction.call(this, sValue);
						}
						break;
				}
			}
		}
		return true;
	}
	catch(err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "loadPageSettings");
		throw err;
	}
};
/**
 * Perform the initialization of all of the components which will appear on this MPages View.  Initialization includes loading all preferences from the
 * preference model into the components, applying user level settings to the components and finally storing the newly created MPageComponent objects in
 * the components[] array of the MPageView object.  It is not recommend to overwrite this function, but it can be extended to further setup the
 * components of an MPages View.  For example, setting forced lookback ranges for certain components on an Mpages View.
 * @this {MPageView}
 * @return {boolean} True if the component settings were initialized properly, false otherwise
 */
MPageView.prototype.initializeComponents = function() {
	var component;
	var componentsArr = [];
	var componentCnt = 0;
	var criterion = null;
	var dateCheck = null;
	var dateFilter = null;
	var groupArr = null;
	var group = null;
	var loadingPolicy = null;
	var pageSettings = null;
	var sexFilter = null;
	var x = 0;
	var y = 0;
	var z = 0;

	try {
		//Create a Loading policy for use in the Bedrock functions
		loadingPolicy = new MP_Bedrock.LoadingPolicy();
		loadingPolicy.setLoadPageDetails(true);
		loadingPolicy.setLoadComponentBasics(true);
		loadingPolicy.setLoadComponentDetails(true);
		loadingPolicy.setCategoryMean(this.getCategoryMean());
		loadingPolicy.setCriterion(this.getCriterion());

		//Load the component ids
		pageSettings = this.getPageSettings();
		if(!pageSettings) {
			throw new Error(i18n.VIEW_SETTINGS_UNAVAILABLE);
		}
		componentsArr = pageSettings.COMPONENT;
		componentCnt = componentsArr.length;
		for( x = 0; x < componentCnt; x++) {
			this.addComponentId(componentsArr[x].BR_DATAMART_REPORT_ID);
		}

		//Call the bedrock functions to load the components.
		//Want to eventually move this into the component architecture to simplify.
		this.setComponents(MP_Bedrock.MPage.Component.LoadBedrockComponents(loadingPolicy, this.getComponentIds()));

		//Initialize special component logic.  Will be moved into MPageComponent eventually
		criterion = this.getCriterion();
		// setup filter to only display a component when the patient is female
		sexFilter = new MP_Core.CriterionFilters(criterion);
		sexFilter.addFilter(MP_Core.CriterionFilters.SEX_MEANING, "FEMALE");

		// setup filter to only display a component when the patient is less than or
		// equal to 22 years of age
		dateFilter = new MP_Core.CriterionFilters(criterion);
		dateCheck = new Date();
		dateCheck.setFullYear(dateCheck.getFullYear() - 22);
		dateFilter.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, dateCheck);
		componentsArr = this.getComponents();
		if(componentsArr && componentsArr.length > 0) {
			for( y = componentsArr.length; y--; ) {
				groupArr = null;
				group = null;
				z = 0;
				component = componentsArr[y];
				if( component instanceof GrowthChartComponent) {
					component.addDisplayFilter(dateFilter);
				}
				else if( component instanceof VitalSignComponent) {
					groupArr = component.getGroups();
					if(groupArr && groupArr.length > 0) {
						for( z = groupArr.length; z--; ) {
							group = groupArr[z];
							switch (group.getGroupName()) {
								case "TEMP_CE":
								case "ED_TEMP_CE":
								case "IS_TEMP_CE":
								case "NC_TEMP_CE":
									group.setGroupName(i18n.discernabu.vitals_o1.TEMPERATURE);
									break;
								case "BP_CE":
								case "ED_BP_CE":
								case "IS_BP_CE":
								case "NC_BP_CE":
									group.setGroupName(i18n.discernabu.vitals_o1.BLOOD_PRESSURE);
									break;
								case "HR_CE":
								case "ED_HR_CE":
								case "IS_HR_CE":
								case "NC_HR_CE":
									group.setGroupName(i18n.discernabu.vitals_o1.HEART_RATE);
									break;
								case "VS_CE":
								case "ED_VS_CE":
								case "IS_VS_CE":
								case "NC_VS_CE":
									group.setGroupName("");
									break;
							}
						}
					}
				}
				else if( component instanceof LaboratoryComponent) {
					groupArr = component.getGroups();
					if(groupArr && groupArr.length > 0) {
						for( z = groupArr.length; z--; ) {
							group = groupArr[z];
							switch (group.getGroupName()) {
								case "LAB_PRIMARY_CE":
								case "ED_LAB_PRIMARY_CE":
								case "IS_LAB_PRIMARY_CE":
								case "NC_LAB_PRIMARY_CE":
									group.setGroupName(i18n.PRIMARY_RESULTS);
									break;
								case "LAB_SECONDARY_ES":
								case "ED_LAB_SECONDARY_ES":
								case "IS_LAB_SECONDARY_ES":
								case "NC_LAB_SECONDARY_ES":
									group.setGroupName(i18n.SECONDARY_RESULTS);
									break;
							}
						}
					}
				}
				else if( component instanceof ABDComponent) {
					var dateFilter1 = new MP_Core.CriterionFilters(criterion);
					var ageDays = component.getAgeDays();
					var myDate = new Date();
					myDate.setDate(myDate.getDate() - ageDays);
					dateFilter1.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, myDate);
					component.addDisplayFilter(dateFilter1);
				}
				else if( component instanceof PatientAssessmentComponent) {
					groupArr = component.getGroups();
					if(groupArr && groupArr.length > 0) {
						for( z = groupArr.length; z--; ) {
							group = groupArr[z];
							switch (group.getGroupName()) {
								case "NC_PT_ASSESS_GEN":
									group.setGroupName(i18n.GENERAL_ASSESSMENT);
									break;
								case "NC_PT_ASSESS_PAIN":
									group.setGroupName(i18n.PAIN);
									break;
								case "NC_PT_ASSESS_NEURO":
									group.setGroupName(i18n.NEURO);
									break;
								case "NC_PT_ASSESS_RESP":
									group.setGroupName(i18n.RESPIRATORY);
									break;
								case "NC_PT_ASSESS_CARD":
									group.setGroupName(i18n.CARDIO);
									break;
								case "NC_PT_ASSESS_GI":
									group.setGroupName(i18n.GI);
									break;
								case "NC_PT_ASSESS_GU":
									group.setGroupName(i18n.GU);
									break;
								case "NC_PT_ASSESS_MS":
									group.setGroupName(i18n.MUSCULOSKELETAL);
									break;
								case "NC_PT_ASSESS_INTEG":
									group.setGroupName(i18n.INTEGUMENTARY);
									break;
							}
						}
					}
				}
				else if( component instanceof NeonateBilirubinComponent) {
					// setup filter to only display a component when the newborn is less than or
					// equal to 156 hours of age
					var dateFilter2 = new MP_Core.CriterionFilters(criterion);
					var ageCheck = new Date();
					ageCheck.setHours(-156);
					dateFilter2.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, ageCheck);
					component.addDisplayFilter(dateFilter2);
				}
				else if( component instanceof NewOrderEntryComponent) {
					if (this.getViewpointIndicator()) {
						component.setModalScratchPadEnabled(1);
					}
				}
				else if( component instanceof OrderSelectionComponent) {
					if (this.getViewpointIndicator()) {
						component.setModalScratchPadEnabled(1);
					}
				}									
			}
		}

		return true;
	}
	catch(err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "initializeComponents");
		throw err;
	}
};
/**
 * Used to render the MPages View once it has been initialized and setup.  Calls the MP_Util.Doc.InitLayout function to render the HTML of the page layout.
 * Once the page layout has been rendered, the Chart Search functionality and demo banner are added to the MPage View.  Finally the component script calls
 * are executed within the MP_Util.Doc.RenderLayout() function call.  It is not recommended to override this function.  If special logic needs to be executed
 * when loading the Chart Search functionality or loading the Demographics Banner, those specific functions can be overridden instead.
 * @this {MPageView}
 * @return {boolean} True if the page was rendered successfully, false otherwise
 */
MPageView.prototype.renderMPage = function() {
	var viewpointCatMeaning = null;
	var componentList = null;

	try {
		//Check to see if any component are defined for this MPageView.  Return if there are not any
		componentList = this.getComponents();
		if(componentList.length === 0) {
			throw new Error(i18n.VIEW_SETTINGS_UNAVAILABLE);
		}
		//viewpointCatMeaning is used only when loading a MPage View within a Viewpoint
		viewpointCatMeaning = (this.getViewpointIndicator()) ? this.getCategoryMean() : null;
		MP_Util.Doc.InitLayout(this, this.getHelpFileName(), this.getHelpFileURL(), viewpointCatMeaning);

		//Initialize Chart search if available
		this.loadChartSearch();
		
		//Initialize Discharge Process if available
		this.loadDischargeProcess();

		//Load the demo banner if available
		this.loadDemoBanner();

		//Load the component selection menu if available.
		this.loadComponentSelection();

		//Load Printable Report Menu Option
		this.loadPrintableReportMenuItem();

		//Load the Drag and Drop Toggle Menu Option
		this.loadDragAndDropMenuItem();

		//Load the Expand/Collapse Menu Option
		this.loadExpandCollapseAllMenuItem();

		//Load the Help Menu Option
		this.loadHelpMenuItem();

		//Load the components
		window.setTimeout("MP_Util.Doc.RenderLayout()", 0);

		return true;
	}
	catch(err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "renderMPage");
		throw err;
	}
};
/**
 * Any post processing that needs to be completed by the MPageView object will be completed in this function.  No functionality has been implemented at this
 * time for the base function, but this can be overridden in objects which prototype the MPagesView object.
 */
MPageView.prototype.postProcessing = function() {
};
/** Support functions used for the MPageView objects **/

/**
 * Loads the default MPage View level filter mappings.  These mappings can be overwritten by using the MPageView.setFilterMappingObject() function with the same
 * name as any of the existing filter mappings.  Filter mappings can also be overridden by defining a loadFilterMappings function in a MPageView prototyped
 * object.
 * @this {MPageView}
 * @return null
 */
MPageView.prototype.loadFilterMappings = function() {
	//A filter mapping that indicates whether the Demographics Banner will be displayed.
	this.addFilterMappingObject("BANNER", {
		setFunction: this.setBannerEnabled,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	//A filter mapping that indicates whether the Chart Search will be displayed.
	this.addFilterMappingObject("CHART_SEARCH", {
		setFunction: this.setChartSearchEnabled,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	//A filter mapping that indicates whether the Discharge Process will be displayed.
	this.addFilterMappingObject("DISCHARGE_PROCESS", {
		setFunction: this.setDischargeProcessEnabled,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	//A filter mapping used to set the Label/name of an MPages View.  This name is used for the actual MPage name and the name used on the viewpoint tab.
	this.addFilterMappingObject("VIEWPOINT_LABEL", {
		setFunction: this.setName,
		type: "String",
		field: "FREETEXT_DESC"
	});
	//A filter mapping used to set the printable report name.
	//The filter mean for this setting is named PREG_PRINT but it is not isolated to just the Pregnancy Summary.  It also applies to the View Builder
	//MPages as well and is a setting to call a printable Discern report.
	this.addFilterMappingObject("PREG_PRINT", {
		setFunction: this.setPrintableReportName,
		type: "String",
		field: "FREETEXT_DESC"
	});
};
/**
 * Makes the call to add the Chart Search controls to the MPage if it should be available to the user.  Can be overwritten by a MPagesView prototyped object if
 * special functionality is need for the Chart Search controls.
 * @this {MPageView}
 * @return {Boolean} True if the Chart Search was added to the page, false otherwise.
 */
MPageView.prototype.loadChartSearch = function() {
	//Ignore chart search when being loaded in viewpoints since the chart search functionality is handled at the viewpoint level.
	if(this.getViewpointIndicator()) {
		return false;
	}

	if(this.isChartSearchEnabled()) {
		MP_Util.Doc.AddChartSearch(this.getCriterion(), false);
		return true;
	}
	return false;
};
/**
 * Makes the call to add the Discharge Process Icon to the MPage if it should be available to the user.  Can be overwritten by a MPagesView prototyped object if
 * special functionality is need for the Discharge Process Icon.
 * @this {MPageView}
 * @return {Boolean} True if the Discharge Process was added to the page, false otherwise.
 */
MPageView.prototype.loadDischargeProcess = function() {
	//Ignore Discharge Process when being loaded in viewpoints since the Discharge Process functionality is handled at the viewpoint level.
	if(this.getViewpointIndicator()) {
		return false;
	}
	
	if(this.isDischargeProcessEnabled()){
		this.AddDischargeProcess(this.getCriterion());
		return true;
	}

};
/**
* Adds Discharge Process to the page.
* @param {Object} criterion The criterion object
 */
MPageView.prototype.AddDischargeProcess = function (criterion) {
	var dpSpan = Util.cep("span", {title : i18n.CLICK_TO_GO_TO_DISCHARGE_PROCESS});			
	dpSpan.innerHTML = "<a id=depart-process-icon></a>";	
		
	var pgCtrl = _g("pageCtrl"+criterion.category_mean);
	
	pgCtrl.parentNode.insertBefore(dpSpan, pgCtrl);
	dpSpan.onclick = function(){			
		OpenDischargeProcess(criterion.encntr_id,criterion.person_id,criterion.provider_id);	
	};
};
/**
 * Makes the call to add the Demographics Banner to the MPage if it should be shown on the MPages View.  Can be overwritten by a MPagesView prototyped object if
 * special functionality is need for the Demographics Banner.
 * @this {MPageView}
 * @return {Boolean} True if the Demographics Banner was added to the page, false otherwise.
 */
MPageView.prototype.loadDemoBanner = function() {
	var patDemoBanner = null;

	if(this.isBannerEnabled()) {
		patDemoBanner = _g("banner" + this.getCategoryMean());
		if(patDemoBanner) {
			CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemoBanner, this.getCriterion());
			return true;
		}
	}
	return false;
};
/**
 * Base implementation for loading the component selection menu.  This option is not supported in all MPages, thus this function
 * should be implemented in the individual MPagesView Objects.
 * @this {MPageView}
 * @return {Boolean} True if the component selection menu option was added to the page, false otherwise.
 */
MPageView.prototype.loadComponentSelection = function() {
	return false;
};
/**
 * If the m_printableReport element is populated for the MPageView then add the Print Report menu option to the page menu.
 * @this (MPageView)
 * @return {Boolean} True if the Printable Report menu option was added to page, false otherwise.
 */
MPageView.prototype.loadPrintableReportMenuItem = function() {
	var categoryMean = "";
	var criterion = null;
	var menuEle = null;
	var menuId = "";
	var pageMenuEle = null;
	var printReportMenuItem = null;
	var printReportName = "";

	//Check to see if the printable report name is set for the MPage
	printReportName = this.getPrintableReportName();
	if(printReportName) {
		//Retrieve the page menu if available
		categoryMean = this.getCategoryMean();
		menuId = 'pageMenu' + categoryMean;
		pageMenuEle = _g('optsMenupersonalize' + menuId);
		if(pageMenuEle) {
			criterion = this.getCriterion();
			//Create the Printable Report Menu Item
			printReportMenuItem = Util.cep("div", {
				className: "opts-menu-item",
				id: "optsPrintReport" + menuId
			});

			printReportMenuItem.innerHTML = i18n.PRINT_REPORT;

			Util.addEvent(printReportMenuItem, "click", function() {
				MP_Util.PrintReport(printReportName, criterion.person_id + ".0", criterion.encntr_id + ".0");
			});
			//Add the Print Report menu to the page menu selection
			//Check to see if the component toggle menu exists and if so add the Print Report option after that
			menuEle = _g('optsCompSelection' + menuId);
			if(menuEle) {
				Util.ia(printReportMenuItem, menuEle);
				return true;
			}
			//Check to see if the layout menu exists and if so add the Print Report option after that
			menuEle = _g('optsDefLayout' + menuId);
			if(menuEle) {
				Util.ia(printReportMenuItem, menuEle);
				return true;
			}

			//Add the Print Report option at the end of the menu
			Util.ac(printReportMenuItem, pageMenuEle);
			return true;
		}
	}
	return false;
};
/**
 * Adds help menu item to the page level menu.
 * @this (MPageView)
 * @return {Boolean} True if the help menu option was added to page, false otherwise.
 */
MPageView.prototype.loadHelpMenuItem = function() {
	var categoryMean = "";
	var criterion = null;
	var helpMenuItem = null;
	var helpMenuItemId = "optsHelp";
	var i18nCore = i18n.discernabu;
	var menuId = "";
	var pageMenuEle = null;
	var that = this;

	function clickHelp() {
		MP_Util.Doc.LaunchHelpWindow(that.getHelpFileURL());
	}

	//Retrieve the page menu if available
	categoryMean = this.getCategoryMean();
	menuId = 'pageMenu' + categoryMean;
	pageMenuEle = $('#optsMenupersonalize' + menuId);
	if(pageMenuEle.length) {
		criterion = this.getCriterion();

		//Create the Help Menu Item
		helpMenuItem = $("<div></div>").attr("id", helpMenuItemId + menuId).addClass("opts-menu-item").html(i18nCore.HELP).click(clickHelp);

		//Add the Help menu item at the end of the menu
		$(pageMenuEle).append(helpMenuItem);
		return true;
	}
	return false;
};
/**
 * Adds expand/collapse menu item to the page level menu.
 * @this (MPageView)
 * @return {Boolean} True if the Expand/Collapse menu option was added to page, false otherwise.
 */
MPageView.prototype.loadExpandCollapseAllMenuItem = function() {
	var categoryMean = "";
	var criterion = null;
	var expandCollapseMenuItem = null;
	var expandCollapseMenuItemId = "optsExpandCollapseAll";
	var i18nCore = i18n.discernabu;
	var menuId = "";
	var menuEle = null;
	var pageMenuEle = null;
	var that = this;

	function toggleExpandCollapse() {
		var toggleContainer = null;
		try {
			toggleContainer = (that.getViewpointIndicator() ? $("#" + categoryMean) : $(document.body));
			if(!toggleContainer.length) {
				MP_Util.LogWarn("The container that houses the components to be toggled was not found");
				return false;
			}
			if(that.isAllExpanded()) {
				//All components are currently expanded
				$(toggleContainer).find(".section").addClass("closed");
				$(expandCollapseMenuItem).html(i18nCore.EXPAND_ALL);
			}
			else {
				//All components are currently collapsed
				$(toggleContainer).find(".section").removeClass("closed");
				$(expandCollapseMenuItem).html(i18nCore.COLLAPSE_ALL);
			}
			//Invert boolean for whether components are expanded or collapsed
			that.setIsAllExpanded(!that.isAllExpanded());
		}
		catch (err) {
			MP_Util.LogJSError(err, null, "mp_component_defs.js", "toggleExpandCollapse");
		}
	}

	//Retrieve the page menu if available
	categoryMean = this.getCategoryMean();
	menuId = 'pageMenu' + categoryMean;
	pageMenuEle = $('#optsMenupersonalize' + menuId);
	try {
		//If the page level menu exists
		if(pageMenuEle.length) {
			criterion = this.getCriterion();
			//Create the Drag and Drop Menu Item
			expandCollapseMenuItem = $("<div></div>").attr("id", expandCollapseMenuItemId + menuId).addClass("opts-menu-item").click(toggleExpandCollapse);

			//Check that the menu item was successfully created
			if(!expandCollapseMenuItem || !expandCollapseMenuItem.length) {
				MP_Util.LogWarn("The expand/collapse menu item was not created successfully");
				return false;
			}

			//Set the menu item text based on the current standing (expanded or collapsed)
			$(expandCollapseMenuItem).html(that.isAllExpanded() ? i18nCore.COLLAPSE_ALL : i18nCore.EXPAND_ALL);

			//Add the Expand/Collapse after Drag and Drop if available
			menuEle = $(pageMenuEle).find('#optsDNDToggle' + menuId);
			if(menuEle && menuEle.length) {
				$(expandCollapseMenuItem).insertAfter(menuEle);
				return true;
			}
			//Add the Expand/Collapse after View Layout if available
			menuEle = $(pageMenuEle).find('#optsDefLayout' + menuId);
			if(menuEle && menuEle.length) {
				$(expandCollapseMenuItem).insertAfter(menuEle);
				return true;
			}

			//Add the expand collapse menu at the beginning of the page menu by default
			$(pageMenuEle).prepend(expandCollapseMenuItem);
			return true;
		}
		//If the page level menu does not exist
		else {
			MP_Util.LogWarn("The page level menu was not found. Cannot add the expand/collapse menu.");
			return false;
		}
	}
	catch (err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "loadExpandCollapseAllMenuItem");
		return false;
	}
};
/**
 * Adds the drag and drop menu item to the page level menu.
 * @this (MPageView)
 * @return {Boolean} True if the Drag and Drop toggle menu option was added to page, false otherwise.
 */
MPageView.prototype.loadDragAndDropMenuItem = function() {
	var activeView = null;
	var categoryMean = "";
	var criterion = null;
	var menuEle = null;
	var menuId = "";
	var pageMenuEle = null;
	var parentEleId = "";
	var dragNDropMenuItem = null;
	var dragNDropEnabled = false;
	var vpParent = "";
	var that = this;
	activeView = $("#" + that.getCategoryMean());
	if(activeView.length) {
		parentEleId = "#" + that.getCategoryMean();
		dragNDropEnabled = $(activeView).hasClass("dnd-enabled");
	}
	else {
		activeView = $(document.body);
		dragNDropEnabled = $(activeView).hasClass("dnd-enabled");
	}

	function activateDragAndDrop() {
		dragNDropEnabled = $(activeView).hasClass("dnd-enabled");

		//Check the dragging active css class
		if(dragNDropEnabled) {
			//Remove the Drag and Drop css class
			$(activeView).removeClass("dnd-enabled");

			//Update the Drag and Drop menu item display
			if(dragNDropMenuItem) {
				$(dragNDropMenuItem).html(i18n.DRAG_AND_DROP_ENABLE);
			}

			//Disables Drag and Drop
			$(parentEleId + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3").sortable("disable");
			//Update the cursor to switch from the move icon to auto
			$(parentEleId + " .col-outer1:last .sec-hd").css("cursor", "auto");
		}
		else {
			//add the Drag and Drop css class
			$(activeView).addClass("dnd-enabled");

			//Update the Drag and Drop menu item display
			if(dragNDropMenuItem) {
				$(dragNDropMenuItem).html(i18n.DRAG_AND_DROP_DISABLE);
			}

			// re-enables sortable
			$(parentEleId + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3").sortable("enable");
			// update the cursor back to the move icon
			$(parentEleId + " .col-outer1:last .sec-hd").css("cursor", "move");
		}
	}

	//Determine the parent div identifier
	vpParent = (this.getViewpointIndicator()) ? "#" + this.getCategoryMean() : "";

	//Retrieve the page menu if available
	categoryMean = this.getCategoryMean();
	menuId = 'pageMenu' + categoryMean;
	pageMenuEle = $('#optsMenupersonalize' + menuId);

	try {
		if(pageMenuEle.length) {
			criterion = this.getCriterion();
			//Create the Drag and Drop Menu Item
			dragNDropMenuItem = $("<div></div>").attr("id", "optsDNDToggle" + menuId).addClass("opts-menu-item").click(activateDragAndDrop);

			//Check that the Drag And Drop Menu Item was successfully created
			if(!dragNDropMenuItem || !dragNDropMenuItem.length) {
				MP_Util.LogWarn("The drag and drop menu item was unsuccessfully created.");
				return false;
			}
			//Set the menu item text based on the current standing (if enabled or not)
			$(dragNDropMenuItem).html( dragNDropEnabled ? i18n.DRAG_AND_DROP_DISABLE : i18n.DRAG_AND_DROP_ENABLE);
			//Find the Layout menu item in the page level menu
			menuEle = $(pageMenuEle).find('#optsDefLayout' + menuId);
			//If the Layout menu exists, insert the drag and drop menu item after it
			if(menuEle && menuEle.length) {
				$(dragNDropMenuItem).insertAfter(menuEle);
				return true;
			}

			//Add the Drag and Drop menu item at the end of the menu by default
			$(pageMenuEle).append(dragNDropMenuItem);
			return true;
		}
		else {
			MP_Util.LogWarn("The page level menu was not found. Cannot add the expand/collapse menu.");
			return false;
		}
	}
	catch(err) {
		MP_Util.LogJSError(err, null, "mp_component_defs.js", "loadDragAndDropMenuItem");
		return false;
	}
};
/**
 * Creates the MPage View level timer objects based on the m_capTimerName and m_subTimerName strings set in the individual MPageView prototyped objects, ie
 * DischargeSummaryMPage.
 * @this {MPagesView}
 * @return null
 */
MPageView.prototype.createMPageTimerObject = function() {
	var capTimerName = "";
	var mPageTimer = null;
	var subTimerName = "";
	capTimerName = this.getCapTimerName();
	subTimerName = this.getSubTimerName();

	if(capTimerName) {
		mPageTimer = MP_Util.CreateTimer(capTimerName);
		if(mPageTimer) {
			mPageTimer.SubTimerName = (subTimerName) ? subTimerName : "";
			mPageTimer.Stop();
		}
	}
};
/**
 * This function is used to retrieve the settings for a specific MPage View.  If the settings are already available in the m_bedrockMPage object then those will
 * be returned.  If the settings are not available then they will be retrieved using the mp_view_data_load script.
 * @this {MPageView}
 * @return {Object} An object which contains the settings for this MPageView object.
 */
MPageView.prototype.getPageSettingsObject = function() {
	var x = 0;
	var categoryMean = this.getCategoryMean();
	var criterion = this.getCriterion();
	var pageSettings = null;

	if(m_bedrockMpage) {
		//Bedrock settings already available.
		MP_Util.LogDebug("Bedrock JSON: " + JSON.stringify(m_bedrockMpage));
		for( x = m_bedrockMpage.MPAGE.length; x--; ) {
			if(categoryMean === m_bedrockMpage.MPAGE[x].CATEGORY_MEAN.toUpperCase()) {
				return m_bedrockMpage.MPAGE[x];
			}
		}
	}

	//Page settings not available.  Retrieve them from the Database.
	var cclParams = ["^MINE^", criterion.provider_id + ".0", criterion.position_cd + ".0", "^" + categoryMean + "^"];
	var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
	info.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			try {
				MP_Util.LogScriptCallInfo(null, this, "mp_component_defs.js", "getPageSettings");
				m_bedrockMpage = JSON.parse(info.responseText).BR_MPAGE;
				pageSettings = m_bedrockMpage.MPAGE[0];
			}
			catch (err) {
				MP_Util.LogJSError(err, null, "mp_component_defs.js", "getPageSettings");
				pageSettings = null;
			}
		}
		if(this.readyState == 4) {
			MP_Util.ReleaseRequestReference(this);
		}
	};
	//Call the ccl program and send the parameter string
	if(CERN_BrowserDevInd) {
		var url = "MP_VIEW_DATA_LOAD?parameters=" + cclParams.join(",");
		info.open("GET", url, false);
		info.send(null);
	}
	else {
		info.open('GET', "MP_VIEW_DATA_LOAD", false);
		info.send(cclParams.join(","));
	}

	return pageSettings;
};
/**
 * Loads the page menu for a specific MPageView object.
 * @this {MPageView}
 */
MPageView.prototype.loadPageMenu = function(){
	MP_Util.Doc.CreatePageMenu(this.getCategoryMean(), this.getCategoryMean());
};
/**
 * Sorts the MPage Components by group sequence, then by column, and lastly by row.
 * @param {MPageComponent} c1 Component one to compare against
 * @param {MPageComponent} c2 Component two to compare against
 * @return {Short} Returns the sequence in which the components should display.
 *
 * @author Greg Howdeshell
 */
function SortMPageComponentRows(c1, c2) {
	if(c1.getSequence() < c2.getSequence()) {
		return -1;
	}
	if(c1.getSequence() > c2.getSequence()) {
		return 1;
	}
	return 0;
}

function SortMPageComponentCols(c1, c2) {
	if(c1.getColumn() < c2.getColumn()) {
		return -1;
	}
	if(c1.getColumn() > c2.getColumn()) {
		return 1;
	}
	return SortMPageComponentRows(c1, c2);
}

function SortMPageComponents(c1, c2) {
	if(c1.getPageGroupSequence() < c2.getPageGroupSequence()) {
		return -1;
	}
	if(c1.getPageGroupSequence() > c2.getPageGroupSequence()) {
		return 1;
	}
	return SortMPageComponentCols(c1, c2);
}

The scope of an MPage object and Components are during rendering of the page.  However,
once the page has been rendered these items are lost.  Because there is a need to refresh 
components, the components on a 'page' must be globally stored to allow for refreshing of data.
*/
var CERN_EventListener = null;
var CERN_MPageComponents = null;
var CERN_TabManagers = null;
var CERN_MPages = null;
var CERN_BrowserDevInd = false;
var CK_DATA={};

var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

Array.prototype.addAll = function (v) {
    if (v && v.length > 0) {
		for (var x = 0, xl = v.length; x < xl; x++) {
			this.push(v[x]);
		}
	}
};

/**
 * Core utility methods
 * @namespace
 */
var MP_Core = function(){
    return {
    	/**
    	 * The criterion object stores information about the request in context such as the patient/person, encounter/visit, provider/personnel, relationship etc.
    	 */
        Criterion: function(jsCrit, static_content){
            var m_patInfo = null;
            var m_prsnlInfo = null;
            var m_periop_cases = null;
            var m_encntrOverride = [];
            
            this.person_id = jsCrit.PERSON_ID;
            this.encntr_id = (jsCrit.ENCNTRS.length > 0) ? jsCrit.ENCNTRS[0].ENCNTR_ID : 0;
            this.provider_id = jsCrit.PRSNL_ID;
            this.executable = jsCrit.EXECUTABLE;
            this.static_content = static_content;
            this.position_cd = jsCrit.POSITION_CD;
            this.ppr_cd = jsCrit.PPR_CD;
            this.debug_ind = jsCrit.DEBUG_IND;
            CERN_BrowserDevInd = (parseInt(this.debug_ind) & 0x01 === 1)? true : false;
            this.help_file_local_ind = jsCrit.HELP_FILE_LOCAL_IND;
            this.category_mean = jsCrit.CATEGORY_MEAN;
            this.locale_id = (this.debug_ind) ? "en_us" : jsCrit.LOCALE_ID;
			//@deprecated as of 3.3.1 and should be removed as of greater than or equal to 3.4
            this.device_location = "";
			
			var encntrOR = jsCrit.ENCNTR_OVERRIDE;
			
			if (encntrOR){
				for (var x = encntrOR.length; x--;){
					m_encntrOverride.push(encntrOR[x].ENCNTR_ID);
				}
			}
			else{
				m_encntrOverride.push(this.encntr_id);
			}
            
            this.setPatientInfo = function(value){
                m_patInfo = value;
            };
            this.getPatientInfo = function(){
                return m_patInfo;
            };
            this.setPeriopCases = function(value){
                m_periop_cases = value;
            };
            this.getPeriopCases = function(){
                return m_periop_cases;
            };   
            this.getPersonnelInfo = function(){
                if (!m_prsnlInfo){
                    m_prsnlInfo = new MP_Core.PersonnelInformation(this.provider_id, this.person_id);
                }
                return m_prsnlInfo;
            };
            /**
             * @return List of encounters that are considered 'ACTIVE'.
             * In the rare case that encounter override is needed, this will return the encounter neccessary to pass
             * to a service for retrieval of data.
             */
            this.getEncounterOverride = function(){
            	return m_encntrOverride;
			};
        },
        PatientInformation: function(){
            var m_dob = null;
            var m_sex = null;
            
            this.setSex = function(value){
                m_sex = value;
            };
            this.getSex = function(){
                return m_sex;
            };
            this.setDOB = function(value){
                m_dob = value;
            };
            this.getDOB = function(){
                return m_dob;
            };
        },
        
        PeriopCases: function(){
        	var m_case_id = null;
            var m_prior_ind = null;
            var m_days = null;
            var m_hours = null;
            var m_mins = null;
            var m_cntdwn_desc_flag = null;
            
            this.setCaseID = function(value){
                m_case_id = value;
            };
            this.getCaseID = function(){
                return m_case_id;
            };
            this.setDays = function(value){
                m_days = value;
            };
            this.getDays = function(){
                return m_days;
            };
            this.setHours = function(value){
                m_hours = value;
            };
            this.getHours = function(){
                return m_hours;
            };
            this.setMins = function(value){
                m_mins = value;
            };
            this.getMins = function(){
                return m_mins;
            };
            this.setCntdwnDscFlg = function(value){
                m_cntdwn_desc_flag = value;
            };
            this.getCntdwnDscFlg = function(){
                return m_cntdwn_desc_flag;
            };
        },
        
        ScriptRequest: function(component, loadTimerName){
            var m_comp = component;
            var m_load = loadTimerName;
            var m_name = "";
            var m_programName = "";
            var m_params = null;
            var m_async = true;
            
            this.getComponent = function(){
                return m_comp;
            };
            this.getLoadTimer = function(){
                return m_load;
            };
            this.setName = function(value){
                m_name = value;
            };
            this.getName = function(){
                return m_name;
            };
            this.setProgramName = function(value){
                m_programName = value;
            };
            this.getProgramName = function(){
                return m_programName;
            };
            this.setParameters = function(value){
                m_params = value;
            };
            this.getParameters = function(){
                return m_params;
            };
            this.setAsync = function(value){
                m_async = value;
            };
            this.isAsync = function(){
                return m_async;
            };
        },
        ScriptReply: function(component){
			//used to syne a request to a reply
			var m_name = "";
			//by default every script reply is 'f'ailed unless otherwise noted
			var m_status = "F";
            var m_err = "";
            var m_resp = null;
            var m_comp = component;
            
            this.setName = function(value){
                m_name = value;
            };
            this.getName = function(){
                return m_name;
            };
            this.setStatus = function(value){
                m_status = value;
            };
            this.getStatus = function(){
                return m_status;
            };
            this.setError = function(value){
                m_err = value;
            };
            this.getError = function(){
                return m_err;
            };
            this.setResponse = function(value){
                m_resp = value;
            };
            this.getResponse = function(){
                return m_resp;
            };
            this.getComponent = function(){
                return m_comp;
            };
        },
        PersonnelInformation: function(prsnlId, patientId){
            var m_prsnlId = prsnlId;
			//if m_viewableEncntrs remains null, error in retrieval of viewable encntr
			var m_viewableEncntrs = null;
            //load valid encounter list from patcon wrapper
            var patConObj = null;
            try {
                patConObj = window.external.DiscernObjectFactory("PVCONTXTMPAGE");
				MP_Util.LogDiscernInfo(null, "PVCONTXTMPAGE", "mp_core.js", "PersonnelInformation");
                if (patConObj){
                    m_viewableEncntrs = patConObj.GetValidEncounters(patientId);
					MP_Util.LogDebug("Viewable Encounters: " + m_viewableEncntrs);
                }
            } 
            catch (e) {
            }
            finally {
                //release used memory
                patConObj = null;
            }
            
            this.getPersonnelId = function(){
                return m_prsnlId;
            };
            /**
             * Returns the associated encounter that the provide has the ability to see
             */
            this.getViewableEncounters = function(){
                return m_viewableEncntrs;
            };
        },
        XMLCclRequestWrapper: function(component, program, paramAr, async){
            var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
            var i18nCore = i18n.discernabu;
            var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
            
            info.onreadystatechange = function(){
            	var countText = "";
            	var errMsg = null;
                if (this.readyState == 4 && this.status == 200) {
                    try {
                    	MP_Util.LogScriptCallInfo(component, this, "mp_core.js", "XMLCclRequestWrapper");
                        var jsonEval = JSON.parse(this.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        if (recordData.STATUS_DATA.STATUS == "Z") {
                            countText = (component.isLineNumberIncluded() ? "(0)" : "");
                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
                        }
                        else if (recordData.STATUS_DATA.STATUS == "S") {
                            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
                            try {
                                var rootComponentNode = component.getRootComponentNode();
                                var secTitle = Util.Style.g("sec-total", rootComponentNode, "span");
                                secTitle[0].innerHTML = i18nCore.RENDERING_DATA + "...";
                                component.HandleSuccess(recordData);
                            } 
                            catch (err) {
                            	MP_Util.LogJSError(err, component, "mp_core.js", "XMLCclRequestWrapper");
                                if (timerRenderComponent) {
                                    timerRenderComponent.Abort();
                                    timerRenderComponent = null;
                                }
                                throw (err);
                            }
                            finally {
                                if (timerRenderComponent){
                                    timerRenderComponent.Stop();
                                }
                            }
                        }
                        else {
                        	MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestWrapper");
                            errMsg = [];
                            var ss = null;
                            errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li>");
                            var statusData = recordData.STATUS_DATA;
                            if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0) {
                                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                                    ss = statusData.SUBEVENTSTATUS[x];
                                    errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                                }
                            }
                            else if (statusData.SUBEVENTSTATUS.length === undefined) {
                                ss = statusData.SUBEVENTSTATUS;
                                errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                            }
                            errMsg.push("</ul>");
                            countText = (component.isLineNumberIncluded() ? "(0)" : "");
                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                        }
                    } 
                    catch (err) {
						MP_Util.LogJSError(err, component, "mp_core.js", "XMLCclRequestWrapper");
                        errMsg = [];
                        errMsg.push("<b>", i18nCore.JS_ERROR, "</b><br /><ul><li>", i18nCore.MESSAGE, ": ", err.message, "</li><li>", i18nCore.NAME, ": ", err.name, "</li><li>", i18nCore.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18nCore.DESCRIPTION, ": ", err.description, "</li></ul>");
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                        
                        if (timerLoadComponent) {
                            timerLoadComponent.Abort();
                            timerLoadComponent = null;
                        }
                    }
                    finally {
                        if (timerLoadComponent){ 
                            timerLoadComponent.Stop();
                        }
                    }
                }
                else if (this.readyState == 4 && this.status != 200) {
					MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestWrapper");
                    errMsg = [];
                    errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li></ul>");
                    MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, "");
                    if (timerLoadComponent){
                        timerLoadComponent.Abort();
                    }
                }
                if (this.readyState == 4) {
                    MP_Util.ReleaseRequestReference(this);
                }
            };
            
            if(CERN_BrowserDevInd){
				var url = program + "?parameters=" + paramAr.join(",");
				info.open("GET", url, async);
				info.send(null); 
            }	
            else{
	            info.open('GET', program, async);
	            info.send(paramAr.join(","));
            }
        },
        /**
         * As a means in which to provide the consumer to handle the response of the script request, this method
         * provide an encapsulated means in which to call the XMLCCLRequest and return a ReplyObject with data
         * about the response that can be utilized for evaluation.
         * @param component [REQUIRED] The component in which is executing the request
         * @param request [REQUIRED] The Request Object containing the information about the script being executed
         * @param funcCallBack [REQUIRED] The function to execute once the execution of the request has been completed
         */
        XMLCCLRequestCallBack: function(component, request, funcCallback){
            var timerLoad = MP_Util.CreateTimer(request.getLoadTimer());
            var i18nCore = i18n.discernabu;
            var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
            var reply = new MP_Core.ScriptReply(component);
            reply.setName(request.getName());
            
            info.onreadystatechange = function(){
                var errMsg = null;
                if (this.readyState == 4 && this.status == 200) {
                    try {
						MP_Util.LogScriptCallInfo(component, this, "mp_core.js", "XMLCclRequestCallBack");
                        var jsonEval = JSON.parse(info.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        var status = recordData.STATUS_DATA.STATUS;
                        reply.setStatus(status);
                        if (status == "Z") {
							//Pass response anyways
							reply.setResponse(recordData);
                            funcCallback(reply);
                        }
                        else if (status == "S") {
                            reply.setResponse(recordData);
                            funcCallback(reply);
                        }
                        else {
							MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestCallBack");
                            errMsg = [];
                            errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li>");
                            var statusData = recordData.STATUS_DATA;
                            if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0) {
                                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                                    var ss = statusData.SUBEVENTSTATUS[x];
                                    errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                                }
                            }
                            else if (statusData.SUBEVENTSTATUS.length == undefined) {
                                var ss = statusData.SUBEVENTSTATUS;
                                errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                            }
                            errMsg.push("</ul>");
                            reply.setError(errMsg.join(""));
                            funcCallback(reply);
                        }
                    } 
                    catch (err) {
						MP_Util.LogJSError(err, component, "mp_core.js", "XMLCclRequestCallBack");
                        errMsg = [];
                        errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li></ul>");
                        reply.setError(errMsg.join(""));
                        if (timerLoad) {
                            timerLoad.Abort();
                            timerLoad = null;
                        }
                    }
                    finally {
                        if (timerLoad) {
                            timerLoad.Stop();
                        }
                    }
                }
                else if (info.readyState == 4 && info.status != 200) {
					MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestCallBack");
                    errMsg = [];
                    errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li></ul>");
                    reply.setError(errMsg.join(""));
                    if (timerLoad){
                        timerLoad.Abort();
                    }
                    funcCallback(reply);
                }
                if (this.readyState == 4) {
                    MP_Util.ReleaseRequestReference(this);
                }
            };
            
            if(CERN_BrowserDevInd){
				var url = request.getProgramName() + "?parameters=" + request.getParameters().join(",");
				info.open("GET", url, request.isAsync());
				info.send(null); 
            }
            else{
            	info.open('GET', request.getProgramName(), request.isAsync());
            	info.send(request.getParameters().join(","));
            }
            
        },
        XMLCCLRequestThread: function(name, component, request){
            var m_name = name;
            var m_comp = component;
            
            var m_request = request;
            m_request.setName(name);
            
            this.getName = function(){
                return m_name;
            };
            this.getComponent = function(){
                return m_comp;
            };
            this.getRequest = function(){
                return m_request;
            };
        },
        XMLCCLRequestThreadManager: function(callbackFunction, component, handleFinalize){
            var m_threads = null;
            var m_replyAr = null;
            
            var m_isData = false;
            var m_isError = false;
            
            this.addThread = function(thread){
                if (!m_threads){ 
                    m_threads = [];
                }
                m_threads.push(thread);
            };
            
            this.begin = function(){
                if (m_threads && m_threads.length > 0) {
                    for (x = m_threads.length; x--;) {
                        //start each xmlcclrequest
                        var thread = m_threads[x];
                        MP_Core.XMLCCLRequestCallBack(thread.getComponent(), thread.getRequest(), this.completeThread);
                    }
                }
                else {
                    if (handleFinalize) {
                        var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
                    }
                    else {
                        callbackFunction(null, component);
                    }
                }
            };
            
            this.completeThread = function(reply){
                if (!m_replyAr){ 
                    m_replyAr = [];
                }
                if (reply.getStatus() === "S"){ 
                    m_isData = true;
                }
                else if (reply.getStatus() === "F") {
                    m_isError = true;
                }
                
                m_replyAr.push(reply);
                if (m_replyAr.length === m_threads.length) {
                    var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                    var errMsg = null;
                    try{
                    	if (handleFinalize) {
                            if (m_isError) {
                                //handle error response
                                errMsg = [];
                                for (var x = m_replyAr.length; x--;) {
                                    var rep = m_replyAr[x];
                                    if (rep.getStatus() === "F") {
                                        errMsg.push(rep.getError());
                                    }
                                }
                                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br />")), component, "");
                            }
                            else if (!m_isData) {
                                //handle no data
                                countText = (component.isLineNumberIncluded() ? "(0)" : "");
                                MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
                            }
                            else {
                                callbackFunction(m_replyAr, component);
                            }
                        }
                        else {
                            callbackFunction(m_replyAr, component);
                        }
                    }
                    catch(err){
						MP_Util.LogJSError(err, component, "mp_core.js", "XMLCCLRequestThreadManager");
                    	var i18nCore = i18n.discernabu;
                        errMsg = ["<b>", i18nCore.JS_ERROR, "</b><br /><ul><li>", i18nCore.MESSAGE, ": ", err.message, "</li><li>", i18nCore.NAME, ": ", err.name, "</li><li>", i18nCore.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18nCore.DESCRIPTION, ": ", err.description, "</li></ul>"];
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                    }
                }
            };
        },
        MapObject: function(name, value){
            this.name = name;
            this.value = value;
        },
        /**
         * An object to store the attributes of a single tab.
         * @param {Object} key The id associated to the tab.
         * @param {Object} name The name to be displayed on the tab.
         * @param {Object} components The components to be associated to the tab.
         */
        TabItem: function(key, name, components, prefIdentifier){
            this.key = key;
            this.name = name;
            this.components = components;
            this.prefIdentifier = prefIdentifier;
        },
        TabManager: function(tabItem){
            var m_isLoaded = false;
            var m_tabItem = tabItem;
            //By default a tab and all it's components are not fully expanded
            var m_isExpandAll = false;
            var m_isSelected = false;
            this.toggleExpandAll = function(){
                m_isExpandAll = (!m_isExpandAll);
            };
            this.loadTab = function(){
                if (!m_isLoaded) {
                    m_isLoaded = true;
                    var components = m_tabItem.components;
                    if (components) {
                        for (var xl = 0; xl < components.length; xl++) {
                            var component = components[xl];
                            if (component.isDisplayable() && component.isExpanded()){ 
                                component.InsertData();
                            }
                        }
		    			for (var xl = 0; xl < components.length; xl++) {
                            var component = components[xl];
                            if (component.isDisplayable() && !component.isExpanded()){ 
                                component.InsertData();
                            }
                        }
                    }
                }
            };
            this.getTabItem = function(){
                return m_tabItem;
            };
            this.getSelectedTab = function(){
                return m_isSelected;
            };
            this.setSelectedTab = function(value){
                m_isSelected = value;
            };
        },
        ReferenceRangeResult: function(){
            //results
            var m_valNLow = -1, m_valNHigh = -1, m_valCLow = -1, m_valCHigh = -1;
            //units of measure
            var m_uomNLow = null, m_uomNHigh = null, m_uomCLow = null, m_uomCHigh = null;
            this.init = function(refRange, codeArray){
                var nf = MP_Util.GetNumericFormatter();
                m_valCLow = nf.format(refRange.CRITICAL_LOW.NUMBER);
                if (refRange.CRITICAL_LOW.UNIT_CD != "") {
                    m_uomCLow = MP_Util.GetValueFromArray(refRange.CRITICAL_LOW.UNIT_CD, codeArray);
                }
                m_valCHigh = nf.format(refRange.CRITICAL_HIGH.NUMBER);
                if (refRange.CRITICAL_HIGH.UNIT_CD != "") {
                    m_uomCHigh = MP_Util.GetValueFromArray(refRange.CRITICAL_HIGH.UNIT_CD, codeArray);
                }
                m_valNLow = nf.format(refRange.NORMAL_LOW.NUMBER);
                if (refRange.NORMAL_LOW.UNIT_CD != "") {
                    m_uomNLow = MP_Util.GetValueFromArray(refRange.NORMAL_LOW.UNIT_CD, codeArray);
                }
                m_valNHigh = nf.format(refRange.NORMAL_HIGH.NUMBER);
                if (refRange.NORMAL_HIGH.UNIT_CD != "") {
                    m_uomNHigh = MP_Util.GetValueFromArray(refRange.NORMAL_HIGH.UNIT_CD, codeArray);
                }
            };
            this.getNormalLow = function(){
                return m_valNLow;
            };
            this.getNormalHigh = function(){
                return m_valNHigh;
            };
            this.getNormalLowUOM = function(){
                return m_uomNLow;
            };
            this.getNormalHighUOM = function(){
                return m_uomNHigh;
            };
            this.getCriticalLow = function(){
                return m_valCLow;
            };
            this.getCriticalHigh = function(){
                return m_valCHigh;
            };
            this.getCriticalLowUOM = function(){
                return m_uomCLow;
            };
            this.getCriticalHighUOM = function(){
                return m_uomCHigh;
            };
            this.toNormalInlineString = function(){
                var low = (m_uomNLow) ? m_uomNLow.display : "";
                var high = (m_uomNHigh) ? m_uomNHigh.display : "";
                if (m_valNLow != 0 || m_valNHigh != 0) {
                    return (m_valNLow + "&nbsp;" + low + " - " + m_valNHigh + "&nbsp;" + high);
                }
                else { 
                    return "";
                }
            };
            this.toCriticalInlineString = function(){
                var low = (m_uomCLow) ? m_uomCLow.display : "";
                var high = (m_uomCHigh) ? m_uomCHigh.display : "";
                if (m_valCLow != 0 || m_valCHigh != 0) {
                    return (m_valCLow + "&nbsp;" + low + " - " + m_valCHigh + "&nbsp;" + high);
                }
                else { 
                    return "";
                }
            };
        },
        
        QuantityValue: function(){
            var m_val, m_precision;
            var m_uom = null;
            var m_refRange = null;
            var m_rawValue = 0;
            var m_hasModifier = false;
            this.init = function(result, codeArray){
                var quantityValue = result.QUANTITY_VALUE;
                var referenceRange = result.REFERENCE_RANGE;
                for (var l=0,ll=quantityValue.length;l<ll;l++) {
                    var numRes = quantityValue[l].NUMBER;
                    m_precision = quantityValue[l].PRECISION;
                    if (!isNaN(numRes)) {
                        m_val = MP_Util.Measurement.SetPrecision(numRes, m_precision);
                        m_rawValue = numRes;
                    }
                    if (quantityValue[l].MODIFIER_CD != "") {
                        var modCode = MP_Util.GetValueFromArray(quantityValue[l].MODIFIER_CD, codeArray);
                        if (modCode){
                            m_val = modCode.display + m_val;
                            m_hasModifier = true;
                        }
                    }
                    if (quantityValue[l].UNIT_CD != "") {
                        m_uom = MP_Util.GetValueFromArray(quantityValue[l].UNIT_CD, codeArray);
                    }
                    for (var m=0,ml=referenceRange.length;m<ml;m++) {
                        m_refRange = new MP_Core.ReferenceRangeResult();
                        m_refRange.init(referenceRange[m], codeArray);
                    }
                }
            };
						
            this.getValue = function(){
                return m_val;
            };
            this.getRawValue = function(){
            	return m_rawValue;
            };
            this.getUOM = function(){
                return m_uom;
            };
            this.getRefRange = function(){
                return m_refRange;
            };
            this.getPrecision = function(){
                return m_precision;
            };
            this.toString = function(){
                if (m_uom) {
                    return (m_val + " " + m_uom.display);
                }
                return m_val;
            };
            this.hasModifier = function(){
            	return m_hasModifier;
            };
        },
        //measurement.init(meas.EVENT_ID, meas.PERSON_ID, meas.ENCNTR_ID, eventCode, dateTime, MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray));
        Measurement: function(){
            var m_eventId = 0.0;
            var m_personId = 0.0;
            var m_encntrId = 0.0;
            var m_eventCode = null;
            var m_dateTime = null;
            var m_updateDateTime = null;
            var m_result = null;
            var m_normalcy = null;
            var m_status = null;
			var m_comment = "";
            
            this.init = function(eventId, personId, encntrId, eventCode, dateTime, resultObj, updateDateTime){
                m_eventId = eventId;
                m_personId = personId;
                m_encntrId = encntrId;
                m_eventCode = eventCode;
                m_dateTime = dateTime;
                m_result = resultObj;
                m_updateDateTime = updateDateTime;
            };
			
            this.initFromRec = function(measObj, codeArray){
                var effectiveDateTime = new Date();
                var updateDateTime = new Date();
                m_eventId = measObj.EVENT_ID;
                m_personId = measObj.PATIENT_ID;
                m_encntrId = measObj.ENCOUNTER_ID;
                m_eventCode = MP_Util.GetValueFromArray(measObj.EVENT_CD, codeArray);			                    
                effectiveDateTime.setISO8601(measObj.EFFECTIVE_DATE);   
                m_dateTime = effectiveDateTime;
                m_result = MP_Util.Measurement.GetObject(measObj, codeArray);
                updateDateTime.setISO8601(measObj.UPDATE_DATE);
                m_updateDateTime = updateDateTime;		
                m_normalcy = MP_Util.GetValueFromArray(measObj.NORMALCY_CD, codeArray);
                m_status = MP_Util.GetValueFromArray(measObj.STATUS_CD, codeArray);
                m_comment = measObj.COMMENT;
            };
			
            this.getEventId = function(){
                return m_eventId;
            };
            this.getPersonId = function(){
                return m_personId;
            };
            this.getEncntrId = function(){
                return m_encntrId;
            };
            this.getEventCode = function(){
                return m_eventCode;
            };
            this.getDateTime = function(){
                return m_dateTime;
            };
            this.getUpdateDateTime = function(){
                return m_updateDateTime;
            };
            this.getResult = function(){
                return m_result;
            };
            this.setNormalcy = function(value){
                m_normalcy = value;
            };
            this.getNormalcy = function(){
                return m_normalcy;
            };
            this.setStatus = function(value){
                m_status = value;
            };
            this.getStatus = function(){
                return m_status;
            };
            this.isModified = function(){
                if (m_status) {
                    var mean = m_status.meaning;
                    if (mean === "MODIFIED" || mean ==="ALTERED") {
                    	return true;
                    }
                }
                return false;
            };
            this.getComment = function(){
                return m_comment;
			};
        },
        MenuItem: function(){
            var m_name = "";
            var m_desc = "";
            var m_id = 0.0;
            var m_meaning;
            var m_valSequence = 0; //This is used as the primary grouping value for IView bands
            var m_valTypeFlag = 0; //This is used to determine which is the band, section, or item
            
            this.setDescription = function(value){
                m_desc = value;
            };
            this.getDescription = function(){
                return m_desc;
            };
            this.setName = function(value){
                m_name = value;
            };
            this.getName = function(){
                return m_name;
            };
            this.setId = function(value){
                m_id = value;
            };
            this.getId = function(){
                return m_id;
            };
			this.setMeaning = function(value) {
				m_meaning = value;
			};
			this.getMeaning = function() {
				return m_meaning;
			};
			this.setValSequence = function(value) {
				m_valSequence = value;
			};
			this.getValSequence = function() {
				return m_valSequence;
			};
			this.setValTypeFlag = function(value) {
				m_valTypeFlag = value;
			};
			this.getValTypeFlag = function() {
				return m_valTypeFlag;
			};
        },
        CriterionFilters: function(criterion){
            var m_criterion = criterion;
            var m_evalAr = [];
            
            this.addFilter = function(type, value){
                m_evalAr.push(new MP_Core.MapObject(type, value));
            };
            this.checkFilters = function(){
                var pass = false;
                var patInfo = m_criterion.getPatientInfo();
                for (var x = m_evalAr.length; x--;) {
                    var filter = m_evalAr[x];
                    var dob = null;
                    switch (filter.name) {
                        case MP_Core.CriterionFilters.SEX_MEANING:
                            var sex = patInfo.getSex();
                            if (sex) {
                                if (filter.value == sex.meaning){ 
                                    continue;
                                }
                            }
                            return false;
                        case MP_Core.CriterionFilters.DOB_OLDER_THAN:
                            dob = patInfo.getDOB();
                            if (dob) {
                                if (dob <= filter.value) {
                                    continue;
                                }
                            }
                            return false;
                        case MP_Core.CriterionFilters.DOB_YOUNGER_THAN:
                            dob = patInfo.getDOB();
                            if (dob) {
                                if (dob >= filter.value) { 
                                    continue;
                                }
                            }
                            return false;
                        default:
                            alert("Unhandled criterion filter");
                            return false;
                    }
                }
                return true;
            };
        },
        CreateSimpleError: function(component, sMessage){
            var errMsg = [];
            var i18nCore = i18n.discernabu;
            var countText = (component.isLineNumberIncluded() ? "(0)" : "");
            errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", sMessage ,"</li></ul>");
            MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
        }
    };
}();
//Constants for CriterionFilter items
MP_Core.CriterionFilters.SEX_MEANING = 1;
MP_Core.CriterionFilters.DOB_OLDER_THAN = 2;
MP_Core.CriterionFilters.DOB_YOUNGER_THAN = 3;

MP_Core.AppUserPreferenceManager = function(){
    var m_criterion = null;
    var m_prefIdent = "";
    var m_jsonObject = null;
    
    return {
        /**
         * Allows for the initialization of the manager to store what criterion and preference identifier to
         * utilize for retrieval of preferences
         * @param {Object} criterion
         * @param {Object} preferenceIdentifier
         */
        Initialize: function(criterion, preferenceIdentifier){
            m_criterion = criterion;
            m_prefIdent = preferenceIdentifier;
            m_jsonObject = null;
        },
		SetPreferences:function(prefString){
			var jsonEval = JSON.parse(prefString);
			m_jsonObject = jsonEval;
		},
        LoadPreferences: function(){
            if (!m_criterion) {
                alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
                return null;
            }
            if (m_jsonObject) {
                return;
            }
            else {
                var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
                info.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) {
						MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "LoadPreferences");
                        var jsonEval = JSON.parse(this.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        if (recordData.STATUS_DATA.STATUS == "S") {
                            m_jsonObject = JSON.parse(recordData.PREF_STRING);
                        }
                        else if (recordData.STATUS_DATA.STATUS == "Z") {
                            return;
                        }
                        else {
							MP_Util.LogScriptCallError(null, this, "mp_core.js", "LoadPreferences");
                            var errAr = [];
                            var statusData = recordData.STATUS_DATA;
                            errAr.push("STATUS: " + statusData.STATUS);
                            for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                                var ss = statusData.SUBEVENTSTATUS[x];
                                errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                            }
                            window.status = "Error retrieving user preferences " + errAr.join(",");
                            return;
                        }
                    }
                    if (this.readyState == 4) {
                        MP_Util.ReleaseRequestReference(this);
                    }
                    
                };
                
                
                var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^"];
                if(CERN_BrowserDevInd){
                	var url = "MP_GET_USER_PREFS?parameters=" + ar.join(",");
					info.open("GET", url, false);
					info.send(null); 
                }
                else{
                	info.open('GET', "MP_GET_USER_PREFS", false);
                	info.send(ar.join(","));
                }
          
                return;
            }
        },
        /**
         * GetPreferences will return the users preferences for the application currently logged into.
         */
        GetPreferences: function(){
            if (!m_criterion) {
                alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
                return null;
            }
            if (!m_jsonObject){ 
                this.LoadPreferences();
            }
            
            return m_jsonObject;
        },
		SavePreferences: function(reload){
            var body = document.body;
            var groups = Util.Style.g("col-group", body, "div");
            var grpId = 0;
            var colId = 0;
            var rowId = 0;
            var compId = 0;
            
            var jsonObject = {};
			jsonObject.user_prefs = {};
			var userPrefs = jsonObject.user_prefs;
			userPrefs.page_prefs = {};
			var pagePrefs = userPrefs.page_prefs;
			pagePrefs.components = [];
			var components = pagePrefs.components;
			var cclParams = [];
            
            //alert("groups.length: " + groups.length)
            for (var x = 0, xl = groups.length; x < xl; x++) {
				//TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
				grpId = x + 1;
                //get liquid layout
                var liqLay = Util.Style.g("col-outer1", groups[x], "div");
                if (liqLay.length > 0) {
                    //get each child column
					var cols = Util.gcs(liqLay[0]);
                    for (var y = 0, yl = cols.length; y < yl; y++) {
                        colId = y + 1;
                        var rows = Util.gcs(cols[y]);
                        for (var z = 0, zl = rows.length; z < zl; z++) {
							var component = {};
                            rowId = z + 1;
                            compId = jQuery(rows[z]).attr('id');
                            var compObj = MP_Util.GetCompObjByStyleId(compId);
							component.id = compObj.getComponentId();
							component.group_seq = grpId;
							component.col_seq = colId;
							component.row_seq = rowId;
							component.toggleStatus = compObj.getToggleStatus();						
							component.grouperFilterLabel = compObj.getGrouperFilterLabel();
							component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
							component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
							component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();							
							component.selectedTimeFrame = compObj.getSelectedTimeFrame();
							component.selectedDataGroup = compObj.getSelectedDataGroup();
                            if (jQuery(rows[z]).hasClass('closed')) {
                                component.expanded = false;
                            }
                            else { 
                                component.expanded = true;
                            }
                            components.push(component);
                        }
                    }
                }
            }
            WritePreferences(jsonObject);
            
            if (reload !== undefined && reload === false) {
                return;
            }
            
            if(typeof m_viewpointJSON=="undefined"){
				cclParams.push("^MINE^",m_criterion.person_id+".0",m_criterion.encntr_id+".0",m_criterion.provider_id+".0",m_criterion.position_cd+".0",m_criterion.ppr_cd+".0","^"+m_criterion.executable+"^","^^","^"+m_criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+m_criterion.category_mean+"^",m_criterion.debug_ind);
				CCLLINK("MP_DRIVER",cclParams.join(","),1);
			}
			else{
				var viewpointJSON=JSON.parse(m_viewpointJSON).VIEWPOINTINFO_REC;
				m_jsonObject=jsonObject;
				cclParams.push("^MINE^",m_criterion.person_id+".0",m_criterion.encntr_id+".0",m_criterion.provider_id+".0",m_criterion.position_cd+".0",m_criterion.ppr_cd+".0","^"+m_criterion.executable+"^","^"+m_criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+viewpointJSON.VIEWPOINT_NAME_KEY+"^",m_criterion.debug_ind,"^^",0,"^"+viewpointJSON.ACTIVE_VIEW_CAT_MEAN+"^");
				CCLLINK(CERN_driver_script,cclParams.join(","),1);
			}
        },
        ClearCompPreferences: function(componentId){
		    var compObj = MP_Util.GetCompObjById(componentId);
		    var style = compObj.getStyles();
			var ns = style.getNameSpace();
			var prefObj = m_jsonObject;
			var filterArr = null;
		
			if (prefObj != null) {
				var strEval = JSON.parse(JSON.stringify(prefObj));
				var strObj = strEval.user_prefs.page_prefs.components;
				for (var x = strObj.length; x--;) {
					if (strEval&&strObj[x].id === componentId) {
						strObj[x].lookbackunits = compObj.getBrLookbackUnits();
						strObj[x].lookbacktypeflag = compObj.getBrLookbackUnitTypeFlag();
						strObj[x].grouperFilterLabel = "";
						strObj[x].grouperFilterCatLabel = "";
						strObj[x].grouperFilterCriteria = filterArr;
						strObj[x].grouperFilterCatalogCodes = filterArr;
						
						strObj[x].selectedTimeFrame = "";
						strObj[x].selectedDataGroup = "";
					}
				}
				compObj.setLookbackUnits(compObj.getBrLookbackUnits());
				compObj.setLookbackUnitTypeFlag(compObj.getBrLookbackUnitTypeFlag());
				compObj.setGrouperFilterLabel("");
				compObj.setGrouperFilterCatLabel("");
				compObj.setGrouperFilterCriteria(filterArr);				
				compObj.setGrouperFilterCatalogCodes(filterArr);				
				compObj.setSelectedTimeFrame("");
				compObj.setSelectedDataGroup("");
				m_jsonObject = strEval;
				WritePreferences(m_jsonObject);
				MP_Util.Doc.CreateLookBackMenu(compObj, 2, "");
				
				if (ns === "lab" || ns === "dg" || ns === "ohx" || ns === "ohx2") {
					compObj.getSectionContentNode().innerHTML = "";
				}
				if(compObj.isResourceRequired()){
					compObj.RetrieveRequiredResources();
				}
				else{
				    compObj.InsertData();						
				}
			}
		},
		UpdatePrefsIdentifier: function(prefIdentifier){
			if(prefIdentifier && typeof prefIdentifier === "string"){
				m_prefIdent = prefIdentifier;
			}
		},
		//Updates the component preferences from the components array passed into the function
		UpdateAllCompPreferences: function(componentArr, changePos){
			var compId = 0;
			var compPrefs = null;
			var compPrefsCnt = 0;
			var compPrefsMap = {};
			var component = null;
			var componentDiv = null;
			var namespace = "";
			var newPrefsInd = false;
			var prefObj = null;
			var prefIndx = 0;
			var tempObj = {};
			var x = 0;
			
			//Check the componentArr and make sure is is populated
			if(!componentArr || !componentArr.length){
				return;
			}
			
			//Create the prefs object if it doesnt already exist
			prefObj = m_jsonObject || {user_prefs:{page_prefs:{components:[]}}};
			compPrefs = prefObj.user_prefs.page_prefs.components;
			
			//Create a component map so we do not have to loop through the array for each component
			compPrefsCnt = compPrefs.length;
			for(x = compPrefsCnt; x--;){
				compPrefsMap[compPrefs[x].id] = x;
			}
						
			//Loop through all of the components and update their preferences in the preferences object.
			compPrefsCnt = componentArr.length;
			for(x = compPrefsCnt; x--;){
				component = componentArr[x];
				//Check to see if there is an existing preferences object
				if(typeof compPrefsMap[component.getComponentId()] != 'undefined'){
					//Update exiting component preferences
					prefIndx = compPrefsMap[component.getComponentId()];
					tempObj = compPrefs[prefIndx];
					newPrefsInd = false;
				}
				else{
					tempObj = {};
					newPrefsInd = true;
				}
				//Save the components basic settings
				tempObj.id = component.getComponentId();
				tempObj.group_seq = component.getPageGroupSequence();
				tempObj.col_seq = component.getColumn();
				tempObj.row_seq = component.getSequence();
				//Since we are updating the toggle status for all components we will need to make sure all required 
				//components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
				//Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
				//and not allow the user to toggle that component even though they should be able to.
				tempObj.toggleStatus = (component.getToggleStatus() === 2) ? 1 : component.getToggleStatus();	
				tempObj.expanded = component.isExpanded();
				
				if (component.getGrouperFilterLabel()) {
					tempObj.grouperFilterLabel = component.getGrouperFilterLabel();
				}
				if (component.getGrouperFilterCriteria()) {
					tempObj.grouperFilterCriteria = component.getGrouperFilterCriteria();
				}
				if (component.getGrouperFilterCatLabel()) {
					tempObj.grouperFilterCatLabel = component.getGrouperFilterCatLabel();
				}
				if (component.getGrouperFilterCatalogCodes()) {
					tempObj.grouperFilterCatalogCodes = component.getGrouperFilterCatalogCodes();
				}
				
				if (component.getSelectedTimeFrame()) {
					tempObj.selectedTimeFrame = component.getSelectedTimeFrame();
				}
				if (component.getSelectedDataGroup()) {
					tempObj.selectedDataGroup = component.getSelectedDataGroup();
				}		
				
				//Push the new preferences object into the array
				if(newPrefsInd){
					compPrefs.push(tempObj);
					//Update the mapping with the new element info
					compPrefsMap[tempObj.id] = compPrefs.length - 1;
				}
			}
			
			//If the changePos flag has been set we will need to update the positions of all components without blowing away existing preferences.
			if(changePos){
				for(x = compPrefsCnt; x--;){
					component = componentArr[x];
					namespace = component.getStyles().getNameSpace();
					compId = component.getComponentId();
					//Get component div
					componentDiv = $("#" + namespace + compId);
					if(componentDiv.length){
						//Get the preferences object
						prefIndx = compPrefsMap[component.getComponentId()];
						tempObj = compPrefs[prefIndx];
						//Get the parent of that component container and find out which index it is located at and use that as the sequence.
						tempObj.row_seq = $(componentDiv).index();
						//Save the new sequence back into the component
						component.setSequence(tempObj.row_seq);
					}
				}
			}
			
			//Save the preferences back to the preferences object.
			m_jsonObject = prefObj;
			WritePreferences(m_jsonObject);	
		},
        SaveCompPreferences: function (componentId, theme, expCol, changePos) {
            var compObj = MP_Util.GetCompObjById(componentId);
            var prefObj = m_jsonObject;
			var noMatch = true;
            if (prefObj != null && !changePos) {
                var strEval = JSON.parse(JSON.stringify(prefObj));
                var strObj = strEval.user_prefs.page_prefs.components;

                for (var x = strObj.length; x--;) {
                    if (strEval && strObj[x].id === componentId) {
						noMatch = false;
                        if (theme) {
							strObj[x].compThemeColor = theme;
                        }
						if (expCol) {						
							if (expCol == "1") {
								strObj[x].expanded = true;
							}
							else {
								strObj[x].expanded = false;
							}
						}
							
						if (compObj.getGrouperFilterLabel()) {
							strObj[x].grouperFilterLabel = compObj.getGrouperFilterLabel();
						}
						if (compObj.getGrouperFilterCatLabel()) {
							strObj[x].grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
						}
						if (compObj.getGrouperFilterCriteria()) {
							strObj[x].grouperFilterCriteria = compObj.getGrouperFilterCriteria();
						}
						if (compObj.getGrouperFilterCatalogCodes() || compObj.getGrouperFilterCatalogCodes() === null) {
							strObj[x].grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
						} else {
							strObj[x].grouperFilterCatalogCodes = [];
						}
						
						if (compObj.getSelectedTimeFrame()) {
							strObj[x].selectedTimeFrame = compObj.getSelectedTimeFrame();
						}
						if (compObj.getSelectedDataGroup()) {
							strObj[x].selectedDataGroup = compObj.getSelectedDataGroup();
						}	
						//Save the components toggle status and the column and sequence information
						strObj[x].toggleStatus = compObj.getToggleStatus();
						strObj[x].col_seq = compObj.getColumn();
						strObj[x].row_seq = compObj.getSequence();
                    }
                }

				if (noMatch) { //single comp change but comp doesn't have user prefs
					var tempObj = {};
					tempObj.id = componentId;
					tempObj.group_seq = compObj.getPageGroupSequence();
					tempObj.col_seq = compObj.getColumn();
					tempObj.row_seq = compObj.getSequence();
					tempObj.compThemeColor = theme;
					
					if (compObj.getGrouperFilterLabel()) {
						tempObj.grouperFilterLabel = compObj.getGrouperFilterLabel();
					}
					if (compObj.getGrouperFilterCriteria()) {
						tempObj.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
					}
					if (compObj.getGrouperFilterCatLabel()) {
						tempObj.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
					}
					if (compObj.getGrouperFilterCatalogCodes()) {
						tempObj.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
					}
					
					if (compObj.getSelectedTimeFrame()) {
						tempObj.selectedTimeFrame = compObj.getSelectedTimeFrame();
					}
					if (compObj.getSelectedDataGroup()) {
						tempObj.selectedDataGroup = compObj.getSelectedDataGroup();
					}		
					//Save the components toggle status
					tempObj.toggleStatus = compObj.getToggleStatus();	

					tempObj.expanded = compObj.isExpanded();
					strObj.push(tempObj);
				}
                m_jsonObject = strEval;
                WritePreferences(m_jsonObject);
			}
			else {
				var body = document.body;
	            var groups = Util.Style.g("col-group", body, "div");
	            var grpId = 0;
	            var colId = 0;
	            var rowId = 0;
	            var compId = 0;
	            
	            var jsonObject = {};
				jsonObject.user_prefs = {};
				var userPrefs = jsonObject.user_prefs;
				userPrefs.page_prefs = {};
				var pagePrefs = userPrefs.page_prefs;
				pagePrefs.components = [];
				var components = pagePrefs.components;
				var cclParams = [];
	            
	            //alert("groups.length: " + groups.length)
	            for (var x = 0, xl = groups.length; x < xl; x++) {
					//TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
					grpId = x + 1;
	                //get liquid layout
	                var liqLay = Util.Style.g("col-outer1", groups[x], "div");
	                if (liqLay.length > 0) {
	                    //get each child column
						var cols = Util.gcs(liqLay[0]);
	                    for (var y = 0, yl = cols.length; y < yl; y++) {
	                        colId = y + 1;
	                        var rows = Util.gcs(cols[y]);
	                        for (var z = 0, zl = rows.length; z < zl; z++) {
								var component = {};
	                            rowId = z + 1;
	                            compId = jQuery(rows[z]).attr('id');
								compObj = MP_Util.GetCompObjByStyleId(compId);
								component.id = compObj.getComponentId();

								if(compObj.getColumn() !== 99) {
									component.group_seq = 1;
									component.col_seq = colId;
									component.row_seq = rowId;
								}
								else {
									component.group_seq = 0;
									component.col_seq = 99;
									component.row_seq = rowId;
								}
								if(compObj.getCompColor()) {
									component.compThemeColor = compObj.getCompColor();
								}
								//Save the components toggle status
								component.toggleStatus = compObj.getToggleStatus();
								compObj.setColumn(component.col_seq);
								compObj.setSequence(component.row_seq);
								component.grouperFilterLabel = compObj.getGrouperFilterLabel();
								component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
								component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
								
								component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
								
								component.selectedTimeFrame = compObj.getSelectedTimeFrame();
								component.selectedDataGroup = compObj.getSelectedDataGroup();
	                            if (jQuery(rows[z]).hasClass('closed')) {
	                                component.expanded = false;
	                            }
	                            else { 
	                                component.expanded = true;
	                            }
	                            components.push(component);
	                        }
	                    }
	                }
	            }
	            WritePreferences(jsonObject);
	            m_jsonObject = jsonObject;
			}
		},
		SaveQOCCompPreferences:function(componentId, theme, expCol, changePos, selectedViewId){
			var QOCTabDiv = _g(selectedViewId);
		    var groups = Util.Style.g("col-group", QOCTabDiv, "div");
		    var grpId = 0;
		    var colId = 0;
		    var rowId = 0;
		    var compId = 0;

			//there must be a last saved view in user prefs if they've got this far
			var jsonObj = MP_Core.AppUserPreferenceManager.GetQOCPreferences();
			var userPrefs;
			var pagePrefs;
			var views;
			var lastSavedView;
			if (jsonObj){
				userPrefs = jsonObj.user_prefs;
				pagePrefs = userPrefs.page_prefs;
			    views = pagePrefs.views;
		        lastSavedView = pagePrefs.last_saved_view;
		        var viewIndex = -1;
		        var viewsLength = views.length;
		        for (var j = viewsLength; j--;) {
					var currentViewName = views[j].label;
					if (currentViewName === lastSavedView){
						viewIndex = j;
						break;
					}
				}
			}
		    
			if (lastSavedView && viewIndex >= 0){
				views[viewIndex].components = [];
		        for (var x = 0, xl = groups.length; x < xl; x++) {
					//TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
					grpId = x + 1;
		            //get liquid layout
		            var liqLay = Util.Style.g("col-outer1", groups[x], "div");
		            if (liqLay.length > 0) {
		                //get each child column
						var cols = Util.gcs(liqLay[0]);
		                for (var y = 0, yl = cols.length; y < yl; y++) {
		                    colId = y + 1;
		                    var rows = Util.gcs(cols[y]);
		                    for (var z = 0, zl = rows.length; z < zl; z++) {
								var component = {};
		                        rowId = z + 1;
		                        compId = jQuery(rows[z]).attr('id');
								compObj = MP_Util.GetCompObjByStyleId(compId);
								component.id = compObj.getComponentId();
								component.reportId = compObj.getReportId();
								component.label = compObj.getLabel();
								if(compObj.getColumn() !== 99) {
									component.group_seq = 1;
									component.col_seq = colId;
									component.row_seq = rowId;
								}
								else {
									component.group_seq = 0;
									component.col_seq = 99;
									component.row_seq = rowId;
								}
								if(compObj.getCompColor()) {
									component.compThemeColor = compObj.getCompColor();
								}
								component.grouperFilterLabel = compObj.getGrouperFilterLabel();
								component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
								component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
								component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
								component.selectedTimeFrame = compObj.getSelectedTimeFrame();
								component.selectedDataGroup = compObj.getSelectedDataGroup();
		                        if (jQuery(rows[z]).hasClass('closed')) {
		                            component.expanded = false;
		                        }
		                        else { 
		                            component.expanded = true;
		                        }
		                        views[viewIndex].components.push(component);
		                    }
		                }
		            }
		        }
			}
		    WritePreferences(jsonObj);
		    m_jsonObject = jsonObj;
		},
		SaveViewpointPreferences:function(vpNameKey, vwpObj){
			WriteViewpointPreferences(vwpObj.VIEWS,vpNameKey);
		},
		SaveQOCPreferences:function(jsonObj){
			m_prefIdent = "MP_COMMON_ORDERS_V4";
			m_criterion.category_mean = "MP_COMMON_ORDERS_V4";
			WritePreferences(jsonObj);
		},
        GetQOCPreferences: function(){
            if (!m_criterion) {
                alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
                return null;
            }
			//if this jsonObject is defined but is for a different view
			if(m_jsonObject){
				if (!m_jsonObject.user_prefs.page_prefs.views) {
					m_jsonObject = null;
				}
			}
            if (!m_jsonObject){
            	m_prefIdent = "MP_COMMON_ORDERS_V4";
            	m_criterion.category_mean = "MP_COMMON_ORDERS_V4";
                this.LoadPreferences();
            }
            
            return m_jsonObject;
        },
		ClearPreferences: function(){
			WritePreferences(null);
			var cclParams = [];
			if(typeof m_viewpointJSON == "undefined"){
				cclParams = ["^MINE^", m_criterion.person_id + ".0", m_criterion.encntr_id + ".0", m_criterion.provider_id + ".0", m_criterion.position_cd + ".0", m_criterion.ppr_cd + ".0", "^" + m_criterion.executable + "^", "^^", "^" + m_criterion.static_content.replace(/\\/g, "\\\\") + "^", "^" + m_criterion.category_mean + "^", m_criterion.debug_ind];
				CCLLINK("MP_DRIVER", cclParams.join(","), 1 );
			}
			else {
				var viewpointJSON = JSON.parse(m_viewpointJSON).VIEWPOINTINFO_REC;
				cclParams = ["^MINE^", m_criterion.person_id + ".0", m_criterion.encntr_id + ".0", m_criterion.provider_id + ".0", m_criterion.position_cd + ".0", m_criterion.ppr_cd + ".0", "^" + m_criterion.executable + "^", "^" + m_criterion.static_content.replace(/\\/g, "\\\\") + "^", "^" + viewpointJSON.VIEWPOINT_NAME_KEY + "^", m_criterion.debug_ind, "^^", 0, "^" + viewpointJSON.ACTIVE_VIEW_CAT_MEAN + "^"];
				CCLLINK(CERN_driver_script, cclParams.join(","), 1 );
			}
		},
        /**
         * Returns the json object associated to the primary div id of the component.  It is assumed LoadPreferences has been called prior to execution
         * @param {Object} id
         */
        GetComponentById: function(id){
            if (m_jsonObject) {
                var components = m_jsonObject.user_prefs.page_prefs.components;
                for (var x = components.length; x--;) {
                    var component = components[x];
                    if (component.id == id){ 
                        return component;
                    }
                }
            }
            return null;
        }
	};
    function WriteViewpointPreferences(jsonObject, viewpointNameKey, successMessage){
		var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
		info.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200) {
				MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "WriteViewpointPreferences");
				var jsonEval = JSON.parse(this.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS == "Z") {
					m_jsonObject = null;
				}
				else if (recordData.STATUS_DATA.STATUS == "S") {
					m_jsonObject = jsonObject;
					if (successMessage && successMessage.length > 0){
						alert(successMessage);
					}
				}
				else {
					MP_Util.LogScriptCallError(null, this, "mp_core.js", "WriteViewpointPreferences");
					var errAr = [];
					var statusData = recordData.STATUS_DATA;
					errAr.push("STATUS: " + statusData.STATUS);
					for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
						var ss = statusData.SUBEVENTSTATUS[x];
						errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
					}
					window.status = "Error saving viewpoint user preferences: " + errAr.join(",");
				}
			}
			if (this.readyState == 4) {
				MP_Util.ReleaseRequestReference(this);
			}
		};
		
		var sJson = (jsonObject != null) ? JSON.stringify(jsonObject) : "";
		var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + viewpointNameKey + "^", "~" + sJson + "~"];
		if(CERN_BrowserDevInd){
			var url = "MP_MAINTAIN_USER_PREFS?parameters=" + ar.join(",");
			info.open('GET', url, false);
			info.send(null);
		}
		else{
			info.open('GET', "MP_MAINTAIN_USER_PREFS", false);
			info.send(ar.join(","));
		}
	}
    function WritePreferences(jsonObject, successMessage){
        var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
        info.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
				MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "WritePreferences");
                var jsonEval = JSON.parse(this.responseText);
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS == "Z") {
                    m_jsonObject = null;
                }
                else if (recordData.STATUS_DATA.STATUS == "S") {
                    m_jsonObject = jsonObject;
                    if (successMessage && successMessage.length > 0){
                        alert(successMessage);
                    }
                }
                else {
					MP_Util.LogScriptCallError(null, this, "mp_core.js", "WritePreferences");
                    var errAr = [];
                    var statusData = recordData.STATUS_DATA;
					errAr.push("STATUS: " + statusData.STATUS);
                    for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                        var ss = statusData.SUBEVENTSTATUS[x];
                        errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                    }
					window.status = "Error saving user preferences: " + errAr.join(",");
                }
            }
            if (this.readyState == 4) {
                MP_Util.ReleaseRequestReference(this);
            }
		};
        
        var sJson = (jsonObject != null) ? JSON.stringify(jsonObject) : "";
        var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^", "~" + sJson + "~"];
        if(CERN_BrowserDevInd){
        	var url = "MP_MAINTAIN_USER_PREFS?parameters=" + ar.join(",");
			info.open('GET', url, false);
			info.send(null);
        }
        else{
        	info.open('GET', "MP_MAINTAIN_USER_PREFS", false);
        	info.send(ar.join(","));
        }
    }
}();

/**
 * @namespace
 */
var MP_Util = function() {
	var m_df = null;
	var m_nf = null;
	var m_codeSets = [];
	return {
		/**
		 * Helper utility to retrieve the <code>Criterion</code> Object generated from the provide JSON
		 * @param js_criterion [REQUIRED] The JSON associated to the criterion data that is to be loaded
		 * @param static_content [REQUIRED] The <code>String</code> location in which the static content resides
		 */
		GetCriterion : function(js_criterion, static_content){
			MP_Util.LogDebug("Criterion: " + JSON.stringify(js_criterion));
			var jsCrit = js_criterion.CRITERION;
			var criterion = new MP_Core.Criterion(jsCrit, static_content);
			var codeArray = MP_Util.LoadCodeListJSON(jsCrit.CODES);
			var jsPatInfo = jsCrit.PATIENT_INFO;
			var patInfo = new MP_Core.PatientInformation();
            var jsPeriopCases = jsCrit.PERIOP_CASE;
            var oPeriopCases = new MP_Core.PeriopCases();
			patInfo.setSex(MP_Util.GetValueFromArray(jsPatInfo.SEX_CD, codeArray));
			if (jsPatInfo.DOB != ""){
				var dt = new Date();
				dt.setISO8601(jsPatInfo.DOB);
				patInfo.setDOB(dt);
			}
			criterion.setPatientInfo(patInfo);
			oPeriopCases.setCaseID(jsPeriopCases.CASE_ID);
			oPeriopCases.setDays(jsPeriopCases.DAYS);
			oPeriopCases.setHours(jsPeriopCases.HOURS);
			oPeriopCases.setMins(jsPeriopCases.MINS);
			oPeriopCases.setCntdwnDscFlg(jsPeriopCases.CNTDWN_DESC_FLAG);
			criterion.setPeriopCases(oPeriopCases);
			return criterion;
		},
		
		/**
		 * Calculates the lookback date based on the current date and time
		 * @param lookbackDays [REQUIRED] The number of days to look back in time
		 * @return <code>Date</code> Object representing the lookback date and time
		 */
		CalcLookbackDate : function(lookbackDays){
			var retDate = new Date();
			var hrs = retDate.getHours();
			hrs -= (lookbackDays*24);
			retDate.setHours(hrs);
			return retDate;
		},
		/**
		 * Calculates the within time from the provide date and time.
		 * @param dateTime [REQUIRED] The <code>Date</code> Object in which to calculate the within time
		 * @return <code>String</code> representing the time that has passed from the provided date and time
		 */
		CalcWithinTime : function(dateTime) {
			return (GetDateDiffString(dateTime, null, null, true));
		},
		/**
		 * Calculates the age of a patient from a given point in time.  If the point in time is not provided, the current date/time is utilized
		 * @param birthDt [REQUIRED] The <code>Date</code> Object in which to calculate the age of the patient
		 * @param fromDate [OPTIONAL] The <code>Date</code> Object in which to calculate the age of the patient from.  This is useful in cases
		 * where the patient is deceased and the date utilized is the deceased date.
		 * @return <code>String</code> representing the age of the patient
		 */
		CalcAge : function(birthDt, fromDate) {
			//If from Date is null (not passed in) then set to current Date
			fromDate = (fromDate) ? fromDate : new Date();
			return(GetDateDiffString(birthDt, fromDate, 1, false));
		},
		/**
		 * Display the date and time based on the configuration of the component
		 * @param component [REQUIRED] The component in which holds the configuration for the date formatting
		 * @param date [REQUIRED] The date in which to properly format
		 * @return <code>String</code> representing the date and time of the date provided
		 */
        DisplayDateByOption: function(component, date){
			var df = MP_Util.GetDateFormatter();
			var dtFormatted = "";
			switch (component.getDateFormat()) {
				case 1:
					return (df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR));
				case 2:
					return (df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR));
				case 3:
					return (MP_Util.CalcWithinTime(date));
				case 4:
					//Display No Date.  Additional logic will need to be applied to hide column.
					return ("&nbsp");
				default:
					return df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
			}
		},	
		DisplaySelectedTab: function(showDiv, anchorId){
			var i = 0;
			if(window.name == "a-tab0") {//first tab is default
				window.name = "";
			}
			else {
				window.name = showDiv+','+anchorId;
			}
			var body = document.body;
			var divs = Util.Style.g("div-tab-item", body);
			for( i = divs.length; i--; ) {
				if (divs[i].id == showDiv) {
					divs[i].style.display = 'block';
				}
				else {
					divs[i].style.display = 'none';
				}
			}
			
			var anchors = Util.Style.g("anchor-tab-item", body);
			for( i = anchors.length; i--; ) {
				if (anchors[i].id == anchorId) {
					anchors[i].className = "anchor-tab-item active";
				}
				else {
					anchors[i].className = "anchor-tab-item inactive";
				}
			}
			
			//remove initial Customize anchor href
			var custNode = _g("custView");
			if (custNode != null) {
				custNode.href = "";
				custNode.innerHTML = "";
			}
			
			for (var yl = CERN_TabManagers.length; yl--;) {
				var tabManager = CERN_TabManagers[yl];
				var tabItem = tabManager.getTabItem();
				if (tabItem.key == showDiv) {
					tabManager.loadTab();
					tabManager.setSelectedTab(true);
					var components = tabItem.components;
					if (components != null && components.length > 0) {
						for (var xl = components.length; xl--;) {
							var component = components[xl];
							MP_Util.Doc.AddCustomizeLink(component.getCriterion());
							break;
						}
					}
				}
				else {
					tabManager.setSelectedTab(false);
				}
			}
		},
		DisplaySelectedTabQOC: function(showDiv, anchorId, noViewSaved){
			var i = 0;
			var firstTimeLoadingMPage = false;
			if(noViewSaved) {
				var dropDownList = _g("viewListSelectorID");
				if(dropDownList.options[dropDownList.options.length - 1].value == "Blank_Space") {
					dropDownList.remove(dropDownList.options.length-1);
					firstTimeLoadingMPage = true;//sort of a quick fix, but desperate times call for desperate measures
					//on intitial load with no last saved view in user prefs, the noViewsSaved variable will always
					//be true until the user refreshes the page. The only time no view has been saved is the time we 
					//delete the Blank_Space from the view selector.
				}
				
				var noSavedViewsStatement = _g("noSavedViews");
				if(!Util.Style.ccss(noSavedViewsStatement, "hidden")) {
					Util.Style.acss(noSavedViewsStatement, "hidden");
				}
			}
			
			if(window.name == "a-tab0")				//first tab is default
			{
				window.name = "";
			}
			else {
				window.name = showDiv+','+anchorId;
			}
			var body = document.body;
			var divs = Util.Style.g("div-tab-item", body);
			for( i = divs.length; i--; ) {
				if (divs[i].id == showDiv) {
					divs[i].style.display = 'block';
					if(Util.Style.ccss(divs[i], "div-tab-item-not-selected")) {
						Util.Style.rcss(divs[i], "div-tab-item-not-selected");
						Util.Style.acss(divs[i], "div-tab-item-selected");
					}
				}
				else {
					divs[i].style.display = 'none';
					if(Util.Style.ccss(divs[i], "div-tab-item-selected")) {
						Util.Style.rcss(divs[i], "div-tab-item-selected");
						Util.Style.acss(divs[i], "div-tab-item-not-selected");
					}
				}
			}
			
			var anchors = Util.Style.g("anchor-tab-item", body);
			for( i = anchors.length; i--; ) {
				if (anchors[i].id == anchorId) {
					anchors[i].className = "anchor-tab-item active";
				}
				else {
					anchors[i].className = "anchor-tab-item inactive";
				}
			}
			
			//remove initial Customize anchor href
			var custNode = _g("custView");
			if (custNode) {
				custNode.href = "";
				custNode.innerHTML = "";
			}
			
			for (var yl = CERN_TabManagers.length; yl--;) {
				var tabManager = CERN_TabManagers[yl];
				var tabItem = tabManager.getTabItem();
				if (tabItem.key == showDiv) {
					tabManager.loadTab();
					tabManager.setSelectedTab(true);
					
					//grab user preferences, and then save back preferences with updated last saved view
					var jsonObj = MP_Core.AppUserPreferenceManager.GetQOCPreferences();
					var userPrefs,pagePrefs,views,lastSavedView;
					if(jsonObj) {
						userPrefs = jsonObj.user_prefs;
						pagePrefs = userPrefs.page_prefs;
					    views = pagePrefs.views;
						pagePrefs.last_saved_view = tabItem.name;
					}
					else {
						jsonObj = {};
					    userPrefs = jsonObj.user_prefs = {};
					    pagePrefs = userPrefs.page_prefs = {};
					    views = pagePrefs.views = [];
					    lastSavedView = pagePrefs.last_saved_view = tabItem.name;	
					}
					var viewsLength = views.length;
					var newView = {};
					newView.label = tabItem.name;
					newView.components = [];
					if (viewsLength === 0){
					    views.push(newView);
					}
					else{
						var alreadyAddedView = false;
						for (var j = viewsLength; j--;) {
							var currentViewName = views[j].label;
							if (currentViewName === newView.label){
								alreadyAddedView = true;
								break;
							}
						}
						if (!alreadyAddedView){
							views.push(newView);
						}
					}

					MP_Core.AppUserPreferenceManager.SaveQOCPreferences(jsonObj);
					var criterion;
					var components = tabItem.components;
					if (components != null && components.length > 0) {
						for (var xl = components.length; xl--;) {
							var component = components[xl];
							criterion = component.getCriterion();
							MP_Util.Doc.AddCustomizeLink(criterion);
							break;
						}
					}
					MP_Util.Doc.InitQOCDragAndDrop(tabItem.key);
					var categoryMeaning = "MP_COMMON_ORDERS_V4";
					if (noViewSaved && firstTimeLoadingMPage){
						MP_Util.Doc.CreateQOCPageMenu(tabItem.key, categoryMeaning, criterion);
					}
					else{
						//since page menu has already been created, update column View Layout selection
						var vpParent = "#" + tabItem.key + " ";
						var initialColCnt;
						var curColGroupClass = $(vpParent + '.col-group:last').attr('class').replace("col-group ", "");
						switch (curColGroupClass) {
							case "five-col":
								initialColCnt = 5;
								break;
							case "four-col":
								initialColCnt = 4;
								break;
							case "three-col":
								initialColCnt = 3;
								break;
							case "two-col":
								initialColCnt = 2;
								break;
							case "one-col":
								initialColCnt = 1;
								break;
						}
						var menuId = "pageMenu" + categoryMeaning;
		    			$("#optMenuConfig" + menuId + " div").removeClass("view-layout-selected");
		    			$("#optMenuConfig" + menuId + " div.view-layout" + initialColCnt).addClass("view-layout-selected");
		    			
		    			//Update the Drag and Drop toggle display
		    			//Get the current view dom element
		    			var currentView = $("#" + showDiv);
		    			//Determine if drag and drop is currently active
		    			var dragAndDropEnabled = false;
		    			if(currentView.length){
		    				dragAndDropEnabled = $(currentView).hasClass("qoc-dnd-enabled");
		    			}
		    			//Update the page menu option
		    			$("#optsDNDTogglepageMenuMP_COMMON_ORDERS_V4").html((dragAndDropEnabled) ? i18n.DRAG_AND_DROP_DISABLE : i18n.DRAG_AND_DROP_ENABLE);
		    			
					}
				}
				else {
					tabManager.setSelectedTab(false);
				}
			}
		},
		OpenTab: function(compId){
			for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
				var comp = CERN_MPageComponents[x];
				var styles = comp.getStyles();
				if (styles.getId() == compId) {
					comp.openTab();
				}
			}
		},
		OpenIView: function(compId){
			var comp = MP_Util.GetCompObjByStyleId(compId);
			comp.openIView();
		},
		LaunchMenuSelection: function(compId, menuItemId){
			//get the exact component from global array
			for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
				var comp = CERN_MPageComponents[x];
				var crit = comp.getCriterion();
				var styles = comp.getStyles();
				if (styles.getId() == compId) {
					//found
					comp.openDropDown(menuItemId);
					break;
				}
			}
			
		},
		LaunchIViewMenuSelection: function(compId, bandName, sectionName, itemName){
			var rootId = parseInt(compId,10);
			var component = MP_Util.GetCompObjById(rootId);
			var criterion = component.getCriterion();
			var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
			launchIViewApp.LaunchIView(bandName, sectionName, itemName, criterion.person_id, criterion.encntr_id);
		},
		LaunchMenu: function(menuId, componentId){
			var menu = _g(menuId);
			MP_Util.closeMenuInit(menu, componentId);
			if (menu != null) {
				if (Util.Style.ccss(menu, "menu-hide")) {
					_g(componentId).style.zIndex = 2;
					Util.Style.rcss(menu, "menu-hide");
				}
				else {
					_g(componentId).style.zIndex = 1;
					Util.Style.acss(menu, "menu-hide");
				}
			}
		},
		LaunchLookBackSelection:function(compId, lookBackUnits, lookBackType){
			var i18nCore=i18n.discernabu;
		    var rootId = parseInt(compId, 10);
		    var component = MP_Util.GetCompObjById(rootId);
		    var style = component.getStyles();
			var ns = style.getNameSpace();
			var scope = component.getScope();
			var displayText = "";
			var lbtVal = parseInt(lookBackType,10);
			
			if (component.getLookbackUnits() !== lookBackUnits || component.getLookbackUnitTypeFlag() !== lbtVal) {
				component.setLookbackUnits(lookBackUnits);
				component.setLookbackUnitTypeFlag(lbtVal);
				
				if(scope>0){
					if(lookBackUnits > 0 && lbtVal > 0) {
						var newText ="";
						switch(lbtVal){
							case 1:
								newText = i18nCore.LAST_N_HOURS.replace("{0}", lookBackUnits);
							break;
							case 2:
								newText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
							break;
							case 3:
								newText = i18nCore.LAST_N_WEEKS.replace("{0}", lookBackUnits);
							break;
							case 4:
								newText = i18nCore.LAST_N_MONTHS.replace("{0}", lookBackUnits);
							break;
							case 5:
								newText = i18nCore.LAST_N_YEARS.replace("{0}", lookBackUnits);
							break;
							default:
								newText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
							break;
						}
						switch(scope){
							case 1:
								displayText = i18nCore.ALL_N_VISITS.replace("{0}", newText);
							break;
							case 2:
								displayText = i18nCore.SELECTED_N_VISIT.replace("{0}", newText);
							break;
						}
					}
					else {
						switch(scope) {
							case 1:
								displayText = i18nCore.All_VISITS;
								break;
							case 2:
								displayText = i18nCore.SELECTED_VISIT;
								break;
						}
					}
				}
			
				MP_Util.Doc.CreateLookBackMenu(component, 2, displayText);
				
				if (ns === "lab" || ns === "dg" || ns === "ohx" || ns === "ohx2") {
					component.getSectionContentNode().innerHTML = "";
				}
				if(component.isResourceRequired()){
					component.RetrieveRequiredResources();
				}
				else{
				    component.InsertData();						
				}
			}
		},
		LaunchCompFilterSelection:function(compId, filterLabel, eventSetIndex, applyFilterInd){
			var component = MP_Util.GetCompObjById(compId);
			var i18nCore = i18n.discernabu;
			var mnuDisplay = filterLabel;
			var dispVar = i18nCore.FACILITY_DEFINED_VIEW;
			var style = component.getStyles();
			var ns = style.getNameSpace();
			var styleId = style.getId();
			var loc = component.getCriterion().static_content;
			var mnuId = styleId+"TypeMenu";
			var z = 0;
			
			if (ns === "ohx" || ns === "ohx2") {
				var catCodeList = component.getGrouperCatalogCodes(eventSetIndex);
			} else {
				var eventSetList = component.getGrouperCriteria(eventSetIndex);
			}
			
			
			//Set component prefs variables with filter settings
			if (ns === "ohx" || ns === "ohx2") {
				component.setGrouperFilterCatLabel(filterLabel);
			} else {
				component.setGrouperFilterLabel(filterLabel);
			}
			if(filterLabel !== dispVar) {
				
				if (ns === "ohx" || ns === "ohx2") {
					component.setGrouperFilterCatalogCodes(catCodeList);
				} else {
					component.setGrouperFilterCriteria(eventSetList);
				}
				
			}
			else {
				component.setGrouperFilterCriteria(null);
				component.setGrouperFilterCatalogCodes(null);
			}
			
			//Find Filter Applied msg span and replace it only if the Facility defined view is not selected
			var filterAppliedSpan = _g("cf"+compId+"msg");
			if (filterAppliedSpan){
				// Remove the old span element
				Util.de(filterAppliedSpan);
			}
			if(filterLabel !== dispVar) {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf",compId,"msg' class='filter-applied-msg' title='",filterLabel,"'>",i18nCore.FILTER_APPLIED,"</span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join(''); 
				var lbDropDownDiv = _g("lbMnuDisplay"+compId);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}
			else {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf",compId,"msg' class='filter-applied-msg' title=''></span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join(''); 
				var lbDropDownDiv = _g("lbMnuDisplay"+compId);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}
			
			//Find the content div
			var contentDiv = _g("Accordion"+compId+"ContentDiv");
			contentDiv.innerHTML = "";
			
			//Create the new content div innerHTML with the select list
			var contentDivArr = [];
			contentDivArr.push("<div id='cf",mnuId,"' class='acc-mnu'>");
			contentDivArr.push("<span id='cflabel",compId,"' onclick='MP_Util.LaunchMenu(\"",mnuId,"\", \"",styleId,"\");'>",i18nCore.FILTER_LABEL,mnuDisplay,"<a id='compFilterDrop",compId,"'><img src='", loc,"/images/3943_16.gif'></a></span>");
			contentDivArr.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='",mnuId,"'><div class='acc-mnu-contentbox'>");
			contentDivArr.push("<div><span id='cf",styleId,"' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(",compId,",\"",dispVar,"\",\"\",1);'>",i18nCore.FACILITY_DEFINED_VIEW,"</span></div>");
			var groupLen = component.m_grouper_arr.length;
			for(z = 0; z < groupLen; z++) {
				if(component.getGrouperLabel(z)) {
					var esIndex = z;
					contentDivArr.push("<div><span id='cf",styleId,z,"' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(",compId,",\"",component.getGrouperLabel(z),"\",",esIndex,",1);'>",component.getGrouperLabel(z),"</span></div>");
				}
				if(component.getGrouperCatLabel(z)) {
					var esIndex = z;
					contentDivArr.push("<div><span id='cf",styleId,z,"' class='lb-mnu' onclick='MP_Util.LaunchCompFilterSelection(",compId,",\"",component.getGrouperCatLabel(z),"\",",esIndex,",1);'>",component.getGrouperCatLabel(z),"</span></div>");
				}
			}
			contentDivArr.push("</div></div></div>");
			contentDiv.innerHTML = contentDivArr.join('');
			
			if(applyFilterInd === 1){
				if(filterLabel === i18nCore.FACILITY_DEFINED_VIEW){
					if(component.isResourceRequired()){
						component.RetrieveRequiredResources();
					}
					else{
					    component.InsertData();						
					}
				} else {
					
					if (ns === "ohx" || ns === "ohx2") {
						component.FilterRefresh(filterLabel, catCodeList);
					} else {
						component.FilterRefresh(filterLabel, eventSetList);
					}
					
				}
			}
		},
		LaunchViewMenu: function(menuId){
			var menu = _g(menuId);
			MP_Util.closeViewMenuInit(menu);
			if (menu) {
				if (Util.Style.ccss(menu, "menu-hide")) {
					_g(menu.id).style.zIndex = 2;
					Util.Style.rcss(menu, "menu-hide");
				}
				else {
					_g(menu.id).style.zIndex = 1;
					Util.Style.acss(menu, "menu-hide");
				}

				//change position of viewpoint menu if chart search enabled
				var js_viewpoint = JSON.parse(m_viewpointJSON);
				if (parseInt(js_viewpoint.VIEWPOINTINFO_REC.CS_ENABLED, 10)) {		
					var sec = _g("viewDrop"); 
					var ofs = Util.goff(sec);				
					menu.style.left = (ofs[0] - 5) + "px";
					menu.style.top = (ofs[1] + 24) + "px";
				}
			}
		},
		closeViewMenuInit : function(inMenu) {
			var menuId = inMenu.id;
			var e = window.event;
			
			var menuLeave = function(e){
				if (!e){ 
					var e = window.event;
				}
				var relTarg = e.relatedTarget || e.toElement;
				if (e.relatedTarget.id == inMenu.id) {
					Util.Style.acss(inMenu, "menu-hide");
				}
				e.stopPropagation();
				Util.cancelBubble(e);
			};
			
			if (window.attachEvent) {
				Util.addEvent(inMenu, "mouseleave", function(){
					Util.Style.acss(inMenu, "menu-hide");
				});
			}
			else {
				Util.addEvent(inMenu, "mouseout", menuLeave);
			}
		},
		closeMenuInit: function(inMenu, compId){
			var menuId;
			var docMenuId = compId + "Menu";
			var lbMenuId = compId+"Mnu";
			var cfMenuId=compId+"TypeMenu";
			
			var menuLeave = function(e){
				if (!e){ 
					var e = window.event;
				}
				var relTarg = e.relatedTarget || e.toElement;
				if (e.relatedTarget.id == inMenu.id) {
					Util.Style.acss(inMenu, "menu-hide");
				}
				e.stopPropagation();
				Util.cancelBubble(e);
			}
			
			if (inMenu.id == docMenuId || inMenu.id == lbMenuId || inMenu.id == cfMenuId) {//m2 'docMenu'
				menuId = compId;
			}
			if (!e) 
				var e = window.event;
			if (window.attachEvent) {
				Util.addEvent(inMenu, "mouseleave", function(){
					Util.Style.acss(inMenu, "menu-hide");
					_g(menuId).style.zIndex = 1;
				});
			}
			else {
				Util.addEvent(inMenu, "mouseout", menuLeave);
			}
		},
		/**
		 * Provides the ability to construct the text that is to be placed after the label of the Component.
		 * Each component defines whether or not the number of items within the component should be displayed
		 * in the title of the component.  This is a requirements decision and will have to be answered upon creation
		 * of the component.  In addition, the lookback units and scope have been moved to the
		 * subtitle text line and are no longer necessary in the title text.
		 * 
		 * The requirement is for each component to define whether or not the contract exists to display a number of items
		 * within the component header.  The reason for this contract is when 'no results found' is displayed, the count of zero
		 * must be displayed to indicate to the user if there are items within the component.  As for components who do not display
		 * a count, the user will still have to manually open the component to determine whether or not data exists.
		 * 
		 * TODO: The future thought is that in the case of 'no results found' or 'error retrieving data', an additional indicator
		 * will be added to the component in some manner to indicate the status.  This is important with components such as Laboratory
		 * and Vitals for examples where the count of items is not displayed within the title text.
		 * 
		 * @param component The {@see MPageComponent} in which to add the title text within.
		 * @param nbr The count of the list items displayed within the component
		 * @param optionalText Optional text to allow each consumer to place text within the header of the component.
		 */
		CreateTitleText: function(component, nbr, optionalText){
			var ar = [];
			if (component.isLineNumberIncluded()) {
				ar.push("(", nbr, ")");
			}
			if (optionalText && optionalText !== "") {
				ar.push(" ", optionalText)
			}
			return ar.join("");
		},
		/**
		 * A helper utility to determine if a content body should be considered scrollable
		 * @param component [REQUIRED] The component in which is being evaluated
		 * @param nbr [REQUIRED] The number of items in which to consider scrolling enabled  
		 */
		GetContentClass: function(component, nbr){
			if (component.isScrollingEnabled()) {
				var scrollNbr = component.getScrollNumber();
				if (nbr > scrollNbr && scrollNbr > 0) {
					return "content-body scrollable";
				}
			}
			return "content-body";
		},
		/**
		 * CreateTimer will create a SLA timer and start the timer prior to returning.
		 * @param {String} timerName The timer name to start
		 * @param {String} subTimerName The subtimer name to start
		 * @param {String} metaData1
		 * @param {String} metaData2
		 * @param {String} metaData3
		 */
		CreateTimer: function(timerName, subTimerName, metaData1, metaData2, metaData3){
			try {
				var slaTimer = window.external.DiscernObjectFactory("SLATIMER");
				MP_Util.LogTimerInfo(timerName, subTimerName, "SLATIMER", "mp_core.js", "CreateTimer");
			} 
			catch (err) {
				return null;
			}
			
			if (slaTimer) {
				slaTimer.TimerName = timerName;
				if (subTimerName) 
					slaTimer.SubtimerName = subTimerName;
				if (metaData1) 
					slaTimer.Metadata1 = String(metaData1);
				if (metaData2) 
					slaTimer.Metadata2 = String(metaData2);
				if (metaData3) 
					slaTimer.Metadata3 = String(metaData3);
				
				slaTimer.Start();
				return slaTimer;
			}
			else {
				return null;
			}
		},
		/**
		 * Retrieves the code values for a given code set
		 * @param codeSet [REQUIRED] The code set in which to retrieve
		 * @param async [REQUIRED] A <code>Boolean</code> value indicating to call async.  <code>TRUE</code> = yes, <code>FALSE</code> = no
		 * @return A list of code from the code set
		 */
		GetCodeSet: function(codeSet, async){
			var codes = new Array();
			var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
			info.onreadystatechange = function(){
				if (this.readyState == 4 && this.status == 200) {
					MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "GetCodeSet");
					var jsonEval = JSON.parse(this.responseText);
					if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "S") {
						codes = MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
					}
					return codes;
				}
				if (this.readyState == 4) {
					MP_Util.ReleaseRequestReference(this);
				}
				
			}
			//  Call the ccl progam and send the parameter string
			var sendVal = "^MINE^, " + codeSet + ".0";
			if(CERN_BrowserDevInd){
				var url = "MP_GET_CODESET?parameters=" + sendVal;
				info.open('GET', url, async);
				info.send(null);
			}
			else{
				info.open('GET', "MP_GET_CODESET", async);
				info.send(sendVal);
			}
			
			return codes;
		},
		/**
		 * Will return a code object from the mapped list by the cdf_meaning
		 * @param mapCodes [REQUIRED] The map of code values to search
		 * @param meaning [REQUIRED] The cdf_meaning of the code value to search
		 * @return The code object associated to the cdf_meaning provides.  Else null
		 */
		GetCodeByMeaning: function(mapCodes, meaning){
			for (var x = mapCodes.length;x--;) {
				var code = mapCodes[x].value;
				if (code.meaning == meaning) 
					return code;
			}
			return null;
		},
		GetCodeValueByMeaning: function(meaning, codeSet){
		    var codeValue = 0;
		    var list = m_codeSets[codeSet];
		    if (!list){
		        list = m_codeSets[codeSet] = MP_Util.GetCodeSet(codeSet, false);
		    }
		    if (list && list.length > 0){
		        for (var x = list.length;x--;){
		            var code = list[x].value;
		            if (code.meaning === meaning){
		                return code;
		            }
		        }
		    }
		    return null;
		},
		/**
		 * Will search for a value within the provided mapped array and return the value associated to the name/value pair
		 * @param mapItems [REQUIRED] The mapped array of items to search through
		 * @param item [REQUIRED] The item in which to search
		 * @return The value from the name/value pair
		 */
		GetItemFromMapArray: function(mapItems, item){
			for (var x = 0; x < mapItems.length; x++) {
				if (mapItems[x].name == item) 
					return mapItems[x].value;
			}
		},
		/**
		 * Add an item to the array of items associated to the map key
		 * @param mapItems [REQUIRED] The map array to search within
		 * @param key [REQUIRED] The primary key that will be searching for within the map array
		 * @param value [REQUIRED] The object that is to be added to the map array
		 */
		AddItemToMapArray: function(mapItems, key, value){
			var ar = MP_Util.GetItemFromMapArray(mapItems, key);
			if (!ar) {
				ar = []
				mapItems.push(new MP_Core.MapObject(key, ar));
			}
			ar.push(value);
		},
		LookBackTime: function(component){
			var i18nCore = i18n.discernabu;
			var remainder = 0;
			var lookbackDays = component.getLookbackDays();
			if (lookbackDays == 0) {
				return (i18nCore.SELECTED_VISIT);
			}
			else if (lookbackDays == 1) {
				return (i18nCore.LAST_N_HOURS.replace("{0}", lookbackDays * 24));
			}
			else { 
				return (i18nCore.LAST_N_DAYS.replace("{0}", lookbackDays));
			}
		},
		CreateClinNoteLink: function(patient_id, encntr_id, event_id, display, docViewerType, pevent_id){
			var docType = (docViewerType && docViewerType > "") ? docViewerType : 'STANDARD';
			var doclink = ""
			if (event_id > 0) {
				var ar = [];
				ar.push(patient_id, encntr_id, event_id,"\""+docType+"\"", pevent_id);
				doclink = "<a onclick='javascript:MP_Util.LaunchClinNoteViewer(" + ar.join(",") + "); return false;' href='#'>" + display + "</a>"		
			}
			else {
				doclink = display
			}
			return (doclink);
		},
		/**
		 * Retrieves a document for viewing via the MPages RTF viewer
		 * @param {Object} eventId The parent or child event id for retrieval
		 * @param {Object} docViewerType 
		 * 0: Parent Event Id retrieval of child event blobs
		 * 1: Event Id blob retrieval
		 * 2: Long text retrieval
		 * 3: Micro Detail retrieval
		 * 4: Anatomic Pathology retrieval
		 */
		LaunchClinNoteViewer: function(patient_id, encntr_id, event_id, docViewerType, pevent_id){
			var x = 0;
			var m_dPersonId = parseFloat(patient_id);
			var m_dEncntrId = parseFloat(encntr_id);
			var m_dPeventId = parseFloat(pevent_id);
			var viewerObj = window.external.DiscernObjectFactory("PVVIEWERMPAGE");
			MP_Util.LogDiscernInfo(null, "PVVIEWERMPAGE", "mp_core.js", "LaunchClinNoteViewer");
			try {
				switch (docViewerType) {
					case 'AP':
						viewerObj.CreateAPViewer();
						viewerObj.AppendAPEvent(event_id, m_dPeventId);
						viewerObj.LaunchAPViewer();
						break;
					case 'DOC':
						viewerObj.CreateDocViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)){
							for (var x = event_id.length; x--;){
								viewerObj.AppendDocEvent(event_id[x]);
							}
						}
						else{
							viewerObj.AppendDocEvent(event_id);
						}
						viewerObj.LaunchDocViewer();
						break;
					case 'EVENT':
						viewerObj.CreateEventViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)){
							for (var x = event_id.length; x--;){
								viewerObj.AppendEvent(event_id[x]);
							}
						}
						else{
							viewerObj.AppendEvent(event_id);
						}
						viewerObj.LaunchEventViewer();
						break;
					case 'MICRO':
						viewerObj.CreateMicroViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)){
							for (var x = event_id.length; x--;){
								viewerObj.AppendMicroEvent(event_id[x]);
							}
						}
						else{
							viewerObj.AppendMicroEvent(event_id);
						}
						viewerObj.LaunchMicroViewer();
						break;
					case 'GRP':
						viewerObj.CreateGroupViewer();
						if (MP_Util.IsArray(event_id)){
							for (var x = event_id.length; x--;){
								viewerObj.AppendGroupEvent(event_id[x]);
							}
						}
						else{
							viewerObj.AppendGroupEvent(event_id);
						}
						viewerObj.LaunchGroupViewer();
						break;
					case 'PROC':
						viewerObj.CreateProcViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)){
							for (var x = event_id.length; x--;){
								viewerObj.AppendProcEvent(event_id[x]);
							}
						}
						else{
							viewerObj.AppendProcEvent(event_id);
						}
						viewerObj.LaunchProcViewer();
						break;
					case 'HLA':
						viewerObj.CreateAndLaunchHLAViewer(m_dPersonId, m_dEventId);
						break;
					case 'NR':
						viewerObj.LaunchRemindersViewer(event_id);
						break;
					case 'STANDARD':
						alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS);
						break;
				}
			} 
			catch (err) {
				MP_Util.LogJSError(err, null, "mp_core.js", "LaunchClinNoteViewer");
				alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS+"  "+i18n.discernabu.CONTACT_ADMINISTRATOR);
			}
			
		},
		IsArray: function(input){
			return (typeof(input)=='object'&&(input instanceof Array));
		},
		IsString: function(input){
			return (typeof(input)=='string');
		},
		HandleNoDataResponse: function(nameSpace){
			var i18nCore = i18n.discernabu;
			return ("<h3 class='info-hd'><span class='res-normal'>" + i18nCore.NO_RESULTS_FOUND + "</span></h3><span class='res-none'>" + i18nCore.NO_RESULTS_FOUND + "</span>");
		},
		HandleErrorResponse: function(nameSpace, errorMessage){
			var ar = [];
			var i18nCore = i18n.discernabu;
			var ns = (nameSpace && nameSpace.length > 0) ? nameSpace + "-" : "";
			ar.push("<h3 class='info-hd'><span class='res-normal'>", i18nCore.ERROR_RETREIVING_DATA, "</span></h3>");
			ar.push("<dl class='", ns, "info'><dd><span>", i18nCore.ERROR_RETREIVING_DATA, "</span></dd></dl>");
			//add error in hover if exists
			if (errorMessage != null && errorMessage.length > 0) {
				ar.push("<h4 class='det-hd'><span>DETAILS</span></h4><div class='hvr'><dl class='", ns, "det'><dd><span>", errorMessage, "</span></dd></dl></div>");
			}
			return ar.join("");
		},
		GetValueFromArray: function(name, array){
			if (array != null) {
				for (var x = 0, xi = array.length; x < xi; x++) {
					if (array[x].name == name) {
						return (array[x].value);
					}
				}
			}
			return (null);
		},
		GetPrsnlObjByIdAndDate: function(name, date, personnelArray){
			var prsnlObj;
			var latestPrsnlObj;
			try{
				if (personnelArray && personnelArray.length) {
					for (var x = 0, xi = personnelArray.length; x < xi; x++) {
						if (personnelArray[x].name == name) {
							prsnlObj = personnelArray[x].value;
							//If no personnel object found return the first/latest prsnl name
							if(!latestPrsnlObj){
								latestPrsnlObj = prsnlObj;
							}
							if(typeof date == "string"){
								//Convert to the correct date format for comparison
								if(/^\/Date\(/.exec(date)){
									date = /[0-9]+-[0-9]+-[0-9]+/.exec(date) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(date) + "Z";
								}
								if((date > prsnlObj.beg_dt_tm_string && date < prsnlObj.end_dt_tm_string) || date == prsnlObj.beg_dt_tm_string || date == prsnlObj.end_dt_tm_string) {
									return(prsnlObj);
								}
							}
							else{
								throw(new Error("Invalid date object passed into GetPrsnlObjByIdAndDate.  The date object must be a string."));
							}
						}
					}
					return (latestPrsnlObj);
				}
				return (null);
			}
			catch(err){
				MP_Util.LogJSError(err, null, "mp_core.js", "GetPrsnlObjByIdAndDate");
				return(null);
			}
		},
		GetCompObjById: function(id){
			var comps = CERN_MPageComponents;
			var cLen = comps.length;
			for (var i=cLen; i--;) {
				var comp = comps[i];
				if (comp.m_componentId === id) {
					return comp;
				}
			}
			return (null);
		},
		GetCompObjByStyleId:function(id){
			var cLen=CERN_MPageComponents.length;
			for(var i=cLen;i--;){
				var comp=CERN_MPageComponents[i];
				var styles=comp.getStyles();
				if(styles.getId()===id){
					return comp;
				}
			}
			return (null);
		},
		LoadCodeListJSON: function(parentElement){
			var codeArray = new Array();
			if (parentElement != null) {
				for (var x = 0; x < parentElement.length; x++) {
					var codeObject = new Object();
					codeElement = parentElement[x];
					codeObject.codeValue = codeElement.CODE;
					codeObject.display = codeElement.DISPLAY;
					codeObject.description = codeElement.DESCRIPTION;
					codeObject.codeSet = codeElement.CODE_SET;
					codeObject.sequence = codeElement.SEQUENCE;
					codeObject.meaning = codeElement.MEANING;
					var mapObj = new MP_Core.MapObject(codeObject.codeValue, codeObject);
					codeArray.push(mapObj);
				}
			}
			return (codeArray);
		},
		LoadPersonelListJSON: function(parentElement){
			var personnelArray = [];
			var codeElement;
			if (parentElement != null) {
				for (var x = 0; x < parentElement.length; x++) {
					var prsnlObj = {};
					codeElement = parentElement[x];
					prsnlObj.id = codeElement.ID;
					//If available retrieve the beg and end date and time for a prsnl name
					if(codeElement.BEG_EFFECTIVE_DT_TM){
						prsnlObj.beg_dt_tm = codeElement.BEG_EFFECTIVE_DT_TM;
						//create the string object for comparisons purposes
						prsnlObj.beg_dt_tm_string = /[0-9]+-[0-9]+-[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM) + "Z";
					}
					if(codeElement.END_EFFECTIVE_DT_TM){
						prsnlObj.end_dt_tm = codeElement.END_EFFECTIVE_DT_TM;
						//create the string object for comparisons purposes
						prsnlObj.end_dt_tm_string = /[0-9]+-[0-9]+-[0-9]+/.exec(codeElement.END_EFFECTIVE_DT_TM) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(codeElement.END_EFFECTIVE_DT_TM) + "Z";
					}
					prsnlObj.fullName = codeElement.PROVIDER_NAME.NAME_FULL;
					prsnlObj.firstName = codeElement.PROVIDER_NAME.NAME_FIRST;
					prsnlObj.middleName = codeElement.PROVIDER_NAME.NAME_MIDDLE;
					prsnlObj.lastName = codeElement.PROVIDER_NAME.NAME_LAST;
					prsnlObj.userName = codeElement.PROVIDER_NAME.USERNAME;
					prsnlObj.initials = codeElement.PROVIDER_NAME.INITIALS;
					prsnlObj.title = codeElement.PROVIDER_NAME.TITLE;
					var mapObj = new MP_Core.MapObject(prsnlObj.id, prsnlObj);
					personnelArray[x] = mapObj;
				}
			}
			return (personnelArray);
		},
        WriteToFile: function(sText){
			try {
				var ForAppending = 8;
				var TriStateFalse = 0;
				var fso = new ActiveXObject("Scripting.FileSystemObject");
				var newFile = fso.OpenTextFile("c:\\temp\\test.txt", ForAppending, true, TriStateFalse);
				newFile.write(sText);
				newFile.close();
			} 
			catch (err) {
				var strErr = 'Error:';
				strErr += '\nNumber:' + err.number;
				strErr += '\nDescription:' + err.description;
				document.write(strErr);
			}
		},
		CalculateAge: function(bdate){
			var age;
			//typecasting string to date obj
			var bdate = new Date(bdate);
			var byear = bdate.getFullYear();
			var bmonth = bdate.getMonth();
			var bday = bdate.getDate();
			var bhours = bdate.getHours();
			today = new Date();
			year = today.getFullYear();
			month = today.getMonth();
			day = today.getDate();
			hours = today.getHours();
			
			if (year == byear && (day == bday)) {
				age = hours - bhours;
				age += " Hours";
				return age;
			}
			else if (year == byear && (month == bmonth)) {
				age = day - bday;
				age += " Days";
				return age;
			}
			if (year == byear) {
				age = month - bmonth;
				age += " Months";
				return age;
			}
			else {
				if (month < bmonth) {
					age = year - byear - 1;
				}
				else if (month > bmonth) {
					age = year - byear;
				}
				else if (month == bmonth) {
					if (day < bday) {
						age = year - byear - 1;
					}
					else if (day > bday) {
						age = year - byear;
					}
					else if (day == bday) {
						age = year - byear;
					}
				}
			}
			age += " Years"
			return age;
		},
        /**
         *  Javascript string pad
         *  @see http://www.webtoolkit.info/
         **/
        pad: function(str, len, pad, dir){
			if (typeof(len) == "undefined") {
				var len = 0;
			}
			if (typeof(pad) == "undefined") {
				var pad = ' ';
			}
			if (typeof(dir) == "undefined") {
				var dir = STR_PAD_RIGHT;
			}
			
			if (len + 1 >= str.length) {
			
				switch (dir) {
				
					case STR_PAD_LEFT:
						str = Array(len + 1 - str.length).join(pad) + str;
						break;
						
					case STR_PAD_BOTH:
						var right = Math.ceil((padlen = len - str.length) / 2);
						var left = padlen - right;
						str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
						break;
						
					default:
						str = str + Array(len + 1 - str.length).join(pad);
						break;
						
				} // switch
			}
			return str;
		},

		/**
		 * Launches graph in a modal window viewable in the Powerchart framework
		 * @param patientId The person ID for the patient selected
		 * @param encntrId The encounter ID of the visit selected
		 * @param eventCode Used to plot simple results for a given patient/encounter I.e. weight,height,BMI,BUN,WBC.
		 * @param staticContent location of the static content directory that contains the core JS / CSS files needed for the graph
		 * @param groupId If item is a grouped item pass the BR_DATAMART_FILTER_ID to pull all associated results I.e. BP,Temp,or HR.
		 * @param providerId Personnel ID of the user logged into the application
		 * @param positionCd Position <code>Code</code> of the user
		 * @param pprCD Person Personnel Relationship code value
		 * @param lookBackUnits 
		 * @param lookBackType 1 = Hours, 2 = Days, 3 = Weeks, 4 = Months , 5 = Years
		 */
		GraphResults: function(eventCd, compID, groupID){
			var component=MP_Util.GetCompObjById(compID);
			var lookBackUnits = (component.getLookbackUnits() != null && component.getLookbackUnits() > 0) ? component.getLookbackUnits() : "365";
			var lookBackType = (component.getLookbackUnitTypeFlag() != null && component.getLookbackUnitTypeFlag() > 0) ? component.getLookbackUnitTypeFlag() : "2";
			var i18nCore = i18n.discernabu;
			var subTitleText = "";
			var scope = component.getScope();
			var lookBackText = "";
			var criterion = component.getCriterion();
			component.setLookbackUnits(lookBackUnits);
			component.setLookbackUnitTypeFlag(lookBackType);

			if(scope > 0) {
				switch(lookBackType) {
					case 1:
						var replaceText = i18nCore.LAST_N_HOURS.replace("{0}", lookBackUnits);
					break;
					
					case 2:
						var replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
					break;
					
					case 3:
						var replaceText = i18nCore.LAST_N_WEEKS.replace("{0}", lookBackUnits);
					break;
					
					case 4:
						var replaceText = i18nCore.LAST_N_MONTHS.replace("{0}", lookBackUnits);
					break;
					
					case 5:
						var replaceText = i18nCore.LAST_N_YEARS.replace("{0}", lookBackUnits);
					break;
					
					default:
						var replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
					break;
				}
				
				switch(scope) {
					case 1:
						lookBackText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
						  var encntrOption = "0.0";
				  break;
					case 2:
						lookBackText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
				          var encntrOption = criterion.encntr_id;
				  break;
				}
			}
			
			var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
			var sParams = "^MINE^," + criterion.person_id + ".0," + encntrOption + "," + eventCd + ".0,^" + criterion.static_content + "\\discrete-graphing^," + groupID + ".0," +criterion.provider_id + ".0," + criterion.position_cd + ".0," + criterion.ppr_cd + ".0," + lookBackUnits + "," + lookBackType + ",200,^" + lookBackText + "^";
			var graphCall = "javascript:CCLLINK('mp_retrieve_graph_results', '" + sParams + "',1)";
			MP_Util.LogCclNewSessionWindowInfo(null, graphCall, "mp_core.js", "GraphResults");
			javascript: CCLNEWSESSIONWINDOW(graphCall, "_self", wParams, 0, 1);
			Util.preventDefault();
		},
		ReleaseRequestReference: function(reqObj){
			if (!CERN_BrowserDevInd && XMLCCLREQUESTOBJECTPOINTER) {
				for (var id in XMLCCLREQUESTOBJECTPOINTER) {
					if (XMLCCLREQUESTOBJECTPOINTER[id] == reqObj) {
						delete (XMLCCLREQUESTOBJECTPOINTER[id])
					}
				}
			}
		},
		/**
		 * Message box similar to alert or confirm with customizable options. 
		 * @param msg {string} String message or html to display in message box
		 * @param title {string} [OPTIONAL] Title of the message box
		 * @param btnTrueText {string} [OPTIONAL] Text value of the true option button, will default to 'OK' if omitted.
		 * @param btnFalseText {string} [OPTIONAL] Text value of the false option button.  No false button will be created if omitted.
		 * @param falseBtnFocus {boolean} [OPTIONAL] Sets the default focus to the false button.
		 * @param cb {object} [OPTIONAL] Callback function to fire on true button click. 
		 */
		AlertConfirm: function (msg, title, btnTrueText, btnFalseText, falseBtnFocus, cb) {
				var btnTrue = "<button id='acTrueButton' data-val='1'>" + ((btnTrueText) ? btnTrueText : i18n.discernabu.CONFIRM_OK) + "</button>";
				var btnFalse = "";
				if (btnFalseText) {
					btnFalse = "<button id='acFalseButton' data-val='0'>" + btnFalseText + "</button>";
				}
				if (!title) {
					title = "&nbsp;";
				}

				var closeBox = function () {
					var btnVal = parseInt(this.getAttribute('data-val'), 10);
					$(".modal-div").remove();
					$(".modal-dialog").remove();
					$("html").css("overflow", "auto"); //reset overflow
					if(btnVal && typeof cb==="function") {
						cb();
					}
				}

				var modalDiv = Util.cep("div", {"className": "modal-div"});
				var dialog = Util.cep("div", {"className": "modal-dialog"});

				dialog.innerHTML = "<div class='modal-dialog-hd'>" + title + "</div>" + "<div class='modal-dialog-content'>" + msg + "</div>" + "<div class='modal-dialog-ft'><div class='modal-dialog-btns'>" + btnTrue + btnFalse + "</div></div>";

				var docBody = document.body;
				Util.ac(modalDiv, docBody);
				Util.ac(dialog, docBody);

				Util.addEvent(_g('acTrueButton'), "click", closeBox);
				if (btnFalseText) {
					Util.addEvent(_g('acFalseButton'), "click", closeBox);
				}

				if (falseBtnFocus && btnFalseText) {
					_g('acFalseButton').focus();
				}
				else {
					_g('acTrueButton').focus();
				}

				$("html").css("overflow", "hidden"); //disable page scrolling when modal is enabled
				$(modalDiv).height($(document).height());
		},
		/**
		 * Message box similar to alert or confirm with customizable options. 
		 * @param msg {string} String message or html to display in message box
		 * @param title {string} [OPTIONAL] Title of the message box
		 * @param btnFalseText {string} [OPTIONAL] Text value of the false option button.  No false button will be created if omitted.
		 * @param falseBtnFocus {boolean} [OPTIONAL] Sets the default focus to the false button.
		 * @param cb {object} [OPTIONAL] Callback function to fire on closing message box. 
		 */
		ActionableAlertConfirm: function (msg, title, btnFalseText, falseBtnFocus, cb) {
			var btnFalse = "";
			if (btnFalseText) {
				btnFalse = "<button id='acFalseButton' data-val='0'>" + btnFalseText + "</button>";
			}
			if (!title) {
				title = "&nbsp;";
			}

			var closeBox = function () {
				var btnVal = parseInt(this.getAttribute('data-val'), 10);
				$(".modal-div").remove();
				$(".modal-dialog-actionable").remove();
				$("html").css("overflow", "auto"); //reset overflow
				if(cb && typeof cb==="function") {
					cb();
				}
			}
			
			var modalDiv = Util.cep("div", {"className": "modal-div"});
			var dialog = Util.cep("div", {"className": "modal-dialog-actionable"});

			dialog.innerHTML = "<div class='modal-dialog-hd'>" + title + "</div><div class='modal-dialog-content'>" + msg + "</div><div id='acActionableContent' class='modal-dialog-actionable-content'></div><div class='modal-dialog-ft'><div class='modal-dialog-btns'>" + btnFalse + "</div></div>";

			var docBody = document.body;
			Util.ac(modalDiv, docBody);
			Util.ac(dialog, docBody);

			if (btnFalseText) {
				Util.addEvent(_g('acFalseButton'), "click", closeBox);
			}

			if (falseBtnFocus && btnFalseText) {
				_g('acFalseButton').focus();
			}

			$("html").css("overflow", "hidden"); //disable page scrolling when modal is enabled
			$(modalDiv).height($(document).height());
		},
		CreateAutoSuggestBoxHtml: function(component, elementId){
			var searchBoxHTML = [];
			var txtBoxId = "";
			var compNs = component.getStyles().getNameSpace();
			var compId = component.getComponentId();
			if (elementId) {
				txtBoxId = compNs + elementId + compId;
			}else {
				txtBoxId = compNs + "ContentCtrl" + compId;
			}
			
			searchBoxHTML.push("<div class='search-box-div'><form name='contentForm' onSubmit='return false'><input type='text' id='", txtBoxId ,"'"," class='search-box'></form></div>");
			return searchBoxHTML.join("");
		},
		AddAutoSuggestControl: function( component, queryHandler, selectionHandler, selectDisplayHandler, itemId){
			new AutoSuggestControl(component, queryHandler, selectionHandler, selectDisplayHandler,itemId);
		},
		RetrieveAutoSuggestSearchBox: function(component){
			var componentNamespace = component.getStyles().getNameSpace();
			var componentId = component.getComponentId();
			return _g(componentNamespace + "ContentCtrl" + componentId);
		},
		CreateParamArray:function(ar,type){
			var returnVal = (type === 1) ? "0.0" : "0";
			if (ar && ar.length > 0){
				if (ar.length > 1){
					if (type === 1){
						returnVal = "value(" + ar.join(".0,") + ".0)"
					}
					else{
						returnVal = "value(" + ar.join(",") + ")"
					}			
				}
				else{
					returnVal = (type === 1) ? ar[0] + ".0" : ar[0];
				}
			}
			return returnVal;
		},
		/**
		 * Will get the date formatter associate to the locale loaded by the driver
		 * @return The date formatter to utilize for the loaded locale
		 */
		GetDateFormatter: function(){
			if (!m_df){
				m_df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			}
			return m_df;
		},
		/**
		 * Will get the numeric formatter associate to the locale loaded by the driver
		 * @return The numeric formatter to utilize for the loaded locale
		 */
		GetNumericFormatter: function(){
			if (!m_nf) {
				m_nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
			}
			return m_nf;
		},
		/**
		 * Replaces the current MPages view with the output of the reportName script
		 */
		PrintReport: function (reportName, person_id, encounter_id){
			var paramString = "^MINE^,^" + reportName + "^," + person_id + "," + encounter_id;
			CCLLINK("pwx_rpt_driver_to_mpage",paramString,1);	
		},	
		CalculatePrecision : function(valRes){		
			var precision = 0;
			var str = (MP_Util.IsString(valRes)) ? valRes : valRes.toString();
			var decLoc = str.search(/\.(\d)/);
			if (decLoc !== -1) {
				var strSize = str.length;
				precision = strSize - decLoc - 1;
			}
			return precision;
		},
		/**
		 * Will create a date/time in the format neccessary for passing as a prompt parameter
		 */
		CreateDateParameter : function(date){
	        var day = date.getDate();
	        var month = ""
	        var rest = date.format("yyyy HH:MM:ss");
	        switch (date.getMonth()){
	            case (0):
	                month = "JAN";
	                break;
	            case (1):
	                month = "FEB";
	                break;
	            case (2):
	                month = "MAR";
	                break;
	            case (3):
	                month = "APR";
	                break;
	            case (4):
	                month = "MAY";
	                break;
	            case (5):
	                month = "JUN";
	                break;
	            case (6):
	                month = "JUL";
	                break;
	            case (7):
	                month = "AUG";
	                break;
	            case (8):
	                month = "SEP";
	                break;
	            case (9):
	                month = "OCT";
	                break;
	            case (10):
	                month = "NOV";
	                break;
	            case (11):
	                month = "DEC";
	                break;
	            default:
	                alert("unknown month");
	        }
	        return (day + "-" + month + "-" + rest);
		},
		LogDebug : function( debugString ) {
			if(debugString){
				log.debug(debugString);
			}
		},
		LogWarn : function( warnString ) {
			if(warnString){
				log.warn(warnString);
			}
		},
		LogInfo : function( infoString ) {
			if(infoString){
				log.info(infoString);
			}
		},
		LogError : function( errorString ) {
			if(errorString){
				log.error(errorString);
			}
		},		
		LogScriptCallInfo : function( component, request, file, funcName ) {
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText].join(""));
		},
		LogScriptCallError : function( component, request, file, funcName ) { 
			log.error(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText, "<br />Status: ", request.status].join(""));
		},
		LogJSError : function( err, component, file, funcName ) {
			log.error(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />JS Error", "<br />Message: ", err.message, "<br />Name: ", err.name, "<br />Number: ", (err.number & 0xFFFF), "<br />Description: ", err.description].join(""));
		},
		LogDiscernInfo : function( component, objectName, file, funcName ) {
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Discern Object: ", objectName].join(""));
		},
		LogMpagesEventInfo : function( component, eventName, params, file, funcName ){
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />MPAGES_EVENT: ", eventName, "<br />Params: ", params].join(""));
		},
		LogCclNewSessionWindowInfo : function( component, params, file, funcName ){
			log.debug(["CCLNEWSESSIONWINDOW Creation", "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Params: ", params].join(""));
		},
		LogTimerInfo: function(timerName, subTimerName, timerType, file, funcName){
			log.debug(["Timer Name: ", timerName, "<br />Subtime Name:  ", subTimerName, "<br />Timer Type: ", timerType, "<br />File: ", file, "<br />Function: ", funcName].join(""));
		},
		AddCookieProperty:function(compId, propName, propValue) {
			var cookie = CK_DATA[compId];
			if(!cookie){
				cookie = {};
			}
			cookie[propName] = propValue;
			CK_DATA[compId] = cookie;
		},
		GetCookieProperty:function(compId, propName) {
			var cookie = CK_DATA[compId];
			if(cookie && cookie[propName]){
				return cookie[propName];
			}
			else{
				return null;
			}
		},
		WriteCookie:function() {
			var cookieJarJSON = JSON.stringify(CK_DATA);
			document.cookie = 'CookieJar=' + cookieJarJSON + ';';
		},
		RetrieveCookie:function() {
			var cookies = document.cookie;
			var match = cookies.match(/CookieJar=({[^;]+})(;|\b|$)/);
			if(match && match[1]) {
				CK_DATA = JSON.parse(match[1]);
			}
		}
	};
	/**
	 * Calculates difference between two dates given and returns string with appropriate units
	 * If no endDate is given it is assumed the endDate is the current date/time
	 * 
	 * @param beginDate [REQUIRED] Begin <code>Date</code> for Calculation
	 * @param endDate [OPTIONAL] End <code>Date</code> for Calculation
	 * @param mathFlag [OPTIONAL] <code>Integer</code> Flag to determine if Math.Ceil or Math.Floor is used defaults to Math.floor 1 = Floor, 0 = Ceil		
	 * @param abbreviateFlag [REQUIRED] <code>Boolean</code> to determine if shortened versions of Month,Year,Weeks,Days should be used such as in the case of a within string					
	 */
	function GetDateDiffString(beginDate, endDate, mathFlag, abbreviateFlag){
			var i18nCore = i18n.discernabu;
			var timeDiff = 0;
			var returnVal = "";
			//Set endDate to current time if it's not passed in
			endDate = (!endDate) ? new Date() : endDate;
			mathFlag = (!mathFlag) ? 0 : mathFlag;
			var one_minute = 1000*60;
			var one_hour = one_minute*60;
			var one_day = one_hour*24;
			var one_week = one_day*7;
			
	 		var valMinutes = 0;
			var valHours = 0;
			var valDays = 0;
			var valWeeks = 0;
			var valMonths = 0;
			var valYears = 0;
		//time diff in milliseconds
		timeDiff = (endDate.getTime() - beginDate.getTime());
			
			//Choose if ceiling or floor should be applied
			var mathFunc = null;
			var comparisonFunc = null;
			if (mathFlag == 0) {
				mathFunc = function(val){
					return Math.ceil(val);
				}
				comparisonFunc = function(lowerVal, upperVal){
					return( lowerVal <= upperVal);
				}
			}
			else{
				mathFunc = function(val){
					return Math.floor(val);
				}
				comparisonFunc = function(lowerVal, upperVal){
					return( lowerVal < upperVal);
				}
			}
			
			var calcMonths = function () {
				var removeCurYr = 0;
				var removeCurMon = 0;
				var yearDiff = 0;
				var monthDiff = 0;
				var dayDiff = endDate.getDate();
				if(endDate.getMonth() > beginDate.getMonth()) {
					monthDiff = endDate.getMonth() - beginDate.getMonth();
					if(endDate.getDate() < beginDate.getDate()) {
						removeCurMon = 1;
					}
				}
				else if (endDate.getMonth() < beginDate.getMonth()) {
					monthDiff = 12 - beginDate.getMonth() + endDate.getMonth();
					removeCurYr = 1;
					if(endDate.getDate() < beginDate.getDate()) {
						removeCurMon = 1;
					}
				}
				else if(endDate.getDate() < beginDate.getDate()) {
					removeCurYr = 1;
					monthDiff = 11;
				}
				
				
				if(endDate.getDate() >= beginDate.getDate()) {
					dayDiff = endDate.getDate() - beginDate.getDate();
				}
			
				yearDiff = (endDate.getFullYear() - beginDate.getFullYear()) - removeCurYr;
				//days are divided by 32 to ensure the number will always be less than zero
				monthDiff += (yearDiff*12) + (dayDiff/32) - removeCurMon;
				
				return monthDiff;
			};
			
			valMinutes = mathFunc(timeDiff / one_minute);
			valHours = mathFunc(timeDiff / one_hour);
			valDays = mathFunc(timeDiff / one_day);
			valWeeks = mathFunc(timeDiff / one_week);
			valMonths = calcMonths();
			valMonths = mathFunc(valMonths);
			valYears = mathFunc(valMonths/12);

		 
			if (comparisonFunc(valHours,2))		//Less than 2 hours, display number of minutes. Use abbreviation of "mins". 
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_MINS.replace("{0}", valMinutes)): (i18nCore.X_MINUTES.replace("{0}", valMinutes));
			else if (comparisonFunc(valDays,2)) 	//Less than 2 days, display number of hours. Use abbreviation of "hrs". 
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_HOURS.replace("{0}", valHours)) : (i18nCore.X_HOURS.replace("{0}", valHours));
			else if (comparisonFunc(valWeeks,2))	//Less than 2 weeks, display number of days. Use "days".
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_DAYS.replace("{0}", valDays)) : (i18nCore.X_DAYS.replace("{0}", valDays)) ;
			else if (comparisonFunc(valMonths,2))	//Less than 2 months, display number of weeks. Use abbreviation of "wks".
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_WEEKS.replace("{0}", valWeeks)) : (i18nCore.X_WEEKS.replace("{0}", valWeeks));
			else if (comparisonFunc(valYears,2))	//Less than 2 years, display number of months. Use abbreviation of "mos".
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_MONTHS.replace("{0}", valMonths)) : (i18nCore.X_MONTHS.replace("{0}", valMonths)) ;
			else 					//Over 2 years, display number of years.  Use abbreviation of "yrs".
				returnVal = abbreviateFlag ? (i18nCore.WITHIN_YEARS.replace("{0}", valYears)) : (i18nCore.X_YEARS.replace("{0}", valYears));

			return (returnVal);
	}
}();

/**
 * @namespace
 */
MP_Util.Doc = function() {
	var isExpandedAll = false;
	var openAccordion = '';
	
	return {
		/**
		 * Initialized the page based on a configuration of multiple MPage objects
		 * @param {Array} arMapObjects Array of the MPages to initialize the tab layout.
		 * @param {String} title The title to be associated to the page.
		 * @param {int} displayType How multiple MPages will be displayed.  Default is tab layout.
		 * @param {String} criterionGroup If InitSelectorLayout is called this is a parent group for multiple MPage Views.
		 */
		InitMPageTabLayout : function(arMapObjects, title, displayType, criterionGroup) {
			var arItems = [];
			var sc = "", helpFile = "", helpURL = "", debugInd = false;
			var bDisplayBanner = false;
			var criterion = null;
			var custInd = true;
			var anchorArray = null;
			
			for (var x=0,xl=arMapObjects.length;x<xl;x++){
				var key = arMapObjects[x].name;
				var page = arMapObjects[x].value;
				criterion = page.getCriterion();
				arItems.push(new MP_Core.TabItem(key, page.getName(), page.getComponents(), criterion.category_mean))
				sc = criterion.static_content;
				debugInd = criterion.debug_ind;
				helpFile = page.getHelpFileName();
				helpURL = page.getHelpFileURL();
				custInd = page.getCustomizeEnabled();
				anchorArray = page.getTitleAnchors();
				if (page.isBannerEnabled())
					bDisplayBanner = page.isBannerEnabled();
			}
			if (displayType === 1) { //Select Box
				MP_Util.Doc.InitSelectorLayout(arItems, title, sc, helpFile, helpURL, bDisplayBanner, 0, criterionGroup, custInd, anchorArray);
			}
			else {
				MP_Util.Doc.InitTabLayout(arItems, title, sc, helpFile, helpURL, bDisplayBanner, 0, criterion, custInd, anchorArray);
			}
			
		},		
		/**
		 * Initialized the page based on a configuration of multiple TabItem objects
		 * @param {Array} arTabItems Array of the tab Objects to initialize the tab layout.
		 * @param {String} title The title to be associated to the page.
		 * @param {String} sc The static content file location.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 * @param {Boolean} debugInd A boolean indicator denoting if the MPage should be run in debug mode
		 */
		InitTabLayout : function(arTabItems, title, sc, helpFile, helpURL, includeBanner, debugInd, criterion, custInd, anchorArray){
			var body = document.body;
			var i18nCore = i18n.discernabu;
			//create page title
			MP_Util.Doc.AddPageTitle(title, body, debugInd, custInd, anchorArray, helpFile, helpURL, criterion);
			
			//check if banner should be created
			if (includeBanner){
				body.innerHTML += "<div id='banner' class='demo-banner'></div>";
			}
			body.innerHTML += "<div id='disclaimer' class='disclaimer'><span>"+i18nCore.DISCLAIMER+"</span></div>";

			//create unordered list for page level tabs
			//  a) need the id of the tabs to identify, b) the name of the tab, c) the components to add
			AddPageTabs(arTabItems, body);

			//create component placeholders for each tab
			CERN_TabManagers = [];
			for (var x = 0, xl = arTabItems.length; x<xl;x++){
				var tabItem = arTabItems[x];
				var tabManager = new MP_Core.TabManager(tabItem);
				if (x == 0){
					//the first tab will be selected upon initial loading of page.
					tabManager.setSelectedTab(true);
				}
				CERN_TabManagers.push(tabManager);
				CreateLiquidLayout(tabItem.components, _g(arTabItems[x].key), true);
				SetupCompFilters(tabItem.components);
				MP_Util.Doc.CreateCompMenus(tabItem.components, true);
			}
			MP_Util.Doc.AddCustomizeLink(criterion);
			SetupExpandCollapse();
		},
		/**
		 * Initialized the page based on a configuration of multiple MPage objects viewable through a select box
		 * @param {Array} arTabItems Array of the tab Objects to initialize the tab layout.
		 * @param {String} title The title to be associated to the page.
		 * @param {String} sc The static content file location.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 * @param {Boolean} debugInd A boolean indicator denoting if the MPage should be run in debug mode
		 * @param {Object} A different div to insert the tabbed page into
		 */
		InitSelectorLayout : function(arTabItems, title, sc, helpFile, helpURL, includeBanner, debugInd, criterion, custInd, anchorArray, buildDiv, MPageObj){
			var body = {};
			if(buildDiv){
				body = buildDiv;
			}else{
				body = document.body;
			}
			var i18nCore = i18n.discernabu;

			//first, check to see if they have a last saved view saved to User Prefs
			var jsonObject = MP_Core.AppUserPreferenceManager.GetQOCPreferences();
			var userPrefs,pagePrefs,views,lastSavedView;
			if(jsonObject) {
				userPrefs = jsonObject.user_prefs;
				pagePrefs = userPrefs.page_prefs;
			    views = pagePrefs.views;

		        var view = jsonObject.user_prefs.page_prefs.last_saved_view;
				
				if(view) {
					lastSavedView = view;
				}
				else {
					//if for some reason the view hasn't been defined for this page, set the last saved view to a blank string
					lastSavedView = "";
				}
				if (!views){//if "views" does not exist, then the user still has the old user prefs, which gurantees a last saved view
					pagePrefs = userPrefs.page_prefs = {};
					views = pagePrefs.views = [];
					//since we know there is a last saved view, add it back to the JSON
					jsonObject.user_prefs.page_prefs.last_saved_view = lastSavedView;
					//add a new view object for the last saved view for use with Drag and Drop
					var newView = {};
					newView.label = lastSavedView;
					newView.components = [];
					views.push(newView);
					////overwrite old user prefs
					MP_Core.AppUserPreferenceManager.SaveQOCPreferences(jsonObject);
				}
			}
			else {
				lastSavedView = "";
			}
			
			//create page title if this is a single MPage
			if(!buildDiv){
				MP_Util.Doc.AddPageTitle(title,body,debugInd,custInd,anchorArray,helpFile,helpURL,criterion,null);
			}else{//only MP_COMMON_ORDERS in a viewpoint is passing in a category_meaning and needs a title bar for the selector
				//MP_Util.Doc.AddPageTitle(title,body,debugInd,custInd,anchorArray,helpFile,helpURL,criterion,buildDiv.getAttribute("id"));
				var i18nCore=i18n.discernabu;
				var ar=[];
				var imgSource=criterion.static_content+"/images/3865_16.gif";
				title = "";
				buildDiv.innerHTML = "";
				ar.push("<div class='pg-hd'>");
				ar.push("<h1><span class='pg-title'>",title,"</span></h1><span id='pageCtrl",criterion.category_mean,"' class='page-ctrl'>");
				//'as of' date is always to the far left of items
			    var df = MP_Util.GetDateFormatter();
			    ar.push("<span class='other-anchors'>",i18nCore.AS_OF_TIME.replace("{0}",df.format(new Date(), mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS)),"</span>");
				ar.push("</span></div>");
				buildDiv.innerHTML+=ar.join("");
			}
			
			//check if banner should be created
			if (includeBanner){
				body.innerHTML += "<div id='banner' class='demo-banner'></div>";
			}
			//add disclaimer
			body.innerHTML += "<div id='disclaimer' class='disclaimer'><span>"+i18nCore.DISCLAIMER+"</span></div>";

			//create QOC selector
			LoadPageSelector(arTabItems, body, lastSavedView, criterion);

			var lastSavedTabKey = null;
			//create component placeholders for each tab
			CERN_TabManagers = [];
			for (var x = 0, xl = arTabItems.length; x<xl;x++){
				var tabItem = arTabItems[x];
				var tabManager = new MP_Core.TabManager(tabItem);
				if (x == 0){
					//the first tab will be selected upon initial loading of page.
					tabManager.setSelectedTab(true);
				}
				if (lastSavedView === tabItem.name){
					lastSavedTabKey = tabItem.key;
				}	
				CERN_TabManagers.push(tabManager);
				if(views){
					var alreadyAddedView = false;
					var viewsLength = views.length;
					for (var j = viewsLength; j--;) {
						var currentViewName = views[j].label;
						if (currentViewName === tabItem.name){
							alreadyAddedView = true;
							if (views[j].components.length > 0){
								var updatedQOCComponents = UpdateQOCComponentsWithUserPrefs(tabItem.components, views[j].components, criterion, MPageObj);
								CreateLiquidLayout(updatedQOCComponents, _g(tabItem.key), false);
							}
							else{
								CreateLiquidLayout(tabItem.components, _g(tabItem.key), false);
							}
							break;
						}
					}
					if (!alreadyAddedView){
						CreateLiquidLayout(tabItem.components, _g(tabItem.key), false);
					}
				}
				else{
					CreateLiquidLayout(tabItem.components, _g(tabItem.key), false);
				}
				
				MP_Util.Doc.CreateQOCCompMenus(tabItem.components, false, tabItem.key);
			}
			SetupExpandCollapse();
			if (lastSavedTabKey){
				MP_Util.Doc.InitQOCDragAndDrop(lastSavedTabKey);
				MP_Util.Doc.CreateQOCPageMenu(lastSavedTabKey, criterion.category_mean, criterion);
			}
		},		
		/**
		 * Initialize the mpage workflow view layout
		 * @param {object} navSubSecMPage object which holds the configuration for the components on the page.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 * @param {String} categoryMeaning The String name of the help file URL to associate to the page.
		 */
		InitWorkflowLayout:function(navSubSecMPage,helpFile,helpURL,categoryMeaning){
			var i18nCore=i18n.discernabu;
			var criterion=navSubSecMPage.getCriterion();
			var mpComps = [];
			
			if(categoryMeaning){
				var body=_g(categoryMeaning);
			}
			else{
				var body=document.body;
			}
			
			//GetComponentArray basically sorts the components into a 2-d array.  The first dimension is component groups and the second dimension is
			//columns within that group.  Since we are in a workflow view layout there is always one group and one column in that group.  That is why we
			//are using filteredComps[0][0] as our array of components in the view.
			var filteredComps = GetComponentArray(navSubSecMPage.getComponents());
			if(filteredComps[0] && filteredComps[0][0]){
				mpComps = filteredComps[0][0];
			}			
            
			var sHTML = [];
			sHTML.push("<div>");
			sHTML.push("<div class='col-group one-col'>");
	    	sHTML.push("<div class='col-outer2'><div class='col-outer1'>");
			var colClassName = "col1";
	    	sHTML.push("<div class='",colClassName,"'>");

	    	for(var x = 0; x < mpComps.length; x++){
	    		sHTML.push(CreateCompDiv(mpComps[x]));
	    	}
	    	sHTML.push("</div>");
	    	sHTML.push("</div></div></div></div>");
	    	body.innerHTML += sHTML.join("");
			
            SetupExpandCollapse();
            SetupCompFilters(mpComps);
			MP_Util.Doc.CreateCompMenus(mpComps, false);
			//MP_Util.Doc.InitDragAndDrop(categoryMeaning); //Disable component drag and drop in workflow
			MP_Util.Doc.CreatePageMenu(categoryMeaning, criterion.category_mean);
		},
		/**
		 * Initialize the mpage layout
		 * @param {mPage}  mPage object which holds the configuration for the components on the page.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 */
		InitLayout:function(mPage,helpFile,helpURL,categoryMeaning){
			var i18nCore=i18n.discernabu;
			var criterion=mPage.getCriterion();
			if(categoryMeaning){
				var body=_g(categoryMeaning);
			}
			else{
				var body=document.body;
			}

			//Ignore the page title since we are in a viewpoint
			if(!categoryMeaning){
				MP_Util.Doc.AddPageTitle(mPage.getName(),body,criterion.debug_ind,mPage.getCustomizeEnabled(),mPage.getTitleAnchors(),helpFile,helpURL,criterion,categoryMeaning);
			}

			if(mPage.isBannerEnabled()){
				body.innerHTML+="<div id='banner"+criterion.category_mean+"' class='demo-banner'></div>";
			}
			
			var mpComps = mPage.getComponents();
            CreateLiquidLayout(mpComps, body);
            MP_Util.Doc.AddCustomizeLink(criterion);
            SetupExpandCollapse();
            SetupCompFilters(mpComps);
			MP_Util.Doc.CreateCompMenus(mpComps, false);
			MP_Util.Doc.InitDragAndDrop(categoryMeaning);
			MP_Util.Doc.CreatePageMenu(categoryMeaning, criterion.category_mean);
						
		},
		
		InitDragAndDrop: function (categoryMeaning) {
		    var parentElement = null;
		    var self = this;
		    var vpParent = "";
		    if (categoryMeaning && typeof m_viewpointJSON == "string") {
		        vpParent = "#" + categoryMeaning + " ";
							
		    }
		    $(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3").sortable({
		        connectWith: vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3 ",
		        items: " .section",
		        zIndex: 1005,
		        appendTo: "body",
		        handle: "h2",
		        over: function (event, ui) {
		            if ($(this).attr("class") !== ui.sender.attr("class")) {
		                $(this).css("z-index", "1");
		            }
		        },
		        start: function (event, ui) {
			    $(this).css("z-index", "2");
		        ui.item.css("z-index", "2");
			
				// get sortable containers, assuming connectWith is NOT optimized
				var containers = $(this).parent().children();

		
				var tallest = 0;
				// may not need height: auto
				$(containers).height('auto');
				$(containers).each(function() {
				if ($(this).height() > tallest) {
					tallest = $(this).height();
				}});
		
				$(containers).height(tallest + $(ui.item).height());

		        },
				
		        stop: function (event, ui) {
		            ui.item.css("z-index", "1");
		            $(this).css("z-index", "1");
		            if (ui.sender) {
		                ui.sender.css("z-index", "1");
		            }	
		            CERN_EventListener.fireEvent(null, self, EventListener.EVENT_COMP_CUSTOMIZE, null);
			    	// get sortable containers, assuming connectWith is NOT optimized
			    	var containers = $(this).parent().children();
			    	// set height back to their natural height
			    	$(containers).height('auto');

		        },
		        update: function () {
		            setTimeout(function () {
		                MP_Core.AppUserPreferenceManager.SaveCompPreferences(null, "", null, true);
		            }, 0);
		        }
		    });
		    
			//Determine if the drag and drop should be active or not
			parentElement = (vpParent) ? $(vpParent) : $(document.body);
			if($(parentElement).hasClass("dnd-enabled")){
				$(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3").sortable("enable");
				$(vpParent+" .col-outer1:last .sec-hd").css("cursor","move");
			}
			else{
				$(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3").sortable("disable");
				$(vpParent+" .col-outer1:last .sec-hd").css("cursor","auto");
			}
		},
		InitQOCDragAndDrop:function(categoryMeaning){
			var vpParent = "#" + categoryMeaning + " ";

			$(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3," + vpParent + " .col-outer1:last .col4," + vpParent + " .col-outer1:last .col5").sortable({
				connectWith : vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3," + vpParent + " .col-outer1:last .col4," + vpParent + " .col-outer1:last .col5 ",
				items : " .section",
				zIndex : 1005,
				appendTo : "body",
				handle : "h2",
				over : function(event, ui) {
					if($(this).attr("class") !== ui.sender.attr("class")) {
						$(this).css("z-index", "auto");
					}
				},
				start : function(event, ui) {
					$(this).css("z-index", "2");
					ui.item.css("z-index", "2");
				},
				stop : function(event, ui) {
					ui.item.css("z-index", "auto");
					$(this).css("z-index", "auto");
					if(ui.sender) {
						ui.sender.css("z-index", "auto");
					}
				},
				update : function() {
					setTimeout(function() {
						MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, categoryMeaning);
					}, 0);
				}
			});
			
			//Determine if the drag and drop should be active or not
			if($(vpParent).hasClass("qoc-dnd-enabled")){
				$(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3," + vpParent + " .col-outer1:last .col4," + vpParent + " .col-outer1:last .col5").css("padding-bottom", "100px").sortable("enable");
				$(vpParent+" .col-outer1:last .sec-hd").css("cursor","move");
			}
			else{
				$(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3," + vpParent + " .col-outer1:last .col4," + vpParent + " .col-outer1:last .col5").css("padding-bottom", "100px").sortable("disable");
				$(vpParent+" .col-outer1:last .sec-hd").css("cursor","auto");
			}
		},
		CreatePageMenu: function (categoryMeaning, critCatMean) {
			var pageMenuId = "pageMenu" + critCatMean;
			var setupPageMenu = function(menuId, initialColCnt) {
				if(_g(menuId)) {
					var optMenu = _g("moreOptMenu" + menuId);
					if(!optMenu) {
						optMenu = Util.cep("div", {
							className : "opts-menu-content menu-hide",
							id : "moreOptMenu" + menuId
						});

						var i18nCore = i18n.discernabu;
						optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + menuId + '"><div class="opts-menu-item opts-sub-menu" id="optsDefLayout' + menuId + '">' + i18nCore.VIEW_LAYOUT + '</div><div class="opts-menu-item" id="optsDefClearPrefs' + menuId + '">' + i18nCore.CLEAR_PREFERENCES + '</div></div>';
						Util.ac(optMenu, document.body);
					}
					InitPageOptMenu(optMenu, menuId, false);
					var layoutOut = function(e) {
						if(!e) {
							e = window.event;
						}
						var relTarg = e.relatedTarget || e.toElement;
						if(relTarg) {
							if(!Util.Style.ccss(relTarg, "opts-menu-content")) {
								if(_g("optMenuConfig" + menuId)) {
									Util.Style.acss(_g("optMenuConfig" + menuId), "menu-hide");
								}
							}
						}
						else {
							if(_g("optMenuConfig" + menuId)) {
								Util.Style.acss(_g("optMenuConfig" + menuId), "menu-hide");
							}
							return;
						}
					};
					var secId = menuId.replace("mainCompMenu", "");
					
					$("#"+pageMenuId).click(function() {
						if(Util.Style.ccss(this, "page-menu-open")) {
							Util.Style.rcss(this, "page-menu-open")
						}
						else {
							Util.Style.acss(this, "page-menu-open")
						}

						OpenCompOptMenu(optMenu, menuId);
					});

					Util.addEvent(_g("optsDefLayout" + menuId), "mouseover", function() {
						launchSelectLayout(menuId, this, initialColCnt);
					});
					Util.addEvent(_g("optsDefLayout" + menuId), "mouseout", layoutOut);

					Util.addEvent(_g("optsDefClearPrefs" + menuId), "click", function() {
						var confirmMsg = i18nCore.CLEAR_ALL_PREFS + "<br />" + i18nCore.CLEAR_ALL_PREFS_CANCEL;
						MP_Util.AlertConfirm(confirmMsg, i18nCore.CLEAR_PREFERENCES, i18nCore.CONFIRM_CLEAR, i18nCore.CONFIRM_CANCEL, true, MP_Core.AppUserPreferenceManager.ClearPreferences);
					});
				}
			};
			var vpParent = ( typeof m_viewpointJSON == "string") ? "#" + categoryMeaning + " " : "";
			var initialColCnt;
			var curColGroupClass = $(vpParent + '.col-group:last').attr('class').replace("col-group ", "");
			switch (curColGroupClass) {
				case "three-col":
					initialColCnt = 3;
					break;
				case "two-col":
					initialColCnt = 2;
					break;
				case "one-col":
					initialColCnt = 1;
					break;
			}
			setupPageMenu(pageMenuId, initialColCnt);
		},
		CreateQOCPageMenu: function (categoryMeaning, critCatMean, criterion) {
			var dragNDropMenuItem = null;
			var i18nCore = i18n.discernabu;
			var initialColCnt = 0;
			var menuEle = null;
			var menuId = "";
			var pageMenuEle = null;
			var pageMenuId = "pageMenu" + critCatMean;
			var vpParent = "";
			
			function activateDragAndDrop(){
				var activeView = null;
				var parentEleId = "";
				var dragNDropEnabled = false;
				
				//Find the active tab and get its id
				activeView = $(".div-tab-item-selected");
				if(activeView.length){
					parentEleId = "#" + $(activeView).attr("id") + " ";
					dragNDropEnabled = $(activeView).hasClass("qoc-dnd-enabled");
				}
				//Check the dragging active css class
				
				if(dragNDropEnabled){
					//remove the dnd css class
					$(activeView).removeClass("qoc-dnd-enabled");
					
					//Update the menu item
					if(dragNDropMenuItem){
						$(dragNDropMenuItem).html(i18n.DRAG_AND_DROP_ENABLE);
					}
					
					// disables sortable
					$(parentEleId + " .col-outer1:last .col1," + parentEleId + " .col-outer1:last .col2," + parentEleId + " .col-outer1:last .col3," + parentEleId + " .col-outer1:last .col4," + parentEleId + " .col-outer1:last .col5").sortable("disable");
					// update the cursor to switch from the move icon to auto
					$(parentEleId+" .col-outer1:last .sec-hd").css("cursor","auto");
				}
				else{
					//add the dnd css class
					$(activeView).addClass("qoc-dnd-enabled");
				
					//Update the menu item
					if(dragNDropMenuItem){
						$(dragNDropMenuItem).html(i18n.DRAG_AND_DROP_DISABLE);
					}
					
					// re-enables sortable
					$(parentEleId + " .col-outer1:last .col1," + parentEleId + " .col-outer1:last .col2," + parentEleId + " .col-outer1:last .col3," + parentEleId + " .col-outer1:last .col4," + parentEleId + " .col-outer1:last .col5").sortable("enable");
					// update the cursor back to the move icon
					$(parentEleId+" .col-outer1:last .sec-hd").css("cursor","move");
				}
			}
			
			var setupPageMenu = function(menuId, initialColCnt) {
				if(_g(menuId)) {
					var optMenu = _g("moreOptMenu" + menuId);
					if(!optMenu) {
						optMenu = Util.cep("div", {
							className : "opts-menu-content menu-hide",
							id : "moreOptMenu" + menuId
						});

						optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + menuId + '"><div class="opts-menu-item opts-sub-menu" id="optsDefLayout' + menuId + '">' + i18nCore.VIEW_LAYOUT + '</div><div class="opts-menu-item" id="optsAddPrsnlFavComp' + menuId + '">' + i18nCore.ADD_FAVORITE + '...</div><div class="opts-menu-item" id="optsDefClearPrefs' + menuId + '">' + i18nCore.CLEAR_PREFERENCES + '</div></div>';
						Util.ac(optMenu, document.body);
					}
					InitPageOptMenu(optMenu, menuId, false);
					var layoutOut = function(e) {
						if(!e) {
							e = window.event;
						}
						var relTarg = e.relatedTarget || e.toElement;
						if(relTarg) {
							if(!Util.Style.ccss(relTarg, "opts-menu-content")) {
								if(_g("optMenuConfig" + menuId)) {
									Util.Style.acss(_g("optMenuConfig" + menuId), "menu-hide");
								}
							}
						}
						else {
							if(_g("optMenuConfig" + menuId)) {
								Util.Style.acss(_g("optMenuConfig" + menuId), "menu-hide");
							}
							return;
						}
					};
					var secId = menuId.replace("mainCompMenu", "");

					$("#"+pageMenuId).click(function() {
						if(Util.Style.ccss(this, "page-menu-open")) {
							Util.Style.rcss(this, "page-menu-open")
						}
						else {
							Util.Style.acss(this, "page-menu-open")
						}

						OpenCompOptMenu(optMenu, menuId);
					});

					Util.addEvent(_g("optsDefLayout" + menuId), "mouseover", function() {
						launchQOCSelectLayout(menuId, this, initialColCnt);

					});
					Util.addEvent(_g("optsDefLayout" + menuId), "mouseout", layoutOut);
					
					Util.addEvent(_g("optsAddPrsnlFavComp" + menuId), "click", function() {
						var recordData = MP_Util.Doc.GetFavFolders("0", criterion.person_id, criterion.encntr_id, criterion.provider_id, criterion.position_cd, criterion.ppr_cd, "1");
						var confirmMsg = i18nCore.SELECT_PERSONAL_FAV_COMP + "<br />";
						MP_Util.ActionableAlertConfirm(confirmMsg, i18nCore.ADD_PERSONAL_FAV_COMP, i18nCore.CONFIRM_CANCEL, true, null);
						MP_Util.Doc.RenderFavFolder(recordData, criterion);
					});
					
					Util.addEvent(_g("optsDefClearPrefs" + menuId), "click", function() {
						var confirmMsg = i18nCore.CLEAR_ALL_PREFS + "<br />" + i18nCore.CLEAR_ALL_PREFS_CANCEL;
						MP_Util.AlertConfirm(confirmMsg, i18nCore.CLEAR_PREFERENCES, i18nCore.CONFIRM_CLEAR, i18nCore.CONFIRM_CANCEL, true, MP_Core.AppUserPreferenceManager.ClearPreferences);
					});
					
					//Add the drag and drop menu item
					pageMenuEle = $('#optsMenupersonalize' + menuId);
					if(pageMenuEle.length){
						//Create the Printable Report Menu Item
						dragNDropMenuItem = $("<div></div")
							.attr("id", "optsDNDToggle" + menuId)
							.addClass("opts-menu-item")
							.html(i18n.DRAG_AND_DROP_ENABLE)
							.click(activateDragAndDrop);
				
						//Add the Drag and Drop menu to the page menu selection
						//Check to see if the layout menu exists and if so add the Print Report option after that
						menuEle = _g('optsDefLayout' + menuId);
						if(menuEle){
							$(dragNDropMenuItem).insertAfter(menuEle);
							return true;
						}
						
						//Add the Drag and Drop option at the end of the menu
						$(pageMenuEle).append(dragNDropMenuItem);
						return true;
					}
				}
			};
			
			vpParent = "#" + categoryMeaning + " ";
			
			var curColGroupClass = $(vpParent + '.col-group:last').attr('class').replace("col-group ", "");
			switch (curColGroupClass) {
				case "five-col":
					initialColCnt = 5;
					break;
				case "four-col":
					initialColCnt = 4;
					break;
				case "three-col":
					initialColCnt = 3;
					break;
				case "two-col":
					initialColCnt = 2;
					break;
				case "one-col":
					initialColCnt = 1;
					break;
			}
			setupPageMenu(pageMenuId, initialColCnt);
		},
		GetFavFolders:function(folderId, critPersonId, critEncntrId, critProviderId, critPositionCd, critPprCd, venueType){
			var record = null;
			var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
		    info.onreadystatechange = function(){
		        if (this.readyState == 4 && this.status == 200) {
					MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "GetNOEFavFolders");
		            var jsonEval = JSON.parse(this.responseText);
		            var recordData = jsonEval.RECORD_DATA;
		            if (recordData.STATUS_DATA.STATUS == "Z") {
		            	record = recordData;
		            }
		            else if (recordData.STATUS_DATA.STATUS == "S") {
		            	record = recordData;
		            }
		            else {
						MP_Util.LogScriptCallError(null, this, "mp_core.js", "GetNOEFavFolders");
		                var errAr = [];
		                var statusData = recordData.STATUS_DATA;
						errAr.push("STATUS: " + statusData.STATUS);
		                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
		                    var ss = statusData.SUBEVENTSTATUS[x];
		                    errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
		                }
						window.status = "Error getting user favorite folder structure: " + errAr.join(",");
		            }
		        }
		        if (this.readyState == 4) {
		            MP_Util.ReleaseRequestReference(this);
		        }
			};
		    
		    var sendAr = ["^MINE^", critPersonId + ".0", critEncntrId + ".0", critProviderId + ".0", folderId + ".0", "^FAVORITES^", critPositionCd + ".0", critPprCd + ".0", "11", venueType];
		    if(CERN_BrowserDevInd){
		    	var url = "mp_get_powerorder_favs_json?parameters=" + sendAr.join(",");
				info.open('GET', url, false);
				info.send(null);
		    }
		    else{
		    	info.open('GET', "mp_get_powerorder_favs_json", false);
		    	info.send(sendAr.join(","));
		    }
			return record;
		},
		RenderFavFolder:function(recordData, criterion){
			if (recordData.STATUS_DATA.STATUS != "F"){
				var noeFavArr = recordData.USER_FAV;
				var venueTypeList = recordData.VENUE_TYPE_LIST;
			}
			var noei18n = i18n.discernabu.noe_o1;
			var pageId = "pageMenuAddFavorite1234";

			var mnuDisplay = "";	//currently selected menu option display
			var mnuVenueType = 0;	//currently selected menu option venue type
			var mnuNextDisplay = "";//next menu option display
			var mnuNextVenueType = 0;//next menu option venue type
			var x;
			var xl;
			var newVenue;
			var favSec = ["<div>"];
			if (venueTypeList){
				for (x = 0, xl = venueTypeList.length; x < xl; x++){
					newVenue = venueTypeList[x];
					if (newVenue.SOURCE_COMPONENT_LIST[0].VALUE === 2){
						//set next menu options
						mnuNextDisplay = newVenue.DISPLAY;
						mnuNextVenueType = 2;
					}
					else{
						//set currently selected menu option
						mnuDisplay = newVenue.DISPLAY;
						mnuVenueType = 1;
					}
				}
				var arr = [];
				arr.push("<div id='pgMnuFavFolderVenueBtns'><div><input class='page-menu-add-fav-venue' venue-val='1' type='radio' checked='checked' onclick='MP_Util.Doc.SwitchFavFolderVenue(this, \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean, "\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")' /><span>",mnuDisplay,"</span></div><div><input class='page-menu-add-fav-venue' venue-val='2' type='radio' onclick='MP_Util.Doc.SwitchFavFolderVenue(this, \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", criterion.executable, "\", \"", criterion.static_content,"\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")' /><span>",mnuNextDisplay,"</span></div></div>");
				favSec = favSec.concat(arr);
			}

			var noeItem;
			var noeRow;
			var noeType;
			var noeItemArr;
			var venueType = mnuVenueType;
			
			if(noeFavArr){
		    	var favLength = noeFavArr.length;
		    	if (favLength === 0){
		    		favSec.push("<span class='res-none'>", noei18n.NO_FAVORITES_FOUND, "</span>");
		    	}
		    	else{
		    		var favCnt = 0;
		    		var favChildFavFolder = [];
		    		var favSecondaryFavFolder = [];
		        	for (i = 0; i < favLength; i++) {                 
		        		var noeFavsObj = noeFavArr[i];
		        		//account for multiple favorite folders per venue
		        		if (i === 0){
		            		favSec.push("<div id='pgMnuFavFolderPath",pageId,"' class='noe-fav-path hdr'><dl id='pgMnuFolderPath",pageId,"' class='noe-folder-info'><dt>0</dt><dd class='noe-fav-folder'><span id='pgMnuFolderPathRoot", pageId, "'>", noeFavsObj.SHORT_DESCRIPTION,"</span></dd></dl></div>",
		            			"<div id='pgMnuFavFolderContents",pageId,"' class='page-menu-add-favorite-contents'>");

		    				//Create the rest of the folders/orders/caresets/PowerPlans
		            		noeItemArr = noeFavsObj.CHILD_LIST;
		            		for (j = 0, k = noeItemArr.length; j < k; j++) {
		            			noeItem = noeItemArr[j];
		            			noeRow = [];
		    		            noeType = noeItem.LIST_TYPE;
					            if (noeType === 1){//Favorite Folder
	    							favCnt++;
	    	        				noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", noeItem.SYNONYM, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd,"\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", venueType, "\", \"", criterion.executable, "\", \"", criterion.static_content,"\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
	    	        				favChildFavFolder = favChildFavFolder.concat(noeRow);    
					            }
		    	        	}
		        		}
		        		else{
		        			favCnt++;
		    				if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)){
		    					folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}",i);
		    					favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", folderName, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd,"\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", venueType, "\", \"", criterion.executable, "\", \"", criterion.static_content,"\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
		    				}
		    				else{
		    					favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", noeFavsObj.SHORT_DESCRIPTION, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd,"\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", venueType, "\", \"", criterion.executable, "\", \"", criterion.static_content,"\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean,"\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
		    				}
		        		}
		        	}
		            if (!favCnt) {
		                favSec.push("<span class='res-none'>", (noeFavArr) ? noei18n.NO_FAVORITES_FOUND : i18n.ERROR_RETREIVING_DATA, "</span>");
		            }
		            else{
		        		//add items in sorted order
		        		favSec = favSec.concat(favChildFavFolder, favSecondaryFavFolder);
		            }
		            favSec.push("</div>"); //ends <div id='pgMnuFavFolderContents",pageId,"'>
		    	}
		    }
			else if (!noeFavArr) {
				var i18nCore = i18n.discernabu;
		        var errMsg = [];
		        errMsg.push("<span class='res-none'>", i18n.ERROR_RETREIVING_DATA, "</span>");
		        favSec = favSec.concat(errMsg);
			}
			favSec.push("</div>");
			var favSecHTML = favSec.join("");
			var actionableContDiv = _g("acActionableContent");
			if (actionableContDiv){
				actionableContDiv.innerHTML = favSecHTML;
			}
			
			var folderPathId = 'pgMnuFolderPath' + pageId;
			var folderPath = _g(folderPathId);
			if(folderPath){
				Util.addEvent(folderPath, "click", 
					function(e){
		    			var folder = e.target || e.srcElement;
		    			var folderId = Util.gps(Util.gp(folder));
		    			if (folderId.innerHTML != "-1"){
		    				var curVenueType = 1;//default to 1 just in case of an error with getting the buttons
		    				var inputButtons = Util.Style.g("page-menu-add-fav-venue", _g("pgMnuFavFolderVenueBtns"), "input");
		    				if (inputButtons){
			    				for (var x = inputButtons.length; x--;) {
			    					var curButton = inputButtons[x];
			    					if (curButton.checked){
			    						curVenueType = curButton.getAttribute('venue-val');
			    						break;
			    					}
			    				}
		    				}
		    				MP_Util.Doc.DisplaySelectedFavFolder(folderId.innerHTML, pageId, criterion.person_id, criterion.encntr_id, criterion.provider_id, criterion.position_cd, criterion.ppr_cd, curVenueType, criterion.executable, criterion.static_content, criterion.debug_ind, criterion.help_file_local_ind, criterion.category_mean, criterion.locale_id, criterion.device_location);
		    			}
					}
				);
			}
		},
		SwitchFavFolderVenue:function(button, pageId, personId, encntrId, providerId, positionCd, pprCd, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation){
			//toggle which buttons are checked
			var inputButtons = Util.Style.g("page-menu-add-fav-venue", Util.gp(Util.gp(button)), "input");
			if (inputButtons) {
				for (var x = inputButtons.length; x--;) {
					var curButton = inputButtons[x];
					if (curButton.checked){
						curButton.checked = "";
					}
					else{
						curButton.checked = "checked";
					}
				}
			}
			
			//delete al items in the folder path and folder id path as we are starting at the beginning when switching venues
			var i;
			var l;
			var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
		    var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
		    var curList = folderPath[0];
			var curItem = _gbt("DT", curList);
		    var curItemData = _gbt("DD", curList);
		    var locatedIdIndex = 0;
		    for (i = curItem.length; i--;){
				if (i !== 0){
					Util.de(curItem[i]);
				}
			}
			for (i = curItemData.length; i--;){
				if (i !== 0){
					Util.de(curItemData[i]);
				}
			}
			
			var venueType = button.getAttribute('venue-val');
			
			var recordData = MP_Util.Doc.GetFavFolders("0", personId, encntrId, providerId, positionCd, pprCd, venueType);
			MP_Util.Doc.LoadFavFolder(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation);
		},
		DisplayNextFavFolder:function(folder, folderId, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation){
			var noei18n = i18n.discernabu.noe_o1;
			var curFolderData = _gbt("DD", Util.gp(folder));
		    var curName = curFolderData[0];
		    var curNameDisp = curName.innerHTML;
		    
		    //grab all folder names and ids in DOM of component
		    var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
		    var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
		    var curList = folderPath[0];
			var curItem = _gbt("DT", curList);
		    var curItemData = _gbt("DD", curList);
		    var lastId = curItem[curItem.length-1];
		    var lastFolder = curItemData[curItemData.length-1];
		    
		    var pathLength = curItemData.length;
		    var separator = "...";
		    

			if (pathLength !== 1){
		    	separator = ">";
		    }

		    if (pathLength > 4){
		        for (var j = pathLength - 1; j--;) {
		        	if (j > 1){
		        		if (curItem[j].innerHTML == "-1"){
		        			Util.Style.acss(curItemData[j],"hidden");
		            		Util.Style.rcss(curItemData[j],"noe-fav-separator");
		        		}
		        		else{
		            		Util.Style.acss(curItemData[j],"hidden");
		            		Util.Style.rcss(curItemData[j],"noe-fav-folder");
		        		}
		        	}
		        }
		    }

		    
		    //create four new nodes for the folder id, folder name, separator id, and separator
		    var newFolderId = Util.cep("DT", {"className": "hidden", "innerHTML": folderId});
		    var newFolder = Util.cep("DD", {"className": "noe-fav-folder", "innerHTML": "<span>" + curNameDisp + "</span>"});
		    var newSeparatorId = Util.cep("DT", {"className": "hidden", "innerHTML": "-1"});
		    var newSeparator = Util.cep("DD", {"className": "noe-fav-separator", "innerHTML": "<span>" + separator + "</span>"});
		    //add four new nodes to DOM
		    Util.ia(newSeparatorId,lastFolder);
		    Util.ia(newSeparator,newSeparatorId);
		    Util.ia(newFolderId,newSeparator);
		    Util.ia(newFolder,newFolderId);          
		    
			var prevFolderContent = _g("pgMnuFavFolderContents" + pageId);
			if (prevFolderContent){
				prevFolderContent.innerHTML = "";
				prevFolderContent.style.overflowY = "auto";
				Util.Style.acss(prevFolderContent,"noe-preloader-icon");
			}

			var recordData = MP_Util.Doc.GetFavFolders(folderId, personId, encntrId, providerId, positionCd, pprCd, venueType);
			MP_Util.Doc.LoadFavFolder(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation);
		},
		LoadFavFolder:function(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation){
			var noei18n = i18n.discernabu.noe_o1;
			var noeFavArr = null;
			if (recordData.STATUS_DATA.STATUS != "F"){
				noeFavArr = recordData.USER_FAV;
			}
			
			var prevFolderContent = _g("pgMnuFavFolderContents" + pageId);
			if (prevFolderContent && noeFavArr){
				Util.Style.rcss(prevFolderContent,"noe-preloader-icon");		
		 		var favSec = ["<div>"];
		 		var favCnt = 0;
				var favChildFavFolder = [];
				var favSecondaryFavFolder = [];
		 	    //grab all folder names and ids in DOM of component
		 	    var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
		 	    var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
		 	    var curList = folderPath[0];
		 		var curItem = _gbt("DT", curList);
				for (var i = 0, l = noeFavArr.length; i < l; i++) {
					var noeFavsObj = noeFavArr[i];
					if (i === 0){
						var noeItemArr = noeFavsObj.CHILD_LIST;
			     		
			     		for (var j = 0, k = noeItemArr.length; j < k; j++) {
			     			var noeItem = noeItemArr[j];
			     			var noeRow = [];
				            var noeType = noeItem.LIST_TYPE;
				            if (noeType === 1){//Favorite Folder
				            	favCnt++;
				            	noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", noeItem.SYNONYM, "\", \"", personId, "\", \"", encntrId,"\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd,"\", \"", executable,"\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", pageId, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", venueType, "\", \"", executable, "\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
				            	favChildFavFolder = favChildFavFolder.concat(noeRow);
				            }
			     		}
					}
		    		else{
		    			favCnt++;
						if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)){
							folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}",i);
							favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", folderName, "\", \"", personId, "\", \"", encntrId,"\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd,"\", \"", executable,"\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", pageId, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", venueType, "\", \"", executable, "\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
						}
						else{
							favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", noeFavsObj.SHORT_DESCRIPTION, "\", \"", personId, "\", \"", encntrId,"\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd,"\", \"", executable,"\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID,"\", \"", pageId, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", venueType, "\", \"", executable, "\", \"", staticContent,"\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean,"\", \"", localeId, "\", \"", deviceLocation, "\")'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>",  noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
						}
		    		}
				}
				
				//add items in sorted order
				favSec = favSec.concat(favChildFavFolder, favSecondaryFavFolder);

				if (!favCnt){
					favSec.push("<span class='res-none'>", noei18n.EMPTY_FOLDER, "</span>");
				}
				favSec.push("</div>");
				folderHTML = favSec.join("");
				prevFolderContent.innerHTML = folderHTML;
			}
			else if (prevFolderContent && !noeFavArr) {
				Util.Style.rcss(prevFolderContent,"noe-preloader-icon");
				var i18nCore = i18n.discernabu;
		        var errMsg = [];
		        errMsg.push("<span class='res-none'>", i18n.ERROR_RETREIVING_DATA, "</span>");
		        folderHTML = errMsg.join("");
				prevFolderContent.innerHTML = folderHTML;
			}
		},
		DisplaySelectedFavFolder:function(folderId, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation){
			var noei18n = i18n.discernabu.noe_o1;
			var i,l;
			var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
		    var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
		    var curList = folderPath[0];
			var curItem = _gbt("DT", curList);
		    var curItemData = _gbt("DD", curList);

		    //find index of folder id
		    var locatedIdIndex = null;
			for (i = 0, l = curItem.length; i < l; i++){
				if (curItem[i].innerHTML == folderId){
					locatedIdIndex = i;
				}
			}

			//delete all folder names and ids that are after selected folder
			if (locatedIdIndex !== null){
				for (i = curItem.length; i--;){
					var deleteId = curItem[i];
					if (locatedIdIndex < i){
					    Util.de(deleteId);
					}
				}
				for (i = curItemData.length; i--;){
					var deleteFolder = curItemData[i];
					if (locatedIdIndex < i){
					    Util.de(deleteFolder);
					}
				}
				if (locatedIdIndex > 3){

					Util.Style.acss(curItemData[locatedIdIndex-1],"noe-fav-separator");
					Util.Style.rcss(curItemData[locatedIdIndex-1],"hidden");
		    		Util.Style.acss(curItemData[locatedIdIndex-2],"noe-fav-folder");
					Util.Style.rcss(curItemData[locatedIdIndex-2],"hidden");
				}
				
				var prevFolderContent = _g("pgMnuFavFolderContents" + pageId);
				if (prevFolderContent){
					prevFolderContent.innerHTML = "";
					prevFolderContent.style.overflowY = "auto";
					Util.Style.acss(prevFolderContent,"noe-preloader-icon");
				}

				var recordData = MP_Util.Doc.GetFavFolders(folderId, personId, encntrId, providerId, positionCd, pprCd, venueType);
				MP_Util.Doc.LoadFavFolder(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation);
			}
		},
		AddFavoriteComponent:function(button, folderId, folderName, personId, encntrId, providerId, positionCd, pprCd, executable, staticContent, debugInd,  helpFileLocalInd, categoryMean, localeId, deviceLocation){
			$(".modal-div").remove();
			$(".modal-dialog-actionable").remove();
			$("html").css("overflow", "auto"); //reset overflow
			//Set the viewpoint indicator to true if this is a viewpoint, otherwise false
			var isViewpoint = ( typeof m_viewpointJSON == "undefined") ? false : true;
		    var activeDiv = Util.Style.g("div-tab-item-selected", document.body, "DIV")[0];
		    if (activeDiv){
				//create criterion object to be used in component
				var criterion = {};
				criterion.person_id = personId;
				criterion.encntr_id = encntrId;
				criterion.provider_id = providerId;
				criterion.executable = executable;
				criterion.static_content = staticContent;
				criterion.position_cd = positionCd;
				criterion.ppr_cd = pprCd;
				criterion.debug_ind = debugInd;
				criterion.help_file_local_ind = helpFileLocalInd;
				criterion.category_mean = categoryMean;
				criterion.locale_id = localeId;
				criterion.device_location = deviceLocation;

				//create new order selection component
		    	var appendingComponentId = "-" + activeDiv.id;
		    	var componentId = folderId.concat(appendingComponentId);
				var component = new OrderSelectionComponent();
				component.setCriterion(criterion);
				component.setStyles(new OrderSelectionComponentStyle());
		        component.setComponentId(componentId);
		        component.setReportId(folderId);
		        component.setFavFolderId(folderId);
		        component.setCustomizeView(false);
		        component.setExpanded(1);
		        component.setColumn(1);
		        component.setSequence(0);
		        component.setPageGroupSequence(1);
		        component.setLabel(folderName);
				if (isViewpoint){
					component.setModalScratchPadEnabled(1);
				}

		        var style = component.getStyles();
		        style.setComponentId(componentId);
		        
		        var newCompNode = createDynCompDiv(component);
		        
		        //render component
		        component.InsertData();
		        //grab first column of components
		        var columnOneNode = Util.Style.g("col1", activeDiv, "DIV")[0];
		        //grab first component in column one
		        var columnOneFirstComp = Util.Style.g("section", columnOneNode, "DIV")[0];
		        //insert new order selection component in the first row on column one
		        columnOneNode.insertBefore(newCompNode, columnOneFirstComp);
		        
		        //Update the cursor class of the newly created component based on the drag and drop toggle status
		        if(!($(".div-tab-item-selected").hasClass("qoc-dnd-enabled"))){
		        	//remove the cursor move class
		        	$("#" + style.getId() + " ." + style.getHeaderClass()).css("cursor","auto");
		        }
		        
		        //update CERN_MPageComponents so we can find component Id when saving preferences
		        CERN_MPageComponents.push(component);
				
		        //save user preferences immediately after adding component
		        MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, activeDiv.id);
		       
		        //add expand/collapse functionality
		        var componentToggle = Util.Style.g(style.getHeaderToggle(), newCompNode, "span")[0];
		        Util.addEvent(componentToggle, "click", MP_Util.Doc.ExpandCollapse);
		        
		        //add component menu functionality
		        var fullId = "mainCompMenu" + style.getNameSpace() + componentId;
		        var optMenu = Util.cep("div", {
		            className: "opts-menu-content menu-hide",
		            id: "moreOptMenu" + componentId
		        });
		        var i18nCore = i18n.discernabu;
		        var optMenuArr = ['<div class="opts-actions-sec" id="optsMenuActions', componentId, '"></div>',
		                          '<div class="opts-personalize-sec" id="optsMenupersonalize', componentId, '"><div class="opts-menu-item" id="optsDefTheme',
		                          componentId, '">', i18nCore.COLOR_THEME, '</div><div class="opts-menu-item" id="optsDefState', componentId,
		                          '">', i18nCore.DEFAULT_EXPANDED, '<span class="opts-menu-def-exp">&nbsp;</span></div></div>'];
				optMenu.innerHTML = optMenuArr.join("");
		        Util.ac(optMenu, document.body);
				InitCompOptMenu(optMenu, componentId, false);
				
				var themeOut = function (e) {
					if (!e) {
						e = window.event;
					}
					var relTarg = e.relatedTarget || e.toElement;
					if (relTarg) {
						if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
							if (_g("optMenuConfig" + componentId)) {
								Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
							}
						}
					}
					else {
						if (_g("optMenuConfig" + componentId)) {
								Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
							}
						return;
					}
				};
				
		        var secId = fullId.replace("mainCompMenu", "");
		        Util.addEvent(_g("mainCompMenu" + secId), "click", function () {
		            OpenCompOptMenu(optMenu, secId);
		        });        
				Util.addEvent(_g("optsDefTheme" + componentId), "mouseover", function() {
					launchQOCThemeMenu(componentId, fullId, secId, this, activeDiv.id);
				});
				Util.addEvent(_g("optsDefTheme" + componentId), "mouseout", themeOut);
				
				Util.addEvent(_g("optsDefState" + componentId), "click", function() {
					launchQOCSetState(componentId, this, activeDiv.id);
				});
		    }
		    
		    function createDynCompDiv(component){
		        var i18nCore = i18n.discernabu;
		        var i18nConfigMPage = i18n.discernabu.covc_o1;
		        var ar = [];
		        var style = component.getStyles();
		        var ns = style.getNameSpace();
		        var compId = component.getComponentId();
		        var secClass = style.getClassName();
		        var tabLink = component.getLink();
		        var loc = component.getCriterion().static_content;
		        var sAnchor = component.getLabel();
		        
		        var compNode = Util.cep("div", {
		            className: style.getClassName(),
		            id: style.getId()
		        });

		        ar.push("<h2 class='", style.getHeaderClass(), "' style='cursor: move;'><span class='", style.getHeaderToggle(), "' title='", i18nCore.HIDE_SECTION, 
		        		"'>-</span><span class='opts-menu menu-hide' id='mainCompMenu", ns, compId, "'>&nbsp;</span><span class='", style.getTitle(), "'><span>", 
		        		sAnchor, "</span><span class='sec-total'></span></span></h2><div id='", style.getContentId(), "' class='", style.getContentClass(), "'></div>");
		        var footerText = component.getFooterText();
		        if (footerText && footerText !== "") {
		            ar.push("<div class=sec-footer>", footerText, "</div>");
		        }
		        var arHtml = ar.join("");
		        compNode.innerHTML = arHtml;
		        return compNode;
		    }  
		},
		/**
		 * Create Component Menus
		 * @param {mpComps} mpage components for current view
		 * @param {bool} disablePrsnl boolean to disable personalize section
		 * @param 
		 */
		CreateCompMenus:function(mpComps, disablePrsnl) {
            var setupCompMenu = function (componentId, fullId, isExp) {
                    if (_g(fullId)) {
                        var optMenu = _g("moreOptMenu" + componentId);
                        if (!optMenu) {
                            optMenu = Util.cep("div", {
                                className: "opts-menu-content menu-hide",
                                id: "moreOptMenu" + componentId
                            });
                            var i18nCore = i18n.discernabu;
                            var defExpClass = "";
                            if (isExp) {
                                defExpClass = "opts-menu-def-exp";
                            }

							optMenu.innerHTML = '<div class="opts-actions-sec" id="optsMenuActions' + componentId + '"></div>';
							if(!disablePrsnl) {
								optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + componentId + '"><div class="opts-menu-item" id="optsDefTheme' + componentId + '">' + i18nCore.COLOR_THEME + '</div><div class="opts-menu-item" id="optsDefState' + componentId + '">' + i18nCore.DEFAULT_EXPANDED + '<span class="' + defExpClass + '">&nbsp;</span></div></div>';
							}
							Util.ac(optMenu, document.body);
                        }
                        InitCompOptMenu(optMenu, componentId, false);
						
					var themeOut = function (e) {
							if (!e) {
								e = window.event;
							}
							var relTarg = e.relatedTarget || e.toElement;
							if (relTarg) {
								if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
									if (_g("optMenuConfig" + componentId)) {
										Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
									}
								}
							}
							else {
								if (_g("optMenuConfig" + componentId)) {
										Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
									}
								return;
							}
						};
                        var secId = fullId.replace("mainCompMenu", "");
                        Util.addEvent(_g("mainCompMenu" + secId), "click", function () {
                            OpenCompOptMenu(optMenu, secId);
                        });

						if(!disablePrsnl) {
							Util.addEvent(_g("optsDefTheme" + componentId), "mouseover", function() {
								launchThemeMenu(componentId, fullId, secId, this);
							});
							Util.addEvent(_g("optsDefTheme" + componentId), "mouseout", themeOut);
							Util.addEvent(_g("optsDefState" + componentId), "click", function() {
								launchSetState(componentId, this);
							});
						}
                    }
                };
			var mns = mpComps;
			var mLen = mns.length
			for(var i = 0; i < mLen; i++) {
				var curComp = mns[i];
                var ns = curComp.m_styles.m_nameSpace;
                var compId = curComp.m_styles.m_componentId;
                var fullId = "mainCompMenu" + ns + compId;
                var isExp = curComp.isExpanded();
                setupCompMenu(compId, fullId, isExp);
			}
		},
		/**
		 * Create Quick Orders and Charges Component Menus
		 * @param {mpComps} mpage components for current view
		 * @param {bool} disablePrsnl boolean to disable personalize section
		 * @param {string} selectedViewId Id of view selected in QOC
		 * @param 
		 */
		CreateQOCCompMenus:function(mpComps, disablePrsnl, selectedViewId) {
            var setupCompMenu = function (componentId, fullId, isExp) {
                    if (_g(fullId)) {
                        var optMenu = _g("moreOptMenu" + componentId);
                        if (!optMenu) {
                            optMenu = Util.cep("div", {
                                className: "opts-menu-content menu-hide",
                                id: "moreOptMenu" + componentId
                            });
                            var i18nCore = i18n.discernabu;
                            var defExpClass = "";
                            if (isExp) {
                                defExpClass = "opts-menu-def-exp";
                            }

							optMenu.innerHTML = '<div class="opts-actions-sec" id="optsMenuActions' + componentId + '"></div>';
							if(!disablePrsnl) {
								optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + componentId + '"><div class="opts-menu-item" id="optsDefTheme' + componentId + '">' + i18nCore.COLOR_THEME + '</div><div class="opts-menu-item" id="optsDefState' + componentId + '">' + i18nCore.DEFAULT_EXPANDED + '<span class="' + defExpClass + '">&nbsp;</span></div></div>';
							}
							Util.ac(optMenu, document.body);
                        }
                        InitCompOptMenu(optMenu, componentId, false);
						
					var themeOut = function (e) {
							if (!e) {
								e = window.event;
							}
							var relTarg = e.relatedTarget || e.toElement;
							if (relTarg) {
								if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
									if (_g("optMenuConfig" + componentId)) {
										Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
									}
								}
							}
							else {
								if (_g("optMenuConfig" + componentId)) {
										Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
									}
								return;
							}
						};
                        var secId = fullId.replace("mainCompMenu", "");
                        Util.addEvent(_g("mainCompMenu" + secId), "click", function () {
                            OpenCompOptMenu(optMenu, secId);
                        });

						if(!disablePrsnl) {
							Util.addEvent(_g("optsDefTheme" + componentId), "mouseover", function() {
								launchQOCThemeMenu(componentId, fullId, secId, this, selectedViewId);
							});
							Util.addEvent(_g("optsDefTheme" + componentId), "mouseout", themeOut);
							Util.addEvent(_g("optsDefState" + componentId), "click", function() {
								launchQOCSetState(componentId, this, selectedViewId);
							});
						}
                    }
                };
			var mns = mpComps;
			var mLen = mns.length
			for(var i = 0; i < mLen; i++) {
				var curComp = mns[i];
                var ns = curComp.m_styles.m_nameSpace;
                var compId = curComp.m_styles.m_componentId;
                var fullId = "mainCompMenu" + ns + compId;
                var isExp = curComp.isExpanded();
                setupCompMenu(compId, fullId, isExp);
			}
		},
		/**
		 * Hide all Component Menus
		 */
		HideAllCompMenus:function(){
			var mnus = Util.Style.g("opts-menu-content", null, "div");
			var mnLen = mnus.length;
			for(var m = mnLen; m--; ) {
				if(!Util.Style.ccss(mnus[m], "menu-hide")) {
					Util.Style.acss(mnus[m], "menu-hide");
				}
			}
		},
		/**
		 * Hide all Page Menus
		 */
		ResetPageMenus: function() {
			var pageMenuIcons = Util.Style.g('page-menu');
			var pl = pageMenuIcons.length;
			for (var i=pl; i--;) {
				var pageMenu = pageMenuIcons[i];
				if (Util.Style.ccss(pageMenu, "page-menu-open")) {
					Util.Style.rcss(pageMenu, "page-menu-open")
				}
			}
		},		
		/**
		 * Customize the mpage layout
		 * @param {String} title The title of the page to display
		 * @param {Object} components The list components to be associated.
		 */
		CustomizeLayout : function(title, components, criterion){
			var body = document.body;
			var i18nCore = i18n.discernabu;
			MP_Util.Doc.AddPageTitle(title, body, 0, false, null, null, null, criterion);
			MP_Util.Doc.AddClearPreferences(body,criterion)
			MP_Util.Doc.AddSavePreferences(body,criterion)
			
			body.innerHTML += "<div id='disclaimer' class='disclaimer'><span>"+i18nCore.USER_CUST_DISCLAIMER+"</span></div>";
			
			var compAr = [];
			for (var x=components.length;x--;){
				var component = components[x];
				if (component.getColumn() != 99)
					compAr.push(component);
			}
			
			CreateCustomizeLiquidLayout(compAr, body)
			SetupExpandCollapse();
			SetupCompFilters(compAr);
		},
		GetComments : function(par, personnelArray) {
			var com = "", recDate = "";
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			for (var j=0, m=par.COMMENTS.length; j<m; j++) {	
				if(personnelArray.length != null){
					if(par.COMMENTS[j].RECORDED_BY)
						perCodeObj=MP_Util.GetValueFromArray(par.COMMENTS[j].RECORDED_BY, personnelArray);	
				
					if(par.COMMENTS[j].RECORDED_DT_TM != ""){
						recDate = df.formatISO8601(par.COMMENTS[j].RECORDED_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)			
					}
					if (j>0) {
						com += "<br />";
					}
					com += recDate + " -  " + perCodeObj.fullName + "<br />" + par.COMMENTS[j].COMMENT_TEXT;
				}
			}
			return com;
		},
		FinalizeComponent : function(contentHTML, component, countText) {
			var styles = component.getStyles();
		
			//replace count text
			var rootComponentNode = component.getRootComponentNode();
			//There are certain circumstances where a components DOM element will have been removed.  
			//ie. selecting a view from the viewpoint drop down and then selecting another.
			if(rootComponentNode){
				var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
				totalCount[0].innerHTML = countText;
			
				//replace content with HTML
				var node = component.getSectionContentNode();
				node.innerHTML = contentHTML;
			
				//init hovers
				MP_Util.Doc.InitHovers(styles.getInfo(),node, component);
				
				//init subsection toggles
				MP_Util.Doc.InitSubToggles(node, "sub-sec-hd-tgl");
				
				//init scrolling
				MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), component.getScrollNumber(), "1.6")
			}
		},
		/**
		 * Formats the content to the appropriate height and enables scrolling
		 * @param {node} content : The content to be formatted
		 * @param {int} num : The approximate number of items to display face up
		 * @param {float} ht : The total line height of an item
		 */
		InitScrolling : function(content, num, ht){
			for (var k=0; k<content.length; k++) {
				MP_Util.Doc.InitSectionScrolling(content[k], num, ht);
			}
		},
		/**
		 * Formats the section to the appropriate height and enables scrolling
		 * @param {node} sec : The section to be formatted
		 * @param {int} num : The approximate number of items to display face up
		 * @param {float} ht : The total line height of an item
		 */
		InitSectionScrolling : function(sec, num, ht) {
			var th = num * ht
			var totalHeight = th+"em";
			
			sec.style.maxHeight = totalHeight;
			sec.style.overflowY = 'auto';
			sec.style.overflowX = 'hidden';
		},
		InitHovers : function(trg, par, component) {
		    gen = Util.Style.g(trg, par, "DL")
		
		    for (var i = 0, l = gen.length; i < l; i++) {
		        var m = gen[i];
		        if (m) {
		            var nm = Util.gns(Util.gns(m));
		            if (nm) {
		                if (Util.Style.ccss(nm, "hvr")) {
		                    hs(m, nm, component);
		                }
		            }
		        }
		    }
		},
		InitSubToggles : function(par, tog) {
                    var i18nCore = i18n.discernabu;
		    var toggleArray = Util.Style.g(tog, par, "span");
		    for (var k=0; k<toggleArray.length; k++) {
		        Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
		        var checkClosed = Util.gp(Util.gp(toggleArray[k]));
		        if (Util.Style.ccss(checkClosed, "closed")) {
		            toggleArray[k].innerHTML = "+";
		            toggleArray[k].title = i18nCore.SHOW_SECTION;
		        }
		    }
		},
		/** 
		 * Deprecated:  This function will not perform the correct expand all/collapse on the MPagesView.
		 *  This is now handled within the MPageView object definition and in the pageMenu
		 **/
		ExpandCollapseAll: function(ID){
			var i18nCore = i18n.discernabu;
			var tabSection = _g(ID.replace("expAll",""));
			var expNode=_g(ID);
			var allSections=Util.Style.g("section",tabSection);
			if (isExpandedAll) {
				for (var i = 0,asLen=allSections.length; i < asLen; i++) {
					var secHandle = Util.gc(Util.gc(allSections[i]));
					if(secHandle.innerHTML == "-" || secHandle.innerHTML == "+") {
						Util.Style.acss(allSections[i], "closed");
						secHandle.innerHTML = "+";
						secHandle.title = i18nCore.SHOW_SECTION;
					}
					else {
						var allSubSections = Util.Style.g("sub-sec",allSections[i],"div");
						for(var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++) {
							var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
							Util.Style.acss(allSubSections[j], "closed");
							subSecTgl.innerHTML = "+";
							subSecTgl.title = i18nCore.SHOW_SECTION;
						}
					}
				}
				expNode.innerHTML = i18nCore.EXPAND_ALL;
				isExpandedAll = false;
			}
			else {
				for (var i = 0,asLen=allSections.length; i < asLen; i++) {
					var secHandle = Util.gc(Util.gc(allSections[i]));
					if(secHandle.innerHTML == "-" || secHandle.innerHTML == "+") {
						Util.Style.rcss(allSections[i], "closed");
						secHandle.innerHTML = "-";
						secHandle.title = i18nCore.HIDE_SECTION;
					}
					else {
						var allSubSections = Util.Style.g("sub-sec",allSections[i],"div");
						for(var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++) {
							var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
							Util.Style.rcss(allSubSections[j], "closed");
							subSecTgl.innerHTML = "-";
							subSecTgl.title = i18nCore.HIDE_SECTION;
						}
					}
				}
				expNode.innerHTML = i18nCore.COLLAPSE_ALL;
				isExpandedAll = true;
			}
		},
		/**
		 * Adds chart search to the page.
		 * @param {Object} criterion The criterion object
		 * @param {Boolean} inViewPoint Indicator denoting if chart search is to be added in Viewpoint Framework.
		 */
		AddChartSearch: function (criterion, inViewPoint) {
			var csCallback = function (url) {
				try {
					if (url) {
						var fwObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
						fwObj.SetPopupStringProp("REPORT_NAME", "<url>" + url);
						fwObj.SetPopupDoubleProp("WIDTH", 1200);
						fwObj.SetPopupDoubleProp("HEIGHT", 700);
						fwObj.SetPopupBoolProp("SHOW_BUTTONS", 0);
						fwObj.LaunchPopup();
					}
					else {
						MP_Util.LogError("Error retriving URL from search");
					}
				}
				catch (err) {
					alert(i18n.discernabu.CODE_LEVEL);
					MP_Util.LogError("Error creating PVFRAMEWORKLINK window <br />Message: " + err.description + "<br />Name: " + err.name + "<br />Number: " + (err.number & 65535) + "<br />Description: " + err.description); 
				}
			}
			//Check to see if the viewpoint already has a chart search available
			var csEle = _g("chrtSearchBox");
			if(!csEle){
				//Add to viewpoint framework or single page
				var csDiv = Util.cep("div", {
					id : "chrtSearchBox"
				});
				csDiv.innerHTML = "<div id='chart-search-input-box'></div>";
				
				if (inViewPoint) {
					var vpTl = _g("vwpTabList");
					Util.ac(csDiv, vpTl);
				}
				else {
					var pgCtrl = _g("pageCtrl"+criterion.category_mean);
					pgCtrl.parentNode.insertBefore(csDiv, pgCtrl);
				}
				
				var csParams = {
					patientId: criterion.person_id,
					userId: criterion.provider_id,
					callback: csCallback
				};
				try {
					ChartSearchInput.embed('chart-search-input-box', csParams);
				}
				catch (err) {
					MP_Util.LogError("Error calling Chart Search embed <br />Message: " + err.description + "<br />Name: " + err.name + "<br />Number: " + (err.number & 65535) + "<br />Description: " + err.description); 
				}
			}
		},
		/**
		 * Adds the title to the page.
		 * @param {String} title The title of the page to display
		 * @param {Object} bodyTag The body tag associated to the HTML document
		 * @param {Boolean} debugInd Indicator denoting if the mpage should run in debug mode.
		 * @param {Boolean} custInd Indicator denoting if the 'customize' option should be made available to the user for the given layout
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} helpURL The String name of the help file URL to associate to the page.
		 * @param {Object} criterion The object associated to the criterion data
		 * @param {String} categoryMeaning The String name of the MPages View
		 */
		AddPageTitle:function(title,bodyTag,debugInd,custInd,anchorArray,helpFile,helpURL,criterion,categoryMeaning){
			var i18nCore=i18n.discernabu;
			var ar=[];
			var imgSource=criterion.static_content+"/images/3865_16.gif";
			if(categoryMeaning){
				title = "";
				bodyTag = _g(categoryMeaning);
				bodyTag.innerHTML = "";
			}
			else{
				if(bodyTag){
					bodyTag=document.body;
				}
			}
			ar.push("<div class='pg-hd'>");
			ar.push("<h1><span class='pg-title'>",title,"</span></h1><span id='pageCtrl",criterion.category_mean,"' class='page-ctrl'>");

			
            //'as of' date is always to the far left of items
			if (categoryMeaning) {
			    var df = MP_Util.GetDateFormatter();
			    ar.push("<span class='other-anchors'>",i18nCore.AS_OF_TIME.replace("{0}",df.format(new Date(), mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS)),"</span>");
			}
			if(anchorArray){
				for(var x=0,xl=anchorArray.length;x<xl;x++){
				    ar.push("<span class='other-anchors'>" + anchorArray[x] + "</span>");
				}
			}

			if (custInd || categoryMeaning) { //customizable single view or in a view point 
			var pageMenuId = "pageMenu" + criterion.category_mean;
                ar.push("<span id='", pageMenuId, "' class='page-menu'>&nbsp;</span>");
            }
			ar.push("</span></div>");
			bodyTag.innerHTML+=ar.join("");
			return;
		},
		/**
		 * Launches the help file in a new modal window
		 * @param {String} HelpURL The String name of the help file  to associate to the page.
		 */
		LaunchHelpWindow: function (helpURL) {
			 var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
			 MP_Util.LogCclNewSessionWindowInfo(null, helpURL, "mp_core.js", "LaunchHelpWindow");
			 CCLNEWSESSIONWINDOW (helpURL, "_self", wParams, 0, 1);
			 Util.preventDefault();
		},
		AddClearPreferences : function(body,criterion){
			var i18nCore = i18n.discernabu;
			var pageCtrl = _g("pageCtrl"+criterion.category_mean);
			var clearPrefNode = Util.cep("A", {"id": "clearPrefs", "onclick":"javascript:MP_Core.AppUserPreferenceManager.ClearPreferences();"});
			clearPrefNode.innerHTML = i18nCore.CLEAR_PREFERENCES;
			Util.ac(clearPrefNode, pageCtrl)
		},
		AddSavePreferences : function(body,criterion){
			var i18nCore = i18n.discernabu;
			var pageCtrl = _g("pageCtrl"+criterion.category_mean);
			var savePrefNode = Util.cep("A", {"id": "savePrefs", "onclick":"javascript:MP_Core.AppUserPreferenceManager.SavePreferences();"});
			savePrefNode.innerHTML = i18nCore.SAVE_PREFERENCES;
			Util.ac(savePrefNode, pageCtrl)			
		},
		AddCustomizeLink:function(criterion){
			var i18nCore=i18n.discernabu;
			var custNode=_g("custView"+criterion.category_mean);
			if(custNode){
				custNode.innerHTML=i18nCore.CUSTOMIZE;
				var compReportIds=GetPageReportIds();
				if(typeof m_viewpointJSON == "undefined"){
					var cclParams=["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0","^"+criterion.executable+"^","^^","^"+criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+criterion.category_mean+"^",criterion.debug_ind,"value("+compReportIds.join(".0,")+")","1"];
					custNode.onclick=function(){
						CCLLINK("MP_DRIVER",cclParams.join(","),1);
						Util.preventDefault();
					};
				}
				else{
					var js_viewpoint = JSON.parse(m_viewpointJSON).VIEWPOINTINFO_REC;
					var cclParams=["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0","^"+criterion.executable+"^","^"+criterion.static_content.replace(/\\/g,"\\\\")+"^","^"+js_viewpoint.VIEWPOINT_NAME_KEY+"^",criterion.debug_ind,"value("+compReportIds.join(".0,")+")","1", "^" + criterion.category_mean+ "^"];
					custNode.onclick=function(){
						CCLLINK(CERN_driver_script,cclParams.join(","),1);
						Util.preventDefault();
					};
				}
			}
		},
		/**
		 * Allows the consumer of the architecture to render the components that exist either on the tab layout
		 * or the single driving MPage.  For tab based pages, the first tab is loaded by default.
		 */
		RenderLayout : function(){
			//determine if QOC is loading in a viewpoint
			var QOCFlag = 0;
			var CommonDiv = _g("MP_COMMON_ORDERS_V4");
			if(CommonDiv){
				QOCFlag = ($(CommonDiv).css('display') === 'none')?1:0;
			}
			
			// Return to tab being viewed upon refresh
			if (CERN_TabManagers != null && QOCFlag === 0){
				var tabManager = null;
				if (window.name.length > 0){
					var paramList = window.name.split(",");
					MP_Util.DisplaySelectedTab(paramList[0], paramList[1]);				
				}
				else{
					tabManager = CERN_TabManagers[0];
					tabManager.setSelectedTab(true);
					tabManager.loadTab();
				}
			}
			else if (CERN_MPageComponents != null){
				for (var x = 0; x < CERN_MPageComponents.length; x++){
					var comp = CERN_MPageComponents[x];
					if (comp.isDisplayable() && comp.isExpanded() && !comp.isLoaded()) {
						comp.setLoaded(true);
						if(comp.isResourceRequired()){
							comp.RetrieveRequiredResources();
						}
						else{
						    comp.InsertData();						
						}
					}
				}
				for (var x = 0; x < CERN_MPageComponents.length; x++){
					var comp = CERN_MPageComponents[x];
					if (comp.isDisplayable() && !comp.isExpanded() && !comp.isLoaded()) {
						comp.setLoaded(true);
					    if(comp.isResourceRequired()){
							comp.RetrieveRequiredResources();
						}
						else{
						    comp.InsertData();						
						}
					}
				}
			}
		},
		ExpandCollapse : function(){
			var i18nCore = i18n.discernabu;
			var gpp = Util.gp(Util.gp(this));
			if (Util.Style.ccss(gpp, "closed")) {
				Util.Style.rcss(gpp, "closed");
				this.innerHTML = "-";
				this.title = i18nCore.HIDE_SECTION;
			}
			else {
				Util.Style.acss(gpp, "closed");
				this.innerHTML = "+";
				this.title = i18nCore.SHOW_SECTION;
			}
		},
		HideHovers : function(){
			var hovers = Util.Style.g("hover", document.body, "DIV");
			for (var i = hovers.length; i--;) {
				if (Util.gp(hovers[i]).nodeName == "BODY") {
					hovers[i].style.display = 'none';
					Util.de(hovers[i]);
				}
			}
		},
		ReplaceSubTitleText: function (component, text) {
			var compNode = component.getRootComponentNode();
			var subTitle = Util.Style.g("sub-title-disp", compNode, "div");
			if (subTitle) {
				subTitle[0].innerHTML = text;
			}
		},
		ReInitSubTitleText: function(component){
			if(component.getScope() > 0) {
				var st = Util.Style.g("sub-title-disp", component.getRootComponentNode(), "div");
				st[0].innerHTML = CreateSubTitleText(component);
			}
		},
		/*Copyright (c) 2006-2010 Paranoid Ferret Productions.  All rights reserved.

		  Developed by: Paranoid Ferret Productions
		                http://www.paranoidferret.com

			THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
		  CONTRIBUTORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
		  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
		  WITH THE SOFTWARE.*/

		RunAccordion : function(index) {
			var titleAr = [];
			var nID = "Accordion" + index + "Content";
			var TimeToSlide = 100.0;
			var titleDiv = _g("Accordion"+index+"Title");
			var containerDiv = _g("AccordionContainer"+index);
			var component = MP_Util.GetCompObjById(index);
			var location = component.getCriterion().static_content;
			
			//Adjust the pull tab image
			if (Util.Style.ccss(titleDiv, "Expanded")) {
				Util.Style.rcss(titleDiv,"Expanded");
				Util.Style.rcss(containerDiv, "Expanded");
			}
			else {
				Util.Style.acss(titleDiv,"Expanded");
				Util.Style.acss(containerDiv, "Expanded");
			}
			
			if(openAccordion == nID) {
				nID = '';
			}

			setTimeout("MP_Util.Doc.Animate(" + new Date().getTime() + "," + TimeToSlide + ",'" + openAccordion + "','" + nID + "'," + index + ")", 33);
			openAccordion = nID;
		},		
		Animate : function(lastTick, timeLeft, closingId, openingId, compID) {
			var TimeToSlide = timeLeft;
			var curTick = new Date().getTime();
			var elapsedTicks = curTick - lastTick;
			var ContentHeight = 275.0;
		 
			var opening = (openingId == '') ? null : _g(openingId);
			var closing = (closingId == '') ? null : _g(closingId);
					 
			if(timeLeft <= elapsedTicks) {
				if(opening) {
					opening.style.display = 'block';
					opening.style.height = ContentHeight + 'px';
				}
		   
				if(closing) {
					closing.style.display = 'none';
					closing.style.height = '0px';
					var filterListAr = Util.Style.g("acc-filter-list-item"+compID);
					var filtersSelected = MP_Util.Doc.GetSelected(filterListAr);
					//Loop through and get all the values, which are the event sets, and then refresh the component
				}
				return;
			}
		 
			timeLeft -= elapsedTicks;
			var newClosedHeight = Math.round((timeLeft/TimeToSlide) * ContentHeight);

			if(opening) {
				if(opening.style.display != 'block') {
					opening.style.display = 'block';
					opening.style.height = (ContentHeight - newClosedHeight) + 'px';
				}
			}
			if(closing) {
				closing.style.height = newClosedHeight + 'px';
			}

			setTimeout("MP_Util.Doc.Animate(" + curTick + "," + timeLeft + ",'" + closingId + "','" + openingId + "'," + compID + ")", 33);
		},
		GetSelected:function(opt) {
		  var selected = [];
		  var index = 0;
		  var optLen = opt.length;
		  for (var intLoop=0; intLoop < optLen; intLoop++) {
			 if (opt[intLoop].selected) {
				index = selected.length;
				selected[index] = {};
				selected[index].value = opt[intLoop].value;
				selected[index].index = intLoop;
			 }
		  }
		  return selected;
	    },
		CreateLookBackMenu:function(component, loadInd, text) {
			var i18nCore=i18n.discernabu;
			var ar = [];
			var style = component.getStyles();
			var ns = style.getNameSpace();
			var compId = style.getId();
			var mnuCompId = component.getComponentId();
			var loc = component.getCriterion().static_content;
			var mnuItems = [];
			var mnuId = compId+"Mnu";
			var scope = component.getScope();
			var lookBackText = "";
			var lookBackUnits = "";
			var lookBackType = 0;
			var filterMsg = "";
			var filterMsgElementTitle = "";
			var hasFilters = false;
			
			if(component.m_grouper_arr.length === 0) {
				component.setCompFilters(false);
			}
			else {
				component.setCompFilters(true);
			}
			
			if(loadInd === 2) {
				var lbMenu = _g("lb"+mnuId);
				if (component.hasCompFilters()) {
					if(!text) {
						MP_Util.LaunchCompFilterSelection(mnuCompId, i18nCore.FACILITY_DEFINED_VIEW, "", 2);
					}
					else {
						var filterMsgElement = _g("cf"+mnuCompId+"msg");
						filterMsgElementTitle = filterMsgElement.title;
						filterMsg = filterMsgElement.innerHTML;
					}
				}
				
				if (lbMenu){
					 //Clear contents of the menu
					lbMenu.innerHTML = "";
				}
			}
			
			if (!text) {
				var mnuDisplay = CreateSubTitleText(component);
			}
			else {
				var mnuDisplay = text;
			}
			
			var menuItems = component.getLookbackMenuItems();
			if (menuItems) {
				for (var x=0;x<menuItems.length;x++) {
					mnuItems[x] = new Array();
					lookBackUnits = parseInt(menuItems[x].getDescription(),10);
					var tempTypeId = menuItems[x].getId();
					switch(tempTypeId) {
						case 1:
							lookBackType = 1;
						break;
						case 2:
							lookBackType = 2;
						break;
						case 3:
							lookBackType = 3;
						break;
						case 4:
							lookBackType = 4;
						break;
						case 5:
							lookBackType = 5;
						break;
						default:
							lookBackType = tempTypeId;
						break;
					}
					if(scope>0){
						if(lookBackUnits > 0 && lookBackType > 0) {
							var replaceText ="";
							switch(lookBackType){
								case 1:
									replaceText = i18nCore.LAST_N_HOURS.replace("{0}", lookBackUnits);
								break;
								case 2:
									replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
								break;
								case 3:
									replaceText = i18nCore.LAST_N_WEEKS.replace("{0}", lookBackUnits);
								break;
								case 4:
									replaceText = i18nCore.LAST_N_MONTHS.replace("{0}", lookBackUnits);
								break;
								case 5:
									replaceText = i18nCore.LAST_N_YEARS.replace("{0}", lookBackUnits);
								break;
								default:
									replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
								break;
							}
							switch(scope){
								case 1:
									lookBackText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
								break;
								case 2:
									lookBackText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
								break;
							}
						}
						else {
							switch(scope) {
								case 1:
									lookBackText = i18nCore.All_VISITS;
									break;
								case 2:
									lookBackText = i18nCore.SELECTED_VISIT;
									break;
							}
						}
					}
					mnuItems[x][0] = lookBackText;
					mnuItems[x][1] = lookBackUnits;
					mnuItems[x][2] = lookBackType;
				}
			
				ar.push("<div id='lb",mnuId,"'><div id='stt", compId,"' class='sub-title-disp lb-drop-down'>");
				ar.push("<span id='lbMnuDisplay",mnuCompId,"' onclick='MP_Util.LaunchMenu(\"",mnuId,'", "',compId,"\");'>",mnuDisplay,"<a id='",ns,"Drop'><img src='",loc,"/images/3943_16.gif'></a></span><span id='cf",mnuCompId,"msg' class='filter-applied-msg' title='",filterMsgElementTitle,"'>",filterMsg,"</span></div>");
				ar.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='",mnuId,"'><div class='mnu-labelbox'>",mnuDisplay,"</div><div class='mnu-contentbox'>");
				for (var x=0,xl=mnuItems.length;x<xl;x++){
					var item = mnuItems[x];
					ar.push("<div><span class='lb-mnu' id='lb",compId,x,"' onclick='MP_Util.LaunchLookBackSelection(\"",mnuCompId,'\",',item[1],',\"',item[2],"\");'>", item[0], "</span></div>");
				}
				ar.push("</div></div></div>")
			}
			else {
				ar.push("<div id='lb",mnuId,"'><div id='stt", compId,"' class='sub-title-disp lb-drop-down'>");
				ar.push("<span id='lbMnuDisplay",mnuCompId,"'>",mnuDisplay,"</span><span id='cf",mnuCompId,"msg' class='filter-applied-msg' title='",filterMsgElementTitle,"'>",filterMsg,"</span></div></div>")
			}
			for(var y = 0; y < 10; y++){
				if(component.getGrouperLabel(y) || component.getGrouperCatLabel(y)){
					hasFilters = true;
					break;
				}
			}
			if (hasFilters === true && loadInd === 1) {
				ar.push("<div id='AccordionContainer", mnuCompId, "' class='accordion-container'>");
				ar.push("<div id='Accordion", mnuCompId, "Content' class='accordion-content'><div id='Accordion", mnuCompId, "ContentDiv' class='acc-content-div'></div><div class='lb-pg-hd lb-page-ctrl'><a class='setDefault' href='#' onclick='MP_Core.AppUserPreferenceManager.SaveCompPreferences(",mnuCompId,"); return false;'>",i18nCore.SET_AS_DEFAULT,"</a><a class='resetAll' href='#' onclick='MP_Core.AppUserPreferenceManager.ClearCompPreferences(",mnuCompId,"); return false;'>",i18nCore.RESET_ALL,"</a></div></div>");
				ar.push("<div id='Accordion", mnuCompId, "Title' class='accordion-title' onclick='MP_Util.Doc.RunAccordion(", mnuCompId, ");' onselectstart='return false;'></div></div>");
			}
			
			switch(loadInd) {
				case 2:
					lbMenu.innerHTML = ar.join('');					
				break;
				
				default:
					var arHtml = ar.join("");
					return arHtml;
			}
		}
	};
	
    function launchSelectLayout(menuId, that, initialColCnt) {
        var i18nCore = i18n.discernabu;
        var optMenu = _g("optMenuConfig" + menuId);
        if (!optMenu) {
            optMenu = Util.cep("div", {
                className: "opts-menu-layout-content menu-hide",
                id: "optMenuConfig" + menuId
            });
            var optMenuJsHTML = [];
			var layoutClasses = ['view-layout1', 'view-layout2', 'view-layout3'];
			var i18nCore = i18n.discernabu;
			layoutClasses[initialColCnt - 1] += " view-layout-selected";
			 optMenuJsHTML.push("<div class='" + layoutClasses[0] + "' data-cols='1'>" + i18nCore.COLUMN_ONE + "</div><div class='" + layoutClasses[1] + "' data-cols='2'>" + i18nCore.COLUMN_TWO + "</div><div class='" + layoutClasses[2] + "' data-cols='3'>" + i18nCore.COLUMN_THREE + "</div>"); 
		   optMenu.innerHTML = optMenuJsHTML.join("");
            Util.ac(optMenu, document.body);
			
            Util.addEvent(_g("optMenuConfig" + menuId), "click", function (e) {				
                var target = e.target || e.srcElement;
				var cols = target.getAttribute("data-cols");
				$("#optMenuConfig" + menuId + " div").removeClass("view-layout-selected");
				Util.Style.acss(target, "view-layout-selected");
				
				var catMean;
				if (typeof m_viewpointJSON == "string") {
					MP_Util.RetrieveCookie();
					var vpCookieVal = MP_Util.GetCookieProperty("viewpoint", "viewCatMean")
					catMean = (vpCookieVal) ? vpCookieVal : $(".vwp-cached:first").attr("id");
				}
				changeLayout(parseInt(cols, 10), catMean);
            });		
            InitPageOptMenu(optMenu, menuId, true);
        }
        OpenCompOptMenu(optMenu, menuId, that);
    }
    function launchQOCSelectLayout(menuId, that, initialColCnt){
    	var i18nCore = i18n.discernabu;
        var optMenu = _g("optMenuConfig" + menuId);
        if (!optMenu) {
            optMenu = Util.cep("div", {
                className: "opts-menu-layout-content menu-hide",
                id: "optMenuConfig" + menuId
            });
            var optMenuJsHTML = [];
    		var layoutClasses = ['view-layout1', 'view-layout2', 'view-layout3', 'view-layout4', 'view-layout5'];
    		var i18nCore = i18n.discernabu;
    		layoutClasses[initialColCnt - 1] += " view-layout-selected";
    		optMenuJsHTML.push("<div class='" + layoutClasses[0] + "' data-cols='1'>" + i18nCore.COLUMN_ONE + "</div><div class='" + layoutClasses[1] + "' data-cols='2'>" + i18nCore.COLUMN_TWO + "</div><div class='" + layoutClasses[2] + "' data-cols='3'>" + i18nCore.COLUMN_THREE + "</div><div class='" + layoutClasses[3] + "' data-cols='4'>" + i18nCore.COLUMN_FOUR + "</div><div class='" + layoutClasses[4] + "' data-cols='5'>" + i18nCore.COLUMN_FIVE + "</div>");
    		optMenu.innerHTML = optMenuJsHTML.join("");
            Util.ac(optMenu, document.body);
    		
            Util.addEvent(_g("optMenuConfig" + menuId), "click", function (e) {				
                var target = e.target || e.srcElement;
    			var cols = target.getAttribute("data-cols");
    			$("#optMenuConfig" + menuId + " div").removeClass("view-layout-selected");
    			Util.Style.acss(target, "view-layout-selected");
    			var activeViewDiv = Util.Style.g("div-tab-item-selected", document.body, "DIV")[0];
    			if (activeViewDiv){
    				var catMean = activeViewDiv.id;
    				changeQOCLayout(parseInt(cols, 10), catMean);
    			}
            });		
            InitPageOptMenu(optMenu, menuId, true);
        }
        OpenCompOptMenu(optMenu, menuId, that);
    }
	
	function changeLayout(newColCnt, catMean) {
		var viewpointState = (catMean) ? "#" + catMean + " " : "";
		var colClasses = ["one-col", "two-col", "three-col"]
		var curColCnt;
		var curColGroupClass = $(viewpointState + '.col-group:last').attr('class').replace("col-group ", "");

		switch (curColGroupClass) {
			case "three-col":
				curColCnt = 3;
				break;
			case "two-col":
				curColCnt = 2;
				break;
			case "one-col":
				curColCnt = 1;
				break;
		}

		if(newColCnt < curColCnt) {//removing columns
			if(newColCnt === 1) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section');
				$(viewpointState + '.col-group:last .col1').append(comps);
				$(viewpointState + '.col-group:last .col2').remove();
				$(viewpointState + '.col-group:last .col3').remove();
			}
			else if(newColCnt === 2) {
				var comps = $(viewpointState + '.col-group:last .col3 .section');
				$(viewpointState + '.col-group:last .col2').append(comps);
				$(viewpointState + '.col-group:last .col3').remove();
			}
			//save new layout
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(null, "", null, true);
			}, 0);

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
		}
		else if(newColCnt > curColCnt) {//adding columns
			if((newColCnt - curColCnt) === 1) {
				var colHTML = (curColCnt == 1) ? '<div class="col2"></div>' : '<div class="col3"></div>';
				$(viewpointState + '.col-outer1:last').append(colHTML);
			}
			else if((newColCnt - curColCnt) === 2) {
				$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div>');
			}

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
			MP_Util.Doc.InitDragAndDrop(catMean);
		}
	}
	function changeQOCLayout(newColCnt, catMean) {
		var viewpointState = (catMean) ? "#" + catMean + " " : "";
		var colClasses = ["one-col", "two-col", "three-col", "four-col", "five-col"]
		var curColCnt;
		var curColGroupClass = $(viewpointState + '.col-group:last').attr('class').replace("col-group ", "");

		switch (curColGroupClass) {
			case "five-col":
				curColCnt = 5;
				break;
			case "four-col":
				curColCnt = 4;
				break;
			case "three-col":
				curColCnt = 3;
				break;
			case "two-col":
				curColCnt = 2;
				break;
			case "one-col":
				curColCnt = 1;
				break;
		}

		if(newColCnt < curColCnt) {//removing columns
			if(newColCnt === 1) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section');
				$(viewpointState + '.col-group:last .col1').append(comps);
				$(viewpointState + '.col-group:last .col2').remove();
				$(viewpointState + '.col-group:last .col3').remove();
				$(viewpointState + '.col-group:last .col4').remove();
				$(viewpointState + '.col-group:last .col5').remove();
			}
			else if(newColCnt === 2) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section').not(viewpointState + '.col2 .section');
				$(viewpointState + '.col-group:last .col2').append(comps);
				$(viewpointState + '.col-group:last .col3').remove();
				$(viewpointState + '.col-group:last .col4').remove();
				$(viewpointState + '.col-group:last .col5').remove();
			}
			else if(newColCnt === 3) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section').not(viewpointState + '.col2 .section').not(viewpointState + '.col3 .section');
				$(viewpointState + '.col-group:last .col3').append(comps);
				$(viewpointState + '.col-group:last .col4').remove();
				$(viewpointState + '.col-group:last .col5').remove();
			}
			else if(newColCnt === 4) {
				var comps = $(viewpointState + '.col-group:last .col5 .section');
				$(viewpointState + '.col-group:last .col4').append(comps);
				$(viewpointState + '.col-group:last .col5').remove();
			}
			//save new layout
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, catMean);
			}, 0);

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
		}
		else if(newColCnt > curColCnt) {//adding columns
			if((newColCnt - curColCnt) === 1) {
				if (newColCnt === 2){
					$(viewpointState + '.col-outer1:last').append('<div class="col2"></div>');
				}
				else if (newColCnt === 3){
					$(viewpointState + '.col-outer1:last').append('<div class="col3"></div>');
				}
				else if (newColCnt === 4){
					$(viewpointState + '.col-outer1:last').append('<div class="col4"></div>');
				}
				else if(newColCnt === 5){
					$(viewpointState + '.col-outer1:last').append('<div class="col5"></div>');
				}
			}
			else if((newColCnt - curColCnt) === 2) {
				if (newColCnt === 3){
					$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div>');
				}
				else if (newColCnt === 4){
					$(viewpointState + '.col-outer1:last').append('<div class="col3"></div><div class="col4"></div>');
				}
				else if(newColCnt === 5){
					$(viewpointState + '.col-outer1:last').append('<div class="col4"></div><div class="col5"></div>');
				}
			}
			else if((newColCnt - curColCnt) === 3) {
				if (newColCnt === 4){
					$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div><div class="col4"></div>');
				}
				else if(newColCnt === 5){
					$(viewpointState + '.col-outer1:last').append('<div class="col3"></div><div class="col4"></div><div class="col5"></div>');
				}
			}
			else if((newColCnt - curColCnt) === 4) {
				$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div><div class="col4"></div><div class="col5"></div>');
			}

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
			MP_Util.Doc.InitQOCDragAndDrop(catMean);
		}
	}

	function launchThemeMenu(componentId, fullId, secId, that) {
	        	var i18nCore = i18n.discernabu;
	        	var optMenu = _g("optMenuConfig" + componentId);        	
	        	if (!optMenu) {   		
	        		optMenu = Util.cep("div", { "className": "opts-menu-config-content menu-hide", "id": "optMenuConfig" + componentId });
	        		var optMenuJsHTML = [];        		
	        		optMenuJsHTML.push("<div title = '", i18nCore.COLOR_STANDARD, "' class='opts-menu-config-item opt-config-mnu-lightgrey' data-color='lightgrey' id='optConfigMnuLightGrey", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_BROWN, "' class='opts-menu-config-item opt-config-mnu-brown' data-color='brown' id='optConfigMnuBrown", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_CERNER_BLUE, "' class='opts-menu-config-item opt-config-mnu-cernerblue' data-color='cernerblue' id='optConfigMnuCernerBlue", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_DARK_GREEN, "' class='opts-menu-config-item opt-config-mnu-darkgreen' data-color='darkgreen' id='optConfigMnuDarkGreen", componentId, "'></div>",     		
					"<div title = '", i18nCore.COLOR_GREEN, "' class='opts-menu-config-item opt-config-mnu-green' data-color='green' id='optConfigMnuGreen", componentId, "'></div>",									
					"<div title = '", i18nCore.COLOR_GREY, "' class='opts-menu-config-item opt-config-mnu-grey' data-color='grey' id='optConfigMnuGrey", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_LIGHT_BLUE, "' class='opts-menu-config-item opt-config-mnu-lightblue' data-color='lightblue' id='optConfigMnuLightBlue", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_NAVY, "' class='opts-menu-config-item opt-config-mnu-navy' data-color='navy' id='optConfigMnuNavy", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_ORANGE, "' class='opts-menu-config-item opt-config-mnu-orange' data-color='orange' id='optConfigMnuOrange", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_PINK, "' class='opts-menu-config-item opt-config-mnu-pink' data-color='pink' id='optConfigMnuPink", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_PURPLE, "' class='opts-menu-config-item opt-config-mnu-purple' data-color='purple' id='optConfigMnuPurple", componentId, "'></div>",
					"<div title = '", i18nCore.COLOR_YELLOW, "' class='opts-menu-config-item opt-config-mnu-yellow' data-color='yellow' id='optConfigMnuYellow", componentId, "'></div>");
	           		        		
	        		optMenu.innerHTML = optMenuJsHTML.join("");
	
		    		Util.ac(optMenu, document.body);  //actual contents of the menu are appended to body and positioned in launchOptMenu
					
	            Util.addEvent(_g("optMenuConfig" + componentId), "click", 
	    				function(e){
	                		var target = e.target || e.srcElement;
	                		var color = target.getAttribute('data-color');
	                		changeThemeColor(componentId, color, secId);
	    				}
	            );
	            
					InitCompOptMenu(optMenu, componentId, true);
	        	}			
	
			OpenCompOptMenu(optMenu, fullId, that);
	}
	function launchQOCThemeMenu(componentId, fullId, secId, that, selectedViewId) {
    	var i18nCore = i18n.discernabu;
    	var optMenu = _g("optMenuConfig" + componentId);        	
    	if (!optMenu) {   		
    		optMenu = Util.cep("div", { "className": "opts-menu-config-content menu-hide", "id": "optMenuConfig" + componentId });
    		var optMenuJsHTML = [];        		
    		optMenuJsHTML.push("<div title = '", i18nCore.COLOR_STANDARD, "' class='opts-menu-config-item opt-config-mnu-lightgrey' data-color='lightgrey' id='optConfigMnuLightGrey", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_BROWN, "' class='opts-menu-config-item opt-config-mnu-brown' data-color='brown' id='optConfigMnuBrown", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_CERNER_BLUE, "' class='opts-menu-config-item opt-config-mnu-cernerblue' data-color='cernerblue' id='optConfigMnuCernerBlue", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_DARK_GREEN, "' class='opts-menu-config-item opt-config-mnu-darkgreen' data-color='darkgreen' id='optConfigMnuDarkGreen", componentId, "'></div>",     		
			"<div title = '", i18nCore.COLOR_GREEN, "' class='opts-menu-config-item opt-config-mnu-green' data-color='green' id='optConfigMnuGreen", componentId, "'></div>",									
			"<div title = '", i18nCore.COLOR_GREY, "' class='opts-menu-config-item opt-config-mnu-grey' data-color='grey' id='optConfigMnuGrey", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_LIGHT_BLUE, "' class='opts-menu-config-item opt-config-mnu-lightblue' data-color='lightblue' id='optConfigMnuLightBlue", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_NAVY, "' class='opts-menu-config-item opt-config-mnu-navy' data-color='navy' id='optConfigMnuNavy", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_ORANGE, "' class='opts-menu-config-item opt-config-mnu-orange' data-color='orange' id='optConfigMnuOrange", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_PINK, "' class='opts-menu-config-item opt-config-mnu-pink' data-color='pink' id='optConfigMnuPink", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_PURPLE, "' class='opts-menu-config-item opt-config-mnu-purple' data-color='purple' id='optConfigMnuPurple", componentId, "'></div>",
			"<div title = '", i18nCore.COLOR_YELLOW, "' class='opts-menu-config-item opt-config-mnu-yellow' data-color='yellow' id='optConfigMnuYellow", componentId, "'></div>");
       		        		
    		optMenu.innerHTML = optMenuJsHTML.join("");

    		Util.ac(optMenu, document.body);  //actual contents of the menu are appended to body and positioned in launchOptMenu
			
        Util.addEvent(_g("optMenuConfig" + componentId), "click", 
				function(e){
            		var target = e.target || e.srcElement;
            		var color = target.getAttribute('data-color');
            		changeQOCThemeColor(componentId, color, secId, selectedViewId);
				}
        );
        
			InitCompOptMenu(optMenu, componentId, true);
    	}			

    	OpenCompOptMenu(optMenu, fullId, that);
	}
	
	function changeThemeColor(componentId,color, styleId){
		var section = _g(styleId);
		if (section){
		var colorString = "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow";
			//a color is found in the class name so replace it with ""
			if (colorString.indexOf(color)>= 0) {
				var colorRegExp = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/;
				section.className = section.className.replace(colorRegExp, "");
			}
			
			//add the new color so it changes for the user
			Util.Style.acss(section, color);
			var component = MP_Util.GetCompObjById(componentId);
			component.setCompColor(color);
			//add the color to the component properties
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, color, null, false);
			}, 0);
		}
	}
	function changeQOCThemeColor(componentId,color, styleId, selectedViewId){
		var section = _g(styleId);
		if (section){
		var colorString = "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow";
			//a color is found in the class name so replace it with ""
			if (colorString.indexOf(color)>= 0) {
				var colorRegExp = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/;
				section.className = section.className.replace(colorRegExp, "");
			}
			
			//add the new color so it changes for the user
			Util.Style.acss(section, color);
			var component = MP_Util.GetCompObjById(componentId);
			component.setCompColor(color);
			//add the color to the component properties
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, selectedViewId);
			}, 0);
		}
	}
	
	function launchSetState(componentId, defStateEl) {
		var component = MP_Util.GetCompObjById(componentId);
		var curExpColState = component.isExpanded();
		component.setExpandCollapseState(!curExpColState);
		var checkSpan = _gbt("span", defStateEl)[0];

		if(!curExpColState) {
			if(checkSpan) {
				Util.Style.acss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "1", false);
			}, 0);
		}
		else {
			if(checkSpan) {
				Util.Style.rcss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "0", false);
			}, 0);
		}
	}
	function launchQOCSetState(componentId, defStateEl, selectedViewId) {
		var component = MP_Util.GetCompObjById(componentId);
		var curExpColState = component.isExpanded();
		component.setExpandCollapseState(!curExpColState);
		var checkSpan = _gbt("span", defStateEl)[0];

		if(!curExpColState) {
			if(checkSpan) {
				Util.Style.acss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, selectedViewId);
			}, 0);
		}
		else {
			if(checkSpan) {
				Util.Style.rcss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, selectedViewId);
			}, 0);
		}
	}

	function InitPageOptMenu(inMenu, componentId, isSubMenu) {
		var closeMenu = function(e) {
			if(!e) {
				e = window.event;
			}

			var resetPageMenu = function() {
				var pageMenu = _g(componentId);
				if(Util.Style.ccss(pageMenu, "page-menu-open")) {
					Util.Style.rcss(pageMenu, "page-menu-open")
				}
			}
			var relTarg = e.relatedTarget || e.toElement;
			var mainMenu = _g("moreOptMenu" + componentId);

			if(isSubMenu) {
				var target = e.target || e.srcElement;
			}
			if(relTarg) {
				if(!Util.Style.ccss(relTarg, "opts-menu-layout-content")) {
					if(mainMenu) {
						Util.Style.acss(mainMenu, "menu-hide");
						resetPageMenu();
					}
					if(isSubMenu) {
						if(Util.Style.ccss(target, "opts-menu-layout-content") && !Util.Style.ccss(relTarg, "opts-menu-content")) {
							if(_g("moreOptMenu" + componentId)) {
								Util.Style.acss(_g("moreOptMenu" + componentId), "menu-hide");
							}
						}
					}
					if(_g("optMenuConfig" + componentId)) {
						Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
					}
				}
			}
			else {
				if(mainMenu) {
					Util.Style.acss(mainMenu, "menu-hide");
					resetPageMenu();
				}
			}
			Util.cancelBubble(e);
		};
		$(inMenu).mouseleave(closeMenu);
	}

    function InitCompOptMenu(inMenu, componentId, isSubMenu) {
        var closeMenu = function (e) {
                if (!e) {
                    e = window.event;
                }
                var relTarg = e.relatedTarget || e.toElement;
                var mainMenu = _g("moreOptMenu" + componentId);
				if (isSubMenu) {
					var target = e.target || e.srcElement;
				}
                if (relTarg) {
                    if (!Util.Style.ccss(relTarg, "opts-menu-config-content")) {
                        if (mainMenu) {
                            Util.Style.acss(mainMenu, "menu-hide");
                        }
						if (isSubMenu) {
							Util.Style.acss(inMenu, "menu-hide");
							if (Util.Style.ccss(target, "opts-menu-config-content") && !Util.Style.ccss(relTarg, "opts-menu-content")) {
								if (_g("moreOptMenu" + componentId)) {
									Util.Style.acss(_g("moreOptMenu" + componentId), "menu-hide");
								}				
							}
						}
                         if (_g("optMenuConfig" + componentId)) {
                             Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
                         }

                    }
			}
			else {
					if (mainMenu){
						Util.Style.acss(mainMenu, "menu-hide");
					}
                }
                Util.cancelBubble(e);
            };
        $(inMenu).mouseleave(closeMenu);
    }

	/** 
	 * Open the options menu within the new order entry component
	 * @param {node} menu : The menu node
	 * @param {string} sectionId : The html id of the section containing the menu
	 */
	function OpenCompOptMenu(menu, sectionId, that) {
		var verticalOffset = 30;
		if(Util.Style.ccss(menu, "menu-hide")) {
			Util.preventDefault();
			Util.Style.rcss(menu, "menu-hide");

			if(that) {
				var ofs = Util.goff(that);
				var moreMenu = Util.gns(that);
				var thisWidth = that.offsetWidth;
				var divOfs = menu.offsetWidth;

				var vpOfs = ofs[0] - divOfs;
				if(vpOfs > 0) {
					menu.style.left = (vpOfs - 2) + 'px';
					//  Util.Style.acss(mpDiv, 'hml-mpd-lt');
				}
				else {
					menu.style.left = (ofs[0] + thisWidth + 6) + 'px';
					//  Util.Style.acss(mpDiv, 'hml-mpd-rt');

				}
				menu.style.top = (ofs[1] - 5) + 'px';
			}
			else {
				var menuId="#mainCompMenu"+sectionId;
				var menuElement = $(menuId);
				if(menuElement.length){
					//Component menu logic
					menu.style.left=($(menuElement).offset().left - 125)+"px";
					menu.style.top=($(menuElement).offset().top + 18)+"px";
				}
				else{
					//Page level menu logic
					var vp = gvs();
					var sec = _g(sectionId);
					var ofs = Util.goff(sec);
					menu.style.left = (ofs[0] + sec.offsetWidth - menu.offsetWidth) + 'px';
					menu.style.top = (ofs[1] + verticalOffset) + 'px';
				}
			}
		}
		else {
			Util.Style.acss(menu, "menu-hide");
		}
	}
	
    function GetPreferenceIdentifier(){
        var prefIdentifier = "";
        if (CERN_TabManagers != null) {
            for (var x = CERN_TabManagers.length; x--;) {
                var tabManager = CERN_TabManagers[x];
                if (tabManager.getSelectedTab()) {
                    var tabItem = tabManager.getTabItem();
                    return tabItem.prefIdentifier;
                }
            }
        }
        else if (CERN_MPageComponents != null) {
            for (var x = CERN_MPageComponents.length; x--;) {
                var criterion = CERN_MPageComponents[x].getCriterion();
                return criterion.category_mean;
            }
        }
        return prefIdentifier;
    }
    function GetPageReportIds(){
        var ar = [];
        if (CERN_TabManagers != null) {
            for (var x = CERN_TabManagers.length; x--;) {
                var tabManager = CERN_TabManagers[x];
                if (tabManager.getSelectedTab()) {
                    var tabItem = tabManager.getTabItem();
                    var components = tabItem.components;
                    if (components != null && components.length > 0) {
                        for (var y = components.length; y--;) {
                            ar.push(components[y].getReportId())
                        }
                    }
                    break;
                }
            }
        }
        else if (CERN_MPageComponents != null) {
            for (var x = CERN_MPageComponents.length; x--;) {
                ar.push(CERN_MPageComponents[x].getReportId());
            }
        }
        return ar;
    }
	
    function GetComponentArray(components){
        var grpAr = [];
        var colAr = [];
        var rowAr = [];
        var curCol = -1;
        var curGrp = -1;
        
        var sHTML = [];
        
        //first layout the group/columns/rows of components
        if (components != null) {
            components.sort(SortMPageComponents);
            
            for (var x = 0, xl = components.length; x < xl; x++) {
                var component = components[x];
                if (CERN_MPageComponents == null) 
                    CERN_MPageComponents = [];
                CERN_MPageComponents.push(component);

                if (component.isDisplayable()) { //based on filter logic, only display if criteria is met
                    var compGrp = component.getPageGroupSequence();
                    var compCol = component.getColumn();
                    
                    if (compGrp != curGrp) {
                        curCol = -1;
                        colAr = [];
                        grpAr.push(colAr);
                        curGrp = compGrp;
                    }
                    
                    if (compCol != curCol) {
                        rowAr = [];
                        colAr.push(rowAr);
                        curCol = compCol;
                    }
                    rowAr.push(component);
                }
            }
        }
        return grpAr;
    }
    function CreateCustomizeLiquidLayout(components, parentNode){
        var sHTML = [];
        var grpAr = GetComponentArray(components);
        sHTML.push("<div class=pref-columns>");
        for (var x = 0, xl = grpAr.length; x < xl; x++) {
            colAr = grpAr[x];
            sHTML.push("<div>");
            var colLen = colAr.length;
			//always allow for a 3 column custimization
			sHTML.push("<div class='col-group three-col'>");
            sHTML.push("<div class='col-outer2'><div class='col-outer1'>");
            
            for (var y = 0; y < colLen; y++) {
                var comps = colAr[y];
                var colClassName = "col" + (y + 1) + " cust-col";
                sHTML.push("<div class='", colClassName, "'>")
                for (var z = 0, zl = comps.length; z < zl; z++) {
                    sHTML.push(CreateCompDiv(comps[z]));
                }
                sHTML.push("</div>");
            }
            for (var y = colLen + 1; y <= 3; y++) {
                var colClassName = "col" + (y) + " cust-col";
                sHTML.push("<div class='", colClassName, "'></div>")
            }
            sHTML.push("</div></div></div></div>");
        }
        sHTML.push("</div>");
        parentNode.innerHTML += sHTML.join("");
    }
    
    function CreateLiquidLayout(components, parentNode, disableMenu) {
    	var grpAr = GetComponentArray(components);
    	var sHTML = [];
    	for(var x = 0, xl = grpAr.length; x < xl; x++){
    		colAr = grpAr[x];
    		sHTML.push("<div>");
    		var colLen = colAr.length;
    		switch(colLen){
    			case 1:
    				sHTML.push("<div class='col-group one-col'>");
    				break;
    			case 2:
    				sHTML.push("<div class='col-group two-col'>");
    				break;
    			case 3:
    				sHTML.push("<div class='col-group three-col'>");
    				break;
    			case 4:
    				sHTML.push("<div class='col-group four-col'>");
    				break;
    			default:
    				sHTML.push("<div class='col-group five-col'>");
    		}
    		sHTML.push("<div class='col-outer2'><div class='col-outer1'>");
    		for(var y = 0; y < colLen; y++){
    			var colClassName = "col" + (y+1);
    			var comps = colAr[y];
    			sHTML.push("<div class='",colClassName,"'>");
    			for(var z = 0, zl = comps.length; z < zl; z++){
    				sHTML.push(CreateCompDiv(comps[z], disableMenu));
    			}
    			sHTML.push("</div>");
    		}
    		sHTML.push("</div></div></div></div>");
    	}
    	parentNode.innerHTML += sHTML.join("");
    }
    function UpdateQOCComponentsWithUserPrefs(bedrockComponentArr, userPrefComponentArr, criterion, MPageObj){
        var isViewPoint = null
        var colorString = "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow";
        var colorRegExp = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/;
        var style = null;
        var compClassName = null;
        
        var compClassName = null;
        if (MPageObj) {
            isViewPoint = MPageObj.getViewpointIndicator();
        }
        for (var x = 0, xl = userPrefComponentArr.length; x < xl; x++) {
            var userPrefComp = userPrefComponentArr[x];
            var isUserPrefPrsnlFavComp = true;
            for (var y = 0, yl = bedrockComponentArr.length; y < yl; y++) {
                var bedrockComp = bedrockComponentArr[y];
                var mnuCompId = bedrockComp.getComponentId();
                if (mnuCompId === userPrefComp.id) {
                    isUserPrefPrsnlFavComp = false;
                    bedrockComp.setColumn(userPrefComp.col_seq);
                    bedrockComp.setSequence(userPrefComp.row_seq);
                    bedrockComp.setPageGroupSequence(1);
                    style = bedrockComp.getStyles();
                    compClassName = style.getClassName();
                    if (userPrefComp.compThemeColor) {
                        //If there is a userdefined color for QOC clear the organization defined color first.
                        style.setClassName(compClassName.replace(colorRegExp, ""));
                        //Add the userdefined color
                        bedrockComp.setCompColor(userPrefComp.compThemeColor);
                    }
                    bedrockComp.setExpanded(userPrefComp.expanded);
                }
            }
            //if user preferences component does not exist in "bedrock" list, then it is a personal fav
            //component and a whole new component needs to be created
            if (isUserPrefPrsnlFavComp) {
                var component = new OrderSelectionComponent();
                component.setCriterion(criterion);
                component.setStyles(new OrderSelectionComponentStyle());
                component.setCustomizeView(false);
                component.setComponentId(userPrefComp.id);
                component.setReportId(userPrefComp.reportId);
                component.setFavFolderId(userPrefComp.reportId);
                component.setLabel(userPrefComp.label);
                component.setExpanded(userPrefComp.expanded);
                component.setColumn(userPrefComp.col_seq);
                component.setSequence(userPrefComp.row_seq);
                component.setPageGroupSequence(userPrefComp.group_seq);
                component.setDisplayEnabled(true);
                if (isViewPoint) {
                    component.setModalScratchPadEnabled(1);
                }
                var style = component.getStyles();
                style.setComponentId(userPrefComp.id);
                if (userPrefComp.compThemeColor) {
                    component.setCompColor(userPrefComp.compThemeColor);
                    style.setColor(userPrefComp.compThemeColor);
                }
                if (userPrefComp.lookbackunits) {
                    component.setLookbackUnits(userPrefComp.lookbackunits);
                }
                if (userPrefComp.lookbacktypeflag) {
                    component.setLookbackUnitTypeFlag(userPrefComp.lookbacktypeflag);
                }
                if (userPrefComp.grouperFilterLabel) {
                    component.setGrouperFilterLabel(userPrefComp.grouperFilterLabel);
                }
                else {
                    component.setGrouperFilterLabel("");
                }
                if (userPrefComp.grouperFilterCatLabel) {
                    component.setGrouperFilterCatLabel(userPrefComp.grouperFilterCatLabel);
                }
                else {
                    component.setGrouperFilterCatLabel("");
                }
                if (userPrefComp.grouperFilterCriteria) {
                    component.setGrouperFilterCriteria(userPrefComp.grouperFilterCriteria);
                }
                else {
                    component.setGrouperFilterCriteria(null);
                }
                
                if (userPrefComp.grouperFilterCatalogCodes) {
                    component.setGrouperFilterCatalogCodes(userPrefComp.grouperFilterCatalogCodes);
                }
                else {
                    component.setGrouperFilterCatalogCodes(null);
                }
                
                if (userPrefComp.selectedTimeFrame) {
                    component.setSelectedTimeFrame(userPrefComp.selectedTimeFrame);
                }
                else {
                    component.setSelectedTimeFrame(null);
                }
                if (userPrefComp.selectedDataGroup) {
                    component.setSelectedDataGroup(userPrefComp.selectedDataGroup);
                }
                else {
                    component.setSelectedDataGroup(null);
                }
                
                //add component to updated "bedrock" list
                bedrockComponentArr.push(component);
            }
        }
        return bedrockComponentArr;
    }
	function SetupExpandCollapse() {
		var i18nCore = i18n.discernabu;
		//set up expand collapse for all components
		var toggleArray = Util.Style.g("sec-hd-tgl");
		for (var k = 0; k < toggleArray.length; k++) {
			Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
			var checkClosed = Util.gp(Util.gp(toggleArray[k]));
			if (Util.Style.ccss(checkClosed, "closed")) {
				toggleArray[k].innerHTML = "+";
				toggleArray[k].title = i18nCore.SHOW_SECTION;
			}
		}
	}
	function SetupCompFilters(compArray) {
		var compArrayLen = compArray.length;
		var hasFilters = false;
		for (var x = 0; x < compArrayLen; x++) {
			hasFilters = false;
			for(var y = 0; y < 10; y++){
				if(compArray[x].getGrouperLabel(y) || compArray[x].getGrouperCatLabel(y)){
					hasFilters = true;
					break;
				}
			}
			compArray[x].setCompFilters(hasFilters);
			if (compArray[x].hasCompFilters() && compArray[x].isDisplayable()) {
				compArray[x].renderAccordion(compArray[x]);
			}
		}
	}
	function CreateCompDiv(component, disableMenu) {
		var i18nCore = i18n.discernabu;
		var ar = [];
		var style = component.getStyles();
		var ns = style.getNameSpace();
		var compId = style.getId();
		var mnuCompId = component.getComponentId();
		var secClass = style.getClassName();
		var tabLink = component.getLink();
		var loc = component.getCriterion().static_content;
		var tglCode = (!component.isAlwaysExpanded())?["<span class='",style.getHeaderToggle(),"' title='",i18nCore.HIDE_SECTION,"'>-</span>"].join(""):"";
		var menuHTML = "";
		var sDisplayName = "";
		var sSectionName = "";
		var sBandName = "";
		var sItemName = "";
		
		if (!component.isExpanded() && !component.isAlwaysExpanded())
			secClass += " closed";
		
		if(disableMenu) {
			if (component.getHasActionsMenu()) {
					menuHTML = ["<span class='opts-menu menu-hide' id='mainCompMenu", compId, "'>&nbsp;</span>"].join("");
			}
		}
		else {
			menuHTML = ["<span class='opts-menu menu-hide' id='mainCompMenu", compId, "'>&nbsp;</span>"].join("");
		}

		var sAnchor = (tabLink != "" && component.getCustomizeView() == false) ? CreateComponentAnchor(component) : component.getLabel();
		ar.push("<div id='", style.getId(), "' class='", secClass, "'>", "<h2 class='", style.getHeaderClass(), "'>", tglCode, menuHTML,
				 "<span class='", style.getTitle(), "'><span>", sAnchor, "</span>");


		if (component.getCustomizeView() == false){
			ar.push("<span class='",style.getTotal(),"'>", i18nCore.LOADING_DATA + "...", "</span></span>");
			if (component.isPlusAddEnabled()) {
				if(component.isIViewAdd() === false) {
					ar.push("<a id='", ns, "Add' class='add-plus' onclick='MP_Util.OpenIView(\"", compId, "\"); return false;' href='#'><span class='add-icon'>&nbsp;</span><span class='add-text'>", i18nCore.ADD, "</span></a>");
				} else {
					ar.push("<a id='", ns, "Add' class='add-plus' onclick='MP_Util.OpenTab(\"", compId, "\"); return false;' href='#'><span class='add-icon'>&nbsp;</span><span class='add-text'>", i18nCore.ADD, "</span></a>");
				}
				var menuItems = component.getMenuItems();
				var iViewItems = component.getIViewMenuItems();
				if (menuItems != null || menuItems > 0) {
					var menuId = compId+"Menu";
					ar.push("<a id='", ns, "Drop' class='drop-Down'><img src='", loc, "/images/3943_16.gif' onclick='javascript:MP_Util.LaunchMenu(\"",menuId,"\", \"",compId,"\");'></a>");
					ar.push("<div class='form-menu menu-hide' id='",menuId,"'><span>");
					for (var x=0,xl=menuItems.length;x<xl;x++){
						var item = menuItems[x];
						ar.push("<div>")
						ar.push("<a id='lnkID",x,"' href='#' onclick='javascript:MP_Util.LaunchMenuSelection(\"",compId,'\",',item.getId(),");'>", item.getDescription(), "</a>")
						ar.push("</div>")
					}				
					if (iViewItems) {
						ar.push("<hr class='opts-iview-sec-divider'></>");
						for(var x=0, xl=iViewItems.length; x<xl; x++) {
							var item=iViewItems[x];
							//Check for value_type_flag of 1 to set band name
							var itemValTypeFlag = item.getValTypeFlag();
							if(itemValTypeFlag === 1) {
								sDisplayName = item.getDescription();
								sBandName = sDisplayName.toLowerCase();
							    sDisplayName = sDisplayName.replace(/'/g,"");
								sSectionName = "";
								sItemName = "";
								//loop through again for match on value_seq
								for(var y=0, yl=iViewItems.length; y<yl; y++){
									var secItem = iViewItems[y];
									if(secItem.getValSequence() === item.getValSequence()) {
										//Check for value_type_flag of 2 to set section name
										if(secItem.getValTypeFlag() === 2) {
											sSectionName = secItem.getDescription();
											//Check for value_type_flag of 3 to set item name
										} else if (secItem.getValTypeFlag() === 3) {
											sItemName = secItem.getDescription();
										}
									}
								}
								ar.push("<div><a id='lnkID",x,"' href='#' onclick='MP_Util.LaunchIViewMenuSelection(\"",mnuCompId,'\",\"',sBandName,'\",\"',sSectionName,'\",\"',sItemName,"\");  return false;'>",sDisplayName,"</a></div>");
							}
						}
					}
					ar.push("</span></div>");
				} else if (iViewItems) {
					var menuId = compId+"Menu";
					ar.push("<a id='", ns, "Drop' class='drop-Down'><img src='", loc, "/images/3943_16.gif' onclick='javascript:MP_Util.LaunchMenu(\"",menuId,"\", \"",compId,"\");'></a>");
					ar.push("<div class='form-menu menu-hide' id='",menuId,"'><span>");
					for(var x=0, xl=iViewItems.length; x<xl; x++) {
						var item=iViewItems[x];
						//Check for value_type_flag of 1 to set band name
						var itemValTypeFlag = item.getValTypeFlag();
						if(itemValTypeFlag === 1) {
							sDisplayName=item.getDescription();
							sBandName=sDisplayName.toLowerCase();
							sDisplayName=sDisplayName.replace(/'/g,"");
							sSectionName = "";
							sItemName = "";
							//loop through again for match on value_seq
							for(var y=0, yl=iViewItems.length; y<yl; y++){
								var secItem = iViewItems[y];
								if(secItem.getValSequence() === item.getValSequence()) {
									//Check for value_type_flag of 2 to set section name
									if(secItem.getValTypeFlag() === 2) {
										sSectionName = secItem.getDescription();
										//Check for value_type_flag of 3 to set item name
									} else if (secItem.getValTypeFlag() === 3) {
										sItemName = secItem.getDescription();
									}
								}
							}
							ar.push("<div><a id='lnkID",x,"' href='#' onclick='MP_Util.LaunchIViewMenuSelection(\"",mnuCompId,'\",\"',sBandName,'\",\"',sSectionName,'\",\"',sItemName,"\");  return false;'>",sDisplayName,"</a></div>");
						}
					}
					ar.push("</span></div>");
				}
			}
		}
		else {
			ar.push("</span>");
		}
		ar.push("</h2>")
		if (component.getCustomizeView() == false){
			var scope = component.getScope();
			if (scope === 3){  //specifically to display a custom subheader
				ar.push(component.getScopeHTML());
			}
			else if(scope > 0) {
				var lbMenuItems = component.getLookbackMenuItems();
				if (lbMenuItems) {
					component.setLookBackDropDown(true);
				}
				else {
					component.setLookBackDropDown(false);
				}
				
			    if (component.m_grouper_arr.length === 0) {
					component.setCompFilters(false);
				}
				else {
					component.setCompFilters(true);
				}
					
				ar.push(MP_Util.Doc.CreateLookBackMenu(component, 1, ""));
			}
		}
		ar.push("<div id='",style.getContentId(),"' class='",style.getContentClass(),"'></div>");
		var footerText = component.getFooterText();
		if (footerText && footerText !== ""){
			ar.push("<div class=sec-footer>", footerText,"</div>");
		}
		ar.push("</div>");
		var arHtml = ar.join("");
		return arHtml;
	}
	
	function CreateSubTitleText(component) {
		var i18nCore = i18n.discernabu;
		var subTitleText = "";
		var scope = component.getScope();
		var lookbackDays = component.getLookbackDays();
		var lookbackUnits = (lookbackDays > 0) ? lookbackDays : component.getLookbackUnits();
		var lookbackFlag = (lookbackDays > 0) ? 2 : component.getLookbackUnitTypeFlag();
		
		if(scope > 0) {
			if(lookbackFlag > 0 && lookbackUnits > 0) {
				var replaceText ="";
				switch(lookbackFlag) {
					case 1:
						replaceText = i18nCore.LAST_N_HOURS.replace("{0}", lookbackUnits);
						break;
					case 2:
						replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookbackUnits);
						break;
					case 3:
						replaceText = i18nCore.LAST_N_WEEKS.replace("{0}", lookbackUnits);
						break;
					case 4:
						replaceText = i18nCore.LAST_N_MONTHS.replace("{0}", lookbackUnits);
						break;
					case 5:
						replaceText = i18nCore.LAST_N_YEARS.replace("{0}", lookbackUnits);
						break;
				}
				
				switch(scope) {
					case 1:
						subTitleText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
						break;
					case 2:
						subTitleText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
						break;
				}
			  
			}
			else {
				switch(scope) {
					case 1:
						subTitleText = i18nCore.All_VISITS;
						break;
					case 2:
						subTitleText = i18nCore.SELECTED_VISIT;
						break;
				}
			}
		}
		return subTitleText;
	}
	
	function CreateComponentAnchor(component){
		var i18nCore = i18n.discernabu;
		var style = component.getStyles();
		var criterion = component.getCriterion();
		var sParms = 'javascript:APPLINK(0,"' + criterion.executable + '","/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + component.getLink() + '^"); return false;';
		var sAnchor = "<a id="+style.getLink()+" title='"+i18nCore.GO_TO_TAB.replace("{0}", component.getLink())+"' href='#' onclick='"+sParms+"'>"+component.getLabel()+"</a>";
		return sAnchor;
	}
	function LoadPageSelector (items, bodyTag,lastSavedView, criterion) {
		var i18nCore = i18n.discernabu;
		var activeInd;
		var ar = [];
	    var divAr = [];
	    var pageKey = "-1";
		var pageCtrl = _g('pageCtrl'+criterion.category_mean);
		var isViewpoint = ( typeof m_viewpointJSON == "undefined") ? false : true;
		var selectorClass = "qoc-view-selector";
		if(lastSavedView) {
        	var lastSavedViewFound = false;
        	var i=items.length;
        	while(i--){
        		if(items[i].name == lastSavedView){
					window.name = items[i].key+",'a-tab'"+i;
					pageKey = items[i].key;
					lastSavedViewFound = true;
					break;
				}
			}
			
			if(lastSavedViewFound) {
				if (!isViewpoint) {
					selectorClass = selectorClass + " no-viewpoint";
				}
			    ar.push("<span class='", selectorClass, "'><span class='qoc-view-list-label'>",i18nCore.VIEW_SELECTOR,":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,false)>");
				for(var x = 0, xl = items.length; x < xl; x++) {
					var item = items[x];
					if(item.key == pageKey){
						activeInd = 1;
					}
					else{
						activeInd = 0;
					}
					ar.push("<option value='",item.key,"'",(activeInd==1)?" selected='selected'":"",">",item.name,"</option>");
		            divAr.push("<div id='",item.key,"' class='div-tab-item",(activeInd==1)?" div-tab-item-selected":" div-tab-item-not-selected","'></div>");
				}
			    ar.push("</select></span>");
		
				pageCtrl.innerHTML = ar.join("") + pageCtrl.innerHTML;
				bodyTag.innerHTML += divAr.join("");
			}
			else {
				if (!isViewpoint) {
					selectorClass = selectorClass + " no-viewpoint";
				}
				ar.push("<span id='noSavedViews' class='qoc-no-saved-view'>",i18nCore.VIEW_NOT_SELECTED,"</span>");
			    ar.push("<span class='", selectorClass, "'><span class='qoc-view-list-label'>",i18nCore.VIEW_SELECTOR,":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,true)>");
				for(var x = 0, xl = items.length; x < xl; x++) {
					var item = items[x];
					ar.push("<option value='",item.key,"'>",item.name,"</option>");
		            divAr.push("<div id='",item.key,"' class='div-tab-item div-tab-item-not-selected'></div>");
				}
			    ar.push("<option value='Blank_Space' selected='selected'></option>");
	            divAr.push("<div id='Blank_Space' class='div-tab-item div-tab-item-selected'></div>");
			    ar.push("</select></span>");
		
				pageCtrl.innerHTML = ar.join("") + pageCtrl.innerHTML;
				bodyTag.innerHTML += divAr.join("");
				window.name = "QOC_PAGE_TAB_" + items.length +",'a-tab'"+items.length;
			}
        }
		else {
			if (!isViewpoint) {
					selectorClass = selectorClass + " no-viewpoint";
				}
			ar.push("<span id='noSavedViews' class='qoc-no-saved-view'>",i18nCore.VIEW_NOT_SELECTED,"</span>");
		    ar.push("<span class='", selectorClass, "'><span class='qoc-view-list-label'>",i18nCore.VIEW_SELECTOR,":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,true)>");
			for(var x = 0, xl = items.length; x < xl; x++) {
				var item = items[x];
				ar.push("<option value='",item.key,"'>",item.name,"</option>");
	            divAr.push("<div id='",item.key,"' class='div-tab-item div-tab-item-not-selected'></div>");
			}
		    ar.push("<option value='Blank_Space' selected='selected'></option>");
            divAr.push("<div id='Blank_Space' class='div-tab-item div-tab-item-selected'></div>");
		    ar.push("</select></span>");
	
			pageCtrl.innerHTML = ar.join("") + pageCtrl.innerHTML;
			bodyTag.innerHTML += divAr.join("");
			window.name = "QOC_PAGE_TAB_" + items.length +",'a-tab'"+items.length;
        }
	}	
	function AddPageTabs(items, bodyTag){
		var ar = [];
		var divAr = [];
		if (bodyTag == null)
			bodyTag = document.body;
		//first create unordered list for page level tabs
		ar.push("<ul class=tabmenu>")
		for(var x = 0, xl = items.length; x < xl; x++) {
			var item = items[x];
			var activeInd = (x == 0) ? 1 : 0;
			ar.push(CreateTabLi(item, activeInd, x))
			divAr.push("<div id='",item.key,"' class='div-tab-item'></div>");
		}
		ar.push("</ul>")
		bodyTag.innerHTML += (ar.join("") + divAr.join(""));
	}
	function CreateTabLi(item, activeInd, sequence){
		var ar=[];
		var tabName ="";
		tabName =item.name;
		ar.push("<li>")
		var seqClass = "a-tab" + sequence;
		if(activeInd)
			ar.push("<a id='", seqClass, "' class='anchor-tab-item active' href='#' onclick='javascript:MP_Util.DisplaySelectedTab(\"",item.key, "\",\"", seqClass,"\");return false;'>", tabName, "</a>");
		else
			ar.push("<a id='", seqClass, "' class='anchor-tab-item inactive' href='#' onclick='javascript:MP_Util.DisplaySelectedTab(\"",item.key, "\",\"", seqClass,"\");return false;'>", tabName, "</a>");
		ar.push("</li>")
		return (ar.join(""));
	}
}();

/**
 * @namespace
 */
MP_Util.Measurement = function(){
    var m_nf = null;
    return {
        GetString: function(result, codeArray, dateMask, excludeUOM) {
    		var obj = (result instanceof MP_Core.Measurement) ? result.getResult() : MP_Util.Measurement.GetObject(result, codeArray);
            if (obj instanceof MP_Core.QuantityValue) { 
                if (excludeUOM) {
                    return obj.getValue();
                }
                return obj.toString();
            }
            else if (obj instanceof Date) {
                return obj.format(dateMask);
            }
            return obj;
        },
        GetObject: function(result, codeArray){
            switch (result.CLASSIFICATION.toUpperCase()) {
                case "QUANTITY_VALUE":
                    return GetQuantityValue(result, codeArray);
                case "STRING_VALUE":
                    return (GetStringValue(result));
				case "DATE_VALUE":
					//we are currently not returning any date_value results. a common method shall be implemented if/when necessary
                    return (GetDateValue(result));
				case "CODIFIED_VALUES":
                case "CODE_VALUE":
                    return (GetCodedResult(result));
                case "ENCAPSULATED_VALUE":
                    return (GetEncapsulatedValue(result));
            }
        },
        /**
         * @param {Object} num Numeric to format
         * @param {Object} dec Number of decimal places to retain.
         * @deprecated Use mp_formatter.NumericFormatter.
         */
        SetPrecision: function(num, dec){
            var nf = MP_Util.GetNumericFormatter();
            //'^' to not comma seperate values, and '.' for defining the precision
            return nf.format(num, "^." + dec);
        },
        GetModifiedIcon: function(result){
            return (result.isModified()) ? "<span class='res-modified'>&nbsp;</span>" : "";
        },
        GetNormalcyClass: function(oMeasurement){
            var normalcy = "res-normal";
            var nc = oMeasurement.getNormalcy()
            if (nc != null) {
                var normalcyMeaning = nc.meaning;
                if (normalcyMeaning != null) {
                    if (normalcyMeaning === "LOW") {
                        normalcy = "res-low";
                    }
                    else if (normalcyMeaning === "HIGH") {
                        normalcy = "res-high";
                    }
                    else if (normalcyMeaning === "CRITICAL" || normalcyMeaning === "EXTREMEHIGH" || normalcyMeaning === "PANICHIGH" || normalcyMeaning === "EXTREMELOW" || normalcyMeaning === "PANICLOW" || normalcyMeaning === "VABNORMAL" || normalcyMeaning === "POSITIVE") {
                        normalcy = "res-severe";
                    }
                    else if (normalcyMeaning === "ABNORMAL") {
                        normalcy = "res-abnormal";
                    }
                }
            }
            return normalcy;
        },
        GetNormalcyResultDisplay: function(oMeasurement, excludeUOM) {
        	var ar = ["<span class='", MP_Util.Measurement.GetNormalcyClass(oMeasurement), "'><span class='res-ind'>&nbsp;</span><span class='res-value'>",
        	          GetEventViewerLink(oMeasurement, MP_Util.Measurement.GetString(oMeasurement, null, "longDateTime2", excludeUOM)), "</span>", MP_Util.Measurement.GetModifiedIcon(oMeasurement), "</span>"];
        	return ar.join("");
        }
    };
    function GetEventViewerLink(oMeasurement, sResultDisplay){
		var params = [ oMeasurement.getPersonId(), oMeasurement.getEncntrId(), oMeasurement.getEventId(), "\"EVENT\"" ];
		var ar = ["<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","),"); return false;' href='#'>", sResultDisplay, "</a>"];
		return ar.join("");
    }
    function GetEncapsulatedValue(result){
        var ar = [];
        var encap = result.ENCAPSULATED_VALUE;
        if (encap && encap.length > 0){
            for (var n = 0, nl = encap.length; n < nl; n++) {
                var txt = encap[n].TEXT_PLAIN;
                if (txt != null && txt.length > 0) 
                    ar.push(txt);
            }
        }
        return ar.join("");
    }
    function GetQuantityValue(result, codeArray){
        var qv = new MP_Core.QuantityValue();
        qv.init(result, codeArray);
        return qv;
    }
    function GetDateValue(result){
        for (var x = 0, xl = result.DATE_VALUE.length; x < xl; x++) {
            var date = result.DATE_VALUE[x];
            if (date.DATE != "") {
                var dateTime = new Date();
                dateTime.setISO8601(date.DATE);
                return dateTime;
            }
        }
        return null;
    }
    function GetCodedResult(result){
        var cdValue = result.CODE_VALUE;
        var ar = [];
        for (var n = 0, nl = cdValue.length; n < nl; n++) {
            var values = cdValue[n].VALUES;
            for (var p = 0, pl = values.length; p < pl; p++) {
                ar.push(values[p].SOURCE_STRING)
            }
            var sOther = cdValue[n].OTHER_RESPONSE;
            if (sOther != "") 
                ar.push(sOther)
        }
        return ar.join(", ");
    }
    function GetStringValue(result){
        var strValue = result.STRING_VALUE;
        var ar = [];
        for (var n = 0, nl = strValue.length; n < nl; n++) {
            ar.push(strValue[n].VALUE);
        }
        return ar.join(", ");
    }
}();
/**
 * Returns an array of elements with the designated classname.
 * @param {Object} cl The CSS classname.
 * @param {Object} e The parent element to search within, defaults to document.
 * @return {Array} Returns an array of elements with the designated classname.
 * @deprecated
 */
document.getElementsByClassName = function(cl, e) {
    var retnode = [];
    var clssnm = new RegExp('\\b'+cl+'\\b');
    var elem = this.getElementsByTagName('*', e);
    for (var u = 0; u < elem.length; u++) {
        var classes = elem[u].className;
		if(clssnm.test(classes)){
			retnode.push(elem[u]);
		}
    }
    return retnode;
};

/* Listener Event Class */
/*
 * Copyright (c) 2007 	Josh Davis ( http://joshdavis.wordpress.com )
 * 
 * Licensed under the MIT License ( http://www.opensource.org/licenses/mit-license.php ) as follows:
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
*/
/**
 * Binds a function to the given object's scope
 *
 * @param {Object} object The object to bind the function to.
 * @return {Function}	Returns the function bound to the object's scope.
 */
Function.prototype.bind = function(object) {
	var method = this;
	return function() {
		return method.apply(object, arguments);
	};
};

/**
 * Create a new instance of Event.
 *
 * @classDescription	This class creates a new Event.
 * @return {Object}	Returns a new Event object.
 * @constructor
 */
function EventListener() {
	this.events = [];
	this.builtinEvts = [];
}

/**
 * Gets the index of the given action for the element
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {Number} Returns an integer.
 */
EventListener.prototype.getActionIdx = function(obj, evt, action, binding) {
	if(obj && evt) {

		var curel = this.events[obj][evt];
		if(curel) {
			var len = curel.length;
			for(var i = len - 1; i >= 0; i--) {
				if(curel[i].action == action && curel[i].binding == binding) {
					return i;
				}
			}
		}
		else {
			return -1;
		}
	}
	return -1;
};

/**
 * Adds a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
EventListener.prototype.addListener = function(obj, evt, action, binding) {
	if(this.events[obj]) {
		if(this.events[obj][evt]) {
			if(this.getActionIdx(obj, evt, action, binding) == -1) {
				var curevt = this.events[obj][evt];
				curevt[curevt.length] = {
					action : action,
					binding : binding
				};
			}
		}
		else {
			this.events[obj][evt] = [];
			this.events[obj][evt][0] = {
				action : action,
				binding : binding
			};
		}
	}
	else {
		this.events[obj] = [];
		this.events[obj][evt] = [];
		this.events[obj][evt][0] = {
			action : action,
			binding : binding
		};
	}
};

/**
 * Removes a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
EventListener.prototype.removeListener = function(obj, evt, action, binding) {
	if(this.events[obj]) {
		if(this.events[obj][evt]) {
			var idx = this.getActionIdx(obj,evt,action,binding);
			if(idx >= 0) {
				this.events[obj][evt].splice(idx,1);
			}
		}
	}
};
/**
 * Removes all listeners for a given object with given binding
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
EventListener.prototype.removeAllListeners = function(obj, binding){
	if(this.events[obj]){
		for(var el = this.events[obj].length; el--;){
			if (this.events[obj][el]) {
				for (var ev = this.events[obj][el].length; ev--;) {
					if (this.events[obj][el][ev].binding == binding) {
						this.events[obj][el].splice(ev, 1);
					}
				}
			}
		}
	}
};

/**
 * Fires an event
 *
 * @memberOf Event
 * @param e [(event)] A builtin event passthrough
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Object} args The argument attached to the event.
 * @return {null} Returns null.
 */
EventListener.prototype.fireEvent = function(e, obj, evt, args) {
	if(!e) {
		e = window.event;
	}

	if(obj && this.events) {
		var evtel = this.events[obj];
		if(evtel) {
			var curel = evtel[evt];
			if(curel) {
				for(var act = curel.length; act--; ) {
					var action = curel[act].action;
					if(curel[act].binding) {
						action = action.bind(curel[act].binding);
					}
					action(e,args);
				}
			}
		}
	}
};
CERN_EventListener = new EventListener();

//Constants for event Listener
EventListener.EVENT_CLINICAL_EVENT = 1;
EventListener.EVENT_ORDER_ACTION = 2;
EventListener.EVENT_ADD_DOC = 3;
EventListener.EVENT_PREGNANCY_EVENT = 4;
EventListener.EVENT_COMP_CUSTOMIZE = 5;
EventListener.EVENT_COUNT_UPDATE = 6;
EventListener.EVENT_CRITICAL_UPDATE = 7;
EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE = 8;
EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT = 9;
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

//  svn : r73
// ------------------------------------------------------------------
// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Known Issues:
//
// * Patterns only support repeat.
// * Radial gradient are not implemented. The VML version of these look very
//   different from the canvas one.
// * Clipping paths are not implemented.
// * Coordsize. The width and height attribute have higher priority than the
//   width and height style values which isn't correct.
// * Painting mode isn't implemented.
// * Canvas width/height should is using content-box by default. IE in
//   Quirks mode will draw the canvas using border-box. Either change your
//   doctype to HTML5
//   (http://www.whatwg.org/specs/web-apps/current-work/#the-doctype)
//   or use Box Sizing Behavior from WebFX
//   (http://webfx.eae.net/dhtml/boxsizing/boxsizing.html)
// * Non uniform scaling does not correctly scale strokes.
// * Optimize. There is always room for speed improvements.

// Only add this code if we do not already have a canvas implementation
if (!document.createElement('canvas').getContext) {

(function() {

  // alias some functions to make (compiled) code shorter
  var m = Math;
  var mr = m.round;
  var ms = m.sin;
  var mc = m.cos;
  var abs = m.abs;
  var sqrt = m.sqrt;

  // this is used for sub pixel precision
  var Z = 10;
  var Z2 = Z / 2;

  var IE_VERSION = +navigator.userAgent.match(/MSIE ([\d.]+)?/)[1];

  /**
   * This funtion is assigned to the <canvas> elements as element.getContext().
   * @this {HTMLElement}
   * @return {CanvasRenderingContext2D_}
   */
  function getContext() {
    return this.context_ ||
        (this.context_ = new CanvasRenderingContext2D_(this));
  }

  var slice = Array.prototype.slice;

  /**
   * Binds a function to an object. The returned function will always use the
   * passed in {@code obj} as {@code this}.
   *
   * Example:
   *
   *   g = bind(f, obj, a, b)
   *   g(c, d) // will do f.call(obj, a, b, c, d)
   *
   * @param {Function} f The function to bind the object to
   * @param {Object} obj The object that should act as this when the function
   *     is called
   * @param {*} var_args Rest arguments that will be used as the initial
   *     arguments when the function is called
   * @return {Function} A new function that has bound this
   */
  function bind(f, obj, var_args) {
    var a = slice.call(arguments, 2);
    return function() {
      return f.apply(obj, a.concat(slice.call(arguments)));
    };
  }

  function encodeHtmlAttribute(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  function addNamespace(doc, prefix, urn) {
    if (!doc.namespaces[prefix]) {
      doc.namespaces.add(prefix, urn, '#default#VML');
    }
  }

  function addNamespacesAndStylesheet(doc) {
    addNamespace(doc, 'g_vml_', 'urn:schemas-microsoft-com:vml');
    addNamespace(doc, 'g_o_', 'urn:schemas-microsoft-com:office:office');

    // Setup default CSS.  Only add one style sheet per document
    if (!doc.styleSheets['ex_canvas_']) {
      var ss = doc.createStyleSheet();
      ss.owningElement.id = 'ex_canvas_';
      ss.cssText = 'canvas{display:inline-block;overflow:hidden;' +
          // default size is 300x150 in Gecko and Opera
          'text-align:left;width:300px;height:150px}';
    }
  }

  // Add namespaces and stylesheet at startup.
  addNamespacesAndStylesheet(document);

  var G_vmlCanvasManager_ = {
    init: function(opt_doc) {
      var doc = opt_doc || document;
      // Create a dummy element so that IE will allow canvas elements to be
      // recognized.
      doc.createElement('canvas');
      doc.attachEvent('onreadystatechange', bind(this.init_, this, doc));
    },

    init_: function(doc) {
      // find all canvas elements
      var els = doc.getElementsByTagName('canvas');
      for (var i = 0; i < els.length; i++) {
        this.initElement(els[i]);
      }
    },

    /**
     * Public initializes a canvas element so that it can be used as canvas
     * element from now on. This is called automatically before the page is
     * loaded but if you are creating elements using createElement you need to
     * make sure this is called on the element.
     * @param {HTMLElement} el The canvas element to initialize.
     * @return {HTMLElement} the element that was created.
     */
    initElement: function(el) {
      if (!el.getContext) {
        el.getContext = getContext;

        // Add namespaces and stylesheet to document of the element.
        addNamespacesAndStylesheet(el.ownerDocument);

        // Remove fallback content. There is no way to hide text nodes so we
        // just remove all childNodes. We could hide all elements and remove
        // text nodes but who really cares about the fallback content.
        el.innerHTML = '';

        // do not use inline function because that will leak memory
        el.attachEvent('onpropertychange', onPropertyChange);
        el.attachEvent('onresize', onResize);

        var attrs = el.attributes;
        if (attrs.width && attrs.width.specified) {
          // TODO: use runtimeStyle and coordsize
          // el.getContext().setWidth_(attrs.width.nodeValue);
          el.style.width = attrs.width.nodeValue + 'px';
        } else {
          el.width = el.clientWidth;
        }
        if (attrs.height && attrs.height.specified) {
          // TODO: use runtimeStyle and coordsize
          // el.getContext().setHeight_(attrs.height.nodeValue);
          el.style.height = attrs.height.nodeValue + 'px';
        } else {
          el.height = el.clientHeight;
        }
        //el.getContext().setCoordsize_()
      }
      return el;
    },

    // Memory Leaks patch : see http://code.google.com/p/explorercanvas/issues/detail?id=82
    uninitElement: function(el){
      if (el.getContext) {
        var ctx = el.getContext();
        delete ctx.element_;
        delete ctx.canvas;
        el.innerHTML = "";
        //el.outerHTML = "";
        el.context_ = null;
        el.getContext = null;
        el.detachEvent("onpropertychange", onPropertyChange);
        el.detachEvent("onresize", onResize);
      }
    }
  };

  function onPropertyChange(e) {
    var el = e.srcElement;

    switch (e.propertyName) {
      case 'width':
        el.getContext().clearRect();
        el.style.width = el.attributes.width.nodeValue + 'px';
        // In IE8 this does not trigger onresize.
        el.firstChild.style.width =  el.clientWidth + 'px';
        break;
      case 'height':
        el.getContext().clearRect();
        el.style.height = el.attributes.height.nodeValue + 'px';
        el.firstChild.style.height = el.clientHeight + 'px';
        break;
    }
  }

  function onResize(e) {
    var el = e.srcElement;
    if (el.firstChild) {
      el.firstChild.style.width =  el.clientWidth + 'px';
      el.firstChild.style.height = el.clientHeight + 'px';
    }
  }

  G_vmlCanvasManager_.init();

  // precompute "00" to "FF"
  var decToHex = [];
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      decToHex[i * 16 + j] = i.toString(16) + j.toString(16);
    }
  }

  function createMatrixIdentity() {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  function matrixMultiply(m1, m2) {
    var result = createMatrixIdentity();

    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        var sum = 0;

        for (var z = 0; z < 3; z++) {
          sum += m1[x][z] * m2[z][y];
        }

        result[x][y] = sum;
      }
    }
    return result;
  }

  function copyState(o1, o2) {
    o2.fillStyle     = o1.fillStyle;
    o2.lineCap       = o1.lineCap;
    o2.lineJoin      = o1.lineJoin;
    o2.lineWidth     = o1.lineWidth;
    o2.miterLimit    = o1.miterLimit;
    o2.shadowBlur    = o1.shadowBlur;
    o2.shadowColor   = o1.shadowColor;
    o2.shadowOffsetX = o1.shadowOffsetX;
    o2.shadowOffsetY = o1.shadowOffsetY;
    o2.strokeStyle   = o1.strokeStyle;
    o2.globalAlpha   = o1.globalAlpha;
    o2.font          = o1.font;
    o2.textAlign     = o1.textAlign;
    o2.textBaseline  = o1.textBaseline;
    o2.arcScaleX_    = o1.arcScaleX_;
    o2.arcScaleY_    = o1.arcScaleY_;
    o2.lineScale_    = o1.lineScale_;
  }

  var colorData = {
    aliceblue: '#F0F8FF',
    antiquewhite: '#FAEBD7',
    aquamarine: '#7FFFD4',
    azure: '#F0FFFF',
    beige: '#F5F5DC',
    bisque: '#FFE4C4',
    black: '#000000',
    blanchedalmond: '#FFEBCD',
    blueviolet: '#8A2BE2',
    brown: '#A52A2A',
    burlywood: '#DEB887',
    cadetblue: '#5F9EA0',
    chartreuse: '#7FFF00',
    chocolate: '#D2691E',
    coral: '#FF7F50',
    cornflowerblue: '#6495ED',
    cornsilk: '#FFF8DC',
    crimson: '#DC143C',
    cyan: '#00FFFF',
    darkblue: '#00008B',
    darkcyan: '#008B8B',
    darkgoldenrod: '#B8860B',
    darkgray: '#A9A9A9',
    darkgreen: '#006400',
    darkgrey: '#A9A9A9',
    darkkhaki: '#BDB76B',
    darkmagenta: '#8B008B',
    darkolivegreen: '#556B2F',
    darkorange: '#FF8C00',
    darkorchid: '#9932CC',
    darkred: '#8B0000',
    darksalmon: '#E9967A',
    darkseagreen: '#8FBC8F',
    darkslateblue: '#483D8B',
    darkslategray: '#2F4F4F',
    darkslategrey: '#2F4F4F',
    darkturquoise: '#00CED1',
    darkviolet: '#9400D3',
    deeppink: '#FF1493',
    deepskyblue: '#00BFFF',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1E90FF',
    firebrick: '#B22222',
    floralwhite: '#FFFAF0',
    forestgreen: '#228B22',
    gainsboro: '#DCDCDC',
    ghostwhite: '#F8F8FF',
    gold: '#FFD700',
    goldenrod: '#DAA520',
    grey: '#808080',
    greenyellow: '#ADFF2F',
    honeydew: '#F0FFF0',
    hotpink: '#FF69B4',
    indianred: '#CD5C5C',
    indigo: '#4B0082',
    ivory: '#FFFFF0',
    khaki: '#F0E68C',
    lavender: '#E6E6FA',
    lavenderblush: '#FFF0F5',
    lawngreen: '#7CFC00',
    lemonchiffon: '#FFFACD',
    lightblue: '#ADD8E6',
    lightcoral: '#F08080',
    lightcyan: '#E0FFFF',
    lightgoldenrodyellow: '#FAFAD2',
    lightgreen: '#90EE90',
    lightgrey: '#D3D3D3',
    lightpink: '#FFB6C1',
    lightsalmon: '#FFA07A',
    lightseagreen: '#20B2AA',
    lightskyblue: '#87CEFA',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#B0C4DE',
    lightyellow: '#FFFFE0',
    limegreen: '#32CD32',
    linen: '#FAF0E6',
    magenta: '#FF00FF',
    mediumaquamarine: '#66CDAA',
    mediumblue: '#0000CD',
    mediumorchid: '#BA55D3',
    mediumpurple: '#9370DB',
    mediumseagreen: '#3CB371',
    mediumslateblue: '#7B68EE',
    mediumspringgreen: '#00FA9A',
    mediumturquoise: '#48D1CC',
    mediumvioletred: '#C71585',
    midnightblue: '#191970',
    mintcream: '#F5FFFA',
    mistyrose: '#FFE4E1',
    moccasin: '#FFE4B5',
    navajowhite: '#FFDEAD',
    oldlace: '#FDF5E6',
    olivedrab: '#6B8E23',
    orange: '#FFA500',
    orangered: '#FF4500',
    orchid: '#DA70D6',
    palegoldenrod: '#EEE8AA',
    palegreen: '#98FB98',
    paleturquoise: '#AFEEEE',
    palevioletred: '#DB7093',
    papayawhip: '#FFEFD5',
    peachpuff: '#FFDAB9',
    peru: '#CD853F',
    pink: '#FFC0CB',
    plum: '#DDA0DD',
    powderblue: '#B0E0E6',
    rosybrown: '#BC8F8F',
    royalblue: '#4169E1',
    saddlebrown: '#8B4513',
    salmon: '#FA8072',
    sandybrown: '#F4A460',
    seagreen: '#2E8B57',
    seashell: '#FFF5EE',
    sienna: '#A0522D',
    skyblue: '#87CEEB',
    slateblue: '#6A5ACD',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#FFFAFA',
    springgreen: '#00FF7F',
    steelblue: '#4682B4',
    tan: '#D2B48C',
    thistle: '#D8BFD8',
    tomato: '#FF6347',
    turquoise: '#40E0D0',
    violet: '#EE82EE',
    wheat: '#F5DEB3',
    whitesmoke: '#F5F5F5',
    yellowgreen: '#9ACD32'
  };


  function getRgbHslContent(styleString) {
    var start = styleString.indexOf('(', 3);
    var end = styleString.indexOf(')', start + 1);
    var parts = styleString.substring(start + 1, end).split(',');
    // add alpha if needed
    if (parts.length != 4 || styleString.charAt(3) != 'a') {
      parts[3] = 1;
    }
    return parts;
  }

  function percent(s) {
    return parseFloat(s) / 100;
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function hslToRgb(parts){
    var r, g, b, h, s, l;
    h = parseFloat(parts[0]) / 360 % 360;
    if (h < 0)
      h++;
    s = clamp(percent(parts[1]), 0, 1);
    l = clamp(percent(parts[2]), 0, 1);
    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }

    return '#' + decToHex[Math.floor(r * 255)] +
        decToHex[Math.floor(g * 255)] +
        decToHex[Math.floor(b * 255)];
  }

  function hueToRgb(m1, m2, h) {
    if (h < 0)
      h++;
    if (h > 1)
      h--;

    if (6 * h < 1)
      return m1 + (m2 - m1) * 6 * h;
    else if (2 * h < 1)
      return m2;
    else if (3 * h < 2)
      return m1 + (m2 - m1) * (2 / 3 - h) * 6;
    else
      return m1;
  }

  var processStyleCache = {};

  function processStyle(styleString) {
    if (styleString in processStyleCache) {
      return processStyleCache[styleString];
    }

    var str, alpha = 1;

    styleString = String(styleString);
    if (styleString.charAt(0) == '#') {
      str = styleString;
    } else if (/^rgb/.test(styleString)) {
      var parts = getRgbHslContent(styleString);
      var str = '#', n;
      for (var i = 0; i < 3; i++) {
        if (parts[i].indexOf('%') != -1) {
          n = Math.floor(percent(parts[i]) * 255);
        } else {
          n = +parts[i];
        }
        str += decToHex[clamp(n, 0, 255)];
      }
      alpha = +parts[3];
    } else if (/^hsl/.test(styleString)) {
      var parts = getRgbHslContent(styleString);
      str = hslToRgb(parts);
      alpha = parts[3];
    } else {
      str = colorData[styleString] || styleString;
    }
    return processStyleCache[styleString] = {color: str, alpha: alpha};
  }

  var DEFAULT_STYLE = {
    style: 'normal',
    variant: 'normal',
    weight: 'normal',
    size: 10,
    family: 'sans-serif'
  };

  // Internal text style cache
  var fontStyleCache = {};

  function processFontStyle(styleString) {
    if (fontStyleCache[styleString]) {
      return fontStyleCache[styleString];
    }

    var el = document.createElement('div');
    var style = el.style;
    try {
      style.font = styleString;
    } catch (ex) {
      // Ignore failures to set to invalid font.
    }

    return fontStyleCache[styleString] = {
      style: style.fontStyle || DEFAULT_STYLE.style,
      variant: style.fontVariant || DEFAULT_STYLE.variant,
      weight: style.fontWeight || DEFAULT_STYLE.weight,
      size: style.fontSize || DEFAULT_STYLE.size,
      family: style.fontFamily || DEFAULT_STYLE.family
    };
  }

  function getComputedStyle(style, element) {
    var computedStyle = {};

    for (var p in style) {
      computedStyle[p] = style[p];
    }

    // Compute the size
    var canvasFontSize = parseFloat(element.currentStyle.fontSize),
        fontSize = parseFloat(style.size);

    if (typeof style.size == 'number') {
      computedStyle.size = style.size;
    } else if (style.size.indexOf('px') != -1) {
      computedStyle.size = fontSize;
    } else if (style.size.indexOf('em') != -1) {
      computedStyle.size = canvasFontSize * fontSize;
    } else if(style.size.indexOf('%') != -1) {
      computedStyle.size = (canvasFontSize / 100) * fontSize;
    } else if (style.size.indexOf('pt') != -1) {
      computedStyle.size = fontSize / .75;
    } else {
      computedStyle.size = canvasFontSize;
    }

    // Different scaling between normal text and VML text. This was found using
    // trial and error to get the same size as non VML text.
    computedStyle.size *= 0.981;

    // Fix for VML handling of bare font family names.  Add a '' around font family names.
    computedStyle.family =  "'" + computedStyle.family.replace(/(\'|\")/g,'').replace(/\s*,\s*/g, "', '") + "'";

    return computedStyle;
  }

  function buildStyle(style) {
    return style.style + ' ' + style.variant + ' ' + style.weight + ' ' +
        style.size + 'px ' + style.family;
  }

  var lineCapMap = {
    'butt': 'flat',
    'round': 'round'
  };

  function processLineCap(lineCap) {
    return lineCapMap[lineCap] || 'square';
  }

  /**
   * This class implements CanvasRenderingContext2D interface as described by
   * the WHATWG.
   * @param {HTMLElement} canvasElement The element that the 2D context should
   * be associated with
   */
  function CanvasRenderingContext2D_(canvasElement) {
    this.m_ = createMatrixIdentity();

    this.mStack_ = [];
    this.aStack_ = [];
    this.currentPath_ = [];

    // Canvas context properties
    this.strokeStyle = '#000';
    this.fillStyle = '#000';

    this.lineWidth = 1;
    this.lineJoin = 'miter';
    this.lineCap = 'butt';
    this.miterLimit = Z * 1;
    this.globalAlpha = 1;
    this.font = '10px sans-serif';
    this.textAlign = 'left';
    this.textBaseline = 'alphabetic';
    this.canvas = canvasElement;

    var cssText = 'width:' + canvasElement.clientWidth + 'px;height:' +
        canvasElement.clientHeight + 'px;overflow:hidden;position:absolute';
    var el = canvasElement.ownerDocument.createElement('div');
    el.style.cssText = cssText;
    canvasElement.appendChild(el);

    var overlayEl = el.cloneNode(false);
    // Use a non transparent background.
    overlayEl.style.backgroundColor = 'red';
    overlayEl.style.filter = 'alpha(opacity=0)';
    canvasElement.appendChild(overlayEl);

    this.element_ = el;
    this.arcScaleX_ = 1;
    this.arcScaleY_ = 1;
    this.lineScale_ = 1;
  }

  var contextPrototype = CanvasRenderingContext2D_.prototype;
  contextPrototype.clearRect = function() {
    if (this.textMeasureEl_) {
      this.textMeasureEl_.removeNode(true);
      this.textMeasureEl_ = null;
    }
    this.element_.innerHTML = '';
  };

  contextPrototype.beginPath = function() {
    // TODO: Branch current matrix so that save/restore has no effect
    //       as per safari docs.
    this.currentPath_ = [];
  };

  contextPrototype.moveTo = function(aX, aY) {
    var p = getCoords(this, aX, aY);
    this.currentPath_.push({type: 'moveTo', x: p.x, y: p.y});
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  contextPrototype.lineTo = function(aX, aY) {
    var p = getCoords(this, aX, aY);
    this.currentPath_.push({type: 'lineTo', x: p.x, y: p.y});

    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  contextPrototype.bezierCurveTo = function(aCP1x, aCP1y,
                                            aCP2x, aCP2y,
                                            aX, aY) {
    var p = getCoords(this, aX, aY);
    var cp1 = getCoords(this, aCP1x, aCP1y);
    var cp2 = getCoords(this, aCP2x, aCP2y);
    bezierCurveTo(this, cp1, cp2, p);
  };

  // Helper function that takes the already fixed cordinates.
  function bezierCurveTo(self, cp1, cp2, p) {
    self.currentPath_.push({
      type: 'bezierCurveTo',
      cp1x: cp1.x,
      cp1y: cp1.y,
      cp2x: cp2.x,
      cp2y: cp2.y,
      x: p.x,
      y: p.y
    });
    self.currentX_ = p.x;
    self.currentY_ = p.y;
  }

  contextPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
    // the following is lifted almost directly from
    // http://developer.mozilla.org/en/docs/Canvas_tutorial:Drawing_shapes

    var cp = getCoords(this, aCPx, aCPy);
    var p = getCoords(this, aX, aY);

    var cp1 = {
      x: this.currentX_ + 2.0 / 3.0 * (cp.x - this.currentX_),
      y: this.currentY_ + 2.0 / 3.0 * (cp.y - this.currentY_)
    };
    var cp2 = {
      x: cp1.x + (p.x - this.currentX_) / 3.0,
      y: cp1.y + (p.y - this.currentY_) / 3.0
    };

    bezierCurveTo(this, cp1, cp2, p);
  };

  contextPrototype.arc = function(aX, aY, aRadius,
                                  aStartAngle, aEndAngle, aClockwise) {
    aRadius *= Z;
    var arcType = aClockwise ? 'at' : 'wa';

    var xStart = aX + mc(aStartAngle) * aRadius - Z2;
    var yStart = aY + ms(aStartAngle) * aRadius - Z2;

    var xEnd = aX + mc(aEndAngle) * aRadius - Z2;
    var yEnd = aY + ms(aEndAngle) * aRadius - Z2;

    // IE won't render arches drawn counter clockwise if xStart == xEnd.
    if (xStart == xEnd && !aClockwise) {
      xStart += 0.125; // Offset xStart by 1/80 of a pixel. Use something
                       // that can be represented in binary
    }

    var p = getCoords(this, aX, aY);
    var pStart = getCoords(this, xStart, yStart);
    var pEnd = getCoords(this, xEnd, yEnd);

    this.currentPath_.push({type: arcType,
                           x: p.x,
                           y: p.y,
                           radius: aRadius,
                           xStart: pStart.x,
                           yStart: pStart.y,
                           xEnd: pEnd.x,
                           yEnd: pEnd.y});

  };

  contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
  };

  contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
    var oldPath = this.currentPath_;
    this.beginPath();

    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.stroke();

    this.currentPath_ = oldPath;
  };

  contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
    var oldPath = this.currentPath_;
    this.beginPath();

    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.fill();

    this.currentPath_ = oldPath;
  };

  contextPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
    var gradient = new CanvasGradient_('gradient');
    gradient.x0_ = aX0;
    gradient.y0_ = aY0;
    gradient.x1_ = aX1;
    gradient.y1_ = aY1;
    return gradient;
  };

  contextPrototype.createRadialGradient = function(aX0, aY0, aR0,
                                                   aX1, aY1, aR1) {
    var gradient = new CanvasGradient_('gradientradial');
    gradient.x0_ = aX0;
    gradient.y0_ = aY0;
    gradient.r0_ = aR0;
    gradient.x1_ = aX1;
    gradient.y1_ = aY1;
    gradient.r1_ = aR1;
    return gradient;
  };

  contextPrototype.drawImage = function(image, var_args) {
    var dx, dy, dw, dh, sx, sy, sw, sh;

    // to find the original width we overide the width and height
    var oldRuntimeWidth = image.runtimeStyle.width;
    var oldRuntimeHeight = image.runtimeStyle.height;
    image.runtimeStyle.width = 'auto';
    image.runtimeStyle.height = 'auto';

    // get the original size
    var w = image.width;
    var h = image.height;

    // and remove overides
    image.runtimeStyle.width = oldRuntimeWidth;
    image.runtimeStyle.height = oldRuntimeHeight;

    if (arguments.length == 3) {
      dx = arguments[1];
      dy = arguments[2];
      sx = sy = 0;
      sw = dw = w;
      sh = dh = h;
    } else if (arguments.length == 5) {
      dx = arguments[1];
      dy = arguments[2];
      dw = arguments[3];
      dh = arguments[4];
      sx = sy = 0;
      sw = w;
      sh = h;
    } else if (arguments.length == 9) {
      sx = arguments[1];
      sy = arguments[2];
      sw = arguments[3];
      sh = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dw = arguments[7];
      dh = arguments[8];
    } else {
      throw Error('Invalid number of arguments');
    }

    var d = getCoords(this, dx, dy);

    var w2 = sw / 2;
    var h2 = sh / 2;

    var vmlStr = [];

    var W = 10;
    var H = 10;

    // For some reason that I've now forgotten, using divs didn't work
    vmlStr.push(' <g_vml_:group',
                ' coordsize="', Z * W, ',', Z * H, '"',
                ' coordorigin="0,0"' ,
                ' style="width:', W, 'px;height:', H, 'px;position:absolute;');

    // If filters are necessary (rotation exists), create them
    // filters are bog-slow, so only create them if abbsolutely necessary
    // The following check doesn't account for skews (which don't exist
    // in the canvas spec (yet) anyway.

    if (this.m_[0][0] != 1 || this.m_[0][1] ||
        this.m_[1][1] != 1 || this.m_[1][0]) {
      var filter = [];

      // Note the 12/21 reversal
      filter.push('M11=', this.m_[0][0], ',',
                  'M12=', this.m_[1][0], ',',
                  'M21=', this.m_[0][1], ',',
                  'M22=', this.m_[1][1], ',',
                  'Dx=', mr(d.x / Z), ',',
                  'Dy=', mr(d.y / Z), '');

      // Bounding box calculation (need to minimize displayed area so that
      // filters don't waste time on unused pixels.
      var max = d;
      var c2 = getCoords(this, dx + dw, dy);
      var c3 = getCoords(this, dx, dy + dh);
      var c4 = getCoords(this, dx + dw, dy + dh);

      max.x = m.max(max.x, c2.x, c3.x, c4.x);
      max.y = m.max(max.y, c2.y, c3.y, c4.y);

      vmlStr.push('padding:0 ', mr(max.x / Z), 'px ', mr(max.y / Z),
                  'px 0;filter:progid:DXImageTransform.Microsoft.Matrix(',
                  filter.join(''), ", sizingmethod='clip');");

    } else {
      vmlStr.push('top:', mr(d.y / Z), 'px;left:', mr(d.x / Z), 'px;');
    }

    vmlStr.push(' ">' ,
                '<g_vml_:image src="', image.src, '"',
                ' style="width:', Z * dw, 'px;',
                ' height:', Z * dh, 'px"',
                ' cropleft="', sx / w, '"',
                ' croptop="', sy / h, '"',
                ' cropright="', (w - sx - sw) / w, '"',
                ' cropbottom="', (h - sy - sh) / h, '"',
                ' />',
                '</g_vml_:group>');

    this.element_.insertAdjacentHTML('BeforeEnd', vmlStr.join(''));
  };

  contextPrototype.stroke = function(aFill) {
    var lineStr = [];
    var lineOpen = false;

    var W = 10;
    var H = 10;

    lineStr.push('<g_vml_:shape',
                 ' filled="', !!aFill, '"',
                 ' style="position:absolute;width:', W, 'px;height:', H, 'px;"',
                 ' coordorigin="0,0"',
                 ' coordsize="', Z * W, ',', Z * H, '"',
                 ' stroked="', !aFill, '"',
                 ' path="');

    var newSeq = false;
    var min = {x: null, y: null};
    var max = {x: null, y: null};

    for (var i = 0; i < this.currentPath_.length; i++) {
      var p = this.currentPath_[i];
      var c;

      switch (p.type) {
        case 'moveTo':
          c = p;
          lineStr.push(' m ', mr(p.x), ',', mr(p.y));
          break;
        case 'lineTo':
          lineStr.push(' l ', mr(p.x), ',', mr(p.y));
          break;
        case 'close':
          lineStr.push(' x ');
          p = null;
          break;
        case 'bezierCurveTo':
          lineStr.push(' c ',
                       mr(p.cp1x), ',', mr(p.cp1y), ',',
                       mr(p.cp2x), ',', mr(p.cp2y), ',',
                       mr(p.x), ',', mr(p.y));
          break;
        case 'at':
        case 'wa':
          lineStr.push(' ', p.type, ' ',
                       mr(p.x - this.arcScaleX_ * p.radius), ',',
                       mr(p.y - this.arcScaleY_ * p.radius), ' ',
                       mr(p.x + this.arcScaleX_ * p.radius), ',',
                       mr(p.y + this.arcScaleY_ * p.radius), ' ',
                       mr(p.xStart), ',', mr(p.yStart), ' ',
                       mr(p.xEnd), ',', mr(p.yEnd));
          break;
      }


      // TODO: Following is broken for curves due to
      //       move to proper paths.

      // Figure out dimensions so we can do gradient fills
      // properly
      if (p) {
        if (min.x == null || p.x < min.x) {
          min.x = p.x;
        }
        if (max.x == null || p.x > max.x) {
          max.x = p.x;
        }
        if (min.y == null || p.y < min.y) {
          min.y = p.y;
        }
        if (max.y == null || p.y > max.y) {
          max.y = p.y;
        }
      }
    }
    lineStr.push(' ">');

    if (!aFill) {
      appendStroke(this, lineStr);
    } else {
      appendFill(this, lineStr, min, max);
    }

    lineStr.push('</g_vml_:shape>');

    this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
  };

  function appendStroke(ctx, lineStr) {
    var a = processStyle(ctx.strokeStyle);
    var color = a.color;
    var opacity = a.alpha * ctx.globalAlpha;
    var lineWidth = ctx.lineScale_ * ctx.lineWidth;

    // VML cannot correctly render a line if the width is less than 1px.
    // In that case, we dilute the color to make the line look thinner.
    if (lineWidth < 1) {
      opacity *= lineWidth;
    }

    lineStr.push(
      '<g_vml_:stroke',
      ' opacity="', opacity, '"',
      ' joinstyle="', ctx.lineJoin, '"',
      ' miterlimit="', ctx.miterLimit, '"',
      ' endcap="', processLineCap(ctx.lineCap), '"',
      ' weight="', lineWidth, 'px"',
      ' color="', color, '" />'
    );
  }

  function appendFill(ctx, lineStr, min, max) {
    var fillStyle = ctx.fillStyle;
    var arcScaleX = ctx.arcScaleX_;
    var arcScaleY = ctx.arcScaleY_;
    var width = max.x - min.x;
    var height = max.y - min.y;
    if (fillStyle instanceof CanvasGradient_) {
      // TODO: Gradients transformed with the transformation matrix.
      var angle = 0;
      var focus = {x: 0, y: 0};

      // additional offset
      var shift = 0;
      // scale factor for offset
      var expansion = 1;

      if (fillStyle.type_ == 'gradient') {
        var x0 = fillStyle.x0_ / arcScaleX;
        var y0 = fillStyle.y0_ / arcScaleY;
        var x1 = fillStyle.x1_ / arcScaleX;
        var y1 = fillStyle.y1_ / arcScaleY;
        var p0 = getCoords(ctx, x0, y0);
        var p1 = getCoords(ctx, x1, y1);
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        angle = Math.atan2(dx, dy) * 180 / Math.PI;

        // The angle should be a non-negative number.
        if (angle < 0) {
          angle += 360;
        }

        // Very small angles produce an unexpected result because they are
        // converted to a scientific notation string.
        if (angle < 1e-6) {
          angle = 0;
        }
      } else {
        var p0 = getCoords(ctx, fillStyle.x0_, fillStyle.y0_);
        focus = {
          x: (p0.x - min.x) / width,
          y: (p0.y - min.y) / height
        };

        width  /= arcScaleX * Z;
        height /= arcScaleY * Z;
        var dimension = m.max(width, height);
        shift = 2 * fillStyle.r0_ / dimension;
        expansion = 2 * fillStyle.r1_ / dimension - shift;
      }

      // We need to sort the color stops in ascending order by offset,
      // otherwise IE won't interpret it correctly.
      var stops = fillStyle.colors_;
      stops.sort(function(cs1, cs2) {
        return cs1.offset - cs2.offset;
      });

      var length = stops.length;
      var color1 = stops[0].color;
      var color2 = stops[length - 1].color;
      var opacity1 = stops[0].alpha * ctx.globalAlpha;
      var opacity2 = stops[length - 1].alpha * ctx.globalAlpha;

      var colors = [];
      for (var i = 0; i < length; i++) {
        var stop = stops[i];
        colors.push(stop.offset * expansion + shift + ' ' + stop.color);
      }

      // When colors attribute is used, the meanings of opacity and o:opacity2
      // are reversed.
      lineStr.push('<g_vml_:fill type="', fillStyle.type_, '"',
                   ' method="none" focus="100%"',
                   ' color="', color1, '"',
                   ' color2="', color2, '"',
                   ' colors="', colors.join(','), '"',
                   ' opacity="', opacity2, '"',
                   ' g_o_:opacity2="', opacity1, '"',
                   ' angle="', angle, '"',
                   ' focusposition="', focus.x, ',', focus.y, '" />');
    } else if (fillStyle instanceof CanvasPattern_) {
      if (width && height) {
        var deltaLeft = -min.x;
        var deltaTop = -min.y;
        lineStr.push('<g_vml_:fill',
                     ' position="',
                     deltaLeft / width * arcScaleX * arcScaleX, ',',
                     deltaTop / height * arcScaleY * arcScaleY, '"',
                     ' type="tile"',
                     // TODO: Figure out the correct size to fit the scale.
                     //' size="', w, 'px ', h, 'px"',
                     ' src="', fillStyle.src_, '" />');
       }
    } else {
      var a = processStyle(ctx.fillStyle);
      var color = a.color;
      var opacity = a.alpha * ctx.globalAlpha;
      lineStr.push('<g_vml_:fill color="', color, '" opacity="', opacity,
                   '" />');
    }
  }

  contextPrototype.fill = function() {
    this.stroke(true);
  };

  contextPrototype.closePath = function() {
    this.currentPath_.push({type: 'close'});
  };

  function getCoords(ctx, aX, aY) {
    var m = ctx.m_;
    return {
      x: Z * (aX * m[0][0] + aY * m[1][0] + m[2][0]) - Z2,
      y: Z * (aX * m[0][1] + aY * m[1][1] + m[2][1]) - Z2
    };
  };

  contextPrototype.save = function() {
    var o = {};
    copyState(this, o);
    this.aStack_.push(o);
    this.mStack_.push(this.m_);
    this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
  };

  contextPrototype.restore = function() {
    if (this.aStack_.length) {
      copyState(this.aStack_.pop(), this);
      this.m_ = this.mStack_.pop();
    }
  };

  function matrixIsFinite(m) {
    return isFinite(m[0][0]) && isFinite(m[0][1]) &&
        isFinite(m[1][0]) && isFinite(m[1][1]) &&
        isFinite(m[2][0]) && isFinite(m[2][1]);
  }

  function setM(ctx, m, updateLineScale) {
    if (!matrixIsFinite(m)) {
      return;
    }
    ctx.m_ = m;

    if (updateLineScale) {
      // Get the line scale.
      // Determinant of this.m_ means how much the area is enlarged by the
      // transformation. So its square root can be used as a scale factor
      // for width.
      var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
      ctx.lineScale_ = sqrt(abs(det));
    }
  }

  contextPrototype.translate = function(aX, aY) {
    var m1 = [
      [1,  0,  0],
      [0,  1,  0],
      [aX, aY, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_), false);
  };

  contextPrototype.rotate = function(aRot) {
    var c = mc(aRot);
    var s = ms(aRot);

    var m1 = [
      [c,  s, 0],
      [-s, c, 0],
      [0,  0, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_), false);
  };

  contextPrototype.scale = function(aX, aY) {
    this.arcScaleX_ *= aX;
    this.arcScaleY_ *= aY;
    var m1 = [
      [aX, 0,  0],
      [0,  aY, 0],
      [0,  0,  1]
    ];

    setM(this, matrixMultiply(m1, this.m_), true);
  };

  contextPrototype.transform = function(m11, m12, m21, m22, dx, dy) {
    var m1 = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx,  dy,  1]
    ];

    setM(this, matrixMultiply(m1, this.m_), true);
  };

  contextPrototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
    var m = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx,  dy,  1]
    ];

    setM(this, m, true);
  };

  /**
   * The text drawing function.
   * The maxWidth argument isn't taken in account, since no browser supports
   * it yet.
   */
  contextPrototype.drawText_ = function(text, x, y, maxWidth, stroke) {
    var m = this.m_,
        delta = 1000,
        left = 0,
        right = delta,
        offset = {x: 0, y: 0},
        lineStr = [];

    var fontStyle = getComputedStyle(processFontStyle(this.font), this.element_);

    var fontStyleString = buildStyle(fontStyle);

    var elementStyle = this.element_.currentStyle;
    var textAlign = this.textAlign.toLowerCase();
    switch (textAlign) {
      case 'left':
      case 'center':
      case 'right':
        break;
      case 'end':
        textAlign = elementStyle.direction == 'ltr' ? 'right' : 'left';
        break;
      case 'start':
        textAlign = elementStyle.direction == 'rtl' ? 'right' : 'left';
        break;
      default:
        textAlign = 'left';
    }

    // 1.75 is an arbitrary number, as there is no info about the text baseline
    switch (this.textBaseline) {
      case 'hanging':
      case 'top':
        offset.y = fontStyle.size / 1.75;
        break;
      case 'middle':
        break;
      default:
      case null:
      case 'alphabetic':
      case 'ideographic':
      case 'bottom':
        offset.y = -fontStyle.size / 2.25;
        break;
    }

    switch(textAlign) {
      case 'right':
        left = delta;
        right = 0.05;
        break;
      case 'center':
        left = right = delta / 2;
        break;
    }

    var d = getCoords(this, x + offset.x, y + offset.y);

    lineStr.push('<g_vml_:line from="', -left ,' 0" to="', right ,' 0.05" ',
                 ' coordsize="100 100" coordorigin="0 0"',
                 ' filled="', !stroke, '" stroked="', !!stroke,
                 '" style="position:absolute;width:1px;height:1px;">');

    if (stroke) {
      appendStroke(this, lineStr);
    } else {
      // TODO: Fix the min and max params.
      appendFill(this, lineStr, {x: -left, y: 0},
                 {x: right, y: fontStyle.size});
    }

    var skewM = m[0][0].toFixed(3) + ',' + m[1][0].toFixed(3) + ',' +
                m[0][1].toFixed(3) + ',' + m[1][1].toFixed(3) + ',0,0';

    var skewOffset = mr(d.x / Z + 1 - m[0][0]) + ',' + mr(d.y / Z - 2 * m[1][0]);


    lineStr.push('<g_vml_:skew on="t" matrix="', skewM ,'" ',
                 ' offset="', skewOffset, '" origin="', left ,' 0" />',
                 '<g_vml_:path textpathok="true" />',
                 '<g_vml_:textpath on="true" string="',
                 encodeHtmlAttribute(text),
                 '" style="v-text-align:', textAlign,
                 ';font:', encodeHtmlAttribute(fontStyleString),
                 '" /></g_vml_:line>');

    this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
  };

  contextPrototype.fillText = function(text, x, y, maxWidth) {
    this.drawText_(text, x, y, maxWidth, false);
  };

  contextPrototype.strokeText = function(text, x, y, maxWidth) {
    this.drawText_(text, x, y, maxWidth, true);
  };

  contextPrototype.measureText = function(text) {
    if (!this.textMeasureEl_) {
      var s = '<span style="position:absolute;' +
          'top:-20000px;left:0;padding:0;margin:0;border:none;' +
          'white-space:pre;"></span>';
      this.element_.insertAdjacentHTML('beforeEnd', s);
      this.textMeasureEl_ = this.element_.lastChild;
    }
    var doc = this.element_.ownerDocument;
    this.textMeasureEl_.innerHTML = '';
    this.textMeasureEl_.style.font = this.font;
    // Don't use innerHTML or innerText because they allow markup/whitespace.
    this.textMeasureEl_.appendChild(doc.createTextNode(text));
    return {width: this.textMeasureEl_.offsetWidth};
  };

  /******** STUBS ********/
  contextPrototype.clip = function() {
    // TODO: Implement
  };

  contextPrototype.arcTo = function() {
    // TODO: Implement
  };

  contextPrototype.createPattern = function(image, repetition) {
    return new CanvasPattern_(image, repetition);
  };

  // Gradient / Pattern Stubs
  function CanvasGradient_(aType) {
    this.type_ = aType;
    this.x0_ = 0;
    this.y0_ = 0;
    this.r0_ = 0;
    this.x1_ = 0;
    this.y1_ = 0;
    this.r1_ = 0;
    this.colors_ = [];
  }

  CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
    aColor = processStyle(aColor);
    this.colors_.push({offset: aOffset,
                       color: aColor.color,
                       alpha: aColor.alpha});
  };

  function CanvasPattern_(image, repetition) {
    assertImageIsValid(image);
    switch (repetition) {
      case 'repeat':
      case null:
      case '':
        this.repetition_ = 'repeat';
        break;
      case 'repeat-x':
      case 'repeat-y':
      case 'no-repeat':
        this.repetition_ = repetition;
        break;
      default:
        throwException('SYNTAX_ERR');
    }

    this.src_ = image.src;
    this.width_ = image.width;
    this.height_ = image.height;
  }

  function throwException(s) {
    throw new DOMException_(s);
  }

  function assertImageIsValid(img) {
    if (!img || img.nodeType != 1 || img.tagName != 'IMG') {
      throwException('TYPE_MISMATCH_ERR');
    }
    if (img.readyState != 'complete') {
      throwException('INVALID_STATE_ERR');
    }
  }

  function DOMException_(s) {
    this.code = this[s];
    this.message = s +': DOM Exception ' + this.code;
  }
  var p = DOMException_.prototype = new Error;
  p.INDEX_SIZE_ERR = 1;
  p.DOMSTRING_SIZE_ERR = 2;
  p.HIERARCHY_REQUEST_ERR = 3;
  p.WRONG_DOCUMENT_ERR = 4;
  p.INVALID_CHARACTER_ERR = 5;
  p.NO_DATA_ALLOWED_ERR = 6;
  p.NO_MODIFICATION_ALLOWED_ERR = 7;
  p.NOT_FOUND_ERR = 8;
  p.NOT_SUPPORTED_ERR = 9;
  p.INUSE_ATTRIBUTE_ERR = 10;
  p.INVALID_STATE_ERR = 11;
  p.SYNTAX_ERR = 12;
  p.INVALID_MODIFICATION_ERR = 13;
  p.NAMESPACE_ERR = 14;
  p.INVALID_ACCESS_ERR = 15;
  p.VALIDATION_ERR = 16;
  p.TYPE_MISMATCH_ERR = 17;

  // set up externs
  G_vmlCanvasManager = G_vmlCanvasManager_;
  CanvasRenderingContext2D = CanvasRenderingContext2D_;
  CanvasGradient = CanvasGradient_;
  CanvasPattern = CanvasPattern_;
  DOMException = DOMException_;
  G_vmlCanvasManager._version = 888;
})();

} // if

(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cu(a){if(!cj[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ck||(ck=c.createElement("iframe"),ck.frameBorder=ck.width=ck.height=0),b.appendChild(ck);if(!cl||!ck.createElement)cl=(ck.contentWindow||ck.contentDocument).document,cl.write((f.support.boxModel?"<!doctype html>":"")+"<html><body>"),cl.close();d=cl.createElement(a),cl.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ck)}cj[a]=e}return cj[a]}function ct(a,b){var c={};f.each(cp.concat.apply([],cp.slice(0,b)),function(){c[this]=a});return c}function cs(){cq=b}function cr(){setTimeout(cs,0);return cq=f.now()}function ci(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ch(){try{return new a.XMLHttpRequest}catch(b){}}function cb(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function ca(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function b_(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bD.test(a)?d(a,e):b_(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&f.type(b)==="object")for(var e in b)b_(a+"["+e+"]",b[e],c,d);else d(a,b)}function b$(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bZ(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bS,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bZ(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bZ(a,c,d,e,"*",g));return l}function bY(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bO),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bB(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?1:0,g=4;if(d>0){if(c!=="border")for(;e<g;e+=2)c||(d-=parseFloat(f.css(a,"padding"+bx[e]))||0),c==="margin"?d+=parseFloat(f.css(a,c+bx[e]))||0:d-=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0;return d+"px"}d=by(a,b);if(d<0||d==null)d=a.style[b];if(bt.test(d))return d;d=parseFloat(d)||0;if(c)for(;e<g;e+=2)d+=parseFloat(f.css(a,"padding"+bx[e]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+bx[e]))||0);return d+"px"}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;b.nodeType===1&&(b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?b.outerHTML=a.outerHTML:c!=="input"||a.type!=="checkbox"&&a.type!=="radio"?c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text):(a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value)),b.removeAttribute(f.expando),b.removeAttribute("_submit_attached"),b.removeAttribute("_change_attached"))}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c,i[c][d])}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?+d:j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.2",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){if(typeof c!="string"||!c)return null;var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h,i){var j,k=d==null,l=0,m=a.length;if(d&&typeof d=="object"){for(l in d)e.access(a,c,l,d[l],1,h,f);g=1}else if(f!==b){j=i===b&&e.isFunction(f),k&&(j?(j=c,c=function(a,b,c){return j.call(e(a),c)}):(c.call(a,f),c=null));if(c)for(;l<m;l++)c(a[l],d,j?f.call(a[l],l,c(a[l],d)):f,i);g=1}return g?a:k?c.call(a):m?c(a[0],d):h},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m,n=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?n(g):h==="function"&&(!a.unique||!p.has(g))&&c.push(g)},o=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,j=!0,m=k||0,k=0,l=c.length;for(;c&&m<l;m++)if(c[m].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}j=!1,c&&(a.once?e===!0?p.disable():c=[]:d&&d.length&&(e=d.shift(),p.fireWith(e[0],e[1])))},p={add:function(){if(c){var a=c.length;n(arguments),j?l=c.length:e&&e!==!0&&(k=a,o(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){j&&f<=l&&(l--,f<=m&&m--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&p.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(j?a.once||d.push([b,c]):(!a.once||!e)&&o(b,c));return this},fire:function(){p.fireWith(this,arguments);return this},fired:function(){return!!i}};return p};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p=c.createElement("div"),q=c.documentElement;p.setAttribute("className","t"),p.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=p.getElementsByTagName("*"),e=p.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=p.getElementsByTagName("input")[0],b={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:p.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,pixelMargin:!0},f.boxModel=b.boxModel=c.compatMode==="CSS1Compat",i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete p.test}catch(r){b.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",function(){b.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),i.setAttribute("name","t"),p.appendChild(i),j=c.createDocumentFragment(),j.appendChild(p.lastChild),b.checkClone=j.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,j.removeChild(i),j.appendChild(p);if(p.attachEvent)for(n in{submit:1,change:1,focusin:1})m="on"+n,o=m in p,o||(p.setAttribute(m,"return;"),o=typeof p[m]=="function"),b[n+"Bubbles"]=o;j.removeChild(p),j=g=h=p=i=null,f(function(){var d,e,g,h,i,j,l,m,n,q,r,s,t,u=c.getElementsByTagName("body")[0];!u||(m=1,t="padding:0;margin:0;border:",r="position:absolute;top:0;left:0;width:1px;height:1px;",s=t+"0;visibility:hidden;",n="style='"+r+t+"5px solid #000;",q="<div "+n+"display:block;'><div style='"+t+"0;display:block;overflow:hidden;'></div></div>"+"<table "+n+"' cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",d=c.createElement("div"),d.style.cssText=s+"width:0;height:0;position:static;top:0;margin-top:"+m+"px",u.insertBefore(d,u.firstChild),p=c.createElement("div"),d.appendChild(p),p.innerHTML="<table><tr><td style='"+t+"0;display:none'></td><td>t</td></tr></table>",k=p.getElementsByTagName("td"),o=k[0].offsetHeight===0,k[0].style.display="",k[1].style.display="none",b.reliableHiddenOffsets=o&&k[0].offsetHeight===0,a.getComputedStyle&&(p.innerHTML="",l=c.createElement("div"),l.style.width="0",l.style.marginRight="0",p.style.width="2px",p.appendChild(l),b.reliableMarginRight=(parseInt((a.getComputedStyle(l,null)||{marginRight:0}).marginRight,10)||0)===0),typeof p.style.zoom!="undefined"&&(p.innerHTML="",p.style.width=p.style.padding="1px",p.style.border=0,p.style.overflow="hidden",p.style.display="inline",p.style.zoom=1,b.inlineBlockNeedsLayout=p.offsetWidth===3,p.style.display="block",p.style.overflow="visible",p.innerHTML="<div style='width:5px;'></div>",b.shrinkWrapBlocks=p.offsetWidth!==3),p.style.cssText=r+s,p.innerHTML=q,e=p.firstChild,g=e.firstChild,i=e.nextSibling.firstChild.firstChild,j={doesNotAddBorder:g.offsetTop!==5,doesAddBorderForTableAndCells:i.offsetTop===5},g.style.position="fixed",g.style.top="20px",j.fixedPosition=g.offsetTop===20||g.offsetTop===15,g.style.position=g.style.top="",e.style.overflow="hidden",e.style.position="relative",j.subtractsBorderForOverflowNotVisible=g.offsetTop===-5,j.doesNotIncludeMarginInBodyOffset=u.offsetTop!==m,a.getComputedStyle&&(p.style.marginTop="1%",b.pixelMargin=(a.getComputedStyle(p,null)||{marginTop:0}).marginTop!=="1%"),typeof d.style.zoom!="undefined"&&(d.style.zoom=1),u.removeChild(d),l=p=d=null,f.extend(b,j))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h,i,j=this[0],k=0,m=null;if(a===b){if(this.length){m=f.data(j);if(j.nodeType===1&&!f._data(j,"parsedAttrs")){g=j.attributes;for(i=g.length;k<i;k++)h=g[k].name,h.indexOf("data-")===0&&(h=f.camelCase(h.substring(5)),l(j,h,m[h]));f._data(j,"parsedAttrs",!0)}}return m}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!";return f.access(this,function(c){if(c===b){m=this.triggerHandler("getData"+e,[d[0]]),m===b&&j&&(m=f.data(j,a),m=l(j,a,m));return m===b&&d[1]?this.data(d[0]):m}d[1]=c,this.each(function(){var b=f(this);b.triggerHandler("setData"+e,d),f.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1)},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){var d=2;typeof a!="string"&&(c=a,a="fx",d--);if(arguments.length<d)return f.queue(this[0],a);return c===b?this:this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise(c)}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,f.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,f.prop,a,b,arguments.length>1)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.type]||f.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.type]||f.valHooks[g.nodeName.toLowerCase()];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h,i=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;i<g;i++)e=d[i],e&&(c=f.propFix[e]||e,h=u.test(e),h||f.attr(a,e,""),a.removeAttribute(v?e:c),h&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0,coords:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/(?:^|\s)hover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(
a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler,g=p.selector),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:g&&G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=f.event.special[c.type]||{},j=[],k,l,m,n,o,p,q,r,s,t,u;g[0]=c,c.delegateTarget=this;if(!i.preDispatch||i.preDispatch.call(this,c)!==!1){if(e&&(!c.button||c.type!=="click")){n=f(this),n.context=this.ownerDocument||this;for(m=c.target;m!=this;m=m.parentNode||this)if(m.disabled!==!0){p={},r=[],n[0]=m;for(k=0;k<e;k++)s=d[k],t=s.selector,p[t]===b&&(p[t]=s.quick?H(m,s.quick):n.is(t)),p[t]&&r.push(s);r.length&&j.push({elem:m,matches:r})}}d.length>e&&j.push({elem:this,matches:d.slice(e)});for(k=0;k<j.length&&!c.isPropagationStopped();k++){q=j[k],c.currentTarget=q.elem;for(l=0;l<q.matches.length&&!c.isImmediatePropagationStopped();l++){s=q.matches[l];if(h||!c.namespace&&!s.namespace||c.namespace_re&&c.namespace_re.test(s.namespace))c.data=s.data,c.handleObj=s,o=((f.event.special[s.origType]||{}).handle||s.handler).apply(q.elem,g),o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()))}}i.postDispatch&&i.postDispatch.call(this,c);return c.result}},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),d._submit_attached=!0)})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9||d===11){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));o.match.globalPOS=p;var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.globalPOS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")[\\s/>]","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){return f.access(this,function(a){return a===b?f.text(this):this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f
.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){return f.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(f.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(g){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,function(a,b){b.src?f.ajax({type:"GET",global:!1,url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||f.isXMLDoc(a)||!bc.test("<"+a.nodeName+">")?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g,h,i,j=[];b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);for(var k=0,l;(l=a[k])!=null;k++){typeof l=="number"&&(l+="");if(!l)continue;if(typeof l=="string")if(!_.test(l))l=b.createTextNode(l);else{l=l.replace(Y,"<$1></$2>");var m=(Z.exec(l)||["",""])[1].toLowerCase(),n=bg[m]||bg._default,o=n[0],p=b.createElement("div"),q=bh.childNodes,r;b===c?bh.appendChild(p):U(b).appendChild(p),p.innerHTML=n[1]+l+n[2];while(o--)p=p.lastChild;if(!f.support.tbody){var s=$.test(l),t=m==="table"&&!s?p.firstChild&&p.firstChild.childNodes:n[1]==="<table>"&&!s?p.childNodes:[];for(i=t.length-1;i>=0;--i)f.nodeName(t[i],"tbody")&&!t[i].childNodes.length&&t[i].parentNode.removeChild(t[i])}!f.support.leadingWhitespace&&X.test(l)&&p.insertBefore(b.createTextNode(X.exec(l)[0]),p.firstChild),l=p.childNodes,p&&(p.parentNode.removeChild(p),q.length>0&&(r=q[q.length-1],r&&r.parentNode&&r.parentNode.removeChild(r)))}var u;if(!f.support.appendChecked)if(l[0]&&typeof (u=l.length)=="number")for(i=0;i<u;i++)bn(l[i]);else bn(l);l.nodeType?j.push(l):j=f.merge(j,l)}if(d){g=function(a){return!a.type||be.test(a.type)};for(k=0;j[k];k++){h=j[k];if(e&&f.nodeName(h,"script")&&(!h.type||be.test(h.type)))e.push(h.parentNode?h.parentNode.removeChild(h):h);else{if(h.nodeType===1){var v=f.grep(h.getElementsByTagName("script"),g);j.splice.apply(j,[k+1,0].concat(v))}d.appendChild(h)}}}return j},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bp=/alpha\([^)]*\)/i,bq=/opacity=([^)]*)/,br=/([A-Z]|^ms)/g,bs=/^[\-+]?(?:\d*\.)?\d+$/i,bt=/^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,bu=/^([\-+])=([\-+.\de]+)/,bv=/^margin/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Top","Right","Bottom","Left"],by,bz,bA;f.fn.css=function(a,c){return f.access(this,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)},a,c,arguments.length>1)},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=by(a,"opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bu.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(by)return by(a,c)},swap:function(a,b,c){var d={},e,f;for(f in b)d[f]=a.style[f],a.style[f]=b[f];e=c.call(a);for(f in b)a.style[f]=d[f];return e}}),f.curCSS=f.css,c.defaultView&&c.defaultView.getComputedStyle&&(bz=function(a,b){var c,d,e,g,h=a.style;b=b.replace(br,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b))),!f.support.pixelMargin&&e&&bv.test(b)&&bt.test(c)&&(g=h.width,h.width=c,c=e.width,h.width=g);return c}),c.documentElement.currentStyle&&(bA=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f==null&&g&&(e=g[b])&&(f=e),bt.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),by=bz||bA,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth!==0?bB(a,b,d):f.swap(a,bw,function(){return bB(a,b,d)})},set:function(a,b){return bs.test(b)?b+"px":b}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bq.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bp,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bp.test(g)?g.replace(bp,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){return f.swap(a,{display:"inline-block"},function(){return b?by(a,"margin-right"):a.style.marginRight})}})}),f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)}),f.each({margin:"",padding:"",border:"Width"},function(a,b){f.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bx[d]+b]=e[d]||e[d-2]||e[0];return f}}});var bC=/%20/g,bD=/\[\]$/,bE=/\r?\n/g,bF=/#.*$/,bG=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bH=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bI=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bJ=/^(?:GET|HEAD)$/,bK=/^\/\//,bL=/\?/,bM=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bN=/^(?:select|textarea)/i,bO=/\s+/,bP=/([?&])_=[^&]*/,bQ=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bR=f.fn.load,bS={},bT={},bU,bV,bW=["*/"]+["*"];try{bU=e.href}catch(bX){bU=c.createElement("a"),bU.href="",bU=bU.href}bV=bQ.exec(bU.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bR)return bR.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bM,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bN.test(this.nodeName)||bH.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bE,"\r\n")}}):{name:b.name,value:c.replace(bE,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b$(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b$(a,b);return a},ajaxSettings:{url:bU,isLocal:bI.test(bV[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bW},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bY(bS),ajaxTransport:bY(bT),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?ca(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cb(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bG.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bF,"").replace(bK,bV[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bO),d.crossDomain==null&&(r=bQ.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bV[1]&&r[2]==bV[2]&&(r[3]||(r[1]==="http:"?80:443))==(bV[3]||(bV[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bZ(bS,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bJ.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bL.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bP,"$1_="+x);d.url=y+(y===d.url?(bL.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bW+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bZ(bT,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)b_(g,a[g],c,e);return d.join("&").replace(bC,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cc=f.now(),cd=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cc++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=typeof b.data=="string"&&/^application\/x\-www\-form\-urlencoded/.test(b.contentType);if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(cd.test(b.url)||e&&cd.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(cd,l),b.url===j&&(e&&(k=k.replace(cd,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var ce=a.ActiveXObject?function(){for(var a in cg)cg[a](0,1)}:!1,cf=0,cg;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ch()||ci()}:ch,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,ce&&delete cg[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n);try{m.text=h.responseText}catch(a){}try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cf,ce&&(cg||(cg={},f(a).unload(ce)),cg[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cj={},ck,cl,cm=/^(?:toggle|show|hide)$/,cn=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,co,cp=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cq;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(ct("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),(e===""&&f.css(d,"display")==="none"||!f.contains(d.ownerDocument.documentElement,d))&&f._data(d,"olddisplay",cu(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(ct("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(ct("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o,p,q;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]);if((k=f.cssHooks[g])&&"expand"in k){l=k.expand(a[g]),delete a[g];for(i in l)i in a||(a[i]=l[i])}}for(g in a){h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cu(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cm.test(h)?(q=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),q?(f._data(this,"toggle"+i,q==="show"?"hide":"show"),j[q]()):j[h]()):(m=cn.exec(h),n=j.cur(),m?(o=parseFloat(m[2]),p=m[3]||(f.cssNumber[i]?"":"px"),p!=="px"&&(f.style(this,i,(o||1)+p),n=(o||1)/j.cur()*n,f.style(this,i,n+p)),m[1]&&(o=(m[1]==="-="?-1:1)*o+n),j.custom(n,o,p)):j.custom(n,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:ct("show",1),slideUp:ct("hide",1),slideToggle:ct("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a){return a},swing:function(a){return-Math.cos(a*Math.PI)/2+.5}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cq||cr(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){f._data(e.elem,"fxshow"+e.prop)===b&&(e.options.hide?f._data(e.elem,"fxshow"+e.prop,e.start):e.options.show&&f._data(e.elem,"fxshow"+e.prop,e.end))},h()&&f.timers.push(h)&&!co&&(co=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cq||cr(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(co),co=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(cp.concat.apply([],cp),function(a,b){b.indexOf("margin")&&(f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)})}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cv,cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?cv=function(a,b,c,d){try{d=a.getBoundingClientRect()}catch(e){}if(!d||!f.contains(c,a))return d?{top:d.top,left:d.left}:{top:0,left:0};var g=b.body,h=cy(b),i=c.clientTop||g.clientTop||0,j=c.clientLeft||g.clientLeft||0,k=h.pageYOffset||f.support.boxModel&&c.scrollTop||g.scrollTop,l=h.pageXOffset||f.support.boxModel&&c.scrollLeft||g.scrollLeft,m=d.top+k-i,n=d.left+l-j;return{top:m,left:n}}:cv=function(a,b,c){var d,e=a.offsetParent,g=a,h=b.body,i=b.defaultView,j=i?i.getComputedStyle(a,null):a.currentStyle,k=a.offsetTop,l=a.offsetLeft;while((a=a.parentNode)&&a!==h&&a!==c){if(f.support.fixedPosition&&j.position==="fixed")break;d=i?i.getComputedStyle(a,null):a.currentStyle,k-=a.scrollTop,l-=a.scrollLeft,a===e&&(k+=a.offsetTop,l+=a.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(a.nodeName))&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),g=e,e=a.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),j=d}if(j.position==="relative"||j.position==="static")k+=h.offsetTop,l+=h.offsetLeft;f.support.fixedPosition&&j.position==="fixed"&&(k+=Math.max(c.scrollTop,h.scrollTop),l+=Math.max(c.scrollLeft,h.scrollLeft));return{top:k,left:l}},f.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){f.offset.setOffset(this,a,b)});var c=this[0],d=c&&c.ownerDocument;if(!d)return null;if(c===d.body)return f.offset.bodyOffset(c);return cv(c,d,d.documentElement)},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);f.fn[a]=function(e){return f.access(this,function(a,e,g){var h=cy(a);if(g===b)return h?c in h?h[c]:f.support.boxModel&&h.document.documentElement[e]||h.document.body[e]:a[e];h?h.scrollTo(d?f(h).scrollLeft():g,d?g:f(h).scrollTop()):a[e]=g},a,e,arguments.length,null)}}),f.each({Height:"height",Width:"width"},function(a,c){var d="client"+a,e="scroll"+a,g="offset"+a;f.fn["inner"+a]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,c,"padding")):this[c]():null},f.fn["outer"+a]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,c,a?"margin":"border")):this[c]():null},f.fn[c]=function(a){return f.access(this,function(a,c,h){var i,j,k,l;if(f.isWindow(a)){i=a.document,j=i.documentElement[d];return f.support.boxModel&&j||i.body&&i.body[d]||j}if(a.nodeType===9){i=a.documentElement;if(i[d]>=i[e])return i[d];return Math.max(a.body[e],i[e],a.body[g],i[g])}if(h===b){k=f.css(a,c),l=parseFloat(k);return f.isNumeric(l)?l:k}f(a).css(c,h)},c,a,arguments.length,null)}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);
 * jQuery UI 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(c,j){function k(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.8.7",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,
NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;setTimeout(function(){c(d).focus();b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,
"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");
if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,l,m){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(l)g-=parseFloat(c.curCSS(f,
"border"+this+"Width",true))||0;if(m)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,
d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){var b=a.nodeName.toLowerCase(),d=c.attr(a,"tabindex");if("area"===b){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&k(a)}return(/input|select|textarea|button|object/.test(b)?!a.disabled:"a"==b?a.href||!isNaN(d):!isNaN(d))&&k(a)},tabbable:function(a){var b=c.attr(a,"tabindex");return(isNaN(b)||b>=0)&&c(a).is(":focusable")}});
c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode)for(var e=0;e<b.length;e++)a.options[b[e][0]]&&
b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i)}})}})(jQuery);
;/*!
 * jQuery UI Widget 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)b(d).triggerHandler("remove");k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=function(h){return!!b.data(h,
a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):d;if(e&&d.charAt(0)==="_")return h;
e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=b.extend(true,{},this.options,
this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},
widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},
enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);
;/*!
 * jQuery UI Mouse 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function(c){c.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var a=this;this.element.bind("mousedown."+this.widgetName,function(b){return a._mouseDown(b)}).bind("click."+this.widgetName,function(b){if(true===c.data(b.target,a.widgetName+".preventClickEvent")){c.removeData(b.target,a.widgetName+".preventClickEvent");b.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+this.widgetName)},_mouseDown:function(a){a.originalEvent=
a.originalEvent||{};if(!a.originalEvent.mouseHandled){this._mouseStarted&&this._mouseUp(a);this._mouseDownEvent=a;var b=this,e=a.which==1,f=typeof this.options.cancel=="string"?c(a.target).parents().add(a.target).filter(this.options.cancel).length:false;if(!e||f||!this._mouseCapture(a))return true;this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet)this._mouseDelayTimer=setTimeout(function(){b.mouseDelayMet=true},this.options.delay);if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)){this._mouseStarted=
this._mouseStart(a)!==false;if(!this._mouseStarted){a.preventDefault();return true}}this._mouseMoveDelegate=function(d){return b._mouseMove(d)};this._mouseUpDelegate=function(d){return b._mouseUp(d)};c(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);a.preventDefault();return a.originalEvent.mouseHandled=true}},_mouseMove:function(a){if(c.browser.msie&&!(document.documentMode>=9)&&!a.button)return this._mouseUp(a);if(this._mouseStarted){this._mouseDrag(a);
return a.preventDefault()}if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a))(this._mouseStarted=this._mouseStart(this._mouseDownEvent,a)!==false)?this._mouseDrag(a):this._mouseUp(a);return!this._mouseStarted},_mouseUp:function(a){c(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=false;a.target==this._mouseDownEvent.target&&c.data(a.target,this.widgetName+".preventClickEvent",
true);this._mouseStop(a)}return false},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true}})})(jQuery);
;/*
 * jQuery UI Draggable 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.draggable",d.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper==
"original"&&!/^(?:r|a|f)/.test(this.element.css("position")))this.element[0].style.position="relative";this.options.addClasses&&this.element.addClass("ui-draggable");this.options.disabled&&this.element.addClass("ui-draggable-disabled");this._mouseInit()},destroy:function(){if(this.element.data("draggable")){this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy();return this}},_mouseCapture:function(a){var b=
this.options;if(this.helper||b.disabled||d(a.target).is(".ui-resizable-handle"))return false;this.handle=this._getHandle(a);if(!this.handle)return false;return true},_mouseStart:function(a){var b=this.options;this.helper=this._createHelper(a);this._cacheHelperProportions();if(d.ui.ddmanager)d.ui.ddmanager.current=this;this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-
this.margins.top,left:this.offset.left-this.margins.left};d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this.position=this._generatePosition(a);this.originalPageX=a.pageX;this.originalPageY=a.pageY;b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);b.containment&&this._setContainment();if(this._trigger("start",a)===false){this._clear();return false}this._cacheHelperProportions();
d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.helper.addClass("ui-draggable-dragging");this._mouseDrag(a,true);return true},_mouseDrag:function(a,b){this.position=this._generatePosition(a);this.positionAbs=this._convertPositionTo("absolute");if(!b){b=this._uiHash();if(this._trigger("drag",a,b)===false){this._mouseUp({});return false}this.position=b.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||
this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);return false},_mouseStop:function(a){var b=false;if(d.ui.ddmanager&&!this.options.dropBehaviour)b=d.ui.ddmanager.drop(this,a);if(this.dropped){b=this.dropped;this.dropped=false}if(!this.element[0]||!this.element[0].parentNode)return false;if(this.options.revert=="invalid"&&!b||this.options.revert=="valid"&&b||this.options.revert===true||d.isFunction(this.options.revert)&&this.options.revert.call(this.element,
b)){var c=this;d(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){c._trigger("stop",a)!==false&&c._clear()})}else this._trigger("stop",a)!==false&&this._clear();return false},cancel:function(){this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear();return this},_getHandle:function(a){var b=!this.options.handle||!d(this.options.handle,this.element).length?true:false;d(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==
a.target)b=true});return b},_createHelper:function(a){var b=this.options;a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a])):b.helper=="clone"?this.element.clone():this.element;a.parents("body").length||a.appendTo(b.appendTo=="parent"?this.element[0].parentNode:b.appendTo);a[0]!=this.element[0]&&!/(fixed|absolute)/.test(a.css("position"))&&a.css("position","absolute");return a},_adjustOffsetFromHelper:function(a){if(typeof a=="string")a=a.split(" ");if(d.isArray(a))a={left:+a[0],top:+a[1]||
0};if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],
this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();a.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a={top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.element.position();return{top:a.top-
(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var a=this.options;if(a.containment==
"parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[(a.containment=="document"?0:d(window).scrollLeft())-this.offset.relative.left-this.offset.parent.left,(a.containment=="document"?0:d(window).scrollTop())-this.offset.relative.top-this.offset.parent.top,(a.containment=="document"?0:d(window).scrollLeft())+d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a.containment=="document"?
0:d(window).scrollTop())+(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)&&a.containment.constructor!=Array){var b=d(a.containment)[0];if(b){a=d(a.containment).offset();var c=d(b).css("overflow")!="hidden";this.containment=[a.left+(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0)-this.margins.left,a.top+(parseInt(d(b).css("borderTopWidth"),
10)||0)+(parseInt(d(b).css("paddingTop"),10)||0)-this.margins.top,a.left+(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,a.top+(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}}else if(a.containment.constructor==
Array)this.containment=a.containment},_convertPositionTo:function(a,b){if(!b)b=this.position;a=a=="absolute"?1:-1;var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName);return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():
f?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())*a)}},_generatePosition:function(a){var b=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName),e=a.pageX,g=a.pageY;
if(this.originalPosition){if(this.containment){if(a.pageX-this.offset.click.left<this.containment[0])e=this.containment[0]+this.offset.click.left;if(a.pageY-this.offset.click.top<this.containment[1])g=this.containment[1]+this.offset.click.top;if(a.pageX-this.offset.click.left>this.containment[2])e=this.containment[2]+this.offset.click.left;if(a.pageY-this.offset.click.top>this.containment[3])g=this.containment[3]+this.offset.click.top}if(b.grid){g=this.originalPageY+Math.round((g-this.originalPageY)/
b.grid[1])*b.grid[1];g=this.containment?!(g-this.offset.click.top<this.containment[1]||g-this.offset.click.top>this.containment[3])?g:!(g-this.offset.click.top<this.containment[1])?g-b.grid[1]:g+b.grid[1]:g;e=this.originalPageX+Math.round((e-this.originalPageX)/b.grid[0])*b.grid[0];e=this.containment?!(e-this.offset.click.left<this.containment[0]||e-this.offset.click.left>this.containment[2])?e:!(e-this.offset.click.left<this.containment[0])?e-b.grid[0]:e+b.grid[0]:e}}return{top:g-this.offset.click.top-
this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:c.scrollTop()),left:e-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");this.helper[0]!=
this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove();this.helper=null;this.cancelHelperRemoval=false},_trigger:function(a,b,c){c=c||this._uiHash();d.ui.plugin.call(this,a,[b,c]);if(a=="drag")this.positionAbs=this._convertPositionTo("absolute");return d.Widget.prototype._trigger.call(this,a,b,c)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}});d.extend(d.ui.draggable,{version:"1.8.7"});
d.ui.plugin.add("draggable","connectToSortable",{start:function(a,b){var c=d(this).data("draggable"),f=c.options,e=d.extend({},b,{item:c.element});c.sortables=[];d(f.connectToSortable).each(function(){var g=d.data(this,"sortable");if(g&&!g.options.disabled){c.sortables.push({instance:g,shouldRevert:g.options.revert});g._refreshItems();g._trigger("activate",a,e)}})},stop:function(a,b){var c=d(this).data("draggable"),f=d.extend({},b,{item:c.element});d.each(c.sortables,function(){if(this.instance.isOver){this.instance.isOver=
0;c.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert)this.instance.options.revert=true;this.instance._mouseStop(a);this.instance.options.helper=this.instance.options._helper;c.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})}else{this.instance.cancelHelperRemoval=false;this.instance._trigger("deactivate",a,f)}})},drag:function(a,b){var c=d(this).data("draggable"),f=this;d.each(c.sortables,function(){this.instance.positionAbs=
c.positionAbs;this.instance.helperProportions=c.helperProportions;this.instance.offset.click=c.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=1;this.instance.currentItem=d(f).clone().appendTo(this.instance.element).data("sortable-item",true);this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return b.helper[0]};a.target=this.instance.currentItem[0];this.instance._mouseCapture(a,
true);this.instance._mouseStart(a,true,true);this.instance.offset.click.top=c.offset.click.top;this.instance.offset.click.left=c.offset.click.left;this.instance.offset.parent.left-=c.offset.parent.left-this.instance.offset.parent.left;this.instance.offset.parent.top-=c.offset.parent.top-this.instance.offset.parent.top;c._trigger("toSortable",a);c.dropped=this.instance.element;c.currentItem=c.element;this.instance.fromOutside=c}this.instance.currentItem&&this.instance._mouseDrag(a)}else if(this.instance.isOver){this.instance.isOver=
0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance._trigger("out",a,this.instance._uiHash(this.instance));this.instance._mouseStop(a,true);this.instance.options.helper=this.instance.options._helper;this.instance.currentItem.remove();this.instance.placeholder&&this.instance.placeholder.remove();c._trigger("fromSortable",a);c.dropped=false}})}});d.ui.plugin.add("draggable","cursor",{start:function(){var a=d("body"),b=d(this).data("draggable").options;if(a.css("cursor"))b._cursor=
a.css("cursor");a.css("cursor",b.cursor)},stop:function(){var a=d(this).data("draggable").options;a._cursor&&d("body").css("cursor",a._cursor)}});d.ui.plugin.add("draggable","iframeFix",{start:function(){var a=d(this).data("draggable").options;d(a.iframeFix===true?"iframe":a.iframeFix).each(function(){d('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1E3}).css(d(this).offset()).appendTo("body")})},
stop:function(){d("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)})}});d.ui.plugin.add("draggable","opacity",{start:function(a,b){a=d(b.helper);b=d(this).data("draggable").options;if(a.css("opacity"))b._opacity=a.css("opacity");a.css("opacity",b.opacity)},stop:function(a,b){a=d(this).data("draggable").options;a._opacity&&d(b.helper).css("opacity",a._opacity)}});d.ui.plugin.add("draggable","scroll",{start:function(){var a=d(this).data("draggable");if(a.scrollParent[0]!=
document&&a.scrollParent[0].tagName!="HTML")a.overflowOffset=a.scrollParent.offset()},drag:function(a){var b=d(this).data("draggable"),c=b.options,f=false;if(b.scrollParent[0]!=document&&b.scrollParent[0].tagName!="HTML"){if(!c.axis||c.axis!="x")if(b.overflowOffset.top+b.scrollParent[0].offsetHeight-a.pageY<c.scrollSensitivity)b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop+c.scrollSpeed;else if(a.pageY-b.overflowOffset.top<c.scrollSensitivity)b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop-
c.scrollSpeed;if(!c.axis||c.axis!="y")if(b.overflowOffset.left+b.scrollParent[0].offsetWidth-a.pageX<c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft+c.scrollSpeed;else if(a.pageX-b.overflowOffset.left<c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft-c.scrollSpeed}else{if(!c.axis||c.axis!="x")if(a.pageY-d(document).scrollTop()<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()-c.scrollSpeed);else if(d(window).height()-
(a.pageY-d(document).scrollTop())<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()+c.scrollSpeed);if(!c.axis||c.axis!="y")if(a.pageX-d(document).scrollLeft()<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()-c.scrollSpeed);else if(d(window).width()-(a.pageX-d(document).scrollLeft())<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()+c.scrollSpeed)}f!==false&&d.ui.ddmanager&&!c.dropBehaviour&&d.ui.ddmanager.prepareOffsets(b,a)}});d.ui.plugin.add("draggable",
"snap",{start:function(){var a=d(this).data("draggable"),b=a.options;a.snapElements=[];d(b.snap.constructor!=String?b.snap.items||":data(draggable)":b.snap).each(function(){var c=d(this),f=c.offset();this!=a.element[0]&&a.snapElements.push({item:this,width:c.outerWidth(),height:c.outerHeight(),top:f.top,left:f.left})})},drag:function(a,b){for(var c=d(this).data("draggable"),f=c.options,e=f.snapTolerance,g=b.offset.left,n=g+c.helperProportions.width,m=b.offset.top,o=m+c.helperProportions.height,h=
c.snapElements.length-1;h>=0;h--){var i=c.snapElements[h].left,k=i+c.snapElements[h].width,j=c.snapElements[h].top,l=j+c.snapElements[h].height;if(i-e<g&&g<k+e&&j-e<m&&m<l+e||i-e<g&&g<k+e&&j-e<o&&o<l+e||i-e<n&&n<k+e&&j-e<m&&m<l+e||i-e<n&&n<k+e&&j-e<o&&o<l+e){if(f.snapMode!="inner"){var p=Math.abs(j-o)<=e,q=Math.abs(l-m)<=e,r=Math.abs(i-n)<=e,s=Math.abs(k-g)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:j-c.helperProportions.height,left:0}).top-c.margins.top;if(q)b.position.top=c._convertPositionTo("relative",
{top:l,left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:i-c.helperProportions.width}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:k}).left-c.margins.left}var t=p||q||r||s;if(f.snapMode!="outer"){p=Math.abs(j-m)<=e;q=Math.abs(l-o)<=e;r=Math.abs(i-g)<=e;s=Math.abs(k-n)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:j,left:0}).top-c.margins.top;if(q)b.position.top=c._convertPositionTo("relative",{top:l-c.helperProportions.height,
left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:i}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:k-c.helperProportions.width}).left-c.margins.left}if(!c.snapElements[h].snapping&&(p||q||r||s||t))c.options.snap.snap&&c.options.snap.snap.call(c.element,a,d.extend(c._uiHash(),{snapItem:c.snapElements[h].item}));c.snapElements[h].snapping=p||q||r||s||t}else{c.snapElements[h].snapping&&c.options.snap.release&&c.options.snap.release.call(c.element,
a,d.extend(c._uiHash(),{snapItem:c.snapElements[h].item}));c.snapElements[h].snapping=false}}}});d.ui.plugin.add("draggable","stack",{start:function(){var a=d(this).data("draggable").options;a=d.makeArray(d(a.stack)).sort(function(c,f){return(parseInt(d(c).css("zIndex"),10)||0)-(parseInt(d(f).css("zIndex"),10)||0)});if(a.length){var b=parseInt(a[0].style.zIndex)||0;d(a).each(function(c){this.style.zIndex=b+c});this[0].style.zIndex=b+a.length}}});d.ui.plugin.add("draggable","zIndex",{start:function(a,
b){a=d(b.helper);b=d(this).data("draggable").options;if(a.css("zIndex"))b._zIndex=a.css("zIndex");a.css("zIndex",b.zIndex)},stop:function(a,b){a=d(this).data("draggable").options;a._zIndex&&d(b.helper).css("zIndex",a._zIndex)}})})(jQuery);
;/*
 * jQuery UI Sortable 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.sortable",d.ui.mouse,{widgetEventPrefix:"sort",options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1E3},_create:function(){this.containerCache={};this.element.addClass("ui-sortable");
this.refresh();this.floating=this.items.length?/left|right/.test(this.items[0].item.css("float")):false;this.offset=this.element.offset();this._mouseInit()},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");this._mouseDestroy();for(var a=this.items.length-1;a>=0;a--)this.items[a].item.removeData("sortable-item");return this},_setOption:function(a,b){if(a==="disabled"){this.options[a]=b;this.widget()[b?"addClass":"removeClass"]("ui-sortable-disabled")}else d.Widget.prototype._setOption.apply(this,
arguments)},_mouseCapture:function(a,b){if(this.reverting)return false;if(this.options.disabled||this.options.type=="static")return false;this._refreshItems(a);var c=null,e=this;d(a.target).parents().each(function(){if(d.data(this,"sortable-item")==e){c=d(this);return false}});if(d.data(a.target,"sortable-item")==e)c=d(a.target);if(!c)return false;if(this.options.handle&&!b){var f=false;d(this.options.handle,c).find("*").andSelf().each(function(){if(this==a.target)f=true});if(!f)return false}this.currentItem=
c;this._removeCurrentsFromItems();return true},_mouseStart:function(a,b,c){b=this.options;var e=this;this.currentContainer=this;this.refreshPositions();this.helper=this._createHelper(a);this._cacheHelperProportions();this._cacheMargins();this.scrollParent=this.helper.scrollParent();this.offset=this.currentItem.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};this.helper.css("position","absolute");this.cssPosition=this.helper.css("position");d.extend(this.offset,
{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this._generatePosition(a);this.originalPageX=a.pageX;this.originalPageY=a.pageY;b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};this.helper[0]!=this.currentItem[0]&&this.currentItem.hide();this._createPlaceholder();b.containment&&this._setContainment();
if(b.cursor){if(d("body").css("cursor"))this._storedCursor=d("body").css("cursor");d("body").css("cursor",b.cursor)}if(b.opacity){if(this.helper.css("opacity"))this._storedOpacity=this.helper.css("opacity");this.helper.css("opacity",b.opacity)}if(b.zIndex){if(this.helper.css("zIndex"))this._storedZIndex=this.helper.css("zIndex");this.helper.css("zIndex",b.zIndex)}if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML")this.overflowOffset=this.scrollParent.offset();this._trigger("start",
a,this._uiHash());this._preserveHelperProportions||this._cacheHelperProportions();if(!c)for(c=this.containers.length-1;c>=0;c--)this.containers[c]._trigger("activate",a,e._uiHash(this));if(d.ui.ddmanager)d.ui.ddmanager.current=this;d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.dragging=true;this.helper.addClass("ui-sortable-helper");this._mouseDrag(a);return true},_mouseDrag:function(a){this.position=this._generatePosition(a);this.positionAbs=this._convertPositionTo("absolute");
if(!this.lastPositionAbs)this.lastPositionAbs=this.positionAbs;if(this.options.scroll){var b=this.options,c=false;if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if(this.overflowOffset.top+this.scrollParent[0].offsetHeight-a.pageY<b.scrollSensitivity)this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop+b.scrollSpeed;else if(a.pageY-this.overflowOffset.top<b.scrollSensitivity)this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop-b.scrollSpeed;if(this.overflowOffset.left+
this.scrollParent[0].offsetWidth-a.pageX<b.scrollSensitivity)this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft+b.scrollSpeed;else if(a.pageX-this.overflowOffset.left<b.scrollSensitivity)this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft-b.scrollSpeed}else{if(a.pageY-d(document).scrollTop()<b.scrollSensitivity)c=d(document).scrollTop(d(document).scrollTop()-b.scrollSpeed);else if(d(window).height()-(a.pageY-d(document).scrollTop())<b.scrollSensitivity)c=d(document).scrollTop(d(document).scrollTop()+
b.scrollSpeed);if(a.pageX-d(document).scrollLeft()<b.scrollSensitivity)c=d(document).scrollLeft(d(document).scrollLeft()-b.scrollSpeed);else if(d(window).width()-(a.pageX-d(document).scrollLeft())<b.scrollSensitivity)c=d(document).scrollLeft(d(document).scrollLeft()+b.scrollSpeed)}c!==false&&d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a)}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+
"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";for(b=this.items.length-1;b>=0;b--){c=this.items[b];var e=c.item[0],f=this._intersectsWithPointer(c);if(f)if(e!=this.currentItem[0]&&this.placeholder[f==1?"next":"prev"]()[0]!=e&&!d.ui.contains(this.placeholder[0],e)&&(this.options.type=="semi-dynamic"?!d.ui.contains(this.element[0],e):true)){this.direction=f==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(c))this._rearrange(a,
c);else break;this._trigger("change",a,this._uiHash());break}}this._contactContainers(a);d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);this._trigger("sort",a,this._uiHash());this.lastPositionAbs=this.positionAbs;return false},_mouseStop:function(a,b){if(a){d.ui.ddmanager&&!this.options.dropBehaviour&&d.ui.ddmanager.drop(this,a);if(this.options.revert){var c=this;b=c.placeholder.offset();c.reverting=true;d(this.helper).animate({left:b.left-this.offset.parent.left-c.margins.left+(this.offsetParent[0]==
document.body?0:this.offsetParent[0].scrollLeft),top:b.top-this.offset.parent.top-c.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){c._clear(a)})}else this._clear(a,b);return false}},cancel:function(){var a=this;if(this.dragging){this._mouseUp();this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var b=this.containers.length-1;b>=0;b--){this.containers[b]._trigger("deactivate",
null,a._uiHash(this));if(this.containers[b].containerCache.over){this.containers[b]._trigger("out",null,a._uiHash(this));this.containers[b].containerCache.over=0}}}this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]);this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove();d.extend(this,{helper:null,dragging:false,reverting:false,_noFinalSort:null});this.domPosition.prev?d(this.domPosition.prev).after(this.currentItem):
d(this.domPosition.parent).prepend(this.currentItem);return this},serialize:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];a=a||{};d(b).each(function(){var e=(d(a.item||this).attr(a.attribute||"id")||"").match(a.expression||/(.+)[-=_](.+)/);if(e)c.push((a.key||e[1]+"[]")+"="+(a.key&&a.expression?e[1]:e[2]))});!c.length&&a.key&&c.push(a.key+"=");return c.join("&")},toArray:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];a=a||{};b.each(function(){c.push(d(a.item||this).attr(a.attribute||
"id")||"")});return c},_intersectsWith:function(a){var b=this.positionAbs.left,c=b+this.helperProportions.width,e=this.positionAbs.top,f=e+this.helperProportions.height,g=a.left,h=g+a.width,i=a.top,k=i+a.height,j=this.offset.click.top,l=this.offset.click.left;j=e+j>i&&e+j<k&&b+l>g&&b+l<h;return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>a[this.floating?"width":"height"]?j:g<b+
this.helperProportions.width/2&&c-this.helperProportions.width/2<h&&i<e+this.helperProportions.height/2&&f-this.helperProportions.height/2<k},_intersectsWithPointer:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top,a.height);a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left,a.width);b=b&&a;a=this._getDragVerticalDirection();var c=this._getDragHorizontalDirection();if(!b)return false;return this.floating?c&&c=="right"||a=="down"?2:1:a&&(a=="down"?
2:1)},_intersectsWithSides:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top+a.height/2,a.height);a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left+a.width/2,a.width);var c=this._getDragVerticalDirection(),e=this._getDragHorizontalDirection();return this.floating&&e?e=="right"&&a||e=="left"&&!a:c&&(c=="down"&&b||c=="up"&&!b)},_getDragVerticalDirection:function(){var a=this.positionAbs.top-this.lastPositionAbs.top;return a!=0&&(a>0?"down":"up")},
_getDragHorizontalDirection:function(){var a=this.positionAbs.left-this.lastPositionAbs.left;return a!=0&&(a>0?"right":"left")},refresh:function(a){this._refreshItems(a);this.refreshPositions();return this},_connectWith:function(){var a=this.options;return a.connectWith.constructor==String?[a.connectWith]:a.connectWith},_getItemsAsjQuery:function(a){var b=[],c=[],e=this._connectWith();if(e&&a)for(a=e.length-1;a>=0;a--)for(var f=d(e[a]),g=f.length-1;g>=0;g--){var h=d.data(f[g],"sortable");if(h&&h!=
this&&!h.options.disabled)c.push([d.isFunction(h.options.items)?h.options.items.call(h.element):d(h.options.items,h.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),h])}c.push([d.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):d(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);for(a=c.length-1;a>=0;a--)c[a][0].each(function(){b.push(this)});return d(b)},_removeCurrentsFromItems:function(){for(var a=
this.currentItem.find(":data(sortable-item)"),b=0;b<this.items.length;b++)for(var c=0;c<a.length;c++)a[c]==this.items[b].item[0]&&this.items.splice(b,1)},_refreshItems:function(a){this.items=[];this.containers=[this];var b=this.items,c=[[d.isFunction(this.options.items)?this.options.items.call(this.element[0],a,{item:this.currentItem}):d(this.options.items,this.element),this]],e=this._connectWith();if(e)for(var f=e.length-1;f>=0;f--)for(var g=d(e[f]),h=g.length-1;h>=0;h--){var i=d.data(g[h],"sortable");
if(i&&i!=this&&!i.options.disabled){c.push([d.isFunction(i.options.items)?i.options.items.call(i.element[0],a,{item:this.currentItem}):d(i.options.items,i.element),i]);this.containers.push(i)}}for(f=c.length-1;f>=0;f--){a=c[f][1];e=c[f][0];h=0;for(g=e.length;h<g;h++){i=d(e[h]);i.data("sortable-item",a);b.push({item:i,instance:a,width:0,height:0,left:0,top:0})}}},refreshPositions:function(a){if(this.offsetParent&&this.helper)this.offset.parent=this._getParentOffset();for(var b=this.items.length-1;b>=
0;b--){var c=this.items[b],e=this.options.toleranceElement?d(this.options.toleranceElement,c.item):c.item;if(!a){c.width=e.outerWidth();c.height=e.outerHeight()}e=e.offset();c.left=e.left;c.top=e.top}if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(b=this.containers.length-1;b>=0;b--){e=this.containers[b].element.offset();this.containers[b].containerCache.left=e.left;this.containers[b].containerCache.top=e.top;this.containers[b].containerCache.width=
this.containers[b].element.outerWidth();this.containers[b].containerCache.height=this.containers[b].element.outerHeight()}return this},_createPlaceholder:function(a){var b=a||this,c=b.options;if(!c.placeholder||c.placeholder.constructor==String){var e=c.placeholder;c.placeholder={element:function(){var f=d(document.createElement(b.currentItem[0].nodeName)).addClass(e||b.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];if(!e)f.style.visibility="hidden";return f},
update:function(f,g){if(!(e&&!c.forcePlaceholderSize)){g.height()||g.height(b.currentItem.innerHeight()-parseInt(b.currentItem.css("paddingTop")||0,10)-parseInt(b.currentItem.css("paddingBottom")||0,10));g.width()||g.width(b.currentItem.innerWidth()-parseInt(b.currentItem.css("paddingLeft")||0,10)-parseInt(b.currentItem.css("paddingRight")||0,10))}}}}b.placeholder=d(c.placeholder.element.call(b.element,b.currentItem));b.currentItem.after(b.placeholder);c.placeholder.update(b,b.placeholder)},_contactContainers:function(a){for(var b=
null,c=null,e=this.containers.length-1;e>=0;e--)if(!d.ui.contains(this.currentItem[0],this.containers[e].element[0]))if(this._intersectsWith(this.containers[e].containerCache)){if(!(b&&d.ui.contains(this.containers[e].element[0],b.element[0]))){b=this.containers[e];c=e}}else if(this.containers[e].containerCache.over){this.containers[e]._trigger("out",a,this._uiHash(this));this.containers[e].containerCache.over=0}if(b)if(this.containers.length===1){this.containers[c]._trigger("over",a,this._uiHash(this));
this.containers[c].containerCache.over=1}else if(this.currentContainer!=this.containers[c]){b=1E4;e=null;for(var f=this.positionAbs[this.containers[c].floating?"left":"top"],g=this.items.length-1;g>=0;g--)if(d.ui.contains(this.containers[c].element[0],this.items[g].item[0])){var h=this.items[g][this.containers[c].floating?"left":"top"];if(Math.abs(h-f)<b){b=Math.abs(h-f);e=this.items[g]}}if(e||this.options.dropOnEmpty){this.currentContainer=this.containers[c];e?this._rearrange(a,e,null,true):this._rearrange(a,
null,this.containers[c].element,true);this._trigger("change",a,this._uiHash());this.containers[c]._trigger("change",a,this._uiHash(this));this.options.placeholder.update(this.currentContainer,this.placeholder);this.containers[c]._trigger("over",a,this._uiHash(this));this.containers[c].containerCache.over=1}}},_createHelper:function(a){var b=this.options;a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a,this.currentItem])):b.helper=="clone"?this.currentItem.clone():this.currentItem;a.parents("body").length||
d(b.appendTo!="parent"?b.appendTo:this.currentItem[0].parentNode)[0].appendChild(a[0]);if(a[0]==this.currentItem[0])this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")};if(a[0].style.width==""||b.forceHelperSize)a.width(this.currentItem.width());if(a[0].style.height==""||b.forceHelperSize)a.height(this.currentItem.height());return a},_adjustOffsetFromHelper:function(a){if(typeof a==
"string")a=a.split(" ");if(d.isArray(a))a={left:+a[0],top:+a[1]||0};if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();if(this.cssPosition==
"absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();a.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a={top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition==
"relative"){var a=this.currentItem.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},
_setContainment:function(){var a=this.options;if(a.containment=="parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-
this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)){var b=d(a.containment)[0];a=d(a.containment).offset();var c=d(b).css("overflow")!="hidden";this.containment=[a.left+(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0)-this.margins.left,a.top+(parseInt(d(b).css("borderTopWidth"),10)||0)+(parseInt(d(b).css("paddingTop"),10)||0)-this.margins.top,a.left+(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),
10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,a.top+(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(a,b){if(!b)b=this.position;a=a=="absolute"?1:-1;var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?
this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())*a)}},_generatePosition:function(a){var b=
this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0]))this.offset.relative=this._getRelativeOffset();var f=a.pageX,g=a.pageY;if(this.originalPosition){if(this.containment){if(a.pageX-this.offset.click.left<this.containment[0])f=this.containment[0]+
this.offset.click.left;if(a.pageY-this.offset.click.top<this.containment[1])g=this.containment[1]+this.offset.click.top;if(a.pageX-this.offset.click.left>this.containment[2])f=this.containment[2]+this.offset.click.left;if(a.pageY-this.offset.click.top>this.containment[3])g=this.containment[3]+this.offset.click.top}if(b.grid){g=this.originalPageY+Math.round((g-this.originalPageY)/b.grid[1])*b.grid[1];g=this.containment?!(g-this.offset.click.top<this.containment[1]||g-this.offset.click.top>this.containment[3])?
g:!(g-this.offset.click.top<this.containment[1])?g-b.grid[1]:g+b.grid[1]:g;f=this.originalPageX+Math.round((f-this.originalPageX)/b.grid[0])*b.grid[0];f=this.containment?!(f-this.offset.click.left<this.containment[0]||f-this.offset.click.left>this.containment[2])?f:!(f-this.offset.click.left<this.containment[0])?f-b.grid[0]:f+b.grid[0]:f}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():
e?0:c.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())}},_rearrange:function(a,b,c,e){c?c[0].appendChild(this.placeholder[0]):b.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?b.item[0]:b.item[0].nextSibling);this.counter=this.counter?++this.counter:1;var f=this,g=this.counter;window.setTimeout(function(){g==
f.counter&&f.refreshPositions(!e)},0)},_clear:function(a,b){this.reverting=false;var c=[];!this._noFinalSort&&this.currentItem[0].parentNode&&this.placeholder.before(this.currentItem);this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var e in this._storedCSS)if(this._storedCSS[e]=="auto"||this._storedCSS[e]=="static")this._storedCSS[e]="";this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();this.fromOutside&&!b&&c.push(function(f){this._trigger("receive",
f,this._uiHash(this.fromOutside))});if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!b)c.push(function(f){this._trigger("update",f,this._uiHash())});if(!d.ui.contains(this.element[0],this.currentItem[0])){b||c.push(function(f){this._trigger("remove",f,this._uiHash())});for(e=this.containers.length-1;e>=0;e--)if(d.ui.contains(this.containers[e].element[0],this.currentItem[0])&&!b){c.push(function(f){return function(g){f._trigger("receive",
g,this._uiHash(this))}}.call(this,this.containers[e]));c.push(function(f){return function(g){f._trigger("update",g,this._uiHash(this))}}.call(this,this.containers[e]))}}for(e=this.containers.length-1;e>=0;e--){b||c.push(function(f){return function(g){f._trigger("deactivate",g,this._uiHash(this))}}.call(this,this.containers[e]));if(this.containers[e].containerCache.over){c.push(function(f){return function(g){f._trigger("out",g,this._uiHash(this))}}.call(this,this.containers[e]));this.containers[e].containerCache.over=
0}}this._storedCursor&&d("body").css("cursor",this._storedCursor);this._storedOpacity&&this.helper.css("opacity",this._storedOpacity);if(this._storedZIndex)this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex);this.dragging=false;if(this.cancelHelperRemoval){if(!b){this._trigger("beforeStop",a,this._uiHash());for(e=0;e<c.length;e++)c[e].call(this,a);this._trigger("stop",a,this._uiHash())}return false}b||this._trigger("beforeStop",a,this._uiHash());this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
this.helper[0]!=this.currentItem[0]&&this.helper.remove();this.helper=null;if(!b){for(e=0;e<c.length;e++)c[e].call(this,a);this._trigger("stop",a,this._uiHash())}this.fromOutside=false;return true},_trigger:function(){d.Widget.prototype._trigger.apply(this,arguments)===false&&this.cancel()},_uiHash:function(a){var b=a||this;return{helper:b.helper,placeholder:b.placeholder||d([]),position:b.position,originalPosition:b.originalPosition,offset:b.positionAbs,item:b.currentItem,sender:a?a.element:null}}});
d.extend(d.ui.sortable,{version:"1.8.7"})})(jQuery);
;
 * jQuery UI 1.7.3
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI
 */
 * jQuery UI Datepicker 1.7.3
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Datepicker
 *
 * Depends:
 *	ui.core.js
 */
   Time entry for jQuery v1.4.8.
   Written by Keith Wood (kbwood{at}iinet.com.au) June 2007.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */
(function($){function TimeEntry(){this._disabledInputs=[];this.regional=[];this.regional['']={show24Hours:false,separator:':',ampmPrefix:'',ampmNames:['AM','PM'],spinnerTexts:['Now','Previous field','Next field','Increment','Decrement']};this._defaults={appendText:'',showSeconds:false,timeSteps:[1,1,1],initialField:0,useMouseWheel:true,defaultTime:null,minTime:null,maxTime:null,spinnerImage:'spinnerDefault.png',spinnerSize:[20,20,8],spinnerBigImage:'',spinnerBigSize:[40,40,16],spinnerIncDecOnly:false,spinnerRepeat:[500,250],beforeShow:null,beforeSetTime:null};$.extend(this._defaults,this.regional[''])}var m='timeEntry';$.extend(TimeEntry.prototype,{markerClassName:'hasTimeEntry',setDefaults:function(a){extendRemove(this._defaults,a||{});return this},_connectTimeEntry:function(b,c){var d=$(b);if(d.hasClass(this.markerClassName)){return}var e={};e.options=$.extend({},c);e._selectedHour=0;e._selectedMinute=0;e._selectedSecond=0;e._field=0;e.input=$(b);$.data(b,m,e);var f=this._get(e,'spinnerImage');var g=this._get(e,'spinnerText');var h=this._get(e,'spinnerSize');var i=this._get(e,'appendText');var j=(!f?null:$('<span class="timeEntry_control" style="display: inline-block; '+'background: url(\''+f+'\') 0 0 no-repeat; '+'width: '+h[0]+'px; height: '+h[1]+'px;'+($.browser.mozilla&&$.browser.version<'1.9'?' padding-left: '+h[0]+'px; padding-bottom: '+(h[1]-18)+'px;':'')+'"></span>'));d.wrap('<span class="timeEntry_wrap"></span>').after(i?'<span class="timeEntry_append">'+i+'</span>':'').after(j||'');d.addClass(this.markerClassName).bind('focus.timeEntry',this._doFocus).bind('blur.timeEntry',this._doBlur).bind('click.timeEntry',this._doClick).bind('keydown.timeEntry',this._doKeyDown).bind('keypress.timeEntry',this._doKeyPress);if($.browser.mozilla){d.bind('input.timeEntry',function(a){$.timeEntry._parseTime(e)})}if($.browser.msie){d.bind('paste.timeEntry',function(a){setTimeout(function(){$.timeEntry._parseTime(e)},1)})}if(this._get(e,'useMouseWheel')&&$.fn.mousewheel){d.mousewheel(this._doMouseWheel)}if(j){j.mousedown(this._handleSpinner).mouseup(this._endSpinner).mouseover(this._expandSpinner).mouseout(this._endSpinner).mousemove(this._describeSpinner)}},_enableTimeEntry:function(a){this._enableDisable(a,false)},_disableTimeEntry:function(a){this._enableDisable(a,true)},_enableDisable:function(b,c){var d=$.data(b,m);if(!d){return}b.disabled=c;if(b.nextSibling&&b.nextSibling.nodeName.toLowerCase()=='span'){$.timeEntry._changeSpinner(d,b.nextSibling,(c?5:-1))}$.timeEntry._disabledInputs=$.map($.timeEntry._disabledInputs,function(a){return(a==b?null:a)});if(c){$.timeEntry._disabledInputs.push(b)}},_isDisabledTimeEntry:function(a){return $.inArray(a,this._disabledInputs)>-1},_changeTimeEntry:function(a,b,c){var d=$.data(a,m);if(d){if(typeof b=='string'){var e=b;b={};b[e]=c}var f=this._extractTime(d);extendRemove(d.options,b||{});if(f){this._setTime(d,new Date(0,0,0,f[0],f[1],f[2]))}}$.data(a,m,d)},_destroyTimeEntry:function(b){$input=$(b);if(!$input.hasClass(this.markerClassName)){return}$input.removeClass(this.markerClassName).unbind('.timeEntry');if($.fn.mousewheel){$input.unmousewheel()}this._disabledInputs=$.map(this._disabledInputs,function(a){return(a==b?null:a)});$input.parent().replaceWith($input);$.removeData(b,m)},_setTimeTimeEntry:function(a,b){var c=$.data(a,m);if(c){this._setTime(c,b?(typeof b=='object'?new Date(b.getTime()):b):null)}},_getTimeTimeEntry:function(a){var b=$.data(a,m);var c=(b?this._extractTime(b):null);return(!c?null:new Date(0,0,0,c[0],c[1],c[2]))},_getOffsetTimeEntry:function(a){var b=$.data(a,m);var c=(b?this._extractTime(b):null);return(!c?0:(c[0]*3600+c[1]*60+c[2])*1000)},_doFocus:function(a){var b=(a.nodeName&&a.nodeName.toLowerCase()=='input'?a:this);if($.timeEntry._lastInput==b||$.timeEntry._isDisabledTimeEntry(b)){$.timeEntry._focussed=false;return}var c=$.data(b,m);$.timeEntry._focussed=true;$.timeEntry._lastInput=b;$.timeEntry._blurredInput=null;var d=$.timeEntry._get(c,'beforeShow');extendRemove(c.options,(d?d.apply(b,[b]):{}));$.data(b,m,c);$.timeEntry._parseTime(c);setTimeout(function(){$.timeEntry._showField(c)},10)},_doBlur:function(a){$.timeEntry._blurredInput=$.timeEntry._lastInput;$.timeEntry._lastInput=null},_doClick:function(b){var c=b.target;var d=$.data(c,m);if(!$.timeEntry._focussed){var e=$.timeEntry._get(d,'separator').length+2;d._field=0;if(c.selectionStart!=null){for(var f=0;f<=Math.max(1,d._secondField,d._ampmField);f++){var g=(f!=d._ampmField?(f*e)+2:(d._ampmField*e)+$.timeEntry._get(d,'ampmPrefix').length+$.timeEntry._get(d,'ampmNames')[0].length);d._field=f;if(c.selectionStart<g){break}}}else if(c.createTextRange){var h=$(b.srcElement);var i=c.createTextRange();var j=function(a){return{thin:2,medium:4,thick:6}[a]||a};var k=b.clientX+document.documentElement.scrollLeft-(h.offset().left+parseInt(j(h.css('border-left-width')),10))-i.offsetLeft;for(var f=0;f<=Math.max(1,d._secondField,d._ampmField);f++){var g=(f!=d._ampmField?(f*e)+2:(d._ampmField*e)+$.timeEntry._get(d,'ampmPrefix').length+$.timeEntry._get(d,'ampmNames')[0].length);i.collapse();i.moveEnd('character',g);d._field=f;if(k<i.boundingWidth){break}}}}$.data(c,m,d);$.timeEntry._showField(d);$.timeEntry._focussed=false},_doKeyDown:function(a){if(a.keyCode>=48){return true}var b=$.data(a.target,m);switch(a.keyCode){case 9:return(a.shiftKey?$.timeEntry._changeField(b,-1,true):$.timeEntry._changeField(b,+1,true));case 35:if(a.ctrlKey){$.timeEntry._setValue(b,'')}else{b._field=Math.max(1,b._secondField,b._ampmField);$.timeEntry._adjustField(b,0)}break;case 36:if(a.ctrlKey){$.timeEntry._setTime(b)}else{b._field=0;$.timeEntry._adjustField(b,0)}break;case 37:$.timeEntry._changeField(b,-1,false);break;case 38:$.timeEntry._adjustField(b,+1);break;case 39:$.timeEntry._changeField(b,+1,false);break;case 40:$.timeEntry._adjustField(b,-1);break;case 46:$.timeEntry._setValue(b,'');break}return false},_doKeyPress:function(a){var b=String.fromCharCode(a.charCode==undefined?a.keyCode:a.charCode);if(b<' '){return true}var c=$.data(a.target,m);$.timeEntry._handleKeyPress(c,b);return false},_doMouseWheel:function(a,b){if($.timeEntry._isDisabledTimeEntry(a.target)){return}b=($.browser.opera?-b/Math.abs(b):($.browser.safari?b/Math.abs(b):b));var c=$.data(a.target,m);c.input.focus();if(!c.input.val()){$.timeEntry._parseTime(c)}$.timeEntry._adjustField(c,b);a.preventDefault()},_expandSpinner:function(b){var c=$.timeEntry._getSpinnerTarget(b);var d=$.data($.timeEntry._getInput(c),m);var e=$.timeEntry._get(d,'spinnerBigImage');if(e){d._expanded=true;var f=$(c).offset();var g=null;$(c).parents().each(function(){var a=$(this);if(a.css('position')=='relative'||a.css('position')=='absolute'){g=a.offset()}return!g});var h=$.timeEntry._get(d,'spinnerSize');var i=$.timeEntry._get(d,'spinnerBigSize');$('<div class="timeEntry_expand" style="position: absolute; left: '+(f.left-(i[0]-h[0])/2-(g?g.left:0))+'px; top: '+(f.top-(i[1]-h[1])/2-(g?g.top:0))+'px; width: '+i[0]+'px; height: '+i[1]+'px; background: transparent url('+e+') no-repeat 0px 0px; z-index: 10;"></div>').mousedown($.timeEntry._handleSpinner).mouseup($.timeEntry._endSpinner).mouseout($.timeEntry._endExpand).mousemove($.timeEntry._describeSpinner).insertAfter(c)}},_getInput:function(a){return $(a).siblings('.'+$.timeEntry.markerClassName)[0]},_describeSpinner:function(a){var b=$.timeEntry._getSpinnerTarget(a);var c=$.data($.timeEntry._getInput(b),m);b.title=$.timeEntry._get(c,'spinnerTexts')[$.timeEntry._getSpinnerRegion(c,a)]},_handleSpinner:function(a){var b=$.timeEntry._getSpinnerTarget(a);var c=$.timeEntry._getInput(b);if($.timeEntry._isDisabledTimeEntry(c)){return}if(c==$.timeEntry._blurredInput){$.timeEntry._lastInput=c;$.timeEntry._blurredInput=null}var d=$.data(c,m);$.timeEntry._doFocus(c);var e=$.timeEntry._getSpinnerRegion(d,a);$.timeEntry._changeSpinner(d,b,e);$.timeEntry._actionSpinner(d,e);$.timeEntry._timer=null;$.timeEntry._handlingSpinner=true;var f=$.timeEntry._get(d,'spinnerRepeat');if(e>=3&&f[0]){$.timeEntry._timer=setTimeout(function(){$.timeEntry._repeatSpinner(d,e)},f[0]);$(b).one('mouseout',$.timeEntry._releaseSpinner).one('mouseup',$.timeEntry._releaseSpinner)}},_actionSpinner:function(a,b){if(!a.input.val()){$.timeEntry._parseTime(a)}switch(b){case 0:this._setTime(a);break;case 1:this._changeField(a,-1,false);break;case 2:this._changeField(a,+1,false);break;case 3:this._adjustField(a,+1);break;case 4:this._adjustField(a,-1);break}},_repeatSpinner:function(a,b){if(!$.timeEntry._timer){return}$.timeEntry._lastInput=$.timeEntry._blurredInput;this._actionSpinner(a,b);this._timer=setTimeout(function(){$.timeEntry._repeatSpinner(a,b)},this._get(a,'spinnerRepeat')[1])},_releaseSpinner:function(a){clearTimeout($.timeEntry._timer);$.timeEntry._timer=null},_endExpand:function(a){$.timeEntry._timer=null;var b=$.timeEntry._getSpinnerTarget(a);var c=$.timeEntry._getInput(b);var d=$.data(c,m);$(b).remove();d._expanded=false},_endSpinner:function(a){$.timeEntry._timer=null;var b=$.timeEntry._getSpinnerTarget(a);var c=$.timeEntry._getInput(b);var d=$.data(c,m);if(!$.timeEntry._isDisabledTimeEntry(c)){$.timeEntry._changeSpinner(d,b,-1)}if($.timeEntry._handlingSpinner){$.timeEntry._lastInput=$.timeEntry._blurredInput}if($.timeEntry._lastInput&&$.timeEntry._handlingSpinner){$.timeEntry._showField(d)}$.timeEntry._handlingSpinner=false},_getSpinnerTarget:function(a){return a.target||a.srcElement},_getSpinnerRegion:function(a,b){var c=this._getSpinnerTarget(b);var d=($.browser.opera||$.browser.safari?$.timeEntry._findPos(c):$(c).offset());var e=($.browser.safari?$.timeEntry._findScroll(c):[document.documentElement.scrollLeft||document.body.scrollLeft,document.documentElement.scrollTop||document.body.scrollTop]);var f=this._get(a,'spinnerIncDecOnly');var g=(f?99:b.clientX+e[0]-d.left-($.browser.msie?2:0));var h=b.clientY+e[1]-d.top-($.browser.msie?2:0);var i=this._get(a,(a._expanded?'spinnerBigSize':'spinnerSize'));var j=(f?99:i[0]-1-g);var k=i[1]-1-h;if(i[2]>0&&Math.abs(g-j)<=i[2]&&Math.abs(h-k)<=i[2]){return 0}var l=Math.min(g,h,j,k);return(l==g?1:(l==j?2:(l==h?3:4)))},_changeSpinner:function(a,b,c){$(b).css('background-position','-'+((c+1)*this._get(a,(a._expanded?'spinnerBigSize':'spinnerSize'))[0])+'px 0px')},_findPos:function(a){var b=curTop=0;if(a.offsetParent){b=a.offsetLeft;curTop=a.offsetTop;while(a=a.offsetParent){var c=b;b+=a.offsetLeft;if(b<0){b=c}curTop+=a.offsetTop}}return{left:b,top:curTop}},_findScroll:function(a){var b=false;$(a).parents().each(function(){b|=$(this).css('position')=='fixed'});if(b){return[0,0]}var c=a.scrollLeft;var d=a.scrollTop;while(a=a.parentNode){c+=a.scrollLeft||0;d+=a.scrollTop||0}return[c,d]},_get:function(a,b){return(a.options[b]!=null?a.options[b]:$.timeEntry._defaults[b])},_parseTime:function(a){var b=this._extractTime(a);var c=this._get(a,'showSeconds');if(b){a._selectedHour=b[0];a._selectedMinute=b[1];a._selectedSecond=b[2]}else{var d=this._constrainTime(a);a._selectedHour=d[0];a._selectedMinute=d[1];a._selectedSecond=(c?d[2]:0)}a._secondField=(c?2:-1);a._ampmField=(this._get(a,'show24Hours')?-1:(c?3:2));a._lastChr='';a._field=Math.max(0,Math.min(Math.max(1,a._secondField,a._ampmField),this._get(a,'initialField')));if(a.input.val()!=''){this._showTime(a)}},_extractTime:function(a,b){b=b||a.input.val();var c=this._get(a,'separator');var d=b.split(c);if(c==''&&b!=''){d[0]=b.substring(0,2);d[1]=b.substring(2,4);d[2]=b.substring(4,6)}var e=this._get(a,'ampmNames');var f=this._get(a,'show24Hours');if(d.length>=2){var g=!f&&(b.indexOf(e[0])>-1);var h=!f&&(b.indexOf(e[1])>-1);var i=parseInt(d[0],10);i=(isNaN(i)?0:i);i=((g||h)&&i==12?0:i)+(h?12:0);var j=parseInt(d[1],10);j=(isNaN(j)?0:j);var k=(d.length>=3?parseInt(d[2],10):0);k=(isNaN(k)||!this._get(a,'showSeconds')?0:k);return this._constrainTime(a,[i,j,k])}return null},_constrainTime:function(a,b){var c=(b!=null);if(!c){var d=this._determineTime(a,this._get(a,'defaultTime'))||new Date();b=[d.getHours(),d.getMinutes(),d.getSeconds()]}var e=false;var f=this._get(a,'timeSteps');for(var i=0;i<f.length;i++){if(e){b[i]=0}else if(f[i]>1){b[i]=Math.round(b[i]/f[i])*f[i];e=true}}return b},_showTime:function(a){var b=this._get(a,'show24Hours');var c=this._get(a,'separator');var d=(this._formatNumber(b?a._selectedHour:((a._selectedHour+11)%12)+1)+c+this._formatNumber(a._selectedMinute)+(this._get(a,'showSeconds')?c+this._formatNumber(a._selectedSecond):'')+(b?'':this._get(a,'ampmPrefix')+this._get(a,'ampmNames')[(a._selectedHour<12?0:1)]));this._setValue(a,d);this._showField(a)},_showField:function(a){var b=a.input[0];if(a.input.is(':hidden')||$.timeEntry._lastInput!=b){return}var c=this._get(a,'separator');var d=c.length+2;var e=(a._field!=a._ampmField?(a._field*d):(a._ampmField*d)-c.length+this._get(a,'ampmPrefix').length);var f=e+(a._field!=a._ampmField?2:this._get(a,'ampmNames')[0].length);if(b.setSelectionRange){b.setSelectionRange(e,f)}else if(b.createTextRange){var g=b.createTextRange();g.moveStart('character',e);g.moveEnd('character',f-a.input.val().length);g.select()}if(!b.disabled){b.focus()}},_formatNumber:function(a){return(a<10?'0':'')+a},_setValue:function(a,b){if(b!=a.input.val()){a.input.val(b).trigger('change')}},_changeField:function(a,b,c){var d=(a.input.val()==''||a._field==(b==-1?0:Math.max(1,a._secondField,a._ampmField)));if(!d){a._field+=b}this._showField(a);a._lastChr='';$.data(a.input[0],m,a);return(d&&c)},_adjustField:function(a,b){if(a.input.val()==''){b=0}var c=this._get(a,'timeSteps');this._setTime(a,new Date(0,0,0,a._selectedHour+(a._field==0?b*c[0]:0)+(a._field==a._ampmField?b*12:0),a._selectedMinute+(a._field==1?b*c[1]:0),a._selectedSecond+(a._field==a._secondField?b*c[2]:0)))},_setTime:function(a,b){b=this._determineTime(a,b);var c=this._constrainTime(a,b?[b.getHours(),b.getMinutes(),b.getSeconds()]:null);b=new Date(0,0,0,c[0],c[1],c[2]);var b=this._normaliseTime(b);var d=this._normaliseTime(this._determineTime(a,this._get(a,'minTime')));var e=this._normaliseTime(this._determineTime(a,this._get(a,'maxTime')));b=(d&&b<d?d:(e&&b>e?e:b));var f=this._get(a,'beforeSetTime');if(f){b=f.apply(a.input[0],[this._getTimeTimeEntry(a.input[0]),b,d,e])}a._selectedHour=b.getHours();a._selectedMinute=b.getMinutes();a._selectedSecond=b.getSeconds();this._showTime(a);$.data(a.input[0],m,a)},_normaliseTime:function(a){if(!a){return null}a.setFullYear(1900);a.setMonth(0);a.setDate(0);return a},_determineTime:function(i,j){var k=function(a){var b=new Date();b.setTime(b.getTime()+a*1000);return b};var l=function(a){var b=$.timeEntry._extractTime(i,a);var c=new Date();var d=(b?b[0]:c.getHours());var e=(b?b[1]:c.getMinutes());var f=(b?b[2]:c.getSeconds());if(!b){var g=/([+-]?[0-9]+)\s*(s|S|m|M|h|H)?/g;var h=g.exec(a);while(h){switch(h[2]||'s'){case's':case'S':f+=parseInt(h[1],10);break;case'm':case'M':e+=parseInt(h[1],10);break;case'h':case'H':d+=parseInt(h[1],10);break}h=g.exec(a)}}c=new Date(0,0,10,d,e,f,0);if(/^!/.test(a)){if(c.getDate()>10){c=new Date(0,0,10,23,59,59)}else if(c.getDate()<10){c=new Date(0,0,10,0,0,0)}}return c};return(j?(typeof j=='string'?l(j):(typeof j=='number'?k(j):j)):null)},_handleKeyPress:function(a,b){if(b==this._get(a,'separator')){this._changeField(a,+1,false)}else if(b>='0'&&b<='9'){var c=parseInt(b,10);var d=parseInt(a._lastChr+b,10);var e=this._get(a,'show24Hours');var f=(a._field!=0?a._selectedHour:(e?(d<24?d:c):(d>=1&&d<=12?d:(c>0?c:a._selectedHour))%12+(a._selectedHour>=12?12:0)));var g=(a._field!=1?a._selectedMinute:(d<60?d:c));var h=(a._field!=a._secondField?a._selectedSecond:(d<60?d:c));var i=this._constrainTime(a,[f,g,h]);this._setTime(a,new Date(0,0,0,i[0],i[1],i[2]));a._lastChr=b}else if(!this._get(a,'show24Hours')){b=b.toLowerCase();var j=this._get(a,'ampmNames');if((b==j[0].substring(0,1).toLowerCase()&&a._selectedHour>=12)||(b==j[1].substring(0,1).toLowerCase()&&a._selectedHour<12)){var k=a._field;a._field=a._ampmField;this._adjustField(a,+1);a._field=k;this._showField(a)}}}});function extendRemove(a,b){$.extend(a,b);for(var c in b){if(b[c]==null){a[c]=null}}return a}var n=['getOffset','getTime','isDisabled'];$.fn.timeEntry=function(c){var d=Array.prototype.slice.call(arguments,1);if(typeof c=='string'&&$.inArray(c,n)>-1){return $.timeEntry['_'+c+'TimeEntry'].apply($.timeEntry,[this[0]].concat(d))}return this.each(function(){var a=this.nodeName.toLowerCase();if(a=='input'){if(typeof c=='string'){$.timeEntry['_'+c+'TimeEntry'].apply($.timeEntry,[this].concat(d))}else{var b=($.fn.metadata?$(this).metadata():{});$.timeEntry._connectTimeEntry(this,$.extend(b,c))}}})};$.timeEntry=new TimeEntry()})(jQuery);
	Masked Input plugin for jQuery
	Copyright (c) 2007-2011 Josh Bush (digitalbush.com)
	Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license) 
	Version: 1.3
*/
(function($) {
	var pasteEventName = ($.browser.msie ? 'paste' : 'input') + ".mask";
	var iPhone = (window.orientation != undefined);

	$.mask = {
		//Predefined character definitions
		definitions: {
			'9': "[0-9]",
			'a': "[A-Za-z]",
			'*': "[A-Za-z0-9]"
		},
		dataName:"rawMaskFn"
	};

	$.fn.extend({
		//Helper Function for Caret positioning
		caretCM: function(begin, end) {
			if (this.length == 0) return;
			if (typeof begin == 'number') {
				end = (typeof end == 'number') ? end : begin;
				return this.each(function() {
					if (this.setSelectionRange) {
						this.setSelectionRange(begin, end);
					} else if (this.createTextRange) {
						var range = this.createTextRange();
						range.collapse(true);
						range.moveEnd('character', end);
						range.moveStart('character', begin);
						range.select();
					}
				});
			} else {
				if (this[0].setSelectionRange) {
					begin = this[0].selectionStart;
					end = this[0].selectionEnd;
				} else if (document.selection && document.selection.createRange) {
					var range = document.selection.createRange();
					begin = 0 - range.duplicate().moveStart('character', -100000);
					end = begin + range.text.length;
				}
				return { begin: begin, end: end };
			}
		},
		unmask: function() { return this.trigger("unmask"); },
		mask: function(mask, settings) {
			if (!mask && this.length > 0) {
				var input = $(this[0]);
				return input.data($.mask.dataName)();
			}
			settings = $.extend({
				placeholder: "_",
				completed: null
			}, settings);

			var defs = $.mask.definitions;
			var tests = [];
			var partialPosition = mask.length;
			var firstNonMaskPos = null;
			var len = mask.length;

			$.each(mask.split(""), function(i, c) {
				if (c == '?') {
					len--;
					partialPosition = i;
				} else if (defs[c]) {
					tests.push(new RegExp(defs[c]));
					if(firstNonMaskPos==null)
						firstNonMaskPos =  tests.length - 1;
				} else {
					tests.push(null);
				}
			});

			return this.trigger("unmask").each(function() {
				var input = $(this);
				var buffer = $.map(mask.split(""), function(c, i) { if (c != '?') return defs[c] ? settings.placeholder : c });
				var focusText = input.val();

				function seekNext(pos) {
					while (++pos <= len && !tests[pos]);
					return pos;
				};
				function seekPrev(pos) {
					while (--pos >= 0 && !tests[pos]);
					return pos;
				};

				function shiftL(begin,end) {
					if(begin<0)
					   return;
					for (var i = begin,j = seekNext(end); i < len; i++) {
						if (tests[i]) {
							if (j < len && tests[i].test(buffer[j])) {
								buffer[i] = buffer[j];
								buffer[j] = settings.placeholder;
							} else
								break;
							j = seekNext(j);
						}
					}
					writeBuffer();
					input.caretCM(Math.max(firstNonMaskPos, begin));
				};

				function shiftR(pos) {
					for (var i = pos, c = settings.placeholder; i < len; i++) {
						if (tests[i]) {
							var j = seekNext(i);
							var t = buffer[i];
							buffer[i] = c;
							if (j < len && tests[j].test(t))
								c = t;
							else
								break;
						}
					}
				};

				function keydownEvent(e) {
					var k=e.which;

					//backspace, delete, and escape get special treatment
					if(k == 8 || k == 46 || (iPhone && k == 127)){
						var pos = input.caretCM(),
							begin = pos.begin,
							end = pos.end;
						
						if(end-begin==0){
							begin=k!=46?seekPrev(begin):(end=seekNext(begin-1));
							end=k==46?seekNext(end):end;
						}
						clearBuffer(begin, end);
						shiftL(begin,end-1);

						return false;
					} else if (k == 27) {//escape
						input.val(focusText);
						input.caretCM(0, checkVal());
						return false;
					}
				};

				function keypressEvent(e) {
					var k = e.which,
						pos = input.caretCM();
					if (e.ctrlKey || e.altKey || e.metaKey || k<32) {//Ignore
						return true;
					} else if (k) {
						if(pos.end-pos.begin!=0){
							clearBuffer(pos.begin, pos.end);
							shiftL(pos.begin, pos.end-1);
						}

						var p = seekNext(pos.begin - 1);
						if (p < len) {
							var c = String.fromCharCode(k);
							if (tests[p].test(c)) {
								shiftR(p);
								buffer[p] = c;
								writeBuffer();
								var next = seekNext(p);
								input.caretCM(next);
								if (settings.completed && next >= len)
									settings.completed.call(input);
							}
						}
						return false;
					}
				};

				function clearBuffer(start, end) {
					for (var i = start; i < end && i < len; i++) {
						if (tests[i])
							buffer[i] = settings.placeholder;
					}
				};

				function writeBuffer() { return input.val(buffer.join('')).val(); };

				function checkVal(allow) {
					//try to place characters where they belong
					var test = input.val();
					var lastMatch = -1;
					for (var i = 0, pos = 0; i < len; i++) {
						if (tests[i]) {
							buffer[i] = settings.placeholder;
							while (pos++ < test.length) {
								var c = test.charAt(pos - 1);
								if (tests[i].test(c)) {
									buffer[i] = c;
									lastMatch = i;
									break;
								}
							}
							if (pos > test.length)
								break;
						} else if (buffer[i] == test.charAt(pos) && i!=partialPosition) {
							pos++;
							lastMatch = i;
						}
					}
					if (!allow && lastMatch + 1 < partialPosition) {
						input.val("");
						clearBuffer(0, len);
					} else if (allow || lastMatch + 1 >= partialPosition) {
						writeBuffer();
						if (!allow) input.val(input.val().substring(0, lastMatch + 1));
					}
					return (partialPosition ? i : firstNonMaskPos);
				};

				input.data($.mask.dataName,function(){
					return $.map(buffer, function(c, i) {
						return tests[i]&&c!=settings.placeholder ? c : null;
					}).join('');
				})

				if (!input.attr("readonly"))
					input
					.one("unmask", function() {
						input
							.unbind(".mask")
							.removeData($.mask.dataName);
					})
					.bind("focus.mask", function() {
						focusText = input.val();
						var pos = checkVal();
						writeBuffer();
						var moveCaret=function(){
							input.caretCM(0,input.val().length);
						};
						($.browser.msie ? moveCaret:function(){setTimeout(moveCaret,0)})();
					})
					.bind("blur.mask", function() {
						checkVal();
						if (input.val() != focusText){
							input.change();
						}
						clearBuffer(input.val().length,input.caretCM().end);
					})
					.bind("keydown.mask", keydownEvent)
					.bind("keypress.mask", keypressEvent)
					.bind(pasteEventName, function() {
						setTimeout(function() { input.caretCM(checkVal(true)); }, 0);
					});

				checkVal(); //Perform initial check for existing values
			});
		}
	});
})(jQuery);

/* Khaled Al Horani -- koko.dw@gmail.com */
/* خالد الحوراني -- koko.dw@gmail.com */
/* NOTE: monthNames are the original months names and they are the Arabic names, not the new months name �?براير - يناير and there isn't any Arabic roots for these months */
jQuery(function($){
	$.datepicker.regional['ar'] = {
		closeText: 'إغلاق',
		prevText: '&#x3c;السابق',
		nextText: 'التالي&#x3e;',
		currentText: 'اليوم',
		monthNames: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'آذار', 'حزيران',
		'تموز', 'آب', 'أيلول',	'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		dayNames: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
		dayNamesShort: ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'],
		dayNamesMin: ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'],
		weekHeader: 'أسبوع',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
  		isRTL: true,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['ar']);
});﻿
/* Bulgarian initialisation for the jQuery UI date picker plugin. */
/* Written by Stoyan Kyosev (http://svest.org). */
jQuery(function($){
    $.datepicker.regional['bg'] = {
        closeText: 'затвори',
        prevText: '&#x3c;назад',
        nextText: 'напред&#x3e;',
		nextBigText: '&#x3e;&#x3e;',
        currentText: 'дне�?',
        monthNames: ['Януари','Февруари','Март','�?прил','Май','Юни',
        'Юли','�?вгу�?т','Септември','Октомври','�?оември','Декември'],
        monthNamesShort: ['Яну','Фев','Мар','�?пр','Май','Юни',
        'Юли','�?вг','Сеп','Окт','�?ов','Дек'],
        dayNames: ['�?едел�?','Понеделник','Вторник','Ср�?да','Четвъртък','Петък','Събота'],
        dayNamesShort: ['�?ед','Пон','Вто','Ср�?','Чет','Пет','Съб'],
        dayNamesMin: ['�?е','По','Вт','Ср','Че','Пе','Съ'],
		weekHeader: 'Wk',
        dateFormat: 'dd.mm.yy',
		firstDay: 1,
        isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
    $.datepicker.setDefaults($.datepicker.regional['bg']);
});
/* InicialitzaciÃ³ en catalÃ  per a l'extenciÃ³ 'calendar' per jQuery. */
/* Writers: (joan.leon@gmail.com). */
jQuery(function($){
	$.datepicker.regional['ca'] = {
		closeText: 'Tancar',
		prevText: '&#x3c;Ant',
		nextText: 'Seg&#x3e;',
		currentText: 'Avui',
		monthNames: ['Gener','Febrer','Mar&ccedil;','Abril','Maig','Juny',
		'Juliol','Agost','Setembre','Octubre','Novembre','Desembre'],
		monthNamesShort: ['Gen','Feb','Mar','Abr','Mai','Jun',
		'Jul','Ago','Set','Oct','Nov','Des'],
		dayNames: ['Diumenge','Dilluns','Dimarts','Dimecres','Dijous','Divendres','Dissabte'],
		dayNamesShort: ['Dug','Dln','Dmt','Dmc','Djs','Dvn','Dsb'],
		dayNamesMin: ['Dg','Dl','Dt','Dc','Dj','Dv','Ds'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['ca']);
});
/* Czech initialisation for the jQuery UI date picker plugin. */
/* Written by Tomas Muller (tomas@tomas-muller.net). */
jQuery(function($){
	$.datepicker.regional['cs'] = {
		closeText: 'Zavřít',
		prevText: '&#x3c;Dříve',
		nextText: 'Později&#x3e;',
		currentText: 'Nyní',
		monthNames: ['leden','únor','březen','duben','květen','�?erven',
        '�?ervenec','srpen','září','říjen','listopad','prosinec'],
		monthNamesShort: ['led','úno','bře','dub','kvě','�?er',
		'�?vc','srp','zář','říj','lis','pro'],
		dayNames: ['neděle', 'pondělí', 'úterý', 'středa', '�?tvrtek', 'pátek', 'sobota'],
		dayNamesShort: ['ne', 'po', 'út', 'st', '�?t', 'pá', 'so'],
		dayNamesMin: ['ne','po','út','st','�?t','pá','so'],
		weekHeader: 'Týd',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['cs']);
});
/* Danish initialisation for the jQuery UI date picker plugin. */
/* Written by Jan Christensen ( deletestuff@gmail.com). */
jQuery(function($){
    $.datepicker.regional['da'] = {
		closeText: 'Luk',
        prevText: '&#x3c;Forrige',
		nextText: 'Næste&#x3e;',
		currentText: 'Idag',
        monthNames: ['Januar','Februar','Marts','April','Maj','Juni',
        'Juli','August','September','Oktober','November','December'],
        monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun',
        'Jul','Aug','Sep','Okt','Nov','Dec'],
		dayNames: ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
		dayNamesShort: ['Søn','Man','Tir','Ons','Tor','Fre','Lør'],
		dayNamesMin: ['Sø','Ma','Ti','On','To','Fr','Lø'],
		weekHeader: 'Uge',
        dateFormat: 'dd-mm-yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
    $.datepicker.setDefaults($.datepicker.regional['da']);
});
/* German initialisation for the jQuery UI date picker plugin. */
/* Written by Milian Wolff (mail@milianw.de). */
jQuery(function($){
	$.datepicker.regional['de'] = {
		closeText: 'schließen',
		prevText: '&#x3c;zurück',
		nextText: 'Vor&#x3e;',
		currentText: 'heute',
		monthNames: ['Januar','Februar','März','April','Mai','Juni',
		'Juli','August','September','Oktober','November','Dezember'],
		monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun',
		'Jul','Aug','Sep','Okt','Nov','Dez'],
		dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
		dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		weekHeader: 'Wo',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['de']);
});
/* Greek (el) initialisation for the jQuery UI date picker plugin. */
/* Written by Alex Cicovic (http://www.alexcicovic.com) */
jQuery(function($){
	$.datepicker.regional['el'] = {
		closeText: 'Κλείσιμο',
		prevText: 'Π�?οηγο�?μενος',
		nextText: 'Επόμενος',
		currentText: 'Τ�?έχων Μήνας',
		monthNames: ['Ιανουά�?ιος','Φεβ�?ουά�?ιος','Μά�?τιος','Απ�?ίλιος','Μάιος','Ιο�?νιος',
		'Ιο�?λιος','Α�?γουστος','Σεπτέμβ�?ιος','Οκτώβ�?ιος','�?οέμβ�?ιος','Δεκέμβ�?ιος'],
		monthNamesShort: ['Ιαν','Φεβ','Μα�?','Απ�?','Μαι','Ιουν',
		'Ιουλ','Αυγ','Σεπ','Οκτ','�?οε','Δεκ'],
		dayNames: ['Κυ�?ιακή','Δευτέ�?α','Τ�?ίτη','Τετά�?τη','Πέμπτη','Πα�?ασκευή','Σάββατο'],
		dayNamesShort: ['Κυ�?','Δευ','Τ�?ι','Τετ','Πεμ','Πα�?','Σαβ'],
		dayNamesMin: ['Κυ','Δε','Τ�?','Τε','Πε','Πα','Σα'],
		weekHeader: 'Εβδ',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['el']);
});﻿
/* English/UK initialisation for the jQuery UI date picker plugin. */
/* Written by Stuart. */
jQuery(function($){
	$.datepicker.regional['en-GB'] = {
		closeText: 'Done',
		prevText: 'Prev',
		nextText: 'Next',
		currentText: 'Today',
		monthNames: ['January','February','March','April','May','June',
		'July','August','September','October','November','December'],
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
		weekHeader: 'Wk',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['en-GB']);
});
/* English/AU initialisation for the jQuery UI date picker plugin. */
/* Written by Stuart. */
jQuery(function($){
	$.datepicker.regional['en-AU'] = {
		closeText: 'Done',
		prevText: 'Prev',
		nextText: 'Next',
		currentText: 'Today',
		monthNames: ['January','February','March','April','May','June',
		'July','August','September','October','November','December'],
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
		weekHeader: 'Wk',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['en-GB']);
});
/* Esperanto initialisation for the jQuery UI date picker plugin. */
/* Written by Olivier M. (olivierweb@ifrance.com). */
jQuery(function($){
	$.datepicker.regional['eo'] = {
		closeText: 'Fermi',
		prevText: '&lt;Anta',
		nextText: 'Sekv&gt;',
		currentText: 'Nuna',
		monthNames: ['Januaro','Februaro','Marto','Aprilo','Majo','Junio',
		'Julio','Aŭgusto','Septembro','Oktobro','Novembro','Decembro'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun',
		'Jul','Aŭg','Sep','Okt','Nov','Dec'],
		dayNames: ['Dimanĉo','Lundo','Mardo','Merkredo','Ĵaŭdo','Vendredo','Sabato'],
		dayNamesShort: ['Dim','Lun','Mar','Mer','Ĵaŭ','Ven','Sab'],
		dayNamesMin: ['Di','Lu','Ma','Me','Ĵa','Ve','Sa'],
		weekHeader: 'Sb',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['eo']);
});
/* InicializaciÃ³n en espaÃ±ol para la extensiÃ³n 'UI date picker' para jQuery. */
/* Traducido por Vester (xvester@gmail.com). */
jQuery(function($){
	$.datepicker.regional['es'] = {
		closeText: 'Cerrar',
		prevText: '&#x3c;Ant',
		nextText: 'Sig&#x3e;',
		currentText: 'Hoy',
		monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
		'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
		'Jul','Ago','Sep','Oct','Nov','Dic'],
		dayNames: ['Domingo','Lunes','Martes','Mi&eacute;rcoles','Jueves','Viernes','S&aacute;bado'],
		dayNamesShort: ['Dom','Lun','Mar','Mi&eacute;','Juv','Vie','S&aacute;b'],
		dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','S&aacute;'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['es']);
});
/* Persian (Farsi) Translation for the jQuery UI date picker plugin. */
/* Javad Mowlanezhad -- jmowla@gmail.com */
/* Jalali calendar should supported soon! (Its implemented but I have to test it) */
jQuery(function($) {
	$.datepicker.regional['fa'] = {
		closeText: 'بستن',
		prevText: '&#x3c;قبلي',
		nextText: 'بعدي&#x3e;',
		currentText: 'امروز',
		monthNames: ['�?روردين','ارديبهشت','خرداد','تير','مرداد','شهريور',
		'مهر','آبان','آذر','دي','بهمن','اس�?ند'],
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		dayNames: ['يکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'],
		dayNamesShort: ['ي','د','س','چ','پ','ج', 'ش'],
		dayNamesMin: ['ي','د','س','چ','پ','ج', 'ش'],
		weekHeader: 'ه�?',
		dateFormat: 'yy/mm/dd',
		firstDay: 6,
		isRTL: true,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['fa']);
});
/* Finnish initialisation for the jQuery UI date picker plugin. */
/* Written by Harri Kilpiï¿½ (harrikilpio@gmail.com). */
jQuery(function($){
    $.datepicker.regional['fi'] = {
		closeText: 'Sulje',
		prevText: '&laquo;Edellinen',
		nextText: 'Seuraava&raquo;',
		currentText: 'T&auml;n&auml;&auml;n',
        monthNames: ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kes&auml;kuu',
        'Hein&auml;kuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'],
        monthNamesShort: ['Tammi','Helmi','Maalis','Huhti','Touko','Kes&auml;',
        'Hein&auml;','Elo','Syys','Loka','Marras','Joulu'],
		dayNamesShort: ['Su','Ma','Ti','Ke','To','Pe','Su'],
		dayNames: ['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'],
		dayNamesMin: ['Su','Ma','Ti','Ke','To','Pe','La'],
		weekHeader: 'Vk',
        dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
    $.datepicker.setDefaults($.datepicker.regional['fi']);
});
/* French initialisation for the jQuery UI date picker plugin. */
/* Written by Keith Wood (kbwood{at}iinet.com.au) and Stéphane Nahmani (sholby@sholby.net). */
jQuery(function($){
	$.datepicker.regional['fr'] = {
		closeText: 'Fermer',
		prevText: '&#x3c;Préc',
		nextText: 'Suiv&#x3e;',
		currentText: 'Courant',
		monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin',
		'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
		monthNamesShort: ['Jan','Fév','Mar','Avr','Mai','Jun',
		'Jul','Aoû','Sep','Oct','Nov','Déc'],
		dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
		dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
		dayNamesMin: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['fr']);
});
/* Hebrew initialisation for the UI Datepicker extension. */
/* Written by Amir Hardon (ahardon at gmail dot com). */
jQuery(function($){
	$.datepicker.regional['he'] = {
		closeText: 'סגור',
		prevText: '&#x3c;הקוד�?',
		nextText: 'הב�?&#x3e;',
		currentText: 'היו�?',
		monthNames: ['ינו�?ר','פברו�?ר','מרץ','�?פריל','מ�?י','יוני',
		'יולי','�?וגוסט','ספטמבר','�?וקטובר','נובמבר','דצמבר'],
		monthNamesShort: ['1','2','3','4','5','6',
		'7','8','9','10','11','12'],
		dayNames: ['ר�?שון','שני','שלישי','רביעי','חמישי','שישי','שבת'],
		dayNamesShort: ['�?\'','ב\'','ג\'','ד\'','ה\'','ו\'','שבת'],
		dayNamesMin: ['�?\'','ב\'','ג\'','ד\'','ה\'','ו\'','שבת'],
		weekHeader: 'Wk',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
		isRTL: true,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['he']);
});
/* Croatian i18n for the jQuery UI date picker plugin. */
/* Written by Vjekoslav Nesek. */
jQuery(function($){
	$.datepicker.regional['hr'] = {
		closeText: 'Zatvori',
		prevText: '&#x3c;',
		nextText: '&#x3e;',
		currentText: 'Danas',
		monthNames: ['Sije�?anj','Velja�?a','Ožujak','Travanj','Svibanj','Lipanj',
		'Srpanj','Kolovoz','Rujan','Listopad','Studeni','Prosinac'],
		monthNamesShort: ['Sij','Velj','Ožu','Tra','Svi','Lip',
		'Srp','Kol','Ruj','Lis','Stu','Pro'],
		dayNames: ['Nedjelja','Ponedjeljak','Utorak','Srijeda','Četvrtak','Petak','Subota'],
		dayNamesShort: ['Ned','Pon','Uto','Sri','Čet','Pet','Sub'],
		dayNamesMin: ['Ne','Po','Ut','Sr','Če','Pe','Su'],
		weekHeader: 'Tje',
		dateFormat: 'dd.mm.yy.',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['hr']);
});
/* Hungarian initialisation for the jQuery UI date picker plugin. */
/* Written by Istvan Karaszi (jquery@spam.raszi.hu). */
jQuery(function($){
	$.datepicker.regional['hu'] = {
		closeText: 'bezÃ¡rÃ¡s',
		prevText: '&laquo;&nbsp;vissza',
		nextText: 'elÅ‘re&nbsp;&raquo;',
		currentText: 'ma',
		monthNames: ['JanuÃ¡r', 'FebruÃ¡r', 'MÃ¡rcius', 'Ã�?prilis', 'MÃ¡jus', 'JÃºnius',
		'JÃºlius', 'Augusztus', 'Szeptember', 'OktÃ³ber', 'November', 'December'],
		monthNamesShort: ['Jan', 'Feb', 'MÃ¡r', 'Ã�?pr', 'MÃ¡j', 'JÃºn',
		'JÃºl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec'],
		dayNames: ['VasÃ¡rnap', 'HÃ©tfÃ¶', 'Kedd', 'Szerda', 'CsÃ¼tÃ¶rtÃ¶k', 'PÃ©ntek', 'Szombat'],
		dayNamesShort: ['Vas', 'HÃ©t', 'Ked', 'Sze', 'CsÃ¼', 'PÃ©n', 'Szo'],
		dayNamesMin: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'],
		weekHeader: 'HÃ©',
		dateFormat: 'yy-mm-dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['hu']);
});
/* Armenian(UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Levon Zakaryan (levon.zakaryan@gmail.com)*/
jQuery(function($){
	$.datepicker.regional['hy'] = {
		closeText: 'Õ“Õ¡Õ¯Õ¥Õ¬',
		prevText: '&#x3c;Õ†Õ¡Õ­.',
		nextText: 'Õ€Õ¡Õ».&#x3e;',
		currentText: 'Ô±ÕµÕ½Ö…Ö€',
		monthNames: ['Õ€Õ¸Ö‚Õ¶Õ¾Õ¡Ö€','Õ“Õ¥Õ¿Ö€Õ¾Õ¡Ö€','Õ„Õ¡Ö€Õ¿','Ô±ÕºÖ€Õ«Õ¬','Õ„Õ¡ÕµÕ«Õ½','Õ€Õ¸Ö‚Õ¶Õ«Õ½',
		'Õ€Õ¸Ö‚Õ¬Õ«Õ½','Õ•Õ£Õ¸Õ½Õ¿Õ¸Õ½','Õ�?Õ¥ÕºÕ¿Õ¥Õ´Õ¢Õ¥Ö€','Õ€Õ¸Õ¯Õ¿Õ¥Õ´Õ¢Õ¥Ö€','Õ†Õ¸ÕµÕ¥Õ´Õ¢Õ¥Ö€','Ô´Õ¥Õ¯Õ¿Õ¥Õ´Õ¢Õ¥Ö€'],
		monthNamesShort: ['Õ€Õ¸Ö‚Õ¶Õ¾','Õ“Õ¥Õ¿Ö€','Õ„Õ¡Ö€Õ¿','Ô±ÕºÖ€','Õ„Õ¡ÕµÕ«Õ½','Õ€Õ¸Ö‚Õ¶Õ«Õ½',
		'Õ€Õ¸Ö‚Õ¬','Õ•Õ£Õ½','Õ�?Õ¥Õº','Õ€Õ¸Õ¯','Õ†Õ¸Õµ','Ô´Õ¥Õ¯'],
		dayNames: ['Õ¯Õ«Ö€Õ¡Õ¯Õ«','Õ¥Õ¯Õ¸Ö‚Õ·Õ¡Õ¢Õ©Õ«','Õ¥Ö€Õ¥Ö„Õ·Õ¡Õ¢Õ©Õ«','Õ¹Õ¸Ö€Õ¥Ö„Õ·Õ¡Õ¢Õ©Õ«','Õ°Õ«Õ¶Õ£Õ·Õ¡Õ¢Õ©Õ«','Õ¸Ö‚Ö€Õ¢Õ¡Õ©','Õ·Õ¡Õ¢Õ¡Õ©'],
		dayNamesShort: ['Õ¯Õ«Ö€','Õ¥Ö€Õ¯','Õ¥Ö€Ö„','Õ¹Ö€Ö„','Õ°Õ¶Õ£','Õ¸Ö‚Ö€Õ¢','Õ·Õ¢Õ©'],
		dayNamesMin: ['Õ¯Õ«Ö€','Õ¥Ö€Õ¯','Õ¥Ö€Ö„','Õ¹Ö€Ö„','Õ°Õ¶Õ£','Õ¸Ö‚Ö€Õ¢','Õ·Õ¢Õ©'],
		weekHeader: 'Õ‡Ô²Õ�?',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['hy']);
});
/* Indonesian initialisation for the jQuery UI date picker plugin. */
/* Written by Deden Fathurahman (dedenf@gmail.com). */
jQuery(function($){
	$.datepicker.regional['id'] = {
		closeText: 'Tutup',
		prevText: '&#x3c;mundur',
		nextText: 'maju&#x3e;',
		currentText: 'hari ini',
		monthNames: ['Januari','Februari','Maret','April','Mei','Juni',
		'Juli','Agustus','September','Oktober','Nopember','Desember'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','Mei','Jun',
		'Jul','Agus','Sep','Okt','Nop','Des'],
		dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
		dayNamesShort: ['Min','Sen','Sel','Rab','kam','Jum','Sab'],
		dayNamesMin: ['Mg','Sn','Sl','Rb','Km','jm','Sb'],
		weekHeader: 'Mg',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['id']);
});
/* Icelandic initialisation for the jQuery UI date picker plugin. */
/* Written by Haukur H. Thorsson (haukur@eskill.is). */
jQuery(function($){
	$.datepicker.regional['is'] = {
		closeText: 'Loka',
		prevText: '&#x3c; Fyrri',
		nextText: 'N&aelig;sti &#x3e;',
		currentText: '&Iacute; dag',
		monthNames: ['Jan&uacute;ar','Febr&uacute;ar','Mars','Apr&iacute;l','Ma&iacute','J&uacute;n&iacute;',
		'J&uacute;l&iacute;','&Aacute;g&uacute;st','September','Okt&oacute;ber','N&oacute;vember','Desember'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','Ma&iacute;','J&uacute;n',
		'J&uacute;l','&Aacute;g&uacute;','Sep','Okt','N&oacute;v','Des'],
		dayNames: ['Sunnudagur','M&aacute;nudagur','&THORN;ri&eth;judagur','Mi&eth;vikudagur','Fimmtudagur','F&ouml;studagur','Laugardagur'],
		dayNamesShort: ['Sun','M&aacute;n','&THORN;ri','Mi&eth;','Fim','F&ouml;s','Lau'],
		dayNamesMin: ['Su','M&aacute;','&THORN;r','Mi','Fi','F&ouml;','La'],
		weekHeader: 'Vika',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['is']);
});
/* Italian initialisation for the jQuery UI date picker plugin. */
/* Written by Antonello Pasella (antonello.pasella@gmail.com). */
jQuery(function($){
	$.datepicker.regional['it'] = {
		closeText: 'Chiudi',
		prevText: '&#x3c;Prec',
		nextText: 'Succ&#x3e;',
		currentText: 'Oggi',
		monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
			'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
		monthNamesShort: ['Gen','Feb','Mar','Apr','Mag','Giu',
			'Lug','Ago','Set','Ott','Nov','Dic'],
		dayNames: ['Domenica','Luned&#236','Marted&#236','Mercoled&#236','Gioved&#236','Venerd&#236','Sabato'],
		dayNamesShort: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
		dayNamesMin: ['Do','Lu','Ma','Me','Gi','Ve','Sa'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['it']);
});
/* Japanese initialisation for the jQuery UI date picker plugin. */
/* Written by Kentaro SATO (kentaro@ranvis.com). */
jQuery(function($){
	$.datepicker.regional['ja'] = {
		closeText: '閉�?�る',
		prevText: '&#x3c;�?',
		nextText: '次&#x3e;',
		currentText: '今日',
		monthNames: ['1月','2月','3月','4月','5月','6月',
		'7月','8月','9月','10月','11月','12月'],
		monthNamesShort: ['1月','2月','3月','4月','5月','6月',
		'7月','8月','9月','10月','11月','12月'],
		dayNames: ['日曜日','月曜日','�?�曜日','水曜日','木曜日','金曜日','土曜日'],
		dayNamesShort: ['日','月','�?�','水','木','金','土'],
		dayNamesMin: ['日','月','�?�','水','木','金','土'],
		weekHeader: '週',
		dateFormat: 'yy/mm/dd',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: '年'};
	$.datepicker.setDefaults($.datepicker.regional['ja']);
});
/* Korean initialisation for the jQuery calendar extension. */
/* Written by DaeKwon Kang (ncrash.dk@gmail.com). */
jQuery(function($){
	$.datepicker.regional['ko'] = {
		closeText: 'ë‹«ê¸°',
		prevText: 'ì�?´ì „ë‹¬',
		nextText: 'ë‹¤ì�?Œë‹¬',
		currentText: 'ì˜¤ëŠ˜',
		monthNames: ['1ì›�?(JAN)','2ì›�?(FEB)','3ì›�?(MAR)','4ì›�?(APR)','5ì›�?(MAY)','6ì›�?(JUN)',
		'7ì›�?(JUL)','8ì›�?(AUG)','9ì›�?(SEP)','10ì›�?(OCT)','11ì›�?(NOV)','12ì›�?(DEC)'],
		monthNamesShort: ['1ì›�?(JAN)','2ì›�?(FEB)','3ì›�?(MAR)','4ì›�?(APR)','5ì›�?(MAY)','6ì›�?(JUN)',
		'7ì›�?(JUL)','8ì›�?(AUG)','9ì›�?(SEP)','10ì›�?(OCT)','11ì›�?(NOV)','12ì›�?(DEC)'],
		dayNames: ['ì�?¼','ì›�?','í™�?','ìˆ˜','ëª©','ê¸ˆ','í† '],
		dayNamesShort: ['ì�?¼','ì›�?','í™�?','ìˆ˜','ëª©','ê¸ˆ','í† '],
		dayNamesMin: ['ì�?¼','ì›�?','í™�?','ìˆ˜','ëª©','ê¸ˆ','í† '],
		weekHeader: 'Wk',
		dateFormat: 'yy-mm-dd',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: 'ë…„'};
	$.datepicker.setDefaults($.datepicker.regional['ko']);
});
/* Lithuanian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* @author Arturas Paleicikas <arturas@avalon.lt> */
jQuery(function($){
	$.datepicker.regional['lt'] = {
		closeText: 'UÅ¾daryti',
		prevText: '&#x3c;Atgal',
		nextText: 'Pirmyn&#x3e;',
		currentText: 'Å iandien',
		monthNames: ['Sausis','Vasaris','Kovas','Balandis','GeguÅ¾Ä—','BirÅ¾elis',
		'Liepa','RugpjÅ«tis','RugsÄ—jis','Spalis','Lapkritis','Gruodis'],
		monthNamesShort: ['Sau','Vas','Kov','Bal','Geg','Bir',
		'Lie','Rugp','Rugs','Spa','Lap','Gru'],
		dayNames: ['sekmadienis','pirmadienis','antradienis','treÄ�?iadienis','ketvirtadienis','penktadienis','Å¡eÅ¡tadienis'],
		dayNamesShort: ['sek','pir','ant','tre','ket','pen','Å¡eÅ¡'],
		dayNamesMin: ['Se','Pr','An','Tr','Ke','Pe','Å e'],
		weekHeader: 'Wk',
		dateFormat: 'yy-mm-dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['lt']);
});
/* Latvian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* @author Arturas Paleicikas <arturas.paleicikas@metasite.net> */
jQuery(function($){
	$.datepicker.regional['lv'] = {
		closeText: 'AizvÄ“rt',
		prevText: 'Iepr',
		nextText: 'NÄ�?ka',
		currentText: 'Å odien',
		monthNames: ['JanvÄ�?ris','FebruÄ�?ris','Marts','AprÄ«lis','Maijs','JÅ«nijs',
		'JÅ«lijs','Augusts','Septembris','Oktobris','Novembris','Decembris'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','Mai','JÅ«n',
		'JÅ«l','Aug','Sep','Okt','Nov','Dec'],
		dayNames: ['svÄ“tdiena','pirmdiena','otrdiena','treÅ¡diena','ceturtdiena','piektdiena','sestdiena'],
		dayNamesShort: ['svt','prm','otr','tre','ctr','pkt','sst'],
		dayNamesMin: ['Sv','Pr','Ot','Tr','Ct','Pk','Ss'],
		weekHeader: 'Nav',
		dateFormat: 'dd-mm-yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['lv']);
});
/* Malaysian initialisation for the jQuery UI date picker plugin. */
/* Written by Mohd Nawawi Mohamad Jamili (nawawi@ronggeng.net). */
jQuery(function($){
	$.datepicker.regional['ms'] = {
		closeText: 'Tutup',
		prevText: '&#x3c;Sebelum',
		nextText: 'Selepas&#x3e;',
		currentText: 'hari ini',
		monthNames: ['Januari','Februari','Mac','April','Mei','Jun',
		'Julai','Ogos','September','Oktober','November','Disember'],
		monthNamesShort: ['Jan','Feb','Mac','Apr','Mei','Jun',
		'Jul','Ogo','Sep','Okt','Nov','Dis'],
		dayNames: ['Ahad','Isnin','Selasa','Rabu','Khamis','Jumaat','Sabtu'],
		dayNamesShort: ['Aha','Isn','Sel','Rab','kha','Jum','Sab'],
		dayNamesMin: ['Ah','Is','Se','Ra','Kh','Ju','Sa'],
		weekHeader: 'Mg',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['ms']);
});
/* Dutch (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Mathias Bynens <http://mathiasbynens.be/> */
jQuery(function($){
	$.datepicker.regional['nl'] = {
		closeText: 'Sluiten',
		prevText: '�?',
		nextText: '→',
		currentText: 'Vandaag',
		monthNames: ['januari', 'februari', 'maart', 'april', 'mei', 'juni',
		'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
		monthNamesShort: ['jan', 'feb', 'maa', 'apr', 'mei', 'jun',
		'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
		dayNames: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
		dayNamesShort: ['zon', 'maa', 'din', 'woe', 'don', 'vri', 'zat'],
		dayNamesMin: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
		weekHeader: 'Wk',
		dateFormat: 'dd-mm-yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['nl']);
});
/* Norwegian initialisation for the jQuery UI date picker plugin. */
/* Written by Naimdjon Takhirov (naimdjon@gmail.com). */
jQuery(function($){
    $.datepicker.regional['no'] = {
		closeText: 'Lukk',
        prevText: '&laquo;Forrige',
		nextText: 'Neste&raquo;',
		currentText: 'I dag',
        monthNames: ['Januar','Februar','Mars','April','Mai','Juni',
        'Juli','August','September','Oktober','November','Desember'],
        monthNamesShort: ['Jan','Feb','Mar','Apr','Mai','Jun',
        'Jul','Aug','Sep','Okt','Nov','Des'],
		dayNamesShort: ['SÃ¸n','Man','Tir','Ons','Tor','Fre','LÃ¸r'],
		dayNames: ['SÃ¸ndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','LÃ¸rdag'],
		dayNamesMin: ['SÃ¸','Ma','Ti','On','To','Fr','LÃ¸'],
		weekHeader: 'Uke',
        dateFormat: 'yy-mm-dd',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
    $.datepicker.setDefaults($.datepicker.regional['no']);
});
/* Polish initialisation for the jQuery UI date picker plugin. */
/* Written by Jacek Wysocki (jacek.wysocki@gmail.com). */
jQuery(function($){
	$.datepicker.regional['pl'] = {
		closeText: 'Zamknij',
		prevText: '&#x3c;Poprzedni',
		nextText: 'NastÄ™pny&#x3e;',
		currentText: 'DziÅ›',
		monthNames: ['StyczeÅ„','Luty','Marzec','KwiecieÅ„','Maj','Czerwiec',
		'Lipiec','SierpieÅ„','WrzesieÅ„','PaÅºdziernik','Listopad','GrudzieÅ„'],
		monthNamesShort: ['Sty','Lu','Mar','Kw','Maj','Cze',
		'Lip','Sie','Wrz','Pa','Lis','Gru'],
		dayNames: ['Niedziela','Poniedzialek','Wtorek','Åšroda','Czwartek','PiÄ…tek','Sobota'],
		dayNamesShort: ['Nie','Pn','Wt','Åšr','Czw','Pt','So'],
		dayNamesMin: ['N','Pn','Wt','Åšr','Cz','Pt','So'],
		weekHeader: 'Tydz',
		dateFormat: 'yy-mm-dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['pl']);
});
/* Brazilian initialisation for the jQuery UI date picker plugin. */
/* Written by Leonildo Costa Silva (leocsilva@gmail.com). */
jQuery(function($){
	$.datepicker.regional['pt-BR'] = {
		closeText: 'Fechar',
		prevText: '&#x3c;Anterior',
		nextText: 'Pr&oacute;ximo&#x3e;',
		currentText: 'Hoje',
		monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho',
		'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun',
		'Jul','Ago','Set','Out','Nov','Dez'],
		dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'],
		dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
		dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['pt-BR']);
});
/* Romanian initialisation for the jQuery UI date picker plugin.
 *
 * Written by Edmond L. (ll_edmond@walla.com)
 * and Ionut G. Stan (ionut.g.stan@gmail.com)
 */
jQuery(function($){
	$.datepicker.regional['ro'] = {
		closeText: 'Închide',
		prevText: '&laquo; Luna precedentă',
		nextText: 'Luna următoare &raquo;',
		currentText: 'Azi',
		monthNames: ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie',
		'Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'],
		monthNamesShort: ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun',
		'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'],
		dayNames: ['Duminică', 'Luni', 'Marţi', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'],
		dayNamesShort: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],
		dayNamesMin: ['Du','Lu','Ma','Mi','Jo','Vi','Sâ'],
		weekHeader: 'Săpt',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['ro']);
});
/* Russian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Andrew Stromnov (stromnov@gmail.com). */
jQuery(function($){
	$.datepicker.regional['ru'] = {
		closeText: 'Закрыть',
		prevText: '&#x3c;Пред',
		nextText: 'След&#x3e;',
		currentText: 'Сегодн�?',
		monthNames: ['Январь','Февраль','Март','�?прель','Май','Июнь',
		'Июль','�?вгу�?т','Сент�?брь','Окт�?брь','�?о�?брь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','�?пр','Май','Июн',
		'Июл','�?вг','Сен','Окт','�?о�?','Дек'],
		dayNames: ['во�?кре�?енье','понедельник','вторник','�?реда','четверг','п�?тница','�?уббота'],
		dayNamesShort: ['в�?к','пнд','втр','�?рд','чтв','птн','�?бт'],
		dayNamesMin: ['В�?','Пн','Вт','Ср','Чт','Пт','Сб'],
		dateFormat: 'dd.mm.yy', firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['ru']);
});
/* Slovak initialisation for the jQuery UI date picker plugin. */
/* Written by Vojtech Rinik (vojto@hmm.sk). */
jQuery(function($){
	$.datepicker.regional['sk'] = {
		closeText: 'ZavrieÅ¥',
		prevText: '&#x3c;PredchÃ¡dzajÃºci',
		nextText: 'NasledujÃºci&#x3e;',
		currentText: 'Dnes',
		monthNames: ['JanuÃ¡r','FebruÃ¡r','Marec','AprÃ­l','MÃ¡j','JÃºn',
		'JÃºl','August','September','OktÃ³ber','November','December'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','MÃ¡j','JÃºn',
		'JÃºl','Aug','Sep','Okt','Nov','Dec'],
		dayNames: ['Nedel\'a','Pondelok','Utorok','Streda','Å tvrtok','Piatok','Sobota'],
		dayNamesShort: ['Ned','Pon','Uto','Str','Å tv','Pia','Sob'],
		dayNamesMin: ['Ne','Po','Ut','St','Å t','Pia','So'],
		weekHeader: 'Ty',
		dateFormat: 'dd.mm.yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['sk']);
});
/* Slovenian initialisation for the jQuery UI date picker plugin. */
/* Written by Jaka Jancar (jaka@kubje.org). */
/* c = &#x10D;, s = &#x161; z = &#x17E; C = &#x10C; S = &#x160; Z = &#x17D; */
jQuery(function($){
	$.datepicker.regional['sl'] = {
		closeText: 'Zapri',
		prevText: '&lt;Prej&#x161;nji',
		nextText: 'Naslednji&gt;',
		currentText: 'Trenutni',
		monthNames: ['Januar','Februar','Marec','April','Maj','Junij',
		'Julij','Avgust','September','Oktober','November','December'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun',
		'Jul','Avg','Sep','Okt','Nov','Dec'],
		dayNames: ['Nedelja','Ponedeljek','Torek','Sreda','&#x10C;etrtek','Petek','Sobota'],
		dayNamesShort: ['Ned','Pon','Tor','Sre','&#x10C;et','Pet','Sob'],
		dayNamesMin: ['Ne','Po','To','Sr','&#x10C;e','Pe','So'],
		weekHeader: 'Teden',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['sl']);
});
/* Albanian initialisation for the jQuery UI date picker plugin. */
/* Written by Flakron Bytyqi (flakron@gmail.com). */
jQuery(function($){
	$.datepicker.regional['sq'] = {
		closeText: 'mbylle',
		prevText: '&#x3c;mbrapa',
		nextText: 'Përpara&#x3e;',
		currentText: 'sot',
		monthNames: ['Janar','Shkurt','Mars','Prill','Maj','Qershor',
		'Korrik','Gusht','Shtator','Tetor','Nëntor','Dhjetor'],
		monthNamesShort: ['Jan','Shk','Mar','Pri','Maj','Qer',
		'Kor','Gus','Sht','Tet','Nën','Dhj'],
		dayNames: ['E Diel','E Hënë','E Martë','E Mërkurë','E Enjte','E Premte','E Shtune'],
		dayNamesShort: ['Di','Hë','Ma','Më','En','Pr','Sh'],
		dayNamesMin: ['Di','Hë','Ma','Më','En','Pr','Sh'],
		weekHeader: 'Ja',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['sq']);
});
/* Serbian i18n for the jQuery UI date picker plugin. */
/* Written by Dejan Dimić. */
jQuery(function($){
	$.datepicker.regional['sr-SR'] = {
		closeText: 'Zatvori',
		prevText: '&#x3c;',
		nextText: '&#x3e;',
		currentText: 'Danas',
		monthNames: ['Januar','Februar','Mart','April','Maj','Jun',
		'Jul','Avgust','Septembar','Oktobar','Novembar','Decembar'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun',
		'Jul','Avg','Sep','Okt','Nov','Dec'],
		dayNames: ['Nedelja','Ponedeljak','Utorak','Sreda','Četvrtak','Petak','Subota'],
		dayNamesShort: ['Ned','Pon','Uto','Sre','Čet','Pet','Sub'],
		dayNamesMin: ['Ne','Po','Ut','Sr','Če','Pe','Su'],
		weekHeader: 'Sed',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['sr-SR']);
});
/* Serbian i18n for the jQuery UI date picker plugin. */
/* Written by Dejan Dimić. */
jQuery(function($){
	$.datepicker.regional['sr'] = {
		closeText: 'Затвори',
		prevText: '&#x3c;',
		nextText: '&#x3e;',
		currentText: 'Дана�?',
		monthNames: ['Јануар','Фебруар','Март','�?прил','Мај','Јун',
		'Јул','�?вгу�?т','Септембар','Октобар','�?овембар','Децембар'],
		monthNamesShort: ['Јан','Феб','Мар','�?пр','Мај','Јун',
		'Јул','�?вг','Сеп','Окт','�?ов','Дец'],
		dayNames: ['�?едеља','Понедељак','Уторак','Среда','Четвртак','Петак','Субота'],
		dayNamesShort: ['�?ед','Пон','Уто','Сре','Чет','Пет','Суб'],
		dayNamesMin: ['�?е','По','Ут','Ср','Че','Пе','Су'],
		weekHeader: 'Сед',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['sr']);
});
/* Swedish initialisation for the jQuery UI date picker plugin. */
/* Written by Anders Ekdahl ( anders@nomadiz.se). */
jQuery(function($){
    $.datepicker.regional['sv'] = {
		closeText: 'Stäng',
        prevText: '&laquo;Förra',
		nextText: 'Nästa&raquo;',
		currentText: 'Idag',
        monthNames: ['Januari','Februari','Mars','April','Maj','Juni',
        'Juli','Augusti','September','Oktober','November','December'],
        monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun',
        'Jul','Aug','Sep','Okt','Nov','Dec'],
		dayNamesShort: ['Sön','Mån','Tis','Ons','Tor','Fre','Lör'],
		dayNames: ['Söndag','Måndag','Tisdag','Onsdag','Torsdag','Fredag','Lördag'],
		dayNamesMin: ['Sö','Må','Ti','On','To','Fr','Lö'],
		weekHeader: 'Ve',
        dateFormat: 'yy-mm-dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
    $.datepicker.setDefaults($.datepicker.regional['sv']);
});
/* Thai initialisation for the jQuery UI date picker plugin. */
/* Written by pipo (pipo@sixhead.com). */
jQuery(function($){
	$.datepicker.regional['th'] = {
		closeText: 'ปิด',
		prevText: '&laquo;&nbsp;ย้อน',
		nextText: 'ถัดไป&nbsp;&raquo;',
		currentText: 'วันนี้',
		monthNames: ['ม�?ราคม','�?ุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
		'�?ร�?�?าคม','สิงหาคม','�?ันยายน','ตุลาคม','พฤศจิ�?ายน','ธันวาคม'],
		monthNamesShort: ['ม.ค.','�?.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
		'�?.ค.','ส.ค.','�?.ย.','ต.ค.','พ.ย.','ธ.ค.'],
		dayNames: ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุ�?ร์','เสาร์'],
		dayNamesShort: ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'],
		dayNamesMin: ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'],
		weekHeader: 'Wk',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['th']);
});
/* Turkish initialisation for the jQuery UI date picker plugin. */
/* Written by Izzet Emre Erkan (kara@karalamalar.net). */
jQuery(function($){
	$.datepicker.regional['tr'] = {
		closeText: 'kapat',
		prevText: '&#x3c;geri',
		nextText: 'ileri&#x3e',
		currentText: 'bugÃ¼n',
		monthNames: ['Ocak','Åžubat','Mart','Nisan','MayÄ±s','Haziran',
		'Temmuz','AÄŸustos','EylÃ¼l','Ekim','KasÄ±m','AralÄ±k'],
		monthNamesShort: ['Oca','Åžub','Mar','Nis','May','Haz',
		'Tem','AÄŸu','Eyl','Eki','Kas','Ara'],
		dayNames: ['Pazar','Pazartesi','SalÄ±','Ã‡arÅŸamba','PerÅŸembe','Cuma','Cumartesi'],
		dayNamesShort: ['Pz','Pt','Sa','Ã‡a','Pe','Cu','Ct'],
		dayNamesMin: ['Pz','Pt','Sa','Ã‡a','Pe','Cu','Ct'],
		weekHeader: 'Hf',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['tr']);
});
/* Ukrainian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Maxim Drogobitskiy (maxdao@gmail.com). */
jQuery(function($){
	$.datepicker.regional['uk'] = {
		closeText: '�?—�?°�?ºÑ€�?¸Ñ‚�?¸',
		prevText: '&#x3c;',
		nextText: '&#x3e;',
		currentText: '�?¡ÑŒ�?¾�?³�?¾�?´�?½Ñ–',
		monthNames: ['�?¡Ñ–Ñ‡�?µ�?½ÑŒ','�?›ÑŽÑ‚�?¸�?¹','�?‘�?µÑ€�?µ�?·�?µ�?½ÑŒ','�?š�?²Ñ–Ñ‚�?µ�?½ÑŒ','�?¢Ñ€�?°�?²�?µ�?½ÑŒ','�?§�?µÑ€�?²�?µ�?½ÑŒ',
		'�?›�?¸�?¿�?µ�?½ÑŒ','�?¡�?µÑ€�?¿�?µ�?½ÑŒ','�?’�?µÑ€�?µÑ�?�?µ�?½ÑŒ','�?–�?¾�?²Ñ‚�?µ�?½ÑŒ','�?›�?¸Ñ�?Ñ‚�?¾�?¿�?°�?´','�?“Ñ€Ñƒ�?´�?µ�?½ÑŒ'],
		monthNamesShort: ['�?¡Ñ–Ñ‡','�?›ÑŽÑ‚','�?‘�?µÑ€','�?š�?²Ñ–','�?¢Ñ€�?°','�?§�?µÑ€',
		'�?›�?¸�?¿','�?¡�?µÑ€','�?’�?µÑ€','�?–�?¾�?²','�?›�?¸Ñ�?','�?“Ñ€Ñƒ'],
		dayNames: ['�?½�?µ�?´Ñ–�?»Ñ�?','�?¿�?¾�?½�?µ�?´Ñ–�?»�?¾�?º','�?²Ñ–�?²Ñ‚�?¾Ñ€�?¾�?º','Ñ�?�?µÑ€�?µ�?´�?°','Ñ‡�?µÑ‚�?²�?µÑ€','�?¿â€™Ñ�?Ñ‚�?½�?¸Ñ†Ñ�?','Ñ�?Ñƒ�?±�?¾Ñ‚�?°'],
		dayNamesShort: ['�?½�?µ�?´','�?¿�?½�?´','�?²Ñ–�?²','Ñ�?Ñ€�?´','Ñ‡Ñ‚�?²','�?¿Ñ‚�?½','Ñ�?�?±Ñ‚'],
		dayNamesMin: ['�?�?�?´','�?Ÿ�?½','�?’Ñ‚','�?¡Ñ€','�?§Ñ‚','�?ŸÑ‚','�?¡�?±'],
		weekHeader: '�?�?�?µ',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['uk']);
});
/* Chinese initialisation for the jQuery UI date picker plugin. */
/* Written by Cloudream (cloudream@gmail.com). */
jQuery(function($){
	$.datepicker.regional['zh-CN'] = {
		closeText: 'å…³é—­',
		prevText: '&#x3c;ä¸Šæœˆ',
		nextText: 'ä¸‹æœˆ&#x3e;',
		currentText: 'ä»Šå¤©',
		monthNames: ['ä¸€æœˆ','äºŒæœˆ','ä¸‰æœˆ','å››æœˆ','äº�?æœˆ','å…­æœˆ',
		'ä¸ƒæœˆ','å…«æœˆ','ä¹�?æœˆ','å�?�?æœˆ','å�?�?ä¸€æœˆ','å�?�?äºŒæœˆ'],
		monthNamesShort: ['ä¸€','äºŒ','ä¸‰','å››','äº�?','å…­',
		'ä¸ƒ','å…«','ä¹�?','å�?�?','å�?�?ä¸€','å�?�?äºŒ'],
		dayNames: ['æ˜ŸæœŸæ—¥','æ˜ŸæœŸä¸€','æ˜ŸæœŸäºŒ','æ˜ŸæœŸä¸‰','æ˜ŸæœŸå››','æ˜ŸæœŸäº�?','æ˜ŸæœŸå…­'],
		dayNamesShort: ['å‘¨æ—¥','å‘¨ä¸€','å‘¨äºŒ','å‘¨ä¸‰','å‘¨å››','å‘¨äº�?','å‘¨å…­'],
		dayNamesMin: ['æ—¥','ä¸€','äºŒ','ä¸‰','å››','äº�?','å…­'],
		weekHeader: 'å‘¨',
		dateFormat: 'yy-mm-dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: 'å¹´'};
	$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
});
/* Chinese initialisation for the jQuery UI date picker plugin. */
/* Written by SCCY (samuelcychan@gmail.com). */
jQuery(function($){
	$.datepicker.regional['zh-HK'] = {
		closeText: 'é—œé–‰',
		prevText: '&#x3c;ä¸Šæœˆ',
		nextText: 'ä¸‹æœˆ&#x3e;',
		currentText: 'ä»Šå¤©',
		monthNames: ['ä¸€æœˆ','äºŒæœˆ','ä¸‰æœˆ','å››æœˆ','äº�?æœˆ','å…­æœˆ',
		'ä¸ƒæœˆ','å…«æœˆ','ä¹�?æœˆ','å�?�?æœˆ','å�?�?ä¸€æœˆ','å�?�?äºŒæœˆ'],
		monthNamesShort: ['ä¸€','äºŒ','ä¸‰','å››','äº�?','å…­',
		'ä¸ƒ','å…«','ä¹�?','å�?�?','å�?�?ä¸€','å�?�?äºŒ'],
		dayNames: ['æ˜ŸæœŸæ—¥','æ˜ŸæœŸä¸€','æ˜ŸæœŸäºŒ','æ˜ŸæœŸä¸‰','æ˜ŸæœŸå››','æ˜ŸæœŸäº�?','æ˜ŸæœŸå…­'],
		dayNamesShort: ['å‘¨æ—¥','å‘¨ä¸€','å‘¨äºŒ','å‘¨ä¸‰','å‘¨å››','å‘¨äº�?','å‘¨å…­'],
		dayNamesMin: ['æ—¥','ä¸€','äºŒ','ä¸‰','å››','äº�?','å…­'],
		weekHeader: 'å‘¨',
		dateFormat: 'dd-mm-yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: 'å¹´'};
	$.datepicker.setDefaults($.datepicker.regional['zh-HK']);
});
/* Chinese initialisation for the jQuery UI date picker plugin. */
/* Written by Ressol (ressol@gmail.com). */
jQuery(function($){
	$.datepicker.regional['zh-TW'] = {
		closeText: '關閉',
		prevText: '&#x3c;上月',
		nextText: '下月&#x3e;',
		currentText: '今天',
		monthNames: ['一月','二月','三月','四月','五月','六月',
		'七月','八月','�?月','�??月','�??一月','�??二月'],
		monthNamesShort: ['一','二','三','四','五','六',
		'七','八','�?','�??','�??一','�??二'],
		dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
		dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		weekHeader: '周',
		dateFormat: 'yy/mm/dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: '年'};
	$.datepicker.setDefaults($.datepicker.regional['zh-TW']);
});

 * jQuery UI 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function( $, undefined ) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
	return;
}

$.extend( $.ui, {
	version: "1.8.7",

	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	}
});

// plugins
$.fn.extend({
	_focus: $.fn.focus,
	focus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},

	scrollParent: function() {
		var scrollParent;
		if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.each( [ "Width", "Height" ], function( i, name ) {
	var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
		type = name.toLowerCase(),
		orig = {
			innerWidth: $.fn.innerWidth,
			innerHeight: $.fn.innerHeight,
			outerWidth: $.fn.outerWidth,
			outerHeight: $.fn.outerHeight
		};

	function reduce( elem, size, border, margin ) {
		$.each( side, function() {
			size -= parseFloat( $.curCSS( elem, "padding" + this, true) ) || 0;
			if ( border ) {
				size -= parseFloat( $.curCSS( elem, "border" + this + "Width", true) ) || 0;
			}
			if ( margin ) {
				size -= parseFloat( $.curCSS( elem, "margin" + this, true) ) || 0;
			}
		});
		return size;
	}

	$.fn[ "inner" + name ] = function( size ) {
		if ( size === undefined ) {
			return orig[ "inner" + name ].call( this );
		}

		return this.each(function() {
			$( this ).css( type, reduce( this, size ) + "px" );
		});
	};

	$.fn[ "outer" + name] = function( size, margin ) {
		if ( typeof size !== "number" ) {
			return orig[ "outer" + name ].call( this, size );
		}

		return this.each(function() {
			$( this).css( type, reduce( this, size, true, margin ) + "px" );
		});
	};
});

// selectors
function visible( element ) {
	return !$( element ).parents().andSelf().filter(function() {
		return $.curCSS( this, "visibility" ) === "hidden" ||
			$.expr.filters.hidden( this );
	}).length;
}

$.extend( $.expr[ ":" ], {
	data: function( elem, i, match ) {
		return !!$.data( elem, match[ 3 ] );
	},

	focusable: function( element ) {
		var nodeName = element.nodeName.toLowerCase(),
			tabIndex = $.attr( element, "tabindex" );
		if ( "area" === nodeName ) {
			var map = element.parentNode,
				mapName = map.name,
				img;
			if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
				return false;
			}
			img = $( "img[usemap=#" + mapName + "]" )[0];
			return !!img && visible( img );
		}
		return ( /input|select|textarea|button|object/.test( nodeName )
			? !element.disabled
			: "a" == nodeName
				? element.href || !isNaN( tabIndex )
				: !isNaN( tabIndex ))
			// the element and all of its ancestors must be visible
			&& visible( element );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" );
		return ( isNaN( tabIndex ) || tabIndex >= 0 ) && $( element ).is( ":focusable" );
	}
});

// support
$(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );

	$.extend( div.style, {
		minHeight: "100px",
		height: "auto",
		padding: 0,
		borderWidth: 0
	});

	$.support.minHeight = div.offsetHeight === 100;
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.jquery.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});





// deprecated
$.extend( $.ui, {
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function( module, option, set ) {
			var proto = $.ui[ module ].prototype;
			for ( var i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode ) {
				return;
			}
	
			for ( var i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},
	
	// will be deprecated when we switch to jQuery 1.4 - use jQuery.contains()
	contains: function( a, b ) {
		return document.compareDocumentPosition ?
			a.compareDocumentPosition( b ) & 16 :
			a !== b && a.contains( b );
	},
	
	// only used by resizable
	hasScroll: function( el, a ) {
	
		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}
	
		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;
	
		if ( el[ scroll ] > 0 ) {
			return true;
		}
	
		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},
	
	// these are odd functions, fix the API or move into individual plugins
	isOverAxis: function( x, reference, size ) {
		//Determines when x coordinate is over "b" element axis
		return ( x > reference ) && ( x < ( reference + size ) );
	},
	isOver: function( y, x, top, left, height, width ) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
	}
});

})( jQuery );

 * jQuery UI Draggable 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false
	},
	_create: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		(this.options.addClasses && this.element.addClass("ui-draggable"));
		(this.options.disabled && this.element.addClass("ui-draggable-disabled"));

		this._mouseInit();

	},

	destroy: function() {
		if(!this.element.data('draggable')) return;
		this.element
			.removeData("draggable")
			.unbind(".draggable")
			.removeClass("ui-draggable"
				+ " ui-draggable-dragging"
				+ " ui-draggable-disabled");
		this._mouseDestroy();

		return this;
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
			return false;

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.helper.addClass("ui-draggable-dragging");
		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;
	},

	_mouseDrag: function(event, noPropagation) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger('drag', event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			dropped = $.ui.ddmanager.drop(this, event);

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}
		
		//if the original element is removed, don't bother to continue
		if(!this.element[0] || !this.element[0].parentNode)
			return false;

		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			var self = this;
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if(self._trigger("stop", event) !== false) {
					self._clear();
				}
			});
		} else {
			if(this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},
	
	cancel: function() {
		
		if(this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}
		
		return this;
		
	},

	_getHandle: function(event) {

		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
		$(this.options.handle, this.element)
			.find("*")
			.andSelf()
			.each(function() {
				if(this == event.target) handle = true;
			});

		return handle;

	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone() : this.element);

		if(!helper.parents('body').length)
			helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
			helper.css("position", "absolute");

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			(o.containment == 'document' ? 0 : $(window).scrollLeft()) - this.offset.relative.left - this.offset.parent.left,
			(o.containment == 'document' ? 0 : $(window).scrollTop()) - this.offset.relative.top - this.offset.parent.top,
			(o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			(o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
			var ce = $(o.containment)[0]; if(!ce) return;
			var co = $(o.containment).offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		} else if(o.containment.constructor == Array) {
			this.containment = o.containment;
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
		//if($.ui.ddmanager) $.ui.ddmanager.current = null;
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function(event) {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.extend($.ui.draggable, {
	version: "1.8.7"
});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, 'sortable');
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable._refreshItems();	//Do a one-time refresh at start to refresh the containerCache
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
				if(this.shouldRevert) this.instance.options.revert = true;

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper == 'original')
					this.instance.currentItem.css({ top: 'auto', left: 'auto' });

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), self = this;

		var checkPos = function(o) {
			var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
			var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
			var itemHeight = o.height, itemWidth = o.width;
			var itemTop = o.top, itemLeft = o.left;

			return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
		};

		$.each(inst.sortables, function(i) {
			
			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;
			
			if(this.instance._intersectsWith(this.instance.containerCache)) {

				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(self).clone().appendTo(this.instance.element).data("sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) this.instance._mouseDrag(event);

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;
					
					//Prevent reverting on this forced stop
					this.instance.options.revert = false;
					
					// The out event needs to be triggered independently
					this.instance._trigger('out', event, this.instance._uiHash(this.instance));
					
					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) this.instance.placeholder.remove();

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			};

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function(event, ui) {
		var t = $('body'), o = $(this).data('draggable').options;
		if (t.css("cursor")) o._cursor = t.css("cursor");
		t.css("cursor", o.cursor);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if (o._cursor) $('body').css("cursor", o._cursor);
	}
});

$.ui.plugin.add("draggable", "iframeFix", {
	start: function(event, ui) {
		var o = $(this).data('draggable').options;
		$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
			$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
			.css({
				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
				position: "absolute", opacity: "0.001", zIndex: 1000
			})
			.css($(this).offset())
			.appendTo("body");
		});
	},
	stop: function(event, ui) {
		$("div.ui-draggable-iframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data('draggable').options;
		if(t.css("opacity")) o._opacity = t.css("opacity");
		t.css('opacity', o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if(o._opacity) $(ui.helper).css('opacity', o._opacity);
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function(event, ui) {
		var i = $(this).data("draggable");
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	drag: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if(!o.axis || o.axis != 'x') {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
			}

			if(!o.axis || o.axis != 'y') {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
			}

		} else {

			if(!o.axis || o.axis != 'x') {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
			}

			if(!o.axis || o.axis != 'y') {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options;
		i.snapElements = [];

		$(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
			var $t = $(this); var $o = $t.offset();
			if(this != i.element[0]) i.snapElements.push({
				item: this,
				width: $t.outerWidth(), height: $t.outerHeight(),
				top: $o.top, left: $o.left
			});
		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options;
		var d = o.snapTolerance;

		var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (var i = inst.snapElements.length - 1; i >= 0; i--){

			var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
				t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

			//Yes, I know, this is insane ;)
			if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
				if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode != 'inner') {
				var ts = Math.abs(t - y2) <= d;
				var bs = Math.abs(b - y1) <= d;
				var ls = Math.abs(l - x2) <= d;
				var rs = Math.abs(r - x1) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
			}

			var first = (ts || bs || ls || rs);

			if(o.snapMode != 'outer') {
				var ts = Math.abs(t - y1) <= d;
				var bs = Math.abs(b - y2) <= d;
				var ls = Math.abs(l - x1) <= d;
				var rs = Math.abs(r - x2) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		};

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function(event, ui) {

		var o = $(this).data("draggable").options;

		var group = $.makeArray($(o.stack)).sort(function(a,b) {
			return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
		});
		if (!group.length) { return; }
		
		var min = parseInt(group[0].style.zIndex) || 0;
		$(group).each(function(i) {
			this.style.zIndex = min + i;
		});

		this[0].style.zIndex = min + group.length;

	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("draggable").options;
		if(t.css("zIndex")) o._zIndex = t.css("zIndex");
		t.css('zIndex', o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("draggable").options;
		if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
	}
});

})(jQuery);

 * jQuery UI Sortable 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.sortable", $.ui.mouse, {
	widgetEventPrefix: "sort",
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: 'auto',
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: '> *',
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000
	},
	_create: function() {

		var o = this.options;
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		//Get the items
		this.refresh();

		//Let's determine if the items are floating
		this.floating = this.items.length ? (/left|right/).test(this.items[0].item.css('float')) : false;

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

	},

	destroy: function() {
		this.element
			.removeClass("ui-sortable ui-sortable-disabled")
			.removeData("sortable")
			.unbind(".sortable");
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- )
			this.items[i].item.removeData("sortable-item");

		return this;
	},

	_setOption: function(key, value){
		if ( key === "disabled" ) {
			this.options[ key ] = value;
	
			this.widget()
				[ value ? "addClass" : "removeClass"]( "ui-sortable-disabled" );
		} else {
			// Don't call widget base _setOption for disable as it adds ui-state-disabled class
			$.Widget.prototype._setOption.apply(this, arguments);
		}
	},

	_mouseCapture: function(event, overrideHandle) {

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type == 'static') return false;

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		var currentItem = null, self = this, nodes = $(event.target).parents().each(function() {
			if($.data(this, 'sortable-item') == self) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, 'sortable-item') == self) currentItem = $(event.target);

		if(!currentItem) return false;
		if(this.options.handle && !overrideHandle) {
			var validHandle = false;

			$(this.options.handle, currentItem).find("*").andSelf().each(function() { if(this == event.target) validHandle = true; });
			if(!validHandle) return false;
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var o = this.options, self = this;
		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] != this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		if(o.cursor) { // cursor option
			if ($('body').css("cursor")) this._storedCursor = $('body').css("cursor");
			$('body').css("cursor", o.cursor);
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity");
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex");
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML')
			this.overflowOffset = this.scrollParent.offset();

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if(!this._preserveHelperProportions)
			this._cacheHelperProportions();


		//Post 'activate' events to possible containers
		if(!noActivation) {
			 for (var i = this.containers.length - 1; i >= 0; i--) { this.containers[i]._trigger("activate", event, self._uiHash(this)); }
		}

		//Prepare possible droppables
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if(this.options.scroll) {
			var o = this.options, scrolled = false;
			if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML') {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity)
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity)
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;

			} else {

				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);

				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);

			}

			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(this, event);
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';

		//Rearrange
		for (var i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			var item = this.items[i], itemElement = item.item[0], intersection = this._intersectsWithPointer(item);
			if (!intersection) continue;

			if(itemElement != this.currentItem[0] //cannot intersect with itself
				&&	this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
				&&	!$.ui.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
				&& (this.options.type == 'semi-dynamic' ? !$.ui.contains(this.element[0], itemElement) : true)
				//&& itemElement.parentNode == this.placeholder[0].parentNode // only rearrange items within the same container
			) {

				this.direction = intersection == 1 ? "down" : "up";

				if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		//Call callbacks
		this._trigger('sort', event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) return;

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			$.ui.ddmanager.drop(this, event);

		if(this.options.revert) {
			var self = this;
			var cur = self.placeholder.offset();

			self.reverting = true;

			$(this.helper).animate({
				left: cur.left - this.offset.parent.left - self.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
				top: cur.top - this.offset.parent.top - self.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
			}, parseInt(this.options.revert, 10) || 500, function() {
				self._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		var self = this;

		if(this.dragging) {

			this._mouseUp();

			if(this.options.helper == "original")
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			else
				this.currentItem.show();

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, self._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, self._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		if(this.placeholder[0].parentNode) this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
		if(this.options.helper != "original" && this.helper && this.helper[0].parentNode) this.helper.remove();

		$.extend(this, {
			helper: null,
			dragging: false,
			reverting: false,
			_noFinalSort: null
		});

		if(this.domPosition.prev) {
			$(this.domPosition.prev).after(this.currentItem);
		} else {
			$(this.domPosition.parent).prepend(this.currentItem);
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var str = []; o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
			if(res) str.push((o.key || res[1]+'[]')+'='+(o.key && o.expression ? res[1] : res[2]));
		});

		if(!str.length && o.key) {
			str.push(o.key + '=');
		}

		return str.join('&');

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var ret = []; o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || 'id') || ''); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height;

		var l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height;

		var dyClick = this.offset.click.top,
			dxClick = this.offset.click.left;

		var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

		if(	   this.options.tolerance == "pointer"
			|| this.options.forcePointerForContainers
			|| (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) // Right Half
				&& x2 - (this.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (this.helperProportions.height / 2) // Bottom Half
				&& y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement)
			return false;

		return this.floating ?
			( ((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection == "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta != 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta != 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor == String
			? [options.connectWith]
			: options.connectWith;
	},
	
	_getItemsAsjQuery: function(connected) {

		var self = this;
		var items = [];
		var queries = [];
		var connectWith = this._connectWith();

		if(connectWith && connected) {
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], 'sortable');
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), inst]);
					}
				};
			};
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), this]);

		for (var i = queries.length - 1; i >= 0; i--){
			queries[i][0].each(function() {
				items.push(this);
			});
		};

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(sortable-item)");

		for (var i=0; i < this.items.length; i++) {

			for (var j=0; j < list.length; j++) {
				if(list[j] == this.items[i].item[0])
					this.items.splice(i,1);
			};

		};

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];
		var items = this.items;
		var self = this;
		var queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]];
		var connectWith = this._connectWith();

		if(connectWith) {
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], 'sortable');
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				};
			};
		}

		for (var i = queries.length - 1; i >= 0; i--) {
			var targetData = queries[i][1];
			var _queries = queries[i][0];

			for (var j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				var item = $(_queries[j]);

				item.data('sortable-item', targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			};
		};

	},

	refreshPositions: function(fast) {

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		for (var i = this.items.length - 1; i >= 0; i--){
			var item = this.items[i];

			var t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			var p = t.offset();
			item.left = p.left;
			item.top = p.top;
		};

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (var i = this.containers.length - 1; i >= 0; i--){
				var p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			};
		}

		return this;
	},

	_createPlaceholder: function(that) {

		var self = that || this, o = self.options;

		if(!o.placeholder || o.placeholder.constructor == String) {
			var className = o.placeholder;
			o.placeholder = {
				element: function() {

					var el = $(document.createElement(self.currentItem[0].nodeName))
						.addClass(className || self.currentItem[0].className+" ui-sortable-placeholder")
						.removeClass("ui-sortable-helper")[0];

					if(!className)
						el.style.visibility = "hidden";

					return el;
				},
				update: function(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) return;

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(self.currentItem.innerHeight() - parseInt(self.currentItem.css('paddingTop')||0, 10) - parseInt(self.currentItem.css('paddingBottom')||0, 10)); };
					if(!p.width()) { p.width(self.currentItem.innerWidth() - parseInt(self.currentItem.css('paddingLeft')||0, 10) - parseInt(self.currentItem.css('paddingRight')||0, 10)); };
				}
			};
		}

		//Create the placeholder
		self.placeholder = $(o.placeholder.element.call(self.element, self.currentItem));

		//Append it after the actual current item
		self.currentItem.after(self.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(self, self.placeholder);

	},

	_contactContainers: function(event) {
		
		// get innermost container that intersects with item 
		var innermostContainer = null, innermostIndex = null;		
		
		
		for (var i = this.containers.length - 1; i >= 0; i--){

			// never consider a container that's located within the item itself 
			if($.ui.contains(this.currentItem[0], this.containers[i].element[0]))
				continue;

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue 
				if(innermostContainer && $.ui.contains(this.containers[i].element[0], innermostContainer.element[0]))
					continue;

				innermostContainer = this.containers[i]; 
				innermostIndex = i;
					
			} else {
				// container doesn't intersect. trigger "out" event if necessary 
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}
		
		// if no intersecting containers found, return 
		if(!innermostContainer) return; 

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		} else if(this.currentContainer != this.containers[innermostIndex]) { 

			//When entering a new container, we will find the item with the least distance and append our item near it 
			var dist = 10000; var itemWithLeastDistance = null; var base = this.positionAbs[this.containers[innermostIndex].floating ? 'left' : 'top']; 
			for (var j = this.items.length - 1; j >= 0; j--) { 
				if(!$.ui.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) continue; 
				var cur = this.items[j][this.containers[innermostIndex].floating ? 'left' : 'top']; 
				if(Math.abs(cur - base) < dist) { 
					dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j]; 
				} 
			} 

			if(!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled 
				return; 

			this.currentContainer = this.containers[innermostIndex]; 
			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true); 
			this._trigger("change", event, this._uiHash()); 
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this)); 

			//Update the placeholder 
			this.options.placeholder.update(this.currentContainer, this.placeholder); 
		
			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this)); 
			this.containers[innermostIndex].containerCache.over = 1;
		} 
	
		
	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper == 'clone' ? this.currentItem.clone() : this.currentItem);

		if(!helper.parents('body').length) //Add the helper to the DOM if that didn't happen already
			$(o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);

		if(helper[0] == this.currentItem[0])
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };

		if(helper[0].style.width == '' || o.forceHelperSize) helper.width(this.currentItem.width());
		if(helper[0].style.height == '' || o.forceHelperSize) helper.height(this.currentItem.height());

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			0 - this.offset.relative.left - this.offset.parent.left,
			0 - this.offset.relative.top - this.offset.parent.top,
			$(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			var ce = $(o.containment)[0];
			var co = $(o.containment).offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == 'down' ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var self = this, counter = this.counter;

		window.setTimeout(function() {
			if(counter == self.counter) self.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
		},0);

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var delayedTriggers = [], self = this;

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem[0].parentNode) this.placeholder.before(this.currentItem);
		this._noFinalSort = null;

		if(this.helper[0] == this.currentItem[0]) {
			for(var i in this._storedCSS) {
				if(this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static') this._storedCSS[i] = '';
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		if((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		if(!$.ui.contains(this.element[0], this.currentItem[0])) { //Node was moved out of the current element
			if(!noPropagation) delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
			for (var i = this.containers.length - 1; i >= 0; i--){
				if($.ui.contains(this.containers[i].element[0], this.currentItem[0]) && !noPropagation) {
					delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
					delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.containers[i]));
				}
			};
		};

		//Post events to containers
		for (var i = this.containers.length - 1; i >= 0; i--){
			if(!noPropagation) delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if(this._storedCursor) $('body').css("cursor", this._storedCursor); //Reset cursor
		if(this._storedOpacity) this.helper.css("opacity", this._storedOpacity); //Reset opacity
		if(this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == 'auto' ? '' : this._storedZIndex); //Reset z-index

		this.dragging = false;
		if(this.cancelHelperRemoval) {
			if(!noPropagation) {
				this._trigger("beforeStop", event, this._uiHash());
				for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
				this._trigger("stop", event, this._uiHash());
			}
			return false;
		}

		if(!noPropagation) this._trigger("beforeStop", event, this._uiHash());

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if(this.helper[0] != this.currentItem[0]) this.helper.remove(); this.helper = null;

		if(!noPropagation) {
			for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return true;

	},

	_trigger: function() {
		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(inst) {
		var self = inst || this;
		return {
			helper: self.helper,
			placeholder: self.placeholder || $([]),
			position: self.position,
			originalPosition: self.originalPosition,
			offset: self.positionAbs,
			item: self.currentItem,
			sender: inst ? inst.element : null
		};
	}

});

$.extend($.ui.sortable, {
	version: "1.8.7"
});

})(jQuery);

 *
 * Released under the MIT license by IOLA, December 2007.
 *
 */

// first an inline dependency, jquery.colorhelpers.js, we inline it here
// for convenience

/* Plugin for jQuery for working with colors.
 * 
 * Version 1.0.
 * 
 * Inspiration from jQuery color animation plugin by John Resig.
 *
 * Released under the MIT license by Ole Laursen, October 2009.
 *
 * Examples:
 *
 *   $.color.parse("#fff").scale('rgb', 0.25).add('a', -0.5).toString()
 *   var c = $.color.extract($("#mydiv"), 'background-color');
 *   console.log(c.r, c.g, c.b, c.a);
 *   $.color.make(100, 50, 25, 0.4).toString() // returns "rgba(100,50,25,0.4)"
 *
 * Note that .scale() and .add() work in-place instead of returning
 * new objects.
 */ 
(function(){jQuery.color={};jQuery.color.make=function(E,D,B,C){var F={};F.r=E||0;F.g=D||0;F.b=B||0;F.a=C!=null?C:1;F.add=function(I,H){for(var G=0;G<I.length;++G){F[I.charAt(G)]+=H}return F.normalize()};F.scale=function(I,H){for(var G=0;G<I.length;++G){F[I.charAt(G)]*=H}return F.normalize()};F.toString=function(){if(F.a>=1){return"rgb("+[F.r,F.g,F.b].join(",")+")"}else{return"rgba("+[F.r,F.g,F.b,F.a].join(",")+")"}};F.normalize=function(){function G(I,J,H){return J<I?I:(J>H?H:J)}F.r=G(0,parseInt(F.r),255);F.g=G(0,parseInt(F.g),255);F.b=G(0,parseInt(F.b),255);F.a=G(0,F.a,1);return F};F.clone=function(){return jQuery.color.make(F.r,F.b,F.g,F.a)};return F.normalize()};jQuery.color.extract=function(C,B){var D;do{D=C.css(B).toLowerCase();if(D!=""&&D!="transparent"){break}C=C.parent()}while(!jQuery.nodeName(C.get(0),"body"));if(D=="rgba(0, 0, 0, 0)"){D="transparent"}return jQuery.color.parse(D)};jQuery.color.parse=function(E){var D,B=jQuery.color.make;if(D=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(E)){return B(parseInt(D[1],10),parseInt(D[2],10),parseInt(D[3],10))}if(D=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(E)){return B(parseInt(D[1],10),parseInt(D[2],10),parseInt(D[3],10),parseFloat(D[4]))}if(D=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(E)){return B(parseFloat(D[1])*2.55,parseFloat(D[2])*2.55,parseFloat(D[3])*2.55)}if(D=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(E)){return B(parseFloat(D[1])*2.55,parseFloat(D[2])*2.55,parseFloat(D[3])*2.55,parseFloat(D[4]))}if(D=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(E)){return B(parseInt(D[1],16),parseInt(D[2],16),parseInt(D[3],16))}if(D=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(E)){return B(parseInt(D[1]+D[1],16),parseInt(D[2]+D[2],16),parseInt(D[3]+D[3],16))}var C=jQuery.trim(E).toLowerCase();if(C=="transparent"){return B(255,255,255,0)}else{D=A[C];return B(D[0],D[1],D[2])}};var A={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})();

// the actual Flot code
(function($) {
    function Plot(placeholder, data_, options_, plugins) {
        // data is on the form:
        //   [ series1, series2 ... ]
        // where series is either just the data as [ [x1, y1], [x2, y2], ... ]
        // or { data: [ [x1, y1], [x2, y2], ... ], label: "some label", ... }
        
        var series = [],
            options = {
                // the color theme used for graphs
                colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                legend: {
                    show: true,
                    noColumns: 1, // number of colums in legend table
                    labelFormatter: null, // fn: string -> string
                    labelBoxBorderColor: "#ccc", // border color for the little label boxes
                    container: null, // container (as jQuery object) to put legend in, null means default on top of graph
                    position: "ne", // position of default legend container within plot
                    margin: 5, // distance from grid edge to default legend container within plot
                    backgroundColor: null, // null means auto-detect
                    backgroundOpacity: 0.85 // set to 0 to avoid background
                },
                xaxis: {
                    mode: null, // null or "time"
                    transform: null, // null or f: number -> number to transform axis
                    inverseTransform: null, // if transform is set, this should be the inverse function
                    min: null, // min. value to show, null means set automatically
                    max: null, // max. value to show, null means set automatically
                    autoscaleMargin: null, // margin in % to add if auto-setting min/max
                    ticks: null, // either [1, 3] or [[1, "a"], 3] or (fn: axis info -> ticks) or app. number of ticks for auto-ticks
                    tickFormatter: null, // fn: number -> string
                    labelWidth: null, // size of tick labels in pixels
                    labelHeight: null,
                    
                    // mode specific options
                    tickDecimals: null, // no. of decimals, null means auto
                    tickSize: null, // number or [number, "unit"]
                    minTickSize: null, // number or [number, "unit"]
                    monthNames: null, // list of names of months
                    timeformat: null, // format string to use
                    twelveHourClock: false // 12 or 24 time in time mode
                },
                yaxis: {
                    autoscaleMargin: 0.02
                },
                x2axis: {
                    autoscaleMargin: null
                },
                y2axis: {
                    autoscaleMargin: 0.02
                },
                series: {
                    points: {
                        show: false,
                        radius: 3,
                        lineWidth: 2, // in pixels
                        fill: true,
                        fillColor: "#ffffff"
                    },
                    lines: {
                        // we don't put in show: false so we can see
                        // whether lines were actively disabled 
                        lineWidth: 2, // in pixels
                        fill: false,
                        fillColor: null,
                        steps: false
                    },
                    bars: {
                        show: false,
                        lineWidth: 2, // in pixels
                        barWidth: 1, // in units of the x axis
                        fill: true,
                        fillColor: null,
                        align: "left", // or "center" 
                        horizontal: false // when horizontal, left is now top
                    },
                    shadowSize: 3
                },
                grid: {
                    show: true,
                    aboveData: false,
                    color: "#545454", // primary color used for outline and labels
                    backgroundColor: null, // null for transparent, else color
                    tickColor: "rgba(0,0,0,0.15)", // color used for the ticks
                    labelMargin: 5, // in pixels
                    borderWidth: 2, // in pixels
                    borderColor: null, // set if different from the grid color
                    markings: null, // array of ranges or fn: axes -> array of ranges
                    markingsColor: "#f4f4f4",
                    markingsLineWidth: 2,
                    // interactive stuff
                    clickable: false,
                    hoverable: false,
                    autoHighlight: true, // highlight in case mouse is near
                    mouseActiveRadius: 10 // how far the mouse can be away to activate an item
                },
                hooks: {}
            },
        canvas = null,      // the canvas for the plot itself
        overlay = null,     // canvas for interactive stuff on top of plot
        eventHolder = null, // jQuery object that events should be bound to
        ctx = null, octx = null,
        axes = { xaxis: {}, yaxis: {}, x2axis: {}, y2axis: {} },
        plotOffset = { left: 0, right: 0, top: 0, bottom: 0},
        canvasWidth = 0, canvasHeight = 0,
        plotWidth = 0, plotHeight = 0,
        hooks = {
            processOptions: [],
            processRawData: [],
            processDatapoints: [],
            draw: [],
            bindEvents: [],
            drawOverlay: []
        },
        plot = this;

        // public functions
        plot.setData = setData;
        plot.setupGrid = setupGrid;
        plot.draw = draw;
        plot.getPlaceholder = function() { return placeholder; };
        plot.getCanvas = function() { return canvas; };
        plot.getPlotOffset = function() { return plotOffset; };
        plot.width = function () { return plotWidth; };
        plot.height = function () { return plotHeight; };
        plot.offset = function () {
            var o = eventHolder.offset();
            o.left += plotOffset.left;
            o.top += plotOffset.top;
            return o;
        };
        plot.getData = function() { return series; };
        plot.getAxes = function() { return axes; };
        plot.getOptions = function() { return options; };
        plot.highlight = highlight;
        plot.unhighlight = unhighlight;
        plot.triggerRedrawOverlay = triggerRedrawOverlay;
        plot.pointOffset = function(point) {
            return { left: parseInt(axisSpecToRealAxis(point, "xaxis").p2c(+point.x) + plotOffset.left),
                     top: parseInt(axisSpecToRealAxis(point, "yaxis").p2c(+point.y) + plotOffset.top) };
        };
        

        // public attributes
        plot.hooks = hooks;
        
        // initialize
        initPlugins(plot);
        parseOptions(options_);
        constructCanvas();
        setData(data_);
        setupGrid();
        draw();
        bindEvents();


        function executeHooks(hook, args) {
            args = [plot].concat(args);
            for (var i = 0; i < hook.length; ++i)
                hook[i].apply(this, args);
        }

        function initPlugins() {
            for (var i = 0; i < plugins.length; ++i) {
                var p = plugins[i];
                p.init(plot);
                if (p.options)
                    $.extend(true, options, p.options);
            }
        }
        
        function parseOptions(opts) {
            $.extend(true, options, opts);
            if (options.grid.borderColor == null)
                options.grid.borderColor = options.grid.color;
            // backwards compatibility, to be removed in future
            if (options.xaxis.noTicks && options.xaxis.ticks == null)
                options.xaxis.ticks = options.xaxis.noTicks;
            if (options.yaxis.noTicks && options.yaxis.ticks == null)
                options.yaxis.ticks = options.yaxis.noTicks;
            if (options.grid.coloredAreas)
                options.grid.markings = options.grid.coloredAreas;
            if (options.grid.coloredAreasColor)
                options.grid.markingsColor = options.grid.coloredAreasColor;
            if (options.lines)
                $.extend(true, options.series.lines, options.lines);
            if (options.points)
                $.extend(true, options.series.points, options.points);
            if (options.bars)
                $.extend(true, options.series.bars, options.bars);
            if (options.shadowSize)
                options.series.shadowSize = options.shadowSize;

            for (var n in hooks)
                if (options.hooks[n] && options.hooks[n].length)
                    hooks[n] = hooks[n].concat(options.hooks[n]);

            executeHooks(hooks.processOptions, [options]);
        }

        function setData(d) {
            series = parseData(d);
            fillInSeriesOptions();
            processData();
        }
        
        function parseData(d) {
            var res = [];
            for (var i = 0; i < d.length; ++i) {
                var s = $.extend(true, {}, options.series);

                if (d[i].data) {
                    s.data = d[i].data; // move the data instead of deep-copy
                    delete d[i].data;

                    $.extend(true, s, d[i]);

                    d[i].data = s.data;
                }
                else
                    s.data = d[i];
                res.push(s);
            }

            return res;
        }
        
        function axisSpecToRealAxis(obj, attr) {
            var a = obj[attr];
            if (!a || a == 1)
                return axes[attr];
            if (typeof a == "number")
                return axes[attr.charAt(0) + a + attr.slice(1)];
            return a; // assume it's OK
        }
        
        function fillInSeriesOptions() {
            var i;
            
            // collect what we already got of colors
            var neededColors = series.length,
                usedColors = [],
                assignedColors = [];
            for (i = 0; i < series.length; ++i) {
                var sc = series[i].color;
                if (sc != null) {
                    --neededColors;
                    if (typeof sc == "number")
                        assignedColors.push(sc);
                    else
                        usedColors.push($.color.parse(series[i].color));
                }
            }
            
            // we might need to generate more colors if higher indices
            // are assigned
            for (i = 0; i < assignedColors.length; ++i) {
                neededColors = Math.max(neededColors, assignedColors[i] + 1);
            }

            // produce colors as needed
            var colors = [], variation = 0;
            i = 0;
            while (colors.length < neededColors) {
                var c;
                if (options.colors.length == i) // check degenerate case
                    c = $.color.make(100, 100, 100);
                else
                    c = $.color.parse(options.colors[i]);

                // vary color if needed
                var sign = variation % 2 == 1 ? -1 : 1;
                c.scale('rgb', 1 + sign * Math.ceil(variation / 2) * 0.2)

                // FIXME: if we're getting to close to something else,
                // we should probably skip this one
                colors.push(c);
                
                ++i;
                if (i >= options.colors.length) {
                    i = 0;
                    ++variation;
                }
            }

            // fill in the options
            var colori = 0, s;
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                
                // assign colors
                if (s.color == null) {
                    s.color = colors[colori].toString();
                    ++colori;
                }
                else if (typeof s.color == "number")
                    s.color = colors[s.color].toString();

                // turn on lines automatically in case nothing is set
                if (s.lines.show == null) {
                    var v, show = true;
                    for (v in s)
                        if (s[v].show) {
                            show = false;
                            break;
                        }
                    if (show)
                        s.lines.show = true;
                }

                // setup axes
                s.xaxis = axisSpecToRealAxis(s, "xaxis");
                s.yaxis = axisSpecToRealAxis(s, "yaxis");
            }
        }
        
        function processData() {
            var topSentry = Number.POSITIVE_INFINITY,
                bottomSentry = Number.NEGATIVE_INFINITY,
                i, j, k, m, length,
                s, points, ps, x, y, axis, val, f, p;

            for (axis in axes) {
                axes[axis].datamin = topSentry;
                axes[axis].datamax = bottomSentry;
                axes[axis].used = false;
            }

            function updateAxis(axis, min, max) {
                if (min < axis.datamin)
                    axis.datamin = min;
                if (max > axis.datamax)
                    axis.datamax = max;
            }

            for (i = 0; i < series.length; ++i) {
                s = series[i];
                s.datapoints = { points: [] };
                
                executeHooks(hooks.processRawData, [ s, s.data, s.datapoints ]);
            }
            
            // first pass: clean and copy data
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                var data = s.data, format = s.datapoints.format;

                if (!format) {
                    format = [];
                    // find out how to copy
                    format.push({ x: true, number: true, required: true });
                    format.push({ y: true, number: true, required: true });

                    if (s.bars.show)
                        format.push({ y: true, number: true, required: false, defaultValue: 0 });
                    
                    s.datapoints.format = format;
                }

                if (s.datapoints.pointsize != null)
                    continue; // already filled in

                if (s.datapoints.pointsize == null)
                    s.datapoints.pointsize = format.length;
                
                ps = s.datapoints.pointsize;
                points = s.datapoints.points;

                insertSteps = s.lines.show && s.lines.steps;
                s.xaxis.used = s.yaxis.used = true;
                
                for (j = k = 0; j < data.length; ++j, k += ps) {
                    p = data[j];

                    var nullify = p == null;
                    if (!nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = p[m];
                            f = format[m];

                            if (f) {
                                if (f.number && val != null) {
                                    val = +val; // convert to number
                                    if (isNaN(val))
                                        val = null;
                                }

                                if (val == null) {
                                    if (f.required)
                                        nullify = true;
                                    
                                    if (f.defaultValue != null)
                                        val = f.defaultValue;
                                }
                            }
                            
                            points[k + m] = val;
                        }
                    }
                    
                    if (nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = points[k + m];
                            if (val != null) {
                                f = format[m];
                                // extract min/max info
                                if (f.x)
                                    updateAxis(s.xaxis, val, val);
                                if (f.y)
                                    updateAxis(s.yaxis, val, val);
                            }
                            points[k + m] = null;
                        }
                    }
                    else {
                        // a little bit of line specific stuff that
                        // perhaps shouldn't be here, but lacking
                        // better means...
                        if (insertSteps && k > 0
                            && points[k - ps] != null
                            && points[k - ps] != points[k]
                            && points[k - ps + 1] != points[k + 1]) {
                            // copy the point to make room for a middle point
                            for (m = 0; m < ps; ++m)
                                points[k + ps + m] = points[k + m];

                            // middle point has same y
                            points[k + 1] = points[k - ps + 1];

                            // we've added a point, better reflect that
                            k += ps;
                        }
                    }
                }
            }

            // give the hooks a chance to run
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                
                executeHooks(hooks.processDatapoints, [ s, s.datapoints]);
            }

            // second pass: find datamax/datamin for auto-scaling
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                points = s.datapoints.points,
                ps = s.datapoints.pointsize;

                var xmin = topSentry, ymin = topSentry,
                    xmax = bottomSentry, ymax = bottomSentry;
                
                for (j = 0; j < points.length; j += ps) {
                    if (points[j] == null)
                        continue;

                    for (m = 0; m < ps; ++m) {
                        val = points[j + m];
                        f = format[m];
                        if (!f)
                            continue;
                        
                        if (f.x) {
                            if (val < xmin)
                                xmin = val;
                            if (val > xmax)
                                xmax = val;
                        }
                        if (f.y) {
                            if (val < ymin)
                                ymin = val;
                            if (val > ymax)
                                ymax = val;
                        }
                    }
                }
                
                if (s.bars.show) {
                    // make sure we got room for the bar on the dancing floor
                    var delta = s.bars.align == "left" ? 0 : -s.bars.barWidth/2;
                    if (s.bars.horizontal) {
                        ymin += delta;
                        ymax += delta + s.bars.barWidth;
                    }
                    else {
                        xmin += delta;
                        xmax += delta + s.bars.barWidth;
                    }
                }
                
                updateAxis(s.xaxis, xmin, xmax);
                updateAxis(s.yaxis, ymin, ymax);
            }

            for (axis in axes) {
                if (axes[axis].datamin == topSentry)
                    axes[axis].datamin = null;
                if (axes[axis].datamax == bottomSentry)
                    axes[axis].datamax = null;
            }
        }

        function constructCanvas() {
            function makeCanvas(width, height) {
                var c = document.createElement('canvas');
                c.width = width;
                c.height = height;
                if ($.browser.msie) // excanvas hack
                    c = window.G_vmlCanvasManager.initElement(c);
                return c;
            }
            
            canvasWidth = placeholder.width();
            canvasHeight = placeholder.height();
            placeholder.html(""); // clear placeholder
            if (placeholder.css("position") == 'static')
                placeholder.css("position", "relative"); // for positioning labels and overlay

            if (canvasWidth <= 0 || canvasHeight <= 0)
                throw "Invalid dimensions for plot, width = " + canvasWidth + ", height = " + canvasHeight;

            if ($.browser.msie) // excanvas hack
                window.G_vmlCanvasManager.init_(document); // make sure everything is setup
            
            // the canvas
            canvas = $(makeCanvas(canvasWidth, canvasHeight)).appendTo(placeholder).get(0);
            ctx = canvas.getContext("2d");

            // overlay canvas for interactive features
            overlay = $(makeCanvas(canvasWidth, canvasHeight)).css({ position: 'absolute', left: 0, top: 0 }).appendTo(placeholder).get(0);
            octx = overlay.getContext("2d");
            octx.stroke();
        }

        function bindEvents() {
            // we include the canvas in the event holder too, because IE 7
            // sometimes has trouble with the stacking order
            eventHolder = $([overlay, canvas]);

            // bind events
            if (options.grid.hoverable)
                eventHolder.mousemove(onMouseMove);

            if (options.grid.clickable)
                eventHolder.click(onClick);

            executeHooks(hooks.bindEvents, [eventHolder]);
        }

        function setupGrid() {
            function setTransformationHelpers(axis, o) {
                function identity(x) { return x; }
                
                var s, m, t = o.transform || identity,
                    it = o.inverseTransform;
                    
                // add transformation helpers
                if (axis == axes.xaxis || axis == axes.x2axis) {
                    // precompute how much the axis is scaling a point
                    // in canvas space
                    s = axis.scale = plotWidth / (t(axis.max) - t(axis.min));
                    m = t(axis.min);

                    // data point to canvas coordinate
                    if (t == identity) // slight optimization
                        axis.p2c = function (p) { return (p - m) * s; };
                    else
                        axis.p2c = function (p) { return (t(p) - m) * s; };
                    // canvas coordinate to data point
                    if (!it)
                        axis.c2p = function (c) { return m + c / s; };
                    else
                        axis.c2p = function (c) { return it(m + c / s); };
                }
                else {
                    s = axis.scale = plotHeight / (t(axis.max) - t(axis.min));
                    m = t(axis.max);
                    
                    if (t == identity)
                        axis.p2c = function (p) { return (m - p) * s; };
                    else
                        axis.p2c = function (p) { return (m - t(p)) * s; };
                    if (!it)
                        axis.c2p = function (c) { return m - c / s; };
                    else
                        axis.c2p = function (c) { return it(m - c / s); };
                }
            }

            function measureLabels(axis, axisOptions) {
                var i, labels = [], l;
                
                axis.labelWidth = axisOptions.labelWidth;
                axis.labelHeight = axisOptions.labelHeight;

                if (axis == axes.xaxis || axis == axes.x2axis) {
                    // to avoid measuring the widths of the labels, we
                    // construct fixed-size boxes and put the labels inside
                    // them, we don't need the exact figures and the
                    // fixed-size box content is easy to center
                    if (axis.labelWidth == null)
                        axis.labelWidth = canvasWidth / (axis.ticks.length > 0 ? axis.ticks.length : 1);

                    // measure x label heights
                    if (axis.labelHeight == null) {
                        labels = [];
                        for (i = 0; i < axis.ticks.length; ++i) {
                            l = axis.ticks[i].label;
                            if (l)
                                labels.push('<div class="tickLabel" style="float:left;width:' + axis.labelWidth + 'px">' + l + '</div>');
                        }
                        
                        if (labels.length > 0) {
                            var dummyDiv = $('<div style="position:absolute;top:-10000px;width:10000px;font-size:smaller">'
                                             + labels.join("") + '<div style="clear:left"></div></div>').appendTo(placeholder);
                            axis.labelHeight = dummyDiv.height();
                            dummyDiv.remove();
                        }
                    }
                }
                else if (axis.labelWidth == null || axis.labelHeight == null) {
                    // calculate y label dimensions
                    for (i = 0; i < axis.ticks.length; ++i) {
                        l = axis.ticks[i].label;
                        if (l)
                            labels.push('<div class="tickLabel">' + l + '</div>');
                    }
                    
                    if (labels.length > 0) {
                        var dummyDiv = $('<div style="position:absolute;top:-10000px;font-size:smaller">'
                                         + labels.join("") + '</div>').appendTo(placeholder);
                        if (axis.labelWidth == null)
                            axis.labelWidth = dummyDiv.width();
                        if (axis.labelHeight == null)
                            axis.labelHeight = dummyDiv.find("div").height();
                        dummyDiv.remove();
                    }
                    
                }

                if (axis.labelWidth == null)
                    axis.labelWidth = 0;
                if (axis.labelHeight == null)
                    axis.labelHeight = 0;
            }
            
            function setGridSpacing() {
                // get the most space needed around the grid for things
                // that may stick out
                var maxOutset = options.grid.borderWidth;
                for (i = 0; i < series.length; ++i)
                    maxOutset = Math.max(maxOutset, 2 * (series[i].points.radius + series[i].points.lineWidth/2));
                
                plotOffset.left = plotOffset.right = plotOffset.top = plotOffset.bottom = maxOutset;
                
                var margin = options.grid.labelMargin + options.grid.borderWidth;
                
                if (axes.xaxis.labelHeight > 0)
                    plotOffset.bottom = Math.max(maxOutset, axes.xaxis.labelHeight + margin);
                if (axes.yaxis.labelWidth > 0)
                    plotOffset.left = Math.max(maxOutset, axes.yaxis.labelWidth + margin);
                if (axes.x2axis.labelHeight > 0)
                    plotOffset.top = Math.max(maxOutset, axes.x2axis.labelHeight + margin);
                if (axes.y2axis.labelWidth > 0)
                    plotOffset.right = Math.max(maxOutset, axes.y2axis.labelWidth + margin);
            
                plotWidth = canvasWidth - plotOffset.left - plotOffset.right;
                plotHeight = canvasHeight - plotOffset.bottom - plotOffset.top;
            }
            
            var axis;
            for (axis in axes)
                setRange(axes[axis], options[axis]);
            
            if (options.grid.show) {
                for (axis in axes) {
                    prepareTickGeneration(axes[axis], options[axis]);
                    setTicks(axes[axis], options[axis]);
                    measureLabels(axes[axis], options[axis]);
                }

                setGridSpacing();
            }
            else {
                plotOffset.left = plotOffset.right = plotOffset.top = plotOffset.bottom = 0;
                plotWidth = canvasWidth;
                plotHeight = canvasHeight;
            }
            
            for (axis in axes)
                setTransformationHelpers(axes[axis], options[axis]);

            if (options.grid.show)
                insertLabels();
            
            insertLegend();
        }
        
        function setRange(axis, axisOptions) {
            var min = +(axisOptions.min != null ? axisOptions.min : axis.datamin),
                max = +(axisOptions.max != null ? axisOptions.max : axis.datamax),
                delta = max - min;

            if (delta == 0.0) {
                // degenerate case
                var widen = max == 0 ? 1 : 0.01;

                if (axisOptions.min == null)
                    min -= widen;
                // alway widen max if we couldn't widen min to ensure we
                // don't fall into min == max which doesn't work
                if (axisOptions.max == null || axisOptions.min != null)
                    max += widen;
            }
            else {
                // consider autoscaling
                var margin = axisOptions.autoscaleMargin;
                if (margin != null) {
                    if (axisOptions.min == null) {
                        min -= delta * margin;
                        // make sure we don't go below zero if all values
                        // are positive
                        if (min < 0 && axis.datamin != null && axis.datamin >= 0)
                            min = 0;
                    }
                    if (axisOptions.max == null) {
                        max += delta * margin;
                        if (max > 0 && axis.datamax != null && axis.datamax <= 0)
                            max = 0;
                    }
                }
            }
            axis.min = min;
            axis.max = max;
        }

        function prepareTickGeneration(axis, axisOptions) {
            // estimate number of ticks
            var noTicks;
            if (typeof axisOptions.ticks == "number" && axisOptions.ticks > 0)
                noTicks = axisOptions.ticks;
            else if (axis == axes.xaxis || axis == axes.x2axis)
                 // heuristic based on the model a*sqrt(x) fitted to
                 // some reasonable data points
                noTicks = 0.3 * Math.sqrt(canvasWidth);
            else
                noTicks = 0.3 * Math.sqrt(canvasHeight);
            
            var delta = (axis.max - axis.min) / noTicks,
                size, generator, unit, formatter, i, magn, norm;

            if (axisOptions.mode == "time") {
                // pretty handling of time
                
                // map of app. size of time units in milliseconds
                var timeUnitSize = {
                    "second": 1000,
                    "minute": 60 * 1000,
                    "hour": 60 * 60 * 1000,
                    "day": 24 * 60 * 60 * 1000,
                    "month": 30 * 24 * 60 * 60 * 1000,
                    "year": 365.2425 * 24 * 60 * 60 * 1000
                };


                // the allowed tick sizes, after 1 year we use
                // an integer algorithm
                var spec = [
                    [1, "second"], [2, "second"], [5, "second"], [10, "second"],
                    [30, "second"], 
                    [1, "minute"], [2, "minute"], [5, "minute"], [10, "minute"],
                    [30, "minute"], 
                    [1, "hour"], [2, "hour"], [4, "hour"],
                    [8, "hour"], [12, "hour"],
                    [1, "day"], [2, "day"], [3, "day"],
                    [0.25, "month"], [0.5, "month"], [1, "month"],
                    [2, "month"], [3, "month"], [6, "month"],
                    [1, "year"]
                ];

                var minSize = 0;
                if (axisOptions.minTickSize != null) {
                    if (typeof axisOptions.tickSize == "number")
                        minSize = axisOptions.tickSize;
                    else
                        minSize = axisOptions.minTickSize[0] * timeUnitSize[axisOptions.minTickSize[1]];
                }

                for (i = 0; i < spec.length - 1; ++i)
                    if (delta < (spec[i][0] * timeUnitSize[spec[i][1]]
                                 + spec[i + 1][0] * timeUnitSize[spec[i + 1][1]]) / 2
                       && spec[i][0] * timeUnitSize[spec[i][1]] >= minSize)
                        break;
                size = spec[i][0];
                unit = spec[i][1];
                
                // special-case the possibility of several years
                if (unit == "year") {
                    magn = Math.pow(10, Math.floor(Math.log(delta / timeUnitSize.year) / Math.LN10));
                    norm = (delta / timeUnitSize.year) / magn;
                    if (norm < 1.5)
                        size = 1;
                    else if (norm < 3)
                        size = 2;
                    else if (norm < 7.5)
                        size = 5;
                    else
                        size = 10;

                    size *= magn;
                }

                if (axisOptions.tickSize) {
                    size = axisOptions.tickSize[0];
                    unit = axisOptions.tickSize[1];
                }
                
                generator = function(axis) {
                    var ticks = [],
                        tickSize = axis.tickSize[0], unit = axis.tickSize[1],
                        d = new Date(axis.min);
                    
                    var step = tickSize * timeUnitSize[unit];

                    if (unit == "second")
                        d.setUTCSeconds(floorInBase(d.getUTCSeconds(), tickSize));
                    if (unit == "minute")
                        d.setUTCMinutes(floorInBase(d.getUTCMinutes(), tickSize));
                    if (unit == "hour")
                        d.setUTCHours(floorInBase(d.getUTCHours(), tickSize));
                    if (unit == "month")
                        d.setUTCMonth(floorInBase(d.getUTCMonth(), tickSize));
                    if (unit == "year")
                        d.setUTCFullYear(floorInBase(d.getUTCFullYear(), tickSize));
                    
                    // reset smaller components
                    d.setUTCMilliseconds(0);
                    if (step >= timeUnitSize.minute)
                        d.setUTCSeconds(0);
                    if (step >= timeUnitSize.hour)
                        d.setUTCMinutes(0);
                    if (step >= timeUnitSize.day)
                        d.setUTCHours(0);
                    if (step >= timeUnitSize.day * 4)
                        d.setUTCDate(1);
                    if (step >= timeUnitSize.year)
                        d.setUTCMonth(0);


                    var carry = 0, v = Number.NaN, prev;
                    do {
                        prev = v;
                        v = d.getTime();
                        ticks.push({ v: v, label: axis.tickFormatter(v, axis) });
                        if (unit == "month") {
                            if (tickSize < 1) {
                                // a bit complicated - we'll divide the month
                                // up but we need to take care of fractions
                                // so we don't end up in the middle of a day
                                d.setUTCDate(1);
                                var start = d.getTime();
                                d.setUTCMonth(d.getUTCMonth() + 1);
                                var end = d.getTime();
                                d.setTime(v + carry * timeUnitSize.hour + (end - start) * tickSize);
                                carry = d.getUTCHours();
                                d.setUTCHours(0);
                            }
                            else
                                d.setUTCMonth(d.getUTCMonth() + tickSize);
                        }
                        else if (unit == "year") {
                            d.setUTCFullYear(d.getUTCFullYear() + tickSize);
                        }
                        else
                            d.setTime(v + step);
                    } while (v < axis.max && v != prev);

                    return ticks;
                };

                formatter = function (v, axis) {
                    var d = new Date(v);

                    // first check global format
                    if (axisOptions.timeformat != null)
                        return $.plot.formatDate(d, axisOptions.timeformat, axisOptions.monthNames);
                    
                    var t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]];
                    var span = axis.max - axis.min;
                    var suffix = (axisOptions.twelveHourClock) ? " %p" : "";
                    
                    if (t < timeUnitSize.minute)
                        fmt = "%h:%M:%S" + suffix;
                    else if (t < timeUnitSize.day) {
                        if (span < 2 * timeUnitSize.day)
                            fmt = "%h:%M" + suffix;
                        else
                            fmt = "%b %d %h:%M" + suffix;
                    }
                    else if (t < timeUnitSize.month)
                        fmt = "%b %d";
                    else if (t < timeUnitSize.year) {
                        if (span < timeUnitSize.year)
                            fmt = "%b";
                        else
                            fmt = "%b %y";
                    }
                    else
                        fmt = "%y";
                    
                    return $.plot.formatDate(d, fmt, axisOptions.monthNames);
                };
            }
            else {
                // pretty rounding of base-10 numbers
                var maxDec = axisOptions.tickDecimals;
                var dec = -Math.floor(Math.log(delta) / Math.LN10);
                if (maxDec != null && dec > maxDec)
                    dec = maxDec;

                magn = Math.pow(10, -dec);
                norm = delta / magn; // norm is between 1.0 and 10.0
                
                if (norm < 1.5)
                    size = 1;
                else if (norm < 3) {
                    size = 2;
                    // special case for 2.5, requires an extra decimal
                    if (norm > 2.25 && (maxDec == null || dec + 1 <= maxDec)) {
                        size = 2.5;
                        ++dec;
                    }
                }
                else if (norm < 7.5)
                    size = 5;
                else
                    size = 10;

                size *= magn;
                
                if (axisOptions.minTickSize != null && size < axisOptions.minTickSize)
                    size = axisOptions.minTickSize;

                if (axisOptions.tickSize != null)
                    size = axisOptions.tickSize;

                axis.tickDecimals = Math.max(0, (maxDec != null) ? maxDec : dec);

                generator = function (axis) {
                    var ticks = [];

                    // spew out all possible ticks
                    var start = floorInBase(axis.min, axis.tickSize),
                        i = 0, v = Number.NaN, prev;
                    do {
                        prev = v;
                        v = start + i * axis.tickSize;
                        ticks.push({ v: v, label: axis.tickFormatter(v, axis) });
                        ++i;
                    } while (v < axis.max && v != prev);
                    return ticks;
                };

                formatter = function (v, axis) {
                    return v.toFixed(axis.tickDecimals);
                };
            }

            axis.tickSize = unit ? [size, unit] : size;
            axis.tickGenerator = generator;
            if ($.isFunction(axisOptions.tickFormatter))
                axis.tickFormatter = function (v, axis) { return "" + axisOptions.tickFormatter(v, axis); };
            else
                axis.tickFormatter = formatter;
        }
        
        function setTicks(axis, axisOptions) {
            axis.ticks = [];

            if (!axis.used)
                return;
            
            if (axisOptions.ticks == null)
                axis.ticks = axis.tickGenerator(axis);
            else if (typeof axisOptions.ticks == "number") {
                if (axisOptions.ticks > 0)
                    axis.ticks = axis.tickGenerator(axis);
            }
            else if (axisOptions.ticks) {
                var ticks = axisOptions.ticks;

                if ($.isFunction(ticks))
                    // generate the ticks
                    ticks = ticks({ min: axis.min, max: axis.max });
                
                // clean up the user-supplied ticks, copy them over
                var i, v;
                for (i = 0; i < ticks.length; ++i) {
                    var label = null;
                    var t = ticks[i];
                    if (typeof t == "object") {
                        v = t[0];
                        if (t.length > 1)
                            label = t[1];
                    }
                    else
                        v = t;
                    if (label == null)
                        label = axis.tickFormatter(v, axis);
                    axis.ticks[i] = { v: v, label: label };
                }
            }

            if (axisOptions.autoscaleMargin != null && axis.ticks.length > 0) {
                // snap to ticks
                if (axisOptions.min == null)
                    axis.min = Math.min(axis.min, axis.ticks[0].v);
                if (axisOptions.max == null && axis.ticks.length > 1)
                    axis.max = Math.max(axis.max, axis.ticks[axis.ticks.length - 1].v);
            }
        }
      
        function draw() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            var grid = options.grid;
            
            if (grid.show && !grid.aboveData)
                drawGrid();

            for (var i = 0; i < series.length; ++i)
                drawSeries(series[i]);

            executeHooks(hooks.draw, [ctx]);
            
            if (grid.show && grid.aboveData)
                drawGrid();
        }

        function extractRange(ranges, coord) {
            var firstAxis = coord + "axis",
                secondaryAxis = coord + "2axis",
                axis, from, to, reverse;

            if (ranges[firstAxis]) {
                axis = axes[firstAxis];
                from = ranges[firstAxis].from;
                to = ranges[firstAxis].to;
            }
            else if (ranges[secondaryAxis]) {
                axis = axes[secondaryAxis];
                from = ranges[secondaryAxis].from;
                to = ranges[secondaryAxis].to;
            }
            else {
                // backwards-compat stuff - to be removed in future
                axis = axes[firstAxis];
                from = ranges[coord + "1"];
                to = ranges[coord + "2"];
            }

            // auto-reverse as an added bonus
            if (from != null && to != null && from > to)
                return { from: to, to: from, axis: axis };
            
            return { from: from, to: to, axis: axis };
        }
        
        function drawGrid() {
            var i;
            
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            // draw background, if any
            if (options.grid.backgroundColor) {
                ctx.fillStyle = getColorOrGradient(options.grid.backgroundColor, plotHeight, 0, "rgba(255, 255, 255, 0)");
                ctx.fillRect(0, 0, plotWidth, plotHeight);
            }

            // draw markings
            var markings = options.grid.markings;
            if (markings) {
                if ($.isFunction(markings))
                    // xmin etc. are backwards-compatible, to be removed in future
                    markings = markings({ xmin: axes.xaxis.min, xmax: axes.xaxis.max, ymin: axes.yaxis.min, ymax: axes.yaxis.max, xaxis: axes.xaxis, yaxis: axes.yaxis, x2axis: axes.x2axis, y2axis: axes.y2axis });

                for (i = 0; i < markings.length; ++i) {
                    var m = markings[i],
                        xrange = extractRange(m, "x"),
                        yrange = extractRange(m, "y");

                    // fill in missing
                    if (xrange.from == null)
                        xrange.from = xrange.axis.min;
                    if (xrange.to == null)
                        xrange.to = xrange.axis.max;
                    if (yrange.from == null)
                        yrange.from = yrange.axis.min;
                    if (yrange.to == null)
                        yrange.to = yrange.axis.max;

                    // clip
                    if (xrange.to < xrange.axis.min || xrange.from > xrange.axis.max ||
                        yrange.to < yrange.axis.min || yrange.from > yrange.axis.max)
                        continue;

                    xrange.from = Math.max(xrange.from, xrange.axis.min);
                    xrange.to = Math.min(xrange.to, xrange.axis.max);
                    yrange.from = Math.max(yrange.from, yrange.axis.min);
                    yrange.to = Math.min(yrange.to, yrange.axis.max);

                    if (xrange.from == xrange.to && yrange.from == yrange.to)
                        continue;

                    // then draw
                    xrange.from = xrange.axis.p2c(xrange.from);
                    xrange.to = xrange.axis.p2c(xrange.to);
                    yrange.from = yrange.axis.p2c(yrange.from);
                    yrange.to = yrange.axis.p2c(yrange.to);
                    
                    if (xrange.from == xrange.to || yrange.from == yrange.to) {
                        // draw line
                        ctx.beginPath();
                        ctx.strokeStyle = m.color || options.grid.markingsColor;
                        ctx.lineWidth = m.lineWidth || options.grid.markingsLineWidth;
                        //ctx.moveTo(Math.floor(xrange.from), yrange.from);
                        //ctx.lineTo(Math.floor(xrange.to), yrange.to);
                        ctx.moveTo(xrange.from, yrange.from);
                        ctx.lineTo(xrange.to, yrange.to);
                        ctx.stroke();
                    }
                    else {
                        // fill area
                        ctx.fillStyle = m.color || options.grid.markingsColor;
                        ctx.fillRect(xrange.from, yrange.to,
                                     xrange.to - xrange.from,
                                     yrange.from - yrange.to);
                    }
                }
            }
            
            // draw the inner grid
            ctx.lineWidth = 1;
            ctx.strokeStyle = options.grid.tickColor;
            ctx.beginPath();
            var v, axis = axes.xaxis;
            for (i = 0; i < axis.ticks.length; ++i) {
                v = axis.ticks[i].v;
                if (v <= axis.min || v >= axes.xaxis.max)
                    continue;   // skip those lying on the axes

                ctx.moveTo(Math.floor(axis.p2c(v)) + ctx.lineWidth/2, 0);
                ctx.lineTo(Math.floor(axis.p2c(v)) + ctx.lineWidth/2, plotHeight);
            }

            axis = axes.yaxis;
            for (i = 0; i < axis.ticks.length; ++i) {
                v = axis.ticks[i].v;
                if (v <= axis.min || v >= axis.max)
                    continue;

                ctx.moveTo(0, Math.floor(axis.p2c(v)) + ctx.lineWidth/2);
                ctx.lineTo(plotWidth, Math.floor(axis.p2c(v)) + ctx.lineWidth/2);
            }

            axis = axes.x2axis;
            for (i = 0; i < axis.ticks.length; ++i) {
                v = axis.ticks[i].v;
                if (v <= axis.min || v >= axis.max)
                    continue;
    
                ctx.moveTo(Math.floor(axis.p2c(v)) + ctx.lineWidth/2, -5);
                ctx.lineTo(Math.floor(axis.p2c(v)) + ctx.lineWidth/2, 5);
            }

            axis = axes.y2axis;
            for (i = 0; i < axis.ticks.length; ++i) {
                v = axis.ticks[i].v;
                if (v <= axis.min || v >= axis.max)
                    continue;

                ctx.moveTo(plotWidth-5, Math.floor(axis.p2c(v)) + ctx.lineWidth/2);
                ctx.lineTo(plotWidth+5, Math.floor(axis.p2c(v)) + ctx.lineWidth/2);
            }
            
            ctx.stroke();
            
            if (options.grid.borderWidth) {
                // draw border
                var bw = options.grid.borderWidth;
                ctx.lineWidth = bw;
                ctx.strokeStyle = options.grid.borderColor;
                ctx.strokeRect(-bw/2, -bw/2, plotWidth + bw, plotHeight + bw);
            }

            ctx.restore();
        }

        function insertLabels() {
            placeholder.find(".tickLabels").remove();
            
            var html = ['<div class="tickLabels" style="font-size:smaller;color:' + options.grid.color + '">'];

            function addLabels(axis, labelGenerator) {
                for (var i = 0; i < axis.ticks.length; ++i) {
                    var tick = axis.ticks[i];
                    if (!tick.label || tick.v < axis.min || tick.v > axis.max)
                        continue;
                    html.push(labelGenerator(tick, axis));
                }
            }

            var margin = options.grid.labelMargin + options.grid.borderWidth;
            
            addLabels(axes.xaxis, function (tick, axis) {
                return '<div style="position:absolute;top:' + (plotOffset.top + plotHeight + margin) + 'px;left:' + Math.round(plotOffset.left + axis.p2c(tick.v) - axis.labelWidth/2) + 'px;width:' + axis.labelWidth + 'px;text-align:center" class="tickLabel">' + tick.label + "</div>";
            });
            
            
            addLabels(axes.yaxis, function (tick, axis) {
                return '<div style="position:absolute;top:' + Math.round(plotOffset.top + axis.p2c(tick.v) - axis.labelHeight/2) + 'px;right:' + (plotOffset.right + plotWidth + margin) + 'px;width:' + axis.labelWidth + 'px;text-align:right" class="tickLabel">' + tick.label + "</div>";
            });
            
            addLabels(axes.x2axis, function (tick, axis) {
                return '<div style="position:absolute;bottom:' + (plotOffset.bottom + plotHeight + margin) + 'px;left:' + Math.round(plotOffset.left + axis.p2c(tick.v) - axis.labelWidth/2) + 'px;width:' + axis.labelWidth + 'px;text-align:center" class="tickLabel">' + tick.label + "</div>";
            });
            
            addLabels(axes.y2axis, function (tick, axis) {
                return '<div style="position:absolute;top:' + Math.round(plotOffset.top + axis.p2c(tick.v) - axis.labelHeight/2) + 'px;left:' + (plotOffset.left + plotWidth + margin) +'px;width:' + axis.labelWidth + 'px;text-align:left" class="tickLabel">' + tick.label + "</div>";
            });

            html.push('</div>');
            
            placeholder.append(html.join(""));
        }

        function drawSeries(series) {
            if (series.lines.show)
                drawSeriesLines(series);
            if (series.bars.show)
                drawSeriesBars(series);
            if (series.points.show)
                drawSeriesPoints(series);
        }
        
        function drawSeriesLines(series) {
            function plotLine(datapoints, xoffset, yoffset, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    prevx = null, prevy = null;
                
                ctx.beginPath();
                for (var i = ps; i < points.length; i += ps) {
                    var x1 = points[i - ps], y1 = points[i - ps + 1],
                        x2 = points[i], y2 = points[i + 1];
                    
                    if (x1 == null || x2 == null)
                        continue;

                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min) {
                        if (y2 < axisy.min)
                            continue;   // line segment is outside
                        // compute new intersection point
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min) {
                        if (y1 < axisy.min)
                            continue;
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max) {
                        if (y2 > axisy.max)
                            continue;
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max) {
                        if (y1 > axisy.max)
                            continue;
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }

                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (x1 != prevx || y1 != prevy)
                        ctx.moveTo(axisx.p2c(x1) + xoffset, axisy.p2c(y1) + yoffset);
                    
                    prevx = x2;
                    prevy = y2;
                    ctx.lineTo(axisx.p2c(x2) + xoffset, axisy.p2c(y2) + yoffset);
                }
                ctx.stroke();
            }

            function plotLineArea(datapoints, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    bottom = Math.min(Math.max(0, axisy.min), axisy.max),
                    top, lastX = 0, areaOpen = false;
                
                for (var i = ps; i < points.length; i += ps) {
                    var x1 = points[i - ps], y1 = points[i - ps + 1],
                        x2 = points[i], y2 = points[i + 1];
                    
                    if (areaOpen && x1 != null && x2 == null) {
                        // close area
                        ctx.lineTo(axisx.p2c(lastX), axisy.p2c(bottom));
                        ctx.fill();
                        areaOpen = false;
                        continue;
                    }

                    if (x1 == null || x2 == null)
                        continue;

                    // clip x values
                    
                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (!areaOpen) {
                        // open area
                        ctx.beginPath();
                        ctx.moveTo(axisx.p2c(x1), axisy.p2c(bottom));
                        areaOpen = true;
                    }
                    
                    // now first check the case where both is outside
                    if (y1 >= axisy.max && y2 >= axisy.max) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.max));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.max));
                        lastX = x2;
                        continue;
                    }
                    else if (y1 <= axisy.min && y2 <= axisy.min) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.min));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.min));
                        lastX = x2;
                        continue;
                    }
                    
                    // else it's a bit more complicated, there might
                    // be two rectangles and two triangles we need to fill
                    // in; to find these keep track of the current x values
                    var x1old = x1, x2old = x2;

                    // and clip the y values, without shortcutting
                    
                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min && y2 >= axisy.min) {
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min && y1 >= axisy.min) {
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max && y2 <= axisy.max) {
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max && y1 <= axisy.max) {
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }


                    // if the x value was changed we got a rectangle
                    // to fill
                    if (x1 != x1old) {
                        if (y1 <= axisy.min)
                            top = axisy.min;
                        else
                            top = axisy.max;
                        
                        ctx.lineTo(axisx.p2c(x1old), axisy.p2c(top));
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(top));
                    }
                    
                    // fill the triangles
                    ctx.lineTo(axisx.p2c(x1), axisy.p2c(y1));
                    ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));

                    // fill the other rectangle if it's there
                    if (x2 != x2old) {
                        if (y2 <= axisy.min)
                            top = axisy.min;
                        else
                            top = axisy.max;
                        
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(top));
                        ctx.lineTo(axisx.p2c(x2old), axisy.p2c(top));
                    }

                    lastX = Math.max(x2, x2old);
                }

                if (areaOpen) {
                    ctx.lineTo(axisx.p2c(lastX), axisy.p2c(bottom));
                    ctx.fill();
                }
            }
            
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            ctx.lineJoin = "round";

            var lw = series.lines.lineWidth,
                sw = series.shadowSize;
            // FIXME: consider another form of shadow when filling is turned on
            if (lw > 0 && sw > 0) {
                // draw shadow as a thick and thin line with transparency
                ctx.lineWidth = sw;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                // position shadow at angle from the mid of line
                var angle = Math.PI/18;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/2), Math.cos(angle) * (lw/2 + sw/2), series.xaxis, series.yaxis);
                ctx.lineWidth = sw/2;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/4), Math.cos(angle) * (lw/2 + sw/4), series.xaxis, series.yaxis);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            var fillStyle = getFillStyle(series.lines, series.color, 0, plotHeight);
            if (fillStyle) {
                ctx.fillStyle = fillStyle;
                plotLineArea(series.datapoints, series.xaxis, series.yaxis);
            }

            if (lw > 0)
                plotLine(series.datapoints, 0, 0, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function drawSeriesPoints(series) {
            function plotPoints(datapoints, radius, fillStyle, offset, circumference, axisx, axisy) {
                var points = datapoints.points, ps = datapoints.pointsize;
                
                for (var i = 0; i < points.length; i += ps) {
                    var x = points[i], y = points[i + 1];
                    if (x == null || x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                        continue;
                    
                    ctx.beginPath();
                    ctx.arc(axisx.p2c(x), axisy.p2c(y) + offset, radius, 0, circumference, false);
                    if (fillStyle) {
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    ctx.stroke();
                }
            }
            
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            var lw = series.lines.lineWidth,
                sw = series.shadowSize,
                radius = series.points.radius;
            if (lw > 0 && sw > 0) {
                // draw shadow in two steps
                var w = sw / 2;
                ctx.lineWidth = w;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                plotPoints(series.datapoints, radius, null, w + w/2, Math.PI,
                           series.xaxis, series.yaxis);

                ctx.strokeStyle = "rgba(0,0,0,0.2)";
                plotPoints(series.datapoints, radius, null, w/2, Math.PI,
                           series.xaxis, series.yaxis);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            plotPoints(series.datapoints, radius,
                       getFillStyle(series.points, series.color), 0, 2 * Math.PI,
                       series.xaxis, series.yaxis);
            ctx.restore();
        }

        function drawBar(x, y, b, barLeft, barRight, offset, fillStyleCallback, axisx, axisy, c, horizontal) {
            var left, right, bottom, top,
                drawLeft, drawRight, drawTop, drawBottom,
                tmp;

            if (horizontal) {
                drawBottom = drawRight = drawTop = true;
                drawLeft = false;
                left = b;
                right = x;
                top = y + barLeft;
                bottom = y + barRight;

                // account for negative bars
                if (right < left) {
                    tmp = right;
                    right = left;
                    left = tmp;
                    drawLeft = true;
                    drawRight = false;
                }
            }
            else {
                drawLeft = drawRight = drawTop = true;
                drawBottom = false;
                left = x + barLeft;
                right = x + barRight;
                bottom = b;
                top = y;

                // account for negative bars
                if (top < bottom) {
                    tmp = top;
                    top = bottom;
                    bottom = tmp;
                    drawBottom = true;
                    drawTop = false;
                }
            }
           
            // clip
            if (right < axisx.min || left > axisx.max ||
                top < axisy.min || bottom > axisy.max)
                return;
            
            if (left < axisx.min) {
                left = axisx.min;
                drawLeft = false;
            }

            if (right > axisx.max) {
                right = axisx.max;
                drawRight = false;
            }

            if (bottom < axisy.min) {
                bottom = axisy.min;
                drawBottom = false;
            }
            
            if (top > axisy.max) {
                top = axisy.max;
                drawTop = false;
            }

            left = axisx.p2c(left);
            bottom = axisy.p2c(bottom);
            right = axisx.p2c(right);
            top = axisy.p2c(top);
            
            // fill the bar
            if (fillStyleCallback) {
                c.beginPath();
                c.moveTo(left, bottom);
                c.lineTo(left, top);
                c.lineTo(right, top);
                c.lineTo(right, bottom);
                c.fillStyle = fillStyleCallback(bottom, top);
                c.fill();
            }

            // draw outline
            if (drawLeft || drawRight || drawTop || drawBottom) {
                c.beginPath();

                // FIXME: inline moveTo is buggy with excanvas
                c.moveTo(left, bottom + offset);
                if (drawLeft)
                    c.lineTo(left, top + offset);
                else
                    c.moveTo(left, top + offset);
                if (drawTop)
                    c.lineTo(right, top + offset);
                else
                    c.moveTo(right, top + offset);
                if (drawRight)
                    c.lineTo(right, bottom + offset);
                else
                    c.moveTo(right, bottom + offset);
                if (drawBottom)
                    c.lineTo(left, bottom + offset);
                else
                    c.moveTo(left, bottom + offset);
                c.stroke();
            }
        }
        
        function drawSeriesBars(series) {
            function plotBars(datapoints, barLeft, barRight, offset, fillStyleCallback, axisx, axisy) {
                var points = datapoints.points, ps = datapoints.pointsize;
                
                for (var i = 0; i < points.length; i += ps) {
                    if (points[i] == null)
                        continue;
                    drawBar(points[i], points[i + 1], points[i + 2], barLeft, barRight, offset, fillStyleCallback, axisx, axisy, ctx, series.bars.horizontal);
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            // FIXME: figure out a way to add shadows (for instance along the right edge)
            ctx.lineWidth = series.bars.lineWidth;
            ctx.strokeStyle = series.color;
            var barLeft = series.bars.align == "left" ? 0 : -series.bars.barWidth/2;
            var fillStyleCallback = series.bars.fill ? function (bottom, top) { return getFillStyle(series.bars, series.color, bottom, top); } : null;
            plotBars(series.datapoints, barLeft, barLeft + series.bars.barWidth, 0, fillStyleCallback, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function getFillStyle(filloptions, seriesColor, bottom, top) {
            var fill = filloptions.fill;
            if (!fill)
                return null;

            if (filloptions.fillColor)
                return getColorOrGradient(filloptions.fillColor, bottom, top, seriesColor);
            
            var c = $.color.parse(seriesColor);
            c.a = typeof fill == "number" ? fill : 0.4;
            c.normalize();
            return c.toString();
        }
        
        function insertLegend() {
            placeholder.find(".legend").remove();

            if (!options.legend.show)
                return;
            
            var fragments = [], rowStarted = false,
                lf = options.legend.labelFormatter, s, label;
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                label = s.label;
                if (!label)
                    continue;
                
                if (i % options.legend.noColumns == 0) {
                    if (rowStarted)
                        fragments.push('</tr>');
                    fragments.push('<tr>');
                    rowStarted = true;
                }

                if (lf)
                    label = lf(label, s);
                
                fragments.push(
                    '<td class="legendColorBox"><div style="border:1px solid ' + options.legend.labelBoxBorderColor + ';padding:1px"><div style="width:4px;height:0;border:5px solid ' + s.color + ';overflow:hidden"></div></div></td>' +
                    '<td class="legendLabel">' + label + '</td>');
            }
            if (rowStarted)
                fragments.push('</tr>');
            
            if (fragments.length == 0)
                return;

            var table = '<table style="font-size:smaller;color:' + options.grid.color + '">' + fragments.join("") + '</table>';
            if (options.legend.container != null)
                $(options.legend.container).html(table);
            else {
                var pos = "",
                    p = options.legend.position,
                    m = options.legend.margin;
                if (m[0] == null)
                    m = [m, m];
                if (p.charAt(0) == "n")
                    pos += 'top:' + (m[1] + plotOffset.top) + 'px;';
                else if (p.charAt(0) == "s")
                    pos += 'bottom:' + (m[1] + plotOffset.bottom) + 'px;';
                if (p.charAt(1) == "e")
                    pos += 'right:' + (m[0] + plotOffset.right) + 'px;';
                else if (p.charAt(1) == "w")
                    pos += 'left:' + (m[0] + plotOffset.left) + 'px;';
                var legend = $('<div class="legend">' + table.replace('style="', 'style="position:absolute;' + pos +';') + '</div>').appendTo(placeholder);
                if (options.legend.backgroundOpacity != 0.0) {
                    // put in the transparent background
                    // separately to avoid blended labels and
                    // label boxes
                    var c = options.legend.backgroundColor;
                    if (c == null) {
                        c = options.grid.backgroundColor;
                        if (c && typeof c == "string")
                            c = $.color.parse(c);
                        else
                            c = $.color.extract(legend, 'background-color');
                        c.a = 1;
                        c = c.toString();
                    }
                    var div = legend.children();
                    $('<div style="position:absolute;width:' + div.width() + 'px;height:' + div.height() + 'px;' + pos +'background-color:' + c + ';"> </div>').prependTo(legend).css('opacity', options.legend.backgroundOpacity);
                }
            }
        }


        // interactive features
        
        var highlights = [],
            redrawTimeout = null;
        
        // returns the data item the mouse is over, or null if none is found
        function findNearbyItem(mouseX, mouseY, seriesFilter) {
            var maxDistance = options.grid.mouseActiveRadius,
                smallestDistance = maxDistance * maxDistance + 1,
                item = null, foundPoint = false, i, j;

            for (i = 0; i < series.length; ++i) {
                if (!seriesFilter(series[i]))
                    continue;
                
                var s = series[i],
                    axisx = s.xaxis,
                    axisy = s.yaxis,
                    points = s.datapoints.points,
                    ps = s.datapoints.pointsize,
                    mx = axisx.c2p(mouseX), // precompute some stuff to make the loop faster
                    my = axisy.c2p(mouseY),
                    maxx = maxDistance / axisx.scale,
                    maxy = maxDistance / axisy.scale;

                if (s.lines.show || s.points.show) {
                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1];
                        if (x == null)
                            continue;
                        
                        // For points and lines, the cursor must be within a
                        // certain distance to the data point
                        if (x - mx > maxx || x - mx < -maxx ||
                            y - my > maxy || y - my < -maxy)
                            continue;

                        // We have to calculate distances in pixels, not in
                        // data units, because the scales of the axes may be different
                        var dx = Math.abs(axisx.p2c(x) - mouseX),
                            dy = Math.abs(axisy.p2c(y) - mouseY),
                            dist = dx * dx + dy * dy; // we save the sqrt

                        // use <= to ensure last point takes precedence
                        // (last generally means on top of)
                        if (dist <= smallestDistance) {
                            smallestDistance = dist;
                            item = [i, j / ps];
                        }
                    }
                }
                    
                if (s.bars.show && !item) { // no other point can be nearby
                    var barLeft = s.bars.align == "left" ? 0 : -s.bars.barWidth/2,
                        barRight = barLeft + s.bars.barWidth;
                    
                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1], b = points[j + 2];
                        if (x == null)
                            continue;
  
                        // for a bar graph, the cursor must be inside the bar
                        if (series[i].bars.horizontal ? 
                            (mx <= Math.max(b, x) && mx >= Math.min(b, x) && 
                             my >= y + barLeft && my <= y + barRight) :
                            (mx >= x + barLeft && mx <= x + barRight &&
                             my >= Math.min(b, y) && my <= Math.max(b, y)))
                                item = [i, j / ps];
                    }
                }
            }

            if (item) {
                i = item[0];
                j = item[1];
                ps = series[i].datapoints.pointsize;
                
                return { datapoint: series[i].datapoints.points.slice(j * ps, (j + 1) * ps),
                         dataIndex: j,
                         series: series[i],
                         seriesIndex: i };
            }
            
            return null;
        }

        function onMouseMove(e) {
            if (options.grid.hoverable)
                triggerClickHoverEvent("plothover", e,
                                       function (s) { return s["hoverable"] != false; });
        }
        
        function onClick(e) {
            triggerClickHoverEvent("plotclick", e,
                                   function (s) { return s["clickable"] != false; });
        }

        // trigger click or hover event (they send the same parameters
        // so we share their code)
        function triggerClickHoverEvent(eventname, event, seriesFilter) {
            var offset = eventHolder.offset(),
                pos = { pageX: event.pageX, pageY: event.pageY },
                canvasX = event.pageX - offset.left - plotOffset.left,
                canvasY = event.pageY - offset.top - plotOffset.top;

            if (axes.xaxis.used)
                pos.x = axes.xaxis.c2p(canvasX);
            if (axes.yaxis.used)
                pos.y = axes.yaxis.c2p(canvasY);
            if (axes.x2axis.used)
                pos.x2 = axes.x2axis.c2p(canvasX);
            if (axes.y2axis.used)
                pos.y2 = axes.y2axis.c2p(canvasY);

            var item = findNearbyItem(canvasX, canvasY, seriesFilter);

            if (item) {
                // fill in mouse pos for any listeners out there
                item.pageX = parseInt(item.series.xaxis.p2c(item.datapoint[0]) + offset.left + plotOffset.left);
                item.pageY = parseInt(item.series.yaxis.p2c(item.datapoint[1]) + offset.top + plotOffset.top);
            }

            if (options.grid.autoHighlight) {
                // clear auto-highlights
                for (var i = 0; i < highlights.length; ++i) {
                    var h = highlights[i];
                    if (h.auto == eventname &&
                        !(item && h.series == item.series && h.point == item.datapoint))
                        unhighlight(h.series, h.point);
                }
                
                if (item)
                    highlight(item.series, item.datapoint, eventname);
            }
            
            placeholder.trigger(eventname, [ pos, item ]);
        }

        function triggerRedrawOverlay() {
            if (!redrawTimeout)
                redrawTimeout = setTimeout(drawOverlay, 30);
        }

        function drawOverlay() {
            redrawTimeout = null;

            // draw highlights
            octx.save();
            octx.clearRect(0, 0, canvasWidth, canvasHeight);
            octx.translate(plotOffset.left, plotOffset.top);
            
            var i, hi;
            for (i = 0; i < highlights.length; ++i) {
                hi = highlights[i];

                if (hi.series.bars.show)
                    drawBarHighlight(hi.series, hi.point);
                else
                    drawPointHighlight(hi.series, hi.point);
            }
            octx.restore();
            
            executeHooks(hooks.drawOverlay, [octx]);
        }
        
        function highlight(s, point, auto) {
            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number")
                point = s.data[point];

            var i = indexOfHighlight(s, point);
            if (i == -1) {
                highlights.push({ series: s, point: point, auto: auto });

                triggerRedrawOverlay();
            }
            else if (!auto)
                highlights[i].auto = false;
        }
            
        function unhighlight(s, point) {
            if (s == null && point == null) {
                highlights = [];
                triggerRedrawOverlay();
            }
            
            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number")
                point = s.data[point];

            var i = indexOfHighlight(s, point);
            if (i != -1) {
                highlights.splice(i, 1);

                triggerRedrawOverlay();
            }
        }
        
        function indexOfHighlight(s, p) {
            for (var i = 0; i < highlights.length; ++i) {
                var h = highlights[i];
                if (h.series == s && h.point[0] == p[0]
                    && h.point[1] == p[1])
                    return i;
            }
            return -1;
        }
        
        function drawPointHighlight(series, point) {
            var x = point[0], y = point[1],
                axisx = series.xaxis, axisy = series.yaxis;
            
            if (x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                return;
            
            var pointRadius = series.points.radius + series.points.lineWidth / 2;
            octx.lineWidth = pointRadius;
            octx.strokeStyle = $.color.parse(series.color).scale('a', 0.5).toString();
            var radius = 1.5 * pointRadius;
            octx.beginPath();
            octx.arc(axisx.p2c(x), axisy.p2c(y), radius, 0, 2 * Math.PI, false);
            octx.stroke();
        }

        function drawBarHighlight(series, point) {
            octx.lineWidth = series.bars.lineWidth;
            octx.strokeStyle = $.color.parse(series.color).scale('a', 0.5).toString();
            var fillStyle = $.color.parse(series.color).scale('a', 0.5).toString();
            var barLeft = series.bars.align == "left" ? 0 : -series.bars.barWidth/2;
            drawBar(point[0], point[1], point[2] || 0, barLeft, barLeft + series.bars.barWidth,
                    0, function () { return fillStyle; }, series.xaxis, series.yaxis, octx, series.bars.horizontal);
        }

        function getColorOrGradient(spec, bottom, top, defaultColor) {
            if (typeof spec == "string")
                return spec;
            else {
                // assume this is a gradient spec; IE currently only
                // supports a simple vertical gradient properly, so that's
                // what we support too
                var gradient = ctx.createLinearGradient(0, top, 0, bottom);
                
                for (var i = 0, l = spec.colors.length; i < l; ++i) {
                    var c = spec.colors[i];
                    if (typeof c != "string") {
                        c = $.color.parse(defaultColor).scale('rgb', c.brightness);
                        c.a *= c.opacity;
                        c = c.toString();
                    }
                    gradient.addColorStop(i / (l - 1), c);
                }
                
                return gradient;
            }
        }
    }

    $.plot = function(placeholder, data, options) {
        var plot = new Plot($(placeholder), data, options, $.plot.plugins);
        /*var t0 = new Date();
        var t1 = new Date();
        var tstr = "time used (msecs): " + (t1.getTime() - t0.getTime())
        if (window.console)
            console.log(tstr);
        else
            alert(tstr);*/
        return plot;
    };

    $.plot.plugins = [];

    // returns a string with the date d formatted according to fmt
    $.plot.formatDate = function(d, fmt, monthNames) {
        var leftPad = function(n) {
            n = "" + n;
            return n.length == 1 ? "0" + n : n;
        };
        
        var r = [];
        var escape = false;
        var hours = d.getUTCHours();
        var isAM = hours < 12;
        if (monthNames == null)
            monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (fmt.search(/%p|%P/) != -1) {
            if (hours > 12) {
                hours = hours - 12;
            } else if (hours == 0) {
                hours = 12;
            }
        }
        for (var i = 0; i < fmt.length; ++i) {
            var c = fmt.charAt(i);
            
            if (escape) {
                switch (c) {
                case 'h': c = "" + hours; break;
                case 'H': c = leftPad(hours); break;
                case 'M': c = leftPad(d.getUTCMinutes()); break;
                case 'S': c = leftPad(d.getUTCSeconds()); break;
                case 'd': c = "" + d.getUTCDate(); break;
                case 'm': c = "" + (d.getUTCMonth() + 1); break;
                case 'y': c = "" + d.getUTCFullYear(); break;
                case 'b': c = "" + monthNames[d.getUTCMonth()]; break;
                case 'p': c = (isAM) ? ("" + "am") : ("" + "pm"); break;
                case 'P': c = (isAM) ? ("" + "AM") : ("" + "PM"); break;
                }
                r.push(c);
                escape = false;
            }
            else {
                if (c == "%")
                    escape = true;
                else
                    r.push(c);
            }
        }
        return r.join("");
    };
    
    // round to nearby lower multiple of base
    function floorInBase(n, base) {
        return base * Math.floor(n / base);
    }
    
})(jQuery);

 The MIT License

 Copyright (c) 2010 Daniel Park (http://metaweb.com, http://postmessage.freebaseapps.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 **/
var NO_JQUERY = {};
(function(window, $, undefined) {

     if (!("console" in window)) {
         var c = window.console = {};
         c.log = c.warn = c.error = c.debug = function(){};
     }

     if ($ === NO_JQUERY) {
         // jQuery is optional
         $ = {
             fn: {},
             extend: function() {
                 var a = arguments[0];
                 for (var i=1,len=arguments.length; i<len; i++) {
                     var b = arguments[i];
                     for (var prop in b) {
                         a[prop] = b[prop];
                     }
                 }
                 return a;
             }
         };
     }

     $.fn.pm = function() {
         console.log("usage: \nto send:    $.pm(options)\nto receive: $.pm.bind(type, fn, [origin])");
         return this;
     };

     // send postmessage
     $.pm = window.pm = function(options) {
         pm.send(options);
     };

     // bind postmessage handler
     $.pm.bind = window.pm.bind = function(type, fn, origin, hash) {
         pm.bind(type, fn, origin, hash);
     };

     // unbind postmessage handler
     $.pm.unbind = window.pm.unbind = function(type, fn) {
         pm.unbind(type, fn);
     };

     // default postmessage origin on bind
     $.pm.origin = window.pm.origin = null;

     // default postmessage polling if using location hash to pass postmessages
     $.pm.poll = window.pm.poll = 200;

     var pm = {

         send: function(options) {
             var o = $.extend({}, pm.defaults, options),
             target = o.target;
             if (!o.target) {
                 console.warn("postmessage target window required");
                 return;
             }
             if (!o.type) {
                 console.warn("postmessage type required");
                 return;
             }
             var msg = {data:o.data, type:o.type};
             if (o.success) {
                 msg.callback = pm._callback(o.success);
             }
             if (o.error) {
                 msg.errback = pm._callback(o.error);
             }
             if (("postMessage" in target) && !o.hash) {
                 pm._bind();
                 target.postMessage(JSON.stringify(msg), o.origin || '*');
             }
             else {
                 pm.hash._bind();
                 pm.hash.send(o, msg);
             }
         },

         bind: function(type, fn, origin, hash) {
             if (("postMessage" in window) && !hash) {
                 pm._bind();
             }
             else {
                 pm.hash._bind();
             }
             var l = pm.data("listeners.postmessage");
             if (!l) {
                 l = {};
                 pm.data("listeners.postmessage", l);
             }
             var fns = l[type];
             if (!fns) {
                 fns = [];
                 l[type] = fns;
             }
             fns.push({fn:fn, origin:origin || $.pm.origin});
         },

         unbind: function(type, fn) {
             var l = pm.data("listeners.postmessage");
             if (l) {
                 if (type) {
                     if (fn) {
                         // remove specific listener
                         var fns = l[type];
                         if (fns) {
                             var m = [];
                             for (var i=0,len=fns.length; i<len; i++) {
                                 var o = fns[i];
                                 if (o.fn !== fn) {
                                     m.push(o);
                                 }
                             }
                             l[type] = m;
                         }
                     }
                     else {
                         // remove all listeners by type
                         delete l[type];
                     }
                 }
                 else {
                     // unbind all listeners of all type
                     for (var i in l) {
                       delete l[i];
                     }
                 }
             }
         },

         data: function(k, v) {
             if (v === undefined) {
                 return pm._data[k];
             }
             pm._data[k] = v;
             return v;
         },

         _data: {},

         _CHARS: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),

         _random: function() {
             var r = [];
             for (var i=0; i<32; i++) {
                 r[i] = pm._CHARS[0 | Math.random() * 32];
             };
             return r.join("");
         },

         _callback: function(fn) {
             var cbs = pm.data("callbacks.postmessage");
             if (!cbs) {
                 cbs = {};
                 pm.data("callbacks.postmessage", cbs);
             }
             var r = pm._random();
             cbs[r] = fn;
             return r;
         },

         _bind: function() {
             // are we already listening to message events on this w?
             if (!pm.data("listening.postmessage")) {
                 if (window.addEventListener) {
                     window.addEventListener("message", pm._dispatch, false);
                 }
                 else if (window.attachEvent) {
                     window.attachEvent("onmessage", pm._dispatch);
                 }
                 pm.data("listening.postmessage", 1);
             }
         },

         _dispatch: function(e) {
             //console.log("$.pm.dispatch", e, this);
             try {
                 var msg = JSON.parse(e.data);
             }
             catch (ex) {
                 console.warn("postmessage data invalid json: ", ex);
                 return;
             }
             if (!msg.type) {
                 console.warn("postmessage message type required");
                 return;
             }
             var cbs = pm.data("callbacks.postmessage") || {},
             cb = cbs[msg.type];
             if (cb) {
                 cb(msg.data);
             }
             else {
                 var l = pm.data("listeners.postmessage") || {};
                 var fns = l[msg.type] || [];
                 for (var i=0,len=fns.length; i<len; i++) {
                     var o = fns[i];
                     if (o.origin && e.origin !== o.origin) {
                         console.warn("postmessage message origin mismatch", e.origin, o.origin);
                         if (msg.errback) {
                             // notify post message errback
                             var error = {
                                 message: "postmessage origin mismatch",
                                 origin: [e.origin, o.origin]
                             };
                             pm.send({target:e.source, data:error, type:msg.errback});
                         }
                         continue;
                     }
                     try {
                         var r = o.fn(msg.data);
                         if (msg.callback) {
                             pm.send({target:e.source, data:r, type:msg.callback});
                         }
                     }
                     catch (ex) {
                         if (msg.errback) {
                             // notify post message errback
                             pm.send({target:e.source, data:ex, type:msg.errback});
                         }
                     }
                 };
             }
         }
     };

     // location hash polling
     pm.hash = {

         send: function(options, msg) {
             //console.log("hash.send", target_window, options, msg);
             var target_window = options.target,
             target_url = options.url;
             if (!target_url) {
                 console.warn("postmessage target window url is required");
                 return;
             }
             target_url = pm.hash._url(target_url);
             var source_window,
             source_url = pm.hash._url(window.location.href);
             if (window == target_window.parent) {
                 source_window = "parent";
             }
             else {
                 try {
                     for (var i=0,len=parent.frames.length; i<len; i++) {
                         var f = parent.frames[i];
                         if (f == window) {
                             source_window = i;
                             break;
                         }
                     };
                 }
                 catch(ex) {
                     // Opera: security error trying to access parent.frames x-origin
                     // juse use window.name
                     source_window = window.name;
                 }
             }
             if (source_window == null) {
                 console.warn("postmessage windows must be direct parent/child windows and the child must be available through the parent window.frames list");
                 return;
             }
             var hashmessage = {
                 "x-requested-with": "postmessage",
                 source: {
                     name: source_window,
                     url: source_url
                 },
                 postmessage: msg
             };
             var hash_id = "#x-postmessage-id=" + pm._random();
             target_window.location = target_url + hash_id + encodeURIComponent(JSON.stringify(hashmessage));
         },

         _regex: /^\#x\-postmessage\-id\=(\w{32})/,

         _regex_len: "#x-postmessage-id=".length + 32,

         _bind: function() {
             // are we already listening to message events on this w?
             if (!pm.data("polling.postmessage")) {
                 setInterval(function() {
                                 var hash = "" + window.location.hash,
                                 m = pm.hash._regex.exec(hash);
                                 if (m) {
                                     var id = m[1];
                                     if (pm.hash._last !== id) {
                                         pm.hash._last = id;
                                         pm.hash._dispatch(hash.substring(pm.hash._regex_len));
                                     }
                                 }
                             }, $.pm.poll || 200);
                 pm.data("polling.postmessage", 1);
             }
         },

         _dispatch: function(hash) {
             if (!hash) {
                 return;
             }
             try {
                 hash = JSON.parse(decodeURIComponent(hash));
                 if (!(hash['x-requested-with'] === 'postmessage' &&
                       hash.source && hash.source.name != null && hash.source.url && hash.postmessage)) {
                     // ignore since hash could've come from somewhere else
                     return;
                 }
             }
             catch (ex) {
                 // ignore since hash could've come from somewhere else
                 return;
             }
             var msg = hash.postmessage,
             cbs = pm.data("callbacks.postmessage") || {},
             cb = cbs[msg.type];
             if (cb) {
                 cb(msg.data);
             }
             else {
                 var source_window;
                 if (hash.source.name === "parent") {
                     source_window = window.parent;
                 }
                 else {
                     source_window = window.frames[hash.source.name];
                 }
                 var l = pm.data("listeners.postmessage") || {};
                 var fns = l[msg.type] || [];
                 for (var i=0,len=fns.length; i<len; i++) {
                     var o = fns[i];
                     if (o.origin) {
                         var origin = /https?\:\/\/[^\/]*/.exec(hash.source.url)[0];
                         if (origin !== o.origin) {
                             console.warn("postmessage message origin mismatch", origin, o.origin);
                             if (msg.errback) {
                                 // notify post message errback
                                 var error = {
                                     message: "postmessage origin mismatch",
                                     origin: [origin, o.origin]
                                 };
                                 pm.send({target:source_window, data:error, type:msg.errback, hash:true, url:hash.source.url});
                             }
                             continue;
                         }
                     }
                     try {
                         var r = o.fn(msg.data);
                         if (msg.callback) {
                             pm.send({target:source_window, data:r, type:msg.callback, hash:true, url:hash.source.url});
                         }
                     }
                     catch (ex) {
                         if (msg.errback) {
                             // notify post message errback
                             pm.send({target:source_window, data:ex, type:msg.errback, hash:true, url:hash.source.url});
                         }
                     }
                 };
             }
         },

         _url: function(url) {
             // url minus hash part
             return (""+url).replace(/#.*$/, "");
         }

     };

     $.extend(pm, {
                  defaults: {
                      target: null,  /* target window (required) */
                      url: null,     /* target window url (required if no window.postMessage or hash == true) */
                      type: null,    /* message type (required) */
                      data: null,    /* message data (required) */
                      success: null, /* success callback (optional) */
                      error: null,   /* error callback (optional) */
                      origin: "*",   /* postmessage origin (optional) */
                      hash: false    /* use location hash for message passing (optional) */
                  }
              });

 })(this, typeof jQuery === "undefined" ? NO_JQUERY : jQuery);

/**
 * http://www.JSON.org/json2.js
 **/
if (! ("JSON" in window && window.JSON)){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z"};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());

this.layer=null;
this.queryHandler=queryHandler;
this.selectionHandler=selectionHandler;
this.detailsHandler=detailsHandler;
this.textbox=textbox;
this.prevSearchString=textbox.value;
this.suggestions=[];
this.isVerified=false;
this.isRequired=false;
this.ignoreOnBlur=false;
this.currentTimeout;
this.delay=300;
this.verifyStateChangeListeners=[];
this.init();
}RCMAutoSuggestControl.prototype.autosuggest=function(suggestions){this.layer.style.width=this.textbox.offsetWidth;
this.suggestions=suggestions;
if(suggestions.length>0){this.showSuggestions(suggestions);
}else{this.hideSuggestions();
}};
RCMAutoSuggestControl.prototype.createDropDown=function(){var that=this;
this.layer=document.createElement("div");
this.layer.className="suggestions";
this.layer.style.visibility="hidden";
this.layer.style.width=this.textbox.offsetWidth;
this.layer.onmousedown=this.layer.onmouseup=this.layer.onmouseover=function(oEvent){oEvent=oEvent||window.event;
oTarget=oEvent.target||oEvent.srcElement;
if(oEvent.type=="mousedown"){var index=that.indexOf(this,oTarget);
if(that.suggestions[index]){that.textbox.value=that.suggestions[index].NAME;
that.selectionHandler(that.suggestions[index].VALUE);
that.hideSuggestions();
that.setVerified(true);
}}else{if(oEvent.type=="mouseover"){var index=that.indexOf(this,oTarget);
that.cur=index;
that.highlightSuggestion(oTarget);
}else{that.textbox.focus();
}}};
document.body.appendChild(this.layer);
};
RCMAutoSuggestControl.prototype.getLeft=function(){return $(this.textbox).offset().left;
};
RCMAutoSuggestControl.prototype.getTop=function(){return $(this.textbox).offset().top;
};
RCMAutoSuggestControl.prototype.handleKeyDown=function(oEvent){if(this.layer.style.visibility!="hidden"){switch(oEvent.keyCode){case 38:this.previousSuggestion();
break;
case 40:this.nextSuggestion();
break;
case 13:this.textbox.value=this.suggestions[this.cur].NAME;
this.selectionHandler(this.suggestions[this.cur].VALUE);
this.hideSuggestions();
this.setVerified(true);
break;
}}};
RCMAutoSuggestControl.prototype.handleKeyUp=function(oEvent){var iKeyCode=oEvent.keyCode;
function handleQueryLater(that,searchText){return function(){that.queryHandler(that,searchText);
};
}if(iKeyCode==8||iKeyCode==46){this.setVerified(false);
if(this.currentTimeout){clearTimeout(this.currentTimeout);
}if(this.textbox.value.length>0){this.currentTimeout=setTimeout(handleQueryLater(this,this.textbox.value),this.delay);
}else{this.hideSuggestions();
}}else{if(iKeyCode<32||(iKeyCode>=33&&iKeyCode<46)||(iKeyCode>=112&&iKeyCode<=123)||this.prevSearchString===this.textbox.value){}else{this.setVerified(false);
if(this.currentTimeout){clearTimeout(this.currentTimeout);
}if(this.textbox.value.length>0){this.currentTimeout=setTimeout(handleQueryLater(this,this.textbox.value),this.delay);
this.prevSearchString=this.textbox.value;
}}}};
RCMAutoSuggestControl.prototype.setVerified=function(isVerified){if(isVerified!=this.isVerified){this.isVerified=isVerified;
this.updateRequiredDecoration();
for(var i=0;
i<this.verifyStateChangeListeners.length;
i++){this.verifyStateChangeListeners[i]();
}}};
RCMAutoSuggestControl.prototype.hideSuggestions=function(){this.layer.style.visibility="hidden";
};
RCMAutoSuggestControl.prototype.highlightSuggestion=function(suggestionNode){for(var i=0;
i<this.layer.childNodes.length;
i++){var curNode=this.layer.childNodes[i];
if(curNode==suggestionNode||curNode==suggestionNode.parentNode){curNode.className="current";
}else{if(curNode.className=="current"){curNode.className="";
}}}};
RCMAutoSuggestControl.prototype.init=function(){var that=this;
this.textbox.onkeyup=function(oEvent){if(!oEvent){oEvent=window.event;
}that.handleKeyUp(oEvent);
};
this.textbox.onkeydown=function(oEvent){if(!oEvent){oEvent=window.event;
}that.handleKeyDown(oEvent);
};
this.textbox.onblur=function(){that.hideSuggestions();
if(!that.ignoreOnBlur){if(!that.isVerified){that.textbox.value="";
that.selectionHandler(0);
}}};
this.createDropDown();
};
RCMAutoSuggestControl.prototype.nextSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur<cSuggestionNodes.length-1){var oNode=cSuggestionNodes[++this.cur];
this.highlightSuggestion(oNode);
}};
RCMAutoSuggestControl.prototype.previousSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur>0){var oNode=cSuggestionNodes[--this.cur];
this.highlightSuggestion(oNode);
}};
RCMAutoSuggestControl.prototype.showSuggestions=function(suggestions){this.ignoreOnBlur=true;
var oDiv=null;
this.layer.innerHTML="";
for(var i=0;
i<suggestions.length;
i++){oDiv=document.createElement("div");
if(i==0){oDiv.className="current";
}this.cur=0;
var itemText=this.emboldenTypeAheadText(suggestions[i].NAME,this.textbox.value);
oDiv.innerHTML=itemText;
this.detailsHandler(suggestions[i].DETAILS,oDiv);
this.layer.appendChild(oDiv);
}this.layer.style.left=this.getLeft()+"px";
this.layer.style.top=(this.getTop()+this.textbox.offsetHeight)+"px";
this.layer.style.visibility="visible";
this.layer.style.position="absolute";
this.ignoreOnBlur=false;
};
RCMAutoSuggestControl.prototype.indexOf=function(parent,element){var nodeList=parent.childNodes;
for(var i=0;
i<nodeList.length;
i++){var curNode=nodeList[i];
if(curNode==element||curNode==element.parentNode){return i;
}}return -1;
};
RCMAutoSuggestControl.prototype.emboldenTypeAheadText=function(suggestionText,typedText){return"<strong>"+suggestionText.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+typedText.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1").split(" ").join("|")+")(?![^<>]*>)(?![^&;]+;)","gi"),"</strong>$1<strong>")+"</strong>";
};
RCMAutoSuggestControl.prototype.updateRequiredDecoration=function(){$(this.textbox).toggleClass("required-search-field",this.isRequired&&!this.isVerified);
};
RCMAutoSuggestControl.prototype.setRequired=function(isRequired){if(isRequired!=this.isRequired){this.isRequired=isRequired;
if(isRequired){$("label[for='"+$(this.textbox).prop("id")+"']").prepend("<span style='color:#cc0000'>*</span>");
}else{$("label[for='"+$(this.textbox).prop("id")+"']").children(1).remove();
}this.updateRequiredDecoration();
}};
RCMAutoSuggestControl.prototype.addVerifyStateChangeListener=function(listener){this.verifyStateChangeListeners.push(listener);
};
RCMAutoSuggestControl.prototype.removeVerifyStateChangeListener=function(listener){for(var i=0;
i<this.verifyStateChangeListeners.length;
i++){if(this.verifyStateChangeListeners[i]===listener){this.verifyStateChangeListeners.splice(i,1);
break;
}}};
function ToolTipDetailsHandler(details,itemDiv){if(details&&details.length>0){var oToolTipDiv=document.createElement("div");
oToolTipDiv.className="detailsToolTip";
oToolTipDiv.style.visibility="hidden";
itemDiv.appendChild(oToolTipDiv);
var oToolTipSpan=document.createElement("span");
oToolTipSpan.innerHTML=details;
oToolTipDiv.appendChild(oToolTipSpan);
itemDiv.onmouseover=function(oEvent){oToolTipDiv.style.visibility="visible";
var offsetWidth=(itemDiv.offsetWidth)?itemDiv.offsetWidth:0;
var parentMarginLeft=(itemDiv.marginLeft)?itemDiv.marginLeft:0;
var parentMarginRight=(itemDiv.marginRight)?itemDiv.marginRight:0;
oToolTipDiv.style.left=offsetWidth+parentMarginLeft+parentMarginRight+5+"px";
oToolTipDiv.style.top=0+"px";
};
itemDiv.onmouseout=function(e){oToolTipDiv.style.visibility="hidden";
};
}}
this.layer=null;
this.component=oComponent;
this.queryHandler=oQueryHandler;
this.selectionHandler=oSelectionHandler;
this.suggestionDisplayHandler=oSuggestionDisplayHandler;
if(oItemId){this.textbox=_g(oComponent.getStyles().getNameSpace()+oItemId+oComponent.getComponentId());
}else{this.textbox=_g(oComponent.getStyles().getNameSpace()+"ContentCtrl"+oComponent.getComponentId());
}this.objArray="";
this.init();
}AutoSuggestControl.prototype.autosuggest=function(aSuggestions,defaultSelected){this.layer.style.width=this.textbox.offsetWidth;
this.objArray=aSuggestions;
if(aSuggestions&&aSuggestions.length>0){this.showSuggestions(aSuggestions,defaultSelected);
}else{this.hideSuggestions();
}};
AutoSuggestControl.prototype.createDropDown=function(){var oThis=this;
this.layer=document.createElement("div");
this.layer.className="suggestions";
this.layer.style.display="none";
this.layer.style.zIndex="9999";
this.layer.onmousedown=this.layer.onmouseup=this.layer.onmouseover=function(oEvent){oEvent=oEvent||window.event;
oTarget=oEvent.target||oEvent.srcElement;
var index;
if(oEvent.type=="mousedown"){index=AutoSuggestControl.prototype.indexOf(this,oTarget);
oThis.selectionHandler(oThis.objArray[index],oThis.textbox,oThis.component);
oThis.hideSuggestions();
}else{if(oEvent.type=="mouseover"){index=AutoSuggestControl.prototype.indexOf(this,oTarget);
oThis.cur=index;
oThis.highlightSuggestion(oTarget);
}else{oThis.textbox.focus();
}}};
Util.ia(this.layer,Util.gp(this.textbox));
};
AutoSuggestControl.prototype.handleKeyDown=function(oEvent){if(this.layer.style.display!="none"){switch(oEvent.keyCode){case 38:this.previousSuggestion();
break;
case 40:this.nextSuggestion();
break;
case 13:this.selectionHandler(this.objArray[this.cur],this.textbox,this.component);
this.hideSuggestions();
break;
}}};
AutoSuggestControl.prototype.handleKeyUp=function(oEvent){var iKeyCode=oEvent.keyCode;
if(iKeyCode==8||iKeyCode==46){if(this.textbox.value.length>0){this.queryHandler(this,this.textbox,this.component);
}else{this.hideSuggestions();
}}else{if(iKeyCode<32||(iKeyCode>=33&&iKeyCode<46)||(iKeyCode>=112&&iKeyCode<=123)){}else{this.queryHandler(this,this.textbox,this.component);
}}};
AutoSuggestControl.prototype.hideSuggestions=function(){var oNode=this.textbox;
while(oNode&&!Util.Style.ccss(oNode,"section")){oNode=Util.gp(oNode);
}if(oNode){oNode.style.position="relative";
oNode.style.zIndex="1";
}this.layer.style.zIndex="9999";
this.layer.style.display="none";
};
AutoSuggestControl.prototype.highlightSuggestion=function(oSuggestionNode){for(var i=0;
i<this.layer.childNodes.length;
i++){var oNode=this.layer.childNodes[i];
if(oNode==oSuggestionNode||oNode==oSuggestionNode.parentNode){oNode.className="current";
}else{if(oNode.className=="current"){oNode.className="";
}}}};
AutoSuggestControl.prototype.init=function(){var oThis=this;
this.textbox.onkeyup=function(oEvent){if(!oEvent){oEvent=window.event;
}oThis.handleKeyUp(oEvent);
};
this.textbox.onkeydown=function(oEvent){if(!oEvent){oEvent=window.event;
}oThis.handleKeyDown(oEvent);
};
this.textbox.onblur=function(){oThis.hideSuggestions();
};
this.createDropDown();
};
AutoSuggestControl.prototype.nextSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur<cSuggestionNodes.length-1){var oNode=cSuggestionNodes[++this.cur];
this.highlightSuggestion(oNode);
}};
AutoSuggestControl.prototype.previousSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur>0){var oNode=cSuggestionNodes[--this.cur];
this.highlightSuggestion(oNode);
}};
AutoSuggestControl.prototype.showSuggestions=function(aSuggestions,defaultSelected){var oDiv=null;
this.layer.innerHTML="";
for(var i=0;
i<aSuggestions.length;
i++){oDiv=document.createElement("div");
if(i===0&&!defaultSelected){oDiv.className="current";
}if(defaultSelected){this.cur=-1;
}else{this.cur=0;
}var domText=this.suggestionDisplayHandler(aSuggestions[i],this.textbox.value);
oDiv.innerHTML=domText;
oDiv.appendChild(document.createTextNode(""));
this.layer.appendChild(oDiv);
}var oNode=this.textbox;
while(oNode&&!Util.Style.ccss(oNode,"section")){oNode=Util.gp(oNode);
}if(oNode){oNode.style.position="relative";
oNode.style.zIndex="2";
}this.layer.style.zIndex="100000";
this.layer.style.display="block";
};
AutoSuggestControl.prototype.indexOf=function(parent,el){var nodeList=parent.childNodes;
for(var i=0;
i<nodeList.length;
i++){var oNode=nodeList[i];
if(oNode==el||oNode==el.parentNode){return i;
}}return -1;
};
AutoSuggestControl.prototype.highlight=function(value,term){return"<strong>"+value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1").split(" ").join("|")+")(?![^<>]*>)(?![^&;]+;)","gi"),"</strong>$1<strong>")+"</strong>";
};

document.onkeypress = function(evt){
	if (!evt) {
        evt = window.event;
    }

	if(evt.ctrlKey==1 && evt.keyCode == 28){
		log.activateLogging();
	}
};

/*
	Blackbird - Open Source JavaScript Logging Utility
	Author: G Scott Olson
	Web: http://blackbirdjs.googlecode.com/
	     http://www.gscottolson.com/blackbirdjs/
	Version: 1.0

	The MIT License - Copyright (c) 2008 Blackbird Project
*/
( function() {
	var NAMESPACE = 'log';
	var IE6_POSITION_FIXED = true; // enable IE6 {position:fixed}
	
	var bbird;
	var outputList;
	var cache = [];
	var loggingActive;
	var state = getState();
	var classes = {};
	var profiler = {};
	var IDs = {
		blackbird: 'blackbird',
		checkbox: 'bbVis',
		filters: 'bbFilters',
		controls: 'bbControls',
		size: 'bbSize'
	}
	var messageTypes = { //order of these properties imply render order of filter controls
		debug: true,
		info: true,
		warn: true,
		error: true,
		profile: true
	};
	
	function isLoggingActive(){
		return (state.active || loggingActive) ? true : false;
	}
	
	function generateMarkup() { //build markup
		var spans = [];
		for ( type in messageTypes ) {
			spans.push( [ '<span class="', type, '" type="', type, '"></span>'].join( '' ) );
		}

		var newNode = document.createElement( 'DIV' );
		newNode.id = IDs.blackbird;
		newNode.style.display = 'none';
		newNode.innerHTML = [
			'<div class="header">',
				'<div class="left">',
					'<div id="', IDs.filters, '" class="filters" title="click to filter by message type">', spans.join( '' ), '</div>',
				'</div>',
				'<div class="right">',
					'<div id="', IDs.controls, '" class="controls">',
						'<span id="', IDs.size ,'" title="contract" op="resize"></span>',
						'<span class="clear" title="clear" op="clear"></span>',
						'<span class="close" title="close" op="close"></span>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="main">',
				'<div class="left"></div><div class="mainBody">',
					'<ol>', cache.join( '' ), '</ol>',
				'</div><div class="right"></div>',
			'</div>'/*,
			'<div class="footer">',
				'<div class="left"><label for="', IDs.checkbox, '"><input type="checkbox" id="', IDs.checkbox, '" />Visible on page load</label></div>',
				'<div class="right"></div>',
			'</div>'*/
		].join( '' );
		return newNode;
	}

	function backgroundImage() { //(IE6 only) change <BODY> tag's background to resolve {position:fixed} support
		var bodyTag = document.getElementsByTagName( 'BODY' )[ 0 ];
		
		if ( bodyTag.currentStyle && IE6_POSITION_FIXED ) {
			if (bodyTag.currentStyle.backgroundImage == 'none' ) {
				bodyTag.style.backgroundImage = 'url(about:blank)';
			}
			if (bodyTag.currentStyle.backgroundAttachment == 'scroll' ) {
				bodyTag.style.backgroundAttachment = 'fixed';
			}
		}
	}

	function addMessage( type, content ) { //adds a message to the output list
		content = ( content.constructor == Array ) ? content.join( '' ) : content;
		if ( outputList ) {
			var newMsg = document.createElement( 'LI' );
			newMsg.className = type;
			newMsg.innerHTML = [ '<span class="icon"></span>', content ].join( '' );
			outputList.appendChild( newMsg );
			scrollToBottom();
		} else {
			cache.push( [ '<li class="', type, '"><span class="icon"></span>', content, '</li>' ].join( '' ) );
		}
	}
	
	function clear() { //clear list output
		outputList.innerHTML = '';
	}
	
	function clickControl( evt ) {
		if ( !evt ) evt = window.event;
		var el = ( evt.target ) ? evt.target : evt.srcElement;

		if ( el.tagName == 'SPAN' ) {
			switch ( el.getAttributeNode( 'op' ).nodeValue ) {
				case 'resize': resize(); break;
				case 'clear':  clear();  break;
				case 'close':  hide();   break;
			}
		}
	}
	
	function clickFilter( evt ) { //show/hide a specific message type
		if ( !evt ) evt = window.event;
		var span = ( evt.target ) ? evt.target : evt.srcElement;

		if ( span && span.tagName == 'SPAN' ) {

			var type = span.getAttributeNode( 'type' ).nodeValue;

			if ( evt.altKey ) {
				var filters = document.getElementById( IDs.filters ).getElementsByTagName( 'SPAN' );

				var active = 0;
				for ( entry in messageTypes ) {
					if ( messageTypes[ entry ] ) active++;
				}
				var oneActiveFilter = ( active == 1 && messageTypes[ type ] );

				for ( var i = 0; filters[ i ]; i++ ) {
					var spanType = filters[ i ].getAttributeNode( 'type' ).nodeValue;

					filters[ i ].className = ( oneActiveFilter || ( spanType == type ) ) ? spanType : spanType + 'Disabled';
					messageTypes[ spanType ] = oneActiveFilter || ( spanType == type );
				}
			}
			else {
				messageTypes[ type ] = ! messageTypes[ type ];
				span.className = ( messageTypes[ type ] ) ? type : type + 'Disabled';
			}

			//build outputList's class from messageTypes object
			var disabledTypes = [];
			for ( type in messageTypes ) {
				if ( ! messageTypes[ type ] ) disabledTypes.push( type );
			}
			disabledTypes.push( '' );
			outputList.className = disabledTypes.join( 'Hidden ' );

			scrollToBottom();
		}
	}

	function clickVis( evt ) {
		if ( !evt ) evt = window.event;
		var el = ( evt.target ) ? evt.target : evt.srcElement;

		state.load = el.checked;
		setState();
	}
	
	
	function scrollToBottom() { //scroll list output to the bottom
		outputList.scrollTop = outputList.scrollHeight;
	}
	
	function isVisible() { //determine the visibility
		return ( bbird.style.display == 'block' );
	}

	function hide() { 
	  bbird.style.display = 'none';
	}
			
	function show() {
		var body = document.getElementsByTagName( 'BODY' )[ 0 ];
		body.removeChild( bbird );
		body.appendChild( bbird );
		bbird.style.display = 'block';
	}
	
	//sets the position
	function reposition( position ) {
		if ( position === undefined || position == null ) {
			position = ( state && state.pos === null ) ? 1 : ( state.pos + 1 ) % 4; //set to initial position ('topRight') or move to next position
		}
				
		switch ( position ) {
			case 0: classes[ 0 ] = 'bbTopLeft'; break;
			case 1: classes[ 0 ] = 'bbTopRight'; break;
			case 2: classes[ 0 ] = 'bbBottomLeft'; break;
			case 3: classes[ 0 ] = 'bbBottomRight'; break;
		}
		state.pos = position;
		setState();
	}

	function resize( size ) {
		if ( size === undefined || size === null ) {
			size = ( state && state.size == null ) ? 1 : ( state.size + 1 ) % 2;
	  	}

		classes[ 1 ] = ( size === 0 ) ? 'bbSmall' : 'bbLarge'

		var span = document.getElementById( IDs.size );
		span.title = ( size === 1 ) ? 'small' : 'large';
		span.className = span.title;	  

		state.size = size;
		setState();
		scrollToBottom();
	}

	function setLogging(){
		state.active = true;
		state.load = true;
		state.size = 1;
		setState();
	}
	
	function setState() {
		var props = [];
		for ( entry in state ) {
			var value = ( state[ entry ] && state[ entry ].constructor === String ) ? '"' + state[ entry ] + '"' : state[ entry ]; 
			props.push( entry + ':' + value );
		}
		props = props.join( ',' );
		
		var expiration = new Date();
		expiration.setDate( expiration.getDate() + 14 );
		document.cookie = [ 'blackbird={', props, '};'].join( '' );

		var newClass = [];
		for ( word in classes ) {
			newClass.push( classes[ word ] );
		}
		bbird.className = newClass.join( ' ' );
	}
	
	function getState() {
		var re = new RegExp( /blackbird=({[^;]+})(;|\b|$)/ );
		var match = re.exec( document.cookie );
		return ( match && match[ 1 ] ) ? eval( '(' + match[ 1 ] + ')' ) : { pos:null, size:null, load:null, active:null };
	}
	
	//event handler for 'keyup' event for window
	function readKey( evt ) {
		if ( !evt ) evt = window.event;
		var code = 113; //F2 key
					
		if ( evt && evt.keyCode == code ) {
					
			var visible = isVisible();
					
			if ( visible && evt.shiftKey && evt.altKey ) clear();
			else if	 (visible && evt.shiftKey ) reposition();
			else if ( !evt.shiftKey && !evt.altKey ) {
			  if(isLoggingActive()){
			    ( visible ) ? hide() : show();
			  }
			}
		}
	}

	//event management ( thanks John Resig )
	function addEvent( obj, type, fn ) {
		var obj = ( obj.constructor === String ) ? document.getElementById( obj ) : obj;
		if ( obj.attachEvent ) {
			obj[ 'e' + type + fn ] = fn;
			obj[ type + fn ] = function(){ obj[ 'e' + type + fn ]( window.event ) };
			obj.attachEvent( 'on' + type, obj[ type + fn ] );
		} else obj.addEventListener( type, fn, false );
	}
	function removeEvent( obj, type, fn ) {
		var obj = ( obj.constructor === String ) ? document.getElementById( obj ) : obj;		
		if ( obj.detachEvent ) {
			if (obj[ type + fn ] != undefined)
            {
				obj.detachEvent( 'on' + type, obj[ type + fn ] );
			}
			obj[ type + fn ] = null;
	  } else {
		obj.removeEventListener( type, fn, false );
	  }
	}
	
	window[ NAMESPACE ] = {
		toggle:
			function() { if(isLoggingActive()){( isVisible() ) ? hide() : show(); }},
		resize:
			function() { resize(); },
		clear:
			function() { clear(); },
		move:
			function() { reposition(); },
		debug: 
			function( msg ) { if(isLoggingActive()){addMessage( 'debug', msg ); }},
		warn:
			function( msg ) { if(isLoggingActive()){addMessage( 'warn', msg ); }},
		info:
			function( msg ) { if(isLoggingActive()){addMessage( 'info', msg ); }},
		error: 
			function( msg ) { if(isLoggingActive()){addMessage( 'error', msg ); }},
		activateLogging:
			function(){
				//Set the state.active to true
				setLogging();
			},
		profile: 
			function( label ) {
				var currentTime = new Date(); //record the current time when profile() is executed
				
				if ( label == undefined || label == '' ) {
					addMessage( 'error', '<b>ERROR:</b> Please specify a label for your profile statement' );
				}
				else if ( profiler[ label ] ) {
					addMessage( 'profile', [ label, ': ', currentTime - profiler[ label ],	'ms' ].join( '' ) );
					delete profiler[ label ];
				}
				else {
					profiler[ label ] = currentTime;
					addMessage( 'profile', label );
				}
				return currentTime;
			},
		isBlackBirdActive:
			function() {
				return isLoggingActive();
			}
	}

	addEvent( window, 'load', 
		/* initialize Blackbird when the page loads */
		function() {
			var body = document.getElementsByTagName( 'BODY' )[ 0 ];
			bbird = body.appendChild( generateMarkup() );
			outputList = bbird.getElementsByTagName( 'OL' )[ 0 ];
		
			backgroundImage();
		
			//add events
			//addEvent( IDs.checkbox, 'click', clickVis );
			addEvent( IDs.filters, 'click', clickFilter );
			addEvent( IDs.controls, 'click', clickControl );
			addEvent( document, 'keyup', readKey);

			resize( state.size );
			reposition( state.pos );
			if ( state.load ) {
				show();
				//document.getElementById( IDs.checkbox ).checked = true; 
			}

			scrollToBottom();

			window[ NAMESPACE ].init = function() {
				show();
				window[ NAMESPACE ].error( [ '<b>', NAMESPACE, '</b> can only be initialized once' ] );
			}

			addEvent( window, 'unload', function() {
				//removeEvent( IDs.checkbox, 'click', clickVis );
				removeEvent( IDs.filters, 'click', clickFilter );
				removeEvent( IDs.controls, 'click', clickControl );
				removeEvent( document, 'keyup', readKey );
			});
			
			if(state.active){
				//Prevent logging from occuring next reload
				loggingActive = true;
				state.active = false;
				state.load = false;
				state.size = 1;
				setState();
			}
		});
})();
var orgTypeCds=[];
var childOrgAddressTypeMeaning="";
var parentOrgId=0;
var serviceDelegate=new BusinessServiceDelegate();
var allOrgResults=null;
var getFilteredResults=function(searchString){var filteredResults=new Array();
for(var i=0,length=allOrgResults.length;
i<length;
i++){var result=allOrgResults[i];
if(result.NAME.substr(0,searchString.length).toLowerCase()===searchString.toLowerCase()){filteredResults.push(result);
}}return filteredResults;
};
var selectionHandler=function(newSelectedId){selectedId=newSelectedId;
};
var queryHandler=function(callback,searchString){if(allOrgResults==null){serviceDelegate.getResults(parentOrgId,orgTypeCds,childOrgAddressTypeMeaning,searchString,function(results){allOrgResults=results;
callback.autosuggest(getFilteredResults(searchString));
});
}else{callback.autosuggest(getFilteredResults(searchString));
}};
var autoSuggestControl=new RCMAutoSuggestControl(oTextBox,queryHandler,selectionHandler,ToolTipDetailsHandler);
autoSuggestControl.delay=0;
this.getSelectedOrganizationId=function(){return selectedId;
};
this.setSelectedOrganization=function(organizationId,organizationName){selectedId=organizationId;
oTextBox.value=organizationName;
autoSuggestControl.setVerified(organizationId>0);
};
this.setParentOrgId=function(newParentOrgId){allOrgResults=null;
parentOrgId=newParentOrgId;
};
this.setOrgTypeCds=function(newOrgTypeCds){allOrgResults=null;
orgTypeCds=newOrgTypeCds;
};
this.setChildOrgAddressTypeMeaning=function(newChildOrgAddressTypeMeaning){allOrgResults=null;
childOrgAddressTypeMeaning=newChildOrgAddressTypeMeaning;
};
this.setRequired=function(required){autoSuggestControl.setRequired(required);
};
this.isVerified=function(){return autoSuggestControl.isVerified;
};
this.addVerifyStateChangeListener=function(listener){autoSuggestControl.addVerifyStateChangeListener(listener);
};
this.removeVerifyStateChangeListener=function(listener){autoSuggestControl.removeVerifyStateChangeListener(listener);
};
var addEventHandler=function(element,event,handler){element.addEventListener?element.addEventListener(event,handler,false):element.attachEvent("on"+event,handler);
};
if(oTextBox.form){addEventHandler(oTextBox.form,"reset",function(){selectedId=0;
autoSuggestControl.setVerified(false);
});
}}
for(var i=0;
i<orgTypeCds.length;
i++){childOrgTypeCdsJson.push({ORG_TYPE_CD:orgTypeCds[i].toFixed(1)});
}var json={BUSINESS_SEARCH_REQUEST:{PARENT_ORG_ID:parentOrgId.toFixed(1),CHILD_ORG_ADDRESS_TYPE_MEANING:childOrgAddressTypeMeaning,CHILD_ORG_PHONE_TYPE_MEANING:"",SERVICES_IND:0,CHILD_ORG_TYPES:childOrgTypeCdsJson}};
var sendAr=[];
sendAr.push("^MINE^","0.0","2","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",sendAr,true,function(status,recordData){if("S"===status){var orgResults=new Array();
for(var i=0,length=recordData.CHILD_ORGS.length;
i<length;
i++){var child_org=recordData.CHILD_ORGS[i];
orgResults.push({NAME:child_org.ORG_NAME,VALUE:child_org.ORGANIZATION_ID,DETAILS:child_org.ORG_FORMATTED_ADDRESS});
}callback(orgResults);
}else{if("F"===status){if(recordData){alert(recordData);
}}}});
};
}
var drgResults;
var isSearchByCode=function(searchString){var reg=new RegExp("[0-9]+[.]?[0-9]*$");
return reg.test(searchString);
};
function ArraySortNumberAscending(a,b){if(a&&b){if(a.VALUE.SOURCEIDENTIFIER>b.VALUE.SOURCEIDENTIFIER){return 1;
}else{if(a.VALUE.SOURCEIDENTIFIER<b.VALUE.SOURCEIDENTIFIER){return -1;
}else{return 0;
}}}else{if(!a&&b){return -1;
}else{if(a&&!b){return 1;
}else{return 0;
}}}}function ArraySortStringAscending(a,b){if((!a.NAME||a.NAME.length===0)&&(b.NAME&&b.NAME.length>0)){return -1;
}else{if((!b.NAME||b.NAME.length===0)&&(a.NAME&&a.NAME.length>0)){return 1;
}else{if((a.NAME&&a.NAME.length>0)&&(b.NAME&&b.NAME.length>0)){var aName=a.NAME;
var bName=b.NAME;
if(aName.length>bName.length){aName=aName.substring(0,aName.length);
}else{if(aName.length>bName.length){bName=bName.substring(0,bName.length);
}}if(aName>bName){return 1;
}else{if(aName<bName){return -1;
}else{return 0;
}}}else{return 0;
}}}}var getFilteredResults=function(searchString){var filteredResults=[];
if(isSearchByCode(searchString)){for(var i=0,length=drgResults.length;
i<length;
i++){var result=drgResults[i];
if(result){filteredResults.push(result);
}}filteredResults.sort(ArraySortNumberAscending);
}else{for(var i=0,length=drgResults.length;
i<length;
i++){var result=drgResults[i];
if(result){filteredResults.push(result);
}}filteredResults.sort(ArraySortStringAscending);
}return filteredResults;
};
var selectionHandler=function(newselectedDRG){selectedDRG=newselectedDRG;
};
var queryHandler=function(callback,searchString){if(searchString.replace(/\s+/g,"").length<3&&!isSearchByCode(searchString)){callback.autosuggest(new Array());
}else{new DrgServiceDelegate().getResults(searchString,function(results){drgResults=results;
callback.autosuggest(getFilteredResults(searchString));
});
}};
this.setSelectedDRG=function(selectedDRG,term){selectedDRG=selectedDRG;
oTextBox.value=term;
autoSuggestControl.setVerified(selectedDRG);
};
var addEventHandler=function(element,event,handler){if(element){element.addEventListener?element.addEventListener(event,handler,false):element.attachEvent("on"+event,handler);
}};
addEventHandler(oTextBox.form,"reset",function(){if(oTextBox.form){selectedId=0;
autoSuggestControl.setVerified(false);
}});
this.getSelectedDRG=function(){return selectedDRG;
};
this.setRequired=function(required){autoSuggestControl.setRequired(required);
};
this.isVerified=function(){return autoSuggestControl.isVerified;
};
this.addVerifyStateChangeListener=function(listener){autoSuggestControl.addVerifyStateChangeListener(listener);
};
this.removeVerifyStateChangeListener=function(listener){autoSuggestControl.removeVerifyStateChangeListener(listener);
};
var autoSuggestControl=new RCMAutoSuggestControl(oTextBox,queryHandler,selectionHandler,ToolTipDetailsHandler);
autoSuggestControl.delay=3;
}
var sendAr=[];
sendAr.push("^MINE^","0.0","3","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",sendAr,true,function(status,recordData){if("S"===status){var drgResults=new Array();
for(var i=0,length=recordData.TERMS.length;
i<length;
i++){var drg=recordData.TERMS[i];
drgResults.push({NAME:drg.TERM+" ("+drg.CODE+")",VALUE:{SOURCEIDENTIFIER:drg.CODE,NOMENCLATUREID:drg.NOMENCLATURE_ID},DETAILS:"<strong>Description</strong>: <dfn>"+drg.TERM+"</dfn><br><strong>Code</strong>: <em>"+drg.CODE+"</em>"});
}callback(drgResults);
}else{if("F"===status){if(recordData){alert(recordData);
}}}});
};
}
var searchType=isContains?3:1;
var json={nomenclature_search_request:{search_type_flag:searchType,preferred_type_flag:1,search_string:searchTerm,terminology_cds:terminologyJson,terminology_axis_cds:[],principle_type_cds:[],max_results:20,effective_flag:0,active_flag:0}};
var sendAr=[];
sendAr.push("^MINE^","0.0","5","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",sendAr,true,function(status,recordData){if("S"===status){if(recordData){var drgResults=new Array();
for(var i=0,length=recordData.NOMENCLATURES.length;
i<length;
i++){var drg=recordData.NOMENCLATURES[i];
drgResults.push({NAME:drg.DESCRIPTION+" ("+drg.SOURCE_IDENTIFIER+")",VALUE:{SOURCEIDENTIFIER:drg.SOURCE_IDENTIFIER,NOMENCLATUREID:drg.NOMENCLATURE_ID},DETAILS:"<strong>Description</strong>: <dfn>"+drg.DESCRIPTION+"</dfn><br><strong>Code</strong>: <em>"+drg.SOURCE_IDENTIFIER+"</em>"});
}callback(drgResults);
}}else{if("Z"===status){callback();
}else{if("F"===status){failureCallback();
}}}});
}function NomenclatureSearchByCode(searchTerm,terminologyCD,callback,failureCallback){var terminologyJson=[{terminology_cd:terminologyCD}];
var json={nomenclature_search_request:{search_type_flag:1,preferred_type_flag:1,search_string:searchTerm,terminology_cds:terminologyJson,terminology_axis_cds:[],principle_type_cds:[],max_results:20,effective_flag:0,active_flag:0}};
var sendAr=[];
sendAr.push("^MINE^","0.0","6","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",sendAr,true,function(status,recordData){if("S"===status){if(recordData){var drgResults=new Array();
for(var i=0,length=recordData.NOMENCLATURES.length;
i<length;
i++){var drg=recordData.NOMENCLATURES[i];
drgResults.push({NAME:drg.DESCRIPTION+" ("+drg.SOURCE_IDENTIFIER+")",VALUE:{SOURCEIDENTIFIER:drg.SOURCE_IDENTIFIER,NOMENCLATUREID:drg.NOMENCLATURE_ID},DETAILS:"<strong>Description</strong>: <dfn>"+drg.DESCRIPTION+"</dfn><br><strong>Code</strong>: <em>"+drg.SOURCE_IDENTIFIER+"</em>"});
}callback(drgResults);
}}else{if("Z"===status){callback();
}else{if("F"===status){failureCallback();
}}}});
}
var serviceDelegate=new ProviderServiceDelegate();
var orgSecurityInd=0;
var physicianOnlyInd=0;
var selectionHandler=function(newSelectedId){selectedId=newSelectedId;
};
var queryHandler=function(callback,searchString){serviceDelegate.getResults(searchString,function(results){callback.autosuggest(results);
},orgSecurityInd,physicianOnlyInd);
};
var autoSuggestControl=new RCMAutoSuggestControl(textBox,queryHandler,selectionHandler,ToolTipDetailsHandler);
this.getSelectedProviderId=function(){return selectedId;
};
this.setSelectedProvider=function(providerId,providerName){selectedId=providerId;
textBox.value=providerName;
autoSuggestControl.setVerified(providerId>0);
};
this.setRequired=function(required){autoSuggestControl.setRequired(required);
};
this.isVerified=function(){return autoSuggestControl.isVerified;
};
this.enableProviderSearchOrgSecurity=function(isOrgSecurityEnabled){if(isOrgSecurityEnabled){orgSecurityInd=1;
}};
this.enablePhysicianOnlySearch=function(isPhysicianOnlyInd){if(isPhysicianOnlyInd){physicianOnlyInd=1;
}};
this.addVerifyStateChangeListener=function(listener){autoSuggestControl.addVerifyStateChangeListener(listener);
};
this.removeVerifyStateChangeListener=function(listener){autoSuggestControl.removeVerifyStateChangeListener(listener);
};
var addEventHandler=function(element,event,handler){element.addEventListener?element.addEventListener(event,handler,false):element.attachEvent("on"+event,handler);
};
if(textBox.form){addEventHandler(textBox.form,"reset",function(){selectedId=0;
autoSuggestControl.setVerified(false);
});
}}
this.getResults=function(searchString,callback,orgSecurityInd,physicianInd){if(searchString.replace(/\s+/g,"").length<3){callback(new Array());
return;
}var searchTokens=Search_Util.createPersonNameSearchTokens(searchString);
var nameLastKey=searchTokens[0]+"*";
var nameFirstKey=((searchTokens.length>1)?searchTokens[1]:"")+"*";
var json={REQUEST:{MAX:10,NAME_LAST_KEY:nameLastKey,NAME_FIRST_KEY:nameFirstKey,PHYSICIAN_IND:physicianInd,INACTIVE_IND:0,FT_IND:0,NON_FT_IND:0,PRIV:[],PRSNL_GROUP_ID:0,LOCATION_CD:0,SEARCH_STR_IND:0,SEARCH_STR:"",TITLE_STR:"",SUFFIX_STR:"",DEGREE_STR:"",USE_ORG_SECURITY_IND:orgSecurityInd,ORGANIZATION_ID:0,ORGANIZATIONS:[],START_NAME:"",START_NAME_FIRST:"",CONTEXT_IND:0,CONTEXT_PERSON_ID:0,RETURN_ALIASES:0,RETURN_ORGS:1,RETURN_SERVICES:1,ALIAS_TYPE_LIST:"",PROVIDER_FILTER:[],AUTH_ONLY_IND:1}};
var requestArgs=[];
requestArgs.push("^MINE^","0.0","1","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",requestArgs,true,function(status,recordData){if("S"===status){var providerResults=[];
for(var i=0,length=recordData.PRSNL.length;
i<length;
i++){var providerResult=recordData.PRSNL[i];
providerResults.push({NAME:providerResult.NAME_FULL_FORMATTED.replace(/\s+$/,""),VALUE:providerResult.PERSON_ID,DETAILS:createProviderAdditionalDetails(providerResult)});
}callback(providerResults);
}else{if("F"===status){callback(new Array());
}}});
};
function createProviderAdditionalDetails(providerResult){var positionDetails="<strong>"+rcm_search_i18n.PROV_SEARCH_DETAILS_POSITIONS+"</strong>";
var isFirstPosition=true;
for(var i=0,positionsLength=providerResult.POSITIONS.length;
i<positionsLength;
i++){if(isFirstPosition){positionDetails+=providerResult.POSITIONS[i].POSITION_DISP;
isFirstPosition=false;
continue;
}positionDetails+=", "+providerResult.POSITIONS[i].POSITION_DISP;
}positionDetails+="<br />";
var servicesDetails="<strong>"+rcm_search_i18n.PROV_SEARCH_DETAILS_SERVICES+"</strong>";
var isFirstService=true;
for(var j=0,servicesLength=providerResult.SERVICE.lenth;
j<servicesLength;
j++){if(isFirstService){servicesDetails+=providerResult.SERVICE[j].SERVICE_DESC_NAME;
isFirstService=false;
continue;
}servicesDetails+=", "+providerResult.SERVICE[j].SERVICE_DESC_NAME;
}servicesDetails+="<br />";
var orgsDetails="<strong>"+rcm_search_i18n.PROV_SEARCH_DETAILS_ORGS+"</strong>";
var isFirstOrg=true;
var maxOrgsToDisplay=5;
for(var k=0,orgsLength=providerResult.ORG.length;
k<orgsLength;
k++){if(isFirstOrg){orgsDetails+=providerResult.ORG[k].ORG_NAME;
isFirstOrg=false;
continue;
}if(k==maxOrgsToDisplay){orgsDetails+=", "+rcm_search_i18n.PROV_SEARCH_MORE_ORGS_AVAILABLE;
break;
}orgsDetails+=", "+providerResult.ORG[k].ORG_NAME;
}return positionDetails+servicesDetails+orgsDetails;
}}
i18n.RCM_COMMUNICATION = "Communication";

//cross-origin resource sharing 
$.support.cors = true;

var RCM_Clinical_Util = function() {
	return {		
		getOauthToken : function(component, service, callback) {
			var sendAr = [];
			sendAr.push("^MINE^", "0.0", "^GETOAUTHINFO^");
			json = {"get_oauth_info_request":{"webService":service}};
			sendAr.push("^",JSON.stringify(json),"^");
	    	RCM_Clinical_Util.makeTimerCCLRequest(component, "RCM_OAUTH", sendAr, true,
	    		function(status, recordData, errorInfo) {
	    			callback(status, recordData);
	    		});
		},
		
		/**
		 * Returns the first component whose constructor matches the specified constructor. 
		 * 
		 * @param {Object} mPage The MPage.
		 * @param {Function} componentConstructor The component constructor function. 
		 * 
		 * @return {Object} Returns the component(s) whose constructor matches the specified constructor. Otherwise returns no value.
		 */
		getMPageComponent : function(mPage, componentConstructor) {
			var components = mPage.getComponents();
			if (components) {
				var foundDocuments = [];
				for (var pos = 0, length = components.length; pos < length; pos++) {
					if (components[pos] instanceof componentConstructor) {	
						foundDocuments.push(components[pos]);
					}
				}
				if (foundDocuments.length === 1) {
					return foundDocuments[0];
				}
				// It could have more than one component matches the type.
				else if (foundDocuments.length > 1) {
					return foundDocuments;
				}
			}
			else {
				alert("The MPage configuration has not be completed.  See your system admistrator.");
			}
		},
		
		/**
		 * Move all components in the MPage to the another location.
		 * @param {Object} mPage The MPage
		 * @param {Array} a list of excluded component
		 * @param {Object} the location the components to move to
		 * 
		 * @return {Object} the array map of components and original parent sections
		 */
		moveMpageComponent : function(mPage, excludedComponents, movedParentNode) {
			var movedComponentMap = {};
			var movedComponentArray = [];
			var movedComponentParentArray = [];
			var components = mPage.getComponents();
			for (var pos = 0, length = components.length; pos < length; pos++) {
				var component = components[pos];
				var excluded = false;
				for(var i = 0, excludedLength = excludedComponents.length; i < excludedLength; i++) {
					if(component === excludedComponents[i]) {
						excluded = true;
						break;
					}
				}
				if (excluded !== true) {
					// remember the old parent section.
					movedComponentArray.push(component.getRootComponentNode());
					movedComponentParentArray.push(component.getRootComponentNode().parentNode);
					// move components to new parent section.
					$(movedParentNode).append($(component.getRootComponentNode()));
				}
			}
			movedComponentMap["component"] = movedComponentArray;
			movedComponentMap["componetParent"] = movedComponentParentArray;
			return movedComponentMap;
		},
		
		/**
		 * Move back all components to original parent sections.
		 * @param {Object} the array map of components and original parent sections
		 */
		movebackMpageComponent : function(movedComponentMap) {
			var movedComponentArray = movedComponentMap["component"];
			var movedComponentParentArray = movedComponentMap["componetParent"];
			if (movedComponentArray && movedComponentParentArray) {
				for (var pos = 0, length = movedComponentArray.length; pos < length; pos++) {
					var componentNode = movedComponentArray[pos];
					var movebackNode = movedComponentParentArray[pos]; 
					$(movebackNode).append($(componentNode));
				}
			}
		},
		
		addNextMPageButton : function(parentNode, criterion, nextMPage, buttonLabel) {
			var button = Util.cep("input",{"type" : "button", "value" : buttonLabel, "className" : "next-mpage-button"});
			RCM_Clinical_Util.addNextMPageListener(criterion, nextMPage, button);
			parentNode.appendChild(button);
		},
		
		addNextMPageListener : function(criterion, nextMPage, button) {
			button.onclick = function() {	
				var pageParams = [];
				pageParams.push("^MINE^,");
				pageParams.push(criterion.person_id+",");		
				pageParams.push(criterion.encntr_id+",");
				pageParams.push(criterion.provider_id+",^");
				// Escape the backslashes in the static content path
				pageParams.push(criterion.static_content.replace(/\\/g, '\\\\')+"^,^");
				pageParams.push(nextMPage+"^,^powerchart.exe^,^");
				pageParams.push(criterion.backend_loc.replace(/\\/g, '\\\\')+"^");
				CCLLINK('mp_common_driver', pageParams.join(""), 1);
			};			
		},
		
		forwardNextMPage : function(criterion, nextMPage)
		{
			var pageParams = [];
			pageParams.push("^MINE^,");
			pageParams.push(criterion.person_id+",");		
			pageParams.push(criterion.encntr_id+",");
			pageParams.push(criterion.provider_id+",^");
			// Escape the backslashes in the static content path
			pageParams.push(criterion.static_content.replace(/\\/g, '\\\\')+"^,^");
			pageParams.push(nextMPage+"^,^powerchart.exe^,^");
			pageParams.push(criterion.backend_loc.replace(/\\/g, '\\\\')+"^");
			CCLLINK('mp_common_driver', pageParams.join(""), 1);
		},
		
		// Places the MPage components into the first column while maintaining their sequence order 
		moveComponentsIntoOneColumn : function(mPage) {
			var components = mPage.getComponents();
			var maxSequences = [];
			var firstColumn = 1;
			var length = components.length;
			var pos;
			var component;
			var column;			
			for (pos = 0; pos < length; pos++) {
				component = components[pos];
				column = component.getColumn();
				if (column < maxSequences.length) {
					maxSequences[column] = Math.max(maxSequences[column], component.getSequence());
				} 
				else {
					maxSequences[column] = component.getSequence();
				}
			}
			for (pos = 0; pos < length; pos++) {
				component = components[pos];
				column = component.getColumn();
				if(column > firstColumn) {
					var sequenceStart = 0;
					for(var nextColumn = firstColumn; nextColumn < column; nextColumn++) {
						sequenceStart += maxSequences[nextColumn];
					}
					component.setColumn(firstColumn);
					component.setSequence(component.getSequence()+sequenceStart);
				}
			}
			return firstColumn;
		}, 
		
		setColumnsToAvailableHeight : function(mPage, columnClasses) {			
			var columns = [];
			// The banner requires vertical space, hence the 0.90 multiplier
			var heightRatio = mPage.isBannerEnabled() ? 0.90 : 0.99;
			var height = gvs()[0] * heightRatio;
			for (var pos = 0, length = columnClasses.length; pos < length; pos++) {
				var column = Util.Style.g(columnClasses[pos], document, "div")[0];
				if (column) {
					column.style.height = height;
					columns.push(column);				
				}
			}
			return columns;
		}, 
		
		addDatePicker : function(component, textBoxId) {
			var defaultMonthDayYearForwardSlash = 'mm/dd/yyyy';
			var dayMonthYearForwardSlash = 'dd/mm/yyyy';
			var dayMonthYearPeriod = 'dd.mm.yyyy';
			var dayMonthYearDash = 'dd-mm-yyyy';
			var yearMonthDayForwardSlash = 'yyyy/mm/dd';
			var yearMonthDayDash = 'yyyy-mm-dd';
			var dateBoxId = "#"+textBoxId;
			var rcmDatePicker = {
				destroyDatePicker: function(component){
					$(document).ready(function(){
						$(dateBoxId).datepicker('destroy');
						var textBox = document.getElementById(textBoxId);
						textBox.invalidDate = false;
						if (textBox.dateSelectionListeners) {
							textBox.dateSelectionListeners = null;
						}
					});
				},			
				getDateFormat: function(component){
					var dateFormat = $(dateBoxId).datepicker('option', 'dateFormat');
					var newDateFormat;
					if(dateFormat == 'mm/dd/yy' || dateFormat == 'dd/mm/yy' || dateFormat == 'dd.mm.yy' || dateFormat == 'dd-mm-yy')
					{	
						newDateFormat = dateFormat + 'yy';
					}
					else{
						newDateFormat = 'yy' + dateFormat;
					}
					return newDateFormat;
				},
				clearDateTextBox: function(textbox){
					textbox.focus();
					textbox.select();
				},

				daysInTheMonth: function(monthToCheck, yearToCheck){
					if ((monthToCheck == "01") || (monthToCheck == "03") || (monthToCheck == "05") ||
					(monthToCheck == "07") ||
					(monthToCheck == "08") ||
					(monthToCheck == "10") ||
					(monthToCheck == "12")) {
						return 31;
					}
					
					if (monthToCheck == "02") {
						if ((yearToCheck % 100 === 0) && (yearToCheck % 400 === 0)) {
							return 29;
						}
						
						else {
							if ((yearToCheck % 4) === 0) {
								return 29;
							}
							return 28;
						}
					}
					
					if ((monthToCheck == "04") || (monthToCheck == "06") || (monthToCheck == "09") || (monthToCheck == "11")) {
						return 30;
					}
				},
				isDateValid: function(monthDigits, dayDigits, yearDigits){
					if (dayDigits > this.daysInTheMonth(monthDigits, yearDigits)) {
						return 0;
					}
					return 1;
				},
				checkDate: function(textbox){
					var dateString = textbox.value;
					var dateFormat = rcmDatePicker.getDateFormat(textbox);
					var firstMonthDigit;
					var secondMonthDigit;
					var firstDayDigit;
					var secondDayDigit;
					var monthDigits;
					var dayDigits;
					var yearDigits;
					// Date invalid if it's less than 10
					if (dateString.length < 10)
					{
						return 0;
					}
					if (dateFormat == defaultMonthDayYearForwardSlash) {
						firstMonthDigit = parseInt(dateString.charAt(0));
						secondMonthDigit = parseInt(dateString.charAt(1));
						firstDayDigit = parseInt(dateString.charAt(3));
						secondDayDigit = parseInt(dateString.charAt(4));
						monthDigits = dateString.charAt(0) + dateString.charAt(1);
						dayDigits = dateString.charAt(3) + dateString.charAt(4);
						yearDigits = dateString.charAt(6) + dateString.charAt(7) + dateString.charAt(8) + dateString.charAt(9);
					}
					
					else if(dateFormat == dayMonthYearForwardSlash || dateFormat == dayMonthYearPeriod || dateFormat == dayMonthYearDash){
						firstDayDigit = parseInt(dateString.charAt(0));
						secondDayDigit = parseInt(dateString.charAt(1));
						firstMonthDigit = parseInt(dateString.charAt(3));
						secondMonthDigit = parseInt(dateString.charAt(4));
						dayDigits = dateString.charAt(0) + dateString.charAt(1);
						monthDigits = dateString.charAt(3) + dateString.charAt(4);
						yearDigits = dateString.charAt(6) + dateString.charAt(7) + dateString.charAt(8) + dateString.charAt(9);
					}
					
					else if(dateFormat == yearMonthDayForwardSlash || dateFormat == yearMonthDayDash){
						firstMonthDigit = parseInt(dateString.charAt(5));
						secondMonthDigit = parseInt(dateString.charAt(6));
						firstDayDigit = parseInt(dateString.charAt(8));
						secondDayDigit = parseInt(dateString.charAt(9));
						yearDigits = dateString.charAt(0) + dateString.charAt(1) + dateString.charAt(2) + dateString.charAt(3);
						monthDigits = dateString.charAt(5) + dateString.charAt(6);
						dayDigits = dateString.charAt(8) + dateString.charAt(9);
					}
					
					if ((firstMonthDigit !== 0) && (firstMonthDigit != 1)) {
						return 0;
					}
					
					else 
						if (firstMonthDigit == 1) {
							if ((secondMonthDigit < 0) || (secondMonthDigit > 2)) {
								return 0;
							}
						}
						
						else 
							if (firstMonthDigit === 0) {
								if ((secondMonthDigit < 1) || (secondMonthDigit > 9)) {
									return 0;
								}
							}
							
							else 
								if ((firstDayDigit < 0) || (firstDayDigit > 3)) {
									return 0;
								}
								else 
									if ((firstDayDigit === 0)) {
										if ((dateString.charAt(4) < 1) || (dateString.charAt(4) > 9)) {
											return 0;
										}
									}
									else 
										if ((firstDayDigit == 1) || (firstDayDigit == 2)) {
											if ((secondDayDigit < 0) || (secondDayDigit > 9)) {
												return 0;
											}
										}
										else 
											if (firstDayDigit == 3) {
												if ((secondDayDigit !== 0) || (secondDayDigit != 1)) {
													return 0;
												}
											}
					
					var isDate = this.isDateValid(monthDigits, dayDigits, yearDigits);
					if (isDate === 0) {
						return 0;
					}
					return 1;
				},
				setMaxDate : function(maxDate) {
					this.maxDate = maxDate;
					$(dateBoxId).datepicker("option", "maxDate", maxDate);
				},
				setMinDate : function(minDate) {
					this.minDate = minDate;
					$(dateBoxId).datepicker("option", "minDate", minDate);
				},
				adjustDateForMinMaxRange: function(){
					var date = $(dateBoxId).datepicker("getDate");
					if(date){
						if(this.maxDate && date > this.maxDate){
							RCM_Clinical_Util.setDate(textBoxId, null);
						}
						if(this.minDate && date < this.minDate){
							RCM_Clinical_Util.setDate(textBoxId, null);
						}						
					}
				},
				dateTextBoxLoseFocus: function(textbox){
					var validDate = rcmDatePicker.checkDate(textbox);
					// allow date to be blank out, and default date is null
					if (validDate === 0 && textbox.value.length != 0) {
						textbox.focus();
						textbox.select();
						textbox.style.background = '#FFF380';
						textbox.invalidDate = true;
						alert("Please enter a valid date in the format of " + rcmDatePicker.getDateFormat(textbox));
					}
					else {
						textbox.invalidDate = false;
						textbox.style.background = "#FFFFFF";
					}
				},
				dateTextBoxChange: function(textbox){
					if(textbox.value.length > 0){
						rcmDatePicker.adjustDateForMinMaxRange();
					}
				},
				applyMask: function(textbox){
					var dateText = textbox;
					dateText.value.replace("/", "");
					var length = dateText.value.length;
					var dateFormat = rcmDatePicker.getDateFormat(dateText);
					// ignore all others
					if( !(event.keyCode == 46                                   // delete
							|| (event.keyCode >= 35 && event.keyCode <= 40)     // arrow keys/home/end
						    || (event.keyCode >= 48 && event.keyCode <= 57)     // numbers on keyboard
						    || (event.keyCode >= 96 && event.keyCode <= 105))   // number on keypad
					   ) {
						return;
					}
					if (dateFormat == defaultMonthDayYearForwardSlash || dateFormat == dayMonthYearForwardSlash) {
						if (length == 2) {
							dateText.value = dateText.value + '/';
						}
						
						if (length == 5) {
							dateText.value = dateText.value + '/';
						}
					}
					else if(dateFormat == dayMonthYearPeriod){
						if(length == 2){
							dateText.value = dateText.value + '.';
						}
						if(length == 5){
							dateText.value = dateText.value + '.';
						}
					}
					else if (dateFormat == dayMonthYearDash){
						if(length == 2){
							dateText.value = dateText.value + '-';
						}
						if(length == 5){
							dateText.value = dateText.value + '-';
						}
					}
					
					else if(dateFormat == yearMonthDayForwardSlash){
						if(length == 4){
							dateText.value = dateText.value + '/';
						}
						if(length == 7){
							dateText.value = dateText.value + '/';
						}
					}
					else if(dateFormat == yearMonthDayDash){
						if(length == 4){
							dateText.value = dateText.value + '-';
						}
						if(length == 7){
							dateText.value = dateText.value + "-";
						}
					}
				}
			};			
			// Initialize the date picker
			$(document).ready(function(){
				var dateTextBox = document.getElementById(textBoxId);
				dateTextBox.addDateSelectionListener = function(listener) {
					if (!this.dateSelectionListeners) {
						this.dateSelectionListeners = [];
					}
					this.dateSelectionListeners.push(listener);
				}
				$(function(){
					$.datepicker.setDefaults($.datepicker.regional['']);
					$(dateBoxId).datepicker($.extend({},$.datepicker.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
						showOn: 'button',
						buttonImage: component.getCriterion().static_content + '\\images\\4974.png',
						dateFormat: dateFormat.masks.shortDate3,
						buttonImageOnly: true,
						buttonText: i18n.RCM_DATEPICKER_TEXT,
						showOtherMonths: true,
						selectOtherMonths: true,
						showMonthAfterYear: false,
						beforeShow : function() {
							//set maximum z-index on the calendar pop-up.
							$('#ui-datepicker-div').css('z-index',9999999);
						},
						onSelect : function(dateText, inst) {
							if (dateTextBox.dateSelectionListeners) {
								for (var listener = 0, length = dateTextBox.dateSelectionListeners.length; listener < length; listener++) {
									dateTextBox.dateSelectionListeners[listener]();
								}
							}
							dateTextBox.focus();
						}
					}));
					RCM_Clinical_Util.setDate(textBoxId, new Date());
					
				});
				dateTextBox.onfocus = function() {
					rcmDatePicker.clearDateTextBox(dateTextBox);
				};
				dateTextBox.onblur = function() {
					rcmDatePicker.dateTextBoxLoseFocus(dateTextBox);
				};
				dateTextBox.onchange = function() {
					rcmDatePicker.dateTextBoxChange(dateTextBox);
				};
				dateTextBox.onkeypress = function(e) {
					var keynum;
					
					if(window.event){
						keynum = event.keyCode;
					}
					else if(e.which){
						keynum = e.which;
					}
					
					var currentDate = $(dateBoxId).datepicker("getDate");
					if(currentDate == null){
						currentDate = new Date();
					}

					var currentMonth = currentDate.getMonth();
					var currentYear = currentDate.getFullYear();
					
					if(keynum === 116){//t-today's date
						$(dateBoxId).datepicker('setDate', new Date());
					}
					else if(keynum === 119){//w-beginning of week
						var day = currentDate.getDay();
						var diff = currentDate.getDate() - day;
						var beginningOfWeek = new Date(currentDate.setDate(diff));
						$(dateBoxId).datepicker('setDate', beginningOfWeek);
					}
					else if(keynum === 107){//k-end of week
						var day = 6 - currentDate.getDay();
						var diff = currentDate.getDate() + day;
						var endOfWeek = new Date(currentDate.setDate(diff));
						$(dateBoxId).datepicker('setDate', endOfWeek);
					}
					else if(keynum === 121){//y-beginning of year
					  var beginningOfYear = new Date(currentYear, 0, 1);
					  $(dateBoxId).datepicker('setDate', beginningOfYear);
					}
					else if(keynum === 114){//r-end of year
					  var endOfYear = new Date(currentYear, 11, 31);
					   $(dateBoxId).datepicker('setDate', endOfYear);
					}
					else if(keynum === 109){//m-beginning of month
						var beginningOfMonth = new Date(currentYear, currentMonth, 1);
						$(dateBoxId).datepicker('setDate', beginningOfMonth);
					}
					else if(keynum === 104){//h-end of month
						var endOfMonth;
						
						if(currentMonth == 3 || currentMonth == 5  || currentMonth == 8 || currentMonth == 10){
							endOfMonth = new Date(currentYear, currentMonth, 30);
						}
						else if(currentMonth == 1){
							if(currentYear%400== 0 ||(currentYear%100 != 0 && currentYear%4 == 0)){
								endOfMonth = new Date(currentYear, currentMonth, 29);
							}
							else{
								endOfMonth = new Date(currentYear, currentMonth, 28);
							}
						}
						else{
							endOfMonth = new Date(currentYear, currentMonth, 31);
						}
						$(dateBoxId).datepicker('setDate', endOfMonth);
					}
					else if(keynum === 43 || keynum === 61){// + : increment day
						var nextDay = currentDate.getDate() + 1;
						var incrementDay = new Date(currentYear, currentMonth, nextDay);
						$(dateBoxId).datepicker('setDate', incrementDay);
					}
					else if(keynum === 45){// - : decrement day
						var previousDay = currentDate.getDate() - 1;
						var decrementDay = new Date(currentYear, currentMonth, previousDay);
						$(dateBoxId).datepicker('setDate', decrementDay);
					}
					rcmDatePicker.applyMask(dateTextBox);
				};
				dateTextBox.onkeydown = function(e) {// For special characters
					var keynum;
					
					if(window.event){
						keynum = event.keyCode;
					}
					else if(e.which){
						keynum = e.which;
					}
					
					var currentDate = $(dateBoxId).datepicker("getDate");
					if(currentDate == null){
						currentDate = new Date();
					}
					
					var currentMonth = currentDate.getMonth();
					var currentYear = currentDate.getFullYear();
					var currentDay = currentDate.getDate();
					
					if(keynum === 38){// UP ARROW : increment day
						var nextDay = currentDate.getDate() + 1;
						var incrementDay = new Date(currentYear, currentMonth, nextDay);
						$(dateBoxId).datepicker('setDate', incrementDay);
						return false; // Returning false cancels the default action performed by this key
					}
					else if(keynum === 40){// DOWN ARROW : decrement day
						var previousDay = currentDate.getDate() - 1;
						var decrementDay = new Date(currentYear, currentMonth, previousDay);
						$(dateBoxId).datepicker('setDate', decrementDay);
						return false;
					}
					else if(keynum === 33){// PAGE UP : increment month
						var incrementMonth = new Date(currentYear, currentMonth + 1, currentDay);
						$(dateBoxId).datepicker('setDate', incrementMonth);
						return false; // Returning false cancels the default action performed by this key
					}
					else if(keynum === 34){// PAGE DOWN : decrement month
						var decrementMonth = new Date(currentYear, currentMonth - 1, currentDay);
						$(dateBoxId).datepicker('setDate', decrementMonth);
						return false;
					}
					rcmDatePicker.applyMask(dateTextBox);
				};	
			});
			
			return rcmDatePicker;
		},
		//TODO: Is this used anywhere.  Seems outdated duplicate to previous function.
		addDatePickerButton : function(component, textBoxId, updateElementId) {
			$(document).ready(function(){
			var dateTextBox = document.getElementById(textBoxId);
			var dateBoxId = "#"+textBoxId;
			dateTextBox.style.display = "none";
			$(function(){
				var updateElement = document.getElementById(updateElementId);
				$.datepicker.setDefaults($.datepicker.regional['']);
				$(dateBoxId).datepicker($.extend({},$.datepicker.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
					showOn: 'button',
					dateFormat: dateFormat.masks.shortDate3,
					buttonImage: component.getCriterion().static_content + '\\images\\4974.png',
					buttonImageOnly: true,
					buttonText: i18n.RCM_DATEPICKER_TEXT,
					showOtherMonths: true,
					selectOtherMonths: true,
					showMonthAfterYear: false,
					beforeShow : function() {
						dateTextBox.style.display = "inline";
						dateTextBox.style.width = "1px";
						dateTextBox.style.height = "1px";
					},
					onClose : function() {
						var date = $(dateBoxId).datepicker("getDate");
						if (date) {
							updateElement.innerHTML = date.format('shortDate2'); 
						}
						dateTextBox.style.display = "none";
					}
				}));
				RCM_Clinical_Util.setDate(textBoxId, new Date());
			});
			});
		},
		
		showDatePicker : function(updateElement, anchorElementId) {	
			$(document).ready(function(){
			var anchorElement = document.getElementById(anchorElementId);
			if (anchorElement.isDateAttached) {				
				anchorElement.style.display = "inline";				
				$("#"+anchorElementId).datepicker('show');				
			}
			else {	
				$(function(){
					$("#"+anchorElementId).datepicker($.extend({},$.datepicker.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
						showOn: "focus",
						showOtherMonths: true,
						selectOtherMonths: true,
						showMonthAfterYear: false,
						
						onClose: function() { 
							var date = $("#"+anchorElementId).datepicker("getDate");
							if (date) {
								updateElement.innerHTML = date.format('shortDate2'); 
							}
							anchorElement.style.display = "none";
						}
					}));
					anchorElement.isDateAttached = true;
					anchorElement.style.display = "inline";						
					$("#"+anchorElementId).datepicker('show');
				});					
			}
			});
		}, 
		getDate : function(dateElementId) {
			var date;
			$(document).ready(function(){
				date = $("#"+dateElementId).datepicker("getDate");
			});
			return date;
		},
        getTime : function(elementId) {
            var time;
            $(document).ready(function(){
                time = $("#"+elementId).timeEntry('getTime');
            });
            return time;
        },	
        formatLongDate : function(date){
        	if (date) {
        		return date.format("dd-mmm-yyyy HH:MM:ss");
        	}
        	return "";
        },	
		formatDate : function(date) {
			if (date) {
				return date.format('shortDate2');
			}
			return "";
		},
		formatJsonDateString : function(dateString) {
			var formattedString = "";
			if (dateString && dateString !== "") {
				var date = new Date();
				date.setISO8601(dateString);
				formattedString = RCM_Clinical_Util.formatDate(date);
			}
			return formattedString;
		},
		formatJsonTimeString : function(dateString) {
			var formattedString = "";
			if (dateString && dateString !== "") {
				var date = new Date();
				date.setISO8601(dateString);
				if(i18n.SET24HOUR ){
					formattedString = date.format('HH:MM');
				}else{
					formattedString = date.format("hh:MM tt");
				}
			}
			return formattedString;
		},	
		formatJsonDateAndTimeString : function(dateString, format) {
			var formattedString = "";
			if (dateString && dateString !== "") {
				var date = new Date();
				date.setISO8601(dateString);
				if (format && format !== "")
				{	
					formattedString = date.format(format);
				}
				else
				{
					formattedString = date.format("longDateTime2");
				}	
			}
			return formattedString;
		},
		getTodaysDate: function(){
			var tempDay = new Date();
			var date = tempDay.format('shortDate2');
			return date;
		},
		
		getTodaysTime: function(){
			var now = new Date();
			if(i18n.SET24HOUR){
				var date = now.format('HH:MM');
			}else{
				var date = now.format("hh:MM tt");
			}
			return date;			
		},
		
		getDateString : function(dateElementId) {
			return this.formatDate(this.getDate(dateElementId));
		},
		setDateString : function(dateElementId, dateString) {
			var date = new Date();
			if (dateString && dateString.length > 0) {
				date.setISO8601(dateString);
				$(document).ready(function(){
					RCM_Clinical_Util.setDate(dateElementId, date);
				});
			}
			// allow set date to null
			else
			{
				$(document).ready(function(){
					RCM_Clinical_Util.setDate(dateElementId, null);
				});
			}
		},
		/**
		 * This should be used over the setDate function on the datepicker until the following jQuery bug is fixed:
		 * http://bugs.jqueryui.com/ticket/4198
		 * @param dateElementId The date element id.
		 * @param date The date to set.
		 */
		setDate : function(dateElementId, date) {
			var $dateField = $("#" + dateElementId);
			if(date) {
				var dateFormat = $dateField.datepicker('option', 'dateFormat');
				$dateField.val($.datepicker.formatDate(dateFormat, date));
			}
			else {
				$dateField.val("");
			}
		},
		setTimeString : function(elementId, dateString) {
			var date = new Date();
			if (dateString && dateString.length > 0) {
				date.setISO8601(dateString);
				$(document).ready(function(){
					$("#"+elementId).timeEntry("setTime", date);
				});
			}
			// allow set date to null
			else
			{
				$(document).ready(function(){
					$("#"+elementId).timeEntry("setTime", null);
				});
			}
		},		
		
		/**
		 * <p>Formats a date/time string into CCL date/time format. The date/time string must be 
		 * in the following format: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'", which is named "isoUtcDateTime" in 
		 * the date.format.js file. When popluated the date/time string should look similar to this string: 
		 * "2012-03-10T21:42:00Z". The format of the returned string is "dd-mmm-yyyy HH:MM:ss" whose symbols 
		 * are defined in the date.format.js file.</p>
		 *
		 * <p>NOTE: This method always sets the time in the returned string to (00:00:00). To preserve the time
		 * from the passed in date/time string use <code>formatDateAndTimeStringForSave</code> instead.</p> 
		 * 
		 * @param dateTimeString {String} The date/time string to format. 
		 * @returns A date/time string in a CCL date/time format.
		 */
		formatDateStringForSave : function(dateString) {
			var formattedString = [];
			if (dateString && dateString !== "") {
				var date = new Date();
				//TODO: setISO8601 would convert a string '10/19/2010' to '31-Dec-2009 00:00:00'
				date.setISO8601(dateString);
				formattedString.push(date.format("dd-mmm-yyyy"));
				formattedString.push(" 00:00:00");
			}
			return formattedString.join("");
		},	
		
		/**
		 * Formats a date/time string into CCL date/time format. The date/time string must be 
		 * in the following format: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'", which is named "isoUtcDateTime" in 
		 * the date.format.js file. When popluated the date/time string should look similar to this string: 
		 * "2012-03-10T21:42:00Z". The format of the returned string is "dd-mmm-yyyy HH:MM:ss" whose symbols 
		 * are defined in the date.format.js file.
		 * 
		 * @param dateTimeString {String} The date/time string to format. 
		 * @returns A date/time string in a CCL date/time format.
		 */
		formatDateAndTimeStringForSave : function(dateTimeString) {
			var formattedDateTime = "";		
			if (dateTimeString && dateTimeString !== "") {
				var date = new Date();
				date.setISO8601(dateTimeString);
				formattedDateTime = date.format("dd-mmm-yyyy HH:MM:ss");
			}
			return formattedDateTime;			
		},
		
		//turns HTML code and inserts escape codes to make it printable
		loggingHtmlToText : function(str) {
			return String(str).replace(/&/g, '&amp').replace(/</g, '&lt').replace(/>/g, '&gt').replace(/"/g, '&quot');
		},

		loggingFunctionFormatter : function(str){
			str = str.replace(/{/g, "{<br>").replace(/;/g, ";<br>").replace(/}/g, "}<br>");
			for(line in indent = 1, lines = str.split("<br>")) {
				if(lines.hasOwnProperty(line)) {
					if(lines[line].indexOf("}") > -1) indent--;
					lines[line] = new Array(((indent-1)*4)+1).join("&nbsp;") + lines[line];
					if(lines[line].indexOf("{") > -1) indent++;
				}
			}
			return lines.join("<br>");
		},

		loggingJsonFormatter : function(object) {	
			if (object != null){
				return JSON.stringify(object, undefined, 4).replace(/[ ]/g, "&nbsp;").replace(/\n/g, "<br />");
			}
			else{
				return "";
			}
		},
		
		loggingIsValidJsonToParse : function(str){
			try{
				JSON.parse(str);
			}
			catch (err){
				return false;
			}
			return true;
		},
		
		loggingParseParamAr : function(tempParamAr){
			var temp = JSON.stringify (tempParamAr[3]);
			temp = temp.replace(/\^/g, "").replace(/\\\"/g, "\"").replace(/(^[\"])|([\"]$)/g, "");
			if (RCM_Clinical_Util.loggingIsValidJsonToParse(temp)){
				temp = RCM_Clinical_Util.loggingJsonFormatter(JSON.parse(temp));
			}
			else{
				temp = "";
			}
			return tempParamAr[0] + "<br />" +
				tempParamAr[1] + "<br />" +
				tempParamAr[2] + "<br />" + 
				temp;
		},
		
		loggingJqxhrFormatter: function(tempJQXHR){
			var str = "";
			var jsonTemp = JSON.stringify(tempJQXHR.responseText).substring(1,(JSON.stringify(tempJQXHR.responseText).length-1)).replace(/\\\"/g, "\"");
			if(RCM_Clinical_Util.loggingIsValidJsonToParse(jsonTemp)){
				jsonTemp = JSON.parse (jsonTemp);
			}
			else{
				jsonTemp = tempJQXHR.responseText;
			}
			str += "Ready State: " + tempJQXHR.readyState + "<br />" +
			"Response Text: " + RCM_Clinical_Util.loggingJsonFormatter (jsonTemp) + "<br />" +
			"Status: " + tempJQXHR.status + "<br />" +
			"Status Text: " + tempJQXHR.statusText;
			return str;
		},

		makeCCLRequest : function(program, paramAr, async, statusHandler, isDecodeJSON, skipDebug) {
			var info = new XMLCclRequest();
			info.onreadystatechange = function(){
				var tempStatus;
				if (window.log && log.isBlackBirdActive()){
					tempStatus = RCM_Clinical_Util.loggingHtmlToText (statusHandler);
					tempStatus = RCM_Clinical_Util.loggingFunctionFormatter (tempStatus);
				}
				if (info.readyState === 4 && info.status === 200){	
					if (statusHandler) {
						var jsonEval = isDecodeJSON ? RCM_Clinical_Util.parseJSON(info.responseText) : JSON.parse(info.responseText);
						var recordData = jsonEval.RECORD_DATA;
						var jsonParamARTempString = "";
						if (window.log && log.isBlackBirdActive()){
							jsonParamARTempString = RCM_Clinical_Util.loggingParseParamAr(paramAr);
						}
						if (recordData.STATUS_DATA.STATUS === "Z") {
							if (window.log && !skipDebug && log.isBlackBirdActive()){
								log.debug(["Program: ", program,
								"<br />paramAr: ", jsonParamARTempString,
								"<br />Function: ", tempStatus, 
								"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
							}
							statusHandler("Z", recordData);
						}
						else if (recordData.STATUS_DATA.STATUS === "S") {
							if (recordData.STATUS === "STALE_DATA") {							
								statusHandler("STALE_DATA", recordData);
							} 
							else {
								if (window.log && !skipDebug && log.isBlackBirdActive()){
									log.debug(["Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ", tempStatus, 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}
								statusHandler("S", recordData);
							}
						}
						else {
							if (window.log && log.isBlackBirdActive()){
								log.error(["Program: ", program,
								"<br />paramAr: ", jsonParamARTempString,
								"<br />Function: ", tempStatus, 
								"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}
							statusHandler("F", recordData);
						}
					}
				}
				else if (info.readyState === 4 && info.status !== 200) {
					if(window.log && log.isBlackBirdActive()){
						log.error(["Program: ", program, 
						"<br />paramAr: ", paramAr.join(","), 
						"<br />Function: ", tempStatus, 
						"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
					}
					statusHandler("F", recordData);					
				}
			};
            info.open('GET', program, async);
            info.send(paramAr.join(","));
		},
		
		makeTimerCCLRequest : function(component, program, paramAr, async, statusHandler, isDecodeJSON) {
			var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
			var info = new XMLCclRequest();
			info.onreadystatechange = function(){
				if (info.readyState === 4 && info.status === 200){
					try {
						if (statusHandler) {
							var jsonEval = isDecodeJSON ? RCM_Clinical_Util.parseJSON(info.responseText) : JSON.parse(info.responseText);
							var recordData = jsonEval.RECORD_DATA;
							var jsonParamARTempString = ""; 
							if (window.log && log.isBlackBirdActive()){
								jsonParamARTempString = RCM_Clinical_Util.loggingParseParamAr(paramAr);
							}
							if (recordData.STATUS_DATA.STATUS === "Z") {
								statusHandler("Z", recordData);
								if (window.log && log.isBlackBirdActive()){
									log.debug(["Component: ", ( component ? component.getLabel() : ""),
									"<br />ID: ", ( component ? component.getComponentId() : ""),
									"<br />Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ",  RCM_Clinical_Util.loggingFunctionFormatter (statusHandler), 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}
							}
							else if (recordData.STATUS_DATA.STATUS === "S") {
								statusHandler("S", recordData);
								if (window.log && log.isBlackBirdActive()){
									log.debug(["Component: ", ( component ? component.getLabel() : ""),
									"<br />ID: ", ( component ? component.getComponentId() : ""),
									"<br />Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ",  RCM_Clinical_Util.loggingFunctionFormatter (statusHandler), 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}

							}
							else {
								var exceptionInfo = [];
								var debugErrorMessage = recordData.debugErrorMessage;
								var exceptionType = recordData.exceptionType;
								var entityType = recordData.entityType;
								var entityId = recordData.entityId;
								var combinedIntoId = recordData.combinedIntoId;
								exceptionInfo.push(debugErrorMessage, exceptionType, entityType, entityId, combinedIntoId);
								statusHandler("F", recordData, exceptionInfo.join(""));
								if (window.log && log.isBlackBirdActive()){	
									log.error(["Component: ", ( component ? component.getLabel() : ""),
									"<br />ID: ", ( component ? component.getComponentId() : ""),
									"<br />Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ",  RCM_Clinical_Util.loggingFunctionFormatter (statusHandler), 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}

							}
						}
					}
					catch (err) {
						 if (timerLoadComponent) {
	                         timerLoadComponent.Abort();
	                         timerLoadComponent = null;
	                     }
					}
				    finally {
	                     if (timerLoadComponent) 
	                         timerLoadComponent.Stop();
	                }
				}
				else if (info.readyState === 4 && info.status !== 200) {
					if (window.log && log.isBlackBirdActive()){
						log.error(["Component: ", ( component ? component.getLabel() : ""),
						"<br />ID: ", ( component ? component.getComponentId() : ""),
						"<br />Program: ", program, 
						"<br />paramAr: ", jsonParamARTempString,
						"<br />Function: ", statusHandler, 
						"<br />status: ", recordData.STATUS_DATA.STATUS, 
						"<br />RecordData: ", JSON.stringify(recordData.STATUS_DATA.STATUS)].join(""));
					}
					statusHandler("F", null, "Http status: " + info.status);	
					if (timerLoadComponent) {
						timerLoadComponent.Abort();
					}
				}
				
			};
            info.open('GET', program, async);
            info.send(paramAr.join(","));
		}, 
		
		addColumnVerticalScrolling : function(mPage, column1, column2, minContentHeight) {
			if (column1) {
				column1.style.overflowY = "scroll";			
			}
			if (column2) {
				column2.style.overflowY = "scroll";
			}
			
			document.documentElement.style.overflowY = "hidden";
			window.scrollTo(0,0);
			
			var heightRatio = mPage.isBannerEnabled() ? 85 : 75;
			var resizeFunction = function() {				
				var height = gvs()[0] - heightRatio;
				var styleHeight;
				if (height < minContentHeight) {
					styleHeight = height + "px";
				}
				else {
					styleHeight = height + "px";
				}
				if (column1) {
					column1.style.height = styleHeight;
				}
				if (column2) {
					column2.style.height = styleHeight;
				}
			};
			Util.addEvent(window, "resize", resizeFunction);
			resizeFunction();
			return resizeFunction;
		},
		
		removeColumnVerticalScrolling : function(column1, column2, resizeFunction) {
			if (column1) {
				column1.style.overflowY = "";
				column1.style.height = "";
			}
			if (column2) {
				column2.style.overflowY = "";
				column2.style.height = "";
			}
			
			document.documentElement.style.overflowY = "scroll";
			if(resizeFunction) {
				Util.removeEvent(window, "resize", resizeFunction);
			}
		},
		
		getElementsByClassName : function(parentElement, tagName, className) {
			return Util.Style.g(className, parentElement, tagName);
		},
		/**
		 * The method uses jQuery masked input plugin to mask text box.  
		 * The method takes two arguments: the text box id and the mask string.
		 */
		addMaskToTextBox : function(textBoxId, maskString) {
			jQuery(document).ready(function($) {var setMask = $("#"+textBoxId).mask(maskString, {placeholder : " "});});
		},
		
		/**
		 * The method uses jQuery masked input plugin to unmask text box.  
		 * The method takes one arguments: the text box id.
		 */
		unmaskTextBox : function(textBoxId) {
			jQuery(document).ready(function($) {var setMask = $("#"+textBoxId).unmask();});
		},
		
		addRequiredDecorator : function(element) {
			// Prevent all labels from being decorated when the element doesn't have an id
			if (!element.id) {
				return;
			}			
			var labels = document.getElementsByTagName("label");
			for ( var i = 0, length = labels.length; i < length; i++) {
				if (labels[i].htmlFor === element.id && labels[i].innerHTML.substring(13,27).toLowerCase().search("color: #cc0000") === -1) {
						labels[i].innerHTML = "<span style='color:#cc0000'>*</span>" + labels[i].innerHTML;
				}
			}
		},
		
		removeRequiredDecorator : function(element) {
			var labels = document.getElementsByTagName("label");
			for ( var i = 0, length = labels.length; i < length; i++) {
				if (labels[i].htmlFor === element.id && labels[i].innerHTML.substring(13,27).toLowerCase().search("color: #cc0000") !== -1) {
					labels[i].innerHTML = labels[i].innerHTML.substring(37);
				}
			}
		},
		
		/**
		 * This method masks the required field decoration.  
		 */
		maskRequiredField : function(textBoxId) {
			if (textBoxId) {
				var requiredTextBox = document.getElementById(textBoxId);
			}
			if (requiredTextBox) {
				// Attempt to add the required decorator (red star) in case it hasn't been added yet.
				RCM_Clinical_Util.addRequiredDecorator(requiredTextBox);
				if (requiredTextBox.type === "text" || requiredTextBox.type === "textarea" || requiredTextBox.type === "select-one"
					|| requiredTextBox.type === "select-multiple") {
						requiredTextBox.style.backgroundColor = '#FFFCE1';
				}	
			}
		},

		/**
		 * This method un-masks the required field decoration.
		 */
		umMaskRequiredField : function(textBoxId) {
			if (textBoxId) {
				var requiredTextBox = document.getElementById(textBoxId);
			}
			if (requiredTextBox) {
				if (requiredTextBox.type === "text" || requiredTextBox.type === "textarea" || requiredTextBox.type === "select-one"
					|| requiredTextBox.type == "select-multiple") {
					requiredTextBox.style.backgroundColor = 'transparent';
				}
			}
		},
		
		removeRequiredField : function(formObject, fieldId, fieldType, flexButtonIds) {
			var element = document.getElementById(fieldId);
			if(element && element.requiredCheck) {
				switch(fieldType.toLowerCase()) {
				case "date":
					break;
				case "select":
					Util.removeEvent(element,"change",element.requiredCheck);
					break;
				case "textarea":
				case "text":
				case "maskedtext":
					Util.removeEvent(element, "keydown", element.requiredCheckLater);
					Util.removeEvent(element, "paste", element.requiredCheckLater);
					Util.removeEvent(element, "cut", element.requiredCheckLater);
					Util.removeEvent(element, "drop", element.requiredCheckLater);
					break;
				case "radio":
					// TODO: Add a remove for radio buttons
					return;
					break;				
				}
				element.isRequired = undefined;
				element.requiredCheck = undefined;
				
				// Remove the element from the form object's required elements array.
				if (formObject.requiredElements) {
					for(var i = 0; i < formObject.requiredElements.length; i++) {
						if(formObject.requiredElements[i] === element) {
							formObject.requiredElements.splice(i,1);
							break;
						}
					}
				}
				
				// Update the flex buttons if there are no remaining 
				var disabled = RCM_Clinical_Util.isAnyFieldRequired(formObject);
				if (flexButtonIds && flexButtonIds.length > 0) {
					for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
						var flexButton = document.getElementById(flexButtonIds[id]);
						if (flexButton) {
							flexButton.disabled = disabled;
						}
					}
				}
				
				RCM_Clinical_Util.removeRequiredDecorator(element);
				RCM_Clinical_Util.umMaskRequiredField(fieldId);
			}
		},
		
		/**
		 * Sets a search control's required state.
		 * 
		 * @param isRequired {Boolean} Whether the search control is required or not.
		 * @param formObject {Object} formObject An object for containing a list of required fields. 
		 * @param {String} fieldId The id of the html element for the search control.
		 * @param {Object} searchControl The search control object.
		 * @param {Array} flexButtonIds (Optional) An array of an html button element ids that are disabled when at least one 
		 *   required field is showing its decoration.  Otherwise the buttons are enabled.
		 */
		setSearchControlRequired : function(isRequired, formObject, fieldId, searchControl, flexButtonIds) {
			var searchElement = document.getElementById(fieldId);
			if(searchElement) {
				if(isRequired && !searchElement.requiredCheck) {
					searchElement.isRequired = function() {
						return !searchControl.isVerified();
					};
					searchElement.requiredCheck = function() {
						var flexButtonsCount = flexButtonIds.length;
						if(flexButtonsCount > 0) {
							var disabled = searchElement.isRequired() || RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for(var i = 0; i < flexButtonsCount; i++) {
								var flexButton = document.getElementById(flexButtonIds[i]);
								if(flexButton) {
									flexButton.disabled = disabled;
								}
							}
						}
					};
					searchElement.requiredCheck();
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}
					formObject.requiredElements.push(searchElement);
					
					searchElement.verifyListener = function() {
						searchElement.requiredCheck();
					};
					searchControl.addVerifyStateChangeListener(searchElement.verifyListener);
				}
				else if(!isRequired && searchElement.requiredCheck) {
					searchElement.isRequired = undefined;
					searchElement.requiredCheck = undefined;
					for(var i = 0; i < formObject.requiredElements.length; i++) {
						if(formObject.requiredElements[i] === searchElement) {
							formObject.requiredElements.splice(i,1);
							break;
						}
					}
					searchControl.removeVerifyStateChangeListener(searchElement.verifyListener);
					searchElement.verifyListener = undefined;
					var flexButtonsCount = flexButtonIds.length;
					if(flexButtonsCount > 0) {
						var disabled = RCM_Clinical_Util.isAnyFieldRequired(formObject);
						for(var i = 0; i < flexButtonsCount; i++) {
							var flexButton = document.getElementById(flexButtonIds[i]);
							if(flexButton) {
								flexButton.disabled = disabled;
							}
						}
					}
				}
				searchControl.setRequired(isRequired);
			}
		},
		
		/**
		 * Returns true if any required field is displaying its decoration. Otherwise returns false.
		 * 
		 * @param {Object} formObject An object for containing a list of required fields. 
		 * @param {String} fieldId The id of an html element.
		 * @param {String} fieldType The type of field. The following types are currently supported: "date", "select", "text", "textarea", "radio".
		 * @param {Array} flexButtonIds (Optional) An array of an html button element ids that are disabled when at least one 
		 *   required field is showing its decoration.  Otherwise the buttons are enabled.
		 */
		addRequiredField : function(formObject, fieldId, fieldType, flexButtonIds) {
			var element = document.getElementById(fieldId);
			// If the field doesn't exist or is already required there is nothing to do here.
			if(element && !element.requiredCheck) {
				formObject.ignoreRequiredListeners = false;
				switch(fieldType.toLowerCase()) {
				case "date":
					var dateElement = element; 
					var validateListener = dateElement.onblur;
					var flexButtons = [];					
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					dateElement.isRequired = function() {
						var $dateInput = $("#" + fieldId);
						var dateVal = $dateInput.val();
						var dateFormat = $dateInput.datepicker('option', 'dateFormat');
						//TODO: We need to completely refactor how we handle dates so that I don't
						//      have to know that the date format from jquery is actually shorter than it displays.
						//      For example, mm/dd/yy is returned from jquery when something like 11/11/2010 is displayed.
						return (dateVal.length - 2 < dateFormat.length);
					};
					dateElement.requiredCheck = function() {
						var isRequired = false;
						if (validateListener) {
							validateListener();
							if (this.invalidDate) {
								isRequired = true;
							}
						}
						if(!isRequired) {
							isRequired = dateElement.isRequired();
							if(isRequired) {
								RCM_Clinical_Util.maskRequiredField(fieldId);
							} else {
								RCM_Clinical_Util.umMaskRequiredField(fieldId);	
							}
						}
						if (flexButtons.length > 0) {								
							var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for (var button = 0, length = flexButtons.length; button < length; button++) {
								flexButtons[button].disabled = disabled;	
							}						
						}
					};
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}	
					formObject.requiredElements.push(dateElement);
					dateElement.onblur = dateElement.requiredCheck;		
					if (dateElement.addDateSelectionListener) {
						dateElement.addDateSelectionListener(dateElement.requiredCheck);
					}
					
					RCM_Clinical_Util.addRequiredDecorator(dateElement);
					dateElement.requiredCheck();
					break;
				case "select":
					var selectElement = element;
					var flexButtons = [];
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					selectElement.isRequired = function() {
						var index = selectElement.selectedIndex;
						return index === -1 || selectElement.options[index].text === "";
					};
					selectElement.requiredCheck = function() {
						// Show required decoration when blank option first option is selected
						var isRequired = false;
						if (!selectElement.isRequired()) {
							RCM_Clinical_Util.umMaskRequiredField(fieldId);
						} else {
							RCM_Clinical_Util.maskRequiredField(fieldId);
							isRequired = true;
						}
						if (flexButtons.length > 0) {								
							var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for (var button = 0, length = flexButtons.length; button < length; button++) {
								flexButtons[button].disabled = disabled;	
							}
						}
					};
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}
					formObject.requiredElements.push(selectElement);
					Util.addEvent(selectElement, "change", selectElement.requiredCheck);
	
					RCM_Clinical_Util.addRequiredDecorator(selectElement);
					selectElement.requiredCheck();
					break;
				case "textarea":
				case "text":
				case "maskedtext":
					var textElement = element;
					var flexButtons = [];
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					textElement.isRequired = function() {
						if(fieldType.toLowerCase() === "maskedtext"){
							return $.trim(textElement.value).length === 0;
						}
						return textElement.value.length === 0;
					};
					textElement.requiredCheck = function() {
						var isRequired = textElement.isRequired();
						if (isRequired) {
							RCM_Clinical_Util.maskRequiredField(fieldId);
						} else {
							RCM_Clinical_Util.umMaskRequiredField(fieldId);
						}
						if (flexButtons.length > 0) {								
							var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for (var button = 0, length = flexButtons.length; button < length; button++) {
								flexButtons[button].disabled = disabled;	
							}
						}
					};
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}
					formObject.requiredElements.push(textElement);
					
					textElement.requiredCheckLater = function() {setTimeout(textElement.requiredCheck,1);};
					Util.addEvent(textElement, "keydown", textElement.requiredCheckLater);
					Util.addEvent(textElement, "paste", textElement.requiredCheckLater);
					Util.addEvent(textElement, "cut", textElement.requiredCheckLater);
					Util.addEvent(textElement, "drop", textElement.requiredCheckLater);
					
					RCM_Clinical_Util.addRequiredDecorator(textElement);
					textElement.requiredCheck();
					break;
				case "radio":					
					var firstRadioElement = element;
					// Find sibling radio buttons 
					var radioElements = $(firstRadioElement).nextAll("input[name='"+firstRadioElement.name+"']").get();
					radioElements.push(firstRadioElement);
					
					var flexButtons = [];
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					// Add listener to each radio button
					$.each(radioElements, function(index, radioElement) {
						// Default to marking the radio buttons as not required if at least one of them 
						// is checked. A custom is required function could easily be passed in if needed. 
						radioElement.isRequired = function() {
							return !(firstRadioElement.checked || $(firstRadioElement).nextAll(
									"input[name='"+firstRadioElement.name+"']:checked").length > 0);
						};
						radioElement.requiredCheck = function() {
							var isRequired = radioElement.isRequired();
							if (isRequired) {
								RCM_Clinical_Util.maskRequiredField(fieldId);
							} else {
								RCM_Clinical_Util.umMaskRequiredField(fieldId);
							}
							if (flexButtons.length > 0) {								
								var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
								for (var button = 0, length = flexButtons.length; button < length; button++) {
									flexButtons[button].disabled = disabled;	
								}
							}
						};
						if (!formObject.requiredElements) {
							formObject.requiredElements = [];
						}
						formObject.requiredElements.push(radioElement);					
						Util.addEvent(radioElement, "click", radioElement.requiredCheck);					
						RCM_Clinical_Util.addRequiredDecorator(radioElement);
					});
					firstRadioElement.requiredCheck();					
					break;
				}
			}
		},
		
		/**
		 * Returns true if any required field is displaying its decoration. Otherwise returns false.
		 * 
		 * @param {Object} formObject An object that contains a list of required fields. 
		 * @return {Boolean} Returns true if any required field is displaying its decoration. Otherwise returns false.
		 */
		isAnyFieldRequired : function(formObject) {
			if (!formObject.requiredElements) {
				return false;
			}
			for (var element = 0, length = formObject.requiredElements.length; element < length; element++) {
				if (formObject.requiredElements[element].isRequired()) {
					return true;
				}
			}
			return false;
		},		
		
		/**
		 * Calls the requiredCheck() method on each required field in a form. 
		 * 
		 * @param {Object} formObject An object that contains a list of required fields. 
		 */
		performRequiredFieldChecks : function(formObject) {
			if (formObject.requiredElements) {
				for (var element = 0, length = formObject.requiredElements.length; element < length; element++) {
					formObject.requiredElements[element].requiredCheck();
				}
			}
		},
		
		/**
		 */
		setMpFormatterLocale : function() {
			}
		}, 
		
		 *