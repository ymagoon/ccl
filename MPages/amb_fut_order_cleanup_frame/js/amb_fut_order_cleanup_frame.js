/*
 * Create a JSON object only if one does not already exist. We create the methods in a closure to avoid creating global variables.
 */
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(b){var a=this.length>>>0;var c=Number(arguments[1])||0;c=(c<0)?Math.ceil(c):Math.floor(c);if(c<0){c+=a}for(;c<a;c++){if(c in this&&this[c]===b){return c}}return -1}};  
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
	meta = { // table of character substitutions
		'\b' : '\\b',
		'\t' : '\\t',
		'\n' : '\\n',
		'\f' : '\\f',
		'\r' : '\\r',
		'"' : '\\"',
		'\\' : '\\\\'
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
		var i, // The loop counter.
		k, // The member key.
		v, // The member value.
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
			return str('', {
				'' : value
			});
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

				var k,
				v,
				value = holder[key];
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
				walk({
					'' : j
				}, '') : j;
			}

			// If the text is not JSON parseable, then a SyntaxError is thrown.

			throw new SyntaxError('JSON.parse');
		};
	}
}
	());

/*! jQuery v1.11.0 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function (a, b) {
	"object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function (a) {
		if (!a.document)
			throw new Error("jQuery requires a window with a document");
		return b(a)
	}
	 : b(a)
}
("undefined" != typeof window ? window : this, function (a, b) {
	var c = [],
	d = c.slice,
	e = c.concat,
	f = c.push,
	g = c.indexOf,
	h = {},
	i = h.toString,
	j = h.hasOwnProperty,
	k = "".trim,
	l = {},
	m = "1.11.0",
	n = function (a, b) {
		return new n.fn.init(a, b)
	},
	o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	p = /^-ms-/,
	q = /-([\da-z])/gi,
	r = function (a, b) {
		return b.toUpperCase()
	};
	n.fn = n.prototype = {
		jquery : m,
		constructor : n,
		selector : "",
		length : 0,
		toArray : function () {
			return d.call(this)
		},
		get : function (a) {
			return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this)
		},
		pushStack : function (a) {
			var b = n.merge(this.constructor(), a);
			return b.prevObject = this,
			b.context = this.context,
			b
		},
		each : function (a, b) {
			return n.each(this, a, b)
		},
		map : function (a) {
			return this.pushStack(n.map(this, function (b, c) {
					return a.call(b, c, b)
				}))
		},
		slice : function () {
			return this.pushStack(d.apply(this, arguments))
		},
		first : function () {
			return this.eq(0)
		},
		last : function () {
			return this.eq(-1)
		},
		eq : function (a) {
			var b = this.length,
			c = +a + (0 > a ? b : 0);
			return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
		},
		end : function () {
			return this.prevObject || this.constructor(null)
		},
		push : f,
		sort : c.sort,
		splice : c.splice
	},
	n.extend = n.fn.extend = function () {
		var a,
		b,
		c,
		d,
		e,
		f,
		g = arguments[0] || {},
		h = 1,
		i = arguments.length,
		j = !1;
		for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || n.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)
			if (null != (e = arguments[h]))
				for (d in e)
					a = g[d], c = e[d], g !== c && (j && c && (n.isPlainObject(c) || (b = n.isArray(c))) ? (b ? (b = !1, f = a && n.isArray(a) ? a : []) : f = a && n.isPlainObject(a) ? a : {}, g[d] = n.extend(j, f, c)) : void 0 !== c && (g[d] = c));
		return g
	},
	n.extend({
		expando : "jQuery" + (m + Math.random()).replace(/\D/g, ""),
		isReady : !0,
		error : function (a) {
			throw new Error(a)
		},
		noop : function () {},
		isFunction : function (a) {
			return "function" === n.type(a)
		},
		isArray : Array.isArray || function (a) {
			return "array" === n.type(a)
		},
		isWindow : function (a) {
			return null != a && a == a.window
		},
		isNumeric : function (a) {
			return a - parseFloat(a) >= 0
		},
		isEmptyObject : function (a) {
			var b;
			for (b in a)
				return !1;
			return !0
		},
		isPlainObject : function (a) {
			var b;
			if (!a || "object" !== n.type(a) || a.nodeType || n.isWindow(a))
				return !1;
			try {
				if (a.constructor && !j.call(a, "constructor") && !j.call(a.constructor.prototype, "isPrototypeOf"))
					return !1
			} catch (c) {
				return !1
			}
			if (l.ownLast)
				for (b in a)
					return j.call(a, b);
			for (b in a);
			return void 0 === b || j.call(a, b)
		},
		type : function (a) {
			return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a
		},
		globalEval : function (b) {
			b && n.trim(b) && (a.execScript || function (b) {
				a.eval.call(a, b)
			})(b)
		},
		camelCase : function (a) {
			return a.replace(p, "ms-").replace(q, r)
		},
		nodeName : function (a, b) {
			return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
		},
		each : function (a, b, c) {
			var d,
			e = 0,
			f = a.length,
			g = s(a);
			if (c) {
				if (g) {
					for (; f > e; e++)
						if (d = b.apply(a[e], c), d === !1)
							break
				} else
					for (e in a)
						if (d = b.apply(a[e], c), d === !1)
							break
			} else if (g) {
				for (; f > e; e++)
					if (d = b.call(a[e], e, a[e]), d === !1)
						break
			} else
				for (e in a)
					if (d = b.call(a[e], e, a[e]), d === !1)
						break;
			return a
		},
		trim : k && !k.call("\ufeff\xa0") ? function (a) {
			return null == a ? "" : k.call(a)
		}
		 : function (a) {
			return null == a ? "" : (a + "").replace(o, "")
		},
		makeArray : function (a, b) {
			var c = b || [];
			return null != a && (s(Object(a)) ? n.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)),
			c
		},
		inArray : function (a, b, c) {
			var d;
			if (b) {
				if (g)
					return g.call(b, a, c);
				for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
					if (c in b && b[c] === a)
						return c
			}
			return -1
		},
		merge : function (a, b) {
			var c = +b.length,
			d = 0,
			e = a.length;
			while (c > d)
				a[e++] = b[d++];
			if (c !== c)
				while (void 0 !== b[d])
					a[e++] = b[d++];
			return a.length = e,
			a
		},
		grep : function (a, b, c) {
			for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++)
				d = !b(a[f], f), d !== h && e.push(a[f]);
			return e
		},
		map : function (a, b, c) {
			var d,
			f = 0,
			g = a.length,
			h = s(a),
			i = [];
			if (h)
				for (; g > f; f++)
					d = b(a[f], f, c), null != d && i.push(d);
			else
				for (f in a)
					d = b(a[f], f, c), null != d && i.push(d);
			return e.apply([], i)
		},
		guid : 1,
		proxy : function (a, b) {
			var c,
			e,
			f;
			return "string" == typeof b && (f = a[b], b = a, a = f),
			n.isFunction(a) ? (c = d.call(arguments, 2), e = function () {
				return a.apply(b || this, c.concat(d.call(arguments)))
			}, e.guid = a.guid = a.guid || n.guid++, e) : void 0
		},
		now : function () {
			return +new Date
		},
		support : l
	}),
	n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) {
		h["[object " + b + "]"] = b.toLowerCase()
	});
	function s(a) {
		var b = a.length,
		c = n.type(a);
		return "function" === c || n.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
	}
	var t = function (a) {
		var b,
		c,
		d,
		e,
		f,
		g,
		h,
		i,
		j,
		k,
		l,
		m,
		n,
		o,
		p,
		q,
		r,
		s = "sizzle" + -new Date,
		t = a.document,
		u = 0,
		v = 0,
		w = eb(),
		x = eb(),
		y = eb(),
		z = function (a, b) {
			return a === b && (j = !0),
			0
		},
		A = "undefined",
		B = 1 << 31,
		C = {}

		.hasOwnProperty,
		D = [],
		E = D.pop,
		F = D.push,
		G = D.push,
		H = D.slice,
		I = D.indexOf || function (a) {
			for (var b = 0, c = this.length; c > b; b++)
				if (this[b] === a)
					return b;
			return -1
		},
		J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
		K = "[\\x20\\t\\r\\n\\f]",
		L = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
		M = L.replace("w", "w#"),
		N = "\\[" + K + "*(" + L + ")" + K + "*(?:([*^$|!~]?=)" + K + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + M + ")|)|)" + K + "*\\]",
		O = ":(" + L + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + N.replace(3, 8) + ")*)|.*)\\)|)",
		P = new RegExp("^" + K + "+|((?:^|[^\\\\])(?:\\\\.)*)" + K + "+$", "g"),
		Q = new RegExp("^" + K + "*," + K + "*"),
		R = new RegExp("^" + K + "*([>+~]|" + K + ")" + K + "*"),
		S = new RegExp("=" + K + "*([^\\]'\"]*?)" + K + "*\\]", "g"),
		T = new RegExp(O),
		U = new RegExp("^" + M + "$"),
		V = {
			ID : new RegExp("^#(" + L + ")"),
			CLASS : new RegExp("^\\.(" + L + ")"),
			TAG : new RegExp("^(" + L.replace("w", "w*") + ")"),
			ATTR : new RegExp("^" + N),
			PSEUDO : new RegExp("^" + O),
			CHILD : new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + K + "*(even|odd|(([+-]|)(\\d*)n|)" + K + "*(?:([+-]|)" + K + "*(\\d+)|))" + K + "*\\)|)", "i"),
			bool : new RegExp("^(?:" + J + ")$", "i"),
			needsContext : new RegExp("^" + K + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + K + "*((?:-\\d)?\\d*)" + K + "*\\)|)(?=[^-]|$)", "i")
		},
		W = /^(?:input|select|textarea|button)$/i,
		X = /^h\d$/i,
		Y = /^[^{]+\{\s*\[native \w/,
		Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
		$ = /[+~]/,
		_ = /'|\\/g,
		ab = new RegExp("\\\\([\\da-f]{1,6}" + K + "?|(" + K + ")|.)", "ig"),
		bb = function (a, b, c) {
			var d = "0x" + b - 65536;
			return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
		};
		try {
			G.apply(D = H.call(t.childNodes), t.childNodes),
			D[t.childNodes.length].nodeType
		} catch (cb) {
			G = {
				apply : D.length ? function (a, b) {
					F.apply(a, H.call(b))
				}
				 : function (a, b) {
					var c = a.length,
					d = 0;
					while (a[c++] = b[d++]);
					a.length = c - 1
				}
			}
		}
		function db(a, b, d, e) {
			var f,
			g,
			h,
			i,
			j,
			m,
			p,
			q,
			u,
			v;
			if ((b ? b.ownerDocument || b : t) !== l && k(b), b = b || l, d = d || [], !a || "string" != typeof a)
				return d;
			if (1 !== (i = b.nodeType) && 9 !== i)
				return [];
			if (n && !e) {
				if (f = Z.exec(a))
					if (h = f[1]) {
						if (9 === i) {
							if (g = b.getElementById(h), !g || !g.parentNode)
								return d;
							if (g.id === h)
								return d.push(g), d
						} else if (b.ownerDocument && (g = b.ownerDocument.getElementById(h)) && r(b, g) && g.id === h)
							return d.push(g), d
					} else {
						if (f[2])
							return G.apply(d, b.getElementsByTagName(a)), d;
						if ((h = f[3]) && c.getElementsByClassName && b.getElementsByClassName)
							return G.apply(d, b.getElementsByClassName(h)), d
					}
				if (c.qsa && (!o || !o.test(a))) {
					if (q = p = s, u = b, v = 9 === i && a, 1 === i && "object" !== b.nodeName.toLowerCase()) {
						m = ob(a),
						(p = b.getAttribute("id")) ? q = p.replace(_, "\\$&") : b.setAttribute("id", q),
						q = "[id='" + q + "'] ",
						j = m.length;
						while (j--)
							m[j] = q + pb(m[j]);
						u = $.test(a) && mb(b.parentNode) || b,
						v = m.join(",")
					}
					if (v)
						try {
							return G.apply(d, u.querySelectorAll(v)),
							d
						} catch (w) {}

					finally {
						p || b.removeAttribute("id")
					}
				}
			}
			return xb(a.replace(P, "$1"), b, d, e)
		}
		function eb() {
			var a = [];
			function b(c, e) {
				return a.push(c + " ") > d.cacheLength && delete b[a.shift()],
				b[c + " "] = e
			}
			return b
		}
		function fb(a) {
			return a[s] = !0,
			a
		}
		function gb(a) {
			var b = l.createElement("div");
			try {
				return !!a(b)
			} catch (c) {
				return !1
			}
			finally {
				b.parentNode && b.parentNode.removeChild(b),
				b = null
			}
		}
		function hb(a, b) {
			var c = a.split("|"),
			e = a.length;
			while (e--)
				d.attrHandle[c[e]] = b
		}
		function ib(a, b) {
			var c = b && a,
			d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || B) - (~a.sourceIndex || B);
			if (d)
				return d;
			if (c)
				while (c = c.nextSibling)
					if (c === b)
						return -1;
			return a ? 1 : -1
		}
		function jb(a) {
			return function (b) {
				var c = b.nodeName.toLowerCase();
				return "input" === c && b.type === a
			}
		}
		function kb(a) {
			return function (b) {
				var c = b.nodeName.toLowerCase();
				return ("input" === c || "button" === c) && b.type === a
			}
		}
		function lb(a) {
			return fb(function (b) {
				return b = +b,
				fb(function (c, d) {
					var e,
					f = a([], c.length, b),
					g = f.length;
					while (g--)
						c[e = f[g]] && (c[e] = !(d[e] = c[e]))
				})
			})
		}
		function mb(a) {
			return a && typeof a.getElementsByTagName !== A && a
		}
		c = db.support = {},
		f = db.isXML = function (a) {
			var b = a && (a.ownerDocument || a).documentElement;
			return b ? "HTML" !== b.nodeName : !1
		},
		k = db.setDocument = function (a) {
			var b,
			e = a ? a.ownerDocument || a : t,
			g = e.defaultView;
			return e !== l && 9 === e.nodeType && e.documentElement ? (l = e, m = e.documentElement, n = !f(e), g && g !== g.top && (g.addEventListener ? g.addEventListener("unload", function () {
						k()
					}, !1) : g.attachEvent && g.attachEvent("onunload", function () {
						k()
					})), c.attributes = gb(function (a) {
						return a.className = "i",
						!a.getAttribute("className")
					}), c.getElementsByTagName = gb(function (a) {
						return a.appendChild(e.createComment("")),
						!a.getElementsByTagName("*").length
					}), c.getElementsByClassName = Y.test(e.getElementsByClassName) && gb(function (a) {
						return a.innerHTML = "<div class='a'></div><div class='a i'></div>",
						a.firstChild.className = "i",
						2 === a.getElementsByClassName("i").length
					}), c.getById = gb(function (a) {
						return m.appendChild(a).id = s,
						!e.getElementsByName || !e.getElementsByName(s).length
					}), c.getById ? (d.find.ID = function (a, b) {
					if (typeof b.getElementById !== A && n) {
						var c = b.getElementById(a);
						return c && c.parentNode ? [c] : []
					}
				}, d.filter.ID = function (a) {
					var b = a.replace(ab, bb);
					return function (a) {
						return a.getAttribute("id") === b
					}
				}) : (delete d.find.ID, d.filter.ID = function (a) {
					var b = a.replace(ab, bb);
					return function (a) {
						var c = typeof a.getAttributeNode !== A && a.getAttributeNode("id");
						return c && c.value === b
					}
				}), d.find.TAG = c.getElementsByTagName ? function (a, b) {
				return typeof b.getElementsByTagName !== A ? b.getElementsByTagName(a) : void 0
			}
				 : function (a, b) {
				var c,
				d = [],
				e = 0,
				f = b.getElementsByTagName(a);
				if ("*" === a) {
					while (c = f[e++])
						1 === c.nodeType && d.push(c);
					return d
				}
				return f
			}, d.find.CLASS = c.getElementsByClassName && function (a, b) {
				return typeof b.getElementsByClassName !== A && n ? b.getElementsByClassName(a) : void 0
			}, p = [], o = [], (c.qsa = Y.test(e.querySelectorAll)) && (gb(function (a) {
						a.innerHTML = "<select t=''><option selected=''></option></select>",
						a.querySelectorAll("[t^='']").length && o.push("[*^$]=" + K + "*(?:''|\"\")"),
						a.querySelectorAll("[selected]").length || o.push("\\[" + K + "*(?:value|" + J + ")"),
						a.querySelectorAll(":checked").length || o.push(":checked")
					}), gb(function (a) {
						var b = e.createElement("input");
						b.setAttribute("type", "hidden"),
						a.appendChild(b).setAttribute("name", "D"),
						a.querySelectorAll("[name=d]").length && o.push("name" + K + "*[*^$|!~]?="),
						a.querySelectorAll(":enabled").length || o.push(":enabled", ":disabled"),
						a.querySelectorAll("*,:x"),
						o.push(",.*:")
					})), (c.matchesSelector = Y.test(q = m.webkitMatchesSelector || m.mozMatchesSelector || m.oMatchesSelector || m.msMatchesSelector)) && gb(function (a) {
					c.disconnectedMatch = q.call(a, "div"),
					q.call(a, "[s!='']:x"),
					p.push("!=", O)
				}), o = o.length && new RegExp(o.join("|")), p = p.length && new RegExp(p.join("|")), b = Y.test(m.compareDocumentPosition), r = b || Y.test(m.contains) ? function (a, b) {
				var c = 9 === a.nodeType ? a.documentElement : a,
				d = b && b.parentNode;
				return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
			}
				 : function (a, b) {
				if (b)
					while (b = b.parentNode)
						if (b === a)
							return !0;
				return !1
			}, z = b ? function (a, b) {
				if (a === b)
					return j = !0, 0;
				var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
				return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === e || a.ownerDocument === t && r(t, a) ? -1 : b === e || b.ownerDocument === t && r(t, b) ? 1 : i ? I.call(i, a) - I.call(i, b) : 0 : 4 & d ? -1 : 1)
			}
				 : function (a, b) {
				if (a === b)
					return j = !0, 0;
				var c,
				d = 0,
				f = a.parentNode,
				g = b.parentNode,
				h = [a],
				k = [b];
				if (!f || !g)
					return a === e ? -1 : b === e ? 1 : f ? -1 : g ? 1 : i ? I.call(i, a) - I.call(i, b) : 0;
				if (f === g)
					return ib(a, b);
				c = a;
				while (c = c.parentNode)
					h.unshift(c);
				c = b;
				while (c = c.parentNode)
					k.unshift(c);
				while (h[d] === k[d])
					d++;
				return d ? ib(h[d], k[d]) : h[d] === t ? -1 : k[d] === t ? 1 : 0
			}, e) : l
		},
		db.matches = function (a, b) {
			return db(a, null, null, b)
		},
		db.matchesSelector = function (a, b) {
			if ((a.ownerDocument || a) !== l && k(a), b = b.replace(S, "='$1']"), !(!c.matchesSelector || !n || p && p.test(b) || o && o.test(b)))
				try {
					var d = q.call(a, b);
					if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType)
						return d
				} catch (e) {}

			return db(b, l, null, [a]).length > 0
		},
		db.contains = function (a, b) {
			return (a.ownerDocument || a) !== l && k(a),
			r(a, b)
		},
		db.attr = function (a, b) {
			(a.ownerDocument || a) !== l && k(a);
			var e = d.attrHandle[b.toLowerCase()],
			f = e && C.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !n) : void 0;
			return void 0 !== f ? f : c.attributes || !n ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
		},
		db.error = function (a) {
			throw new Error("Syntax error, unrecognized expression: " + a)
		},
		db.uniqueSort = function (a) {
			var b,
			d = [],
			e = 0,
			f = 0;
			if (j = !c.detectDuplicates, i = !c.sortStable && a.slice(0), a.sort(z), j) {
				while (b = a[f++])
					b === a[f] && (e = d.push(f));
				while (e--)
					a.splice(d[e], 1)
			}
			return i = null,
			a
		},
		e = db.getText = function (a) {
			var b,
			c = "",
			d = 0,
			f = a.nodeType;
			if (f) {
				if (1 === f || 9 === f || 11 === f) {
					if ("string" == typeof a.textContent)
						return a.textContent;
					for (a = a.firstChild; a; a = a.nextSibling)
						c += e(a)
				} else if (3 === f || 4 === f)
					return a.nodeValue
			} else
				while (b = a[d++])
					c += e(b);
			return c
		},
		d = db.selectors = {
			cacheLength : 50,
			createPseudo : fb,
			match : V,
			attrHandle : {},
			find : {},
			relative : {
				">" : {
					dir : "parentNode",
					first : !0
				},
				" " : {
					dir : "parentNode"
				},
				"+" : {
					dir : "previousSibling",
					first : !0
				},
				"~" : {
					dir : "previousSibling"
				}
			},
			preFilter : {
				ATTR : function (a) {
					return a[1] = a[1].replace(ab, bb),
					a[3] = (a[4] || a[5] || "").replace(ab, bb),
					"~=" === a[2] && (a[3] = " " + a[3] + " "),
					a.slice(0, 4)
				},
				CHILD : function (a) {
					return a[1] = a[1].toLowerCase(),
					"nth" === a[1].slice(0, 3) ? (a[3] || db.error(a[0]), a[4] =  + (a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] =  + (a[7] + a[8] || "odd" === a[3])) : a[3] && db.error(a[0]),
					a
				},
				PSEUDO : function (a) {
					var b,
					c = !a[5] && a[2];
					return V.CHILD.test(a[0]) ? null : (a[3] && void 0 !== a[4] ? a[2] = a[4] : c && T.test(c) && (b = ob(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
				}
			},
			filter : {
				TAG : function (a) {
					var b = a.replace(ab, bb).toLowerCase();
					return "*" === a ? function () {
						return !0
					}
					 : function (a) {
						return a.nodeName && a.nodeName.toLowerCase() === b
					}
				},
				CLASS : function (a) {
					var b = w[a + " "];
					return b || (b = new RegExp("(^|" + K + ")" + a + "(" + K + "|$)")) && w(a, function (a) {
						return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== A && a.getAttribute("class") || "")
					})
				},
				ATTR : function (a, b, c) {
					return function (d) {
						var e = db.attr(d, a);
						return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
					}
				},
				CHILD : function (a, b, c, d, e) {
					var f = "nth" !== a.slice(0, 3),
					g = "last" !== a.slice(-4),
					h = "of-type" === b;
					return 1 === d && 0 === e ? function (a) {
						return !!a.parentNode
					}
					 : function (b, c, i) {
						var j,
						k,
						l,
						m,
						n,
						o,
						p = f !== g ? "nextSibling" : "previousSibling",
						q = b.parentNode,
						r = h && b.nodeName.toLowerCase(),
						t = !i && !h;
						if (q) {
							if (f) {
								while (p) {
									l = b;
									while (l = l[p])
										if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType)
											return !1;
									o = p = "only" === a && !o && "nextSibling"
								}
								return !0
							}
							if (o = [g ? q.firstChild : q.lastChild], g && t) {
								k = q[s] || (q[s] = {}),
								j = k[a] || [],
								n = j[0] === u && j[1],
								m = j[0] === u && j[2],
								l = n && q.childNodes[n];
								while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
									if (1 === l.nodeType && ++m && l === b) {
										k[a] = [u, n, m];
										break
									}
							} else if (t && (j = (b[s] || (b[s] = {}))[a]) && j[0] === u)
								m = j[1];
							else
								while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
									if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (t && ((l[s] || (l[s] = {}))[a] = [u, m]), l === b))
										break;
							return m -= e,
							m === d || m % d === 0 && m / d >= 0
						}
					}
				},
				PSEUDO : function (a, b) {
					var c,
					e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || db.error("unsupported pseudo: " + a);
					return e[s] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? fb(function (a, c) {
							var d,
							f = e(a, b),
							g = f.length;
							while (g--)
								d = I.call(a, f[g]), a[d] = !(c[d] = f[g])
						}) : function (a) {
						return e(a, 0, c)
					}) : e
				}
			},
			pseudos : {
				not : fb(function (a) {
					var b = [],
					c = [],
					d = g(a.replace(P, "$1"));
					return d[s] ? fb(function (a, b, c, e) {
						var f,
						g = d(a, null, e, []),
						h = a.length;
						while (h--)
							(f = g[h]) && (a[h] = !(b[h] = f))
					}) : function (a, e, f) {
						return b[0] = a,
						d(b, null, f, c),
						!c.pop()
					}
				}),
				has : fb(function (a) {
					return function (b) {
						return db(a, b).length > 0
					}
				}),
				contains : fb(function (a) {
					return function (b) {
						return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
					}
				}),
				lang : fb(function (a) {
					return U.test(a || "") || db.error("unsupported lang: " + a),
					a = a.replace(ab, bb).toLowerCase(),
					function (b) {
						var c;
						do
							if (c = n ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
								return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
						while ((b = b.parentNode) && 1 === b.nodeType);
						return !1
					}
				}),
				target : function (b) {
					var c = a.location && a.location.hash;
					return c && c.slice(1) === b.id
				},
				root : function (a) {
					return a === m
				},
				focus : function (a) {
					return a === l.activeElement && (!l.hasFocus || l.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
				},
				enabled : function (a) {
					return a.disabled === !1
				},
				disabled : function (a) {
					return a.disabled === !0
				},
				checked : function (a) {
					var b = a.nodeName.toLowerCase();
					return "input" === b && !!a.checked || "option" === b && !!a.selected
				},
				selected : function (a) {
					return a.parentNode && a.parentNode.selectedIndex,
					a.selected === !0
				},
				empty : function (a) {
					for (a = a.firstChild; a; a = a.nextSibling)
						if (a.nodeType < 6)
							return !1;
					return !0
				},
				parent : function (a) {
					return !d.pseudos.empty(a)
				},
				header : function (a) {
					return X.test(a.nodeName)
				},
				input : function (a) {
					return W.test(a.nodeName)
				},
				button : function (a) {
					var b = a.nodeName.toLowerCase();
					return "input" === b && "button" === a.type || "button" === b
				},
				text : function (a) {
					var b;
					return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
				},
				first : lb(function () {
					return [0]
				}),
				last : lb(function (a, b) {
					return [b - 1]
				}),
				eq : lb(function (a, b, c) {
					return [0 > c ? c + b : c]
				}),
				even : lb(function (a, b) {
					for (var c = 0; b > c; c += 2)
						a.push(c);
					return a
				}),
				odd : lb(function (a, b) {
					for (var c = 1; b > c; c += 2)
						a.push(c);
					return a
				}),
				lt : lb(function (a, b, c) {
					for (var d = 0 > c ? c + b : c; --d >= 0; )
						a.push(d);
					return a
				}),
				gt : lb(function (a, b, c) {
					for (var d = 0 > c ? c + b : c; ++d < b; )
						a.push(d);
					return a
				})
			}
		},
		d.pseudos.nth = d.pseudos.eq;
		for (b in {
			radio : !0,
			checkbox : !0,
			file : !0,
			password : !0,
			image : !0
		})
			d.pseudos[b] = jb(b);
		for (b in {
			submit : !0,
			reset : !0
		})
			d.pseudos[b] = kb(b);
		function nb() {}

		nb.prototype = d.filters = d.pseudos,
		d.setFilters = new nb;
		function ob(a, b) {
			var c,
			e,
			f,
			g,
			h,
			i,
			j,
			k = x[a + " "];
			if (k)
				return b ? 0 : k.slice(0);
			h = a,
			i = [],
			j = d.preFilter;
			while (h) {
				(!c || (e = Q.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])),
				c = !1,
				(e = R.exec(h)) && (c = e.shift(), f.push({
						value : c,
						type : e[0].replace(P, " ")
					}), h = h.slice(c.length));
				for (g in d.filter)
					!(e = V[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({
							value : c,
							type : g,
							matches : e
						}), h = h.slice(c.length));
				if (!c)
					break
			}
			return b ? h.length : h ? db.error(a) : x(a, i).slice(0)
		}
		function pb(a) {
			for (var b = 0, c = a.length, d = ""; c > b; b++)
				d += a[b].value;
			return d
		}
		function qb(a, b, c) {
			var d = b.dir,
			e = c && "parentNode" === d,
			f = v++;
			return b.first ? function (b, c, f) {
				while (b = b[d])
					if (1 === b.nodeType || e)
						return a(b, c, f)
			}
			 : function (b, c, g) {
				var h,
				i,
				j = [u, f];
				if (g) {
					while (b = b[d])
						if ((1 === b.nodeType || e) && a(b, c, g))
							return !0
				} else
					while (b = b[d])
						if (1 === b.nodeType || e) {
							if (i = b[s] || (b[s] = {}), (h = i[d]) && h[0] === u && h[1] === f)
								return j[2] = h[2];
							if (i[d] = j, j[2] = a(b, c, g))
								return !0
						}
			}
		}
		function rb(a) {
			return a.length > 1 ? function (b, c, d) {
				var e = a.length;
				while (e--)
					if (!a[e](b, c, d))
						return !1;
				return !0
			}
			 : a[0]
		}
		function sb(a, b, c, d, e) {
			for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)
				(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
			return g
		}
		function tb(a, b, c, d, e, f) {
			return d && !d[s] && (d = tb(d)),
			e && !e[s] && (e = tb(e, f)),
			fb(function (f, g, h, i) {
				var j,
				k,
				l,
				m = [],
				n = [],
				o = g.length,
				p = f || wb(b || "*", h.nodeType ? [h] : h, []),
				q = !a || !f && b ? p : sb(p, m, a, h, i),
				r = c ? e || (f ? a : o || d) ? [] : g : q;
				if (c && c(q, r, h, i), d) {
					j = sb(r, n),
					d(j, [], h, i),
					k = j.length;
					while (k--)
						(l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
				}
				if (f) {
					if (e || a) {
						if (e) {
							j = [],
							k = r.length;
							while (k--)
								(l = r[k]) && j.push(q[k] = l);
							e(null, r = [], j, i)
						}
						k = r.length;
						while (k--)
							(l = r[k]) && (j = e ? I.call(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
					}
				} else
					r = sb(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : G.apply(g, r)
			})
		}
		function ub(a) {
			for (var b, c, e, f = a.length, g = d.relative[a[0].type], i = g || d.relative[" "], j = g ? 1 : 0, k = qb(function (a) {
						return a === b
					}, i, !0), l = qb(function (a) {
						return I.call(b, a) > -1
					}, i, !0), m = [function (a, c, d) {
						return !g && (d || c !== h) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d))
					}
				]; f > j; j++)
				if (c = d.relative[a[j].type])
					m = [qb(rb(m), c)];
				else {
					if (c = d.filter[a[j].type].apply(null, a[j].matches), c[s]) {
						for (e = ++j; f > e; e++)
							if (d.relative[a[e].type])
								break;
						return tb(j > 1 && rb(m), j > 1 && pb(a.slice(0, j - 1).concat({
									value : " " === a[j - 2].type ? "*" : ""
								})).replace(P, "$1"), c, e > j && ub(a.slice(j, e)), f > e && ub(a = a.slice(e)), f > e && pb(a))
					}
					m.push(c)
				}
			return rb(m)
		}
		function vb(a, b) {
			var c = b.length > 0,
			e = a.length > 0,
			f = function (f, g, i, j, k) {
				var m,
				n,
				o,
				p = 0,
				q = "0",
				r = f && [],
				s = [],
				t = h,
				v = f || e && d.find.TAG("*", k),
				w = u += null == t ? 1 : Math.random() || .1,
				x = v.length;
				for (k && (h = g !== l && g); q !== x && null != (m = v[q]); q++) {
					if (e && m) {
						n = 0;
						while (o = a[n++])
							if (o(m, g, i)) {
								j.push(m);
								break
							}
						k && (u = w)
					}
					c && ((m = !o && m) && p--, f && r.push(m))
				}
				if (p += q, c && q !== p) {
					n = 0;
					while (o = b[n++])
						o(r, s, g, i);
					if (f) {
						if (p > 0)
							while (q--)
								r[q] || s[q] || (s[q] = E.call(j));
						s = sb(s)
					}
					G.apply(j, s),
					k && !f && s.length > 0 && p + b.length > 1 && db.uniqueSort(j)
				}
				return k && (u = w, h = t),
				r
			};
			return c ? fb(f) : f
		}
		g = db.compile = function (a, b) {
			var c,
			d = [],
			e = [],
			f = y[a + " "];
			if (!f) {
				b || (b = ob(a)),
				c = b.length;
				while (c--)
					f = ub(b[c]), f[s] ? d.push(f) : e.push(f);
				f = y(a, vb(e, d))
			}
			return f
		};
		function wb(a, b, c) {
			for (var d = 0, e = b.length; e > d; d++)
				db(a, b[d], c);
			return c
		}
		function xb(a, b, e, f) {
			var h,
			i,
			j,
			k,
			l,
			m = ob(a);
			if (!f && 1 === m.length) {
				if (i = m[0] = m[0].slice(0), i.length > 2 && "ID" === (j = i[0]).type && c.getById && 9 === b.nodeType && n && d.relative[i[1].type]) {
					if (b = (d.find.ID(j.matches[0].replace(ab, bb), b) || [])[0], !b)
						return e;
					a = a.slice(i.shift().value.length)
				}
				h = V.needsContext.test(a) ? 0 : i.length;
				while (h--) {
					if (j = i[h], d.relative[k = j.type])
						break;
					if ((l = d.find[k]) && (f = l(j.matches[0].replace(ab, bb), $.test(i[0].type) && mb(b.parentNode) || b))) {
						if (i.splice(h, 1), a = f.length && pb(i), !a)
							return G.apply(e, f), e;
						break
					}
				}
			}
			return g(a, m)(f, b, !n, e, $.test(a) && mb(b.parentNode) || b),
			e
		}
		return c.sortStable = s.split("").sort(z).join("") === s,
		c.detectDuplicates = !!j,
		k(),
		c.sortDetached = gb(function (a) {
				return 1 & a.compareDocumentPosition(l.createElement("div"))
			}),
		gb(function (a) {
			return a.innerHTML = "<a href='#'></a>",
			"#" === a.firstChild.getAttribute("href")
		}) || hb("type|href|height|width", function (a, b, c) {
			return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
		}),
		c.attributes && gb(function (a) {
			return a.innerHTML = "<input/>",
			a.firstChild.setAttribute("value", ""),
			"" === a.firstChild.getAttribute("value")
		}) || hb("value", function (a, b, c) {
			return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
		}),
		gb(function (a) {
			return null == a.getAttribute("disabled")
		}) || hb(J, function (a, b, c) {
			var d;
			return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
		}),
		db
	}
	(a);
	n.find = t,
	n.expr = t.selectors,
	n.expr[":"] = n.expr.pseudos,
	n.unique = t.uniqueSort,
	n.text = t.getText,
	n.isXMLDoc = t.isXML,
	n.contains = t.contains;
	var u = n.expr.match.needsContext,
	v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	w = /^.[^:#\[\.,]*$/;
	function x(a, b, c) {
		if (n.isFunction(b))
			return n.grep(a, function (a, d) {
				return !!b.call(a, d, a) !== c
			});
		if (b.nodeType)
			return n.grep(a, function (a) {
				return a === b !== c
			});
		if ("string" == typeof b) {
			if (w.test(b))
				return n.filter(b, a, c);
			b = n.filter(b, a)
		}
		return n.grep(a, function (a) {
			return n.inArray(a, b) >= 0 !== c
		})
	}
	n.filter = function (a, b, c) {
		var d = b[0];
		return c && (a = ":not(" + a + ")"),
		1 === b.length && 1 === d.nodeType ? n.find.matchesSelector(d, a) ? [d] : [] : n.find.matches(a, n.grep(b, function (a) {
				return 1 === a.nodeType
			}))
	},
	n.fn.extend({
		find : function (a) {
			var b,
			c = [],
			d = this,
			e = d.length;
			if ("string" != typeof a)
				return this.pushStack(n(a).filter(function () {
						for (b = 0; e > b; b++)
							if (n.contains(d[b], this))
								return !0
					}));
			for (b = 0; e > b; b++)
				n.find(a, d[b], c);
			return c = this.pushStack(e > 1 ? n.unique(c) : c),
			c.selector = this.selector ? this.selector + " " + a : a,
			c
		},
		filter : function (a) {
			return this.pushStack(x(this, a || [], !1))
		},
		not : function (a) {
			return this.pushStack(x(this, a || [], !0))
		},
		is : function (a) {
			return !!x(this, "string" == typeof a && u.test(a) ? n(a) : a || [], !1).length
		}
	});
	var y,
	z = a.document,
	A = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
	B = n.fn.init = function (a, b) {
		var c,
		d;
		if (!a)
			return this;
		if ("string" == typeof a) {
			if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : A.exec(a), !c || !c[1] && b)
				return !b || b.jquery ? (b || y).find(a) : this.constructor(b).find(a);
			if (c[1]) {
				if (b = b instanceof n ? b[0] : b, n.merge(this, n.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : z, !0)), v.test(c[1]) && n.isPlainObject(b))
					for (c in b)
						n.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
				return this
			}
			if (d = z.getElementById(c[2]), d && d.parentNode) {
				if (d.id !== c[2])
					return y.find(a);
				this.length = 1,
				this[0] = d
			}
			return this.context = z,
			this.selector = a,
			this
		}
		return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : n.isFunction(a) ? "undefined" != typeof y.ready ? y.ready(a) : a(n) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), n.makeArray(a, this))
	};
	B.prototype = n.fn,
	y = n(z);
	var C = /^(?:parents|prev(?:Until|All))/,
	D = {
		children : !0,
		contents : !0,
		next : !0,
		prev : !0
	};
	n.extend({
		dir : function (a, b, c) {
			var d = [],
			e = a[b];
			while (e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !n(e).is(c)))
				1 === e.nodeType && d.push(e), e = e[b];
			return d
		},
		sibling : function (a, b) {
			for (var c = []; a; a = a.nextSibling)
				1 === a.nodeType && a !== b && c.push(a);
			return c
		}
	}),
	n.fn.extend({
		has : function (a) {
			var b,
			c = n(a, this),
			d = c.length;
			return this.filter(function () {
				for (b = 0; d > b; b++)
					if (n.contains(this, c[b]))
						return !0
			})
		},
		closest : function (a, b) {
			for (var c, d = 0, e = this.length, f = [], g = u.test(a) || "string" != typeof a ? n(a, b || this.context) : 0; e > d; d++)
				for (c = this[d]; c && c !== b; c = c.parentNode)
					if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && n.find.matchesSelector(c, a))) {
						f.push(c);
						break
					}
			return this.pushStack(f.length > 1 ? n.unique(f) : f)
		},
		index : function (a) {
			return a ? "string" == typeof a ? n.inArray(this[0], n(a)) : n.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
		},
		add : function (a, b) {
			return this.pushStack(n.unique(n.merge(this.get(), n(a, b))))
		},
		addBack : function (a) {
			return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
		}
	});
	function E(a, b) {
		do
			a = a[b];
		while (a && 1 !== a.nodeType);
		return a
	}
	n.each({
		parent : function (a) {
			var b = a.parentNode;
			return b && 11 !== b.nodeType ? b : null
		},
		parents : function (a) {
			return n.dir(a, "parentNode")
		},
		parentsUntil : function (a, b, c) {
			return n.dir(a, "parentNode", c)
		},
		next : function (a) {
			return E(a, "nextSibling")
		},
		prev : function (a) {
			return E(a, "previousSibling")
		},
		nextAll : function (a) {
			return n.dir(a, "nextSibling")
		},
		prevAll : function (a) {
			return n.dir(a, "previousSibling")
		},
		nextUntil : function (a, b, c) {
			return n.dir(a, "nextSibling", c)
		},
		prevUntil : function (a, b, c) {
			return n.dir(a, "previousSibling", c)
		},
		siblings : function (a) {
			return n.sibling((a.parentNode || {}).firstChild, a)
		},
		children : function (a) {
			return n.sibling(a.firstChild)
		},
		contents : function (a) {
			return n.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : n.merge([], a.childNodes)
		}
	}, function (a, b) {
		n.fn[a] = function (c, d) {
			var e = n.map(this, b, c);
			return "Until" !== a.slice(-5) && (d = c),
			d && "string" == typeof d && (e = n.filter(d, e)),
			this.length > 1 && (D[a] || (e = n.unique(e)), C.test(a) && (e = e.reverse())),
			this.pushStack(e)
		}
	});
	var F = /\S+/g,
	G = {};
	function H(a) {
		var b = G[a] = {};
		return n.each(a.match(F) || [], function (a, c) {
			b[c] = !0
		}),
		b
	}
	n.Callbacks = function (a) {
		a = "string" == typeof a ? G[a] || H(a) : n.extend({}, a);
		var b,
		c,
		d,
		e,
		f,
		g,
		h = [],
		i = !a.once && [],
		j = function (l) {
			for (c = a.memory && l, d = !0, f = g || 0, g = 0, e = h.length, b = !0; h && e > f; f++)
				if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
					c = !1;
					break
				}
			b = !1,
			h && (i ? i.length && j(i.shift()) : c ? h = [] : k.disable())
		},
		k = {
			add : function () {
				if (h) {
					var d = h.length;
					!function f(b) {
						n.each(b, function (b, c) {
							var d = n.type(c);
							"function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && f(c)
						})
					}
					(arguments),
					b ? e = h.length : c && (g = d, j(c))
				}
				return this
			},
			remove : function () {
				return h && n.each(arguments, function (a, c) {
					var d;
					while ((d = n.inArray(c, h, d)) > -1)
						h.splice(d, 1), b && (e >= d && e--, f >= d && f--)
				}),
				this
			},
			has : function (a) {
				return a ? n.inArray(a, h) > -1 : !(!h || !h.length)
			},
			empty : function () {
				return h = [],
				e = 0,
				this
			},
			disable : function () {
				return h = i = c = void 0,
				this
			},
			disabled : function () {
				return !h
			},
			lock : function () {
				return i = void 0,
				c || k.disable(),
				this
			},
			locked : function () {
				return !i
			},
			fireWith : function (a, c) {
				return !h || d && !i || (c = c || [], c = [a, c.slice ? c.slice() : c], b ? i.push(c) : j(c)),
				this
			},
			fire : function () {
				return k.fireWith(this, arguments),
				this
			},
			fired : function () {
				return !!d
			}
		};
		return k
	},
	n.extend({
		Deferred : function (a) {
			var b = [["resolve", "done", n.Callbacks("once memory"), "resolved"], ["reject", "fail", n.Callbacks("once memory"), "rejected"], ["notify", "progress", n.Callbacks("memory")]],
			c = "pending",
			d = {
				state : function () {
					return c
				},
				always : function () {
					return e.done(arguments).fail(arguments),
					this
				},
				then : function () {
					var a = arguments;
					return n.Deferred(function (c) {
						n.each(b, function (b, f) {
							var g = n.isFunction(a[b]) && a[b];
							e[f[1]](function () {
								var a = g && g.apply(this, arguments);
								a && n.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
							})
						}),
						a = null
					}).promise()
				},
				promise : function (a) {
					return null != a ? n.extend(a, d) : d
				}
			},
			e = {};
			return d.pipe = d.then,
			n.each(b, function (a, f) {
				var g = f[2],
				h = f[3];
				d[f[1]] = g.add,
				h && g.add(function () {
					c = h
				}, b[1^a][2].disable, b[2][2].lock),
				e[f[0]] = function () {
					return e[f[0] + "With"](this === e ? d : this, arguments),
					this
				},
				e[f[0] + "With"] = g.fireWith
			}),
			d.promise(e),
			a && a.call(e, e),
			e
		},
		when : function (a) {
			var b = 0,
			c = d.call(arguments),
			e = c.length,
			f = 1 !== e || a && n.isFunction(a.promise) ? e : 0,
			g = 1 === f ? a : n.Deferred(),
			h = function (a, b, c) {
				return function (e) {
					b[a] = this,
					c[a] = arguments.length > 1 ? d.call(arguments) : e,
					c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
				}
			},
			i,
			j,
			k;
			if (e > 1)
				for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++)
					c[b] && n.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
			return f || g.resolveWith(k, c),
			g.promise()
		}
	});
	var I;
	n.fn.ready = function (a) {
		return n.ready.promise().done(a),
		this
	},
	n.extend({
		isReady : !1,
		readyWait : 1,
		holdReady : function (a) {
			a ? n.readyWait++ : n.ready(!0)
		},
		ready : function (a) {
			if (a === !0 ? !--n.readyWait : !n.isReady) {
				if (!z.body)
					return setTimeout(n.ready);
				n.isReady = !0,
				a !== !0 && --n.readyWait > 0 || (I.resolveWith(z, [n]), n.fn.trigger && n(z).trigger("ready").off("ready"))
			}
		}
	});
	function J() {
		z.addEventListener ? (z.removeEventListener("DOMContentLoaded", K, !1), a.removeEventListener("load", K, !1)) : (z.detachEvent("onreadystatechange", K), a.detachEvent("onload", K))
	}
	function K() {
		(z.addEventListener || "load" === event.type || "complete" === z.readyState) && (J(), n.ready())
	}
	n.ready.promise = function (b) {
		if (!I)
			if (I = n.Deferred(), "complete" === z.readyState)
				setTimeout(n.ready);
			else if (z.addEventListener)
				z.addEventListener("DOMContentLoaded", K, !1), a.addEventListener("load", K, !1);
			else {
				z.attachEvent("onreadystatechange", K),
				a.attachEvent("onload", K);
				var c = !1;
				try {
					c = null == a.frameElement && z.documentElement
				} catch (d) {}

				c && c.doScroll && !function e() {
					if (!n.isReady) {
						try {
							c.doScroll("left")
						} catch (a) {
							return setTimeout(e, 50)
						}
						J(),
						n.ready()
					}
				}
				()
			}
		return I.promise(b)
	};
	var L = "undefined",
	M;
	for (M in n(l))
		break;
	l.ownLast = "0" !== M,
	l.inlineBlockNeedsLayout = !1,
	n(function () {
		var a,
		b,
		c = z.getElementsByTagName("body")[0];
		c && (a = z.createElement("div"), a.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", b = z.createElement("div"), c.appendChild(a).appendChild(b), typeof b.style.zoom !== L && (b.style.cssText = "border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1", (l.inlineBlockNeedsLayout = 3 === b.offsetWidth) && (c.style.zoom = 1)), c.removeChild(a), a = b = null)
	}),
	function () {
		var a = z.createElement("div");
		if (null == l.deleteExpando) {
			l.deleteExpando = !0;
			try {
				delete a.test
			} catch (b) {
				l.deleteExpando = !1
			}
		}
		a = null
	}
	(),
	n.acceptData = function (a) {
		var b = n.noData[(a.nodeName + " ").toLowerCase()],
		c = +a.nodeType || 1;
		return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
	};
	var N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	O = /([A-Z])/g;
	function P(a, b, c) {
		if (void 0 === c && 1 === a.nodeType) {
			var d = "data-" + b.replace(O, "-$1").toLowerCase();
			if (c = a.getAttribute(d), "string" == typeof c) {
				try {
					c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : N.test(c) ? n.parseJSON(c) : c
				} catch (e) {}

				n.data(a, b, c)
			} else
				c = void 0
		}
		return c
	}
	function Q(a) {
		var b;
		for (b in a)
			if (("data" !== b || !n.isEmptyObject(a[b])) && "toJSON" !== b)
				return !1;
		return !0
	}
	function R(a, b, d, e) {
		if (n.acceptData(a)) {
			var f,
			g,
			h = n.expando,
			i = a.nodeType,
			j = i ? n.cache : a,
			k = i ? a[h] : a[h] && h;
			if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b)
				return k || (k = i ? a[h] = c.pop() || n.guid++ : h), j[k] || (j[k] = i ? {}

					 : {
					toJSON : n.noop
				}), ("object" == typeof b || "function" == typeof b) && (e ? j[k] = n.extend(j[k], b) : j[k].data = n.extend(j[k].data, b)), g = j[k], e || (g.data || (g.data = {}), g = g.data), void 0 !== d && (g[n.camelCase(b)] = d), "string" == typeof b ? (f = g[b], null == f && (f = g[n.camelCase(b)])) : f = g, f
		}
	}
	function S(a, b, c) {
		if (n.acceptData(a)) {
			var d,
			e,
			f = a.nodeType,
			g = f ? n.cache : a,
			h = f ? a[n.expando] : n.expando;
			if (g[h]) {
				if (b && (d = c ? g[h] : g[h].data)) {
					n.isArray(b) ? b = b.concat(n.map(b, n.camelCase)) : b in d ? b = [b] : (b = n.camelCase(b), b = b in d ? [b] : b.split(" ")),
					e = b.length;
					while (e--)
						delete d[b[e]];
					if (c ? !Q(d) : !n.isEmptyObject(d))
						return
				}
				(c || (delete g[h].data, Q(g[h]))) && (f ? n.cleanData([a], !0) : l.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
			}
		}
	}
	n.extend({
		cache : {},
		noData : {
			"applet " : !0,
			"embed " : !0,
			"object " : "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
		},
		hasData : function (a) {
			return a = a.nodeType ? n.cache[a[n.expando]] : a[n.expando],
			!!a && !Q(a)
		},
		data : function (a, b, c) {
			return R(a, b, c)
		},
		removeData : function (a, b) {
			return S(a, b)
		},
		_data : function (a, b, c) {
			return R(a, b, c, !0)
		},
		_removeData : function (a, b) {
			return S(a, b, !0)
		}
	}),
	n.fn.extend({
		data : function (a, b) {
			var c,
			d,
			e,
			f = this[0],
			g = f && f.attributes;
			if (void 0 === a) {
				if (this.length && (e = n.data(f), 1 === f.nodeType && !n._data(f, "parsedAttrs"))) {
					c = g.length;
					while (c--)
						d = g[c].name, 0 === d.indexOf("data-") && (d = n.camelCase(d.slice(5)), P(f, d, e[d]));
					n._data(f, "parsedAttrs", !0)
				}
				return e
			}
			return "object" == typeof a ? this.each(function () {
				n.data(this, a)
			}) : arguments.length > 1 ? this.each(function () {
				n.data(this, a, b)
			}) : f ? P(f, a, n.data(f, a)) : void 0
		},
		removeData : function (a) {
			return this.each(function () {
				n.removeData(this, a)
			})
		}
	}),
	n.extend({
		queue : function (a, b, c) {
			var d;
			return a ? (b = (b || "fx") + "queue", d = n._data(a, b), c && (!d || n.isArray(c) ? d = n._data(a, b, n.makeArray(c)) : d.push(c)), d || []) : void 0
		},
		dequeue : function (a, b) {
			b = b || "fx";
			var c = n.queue(a, b),
			d = c.length,
			e = c.shift(),
			f = n._queueHooks(a, b),
			g = function () {
				n.dequeue(a, b)
			};
			"inprogress" === e && (e = c.shift(), d--),
			e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)),
			!d && f && f.empty.fire()
		},
		_queueHooks : function (a, b) {
			var c = b + "queueHooks";
			return n._data(a, c) || n._data(a, c, {
				empty : n.Callbacks("once memory").add(function () {
					n._removeData(a, b + "queue"),
					n._removeData(a, c)
				})
			})
		}
	}),
	n.fn.extend({
		queue : function (a, b) {
			var c = 2;
			return "string" != typeof a && (b = a, a = "fx", c--),
			arguments.length < c ? n.queue(this[0], a) : void 0 === b ? this : this.each(function () {
				var c = n.queue(this, a, b);
				n._queueHooks(this, a),
				"fx" === a && "inprogress" !== c[0] && n.dequeue(this, a)
			})
		},
		dequeue : function (a) {
			return this.each(function () {
				n.dequeue(this, a)
			})
		},
		clearQueue : function (a) {
			return this.queue(a || "fx", [])
		},
		promise : function (a, b) {
			var c,
			d = 1,
			e = n.Deferred(),
			f = this,
			g = this.length,
			h = function () {
				--d || e.resolveWith(f, [f])
			};
			"string" != typeof a && (b = a, a = void 0),
			a = a || "fx";
			while (g--)
				c = n._data(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
			return h(),
			e.promise(b)
		}
	});
	var T = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
	U = ["Top", "Right", "Bottom", "Left"],
	V = function (a, b) {
		return a = b || a,
		"none" === n.css(a, "display") || !n.contains(a.ownerDocument, a)
	},
	W = n.access = function (a, b, c, d, e, f, g) {
		var h = 0,
		i = a.length,
		j = null == c;
		if ("object" === n.type(c)) {
			e = !0;
			for (h in c)
				n.access(a, b, h, c[h], !0, f, g)
		} else if (void 0 !== d && (e = !0, n.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function (a, b, c) {
						return j.call(n(a), c)
					})), b))
			for (; i > h; h++)
				b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
		return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
	},
	X = /^(?:checkbox|radio)$/i;
	!function () {
		var a = z.createDocumentFragment(),
		b = z.createElement("div"),
		c = z.createElement("input");
		if (b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a>", l.leadingWhitespace = 3 === b.firstChild.nodeType, l.tbody = !b.getElementsByTagName("tbody").length, l.htmlSerialize = !!b.getElementsByTagName("link").length, l.html5Clone = "<:nav></:nav>" !== z.createElement("nav").cloneNode(!0).outerHTML, c.type = "checkbox", c.checked = !0, a.appendChild(c), l.appendChecked = c.checked, b.innerHTML = "<textarea>x</textarea>", l.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, a.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", l.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, l.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function () {
					l.noCloneEvent = !1
				}), b.cloneNode(!0).click()), null == l.deleteExpando) {
			l.deleteExpando = !0;
			try {
				delete b.test
			} catch (d) {
				l.deleteExpando = !1
			}
		}
		a = b = c = null
	}
	(),
	function () {
		var b,
		c,
		d = z.createElement("div");
		for (b in {
			submit : !0,
			change : !0,
			focusin : !0
		})
			c = "on" + b, (l[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), l[b + "Bubbles"] = d.attributes[c].expando === !1);
		d = null
	}
	();
	var Y = /^(?:input|select|textarea)$/i,
	Z = /^key/,
	$ = /^(?:mouse|contextmenu)|click/,
	_ = /^(?:focusinfocus|focusoutblur)$/,
	ab = /^([^.]*)(?:\.(.+)|)$/;
	function bb() {
		return !0
	}
	function cb() {
		return !1
	}
	function db() {
		try {
			return z.activeElement
		} catch (a) {}

	}
	n.event = {
		global : {},
		add : function (a, b, c, d, e) {
			var f,
			g,
			h,
			i,
			j,
			k,
			l,
			m,
			o,
			p,
			q,
			r = n._data(a);
			if (r) {
				c.handler && (i = c, c = i.handler, e = i.selector),
				c.guid || (c.guid = n.guid++),
				(g = r.events) || (g = r.events = {}),
				(k = r.handle) || (k = r.handle = function (a) {
					return typeof n === L || a && n.event.triggered === a.type ? void 0 : n.event.dispatch.apply(k.elem, arguments)
				}, k.elem = a),
				b = (b || "").match(F) || [""],
				h = b.length;
				while (h--)
					f = ab.exec(b[h]) || [], o = q = f[1], p = (f[2] || "").split(".").sort(), o && (j = n.event.special[o] || {}, o = (e ? j.delegateType : j.bindType) || o, j = n.event.special[o] || {}, l = n.extend({
								type : o,
								origType : q,
								data : d,
								handler : c,
								guid : c.guid,
								selector : e,
								needsContext : e && n.expr.match.needsContext.test(e),
								namespace : p.join(".")
							}, i), (m = g[o]) || (m = g[o] = [], m.delegateCount = 0, j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, l) : m.push(l), n.event.global[o] = !0);
				a = null
			}
		},
		remove : function (a, b, c, d, e) {
			var f,
			g,
			h,
			i,
			j,
			k,
			l,
			m,
			o,
			p,
			q,
			r = n.hasData(a) && n._data(a);
			if (r && (k = r.events)) {
				b = (b || "").match(F) || [""],
				j = b.length;
				while (j--)
					if (h = ab.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) {
						l = n.event.special[o] || {},
						o = (d ? l.delegateType : l.bindType) || o,
						m = k[o] || [],
						h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"),
						i = f = m.length;
						while (f--)
							g = m[f], !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
						i && !m.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || n.removeEvent(a, o, r.handle), delete k[o])
					} else
						for (o in k)
							n.event.remove(a, o + b[j], c, d, !0);
				n.isEmptyObject(k) && (delete r.handle, n._removeData(a, "events"))
			}
		},
		trigger : function (b, c, d, e) {
			var f,
			g,
			h,
			i,
			k,
			l,
			m,
			o = [d || z],
			p = j.call(b, "type") ? b.type : b,
			q = j.call(b, "namespace") ? b.namespace.split(".") : [];
			if (h = l = d = d || z, 3 !== d.nodeType && 8 !== d.nodeType && !_.test(p + n.event.triggered) && (p.indexOf(".") >= 0 && (q = p.split("."), p = q.shift(), q.sort()), g = p.indexOf(":") < 0 && "on" + p, b = b[n.expando] ? b : new n.Event(p, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = q.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : n.makeArray(c, [b]), k = n.event.special[p] || {}, e || !k.trigger || k.trigger.apply(d, c) !== !1)) {
				if (!e && !k.noBubble && !n.isWindow(d)) {
					for (i = k.delegateType || p, _.test(i + p) || (h = h.parentNode); h; h = h.parentNode)
						o.push(h), l = h;
					l === (d.ownerDocument || z) && o.push(l.defaultView || l.parentWindow || a)
				}
				m = 0;
				while ((h = o[m++]) && !b.isPropagationStopped())
					b.type = m > 1 ? i : k.bindType || p, f = (n._data(h, "events") || {})[b.type] && n._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && n.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
				if (b.type = p, !e && !b.isDefaultPrevented() && (!k._default || k._default.apply(o.pop(), c) === !1) && n.acceptData(d) && g && d[p] && !n.isWindow(d)) {
					l = d[g],
					l && (d[g] = null),
					n.event.triggered = p;
					try {
						d[p]()
					} catch (r) {}

					n.event.triggered = void 0,
					l && (d[g] = l)
				}
				return b.result
			}
		},
		dispatch : function (a) {
			a = n.event.fix(a);
			var b,
			c,
			e,
			f,
			g,
			h = [],
			i = d.call(arguments),
			j = (n._data(this, "events") || {})[a.type] || [],
			k = n.event.special[a.type] || {};
			if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
				h = n.event.handlers.call(this, a, j),
				b = 0;
				while ((f = h[b++]) && !a.isPropagationStopped()) {
					a.currentTarget = f.elem,
					g = 0;
					while ((e = f.handlers[g++]) && !a.isImmediatePropagationStopped())
						(!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e, a.data = e.data, c = ((n.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i), void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()))
				}
				return k.postDispatch && k.postDispatch.call(this, a),
				a.result
			}
		},
		handlers : function (a, b) {
			var c,
			d,
			e,
			f,
			g = [],
			h = b.delegateCount,
			i = a.target;
			if (h && i.nodeType && (!a.button || "click" !== a.type))
				for (; i != this; i = i.parentNode || this)
					if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
						for (e = [], f = 0; h > f; f++)
							d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? n(c, this).index(i) >= 0 : n.find(c, this, null, [i]).length), e[c] && e.push(d);
						e.length && g.push({
							elem : i,
							handlers : e
						})
					}
			return h < b.length && g.push({
				elem : this,
				handlers : b.slice(h)
			}),
			g
		},
		fix : function (a) {
			if (a[n.expando])
				return a;
			var b,
			c,
			d,
			e = a.type,
			f = a,
			g = this.fixHooks[e];
			g || (this.fixHooks[e] = g = $.test(e) ? this.mouseHooks : Z.test(e) ? this.keyHooks : {}),
			d = g.props ? this.props.concat(g.props) : this.props,
			a = new n.Event(f),
			b = d.length;
			while (b--)
				c = d[b], a[c] = f[c];
			return a.target || (a.target = f.srcElement || z),
			3 === a.target.nodeType && (a.target = a.target.parentNode),
			a.metaKey = !!a.metaKey,
			g.filter ? g.filter(a, f) : a
		},
		props : "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
		fixHooks : {},
		keyHooks : {
			props : "char charCode key keyCode".split(" "),
			filter : function (a, b) {
				return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode),
				a
			}
		},
		mouseHooks : {
			props : "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
			filter : function (a, b) {
				var c,
				d,
				e,
				f = b.button,
				g = b.fromElement;
				return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || z, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)),
				!a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g),
				a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0),
				a
			}
		},
		special : {
			load : {
				noBubble : !0
			},
			focus : {
				trigger : function () {
					if (this !== db() && this.focus)
						try {
							return this.focus(),
							!1
						} catch (a) {}

				},
				delegateType : "focusin"
			},
			blur : {
				trigger : function () {
					return this === db() && this.blur ? (this.blur(), !1) : void 0
				},
				delegateType : "focusout"
			},
			click : {
				trigger : function () {
					return n.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
				},
				_default : function (a) {
					return n.nodeName(a.target, "a")
				}
			},
			beforeunload : {
				postDispatch : function (a) {
					void 0 !== a.result && (a.originalEvent.returnValue = a.result)
				}
			}
		},
		simulate : function (a, b, c, d) {
			var e = n.extend(new n.Event, c, {
					type : a,
					isSimulated : !0,
					originalEvent : {}

				});
			d ? n.event.trigger(e, null, b) : n.event.dispatch.call(b, e),
			e.isDefaultPrevented() && c.preventDefault()
		}
	},
	n.removeEvent = z.removeEventListener ? function (a, b, c) {
		a.removeEventListener && a.removeEventListener(b, c, !1)
	}
	 : function (a, b, c) {
		var d = "on" + b;
		a.detachEvent && (typeof a[d] === L && (a[d] = null), a.detachEvent(d, c))
	},
	n.Event = function (a, b) {
		return this instanceof n.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && (a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault()) ? bb : cb) : this.type = a, b && n.extend(this, b), this.timeStamp = a && a.timeStamp || n.now(), void(this[n.expando] = !0)) : new n.Event(a, b)
	},
	n.Event.prototype = {
		isDefaultPrevented : cb,
		isPropagationStopped : cb,
		isImmediatePropagationStopped : cb,
		preventDefault : function () {
			var a = this.originalEvent;
			this.isDefaultPrevented = bb,
			a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
		},
		stopPropagation : function () {
			var a = this.originalEvent;
			this.isPropagationStopped = bb,
			a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
		},
		stopImmediatePropagation : function () {
			this.isImmediatePropagationStopped = bb,
			this.stopPropagation()
		}
	},
	n.each({
		mouseenter : "mouseover",
		mouseleave : "mouseout"
	}, function (a, b) {
		n.event.special[a] = {
			delegateType : b,
			bindType : b,
			handle : function (a) {
				var c,
				d = this,
				e = a.relatedTarget,
				f = a.handleObj;
				return (!e || e !== d && !n.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b),
				c
			}
		}
	}),
	l.submitBubbles || (n.event.special.submit = {
			setup : function () {
				return n.nodeName(this, "form") ? !1 : void n.event.add(this, "click._submit keypress._submit", function (a) {
					var b = a.target,
					c = n.nodeName(b, "input") || n.nodeName(b, "button") ? b.form : void 0;
					c && !n._data(c, "submitBubbles") && (n.event.add(c, "submit._submit", function (a) {
							a._submit_bubble = !0
						}), n._data(c, "submitBubbles", !0))
				})
			},
			postDispatch : function (a) {
				a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && n.event.simulate("submit", this.parentNode, a, !0))
			},
			teardown : function () {
				return n.nodeName(this, "form") ? !1 : void n.event.remove(this, "._submit")
			}
		}),
	l.changeBubbles || (n.event.special.change = {
			setup : function () {
				return Y.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (n.event.add(this, "propertychange._change", function (a) {
							"checked" === a.originalEvent.propertyName && (this._just_changed = !0)
						}), n.event.add(this, "click._change", function (a) {
							this._just_changed && !a.isTrigger && (this._just_changed = !1),
							n.event.simulate("change", this, a, !0)
						})), !1) : void n.event.add(this, "beforeactivate._change", function (a) {
					var b = a.target;
					Y.test(b.nodeName) && !n._data(b, "changeBubbles") && (n.event.add(b, "change._change", function (a) {
							!this.parentNode || a.isSimulated || a.isTrigger || n.event.simulate("change", this.parentNode, a, !0)
						}), n._data(b, "changeBubbles", !0))
				})
			},
			handle : function (a) {
				var b = a.target;
				return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
			},
			teardown : function () {
				return n.event.remove(this, "._change"),
				!Y.test(this.nodeName)
			}
		}),
	l.focusinBubbles || n.each({
		focus : "focusin",
		blur : "focusout"
	}, function (a, b) {
		var c = function (a) {
			n.event.simulate(b, a.target, n.event.fix(a), !0)
		};
		n.event.special[b] = {
			setup : function () {
				var d = this.ownerDocument || this,
				e = n._data(d, b);
				e || d.addEventListener(a, c, !0),
				n._data(d, b, (e || 0) + 1)
			},
			teardown : function () {
				var d = this.ownerDocument || this,
				e = n._data(d, b) - 1;
				e ? n._data(d, b, e) : (d.removeEventListener(a, c, !0), n._removeData(d, b))
			}
		}
	}),
	n.fn.extend({
		on : function (a, b, c, d, e) {
			var f,
			g;
			if ("object" == typeof a) {
				"string" != typeof b && (c = c || b, b = void 0);
				for (f in a)
					this.on(f, b, c, a[f], e);
				return this
			}
			if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1)
				d = cb;
			else if (!d)
				return this;
			return 1 === e && (g = d, d = function (a) {
				return n().off(a),
				g.apply(this, arguments)
			}, d.guid = g.guid || (g.guid = n.guid++)),
			this.each(function () {
				n.event.add(this, a, d, c, b)
			})
		},
		one : function (a, b, c, d) {
			return this.on(a, b, c, d, 1)
		},
		off : function (a, b, c) {
			var d,
			e;
			if (a && a.preventDefault && a.handleObj)
				return d = a.handleObj, n(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
			if ("object" == typeof a) {
				for (e in a)
					this.off(e, b, a[e]);
				return this
			}
			return (b === !1 || "function" == typeof b) && (c = b, b = void 0),
			c === !1 && (c = cb),
			this.each(function () {
				n.event.remove(this, a, c, b)
			})
		},
		trigger : function (a, b) {
			return this.each(function () {
				n.event.trigger(a, b, this)
			})
		},
		triggerHandler : function (a, b) {
			var c = this[0];
			return c ? n.event.trigger(a, b, c, !0) : void 0
		}
	});
	function eb(a) {
		var b = fb.split("|"),
		c = a.createDocumentFragment();
		if (c.createElement)
			while (b.length)
				c.createElement(b.pop());
		return c
	}
	var fb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	gb = / jQuery\d+="(?:null|\d+)"/g,
	hb = new RegExp("<(?:" + fb + ")[\\s/>]", "i"),
	ib = /^\s+/,
	jb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	kb = /<([\w:]+)/,
	lb = /<tbody/i,
	mb = /<|&#?\w+;/,
	nb = /<(?:script|style|link)/i,
	ob = /checked\s*(?:[^=]|=\s*.checked.)/i,
	pb = /^$|\/(?:java|ecma)script/i,
	qb = /^true\/(.*)/,
	rb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	sb = {
		option : [1, "<select multiple='multiple'>", "</select>"],
		legend : [1, "<fieldset>", "</fieldset>"],
		area : [1, "<map>", "</map>"],
		param : [1, "<object>", "</object>"],
		thead : [1, "<table>", "</table>"],
		tr : [2, "<table><tbody>", "</tbody></table>"],
		col : [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
		td : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
		_default : l.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
	},
	tb = eb(z),
	ub = tb.appendChild(z.createElement("div"));
	sb.optgroup = sb.option,
	sb.tbody = sb.tfoot = sb.colgroup = sb.caption = sb.thead,
	sb.th = sb.td;
	function vb(a, b) {
		var c,
		d,
		e = 0,
		f = typeof a.getElementsByTagName !== L ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== L ? a.querySelectorAll(b || "*") : void 0;
		if (!f)
			for (f = [], c = a.childNodes || a; null != (d = c[e]); e++)
				!b || n.nodeName(d, b) ? f.push(d) : n.merge(f, vb(d, b));
		return void 0 === b || b && n.nodeName(a, b) ? n.merge([a], f) : f
	}
	function wb(a) {
		X.test(a.type) && (a.defaultChecked = a.checked)
	}
	function xb(a, b) {
		return n.nodeName(a, "table") && n.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
	}
	function yb(a) {
		return a.type = (null !== n.find.attr(a, "type")) + "/" + a.type,
		a
	}
	function zb(a) {
		var b = qb.exec(a.type);
		return b ? a.type = b[1] : a.removeAttribute("type"),
		a
	}
	function Ab(a, b) {
		for (var c, d = 0; null != (c = a[d]); d++)
			n._data(c, "globalEval", !b || n._data(b[d], "globalEval"))
	}
	function Bb(a, b) {
		if (1 === b.nodeType && n.hasData(a)) {
			var c,
			d,
			e,
			f = n._data(a),
			g = n._data(b, f),
			h = f.events;
			if (h) {
				delete g.handle,
				g.events = {};
				for (c in h)
					for (d = 0, e = h[c].length; e > d; d++)
						n.event.add(b, c, h[c][d])
			}
			g.data && (g.data = n.extend({}, g.data))
		}
	}
	function Cb(a, b) {
		var c,
		d,
		e;
		if (1 === b.nodeType) {
			if (c = b.nodeName.toLowerCase(), !l.noCloneEvent && b[n.expando]) {
				e = n._data(b);
				for (d in e.events)
					n.removeEvent(b, d, e.handle);
				b.removeAttribute(n.expando)
			}
			"script" === c && b.text !== a.text ? (yb(b).text = a.text, zb(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), l.html5Clone && a.innerHTML && !n.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && X.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
		}
	}
	n.extend({
		clone : function (a, b, c) {
			var d,
			e,
			f,
			g,
			h,
			i = n.contains(a.ownerDocument, a);
			if (l.html5Clone || n.isXMLDoc(a) || !hb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (ub.innerHTML = a.outerHTML, ub.removeChild(f = ub.firstChild)), !(l.noCloneEvent && l.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || n.isXMLDoc(a)))
				for (d = vb(f), h = vb(a), g = 0; null != (e = h[g]); ++g)
					d[g] && Cb(e, d[g]);
			if (b)
				if (c)
					for (h = h || vb(a), d = d || vb(f), g = 0; null != (e = h[g]); g++)
						Bb(e, d[g]);
				else
					Bb(a, f);
			return d = vb(f, "script"),
			d.length > 0 && Ab(d, !i && vb(a, "script")),
			d = h = e = null,
			f
		},
		buildFragment : function (a, b, c, d) {
			for (var e, f, g, h, i, j, k, m = a.length, o = eb(b), p = [], q = 0; m > q; q++)
				if (f = a[q], f || 0 === f)
					if ("object" === n.type(f))
						n.merge(p, f.nodeType ? [f] : f);
					else if (mb.test(f)) {
						h = h || o.appendChild(b.createElement("div")),
						i = (kb.exec(f) || ["", ""])[1].toLowerCase(),
						k = sb[i] || sb._default,
						h.innerHTML = k[1] + f.replace(jb, "<$1></$2>") + k[2],
						e = k[0];
						while (e--)
							h = h.lastChild;
						if (!l.leadingWhitespace && ib.test(f) && p.push(b.createTextNode(ib.exec(f)[0])), !l.tbody) {
							f = "table" !== i || lb.test(f) ? "<table>" !== k[1] || lb.test(f) ? 0 : h : h.firstChild,
							e = f && f.childNodes.length;
							while (e--)
								n.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j)
						}
						n.merge(p, h.childNodes),
						h.textContent = "";
						while (h.firstChild)
							h.removeChild(h.firstChild);
						h = o.lastChild
					} else
						p.push(b.createTextNode(f));
			h && o.removeChild(h),
			l.appendChecked || n.grep(vb(p, "input"), wb),
			q = 0;
			while (f = p[q++])
				if ((!d || -1 === n.inArray(f, d)) && (g = n.contains(f.ownerDocument, f), h = vb(o.appendChild(f), "script"), g && Ab(h), c)) {
					e = 0;
					while (f = h[e++])
						pb.test(f.type || "") && c.push(f)
				}
			return h = null,
			o
		},
		cleanData : function (a, b) {
			for (var d, e, f, g, h = 0, i = n.expando, j = n.cache, k = l.deleteExpando, m = n.event.special; null != (d = a[h]); h++)
				if ((b || n.acceptData(d)) && (f = d[i], g = f && j[f])) {
					if (g.events)
						for (e in g.events)
							m[e] ? n.event.remove(d, e) : n.removeEvent(d, e, g.handle);
					j[f] && (delete j[f], k ? delete d[i] : typeof d.removeAttribute !== L ? d.removeAttribute(i) : d[i] = null, c.push(f))
				}
		}
	}),
	n.fn.extend({
		text : function (a) {
			return W(this, function (a) {
				return void 0 === a ? n.text(this) : this.empty().append((this[0] && this[0].ownerDocument || z).createTextNode(a))
			}, null, a, arguments.length)
		},
		append : function () {
			return this.domManip(arguments, function (a) {
				if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
					var b = xb(this, a);
					b.appendChild(a)
				}
			})
		},
		prepend : function () {
			return this.domManip(arguments, function (a) {
				if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
					var b = xb(this, a);
					b.insertBefore(a, b.firstChild)
				}
			})
		},
		before : function () {
			return this.domManip(arguments, function (a) {
				this.parentNode && this.parentNode.insertBefore(a, this)
			})
		},
		after : function () {
			return this.domManip(arguments, function (a) {
				this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
			})
		},
		remove : function (a, b) {
			for (var c, d = a ? n.filter(a, this) : this, e = 0; null != (c = d[e]); e++)
				b || 1 !== c.nodeType || n.cleanData(vb(c)), c.parentNode && (b && n.contains(c.ownerDocument, c) && Ab(vb(c, "script")), c.parentNode.removeChild(c));
			return this
		},
		empty : function () {
			for (var a, b = 0; null != (a = this[b]); b++) {
				1 === a.nodeType && n.cleanData(vb(a, !1));
				while (a.firstChild)
					a.removeChild(a.firstChild);
				a.options && n.nodeName(a, "select") && (a.options.length = 0)
			}
			return this
		},
		clone : function (a, b) {
			return a = null == a ? !1 : a,
			b = null == b ? a : b,
			this.map(function () {
				return n.clone(this, a, b)
			})
		},
		html : function (a) {
			return W(this, function (a) {
				var b = this[0] || {},
				c = 0,
				d = this.length;
				if (void 0 === a)
					return 1 === b.nodeType ? b.innerHTML.replace(gb, "") : void 0;
				if (!("string" != typeof a || nb.test(a) || !l.htmlSerialize && hb.test(a) || !l.leadingWhitespace && ib.test(a) || sb[(kb.exec(a) || ["", ""])[1].toLowerCase()])) {
					a = a.replace(jb, "<$1></$2>");
					try {
						for (; d > c; c++)
							b = this[c] || {},
						1 === b.nodeType && (n.cleanData(vb(b, !1)), b.innerHTML = a);
						b = 0
					} catch (e) {}

				}
				b && this.empty().append(a)
			}, null, a, arguments.length)
		},
		replaceWith : function () {
			var a = arguments[0];
			return this.domManip(arguments, function (b) {
				a = this.parentNode,
				n.cleanData(vb(this)),
				a && a.replaceChild(b, this)
			}),
			a && (a.length || a.nodeType) ? this : this.remove()
		},
		detach : function (a) {
			return this.remove(a, !0)
		},
		domManip : function (a, b) {
			a = e.apply([], a);
			var c,
			d,
			f,
			g,
			h,
			i,
			j = 0,
			k = this.length,
			m = this,
			o = k - 1,
			p = a[0],
			q = n.isFunction(p);
			if (q || k > 1 && "string" == typeof p && !l.checkClone && ob.test(p))
				return this.each(function (c) {
					var d = m.eq(c);
					q && (a[0] = p.call(this, c, d.html())),
					d.domManip(a, b)
				});
			if (k && (i = n.buildFragment(a, this[0].ownerDocument, !1, this), c = i.firstChild, 1 === i.childNodes.length && (i = c), c)) {
				for (g = n.map(vb(i, "script"), yb), f = g.length; k > j; j++)
					d = i, j !== o && (d = n.clone(d, !0, !0), f && n.merge(g, vb(d, "script"))), b.call(this[j], d, j);
				if (f)
					for (h = g[g.length - 1].ownerDocument, n.map(g, zb), j = 0; f > j; j++)
						d = g[j], pb.test(d.type || "") && !n._data(d, "globalEval") && n.contains(h, d) && (d.src ? n._evalUrl && n._evalUrl(d.src) : n.globalEval((d.text || d.textContent || d.innerHTML || "").replace(rb, "")));
				i = c = null
			}
			return this
		}
	}),
	n.each({
		appendTo : "append",
		prependTo : "prepend",
		insertBefore : "before",
		insertAfter : "after",
		replaceAll : "replaceWith"
	}, function (a, b) {
		n.fn[a] = function (a) {
			for (var c, d = 0, e = [], g = n(a), h = g.length - 1; h >= d; d++)
				c = d === h ? this : this.clone(!0), n(g[d])[b](c), f.apply(e, c.get());
			return this.pushStack(e)
		}
	});
	var Db,
	Eb = {};
	function Fb(b, c) {
		var d = n(c.createElement(b)).appendTo(c.body),
		e = a.getDefaultComputedStyle ? a.getDefaultComputedStyle(d[0]).display : n.css(d[0], "display");
		return d.detach(),
		e
	}
	function Gb(a) {
		var b = z,
		c = Eb[a];
		return c || (c = Fb(a, b), "none" !== c && c || (Db = (Db || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = (Db[0].contentWindow || Db[0].contentDocument).document, b.write(), b.close(), c = Fb(a, b), Db.detach()), Eb[a] = c),
		c
	}
	!function () {
		var a,
		b,
		c = z.createElement("div"),
		d = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
		c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
		a = c.getElementsByTagName("a")[0],
		a.style.cssText = "float:left;opacity:.5",
		l.opacity = /^0.5/.test(a.style.opacity),
		l.cssFloat = !!a.style.cssFloat,
		c.style.backgroundClip = "content-box",
		c.cloneNode(!0).style.backgroundClip = "",
		l.clearCloneStyle = "content-box" === c.style.backgroundClip,
		a = c = null,
		l.shrinkWrapBlocks = function () {
			var a,
			c,
			e,
			f;
			if (null == b) {
				if (a = z.getElementsByTagName("body")[0], !a)
					return;
				f = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px",
				c = z.createElement("div"),
				e = z.createElement("div"),
				a.appendChild(c).appendChild(e),
				b = !1,
				typeof e.style.zoom !== L && (e.style.cssText = d + ";width:1px;padding:1px;zoom:1", e.innerHTML = "<div></div>", e.firstChild.style.width = "5px", b = 3 !== e.offsetWidth),
				a.removeChild(c),
				a = c = e = null
			}
			return b
		}
	}
	();
	var Hb = /^margin/,
	Ib = new RegExp("^(" + T + ")(?!px)[a-z%]+$", "i"),
	Jb,
	Kb,
	Lb = /^(top|right|bottom|left)$/;
	a.getComputedStyle ? (Jb = function (a) {
		return a.ownerDocument.defaultView.getComputedStyle(a, null)
	}, Kb = function (a, b, c) {
		var d,
		e,
		f,
		g,
		h = a.style;
		return c = c || Jb(a),
		g = c ? c.getPropertyValue(b) || c[b] : void 0,
		c && ("" !== g || n.contains(a.ownerDocument, a) || (g = n.style(a, b)), Ib.test(g) && Hb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)),
		void 0 === g ? g : g + ""
	}) : z.documentElement.currentStyle && (Jb = function (a) {
		return a.currentStyle
	}, Kb = function (a, b, c) {
		var d,
		e,
		f,
		g,
		h = a.style;
		return c = c || Jb(a),
		g = c ? c[b] : void 0,
		null == g && h && h[b] && (g = h[b]),
		Ib.test(g) && !Lb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)),
		void 0 === g ? g : g + "" || "auto"
	});
	function Mb(a, b) {
		return {
			get : function () {
				var c = a();
				if (null != c)
					return c ? void delete this.get : (this.get = b).apply(this, arguments)
			}
		}
	}
	!function () {
		var b,
		c,
		d,
		e,
		f,
		g,
		h = z.createElement("div"),
		i = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px",
		j = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
		h.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
		b = h.getElementsByTagName("a")[0],
		b.style.cssText = "float:left;opacity:.5",
		l.opacity = /^0.5/.test(b.style.opacity),
		l.cssFloat = !!b.style.cssFloat,
		h.style.backgroundClip = "content-box",
		h.cloneNode(!0).style.backgroundClip = "",
		l.clearCloneStyle = "content-box" === h.style.backgroundClip,
		b = h = null,
		n.extend(l, {
			reliableHiddenOffsets : function () {
				if (null != c)
					return c;
				var a,
				b,
				d,
				e = z.createElement("div"),
				f = z.getElementsByTagName("body")[0];
				if (f)
					return e.setAttribute("className", "t"), e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", a = z.createElement("div"), a.style.cssText = i, f.appendChild(a).appendChild(e), e.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", b = e.getElementsByTagName("td"), b[0].style.cssText = "padding:0;margin:0;border:0;display:none", d = 0 === b[0].offsetHeight, b[0].style.display = "", b[1].style.display = "none", c = d && 0 === b[0].offsetHeight, f.removeChild(a), e = f = null, c
			},
			boxSizing : function () {
				return null == d && k(),
				d
			},
			boxSizingReliable : function () {
				return null == e && k(),
				e
			},
			pixelPosition : function () {
				return null == f && k(),
				f
			},
			reliableMarginRight : function () {
				var b,
				c,
				d,
				e;
				if (null == g && a.getComputedStyle) {
					if (b = z.getElementsByTagName("body")[0], !b)
						return;
					c = z.createElement("div"),
					d = z.createElement("div"),
					c.style.cssText = i,
					b.appendChild(c).appendChild(d),
					e = d.appendChild(z.createElement("div")),
					e.style.cssText = d.style.cssText = j,
					e.style.marginRight = e.style.width = "0",
					d.style.width = "1px",
					g = !parseFloat((a.getComputedStyle(e, null) || {}).marginRight),
					b.removeChild(c)
				}
				return g
			}
		});
		function k() {
			var b,
			c,
			h = z.getElementsByTagName("body")[0];
			h && (b = z.createElement("div"), c = z.createElement("div"), b.style.cssText = i, h.appendChild(b).appendChild(c), c.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%", n.swap(h, null != h.style.zoom ? {
					zoom : 1
				}
					 : {}, function () {
					d = 4 === c.offsetWidth
				}), e = !0, f = !1, g = !0, a.getComputedStyle && (f = "1%" !== (a.getComputedStyle(c, null) || {}).top, e = "4px" === (a.getComputedStyle(c, null) || {
							width : "4px"
						}).width), h.removeChild(b), c = h = null)
		}
	}
	(),
	n.swap = function (a, b, c, d) {
		var e,
		f,
		g = {};
		for (f in b)
			g[f] = a.style[f], a.style[f] = b[f];
		e = c.apply(a, d || []);
		for (f in b)
			a.style[f] = g[f];
		return e
	};
	var Nb = /alpha\([^)]*\)/i,
	Ob = /opacity\s*=\s*([^)]*)/,
	Pb = /^(none|table(?!-c[ea]).+)/,
	Qb = new RegExp("^(" + T + ")(.*)$", "i"),
	Rb = new RegExp("^([+-])=(" + T + ")", "i"),
	Sb = {
		position : "absolute",
		visibility : "hidden",
		display : "block"
	},
	Tb = {
		letterSpacing : 0,
		fontWeight : 400
	},
	Ub = ["Webkit", "O", "Moz", "ms"];
	function Vb(a, b) {
		if (b in a)
			return b;
		var c = b.charAt(0).toUpperCase() + b.slice(1),
		d = b,
		e = Ub.length;
		while (e--)
			if (b = Ub[e] + c, b in a)
				return b;
		return d
	}
	function Wb(a, b) {
		for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)
			d = a[g], d.style && (f[g] = n._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && V(d) && (f[g] = n._data(d, "olddisplay", Gb(d.nodeName)))) : f[g] || (e = V(d), (c && "none" !== c || !e) && n._data(d, "olddisplay", e ? c : n.css(d, "display"))));
		for (g = 0; h > g; g++)
			d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
		return a
	}
	function Xb(a, b, c) {
		var d = Qb.exec(b);
		return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
	}
	function Yb(a, b, c, d, e) {
		for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)
			"margin" === c && (g += n.css(a, c + U[f], !0, e)), d ? ("content" === c && (g -= n.css(a, "padding" + U[f], !0, e)), "margin" !== c && (g -= n.css(a, "border" + U[f] + "Width", !0, e))) : (g += n.css(a, "padding" + U[f], !0, e), "padding" !== c && (g += n.css(a, "border" + U[f] + "Width", !0, e)));
		return g
	}
	function Zb(a, b, c) {
		var d = !0,
		e = "width" === b ? a.offsetWidth : a.offsetHeight,
		f = Jb(a),
		g = l.boxSizing() && "border-box" === n.css(a, "boxSizing", !1, f);
		if (0 >= e || null == e) {
			if (e = Kb(a, b, f), (0 > e || null == e) && (e = a.style[b]), Ib.test(e))
				return e;
			d = g && (l.boxSizingReliable() || e === a.style[b]),
			e = parseFloat(e) || 0
		}
		return e + Yb(a, b, c || (g ? "border" : "content"), d, f) + "px"
	}
	n.extend({
		cssHooks : {
			opacity : {
				get : function (a, b) {
					if (b) {
						var c = Kb(a, "opacity");
						return "" === c ? "1" : c
					}
				}
			}
		},
		cssNumber : {
			columnCount : !0,
			fillOpacity : !0,
			fontWeight : !0,
			lineHeight : !0,
			opacity : !0,
			order : !0,
			orphans : !0,
			widows : !0,
			zIndex : !0,
			zoom : !0
		},
		cssProps : {
			"float" : l.cssFloat ? "cssFloat" : "styleFloat"
		},
		style : function (a, b, c, d) {
			if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
				var e,
				f,
				g,
				h = n.camelCase(b),
				i = a.style;
				if (b = n.cssProps[h] || (n.cssProps[h] = Vb(i, h)), g = n.cssHooks[b] || n.cssHooks[h], void 0 === c)
					return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
				if (f = typeof c, "string" === f && (e = Rb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(n.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || n.cssNumber[h] || (c += "px"), l.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set" in g && void 0 === (c = g.set(a, c, d)))))
					try {
						i[b] = "",
						i[b] = c
					} catch (j) {}

			}
		},
		css : function (a, b, c, d) {
			var e,
			f,
			g,
			h = n.camelCase(b);
			return b = n.cssProps[h] || (n.cssProps[h] = Vb(a.style, h)),
			g = n.cssHooks[b] || n.cssHooks[h],
			g && "get" in g && (f = g.get(a, !0, c)),
			void 0 === f && (f = Kb(a, b, d)),
			"normal" === f && b in Tb && (f = Tb[b]),
			"" === c || c ? (e = parseFloat(f), c === !0 || n.isNumeric(e) ? e || 0 : f) : f
		}
	}),
	n.each(["height", "width"], function (a, b) {
		n.cssHooks[b] = {
			get : function (a, c, d) {
				return c ? 0 === a.offsetWidth && Pb.test(n.css(a, "display")) ? n.swap(a, Sb, function () {
					return Zb(a, b, d)
				}) : Zb(a, b, d) : void 0
			},
			set : function (a, c, d) {
				var e = d && Jb(a);
				return Xb(a, c, d ? Yb(a, b, d, l.boxSizing() && "border-box" === n.css(a, "boxSizing", !1, e), e) : 0)
			}
		}
	}),
	l.opacity || (n.cssHooks.opacity = {
			get : function (a, b) {
				return Ob.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
			},
			set : function (a, b) {
				var c = a.style,
				d = a.currentStyle,
				e = n.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
				f = d && d.filter || c.filter || "";
				c.zoom = 1,
				(b >= 1 || "" === b) && "" === n.trim(f.replace(Nb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = Nb.test(f) ? f.replace(Nb, e) : f + " " + e)
			}
		}),
	n.cssHooks.marginRight = Mb(l.reliableMarginRight, function (a, b) {
			return b ? n.swap(a, {
				display : "inline-block"
			}, Kb, [a, "marginRight"]) : void 0
		}),
	n.each({
		margin : "",
		padding : "",
		border : "Width"
	}, function (a, b) {
		n.cssHooks[a + b] = {
			expand : function (c) {
				for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++)
					e[a + U[d] + b] = f[d] || f[d - 2] || f[0];
				return e
			}
		},
		Hb.test(a) || (n.cssHooks[a + b].set = Xb)
	}),
	n.fn.extend({
		css : function (a, b) {
			return W(this, function (a, b, c) {
				var d,
				e,
				f = {},
				g = 0;
				if (n.isArray(b)) {
					for (d = Jb(a), e = b.length; e > g; g++)
						f[b[g]] = n.css(a, b[g], !1, d);
					return f
				}
				return void 0 !== c ? n.style(a, b, c) : n.css(a, b)
			}, a, b, arguments.length > 1)
		},
		show : function () {
			return Wb(this, !0)
		},
		hide : function () {
			return Wb(this)
		},
		toggle : function (a) {
			return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
				V(this) ? n(this).show() : n(this).hide()
			})
		}
	});
	function $b(a, b, c, d, e) {
		return new $b.prototype.init(a, b, c, d, e)
	}
	n.Tween = $b,
	$b.prototype = {
		constructor : $b,
		init : function (a, b, c, d, e, f) {
			this.elem = a,
			this.prop = c,
			this.easing = e || "swing",
			this.options = b,
			this.start = this.now = this.cur(),
			this.end = d,
			this.unit = f || (n.cssNumber[c] ? "" : "px")
		},
		cur : function () {
			var a = $b.propHooks[this.prop];
			return a && a.get ? a.get(this) : $b.propHooks._default.get(this)
		},
		run : function (a) {
			var b,
			c = $b.propHooks[this.prop];
			return this.pos = b = this.options.duration ? n.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a,
			this.now = (this.end - this.start) * b + this.start,
			this.options.step && this.options.step.call(this.elem, this.now, this),
			c && c.set ? c.set(this) : $b.propHooks._default.set(this),
			this
		}
	},
	$b.prototype.init.prototype = $b.prototype,
	$b.propHooks = {
		_default : {
			get : function (a) {
				var b;
				return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = n.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
			},
			set : function (a) {
				n.fx.step[a.prop] ? n.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[n.cssProps[a.prop]] || n.cssHooks[a.prop]) ? n.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
			}
		}
	},
	$b.propHooks.scrollTop = $b.propHooks.scrollLeft = {
		set : function (a) {
			a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
		}
	},
	n.easing = {
		linear : function (a) {
			return a
		},
		swing : function (a) {
			return .5 - Math.cos(a * Math.PI) / 2
		}
	},
	n.fx = $b.prototype.init,
	n.fx.step = {};
	var _b,
	ac,
	bc = /^(?:toggle|show|hide)$/,
	cc = new RegExp("^(?:([+-])=|)(" + T + ")([a-z%]*)$", "i"),
	dc = /queueHooks$/,
	ec = [jc],
	fc = {
		"*" : [function (a, b) {
				var c = this.createTween(a, b),
				d = c.cur(),
				e = cc.exec(b),
				f = e && e[3] || (n.cssNumber[a] ? "" : "px"),
				g = (n.cssNumber[a] || "px" !== f && +d) && cc.exec(n.css(c.elem, a)),
				h = 1,
				i = 20;
				if (g && g[3] !== f) {
					f = f || g[3],
					e = e || [],
					g = +d || 1;
					do
						h = h || ".5", g /= h, n.style(c.elem, a, g + f);
					while (h !== (h = c.cur() / d) && 1 !== h && --i)
				}
				return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]),
				c
			}
		]
	};
	function gc() {
		return setTimeout(function () {
			_b = void 0
		}),
		_b = n.now()
	}
	function hc(a, b) {
		var c,
		d = {
			height : a
		},
		e = 0;
		for (b = b ? 1 : 0; 4 > e; e += 2 - b)
			c = U[e], d["margin" + c] = d["padding" + c] = a;
		return b && (d.opacity = d.width = a),
		d
	}
	function ic(a, b, c) {
		for (var d, e = (fc[b] || []).concat(fc["*"]), f = 0, g = e.length; g > f; f++)
			if (d = e[f].call(c, b, a))
				return d
	}
	function jc(a, b, c) {
		var d,
		e,
		f,
		g,
		h,
		i,
		j,
		k,
		m = this,
		o = {},
		p = a.style,
		q = a.nodeType && V(a),
		r = n._data(a, "fxshow");
		c.queue || (h = n._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function () {
				h.unqueued || i()
			}), h.unqueued++, m.always(function () {
				m.always(function () {
					h.unqueued--,
					n.queue(a, "fx").length || h.empty.fire()
				})
			})),
		1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [p.overflow, p.overflowX, p.overflowY], j = n.css(a, "display"), k = Gb(a.nodeName), "none" === j && (j = k), "inline" === j && "none" === n.css(a, "float") && (l.inlineBlockNeedsLayout && "inline" !== k ? p.zoom = 1 : p.display = "inline-block")),
		c.overflow && (p.overflow = "hidden", l.shrinkWrapBlocks() || m.always(function () {
				p.overflow = c.overflow[0],
				p.overflowX = c.overflow[1],
				p.overflowY = c.overflow[2]
			}));
		for (d in b)
			if (e = b[d], bc.exec(e)) {
				if (delete b[d], f = f || "toggle" === e, e === (q ? "hide" : "show")) {
					if ("show" !== e || !r || void 0 === r[d])
						continue;
					q = !0
				}
				o[d] = r && r[d] || n.style(a, d)
			}
		if (!n.isEmptyObject(o)) {
			r ? "hidden" in r && (q = r.hidden) : r = n._data(a, "fxshow", {}),
			f && (r.hidden = !q),
			q ? n(a).show() : m.done(function () {
				n(a).hide()
			}),
			m.done(function () {
				var b;
				n._removeData(a, "fxshow");
				for (b in o)
					n.style(a, b, o[b])
			});
			for (d in o)
				g = ic(q ? r[d] : 0, d, m), d in r || (r[d] = g.start, q && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
		}
	}
	function kc(a, b) {
		var c,
		d,
		e,
		f,
		g;
		for (c in a)
			if (d = n.camelCase(c), e = b[d], f = a[c], n.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = n.cssHooks[d], g && "expand" in g) {
				f = g.expand(f),
				delete a[d];
				for (c in f)
					c in a || (a[c] = f[c], b[c] = e)
			} else
				b[d] = e
	}
	function lc(a, b, c) {
		var d,
		e,
		f = 0,
		g = ec.length,
		h = n.Deferred().always(function () {
				delete i.elem
			}),
		i = function () {
			if (e)
				return !1;
			for (var b = _b || gc(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++)
				j.tweens[g].run(f);
			return h.notifyWith(a, [j, f, c]),
			1 > f && i ? c : (h.resolveWith(a, [j]), !1)
		},
		j = h.promise({
				elem : a,
				props : n.extend({}, b),
				opts : n.extend(!0, {
					specialEasing : {}

				}, c),
				originalProperties : b,
				originalOptions : c,
				startTime : _b || gc(),
				duration : c.duration,
				tweens : [],
				createTween : function (b, c) {
					var d = n.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
					return j.tweens.push(d),
					d
				},
				stop : function (b) {
					var c = 0,
					d = b ? j.tweens.length : 0;
					if (e)
						return this;
					for (e = !0; d > c; c++)
						j.tweens[c].run(1);
					return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]),
					this
				}
			}),
		k = j.props;
		for (kc(k, j.opts.specialEasing); g > f; f++)
			if (d = ec[f].call(j, a, k, j.opts))
				return d;
		return n.map(k, ic, j),
		n.isFunction(j.opts.start) && j.opts.start.call(a, j),
		n.fx.timer(n.extend(i, {
				elem : a,
				anim : j,
				queue : j.opts.queue
			})),
		j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
	}
	n.Animation = n.extend(lc, {
			tweener : function (a, b) {
				n.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
				for (var c, d = 0, e = a.length; e > d; d++)
					c = a[d], fc[c] = fc[c] || [], fc[c].unshift(b)
			},
			prefilter : function (a, b) {
				b ? ec.unshift(a) : ec.push(a)
			}
		}),
	n.speed = function (a, b, c) {
		var d = a && "object" == typeof a ? n.extend({}, a) : {
			complete : c || !c && b || n.isFunction(a) && a,
			duration : a,
			easing : c && b || b && !n.isFunction(b) && b
		};
		return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in n.fx.speeds ? n.fx.speeds[d.duration] : n.fx.speeds._default,
		(null == d.queue || d.queue === !0) && (d.queue = "fx"),
		d.old = d.complete,
		d.complete = function () {
			n.isFunction(d.old) && d.old.call(this),
			d.queue && n.dequeue(this, d.queue)
		},
		d
	},
	n.fn.extend({
		fadeTo : function (a, b, c, d) {
			return this.filter(V).css("opacity", 0).show().end().animate({
				opacity : b
			}, a, c, d)
		},
		animate : function (a, b, c, d) {
			var e = n.isEmptyObject(a),
			f = n.speed(b, c, d),
			g = function () {
				var b = lc(this, n.extend({}, a), f);
				(e || n._data(this, "finish")) && b.stop(!0)
			};
			return g.finish = g,
			e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
		},
		stop : function (a, b, c) {
			var d = function (a) {
				var b = a.stop;
				delete a.stop,
				b(c)
			};
			return "string" != typeof a && (c = b, b = a, a = void 0),
			b && a !== !1 && this.queue(a || "fx", []),
			this.each(function () {
				var b = !0,
				e = null != a && a + "queueHooks",
				f = n.timers,
				g = n._data(this);
				if (e)
					g[e] && g[e].stop && d(g[e]);
				else
					for (e in g)
						g[e] && g[e].stop && dc.test(e) && d(g[e]);
				for (e = f.length; e--; )
					f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
				(b || !c) && n.dequeue(this, a)
			})
		},
		finish : function (a) {
			return a !== !1 && (a = a || "fx"),
			this.each(function () {
				var b,
				c = n._data(this),
				d = c[a + "queue"],
				e = c[a + "queueHooks"],
				f = n.timers,
				g = d ? d.length : 0;
				for (c.finish = !0, n.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--; )
					f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
				for (b = 0; g > b; b++)
					d[b] && d[b].finish && d[b].finish.call(this);
				delete c.finish
			})
		}
	}),
	n.each(["toggle", "show", "hide"], function (a, b) {
		var c = n.fn[b];
		n.fn[b] = function (a, d, e) {
			return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(hc(b, !0), a, d, e)
		}
	}),
	n.each({
		slideDown : hc("show"),
		slideUp : hc("hide"),
		slideToggle : hc("toggle"),
		fadeIn : {
			opacity : "show"
		},
		fadeOut : {
			opacity : "hide"
		},
		fadeToggle : {
			opacity : "toggle"
		}
	}, function (a, b) {
		n.fn[a] = function (a, c, d) {
			return this.animate(b, a, c, d)
		}
	}),
	n.timers = [],
	n.fx.tick = function () {
		var a,
		b = n.timers,
		c = 0;
		for (_b = n.now(); c < b.length; c++)
			a = b[c], a() || b[c] !== a || b.splice(c--, 1);
		b.length || n.fx.stop(),
		_b = void 0
	},
	n.fx.timer = function (a) {
		n.timers.push(a),
		a() ? n.fx.start() : n.timers.pop()
	},
	n.fx.interval = 13,
	n.fx.start = function () {
		ac || (ac = setInterval(n.fx.tick, n.fx.interval))
	},
	n.fx.stop = function () {
		clearInterval(ac),
		ac = null
	},
	n.fx.speeds = {
		slow : 600,
		fast : 200,
		_default : 400
	},
	n.fn.delay = function (a, b) {
		return a = n.fx ? n.fx.speeds[a] || a : a,
		b = b || "fx",
		this.queue(b, function (b, c) {
			var d = setTimeout(b, a);
			c.stop = function () {
				clearTimeout(d)
			}
		})
	},
	function () {
		var a,
		b,
		c,
		d,
		e = z.createElement("div");
		e.setAttribute("className", "t"),
		e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
		a = e.getElementsByTagName("a")[0],
		c = z.createElement("select"),
		d = c.appendChild(z.createElement("option")),
		b = e.getElementsByTagName("input")[0],
		a.style.cssText = "top:1px",
		l.getSetAttribute = "t" !== e.className,
		l.style = /top/.test(a.getAttribute("style")),
		l.hrefNormalized = "/a" === a.getAttribute("href"),
		l.checkOn = !!b.value,
		l.optSelected = d.selected,
		l.enctype = !!z.createElement("form").enctype,
		c.disabled = !0,
		l.optDisabled = !d.disabled,
		b = z.createElement("input"),
		b.setAttribute("value", ""),
		l.input = "" === b.getAttribute("value"),
		b.value = "t",
		b.setAttribute("type", "radio"),
		l.radioValue = "t" === b.value,
		a = b = c = d = e = null
	}
	();
	var mc = /\r/g;
	n.fn.extend({
		val : function (a) {
			var b,
			c,
			d,
			e = this[0]; {
				if (arguments.length)
					return d = n.isFunction(a), this.each(function (c) {
						var e;
						1 === this.nodeType && (e = d ? a.call(this, c, n(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : n.isArray(e) && (e = n.map(e, function (a) {
											return null == a ? "" : a + ""
										})), b = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
					});
				if (e)
					return b = n.valHooks[e.type] || n.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(mc, "") : null == c ? "" : c)
			}
		}
	}),
	n.extend({
		valHooks : {
			option : {
				get : function (a) {
					var b = n.find.attr(a, "value");
					return null != b ? b : n.text(a)
				}
			},
			select : {
				get : function (a) {
					for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
						if (c = d[i], !(!c.selected && i !== e || (l.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && n.nodeName(c.parentNode, "optgroup"))) {
							if (b = n(c).val(), f)
								return b;
							g.push(b)
						}
					return g
				},
				set : function (a, b) {
					var c,
					d,
					e = a.options,
					f = n.makeArray(b),
					g = e.length;
					while (g--)
						if (d = e[g], n.inArray(n.valHooks.option.get(d), f) >= 0)
							try {
								d.selected = c = !0
							} catch (h) {
								d.scrollHeight
							}
						else
							d.selected = !1;
					return c || (a.selectedIndex = -1),
					e
				}
			}
		}
	}),
	n.each(["radio", "checkbox"], function () {
		n.valHooks[this] = {
			set : function (a, b) {
				return n.isArray(b) ? a.checked = n.inArray(n(a).val(), b) >= 0 : void 0
			}
		},
		l.checkOn || (n.valHooks[this].get = function (a) {
			return null === a.getAttribute("value") ? "on" : a.value
		})
	});
	var nc,
	oc,
	pc = n.expr.attrHandle,
	qc = /^(?:checked|selected)$/i,
	rc = l.getSetAttribute,
	sc = l.input;
	n.fn.extend({
		attr : function (a, b) {
			return W(this, n.attr, a, b, arguments.length > 1)
		},
		removeAttr : function (a) {
			return this.each(function () {
				n.removeAttr(this, a)
			})
		}
	}),
	n.extend({
		attr : function (a, b, c) {
			var d,
			e,
			f = a.nodeType;
			if (a && 3 !== f && 8 !== f && 2 !== f)
				return typeof a.getAttribute === L ? n.prop(a, b, c) : (1 === f && n.isXMLDoc(a) || (b = b.toLowerCase(), d = n.attrHooks[b] || (n.expr.match.bool.test(b) ? oc : nc)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = n.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void n.removeAttr(a, b))
		},
		removeAttr : function (a, b) {
			var c,
			d,
			e = 0,
			f = b && b.match(F);
			if (f && 1 === a.nodeType)
				while (c = f[e++])
					d = n.propFix[c] || c, n.expr.match.bool.test(c) ? sc && rc || !qc.test(c) ? a[d] = !1 : a[n.camelCase("default-" + c)] = a[d] = !1 : n.attr(a, c, ""), a.removeAttribute(rc ? c : d)
		},
		attrHooks : {
			type : {
				set : function (a, b) {
					if (!l.radioValue && "radio" === b && n.nodeName(a, "input")) {
						var c = a.value;
						return a.setAttribute("type", b),
						c && (a.value = c),
						b
					}
				}
			}
		}
	}),
	oc = {
		set : function (a, b, c) {
			return b === !1 ? n.removeAttr(a, c) : sc && rc || !qc.test(c) ? a.setAttribute(!rc && n.propFix[c] || c, c) : a[n.camelCase("default-" + c)] = a[c] = !0,
			c
		}
	},
	n.each(n.expr.match.bool.source.match(/\w+/g), function (a, b) {
		var c = pc[b] || n.find.attr;
		pc[b] = sc && rc || !qc.test(b) ? function (a, b, d) {
			var e,
			f;
			return d || (f = pc[b], pc[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, pc[b] = f),
			e
		}
		 : function (a, b, c) {
			return c ? void 0 : a[n.camelCase("default-" + b)] ? b.toLowerCase() : null
		}
	}),
	sc && rc || (n.attrHooks.value = {
			set : function (a, b, c) {
				return n.nodeName(a, "input") ? void(a.defaultValue = b) : nc && nc.set(a, b, c)
			}
		}),
	rc || (nc = {
			set : function (a, b, c) {
				var d = a.getAttributeNode(c);
				return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)),
				d.value = b += "",
				"value" === c || b === a.getAttribute(c) ? b : void 0
			}
		}, pc.id = pc.name = pc.coords = function (a, b, c) {
		var d;
		return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
	}, n.valHooks.button = {
			get : function (a, b) {
				var c = a.getAttributeNode(b);
				return c && c.specified ? c.value : void 0
			},
			set : nc.set
		}, n.attrHooks.contenteditable = {
			set : function (a, b, c) {
				nc.set(a, "" === b ? !1 : b, c)
			}
		}, n.each(["width", "height"], function (a, b) {
			n.attrHooks[b] = {
				set : function (a, c) {
					return "" === c ? (a.setAttribute(b, "auto"), c) : void 0
				}
			}
		})),
	l.style || (n.attrHooks.style = {
			get : function (a) {
				return a.style.cssText || void 0
			},
			set : function (a, b) {
				return a.style.cssText = b + ""
			}
		});
	var tc = /^(?:input|select|textarea|button|object)$/i,
	uc = /^(?:a|area)$/i;
	n.fn.extend({
		prop : function (a, b) {
			return W(this, n.prop, a, b, arguments.length > 1)
		},
		removeProp : function (a) {
			return a = n.propFix[a] || a,
			this.each(function () {
				try {
					this[a] = void 0,
					delete this[a]
				} catch (b) {}

			})
		}
	}),
	n.extend({
		propFix : {
			"for" : "htmlFor",
			"class" : "className"
		},
		prop : function (a, b, c) {
			var d,
			e,
			f,
			g = a.nodeType;
			if (a && 3 !== g && 8 !== g && 2 !== g)
				return f = 1 !== g || !n.isXMLDoc(a), f && (b = n.propFix[b] || b, e = n.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
		},
		propHooks : {
			tabIndex : {
				get : function (a) {
					var b = n.find.attr(a, "tabindex");
					return b ? parseInt(b, 10) : tc.test(a.nodeName) || uc.test(a.nodeName) && a.href ? 0 : -1
				}
			}
		}
	}),
	l.hrefNormalized || n.each(["href", "src"], function (a, b) {
		n.propHooks[b] = {
			get : function (a) {
				return a.getAttribute(b, 4)
			}
		}
	}),
	l.optSelected || (n.propHooks.selected = {
			get : function (a) {
				var b = a.parentNode;
				return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex),
				null
			}
		}),
	n.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
		n.propFix[this.toLowerCase()] = this
	}),
	l.enctype || (n.propFix.enctype = "encoding");
	var vc = /[\t\r\n\f]/g;
	n.fn.extend({
		addClass : function (a) {
			var b,
			c,
			d,
			e,
			f,
			g,
			h = 0,
			i = this.length,
			j = "string" == typeof a && a;
			if (n.isFunction(a))
				return this.each(function (b) {
					n(this).addClass(a.call(this, b, this.className))
				});
			if (j)
				for (b = (a || "").match(F) || []; i > h; h++)
					if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vc, " ") : " ")) {
						f = 0;
						while (e = b[f++])
							d.indexOf(" " + e + " ") < 0 && (d += e + " ");
						g = n.trim(d),
						c.className !== g && (c.className = g)
					}
			return this
		},
		removeClass : function (a) {
			var b,
			c,
			d,
			e,
			f,
			g,
			h = 0,
			i = this.length,
			j = 0 === arguments.length || "string" == typeof a && a;
			if (n.isFunction(a))
				return this.each(function (b) {
					n(this).removeClass(a.call(this, b, this.className))
				});
			if (j)
				for (b = (a || "").match(F) || []; i > h; h++)
					if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vc, " ") : "")) {
						f = 0;
						while (e = b[f++])
							while (d.indexOf(" " + e + " ") >= 0)
								d = d.replace(" " + e + " ", " ");
						g = a ? n.trim(d) : "",
						c.className !== g && (c.className = g)
					}
			return this
		},
		toggleClass : function (a, b) {
			var c = typeof a;
			return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(n.isFunction(a) ? function (c) {
				n(this).toggleClass(a.call(this, c, this.className, b), b)
			}
				 : function () {
				if ("string" === c) {
					var b,
					d = 0,
					e = n(this),
					f = a.match(F) || [];
					while (b = f[d++])
						e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
				} else (c === L || "boolean" === c) && (this.className && n._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : n._data(this, "__className__") || "")
			})
		},
		hasClass : function (a) {
			for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
				if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(vc, " ").indexOf(b) >= 0)
					return !0;
			return !1
		}
	}),
	n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
		n.fn[b] = function (a, c) {
			return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
		}
	}),
	n.fn.extend({
		hover : function (a, b) {
			return this.mouseenter(a).mouseleave(b || a)
		},
		bind : function (a, b, c) {
			return this.on(a, null, b, c)
		},
		unbind : function (a, b) {
			return this.off(a, null, b)
		},
		delegate : function (a, b, c, d) {
			return this.on(b, a, c, d)
		},
		undelegate : function (a, b, c) {
			return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
		}
	});
	var wc = n.now(),
	xc = /\?/,
	yc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
	n.parseJSON = function (b) {
		if (a.JSON && a.JSON.parse)
			return a.JSON.parse(b + "");
		var c,
		d = null,
		e = n.trim(b + "");
		return e && !n.trim(e.replace(yc, function (a, b, e, f) {
				return c && b && (d = 0),
				0 === d ? a : (c = e || b, d += !f - !e, "")
			})) ? Function("return " + e)() : n.error("Invalid JSON: " + b)
	},
	n.parseXML = function (b) {
		var c,
		d;
		if (!b || "string" != typeof b)
			return null;
		try {
			a.DOMParser ? (d = new DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b))
		} catch (e) {
			c = void 0
		}
		return c && c.documentElement && !c.getElementsByTagName("parsererror").length || n.error("Invalid XML: " + b),
		c
	};
	var zc,
	Ac,
	Bc = /#.*$/,
	Cc = /([?&])_=[^&]*/,
	Dc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
	Ec = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	Fc = /^(?:GET|HEAD)$/,
	Gc = /^\/\//,
	Hc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
	Ic = {},
	Jc = {},
	Kc = "*/".concat("*");
	try {
		Ac = location.href
	} catch (Lc) {
		Ac = z.createElement("a"),
		Ac.href = "",
		Ac = Ac.href
	}
	zc = Hc.exec(Ac.toLowerCase()) || [];
	function Mc(a) {
		return function (b, c) {
			"string" != typeof b && (c = b, b = "*");
			var d,
			e = 0,
			f = b.toLowerCase().match(F) || [];
			if (n.isFunction(c))
				while (d = f[e++])
					"+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
		}
	}
	function Nc(a, b, c, d) {
		var e = {},
		f = a === Jc;
		function g(h) {
			var i;
			return e[h] = !0,
			n.each(a[h] || [], function (a, h) {
				var j = h(b, c, d);
				return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1)
			}),
			i
		}
		return g(b.dataTypes[0]) || !e["*"] && g("*")
	}
	function Oc(a, b) {
		var c,
		d,
		e = n.ajaxSettings.flatOptions || {};
		for (d in b)
			void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
		return c && n.extend(!0, a, c),
		a
	}
	function Pc(a, b, c) {
		var d,
		e,
		f,
		g,
		h = a.contents,
		i = a.dataTypes;
		while ("*" === i[0])
			i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
		if (e)
			for (g in h)
				if (h[g] && h[g].test(e)) {
					i.unshift(g);
					break
				}
		if (i[0]in c)
			f = i[0];
		else {
			for (g in c) {
				if (!i[0] || a.converters[g + " " + i[0]]) {
					f = g;
					break
				}
				d || (d = g)
			}
			f = f || d
		}
		return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
	}
	function Qc(a, b, c, d) {
		var e,
		f,
		g,
		h,
		i,
		j = {},
		k = a.dataTypes.slice();
		if (k[1])
			for (g in a.converters)
				j[g.toLowerCase()] = a.converters[g];
		f = k.shift();
		while (f)
			if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
				if ("*" === f)
					f = i;
				else if ("*" !== i && i !== f) {
					if (g = j[i + " " + f] || j["* " + f], !g)
						for (e in j)
							if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
								g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
								break
							}
					if (g !== !0)
						if (g && a["throws"])
							b = g(b);
						else
							try {
								b = g(b)
							} catch (l) {
								return {
									state : "parsererror",
									error : g ? l : "No conversion from " + i + " to " + f
								}
							}
				}
		return {
			state : "success",
			data : b
		}
	}
	n.extend({
		active : 0,
		lastModified : {},
		etag : {},
		ajaxSettings : {
			url : Ac,
			type : "GET",
			isLocal : Ec.test(zc[1]),
			global : !0,
			processData : !0,
			async : !0,
			contentType : "application/x-www-form-urlencoded; charset=UTF-8",
			accepts : {
				"*" : Kc,
				text : "text/plain",
				html : "text/html",
				xml : "application/xml, text/xml",
				json : "application/json, text/javascript"
			},
			contents : {
				xml : /xml/,
				html : /html/,
				json : /json/
			},
			responseFields : {
				xml : "responseXML",
				text : "responseText",
				json : "responseJSON"
			},
			converters : {
				"* text" : String,
				"text html" : !0,
				"text json" : n.parseJSON,
				"text xml" : n.parseXML
			},
			flatOptions : {
				url : !0,
				context : !0
			}
		},
		ajaxSetup : function (a, b) {
			return b ? Oc(Oc(a, n.ajaxSettings), b) : Oc(n.ajaxSettings, a)
		},
		ajaxPrefilter : Mc(Ic),
		ajaxTransport : Mc(Jc),
		ajax : function (a, b) {
			"object" == typeof a && (b = a, a = void 0),
			b = b || {};
			var c,
			d,
			e,
			f,
			g,
			h,
			i,
			j,
			k = n.ajaxSetup({}, b),
			l = k.context || k,
			m = k.context && (l.nodeType || l.jquery) ? n(l) : n.event,
			o = n.Deferred(),
			p = n.Callbacks("once memory"),
			q = k.statusCode || {},
			r = {},
			s = {},
			t = 0,
			u = "canceled",
			v = {
				readyState : 0,
				getResponseHeader : function (a) {
					var b;
					if (2 === t) {
						if (!j) {
							j = {};
							while (b = Dc.exec(f))
								j[b[1].toLowerCase()] = b[2]
						}
						b = j[a.toLowerCase()]
					}
					return null == b ? null : b
				},
				getAllResponseHeaders : function () {
					return 2 === t ? f : null
				},
				setRequestHeader : function (a, b) {
					var c = a.toLowerCase();
					return t || (a = s[c] = s[c] || a, r[a] = b),
					this
				},
				overrideMimeType : function (a) {
					return t || (k.mimeType = a),
					this
				},
				statusCode : function (a) {
					var b;
					if (a)
						if (2 > t)
							for (b in a)
								q[b] = [q[b], a[b]];
						else
							v.always(a[v.status]);
					return this
				},
				abort : function (a) {
					var b = a || u;
					return i && i.abort(b),
					x(0, b),
					this
				}
			};
			if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || Ac) + "").replace(Bc, "").replace(Gc, zc[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = n.trim(k.dataType || "*").toLowerCase().match(F) || [""], null == k.crossDomain && (c = Hc.exec(k.url.toLowerCase()), k.crossDomain = !(!c || c[1] === zc[1] && c[2] === zc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (zc[3] || ("http:" === zc[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = n.param(k.data, k.traditional)), Nc(Ic, k, b, v), 2 === t)
				return v;
			h = k.global,
			h && 0 === n.active++ && n.event.trigger("ajaxStart"),
			k.type = k.type.toUpperCase(),
			k.hasContent = !Fc.test(k.type),
			e = k.url,
			k.hasContent || (k.data && (e = k.url += (xc.test(e) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = Cc.test(e) ? e.replace(Cc, "$1_=" + wc++) : e + (xc.test(e) ? "&" : "?") + "_=" + wc++)),
			k.ifModified && (n.lastModified[e] && v.setRequestHeader("If-Modified-Since", n.lastModified[e]), n.etag[e] && v.setRequestHeader("If-None-Match", n.etag[e])),
			(k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType),
			v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + Kc + "; q=0.01" : "") : k.accepts["*"]);
			for (d in k.headers)
				v.setRequestHeader(d, k.headers[d]);
			if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t))
				return v.abort();
			u = "abort";
			for (d in {
				success : 1,
				error : 1,
				complete : 1
			})
				v[d](k[d]);
			if (i = Nc(Jc, k, b, v)) {
				v.readyState = 1,
				h && m.trigger("ajaxSend", [v, k]),
				k.async && k.timeout > 0 && (g = setTimeout(function () {
							v.abort("timeout")
						}, k.timeout));
				try {
					t = 1,
					i.send(r, x)
				} catch (w) {
					if (!(2 > t))
						throw w;
					x(-1, w)
				}
			} else
				x(-1, "No Transport");
			function x(a, b, c, d) {
				var j,
				r,
				s,
				u,
				w,
				x = b;
				2 !== t && (t = 2, g && clearTimeout(g), i = void 0, f = d || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, c && (u = Pc(k, v, c)), u = Qc(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (n.lastModified[e] = w), w = v.getResponseHeader("etag"), w && (n.etag[e] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, h && m.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), h && (m.trigger("ajaxComplete", [v, k]), --n.active || n.event.trigger("ajaxStop")))
			}
			return v
		},
		getJSON : function (a, b, c) {
			return n.get(a, b, c, "json")
		},
		getScript : function (a, b) {
			return n.get(a, void 0, b, "script")
		}
	}),
	n.each(["get", "post"], function (a, b) {
		n[b] = function (a, c, d, e) {
			return n.isFunction(c) && (e = e || d, d = c, c = void 0),
			n.ajax({
				url : a,
				type : b,
				dataType : e,
				data : c,
				success : d
			})
		}
	}),
	n.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
		n.fn[b] = function (a) {
			return this.on(b, a)
		}
	}),
	n._evalUrl = function (a) {
		return n.ajax({
			url : a,
			type : "GET",
			dataType : "script",
			async : !1,
			global : !1,
			"throws" : !0
		})
	},
	n.fn.extend({
		wrapAll : function (a) {
			if (n.isFunction(a))
				return this.each(function (b) {
					n(this).wrapAll(a.call(this, b))
				});
			if (this[0]) {
				var b = n(a, this[0].ownerDocument).eq(0).clone(!0);
				this[0].parentNode && b.insertBefore(this[0]),
				b.map(function () {
					var a = this;
					while (a.firstChild && 1 === a.firstChild.nodeType)
						a = a.firstChild;
					return a
				}).append(this)
			}
			return this
		},
		wrapInner : function (a) {
			return this.each(n.isFunction(a) ? function (b) {
				n(this).wrapInner(a.call(this, b))
			}
				 : function () {
				var b = n(this),
				c = b.contents();
				c.length ? c.wrapAll(a) : b.append(a)
			})
		},
		wrap : function (a) {
			var b = n.isFunction(a);
			return this.each(function (c) {
				n(this).wrapAll(b ? a.call(this, c) : a)
			})
		},
		unwrap : function () {
			return this.parent().each(function () {
				n.nodeName(this, "body") || n(this).replaceWith(this.childNodes)
			}).end()
		}
	}),
	n.expr.filters.hidden = function (a) {
		return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !l.reliableHiddenOffsets() && "none" === (a.style && a.style.display || n.css(a, "display"))
	},
	n.expr.filters.visible = function (a) {
		return !n.expr.filters.hidden(a)
	};
	var Rc = /%20/g,
	Sc = /\[\]$/,
	Tc = /\r?\n/g,
	Uc = /^(?:submit|button|image|reset|file)$/i,
	Vc = /^(?:input|select|textarea|keygen)/i;
	function Wc(a, b, c, d) {
		var e;
		if (n.isArray(b))
			n.each(b, function (b, e) {
				c || Sc.test(a) ? d(a, e) : Wc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
			});
		else if (c || "object" !== n.type(b))
			d(a, b);
		else
			for (e in b)
				Wc(a + "[" + e + "]", b[e], c, d)
	}
	n.param = function (a, b) {
		var c,
		d = [],
		e = function (a, b) {
			b = n.isFunction(b) ? b() : null == b ? "" : b,
			d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
		};
		if (void 0 === b && (b = n.ajaxSettings && n.ajaxSettings.traditional), n.isArray(a) || a.jquery && !n.isPlainObject(a))
			n.each(a, function () {
				e(this.name, this.value)
			});
		else
			for (c in a)
				Wc(c, a[c], b, e);
		return d.join("&").replace(Rc, "+")
	},
	n.fn.extend({
		serialize : function () {
			return n.param(this.serializeArray())
		},
		serializeArray : function () {
			return this.map(function () {
				var a = n.prop(this, "elements");
				return a ? n.makeArray(a) : this
			}).filter(function () {
				var a = this.type;
				return this.name && !n(this).is(":disabled") && Vc.test(this.nodeName) && !Uc.test(a) && (this.checked || !X.test(a))
			}).map(function (a, b) {
				var c = n(this).val();
				return null == c ? null : n.isArray(c) ? n.map(c, function (a) {
					return {
						name : b.name,
						value : a.replace(Tc, "\r\n")
					}
				}) : {
					name : b.name,
					value : c.replace(Tc, "\r\n")
				}
			}).get()
		}
	}),
	n.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function () {
		return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && $c() || _c()
	}
	 : $c;
	var Xc = 0,
	Yc = {},
	Zc = n.ajaxSettings.xhr();
	a.ActiveXObject && n(a).on("unload", function () {
		for (var a in Yc)
			Yc[a](void 0, !0)
	}),
	l.cors = !!Zc && "withCredentials" in Zc,
	Zc = l.ajax = !!Zc,
	Zc && n.ajaxTransport(function (a) {
		if (!a.crossDomain || l.cors) {
			var b;
			return {
				send : function (c, d) {
					var e,
					f = a.xhr(),
					g = ++Xc;
					if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
						for (e in a.xhrFields)
							f[e] = a.xhrFields[e];
					a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType),
					a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
					for (e in c)
						void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
					f.send(a.hasContent && a.data || null),
					b = function (c, e) {
						var h,
						i,
						j;
						if (b && (e || 4 === f.readyState))
							if (delete Yc[g], b = void 0, f.onreadystatechange = n.noop, e)
								4 !== f.readyState && f.abort();
							else {
								j = {},
								h = f.status,
								"string" == typeof f.responseText && (j.text = f.responseText);
								try {
									i = f.statusText
								} catch (k) {
									i = ""
								}
								h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
							}
						j && d(h, i, j, f.getAllResponseHeaders())
					},
					a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Yc[g] = b : b()
				},
				abort : function () {
					b && b(void 0, !0)
				}
			}
		}
	});
	function $c() {
		try {
			return new a.XMLHttpRequest
		} catch (b) {}

	}
	function _c() {
		try {
			return new a.ActiveXObject("Microsoft.XMLHTTP")
		} catch (b) {}

	}
	n.ajaxSetup({
		accepts : {
			script : "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents : {
			script : /(?:java|ecma)script/
		},
		converters : {
			"text script" : function (a) {
				return n.globalEval(a),
				a
			}
		}
	}),
	n.ajaxPrefilter("script", function (a) {
		void 0 === a.cache && (a.cache = !1),
		a.crossDomain && (a.type = "GET", a.global = !1)
	}),
	n.ajaxTransport("script", function (a) {
		if (a.crossDomain) {
			var b,
			c = z.head || n("head")[0] || z.documentElement;
			return {
				send : function (d, e) {
					b = z.createElement("script"),
					b.async = !0,
					a.scriptCharset && (b.charset = a.scriptCharset),
					b.src = a.url,
					b.onload = b.onreadystatechange = function (a, c) {
						(c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"))
					},
					c.insertBefore(b, c.firstChild)
				},
				abort : function () {
					b && b.onload(void 0, !0)
				}
			}
		}
	});
	var ad = [],
	bd = /(=)\?(?=&|$)|\?\?/;
	n.ajaxSetup({
		jsonp : "callback",
		jsonpCallback : function () {
			var a = ad.pop() || n.expando + "_" + wc++;
			return this[a] = !0,
			a
		}
	}),
	n.ajaxPrefilter("json jsonp", function (b, c, d) {
		var e,
		f,
		g,
		h = b.jsonp !== !1 && (bd.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && bd.test(b.data) && "data");
		return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = n.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(bd, "$1" + e) : b.jsonp !== !1 && (b.url += (xc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () {
			return g || n.error(e + " was not called"),
			g[0]
		}, b.dataTypes[0] = "json", f = a[e], a[e] = function () {
			g = arguments
		}, d.always(function () {
				a[e] = f,
				b[e] && (b.jsonpCallback = c.jsonpCallback, ad.push(e)),
				g && n.isFunction(f) && f(g[0]),
				g = f = void 0
			}), "script") : void 0
	}),
	n.parseHTML = function (a, b, c) {
		if (!a || "string" != typeof a)
			return null;
		"boolean" == typeof b && (c = b, b = !1),
		b = b || z;
		var d = v.exec(a),
		e = !c && [];
		return d ? [b.createElement(d[1])] : (d = n.buildFragment([a], b, e), e && e.length && n(e).remove(), n.merge([], d.childNodes))
	};
	var cd = n.fn.load;
	n.fn.load = function (a, b, c) {
		if ("string" != typeof a && cd)
			return cd.apply(this, arguments);
		var d,
		e,
		f,
		g = this,
		h = a.indexOf(" ");
		return h >= 0 && (d = a.slice(h, a.length), a = a.slice(0, h)),
		n.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"),
		g.length > 0 && n.ajax({
			url : a,
			type : f,
			dataType : "html",
			data : b
		}).done(function (a) {
			e = arguments,
			g.html(d ? n("<div>").append(n.parseHTML(a)).find(d) : a)
		}).complete(c && function (a, b) {
			g.each(c, e || [a.responseText, b, a])
		}),
		this
	},
	n.expr.filters.animated = function (a) {
		return n.grep(n.timers, function (b) {
			return a === b.elem
		}).length
	};
	var dd = a.document.documentElement;
	function ed(a) {
		return n.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
	}
	n.offset = {
		setOffset : function (a, b, c) {
			var d,
			e,
			f,
			g,
			h,
			i,
			j,
			k = n.css(a, "position"),
			l = n(a),
			m = {};
			"static" === k && (a.style.position = "relative"),
			h = l.offset(),
			f = n.css(a, "top"),
			i = n.css(a, "left"),
			j = ("absolute" === k || "fixed" === k) && n.inArray("auto", [f, i]) > -1,
			j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0),
			n.isFunction(b) && (b = b.call(a, c, h)),
			null != b.top && (m.top = b.top - h.top + g),
			null != b.left && (m.left = b.left - h.left + e),
			"using" in b ? b.using.call(a, m) : l.css(m)
		}
	},
	n.fn.extend({
		offset : function (a) {
			if (arguments.length)
				return void 0 === a ? this : this.each(function (b) {
					n.offset.setOffset(this, a, b)
				});
			var b,
			c,
			d = {
				top : 0,
				left : 0
			},
			e = this[0],
			f = e && e.ownerDocument;
			if (f)
				return b = f.documentElement, n.contains(b, e) ? (typeof e.getBoundingClientRect !== L && (d = e.getBoundingClientRect()), c = ed(f), {
					top : d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
					left : d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
				}) : d
		},
		position : function () {
			if (this[0]) {
				var a,
				b,
				c = {
					top : 0,
					left : 0
				},
				d = this[0];
				return "fixed" === n.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), n.nodeName(a[0], "html") || (c = a.offset()), c.top += n.css(a[0], "borderTopWidth", !0), c.left += n.css(a[0], "borderLeftWidth", !0)), {
					top : b.top - c.top - n.css(d, "marginTop", !0),
					left : b.left - c.left - n.css(d, "marginLeft", !0)
				}
			}
		},
		offsetParent : function () {
			return this.map(function () {
				var a = this.offsetParent || dd;
				while (a && !n.nodeName(a, "html") && "static" === n.css(a, "position"))
					a = a.offsetParent;
				return a || dd
			})
		}
	}),
	n.each({
		scrollLeft : "pageXOffset",
		scrollTop : "pageYOffset"
	}, function (a, b) {
		var c = /Y/.test(b);
		n.fn[a] = function (d) {
			return W(this, function (a, d, e) {
				var f = ed(a);
				return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void(f ? f.scrollTo(c ? n(f).scrollLeft() : e, c ? e : n(f).scrollTop()) : a[d] = e)
			}, a, d, arguments.length, null)
		}
	}),
	n.each(["top", "left"], function (a, b) {
		n.cssHooks[b] = Mb(l.pixelPosition, function (a, c) {
				return c ? (c = Kb(a, b), Ib.test(c) ? n(a).position()[b] + "px" : c) : void 0
			})
	}),
	n.each({
		Height : "height",
		Width : "width"
	}, function (a, b) {
		n.each({
			padding : "inner" + a,
			content : b,
			"" : "outer" + a
		}, function (c, d) {
			n.fn[d] = function (d, e) {
				var f = arguments.length && (c || "boolean" != typeof d),
				g = c || (d === !0 || e === !0 ? "margin" : "border");
				return W(this, function (b, c, d) {
					var e;
					return n.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? n.css(b, c, g) : n.style(b, c, d, g)
				}, b, f ? d : void 0, f, null)
			}
		})
	}),
	n.fn.size = function () {
		return this.length
	},
	n.fn.andSelf = n.fn.addBack,
	"function" == typeof define && define.amd && define("jquery", [], function () {
		return n
	});
	var fd = a.jQuery,
	gd = a.$;
	return n.noConflict = function (b) {
		return a.$ === n && (a.$ = gd),
		b && a.jQuery === n && (a.jQuery = fd),
		n
	},
	typeof b === L && (a.jQuery = a.$ = n),
	n
});

/*! jQuery UI - v1.10.4 - 2014-04-29
 * http://jqueryui.com
 * Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.sortable.js, jquery.ui.autocomplete.js, jquery.ui.datepicker.js, jquery.ui.menu.js
 * Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

(function (e, t) {
	function i(t, i) {
		var s,
		a,
		o,
		r = t.nodeName.toLowerCase();
		return "area" === r ? (s = t.parentNode, a = s.name, t.href && a && "map" === s.nodeName.toLowerCase() ? (o = e("img[usemap=#" + a + "]")[0], !!o && n(o)) : !1) : (/input|select|textarea|button|object/.test(r) ? !t.disabled : "a" === r ? t.href || i : i) && n(t)
	}
	function n(t) {
		return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function () {
			return "hidden" === e.css(this, "visibility")
		}).length
	}
	var s = 0,
	a = /^ui-id-\d+$/;
	e.ui = e.ui || {},
	e.extend(e.ui, {
		version : "1.10.4",
		keyCode : {
			BACKSPACE : 8,
			COMMA : 188,
			DELETE : 46,
			DOWN : 40,
			END : 35,
			ENTER : 13,
			ESCAPE : 27,
			HOME : 36,
			LEFT : 37,
			NUMPAD_ADD : 107,
			NUMPAD_DECIMAL : 110,
			NUMPAD_DIVIDE : 111,
			NUMPAD_ENTER : 108,
			NUMPAD_MULTIPLY : 106,
			NUMPAD_SUBTRACT : 109,
			PAGE_DOWN : 34,
			PAGE_UP : 33,
			PERIOD : 190,
			RIGHT : 39,
			SPACE : 32,
			TAB : 9,
			UP : 38
		}
	}),
	e.fn.extend({
		focus : function (t) {
			return function (i, n) {
				return "number" == typeof i ? this.each(function () {
					var t = this;
					setTimeout(function () {
						e(t).focus(),
						n && n.call(t)
					}, i)
				}) : t.apply(this, arguments)
			}
		}
		(e.fn.focus),
		scrollParent : function () {
			var t;
			return t = e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
					return /(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
				}).eq(0) : this.parents().filter(function () {
					return /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
				}).eq(0),
			/fixed/.test(this.css("position")) || !t.length ? e(document) : t
		},
		zIndex : function (i) {
			if (i !== t)
				return this.css("zIndex", i);
			if (this.length)
				for (var n, s, a = e(this[0]); a.length && a[0] !== document; ) {
					if (n = a.css("position"), ("absolute" === n || "relative" === n || "fixed" === n) && (s = parseInt(a.css("zIndex"), 10), !isNaN(s) && 0 !== s))
						return s;
					a = a.parent()
				}
			return 0
		},
		uniqueId : function () {
			return this.each(function () {
				this.id || (this.id = "ui-id-" + ++s)
			})
		},
		removeUniqueId : function () {
			return this.each(function () {
				a.test(this.id) && e(this).removeAttr("id")
			})
		}
	}),
	e.extend(e.expr[":"], {
		data : e.expr.createPseudo ? e.expr.createPseudo(function (t) {
			return function (i) {
				return !!e.data(i, t)
			}
		}) : function (t, i, n) {
			return !!e.data(t, n[3])
		},
		focusable : function (t) {
			return i(t, !isNaN(e.attr(t, "tabindex")))
		},
		tabbable : function (t) {
			var n = e.attr(t, "tabindex"),
			s = isNaN(n);
			return (s || n >= 0) && i(t, !s)
		}
	}),
	e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function (i, n) {
		function s(t, i, n, s) {
			return e.each(a, function () {
				i -= parseFloat(e.css(t, "padding" + this)) || 0,
				n && (i -= parseFloat(e.css(t, "border" + this + "Width")) || 0),
				s && (i -= parseFloat(e.css(t, "margin" + this)) || 0)
			}),
			i
		}
		var a = "Width" === n ? ["Left", "Right"] : ["Top", "Bottom"],
		o = n.toLowerCase(),
		r = {
			innerWidth : e.fn.innerWidth,
			innerHeight : e.fn.innerHeight,
			outerWidth : e.fn.outerWidth,
			outerHeight : e.fn.outerHeight
		};
		e.fn["inner" + n] = function (i) {
			return i === t ? r["inner" + n].call(this) : this.each(function () {
				e(this).css(o, s(this, i) + "px")
			})
		},
		e.fn["outer" + n] = function (t, i) {
			return "number" != typeof t ? r["outer" + n].call(this, t) : this.each(function () {
				e(this).css(o, s(this, t, !0, i) + "px")
			})
		}
	}),
	e.fn.addBack || (e.fn.addBack = function (e) {
		return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
	}),
	e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function (t) {
		return function (i) {
			return arguments.length ? t.call(this, e.camelCase(i)) : t.call(this)
		}
	}
		(e.fn.removeData)),
	e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),
	e.support.selectstart = "onselectstart" in document.createElement("div"),
	e.fn.extend({
		disableSelection : function () {
			return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (e) {
				e.preventDefault()
			})
		},
		enableSelection : function () {
			return this.unbind(".ui-disableSelection")
		}
	}),
	e.extend(e.ui, {
		plugin : {
			add : function (t, i, n) {
				var s,
				a = e.ui[t].prototype;
				for (s in n)
					a.plugins[s] = a.plugins[s] || [], a.plugins[s].push([i, n[s]])
			},
			call : function (e, t, i) {
				var n,
				s = e.plugins[t];
				if (s && e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType)
					for (n = 0; s.length > n; n++)
						e.options[s[n][0]] && s[n][1].apply(e.element, i)
			}
		},
		hasScroll : function (t, i) {
			if ("hidden" === e(t).css("overflow"))
				return !1;
			var n = i && "left" === i ? "scrollLeft" : "scrollTop",
			s = !1;
			return t[n] > 0 ? !0 : (t[n] = 1, s = t[n] > 0, t[n] = 0, s)
		}
	})
})(jQuery);
(function (t, e) {
	var i = 0,
	s = Array.prototype.slice,
	n = t.cleanData;
	t.cleanData = function (e) {
		for (var i, s = 0; null != (i = e[s]); s++)
			try {
				t(i).triggerHandler("remove")
			} catch (o) {}

		n(e)
	},
	t.widget = function (i, s, n) {
		var o,
		a,
		r,
		h,
		l = {},
		c = i.split(".")[0];
		i = i.split(".")[1],
		o = c + "-" + i,
		n || (n = s, s = t.Widget),
		t.expr[":"][o.toLowerCase()] = function (e) {
			return !!t.data(e, o)
		},
		t[c] = t[c] || {},
		a = t[c][i],
		r = t[c][i] = function (t, i) {
			return this._createWidget ? (arguments.length && this._createWidget(t, i), e) : new r(t, i)
		},
		t.extend(r, a, {
			version : n.version,
			_proto : t.extend({}, n),
			_childConstructors : []
		}),
		h = new s,
		h.options = t.widget.extend({}, h.options),
		t.each(n, function (i, n) {
			return t.isFunction(n) ? (l[i] = function () {
				var t = function () {
					return s.prototype[i].apply(this, arguments)
				},
				e = function (t) {
					return s.prototype[i].apply(this, t)
				};
				return function () {
					var i,
					s = this._super,
					o = this._superApply;
					return this._super = t,
					this._superApply = e,
					i = n.apply(this, arguments),
					this._super = s,
					this._superApply = o,
					i
				}
			}
				(), e) : (l[i] = n, e)
		}),
		r.prototype = t.widget.extend(h, {
				widgetEventPrefix : a ? h.widgetEventPrefix || i : i
			}, l, {
				constructor : r,
				namespace : c,
				widgetName : i,
				widgetFullName : o
			}),
		a ? (t.each(a._childConstructors, function (e, i) {
				var s = i.prototype;
				t.widget(s.namespace + "." + s.widgetName, r, i._proto)
			}), delete a._childConstructors) : s._childConstructors.push(r),
		t.widget.bridge(i, r)
	},
	t.widget.extend = function (i) {
		for (var n, o, a = s.call(arguments, 1), r = 0, h = a.length; h > r; r++)
			for (n in a[r])
				o = a[r][n], a[r].hasOwnProperty(n) && o !== e && (i[n] = t.isPlainObject(o) ? t.isPlainObject(i[n]) ? t.widget.extend({}, i[n], o) : t.widget.extend({}, o) : o);
		return i
	},
	t.widget.bridge = function (i, n) {
		var o = n.prototype.widgetFullName || i;
		t.fn[i] = function (a) {
			var r = "string" == typeof a,
			h = s.call(arguments, 1),
			l = this;
			return a = !r && h.length ? t.widget.extend.apply(null, [a].concat(h)) : a,
			r ? this.each(function () {
				var s,
				n = t.data(this, o);
				return n ? t.isFunction(n[a]) && "_" !== a.charAt(0) ? (s = n[a].apply(n, h), s !== n && s !== e ? (l = s && s.jquery ? l.pushStack(s.get()) : s, !1) : e) : t.error("no such method '" + a + "' for " + i + " widget instance") : t.error("cannot call methods on " + i + " prior to initialization; " + "attempted to call method '" + a + "'")
			}) : this.each(function () {
				var e = t.data(this, o);
				e ? e.option(a || {})._init() : t.data(this, o, new n(a, this))
			}),
			l
		}
	},
	t.Widget = function () {},
	t.Widget._childConstructors = [],
	t.Widget.prototype = {
		widgetName : "widget",
		widgetEventPrefix : "",
		defaultElement : "<div>",
		options : {
			disabled : !1,
			create : null
		},
		_createWidget : function (e, s) {
			s = t(s || this.defaultElement || this)[0],
			this.element = t(s),
			this.uuid = i++,
			this.eventNamespace = "." + this.widgetName + this.uuid,
			this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e),
			this.bindings = t(),
			this.hoverable = t(),
			this.focusable = t(),
			s !== this && (t.data(s, this.widgetFullName, this), this._on(!0, this.element, {
					remove : function (t) {
						t.target === s && this.destroy()
					}
				}), this.document = t(s.style ? s.ownerDocument : s.document || s), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)),
			this._create(),
			this._trigger("create", null, this._getCreateEventData()),
			this._init()
		},
		_getCreateOptions : t.noop,
		_getCreateEventData : t.noop,
		_create : t.noop,
		_init : t.noop,
		destroy : function () {
			this._destroy(),
			this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)),
			this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"),
			this.bindings.unbind(this.eventNamespace),
			this.hoverable.removeClass("ui-state-hover"),
			this.focusable.removeClass("ui-state-focus")
		},
		_destroy : t.noop,
		widget : function () {
			return this.element
		},
		option : function (i, s) {
			var n,
			o,
			a,
			r = i;
			if (0 === arguments.length)
				return t.widget.extend({}, this.options);
			if ("string" == typeof i)
				if (r = {}, n = i.split("."), i = n.shift(), n.length) {
					for (o = r[i] = t.widget.extend({}, this.options[i]), a = 0; n.length - 1 > a; a++)
						o[n[a]] = o[n[a]] || {},
					o = o[n[a]];
					if (i = n.pop(), 1 === arguments.length)
						return o[i] === e ? null : o[i];
					o[i] = s
				} else {
					if (1 === arguments.length)
						return this.options[i] === e ? null : this.options[i];
					r[i] = s
				}
			return this._setOptions(r),
			this
		},
		_setOptions : function (t) {
			var e;
			for (e in t)
				this._setOption(e, t[e]);
			return this
		},
		_setOption : function (t, e) {
			return this.options[t] = e,
			"disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!e).attr("aria-disabled", e), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")),
			this
		},
		enable : function () {
			return this._setOption("disabled", !1)
		},
		disable : function () {
			return this._setOption("disabled", !0)
		},
		_on : function (i, s, n) {
			var o,
			a = this;
			"boolean" != typeof i && (n = s, s = i, i = !1),
			n ? (s = o = t(s), this.bindings = this.bindings.add(s)) : (n = s, s = this.element, o = this.widget()),
			t.each(n, function (n, r) {
				function h() {
					return i || a.options.disabled !== !0 && !t(this).hasClass("ui-state-disabled") ? ("string" == typeof r ? a[r] : r).apply(a, arguments) : e
				}
				"string" != typeof r && (h.guid = r.guid = r.guid || h.guid || t.guid++);
				var l = n.match(/^(\w+)\s*(.*)$/),
				c = l[1] + a.eventNamespace,
				u = l[2];
				u ? o.delegate(u, c, h) : s.bind(c, h)
			})
		},
		_off : function (t, e) {
			e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace,
			t.unbind(e).undelegate(e)
		},
		_delay : function (t, e) {
			function i() {
				return ("string" == typeof t ? s[t] : t).apply(s, arguments)
			}
			var s = this;
			return setTimeout(i, e || 0)
		},
		_hoverable : function (e) {
			this.hoverable = this.hoverable.add(e),
			this._on(e, {
				mouseenter : function (e) {
					t(e.currentTarget).addClass("ui-state-hover")
				},
				mouseleave : function (e) {
					t(e.currentTarget).removeClass("ui-state-hover")
				}
			})
		},
		_focusable : function (e) {
			this.focusable = this.focusable.add(e),
			this._on(e, {
				focusin : function (e) {
					t(e.currentTarget).addClass("ui-state-focus")
				},
				focusout : function (e) {
					t(e.currentTarget).removeClass("ui-state-focus")
				}
			})
		},
		_trigger : function (e, i, s) {
			var n,
			o,
			a = this.options[e];
			if (s = s || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], o = i.originalEvent)
				for (n in o)
					n in i || (i[n] = o[n]);
			return this.element.trigger(i, s),
			!(t.isFunction(a) && a.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented())
		}
	},
	t.each({
		show : "fadeIn",
		hide : "fadeOut"
	}, function (e, i) {
		t.Widget.prototype["_" + e] = function (s, n, o) {
			"string" == typeof n && (n = {
					effect : n
				});
			var a,
			r = n ? n === !0 || "number" == typeof n ? i : n.effect || i : e;
			n = n || {},
			"number" == typeof n && (n = {
					duration : n
				}),
			a = !t.isEmptyObject(n),
			n.complete = o,
			n.delay && s.delay(n.delay),
			a && t.effects && t.effects.effect[r] ? s[e](n) : r !== e && s[r] ? s[r](n.duration, n.easing, o) : s.queue(function (i) {
				t(this)[e](),
				o && o.call(s[0]),
				i()
			})
		}
	})
})(jQuery);
(function (t) {
	var e = !1;
	t(document).mouseup(function () {
		e = !1
	}),
	t.widget("ui.mouse", {
		version : "1.10.4",
		options : {
			cancel : "input,textarea,button,select,option",
			distance : 1,
			delay : 0
		},
		_mouseInit : function () {
			var e = this;
			this.element.bind("mousedown." + this.widgetName, function (t) {
				return e._mouseDown(t)
			}).bind("click." + this.widgetName, function (i) {
				return !0 === t.data(i.target, e.widgetName + ".preventClickEvent") ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : undefined
			}),
			this.started = !1
		},
		_mouseDestroy : function () {
			this.element.unbind("." + this.widgetName),
			this._mouseMoveDelegate && t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
		},
		_mouseDown : function (i) {
			if (!e) {
				this._mouseStarted && this._mouseUp(i),
				this._mouseDownEvent = i;
				var s = this,
				n = 1 === i.which,
				a = "string" == typeof this.options.cancel && i.target.nodeName ? t(i.target).closest(this.options.cancel).length : !1;
				return n && !a && this._mouseCapture(i) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
								s.mouseDelayMet = !0
							}, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = this._mouseStart(i) !== !1, !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === t.data(i.target, this.widgetName + ".preventClickEvent") && t.removeData(i.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (t) {
						return s._mouseMove(t)
					}, this._mouseUpDelegate = function (t) {
						return s._mouseUp(t)
					}, t(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), i.preventDefault(), e = !0, !0)) : !0
			}
		},
		_mouseMove : function (e) {
			return t.ui.ie && (!document.documentMode || 9 > document.documentMode) && !e.button ? this._mouseUp(e) : this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1, this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted)
		},
		_mouseUp : function (e) {
			return t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate),
			this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)),
			!1
		},
		_mouseDistanceMet : function (t) {
			return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance
		},
		_mouseDelayMet : function () {
			return this.mouseDelayMet
		},
		_mouseStart : function () {},
		_mouseDrag : function () {},
		_mouseStop : function () {},
		_mouseCapture : function () {
			return !0
		}
	})
})(jQuery);
(function (t, e) {
	function i(t, e, i) {
		return [parseFloat(t[0]) * (p.test(t[0]) ? e / 100 : 1), parseFloat(t[1]) * (p.test(t[1]) ? i / 100 : 1)]
	}
	function s(e, i) {
		return parseInt(t.css(e, i), 10) || 0
	}
	function n(e) {
		var i = e[0];
		return 9 === i.nodeType ? {
			width : e.width(),
			height : e.height(),
			offset : {
				top : 0,
				left : 0
			}
		}
		 : t.isWindow(i) ? {
			width : e.width(),
			height : e.height(),
			offset : {
				top : e.scrollTop(),
				left : e.scrollLeft()
			}
		}
		 : i.preventDefault ? {
			width : 0,
			height : 0,
			offset : {
				top : i.pageY,
				left : i.pageX
			}
		}
		 : {
			width : e.outerWidth(),
			height : e.outerHeight(),
			offset : e.offset()
		}
	}
	t.ui = t.ui || {};
	var a,
	o = Math.max,
	r = Math.abs,
	l = Math.round,
	h = /left|center|right/,
	c = /top|center|bottom/,
	u = /[\+\-]\d+(\.[\d]+)?%?/,
	d = /^\w+/,
	p = /%$/,
	f = t.fn.position;
	t.position = {
		scrollbarWidth : function () {
			if (a !== e)
				return a;
			var i,
			s,
			n = t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
			o = n.children()[0];
			return t("body").append(n),
			i = o.offsetWidth,
			n.css("overflow", "scroll"),
			s = o.offsetWidth,
			i === s && (s = n[0].clientWidth),
			n.remove(),
			a = i - s
		},
		getScrollInfo : function (e) {
			var i = e.isWindow || e.isDocument ? "" : e.element.css("overflow-x"),
			s = e.isWindow || e.isDocument ? "" : e.element.css("overflow-y"),
			n = "scroll" === i || "auto" === i && e.width < e.element[0].scrollWidth,
			a = "scroll" === s || "auto" === s && e.height < e.element[0].scrollHeight;
			return {
				width : a ? t.position.scrollbarWidth() : 0,
				height : n ? t.position.scrollbarWidth() : 0
			}
		},
		getWithinInfo : function (e) {
			var i = t(e || window),
			s = t.isWindow(i[0]),
			n = !!i[0] && 9 === i[0].nodeType;
			return {
				element : i,
				isWindow : s,
				isDocument : n,
				offset : i.offset() || {
					left : 0,
					top : 0
				},
				scrollLeft : i.scrollLeft(),
				scrollTop : i.scrollTop(),
				width : s ? i.width() : i.outerWidth(),
				height : s ? i.height() : i.outerHeight()
			}
		}
	},
	t.fn.position = function (e) {
		if (!e || !e.of)
			return f.apply(this, arguments);
		e = t.extend({}, e);
		var a,
		p,
		g,
		m,
		v,
		_,
		b = t(e.of),
		y = t.position.getWithinInfo(e.within),
		k = t.position.getScrollInfo(y),
		w = (e.collision || "flip").split(" "),
		D = {};
		return _ = n(b),
		b[0].preventDefault && (e.at = "left top"),
		p = _.width,
		g = _.height,
		m = _.offset,
		v = t.extend({}, m),
		t.each(["my", "at"], function () {
			var t,
			i,
			s = (e[this] || "").split(" ");
			1 === s.length && (s = h.test(s[0]) ? s.concat(["center"]) : c.test(s[0]) ? ["center"].concat(s) : ["center", "center"]),
			s[0] = h.test(s[0]) ? s[0] : "center",
			s[1] = c.test(s[1]) ? s[1] : "center",
			t = u.exec(s[0]),
			i = u.exec(s[1]),
			D[this] = [t ? t[0] : 0, i ? i[0] : 0],
			e[this] = [d.exec(s[0])[0], d.exec(s[1])[0]]
		}),
		1 === w.length && (w[1] = w[0]),
		"right" === e.at[0] ? v.left += p : "center" === e.at[0] && (v.left += p / 2),
		"bottom" === e.at[1] ? v.top += g : "center" === e.at[1] && (v.top += g / 2),
		a = i(D.at, p, g),
		v.left += a[0],
		v.top += a[1],
		this.each(function () {
			var n,
			h,
			c = t(this),
			u = c.outerWidth(),
			d = c.outerHeight(),
			f = s(this, "marginLeft"),
			_ = s(this, "marginTop"),
			x = u + f + s(this, "marginRight") + k.width,
			C = d + _ + s(this, "marginBottom") + k.height,
			M = t.extend({}, v),
			T = i(D.my, c.outerWidth(), c.outerHeight());
			"right" === e.my[0] ? M.left -= u : "center" === e.my[0] && (M.left -= u / 2),
			"bottom" === e.my[1] ? M.top -= d : "center" === e.my[1] && (M.top -= d / 2),
			M.left += T[0],
			M.top += T[1],
			t.support.offsetFractions || (M.left = l(M.left), M.top = l(M.top)),
			n = {
				marginLeft : f,
				marginTop : _
			},
			t.each(["left", "top"], function (i, s) {
				t.ui.position[w[i]] && t.ui.position[w[i]][s](M, {
					targetWidth : p,
					targetHeight : g,
					elemWidth : u,
					elemHeight : d,
					collisionPosition : n,
					collisionWidth : x,
					collisionHeight : C,
					offset : [a[0] + T[0], a[1] + T[1]],
					my : e.my,
					at : e.at,
					within : y,
					elem : c
				})
			}),
			e.using && (h = function (t) {
				var i = m.left - M.left,
				s = i + p - u,
				n = m.top - M.top,
				a = n + g - d,
				l = {
					target : {
						element : b,
						left : m.left,
						top : m.top,
						width : p,
						height : g
					},
					element : {
						element : c,
						left : M.left,
						top : M.top,
						width : u,
						height : d
					},
					horizontal : 0 > s ? "left" : i > 0 ? "right" : "center",
					vertical : 0 > a ? "top" : n > 0 ? "bottom" : "middle"
				};
				u > p && p > r(i + s) && (l.horizontal = "center"),
				d > g && g > r(n + a) && (l.vertical = "middle"),
				l.important = o(r(i), r(s)) > o(r(n), r(a)) ? "horizontal" : "vertical",
				e.using.call(this, t, l)
			}),
			c.offset(t.extend(M, {
					using : h
				}))
		})
	},
	t.ui.position = {
		fit : {
			left : function (t, e) {
				var i,
				s = e.within,
				n = s.isWindow ? s.scrollLeft : s.offset.left,
				a = s.width,
				r = t.left - e.collisionPosition.marginLeft,
				l = n - r,
				h = r + e.collisionWidth - a - n;
				e.collisionWidth > a ? l > 0 && 0 >= h ? (i = t.left + l + e.collisionWidth - a - n, t.left += l - i) : t.left = h > 0 && 0 >= l ? n : l > h ? n + a - e.collisionWidth : n : l > 0 ? t.left += l : h > 0 ? t.left -= h : t.left = o(t.left - r, t.left)
			},
			top : function (t, e) {
				var i,
				s = e.within,
				n = s.isWindow ? s.scrollTop : s.offset.top,
				a = e.within.height,
				r = t.top - e.collisionPosition.marginTop,
				l = n - r,
				h = r + e.collisionHeight - a - n;
				e.collisionHeight > a ? l > 0 && 0 >= h ? (i = t.top + l + e.collisionHeight - a - n, t.top += l - i) : t.top = h > 0 && 0 >= l ? n : l > h ? n + a - e.collisionHeight : n : l > 0 ? t.top += l : h > 0 ? t.top -= h : t.top = o(t.top - r, t.top)
			}
		},
		flip : {
			left : function (t, e) {
				var i,
				s,
				n = e.within,
				a = n.offset.left + n.scrollLeft,
				o = n.width,
				l = n.isWindow ? n.scrollLeft : n.offset.left,
				h = t.left - e.collisionPosition.marginLeft,
				c = h - l,
				u = h + e.collisionWidth - o - l,
				d = "left" === e.my[0] ? -e.elemWidth : "right" === e.my[0] ? e.elemWidth : 0,
				p = "left" === e.at[0] ? e.targetWidth : "right" === e.at[0] ? -e.targetWidth : 0,
				f = -2 * e.offset[0];
				0 > c ? (i = t.left + d + p + f + e.collisionWidth - o - a, (0 > i || r(c) > i) && (t.left += d + p + f)) : u > 0 && (s = t.left - e.collisionPosition.marginLeft + d + p + f - l, (s > 0 || u > r(s)) && (t.left += d + p + f))
			},
			top : function (t, e) {
				var i,
				s,
				n = e.within,
				a = n.offset.top + n.scrollTop,
				o = n.height,
				l = n.isWindow ? n.scrollTop : n.offset.top,
				h = t.top - e.collisionPosition.marginTop,
				c = h - l,
				u = h + e.collisionHeight - o - l,
				d = "top" === e.my[1],
				p = d ? -e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0,
				f = "top" === e.at[1] ? e.targetHeight : "bottom" === e.at[1] ? -e.targetHeight : 0,
				g = -2 * e.offset[1];
				0 > c ? (s = t.top + p + f + g + e.collisionHeight - o - a, t.top + p + f + g > c && (0 > s || r(c) > s) && (t.top += p + f + g)) : u > 0 && (i = t.top - e.collisionPosition.marginTop + p + f + g - l, t.top + p + f + g > u && (i > 0 || u > r(i)) && (t.top += p + f + g))
			}
		},
		flipfit : {
			left : function () {
				t.ui.position.flip.left.apply(this, arguments),
				t.ui.position.fit.left.apply(this, arguments)
			},
			top : function () {
				t.ui.position.flip.top.apply(this, arguments),
				t.ui.position.fit.top.apply(this, arguments)
			}
		}
	},
	function () {
		var e,
		i,
		s,
		n,
		a,
		o = document.getElementsByTagName("body")[0],
		r = document.createElement("div");
		e = document.createElement(o ? "div" : "body"),
		s = {
			visibility : "hidden",
			width : 0,
			height : 0,
			border : 0,
			margin : 0,
			background : "none"
		},
		o && t.extend(s, {
			position : "absolute",
			left : "-1000px",
			top : "-1000px"
		});
		for (a in s)
			e.style[a] = s[a];
		e.appendChild(r),
		i = o || document.documentElement,
		i.insertBefore(e, i.firstChild),
		r.style.cssText = "position: absolute; left: 10.7432222px;",
		n = t(r).offset().left,
		t.support.offsetFractions = n > 10 && 11 > n,
		e.innerHTML = "",
		i.removeChild(e)
	}
	()
})(jQuery);
(function (t) {
	t.widget("ui.draggable", t.ui.mouse, {
		version : "1.10.4",
		widgetEventPrefix : "drag",
		options : {
			addClasses : !0,
			appendTo : "parent",
			axis : !1,
			connectToSortable : !1,
			containment : !1,
			cursor : "auto",
			cursorAt : !1,
			grid : !1,
			handle : !1,
			helper : "original",
			iframeFix : !1,
			opacity : !1,
			refreshPositions : !1,
			revert : !1,
			revertDuration : 500,
			scope : "default",
			scroll : !0,
			scrollSensitivity : 20,
			scrollSpeed : 20,
			snap : !1,
			snapMode : "both",
			snapTolerance : 20,
			stack : !1,
			zIndex : !1,
			drag : null,
			start : null,
			stop : null
		},
		_create : function () {
			"original" !== this.options.helper || /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative"),
			this.options.addClasses && this.element.addClass("ui-draggable"),
			this.options.disabled && this.element.addClass("ui-draggable-disabled"),
			this._mouseInit()
		},
		_destroy : function () {
			this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),
			this._mouseDestroy()
		},
		_mouseCapture : function (e) {
			var i = this.options;
			return this.helper || i.disabled || t(e.target).closest(".ui-resizable-handle").length > 0 ? !1 : (this.handle = this._getHandle(e), this.handle ? (t(i.iframeFix === !0 ? "iframe" : i.iframeFix).each(function () {
						t("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({
							width : this.offsetWidth + "px",
							height : this.offsetHeight + "px",
							position : "absolute",
							opacity : "0.001",
							zIndex : 1e3
						}).css(t(this).offset()).appendTo("body")
					}), !0) : !1)
		},
		_mouseStart : function (e) {
			var i = this.options;
			return this.helper = this._createHelper(e),
			this.helper.addClass("ui-draggable-dragging"),
			this._cacheHelperProportions(),
			t.ui.ddmanager && (t.ui.ddmanager.current = this),
			this._cacheMargins(),
			this.cssPosition = this.helper.css("position"),
			this.scrollParent = this.helper.scrollParent(),
			this.offsetParent = this.helper.offsetParent(),
			this.offsetParentCssPosition = this.offsetParent.css("position"),
			this.offset = this.positionAbs = this.element.offset(),
			this.offset = {
				top : this.offset.top - this.margins.top,
				left : this.offset.left - this.margins.left
			},
			this.offset.scroll = !1,
			t.extend(this.offset, {
				click : {
					left : e.pageX - this.offset.left,
					top : e.pageY - this.offset.top
				},
				parent : this._getParentOffset(),
				relative : this._getRelativeOffset()
			}),
			this.originalPosition = this.position = this._generatePosition(e),
			this.originalPageX = e.pageX,
			this.originalPageY = e.pageY,
			i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt),
			this._setContainment(),
			this._trigger("start", e) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), t.ui.ddmanager && !i.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e), this._mouseDrag(e, !0), t.ui.ddmanager && t.ui.ddmanager.dragStart(this, e), !0)
		},
		_mouseDrag : function (e, i) {
			if ("fixed" === this.offsetParentCssPosition && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(e), this.positionAbs = this._convertPositionTo("absolute"), !i) {
				var s = this._uiHash();
				if (this._trigger("drag", e, s) === !1)
					return this._mouseUp({}), !1;
				this.position = s.position
			}
			return this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"),
			this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"),
			t.ui.ddmanager && t.ui.ddmanager.drag(this, e),
			!1
		},
		_mouseStop : function (e) {
			var i = this,
			s = !1;
			return t.ui.ddmanager && !this.options.dropBehaviour && (s = t.ui.ddmanager.drop(this, e)),
			this.dropped && (s = this.dropped, this.dropped = !1),
			"original" !== this.options.helper || t.contains(this.element[0].ownerDocument, this.element[0]) ? ("invalid" === this.options.revert && !s || "valid" === this.options.revert && s || this.options.revert === !0 || t.isFunction(this.options.revert) && this.options.revert.call(this.element, s) ? t(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
					i._trigger("stop", e) !== !1 && i._clear()
				}) : this._trigger("stop", e) !== !1 && this._clear(), !1) : !1
		},
		_mouseUp : function (e) {
			return t("div.ui-draggable-iframeFix").each(function () {
				this.parentNode.removeChild(this)
			}),
			t.ui.ddmanager && t.ui.ddmanager.dragStop(this, e),
			t.ui.mouse.prototype._mouseUp.call(this, e)
		},
		cancel : function () {
			return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(),
			this
		},
		_getHandle : function (e) {
			return this.options.handle ? !!t(e.target).closest(this.element.find(this.options.handle)).length : !0
		},
		_createHelper : function (e) {
			var i = this.options,
			s = t.isFunction(i.helper) ? t(i.helper.apply(this.element[0], [e])) : "clone" === i.helper ? this.element.clone().removeAttr("id") : this.element;
			return s.parents("body").length || s.appendTo("parent" === i.appendTo ? this.element[0].parentNode : i.appendTo),
			s[0] === this.element[0] || /(fixed|absolute)/.test(s.css("position")) || s.css("position", "absolute"),
			s
		},
		_adjustOffsetFromHelper : function (e) {
			"string" == typeof e && (e = e.split(" ")),
			t.isArray(e) && (e = {
					left : +e[0],
					top : +e[1] || 0
				}),
			"left" in e && (this.offset.click.left = e.left + this.margins.left),
			"right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left),
			"top" in e && (this.offset.click.top = e.top + this.margins.top),
			"bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top)
		},
		_getParentOffset : function () {
			var e = this.offsetParent.offset();
			return "absolute" === this.cssPosition && this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), e.top += this.scrollParent.scrollTop()),
			(this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && t.ui.ie) && (e = {
					top : 0,
					left : 0
				}), {
				top : e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
				left : e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
			}
		},
		_getRelativeOffset : function () {
			if ("relative" === this.cssPosition) {
				var t = this.element.position();
				return {
					top : t.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
					left : t.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
				}
			}
			return {
				top : 0,
				left : 0
			}
		},
		_cacheMargins : function () {
			this.margins = {
				left : parseInt(this.element.css("marginLeft"), 10) || 0,
				top : parseInt(this.element.css("marginTop"), 10) || 0,
				right : parseInt(this.element.css("marginRight"), 10) || 0,
				bottom : parseInt(this.element.css("marginBottom"), 10) || 0
			}
		},
		_cacheHelperProportions : function () {
			this.helperProportions = {
				width : this.helper.outerWidth(),
				height : this.helper.outerHeight()
			}
		},
		_setContainment : function () {
			var e,
			i,
			s,
			n = this.options;
			return n.containment ? "window" === n.containment ? (this.containment = [t(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, t(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, t(window).scrollLeft() + t(window).width() - this.helperProportions.width - this.margins.left, t(window).scrollTop() + (t(window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], undefined) : "document" === n.containment ? (this.containment = [0, 0, t(document).width() - this.helperProportions.width - this.margins.left, (t(document).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], undefined) : n.containment.constructor === Array ? (this.containment = n.containment, undefined) : ("parent" === n.containment && (n.containment = this.helper[0].parentNode), i = t(n.containment), s = i[0], s && (e = "hidden" !== i.css("overflow"), this.containment = [(parseInt(i.css("borderLeftWidth"), 10) || 0) + (parseInt(i.css("paddingLeft"), 10) || 0), (parseInt(i.css("borderTopWidth"), 10) || 0) + (parseInt(i.css("paddingTop"), 10) || 0), (e ? Math.max(s.scrollWidth, s.offsetWidth) : s.offsetWidth) - (parseInt(i.css("borderRightWidth"), 10) || 0) - (parseInt(i.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (e ? Math.max(s.scrollHeight, s.offsetHeight) : s.offsetHeight) - (parseInt(i.css("borderBottomWidth"), 10) || 0) - (parseInt(i.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relative_container = i), undefined) : (this.containment = null, undefined)
		},
		_convertPositionTo : function (e, i) {
			i || (i = this.position);
			var s = "absolute" === e ? 1 : -1,
			n = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent;
			return this.offset.scroll || (this.offset.scroll = {
					top : n.scrollTop(),
					left : n.scrollLeft()
				}), {
				top : i.top + this.offset.relative.top * s + this.offset.parent.top * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : this.offset.scroll.top) * s,
				left : i.left + this.offset.relative.left * s + this.offset.parent.left * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : this.offset.scroll.left) * s
			}
		},
		_generatePosition : function (e) {
			var i,
			s,
			n,
			a,
			o = this.options,
			r = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
			l = e.pageX,
			h = e.pageY;
			return this.offset.scroll || (this.offset.scroll = {
					top : r.scrollTop(),
					left : r.scrollLeft()
				}),
			this.originalPosition && (this.containment && (this.relative_container ? (s = this.relative_container.offset(), i = [this.containment[0] + s.left, this.containment[1] + s.top, this.containment[2] + s.left, this.containment[3] + s.top]) : i = this.containment, e.pageX - this.offset.click.left < i[0] && (l = i[0] + this.offset.click.left), e.pageY - this.offset.click.top < i[1] && (h = i[1] + this.offset.click.top), e.pageX - this.offset.click.left > i[2] && (l = i[2] + this.offset.click.left), e.pageY - this.offset.click.top > i[3] && (h = i[3] + this.offset.click.top)), o.grid && (n = o.grid[1] ? this.originalPageY + Math.round((h - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY, h = i ? n - this.offset.click.top >= i[1] || n - this.offset.click.top > i[3] ? n : n - this.offset.click.top >= i[1] ? n - o.grid[1] : n + o.grid[1] : n, a = o.grid[0] ? this.originalPageX + Math.round((l - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX, l = i ? a - this.offset.click.left >= i[0] || a - this.offset.click.left > i[2] ? a : a - this.offset.click.left >= i[0] ? a - o.grid[0] : a + o.grid[0] : a)), {
				top : h - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : this.offset.scroll.top),
				left : l - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : this.offset.scroll.left)
			}
		},
		_clear : function () {
			this.helper.removeClass("ui-draggable-dragging"),
			this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(),
			this.helper = null,
			this.cancelHelperRemoval = !1
		},
		_trigger : function (e, i, s) {
			return s = s || this._uiHash(),
			t.ui.plugin.call(this, e, [i, s]),
			"drag" === e && (this.positionAbs = this._convertPositionTo("absolute")),
			t.Widget.prototype._trigger.call(this, e, i, s)
		},
		plugins : {},
		_uiHash : function () {
			return {
				helper : this.helper,
				position : this.position,
				originalPosition : this.originalPosition,
				offset : this.positionAbs
			}
		}
	}),
	t.ui.plugin.add("draggable", "connectToSortable", {
		start : function (e, i) {
			var s = t(this).data("ui-draggable"),
			n = s.options,
			a = t.extend({}, i, {
					item : s.element
				});
			s.sortables = [],
			t(n.connectToSortable).each(function () {
				var i = t.data(this, "ui-sortable");
				i && !i.options.disabled && (s.sortables.push({
						instance : i,
						shouldRevert : i.options.revert
					}), i.refreshPositions(), i._trigger("activate", e, a))
			})
		},
		stop : function (e, i) {
			var s = t(this).data("ui-draggable"),
			n = t.extend({}, i, {
					item : s.element
				});
			t.each(s.sortables, function () {
				this.instance.isOver ? (this.instance.isOver = 0, s.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = this.shouldRevert), this.instance._mouseStop(e), this.instance.options.helper = this.instance.options._helper, "original" === s.options.helper && this.instance.currentItem.css({
						top : "auto",
						left : "auto"
					})) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", e, n))
			})
		},
		drag : function (e, i) {
			var s = t(this).data("ui-draggable"),
			n = this;
			t.each(s.sortables, function () {
				var a = !1,
				o = this;
				this.instance.positionAbs = s.positionAbs,
				this.instance.helperProportions = s.helperProportions,
				this.instance.offset.click = s.offset.click,
				this.instance._intersectsWith(this.instance.containerCache) && (a = !0, t.each(s.sortables, function () {
						return this.instance.positionAbs = s.positionAbs,
						this.instance.helperProportions = s.helperProportions,
						this.instance.offset.click = s.offset.click,
						this !== o && this.instance._intersectsWith(this.instance.containerCache) && t.contains(o.instance.element[0], this.instance.element[0]) && (a = !1),
						a
					})),
				a ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = t(n).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function () {
						return i.helper[0]
					}, e.target = this.instance.currentItem[0], this.instance._mouseCapture(e, !0), this.instance._mouseStart(e, !0, !0), this.instance.offset.click.top = s.offset.click.top, this.instance.offset.click.left = s.offset.click.left, this.instance.offset.parent.left -= s.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= s.offset.parent.top - this.instance.offset.parent.top, s._trigger("toSortable", e), s.dropped = this.instance.element, s.currentItem = s.element, this.instance.fromOutside = s), this.instance.currentItem && this.instance._mouseDrag(e)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", e, this.instance._uiHash(this.instance)), this.instance._mouseStop(e, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), s._trigger("fromSortable", e), s.dropped = !1)
			})
		}
	}),
	t.ui.plugin.add("draggable", "cursor", {
		start : function () {
			var e = t("body"),
			i = t(this).data("ui-draggable").options;
			e.css("cursor") && (i._cursor = e.css("cursor")),
			e.css("cursor", i.cursor)
		},
		stop : function () {
			var e = t(this).data("ui-draggable").options;
			e._cursor && t("body").css("cursor", e._cursor)
		}
	}),
	t.ui.plugin.add("draggable", "opacity", {
		start : function (e, i) {
			var s = t(i.helper),
			n = t(this).data("ui-draggable").options;
			s.css("opacity") && (n._opacity = s.css("opacity")),
			s.css("opacity", n.opacity)
		},
		stop : function (e, i) {
			var s = t(this).data("ui-draggable").options;
			s._opacity && t(i.helper).css("opacity", s._opacity)
		}
	}),
	t.ui.plugin.add("draggable", "scroll", {
		start : function () {
			var e = t(this).data("ui-draggable");
			e.scrollParent[0] !== document && "HTML" !== e.scrollParent[0].tagName && (e.overflowOffset = e.scrollParent.offset())
		},
		drag : function (e) {
			var i = t(this).data("ui-draggable"),
			s = i.options,
			n = !1;
			i.scrollParent[0] !== document && "HTML" !== i.scrollParent[0].tagName ? (s.axis && "x" === s.axis || (i.overflowOffset.top + i.scrollParent[0].offsetHeight - e.pageY < s.scrollSensitivity ? i.scrollParent[0].scrollTop = n = i.scrollParent[0].scrollTop + s.scrollSpeed : e.pageY - i.overflowOffset.top < s.scrollSensitivity && (i.scrollParent[0].scrollTop = n = i.scrollParent[0].scrollTop - s.scrollSpeed)), s.axis && "y" === s.axis || (i.overflowOffset.left + i.scrollParent[0].offsetWidth - e.pageX < s.scrollSensitivity ? i.scrollParent[0].scrollLeft = n = i.scrollParent[0].scrollLeft + s.scrollSpeed : e.pageX - i.overflowOffset.left < s.scrollSensitivity && (i.scrollParent[0].scrollLeft = n = i.scrollParent[0].scrollLeft - s.scrollSpeed))) : (s.axis && "x" === s.axis || (e.pageY - t(document).scrollTop() < s.scrollSensitivity ? n = t(document).scrollTop(t(document).scrollTop() - s.scrollSpeed) : t(window).height() - (e.pageY - t(document).scrollTop()) < s.scrollSensitivity && (n = t(document).scrollTop(t(document).scrollTop() + s.scrollSpeed))), s.axis && "y" === s.axis || (e.pageX - t(document).scrollLeft() < s.scrollSensitivity ? n = t(document).scrollLeft(t(document).scrollLeft() - s.scrollSpeed) : t(window).width() - (e.pageX - t(document).scrollLeft()) < s.scrollSensitivity && (n = t(document).scrollLeft(t(document).scrollLeft() + s.scrollSpeed)))),
			n !== !1 && t.ui.ddmanager && !s.dropBehaviour && t.ui.ddmanager.prepareOffsets(i, e)
		}
	}),
	t.ui.plugin.add("draggable", "snap", {
		start : function () {
			var e = t(this).data("ui-draggable"),
			i = e.options;
			e.snapElements = [],
			t(i.snap.constructor !== String ? i.snap.items || ":data(ui-draggable)" : i.snap).each(function () {
				var i = t(this),
				s = i.offset();
				this !== e.element[0] && e.snapElements.push({
					item : this,
					width : i.outerWidth(),
					height : i.outerHeight(),
					top : s.top,
					left : s.left
				})
			})
		},
		drag : function (e, i) {
			var s,
			n,
			a,
			o,
			r,
			l,
			h,
			c,
			u,
			d,
			p = t(this).data("ui-draggable"),
			g = p.options,
			f = g.snapTolerance,
			m = i.offset.left,
			_ = m + p.helperProportions.width,
			v = i.offset.top,
			b = v + p.helperProportions.height;
			for (u = p.snapElements.length - 1; u >= 0; u--)
				r = p.snapElements[u].left, l = r + p.snapElements[u].width, h = p.snapElements[u].top, c = h + p.snapElements[u].height, r - f > _ || m > l + f || h - f > b || v > c + f || !t.contains(p.snapElements[u].item.ownerDocument, p.snapElements[u].item) ? (p.snapElements[u].snapping && p.options.snap.release && p.options.snap.release.call(p.element, e, t.extend(p._uiHash(), {
							snapItem : p.snapElements[u].item
						})), p.snapElements[u].snapping = !1) : ("inner" !== g.snapMode && (s = f >= Math.abs(h - b), n = f >= Math.abs(c - v), a = f >= Math.abs(r - _), o = f >= Math.abs(l - m), s && (i.position.top = p._convertPositionTo("relative", {
									top : h - p.helperProportions.height,
									left : 0
								}).top - p.margins.top), n && (i.position.top = p._convertPositionTo("relative", {
									top : c,
									left : 0
								}).top - p.margins.top), a && (i.position.left = p._convertPositionTo("relative", {
									top : 0,
									left : r - p.helperProportions.width
								}).left - p.margins.left), o && (i.position.left = p._convertPositionTo("relative", {
									top : 0,
									left : l
								}).left - p.margins.left)), d = s || n || a || o, "outer" !== g.snapMode && (s = f >= Math.abs(h - v), n = f >= Math.abs(c - b), a = f >= Math.abs(r - m), o = f >= Math.abs(l - _), s && (i.position.top = p._convertPositionTo("relative", {
									top : h,
									left : 0
								}).top - p.margins.top), n && (i.position.top = p._convertPositionTo("relative", {
									top : c - p.helperProportions.height,
									left : 0
								}).top - p.margins.top), a && (i.position.left = p._convertPositionTo("relative", {
									top : 0,
									left : r
								}).left - p.margins.left), o && (i.position.left = p._convertPositionTo("relative", {
									top : 0,
									left : l - p.helperProportions.width
								}).left - p.margins.left)), !p.snapElements[u].snapping && (s || n || a || o || d) && p.options.snap.snap && p.options.snap.snap.call(p.element, e, t.extend(p._uiHash(), {
							snapItem : p.snapElements[u].item
						})), p.snapElements[u].snapping = s || n || a || o || d)
		}
	}),
	t.ui.plugin.add("draggable", "stack", {
		start : function () {
			var e,
			i = this.data("ui-draggable").options,
			s = t.makeArray(t(i.stack)).sort(function (e, i) {
					return (parseInt(t(e).css("zIndex"), 10) || 0) - (parseInt(t(i).css("zIndex"), 10) || 0)
				});
			s.length && (e = parseInt(t(s[0]).css("zIndex"), 10) || 0, t(s).each(function (i) {
					t(this).css("zIndex", e + i)
				}), this.css("zIndex", e + s.length))
		}
	}),
	t.ui.plugin.add("draggable", "zIndex", {
		start : function (e, i) {
			var s = t(i.helper),
			n = t(this).data("ui-draggable").options;
			s.css("zIndex") && (n._zIndex = s.css("zIndex")),
			s.css("zIndex", n.zIndex)
		},
		stop : function (e, i) {
			var s = t(this).data("ui-draggable").options;
			s._zIndex && t(i.helper).css("zIndex", s._zIndex)
		}
	})
})(jQuery);
(function (t) {
	function e(t, e, i) {
		return t > e && e + i > t
	}
	function i(t) {
		return /left|right/.test(t.css("float")) || /inline|table-cell/.test(t.css("display"))
	}
	t.widget("ui.sortable", t.ui.mouse, {
		version : "1.10.4",
		widgetEventPrefix : "sort",
		ready : !1,
		options : {
			appendTo : "parent",
			axis : !1,
			connectWith : !1,
			containment : !1,
			cursor : "auto",
			cursorAt : !1,
			dropOnEmpty : !0,
			forcePlaceholderSize : !1,
			forceHelperSize : !1,
			grid : !1,
			handle : !1,
			helper : "original",
			items : "> *",
			opacity : !1,
			placeholder : !1,
			revert : !1,
			scroll : !0,
			scrollSensitivity : 20,
			scrollSpeed : 20,
			scope : "default",
			tolerance : "intersect",
			zIndex : 1e3,
			activate : null,
			beforeStop : null,
			change : null,
			deactivate : null,
			out : null,
			over : null,
			receive : null,
			remove : null,
			sort : null,
			start : null,
			stop : null,
			update : null
		},
		_create : function () {
			var t = this.options;
			this.containerCache = {},
			this.element.addClass("ui-sortable"),
			this.refresh(),
			this.floating = this.items.length ? "x" === t.axis || i(this.items[0].item) : !1,
			this.offset = this.element.offset(),
			this._mouseInit(),
			this.ready = !0
		},
		_destroy : function () {
			this.element.removeClass("ui-sortable ui-sortable-disabled"),
			this._mouseDestroy();
			for (var t = this.items.length - 1; t >= 0; t--)
				this.items[t].item.removeData(this.widgetName + "-item");
			return this
		},
		_setOption : function (e, i) {
			"disabled" === e ? (this.options[e] = i, this.widget().toggleClass("ui-sortable-disabled", !!i)) : t.Widget.prototype._setOption.apply(this, arguments)
		},
		_mouseCapture : function (e, i) {
			var s = null,
			n = !1,
			o = this;
			return this.reverting ? !1 : this.options.disabled || "static" === this.options.type ? !1 : (this._refreshItems(e), t(e.target).parents().each(function () {
					return t.data(this, o.widgetName + "-item") === o ? (s = t(this), !1) : undefined
				}), t.data(e.target, o.widgetName + "-item") === o && (s = t(e.target)), s ? !this.options.handle || i || (t(this.options.handle, s).find("*").addBack().each(function () {
						this === e.target && (n = !0)
					}), n) ? (this.currentItem = s, this._removeCurrentsFromItems(), !0) : !1 : !1)
		},
		_mouseStart : function (e, i, s) {
			var n,
			o,
			a = this.options;
			if (this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(e), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
					top : this.offset.top - this.margins.top,
					left : this.offset.left - this.margins.left
				}, t.extend(this.offset, {
					click : {
						left : e.pageX - this.offset.left,
						top : e.pageY - this.offset.top
					},
					parent : this._getParentOffset(),
					relative : this._getRelativeOffset()
				}), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(e), this.originalPageX = e.pageX, this.originalPageY = e.pageY, a.cursorAt && this._adjustOffsetFromHelper(a.cursorAt), this.domPosition = {
					prev : this.currentItem.prev()[0],
					parent : this.currentItem.parent()[0]
				}, this.helper[0] !== this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), a.containment && this._setContainment(), a.cursor && "auto" !== a.cursor && (o = this.document.find("body"), this.storedCursor = o.css("cursor"), o.css("cursor", a.cursor), this.storedStylesheet = t("<style>*{ cursor: " + a.cursor + " !important; }</style>").appendTo(o)), a.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", a.opacity)), a.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", a.zIndex)), this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", e, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(), !s)
				for (n = this.containers.length - 1; n >= 0; n--)
					this.containers[n]._trigger("activate", e, this._uiHash(this));
			return t.ui.ddmanager && (t.ui.ddmanager.current = this),
			t.ui.ddmanager && !a.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e),
			this.dragging = !0,
			this.helper.addClass("ui-sortable-helper"),
			this._mouseDrag(e),
			!0
		},
		_mouseDrag : function (e) {
			var i,
			s,
			n,
			o,
			a = this.options,
			r = !1;
			for (this.position = this._generatePosition(e), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs), this.options.scroll && (this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - e.pageY < a.scrollSensitivity ? this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop + a.scrollSpeed : e.pageY - this.overflowOffset.top < a.scrollSensitivity && (this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop - a.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - e.pageX < a.scrollSensitivity ? this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft + a.scrollSpeed : e.pageX - this.overflowOffset.left < a.scrollSensitivity && (this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft - a.scrollSpeed)) : (e.pageY - t(document).scrollTop() < a.scrollSensitivity ? r = t(document).scrollTop(t(document).scrollTop() - a.scrollSpeed) : t(window).height() - (e.pageY - t(document).scrollTop()) < a.scrollSensitivity && (r = t(document).scrollTop(t(document).scrollTop() + a.scrollSpeed)), e.pageX - t(document).scrollLeft() < a.scrollSensitivity ? r = t(document).scrollLeft(t(document).scrollLeft() - a.scrollSpeed) : t(window).width() - (e.pageX - t(document).scrollLeft()) < a.scrollSensitivity && (r = t(document).scrollLeft(t(document).scrollLeft() + a.scrollSpeed))), r !== !1 && t.ui.ddmanager && !a.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e)), this.positionAbs = this._convertPositionTo("absolute"), this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), i = this.items.length - 1; i >= 0; i--)
				if (s = this.items[i], n = s.item[0], o = this._intersectsWithPointer(s), o && s.instance === this.currentContainer && n !== this.currentItem[0] && this.placeholder[1 === o ? "next" : "prev"]()[0] !== n && !t.contains(this.placeholder[0], n) && ("semi-dynamic" === this.options.type ? !t.contains(this.element[0], n) : !0)) {
					if (this.direction = 1 === o ? "down" : "up", "pointer" !== this.options.tolerance && !this._intersectsWithSides(s))
						break;
					this._rearrange(e, s),
					this._trigger("change", e, this._uiHash());
					break
				}
			return this._contactContainers(e),
			t.ui.ddmanager && t.ui.ddmanager.drag(this, e),
			this._trigger("sort", e, this._uiHash()),
			this.lastPositionAbs = this.positionAbs,
			!1
		},
		_mouseStop : function (e, i) {
			if (e) {
				if (t.ui.ddmanager && !this.options.dropBehaviour && t.ui.ddmanager.drop(this, e), this.options.revert) {
					var s = this,
					n = this.placeholder.offset(),
					o = this.options.axis,
					a = {};
					o && "x" !== o || (a.left = n.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft)),
					o && "y" !== o || (a.top = n.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop)),
					this.reverting = !0,
					t(this.helper).animate(a, parseInt(this.options.revert, 10) || 500, function () {
						s._clear(e)
					})
				} else
					this._clear(e, i);
				return !1
			}
		},
		cancel : function () {
			if (this.dragging) {
				this._mouseUp({
					target : null
				}),
				"original" === this.options.helper ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
				for (var e = this.containers.length - 1; e >= 0; e--)
					this.containers[e]._trigger("deactivate", null, this._uiHash(this)), this.containers[e].containerCache.over && (this.containers[e]._trigger("out", null, this._uiHash(this)), this.containers[e].containerCache.over = 0)
			}
			return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), t.extend(this, {
					helper : null,
					dragging : !1,
					reverting : !1,
					_noFinalSort : null
				}), this.domPosition.prev ? t(this.domPosition.prev).after(this.currentItem) : t(this.domPosition.parent).prepend(this.currentItem)),
			this
		},
		serialize : function (e) {
			var i = this._getItemsAsjQuery(e && e.connected),
			s = [];
			return e = e || {},
			t(i).each(function () {
				var i = (t(e.item || this).attr(e.attribute || "id") || "").match(e.expression || /(.+)[\-=_](.+)/);
				i && s.push((e.key || i[1] + "[]") + "=" + (e.key && e.expression ? i[1] : i[2]))
			}),
			!s.length && e.key && s.push(e.key + "="),
			s.join("&")
		},
		toArray : function (e) {
			var i = this._getItemsAsjQuery(e && e.connected),
			s = [];
			return e = e || {},
			i.each(function () {
				s.push(t(e.item || this).attr(e.attribute || "id") || "")
			}),
			s
		},
		_intersectsWith : function (t) {
			var e = this.positionAbs.left,
			i = e + this.helperProportions.width,
			s = this.positionAbs.top,
			n = s + this.helperProportions.height,
			o = t.left,
			a = o + t.width,
			r = t.top,
			h = r + t.height,
			l = this.offset.click.top,
			c = this.offset.click.left,
			u = "x" === this.options.axis || s + l > r && h > s + l,
			d = "y" === this.options.axis || e + c > o && a > e + c,
			p = u && d;
			return "pointer" === this.options.tolerance || this.options.forcePointerForContainers || "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > t[this.floating ? "width" : "height"] ? p : e + this.helperProportions.width / 2 > o && a > i - this.helperProportions.width / 2 && s + this.helperProportions.height / 2 > r && h > n - this.helperProportions.height / 2
		},
		_intersectsWithPointer : function (t) {
			var i = "x" === this.options.axis || e(this.positionAbs.top + this.offset.click.top, t.top, t.height),
			s = "y" === this.options.axis || e(this.positionAbs.left + this.offset.click.left, t.left, t.width),
			n = i && s,
			o = this._getDragVerticalDirection(),
			a = this._getDragHorizontalDirection();
			return n ? this.floating ? a && "right" === a || "down" === o ? 2 : 1 : o && ("down" === o ? 2 : 1) : !1
		},
		_intersectsWithSides : function (t) {
			var i = e(this.positionAbs.top + this.offset.click.top, t.top + t.height / 2, t.height),
			s = e(this.positionAbs.left + this.offset.click.left, t.left + t.width / 2, t.width),
			n = this._getDragVerticalDirection(),
			o = this._getDragHorizontalDirection();
			return this.floating && o ? "right" === o && s || "left" === o && !s : n && ("down" === n && i || "up" === n && !i)
		},
		_getDragVerticalDirection : function () {
			var t = this.positionAbs.top - this.lastPositionAbs.top;
			return 0 !== t && (t > 0 ? "down" : "up")
		},
		_getDragHorizontalDirection : function () {
			var t = this.positionAbs.left - this.lastPositionAbs.left;
			return 0 !== t && (t > 0 ? "right" : "left")
		},
		refresh : function (t) {
			return this._refreshItems(t),
			this.refreshPositions(),
			this
		},
		_connectWith : function () {
			var t = this.options;
			return t.connectWith.constructor === String ? [t.connectWith] : t.connectWith
		},
		_getItemsAsjQuery : function (e) {
			function i() {
				r.push(this)
			}
			var s,
			n,
			o,
			a,
			r = [],
			h = [],
			l = this._connectWith();
			if (l && e)
				for (s = l.length - 1; s >= 0; s--)
					for (o = t(l[s]), n = o.length - 1; n >= 0; n--)
						a = t.data(o[n], this.widgetFullName), a && a !== this && !a.options.disabled && h.push([t.isFunction(a.options.items) ? a.options.items.call(a.element) : t(a.options.items, a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), a]);
			for (h.push([t.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
							options : this.options,
							item : this.currentItem
						}) : t(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]), s = h.length - 1; s >= 0; s--)
				h[s][0].each(i);
			return t(r)
		},
		_removeCurrentsFromItems : function () {
			var e = this.currentItem.find(":data(" + this.widgetName + "-item)");
			this.items = t.grep(this.items, function (t) {
					for (var i = 0; e.length > i; i++)
						if (e[i] === t.item[0])
							return !1;
					return !0
				})
		},
		_refreshItems : function (e) {
			this.items = [],
			this.containers = [this];
			var i,
			s,
			n,
			o,
			a,
			r,
			h,
			l,
			c = this.items,
			u = [[t.isFunction(this.options.items) ? this.options.items.call(this.element[0], e, {
						item : this.currentItem
					}) : t(this.options.items, this.element), this]],
			d = this._connectWith();
			if (d && this.ready)
				for (i = d.length - 1; i >= 0; i--)
					for (n = t(d[i]), s = n.length - 1; s >= 0; s--)
						o = t.data(n[s], this.widgetFullName), o && o !== this && !o.options.disabled && (u.push([t.isFunction(o.options.items) ? o.options.items.call(o.element[0], e, {
										item : this.currentItem
									}) : t(o.options.items, o.element), o]), this.containers.push(o));
			for (i = u.length - 1; i >= 0; i--)
				for (a = u[i][1], r = u[i][0], s = 0, l = r.length; l > s; s++)
					h = t(r[s]), h.data(this.widgetName + "-item", a), c.push({
						item : h,
						instance : a,
						width : 0,
						height : 0,
						left : 0,
						top : 0
					})
		},
		refreshPositions : function (e) {
			this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
			var i,
			s,
			n,
			o;
			for (i = this.items.length - 1; i >= 0; i--)
				s = this.items[i], s.instance !== this.currentContainer && this.currentContainer && s.item[0] !== this.currentItem[0] || (n = this.options.toleranceElement ? t(this.options.toleranceElement, s.item) : s.item, e || (s.width = n.outerWidth(), s.height = n.outerHeight()), o = n.offset(), s.left = o.left, s.top = o.top);
			if (this.options.custom && this.options.custom.refreshContainers)
				this.options.custom.refreshContainers.call(this);
			else
				for (i = this.containers.length - 1; i >= 0; i--)
					o = this.containers[i].element.offset(), this.containers[i].containerCache.left = o.left, this.containers[i].containerCache.top = o.top, this.containers[i].containerCache.width = this.containers[i].element.outerWidth(), this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			return this
		},
		_createPlaceholder : function (e) {
			e = e || this;
			var i,
			s = e.options;
			s.placeholder && s.placeholder.constructor !== String || (i = s.placeholder, s.placeholder = {
					element : function () {
						var s = e.currentItem[0].nodeName.toLowerCase(),
						n = t("<" + s + ">", e.document[0]).addClass(i || e.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper");
						return "tr" === s ? e.currentItem.children().each(function () {
							t("<td>&#160;</td>", e.document[0]).attr("colspan", t(this).attr("colspan") || 1).appendTo(n)
						}) : "img" === s && n.attr("src", e.currentItem.attr("src")),
						i || n.css("visibility", "hidden"),
						n
					},
					update : function (t, n) {
						(!i || s.forcePlaceholderSize) && (n.height() || n.height(e.currentItem.innerHeight() - parseInt(e.currentItem.css("paddingTop") || 0, 10) - parseInt(e.currentItem.css("paddingBottom") || 0, 10)), n.width() || n.width(e.currentItem.innerWidth() - parseInt(e.currentItem.css("paddingLeft") || 0, 10) - parseInt(e.currentItem.css("paddingRight") || 0, 10)))
					}
				}),
			e.placeholder = t(s.placeholder.element.call(e.element, e.currentItem)),
			e.currentItem.after(e.placeholder),
			s.placeholder.update(e, e.placeholder)
		},
		_contactContainers : function (s) {
			var n,
			o,
			a,
			r,
			h,
			l,
			c,
			u,
			d,
			p,
			f = null,
			g = null;
			for (n = this.containers.length - 1; n >= 0; n--)
				if (!t.contains(this.currentItem[0], this.containers[n].element[0]))
					if (this._intersectsWith(this.containers[n].containerCache)) {
						if (f && t.contains(this.containers[n].element[0], f.element[0]))
							continue;
						f = this.containers[n],
						g = n
					} else
						this.containers[n].containerCache.over && (this.containers[n]._trigger("out", s, this._uiHash(this)), this.containers[n].containerCache.over = 0);
			if (f)
				if (1 === this.containers.length)
					this.containers[g].containerCache.over || (this.containers[g]._trigger("over", s, this._uiHash(this)), this.containers[g].containerCache.over = 1);
				else {
					for (a = 1e4, r = null, p = f.floating || i(this.currentItem), h = p ? "left" : "top", l = p ? "width" : "height", c = this.positionAbs[h] + this.offset.click[h], o = this.items.length - 1; o >= 0; o--)
						t.contains(this.containers[g].element[0], this.items[o].item[0]) && this.items[o].item[0] !== this.currentItem[0] && (!p || e(this.positionAbs.top + this.offset.click.top, this.items[o].top, this.items[o].height)) && (u = this.items[o].item.offset()[h], d = !1, Math.abs(u - c) > Math.abs(u + this.items[o][l] - c) && (d = !0, u += this.items[o][l]), a > Math.abs(u - c) && (a = Math.abs(u - c), r = this.items[o], this.direction = d ? "up" : "down"));
					if (!r && !this.options.dropOnEmpty)
						return;
					if (this.currentContainer === this.containers[g])
						return;
					r ? this._rearrange(s, r, null, !0) : this._rearrange(s, null, this.containers[g].element, !0),
					this._trigger("change", s, this._uiHash()),
					this.containers[g]._trigger("change", s, this._uiHash(this)),
					this.currentContainer = this.containers[g],
					this.options.placeholder.update(this.currentContainer, this.placeholder),
					this.containers[g]._trigger("over", s, this._uiHash(this)),
					this.containers[g].containerCache.over = 1
				}
		},
		_createHelper : function (e) {
			var i = this.options,
			s = t.isFunction(i.helper) ? t(i.helper.apply(this.element[0], [e, this.currentItem])) : "clone" === i.helper ? this.currentItem.clone() : this.currentItem;
			return s.parents("body").length || t("parent" !== i.appendTo ? i.appendTo : this.currentItem[0].parentNode)[0].appendChild(s[0]),
			s[0] === this.currentItem[0] && (this._storedCSS = {
					width : this.currentItem[0].style.width,
					height : this.currentItem[0].style.height,
					position : this.currentItem.css("position"),
					top : this.currentItem.css("top"),
					left : this.currentItem.css("left")
				}),
			(!s[0].style.width || i.forceHelperSize) && s.width(this.currentItem.width()),
			(!s[0].style.height || i.forceHelperSize) && s.height(this.currentItem.height()),
			s
		},
		_adjustOffsetFromHelper : function (e) {
			"string" == typeof e && (e = e.split(" ")),
			t.isArray(e) && (e = {
					left : +e[0],
					top : +e[1] || 0
				}),
			"left" in e && (this.offset.click.left = e.left + this.margins.left),
			"right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left),
			"top" in e && (this.offset.click.top = e.top + this.margins.top),
			"bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top)
		},
		_getParentOffset : function () {
			this.offsetParent = this.helper.offsetParent();
			var e = this.offsetParent.offset();
			return "absolute" === this.cssPosition && this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), e.top += this.scrollParent.scrollTop()),
			(this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && t.ui.ie) && (e = {
					top : 0,
					left : 0
				}), {
				top : e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
				left : e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
			}
		},
		_getRelativeOffset : function () {
			if ("relative" === this.cssPosition) {
				var t = this.currentItem.position();
				return {
					top : t.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
					left : t.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
				}
			}
			return {
				top : 0,
				left : 0
			}
		},
		_cacheMargins : function () {
			this.margins = {
				left : parseInt(this.currentItem.css("marginLeft"), 10) || 0,
				top : parseInt(this.currentItem.css("marginTop"), 10) || 0
			}
		},
		_cacheHelperProportions : function () {
			this.helperProportions = {
				width : this.helper.outerWidth(),
				height : this.helper.outerHeight()
			}
		},
		_setContainment : function () {
			var e,
			i,
			s,
			n = this.options;
			"parent" === n.containment && (n.containment = this.helper[0].parentNode),
			("document" === n.containment || "window" === n.containment) && (this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, t("document" === n.containment ? document : window).width() - this.helperProportions.width - this.margins.left, (t("document" === n.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]),
			/^(document|window|parent)$/.test(n.containment) || (e = t(n.containment)[0], i = t(n.containment).offset(), s = "hidden" !== t(e).css("overflow"), this.containment = [i.left + (parseInt(t(e).css("borderLeftWidth"), 10) || 0) + (parseInt(t(e).css("paddingLeft"), 10) || 0) - this.margins.left, i.top + (parseInt(t(e).css("borderTopWidth"), 10) || 0) + (parseInt(t(e).css("paddingTop"), 10) || 0) - this.margins.top, i.left + (s ? Math.max(e.scrollWidth, e.offsetWidth) : e.offsetWidth) - (parseInt(t(e).css("borderLeftWidth"), 10) || 0) - (parseInt(t(e).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, i.top + (s ? Math.max(e.scrollHeight, e.offsetHeight) : e.offsetHeight) - (parseInt(t(e).css("borderTopWidth"), 10) || 0) - (parseInt(t(e).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top])
		},
		_convertPositionTo : function (e, i) {
			i || (i = this.position);
			var s = "absolute" === e ? 1 : -1,
			n = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
			o = /(html|body)/i.test(n[0].tagName);
			return {
				top : i.top + this.offset.relative.top * s + this.offset.parent.top * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : o ? 0 : n.scrollTop()) * s,
				left : i.left + this.offset.relative.left * s + this.offset.parent.left * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : o ? 0 : n.scrollLeft()) * s
			}
		},
		_generatePosition : function (e) {
			var i,
			s,
			n = this.options,
			o = e.pageX,
			a = e.pageY,
			r = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
			h = /(html|body)/i.test(r[0].tagName);
			return "relative" !== this.cssPosition || this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()),
			this.originalPosition && (this.containment && (e.pageX - this.offset.click.left < this.containment[0] && (o = this.containment[0] + this.offset.click.left), e.pageY - this.offset.click.top < this.containment[1] && (a = this.containment[1] + this.offset.click.top), e.pageX - this.offset.click.left > this.containment[2] && (o = this.containment[2] + this.offset.click.left), e.pageY - this.offset.click.top > this.containment[3] && (a = this.containment[3] + this.offset.click.top)), n.grid && (i = this.originalPageY + Math.round((a - this.originalPageY) / n.grid[1]) * n.grid[1], a = this.containment ? i - this.offset.click.top >= this.containment[1] && i - this.offset.click.top <= this.containment[3] ? i : i - this.offset.click.top >= this.containment[1] ? i - n.grid[1] : i + n.grid[1] : i, s = this.originalPageX + Math.round((o - this.originalPageX) / n.grid[0]) * n.grid[0], o = this.containment ? s - this.offset.click.left >= this.containment[0] && s - this.offset.click.left <= this.containment[2] ? s : s - this.offset.click.left >= this.containment[0] ? s - n.grid[0] : s + n.grid[0] : s)), {
				top : a - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : h ? 0 : r.scrollTop()),
				left : o - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : h ? 0 : r.scrollLeft())
			}
		},
		_rearrange : function (t, e, i, s) {
			i ? i[0].appendChild(this.placeholder[0]) : e.item[0].parentNode.insertBefore(this.placeholder[0], "down" === this.direction ? e.item[0] : e.item[0].nextSibling),
			this.counter = this.counter ? ++this.counter : 1;
			var n = this.counter;
			this._delay(function () {
				n === this.counter && this.refreshPositions(!s)
			})
		},
		_clear : function (t, e) {
			function i(t, e, i) {
				return function (s) {
					i._trigger(t, s, e._uiHash(e))
				}
			}
			this.reverting = !1;
			var s,
			n = [];
			if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null, this.helper[0] === this.currentItem[0]) {
				for (s in this._storedCSS)
					("auto" === this._storedCSS[s] || "static" === this._storedCSS[s]) && (this._storedCSS[s] = "");
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
			} else
				this.currentItem.show();
			for (this.fromOutside && !e && n.push(function (t) {
					this._trigger("receive", t, this._uiHash(this.fromOutside))
				}), !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || e || n.push(function (t) {
					this._trigger("update", t, this._uiHash())
				}), this !== this.currentContainer && (e || (n.push(function (t) {
							this._trigger("remove", t, this._uiHash())
						}), n.push(function (t) {
							return function (e) {
								t._trigger("receive", e, this._uiHash(this))
							}
						}
							.call(this, this.currentContainer)), n.push(function (t) {
							return function (e) {
								t._trigger("update", e, this._uiHash(this))
							}
						}
							.call(this, this.currentContainer)))), s = this.containers.length - 1; s >= 0; s--)
				e || n.push(i("deactivate", this, this.containers[s])), this.containers[s].containerCache.over && (n.push(i("out", this, this.containers[s])), this.containers[s].containerCache.over = 0);
			if (this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor), this.storedStylesheet.remove()), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex), this.dragging = !1, this.cancelHelperRemoval) {
				if (!e) {
					for (this._trigger("beforeStop", t, this._uiHash()), s = 0; n.length > s; s++)
						n[s].call(this, t);
					this._trigger("stop", t, this._uiHash())
				}
				return this.fromOutside = !1,
				!1
			}
			if (e || this._trigger("beforeStop", t, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper = null, !e) {
				for (s = 0; n.length > s; s++)
					n[s].call(this, t);
				this._trigger("stop", t, this._uiHash())
			}
			return this.fromOutside = !1,
			!0
		},
		_trigger : function () {
			t.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel()
		},
		_uiHash : function (e) {
			var i = e || this;
			return {
				helper : i.helper,
				placeholder : i.placeholder || t([]),
				position : i.position,
				originalPosition : i.originalPosition,
				offset : i.positionAbs,
				item : i.currentItem,
				sender : e ? e.element : null
			}
		}
	})
})(jQuery);
(function (e) {
	e.widget("ui.autocomplete", {
		version : "1.10.4",
		defaultElement : "<input>",
		options : {
			appendTo : null,
			autoFocus : !1,
			delay : 300,
			minLength : 1,
			position : {
				my : "left top",
				at : "left bottom",
				collision : "none"
			},
			source : null,
			change : null,
			close : null,
			focus : null,
			open : null,
			response : null,
			search : null,
			select : null
		},
		requestIndex : 0,
		pending : 0,
		_create : function () {
			var t,
			i,
			s,
			n = this.element[0].nodeName.toLowerCase(),
			a = "textarea" === n,
			o = "input" === n;
			this.isMultiLine = a ? !0 : o ? !1 : this.element.prop("isContentEditable"),
			this.valueMethod = this.element[a || o ? "val" : "text"],
			this.isNewMenu = !0,
			this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off"),
			this._on(this.element, {
				keydown : function (n) {
					if (this.element.prop("readOnly"))
						return t = !0, s = !0, i = !0, undefined;
					t = !1,
					s = !1,
					i = !1;
					var a = e.ui.keyCode;
					switch (n.keyCode) {
					case a.PAGE_UP:
						t = !0,
						this._move("previousPage", n);
						break;
					case a.PAGE_DOWN:
						t = !0,
						this._move("nextPage", n);
						break;
					case a.UP:
						t = !0,
						this._keyEvent("previous", n);
						break;
					case a.DOWN:
						t = !0,
						this._keyEvent("next", n);
						break;
					case a.ENTER:
					case a.NUMPAD_ENTER:
						this.menu.active && (t = !0, n.preventDefault(), this.menu.select(n));
						break;
					case a.TAB:
						this.menu.active && this.menu.select(n);
						break;
					case a.ESCAPE:
						this.menu.element.is(":visible") && (this._value(this.term), this.close(n), n.preventDefault());
						break;
					default:
						i = !0,
						this._searchTimeout(n)
					}
				},
				keypress : function (s) {
					if (t)
						return t = !1, (!this.isMultiLine || this.menu.element.is(":visible")) && s.preventDefault(), undefined;
					if (!i) {
						var n = e.ui.keyCode;
						switch (s.keyCode) {
						case n.PAGE_UP:
							this._move("previousPage", s);
							break;
						case n.PAGE_DOWN:
							this._move("nextPage", s);
							break;
						case n.UP:
							this._keyEvent("previous", s);
							break;
						case n.DOWN:
							this._keyEvent("next", s)
						}
					}
				},
				input : function (e) {
					return s ? (s = !1, e.preventDefault(), undefined) : (this._searchTimeout(e), undefined)
				},
				focus : function () {
					this.selectedItem = null,
					this.previous = this._value()
				},
				blur : function (e) {
					return this.cancelBlur ? (delete this.cancelBlur, undefined) : (clearTimeout(this.searching), this.close(e), this._change(e), undefined)
				}
			}),
			this._initSource(),
			this.menu = e("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({
					role : null
				}).hide().data("ui-menu"),
			this._on(this.menu.element, {
				mousedown : function (t) {
					t.preventDefault(),
					this.cancelBlur = !0,
					this._delay(function () {
						delete this.cancelBlur
					});
					var i = this.menu.element[0];
					e(t.target).closest(".ui-menu-item").length || this._delay(function () {
						var t = this;
						this.document.one("mousedown", function (s) {
							s.target === t.element[0] || s.target === i || e.contains(i, s.target) || t.close()
						})
					})
				},
				menufocus : function (t, i) {
					if (this.isNewMenu && (this.isNewMenu = !1, t.originalEvent && /^mouse/.test(t.originalEvent.type)))
						return this.menu.blur(), this.document.one("mousemove", function () {
							e(t.target).trigger(t.originalEvent)
						}), undefined;
					var s = i.item.data("ui-autocomplete-item");
					!1 !== this._trigger("focus", t, {
						item : s
					}) ? t.originalEvent && /^key/.test(t.originalEvent.type) && this._value(s.value) : this.liveRegion.text(s.value)
				},
				menuselect : function (e, t) {
					var i = t.item.data("ui-autocomplete-item"),
					s = this.previous;
					this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = s, this._delay(function () {
							this.previous = s,
							this.selectedItem = i
						})),
					!1 !== this._trigger("select", e, {
						item : i
					}) && this._value(i.value),
					this.term = this._value(),
					this.close(e),
					this.selectedItem = i
				}
			}),
			this.liveRegion = e("<span>", {
					role : "status",
					"aria-live" : "polite"
				}).addClass("ui-helper-hidden-accessible").insertBefore(this.element),
			this._on(this.window, {
				beforeunload : function () {
					this.element.removeAttr("autocomplete")
				}
			})
		},
		_destroy : function () {
			clearTimeout(this.searching),
			this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),
			this.menu.element.remove(),
			this.liveRegion.remove()
		},
		_setOption : function (e, t) {
			this._super(e, t),
			"source" === e && this._initSource(),
			"appendTo" === e && this.menu.element.appendTo(this._appendTo()),
			"disabled" === e && t && this.xhr && this.xhr.abort()
		},
		_appendTo : function () {
			var t = this.options.appendTo;
			return t && (t = t.jquery || t.nodeType ? e(t) : this.document.find(t).eq(0)),
			t || (t = this.element.closest(".ui-front")),
			t.length || (t = this.document[0].body),
			t
		},
		_initSource : function () {
			var t,
			i,
			s = this;
			e.isArray(this.options.source) ? (t = this.options.source, this.source = function (i, s) {
				s(e.ui.autocomplete.filter(t, i.term))
			}) : "string" == typeof this.options.source ? (i = this.options.source, this.source = function (t, n) {
				s.xhr && s.xhr.abort(),
				s.xhr = e.ajax({
						url : i,
						data : t,
						dataType : "json",
						success : function (e) {
							n(e)
						},
						error : function () {
							n([])
						}
					})
			}) : this.source = this.options.source
		},
		_searchTimeout : function (e) {
			clearTimeout(this.searching),
			this.searching = this._delay(function () {
					this.term !== this._value() && (this.selectedItem = null, this.search(null, e))
				}, this.options.delay)
		},
		search : function (e, t) {
			return e = null != e ? e : this._value(),
			this.term = this._value(),
			e.length < this.options.minLength ? this.close(t) : this._trigger("search", t) !== !1 ? this._search(e) : undefined
		},
		_search : function (e) {
			this.pending++,
			this.element.addClass("ui-autocomplete-loading"),
			this.cancelSearch = !1,
			this.source({
				term : e
			}, this._response())
		},
		_response : function () {
			var t = ++this.requestIndex;
			return e.proxy(function (e) {
				t === this.requestIndex && this.__response(e),
				this.pending--,
				this.pending || this.element.removeClass("ui-autocomplete-loading")
			}, this)
		},
		__response : function (e) {
			e && (e = this._normalize(e)),
			this._trigger("response", null, {
				content : e
			}),
			!this.options.disabled && e && e.length && !this.cancelSearch ? (this._suggest(e), this._trigger("open")) : this._close()
		},
		close : function (e) {
			this.cancelSearch = !0,
			this._close(e)
		},
		_close : function (e) {
			this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", e))
		},
		_change : function (e) {
			this.previous !== this._value() && this._trigger("change", e, {
				item : this.selectedItem
			})
		},
		_normalize : function (t) {
			return t.length && t[0].label && t[0].value ? t : e.map(t, function (t) {
				return "string" == typeof t ? {
					label : t,
					value : t
				}
				 : e.extend({
					label : t.label || t.value,
					value : t.value || t.label
				}, t)
			})
		},
		_suggest : function (t) {
			var i = this.menu.element.empty();
			this._renderMenu(i, t),
			this.isNewMenu = !0,
			this.menu.refresh(),
			i.show(),
			this._resizeMenu(),
			i.position(e.extend({
					of : this.element
				}, this.options.position)),
			this.options.autoFocus && this.menu.next()
		},
		_resizeMenu : function () {
			var e = this.menu.element;
			e.outerWidth(Math.max(e.width("").outerWidth() + 1, this.element.outerWidth()))
		},
		_renderMenu : function (t, i) {
			var s = this;
			e.each(i, function (e, i) {
				s._renderItemData(t, i)
			})
		},
		_renderItemData : function (e, t) {
			return this._renderItem(e, t).data("ui-autocomplete-item", t)
		},
		_renderItem : function (t, i) {
			return e("<li>").append(e("<a>").text(i.label)).appendTo(t)
		},
		_move : function (e, t) {
			return this.menu.element.is(":visible") ? this.menu.isFirstItem() && /^previous/.test(e) || this.menu.isLastItem() && /^next/.test(e) ? (this._value(this.term), this.menu.blur(), undefined) : (this.menu[e](t), undefined) : (this.search(null, t), undefined)
		},
		widget : function () {
			return this.menu.element
		},
		_value : function () {
			return this.valueMethod.apply(this.element, arguments)
		},
		_keyEvent : function (e, t) {
			(!this.isMultiLine || this.menu.element.is(":visible")) && (this._move(e, t), t.preventDefault())
		}
	}),
	e.extend(e.ui.autocomplete, {
		escapeRegex : function (e) {
			return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
		},
		filter : function (t, i) {
			var s = RegExp(e.ui.autocomplete.escapeRegex(i), "i");
			return e.grep(t, function (e) {
				return s.test(e.label || e.value || e)
			})
		}
	}),
	e.widget("ui.autocomplete", e.ui.autocomplete, {
		options : {
			messages : {
				noResults : "No search results.",
				results : function (e) {
					return e + (e > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
				}
			}
		},
		__response : function (e) {
			var t;
			this._superApply(arguments),
			this.options.disabled || this.cancelSearch || (t = e && e.length ? this.options.messages.results(e.length) : this.options.messages.noResults, this.liveRegion.text(t))
		}
	})
})(jQuery);
(function (e, t) {
	function i() {
		this._curInst = null,
		this._keyEvent = !1,
		this._disabledInputs = [],
		this._datepickerShowing = !1,
		this._inDialog = !1,
		this._mainDivId = "ui-datepicker-div",
		this._inlineClass = "ui-datepicker-inline",
		this._appendClass = "ui-datepicker-append",
		this._triggerClass = "ui-datepicker-trigger",
		this._dialogClass = "ui-datepicker-dialog",
		this._disableClass = "ui-datepicker-disabled",
		this._unselectableClass = "ui-datepicker-unselectable",
		this._currentClass = "ui-datepicker-current-day",
		this._dayOverClass = "ui-datepicker-days-cell-over",
		this.regional = [],
		this.regional[""] = {
			closeText : "Done",
			prevText : "Prev",
			nextText : "Next",
			currentText : "Today",
			monthNames : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthNamesShort : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			dayNames : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			dayNamesShort : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			dayNamesMin : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			weekHeader : "Wk",
			dateFormat : "mm/dd/yy",
			firstDay : 0,
			isRTL : !1,
			showMonthAfterYear : !1,
			yearSuffix : ""
		},
		this._defaults = {
			showOn : "focus",
			showAnim : "fadeIn",
			showOptions : {},
			defaultDate : null,
			appendText : "",
			buttonText : "...",
			buttonImage : "",
			buttonImageOnly : !1,
			hideIfNoPrevNext : !1,
			navigationAsDateFormat : !1,
			gotoCurrent : !1,
			changeMonth : !1,
			changeYear : !1,
			yearRange : "c-10:c+10",
			showOtherMonths : !1,
			selectOtherMonths : !1,
			showWeek : !1,
			calculateWeek : this.iso8601Week,
			shortYearCutoff : "+10",
			minDate : null,
			maxDate : null,
			duration : "fast",
			beforeShowDay : null,
			beforeShow : null,
			onSelect : null,
			onChangeMonthYear : null,
			onClose : null,
			numberOfMonths : 1,
			showCurrentAtPos : 0,
			stepMonths : 1,
			stepBigMonths : 12,
			altField : "",
			altFormat : "",
			constrainInput : !0,
			showButtonPanel : !1,
			autoSize : !1,
			disabled : !1
		},
		e.extend(this._defaults, this.regional[""]),
		this.dpDiv = a(e("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))
	}
	function a(t) {
		var i = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
		return t.delegate(i, "mouseout", function () {
			e(this).removeClass("ui-state-hover"),
			-1 !== this.className.indexOf("ui-datepicker-prev") && e(this).removeClass("ui-datepicker-prev-hover"),
			-1 !== this.className.indexOf("ui-datepicker-next") && e(this).removeClass("ui-datepicker-next-hover")
		}).delegate(i, "mouseover", function () {
			e.datepicker._isDisabledDatepicker(n.inline ? t.parent()[0] : n.input[0]) || (e(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), e(this).addClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && e(this).addClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && e(this).addClass("ui-datepicker-next-hover"))
		})
	}
	function s(t, i) {
		e.extend(t, i);
		for (var a in i)
			null == i[a] && (t[a] = i[a]);
		return t
	}
	e.extend(e.ui, {
		datepicker : {
			version : "1.10.4"
		}
	});
	var n,
	r = "datepicker";
	e.extend(i.prototype, {
		markerClassName : "hasDatepicker",
		maxRows : 4,
		_widgetDatepicker : function () {
			return this.dpDiv
		},
		setDefaults : function (e) {
			return s(this._defaults, e || {}),
			this
		},
		_attachDatepicker : function (t, i) {
			var a,
			s,
			n;
			a = t.nodeName.toLowerCase(),
			s = "div" === a || "span" === a,
			t.id || (this.uuid += 1, t.id = "dp" + this.uuid),
			n = this._newInst(e(t), s),
			n.settings = e.extend({}, i || {}),
			"input" === a ? this._connectDatepicker(t, n) : s && this._inlineDatepicker(t, n)
		},
		_newInst : function (t, i) {
			var s = t[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1");
			return {
				id : s,
				input : t,
				selectedDay : 0,
				selectedMonth : 0,
				selectedYear : 0,
				drawMonth : 0,
				drawYear : 0,
				inline : i,
				dpDiv : i ? a(e("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv
			}
		},
		_connectDatepicker : function (t, i) {
			var a = e(t);
			i.append = e([]),
			i.trigger = e([]),
			a.hasClass(this.markerClassName) || (this._attachments(a, i), a.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp), this._autoSize(i), e.data(t, r, i), i.settings.disabled && this._disableDatepicker(t))
		},
		_attachments : function (t, i) {
			var a,
			s,
			n,
			r = this._get(i, "appendText"),
			o = this._get(i, "isRTL");
			i.append && i.append.remove(),
			r && (i.append = e("<span class='" + this._appendClass + "'>" + r + "</span>"), t[o ? "before" : "after"](i.append)),
			t.unbind("focus", this._showDatepicker),
			i.trigger && i.trigger.remove(),
			a = this._get(i, "showOn"),
			("focus" === a || "both" === a) && t.focus(this._showDatepicker),
			("button" === a || "both" === a) && (s = this._get(i, "buttonText"), n = this._get(i, "buttonImage"), i.trigger = e(this._get(i, "buttonImageOnly") ? e("<img/>").addClass(this._triggerClass).attr({
							src : n,
							alt : s,
							title : s
						}) : e("<button type='button'></button>").addClass(this._triggerClass).html(n ? e("<img/>").attr({
								src : n,
								alt : s,
								title : s
							}) : s)), t[o ? "before" : "after"](i.trigger), i.trigger.click(function () {
					return e.datepicker._datepickerShowing && e.datepicker._lastInput === t[0] ? e.datepicker._hideDatepicker() : e.datepicker._datepickerShowing && e.datepicker._lastInput !== t[0] ? (e.datepicker._hideDatepicker(), e.datepicker._showDatepicker(t[0])) : e.datepicker._showDatepicker(t[0]),
					!1
				}))
		},
		_autoSize : function (e) {
			if (this._get(e, "autoSize") && !e.inline) {
				var t,
				i,
				a,
				s,
				n = new Date(2009, 11, 20),
				r = this._get(e, "dateFormat");
				r.match(/[DM]/) && (t = function (e) {
					for (i = 0, a = 0, s = 0; e.length > s; s++)
						e[s].length > i && (i = e[s].length, a = s);
					return a
				}, n.setMonth(t(this._get(e, r.match(/MM/) ? "monthNames" : "monthNamesShort"))), n.setDate(t(this._get(e, r.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - n.getDay())),
				e.input.attr("size", this._formatDate(e, n).length)
			}
		},
		_inlineDatepicker : function (t, i) {
			var a = e(t);
			a.hasClass(this.markerClassName) || (a.addClass(this.markerClassName).append(i.dpDiv), e.data(t, r, i), this._setDate(i, this._getDefaultDate(i), !0), this._updateDatepicker(i), this._updateAlternate(i), i.settings.disabled && this._disableDatepicker(t), i.dpDiv.css("display", "block"))
		},
		_dialogDatepicker : function (t, i, a, n, o) {
			var u,
			c,
			h,
			l,
			d,
			p = this._dialogInst;
			return p || (this.uuid += 1, u = "dp" + this.uuid, this._dialogInput = e("<input type='text' id='" + u + "' style='position: absolute; top: -100px; width: 0px;'/>"), this._dialogInput.keydown(this._doKeyDown), e("body").append(this._dialogInput), p = this._dialogInst = this._newInst(this._dialogInput, !1), p.settings = {}, e.data(this._dialogInput[0], r, p)),
			s(p.settings, n || {}),
			i = i && i.constructor === Date ? this._formatDate(p, i) : i,
			this._dialogInput.val(i),
			this._pos = o ? o.length ? o : [o.pageX, o.pageY] : null,
			this._pos || (c = document.documentElement.clientWidth, h = document.documentElement.clientHeight, l = document.documentElement.scrollLeft || document.body.scrollLeft, d = document.documentElement.scrollTop || document.body.scrollTop, this._pos = [c / 2 - 100 + l, h / 2 - 150 + d]),
			this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"),
			p.settings.onSelect = a,
			this._inDialog = !0,
			this.dpDiv.addClass(this._dialogClass),
			this._showDatepicker(this._dialogInput[0]),
			e.blockUI && e.blockUI(this.dpDiv),
			e.data(this._dialogInput[0], r, p),
			this
		},
		_destroyDatepicker : function (t) {
			var i,
			a = e(t),
			s = e.data(t, r);
			a.hasClass(this.markerClassName) && (i = t.nodeName.toLowerCase(), e.removeData(t, r), "input" === i ? (s.append.remove(), s.trigger.remove(), a.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : ("div" === i || "span" === i) && a.removeClass(this.markerClassName).empty())
		},
		_enableDatepicker : function (t) {
			var i,
			a,
			s = e(t),
			n = e.data(t, r);
			s.hasClass(this.markerClassName) && (i = t.nodeName.toLowerCase(), "input" === i ? (t.disabled = !1, n.trigger.filter("button").each(function () {
						this.disabled = !1
					}).end().filter("img").css({
						opacity : "1.0",
						cursor : ""
					})) : ("div" === i || "span" === i) && (a = s.children("." + this._inlineClass), a.children().removeClass("ui-state-disabled"), a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)), this._disabledInputs = e.map(this._disabledInputs, function (e) {
						return e === t ? null : e
					}))
		},
		_disableDatepicker : function (t) {
			var i,
			a,
			s = e(t),
			n = e.data(t, r);
			s.hasClass(this.markerClassName) && (i = t.nodeName.toLowerCase(), "input" === i ? (t.disabled = !0, n.trigger.filter("button").each(function () {
						this.disabled = !0
					}).end().filter("img").css({
						opacity : "0.5",
						cursor : "default"
					})) : ("div" === i || "span" === i) && (a = s.children("." + this._inlineClass), a.children().addClass("ui-state-disabled"), a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)), this._disabledInputs = e.map(this._disabledInputs, function (e) {
						return e === t ? null : e
					}), this._disabledInputs[this._disabledInputs.length] = t)
		},
		_isDisabledDatepicker : function (e) {
			if (!e)
				return !1;
			for (var t = 0; this._disabledInputs.length > t; t++)
				if (this._disabledInputs[t] === e)
					return !0;
			return !1
		},
		_getInst : function (t) {
			try {
				return e.data(t, r)
			} catch (i) {
				throw "Missing instance data for this datepicker"
			}
		},
		_optionDatepicker : function (i, a, n) {
			var r,
			o,
			u,
			c,
			h = this._getInst(i);
			return 2 === arguments.length && "string" == typeof a ? "defaults" === a ? e.extend({}, e.datepicker._defaults) : h ? "all" === a ? e.extend({}, h.settings) : this._get(h, a) : null : (r = a || {}, "string" == typeof a && (r = {}, r[a] = n), h && (this._curInst === h && this._hideDatepicker(), o = this._getDateDatepicker(i, !0), u = this._getMinMaxDate(h, "min"), c = this._getMinMaxDate(h, "max"), s(h.settings, r), null !== u && r.dateFormat !== t && r.minDate === t && (h.settings.minDate = this._formatDate(h, u)), null !== c && r.dateFormat !== t && r.maxDate === t && (h.settings.maxDate = this._formatDate(h, c)), "disabled" in r && (r.disabled ? this._disableDatepicker(i) : this._enableDatepicker(i)), this._attachments(e(i), h), this._autoSize(h), this._setDate(h, o), this._updateAlternate(h), this._updateDatepicker(h)), t)
		},
		_changeDatepicker : function (e, t, i) {
			this._optionDatepicker(e, t, i)
		},
		_refreshDatepicker : function (e) {
			var t = this._getInst(e);
			t && this._updateDatepicker(t)
		},
		_setDateDatepicker : function (e, t) {
			var i = this._getInst(e);
			i && (this._setDate(i, t), this._updateDatepicker(i), this._updateAlternate(i))
		},
		_getDateDatepicker : function (e, t) {
			var i = this._getInst(e);
			return i && !i.inline && this._setDateFromField(i, t),
			i ? this._getDate(i) : null
		},
		_doKeyDown : function (t) {
			var i,
			a,
			s,
			n = e.datepicker._getInst(t.target),
			r = !0,
			o = n.dpDiv.is(".ui-datepicker-rtl");
			if (n._keyEvent = !0, e.datepicker._datepickerShowing)
				switch (t.keyCode) {
				case 9:
					e.datepicker._hideDatepicker(),
					r = !1;
					break;
				case 13:
					return s = e("td." + e.datepicker._dayOverClass + ":not(." + e.datepicker._currentClass + ")", n.dpDiv),
					s[0] && e.datepicker._selectDay(t.target, n.selectedMonth, n.selectedYear, s[0]),
					i = e.datepicker._get(n, "onSelect"),
					i ? (a = e.datepicker._formatDate(n), i.apply(n.input ? n.input[0] : null, [a, n])) : e.datepicker._hideDatepicker(),
					!1;
				case 27:
					e.datepicker._hideDatepicker();
					break;
				case 33:
					e.datepicker._adjustDate(t.target, t.ctrlKey ? -e.datepicker._get(n, "stepBigMonths") : -e.datepicker._get(n, "stepMonths"), "M");
					break;
				case 34:
					e.datepicker._adjustDate(t.target, t.ctrlKey ? +e.datepicker._get(n, "stepBigMonths") : +e.datepicker._get(n, "stepMonths"), "M");
					break;
				case 35:
					(t.ctrlKey || t.metaKey) && e.datepicker._clearDate(t.target),
					r = t.ctrlKey || t.metaKey;
					break;
				case 36:
					(t.ctrlKey || t.metaKey) && e.datepicker._gotoToday(t.target),
					r = t.ctrlKey || t.metaKey;
					break;
				case 37:
					(t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, o ? 1 : -1, "D"),
					r = t.ctrlKey || t.metaKey,
					t.originalEvent.altKey && e.datepicker._adjustDate(t.target, t.ctrlKey ? -e.datepicker._get(n, "stepBigMonths") : -e.datepicker._get(n, "stepMonths"), "M");
					break;
				case 38:
					(t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, -7, "D"),
					r = t.ctrlKey || t.metaKey;
					break;
				case 39:
					(t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, o ? -1 : 1, "D"),
					r = t.ctrlKey || t.metaKey,
					t.originalEvent.altKey && e.datepicker._adjustDate(t.target, t.ctrlKey ? +e.datepicker._get(n, "stepBigMonths") : +e.datepicker._get(n, "stepMonths"), "M");
					break;
				case 40:
					(t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, 7, "D"),
					r = t.ctrlKey || t.metaKey;
					break;
				default:
					r = !1
				}
			else
				36 === t.keyCode && t.ctrlKey ? e.datepicker._showDatepicker(this) : r = !1;
			r && (t.preventDefault(), t.stopPropagation())
		},
		_doKeyPress : function (i) {
			var a,
			s,
			n = e.datepicker._getInst(i.target);
			return e.datepicker._get(n, "constrainInput") ? (a = e.datepicker._possibleChars(e.datepicker._get(n, "dateFormat")), s = String.fromCharCode(null == i.charCode ? i.keyCode : i.charCode), i.ctrlKey || i.metaKey || " " > s || !a || a.indexOf(s) > -1) : t
		},
		_doKeyUp : function (t) {
			var i,
			a = e.datepicker._getInst(t.target);
			if (a.input.val() !== a.lastVal)
				try {
					i = e.datepicker.parseDate(e.datepicker._get(a, "dateFormat"), a.input ? a.input.val() : null, e.datepicker._getFormatConfig(a)),
					i && (e.datepicker._setDateFromField(a), e.datepicker._updateAlternate(a), e.datepicker._updateDatepicker(a))
				} catch (s) {}

			return !0
		},
		_showDatepicker : function (t) {
			if (t = t.target || t, "input" !== t.nodeName.toLowerCase() && (t = e("input", t.parentNode)[0]), !e.datepicker._isDisabledDatepicker(t) && e.datepicker._lastInput !== t) {
				var i,
				a,
				n,
				r,
				o,
				u,
				c;
				i = e.datepicker._getInst(t),
				e.datepicker._curInst && e.datepicker._curInst !== i && (e.datepicker._curInst.dpDiv.stop(!0, !0), i && e.datepicker._datepickerShowing && e.datepicker._hideDatepicker(e.datepicker._curInst.input[0])),
				a = e.datepicker._get(i, "beforeShow"),
				n = a ? a.apply(t, [t, i]) : {},
				n !== !1 && (s(i.settings, n), i.lastVal = null, e.datepicker._lastInput = t, e.datepicker._setDateFromField(i), e.datepicker._inDialog && (t.value = ""), e.datepicker._pos || (e.datepicker._pos = e.datepicker._findPos(t), e.datepicker._pos[1] += t.offsetHeight), r = !1, e(t).parents().each(function () {
						return r |= "fixed" === e(this).css("position"),
						!r
					}), o = {
						left : e.datepicker._pos[0],
						top : e.datepicker._pos[1]
					}, e.datepicker._pos = null, i.dpDiv.empty(), i.dpDiv.css({
						position : "absolute",
						display : "block",
						top : "-1000px"
					}), e.datepicker._updateDatepicker(i), o = e.datepicker._checkOffset(i, o, r), i.dpDiv.css({
						position : e.datepicker._inDialog && e.blockUI ? "static" : r ? "fixed" : "absolute",
						display : "none",
						left : o.left + "px",
						top : o.top + "px"
					}), i.inline || (u = e.datepicker._get(i, "showAnim"), c = e.datepicker._get(i, "duration"), i.dpDiv.zIndex(e(t).zIndex() + 1), e.datepicker._datepickerShowing = !0, e.effects && e.effects.effect[u] ? i.dpDiv.show(u, e.datepicker._get(i, "showOptions"), c) : i.dpDiv[u || "show"](u ? c : null), e.datepicker._shouldFocusInput(i) && i.input.focus(), e.datepicker._curInst = i))
			}
		},
		_updateDatepicker : function (t) {
			this.maxRows = 4,
			n = t,
			t.dpDiv.empty().append(this._generateHTML(t)),
			this._attachHandlers(t),
			t.dpDiv.find("." + this._dayOverClass + " a").mouseover();
			var i,
			a = this._getNumberOfMonths(t),
			s = a[1],
			r = 17;
			t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),
			s > 1 && t.dpDiv.addClass("ui-datepicker-multi-" + s).css("width", r * s + "em"),
			t.dpDiv[(1 !== a[0] || 1 !== a[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi"),
			t.dpDiv[(this._get(t, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"),
			t === e.datepicker._curInst && e.datepicker._datepickerShowing && e.datepicker._shouldFocusInput(t) && t.input.focus(),
			t.yearshtml && (i = t.yearshtml, setTimeout(function () {
					i === t.yearshtml && t.yearshtml && t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml),
					i = t.yearshtml = null
				}, 0))
		},
		_shouldFocusInput : function (e) {
			return e.input && e.input.is(":visible") && !e.input.is(":disabled") && !e.input.is(":focus")
		},
		_checkOffset : function (t, i, a) {
			var s = t.dpDiv.outerWidth(),
			n = t.dpDiv.outerHeight(),
			r = t.input ? t.input.outerWidth() : 0,
			o = t.input ? t.input.outerHeight() : 0,
			u = document.documentElement.clientWidth + (a ? 0 : e(document).scrollLeft()),
			c = document.documentElement.clientHeight + (a ? 0 : e(document).scrollTop());
			return i.left -= this._get(t, "isRTL") ? s - r : 0,
			i.left -= a && i.left === t.input.offset().left ? e(document).scrollLeft() : 0,
			i.top -= a && i.top === t.input.offset().top + o ? e(document).scrollTop() : 0,
			i.left -= Math.min(i.left, i.left + s > u && u > s ? Math.abs(i.left + s - u) : 0),
			i.top -= Math.min(i.top, i.top + n > c && c > n ? Math.abs(n + o) : 0),
			i
		},
		_findPos : function (t) {
			for (var i, a = this._getInst(t), s = this._get(a, "isRTL"); t && ("hidden" === t.type || 1 !== t.nodeType || e.expr.filters.hidden(t)); )
				t = t[s ? "previousSibling" : "nextSibling"];
			return i = e(t).offset(),
			[i.left, i.top]
		},
		_hideDatepicker : function (t) {
			var i,
			a,
			s,
			n,
			o = this._curInst;
			!o || t && o !== e.data(t, r) || this._datepickerShowing && (i = this._get(o, "showAnim"), a = this._get(o, "duration"), s = function () {
				e.datepicker._tidyDialog(o)
			}, e.effects && (e.effects.effect[i] || e.effects[i]) ? o.dpDiv.hide(i, e.datepicker._get(o, "showOptions"), a, s) : o.dpDiv["slideDown" === i ? "slideUp" : "fadeIn" === i ? "fadeOut" : "hide"](i ? a : null, s), i || s(), this._datepickerShowing = !1, n = this._get(o, "onClose"), n && n.apply(o.input ? o.input[0] : null, [o.input ? o.input.val() : "", o]), this._lastInput = null, this._inDialog && (this._dialogInput.css({
						position : "absolute",
						left : "0",
						top : "-100px"
					}), e.blockUI && (e.unblockUI(), e("body").append(this.dpDiv))), this._inDialog = !1)
		},
		_tidyDialog : function (e) {
			e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
		},
		_checkExternalClick : function (t) {
			if (e.datepicker._curInst) {
				var i = e(t.target),
				a = e.datepicker._getInst(i[0]);
				(i[0].id !== e.datepicker._mainDivId && 0 === i.parents("#" + e.datepicker._mainDivId).length && !i.hasClass(e.datepicker.markerClassName) && !i.closest("." + e.datepicker._triggerClass).length && e.datepicker._datepickerShowing && (!e.datepicker._inDialog || !e.blockUI) || i.hasClass(e.datepicker.markerClassName) && e.datepicker._curInst !== a) && e.datepicker._hideDatepicker()
			}
		},
		_adjustDate : function (t, i, a) {
			var s = e(t),
			n = this._getInst(s[0]);
			this._isDisabledDatepicker(s[0]) || (this._adjustInstDate(n, i + ("M" === a ? this._get(n, "showCurrentAtPos") : 0), a), this._updateDatepicker(n))
		},
		_gotoToday : function (t) {
			var i,
			a = e(t),
			s = this._getInst(a[0]);
			this._get(s, "gotoCurrent") && s.currentDay ? (s.selectedDay = s.currentDay, s.drawMonth = s.selectedMonth = s.currentMonth, s.drawYear = s.selectedYear = s.currentYear) : (i = new Date, s.selectedDay = i.getDate(), s.drawMonth = s.selectedMonth = i.getMonth(), s.drawYear = s.selectedYear = i.getFullYear()),
			this._notifyChange(s),
			this._adjustDate(a)
		},
		_selectMonthYear : function (t, i, a) {
			var s = e(t),
			n = this._getInst(s[0]);
			n["selected" + ("M" === a ? "Month" : "Year")] = n["draw" + ("M" === a ? "Month" : "Year")] = parseInt(i.options[i.selectedIndex].value, 10),
			this._notifyChange(n),
			this._adjustDate(s)
		},
		_selectDay : function (t, i, a, s) {
			var n,
			r = e(t);
			e(s).hasClass(this._unselectableClass) || this._isDisabledDatepicker(r[0]) || (n = this._getInst(r[0]), n.selectedDay = n.currentDay = e("a", s).html(), n.selectedMonth = n.currentMonth = i, n.selectedYear = n.currentYear = a, this._selectDate(t, this._formatDate(n, n.currentDay, n.currentMonth, n.currentYear)))
		},
		_clearDate : function (t) {
			var i = e(t);
			this._selectDate(i, "")
		},
		_selectDate : function (t, i) {
			var a,
			s = e(t),
			n = this._getInst(s[0]);
			i = null != i ? i : this._formatDate(n),
			n.input && n.input.val(i),
			this._updateAlternate(n),
			a = this._get(n, "onSelect"),
			a ? a.apply(n.input ? n.input[0] : null, [i, n]) : n.input && n.input.trigger("change"),
			n.inline ? this._updateDatepicker(n) : (this._hideDatepicker(), this._lastInput = n.input[0], "object" != typeof n.input[0] && n.input.focus(), this._lastInput = null)
		},
		_updateAlternate : function (t) {
			var i,
			a,
			s,
			n = this._get(t, "altField");
			n && (i = this._get(t, "altFormat") || this._get(t, "dateFormat"), a = this._getDate(t), s = this.formatDate(i, a, this._getFormatConfig(t)), e(n).each(function () {
					e(this).val(s)
				}))
		},
		noWeekends : function (e) {
			var t = e.getDay();
			return [t > 0 && 6 > t, ""]
		},
		iso8601Week : function (e) {
			var t,
			i = new Date(e.getTime());
			return i.setDate(i.getDate() + 4 - (i.getDay() || 7)),
			t = i.getTime(),
			i.setMonth(0),
			i.setDate(1),
			Math.floor(Math.round((t - i) / 864e5) / 7) + 1
		},
		parseDate : function (i, a, s) {
			if (null == i || null == a)
				throw "Invalid arguments";
			if (a = "object" == typeof a ? "" + a : a + "", "" === a)
				return null;
			var n,
			r,
			o,
			u,
			c = 0,
			h = (s ? s.shortYearCutoff : null) || this._defaults.shortYearCutoff,
			l = "string" != typeof h ? h : (new Date).getFullYear() % 100 + parseInt(h, 10),
			d = (s ? s.dayNamesShort : null) || this._defaults.dayNamesShort,
			p = (s ? s.dayNames : null) || this._defaults.dayNames,
			g = (s ? s.monthNamesShort : null) || this._defaults.monthNamesShort,
			m = (s ? s.monthNames : null) || this._defaults.monthNames,
			f = -1,
			_ = -1,
			v = -1,
			k = -1,
			y = !1,
			b = function (e) {
				var t = i.length > n + 1 && i.charAt(n + 1) === e;
				return t && n++,
				t
			},
			D = function (e) {
				var t = b(e),
				i = "@" === e ? 14 : "!" === e ? 20 : "y" === e && t ? 4 : "o" === e ? 3 : 2,
				s = RegExp("^\\d{1," + i + "}"),
				n = a.substring(c).match(s);
				if (!n)
					throw "Missing number at position " + c;
				return c += n[0].length,
				parseInt(n[0], 10)
			},
			w = function (i, s, n) {
				var r = -1,
				o = e.map(b(i) ? n : s, function (e, t) {
						return [[t, e]]
					}).sort(function (e, t) {
						return  - (e[1].length - t[1].length)
					});
				if (e.each(o, function (e, i) {
						var s = i[1];
						return a.substr(c, s.length).toLowerCase() === s.toLowerCase() ? (r = i[0], c += s.length, !1) : t
					}), -1 !== r)
					return r + 1;
				throw "Unknown name at position " + c
			},
			M = function () {
				if (a.charAt(c) !== i.charAt(n))
					throw "Unexpected literal at position " + c;
				c++
			};
			for (n = 0; i.length > n; n++)
				if (y)
					"'" !== i.charAt(n) || b("'") ? M() : y = !1;
				else
					switch (i.charAt(n)) {
					case "d":
						v = D("d");
						break;
					case "D":
						w("D", d, p);
						break;
					case "o":
						k = D("o");
						break;
					case "m":
						_ = D("m");
						break;
					case "M":
						_ = w("M", g, m);
						break;
					case "y":
						f = D("y");
						break;
					case "@":
						u = new Date(D("@")),
						f = u.getFullYear(),
						_ = u.getMonth() + 1,
						v = u.getDate();
						break;
					case "!":
						u = new Date((D("!") - this._ticksTo1970) / 1e4),
						f = u.getFullYear(),
						_ = u.getMonth() + 1,
						v = u.getDate();
						break;
					case "'":
						b("'") ? M() : y = !0;
						break;
					default:
						M()
					}
			if (a.length > c && (o = a.substr(c), !/^\s+/.test(o)))
				throw "Extra/unparsed characters found in date: " + o;
			if (-1 === f ? f = (new Date).getFullYear() : 100 > f && (f += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (l >= f ? 0 : -100)), k > -1)
				for (_ = 1, v = k; ; ) {
					if (r = this._getDaysInMonth(f, _ - 1), r >= v)
						break;
					_++,
					v -= r
				}
			if (u = this._daylightSavingAdjust(new Date(f, _ - 1, v)), u.getFullYear() !== f || u.getMonth() + 1 !== _ || u.getDate() !== v)
				throw "Invalid date";
			return u
		},
		ATOM : "yy-mm-dd",
		COOKIE : "D, dd M yy",
		ISO_8601 : "yy-mm-dd",
		RFC_822 : "D, d M y",
		RFC_850 : "DD, dd-M-y",
		RFC_1036 : "D, d M y",
		RFC_1123 : "D, d M yy",
		RFC_2822 : "D, d M yy",
		RSS : "D, d M y",
		TICKS : "!",
		TIMESTAMP : "@",
		W3C : "yy-mm-dd",
		_ticksTo1970 : 1e7 * 60 * 60 * 24 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)),
		formatDate : function (e, t, i) {
			if (!t)
				return "";
			var a,
			s = (i ? i.dayNamesShort : null) || this._defaults.dayNamesShort,
			n = (i ? i.dayNames : null) || this._defaults.dayNames,
			r = (i ? i.monthNamesShort : null) || this._defaults.monthNamesShort,
			o = (i ? i.monthNames : null) || this._defaults.monthNames,
			u = function (t) {
				var i = e.length > a + 1 && e.charAt(a + 1) === t;
				return i && a++,
				i
			},
			c = function (e, t, i) {
				var a = "" + t;
				if (u(e))
					for (; i > a.length; )
						a = "0" + a;
				return a
			},
			h = function (e, t, i, a) {
				return u(e) ? a[t] : i[t]
			},
			l = "",
			d = !1;
			if (t)
				for (a = 0; e.length > a; a++)
					if (d)
						"'" !== e.charAt(a) || u("'") ? l += e.charAt(a) : d = !1;
					else
						switch (e.charAt(a)) {
						case "d":
							l += c("d", t.getDate(), 2);
							break;
						case "D":
							l += h("D", t.getDay(), s, n);
							break;
						case "o":
							l += c("o", Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime() - new Date(t.getFullYear(), 0, 0).getTime()) / 864e5), 3);
							break;
						case "m":
							l += c("m", t.getMonth() + 1, 2);
							break;
						case "M":
							l += h("M", t.getMonth(), r, o);
							break;
						case "y":
							l += u("y") ? t.getFullYear() : (10 > t.getYear() % 100 ? "0" : "") + t.getYear() % 100;
							break;
						case "@":
							l += t.getTime();
							break;
						case "!":
							l += 1e4 * t.getTime() + this._ticksTo1970;
							break;
						case "'":
							u("'") ? l += "'" : d = !0;
							break;
						default:
							l += e.charAt(a)
						}
			return l
		},
		_possibleChars : function (e) {
			var t,
			i = "",
			a = !1,
			s = function (i) {
				var a = e.length > t + 1 && e.charAt(t + 1) === i;
				return a && t++,
				a
			};
			for (t = 0; e.length > t; t++)
				if (a)
					"'" !== e.charAt(t) || s("'") ? i += e.charAt(t) : a = !1;
				else
					switch (e.charAt(t)) {
					case "d":
					case "m":
					case "y":
					case "@":
						i += "0123456789";
						break;
					case "D":
					case "M":
						return null;
					case "'":
						s("'") ? i += "'" : a = !0;
						break;
					default:
						i += e.charAt(t)
					}
			return i
		},
		_get : function (e, i) {
			return e.settings[i] !== t ? e.settings[i] : this._defaults[i]
		},
		_setDateFromField : function (e, t) {
			if (e.input.val() !== e.lastVal) {
				var i = this._get(e, "dateFormat"),
				a = e.lastVal = e.input ? e.input.val() : null,
				s = this._getDefaultDate(e),
				n = s,
				r = this._getFormatConfig(e);
				try {
					n = this.parseDate(i, a, r) || s
				} catch (o) {
					a = t ? "" : a
				}
				e.selectedDay = n.getDate(),
				e.drawMonth = e.selectedMonth = n.getMonth(),
				e.drawYear = e.selectedYear = n.getFullYear(),
				e.currentDay = a ? n.getDate() : 0,
				e.currentMonth = a ? n.getMonth() : 0,
				e.currentYear = a ? n.getFullYear() : 0,
				this._adjustInstDate(e)
			}
		},
		_getDefaultDate : function (e) {
			return this._restrictMinMax(e, this._determineDate(e, this._get(e, "defaultDate"), new Date))
		},
		_determineDate : function (t, i, a) {
			var s = function (e) {
				var t = new Date;
				return t.setDate(t.getDate() + e),
				t
			},
			n = function (i) {
				try {
					return e.datepicker.parseDate(e.datepicker._get(t, "dateFormat"), i, e.datepicker._getFormatConfig(t))
				} catch (a) {}

				for (var s = (i.toLowerCase().match(/^c/) ? e.datepicker._getDate(t) : null) || new Date, n = s.getFullYear(), r = s.getMonth(), o = s.getDate(), u = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, c = u.exec(i); c; ) {
					switch (c[2] || "d") {
					case "d":
					case "D":
						o += parseInt(c[1], 10);
						break;
					case "w":
					case "W":
						o += 7 * parseInt(c[1], 10);
						break;
					case "m":
					case "M":
						r += parseInt(c[1], 10),
						o = Math.min(o, e.datepicker._getDaysInMonth(n, r));
						break;
					case "y":
					case "Y":
						n += parseInt(c[1], 10),
						o = Math.min(o, e.datepicker._getDaysInMonth(n, r))
					}
					c = u.exec(i)
				}
				return new Date(n, r, o)
			},
			r = null == i || "" === i ? a : "string" == typeof i ? n(i) : "number" == typeof i ? isNaN(i) ? a : s(i) : new Date(i.getTime());
			return r = r && "Invalid Date" == "" + r ? a : r,
			r && (r.setHours(0), r.setMinutes(0), r.setSeconds(0), r.setMilliseconds(0)),
			this._daylightSavingAdjust(r)
		},
		_daylightSavingAdjust : function (e) {
			return e ? (e.setHours(e.getHours() > 12 ? e.getHours() + 2 : 0), e) : null
		},
		_setDate : function (e, t, i) {
			var a = !t,
			s = e.selectedMonth,
			n = e.selectedYear,
			r = this._restrictMinMax(e, this._determineDate(e, t, new Date));
			e.selectedDay = e.currentDay = r.getDate(),
			e.drawMonth = e.selectedMonth = e.currentMonth = r.getMonth(),
			e.drawYear = e.selectedYear = e.currentYear = r.getFullYear(),
			s === e.selectedMonth && n === e.selectedYear || i || this._notifyChange(e),
			this._adjustInstDate(e),
			e.input && e.input.val(a ? "" : this._formatDate(e))
		},
		_getDate : function (e) {
			var t = !e.currentYear || e.input && "" === e.input.val() ? null : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay));
			return t
		},
		_attachHandlers : function (t) {
			var i = this._get(t, "stepMonths"),
			a = "#" + t.id.replace(/\\\\/g, "\\");
			t.dpDiv.find("[data-handler]").map(function () {
				var t = {
					prev : function () {
						e.datepicker._adjustDate(a, -i, "M")
					},
					next : function () {
						e.datepicker._adjustDate(a, +i, "M")
					},
					hide : function () {
						e.datepicker._hideDatepicker()
					},
					today : function () {
						e.datepicker._gotoToday(a)
					},
					selectDay : function () {
						return e.datepicker._selectDay(a, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this),
						!1
					},
					selectMonth : function () {
						return e.datepicker._selectMonthYear(a, this, "M"),
						!1
					},
					selectYear : function () {
						return e.datepicker._selectMonthYear(a, this, "Y"),
						!1
					}
				};
				e(this).bind(this.getAttribute("data-event"), t[this.getAttribute("data-handler")])
			})
		},
		_generateHTML : function (e) {
			var t,
			i,
			a,
			s,
			n,
			r,
			o,
			u,
			c,
			h,
			l,
			d,
			p,
			g,
			m,
			f,
			_,
			v,
			k,
			y,
			b,
			D,
			w,
			M,
			C,
			x,
			I,
			N,
			T,
			A,
			E,
			S,
			Y,
			F,
			P,
			O,
			j,
			K,
			R,
			H = new Date,
			W = this._daylightSavingAdjust(new Date(H.getFullYear(), H.getMonth(), H.getDate())),
			L = this._get(e, "isRTL"),
			U = this._get(e, "showButtonPanel"),
			B = this._get(e, "hideIfNoPrevNext"),
			z = this._get(e, "navigationAsDateFormat"),
			q = this._getNumberOfMonths(e),
			G = this._get(e, "showCurrentAtPos"),
			J = this._get(e, "stepMonths"),
			Q = 1 !== q[0] || 1 !== q[1],
			V = this._daylightSavingAdjust(e.currentDay ? new Date(e.currentYear, e.currentMonth, e.currentDay) : new Date(9999, 9, 9)),
			$ = this._getMinMaxDate(e, "min"),
			X = this._getMinMaxDate(e, "max"),
			Z = e.drawMonth - G,
			et = e.drawYear;
			if (0 > Z && (Z += 12, et--), X)
				for (t = this._daylightSavingAdjust(new Date(X.getFullYear(), X.getMonth() - q[0] * q[1] + 1, X.getDate())), t = $ && $ > t ? $ : t; this._daylightSavingAdjust(new Date(et, Z, 1)) > t; )
					Z--, 0 > Z && (Z = 11, et--);
			for (e.drawMonth = Z, e.drawYear = et, i = this._get(e, "prevText"), i = z ? this.formatDate(i, this._daylightSavingAdjust(new Date(et, Z - J, 1)), this._getFormatConfig(e)) : i, a = this._canAdjustMonth(e, -1, et, Z) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + i + "'><span class='ui-icon ui-icon-circle-triangle-" + (L ? "e" : "w") + "'>" + i + "</span></a>" : B ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + i + "'><span class='ui-icon ui-icon-circle-triangle-" + (L ? "e" : "w") + "'>" + i + "</span></a>", s = this._get(e, "nextText"), s = z ? this.formatDate(s, this._daylightSavingAdjust(new Date(et, Z + J, 1)), this._getFormatConfig(e)) : s, n = this._canAdjustMonth(e, 1, et, Z) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + s + "'><span class='ui-icon ui-icon-circle-triangle-" + (L ? "w" : "e") + "'>" + s + "</span></a>" : B ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + s + "'><span class='ui-icon ui-icon-circle-triangle-" + (L ? "w" : "e") + "'>" + s + "</span></a>", r = this._get(e, "currentText"), o = this._get(e, "gotoCurrent") && e.currentDay ? V : W, r = z ? this.formatDate(r, o, this._getFormatConfig(e)) : r, u = e.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(e, "closeText") + "</button>", c = U ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (L ? u : "") + (this._isInRange(e, o) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + r + "</button>" : "") + (L ? "" : u) + "</div>" : "", h = parseInt(this._get(e, "firstDay"), 10), h = isNaN(h) ? 0 : h, l = this._get(e, "showWeek"), d = this._get(e, "dayNames"), p = this._get(e, "dayNamesMin"), g = this._get(e, "monthNames"), m = this._get(e, "monthNamesShort"), f = this._get(e, "beforeShowDay"), _ = this._get(e, "showOtherMonths"), v = this._get(e, "selectOtherMonths"), k = this._getDefaultDate(e), y = "", D = 0; q[0] > D; D++) {
				for (w = "", this.maxRows = 4, M = 0; q[1] > M; M++) {
					if (C = this._daylightSavingAdjust(new Date(et, Z, e.selectedDay)), x = " ui-corner-all", I = "", Q) {
						if (I += "<div class='ui-datepicker-group", q[1] > 1)
							switch (M) {
							case 0:
								I += " ui-datepicker-group-first",
								x = " ui-corner-" + (L ? "right" : "left");
								break;
							case q[1] - 1:
								I += " ui-datepicker-group-last",
								x = " ui-corner-" + (L ? "left" : "right");
								break;
							default:
								I += " ui-datepicker-group-middle",
								x = ""
							}
						I += "'>"
					}
					for (I += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + x + "'>" + (/all|left/.test(x) && 0 === D ? L ? n : a : "") + (/all|right/.test(x) && 0 === D ? L ? a : n : "") + this._generateMonthYearHeader(e, Z, et, $, X, D > 0 || M > 0, g, m) + "</div><table class='ui-datepicker-calendar'><thead>" + "<tr>", N = l ? "<th class='ui-datepicker-week-col'>" + this._get(e, "weekHeader") + "</th>" : "", b = 0; 7 > b; b++)
						T = (b + h) % 7, N += "<th" + ((b + h + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" + "<span title='" + d[T] + "'>" + p[T] + "</span></th>";
					for (I += N + "</tr></thead><tbody>", A = this._getDaysInMonth(et, Z), et === e.selectedYear && Z === e.selectedMonth && (e.selectedDay = Math.min(e.selectedDay, A)), E = (this._getFirstDayOfMonth(et, Z) - h + 7) % 7, S = Math.ceil((E + A) / 7), Y = Q ? this.maxRows > S ? this.maxRows : S : S, this.maxRows = Y, F = this._daylightSavingAdjust(new Date(et, Z, 1 - E)), P = 0; Y > P; P++) {
						for (I += "<tr>", O = l ? "<td class='ui-datepicker-week-col'>" + this._get(e, "calculateWeek")(F) + "</td>" : "", b = 0; 7 > b; b++)
							j = f ? f.apply(e.input ? e.input[0] : null, [F]) : [!0, ""], K = F.getMonth() !== Z, R = K && !v || !j[0] || $ && $ > F || X && F > X, O += "<td class='" + ((b + h + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (K ? " ui-datepicker-other-month" : "") + (F.getTime() === C.getTime() && Z === e.selectedMonth && e._keyEvent || k.getTime() === F.getTime() && k.getTime() === C.getTime() ? " " + this._dayOverClass : "") + (R ? " " + this._unselectableClass + " ui-state-disabled" : "") + (K && !_ ? "" : " " + j[1] + (F.getTime() === V.getTime() ? " " + this._currentClass : "") + (F.getTime() === W.getTime() ? " ui-datepicker-today" : "")) + "'" + (K && !_ || !j[2] ? "" : " title='" + j[2].replace(/'/g, "&#39;") + "'") + (R ? "" : " data-handler='selectDay' data-event='click' data-month='" + F.getMonth() + "' data-year='" + F.getFullYear() + "'") + ">" + (K && !_ ? "&#xa0;" : R ? "<span class='ui-state-default'>" + F.getDate() + "</span>" : "<a class='ui-state-default" + (F.getTime() === W.getTime() ? " ui-state-highlight" : "") + (F.getTime() === V.getTime() ? " ui-state-active" : "") + (K ? " ui-priority-secondary" : "") + "' href='#'>" + F.getDate() + "</a>") + "</td>", F.setDate(F.getDate() + 1), F = this._daylightSavingAdjust(F);
						I += O + "</tr>"
					}
					Z++,
					Z > 11 && (Z = 0, et++),
					I += "</tbody></table>" + (Q ? "</div>" + (q[0] > 0 && M === q[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : ""),
					w += I
				}
				y += w
			}
			return y += c,
			e._keyEvent = !1,
			y
		},
		_generateMonthYearHeader : function (e, t, i, a, s, n, r, o) {
			var u,
			c,
			h,
			l,
			d,
			p,
			g,
			m,
			f = this._get(e, "changeMonth"),
			_ = this._get(e, "changeYear"),
			v = this._get(e, "showMonthAfterYear"),
			k = "<div class='ui-datepicker-title'>",
			y = "";
			if (n || !f)
				y += "<span class='ui-datepicker-month'>" + r[t] + "</span>";
			else {
				for (u = a && a.getFullYear() === i, c = s && s.getFullYear() === i, y += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>", h = 0; 12 > h; h++)
					(!u || h >= a.getMonth()) && (!c || s.getMonth() >= h) && (y += "<option value='" + h + "'" + (h === t ? " selected='selected'" : "") + ">" + o[h] + "</option>");
				y += "</select>"
			}
			if (v || (k += y + (!n && f && _ ? "" : "&#xa0;")), !e.yearshtml)
				if (e.yearshtml = "", n || !_)
					k += "<span class='ui-datepicker-year'>" + i + "</span>";
				else {
					for (l = this._get(e, "yearRange").split(":"), d = (new Date).getFullYear(), p = function (e) {
						var t = e.match(/c[+\-].*/) ? i + parseInt(e.substring(1), 10) : e.match(/[+\-].*/) ? d + parseInt(e, 10) : parseInt(e, 10);
						return isNaN(t) ? d : t
					}, g = p(l[0]), m = Math.max(g, p(l[1] || "")), g = a ? Math.max(g, a.getFullYear()) : g, m = s ? Math.min(m, s.getFullYear()) : m, e.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>"; m >= g; g++)
						e.yearshtml += "<option value='" + g + "'" + (g === i ? " selected='selected'" : "") + ">" + g + "</option>";
					e.yearshtml += "</select>",
					k += e.yearshtml,
					e.yearshtml = null
				}
			return k += this._get(e, "yearSuffix"),
			v && (k += (!n && f && _ ? "" : "&#xa0;") + y),
			k += "</div>"
		},
		_adjustInstDate : function (e, t, i) {
			var a = e.drawYear + ("Y" === i ? t : 0),
			s = e.drawMonth + ("M" === i ? t : 0),
			n = Math.min(e.selectedDay, this._getDaysInMonth(a, s)) + ("D" === i ? t : 0),
			r = this._restrictMinMax(e, this._daylightSavingAdjust(new Date(a, s, n)));
			e.selectedDay = r.getDate(),
			e.drawMonth = e.selectedMonth = r.getMonth(),
			e.drawYear = e.selectedYear = r.getFullYear(),
			("M" === i || "Y" === i) && this._notifyChange(e)
		},
		_restrictMinMax : function (e, t) {
			var i = this._getMinMaxDate(e, "min"),
			a = this._getMinMaxDate(e, "max"),
			s = i && i > t ? i : t;
			return a && s > a ? a : s
		},
		_notifyChange : function (e) {
			var t = this._get(e, "onChangeMonthYear");
			t && t.apply(e.input ? e.input[0] : null, [e.selectedYear, e.selectedMonth + 1, e])
		},
		_getNumberOfMonths : function (e) {
			var t = this._get(e, "numberOfMonths");
			return null == t ? [1, 1] : "number" == typeof t ? [1, t] : t
		},
		_getMinMaxDate : function (e, t) {
			return this._determineDate(e, this._get(e, t + "Date"), null)
		},
		_getDaysInMonth : function (e, t) {
			return 32 - this._daylightSavingAdjust(new Date(e, t, 32)).getDate()
		},
		_getFirstDayOfMonth : function (e, t) {
			return new Date(e, t, 1).getDay()
		},
		_canAdjustMonth : function (e, t, i, a) {
			var s = this._getNumberOfMonths(e),
			n = this._daylightSavingAdjust(new Date(i, a + (0 > t ? t : s[0] * s[1]), 1));
			return 0 > t && n.setDate(this._getDaysInMonth(n.getFullYear(), n.getMonth())),
			this._isInRange(e, n)
		},
		_isInRange : function (e, t) {
			var i,
			a,
			s = this._getMinMaxDate(e, "min"),
			n = this._getMinMaxDate(e, "max"),
			r = null,
			o = null,
			u = this._get(e, "yearRange");
			return u && (i = u.split(":"), a = (new Date).getFullYear(), r = parseInt(i[0], 10), o = parseInt(i[1], 10), i[0].match(/[+\-].*/) && (r += a), i[1].match(/[+\-].*/) && (o += a)),
			(!s || t.getTime() >= s.getTime()) && (!n || t.getTime() <= n.getTime()) && (!r || t.getFullYear() >= r) && (!o || o >= t.getFullYear())
		},
		_getFormatConfig : function (e) {
			var t = this._get(e, "shortYearCutoff");
			return t = "string" != typeof t ? t : (new Date).getFullYear() % 100 + parseInt(t, 10), {
				shortYearCutoff : t,
				dayNamesShort : this._get(e, "dayNamesShort"),
				dayNames : this._get(e, "dayNames"),
				monthNamesShort : this._get(e, "monthNamesShort"),
				monthNames : this._get(e, "monthNames")
			}
		},
		_formatDate : function (e, t, i, a) {
			t || (e.currentDay = e.selectedDay, e.currentMonth = e.selectedMonth, e.currentYear = e.selectedYear);
			var s = t ? "object" == typeof t ? t : this._daylightSavingAdjust(new Date(a, i, t)) : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay));
			return this.formatDate(this._get(e, "dateFormat"), s, this._getFormatConfig(e))
		}
	}),
	e.fn.datepicker = function (t) {
		if (!this.length)
			return this;
		e.datepicker.initialized || (e(document).mousedown(e.datepicker._checkExternalClick), e.datepicker.initialized = !0),
		0 === e("#" + e.datepicker._mainDivId).length && e("body").append(e.datepicker.dpDiv);
		var i = Array.prototype.slice.call(arguments, 1);
		return "string" != typeof t || "isDisabled" !== t && "getDate" !== t && "widget" !== t ? "option" === t && 2 === arguments.length && "string" == typeof arguments[1] ? e.datepicker["_" + t + "Datepicker"].apply(e.datepicker, [this[0]].concat(i)) : this.each(function () {
			"string" == typeof t ? e.datepicker["_" + t + "Datepicker"].apply(e.datepicker, [this].concat(i)) : e.datepicker._attachDatepicker(this, t)
		}) : e.datepicker["_" + t + "Datepicker"].apply(e.datepicker, [this[0]].concat(i))
	},
	e.datepicker = new i,
	e.datepicker.initialized = !1,
	e.datepicker.uuid = (new Date).getTime(),
	e.datepicker.version = "1.10.4"
})(jQuery);
(function (t) {
	t.widget("ui.menu", {
		version : "1.10.4",
		defaultElement : "<ul>",
		delay : 300,
		options : {
			icons : {
				submenu : "ui-icon-carat-1-e"
			},
			menus : "ul",
			position : {
				my : "left top",
				at : "right top"
			},
			role : "menu",
			blur : null,
			focus : null,
			select : null
		},
		_create : function () {
			this.activeMenu = this.element,
			this.mouseHandled = !1,
			this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({
				role : this.options.role,
				tabIndex : 0
			}).bind("click" + this.eventNamespace, t.proxy(function (t) {
					this.options.disabled && t.preventDefault()
				}, this)),
			this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled", "true"),
			this._on({
				"mousedown .ui-menu-item > a" : function (t) {
					t.preventDefault()
				},
				"click .ui-state-disabled > a" : function (t) {
					t.preventDefault()
				},
				"click .ui-menu-item:has(a)" : function (e) {
					var i = t(e.target).closest(".ui-menu-item");
					!this.mouseHandled && i.not(".ui-state-disabled").length && (this.select(e), e.isPropagationStopped() || (this.mouseHandled = !0), i.has(".ui-menu").length ? this.expand(e) : !this.element.is(":focus") && t(this.document[0].activeElement).closest(".ui-menu").length && (this.element.trigger("focus", [!0]), this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer)))
				},
				"mouseenter .ui-menu-item" : function (e) {
					var i = t(e.currentTarget);
					i.siblings().children(".ui-state-active").removeClass("ui-state-active"),
					this.focus(e, i)
				},
				mouseleave : "collapseAll",
				"mouseleave .ui-menu" : "collapseAll",
				focus : function (t, e) {
					var i = this.active || this.element.children(".ui-menu-item").eq(0);
					e || this.focus(t, i)
				},
				blur : function (e) {
					this._delay(function () {
						t.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(e)
					})
				},
				keydown : "_keydown"
			}),
			this.refresh(),
			this._on(this.document, {
				click : function (e) {
					t(e.target).closest(".ui-menu").length || this.collapseAll(e),
					this.mouseHandled = !1
				}
			})
		},
		_destroy : function () {
			this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),
			this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function () {
				var e = t(this);
				e.data("ui-menu-submenu-carat") && e.remove()
			}),
			this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")
		},
		_keydown : function (e) {
			function i(t) {
				return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
			}
			var s,
			n,
			a,
			o,
			r,
			l = !0;
			switch (e.keyCode) {
			case t.ui.keyCode.PAGE_UP:
				this.previousPage(e);
				break;
			case t.ui.keyCode.PAGE_DOWN:
				this.nextPage(e);
				break;
			case t.ui.keyCode.HOME:
				this._move("first", "first", e);
				break;
			case t.ui.keyCode.END:
				this._move("last", "last", e);
				break;
			case t.ui.keyCode.UP:
				this.previous(e);
				break;
			case t.ui.keyCode.DOWN:
				this.next(e);
				break;
			case t.ui.keyCode.LEFT:
				this.collapse(e);
				break;
			case t.ui.keyCode.RIGHT:
				this.active && !this.active.is(".ui-state-disabled") && this.expand(e);
				break;
			case t.ui.keyCode.ENTER:
			case t.ui.keyCode.SPACE:
				this._activate(e);
				break;
			case t.ui.keyCode.ESCAPE:
				this.collapse(e);
				break;
			default:
				l = !1,
				n = this.previousFilter || "",
				a = String.fromCharCode(e.keyCode),
				o = !1,
				clearTimeout(this.filterTimer),
				a === n ? o = !0 : a = n + a,
				r = RegExp("^" + i(a), "i"),
				s = this.activeMenu.children(".ui-menu-item").filter(function () {
						return r.test(t(this).children("a").text())
					}),
				s = o && -1 !== s.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : s,
				s.length || (a = String.fromCharCode(e.keyCode), r = RegExp("^" + i(a), "i"), s = this.activeMenu.children(".ui-menu-item").filter(function () {
							return r.test(t(this).children("a").text())
						})),
				s.length ? (this.focus(e, s), s.length > 1 ? (this.previousFilter = a, this.filterTimer = this._delay(function () {
								delete this.previousFilter
							}, 1e3)) : delete this.previousFilter) : delete this.previousFilter
			}
			l && e.preventDefault()
		},
		_activate : function (t) {
			this.active.is(".ui-state-disabled") || (this.active.children("a[aria-haspopup='true']").length ? this.expand(t) : this.select(t))
		},
		refresh : function () {
			var e,
			i = this.options.icons.submenu,
			s = this.element.find(this.options.menus);
			this.element.toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length),
			s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({
				role : this.options.role,
				"aria-hidden" : "true",
				"aria-expanded" : "false"
			}).each(function () {
				var e = t(this),
				s = e.prev("a"),
				n = t("<span>").addClass("ui-menu-icon ui-icon " + i).data("ui-menu-submenu-carat", !0);
				s.attr("aria-haspopup", "true").prepend(n),
				e.attr("aria-labelledby", s.attr("id"))
			}),
			e = s.add(this.element),
			e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({
				tabIndex : -1,
				role : this._itemRole()
			}),
			e.children(":not(.ui-menu-item)").each(function () {
				var e = t(this);
				/[^\-\u2014\u2013\s]/.test(e.text()) || e.addClass("ui-widget-content ui-menu-divider")
			}),
			e.children(".ui-state-disabled").attr("aria-disabled", "true"),
			this.active && !t.contains(this.element[0], this.active[0]) && this.blur()
		},
		_itemRole : function () {
			return {
				menu : "menuitem",
				listbox : "option"
			}
			[this.options.role]
		},
		_setOption : function (t, e) {
			"icons" === t && this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(e.submenu),
			this._super(t, e)
		},
		focus : function (t, e) {
			var i,
			s;
			this.blur(t, t && "focus" === t.type),
			this._scrollIntoView(e),
			this.active = e.first(),
			s = this.active.children("a").addClass("ui-state-focus"),
			this.options.role && this.element.attr("aria-activedescendant", s.attr("id")),
			this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),
			t && "keydown" === t.type ? this._close() : this.timer = this._delay(function () {
					this._close()
				}, this.delay),
			i = e.children(".ui-menu"),
			i.length && t && /^mouse/.test(t.type) && this._startOpening(i),
			this.activeMenu = e.parent(),
			this._trigger("focus", t, {
				item : e
			})
		},
		_scrollIntoView : function (e) {
			var i,
			s,
			n,
			a,
			o,
			r;
			this._hasScroll() && (i = parseFloat(t.css(this.activeMenu[0], "borderTopWidth")) || 0, s = parseFloat(t.css(this.activeMenu[0], "paddingTop")) || 0, n = e.offset().top - this.activeMenu.offset().top - i - s, a = this.activeMenu.scrollTop(), o = this.activeMenu.height(), r = e.height(), 0 > n ? this.activeMenu.scrollTop(a + n) : n + r > o && this.activeMenu.scrollTop(a + n - o + r))
		},
		blur : function (t, e) {
			e || clearTimeout(this.timer),
			this.active && (this.active.children("a").removeClass("ui-state-focus"), this.active = null, this._trigger("blur", t, {
					item : this.active
				}))
		},
		_startOpening : function (t) {
			clearTimeout(this.timer),
			"true" === t.attr("aria-hidden") && (this.timer = this._delay(function () {
						this._close(),
						this._open(t)
					}, this.delay))
		},
		_open : function (e) {
			var i = t.extend({
					of : this.active
				}, this.options.position);
			clearTimeout(this.timer),
			this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden", "true"),
			e.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(i)
		},
		collapseAll : function (e, i) {
			clearTimeout(this.timer),
			this.timer = this._delay(function () {
					var s = i ? this.element : t(e && e.target).closest(this.element.find(".ui-menu"));
					s.length || (s = this.element),
					this._close(s),
					this.blur(e),
					this.activeMenu = s
				}, this.delay)
		},
		_close : function (t) {
			t || (t = this.active ? this.active.parent() : this.element),
			t.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active")
		},
		collapse : function (t) {
			var e = this.active && this.active.parent().closest(".ui-menu-item", this.element);
			e && e.length && (this._close(), this.focus(t, e))
		},
		expand : function (t) {
			var e = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first();
			e && e.length && (this._open(e.parent()), this._delay(function () {
					this.focus(t, e)
				}))
		},
		next : function (t) {
			this._move("next", "first", t)
		},
		previous : function (t) {
			this._move("prev", "last", t)
		},
		isFirstItem : function () {
			return this.active && !this.active.prevAll(".ui-menu-item").length
		},
		isLastItem : function () {
			return this.active && !this.active.nextAll(".ui-menu-item").length
		},
		_move : function (t, e, i) {
			var s;
			this.active && (s = "first" === t || "last" === t ? this.active["first" === t ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[t + "All"](".ui-menu-item").eq(0)),
			s && s.length && this.active || (s = this.activeMenu.children(".ui-menu-item")[e]()),
			this.focus(i, s)
		},
		nextPage : function (e) {
			var i,
			s,
			n;
			return this.active ? (this.isLastItem() || (this._hasScroll() ? (s = this.active.offset().top, n = this.element.height(), this.active.nextAll(".ui-menu-item").each(function () {
							return i = t(this),
							0 > i.offset().top - s - n
						}), this.focus(e, i)) : this.focus(e, this.activeMenu.children(".ui-menu-item")[this.active ? "last" : "first"]())), undefined) : (this.next(e), undefined)
		},
		previousPage : function (e) {
			var i,
			s,
			n;
			return this.active ? (this.isFirstItem() || (this._hasScroll() ? (s = this.active.offset().top, n = this.element.height(), this.active.prevAll(".ui-menu-item").each(function () {
							return i = t(this),
							i.offset().top - s + n > 0
						}), this.focus(e, i)) : this.focus(e, this.activeMenu.children(".ui-menu-item").first())), undefined) : (this.next(e), undefined)
		},
		_hasScroll : function () {
			return this.element.outerHeight() < this.element.prop("scrollHeight")
		},
		select : function (e) {
			this.active = this.active || t(e.target).closest(".ui-menu-item");
			var i = {
				item : this.active
			};
			this.active.has(".ui-menu").length || this.collapseAll(e, !0),
			this._trigger("select", e, i)
		}
	})
})(jQuery);

/*Mpage Modal Dialog Scripting*/
/*global logger, MP_Viewpoint*/

/**
 * A collection of functions which can be used to maintain, create, destroy and update modal dialogs.
 * The MP_ModalDialog function keeps a copy of all of the ModalDialog objects that have been created
 * for the current view.  If a ModalDialog object is updated outside of these functions, the updated
 * version of the object should replace the stale version that is stored here by using the
 * updateModalDialogObject functionality.
 * @namespace
 */
var MP_ModalDialog = {};
MP_ModalDialog.modalDialogObjects = {};
MP_ModalDialog.whiteSpacePixels = 26;

/**
 * This function will be used to add ModalDialog objects to the collection of ModalDialog objects for the current
 * View.  This list of ModalDialog objects will be the one source of this type of object and will be used when
 * showing modal dialogs.
 * @param {ModalDialog} modalObject An instance of the ModalDialog object
 * @return [boolean] true if the ModalDialog object was added successfully, false otherwise.
 */
MP_ModalDialog.addModalDialogObject = function (modalObject) {
	var modalId = "";
	//Check that he object is not null and that the object type is ModalDialog
	if (!(modalObject instanceof ModalDialog)) {
		logger.logError("MP_ModalDialog.addModalDialogObject only accepts objects of type ModalDialog");
		return false;
	}

	//Check for a valid id.
	modalId = modalObject.getId();
	if (!modalId) {
		//Modal id is not populated
		logger.logError("MP_ModalDialog.addModalDialogObject: no/invalid ModalDialog id given");
		return false;
	} else if (this.modalDialogObjects[modalId]) {
		//Modal id is already in use
		logger.logError("MP_ModalDialog.addModalDialogObject: modal dialog id " + modalId + " is already in use");
		return false;
	}

	//Add the ModalDialog Object to the list of ModalDialog objects
	this.modalDialogObjects[modalId] = modalObject;
	return true;
};

/**
 * Add the modal dialog icon to the viewpoint framework.  This icon will be responsible for
 * launching the correct modal dialog based on the ModalDialog object that it is associated to.
 * @param {string} modalDialogId The id of the ModalDialog object to reference when creating the modal dialog icon
 * @return {boolean} true if the dialog was added to the viewpoint, false otherwise.
 */
MP_ModalDialog.addModalDialogOptionToViewpoint = function (modalDialogId) {
	var modalObj = null;

	//Check to see if the ModalDialog exists
	modalObj = this.modalDialogObjects[modalDialogId];
	if (!modalObj) {
		return false;
	}

	//If the MP_Viewpoint function is defined call it
	if (typeof MP_Viewpoint !== "undefined" && typeof MP_Viewpoint.addModalDialogUtility !== "undefined") {
		MP_Viewpoint.addModalDialogUtility(modalObj);
		return true;
	}
};

/**
 * Closes all of the associated modal dialog windows
 * @param {string} modalDialogId The id of the modal dialog to close
 * @return {boolean} true if the dialog was closed, false otherwise
 */
MP_ModalDialog.closeModalDialog = function (modalDialogId) {
	var modalObj = null;

	//Check to see if the ModalDialog exists
	modalObj = this.modalDialogObjects[modalDialogId];
	if (!modalObj) {
		return false;
	}

	//destroy the modal dialog
	$("#vwpModalDialog" + modalObj.getId()).remove();
	//destroy the modal background
	$("#vwpModalBackground" + modalObj.getId()).remove();
	//Mark the modal dialog as inactive
	modalObj.setIsActive(false);
	$("body").css("overflow", "auto");
	return true;
};

/**
 * Deletes the modal dialog object with the id modalDialogId.
 * @param {string} modalDialogId The id of the modal dialog object to be deleted
 * @return {boolean} True if a ModalDialog object was deleted, false otherwise
 */
MP_ModalDialog.deleteModalDialogObject = function (modalDialogId) {
	if (this.modalDialogObjects[modalDialogId]) {
		delete this.modalDialogObjects[modalDialogId];
		return true;
	}
	return false;
};

/**
 * Retrieves the ModalDialog object with the id of modalDialogId
 * @param {string} modalDialogId The id of the modal dialog object to retrieve
 * @return {ModalDialog} Returns the modal dialog object if it exists in the collection
 */
MP_ModalDialog.retrieveModalDialogObject = function (modalDialogId) {
	if (this.modalDialogObjects[modalDialogId]) {
		return this.modalDialogObjects[modalDialogId];
	}
	return null;
};

/**
 * Resizes all of the active modal dialogs when the window itself is being resized.
 * @param {string} modalDialogId The id of the modal dialog object to resize
 * @return null
 */
MP_ModalDialog.resizeAllModalDialogs = function () {
	var dialog = null;
	var attr = "";
	//Get all of the modal dialog objects from the modalDialogObjects collection
	for (attr in MP_ModalDialog.modalDialogObjects) {
		if (MP_ModalDialog.modalDialogObjects.hasOwnProperty(attr)) {
			dialog = MP_ModalDialog.modalDialogObjects[attr];
			if (dialog.isActive()) {
				MP_ModalDialog.resizeModalDialog(dialog.getId());
			}
		}
	}
};

/**
 * Resizes the modal dialog when the window itself is being resized.
 * @param {string} modalDialogId The id of the modal dialog object to resize
 * @return null
 */
MP_ModalDialog.resizeModalDialog = function (modalDialogId) {
	var docHeight = 0;
	var docWidth = 0;
	var topMarginSize = 0;
	var leftMarginSize = 0;
	var bottomMarginSize = 0;
	var rightMarginSize = 0;
	var modalWidth = "";
	var modalHeight = "";
	var modalObj = null;

	//Get the ModalDialog object
	modalObj = this.modalDialogObjects[modalDialogId];
	if (!modalObj) {
		logger.logError("MP_ModalDialog.resizeModalDialog: No modal dialog with the id " + modalDialogId + " exists");
		return;
	}

	if (!modalObj.isActive()) {
		logger.logError("MP_ModalDialog.resizeModalDialog: this modal dialog is not active it cannot be resized");
		return;
	}

	//Determine the new margins and update accordingly
	docHeight = $(window).height();
	docWidth = $(document.body).width();
	topMarginSize = Math.floor(docHeight * (modalObj.getTopMarginPercentage() / 100));
	leftMarginSize = Math.floor(docWidth * (modalObj.getLeftMarginPercentage() / 100));
	bottomMarginSize = Math.floor(docHeight * (modalObj.getBottomMarginPercentage() / 100));
	rightMarginSize = Math.floor(docWidth * (modalObj.getRightMarginPercentage() / 100));
	modalWidth = (docWidth - leftMarginSize - rightMarginSize);
	modalHeight = (docHeight - topMarginSize - bottomMarginSize);
	$("#vwpModalDialog" + modalObj.getId()).css({
		"top" : topMarginSize,
		"left" : leftMarginSize,
		"width" : modalWidth + "px"
	});

	//Make sure the body div fills all of the alloted space if the body is a fixed size and also make sure the modal dialog is sized correctly.
	if (modalObj.isBodySizeFixed()) {
		$("#vwpModalDialog" + modalObj.getId()).css("height", modalHeight + "px");
		$("#" + modalObj.getBodyElementId()).height(modalHeight - $("#" + modalObj.getHeaderElementId()).height() - $("#" + modalObj.getFooterElementId()).height() - this.whiteSpacePixels);
	} else {
		$("#vwpModalDialog" + modalObj.getId()).css("max-height", modalHeight + "px");
		$("#" + modalObj.getBodyElementId()).css("max-height", (modalHeight - $("#" + modalObj.getHeaderElementId()).height() - $("#" + modalObj.getFooterElementId()).height() - this.whiteSpacePixels) + "px");
	}

	//Make sure the modal background is resized as well
	$("#vwpModalBackground" + modalObj.getId()).css({
		"height" : "100%",
		"width" : "100%"
	});
};

/**
 * Render and show the modal dialog based on the settings applied in the ModalDialog object referenced by the
 * modalDialogId parameter.
 * @param {string} modalDialogId The id of the ModalDialog object to render
 * @return null
 */
MP_ModalDialog.showModalDialog = function (modalDialogId) {
	var bodyDiv = null;
	var bodyLoadFunc = null;
	var bottomMarginSize = 0;
	var button = null;
	var dialogDiv = null;
	var docHeight = 0;
	var docWidth = 0;
	var focusButtonId = "";
	var footerDiv = null;
	var footerButtons = [];
	var footerButtonsCnt = 0;
	var footerButtonContainer = null;
	var headerDiv = null;
	var leftMarginSize = 0;
	var modalDiv = null;
	var modalObj = null;
	var modalHeight = "";
	var modalWidth = "";
	var rightMarginSize = 0;
	var topMarginSize = 0;
	var x = 0;
	var footerCheckbox = null;
	var footerText = "";

	/**
	 * This function is used to create onClick functions for each button.  Using this function
	 * will prevent closures from applying the same action onClick function to all buttons.
	 */
	function createButtonClickFunc(buttonObj, modalDialogId) {
		var clickFunc = buttonObj.getOnClickFunction();
		var closeModal = buttonObj.closeOnClick();
		if (!clickFunc) {
			clickFunc = function () {};

		}
		return function () {
			clickFunc();
			if (closeModal) {
				MP_ModalDialog.closeModalDialog(modalDialogId);
			}
		};

	}

	//Get the ModalDialog object
	modalObj = this.modalDialogObjects[modalDialogId];
	if (!modalObj) {
		logger.logError("MP_ModalDialog.showModalDialog: No modal dialog with the id " + modalDialogId + " exists");
		return;
	}

	//Check to see if the modal dialog is already displayed.  If so, return
	if (modalObj.isActive()) {
		return;
	}

	//Create the modal window based on the ModalDialog object
	//Create the header div element
	headerDiv = $("<div id='" + modalObj.getHeaderElementId() + "' class='dyn-modal-hdr-container'><span class='dyn-modal-hdr-title'>" + (modalObj.getHeaderTitle() || "&nbsp;") + "</span></div>");
	if (modalObj.showCloseIcon()) {
		headerDiv.append($("<span class='dyn-modal-hdr-close'></span>").click(function () {
				var closeFunc = null;
				var closeFunctionResponse = true;
				//call the close function of the modalObj
				closeFunc = modalObj.getHeaderCloseFunction();
				if (closeFunc) {
					closeFunctionResponse = closeFunc();
				}

				//Determine if we should close the modal or not
				if (modalObj.verifyCloseFunctionResponse()) {
					//Since we need to verify the close function response only close the modal when
					//the close function returned a truthy value or no close function is executed
					if (closeFunctionResponse) {
						MP_ModalDialog.closeModalDialog(modalObj.getId());
					}
				} else {
					MP_ModalDialog.closeModalDialog(modalObj.getId());
				}
			}));
	}

	//Create the body div element
	bodyDiv = $("<div id='" + modalObj.getBodyElementId() + "' class='dyn-modal-body-container'></div>");

	//Create the footer element if there are any buttons available or the checkbox is available
	footerButtons = modalObj.getFooterButtons();
	footerButtonsCnt = footerButtons.length;
	footerCheckbox = modalObj.getFooterCheckbox();
	footerText = modalObj.getFooterText();
	if (footerButtonsCnt || footerCheckbox.enabled || footerText !== "") {
		//Create the footer element
		footerDiv = $("<div id='" + modalObj.getFooterElementId() + "' class='dyn-modal-footer-container'></div>");
		//If the checkbox is enabled create the necessary elements
		if (footerCheckbox.enabled) {
			var checkboxContainer = $("<label class='dyn-modal-checkbox-container'></label>");
			var checkboxEle = $("<input type='checkbox' class='dyn-modal-checkbox'" + ((footerCheckbox.isChecked) ? " checked" : "") + ">");
			checkboxEle.click(footerCheckbox.onClick);
			checkboxContainer.append(checkboxEle);
			checkboxContainer.append("<span class='dyn-modal-checkbox-label'>" + footerCheckbox.label + "</span>");
			footerDiv.append(checkboxContainer);
		}

		//If footer buttons are enabled, rendering each button and apply the necessary click events
		if (footerButtonsCnt) {
			footerButtonContainer = $("<div id='" + modalObj.getFooterElementId() + "btnCont' class='dyn-modal-button-container'></div>");
			for (x = 0; x < footerButtonsCnt; x++) {
				button = footerButtons[x];
				footerButtonContainer.append($("<button id='" + button.getId() + "' class='dyn-modal-button'" + ((button.isDithered()) ? " disabled" : "") + ">" + button.getText() + "</button>").click(createButtonClickFunc(button, modalObj.getId())));
				//Check to see the footer button has a separator.
				if (button.getSeparatorInd()) {
					footerButtonContainer.append("<span class='dyn-modal-button-separator'></span>");
				}
				//Check to see if we should focus on this button when loading the modal dialog
				if (!focusButtonId) {
					focusButtonId = (button.getFocusInd()) ? button.getId() : "";
				}
			}
			footerDiv.append(footerButtonContainer);
		}

		//Create a footer text element if there is a label
		if (footerText !== "") {
			footerDiv.append("<span id='" + modalObj.getFooterTextElementId() + "' class='dyn-modal-footer-text'>" + footerText + "</span>");
		}

	} else if (modalObj.isFooterAlwaysShown()) {
		footerDiv = $("<div id='" + modalObj.getFooterElementId() + "' class='dyn-modal-footer-container'></div>");
	}

	//determine the dialog size
	docHeight = $(window).height();
	docWidth = $(document.body).width();
	topMarginSize = Math.floor(docHeight * (modalObj.getTopMarginPercentage() / 100));
	leftMarginSize = Math.floor(docWidth * (modalObj.getLeftMarginPercentage() / 100));
	bottomMarginSize = Math.floor(docHeight * (modalObj.getBottomMarginPercentage() / 100));
	rightMarginSize = Math.floor(docWidth * (modalObj.getRightMarginPercentage() / 100));
	modalWidth = (docWidth - leftMarginSize - rightMarginSize);
	modalHeight = (docHeight - topMarginSize - bottomMarginSize);
	dialogDiv = $("<div id='vwpModalDialog" + modalObj.getId() + "' class='dyn-modal-dialog'></div>").css({
			"top" : topMarginSize,
			"left" : leftMarginSize,
			"width" : modalWidth + "px"
		});
	dialogDiv.append(headerDiv).append(bodyDiv).append(footerDiv);

	//Create the modal background if set in the ModalDialog object.
	modalDiv = $("<div id='vwpModalBackground" + modalObj.getId() + "' class='" + ((modalObj.hasGrayBackground()) ? "dyn-modal-div" : "dyn-modal-div-clear") + "'></div>").height($(document).height());

	//Add the flash function to the modal if using a clear background
	if (!modalObj.hasGrayBackground()) {
		modalDiv.click(function () {
			var modal = $("#vwpModalDialog" + modalObj.getId());
			modal.fadeOut(100);
			modal.fadeIn(100);
		});

	}

	//Add all of these elements to the document body
	$(document.body).append(modalDiv).append(dialogDiv);

	//Set the focus of a button if indicated
	if (focusButtonId) {
		$("#" + focusButtonId).focus();
	}
	//disable page scrolling when modal is enabled
	$("body").css("overflow", "hidden");

	//Make sure the body div fills all of the alloted space if the body is a fixed size and also make sure the modal dialog is sized correctly.
	if (modalObj.isBodySizeFixed()) {
		$(dialogDiv).css("height", modalHeight + "px");
		$(bodyDiv).height(modalHeight - $(headerDiv).height() - $(footerDiv).height() - this.whiteSpacePixels);
	} else {
		$(dialogDiv).css("max-height", modalHeight + "px");
		$(bodyDiv).css("max-height", (modalHeight - $(headerDiv).height() - $(footerDiv).height() - this.whiteSpacePixels) + "px");
	}

	//This next line makes the modal draggable.  If this is commented out updates will need to be made
	//to resize functions and also updates to the ModalDialog object to save the location of the modal
	//$(dialogDiv).draggable({containment: "parent"});

	//Mark the displayed modal as active and save its id
	modalObj.setIsActive(true);

	//Call the onBodyLoadFunction of the modal dialog
	bodyLoadFunc = modalObj.getBodyDataFunction();
	if (bodyLoadFunc) {
		bodyLoadFunc(modalObj);
	}

	//Attempt to resize the window as it is being resized
	$(window).resize(this.resizeAllModalDialogs);
};

/**
 * Updates the existing ModalDialog with a new instance of the object.  If the modal objet does not exist it is added to the collection
 * @param {ModalDialog} modalObject The updated instance of the ModalDialog object.
 * @return null
 */
MP_ModalDialog.updateModalDialogObject = function (modalObject) {
	var modalDialogId = "";

	//Check to see if we were passed a ModalDialog object
	if (!modalObject || !(modalObject instanceof ModalDialog)) {
		logger.logError("MP_ModalDialog.updateModalDialogObject only accepts objects of type ModalDialog");
		return;
	}

	//Blindly update the ModalDialog object.  If it didnt previously exist, it will now.
	modalDialogId = modalObject.getId();
	this.modalDialogObjects[modalDialogId] = modalObject;
	return;
};

/**
 * The ModalButton class is used specifically for adding buttons to the footer of a modal dialog.
 * @constructor
 */
function ModalButton(buttonId) {
	//The id given to the button.  This id will be used to identify individual buttons
	this.m_buttonId = buttonId;
	//The text that will be displayed in the button itself
	this.m_buttonText = "";
	//A flag to determine if the button shall be disabled or not
	this.m_dithered = false;
	//The function to call when the button is clicked
	this.m_onClickFunction = null;
	//A flag to determine if this button should be closed when clicked.
	this.m_closeOnClick = true;
	//A flag to determine if this button should be focused when the modal dialog is shown
	this.m_focusInd = false;
	//A flag to determine if this button should show a separator next to it.
	this.m_separatorInd = false;
}

/** Checkers **/
/**
 * Check to see if the button click should close the modal dialog on click
 * @return {boolean} A boolean which determines if the button click should cause the modal dialog to close
 */
ModalButton.prototype.closeOnClick = function () {
	return this.m_closeOnClick;
};

/**
 * Check to see if the Modal Button is currently dithered
 * @return {boolean} A boolean flag that indicates if the modal button is dithered or not
 */
ModalButton.prototype.isDithered = function () {
	return this.m_dithered;
};

/** Getters **/
/**
 * Retrieves the id assigned the this ModalButton object
 * @return {string} The id assigned to this ModalButton object
 */
ModalButton.prototype.getId = function () {
	return this.m_buttonId;
};

/**
 * Retrieve the close on click flag of the ModalButton object
 * @return {boolean} The close on click flag of the ModalButton object
 */
ModalButton.prototype.getCloseOnClick = function () {
	return this.m_closeOnClick;
};

/**
 * Retrieve the focus indicator flag of the ModalButton object
 * @return {boolean} The focus indicator flag of the ModalButton object
 */
ModalButton.prototype.getFocusInd = function () {
	return this.m_focusInd;
};

/**
 * Retrieves the text used for the ModalButton display
 * @return {string} The text which will be used in the button display
 */
ModalButton.prototype.getText = function () {
	return this.m_buttonText;
};

/**
 * Retrieves the onClick function associated to this Modal Button
 * @return {function} The function executed when the button is clicked
 */
ModalButton.prototype.getOnClickFunction = function () {
	return this.m_onClickFunction;
};
/**
 * Retrieve the button separator indicator flag of the ModalButton object
 * @return {boolean} The button separator indicator flag of the ModalButton object
 */
ModalButton.prototype.getSeparatorInd = function () {
	return this.m_separatorInd;
};

/** Setters **/

/**
 * Sets the id of the ModalButton object.  The id must be a string otherwise it is ignored.
 * @param {string} buttonId The id which will be assigned to the button DOM element
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setId = function (buttonId) {
	if (buttonId && typeof buttonId === "string") {
		this.m_buttonId = buttonId;
	}
	return this;
};

/**
 * Sets the close on click flag of the dialog button
 * @param {boolean} closeFlag A boolean flag which determines if the dialog should close when the
 * button is clicked
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setCloseOnClick = function (closeFlag) {
	if (typeof closeFlag === "boolean") {
		this.m_closeOnClick = closeFlag;
	}
	return this;
};

/**
 * Sets the focus indicator flag of the dialog button
 * @param {boolean} focusInd A boolean flag which determines if the button should have focus on
 * initial dialog load.
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setFocusInd = function (focusInd) {
	if (typeof focusInd === "boolean") {
		this.m_focusInd = focusInd;
	}
	return this;
};

/**
 * Sets the text which will be shown in the button
 * @param {string} buttonText The string value to display as the button text
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setText = function (buttonText) {
	if (buttonText && typeof buttonText === "string") {
		this.m_buttonText = buttonText;
	}
	return this;
};

/**
 * Sets the dithered status of the dialog button
 * @param {boolean} dithere A boolean flag which determines if the button should be dithered
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setIsDithered = function (dithered) {
	if (typeof dithered === "boolean") {
		this.m_dithered = dithered;
	}
	return this;
};

/**
 * Sets the onClick function for the ModalButton
 * @param {function} clickFunc The function to execute when this button is clicked.
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setOnClickFunction = function (clickFunc) {
	if (typeof clickFunc === "function") {
		this.m_onClickFunction = clickFunc;
	}
	return this;
};

/**
 * Sets the button separator indicator flag of the dialog button.If the separator indicator is
 * set to true then the separator is displayed to the right of the button.
 * @param {boolean} separatorFlag A boolean flag which determines if the button will have a visual
 * separator displayed to the right of the button.
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setSeparatorInd = function (separatorFlag) {
	if (typeof separatorFlag === "boolean") {
		this.m_separatorInd = separatorFlag;
	}
	return this;
};

/**
 * The ModalDialog object contains information about the aspects of how the modal dialog will be created and what actions will take
 * place.  Depending on how the variables are set, the modal can flex based on the consumers needs.  Customizable options include the following;
 * size, modal title, onClose function, modal body content, variable footer buttons with dither options and onclick events.
 * @constructor
 */
function ModalDialog(modalId) {
	//The id given to the ModalDialog object.  Will be used to set/retrieve the modal dialog
	this.m_modalId = modalId;
	//A flag used to determine if the modal is active or not
	this.m_isModalActive = false;
	//A flag to determine if the modal should be fixed to the icon used to activate the modal
	this.m_isFixedToIcon = false;
	//A flag to determine if the modal dialog should grey out the background when being displayed or not.
	this.m_hasGrayBackground = true;
	//A flag to determine if the close icon should be shown or not
	this.m_showCloseIcon = true;

	//The margins object contains the margins that will be applied to the modal window.
	this.m_margins = {
		top : 5,
		right : 5,
		bottom : 5,
		left : 5
	};

	//The icon object contains information about the icon that the user will use to launch the modal dialog
	this.m_icon = {
		elementId : modalId + "icon",
		cssClass : "",
		text : "",
		hoverText : "",
		isActive : true
	};

	//The header object of the modal.  Contains all of the necessary information to render the header of the dialog
	this.m_header = {
		elementId : modalId + "header",
		title : "",
		closeFunction : null,
		verifyCloseFunctionResponse : false
	};

	//The body object of the modal.  Contains all of the necessary information to render the body of the dialog
	this.m_body = {
		elementId : modalId + "body",
		dataFunction : null,
		isBodySizeFixed : true
	};

	//The footer object of the modal.  Contains all of the necessary information to render the footer of the dialog
	this.m_footer = {
		isAlwaysShown : false,
		elementId : modalId + "footer",
		buttons : [],
		checkbox : {
			enabled : false,
			isChecked : false,
			onClick : function () {
				return false;
			},
			label : ""
		},
		footerText : {
			text : "",
			elementId : modalId + "FooterText"
		}
	};
}

/** Adders **/

/**
 * Adds a ModalButton object to the list of buttons that will be used in the footer of to modal dialog.
 * Only ModalButtons will be used, no other object type will be accepted.
 * @param {ModalButton} modalButton The button to add to the footer.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.addFooterButton = function (modalButton) {
	if (!(modalButton instanceof ModalButton)) {
		logger.logError("ModalDialog.addFooterButton: Cannot add footer button which isnt a ModalButton object.\nModalButtons can be created using the ModalDialog.createModalButton function.");
		return this;
	}

	if (!modalButton.getId()) {
		logger.logError("ModalDialog.addFooterButton: All ModalButton objects must have an id assigned");
		return this;
	}

	this.m_footer.buttons.push(modalButton);
	return this;
};

/** Checkers **/

/**
 * Checks to see if the modal dialog object has a gray background or not
 * @return {boolean} True if the modal dialog is active, false otherwise
 */
ModalDialog.prototype.hasGrayBackground = function () {
	return this.m_hasGrayBackground;
};

/**
 * Checks to see if the modal dialog object is active or not
 * @return {boolean} True if the modal dialog is active, false otherwise
 */
ModalDialog.prototype.isActive = function () {
	return this.m_isModalActive;
};

/**
 * Checks to see if the modal dialog body should have a fixed size or not
 * @return {boolean} True if the modal dialog body is a fixed size, false otherwise
 */
ModalDialog.prototype.isBodySizeFixed = function () {
	return this.m_body.isBodySizeFixed;
};

/**
 * Checks to see if the modal dialog footer should always be shown or not
 * @return {boolean} True if the modal dialog footer should always be shown
 */
ModalDialog.prototype.isFooterAlwaysShown = function () {
	return this.m_footer.isAlwaysShown;
};

/**
 * Checks if the modal should be fixed to the icon used to activate the modal
 * @return {boolean} True if the modal dialog is active, false otherwise
 */
ModalDialog.prototype.isFixedToIcon = function () {
	return this.m_isFixedToIcon;
};

/**
 * Checks to see if the modal dialog icon is active or not
 * @return {boolean} True if the modal dialog icon is active, false otherwise
 */
ModalDialog.prototype.isIconActive = function () {
	return this.m_icon.isActive;
};

/**
 * Checks to see if the close icon should be shown in the modal dialog
 * @return {boolean} True if the close icon should be shown, false otherwise
 */
ModalDialog.prototype.showCloseIcon = function () {
	return this.m_showCloseIcon;
};

/**
 * Checks to see if the response of the close function associated to the Header close icon
 * should be checked before closing the dialog.  If set to true, the response of the close function will determine
 * if the dialog will be closed or not.  A true response indicates that the dialog can be closed.  A false response
 * indicates that they dialog should not be closed.
 * @return {boolean} A flag which determines if the dialog should check the response of the close function
 * before closing the dialog.
 */
ModalDialog.prototype.verifyCloseFunctionResponse = function () {
	return this.m_header.verifyCloseFunctionResponse;
};

/** Getters **/

/**
 * Retrieves the function that will be used when attempting to populate the content of the modal dialog body.
 * @return {function} The function used when loading the modal dialog body
 */
ModalDialog.prototype.getBodyDataFunction = function () {
	return this.m_body.dataFunction;
};

/**
 * Retrieves the id associated to the modal dialog body element
 * @return {string} The id associated to the modal dialog body element
 */
ModalDialog.prototype.getBodyElementId = function () {
	return this.m_body.elementId;
};

/**
 * Retrieves the percentage set for the bottom margin of the modal dialog
 * @return {number} The percentage assigned to the bottom margin for the modal dialog
 */
ModalDialog.prototype.getBottomMarginPercentage = function () {
	return this.m_margins.bottom;
};

/**
 * Retrieves the button identified by the id passed into the function
 * @param {string} buttonId The if of the ModalButton object to retrieve
 * @return {ModalButton} The modal button with the id of buttonId, else null
 */
ModalDialog.prototype.getFooterButton = function (buttonId) {
	var x = 0;
	var button = null;
	var buttons = this.getFooterButtons();
	var buttonCnt = buttons.length;
	//Get the ModalButton
	for (x = buttonCnt; x--; ) {
		button = buttons[x];
		if (button.getId() === buttonId) {
			return buttons[x];
		}
	}
	return null;
};

/**
 * Retrieves the array of buttons which will be used in the footer of the modal dialog.
 * @return {ModalButton[]} An array of ModalButton objects which will be used in the footer of the modal dialog
 */
ModalDialog.prototype.getFooterButtons = function () {
	return this.m_footer.buttons;
};

/**
 * Retrieves the id associated to the modal dialog footer element
 * @return {string} The id associated to the modal dialog footer element
 */
ModalDialog.prototype.getFooterElementId = function () {
	return this.m_footer.elementId;
};

/**
 * Retrieves the footer checkbox object associated to the modal dialog
 * @return {object} The checkbox associated to the modal dialog footer element
 */
ModalDialog.prototype.getFooterCheckbox = function () {
	return this.m_footer.checkbox;
};

/**
 * Retrieves a boolean which determines if the checkbox is enabled in the modal dialog footer.
 * @return {boolean} The flag which determines if this modal dialog should display a checkbox in the footer
 */
ModalDialog.prototype.getIsFooterCheckboxEnabled = function () {
	return this.m_footer.checkbox.enabled;
};

/**
 * Retrieves a boolean which determines if the checkbox is checked in the modal dialog footer.
 * @return {boolean} The flag which returns the state of the modal dialog footer checkbox
 */
ModalDialog.prototype.getFooterCheckboxIsChecked = function () {
	return this.m_footer.checkbox.isChecked;
};

/**
 * Retrieves the string label for the checkbox in the modal dialog footer.
 * @return {string} The label that appears next to the checkbox in the modal dialog footer
 */
ModalDialog.prototype.getFooterCheckboxLabel = function () {
	return this.m_footer.checkbox.label;
};

/**
 * Retrieves a boolean which determines if the modal dialog should display a gray background or not
 * @return {boolean} The flag which determines if this modal dialog should display a gray background
 */
ModalDialog.prototype.getHasGrayBackground = function () {
	return this.m_hasGrayBackground;
};

/**
 * Retrieves the function that will be used when the user attempts to close the modal dialog.
 * @return {function} The function used when closing the modal dialog
 */
ModalDialog.prototype.getHeaderCloseFunction = function () {
	return this.m_header.closeFunction;
};

/**
 * Retrieves the id associated to the modal dialog header element
 * @return {string} The id associated to the modal dialog header element
 */
ModalDialog.prototype.getHeaderElementId = function () {
	return this.m_header.elementId;
};

/**
 * Retrieves the title which will be used in the header of the modal dialog
 * @return {string} The title given to the modal dialog header element
 */
ModalDialog.prototype.getHeaderTitle = function () {
	return this.m_header.title;
};

/**
 * Retrieves the css class which will be applied to the html span used to open the modal dialog
 * @return {string} The css which will be applied to the html span used ot open the modal dialog
 */
ModalDialog.prototype.getIconClass = function () {
	return this.m_icon.cssClass;
};

/**
 * Retrieves the id associated to the modal dialog icon element
 * @return {string} The id associated to the modal dialog icon element
 */
ModalDialog.prototype.getIconElementId = function () {
	return this.m_icon.elementId;
};

/**
 * Retrieves the text which will be displayed the user hovers over the modal dialog icon
 * @return {string} The text displayed when hovering over the modal dialog icon
 */
ModalDialog.prototype.getIconHoverText = function () {
	return this.m_icon.hoverText;
};

/**
 * Retrieves the text which will be displayed next to the icon used to open the modal dialog
 * @return {string} The text displayed next to the icon
 */
ModalDialog.prototype.getIconText = function () {
	return this.m_icon.text;
};

/**
 * Retrieves the id given to this modal dialog object
 * @return {string} The id given to this modal dialog object
 */
ModalDialog.prototype.getId = function () {
	return this.m_modalId;
};

/**
 * Retrieves a boolean which determines if this modal dialog object is active or not
 * @return {boolean} The flag which determines if this modal dialog object is active or not
 */
ModalDialog.prototype.getIsActive = function () {
	return this.m_isModalActive;
};

/**
 * Retrieves a boolean which determines if this body of the modal dialog object has a fixed height or not
 * @return {boolean} The flag which determines if the body of the modal dialog object is fixed or not
 */
ModalDialog.prototype.getIsBodySizeFixed = function () {
	return this.m_body.isBodySizeFixed;
};

/**
 * Retrieves a boolean which determines if this modal dialog object is fixed to the icon used to launch it.
 * @return {boolean} The flag which determines if this modal dialog object is active or not
 */
ModalDialog.prototype.getIsFixedToIcon = function () {
	return this.m_isFixedToIcon;
};

/**
 * Retrieves a boolean which determines if this modal dialog footer is always shown or not.
 * @return {boolean} The flag which determines if this modal dialog footer is always shown or not.
 */
ModalDialog.prototype.getIsFooterAlwaysShown = function () {
	return this.m_footer.isAlwaysShown;
};

/**
 * Retrieves a boolean which determines if this modal dialog icon is active or not.  If the icon is not active it should
 * not be clickable by the user and the cursor should not change when hovered over.
 * @return {boolean} The flag which determines if modal dialog icon is active or not.
 */
ModalDialog.prototype.getIsIconActive = function () {
	return this.m_icon.isActive;
};

/**
 * Retrieves the percentage set for the left margin of the modal dialog
 * @return {number} The percentage assigned to the left margin for the modal dialog
 */
ModalDialog.prototype.getLeftMarginPercentage = function () {
	return this.m_margins.left;
};

/**
 * Retrieves the percentage set for the right margin of the modal dialog
 * @return {number} The percentage assigned to the right margin for the modal dialog
 */
ModalDialog.prototype.getRightMarginPercentage = function () {
	return this.m_margins.right;
};

/**
 * Retrieves a boolean which determines if the close icon should be shown in the modal dialog.
 * @return {boolean} The flag which determines if the close icon should be shown or not.
 */
ModalDialog.prototype.getShowCloseIcon = function () {
	return this.m_showCloseIcon;
};

/**
 * Retrieves the percentage set for the top margin of the modal dialog
 * @return {number} The percentage assigned to the top margin for the modal dialog
 */
ModalDialog.prototype.getTopMarginPercentage = function () {
	return this.m_margins.top;
};
/**
 * Retrieves the footer text which will be displayed in the footer of the modal dialog
 * @return {string} The text to display in the footer of the modal dialog.
 */
ModalDialog.prototype.getFooterText = function () {
	return this.m_footer.footerText.text;
};
/**
 * Retrieves the id associated to the modal dialog footer text element
 * @return {string} The id associated to the modal dialog footer text element
 */
ModalDialog.prototype.getFooterTextElementId = function () {
	return this.m_footer.footerText.elementId;
};

/** Setters **/
/**
 * Sets the function to be called when the modal dialog is shown.  This function will be passed ModalDialog object so that
 * it can interact with the modal dialog easily while the dialog is open.
 * @param {function} dataFunc The function used to populate the body of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBodyDataFunction = function (dataFunc) {

	//Check the proposed function
	if (!(typeof dataFunc === "function") && dataFunc !== null) {
		logger.logError("ModalDialog.setBodyDataFunction: dataFunc param must be a function or null");
		return this;
	}

	this.m_body.dataFunction = dataFunc;
	return this;
};

/**
 * Sets the html element id of the modal dialog body.  This id will be used to insert html into the body of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBodyElementId = function (elementId) {
	if (elementId && typeof elementId === "string") {
		//Update the existing element id if the modal dialog is active
		if (this.isActive()) {
			$("#" + this.getBodyElementId()).attr("id", elementId);
		}
		this.m_body.elementId = elementId;
	}
	return this;
};

/**
 * Sets the html of the body element.
 * @param {string} html The HTML to insert into the body element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBodyHTML = function (html) {
	if (html && typeof html === "string") {
		//Update the existing html iff the modal dialog is active
		if (this.isActive()) {
			$("#" + this.getBodyElementId()).html(html);
		}
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the bottom margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the bottom margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setBottomMarginPercentage = function (margin) {
	if (typeof margin === "number") {
		this.m_margins.bottom = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if (this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};

/**
 * Sets the close on click property of a specific button in the modal dialog.
 * @param {string} buttonId The id of the button to be dithered
 * @param {boolean} closeOnClick A boolean used to determine if the button should close the dialog or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonCloseOnClick = function (buttonId, closeOnClick) {
	var button = null;
	var buttonElement = null;
	var onClickFunc = null;
	var modal = this;

	//check the closeOnClick type
	if (!(typeof closeOnClick === "boolean")) {
		logger.logError("ModalDialog.setFooterButtonCloseOnClick: closeOnClick param must be of type boolean");
		return this;
	}

	//Get the ModalButton
	button = this.getFooterButton(buttonId);
	if (button) {
		//Update the closeOnClick flag
		button.setCloseOnClick(closeOnClick);
		//If the modal dialog is active, update the existing class
		if (this.isActive()) {
			//Update the class of the object
			buttonElement = $("#" + buttonId);
			buttonElement.click(function () {
				onClickFunc = button.getOnClickFunction();
				if (onClickFunc && typeof onClickFunc === "function") {
					onClickFunc();
				}
				if (closeOnClick) {
					MP_ModalDialog.closeModalDialog(modal.getId());
				}
			});

		}
	} else {
		logger.logError("ModalDialog.setFooterButtonCloseOnClick: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the dithered property of a specific button in the modal dialog
 * @param {string} buttonId The id of the button to be dithered
 * @param {boolean} dithered A boolean used to determine if the button should be dithered or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonDither = function (buttonId, dithered) {
	var button = null;
	var buttonElement = null;

	//check the dithered type
	if (!(typeof dithered === "boolean")) {
		logger.logError("ModalDialog.setFooterButtonDither: Dithered param must be of type boolean");
		return this;
	}

	//Get the ModalButton
	button = this.getFooterButton(buttonId);
	if (button) {
		//Update the dithered flag
		button.setIsDithered(dithered);
		//If the modal dialog is active, update the existing class
		if (this.isActive()) {
			//Update the class of the object
			buttonElement = $("#" + buttonId);
			if (dithered) {
				buttonElement.attr("disabled", true);
			} else {
				buttonElement.attr("disabled", false);
			}
		}
	} else {
		logger.logError("ModalDialog.setFooterButtonDither: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the onclick function of the footer button with the given buttonId
 * @param {string} buttonId The id of the button to be dithered
 * @param {boolean} dithered A boolean used to determine if the button should be dithered or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonOnClickFunction = function (buttonId, clickFunc) {
	var button = null;
	var modal = this;

	//Check the proposed function and make sure it is a function
	if (!(typeof clickFunc === "function") && clickFunc !== null) {
		logger.logError("ModalDialog.setFooterButtonOnClickFunction: clickFunc param must be a function or null");
		return this;
	}

	//Get the modal button
	button = this.getFooterButton(buttonId);
	if (button) {
		//Set the onclick function of the button
		button.setOnClickFunction(clickFunc);
		//If the modal dialog is active, update the existing onClick function
		if (this.isActive()) {
			$("#" + buttonId).unbind("click").click(function () {
				if (clickFunc) {
					clickFunc();
				}
				if (button.closeOnClick()) {
					MP_ModalDialog.closeModalDialog(modal.getId());
				}
			});
		}
	} else {
		logger.logError("ModalDialog.setFooterButtonOnClickFunction: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the text displayed in the footer button with the given buttonId
 * @param {string} buttonId The id of the button to be dithered
 * @param {string} buttonText the text to display in the button
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterButtonText = function (buttonId, buttonText) {
	var button = null;

	//Check the proposed text and make sure it is a string
	if (!(typeof buttonText === "string")) {
		logger.logError("ModalDialog.setFooterButtonText: buttonText param must be a string");
		return this;
	}

	//Check make sure the string is not empty
	if (!buttonText) {
		logger.logError("ModalDialog.setFooterButtonText: buttonText param must not be empty or null");
		return this;
	}

	//Get the modal button
	button = this.getFooterButton(buttonId);
	if (button) {
		//Set the onclick function of the button
		button.setText(buttonText);
		//If the modal dialog is active, update the existing onClick function
		if (this.isActive()) {
			$("#" + buttonId).html(buttonText);
		}
	} else {
		logger.logError("ModalDialog.setFooterButtonText: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the html element id of the modal dialog footer.  This id will be used to interact with the footer of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterElementId = function (elementId) {
	if (elementId && typeof elementId === "string") {
		//Update the existing element id if the modal dialog is active
		if (this.isActive()) {
			$("#" + this.getFooterElementId()).attr("id", elementId);
		}
		this.m_footer.elementId = elementId;
	}
	return this;
};

/**
 * Sets the label that will appear next to the checkbox in the modal dialog footer
 * @param {string} label A label that will appear next to the corresponding checkbox
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxLabel = function (label) {
	if (typeof label === "string" && label !== "") {
		this.m_footer.checkbox.label = label;
	}
	return this;
};

/**
 * Sets the flag that will determine if the checkbox in the footer of the modal dialog
 * is visible or not.
 * @param {boolean} isEnabled A flag that will determine if the footer checkbox is visible or not.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxEnabled = function (isEnabled) {
	if (typeof isEnabled === "boolean") {
		this.m_footer.checkbox.enabled = isEnabled;
	}
	return this;
};

/**
 * Sets the flag that will determine if the checkbox in the footer of the modal dialog
 * is checked or not checked.
 * @param {boolean} isChecked A flag that will determine the state of the footer checkbox.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxIsChecked = function (isChecked) {
	if (typeof isChecked === "boolean") {
		this.m_footer.checkbox.isChecked = isChecked;
	}
	return this;
};

/**
 * Sets the function that will be called when the footer checkbox is clicked.
 * @param {function} checkboxClickFunction A function that will be called whenever the footer
 * checkbox is clicked
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxClickFunction = function (checkboxClickFunction) {
	if (checkboxClickFunction && (typeof checkboxClickFunction === "function")) {
		//If the user defines the checkbox click function, assume they want it enabled
		this.setFooterCheckboxEnabled(true);
		this.m_footer.checkbox.onClick = checkboxClickFunction;
	}
	return this;
};

/**
 * Sets the flag which determines if the dialog should verify the response from the close function
 * before attempting to close.  If the response is true, the dialog can be closed.  If the response is
 * false the dialog should not be closed.
 * @param {boolean} verifyResponse The flag which will indicate if verification of the close function response
 * is needed
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used.
 */
ModalDialog.prototype.setVerifyCloseFunctionResponse = function (verifyResponse) {
	if (typeof verifyResponse === "boolean") {
		this.m_header.verifyCloseFunctionResponse = verifyResponse;
	}
	return this;
};

/**
 * EventHandler for the click on the icon when it is active. This will call the showModalDialog method
 * which renders the ModalDialog. It can be overwritten by any implementations of ModalDialog.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.activeIconClickEventHandler = function () {
	MP_ModalDialog.showModalDialog(this.getId());
	return this;
};
/**
 * Sets the indicator which determines if the icon to launch the modal dialog is active or not.  When this is
 * set, the icon and its interactions are updated if it is shown on the MPage.
 * @param {boolean} activeInd An indicator which determines if the modal dialog icon is active or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsIconActive = function (activeInd) {
	var modal = this;

	if (typeof activeInd === "boolean") {
		this.m_icon.isActive = activeInd;
		//Update the icon click event based on the indicator
		//Get the icon container and remove all events if there are any
		var iconElement = $("#" + this.getIconElementId());
		if (iconElement) {
			iconElement.unbind("click");
			iconElement.removeClass("vwp-util-icon");
			if (activeInd) {
				//Add the click event
				iconElement.click(function () {
					modal.activeIconClickEventHandler();
				});
				iconElement.addClass("vwp-util-icon");
			}
		}
	}
	return this;
};

/**
 * Sets the flag which determines if the modal dialog will have a gray backgound when rendered.  This property
 * will not update dynamically.
 * @param {boolean} hasGrayBackground The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHasGrayBackground = function (hasGrayBackground) {
	if (typeof hasGrayBackground === "boolean") {
		this.m_hasGrayBackground = hasGrayBackground;
	}
	return this;
};

/**
 * Sets the function to be called upon the user choosing to close the dialog via the exit button instead of one of the available buttons.
 * @param {function} closeFunc The function to call when the user closes the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHeaderCloseFunction = function (closeFunc) {
	var modal = this;
	//Check the proposed function and make sure it is a function
	if (!(typeof closeFunc === "function") && closeFunc !== null) {
		logger.logError("ModalDialog.setHeaderCloseFunction: closeFunc param must be a function or null");
		return this;
	}

	//Update close function since it is valid
	this.m_header.closeFunction = closeFunc;

	//Update the header close function if the modal is active
	if (this.isActive()) {
		//Get the close element
		$(".dyn-modal-hdr-close").click(function () {
			var closeFunctionResponse = true;
			if (closeFunc) {
				closeFunctionResponse = closeFunc();
			}

			//Determine if we should close the modal or not
			if (modal.verifyCloseFunctionResponse()) {
				//Since we need to verify the close function response only close the modal when
				//the close function returned a truthy value or no close function is executed
				if (closeFunctionResponse) {
					MP_ModalDialog.closeModalDialog(modal.getId());
				}
			} else {
				MP_ModalDialog.closeModalDialog(modal.getId());
			}
		});
	}
	return this;
};

/**
 * Sets the html element id of the modal dialog header.  This id will be used to interact with the header of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHeaderElementId = function (elementId) {
	if (elementId && typeof elementId === "string") {
		//Update the existing element id if the modal dialog is active
		if (this.isActive()) {
			$("#" + this.getHeaderElementId()).attr("id", elementId);
		}
		this.m_header.elementId = elementId;
	}
	return this;
};

/**
 * Sets the title to be displayed in the modal dialog header.
 * @param {string} headerTitle The string to be used in the modal dialog header as the title
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setHeaderTitle = function (headerTitle) {
	if (headerTitle && typeof headerTitle === "string") {
		//Update the existing header title if the modal dialog is active
		if (this.isActive()) {
			$("#" + this.getHeaderElementId() + " .dyn-modal-hdr-title").html(headerTitle);
		}
		this.m_header.title = headerTitle;
	}
	return this;
};

/**
 * Sets the css class to be used to display the modal dialog launch icon.  This class should contain a background and proper sizing
 * as to diaply the entire icon.
 * @param {string} iconClass The css class to be applied to the html element the user will use to launch the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconClass = function (iconClass) {
	if (iconClass && typeof iconClass === "string") {
		//Update the existing icon class
		$("#" + this.getIconElementId()).removeClass(this.m_icon.cssClass).addClass(iconClass);
		this.m_icon.cssClass = iconClass;
	}
	return this;
};

/**
 * Sets the html element id of the modal dialog icon.  This id will be used to interact with the icon of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconElementId = function (elementId) {
	if (elementId && typeof elementId === "string") {
		//Update the existing element id if the modal dialog is active
		$("#" + this.getIconElementId()).attr("id", elementId);
		this.m_icon.elementId = elementId;
	}
	return this;
};

/**
 * Sets the text which will be displayed to the user when hovering over the modal dialog icon.
 * @param {string} iconHoverText The text to display in the icon hover
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconHoverText = function (iconHoverText) {
	if (iconHoverText !== null && typeof iconHoverText === "string") {
		this.m_icon.hoverText = iconHoverText;
		//Update the icon hover text
		$("#" + this.getIconElementId()).attr("title", iconHoverText);
	}
	return this;
};

/**
 * Sets the text to be displayed next to the modal dialog icon.
 * @param {string} iconText The text to display next to the modal dialog icon.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconText = function (iconText) {
	if (iconText !== null && typeof iconText === "string") {
		this.m_icon.text = iconText;
		//Update the icon text
		$("#" + this.getIconElementId()).html(iconText);
	}
	return this;
};

/**
 * Sets the id which will be used to identify a particular ModalDialog object.
 * @param {string} id The id that will be assigned to this ModalDialog object
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setId = function (id) {
	if (id && typeof id === "string") {
		this.m_modalId = id;
	}
	return this;
};

/**
 * Sets the flag which identifies the modal dialog as being active or not
 * @param {boolean} activeInd A boolean that can be used to determine if the modal is active or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsActive = function (activeInd) {
	if (typeof activeInd === "boolean") {
		this.m_isModalActive = activeInd;
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog body is a fixed height or not.
 * @param {boolean} bodyFixed A boolean that can be used to determine if the modal dialog has a fixed size body or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsBodySizeFixed = function (bodyFixed) {
	if (typeof bodyFixed === "boolean") {
		this.m_body.isBodySizeFixed = bodyFixed;
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog is fixed to the icon or not.  If this flag is set
 * the modal dialog will be displayed as an extension of the icon used to launch the dialog, much like a popup window.
 * In this case the Top and Right margins are ignored and the location of the icon will determine those margins.  If this
 * flag is set to false the modal dialog window will be displayed according to all of the margin settings.
 * @param {boolean} fixedToIcon A boolean that can be used to determine if the modal is fixed to the launch icon or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsFixedToIcon = function (fixedToIcon) {
	if (typeof fixedToIcon === "boolean") {
		this.m_isFixedToIcon = fixedToIcon;
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog footer is always shown or not
 * @param {boolean} footerAlwaysShown A boolean used to determine if the modal dialog footer is always shown or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIsFooterAlwaysShown = function (footerAlwaysShown) {
	if (typeof footerAlwaysShown === "boolean") {
		this.m_footer.isAlwaysShown = footerAlwaysShown;
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the left margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the left margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setLeftMarginPercentage = function (margin) {
	if (typeof margin === "number") {
		this.m_margins.left = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if (this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the right margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the right margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setRightMarginPercentage = function (margin) {
	if (typeof margin === "number") {
		this.m_margins.right = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if (this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};

/**
 * Sets the flag which identifies if the modal dialog close icon is shown or not
 * @param {boolean} showCloseIcon A boolean used to determine if the modal dialog close icon is shown or not
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setShowCloseIcon = function (showCloseIcon) {
	if (typeof showCloseIcon === "boolean") {
		this.m_showCloseIcon = showCloseIcon;
	}
	return this;
};

/**
 * Sets the percentage of the window size that will make up the top margin of the modal dialog.  The default value is 5.
 * @param {number} margin A number that determines what percentage of the window's width will make up the top margin of the modal dialog
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setTopMarginPercentage = function (margin) {
	if (typeof margin === "number") {
		this.m_margins.top = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if (this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};
/**
 * Sets the text to be displayed in the footer of the modal dialog.
 * @param {string} footerText The text to display in the footer of the modal dialog.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterText = function (footerText) {
	if (typeof footerText === "string" && footerText !== "") {
		this.m_footer.footerText.text = footerText;
		if (this.isActive()) {
			//Update the footer text if the dialog is active
			$("#" + this.getFooterTextElementId()).html(footerText);
		}
	}
	return this;
};
/* MPageTooltip Standard Function to create Hover */
function MPageTooltip() {
	this.anchor = null;
	this.content = null;
	this.flipfit = true;
	this.height = 0;
	this.offsetX = 20;
	this.offsetY = 20;
	this.showDelay = 500;
	this.tolerance = 5;
	this.stillHovered = false;
	this.width = 0;
	this.x = 0;
	this.y = 0;
	return this;
}
MPageTooltip.prototype.getAnchor = function () {
	return this.anchor;
};
MPageTooltip.prototype.setAnchor = function (anchor) {
	this.anchor = anchor;
	return this;
};
MPageTooltip.prototype.getContent = function () {
	return this.content;
};
MPageTooltip.prototype.setContent = function (content) {
	this.content = $("<div class='mpage-tooltip'>").html(content).hide();
	return this;
};
MPageTooltip.prototype.shouldFlipfit = function () {
	return this.flipfit;
};
MPageTooltip.prototype.setShouldFlipfit = function (flipfit) {
	if (typeof flipfit !== "boolean") {
		throw new Error("Called setShouldFlipfit on DiscernTooltip with non boolean type for flipfit parameter");
	}
	this.flipfit = flipfit;
	return this;
};
MPageTooltip.prototype.getHeight = function () {
	return this.height;
};
MPageTooltip.prototype.setHeight = function (height) {
	if (typeof height !== "number") {
		throw new Error("Called setHeight on MPageTooltip with non number type for height parameter");
	}
	this.height = height;
	return this;
};
MPageTooltip.prototype.getOffsetX = function () {
	return this.offsetX;
};
MPageTooltip.prototype.setOffsetX = function (offsetX) {
	if (typeof offsetX !== "number") {
		throw new Error("Called setOffsetX on MPageTooltip with non number type for offsetX parameter");
	}
	this.offsetX = offsetX;
	return this;
};
MPageTooltip.prototype.getOffsetY = function () {
	return this.offsetY;
};
MPageTooltip.prototype.setOffsetY = function (offsetY) {
	if (typeof offsetY !== "number") {
		throw new Error("Called setOffsetY on MPageTooltip with non number type for offsetY parameter");
	}
	this.offsetY = offsetY;
	return this;
};
MPageTooltip.prototype.getShowDelay = function () {
	return this.showDelay;
};
MPageTooltip.prototype.setShowDelay = function (showDelay) {
	if (typeof showDelay !== "number") {
		throw new Error("Called setShowDelay on DiscernTooltip with non number type for showDelay parameter");
	}
	if (showDelay < 0) {
		throw new Error("Called setShowDelay on DiscernTooltip with negative value, showDelay must be > 0");
	}
	this.showDelay = showDelay;
	return this;
};
MPageTooltip.prototype.isStillHovered = function () {
	return this.stillHovered;
};
MPageTooltip.prototype.setIsStillHovered = function (stillHovered) {
	if (typeof stillHovered !== "boolean") {
		throw new Error("Called setIsStillHovered on DiscernTooltip with non boolean type for stillHovered parameter");
	}
	this.stillHovered = stillHovered;
	return this;
};
MPageTooltip.prototype.getTolerance = function () {
	return this.tolerance;
};
MPageTooltip.prototype.setTolerance = function (tolerance) {
	if (typeof tolerance !== "number") {
		throw new Error("Called setTolerance on MPageTooltip with non number type for tolerance parameter");
	}
	this.tolerance = tolerance;
};
MPageTooltip.prototype.getWidth = function () {
	return this.width;
};
MPageTooltip.prototype.setWidth = function (width) {
	if (typeof width !== "number") {
		throw new Error("Called setWidth on MPageTooltip with non number type for width parameter");
	}
	this.width = width;
	return this;
};
MPageTooltip.prototype.getX = function () {
	return this.x;
};
MPageTooltip.prototype.setX = function (x) {
	if (typeof x !== "number") {
		throw new Error("Called setX on MPageTooltip with non number type for x parameter");
	}
	this.x = x;
	return this;
};
MPageTooltip.prototype.getY = function () {
	return this.y;
};
MPageTooltip.prototype.setY = function (y) {
	if (typeof y !== "number") {
		throw new Error("Called setY on MPageTooltip with non number type for y parameter");
	}
	this.y = y;
	return this;
};
MPageTooltip.prototype.show = function () {
	var self = this;
	this.stillHovered = true;
	$(this.getAnchor()).on("mouseleave.discernTooltip", function (event) {
		self.setIsStillHovered(false);
		if (self.getContent()) {
			self.getContent().remove();
		}
		$(self.getAnchor()).unbind(".discernTooltip");
	});
	setTimeout(function () {
		self.checkAnchorStillExists();
		if (!self.isStillHovered()) {
			return;
		}
		$(document.body).append(self.getContent());
		self.setHeight(self.getContent().height());
		self.setWidth(self.getContent().width());
		self.getContent().css({
			left : self.calculatePosition(self.x, $(window).width() - self.getTolerance(), self.width, self.getOffsetX()),
			top : self.calculatePosition(self.y, $(window).height() - self.getTolerance(), self.height, self.getOffsetY())
		});
		self.content.show();
		$(self.getAnchor()).on("mousemove.discernTooltip", function (event) {
			if (!self.isStillHovered()) {
				return;
			}
			self.setX(event.pageX).setY(event.pageY);
			self.content.css("left", self.calculatePosition(event.pageX, $(window).width() - self.getTolerance(), self.width, self.getOffsetX()));
			self.content.css("top", self.calculatePosition(event.pageY, $(window).height() - self.getTolerance(), self.height, self.getOffsetY()));
		});
	}, this.getShowDelay());
};
MPageTooltip.prototype.calculatePosition = function (mouseValue, windowValue, tooltipValue, paramOffset) {
	if (this.shouldFlipfit() && mouseValue + paramOffset > (windowValue - tooltipValue)) {
		var positionVal = mouseValue - tooltipValue - paramOffset;
		if (positionVal < 0) {
			positionVal = ((windowValue) / 2) - (tooltipValue / 2);
		}
		return positionVal;
	}
	return mouseValue + paramOffset;
};
MPageTooltip.prototype.checkAnchorStillExists = function () {
	var self = this;
	function checkHoverAnchor() {
		try {
			if (!$(document.body).find(self.getAnchor()).length) {
				self.getContent().remove();
				self.setIsStillHovered(false);
				return;
			}
			if (!self.isStillHovered()) {
				return;
			}
			setTimeout(checkHoverAnchor, 5000);
		} catch (exe) {
			return;
		}
	}
	checkHoverAnchor();
};
/* End mpageTooltip are */

/* Page Functionality Start From here */

/*
 * @function Handles to call a ccl script to gather data and return the json object
 * @param {string} program : The program string contains actual program name which need to call.
 * @param {string} paramAr : The paramAr string contains neccssary parameter which need to pass in script.
 * @param {boolean} async : The  async boolean contains yes/no value to call ajax method.
 * @param {function} callback : The  callback function execute when ajax call succesfully finish script call.
 */
function PWX_CCL_Request(program, paramAr, async, callback) {
	var info = new XMLCclRequest();
	info.onreadystatechange = function () {
		if (info.readyState == 4 && info.status == 200) {
			try {
				var jsonEval = JSON.parse(this.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS === "S") {
					callback.call(recordData);
				} else {
					$('#amb_ftorder_promodal').empty();
					$('#amb_ftorder_promodal').html('<span>Please refresh page and try again! (Script Name: ' + program + ')</span>');
				}
			} catch (e) {
				$('#amb_ftorder_promodal').empty();
				$('#amb_ftorder_promodal').html('<span>Error in JSON parse(Script Name: ' + program + ')</span>');
			}
		}
	};
	info.open('GET', program, async);
	info.send(paramAr.join(","));
}

/*
 * @function Handles to call a ccl script to gather Order List and return the json object
 * @param {string} program : The program string contains actual program name which need to call.
 * @param {string} paramAr : The paramAr string contains neccssary parameter which need to pass in script.
 * @param {boolean} async : The async boolean contains yes/no value to call ajax method.
 * @param {function} callback : The callback function execute when ajax call succesfully finish script call.
 */
function PWX_CCL_OrderRequest(program, paramAr, async, callback) {
	var info = new XMLCclRequest();
	info.onreadystatechange = function () {
		if (info.readyState == 4 && info.status == 200) {
			try {
				var jsonEval = JSON.parse(this.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS === "S") {
					callback.call(recordData);
				} else {
					createCheckpoint("USR:MPG.AMBFUTUREORDERICD9CLEAN.O1 - load mPage", "Stop");
					$('#amb_futorder_content').empty();
					$('#amb_futorder_content').html('<span class="amb_ftorder_parseer_msg">Something went wrong. Please refresh page and try again! (Script Name: ' + program + ')</span>');
				}
			} catch (e) {
				createCheckpoint("USR:MPG.AMBFUTUREORDERICD9CLEAN.O1 - load mPage", "Stop");
				$('#amb_futorder_content').empty();
				$('#amb_futorder_content').html('<span class="amb_ftorder_parseer_msg">Some special character found in JSON parse. Please contact support! (Script Name: ' + program + ')</span>');
			}
		}
	};
	info.open('GET', program, async);
	info.send(paramAr.join(","));
}

/*
 * @function Handles to call a ccl script to gather Location prefrence List and return the json object
 * @param {string} program : The program string contains actual program name which need to call.
 * @param {string} param1 : The param1 string contains prsnl Id.
 * @param {string} param2 : The param2 string contains prefrence Id to unique identify user prefrence for location prefrence.(AMB_FTORDER_LOCATION_FAV)
 * @param {string} param3 : The param3 string contains joined location code which need to insert as a prefrence.
 * @param {boolean} async : The async boolean contains yes/no value to call ajax method.
 * @param {object} MP_ModalDialog : The MP_ModalDialog object contains refrence for modal object.
 * @param {Array} amb_ftorder_selected_loc_array : The amb_ftorder_selected_loc_array array contains display name of location selected.
 * @param {Array} amb_ftorder_selected_loccd_array : The amb_ftorder_selected_loccd_array array contains code value of location selected.
 */
function PWX_SUMM_CCL_Request_LOCMODAL_User_Pref(program, param1, param2, param3, async, MP_ModalDialog, amb_ftorder_selected_loc_array, amb_ftorder_selected_loccd_array) {
	var info = new XMLCclRequest();
	info.onreadystatechange = function () {
		if (info.readyState == 4 && info.status == 200) {
			try {
				var jsonEval = JSON.parse(this.responseText);
			} catch (e) {
				pwxerrormodal(this.status, this.requestText, "Some special character found in JSON parse. Please contact support! Script Name")
			}
			var recordData = jsonEval.RECORD_DATA;
			if (recordData.STATUS_DATA.STATUS == "S") {
				if (param3 !== "") {
					$("#amb_ftorder_locmodal").text('(' + param3.length + ') Selected') //change none selected with selected number of location
				} else {
					$("#amb_ftorder_locmodal").text("None Selected")
					$("#amb_ftorder_promodal").text("None Selected")
				}
				AmbGetProviderFavList(); //call CCL script on save click to get provider list fill out to provider modal box
				amb_ftorder_loc_lt_query_ind = 1
					amb_ftorder_loc_html_save = $('.amb_ftorder_loc_list_main').html();
				amb_ftorder_selected_loc_list_hover = amb_ftorder_selected_loc_array;
				amb_ftorder_selected_loc_cd = amb_ftorder_selected_loccd_array;
				if ($("#amb_ftorder_sdcal").val() !== "" && $("#amb_ftorder_edcal").val() !== "" && param3 !== "") {
					$('button#amb_ftorder_display').prop('disabled', false);
				} else {
					$('button#amb_ftorder_display').prop('disabled', true);
				}
				AmbFutureOrderHover(); //display hover
				MP_ModalDialog.closeModalDialog("SaveFavlocModal"); //close diaglos box upon script call
			} else {
				pwxerrormodal(this.status, this.requestText, "Something went wrong. Please refresh page and try again!")
			}
		}
	};
	var sendArr = ["^MINE^", param1 + ".0", "^" + param2 + "^", "^" + param3 + "^"];
	info.open('GET', program, async);
	info.send(sendArr.join(","));
}

/*
 * @function Handles to call a ccl script to gather Provider prefrence List and return the json object
 * @param {string} program : The program string contains actual program name which need to call.
 * @param {string} param1 : The param1 string contains prsnl Id.
 * @param {string} param2 : The param2 string contains prefrence Id to unique identify user prefrence for provider prefrence.(AMB_FTORDER_PROV_FAV)
 * @param {string} param3 : The param3 string contains joined provider id which need to insert as a prefrence.
 * @param {boolean} async : The async boolean contains yes/no value to call ajax method.
 * @param {object} MP_ModalDialog : The MP_ModalDialog object contains refrence for modal object.
 * @param {Array} amb_ftorder_selected_prov_array : The amb_ftorder_selected_prov_array array contains display name of provider selected.
 * @param {Array} amb_ftorder_selected_provid_array : The amb_ftorder_selected_provid_array array contains Id value of provider selected.
 */
function PWX_SUMM_CCL_Request_PROVMODAL_User_Pref(program, param1, param2, param3, async, MP_ModalDialog, amb_ftorder_selected_prov_array, amb_ftorder_selected_provid_array) {
	var info = new XMLCclRequest();
	info.onreadystatechange = function () {
		if (info.readyState == 4 && info.status == 200) {
			try {
				var jsonEval = JSON.parse(this.responseText);
			} catch (e) {
				pwxerrormodal(this.status, this.requestText, "Some special character found in JSON parse. Please contact support!")
			}
			var recordData = jsonEval.RECORD_DATA;
			if (recordData.STATUS_DATA.STATUS == "S") {
				if (param3 !== "") {
					$("#amb_ftorder_promodal").text('(' + param3.length + ') Selected') //change none selected with selected number of provider
				} else {
					$("#amb_ftorder_promodal").text("None Selected")
				}
				amb_ftorder_prov_lt_query_ind = 1
					amb_ftorder_prov_html_save = $('.amb_ftorder_prov_list_main').html();
				amb_ftorder_selected_prov_list_hover = amb_ftorder_selected_prov_array;
				amb_ftorder_selected_prov_id = amb_ftorder_selected_provid_array;
				AmbFutureOrderHover(); //display hover
				MP_ModalDialog.closeModalDialog("FtorderProvFav"); //close diaglos box upon script call
			} else {
				pwxerrormodal(this.status, this.requestText, "Something went wrong. Please refresh page and try again!")
			}
		}
	};
	var sendArr = ["^MINE^", param1 + ".0", "^" + param2 + "^", "^" + param3 + "^"];
	info.open('GET', program, async);
	info.send(sendArr.join(","));
}

/*
 * @function Handles to call a ccl script to gather Best Encounter and return JSON object
 * @param {string} program : The program string contains actual program name which need to call.
 * @param {string} paramAr : The paramAr string contains neccssary parameter(person Id)which need to pass in script.
 * @param {boolean} async : The async boolean contains yes/no value to call ajax method.
 * @param {function} callback : The callback function execute when ajax call succesfully finish script call.
 */
function Amb_Get_Best_Encounter(program, paramAr, async, callback) {
	var info = new XMLCclRequest();
	info.onreadystatechange = function () {
		if (info.readyState == 4 && info.status == 200) {
			var jsonEval = JSON.parse(this.responseText);
			var recordData = jsonEval.JSON_RETURN;
			if (recordData.STATUS_DATA.STATUS == "S") {
				callback.call(recordData);
			} else {
				pwxerrormodal(this.status, this.requestText, "Something went wrong. Please refresh page and try again!")
			}
		}
	};
	info.open('GET', program, async);
	info.send(paramAr.join(","));
}

/*
 * @function Handles to call a ccl script to gather selected Provider prefrence and render prvoider modal
 */
function AmbGetProviderFavList() {
	$('#amb_ftorder_promodal').empty();
	$('#amb_ftorder_promodal').html('<span class="amb_ftorder_loading-spinner"></span>');
	var sendArr = ["^MINE^", provider_id_global + ".0", "0"];
	PWX_CCL_Request("AMB_MP_FORDER_PROV_LIST", sendArr, false, function () {
		amb_ftorder_prov_lt_query_ind = 0
			RenderFutureOrderProvModal(this);
	});
}

/*
 * @function Handles to open a modal when there is error in AJAX call which initiated via MODAL.
 * @param {string} status : The status string contains ajax error code.
 * @param {string} requesttext : The requesttext string contains meanigful information when ajax call fail.
 * @param {string} title : The title string contains title of the modal.
 */
function pwxerrormodal(status, requesttext, title) {
	var error_text = "Failed to Remove! Status: " + status + " Request Text: " + requesttext;
	MP_ModalDialog.deleteModalDialogObject("pwxerrormodal")
	var pwxerrorModalobj = new ModalDialog("pwxerrormodal")
		.setHeaderTitle('<span class="pwx_alert">' + title + '</span>')
		.setTopMarginPercentage(20)
		.setRightMarginPercentage(35)
		.setBottomMarginPercentage(30)
		.setLeftMarginPercentage(35)
		.setIsBodySizeFixed(true)
		.setHasGrayBackground(true)
		.setIsFooterAlwaysShown(true);
	pwxerrorModalobj.setBodyDataFunction(
		function (modalObj) {
		modalObj.setBodyHTML('<div style="padding-top:10px;"><p class="pwx_small_text">' + error_text + '</p></div>');
	});
	var closebtn = new ModalButton("addCancel");
	closebtn.setText("OK").setCloseOnClick(true);
	pwxerrorModalobj.addFooterButton(closebtn)
	MP_ModalDialog.addModalDialogObject(pwxerrorModalobj);
	MP_ModalDialog.showModalDialog("pwxerrormodal")
}

/*
 * @function Create promt input for ccl script when there are multiple value possible in one parameter.
 * @param {Array} ar : The ar array contains promt .
 * @param {string} type : The type string contains 1 or o to identify when to append .00 at the end.
 */
function CreateParamArray(ar, type) {
	var returnVal = (type === 1) ? "0.0" : "0";
	if (ar && ar.length > 0) {
		if (ar.length > 1) {
			if (type === 1) {
				returnVal = "value(" + ar.join(".0,") + ".0)";
			} else {
				returnVal = "value(" + ar.join(",") + ")";
			}
		} else {
			returnVal = (type === 1) ? ar[0] + ".0" : ar[0];
		}
	}
	return returnVal;
}

/*
 * @function handle sorting for person name
 * @param {string} a : The a string person name.
 * @param {string} b : The b string contain person name with a string need to match.
 */
function amb_sort_by_pname(a, b) {
	var nameA = a.PERSON_NAME.toLowerCase(),
	nameB = b.PERSON_NAME.toLowerCase()
		if (nameA < nameB)
			return -1
			if (nameA > nameB)
				return 1
				return 0
}

/*
 * @function handle sorting for order start date
 * @param {string} a : The a string order start date.
 * @param {string} b : The b string contain order start date with a string need to match.
 */
function amb_sort_by_ostartdate(a, b) {
	var nameA = a.ORDER_SORT_DT,
	nameB = b.ORDER_SORT_DT
		if (nameA < nameB)
			return -1
			if (nameA > nameB)
				return 1
				return 0
}

/*
 * @function handle sorting for ICD name
 * @param {string} a : The a string ICD name.
 * @param {string} b : The b string contain ICD name with a string need to match.
 */
function amb_sort_by_icdname(a, b) {
	var nameA = a.ORDER_DIAG.toLowerCase(),
	nameB = b.ORDER_DIAG.toLowerCase()
		if (nameA < nameB)
			return -1
			if (nameA > nameB)
				return 1
				return 0
}

/*
 * @function handle sorting for ICD name
 * @param {string} a : The a string ICD name.
 * @param {string} b : The b string contain ICD name with a string need to match.
 */
function amb_sort_by_oname(a, b) {
	var nameA = a.ORDERED_AS_NAME.toLowerCase(),
	nameB = b.ORDERED_AS_NAME.toLowerCase()
		if (nameA < nameB)
			return -1
			if (nameA > nameB)
				return 1
				return 0
}

/*
 * @function handle sorting for Order Type
 * @param {string} a : The a string order type.
 * @param {string} b : The b string contain order type with a string need to match.
 */
function amb_sort_by_otype(a, b) {
	var nameA = a.ORDER_CDL.toLowerCase(),
	nameB = b.ORDER_CDL.toLowerCase()
		if (nameA < nameB)
			return -1
			if (nameA > nameB)
				return 1
				return 0
}

/*
 * @function handle filter list base on key word
 * @param {string} textbox : The textbox string contain Id of the textbox where keyword need to enter for search.
 * @param {Boolean} selectSingleMatch : The selectSingleMatch boolean value contain yes or no value.
 */
jQuery.fn.filterByText = function (textbox, selectSingleMatch) {
	return this.each(function () {
		var select = this;
		var options = [];
		$(select).find('option').each(function () {
			options.push({
				value : $(this).val(),
				text : $(this).text(),
				status : $(this).prop("disabled")
			});
		});
		$(select).data('options', options);
		$(textbox).bind('change keyup', function () {
			var options = $(select).empty().data('options');
			var search = $.trim($(this).val());
			if(ambclearfackeyeventind === 1 || ambclearprovkeyeventind === 1){
			  search = "";				
			  ambclearfackeyeventind = 0;
			  ambclearprovkeyeventind = 0;
			}
			try {
				var regex = new RegExp(search, "gi");
			} catch (e) {
				return false;
			}
			var selected_item_fac = [];
		    $('#amb_ftorder_loc_to_select  option').each(function () {
	    	  selected_item_fac.push($(this).val());
		    });
			var selected_item_prov = [];
		    $('#amb_ftorder_prov_to_select  option').each(function () {
	    	  selected_item_prov.push($(this).val());
		    });
			$.each(options, function (i) {
				var option = options[i];
				if (option.text.match(regex) !== null) {
					if(selected_item_fac.indexOf(option.value) !== -1){
					option.status = "True"}
					if(selected_item_prov.indexOf(option.value) !== -1){
					option.status = "True"}
					$(select).append(
						$('<option>').text(option.text).val(option.value).prop("disabled", option.status));
				}
			});
			if (selectSingleMatch === true && $(select).children().length === 1) {
				$(select).children().get(0).selected = true;
			}
		})
	})
}

/*
 * @function handle to create RTMS version 4 timer
 * @param {string} eventName : The eventName string contain name of the timer.
 * @param {string} subeventName : The subeventName string value contain start and stop indication for timer.
 */
function createCheckpoint(eventName, subeventName) {
	var checkpoint = window.external.DiscernObjectFactory("CHECKPOINT");
	checkpoint.EventName = eventName;
	checkpoint.SubEventName = subeventName;
	checkpoint.Metadata("rtms.legacy.subtimerName") = eventName;
	checkpoint.Publish();
}

/*
 * @Area where global variable declared
 */
var amb_ftorder_sort_ind = "0";
var pwxdocumentData = "";
var amb_ftorder_header_id = "amb_ftorder_ostartdate_header_id"; //default sorting id
var amb_ftorder_start_index = 0
	var amb_ftorder_end_index = 0
	var amb_ftorder_total_pages = 0
	var amb_ftorder_ordercount_page = 15;
var provider_id_global = 0;
var order_modify_priv = 1;
var provider_id_positioncd = 0;
var amb_ftorder_loc_lt_query_ind = 0;
var amb_ftorder_loc_html_save = "";
var amb_ftorder_prov_lt_query_ind = 0;
var amb_ftorder_prov_html_save = "";
var amb_ftorder_selected_loc_list_hover = [];
var amb_ftorder_selected_loc_cd = [];
var amb_ftorder_selected_prov_list_hover = [];
var amb_ftorder_selected_prov_id = [];
var amb_ftorder_search_perrsonid = 0.0;
var amb_ftorder_cclcall_param = [];
var amb_ftorder_start_date = "";
var amb_ftorder_enddate_date = "";
var amb_ftorder_selected_order = 0;
var amb_ftorder_modal_open_count = 0;
var amb_ftorder_modal_prov_open_count = 0;
var amb_error_order_ind = 0;
var ccl_timer = 0;
var ambclearprovkeyeventind = 0;
var ambclearfackeyeventind = 0;
var encounterperson = new Array(); //store all best encounter
/*
 * @function handle to Render Header List Items.
 */
function RenderAmbFutureOrderCleanup() {
	$("#amb_futorder_head").empty()
	$("#amb_futorder_content").empty();
	$('#amb_futorder_filter_content').empty();
	var js_criterion = JSON.parse(m_criterionJSON);
	var amb_ftorder_leading_zero = "";
	var headelement = document.getElementById('amb_futorder_head'); //get id which is set up in driver program
	var pwxheadHTML = [];
	if (js_criterion.CRITERION.DIAG_IND === 1) { //check if diagnsosis compliance date is set or not under preferencemanager.exe(default->system->component->om->powerorder)
		provider_id_global = js_criterion.CRITERION.PRSNL_ID
		provider_id_positioncd = js_criterion.CRITERION.POSITION_CD
		order_modify_priv = js_criterion.CRITERION.MODIFY_ORDER_IND
		//formate default start and end date
	    //var datetocompare = new Date(2015,7,1);
		var compliancedatecompare = new Date(js_criterion.CRITERION.DIAG_COMPLIANCEDATE[0].COMPDATE)
		var comparedates = compliancedatecompare.getDate()
		var comparemonths = compliancedatecompare.getMonth()
		var compareyears  = compliancedatecompare.getFullYear()
		var datetocompare = new Date(compareyears,comparemonths,comparedates);	
		var today = new Date();
		if(today < datetocompare){
			amb_ftorder_start_date = new Date(js_criterion.CRITERION.DIAG_COMPLIANCEDATE[0].COMPDATE);		
		}else{
			amb_ftorder_start_date = new Date();		
		}		
		if (amb_ftorder_start_date.getDate() < 10) {
			amb_ftorder_leading_zero = "0" + amb_ftorder_start_date.getDate()
		} else {
			amb_ftorder_leading_zero = amb_ftorder_start_date.getDate()
		}
		if ((amb_ftorder_start_date.getMonth() + 1) < 10) {
			var startmonth = "0" + (amb_ftorder_start_date.getMonth() + 1)
		} else {
			var startmonth = amb_ftorder_start_date.getMonth() + 1
		}
		amb_ftorder_start_date = startmonth + "/" + amb_ftorder_leading_zero + "/" + amb_ftorder_start_date.getFullYear()
		var defaultcalanderdate = new Date(compliancedatecompare);
		var diagcompdate = new Date(amb_ftorder_start_date);
		diagcompdate.setDate(diagcompdate.getDate() + 14);
		var year = diagcompdate.getFullYear();
		if ((diagcompdate.getMonth() + 1) < 10) { // JS months are 0 to 11, so need to add 1
			var endmonth = "0" + (diagcompdate.getMonth() + 1)
		} else {
			var endmonth = diagcompdate.getMonth() + 1
		}
		var date = "";
		if (diagcompdate.getDate() < 10) {
			date = "0" + diagcompdate.getDate()
		} else {
			date = diagcompdate.getDate()
		}
		var amb_ftorder_enddate_date = endmonth + "/" + date + "/" + year
			//display frame header
			pwxheadHTML.push('<div style="height:43px;" class="amb_ftorder_header_div">',
				'<dl class="amb_ftorder_header_label">',
				'<dd class="amb_ftorder_sdlabel"> <span style="color:red">*</span>Order Start Date</dd>',
				'<dd class="amb_ftorder_edlabel"> <span style="color:red">*</span>Order End Date</dd>',
				'<dd class="amb_ftorder_loclabel"> <span style="color:red">*</span>Provider Facilities</dd>',
				'<dd class="amb_ftorder_prolabel"> Ordering Providers</dd>',
				'<dd class="amb_ftorder_pslabel"> Patients</dd>',
				'</dl>',
				'<dl class="amb_ftorder_header_ui">',
				'<dd class="amb_ftorder_sdui"><input value="' + amb_ftorder_start_date + '" type="text" id="amb_ftorder_sdcal" class="amb_ftorder_cal_txt" name="FirstName"/><span class="amb_ftorder_sdate_calicon amb_ftorder_calicon amb_no_text_decor amb_ftorder_clstyle">&nbsp;</span></dd>',
				'<dd class="amb_ftorder_edui"><input value="' + amb_ftorder_enddate_date + '" type="text" id="amb_ftorder_edcal" class="amb_ftorder_cal_txt" name="FirstName1"/><span class="amb_ftorder_edate_calicon amb_ftorder_calicon amb_no_text_decor amb_ftorder_clstyle">&nbsp;</span></dd>',
				'<dd class="amb_ftorder_locui">',
				'<a id="amb_ftorder_locmodal" class="amb_ftorder_footer_prevclass"></a>',
				'</dd>',
				'<dd class="amb_ftorder_proui">',
				'<a id="amb_ftorder_promodal" class="amb_ftorder_footer_prevclass">',
				'</a>',
				'</dd>',
				'<dd class="amb_ftorder_psui">',
				'<a style="vertical-align: middle;" id="amb_ftorder_prsearchmodal" class="amb_ftorder_footer_prevclass">None Selected</a>',
				'<span style="vertical-align: middle;" id="amb_ftorder_prname"></span>',
				'<a style="margin-left:5px;display:none" title="Remove patient name" class="amb_ftorder_closeicon amb_no_text_decor">&nbsp;</a>',
				'</dd>',
				'<dd class="amb_ftorder_showhideorder">',
				'<label class="amb-ftorder-checkbox-class"><input type="checkbox" class="amb_ftorder_hideorder_class" id="amb_ftorder_hideorder_id" /> <span id="amb-ftorder-hideshow-label"> Hide orders not updated</span></label>',
				'</dd>',
				'<dd class="amb_ftorder_button"><button id="amb_ftorder_display" type="button">Display</button></dd>',
				'</dl>',
				'</div>');
		headelement.innerHTML = pwxheadHTML.join("");
		RenderFutureOrderLocationModal(js_criterion) //render location modal information
		AmbGetProviderFavList(); //call script to get provider selection
		//person search window API call
		$('#amb_ftorder_prsearchmodal').off('click');
		$('#amb_ftorder_prsearchmodal').on('click', function (event) {
			var patientSearch = window.external.DiscernObjectFactory("PVPATIENTSEARCHMPAGE"); //creates patient search object
			var searchResult = patientSearch.SearchForPatientAndEncounter(); //launches patient search dialog and assigns the returned object to a variable when the dialog closes.
			if (searchResult.PersonId > 0 && searchResult.EncounterId >= 0) {
				amb_ftorder_search_perrsonid = searchResult.PersonId
					var sendArr = ["^MINE^", provider_id_global + ".0", "1", searchResult.PersonId + ".0"];
				PWX_CCL_Request("AMB_MP_FORDER_PROV_LIST", sendArr, true, function () {
					$("#amb_ftorder_prsearchmodal").hide();
					$("#amb_ftorder_prname").text(this.PERSON_NAME)
					$("#amb_ftorder_prname").attr("title", this.PERSON_NAME_FULL)
					$(".amb_ftorder_closeicon").show()
				});
			}
		});
		//Remove Person Name when user click on close icon
		$('.amb_ftorder_closeicon').off('click');
		$('.amb_ftorder_closeicon').on('click', function (event) {
			$("#amb_ftorder_prname").text("")
			$("#amb_ftorder_prname").removeAttr("title")
			$(".amb_ftorder_closeicon").hide()
			$("#amb_ftorder_prsearchmodal").show();
			amb_ftorder_search_perrsonid = 0.0
		});
		/*date range area*/
		/* start date calendar icon */
		$(".amb_ftorder_sdate_calicon").click(function () {
			$("#amb_ftorder_sdcal").datepicker("show")
		});
		/* end date calendar icon */
		$(".amb_ftorder_edate_calicon").click(function () {
			$("#amb_ftorder_edcal").datepicker("show")
		});
		//check for null value if user edit textbox through keyboard
		$('#amb_ftorder_sdcal,#amb_ftorder_edcal').keyup(function () {
			if ($('#amb_ftorder_sdcal').val() == "" || $('#amb_ftorder_edcal').val() == "") {
				$('button#amb_ftorder_display').prop('disabled', true);
			} else {
				$('button#amb_ftorder_display').prop('disabled', false);
			}
		});
		//This area execute when user select dates
		var dates = $("#amb_ftorder_sdcal, #amb_ftorder_edcal").datepicker({
				changeMonth : true,
				changeYear : true,
				minDate : defaultcalanderdate,
				onSelect : function (selectedDate) {
					var option = this.id == "amb_ftorder_sdcal" ? "minDate" : "maxDate",
					instance = $(this).data("datepicker"),
					date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
					dates.not(this).datepicker("option", option, date);
					//hide display button if there is no location
					if (CreateParamArray(amb_ftorder_selected_loc_cd, 1) !== "0.0") {
						$('button#amb_ftorder_display').prop('disabled', false);
					} else {
						$('button#amb_ftorder_display').prop('disabled', true);
					}
				}
			});
		//check exclude ICD10 without mapping checkbox click or not
		$("div.amb_ftorder_header_div .amb_ftorder_hideorder_class").off('change')
		$("div.amb_ftorder_header_div .amb_ftorder_hideorder_class").change(function () {
			if (this.checked) {
				amb_error_order_ind = 1
			} else {
				amb_error_order_ind = 0
			}
			$('#amb_ftorder_tbody_id').empty();
			amb_ftorder_header_id = "amb_ftorder_ostartdate_header_id";
			amb_ftorder_sort_ind = "0";
			$('#amb_ftorder_tbody_id').html('<div id="amb_ftorder_loading_div"><span class="amb_ftorder_loading-spinner"></span><br/></div>');
			amb_ftorder_cclcall_param = AmbFutureOrderGetParameter(js_criterion)
				AmbGetOrderList(amb_ftorder_cclcall_param, 0)
		});
		//display orders base on current selected filter
		$('#amb_ftorder_display').off('click');
		$('#amb_ftorder_display').on('click', function (event) {
			//build display for render future order
			$('#amb_ftorder_tbody_id').empty();
			amb_ftorder_header_id = "amb_ftorder_ostartdate_header_id";
			amb_ftorder_sort_ind = "0";
			$('#amb_ftorder_tbody_id').html('<div id="amb_ftorder_loading_div"><span class="amb_ftorder_loading-spinner"></span><br/></div>');
			//get all parameter required to query on display click
			amb_ftorder_cclcall_param = AmbFutureOrderGetParameter(js_criterion)
				AmbGetOrderList(amb_ftorder_cclcall_param, 0)
		});
		//get all parameter required to query on default.
		amb_ftorder_cclcall_param = AmbFutureOrderGetParameter(js_criterion)
			//get all order list
			AmbGetOrderList(amb_ftorder_cclcall_param, 1)
	} else {
		pwxheadHTML.push('<div class="amb_ftorder_header_div"><span class="amb_ftorder-warning-icon"></span>Diagnosis compliance date not found. Please contact system administrator.</div>');
		headelement.innerHTML = pwxheadHTML.join("");
	}
}

/*
 * @function handle to create CCL parameter which need to pass in script for getting order back
 * @param {Object} js_criterion : The js_criterion Object contain all driver program Information.
 */
function AmbFutureOrderGetParameter(js_criterion) {
	//get all selected values
	var amb_ftorder_start_date = $("#amb_ftorder_sdcal").val();
	var amb_ftorder_end_date = $("#amb_ftorder_edcal").val();
	if (amb_ftorder_start_date === "" || amb_ftorder_end_date === "" || CreateParamArray(amb_ftorder_selected_loc_cd, 1) === "0.0") {
		$('button#amb_ftorder_display').prop('disabled', true);
	}
	amb_ftorder_cclcall_param = ["^MINE^", js_criterion.CRITERION.PRSNL_ID + ".0", js_criterion.CRITERION.POSITION_CD + ".0", "^" + amb_ftorder_start_date + "^", "^" + amb_ftorder_end_date + "^", CreateParamArray(amb_ftorder_selected_loc_cd, 1), CreateParamArray(amb_ftorder_selected_prov_id, 1), amb_ftorder_search_perrsonid + ".0", amb_error_order_ind];
	return amb_ftorder_cclcall_param
}

/*
 * @function handle get ICD-9 order in future status after diganosis compliance date
 * @param {Array} amb_ftorder_cclcall_param : The amb_ftorder_cclcall_param Array contain parameter need to pass in script.
 * @param {Int} defaultloadind : The defaultloadind integer value contain 1 or 0 for default load it is 0.
 */
function AmbGetOrderList(amb_ftorder_cclcall_param, defaultloadind) {
	if (defaultloadind === 1) {
		$('#amb_futorder_content').empty();
		$('#amb_futorder_content').html('<div id="amb_ftorder_loading_div"><span class="amb_ftorder_loading-spinner"></span><br/></div>');
	}
	createCheckpoint("USR:MPG.AMBFUTUREORDERICD9CLEAN.O1 - load mPage", "Start"); //start USR timer
	PWX_CCL_OrderRequest("AMB_MP_FUTUREORDER_CLEANUP", amb_ftorder_cclcall_param, true, function () {
		amb_ftorder_start_index = 0
			amb_ftorder_end_index = 0
			createCheckpoint("USR:MPG.AMBFUTUREORDERICD9CLEAN.O1 - load mPage", "Stop"); //stop USR timer
		RenderFutureOrder(this, amb_ftorder_start_index, amb_ftorder_end_index);
	});
}

/*
 * @function Render ICD9 order in future status after diganosis compliance date
 * @param {Object} pwxdata : The pwxdata Object contain JSON Order List.
 * @param {int} amb_ftorder_start_index_click : The amb_ftorder_start_index_click integer value indicate start index in JSON list for particular page.
 * @param {int} amb_ftorder_end_index_click : The amb_ftorder_end_index_click integer value indicate end index in JSON list for particular page.
 */
function RenderFutureOrder(pwxdata, amb_ftorder_start_index_click, amb_ftorder_end_index_click) {
	var amb_future_content_HTML_area = document.getElementById('amb_futorder_content');
	var amb_future_content_HTML = [];
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	try {
		/* page logic */
		createCheckpoint("ENG:MPG.AMBFUTUREORDERICD9CLEAN.O1 - render mPage", "Start"); //start render (ENG) timer
		var current_pag_numeber = 1;
		amb_ftorder_total_pages = Math.ceil((pwxdata.FUTUREOLIST.length) / amb_ftorder_ordercount_page) //calculate total number of pages we need to display
			if (amb_ftorder_start_index === 0 && amb_ftorder_end_index === 0) {
				amb_ftorder_start_index = 0;
				amb_ftorder_end_index = amb_ftorder_ordercount_page;
			} else {
				amb_ftorder_start_index = amb_ftorder_start_index_click;
				amb_ftorder_end_index = amb_ftorder_end_index_click;
			}
			//check if end index not greater than record we have
			if (amb_ftorder_end_index >= pwxdata.FUTUREOLIST.length) {
				amb_ftorder_end_index = pwxdata.FUTUREOLIST.length
			}
			//display page number in the textbox
			if (amb_ftorder_start_index !== 0) {
				current_pag_numeber = Math.ceil(amb_ftorder_end_index / amb_ftorder_ordercount_page)
			}
			//dither enable paging link logic
			if (current_pag_numeber == 1) {
				var amb_ftorder_pre_link = '<span class="amb_ftorder_footer_prevhide">< Previous</span>';
			} else {
				var amb_ftorder_pre_link = '<a id="amb_ftorder_footer_previd" title="Jump to previous page" class="amb_ftorder_footer_prevclass">< Previous</a>';
			}
			if (current_pag_numeber == amb_ftorder_total_pages) {
				var amb_ftorder_next_link = '<span class="amb_ftorder_footer_nexthide">Next ></span>';
			} else {
				var amb_ftorder_next_link = '<a id="amb_ftorder_footer_nextid" title="Jump to next page" class="amb_ftorder_footer_nextclass">Next ></a>';
			}
			//amb_ftorder_end_index = 5//pwxdata.FUTUREOLIST.length
			if (amb_ftorder_sort_ind == '1') {
				var sort_icon = 'amb_ftorder_up_icon';
			} else {
				var sort_icon = 'amb_ftorder_down_icon';
			}
			//starting table hedear section
			amb_future_content_HTML.push('<table cellspacing="0" id="amb_ftorder_table">');
		amb_future_content_HTML.push('<thead class="amb_ftorder_thead">');
		amb_future_content_HTML.push('<tr class="amb_ftorder_orderdetail_header">');
		amb_future_content_HTML.push('<td class="amb_ftorder_allselection_header">');
		amb_future_content_HTML.push('<input id="amb_ftorder_allselection_id" type="checkbox" /><span style="vertical-align: middle;padding-top:1%">&nbsp;</span></td>');
		//check if up and down arrow need to display or not (base on sorting action)
		if (amb_ftorder_header_id == 'amb_ftorder_pname_header_id') {
			amb_future_content_HTML.push('<td id="amb_ftorder_pname_header_id" class="amb_ftorder_pname_header">Patient<span style="vertical-align: middle;padding-top:1%" class="' + sort_icon + '"  id="task_sort_tgl">&nbsp;</span></td>');
		} else {
			amb_future_content_HTML.push('<td id="amb_ftorder_pname_header_id" class="amb_ftorder_pname_header">Patient<span style="vertical-align: middle;padding-top:1%">&nbsp;</span></td>');
		}
		if (amb_ftorder_header_id == 'amb_ftorder_ostartdate_header_id') {
			amb_future_content_HTML.push('<td id="amb_ftorder_ostartdate_header_id" class="amb_ftorder_sdate_header">Start Date<span style="vertical-align: middle;padding-top:3%" class="' + sort_icon + '" id="task_sort_tgl" >&nbsp;</span></td>');
		} else {
			amb_future_content_HTML.push('<td id="amb_ftorder_ostartdate_header_id" class="amb_ftorder_sdate_header">Start Date<span style="vertical-align: middle;padding-top:1%">&nbsp;</span></td>');
		}
		if (amb_ftorder_header_id == 'amb_ftorder_icd9_header_id') {
			amb_future_content_HTML.push('<td id="amb_ftorder_icd9_header_id" class="amb_ftorder_icdcode_header">ICD-9<span style="vertical-align: middle;padding-top:1%" class="' + sort_icon + '" id="task_sort_tgl">&nbsp;</span></td>');
		} else {
			amb_future_content_HTML.push('<td id="amb_ftorder_icd9_header_id" class="amb_ftorder_icdcode_header">ICD-9<span style="vertical-align: middle;padding-top:1%">&nbsp;</span></td>');
		}
		if (amb_ftorder_header_id == 'amb_ftorder_oname_header_id') {
			amb_future_content_HTML.push('<td id="amb_ftorder_oname_header_id" class="amb_ftorder_oname_header">Order Name<span style="vertical-align: middle;padding-top:1%" class="' + sort_icon + '" id="task_sort_tgl">&nbsp;</span></td>');
		} else {
			amb_future_content_HTML.push('<td id="amb_ftorder_oname_header_id" class="amb_ftorder_oname_header sort">Order Name<span style="vertical-align: middle;padding-top:1%">&nbsp;</span></td>');
		}
		if (amb_ftorder_header_id == 'amb_ftorder_otype_header_id') {
			amb_future_content_HTML.push('<td id="amb_ftorder_otype_header_id" class="amb_ftorder_otype_header">Type<span style="vertical-align: middle;padding-top:3%" class="' + sort_icon + '" id="task_sort_tgl">&nbsp;</span></td>');
		} else {
			amb_future_content_HTML.push('<td id="amb_ftorder_otype_header_id" class="amb_ftorder_otype_header">Type<span style="vertical-align: middle;padding-top:1%">&nbsp;</span></td>');
		}
		amb_future_content_HTML.push('</tr></thead>');
		//table body area started
		amb_future_content_HTML.push('<tbody id="amb_ftorder_tbody_id" class="amb_ftorder_tbody">');
		var amb_ftorder_index = 0;
		var amb_ftordder_checkbox_index = 0;
		var OrderValues = [];
		var amb_ftorder_stripe_class = "";
		if (pwxdata.FUTUREOLIST.length > 0) {
			for (var i = amb_ftorder_start_index; i < amb_ftorder_end_index; i++) {
				amb_ftorder_index = amb_ftorder_index + 1;
				if (amb_ftorder_index % 2 == 0) {
					amb_ftorder_stripe_class = "amb_ftorder_stripe_even_class";
				} else {
					amb_ftorder_stripe_class = "amb_ftorder_stripe_odd_class";
				}
				var orderstartdate = "";
				if (pwxdata.FUTUREOLIST[i].ORDER_START_DT_TM != "") {
					var orderstartdateUTCDate = new Date();
					orderstartdateUTCDate.setISO8601(pwxdata.FUTUREOLIST[i].ORDER_START_DT_TM)
					orderstartdate = orderstartdateUTCDate.format("shortDate3");
				}
				//remove last border from table
				if ((i + 1) !== amb_ftorder_end_index) {
					var bottom_border = 'border-bottom:1px solid #EDEDED;';
				} else {
					var bottom_border = 'border-bottom:none';
				}
				//amb_future_content_HTML.push('<tr class="amb_ftorder_orderdetailrow"><td class="amb_ftorder_icdcode">testing here</td></tr>');
				amb_future_content_HTML.push('<tr class="amb_ftorder_orderdetailrow ' + amb_ftorder_stripe_class + '">');
				amb_future_content_HTML.push('<td class="amb_ftorder_allselection">');
				amb_future_content_HTML.push('<input class="amb_ftorder_selection_class" value="' + amb_ftordder_checkbox_index + '" id="amb_ftorder_selection_id" type="checkbox" /><span style="display:none">' + pwxdata.FUTUREOLIST[i].ORDER_ID + '</span>');
				amb_future_content_HTML.push('</td>');
				amb_future_content_HTML.push('<td class="amb_ftorder_pname">');
				if (pwxdata.FUTUREOLIST[i].ORDER_MODIFYERROR_IND === 1) {
					amb_future_content_HTML.push('<span title="Error: System unable to transition order. Try again or go into patient\'\s chart." class="amb_ftorder_errorder amb_no_text_decor amb_ftorder_clstyle">&nbsp;</span>')
				}
				amb_future_content_HTML.push('<a title="Open Patient Chart" href="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + pwxdata.FUTUREOLIST[i].PERSON_ID + '\')" class="amb_ftorder_pname_link">' + pwxdata.FUTUREOLIST[i].PERSON_NAME + '</a>');
				amb_future_content_HTML.push('</td>');
				amb_future_content_HTML.push('<td class="amb_ftorder_sdate">' + monthNames[orderstartdateUTCDate.getMonth()] + ' ' + orderstartdateUTCDate.getDate() + ', ' + orderstartdateUTCDate.getFullYear() + '');
				amb_future_content_HTML.push('</td>');
				//get icd diganosis code
				amb_future_content_HTML.push('<td class="amb_ftorder_icdcode">');
				amb_future_content_HTML.push(pwxdata.FUTUREOLIST[i].ORDER_DIAG); //order diagnosis
				amb_future_content_HTML.push('</td><td class="amb_ftorder_oname">' + pwxdata.FUTUREOLIST[i].ORDERED_AS_NAME + '</td>'); //order name
				amb_future_content_HTML.push('<td class="amb_ftorder_otype">' + pwxdata.FUTUREOLIST[i].ORDER_CATALOG_CODE + '</td>'); //order type
				amb_future_content_HTML.push('</tr>');
				//order detail row
				amb_future_content_HTML.push('<tr class="amb_ftorder_orderdetailrow_right ' + amb_ftorder_stripe_class + '" style="' + bottom_border + '">');
				amb_future_content_HTML.push('<td class="amb_ftorder_allselection1">&nbsp;</td>');
				amb_future_content_HTML.push('<td class="amb_ftorder_page_detail">');
				amb_future_content_HTML.push('<span style="font-size:12px;color:#000;">' + pwxdata.FUTUREOLIST[i].AGE + '</span>&nbsp;&nbsp&nbsp;&nbsp<span style="font-size:12px;color:#000">' + pwxdata.FUTUREOLIST[i].GENDER_CHAR + '</span>');
				amb_future_content_HTML.push('&nbsp;&nbsp<span style="font-size:12px;color:#505050">DOB: <span><span style="font-size:12px;color:#000;">' + pwxdata.FUTUREOLIST[i].DOB + '</span>');
				amb_future_content_HTML.push('<br><span style="font-size:12px;color:#505050">MRN: <span style="font-size:12px;color:#000;">' + pwxdata.FUTUREOLIST[i].MRN + '</span></span>');
				amb_future_content_HTML.push('</td>');
				amb_future_content_HTML.push('<td class="amb_ftorder_odetail" colspan="4">');
				amb_future_content_HTML.push(pwxdata.FUTUREOLIST[i].ORDERING_PROVIDER+'</br>'); 
				amb_future_content_HTML.push(pwxdata.FUTUREOLIST[i].ORDER_CDL); //order clinical display line
				amb_future_content_HTML.push('</td>');
				amb_future_content_HTML.push('</tr>');
				amb_ftordder_checkbox_index = amb_ftordder_checkbox_index + 1
					//create object to hold values that we need when user click on RUN button ( For MOEW API)
					OrderValues.push({
						OrderId : pwxdata.FUTUREOLIST[i].ORDER_ID,
						PersonId : pwxdata.FUTUREOLIST[i].PERSON_ID,
						OrderComment: pwxdata.FUTUREOLIST[i].ORDER_COMMENT,
						PersonName : pwxdata.FUTUREOLIST[i].PERSON_NAME,
						OrderName : pwxdata.FUTUREOLIST[i].ORDERED_AS_NAME,
						OrderLastCnt : pwxdata.FUTUREOLIST[i].ORDER_UPDTCNT,
						OrderCommentType : pwxdata.FUTUREOLIST[i].ORDER_COMMENT_TYPE_CD,
					});
			}
		} else {
			amb_future_content_HTML.push('<tr class="amb_ftorder_orderdetailrow"><td class="amb_ftorder_error_msg">No Orders found.</td></tr>'); //if no order found.
		}

		amb_future_content_HTML.push('</tbody></table>');
		//table footer section
		amb_future_content_HTML.push('<div class="amb_ftorder_footer">');
		amb_future_content_HTML.push('<div class="amb_ftorder_footer_prev">');
		amb_future_content_HTML.push(amb_ftorder_pre_link); //previous page hyperlink
		amb_future_content_HTML.push('</div>');
		amb_future_content_HTML.push('<div class="amb_ftorder_footer_pagenumer">Page <input type="text" id="amb_ftorder_pnumer" value=' + current_pag_numeber + ' size="1"> of ' + amb_ftorder_total_pages + '</div>');
		amb_future_content_HTML.push('<div class="amb_ftorder_footer_next">');
		amb_future_content_HTML.push(amb_ftorder_next_link); //next page hyperlink
		amb_future_content_HTML.push('</div>');
		amb_future_content_HTML.push('</div>');
		//status area where it display current selection of order out of total order etc.
		amb_future_content_HTML.push('<div class="amb_ftorder_statuarea">');
		amb_future_content_HTML.push('<div class="amb_ftorder_selmsg">Displaying ' + amb_ftorder_index + '/' + pwxdata.FUTUREOLIST.length + ' results</div>');
		amb_future_content_HTML.push('<div class="amb_ftorder_runarea">');
		amb_future_content_HTML.push('<span class="amb_ftorder_totalsel"><span class="amb_ftorder_selected_order_class">' + amb_ftorder_selected_order + '</span>/' + amb_ftorder_index + ' selected</span>&nbsp;&nbsp;&nbsp;&nbsp;');
		amb_future_content_HTML.push('<span id="amb_ftorder_runbtn_id" class="amb_ftorder_runbtn"><button id="amb_ftorder_run_btn_id" class="amb_ftorder_run_btn" type="button">Run</button></span>');
		amb_future_content_HTML.push('</div><div class="temphtml"><div>');
		amb_future_content_HTML.push('</div>');
		amb_future_content_HTML_area.innerHTML = amb_future_content_HTML.join(""); //put table content into DOM
		createCheckpoint("ENG:MPG.AMBFUTUREORDERICD9CLEAN.O1 - render mPage", "Stop"); //stop render ENG timer
	} catch (e) {
		createCheckpoint("ENG:MPG.AMBFUTUREORDERICD9CLEAN.O1 - render mPage", "Stop"); //stop ENG timer if error found
	}
	//sorting logic when user click on particular column
	$('#amb_ftorder_pname_header_id').off('click');
	$('#amb_ftorder_pname_header_id').on('click', function (event) {
		amb_ftorder_sort(pwxdata, 'amb_ftorder_pname_header_id')
	});
	$('#amb_ftorder_ostartdate_header_id').off('click');
	$('#amb_ftorder_ostartdate_header_id').on('click', function (event) {
		amb_ftorder_sort(pwxdata, 'amb_ftorder_ostartdate_header_id')
	});
	$('#amb_ftorder_icd9_header_id').off('click');
	$('#amb_ftorder_icd9_header_id').on('click', function (event) {
		amb_ftorder_sort(pwxdata, 'amb_ftorder_icd9_header_id')
	});
	$('#amb_ftorder_oname_header_id').off('click');
	$('#amb_ftorder_oname_header_id').on('click', function (event) {
		amb_ftorder_sort(pwxdata, 'amb_ftorder_oname_header_id')
	});
	$('#amb_ftorder_otype_header_id').off('click');
	$('#amb_ftorder_otype_header_id').on('click', function (event) {
		amb_ftorder_sort(pwxdata, 'amb_ftorder_otype_header_id')
	});
	/* Sort Column (default - order date) */
	function amb_ftorder_sort(pwxObj, clicked_header_id) {
		if (clicked_header_id == amb_ftorder_header_id) {
			if (amb_ftorder_sort_ind == '0') {
				var sort_ind = '1'
			} else {
				var sort_ind = '0'
			}
			pwxObj.FUTUREOLIST.reverse()
			amb_ftorder_header_id = clicked_header_id
				amb_ftorder_sort_ind = sort_ind
				RenderFutureOrder(pwxObj, 0, amb_ftorder_ordercount_page);
		} else {
			switch (clicked_header_id) {
			case 'amb_ftorder_pname_header_id':
				pwxObj.FUTUREOLIST.sort(amb_sort_by_pname)
				amb_ftorder_header_id = clicked_header_id
					amb_ftorder_sort_ind = '0'
					RenderFutureOrder(pwxObj, 0, amb_ftorder_ordercount_page);
				break;
			case 'amb_ftorder_ostartdate_header_id':
				pwxObj.FUTUREOLIST.sort(amb_sort_by_ostartdate)
				amb_ftorder_header_id = clicked_header_id
					amb_ftorder_sort_ind = '0'
					RenderFutureOrder(pwxObj, 0, amb_ftorder_ordercount_page);
				break;
			case 'amb_ftorder_icd9_header_id':
				pwxObj.FUTUREOLIST.sort(amb_sort_by_icdname)
				amb_ftorder_header_id = clicked_header_id
					amb_ftorder_sort_ind = '0'
					RenderFutureOrder(pwxObj, 0, amb_ftorder_ordercount_page);
				break;
			case 'amb_ftorder_oname_header_id':
				pwxObj.FUTUREOLIST.sort(amb_sort_by_oname)
				amb_ftorder_header_id = clicked_header_id
					amb_ftorder_sort_ind = '0'
					RenderFutureOrder(pwxObj, 0, amb_ftorder_ordercount_page);
				break;
			case 'amb_ftorder_otype_header_id':
				pwxObj.FUTUREOLIST.sort(amb_sort_by_otype)
				amb_ftorder_header_id = clicked_header_id
					amb_ftorder_sort_ind = '0'
					RenderFutureOrder(pwxObj, 0, amb_ftorder_ordercount_page);
				break;
			}
		}
	}
	//calculate table height on scree load
	CalcuatetableHeight()
	$(window).off("resize"); //off resize event in case window don't use it.
	$(window).resize(function () {
		CalcuatetableHeight() // calculate table height on screen size change
	});
	function CalcuatetableHeight() {
		var height = $(window).height();
		var headerheight = $(".amb_ftorder_header_div").height(); //header height
		var tableheaderheight = $(".amb_ftorder_orderdetail_header").height(); // order table header height
		var footerheight = $(".amb_ftorder_footer").height(); //footer height
		var stateusheight = $(".amb_ftorder_statuarea").height(); //footer status height
		//add all static height to figure out table body height
		var totalheight1 = headerheight + tableheaderheight + footerheight + 40;
		// base on different screen we add and subtract certain number to make it work for all screen.
		if ($(window).width() >= 1500) {
			var actualtbodyheight = ((height - totalheight1) - 120) + "px"
			var actualtbodyheightcomp = ((height - totalheight1) - 120)
		} else if ($(window).width() >= 1300 && $(window).width() <= 1500) {
			var actualtbodyheight = ((height - totalheight1) - 100) + "px"
			var actualtbodyheightcomp = ((height - totalheight1) - 100)
		} else {
			var actualtbodyheight = ((height - totalheight1) - 80) + "px"
			var actualtbodyheightcomp = ((height - totalheight1) - 80)
		}
		//add final height to table body
		$("tbody#amb_ftorder_tbody_id").css('height', actualtbodyheight)
		var $allRows = $('table tbody#amb_ftorder_tbody_id tr');
		var $totalRowsHeight = 0;
		for (var i = 0; i < $allRows.length; i++) {
			$totalRowsHeight += $('table tbody#amb_ftorder_tbody_id tr:eq(' + i + ')').height() + 5;
		}
		//calculate do we need to add scrolling in table body or not
		if ($totalRowsHeight >= actualtbodyheightcomp) {
			$("tbody#amb_ftorder_tbody_id").css('overflow-y', 'auto') // add scroll
			$(".amb_ftorder_sdate").css('padding-left', '10px')
			$(".amb_ftorder_page_detail").css('padding-left', '4px')
			$(".amb_ftorder_odetail").css('padding-left', '13px')
			$(".amb_ftorder_icdcode").css('padding-left', '9px')
			$(".amb_ftorder_oname").css('padding-left', '11px')
			$(".amb_ftorder_otype").css('padding-left', '11px')
		} else {
			$("tbody#amb_ftorder_tbody_id").css('overflow-y', 'hidden') // hide scroll
			$(".amb_ftorder_sdate").css('padding-left', '7px')
			$(".amb_ftorder_page_detail").css('padding-left', '5px')
			$(".amb_ftorder_odetail").css('padding-left', '8px')
			$(".amb_ftorder_icdcode").css('padding-left', '5px')
			$(".amb_ftorder_oname").css('padding-left', '7.5px')
			$(".amb_ftorder_otype").css('padding-left', '8px')
		}
	}
	//when next hyperlink click
	$('#amb_ftorder_footer_nextid').off('click');
	$('#amb_ftorder_footer_nextid').on('click', function (event) {
		amb_ftorder_selected_order = 0
			amb_ftorder_start_index = ($('#amb_ftorder_pnumer').val()) * amb_ftorder_ordercount_page;
		amb_ftorder_end_index = amb_ftorder_start_index + amb_ftorder_ordercount_page;
		RenderFutureOrder(pwxdata, amb_ftorder_start_index, amb_ftorder_end_index)
	});
	//when previous hyperlink click
	$('#amb_ftorder_footer_previd').off('click');
	$('#amb_ftorder_footer_previd').on('click', function (event) {
		amb_ftorder_selected_order = 0
			amb_ftorder_start_index = (($('#amb_ftorder_pnumer').val() - 1) - 1) * amb_ftorder_ordercount_page;
		amb_ftorder_end_index = amb_ftorder_start_index + amb_ftorder_ordercount_page;
		RenderFutureOrder(pwxdata, amb_ftorder_start_index, amb_ftorder_end_index)
	});
	//when user enter specific page into box
	$('#amb_ftorder_pnumer').keypress(function (e) {
		amb_ftorder_selected_order = 0
			var key = e.which;
		if (key == 13) // the enter key code
		{
			amb_ftorder_start_index = ($('#amb_ftorder_pnumer').val() - 1) * amb_ftorder_ordercount_page;
			amb_ftorder_end_index = amb_ftorder_start_index + amb_ftorder_ordercount_page;
			if ((($('#amb_ftorder_pnumer').val()) <= amb_ftorder_total_pages) && $('#amb_ftorder_pnumer').val() >= 1) {
				RenderFutureOrder(pwxdata, amb_ftorder_start_index, amb_ftorder_end_index)
			} else {
				$('#amb_ftorder_pnumer').css("border-color", "red") //if page requested number is greater of total number of pages.
			}
		}
	});
	/* select all order on particular page */
	$("#amb_ftorder_allselection_id").change(function () {
		$('input.amb_ftorder_selection_class:checkbox').prop('checked', this.checked);
		amb_ftorder_selected_order = $('tbody.amb_ftorder_tbody').find('input.amb_ftorder_selection_class[type="checkbox"]:checked').length;
		$(".amb_ftorder_selected_order_class").text(amb_ftorder_selected_order)
		if (amb_ftorder_selected_order === 0) {
			$('#amb_ftorder_run_btn_id').prop('disabled', true);
		} else {
			$('#amb_ftorder_run_btn_id').prop('disabled', false);
		}
	});
	/* when order select one by one on particular page */
	$(".amb_ftorder_selection_class").change(function () {
		amb_ftorder_selected_order = $('tbody.amb_ftorder_tbody').find('input.amb_ftorder_selection_class[type="checkbox"]:checked').length;
		$(".amb_ftorder_selected_order_class").text(amb_ftorder_selected_order)
		if (amb_ftorder_selected_order === 0) {
			$('#amb_ftorder_run_btn_id').prop('disabled', true);
		} else {
			$('#amb_ftorder_run_btn_id').prop('disabled', false);
		}
	});
	//default turn off the run button (No checkbox selected)
	$('#amb_ftorder_run_btn_id').prop('disabled', true);
	//check for modify privilage
	if (order_modify_priv === 0) {
		$('#amb_ftorder_run_btn_id').prop('disabled', true);
		$('#amb_ftorder_run_btn_id').attr('title', 'You don’t have privilege to modify order.')
	}
	//kick off modify process
	$('#amb_ftorder_runbtn_id').off('click');
	$('#amb_ftorder_runbtn_id').on('click', function (event) {
		var arr = [];
		var failedorder = [];
		var count_order_selection = 0;
		//push all order selected in array for particular page
		$('tbody.amb_ftorder_tbody').find('input.amb_ftorder_selection_class[type="checkbox"]:checked').each(function () {
			arr.push($(this).val());
		});
		//iterate through array
		for (j = 0; j < arr.length; j++) {
			var best_enc_found_global = 0.0
				count_order_selection = count_order_selection + 1
				var amb_ftorder_getencounter_param = [];
			//check if best encounter already in global variable
			if (encounterperson.length > 0) {
				for (var i = 0; i < encounterperson.length; i++) {
					if (encounterperson[i].indexOf(OrderValues[arr[j]].PersonId) >= 0) {
						best_enc_found_global = encounterperson[i][1];
					}
				}
			}
			if (best_enc_found_global === 0.0) {
				amb_ftorder_getencounter_param = ["^MINE^", OrderValues[arr[j]].PersonId + ".0"];
				//call cerner standard script to get best encounter
				Amb_Get_Best_Encounter("AMB_MP_FORDER_GET_BESTENC_LIST", amb_ftorder_getencounter_param, false, function () {
					n = encounterperson.length
						encounterperson[n] = new Array(2);
					encounterperson[n][0] = this.PERSON_ID
						encounterperson[n][1] = this.ENCOUNTER_ID //store in global array so next time on different page or same page if we have same person id we don't need to call CCL
						var fwObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
						var PPRRelcode = fwObj.EstablishRelationship(this.PERSON_ID + ".0", this.ENCOUNTER_ID+ ".0", 0)
						if(PPRRelcode > 0){
						  //call MOEW API to update comment
						  FutureOrderModifyAction(this.PERSON_ID, this.ENCOUNTER_ID, OrderValues[arr[j]].OrderId, OrderValues[arr[j]].OrderLastCnt, OrderValues[arr[j]].OrderCommentType, OrderValues[arr[j]].PersonName, OrderValues[arr[j]].OrderName,OrderValues[arr[j]].OrderComment,failedorder)
						  //Upon iteration of last order refresh page with current selected filter
						  if (count_order_selection === arr.length) {
						  	if (failedorder.length > 0) {
						  		FailedOrderDisplay(failedorder)
						  	} else {
						  		var amb_ftorder_start_date1 = $("#amb_ftorder_sdcal").val();
						  		var amb_ftorder_end_date1 = $("#amb_ftorder_edcal").val();
						  		amb_ftorder_cclcall_param1 = ["^MINE^", provider_id_global + ".0", provider_id_positioncd + ".0", "^" + amb_ftorder_start_date1 + "^", "^" + amb_ftorder_end_date1 + "^", CreateParamArray(amb_ftorder_selected_loc_cd, 1), CreateParamArray(amb_ftorder_selected_prov_id, 1), amb_ftorder_search_perrsonid + ".0", amb_error_order_ind];
						  		$('#amb_ftorder_tbody_id').empty();
						  		amb_ftorder_header_id = "amb_ftorder_ostartdate_header_id";
						  		amb_ftorder_sort_ind = "0";
						  		$('#amb_ftorder_tbody_id').html('<div id="amb_ftorder_loading_div"><span class="amb_ftorder_loading-spinner"></span><br/></div>');
						  		AmbGetOrderList(amb_ftorder_cclcall_param1, 0)
						  	}
						  }
						}
				});
			} else {
				var fwObj1 = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
				var PPRRelcode1 = fwObj1.EstablishRelationship(OrderValues[arr[j]].PersonId + ".0", best_enc_found_global + ".0", 0)
				if (PPRRelcode1 > 0) {
				   //call MOEW API to update comment
				   FutureOrderModifyAction(OrderValues[arr[j]].PersonId, best_enc_found_global, OrderValues[arr[j]].OrderId, OrderValues[arr[j]].OrderLastCnt, OrderValues[arr[j]].OrderCommentType, OrderValues[arr[j]].PersonName, OrderValues[arr[j]].OrderName,OrderValues[arr[j]].OrderComment,failedorder)
				   //Upon iteration of last order refresh page with current selected filter
				   if (count_order_selection === arr.length) {
				   	if (failedorder.length > 0) {
				   		FailedOrderDisplay(failedorder)
				   	} else {
				   		var amb_ftorder_start_date2 = $("#amb_ftorder_sdcal").val();
				   		var amb_ftorder_end_date2 = $("#amb_ftorder_edcal").val();
				   		amb_ftorder_cclcall_param2 = ["^MINE^", provider_id_global + ".0", provider_id_positioncd + ".0", "^" + amb_ftorder_start_date2 + "^", "^" + amb_ftorder_end_date2 + "^", CreateParamArray(amb_ftorder_selected_loc_cd, 1), CreateParamArray(amb_ftorder_selected_prov_id, 1), amb_ftorder_search_perrsonid + ".0", amb_error_order_ind];
				   		$('#amb_ftorder_tbody_id').empty();
				   		amb_ftorder_header_id = "amb_ftorder_ostartdate_header_id";
				   		amb_ftorder_sort_ind = "0";
				   		$('#amb_ftorder_tbody_id').html('<div id="amb_ftorder_loading_div"><span class="amb_ftorder_loading-spinner"></span><br/></div>');
				   		AmbGetOrderList(amb_ftorder_cclcall_param2, 0)
				   	}
				   }
				}
			}
		}
	});
}

/*
 * @function to Handle for modify order to convert ICD-9 to ICD-10
 * @param {int} m_dPersonId : The m_dPersonId integer contain Person Id.
 * @param {int} m_dEncounterId : The m_dEncounterId integer contain Encounter Id.
 * @param {int} OrderId : The OrderId integer contain Order Id.
 * @param {int} OrderLastCnt : The OrderLastCnt integer contain last updated count number.
 * @param {int} OrderCommentType : The OrderCommentType integer contain OrderCommentType code value.
 * @param {string} Personname : The Personname string contain Person name.
 * @param {string} Ordername : The Ordername string contain Order name.
  * @param {string} OrderComment : The OrderComment string contain Order Comment.
 * @param {Array} failedorder : The failedorder Array will hold all failed order information.
 */
function FutureOrderModifyAction(m_dPersonId, m_dEncounterId, OrderId, OrderLastCnt, OrderCommentType, Personname, Ordername,OrderComment, failedorder) {
	//create MOEW
	var m_hMOEW = 0
		var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS")
		var m_orderdetails = "<?xml version=\"1.0\" ?><?xml-stylesheet type='text/xml' href='dom.xsl'?>" +
		"<Orders><OrderVersion>1</OrderVersion>" +
		"<Order id='" + OrderId + "'>" +
		"<OrderId>" + OrderId + "</OrderId>" +
		"<LastUpdtCnt>" + OrderLastCnt + "</LastUpdtCnt>" +
		"<CommentList>" +
		"<CommentValues>" +
		"<CommentType>" + OrderCommentType + "</CommentType>" +
		"<CommentText>"+OrderComment+" ICD10 Update Remediation</CommentText>" +
		"</CommentValues>" +
		"</CommentList>" +
		"</Order></Orders>";
	m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(m_dPersonId, m_dEncounterId, 24, 2, 127) //create MOEW
	var retVal = PowerOrdersMPageUtils.InvokeModifyActionMOEW(m_hMOEW, m_orderdetails); //invoke modify action
	if (retVal === 0) { //if API fail to process then store all information in array and display on modal
		len = failedorder.length
			failedorder[len] = new Array(4);
		failedorder[len][0] = Personname
			failedorder[len][1] = Ordername
			failedorder[len][2] = m_dPersonId
			failedorder[len][3] = m_dEncounterId
	}
	PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW); //destory when it is no longer in use */
}

/*
 * @function to Handle for Failed Order to display on modal
 * @param {Array} failedorder : The failedorder Array will hold all failed order information.
 */
function FailedOrderDisplay(failedorder) {
	var failedOrderdisplay = [];
	var amb_ftorder_start_date3 = $("#amb_ftorder_sdcal").val();
	var amb_ftorder_end_date3 = $("#amb_ftorder_edcal").val();
	var amb_ftorder_cclcall_param3 = ["^MINE^", provider_id_global + ".0", provider_id_positioncd + ".0", "^" + amb_ftorder_start_date3 + "^", "^" + amb_ftorder_end_date3 + "^", CreateParamArray(amb_ftorder_selected_loc_cd, 1), CreateParamArray(amb_ftorder_selected_prov_id, 1), amb_ftorder_search_perrsonid + ".0", amb_error_order_ind];

	failedOrderdisplay.push('<div style="padding-top:10px;"><p class="pwx_small_text">The below orders failed to process:</p>');
	failedOrderdisplay.push('<dl class="amb_ftorder_failmsg"><dt class="amb_ftorder_failheadername"><span>Person Name</span></dt><dt class="amb_ftorder_failheadername"><span>Order Name</span></dt></dl>',
		'</dl>');
	for (var i = 0; i < failedorder.length; i++) {
		var noencounter = "";
		//if API failed because of No encounter
		if (failedorder[i][3] === 0) {
			noencounter = " (No Encounter Found)";
		}
		failedOrderdisplay.push('<dl class="amb_ftorder_failvaluedl"><dt class="amb_ftorder_failheadername">',
			'<a title="Open Patient Chart" href="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + failedorder[i][2] + '\')" class="amb_ftorder_failpersoname_link">' + failedorder[i][0] + '</a>',
			'' + noencounter + '</dt><dt class="amb_ftorder_failheadername"><span>' + failedorder[i][1] + '</span></dt></dl>',
			'</dl>');
	}
	failedOrderdisplay.push('<p class="pwx_small_text amb_ftorder_failerrormsg">Unable to specify an ICD10 diagnosis for the selected order(s). Please open the patient’s chart to modify the associated diagnoses before the order’s scheduled date.</p><div>');
	MP_ModalDialog.deleteModalDialogObject("failedordermodal")
	var failedModalobj = new ModalDialog("failedordermodal")
		.setHeaderTitle('<span class="pwx_alert">Failed Order List</span>')
		.setTopMarginPercentage(12)
		.setRightMarginPercentage(25)
		.setBottomMarginPercentage(12)
		.setLeftMarginPercentage(25)
		.setIsBodySizeFixed(true)
		.setHasGrayBackground(true)
		.setIsFooterAlwaysShown(true);
	failedModalobj.setBodyDataFunction(
		function (modalObj) {
		modalObj.setBodyHTML(failedOrderdisplay.join(""));
	});
	var okbtn = new ModalButton("failedordermodal");
	okbtn.setText("OK").setCloseOnClick(true).setOnClickFunction(function () {
		$('#amb_ftorder_tbody_id').empty();
		amb_ftorder_header_id = "amb_ftorder_ostartdate_header_id";
		amb_ftorder_sort_ind = "0";
		$('#amb_ftorder_tbody_id').html('<div id="amb_ftorder_loading_div"><span class="amb_ftorder_loading-spinner"></span><br/></div>');
		AmbGetOrderList(amb_ftorder_cclcall_param3, 0); //refresh page on closing the modal
	}); ;
	failedModalobj.addFooterButton(okbtn)
	MP_ModalDialog.addModalDialogObject(failedModalobj);
	MP_ModalDialog.showModalDialog("failedordermodal")
	$('.dyn-modal-hdr-close').click(function () {
		$('#amb_ftorder_tbody_id').empty();
		amb_ftorder_header_id = "amb_ftorder_ostartdate_header_id";
		amb_ftorder_sort_ind = "0";
		$('#amb_ftorder_tbody_id').html('<div id="amb_ftorder_loading_div"><span class="amb_ftorder_loading-spinner"></span><br/></div>');
		AmbGetOrderList(amb_ftorder_cclcall_param3, 0) //refresh page on closing the modal
	});
}
/*
 * @function to create location modal
 * @param {Object} js_criterion : The js_criterion Object contain all JSON for Location stored prefrence.
 */
function RenderFutureOrderLocationModal(js_criterion) {
	/* modal html */
	var selected_lst_cnt = 0;
	var amb_ftorder_prov_save = [];
	amb_ftorder_selected_loc_list_hover = [];
	amb_ftorder_selected_loc_cd = [];
	amb_ftorder_prov_save.push('<div class="amb_ftorder_loc_list_main">');
	amb_ftorder_prov_save.push('<dl class="amb_ftorder_loc_modal_title">Facility Search</dl>',
		'<dl class="amb_ftorder_loc_sbox">',
		'<input type="text" title="Facility Search" class="amb_ftorder_search_loc_txt_class amb_ftorder_search_loc_defaultText" id="amb_ftorder_search_loc_txt"/></dl>',
		'<div class="amb_ftorder_loc_avail_div">',
		'<dl class="amb_ftorder_loc_availlbl">Available Facilities</dl>',
		'<dl id="amb_ftorder_aloc"><select style="font-size:13px" size="6" id="amb_ftorder_loc_from_select" class="amb-ftorder-loc-list-box" multiple>');
	for (var i = 0; i < js_criterion.CRITERION.BUILD_LOCS.length; i++) {
		// Avialable location to save
		if (js_criterion.CRITERION.BUILD_LOCS[i].SELECTED === 0) {
			amb_ftorder_prov_save.push('<option style="font-weight:bold" value="' + js_criterion.CRITERION.BUILD_LOCS[i].BUILD_LOC_CD + '">' + js_criterion.CRITERION.BUILD_LOCS[i].DISPLAY + '</option>')
		}
	};
	amb_ftorder_prov_save.push('</select>',
		'</dl>',
		'<a id="amb_ftorder_select_avial_all" style="font-size:14px;" class="amb_ftorder_footer_prevclass">Select all</a>',
		'<a id="amb_ftorder_select_avial_all_hide" style="font-size:14px;display:none" class="amb_ftorder_footer_prevhide">Select all</a>',
		'</div>',
		'<div class="amb_ftorder_loc_save_moveall">',
		'<dl style="padding-left:20%;"><button id="amb_ftorder_fav_move_fromto" title="Move Facility to right" class="amb_ftorder_loc_fav_button" type="button">Add ></button></dl>',
		'<dl style="padding-left:20%;"><button id="amb_ftorder_loc_move_tofrom" title="Move Facilty to left" class="pwx_summ_remove_visit_prov_fav_button" type="button">< Remove</button></dl>',
		'</div>',
		'<div class="amb_ftorder_loc_selected_div">',
		'<dl class="amb_ftorder_loc_availlbl">Selected Facilities</dl>',
		'<dl class="amb_ftorder_selected_loc_display"><select  style="font-size:13px" size="6" id="amb_ftorder_loc_to_select" class="amb-ftorder-loc-list-box" multiple>');
	for (var i = 0; i < js_criterion.CRITERION.BUILD_LOCS.length; i++) {
		//saved location
		if (js_criterion.CRITERION.BUILD_LOCS[i].SELECTED === 1) {
			selected_lst_cnt = selected_lst_cnt + 1;
			amb_ftorder_selected_loc_list_hover.push(js_criterion.CRITERION.BUILD_LOCS[i].DISPLAY)
			amb_ftorder_selected_loc_cd.push(js_criterion.CRITERION.BUILD_LOCS[i].BUILD_LOC_CD)
			amb_ftorder_prov_save.push('<option value="' + js_criterion.CRITERION.BUILD_LOCS[i].BUILD_LOC_CD + '">' + js_criterion.CRITERION.BUILD_LOCS[i].DISPLAY + '</option>')
		}
	};
	amb_ftorder_prov_save.push('</select></dl><a id="amb_ftorder_selected_all" style="font-size:14px;" class="amb_ftorder_footer_prevclass">Select all</a>',
		'<a id="amb_ftorder_selected_all_hide" style="font-size:14px;display:none" class="amb_ftorder_footer_prevhide">Select all</a>',
		'</div></div>');

	var amb_ftorder_loc_found_pref = js_criterion.CRITERION.FTORDERLOC_PREF_FOUND_RS
		//manage fav model section here
		$('#amb_ftorder_locmodal').off('click')
		$('#amb_ftorder_locmodal').on('click', function () {
			var amb_ftorder_loc_fav_check = "";
			MP_ModalDialog.deleteModalDialogObject("SaveFavlocModal")
			var savefavlocmodal = new ModalDialog("SaveFavlocModal")
				.setHeaderTitle('Provider Facilities')
				.setTopMarginPercentage(8)
				.setRightMarginPercentage(17)
				.setBottomMarginPercentage(10)
				.setLeftMarginPercentage(15)
				.setIsBodySizeFixed(true)
				.setHasGrayBackground(true)
				.setIsFooterAlwaysShown(true);
			savefavlocmodal.setBodyDataFunction(
				function (modalObj) {
				if (amb_ftorder_loc_lt_query_ind === 1) {
					var amb_ftorder_loc_html_save_array = [];
					amb_ftorder_loc_html_save_array.push('<div class="amb_ftorder_loc_list_main">' + amb_ftorder_loc_html_save + '</div>');
					modalObj.setBodyHTML(amb_ftorder_loc_html_save_array.join(""));
				} else {
					modalObj.setBodyHTML(amb_ftorder_prov_save.join(""));
				}
				var selectvalue1 = $('#amb_ftorder_loc_to_select option');
				amb_ftorder_loc_fav_check = $.map(selectvalue1, function (elt, i) {
						return $(elt).val() + '.00';
					});
				beforeselect = JSON.stringify(amb_ftorder_loc_fav_check);
				if (amb_ftorder_modal_open_count === 0 && $('#amb_ftorder_loc_to_select option').length !== 0) {
					var selectedlist1 = 'amb_ftorder_loc_to_select';
					var availablelist1 = 'amb_ftorder_loc_from_select';
					$('#' + selectedlist1 + ' option').each(function (i, e) {
						$('#' + availablelist1).append('<option value="' + $(this).val() + '" disabled="disabled">' + $(this).text() + '</option>');
						//Convert the list options to a javascript array and sort(ascending)
						var sortedList = $.makeArray($("#" + availablelist1 + " option"))
							.sort(function (a, b) {
								return $(a).text() < $(b).text() ? -1 : 1;
							});
						//Clear the options and add the sorted ones
						$("#" + availablelist1).empty().html(sortedList);
					})
				}
				$('select#amb_ftorder_loc_from_select').filterByText($('#amb_ftorder_search_loc_txt'), true);
				amb_ftorder_modal_open_count = amb_ftorder_modal_open_count + 1;
				//call function to handle all modal functionality (move left to right, right to left. select all etc)
				AmbMultipleListSaveEvents("amb_ftorder_loc_from_select", "amb_ftorder_loc_to_select", 'amb_ftorder_fav_move_fromto', 'amb_ftorder_loc_move_tofrom', 'amb_ftorder_select_avial_all', 'amb_ftorder_selected_all', 'amb_ftorder_select_avial_all_hide', 'amb_ftorder_selected_all_hide', 'amb_ftorder_search_loc_txt')
			});
			var closebtn = new ModalButton("addCancel");
			closebtn.setText("Cancel").setCloseOnClick(true).setOnClickFunction(function () {
				amb_ftorder_modal_open_count = 0
			}); ;
			var savebtn = new ModalButton("savelocation");
			savebtn.setText("Save").setCloseOnClick(false).setOnClickFunction(function () {
				if($('#amb_ftorder_search_loc_txt').val() !== "Facility Search"){
			       ambclearfackeyeventind = 1;		      
			       $('#amb_ftorder_search_loc_txt').trigger("keyup");
			    }
				var selectvalue = $('#amb_ftorder_loc_to_select option');
				var amb_ftorder_selected_loc_getselected = "";
				var amb_ftorder_selected_loc_array = [];
				var amb_ftorder_selected_loccd_array = [];
				if (selectvalue.length !== 0) {
					var amb_ftorder_loc_fav = $.map(selectvalue, function (elt, i) {
							return $(elt).val() + '.00';
						});
					afterselect = JSON.stringify(amb_ftorder_loc_fav)
						amb_ftorder_selected_loc_getselected = document.getElementById("amb_ftorder_loc_to_select");
					amb_ftorder_selected_loc_array = [];
					amb_ftorder_selected_loccd_array = [];
					for (var i = 0; i < amb_ftorder_selected_loc_getselected.length; i++) {
						amb_ftorder_selected_loc_array.push(amb_ftorder_selected_loc_getselected[i].text);
						amb_ftorder_selected_loccd_array.push(amb_ftorder_selected_loc_getselected[i].value)
					}
					//if new selection prefrence is different than stored prefrence then only call else close the dialog
					if (afterselect != beforeselect) {
						PWX_SUMM_CCL_Request_LOCMODAL_User_Pref('mp_maintain_user_prefs', js_criterion.CRITERION.PRSNL_ID, "AMB_FTORDER_LOCATION_FAV", amb_ftorder_loc_fav, true, MP_ModalDialog, amb_ftorder_selected_loc_array, amb_ftorder_selected_loccd_array)
					} else {
						MP_ModalDialog.closeModalDialog("SaveFavlocModal")
					}
				} else {
					PWX_SUMM_CCL_Request_LOCMODAL_User_Pref('mp_maintain_user_prefs', js_criterion.CRITERION.PRSNL_ID, "AMB_FTORDER_LOCATION_FAV", "", true, MP_ModalDialog, amb_ftorder_selected_loc_array, amb_ftorder_selected_loccd_array)
				}
			});
			savefavlocmodal.addFooterButton(savebtn)
			savefavlocmodal.addFooterButton(closebtn)
			MP_ModalDialog.addModalDialogObject(savefavlocmodal);
			MP_ModalDialog.showModalDialog("SaveFavlocModal")

			$('.dyn-modal-hdr-close').click(function () {
				amb_ftorder_modal_open_count = 0
			});
			//default text on search textbox on modal
			$(".amb_ftorder_search_loc_defaultText").focus(function (srcc) {
				if ($(this).val() == $(this)[0].title) {
					$(this).removeClass("amb_ftorder_search_loc_defaultTextActive");
					$(this).val("");
				}
			});
			$(".amb_ftorder_search_loc_defaultText").blur(function () {
				if ($(this).val() == "") {
					$(this).addClass("amb_ftorder_search_loc_defaultTextActive");
					$(this).val($(this)[0].title);
				}
			});
			$(".amb_ftorder_search_loc_defaultText").blur();
		});
	//if no selected location then update with below message.
	if (selected_lst_cnt === 0) {
		$("#amb_ftorder_locmodal").text("None Selected")
	} else {
		$("#amb_ftorder_locmodal").text('(' + selected_lst_cnt + ') Selected')
	}
}

/*
 * @function to create Provider modal
 * @param {Object} provfavrec : The provfavrec Object contain all JSON for Provider stored prefrence.
 */
function RenderFutureOrderProvModal(provfavrec) {
	/* Order Provider modal html */
	var selected_prov_lst_cnt = 0;
	var selected_prov_avail_cnt = 0;
	var amb_ftorder_prov_save = [];
	amb_ftorder_selected_prov_list_hover = [];
	amb_ftorder_selected_prov_id = [];
	amb_ftorder_prov_save.push('<div class="amb_ftorder_prov_list_main">');
	amb_ftorder_prov_save.push('<dl class="amb_ftorder_prov_modal_title">Provider Search</dl>',
		'<dl class="amb_ftorder_prov_sbox">',
		'<input type="text" title="Provider Search" class="amb_ftorder_search_prov_txt_class amb_ftorder_search_prov_defaultText" id="amb_ftorder_search_prov_txt"/></dl>',
		'<div class="amb_ftorder_prov_avail_div">',
		'<dl class="amb_ftorder_prov_availlbl">Available Providers</dl>',
		'<dl id="amb_ftorder_aprov"><select style="font-size:13px" size="6" id="amb_ftorder_prov_from_select" class="amb-ftorder-prov-list-box" multiple>');
	for (var i = 0; i < provfavrec.BUILD_PROVLIST.length; i++) {
		if (provfavrec.BUILD_PROVLIST[i].SELECTED === 0) {
			selected_prov_avail_cnt = selected_prov_avail_cnt + 1
				amb_ftorder_prov_save.push('<option value="' + provfavrec.BUILD_PROVLIST[i].ORDER_PROVIDER_ID + '">' + provfavrec.BUILD_PROVLIST[i].ORDER_PROVIDER_NAME + '</option>')
		}
	};
	amb_ftorder_prov_save.push('</select>',
		'</dl>',
		'<a id="amb_ftorder_select_prov_avial_all" style="font-size:14px;" class="amb_ftorder_footer_prevclass">Select all</a>',
		'<a id="amb_ftorder_select_prov_avial_all_hide" style="font-size:14px;display:none" class="amb_ftorder_footer_prevhide">Select all</a>',
		'</div>',
		'<div class="amb_ftorder_prov_save_moveall">',
		'<dl style="padding-left:20%;"><button id="amb_ftorder_fav_prov_move_fromto" title="Move Provider to right" class="amb_ftorder_prov_fav_button" type="button">Add ></button></dl>',
		'<dl style="padding-left:20%;"><button id="amb_ftorder_prov_move_tofrom" title="Move Provider to left" class="amb_ftorder_remove_prov_fav_button" type="button">< Remove</button></dl>',
		'</div>',
		'<div class="amb_ftorder_prov_selected_div">',
		'<dl class="amb_ftorder_prov_availlbl">Selected Providers</dl>',
		'<dl><select  style="font-size:13px" size="6" id="amb_ftorder_prov_to_select" class="amb-ftorder-prov-list-box" multiple>');
	for (var i = 0; i < provfavrec.BUILD_PROVLIST.length; i++) {
		if (provfavrec.BUILD_PROVLIST[i].SELECTED === 1) {
			selected_prov_lst_cnt = selected_prov_lst_cnt + 1;
			amb_ftorder_selected_prov_list_hover.push(provfavrec.BUILD_PROVLIST[i].ORDER_PROVIDER_NAME)
			amb_ftorder_selected_prov_id.push(provfavrec.BUILD_PROVLIST[i].ORDER_PROVIDER_ID)
			amb_ftorder_prov_save.push('<option value="' + provfavrec.BUILD_PROVLIST[i].ORDER_PROVIDER_ID + '">' + provfavrec.BUILD_PROVLIST[i].ORDER_PROVIDER_NAME + '</option>')
		}
	};
	amb_ftorder_prov_save.push('</select></dl><a id="amb_ftorder_provselected_all" style="font-size:14px;" class="amb_ftorder_footer_prevclass">Select all</a>',
		'<a id="amb_ftorder_provselected_all_hide" style="font-size:14px;display:none" class="amb_ftorder_footer_prevhide">Select all</a>',
		'</div></div>');

	var amb_ftorder_prov_save_found = provfavrec.FTORDERPROV_PREF_FOUND_RS
		//manage fav model section here
		$('#amb_ftorder_promodal').off('click')
		$('#amb_ftorder_promodal').on('click', function () {
			var amb_ftorder_prov_fav_value = "";
			MP_ModalDialog.deleteModalDialogObject("FtorderProvFav")
			var FtorderProvFavmodal = new ModalDialog("FtorderProvFav")
				.setHeaderTitle('Ordering Providers')
				.setTopMarginPercentage(8) //10
				.setRightMarginPercentage(17)
				.setBottomMarginPercentage(10) //13
				.setLeftMarginPercentage(15)
				.setIsBodySizeFixed(true)
				.setHasGrayBackground(true)
				.setIsFooterAlwaysShown(true);
			FtorderProvFavmodal.setBodyDataFunction(
				function (modalObj) {
				if (amb_ftorder_prov_lt_query_ind === 1) {
					var amb_ftorder_prov_html_save_array = [];
					amb_ftorder_prov_html_save_array.push('<div class="amb_ftorder_prov_list_main">' + amb_ftorder_prov_html_save + '</div>');
					modalObj.setBodyHTML(amb_ftorder_prov_html_save_array.join(""));
				} else {
					modalObj.setBodyHTML(amb_ftorder_prov_save.join(""));
				}
				var selectvalue1 = $('#amb_ftorder_prov_to_select option');
				amb_ftorder_prov_fav_value = $.map(selectvalue1, function (elt, i) {
						return $(elt).val() + '.00';
					});
				beforeselect = JSON.stringify(amb_ftorder_prov_fav_value);
				if (amb_ftorder_modal_prov_open_count === 0 && $('#amb_ftorder_prov_to_select option').length !== 0) {
					var selectedlistprov = 'amb_ftorder_prov_to_select';
					var availablelistprov = 'amb_ftorder_prov_from_select';
					$('#' + selectedlistprov + ' option').each(function (i, e) {
						$('#' + availablelistprov).append('<option value="' + $(this).val() + '" disabled>' + $(this).text() + '</option>');
						//Convert the list options to a javascript array and sort(ascending)
						var sortedList = $.makeArray($("#" + availablelistprov + " option"))
							.sort(function (a, b) {
								return $(a).text() < $(b).text() ? -1 : 1;
							});
						//Clear the options and add the sorted ones
						$("#" + availablelistprov).empty().html(sortedList);
					})
				}
				$('select#amb_ftorder_prov_from_select').filterByText($('#amb_ftorder_search_prov_txt'), true);
				amb_ftorder_modal_prov_open_count = amb_ftorder_modal_prov_open_count + 1;
				AmbMultipleListSaveEvents("amb_ftorder_prov_from_select", "amb_ftorder_prov_to_select", 'amb_ftorder_fav_prov_move_fromto', 'amb_ftorder_prov_move_tofrom', 'amb_ftorder_select_prov_avial_all', 'amb_ftorder_provselected_all', 'amb_ftorder_select_prov_avial_all_hide', 'amb_ftorder_provselected_all_hide', 'amb_ftorder_search_prov_txt')
			});
			var closebtn = new ModalButton("addCancel");
			closebtn.setText("Cancel").setCloseOnClick(true).setOnClickFunction(function () {
				amb_ftorder_modal_prov_open_count = 0;
			});
			var savebtn = new ModalButton("saveprovider");
			savebtn.setText("Save").setCloseOnClick(false).setOnClickFunction(function () {
				if($('#amb_ftorder_search_prov_txt').val() !== "Provider Search"){
			       ambclearprovkeyeventind = 1;		      
			       $('#amb_ftorder_search_prov_txt').trigger("keyup");
			    }
				var selectvalue = $('#amb_ftorder_prov_to_select option');
				var amb_ftorder_selected_prov_getselected = "";
				var amb_ftorder_selected_prov_array = [];
				var amb_ftorder_selected_provid_array = [];
				if (selectvalue.length !== 0) {
					var amb_ftorder_order_prov_fav = $.map(selectvalue, function (elt, i) {
							return $(elt).val() + '.00';
						});
					afterselect = JSON.stringify(amb_ftorder_order_prov_fav)
						amb_ftorder_selected_prov_getselected = document.getElementById("amb_ftorder_prov_to_select");
					amb_ftorder_selected_prov_array = [];
					amb_ftorder_selected_provid_array = [];
					for (var i = 0; i < amb_ftorder_selected_prov_getselected.length; i++) {
						amb_ftorder_selected_prov_array.push(amb_ftorder_selected_prov_getselected[i].text);
						amb_ftorder_selected_provid_array.push(amb_ftorder_selected_prov_getselected[i].value)
					}
					if (afterselect != beforeselect) {
						PWX_SUMM_CCL_Request_PROVMODAL_User_Pref('mp_maintain_user_prefs', provider_id_global, "AMB_FTORDER_PROV_FAV", amb_ftorder_order_prov_fav, true, MP_ModalDialog, amb_ftorder_selected_prov_array, amb_ftorder_selected_provid_array)
					} else {
						MP_ModalDialog.closeModalDialog("FtorderProvFav")
					}
				} else {
					PWX_SUMM_CCL_Request_PROVMODAL_User_Pref('mp_maintain_user_prefs', provider_id_global, "AMB_FTORDER_PROV_FAV", "", true, MP_ModalDialog, amb_ftorder_selected_prov_array, amb_ftorder_selected_provid_array)

				}
			});
			FtorderProvFavmodal.addFooterButton(savebtn)
			FtorderProvFavmodal.addFooterButton(closebtn)
			MP_ModalDialog.addModalDialogObject(FtorderProvFavmodal);
			MP_ModalDialog.showModalDialog("FtorderProvFav")
			$('.dyn-modal-hdr-close').click(function () {
				amb_ftorder_modal_prov_open_count = 0;
			});
			$(".amb_ftorder_search_prov_defaultText").focus(function (srcc) {
				if ($(this).val() == $(this)[0].title) {
					$(this).removeClass("amb_ftorder_search_loc_defaultTextActive");
					$(this).val("");
				}
			});
			$(".amb_ftorder_search_prov_defaultText").blur(function () {
				if ($(this).val() == "") {
					$(this).addClass("amb_ftorder_search_loc_defaultTextActive");
					$(this).val($(this)[0].title);
				}
			});
			$(".amb_ftorder_search_prov_defaultText").blur();
		});
	if (selected_prov_lst_cnt === 0) {
		$("#amb_ftorder_promodal").text("None Selected")
	} else {
		$("#amb_ftorder_promodal").text('(' + selected_prov_lst_cnt + ') Selected')
	}
	//on load display hover
	AmbFutureOrderHover();
}

/*
 * @function to create Hover on location and provider selection area
 */
function AmbFutureOrderHover() {
	//location hover details
	if (amb_ftorder_selected_loc_list_hover.length > 0) {
		var elementMap = {};
		// remove event if there is any
		$('#amb_ftorder_locmodal').off("mouseenter");
		$('#amb_ftorder_locmodal').off("mouseleave");
		// attach event
		$('#amb_ftorder_locmodal').on("mouseenter", function (event) {
			var anchor = this;
			var anchorId = $(this).attr("id");
			//If there is a hover class specified, add it to the element
			$(this).addClass("mpage-tooltip-hover");
			if (!elementMap[anchorId]) {
				elementMap[anchorId] = {};
			}
			//Store of a flag that we're hovered inside this element
			elementMap[anchorId].TIMEOUT = setTimeout(function () {
					showlocationhover(event, anchor);
				}, 500);
		});
		$('#amb_ftorder_locmodal').on("mouseleave", function (event) {
			$(this).removeClass("mpage-tooltip-hover");
			clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
		});
		function showlocationhover(event, anchor) {
			var locationhvr = [];
			locationhvr.push('<dl class="amb_ftorder_hvrtitle">Selected Facilities</dl>');
			for (var i = 0; i < amb_ftorder_selected_loc_list_hover.length; i++) {
				locationhvr.push('<dl class="amb_ftorder_hvrrow">',
					'<dd><span>' + amb_ftorder_selected_loc_list_hover[i] + '</span></dd></dl>');
			}
			var locationhvrtooltip = new MPageTooltip();
			locationhvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(locationhvr.join(""));
			locationhvrtooltip.show();
		}
	}
	/* Provider Hover */
	if (amb_ftorder_selected_prov_list_hover.length > 0) {
		var elementMap = {};
		// remove event if there is any
		$('#amb_ftorder_promodal').off("mouseenter");
		$('#amb_ftorder_promodal').off("mouseleave");
		// attach event
		$('#amb_ftorder_promodal').on("mouseenter", function (event) {
			var anchor = this;
			var anchorId = $(this).attr("id");
			//If there is a hover class specified, add it to the element
			$(this).addClass("mpage-tooltip-hover");
			if (!elementMap[anchorId]) {
				elementMap[anchorId] = {};
			}
			//Store of a flag that we're hovered inside this element
			elementMap[anchorId].TIMEOUT = setTimeout(function () {
					showproviderhover(event, anchor);
				}, 500);
		});
		$('#amb_ftorder_promodal').on("mouseleave", function (event) {
			$(this).removeClass("mpage-tooltip-hover");
			clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
		});
		function showproviderhover(event, anchor) {
			var Providerhvr = [];
			Providerhvr.push('<dl class="amb_ftorder_hvrtitle">Selected Providers</dl>');
			for (var i = 0; i < amb_ftorder_selected_prov_list_hover.length; i++) {
				Providerhvr.push('<dl class="amb_ftorder_hvrrow">',
					'<dd><span>' + amb_ftorder_selected_prov_list_hover[i] + '</span></dd></dl>');
			}
			var Providerhvrtooltip = new MPageTooltip();
			Providerhvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(Providerhvr.join(""));
			Providerhvrtooltip.show();
		}
	}

}

/*
 * @function to Handle for modify order
 * @param {String} availablelist : The availablelist string contain avialable list Id.
 * @param {String} selectedlist : The selectedlist string contain selected list Id.
 * @param {String} moveleftlist : The moveleftlist string contain id of the Add button Id
 * @param {String} moverightlist : The moverightlist string contain remove button Id
 * @param {String} selectallavail : The selectallavail string contain select all hyperlink Id for avialable list
 * @param {String} selectallselected : The selectallselected string contain select all hyperlink Id for selected list
 * @param {String} selectallavailhide : The selectallavailhide string contain select all hide hyperlink Id for avialable list
 * @param {String} selectallselectedhide : The selectallselectedhide string contain select all hide hyperlink Id for avialable list
 * @param {String} selectallselectedhide : The selectallavailhide string contain textbox Id where user can search through filter
 */
function AmbMultipleListSaveEvents(availablelist, selectedlist, moveleftlist, moverightlist, selectallavail, selectallselected, selectallavailhide, selectallselectedhide, searchtextbox) {
	$('#' + selectedlist + '').bind("DOMNodeInserted", function () {
		var a = $('#' + availablelist + ' option').length
			$('#' + moverightlist + '').prop('disabled', false);
		$('#' + selectallselected + '').show()
		$('#' + selectallselectedhide + '').hide()
		if ($('#' + availablelist + ' option').length === $('#' + selectedlist + ' option').length) {
			$('#' + moveleftlist + '').prop('disabled', true);
			$('#' + selectallavail + '').hide()
			$('#' + selectallavailhide + '').show()
		}
	});
	$('#' + availablelist + '').bind("DOMNodeInserted", function () {
		var b = $('#' + selectedlist + ' option').length
			$('#' + moveleftlist + '').prop('disabled', false);
		$('#' + selectallavail + '').show()
		$('#' + selectallavailhide + '').hide()
		if (b === 0) {
			$('#' + moverightlist + '').prop('disabled', true);
			$('#' + selectallselected + '').hide()
			$('#' + selectallselectedhide + '').show()
		}
	});
	$('#' + availablelist + '').bind("dblclick", function (e) {
		$('#' + availablelist + ' option:selected').clone().appendTo('#' + selectedlist);
		$('#' + availablelist + ' option:selected').prop('disabled', true)
		AmbSortingSingleItemList(selectedlist);
		e.preventDefault();
	});
	$('#' + selectedlist + '').bind("dblclick", function (e) {
		// make an array
		var selected_item_all = $('#' + selectedlist + ' option:selected').val()
			$('#' + availablelist + ' option').each(function (i, e) {
				var current_avail_list = $(this).val();
				if (selected_item_all === current_avail_list) {
					$(this).remove();
				}
			});
		$('#' + selectedlist + ' option:selected').remove().appendTo('#' + availablelist);
		AmbSortingSingleItemList(availablelist);
		e.preventDefault();
	});
	$('#' + moveleftlist + '').click(function () {
		$('#' + availablelist + ' option:selected').clone().appendTo('#' + selectedlist);
		$('#' + availablelist + ' option:selected').prop('disabled', true)
		AmbSortingAllItemList(selectedlist);
	});
	$('#' + moverightlist + '').click(function () {
		var selected_item_array = [];
		$('#' + selectedlist + '  option:selected').each(function () {
			selected_item_array.push($(this).val());
		});
		$('#' + availablelist + ' option').each(function (i, e) {
			var current_avail_list1 = $(this).val();
			if (jQuery.inArray(current_avail_list1, selected_item_array) != '-1') {
				$(this).remove();
			}
		});
		$('#' + selectedlist + ' option:selected').remove().appendTo('#' + availablelist);
		AmbSortingAllItemList(availablelist);
	});
	$('#' + selectallavail + '').click(function () {
		$('#' + availablelist + ' option').each(function (i, e) {
			if ($(this).is(":enabled")) {
				$(this).prop('selected', true);
			} else {
				$(this).prop('selected', false);
			}
		});
		AmbSortingSingleItemList(selectedlist);
	});
	$('#' + selectallselected + '').click(function () {
		$('#' + selectedlist + ' option').prop('selected', true);
		AmbSortingSingleItemList(availablelist);
	});
	function AmbSortingSingleItemList(anchor) {
		// Convert the list options to a javascript array and sort(ascending)
		var sortedList = $.makeArray($("#" + anchor + " option"))
			.sort(function (a, b) {
				return $(a).text() < $(b).text() ? -1 : 1;
			});
		//Clear the options and add the sorted ones
		$("#" + anchor).empty().html(sortedList);
		//$('select#' + availablelist + '').filterByText($("#" + searchtextbox), true);
	}
	function AmbSortingAllItemList(anchor) {
		//Convert the list options to a javascript array and sort(ascending)
		var sortedList = $.makeArray($("#" + anchor + " option"))
			.sort(function (a, b) {
				return $(a).text() < $(b).text() ? -1 : 1;
			});
		//Clear the options and add the sorted ones
		$("#" + anchor).empty().html(sortedList);
		//$('select#' + availablelist + '').filterByText($("#" + searchtextbox), true);
	}
}
