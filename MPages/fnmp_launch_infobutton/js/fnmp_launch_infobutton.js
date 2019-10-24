/*** Project: fnmp_launch_infobutton.js ***/
/*!
* jQuery JavaScript Library v1.6.1
* http://jquery.com/
*
* Copyright 2011, John Resig
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* Includes Sizzle.js
* http://sizzlejs.com/
* Copyright 2011, The Dojo Foundation
* Released under the MIT, BSD, and GPL Licenses.
*
* Date: Thu May 12 15:04:36 2011 -0400
*/
(function (window, undefined) {

    // Use the correct document accordingly with window argument (sandbox)
    var document = window.document,
	navigator = window.navigator,
	location = window.location;
    var jQuery = (function () {

        // Define a local copy of jQuery
        var jQuery = function (selector, context) {
            // The jQuery object is actually just the init constructor 'enhanced'
            return new jQuery.fn.init(selector, context, rootjQuery);
        },

        // Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

        // Map over the $ in case of overwrite
	_$ = window.$,

        // A central reference to the root jQuery(document)
	rootjQuery,

        // A simple way to check for HTML strings or ID strings
        // (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

        // Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

        // Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

        // Check for digits
	rdigit = /\d/,

        // Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

        // JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

        // Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

        // Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

        // For matching the engine and version of the browser
	browserMatch,

        // The deferred used on DOM ready
	readyList,

        // The ready event handler
	DOMContentLoaded,

        // Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

        // [[Class]] -> type pairs
	class2type = {};

        jQuery.fn = jQuery.prototype = {
            constructor: jQuery,
            init: function (selector, context, rootjQuery) {
                var match, elem, ret, doc;

                // Handle $(""), $(null), or $(undefined)
                if (!selector) {
                    return this;
                }

                // Handle $(DOMElement)
                if (selector.nodeType) {
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                }

                // The body element only exists once, optimize finding it
                if (selector === "body" && !context && document.body) {
                    this.context = document;
                    this[0] = document.body;
                    this.selector = selector;
                    this.length = 1;
                    return this;
                }

                // Handle HTML strings
                if (typeof selector === "string") {
                    // Are we dealing with HTML string or an ID?
                    if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                        // Assume that strings that start and end with <> are HTML and skip the regex check
                        match = [null, selector, null];

                    } else {
                        match = quickExpr.exec(selector);
                    }

                    // Verify a match, and that no context was specified for #id
                    if (match && (match[1] || !context)) {

                        // HANDLE: $(html) -> $(array)
                        if (match[1]) {
                            context = context instanceof jQuery ? context[0] : context;
                            doc = (context ? context.ownerDocument || context : document);

                            // If a single string is passed in and it's a single tag
                            // just do a createElement and skip the rest
                            ret = rsingleTag.exec(selector);

                            if (ret) {
                                if (jQuery.isPlainObject(context)) {
                                    selector = [document.createElement(ret[1])];
                                    jQuery.fn.attr.call(selector, context, true);

                                } else {
                                    selector = [doc.createElement(ret[1])];
                                }

                            } else {
                                ret = jQuery.buildFragment([match[1]], [doc]);
                                selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
                            }

                            return jQuery.merge(this, selector);

                            // HANDLE: $("#id")
                        } else {
                            elem = document.getElementById(match[2]);

                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if (elem && elem.parentNode) {
                                // Handle the case where IE and Opera return items
                                // by name instead of ID
                                if (elem.id !== match[2]) {
                                    return rootjQuery.find(selector);
                                }

                                // Otherwise, we inject the element directly into the jQuery object
                                this.length = 1;
                                this[0] = elem;
                            }

                            this.context = document;
                            this.selector = selector;
                            return this;
                        }

                        // HANDLE: $(expr, $(...))
                    } else if (!context || context.jquery) {
                        return (context || rootjQuery).find(selector);

                        // HANDLE: $(expr, context)
                        // (which is just equivalent to: $(context).find(expr)
                    } else {
                        return this.constructor(context).find(selector);
                    }

                    // HANDLE: $(function)
                    // Shortcut for document ready
                } else if (jQuery.isFunction(selector)) {
                    return rootjQuery.ready(selector);
                }

                if (selector.selector !== undefined) {
                    this.selector = selector.selector;
                    this.context = selector.context;
                }

                return jQuery.makeArray(selector, this);
            },

            // Start with an empty selector
            selector: "",

            // The current version of jQuery being used
            jquery: "1.6.1",

            // The default length of a jQuery object is 0
            length: 0,

            // The number of elements contained in the matched element set
            size: function () {
                return this.length;
            },

            toArray: function () {
                return slice.call(this, 0);
            },

            // Get the Nth element in the matched element set OR
            // Get the whole matched element set as a clean array
            get: function (num) {
                return num == null ?

                // Return a 'clean' array
			this.toArray() :

                // Return just the object
			(num < 0 ? this[this.length + num] : this[num]);
            },

            // Take an array of elements and push it onto the stack
            // (returning the new matched element set)
            pushStack: function (elems, name, selector) {
                // Build a new jQuery matched element set
                var ret = this.constructor();

                if (jQuery.isArray(elems)) {
                    push.apply(ret, elems);

                } else {
                    jQuery.merge(ret, elems);
                }

                // Add the old object onto the stack (as a reference)
                ret.prevObject = this;

                ret.context = this.context;

                if (name === "find") {
                    ret.selector = this.selector + (this.selector ? " " : "") + selector;
                } else if (name) {
                    ret.selector = this.selector + "." + name + "(" + selector + ")";
                }

                // Return the newly-formed element set
                return ret;
            },

            // Execute a callback for every element in the matched set.
            // (You can seed the arguments with an array of args, but this is
            // only used internally.)
            each: function (callback, args) {
                return jQuery.each(this, callback, args);
            },

            ready: function (fn) {
                // Attach the listeners
                jQuery.bindReady();

                // Add the callback
                readyList.done(fn);

                return this;
            },

            eq: function (i) {
                return i === -1 ?
			this.slice(i) :
			this.slice(i, +i + 1);
            },

            first: function () {
                return this.eq(0);
            },

            last: function () {
                return this.eq(-1);
            },

            slice: function () {
                return this.pushStack(slice.apply(this, arguments),
			"slice", slice.call(arguments).join(","));
            },

            map: function (callback) {
                return this.pushStack(jQuery.map(this, function (elem, i) {
                    return callback.call(elem, i, elem);
                }));
            },

            end: function () {
                return this.prevObject || this.constructor(null);
            },

            // For internal use only.
            // Behaves like an Array's method, not like a jQuery method.
            push: push,
            sort: [].sort,
            splice: [].splice
        };

        // Give the init function the jQuery prototype for later instantiation
        jQuery.fn.init.prototype = jQuery.fn;

        jQuery.extend = jQuery.fn.extend = function () {
            var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !jQuery.isFunction(target)) {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if (length === i) {
                target = this;
                --i;
            }

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && jQuery.isArray(src) ? src : [];

                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = jQuery.extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

        jQuery.extend({
            noConflict: function (deep) {
                if (window.$ === jQuery) {
                    window.$ = _$;
                }

                if (deep && window.jQuery === jQuery) {
                    window.jQuery = _jQuery;
                }

                return jQuery;
            },

            // Is the DOM ready to be used? Set to true once it occurs.
            isReady: false,

            // A counter to track how many items to wait for before
            // the ready event fires. See #6781
            readyWait: 1,

            // Hold (or release) the ready event
            holdReady: function (hold) {
                if (hold) {
                    jQuery.readyWait++;
                } else {
                    jQuery.ready(true);
                }
            },

            // Handle when the DOM is ready
            ready: function (wait) {
                // Either a released hold or an DOMready/load event and not yet ready
                if ((wait === true && ! --jQuery.readyWait) || (wait !== true && !jQuery.isReady)) {
                    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                    if (!document.body) {
                        return setTimeout(jQuery.ready, 1);
                    }

                    // Remember that the DOM is ready
                    jQuery.isReady = true;

                    // If a normal DOM Ready event fired, decrement, and wait if need be
                    if (wait !== true && --jQuery.readyWait > 0) {
                        return;
                    }

                    // If there are functions bound, to execute
                    readyList.resolveWith(document, [jQuery]);

                    // Trigger any bound ready events
                    if (jQuery.fn.trigger) {
                        jQuery(document).trigger("ready").unbind("ready");
                    }
                }
            },

            bindReady: function () {
                if (readyList) {
                    return;
                }

                readyList = jQuery._Deferred();

                // Catch cases where $(document).ready() is called after the
                // browser event has already occurred.
                if (document.readyState === "complete") {
                    // Handle it asynchronously to allow scripts the opportunity to delay ready
                    return setTimeout(jQuery.ready, 1);
                }

                // Mozilla, Opera and webkit nightlies currently support this event
                if (document.addEventListener) {
                    // Use the handy event callback
                    document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

                    // A fallback to window.onload, that will always work
                    window.addEventListener("load", jQuery.ready, false);

                    // If IE event model is used
                } else if (document.attachEvent) {
                    // ensure firing before onload,
                    // maybe late but safe also for iframes
                    document.attachEvent("onreadystatechange", DOMContentLoaded);

                    // A fallback to window.onload, that will always work
                    window.attachEvent("onload", jQuery.ready);

                    // If IE and not a frame
                    // continually check to see if the document is ready
                    var toplevel = false;

                    try {
                        toplevel = window.frameElement == null;
                    } catch (e) { }

                    if (document.documentElement.doScroll && toplevel) {
                        doScrollCheck();
                    }
                }
            },

            // See test/unit/core.js for details concerning isFunction.
            // Since version 1.3, DOM methods and functions like alert
            // aren't supported. They return false on IE (#2968).
            isFunction: function (obj) {
                return jQuery.type(obj) === "function";
            },

            isArray: Array.isArray || function (obj) {
                return jQuery.type(obj) === "array";
            },

            // A crude way of determining if an object is a window
            isWindow: function (obj) {
                return obj && typeof obj === "object" && "setInterval" in obj;
            },

            isNaN: function (obj) {
                return obj == null || !rdigit.test(obj) || isNaN(obj);
            },

            type: function (obj) {
                return obj == null ?
			String(obj) :
			class2type[toString.call(obj)] || "object";
            },

            isPlainObject: function (obj) {
                // Must be an Object.
                // Because of IE, we also have to check the presence of the constructor property.
                // Make sure that DOM nodes and window objects don't pass through, as well
                if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                    return false;
                }

                // Not own constructor property must be Object
                if (obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }

                // Own properties are enumerated firstly, so to speed up,
                // if last one is own, then all properties are own.

                var key;
                for (key in obj) { }

                return key === undefined || hasOwn.call(obj, key);
            },

            isEmptyObject: function (obj) {
                for (var name in obj) {
                    return false;
                }
                return true;
            },

            error: function (msg) {
                throw msg;
            },

            parseJSON: function (data) {
                if (typeof data !== "string" || !data) {
                    return null;
                }

                // Make sure leading/trailing whitespace is removed (IE can't handle it)
                data = jQuery.trim(data);

                // Attempt to parse using the native JSON parser first
                if (window.JSON && window.JSON.parse) {
                    return window.JSON.parse(data);
                }

                // Make sure the incoming data is actual JSON
                // Logic borrowed from http://json.org/json2.js
                if (rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, ""))) {

                    return (new Function("return " + data))();

                }
                jQuery.error("Invalid JSON: " + data);
            },

            // Cross-browser xml parsing
            // (xml & tmp used internally)
            parseXML: function (data, xml, tmp) {

                if (window.DOMParser) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data, "text/xml");
                } else { // IE
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(data);
                }

                tmp = xml.documentElement;

                if (!tmp || !tmp.nodeName || tmp.nodeName === "parsererror") {
                    jQuery.error("Invalid XML: " + data);
                }

                return xml;
            },

            noop: function () { },

            // Evaluates a script in a global context
            // Workarounds based on findings by Jim Driscoll
            // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
            globalEval: function (data) {
                if (data && rnotwhite.test(data)) {
                    // We use execScript on Internet Explorer
                    // We use an anonymous function so that context is window
                    // rather than jQuery in Firefox
                    (window.execScript || function (data) {
                        window["eval"].call(window, data);
                    })(data);
                }
            },

            nodeName: function (elem, name) {
                return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
            },

            // args is for internal usage only
            each: function (object, callback, args) {
                var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

                if (args) {
                    if (isObj) {
                        for (name in object) {
                            if (callback.apply(object[name], args) === false) {
                                break;
                            }
                        }
                    } else {
                        for (; i < length;) {
                            if (callback.apply(object[i++], args) === false) {
                                break;
                            }
                        }
                    }

                    // A special, fast, case for the most common use of each
                } else {
                    if (isObj) {
                        for (name in object) {
                            if (callback.call(object[name], name, object[name]) === false) {
                                break;
                            }
                        }
                    } else {
                        for (; i < length;) {
                            if (callback.call(object[i], i, object[i++]) === false) {
                                break;
                            }
                        }
                    }
                }

                return object;
            },

            // Use native String.trim function wherever possible
            trim: trim ?
		function (text) {
		    return text == null ?
				"" :
				trim.call(text);
		} :

            // Otherwise use our own trimming functionality
		function (text) {
		    return text == null ?
				"" :
				text.toString().replace(trimLeft, "").replace(trimRight, "");
		},

            // results is for internal usage only
            makeArray: function (array, results) {
                var ret = results || [];

                if (array != null) {
                    // The window, strings (and functions) also have 'length'
                    // The extra typeof function check is to prevent crashes
                    // in Safari 2 (See: #3039)
                    // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                    var type = jQuery.type(array);

                    if (array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(array)) {
                        push.call(ret, array);
                    } else {
                        jQuery.merge(ret, array);
                    }
                }

                return ret;
            },

            inArray: function (elem, array) {

                if (indexOf) {
                    return indexOf.call(array, elem);
                }

                for (var i = 0, length = array.length; i < length; i++) {
                    if (array[i] === elem) {
                        return i;
                    }
                }

                return -1;
            },

            merge: function (first, second) {
                var i = first.length,
			j = 0;

                if (typeof second.length === "number") {
                    for (var l = second.length; j < l; j++) {
                        first[i++] = second[j];
                    }

                } else {
                    while (second[j] !== undefined) {
                        first[i++] = second[j++];
                    }
                }

                first.length = i;

                return first;
            },

            grep: function (elems, callback, inv) {
                var ret = [], retVal;
                inv = !!inv;

                // Go through the array, only saving the items
                // that pass the validator function
                for (var i = 0, length = elems.length; i < length; i++) {
                    retVal = !!callback(elems[i], i);
                    if (inv !== retVal) {
                        ret.push(elems[i]);
                    }
                }

                return ret;
            },

            // arg is for internal usage only
            map: function (elems, callback, arg) {
                var value, key, ret = [],
			i = 0,
			length = elems.length,
                // jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || jQuery.isArray(elems));

                // Go through the array, translating each of the items to their
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback(elems[i], i, arg);

                        if (value != null) {
                            ret[ret.length] = value;
                        }
                    }

                    // Go through every key on the object,
                } else {
                    for (key in elems) {
                        value = callback(elems[key], key, arg);

                        if (value != null) {
                            ret[ret.length] = value;
                        }
                    }
                }

                // Flatten any nested arrays
                return ret.concat.apply([], ret);
            },

            // A global GUID counter for objects
            guid: 1,

            // Bind a function to a context, optionally partially applying any
            // arguments.
            proxy: function (fn, context) {
                if (typeof context === "string") {
                    var tmp = fn[context];
                    context = fn;
                    fn = tmp;
                }

                // Quick check to determine if target is callable, in the spec
                // this throws a TypeError, but we will just return undefined.
                if (!jQuery.isFunction(fn)) {
                    return undefined;
                }

                // Simulated bind
                var args = slice.call(arguments, 2),
			proxy = function () {
			    return fn.apply(context, args.concat(slice.call(arguments)));
			};

                // Set the guid of unique handler to the same of original handler, so it can be removed
                proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

                return proxy;
            },

            // Mutifunctional method to get and set values to a collection
            // The value/s can be optionally by executed if its a function
            access: function (elems, key, value, exec, fn, pass) {
                var length = elems.length;

                // Setting many attributes
                if (typeof key === "object") {
                    for (var k in key) {
                        jQuery.access(elems, k, key[k], exec, fn, value);
                    }
                    return elems;
                }

                // Setting one attribute
                if (value !== undefined) {
                    // Optionally, function values get executed if exec is true
                    exec = !pass && exec && jQuery.isFunction(value);

                    for (var i = 0; i < length; i++) {
                        fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
                    }

                    return elems;
                }

                // Getting an attribute
                return length ? fn(elems[0], key) : undefined;
            },

            now: function () {
                return (new Date()).getTime();
            },

            // Use of jQuery.browser is frowned upon.
            // More details: http://docs.jquery.com/Utilities/jQuery.browser
            uaMatch: function (ua) {
                ua = ua.toLowerCase();

                var match = rwebkit.exec(ua) ||
			ropera.exec(ua) ||
			rmsie.exec(ua) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec(ua) ||
			[];

                return { browser: match[1] || "", version: match[2] || "0" };
            },

            sub: function () {
                function jQuerySub(selector, context) {
                    return new jQuerySub.fn.init(selector, context);
                }
                jQuery.extend(true, jQuerySub, this);
                jQuerySub.superclass = this;
                jQuerySub.fn = jQuerySub.prototype = this();
                jQuerySub.fn.constructor = jQuerySub;
                jQuerySub.sub = this.sub;
                jQuerySub.fn.init = function init(selector, context) {
                    if (context && context instanceof jQuery && !(context instanceof jQuerySub)) {
                        context = jQuerySub(context);
                    }

                    return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
                };
                jQuerySub.fn.init.prototype = jQuerySub.fn;
                var rootjQuerySub = jQuerySub(document);
                return jQuerySub;
            },

            browser: {}
        });

        // Populate the class2type map
        jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

        browserMatch = jQuery.uaMatch(userAgent);
        if (browserMatch.browser) {
            jQuery.browser[browserMatch.browser] = true;
            jQuery.browser.version = browserMatch.version;
        }

        // Deprecated, use jQuery.browser.webkit instead
        if (jQuery.browser.webkit) {
            jQuery.browser.safari = true;
        }

        // IE doesn't match non-breaking spaces with \s
        if (rnotwhite.test("\xA0")) {
            trimLeft = /^[\s\xA0]+/;
            trimRight = /[\s\xA0]+$/;
        }

        // All jQuery objects should point back to these
        rootjQuery = jQuery(document);

        // Cleanup functions for the document ready method
        if (document.addEventListener) {
            DOMContentLoaded = function () {
                document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                jQuery.ready();
            };

        } else if (document.attachEvent) {
            DOMContentLoaded = function () {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", DOMContentLoaded);
                    jQuery.ready();
                }
            };
        }

        // The DOM ready check for Internet Explorer
        function doScrollCheck() {
            if (jQuery.isReady) {
                return;
            }

            try {
                // If IE is used, use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                document.documentElement.doScroll("left");
            } catch (e) {
                setTimeout(doScrollCheck, 1);
                return;
            }

            // and execute any waiting functions
            jQuery.ready();
        }

        // Expose jQuery to the global object
        return jQuery;

    })();


    var // Promise methods
	promiseMethods = "done fail isResolved isRejected promise then always pipe".split(" "),
    // Static reference to slice
	sliceDeferred = [].slice;

    jQuery.extend({
        // Create a simple deferred (one callbacks list)
        _Deferred: function () {
            var // callbacks list
			callbacks = [],
            // stored [ context , args ]
			fired,
            // to avoid firing when already doing so
			firing,
            // flag to know if the deferred has been cancelled
			cancelled,
            // the deferred itself
			deferred = {

			    // done( f1, f2, ...)
			    done: function () {
			        if (!cancelled) {
			            var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
			            if (fired) {
			                _fired = fired;
			                fired = 0;
			            }
			            for (i = 0, length = args.length; i < length; i++) {
			                elem = args[i];
			                type = jQuery.type(elem);
			                if (type === "array") {
			                    deferred.done.apply(deferred, elem);
			                } else if (type === "function") {
			                    callbacks.push(elem);
			                }
			            }
			            if (_fired) {
			                deferred.resolveWith(_fired[0], _fired[1]);
			            }
			        }
			        return this;
			    },

			    // resolve with given context and args
			    resolveWith: function (context, args) {
			        if (!cancelled && !fired && !firing) {
			            // make sure args are available (#8421)
			            args = args || [];
			            firing = 1;
			            try {
			                while (callbacks[0]) {
			                    callbacks.shift().apply(context, args);
			                }
			            }
			            finally {
			                fired = [context, args];
			                firing = 0;
			            }
			        }
			        return this;
			    },

			    // resolve with this as context and given arguments
			    resolve: function () {
			        deferred.resolveWith(this, arguments);
			        return this;
			    },

			    // Has this deferred been resolved?
			    isResolved: function () {
			        return !!(firing || fired);
			    },

			    // Cancel
			    cancel: function () {
			        cancelled = 1;
			        callbacks = [];
			        return this;
			    }
			};

            return deferred;
        },

        // Full fledged deferred (two callbacks list)
        Deferred: function (func) {
            var deferred = jQuery._Deferred(),
			failDeferred = jQuery._Deferred(),
			promise;
            // Add errorDeferred methods, then and promise
            jQuery.extend(deferred, {
                then: function (doneCallbacks, failCallbacks) {
                    deferred.done(doneCallbacks).fail(failCallbacks);
                    return this;
                },
                always: function () {
                    return deferred.done.apply(deferred, arguments).fail.apply(this, arguments);
                },
                fail: failDeferred.done,
                rejectWith: failDeferred.resolveWith,
                reject: failDeferred.resolve,
                isRejected: failDeferred.isResolved,
                pipe: function (fnDone, fnFail) {
                    return jQuery.Deferred(function (newDefer) {
                        jQuery.each({
                            done: [fnDone, "resolve"],
                            fail: [fnFail, "reject"]
                        }, function (handler, data) {
                            var fn = data[0],
							action = data[1],
							returned;
                            if (jQuery.isFunction(fn)) {
                                deferred[handler](function () {
                                    returned = fn.apply(this, arguments);
                                    if (returned && jQuery.isFunction(returned.promise)) {
                                        returned.promise().then(newDefer.resolve, newDefer.reject);
                                    } else {
                                        newDefer[action](returned);
                                    }
                                });
                            } else {
                                deferred[handler](newDefer[action]);
                            }
                        });
                    }).promise();
                },
                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function (obj) {
                    if (obj == null) {
                        if (promise) {
                            return promise;
                        }
                        promise = obj = {};
                    }
                    var i = promiseMethods.length;
                    while (i--) {
                        obj[promiseMethods[i]] = deferred[promiseMethods[i]];
                    }
                    return obj;
                }
            });
            // Make sure only one callback list will be used
            deferred.done(failDeferred.cancel).fail(deferred.cancel);
            // Unexpose cancel
            delete deferred.cancel;
            // Call given func if any
            if (func) {
                func.call(deferred, deferred);
            }
            return deferred;
        },

        // Deferred helper
        when: function (firstParam) {
            var args = arguments,
			i = 0,
			length = args.length,
			count = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction(firstParam.promise) ?
                firstParam :
				jQuery.Deferred();
            function resolveFunc(i) {
                return function (value) {
                    args[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
                    if (!(--count)) {
                        // Strange bug in FF4:
                        // Values changed onto the arguments object sometimes end up as undefined values
                        // outside the $.when method. Cloning the object into a fresh array solves the issue
                        deferred.resolveWith(deferred, sliceDeferred.call(args, 0));
                    }
                };
            }
            if (length > 1) {
                for (; i < length; i++) {
                    if (args[i] && jQuery.isFunction(args[i].promise)) {
                        args[i].promise().then(resolveFunc(i), deferred.reject);
                    } else {
                        --count;
                    }
                }
                if (!count) {
                    deferred.resolveWith(deferred, args);
                }
            } else if (deferred !== firstParam) {
                deferred.resolveWith(deferred, length ? [firstParam] : []);
            }
            return deferred.promise();
        }
    });



    jQuery.support = (function () {

        var div = document.createElement("div"),
		documentElement = document.documentElement,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		support,
		fragment,
		body,
		bodyStyle,
		tds,
		events,
		eventName,
		i,
		isSupported;

        // Preliminary tests
        div.setAttribute("className", "t");
        div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

        all = div.getElementsByTagName("*");
        a = div.getElementsByTagName("a")[0];

        // Can't get basic test support
        if (!all || !all.length || !a) {
            return {};
        }

        // First batch of supports tests
        select = document.createElement("select");
        opt = select.appendChild(document.createElement("option"));
        input = div.getElementsByTagName("input")[0];

        support = {
            // IE strips leading whitespace when .innerHTML is used
            leadingWhitespace: (div.firstChild.nodeType === 3),

            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            tbody: !div.getElementsByTagName("tbody").length,

            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            htmlSerialize: !!div.getElementsByTagName("link").length,

            // Get the style information from getAttribute
            // (IE uses .cssText instead)
            style: /top/.test(a.getAttribute("style")),

            // Make sure that URLs aren't manipulated
            // (IE normalizes it by default)
            hrefNormalized: (a.getAttribute("href") === "/a"),

            // Make sure that element opacity exists
            // (IE uses filter instead)
            // Use a regex to work around a WebKit issue. See #5145
            opacity: /^0.55$/.test(a.style.opacity),

            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            cssFloat: !!a.style.cssFloat,

            // Make sure that if no value is specified for a checkbox
            // that it defaults to "on".
            // (WebKit defaults to "" instead)
            checkOn: (input.value === "on"),

            // Make sure that a selected-by-default option has a working selected property.
            // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
            optSelected: opt.selected,

            // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
            getSetAttribute: div.className !== "t",

            // Will be defined later
            submitBubbles: true,
            changeBubbles: true,
            focusinBubbles: false,
            deleteExpando: true,
            noCloneEvent: true,
            inlineBlockNeedsLayout: false,
            shrinkWrapBlocks: false,
            reliableMarginRight: true
        };

        // Make sure checked status is properly cloned
        input.checked = true;
        support.noCloneChecked = input.cloneNode(true).checked;

        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = true;
        support.optDisabled = !opt.disabled;

        // Test to see if it's possible to delete an expando from an element
        // Fails in Internet Explorer
        try {
            delete div.test;
        } catch (e) {
            support.deleteExpando = false;
        }

        if (!div.addEventListener && div.attachEvent && div.fireEvent) {
            div.attachEvent("onclick", function click() {
                // Cloning a node shouldn't copy over any
                // bound event handlers (IE does this)
                support.noCloneEvent = false;
                div.detachEvent("onclick", click);
            });
            div.cloneNode(true).fireEvent("onclick");
        }

        // Check if a radio maintains it's value
        // after being appended to the DOM
        input = document.createElement("input");
        input.value = "t";
        input.setAttribute("type", "radio");
        support.radioValue = input.value === "t";

        input.setAttribute("checked", "checked");
        div.appendChild(input);
        fragment = document.createDocumentFragment();
        fragment.appendChild(div.firstChild);

        // WebKit doesn't clone checked state correctly in fragments
        support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

        div.innerHTML = "";

        // Figure out if the W3C box model works as expected
        div.style.width = div.style.paddingLeft = "1px";

        // We use our own, invisible, body
        body = document.createElement("body");
        bodyStyle = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            // Set background to avoid IE crashes when removing (#9028)
            background: "none"
        };
        for (i in bodyStyle) {
            body.style[i] = bodyStyle[i];
        }
        body.appendChild(div);
        documentElement.insertBefore(body, documentElement.firstChild);

        // Check if a disconnected checkbox will retain its checked
        // value of true after appended to the DOM (IE6/7)
        support.appendChecked = input.checked;

        support.boxModel = div.offsetWidth === 2;

        if ("zoom" in div.style) {
            // Check if natively block-level elements act like inline-block
            // elements when setting their display to 'inline' and giving
            // them layout
            // (IE < 8 does this)
            div.style.display = "inline";
            div.style.zoom = 1;
            support.inlineBlockNeedsLayout = (div.offsetWidth === 2);

            // Check if elements with layout shrink-wrap their children
            // (IE 6 does this)
            div.style.display = "";
            div.innerHTML = "<div style='width:4px;'></div>";
            support.shrinkWrapBlocks = (div.offsetWidth !== 2);
        }

        div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
        tds = div.getElementsByTagName("td");

        // Check if table cells still have offsetWidth/Height when they are set
        // to display:none and there are still other visible table cells in a
        // table row; if so, offsetWidth/Height are not reliable for use when
        // determining if an element has been hidden directly using
        // display:none (it is still safe to use offsets if a parent element is
        // hidden; don safety goggles and see bug #4512 for more information).
        // (only IE 8 fails this test)
        isSupported = (tds[0].offsetHeight === 0);

        tds[0].style.display = "";
        tds[1].style.display = "none";

        // Check if empty table cells still have offsetWidth/Height
        // (IE < 8 fail this test)
        support.reliableHiddenOffsets = isSupported && (tds[0].offsetHeight === 0);
        div.innerHTML = "";

        // Check if div with explicit width and no margin-right incorrectly
        // gets computed margin-right based on width of container. For more
        // info see bug #3333
        // Fails in WebKit before Feb 2011 nightlies
        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
        if (document.defaultView && document.defaultView.getComputedStyle) {
            marginDiv = document.createElement("div");
            marginDiv.style.width = "0";
            marginDiv.style.marginRight = "0";
            div.appendChild(marginDiv);
            support.reliableMarginRight =
			(parseInt((document.defaultView.getComputedStyle(marginDiv, null) || { marginRight: 0 }).marginRight, 10) || 0) === 0;
        }

        // Remove the body element we added
        body.innerHTML = "";
        documentElement.removeChild(body);

        // Technique from Juriy Zaytsev
        // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
        // We only care about the case where non-standard event systems
        // are used, namely in IE. Short-circuiting here helps us to
        // avoid an eval call (in setAttribute) which can cause CSP
        // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
        if (div.attachEvent) {
            for (i in {
                submit: 1,
                change: 1,
                focusin: 1
            }) {
                eventName = "on" + i;
                isSupported = (eventName in div);
                if (!isSupported) {
                    div.setAttribute(eventName, "return;");
                    isSupported = (typeof div[eventName] === "function");
                }
                support[i + "Bubbles"] = isSupported;
            }
        }

        return support;
    })();

    // Keep track of boxModel
    jQuery.boxModel = jQuery.support.boxModel;




    var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([a-z])([A-Z])/g;

    jQuery.extend({
        cache: {},

        // Please use with caution
        uuid: 0,

        // Unique for each copy of jQuery on the page
        // Non-digits removed to match rinlinejQuery
        expando: "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ""),

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "embed": true,
            // Ban all objects except for Flash (which handle expandos)
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            "applet": true
        },

        hasData: function (elem) {
            elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];

            return !!elem && !isEmptyDataObject(elem);
        },

        data: function (elem, name, data, pvt /* Internal Use Only */) {
            if (!jQuery.acceptData(elem)) {
                return;
            }

            var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

            // We have to handle DOM nodes and JS objects differently because IE6-7
            // can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

            // Only DOM nodes need the global jQuery cache; JS object data is
            // attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

            // Only defining an ID for JS objects if its cache already exists allows
            // the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[jQuery.expando] : elem[jQuery.expando] && jQuery.expando;

            // Avoid doing any more work than we need to when trying to get data on an
            // object that has no data at all
            if ((!id || (pvt && id && !cache[id][internalKey])) && getByName && data === undefined) {
                return;
            }

            if (!id) {
                // Only DOM nodes need a new unique ID for each element since their data
                // ends up in the global cache
                if (isNode) {
                    elem[jQuery.expando] = id = ++jQuery.uuid;
                } else {
                    id = jQuery.expando;
                }
            }

            if (!cache[id]) {
                cache[id] = {};

                // TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
                // metadata on plain JS objects when the object is serialized using
                // JSON.stringify
                if (!isNode) {
                    cache[id].toJSON = jQuery.noop;
                }
            }

            // An object can be passed to jQuery.data instead of a key/value pair; this gets
            // shallow copied over onto the existing cache
            if (typeof name === "object" || typeof name === "function") {
                if (pvt) {
                    cache[id][internalKey] = jQuery.extend(cache[id][internalKey], name);
                } else {
                    cache[id] = jQuery.extend(cache[id], name);
                }
            }

            thisCache = cache[id];

            // Internal jQuery data is stored in a separate object inside the object's data
            // cache in order to avoid key collisions between internal data and user-defined
            // data
            if (pvt) {
                if (!thisCache[internalKey]) {
                    thisCache[internalKey] = {};
                }

                thisCache = thisCache[internalKey];
            }

            if (data !== undefined) {
                thisCache[jQuery.camelCase(name)] = data;
            }

            // TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
            // not attempt to inspect the internal events object using jQuery.data, as this
            // internal data object is undocumented and subject to change.
            if (name === "events" && !thisCache[name]) {
                return thisCache[internalKey] && thisCache[internalKey].events;
            }

            return getByName ? thisCache[jQuery.camelCase(name)] : thisCache;
        },

        removeData: function (elem, name, pvt /* Internal Use Only */) {
            if (!jQuery.acceptData(elem)) {
                return;
            }

            var internalKey = jQuery.expando, isNode = elem.nodeType,

            // See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

            // See jQuery.data for more information
			id = isNode ? elem[jQuery.expando] : jQuery.expando;

            // If there is already no cache entry for this object, there is no
            // purpose in continuing
            if (!cache[id]) {
                return;
            }

            if (name) {
                var thisCache = pvt ? cache[id][internalKey] : cache[id];

                if (thisCache) {
                    delete thisCache[name];

                    // If there is no data left in the cache, we want to continue
                    // and let the cache object itself get destroyed
                    if (!isEmptyDataObject(thisCache)) {
                        return;
                    }
                }
            }

            // See jQuery.data for more information
            if (pvt) {
                delete cache[id][internalKey];

                // Don't destroy the parent cache unless the internal data object
                // had been the only thing left in it
                if (!isEmptyDataObject(cache[id])) {
                    return;
                }
            }

            var internalCache = cache[id][internalKey];

            // Browsers that fail expando deletion also refuse to delete expandos on
            // the window, but it will allow it on all other JS objects; other browsers
            // don't care
            if (jQuery.support.deleteExpando || cache != window) {
                delete cache[id];
            } else {
                cache[id] = null;
            }

            // We destroyed the entire user cache at once because it's faster than
            // iterating through each key, but we need to continue to persist internal
            // data if it existed
            if (internalCache) {
                cache[id] = {};
                // TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
                // metadata on plain JS objects when the object is serialized using
                // JSON.stringify
                if (!isNode) {
                    cache[id].toJSON = jQuery.noop;
                }

                cache[id][internalKey] = internalCache;

                // Otherwise, we need to eliminate the expando on the node to avoid
                // false lookups in the cache for entries that no longer exist
            } else if (isNode) {
                // IE does not allow us to delete expando properties from nodes,
                // nor does it have a removeAttribute function on Document nodes;
                // we must handle all of these cases
                if (jQuery.support.deleteExpando) {
                    delete elem[jQuery.expando];
                } else if (elem.removeAttribute) {
                    elem.removeAttribute(jQuery.expando);
                } else {
                    elem[jQuery.expando] = null;
                }
            }
        },

        // For internal use only.
        _data: function (elem, name, data) {
            return jQuery.data(elem, name, data, true);
        },

        // A method for determining if a DOM node can handle the data expando
        acceptData: function (elem) {
            if (elem.nodeName) {
                var match = jQuery.noData[elem.nodeName.toLowerCase()];

                if (match) {
                    return !(match === true || elem.getAttribute("classid") !== match);
                }
            }

            return true;
        }
    });

    jQuery.fn.extend({
        data: function (key, value) {
            var data = null;

            if (typeof key === "undefined") {
                if (this.length) {
                    data = jQuery.data(this[0]);

                    if (this[0].nodeType === 1) {
                        var attr = this[0].attributes, name;
                        for (var i = 0, l = attr.length; i < l; i++) {
                            name = attr[i].name;

                            if (name.indexOf("data-") === 0) {
                                name = jQuery.camelCase(name.substring(5));

                                dataAttr(this[0], name, data[name]);
                            }
                        }
                    }
                }

                return data;

            } else if (typeof key === "object") {
                return this.each(function () {
                    jQuery.data(this, key);
                });
            }

            var parts = key.split(".");
            parts[1] = parts[1] ? "." + parts[1] : "";

            if (value === undefined) {
                data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

                // Try to fetch any internally stored data first
                if (data === undefined && this.length) {
                    data = jQuery.data(this[0], key);
                    data = dataAttr(this[0], key, data);
                }

                return data === undefined && parts[1] ?
				this.data(parts[0]) :
				data;

            } else {
                return this.each(function () {
                    var $this = jQuery(this),
					args = [parts[0], value];

                    $this.triggerHandler("setData" + parts[1] + "!", args);
                    jQuery.data(this, key, value);
                    $this.triggerHandler("changeData" + parts[1] + "!", args);
                });
            }
        },

        removeData: function (key) {
            return this.each(function () {
                jQuery.removeData(this, key);
            });
        }
    });

    function dataAttr(elem, key, data) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if (data === undefined && elem.nodeType === 1) {
            var name = "data-" + key.replace(rmultiDash, "$1-$2").toLowerCase();

            data = elem.getAttribute(name);

            if (typeof data === "string") {
                try {
                    data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN(data) ? parseFloat(data) :
					rbrace.test(data) ? jQuery.parseJSON(data) :
					data;
                } catch (e) { }

                // Make sure we set the data so it isn't changed later
                jQuery.data(elem, key, data);

            } else {
                data = undefined;
            }
        }

        return data;
    }

    // TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
    // property to be considered empty objects; this property always exists in
    // order to make sure JSON.stringify does not expose internal metadata
    function isEmptyDataObject(obj) {
        for (var name in obj) {
            if (name !== "toJSON") {
                return false;
            }
        }

        return true;
    }




    function handleQueueMarkDefer(elem, type, src) {
        var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery.data(elem, deferDataKey, undefined, true);
        if (defer &&
		(src === "queue" || !jQuery.data(elem, queueDataKey, undefined, true)) &&
		(src === "mark" || !jQuery.data(elem, markDataKey, undefined, true))) {
            // Give room for hard-coded callbacks to fire first
            // and eventually mark/queue something else on the element
            setTimeout(function () {
                if (!jQuery.data(elem, queueDataKey, undefined, true) &&
				!jQuery.data(elem, markDataKey, undefined, true)) {
                    jQuery.removeData(elem, deferDataKey, true);
                    defer.resolve();
                }
            }, 0);
        }
    }

    jQuery.extend({

        _mark: function (elem, type) {
            if (elem) {
                type = (type || "fx") + "mark";
                jQuery.data(elem, type, (jQuery.data(elem, type, undefined, true) || 0) + 1, true);
            }
        },

        _unmark: function (force, elem, type) {
            if (force !== true) {
                type = elem;
                elem = force;
                force = false;
            }
            if (elem) {
                type = type || "fx";
                var key = type + "mark",
				count = force ? 0 : ((jQuery.data(elem, key, undefined, true) || 1) - 1);
                if (count) {
                    jQuery.data(elem, key, count, true);
                } else {
                    jQuery.removeData(elem, key, true);
                    handleQueueMarkDefer(elem, type, "mark");
                }
            }
        },

        queue: function (elem, type, data) {
            if (elem) {
                type = (type || "fx") + "queue";
                var q = jQuery.data(elem, type, undefined, true);
                // Speed up dequeue by getting out quickly if this is just a lookup
                if (data) {
                    if (!q || jQuery.isArray(data)) {
                        q = jQuery.data(elem, type, jQuery.makeArray(data), true);
                    } else {
                        q.push(data);
                    }
                }
                return q || [];
            }
        },

        dequeue: function (elem, type) {
            type = type || "fx";

            var queue = jQuery.queue(elem, type),
			fn = queue.shift(),
			defer;

            // If the fx queue is dequeued, always remove the progress sentinel
            if (fn === "inprogress") {
                fn = queue.shift();
            }

            if (fn) {
                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                fn.call(elem, function () {
                    jQuery.dequeue(elem, type);
                });
            }

            if (!queue.length) {
                jQuery.removeData(elem, type + "queue", true);
                handleQueueMarkDefer(elem, type, "queue");
            }
        }
    });

    jQuery.fn.extend({
        queue: function (type, data) {
            if (typeof type !== "string") {
                data = type;
                type = "fx";
            }

            if (data === undefined) {
                return jQuery.queue(this[0], type);
            }
            return this.each(function () {
                var queue = jQuery.queue(this, type, data);

                if (type === "fx" && queue[0] !== "inprogress") {
                    jQuery.dequeue(this, type);
                }
            });
        },
        dequeue: function (type) {
            return this.each(function () {
                jQuery.dequeue(this, type);
            });
        },
        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function (time, type) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || "fx";

            return this.queue(type, function () {
                var elem = this;
                setTimeout(function () {
                    jQuery.dequeue(elem, type);
                }, time);
            });
        },
        clearQueue: function (type) {
            return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function (type, object) {
            if (typeof type !== "string") {
                object = type;
                type = undefined;
            }
            type = type || "fx";
            var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
            function resolve() {
                if (!(--count)) {
                    defer.resolveWith(elements, [elements]);
                }
            }
            while (i--) {
                if ((tmp = jQuery.data(elements[i], deferDataKey, undefined, true) ||
					(jQuery.data(elements[i], queueDataKey, undefined, true) ||
						jQuery.data(elements[i], markDataKey, undefined, true)) &&
					jQuery.data(elements[i], deferDataKey, jQuery._Deferred(), true))) {
                    count++;
                    tmp.done(resolve);
                }
            }
            resolve();
            return defer.promise();
        }
    });




    var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	rinvalidChar = /\:/,
	formHook, boolHook;

    jQuery.fn.extend({
        attr: function (name, value) {
            return jQuery.access(this, name, value, true, jQuery.attr);
        },

        removeAttr: function (name) {
            return this.each(function () {
                jQuery.removeAttr(this, name);
            });
        },

        prop: function (name, value) {
            return jQuery.access(this, name, value, true, jQuery.prop);
        },

        removeProp: function (name) {
            name = jQuery.propFix[name] || name;
            return this.each(function () {
                // try/catch handles cases where IE balks (such as removing a property on window)
                try {
                    this[name] = undefined;
                    delete this[name];
                } catch (e) { }
            });
        },

        addClass: function (value) {
            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    self.addClass(value.call(this, i, self.attr("class") || ""));
                });
            }

            if (value && typeof value === "string") {
                var classNames = (value || "").split(rspace);

                for (var i = 0, l = this.length; i < l; i++) {
                    var elem = this[i];

                    if (elem.nodeType === 1) {
                        if (!elem.className) {
                            elem.className = value;

                        } else {
                            var className = " " + elem.className + " ",
							setClass = elem.className;

                            for (var c = 0, cl = classNames.length; c < cl; c++) {
                                if (className.indexOf(" " + classNames[c] + " ") < 0) {
                                    setClass += " " + classNames[c];
                                }
                            }
                            elem.className = jQuery.trim(setClass);
                        }
                    }
                }
            }

            return this;
        },

        removeClass: function (value) {
            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    self.removeClass(value.call(this, i, self.attr("class")));
                });
            }

            if ((value && typeof value === "string") || value === undefined) {
                var classNames = (value || "").split(rspace);

                for (var i = 0, l = this.length; i < l; i++) {
                    var elem = this[i];

                    if (elem.nodeType === 1 && elem.className) {
                        if (value) {
                            var className = (" " + elem.className + " ").replace(rclass, " ");
                            for (var c = 0, cl = classNames.length; c < cl; c++) {
                                className = className.replace(" " + classNames[c] + " ", " ");
                            }
                            elem.className = jQuery.trim(className);

                        } else {
                            elem.className = "";
                        }
                    }
                }
            }

            return this;
        },

        toggleClass: function (value, stateVal) {
            var type = typeof value,
			isBool = typeof stateVal === "boolean";

            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    self.toggleClass(value.call(this, i, self.attr("class"), stateVal), stateVal);
                });
            }

            return this.each(function () {
                if (type === "string") {
                    // toggle individual class names
                    var className,
					i = 0,
					self = jQuery(this),
					state = stateVal,
					classNames = value.split(rspace);

                    while ((className = classNames[i++])) {
                        // check each className given, space seperated list
                        state = isBool ? state : !self.hasClass(className);
                        self[state ? "addClass" : "removeClass"](className);
                    }

                } else if (type === "undefined" || type === "boolean") {
                    if (this.className) {
                        // store className if set
                        jQuery._data(this, "__className__", this.className);
                    }

                    // toggle whole className
                    this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
                }
            });
        },

        hasClass: function (selector) {
            var className = " " + selector + " ";
            for (var i = 0, l = this.length; i < l; i++) {
                if ((" " + this[i].className + " ").replace(rclass, " ").indexOf(className) > -1) {
                    return true;
                }
            }

            return false;
        },

        val: function (value) {
            var hooks, ret,
			elem = this[0];

            if (!arguments.length) {
                if (elem) {
                    hooks = jQuery.valHooks[elem.nodeName.toLowerCase()] || jQuery.valHooks[elem.type];

                    if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                        return ret;
                    }

                    return (elem.value || "").replace(rreturn, "");
                }

                return undefined;
            }

            var isFunction = jQuery.isFunction(value);

            return this.each(function (i) {
                var self = jQuery(this), val;

                if (this.nodeType !== 1) {
                    return;
                }

                if (isFunction) {
                    val = value.call(this, i, self.val());
                } else {
                    val = value;
                }

                // Treat null/undefined as ""; convert numbers to string
                if (val == null) {
                    val = "";
                } else if (typeof val === "number") {
                    val += "";
                } else if (jQuery.isArray(val)) {
                    val = jQuery.map(val, function (value) {
                        return value == null ? "" : value + "";
                    });
                }

                hooks = jQuery.valHooks[this.nodeName.toLowerCase()] || jQuery.valHooks[this.type];

                // If set returns undefined, fall back to normal setting
                if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                    this.value = val;
                }
            });
        }
    });

    jQuery.extend({
        valHooks: {
            option: {
                get: function (elem) {
                    // attributes.value is undefined in Blackberry 4.7 but
                    // uses .value. See #6932
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function (elem) {
                    var value,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

                    // Nothing was selected
                    if (index < 0) {
                        return null;
                    }

                    // Loop through all the selected options
                    for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++) {
                        var option = options[i];

                        // Don't return options that are disabled or in a disabled optgroup
                        if (option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {

                            // Get the specific value for the option
                            value = jQuery(option).val();

                            // We don't need an array for one selects
                            if (one) {
                                return value;
                            }

                            // Multi-Selects return an array
                            values.push(value);
                        }
                    }

                    // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
                    if (one && !values.length && options.length) {
                        return jQuery(options[index]).val();
                    }

                    return values;
                },

                set: function (elem, value) {
                    var values = jQuery.makeArray(value);

                    jQuery(elem).find("option").each(function () {
                        this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
                    });

                    if (!values.length) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        },

        attrFn: {
            val: true,
            css: true,
            html: true,
            text: true,
            data: true,
            width: true,
            height: true,
            offset: true
        },

        attrFix: {
            // Always normalize to ensure hook usage
            tabindex: "tabIndex"
        },

        attr: function (elem, name, value, pass) {
            var nType = elem.nodeType;

            // don't get/set attributes on text, comment and attribute nodes
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return undefined;
            }

            if (pass && name in jQuery.attrFn) {
                return jQuery(elem)[name](value);
            }

            // Fallback to prop when attributes are not supported
            if (!("getAttribute" in elem)) {
                return jQuery.prop(elem, name, value);
            }

            var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

            // Normalize the name if needed
            name = notxml && jQuery.attrFix[name] || name;

            hooks = jQuery.attrHooks[name];

            if (!hooks) {
                // Use boolHook for boolean attributes
                if (rboolean.test(name) &&
				(typeof value === "boolean" || value === undefined || value.toLowerCase() === name.toLowerCase())) {

                    hooks = boolHook;

                    // Use formHook for forms and if the name contains certain characters
                } else if (formHook && (jQuery.nodeName(elem, "form") || rinvalidChar.test(name))) {
                    hooks = formHook;
                }
            }

            if (value !== undefined) {

                if (value === null) {
                    jQuery.removeAttr(elem, name);
                    return undefined;

                } else if (hooks && "set" in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;

                } else {
                    elem.setAttribute(name, "" + value);
                    return value;
                }

            } else if (hooks && "get" in hooks && notxml) {
                return hooks.get(elem, name);

            } else {

                ret = elem.getAttribute(name);

                // Non-existent attributes return null, we normalize to undefined
                return ret === null ?
                    undefined :
				ret;
            }
        },

        removeAttr: function (elem, name) {
            var propName;
            if (elem.nodeType === 1) {
                name = jQuery.attrFix[name] || name;

                if (jQuery.support.getSetAttribute) {
                    // Use removeAttribute in browsers that support it
                    elem.removeAttribute(name);
                } else {
                    jQuery.attr(elem, name, "");
                    elem.removeAttributeNode(elem.getAttributeNode(name));
                }

                // Set corresponding property to false for boolean attributes
                if (rboolean.test(name) && (propName = jQuery.propFix[name] || name) in elem) {
                    elem[propName] = false;
                }
            }
        },

        attrHooks: {
            type: {
                set: function (elem, value) {
                    // We can't allow the type property to be changed (since it causes problems in IE)
                    if (rtype.test(elem.nodeName) && elem.parentNode) {
                        jQuery.error("type property can't be changed");
                    } else if (!jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to it's default in case type is set after value
                        // This is for element creation
                        var val = elem.value;
                        elem.setAttribute("type", value);
                        if (val) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            },
            tabIndex: {
                get: function (elem) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    var attributeNode = elem.getAttributeNode("tabIndex");

                    return attributeNode && attributeNode.specified ?
					parseInt(attributeNode.value, 10) :
					rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
						0 :
						undefined;
                }
            }
        },

        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },

        prop: function (elem, name, value) {
            var nType = elem.nodeType;

            // don't get/set properties on text, comment and attribute nodes
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return undefined;
            }

            var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

            // Try to normalize/fix the name
            name = notxml && jQuery.propFix[name] || name;

            hooks = jQuery.propHooks[name];

            if (value !== undefined) {
                if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;

                } else {
                    return (elem[name] = value);
                }

            } else {
                if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== undefined) {
                    return ret;

                } else {
                    return elem[name];
                }
            }
        },

        propHooks: {}
    });

    // Hook for boolean attributes
    boolHook = {
        get: function (elem, name) {
            // Align boolean attributes with corresponding properties
            return elem[jQuery.propFix[name] || name] ?
			name.toLowerCase() :
			undefined;
        },
        set: function (elem, value, name) {
            var propName;
            if (value === false) {
                // Remove boolean attributes when set to false
                jQuery.removeAttr(elem, name);
            } else {
                // value is true since we know at this point it's type boolean and not false
                // Set boolean attributes to the same name and set the DOM property
                propName = jQuery.propFix[name] || name;
                if (propName in elem) {
                    // Only set the IDL specifically if it already exists on the element
                    elem[propName] = value;
                }

                elem.setAttribute(name, name.toLowerCase());
            }
            return name;
        }
    };

    // Use the value property for back compat
    // Use the formHook for button elements in IE6/7 (#1954)
    jQuery.attrHooks.value = {
        get: function (elem, name) {
            if (formHook && jQuery.nodeName(elem, "button")) {
                return formHook.get(elem, name);
            }
            return elem.value;
        },
        set: function (elem, value, name) {
            if (formHook && jQuery.nodeName(elem, "button")) {
                return formHook.set(elem, value, name);
            }
            // Does not return so that setAttribute is also used
            elem.value = value;
        }
    };

    // IE6/7 do not support getting/setting some attributes with get/setAttribute
    if (!jQuery.support.getSetAttribute) {

        // propFix is more comprehensive and contains all fixes
        jQuery.attrFix = jQuery.propFix;

        // Use this for any attribute on a form in IE6/7
        formHook = jQuery.attrHooks.name = jQuery.valHooks.button = {
            get: function (elem, name) {
                var ret;
                ret = elem.getAttributeNode(name);
                // Return undefined if nodeValue is empty string
                return ret && ret.nodeValue !== "" ?
				ret.nodeValue :
				undefined;
            },
            set: function (elem, value, name) {
                // Check form objects in IE (multiple bugs related)
                // Only use nodeValue if the attribute node exists on the form
                var ret = elem.getAttributeNode(name);
                if (ret) {
                    ret.nodeValue = value;
                    return value;
                }
            }
        };

        // Set width and height to auto instead of 0 on empty string( Bug #8150 )
        // This is for removals
        jQuery.each(["width", "height"], function (i, name) {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                set: function (elem, value) {
                    if (value === "") {
                        elem.setAttribute(name, "auto");
                        return value;
                    }
                }
            });
        });
    }


    // Some attributes require a special call on IE
    if (!jQuery.support.hrefNormalized) {
        jQuery.each(["href", "src", "width", "height"], function (i, name) {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                get: function (elem) {
                    var ret = elem.getAttribute(name, 2);
                    return ret === null ? undefined : ret;
                }
            });
        });
    }

    if (!jQuery.support.style) {
        jQuery.attrHooks.style = {
            get: function (elem) {
                // Return undefined in the case of empty string
                // Normalize to lowercase since IE uppercases css property names
                return elem.style.cssText.toLowerCase() || undefined;
            },
            set: function (elem, value) {
                return (elem.style.cssText = "" + value);
            }
        };
    }

    // Safari mis-reports the default selected property of an option
    // Accessing the parent's selectedIndex property fixes it
    if (!jQuery.support.optSelected) {
        jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
            get: function (elem) {
                var parent = elem.parentNode;

                if (parent) {
                    parent.selectedIndex;

                    // Make sure that it also works with optgroups, see #5701
                    if (parent.parentNode) {
                        parent.parentNode.selectedIndex;
                    }
                }
            }
        });
    }

    // Radios and checkboxes getter/setter
    if (!jQuery.support.checkOn) {
        jQuery.each(["radio", "checkbox"], function () {
            jQuery.valHooks[this] = {
                get: function (elem) {
                    // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                    return elem.getAttribute("value") === null ? "on" : elem.value;
                }
            };
        });
    }
    jQuery.each(["radio", "checkbox"], function () {
        jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
            set: function (elem, value) {
                if (jQuery.isArray(value)) {
                    return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
                }
            }
        });
    });




    var hasOwn = Object.prototype.hasOwnProperty,
	rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspaces = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function (nm) {
	    return nm.replace(rescape, "\\$&");
	};

    /*
    * A number of helper functions used for managing events.
    * Many of the ideas behind this code originated from
    * Dean Edwards' addEvent library.
    */
    jQuery.event = {

        // Bind an event to an element
        // Original by Dean Edwards
        add: function (elem, types, handler, data) {
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }

            if (handler === false) {
                handler = returnFalse;
            } else if (!handler) {
                // Fixes bug #7229. Fix recommended by jdalton
                return;
            }

            var handleObjIn, handleObj;

            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
            }

            // Make sure that the function being executed has a unique ID
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure
            var elemData = jQuery._data(elem);

            // If no elemData is found then we must be trying to bind to one of the
            // banned noData elements
            if (!elemData) {
                return;
            }

            var events = elemData.events,
			eventHandle = elemData.handle;

            if (!events) {
                elemData.events = events = {};
            }

            if (!eventHandle) {
                elemData.handle = eventHandle = function (e) {
                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.handle.apply(eventHandle.elem, arguments) :
					undefined;
                };
            }

            // Add elem as a property of the handle function
            // This is to prevent a memory leak with non-native events in IE.
            eventHandle.elem = elem;

            // Handle multiple events separated by a space
            // jQuery(...).bind("mouseover mouseout", fn);
            types = types.split(" ");

            var type, i = 0, namespaces;

            while ((type = types[i++])) {
                handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

                // Namespaced event handlers
                if (type.indexOf(".") > -1) {
                    namespaces = type.split(".");
                    type = namespaces.shift();
                    handleObj.namespace = namespaces.slice(0).sort().join(".");

                } else {
                    namespaces = [];
                    handleObj.namespace = "";
                }

                handleObj.type = type;
                if (!handleObj.guid) {
                    handleObj.guid = handler.guid;
                }

                // Get the current list of functions bound to this event
                var handlers = events[type],
				special = jQuery.event.special[type] || {};

                // Init the event handler queue
                if (!handlers) {
                    handlers = events[type] = [];

                    // Check for a special event handler
                    // Only use addEventListener/attachEvent if the special
                    // events handler returns false
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                        // Bind the global event handler to the element
                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle, false);

                        } else if (elem.attachEvent) {
                            elem.attachEvent("on" + type, eventHandle);
                        }
                    }
                }

                if (special.add) {
                    special.add.call(elem, handleObj);

                    if (!handleObj.handler.guid) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add the function to the element's handler list
                handlers.push(handleObj);

                // Keep track of which events have been used, for event optimization
                jQuery.event.global[type] = true;
            }

            // Nullify elem to prevent memory leaks in IE
            elem = null;
        },

        global: {},

        // Detach an event or set of events from an element
        remove: function (elem, types, handler, pos) {
            // don't do events on text and comment nodes
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }

            if (handler === false) {
                handler = returnFalse;
            }

            var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.hasData(elem) && jQuery._data(elem),
			events = elemData && elemData.events;

            if (!elemData || !events) {
                return;
            }

            // types is actually an event object here
            if (types && types.type) {
                handler = types.handler;
                types = types.type;
            }

            // Unbind all events for the element
            if (!types || typeof types === "string" && types.charAt(0) === ".") {
                types = types || "";

                for (type in events) {
                    jQuery.event.remove(elem, type + types);
                }

                return;
            }

            // Handle multiple events separated by a space
            // jQuery(...).unbind("mouseover mouseout", fn);
            types = types.split(" ");

            while ((type = types[i++])) {
                origType = type;
                handleObj = null;
                all = type.indexOf(".") < 0;
                namespaces = [];

                if (!all) {
                    // Namespaced event handlers
                    namespaces = type.split(".");
                    type = namespaces.shift();

                    namespace = new RegExp("(^|\\.)" +
					jQuery.map(namespaces.slice(0).sort(), fcleanup).join("\\.(?:.*\\.)?") + "(\\.|$)");
                }

                eventType = events[type];

                if (!eventType) {
                    continue;
                }

                if (!handler) {
                    for (j = 0; j < eventType.length; j++) {
                        handleObj = eventType[j];

                        if (all || namespace.test(handleObj.namespace)) {
                            jQuery.event.remove(elem, origType, handleObj.handler, j);
                            eventType.splice(j--, 1);
                        }
                    }

                    continue;
                }

                special = jQuery.event.special[type] || {};

                for (j = pos || 0; j < eventType.length; j++) {
                    handleObj = eventType[j];

                    if (handler.guid === handleObj.guid) {
                        // remove the given handler for the given type
                        if (all || namespace.test(handleObj.namespace)) {
                            if (pos == null) {
                                eventType.splice(j--, 1);
                            }

                            if (special.remove) {
                                special.remove.call(elem, handleObj);
                            }
                        }

                        if (pos != null) {
                            break;
                        }
                    }
                }

                // remove generic event handler if no more handlers exist
                if (eventType.length === 0 || pos != null && eventType.length === 1) {
                    if (!special.teardown || special.teardown.call(elem, namespaces) === false) {
                        jQuery.removeEvent(elem, type, elemData.handle);
                    }

                    ret = null;
                    delete events[type];
                }
            }

            // Remove the expando if it's no longer used
            if (jQuery.isEmptyObject(events)) {
                var handle = elemData.handle;
                if (handle) {
                    handle.elem = null;
                }

                delete elemData.events;
                delete elemData.handle;

                if (jQuery.isEmptyObject(elemData)) {
                    jQuery.removeData(elem, undefined, true);
                }
            }
        },

        // Events that are safe to short-circuit if no handlers are attached.
        // Native DOM events should not be added, they may have inline handlers.
        customEvent: {
            "getData": true,
            "setData": true,
            "changeData": true
        },

        trigger: function (event, data, elem, onlyHandlers) {
            // Event object or event type
            var type = event.type || event,
			namespaces = [],
			exclusive;

            if (type.indexOf("!") >= 0) {
                // Exclusive events trigger only for the exact event (no namespaces)
                type = type.slice(0, -1);
                exclusive = true;
            }

            if (type.indexOf(".") >= 0) {
                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }

            if ((!elem || jQuery.event.customEvent[type]) && !jQuery.event.global[type]) {
                // No jQuery handlers for this event type, and it can't have inline handlers
                return;
            }

            // Caller can pass in an Event, Object, or just an event type string
            event = typeof event === "object" ?
            // jQuery.Event object
			event[jQuery.expando] ? event :
            // Object literal
			new jQuery.Event(type, event) :
            // Just the event type (string)
			new jQuery.Event(type);

            event.type = type;
            event.exclusive = exclusive;
            event.namespace = namespaces.join(".");
            event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");

            // triggerHandler() and global events don't bubble or run the default action
            if (onlyHandlers || !elem) {
                event.preventDefault();
                event.stopPropagation();
            }

            // Handle a global trigger
            if (!elem) {
                // TODO: Stop taunting the data cache; remove global events and always attach to document
                jQuery.each(jQuery.cache, function () {
                    // internalKey variable is just used to make it easier to find
                    // and potentially change this stuff later; currently it just
                    // points to jQuery.expando
                    var internalKey = jQuery.expando,
					internalCache = this[internalKey];
                    if (internalCache && internalCache.events && internalCache.events[type]) {
                        jQuery.event.trigger(event, data, internalCache.handle.elem);
                    }
                });
                return;
            }

            // Don't do events on text and comment nodes
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }

            // Clean up the event in case it is being reused
            event.result = undefined;
            event.target = elem;

            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data ? jQuery.makeArray(data) : [];
            data.unshift(event);

            var cur = elem,
            // IE doesn't like method names with a colon (#3533, #8272)
			ontype = type.indexOf(":") < 0 ? "on" + type : "";

            // Fire event on the current element, then bubble up the DOM tree
            do {
                var handle = jQuery._data(cur, "handle");

                event.currentTarget = cur;
                if (handle) {
                    handle.apply(cur, data);
                }

                // Trigger an inline bound script
                if (ontype && jQuery.acceptData(cur) && cur[ontype] && cur[ontype].apply(cur, data) === false) {
                    event.result = false;
                    event.preventDefault();
                }

                // Bubble up to document, then to window
                cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
            } while (cur && !event.isPropagationStopped());

            // If nobody prevented the default action, do it now
            if (!event.isDefaultPrevented()) {
                var old,
				special = jQuery.event.special[type] || {};

                if ((!special._default || special._default.call(elem.ownerDocument, event) === false) &&
				!(type === "click" && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem)) {

                    // Call a native DOM method on the target with the same name name as the event.
                    // Can't use an .isFunction)() check here because IE6/7 fails that test.
                    // IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
                    try {
                        if (ontype && elem[type]) {
                            // Don't re-trigger an onFOO event when we call its FOO() method
                            old = elem[ontype];

                            if (old) {
                                elem[ontype] = null;
                            }

                            jQuery.event.triggered = type;
                            elem[type]();
                        }
                    } catch (ieError) { }

                    if (old) {
                        elem[ontype] = old;
                    }

                    jQuery.event.triggered = undefined;
                }
            }

            return event.result;
        },

        handle: function (event) {
            event = jQuery.event.fix(event || window.event);
            // Snapshot the handlers list since a called handler may add/remove events.
            var handlers = ((jQuery._data(this, "events") || {})[event.type] || []).slice(0),
			run_all = !event.exclusive && !event.namespace,
			args = Array.prototype.slice.call(arguments, 0);

            // Use the fix-ed Event rather than the (read-only) native event
            args[0] = event;
            event.currentTarget = this;

            for (var j = 0, l = handlers.length; j < l; j++) {
                var handleObj = handlers[j];

                // Triggered event must 1) be non-exclusive and have no namespace, or
                // 2) have namespace(s) a subset or equal to those in the bound event.
                if (run_all || event.namespace_re.test(handleObj.namespace)) {
                    // Pass in a reference to the handler function itself
                    // So that we can later remove it
                    event.handler = handleObj.handler;
                    event.data = handleObj.data;
                    event.handleObj = handleObj;

                    var ret = handleObj.handler.apply(this, args);

                    if (ret !== undefined) {
                        event.result = ret;
                        if (ret === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }

                    if (event.isImmediatePropagationStopped()) {
                        break;
                    }
                }
            }
            return event.result;
        },

        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

        fix: function (event) {
            if (event[jQuery.expando]) {
                return event;
            }

            // store a copy of the original event object
            // and "clone" to set read-only properties
            var originalEvent = event;
            event = jQuery.Event(originalEvent);

            for (var i = this.props.length, prop; i;) {
                prop = this.props[--i];
                event[prop] = originalEvent[prop];
            }

            // Fix target property, if necessary
            if (!event.target) {
                // Fixes #1925 where srcElement might not be defined either
                event.target = event.srcElement || document;
            }

            // check if target is a textnode (safari)
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }

            // Add relatedTarget, if necessary
            if (!event.relatedTarget && event.fromElement) {
                event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
            }

            // Calculate pageX/Y if missing and clientX/Y available
            if (event.pageX == null && event.clientX != null) {
                var eventDocument = event.target.ownerDocument || document,
				doc = eventDocument.documentElement,
				body = eventDocument.body;

                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }

            // Add which for key events
            if (event.which == null && (event.charCode != null || event.keyCode != null)) {
                event.which = event.charCode != null ? event.charCode : event.keyCode;
            }

            // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
            if (!event.metaKey && event.ctrlKey) {
                event.metaKey = event.ctrlKey;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if (!event.which && event.button !== undefined) {
                event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
            }

            return event;
        },

        // Deprecated, use jQuery.guid instead
        guid: 1E8,

        // Deprecated, use jQuery.proxy instead
        proxy: jQuery.proxy,

        special: {
            ready: {
                // Make sure the ready event is setup
                setup: jQuery.bindReady,
                teardown: jQuery.noop
            },

            live: {
                add: function (handleObj) {
                    jQuery.event.add(this,
					liveConvert(handleObj.origType, handleObj.selector),
					jQuery.extend({}, handleObj, { handler: liveHandler, guid: handleObj.handler.guid }));
                },

                remove: function (handleObj) {
                    jQuery.event.remove(this, liveConvert(handleObj.origType, handleObj.selector), handleObj);
                }
            },

            beforeunload: {
                setup: function (data, namespaces, eventHandle) {
                    // We only want to do this special case on windows
                    if (jQuery.isWindow(this)) {
                        this.onbeforeunload = eventHandle;
                    }
                },

                teardown: function (namespaces, eventHandle) {
                    if (this.onbeforeunload === eventHandle) {
                        this.onbeforeunload = null;
                    }
                }
            }
        }
    };

    jQuery.removeEvent = document.removeEventListener ?
	function (elem, type, handle) {
	    if (elem.removeEventListener) {
	        elem.removeEventListener(type, handle, false);
	    }
	} :
	function (elem, type, handle) {
	    if (elem.detachEvent) {
	        elem.detachEvent("on" + type, handle);
	    }
	};

    jQuery.Event = function (src, props) {
        // Allow instantiation without the 'new' keyword
        if (!this.preventDefault) {
            return new jQuery.Event(src, props);
        }

        // Event object
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

            // Event type
        } else {
            this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if (props) {
            jQuery.extend(this, props);
        }

        // timeStamp is buggy for some events on Firefox(#3843)
        // So we won't rely on the native value
        this.timeStamp = jQuery.now();

        // Mark it as fixed
        this[jQuery.expando] = true;
    };

    function returnFalse() {
        return false;
    }
    function returnTrue() {
        return true;
    }

    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        preventDefault: function () {
            this.isDefaultPrevented = returnTrue;

            var e = this.originalEvent;
            if (!e) {
                return;
            }

            // if preventDefault exists run it on the original event
            if (e.preventDefault) {
                e.preventDefault();

                // otherwise set the returnValue property of the original event to false (IE)
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function () {
            this.isPropagationStopped = returnTrue;

            var e = this.originalEvent;
            if (!e) {
                return;
            }
            // if stopPropagation exists run it on the original event
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            // otherwise set the cancelBubble property of the original event to true (IE)
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    };

    // Checks if an event happened on an element within another element
    // Used in jQuery.event.special.mouseenter and mouseleave handlers
    var withinElement = function (event) {
        // Check if mouse(over|out) are still within the same parent element
        var parent = event.relatedTarget;

        // set the correct event type
        event.type = event.data;

        // Firefox sometimes assigns relatedTarget a XUL element
        // which we cannot access the parentNode property of
        try {

            // Chrome does something similar, the parentNode property
            // can be accessed but is null.
            if (parent && parent !== document && !parent.parentNode) {
                return;
            }

            // Traverse up the tree
            while (parent && parent !== this) {
                parent = parent.parentNode;
            }

            if (parent !== this) {
                // handle event if we actually just moused on to a non sub-element
                jQuery.event.handle.apply(this, arguments);
            }

            // assuming we've left the element since we most likely mousedover a xul element
        } catch (e) { }
    },

    // In case of event delegation, we only need to rename the event.type,
    // liveHandler will take care of the rest.
delegate = function (event) {
    event.type = event.data;
    jQuery.event.handle.apply(this, arguments);
};

    // Create mouseenter and mouseleave events
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function (orig, fix) {
        jQuery.event.special[orig] = {
            setup: function (data) {
                jQuery.event.add(this, fix, data && data.selector ? delegate : withinElement, orig);
            },
            teardown: function (data) {
                jQuery.event.remove(this, fix, data && data.selector ? delegate : withinElement);
            }
        };
    });

    // submit delegation
    if (!jQuery.support.submitBubbles) {

        jQuery.event.special.submit = {
            setup: function (data, namespaces) {
                if (!jQuery.nodeName(this, "form")) {
                    jQuery.event.add(this, "click.specialSubmit", function (e) {
                        var elem = e.target,
						type = elem.type;

                        if ((type === "submit" || type === "image") && jQuery(elem).closest("form").length) {
                            trigger("submit", this, arguments);
                        }
                    });

                    jQuery.event.add(this, "keypress.specialSubmit", function (e) {
                        var elem = e.target,
						type = elem.type;

                        if ((type === "text" || type === "password") && jQuery(elem).closest("form").length && e.keyCode === 13) {
                            trigger("submit", this, arguments);
                        }
                    });

                } else {
                    return false;
                }
            },

            teardown: function (namespaces) {
                jQuery.event.remove(this, ".specialSubmit");
            }
        };

    }

    // change delegation, happens here so we have bind.
    if (!jQuery.support.changeBubbles) {

        var changeFilters,

	getVal = function (elem) {
	    var type = elem.type, val = elem.value;

	    if (type === "radio" || type === "checkbox") {
	        val = elem.checked;

	    } else if (type === "select-multiple") {
	        val = elem.selectedIndex > -1 ?
				jQuery.map(elem.options, function (elem) {
				    return elem.selected;
				}).join("-") :
				"";

	    } else if (jQuery.nodeName(elem, "select")) {
	        val = elem.selectedIndex;
	    }

	    return val;
	},

	testChange = function testChange(e) {
	    var elem = e.target, data, val;

	    if (!rformElems.test(elem.nodeName) || elem.readOnly) {
	        return;
	    }

	    data = jQuery._data(elem, "_change_data");
	    val = getVal(elem);

	    // the current data will be also retrieved by beforeactivate
	    if (e.type !== "focusout" || elem.type !== "radio") {
	        jQuery._data(elem, "_change_data", val);
	    }

	    if (data === undefined || val === data) {
	        return;
	    }

	    if (data != null || val) {
	        e.type = "change";
	        e.liveFired = undefined;
	        jQuery.event.trigger(e, arguments[1], elem);
	    }
	};

        jQuery.event.special.change = {
            filters: {
                focusout: testChange,

                beforedeactivate: testChange,

                click: function (e) {
                    var elem = e.target, type = jQuery.nodeName(elem, "input") ? elem.type : "";

                    if (type === "radio" || type === "checkbox" || jQuery.nodeName(elem, "select")) {
                        testChange.call(this, e);
                    }
                },

                // Change has to be called before submit
                // Keydown will be called before keypress, which is used in submit-event delegation
                keydown: function (e) {
                    var elem = e.target, type = jQuery.nodeName(elem, "input") ? elem.type : "";

                    if ((e.keyCode === 13 && !jQuery.nodeName(elem, "textarea")) ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple") {
                        testChange.call(this, e);
                    }
                },

                // Beforeactivate happens also before the previous element is blurred
                // with this event you can't trigger a change event, but you can store
                // information
                beforeactivate: function (e) {
                    var elem = e.target;
                    jQuery._data(elem, "_change_data", getVal(elem));
                }
            },

            setup: function (data, namespaces) {
                if (this.type === "file") {
                    return false;
                }

                for (var type in changeFilters) {
                    jQuery.event.add(this, type + ".specialChange", changeFilters[type]);
                }

                return rformElems.test(this.nodeName);
            },

            teardown: function (namespaces) {
                jQuery.event.remove(this, ".specialChange");

                return rformElems.test(this.nodeName);
            }
        };

        changeFilters = jQuery.event.special.change.filters;

        // Handle when the input is .focus()'d
        changeFilters.focus = changeFilters.beforeactivate;
    }

    function trigger(type, elem, args) {
        // Piggyback on a donor event to simulate a different one.
        // Fake originalEvent to avoid donor's stopPropagation, but if the
        // simulated event prevents default then we do the same on the donor.
        // Don't pass args or remember liveFired; they apply to the donor event.
        var event = jQuery.extend({}, args[0]);
        event.type = type;
        event.originalEvent = {};
        event.liveFired = undefined;
        jQuery.event.handle.call(elem, event);
        if (event.isDefaultPrevented()) {
            args[0].preventDefault();
        }
    }

    // Create "bubbling" focus and blur events
    if (!jQuery.support.focusinBubbles) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

            // Attach a single capturing handler while someone wants focusin/focusout
            var attaches = 0;

            jQuery.event.special[fix] = {
                setup: function () {
                    if (attaches++ === 0) {
                        document.addEventListener(orig, handler, true);
                    }
                },
                teardown: function () {
                    if (--attaches === 0) {
                        document.removeEventListener(orig, handler, true);
                    }
                }
            };

            function handler(donor) {
                // Donor event is always a native one; fix it and switch its type.
                // Let focusin/out handler cancel the donor focus/blur event.
                var e = jQuery.event.fix(donor);
                e.type = fix;
                e.originalEvent = {};
                jQuery.event.trigger(e, null, e.target);
                if (e.isDefaultPrevented()) {
                    donor.preventDefault();
                }
            }
        });
    }

    jQuery.each(["bind", "one"], function (i, name) {
        jQuery.fn[name] = function (type, data, fn) {
            var handler;

            // Handle object literals
            if (typeof type === "object") {
                for (var key in type) {
                    this[name](key, data, type[key], fn);
                }
                return this;
            }

            if (arguments.length === 2 || data === false) {
                fn = data;
                data = undefined;
            }

            if (name === "one") {
                handler = function (event) {
                    jQuery(this).unbind(event, handler);
                    return fn.apply(this, arguments);
                };
                handler.guid = fn.guid || jQuery.guid++;
            } else {
                handler = fn;
            }

            if (type === "unload" && name !== "one") {
                this.one(type, data, fn);

            } else {
                for (var i = 0, l = this.length; i < l; i++) {
                    jQuery.event.add(this[i], type, handler, data);
                }
            }

            return this;
        };
    });

    jQuery.fn.extend({
        unbind: function (type, fn) {
            // Handle object literals
            if (typeof type === "object" && !type.preventDefault) {
                for (var key in type) {
                    this.unbind(key, type[key]);
                }

            } else {
                for (var i = 0, l = this.length; i < l; i++) {
                    jQuery.event.remove(this[i], type, fn);
                }
            }

            return this;
        },

        delegate: function (selector, types, data, fn) {
            return this.live(types, data, fn, selector);
        },

        undelegate: function (selector, types, fn) {
            if (arguments.length === 0) {
                return this.unbind("live");

            } else {
                return this.die(types, null, fn, selector);
            }
        },

        trigger: function (type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this);
            });
        },

        triggerHandler: function (type, data) {
            if (this[0]) {
                return jQuery.event.trigger(type, data, this[0], true);
            }
        },

        toggle: function (fn) {
            // Save reference to arguments for access in closure
            var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function (event) {
			    // Figure out which function to execute
			    var lastToggle = (jQuery.data(this, "lastToggle" + fn.guid) || 0) % i;
			    jQuery.data(this, "lastToggle" + fn.guid, lastToggle + 1);

			    // Make sure that clicks stop
			    event.preventDefault();

			    // and execute the function
			    return args[lastToggle].apply(this, arguments) || false;
			};

            // link all the functions, so any of them can unbind this click handler
            toggler.guid = guid;
            while (i < args.length) {
                args[i++].guid = guid;
            }

            return this.click(toggler);
        },

        hover: function (fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        }
    });

    var liveMap = {
        focus: "focusin",
        blur: "focusout",
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };

    jQuery.each(["live", "die"], function (i, name) {
        jQuery.fn[name] = function (types, data, fn, origSelector /* Internal Use Only */) {
            var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery(this.context);

            if (typeof types === "object" && !types.preventDefault) {
                for (var key in types) {
                    context[name](key, data, types[key], selector);
                }

                return this;
            }

            if (name === "die" && !types &&
					origSelector && origSelector.charAt(0) === ".") {

                context.unbind(origSelector);

                return this;
            }

            if (data === false || jQuery.isFunction(data)) {
                fn = data || returnFalse;
                data = undefined;
            }

            types = (types || "").split(" ");

            while ((type = types[i++]) != null) {
                match = rnamespaces.exec(type);
                namespaces = "";

                if (match) {
                    namespaces = match[0];
                    type = type.replace(rnamespaces, "");
                }

                if (type === "hover") {
                    types.push("mouseenter" + namespaces, "mouseleave" + namespaces);
                    continue;
                }

                preType = type;

                if (liveMap[type]) {
                    types.push(liveMap[type] + namespaces);
                    type = type + namespaces;

                } else {
                    type = (liveMap[type] || type) + namespaces;
                }

                if (name === "live") {
                    // bind live handler
                    for (var j = 0, l = context.length; j < l; j++) {
                        jQuery.event.add(context[j], "live." + liveConvert(type, selector),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType });
                    }

                } else {
                    // unbind live handler
                    context.unbind("live." + liveConvert(type, selector), fn);
                }
            }

            return this;
        };
    });

    function liveHandler(event) {
        var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data(this, "events");

        // Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
        if (event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click") {
            return;
        }

        if (event.namespace) {
            namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
        }

        event.liveFired = this;

        var live = events.live.slice(0);

        for (j = 0; j < live.length; j++) {
            handleObj = live[j];

            if (handleObj.origType.replace(rnamespaces, "") === event.type) {
                selectors.push(handleObj.selector);

            } else {
                live.splice(j--, 1);
            }
        }

        match = jQuery(event.target).closest(selectors, event.currentTarget);

        for (i = 0, l = match.length; i < l; i++) {
            close = match[i];

            for (j = 0; j < live.length; j++) {
                handleObj = live[j];

                if (close.selector === handleObj.selector && (!namespace || namespace.test(handleObj.namespace)) && !close.elem.disabled) {
                    elem = close.elem;
                    related = null;

                    // Those two events require additional checking
                    if (handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave") {
                        event.type = handleObj.preType;
                        related = jQuery(event.relatedTarget).closest(handleObj.selector)[0];

                        // Make sure not to accidentally match a child element with the same selector
                        if (related && jQuery.contains(elem, related)) {
                            related = elem;
                        }
                    }

                    if (!related || related !== elem) {
                        elems.push({ elem: elem, handleObj: handleObj, level: close.level });
                    }
                }
            }
        }

        for (i = 0, l = elems.length; i < l; i++) {
            match = elems[i];

            if (maxLevel && match.level > maxLevel) {
                break;
            }

            event.currentTarget = match.elem;
            event.data = match.handleObj.data;
            event.handleObj = match.handleObj;

            ret = match.handleObj.origHandler.apply(match.elem, arguments);

            if (ret === false || event.isPropagationStopped()) {
                maxLevel = match.level;

                if (ret === false) {
                    stop = false;
                }
                if (event.isImmediatePropagationStopped()) {
                    break;
                }
            }
        }

        return stop;
    }

    function liveConvert(type, selector) {
        return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspaces, "&");
    }

    jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function (i, name) {

	    // Handle event binding
	    jQuery.fn[name] = function (data, fn) {
	        if (fn == null) {
	            fn = data;
	            data = null;
	        }

	        return arguments.length > 0 ?
			this.bind(name, data, fn) :
			this.trigger(name);
	    };

	    if (jQuery.attrFn) {
	        jQuery.attrFn[name] = true;
	    }
	});



    /*!
    * Sizzle CSS Selector Engine
    *  Copyright 2011, The Dojo Foundation
    *  Released under the MIT, BSD, and GPL Licenses.
    *  More information: http://sizzlejs.com/
    */
    (function () {

        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

        // Here we check if the JavaScript engine is using some sort of
        // optimization where it does not always call our comparision
        // function. If that is the case, discard the hasDuplicate value.
        //   Thus far that includes Google Chrome.
        [0, 0].sort(function () {
            baseHasDuplicate = false;
            return 0;
        });

        var Sizzle = function (selector, context, results, seed) {
            results = results || [];
            context = context || document;

            var origContext = context;

            if (context.nodeType !== 1 && context.nodeType !== 9) {
                return [];
            }

            if (!selector || typeof selector !== "string") {
                return results;
            }

            var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML(context),
		parts = [],
		soFar = selector;

            // Reset the position of the chunker regexp (start from head)
            do {
                chunker.exec("");
                m = chunker.exec(soFar);

                if (m) {
                    soFar = m[3];

                    parts.push(m[1]);

                    if (m[2]) {
                        extra = m[3];
                        break;
                    }
                }
            } while (m);

            if (parts.length > 1 && origPOS.exec(selector)) {

                if (parts.length === 2 && Expr.relative[parts[0]]) {
                    set = posProcess(parts[0] + parts[1], context);

                } else {
                    set = Expr.relative[parts[0]] ?
				[context] :
				Sizzle(parts.shift(), context);

                    while (parts.length) {
                        selector = parts.shift();

                        if (Expr.relative[selector]) {
                            selector += parts.shift();
                        }

                        set = posProcess(selector, set);
                    }
                }

            } else {
                // Take a shortcut and set the context if the root selector is an ID
                // (but not if it'll be faster if the inner selector is an ID)
                if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {

                    ret = Sizzle.find(parts.shift(), context, contextXML);
                    context = ret.expr ?
				Sizzle.filter(ret.expr, ret.set)[0] :
				ret.set[0];
                }

                if (context) {
                    ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);

                    set = ret.expr ?
				Sizzle.filter(ret.expr, ret.set) :
				ret.set;

                    if (parts.length > 0) {
                        checkSet = makeArray(set);

                    } else {
                        prune = false;
                    }

                    while (parts.length) {
                        cur = parts.pop();
                        pop = cur;

                        if (!Expr.relative[cur]) {
                            cur = "";
                        } else {
                            pop = parts.pop();
                        }

                        if (pop == null) {
                            pop = context;
                        }

                        Expr.relative[cur](checkSet, pop, contextXML);
                    }

                } else {
                    checkSet = parts = [];
                }
            }

            if (!checkSet) {
                checkSet = set;
            }

            if (!checkSet) {
                Sizzle.error(cur || selector);
            }

            if (toString.call(checkSet) === "[object Array]") {
                if (!prune) {
                    results.push.apply(results, checkSet);

                } else if (context && context.nodeType === 1) {
                    for (i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
                            results.push(set[i]);
                        }
                    }

                } else {
                    for (i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && checkSet[i].nodeType === 1) {
                            results.push(set[i]);
                        }
                    }
                }

            } else {
                makeArray(checkSet, results);
            }

            if (extra) {
                Sizzle(extra, origContext, results, seed);
                Sizzle.uniqueSort(results);
            }

            return results;
        };

        Sizzle.uniqueSort = function (results) {
            if (sortOrder) {
                hasDuplicate = baseHasDuplicate;
                results.sort(sortOrder);

                if (hasDuplicate) {
                    for (var i = 1; i < results.length; i++) {
                        if (results[i] === results[i - 1]) {
                            results.splice(i--, 1);
                        }
                    }
                }
            }

            return results;
        };

        Sizzle.matches = function (expr, set) {
            return Sizzle(expr, null, null, set);
        };

        Sizzle.matchesSelector = function (node, expr) {
            return Sizzle(expr, null, null, [node]).length > 0;
        };

        Sizzle.find = function (expr, context, isXML) {
            var set;

            if (!expr) {
                return [];
            }

            for (var i = 0, l = Expr.order.length; i < l; i++) {
                var match,
			type = Expr.order[i];

                if ((match = Expr.leftMatch[type].exec(expr))) {
                    var left = match[1];
                    match.splice(1, 1);

                    if (left.substr(left.length - 1) !== "\\") {
                        match[1] = (match[1] || "").replace(rBackslash, "");
                        set = Expr.find[type](match, context, isXML);

                        if (set != null) {
                            expr = expr.replace(Expr.match[type], "");
                            break;
                        }
                    }
                }
            }

            if (!set) {
                set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName("*") :
			[];
            }

            return { set: set, expr: expr };
        };

        Sizzle.filter = function (expr, set, inplace, not) {
            var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);

            while (expr && set.length) {
                for (var type in Expr.filter) {
                    if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
                        var found, item,
					filter = Expr.filter[type],
					left = match[1];

                        anyFound = false;

                        match.splice(1, 1);

                        if (left.substr(left.length - 1) === "\\") {
                            continue;
                        }

                        if (curLoop === result) {
                            result = [];
                        }

                        if (Expr.preFilter[type]) {
                            match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);

                            if (!match) {
                                anyFound = found = true;

                            } else if (match === true) {
                                continue;
                            }
                        }

                        if (match) {
                            for (var i = 0; (item = curLoop[i]) != null; i++) {
                                if (item) {
                                    found = filter(item, match, i, curLoop);
                                    var pass = not ^ !!found;

                                    if (inplace && found != null) {
                                        if (pass) {
                                            anyFound = true;

                                        } else {
                                            curLoop[i] = false;
                                        }

                                    } else if (pass) {
                                        result.push(item);
                                        anyFound = true;
                                    }
                                }
                            }
                        }

                        if (found !== undefined) {
                            if (!inplace) {
                                curLoop = result;
                            }

                            expr = expr.replace(Expr.match[type], "");

                            if (!anyFound) {
                                return [];
                            }

                            break;
                        }
                    }
                }

                // Improper expression
                if (expr === old) {
                    if (anyFound == null) {
                        Sizzle.error(expr);

                    } else {
                        break;
                    }
                }

                old = expr;
            }

            return curLoop;
        };

        Sizzle.error = function (msg) {
            throw "Syntax error, unrecognized expression: " + msg;
        };

        var Expr = Sizzle.selectors = {
            order: ["ID", "NAME", "TAG"],

            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },

            leftMatch: {},

            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },

            attrHandle: {
                href: function (elem) {
                    return elem.getAttribute("href");
                },
                type: function (elem) {
                    return elem.getAttribute("type");
                }
            },

            relative: {
                "+": function (checkSet, part) {
                    var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test(part),
				isPartStrNotTag = isPartStr && !isTag;

                    if (isTag) {
                        part = part.toLowerCase();
                    }

                    for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                        if ((elem = checkSet[i])) {
                            while ((elem = elem.previousSibling) && elem.nodeType !== 1) { }

                            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
                        }
                    }

                    if (isPartStrNotTag) {
                        Sizzle.filter(part, checkSet, true);
                    }
                },

                ">": function (checkSet, part) {
                    var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

                    if (isPartStr && !rNonWord.test(part)) {
                        part = part.toLowerCase();

                        for (; i < l; i++) {
                            elem = checkSet[i];

                            if (elem) {
                                var parent = elem.parentNode;
                                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                            }
                        }

                    } else {
                        for (; i < l; i++) {
                            elem = checkSet[i];

                            if (elem) {
                                checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
                            }
                        }

                        if (isPartStr) {
                            Sizzle.filter(part, checkSet, true);
                        }
                    }
                },

                "": function (checkSet, part, isXML) {
                    var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

                    if (typeof part === "string" && !rNonWord.test(part)) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
                },

                "~": function (checkSet, part, isXML) {
                    var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

                    if (typeof part === "string" && !rNonWord.test(part)) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
                }
            },

            find: {
                ID: function (match, context, isXML) {
                    if (typeof context.getElementById !== "undefined" && !isXML) {
                        var m = context.getElementById(match[1]);
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                },

                NAME: function (match, context) {
                    if (typeof context.getElementsByName !== "undefined") {
                        var ret = [],
					results = context.getElementsByName(match[1]);

                        for (var i = 0, l = results.length; i < l; i++) {
                            if (results[i].getAttribute("name") === match[1]) {
                                ret.push(results[i]);
                            }
                        }

                        return ret.length === 0 ? null : ret;
                    }
                },

                TAG: function (match, context) {
                    if (typeof context.getElementsByTagName !== "undefined") {
                        return context.getElementsByTagName(match[1]);
                    }
                }
            },
            preFilter: {
                CLASS: function (match, curLoop, inplace, result, not, isXML) {
                    match = " " + match[1].replace(rBackslash, "") + " ";

                    if (isXML) {
                        return match;
                    }

                    for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
                        if (elem) {
                            if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0)) {
                                if (!inplace) {
                                    result.push(elem);
                                }

                            } else if (inplace) {
                                curLoop[i] = false;
                            }
                        }
                    }

                    return false;
                },

                ID: function (match) {
                    return match[1].replace(rBackslash, "");
                },

                TAG: function (match, curLoop) {
                    return match[1].replace(rBackslash, "").toLowerCase();
                },

                CHILD: function (match) {
                    if (match[1] === "nth") {
                        if (!match[2]) {
                            Sizzle.error(match[0]);
                        }

                        match[2] = match[2].replace(/^\+|\s*/g, '');

                        // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                        var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test(match[2]) && "0n+" + match[2] || match[2]);

                        // calculate the numbers (first)n+(last) including if they are negative
                        match[2] = (test[1] + (test[2] || 1)) - 0;
                        match[3] = test[3] - 0;
                    }
                    else if (match[2]) {
                        Sizzle.error(match[0]);
                    }

                    // TODO: Move to normal caching system
                    match[0] = done++;

                    return match;
                },

                ATTR: function (match, curLoop, inplace, result, not, isXML) {
                    var name = match[1] = match[1].replace(rBackslash, "");

                    if (!isXML && Expr.attrMap[name]) {
                        match[1] = Expr.attrMap[name];
                    }

                    // Handle if an un-quoted value was used
                    match[4] = (match[4] || match[5] || "").replace(rBackslash, "");

                    if (match[2] === "~=") {
                        match[4] = " " + match[4] + " ";
                    }

                    return match;
                },

                PSEUDO: function (match, curLoop, inplace, result, not) {
                    if (match[1] === "not") {
                        // If we're dealing with a complex expression, or a simple one
                        if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
                            match[3] = Sizzle(match[3], null, null, curLoop);

                        } else {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                            if (!inplace) {
                                result.push.apply(result, ret);
                            }

                            return false;
                        }

                    } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                        return true;
                    }

                    return match;
                },

                POS: function (match) {
                    match.unshift(true);

                    return match;
                }
            },

            filters: {
                enabled: function (elem) {
                    return elem.disabled === false && elem.type !== "hidden";
                },

                disabled: function (elem) {
                    return elem.disabled === true;
                },

                checked: function (elem) {
                    return elem.checked === true;
                },

                selected: function (elem) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                parent: function (elem) {
                    return !!elem.firstChild;
                },

                empty: function (elem) {
                    return !elem.firstChild;
                },

                has: function (elem, i, match) {
                    return !!Sizzle(match[3], elem).length;
                },

                header: function (elem) {
                    return (/h\d/i).test(elem.nodeName);
                },

                text: function (elem) {
                    var attr = elem.getAttribute("type"), type = elem.type;
                    // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
                    // use getAttribute instead to test this case
                    return elem.nodeName.toLowerCase() === "input" && "text" === type && (attr === type || attr === null);
                },

                radio: function (elem) {
                    return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
                },

                checkbox: function (elem) {
                    return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
                },

                file: function (elem) {
                    return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
                },

                password: function (elem) {
                    return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
                },

                submit: function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" || name === "button") && "submit" === elem.type;
                },

                image: function (elem) {
                    return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
                },

                reset: function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" || name === "button") && "reset" === elem.type;
                },

                button: function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && "button" === elem.type || name === "button";
                },

                input: function (elem) {
                    return (/input|select|textarea|button/i).test(elem.nodeName);
                },

                focus: function (elem) {
                    return elem === elem.ownerDocument.activeElement;
                }
            },
            setFilters: {
                first: function (elem, i) {
                    return i === 0;
                },

                last: function (elem, i, match, array) {
                    return i === array.length - 1;
                },

                even: function (elem, i) {
                    return i % 2 === 0;
                },

                odd: function (elem, i) {
                    return i % 2 === 1;
                },

                lt: function (elem, i, match) {
                    return i < match[3] - 0;
                },

                gt: function (elem, i, match) {
                    return i > match[3] - 0;
                },

                nth: function (elem, i, match) {
                    return match[3] - 0 === i;
                },

                eq: function (elem, i, match) {
                    return match[3] - 0 === i;
                }
            },
            filter: {
                PSEUDO: function (elem, match, i, array) {
                    var name = match[1],
				filter = Expr.filters[name];

                    if (filter) {
                        return filter(elem, i, match, array);

                    } else if (name === "contains") {
                        return (elem.textContent || elem.innerText || Sizzle.getText([elem]) || "").indexOf(match[3]) >= 0;

                    } else if (name === "not") {
                        var not = match[3];

                        for (var j = 0, l = not.length; j < l; j++) {
                            if (not[j] === elem) {
                                return false;
                            }
                        }

                        return true;

                    } else {
                        Sizzle.error(name);
                    }
                },

                CHILD: function (elem, match) {
                    var type = match[1],
				node = elem;

                    switch (type) {
                        case "only":
                        case "first":
                            while ((node = node.previousSibling)) {
                                if (node.nodeType === 1) {
                                    return false;
                                }
                            }

                            if (type === "first") {
                                return true;
                            }

                            node = elem;

                        case "last":
                            while ((node = node.nextSibling)) {
                                if (node.nodeType === 1) {
                                    return false;
                                }
                            }

                            return true;

                        case "nth":
                            var first = match[2],
						last = match[3];

                            if (first === 1 && last === 0) {
                                return true;
                            }

                            var doneName = match[0],
						parent = elem.parentNode;

                            if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                                var count = 0;

                                for (node = parent.firstChild; node; node = node.nextSibling) {
                                    if (node.nodeType === 1) {
                                        node.nodeIndex = ++count;
                                    }
                                }

                                parent.sizcache = doneName;
                            }

                            var diff = elem.nodeIndex - last;

                            if (first === 0) {
                                return diff === 0;

                            } else {
                                return (diff % first === 0 && diff / first >= 0);
                            }
                    }
                },

                ID: function (elem, match) {
                    return elem.nodeType === 1 && elem.getAttribute("id") === match;
                },

                TAG: function (elem, match) {
                    return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
                },

                CLASS: function (elem, match) {
                    return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf(match) > -1;
                },

                ATTR: function (elem, match) {
                    var name = match[1],
				result = Expr.attrHandle[name] ?
					Expr.attrHandle[name](elem) :
					elem[name] != null ?
						elem[name] :
						elem.getAttribute(name),
				value = result + "",
				type = match[2],
				check = match[4];

                    return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
                },

                POS: function (elem, match, i, array) {
                    var name = match[2],
				filter = Expr.setFilters[name];

                    if (filter) {
                        return filter(elem, i, match, array);
                    }
                }
            }
        };

        var origPOS = Expr.match.POS,
	fescape = function (all, num) {
	    return "\\" + (num - 0 + 1);
	};

        for (var type in Expr.match) {
            Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
            Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
        }

        var makeArray = function (array, results) {
            array = Array.prototype.slice.call(array, 0);

            if (results) {
                results.push.apply(results, array);
                return results;
            }

            return array;
        };

        // Perform a simple check to determine if the browser is capable of
        // converting a NodeList to an array using builtin methods.
        // Also verifies that the returned array holds DOM nodes
        // (which is not the case in the Blackberry browser)
        try {
            Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;

            // Provide a fallback method if it does not work
        } catch (e) {
            makeArray = function (array, results) {
                var i = 0,
			ret = results || [];

                if (toString.call(array) === "[object Array]") {
                    Array.prototype.push.apply(ret, array);

                } else {
                    if (typeof array.length === "number") {
                        for (var l = array.length; i < l; i++) {
                            ret.push(array[i]);
                        }

                    } else {
                        for (; array[i]; i++) {
                            ret.push(array[i]);
                        }
                    }
                }

                return ret;
            };
        }

        var sortOrder, siblingCheck;

        if (document.documentElement.compareDocumentPosition) {
            sortOrder = function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }

                if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
                    return a.compareDocumentPosition ? -1 : 1;
                }

                return a.compareDocumentPosition(b) & 4 ? -1 : 1;
            };

        } else {
            sortOrder = function (a, b) {
                // The nodes are identical, we can exit early
                if (a === b) {
                    hasDuplicate = true;
                    return 0;

                    // Fallback to using sourceIndex (in IE) if it's available on both nodes
                } else if (a.sourceIndex && b.sourceIndex) {
                    return a.sourceIndex - b.sourceIndex;
                }

                var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

                // If the nodes are siblings (or identical) we can do a quick check
                if (aup === bup) {
                    return siblingCheck(a, b);

                    // If no parents were found then the nodes are disconnected
                } else if (!aup) {
                    return -1;

                } else if (!bup) {
                    return 1;
                }

                // Otherwise they're somewhere else in the tree so we need
                // to build up a full list of the parentNodes for comparison
                while (cur) {
                    ap.unshift(cur);
                    cur = cur.parentNode;
                }

                cur = bup;

                while (cur) {
                    bp.unshift(cur);
                    cur = cur.parentNode;
                }

                al = ap.length;
                bl = bp.length;

                // Start walking down the tree looking for a discrepancy
                for (var i = 0; i < al && i < bl; i++) {
                    if (ap[i] !== bp[i]) {
                        return siblingCheck(ap[i], bp[i]);
                    }
                }

                // We ended someplace up the tree so do a sibling check
                return i === al ?
			siblingCheck(a, bp[i], -1) :
			siblingCheck(ap[i], b, 1);
            };

            siblingCheck = function (a, b, ret) {
                if (a === b) {
                    return ret;
                }

                var cur = a.nextSibling;

                while (cur) {
                    if (cur === b) {
                        return -1;
                    }

                    cur = cur.nextSibling;
                }

                return 1;
            };
        }

        // Utility function for retreiving the text value of an array of DOM nodes
        Sizzle.getText = function (elems) {
            var ret = "", elem;

            for (var i = 0; elems[i]; i++) {
                elem = elems[i];

                // Get the text from text nodes and CDATA nodes
                if (elem.nodeType === 3 || elem.nodeType === 4) {
                    ret += elem.nodeValue;

                    // Traverse everything else, except comment nodes
                } else if (elem.nodeType !== 8) {
                    ret += Sizzle.getText(elem.childNodes);
                }
            }

            return ret;
        };

        // Check to see if the browser returns elements by name when
        // querying by getElementById (and provide a workaround)
        (function () {
            // We're going to inject a fake input element with a specified name
            var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

            form.innerHTML = "<a name='" + id + "'/>";

            // Inject it into the root element, check its status, and remove it quickly
            root.insertBefore(form, root.firstChild);

            // The workaround has to do additional checks after a getElementById
            // Which slows things down for other browsers (hence the branching)
            if (document.getElementById(id)) {
                Expr.find.ID = function (match, context, isXML) {
                    if (typeof context.getElementById !== "undefined" && !isXML) {
                        var m = context.getElementById(match[1]);

                        return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
                            undefined :
					[];
                    }
                };

                Expr.filter.ID = function (elem, match) {
                    var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

                    return elem.nodeType === 1 && node && node.nodeValue === match;
                };
            }

            root.removeChild(form);

            // release memory in IE
            root = form = null;
        })();

        (function () {
            // Check to see if the browser returns only elements
            // when doing getElementsByTagName("*")

            // Create a fake element
            var div = document.createElement("div");
            div.appendChild(document.createComment(""));

            // Make sure no comments are found
            if (div.getElementsByTagName("*").length > 0) {
                Expr.find.TAG = function (match, context) {
                    var results = context.getElementsByTagName(match[1]);

                    // Filter out possible comments
                    if (match[1] === "*") {
                        var tmp = [];

                        for (var i = 0; results[i]; i++) {
                            if (results[i].nodeType === 1) {
                                tmp.push(results[i]);
                            }
                        }

                        results = tmp;
                    }

                    return results;
                };
            }

            // Check to see if an attribute returns normalized href attributes
            div.innerHTML = "<a href='#'></a>";

            if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#") {

                Expr.attrHandle.href = function (elem) {
                    return elem.getAttribute("href", 2);
                };
            }

            // release memory in IE
            div = null;
        })();

        if (document.querySelectorAll) {
            (function () {
                var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

                div.innerHTML = "<p class='TEST'></p>";

                // Safari can't handle uppercase or unicode characters when
                // in quirks mode.
                if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
                    return;
                }

                Sizzle = function (query, context, extra, seed) {
                    context = context || document;

                    // Only use querySelectorAll on non-XML documents
                    // (ID selectors don't work in non-HTML documents)
                    if (!seed && !Sizzle.isXML(context)) {
                        // See if we find a selector to speed up
                        var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);

                        if (match && (context.nodeType === 1 || context.nodeType === 9)) {
                            // Speed-up: Sizzle("TAG")
                            if (match[1]) {
                                return makeArray(context.getElementsByTagName(query), extra);

                                // Speed-up: Sizzle(".CLASS")
                            } else if (match[2] && Expr.find.CLASS && context.getElementsByClassName) {
                                return makeArray(context.getElementsByClassName(match[2]), extra);
                            }
                        }

                        if (context.nodeType === 9) {
                            // Speed-up: Sizzle("body")
                            // The body element only exists once, optimize finding it
                            if (query === "body" && context.body) {
                                return makeArray([context.body], extra);

                                // Speed-up: Sizzle("#ID")
                            } else if (match && match[3]) {
                                var elem = context.getElementById(match[3]);

                                // Check parentNode to catch when Blackberry 4.6 returns
                                // nodes that are no longer in the document #6963
                                if (elem && elem.parentNode) {
                                    // Handle the case where IE and Opera return items
                                    // by name instead of ID
                                    if (elem.id === match[3]) {
                                        return makeArray([elem], extra);
                                    }

                                } else {
                                    return makeArray([], extra);
                                }
                            }

                            try {
                                return makeArray(context.querySelectorAll(query), extra);
                            } catch (qsaError) { }

                            // qSA works strangely on Element-rooted queries
                            // We can work around this by specifying an extra ID on the root
                            // and working up from there (Thanks to Andrew Dupont for the technique)
                            // IE 8 doesn't work on object elements
                        } else if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                            var oldContext = context,
						old = context.getAttribute("id"),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test(query);

                            if (!old) {
                                context.setAttribute("id", nid);
                            } else {
                                nid = nid.replace(/'/g, "\\$&");
                            }
                            if (relativeHierarchySelector && hasParent) {
                                context = context.parentNode;
                            }

                            try {
                                if (!relativeHierarchySelector || hasParent) {
                                    return makeArray(context.querySelectorAll("[id='" + nid + "'] " + query), extra);
                                }

                            } catch (pseudoError) {
                            } finally {
                                if (!old) {
                                    oldContext.removeAttribute("id");
                                }
                            }
                        }
                    }

                    return oldSizzle(query, context, extra, seed);
                };

                for (var prop in oldSizzle) {
                    Sizzle[prop] = oldSizzle[prop];
                }

                // release memory in IE
                div = null;
            })();
        }

        (function () {
            var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

            if (matches) {
                // Check to see if it's possible to do matchesSelector
                // on a disconnected node (IE 9 fails this)
                var disconnectedMatch = !matches.call(document.createElement("div"), "div"),
			pseudoWorks = false;

                try {
                    // This should fail with an exception
                    // Gecko does not error, returns false instead
                    matches.call(document.documentElement, "[test!='']:sizzle");

                } catch (pseudoError) {
                    pseudoWorks = true;
                }

                Sizzle.matchesSelector = function (node, expr) {
                    // Make sure that attribute selectors are quoted
                    expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

                    if (!Sizzle.isXML(node)) {
                        try {
                            if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
                                var ret = matches.call(node, expr);

                                // IE 9's matchesSelector returns false on disconnected nodes
                                if (ret || !disconnectedMatch ||
                                    // As well, disconnected nodes are said to be in a document
                                    // fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11) {
                                    return ret;
                                }
                            }
                        } catch (e) { }
                    }

                    return Sizzle(expr, null, null, [node]).length > 0;
                };
            }
        })();

        (function () {
            var div = document.createElement("div");

            div.innerHTML = "<div class='test e'></div><div class='test'></div>";

            // Opera can't find a second classname (in 9.6)
            // Also, make sure that getElementsByClassName actually exists
            if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
                return;
            }

            // Safari caches class attributes, doesn't catch changes (in 3.2)
            div.lastChild.className = "e";

            if (div.getElementsByClassName("e").length === 1) {
                return;
            }

            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function (match, context, isXML) {
                if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
                    return context.getElementsByClassName(match[1]);
                }
            };

            // release memory in IE
            div = null;
        })();

        function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; i < l; i++) {
                var elem = checkSet[i];

                if (elem) {
                    var match = false;

                    elem = elem[dir];

                    while (elem) {
                        if (elem.sizcache === doneName) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if (elem.nodeType === 1 && !isXML) {
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }

                        if (elem.nodeName.toLowerCase() === cur) {
                            match = elem;
                            break;
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; i < l; i++) {
                var elem = checkSet[i];

                if (elem) {
                    var match = false;

                    elem = elem[dir];

                    while (elem) {
                        if (elem.sizcache === doneName) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if (elem.nodeType === 1) {
                            if (!isXML) {
                                elem.sizcache = doneName;
                                elem.sizset = i;
                            }

                            if (typeof cur !== "string") {
                                if (elem === cur) {
                                    match = true;
                                    break;
                                }

                            } else if (Sizzle.filter(cur, [elem]).length > 0) {
                                match = elem;
                                break;
                            }
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        if (document.documentElement.contains) {
            Sizzle.contains = function (a, b) {
                return a !== b && (a.contains ? a.contains(b) : true);
            };

        } else if (document.documentElement.compareDocumentPosition) {
            Sizzle.contains = function (a, b) {
                return !!(a.compareDocumentPosition(b) & 16);
            };

        } else {
            Sizzle.contains = function () {
                return false;
            };
        }

        Sizzle.isXML = function (elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833) 
            var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        var posProcess = function (selector, context) {
            var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

            // Position selectors must be done after the filter
            // And so must :not(positional) so we move all PSEUDOs to the end
            while ((match = Expr.match.PSEUDO.exec(selector))) {
                later += match[0];
                selector = selector.replace(Expr.match.PSEUDO, "");
            }

            selector = Expr.relative[selector] ? selector + "*" : selector;

            for (var i = 0, l = root.length; i < l; i++) {
                Sizzle(selector, root[i], tmpSet);
            }

            return Sizzle.filter(later, tmpSet);
        };

        // EXPOSE
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.filters;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;


    })();


    var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
    // Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
    // methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
	    children: true,
	    contents: true,
	    next: true,
	    prev: true
	};

    jQuery.fn.extend({
        find: function (selector) {
            var self = this,
			i, l;

            if (typeof selector !== "string") {
                return jQuery(selector).filter(function () {
                    for (i = 0, l = self.length; i < l; i++) {
                        if (jQuery.contains(self[i], this)) {
                            return true;
                        }
                    }
                });
            }

            var ret = this.pushStack("", "find", selector),
			length, n, r;

            for (i = 0, l = this.length; i < l; i++) {
                length = ret.length;
                jQuery.find(selector, this[i], ret);

                if (i > 0) {
                    // Make sure that the results are unique
                    for (n = length; n < ret.length; n++) {
                        for (r = 0; r < length; r++) {
                            if (ret[r] === ret[n]) {
                                ret.splice(n--, 1);
                                break;
                            }
                        }
                    }
                }
            }

            return ret;
        },

        has: function (target) {
            var targets = jQuery(target);
            return this.filter(function () {
                for (var i = 0, l = targets.length; i < l; i++) {
                    if (jQuery.contains(this, targets[i])) {
                        return true;
                    }
                }
            });
        },

        not: function (selector) {
            return this.pushStack(winnow(this, selector, false), "not", selector);
        },

        filter: function (selector) {
            return this.pushStack(winnow(this, selector, true), "filter", selector);
        },

        is: function (selector) {
            return !!selector && (typeof selector === "string" ?
			jQuery.filter(selector, this).length > 0 :
			this.filter(selector).length > 0);
        },

        closest: function (selectors, context) {
            var ret = [], i, l, cur = this[0];

            // Array
            if (jQuery.isArray(selectors)) {
                var match, selector,
				matches = {},
				level = 1;

                if (cur && selectors.length) {
                    for (i = 0, l = selectors.length; i < l; i++) {
                        selector = selectors[i];

                        if (!matches[selector]) {
                            matches[selector] = POS.test(selector) ?
							jQuery(selector, context || this.context) :
							selector;
                        }
                    }

                    while (cur && cur.ownerDocument && cur !== context) {
                        for (selector in matches) {
                            match = matches[selector];

                            if (match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match)) {
                                ret.push({ selector: selector, elem: cur, level: level });
                            }
                        }

                        cur = cur.parentNode;
                        level++;
                    }
                }

                return ret;
            }

            // String
            var pos = POS.test(selectors) || typeof selectors !== "string" ?
				jQuery(selectors, context || this.context) :
				0;

            for (i = 0, l = this.length; i < l; i++) {
                cur = this[i];

                while (cur) {
                    if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
                        ret.push(cur);
                        break;

                    } else {
                        cur = cur.parentNode;
                        if (!cur || !cur.ownerDocument || cur === context || cur.nodeType === 11) {
                            break;
                        }
                    }
                }
            }

            ret = ret.length > 1 ? jQuery.unique(ret) : ret;

            return this.pushStack(ret, "closest", selectors);
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function (elem) {
            if (!elem || typeof elem === "string") {
                return jQuery.inArray(this[0],
                // If it receives a string, the selector is used
                // If it receives nothing, the siblings are used
				elem ? jQuery(elem) : this.parent().children());
            }
            // Locate the position of the desired element
            return jQuery.inArray(
            // If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this);
        },

        add: function (selector, context) {
            var set = typeof selector === "string" ?
				jQuery(selector, context) :
				jQuery.makeArray(selector && selector.nodeType ? [selector] : selector),
			all = jQuery.merge(this.get(), set);

            return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ?
                all :
			jQuery.unique(all));
        },

        andSelf: function () {
            return this.add(this.prevObject);
        }
    });

    // A painfully simple check to see if an element is disconnected
    // from a document (should be improved, where feasible).
    function isDisconnected(node) {
        return !node || !node.parentNode || node.parentNode.nodeType === 11;
    }

    jQuery.each({
        parent: function (elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function (elem) {
            return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function (elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        },
        next: function (elem) {
            return jQuery.nth(elem, 2, "nextSibling");
        },
        prev: function (elem) {
            return jQuery.nth(elem, 2, "previousSibling");
        },
        nextAll: function (elem) {
            return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function (elem) {
            return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function (elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function (elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function (elem) {
            return jQuery.sibling(elem.parentNode.firstChild, elem);
        },
        children: function (elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function (elem) {
            return jQuery.nodeName(elem, "iframe") ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray(elem.childNodes);
        }
    }, function (name, fn) {
        jQuery.fn[name] = function (until, selector) {
            var ret = jQuery.map(this, fn, until),
            // The variable 'args' was introduced in
            // https://github.com/jquery/jquery/commit/52a0238
            // to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
            // http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

            if (!runtil.test(name)) {
                selector = until;
            }

            if (selector && typeof selector === "string") {
                ret = jQuery.filter(selector, ret);
            }

            ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;

            if ((this.length > 1 || rmultiselector.test(selector)) && rparentsprev.test(name)) {
                ret = ret.reverse();
            }

            return this.pushStack(ret, name, args.join(","));
        };
    });

    jQuery.extend({
        filter: function (expr, elems, not) {
            if (not) {
                expr = ":not(" + expr + ")";
            }

            return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] :
			jQuery.find.matches(expr, elems);
        },

        dir: function (elem, dir, until) {
            var matched = [],
			cur = elem[dir];

            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        },

        nth: function (cur, result, dir, elem) {
            result = result || 1;
            var num = 0;

            for (; cur; cur = cur[dir]) {
                if (cur.nodeType === 1 && ++num === result) {
                    break;
                }
            }

            return cur;
        },

        sibling: function (n, elem) {
            var r = [];

            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }

            return r;
        }
    });

    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, keep) {

        // Can't pass null or undefined to indexOf in Firefox 4
        // Set to 0 to skip string check
        qualifier = qualifier || 0;

        if (jQuery.isFunction(qualifier)) {
            return jQuery.grep(elements, function (elem, i) {
                var retVal = !!qualifier.call(elem, i, elem);
                return retVal === keep;
            });

        } else if (qualifier.nodeType) {
            return jQuery.grep(elements, function (elem, i) {
                return (elem === qualifier) === keep;
            });

        } else if (typeof qualifier === "string") {
            var filtered = jQuery.grep(elements, function (elem) {
                return elem.nodeType === 1;
            });

            if (isSimple.test(qualifier)) {
                return jQuery.filter(qualifier, filtered, !keep);
            } else {
                qualifier = jQuery.filter(qualifier, filtered);
            }
        }

        return jQuery.grep(elements, function (elem, i) {
            return (jQuery.inArray(elem, qualifier) >= 0) === keep;
        });
    }




    var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<(?:script|object|embed|option|style)/i,
    // checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
	    option: [1, "<select multiple='multiple'>", "</select>"],
	    legend: [1, "<fieldset>", "</fieldset>"],
	    thead: [1, "<table>", "</table>"],
	    tr: [2, "<table><tbody>", "</tbody></table>"],
	    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
	    col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
	    area: [1, "<map>", "</map>"],
	    _default: [0, "", ""]
	};

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    // IE can't serialize <link> and <script> tags normally
    if (!jQuery.support.htmlSerialize) {
        wrapMap._default = [1, "div<div>", "</div>"];
    }

    jQuery.fn.extend({
        text: function (text) {
            if (jQuery.isFunction(text)) {
                return this.each(function (i) {
                    var self = jQuery(this);

                    self.text(text.call(this, i, self.text()));
                });
            }

            if (typeof text !== "object" && text !== undefined) {
                return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
            }

            return jQuery.text(this);
        },

        wrapAll: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapAll(html.call(this, i));
                });
            }

            if (this[0]) {
                // The elements to wrap the target around
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

                if (this[0].parentNode) {
                    wrap.insertBefore(this[0]);
                }

                wrap.map(function () {
                    var elem = this;

                    while (elem.firstChild && elem.firstChild.nodeType === 1) {
                        elem = elem.firstChild;
                    }

                    return elem;
                }).append(this);
            }

            return this;
        },

        wrapInner: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapInner(html.call(this, i));
                });
            }

            return this.each(function () {
                var self = jQuery(this),
				contents = self.contents();

                if (contents.length) {
                    contents.wrapAll(html);

                } else {
                    self.append(html);
                }
            });
        },

        wrap: function (html) {
            return this.each(function () {
                jQuery(this).wrapAll(html);
            });
        },

        unwrap: function () {
            return this.parent().each(function () {
                if (!jQuery.nodeName(this, "body")) {
                    jQuery(this).replaceWith(this.childNodes);
                }
            }).end();
        },

        append: function () {
            return this.domManip(arguments, true, function (elem) {
                if (this.nodeType === 1) {
                    this.appendChild(elem);
                }
            });
        },

        prepend: function () {
            return this.domManip(arguments, true, function (elem) {
                if (this.nodeType === 1) {
                    this.insertBefore(elem, this.firstChild);
                }
            });
        },

        before: function () {
            if (this[0] && this[0].parentNode) {
                return this.domManip(arguments, false, function (elem) {
                    this.parentNode.insertBefore(elem, this);
                });
            } else if (arguments.length) {
                var set = jQuery(arguments[0]);
                set.push.apply(set, this.toArray());
                return this.pushStack(set, "before", arguments);
            }
        },

        after: function () {
            if (this[0] && this[0].parentNode) {
                return this.domManip(arguments, false, function (elem) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                });
            } else if (arguments.length) {
                var set = this.pushStack(this, "after", arguments);
                set.push.apply(set, jQuery(arguments[0]).toArray());
                return set;
            }
        },

        // keepData is for internal use only--do not document
        remove: function (selector, keepData) {
            for (var i = 0, elem; (elem = this[i]) != null; i++) {
                if (!selector || jQuery.filter(selector, [elem]).length) {
                    if (!keepData && elem.nodeType === 1) {
                        jQuery.cleanData(elem.getElementsByTagName("*"));
                        jQuery.cleanData([elem]);
                    }

                    if (elem.parentNode) {
                        elem.parentNode.removeChild(elem);
                    }
                }
            }

            return this;
        },

        empty: function () {
            for (var i = 0, elem; (elem = this[i]) != null; i++) {
                // Remove element nodes and prevent memory leaks
                if (elem.nodeType === 1) {
                    jQuery.cleanData(elem.getElementsByTagName("*"));
                }

                // Remove any remaining nodes
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
            }

            return this;
        },

        clone: function (dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map(function () {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },

        html: function (value) {
            if (value === undefined) {
                return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

                // See if we can take a shortcut and just use innerHTML
            } else if (typeof value === "string" && !rnocache.test(value) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) &&
			!wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

                value = value.replace(rxhtmlTag, "<$1></$2>");

                try {
                    for (var i = 0, l = this.length; i < l; i++) {
                        // Remove element nodes and prevent memory leaks
                        if (this[i].nodeType === 1) {
                            jQuery.cleanData(this[i].getElementsByTagName("*"));
                            this[i].innerHTML = value;
                        }
                    }

                    // If using innerHTML throws an exception, use the fallback method
                } catch (e) {
                    this.empty().append(value);
                }

            } else if (jQuery.isFunction(value)) {
                this.each(function (i) {
                    var self = jQuery(this);

                    self.html(value.call(this, i, self.html()));
                });

            } else {
                this.empty().append(value);
            }

            return this;
        },

        replaceWith: function (value) {
            if (this[0] && this[0].parentNode) {
                // Make sure that the elements are removed from the DOM before they are inserted
                // this can help fix replacing a parent with child elements
                if (jQuery.isFunction(value)) {
                    return this.each(function (i) {
                        var self = jQuery(this), old = self.html();
                        self.replaceWith(value.call(this, i, old));
                    });
                }

                if (typeof value !== "string") {
                    value = jQuery(value).detach();
                }

                return this.each(function () {
                    var next = this.nextSibling,
					parent = this.parentNode;

                    jQuery(this).remove();

                    if (next) {
                        jQuery(next).before(value);
                    } else {
                        jQuery(parent).append(value);
                    }
                });
            } else {
                return this.length ?
				this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) :
				this;
            }
        },

        detach: function (selector) {
            return this.remove(selector, true);
        },

        domManip: function (args, table, callback) {
            var results, first, fragment, parent,
			value = args[0],
			scripts = [];

            // We can't cloneNode fragments that contain checked, in WebKit
            if (!jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test(value)) {
                return this.each(function () {
                    jQuery(this).domManip(args, table, callback, true);
                });
            }

            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    args[0] = value.call(this, i, table ? self.html() : undefined);
                    self.domManip(args, table, callback);
                });
            }

            if (this[0]) {
                parent = value && value.parentNode;

                // If we're in a fragment, just use that instead of building a new one
                if (jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length) {
                    results = { fragment: parent };

                } else {
                    results = jQuery.buildFragment(args, this, scripts);
                }

                fragment = results.fragment;

                if (fragment.childNodes.length === 1) {
                    first = fragment = fragment.firstChild;
                } else {
                    first = fragment.firstChild;
                }

                if (first) {
                    table = table && jQuery.nodeName(first, "tr");

                    for (var i = 0, l = this.length, lastIndex = l - 1; i < l; i++) {
                        callback.call(
						table ?
							root(this[i], first) :
							this[i],
                        // Make sure that we do not leak memory by inadvertently discarding
                        // the original fragment (which might have attached data) instead of
                        // using it; in addition, use the original fragment object for the last
                        // item instead of first because it can end up being emptied incorrectly
                        // in certain situations (Bug #8070).
                        // Fragments from the fragment cache must always be cloned and never used
                        // in place.
						results.cacheable || (l > 1 && i < lastIndex) ?
							jQuery.clone(fragment, true, true) :
							fragment
					);
                    }
                }

                if (scripts.length) {
                    jQuery.each(scripts, evalScript);
                }
            }

            return this;
        }
    });

    function root(elem, cur) {
        return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
    }

    function cloneCopyEvent(src, dest) {

        if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
            return;
        }

        var internalKey = jQuery.expando,
		oldData = jQuery.data(src),
		curData = jQuery.data(dest, oldData);

        // Switch to use the internal data object, if it exists, for the next
        // stage of data copying
        if ((oldData = oldData[internalKey])) {
            var events = oldData.events;
            curData = curData[internalKey] = jQuery.extend({}, oldData);

            if (events) {
                delete curData.handle;
                curData.events = {};

                for (var type in events) {
                    for (var i = 0, l = events[type].length; i < l; i++) {
                        jQuery.event.add(dest, type + (events[type][i].namespace ? "." : "") + events[type][i].namespace, events[type][i], events[type][i].data);
                    }
                }
            }
        }
    }

    function cloneFixAttributes(src, dest) {
        var nodeName;

        // We do not need to do anything for non-Elements
        if (dest.nodeType !== 1) {
            return;
        }

        // clearAttributes removes the attributes, which we don't want,
        // but also removes the attachEvent events, which we *do* want
        if (dest.clearAttributes) {
            dest.clearAttributes();
        }

        // mergeAttributes, in contrast, only merges back on the
        // original attributes, not the events
        if (dest.mergeAttributes) {
            dest.mergeAttributes(src);
        }

        nodeName = dest.nodeName.toLowerCase();

        // IE6-8 fail to clone children inside object elements that use
        // the proprietary classid attribute value (rather than the type
        // attribute) to identify the type of content to display
        if (nodeName === "object") {
            dest.outerHTML = src.outerHTML;

        } else if (nodeName === "input" && (src.type === "checkbox" || src.type === "radio")) {
            // IE6-8 fails to persist the checked state of a cloned checkbox
            // or radio button. Worse, IE6-7 fail to give the cloned element
            // a checked appearance if the defaultChecked value isn't also set
            if (src.checked) {
                dest.defaultChecked = dest.checked = src.checked;
            }

            // IE6-7 get confused and end up setting the value of a cloned
            // checkbox/radio button to an empty string instead of "on"
            if (dest.value !== src.value) {
                dest.value = src.value;
            }

            // IE6-8 fails to return the selected option to the default selected
            // state when cloning options
        } else if (nodeName === "option") {
            dest.selected = src.defaultSelected;

            // IE6-8 fails to set the defaultValue to the correct value when
            // cloning other types of input fields
        } else if (nodeName === "input" || nodeName === "textarea") {
            dest.defaultValue = src.defaultValue;
        }

        // Event data gets referenced instead of copied if the expando
        // gets copied too
        dest.removeAttribute(jQuery.expando);
    }

    jQuery.buildFragment = function (args, nodes, scripts) {
        var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

        // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
        // Cloning options loses the selected state, so don't cache them
        // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
        // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
        if (args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		args[0].charAt(0) === "<" && !rnocache.test(args[0]) && (jQuery.support.checkClone || !rchecked.test(args[0]))) {

            cacheable = true;

            cacheresults = jQuery.fragments[args[0]];
            if (cacheresults && cacheresults !== 1) {
                fragment = cacheresults;
            }
        }

        if (!fragment) {
            fragment = doc.createDocumentFragment();
            jQuery.clean(args, doc, fragment, scripts);
        }

        if (cacheable) {
            jQuery.fragments[args[0]] = cacheresults ? fragment : 1;
        }

        return { fragment: fragment, cacheable: cacheable };
    };

    jQuery.fragments = {};

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
            var ret = [],
			insert = jQuery(selector),
			parent = this.length === 1 && this[0].parentNode;

            if (parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1) {
                insert[original](this[0]);
                return this;

            } else {
                for (var i = 0, l = insert.length; i < l; i++) {
                    var elems = (i > 0 ? this.clone(true) : this).get();
                    jQuery(insert[i])[original](elems);
                    ret = ret.concat(elems);
                }

                return this.pushStack(ret, name, insert.selector);
            }
        };
    });

    function getAll(elem) {
        if ("getElementsByTagName" in elem) {
            return elem.getElementsByTagName("*");

        } else if ("querySelectorAll" in elem) {
            return elem.querySelectorAll("*");

        } else {
            return [];
        }
    }

    // Used in clean, fixes the defaultChecked property
    function fixDefaultChecked(elem) {
        if (elem.type === "checkbox" || elem.type === "radio") {
            elem.defaultChecked = elem.checked;
        }
    }
    // Finds all inputs and passes them to fixDefaultChecked
    function findInputs(elem) {
        if (jQuery.nodeName(elem, "input")) {
            fixDefaultChecked(elem);
        } else if (elem.getElementsByTagName) {
            jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
        }
    }

    jQuery.extend({
        clone: function (elem, dataAndEvents, deepDataAndEvents) {
            var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

            if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
                // IE copies events bound via attachEvent when using cloneNode.
                // Calling detachEvent on the clone will also remove the events
                // from the original. In order to get around this, we use some
                // proprietary methods to clear the events. Thanks to MooTools
                // guys for this hotness.

                cloneFixAttributes(elem, clone);

                // Using Sizzle here is crazy slow, so we use getElementsByTagName
                // instead
                srcElements = getAll(elem);
                destElements = getAll(clone);

                // Weird iteration because IE will replace the length property
                // with an element if you are cloning the body and one of the
                // elements on the page has a name or id of "length"
                for (i = 0; srcElements[i]; ++i) {
                    cloneFixAttributes(srcElements[i], destElements[i]);
                }
            }

            // Copy the events from the original to the clone
            if (dataAndEvents) {
                cloneCopyEvent(elem, clone);

                if (deepDataAndEvents) {
                    srcElements = getAll(elem);
                    destElements = getAll(clone);

                    for (i = 0; srcElements[i]; ++i) {
                        cloneCopyEvent(srcElements[i], destElements[i]);
                    }
                }
            }

            // Return the cloned set
            return clone;
        },

        clean: function (elems, context, fragment, scripts) {
            var checkScriptType;

            context = context || document;

            // !context.createElement fails in IE with an error but returns typeof 'object'
            if (typeof context.createElement === "undefined") {
                context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
            }

            var ret = [], j;

            for (var i = 0, elem; (elem = elems[i]) != null; i++) {
                if (typeof elem === "number") {
                    elem += "";
                }

                if (!elem) {
                    continue;
                }

                // Convert html string into DOM nodes
                if (typeof elem === "string") {
                    if (!rhtml.test(elem)) {
                        elem = context.createTextNode(elem);
                    } else {
                        // Fix "XHTML"-style tags in all browsers
                        elem = elem.replace(rxhtmlTag, "<$1></$2>");

                        // Trim whitespace, otherwise indexOf won't work as expected
                        var tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase(),
						wrap = wrapMap[tag] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

                        // Go to html and back, then peel off extra wrappers
                        div.innerHTML = wrap[1] + elem + wrap[2];

                        // Move to the right depth
                        while (depth--) {
                            div = div.lastChild;
                        }

                        // Remove IE's autoinserted <tbody> from table fragments
                        if (!jQuery.support.tbody) {

                            // String was a <table>, *may* have spurious <tbody>
                            var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

                            // String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

                            for (j = tbody.length - 1; j >= 0; --j) {
                                if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) {
                                    tbody[j].parentNode.removeChild(tbody[j]);
                                }
                            }
                        }

                        // IE completely kills leading whitespace when innerHTML is used
                        if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                            div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
                        }

                        elem = div.childNodes;
                    }
                }

                // Resets defaultChecked for any radios and checkboxes
                // about to be appended to the DOM in IE 6/7 (#8060)
                var len;
                if (!jQuery.support.appendChecked) {
                    if (elem[0] && typeof (len = elem.length) === "number") {
                        for (j = 0; j < len; j++) {
                            findInputs(elem[j]);
                        }
                    } else {
                        findInputs(elem);
                    }
                }

                if (elem.nodeType) {
                    ret.push(elem);
                } else {
                    ret = jQuery.merge(ret, elem);
                }
            }

            if (fragment) {
                checkScriptType = function (elem) {
                    return !elem.type || rscriptType.test(elem.type);
                };
                for (i = 0; ret[i]; i++) {
                    if (scripts && jQuery.nodeName(ret[i], "script") && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript")) {
                        scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);

                    } else {
                        if (ret[i].nodeType === 1) {
                            var jsTags = jQuery.grep(ret[i].getElementsByTagName("script"), checkScriptType);

                            ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
                        }
                        fragment.appendChild(ret[i]);
                    }
                }
            }

            return ret;
        },

        cleanData: function (elems) {
            var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

            for (var i = 0, elem; (elem = elems[i]) != null; i++) {
                if (elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) {
                    continue;
                }

                id = elem[jQuery.expando];

                if (id) {
                    data = cache[id] && cache[id][internalKey];

                    if (data && data.events) {
                        for (var type in data.events) {
                            if (special[type]) {
                                jQuery.event.remove(elem, type);

                                // This is a shortcut to avoid jQuery.event.remove's overhead
                            } else {
                                jQuery.removeEvent(elem, type, data.handle);
                            }
                        }

                        // Null the DOM reference to avoid IE6/7/8 leak (#7054)
                        if (data.handle) {
                            data.handle.elem = null;
                        }
                    }

                    if (deleteExpando) {
                        delete elem[jQuery.expando];

                    } else if (elem.removeAttribute) {
                        elem.removeAttribute(jQuery.expando);
                    }

                    delete cache[id];
                }
            }
        }
    });

    function evalScript(i, elem) {
        if (elem.src) {
            jQuery.ajax({
                url: elem.src,
                async: false,
                dataType: "script"
            });
        } else {
            jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "").replace(rcleanScript, "/*$0*/"));
        }

        if (elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }
    }




    var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rdashAlpha = /-([a-z])/ig,
    // fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^[+\-]=/,
	rrelNumFilter = /[^+\-\.\de]+/g,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = ["Left", "Right"],
	cssHeight = ["Top", "Bottom"],
	curCSS,

	getComputedStyle,
	currentStyle,

	fcamelCase = function (all, letter) {
	    return letter.toUpperCase();
	};

    jQuery.fn.css = function (name, value) {
        // Setting 'undefined' is a no-op
        if (arguments.length === 2 && value === undefined) {
            return this;
        }

        return jQuery.access(this, name, value, true, function (elem, name, value) {
            return value !== undefined ?
			jQuery.style(elem, name, value) :
			jQuery.css(elem, name);
        });
    };

    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function (elem, computed) {
                    if (computed) {
                        // We should always get a number back from opacity
                        var ret = curCSS(elem, "opacity", "opacity");
                        return ret === "" ? "1" : ret;

                    } else {
                        return elem.style.opacity;
                    }
                }
            }
        },

        // Exclude the following css properties to add px
        cssNumber: {
            "zIndex": true,
            "fontWeight": true,
            "opacity": true,
            "zoom": true,
            "lineHeight": true,
            "widows": true,
            "orphans": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },

        // Get and set the style property on a DOM Node
        style: function (elem, name, value, extra) {
            // Don't set styles on text and comment nodes
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, type, origName = jQuery.camelCase(name),
			style = elem.style, hooks = jQuery.cssHooks[origName];

            name = jQuery.cssProps[origName] || origName;

            // Check if we're setting a value
            if (value !== undefined) {
                type = typeof value;

                // Make sure that NaN and null values aren't set. See: #7116
                if (type === "number" && isNaN(value) || value == null) {
                    return;
                }

                // convert relative number strings (+= or -=) to relative numbers. #7345
                if (type === "string" && rrelNum.test(value)) {
                    value = +value.replace(rrelNumFilter, "") + parseFloat(jQuery.css(elem, name));
                }

                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                if (type === "number" && !jQuery.cssNumber[origName]) {
                    value += "px";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value)) !== undefined) {
                    // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                    // Fixes bug #5509
                    try {
                        style[name] = value;
                    } catch (e) { }
                }

            } else {
                // If a hook was provided get the non-computed value from there
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[name];
            }
        },

        css: function (elem, name, extra) {
            var ret, hooks;

            // Make sure that we're working with the right name
            name = jQuery.camelCase(name);
            hooks = jQuery.cssHooks[name];
            name = jQuery.cssProps[name] || name;

            // cssFloat needs a special treatment
            if (name === "cssFloat") {
                name = "float";
            }

            // If a hook was provided get the computed value from there
            if (hooks && "get" in hooks && (ret = hooks.get(elem, true, extra)) !== undefined) {
                return ret;

                // Otherwise, if a way to get the computed value exists, use that
            } else if (curCSS) {
                return curCSS(elem, name);
            }
        },

        // A method for quickly swapping in/out CSS properties to get correct calculations
        swap: function (elem, options, callback) {
            var old = {};

            // Remember the old values, and insert the new ones
            for (var name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }

            callback.call(elem);

            // Revert the old values
            for (name in options) {
                elem.style[name] = old[name];
            }
        },

        camelCase: function (string) {
            return string.replace(rdashAlpha, fcamelCase);
        }
    });

    // DEPRECATED, Use jQuery.css() instead
    jQuery.curCSS = jQuery.css;

    jQuery.each(["height", "width"], function (i, name) {
        jQuery.cssHooks[name] = {
            get: function (elem, computed, extra) {
                var val;

                if (computed) {
                    if (elem.offsetWidth !== 0) {
                        val = getWH(elem, name, extra);

                    } else {
                        jQuery.swap(elem, cssShow, function () {
                            val = getWH(elem, name, extra);
                        });
                    }

                    if (val <= 0) {
                        val = curCSS(elem, name, name);

                        if (val === "0px" && currentStyle) {
                            val = currentStyle(elem, name, name);
                        }

                        if (val != null) {
                            // Should return "auto" instead of 0, use 0 for
                            // temporary backwards-compat
                            return val === "" || val === "auto" ? "0px" : val;
                        }
                    }

                    if (val < 0 || val == null) {
                        val = elem.style[name];

                        // Should return "auto" instead of 0, use 0 for
                        // temporary backwards-compat
                        return val === "" || val === "auto" ? "0px" : val;
                    }

                    return typeof val === "string" ? val : val + "px";
                }
            },

            set: function (elem, value) {
                if (rnumpx.test(value)) {
                    // ignore negative width and height values #1599
                    value = parseFloat(value);

                    if (value >= 0) {
                        return value + "px";
                    }

                } else {
                    return value;
                }
            }
        };
    });

    if (!jQuery.support.opacity) {
        jQuery.cssHooks.opacity = {
            get: function (elem, computed) {
                // IE uses filters for opacity
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				computed ? "1" : "";
            },

            set: function (elem, value) {
                var style = elem.style,
				currentStyle = elem.currentStyle;

                // IE has trouble with opacity if it does not have layout
                // Force it by setting the zoom level
                style.zoom = 1;

                // Set the alpha filter to set the opacity
                var opacity = jQuery.isNaN(value) ?
				"" :
				"alpha(opacity=" + value * 100 + ")",
				filter = currentStyle && currentStyle.filter || style.filter || "";

                style.filter = ralpha.test(filter) ?
				filter.replace(ralpha, opacity) :
				filter + " " + opacity;
            }
        };
    }

    jQuery(function () {
        // This hook cannot be added until DOM ready because the support test
        // for it is not run until after DOM ready
        if (!jQuery.support.reliableMarginRight) {
            jQuery.cssHooks.marginRight = {
                get: function (elem, computed) {
                    // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                    // Work around by temporarily setting element display to inline-block
                    var ret;
                    jQuery.swap(elem, { "display": "inline-block" }, function () {
                        if (computed) {
                            ret = curCSS(elem, "margin-right", "marginRight");
                        } else {
                            ret = elem.style.marginRight;
                        }
                    });
                    return ret;
                }
            };
        }
    });

    if (document.defaultView && document.defaultView.getComputedStyle) {
        getComputedStyle = function (elem, name) {
            var ret, defaultView, computedStyle;

            name = name.replace(rupper, "-$1").toLowerCase();

            if (!(defaultView = elem.ownerDocument.defaultView)) {
                return undefined;
            }

            if ((computedStyle = defaultView.getComputedStyle(elem, null))) {
                ret = computedStyle.getPropertyValue(name);
                if (ret === "" && !jQuery.contains(elem.ownerDocument.documentElement, elem)) {
                    ret = jQuery.style(elem, name);
                }
            }

            return ret;
        };
    }

    if (document.documentElement.currentStyle) {
        currentStyle = function (elem, name) {
            var left,
			ret = elem.currentStyle && elem.currentStyle[name],
			rsLeft = elem.runtimeStyle && elem.runtimeStyle[name],
			style = elem.style;

            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            if (!rnumpx.test(ret) && rnum.test(ret)) {
                // Remember the original values
                left = style.left;

                // Put in the new values to get a computed value out
                if (rsLeft) {
                    elem.runtimeStyle.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : (ret || 0);
                ret = style.pixelLeft + "px";

                // Revert the changed values
                style.left = left;
                if (rsLeft) {
                    elem.runtimeStyle.left = rsLeft;
                }
            }

            return ret === "" ? "auto" : ret;
        };
    }

    curCSS = getComputedStyle || currentStyle;

    function getWH(elem, name, extra) {
        var which = name === "width" ? cssWidth : cssHeight,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

        if (extra === "border") {
            return val;
        }

        jQuery.each(which, function () {
            if (!extra) {
                val -= parseFloat(jQuery.css(elem, "padding" + this)) || 0;
            }

            if (extra === "margin") {
                val += parseFloat(jQuery.css(elem, "margin" + this)) || 0;

            } else {
                val -= parseFloat(jQuery.css(elem, "border" + this + "Width")) || 0;
            }
        });

        return val;
    }

    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.hidden = function (elem) {
            var width = elem.offsetWidth,
			height = elem.offsetHeight;

            return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css(elem, "display")) === "none");
        };

        jQuery.expr.filters.visible = function (elem) {
            return !jQuery.expr.filters.hidden(elem);
        };
    }




    var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    // #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

    // Keep a copy of the old load method
	_load = jQuery.fn.load,

    /* Prefilters
    * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
    * 2) These are called:
    *    - BEFORE asking for a transport
    *    - AFTER param serialization (s.data is a string if s.processData is true)
    * 3) key is the dataType
    * 4) the catchall symbol "*" can be used
    * 5) execution will start with transport dataType and THEN continue down to "*" if needed
    */
	prefilters = {},

    /* Transports bindings
    * 1) key is the dataType
    * 2) the catchall symbol "*" can be used
    * 3) selection will start with transport dataType and THEN go to "*" if needed
    */
	transports = {},

    // Document location
	ajaxLocation,

    // Document location segments
	ajaxLocParts;

    // #8138, IE may throw an exception when accessing
    // a field from window.location if document.domain has been set
    try {
        ajaxLocation = location.href;
    } catch (e) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        ajaxLocation = document.createElement("a");
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }

    // Segment location into parts
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports(structure) {

        // dataTypeExpression is optional and defaults to "*"
        return function (dataTypeExpression, func) {

            if (typeof dataTypeExpression !== "string") {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            if (jQuery.isFunction(func)) {
                var dataTypes = dataTypeExpression.toLowerCase().split(rspacesAjax),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

                // For each dataType in the dataTypeExpression
                for (; i < length; i++) {
                    dataType = dataTypes[i];
                    // We control if we're asked to add before
                    // any existing element
                    placeBefore = /^\+/.test(dataType);
                    if (placeBefore) {
                        dataType = dataType.substr(1) || "*";
                    }
                    list = structure[dataType] = structure[dataType] || [];
                    // then we add to the structure accordingly
                    list[placeBefore ? "unshift" : "push"](func);
                }
            }
        };
    }

    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */) {

        dataType = dataType || options.dataTypes[0];
        inspected = inspected || {};

        inspected[dataType] = true;

        var list = structure[dataType],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = (structure === prefilters),
		selection;

        for (; i < length && (executeOnly || !selection) ; i++) {
            selection = list[i](options, originalOptions, jqXHR);
            // If we got redirected to another dataType
            // we try there if executing only and not done already
            if (typeof selection === "string") {
                if (!executeOnly || inspected[selection]) {
                    selection = undefined;
                } else {
                    options.dataTypes.unshift(selection);
                    selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected);
                }
            }
        }
        // If we're only executing or nothing was selected
        // we try the catchall dataType if not done already
        if ((executeOnly || !selection) && !inspected["*"]) {
            selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected);
        }
        // unnecessary when only executing (prefilters)
        // but it'll be ignored by the caller in that case
        return selection;
    }

    jQuery.fn.extend({
        load: function (url, params, callback) {
            if (typeof url !== "string" && _load) {
                return _load.apply(this, arguments);

                // Don't do a request if no elements are being requested
            } else if (!this.length) {
                return this;
            }

            var off = url.indexOf(" ");
            if (off >= 0) {
                var selector = url.slice(off, url.length);
                url = url.slice(0, off);
            }

            // Default to a GET request
            var type = "GET";

            // If the second parameter was provided
            if (params) {
                // If it's a function
                if (jQuery.isFunction(params)) {
                    // We assume that it's the callback
                    callback = params;
                    params = undefined;

                    // Otherwise, build a param string
                } else if (typeof params === "object") {
                    params = jQuery.param(params, jQuery.ajaxSettings.traditional);
                    type = "POST";
                }
            }

            var self = this;

            // Request the remote document
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params,
                // Complete callback (responseText is used internally)
                complete: function (jqXHR, status, responseText) {
                    // Store the response as specified by the jqXHR object
                    responseText = jqXHR.responseText;
                    // If successful, inject the HTML into all the matched elements
                    if (jqXHR.isResolved()) {
                        // #4825: Get the actual response in case
                        // a dataFilter is present in ajaxSettings
                        jqXHR.done(function (r) {
                            responseText = r;
                        });
                        // See if a selector was specified
                        self.html(selector ?
                        // Create a dummy div to hold the results
						jQuery("<div>")
                        // inject the contents of the document in, removing the scripts
                        // to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

                        // Locate the specified elements
							.find(selector) :

                        // If not, just inject the full result
						responseText);
                    }

                    if (callback) {
                        self.each(callback, [responseText, status, jqXHR]);
                    }
                }
            });

            return this;
        },

        serialize: function () {
            return jQuery.param(this.serializeArray());
        },

        serializeArray: function () {
            return this.map(function () {
                return this.elements ? jQuery.makeArray(this.elements) : this;
            })
		.filter(function () {
		    return this.name && !this.disabled &&
				(this.checked || rselectTextarea.test(this.nodeName) ||
					rinput.test(this.type));
		})
		.map(function (i, elem) {
		    var val = jQuery(this).val();

		    return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map(val, function (val, i) {
					    return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
					}) :
					{ name: elem.name, value: val.replace(rCRLF, "\r\n") };
		}).get();
        }
    });

    // Attach a bunch of functions for handling common AJAX events
    jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (i, o) {
        jQuery.fn[o] = function (f) {
            return this.bind(o, f);
        };
    });

    jQuery.each(["get", "post"], function (i, method) {
        jQuery[method] = function (url, data, callback, type) {
            // shift arguments if data argument was omitted
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return jQuery.ajax({
                type: method,
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        };
    });

    jQuery.extend({

        getScript: function (url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        },

        getJSON: function (url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function (target, settings) {
            if (!settings) {
                // Only one parameter, we extend ajaxSettings
                settings = target;
                target = jQuery.extend(true, jQuery.ajaxSettings, settings);
            } else {
                // target was provided, we extend into it
                jQuery.extend(true, target, jQuery.ajaxSettings, settings);
            }
            // Flatten fields we don't want deep extended
            for (var field in { context: 1, url: 1 }) {
                if (field in settings) {
                    target[field] = settings[field];
                } else if (field in jQuery.ajaxSettings) {
                    target[field] = jQuery.ajaxSettings[field];
                }
            }
            return target;
        },

        ajaxSettings: {
            url: ajaxLocation,
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            /*
            timeout: 0,
            data: null,
            dataType: null,
            username: null,
            password: null,
            cache: null,
            traditional: false,
            headers: {},
            */

            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": "*/*"
            },

            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },

            // List of data converters
            // 1) key format is "source_type destination_type" (a single space in-between)
            // 2) the catchall symbol "*" can be used for source_type
            converters: {

                // Convert anything to text
                "* text": window.String,

                // Text to html (true = no transformation)
                "text html": true,

                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,

                // Parse text as xml
                "text xml": jQuery.parseXML
            }
        },

        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),

        // Main method
        ajax: function (url, options) {

            // If url is an object, simulate pre-1.5 signature
            if (typeof url === "object") {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var // Create the final options object
			s = jQuery.ajaxSetup({}, options),
            // Callbacks context
			callbackContext = s.context || s,
            // Context for global events
            // It's the callbackContext if one was provided in the options
            // and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				(callbackContext.nodeType || callbackContext instanceof jQuery) ?
						jQuery(callbackContext) : jQuery.event,
            // Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery._Deferred(),
            // Status-dependent callbacks
			statusCode = s.statusCode || {},
            // ifModified key
			ifModifiedKey,
            // Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
            // Response headers
			responseHeadersString,
			responseHeaders,
            // transport
			transport,
            // timeout handle
			timeoutTimer,
            // Cross-domain detection vars
			parts,
            // The jqXHR state
			state = 0,
            // To know if global events are to be dispatched
			fireGlobals,
            // Loop variable
			i,
            // Fake xhr
			jqXHR = {

			    readyState: 0,

			    // Caches the header
			    setRequestHeader: function (name, value) {
			        if (!state) {
			            var lname = name.toLowerCase();
			            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
			            requestHeaders[name] = value;
			        }
			        return this;
			    },

			    // Raw string
			    getAllResponseHeaders: function () {
			        return state === 2 ? responseHeadersString : null;
			    },

			    // Builds headers hashtable if needed
			    getResponseHeader: function (key) {
			        var match;
			        if (state === 2) {
			            if (!responseHeaders) {
			                responseHeaders = {};
			                while ((match = rheaders.exec(responseHeadersString))) {
			                    responseHeaders[match[1].toLowerCase()] = match[2];
			                }
			            }
			            match = responseHeaders[key.toLowerCase()];
			        }
			        return match === undefined ? null : match;
			    },

			    // Overrides response content-type header
			    overrideMimeType: function (type) {
			        if (!state) {
			            s.mimeType = type;
			        }
			        return this;
			    },

			    // Cancel the request
			    abort: function (statusText) {
			        statusText = statusText || "abort";
			        if (transport) {
			            transport.abort(statusText);
			        }
			        done(0, statusText);
			        return this;
			    }
			};

            // Callback for when everything is done
            // It is defined here because jslint complains if it is declared
            // at the end of the function (which would be more logical and readable)
            function done(status, statusText, responses, headers) {

                // Called once
                if (state === 2) {
                    return;
                }

                // State is "done" now
                state = 2;

                // Clear timeout if it exists
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jqXHR.readyState = status ? 4 : 0;

                var isSuccess,
				success,
				error,
				response = responses ? ajaxHandleResponses(s, jqXHR, responses) : undefined,
				lastModified,
				etag;

                // If successful, handle type chaining
                if (status >= 200 && status < 300 || status === 304) {

                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if (s.ifModified) {

                        if ((lastModified = jqXHR.getResponseHeader("Last-Modified"))) {
                            jQuery.lastModified[ifModifiedKey] = lastModified;
                        }
                        if ((etag = jqXHR.getResponseHeader("Etag"))) {
                            jQuery.etag[ifModifiedKey] = etag;
                        }
                    }

                    // If not modified
                    if (status === 304) {

                        statusText = "notmodified";
                        isSuccess = true;

                        // If we have data
                    } else {

                        try {
                            success = ajaxConvert(s, response);
                            statusText = "success";
                            isSuccess = true;
                        } catch (e) {
                            // We have a parsererror
                            statusText = "parsererror";
                            error = e;
                        }
                    }
                } else {
                    // We extract error from statusText
                    // then normalize statusText and status for non-aborts
                    error = statusText;
                    if (!statusText || status) {
                        statusText = "error";
                        if (status < 0) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = statusText;

                // Success/Error
                if (isSuccess) {
                    deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                } else {
                    deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                }

                // Status-dependent callbacks
                jqXHR.statusCode(statusCode);
                statusCode = undefined;

                if (fireGlobals) {
                    globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"),
						[jqXHR, s, isSuccess ? success : error]);
                }

                // Complete
                completeDeferred.resolveWith(callbackContext, [jqXHR, statusText]);

                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                    // Handle the global AJAX counter
                    if (!(--jQuery.active)) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }

            // Attach deferreds
            deferred.promise(jqXHR);
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
            jqXHR.complete = completeDeferred.done;

            // Status-dependent callbacks
            jqXHR.statusCode = function (map) {
                if (map) {
                    var tmp;
                    if (state < 2) {
                        for (tmp in map) {
                            statusCode[tmp] = [statusCode[tmp], map[tmp]];
                        }
                    } else {
                        tmp = map[jqXHR.status];
                        jqXHR.then(tmp, tmp);
                    }
                }
                return this;
            };

            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
            // We also use the url parameter if available
            s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");

            // Extract dataTypes list
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(rspacesAjax);

            // Determine if a cross-domain request is in order
            if (s.crossDomain == null) {
                parts = rurl.exec(s.url.toLowerCase());
                s.crossDomain = !!(parts &&
				(parts[1] != ajaxLocParts[1] || parts[2] != ajaxLocParts[2] ||
					(parts[3] || (parts[1] === "http:" ? 80 : 443)) !=
						(ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443)))
			);
            }

            // Convert data if not already a string
            if (s.data && s.processData && typeof s.data !== "string") {
                s.data = jQuery.param(s.data, s.traditional);
            }

            // Apply prefilters
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

            // If request was aborted inside a prefiler, stop there
            if (state === 2) {
                return false;
            }

            // We can fire global events as of now if asked to
            fireGlobals = s.global;

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test(s.type);

            // Watch for a new set of requests
            if (fireGlobals && jQuery.active++ === 0) {
                jQuery.event.trigger("ajaxStart");
            }

            // More options handling for requests with no content
            if (!s.hasContent) {

                // If data is available, append data to url
                if (s.data) {
                    s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
                }

                // Get ifModifiedKey before adding the anti-cache parameter
                ifModifiedKey = s.url;

                // Add anti-cache in url if needed
                if (s.cache === false) {

                    var ts = jQuery.now(),
                    // try replacing _= if it is there
					ret = s.url.replace(rts, "$1_=" + ts);

                    // if nothing was replaced, add timestamp to the end
                    s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
                }
            }

            // Set the correct header, if data is being sent
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if (s.ifModified) {
                ifModifiedKey = ifModifiedKey || s.url;
                if (jQuery.lastModified[ifModifiedKey]) {
                    jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
                }
                if (jQuery.etag[ifModifiedKey]) {
                    jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey]);
                }
            }

            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
				s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", */*; q=0.01" : "") :
				s.accepts["*"]
		);

            // Check for headers option
            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }

            // Allow custom headers/mimetypes and early abort
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                // Abort if not done already
                jqXHR.abort();
                return false;

            }

            // Install callbacks on deferreds
            for (i in { success: 1, error: 1, complete: 1 }) {
                jqXHR[i](s[i]);
            }

            // Get transport
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

            // If no transport, we auto-abort
            if (!transport) {
                done(-1, "No Transport");
            } else {
                jqXHR.readyState = 1;
                // Send global event
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                }
                // Timeout
                if (s.async && s.timeout > 0) {
                    timeoutTimer = setTimeout(function () {
                        jqXHR.abort("timeout");
                    }, s.timeout);
                }

                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {
                    // Propagate exception as error if not done
                    if (status < 2) {
                        done(-1, e);
                        // Simply rethrow otherwise
                    } else {
                        jQuery.error(e);
                    }
                }
            }

            return jqXHR;
        },

        // Serialize an array of form elements or a set of
        // key/values into a query string
        param: function (a, traditional) {
            var s = [],
			add = function (key, value) {
			    // If value is a function, invoke it and return its value
			    value = jQuery.isFunction(value) ? value() : value;
			    s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
			};

            // Set traditional to true for jQuery <= 1.3.2 behavior.
            if (traditional === undefined) {
                traditional = jQuery.ajaxSettings.traditional;
            }

            // If an array was passed in, assume that it is an array of form elements.
            if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
                // Serialize the form elements
                jQuery.each(a, function () {
                    add(this.name, this.value);
                });

            } else {
                // If traditional, encode the "old" way (the way 1.3.2 or older
                // did it), otherwise encode params recursively.
                for (var prefix in a) {
                    buildParams(prefix, a[prefix], traditional, add);
                }
            }

            // Return the resulting serialization
            return s.join("&").replace(r20, "+");
        }
    });

    function buildParams(prefix, obj, traditional, add) {
        if (jQuery.isArray(obj)) {
            // Serialize array item.
            jQuery.each(obj, function (i, v) {
                if (traditional || rbracket.test(prefix)) {
                    // Treat each array item as a scalar.
                    add(prefix, v);

                } else {
                    // If array item is non-scalar (array or object), encode its
                    // numeric index to resolve deserialization ambiguity issues.
                    // Note that rack (as of 1.0.0) can't currently deserialize
                    // nested arrays properly, and attempting to do so may cause
                    // a server error. Possible fixes are to modify rack's
                    // deserialization algorithm or to provide an option or flag
                    // to force array serialization to be shallow.
                    buildParams(prefix + "[" + (typeof v === "object" || jQuery.isArray(v) ? i : "") + "]", v, traditional, add);
                }
            });

        } else if (!traditional && obj != null && typeof obj === "object") {
            // Serialize object item.
            for (var name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }

        } else {
            // Serialize scalar item.
            add(prefix, obj);
        }
    }

    // This is still on the jQuery object... for now
    // Want to move this to jQuery.ajax some day
    jQuery.extend({

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {}

    });

    /* Handles responses to an ajax request:
    * - sets all responseXXX fields accordingly
    * - finds the right dataType (mediates between content-type and expected dataType)
    * - returns the corresponding response
    */
    function ajaxHandleResponses(s, jqXHR, responses) {

        var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

        // Fill responseXXX fields
        for (type in responseFields) {
            if (type in responses) {
                jqXHR[responseFields[type]] = responses[type];
            }
        }

        // Remove auto dataType and get content-type in the process
        while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === undefined) {
                ct = s.mimeType || jqXHR.getResponseHeader("content-type");
            }
        }

        // Check if we're dealing with a known content-type
        if (ct) {
            for (type in contents) {
                if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
        } else {
            // Try convertible dataTypes
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
                dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
        }
    }

    // Chain conversions given the request and the original response
    function ajaxConvert(s, response) {

        // Apply the dataFilter if provided
        if (s.dataFilter) {
            response = s.dataFilter(response, s.dataType);
        }

        var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
        // Current and previous dataTypes
		current = dataTypes[0],
		prev,
        // Conversion expression
		conversion,
        // Conversion function
		conv,
        // Conversion functions (transitive conversion)
		conv1,
		conv2;

        // For each dataType in the chain
        for (i = 1; i < length; i++) {

            // Create converters map
            // with lowercased keys
            if (i === 1) {
                for (key in s.converters) {
                    if (typeof key === "string") {
                        converters[key.toLowerCase()] = s.converters[key];
                    }
                }
            }

            // Get the dataTypes
            prev = current;
            current = dataTypes[i];

            // If current is auto dataType, update it to prev
            if (current === "*") {
                current = prev;
                // If no auto and dataTypes are actually different
            } else if (prev !== "*" && prev !== current) {

                // Get the converter
                conversion = prev + " " + current;
                conv = converters[conversion] || converters["* " + current];

                // If there is no direct converter, search transitively
                if (!conv) {
                    conv2 = undefined;
                    for (conv1 in converters) {
                        tmp = conv1.split(" ");
                        if (tmp[0] === prev || tmp[0] === "*") {
                            conv2 = converters[tmp[1] + " " + current];
                            if (conv2) {
                                conv1 = converters[conv1];
                                if (conv1 === true) {
                                    conv = conv2;
                                } else if (conv2 === true) {
                                    conv = conv1;
                                }
                                break;
                            }
                        }
                    }
                }
                // If we found no converter, dispatch an error
                if (!(conv || conv2)) {
                    jQuery.error("No conversion from " + conversion.replace(" ", " to "));
                }
                // If found converter is not an equivalence
                if (conv !== true) {
                    // Convert with 1 or 2 converters accordingly
                    response = conv ? conv(response) : conv2(conv1(response));
                }
            }
        }
        return response;
    }




    var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

    // Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            return jQuery.expando + "_" + (jsc++);
        }
    });

    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

        var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		(typeof s.data === "string");

        if (s.dataTypes[0] === "jsonp" ||
		s.jsonp !== false && (jsre.test(s.url) ||
				inspectData && jsre.test(s.data))) {

            var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[jsonpCallback],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

            if (s.jsonp !== false) {
                url = url.replace(jsre, replace);
                if (s.url === url) {
                    if (inspectData) {
                        data = data.replace(jsre, replace);
                    }
                    if (s.data === data) {
                        // Add callback manually
                        url += (/\?/.test(url) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
                    }
                }
            }

            s.url = url;
            s.data = data;

            // Install callback
            window[jsonpCallback] = function (response) {
                responseContainer = [response];
            };

            // Clean-up function
            jqXHR.always(function () {
                // Set callback back to previous value
                window[jsonpCallback] = previous;
                // Call if it was a function and we have a response
                if (responseContainer && jQuery.isFunction(previous)) {
                    window[jsonpCallback](responseContainer[0]);
                }
            });

            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function () {
                if (!responseContainer) {
                    jQuery.error(jsonpCallback + " was not called");
                }
                return responseContainer[0];
            };

            // force json dataType
            s.dataTypes[0] = "json";

            // Delegate to script
            return "script";
        }
    });




    // Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function (text) {
                jQuery.globalEval(text);
                return text;
            }
        }
    });

    // Handle cache's special case and global
    jQuery.ajaxPrefilter("script", function (s) {
        if (s.cache === undefined) {
            s.cache = false;
        }
        if (s.crossDomain) {
            s.type = "GET";
            s.global = false;
        }
    });

    // Bind script tag hack transport
    jQuery.ajaxTransport("script", function (s) {

        // This transport only deals with cross domain requests
        if (s.crossDomain) {

            var script,
			head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

            return {

                send: function (_, callback) {

                    script = document.createElement("script");

                    script.async = "async";

                    if (s.scriptCharset) {
                        script.charset = s.scriptCharset;
                    }

                    script.src = s.url;

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function (_, isAbort) {

                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {

                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;

                            // Remove the script
                            if (head && script.parentNode) {
                                head.removeChild(script);
                            }

                            // Dereference the script
                            script = undefined;

                            // Callback if not abort
                            if (!isAbort) {
                                callback(200, "success");
                            }
                        }
                    };
                    // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                    // This arises when a base node is used (#2709 and #4378).
                    head.insertBefore(script, head.firstChild);
                },

                abort: function () {
                    if (script) {
                        script.onload(0, 1);
                    }
                }
            };
        }
    });




    var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function () {
	    // Abort all pending requests
	    for (var key in xhrCallbacks) {
	        xhrCallbacks[key](0, 1);
	    }
	} : false,
	xhrId = 0,
	xhrCallbacks;

    // Functions to create xhrs
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch (e) { }
    }

    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) { }
    }

    // Create the request object
    // (This is still attached to ajaxSettings for backward compatibility)
    jQuery.ajaxSettings.xhr = window.ActiveXObject ?
    /* Microsoft failed to properly
    * implement the XMLHttpRequest in IE7 (can't request local files),
    * so we use the ActiveXObject when it is available
    * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
    * we need a fallback.
    */
	function () {
	    return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
    // For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

    // Determine support properties
    (function (xhr) {
        jQuery.extend(jQuery.support, {
            ajax: !!xhr,
            cors: !!xhr && ("withCredentials" in xhr)
        });
    })(jQuery.ajaxSettings.xhr());

    // Create transport if the browser can provide an xhr
    if (jQuery.support.ajax) {

        jQuery.ajaxTransport(function (s) {
            // Cross domain only allowed if supported through XMLHttpRequest
            if (!s.crossDomain || jQuery.support.cors) {

                var callback;

                return {
                    send: function (headers, complete) {

                        // Get a new xhr
                        var xhr = s.xhr(),
						handle,
						i;

                        // Open the socket
                        // Passing null username, generates a login popup on Opera (#2865)
                        if (s.username) {
                            xhr.open(s.type, s.url, s.async, s.username, s.password);
                        } else {
                            xhr.open(s.type, s.url, s.async);
                        }

                        // Apply custom fields if provided
                        if (s.xhrFields) {
                            for (i in s.xhrFields) {
                                xhr[i] = s.xhrFields[i];
                            }
                        }

                        // Override mime type if needed
                        if (s.mimeType && xhr.overrideMimeType) {
                            xhr.overrideMimeType(s.mimeType);
                        }

                        // X-Requested-With header
                        // For cross-domain requests, seeing as conditions for a preflight are
                        // akin to a jigsaw puzzle, we simply never set it to be sure.
                        // (it can always be set on a per-request basis or even using ajaxSetup)
                        // For same-domain requests, won't change header if already provided.
                        if (!s.crossDomain && !headers["X-Requested-With"]) {
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        }

                        // Need an extra try/catch for cross domain requests in Firefox 3
                        try {
                            for (i in headers) {
                                xhr.setRequestHeader(i, headers[i]);
                            }
                        } catch (_) { }

                        // Do send the request
                        // This may raise an exception which is actually
                        // handled in jQuery.ajax (so no try/catch here)
                        xhr.send((s.hasContent && s.data) || null);

                        // Listener
                        callback = function (_, isAbort) {

                            var status,
							statusText,
							responseHeaders,
							responses,
							xml;

                            // Firefox throws exceptions when accessing properties
                            // of an xhr when a network error occured
                            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                            try {

                                // Was never called and is aborted or complete
                                if (callback && (isAbort || xhr.readyState === 4)) {

                                    // Only called once
                                    callback = undefined;

                                    // Do not keep as active anymore
                                    if (handle) {
                                        xhr.onreadystatechange = jQuery.noop;
                                        if (xhrOnUnloadAbort) {
                                            delete xhrCallbacks[handle];
                                        }
                                    }

                                    // If it's an abort
                                    if (isAbort) {
                                        // Abort it manually if needed
                                        if (xhr.readyState !== 4) {
                                            xhr.abort();
                                        }
                                    } else {
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();
                                        responses = {};
                                        xml = xhr.responseXML;

                                        // Construct response list
                                        if (xml && xml.documentElement /* #4958 */) {
                                            responses.xml = xml;
                                        }
                                        responses.text = xhr.responseText;

                                        // Firefox throws an exception when accessing
                                        // statusText for faulty cross-domain requests
                                        try {
                                            statusText = xhr.statusText;
                                        } catch (e) {
                                            // We normalize with Webkit giving an empty statusText
                                            statusText = "";
                                        }

                                        // Filter status for non standard behaviors

                                        // If the request is local and we have data: assume a success
                                        // (success with no data won't get notified, that's the best we
                                        // can do given current implementations)
                                        if (!status && s.isLocal && !s.crossDomain) {
                                            status = responses.text ? 200 : 404;
                                            // IE - #1450: sometimes returns 1223 when it should be 204
                                        } else if (status === 1223) {
                                            status = 204;
                                        }
                                    }
                                }
                            } catch (firefoxAccessException) {
                                if (!isAbort) {
                                    complete(-1, firefoxAccessException);
                                }
                            }

                            // Call complete if needed
                            if (responses) {
                                complete(status, statusText, responses, responseHeaders);
                            }
                        };

                        // if we're in sync mode or it's in cache
                        // and has been retrieved directly (IE6 & IE7)
                        // we need to manually fire the callback
                        if (!s.async || xhr.readyState === 4) {
                            callback();
                        } else {
                            handle = ++xhrId;
                            if (xhrOnUnloadAbort) {
                                // Create the active xhrs callbacks list if needed
                                // and attach the unload handler
                                if (!xhrCallbacks) {
                                    xhrCallbacks = {};
                                    jQuery(window).unload(xhrOnUnloadAbort);
                                }
                                // Add to list of active xhrs callbacks
                                xhrCallbacks[handle] = callback;
                            }
                            xhr.onreadystatechange = callback;
                        }
                    },

                    abort: function () {
                        if (callback) {
                            callback(0, 1);
                        }
                    }
                };
            }
        });
    }




    var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
    // height animations
		["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
    // width animations
		["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
    // opacity animations
		["opacity"]
	],
	fxNow,
	requestAnimationFrame = window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.oRequestAnimationFrame;

    jQuery.fn.extend({
        show: function (speed, easing, callback) {
            var elem, display;

            if (speed || speed === 0) {
                return this.animate(genFx("show", 3), speed, easing, callback);

            } else {
                for (var i = 0, j = this.length; i < j; i++) {
                    elem = this[i];

                    if (elem.style) {
                        display = elem.style.display;

                        // Reset the inline display of this element to learn if it is
                        // being hidden by cascaded rules or not
                        if (!jQuery._data(elem, "olddisplay") && display === "none") {
                            display = elem.style.display = "";
                        }

                        // Set elements which have been overridden with display: none
                        // in a stylesheet to whatever the default browser style is
                        // for such an element
                        if (display === "" && jQuery.css(elem, "display") === "none") {
                            jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                        }
                    }
                }

                // Set the display of most of the elements in a second loop
                // to avoid the constant reflow
                for (i = 0; i < j; i++) {
                    elem = this[i];

                    if (elem.style) {
                        display = elem.style.display;

                        if (display === "" || display === "none") {
                            elem.style.display = jQuery._data(elem, "olddisplay") || "";
                        }
                    }
                }

                return this;
            }
        },

        hide: function (speed, easing, callback) {
            if (speed || speed === 0) {
                return this.animate(genFx("hide", 3), speed, easing, callback);

            } else {
                for (var i = 0, j = this.length; i < j; i++) {
                    if (this[i].style) {
                        var display = jQuery.css(this[i], "display");

                        if (display !== "none" && !jQuery._data(this[i], "olddisplay")) {
                            jQuery._data(this[i], "olddisplay", display);
                        }
                    }
                }

                // Set the display of the elements in a second loop
                // to avoid the constant reflow
                for (i = 0; i < j; i++) {
                    if (this[i].style) {
                        this[i].style.display = "none";
                    }
                }

                return this;
            }
        },

        // Save the old toggle function
        _toggle: jQuery.fn.toggle,

        toggle: function (fn, fn2, callback) {
            var bool = typeof fn === "boolean";

            if (jQuery.isFunction(fn) && jQuery.isFunction(fn2)) {
                this._toggle.apply(this, arguments);

            } else if (fn == null || bool) {
                this.each(function () {
                    var state = bool ? fn : jQuery(this).is(":hidden");
                    jQuery(this)[state ? "show" : "hide"]();
                });

            } else {
                this.animate(genFx("toggle", 3), fn, fn2, callback);
            }

            return this;
        },

        fadeTo: function (speed, to, easing, callback) {
            return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({ opacity: to }, speed, easing, callback);
        },

        animate: function (prop, speed, easing, callback) {
            var optall = jQuery.speed(speed, easing, callback);

            if (jQuery.isEmptyObject(prop)) {
                return this.each(optall.complete, [false]);
            }

            // Do not change referenced properties as per-property easing will be lost
            prop = jQuery.extend({}, prop);

            return this[optall.queue === false ? "each" : "queue"](function () {
                // XXX 'this' does not always have a nodeName when running the
                // test suite

                if (optall.queue === false) {
                    jQuery._mark(this);
                }

                var opt = jQuery.extend({}, optall),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p,
				display, e,
				parts, start, end, unit;

                // will store per property easing and be used to determine when an animation is complete
                opt.animatedProperties = {};

                for (p in prop) {

                    // property name normalization
                    name = jQuery.camelCase(p);
                    if (p !== name) {
                        prop[name] = prop[p];
                        delete prop[p];
                    }

                    val = prop[name];

                    // easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
                    if (jQuery.isArray(val)) {
                        opt.animatedProperties[name] = val[1];
                        val = prop[name] = val[0];
                    } else {
                        opt.animatedProperties[name] = opt.specialEasing && opt.specialEasing[name] || opt.easing || 'swing';
                    }

                    if (val === "hide" && hidden || val === "show" && !hidden) {
                        return opt.complete.call(this);
                    }

                    if (isElement && (name === "height" || name === "width")) {
                        // Make sure that nothing sneaks out
                        // Record all 3 overflow attributes because IE does not
                        // change the overflow attribute when overflowX and
                        // overflowY are set to the same value
                        opt.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY];

                        // Set display property to inline-block for height/width
                        // animations on inline elements that are having width/height
                        // animated
                        if (jQuery.css(this, "display") === "inline" &&
							jQuery.css(this, "float") === "none") {
                            if (!jQuery.support.inlineBlockNeedsLayout) {
                                this.style.display = "inline-block";

                            } else {
                                display = defaultDisplay(this.nodeName);

                                // inline-level elements accept inline-block;
                                // block-level elements need to be inline with layout
                                if (display === "inline") {
                                    this.style.display = "inline-block";

                                } else {
                                    this.style.display = "inline";
                                    this.style.zoom = 1;
                                }
                            }
                        }
                    }
                }

                if (opt.overflow != null) {
                    this.style.overflow = "hidden";
                }

                for (p in prop) {
                    e = new jQuery.fx(this, opt, p);
                    val = prop[p];

                    if (rfxtypes.test(val)) {
                        e[val === "toggle" ? hidden ? "show" : "hide" : val]();

                    } else {
                        parts = rfxnum.exec(val);
                        start = e.cur();

                        if (parts) {
                            end = parseFloat(parts[2]);
                            unit = parts[3] || (jQuery.cssNumber[p] ? "" : "px");

                            // We need to compute starting value
                            if (unit !== "px") {
                                jQuery.style(this, p, (end || 1) + unit);
                                start = ((end || 1) / e.cur()) * start;
                                jQuery.style(this, p, start + unit);
                            }

                            // If a +=/-= token was provided, we're doing a relative animation
                            if (parts[1]) {
                                end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
                            }

                            e.custom(start, end, unit);

                        } else {
                            e.custom(start, val, "");
                        }
                    }
                }

                // For JS strict compliance
                return true;
            });
        },

        stop: function (clearQueue, gotoEnd) {
            if (clearQueue) {
                this.queue([]);
            }

            this.each(function () {
                var timers = jQuery.timers,
				i = timers.length;
                // clear marker counters if we know they won't be
                if (!gotoEnd) {
                    jQuery._unmark(true, this);
                }
                while (i--) {
                    if (timers[i].elem === this) {
                        if (gotoEnd) {
                            // force the next step to be the last
                            timers[i](true);
                        }

                        timers.splice(i, 1);
                    }
                }
            });

            // start the next in the queue if the last step wasn't forced
            if (!gotoEnd) {
                this.dequeue();
            }

            return this;
        }

    });

    // Animations created synchronously will run synchronously
    function createFxNow() {
        setTimeout(clearFxNow, 0);
        return (fxNow = jQuery.now());
    }

    function clearFxNow() {
        fxNow = undefined;
    }

    // Generate parameters to create a standard animation
    function genFx(type, num) {
        var obj = {};

        jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function () {
            obj[this] = type;
        });

        return obj;
    }

    // Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show", 1),
        slideUp: genFx("hide", 1),
        slideToggle: genFx("toggle", 1),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function (name, props) {
        jQuery.fn[name] = function (speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    });

    jQuery.extend({
        speed: function (speed, easing, fn) {
            var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
                complete: fn || !fn && easing ||
				jQuery.isFunction(speed) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
            };

            opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

            // Queueing
            opt.old = opt.complete;
            opt.complete = function (noUnmark) {
                if (opt.queue !== false) {
                    jQuery.dequeue(this);
                } else if (noUnmark !== false) {
                    jQuery._unmark(this);
                }

                if (jQuery.isFunction(opt.old)) {
                    opt.old.call(this);
                }
            };

            return opt;
        },

        easing: {
            linear: function (p, n, firstNum, diff) {
                return firstNum + diff * p;
            },
            swing: function (p, n, firstNum, diff) {
                return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum;
            }
        },

        timers: [],

        fx: function (elem, options, prop) {
            this.options = options;
            this.elem = elem;
            this.prop = prop;

            options.orig = options.orig || {};
        }

    });

    jQuery.fx.prototype = {
        // Simple function for setting a style value
        update: function () {
            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }

            (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
        },

        // Get the current size
        cur: function () {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
                return this.elem[this.prop];
            }

            var parsed,
			r = jQuery.css(this.elem, this.prop);
            // Empty strings, null, undefined and "auto" are converted to 0,
            // complex values such as "rotate(1rad)" are returned as is,
            // simple values such as "10px" are parsed to Float.
            return isNaN(parsed = parseFloat(r)) ? !r || r === "auto" ? 0 : r : parsed;
        },

        // Start an animation from one number to another
        custom: function (from, to, unit) {
            var self = this,
			fx = jQuery.fx,
			raf;

            this.startTime = fxNow || createFxNow();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || (jQuery.cssNumber[this.prop] ? "" : "px");
            this.now = this.start;
            this.pos = this.state = 0;

            function t(gotoEnd) {
                return self.step(gotoEnd);
            }

            t.elem = this.elem;

            if (t() && jQuery.timers.push(t) && !timerId) {
                // Use requestAnimationFrame instead of setInterval if available
                if (requestAnimationFrame) {
                    timerId = 1;
                    raf = function () {
                        // When timerId gets set to null at any point, this stops
                        if (timerId) {
                            requestAnimationFrame(raf);
                            fx.tick();
                        }
                    };
                    requestAnimationFrame(raf);
                } else {
                    timerId = setInterval(fx.tick, fx.interval);
                }
            }
        },

        // Simple 'show' function
        show: function () {
            // Remember where we started, so that we can go back to it later
            this.options.orig[this.prop] = jQuery.style(this.elem, this.prop);
            this.options.show = true;

            // Begin the animation
            // Make sure that we start at a small width/height to avoid any
            // flash of content
            this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

            // Start by showing the element
            jQuery(this.elem).show();
        },

        // Simple 'hide' function
        hide: function () {
            // Remember where we started, so that we can go back to it later
            this.options.orig[this.prop] = jQuery.style(this.elem, this.prop);
            this.options.hide = true;

            // Begin the animation
            this.custom(this.cur(), 0);
        },

        // Each step of an animation
        step: function (gotoEnd) {
            var t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options,
			i, n;

            if (gotoEnd || t >= options.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();

                options.animatedProperties[this.prop] = true;

                for (i in options.animatedProperties) {
                    if (options.animatedProperties[i] !== true) {
                        done = false;
                    }
                }

                if (done) {
                    // Reset the overflow
                    if (options.overflow != null && !jQuery.support.shrinkWrapBlocks) {

                        jQuery.each(["", "X", "Y"], function (index, value) {
                            elem.style["overflow" + value] = options.overflow[index];
                        });
                    }

                    // Hide the element if the "hide" operation was done
                    if (options.hide) {
                        jQuery(elem).hide();
                    }

                    // Reset the properties, if the item has been hidden or shown
                    if (options.hide || options.show) {
                        for (var p in options.animatedProperties) {
                            jQuery.style(elem, p, options.orig[p]);
                        }
                    }

                    // Execute the complete function
                    options.complete.call(elem);
                }

                return false;

            } else {
                // classical easing cannot be used with an Infinity duration
                if (options.duration == Infinity) {
                    this.now = t;
                } else {
                    n = t - this.startTime;
                    this.state = n / options.duration;

                    // Perform the easing function, defaults to swing
                    this.pos = jQuery.easing[options.animatedProperties[this.prop]](this.state, n, 0, 1, options.duration);
                    this.now = this.start + ((this.end - this.start) * this.pos);
                }
                // Perform the next step of the animation
                this.update();
            }

            return true;
        }
    };

    jQuery.extend(jQuery.fx, {
        tick: function () {
            for (var timers = jQuery.timers, i = 0; i < timers.length; ++i) {
                if (!timers[i]()) {
                    timers.splice(i--, 1);
                }
            }

            if (!timers.length) {
                jQuery.fx.stop();
            }
        },

        interval: 13,

        stop: function () {
            clearInterval(timerId);
            timerId = null;
        },

        speeds: {
            slow: 600,
            fast: 200,
            // Default speed
            _default: 400
        },

        step: {
            opacity: function (fx) {
                jQuery.style(fx.elem, "opacity", fx.now);
            },

            _default: function (fx) {
                if (fx.elem.style && fx.elem.style[fx.prop] != null) {
                    fx.elem.style[fx.prop] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
                } else {
                    fx.elem[fx.prop] = fx.now;
                }
            }
        }
    });

    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.animated = function (elem) {
            return jQuery.grep(jQuery.timers, function (fn) {
                return elem === fn.elem;
            }).length;
        };
    }

    // Try to restore the default display value of an element
    function defaultDisplay(nodeName) {

        if (!elemdisplay[nodeName]) {

            var elem = jQuery("<" + nodeName + ">").appendTo("body"),
			display = elem.css("display");

            elem.remove();

            // If the simple way fails,
            // get element's real default display by attaching it to a temp iframe
            if (display === "none" || display === "") {
                // No iframe to use yet, so create it
                if (!iframe) {
                    iframe = document.createElement("iframe");
                    iframe.frameBorder = iframe.width = iframe.height = 0;
                }

                document.body.appendChild(iframe);

                // Create a cacheable copy of the iframe document on first call.
                // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake html
                // document to it, Webkit & Firefox won't allow reusing the iframe document
                if (!iframeDoc || !iframe.createElement) {
                    iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
                    iframeDoc.write("<!doctype><html><body></body></html>");
                }

                elem = iframeDoc.createElement(nodeName);

                iframeDoc.body.appendChild(elem);

                display = jQuery.css(elem, "display");

                document.body.removeChild(iframe);
            }

            // Store the correct default display
            elemdisplay[nodeName] = display;
        }

        return elemdisplay[nodeName];
    }




    var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

    if ("getBoundingClientRect" in document.documentElement) {
        jQuery.fn.offset = function (options) {
            var elem = this[0], box;

            if (options) {
                return this.each(function (i) {
                    jQuery.offset.setOffset(this, options, i);
                });
            }

            if (!elem || !elem.ownerDocument) {
                return null;
            }

            if (elem === elem.ownerDocument.body) {
                return jQuery.offset.bodyOffset(elem);
            }

            try {
                box = elem.getBoundingClientRect();
            } catch (e) { }

            var doc = elem.ownerDocument,
			docElem = doc.documentElement;

            // Make sure we're not dealing with a disconnected DOM node
            if (!box || !jQuery.contains(docElem, elem)) {
                return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
            }

            var body = doc.body,
			win = getWindow(doc),
			clientTop = docElem.clientTop || body.clientTop || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top = box.top + scrollTop - clientTop,
			left = box.left + scrollLeft - clientLeft;

            return { top: top, left: left };
        };

    } else {
        jQuery.fn.offset = function (options) {
            var elem = this[0];

            if (options) {
                return this.each(function (i) {
                    jQuery.offset.setOffset(this, options, i);
                });
            }

            if (!elem || !elem.ownerDocument) {
                return null;
            }

            if (elem === elem.ownerDocument.body) {
                return jQuery.offset.bodyOffset(elem);
            }

            jQuery.offset.initialize();

            var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

            while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
                if (jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed") {
                    break;
                }

                computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
                top -= elem.scrollTop;
                left -= elem.scrollLeft;

                if (elem === offsetParent) {
                    top += elem.offsetTop;
                    left += elem.offsetLeft;

                    if (jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName))) {
                        top += parseFloat(computedStyle.borderTopWidth) || 0;
                        left += parseFloat(computedStyle.borderLeftWidth) || 0;
                    }

                    prevOffsetParent = offsetParent;
                    offsetParent = elem.offsetParent;
                }

                if (jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") {
                    top += parseFloat(computedStyle.borderTopWidth) || 0;
                    left += parseFloat(computedStyle.borderLeftWidth) || 0;
                }

                prevComputedStyle = computedStyle;
            }

            if (prevComputedStyle.position === "relative" || prevComputedStyle.position === "static") {
                top += body.offsetTop;
                left += body.offsetLeft;
            }

            if (jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed") {
                top += Math.max(docElem.scrollTop, body.scrollTop);
                left += Math.max(docElem.scrollLeft, body.scrollLeft);
            }

            return { top: top, left: left };
        };
    }

    jQuery.offset = {
        initialize: function () {
            var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat(jQuery.css(body, "marginTop")) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

            jQuery.extend(container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" });

            container.innerHTML = html;
            body.insertBefore(container, body.firstChild);
            innerDiv = container.firstChild;
            checkDiv = innerDiv.firstChild;
            td = innerDiv.nextSibling.firstChild.firstChild;

            this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
            this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

            checkDiv.style.position = "fixed";
            checkDiv.style.top = "20px";

            // safari subtracts parent border width here which is 5px
            this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
            checkDiv.style.position = checkDiv.style.top = "";

            innerDiv.style.overflow = "hidden";
            innerDiv.style.position = "relative";

            this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

            this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

            body.removeChild(container);
            jQuery.offset.initialize = jQuery.noop;
        },

        bodyOffset: function (body) {
            var top = body.offsetTop,
			left = body.offsetLeft;

            jQuery.offset.initialize();

            if (jQuery.offset.doesNotIncludeMarginInBodyOffset) {
                top += parseFloat(jQuery.css(body, "marginTop")) || 0;
                left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
            }

            return { top: top, left: left };
        },

        setOffset: function (elem, options, i) {
            var position = jQuery.css(elem, "position");

            // set position first, in-case top/left are set even on static elem
            if (position === "static") {
                elem.style.position = "relative";
            }

            var curElem = jQuery(elem),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css(elem, "top"),
			curCSSLeft = jQuery.css(elem, "left"),
			calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

            // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }

            if (jQuery.isFunction(options)) {
                options = options.call(elem, i, curOffset);
            }

            if (options.top != null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            if ("using" in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        }
    };


    jQuery.fn.extend({
        position: function () {
            if (!this[0]) {
                return null;
            }

            var elem = this[0],

            // Get *real* offsetParent
		offsetParent = this.offsetParent(),

            // Get correct offsets
		offset = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0;
            offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0;

            // Add offsetParent borders
            parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0;
            parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0;

            // Subtract the two offsets
            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },

        offsetParent: function () {
            return this.map(function () {
                var offsetParent = this.offsetParent || document.body;
                while (offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent;
            });
        }
    });


    // Create scrollLeft and scrollTop methods
    jQuery.each(["Left", "Top"], function (i, name) {
        var method = "scroll" + name;

        jQuery.fn[method] = function (val) {
            var elem, win;

            if (val === undefined) {
                elem = this[0];

                if (!elem) {
                    return null;
                }

                win = getWindow(elem);

                // Return the scroll offset
                return win ? ("pageXOffset" in win) ? win[i ? "pageYOffset" : "pageXOffset"] :
				jQuery.support.boxModel && win.document.documentElement[method] ||
					win.document.body[method] :
				elem[method];
            }

            // Set the scroll offset
            return this.each(function () {
                win = getWindow(this);

                if (win) {
                    win.scrollTo(
					!i ? val : jQuery(win).scrollLeft(),
					 i ? val : jQuery(win).scrollTop()
				);

                } else {
                    this[method] = val;
                }
            });
        };
    });

    function getWindow(elem) {
        return jQuery.isWindow(elem) ?
            elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
    }




    // Create innerHeight, innerWidth, outerHeight and outerWidth methods
    jQuery.each(["Height", "Width"], function (i, name) {

        var type = name.toLowerCase();

        // innerHeight and innerWidth
        jQuery.fn["inner" + name] = function () {
            return this[0] ?
			parseFloat(jQuery.css(this[0], type, "padding")) :
			null;
        };

        // outerHeight and outerWidth
        jQuery.fn["outer" + name] = function (margin) {
            return this[0] ?
			parseFloat(jQuery.css(this[0], type, margin ? "margin" : "border")) :
			null;
        };

        jQuery.fn[type] = function (size) {
            // Get window width or height
            var elem = this[0];
            if (!elem) {
                return size == null ? null : this;
            }

            if (jQuery.isFunction(size)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    self[type](size.call(this, i, self[type]()));
                });
            }

            if (jQuery.isWindow(elem)) {
                // Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
                // 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
                var docElemProp = elem.document.documentElement["client" + name];
                return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				elem.document.body["client" + name] || docElemProp;

                // Get document width or height
            } else if (elem.nodeType === 9) {
                // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
                return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

                // Get or set width or height on the element
            } else if (size === undefined) {
                var orig = jQuery.css(elem, type),
				ret = parseFloat(orig);

                return jQuery.isNaN(ret) ? orig : ret;

                // Set the width or height on the element (default to pixels if value is unitless)
            } else {
                return this.css(type, typeof size === "string" ? size : size + "px");
            }
        };

    });
    window.jQuery = window.$ = jQuery;
})(window);

/**
* Project: fnmp_json_parse.js
* Version 1.0.0
* Derived from: http://scm.discern-abu.cerner.corp/svn/core-components/trunk/javascript/utils/mp_json_parse.js
*/

/*
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
                   this.getUTCFullYear() + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate()) + 'T' +
                 f(this.getUTCHours()) + ':' +
                 f(this.getUTCMinutes()) + ':' +
                 f(this.getUTCSeconds()) + 'Z' : null;
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
            '"': '\\"',
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

            return str('', { '': value });
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
                    walk({ '': j }, '') : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

/* Hover Mouse Over */
function hmo(evt, n) {
    evt = evt || window.event;
    var s = n.style, p = getPosition(evt), top = p.y + 30, left = p.x + 20;
    n._ps = n.previousSibling;
    n.hmo = true;

    function hover() {
        if (n.hmo == true) { //make sure the cursor has not moused out prior to displaying
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
function hmm(evt, n) {
    if (!n.show) {
        return;
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
function hmt(evt, n) {
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
function hs(e, n) {
    var priorBgColor = e.style.backgroundColor;
    var priorBorderColor = e.style.borderColor;
    if (n && n.tagName == "DIV") {
        e.onmouseenter = function (evt) {
            e.onmouseover = null;
            e.onmouseout = null;
            hmo(evt, n);
        };
        e.onmouseover = function (evt) {
            e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
            hmo(evt, n);
        };
        e.onmousemove = function (evt) {
            e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
            hmm(evt, n);
        };
        e.onmouseout = function (evt) {
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
            hmt(evt, n);
        };
        e.onmouseleave = function (evt) {
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
        EventCache: function () {
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
                add: function (o, e, f) {
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
                remove: function (o, e, f) {
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
                flush: function () {
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
        ce: function (t) {
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
        cep: function (t, p) {
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
        mo: function (o1, o2, d) {
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
        de: function (e) {
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
        cancelBubble: function (e) {
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
        preventDefault: function (e) {
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
        goff: function (e) {
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
        gp: function (e) {
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
        gc: function (e, i) {
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
        gcs: function (e) {

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
        gns: function (e) {
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
        gps: function (e) {
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
        ac: function (e, p) {
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
        ia: function (nn, rn) {
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
        addEvent: function (o, e, f) {

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
        removeEvent: function (o, e, f) {
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
        popup: function (u, n, o) {
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
        ccss: function (e, c) {
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
        acss: function (e, c) {
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
        rcss: function (e, c) {
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
        tcss: function (e, c) {
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
        co: function (e) {
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
        g: function (c, e, t) {
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

/**
* Project: fnmp_component_defs
* Derived from mp_component_defs: http://scm.discern-abu.cerner.corp/svn/core-components/trunk/javascript/core/mp_component_defs.js
* Version 1.0.0
*/

Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

Function.method('inherits', function (parent) {
    var d = {}, p = (this.prototype = new parent());
    this.method('uber', function uber(name) {
        if (!(name in d)) {
            d[name] = 0;
        }
        var f, r, t = d[name], v = parent.prototype;
        if (t) {
            while (t) {
                v = v.constructor.prototype;
                t -= 1;
            }
            f = v[name];
        } else {
            f = p[name];
            if (f == this[name]) {
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

function MPageComponent() {
    this.m_componentId = 0.0;
    this.m_reportId = 0;
    this.m_label = "";
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
    this.m_scope = 0;  //1=person,2=encounter
    this.m_rootComponentNode = null;
    this.m_sectionContentNode = null;
    this.m_compLoadTimerName = "";
    this.m_compRenderTimerName = "";
    this.m_includeLineNumber = false;
    this.m_lookbackUnitTypeFlag = 0; // 1 = hours,2=Days,3=Weeks,4= Months,5= Years
    this.m_lookbackUnits = 0;
    this.m_dateFormat = 2; //1 = date only,2= date/time and 3 = elapsed time
    this.m_isCustomizeView = false;
    this.m_menuItems = null;
    this.m_displayFilters = null;
    this.m_AutoSuggestScript = "";
    this.m_AutoSuggestAddTimerName = "";
    this.m_editMode = false;
    this.m_isRefTxtExpanded = false;
    this.m_isCompDisplayInd = true;
    this.m_display = false;
    this.m_record = null;

    MPageComponent.method("isDisplayable", function () {
        if (this.m_isCompDisplayInd == false) {
            return false;
        }
        if (this.m_displayFilters != null && this.m_displayFilters.length > 0) {
            for (var x = this.m_displayFilters.length; x--;) {
                var displayFilter = this.m_displayFilters[x];
                if (displayFilter.checkFilters() == false)
                    return false;
            }
        }
        return true;
    });

    MPageComponent.method("getDisplayFilters", function () { return this.m_displayFilters; });
    MPageComponent.method("setDisplayFilters", function (value) { this.m_displayFilters = value; });
    MPageComponent.method("addDisplayFilter", function (value) {
        if (this.m_displayFilters == null) {
            this.m_displayFilters = new Array();
        }
        this.m_displayFilters.push(value);
    });


    MPageComponent.method("getMenuItems", function () { return this.m_menuItems; });
    MPageComponent.method("setMenuItems", function (value) { this.m_menuItems = value; });
    MPageComponent.method("addMenuItem", function (value) {
        if (this.m_menuItems == null) {
            this.m_menuItems = new Array();
        }
        this.m_menuItems.push(value);
    });

    MPageComponent.method("getCustomizeView", function () { return this.m_isCustomizeView; });
    MPageComponent.method("setCustomizeView", function (value) { this.m_isCustomizeView = value; });

    MPageComponent.method("InsertData", function () {
        alert("ERROR: InsertData has not been implemented within the component");
    });
    MPageComponent.method("HandleSuccess", function () {
        alert("ERROR: HandleSuccess has not been implemented within the component");
    });
    MPageComponent.method("openTab", function () {
        alert("ERROR: openTab has not been implemented within the component");
    });

    MPageComponent.method("getComponentLoadTimerName", function () { return (this.m_compLoadTimerName); });
    MPageComponent.method("setComponentLoadTimerName", function (value) { this.m_compLoadTimerName = value; });
    MPageComponent.method("getComponentRenderTimerName", function () { return (this.m_compRenderTimerName); });
    MPageComponent.method("setComponentRenderTimerName", function (value) { this.m_compRenderTimerName = value; });
    MPageComponent.method("getRootComponentNode", function () {
        if (this.m_rootComponentNode == null) {
            var style = this.getStyles();
            this.m_rootComponentNode = _g(style.getId());
        }
        return (this.m_rootComponentNode);
    });
    MPageComponent.method("setRootComponentNode", function (value) { this.m_rootComponentNode = value; });
    MPageComponent.method("getSectionContentNode", function () {
        if (this.m_sectionContentNode == null) {
            var style = this.getStyles();
            this.m_sectionContentNode = _g(style.getContentId());
        }
        return (this.m_sectionContentNode);
    });
    MPageComponent.method("setSectionContentNode", function (value) { this.m_sectionContentNode = value; });
    MPageComponent.method("getMPageName", function () { return (this.m_MPageName); });
    MPageComponent.method("setMPageName", function (value) { this.m_MPageName = value; });

    MPageComponent.method("getScope", function () {
        return (this.m_scope);
    });
    MPageComponent.method("setScope", function (value) {
        this.m_scope = value;
    });
    MPageComponent.method("isPlusAddEnabled", function () {
        return (this.m_isPlusAdd);
    });
    MPageComponent.method("setPlusAddEnabled", function (value) {
        this.m_isPlusAdd = value;
    });

    /**
    * For each compoent a criterion is defined for usage.  This criterion contains information such
    * as the person, encounter, personnel, etc.
    * @return {Criterion} Returns a Criterion object containing information such as the patient, encounter, personnel.
    */
    MPageComponent.method("getCriterion", function () {
        return (this.criterion);
    });
    /**
    * Sets the criterion
    * @param {Criterion} value The Criterion object in which to initialize the component with.
    */
    MPageComponent.method("setCriterion", function (value) {
        this.criterion = value;
    });
    /**
    * 
    */
    MPageComponent.method("isNewLink", function () {
        return (this.m_newLink);
    });
    MPageComponent.method("setNewLink", function (value) {
        this.m_newLink = value;
    });
    MPageComponent.method("getPageGroupSequence", function () {
        return (this.m_pageGroupSeq);
    });
    MPageComponent.method("setPageGroupSequence", function (value) {
        this.m_pageGroupSeq = value;
    });
    MPageComponent.method("getLookbackDays", function () {
        return (this.m_lookbackDays);
    });
    MPageComponent.method("setLookbackDays", function (value) {
        this.m_lookbackDays = value;
    });

    MPageComponent.method("getComponentId", function () {
        return (this.m_componentId);
    });
    MPageComponent.method("setComponentId", function (value) {
        this.m_componentId = value;
        var styles = this.getStyles();
        if (styles != null)
            styles.setComponentId(value);
    });
    MPageComponent.method("getReportId", function () {
        return (this.m_reportId);
    });
    MPageComponent.method("setReportId", function (value) {
        this.m_reportId = value;
    });
    MPageComponent.method("getLabel", function () {
        return (this.m_label);
    });
    MPageComponent.method("setLabel", function (value) {
        this.m_label = value;
    });
    MPageComponent.method("getColumn", function () {
        return (this.m_column);
    });
    MPageComponent.method("setColumn", function (value) {
        this.m_column = value;
    });
    MPageComponent.method("getSequence", function () {
        return (this.m_sequence);
    });
    MPageComponent.method("setSequence", function (value) {
        this.m_sequence = value;
    });
    MPageComponent.method("getLink", function () {
        return (this.m_link);
    });
    MPageComponent.method("setLink", function (value) {
        this.m_link = value;
    });
    /**
    * @deprecated Number of results is to be displayed at all times.  Removing the ability to modify.
    */
    MPageComponent.method("isResultsDisplayEnabled", function () {
        return (this.m_totalResults);
    });
    /**
    * @deprecated Number of results is to be displayed at all times.  Removing the ability to modify.
    */
    MPageComponent.method("setResultsDisplayEnabled", function (value) {
        this.m_totalResults = value;
    });
    /**
    * @deprecated Number of results is to be displayed in the (X) format.  Removing the ability to modify.
    */
    MPageComponent.method("isXofYEnabled", function () {
        return (this.m_xOFy);
    });
    /**
    * @deprecated Number of results is to be displayed in the (X) format.  Removing the ability to modify.
    */
    MPageComponent.method("setXofYEnabled", function (value) {
        this.m_xOFy = value;
    });
    MPageComponent.method("isExpanded", function () {
        return (this.m_isExpanded);
    });
    MPageComponent.method("setExpanded", function (value) {
        this.m_isExpanded = value;
    });
    MPageComponent.method("isAlwaysExpanded", function () {
        return (this.m_isAlwaysExpanded);
    });
    MPageComponent.method("setAlwaysExpanded", function (value) {
        this.m_isAlwaysExpanded = value;
    });
    MPageComponent.method("isRefTxtExpanded", function () {
        return (this.m_isRefTxtExpanded);
    });
    MPageComponent.method("setRefTxtExpanded", function (value) {
        this.m_isRefTxtExpanded = value;
    });
    MPageComponent.method("setCompDisplayInd", function (value) {
        this.m_isCompDisplayInd = value;
    });
    MPageComponent.method("setDisplay", function (value) {
        this.m_display = value;
    });
    MPageComponent.method("getDisplay", function () {
        return (this.m_display);
    });
    MPageComponent.method("setRecordData", function (value) {
        this.m_record = value;
    });
    MPageComponent.method("getRecordData", function () {
        return (this.m_record);
    });
    MPageComponent.method("getScrollNumber", function () {
        return (this.m_scrollNumber);
    });
    MPageComponent.method("setScrollNumber", function (value) {
        this.m_scrollNumber = value;
    });
    MPageComponent.method("isScrollingEnabled", function () {
        return (this.m_isScrollEnabled);
    });
    MPageComponent.method("setScrollingEnabled", function (value) {
        this.m_isScrollEnabled = value;
    });
    MPageComponent.method("getStyles", function () {
        return (this.m_styles);
    });
    MPageComponent.method("setStyles", function (value) {
        this.m_styles = value;
    });
    MPageComponent.method("getFilters", function () {
        return (this.m_filters);
    });
    MPageComponent.method("getGroups", function () {
        if (this.m_groups == null) {
            this.m_groups = [];
        }
        return (this.m_groups);
    });
    MPageComponent.method("setGroups", function (value) {
        this.m_groups = value;
    });
    MPageComponent.method("addGroup", function (value) {
        if (this.m_groups == null) {
            this.m_groups = new Array();
        }
        this.m_groups.push(value);
    });

    MPageComponent.method("getLookbackUnitTypeFlag", function () {
        return (this.m_lookbackUnitTypeFlag);
    });
    MPageComponent.method("setLookbackUnitTypeFlag", function (value) {
        this.m_lookbackUnitTypeFlag = value;
    });
    MPageComponent.method("getLookbackUnits", function () {
        return (this.m_lookbackUnits);
    });
    MPageComponent.method("setLookbackUnits", function (value) {
        this.m_lookbackUnits = value;
    });
    MPageComponent.method("getBrLookbackUnitTypeFlag", function () {
        return (this.m_brlookbackUnitTypeFlag);
    });
    MPageComponent.method("setBrLookbackUnitTypeFlag", function (value) {
        this.m_brlookbackUnitTypeFlag = value;
    });
    MPageComponent.method("getBrLookbackUnits", function () {
        return (this.m_brlookbackUnits);
    });
    MPageComponent.method("setBrLookbackUnits", function (value) {
        this.m_brlookbackUnits = value;
    });

    /**
    * Return true if the component has been defined as including the line number within the 
    * title text of the component.
    */
    MPageComponent.method("isLineNumberIncluded", function () {
        return this.m_includeLineNumber;
    });
    /**
    * Allows each component to define, based on requirements, whether or not to display the number of
    * line items within the title text of the component.
    * @param {Boolean} value If true, the line number associated to the component will display within the
    * title text of the component.  Else, the line number will not display within the title text of the
    * component.
    */
    MPageComponent.method("setIncludeLineNumber", function (value) {
        this.m_includeLineNumber = value;
    });
    MPageComponent.method("getDateFormat", function () {
        return (this.m_dateFormat); //1 = date only,2= date/time and 3 = elapsed time
    });
    MPageComponent.method("setDateFormat", function (value) {
        this.m_dateFormat = value;
    });
    MPageComponent.method("setAutoSuggestAddScript", function (value) {
        this.m_AutoSuggestScript = value;
    });
    MPageComponent.method("getAutoSuggestAddScript", function () {
        return (this.m_AutoSuggestScript);
    });
    MPageComponent.method("setAutoSuggestAddTimerName", function (value) {
        this.m_AutoSuggestAddTimerName = value;
    });
    MPageComponent.method("getAutoSuggestAddTimerName", function () {
        return (this.m_AutoSuggestAddTimerName);
    });
    MPageComponent.method("setEditMode", function (value) {
        this.m_editMode = value;
    });
    MPageComponent.method("isEditMode", function () {
        return (this.m_editMode);
    });
    MPageComponent.method("setDisplayEnabled", function (value) {
        this.m_compDisp = value;
    });

}

/*
* The MPage grouper provides a means in which to group MPageGroups together into an
* array for results such as Blood Pressure where each group is a sequence of events.
*/
function MPageGrouper() {
    this.m_groups = null;
    MPageGrouper.method("setGroups", function (value) {
        this.m_groups = value;
    });
    MPageGrouper.method("getGroups", function () {
        return this.m_groups;
    });
    MPageGrouper.method("addGroup", function (value) {
        if (this.m_groups == null)
            this.m_groups = new Array();
        this.m_groups.push(value);
    });
}
MPageGrouper.inherits(MPageGroup);

function MPageGroup() {
    this.m_groupName = "";
    this.m_groupSeq = 0;
    this.m_groupId = 0;
    MPageGroup.method("setGroupId", function (value) {
        this.m_groupId = value;
    });
    MPageGroup.method("getGroupId", function () {
        return this.m_groupId;
    });
    MPageGroup.method("setGroupName", function (value) {
        this.m_groupName = value;
    });
    MPageGroup.method("getGroupName", function () {
        return this.m_groupName;
    });
    MPageGroup.method("setSequence", function (value) {
        this.m_groupSeq = value;
    });
    MPageGroup.method("getSequence", function () {
        return this.m_groupSeq;
    });
}

function MPageEventSetGroup() {
    this.m_eventSets = null;
    this.m_isSequenced = false;
    MPageEventSetGroup.method("isSequenced", function () {
        return this.m_isSequenced;
    });
    MPageEventSetGroup.method("setSequenced", function (value) {
        this.m_isSequenced = value;
    });
    MPageEventSetGroup.method("getEventSets", function () {
        return this.m_eventSets;
    });
    MPageEventSetGroup.method("setEventSets", function (value) {
        this.m_eventSets = value;
    });
    MPageEventSetGroup.method("addEventSet", function (value) {
        if (this.m_eventSets == null)
            this.m_eventSets = new Array();
        this.m_eventSets.push(value);
    });
}
MPageEventSetGroup.inherits(MPageGroup);

function MPageEventCodeGroup() {
    this.m_eventCodes = null;
    this.m_isSequenced = false;
    MPageEventCodeGroup.method("isSequenced", function () {
        return this.m_isSequenced;
    });
    MPageEventCodeGroup.method("setSequenced", function (value) {
        this.m_isSequenced = value;
    });
    MPageEventCodeGroup.method("getEventCodes", function () {
        return this.m_eventCodes;
    });
    MPageEventCodeGroup.method("setEventCodes", function (value) {
        this.m_eventCodes = value;
    });
    MPageEventCodeGroup.method("addEventCode", function (value) {
        if (this.m_eventCodes == null)
            this.m_eventCodes = new Array();
        this.m_eventCodes.push(value);
    });
}
MPageEventCodeGroup.inherits(MPageGroup);

function MPageCodeValueGroup() {
    this.m_codes = null;
    MPageCodeValueGroup.method("getCodes", function () {
        return this.m_codes;
    });
    MPageCodeValueGroup.method("setCodes", function (value) {
        this.m_codes = value;
    });
    MPageCodeValueGroup.method("addCode", function (value) {
        if (this.m_codes == null)
            this.m_codes = new Array();
        this.m_codes.push(value);
    });
}
MPageCodeValueGroup.inherits(MPageGroup);

//The MPageSequenceGroup is a grouper of items such as filter means, event codes, event sets, etc.
function MPageSequenceGroup() {
    this.m_items = null;
    this.m_mapItems = null;
    this.m_isMultiType = false;
    MPageSequenceGroup.method("getItems", function () {
        return this.m_items;
    });
    MPageSequenceGroup.method("setItems", function (value) {
        this.m_items = value;
    });
    MPageSequenceGroup.method("addItem", function (value) {
        if (this.m_items == null)
            this.m_items = new Array();
        this.m_items.push(value);
    });
    MPageSequenceGroup.method("setMultiValue", function (value) {
        this.m_isMultiType = value;
    });
    MPageSequenceGroup.method("isMultiValue", function () {
        return (this.m_isMultiType);
    });
    MPageSequenceGroup.method("getMapItems", function () {
        return this.m_mapItems;
    });
    MPageSequenceGroup.method("setMapItems", function (value) {
        this.m_mapItems = value;
    });
}
MPageSequenceGroup.inherits(MPageGroup);

function MPageGroupValue() {
    this.m_id = 0.0;
    this.m_name = "";

    MPageGroupValue.method("getId", function () {
        return this.m_id;
    });
    MPageGroupValue.method("setId", function (value) {
        this.m_id = value;
    });
    MPageGroupValue.method("getName", function () {
        return this.m_name;
    });
    MPageGroupValue.method("setName", function (value) {
        this.m_name = value;
    });
}

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
    // If a component may be on a page multiple time, a unique identifier such as the component id will need to be set on the style
    // The unique identifier is only utilized on styles that are placeholders to be replaced at a later point.
    this.m_componentId = 0;
    this.m_color = "";

    /**
    * Initializes the component style with the provided namespace to utilize throughout the component.
    * @param {Object} value
    */
    ComponentStyle.method("initByNamespace", function (value) {
        this.m_nameSpace = value;
        this.m_id = value;
        this.m_className += (" " + value + "-sec");
        this.m_contentId = value + "Content";
        this.m_aLink = value + "Link";
        this.m_info = value + "-info";
    });

    ComponentStyle.method("getNameSpace", function () {
        return this.m_nameSpace;
    });
    ComponentStyle.method("getId", function () {
        return this.m_id + this.m_componentId;
    });
    ComponentStyle.method("getClassName", function () {
        return this.m_className;
    });
    ComponentStyle.method("getColor", function () {
        return this.m_color;
    });
    ComponentStyle.method("getContentId", function () {
        return this.m_contentId + this.m_componentId;
    });
    ComponentStyle.method("getContentBodyClass", function () {
        return this.m_contentBodyClass;
    });
    ComponentStyle.method("getContentClass", function () {
        return this.m_contentClass;
    });
    ComponentStyle.method("getHeaderClass", function () {
        return this.m_headerClass;
    });
    ComponentStyle.method("getHeaderToggle", function () {
        return this.m_headToggle;
    });
    ComponentStyle.method("getTitle", function () {
        return this.m_secTitle;
    });
    ComponentStyle.method("getLink", function () {
        return this.m_aLink;
    });
    ComponentStyle.method("getTotal", function () {
        return this.m_secTotal;
    });
    ComponentStyle.method("getInfo", function () {
        return this.m_info;
    });
    ComponentStyle.method("getSearchBoxDiv", function () {
        return this.m_searchBoxDiv;
    });
    ComponentStyle.method("getSubSecContentClass", function () {
        return this.m_subSecContentClass;
    });
    ComponentStyle.method("getSubSecContentClass", function () {
        return this.m_subSecContentClass;
    });
    ComponentStyle.method("getSubSecHeaderClass", function () {
        return this.m_subSecHeaderClass;
    });
    ComponentStyle.method("getSubSecTitleClass", function () {
        return this.m_subSecTitleClass;
    });
    ComponentStyle.method("getSubTitleDisp", function () {
        return this.m_subTitleDisp;
    });
    ComponentStyle.method("setComponentId", function (value) {
        this.m_componentId = value;
    });
    ComponentStyle.method("setNameSpace", function (value) {
        this.m_nameSpace = value;
    });
    ComponentStyle.method("setId", function (value) {
        this.m_id = value;
    });
    ComponentStyle.method("setClassName", function (value) {
        this.m_className = value;
    });
    ComponentStyle.method("setColor", function (value) {
        this.m_color = value;
        this.setClassName(this.getClassName() + " " + value);
    });
    ComponentStyle.method("setContextId", function (value) {
        this.m_contentId = value;
    });
    ComponentStyle.method("setContentBodyClass", function (value) {
        this.m_contentBodyClass = value;
    });
    ComponentStyle.method("setContentClass", function (value) {
        this.m_contentClass = value;
    });
    ComponentStyle.method("setContextClass", function (value) {
        this.m_contentClass = value;
    });
    ComponentStyle.method("setHeaderClass", function (value) {
        this.m_headerClass = value;
    });
    ComponentStyle.method("setHeaderToggle", function (value) {
        this.m_headToggle = value;
    });
    ComponentStyle.method("setSearchBoxDiv", function (value) {
        this.m_searchBoxDiv = value;
    });
    ComponentStyle.method("setSubSecContentClass", function (value) {
        this.m_subSecContentClass = value;
    });
    ComponentStyle.method("setSubSecHeaderClass", function (value) {
        this.m_subSecHeaderClass = value;
    });
    ComponentStyle.method("setSubSecTitleClass", function (value) {
        this.m_subSecTitleClass = value;
    });
    ComponentStyle.method("setSubTitleDisp", function (value) {
        this.m_subTitleDisp = value;
    });
    ComponentStyle.method("setTitle", function (value) {
        this.m_secTitle = value;
    });
    ComponentStyle.method("setLink", function (value) {
        this.m_aLink = value;
    });
    ComponentStyle.method("setTotal", function (value) {
        this.m_secTotal = value;
    });
    ComponentStyle.method("setInfo", function (value) {
        this.m_info = value;
    });
}

/**
* The MPage object
* 
* @author Greg Howdeshell
*/
function MPage() {
    this.pageId = 0.0;
    this.name = null;
    this.components = null;
    this.banner = true;
    this.helpFileName = "";
    this.helpFileURL = ""
    this.criterion = null;
    this.componentIds = null;
    this.isCustomizeView = false;
    this.m_isCustomizeEnabled = true;
    this.m_titleAnchors = null;

    MPage.method("getTitleAnchors", function () { return this.m_titleAnchors; })
    MPage.method("setTitleAnchors", function (value) { this.m_titleAnchors = value; })
    MPage.method("addTitleAnchor", function (value) {
        if (this.m_titleAnchors == null) {
            this.m_titleAnchors = new Array();
        }
        this.m_titleAnchors.push(value);
    });
    MPage.method("getCustomizeEnabled", function () { return this.m_isCustomizeEnabled; })
    MPage.method("setCustomizeEnabled", function (value) { this.m_isCustomizeEnabled = value; })

    MPage.method("getCustomizeView", function () { return this.isCustomizeView; })
    MPage.method("setCustomizeView", function (value) { this.isCustomizeView = value; })

    MPage.method("getComponentIds", function () {
        return (this.componentIds);
    });
    MPage.method("setComponentIds", function (value) {
        this.componentIds = value;
    });
    MPage.method("addComponentId", function (value) {
        if (this.componentIds == null)
            this.componentIds = [];
        this.componentIds.push(value);
    });


    /**
    * The criterion contains information such as the person, encounter, personnel, etc.
    * @return {Criterion} Returns a Criterion object containing information such as the patient, encounter, personnel.
    */
    MPage.method("getCriterion", function () {
        return (this.criterion);
    });
    /**
    * Sets the criterion
    * @param {Criterion} value The Criterion object in which to initialize the MPage with.
    */
    MPage.method("setCriterion", function (value) {
        this.criterion = value;
    });

    /**
    * Return the help file name that is to be loaded when the help file icon is clicked.
    */
    MPage.method("getHelpFileName", function () { return this.helpFileName; })
    /**
    * Sets the help file name that is to be loaded when the help file icon is clicked.
    * @param {String} value The name of the help file to be loaded when the help icon is clicked. 
    */
    MPage.method("setHelpFileName", function (value) { this.helpFileName = value; })
    /**
    * Return the help file name that is to be loaded when the help file icon is clicked.
    */
    MPage.method("getHelpFileURL", function () { return this.helpFileURL; })
    /**
    * Sets the help file name that is to be loaded when the help file icon is clicked.
    * @param {String} value The name of the help file to be loaded when the help icon is clicked. 
    */
    MPage.method("setHelpFileURL", function (value) { this.helpFileURL = value; })
    /**
    * Returns TRUE if the patient demographic banner is to be displayed within the MPage.  False otherwise.
    */
    MPage.method("isBannerEnabled", function () {
        return this.banner;
    });
    /**
    * Sets whether or not to display the patient demographic banner
    * @param {Boolean} value The boolean value in which to note to display or not display the patient demographic banner.
    */
    MPage.method("setBannerEnabled", function (value) {
        this.banner = value;
    });

    /** Gets the primary key associated to the mpage */
    MPage.method("getPageId", function () {
        return this.pageId;
    });
    /**
    * Sets the primary key associated to the mpage
    * @param {Long} value the primary key to be associated to the mpage
    */
    MPage.method("setPageId", function (value) {
        this.pageId = value;
    });
    /** gets the name associated to the mpage */
    MPage.method("getName", function () {
        return this.name;
    });
    /**
    * Sets the namme associated to the mpage
    * @param {String} value the name to be assoicated to the mpage
    */
    MPage.method("setName", function (value) {
        this.name = value;
    });
    /** returns the components associated to the mpage */
    MPage.method('getComponents', function () {
        return this.components;
    });
    /**
    * Sets the list of component objects to the mpage
    * @param {Array} value The list of component objects to the MPage
    */
    MPage.method('setComponents', function (value) {
        this.components = value;
    });
    /**
    * Adds a component to the existing MPage
    * @param {MPageComponent} value The MPageComponent to add to the Mpage
    */
    MPage.method('addComponent', function (value) {
        if (this.components == null) {
            this.components = new Array();
        }
        this.components.push(value);
    });
}

/**
* Sorts the MPage Components by group sequence, then by column, and lastly by row.
* @param {MPageComponent} c1 Component one to compare against
* @param {MPageComponent} c2 Component two to compare against
* @return {Short} Returns the sequence in which the components should display.
* 
* @author Greg Howdeshell
*/
function SortMPageComponents(c1, c2) {
    if (c1.getPageGroupSequence() < c2.getPageGroupSequence()) { return -1 }
    if (c1.getPageGroupSequence() > c2.getPageGroupSequence()) { return 1 }
    return SortMPageComponentCols(c1, c2);
}

function SortMPageComponentCols(c1, c2) {
    if (c1.getColumn() < c2.getColumn()) { return -1 }
    if (c1.getColumn() > c2.getColumn()) { return 1 }
    return SortMPageComponentRows(c1, c2);
}

function SortMPageComponentRows(c1, c2) {
    if (c1.getSequence() < c2.getSequence()) { return -1 }
    if (c1.getSequence() > c2.getSequence()) { return 1 }
    return 0;
}

/**
* Project: fnmp_core
* Version 1.0.0
* Derived from mp_core: http://scm.discern-abu.cerner.corp/svn/core-components/trunk/javascript/core/mp_core.js
*/
/*
The scope of an MPage object and Components are during rendering of the page.  However,
once the page has been rendered these items are lost.  Because there is a need to refresh 
components, the components on a 'page' must be globally stored to allow for refreshing of data.
*/
var CERN_MPageComponents = null;
var CERN_TabManagers = null;
var CERN_WizardComponents = null;
var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;
function AvoidSubmit() {
    return false;
}

Array.prototype.addAll = function (v) {
    if (v && v.length > 0) {
        for (var x = 0, xl = v.length; x < xl; x++) {
            this.push(v[x])
        }
    }
};

/**
* Utility methods
* @namespace MP_Core
* @static
* @global
*/
var MP_Core = function () {
    return {
        Criterion: function (person_id, encntr_id, provider_id, executable, static_content, position_cd, ppr_cd, debug_ind, help_file_local_ind, category_mean, backend_loc) {
            var m_patInfo = null;
            var m_prsnlInfo = null;

            this.person_id = person_id;
            this.encntr_id = encntr_id;
            this.provider_id = provider_id;
            this.executable = executable;
            this.static_content = static_content;
            this.position_cd = position_cd;
            this.ppr_cd = ppr_cd;
            this.debug_ind = debug_ind;
            this.help_file_local_ind = help_file_local_ind;
            this.category_mean = category_mean;
            this.backend_loc = backend_loc;

            this.setPatientInfo = function (value) {
                m_patInfo = value;
            }
            this.getPatientInfo = function () {
                return m_patInfo;
            }

            this.getPersonnelInfo = function () {
                if (!m_prsnlInfo)
                    m_prsnlInfo = new MP_Core.PersonnelInformation(this.provider_id, this.person_id);
                return m_prsnlInfo;
            }
        },
        PatientInformation: function () {
            var m_dob = null;
            var m_sex = null;

            this.setSex = function (value) {
                m_sex = value;
            }
            this.getSex = function () {
                return m_sex;
            }
            this.setDOB = function (value) {
                m_dob = value;
            }
            this.getDOB = function () {
                return m_dob;
            }
        },

        ScriptRequest: function (component, loadTimerName) {
            var m_comp = component;
            var m_load = loadTimerName;
            var m_name = "";
            var m_programName = ""
            var m_params = null;
            var m_async = true;

            this.getComponent = function () {
                return m_comp;
            }
            this.getLoadTimer = function () {
                return m_load;
            }

            this.setName = function (value) {
                m_name = value;
            }
            this.getName = function () {
                return m_name;
            }
            this.setProgramName = function (value) {
                m_programName = value;
            }
            this.getProgramName = function () {
                return m_programName;
            }
            this.setParameters = function (value) {
                m_params = value;
            }
            this.getParameters = function () {
                return m_params;
            }
            this.setAsync = function (value) {
                m_async = value;
            }
            this.isAsync = function () {
                return m_async;
            }
        },
        ScriptReply: function (component) {
            var m_name = ""; //used to syne a request to a reply
            var m_status = "F"; //by default every script reply is 'f'ailed unless otherwise noted
            var m_err = "";
            var m_resp = null;
            var m_comp = component;

            this.setName = function (value) {
                m_name = value;
            }
            this.getName = function () {
                return m_name;
            }
            this.setStatus = function (value) {
                m_status = value;
            }
            this.getStatus = function () {
                return m_status;
            }
            this.setError = function (value) {
                m_err = value;
            }
            this.getError = function () {
                return m_err;
            }
            this.setResponse = function (value) {
                m_resp = value;
            }
            this.getResponse = function () {
                return m_resp;
            }
            this.getComponent = function () {
                return m_comp;
            }
        },
        PersonnelInformation: function (prsnlId, patientId) {
            var m_prsnlId = prsnlId;
            var m_viewableEncntrs = null; //if remain null, error in retrieval of viewable encntr
            //load valid encounter list from patcon wrapper
            var patConObj = null;
            try {
                patConObj = window.external.DiscernObjectFactory("PVCONTXTMPAGE");
                if (patConObj)
                    m_viewableEncntrs = patConObj.GetValidEncounters(patientId);
            }
            catch (e) {
            }
            finally {
                //release used memory
                patConObj = null;
            }

            this.getPersonnelId = function () {
                return m_prsnlId;
            }
            /**
            * Returns the associated encounter that the provide has the ability to see
            */
            this.getViewableEncounters = function () {
                return m_viewableEncntrs;
            }
        },
        XMLCclRequestWrapper: function (component, program, paramAr, async) {
            var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
            var info = new XMLCclRequest();
            info.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    try {
                        var jsonEval = JSON.parse(this.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        if (recordData.STATUS_DATA.STATUS == "Z") {
                            var countText = (component.isLineNumberIncluded() ? "(0)" : "")
                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
                        }
                        else if (recordData.STATUS_DATA.STATUS == "S") {
                            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
                            try {
                                var rootComponentNode = component.getRootComponentNode();
                                var secTitle = Util.Style.g("sec-total", rootComponentNode, "span");
                                secTitle[0].innerHTML = i18n.RENDERING_DATA + "...";
                                component.HandleSuccess(recordData);
                            }
                            catch (err) {
                                if (timerRenderComponent) {
                                    timerRenderComponent.Abort();
                                    timerRenderComponent = null;
                                }
                                throw (err);
                            }
                            finally {
                                if (timerRenderComponent)
                                    timerRenderComponent.Stop();
                            }
                        }
                        else {
                            var errMsg = [];
                            errMsg.push("<b>", i18n.DISCERN_ERROR, "</b><br><ul><li>", i18n.STATUS, ": ", this.status, "</li><li>", i18n.REQUEST, ": ", this.requestText, "</li>");
                            var statusData = recordData.STATUS_DATA;
                            if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0) {
                                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                                    var ss = statusData.SUBEVENTSTATUS[x];
                                    errMsg.push("<li>", i18n.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18n.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18n.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18n.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                                }
                            }
                            else if (statusData.SUBEVENTSTATUS.length == undefined) {
                                var ss = statusData.SUBEVENTSTATUS;
                                errMsg.push("<li>", i18n.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18n.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18n.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18n.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                            }
                            errMsg.push("</ul>")
                            var countText = (component.isLineNumberIncluded() ? "(0)" : "")
                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                        }
                    }
                    catch (err) {
                        var errMsg = [];
                        errMsg.push("<b>", i18n.JS_ERROR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li><li>", i18n.NAME, ": ", err.name, "</li><li>", i18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18n.DESCRIPTION, ": ", err.description, "</li></ul>");
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);

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
                else if (this.readyState == 4 && this.status != 200) {
                    var errMsg = [];
                    errMsg.push("<b>", i18n.DISCERN_ERROR, "</b><br><ul><li>", i18n.STATUS, ": ", this.status, "</li><li>", i18n.REQUEST, ": ", this.requestText, "</li></ul>");
                    MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, "");
                    if (timerLoadComponent)
                        timerLoadComponent.Abort();
                }
                if (this.readyState == 4) {
                    MP_Util.ReleaseRequestReference(this);
                }
            }
            info.open('GET', program, async);
            info.send(paramAr.join(","));
        },
        /*
        * As a means in which to provide the consumer to handle the response of the script request, this method
        * provide an encapsulated means in which to call the XMLCCLRequest and return a ReplyObject with data
        * about the response that can be utilized for evaluation.
        */
        XMLCCLRequestCallBack: function (component, request, funcCallback) {
            var timerLoad = MP_Util.CreateTimer(request.getLoadTimer());
            var info = new XMLCclRequest();
            var reply = new MP_Core.ScriptReply(component);
            reply.setName(request.getName());
            info.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    try {
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
                            var errMsg = [];
                            errMsg.push("<b>", i18n.DISCERN_ERROR, "</b><br><ul><li>", i18n.STATUS, ": ", this.status, "</li><li>", i18n.REQUEST, ": ", this.requestText, "</li>");
                            var statusData = recordData.STATUS_DATA;
                            if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0) {
                                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                                    var ss = statusData.SUBEVENTSTATUS[x];
                                    errMsg.push("<li>", i18n.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18n.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18n.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18n.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                                }
                            }
                            else if (statusData.SUBEVENTSTATUS.length == undefined) {
                                var ss = statusData.SUBEVENTSTATUS;
                                errMsg.push("<li>", i18n.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18n.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18n.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18n.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                            }
                            errMsg.push("</ul>")
                            reply.setError(errMsg.join(""));
                            funcCallback(reply);
                        }
                    }
                    catch (err) {
                        var errMsg = [];
                        errMsg.push("<b>", i18n.DISCERN_ERROR, "</b><br><ul><li>", i18n.STATUS, ": ", this.status, "</li><li>", i18n.REQUEST, ": ", this.requestText, "</li></ul>");
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
                    var errMsg = [];
                    errMsg.push("<b>", i18n.DISCERN_ERROR, "</b><br><ul><li>", i18n.STATUS, ": ", this.status, "</li><li>", i18n.REQUEST, ": ", this.requestText, "</li></ul>");
                    reply.setError(errMsg.join(""));
                    if (timerLoad)
                        timerLoad.Abort();
                    funcCallback(reply);
                }
                if (this.readyState == 4) {
                    MP_Util.ReleaseRequestReference(this);
                }
            }
            info.open('GET', request.getProgramName(), request.isAsync());
            info.send(request.getParameters().join(","));
        },
        XMLCCLRequestThread: function (name, component, request) {
            var m_name = name;
            var m_comp = component;

            var m_request = request;
            m_request.setName(name);

            this.getName = function () {
                return m_name;
            }
            this.getComponent = function () {
                return m_comp;
            }
            this.getRequest = function () {
                return m_request
            };
        },
        XMLCCLRequestThreadManager: function (callbackFunction, component, handleFinalize) {
            var m_threads = null;
            var m_replyAr = null;

            var m_isData = false;
            var m_isError = false;

            this.addThread = function (thread) {
                if (m_threads == null)
                    m_threads = [];

                m_threads.push(thread);
            }

            this.begin = function () {
                if (m_threads && m_threads.length > 0) {
                    for (x = m_threads.length; x--;) {
                        //start each xmlcclrequest
                        var thread = m_threads[x];
                        MP_Core.XMLCCLRequestCallBack(thread.getComponent(), thread.getRequest(), this.completeThread)
                    }
                }
                else {
                    if (handleFinalize) {
                        var countText = (component.isLineNumberIncluded() ? "(0)" : "")
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
                    }
                    else {
                        callbackFunction(null, component);
                    }
                }
            }

            this.completeThread = function (reply) {
                if (m_replyAr == null)
                    m_replyAr = [];

                if (reply.getStatus() == "S")
                    m_isData = true;
                else if (reply.getStatus() == "F") {
                    m_isError = true;
                }

                m_replyAr.push(reply);
                if (m_replyAr.length == m_threads.length) {
                    if (handleFinalize) {
                        if (m_isError) {
                            alert(m_isError)
                            //handle error response
                            var errMsg = [];
                            for (var x = m_replyAr.length; x--;) {
                                var rep = m_replyAr[x];
                                if (rep.getStatus() == "F") {
                                    errMsg.push(rep.getError());
                                }
                            }
                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br>")), component, "");
                        }
                        else if (!m_isData) {
                            //handle no data
                            var countText = (component.isLineNumberIncluded() ? "(0)" : "")
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
            }
        },
        MapObject: function (name, value) {
            this.name = name;
            this.value = value
        },
        /**
        * An object to store the attributes of a single tab.
        * @param {Object} key The id associated to the tab.
        * @param {Object} name The name to be displayed on the tab.
        * @param {Object} components The components to be associated to the tab.
        */
        TabItem: function (key, name, components, prefIdentifier) {
            this.key = key;
            this.name = name;
            this.components = components;
            this.prefIdentifier = prefIdentifier
        },
        TabManager: function (tabItem) {
            var m_isLoaded = false;
            var m_tabItem = tabItem;
            //By default a tab and all it's components are not fully expanded
            var m_isExpandAll = false;
            var m_isSelected = false;
            this.toggleExpandAll = function () {
                m_isExpandAll = (!m_isExpandAll)

            }
            this.loadTab = function () {
                if (!m_isLoaded) {
                    m_isLoaded = true;
                    var components = m_tabItem.components;
                    if (components) {
                        for (var xl = components.length; xl--;) {
                            var component = components[xl];
                            if (component.isDisplayable())
                                component.InsertData();
                        }
                    }
                }
            }
            this.getTabItem = function () {
                return m_tabItem;
            }
            this.getSelectedTab = function () {
                return m_isSelected;
            }
            this.setSelectedTab = function (value) {
                m_isSelected = value;
            }
        },
        ReferenceRangeResult: function () {
            //results
            var m_valNLow = -1, m_valNHigh = -1, m_valCLow = -1, m_valCHigh = -1;
            //units of measure
            var m_uomNLow = null, m_uomNHigh = null, m_uomCLow = null, m_uomCHigh = null;
            this.init = function (refRange, codeArray) {
                m_valCLow = refRange.CRITICAL_LOW.NUMBER;
                if (refRange.CRITICAL_LOW.UNIT_CD != "") {
                    m_uomCLow = MP_Util.GetValueFromArray(refRange.CRITICAL_LOW.UNIT_CD, codeArray);
                }
                m_valCHigh = refRange.CRITICAL_HIGH.NUMBER;
                if (refRange.CRITICAL_HIGH.UNIT_CD != "") {
                    m_uomCHigh = MP_Util.GetValueFromArray(refRange.CRITICAL_HIGH.UNIT_CD, codeArray);
                }
                m_valNLow = refRange.NORMAL_LOW.NUMBER;
                if (refRange.NORMAL_LOW.UNIT_CD != "") {
                    m_uomNLow = MP_Util.GetValueFromArray(refRange.NORMAL_LOW.UNIT_CD, codeArray);
                }
                m_valNHigh = refRange.NORMAL_HIGH.NUMBER;
                if (refRange.NORMAL_HIGH.UNIT_CD != "") {
                    m_uomNHigh = MP_Util.GetValueFromArray(refRange.NORMAL_HIGH.UNIT_CD, codeArray);
                }
            }

            this.getNormalLow = function () {
                return m_valNLow
            };
            this.getNormalHigh = function () {
                return m_valNHigh
            };
            this.getNormalLowUOM = function () {
                return m_uomNLow
            };
            this.getNormalHighUOM = function () {
                return m_uomNHigh
            };
            this.getCriticalLow = function () {
                return m_valCLow
            };
            this.getCriticalHigh = function () {
                return m_valCHigh
            };
            this.getCriticalLowUOM = function () {
                return m_uomCLow
            };
            this.getCriticalHighUOM = function () {
                return m_uomCHigh
            };

            this.toNormalInlineString = function () {
                var low = (m_uomNLow != null) ? m_uomNLow.display : "";
                var high = (m_uomNHigh != null) ? m_uomNHigh.display : "";
                if (m_valNLow != 0 || m_valNHigh != 0)
                    return (m_valNLow + "&nbsp;" + low + " - " + m_valNHigh + "&nbsp;" + high)
                else
                    return "";
            };
            this.toCriticalInlineString = function () {
                var low = (m_uomCLow != null) ? m_uomCLow.display : "";
                var high = (m_uomCHigh != null) ? m_uomCHigh.display : "";
                if (m_valCLow != 0 || m_valCHigh != 0)
                    return (m_valCLow + "&nbsp;" + low + " - " + m_valCHigh + "&nbsp;" + high)
                else
                    return "";
            };
        },

        QuantityValue: function () {
            var m_val, m_precision;
            var m_uom = null;
            var m_refRange = null;
            this.init = function (result, codeArray) {

                var quantityValue = result.QUANTITY_VALUE;
                var referenceRange = result.REFERENCE_RANGE;
                for (var l = 0, ll = quantityValue.length; l < ll; l++) {
                    var numRes = quantityValue[l].NUMBER;
                    m_precision = quantityValue[l].PRECISION;
                    if (!isNaN(numRes)) {
                        m_val = MP_Util.Measurement.SetPrecision(numRes, m_precision);
                    }
                    if (quantityValue[l].MODIFIER_CD != "") {
                        var modCode = MP_Util.GetValueFromArray(quantityValue[l].MODIFIER_CD, codeArray);
                        if (modCode != null)
                            m_val = modCode.display + m_val;
                    }
                    if (quantityValue[l].UNIT_CD != "") {
                        m_uom = MP_Util.GetValueFromArray(quantityValue[l].UNIT_CD, codeArray);
                    }
                    for (var m = 0, ml = referenceRange.length; m < ml; m++) {
                        m_refRange = new MP_Core.ReferenceRangeResult();
                        m_refRange.init(referenceRange[m], codeArray);
                    }
                }
            }
            this.getValue = function () {
                return m_val
            };
            this.getUOM = function () {
                return m_uom
            };
            this.getRefRange = function () {
                return m_refRange
            };
            this.getPrecision = function () {
                return m_precision
            };
            this.toString = function () {
                if (m_uom != null)
                    return (m_val + " " + m_uom.display);
                else
                    return m_val;
            }
        },
        //measurement.init(meas.EVENT_ID, meas.PERSON_ID, meas.ENCNTR_ID, eventCode, dateTime, MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray));
        Measurement: function () {
            var m_eventId = 0.0;
            var m_personId = 0.0;
            var m_encntrId = 0.0;
            var m_eventCode = null;
            var m_dateTime = null;
            var m_updateDateTime = null;
            var m_result = null;
            var m_normalcy = null

            this.init = function (eventId, personId, encntrId, eventCode, dateTime, resultObj, updateDateTime) {
                m_eventId = eventId;
                m_personId = personId;
                m_encntrId = encntrId;
                m_eventCode = eventCode;
                m_dateTime = dateTime;
                m_result = resultObj;
                m_updateDateTime = updateDateTime;
            }
            this.getEventId = function () {
                return m_eventId
            };
            this.getPersonId = function () {
                return m_personId
            };
            this.getEncntrId = function () {
                return m_encntrId
            };
            this.getEventCode = function () {
                return m_eventCode
            };
            this.getDateTime = function () {
                return m_dateTime
            };
            this.getUpdateDateTime = function () {
                return m_updateDateTime
            };
            this.getResult = function () {
                return m_result
            };
            this.setNormalcy = function (value) {
                m_normalcy = value
            };
            this.getNormalcy = function () {
                return m_normalcy
            };
        },
        MenuItem: function () {
            var m_name = "";
            var m_desc = "";
            var m_id = 0.0;

            this.setDescription = function (value) {
                m_desc = value;
            }
            this.getDescription = function () {
                return m_desc;
            }
            this.setName = function (value) {
                m_name = value;
            }
            this.getName = function () {
                return m_name;
            }
            this.setId = function (value) {
                m_id = value;
            }
            this.getId = function () {
                return m_id;
            }
        },
        CriterionFilters: function (criterion) {
            var m_criterion = criterion;
            var m_evalAr = [];

            this.addFilter = function (type, value) {
                m_evalAr.push(new MP_Core.MapObject(type, value))
            }
            this.checkFilters = function () {
                var pass = false;
                var patInfo = m_criterion.getPatientInfo();
                for (var x = m_evalAr.length; x--;) {
                    var filter = m_evalAr[x];
                    switch (filter.name) {
                        case MP_Core.CriterionFilters.SEX_MEANING:
                            var sex = patInfo.getSex();
                            if (sex != null) {
                                //alert("sex check: filter.value [" + filter.value + "] patInfo.sex [" + sex.meaning + "]")
                                if (filter.value == sex.meaning)
                                    continue;
                            }
                            return false;
                            break;
                        case MP_Core.CriterionFilters.DOB_OLDER_THAN:
                            var dob = patInfo.getDOB();
                            if (dob != null) {
                                //alert("dob check: filter.value [" + filter.value + "] patInfo.dob [" + dob + "]")
                                if (dob <= filter.value)
                                    continue;
                            }
                            return false;
                            break;
                        case MP_Core.CriterionFilters.DOB_YOUNGER_THAN:
                            var dob = patInfo.getDOB();
                            if (dob != null) {
                                //alert("dob check: filter.value [" + filter.value + "] patInfo.dob [" + dob + "]")
                                if (dob >= filter.value)
                                    continue;
                            }
                            return false;
                            break;
                        default:
                            alert("Unhandled criterion filter")
                            return false;
                    }
                }
                return true;
            }
        }
    };
}();
//Constants for CriterionFilter items
MP_Core.CriterionFilters.SEX_MEANING = 1;
MP_Core.CriterionFilters.DOB_OLDER_THAN = 2;
MP_Core.CriterionFilters.DOB_YOUNGER_THAN = 3;


MP_Core.AppUserPreferenceManager = function () {
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
        Initialize: function (criterion, preferenceIdentifier) {
            m_criterion = criterion;
            m_prefIdent = preferenceIdentifier;
            m_jsonObject = null;
        },
        LoadPreferences: function () {
            if (m_criterion == null) {
                alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.")
                return null;
            }

            if (m_jsonObject != null)
                return;
            else {
                var info = new XMLCclRequest();
                info.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var jsonEval = JSON.parse(this.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        if (recordData.STATUS_DATA.STATUS == "S") {
                            m_jsonObject = JSON.parse(recordData.PREF_STRING);
                        }
                        else if (recordData.STATUS_DATA.STATUS == "Z") {
                            return;
                        }
                        else {
                            var errAr = [];
                            var statusData = recordData.STATUS_DATA;
                            errAr.push("STATUS: " + statusData.STATUS)
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

                }
                info.open('GET', "MP_GET_USER_PREFS", false);
                var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^"];
                info.send(ar.join(","));
                return;
            }
        },
        /**
        * GetPreferences will return the users preferences for the application currently logged into.
        */
        GetPreferences: function () {
            if (m_criterion == null) {
                alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.")
                return null;
            }
            if (m_jsonObject == null)
                this.LoadPreferences();

            return m_jsonObject;
        },
        SavePreferences: function () {
            var body = document.body;
            var groups = Util.Style.g("col-group", body, "div")
            var grpId = 0;
            var colId = 0;
            var rowId = 0;
            var compId = 0;

            var jsonObject = new Object();
            var userPrefs = jsonObject.user_prefs = new Object();
            var pagePrefs = userPrefs.page_prefs = new Object();
            var components = pagePrefs.components = [];

            //alert("groups.length: " + groups.length)
            for (var x = 0, xl = groups.length; x < xl; x++) {
                grpId = x + 1; //TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
                //get liquid layout
                var liqLay = Util.Style.g("col-outer1", groups[x], "div");
                if (liqLay.length > 0) {
                    //get each child column
                    var cols = Util.gcs(liqLay[0])
                    //	                alert("cols.length: " + cols.length)
                    for (var y = 0, yl = cols.length; y < yl; y++) {
                        colId = y + 1;
                        var rows = Util.gcs(cols[y]);
                        //alert("rows.length: " + rows.length)
                        for (var z = 0, zl = rows.length; z < zl; z++) {
                            var component = new Object()
                            rowId = z + 1;
                            compId = jQuery(rows[z]).attr('id');
                            //alert('component id = '+compId);
                            component.id = compId;
                            component.group_seq = grpId;
                            component.col_seq = colId;
                            component.row_seq = rowId;
                            if (jQuery(rows[z]).hasClass('closed'))
                                component.expanded = false;
                            else
                                component.expanded = true;
                            components.push(component);
                        }
                    }
                }
            }
            WritePreferences(jsonObject);
            m_jsonObject = jsonObject;
            history.back();
        },
        ClearPreferences: function () {
            WritePreferences(null);
            history.back();
        },
        /**
        * Returns the json object associated to the primary div id of the component.  It is assumed LoadPreferences has been called prior to execution
        * @param {Object} id
        */
        GetComponentById: function (id) {
            if (m_jsonObject != null) {
                var components = m_jsonObject.user_prefs.page_prefs.components;
                for (var x = components.length; x--;) {
                    var component = components[x];
                    if (component.id == id)
                        return component;
                }
            }
            return null;
        }
    }
    function WritePreferences(jsonObject, successMessage) {
        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonEval = JSON.parse(this.responseText);
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS == "Z") {
                    m_jsonObject = null;
                }
                else if (recordData.STATUS_DATA.STATUS == "S") {
                    m_jsonObject = jsonObject;
                    if (successMessage != null && successMessage.length > 0)
                        alert(successMessage);
                }
                else {
                    var errAr = [];
                    var statusData = recordData.STATUS_DATA;
                    errAr.push("STATUS: " + statusData.STATUS)
                    for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                        var ss = statusData.SUBEVENTSTATUS[x];
                        errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                    }
                    window.status = "Error saving user preferences: " + errAr.join(",")
                }
            }
            if (this.readyState == 4) {
                MP_Util.ReleaseRequestReference(this);
            }
        }
        info.open('GET', "MP_MAINTAIN_USER_PREFS", false);
        var sJson = (jsonObject != null) ? JSON.stringify(jsonObject) : "";
        var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^", "^" + sJson + "^"];
        info.send(ar.join(","));
    }
}();

var MP_Util = function () {
    return {
        GetCriterion: function (js_criterion, static_content) {
            var jsCrit = js_criterion.CRITERION;
            var criterion = new MP_Core.Criterion(jsCrit.PERSON_ID,
				(jsCrit.ENCNTRS.length > 0) ? jsCrit.ENCNTRS[0].ENCNTR_ID : 0,
				jsCrit.PRSNL_ID,
				jsCrit.EXECUTABLE,
				static_content,
				jsCrit.POSITION_CD,
				jsCrit.PPR_CD,
				(jsCrit.DEBUG_IND == 1) ? true : false,
				jsCrit.HELP_FILE_LOCAL_IND,
				jsCrit.CATEGORY_MEAN,
				jsCrit.BACKEND_LOCATION
				);
            var codeArray = MP_Util.LoadCodeListJSON(jsCrit.CODES);
            var jsPatInfo = jsCrit.PATIENT_INFO;
            var patInfo = new MP_Core.PatientInformation();
            patInfo.setSex(MP_Util.GetValueFromArray(jsPatInfo.SEX_CD, codeArray));
            if (jsPatInfo.DOB != "") {
                var dt = new Date();
                // dt.setISO8601(jsPatInfo.DOB)
                patInfo.setDOB(dt);
            }
            criterion.setPatientInfo(patInfo);
            return criterion;
        },
        CalcLookbackDate: function (lookbackDays) {
            var retDate = new Date();
            var hrs = retDate.getHours();
            hrs -= (lookbackDays * 24);
            retDate.setHours(hrs);
            return retDate;
        },
        CalcWithinTime: function (dateTime) {
            var timeDiff = 0;
            var returnVal = "";
            var today = new Date();
            var one_minute = 1000 * 60;
            var one_hour = one_minute * 60;
            var one_day = one_hour * 24;
            var one_week = one_day * 7;
            var one_month = one_day * (365 / 12);
            var one_year = one_month * 12;

            timeDiff = (today.getTime() - dateTime.getTime()); //time diff in milliseconds
            var valMinutes = Math.ceil(timeDiff / one_minute);
            var valHours = Math.ceil(timeDiff / one_hour);
            var valDays = Math.ceil(timeDiff / one_day);
            var valWeeks = Math.ceil(timeDiff / one_week);
            var valMonths = Math.ceil(timeDiff / one_month);
            var valYears = Math.ceil(timeDiff / one_year);

            if (valHours <= 2)		//Less than 2 hours, display number of minutes. Use abbreviation of "mins". 
                returnVal = (i18n.WITHIN_MINS.replace("{0}", valMinutes));
            else if (valDays <= 2) 	//Less than 2 days, display number of hours. Use abbreviation of "hrs". 
                returnVal = (i18n.WITHIN_HOURS.replace("{0}", valHours));
            else if (valWeeks <= 2)	//Less than 2 weeks, display number of days. Use "days".
                returnVal = (i18n.WITHIN_DAYS.replace("{0}", valDays));
            else if (valMonths <= 2)	//Less than 2 months, display number of weeks. Use abbreviation of "wks".
                returnVal = (i18n.WITHIN_WEEKS.replace("{0}", valWeeks));
            else if (valYears <= 2)	//Less than 2 years, display number of months. Use abbreviation of "mos".
                returnVal = (i18n.WITHIN_MONTHS.replace("{0}", valMonths));
            else 					//Over 2 years, display number of years.  Use abbreviation of "yrs".
                returnVal = (i18n.WITHIN_YEARS.replace("{0}", valYears));

            return (returnVal);
        },
        DisplayDateByOption: function (component, date) {
            var dtFormatted = "";
            switch (component.getDateFormat()) {
                case 1:
                    dtFormatted = date.format("shortDate3");
                    break;
                case 2:
                    dtFormatted = date.format("longDateTime2");
                    break;
                case 3:
                    dtFormatted = MP_Util.CalcWithinTime(date);
                    break;
                case 4:
                    dtFormatted = "&nbsp"; //Display No Date.  Additional logic will need to be applied to hide column.
                    break;
                default:
                    dtFormatted = date.format("longDateTime2");
            }
            return (dtFormatted)
        },
        DisplaySelectedTab: function (showDiv, anchorId) {
            if (window.name == "a-tab0")				//first tab is default
                window.name = "";
            else
                window.name = showDiv + ',' + anchorId;
            var body = document.body;
            var divs = Util.Style.g("div-tab-item", body);
            for (var i = divs.length; i--;) {
                if (divs[i].id == showDiv) {
                    divs[i].style.display = 'block';
                }
                else {
                    divs[i].style.display = 'none';
                }
            }

            var anchors = Util.Style.g("anchor-tab-item", body);
            for (var i = anchors.length; i--;) {
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
                else
                    tabManager.setSelectedTab(false);
            }
        },
        OpenTab: function (compId) {
            for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
                var comp = CERN_MPageComponents[x];
                var styles = comp.getStyles();
                if (styles.getId() == compId) {
                    comp.openTab();
                }
            }
        },
        LaunchMenuSelection: function (compId, menuItemId) {
            //get the exact component from global array
            for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
                var comp = CERN_MPageComponents[x];
                var crit = comp.getCriterion();
                var styles = comp.getStyles();
                if (styles.getId() == compId) {
                    comp.openDropDown(menuItemId)
                    break; //found
                }
            }

        },
        LaunchMenu: function (menuId, componentId) {
            var menu = _g(menuId);
            MP_Util.closeMenuInit(menu, componentId);
            if (menu != null) {
                if (Util.Style.ccss(menu, "menu-hide")) {
                    _g(componentId).style.zIndex = 2;
                    Util.Style.rcss(menu, "menu-hide");
                }
                else {
                    _g(componentId).style.zIndex = 1; //'doc'
                    Util.Style.acss(menu, "menu-hide");
                }
            }
        },
        closeMenuInit: function (inMenu, compId) {
            var menuId;
            var docMenuId = compId + "Menu";
            if (inMenu.id == docMenuId) {//m2 'docMenu'
                menuId = compId;
            }
            if (!e)
                var e = window.event;
            if (window.attachEvent) {
                Util.addEvent(inMenu, "mouseleave", function () {
                    Util.Style.acss(inMenu, "menu-hide");
                    _g(menuId).style.zIndex = 1;
                });
            }
            else {
                Util.addEvent(inMenu, "mouseout", menuLeave);
            }
        },
        menuLeave: function (e) {
            if (!e)
                var e = window.event;
            var relTarg = e.relatedTarget || e.toElement;
            if (e.relatedTarget.id == inMenu.id) {
                Util.Style.acss(inMenu, "menu-hide");
                _g(menuId).style.zIndex = 1;
            }
            e.stopPropagation();
            Util.cancelBubble(e);
        },
        /**
        * Provies the ability to construct the text that is to be placed after the label of the Component.
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
        * @param {MPageComponent} component The component in which to add the title text within.
        * @param {Integer} nbr The count of the list items displayed within the component
        * @param {String} optionalText Optional text to allow each consumer to place text within the header of the
        *                 component.
        */
        CreateTitleText: function (component, nbr, optionalText) {
            var ar = [];
            if (component.isLineNumberIncluded()) {
                ar.push("(", nbr, ")");
            }
            if (optionalText && optionalText != "") {
                ar.push(" ", optionalText)
            }
            return ar.join("");
        },
        GetContentClass: function (component, nbr) {
            if (component.isScrollingEnabled()) {
                var scrollNbr = component.getScrollNumber();
                if (nbr >= scrollNbr && scrollNbr > 0) {
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
        CreateTimer: function (timerName, subTimerName, metaData1, metaData2, metaData3) {
            try {
                var slaTimer = window.external.DiscernObjectFactory("SLATIMER");
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
        GetCodeSet: function (codeSet, async) {
            var codes = new Array();
            var info = new XMLCclRequest();
            info.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
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
            info.open('GET', "MP_GET_CODESET", async);
            var sendVal = "^MINE^, " + codeSet + ".0";
            info.send(sendVal);
            return codes;
        },
        GetCodeByMeaning: function (mapCodes, meaning) {
            for (var x = mapCodes.length; x--;) {
                var code = mapCodes[x].value;
                if (code.meaning == meaning)
                    return code;
            }
        },
        GetItemFromMapArray: function (mapItems, item) {
            for (var x = mapItems.length; x--;) {
                if (mapItems[x].name == item)
                    return mapItems[x].value;
            }
        },
        /**
        * Add an item to the array of items associated to the map key
        * @param {Object} mapItems The map array to search within
        * @param {Object} key The primary key that will be searching for within the map array
        * @param (Object} value The object that is to be added to the map array
        */
        AddItemToMapArray: function (mapItems, key, value) {
            var ar = MP_Util.GetItemFromMapArray(mapItems, key);
            if (ar == null) {
                ar = []
                mapItems.push(new MP_Core.MapObject(key, ar));
            }
            ar.push(value);
        },
        LookBackTime: function (component) {
            var remainder = 0;
            var lookbackDays = component.getLookbackDays();
            if (lookbackDays == 0) {
                return (i18n.SELECTED_VISIT);
            }
            else if (lookbackDays == 1)
                return (i18n.LAST_N_HOURS.replace("{0}", lookbackDays * 24));
            else
                return (i18n.LAST_N_DAYS.replace("{0}", lookbackDays));
        },
        CreateClinNoteLink: function (patient_id, encntr_id, event_id, display, docTypeFlag) {
            var docType = (docTypeFlag && docTypeFlag > 0) ? docTypeFlag : 1;
            var doclink = ""
            if (event_id > 0) {
                var ar = [];
                ar.push(patient_id, encntr_id, event_id, docType);
                doclink = "<a href=javascript:MP_Util.LaunchClinNoteViewer(" + ar.join(",") + ");>" + display + "</a>"
            }
            else {
                doclink = display
            }
            return (doclink);
        },
        /**
        * Retrieves a document for viewing via the MPages RTF viewer
        * @param {Object} eventId The parent or child event id for retrieval
        * @param {Object} docTypeFlag 
        * 0: Parent Event Id retrieval of child event blobs
        * 1: Event Id blob retrieval
        * 2: Long text retrieval
        * 3: Micro Detail retrieval
        * 4: Anatomic Pathology retrieval
        */
        LaunchRTFViewer: function (eventId, docTypeFlag) {
            var ar = [];
            ar.push("^mine^", eventId + ".0", docTypeFlag);
            CCLLINK("mp_clin_smry_clinicaldocs", ar.join(","), 1);
        },
        LaunchClinNoteViewer: function (patient_id, encntr_id, event_id, docTypeFlag) {
            try {
                var sParms = patient_id + "|" + encntr_id + "|" + "[" + event_id + "]|Documents|15|CLINNOTES|3|CLINNOTES|1";
                var tempDate = new Date();
                MPAGES_EVENT('CLINICALNOTE', sParms);
                var tempDate2 = new Date();
                if (tempDate2 - tempDate <= 1000) {
                    MP_Util.LaunchRTFViewer(event_id, docTypeFlag);
                }
            }
            catch (err) {
                MP_Util.LaunchRTFViewer(event_id, docTypeFlag);
            }

        },
        HandleNoDataResponse: function (nameSpace) {
            return ("<h3 class='" + nameSpace + "-info-hd'><span class='res-normal'>" + i18n.NO_RESULTS_FOUND + "</span></h3><span class='res-none'>" + i18n.NO_RESULTS_FOUND + "</span>");
        },
        HandleErrorResponse: function (nameSpace, errorMessage) {
            var ar = [];
            ar.push("<h3 class='" + nameSpace + "-info-hd'><span class='res-normal'>" + i18n.ERROR_RETREIVING_DATA + "</span></h3>");
            ar.push("<dl class='" + nameSpace + "-info'><dt><span>" + i18n.ERROR_RETREIVING_DATA + "</span></dt><dd><span>" + i18n.ERROR_RETREIVING_DATA + "</span></dd></dl>");
            //add error in hover if exists
            if (errorMessage != null && errorMessage.length > 0) {
                ar.push("<h4 class='", nameSpace, "-det-hd'><span>DETAILS</span></h4><div class='hvr'><dl class='", nameSpace, "-det'><dd><span>", errorMessage, "</span></dd></dl></div>");
            }
            return ar.join("");
        },
        GetValueFromArray: function (name, array) {
            if (array != null) {
                for (var x = 0, xi = array.length; x < xi; x++) {
                    if (array[x].name == name) {
                        return (array[x].value);
                    }
                }
            }
            return (null);
        },
        LoadCodeListJSON: function (parentElement) {
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
        LoadPersonelListJSON: function (parentElement) {
            var personnelArray = new Array();
            if (parentElement != null) {
                for (var x = 0; x < parentElement.length; x++) {
                    var perObject = new Object();
                    codeElement = parentElement[x];
                    perObject.id = codeElement.ID;
                    perObject.fullName = codeElement.PROVIDER_NAME.NAME_FULL;
                    perObject.firstName = codeElement.PROVIDER_NAME.NAME_FIRST;
                    perObject.middleName = codeElement.PROVIDER_NAME.NAME_MIDDLE;
                    perObject.lastName = codeElement.PROVIDER_NAME.NAME_LAST;
                    perObject.userName = codeElement.PROVIDER_NAME.USERNAME;
                    perObject.initials = codeElement.PROVIDER_NAME.INITIALS;
                    perObject.title = codeElement.PROVIDER_NAME.TITLE;
                    var mapObj = new MP_Core.MapObject(perObject.id, perObject);
                    personnelArray[x] = mapObj;
                }
            }
            return (personnelArray);
        },
        WriteToFile: function (sText) {
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
        CalculateAge: function (bdate) {
            var age;
            var bdate = new Date(bdate); //typecasting string to date obj
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
        *  http://www.webtoolkit.info/
        **/
        pad: function (str, len, pad, dir) {
            if (typeof (len) == "undefined") {
                var len = 0;
            }
            if (typeof (pad) == "undefined") {
                var pad = ' ';
            }
            if (typeof (dir) == "undefined") {
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
        * @param {float}  patientId
        * @param {float}  encntrId
        * @param {float}  eventCode     : Used to plot simple results for a given patient/encounter I.e. weight,height,BMI,BUN,WBC.
        * @param {string} staticContent : location of the static content directory that contains the core JS / CSS files needed for the graph
        * @param {float}  groupId       : If item is a grouped item pass the BR_DATAMART_FILTER_ID to pull all associated results I.e. BP,Temp,or HR.
        * @param {float}  providerId    : Personel ID of the user
        * @param {float}  positionCd    : Position of the user
        * @param {float}  pprCD         : Person Personell Relationship code value
        * @param {integer}lookBackUnits 
        * @param {integer}lookBackType  : 1 = Hours, 2 = Days, 3 = Weeks, 4 = Months , 5 = Years

        */
        GraphResults: function (personId, encntrId, eventCd, staticContent, groupId, providerId, positionCd, pprCD, lookBackUnits, lookBackType) {
            var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
            var sParams = "^MINE^," + personId + "," + encntrId + "," + eventCd + ",^" + unescape(staticContent) + "^," + groupId + "," + providerId + "," + positionCd + "," + pprCD + "," + lookBackUnits + "," + lookBackType;
            var graphCall = "javascript:CCLLINK('mp_graph_results', '" + sParams + "',1)";
            javascript: CCLNEWSESSIONWINDOW(graphCall, "_self", wParams, 0, 1);
            Util.preventDefault();
        },
        ReleaseRequestReference: function (reqObj) {
            //clean up requests
            if (XMLCCLREQUESTOBJECTPOINTER) {
                for (var id in XMLCCLREQUESTOBJECTPOINTER) {
                    if (XMLCCLREQUESTOBJECTPOINTER[id] == reqObj) {
                        delete (XMLCCLREQUESTOBJECTPOINTER[id])
                    }
                }
            }
        },
        CreateAutoSuggestBoxHtml: function (component) {
            var searchBoxHTML = [];
            var compNs = component.getStyles().getNameSpace();
            var compId = component.getComponentId();
            searchBoxHTML.push("<div><form name='contentForm' OnSubmit='return AvoidSubmit();'><input type='text' id='", compNs, "contentCtrl", compId, "'"
					, " class='search-box'></form></div>");
            return searchBoxHTML.join("");
        },
        AddAutoSuggestControl: function (component, queryHandler, selectionHandler, selectDisplayHandler) {
            new AutoSuggestControl(component, queryHandler, selectionHandler, selectDisplayHandler);
        },
        RetrieveAutoSuggestSearchBox: function (component) {
            var componentNamespace = component.getStyles().getNameSpace();
            var componentId = component.getComponentId();
            return _g(componentNamespace + "contentCtrl" + componentId);
        },
        CreateParamArray: function (ar, type) {
            var returnVal = (type === 1) ? "0.0" : "0";
            if (ar && ar.length > 0) {
                if (ar.length > 1) {
                    if (type === 1) {
                        returnVal = "value(" + ar.join(".0,") + ".0)"
                    }
                    else {
                        returnVal = "value(" + ar.join(",") + ")"
                    }
                }
                else {
                    returnVal = (type === 1) ? ar[0] + ".0" : ar[0];
                }
            }
            return returnVal;
        },
        GetSavedXMLData: function (array1) {
            var comp = m_savedXML.getElementsByTagName("Visit");
            var savedValue = []; savedData = []; count = 0;
            if (comp.length > 0) {
                for (c = 0; c < comp.length; c++) {
                    var calcItems = comp[c].getElementsByTagName("CalculatorItems");
                    if (calcItems.length > 0) {
                        savedValue = calcItems[0].firstChild ? calcItems[0].childNodes[0].nodeValue : "";
                    }
                }
                if (savedValue.length > 0) {
                    var array2 = savedValue.split(",");
                    for (var i = 0; i < array2.length; i++) {
                        for (var j = 0; j < array1.length; j++) {
                            if (array2[i] == array1[j]) {
                                savedData[count] = array2[i];
                                count++;
                            }
                        }
                    }
                }
            }
            return savedData;
        }
    }
}();

MP_Util.Doc = function () {
    var isExpandedAll = false;
    return {
        /**
        * Initialized the page based on a configuration of multiple MPage objects
        * @param {Array} arMapObjects Array of the MPages to initialize the tab layout.
        * @param {String} title The title to be associated to the page.
        */
        InitMPageTabLayout: function (arMapObjects, title) {
            var arItems = [];
            var sc = "", helpFile = "", helpURL = "", debugInd = false;
            var bDisplayBanner = false;
            var criterion = null;
            var custInd = true;
            var anchorArray = null;

            for (var x = 0, xl = arMapObjects.length; x < xl; x++) {
                var key = arMapObjects[x].name;
                var page = arMapObjects[x].value;
                criterion = page.getCriterion();
                //arItems.push(new MP_Core.TabItem(key, page.getName(), page.getComponents(), criterion.category_mean))
                sc = criterion.static_content;
                debugInd = criterion.debug_ind;
                helpFile = page.getHelpFileName();
                helpURL = page.getHelpFileURL();
                custInd = page.getCustomizeEnabled();
                anchorArray = page.getTitleAnchors();
                if (page.isBannerEnabled())
                    bDisplayBanner = page.isBannerEnabled();
            }
            MP_Util.Doc.InitTabLayout(arItems, title, sc, helpFile, helpURL, bDisplayBanner, 0, criterion, custInd, anchorArray);
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
        InitTabLayout: function (arTabItems, title, sc, helpFile, helpURL, includeBanner, debugInd, criterion, custInd, anchorArray) {
            var body = document.body;
            //create page title
            MP_Util.Doc.AddPageTitle(title, body, debugInd, custInd, anchorArray);

            //create help file link
            if (helpFile != null && helpFile.length > 0)
                MP_Util.Doc.AddHelpLink(sc, helpFile);
            else if (helpURL != null && helpURL.length > 0)
                MP_Util.Doc.AddHelpURL(sc, helpURL);

            //check if banner should be created
            if (includeBanner) {
                body.innerHTML += "<div id=banner></div>";
            }
            body.innerHTML += "<div id='disclaimer'><span>" + i18n.DISCLAIMER + "</span></div>";

            //create unordered list for page level tabs
            //  a) need the id of the tabs to identify, b) the name of the tab, c) the components to add
            AddPageTabs(arTabItems, body);

            //create component placeholders for each tab
            CERN_TabManagers = [];
            for (var x = 0, xl = arTabItems.length; x < xl; x++) {
                var tabItem = arTabItems[x];
                var tabManager = new MP_Core.TabManager(tabItem);
                if (x == 0) {
                    //the first tab will be selected upon initial loading of page.
                    tabManager.setSelectedTab(true);
                }
                CERN_TabManagers.push(tabManager);
                CreateLiquidLayout(tabItem.components, _g(arTabItems[x].key));
            }
            MP_Util.Doc.AddCustomizeLink(criterion);
            SetupExpandCollapse();
        },
        InitLayout: function (mPage) {
            var body = document.body;
            var criterion = mPage.getCriterion();
            //create page title
            MP_Util.Doc.AddPageTitle(mPage.getName(), body, criterion.debug_ind, mPage.getCustomizeEnabled(), mPage.getTitleAnchors());

            //create help file link
            var sc = criterion.static_content;
            var helpFile = mPage.getHelpFileName();
            var helpURL = mPage.getHelpFileURL();
            if (helpFile != null && helpFile.length > 0)
                MP_Util.Doc.AddHelpLink(sc, helpFile);
            else if (helpURL != null && helpURL.length > 0)
                MP_Util.Doc.AddHelpURL(sc, helpURL);

            //check if banner should be created
            /* if (mPage.isBannerEnabled())
             {
                 body.innerHTML += "<div id=banner></div>";
             }*/
            body.innerHTML += "<div id='disclaimer'><span>" + "</span></div>";

            //CreateLiquidLayout(mPage.getComponents(), body)
            MP_Util.Doc.AddCustomizeLink(criterion);
            SetupExpandCollapse();
        },
        InitLayoutComponentWizard: function (mPage) {
            var tHTML = "";
            var criterion = mPage.getCriterion();
            CERN_WizardComponents = [];
            CERN_WizardComponents.push(mPage.getComponents());
            tHTML = CreateLiquidLayoutComponent(mPage.getComponents(), tHTML);
            MP_Util.Doc.AddCustomizeLink(criterion);
            return (tHTML);
        },
        SetupExpandCollapseWizard: function (mPage) {
            SetupExpandCollapse();
        },
        CustomizeLayout: function (title, components) {
            var body = document.body;
            MP_Util.Doc.AddPageTitle(title, body, 0, false, null);
            MP_Util.Doc.AddClearPreferences(body)
            MP_Util.Doc.AddSavePreferences(body)

            body.innerHTML += "<div id='disclaimer'><span>" + i18n.USER_CUST_DISCLAIMER + "</span></div>";

            var compAr = [];
            for (var x = components.length; x--;) {
                var component = components[x];
                if (component.getColumn() != 99)
                    compAr.push(component);
            }

            CreateCustomizeLiquidLayout(compAr, body)
            SetupExpandCollapse();
        },
        GetComments: function (par, personnelArray) {
            var com = "", recDate = "";
            var dateTime = new Date();
            for (var j = 0, m = par.COMMENTS.length; j < m; j++) {
                if (personnelArray.length != null) {
                    if (par.COMMENTS[j].RECORDED_BY)
                        perCodeObj = MP_Util.GetValueFromArray(par.COMMENTS[j].RECORDED_BY, personnelArray);

                    if (par.COMMENTS[j].RECORDED_DT_TM != "") {
                        recDate = par.COMMENTS[j].RECORDED_DT_TM;
                        //  dateTime.setISO8601(recDate);
                        recDate = dateTime.format("longDateTime3");
                    }
                    if (j > 0) {
                        com += "<br />";
                    }
                    com += recDate + " -  " + perCodeObj.fullName + "<br />" + par.COMMENTS[j].COMMENT_TEXT;
                }
            }
            return com;
        },
        FinalizeComponent: function (contentHTML, component, countText) {
            var styles = component.getStyles();
            //replace counte text
            var rootComponentNode = component.getRootComponentNode();
            var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
            totalCount[0].innerHTML = countText;

            //replace content with HTML
            var node = component.getSectionContentNode();
            node.innerHTML = contentHTML;

            //init hovers
            MP_Util.Doc.InitHovers(styles.getInfo(), node);

            //init subsection toggles
            if (!component.isRefTxtExpanded()) {
                var style = component.getStyles().getNameSpace();
                var oClass = "fc-sub-sec " + style;
                var nClass = "fc-sub-sec " + style + " closed";
                $("#fc-sub-sec-" + style).removeClass(oClass).addClass(nClass);
            }
            MP_Util.Doc.InitSubToggles(node, "fc-sub-sec-hd-tgl");
            MP_Util.Doc.InitSubToggles(node, "sub-sec-hd-tgl");
            //init scrolling
            MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), component.getScrollNumber(), "1.6")
        },
        /**
        * Formats the content to the appropriate height and enables scrolling
        * @param {node} content : The content to be formatted
        * @param {int} num : The approximate number of items to display face up
        * @param {float} ht : The total line height of an item
        */
        InitScrolling: function (content, num, ht) {
            for (var k = 0; k < content.length; k++) {
                MP_Util.Doc.InitSectionScrolling(content[k], num, ht);
            }
        },
        /**
        * Formats the section to the appropriate height and enables scrolling
        * @param {node} sec : The section to be formatted
        * @param {int} num : The approximate number of items to display face up
        * @param {float} ht : The total line height of an item
        */
        InitSectionScrolling: function (sec, num, ht) {
            var th = num * ht
            var totalHeight = th + "em";
            sec.style.height = totalHeight;
            sec.style.overflowY = 'scroll';
            sec.style.overflowX = 'hidden';
        },
        InitHovers: function (trg, par) {
            gen = Util.Style.g(trg, par, "DL")

            for (var i = 0, l = gen.length; i < l; i++) {
                var m = gen[i];
                if (m) {
                    var nm = Util.gns(Util.gns(m));
                    if (nm) {
                        if (Util.Style.ccss(nm, "hvr")) {
                            hs(m, nm);
                        }
                    }
                }
            }
        },
        InitSubToggles: function (par, tog) {
            var toggleArray = Util.Style.g(tog, par, "span");
            for (var k = 0; k < toggleArray.length; k++) {
                Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
                var checkClosed = Util.gp(Util.gp(toggleArray[k]));
                if (Util.Style.ccss(checkClosed, "closed")) {
                    toggleArray[k].innerHTML = "+";
                    toggleArray[k].title = i18n.SHOW_SECTION;
                }
            }
        },
        ExpandCollapseAll: function () {
            var allSections = Util.Style.g("section");
            var expNode = _g("expAll")
            if (isExpandedAll) {
                for (var i = 0, asLen = allSections.length; i < asLen; i++) {
                    var secHandle = Util.gc(Util.gc(allSections[i]));
                    if (secHandle.innerHTML == "-" || secHandle.innerHTML == "+") {
                        Util.Style.acss(allSections[i], "closed");
                        secHandle.innerHTML = "+";
                        secHandle.title = i18n.SHOW_SECTION;
                    }
                    else {
                        var allSubSections = Util.Style.g("sub-sec", allSections[i], "div");
                        for (var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++) {
                            var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
                            Util.Style.acss(allSubSections[j], "closed");
                            subSecTgl.innerHTML = "+";
                            subSecTgl.title = i18n.SHOW_SECTION;
                        }
                    }
                    //expNode.innerHTML = i18n.EXPAND_ALL;
                }
                isExpandedAll = false;
            }
            else {
                for (var i = 0, asLen = allSections.length; i < asLen; i++) {
                    var secHandle = Util.gc(Util.gc(allSections[i]));
                    if (secHandle.innerHTML == "-" || secHandle.innerHTML == "+") {
                        Util.Style.rcss(allSections[i], "closed");
                        secHandle.innerHTML = "-";
                        secHandle.title = i18n.HIDE_SECTION;
                    }
                    else {
                        var allSubSections = Util.Style.g("sub-sec", allSections[i], "div");
                        for (var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++) {
                            var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
                            Util.Style.rcss(allSubSections[j], "closed");
                            subSecTgl.innerHTML = "-";
                            subSecTgl.title = i18n.HIDE_SECTION;
                        }
                    }
                    expNode.innerHTML = i18n.COLLAPSE_ALL;
                }
                isExpandedAll = true;
            }

        },

        ExpandSubSectionCollapseAll: function () {
            var allSections = Util.Style.g("section");
            var expNode = _g("expandSub")
            if (expNode.innerHTML == i18n.COLLAPSE_SUB_SEC) {
                for (var i = 0, asLen = allSections.length; i < asLen; i++) {

                    var allSubSections = Util.Style.g("fc-sub-sec", allSections[i], "div");
                    for (var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++) {


                        var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
                        Util.Style.acss(allSubSections[j], "closed");
                        subSecTgl.innerHTML = "+";
                        subSecTgl.title = i18n.SHOW_SECTION;
                    }

                    expNode.innerHTML = i18n.EXPAND_SUB_SEC;
                }
            }
            else {
                for (var i = 0, asLen = allSections.length; i < asLen; i++) {
                    var secHandle = Util.gc(Util.gc(allSections[i]));

                    var allSubSections = Util.Style.g("fc-sub-sec", allSections[i], "div");
                    for (var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++) {
                        var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
                        Util.Style.rcss(allSubSections[j], "closed");
                        subSecTgl.innerHTML = "-";
                        subSecTgl.title = i18n.HIDE_SECTION;
                    }

                    expNode.innerHTML = i18n.COLLAPSE_SUB_SEC;
                }
            }

        },
        /**
        * Adds the title to the page.
        * @param {String} title The title of the page to display
        * @param {Object} bodyTag The body tag associated to the HTML document
        * @param {Boolean} debugInd Indicator denoting if the mpage should run in debug mode.
        * @param {Boolean} custInd Indicator denoting if the 'customize' option should be made available to the user for the given layout
        */
        AddPageTitle: function (title, bodyTag, debugInd, custInd, anchorArray) {
            var ar = [];
            if (bodyTag == null)
                bodyTag = document.body;
            ar.push("<div class='pg-hd'>");
            ar.push("<h1><span class=pg-title>", title, "</span></h1><span id=pageCtrl class=page-ctrl>");
            //add optional anchors
            if (anchorArray != null) {
                for (var x = 0, xl = anchorArray.length; x < xl; x++) {
                    ar.push(anchorArray[x]);
                }
            }
            //ar.push("<a id=expAll onclick='javascript:MP_Util.Doc.ExpandCollapseAll()'>",
            //	i18n.EXPAND_ALL, "</a>")
            if (custInd)
                ar.push("<a id=custView></a>");
            ar.push("<a id=helpMenu></a></span></div>");
            bodyTag.innerHTML += ar.join("");
            return;
        },
        AddHelpLink: function (staticContent, helpFile) {
            if (helpFile != null && helpFile != "") {
                var helpNode = _g("helpMenu");
                helpNode.href = staticContent + "\\html\\" + helpFile;
                helpNode.innerHTML = i18n.HELP;
                var imageNode = Util.cep("IMG", { "src": staticContent + "\\images\\3865_16.gif" });
                Util.ia(imageNode, helpNode);
            }
        },
        AddHelpURL: function (staticContent, url) {
            if (url != null && url != "") {
                var helpNode = _g("helpMenu");
                helpNode.href = url;
                helpNode.innerHTML = i18n.HELP;
                var imageNode = Util.cep("IMG", { "src": staticContent + "\\images\\3865_16.gif" });
                Util.ia(imageNode, helpNode);
            }
        },
        AddClearPreferences: function (body) {
            var pageCtrl = _g("pageCtrl");
            var clearPrefNode = Util.cep("A", { "id": "clearPrefs", "onclick": "javascript:MP_Core.AppUserPreferenceManager.ClearPreferences();" });
            clearPrefNode.innerHTML = i18n.CLEAR_PREFERENCES;
            Util.ac(clearPrefNode, pageCtrl)
        },
        AddSavePreferences: function (body) {
            var pageCtrl = _g("pageCtrl");
            var savePrefNode = Util.cep("A", { "id": "savePrefs", "onclick": "javascript:MP_Core.AppUserPreferenceManager.SavePreferences();" });
            savePrefNode.innerHTML = i18n.SAVE_PREFERENCES;
            Util.ac(savePrefNode, pageCtrl)
        },
        AddCustomizeLink: function (criterion) {
            var custNode = _g("custView");
            if (custNode != null) {
                custNode.innerHTML = i18n.CUSTOMIZE;
                var compReportIds = GetPageReportIds();
                custNode.href = criterion.static_content + "\\js\\cust\\mp_user_cust.html?personnelId=" + criterion.provider_id + "&positionCd=" + criterion.position_cd + "&categoryMean=" + GetPreferenceIdentifier();
                custNode.href += (compReportIds.length > 0) ? "&reportIds=" + compReportIds.join(",") : "";

            }
        },
        /**
        * Allows the consumer of the architecture to render the components that exist either on the tab layout
        * or the single driving MPage.  For tab based pages, the first tab is loaded by default.
        */
        RenderLayout: function () {
            // Return to tab being viewed upon refresh - CERTRN
            if (CERN_TabManagers != null) {
                var tabManager = null;
                if (window.name.length > 0) {
                    var paramList = window.name.split(",");
                    MP_Util.DisplaySelectedTab(paramList[0], paramList[1]);
                }
                else {
                    tabManager = CERN_TabManagers[0];
                    tabManager.setSelectedTab(true);
                    tabManager.loadTab();
                }
            }
            else if (CERN_MPageComponents != null) {
                for (var x = CERN_MPageComponents.length; x--;) {
                    var comp = CERN_MPageComponents[x];
                    if (comp.isDisplayable())
                        comp.InsertData();
                }
            }
        },
        ExpandCollapse: function () {
            var gpp = Util.gp(Util.gp(this));
            if (Util.Style.ccss(gpp, "closed")) {
                Util.Style.rcss(gpp, "closed");
                this.innerHTML = "-";
                this.title = i18n.HIDE_SECTION;
            }
            else {
                Util.Style.acss(gpp, "closed");
                this.innerHTML = "+";
                this.title = i18n.SHOW_SECTION;
            }
        },
        DitherComponents: function () {
            var components = m_Mpage.getComponents();
            var comLen = components.length;
            for (var y = 0, yl = comLen; y < yl; y++) {
                if (!(components[y] instanceof VisitTypesComponent)) {
                    var compId = components[y].getStyles().getId();
                    if (_g(compId)) {
                        _g(compId).style.display = "none";
                        $('#wz-hdr').hide();
                        m_dispEMCompInd = false;
                    }
                }
            }
        },
        EnableComponents: function () {
            var components = m_Mpage.getComponents();
            var comLen = components.length;
            for (var y = 0, yl = comLen; y < yl; y++) {
                if (!(components[y] instanceof VisitTypesComponent)) {
                    var compId = components[y].getStyles().getId();
                    if (_g(compId)) {
                        _g(compId).style.display = "block";
                        $('#wz-hdr').show();
                        m_dispEMCompInd = true;
                    }
                }
            }
        }
    };
    function GetPreferenceIdentifier() {
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
        } else if (CERN_WizardComponents != null) {
            for (var x = CERN_WizardComponents.length; x--;) {
                var criterion = CERN_WizardComponents[x].getCriterion();
                return criterion.category_mean;
            }
        }
        return prefIdentifier;
    }
    function GetPageReportIds() {
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

    function GetComponentArray(components) {
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
    function CreateCustomizeLiquidLayout(components, parentNode) {
        var sHTML = [];
        var grpAr = GetComponentArray(components);
        sHTML.push("<div class=pref-columns>");
        for (var x = 0, xl = grpAr.length; x < xl; x++) {
            colAr = grpAr[x];
            sHTML.push("<div>");
            var colLen = colAr.length;
            sHTML.push("<div class='col-group three-col'>"); //always allow for a 3 column custimization
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

    function CreateLiquidLayout(components, parentNode) {
        var grpAr = GetComponentArray(components);
        var sHTML = [];

        for (var x = 0, xl = grpAr.length; x < xl; x++) {
            colAr = grpAr[x];
            sHTML.push("<div>");
            var colLen = colAr.length;
            if (colLen == 1)
                sHTML.push("<div class='col-group one-col'>");
            else if (colLen == 2)
                sHTML.push("<div class='col-group two-col'>");
            else
                sHTML.push("<div class='col-group three-col'>");

            sHTML.push("<div class='col-outer2'><div class='col-outer1'>");

            for (var y = 0; y < colLen; y++) {
                var colClassName = "col" + (y + 1);
                var comps = colAr[y];
                sHTML.push("<div class='", colClassName, "'>")
                for (var z = 0, zl = comps.length; z < zl; z++) {
                    sHTML.push(CreateCompDiv(comps[z]));
                }
                sHTML.push("</div>");
            }
            sHTML.push("</div></div></div></div>");
        }
        parentNode.innerHTML += sHTML.join("");
    }
    function CreateLiquidLayoutComponent(components, parentNode) {
        var grpAr = GetComponentArray(components);
        var sHTML = [];

        for (var x = 0, xl = grpAr.length; x < xl; x++) {
            colAr = grpAr[x];
            sHTML.push("<div>");
            var colLen = colAr.length;
            if (colLen == 1)
                sHTML.push("<div class='col-group one-col'>");
            else if (colLen == 2)
                sHTML.push("<div class='col-group two-col'>");
            else
                sHTML.push("<div class='col-group three-col'>");

            sHTML.push("<div class='col-outer2'><div class='col-outer1'>");

            for (var y = 0; y < colLen; y++) {
                var colClassName = "col" + (y + 1);
                var comps = colAr[y];
                sHTML.push("<div class='", colClassName, "'>")
                for (var z = 0, zl = comps.length; z < zl; z++) {
                    sHTML.push(CreateCompDiv(comps[z]));
                }
                sHTML.push("</div>");
            }
            sHTML.push("</div></div></div></div>");
        }
        //parentNode.innerHTML += sHTML.join("");
        return (sHTML.join(""));
    }
    function SetupExpandCollapse() {
        //set up expand collapse for all components
        var toggleArray = Util.Style.g("sec-hd-tgl");
        for (var k = 0; k < toggleArray.length; k++) {
            Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
            var checkClosed = Util.gp(Util.gp(toggleArray[k]));
            if (Util.Style.ccss(checkClosed, "closed")) {
                toggleArray[k].innerHTML = "+";
                toggleArray[k].title = i18n.SHOW_SECTION;
            }
        }
    }

    function CreateCompDiv(component) {
        var ar = [];
        var style = component.getStyles();
        var ns = style.getNameSpace();
        var compId = style.getId();
        var secClass = style.getClassName();
        var tabLink = component.getLink();
        var loc = component.getCriterion().static_content;
        var tglCode = (!component.isAlwaysExpanded()) ? ["<span class='", style.getHeaderToggle(), "' title='", i18n.HIDE_SECTION, "'>-</span>"].join("") : "";

        if (!component.isExpanded() && !component.isAlwaysExpanded())
            secClass += " closed";

        if (component.isDisplayable()) {
            if (m_dispEMCompInd || component.getDisplay()) {
                secClass += " comp-display";
            }
            else {
                secClass += " comp-hide";
            }
        }

        var sAnchor = (tabLink != "" && component.getCustomizeView() == false) ? CreateComponentAnchor(component) : component.getLabel();
        ar.push("<div id='", style.getId(), "' class='", secClass, "'>", "<h2 class='", style.getHeaderClass(), "'>",
			tglCode, "<span class='", style.getTitle(), "'><span>",
			sAnchor, "</span>");
        if (component.getCustomizeView() == false) {
            ar.push("<span class='", style.getTotal(), "'>", i18n.LOADING_DATA + "...", "</span>");
            if (component.isPlusAddEnabled()) {
                ar.push("<a id='", ns, "Add' class=addPlus href=javascript:MP_Util.OpenTab('", compId, "');><img src='", loc, "\\images\\3941.gif'>", i18n.ADD, "</a>")
                var menuItems = component.getMenuItems();
                if (menuItems != null || menuItems > 0) {
                    var menuId = compId + "Menu";
                    ar.push("<a id='", ns, "Drop' class='drop-Down'><img src='", loc, "\\images\\3943_16.gif' onclick='javascript:MP_Util.LaunchMenu(\"", menuId, "\", \"", compId, "\");'></a>")
                    ar.push("<div class='form-menu menu-hide' id='", menuId, "'><span>")
                    for (var x = 0, xl = menuItems.length; x < xl; x++) {
                        var item = menuItems[x];
                        ar.push("<div>")
                        ar.push("<a id='lnkID", x, "' href='#' onclick='javascript:MP_Util.LaunchMenuSelection(\"", compId, '\",', item.getId(), ");'>", item.getDescription(), "</a>")
                        ar.push("</div>")
                    }

                    ar.push("</span></div>")
                }


            }
        }
        ar.push("</span></h2>")
        if (component.getCustomizeView() == false) {
            if (component.getScope() > 0)
                ar.push("<div class=sub-title-disp>", CreateSubTitleText(component), "</div>");
        }
        ar.push("<div id='", style.getContentId(), "' class='", style.getContentClass(), "'></div></div>")
        var arHtml = ar.join("");
        return arHtml;
    }

    function CreateSubTitleText(component) {
        var subTitleText = "";
        var scope = component.getScope();
        var lookbackDays = component.getLookbackDays();
        var lookbackUnits = (lookbackDays > 0) ? lookbackDays : component.getLookbackUnits();
        var lookbackFlag = (lookbackDays > 0) ? 2 : component.getLookbackUnitTypeFlag();

        if (scope > 0) {
            if (lookbackFlag > 0 && lookbackUnits > 0) {
                var replaceText = "";
                switch (lookbackFlag) {
                    case 1: replaceText = i18n.LAST_N_HOURS.replace("{0}", lookbackUnits); break;
                    case 2: replaceText = i18n.LAST_N_DAYS.replace("{0}", lookbackUnits); break;
                    case 3: replaceText = i18n.LAST_N_WEEKS.replace("{0}", lookbackUnits); break;
                    case 4: replaceText = i18n.LAST_N_MONTHS.replace("{0}", lookbackUnits); break;
                    case 5: replaceText = i18n.LAST_N_YEARS.replace("{0}", lookbackUnits); break;
                }

                switch (scope) {
                    case 1: subTitleText = i18n.ALL_N_VISITS.replace("{0}", replaceText); break;
                    case 2: subTitleText = i18n.SELECTED_N_VISIT.replace("{0}", replaceText); break;
                }

            }
            else {
                switch (scope) {
                    case 1: subTitleText = i18n.All_VISITS; break;
                    case 2: subTitleText = i18n.SELECTED_VISIT; break;
                }
            }
        }
        return subTitleText;
    }

    function CreateComponentAnchor(component) {
        var style = component.getStyles();
        var criterion = component.getCriterion();
        var sParms = 'javascript:APPLINK(0,"' + criterion.executable + '","/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + component.getLink() + '^")';
        var sAnchor = "<a id=" + style.getLink() + " title='" + i18n.GO_TO_TAB.replace("{0}", component.getLink()) + "' href='" + sParms + "'>" + component.getLabel() + "</a>";
        return sAnchor;
    }
    function AddPageTabs(items, bodyTag) {
        var ar = [];
        var divAr = [];
        if (bodyTag == null)
            bodyTag = document.body;
        //first create unordered list for page level tabs
        ar.push("<ul class=tabmenu>")
        for (var x = 0, xl = items.length; x < xl; x++) {
            var item = items[x];
            var activeInd = (x == 0) ? 1 : 0;
            ar.push(CreateTabLi(item, activeInd, x))
            divAr.push("<div id='", item.key, "' class='div-tab-item'></div>");
        }
        ar.push("</ul>")
        bodyTag.innerHTML += (ar.join("") + divAr.join(""));
    }
    function CreateTabLi(item, activeInd, sequence) {
        var ar = [];
        var tabName = "";
        tabName = item.name;
        ar.push("<li>")
        var seqClass = "a-tab" + sequence;
        if (activeInd)
            ar.push("<a id='", seqClass, "' class='anchor-tab-item active' href='javascript:MP_Util.DisplaySelectedTab(\"", item.key, "\",\"", seqClass, "\");'>", tabName, "</a>");
        else
            ar.push("<a id='", seqClass, "' class='anchor-tab-item inactive' href='javascript:MP_Util.DisplaySelectedTab(\"", item.key, "\",\"", seqClass, "\");'>", tabName, "</a>");
        ar.push("</li>")
        return (ar.join(""));
    }
}();


MP_Util.Measurement = function () {
    return {
        GetString: function (result, codeArray, dateMask) {
            var obj = MP_Util.Measurement.GetObject(result, codeArray);
            if (obj instanceof MP_Core.QuantityValue)
                return obj.toString();
            else if (obj instanceof Date)
                return obj.format(dateMask);
            else
                return obj;
        },
        GetObject: function (result, codeArray) {
            switch (result.CLASSIFICATION.toUpperCase()) {
                case "QUANTITY_VALUE":
                    return GetQuantityValue(result, codeArray);
                case "STRING_VALUE":
                    return (GetStringValue(result));
                case "DATE_VALUE": //we are curently not returning any date_value results. a common method shall be implemented if/when necessary
                    return (GetDateValue(result));
                case "CODE_VALUE":
                    return (GetCodedResult(result));
                case "ENCAPSULATED_VALUE":
                    return (GetEncapsulatedValue(result));
            }
        },
        SetPrecision: function (num, dec) {
            return num.toFixed(dec);
        }
    };
    function GetEncapsulatedValue(result) {
        var encap = result.ENCAPSULATED_VALUE;
        var ar = [];
        for (var n = 0, nl = encap.length; n < nl; n++) {
            var txt = encap[n].TEXT_PLAIN;
            if (txt != null && txt.length > 0)
                ar.push(txt);
        }
        return ar.join("");
    }
    function GetQuantityValue(result, codeArray) {
        var qv = new MP_Core.QuantityValue();
        qv.init(result, codeArray);
        return qv;
    }
    function GetDateValue(result) {
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
    function GetCodedResult(result) {
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
    function GetStringValue(result) {
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
document.getElementsByClassName = function (cl, e) {
    var retnode = [];
    var clssnm = new RegExp('\\b' + cl + '\\b');
    var elem = this.getElementsByTagName('*', e);
    for (var u = 0; u < elem.length; u++) {
        var classes = elem[u].className;
        if (clssnm.test(classes)) retnode.push(elem[u]);
    }
    return retnode;
};

//global variables
var js_blob = "";
var selectedRadiobutton = "pated";
var iframeViewer = null;
var hiddenIframeDoc = "";
var images = [];
var numImages = 0;
var invalidContent = 0;
var defaultURL = "";
var defaultUN = "";
var defaultPW = "";
var instructionKey = "";
var blobIn = "";
var baseUserName = "";
var basePassword = "";
var m_currenturl = "";
var m_ibtype = "";
var m_debug_ind = 0;
var wndDebugInfo = "";
var wndDebugSettings = "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=800, height=800";

function RenderPage()
{
    var js_criterion = JSON.parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);

    var mPage = new MPage();
    mPage.setCriterion(criterion);

    var ccInfo = new WizardComponent();
    mPage.addComponent(ccInfo);

    MP_Util.Doc.InitLayout(mPage);
    mPage.components[0].GetWizard();

    document.onkeydown = keydown;
    function keydown(evt)
    {
        if (!evt)
            evt = event;
        if (evt.shiftKey && evt.ctrlKey && evt.altKey && evt.keyCode == 68)
        {
            if (m_debug_ind == 0)
            {
                m_debug_ind = 1;
                alert("Debug ON");
                var wndDebugInfo = "Render Page:" + "\n" + "--CURRENT URL: " + m_currenturl + "\n\n" + "--IBTYPE:" + m_ibtype + "\n\n" + "--Username:" + baseUserName
                + "\n\n" + "--Password:" + basePassword;
                var wndDebug = window.open('', '', wndDebugSettings);
                wndDebug.document.title = "InfoButton Navigation Page";
                wndDebug.document.body.innerText = wndDebugInfo;
                wndDebug.focus();
            }
            else
            {
                m_debug_ind = 0;
                alert("Debug OFF");
            }
        }
    }
}

function WizardComponent()
{
    WizardComponent.method("GetWizard", function ()
    {
        RenderWizard();
    });
}

function RenderWizard()
{
    try
    {
        m_blob = m_blob.replace(/&#39;/g, "\'");
        js_blob = JSON.parse(m_blob);

        SetRadioButton();

        document.documentElement.style.overflow = 'hidden';
        document.body.scroll = "no";

        var sHTML = "", jsHTML = [];
        jsHTML.push("<div id='sampleWizard'>");
        jsHTML.push("<div class='jqw-radiobutton'>");
        jsHTML.push("<input type='radio' style='margin-left:7px; margin-top:15px' name='radio' value='cds' id='cds' onclick='OnClickCDS()'" + SetSelection("cds") + ">" + i18n.CDS + "<br><br>" +
                    "<input type='radio' style='margin-left:7px' name='radio' value='pated' id='pated' onclick='OnClickPated()'" + SetSelection("pated") + ">" + i18n.PATED + "<br></div>");

        var html = AddURLS();
        jsHTML.push("<div class='jqw-iframepanel' id='iframepanel'></div><iframe id='tempPanel' style='visibility:hidden;display:none'></iframe>");
        jsHTML.push(html);
        jsHTML.push("</div>");
        sHTML = jsHTML.join("");
        $("#disclaimer").after(sHTML);
        SetContent(defaultURL, 1, defaultUN, defaultPW);
    }
    catch (err)
    {
        throw (err);
    }
}

function SetRadioButton()
{
    for (var i = 0; i < js_blob.INFOBUTTON_URLS.length; i++)
    {
        if (js_blob.INFOBUTTON_URLS[i].IB_TYPE === 2)
        {
            selectedRadiobutton = "cds";
            i = js_blob.INFOBUTTON_URLS.length;
        }
    }
}

function SetSelection(value)
{
    if (selectedRadiobutton === value)
        return "checked";
}

function AddURLS()
{
    var options = document.getElementsByName('radio');
    for (var i = 0; i < options.length; i++)
    {
        if (options[i].checked === true)
            selectedRadiobutton = options[i].value;
    }

    var sHTML = "", NavigateHTML = [];
    if (selectedRadiobutton === "cds")
    {
        m_ibtype = "Clinical Decision Support";
        defaultURL = "", defaultUN = "", defaultPW = "", m_currenturl = "";
        var setDefault = 0;
        NavigateHTML.push("<div class='jqw-navigator' id='nav'>");

        for (var i = 0; i < js_blob.INFOBUTTON_URLS.length; i++)
        {
            if (js_blob.INFOBUTTON_URLS[i].IB_TYPE === 2)
            {
                var BaseUrl = "<p><b>" + js_blob.INFOBUTTON_URLS[i].NAME + "</b><br></p>";
                var subtopicname = "";
                for (var j = 0; j < js_blob.INFOBUTTON_URLS[i].SUBTOPIC.length; j++)
                {
                    if (j === 0)
                    {
                        if (js_blob.INFOBUTTON_URLS[i].DEFAULT_IND === 1)
                        {
                            defaultURL = js_blob.INFOBUTTON_URLS[i].SUBTOPIC[j].URL;
                            defaultUN = js_blob.INFOBUTTON_URLS[i].AUTHNAME;
                            defaultPW = js_blob.INFOBUTTON_URLS[i].CERTIFICATIONTEXT;
                            setDefault = 1;
                        }

                        if (setDefault === 0)
                        {
                            defaultURL = js_blob.INFOBUTTON_URLS[i].SUBTOPIC[j].URL;
                            defaultUN = js_blob.INFOBUTTON_URLS[i].AUTHNAME;
                            defaultPW = js_blob.INFOBUTTON_URLS[i].CERTIFICATIONTEXT;
                            setDefault = 1;
                        }
                    }
                    var subtopic = '<a id = "onclickurl" style="margin-left:14px;" href="' + js_blob.INFOBUTTON_URLS[i].SUBTOPIC[j].URL + '"' +
                                   'onclick="SetContent(\'' + js_blob.INFOBUTTON_URLS[i].SUBTOPIC[j].URL + '\',\'1\',\'' + js_blob.INFOBUTTON_URLS[i].AUTHNAME + '\',\'' +
                                   js_blob.INFOBUTTON_URLS[i].CERTIFICATIONTEXT + '\', this); return false;">' + js_blob.INFOBUTTON_URLS[i].SUBTOPIC[j].NAME + "</a><br>";
                    subtopicname = subtopicname + subtopic;
                }
                subtopicname = subtopicname + "<br>";
                NavigateHTML.push(BaseUrl + subtopicname);
            }
        }
        NavigateHTML.push("</div>");
        sHTML = NavigateHTML.join("");
    }

    if (selectedRadiobutton === "pated")
    {
        m_ibtype = "Patient Education";
        defaultURL = "", defaultUN = "", defaultPW = "", m_currenturl = "";
        var setDefault = 0;
        NavigateHTML.push("<div class='jqw-navigator' id='nav'>");
        for (var i = 0; i < js_blob.INFOBUTTON_URLS.length; i++)
        {
            if (js_blob.INFOBUTTON_URLS[i].IB_TYPE === 1)
            {
                var BaseUrl = "<p><b>" + js_blob.INFOBUTTON_URLS[i].NAME + "</b><br></p>";
                var subtopicname = "";
                for (var j = 0; j < js_blob.INFOBUTTON_URLS[i].SUBTOPIC.length; j++)
                {
                    if (j === 0)
                    {
                        if (js_blob.INFOBUTTON_URLS[i].DEFAULT_IND === 1)
                        {
                            defaultURL = js_blob.INFOBUTTON_URLS[i].SUBTOPIC[j].URL;
                            defaultUN = js_blob.INFOBUTTON_URLS[i].AUTHNAME;
                            defaultPW = js_blob.INFOBUTTON_URLS[i].CERTIFICATIONTEXT;
                            setDefault = 1;
                        }

                        if (setDefault === 0)
                        {
                            defaultURL = js_blob.INFOBUTTON_URLS[i].SUBTOPIC[j].URL;
                            defaultUN = js_blob.INFOBUTTON_URLS[i].AUTHNAME;
                            defaultPW = js_blob.INFOBUTTON_URLS[i].CERTIFICATIONTEXT;
                            setDefault = 1;
                        }
                    }
                    var subtopic = '<a id = "onclickurl" style="margin-left:14px;" href="' + js_blob.INFOBUTTON_URLS[i].SUBTOPIC[j].URL + '"' +
                                   'onclick="SetContent(\'' + js_blob.INFOBUTTON_URLS[i].SUBTOPIC[j].URL + '\',\'1\',\'' + js_blob.INFOBUTTON_URLS[i].AUTHNAME + '\',\'' +
                                   js_blob.INFOBUTTON_URLS[i].CERTIFICATIONTEXT + '\', this); return false;">' + js_blob.INFOBUTTON_URLS[i].SUBTOPIC[j].NAME + "</a><br>";
                    subtopicname = subtopicname + subtopic;
                }
                subtopicname = subtopicname + "<br>";
                NavigateHTML.push(BaseUrl + subtopicname);
            }
        }
        NavigateHTML.push("</div>");
        NavigateHTML.push("<div class='jqw-buttons'> <button class='jqw-print' id = 'print' onclick='PrintContent()'><span>" + i18n.PRINT + "</span></button> " +
                         "<button class='jqw-saveprint' id = 'saveprint' onclick='SavePrintContent()'><span>" + i18n.SAVE_PRINT + "</span></button>" +
                         "<button class='jqw-savetopated' id = 'savetopated' onclick='SaveContent()'><span>" + i18n.SAVE_TO_PATED + "</span></button>" +
                         "</div>");
       
        sHTML = NavigateHTML.join("");
    }
    return sHTML;
}

function GetSelectedOption()
{
    var options = document.getElementsByName('radio');
    for (var i = 0; i < options.length; i++)
    {
        if (options[i].checked === true)
            return options[i].value;
    }
}

function SetSelectedOption(value)
{
    var options = document.getElementsByName('radio');
    for (var i = 0; i < options.length; i++)
    {
        if (options[i].value === value)
	{
            options[i].checked = true;
            var html = AddURLS();
            document.getElementById('nav').innerHTML = html;
        }
    }
}

function SetContent(url, linkId, username, password, currenturl)
{
    var selectedValue = GetSelectedOption();
    var timerMPage = MP_Util.CreateTimer("CAP:Infobutton Navigation Page – Interaction", "Interaction", selectedValue, url);
    try
    {
        if (url === "")
        {
            if (iframeViewer)
            {
                iframeViewer = document.getElementById("contentPanel");
                iframeViewer.src = "";
            }
            return;
        }
        m_currenturl = url;
        var urlTag = document.getElementById("nav");
        var anchorTag = urlTag.getElementsByTagName("a");
        var decodeBaseurl = decodeURIComponent(url);
        var decodeBaseurlUpper = decodeBaseurl.toUpperCase();
        var responseType = ((decodeBaseurlUpper.search('KNOWLEDGERESPONSETYPE=TEXT/XML') > 0) || (decodeBaseurlUpper.search('RESPONSEFORMAT=ATOM_XML') > 0));

        if (!responseType)
        {
            blobIn = "";
            instructionKey = "";
            if (iframeViewer)
            {
                iframeViewer = document.getElementById("contentPanel");
                iframeViewer.src = "";
            }
            for (var i = 0; i < anchorTag.length; i++)
            {
                anchorTag[i].style.backgroundColor = "#EDEDED";;
                anchorTag[i].style.color = "black";
            }
            window.open(url);
            return;
        }
        var hiddenIframe = document.getElementById("tempPanel");
        hiddenIframeDoc = hiddenIframe.contentWindow.document;

        baseUserName = username;
        basePassword = password;
        instructionKey = url;

        for (var i = 0; i < anchorTag.length; i++)
        {
            if ((anchorTag[i] == defaultURL) || (anchorTag[i] == currenturl))
            {
                anchorTag[i].style.backgroundColor = "blue";
                anchorTag[i].style.color = "white";
                defaultURL = "";
            }
            else
            {
                anchorTag[i].style.backgroundColor = "#EDEDED";;
                anchorTag[i].style.color = "black";
            }
        }

        var res = url.slice(0, 5);
        if (res !== 'https')
            url = url.replace("http", "https");

        LoadContentIE(url, linkId, username, password);
        if (decodeBaseurlUpper.search("MEDLINEPLUS") > -1)
            RemoveLinksFromIFrame();
        if (decodeBaseurlUpper.search("HEALTHWISE") > -1)
            RemoveLongLinks();

        CopyToIframeViewer(linkId);
    }
    catch (err)
    {
        if (timerMPage)
        {
            timerMPage.Abort();
            timerMPage = null;
        }
        throw (err);
    }
    finally
    {
        if (timerMPage)
            timerMPage.Stop();
    }
}

function LoadContentIE(url, linkId, username, password)
{
    try
    {
        var reqSynch = new XMLHttpRequest();
        if (reqSynch)
        {
            if (typeof username == 'undefined' || username == "")
                reqSynch.open("GET", url, false);
            else
                reqSynch.open("GET", url, false, username, password);

            reqSynch.setRequestHeader('Content-Type', 'text/plain');
            reqSynch.send();

            if (reqSynch.readyState === 4 && reqSynch.status === 200)
            {
                var responseText = reqSynch.responseText;
                var responseXml = reqSynch.responseXML;
                var contentText = responseText;

                if (IsXml(responseText) === 1)
                {
                    //replace illegal workspaces
                    var posXML = responseText.indexOf("xmlns:xsi=\"http://www.w3.org/2005/Atom\"");
                    if (posXML > 0)
                    {
                        var replaceXML = responseText.replace("xmlns:xsi=\"http://www.w3.org/2005/Atom\"", "xmlns=\"http://www.w3.org/2005/Atom\"");
                        responseText = replaceXML;
                    }
                    //transform to html 
                    contentText = TransformContentIE(responseText);
                }
                DisplayContent(contentText, linkId);
            }
            else
            {
                alert(i18n.INVALIDCONTENT);
                if (linkId === 99)
                    invalidContent = 1;
            }
        }
        else
            throw i18n.HTTPREQUEST;
    }
    catch (err)
    {
        throw (err);
    }
}

//This function gets called by the iframe when a link is clicked.
//The xsl file (currently atom.xsl) adds an onclick to the link back to this function.
//**IE ONLY: Once this function completes, the onclick proceeds in the iframe and that causes
//an onload event in the mainwindow.**
function GetIFrameLink(url, username, password)
{
    if (url != "")
    {
        var selectedURL = url.replace(/amp;/g, '');
	LoadInternalLink(selectedURL);
    }
    return;
}

function LoadInternalLink(url)
{
    if (m_debug_ind == 1)
    {
        var wndDebugInfo = "Render Page:" + "\n\n" + "--CURRENT URL: " + url + "\n\n" + "--IBTYPE:" + m_ibtype;
        var wndDebug = window.open('', '', wndDebugSettings);
        wndDebug.document.title = "InfoButton Navigation Page";
        wndDebug.document.body.innerText = wndDebugInfo;
        wndDebug.focus();
    }

    var res = url.slice(0, 5);
    if (res !== 'https')
        url = url.replace("http", "https");

    if (url.search("medlineplus") > -1)
    {
        window.open(url);
        return;
    }
    LoadURLFromCookie(url);
}

function LoadURLFromCookie(url)
{
    instructionKey = url;
    invalidContent = 0;
    LoadContentIE(url, 99, baseUserName, basePassword);
    if (invalidContent === 0)
    {
        RemoveScripts();

        hiddenIframeDoc.onreadystatechange = HiddenIframeReady;
        if (hiddenIframeDoc.readyState == 'complete')
        {
            ProcessImages(url);
            CopyToIframeViewer(99);
        }
    }
}

function HiddenIframeReady()
{
    if (hiddenIframeDoc.readyState == 'complete')
    {
        ProcessImages(instructionKey);
        CopyToIframeViewer(99);
    }
}

function RemoveScripts()
{
    var scriptTag = hiddenIframeDoc.getElementsByTagName("script");
    for (var i = (scriptTag.length - 1) ; i >= 0; i--)
    {
        scriptTag[i].parentNode.removeChild(scriptTag[i]);
    }
}

function RemoveLinksFromIFrame()
{
    var anchorTag = hiddenIframeDoc.getElementsByTagName("A");
    for (var i = (anchorTag.length - 1) ; i >= 0; i--)
    {
        var span = hiddenIframeDoc.createElement("SPAN");
        if (anchorTag[i].className)
            span.className = anchorTag[i].className;

        if (!anchorTag[i].id)
        {
            anchorTag[i].id = "id" + Math.random().toString(16).slice(2);
            span.id = anchorTag[i].id;
        }
        else
            span.id = anchorTag[i].id;

        span.innerHTML = anchorTag[i].innerHTML;
        anchorTag[i].parentNode.replaceChild(span, anchorTag[i]);
    }
}

function RemoveOnEvents(content)
{
    var sReturn = content.replace('onUnload=\"onClose(1);\"', '');
    return sReturn;
}

function CopyToIframeViewer(linkId)
{
    //remove links in iframe before pulling it out
    if (linkId === 99)
        RemoveLinksFromIFrame();

    RemoveScripts();
    var html = GetIFrameHTML();
    blobIn = html;

    var iframeelement = document.createElement("iframe");
    iframeelement.setAttribute("id", "contentPanel");
    iframeelement.setAttribute("height", "100%");
    iframeelement.setAttribute("width", "100%");
    document.getElementById("iframepanel").appendChild(iframeelement);

    iframeViewer = document.getElementById("contentPanel");
    var iframeViewerDoc = iframeViewer.contentWindow.document;

    iframeViewerDoc.open('text/html', 'replace');
    iframeViewerDoc.write(html);
    iframeViewerDoc.close();
}

//find each img in the DOM can try to build the src attribute so we can load them
function ProcessImages(url)
{
    var imgTag = hiddenIframeDoc.getElementsByTagName("IMG");
    var imageSrcs = [];
    for (var i = 0; i < imgTag.length; i++)
    {
        var src = imgTag[i].getAttribute("src");
        var newsrc = "";
        var temp = url;
        var lastIdx = 0;
        if (src.length > 0)
        {
            var test = src.search('/');
            //no url in src, just image
            if (test === -1)
            {
                lastIdx = temp.lastIndexOf('/');
                if (lastIdx > 0)
                {
                    temp = temp.substring(0, lastIdx);
                    newsrc = temp + '/' + src;
                    imageSrcs[i] = newsrc;
                }
            }
            else
            {
                test = src.search('http');
                if (test !== -1)
                {
                    //we have a web site, check for images types
                    test = src.search(/.png|.gif|.jpg/);
                    if (test !== -1)
                        imageSrcs[i] = src;
                }
                else
                {
                    //probably have a relative path.  try appending base url to it
                    test = temp.search(".com");
                    if (test > -1)
                    {
                        temp = temp.substring(0, (test + 4));
                        newsrc = temp + src;
                        imageSrcs[i] = newsrc;
                    }
                }
            }
        }
        numImages = imageSrcs.length;
    }
    images = [];
    for (var i = 0; i < imageSrcs.length; i++)
    {
        //convert image to 64bit and embed
        ConvertFileToBase64viaFileReader(imageSrcs[i]);
    }
}

//images take time to load and convert to inline
//when images are done loading
//function set in convertFileToBase64viaFileReader
function LoadImage(result)
{
    var imageLength = images.length;
    images[imageLength] = result;

    EmbedImages();
    CopyToIframeViewer(99);
}

//add images to the DOM
function EmbedImages()
{
    var imgTag = hiddenIframeDoc.getElementsByTagName("IMG");
    for (var i = 0; i < imgTag.length; i++)
    {
        imgTag[i].setAttribute("src", images[i]);
        imgTag[i].parentNode.replaceChild(imgTag[i], imgTag[i]);
    }
}

//convert to base64 to that images can be embedded in html
function ConvertFileToBase64viaFileReader(src)
{
    try
    {
        var xhrRequest = new XMLHttpRequest();
        if (xhrRequest)
        {
            xhrRequest.open("GET", src, false);
            xhrRequest.responseType = "blob";
            xhrRequest.send();

            var recursiveCheck = function ()
            {
                var reader = new FileReader();
                reader.readAsDataURL(xhrRequest.response);
                reader.onloadend = function ()
                {
                    LoadImage(reader.result);
                    return;
                };
            }
            recursiveCheck();
        }
        else
            throw i18n.HTTPREQUEST;
    }
    catch(err)
    {
        throw (err);
    }
}

function GetIFrameHTML()
{
    var hiddenContent = hiddenIframeDoc.body.innerHTML;
    var validateContent = RemoveNewlines(hiddenContent);
    validateContent = RemoveSpecialChars(validateContent);
    validateContent = EncapsulateHTML(validateContent);
    return validateContent;
}

function RemoveNewlines(str)
{
    //remove line breaks from str
    str = str.replace(/\s{2,}/g, ' ');
    str = str.replace(/\t/g, ' ');
    str = str.replace(/^\s+|\s+$/g, '');
    str = str.replace(/(\r\n|\n|\r)/g, "");
    return str;
}

function RemoveSpecialChars(content)
{
    //content = content.replace(/[\u00A0]/g, " ");       //handle all whitespace
    content = content.replace(/[\u00C2]/g, " ");         //handle A
    content = content.replace(/[\u00A0]/g, " ");         //handle no break space
    content = content.replace(/[\u2019]/g, "'");         //handle all apostrophe
    content = content.replace(/[\u201C\u201D]/g, "\"");  //handle left and right double quote
    content = content.replace(/[\u25CF\u2022]/g, '-');   //handle bullet and wide dash
    content = content.replace(/[\u2013\u2014]/g, "-");
    content = content.replace(/ns1:/gi, '');             //remove namespaces
    content = content.replace(/ns0:/gi, '');             //remove namespaces

    return content;
}

//add very simple header information and wrap innerHtml in body
function EncapsulateHTML(contentIn)
{
    var beginHtml = "<!DOCTYPE html> <head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />";
    beginHtml = beginHtml + "</head><body style=\"font-family:Arial;font-size:11pt\">";
    contentIn = beginHtml + contentIn;
    contentIn = contentIn + "</body></html>";
    return contentIn;
}

function RemoveLongLinks()
{
    //for HealthWise WebService
    var anchorTag = hiddenIframeDoc.getElementsByTagName("A");
    for (var i = (anchorTag.length - 1) ; i >= 0; i--)
    {
        var html = anchorTag[i].innerHTML;
        var htmlToUppercase = html.toUpperCase();
        var lang = "";
        var hidden = 0;

        var index = htmlToUppercase.search("EN-US"); //find the language
        if (index > -1)
            lang = " (English)";
        else
        {
            index = htmlToUppercase.search("ES-US"); //find the language
            if (index > -1)
                lang = " (Spanish)";
        }
        index = html.search("\\?"); //find query params
        if (index > -1)
	{
            var atom = html.search("atom");
            if (atom === -1)
	    {
                anchorTag[i].parentNode.removeChild(anchorTag[i]);
                hidden = 1;
            }
            else
            {
                var htmlSubstring = html.substring(0, index) + lang;
                anchorTag[i].innerHTML = htmlSubstring;
            }
        }
        if (hidden === 0)
            anchorTag[i].parentNode.replaceChild(anchorTag[i], anchorTag[i]);
        else
            hidden = 0;
    }
}

function DisplayContent(contentIn, linkId)
{
    if (linkId === 99)
        contentIn = RemoveOnEvents(contentIn);

    hiddenIframeDoc.open('text/html', 'replace');
    hiddenIframeDoc.write(contentIn);
    hiddenIframeDoc.close();
    RemoveScripts();
}

function TransformContentIE(xmlResponseIn)
{
    try
    {
        if (IsXml(xmlResponseIn) === 0)
            return xmlResponseIn;

        var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.6.0");
        if (xmlDoc)
        {
            xmlDoc.async = false;
            xmlDoc.setProperty("ProhibitDTD", false);
            xmlDoc.loadXML(xmlResponseIn);

            if (xmlDoc.parseError.errorCode !== 0)
	    {
		var myErr = xmlDoc.parseError;
                alert("You have error " + myErr.reason);
	        return "";
	    }
        }
        else
            throw i18n.INVALIDOBJECT;

        // Load style sheet.
        var stylesheet = new ActiveXObject("Msxml2.DOMDocument.6.0");
        if (stylesheet)
        {
            stylesheet.async = false;
            stylesheet.setProperty("ProhibitDTD", false);
            var atomPath = "\\atom.xsl";
            var filePath = js_blob.XSLFILELOC;
            filePath = filePath.replace(/\/\//g, "\\\\");
            filePath = filePath.replace(/\//g, "\\");
            var XslFileLoc = filePath + atomPath;
            stylesheet.load(XslFileLoc);
            if (stylesheet.parseError.errorCode !== 0)
            {
                var myErr = stylesheet.parseError;
                alert("You have error " + myErr.reason);
                return "";
            }
            // Parse results into a result DOM Document.
            var stringHtml = xmlDoc.transformNode(stylesheet);
            return stringHtml;
        }
        else
            throw i18n.INVALIDOBJECT;
    }
    catch (err)
    {
        throw (err);
    }
}

function IsXml(stringin)
{
    if (typeof stringin == 'undefined' || stringin == "")
        return 0;

    var sliceStringToUpper = stringin.toUpperCase();
    var pos = sliceStringToUpper.indexOf("<!DOCTYPE HTML");

    var isXml = (pos > -1) ? 0 : 1;
    return isXml;
}

function OnClickPated()
{
    SetSelectedOption('pated');
    SetContent(defaultURL, 1, defaultUN, defaultPW);
}

function OnClickCDS()
{
    document.getElementById('print').style.visibility = 'hidden';
    document.getElementById('saveprint').style.visibility = 'hidden';
    document.getElementById('savetopated').style.visibility = 'hidden';

    SetSelectedOption('cds');
    SetContent(defaultURL, 1, defaultUN, defaultPW);
}

function PrintContent()
{
    var timerMPage = MP_Util.CreateTimer("CAP:Infobutton Navigation Page – Print", "Print", "PatEd", instructionKey);
    if (timerMPage)
        timerMPage.Stop();

    var iframeWin = document.getElementById("contentPanel").contentWindow;
    if (document.queryCommandSupported('print'))
    {
        iframeWin.document.execCommand('print', false, null);
    }
    else
    {
        iframeWin.focus();
        iframeWin.print();
    }
}

function SavePrintContent()
{
    var timerMPage = MP_Util.CreateTimer("CAP:Infobutton Navigation Page – Save and Print", "Save and Print", "PatEd", instructionKey);
    if (timerMPage)
        timerMPage.Stop();

    var blobToUpper = blobIn.toUpperCase();
    var titleStart = blobToUpper.indexOf("<H4>");
    var titleEnd = -1;
    var titleName = "";
    if (titleStart === -1)
    {
        titleStart = blobToUpper.indexOf("<H1>");
        titleEnd = blobToUpper.indexOf("</H1>");
    }
    else
    {
        titleEnd = blobToUpper.indexOf("</H4>");
    }
    if (titleStart !== -1)
        titleName = blobToUpper.substring((titleStart + 4), titleEnd);
    else
        titleName = "Infobutton Education";

    var keyDocIdent = instructionKey.slice(0, 50);
    var keyLength = instructionKey.length;
    if (keyLength > 100)
    {
        var lastFifty = instructionKey.substr(keyLength - 50);
        keyDocIdent = keyDocIdent + lastFifty;
    }

    var js_criterion = JSON.parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);

    var dPersonId = criterion.person_id;
    var dEncntrId = criterion.encntr_id;

    var sendAr = [];
    sendAr.push("^MINE^", dPersonId + ".0", dEncntrId + ".0", "^" + titleName + "^", "2.0", "^" + keyDocIdent + "^");

    if (m_debug_ind == 1)
    {
        var wndDebugInfo = "Render Page:" + "\n\n" + "--CURRENT URL: " + instructionKey + "\n\n" + "--IBTYPE:" + m_ibtype
                            + "\n\n" + "--SCRIPT PARAMETERS: " + sendAr + "\n\n" + "--BLOB: " + blobIn;
        var wndDebug = window.open('', '', wndDebugSettings);
        wndDebug.document.title = "InfoButton Navigation Page";
        wndDebug.document.body.innerText = wndDebugInfo;
        wndDebug.focus();
    }

    var requestAsync = new XMLCclRequest();
    requestAsync.open("GET", "fnmp_ib_save_pated:dba", true);
    requestAsync.onreadystatechange = function ()
    {
        if (requestAsync.readyState === 4 && requestAsync.status === 200)
	{
            var jsonEval = JSON.parse(requestAsync.responseText);
            if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "S")
	    {
                var pObject = window.external.DiscernObjectFactory("PATIENTEDUCATION");
                pObject.SignCoverPage(dPersonId, dEncntrId);
                alert(i18n.DOCSAVED);
            }
            else
                alert(i18n.DOCNOTSAVED);
        }
        else
            alert(i18n.SCRIPTERROR);
    };
    requestAsync.setBlobIn(blobIn);
    requestAsync.send(sendAr.join(","));

    PrintContent();
}

function SaveContent()
{
    var timerMPage = MP_Util.CreateTimer("CAP:Infobutton Navigation Page – Save", "Save", "Pated", instructionKey);
    if (timerMPage)
        timerMPage.Stop();

    var blobToUpper = blobIn.toUpperCase();
    var titleStart = blobToUpper.indexOf("<H4>");
    var titleEnd = -1;
    var titleName = "";
    if (titleStart === -1)
    {
        titleStart = blobToUpper.indexOf("<H1>");
        titleEnd = blobToUpper.indexOf("</H1>");
    }
    else
    {
        titleEnd = blobToUpper.indexOf("</H4>");
    }
    if (titleStart !== -1)
        titleName = blobToUpper.substring((titleStart + 4), titleEnd);
    else
        titleName = "Infobutton Education";

    var keyDocIdent = instructionKey.slice(0, 50);
    var keyLength = instructionKey.length;
    if (keyLength > 100)
    {
        var lastFifty = instructionKey.substr(keyLength - 50);
        keyDocIdent = keyDocIdent + lastFifty;
    }
    var js_criterion = JSON.parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);

    var dPersonId = criterion.person_id;
    var dEncntrId = criterion.encntr_id;

    var sendAr = [];
    sendAr.push("^MINE^", dPersonId + ".0", dEncntrId + ".0", "^" + titleName + "^", "2.0", "^" + keyDocIdent + "^");

    if (m_debug_ind == 1)
    {
        var wndDebugInfo = "Render Page:" + "\n\n" + "--CURRENT URL: " + instructionKey + "\n\n" + "--IBTYPE:" + m_ibtype
                            + "\n\n" + "--SCRIPT PARAMETERS: " + sendAr + "\n\n" + "--BLOB: " + blobIn;
        var wndDebug = window.open('', '', wndDebugSettings);
        wndDebug.document.title = "InfoButton Navigation Page";
        wndDebug.document.body.innerText = wndDebugInfo;
        wndDebug.focus();
    }

    var requestAsync = new XMLCclRequest();
    requestAsync.open("GET", "fnmp_ib_save_pated:dba", true);
    requestAsync.onreadystatechange = function ()
    {
        if (requestAsync.readyState === 4 && requestAsync.status === 200)
        {
            var jsonEval = JSON.parse(requestAsync.responseText);
            if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "S")
            {
                var pObject = window.external.DiscernObjectFactory("PATIENTEDUCATION");
                pObject.SignCoverPage(dPersonId, dEncntrId);
                alert(i18n.DOCSAVED);
            }
            else
                alert(i18n.DOCNOTSAVED);
        }
        else
            alert(i18n.SCRIPTERROR);
    };
    requestAsync.setBlobIn(blobIn);
    requestAsync.send(sendAr.join(","));
}
