/*
 jQuery Text Overflow v0.7.4

 Licensed under the new BSD License.
 Copyright 2009-2011, Bram Stein
 All rights reserved.
*/
var JSON;
JSON || (JSON = {});
(function() {
    function b(a) {
        return 10 > a ? "0" + a : a
    }

    function g(b) {
        a.lastIndex = 0;
        return a.test(b) ? '"' + b.replace(a, function(a) {
            var b = e[a];
            return "string" === typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + b + '"'
    }

    function p(a, b) {
        var e, r, z, E, N = c,
            U, u = b[a];
        u && ("object" === typeof u && "function" === typeof u.toJSON) && (u = u.toJSON(a));
        "function" === typeof t && (u = t.call(b, a, u));
        switch (typeof u) {
            case "string":
                return g(u);
            case "number":
                return isFinite(u) ? String(u) : "null";
            case "boolean":
            case "null":
                return String(u);
            case "object":
                if (!u) return "null";
                c += o;
                U = [];
                if ("[object Array]" === Object.prototype.toString.apply(u)) {
                    E = u.length;
                    for (e = 0; e < E; e += 1) U[e] = p(e, u) || "null";
                    z = 0 === U.length ? "[]" : c ? "[\n" + c + U.join(",\n" + c) + "\n" + N + "]" : "[" + U.join(",") + "]";
                    c = N;
                    return z
                }
                if (t && "object" === typeof t) {
                    E = t.length;
                    for (e = 0; e < E; e += 1) "string" === typeof t[e] && (r = t[e], (z = p(r, u)) && U.push(g(r) + (c ? ": " : ":") + z))
                } else
                    for (r in u) Object.prototype.hasOwnProperty.call(u, r) && (z = p(r, u)) && U.push(g(r) + (c ? ": " : ":") + z);
                z = 0 === U.length ? "{}" : c ? "{\n" + c + U.join(",\n" + c) + "\n" + N + "}" : "{" + U.join(",") +
                    "}";
                c = N;
                return z
        }
    }
    "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + b(this.getUTCMonth() + 1) + "-" + b(this.getUTCDate()) + "T" + b(this.getUTCHours()) + ":" + b(this.getUTCMinutes()) + ":" + b(this.getUTCSeconds()) + "Z" : null
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
        return this.valueOf()
    });
    var r = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        a = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        c, o, e = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        t;
    "function" !== typeof JSON.stringify && (JSON.stringify = function(a, b, e) {
        var g;
        o = c = "";
        if ("number" === typeof e)
            for (g = 0; g < e; g += 1) o += " ";
        else "string" === typeof e && (o = e);
        if ((t = b) && "function" !== typeof b && ("object" !== typeof b || "number" !== typeof b.length)) throw Error("JSON.stringify");
        return p("", {
            "": a
        })
    });
    "function" !== typeof JSON.parse && (JSON.parse = function(a, b) {
        function c(a, e) {
            var g, o, u = a[e];
            if (u && "object" === typeof u)
                for (g in u) Object.prototype.hasOwnProperty.call(u, g) && (o = c(u, g), void 0 !== o ? u[g] = o : delete u[g]);
            return b.call(a, e, u)
        }
        var e;
        a = String(a);
        r.lastIndex = 0;
        r.test(a) && (a = a.replace(r, function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return e = eval("(" + a + ")"), "function" === typeof b ? c({
            "": e
        }, "") : e;
        throw new SyntaxError("JSON.parse");
    })
})();
(function(b, g) {
    function p(d) {
        return f.isWindow(d) ? d : 9 === d.nodeType ? d.defaultView || d.parentWindow : !1
    }

    function r(d) {
        if (!gb[d]) {
            var q = K.body,
                I = f("\x3c" + d + "\x3e").appendTo(q),
                C = I.css("display");
            I.remove();
            if ("none" === C || "" === C) {
                va || (va = K.createElement("iframe"), va.frameBorder = va.width = va.height = 0);
                q.appendChild(va);
                if (!Da || !va.createElement) Da = (va.contentWindow || va.contentDocument).document, Da.write((f.support.boxModel ? "\x3c!doctype html\x3e" : "") + "\x3chtml\x3e\x3cbody\x3e"), Da.close();
                I = Da.createElement(d);
                Da.body.appendChild(I);
                C = f.css(I, "display");
                q.removeChild(va)
            }
            gb[d] = C
        }
        return gb[d]
    }

    function a(d, q) {
        var I = {};
        f.each(Pa.concat.apply([], Pa.slice(0, q)), function() {
            I[this] = d
        });
        return I
    }

    function c() {
        Qa = g
    }

    function o() {
        setTimeout(c, 0);
        return Qa = f.now()
    }

    function e() {
        try {
            return new b.XMLHttpRequest
        } catch (d) {}
    }

    function t(d, q, I, C) {
        if (f.isArray(q)) f.each(q, function(q, f) {
            I || jc.test(d) ? C(d, f) : t(d + "[" + ("object" == typeof f ? q : "") + "]", f, I, C)
        });
        else if (!I && "object" === f.type(q))
            for (var a in q) t(d + "[" + a + "]", q[a], I, C);
        else C(d, q)
    }

    function v(d, q) {
        var I, C, a = f.ajaxSettings.flatOptions || {};
        for (I in q) q[I] !== g && ((a[I] ? d : C || (C = {}))[I] = q[I]);
        C && f.extend(!0, d, C)
    }

    function J(d, q, f, C, a, b) {
        a = a || q.dataTypes[0];
        b = b || {};
        b[a] = !0;
        a = d[a];
        for (var c = 0, e = a ? a.length : 0, o = d === hb, u; c < e && (o || !u); c++) u = a[c](q, f, C), "string" == typeof u && (!o || b[u] ? u = g : (q.dataTypes.unshift(u), u = J(d, q, f, C, u, b)));
        (o || !u) && !b["*"] && (u = J(d, q, f, C, "*", b));
        return u
    }

    function y(d) {
        return function(q, I) {
            "string" != typeof q && (I = q, q = "*");
            if (f.isFunction(I))
                for (var C = q.toLowerCase().split(Ab),
                        a = 0, b = C.length, c, e; a < b; a++) c = C[a], (e = /^\+/.test(c)) && (c = c.substr(1) || "*"), c = d[c] = d[c] || [], c[e ? "unshift" : "push"](I)
        }
    }

    function w(d, q, I) {
        var C = "width" === q ? d.offsetWidth : d.offsetHeight,
            a = "width" === q ? 1 : 0;
        if (0 < C) {
            if ("border" !== I)
                for (; 4 > a; a += 2) I || (C -= parseFloat(f.css(d, "padding" + ya[a])) || 0), "margin" === I ? C += parseFloat(f.css(d, I + ya[a])) || 0 : C -= parseFloat(f.css(d, "border" + ya[a] + "Width")) || 0;
            return C + "px"
        }
        C = Ea(d, q);
        if (0 > C || null == C) C = d.style[q];
        if (ib.test(C)) return C;
        C = parseFloat(C) || 0;
        if (I)
            for (; 4 > a; a += 2) C += parseFloat(f.css(d,
                "padding" + ya[a])) || 0, "padding" !== I && (C += parseFloat(f.css(d, "border" + ya[a] + "Width")) || 0), "margin" === I && (C += parseFloat(f.css(d, I + ya[a])) || 0);
        return C + "px"
    }

    function z(d) {
        var q = (d.nodeName || "").toLowerCase();
        "input" === q ? E(d) : "script" !== q && "undefined" != typeof d.getElementsByTagName && f.grep(d.getElementsByTagName("input"), E)
    }

    function E(d) {
        if ("checkbox" === d.type || "radio" === d.type) d.defaultChecked = d.checked
    }

    function N(d) {
        return "undefined" != typeof d.getElementsByTagName ? d.getElementsByTagName("*") : "undefined" !=
            typeof d.querySelectorAll ? d.querySelectorAll("*") : []
    }

    function U(d, q) {
        var I;
        1 === q.nodeType && (q.clearAttributes && q.clearAttributes(), q.mergeAttributes && q.mergeAttributes(d), I = q.nodeName.toLowerCase(), "object" === I ? q.outerHTML = d.outerHTML : "input" !== I || "checkbox" !== d.type && "radio" !== d.type ? "option" === I ? q.selected = d.defaultSelected : "input" === I || "textarea" === I ? q.defaultValue = d.defaultValue : "script" === I && q.text !== d.text && (q.text = d.text) : (d.checked && (q.defaultChecked = q.checked = d.checked), q.value !== d.value &&
            (q.value = d.value)), q.removeAttribute(f.expando), q.removeAttribute("_submit_attached"), q.removeAttribute("_change_attached"))
    }

    function u(d, q) {
        if (1 === q.nodeType && f.hasData(d)) {
            var I, C, a;
            C = f._data(d);
            var b = f._data(q, C),
                c = C.events;
            if (c)
                for (I in delete b.handle, b.events = {}, c) {
                    C = 0;
                    for (a = c[I].length; C < a; C++) f.event.add(q, I, c[I][C])
                }
            b.data && (b.data = f.extend({}, b.data))
        }
    }

    function B(d) {
        var q = Bb.split("|");
        d = d.createDocumentFragment();
        if (d.createElement)
            for (; q.length;) d.createElement(q.pop());
        return d
    }

    function P(d,
        q, I) {
        q = q || 0;
        if (f.isFunction(q)) return f.grep(d, function(d, f) {
            return !!q.call(d, f, d) === I
        });
        if (q.nodeType) return f.grep(d, function(d) {
            return d === q === I
        });
        if ("string" == typeof q) {
            var C = f.grep(d, function(d) {
                return 1 === d.nodeType
            });
            if (kc.test(q)) return f.filter(q, C, !I);
            q = f.filter(q, C)
        }
        return f.grep(d, function(d) {
            return 0 <= f.inArray(d, q) === I
        })
    }

    function D() {
        return !0
    }

    function F() {
        return !1
    }

    function A(d, q, I) {
        var C = q + "defer",
            a = q + "queue",
            b = q + "mark",
            c = f._data(d, C);
        c && ("queue" === I || !f._data(d, a)) && ("mark" === I || !f._data(d,
            b)) && setTimeout(function() {
            !f._data(d, a) && !f._data(d, b) && (f.removeData(d, C, !0), c.fire())
        }, 0)
    }

    function O(d) {
        for (var q in d)
            if (!("data" === q && f.isEmptyObject(d[q])) && "toJSON" !== q) return !1;
        return !0
    }

    function aa(d, q, I) {
        if (I === g && 1 === d.nodeType)
            if (I = "data-" + q.replace(lc, "-$1").toLowerCase(), I = d.getAttribute(I), "string" == typeof I) {
                try {
                    I = "true" === I ? !0 : "false" === I ? !1 : "null" === I ? null : f.isNumeric(I) ? +I : mc.test(I) ? f.parseJSON(I) : I
                } catch (C) {}
                f.data(d, q, I)
            } else I = g;
        return I
    }
    var K = b.document,
        oa = b.location,
        f, ba = function() {
            if (!M.isReady) {
                try {
                    K.documentElement.doScroll("left")
                } catch (d) {
                    setTimeout(ba,
                        1);
                    return
                }
                M.ready()
            }
        },
        M = function(d, q) {
            return new M.fn.init(d, q, pa)
        },
        Z = b.jQuery,
        G = b.$,
        pa, S = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
        ha = /\S/,
        L = /^\s+/,
        ca = /\s+$/,
        Q = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
        T = /^[\],:{}\s]*$/,
        da = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        ia = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        ja = /(?:^|:|,)(?:\s*\[)+/g,
        ka = /(webkit)[ \/]([\w.]+)/,
        na = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        ea = /(msie) ([\w.]+)/,
        xa = /(mozilla)(?:.*? rv:([\w.]+))?/,
        la = /-([a-z]|[0-9])/ig,
        Y = /^-ms-/,
        ga = function(d, q) {
            return (q + "").toUpperCase()
        },
        H = b.navigator.userAgent,
        ta, R, fa, Ra = Object.prototype.toString,
        sa = Object.prototype.hasOwnProperty,
        jb = Array.prototype.push,
        Ka = Array.prototype.slice,
        Cb = String.prototype.trim,
        Db = Array.prototype.indexOf,
        Eb = {};
    M.fn = M.prototype = {
        constructor: M,
        init: function(d, q, f) {
            var C, a;
            if (!d) return this;
            if (d.nodeType) return this.context = this[0] = d, this.length = 1, this;
            if ("body" === d && !q && K.body) return this.context = K, this[0] = K.body, this.selector = d, this.length = 1, this;
            if ("string" ==
                typeof d) {
                "\x3c" !== d.charAt(0) || "\x3e" !== d.charAt(d.length - 1) || 3 > d.length ? C = S.exec(d) : C = [null, d, null];
                if (C && (C[1] || !q)) {
                    if (C[1]) return a = (q = q instanceof M ? q[0] : q) ? q.ownerDocument || q : K, (f = Q.exec(d)) ? M.isPlainObject(q) ? (d = [K.createElement(f[1])], M.fn.attr.call(d, q, !0)) : d = [a.createElement(f[1])] : (f = M.buildFragment([C[1]], [a]), d = (f.cacheable ? M.clone(f.fragment) : f.fragment).childNodes), M.merge(this, d);
                    if ((q = K.getElementById(C[2])) && q.parentNode) {
                        if (q.id !== C[2]) return f.find(d);
                        this.length = 1;
                        this[0] = q
                    }
                    this.context =
                        K;
                    this.selector = d;
                    return this
                }
                return !q || q.jquery ? (q || f).find(d) : this.constructor(q).find(d)
            }
            if (M.isFunction(d)) return f.ready(d);
            d.selector !== g && (this.selector = d.selector, this.context = d.context);
            return M.makeArray(d, this)
        },
        selector: "",
        jquery: "1.7.2",
        length: 0,
        size: function() {
            return this.length
        },
        toArray: function() {
            return Ka.call(this, 0)
        },
        get: function(d) {
            return null == d ? this.toArray() : 0 > d ? this[this.length + d] : this[d]
        },
        pushStack: function(d, q, f) {
            var C = this.constructor();
            M.isArray(d) ? jb.apply(C, d) : M.merge(C,
                d);
            C.prevObject = this;
            C.context = this.context;
            "find" === q ? C.selector = this.selector + (this.selector ? " " : "") + f : q && (C.selector = this.selector + "." + q + "(" + f + ")");
            return C
        },
        each: function(d, q) {
            return M.each(this, d, q)
        },
        ready: function(d) {
            M.bindReady();
            R.add(d);
            return this
        },
        eq: function(d) {
            d = +d;
            return -1 === d ? this.slice(d) : this.slice(d, d + 1)
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        slice: function() {
            return this.pushStack(Ka.apply(this, arguments), "slice", Ka.call(arguments).join(","))
        },
        map: function(d) {
            return this.pushStack(M.map(this,
                function(q, f) {
                    return d.call(q, f, q)
                }))
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: jb,
        sort: [].sort,
        splice: [].splice
    };
    M.fn.init.prototype = M.fn;
    M.extend = M.fn.extend = function() {
        var d, q, f, C, a, b, c = arguments[0] || {},
            e = 1,
            o = arguments.length,
            u = !1;
        "boolean" == typeof c && (u = c, c = arguments[1] || {}, e = 2);
        "object" != typeof c && !M.isFunction(c) && (c = {});
        for (o === e && (c = this, --e); e < o; e++)
            if (null != (d = arguments[e]))
                for (q in d) f = c[q], C = d[q], c !== C && (u && C && (M.isPlainObject(C) || (a = M.isArray(C))) ? (a ? (a = !1,
                    b = f && M.isArray(f) ? f : []) : b = f && M.isPlainObject(f) ? f : {}, c[q] = M.extend(u, b, C)) : C !== g && (c[q] = C));
        return c
    };
    M.extend({
        noConflict: function(d) {
            b.$ === M && (b.$ = G);
            d && b.jQuery === M && (b.jQuery = Z);
            return M
        },
        isReady: !1,
        readyWait: 1,
        holdReady: function(d) {
            d ? M.readyWait++ : M.ready(!0)
        },
        ready: function(d) {
            if (!0 === d && !--M.readyWait || !0 !== d && !M.isReady) {
                if (!K.body) return setTimeout(M.ready, 1);
                M.isReady = !0;
                !0 !== d && 0 < --M.readyWait || (R.fireWith(K, [M]), M.fn.trigger && M(K).trigger("ready").off("ready"))
            }
        },
        bindReady: function() {
            if (!R) {
                R =
                    M.Callbacks("once memory");
                if ("complete" === K.readyState) return setTimeout(M.ready, 1);
                if (K.addEventListener) K.addEventListener("DOMContentLoaded", fa, !1), b.addEventListener("load", M.ready, !1);
                else if (K.attachEvent) {
                    K.attachEvent("onreadystatechange", fa);
                    b.attachEvent("onload", M.ready);
                    var d = !1;
                    try {
                        d = null == b.frameElement
                    } catch (q) {}
                    K.documentElement.doScroll && d && ba()
                }
            }
        },
        isFunction: function(d) {
            return "function" === M.type(d)
        },
        isArray: Array.isArray || function(d) {
            return "array" === M.type(d)
        },
        isWindow: function(d) {
            return null !=
                d && d == d.window
        },
        isNumeric: function(d) {
            return !isNaN(parseFloat(d)) && isFinite(d)
        },
        type: function(d) {
            return null == d ? String(d) : Eb[Ra.call(d)] || "object"
        },
        isPlainObject: function(d) {
            if (!d || "object" !== M.type(d) || d.nodeType || M.isWindow(d)) return !1;
            try {
                if (d.constructor && !sa.call(d, "constructor") && !sa.call(d.constructor.prototype, "isPrototypeOf")) return !1
            } catch (q) {
                return !1
            }
            for (var f in d);
            return f === g || sa.call(d, f)
        },
        isEmptyObject: function(d) {
            for (var q in d) return !1;
            return !0
        },
        error: function(d) {
            throw Error(d);
        },
        parseJSON: function(d) {
            if ("string" != typeof d || !d) return null;
            d = M.trim(d);
            if (b.JSON && b.JSON.parse) return b.JSON.parse(d);
            if (T.test(d.replace(da, "@").replace(ia, "]").replace(ja, ""))) return (new Function("return " + d))();
            M.error("Invalid JSON: " + d)
        },
        parseXML: function(d) {
            if ("string" != typeof d || !d) return null;
            var q, f;
            try {
                b.DOMParser ? (f = new DOMParser, q = f.parseFromString(d, "text/xml")) : (q = new ActiveXObject("Microsoft.XMLDOM"), q.async = "false", q.loadXML(d))
            } catch (C) {
                q = g
            }(!q || !q.documentElement || q.getElementsByTagName("parsererror").length) &&
            M.error("Invalid XML: " + d);
            return q
        },
        noop: function() {},
        globalEval: function(d) {
            d && ha.test(d) && (b.execScript || function(d) {
                b.eval.call(b, d)
            })(d)
        },
        camelCase: function(d) {
            return d.replace(Y, "ms-").replace(la, ga)
        },
        nodeName: function(d, q) {
            return d.nodeName && d.nodeName.toUpperCase() === q.toUpperCase()
        },
        each: function(d, q, f) {
            var C, a = 0,
                b = d.length,
                c = b === g || M.isFunction(d);
            if (f)
                if (c)
                    for (C in d) {
                        if (!1 === q.apply(d[C], f)) break
                    } else
                        for (; a < b && !1 !== q.apply(d[a++], f););
                else if (c)
                for (C in d) {
                    if (!1 === q.call(d[C], C, d[C])) break
                } else
                    for (; a <
                        b && !1 !== q.call(d[a], a, d[a++]););
            return d
        },
        trim: Cb ? function(d) {
            return null == d ? "" : Cb.call(d)
        } : function(d) {
            return null == d ? "" : (d + "").replace(L, "").replace(ca, "")
        },
        makeArray: function(d, q) {
            var f = q || [];
            if (null != d) {
                var C = M.type(d);
                null == d.length || "string" === C || "function" === C || "regexp" === C || M.isWindow(d) ? jb.call(f, d) : M.merge(f, d)
            }
            return f
        },
        inArray: function(d, q, f) {
            var C;
            if (q) {
                if (Db) return Db.call(q, d, f);
                C = q.length;
                for (f = f ? 0 > f ? Math.max(0, C + f) : f : 0; f < C; f++)
                    if (f in q && q[f] === d) return f
            }
            return -1
        },
        merge: function(d,
            q) {
            var f = d.length,
                C = 0;
            if ("number" == typeof q.length)
                for (var a = q.length; C < a; C++) d[f++] = q[C];
            else
                for (; q[C] !== g;) d[f++] = q[C++];
            d.length = f;
            return d
        },
        grep: function(d, q, f) {
            var C = [],
                a;
            f = !!f;
            for (var b = 0, c = d.length; b < c; b++) a = !!q(d[b], b), f !== a && C.push(d[b]);
            return C
        },
        map: function(d, q, f) {
            var a, b, c = [],
                e = 0,
                o = d.length;
            if (d instanceof M || o !== g && "number" == typeof o && (0 < o && d[0] && d[o - 1] || 0 === o || M.isArray(d)))
                for (; e < o; e++) a = q(d[e], e, f), null != a && (c[c.length] = a);
            else
                for (b in d) a = q(d[b], b, f), null != a && (c[c.length] = a);
            return c.concat.apply([],
                c)
        },
        guid: 1,
        proxy: function(d, q) {
            if ("string" == typeof q) {
                var f = d[q];
                q = d;
                d = f
            }
            if (!M.isFunction(d)) return g;
            var a = Ka.call(arguments, 2),
                f = function() {
                    return d.apply(q, a.concat(Ka.call(arguments)))
                };
            f.guid = d.guid = d.guid || f.guid || M.guid++;
            return f
        },
        access: function(d, q, f, a, b, c, e) {
            var o, u = null == f,
                t = 0,
                A = d.length;
            if (f && "object" == typeof f) {
                for (t in f) M.access(d, q, t, f[t], 1, c, a);
                b = 1
            } else if (a !== g) {
                o = e === g && M.isFunction(a);
                u && (o ? (o = q, q = function(d, q, f) {
                    return o.call(M(d), f)
                }) : (q.call(d, a), q = null));
                if (q)
                    for (; t < A; t++) q(d[t],
                        f, o ? a.call(d[t], t, q(d[t], f)) : a, e);
                b = 1
            }
            return b ? d : u ? q.call(d) : A ? q(d[0], f) : c
        },
        now: function() {
            return (new Date).getTime()
        },
        uaMatch: function(d) {
            d = d.toLowerCase();
            d = ka.exec(d) || na.exec(d) || ea.exec(d) || 0 > d.indexOf("compatible") && xa.exec(d) || [];
            return {
                browser: d[1] || "",
                version: d[2] || "0"
            }
        },
        sub: function() {
            function d(q, f) {
                return new d.fn.init(q, f)
            }
            M.extend(!0, d, this);
            d.superclass = this;
            d.fn = d.prototype = this();
            d.fn.constructor = d;
            d.sub = this.sub;
            d.fn.init = function(f, a) {
                a && a instanceof M && !(a instanceof d) && (a = d(a));
                return M.fn.init.call(this, f, a, q)
            };
            d.fn.init.prototype = d.fn;
            var q = d(K);
            return d
        },
        browser: {}
    });
    M.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(d, q) {
        Eb["[object " + q + "]"] = q.toLowerCase()
    });
    ta = M.uaMatch(H);
    ta.browser && (M.browser[ta.browser] = !0, M.browser.version = ta.version);
    M.browser.webkit && (M.browser.safari = !0);
    ha.test(" ") && (L = /^[\s\xA0]+/, ca = /[\s\xA0]+$/);
    pa = M(K);
    K.addEventListener ? fa = function() {
            K.removeEventListener("DOMContentLoaded", fa, !1);
            M.ready()
        } : K.attachEvent &&
        (fa = function() {
            "complete" === K.readyState && (K.detachEvent("onreadystatechange", fa), M.ready())
        });
    f = M;
    var Sa = {};
    f.Callbacks = function(d) {
        var q;
        if (d) {
            if (!(q = Sa[d])) {
                q = d;
                var a = Sa[q] = {},
                    C, b;
                q = q.split(/\s+/);
                C = 0;
                for (b = q.length; C < b; C++) a[q[C]] = !0;
                q = a
            }
        } else q = {};
        d = q;
        var c = [],
            e = [],
            o, u, t, A, r, H, R = function(q) {
                var a, I, C, b;
                a = 0;
                for (I = q.length; a < I; a++) C = q[a], b = f.type(C), "array" === b ? R(C) : "function" === b && (!d.unique || !p.has(C)) && c.push(C)
            },
            v = function(q, f) {
                f = f || [];
                o = !d.memory || [q, f];
                t = u = !0;
                H = A || 0;
                A = 0;
                for (r = c.length; c &&
                    H < r; H++)
                    if (!1 === c[H].apply(q, f) && d.stopOnFalse) {
                        o = !0;
                        break
                    }
                t = !1;
                c && (d.once ? !0 === o ? p.disable() : c = [] : e && e.length && (o = e.shift(), p.fireWith(o[0], o[1])))
            },
            p = {
                add: function() {
                    if (c) {
                        var d = c.length;
                        R(arguments);
                        t ? r = c.length : o && !0 !== o && (A = d, v(o[0], o[1]))
                    }
                    return this
                },
                remove: function() {
                    if (c)
                        for (var q = arguments, f = 0, a = q.length; f < a; f++)
                            for (var I = 0; I < c.length && !(q[f] === c[I] && (t && I <= r && (r--, I <= H && H--), c.splice(I--, 1), d.unique)); I++);
                    return this
                },
                has: function(d) {
                    if (c)
                        for (var q = 0, f = c.length; q < f; q++)
                            if (d === c[q]) return !0;
                    return !1
                },
                empty: function() {
                    c = [];
                    return this
                },
                disable: function() {
                    c = e = o = g;
                    return this
                },
                disabled: function() {
                    return !c
                },
                lock: function() {
                    e = g;
                    (!o || !0 === o) && p.disable();
                    return this
                },
                locked: function() {
                    return !e
                },
                fireWith: function(q, f) {
                    e && (t ? d.once || e.push([q, f]) : (!d.once || !o) && v(q, f));
                    return this
                },
                fire: function() {
                    p.fireWith(this, arguments);
                    return this
                },
                fired: function() {
                    return !!u
                }
            };
        return p
    };
    var kb = [].slice;
    f.extend({
        Deferred: function(d) {
            var q = f.Callbacks("once memory"),
                a = f.Callbacks("once memory"),
                C = f.Callbacks("memory"),
                c = "pending",
                b = {
                    resolve: q,
                    reject: a,
                    notify: C
                },
                e = {
                    done: q.add,
                    fail: a.add,
                    progress: C.add,
                    state: function() {
                        return c
                    },
                    isResolved: q.fired,
                    isRejected: a.fired,
                    then: function(d, q, f) {
                        o.done(d).fail(q).progress(f);
                        return this
                    },
                    always: function() {
                        o.done.apply(o, arguments).fail.apply(o, arguments);
                        return this
                    },
                    pipe: function(d, q, a) {
                        return f.Deferred(function(I) {
                            f.each({
                                done: [d, "resolve"],
                                fail: [q, "reject"],
                                progress: [a, "notify"]
                            }, function(d, q) {
                                var a = q[0],
                                    C = q[1],
                                    c;
                                f.isFunction(a) ? o[d](function() {
                                    (c = a.apply(this, arguments)) &&
                                    f.isFunction(c.promise) ? c.promise().then(I.resolve, I.reject, I.notify) : I[C + "With"](this === o ? I : this, [c])
                                }) : o[d](I[C])
                            })
                        }).promise()
                    },
                    promise: function(d) {
                        if (null == d) d = e;
                        else
                            for (var q in e) d[q] = e[q];
                        return d
                    }
                },
                o = e.promise({}),
                g;
            for (g in b) o[g] = b[g].fire, o[g + "With"] = b[g].fireWith;
            o.done(function() {
                c = "resolved"
            }, a.disable, C.lock).fail(function() {
                c = "rejected"
            }, q.disable, C.lock);
            d && d.call(o, o);
            return o
        },
        when: function(d) {
            function q(d) {
                return function(q) {
                    e[d] = 1 < arguments.length ? kb.call(arguments, 0) : q;
                    g.notifyWith(u,
                        e)
                }
            }

            function a(d) {
                return function(q) {
                    C[d] = 1 < arguments.length ? kb.call(arguments, 0) : q;
                    --o || g.resolveWith(g, C)
                }
            }
            var C = kb.call(arguments, 0),
                c = 0,
                b = C.length,
                e = Array(b),
                o = b,
                g = 1 >= b && d && f.isFunction(d.promise) ? d : f.Deferred(),
                u = g.promise();
            if (1 < b) {
                for (; c < b; c++) C[c] && C[c].promise && f.isFunction(C[c].promise) ? C[c].promise().then(a(c), g.reject, q(c)) : --o;
                o || g.resolveWith(g, C)
            } else g !== d && g.resolveWith(g, b ? [d] : []);
            return u
        }
    });
    var nc = f,
        lb;
    var ma, mb, Fa, Ta, Ua, qa, za, La, Va, nb, Ma, W = K.createElement("div");
    W.setAttribute("className",
        "t");
    W.innerHTML = "   \x3clink/\x3e\x3ctable\x3e\x3c/table\x3e\x3ca href\x3d'/a' style\x3d'top:1px;float:left;opacity:.55;'\x3ea\x3c/a\x3e\x3cinput type\x3d'checkbox'/\x3e";
    mb = W.getElementsByTagName("*");
    Fa = W.getElementsByTagName("a")[0];
    if (!mb || !mb.length || !Fa) lb = {};
    else {
        Ta = K.createElement("select");
        Ua = Ta.appendChild(K.createElement("option"));
        qa = W.getElementsByTagName("input")[0];
        ma = {
            leadingWhitespace: 3 === W.firstChild.nodeType,
            tbody: !W.getElementsByTagName("tbody").length,
            htmlSerialize: !!W.getElementsByTagName("link").length,
            style: /top/.test(Fa.getAttribute("style")),
            hrefNormalized: "/a" === Fa.getAttribute("href"),
            opacity: /^0.55/.test(Fa.style.opacity),
            cssFloat: !!Fa.style.cssFloat,
            checkOn: "on" === qa.value,
            optSelected: Ua.selected,
            getSetAttribute: "t" !== W.className,
            enctype: !!K.createElement("form").enctype,
            html5Clone: "\x3c:nav\x3e\x3c/:nav\x3e" !== K.createElement("nav").cloneNode(!0).outerHTML,
            submitBubbles: !0,
            changeBubbles: !0,
            focusinBubbles: !1,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            pixelMargin: !0
        };
        f.boxModel = ma.boxModel = "CSS1Compat" === K.compatMode;
        qa.checked = !0;
        ma.noCloneChecked = qa.cloneNode(!0).checked;
        Ta.disabled = !0;
        ma.optDisabled = !Ua.disabled;
        try {
            delete W.test
        } catch (ed) {
            ma.deleteExpando = !1
        }!W.addEventListener && W.attachEvent && W.fireEvent && (W.attachEvent("onclick", function() {
            ma.noCloneEvent = !1
        }), W.cloneNode(!0).fireEvent("onclick"));
        qa = K.createElement("input");
        qa.value = "t";
        qa.setAttribute("type", "radio");
        ma.radioValue = "t" === qa.value;
        qa.setAttribute("checked", "checked");
        qa.setAttribute("name",
            "t");
        W.appendChild(qa);
        za = K.createDocumentFragment();
        za.appendChild(W.lastChild);
        ma.checkClone = za.cloneNode(!0).cloneNode(!0).lastChild.checked;
        ma.appendChecked = qa.checked;
        za.removeChild(qa);
        za.appendChild(W);
        if (W.attachEvent)
            for (nb in {
                    submit: 1,
                    change: 1,
                    focusin: 1
                }) Va = "on" + nb, (Ma = Va in W) || (W.setAttribute(Va, "return;"), Ma = "function" == typeof W[Va]), ma[nb + "Bubbles"] = Ma;
        za.removeChild(W);
        za = Ta = Ua = W = qa = null;
        f(function() {
            var d, q, a, C, c, e, o = K.getElementsByTagName("body")[0];
            !o || (d = K.createElement("div"),
                d.style.cssText = "padding:0;margin:0;border:0;visibility:hidden;width:0;height:0;position:static;top:0;margin-top:1px", o.insertBefore(d, o.firstChild), W = K.createElement("div"), d.appendChild(W), W.innerHTML = "\x3ctable\x3e\x3ctr\x3e\x3ctd style\x3d'padding:0;margin:0;border:0;display:none'\x3e\x3c/td\x3e\x3ctd\x3et\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e", La = W.getElementsByTagName("td"), Ma = 0 === La[0].offsetHeight, La[0].style.display = "", La[1].style.display = "none", ma.reliableHiddenOffsets = Ma && 0 === La[0].offsetHeight,
                b.getComputedStyle && (W.innerHTML = "", e = K.createElement("div"), e.style.width = "0", e.style.marginRight = "0", W.style.width = "2px", W.appendChild(e), ma.reliableMarginRight = 0 === (parseInt((b.getComputedStyle(e, null) || {
                    marginRight: 0
                }).marginRight, 10) || 0)), "undefined" != typeof W.style.zoom && (W.innerHTML = "", W.style.width = W.style.padding = "1px", W.style.border = 0, W.style.overflow = "hidden", W.style.display = "inline", W.style.zoom = 1, ma.inlineBlockNeedsLayout = 3 === W.offsetWidth, W.style.display = "block", W.style.overflow = "visible",
                    W.innerHTML = "\x3cdiv style\x3d'width:5px;'\x3e\x3c/div\x3e", ma.shrinkWrapBlocks = 3 !== W.offsetWidth), W.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;padding:0;margin:0;border:0;visibility:hidden;", W.innerHTML = "\x3cdiv style\x3d'position:absolute;top:0;left:0;width:1px;height:1px;padding:0;margin:0;border:5px solid #000;display:block;'\x3e\x3cdiv style\x3d'padding:0;margin:0;border:0;display:block;overflow:hidden;'\x3e\x3c/div\x3e\x3c/div\x3e\x3ctable style\x3d'position:absolute;top:0;left:0;width:1px;height:1px;padding:0;margin:0;border:5px solid #000;' cellpadding\x3d'0' cellspacing\x3d'0'\x3e\x3ctr\x3e\x3ctd\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e",
                q = W.firstChild, a = q.firstChild, C = q.nextSibling.firstChild.firstChild, c = {
                    doesNotAddBorder: 5 !== a.offsetTop,
                    doesAddBorderForTableAndCells: 5 === C.offsetTop
                }, a.style.position = "fixed", a.style.top = "20px", c.fixedPosition = 20 === a.offsetTop || 15 === a.offsetTop, a.style.position = a.style.top = "", q.style.overflow = "hidden", q.style.position = "relative", c.subtractsBorderForOverflowNotVisible = -5 === a.offsetTop, c.doesNotIncludeMarginInBodyOffset = 1 !== o.offsetTop, b.getComputedStyle && (W.style.marginTop = "1%", ma.pixelMargin = "1%" !==
                    (b.getComputedStyle(W, null) || {
                        marginTop: 0
                    }).marginTop), "undefined" != typeof d.style.zoom && (d.style.zoom = 1), o.removeChild(d), W = null, f.extend(ma, c))
        });
        lb = ma
    }
    nc.support = lb;
    var mc = /^(?:\{.*\}|\[.*\])$/,
        lc = /([A-Z])/g;
    f.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(d) {
            d = d.nodeType ? f.cache[d[f.expando]] : d[f.expando];
            return !!d && !O(d)
        },
        data: function(d, q, a, C) {
            if (f.acceptData(d)) {
                var c,
                    b;
                c = f.expando;
                var e = "string" == typeof q,
                    o = d.nodeType,
                    u = o ? f.cache : d,
                    t = o ? d[c] : d[c] && c,
                    A = "events" === q;
                if (t && u[t] && (A || C || u[t].data) || !(e && a === g)) {
                    t || (o ? d[c] = t = ++f.uuid : t = c);
                    u[t] || (u[t] = {}, o || (u[t].toJSON = f.noop));
                    if ("object" == typeof q || "function" == typeof q) C ? u[t] = f.extend(u[t], q) : u[t].data = f.extend(u[t].data, q);
                    d = c = u[t];
                    C || (c.data || (c.data = {}), c = c.data);
                    a !== g && (c[f.camelCase(q)] = a);
                    if (A && !c[q]) return d.events;
                    e ? (b = c[q], null == b && (b = c[f.camelCase(q)])) : b = c;
                    return b
                }
            }
        },
        removeData: function(d, q, a) {
            if (f.acceptData(d)) {
                var C,
                    c, b, e = f.expando,
                    o = d.nodeType,
                    g = o ? f.cache : d,
                    u = o ? d[e] : e;
                if (g[u]) {
                    if (q && (C = a ? g[u] : g[u].data)) {
                        f.isArray(q) || (q in C ? q = [q] : (q = f.camelCase(q), q in C ? q = [q] : q = q.split(" ")));
                        c = 0;
                        for (b = q.length; c < b; c++) delete C[q[c]];
                        if (!(a ? O : f.isEmptyObject)(C)) return
                    }
                    if (!a && (delete g[u].data, !O(g[u]))) return;
                    f.support.deleteExpando || !g.setInterval ? delete g[u] : g[u] = null;
                    o && (f.support.deleteExpando ? delete d[e] : d.removeAttribute ? d.removeAttribute(e) : d[e] = null)
                }
            }
        },
        _data: function(d, q, a) {
            return f.data(d, q, a, !0)
        },
        acceptData: function(d) {
            if (d.nodeName) {
                var q =
                    f.noData[d.nodeName.toLowerCase()];
                if (q) return !0 !== q && d.getAttribute("classid") === q
            }
            return !0
        }
    });
    f.fn.extend({
        data: function(d, q) {
            var a, C, c, b, e, o = this[0],
                u = 0,
                t = null;
            if (d === g) {
                if (this.length && (t = f.data(o), 1 === o.nodeType && !f._data(o, "parsedAttrs"))) {
                    c = o.attributes;
                    for (e = c.length; u < e; u++) b = c[u].name, 0 === b.indexOf("data-") && (b = f.camelCase(b.substring(5)), aa(o, b, t[b]));
                    f._data(o, "parsedAttrs", !0)
                }
                return t
            }
            if ("object" == typeof d) return this.each(function() {
                f.data(this, d)
            });
            a = d.split(".", 2);
            a[1] = a[1] ? "." + a[1] :
                "";
            C = a[1] + "!";
            return f.access(this, function(q) {
                if (q === g) return t = this.triggerHandler("getData" + C, [a[0]]), t === g && o && (t = f.data(o, d), t = aa(o, d, t)), t === g && a[1] ? this.data(a[0]) : t;
                a[1] = q;
                this.each(function() {
                    var c = f(this);
                    c.triggerHandler("setData" + C, a);
                    f.data(this, d, q);
                    c.triggerHandler("changeData" + C, a)
                })
            }, null, q, 1 < arguments.length, null, !1)
        },
        removeData: function(d) {
            return this.each(function() {
                f.removeData(this, d)
            })
        }
    });
    f.extend({
        _mark: function(d, q) {
            d && (q = (q || "fx") + "mark", f._data(d, q, (f._data(d, q) || 0) + 1))
        },
        _unmark: function(d, q, a) {
            !0 !== d && (a = q, q = d, d = !1);
            if (q) {
                a = a || "fx";
                var C = a + "mark";
                (d = d ? 0 : (f._data(q, C) || 1) - 1) ? f._data(q, C, d): (f.removeData(q, C, !0), A(q, a, "mark"))
            }
        },
        queue: function(d, q, a) {
            var C;
            if (d) return q = (q || "fx") + "queue", C = f._data(d, q), a && (!C || f.isArray(a) ? C = f._data(d, q, f.makeArray(a)) : C.push(a)), C || []
        },
        dequeue: function(d, q) {
            q = q || "fx";
            var a = f.queue(d, q),
                C = a.shift(),
                c = {};
            "inprogress" === C && (C = a.shift());
            C && ("fx" === q && a.unshift("inprogress"), f._data(d, q + ".run", c), C.call(d, function() {
                f.dequeue(d, q)
            }, c));
            a.length || (f.removeData(d, q + "queue " + q + ".run", !0), A(d, q, "queue"))
        }
    });
    f.fn.extend({
        queue: function(d, q) {
            var a = 2;
            "string" != typeof d && (q = d, d = "fx", a--);
            return arguments.length < a ? f.queue(this[0], d) : q === g ? this : this.each(function() {
                var a = f.queue(this, d, q);
                "fx" === d && "inprogress" !== a[0] && f.dequeue(this, d)
            })
        },
        dequeue: function(d) {
            return this.each(function() {
                f.dequeue(this, d)
            })
        },
        delay: function(d, q) {
            d = f.fx ? f.fx.speeds[d] || d : d;
            return this.queue(q || "fx", function(q, f) {
                var a = setTimeout(q, d);
                f.stop = function() {
                    clearTimeout(a)
                }
            })
        },
        clearQueue: function(d) {
            return this.queue(d || "fx", [])
        },
        promise: function(d, q) {
            function a() {
                --e || C.resolveWith(c, [c])
            }
            "string" != typeof d && (q = d, d = g);
            d = d || "fx";
            for (var C = f.Deferred(), c = this, b = c.length, e = 1, o = d + "defer", u = d + "queue", t = d + "mark", A; b--;)
                if (A = f.data(c[b], o, g, !0) || (f.data(c[b], u, g, !0) || f.data(c[b], t, g, !0)) && f.data(c[b], o, f.Callbacks("once memory"), !0)) e++, A.add(a);
            a();
            return C.promise(q)
        }
    });
    var Fb = /[\n\t\r]/g,
        Wa = /\s+/,
        oc = /\r/g,
        pc = /^(?:button|input)$/i,
        qc = /^(?:button|input|object|select|textarea)$/i,
        rc = /^a(?:rea)?$/i,
        Gb = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        Hb = f.support.getSetAttribute,
        wa, Ib, Jb;
    f.fn.extend({
        attr: function(d, q) {
            return f.access(this, f.attr, d, q, 1 < arguments.length)
        },
        removeAttr: function(d) {
            return this.each(function() {
                f.removeAttr(this, d)
            })
        },
        prop: function(d, q) {
            return f.access(this, f.prop, d, q, 1 < arguments.length)
        },
        removeProp: function(d) {
            d = f.propFix[d] || d;
            return this.each(function() {
                try {
                    this[d] = g, delete this[d]
                } catch (q) {}
            })
        },
        addClass: function(d) {
            var q, a, C, c, b, e, o;
            if (f.isFunction(d)) return this.each(function(q) {
                f(this).addClass(d.call(this, q, this.className))
            });
            if (d && "string" == typeof d) {
                q = d.split(Wa);
                a = 0;
                for (C = this.length; a < C; a++)
                    if (c = this[a], 1 === c.nodeType)
                        if (!c.className && 1 === q.length) c.className = d;
                        else {
                            b = " " + c.className + " ";
                            e = 0;
                            for (o = q.length; e < o; e++) ~b.indexOf(" " + q[e] + " ") || (b += q[e] + " ");
                            c.className = f.trim(b)
                        }
            }
            return this
        },
        removeClass: function(d) {
            var q, a, C, c, b, e, o;
            if (f.isFunction(d)) return this.each(function(q) {
                f(this).removeClass(d.call(this,
                    q, this.className))
            });
            if (d && "string" == typeof d || d === g) {
                q = (d || "").split(Wa);
                a = 0;
                for (C = this.length; a < C; a++)
                    if (c = this[a], 1 === c.nodeType && c.className)
                        if (d) {
                            b = (" " + c.className + " ").replace(Fb, " ");
                            e = 0;
                            for (o = q.length; e < o; e++) b = b.replace(" " + q[e] + " ", " ");
                            c.className = f.trim(b)
                        } else c.className = ""
            }
            return this
        },
        toggleClass: function(d, q) {
            var a = typeof d,
                c = "boolean" == typeof q;
            return f.isFunction(d) ? this.each(function(a) {
                f(this).toggleClass(d.call(this, a, this.className, q), q)
            }) : this.each(function() {
                if ("string" ===
                    a)
                    for (var b, e = 0, o = f(this), g = q, u = d.split(Wa); b = u[e++];) g = c ? g : !o.hasClass(b), o[g ? "addClass" : "removeClass"](b);
                else if ("undefined" === a || "boolean" === a) this.className && f._data(this, "__className__", this.className), this.className = this.className || !1 === d ? "" : f._data(this, "__className__") || ""
            })
        },
        hasClass: function(d) {
            d = " " + d + " ";
            for (var q = 0, f = this.length; q < f; q++)
                if (1 === this[q].nodeType && -1 < (" " + this[q].className + " ").replace(Fb, " ").indexOf(d)) return !0;
            return !1
        },
        val: function(d) {
            var q, a, c, b = this[0];
            if (arguments.length) return c =
                f.isFunction(d), this.each(function(a) {
                    var b = f(this),
                        I;
                    if (1 === this.nodeType && (c ? I = d.call(this, a, b.val()) : I = d, null == I ? I = "" : "number" == typeof I ? I += "" : f.isArray(I) && (I = f.map(I, function(d) {
                            return null == d ? "" : d + ""
                        })), q = f.valHooks[this.type] || f.valHooks[this.nodeName.toLowerCase()], !q || !("set" in q) || q.set(this, I, "value") === g)) this.value = I
                });
            if (b) {
                if ((q = f.valHooks[b.type] || f.valHooks[b.nodeName.toLowerCase()]) && "get" in q && (a = q.get(b, "value")) !== g) return a;
                a = b.value;
                return "string" == typeof a ? a.replace(oc, "") :
                    null == a ? "" : a
            }
        }
    });
    f.extend({
        valHooks: {
            option: {
                get: function(d) {
                    var q = d.attributes.value;
                    return !q || q.specified ? d.value : d.text
                }
            },
            select: {
                get: function(d) {
                    var q, a, c = d.selectedIndex,
                        b = [],
                        e = d.options,
                        o = "select-one" === d.type;
                    if (0 > c) return null;
                    d = o ? c : 0;
                    for (a = o ? c + 1 : e.length; d < a; d++)
                        if (q = e[d], q.selected && (f.support.optDisabled ? !q.disabled : null === q.getAttribute("disabled")) && (!q.parentNode.disabled || !f.nodeName(q.parentNode, "optgroup"))) {
                            q = f(q).val();
                            if (o) return q;
                            b.push(q)
                        }
                    return o && !b.length && e.length ? f(e[c]).val() :
                        b
                },
                set: function(d, q) {
                    var a = f.makeArray(q);
                    f(d).find("option").each(function() {
                        this.selected = 0 <= f.inArray(f(this).val(), a)
                    });
                    a.length || (d.selectedIndex = -1);
                    return a
                }
            }
        },
        attrFn: {
            val: !0,
            css: !0,
            html: !0,
            text: !0,
            data: !0,
            width: !0,
            height: !0,
            offset: !0
        },
        attr: function(d, q, a, c) {
            var b, e, o = d.nodeType;
            if (d && 3 !== o && 8 !== o && 2 !== o) {
                if (c && q in f.attrFn) return f(d)[q](a);
                if ("undefined" == typeof d.getAttribute) return f.prop(d, q, a);
                (c = 1 !== o || !f.isXMLDoc(d)) && (q = q.toLowerCase(), e = f.attrHooks[q] || (Gb.test(q) ? Ib : wa));
                if (a !==
                    g) {
                    if (null === a) {
                        f.removeAttr(d, q);
                        return
                    }
                    if (e && "set" in e && c && (b = e.set(d, a, q)) !== g) return b;
                    d.setAttribute(q, "" + a);
                    return a
                }
                if (e && "get" in e && c && null !== (b = e.get(d, q))) return b;
                b = d.getAttribute(q);
                return null === b ? g : b
            }
        },
        removeAttr: function(d, q) {
            var a, c, b, e, o, g = 0;
            if (q && 1 === d.nodeType) {
                c = q.toLowerCase().split(Wa);
                for (e = c.length; g < e; g++)(b = c[g]) && (a = f.propFix[b] || b, o = Gb.test(b), o || f.attr(d, b, ""), d.removeAttribute(Hb ? b : a), o && a in d && (d[a] = !1))
            }
        },
        attrHooks: {
            type: {
                set: function(d, q) {
                    if (pc.test(d.nodeName) &&
                        d.parentNode) f.error("type property can't be changed");
                    else if (!f.support.radioValue && "radio" === q && f.nodeName(d, "input")) {
                        var a = d.value;
                        d.setAttribute("type", q);
                        a && (d.value = a);
                        return q
                    }
                }
            },
            value: {
                get: function(d, q) {
                    return wa && f.nodeName(d, "button") ? wa.get(d, q) : q in d ? d.value : null
                },
                set: function(d, q, a) {
                    if (wa && f.nodeName(d, "button")) return wa.set(d, q, a);
                    d.value = q
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
        prop: function(d, q, a) {
            var c, b, e;
            e = d.nodeType;
            if (d && 3 !== e && 8 !== e && 2 !== e) return (e = 1 !== e || !f.isXMLDoc(d)) && (q = f.propFix[q] || q, b = f.propHooks[q]), a !== g ? b && "set" in b && (c = b.set(d, a, q)) !== g ? c : d[q] = a : b && "get" in b && null !== (c = b.get(d, q)) ? c : d[q]
        },
        propHooks: {
            tabIndex: {
                get: function(d) {
                    var q = d.getAttributeNode("tabindex");
                    return q && q.specified ? parseInt(q.value, 10) : qc.test(d.nodeName) || rc.test(d.nodeName) &&
                        d.href ? 0 : g
                }
            }
        }
    });
    f.attrHooks.tabindex = f.propHooks.tabIndex;
    Ib = {
        get: function(d, q) {
            var a, c = f.prop(d, q);
            return !0 === c || "boolean" != typeof c && (a = d.getAttributeNode(q)) && !1 !== a.nodeValue ? q.toLowerCase() : g
        },
        set: function(d, q, a) {
            var c;
            !1 === q ? f.removeAttr(d, a) : (c = f.propFix[a] || a, c in d && (d[c] = !0), d.setAttribute(a, a.toLowerCase()));
            return a
        }
    };
    Hb || (Jb = {
        name: !0,
        id: !0,
        coords: !0
    }, wa = f.valHooks.button = {
        get: function(d, q) {
            var f;
            return (f = d.getAttributeNode(q)) && (Jb[q] ? "" !== f.nodeValue : f.specified) ? f.nodeValue : g
        },
        set: function(d,
            q, f) {
            var a = d.getAttributeNode(f);
            a || (a = K.createAttribute(f), d.setAttributeNode(a));
            return a.nodeValue = q + ""
        }
    }, f.attrHooks.tabindex.set = wa.set, f.each(["width", "height"], function(d, q) {
        f.attrHooks[q] = f.extend(f.attrHooks[q], {
            set: function(d, f) {
                if ("" === f) return d.setAttribute(q, "auto"), f
            }
        })
    }), f.attrHooks.contenteditable = {
        get: wa.get,
        set: function(d, q, f) {
            "" === q && (q = "false");
            wa.set(d, q, f)
        }
    });
    f.support.hrefNormalized || f.each(["href", "src", "width", "height"], function(d, q) {
        f.attrHooks[q] = f.extend(f.attrHooks[q], {
            get: function(d) {
                d = d.getAttribute(q, 2);
                return null === d ? g : d
            }
        })
    });
    f.support.style || (f.attrHooks.style = {
        get: function(d) {
            return d.style.cssText.toLowerCase() || g
        },
        set: function(d, q) {
            return d.style.cssText = "" + q
        }
    });
    f.support.optSelected || (f.propHooks.selected = f.extend(f.propHooks.selected, {
        get: function(d) {
            d = d.parentNode;
            d && (d.selectedIndex, d.parentNode && d.parentNode.selectedIndex);
            return null
        }
    }));
    f.support.enctype || (f.propFix.enctype = "encoding");
    f.support.checkOn || f.each(["radio", "checkbox"], function() {
        f.valHooks[this] = {
            get: function(d) {
                return null === d.getAttribute("value") ? "on" : d.value
            }
        }
    });
    f.each(["radio", "checkbox"], function() {
        f.valHooks[this] = f.extend(f.valHooks[this], {
            set: function(d, q) {
                if (f.isArray(q)) return d.checked = 0 <= f.inArray(f(d).val(), q)
            }
        })
    });
    var ob = /^(?:textarea|input|select)$/i,
        Kb = /^([^\.]*)?(?:\.(.+))?$/,
        sc = /(?:^|\s)hover(\.\S+)?\b/,
        tc = /^key/,
        uc = /^(?:mouse|contextmenu)|click/,
        Lb = /^(?:focusinfocus|focusoutblur)$/,
        vc = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
        wc = function(d) {
            (d = vc.exec(d)) && (d[1] = (d[1] ||
                "").toLowerCase(), d[3] = d[3] && RegExp("(?:^|\\s)" + d[3] + "(?:\\s|$)"));
            return d
        },
        Mb = function(d) {
            return f.event.special.hover ? d : d.replace(sc, "mouseenter$1 mouseleave$1")
        };
    f.event = {
        add: function(d, q, a, c, b) {
            var e, o, u, t, A, r, H, R, v;
            if (!(3 === d.nodeType || 8 === d.nodeType || !q || !a || !(e = f._data(d)))) {
                a.handler && (H = a, a = H.handler, b = H.selector);
                a.guid || (a.guid = f.guid++);
                (u = e.events) || (e.events = u = {});
                (o = e.handle) || (e.handle = o = function(d) {
                    return "undefined" != typeof f && (!d || f.event.triggered !== d.type) ? f.event.dispatch.apply(o.elem,
                        arguments) : g
                }, o.elem = d);
                q = f.trim(Mb(q)).split(" ");
                for (e = 0; e < q.length; e++) {
                    t = Kb.exec(q[e]) || [];
                    A = t[1];
                    r = (t[2] || "").split(".").sort();
                    v = f.event.special[A] || {};
                    A = (b ? v.delegateType : v.bindType) || A;
                    v = f.event.special[A] || {};
                    t = f.extend({
                        type: A,
                        origType: t[1],
                        data: c,
                        handler: a,
                        guid: a.guid,
                        selector: b,
                        quick: b && wc(b),
                        namespace: r.join(".")
                    }, H);
                    R = u[A];
                    if (!R && (R = u[A] = [], R.delegateCount = 0, !v.setup || !1 === v.setup.call(d, c, r, o))) d.addEventListener ? d.addEventListener(A, o, !1) : d.attachEvent && d.attachEvent("on" + A, o);
                    v.add &&
                        (v.add.call(d, t), t.handler.guid || (t.handler.guid = a.guid));
                    b ? R.splice(R.delegateCount++, 0, t) : R.push(t);
                    f.event.global[A] = !0
                }
                d = null
            }
        },
        global: {},
        remove: function(d, q, a, c, b) {
            var e = f.hasData(d) && f._data(d),
                o, g, u, t, A, r, H, R, v, p, D;
            if (e && (H = e.events)) {
                q = f.trim(Mb(q || "")).split(" ");
                for (o = 0; o < q.length; o++)
                    if (g = Kb.exec(q[o]) || [], u = t = g[1], g = g[2], u) {
                        R = f.event.special[u] || {};
                        u = (c ? R.delegateType : R.bindType) || u;
                        p = H[u] || [];
                        A = p.length;
                        g = g ? RegExp("(^|\\.)" + g.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                        for (r =
                            0; r < p.length; r++) D = p[r], (b || t === D.origType) && (!a || a.guid === D.guid) && (!g || g.test(D.namespace)) && (!c || c === D.selector || "**" === c && D.selector) && (p.splice(r--, 1), D.selector && p.delegateCount--, R.remove && R.remove.call(d, D));
                        0 === p.length && A !== p.length && ((!R.teardown || !1 === R.teardown.call(d, g)) && f.removeEvent(d, u, e.handle), delete H[u])
                    } else
                        for (u in H) f.event.remove(d, u + q[o], a, c, !0);
                f.isEmptyObject(H) && (v = e.handle, v && (v.elem = null), f.removeData(d, ["events", "handle"], !0))
            }
        },
        customEvent: {
            getData: !0,
            setData: !0,
            changeData: !0
        },
        trigger: function(d, q, a, c) {
            if (!a || 3 !== a.nodeType && 8 !== a.nodeType) {
                var e = d.type || d,
                    o = [],
                    u, t, A, r, H, R;
                if (!Lb.test(e + f.event.triggered) && (0 <= e.indexOf("!") && (e = e.slice(0, -1), u = !0), 0 <= e.indexOf(".") && (o = e.split("."), e = o.shift(), o.sort()), a && !f.event.customEvent[e] || f.event.global[e]))
                    if (d = "object" == typeof d ? d[f.expando] ? d : new f.Event(e, d) : new f.Event(e), d.type = e, d.isTrigger = !0, d.exclusive = u, d.namespace = o.join("."), d.namespace_re = d.namespace ? RegExp("(^|\\.)" + o.join("\\.(?:.*\\.)?") + "(\\.|$)") :
                        null, u = 0 > e.indexOf(":") ? "on" + e : "", a) {
                        if (d.result = g, d.target || (d.target = a), q = null != q ? f.makeArray(q) : [], q.unshift(d), r = f.event.special[e] || {}, !(r.trigger && !1 === r.trigger.apply(a, q))) {
                            R = [
                                [a, r.bindType || e]
                            ];
                            if (!c && !r.noBubble && !f.isWindow(a)) {
                                t = r.delegateType || e;
                                o = Lb.test(t + e) ? a : a.parentNode;
                                for (A = null; o; o = o.parentNode) R.push([o, t]), A = o;
                                A && A === a.ownerDocument && R.push([A.defaultView || A.parentWindow || b, t])
                            }
                            for (t = 0; t < R.length && !d.isPropagationStopped(); t++) o = R[t][0], d.type = R[t][1], (H = (f._data(o, "events") || {})[d.type] && f._data(o, "handle")) && H.apply(o, q), (H = u && o[u]) && f.acceptData(o) && !1 === H.apply(o, q) && d.preventDefault();
                            d.type = e;
                            !c && !d.isDefaultPrevented() && (!r._default || !1 === r._default.apply(a.ownerDocument, q)) && ("click" !== e || !f.nodeName(a, "a")) && f.acceptData(a) && u && a[e] && ("focus" !== e && "blur" !== e || 0 !== d.target.offsetWidth) && !f.isWindow(a) && (A = a[u], A && (a[u] = null), f.event.triggered = e, a[e](), f.event.triggered = g, A && (a[u] = A));
                            return d.result
                        }
                    } else
                        for (t in a = f.cache, a) a[t].events && a[t].events[e] && f.event.trigger(d,
                            q, a[t].handle.elem, !0)
            }
        },
        dispatch: function(d) {
            d = f.event.fix(d || b.event);
            var q = (f._data(this, "events") || {})[d.type] || [],
                a = q.delegateCount,
                c = [].slice.call(arguments, 0),
                e = !d.exclusive && !d.namespace,
                o = f.event.special[d.type] || {},
                u = [],
                t, A, r, H, R, v, p;
            c[0] = d;
            d.delegateTarget = this;
            if (!o.preDispatch || !1 !== o.preDispatch.call(this, d)) {
                if (a && (!d.button || "click" !== d.type)) {
                    r = f(this);
                    r.context = this.ownerDocument || this;
                    for (A = d.target; A != this; A = A.parentNode || this)
                        if (!0 !== A.disabled) {
                            R = {};
                            v = [];
                            r[0] = A;
                            for (t = 0; t < a; t++) {
                                H =
                                    q[t];
                                p = H.selector;
                                if (R[p] === g) {
                                    var D = R,
                                        Y = p,
                                        P;
                                    if (H.quick) {
                                        P = H.quick;
                                        var fa = A.attributes || {};
                                        P = (!P[1] || A.nodeName.toLowerCase() === P[1]) && (!P[2] || (fa.id || {}).value === P[2]) && (!P[3] || P[3].test((fa["class"] || {}).value))
                                    } else P = r.is(p);
                                    D[Y] = P
                                }
                                R[p] && v.push(H)
                            }
                            v.length && u.push({
                                elem: A,
                                matches: v
                            })
                        }
                }
                q.length > a && u.push({
                    elem: this,
                    matches: q.slice(a)
                });
                for (t = 0; t < u.length && !d.isPropagationStopped(); t++) {
                    a = u[t];
                    d.currentTarget = a.elem;
                    for (q = 0; q < a.matches.length && !d.isImmediatePropagationStopped(); q++)
                        if (H = a.matches[q],
                            e || !d.namespace && !H.namespace || d.namespace_re && d.namespace_re.test(H.namespace)) d.data = H.data, d.handleObj = H, H = ((f.event.special[H.origType] || {}).handle || H.handler).apply(a.elem, c), H !== g && (d.result = H, !1 === H && (d.preventDefault(), d.stopPropagation()))
                }
                o.postDispatch && o.postDispatch.call(this, d);
                return d.result
            }
        },
        props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: ["char", "charCode", "key", "keyCode"],
            filter: function(d, q) {
                null == d.which && (d.which = null != q.charCode ? q.charCode : q.keyCode);
                return d
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(d, q) {
                var f, a, c, b = q.button,
                    e = q.fromElement;
                null == d.pageX && null != q.clientX && (f = d.target.ownerDocument || K, a = f.documentElement, c = f.body, d.pageX = q.clientX + (a && a.scrollLeft || c && c.scrollLeft || 0) - (a && a.clientLeft || c && c.clientLeft ||
                    0), d.pageY = q.clientY + (a && a.scrollTop || c && c.scrollTop || 0) - (a && a.clientTop || c && c.clientTop || 0));
                !d.relatedTarget && e && (d.relatedTarget = e === d.target ? q.toElement : e);
                !d.which && b !== g && (d.which = b & 1 ? 1 : b & 2 ? 3 : b & 4 ? 2 : 0);
                return d
            }
        },
        fix: function(d) {
            if (d[f.expando]) return d;
            var q, a, c = d,
                b = f.event.fixHooks[d.type] || {},
                e = b.props ? this.props.concat(b.props) : this.props;
            d = f.Event(c);
            for (q = e.length; q;) a = e[--q], d[a] = c[a];
            d.target || (d.target = c.srcElement || K);
            3 === d.target.nodeType && (d.target = d.target.parentNode);
            d.metaKey ===
                g && (d.metaKey = d.ctrlKey);
            return b.filter ? b.filter(d, c) : d
        },
        special: {
            ready: {
                setup: f.bindReady
            },
            load: {
                noBubble: !0
            },
            focus: {
                delegateType: "focusin"
            },
            blur: {
                delegateType: "focusout"
            },
            beforeunload: {
                setup: function(d, q, a) {
                    f.isWindow(this) && (this.onbeforeunload = a)
                },
                teardown: function(d, q) {
                    this.onbeforeunload === q && (this.onbeforeunload = null)
                }
            }
        },
        simulate: function(d, q, a, c) {
            d = f.extend(new f.Event, a, {
                type: d,
                isSimulated: !0,
                originalEvent: {}
            });
            c ? f.event.trigger(d, null, q) : f.event.dispatch.call(q, d);
            d.isDefaultPrevented() &&
                a.preventDefault()
        }
    };
    f.event.handle = f.event.dispatch;
    f.removeEvent = K.removeEventListener ? function(d, q, f) {
        d.removeEventListener && d.removeEventListener(q, f, !1)
    } : function(d, q, f) {
        d.detachEvent && d.detachEvent("on" + q, f)
    };
    f.Event = function(d, q) {
        if (!(this instanceof f.Event)) return new f.Event(d, q);
        d && d.type ? (this.originalEvent = d, this.type = d.type, this.isDefaultPrevented = d.defaultPrevented || !1 === d.returnValue || d.getPreventDefault && d.getPreventDefault() ? D : F) : this.type = d;
        q && f.extend(this, q);
        this.timeStamp = d &&
            d.timeStamp || f.now();
        this[f.expando] = !0
    };
    f.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = D;
            var d = this.originalEvent;
            !d || (d.preventDefault ? d.preventDefault() : d.returnValue = !1)
        },
        stopPropagation: function() {
            this.isPropagationStopped = D;
            var d = this.originalEvent;
            !d || (d.stopPropagation && d.stopPropagation(), d.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = D;
            this.stopPropagation()
        },
        isDefaultPrevented: F,
        isPropagationStopped: F,
        isImmediatePropagationStopped: F
    };
    f.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(d, q) {
        f.event.special[d] = {
            delegateType: q,
            bindType: q,
            handle: function(d) {
                var a = d.relatedTarget,
                    c = d.handleObj,
                    b;
                if (!a || a !== this && !f.contains(this, a)) d.type = c.origType, b = c.handler.apply(this, arguments), d.type = q;
                return b
            }
        }
    });
    f.support.submitBubbles || (f.event.special.submit = {
        setup: function() {
            if (f.nodeName(this, "form")) return !1;
            f.event.add(this, "click._submit keypress._submit", function(d) {
                d = d.target;
                (d = f.nodeName(d, "input") || f.nodeName(d, "button") ?
                    d.form : g) && !d._submit_attached && (f.event.add(d, "submit._submit", function(d) {
                    d._submit_bubble = !0
                }), d._submit_attached = !0)
            })
        },
        postDispatch: function(d) {
            d._submit_bubble && (delete d._submit_bubble, this.parentNode && !d.isTrigger && f.event.simulate("submit", this.parentNode, d, !0))
        },
        teardown: function() {
            if (f.nodeName(this, "form")) return !1;
            f.event.remove(this, "._submit")
        }
    });
    f.support.changeBubbles || (f.event.special.change = {
        setup: function() {
            if (ob.test(this.nodeName)) {
                if ("checkbox" === this.type || "radio" === this.type) f.event.add(this,
                    "propertychange._change",
                    function(d) {
                        "checked" === d.originalEvent.propertyName && (this._just_changed = !0)
                    }), f.event.add(this, "click._change", function(d) {
                    this._just_changed && !d.isTrigger && (this._just_changed = !1, f.event.simulate("change", this, d, !0))
                });
                return !1
            }
            f.event.add(this, "beforeactivate._change", function(d) {
                d = d.target;
                ob.test(d.nodeName) && !d._change_attached && (f.event.add(d, "change._change", function(d) {
                        this.parentNode && !d.isSimulated && !d.isTrigger && f.event.simulate("change", this.parentNode, d, !0)
                    }),
                    d._change_attached = !0)
            })
        },
        handle: function(d) {
            var q = d.target;
            if (this !== q || d.isSimulated || d.isTrigger || "radio" !== q.type && "checkbox" !== q.type) return d.handleObj.handler.apply(this, arguments)
        },
        teardown: function() {
            f.event.remove(this, "._change");
            return ob.test(this.nodeName)
        }
    });
    f.support.focusinBubbles || f.each({
        focus: "focusin",
        blur: "focusout"
    }, function(d, q) {
        var a = 0,
            c = function(d) {
                f.event.simulate(q, d.target, f.event.fix(d), !0)
            };
        f.event.special[q] = {
            setup: function() {
                0 === a++ && K.addEventListener(d, c, !0)
            },
            teardown: function() {
                0 ===
                    --a && K.removeEventListener(d, c, !0)
            }
        }
    });
    f.fn.extend({
        on: function(d, q, a, c, b) {
            var e, o;
            if ("object" == typeof d) {
                "string" != typeof q && (a = a || q, q = g);
                for (o in d) this.on(o, q, a, d[o], b);
                return this
            }
            null == a && null == c ? (c = q, a = q = g) : null == c && ("string" == typeof q ? (c = a, a = g) : (c = a, a = q, q = g));
            if (!1 === c) c = F;
            else if (!c) return this;
            1 === b && (e = c, c = function(d) {
                f().off(d);
                return e.apply(this, arguments)
            }, c.guid = e.guid || (e.guid = f.guid++));
            return this.each(function() {
                f.event.add(this, d, c, a, q)
            })
        },
        one: function(d, q, a, f) {
            return this.on(d,
                q, a, f, 1)
        },
        off: function(d, q, a) {
            if (d && d.preventDefault && d.handleObj) {
                var c = d.handleObj;
                f(d.delegateTarget).off(c.namespace ? c.origType + "." + c.namespace : c.origType, c.selector, c.handler);
                return this
            }
            if ("object" == typeof d) {
                for (c in d) this.off(c, q, d[c]);
                return this
            }
            if (!1 === q || "function" == typeof q) a = q, q = g;
            !1 === a && (a = F);
            return this.each(function() {
                f.event.remove(this, d, a, q)
            })
        },
        bind: function(d, q, a) {
            return this.on(d, null, q, a)
        },
        unbind: function(d, q) {
            return this.off(d, null, q)
        },
        live: function(d, q, a) {
            f(this.context).on(d,
                this.selector, q, a);
            return this
        },
        die: function(d, q) {
            f(this.context).off(d, this.selector || "**", q);
            return this
        },
        delegate: function(d, q, a, f) {
            return this.on(q, d, a, f)
        },
        undelegate: function(d, q, a) {
            return 1 == arguments.length ? this.off(d, "**") : this.off(q, d, a)
        },
        trigger: function(d, q) {
            return this.each(function() {
                f.event.trigger(d, q, this)
            })
        },
        triggerHandler: function(d, q) {
            if (this[0]) return f.event.trigger(d, q, this[0], !0)
        },
        toggle: function(d) {
            var q = arguments,
                a = d.guid || f.guid++,
                c = 0,
                b = function(a) {
                    var b = (f._data(this, "lastToggle" +
                        d.guid) || 0) % c;
                    f._data(this, "lastToggle" + d.guid, b + 1);
                    a.preventDefault();
                    return q[b].apply(this, arguments) || !1
                };
            for (b.guid = a; c < q.length;) q[c++].guid = a;
            return this.click(b)
        },
        hover: function(d, q) {
            return this.mouseenter(d).mouseleave(q || d)
        }
    });
    f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(d, q) {
        f.fn[q] = function(d, a) {
            null == a &&
                (a = d, d = null);
            return 0 < arguments.length ? this.on(q, null, d, a) : this.trigger(q)
        };
        f.attrFn && (f.attrFn[q] = !0);
        tc.test(q) && (f.event.fixHooks[q] = f.event.keyHooks);
        uc.test(q) && (f.event.fixHooks[q] = f.event.mouseHooks)
    });
    var Nb = function(d, q, a, f, c, b) {
            c = 0;
            for (var e = f.length; c < e; c++) {
                var o = f[c];
                if (o) {
                    for (var g = !1, o = o[d]; o;) {
                        if (o[Ga] === a) {
                            g = f[o.sizset];
                            break
                        }
                        if (1 === o.nodeType)
                            if (b || (o[Ga] = a, o.sizset = c), "string" != typeof q) {
                                if (o === q) {
                                    g = !0;
                                    break
                                }
                            } else if (0 < V.filter(q, [o]).length) {
                            g = o;
                            break
                        }
                        o = o[d]
                    }
                    f[c] = g
                }
            }
        },
        Ob = function(d,
            q, a, f, c, b) {
            c = 0;
            for (var e = f.length; c < e; c++) {
                var o = f[c];
                if (o) {
                    for (var g = !1, o = o[d]; o;) {
                        if (o[Ga] === a) {
                            g = f[o.sizset];
                            break
                        }
                        1 === o.nodeType && !b && (o[Ga] = a, o.sizset = c);
                        if (o.nodeName.toLowerCase() === q) {
                            g = o;
                            break
                        }
                        o = o[d]
                    }
                    f[c] = g
                }
            }
        },
        pb = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
        Ga = "sizcache" + (Math.random() + "").replace(".", ""),
        qb = 0,
        Pb = Object.prototype.toString,
        Xa = !1,
        Qb = !0,
        Ha = /\\/g,
        xc = /\r\n/g,
        Ya = /\W/;
    [0, 0].sort(function() {
        Qb = !1;
        return 0
    });
    var V = function(d, q, a, f) {
        a = a || [];
        var c = q = q || K;
        if (1 !== q.nodeType && 9 !== q.nodeType) return [];
        if (!d || "string" != typeof d) return a;
        var b, e, o, g, u, t, A = !0,
            r = V.isXML(q),
            H = [],
            R = d;
        do
            if (pb.exec(""), b = pb.exec(R))
                if (R = b[3], H.push(b[1]), b[2]) {
                    g = b[3];
                    break
                }
        while (b);
        if (1 < H.length && Rb.exec(d))
            if (2 === H.length && X.relative[H[0]]) e = Sb(H[0] + H[1], q, f);
            else
                for (e = X.relative[H[0]] ? [q] : V(H.shift(), q); H.length;) d = H.shift(), X.relative[d] && (d += H.shift()), e = Sb(d, e, f);
        else if (!f && 1 < H.length && 9 === q.nodeType && !r && X.match.ID.test(H[0]) &&
            !X.match.ID.test(H[H.length - 1]) && (u = V.find(H.shift(), q, r), q = u.expr ? V.filter(u.expr, u.set)[0] : u.set[0]), q) {
            u = f ? {
                expr: H.pop(),
                set: ua(f)
            } : V.find(H.pop(), 1 === H.length && ("~" === H[0] || "+" === H[0]) && q.parentNode ? q.parentNode : q, r);
            e = u.expr ? V.filter(u.expr, u.set) : u.set;
            for (0 < H.length ? o = ua(e) : A = !1; H.length;) b = t = H.pop(), X.relative[t] ? b = H.pop() : t = "", null == b && (b = q), X.relative[t](o, b, r)
        } else o = [];
        o || (o = e);
        o || V.error(t || d);
        if ("[object Array]" === Pb.call(o))
            if (A)
                if (q && 1 === q.nodeType)
                    for (d = 0; null != o[d]; d++) o[d] && (!0 ===
                        o[d] || 1 === o[d].nodeType && V.contains(q, o[d])) && a.push(e[d]);
                else
                    for (d = 0; null != o[d]; d++) o[d] && 1 === o[d].nodeType && a.push(e[d]);
        else a.push.apply(a, o);
        else ua(o, a);
        g && (V(g, c, a, f), V.uniqueSort(a));
        return a
    };
    V.uniqueSort = function(d) {
        if (Za && (Xa = Qb, d.sort(Za), Xa))
            for (var q = 1; q < d.length; q++) d[q] === d[q - 1] && d.splice(q--, 1);
        return d
    };
    V.matches = function(d, q) {
        return V(d, null, null, q)
    };
    V.matchesSelector = function(d, q) {
        return 0 < V(q, null, null, [d]).length
    };
    V.find = function(d, q, a) {
        var f, c, b, o, e, g;
        if (!d) return [];
        c = 0;
        for (b =
            X.order.length; c < b; c++)
            if (e = X.order[c], o = X.leftMatch[e].exec(d))
                if (g = o[1], o.splice(1, 1), "\\" !== g.substr(g.length - 1) && (o[1] = (o[1] || "").replace(Ha, ""), f = X.find[e](o, q, a), null != f)) {
                    d = d.replace(X.match[e], "");
                    break
                }
        f || (f = "undefined" != typeof q.getElementsByTagName ? q.getElementsByTagName("*") : []);
        return {
            set: f,
            expr: d
        }
    };
    V.filter = function(d, q, a, f) {
        for (var c, b, o, e, u, t, A, H, r = d, R = [], v = q, p = q && q[0] && V.isXML(q[0]); d && q.length;) {
            for (o in X.filter)
                if (null != (c = X.leftMatch[o].exec(d)) && c[2])
                    if (t = X.filter[o], u = c[1],
                        b = !1, c.splice(1, 1), "\\" !== u.substr(u.length - 1)) {
                        v === R && (R = []);
                        if (X.preFilter[o])
                            if (c = X.preFilter[o](c, v, a, R, f, p)) {
                                if (!0 === c) continue
                            } else b = e = !0;
                        if (c)
                            for (A = 0; null != (u = v[A]); A++) u && (e = t(u, c, A, v), H = f ^ e, a && null != e ? H ? b = !0 : v[A] = !1 : H && (R.push(u), b = !0));
                        if (e !== g) {
                            a || (v = R);
                            d = d.replace(X.match[o], "");
                            if (!b) return [];
                            break
                        }
                    }
            if (d === r)
                if (null == b) V.error(d);
                else break;
            r = d
        }
        return v
    };
    V.error = function(d) {
        throw Error("Syntax error, unrecognized expression: " + d);
    };
    var rb = V.getText = function(d) {
            var q, a;
            q = d.nodeType;
            var f =
                "";
            if (q)
                if (1 === q || 9 === q || 11 === q) {
                    if ("string" == typeof d.textContent) return d.textContent;
                    if ("string" == typeof d.innerText) return d.innerText.replace(xc, "");
                    for (d = d.firstChild; d; d = d.nextSibling) f += rb(d)
                } else {
                    if (3 === q || 4 === q) return d.nodeValue
                }
            else
                for (q = 0; a = d[q]; q++) 8 !== a.nodeType && (f += rb(a));
            return f
        },
        X = V.selectors = {
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
                href: function(d) {
                    return d.getAttribute("href")
                },
                type: function(d) {
                    return d.getAttribute("type")
                }
            },
            relative: {
                "+": function(d, q) {
                    var a =
                        "string" == typeof q,
                        f = a && !Ya.test(q),
                        a = a && !f;
                    f && (q = q.toLowerCase());
                    for (var f = 0, c = d.length, b; f < c; f++)
                        if (b = d[f]) {
                            for (;
                                (b = b.previousSibling) && 1 !== b.nodeType;);
                            d[f] = a || b && b.nodeName.toLowerCase() === q ? b || !1 : b === q
                        }
                    a && V.filter(q, d, !0)
                },
                "\x3e": function(d, q) {
                    var a, f = "string" == typeof q,
                        c = 0,
                        b = d.length;
                    if (f && !Ya.test(q))
                        for (q = q.toLowerCase(); c < b; c++) {
                            if (a = d[c]) a = a.parentNode, d[c] = a.nodeName.toLowerCase() === q ? a : !1
                        } else {
                            for (; c < b; c++)(a = d[c]) && (d[c] = f ? a.parentNode : a.parentNode === q);
                            f && V.filter(q, d, !0)
                        }
                },
                "": function(d,
                    q, a) {
                    var f, c = qb++,
                        b = Nb;
                    "string" == typeof q && !Ya.test(q) && (q = q.toLowerCase(), f = q, b = Ob);
                    b("parentNode", q, c, d, f, a)
                },
                "~": function(d, q, a) {
                    var f, c = qb++,
                        b = Nb;
                    "string" == typeof q && !Ya.test(q) && (q = q.toLowerCase(), f = q, b = Ob);
                    b("previousSibling", q, c, d, f, a)
                }
            },
            find: {
                ID: function(d, q, a) {
                    if ("undefined" != typeof q.getElementById && !a) return (d = q.getElementById(d[1])) && d.parentNode ? [d] : []
                },
                NAME: function(d, q) {
                    if ("undefined" != typeof q.getElementsByName) {
                        for (var a = [], f = q.getElementsByName(d[1]), c = 0, b = f.length; c < b; c++) f[c].getAttribute("name") ===
                            d[1] && a.push(f[c]);
                        return 0 === a.length ? null : a
                    }
                },
                TAG: function(d, q) {
                    if ("undefined" != typeof q.getElementsByTagName) return q.getElementsByTagName(d[1])
                }
            },
            preFilter: {
                CLASS: function(d, q, a, f, c, b) {
                    d = " " + d[1].replace(Ha, "") + " ";
                    if (b) return d;
                    b = 0;
                    for (var o; null != (o = q[b]); b++) o && (c ^ (o.className && 0 <= (" " + o.className + " ").replace(/[\t\n\r]/g, " ").indexOf(d)) ? a || f.push(o) : a && (q[b] = !1));
                    return !1
                },
                ID: function(d) {
                    return d[1].replace(Ha, "")
                },
                TAG: function(d) {
                    return d[1].replace(Ha, "").toLowerCase()
                },
                CHILD: function(d) {
                    if ("nth" ===
                        d[1]) {
                        d[2] || V.error(d[0]);
                        d[2] = d[2].replace(/^\+|\s*/g, "");
                        var q = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec("even" === d[2] && "2n" || "odd" === d[2] && "2n+1" || !/\D/.test(d[2]) && "0n+" + d[2] || d[2]);
                        d[2] = q[1] + (q[2] || 1) - 0;
                        d[3] = q[3] - 0
                    } else d[2] && V.error(d[0]);
                    d[0] = qb++;
                    return d
                },
                ATTR: function(d, q, a, f, c, b) {
                    q = d[1] = d[1].replace(Ha, "");
                    !b && X.attrMap[q] && (d[1] = X.attrMap[q]);
                    d[4] = (d[4] || d[5] || "").replace(Ha, "");
                    "~\x3d" === d[2] && (d[4] = " " + d[4] + " ");
                    return d
                },
                PSEUDO: function(d, q, a, f, c) {
                    if ("not" === d[1])
                        if (1 < (pb.exec(d[3]) || "").length ||
                            /^\w/.test(d[3])) d[3] = V(d[3], null, null, q);
                        else return d = V.filter(d[3], q, a, 1 ^ c), a || f.push.apply(f, d), !1;
                    else if (X.match.POS.test(d[0]) || X.match.CHILD.test(d[0])) return !0;
                    return d
                },
                POS: function(d) {
                    d.unshift(!0);
                    return d
                }
            },
            filters: {
                enabled: function(d) {
                    return !1 === d.disabled && "hidden" !== d.type
                },
                disabled: function(d) {
                    return !0 === d.disabled
                },
                checked: function(d) {
                    return !0 === d.checked
                },
                selected: function(d) {
                    d.parentNode && d.parentNode.selectedIndex;
                    return !0 === d.selected
                },
                parent: function(d) {
                    return !!d.firstChild
                },
                empty: function(d) {
                    return !d.firstChild
                },
                has: function(d, q, a) {
                    return !!V(a[3], d).length
                },
                header: function(d) {
                    return /h\d/i.test(d.nodeName)
                },
                text: function(d) {
                    var q = d.getAttribute("type"),
                        a = d.type;
                    return "input" === d.nodeName.toLowerCase() && "text" === a && (q === a || null === q)
                },
                radio: function(d) {
                    return "input" === d.nodeName.toLowerCase() && "radio" === d.type
                },
                checkbox: function(d) {
                    return "input" === d.nodeName.toLowerCase() && "checkbox" === d.type
                },
                file: function(d) {
                    return "input" === d.nodeName.toLowerCase() && "file" === d.type
                },
                password: function(d) {
                    return "input" === d.nodeName.toLowerCase() && "password" === d.type
                },
                submit: function(d) {
                    var q = d.nodeName.toLowerCase();
                    return ("input" === q || "button" === q) && "submit" === d.type
                },
                image: function(d) {
                    return "input" === d.nodeName.toLowerCase() && "image" === d.type
                },
                reset: function(d) {
                    var q = d.nodeName.toLowerCase();
                    return ("input" === q || "button" === q) && "reset" === d.type
                },
                button: function(d) {
                    var q = d.nodeName.toLowerCase();
                    return "input" === q && "button" === d.type || "button" === q
                },
                input: function(d) {
                    return /input|select|textarea|button/i.test(d.nodeName)
                },
                focus: function(d) {
                    return d === d.ownerDocument.activeElement
                }
            },
            setFilters: {
                first: function(d, q) {
                    return 0 === q
                },
                last: function(d, q, a, f) {
                    return q === f.length - 1
                },
                even: function(d, q) {
                    return 0 === q % 2
                },
                odd: function(d, q) {
                    return 1 === q % 2
                },
                lt: function(d, q, a) {
                    return q < a[3] - 0
                },
                gt: function(d, q, a) {
                    return q > a[3] - 0
                },
                nth: function(d, q, a) {
                    return a[3] - 0 === q
                },
                eq: function(d, q, a) {
                    return a[3] - 0 === q
                }
            },
            filter: {
                PSEUDO: function(d, q, a, f) {
                    var c = q[1],
                        b = X.filters[c];
                    if (b) return b(d, a, q, f);
                    if ("contains" === c) return 0 <= (d.textContent || d.innerText ||
                        rb([d]) || "").indexOf(q[3]);
                    if ("not" === c) {
                        q = q[3];
                        a = 0;
                        for (f = q.length; a < f; a++)
                            if (q[a] === d) return !1;
                        return !0
                    }
                    V.error(c)
                },
                CHILD: function(d, q) {
                    var a, f, c, b, o, e;
                    a = q[1];
                    e = d;
                    switch (a) {
                        case "only":
                        case "first":
                            for (; e = e.previousSibling;)
                                if (1 === e.nodeType) return !1;
                            if ("first" === a) return !0;
                            e = d;
                        case "last":
                            for (; e = e.nextSibling;)
                                if (1 === e.nodeType) return !1;
                            return !0;
                        case "nth":
                            a = q[2];
                            f = q[3];
                            if (1 === a && 0 === f) return !0;
                            c = q[0];
                            if ((b = d.parentNode) && (b[Ga] !== c || !d.nodeIndex)) {
                                o = 0;
                                for (e = b.firstChild; e; e = e.nextSibling) 1 === e.nodeType &&
                                    (e.nodeIndex = ++o);
                                b[Ga] = c
                            }
                            e = d.nodeIndex - f;
                            return 0 === a ? 0 === e : 0 === e % a && 0 <= e / a
                    }
                },
                ID: function(d, q) {
                    return 1 === d.nodeType && d.getAttribute("id") === q
                },
                TAG: function(d, q) {
                    return "*" === q && 1 === d.nodeType || !!d.nodeName && d.nodeName.toLowerCase() === q
                },
                CLASS: function(d, q) {
                    return -1 < (" " + (d.className || d.getAttribute("class")) + " ").indexOf(q)
                },
                ATTR: function(d, q) {
                    var a = q[1],
                        a = V.attr ? V.attr(d, a) : X.attrHandle[a] ? X.attrHandle[a](d) : null != d[a] ? d[a] : d.getAttribute(a),
                        f = a + "",
                        c = q[2],
                        b = q[4];
                    return null == a ? "!\x3d" === c : !c && V.attr ?
                        null != a : "\x3d" === c ? f === b : "*\x3d" === c ? 0 <= f.indexOf(b) : "~\x3d" === c ? 0 <= (" " + f + " ").indexOf(b) : b ? "!\x3d" === c ? f !== b : "^\x3d" === c ? 0 === f.indexOf(b) : "$\x3d" === c ? f.substr(f.length - b.length) === b : "|\x3d" === c ? f === b || f.substr(0, b.length + 1) === b + "-" : !1 : f && !1 !== a
                },
                POS: function(d, q, a, f) {
                    var c = X.setFilters[q[2]];
                    if (c) return c(d, a, q, f)
                }
            }
        },
        Rb = X.match.POS,
        yc = function(d, q) {
            return "\\" + (q - 0 + 1)
        },
        Na;
    for (Na in X.match) X.match[Na] = RegExp(X.match[Na].source + /(?![^\[]*\])(?![^\(]*\))/.source), X.leftMatch[Na] = RegExp(/(^(?:.|\r|\n)*?)/.source +
        X.match[Na].source.replace(/\\(\d+)/g, yc));
    X.match.globalPOS = Rb;
    var ua = function(d, q) {
        d = Array.prototype.slice.call(d, 0);
        return q ? (q.push.apply(q, d), q) : d
    };
    try {
        Array.prototype.slice.call(K.documentElement.childNodes, 0)[0].nodeType
    } catch (fd) {
        ua = function(d, q) {
            var a = 0,
                f = q || [];
            if ("[object Array]" === Pb.call(d)) Array.prototype.push.apply(f, d);
            else if ("number" == typeof d.length)
                for (var c = d.length; a < c; a++) f.push(d[a]);
            else
                for (; d[a]; a++) f.push(d[a]);
            return f
        }
    }
    var Za, Oa;
    K.documentElement.compareDocumentPosition ?
        Za = function(d, q) {
            return d === q ? (Xa = !0, 0) : !d.compareDocumentPosition || !q.compareDocumentPosition ? d.compareDocumentPosition ? -1 : 1 : d.compareDocumentPosition(q) & 4 ? -1 : 1
        } : (Za = function(d, q) {
            if (d === q) return Xa = !0, 0;
            if (d.sourceIndex && q.sourceIndex) return d.sourceIndex - q.sourceIndex;
            var a, f, c = [],
                b = [];
            a = d.parentNode;
            f = q.parentNode;
            var e = a;
            if (a === f) return Oa(d, q);
            if (!a) return -1;
            if (!f) return 1;
            for (; e;) c.unshift(e), e = e.parentNode;
            for (e = f; e;) b.unshift(e), e = e.parentNode;
            a = c.length;
            f = b.length;
            for (e = 0; e < a && e < f; e++)
                if (c[e] !==
                    b[e]) return Oa(c[e], b[e]);
            return e === a ? Oa(d, b[e], -1) : Oa(c[e], q, 1)
        }, Oa = function(d, q, a) {
            if (d === q) return a;
            for (d = d.nextSibling; d;) {
                if (d === q) return -1;
                d = d.nextSibling
            }
            return 1
        });
    var $a = K.createElement("div"),
        Tb = "script" + (new Date).getTime(),
        ab = K.documentElement;
    $a.innerHTML = "\x3ca name\x3d'" + Tb + "'/\x3e";
    ab.insertBefore($a, ab.firstChild);
    K.getElementById(Tb) && (X.find.ID = function(d, q, a) {
        if ("undefined" != typeof q.getElementById && !a) return (q = q.getElementById(d[1])) ? q.id === d[1] || "undefined" != typeof q.getAttributeNode &&
            q.getAttributeNode("id").nodeValue === d[1] ? [q] : g : []
    }, X.filter.ID = function(d, q) {
        var a = "undefined" != typeof d.getAttributeNode && d.getAttributeNode("id");
        return 1 === d.nodeType && a && a.nodeValue === q
    });
    ab.removeChild($a);
    var ab = $a = null,
        Aa = K.createElement("div");
    Aa.appendChild(K.createComment(""));
    0 < Aa.getElementsByTagName("*").length && (X.find.TAG = function(d, q) {
        var a = q.getElementsByTagName(d[1]);
        if ("*" === d[1]) {
            for (var f = [], c = 0; a[c]; c++) 1 === a[c].nodeType && f.push(a[c]);
            a = f
        }
        return a
    });
    Aa.innerHTML = "\x3ca href\x3d'#'\x3e\x3c/a\x3e";
    Aa.firstChild && "undefined" != typeof Aa.firstChild.getAttribute && "#" !== Aa.firstChild.getAttribute("href") && (X.attrHandle.href = function(d) {
        return d.getAttribute("href", 2)
    });
    Aa = null;
    if (K.querySelectorAll) {
        var sb = V,
            bb = K.createElement("div");
        bb.innerHTML = "\x3cp class\x3d'TEST'\x3e\x3c/p\x3e";
        if (!bb.querySelectorAll || 0 !== bb.querySelectorAll(".TEST").length) {
            var V = function(d, q, a, f) {
                    q = q || K;
                    if (!f && !V.isXML(q)) {
                        var c = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(d);
                        if (c && (1 === q.nodeType || 9 === q.nodeType)) {
                            if (c[1]) return ua(q.getElementsByTagName(d),
                                a);
                            if (c[2] && X.find.CLASS && q.getElementsByClassName) return ua(q.getElementsByClassName(c[2]), a)
                        }
                        if (9 === q.nodeType) {
                            if ("body" === d && q.body) return ua([q.body], a);
                            if (c && c[3]) {
                                var b = q.getElementById(c[3]);
                                if (!b || !b.parentNode) return ua([], a);
                                if (b.id === c[3]) return ua([b], a)
                            }
                            try {
                                return ua(q.querySelectorAll(d), a)
                            } catch (e) {}
                        } else if (1 === q.nodeType && "object" !== q.nodeName.toLowerCase()) {
                            var c = q,
                                o = (b = q.getAttribute("id")) || "__sizzle__",
                                g = q.parentNode,
                                u = /^\s*[+~]/.test(d);
                            b ? o = o.replace(/'/g, "\\$\x26") : q.setAttribute("id",
                                o);
                            u && g && (q = q.parentNode);
                            try {
                                if (!u || g) return ua(q.querySelectorAll("[id\x3d'" + o + "'] " + d), a)
                            } catch (t) {} finally {
                                b || c.removeAttribute("id")
                            }
                        }
                    }
                    return sb(d, q, a, f)
                },
                tb;
            for (tb in sb) V[tb] = sb[tb];
            bb = null
        }
    }
    var cb = K.documentElement,
        db = cb.matchesSelector || cb.mozMatchesSelector || cb.webkitMatchesSelector || cb.msMatchesSelector;
    if (db) {
        var zc = !db.call(K.createElement("div"), "div"),
            Ub = !1;
        try {
            db.call(K.documentElement, "[test!\x3d'']:sizzle")
        } catch (gd) {
            Ub = !0
        }
        V.matchesSelector = function(d, q) {
            q = q.replace(/\=\s*([^'"\]]*)\s*\]/g,
                "\x3d'$1']");
            if (!V.isXML(d)) try {
                if (Ub || !X.match.PSEUDO.test(q) && !/!=/.test(q)) {
                    var a = db.call(d, q);
                    if (a || !zc || d.document && 11 !== d.document.nodeType) return a
                }
            } catch (f) {}
            return 0 < V(q, null, null, [d]).length
        }
    }
    var Ia = K.createElement("div");
    Ia.innerHTML = "\x3cdiv class\x3d'test e'\x3e\x3c/div\x3e\x3cdiv class\x3d'test'\x3e\x3c/div\x3e";
    Ia.getElementsByClassName && 0 !== Ia.getElementsByClassName("e").length && (Ia.lastChild.className = "e", 1 !== Ia.getElementsByClassName("e").length && (X.order.splice(1, 0, "CLASS"), X.find.CLASS =
        function(d, a, f) {
            if ("undefined" != typeof a.getElementsByClassName && !f) return a.getElementsByClassName(d[1])
        }, Ia = null));
    K.documentElement.contains ? V.contains = function(d, a) {
        return d !== a && (d.contains ? d.contains(a) : !0)
    } : K.documentElement.compareDocumentPosition ? V.contains = function(d, a) {
        return !!(d.compareDocumentPosition(a) & 16)
    } : V.contains = function() {
        return !1
    };
    V.isXML = function(d) {
        return (d = (d ? d.ownerDocument || d : 0).documentElement) ? "HTML" !== d.nodeName : !1
    };
    var Sb = function(d, a, f) {
        var c, b = [],
            e = "";
        for (a = a.nodeType ? [a] : a; c = X.match.PSEUDO.exec(d);) e += c[0], d = d.replace(X.match.PSEUDO, "");
        d = X.relative[d] ? d + "*" : d;
        c = 0;
        for (var o = a.length; c < o; c++) V(d, a[c], b, f);
        return V.filter(e, b)
    };
    V.attr = f.attr;
    V.selectors.attrMap = {};
    f.find = V;
    f.expr = V.selectors;
    f.expr[":"] = f.expr.filters;
    f.unique = V.uniqueSort;
    f.text = V.getText;
    f.isXMLDoc = V.isXML;
    f.contains = V.contains;
    var Ac = /Until$/,
        Bc = /^(?:parents|prevUntil|prevAll)/,
        Cc = /,/,
        kc = /^.[^:#\[\.,]*$/,
        Dc = Array.prototype.slice,
        Vb = f.expr.match.globalPOS,
        Ec = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    f.fn.extend({
        find: function(d) {
            var a = this,
                c, b;
            if ("string" != typeof d) return f(d).filter(function() {
                c = 0;
                for (b = a.length; c < b; c++)
                    if (f.contains(a[c], this)) return !0
            });
            var e = this.pushStack("", "find", d),
                o, g, u;
            c = 0;
            for (b = this.length; c < b; c++)
                if (o = e.length, f.find(d, this[c], e), 0 < c)
                    for (g = o; g < e.length; g++)
                        for (u = 0; u < o; u++)
                            if (e[u] === e[g]) {
                                e.splice(g--, 1);
                                break
                            }
            return e
        },
        has: function(d) {
            var a = f(d);
            return this.filter(function() {
                for (var d = 0, c = a.length; d < c; d++)
                    if (f.contains(this, a[d])) return !0
            })
        },
        not: function(d) {
            return this.pushStack(P(this,
                d, !1), "not", d)
        },
        filter: function(d) {
            return this.pushStack(P(this, d, !0), "filter", d)
        },
        is: function(d) {
            return !!d && ("string" == typeof d ? Vb.test(d) ? 0 <= f(d, this.context).index(this[0]) : 0 < f.filter(d, this).length : 0 < this.filter(d).length)
        },
        closest: function(d, a) {
            var c = [],
                b, e, o = this[0];
            if (f.isArray(d)) {
                for (e = 1; o && o.ownerDocument && o !== a;) {
                    for (b = 0; b < d.length; b++) f(o).is(d[b]) && c.push({
                        selector: d[b],
                        elem: o,
                        level: e
                    });
                    o = o.parentNode;
                    e++
                }
                return c
            }
            var g = Vb.test(d) || "string" != typeof d ? f(d, a || this.context) : 0;
            b = 0;
            for (e =
                this.length; b < e; b++)
                for (o = this[b]; o;) {
                    if (g ? -1 < g.index(o) : f.find.matchesSelector(o, d)) {
                        c.push(o);
                        break
                    }
                    o = o.parentNode;
                    if (!o || !o.ownerDocument || o === a || 11 === o.nodeType) break
                }
            c = 1 < c.length ? f.unique(c) : c;
            return this.pushStack(c, "closest", d)
        },
        index: function(d) {
            return !d ? this[0] && this[0].parentNode ? this.prevAll().length : -1 : "string" == typeof d ? f.inArray(this[0], f(d)) : f.inArray(d.jquery ? d[0] : d, this)
        },
        add: function(d, a) {
            var c = "string" == typeof d ? f(d, a) : f.makeArray(d && d.nodeType ? [d] : d),
                b = f.merge(this.get(), c);
            return this.pushStack(!c[0] ||
                !c[0].parentNode || 11 === c[0].parentNode.nodeType || !b[0] || !b[0].parentNode || 11 === b[0].parentNode.nodeType ? b : f.unique(b))
        },
        andSelf: function() {
            return this.add(this.prevObject)
        }
    });
    f.each({
        parent: function(d) {
            return (d = d.parentNode) && 11 !== d.nodeType ? d : null
        },
        parents: function(d) {
            return f.dir(d, "parentNode")
        },
        parentsUntil: function(d, a, c) {
            return f.dir(d, "parentNode", c)
        },
        next: function(d) {
            return f.nth(d, 2, "nextSibling")
        },
        prev: function(d) {
            return f.nth(d, 2, "previousSibling")
        },
        nextAll: function(d) {
            return f.dir(d, "nextSibling")
        },
        prevAll: function(d) {
            return f.dir(d, "previousSibling")
        },
        nextUntil: function(d, a, c) {
            return f.dir(d, "nextSibling", c)
        },
        prevUntil: function(d, a, c) {
            return f.dir(d, "previousSibling", c)
        },
        siblings: function(d) {
            return f.sibling((d.parentNode || {}).firstChild, d)
        },
        children: function(d) {
            return f.sibling(d.firstChild)
        },
        contents: function(d) {
            return f.nodeName(d, "iframe") ? d.contentDocument || d.contentWindow.document : f.makeArray(d.childNodes)
        }
    }, function(d, a) {
        f.fn[d] = function(c, b) {
            var e = f.map(this, a, c);
            Ac.test(d) || (b = c);
            b && "string" == typeof b && (e = f.filter(b, e));
            e = 1 < this.length && !Ec[d] ? f.unique(e) : e;
            (1 < this.length || Cc.test(b)) && Bc.test(d) && (e = e.reverse());
            return this.pushStack(e, d, Dc.call(arguments).join(","))
        }
    });
    f.extend({
        filter: function(d, a, c) {
            c && (d = ":not(" + d + ")");
            return 1 === a.length ? f.find.matchesSelector(a[0], d) ? [a[0]] : [] : f.find.matches(d, a)
        },
        dir: function(d, a, c) {
            var b = [];
            for (d = d[a]; d && 9 !== d.nodeType && (c === g || 1 !== d.nodeType || !f(d).is(c));) 1 === d.nodeType && b.push(d), d = d[a];
            return b
        },
        nth: function(d, a, f) {
            a = a || 1;
            for (var c =
                    0; d && !(1 === d.nodeType && ++c === a); d = d[f]);
            return d
        },
        sibling: function(d, a) {
            for (var f = []; d; d = d.nextSibling) 1 === d.nodeType && d !== a && f.push(d);
            return f
        }
    });
    var Bb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        Fc = / jQuery\d+="(?:\d+|null)"/g,
        ub = /^\s+/,
        Wb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        Xb = /<([\w:]+)/,
        Gc = /<tbody/i,
        Hc = /<|&#?\w+;/,
        Ic = /<(?:script|style)/i,
        Jc =
        /<(?:script|object|embed|option|style)/i,
        Yb = RegExp("\x3c(?:" + Bb + ")[\\s/\x3e]", "i"),
        Zb = /checked\s*(?:[^=]|=\s*.checked.)/i,
        $b = /\/(java|ecma)script/i,
        Kc = /^\s*<!(?:\[CDATA\[|\-\-)/,
        ra = {
            option: [1, "\x3cselect multiple\x3d'multiple'\x3e", "\x3c/select\x3e"],
            legend: [1, "\x3cfieldset\x3e", "\x3c/fieldset\x3e"],
            thead: [1, "\x3ctable\x3e", "\x3c/table\x3e"],
            tr: [2, "\x3ctable\x3e\x3ctbody\x3e", "\x3c/tbody\x3e\x3c/table\x3e"],
            td: [3, "\x3ctable\x3e\x3ctbody\x3e\x3ctr\x3e", "\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e"],
            col: [2,
                "\x3ctable\x3e\x3ctbody\x3e\x3c/tbody\x3e\x3ccolgroup\x3e", "\x3c/colgroup\x3e\x3c/table\x3e"
            ],
            area: [1, "\x3cmap\x3e", "\x3c/map\x3e"],
            _default: [0, "", ""]
        },
        vb = B(K);
    ra.optgroup = ra.option;
    ra.tbody = ra.tfoot = ra.colgroup = ra.caption = ra.thead;
    ra.th = ra.td;
    f.support.htmlSerialize || (ra._default = [1, "div\x3cdiv\x3e", "\x3c/div\x3e"]);
    f.fn.extend({
        text: function(d) {
            return f.access(this, function(d) {
                return d === g ? f.text(this) : this.empty().append((this[0] && this[0].ownerDocument || K).createTextNode(d))
            }, null, d, arguments.length)
        },
        wrapAll: function(d) {
            if (f.isFunction(d)) return this.each(function(a) {
                f(this).wrapAll(d.call(this, a))
            });
            if (this[0]) {
                var a = f(d, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && a.insertBefore(this[0]);
                a.map(function() {
                    for (var d = this; d.firstChild && 1 === d.firstChild.nodeType;) d = d.firstChild;
                    return d
                }).append(this)
            }
            return this
        },
        wrapInner: function(d) {
            return f.isFunction(d) ? this.each(function(a) {
                f(this).wrapInner(d.call(this, a))
            }) : this.each(function() {
                var a = f(this),
                    c = a.contents();
                c.length ? c.wrapAll(d) :
                    a.append(d)
            })
        },
        wrap: function(d) {
            var a = f.isFunction(d);
            return this.each(function(c) {
                f(this).wrapAll(a ? d.call(this, c) : d)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                f.nodeName(this, "body") || f(this).replaceWith(this.childNodes)
            }).end()
        },
        append: function() {
            return this.domManip(arguments, !0, function(d) {
                1 === this.nodeType && this.appendChild(d)
            })
        },
        prepend: function() {
            return this.domManip(arguments, !0, function(d) {
                1 === this.nodeType && this.insertBefore(d, this.firstChild)
            })
        },
        before: function() {
            if (this[0] &&
                this[0].parentNode) return this.domManip(arguments, !1, function(d) {
                this.parentNode.insertBefore(d, this)
            });
            if (arguments.length) {
                var d = f.clean(arguments);
                d.push.apply(d, this.toArray());
                return this.pushStack(d, "before", arguments)
            }
        },
        after: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(d) {
                this.parentNode.insertBefore(d, this.nextSibling)
            });
            if (arguments.length) {
                var d = this.pushStack(this, "after", arguments);
                d.push.apply(d, f.clean(arguments));
                return d
            }
        },
        remove: function(d,
            a) {
            for (var c = 0, b; null != (b = this[c]); c++)
                if (!d || f.filter(d, [b]).length) !a && 1 === b.nodeType && (f.cleanData(b.getElementsByTagName("*")), f.cleanData([b])), b.parentNode && b.parentNode.removeChild(b);
            return this
        },
        empty: function() {
            for (var d = 0, a; null != (a = this[d]); d++)
                for (1 === a.nodeType && f.cleanData(a.getElementsByTagName("*")); a.firstChild;) a.removeChild(a.firstChild);
            return this
        },
        clone: function(d, a) {
            d = null == d ? !1 : d;
            a = null == a ? d : a;
            return this.map(function() {
                return f.clone(this, d, a)
            })
        },
        html: function(d) {
            return f.access(this,
                function(d) {
                    var a = this[0] || {},
                        c = 0,
                        b = this.length;
                    if (d === g) return 1 === a.nodeType ? a.innerHTML.replace(Fc, "") : null;
                    if ("string" == typeof d && !Ic.test(d) && (f.support.leadingWhitespace || !ub.test(d)) && !ra[(Xb.exec(d) || ["", ""])[1].toLowerCase()]) {
                        d = d.replace(Wb, "\x3c$1\x3e\x3c/$2\x3e");
                        try {
                            for (; c < b; c++) a = this[c] || {}, 1 === a.nodeType && (f.cleanData(a.getElementsByTagName("*")), a.innerHTML = d);
                            a = 0
                        } catch (e) {}
                    }
                    a && this.empty().append(d)
                }, null, d, arguments.length)
        },
        replaceWith: function(d) {
            if (this[0] && this[0].parentNode) {
                if (f.isFunction(d)) return this.each(function(a) {
                    var c =
                        f(this),
                        b = c.html();
                    c.replaceWith(d.call(this, a, b))
                });
                "string" != typeof d && (d = f(d).detach());
                return this.each(function() {
                    var a = this.nextSibling,
                        c = this.parentNode;
                    f(this).remove();
                    a ? f(a).before(d) : f(c).append(d)
                })
            }
            return this.length ? this.pushStack(f(f.isFunction(d) ? d() : d), "replaceWith", d) : this
        },
        detach: function(d) {
            return this.remove(d, !0)
        },
        domManip: function(d, a, c) {
            var b, e, o, u = d[0],
                t = [];
            if (!f.support.checkClone && 3 === arguments.length && "string" == typeof u && Zb.test(u)) return this.each(function() {
                f(this).domManip(d,
                    a, c, !0)
            });
            if (f.isFunction(u)) return this.each(function(b) {
                var e = f(this);
                d[0] = u.call(this, b, a ? e.html() : g);
                e.domManip(d, a, c)
            });
            if (this[0]) {
                o = u && u.parentNode;
                f.support.parentNode && o && 11 === o.nodeType && o.childNodes.length === this.length ? b = {
                    fragment: o
                } : b = f.buildFragment(d, this, t);
                o = b.fragment;
                1 === o.childNodes.length ? e = o = o.firstChild : e = o.firstChild;
                if (e) {
                    a = a && f.nodeName(e, "tr");
                    e = 0;
                    for (var A = this.length, H = A - 1; e < A; e++) c.call(a ? f.nodeName(this[e], "table") ? this[e].getElementsByTagName("tbody")[0] || this[e].appendChild(this[e].ownerDocument.createElement("tbody")) :
                        this[e] : this[e], b.cacheable || 1 < A && e < H ? f.clone(o, !0, !0) : o)
                }
                t.length && f.each(t, function(d, a) {
                    a.src ? f.ajax({
                        type: "GET",
                        global: !1,
                        url: a.src,
                        async: !1,
                        dataType: "script"
                    }) : f.globalEval((a.text || a.textContent || a.innerHTML || "").replace(Kc, "/*$0*/"));
                    a.parentNode && a.parentNode.removeChild(a)
                })
            }
            return this
        }
    });
    f.buildFragment = function(d, a, c) {
        var b, e, o, g, u = d[0];
        a && a[0] && (g = a[0].ownerDocument || a[0]);
        g.createDocumentFragment || (g = K);
        1 === d.length && "string" == typeof u && 512 > u.length && g === K && "\x3c" === u.charAt(0) && !Jc.test(u) &&
            (f.support.checkClone || !Zb.test(u)) && (f.support.html5Clone || !Yb.test(u)) && (e = !0, o = f.fragments[u], o && 1 !== o && (b = o));
        b || (b = g.createDocumentFragment(), f.clean(d, g, b, c));
        e && (f.fragments[u] = o ? b : 1);
        return {
            fragment: b,
            cacheable: e
        }
    };
    f.fragments = {};
    f.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(d, a) {
        f.fn[d] = function(c) {
            var b = [];
            c = f(c);
            var e = 1 === this.length && this[0].parentNode;
            if (e && 11 === e.nodeType && 1 === e.childNodes.length && 1 === c.length) return c[a](this[0]),
                this;
            for (var e = 0, o = c.length; e < o; e++) {
                var u = (0 < e ? this.clone(!0) : this).get();
                f(c[e])[a](u);
                b = b.concat(u)
            }
            return this.pushStack(b, d, c.selector)
        }
    });
    f.extend({
        clone: function(d, a, c) {
            var b, e, o;
            f.support.html5Clone || f.isXMLDoc(d) || !Yb.test("\x3c" + d.nodeName + "\x3e") ? b = d.cloneNode(!0) : (b = K.createElement("div"), vb.appendChild(b), b.innerHTML = d.outerHTML, b = b.firstChild);
            var g = b;
            if ((!f.support.noCloneEvent || !f.support.noCloneChecked) && (1 === d.nodeType || 11 === d.nodeType) && !f.isXMLDoc(d)) {
                U(d, g);
                b = N(d);
                e = N(g);
                for (o =
                    0; b[o]; ++o) e[o] && U(b[o], e[o])
            }
            if (a && (u(d, g), c)) {
                b = N(d);
                e = N(g);
                for (o = 0; b[o]; ++o) u(b[o], e[o])
            }
            return g
        },
        clean: function(d, a, c, b) {
            var e, o = [];
            a = a || K;
            "undefined" == typeof a.createElement && (a = a.ownerDocument || a[0] && a[0].ownerDocument || K);
            for (var g = 0, u; null != (u = d[g]); g++)
                if ("number" == typeof u && (u += ""), u) {
                    if ("string" == typeof u)
                        if (Hc.test(u)) {
                            u = u.replace(Wb, "\x3c$1\x3e\x3c/$2\x3e");
                            e = (Xb.exec(u) || ["", ""])[1].toLowerCase();
                            var t = ra[e] || ra._default,
                                A = t[0],
                                H = a.createElement("div"),
                                r = vb.childNodes,
                                R;
                            a === K ? vb.appendChild(H) :
                                B(a).appendChild(H);
                            for (H.innerHTML = t[1] + u + t[2]; A--;) H = H.lastChild;
                            if (!f.support.tbody) {
                                A = Gc.test(u);
                                t = "table" === e && !A ? H.firstChild && H.firstChild.childNodes : "\x3ctable\x3e" === t[1] && !A ? H.childNodes : [];
                                for (e = t.length - 1; 0 <= e; --e) f.nodeName(t[e], "tbody") && !t[e].childNodes.length && t[e].parentNode.removeChild(t[e])
                            }!f.support.leadingWhitespace && ub.test(u) && H.insertBefore(a.createTextNode(ub.exec(u)[0]), H.firstChild);
                            u = H.childNodes;
                            H && (H.parentNode.removeChild(H), 0 < r.length && (R = r[r.length - 1], R && R.parentNode &&
                                R.parentNode.removeChild(R)))
                        } else u = a.createTextNode(u);
                    var v;
                    if (!f.support.appendChecked)
                        if (u[0] && "number" == typeof(v = u.length))
                            for (e = 0; e < v; e++) z(u[e]);
                        else z(u);
                    u.nodeType ? o.push(u) : o = f.merge(o, u)
                }
            if (c) {
                d = function(d) {
                    return !d.type || $b.test(d.type)
                };
                for (g = 0; o[g]; g++) a = o[g], b && f.nodeName(a, "script") && (!a.type || $b.test(a.type)) ? b.push(a.parentNode ? a.parentNode.removeChild(a) : a) : (1 === a.nodeType && (u = f.grep(a.getElementsByTagName("script"), d), o.splice.apply(o, [g + 1, 0].concat(u))), c.appendChild(a))
            }
            return o
        },
        cleanData: function(d) {
            for (var a, c, b = f.cache, e = f.event.special, o = f.support.deleteExpando, u = 0, g; null != (g = d[u]); u++)
                if (!g.nodeName || !f.noData[g.nodeName.toLowerCase()])
                    if (c = g[f.expando]) {
                        if ((a = b[c]) && a.events) {
                            for (var t in a.events) e[t] ? f.event.remove(g, t) : f.removeEvent(g, t, a.handle);
                            a.handle && (a.handle.elem = null)
                        }
                        o ? delete g[f.expando] : g.removeAttribute && g.removeAttribute(f.expando);
                        delete b[c]
                    }
        }
    });
    var wb = /alpha\([^)]*\)/i,
        Lc = /opacity=([^)]*)/,
        Mc = /([A-Z]|^ms)/g,
        Nc = /^[\-+]?(?:\d*\.)?\d+$/i,
        ib = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
        Oc = /^([\-+])=([\-+.\de]+)/,
        Pc = /^margin/,
        Qc = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        ya = ["Top", "Right", "Bottom", "Left"],
        Ea, ac, bc;
    f.fn.css = function(d, a) {
        return f.access(this, function(d, a, q) {
            return q !== g ? f.style(d, a, q) : f.css(d, a)
        }, d, a, 1 < arguments.length)
    };
    f.extend({
        cssHooks: {
            opacity: {
                get: function(d, a) {
                    if (a) {
                        var f = Ea(d, "opacity");
                        return "" === f ? "1" : f
                    }
                    return d.style.opacity
                }
            }
        },
        cssNumber: {
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": f.support.cssFloat ?
                "cssFloat" : "styleFloat"
        },
        style: function(d, a, c, b) {
            if (d && 3 !== d.nodeType && 8 !== d.nodeType && d.style) {
                var e, o = f.camelCase(a),
                    u = d.style,
                    t = f.cssHooks[o];
                a = f.cssProps[o] || o;
                if (c === g) return t && "get" in t && (e = t.get(d, !1, b)) !== g ? e : u[a];
                b = typeof c;
                "string" === b && (e = Oc.exec(c)) && (c = +(e[1] + 1) * +e[2] + parseFloat(f.css(d, a)), b = "number");
                if (!(null == c || "number" === b && isNaN(c)))
                    if ("number" === b && !f.cssNumber[o] && (c += "px"), !t || !("set" in t) || (c = t.set(d, c)) !== g) try {
                        u[a] = c
                    } catch (A) {}
            }
        },
        css: function(d, a, c) {
            var b, e;
            a = f.camelCase(a);
            e = f.cssHooks[a];
            a = f.cssProps[a] || a;
            "cssFloat" === a && (a = "float");
            if (e && "get" in e && (b = e.get(d, !0, c)) !== g) return b;
            if (Ea) return Ea(d, a)
        },
        swap: function(d, a, f) {
            var c = {},
                b;
            for (b in a) c[b] = d.style[b], d.style[b] = a[b];
            f = f.call(d);
            for (b in a) d.style[b] = c[b];
            return f
        }
    });
    f.curCSS = f.css;
    K.defaultView && K.defaultView.getComputedStyle && (ac = function(d, a) {
        var c, b, e, o, u = d.style;
        a = a.replace(Mc, "-$1").toLowerCase();
        (b = d.ownerDocument.defaultView) && (e = b.getComputedStyle(d, null)) && (c = e.getPropertyValue(a), "" === c && !f.contains(d.ownerDocument.documentElement,
            d) && (c = f.style(d, a)));
        !f.support.pixelMargin && e && Pc.test(a) && ib.test(c) && (o = u.width, u.width = c, c = e.width, u.width = o);
        return c
    });
    K.documentElement.currentStyle && (bc = function(d, a) {
        var f, c, b, e = d.currentStyle && d.currentStyle[a],
            o = d.style;
        null == e && o && (b = o[a]) && (e = b);
        ib.test(e) && (f = o.left, c = d.runtimeStyle && d.runtimeStyle.left, c && (d.runtimeStyle.left = d.currentStyle.left), o.left = "fontSize" === a ? "1em" : e, e = o.pixelLeft + "px", o.left = f, c && (d.runtimeStyle.left = c));
        return "" === e ? "auto" : e
    });
    Ea = ac || bc;
    f.each(["height",
        "width"
    ], function(d, a) {
        f.cssHooks[a] = {
            get: function(d, c, b) {
                if (c) return 0 !== d.offsetWidth ? w(d, a, b) : f.swap(d, Qc, function() {
                    return w(d, a, b)
                })
            },
            set: function(d, a) {
                return Nc.test(a) ? a + "px" : a
            }
        }
    });
    f.support.opacity || (f.cssHooks.opacity = {
        get: function(d, a) {
            return Lc.test((a && d.currentStyle ? d.currentStyle.filter : d.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : a ? "1" : ""
        },
        set: function(d, a) {
            var c = d.style,
                b = d.currentStyle,
                e = f.isNumeric(a) ? "alpha(opacity\x3d" + 100 * a + ")" : "",
                o = b && b.filter || c.filter || "";
            c.zoom = 1;
            if (1 <=
                a && "" === f.trim(o.replace(wb, "")) && (c.removeAttribute("filter"), b && !b.filter)) return;
            c.filter = wb.test(o) ? o.replace(wb, e) : o + " " + e
        }
    });
    f(function() {
        f.support.reliableMarginRight || (f.cssHooks.marginRight = {
            get: function(d, a) {
                return f.swap(d, {
                    display: "inline-block"
                }, function() {
                    return a ? Ea(d, "margin-right") : d.style.marginRight
                })
            }
        })
    });
    f.expr && f.expr.filters && (f.expr.filters.hidden = function(d) {
        var a = d.offsetHeight;
        return 0 === d.offsetWidth && 0 === a || !f.support.reliableHiddenOffsets && "none" === (d.style && d.style.display ||
            f.css(d, "display"))
    }, f.expr.filters.visible = function(d) {
        return !f.expr.filters.hidden(d)
    });
    f.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(d, a) {
        f.cssHooks[d + a] = {
            expand: function(f) {
                var c = "string" == typeof f ? f.split(" ") : [f],
                    b = {};
                for (f = 0; 4 > f; f++) b[d + ya[f] + a] = c[f] || c[f - 2] || c[0];
                return b
            }
        }
    });
    var Rc = /%20/g,
        jc = /\[\]$/,
        cc = /\r?\n/g,
        Sc = /#.*$/,
        Tc = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        Uc = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        Vc = /^(?:GET|HEAD)$/,
        Wc = /^\/\//,
        dc = /\?/,
        Xc = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        Yc = /^(?:select|textarea)/i,
        Ab = /\s+/,
        Zc = /([?&])_=[^&]*/,
        ec = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
        fc = f.fn.load,
        hb = {},
        gc = {},
        Ba, Ca, hc = ["*/"] + ["*"];
    try {
        Ba = oa.href
    } catch (hd) {
        Ba = K.createElement("a"), Ba.href = "", Ba = Ba.href
    }
    Ca = ec.exec(Ba.toLowerCase()) || [];
    f.fn.extend({
        load: function(d, a, c) {
            if ("string" != typeof d && fc) return fc.apply(this, arguments);
            if (!this.length) return this;
            var b = d.indexOf(" ");
            if (0 <= b) {
                var e = d.slice(b, d.length);
                d = d.slice(0, b)
            }
            b = "GET";
            a && (f.isFunction(a) ? (c = a, a = g) : "object" == typeof a && (a = f.param(a, f.ajaxSettings.traditional), b = "POST"));
            var o = this;
            f.ajax({
                url: d,
                type: b,
                dataType: "html",
                data: a,
                complete: function(d, a, q) {
                    q = d.responseText;
                    d.isResolved() && (d.done(function(d) {
                        q = d
                    }), o.html(e ? f("\x3cdiv\x3e").append(q.replace(Xc, "")).find(e) : q));
                    c && o.each(c, [q, a, d])
                }
            });
            return this
        },
        serialize: function() {
            return f.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? f.makeArray(this.elements) :
                    this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || Yc.test(this.nodeName) || Uc.test(this.type))
            }).map(function(d, a) {
                var c = f(this).val();
                return null == c ? null : f.isArray(c) ? f.map(c, function(d) {
                    return {
                        name: a.name,
                        value: d.replace(cc, "\r\n")
                    }
                }) : {
                    name: a.name,
                    value: c.replace(cc, "\r\n")
                }
            }).get()
        }
    });
    f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(d, a) {
        f.fn[a] = function(d) {
            return this.on(a, d)
        }
    });
    f.each(["get", "post"], function(d, a) {
        f[a] = function(d,
            c, b, e) {
            f.isFunction(c) && (e = e || b, b = c, c = g);
            return f.ajax({
                type: a,
                url: d,
                data: c,
                success: b,
                dataType: e
            })
        }
    });
    f.extend({
        getScript: function(d, a) {
            return f.get(d, g, a, "script")
        },
        getJSON: function(d, a, c) {
            return f.get(d, a, c, "json")
        },
        ajaxSetup: function(d, a) {
            a ? v(d, f.ajaxSettings) : (a = d, d = f.ajaxSettings);
            v(d, a);
            return d
        },
        ajaxSettings: {
            url: Ba,
            isLocal: /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(Ca[1]),
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset\x3dUTF-8",
            processData: !0,
            async: !0,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": hc
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
            converters: {
                "* text": b.String,
                "text html": !0,
                "text json": f.parseJSON,
                "text xml": f.parseXML
            },
            flatOptions: {
                context: !0,
                url: !0
            }
        },
        ajaxPrefilter: y(hb),
        ajaxTransport: y(gc),
        ajax: function(d, a) {
            function c(d, a, q, r) {
                if (2 !== fa) {
                    fa = 2;
                    P && clearTimeout(P);
                    D = g;
                    v = r || "";
                    B.readyState = 0 < d ?
                        4 : 0;
                    var R, p, Y;
                    r = a;
                    if (q) {
                        var F = b,
                            Q = B,
                            ta = F.contents,
                            K = F.dataTypes,
                            Ra = F.responseFields,
                            y, w, T, J;
                        for (w in Ra) w in q && (Q[Ra[w]] = q[w]);
                        for (;
                            "*" === K[0];) K.shift(), y === g && (y = F.mimeType || Q.getResponseHeader("content-type"));
                        if (y)
                            for (w in ta)
                                if (ta[w] && ta[w].test(y)) {
                                    K.unshift(w);
                                    break
                                }
                        if (K[0] in q) T = K[0];
                        else {
                            for (w in q) {
                                if (!K[0] || F.converters[w + " " + K[0]]) {
                                    T = w;
                                    break
                                }
                                J || (J = w)
                            }
                            T = T || J
                        }
                        T ? (T !== K[0] && K.unshift(T), q = q[T]) : q = void 0
                    } else q = g;
                    if (200 <= d && 300 > d || 304 === d) {
                        if (b.ifModified) {
                            if (y = B.getResponseHeader("Last-Modified")) f.lastModified[H] =
                                y;
                            if (y = B.getResponseHeader("Etag")) f.etag[H] = y
                        }
                        if (304 === d) r = "notmodified", R = !0;
                        else try {
                            y = b;
                            y.dataFilter && (q = y.dataFilter(q, y.dataType));
                            var ga = y.dataTypes;
                            w = {};
                            var I, z, aa = ga.length,
                                M, G = ga[0],
                                oa, ia, sa, da, E;
                            for (I = 1; I < aa; I++) {
                                if (1 === I)
                                    for (z in y.converters) "string" == typeof z && (w[z.toLowerCase()] = y.converters[z]);
                                oa = G;
                                G = ga[I];
                                if ("*" === G) G = oa;
                                else if ("*" !== oa && oa !== G) {
                                    ia = oa + " " + G;
                                    sa = w[ia] || w["* " + G];
                                    if (!sa)
                                        for (da in E = g, w)
                                            if (M = da.split(" "), M[0] === oa || "*" === M[0])
                                                if (E = w[M[1] + " " + G]) {
                                                    da = w[da];
                                                    !0 === da ? sa =
                                                        E : !0 === E && (sa = da);
                                                    break
                                                }!sa && !E && f.error("No conversion from " + ia.replace(" ", " to "));
                                    !0 !== sa && (q = sa ? sa(q) : E(da(q)))
                                }
                            }
                            p = q;
                            r = "success";
                            R = !0
                        } catch (Sa) {
                            r = "parsererror", Y = Sa
                        }
                    } else if (Y = r, !r || d) r = "error", 0 > d && (d = 0);
                    B.status = d;
                    B.statusText = "" + (a || r);
                    R ? u.resolveWith(e, [p, r, B]) : u.rejectWith(e, [B, r, Y]);
                    B.statusCode(A);
                    A = g;
                    O && o.trigger("ajax" + (R ? "Success" : "Error"), [B, b, R ? p : Y]);
                    t.fireWith(e, [B, r]);
                    O && (o.trigger("ajaxComplete", [B, b]), --f.active || f.event.trigger("ajaxStop"))
                }
            }
            "object" == typeof d && (a = d, d = g);
            a =
                a || {};
            var b = f.ajaxSetup({}, a),
                e = b.context || b,
                o = e !== b && (e.nodeType || e instanceof f) ? f(e) : f.event,
                u = f.Deferred(),
                t = f.Callbacks("once memory"),
                A = b.statusCode || {},
                H, r = {},
                R = {},
                v, p, D, P, Y, fa = 0,
                O, F, B = {
                    readyState: 0,
                    setRequestHeader: function(d, a) {
                        if (!fa) {
                            var f = d.toLowerCase();
                            d = R[f] = R[f] || d;
                            r[d] = a
                        }
                        return this
                    },
                    getAllResponseHeaders: function() {
                        return 2 === fa ? v : null
                    },
                    getResponseHeader: function(d) {
                        var a;
                        if (2 === fa) {
                            if (!p)
                                for (p = {}; a = Tc.exec(v);) p[a[1].toLowerCase()] = a[2];
                            a = p[d.toLowerCase()]
                        }
                        return a === g ? null : a
                    },
                    overrideMimeType: function(d) {
                        fa || (b.mimeType = d);
                        return this
                    },
                    abort: function(d) {
                        d = d || "abort";
                        D && D.abort(d);
                        c(0, d);
                        return this
                    }
                };
            u.promise(B);
            B.success = B.done;
            B.error = B.fail;
            B.complete = t.add;
            B.statusCode = function(d) {
                if (d) {
                    var a;
                    if (2 > fa)
                        for (a in d) A[a] = [A[a], d[a]];
                    else a = d[B.status], B.then(a, a)
                }
                return this
            };
            b.url = ((d || b.url) + "").replace(Sc, "").replace(Wc, Ca[1] + "//");
            b.dataTypes = f.trim(b.dataType || "*").toLowerCase().split(Ab);
            null == b.crossDomain && (Y = ec.exec(b.url.toLowerCase()), b.crossDomain = !(!Y || Y[1] ==
                Ca[1] && Y[2] == Ca[2] && (Y[3] || ("http:" === Y[1] ? 80 : 443)) == (Ca[3] || ("http:" === Ca[1] ? 80 : 443))));
            b.data && b.processData && "string" != typeof b.data && (b.data = f.param(b.data, b.traditional));
            J(hb, b, a, B);
            if (2 === fa) return !1;
            O = b.global;
            b.type = b.type.toUpperCase();
            b.hasContent = !Vc.test(b.type);
            O && 0 === f.active++ && f.event.trigger("ajaxStart");
            if (!b.hasContent && (b.data && (b.url += (dc.test(b.url) ? "\x26" : "?") + b.data, delete b.data), H = b.url, !1 === b.cache)) {
                Y = f.now();
                var Q = b.url.replace(Zc, "$1_\x3d" + Y);
                b.url = Q + (Q === b.url ? (dc.test(b.url) ?
                    "\x26" : "?") + "_\x3d" + Y : "")
            }(b.data && b.hasContent && !1 !== b.contentType || a.contentType) && B.setRequestHeader("Content-Type", b.contentType);
            b.ifModified && (H = H || b.url, f.lastModified[H] && B.setRequestHeader("If-Modified-Since", f.lastModified[H]), f.etag[H] && B.setRequestHeader("If-None-Match", f.etag[H]));
            B.setRequestHeader("Accept", b.dataTypes[0] && b.accepts[b.dataTypes[0]] ? b.accepts[b.dataTypes[0]] + ("*" !== b.dataTypes[0] ? ", " + hc + "; q\x3d0.01" : "") : b.accepts["*"]);
            for (F in b.headers) B.setRequestHeader(F, b.headers[F]);
            if (b.beforeSend && (!1 === b.beforeSend.call(e, B, b) || 2 === fa)) return B.abort(), !1;
            for (F in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) B[F](b[F]);
            if (D = J(gc, b, a, B)) {
                B.readyState = 1;
                O && o.trigger("ajaxSend", [B, b]);
                b.async && 0 < b.timeout && (P = setTimeout(function() {
                    B.abort("timeout")
                }, b.timeout));
                try {
                    fa = 1, D.send(r, c)
                } catch (ta) {
                    if (2 > fa) c(-1, ta);
                    else throw ta;
                }
            } else c(-1, "No Transport");
            return B
        },
        param: function(d, a) {
            var c = [],
                b = function(d, a) {
                    a = f.isFunction(a) ? a() : a;
                    c[c.length] = encodeURIComponent(d) + "\x3d" + encodeURIComponent(a)
                };
            a === g && (a = f.ajaxSettings.traditional);
            if (f.isArray(d) || d.jquery && !f.isPlainObject(d)) f.each(d, function() {
                b(this.name, this.value)
            });
            else
                for (var e in d) t(e, d[e], a, b);
            return c.join("\x26").replace(Rc, "+")
        }
    });
    f.extend({
        active: 0,
        lastModified: {},
        etag: {}
    });
    var $c = f.now(),
        eb = /(\=)\?(&|$)|\?\?/i;
    f.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            return f.expando + "_" + $c++
        }
    });
    f.ajaxPrefilter("json jsonp", function(d, a, c) {
        a = "string" == typeof d.data && /^application\/x\-www\-form\-urlencoded/.test(d.contentType);
        if ("jsonp" === d.dataTypes[0] || !1 !== d.jsonp && (eb.test(d.url) || a && eb.test(d.data))) {
            var e, o = d.jsonpCallback = f.isFunction(d.jsonpCallback) ? d.jsonpCallback() : d.jsonpCallback,
                u = b[o],
                g = d.url,
                t = d.data,
                A = "$1" + o + "$2";
            !1 !== d.jsonp && (g = g.replace(eb, A), d.url === g && (a && (t = t.replace(eb, A)), d.data === t && (g += (/\?/.test(g) ? "\x26" : "?") + d.jsonp + "\x3d" + o)));
            d.url = g;
            d.data = t;
            b[o] = function(d) {
                e = [d]
            };
            c.always(function() {
                b[o] = u;
                e && f.isFunction(u) && b[o](e[0])
            });
            d.converters["script json"] = function() {
                e || f.error(o + " was not called");
                return e[0]
            };
            d.dataTypes[0] = "json";
            return "script"
        }
    });
    f.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function(d) {
                f.globalEval(d);
                return d
            }
        }
    });
    f.ajaxPrefilter("script", function(d) {
        d.cache === g && (d.cache = !1);
        d.crossDomain && (d.type = "GET", d.global = !1)
    });
    f.ajaxTransport("script", function(d) {
        if (d.crossDomain) {
            var a, f = K.head || K.getElementsByTagName("head")[0] || K.documentElement;
            return {
                send: function(c, b) {
                    a = K.createElement("script");
                    a.async = "async";
                    d.scriptCharset && (a.charset = d.scriptCharset);
                    a.src = d.url;
                    a.onload = a.onreadystatechange = function(d, c) {
                        if (c || !a.readyState || /loaded|complete/.test(a.readyState)) a.onload = a.onreadystatechange = null, f && a.parentNode && f.removeChild(a), a = g, c || b(200, "success")
                    };
                    f.insertBefore(a, f.firstChild)
                },
                abort: function() {
                    a && a.onload(0, 1)
                }
            }
        }
    });
    var xb = b.ActiveXObject ? function() {
            for (var d in Ja) Ja[d](0, 1)
        } : !1,
        ad = 0,
        Ja;
    f.ajaxSettings.xhr = b.ActiveXObject ?
        function() {
            var d;
            if (!(d = !this.isLocal && e())) a: {
                try {
                    d = new b.ActiveXObject("MSXML2.XMLHTTP.6.0");
                    break a
                } catch (a) {}
                d = void 0
            }
            return d
        } : e;
    var yb = f.ajaxSettings.xhr();
    f.extend(f.support, {
        ajax: !!yb,
        cors: !!yb && "withCredentials" in yb
    });
    f.support.ajax && f.ajaxTransport(function(d) {
        if (!d.crossDomain || f.support.cors) {
            var a;
            return {
                send: function(c, e) {
                    var o = d.xhr(),
                        u, t;
                    d.username ? o.open(d.type, d.url, d.async, d.username, d.password) : o.open(d.type, d.url, d.async);
                    if (d.xhrFields)
                        for (t in d.xhrFields) o[t] = d.xhrFields[t];
                    d.mimeType && o.overrideMimeType && o.overrideMimeType(d.mimeType);
                    !d.crossDomain && !c["X-Requested-With"] && (c["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for (t in c) o.setRequestHeader(t, c[t])
                    } catch (A) {}
                    o.send(d.hasContent && d.data || null);
                    a = function(c, b) {
                        var t, A, H, r, R;
                        try {
                            if (a && (b || 4 === o.readyState))
                                if (a = g, u && (o.onreadystatechange = f.noop, xb && delete Ja[u]), b) 4 !== o.readyState && o.abort();
                                else {
                                    t = o.status;
                                    H = o.getAllResponseHeaders();
                                    r = {};
                                    (R = o.responseXML) && R.documentElement && (r.xml = R);
                                    try {
                                        r.text = o.responseText
                                    } catch (v) {}
                                    try {
                                        A =
                                            o.statusText
                                    } catch (p) {
                                        A = ""
                                    }!t && d.isLocal && !d.crossDomain ? t = r.text ? 200 : 404 : 1223 === t && (t = 204)
                                }
                        } catch (D) {
                            b || e(-1, D)
                        }
                        r && e(t, A, r, H)
                    };
                    !d.async || 4 === o.readyState ? a() : (u = ++ad, xb && (Ja || (Ja = {}, f(b).unload(xb)), Ja[u] = a), o.onreadystatechange = a)
                },
                abort: function() {
                    a && a(0, 1)
                }
            }
        }
    });
    var gb = {},
        va, Da, bd = /^(?:toggle|show|hide)$/,
        cd = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        fb, Pa = [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity"]
        ],
        Qa;
    f.fn.extend({
        show: function(d, c, b) {
            var e;
            if (d || 0 === d) return this.animate(a("show", 3), d, c, b);
            c = 0;
            for (b = this.length; c < b; c++) d = this[c], d.style && (e = d.style.display, !f._data(d, "olddisplay") && "none" === e && (e = d.style.display = ""), ("" === e && "none" === f.css(d, "display") || !f.contains(d.ownerDocument.documentElement, d)) && f._data(d, "olddisplay", r(d.nodeName)));
            for (c = 0; c < b; c++)
                if (d = this[c], d.style && (e = d.style.display, "" === e || "none" === e)) d.style.display = f._data(d, "olddisplay") || "";
            return this
        },
        hide: function(d, c,
            b) {
            if (d || 0 === d) return this.animate(a("hide", 3), d, c, b);
            var e;
            c = 0;
            for (b = this.length; c < b; c++) d = this[c], d.style && (e = f.css(d, "display"), "none" !== e && !f._data(d, "olddisplay") && f._data(d, "olddisplay", e));
            for (c = 0; c < b; c++) this[c].style && (this[c].style.display = "none");
            return this
        },
        _toggle: f.fn.toggle,
        toggle: function(d, c, b) {
            var e = "boolean" == typeof d;
            f.isFunction(d) && f.isFunction(c) ? this._toggle.apply(this, arguments) : null == d || e ? this.each(function() {
                    var a = e ? d : f(this).is(":hidden");
                    f(this)[a ? "show" : "hide"]()
                }) :
                this.animate(a("toggle", 3), d, c, b);
            return this
        },
        fadeTo: function(d, a, f, c) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: a
            }, d, f, c)
        },
        animate: function(d, a, c, b) {
            function e() {
                !1 === o.queue && f._mark(this);
                var a = f.extend({}, o),
                    c = 1 === this.nodeType,
                    b = c && f(this).is(":hidden"),
                    q, u, g, t, A, H, R, v, p;
                a.animatedProperties = {};
                for (g in d)
                    if (q = f.camelCase(g), g !== q && (d[q] = d[g], delete d[g]), (u = f.cssHooks[q]) && "expand" in u)
                        for (g in t = u.expand(d[q]), delete d[q], t) g in d || (d[g] = t[g]);
                for (q in d) {
                    u =
                        d[q];
                    f.isArray(u) ? (a.animatedProperties[q] = u[1], u = d[q] = u[0]) : a.animatedProperties[q] = a.specialEasing && a.specialEasing[q] || a.easing || "swing";
                    if ("hide" === u && b || "show" === u && !b) return a.complete.call(this);
                    c && ("height" === q || "width" === q) && (a.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], "inline" === f.css(this, "display") && "none" === f.css(this, "float") && (!f.support.inlineBlockNeedsLayout || "inline" === r(this.nodeName) ? this.style.display = "inline-block" : this.style.zoom = 1))
                }
                null != a.overflow &&
                    (this.style.overflow = "hidden");
                for (g in d) c = new f.fx(this, a, g), u = d[g], bd.test(u) ? (p = f._data(this, "toggle" + g) || ("toggle" === u ? b ? "show" : "hide" : 0), p ? (f._data(this, "toggle" + g, "show" === p ? "hide" : "show"), c[p]()) : c[u]()) : (A = cd.exec(u), H = c.cur(), A ? (R = parseFloat(A[2]), v = A[3] || (f.cssNumber[g] ? "" : "px"), "px" !== v && (f.style(this, g, (R || 1) + v), H *= (R || 1) / c.cur(), f.style(this, g, H + v)), A[1] && (R = ("-\x3d" === A[1] ? -1 : 1) * R + H), c.custom(H, R, v)) : c.custom(H, u, ""));
                return !0
            }
            var o = f.speed(a, c, b);
            if (f.isEmptyObject(d)) return this.each(o.complete, [!1]);
            d = f.extend({}, d);
            return !1 === o.queue ? this.each(e) : this.queue(o.queue, e)
        },
        stop: function(d, a, c) {
            "string" != typeof d && (c = a, a = d, d = g);
            a && !1 !== d && this.queue(d || "fx", []);
            return this.each(function() {
                var a, b = !1,
                    q = f.timers,
                    e = f._data(this);
                c || f._unmark(!0, this);
                if (null == d)
                    for (a in e) {
                        if (e[a] && e[a].stop && a.indexOf(".run") === a.length - 4) {
                            var o = e[a];
                            f.removeData(this, a, !0);
                            o.stop(c)
                        }
                    } else if (e[a = d + ".run"] && e[a].stop) e = e[a], f.removeData(this, a, !0), e.stop(c);
                for (a = q.length; a--;) q[a].elem === this && (null == d || q[a].queue ===
                    d) && (c ? q[a](!0) : q[a].saveState(), b = !0, q.splice(a, 1));
                (!c || !b) && f.dequeue(this, d)
            })
        }
    });
    f.each({
        slideDown: a("show", 1),
        slideUp: a("hide", 1),
        slideToggle: a("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(d, a) {
        f.fn[d] = function(d, f, c) {
            return this.animate(a, d, f, c)
        }
    });
    f.extend({
        speed: function(d, a, c) {
            var b = d && "object" == typeof d ? f.extend({}, d) : {
                complete: c || !c && a || f.isFunction(d) && d,
                duration: d,
                easing: c && a || a && !f.isFunction(a) && a
            };
            b.duration = f.fx.off ? 0 : "number" ==
                typeof b.duration ? b.duration : b.duration in f.fx.speeds ? f.fx.speeds[b.duration] : f.fx.speeds._default;
            if (null == b.queue || !0 === b.queue) b.queue = "fx";
            b.old = b.complete;
            b.complete = function(d) {
                f.isFunction(b.old) && b.old.call(this);
                b.queue ? f.dequeue(this, b.queue) : !1 !== d && f._unmark(this)
            };
            return b
        },
        easing: {
            linear: function(d) {
                return d
            },
            swing: function(d) {
                return -Math.cos(d * Math.PI) / 2 + 0.5
            }
        },
        timers: [],
        fx: function(d, a, f) {
            this.options = a;
            this.elem = d;
            this.prop = f;
            a.orig = a.orig || {}
        }
    });
    f.fx.prototype = {
        update: function() {
            this.options.step &&
                this.options.step.call(this.elem, this.now, this);
            (f.fx.step[this.prop] || f.fx.step._default)(this)
        },
        cur: function() {
            if (null != this.elem[this.prop] && (!this.elem.style || null == this.elem.style[this.prop])) return this.elem[this.prop];
            var d, a = f.css(this.elem, this.prop);
            return isNaN(d = parseFloat(a)) ? !a || "auto" === a ? 0 : a : d
        },
        custom: function(d, a, c) {
            function b(d) {
                return e.step(d)
            }
            var e = this,
                u = f.fx;
            this.startTime = Qa || o();
            this.end = a;
            this.now = this.start = d;
            this.pos = this.state = 0;
            this.unit = c || this.unit || (f.cssNumber[this.prop] ?
                "" : "px");
            b.queue = this.options.queue;
            b.elem = this.elem;
            b.saveState = function() {
                f._data(e.elem, "fxshow" + e.prop) === g && (e.options.hide ? f._data(e.elem, "fxshow" + e.prop, e.start) : e.options.show && f._data(e.elem, "fxshow" + e.prop, e.end))
            };
            b() && f.timers.push(b) && !fb && (fb = setInterval(u.tick, u.interval))
        },
        show: function() {
            var d = f._data(this.elem, "fxshow" + this.prop);
            this.options.orig[this.prop] = d || f.style(this.elem, this.prop);
            this.options.show = !0;
            d !== g ? this.custom(this.cur(), d) : this.custom("width" === this.prop || "height" ===
                this.prop ? 1 : 0, this.cur());
            f(this.elem).show()
        },
        hide: function() {
            this.options.orig[this.prop] = f._data(this.elem, "fxshow" + this.prop) || f.style(this.elem, this.prop);
            this.options.hide = !0;
            this.custom(this.cur(), 0)
        },
        step: function(d) {
            var a, c, b = Qa || o(),
                e = !0,
                u = this.elem,
                g = this.options;
            if (d || b >= g.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                g.animatedProperties[this.prop] = !0;
                for (a in g.animatedProperties) !0 !== g.animatedProperties[a] && (e = !1);
                if (e) {
                    null != g.overflow && !f.support.shrinkWrapBlocks &&
                        f.each(["", "X", "Y"], function(d, a) {
                            u.style["overflow" + a] = g.overflow[d]
                        });
                    g.hide && f(u).hide();
                    if (g.hide || g.show)
                        for (a in g.animatedProperties) f.style(u, a, g.orig[a]), f.removeData(u, "fxshow" + a, !0), f.removeData(u, "toggle" + a, !0);
                    (d = g.complete) && (g.complete = !1, d.call(u))
                }
                return !1
            }
            Infinity == g.duration ? this.now = b : (c = b - this.startTime, this.state = c / g.duration, this.pos = f.easing[g.animatedProperties[this.prop]](this.state, c, 0, 1, g.duration), this.now = this.start + (this.end - this.start) * this.pos);
            this.update();
            return !0
        }
    };
    f.extend(f.fx, {
        tick: function() {
            for (var d, a = f.timers, c = 0; c < a.length; c++) d = a[c], !d() && a[c] === d && a.splice(c--, 1);
            a.length || f.fx.stop()
        },
        interval: 13,
        stop: function() {
            clearInterval(fb);
            fb = null
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function(d) {
                f.style(d.elem, "opacity", d.now)
            },
            _default: function(d) {
                d.elem.style && null != d.elem.style[d.prop] ? d.elem.style[d.prop] = d.now + d.unit : d.elem[d.prop] = d.now
            }
        }
    });
    f.each(Pa.concat.apply([], Pa), function(d, a) {
        a.indexOf("margin") && (f.fx.step[a] = function(d) {
            f.style(d.elem,
                a, Math.max(0, d.now) + d.unit)
        })
    });
    f.expr && f.expr.filters && (f.expr.filters.animated = function(d) {
        return f.grep(f.timers, function(a) {
            return d === a.elem
        }).length
    });
    var zb, dd = /^t(?:able|d|h)$/i,
        ic = /^(?:body|html)$/i;
    "getBoundingClientRect" in K.documentElement ? zb = function(d, a, c, b) {
        try {
            b = d.getBoundingClientRect()
        } catch (e) {}
        if (!b || !f.contains(c, d)) return b ? {
            top: b.top,
            left: b.left
        } : {
            top: 0,
            left: 0
        };
        d = a.body;
        a = p(a);
        return {
            top: b.top + (a.pageYOffset || f.support.boxModel && c.scrollTop || d.scrollTop) - (c.clientTop || d.clientTop ||
                0),
            left: b.left + (a.pageXOffset || f.support.boxModel && c.scrollLeft || d.scrollLeft) - (c.clientLeft || d.clientLeft || 0)
        }
    } : zb = function(d, a, c) {
        var b, e = d.offsetParent,
            o = a.body;
        b = (a = a.defaultView) ? a.getComputedStyle(d, null) : d.currentStyle;
        for (var u = d.offsetTop, g = d.offsetLeft;
            (d = d.parentNode) && (d !== o && d !== c) && !(f.support.fixedPosition && "fixed" === b.position);) b = a ? a.getComputedStyle(d, null) : d.currentStyle, u -= d.scrollTop, g -= d.scrollLeft, d === e && (u += d.offsetTop, g += d.offsetLeft, f.support.doesNotAddBorder && (!f.support.doesAddBorderForTableAndCells ||
            !dd.test(d.nodeName)) && (u += parseFloat(b.borderTopWidth) || 0, g += parseFloat(b.borderLeftWidth) || 0), e = d.offsetParent), f.support.subtractsBorderForOverflowNotVisible && "visible" !== b.overflow && (u += parseFloat(b.borderTopWidth) || 0, g += parseFloat(b.borderLeftWidth) || 0);
        if ("relative" === b.position || "static" === b.position) u += o.offsetTop, g += o.offsetLeft;
        f.support.fixedPosition && "fixed" === b.position && (u += Math.max(c.scrollTop, o.scrollTop), g += Math.max(c.scrollLeft, o.scrollLeft));
        return {
            top: u,
            left: g
        }
    };
    f.fn.offset = function(d) {
        if (arguments.length) return d ===
            g ? this : this.each(function(a) {
                f.offset.setOffset(this, d, a)
            });
        var a = this[0],
            c = a && a.ownerDocument;
        return !c ? null : a === c.body ? f.offset.bodyOffset(a) : zb(a, c, c.documentElement)
    };
    f.offset = {
        bodyOffset: function(d) {
            var a = d.offsetTop,
                c = d.offsetLeft;
            f.support.doesNotIncludeMarginInBodyOffset && (a += parseFloat(f.css(d, "marginTop")) || 0, c += parseFloat(f.css(d, "marginLeft")) || 0);
            return {
                top: a,
                left: c
            }
        },
        setOffset: function(d, a, c) {
            var b = f.css(d, "position");
            "static" === b && (d.style.position = "relative");
            var e = f(d),
                o = e.offset(),
                u = f.css(d, "top"),
                g = f.css(d, "left"),
                t = {},
                A = {},
                H, r;
            ("absolute" === b || "fixed" === b) && -1 < f.inArray("auto", [u, g]) ? (A = e.position(), H = A.top, r = A.left) : (H = parseFloat(u) || 0, r = parseFloat(g) || 0);
            f.isFunction(a) && (a = a.call(d, c, o));
            null != a.top && (t.top = a.top - o.top + H);
            null != a.left && (t.left = a.left - o.left + r);
            "using" in a ? a.using.call(d, t) : e.css(t)
        }
    };
    f.fn.extend({
        position: function() {
            if (!this[0]) return null;
            var d = this[0],
                a = this.offsetParent(),
                c = this.offset(),
                b = ic.test(a[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : a.offset();
            c.top -= parseFloat(f.css(d,
                "marginTop")) || 0;
            c.left -= parseFloat(f.css(d, "marginLeft")) || 0;
            b.top += parseFloat(f.css(a[0], "borderTopWidth")) || 0;
            b.left += parseFloat(f.css(a[0], "borderLeftWidth")) || 0;
            return {
                top: c.top - b.top,
                left: c.left - b.left
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var d = this.offsetParent || K.body; d && !ic.test(d.nodeName) && "static" === f.css(d, "position");) d = d.offsetParent;
                return d
            })
        }
    });
    f.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(d, a) {
        var c = /Y/.test(a);
        f.fn[d] = function(b) {
            return f.access(this,
                function(d, b, e) {
                    var o = p(d);
                    if (e === g) return o ? a in o ? o[a] : f.support.boxModel && o.document.documentElement[b] || o.document.body[b] : d[b];
                    o ? o.scrollTo(c ? f(o).scrollLeft() : e, c ? e : f(o).scrollTop()) : d[b] = e
                }, d, b, arguments.length, null)
        }
    });
    f.each({
        Height: "height",
        Width: "width"
    }, function(d, a) {
        var c = "client" + d,
            b = "scroll" + d,
            e = "offset" + d;
        f.fn["inner" + d] = function() {
            var d = this[0];
            return d ? d.style ? parseFloat(f.css(d, a, "padding")) : this[a]() : null
        };
        f.fn["outer" + d] = function(d) {
            var c = this[0];
            return c ? c.style ? parseFloat(f.css(c,
                a, d ? "margin" : "border")) : this[a]() : null
        };
        f.fn[a] = function(d) {
            return f.access(this, function(d, a, o) {
                if (f.isWindow(d)) return a = d.document, d = a.documentElement[c], f.support.boxModel && d || a.body && a.body[c] || d;
                if (9 === d.nodeType) return a = d.documentElement, a[c] >= a[b] ? a[c] : Math.max(d.body[b], a[b], d.body[e], a[e]);
                if (o === g) return d = f.css(d, a), a = parseFloat(d), f.isNumeric(a) ? a : d;
                f(d).css(a, o)
            }, a, d, arguments.length, null)
        }
    });
    b.jQuery = b.$ = f;
    "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [],
        function() {
            return f
        })
})(window);
document.createElement("canvas").getContext || function() {
    function b() {
        return this.context_ || (this.context_ = new E(this))
    }

    function g(a, c, f) {
        var b = Z.call(arguments, 2);
        return function() {
            return a.apply(c, b.concat(Z.call(arguments)))
        }
    }

    function p(a) {
        return String(a).replace(/&/g, "\x26amp;").replace(/"/g, "\x26quot;")
    }

    function r(a) {
        a.namespaces.g_vml_ || a.namespaces.add("g_vml_", "urn:schemas-microsoft-com:vml", "#default#VML");
        a.namespaces.g_o_ || a.namespaces.add("g_o_", "urn:schemas-microsoft-com:office:office", "#default#VML");
        a.styleSheets.ex_canvas_ || (a = a.createStyleSheet(), a.owningElement.id = "ex_canvas_", a.cssText = "canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}")
    }

    function a(a) {
        var c = a.srcElement;
        switch (a.propertyName) {
            case "width":
                c.getContext().clearRect();
                c.style.width = c.attributes.width.nodeValue + "px";
                c.firstChild.style.width = c.clientWidth + "px";
                break;
            case "height":
                c.getContext().clearRect(), c.style.height = c.attributes.height.nodeValue + "px", c.firstChild.style.height = c.clientHeight +
                    "px"
        }
    }

    function c(a) {
        a = a.srcElement;
        a.firstChild && (a.firstChild.style.width = a.clientWidth + "px", a.firstChild.style.height = a.clientHeight + "px")
    }

    function o() {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]
    }

    function e(a, c) {
        for (var f = o(), b = 0; 3 > b; b++)
            for (var e = 0; 3 > e; e++) {
                for (var u = 0, g = 0; 3 > g; g++) u += a[b][g] * c[g][e];
                f[b][e] = u
            }
        return f
    }

    function t(a, c) {
        c.fillStyle = a.fillStyle;
        c.lineCap = a.lineCap;
        c.lineJoin = a.lineJoin;
        c.lineWidth = a.lineWidth;
        c.miterLimit = a.miterLimit;
        c.shadowBlur = a.shadowBlur;
        c.shadowColor = a.shadowColor;
        c.shadowOffsetX =
            a.shadowOffsetX;
        c.shadowOffsetY = a.shadowOffsetY;
        c.strokeStyle = a.strokeStyle;
        c.globalAlpha = a.globalAlpha;
        c.font = a.font;
        c.textAlign = a.textAlign;
        c.textBaseline = a.textBaseline;
        c.arcScaleX_ = a.arcScaleX_;
        c.arcScaleY_ = a.arcScaleY_;
        c.lineScale_ = a.lineScale_
    }

    function v(a) {
        var c = a.indexOf("(", 3),
            f = a.indexOf(")", c + 1),
            c = a.substring(c + 1, f).split(",");
        4 == c.length && "a" == a.substr(3, 1) ? alpha = Number(c[3]) : c[3] = 1;
        return c
    }

    function J(a, c, f) {
        return Math.min(f, Math.max(c, a))
    }

    function y(a, c, f) {
        0 > f && f++;
        1 < f && f--;
        return 1 >
            6 * f ? a + 6 * (c - a) * f : 1 > 2 * f ? c : 2 > 3 * f ? a + 6 * (c - a) * (2 / 3 - f) : a
    }

    function w(a) {
        var c = 1;
        a = String(a);
        if ("#" != a.charAt(0))
            if (/^rgb/.test(a)) {
                c = v(a);
                a = "#";
                for (var f, b = 0; 3 > b; b++) f = -1 != c[b].indexOf("%") ? Math.floor(255 * (parseFloat(c[b]) / 100)) : Number(c[b]), a += pa[J(f, 0, 255)];
                c = c[3]
            } else if (/^hsl/.test(a)) {
            a = c = v(a);
            h = parseFloat(a[0]) / 360 % 360;
            0 > h && h++;
            s = J(parseFloat(a[1]) / 100, 0, 1);
            l = J(parseFloat(a[2]) / 100, 0, 1);
            if (0 == s) a = f = b = l;
            else {
                var b = 0.5 > l ? l * (1 + s) : l + s - l * s,
                    e = 2 * l - b;
                a = y(e, b, h + 1 / 3);
                f = y(e, b, h);
                b = y(e, b, h - 1 / 3)
            }
            a = "#" + pa[Math.floor(255 *
                a)] + pa[Math.floor(255 * f)] + pa[Math.floor(255 * b)];
            c = c[3]
        } else a = L[a] || a;
        return {
            color: a,
            alpha: c
        }
    }

    function z(a) {
        switch (a) {
            case "butt":
                return "flat";
            case "round":
                return "round";
            default:
                return "square"
        }
    }

    function E(a) {
        this.m_ = o();
        this.mStack_ = [];
        this.aStack_ = [];
        this.currentPath_ = [];
        this.fillStyle = this.strokeStyle = "#000";
        this.lineWidth = 1;
        this.lineJoin = "miter";
        this.lineCap = "butt";
        this.miterLimit = 1 * ba;
        this.globalAlpha = 1;
        this.font = "10px sans-serif";
        this.textAlign = "left";
        this.textBaseline = "alphabetic";
        this.canvas =
            a;
        var c = a.ownerDocument.createElement("div");
        c.style.width = a.clientWidth + "px";
        c.style.height = a.clientHeight + "px";
        c.style.overflow = "hidden";
        c.style.position = "absolute";
        a.appendChild(c);
        this.element_ = c;
        this.lineScale_ = this.arcScaleY_ = this.arcScaleX_ = 1
    }

    function N(a, c, f, b) {
        a.currentPath_.push({
            type: "bezierCurveTo",
            cp1x: c.x,
            cp1y: c.y,
            cp2x: f.x,
            cp2y: f.y,
            x: b.x,
            y: b.y
        });
        a.currentX_ = b.x;
        a.currentY_ = b.y
    }

    function U(a, c) {
        var f = w(a.strokeStyle),
            b = f.color,
            f = f.alpha * a.globalAlpha,
            e = a.lineScale_ * a.lineWidth;
        1 > e && (f *=
            e);
        c.push("\x3cg_vml_:stroke", ' opacity\x3d"', f, '"', ' joinstyle\x3d"', a.lineJoin, '"', ' miterlimit\x3d"', a.miterLimit, '"', ' endcap\x3d"', z(a.lineCap), '"', ' weight\x3d"', e, 'px"', ' color\x3d"', b, '" /\x3e')
    }

    function u(a, c, f, b) {
        var e = a.fillStyle,
            o = a.arcScaleX_,
            u = a.arcScaleY_,
            g = b.x - f.x,
            t = b.y - f.y;
        if (e instanceof P) {
            var r = 0,
                v = b = 0,
                p = 0,
                H = 1;
            if ("gradient" == e.type_) {
                r = e.x1_ / o;
                f = e.y1_ / u;
                var B = a.getCoords_(e.x0_ / o, e.y0_ / u),
                    r = a.getCoords_(r, f),
                    r = 180 * Math.atan2(r.x - B.x, r.y - B.y) / Math.PI;
                0 > r && (r += 360);
                1E-6 > r && (r = 0)
            } else B =
                a.getCoords_(e.x0_, e.y0_), b = (B.x - f.x) / g, v = (B.y - f.y) / t, g /= o * ba, t /= u * ba, H = A.max(g, t), p = 2 * e.r0_ / H, H = 2 * e.r1_ / H - p;
            o = e.colors_;
            o.sort(function(a, c) {
                return a.offset - c.offset
            });
            u = o.length;
            B = o[0].color;
            f = o[u - 1].color;
            g = o[0].alpha * a.globalAlpha;
            a = o[u - 1].alpha * a.globalAlpha;
            for (var t = [], R = 0; R < u; R++) {
                var fa = o[R];
                t.push(fa.offset * H + p + " " + fa.color)
            }
            c.push('\x3cg_vml_:fill type\x3d"', e.type_, '"', ' method\x3d"none" focus\x3d"100%"', ' color\x3d"', B, '"', ' color2\x3d"', f, '"', ' colors\x3d"', t.join(","), '"', ' opacity\x3d"',
                a, '"', ' g_o_:opacity2\x3d"', g, '"', ' angle\x3d"', r, '"', ' focusposition\x3d"', b, ",", v, '" /\x3e')
        } else e instanceof D ? g && t && c.push("\x3cg_vml_:fill", ' position\x3d"', -f.x / g * o * o, ",", -f.y / t * u * u, '"', ' type\x3d"tile"', ' src\x3d"', e.src_, '" /\x3e') : (e = w(a.fillStyle), c.push('\x3cg_vml_:fill color\x3d"', e.color, '" opacity\x3d"', e.alpha * a.globalAlpha, '" /\x3e'))
    }

    function B(a, c, b) {
        isFinite(c[0][0]) && (isFinite(c[0][1]) && isFinite(c[1][0]) && isFinite(c[1][1]) && isFinite(c[2][0]) && isFinite(c[2][1])) && (a.m_ = c, b && (a.lineScale_ =
            f(oa(c[0][0] * c[1][1] - c[0][1] * c[1][0]))))
    }

    function P(a) {
        this.type_ = a;
        this.r1_ = this.y1_ = this.x1_ = this.r0_ = this.y0_ = this.x0_ = 0;
        this.colors_ = []
    }

    function D(a, c) {
        if (!a || 1 != a.nodeType || "IMG" != a.tagName) throw new F("TYPE_MISMATCH_ERR");
        if ("complete" != a.readyState) throw new F("INVALID_STATE_ERR");
        switch (c) {
            case "repeat":
            case null:
            case "":
                this.repetition_ = "repeat";
                break;
            case "repeat-x":
            case "repeat-y":
            case "no-repeat":
                this.repetition_ = c;
                break;
            default:
                throw new F("SYNTAX_ERR");
        }
        this.src_ = a.src;
        this.width_ = a.width;
        this.height_ = a.height
    }

    function F(a) {
        this.code = this[a];
        this.message = a + ": DOM Exception " + this.code
    }
    var A = Math,
        O = A.round,
        aa = A.sin,
        K = A.cos,
        oa = A.abs,
        f = A.sqrt,
        ba = 10,
        M = ba / 2,
        Z = Array.prototype.slice;
    r(document);
    var G = {
        init: function(a) {
            /MSIE/.test(navigator.userAgent) && !window.opera && (a = a || document, a.createElement("canvas"), a.attachEvent("onreadystatechange", g(this.init_, this, a)))
        },
        init_: function(a) {
            a = a.getElementsByTagName("canvas");
            for (var c = 0; c < a.length; c++) this.initElement(a[c])
        },
        initElement: function(f) {
            if (!f.getContext) {
                f.getContext =
                    b;
                r(f.ownerDocument);
                f.innerHTML = "";
                f.attachEvent("onpropertychange", a);
                f.attachEvent("onresize", c);
                var e = f.attributes;
                e.width && e.width.specified ? f.style.width = e.width.nodeValue + "px" : f.width = f.clientWidth;
                e.height && e.height.specified ? f.style.height = e.height.nodeValue + "px" : f.height = f.clientHeight
            }
            return f
        }
    };
    G.init();
    for (var pa = [], S = 0; 16 > S; S++)
        for (var ha = 0; 16 > ha; ha++) pa[16 * S + ha] = S.toString(16) + ha.toString(16);
    var L = {
            aliceblue: "#F0F8FF",
            antiquewhite: "#FAEBD7",
            aquamarine: "#7FFFD4",
            azure: "#F0FFFF",
            beige: "#F5F5DC",
            bisque: "#FFE4C4",
            black: "#000000",
            blanchedalmond: "#FFEBCD",
            blueviolet: "#8A2BE2",
            brown: "#A52A2A",
            burlywood: "#DEB887",
            cadetblue: "#5F9EA0",
            chartreuse: "#7FFF00",
            chocolate: "#D2691E",
            coral: "#FF7F50",
            cornflowerblue: "#6495ED",
            cornsilk: "#FFF8DC",
            crimson: "#DC143C",
            cyan: "#00FFFF",
            darkblue: "#00008B",
            darkcyan: "#008B8B",
            darkgoldenrod: "#B8860B",
            darkgray: "#A9A9A9",
            darkgreen: "#006400",
            darkgrey: "#A9A9A9",
            darkkhaki: "#BDB76B",
            darkmagenta: "#8B008B",
            darkolivegreen: "#556B2F",
            darkorange: "#FF8C00",
            darkorchid: "#9932CC",
            darkred: "#8B0000",
            darksalmon: "#E9967A",
            darkseagreen: "#8FBC8F",
            darkslateblue: "#483D8B",
            darkslategray: "#2F4F4F",
            darkslategrey: "#2F4F4F",
            darkturquoise: "#00CED1",
            darkviolet: "#9400D3",
            deeppink: "#FF1493",
            deepskyblue: "#00BFFF",
            dimgray: "#696969",
            dimgrey: "#696969",
            dodgerblue: "#1E90FF",
            firebrick: "#B22222",
            floralwhite: "#FFFAF0",
            forestgreen: "#228B22",
            gainsboro: "#DCDCDC",
            ghostwhite: "#F8F8FF",
            gold: "#FFD700",
            goldenrod: "#DAA520",
            grey: "#808080",
            greenyellow: "#ADFF2F",
            honeydew: "#F0FFF0",
            hotpink: "#FF69B4",
            indianred: "#CD5C5C",
            indigo: "#4B0082",
            ivory: "#FFFFF0",
            khaki: "#F0E68C",
            lavender: "#E6E6FA",
            lavenderblush: "#FFF0F5",
            lawngreen: "#7CFC00",
            lemonchiffon: "#FFFACD",
            lightblue: "#ADD8E6",
            lightcoral: "#F08080",
            lightcyan: "#E0FFFF",
            lightgoldenrodyellow: "#FAFAD2",
            lightgreen: "#90EE90",
            lightgrey: "#D3D3D3",
            lightpink: "#FFB6C1",
            lightsalmon: "#FFA07A",
            lightseagreen: "#20B2AA",
            lightskyblue: "#87CEFA",
            lightslategray: "#778899",
            lightslategrey: "#778899",
            lightsteelblue: "#B0C4DE",
            lightyellow: "#FFFFE0",
            limegreen: "#32CD32",
            linen: "#FAF0E6",
            magenta: "#FF00FF",
            mediumaquamarine: "#66CDAA",
            mediumblue: "#0000CD",
            mediumorchid: "#BA55D3",
            mediumpurple: "#9370DB",
            mediumseagreen: "#3CB371",
            mediumslateblue: "#7B68EE",
            mediumspringgreen: "#00FA9A",
            mediumturquoise: "#48D1CC",
            mediumvioletred: "#C71585",
            midnightblue: "#191970",
            mintcream: "#F5FFFA",
            mistyrose: "#FFE4E1",
            moccasin: "#FFE4B5",
            navajowhite: "#FFDEAD",
            oldlace: "#FDF5E6",
            olivedrab: "#6B8E23",
            orange: "#FFA500",
            orangered: "#FF4500",
            orchid: "#DA70D6",
            palegoldenrod: "#EEE8AA",
            palegreen: "#98FB98",
            paleturquoise: "#AFEEEE",
            palevioletred: "#DB7093",
            papayawhip: "#FFEFD5",
            peachpuff: "#FFDAB9",
            peru: "#CD853F",
            pink: "#FFC0CB",
            plum: "#DDA0DD",
            powderblue: "#B0E0E6",
            rosybrown: "#BC8F8F",
            royalblue: "#4169E1",
            saddlebrown: "#8B4513",
            salmon: "#FA8072",
            sandybrown: "#F4A460",
            seagreen: "#2E8B57",
            seashell: "#FFF5EE",
            sienna: "#A0522D",
            skyblue: "#87CEEB",
            slateblue: "#6A5ACD",
            slategray: "#708090",
            slategrey: "#708090",
            snow: "#FFFAFA",
            springgreen: "#00FF7F",
            steelblue: "#4682B4",
            tan: "#D2B48C",
            thistle: "#D8BFD8",
            tomato: "#FF6347",
            turquoise: "#40E0D0",
            violet: "#EE82EE",
            wheat: "#F5DEB3",
            whitesmoke: "#F5F5F5",
            yellowgreen: "#9ACD32"
        },
        ca = {},
        S = E.prototype;
    S.clearRect = function() {
        this.textMeasureEl_ && (this.textMeasureEl_.removeNode(!0), this.textMeasureEl_ = null);
        this.element_.innerHTML = ""
    };
    S.beginPath = function() {
        this.currentPath_ = []
    };
    S.moveTo = function(a, c) {
        var f = this.getCoords_(a, c);
        this.currentPath_.push({
            type: "moveTo",
            x: f.x,
            y: f.y
        });
        this.currentX_ = f.x;
        this.currentY_ = f.y
    };
    S.lineTo = function(a, c) {
        var f = this.getCoords_(a, c);
        this.currentPath_.push({
            type: "lineTo",
            x: f.x,
            y: f.y
        });
        this.currentX_ = f.x;
        this.currentY_ = f.y
    };
    S.bezierCurveTo = function(a,
        c, f, b, e, o) {
        e = this.getCoords_(e, o);
        a = this.getCoords_(a, c);
        f = this.getCoords_(f, b);
        N(this, a, f, e)
    };
    S.quadraticCurveTo = function(a, c, f, b) {
        a = this.getCoords_(a, c);
        f = this.getCoords_(f, b);
        b = {
            x: this.currentX_ + 2 / 3 * (a.x - this.currentX_),
            y: this.currentY_ + 2 / 3 * (a.y - this.currentY_)
        };
        N(this, b, {
            x: b.x + (f.x - this.currentX_) / 3,
            y: b.y + (f.y - this.currentY_) / 3
        }, f)
    };
    S.arc = function(a, c, f, b, e, o) {
        f *= ba;
        var u = o ? "at" : "wa",
            g = a + K(b) * f - M,
            t = c + aa(b) * f - M;
        b = a + K(e) * f - M;
        e = c + aa(e) * f - M;
        g == b && !o && (g += 0.125);
        a = this.getCoords_(a, c);
        g = this.getCoords_(g,
            t);
        b = this.getCoords_(b, e);
        this.currentPath_.push({
            type: u,
            x: a.x,
            y: a.y,
            radius: f,
            xStart: g.x,
            yStart: g.y,
            xEnd: b.x,
            yEnd: b.y
        })
    };
    S.rect = function(a, c, f, b) {
        this.moveTo(a, c);
        this.lineTo(a + f, c);
        this.lineTo(a + f, c + b);
        this.lineTo(a, c + b);
        this.closePath()
    };
    S.strokeRect = function(a, c, f, b) {
        var e = this.currentPath_;
        this.beginPath();
        this.moveTo(a, c);
        this.lineTo(a + f, c);
        this.lineTo(a + f, c + b);
        this.lineTo(a, c + b);
        this.closePath();
        this.stroke();
        this.currentPath_ = e
    };
    S.fillRect = function(a, c, f, b) {
        var e = this.currentPath_;
        this.beginPath();
        this.moveTo(a, c);
        this.lineTo(a + f, c);
        this.lineTo(a + f, c + b);
        this.lineTo(a, c + b);
        this.closePath();
        this.fill();
        this.currentPath_ = e
    };
    S.createLinearGradient = function(a, c, f, b) {
        var e = new P("gradient");
        e.x0_ = a;
        e.y0_ = c;
        e.x1_ = f;
        e.y1_ = b;
        return e
    };
    S.createRadialGradient = function(a, c, f, b, e, o) {
        var u = new P("gradientradial");
        u.x0_ = a;
        u.y0_ = c;
        u.r0_ = f;
        u.x1_ = b;
        u.y1_ = e;
        u.r1_ = o;
        return u
    };
    S.drawImage = function(a, c) {
        var f, b, e, o, u, g, t, r;
        e = a.runtimeStyle.width;
        o = a.runtimeStyle.height;
        a.runtimeStyle.width = "auto";
        a.runtimeStyle.height =
            "auto";
        var v = a.width,
            p = a.height;
        a.runtimeStyle.width = e;
        a.runtimeStyle.height = o;
        if (3 == arguments.length) f = arguments[1], b = arguments[2], u = g = 0, t = e = v, r = o = p;
        else if (5 == arguments.length) f = arguments[1], b = arguments[2], e = arguments[3], o = arguments[4], u = g = 0, t = v, r = p;
        else if (9 == arguments.length) u = arguments[1], g = arguments[2], t = arguments[3], r = arguments[4], f = arguments[5], b = arguments[6], e = arguments[7], o = arguments[8];
        else throw Error("Invalid number of arguments");
        var H = this.getCoords_(f, b),
            D = [];
        D.push(" \x3cg_vml_:group",
            ' coordsize\x3d"', 10 * ba, ",", 10 * ba, '"', ' coordorigin\x3d"0,0"', ' style\x3d"width:', 10, "px;height:", 10, "px;position:absolute;");
        if (1 != this.m_[0][0] || this.m_[0][1] || 1 != this.m_[1][1] || this.m_[1][0]) {
            var R = [];
            R.push("M11\x3d", this.m_[0][0], ",", "M12\x3d", this.m_[1][0], ",", "M21\x3d", this.m_[0][1], ",", "M22\x3d", this.m_[1][1], ",", "Dx\x3d", O(H.x / ba), ",", "Dy\x3d", O(H.y / ba), "");
            var B = this.getCoords_(f + e, b),
                P = this.getCoords_(f, b + o);
            f = this.getCoords_(f + e, b + o);
            H.x = A.max(H.x, B.x, P.x, f.x);
            H.y = A.max(H.y, B.y, P.y, f.y);
            D.push("padding:0 ", O(H.x / ba), "px ", O(H.y / ba), "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(", R.join(""), ", sizingmethod\x3d'clip');")
        } else D.push("top:", O(H.y / ba), "px;left:", O(H.x / ba), "px;");
        D.push(' "\x3e', '\x3cg_vml_:image src\x3d"', a.src, '"', ' style\x3d"width:', ba * e, "px;", " height:", ba * o, 'px"', ' cropleft\x3d"', u / v, '"', ' croptop\x3d"', g / p, '"', ' cropright\x3d"', (v - u - t) / v, '"', ' cropbottom\x3d"', (p - g - r) / p, '"', " /\x3e", "\x3c/g_vml_:group\x3e");
        this.element_.insertAdjacentHTML("BeforeEnd", D.join(""))
    };
    S.stroke = function(a) {
        for (var c = {
                x: null,
                y: null
            }, f = {
                x: null,
                y: null
            }, b = 0; b < this.currentPath_.length; b += 5E3) {
            var e = [];
            e.push("\x3cg_vml_:shape", ' filled\x3d"', !!a, '"', ' style\x3d"position:absolute;width:', 10, "px;height:", 10, 'px;"', ' coordorigin\x3d"0,0"', ' coordsize\x3d"', 10 * ba, ",", 10 * ba, '"', ' stroked\x3d"', !a, '"', ' path\x3d"');
            for (var o = b; o < Math.min(b + 5E3, this.currentPath_.length); o++) {
                0 == o % 5E3 && 0 < o && e.push(" m ", O(this.currentPath_[o - 1].x), ",", O(this.currentPath_[o - 1].y));
                var g = this.currentPath_[o];
                switch (g.type) {
                    case "moveTo":
                        e.push(" m ", O(g.x), ",", O(g.y));
                        break;
                    case "lineTo":
                        e.push(" l ", O(g.x), ",", O(g.y));
                        break;
                    case "close":
                        e.push(" x ");
                        g = null;
                        break;
                    case "bezierCurveTo":
                        e.push(" c ", O(g.cp1x), ",", O(g.cp1y), ",", O(g.cp2x), ",", O(g.cp2y), ",", O(g.x), ",", O(g.y));
                        break;
                    case "at":
                    case "wa":
                        e.push(" ", g.type, " ", O(g.x - this.arcScaleX_ * g.radius), ",", O(g.y - this.arcScaleY_ * g.radius), " ", O(g.x + this.arcScaleX_ * g.radius), ",", O(g.y + this.arcScaleY_ * g.radius), " ", O(g.xStart), ",", O(g.yStart), " ", O(g.xEnd),
                            ",", O(g.yEnd))
                }
                if (g) {
                    if (null == c.x || g.x < c.x) c.x = g.x;
                    if (null == f.x || g.x > f.x) f.x = g.x;
                    if (null == c.y || g.y < c.y) c.y = g.y;
                    if (null == f.y || g.y > f.y) f.y = g.y
                }
            }
            e.push(' "\x3e');
            a ? u(this, e, c, f) : U(this, e);
            e.push("\x3c/g_vml_:shape\x3e");
            this.element_.insertAdjacentHTML("beforeEnd", e.join(""))
        }
    };
    S.fill = function() {
        this.stroke(!0)
    };
    S.closePath = function() {
        this.currentPath_.push({
            type: "close"
        })
    };
    S.getCoords_ = function(a, c) {
        var f = this.m_;
        return {
            x: ba * (a * f[0][0] + c * f[1][0] + f[2][0]) - M,
            y: ba * (a * f[0][1] + c * f[1][1] + f[2][1]) - M
        }
    };
    S.save =
        function() {
            var a = {};
            t(this, a);
            this.aStack_.push(a);
            this.mStack_.push(this.m_);
            this.m_ = e(o(), this.m_)
        };
    S.restore = function() {
        this.aStack_.length && (t(this.aStack_.pop(), this), this.m_ = this.mStack_.pop())
    };
    S.translate = function(a, c) {
        B(this, e([
            [1, 0, 0],
            [0, 1, 0],
            [a, c, 1]
        ], this.m_), !1)
    };
    S.rotate = function(a) {
        var c = K(a);
        a = aa(a);
        B(this, e([
            [c, a, 0],
            [-a, c, 0],
            [0, 0, 1]
        ], this.m_), !1)
    };
    S.scale = function(a, c) {
        this.arcScaleX_ *= a;
        this.arcScaleY_ *= c;
        B(this, e([
            [a, 0, 0],
            [0, c, 0],
            [0, 0, 1]
        ], this.m_), !0)
    };
    S.transform = function(a, c, f,
        b, o, g) {
        B(this, e([
            [a, c, 0],
            [f, b, 0],
            [o, g, 1]
        ], this.m_), !0)
    };
    S.setTransform = function(a, c, f, b, e, o) {
        B(this, [
            [a, c, 0],
            [f, b, 0],
            [e, o, 1]
        ], !0)
    };
    S.drawText_ = function(a, c, f, b, e) {
        var o = this.m_;
        b = 0;
        var g = 1E3,
            t = 0,
            A = [],
            r;
        r = this.font;
        if (ca[r]) r = ca[r];
        else {
            var v = document.createElement("div").style;
            try {
                v.font = r
            } catch (D) {}
            r = ca[r] = {
                style: v.fontStyle || "normal",
                variant: v.fontVariant || "normal",
                weight: v.fontWeight || "normal",
                size: v.fontSize || 10,
                family: v.fontFamily || "sans-serif"
            }
        }
        var v = r,
            H = this.element_;
        r = {};
        for (var B in v) r[B] =
            v[B];
        B = parseFloat(H.currentStyle.fontSize);
        H = parseFloat(v.size);
        r.size = "number" == typeof v.size ? v.size : -1 != v.size.indexOf("px") ? H : -1 != v.size.indexOf("em") ? B * H : -1 != v.size.indexOf("%") ? B / 100 * H : -1 != v.size.indexOf("pt") ? H / 0.75 : B;
        r.size *= 0.981;
        B = r.style + " " + r.variant + " " + r.weight + " " + r.size + "px " + r.family;
        H = this.element_.currentStyle;
        v = this.textAlign.toLowerCase();
        switch (v) {
            case "left":
            case "center":
            case "right":
                break;
            case "end":
                v = "ltr" == H.direction ? "right" : "left";
                break;
            case "start":
                v = "rtl" == H.direction ?
                    "right" : "left";
                break;
            default:
                v = "left"
        }
        switch (this.textBaseline) {
            case "hanging":
            case "top":
                t = r.size / 1.75;
                break;
            case "middle":
                break;
            default:
            case null:
            case "alphabetic":
            case "ideographic":
            case "bottom":
                t = -r.size / 2.25
        }
        switch (v) {
            case "right":
                b = 1E3;
                g = 0.05;
                break;
            case "center":
                b = g = 500
        }
        c = this.getCoords_(c + 0, f + t);
        A.push('\x3cg_vml_:line from\x3d"', -b, ' 0" to\x3d"', g, ' 0.05" ', ' coordsize\x3d"100 100" coordorigin\x3d"0 0"', ' filled\x3d"', !e, '" stroked\x3d"', !!e, '" style\x3d"position:absolute;width:1px;height:1px;"\x3e');
        e ? U(this, A) : u(this, A, {
            x: -b,
            y: 0
        }, {
            x: g,
            y: r.size
        });
        e = o[0][0].toFixed(3) + "," + o[1][0].toFixed(3) + "," + o[0][1].toFixed(3) + "," + o[1][1].toFixed(3) + ",0,0";
        c = O(c.x / ba) + "," + O(c.y / ba);
        A.push('\x3cg_vml_:skew on\x3d"t" matrix\x3d"', e, '" ', ' offset\x3d"', c, '" origin\x3d"', b, ' 0" /\x3e', '\x3cg_vml_:path textpathok\x3d"true" /\x3e', '\x3cg_vml_:textpath on\x3d"true" string\x3d"', p(a), '" style\x3d"v-text-align:', v, ";font:", p(B), '" /\x3e\x3c/g_vml_:line\x3e');
        this.element_.insertAdjacentHTML("beforeEnd", A.join(""))
    };
    S.fillText = function(a, c, f, b) {
        this.drawText_(a, c, f, b, !1)
    };
    S.strokeText = function(a, c, f, b) {
        this.drawText_(a, c, f, b, !0)
    };
    S.measureText = function(a) {
        this.textMeasureEl_ || (this.element_.insertAdjacentHTML("beforeEnd", '\x3cspan style\x3d"position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;"\x3e\x3c/span\x3e'), this.textMeasureEl_ = this.element_.lastChild);
        var c = this.element_.ownerDocument;
        this.textMeasureEl_.innerHTML = "";
        this.textMeasureEl_.style.font = this.font;
        this.textMeasureEl_.appendChild(c.createTextNode(a));
        return {
            width: this.textMeasureEl_.offsetWidth
        }
    };
    S.clip = function() {};
    S.arcTo = function() {};
    S.createPattern = function(a, c) {
        return new D(a, c)
    };
    P.prototype.addColorStop = function(a, c) {
        c = w(c);
        this.colors_.push({
            offset: a,
            color: c.color,
            alpha: c.alpha
        })
    };
    S = F.prototype = Error();
    S.INDEX_SIZE_ERR = 1;
    S.DOMSTRING_SIZE_ERR = 2;
    S.HIERARCHY_REQUEST_ERR = 3;
    S.WRONG_DOCUMENT_ERR = 4;
    S.INVALID_CHARACTER_ERR = 5;
    S.NO_DATA_ALLOWED_ERR = 6;
    S.NO_MODIFICATION_ALLOWED_ERR = 7;
    S.NOT_FOUND_ERR = 8;
    S.NOT_SUPPORTED_ERR = 9;
    S.INUSE_ATTRIBUTE_ERR = 10;
    S.INVALID_STATE_ERR = 11;
    S.SYNTAX_ERR = 12;
    S.INVALID_MODIFICATION_ERR = 13;
    S.NAMESPACE_ERR = 14;
    S.INVALID_ACCESS_ERR = 15;
    S.VALIDATION_ERR = 16;
    S.TYPE_MISMATCH_ERR = 17;
    G_vmlCanvasManager = G;
    CanvasRenderingContext2D = E;
    CanvasGradient = P;
    CanvasPattern = D;
    DOMException = F
}();
(function() {
    jQuery.color = {};
    jQuery.color.make = function(b, p, r, a) {
        var c = {};
        c.r = b || 0;
        c.g = p || 0;
        c.b = r || 0;
        c.a = null != a ? a : 1;
        c.add = function(a, b) {
            for (var g = 0; g < a.length; ++g) c[a.charAt(g)] += b;
            return c.normalize()
        };
        c.scale = function(a, b) {
            for (var g = 0; g < a.length; ++g) c[a.charAt(g)] *= b;
            return c.normalize()
        };
        c.toString = function() {
            return 1 <= c.a ? "rgb(" + [c.r, c.g, c.b].join() + ")" : "rgba(" + [c.r, c.g, c.b, c.a].join() + ")"
        };
        c.normalize = function() {
            function a(c, b, o) {
                return b < c ? c : b > o ? o : b
            }
            c.r = a(0, parseInt(c.r), 255);
            c.g = a(0, parseInt(c.g),
                255);
            c.b = a(0, parseInt(c.b), 255);
            c.a = a(0, c.a, 1);
            return c
        };
        c.clone = function() {
            return jQuery.color.make(c.r, c.b, c.g, c.a)
        };
        return c.normalize()
    };
    jQuery.color.extract = function(b, p) {
        var r;
        do {
            r = b.css(p).toLowerCase();
            if ("" != r && "transparent" != r) break;
            b = b.parent()
        } while (!jQuery.nodeName(b.get(0), "body"));
        "rgba(0, 0, 0, 0)" == r && (r = "transparent");
        return jQuery.color.parse(r)
    };
    jQuery.color.parse = function(g) {
        var p, r = jQuery.color.make;
        if (p = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(g)) return r(parseInt(p[1],
            10), parseInt(p[2], 10), parseInt(p[3], 10));
        if (p = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(g)) return r(parseInt(p[1], 10), parseInt(p[2], 10), parseInt(p[3], 10), parseFloat(p[4]));
        if (p = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(g)) return r(2.55 * parseFloat(p[1]), 2.55 * parseFloat(p[2]), 2.55 * parseFloat(p[3]));
        if (p = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(g)) return r(2.55 *
            parseFloat(p[1]), 2.55 * parseFloat(p[2]), 2.55 * parseFloat(p[3]), parseFloat(p[4]));
        if (p = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(g)) return r(parseInt(p[1], 16), parseInt(p[2], 16), parseInt(p[3], 16));
        if (p = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(g)) return r(parseInt(p[1] + p[1], 16), parseInt(p[2] + p[2], 16), parseInt(p[3] + p[3], 16));
        g = jQuery.trim(g).toLowerCase();
        if ("transparent" == g) return r(255, 255, 255, 0);
        p = b[g];
        return r(p[0], p[1], p[2])
    };
    var b = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245,
            245, 220
        ],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238,
            144
        ],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0]
    }
})();
(function(b) {
    function g(g, a, c, o) {
        function e(a, c) {
            c = [ea].concat(c);
            for (var f = 0; f < a.length; ++f) a[f].apply(this, c)
        }

        function t(a) {
            for (var c = [], f = 0; f < a.length; ++f) {
                var o = b.extend(!0, {}, G.series);
                a[f].data ? (o.data = a[f].data, delete a[f].data, b.extend(!0, o, a[f]), a[f].data = o.data) : o.data = a[f];
                c.push(o)
            }
            Z = c;
            c = Z.length;
            f = [];
            o = [];
            for (a = 0; a < Z.length; ++a) {
                var g = Z[a].color;
                null != g && (--c, "number" == typeof g ? o.push(g) : f.push(b.color.parse(Z[a].color)))
            }
            for (a = 0; a < o.length; ++a) c = Math.max(c, o[a] + 1);
            f = [];
            for (a = o = 0; f.length <
                c;) g = G.colors.length == a ? b.color.make(100, 100, 100) : b.color.parse(G.colors[a]), g.scale("rgb", 1 + 0.2 * (1 == o % 2 ? -1 : 1) * Math.ceil(o / 2)), f.push(g), ++a, a >= G.colors.length && (a = 0, ++o);
            for (a = c = 0; a < Z.length; ++a) {
                o = Z[a];
                null == o.color ? (o.color = f[c].toString(), ++c) : "number" == typeof o.color && (o.color = f[o.color].toString());
                if (null == o.lines.show) {
                    var u, g = !0;
                    for (u in o)
                        if (o[u].show) {
                            g = !1;
                            break
                        }
                    g && (o.lines.show = !0)
                }
                o.xaxis = v(o, "xaxis");
                o.yaxis = v(o, "yaxis")
            }
            u = function(a, c, f) {
                c < a.datamin && (a.datamin = c);
                f > a.datamax && (a.datamax =
                    f)
            };
            a = Number.POSITIVE_INFINITY;
            var c = Number.NEGATIVE_INFINITY,
                t, A, r, p, D, B, P, F;
            for (D in Q) Q[D].datamin = a, Q[D].datamax = c, Q[D].used = !1;
            for (f = 0; f < Z.length; ++f) o = Z[f], o.datapoints = {
                points: []
            }, e(na.processRawData, [o, o.data, o.datapoints]);
            for (f = 0; f < Z.length; ++f) {
                var o = Z[f],
                    O = o.data,
                    Y = o.datapoints.format;
                Y || (Y = [], Y.push({
                    x: !0,
                    number: !0,
                    required: !0
                }), Y.push({
                    y: !0,
                    number: !0,
                    required: !0
                }), o.bars.show && Y.push({
                    y: !0,
                    number: !0,
                    required: !1,
                    defaultValue: 0
                }), o.datapoints.format = Y);
                if (null == o.datapoints.pointsize) {
                    null ==
                        o.datapoints.pointsize && (o.datapoints.pointsize = Y.length);
                    p = o.datapoints.pointsize;
                    r = o.datapoints.points;
                    insertSteps = o.lines.show && o.lines.steps;
                    o.xaxis.used = o.yaxis.used = !0;
                    for (g = t = 0; g < O.length; ++g, t += p) {
                        F = O[g];
                        var y = null == F;
                        if (!y)
                            for (A = 0; A < p; ++A) {
                                B = F[A];
                                if (P = Y[A]) P.number && null != B && (B = +B, isNaN(B) && (B = null)), null == B && (P.required && (y = !0), null != P.defaultValue && (B = P.defaultValue));
                                r[t + A] = B
                            }
                        if (y)
                            for (A = 0; A < p; ++A) B = r[t + A], null != B && (P = Y[A], P.x && u(o.xaxis, B, B), P.y && u(o.yaxis, B, B)), r[t + A] = null;
                        else if (insertSteps &&
                            0 < t && null != r[t - p] && r[t - p] != r[t] && r[t - p + 1] != r[t + 1]) {
                            for (A = 0; A < p; ++A) r[t + p + A] = r[t + A];
                            r[t + 1] = r[t - p + 1];
                            t += p
                        }
                    }
                }
            }
            for (f = 0; f < Z.length; ++f) o = Z[f], e(na.processDatapoints, [o, o.datapoints]);
            for (f = 0; f < Z.length; ++f) {
                o = Z[f];
                r = o.datapoints.points;
                p = o.datapoints.pointsize;
                F = t = a;
                y = O = c;
                for (g = 0; g < r.length; g += p)
                    if (null != r[g])
                        for (A = 0; A < p; ++A)
                            if (B = r[g + A], P = Y[A]) P.x && (B < t && (t = B), B > O && (O = B)), P.y && (B < F && (F = B), B > y && (y = B));
                o.bars.show && (g = "left" == o.bars.align ? 0 : -o.bars.barWidth / 2, o.bars.horizontal ? (F += g, y += g + o.bars.barWidth) :
                    (t += g, O += g + o.bars.barWidth));
                u(o.xaxis, t, O);
                u(o.yaxis, F, y)
            }
            for (D in Q) Q[D].datamin == a && (Q[D].datamin = null), Q[D].datamax == c && (Q[D].datamax = null)
        }

        function v(a, c) {
            var f = a[c];
            return !f || 1 == f ? Q[c] : "number" == typeof f ? Q[c.charAt(0) + f + c.slice(1)] : f
        }

        function J() {
            function a(c, f) {
                function b(a) {
                    return a
                }
                var e, o, g = f.transform || b,
                    u = f.inverseTransform;
                c == Q.xaxis || c == Q.x2axis ? (e = c.scale = ja / (g(c.max) - g(c.min)), o = g(c.min), c.p2c = g == b ? function(a) {
                    return (a - o) * e
                } : function(a) {
                    return (g(a) - o) * e
                }, c.c2p = u ? function(a) {
                    return u(o +
                        a / e)
                } : function(a) {
                    return o + a / e
                }) : (e = c.scale = ka / (g(c.max) - g(c.min)), o = g(c.max), c.p2c = g == b ? function(a) {
                    return (o - a) * e
                } : function(a) {
                    return (o - g(a)) * e
                }, c.c2p = u ? function(a) {
                    return u(o - a / e)
                } : function(a) {
                    return o - a / e
                })
            }
            for (var c in Q) {
                var f = Q[c],
                    e = G[c],
                    o = +(null != e.min ? e.min : f.datamin),
                    u = +(null != e.max ? e.max : f.datamax),
                    t = u - o;
                if (0 == t) {
                    if (t = 0 == u ? 1 : 0.01, null == e.min && (o -= t), null == e.max || null != e.min) u += t
                } else {
                    var A = e.autoscaleMargin;
                    null != A && (null == e.min && (o -= t * A, 0 > o && (null != f.datamin && 0 <= f.datamin) && (o = 0)), null ==
                        e.max && (u += t * A, 0 < u && (null != f.datamax && 0 >= f.datamax) && (u = 0)))
                }
                f.min = o;
                f.max = u
            }
            if (G.grid.show) {
                for (c in Q) {
                    y(Q[c], G[c]);
                    f = Q[c];
                    e = G[c];
                    f.ticks = [];
                    if (f.used) {
                        if (null == e.ticks) f.ticks = f.tickGenerator(f);
                        else if ("number" == typeof e.ticks) 0 < e.ticks && (f.ticks = f.tickGenerator(f));
                        else if (e.ticks) {
                            o = e.ticks;
                            b.isFunction(o) && (o = o({
                                min: f.min,
                                max: f.max
                            }));
                            t = u = void 0;
                            for (u = 0; u < o.length; ++u) {
                                var A = null,
                                    v = o[u];
                                "object" == typeof v ? (t = v[0], 1 < v.length && (A = v[1])) : t = v;
                                null == A && (A = f.tickFormatter(t, f));
                                f.ticks[u] = {
                                    v: t,
                                    label: A
                                }
                            }
                        }
                        null !=
                            e.autoscaleMargin && 0 < f.ticks.length && (null == e.min && (f.min = Math.min(f.min, f.ticks[0].v)), null == e.max && 1 < f.ticks.length && (f.max = Math.max(f.max, f.ticks[f.ticks.length - 1].v)))
                    }
                    f = Q[c];
                    e = G[c];
                    o = void 0;
                    u = [];
                    t = void 0;
                    f.labelWidth = e.labelWidth;
                    f.labelHeight = e.labelHeight;
                    if (f == Q.xaxis || f == Q.x2axis) {
                        if (null == f.labelWidth && (f.labelWidth = da / (0 < f.ticks.length ? f.ticks.length : 1)), null == f.labelHeight) {
                            u = [];
                            for (o = 0; o < f.ticks.length; ++o)(t = f.ticks[o].label) && u.push('\x3cdiv class\x3d"tickLabel" style\x3d"float:left;width:' +
                                f.labelWidth + 'px"\x3e' + t + "\x3c/div\x3e");
                            0 < u.length && (e = b('\x3cdiv style\x3d"position:absolute;top:-10000px;width:10000px;font-size:smaller"\x3e' + u.join("") + '\x3cdiv style\x3d"clear:left"\x3e\x3c/div\x3e\x3c/div\x3e').appendTo(g), f.labelHeight = e.height(), e.remove())
                        }
                    } else if (null == f.labelWidth || null == f.labelHeight) {
                        for (o = 0; o < f.ticks.length; ++o)(t = f.ticks[o].label) && u.push('\x3cdiv class\x3d"tickLabel"\x3e' + t + "\x3c/div\x3e");
                        0 < u.length && (e = b('\x3cdiv style\x3d"position:absolute;top:-10000px;font-size:smaller"\x3e' +
                            u.join("") + "\x3c/div\x3e").appendTo(g), null == f.labelWidth && (f.labelWidth = e.width()), null == f.labelHeight && (f.labelHeight = e.find("div").height()), e.remove())
                    }
                    null == f.labelWidth && (f.labelWidth = 0);
                    null == f.labelHeight && (f.labelHeight = 0)
                }
                f = G.grid.borderWidth;
                for (i = 0; i < Z.length; ++i) f = Math.max(f, 2 * (Z[i].points.radius + Z[i].points.lineWidth / 2));
                T.left = T.right = T.top = T.bottom = f;
                e = G.grid.labelMargin + G.grid.borderWidth;
                0 < Q.xaxis.labelHeight && (T.bottom = Math.max(f, Q.xaxis.labelHeight + e));
                0 < Q.yaxis.labelWidth && (T.left =
                    Math.max(f, Q.yaxis.labelWidth + e));
                0 < Q.x2axis.labelHeight && (T.top = Math.max(f, Q.x2axis.labelHeight + e));
                0 < Q.y2axis.labelWidth && (T.right = Math.max(f, Q.y2axis.labelWidth + e));
                ja = da - T.left - T.right;
                ka = ia - T.bottom - T.top
            } else T.left = T.right = T.top = T.bottom = 0, ja = da, ka = ia;
            for (c in Q) a(Q[c], G[c]);
            if (G.grid.show) {
                c = function(a, c) {
                    for (var f = 0; f < a.ticks.length; ++f) {
                        var b = a.ticks[f];
                        b.label && !(b.v < a.min || b.v > a.max) && p.push(c(b, a))
                    }
                };
                g.find(".tickLabels").remove();
                var p = ['\x3cdiv class\x3d"tickLabels" style\x3d"font-size:smaller;color:' +
                        G.grid.color + '"\x3e'
                    ],
                    B = G.grid.labelMargin + G.grid.borderWidth;
                c(Q.xaxis, function(a, c) {
                    return '\x3cdiv style\x3d"position:absolute;top:' + (T.top + ka + B) + "px;left:" + Math.round(T.left + c.p2c(a.v) - c.labelWidth / 2) + "px;width:" + c.labelWidth + 'px;text-align:center" class\x3d"tickLabel"\x3e' + a.label + "\x3c/div\x3e"
                });
                c(Q.yaxis, function(a, c) {
                    return '\x3cdiv style\x3d"position:absolute;top:' + Math.round(T.top + c.p2c(a.v) - c.labelHeight / 2) + "px;right:" + (T.right + ja + B) + "px;width:" + c.labelWidth + 'px;text-align:right" class\x3d"tickLabel"\x3e' +
                        a.label + "\x3c/div\x3e"
                });
                c(Q.x2axis, function(a, c) {
                    return '\x3cdiv style\x3d"position:absolute;bottom:' + (T.bottom + ka + B) + "px;left:" + Math.round(T.left + c.p2c(a.v) - c.labelWidth / 2) + "px;width:" + c.labelWidth + 'px;text-align:center" class\x3d"tickLabel"\x3e' + a.label + "\x3c/div\x3e"
                });
                c(Q.y2axis, function(a, c) {
                    return '\x3cdiv style\x3d"position:absolute;top:' + Math.round(T.top + c.p2c(a.v) - c.labelHeight / 2) + "px;left:" + (T.left + ja + B) + "px;width:" + c.labelWidth + 'px;text-align:left" class\x3d"tickLabel"\x3e' + a.label + "\x3c/div\x3e"
                });
                p.push("\x3c/div\x3e");
                g.append(p.join(""))
            }
            g.find(".legend").remove();
            if (G.legend.show) {
                c = [];
                f = !1;
                e = G.legend.labelFormatter;
                for (i = 0; i < Z.length; ++i)
                    if (o = Z[i], u = o.label) 0 == i % G.legend.noColumns && (f && c.push("\x3c/tr\x3e"), c.push("\x3ctr\x3e"), f = !0), e && (u = e(u, o)), c.push('\x3ctd class\x3d"legendColorBox"\x3e\x3cdiv style\x3d"border:1px solid ' + G.legend.labelBoxBorderColor + ';padding:1px"\x3e\x3cdiv style\x3d"width:4px;height:0;border:5px solid ' + o.color + ';overflow:hidden"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/td\x3e\x3ctd class\x3d"legendLabel"\x3e' +
                        u + "\x3c/td\x3e");
                f && c.push("\x3c/tr\x3e");
                0 != c.length && (f = '\x3ctable style\x3d"font-size:smaller;color:' + G.grid.color + '"\x3e' + c.join("") + "\x3c/table\x3e", null != G.legend.container ? b(G.legend.container).html(f) : (c = "", e = G.legend.position, o = G.legend.margin, null == o[0] && (o = [o, o]), "n" == e.charAt(0) ? c += "top:" + (o[1] + T.top) + "px;" : "s" == e.charAt(0) && (c += "bottom:" + (o[1] + T.bottom) + "px;"), "e" == e.charAt(1) ? c += "right:" + (o[0] + T.right) + "px;" : "w" == e.charAt(1) && (c += "left:" + (o[0] + T.left) + "px;"), f = b('\x3cdiv class\x3d"legend"\x3e' +
                    f.replace('style\x3d"', 'style\x3d"position:absolute;' + c + ";") + "\x3c/div\x3e").appendTo(g), 0 != G.legend.backgroundOpacity && (e = G.legend.backgroundColor, null == e && (e = (e = G.grid.backgroundColor) && "string" == typeof e ? b.color.parse(e) : b.color.extract(f, "background-color"), e.a = 1, e = e.toString()), o = f.children(), b('\x3cdiv style\x3d"position:absolute;width:' + o.width() + "px;height:" + o.height() + "px;" + c + "background-color:" + e + ';"\x3e \x3c/div\x3e').prependTo(f).css("opacity", G.legend.backgroundOpacity))))
            }
        }

        function y(a,
            c) {
            var f;
            f = "number" == typeof c.ticks && 0 < c.ticks ? c.ticks : a == Q.xaxis || a == Q.x2axis ? 0.3 * Math.sqrt(da) : 0.3 * Math.sqrt(ia);
            var e = (a.max - a.min) / f,
                o, g;
            if ("time" == c.mode) {
                var u = {
                    second: 1E3,
                    minute: 6E4,
                    hour: 36E5,
                    day: 864E5,
                    month: 2592E6,
                    year: 525949.2 * 6E4
                };
                g = [
                    [1, "second"],
                    [2, "second"],
                    [5, "second"],
                    [10, "second"],
                    [30, "second"],
                    [1, "minute"],
                    [2, "minute"],
                    [5, "minute"],
                    [10, "minute"],
                    [30, "minute"],
                    [1, "hour"],
                    [2, "hour"],
                    [4, "hour"],
                    [8, "hour"],
                    [12, "hour"],
                    [1, "day"],
                    [2, "day"],
                    [3, "day"],
                    [0.25, "month"],
                    [0.5, "month"],
                    [1, "month"],
                    [2, "month"],
                    [3, "month"],
                    [6, "month"],
                    [1, "year"]
                ];
                f = 0;
                null != c.minTickSize && (f = "number" == typeof c.tickSize ? c.tickSize : c.minTickSize[0] * u[c.minTickSize[1]]);
                for (o = 0; o < g.length - 1 && !(e < (g[o][0] * u[g[o][1]] + g[o + 1][0] * u[g[o + 1][1]]) / 2 && g[o][0] * u[g[o][1]] >= f); ++o);
                f = g[o][0];
                o = g[o][1];
                "year" == o && (g = Math.pow(10, Math.floor(Math.log(e / u.year) / Math.LN10)), e = e / u.year / g, f = (1.5 > e ? 1 : 3 > e ? 2 : 7.5 > e ? 5 : 10) * g);
                c.tickSize && (f = c.tickSize[0], o = c.tickSize[1]);
                e = function(a) {
                    var c = [],
                        f = a.tickSize[0],
                        b = a.tickSize[1],
                        e = new Date(a.min),
                        o = f * u[b];
                    "second" == b && e.setUTCSeconds(p(e.getUTCSeconds(), f));
                    "minute" == b && e.setUTCMinutes(p(e.getUTCMinutes(), f));
                    "hour" == b && e.setUTCHours(p(e.getUTCHours(), f));
                    "month" == b && e.setUTCMonth(p(e.getUTCMonth(), f));
                    "year" == b && e.setUTCFullYear(p(e.getUTCFullYear(), f));
                    e.setUTCMilliseconds(0);
                    o >= u.minute && e.setUTCSeconds(0);
                    o >= u.hour && e.setUTCMinutes(0);
                    o >= u.day && e.setUTCHours(0);
                    o >= 4 * u.day && e.setUTCDate(1);
                    o >= u.year && e.setUTCMonth(0);
                    var g = 0,
                        t = Number.NaN,
                        A;
                    do
                        if (A = t, t = e.getTime(), c.push({
                                v: t,
                                label: a.tickFormatter(t,
                                    a)
                            }), "month" == b)
                            if (1 > f) {
                                e.setUTCDate(1);
                                var r = e.getTime();
                                e.setUTCMonth(e.getUTCMonth() + 1);
                                var v = e.getTime();
                                e.setTime(t + g * u.hour + (v - r) * f);
                                g = e.getUTCHours();
                                e.setUTCHours(0)
                            } else e.setUTCMonth(e.getUTCMonth() + f);
                    else "year" == b ? e.setUTCFullYear(e.getUTCFullYear() + f) : e.setTime(t + o); while (t < a.max && t != A);
                    return c
                };
                g = function(a, f) {
                    var e = new Date(a);
                    if (null != c.timeformat) return b.plot.formatDate(e, c.timeformat, c.monthNames);
                    var o = f.tickSize[0] * u[f.tickSize[1]],
                        g = f.max - f.min,
                        t = c.twelveHourClock ? " %p" : "";
                    fmt = o < u.minute ? "%h:%M:%S" + t : o < u.day ? g < 2 * u.day ? "%h:%M" + t : "%b %d %h:%M" + t : o < u.month ? "%b %d" : o < u.year ? g < u.year ? "%b" : "%b %y" : "%y";
                    return b.plot.formatDate(e, fmt, c.monthNames)
                }
            } else {
                var t = c.tickDecimals,
                    A = -Math.floor(Math.log(e) / Math.LN10);
                null != t && A > t && (A = t);
                g = Math.pow(10, -A);
                e /= g;
                if (1.5 > e) f = 1;
                else if (3 > e) {
                    if (f = 2, 2.25 < e && (null == t || A + 1 <= t)) f = 2.5, ++A
                } else f = 7.5 > e ? 5 : 10;
                f *= g;
                null != c.minTickSize && f < c.minTickSize && (f = c.minTickSize);
                null != c.tickSize && (f = c.tickSize);
                a.tickDecimals = Math.max(0, null != t ? t : A);
                e = function(a) {
                    var c = [],
                        f = p(a.min, a.tickSize),
                        b = 0,
                        e = Number.NaN,
                        o;
                    do o = e, e = f + b * a.tickSize, c.push({
                        v: e,
                        label: a.tickFormatter(e, a)
                    }), ++b; while (e < a.max && e != o);
                    return c
                };
                g = function(a, c) {
                    return a.toFixed(c.tickDecimals)
                }
            }
            a.tickSize = o ? [f, o] : f;
            a.tickGenerator = e;
            a.tickFormatter = b.isFunction(c.tickFormatter) ? function(a, f) {
                return "" + c.tickFormatter(a, f)
            } : g
        }

        function w() {
            L.clearRect(0, 0, da, ia);
            var a = G.grid;
            a.show && !a.aboveData && E();
            for (var c = 0; c < Z.length; ++c) {
                var f = Z[c];
                f.lines.show && N(f);
                f.bars.show && B(f);
                f.points.show && U(f)
            }
            e(na.draw, [L]);
            a.show && a.aboveData && E()
        }

        function z(a, c) {
            var f = c + "axis",
                b = c + "2axis",
                e, o;
            a[f] ? (e = Q[f], o = a[f].from, f = a[f].to) : a[b] ? (e = Q[b], o = a[b].from, f = a[b].to) : (e = Q[f], o = a[c + "1"], f = a[c + "2"]);
            return null != o && null != f && o > f ? {
                from: f,
                to: o,
                axis: e
            } : {
                from: o,
                to: f,
                axis: e
            }
        }

        function E() {
            var a;
            L.save();
            L.translate(T.left, T.top);
            G.grid.backgroundColor && (L.fillStyle = M(G.grid.backgroundColor, ka, 0, "rgba(255, 255, 255, 0)"), L.fillRect(0, 0, ja, ka));
            var c = G.grid.markings;
            if (c) {
                b.isFunction(c) && (c = c({
                    xmin: Q.xaxis.min,
                    xmax: Q.xaxis.max,
                    ymin: Q.yaxis.min,
                    ymax: Q.yaxis.max,
                    xaxis: Q.xaxis,
                    yaxis: Q.yaxis,
                    x2axis: Q.x2axis,
                    y2axis: Q.y2axis
                }));
                for (a = 0; a < c.length; ++a) {
                    var f = c[a],
                        e = z(f, "x"),
                        o = z(f, "y");
                    null == e.from && (e.from = e.axis.min);
                    null == e.to && (e.to = e.axis.max);
                    null == o.from && (o.from = o.axis.min);
                    null == o.to && (o.to = o.axis.max);
                    e.to < e.axis.min || (e.from > e.axis.max || o.to < o.axis.min || o.from > o.axis.max) || (e.from = Math.max(e.from, e.axis.min), e.to = Math.min(e.to, e.axis.max), o.from = Math.max(o.from, o.axis.min), o.to = Math.min(o.to, o.axis.max), e.from == e.to &&
                        o.from == o.to || (e.from = e.axis.p2c(e.from), e.to = e.axis.p2c(e.to), o.from = o.axis.p2c(o.from), o.to = o.axis.p2c(o.to), e.from == e.to || o.from == o.to ? (L.beginPath(), L.strokeStyle = f.color || G.grid.markingsColor, L.lineWidth = f.lineWidth || G.grid.markingsLineWidth, L.moveTo(e.from, o.from), L.lineTo(e.to, o.to), L.stroke()) : (L.fillStyle = f.color || G.grid.markingsColor, L.fillRect(e.from, o.to, e.to - e.from, o.from - o.to))))
                }
            }
            L.lineWidth = 1;
            L.strokeStyle = G.grid.tickColor;
            L.beginPath();
            f = Q.xaxis;
            for (a = 0; a < f.ticks.length; ++a) c = f.ticks[a].v,
                c <= f.min || c >= Q.xaxis.max || (L.moveTo(Math.floor(f.p2c(c)) + L.lineWidth / 2, 0), L.lineTo(Math.floor(f.p2c(c)) + L.lineWidth / 2, ka));
            f = Q.yaxis;
            for (a = 0; a < f.ticks.length; ++a) c = f.ticks[a].v, c <= f.min || c >= f.max || (L.moveTo(0, Math.floor(f.p2c(c)) + L.lineWidth / 2), L.lineTo(ja, Math.floor(f.p2c(c)) + L.lineWidth / 2));
            f = Q.x2axis;
            for (a = 0; a < f.ticks.length; ++a) c = f.ticks[a].v, c <= f.min || c >= f.max || (L.moveTo(Math.floor(f.p2c(c)) + L.lineWidth / 2, -5), L.lineTo(Math.floor(f.p2c(c)) + L.lineWidth / 2, 5));
            f = Q.y2axis;
            for (a = 0; a < f.ticks.length; ++a) c =
                f.ticks[a].v, c <= f.min || c >= f.max || (L.moveTo(ja - 5, Math.floor(f.p2c(c)) + L.lineWidth / 2), L.lineTo(ja + 5, Math.floor(f.p2c(c)) + L.lineWidth / 2));
            L.stroke();
            G.grid.borderWidth && (a = G.grid.borderWidth, L.lineWidth = a, L.strokeStyle = G.grid.borderColor, L.strokeRect(-a / 2, -a / 2, ja + a, ka + a));
            L.restore()
        }

        function N(a) {
            function c(a, f, b, e, o) {
                var g = a.points;
                a = a.pointsize;
                var u = null,
                    t = null;
                L.beginPath();
                for (var A = a; A < g.length; A += a) {
                    var r = g[A - a],
                        v = g[A - a + 1],
                        p = g[A],
                        B = g[A + 1];
                    if (!(null == r || null == p)) {
                        if (v <= B && v < o.min) {
                            if (B < o.min) continue;
                            r = (o.min - v) / (B - v) * (p - r) + r;
                            v = o.min
                        } else if (B <= v && B < o.min) {
                            if (v < o.min) continue;
                            p = (o.min - v) / (B - v) * (p - r) + r;
                            B = o.min
                        }
                        if (v >= B && v > o.max) {
                            if (B > o.max) continue;
                            r = (o.max - v) / (B - v) * (p - r) + r;
                            v = o.max
                        } else if (B >= v && B > o.max) {
                            if (v > o.max) continue;
                            p = (o.max - v) / (B - v) * (p - r) + r;
                            B = o.max
                        }
                        if (r <= p && r < e.min) {
                            if (p < e.min) continue;
                            v = (e.min - r) / (p - r) * (B - v) + v;
                            r = e.min
                        } else if (p <= r && p < e.min) {
                            if (r < e.min) continue;
                            B = (e.min - r) / (p - r) * (B - v) + v;
                            p = e.min
                        }
                        if (r >= p && r > e.max) {
                            if (p > e.max) continue;
                            v = (e.max - r) / (p - r) * (B - v) + v;
                            r = e.max
                        } else if (p >= r && p > e.max) {
                            if (r >
                                e.max) continue;
                            B = (e.max - r) / (p - r) * (B - v) + v;
                            p = e.max
                        }(r != u || v != t) && L.moveTo(e.p2c(r) + f, o.p2c(v) + b);
                        u = p;
                        t = B;
                        L.lineTo(e.p2c(p) + f, o.p2c(B) + b)
                    }
                }
                L.stroke()
            }
            L.save();
            L.translate(T.left, T.top);
            L.lineJoin = "round";
            var f = a.lines.lineWidth,
                b = a.shadowSize;
            if (0 < f && 0 < b) {
                L.lineWidth = b;
                L.strokeStyle = "rgba(0,0,0,0.1)";
                var e = Math.PI / 18;
                c(a.datapoints, Math.sin(e) * (f / 2 + b / 2), Math.cos(e) * (f / 2 + b / 2), a.xaxis, a.yaxis);
                L.lineWidth = b / 2;
                c(a.datapoints, Math.sin(e) * (f / 2 + b / 4), Math.cos(e) * (f / 2 + b / 4), a.xaxis, a.yaxis)
            }
            L.lineWidth = f;
            L.strokeStyle =
                a.color;
            if (b = P(a.lines, a.color, 0, ka)) {
                L.fillStyle = b;
                var o = a.datapoints,
                    b = a.xaxis,
                    e = a.yaxis,
                    g = o.points,
                    o = o.pointsize,
                    u = Math.min(Math.max(0, e.min), e.max),
                    t;
                t = 0;
                for (var A = !1, r = o; r < g.length; r += o) {
                    var v = g[r - o],
                        p = g[r - o + 1],
                        B = g[r],
                        D = g[r + 1];
                    if (A && null != v && null == B) L.lineTo(b.p2c(t), e.p2c(u)), L.fill(), A = !1;
                    else if (!(null == v || null == B)) {
                        if (v <= B && v < b.min) {
                            if (B < b.min) continue;
                            p = (b.min - v) / (B - v) * (D - p) + p;
                            v = b.min
                        } else if (B <= v && B < b.min) {
                            if (v < b.min) continue;
                            D = (b.min - v) / (B - v) * (D - p) + p;
                            B = b.min
                        }
                        if (v >= B && v > b.max) {
                            if (B > b.max) continue;
                            p = (b.max - v) / (B - v) * (D - p) + p;
                            v = b.max
                        } else if (B >= v && B > b.max) {
                            if (v > b.max) continue;
                            D = (b.max - v) / (B - v) * (D - p) + p;
                            B = b.max
                        }
                        A || (L.beginPath(), L.moveTo(b.p2c(v), e.p2c(u)), A = !0);
                        if (p >= e.max && D >= e.max) L.lineTo(b.p2c(v), e.p2c(e.max)), L.lineTo(b.p2c(B), e.p2c(e.max)), t = B;
                        else if (p <= e.min && D <= e.min) L.lineTo(b.p2c(v), e.p2c(e.min)), L.lineTo(b.p2c(B), e.p2c(e.min)), t = B;
                        else {
                            var F = v,
                                O = B;
                            p <= D && p < e.min && D >= e.min ? (v = (e.min - p) / (D - p) * (B - v) + v, p = e.min) : D <= p && (D < e.min && p >= e.min) && (B = (e.min - p) / (D - p) * (B - v) + v, D = e.min);
                            p >= D && p > e.max &&
                                D <= e.max ? (v = (e.max - p) / (D - p) * (B - v) + v, p = e.max) : D >= p && (D > e.max && p <= e.max) && (B = (e.max - p) / (D - p) * (B - v) + v, D = e.max);
                            v != F && (t = p <= e.min ? e.min : e.max, L.lineTo(b.p2c(F), e.p2c(t)), L.lineTo(b.p2c(v), e.p2c(t)));
                            L.lineTo(b.p2c(v), e.p2c(p));
                            L.lineTo(b.p2c(B), e.p2c(D));
                            B != O && (t = D <= e.min ? e.min : e.max, L.lineTo(b.p2c(B), e.p2c(t)), L.lineTo(b.p2c(O), e.p2c(t)));
                            t = Math.max(B, O)
                        }
                    }
                }
                A && (L.lineTo(b.p2c(t), e.p2c(u)), L.fill())
            }
            0 < f && c(a.datapoints, 0, 0, a.xaxis, a.yaxis);
            L.restore()
        }

        function U(a) {
            function c(a, f, b, e, o, g, u) {
                var t = a.points;
                a = a.pointsize;
                for (var A = 0; A < t.length; A += a) {
                    var r = t[A],
                        v = t[A + 1];
                    null == r || (r < g.min || r > g.max || v < u.min || v > u.max) || (L.beginPath(), L.arc(g.p2c(r), u.p2c(v) + e, f, 0, o, !1), b && (L.fillStyle = b, L.fill()), L.stroke())
                }
            }
            L.save();
            L.translate(T.left, T.top);
            var f = a.lines.lineWidth,
                b = a.shadowSize,
                e = a.points.radius;
            0 < f && 0 < b && (b /= 2, L.lineWidth = b, L.strokeStyle = "rgba(0,0,0,0.1)", c(a.datapoints, e, null, b + b / 2, Math.PI, a.xaxis, a.yaxis), L.strokeStyle = "rgba(0,0,0,0.2)", c(a.datapoints, e, null, b / 2, Math.PI, a.xaxis, a.yaxis));
            L.lineWidth =
                f;
            L.strokeStyle = a.color;
            c(a.datapoints, e, P(a.points, a.color), 0, 2 * Math.PI, a.xaxis, a.yaxis);
            L.restore()
        }

        function u(a, c, f, b, e, o, g, u, t, A, r) {
            var v, p, B, D;
            r ? (D = p = B = !0, v = !1, r = f, f = c + b, e = c + e, a < r && (c = a, a = r, r = c, v = !0, p = !1)) : (v = p = B = !0, D = !1, r = a + b, a += e, e = f, f = c, f < e && (c = f, f = e, e = c, D = !0, B = !1));
            if (!(a < u.min || r > u.max || f < t.min || e > t.max))
                if (r < u.min && (r = u.min, v = !1), a > u.max && (a = u.max, p = !1), e < t.min && (e = t.min, D = !1), f > t.max && (f = t.max, B = !1), r = u.p2c(r), e = t.p2c(e), a = u.p2c(a), f = t.p2c(f), g && (A.beginPath(), A.moveTo(r, e), A.lineTo(r,
                        f), A.lineTo(a, f), A.lineTo(a, e), A.fillStyle = g(e, f), A.fill()), v || p || B || D) A.beginPath(), A.moveTo(r, e + o), v ? A.lineTo(r, f + o) : A.moveTo(r, f + o), B ? A.lineTo(a, f + o) : A.moveTo(a, f + o), p ? A.lineTo(a, e + o) : A.moveTo(a, e + o), D ? A.lineTo(r, e + o) : A.moveTo(r, e + o), A.stroke()
        }

        function B(a) {
            L.save();
            L.translate(T.left, T.top);
            L.lineWidth = a.bars.lineWidth;
            L.strokeStyle = a.color;
            for (var c = "left" == a.bars.align ? 0 : -a.bars.barWidth / 2, f = a.datapoints, b = c + a.bars.barWidth, e = a.bars.fill ? function(c, f) {
                        return P(a.bars, a.color, c, f)
                    } : null, o = a.xaxis,
                    g = a.yaxis, t = f.points, f = f.pointsize, A = 0; A < t.length; A += f) null != t[A] && u(t[A], t[A + 1], t[A + 2], c, b, 0, e, o, g, L, a.bars.horizontal);
            L.restore()
        }

        function P(a, c, f, e) {
            var o = a.fill;
            if (!o) return null;
            if (a.fillColor) return M(a.fillColor, f, e, c);
            a = b.color.parse(c);
            a.a = "number" == typeof o ? o : 0.4;
            a.normalize();
            return a.toString()
        }

        function D(a) {
            G.grid.hoverable && A("plothover", a, function(a) {
                return !1 != a.hoverable
            })
        }

        function F(a) {
            A("plotclick", a, function(a) {
                return !1 != a.clickable
            })
        }

        function A(a, c, f) {
            var b = ha.offset(),
                e = {
                    pageX: c.pageX,
                    pageY: c.pageY
                },
                o = c.pageX - b.left - T.left;
            c = c.pageY - b.top - T.top;
            Q.xaxis.used && (e.x = Q.xaxis.c2p(o));
            Q.yaxis.used && (e.y = Q.yaxis.c2p(c));
            Q.x2axis.used && (e.x2 = Q.x2axis.c2p(o));
            Q.y2axis.used && (e.y2 = Q.y2axis.c2p(c));
            var u = G.grid.mouseActiveRadius,
                t = u * u + 1,
                A = null,
                v, p;
            for (v = 0; v < Z.length; ++v)
                if (f(Z[v])) {
                    var B = Z[v],
                        D = B.xaxis,
                        P = B.yaxis,
                        F = B.datapoints.points,
                        O = B.datapoints.pointsize,
                        y = D.c2p(o),
                        w = P.c2p(c),
                        J = u / D.scale,
                        z = u / P.scale;
                    if (B.lines.show || B.points.show)
                        for (p = 0; p < F.length; p += O) {
                            var ga = F[p],
                                aa = F[p + 1];
                            if (null !=
                                ga && !(ga - y > J || ga - y < -J || aa - w > z || aa - w < -z)) ga = Math.abs(D.p2c(ga) - o), aa = Math.abs(P.p2c(aa) - c), aa = ga * ga + aa * aa, aa <= t && (t = aa, A = [v, p / O])
                        }
                    if (B.bars.show && !A) {
                        D = "left" == B.bars.align ? 0 : -B.bars.barWidth / 2;
                        B = D + B.bars.barWidth;
                        for (p = 0; p < F.length; p += O)
                            if (ga = F[p], aa = F[p + 1], P = F[p + 2], null != ga && (Z[v].bars.horizontal ? y <= Math.max(P, ga) && y >= Math.min(P, ga) && w >= aa + D && w <= aa + B : y >= ga + D && y <= ga + B && w >= Math.min(P, aa) && w <= Math.max(P, aa))) A = [v, p / O]
                    }
                }
            A ? (v = A[0], p = A[1], O = Z[v].datapoints.pointsize, f = {
                datapoint: Z[v].datapoints.points.slice(p *
                    O, (p + 1) * O),
                dataIndex: p,
                series: Z[v],
                seriesIndex: v
            }) : f = null;
            f && (f.pageX = parseInt(f.series.xaxis.p2c(f.datapoint[0]) + b.left + T.left), f.pageY = parseInt(f.series.yaxis.p2c(f.datapoint[1]) + b.top + T.top));
            if (G.grid.autoHighlight) {
                for (b = 0; b < Y.length; ++b) o = Y[b], o.auto == a && (!f || !(o.series == f.series && o.point == f.datapoint)) && oa(o.series, o.point);
                f && K(f.series, f.datapoint, a)
            }
            g.trigger(a, [e, f])
        }

        function O() {
            ga || (ga = setTimeout(aa, 30))
        }

        function aa() {
            ga = null;
            ca.save();
            ca.clearRect(0, 0, da, ia);
            ca.translate(T.left, T.top);
            var a, f;
            for (a = 0; a < Y.length; ++a)
                if (f = Y[a], f.series.bars.show) ba(f.series, f.point);
                else {
                    var c = f.series,
                        o = f.point;
                    f = o[0];
                    var o = o[1],
                        g = c.xaxis,
                        u = c.yaxis;
                    if (!(f < g.min || f > g.max || o < u.min || o > u.max)) {
                        var t = c.points.radius + c.points.lineWidth / 2;
                        ca.lineWidth = t;
                        ca.strokeStyle = b.color.parse(c.color).scale("a", 0.5).toString();
                        c = 1.5 * t;
                        ca.beginPath();
                        ca.arc(g.p2c(f), u.p2c(o), c, 0, 2 * Math.PI, !1);
                        ca.stroke()
                    }
                }
            ca.restore();
            e(na.drawOverlay, [ca])
        }

        function K(a, c, b) {
            "number" == typeof a && (a = Z[a]);
            "number" == typeof c && (c = a.data[c]);
            var e = f(a, c); - 1 == e ? (Y.push({
                series: a,
                point: c,
                auto: b
            }), O()) : b || (Y[e].auto = !1)
        }

        function oa(a, c) {
            null == a && null == c && (Y = [], O());
            "number" == typeof a && (a = Z[a]);
            "number" == typeof c && (c = a.data[c]);
            var b = f(a, c); - 1 != b && (Y.splice(b, 1), O())
        }

        function f(a, c) {
            for (var f = 0; f < Y.length; ++f) {
                var b = Y[f];
                if (b.series == a && b.point[0] == c[0] && b.point[1] == c[1]) return f
            }
            return -1
        }

        function ba(a, c) {
            ca.lineWidth = a.bars.lineWidth;
            ca.strokeStyle = b.color.parse(a.color).scale("a", 0.5).toString();
            var f = b.color.parse(a.color).scale("a", 0.5).toString(),
                e = "left" == a.bars.align ? 0 : -a.bars.barWidth / 2;
            u(c[0], c[1], c[2] || 0, e, e + a.bars.barWidth, 0, function() {
                return f
            }, a.xaxis, a.yaxis, ca, a.bars.horizontal)
        }

        function M(a, c, f, e) {
            if ("string" == typeof a) return a;
            c = L.createLinearGradient(0, f, 0, c);
            f = 0;
            for (var o = a.colors.length; f < o; ++f) {
                var g = a.colors[f];
                "string" != typeof g && (g = b.color.parse(e).scale("rgb", g.brightness), g.a *= g.opacity, g = g.toString());
                c.addColorStop(f / (o - 1), g)
            }
            return c
        }
        var Z = [],
            G = {
                colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                legend: {
                    show: !0,
                    noColumns: 1,
                    labelFormatter: null,
                    labelBoxBorderColor: "#ccc",
                    container: null,
                    position: "ne",
                    margin: 5,
                    backgroundColor: null,
                    backgroundOpacity: 0.85
                },
                xaxis: {
                    mode: null,
                    transform: null,
                    inverseTransform: null,
                    min: null,
                    max: null,
                    autoscaleMargin: null,
                    ticks: null,
                    tickFormatter: null,
                    labelWidth: null,
                    labelHeight: null,
                    tickDecimals: null,
                    tickSize: null,
                    minTickSize: null,
                    monthNames: null,
                    timeformat: null,
                    twelveHourClock: !1
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
                        show: !1,
                        radius: 3,
                        lineWidth: 2,
                        fill: !0,
                        fillColor: "#ffffff"
                    },
                    lines: {
                        lineWidth: 2,
                        fill: !1,
                        fillColor: null,
                        steps: !1
                    },
                    bars: {
                        show: !1,
                        lineWidth: 2,
                        barWidth: 1,
                        fill: !0,
                        fillColor: null,
                        align: "left",
                        horizontal: !1
                    },
                    shadowSize: 3
                },
                grid: {
                    show: !0,
                    aboveData: !1,
                    color: "#545454",
                    backgroundColor: null,
                    tickColor: "rgba(0,0,0,0.15)",
                    labelMargin: 5,
                    borderWidth: 2,
                    borderColor: null,
                    markings: null,
                    markingsColor: "#f4f4f4",
                    markingsLineWidth: 2,
                    clickable: !1,
                    hoverable: !1,
                    autoHighlight: !0,
                    mouseActiveRadius: 10
                },
                hooks: {}
            },
            pa = null,
            S = null,
            ha = null,
            L = null,
            ca = null,
            Q = {
                xaxis: {},
                yaxis: {},
                x2axis: {},
                y2axis: {}
            },
            T = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            da = 0,
            ia = 0,
            ja = 0,
            ka = 0,
            na = {
                processOptions: [],
                processRawData: [],
                processDatapoints: [],
                draw: [],
                bindEvents: [],
                drawOverlay: []
            },
            ea = this;
        ea.setData = t;
        ea.setupGrid = J;
        ea.draw = w;
        ea.getPlaceholder = function() {
            return g
        };
        ea.getCanvas = function() {
            return pa
        };
        ea.getPlotOffset = function() {
            return T
        };
        ea.width = function() {
            return ja
        };
        ea.height = function() {
            return ka
        };
        ea.offset = function() {
            var a = ha.offset();
            a.left += T.left;
            a.top += T.top;
            return a
        };
        ea.getData = function() {
            return Z
        };
        ea.getAxes = function() {
            return Q
        };
        ea.getOptions = function() {
            return G
        };
        ea.highlight = K;
        ea.unhighlight = oa;
        ea.triggerRedrawOverlay = O;
        ea.pointOffset = function(a) {
            return {
                left: parseInt(v(a, "xaxis").p2c(+a.x) + T.left),
                top: parseInt(v(a, "yaxis").p2c(+a.y) + T.top)
            }
        };
        ea.hooks = na;
        for (S = 0; S < o.length; ++S) {
            var xa = o[S];
            xa.init(ea);
            xa.options && b.extend(!0, G, xa.options)
        }
        b.extend(!0, G, c);
        null == G.grid.borderColor && (G.grid.borderColor = G.grid.color);
        G.xaxis.noTicks && null == G.xaxis.ticks && (G.xaxis.ticks =
            G.xaxis.noTicks);
        G.yaxis.noTicks && null == G.yaxis.ticks && (G.yaxis.ticks = G.yaxis.noTicks);
        G.grid.coloredAreas && (G.grid.markings = G.grid.coloredAreas);
        G.grid.coloredAreasColor && (G.grid.markingsColor = G.grid.coloredAreasColor);
        G.lines && b.extend(!0, G.series.lines, G.lines);
        G.points && b.extend(!0, G.series.points, G.points);
        G.bars && b.extend(!0, G.series.bars, G.bars);
        G.shadowSize && (G.series.shadowSize = G.shadowSize);
        for (var la in na) G.hooks[la] && G.hooks[la].length && (na[la] = na[la].concat(G.hooks[la]));
        e(na.processOptions, [G]);
        c = function(a, c) {
            var f = document.createElement("canvas");
            f.width = a;
            f.height = c;
            window.G_vmlCanvasManager && (f = window.G_vmlCanvasManager.initElement(f));
            return f
        };
        da = g.width();
        ia = g.height();
        g.html("");
        "static" == g.css("position") && g.css("position", "relative");
        if (0 >= da || 0 >= ia) throw "Invalid dimensions for plot, width \x3d " + da + ", height \x3d " + ia;
        window.G_vmlCanvasManager && window.G_vmlCanvasManager.init_(document);
        pa = b(c(da, ia)).appendTo(g).get(0);
        L = pa.getContext("2d");
        S = b(c(da, ia)).css({
            position: "absolute",
            left: 0,
            top: 0
        }).appendTo(g).get(0);
        ca = S.getContext("2d");
        ca.stroke();
        t(a);
        J();
        w();
        ha = b([S, pa]);
        G.grid.hoverable && ha.mousemove(D);
        G.grid.clickable && ha.click(F);
        e(na.bindEvents, [ha]);
        var Y = [],
            ga = null
    }

    function p(b, a) {
        return a * Math.floor(b / a)
    }
    b.plot = function(r, a, c) {
        return new g(b(r), a, c, b.plot.plugins)
    };
    b.plot.plugins = [];
    b.plot.formatDate = function(b, a, c) {
        var o = function(a) {
                a = "" + a;
                return 1 == a.length ? "0" + a : a
            },
            e = [],
            g = !1,
            v = b.getUTCHours(),
            p = 12 > v;
        null == c && (c = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")); -
        1 != a.search(/%p|%P/) && (12 < v ? v -= 12 : 0 == v && (v = 12));
        for (var y = 0; y < a.length; ++y) {
            var w = a.charAt(y);
            if (g) {
                switch (w) {
                    case "h":
                        w = "" + v;
                        break;
                    case "H":
                        w = o(v);
                        break;
                    case "M":
                        w = o(b.getUTCMinutes());
                        break;
                    case "S":
                        w = o(b.getUTCSeconds());
                        break;
                    case "d":
                        w = "" + b.getUTCDate();
                        break;
                    case "m":
                        w = "" + (b.getUTCMonth() + 1);
                        break;
                    case "y":
                        w = "" + b.getUTCFullYear();
                        break;
                    case "b":
                        w = "" + c[b.getUTCMonth()];
                        break;
                    case "p":
                        w = p ? "am" : "pm";
                        break;
                    case "P":
                        w = p ? "AM" : "PM"
                }
                e.push(w);
                g = !1
            } else "%" == w ? g = !0 : e.push(w)
        }
        return e.join("")
    }
})(jQuery);
(function(b) {
    var g = document.documentElement.style,
        p = "textOverflow" in g || "OTextOverflow" in g,
        r = document.createTextNode("").textContent ? "textContent" : "data",
        a = function(a, o, e) {
            var g = 0,
                v = [],
                p = function(a) {
                    var c = 0,
                        b, E = 0;
                    if (!(g > o))
                        for (c = 0; c < a.length; c += 1)
                            if (1 === a[c].nodeType) b = a[c].cloneNode(!1), v[v.length - 1].appendChild(b), v.push(b), p(a[c].childNodes), v.pop();
                            else if (3 === a[c].nodeType) {
                        if (g + a[c].length < o) v[v.length - 1].appendChild(a[c].cloneNode(!1));
                        else {
                            b = a[c].cloneNode(!1);
                            E = o - g;
                            e.wholeWord && (E = Math.min(o -
                                g, b.textContent.substring(0, o - g).lastIndexOf(" ")));
                            var N = b,
                                U = r,
                                E = e.trim ? b[r].substring(0, E).replace(/\s+$/g, "") : b[r].substring(0, E);
                            N[U] = E;
                            v[v.length - 1].appendChild(b)
                        }
                        g += a[c].length
                    } else v.appendChild(a[c].cloneNode(!1))
                };
            v.push(a.cloneNode(!1));
            p(a.childNodes);
            return b(v.pop().childNodes)
        };
    b.extend(b.fn, {
        textOverflow: function(c) {
            var o = b.extend({
                str: "\x26#x2026;",
                autoUpdate: !1,
                trim: !0,
                title: !1,
                className: void 0,
                wholeWord: !1
            }, c);
            return p ? this : this.each(function() {
                var c = b(this),
                    g = c.clone(),
                    r = c.clone(),
                    p = c.text(),
                    y = c.width(),
                    w = 0,
                    z = 0,
                    E = p.length,
                    N = function() {
                        y !== c.width() && (c.replaceWith(r), c = r, r = c.clone(), c.textOverflow(b.extend({}, o, {
                            autoUpdate: !1
                        })), y = c.width())
                    };
                c.after(g.hide().css({
                    position: "absolute",
                    width: "auto",
                    overflow: "visible",
                    "max-width": "inherit",
                    "min-width": "inherit"
                }));
                if (g.width() > y) {
                    for (; w < E;) z = Math.floor(w + (E - w) / 2), g.empty().append(a(r.get(0), z, o)).append(o.str), g.width() < y ? w = z + 1 : E = z;
                    w < p.length && (c.empty().append(a(r.get(0), w - 1, o)).append(o.str), o.title && c.attr("title", p), o.className &&
                        c.addClass(o.className))
                }
                g.remove();
                o.autoUpdate && setInterval(N, 200)
            })
        }
    })
})(jQuery);
(function(b, g) {
    g.cookie = function(g, r, a) {
        var c = "";
        if ("undefined" != typeof r) {
            a || (a = {});
            r || (r = "", a.expires = -1);
            if (a.expires && ("number" == typeof a.expires || a.expires.toUTCString)) c = new Date, "number" == typeof a.expires ? c.setTime(+new Date + 864E5 * a.expires) : c = a.expires, c = "; expires\x3d" + c.toUTCString();
            b.cookie = [g, "\x3d", encodeURIComponent(r), c, a.path ? "; path\x3d" + a.path : "", a.domain ? "; domain\x3d" + a.domain : "", a.secure ? "; secure" : ""].join("")
        } else return (g = b.cookie.match(RegExp("(?:^|;)\\s?" + g.replace(/([.*+?^=!:${}()|[\]\/\\])/g,
            "\\$1") + "\x3d(.*?)(?:;|$)", "i"))) && unescape(g[1])
    }
})(document, jQuery);
(function(b) {
    function g(a, c) {
        return function(f) {
            return t(a.call(this, f), c)
        }
    }

    function p(a) {
        return function(c) {
            return this.lang().ordinal(a.call(this, c))
        }
    }

    function r() {}

    function a(a) {
        o(this, a)
    }

    function c(a) {
        var c = this._data = {},
            f = a.years || a.year || a.y || 0,
            b = a.months || a.month || a.M || 0,
            o = a.weeks || a.week || a.w || 0,
            g = a.days || a.day || a.d || 0,
            u = a.hours || a.hour || a.h || 0,
            t = a.minutes || a.minute || a.m || 0,
            A = a.seconds || a.second || a.s || 0;
        a = a.milliseconds || a.millisecond || a.ms || 0;
        this._milliseconds = a + 1E3 * A + 6E4 * t + 36E5 * u;
        this._days =
            g + 7 * o;
        this._months = b + 12 * f;
        c.milliseconds = a % 1E3;
        A += e(a / 1E3);
        c.seconds = A % 60;
        t += e(A / 60);
        c.minutes = t % 60;
        u += e(t / 60);
        c.hours = u % 24;
        g += e(u / 24);
        g += 7 * o;
        c.days = g % 30;
        b += e(g / 30);
        c.months = b % 12;
        f += e(b / 12);
        c.years = f
    }

    function o(a, c) {
        for (var f in c) c.hasOwnProperty(f) && (a[f] = c[f]);
        return a
    }

    function e(a) {
        return 0 > a ? Math.ceil(a) : Math.floor(a)
    }

    function t(a, c) {
        for (var f = a + ""; f.length < c;) f = "0" + f;
        return f
    }

    function v(a, c, f) {
        var b = c._milliseconds,
            e = c._days;
        c = c._months;
        var o;
        b && a._d.setTime(+a + b * f);
        e && a.date(a.date() + e * f);
        c && (o = a.date(), a.date(1).month(a.month() + c * f).date(Math.min(o, a.daysInMonth())))
    }

    function J(a, c) {
        var f = Math.min(a.length, c.length),
            b = Math.abs(a.length - c.length),
            e = 0,
            o;
        for (o = 0; o < f; o++) ~~a[o] !== ~~c[o] && e++;
        return e + b
    }

    function y(a) {
        return a ? (!aa[a] && K && require("./lang/" + a), aa[a]) : F.fn._lang
    }

    function w(a) {
        switch (a) {
            case "DDDD":
                return G;
            case "YYYY":
                return pa;
            case "YYYYY":
                return S;
            case "S":
            case "SS":
            case "SSS":
            case "DDD":
                return Z;
            case "MMM":
            case "MMMM":
            case "dd":
            case "ddd":
            case "dddd":
            case "a":
            case "A":
                return ha;
            case "X":
                return Q;
            case "Z":
            case "ZZ":
                return L;
            case "T":
                return ca;
            case "MM":
            case "DD":
            case "YY":
            case "HH":
            case "hh":
            case "mm":
            case "ss":
            case "M":
            case "D":
            case "d":
            case "H":
            case "h":
            case "m":
            case "s":
                return M;
            default:
                return RegExp(a.replace("\\", ""))
        }
    }

    function z(a) {
        var c, f = [];
        if (!a._d) {
            for (c = 0; 7 > c; c++) a._a[c] = f[c] = null == a._a[c] ? 2 === c ? 1 : 0 : a._a[c];
            f[3] += a._tzh || 0;
            f[4] += a._tzm || 0;
            c = new Date(0);
            a._useUTC ? (c.setUTCFullYear(f[0], f[1], f[2]), c.setUTCHours(f[3], f[4], f[5], f[6])) : (c.setFullYear(f[0], f[1], f[2]),
                c.setHours(f[3], f[4], f[5], f[6]));
            a._d = c
        }
    }

    function E(a) {
        var c = a._f.match(f),
            b = a._i,
            e, o;
        a._a = [];
        for (e = 0; e < c.length; e++)
            if ((o = (w(c[e]).exec(b) || [])[0]) && (b = b.slice(b.indexOf(o) + o.length)), la[c[e]]) {
                var g = a,
                    u = void 0,
                    t = g._a;
                switch (c[e]) {
                    case "M":
                    case "MM":
                        t[1] = null == o ? 0 : ~~o - 1;
                        break;
                    case "MMM":
                    case "MMMM":
                        u = y(g._l).monthsParse(o);
                        null != u ? t[1] = u : g._isValid = !1;
                        break;
                    case "D":
                    case "DD":
                    case "DDD":
                    case "DDDD":
                        null != o && (t[2] = ~~o);
                        break;
                    case "YY":
                        t[0] = ~~o + (68 < ~~o ? 1900 : 2E3);
                        break;
                    case "YYYY":
                    case "YYYYY":
                        t[0] = ~~o;
                        break;
                    case "a":
                    case "A":
                        g._isPm = "pm" === (o + "").toLowerCase();
                        break;
                    case "H":
                    case "HH":
                    case "h":
                    case "hh":
                        t[3] = ~~o;
                        break;
                    case "m":
                    case "mm":
                        t[4] = ~~o;
                        break;
                    case "s":
                    case "ss":
                        t[5] = ~~o;
                        break;
                    case "S":
                    case "SS":
                    case "SSS":
                        t[6] = ~~(1E3 * ("0." + o));
                        break;
                    case "X":
                        g._d = new Date(1E3 * parseFloat(o));
                        break;
                    case "Z":
                    case "ZZ":
                        g._useUTC = !0, (u = (o + "").match(ia)) && u[1] && (g._tzh = ~~u[1]), u && u[2] && (g._tzm = ~~u[2]), u && "+" === u[0] && (g._tzh = -g._tzh, g._tzm = -g._tzm)
                }
                null == o && (g._isValid = !1)
            }
        a._isPm && 12 > a._a[3] && (a._a[3] +=
            12);
        !1 === a._isPm && 12 === a._a[3] && (a._a[3] = 0);
        z(a)
    }

    function N(a, c, f, b, e) {
        return e.relativeTime(c || 1, !!f, a, b)
    }

    function U(a, c, f) {
        c = f - c;
        f -= a.day();
        return f > c && (f -= 7), f < c - 7 && (f += 7), Math.ceil(F(a).add("d", f).dayOfYear() / 7)
    }

    function u(c) {
        var f = c._i,
            e = c._f;
        if (null === f || "" === f) c = null;
        else {
            "string" == typeof f && (c._i = f = y().preparse(f));
            if (F.isMoment(f)) c = o({}, f), c._d = new Date(+f._d);
            else if (e)
                if ("[object Array]" === Object.prototype.toString.call(e)) {
                    for (var f = c, g, u, t = 99; f._f.length;) {
                        g = o({}, f);
                        g._f = f._f.pop();
                        E(g);
                        e = new a(g);
                        if (e.isValid()) {
                            u = e;
                            break
                        }
                        g = J(g._a, e.toArray());
                        g < t && (t = g, u = e)
                    }
                    o(f, u)
                } else E(c);
            else if (u = c, f = u._i, e = oa.exec(f), f === b) u._d = new Date;
            else if (e) u._d = new Date(+e[1]);
            else if ("string" == typeof f)
                if (e = u._i, T.exec(e)) {
                    u._f = "YYYY-MM-DDT";
                    for (f = 0; 4 > f; f++)
                        if (da[f][1].exec(e)) {
                            u._f += da[f][0];
                            break
                        }
                    L.exec(e) && (u._f += " Z");
                    E(u)
                } else u._d = new Date(e);
            else "[object Array]" === Object.prototype.toString.call(f) ? (u._a = f.slice(0), z(u)) : u._d = f instanceof Date ? new Date(+f) : new Date(f);
            c = new a(c)
        }
        return c
    }

    function B(a, c) {
        F.fn[a] = F.fn[a + "s"] = function(a) {
            var f = this._isUTC ? "UTC" : "";
            return null != a ? (this._d["set" + f + c](a), this) : this._d["get" + f + c]()
        }
    }

    function P(a) {
        F.duration.fn[a] = function() {
            return this._data[a]
        }
    }

    function D(a, c) {
        F.duration.fn["as" + a] = function() {
            return +this / c
        }
    }
    for (var F, A = Math.round, O, aa = {}, K = "undefined" != typeof module && module.exports, oa = /^\/?Date\((\-?\d+)/i, f = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,
            ba = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, M = /\d\d?/, Z = /\d{1,3}/, G = /\d{3}/, pa = /\d{1,4}/, S = /[+\-]?\d{1,6}/, ha = /[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i, L = /Z|[\+\-]\d\d:?\d\d/i, ca = /T/i, Q = /[\+\-]?\d+(\.\d{1,3})?/, T = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, da = [
                ["HH:mm:ss.S", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
                ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
                ["HH:mm", /(T| )\d\d:\d\d/],
                ["HH", /(T| )\d\d/]
            ], ia = /([\+\-]|\d\d)/gi,
            ja = "Month Date Hours Minutes Seconds Milliseconds".split(" "), ka = {
                Milliseconds: 1,
                Seconds: 1E3,
                Minutes: 6E4,
                Hours: 36E5,
                Days: 864E5,
                Months: 2592E6,
                Years: 31536E6
            }, na = {}, ea = "DDD w W M D d".split(" "), xa = "MDHhmswW".split(""), la = {
                M: function() {
                    return this.month() + 1
                },
                MMM: function(a) {
                    return this.lang().monthsShort(this, a)
                },
                MMMM: function(a) {
                    return this.lang().months(this, a)
                },
                D: function() {
                    return this.date()
                },
                DDD: function() {
                    return this.dayOfYear()
                },
                d: function() {
                    return this.day()
                },
                dd: function(a) {
                    return this.lang().weekdaysMin(this,
                        a)
                },
                ddd: function(a) {
                    return this.lang().weekdaysShort(this, a)
                },
                dddd: function(a) {
                    return this.lang().weekdays(this, a)
                },
                w: function() {
                    return this.week()
                },
                W: function() {
                    return this.isoWeek()
                },
                YY: function() {
                    return t(this.year() % 100, 2)
                },
                YYYY: function() {
                    return t(this.year(), 4)
                },
                YYYYY: function() {
                    return t(this.year(), 5)
                },
                a: function() {
                    return this.lang().meridiem(this.hours(), this.minutes(), !0)
                },
                A: function() {
                    return this.lang().meridiem(this.hours(), this.minutes(), !1)
                },
                H: function() {
                    return this.hours()
                },
                h: function() {
                    return this.hours() %
                        12 || 12
                },
                m: function() {
                    return this.minutes()
                },
                s: function() {
                    return this.seconds()
                },
                S: function() {
                    return ~~(this.milliseconds() / 100)
                },
                SS: function() {
                    return t(~~(this.milliseconds() / 10), 2)
                },
                SSS: function() {
                    return t(this.milliseconds(), 3)
                },
                Z: function() {
                    var a = -this.zone();
                    return 0 > a && (a = -a), "+" + t(~~(a / 60), 2) + ":" + t(~~a % 60, 2)
                },
                ZZ: function() {
                    var a = -this.zone();
                    return 0 > a && (a = -a), "+" + t(~~(10 * a / 6), 4)
                },
                X: function() {
                    return this.unix()
                }
            }; ea.length;) O = ea.pop(), la[O + "o"] = p(la[O]);
    for (; xa.length;) O = xa.pop(), la[O + O] = g(la[O],
        2);
    la.DDDD = g(la.DDD, 3);
    r.prototype = {
        set: function(a) {
            var c, f;
            for (f in a) c = a[f], "function" == typeof c ? this[f] = c : this["_" + f] = c
        },
        _months: "January February March April May June July August September October November December".split(" "),
        months: function(a) {
            return this._months[a.month()]
        },
        _monthsShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
        monthsShort: function(a) {
            return this._monthsShort[a.month()]
        },
        monthsParse: function(a) {
            var c, f, b;
            this._monthsParse || (this._monthsParse = []);
            for (c = 0; 12 >
                c; c++)
                if (this._monthsParse[c] || (f = F([2E3, c]), b = "^" + this.months(f, "") + "|^" + this.monthsShort(f, ""), this._monthsParse[c] = RegExp(b.replace(".", ""), "i")), this._monthsParse[c].test(a)) return c
        },
        _weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
        weekdays: function(a) {
            return this._weekdays[a.day()]
        },
        _weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
        weekdaysShort: function(a) {
            return this._weekdaysShort[a.day()]
        },
        _weekdaysMin: "Su Mo Tu We Th Fr Sa".split(" "),
        weekdaysMin: function(a) {
            return this._weekdaysMin[a.day()]
        },
        _longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D YYYY",
            LLL: "MMMM D YYYY LT",
            LLLL: "dddd, MMMM D YYYY LT"
        },
        longDateFormat: function(a) {
            var c = this._longDateFormat[a];
            return !c && this._longDateFormat[a.toUpperCase()] && (c = this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(a) {
                return a.slice(1)
            }), this._longDateFormat[a] = c), c
        },
        meridiem: function(a, c, f) {
            return 11 < a ? f ? "pm" : "PM" : f ? "am" : "AM"
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function(a, c) {
            var f = this._calendar[a];
            return "function" == typeof f ? f.apply(c) : f
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function(a, c, f, b) {
            var e = this._relativeTime[f];
            return "function" == typeof e ? e(a, c, f, b) : e.replace(/%d/i, a)
        },
        pastFuture: function(a, c) {
            var f = this._relativeTime[0 < a ? "future" :
                "past"];
            return "function" == typeof f ? f(c) : f.replace(/%s/i, c)
        },
        ordinal: function(a) {
            return this._ordinal.replace("%d", a)
        },
        _ordinal: "%d",
        preparse: function(a) {
            return a
        },
        postformat: function(a) {
            return a
        },
        week: function(a) {
            return U(a, this._week.dow, this._week.doy)
        },
        _week: {
            dow: 0,
            doy: 6
        }
    };
    F = function(a, c, f) {
        return u({
            _i: a,
            _f: c,
            _l: f,
            _isUTC: !1
        })
    };
    F.utc = function(a, c, f) {
        return u({
            _useUTC: !0,
            _isUTC: !0,
            _l: f,
            _i: a,
            _f: c
        })
    };
    F.unix = function(a) {
        return F(1E3 * a)
    };
    F.duration = function(a, f) {
        var b = F.isDuration(a),
            e = "number" == typeof a,
            o = b ? a._data : e ? {} : a,
            g;
        return e && (f ? o[f] = a : o.milliseconds = a), g = new c(o), b && a.hasOwnProperty("_lang") && (g._lang = a._lang), g
    };
    F.version = "2.0.0";
    F.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    F.lang = function(a, c) {
        if (!a) return F.fn._lang._abbr;
        c ? (c.abbr = a, aa[a] || (aa[a] = new r), aa[a].set(c)) : aa[a] || y(a);
        F.duration.fn._lang = F.fn._lang = y(a)
    };
    F.langData = function(a) {
        return a && a._lang && a._lang._abbr && (a = a._lang._abbr), y(a)
    };
    F.isMoment = function(c) {
        return c instanceof a
    };
    F.isDuration = function(a) {
        return a instanceof c
    };
    F.fn =
        a.prototype = {
            clone: function() {
                return F(this)
            },
            valueOf: function() {
                return +this._d
            },
            unix: function() {
                return Math.floor(+this._d / 1E3)
            },
            toString: function() {
                return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
            },
            toDate: function() {
                return this._d
            },
            toJSON: function() {
                return F.utc(this).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
            },
            toArray: function() {
                return [this.year(), this.month(), this.date(), this.hours(), this.minutes(), this.seconds(), this.milliseconds()]
            },
            isValid: function() {
                return null == this._isValid && (this._a ?
                    this._isValid = !J(this._a, (this._isUTC ? F.utc(this._a) : F(this._a)).toArray()) : this._isValid = !isNaN(this._d.getTime())), !!this._isValid
            },
            utc: function() {
                return this._isUTC = !0, this
            },
            local: function() {
                return this._isUTC = !1, this
            },
            format: function(a) {
                var c = this;
                a = a || F.defaultFormat;
                for (var b = function(a) {
                        return c.lang().longDateFormat(a) || a
                    }, e = 5; e-- && ba.test(a);) a = a.replace(ba, b);
                if (!na[a]) {
                    var o = b = a,
                        g = o.match(f),
                        u, t;
                    u = 0;
                    for (t = g.length; u < t; u++) la[g[u]] ? g[u] = la[g[u]] : g[u] = g[u].match(/\[.*\]/) ? g[u].replace(/^\[|\]$/g,
                        "") : g[u].replace(/\\/g, "");
                    na[b] = function(a) {
                        var c = "";
                        for (u = 0; u < t; u++) c += "function" == typeof g[u].call ? g[u].call(a, o) : g[u];
                        return c
                    }
                }
                a = na[a](c);
                return this.lang().postformat(a)
            },
            add: function(a, c) {
                var f;
                return "string" == typeof a ? f = F.duration(+c, a) : f = F.duration(a, c), v(this, f, 1), this
            },
            subtract: function(a, c) {
                var f;
                return "string" == typeof a ? f = F.duration(+c, a) : f = F.duration(a, c), v(this, f, -1), this
            },
            diff: function(a, c, f) {
                a = this._isUTC ? F(a).utc() : F(a).local();
                var b = 6E4 * (this.zone() - a.zone()),
                    o, g;
                return c && (c = c.replace(/s$/,
                    "")), "year" === c || "month" === c ? (o = 432E5 * (this.daysInMonth() + a.daysInMonth()), g = 12 * (this.year() - a.year()) + (this.month() - a.month()), g += (this - F(this).startOf("month") - (a - F(a).startOf("month"))) / o, "year" === c && (g /= 12)) : (o = this - a - b, g = "second" === c ? o / 1E3 : "minute" === c ? o / 6E4 : "hour" === c ? o / 36E5 : "day" === c ? o / 864E5 : "week" === c ? o / 6048E5 : o), f ? g : e(g)
            },
            from: function(a, c) {
                return F.duration(this.diff(a)).lang(this.lang()._abbr).humanize(!c)
            },
            fromNow: function(a) {
                return this.from(F(), a)
            },
            calendar: function() {
                var a = this.diff(F().startOf("day"),
                    "days", !0);
                return this.format(this.lang().calendar(-6 > a ? "sameElse" : -1 > a ? "lastWeek" : 0 > a ? "lastDay" : 1 > a ? "sameDay" : 2 > a ? "nextDay" : 7 > a ? "nextWeek" : "sameElse", this))
            },
            isLeapYear: function() {
                var a = this.year();
                return 0 === a % 4 && 0 !== a % 100 || 0 === a % 400
            },
            isDST: function() {
                return this.zone() < F([this.year()]).zone() || this.zone() < F([this.year(), 5]).zone()
            },
            day: function(a) {
                var c = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
                return null == a ? c : this.add({
                    d: a - c
                })
            },
            startOf: function(a) {
                a = a.replace(/s$/, "");
                switch (a) {
                    case "year":
                        this.month(0);
                    case "month":
                        this.date(1);
                    case "week":
                    case "day":
                        this.hours(0);
                    case "hour":
                        this.minutes(0);
                    case "minute":
                        this.seconds(0);
                    case "second":
                        this.milliseconds(0)
                }
                return "week" === a && this.day(0), this
            },
            endOf: function(a) {
                return this.startOf(a).add(a.replace(/s?$/, "s"), 1).subtract("ms", 1)
            },
            isAfter: function(a, c) {
                return c = "undefined" != typeof c ? c : "millisecond", +this.clone().startOf(c) > +F(a).startOf(c)
            },
            isBefore: function(a, c) {
                return c = "undefined" != typeof c ? c : "millisecond", +this.clone().startOf(c) < +F(a).startOf(c)
            },
            isSame: function(a, c) {
                return c = "undefined" != typeof c ? c : "millisecond", +this.clone().startOf(c) === +F(a).startOf(c)
            },
            zone: function() {
                return this._isUTC ? 0 : this._d.getTimezoneOffset()
            },
            daysInMonth: function() {
                return F.utc([this.year(), this.month() + 1, 0]).date()
            },
            dayOfYear: function(a) {
                var c = A((F(this).startOf("day") - F(this).startOf("year")) / 864E5) + 1;
                return null == a ? c : this.add("d", a - c)
            },
            isoWeek: function(a) {
                var c = U(this, 1, 4);
                return null == a ? c : this.add("d", 7 * (a - c))
            },
            week: function(a) {
                var c = this.lang().week(this);
                return null == a ? c : this.add("d", 7 * (a - c))
            },
            lang: function(a) {
                return a === b ? this._lang : (this._lang = y(a), this)
            }
        };
    for (O = 0; O < ja.length; O++) B(ja[O].toLowerCase().replace(/s$/, ""), ja[O]);
    B("year", "FullYear");
    F.fn.days = F.fn.day;
    F.fn.weeks = F.fn.week;
    F.fn.isoWeeks = F.fn.isoWeek;
    F.duration.fn = c.prototype = {
        weeks: function() {
            return e(this.days() / 7)
        },
        valueOf: function() {
            return this._milliseconds + 864E5 * this._days + 2592E6 * this._months
        },
        humanize: function(a) {
            var c = +this,
                f;
            f = !a;
            var b = this.lang(),
                e = A(Math.abs(c) / 1E3),
                o = A(e /
                    60),
                g = A(o / 60),
                u = A(g / 24),
                t = A(u / 365),
                e = 45 > e && ["s", e] || 1 === o && ["m"] || 45 > o && ["mm", o] || 1 === g && ["h"] || 22 > g && ["hh", g] || 1 === u && ["d"] || 25 >= u && ["dd", u] || 45 >= u && ["M"] || 345 > u && ["MM", A(u / 30)] || 1 === t && ["y"] || ["yy", t];
            f = (e[2] = f, e[3] = 0 < c, e[4] = b, N.apply({}, e));
            return a && (f = this.lang().pastFuture(c, f)), this.lang().postformat(f)
        },
        lang: F.fn.lang
    };
    for (O in ka) ka.hasOwnProperty(O) && (D(O, ka[O]), P(O.toLowerCase()));
    D("Weeks", 6048E5);
    F.lang("en", {
        ordinal: function(a) {
            var c = a % 10;
            return a + (1 === ~~(a % 100 / 10) ? "th" : 1 === c ? "st" : 2 ===
                c ? "nd" : 3 === c ? "rd" : "th")
        }
    });
    K && (module.exports = F);
    "undefined" == typeof ender && (this.moment = F);
    "function" == typeof define && define.amd && define("moment", [], function() {
        return F
    })
}).call(this);
(function() {
    function b(b) {
        b.lang("de", {
            months: "Januar Februar März April Mai Juni Juli August September Oktober November Dezember".split(" "),
            monthsShort: "Jan. Febr. Mrz. Apr. Mai Jun. Jul. Aug. Sept. Okt. Nov. Dez.".split(" "),
            weekdays: "Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "),
            weekdaysShort: "So. Mo. Di. Mi. Do. Fr. Sa.".split(" "),
            weekdaysMin: "So Mo Di Mi Do Fr Sa".split(" "),
            longDateFormat: {
                LT: "H:mm U\\hr",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Heute um] LT",
                sameElse: "L",
                nextDay: "[Morgen um] LT",
                nextWeek: "dddd [um] LT",
                lastDay: "[Gestern um] LT",
                lastWeek: "[letzten] dddd [um] LT"
            },
            relativeTime: {
                future: "in %s",
                past: "vor %s",
                s: "ein paar Sekunden",
                m: "einer Minute",
                mm: "%d Minuten",
                h: "einer Stunde",
                hh: "%d Stunden",
                d: "einem Tag",
                dd: "%d Tagen",
                M: "einem Monat",
                MM: "%d Monaten",
                y: "einem Jahr",
                yy: "%d Jahren"
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }
    "function" == typeof define && define.amd && define(["moment"], b);
    "undefined" != typeof window &&
        window.moment && b(window.moment)
})();
(function() {
    function b(b) {
        b.lang("en-gb", {
            months: "January February March April May June July August September October November December".split(" "),
            monthsShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
            weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
            weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
            weekdaysMin: "Su Mo Tu We Th Fr Sa".split(" "),
            longDateFormat: {
                LT: "h:mm A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            ordinal: function(b) {
                var g = b % 10;
                return b + (1 === ~~(b % 100 / 10) ? "th" : 1 === g ? "st" : 2 === g ? "nd" : 3 === g ? "rd" : "th")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }
    "function" == typeof define &&
        define.amd && define(["moment"], b);
    "undefined" != typeof window && window.moment && b(window.moment)
})();
(function() {
    function b(b) {
        b.lang("es", {
            months: "enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split(" "),
            monthsShort: "ene. feb. mar. abr. may. jun. jul. ago. sep. oct. nov. dic.".split(" "),
            weekdays: "domingo lunes martes miércoles jueves viernes sábado".split(" "),
            weekdaysShort: "dom. lun. mar. mié. jue. vie. sáb.".split(" "),
            weekdaysMin: "Do Lu Ma Mi Ju Vi Sá".split(" "),
            longDateFormat: {
                LT: "H:mm",
                L: "DD/MM/YYYY",
                LL: "D \\de MMMM \\de YYYY",
                LLL: "D \\de MMMM \\de YYYY LT",
                LLLL: "dddd, D \\de MMMM \\de YYYY LT"
            },
            calendar: {
                sameDay: function() {
                    return "[hoy a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextDay: function() {
                    return "[mañana a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextWeek: function() {
                    return "dddd [a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                lastDay: function() {
                    return "[ayer a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                lastWeek: function() {
                    return "[el] dddd [pasado a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "en %s",
                past: "hace %s",
                s: "unos segundos",
                m: "un minuto",
                mm: "%d minutos",
                h: "una hora",
                hh: "%d horas",
                d: "un día",
                dd: "%d días",
                M: "un mes",
                MM: "%d meses",
                y: "un año",
                yy: "%d años"
            },
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }
    "function" == typeof define && define.amd && define(["moment"], b);
    "undefined" != typeof window && window.moment && b(window.moment)
})();
(function() {
    function b(b) {
        b.lang("fr", {
            months: "janvier février mars avril mai juin juillet août septembre octobre novembre décembre".split(" "),
            monthsShort: "janv. févr. mars avr. mai juin juil. août sept. oct. nov. déc.".split(" "),
            weekdays: "dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "),
            weekdaysShort: "dim. lun. mar. mer. jeu. ven. sam.".split(" "),
            weekdaysMin: "Di Lu Ma Me Je Ve Sa".split(" "),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Aujourd'hui à] LT",
                nextDay: "[Demain à] LT",
                nextWeek: "dddd [à] LT",
                lastDay: "[Hier à] LT",
                lastWeek: "dddd [dernier à] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dans %s",
                past: "il y a %s",
                s: "quelques secondes",
                m: "une minute",
                mm: "%d minutes",
                h: "une heure",
                hh: "%d heures",
                d: "un jour",
                dd: "%d jours",
                M: "un mois",
                MM: "%d mois",
                y: "un an",
                yy: "%d ans"
            },
            ordinal: function(b) {
                return b + (1 === b ? "er" : "ème")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }
    "function" == typeof define && define.amd && define(["moment"], b);
    "undefined" != typeof window &&
        window.moment && b(window.moment)
})();
(function() {
    function b(b) {
        b.lang("pt-br", {
            months: "Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" "),
            monthsShort: "Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez".split(" "),
            weekdays: "Domingo Segunda-feira Terça-feira Quarta-feira Quinta-feira Sexta-feira Sábado".split(" "),
            weekdaysShort: "Dom Seg Ter Qua Qui Sex Sáb".split(" "),
            weekdaysMin: "Dom 2ª 3ª 4ª 5ª 6ª Sáb".split(" "),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY LT",
                LLLL: "dddd, D [de] MMMM [de] YYYY LT"
            },
            calendar: {
                sameDay: "[Hoje às] LT",
                nextDay: "[Amanhã às] LT",
                nextWeek: "dddd [às] LT",
                lastDay: "[Ontem às] LT",
                lastWeek: function() {
                    return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "em %s",
                past: "%s atrás",
                s: "segundos",
                m: "um minuto",
                mm: "%d minutos",
                h: "uma hora",
                hh: "%d horas",
                d: "um dia",
                dd: "%d dias",
                M: "um mês",
                MM: "%d meses",
                y: "um ano",
                yy: "%d anos"
            },
            ordinal: "%dº"
        })
    }
    "function" == typeof define && define.amd &&
        define(["moment"], b);
    "undefined" != typeof window && window.moment && b(window.moment)
})();
(function() {
    function b() {
        var a = [];
        for (type in F) a.push(['\x3cspan class\x3d"', type, '" type\x3d"', type, '"\x3e\x3c/span\x3e'].join(""));
        var c = document.createElement("DIV");
        c.id = D.blackbird;
        c.style.display = "none";
        c.innerHTML = ['\x3cdiv class\x3d"header"\x3e\x3cdiv class\x3d"left"\x3e\x3cdiv id\x3d"', D.filters, '" class\x3d"filters" title\x3d"click to filter by message type"\x3e', a.join(""), '\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"right"\x3e\x3cdiv id\x3d"', D.controls, '" class\x3d"controls"\x3e\x3cspan id\x3d"',
            D.size, '" title\x3d"contract" op\x3d"resize"\x3e\x3c/span\x3e\x3cspan class\x3d"clear" title\x3d"clear" op\x3d"clear"\x3e\x3c/span\x3e\x3cspan class\x3d"close" title\x3d"close" op\x3d"close"\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"main"\x3e\x3cdiv class\x3d"left"\x3e\x3c/div\x3e\x3cdiv class\x3d"mainBody"\x3e\x3col\x3e', U.join(""), '\x3c/ol\x3e\x3c/div\x3e\x3cdiv class\x3d"right"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"footer"\x3e\x3cdiv class\x3d"left"\x3e\x3clabel for\x3d"',
            D.checkbox, '"\x3e\x3cinput type\x3d"checkbox" id\x3d"', D.checkbox, '" /\x3eVisible on page load\x3c/label\x3e\x3c/div\x3e\x3cdiv class\x3d"right"\x3e\x3cp\x3ePress F2 to close.\x3c/p\x3e\x3c/div\x3e\x3c/div\x3e'
        ].join("");
        return c
    }

    function g(a, b) {
        b = b.constructor == Array ? b.join("") : b;
        if (N) {
            var e = document.createElement("LI");
            e.className = a;
            e.innerHTML = ['\x3cspan class\x3d"icon"\x3e\x3c/span\x3e', b].join("");
            N.appendChild(e);
            c()
        } else U.push(['\x3cli class\x3d"', a, '"\x3e\x3cspan class\x3d"icon"\x3e\x3c/span\x3e',
            b, "\x3c/li\x3e"
        ].join(""))
    }

    function p(a) {
        a || (a = window.event);
        a = a.target ? a.target : a.srcElement;
        if ("SPAN" == a.tagName) switch (a.getAttributeNode("op").nodeValue) {
            case "resize":
                v();
                break;
            case "clear":
                N.innerHTML = "";
                break;
            case "close":
                o()
        }
    }

    function r(a) {
        a || (a = window.event);
        var b = a.target ? a.target : a.srcElement;
        if (b && "SPAN" == b.tagName) {
            var e = b.getAttributeNode("type").nodeValue;
            if (a.altKey) {
                a = document.getElementById(D.filters).getElementsByTagName("SPAN");
                b = 0;
                for (entry in F) F[entry] && b++;
                for (var b = 1 == b &&
                        F[e], o = 0; a[o]; o++) {
                    var g = a[o].getAttributeNode("type").nodeValue;
                    a[o].className = b || g == e ? g : g + "Disabled";
                    F[g] = b || g == e
                }
            } else F[e] = !F[e], b.className = F[e] ? e : e + "Disabled";
            a = [];
            for (e in F) F[e] || a.push(e);
            a.push("");
            N.className = a.join("Hidden ");
            c()
        }
    }

    function a(a) {
        a || (a = window.event);
        u.load = (a.target ? a.target : a.srcElement).checked;
        J()
    }

    function c() {
        N.scrollTop = N.scrollHeight
    }

    function o() {
        E.style.display = "none"
    }

    function e() {
        var a = document.getElementsByTagName("BODY")[0];
        a.removeChild(E);
        a.appendChild(E);
        E.style.display =
            "block"
    }

    function t(a) {
        if (void 0 === a || null == a) a = u && null === u.pos ? 1 : (u.pos + 1) % 4;
        switch (a) {
            case 0:
                B[0] = "bbTopLeft";
                break;
            case 1:
                B[0] = "bbTopRight";
                break;
            case 2:
                B[0] = "bbBottomLeft";
                break;
            case 3:
                B[0] = "bbBottomRight"
        }
        u.pos = a;
        J()
    }

    function v(a) {
        if (void 0 === a || null === a) a = u && null == u.size ? 0 : (u.size + 1) % 2;
        B[1] = 0 === a ? "bbSmall" : "bbLarge";
        var b = document.getElementById(D.size);
        b.title = 1 === a ? "small" : "large";
        b.className = b.title;
        u.size = a;
        J();
        c()
    }

    function J() {
        var a = [];
        for (entry in u) a.push(entry + ":" + (u[entry] && u[entry].constructor ===
            String ? '"' + u[entry] + '"' : u[entry]));
        var a = a.join(","),
            c = new Date;
        c.setDate(c.getDate() + 14);
        document.cookie = ["blackbird\x3d{", a, "}; expires\x3d", c.toUTCString(), ";"].join("");
        a = [];
        for (word in B) a.push(B[word]);
        E.className = a.join(" ")
    }

    function y(a) {
        a || (a = window.event);
        if (a && 113 == a.keyCode) {
            var c = "block" == E.style.display;
            c && a.shiftKey && a.altKey ? N.innerHTML = "" : c && a.shiftKey ? t() : !a.shiftKey && !a.altKey && (c ? o() : e())
        }
    }

    function w(a, c, b) {
        a = a.constructor === String ? document.getElementById(a) : a;
        a.attachEvent ? (a["e" +
            c + b] = b, a[c + b] = function() {
            a["e" + c + b](window.event)
        }, a.attachEvent("on" + c, a[c + b])) : a.addEventListener(c, b, !1)
    }

    function z(a, c, b) {
        a = a.constructor === String ? document.getElementById(a) : a;
        a.detachEvent ? (a.detachEvent("on" + c, a[c + b]), a[c + b] = null) : a.removeEventListener(c, b, !1)
    }
    var E, N, U = [],
        u = function() {
            var a = RegExp(/blackbird=({[^;]+})(;|\b|$)/).exec(document.cookie);
            return a && a[1] ? eval("(" + a[1] + ")") : {
                pos: null,
                size: null,
                load: null
            }
        }(),
        B = {},
        P = {},
        D = {
            blackbird: "blackbird",
            checkbox: "bbVis",
            filters: "bbFilters",
            controls: "bbControls",
            size: "bbSize"
        },
        F = {
            debug: !0,
            info: !0,
            warn: !0,
            error: !0,
            profile: !0
        };
    window.log = {
        toggle: function() {
            "block" == E.style.display ? o() : e()
        },
        resize: function() {
            v()
        },
        clear: function() {
            N.innerHTML = ""
        },
        move: function() {
            t()
        },
        debug: function(a) {
            g("debug", a)
        },
        warn: function(a) {
            g("warn", a)
        },
        info: function(a) {
            g("info", a)
        },
        error: function(a) {
            g("error", a)
        },
        profile: function(a) {
            var c = new Date;
            void 0 == a || "" == a ? g("error", "\x3cb\x3eERROR:\x3c/b\x3e Please specify a label for your profile statement") : P[a] ? (g("profile", [a, ": ", c - P[a],
                "ms"
            ].join("")), delete P[a]) : (P[a] = c, g("profile", a));
            return c
        }
    };
    w(window, "load", function() {
        E = document.getElementsByTagName("BODY")[0].appendChild(b());
        N = E.getElementsByTagName("OL")[0];
        var o = document.getElementsByTagName("BODY")[0];
        o.currentStyle && ("none" == o.currentStyle.backgroundImage && (o.style.backgroundImage = "url(about:blank)"), "scroll" == o.currentStyle.backgroundAttachment && (o.style.backgroundAttachment = "fixed"));
        w(D.checkbox, "click", a);
        w(D.filters, "click", r);
        w(D.controls, "click", p);
        w(document,
            "keyup", y);
        v(u.size);
        t(u.pos);
        u.load && (e(), document.getElementById(D.checkbox).checked = !0);
        c();
        window.log.init = function() {
            e();
            window.log.error(["\x3cb\x3e", "log", "\x3c/b\x3e can only be initialized once"])
        };
        w(window, "unload", function() {
            z(D.checkbox, "click", a);
            z(D.filters, "click", r);
            z(D.controls, "click", p);
            z(document, "keyup", y)
        })
    })
})();
if ("undefined" == typeof DOMParser) {
    var xmldata = null;
    DOMParser = function() {};
    DOMParser.prototype.parseFromString = function(b, g) {
        if ("undefined" != typeof ActiveXObject) return xmldata = new ActiveXObject("MSXML2.DomDocument.6.0"), xmldata.async = !1, xmldata.loadXML(b), xmldata;
        if ("undefined" != typeof XMLHttpRequest) return xmldata = new XMLHttpRequest, g || (g = "application/xml"), xmldata.open("GET", "data:" + g + ";charset\x3dutf-8," + encodeURIComponent(b), !1), xmldata.overrideMimeType && xmldata.overrideMimeType(g), xmldata.send(null),
            xmldata.responseXML
    }
}
var getViewportWidth = function() {
        var b = 0;
        document.documentElement && document.documentElement.clientWidth ? b = document.documentElement.clientWidth : document.body && document.body.clientWidth ? b = document.body.clientWidth : window.innerWidth && (b = window.innerWidth - 18);
        return b
    },
    getViewportHeight = function() {
        var b = 0;
        document.documentElement && document.documentElement.clientHeight ? b = document.documentElement.clientHeight : document.body && document.body.clientHeight ? b = document.body.clientHeight : window.innerHeight && (b = window.innerHeight -
            18);
        return b
    },
    getViewportScrollX = function() {
        var b = 0;
        document.documentElement && document.documentElement.scrollLeft ? b = document.documentElement.scrollLeft : document.body && document.body.scrollLeft ? b = document.body.scrollLeft : window.pageXOffset ? b = window.pageXOffset : window.scrollX && (b = window.scrollX);
        return b
    },
    getViewportScrollY = function() {
        var b = 0;
        document.documentElement && document.documentElement.scrollTop ? b = document.documentElement.scrollTop : document.body && document.body.scrollTop ? b = document.body.scrollTop :
            window.pageYOffset ? b = window.pageYOffset : window.scrollY && (b = window.scrollY);
        return b
    },
    getAbsoluteViewportWidth = function() {
        return 1 * getViewportWidth() + getViewportScrollX()
    },
    getAbsoluteViewportHeight = function() {
        return 1 * getViewportHeight() + getViewportScrollY()
    },
    registerNS = function(b) {
        b = b.split(".");
        for (var g = window, p = 0; p < b.length; p++) {
            if (null === g[b[p]] || "object" !== typeof g[b[p]]) g[b[p]] = {};
            g = g[b[p]]
        }
    };
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/gm, "")
};
Array.prototype.indexOf || (Array.prototype.indexOf = function(b) {
    for (var g = 0, p = this.length; g < p; g++)
        if (this[g] === b) return g;
    return -1
});
Function.prototype.bind || (Function.prototype.bind = function(b) {
    if ("function" !== typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    var g = Array.prototype.slice.call(arguments, 1),
        p = this,
        r = function() {},
        a = function() {
            return p.apply(this instanceof r && b ? this : b, g.concat(Array.prototype.slice.call(arguments)))
        };
    r.prototype = this.prototype;
    a.prototype = new r;
    return a
});
document.getElementsByClassName = function(b, g) {
    for (var p = [], r = RegExp("\\b" + b + "\\b"), a = this.getElementsByTagName("*", g), c = 0; c < a.length; c++) r.test(a[c].className) && p.push(a[c]);
    return p
};
var popupWindowHandle;

function getPopupWindowHandle() {
    return popupWindowHandle
}
XMLCclRequest = function(b) {
    this.onreadystatechange = function() {
        return null
    };
    this.options = b || {};
    this.readyState = 0;
    this.responseText = "";
    this.status = 0;
    this.statusText = "";
    this.errorFlag = this.sendFlag = !1;
    this.responseBody = this.responseXML = this.async = !0;
    this.uniqueId = this.requestText = this.requestBinding = null;
    this.onerror = this.abort = this.getAllResponseHeaders = this.getResponseHeader = function() {
        return null
    };
    this.open = function(b, p, r) {
        if ("get" != b.toLowerCase() && "post" != b.toLowerCase()) return this.errorFlag = !0,
            this.status = 405, this.statusText = "Method not Allowed", !1;
        this.method = b.toUpperCase();
        this.url = p;
        this.async = void 0 !== r ? !!r : !0;
        this.requestHeaders = null;
        this.responseText = "";
        this.responseBody = this.responseXML = null;
        this.readyState = 1;
        this.sendFlag = !1;
        this.requestText = "";
        this.onreadystatechange()
    };
    this.send = function(b) {
        if (1 != this.readyState || this.sendFlag) return this.errorFlag = !0, this.status = 409, this.statusText = "Invalid State", !1;
        this.sendFlag = !0;
        this.requestLen = b.length;
        this.requestText = b;
        this.uniqueId =
            this.url + "-" + (new Date).getTime() + "-" + Math.floor(99999 * Math.random());
        XMLCCLREQUESTOBJECTPOINTER[this.uniqueId] = this;
        b = document.getElementById("ID_CCLLINKHref_12980__");
        b.href = 'javascript:XMLCCLREQUEST_Send("' + this.uniqueId + '")';
        b.click()
    };
    this.setRequestHeader = function(b, p) {
        if (1 != this.readyState || this.sendFlag) return this.errorFlag = !0, this.status = 409, this.statusText = "Invalid State", !1;
        if (!p) return !1;
        this.requestHeaders || (this.requestHeaders = []);
        this.requestHeaders[b] = p
    }
};
XMLCCLREQUESTOBJECTPOINTER = [];

function APPLINK__() {}

function APPLINK(b, g, p) {
    var r = p.length;
    2E3 < r && (document.getElementById("ID_CCLPostParams_26619__").value = '"' + p + '"', p = p.substring(0, 2E3));
    var a = document.getElementById("ID_CCLLINKHref_12980__");
    a.href = "javascript:APPLINK__(" + b + ',"' + g + '","' + p + '",' + r + ")";
    a.click()
}

function MPAGES_EVENT__() {}

function MPAGES_EVENT(b, g) {
    var p = g.length;
    2E3 < p && (document.getElementById("ID_CCLPostParams_26619__").value = '"' + g + '"', g = g.substring(0, 2E3));
    var r = document.getElementById("ID_CCLLINKHref_12980__");
    r.href = 'javascript:MPAGES_EVENT__("' + b + '","' + g + '",' + p + ")";
    r.click()
}

function CCLLINK__() {}

function CCLLINK(b, g, p) {
    var r = g.length;
    2E3 < r && (document.getElementById("ID_CCLPostParams_26619__").value = '"' + g + '"', g = g.substring(0, 2E3));
    var a = document.getElementById("ID_CCLLINKHref_12980__");
    a.href = 'javascript:CCLLINK__("' + b + '","' + g + '",' + p + "," + r + ")";
    a.click()
}

function evaluate(b) {
    return eval(b)
}

function getXMLHttpRequest() {
    return new XMLCclRequest
}
registerNS("com.cerner.mpage");
com.cerner.mpage.wasLoaded = !1;
com.cerner.mpage.call = function(b, g) {
    var p, r, a, c;
    r = {
        "\x26": "\x26amp;",
        "\x3c": "\x26lt;",
        "\x3e": "\x26gt;",
        '"': "\x26quot;",
        "'": "\x26#39;",
        "/": "\x26#x2F;"
    };
    a = function(a) {
        return String(a).replace(/[&<>"'\/]/g, function(a) {
            return r[a]
        })
    };
    c = "script: " + b + Math.floor(7919 * Math.random());
    com.cerner.mpage.wasLoaded || ((p = MP_Util.CreateTimer("CAP:2012.1.00123.3")) ? (log.debug("CAP:2012.1.00123.3 timer created."), p.Stop(), log.debug("CAP:2012.1.00123.3 timer stopped.")) : log.warn("CAP:2012.1.00123.3 timer not created."),
        com.cerner.mpage.wasLoaded = !0);
    return function(o) {
        var e, t;
        t = "script: " + b + "\n";
        t = t + "inputs: " + o + "\n";
        e = CERN_BrowserDevInd ? new XMLHttpRequest : new XMLCclRequest;
        e.responseType = "document";
        e.onreadystatechange = function() {
            var b;
            4 === e.readyState && (log.profile(c), 200 === e.status ? (log.debug("receiving...\n" + t), b = "undefined" !== typeof XMLSerializer ? (new XMLSerializer).serializeToString(e.responseText) : a(e.responseText), log.debug("reply:\n" + b + "\n"), "undefined" !== typeof DOMParser ? b = (new DOMParser).parseFromString(e.responseText,
                "text/xml") : (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = !1, b.loadXML(e.responseText)), g(b)) : (t = "ajax status non-success: " + e.status + "\n" + t, t += "status text: " + e.statusText, log.error(t)))
        };
        CERN_BrowserDevInd ? (o = b + "?parameters\x3d" + o, log.debug("calling...\n" + t), log.profile(c), e.open("GET", o), e.send(null)) : (log.debug("calling...\n" + t), log.profile(c), e.open("GET", b), e.send(o))
    }
};
var CERN_EventListener = null,
    CERN_MPageComponents = null,
    CERN_ObjectDefinitionMapping = {},
    CERN_TabManagers = null,
    CERN_MPages = null,
    CERN_BrowserDevInd = !1,
    CERN_PersonalFav = null,
    CK_DATA = {},
    STR_PAD_LEFT = 1,
    STR_PAD_RIGHT = 2,
    STR_PAD_BOTH = 3;
Array.prototype.addAll || (Array.prototype.addAll = function(b) {
    if (b && 0 < b.length)
        for (var g = 0, p = b.length; g < p; g++) this.push(b[g])
});
Array.prototype.indexOf || (Array.prototype.indexOf = function(b) {
    for (var g = 0, p = this.length; g < p; g++)
        if (this[g] === b) return g;
    return -1
});
window.onerror = function(b, g, p) {
    var r = null,
        a = null,
        a = null;
    MP_Util.LogError(i18n.UNEXPECTED_ERROR_CAUGHT + "\x3cbr /\x3e" + i18n.discernabu.JS_ERROR + ": " + b + "\x3cbr /\x3e" + i18n.FILE + ": " + g + "\x3cbr /\x3e" + i18n.LINE_NUMBER + ": " + p);
    if (CERN_BrowserDevInd) throw Error(i18n.UNEXPECTED_ERROR_CAUGHT + "\x3cbr /\x3e" + i18n.discernabu.JS_ERROR + ": " + b + "\x3cbr /\x3e" + i18n.FILE + ": " + g + "\x3cbr /\x3e" + i18n.LINE_NUMBER + ": " + p);
    r = MP_ModalDialog.retrieveModalDialogObject("errorModal");
    r || (r = MP_Util.generateModalDialogBody("errorModal",
        "error", i18n.PAGE_ERROR, i18n.PAGE_ERROR_ACTION), r.setHeaderTitle(i18n.ERROR_OCCURED), a = new ModalButton("refreshButton"), a.setText(i18n.REFRESH).setCloseOnClick(!0), a.setOnClickFunction(function() {
        var a = JSON.parse(m_criterionJSON).CRITERION,
            a = ["^MINE^", a.PERSON_ID + ".0", a.ENCNTRS[0].ENCNTR_ID + ".0", a.PRSNL_ID + ".0", a.POSITION_CD + ".0", a.PPR_CD + ".0", "^" + a.EXECUTABLE + "^", "^" + CERN_driver_static_content.replace(/\\/g, "\\\\") + "^", "^" + CERN_driver_mean + "^", a.DEBUG_IND];
        CCLLINK(CERN_driver_script, a.join(","),
            1)
    }), r.addFooterButton(a), a = new ModalButton("closeButton"), a.setText(i18n.CLOSE).setCloseOnClick(!0), r.addFooterButton(a));
    MP_ModalDialog.updateModalDialogObject(r);
    MP_ModalDialog.showModalDialog("errorModal");
    return !0
};
var MP_Core = function() {
    return {
        GetString: function(b, g, p, r) {
            b = b instanceof MP_Core.Measurement ? b.getResult() : MP_Util.Measurement.GetObject(b, g);
            return b instanceof MP_Core.QuantityValue ? r ? b.getValue() : b.toString() : b instanceof Date ? b.format(p) : b
        },
        GetObject: function(b, g) {
            switch (b.CLASSIFICATION.toUpperCase()) {
                case "QUANTITY_VALUE":
                    return new GetQuantityValue(b, g);
                case "STRING_VALUE":
                    return new GetStringValue(b);
                case "DATE_VALUE":
                    return new GetDateValue(b);
                case "CODIFIED_VALUES":
                case "CODE_VALUE":
                    return new GetCodedResult(b);
                case "ENCAPSULATED_VALUE":
                    return new GetEncapsulatedValue(b)
            }
        },
        SetPrecision: function(b, g) {
            return MP_Util.GetNumericFormatter().format(b, "^." + g)
        },
        GetModifiedIcon: function(b) {
            return b.isModified() ? "\x3cspan class\x3d'res-modified'\x3e\x26nbsp;\x3c/span\x3e" : ""
        },
        GetNormalcyClass: function(b) {
            var g = "res-normal";
            if (b = b.getNormalcy()) switch (b.meaning) {
                case "LOW":
                    g = "res-low";
                    break;
                case "HIGH":
                    g = "res-high";
                    break;
                case "ABNORMAL":
                    g = "res-abnormal";
                    break;
                case "CRITICAL":
                case "EXTREMEHIGH":
                case "PANICHIGH":
                case "EXTREMELOW":
                case "PANICLOW":
                case "VABNORMAL":
                case "POSITIVE":
                    g =
                        "res-severe"
            }
            return g
        },
        GetNormalcyResultDisplay: function(b, g) {
            return ["\x3cspan class\x3d'", MP_Core.GetNormalcyClass(b), "'\x3e\x3cspan class\x3d'res-ind'\x3e\x26nbsp;\x3c/span\x3e\x3cspan class\x3d'res-value'\x3e", MP_Core.GetEventViewerLink(b, MP_Util.Measurement.GetString(b, null, "longDateTime2", g)), "\x3c/span\x3e", MP_Util.Measurement.GetModifiedIcon(b), "\x3c/span\x3e"].join("")
        },
        GetEventViewerLink: function(b, g) {
            return ["\x3ca onclick\x3d'MP_Util.LaunchClinNoteViewer(", [b.getPersonId(), b.getEncntrId(),
                b.getEventId(), '"EVENT"'
            ].join(), "); return false;' href\x3d'#'\x3e", g, "\x3c/a\x3e"].join("")
        },
        GetEncapsulatedValue: function(b) {
            var g = [];
            if ((b = b.ENCAPSULATED_VALUE) && 0 < b.length)
                for (var p = 0, r = b.length; p < r; p++) {
                    var a = b[p].TEXT_PLAIN;
                    a && g.push(a)
                }
            return g.join("")
        },
        GetQuantityValue: function(b, g) {
            var p = new MP_Core.QuantityValue;
            p.init(b, g);
            return p
        },
        GetDateValue: function(b) {
            for (var g = 0, p = b.DATE_VALUE.length; g < p; g++) {
                var r = b.DATE_VALUE[g];
                if (r.DATE) return b = new Date, b.setISO8601(r.DATE), b
            }
            return null
        },
        GetCodedResult: function(b) {
            b = b.CODE_VALUE;
            for (var g = [], p = 0, r = b.length; p < r; p++) {
                for (var a = b[p].VALUES, c = 0, o = a.length; c < o; c++) g.push(a[c].SOURCE_STRING);
                (a = b[p].OTHER_RESPONSE) && g.push(a)
            }
            return g.join(", ")
        },
        GetStringValue: function(b) {
            b = b.STRING_VALUE;
            for (var g = [], p = 0, r = b.length; p < r; p++) g.push(b[p].VALUE);
            return g.join(", ")
        },
        Criterion: function(b, g) {
            var p = null,
                r = null,
                a = [];
            this.person_id = b.PERSON_ID;
            this.encntr_id = 0 < b.ENCNTRS.length ? b.ENCNTRS[0].ENCNTR_ID : 0;
            this.provider_id = b.PRSNL_ID;
            this.executable =
                b.EXECUTABLE;
            this.static_content = g;
            this.position_cd = b.POSITION_CD;
            this.ppr_cd = b.PPR_CD;
            this.debug_ind = b.DEBUG_IND;
            CERN_BrowserDevInd = 1 === (parseInt(this.debug_ind, 10) & 1) ? !0 : !1;
            this.help_file_local_ind = b.HELP_FILE_LOCAL_IND;
            this.category_mean = b.CATEGORY_MEAN;
            this.locale_id = 2 === (parseInt(this.debug_ind, 10) & 2) ? "en_us" : b.LOCALE_ID;
            this.logical_domain_id = "undefined" != typeof b.LOGICAL_DOMAIN_ID ? b.LOGICAL_DOMAIN_ID : null;
            this.device_location = "";
            var c = b.ENCNTR_OVERRIDE;
            if (c)
                for (var o = c.length; o--;) a.push(c[o].ENCNTR_ID);
            else a.push(this.encntr_id);
            this.setPatientInfo = function(a) {
                p = a
            };
            this.getPatientInfo = function() {
                return p
            };
            this.getPersonnelInfo = function() {
                r || (r = new MP_Core.PersonnelInformation(this.provider_id, this.person_id));
                return r
            };
            this.getEncounterOverride = function() {
                return a
            }
        },
        PatientInformation: function() {
            var b = null,
                g = null;
            this.setSex = function(b) {
                g = b
            };
            this.getSex = function() {
                return g
            };
            this.setDOB = function(g) {
                b = g
            };
            this.getDOB = function() {
                return b
            };
            this.setName = function(b) {
                m_name = b
            };
            this.getName = function() {
                return m_name
            }
        },
        PeriopCases: function() {
            var b = null,
                g = null,
                p = null,
                r = null,
                a = null;
            this.setCaseID = function(a) {
                b = a
            };
            this.getCaseID = function() {
                return b
            };
            this.setDays = function(a) {
                g = a
            };
            this.getDays = function() {
                return g
            };
            this.setHours = function(a) {
                p = a
            };
            this.getHours = function() {
                return p
            };
            this.setMins = function(a) {
                r = a
            };
            this.getMins = function() {
                return r
            };
            this.setCntdwnDscFlg = function(c) {
                a = c
            };
            this.getCntdwnDscFlg = function() {
                return a
            }
        },
        ScriptRequest: function(b, g) {
            var p = "",
                r = "",
                a = null,
                c = null,
                o = !0,
                e = null,
                t = null,
                v = null,
                J = !1,
                y = !1;
            this.setExecCallback =
                function(a) {
                    J = a
                };
            this.getExecCallback = function() {
                return J
            };
            this.logCompletion = function(a) {
                MP_Util.LogInfo("\x3cb\x3eRequest Ended\x3c/b\x3e\x3cbr /\x3e\x3cul\x3e\x3cli\x3eprogram: " + r + "\x3c/li\x3e\x3cli\x3eend_time: " + new Date + "\x3c/li\x3e\x3cli\x3estatus: " + a.status + "\x3c/li\x3e\x3c/ul\x3e")
            };
            this.logStart = function() {
                MP_Util.LogInfo("\x3cb\x3eRequest Started\x3c/b\x3e\x3cbr /\x3e\x3cul\x3e\x3cli\x3eprogram: " + r + "\x3c/li\x3e\x3cli\x3estart_time: " + new Date + "\x3c/li\x3e\x3c/ul\x3e")
            };
            this.start = function() {
                var a =
                    CERN_BrowserDevInd ? new XMLHttpRequest : new XMLCclRequest,
                    c = this;
                a.onreadystatechange = function() {
                    if (4 === this.readyState) {
                        c.logCompletion(this);
                        c.notify();
                        try {
                            c.getResponseHandler() && c.getResponseHandler().handleResponse(this)
                        } catch (a) {
                            c.getTimer() && c.getTimer().abort()
                        } finally {
                            c.getTimer() && c.getTimer().stop()
                        }
                        MP_Util.ReleaseRequestReference(this)
                    }
                };
                this.getTimer() && this.getTimer().start();
                this.logStart();
                if (CERN_BrowserDevInd) {
                    var b = this.getProgramName() + "?parameters\x3d" + this.getParameters().join(","),
                        e = this.getRequestBlobIn();
                    e && (b += "\x26blobIn\x3d" + e);
                    a.open("GET", b, c.isAsync());
                    e && a.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    a.send(null)
                } else a.open("GET", this.getProgramName(), this.isAsync()), (e = this.getRequestBlobIn()) && a.setBlobIn(e), a.send(this.getParameters().join(","))
            };
            this.notify = function() {
                this.getSource() === RequestManager.SOURCE && MP_RequestManager.notify()
            };
            this.getResponseHandler = function() {
                return e
            };
            this.setResponseHandler = function(a) {
                e = a
            };
            this.getTimer =
                function() {
                    return t
                };
            this.setTimer = function(a) {
                t = a
            };
            this.getComponent = function() {
                return b
            };
            this.getLoadTimer = function() {
                return g
            };
            this.setName = function(a) {
                p = a
            };
            this.getName = function() {
                return p
            };
            this.setProgramName = function(a) {
                r = a
            };
            this.getProgramName = function() {
                return r
            };
            this.setParameters = function(c) {
                a = c
            };
            this.getParameters = function() {
                return a
            };
            this.setRequestBlobIn = function(a) {
                c = a
            };
            this.getRequestBlobIn = function() {
                return c
            };
            this.setAsync = function(a) {
                o = a
            };
            this.isAsync = function() {
                return o
            };
            this.getSource =
                function() {
                    return v
                };
            this.setSource = function(a) {
                v = a
            };
            this.getRequiresRawData = function() {
                return y
            };
            this.setRequiresRawData = function(a) {
                y = a
            }
        },
        ScriptReply: function(b) {
            var g = "",
                p = "F",
                r = "",
                a = null;
            this.setName = function(a) {
                g = a
            };
            this.getName = function() {
                return g
            };
            this.setStatus = function(a) {
                p = a
            };
            this.getStatus = function() {
                return p
            };
            this.setError = function(a) {
                r = a
            };
            this.getError = function() {
                return r
            };
            this.setResponse = function(c) {
                a = c
            };
            this.getResponse = function() {
                return a
            };
            this.getComponent = function() {
                return b
            }
        },
        PersonnelInformation: function(b, g) {
            var p = null,
                r = null;
            try {
                r = window.external.DiscernObjectFactory("PVCONTXTMPAGE"), MP_Util.LogDiscernInfo(null, "PVCONTXTMPAGE", "mp_core.js", "PersonnelInformation"), r && (p = r.GetValidEncounters(g), MP_Util.LogDebug("Viewable Encounters: " + p))
            } catch (a) {} finally {
                r = null
            }
            this.getPersonnelId = function() {
                return b
            };
            this.getViewableEncounters = function() {
                return p
            }
        },
        GetViewableEncntrs: function(b) {
            function g(a) {
                var c = "",
                    b = MP_Resources.getSharedResource("viewableEncntrs");
                if ("S" === a.getStatus()) try {
                    var o =
                        a.getResponse(),
                        c = $.map(o.AUTH_ENCOUNTER.AUTH_ENCOUNTERS, function(a) {
                            return a.ENCOUNTER_ID + ".0"
                        }).join(",");
                    MP_Util.LogDebug("Viewable Encounters obtained from ClinicalContext service: " + c)
                } catch (g) {
                    MP_Util.LogJSError(g, this, "mp_core.js", "GetViewableEncntrs")
                } else MP_Util.LogError("Unable to successfully retrieve Viewable Encounters from ClinicalContext service");
                b.setIsAvailable(!0);
                b.setIsBeingRetrieved(!1);
                b.setResourceData(c);
                CERN_EventListener.fireEvent(null, p, "viewableEncntrInfoAvailable", b)
            }
            var p = this,
                r = "",
                a = MP_Resources.getSharedResource("viewableEncntrs");
            a || (a = new SharedResource("viewableEncntrs"), MP_Resources.addSharedResource("viewableEncntrs", a));
            if (!a.isResourceAvailable() || !a.getResourceData()) {
                var r = null,
                    c = "";
                try {
                    r = window.external.DiscernObjectFactory("PVCONTXTMPAGE"), MP_Util.LogDiscernInfo(null, "PVCONTXTMPAGE", "mp_core.js", "getViewableFromPvContxtMpage"), r && (c = r.GetValidEncounters(b), MP_Util.LogDebug("Viewable Encounters obtained from PVCONTXTMPAGE: " + c))
                } catch (o) {} finally {}(r =
                    c) ? (a.setResourceData(r), a.setIsAvailable(!0)) : a.isBeingRetrieved() || (a.setIsBeingRetrieved(!0), r = new MP_Core.ScriptRequest, b = ["^MINE^", "~" + ('{"REQUESTIN":{"PATIENT_ID":' + b + '.0,"LOAD":{"AUTH_ENCOUNTER":1}}}') + "~", 3202004, 3202004, 3200310], r.setProgramName("mp_exec_std_request"), r.setParameters(b), r.setAsync(!0), r.setExecCallback(!0), MP_Core.XMLCCLRequestCallBack(null, r, g))
            }
            return a
        },
        XMLCclRequestWrapper: function(b, g, p, r) {
            var a = new MP_Core.ScriptRequest(b, b.getComponentLoadTimerName());
            a.setProgramName(g);
            a.setParameters(p);
            a.setAsync(r);
            MP_Core.XmlStandardRequest(b, a, null)
        },
        XMLCCLRequestCallBack: function(b, g, p) {
            MP_Core.XmlStandardRequest(b, g, p)
        },
        XmlStandardRequest: function(b, g, p) {
            var r = i18n.discernabu,
                a = [],
                c = null,
                o = null,
                e = null,
                t = null,
                v = g.getRequiresRawData(),
                o = new CustomResponseHandler,
                e = new MP_Core.ScriptReply(b);
            e.setName(g.getName());
            g.getLoadTimer() && !g.getTimer() && g.setTimer((new RequestTimer).setTimerName(g.getLoadTimer()).setSubTimerName(b && MPageComponent.prototype.isPrototypeOf(b) ? b.getCriterion().category_mean :
                null));
            o.setSuccessHandler(function(o) {
                try {
                    MP_Util.LogScriptCallInfo(b, o, "mp_core.js", "XmlStandardRequest");
                    if (v) e.setResponse(o.responseText), e.setStatus(null);
                    else switch (t = JSON.parse(o.responseText).RECORD_DATA, e.setResponse(t), e.setStatus(t.STATUS_DATA.STATUS), t.STATUS_DATA.STATUS) {
                        case "Z":
                            b && (MPageComponent.prototype.isPrototypeOf(b) && !p) && b.finalizeComponent(MP_Util.HandleNoDataResponse(b.getStyles().getNameSpace()), b.isLineNumberIncluded() ? "(0)" : "");
                            break;
                        case "S":
                            try {
                                b && (MPageComponent.prototype.isPrototypeOf(b) &&
                                    !p) && (c = MP_Util.CreateTimer(b.getComponentRenderTimerName(), b.getCriterion().category_mean), Util.Style.g("sec-total", b.getRootComponentNode(), "span")[0].innerHTML = r.RENDERING_DATA + "...", b.renderComponent(t))
                            } catch (y) {
                                throw MP_Util.LogJSError(y, b, "mp_core.js", "XmlStandardRequest"), c && (c.Abort(), c = null), y;
                            } finally {
                                c && c.Stop()
                            }
                            break;
                        default:
                            MP_Util.LogScriptCallError(b, o, "mp_core.js", "XmlStandardRequest");
                            var w = [],
                                z = null;
                            w.push("\x3cb\x3e", r.DISCERN_ERROR, "\x3c/b\x3e\x3cbr /\x3e\x3cul\x3e\x3cli\x3e",
                                r.STATUS, ": ", o.status, "\x3c/li\x3e\x3cli\x3e", r.REQUEST, ": ", o.requestText, "\x3c/li\x3e");
                            var E = t.STATUS_DATA;
                            if (E.SUBEVENTSTATUS.length && 0 < E.SUBEVENTSTATUS.length)
                                for (var N = 0, U = E.SUBEVENTSTATUS.length; N < U; N++) z = E.SUBEVENTSTATUS[N], w.push("\x3cli\x3e", r.ERROR_OPERATION, ": ", z.OPERATIONNAME, "\x3c/li\x3e\x3cli\x3e", r.ERROR_OPERATION_STATUS, ": ", z.OPERATIONSTATUS, "\x3c/li\x3e\x3cli\x3e", r.ERROR_TARGET_OBJECT, ": ", z.TARGETOBJECTNAME, "\x3c/li\x3e\x3cli\x3e", r.ERROR_TARGET_OBJECT_VALUE, ": ", z.TARGETOBJECTVALUE,
                                    "\x3c/li\x3e");
                            else void 0 === E.SUBEVENTSTATUS.length && (z = E.SUBEVENTSTATUS, w.push("\x3cli\x3e", r.ERROR_OPERATION, ": ", z.OPERATIONNAME, "\x3c/li\x3e\x3cli\x3e", r.ERROR_OPERATION_STATUS, ": ", z.OPERATIONSTATUS, "\x3c/li\x3e\x3cli\x3e", r.ERROR_TARGET_OBJECT, ": ", z.TARGETOBJECTNAME, "\x3c/li\x3e\x3cli\x3e", r.ERROR_TARGET_OBJECT_VALUE, ": ", z.TARGETOBJECTVALUE, "\x3c/li\x3e"));
                            w.push("\x3c/ul\x3e");
                            a = w;
                            e.setError(a.join(""));
                            b && (MPageComponent.prototype.isPrototypeOf(b) && !p) && b.finalizeComponent(MP_Util.HandleErrorResponse(b.getStyles().getNameSpace(),
                                a.join("")), b.isLineNumberIncluded() ? "(0)" : "")
                    }
                    g.setExecCallback(!0)
                } catch (u) {
                    throw MP_Util.LogJSError(u, b, "mp_core.js", "XmlStandardRequest"), a = [], a.push("\x3cb\x3e", r.JS_ERROR, "\x3c/b\x3e\x3cbr /\x3e\x3cul\x3e\x3cli\x3e", r.MESSAGE, ": ", u.message, "\x3c/li\x3e\x3cli\x3e", r.NAME, ": ", u.name, "\x3c/li\x3e\x3cli\x3e", r.NUMBER, ": ", u.number & 65535, "\x3c/li\x3e\x3cli\x3e", r.DESCRIPTION, ": ", u.description, "\x3c/li\x3e\x3c/ul\x3e"), b && MPageComponent.prototype.isPrototypeOf(b) && b.finalizeComponent(MP_Util.HandleErrorResponse(b.getStyles().getNameSpace(),
                        a.join("")), ""), u;
                } finally {
                    p && ("function" === typeof p && g.getExecCallback()) && (e.getResponse() || e.setResponse(o.responseText), p(e)), b && "undefined" != typeof b.postProcessing && b.postProcessing()
                }
            });
            o.setErrorHandler(function(c) {
                MP_Util.LogScriptCallError(b, c, "mp_core.js", "XmlStandardRequest");
                a = [];
                a.push("\x3cb\x3e", r.DISCERN_ERROR, "\x3c/b\x3e\x3cbr /\x3e\x3cul\x3e\x3cli\x3e", r.STATUS, ": ", c.status, "\x3c/li\x3e\x3cli\x3e", r.REQUEST, ": ", c.requestText, "\x3c/li\x3e\x3c/ul\x3e");
                e.setError(a.join(""));
                b &&
                    (MPageComponent.prototype.isPrototypeOf(b) && !p) && b.finalizeComponent(MP_Util.HandleErrorResponse(b.getStyles().getNameSpace(), a.join("")), "");
                p && "function" === typeof p && p(e);
                b && "undefined" != typeof b.postProcessing && b.postProcessing()
            });
            g.setResponseHandler(o);
            MP_RequestManager.performRequest(g)
        },
        XMLCCLRequestThread: function(b, g, p) {
            p.setName(b);
            this.getName = function() {
                return b
            };
            this.getComponent = function() {
                return g
            };
            this.getRequest = function() {
                return p
            }
        },
        XMLCCLRequestThreadManager: function(b, g, p) {
            var r =
                null,
                a = null,
                c = !1,
                o = !1;
            this.addThread = function(a) {
                r || (r = []);
                r.push(a)
            };
            this.begin = function() {
                if (r && 0 < r.length)
                    for (x = r.length; x--;) {
                        var a = r[x];
                        MP_Core.XMLCCLRequestCallBack(a.getComponent(), a.getRequest(), this.completeThread)
                    } else p ? (a = g.isLineNumberIncluded() ? "(0)" : "", g.finalizeComponent(MP_Util.HandleNoDataResponse(g.getStyles().getNameSpace()), a), g.postProcessing()) : b(null, g)
            };
            this.completeThread = function(e) {
                a || (a = []);
                "S" === e.getStatus() ? c = !0 : "F" === e.getStatus() && (o = !0);
                a.push(e);
                if (a.length === r.length) {
                    e =
                        g.isLineNumberIncluded() ? "(0)" : "";
                    var t = null;
                    try {
                        if (p)
                            if (o) {
                                for (var t = [], v = a.length; v--;) {
                                    var J = a[v];
                                    "F" === J.getStatus() && t.push(J.getError())
                                }
                                g.finalizeComponent(MP_Util.HandleErrorResponse(g.getStyles().getNameSpace(), t.join("\x3cbr /\x3e")), "")
                            } else c ? b(a, g) : (e = g.isLineNumberIncluded() ? "(0)" : "", g.finalizeComponent(MP_Util.HandleNoDataResponse(g.getStyles().getNameSpace()), e));
                        else b(a, g)
                    } catch (y) {
                        MP_Util.LogJSError(y, g, "mp_core.js", "XMLCCLRequestThreadManager"), v = i18n.discernabu, t = ["\x3cb\x3e",
                            v.JS_ERROR, "\x3c/b\x3e\x3cbr /\x3e\x3cul\x3e\x3cli\x3e", v.MESSAGE, ": ", y.message, "\x3c/li\x3e\x3cli\x3e", v.NAME, ": ", y.name, "\x3c/li\x3e\x3cli\x3e", v.NUMBER, ": ", y.number & 65535, "\x3c/li\x3e\x3cli\x3e", v.DESCRIPTION, ": ", y.description, "\x3c/li\x3e\x3c/ul\x3e"
                        ], g.finalizeComponent(MP_Util.HandleErrorResponse(g.getStyles().getNameSpace(), t.join("")), "")
                    } finally {
                        g && "undefined" != typeof g.postProcessing && g.postProcessing()
                    }
                }
            }
        },
        MapObject: function(b, g) {
            this.name = b;
            this.value = g
        },
        TabItem: function(b, g, p, r) {
            this.key =
                b;
            this.name = g;
            this.components = p;
            this.prefIdentifier = r
        },
        TabManager: function(b) {
            var g = !1,
                p = !1;
            this.toggleExpandAll = function() {};
            this.loadTab = function() {
                if (!g) {
                    g = !0;
                    var r = b.components;
                    if (r) {
                        for (var a = 0; a < r.length; a++) {
                            var c = r[a];
                            c.isDisplayable() && c.isExpanded() && c.startComponentDataRetrieval()
                        }
                        for (a = 0; a < r.length; a++) c = r[a], c.isDisplayable() && !c.isExpanded() && c.startComponentDataRetrieval()
                    }
                }
            };
            this.getTabItem = function() {
                return b
            };
            this.getSelectedTab = function() {
                return p
            };
            this.isTabLoaded = function() {
                return g
            };
            this.setSelectedTab = function(b) {
                p = b
            }
        },
        ReferenceRangeResult: function() {
            var b = -1,
                g = -1,
                p = -1,
                r = -1,
                a = null,
                c = null,
                o = null,
                e = null;
            this.init = function(t, v) {
                var J = MP_Util.GetNumericFormatter();
                p = J.format(t.CRITICAL_LOW.NUMBER);
                "" != t.CRITICAL_LOW.UNIT_CD && (o = MP_Util.GetValueFromArray(t.CRITICAL_LOW.UNIT_CD, v));
                r = J.format(t.CRITICAL_HIGH.NUMBER);
                "" != t.CRITICAL_HIGH.UNIT_CD && (e = MP_Util.GetValueFromArray(t.CRITICAL_HIGH.UNIT_CD, v));
                b = J.format(t.NORMAL_LOW.NUMBER);
                "" != t.NORMAL_LOW.UNIT_CD && (a = MP_Util.GetValueFromArray(t.NORMAL_LOW.UNIT_CD,
                    v));
                g = J.format(t.NORMAL_HIGH.NUMBER);
                "" != t.NORMAL_HIGH.UNIT_CD && (c = MP_Util.GetValueFromArray(t.NORMAL_HIGH.UNIT_CD, v))
            };
            this.getNormalLow = function() {
                return b
            };
            this.getNormalHigh = function() {
                return g
            };
            this.getNormalLowUOM = function() {
                return a
            };
            this.getNormalHighUOM = function() {
                return c
            };
            this.getCriticalLow = function() {
                return p
            };
            this.getCriticalHigh = function() {
                return r
            };
            this.getCriticalLowUOM = function() {
                return o
            };
            this.getCriticalHighUOM = function() {
                return e
            };
            this.toNormalInlineString = function() {
                var e = a ?
                    a.display : "",
                    o = c ? c.display : "";
                return 0 != b || 0 != g ? b + "\x26nbsp;" + e + " - " + g + "\x26nbsp;" + o : ""
            };
            this.toCriticalInlineString = function() {
                var a = o ? o.display : "",
                    c = e ? e.display : "";
                return 0 != p || 0 != r ? p + "\x26nbsp;" + a + " - " + r + "\x26nbsp;" + c : ""
            }
        },
        QuantityValue: function() {
            var b, g, p = null,
                r = null,
                a = 0,
                c = !1;
            this.init = function(o, e) {
                for (var t = o.QUANTITY_VALUE, v = o.REFERENCE_RANGE, J = 0, y = t.length; J < y; J++) {
                    var w = t[J].NUMBER;
                    g = t[J].PRECISION;
                    isNaN(w) || (b = MP_Util.Measurement.SetPrecision(w, g), a = w);
                    if ("" != t[J].MODIFIER_CD && (w = MP_Util.GetValueFromArray(t[J].MODIFIER_CD,
                            e))) b = w.display + b, c = !0;
                    "" != t[J].UNIT_CD && (p = MP_Util.GetValueFromArray(t[J].UNIT_CD, e));
                    for (var w = 0, z = v.length; w < z; w++) r = new MP_Core.ReferenceRangeResult, r.init(v[w], e)
                }
            };
            this.getValue = function() {
                return b
            };
            this.getRawValue = function() {
                return a
            };
            this.getUOM = function() {
                return p
            };
            this.getRefRange = function() {
                return r
            };
            this.getPrecision = function() {
                return g
            };
            this.toString = function() {
                return p ? b + " " + p.display : b
            };
            this.hasModifier = function() {
                return c
            }
        },
        Measurement: function() {
            var b = 0,
                g = 0,
                p = 0,
                r = null,
                a = null,
                c = null,
                o = null,
                e = null,
                t = null,
                v = "",
                J = 0;
            this.init = function(e, t, v, J, N, U, u) {
                b = e;
                g = t;
                p = v;
                r = J;
                a = N;
                o = U;
                c = u
            };
            this.initFromRec = function(y, w) {
                var z = new Date,
                    E = new Date;
                b = y.EVENT_ID;
                g = y.PATIENT_ID;
                p = y.ENCOUNTER_ID;
                r = MP_Util.GetValueFromArray(y.EVENT_CD, w);
                z.setISO8601(y.EFFECTIVE_DATE);
                a = z;
                o = MP_Util.Measurement.GetObject(y, w);
                E.setISO8601(y.UPDATE_DATE);
                c = E;
                e = MP_Util.GetValueFromArray(y.NORMALCY_CD, w);
                t = MP_Util.GetValueFromArray(y.STATUS_CD, w);
                v = y.COMMENT;
                J = y.HAS_COMMENTS_IND
            };
            this.getEventId = function() {
                return b
            };
            this.getPersonId =
                function() {
                    return g
                };
            this.getEncntrId = function() {
                return p
            };
            this.getEventCode = function() {
                return r
            };
            this.getDateTime = function() {
                return a
            };
            this.getUpdateDateTime = function() {
                return c
            };
            this.getResult = function() {
                return o
            };
            this.setNormalcy = function(a) {
                e = a
            };
            this.getNormalcy = function() {
                return e
            };
            this.setStatus = function(a) {
                t = a
            };
            this.getStatus = function() {
                return t
            };
            this.isModified = function() {
                if (t) {
                    var a = t.meaning;
                    if ("MODIFIED" === a || "ALTERED" === a) return !0
                }
                return !1
            };
            this.getComment = function() {
                return v
            };
            this.getCommentsIndicator =
                function() {
                    return J
                }
        },
        MenuItem: function() {
            var b = "",
                g = "",
                p = 0,
                r, a = 0,
                c = 0;
            this.setDescription = function(a) {
                g = a
            };
            this.getDescription = function() {
                return g
            };
            this.setName = function(a) {
                b = a
            };
            this.getName = function() {
                return b
            };
            this.setId = function(a) {
                p = a
            };
            this.getId = function() {
                return p
            };
            this.setMeaning = function(a) {
                r = a
            };
            this.getMeaning = function() {
                return r
            };
            this.setValSequence = function(c) {
                a = c
            };
            this.getValSequence = function() {
                return a
            };
            this.setValTypeFlag = function(a) {
                c = a
            };
            this.getValTypeFlag = function() {
                return c
            }
        },
        CriterionFilters: function(b) {
            var g = [];
            this.addFilter = function(b, r) {
                g.push(new MP_Core.MapObject(b, r))
            };
            this.checkFilters = function() {
                for (var p = b.getPatientInfo(), r = g.length; r--;) {
                    var a = g[r],
                        c = null;
                    switch (a.name) {
                        case MP_Core.CriterionFilters.SEX_MEANING:
                            if ((c = p.getSex()) && a.value == c.meaning) continue;
                            return !1;
                        case MP_Core.CriterionFilters.DOB_OLDER_THAN:
                            if ((c = p.getDOB()) && c <= a.value) continue;
                            return !1;
                        case MP_Core.CriterionFilters.DOB_YOUNGER_THAN:
                            if ((c = p.getDOB()) && c >= a.value) continue;
                            return !1;
                        default:
                            return alert("Unhandled criterion filter"), !1
                    }
                }
                return !0
            }
        },
        CreateSimpleError: function(b, g) {
            var p = [],
                r = i18n.discernabu,
                a = b.isLineNumberIncluded() ? "(0)" : "";
            p.push("\x3cb\x3e", r.DISCERN_ERROR, "\x3c/b\x3e\x3cbr /\x3e\x3cul\x3e\x3cli\x3e", g, "\x3c/li\x3e\x3c/ul\x3e");
            b.finalizeComponent(MP_Util.HandleErrorResponse(b.getStyles().getNameSpace(), p.join("")), a);
            b.postProcessing()
        },
        generateUserMessageHTML: function(b, g, p, r) {
            var a = "";
            if ("string" != typeof b) return MP_Util.LogError("generateUserMessageHTML only accepts msgType parameters of string"), "";
            switch (b.toLowerCase()) {
                case "error":
                    a =
                        "\x3cdiv class\x3d'error-container " + (r || "") + "'\x3e\x3cspan class\x3d'error-text message-info-text'\x3e" + (g || "") + "\x3c/span\x3e" + (p || "") + "\x3c/div\x3e";
                    break;
                case "warning":
                    a = "\x3cdiv class\x3d'warning-container " + (r || "") + "'\x3e\x3cspan class\x3d'message-info-text'\x3e" + (g || "") + "\x3c/span\x3e" + (p || "") + "\x3c/div\x3e";
                    break;
                case "information":
                    a = "\x3cdiv class\x3d'information-container " + (r || "") + "'\x3e\x3cspan class\x3d'message-info-text'\x3e" + (g || "") + "\x3c/span\x3e" + (p || "") + "\x3c/div\x3e";
                    break;
                case "busy":
                    a =
                        "\x3cdiv class\x3d'busy-container " + (r || "") + "'\x3e\x3cspan class\x3d'message-info-text'\x3e" + (g || "") + "\x3c/span\x3e" + (p || "") + "\x3c/div\x3e";
                    break;
                default:
                    a = "\x3cdiv class\x3d'default-container " + (r || "") + "'\x3e\x3cspan class\x3d'message-info-text'\x3e" + (g || "") + "\x3c/span\x3e" + (p || "") + "\x3c/div\x3e"
            }
            return a
        }
    }
}();
MP_Core.CriterionFilters.SEX_MEANING = 1;
MP_Core.CriterionFilters.DOB_OLDER_THAN = 2;
MP_Core.CriterionFilters.DOB_YOUNGER_THAN = 3;
MP_Core.AppUserPreferenceManager = function() {
    function b(a, c, b) {
        var e = CERN_BrowserDevInd ? new XMLHttpRequest : new XMLCclRequest;
        b || (b = !1);
        e.onreadystatechange = function() {
            if (4 == this.readyState && 200 == this.status) {
                MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "WritePreferences");
                var b = JSON.parse(this.responseText).RECORD_DATA;
                if ("Z" == b.STATUS_DATA.STATUS) r = null;
                else if ("S" == b.STATUS_DATA.STATUS) r = a, c && 0 < c.length && alert(c);
                else {
                    MP_Util.LogScriptCallError(null, this, "mp_core.js", "WritePreferences");
                    var e = [],
                        b = b.STATUS_DATA;
                    e.push("STATUS: " + b.STATUS);
                    for (var o = 0, g = b.SUBEVENTSTATUS.length; o < g; o++) {
                        var t = b.SUBEVENTSTATUS[o];
                        e.push(t.OPERATIONNAME, t.OPERATIONSTATUS, t.TARGETOBJECTNAME, t.TARGETOBJECTVALUE)
                    }
                    window.status = "Error saving user preferences: " + e.join(",")
                }
            }
            4 == this.readyState && MP_Util.ReleaseRequestReference(this)
        };
        var t = null != a ? JSON.stringify(a) : "";
        "MP_COMMON_ORDERS_V4" == g.category_mean && (p = "MP_COMMON_ORDERS_V4");
        t = ["^mine^", g.provider_id + ".0", "^" + p + "^", "~" + t + "~"];
        CERN_BrowserDevInd ? (t = "MP_MAINTAIN_USER_PREFS?parameters\x3d" +
            t.join(","), e.open("GET", t, b), e.send(null)) : (e.open("GET", "MP_MAINTAIN_USER_PREFS", b), e.send(t.join(",")))
    }
    var g = null,
        p = "",
        r = null;
    return {
        Initialize: function(a, c) {
            g = a;
            p = c;
            r = null
        },
        SetPreferences: function(a) {
            r = JSON.parse(a)
        },
        LoadPreferences: function() {
            if (!g) return alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage."), null;
            if (!r) {
                var a = CERN_BrowserDevInd ? new XMLHttpRequest : new XMLCclRequest;
                a.onreadystatechange = function() {
                    if (4 == this.readyState && 200 == this.status) {
                        MP_Util.LogScriptCallInfo(null,
                            this, "mp_core.js", "LoadPreferences");
                        var a = JSON.parse(this.responseText).RECORD_DATA;
                        if ("S" == a.STATUS_DATA.STATUS) r = JSON.parse(a.PREF_STRING);
                        else {
                            if ("Z" != a.STATUS_DATA.STATUS) {
                                MP_Util.LogScriptCallError(null, this, "mp_core.js", "LoadPreferences");
                                var c = [],
                                    a = a.STATUS_DATA;
                                c.push("STATUS: " + a.STATUS);
                                for (var b = 0, g = a.SUBEVENTSTATUS.length; b < g; b++) {
                                    var p = a.SUBEVENTSTATUS[b];
                                    c.push(p.OPERATIONNAME, p.OPERATIONSTATUS, p.TARGETOBJECTNAME, p.TARGETOBJECTVALUE)
                                }
                                window.status = "Error retrieving user preferences " +
                                    c.join(",")
                            }
                            return
                        }
                    }
                    4 == this.readyState && MP_Util.ReleaseRequestReference(this)
                };
                var c = ["^mine^", g.provider_id + ".0", "^" + p + "^"];
                CERN_BrowserDevInd ? (c = "MP_GET_USER_PREFS?parameters\x3d" + c.join(","), a.open("GET", c, !1), a.send(null)) : (a.open("GET", "MP_GET_USER_PREFS", !1), a.send(c.join(",")))
            }
        },
        GetPreferences: function() {
            if (!g) return alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage."), null;
            r || this.LoadPreferences();
            return r
        },
        SavePreferences: function(a) {
            var c = Util.Style.g("col-group",
                    document.body, "div"),
                o = 0,
                e = 0,
                t = 0,
                r = 0,
                p = {
                    user_prefs: {}
                },
                o = p.user_prefs;
            o.page_prefs = {};
            o = o.page_prefs;
            o.components = [];
            for (var y = o.components, w = [], z = 0, E = c.length; z < E; z++)
                if (o = z + 1, e = Util.Style.g("col-outer1", c[z], "div"), 0 < e.length)
                    for (var N = Util.gcs(e[0]), U = 0, u = N.length; U < u; U++)
                        for (var e = U + 1, B = Util.gcs(N[U]), P = 0, D = B.length; P < D; P++) {
                            var F = {},
                                t = P + 1,
                                r = jQuery(B[P]).attr("id"),
                                r = MP_Util.GetCompObjByStyleId(r);
                            F.id = r.getComponentId();
                            F.group_seq = o;
                            F.col_seq = e;
                            F.row_seq = t;
                            F.preferencesObj = r.getPreferencesObj();
                            F.toggleStatus = 2 === r.getToggleStatus() ? 1 : r.getToggleStatus();
                            F.grouperFilterLabel = r.getGrouperFilterLabel();
                            F.grouperFilterCatLabel = r.getGrouperFilterCatLabel();
                            F.grouperFilterCriteria = r.getGrouperFilterCriteria();
                            F.grouperFilterCatalogCodes = r.getGrouperFilterCatalogCodes();
                            F.selectedTimeFrame = r.getSelectedTimeFrame();
                            F.selectedDataGroup = r.getSelectedDataGroup();
                            F.expanded = jQuery(B[P]).hasClass("closed") ? !1 : !0;
                            y.push(F)
                        }
            b(p);
            void 0 !== a && !1 === a || (w.push("^MINE^", g.person_id + ".0", g.encntr_id + ".0", g.provider_id +
                ".0", g.position_cd + ".0", g.ppr_cd + ".0", "^" + g.executable + "^", "^" + CERN_driver_static_content.replace(/\\/g, "\\\\") + "^", "^" + CERN_driver_mean + "^", g.debug_ind), CCLLINK(CERN_driver_script, w.join(","), 1))
        },
        ClearCompPreferences: function(a) {
            var c = MP_Util.GetCompObjById(a);
            c.getStyles().getNameSpace();
            var o = r;
            if (null != o) {
                for (var o = JSON.parse(JSON.stringify(o)), e = o.user_prefs.page_prefs.components, g = e.length; g--;) o && e[g].id === a && (e[g].grouperFilterLabel = "", e[g].grouperFilterCatLabel = "", e[g].grouperFilterCriteria =
                    null, e[g].grouperFilterCatalogCodes = null, e[g].selectedTimeFrame = "", e[g].selectedDataGroup = "");
                c.setLookbackUnits(c.getBrLookbackUnits());
                c.setLookbackUnitTypeFlag(c.getBrLookbackUnitTypeFlag());
                c.setGrouperFilterLabel("");
                c.setGrouperFilterCatLabel("");
                c.setGrouperFilterCriteria(null);
                c.setGrouperFilterCatalogCodes(null);
                c.setSelectedTimeFrame("");
                c.setSelectedDataGroup("");
                c.setPreferencesObj(null);
                r = o;
                b(r);
                if (a = c.getRenderStrategy()) o = a.getComponentId(), e = $("#lookbackContainer" + o), e.length && e.replaceWith(a.createComponentLookback()),
                    o = $("#filterDropDownMenu" + o), o.length && o.replaceWith(a.createComponentFilter());
                $(c.getSectionContentNode()).empty();
                c.startComponentDataRetrieval()
            }
        },
        UpdatePrefsIdentifier: function(a) {
            a && "string" === typeof a && (p = a)
        },
        UpdateAllCompPreferences: function(a, c, o) {
            var e = 0,
                g = null,
                p = 0,
                J = {},
                y = null,
                w = p = null,
                p = "",
                w = !1,
                z = null,
                e = 0,
                e = {},
                E = 0;
            o || (o = !1);
            if (a && a.length) {
                z = r || {
                    user_prefs: {
                        page_prefs: {
                            components: []
                        }
                    }
                };
                z.user_prefs = z.user_prefs || {
                    page_prefs: {
                        components: []
                    }
                };
                z.user_prefs.page_prefs = z.user_prefs.page_prefs || {
                    components: []
                };
                z.user_prefs.page_prefs.components = z.user_prefs.page_prefs.components || [];
                g = z.user_prefs.page_prefs.components;
                for (E = p = g.length; E--;) J[g[E].id] = E;
                for (E = p = a.length; E--;) y = a[E], "undefined" != typeof J[y.getComponentId()] ? (e = J[y.getComponentId()], e = g[e], w = !1) : (e = {}, w = !0), e.id = y.getComponentId(), e.group_seq = y.getPageGroupSequence(), e.col_seq = y.getColumn(), e.row_seq = y.getSequence(), e.preferencesObj = y.getPreferencesObj(), e.toggleStatus = 2 === y.getToggleStatus() ? 1 : y.getToggleStatus(), e.expanded =
                    y.isExpanded(), e.IsInfoButtonEnabled = y.isInfoButtonEnabled(), y.getGrouperFilterLabel() && (e.grouperFilterLabel = y.getGrouperFilterLabel()), y.getGrouperFilterCriteria() && (e.grouperFilterCriteria = y.getGrouperFilterCriteria()), y.getGrouperFilterCatLabel() && (e.grouperFilterCatLabel = y.getGrouperFilterCatLabel()), y.getGrouperFilterCatalogCodes() && (e.grouperFilterCatalogCodes = y.getGrouperFilterCatalogCodes()), y.getSelectedTimeFrame() && (e.selectedTimeFrame = y.getSelectedTimeFrame()), y.getSelectedDataGroup() &&
                    (e.selectedDataGroup = y.getSelectedDataGroup()), w && (g.push(e), J[e.id] = g.length - 1);
                if (c)
                    for (E = p; E--;) y = a[E], p = y.getStyles().getNameSpace(), e = y.getComponentId(), p = $("#" + p + e), p.length && (e = J[y.getComponentId()], e = g[e], w = p.parent(), e.col_seq = w.index() + 1, e.row_seq = p.index(), y.setSequence(e.row_seq));
                r = z;
                b(r, null, o)
            }
        },
        UpdateSingleCompPreferences: function(a, c) {
            MP_Core.AppUserPreferenceManager.UpdateAllCompPreferences([a], !1, c)
        },
        SaveCompPreferences: function(a, c, o, e, g) {
            var p = MP_Util.GetCompObjById(a),
                J = r,
                y = !0;
            if (null != J && !e) {
                var J = JSON.parse(JSON.stringify(J)),
                    w = J.user_prefs.page_prefs.components;
                for (e = w.length; e--;) J && w[e].id === a && (y = !1, c && (w[e].compThemeColor = c), o && (w[e].expanded = "1" == o ? !0 : !1), g && (w[e].IsInfoButtonEnabled = "1" == g ? 1 : 0), p.getGrouperFilterLabel() && (w[e].grouperFilterLabel = p.getGrouperFilterLabel()), p.getGrouperFilterCatLabel() && (w[e].grouperFilterCatLabel = p.getGrouperFilterCatLabel()), p.getGrouperFilterCriteria() && (w[e].grouperFilterCriteria = p.getGrouperFilterCriteria()), w[e].grouperFilterCatalogCodes =
                    p.getGrouperFilterCatalogCodes() || null === p.getGrouperFilterCatalogCodes() ? p.getGrouperFilterCatalogCodes() : [], p.getSelectedTimeFrame() && (w[e].selectedTimeFrame = p.getSelectedTimeFrame()), p.getSelectedDataGroup() && (w[e].selectedDataGroup = p.getSelectedDataGroup()), w[e].toggleStatus = 2 === p.getToggleStatus() ? 1 : p.getToggleStatus(), w[e].col_seq = p.getColumn(), w[e].row_seq = p.getSequence(), w[e].preferencesObj = p.getPreferencesObj());
                y && (g = {}, g.id = a, g.group_seq = p.getPageGroupSequence(), g.col_seq = p.getColumn(),
                    g.row_seq = p.getSequence(), g.preferencesObj = p.getPreferencesObj(), g.compThemeColor = c, p.getGrouperFilterLabel() && (g.grouperFilterLabel = p.getGrouperFilterLabel()), p.getGrouperFilterCriteria() && (g.grouperFilterCriteria = p.getGrouperFilterCriteria()), p.getGrouperFilterCatLabel() && (g.grouperFilterCatLabel = p.getGrouperFilterCatLabel()), p.getGrouperFilterCatalogCodes() && (g.grouperFilterCatalogCodes = p.getGrouperFilterCatalogCodes()), p.getSelectedTimeFrame() && (g.selectedTimeFrame = p.getSelectedTimeFrame()), p.getSelectedDataGroup() &&
                    (g.selectedDataGroup = p.getSelectedDataGroup()), g.toggleStatus = 2 === p.getToggleStatus() ? 1 : p.getToggleStatus(), g.expanded = p.isExpanded(), w.push(g));
                r = J;
                b(r)
            } else {
                var w = Util.Style.g("col-group", document.body, "div"),
                    z = 0,
                    E = 0,
                    p = 0;
                a = {
                    user_prefs: {}
                };
                p = a.user_prefs;
                p.page_prefs = {};
                p = p.page_prefs;
                p.components = [];
                c = p.components;
                e = 0;
                for (o = w.length; e < o; e++)
                    if (p = Util.Style.g("col-outer1", w[e], "div"), 0 < p.length)
                        for (var N = Util.gcs(p[0]), y = 0, U = N.length; y < U; y++)
                            for (var z = y + 1, u = Util.gcs(N[y]), B = 0, P = u.length; B < P; B++) {
                                var D = {},
                                    E = B + 1,
                                    p = jQuery(u[B]).attr("id");
                                if (p = MP_Util.GetCompObjByStyleId(p)) D.id = p.getComponentId(), 99 !== p.getColumn() ? (D.group_seq = 1, D.col_seq = z) : (D.group_seq = 0, D.col_seq = 99), D.row_seq = E, p.getCompColor() && (D.compThemeColor = p.getCompColor()), D.toggleStatus = 2 === p.getToggleStatus() ? 1 : p.getToggleStatus(), p.setColumn(D.col_seq), p.setSequence(D.row_seq), D.preferencesObj = p.getPreferencesObj(), D.grouperFilterLabel = p.getGrouperFilterLabel(), D.grouperFilterCatLabel = p.getGrouperFilterCatLabel(), D.grouperFilterCriteria =
                                    p.getGrouperFilterCriteria(), D.grouperFilterCatalogCodes = p.getGrouperFilterCatalogCodes(), D.selectedTimeFrame = p.getSelectedTimeFrame(), D.selectedDataGroup = p.getSelectedDataGroup(), D.expanded = jQuery(u[B]).hasClass("closed") ? !1 : !0, p.hasInfoButton() && (D.IsInfoButtonEnabled = g ? 1 : 0), c.push(D)
                            }
                if (J) {
                    w = J.user_prefs.page_prefs.components;
                    for (e = w.length; e--;)
                        for (y = c.length; y--;)
                            if (w[e].id === c[y].id) {
                                w[e] = c[y];
                                break
                            }
                    r = J;
                    b(r)
                } else b(a), r = a
            }
        },
        SaveQOCCompPreferences: function(a, c, b, e, g) {
            a = _g(g);
            a = Util.Style.g("col-group",
                a, "div");
            var p = g = e = 0;
            c = MP_Core.AppUserPreferenceManager.GetQOCPreferences();
            var J, y, w;
            b = !1;
            if (c) {
                J = c.user_prefs;
                y = J.page_prefs;
                J = y.views;
                w = y.last_saved_view;
                y = -1;
                for (e = J.length; e--;)
                    if (J[e].label === w) {
                        y = e;
                        break
                    }
            }
            if (w && 0 <= y) {
                J[y].components = [];
                w = 0;
                for (var z = a.length; w < z; w++)
                    if (e = Util.Style.g("col-outer1", a[w], "div"), 0 < e.length)
                        for (var E = Util.gcs(e[0]), N = 0, U = E.length; N < U; N++) {
                            e = N + 1;
                            for (var u = Util.gcs(E[N]), B = 0, P = u.length; B < P; B++) {
                                var D = {};
                                g = B + 1;
                                p = jQuery(u[B]).attr("id");
                                compObj = MP_Util.GetCompObjByStyleId(p);
                                D.id = compObj.getComponentId();
                                D.reportId = compObj.getReportId();
                                D.label = escape(compObj.getLabel());
                                99 !== compObj.getColumn() ? (D.group_seq = 1, D.col_seq = e) : (D.group_seq = 0, D.col_seq = 99);
                                D.row_seq = g;
                                compObj.getCompColor() && (D.compThemeColor = compObj.getCompColor());
                                D.grouperFilterLabel = compObj.getGrouperFilterLabel();
                                D.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
                                D.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
                                D.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
                                D.selectedTimeFrame =
                                    compObj.getSelectedTimeFrame();
                                D.selectedDataGroup = compObj.getSelectedDataGroup();
                                D.expanded = jQuery(u[B]).hasClass("closed") ? !1 : !0;
                                compObj.getPreferencesObj() && (D.preferencesObj = compObj.getPreferencesObj(), b = !0);
                                J[y].components.push(D)
                            }
                        }
            }
            MP_Core.AppUserPreferenceManager.SaveQOCPreferences(c, b);
            r = c
        },
        SaveViewpointPreferences: function(a, c) {
            var b = c.VIEWS,
                e = CERN_BrowserDevInd ? new XMLHttpRequest : new XMLCclRequest;
            e.onreadystatechange = function() {
                if (4 == this.readyState && 200 == this.status) {
                    MP_Util.LogScriptCallInfo(null,
                        this, "mp_core.js", "WriteViewpointPreferences");
                    var a = JSON.parse(this.responseText).RECORD_DATA;
                    if ("Z" == a.STATUS_DATA.STATUS) r = null;
                    else if ("S" == a.STATUS_DATA.STATUS) r = b;
                    else {
                        MP_Util.LogScriptCallError(null, this, "mp_core.js", "WriteViewpointPreferences");
                        var c = [],
                            a = a.STATUS_DATA;
                        c.push("STATUS: " + a.STATUS);
                        for (var e = 0, g = a.SUBEVENTSTATUS.length; e < g; e++) {
                            var t = a.SUBEVENTSTATUS[e];
                            c.push(t.OPERATIONNAME, t.OPERATIONSTATUS, t.TARGETOBJECTNAME, t.TARGETOBJECTVALUE)
                        }
                        window.status = "Error saving viewpoint user preferences: " +
                            c.join(",")
                    }
                }
                4 == this.readyState && MP_Util.ReleaseRequestReference(this)
            };
            var t = null != b ? JSON.stringify(b) : "",
                t = ["^mine^", g.provider_id + ".0", "^" + a + "^", "~" + t + "~"];
            CERN_BrowserDevInd ? (t = "MP_MAINTAIN_USER_PREFS?parameters\x3d" + t.join(","), e.open("GET", t, !1), e.send(null)) : (e.open("GET", "MP_MAINTAIN_USER_PREFS", !1), e.send(t.join(",")))
        },
        SaveQOCPreferences: function(a, c) {
            p = "MP_COMMON_ORDERS_V4";
            g.category_mean = "MP_COMMON_ORDERS_V4";
            b(a, null, c)
        },
        GetQOCPreferences: function() {
            if (!g) return alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage."),
                null;
            r && (r.user_prefs.page_prefs.views ? g.category_mean = "MP_COMMON_ORDERS_V4" : r = null);
            r || (p = "MP_COMMON_ORDERS_V4", g.category_mean = "MP_COMMON_ORDERS_V4", this.LoadPreferences());
            return r
        },
        ClearPreferences: function() {
            b(null);
            var a = ["^MINE^", g.person_id + ".0", g.encntr_id + ".0", g.provider_id + ".0", g.position_cd + ".0", g.ppr_cd + ".0", "^" + g.executable + "^", "^" + CERN_driver_static_content.replace(/\\/g, "\\\\") + "^", "^" + CERN_driver_mean + "^", g.debug_ind];
            "undefined" == typeof CCLLINK ? window.location.href = window.location.href :
                CCLLINK(CERN_driver_script, a.join(","), 1)
        },
        RemoveFolder: function(a, c) {
            $("#" + a).remove();
            MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, !0, c)
        },
        GetComponentById: function(a) {
            if (r) {
                var c = r.user_prefs.page_prefs.components;
                if (!c) return null;
                for (var b = c.length; b--;) {
                    var e = c[b];
                    if (e.id == a) return e
                }
            }
            return null
        }
    }
}();
var MP_Util = function() {
    function b(a, c, b, e) {
        var g = i18n.discernabu,
            p = 0,
            r = "";
        c = !c ? new Date : c;
        b = !b ? 0 : b;
        var y = r = 0,
            w = 0,
            z = p = 0,
            E = 0,
            p = c.getTime() - a.getTime(),
            N = E = null;
        0 == b ? (E = function(a) {
            return Math.ceil(a)
        }, N = function(a, c) {
            return a <= c
        }) : (E = function(a) {
            return Math.floor(a)
        }, N = function(a, c) {
            return a < c
        });
        var r = E(p / 6E4),
            y = E(p / 36E5),
            w = E(p / 864E5),
            p = E(p / 6048E5),
            U = z = b = 0,
            u = 0,
            B = c.getDate();
        c.getMonth() > a.getMonth() ? (u = c.getMonth() - a.getMonth(), c.getDate() < a.getDate() && (z = 1)) : c.getMonth() < a.getMonth() ? (u = 12 - a.getMonth() +
            c.getMonth(), b = 1, c.getDate() < a.getDate() && (z = 1)) : c.getDate() < a.getDate() && (b = 1, u = 11);
        c.getDate() >= a.getDate() && (B = c.getDate() - a.getDate());
        U = c.getFullYear() - a.getFullYear() - b;
        z = u + (12 * U + B / 32 - z);
        z = E(z);
        E = E(z / 12);
        return r = N(y, 2) ? e ? g.WITHIN_MINS.replace("{0}", r) : g.X_MINUTES.replace("{0}", r) : N(w, 2) ? e ? g.WITHIN_HOURS.replace("{0}", y) : g.X_HOURS.replace("{0}", y) : N(p, 2) ? e ? g.WITHIN_DAYS.replace("{0}", w) : g.X_DAYS.replace("{0}", w) : N(z, 2) ? e ? g.WITHIN_WEEKS.replace("{0}", p) : g.X_WEEKS.replace("{0}", p) : N(E, 2) ? e ? g.WITHIN_MONTHS.replace("{0}",
            z) : g.X_MONTHS.replace("{0}", z) : e ? g.WITHIN_YEARS.replace("{0}", E) : g.X_YEARS.replace("{0}", E)
    }
    var g = null,
        p = null,
        r = [];
    return {
        addComponentsToGlobalStorage: function(a) {
            if (a && a.length) {
                null === CERN_MPageComponents && (CERN_MPageComponents = []);
                for (var c = 0, b = a.length; c < b; c++) a[c] && CERN_MPageComponents.push(a[c])
            }
        },
        GetComponentArray: function(a) {
            var c = [],
                b = [],
                e = [],
                g = -1,
                p = -1;
            if (null != a) {
                a.sort(SortMPageComponents);
                for (var r = 0, y = a.length; r < y; r++) {
                    var w = a[r];
                    if (w.isDisplayable()) {
                        var z = w.getPageGroupSequence(),
                            E =
                            w.getColumn();
                        z != p && (g = -1, b = [], c.push(b), p = z);
                        E != g && (e = [], b.push(e), g = E);
                        e.push(w)
                    }
                }
            }
            return c
        },
        GetCriterion: function(a, c) {
            MP_Util.LogDebug("Criterion: " + JSON.stringify(a));
            var b = a.CRITERION,
                e = new MP_Core.Criterion(b, c),
                g = MP_Util.LoadCodeListJSON(b.CODES),
                b = b.PERSON_INFO,
                p = new MP_Core.PatientInformation;
            new MP_Core.PeriopCases;
            p.setName(b.PERSON_NAME);
            p.setSex(MP_Util.GetValueFromArray(b.SEX_CD, g));
            "" != b.DOB && (g = new Date, g.setISO8601(b.DOB), p.setDOB(g));
            e.setPatientInfo(p);
            return e
        },
        CalcLookbackDate: function(a) {
            var c =
                new Date,
                b = c.getHours();
            c.setHours(b - 24 * a);
            return c
        },
        CalcWithinTime: function(a) {
            return b(a, null, null, !0)
        },
        CalcAge: function(a, c) {
            c = c ? c : new Date;
            return b(a, c, 1, !1)
        },
        DisplayDateByOption: function(a, c) {
            var b = MP_Util.GetDateFormatter();
            switch (a.getDateFormat()) {
                case 1:
                    return b.format(c, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
                case 2:
                    return b.format(c, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
                case 3:
                    return MP_Util.CalcWithinTime(c);
                case 4:
                    return "\x26nbsp";
                default:
                    return b.format(c, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR)
            }
        },
        DisplaySelectedTab: function(a, c) {
            var b = 0;
            window.name = "a-tab0" == window.name ? "" : a + "," + c;
            for (var e = document.body, g = Util.Style.g("div-tab-item", e), b = g.length; b--;) g[b].style.display = g[b].id == a ? "block" : "none";
            e = Util.Style.g("anchor-tab-item", e);
            for (b = e.length; b--;) e[b].className = e[b].id == c ? "anchor-tab-item active" : "anchor-tab-item inactive";
            b = _g("custView");
            null != b && (b.href = "", b.innerHTML = "");
            for (b = CERN_TabManagers.length; b--;)
                if (e = CERN_TabManagers[b], g = e.getTabItem(), g.key == a) {
                    if (e.loadTab(), e.setSelectedTab(!0),
                        e = g.components, null != e && 0 < e.length)
                        for (g = e.length; g--;) {
                            MP_Util.Doc.AddCustomizeLink(e[g].getCriterion());
                            break
                        }
                } else e.setSelectedTab(!1)
        },
        DisplaySelectedTabQOC: function(a, c, b) {
            var e = 0;
            b && (e = _g("viewListSelectorID"), "Blank_Space" == e.options[e.options.length - 1].value && e.remove(e.options.length - 1), e = _g("noSavedViews"), Util.Style.ccss(e, "hidden") || Util.Style.acss(e, "hidden"));
            window.name = "a-tab0" == window.name ? "" : a + "," + c;
            b = document.body;
            for (var g = Util.Style.g("div-tab-item", b), e = g.length; e--;) g[e].id ==
                a ? (g[e].style.display = "block", Util.Style.ccss(g[e], "div-tab-item-not-selected") && (Util.Style.rcss(g[e], "div-tab-item-not-selected"), Util.Style.acss(g[e], "div-tab-item-selected"))) : (g[e].style.display = "none", Util.Style.ccss(g[e], "div-tab-item-selected") && (Util.Style.rcss(g[e], "div-tab-item-selected"), Util.Style.acss(g[e], "div-tab-item-not-selected")));
            b = Util.Style.g("anchor-tab-item", b);
            for (e = b.length; e--;) b[e].className = b[e].id == c ? "anchor-tab-item active" : "anchor-tab-item inactive";
            if (c = _g("custView")) c.href =
                "", c.innerHTML = "";
            for (c = CERN_TabManagers.length; c--;)
                if (e = CERN_TabManagers[c], b = e.getTabItem(), b.key == a) {
                    var p = MP_Core.AppUserPreferenceManager.GetQOCPreferences(),
                        r = null,
                        y = null,
                        g = r = null;
                    p ? (r = p.user_prefs, y = r.page_prefs, r = y.views) : (p = {}, r = p.user_prefs = {}, y = r.page_prefs = {}, r = y.views = []);
                    y.last_saved_view = b.name;
                    var w = r.length,
                        y = {};
                    y.label = b.name;
                    y.components = [];
                    if (0 === w) g = y, r.push(y);
                    else {
                        for (var z = !1; w--;)
                            if (r[w].label === y.label) {
                                z = !0;
                                g = r[w];
                                break
                            }
                        z || (g = y, r.push(y))
                    }
                    MP_Core.AppUserPreferenceManager.SaveQOCPreferences(p, !0);
                    var E, p = b.components;
                    if (null != p && 0 < p.length)
                        for (r = p.length; r--;) {
                            E = p[r].getCriterion();
                            MP_Util.Doc.AddCustomizeLink(E);
                            break
                        }
                    MP_Util.Doc.UpdateQOCComponentsWithUserPrefs(b.components, g.components, E);
                    e.isTabLoaded() || (g = new CommonOrdersMPage, g.renderComponents(b.components, $("#" + b.key)), g.setCategoryMean(b.key), g.setCriterion(E), g.loadPageMenu(), MP_Util.Doc.CreateQOCCompMenus(b.components, !1, b.key), MP_Util.Doc.SetupExpandCollapse("MP_COMMON_ORDERS_V4"));
                    e.loadTab();
                    e.setSelectedTab(!0);
                    var N = b.key;
                    $("#pageMenuMP_COMMON_ORDERS_V4").unbind("click").click(function() {
                        MP_MenuManager.showMenu("pageMenu" + N)
                    })
                } else e.setSelectedTab(!1)
        },
        OpenTab: function(a) {
            for (var c = 0, b = CERN_MPageComponents.length; c < b; c++) {
                var e = CERN_MPageComponents[c];
                e.getStyles().getId() == a && e.openTab()
            }
        },
        OpenIView: function(a) {
            MP_Util.GetCompObjByStyleId(a).openIView()
        },
        LaunchMenuSelection: function(a, c) {
            for (var b = 0, e = CERN_MPageComponents.length; b < e; b++) {
                var g = CERN_MPageComponents[b];
                g.getCriterion();
                if (g.getStyles().getId() == a) {
                    g.openDropDown(c);
                    break
                }
            }
        },
        LaunchIViewMenuSelection: function(a, c, b, e) {
            a = parseInt(a, 10);
            a = MP_Util.GetCompObjById(a).getCriterion();
            window.external.DiscernObjectFactory("TASKDOC").LaunchIView(c, b, e, a.person_id, a.encntr_id)
        },
        LaunchMenu: function(a, c) {
            var b = _g(a);
            MP_Util.closeMenuInit(b, c);
            null != b && (Util.Style.ccss(b, "menu-hide") ? (_g(c).style.zIndex = 2, Util.Style.rcss(b, "menu-hide")) : (_g(c).style.zIndex = 1, Util.Style.acss(b, "menu-hide")))
        },
        LaunchLookBackSelection: function(a, c, b) {
            var e = i18n.discernabu;
            a = parseInt(a, 10);
            a = MP_Util.GetCompObjById(a);
            var g = a.getStyles().getNameSpace(),
                p = a.getScope(),
                r = "";
            b = parseInt(b, 10);
            if (a.getLookbackUnits() !== c || a.getLookbackUnitTypeFlag() !== b) {
                a.setLookbackUnits(c);
                a.setLookbackUnitTypeFlag(b);
                if (0 < p)
                    if (0 < c && 0 < b) {
                        var y = "";
                        switch (b) {
                            case 1:
                                y = e.LAST_N_HOURS.replace("{0}", c);
                                break;
                            case 2:
                                y = e.LAST_N_DAYS.replace("{0}", c);
                                break;
                            case 3:
                                y = e.LAST_N_WEEKS.replace("{0}", c);
                                break;
                            case 4:
                                y = e.LAST_N_MONTHS.replace("{0}", c);
                                break;
                            case 5:
                                y = e.LAST_N_YEARS.replace("{0}", c);
                                break;
                            default:
                                y = e.LAST_N_DAYS.replace("{0}", c)
                        }
                        switch (p) {
                            case 1:
                                r =
                                    e.ALL_N_VISITS.replace("{0}", y);
                                break;
                            case 2:
                                r = e.SELECTED_N_VISIT.replace("{0}", y)
                        }
                    } else switch (p) {
                        case 1:
                            r = e.All_VISITS;
                            break;
                        case 2:
                            r = e.SELECTED_VISIT
                    }
                MP_Util.Doc.CreateLookBackMenu(a, 2, r);
                if ("lab" === g || "dg" === g || "ohx" === g || "ohx2" === g) a.getSectionContentNode().innerHTML = "";
                a.startComponentDataRetrieval()
            }
        },
        LaunchCompFilterSelection: function(a, c, b) {
            var e = MP_Util.GetCompObjById(a),
                g = i18n.discernabu,
                p = e.getStyles(),
                r = p.getNameSpace(),
                y;
            y = -1 === c ? g.FACILITY_DEFINED_VIEW : "ohx" === r || "ohx2" === r ? e.getGrouperCatLabel(c).toString() :
                e.getGrouperLabel(c).toString();
            var w = g.FACILITY_DEFINED_VIEW,
                p = p.getId(),
                z = e.getCriterion().static_content,
                E = p + "TypeMenu",
                N = 0;
            if ("ohx" === r || "ohx2" === r) var U = e.getGrouperCatalogCodes(c);
            else var u = e.getGrouperCriteria(c);
            "ohx" === r || "ohx2" === r ? e.setGrouperFilterCatLabel(y) : e.setGrouperFilterLabel(y);
            y !== w ? "ohx" === r || "ohx2" === r ? e.setGrouperFilterCatalogCodes(U) : e.setGrouperFilterCriteria(u) : (e.setGrouperFilterCriteria(null), e.setGrouperFilterCatalogCodes(null));
            (N = _g("cf" + a + "msg")) && Util.de(N);
            y !==
                w ? (N = Util.ce("span"), w = ["\x3cspan id\x3d'cf", a, "msg' class\x3d'filter-applied-msg' title\x3d'", y, "'\x3e", g.FILTER_APPLIED, "\x3c/span\x3e"]) : (N = Util.ce("span"), w = ["\x3cspan id\x3d'cf", a, "msg' class\x3d'filter-applied-msg' title\x3d''\x3e\x3c/span\x3e"]);
            N.innerHTML = w.join("");
            w = _g("lbMnuDisplay" + a);
            Util.ia(N, w);
            w = _g("Accordion" + a + "ContentDiv");
            w.innerHTML = "";
            c = [];
            c.push("\x3cdiv id\x3d'cf", E, "' class\x3d'acc-mnu'\x3e");
            c.push("\x3cspan id\x3d'cflabel", a, "' onclick\x3d'MP_Util.LaunchMenu(\"", E, '", "',
                p, "\");'\x3e", g.FILTER_LABEL, y, "\x3ca id\x3d'compFilterDrop", a, "'\x3e\x3cimg src\x3d'", z, "/images/3943_16.gif'\x3e\x3c/a\x3e\x3c/span\x3e");
            c.push("\x3cdiv class\x3d'cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id\x3d'", E, "'\x3e\x3cdiv class\x3d'acc-mnu-contentbox'\x3e");
            c.push("\x3cdiv\x3e\x3cspan id\x3d'cf", p, "' class\x3d'cf-mnu' onclick\x3d'MP_Util.LaunchCompFilterSelection(", a, ",-1,1);'\x3e", g.FACILITY_DEFINED_VIEW, "\x3c/span\x3e\x3c/div\x3e");
            z = e.m_grouper_arr.length;
            for (N = 0; N < z; N++) e.getGrouperLabel(N) &&
                (E = N, c.push("\x3cdiv\x3e\x3cspan id\x3d'cf", p, N, "' class\x3d'cf-mnu' onclick\x3d'MP_Util.LaunchCompFilterSelection(", a, ",", E, ",1);'\x3e", e.getGrouperLabel(N).toString(), "\x3c/span\x3e\x3c/div\x3e")), e.getGrouperCatLabel(N) && (E = N, c.push("\x3cdiv\x3e\x3cspan id\x3d'cf", p, N, "' class\x3d'cf-mnu' onclick\x3d'MP_Util.LaunchCompFilterSelection(", a, ",", E, ",1);'\x3e", e.getGrouperCatLabel(N).toString(), "\x3c/span\x3e\x3c/div\x3e"));
            c.push("\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e");
            w.innerHTML = c.join("");
            1 === b &&
                (y === g.FACILITY_DEFINED_VIEW ? e.startComponentDataRetrieval() : "ohx" === r || "ohx2" === r ? e.FilterRefresh(y, U) : e.FilterRefresh(y, u))
        },
        closeMenuInit: function(a, c) {
            var b, e = function(c) {
                c || (c = window.event);
                c.relatedTarget.id == a.id && Util.Style.acss(a, "menu-hide");
                c.stopPropagation();
                Util.cancelBubble(c)
            };
            if (a.id == c + "Menu" || a.id == c + "Mnu" || a.id == c + "TypeMenu") b = c;
            if (!g) var g = window.event;
            window.attachEvent ? Util.addEvent(a, "mouseleave", function() {
                Util.Style.acss(a, "menu-hide");
                _g(b).style.zIndex = 1
            }) : Util.addEvent(a,
                "mouseout", e)
        },
        CreateTitleText: function(a, c, b) {
            var e = [];
            a.isLineNumberIncluded() && e.push("(", c, ")");
            b && "" !== b && e.push(" ", b);
            return e.join("")
        },
        GetContentClass: function(a, c) {
            if (a.isScrollingEnabled()) {
                var b = a.getScrollNumber();
                if (c > b && 0 < b) return "content-body scrollable"
            }
            return "content-body"
        },
        CreateTimer: function(a, c, b, e, g) {
            try {
                var p = window.external.DiscernObjectFactory("SLATIMER");
                MP_Util.LogTimerInfo(a, c, "SLATIMER", "mp_core.js", "CreateTimer")
            } catch (r) {
                return null
            }
            return p ? (p.TimerName = a, c && (p.SubtimerName =
                c), b && (p.Metadata1 = String(b)), e && (p.Metadata2 = String(e)), g && (p.Metadata3 = String(g)), p.Start(), p) : null
        },
        GetCodeSet: function(a, c) {
            var b = [],
                e = CERN_BrowserDevInd ? new XMLHttpRequest : new XMLCclRequest;
            e.onreadystatechange = function() {
                if (4 == this.readyState && 200 == this.status) {
                    MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "GetCodeSet");
                    var a = JSON.parse(this.responseText);
                    "S" == a.RECORD_DATA.STATUS_DATA.STATUS && (b = MP_Util.LoadCodeListJSON(a.RECORD_DATA.CODES));
                    return b
                }
                4 == this.readyState && MP_Util.ReleaseRequestReference(this)
            };
            var g = "^MINE^, " + a + ".0";
            CERN_BrowserDevInd ? (e.open("GET", "MP_GET_CODESET?parameters\x3d" + g, c), e.send(null)) : (e.open("GET", "MP_GET_CODESET", c), e.send(g));
            return b
        },
        GetCodeByMeaning: function(a, c) {
            for (var b = a.length; b--;) {
                var e = a[b].value;
                if (e.meaning == c) return e
            }
            return null
        },
        GetCodeValueByMeaning: function(a, c) {
            var b = r[c];
            b || (b = r[c] = MP_Util.GetCodeSet(c, !1));
            if (b && 0 < b.length)
                for (var e = b.length; e--;) {
                    var g = b[e].value;
                    if (g.meaning === a) return g
                }
            return null
        },
        GetItemFromMapArray: function(a, c) {
            for (var b = 0; b <
                a.length; b++)
                if (a[b].name == c) return a[b].value
        },
        AddItemToMapArray: function(a, c, b) {
            var e = MP_Util.GetItemFromMapArray(a, c);
            e || (e = [], a.push(new MP_Core.MapObject(c, e)));
            e.push(b)
        },
        LookBackTime: function(a) {
            var c = i18n.discernabu;
            a = a.getLookbackDays();
            return 0 == a ? c.SELECTED_VISIT : 1 == a ? c.LAST_N_HOURS.replace("{0}", 24 * a) : c.LAST_N_DAYS.replace("{0}", a)
        },
        CreateClinNoteLink: function(a, c, b, e, g, p) {
            var r = "";
            0 < b ? (r = [], r.push(a, c, b, '"' + (g && "" < g ? g : "STANDARD") + '"', p), r = "\x3ca onclick\x3d'javascript:MP_Util.LaunchClinNoteViewer(" +
                r.join(",") + "); return false;' href\x3d'#'\x3e" + e + "\x3c/a\x3e") : r = e;
            return r
        },
        LaunchClinNoteViewer: function(a, c, b, e, g) {
            var p = 0;
            a = parseFloat(a);
            parseFloat(c);
            c = parseFloat(g);
            g = window.external.DiscernObjectFactory("PVVIEWERMPAGE");
            MP_Util.LogDiscernInfo(null, "PVVIEWERMPAGE", "mp_core.js", "LaunchClinNoteViewer");
            try {
                switch (e) {
                    case "AP":
                        g.CreateAPViewer();
                        g.AppendAPEvent(b, c);
                        g.LaunchAPViewer();
                        break;
                    case "DOC":
                        g.CreateDocViewer(a);
                        if (MP_Util.IsArray(b))
                            for (p = b.length; p--;) g.AppendDocEvent(b[p]);
                        else g.AppendDocEvent(b);
                        g.LaunchDocViewer();
                        break;
                    case "EVENT":
                        g.CreateEventViewer(a);
                        if (MP_Util.IsArray(b))
                            for (p = b.length; p--;) g.AppendEvent(b[p]);
                        else g.AppendEvent(b);
                        g.LaunchEventViewer();
                        break;
                    case "MICRO":
                        g.CreateMicroViewer(a);
                        if (MP_Util.IsArray(b))
                            for (p = b.length; p--;) g.AppendMicroEvent(b[p]);
                        else g.AppendMicroEvent(b);
                        g.LaunchMicroViewer();
                        break;
                    case "GRP":
                        g.CreateGroupViewer();
                        if (MP_Util.IsArray(b))
                            for (p = b.length; p--;) g.AppendGroupEvent(b[p]);
                        else g.AppendGroupEvent(b);
                        g.LaunchGroupViewer();
                        break;
                    case "PROC":
                        g.CreateProcViewer(a);
                        if (MP_Util.IsArray(b))
                            for (p = b.length; p--;) g.AppendProcEvent(b[p]);
                        else g.AppendProcEvent(b);
                        g.LaunchProcViewer();
                        break;
                    case "HLA":
                        g.CreateAndLaunchHLAViewer(a, b);
                        break;
                    case "NR":
                        g.LaunchRemindersViewer(b);
                        break;
                    case "STANDARD":
                        alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS)
                }
            } catch (r) {
                MP_Util.LogJSError(r, null, "mp_core.js", "LaunchClinNoteViewer"), alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS + "  " + i18n.CONTACT_ADMINISTRATOR)
            }
        },
        IsArray: function(a) {
            return "object" == typeof a && a instanceof Array
        },
        IsString: function(a) {
            return "string" ==
                typeof a
        },
        HandleNoDataResponse: function() {
            var a = i18n.discernabu;
            return "\x3ch3 class\x3d'info-hd'\x3e\x3cspan class\x3d'res-normal'\x3e" + a.NO_RESULTS_FOUND + "\x3c/span\x3e\x3c/h3\x3e\x3cspan class\x3d'res-none'\x3e" + a.NO_RESULTS_FOUND + "\x3c/span\x3e"
        },
        HandleErrorResponse: function(a, c) {
            var b = [],
                e = i18n.discernabu,
                g = a && 0 < a.length ? a + "-" : "";
            b.push("\x3ch3 class\x3d'info-hd'\x3e\x3cspan class\x3d'res-normal'\x3e", e.ERROR_RETREIVING_DATA, "\x3c/span\x3e\x3c/h3\x3e");
            b.push("\x3cdl class\x3d'", g, "info error-message error-text'\x3e\x3cdd\x3e\x3cspan\x3e",
                e.ERROR_RETREIVING_DATA, "\x3c/span\x3e\x3c/dd\x3e\x3c/dl\x3e");
            c && c.length && MP_Util.LogError(i18n.COMPONENTS + ": " + a + "\x3cbr /\x3e" + c);
            return b.join("")
        },
        GetValueFromArray: function(a, c) {
            if (null != c)
                for (var b = 0, e = c.length; b < e; b++)
                    if (c[b].name == a) return c[b].value;
            return null
        },
        GetPrsnlObjByIdAndDate: function(a, c, b) {
            var e, g;
            try {
                if (b && b.length) {
                    for (var p = 0, r = b.length; p < r; p++)
                        if (b[p].name == a)
                            if (e = b[p].value, g || (g = e), "string" == typeof c) {
                                if (/^\/Date\(/.exec(c) && (c = /[0-9]+-[0-9]+-[0-9]+/.exec(c) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(c) +
                                        "Z"), c > e.beg_dt_tm_string && c < e.end_dt_tm_string || c == e.beg_dt_tm_string || c == e.end_dt_tm_string) return e
                            } else throw Error("Invalid date object passed into GetPrsnlObjByIdAndDate.  The date object must be a string.");
                    return g
                }
                return null
            } catch (y) {
                return MP_Util.LogJSError(y, null, "mp_core.js", "GetPrsnlObjByIdAndDate"), null
            }
        },
        GetCompObjById: function(a) {
            for (var c = CERN_MPageComponents, b = c.length; b--;) {
                var e = c[b];
                if (e.m_componentId === a) return e
            }
            return null
        },
        GetCompObjByStyleId: function(a) {
            for (var c = CERN_MPageComponents.length; c--;) {
                var b =
                    CERN_MPageComponents[c];
                if (b.getStyles().getId() === a) return b
            }
            return null
        },
        LoadCodeListJSON: function(a) {
            var c = [];
            if (null != a)
                for (var b = 0; b < a.length; b++) {
                    var e = {};
                    codeElement = a[b];
                    e.codeValue = codeElement.CODE;
                    e.display = codeElement.DISPLAY;
                    e.description = codeElement.DESCRIPTION;
                    e.codeSet = codeElement.CODE_SET;
                    e.sequence = codeElement.SEQUENCE;
                    e.meaning = codeElement.MEANING;
                    e = new MP_Core.MapObject(e.codeValue, e);
                    c.push(e)
                }
            return c
        },
        LoadPersonelListJSON: function(a) {
            var c = [],
                b;
            if (null != a)
                for (var e = 0; e < a.length; e++) {
                    var g = {};
                    b = a[e];
                    g.id = b.ID;
                    b.BEG_EFFECTIVE_DT_TM && (g.beg_dt_tm = b.BEG_EFFECTIVE_DT_TM, g.beg_dt_tm_string = /[0-9]+-[0-9]+-[0-9]+/.exec(b.BEG_EFFECTIVE_DT_TM) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(b.BEG_EFFECTIVE_DT_TM) + "Z");
                    b.END_EFFECTIVE_DT_TM && (g.end_dt_tm = b.END_EFFECTIVE_DT_TM, g.end_dt_tm_string = /[0-9]+-[0-9]+-[0-9]+/.exec(b.END_EFFECTIVE_DT_TM) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(b.END_EFFECTIVE_DT_TM) + "Z");
                    g.fullName = b.PROVIDER_NAME.NAME_FULL;
                    g.firstName = b.PROVIDER_NAME.NAME_FIRST;
                    g.middleName = b.PROVIDER_NAME.NAME_MIDDLE;
                    g.lastName = b.PROVIDER_NAME.NAME_LAST;
                    g.userName = b.PROVIDER_NAME.USERNAME;
                    g.initials = b.PROVIDER_NAME.INITIALS;
                    g.title = b.PROVIDER_NAME.TITLE;
                    b = new MP_Core.MapObject(g.id, g);
                    c[e] = b
                }
            return c
        },
        LoadPhoneListJSON: function(a) {
            var c = [],
                b = null,
                e = 0;
            if (a)
                for (var g = a.length; g--;) {
                    var p = {},
                        b = a[g];
                    p.personId = b.PERSON_ID;
                    e = b.PHONES.length;
                    p.phones = [];
                    for (var r = 0; r < e; r++) {
                        var y = {};
                        y.phoneNum = b.PHONES[r].PHONE_NUM;
                        y.phoneType = b.PHONES[r].PHONE_TYPE;
                        p.phones.push(y)
                    }
                    b = new MP_Core.MapObject(p.personId, p);
                    c[g] = b
                }
            return c
        },
        WriteToFile: function(a) {
            try {
                var c = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile("c:\\temp\\test.txt", 8, !0, 0);
                c.write(a);
                c.close()
            } catch (b) {
                a = "Error:\nNumber:" + b.number, a += "\nDescription:" + b.description, document.write(a)
            }
        },
        CalculateAge: function(a) {
            var c;
            a = new Date(a);
            var b = a.getFullYear(),
                e = a.getMonth(),
                g = a.getDate();
            a = a.getHours();
            today = new Date;
            year = today.getFullYear();
            month = today.getMonth();
            day = today.getDate();
            hours = today.getHours();
            if (year == b && day == g) return c = hours - a, c + " Hours";
            if (year == b && month == e) return c = day - g, c += " Days";
            if (year == b) return c = month - e, c += " Months";
            month < e ? c = year - b - 1 : month > e ? c = year - b : month == e && (day < g ? c = year - b - 1 : day > g ? c = year - b : day == g && (c = year - b));
            return c += " Years"
        },
        pad: function(a, c, b, e) {
            "undefined" == typeof c && (c = 0);
            "undefined" == typeof b && (b = " ");
            "undefined" == typeof e && (e = STR_PAD_RIGHT);
            if (c + 1 >= a.length) switch (e) {
                case STR_PAD_LEFT:
                    a = Array(c + 1 - a.length).join(b) + a;
                    break;
                case STR_PAD_BOTH:
                    c = Math.ceil((padlen = c - a.length) / 2);
                    a = Array(padlen - c + 1).join(b) + a + Array(c +
                        1).join(b);
                    break;
                default:
                    a += Array(c + 1 - a.length).join(b)
            }
            return a
        },
        GraphResults: function(a, c, b) {
            var e = MP_Util.GetCompObjById(c);
            c = null != e.getLookbackUnits() && 0 < e.getLookbackUnits() ? e.getLookbackUnits() : "365";
            var g = null != e.getLookbackUnitTypeFlag() && 0 < e.getLookbackUnitTypeFlag() ? e.getLookbackUnitTypeFlag() : "2",
                p = i18n.discernabu,
                r = e.getScope(),
                y = "",
                w = e.getCriterion();
            e.setLookbackUnits(c);
            e.setLookbackUnitTypeFlag(g);
            if (0 < r) {
                switch (g) {
                    case 1:
                        e = p.LAST_N_HOURS.replace("{0}", c);
                        break;
                    case 2:
                        e = p.LAST_N_DAYS.replace("{0}",
                            c);
                        break;
                    case 3:
                        e = p.LAST_N_WEEKS.replace("{0}", c);
                        break;
                    case 4:
                        e = p.LAST_N_MONTHS.replace("{0}", c);
                        break;
                    case 5:
                        e = p.LAST_N_YEARS.replace("{0}", c);
                        break;
                    default:
                        e = p.LAST_N_DAYS.replace("{0}", c)
                }
                switch (r) {
                    case 1:
                        var y = p.ALL_N_VISITS.replace("{0}", e),
                            z = "0.0";
                        break;
                    case 2:
                        y = p.SELECTED_N_VISIT.replace("{0}", e), z = w.encntr_id
                }
            }
            p = "";
            CERN_BrowserDevInd ? (p = "^MINE^," + w.person_id + ".0," + z + "," + a + ".0,^" + w.static_content + "/discrete-graphing^," + b + ".0," + w.provider_id + ".0," + w.position_cd + ".0," + w.ppr_cd + ".0," + c + "," + g +
                ",200,^" + y + "^,^^,^^,^^,1", MD_reachViewerDialog.LaunchReachGraphViewer(p)) : (p = "^MINE^," + w.person_id + ".0," + z + "," + a + ".0,^" + w.static_content + "\\discrete-graphing^," + b + ".0," + w.provider_id + ".0," + w.position_cd + ".0," + w.ppr_cd + ".0," + c + "," + g + ",200,^" + y + "^", a = "javascript:CCLLINK('mp_retrieve_graph_results', '" + p + "',1)", MP_Util.LogCclNewSessionWindowInfo(null, a, "mp_core.js", "GraphResults"), CCLNEWSESSIONWINDOW(a, "_self", "left\x3d0,top\x3d0,width\x3d1200,height\x3d700,toolbar\x3dno", 0, 1));
            Util.preventDefault()
        },
        ReleaseRequestReference: function(a) {
            if (!CERN_BrowserDevInd && XMLCCLREQUESTOBJECTPOINTER)
                for (var c in XMLCCLREQUESTOBJECTPOINTER) XMLCCLREQUESTOBJECTPOINTER[c] == a && delete XMLCCLREQUESTOBJECTPOINTER[c]
        },
        AlertConfirm: function(a, c, b, e, g, p) {
            var r = "\x3cbutton id\x3d'acTrueButton' data-val\x3d'1'\x3e" + (b ? b : i18n.discernabu.CONFIRM_OK) + "\x3c/button\x3e",
                y = "";
            e && (y = "\x3cbutton id\x3d'acFalseButton' data-val\x3d'0'\x3e" + e + "\x3c/button\x3e");
            c || (c = "\x26nbsp;");
            b = function() {
                var a = parseInt(this.getAttribute("data-val"),
                    10);
                $(".modal-div").remove();
                $(".modal-dialog").remove();
                $("html").css("overflow", "auto");
                a && "function" === typeof p && p()
            };
            var w = Util.cep("div", {
                    className: "modal-div"
                }),
                z = Util.cep("div", {
                    className: "modal-dialog"
                });
            z.innerHTML = "\x3cdiv class\x3d'modal-dialog-hd'\x3e" + c + "\x3c/div\x3e\x3cdiv class\x3d'modal-dialog-content'\x3e" + a + "\x3c/div\x3e\x3cdiv class\x3d'modal-dialog-ft'\x3e\x3cdiv class\x3d'modal-dialog-btns'\x3e" + r + y + "\x3c/div\x3e\x3c/div\x3e";
            a = document.body;
            Util.ac(w, a);
            Util.ac(z, a);
            Util.addEvent(_g("acTrueButton"),
                "click", b);
            e && Util.addEvent(_g("acFalseButton"), "click", b);
            g && e ? _g("acFalseButton").focus() : _g("acTrueButton").focus();
            $("html").css("overflow", "hidden");
            $(w).height($(document).height())
        },
        ActionableAlertConfirm: function(a, c, b, e, g) {
            var p = "";
            b && (p = "\x3cbutton id\x3d'acFalseButton' data-val\x3d'0'\x3e" + b + "\x3c/button\x3e");
            c || (c = "\x26nbsp;");
            var r = function() {
                    parseInt(this.getAttribute("data-val"), 10);
                    $(".modal-div").remove();
                    $(".modal-dialog-actionable").remove();
                    $("html").css("overflow", "auto");
                    g &&
                        "function" === typeof g && g()
                },
                y = Util.cep("div", {
                    className: "modal-div"
                }),
                w = Util.cep("div", {
                    className: "modal-dialog-actionable"
                });
            w.innerHTML = "\x3cdiv class\x3d'modal-dialog-hd'\x3e" + c + "\x3c/div\x3e\x3cdiv class\x3d'modal-dialog-content'\x3e" + a + "\x3c/div\x3e\x3cdiv id\x3d'acActionableContent' class\x3d'modal-dialog-actionable-content'\x3e\x3c/div\x3e\x3cdiv class\x3d'modal-dialog-ft'\x3e\x3cdiv class\x3d'modal-dialog-btns'\x3e" + p + "\x3c/div\x3e\x3c/div\x3e";
            a = document.body;
            Util.ac(y, a);
            Util.ac(w, a);
            b &&
                Util.addEvent(_g("acFalseButton"), "click", r);
            e && b && _g("acFalseButton").focus();
            $("html").css("overflow", "hidden");
            $(y).height($(document).height())
        },
        CreateAutoSuggestBoxHtml: function(a, c) {
            var b = [],
                e = a.getStyles().getNameSpace(),
                g = a.getComponentId();
            b.push("\x3cdiv class\x3d'search-box-div'\x3e\x3cform name\x3d'contentForm' onSubmit\x3d'return false'\x3e\x3cinput type\x3d'text' id\x3d'", c ? e + c + g : e + "ContentCtrl" + g, "'", " class\x3d'search-box'\x3e\x3c/form\x3e\x3c/div\x3e");
            return b.join("")
        },
        AddAutoSuggestControl: function(a,
            c, b, e, g) {
            new AutoSuggestControl(a, c, b, e, g)
        },
        RetrieveAutoSuggestSearchBox: function(a) {
            var c = a.getStyles().getNameSpace();
            a = a.getComponentId();
            return _g(c + "ContentCtrl" + a)
        },
        CreateParamArray: function(a, c) {
            var b = 1 === c ? "0.0" : "0";
            a && 0 < a.length && (b = 1 < a.length ? 1 === c ? "value(" + a.join(".0,") + ".0)" : "value(" + a.join(",") + ")" : 1 === c ? a[0] + ".0" : a[0]);
            return b
        },
        LoadSpinner: function(a) {
            if (a && "string" === typeof a) {
                a = $("#" + a);
                var c = a.height(),
                    b = a.offsetParent().height() - c;
                a.append("\x3cdiv class\x3d'loading-screen' style\x3d'height: " +
                    c + "px; top: " + b + "px; '\x3e\x3cdiv class\x3d'loading-spinner'\x3e\x26nbsp;\x3c/div\x3e\x3c/div\x3e")
            }
        },
        GetDateFormatter: function() {
            g || (g = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE));
            return g
        },
        GetNumericFormatter: function() {
            p || (p = new mp_formatter.NumericFormatter(MPAGE_LOCALE));
            return p
        },
        PrintReport: function(a, c, b) {
            var e = [],
                g = new MP_Core.ScriptRequest,
                p = new CustomResponseHandler,
                r = new MP_Core.ScriptReply,
                y = null,
                w = "";
            e.push("^MINE^", "^" + a + "^", c, b, 1);
            g.setProgramName("pwx_rpt_driver_to_mpage");
            g.setParameters(e);
            g.setAsync(!0);
            r.setName(g.getName());
            y = MP_ModalDialog.retrieveModalDialogObject("printdlg");
            y || (y = new ModalDialog("printdlg"), y.setHeaderTitle("\x26nbsp;"), MP_ModalDialog.updateModalDialogObject(y));
            a = y.getFooterButton("printbutton");
            a || (a = new ModalButton("printbutton"), a.setText(i18n.PRINT).setCloseOnClick(!1), y.addFooterButton(a));
            c = y.getFooterButton("cancelbutton");
            c || (c = new ModalButton("cancelbutton"), c.setText(i18n.discernabu.CONFIRM_CANCEL).setCloseOnClick(!0), y.addFooterButton(c));
            a.setOnClickFunction(function() {
                try {
                    var a =
                        document.createElement("iframe");
                    a.setAttribute("display", "none");
                    document.body.appendChild(a);
                    var c = a.contentWindow,
                        b = c ? c.document : null;
                    b && (b.write(w), b.close(), c.focus(), c.print())
                } catch (e) {
                    throw $(a).length && $(a).remove(), MP_Util.LogJSError(e, null, "mp_core.js", "PrintReport"), e;
                } finally {
                    $(a).length && $(a).remove()
                }
            });
            y.setBodyDataFunction(function(a) {
                a.setBodyHTML(w);
                $("#" + a.getHeaderElementId()).addClass("print-dialog-header")
            });
            p.setSuccessHandler(function(a) {
                $("body").css("cursor", "default");
                w = a.responseText || i18n.NO_DATA_FOUND;
                MP_ModalDialog.showModalDialog(y.getId())
            });
            p.setErrorHandler(function(a) {
                var c = null;
                $("body").css("cursor", "default");
                w = i18n.NO_DATA_FOUND;
                c = MP_Util.generateModalDialogBody("printfaildlg", "error", i18n.discernabu.DISCERN_ERROR, a.statusText);
                c.setHeaderTitle(i18n.ERROR_OCCURED);
                a = c.getFooterButton("prntfailokbtn");
                a || (a = new ModalButton("prntfailokbtn"), a.setText(i18n.discernabu.CONFIRM_OK).setCloseOnClick(!0), a.setFocusInd(!0), c.addFooterButton(a));
                c.setHeaderCloseFunction(function() {
                    MP_ModalDialog.showModalDialog(y.getId())
                });
                a.setOnClickFunction(function() {
                    MP_ModalDialog.showModalDialog(y.getId())
                });
                MP_ModalDialog.updateModalDialogObject(c);
                MP_ModalDialog.showModalDialog(c.getId())
            });
            g.setResponseHandler(p);
            MP_RequestManager.performRequest(g);
            $("body").css("cursor", "wait")
        },
        CalculatePrecision: function(a) {
            var c = 0;
            a = MP_Util.IsString(a) ? a : a.toString();
            var b = a.search(/\.(\d)/); - 1 !== b && (c = a.length - b - 1);
            return c
        },
        CreateDateParameter: function(a) {
            var c = a.getDate(),
                b = "",
                e = a.format("yyyy HH:MM:ss");
            switch (a.getMonth()) {
                case 0:
                    b =
                        "JAN";
                    break;
                case 1:
                    b = "FEB";
                    break;
                case 2:
                    b = "MAR";
                    break;
                case 3:
                    b = "APR";
                    break;
                case 4:
                    b = "MAY";
                    break;
                case 5:
                    b = "JUN";
                    break;
                case 6:
                    b = "JUL";
                    break;
                case 7:
                    b = "AUG";
                    break;
                case 8:
                    b = "SEP";
                    break;
                case 9:
                    b = "OCT";
                    break;
                case 10:
                    b = "NOV";
                    break;
                case 11:
                    b = "DEC";
                    break;
                default:
                    alert("unknown month")
            }
            return c + "-" + b + "-" + e
        },
        LogDebug: function(a) {
            logger.logDebug(a)
        },
        LogWarn: function(a) {
            logger.logWarning(a)
        },
        LogInfo: function(a) {
            logger.logMessage(a)
        },
        LogError: function(a) {
            logger.logError(a)
        },
        LogScriptCallInfo: function(a, c, b, e) {
            logger.logScriptCallInfo(a,
                c, b, e)
        },
        LogScriptCallError: function(a, c, b, e) {
            logger.logScriptCallError(a, c, b, e)
        },
        LogJSError: function(a, c, b, e) {
            logger.logJSError(a, c, b, e)
        },
        LogDiscernInfo: function(a, c, b, e) {
            logger.logDiscernInfo(a, c, b, e)
        },
        LogMpagesEventInfo: function(a, c, b, e, g) {
            logger.logMPagesEventInfo(a, c, b, e, g)
        },
        LogCclNewSessionWindowInfo: function(a, c, b, e) {
            logger.logCCLNewSessionWindowInfo(a, c, b, e)
        },
        LogTimerInfo: function(a, c, b, e, g) {
            logger.logTimerInfo(a, c, b, e, g)
        },
        AddCookieProperty: function(a, c, b) {
            var e = CK_DATA[a];
            e || (e = {});
            e[c] = b;
            CK_DATA[a] = e
        },
        GetCookieProperty: function(a, c) {
            var b = CK_DATA[a];
            return b && b[c] ? b[c] : null
        },
        WriteCookie: function() {
            var a = JSON.stringify(CK_DATA);
            document.cookie = "CookieJar\x3d" + a + ";"
        },
        RetrieveCookie: function() {
            var a = document.cookie.match(/CookieJar=({[^;]+})(;|\b|$)/);
            a && a[1] && (CK_DATA = JSON.parse(a[1]))
        },
        generateModalDialogBody: function(a, c, b, e) {
            var g = null,
                p = "";
            (g = MP_ModalDialog.retrieveModalDialogObject(a)) || (g = new ModalDialog(a));
            g.setLeftMarginPercentage(35).setRightMarginPercentage(35).setTopMarginPercentage(20).setIsBodySizeFixed(!1).setIsBodySizeFixed(!1).setIsFooterAlwaysShown(!0);
            p = MP_Core.generateUserMessageHTML(c, b, e);
            g.isActive() ? g.setBodyHTML(p) : g.setBodyDataFunction(function(a) {
                a.setBodyHTML(p)
            });
            return g
        },
        setObjectDefinitionMapping: function(a, c) {
            if ("string" !== typeof a) return !1;
            a = a.toUpperCase();
            return "undefined" !== typeof CERN_ObjectDefinitionMapping[a] ? (MP_Util.LogInfo("Object mapping already exists for " + a + "\nPlease select a different id or use the MP_Util.updateObjectDefinitionMApping function"), !1) : "function" === typeof c ? (CERN_ObjectDefinitionMapping[a] = c, !0) : !1
        },
        getObjectDefinitionMapping: function(a) {
            if ("string" !== typeof a) return null;
            a = a.toUpperCase();
            return "undefined" === typeof CERN_ObjectDefinitionMapping[a] ? null : CERN_ObjectDefinitionMapping[a]
        },
        updateObjectDefinitionMapping: function(a, c) {
            if ("string" !== typeof a) return null;
            a = a.toUpperCase();
            return "undefined" === typeof CERN_ObjectDefinitionMapping[a] ? (MP_Util.LogInfo("Object mapping does not exists for " + a), !1) : "function" === typeof c ? (CERN_ObjectDefinitionMapping[a] = c, !0) : !1
        },
        removeObjectDefinitionMapping: function(a) {
            if ("string" !==
                typeof a) return null;
            a = a.toUpperCase();
            return "undefined" === typeof CERN_ObjectDefinitionMapping[a] ? (MP_Util.LogInfo("Object mapping does not exists for " + a), !1) : delete CERN_ObjectDefinitionMapping[a]
        }
    }
}();
MP_Util.Doc = function() {
    function b(a, c, b, e) {
        c = ["\x3cdiv\x3e"];
        b = 0;
        var g = [],
            o = [],
            p = [],
            r = {},
            t = null,
            v = null,
            f = i18n.discernabu.noe_o1;
        r.personalFavArr = [];
        r.favSecHtml = null;
        i = 0;
        for (fl = a.length; i < fl; i++)
            if (t = a[i], 0 === i) {
                noeItemArr = t.CHILD_LIST;
                j = 0;
                for (k = noeItemArr.length; j < k; j++) noeItem = noeItemArr[j], noeRow = [], noeType = noeItem.LIST_TYPE, 1 === noeType && (v = {}, b++, v.Id = noeItem.CHILD_ALT_SEL_CAT_ID.toString(), v.folderName = noeItem.SYNONYM, p.push(v), noeRow.push("\x3ch3 class\x3d'info-hd'\x3e", f.ORDER_FAVORITE, "\x3c/h3\x3e\x3cdl class\x3d'noe-info page-menu-add-favorite-folder-dl' data-folder-id\x3d",
                    noeItem.CHILD_ALT_SEL_CAT_ID, "\x3e\x3cbutton type\x3d'button' class\x3d'noe-fav-order-button' onmouseout\x3d'CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover\x3d'CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)'\x3e", i18n.SELECT, "\x3c/button\x3e\x3cspan class\x3d'noe-fav-folder-icon'\x3e\x26nbsp;\x3c/span\x3e\x3cdt\x3e", f.ORDER_NAME, ":\x3c/dt\x3e\x3cdd class\x3d'noe-name page-menu-add-favorite-folder'\x3e", noeItem.SYNONYM, "\x3c/dd\x3e\x3cdt\x3e", f.ORDER_DISPLAY_LINE, ":\x3c/dt\x3e\x3cdd class\x3d'noe-disp'\x3e",
                    noeItem.SENTENCE, "\x3c/dd\x3e\x3cdt\x3e", f.ORDER_PARAMETERS, ":\x3c/dt\x3e\x3cdd class\x3d'det-hd'\x3e", noeItem.SYN_ID, "|", e, "|", noeItem.SENT_ID, "\x3c/dd\x3e\x3cdt\x3e", f.ORDER_SET, ":\x3c/dt\x3e\x3cdd class\x3d'det-hd'\x3e", noeItem.ORDERABLE_TYPE_FLAG, "\x3c/dd\x3e\x3c/dl\x3e"), g = g.concat(noeRow))
            } else v = {}, b++, folderName = "FAVORITES" === t.LONG_DESCRIPTION_KEY_CAP && (2 === t.SOURCE_COMPONENT_FLAG || 3 === t.SOURCE_COMPONENT_FLAG) ? f.FOLDER_FAV_AMBULATORY.replace("{0}", i) : t.SHORT_DESCRIPTION, o.push("\x3ch3 class\x3d'info-hd'\x3e",
                f.ORDER_FAVORITE, "\x3c/h3\x3e\x3cdl class\x3d'noe-info page-menu-add-favorite-folder-dl' data-folder-id\x3d", t.ALT_SEL_CATEGORY_ID, "\x3e\x3cbutton type\x3d'button' class\x3d'noe-fav-order-button' onmouseout\x3d'CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover\x3d'CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)'\x3e", i18n.SELECT, "\x3c/button\x3e\x3cspan class\x3d'noe-fav-folder-icon'\x3e\x26nbsp;\x3c/span\x3e\x3cdt\x3e", f.ORDER_NAME, ":\x3c/dt\x3e\x3cdd class\x3d'noe-name page-menu-add-favorite-folder'\x3e",
                folderName, "\x3c/dd\x3e\x3cdt\x3e", f.ORDER_DISPLAY_LINE, ":\x3c/dt\x3e\x3cdd class\x3d'noe-disp'\x3e\x3c/dd\x3e\x3cdt\x3e", f.ORDER_PARAMETERS, ":\x3c/dt\x3e\x3cdd class\x3d'det-hd'\x3e0|", e, "|0\x3c/dd\x3e\x3cdt\x3e", f.ORDER_SET, ":\x3c/dt\x3e\x3cdd class\x3d'det-hd'\x3e", t.ORDERABLE_TYPE_FLAG, "\x3c/dd\x3e\x3c/dl\x3e"), v.Id = t.ALT_SEL_CATEGORY_ID.toString(), v.folderName = folderName, p.push(v);
        b ? c = c.concat(g, o) : c.push("\x3cspan class\x3d'res-none'\x3e", a ? f.NO_FAVORITES_FOUND : i18n.ERROR_RETREIVING_DATA, "\x3c/span\x3e");
        c.push("\x3c/div\x3e");
        r.personalFavArr = p;
        r.favSecHtml = c.join("");
        return r
    }

    function g(b, e, g, o, p) {
        var r = i18n.discernabu,
            t = _g("optMenuConfig" + b);
        if (!t) {
            var t = Util.cep("div", {
                    className: "opts-menu-config-content menu-hide",
                    id: "optMenuConfig" + b
                }),
                v = [];
            v.push("\x3cdiv title \x3d '", r.COLOR_STANDARD, "' class\x3d'opts-menu-config-item opt-config-mnu-lightgrey' data-color\x3d'lightgrey' id\x3d'optConfigMnuLightGrey", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", r.COLOR_BROWN, "' class\x3d'opts-menu-config-item opt-config-mnu-brown' data-color\x3d'brown' id\x3d'optConfigMnuBrown",
                b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", r.COLOR_CERNER_BLUE, "' class\x3d'opts-menu-config-item opt-config-mnu-cernerblue' data-color\x3d'cernerblue' id\x3d'optConfigMnuCernerBlue", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", r.COLOR_DARK_GREEN, "' class\x3d'opts-menu-config-item opt-config-mnu-darkgreen' data-color\x3d'darkgreen' id\x3d'optConfigMnuDarkGreen", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", r.COLOR_GREEN, "' class\x3d'opts-menu-config-item opt-config-mnu-green' data-color\x3d'green' id\x3d'optConfigMnuGreen",
                b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", r.COLOR_GREY, "' class\x3d'opts-menu-config-item opt-config-mnu-grey' data-color\x3d'grey' id\x3d'optConfigMnuGrey", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", r.COLOR_LIGHT_BLUE, "' class\x3d'opts-menu-config-item opt-config-mnu-lightblue' data-color\x3d'lightblue' id\x3d'optConfigMnuLightBlue", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", r.COLOR_NAVY, "' class\x3d'opts-menu-config-item opt-config-mnu-navy' data-color\x3d'navy' id\x3d'optConfigMnuNavy",
                b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", r.COLOR_ORANGE, "' class\x3d'opts-menu-config-item opt-config-mnu-orange' data-color\x3d'orange' id\x3d'optConfigMnuOrange", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", r.COLOR_PINK, "' class\x3d'opts-menu-config-item opt-config-mnu-pink' data-color\x3d'pink' id\x3d'optConfigMnuPink", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", r.COLOR_PURPLE, "' class\x3d'opts-menu-config-item opt-config-mnu-purple' data-color\x3d'purple' id\x3d'optConfigMnuPurple", b, "'\x3e\x3c/div\x3e",
                "\x3cdiv title \x3d '", r.COLOR_YELLOW, "' class\x3d'opts-menu-config-item opt-config-mnu-yellow' data-color\x3d'yellow' id\x3d'optConfigMnuYellow", b, "'\x3e\x3c/div\x3e");
            t.innerHTML = v.join("");
            Util.ac(t, document.body);
            Util.addEvent(_g("optMenuConfig" + b), "click", function(a) {
                a = (a.target || a.srcElement).getAttribute("data-color");
                var c = _g(g);
                c && (0 <= "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow".indexOf(a) && (c.className = c.className.replace(/brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/,
                    "")), Util.Style.acss(c, a), MP_Util.GetCompObjById(b).setCompColor(a), setTimeout(function() {
                    MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, !0, p)
                }, 0))
            });
            a(t, b, !0)
        }
        c(t, e, o)
    }

    function p(a, c, b) {
        var e = MP_Util.GetCompObjById(a);
        a = e.isExpanded();
        e.setExpandCollapseState(!a);
        c = _gbt("span", c)[0];
        a ? c && Util.Style.rcss(c, "opts-menu-def-exp") : c && Util.Style.acss(c, "opts-menu-def-exp");
        setTimeout(function() {
            MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, !0, b)
        }, 0)
    }

    function r(a,
        c, b) {
        $(a).mouseleave(function(a) {
            a || (a = window.event);
            var e = function() {
                    var a = _g(c);
                    Util.Style.ccss(a, "page-menu-open") && Util.Style.rcss(a, "page-menu-open")
                },
                g = a.relatedTarget || a.toElement,
                o = _g("moreOptMenu" + c);
            if (b) var u = a.target || a.srcElement;
            g ? Util.Style.ccss(g, "opts-menu-layout-content") || (o && (Util.Style.acss(o, "menu-hide"), e()), b && Util.Style.ccss(u, "opts-menu-layout-content") && !Util.Style.ccss(g, "opts-menu-content") && _g("moreOptMenu" + c) && Util.Style.acss(_g("moreOptMenu" + c), "menu-hide"), _g("optMenuConfig" +
                c) && Util.Style.acss(_g("optMenuConfig" + c), "menu-hide")) : o && (Util.Style.acss(o, "menu-hide"), e());
            Util.cancelBubble(a)
        })
    }

    function a(a, c, b) {
        $(a).mouseleave(function(e) {
            e || (e = window.event);
            var g = e.relatedTarget || e.toElement,
                o = _g("moreOptMenu" + c);
            if (b) var p = e.target || e.srcElement;
            g ? Util.Style.ccss(g, "opts-menu-config-content") || (N = window.setTimeout(function() {
                o && (Util.Style.ccss(g, "opts-menu-content") || Util.Style.acss(o, "menu-hide"));
                b && (Util.Style.acss(a, "menu-hide"), Util.Style.ccss(p, "opts-menu-content") &&
                    !Util.Style.ccss(g, "opts-menu-content") && _g("moreOptMenu" + c) && Util.Style.acss(_g("moreOptMenu" + c), "menu-hide"));
                _g("optMenuConfig" + c) && Util.Style.acss(_g("optMenuConfig" + c), "menu-hide")
            }, U)) : o && Util.Style.acss(o, "menu-hide");
            Util.cancelBubble(e)
        });
        $(a).mouseenter(function() {
            window.clearTimeout(N)
        })
    }

    function c(a, c, b) {
        if (Util.Style.ccss(a, "menu-hide"))
            if (Util.preventDefault(), Util.Style.rcss(a, "menu-hide"), b) {
                c = Util.goff(b);
                Util.gns(b);
                b = b.offsetWidth;
                var e = c[0] - a.offsetWidth;
                a.style.left = 0 < e ? e - 2 + "px" :
                    c[0] + b + 6 + "px";
                a.style.top = c[1] - 5 + "px"
            } else b = $("#mainCompMenu" + c), b.length ? (a.style.left = $(b).offset().left - 125 + "px", a.style.top = $(b).offset().top + 18 + "px") : (gvs(), b = _g(c), c = Util.goff(b), a.style.left = c[0] + b.offsetWidth - a.offsetWidth + "px", a.style.top = c[1] + 30 + "px");
        else Util.Style.acss(a, "menu-hide")
    }

    function o(a, c, b) {
        var e = MP_Util.GetComponentArray(a);
        MP_Util.addComponentsToGlobalStorage(a);
        a = [];
        for (var g = 0, o = e.length; g < o; g++) {
            colAr = e[g];
            a.push("\x3cdiv\x3e");
            var p = colAr.length;
            switch (p) {
                case 1:
                    a.push("\x3cdiv class\x3d'col-group one-col'\x3e");
                    break;
                case 2:
                    a.push("\x3cdiv class\x3d'col-group two-col'\x3e");
                    break;
                case 3:
                    a.push("\x3cdiv class\x3d'col-group three-col'\x3e");
                    break;
                case 4:
                    a.push("\x3cdiv class\x3d'col-group four-col'\x3e");
                    break;
                default:
                    a.push("\x3cdiv class\x3d'col-group five-col'\x3e")
            }
            a.push("\x3cdiv class\x3d'col-outer2'\x3e\x3cdiv class\x3d'col-outer1'\x3e");
            for (var r = 0; r < p; r++) {
                var t = colAr[r];
                a.push("\x3cdiv class\x3d'", "col" + (r + 1), "'\x3e");
                for (var y = 0, f = t.length; y < f; y++) a.push(v(t[y], b));
                a.push("\x3c/div\x3e")
            }
            a.push("\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e")
        }
        c.innerHTML +=
            a.join("")
    }

    function e() {
        for (var a = i18n.discernabu, c = Util.Style.g("sec-hd-tgl"), b = 0; b < c.length; b++) {
            Util.addEvent(c[b], "click", MP_Util.Doc.ExpandCollapse);
            var e = Util.gp(Util.gp(c[b]));
            Util.Style.ccss(e, "closed") && (c[b].innerHTML = "+", c[b].title = a.SHOW_SECTION)
        }
    }

    function t(a) {
        for (var c = a.length, b = !1, e = 0; e < c; e++) {
            for (var b = !1, g = 0; 10 > g; g++)
                if (a[e].getGrouperLabel(g) || a[e].getGrouperCatLabel(g)) {
                    b = !0;
                    break
                }
            a[e].setCompFilters(b);
            a[e].hasCompFilters() && a[e].isDisplayable() && a[e].renderAccordion(a[e])
        }
    }

    function v(a,
        c) {
        var b = i18n.discernabu,
            e = [],
            g = a.getStyles(),
            o = g.getNameSpace(),
            p = g.getId(),
            r = a.getComponentId(),
            t = g.getClassName(),
            v = a.getLink(),
            f = a.getCriterion().static_content,
            y = !a.isAlwaysExpanded() ? ["\x3cspan class\x3d'", g.getHeaderToggle(), "' title\x3d'", b.HIDE_SECTION, "'\x3e-\x3c/span\x3e"].join("") : "",
            w = "",
            z = "",
            G = "",
            E = "",
            J = "";
        !a.isExpanded() && !a.isAlwaysExpanded() && (t += " closed");
        c ? a.getHasActionsMenu() && (w = ["\x3cspan class\x3d'opts-menu menu-hide' id\x3d'mainCompMenu", p, "'\x3e\x26nbsp;\x3c/span\x3e"].join("")) :
            w = ["\x3cspan class\x3d'opts-menu menu-hide' id\x3d'mainCompMenu", p, "'\x3e\x26nbsp;\x3c/span\x3e"].join("");
        "" != v && !1 == a.getCustomizeView() ? (z = i18n.discernabu, G = a.getStyles(), E = a.getCriterion(), E = 'javascript:APPLINK(0,"' + E.executable + '","/PERSONID\x3d' + E.person_id + " /ENCNTRID\x3d" + E.encntr_id + " /FIRSTTAB\x3d^" + a.getLink() + '^"); return false;', z = "\x3ca id\x3d" + G.getLink() + " title\x3d'" + z.GO_TO_TAB.replace("{0}", a.getLink()) + "' href\x3d'#' onclick\x3d'" + E + "'\x3e" + a.getLabel() + "\x3c/a\x3e") : z = a.getLabel();
        e.push("\x3cdiv id\x3d'", g.getId(), "' class\x3d'", t, "'\x3e", "\x3ch2 class\x3d'", g.getHeaderClass(), "'\x3e", y, w, "\x3cspan class\x3d'", g.getTitle(), "'\x3e\x3cspan\x3e", z, "\x3c/span\x3e");
        if (!1 == a.getCustomizeView()) {
            if (e.push("\x3cspan class\x3d'", g.getTotal(), "'\x3e", b.LOADING_DATA + "...", "\x3c/span\x3e\x3c/span\x3e"), a.isPlusAddEnabled())
                if (!1 === a.isIViewAdd() ? e.push("\x3ca id\x3d'", o, "Add' class\x3d'add-plus' onclick\x3d'MP_Util.OpenIView(\"", p, "\"); return false;' href\x3d'#'\x3e\x3cspan class\x3d'add-icon'\x3e\x26nbsp;\x3c/span\x3e\x3cspan class\x3d'add-text'\x3e",
                        b.ADD, "\x3c/span\x3e\x3c/a\x3e") : e.push("\x3ca id\x3d'", o, "Add' class\x3d'add-plus' onclick\x3d'MP_Util.OpenTab(\"", p, "\"); return false;' href\x3d'#'\x3e\x3cspan class\x3d'add-icon'\x3e\x26nbsp;\x3c/span\x3e\x3cspan class\x3d'add-text'\x3e", b.ADD, "\x3c/span\x3e\x3c/a\x3e"), z = a.getMenuItems(), b = a.getIViewMenuItems(), null != z || 0 < z) {
                    G = p + "Menu";
                    e.push("\x3ca id\x3d'", o, "Drop' class\x3d'drop-Down'\x3e\x3cimg src\x3d'", f, "/images/3943_16.gif' onclick\x3d'javascript:MP_Util.LaunchMenu(\"", G, '", "', p, "\");'\x3e\x3c/a\x3e");
                    e.push("\x3cdiv class\x3d'form-menu menu-hide' id\x3d'", G, "'\x3e\x3cspan\x3e");
                    o = 0;
                    for (f = z.length; o < f; o++) t = z[o], e.push("\x3cdiv\x3e"), e.push("\x3ca id\x3d'lnkID", o, "' href\x3d'#' onclick\x3d'javascript:MP_Util.LaunchMenuSelection(\"", p, '",', t.getId(), ");'\x3e", t.getDescription(), "\x3c/a\x3e"), e.push("\x3c/div\x3e");
                    if (b) {
                        e.push("\x3chr class\x3d'opts-iview-sec-divider'\x3e\x3c/\x3e");
                        o = 0;
                        for (f = b.length; o < f; o++)
                            if (t = b[o], p = t.getValTypeFlag(), 1 === p) {
                                z = t.getDescription();
                                E = z.toLowerCase();
                                z = z.replace(/'/g,
                                    "");
                                J = G = "";
                                p = 0;
                                for (y = b.length; p < y; p++) w = b[p], w.getValSequence() === t.getValSequence() && (2 === w.getValTypeFlag() ? G = w.getDescription() : 3 === w.getValTypeFlag() && (J = w.getDescription()));
                                e.push("\x3cdiv\x3e\x3ca id\x3d'lnkID", o, "' href\x3d'#' onclick\x3d'MP_Util.LaunchIViewMenuSelection(\"", r, '","', E, '","', G, '","', J, "\");  return false;'\x3e", z, "\x3c/a\x3e\x3c/div\x3e")
                            }
                    }
                    e.push("\x3c/span\x3e\x3c/div\x3e")
                } else if (b) {
                G = p + "Menu";
                e.push("\x3ca id\x3d'", o, "Drop' class\x3d'drop-Down'\x3e\x3cimg src\x3d'", f, "/images/3943_16.gif' onclick\x3d'javascript:MP_Util.LaunchMenu(\"",
                    G, '", "', p, "\");'\x3e\x3c/a\x3e");
                e.push("\x3cdiv class\x3d'form-menu menu-hide' id\x3d'", G, "'\x3e\x3cspan\x3e");
                o = 0;
                for (f = b.length; o < f; o++)
                    if (t = b[o], p = t.getValTypeFlag(), 1 === p) {
                        z = t.getDescription();
                        E = z.toLowerCase();
                        z = z.replace(/'/g, "");
                        J = G = "";
                        p = 0;
                        for (y = b.length; p < y; p++) w = b[p], w.getValSequence() === t.getValSequence() && (2 === w.getValTypeFlag() ? G = w.getDescription() : 3 === w.getValTypeFlag() && (J = w.getDescription()));
                        e.push("\x3cdiv\x3e\x3ca id\x3d'lnkID", o, "' href\x3d'#' onclick\x3d'MP_Util.LaunchIViewMenuSelection(\"",
                            r, '","', E, '","', G, '","', J, "\");  return false;'\x3e", z, "\x3c/a\x3e\x3c/div\x3e")
                    }
                e.push("\x3c/span\x3e\x3c/div\x3e")
            }
        } else e.push("\x3c/span\x3e");
        e.push("\x3c/h2\x3e");
        !1 == a.getCustomizeView() && (r = a.getScope(), 3 === r ? e.push(a.getScopeHTML()) : 0 < r && (a.getLookbackMenuItems() ? a.setLookBackDropDown(!0) : a.setLookBackDropDown(!1), 0 === a.m_grouper_arr.length ? a.setCompFilters(!1) : a.setCompFilters(!0), e.push(MP_Util.Doc.CreateLookBackMenu(a, 1, ""))));
        e.push("\x3cdiv id\x3d'", g.getContentId(), "' class\x3d'", g.getContentClass(),
            "'\x3e\x3c/div\x3e");
        (g = a.getFooterText()) && "" !== g && e.push("\x3cdiv class\x3dsec-footer\x3e", g, "\x3c/div\x3e");
        e.push("\x3c/div\x3e");
        return e.join("")
    }

    function J(a) {
        var c = i18n.discernabu,
            b = "",
            e = a.getScope(),
            g = a.getLookbackDays(),
            o = 0 < g ? g : a.getLookbackUnits();
        a = 0 < g ? 2 : a.getLookbackUnitTypeFlag();
        if (0 < e)
            if (0 < a && 0 < o) {
                g = "";
                switch (a) {
                    case 1:
                        g = c.LAST_N_HOURS.replace("{0}", o);
                        break;
                    case 2:
                        g = c.LAST_N_DAYS.replace("{0}", o);
                        break;
                    case 3:
                        g = c.LAST_N_WEEKS.replace("{0}", o);
                        break;
                    case 4:
                        g = c.LAST_N_MONTHS.replace("{0}",
                            o);
                        break;
                    case 5:
                        g = c.LAST_N_YEARS.replace("{0}", o)
                }
                switch (e) {
                    case 1:
                        b = c.ALL_N_VISITS.replace("{0}", g);
                        break;
                    case 2:
                        b = c.SELECTED_N_VISIT.replace("{0}", g)
                }
            } else switch (e) {
                case 1:
                    b = c.All_VISITS;
                    break;
                case 2:
                    b = c.SELECTED_VISIT
            }
        return b
    }

    function y(a, c, b) {
        var e = [],
            g = "",
            g = a.name;
        e.push("\x3cli\x3e");
        b = "a-tab" + b;
        c ? e.push("\x3ca id\x3d'", b, "' class\x3d'anchor-tab-item active' href\x3d'#' onclick\x3d'javascript:MP_Util.DisplaySelectedTab(\"", a.key, '","', b, "\");return false;'\x3e", g, "\x3c/a\x3e") : e.push("\x3ca id\x3d'",
            b, "' class\x3d'anchor-tab-item inactive' href\x3d'#' onclick\x3d'javascript:MP_Util.DisplaySelectedTab(\"", a.key, '","', b, "\");return false;'\x3e", g, "\x3c/a\x3e");
        e.push("\x3c/li\x3e");
        return e.join("")
    }
    var w = !1,
        z = "",
        E = [],
        N = null,
        U = 250;
    return {
        SetupExpandCollapse: function(a) {
            var c = i18n.discernabu,
                b = null,
                b = null;
            a ? (b = _g(a), b = Util.Style.g("sec-hd-tgl", b, "span")) : b = Util.Style.g("sec-hd-tgl");
            for (a = 0; a < b.length; a++) {
                Util.addEvent(b[a], "click", MP_Util.Doc.ExpandCollapse);
                var e = Util.gp(Util.gp(b[a]));
                Util.Style.ccss(e,
                    "closed") && (b[a].innerHTML = "+", b[a].title = c.SHOW_SECTION)
            }
        },
        SetupCompFilters: function(a) {
            for (var c = null, b = a.length, e = !1, g = 0; g < b; g++) {
                for (var c = a[g], e = !1, o = 0; 10 > o; o++)
                    if (c.getGrouperLabel(o) || c.getGrouperCatLabel(o)) {
                        e = !0;
                        break
                    }
                c.setCompFilters(e);
                c.hasCompFilters() && c.isDisplayable() && c.renderAccordion(c)
            }
        },
        InitMPageTabLayout: function(a, c, b, e) {
            for (var g = [], o = "", p = "", r = "", t = !1, v = null, f = !0, y = null, w = 0, z = a.length; w < z; w++) {
                var o = a[w].name,
                    G = a[w].value,
                    v = G.getCriterion();
                g.push(new MP_Core.TabItem(o, G.getName(),
                    G.getComponents(), v.category_mean));
                o = v.static_content;
                p = G.getHelpFileName();
                r = G.getHelpFileURL();
                f = G.getCustomizeEnabled();
                y = G.getTitleAnchors();
                G.isBannerEnabled() && (t = G.isBannerEnabled())
            }
            1 === b ? MP_Util.Doc.InitSelectorLayout(g, c, o, p, r, t, 0, e, f, y) : MP_Util.Doc.InitTabLayout(g, c, o, p, r, t, 0, v, f, y)
        },
        InitTabLayout: function(a, c, b, g, p, r, v, w, K, z) {
            b = document.body;
            var f = i18n.discernabu;
            MP_Util.Doc.AddPageTitle(c, b, v, K, z, g, p, w);
            r && (b.innerHTML += "\x3cdiv id\x3d'banner' class\x3d'demo-banner'\x3e\x3c/div\x3e");
            b.innerHTML += "\x3cdiv id\x3d'disclaimer' class\x3d'disclaimer'\x3e\x3cspan\x3e" + f.DISCLAIMER + "\x3c/span\x3e\x3c/div\x3e";
            c = b;
            g = [];
            p = [];
            null == c && (c = document.body);
            g.push("\x3cul class\x3dtabmenu\x3e");
            r = 0;
            for (v = a.length; r < v; r++) K = a[r], g.push(y(K, 0 == r ? 1 : 0, r)), p.push("\x3cdiv id\x3d'", K.key, "' class\x3d'div-tab-item'\x3e\x3c/div\x3e");
            g.push("\x3c/ul\x3e");
            c.innerHTML += g.join("") + p.join("");
            CERN_TabManagers = [];
            c = 0;
            for (g = a.length; c < g; c++) p = a[c], r = new MP_Core.TabManager(p), 0 == c && r.setSelectedTab(!0), CERN_TabManagers.push(r),
                o(p.components, _g(a[c].key), !0), t(p.components), MP_Util.Doc.CreateCompMenus(p.components, !0);
            MP_Util.Doc.AddCustomizeLink(w);
            e()
        },
        InitSelectorLayout: function(a, c, b, e, g, o, p, r, t, v, f, y) {
            var w = {},
                w = f ? f : document.body,
                z = i18n.discernabu,
                z = MP_Core.AppUserPreferenceManager.GetQOCPreferences(),
                G, E;
            z ? (G = z.user_prefs, E = G.page_prefs, E = E.views, b = (b = z.user_prefs.page_prefs.last_saved_view) ? b : "", E || (E = G.page_prefs = {}, E = E.views = [], z.user_prefs.page_prefs.last_saved_view = b, G = {}, G.label = b, G.components = [], E.push(G),
                MP_Core.AppUserPreferenceManager.SaveQOCPreferences(z, !0))) : b = "";
            f ? (z = i18n.discernabu, e = [], c = "", f.innerHTML = "", e.push("\x3cdiv class\x3d'pg-hd'\x3e"), e.push("\x3ch1\x3e\x3cspan class\x3d'pg-title'\x3e", c, "\x3c/span\x3e\x3c/h1\x3e\x3cspan id\x3d'pageCtrl", r.category_mean, "' class\x3d'page-ctrl'\x3e"), c = MP_Util.GetDateFormatter(), e.push("\x3cspan class\x3d'other-anchors'\x3e", z.AS_OF_TIME.replace("{0}", c.format(new Date, mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS)), "\x3c/span\x3e"), e.push("\x3c/span\x3e\x3c/div\x3e"),
                f.innerHTML += e.join("")) : MP_Util.Doc.AddPageTitle(c, w, p, t, v, e, g, r, null);
            w.innerHTML = o ? w.innerHTML + ("\x3cdiv id\x3d'banner" + y.getCategoryMean() + "' class\x3d'demo-banner'\x3e\x26nbsp;\x3c/div\x3e") : w.innerHTML + "\x3cdiv class\x3d'demo-banner'\x3e\x26nbsp;\x3c/div\x3e";
            o = w;
            g = b;
            p = i18n.discernabu;
            f = [];
            c = [];
            w = "-1";
            e = _g("pageCtrl" + r.category_mean);
            t = "undefined" == typeof m_viewpointJSON ? !1 : !0;
            v = "qoc-view-selector";
            if (g) {
                z = !1;
                for (G = a.length; G--;)
                    if (a[G].name == g) {
                        window.name = a[G].key + ",'a-tab'" + G;
                        w = a[G].key;
                        z = !0;
                        break
                    }
                if (z) {
                    t || (v += " no-viewpoint");
                    f.push("\x3cspan class\x3d'", v, "'\x3e\x3cspan class\x3d'qoc-view-list-label'\x3e", p.VIEW_SELECTOR, ":\x3c/span\x3e\x3cselect id\x3d'viewListSelectorID' class\x3d'qoc-view-list' onchange\x3dMP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,false)\x3e");
                    p = 0;
                    for (t = a.length; p < t; p++) v = a[p], g = v.key == w ? 1 : 0, f.push("\x3coption value\x3d'", v.key, "'", 1 == g ? " selected\x3d'selected'" : "", "\x3e", v.name, "\x3c/option\x3e"), c.push("\x3cdiv id\x3d'",
                        v.key, "' class\x3d'div-tab-item", 1 == g ? " div-tab-item-selected" : " div-tab-item-not-selected", "'\x3e\x3c/div\x3e");
                    f.push("\x3c/select\x3e\x3c/span\x3e");
                    e.innerHTML = f.join("") + e.innerHTML;
                    o.innerHTML += c.join("")
                } else {
                    t || (v += " no-viewpoint");
                    f.push("\x3cspan id\x3d'noSavedViews' class\x3d'qoc-no-saved-view'\x3e", p.VIEW_NOT_SELECTED, "\x3c/span\x3e");
                    f.push("\x3cspan class\x3d'", v, "'\x3e\x3cspan class\x3d'qoc-view-list-label'\x3e", p.VIEW_SELECTOR, ":\x3c/span\x3e\x3cselect id\x3d'viewListSelectorID' class\x3d'qoc-view-list' onchange\x3dMP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,true)\x3e");
                    p = 0;
                    for (t = a.length; p < t; p++) v = a[p], f.push("\x3coption value\x3d'", v.key, "'\x3e", v.name, "\x3c/option\x3e"), c.push("\x3cdiv id\x3d'", v.key, "' class\x3d'div-tab-item div-tab-item-not-selected'\x3e\x3c/div\x3e");
                    f.push("\x3coption value\x3d'Blank_Space' selected\x3d'selected'\x3e\x3c/option\x3e");
                    c.push("\x3cdiv id\x3d'Blank_Space' class\x3d'div-tab-item div-tab-item-selected'\x3e\x3c/div\x3e");
                    f.push("\x3c/select\x3e\x3c/span\x3e");
                    e.innerHTML = f.join("") + e.innerHTML;
                    o.innerHTML += c.join("");
                    window.name =
                        "QOC_PAGE_TAB_" + a.length + ",'a-tab'" + a.length
                }
            } else {
                t || (v += " no-viewpoint");
                f.push("\x3cspan id\x3d'noSavedViews' class\x3d'qoc-no-saved-view'\x3e", p.VIEW_NOT_SELECTED, "\x3c/span\x3e");
                f.push("\x3cspan class\x3d'", v, "'\x3e\x3cspan class\x3d'qoc-view-list-label'\x3e", p.VIEW_SELECTOR, ":\x3c/span\x3e\x3cselect id\x3d'viewListSelectorID' class\x3d'qoc-view-list' onchange\x3dMP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,true)\x3e");
                p = 0;
                for (t = a.length; p <
                    t; p++) v = a[p], f.push("\x3coption value\x3d'", v.key, "'\x3e", v.name, "\x3c/option\x3e"), c.push("\x3cdiv id\x3d'", v.key, "' class\x3d'div-tab-item div-tab-item-not-selected'\x3e\x3c/div\x3e");
                f.push("\x3coption value\x3d'Blank_Space' selected\x3d'selected'\x3e\x3c/option\x3e");
                c.push("\x3cdiv id\x3d'Blank_Space' class\x3d'div-tab-item div-tab-item-selected'\x3e\x3c/div\x3e");
                f.push("\x3c/select\x3e\x3c/span\x3e");
                e.innerHTML = f.join("") + e.innerHTML;
                o.innerHTML += c.join("");
                window.name = "QOC_PAGE_TAB_" + a.length +
                    ",'a-tab'" + a.length
            }
            CERN_TabManagers = [];
            o = 0;
            for (f = a.length; o < f; o++)
                if (c = a[o], w = new MP_Core.TabManager(c), 0 == o && w.setSelectedTab(!0), CERN_TabManagers.push(w), E) {
                    w = !1;
                    for (e = E.length; e--;)
                        if (g = E[e].label, b === g && g === c.name) {
                            w = !0;
                            if (0 < E[e].components.length) {
                                e = MP_Util.Doc.UpdateQOCComponentsWithUserPrefs(c.components, E[e].components, r);
                                var J = new CommonOrdersMPage;
                                J.renderComponents(e, $("#" + c.key))
                            } else J = new CommonOrdersMPage, J.renderComponents(c.components, $("#" + c.key));
                            break
                        }
                    w && (J.setCategoryMean(c.key),
                        J.setCriterion(r), J.loadPageMenu(), MP_Util.Doc.CreateQOCCompMenus(c.components, !1, c.key))
                }
            MP_Util.Doc.SetupExpandCollapse(y.getCategoryMean())
        },
        InitLayout: function(a, c, b, g) {
            var p = a.getCriterion(),
                r = g ? _g(g) : document.body;
            g || MP_Util.Doc.AddPageTitle(a.getName(), r, p.debug_ind, a.getCustomizeEnabled(), a.getTitleAnchors(), c, b, p, g);
            a.isBannerEnabled() && (r.innerHTML += "\x3cdiv id\x3d'banner" + p.category_mean + "' class\x3d'demo-banner'\x3e\x3c/div\x3e");
            c = a.getComponents();
            o(c, r);
            MP_Util.Doc.AddCustomizeLink(p);
            e();
            t(c);
            MP_Util.Doc.CreateCompMenus(c, !1);
            a.initDragAndDrop(g);
            MP_Util.Doc.CreatePageMenu(g, p.category_mean)
        },
        InitDragAndDrop: function(a) {
            var c = null,
                b = this,
                e = "";
            a && "string" == typeof m_viewpointJSON && (e = "#" + a + " ");
            $(e + " .col-outer1:last .col1," + e + " .col-outer1:last .col2," + e + " .col-outer1:last .col3").sortable({
                connectWith: e + " .col-outer1:last .col1," + e + " .col-outer1:last .col2," + e + " .col-outer1:last .col3 ",
                items: " .section",
                zIndex: 1005,
                appendTo: "body",
                handle: "h2",
                over: function(a, c) {
                    $(this).attr("class") !==
                        c.sender.attr("class") && $(this).css("z-index", "1")
                },
                start: function(a, c) {
                    $(this).css("z-index", "2");
                    c.item.css("z-index", "2");
                    var b = $(this).parent().children(),
                        e = 0;
                    $(b).height("auto");
                    $(b).each(function() {
                        $(this).height() > e && (e = $(this).height())
                    });
                    $(b).height(e + $(c.item).height())
                },
                stop: function(a, c) {
                    c.item.css("z-index", "1");
                    $(this).css("z-index", "1");
                    c.sender && c.sender.css("z-index", "1");
                    CERN_EventListener.fireEvent(null, b, EventListener.EVENT_COMP_CUSTOMIZE, null);
                    var e = $(this).parent().children();
                    $(e).height("auto")
                },
                update: function() {
                    setTimeout(function() {
                        MP_Core.AppUserPreferenceManager.SaveCompPreferences(null, "", null, !0)
                    }, 0)
                }
            });
            c = e ? $(e) : $(document.body);
            $(c).hasClass("dnd-enabled") ? ($(e + " .col-outer1:last .col1," + e + " .col-outer1:last .col2," + e + " .col-outer1:last .col3").sortable("enable"), $(e + " .col-outer1:last .sec-hd").css("cursor", "move")) : ($(e + " .col-outer1:last .col1," + e + " .col-outer1:last .col2," + e + " .col-outer1:last .col3").sortable("disable"), $(e + " .col-outer1:last .sec-hd").css("cursor",
                "auto"))
        },
        CreatePageMenu: function(a, b) {
            var e = "pageMenu" + b,
                g;
            switch ($(("string" == typeof m_viewpointJSON ? "#" + a + " " : "") + ".col-group:last").attr("class").replace("col-group ", "")) {
                case "three-col":
                    g = 3;
                    break;
                case "two-col":
                    g = 2;
                    break;
                case "one-col":
                    g = 1
            }
            var o = g;
            if (_g(e)) {
                var p = _g("moreOptMenu" + e);
                if (!p) {
                    var p = Util.cep("div", {
                            className: "opts-menu-content menu-hide",
                            id: "moreOptMenu" + e
                        }),
                        t = i18n.discernabu;
                    p.innerHTML += '\x3cdiv class\x3d"opts-personalize-sec" id\x3d"optsMenupersonalize' + e + '"\x3e\x3cdiv class\x3d"opts-menu-item opts-sub-menu" id\x3d"optsDefLayout' +
                        e + '"\x3e' + t.VIEW_LAYOUT + '\x3c/div\x3e\x3cdiv class\x3d"opts-menu-item" id\x3d"optsDefClearPrefs' + e + '"\x3e' + t.CLEAR_PREFERENCES + "\x3c/div\x3e\x3c/div\x3e";
                    Util.ac(p, document.body)
                }
                r(p, e, !1);
                e.replace("mainCompMenu", "");
                $("#" + e).click(function() {
                    Util.Style.ccss(this, "page-menu-open") ? Util.Style.rcss(this, "page-menu-open") : Util.Style.acss(this, "page-menu-open");
                    c(p, e)
                });
                Util.addEvent(_g("optsDefLayout" + e), "mouseover", function() {
                    var a = i18n.discernabu,
                        b = _g("optMenuConfig" + e);
                    if (!b) {
                        var b = Util.cep("div", {
                                className: "opts-menu-layout-content menu-hide",
                                id: "optMenuConfig" + e
                            }),
                            g = [],
                            f = ["view-layout1", "view-layout2", "view-layout3"],
                            a = i18n.discernabu;
                        f[o - 1] += " view-layout-selected";
                        g.push("\x3cdiv class\x3d'" + f[0] + "' data-cols\x3d'1'\x3e" + a.COLUMN_ONE + "\x3c/div\x3e\x3cdiv class\x3d'" + f[1] + "' data-cols\x3d'2'\x3e" + a.COLUMN_TWO + "\x3c/div\x3e\x3cdiv class\x3d'" + f[2] + "' data-cols\x3d'3'\x3e" + a.COLUMN_THREE + "\x3c/div\x3e");
                        b.innerHTML = g.join("");
                        Util.ac(b, document.body);
                        Util.addEvent(_g("optMenuConfig" + e), "click",
                            function(a) {
                                var c = a.target || a.srcElement;
                                a = c.getAttribute("data-cols");
                                $("#optMenuConfig" + e + " div").removeClass("view-layout-selected");
                                Util.Style.acss(c, "view-layout-selected");
                                var b;
                                "string" == typeof m_viewpointJSON && (MP_Util.RetrieveCookie(), b = (b = MP_Util.GetCookieProperty("viewpoint", "viewCatMean")) ? b : $(".vwp-cached:first").attr("id"));
                                changeLayout(parseInt(a, 10), b)
                            });
                        r(b, e, !0)
                    }
                    c(b, e, this)
                });
                Util.addEvent(_g("optsDefLayout" + e), "mouseout", function(a) {
                    a || (a = window.event);
                    (a = a.relatedTarget || a.toElement) ?
                    Util.Style.ccss(a, "opts-menu-content") || _g("optMenuConfig" + e) && Util.Style.acss(_g("optMenuConfig" + e), "menu-hide"): _g("optMenuConfig" + e) && Util.Style.acss(_g("optMenuConfig" + e), "menu-hide")
                });
                Util.addEvent(_g("optsDefClearPrefs" + e), "click", function() {
                    MP_Util.AlertConfirm(t.CLEAR_ALL_PREFS + "\x3cbr /\x3e" + t.CLEAR_ALL_PREFS_CANCEL, t.CLEAR_PREFERENCES, t.CONFIRM_CLEAR, t.CONFIRM_CANCEL, !0, MP_Core.AppUserPreferenceManager.ClearPreferences)
                })
            }
        },
        SetQOCPersonalFavArray: function(a) {
            E = a
        },
        GetQOCPersonalFavArray: function() {
            return E
        },
        GetFavFolders: function(a, c, b, e, g, o, p) {
            var r = null,
                t = CERN_BrowserDevInd ? new XMLHttpRequest : new XMLCclRequest;
            t.onreadystatechange = function() {
                if (4 == this.readyState && 200 == this.status) {
                    MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "GetNOEFavFolders");
                    var a = JSON.parse(this.responseText).RECORD_DATA;
                    if ("Z" == a.STATUS_DATA.STATUS) r = a;
                    else if ("S" == a.STATUS_DATA.STATUS) r = a;
                    else {
                        MP_Util.LogScriptCallError(null, this, "mp_core.js", "GetNOEFavFolders");
                        var c = [],
                            a = a.STATUS_DATA;
                        c.push("STATUS: " + a.STATUS);
                        for (var b =
                                0, e = a.SUBEVENTSTATUS.length; b < e; b++) {
                            var g = a.SUBEVENTSTATUS[b];
                            c.push(g.OPERATIONNAME, g.OPERATIONSTATUS, g.TARGETOBJECTNAME, g.TARGETOBJECTVALUE)
                        }
                        window.status = "Error getting user favorite folder structure: " + c.join(",")
                    }
                }
                4 == this.readyState && MP_Util.ReleaseRequestReference(this)
            };
            a = ["^MINE^", c + ".0", b + ".0", e + ".0", a + ".0", "^FAVORITES^", g + ".0", o + ".0", "11", p];
            CERN_BrowserDevInd ? (a = "mp_get_powerorder_favs_json?parameters\x3d" + a.join(","), t.open("GET", a, !1), t.send(null)) : (t.open("GET", "mp_get_powerorder_favs_json", !1), t.send(a.join(",")));
            return r
        },
        RenderFavFolder: function(a, c) {
            if ("F" != a.STATUS_DATA.STATUS) var e = a.USER_FAV,
                g = a.VENUE_TYPE_LIST;
            var o = i18n.discernabu.noe_o1,
                p = "",
                r = 0,
                t = "",
                v, y, f, w = ["\x3cdiv id\x3d'qocAddPersonalFavFolderModal'\x3e"];
            if (g) {
                v = 0;
                for (y = g.length; v < y; v++) f = g[v], 2 === f.SOURCE_COMPONENT_LIST[0].VALUE ? t = f.DISPLAY : (p = f.DISPLAY, r = 1);
                g = [];
                g.push("\x3cdiv id\x3d'pgMnuFavFolderVenueBtns'\x3e\x3cdiv\x3e\x3cinput name\x3d'page-menu-venue-select' class\x3d'page-menu-add-fav-venue' venue-val\x3d'1' type\x3d'radio' checked\x3d'checked'/\x3e\x3cspan\x3e",
                    p, "\x3c/span\x3e\x3c/div\x3e\x3cdiv\x3e\x3cinput name\x3d'page-menu-venue-select' class\x3d'page-menu-add-fav-venue' venue-val\x3d'2' type\x3d'radio'  /\x3e\x3cspan\x3e", t, "\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e");
                w = w.concat(g)
            }
            p = [];
            p = p = null;
            e ? (p = e.length, 0 === p ? w.push("\x3cspan class\x3d'res-none'\x3e", o.NO_FAVORITES_FOUND, "\x3c/span\x3e") : (w.push("\x3cdiv id\x3d'pgMnuFavFolderPath", "pageMenuAddFavorite1234", "' class\x3d'noe-fav-path hdr'\x3e\x3cdl id\x3d'pgMnuFolderPath", "pageMenuAddFavorite1234",
                "' class\x3d'noe-folder-info'\x3e\x3cdt\x3e0\x3c/dt\x3e\x3cdd class\x3d'noe-fav-folder'\x3e\x3cspan id\x3d'pgMnuFolderPathRoot", "pageMenuAddFavorite1234", "'\x3e", e[0].SHORT_DESCRIPTION, "\x3c/span\x3e\x3c/dd\x3e\x3c/dl\x3e\x3c/div\x3e", "\x3cdiv id\x3d'pgMnuFavFolderContents", "pageMenuAddFavorite1234", "' class\x3d'page-menu-add-favorite-contents'\x3e"), p = b(e, c, "pageMenuAddFavorite1234", r), w.push(p.favSecHtml), p = p.personalFavArr, MP_Util.Doc.SetQOCPersonalFavArray(p))) : e || (e = [], e.push("\x3cspan class\x3d'res-none'\x3e",
                i18n.ERROR_RETREIVING_DATA, "\x3c/span\x3e"), w = w.concat(e));
            w.push("\x3c/div\x3e");
            w = w.join("");
            if (e = _g("acActionableContent")) e.innerHTML = w;
            $("#qocAddPersonalFavFolderModal").on("click", "div", function(a, c, b) {
                return function(f) {
                    var e = null,
                        g = $(f.target).attr("class"),
                        o = $(f.target).parent().attr("class");
                    g ? e = g.split(" ")[0] : o && (e = o.split(" ")[0]);
                    switch (e) {
                        case "page-menu-add-fav-venue":
                            MP_Util.Doc.SwitchFavFolderVenue(a, c, f);
                            break;
                        case "noe-name":
                            MP_Util.Doc.DisplayNextFavFolder(a, c, b, f);
                            break;
                        case "noe-fav-order-button":
                            MP_Util.Doc.AddFavoriteComponent(a,
                                f);
                            break;
                        case "noe-fav-folder":
                            MP_Util.Doc.DisplaySelectedFavFolder(a, c, f)
                    }
                    f.stopPropagation()
                }
            }(c, "pageMenuAddFavorite1234", r))
        },
        SwitchFavFolderVenue: function(a, c, b) {
            b = b.target;
            var e, g = _g("pgMnuFavFolderPath" + c);
            e = Util.Style.g("noe-folder-info", g, "DL")[0];
            var g = _gbt("DT", e),
                o = _gbt("DD", e);
            for (e = g.length; e--;) 0 !== e && Util.de(g[e]);
            for (e = o.length; e--;) 0 !== e && Util.de(o[e]);
            b = b.getAttribute("venue-val");
            g = MP_Util.Doc.GetFavFolders("0", a.person_id, a.encntr_id, a.provider_id, a.position_cd, a.ppr_cd, b);
            MP_Util.Doc.LoadFavFolder(g,
                c, a, b)
        },
        DisplayNextFavFolder: function(a, c, b, e) {
            var g, o, p = MP_Util.Doc.GetQOCPersonalFavArray();
            if (p) {
                g = p.length;
                for (o = Util.gp(e.target).getAttribute("data-folder-id"); g-- && !(favObj = p[g], favObj.Id === o););
            }
            g = favObj.folderName;
            e = _g("pgMnuFavFolderPath" + c);
            e = Util.Style.g("noe-folder-info", e, "DL")[0];
            var r = _gbt("DT", e),
                t = _gbt("DD", e);
            e = t[t.length - 1];
            var v = t.length,
                p = "...";
            1 !== v && (p = "\x3e");
            if (4 < v)
                for (v -= 1; v--;) 1 < v && ("-1" == r[v].innerHTML ? (Util.Style.acss(t[v], "hidden"), Util.Style.rcss(t[v], "noe-fav-separator")) :
                    (Util.Style.acss(t[v], "hidden"), Util.Style.rcss(t[v], "noe-fav-folder")));
            r = Util.cep("DT", {
                className: "hidden",
                innerHTML: o
            });
            g = Util.cep("DD", {
                className: "noe-fav-folder",
                innerHTML: "\x3cspan\x3e" + g + "\x3c/span\x3e"
            });
            t = Util.cep("DT", {
                className: "hidden",
                innerHTML: "-1"
            });
            p = Util.cep("DD", {
                className: "noe-fav-separator",
                innerHTML: "\x3cspan\x3e" + p + "\x3c/span\x3e"
            });
            Util.ia(t, e);
            Util.ia(p, t);
            Util.ia(r, p);
            Util.ia(g, r);
            if (e = _g("pgMnuFavFolderContents" + c)) e.innerHTML = "", e.style.overflowY = "auto", Util.Style.acss(e,
                "noe-preloader-icon");
            o = MP_Util.Doc.GetFavFolders(o, a.person_id, a.encntr_id, a.provider_id, a.position_cd, a.ppr_cd, b);
            MP_Util.Doc.LoadFavFolder(o, c, a, b)
        },
        LoadFavFolder: function(a, c, e, g) {
            var o = null;
            "F" != a.STATUS_DATA.STATUS && (o = a.USER_FAV);
            if ((a = _g("pgMnuFavFolderContents" + c)) && o) {
                Util.Style.rcss(a, "noe-preloader-icon");
                var p = ["\x3cdiv\x3e"],
                    r = [],
                    r = null,
                    r = _g("pgMnuFavFolderPath" + c),
                    r = Util.Style.g("noe-folder-info", r, "DL")[0];
                _gbt("DT", r);
                r = b(o, e, c, g);
                p.push(r.favSecHtml);
                r = r.personalFavArr;
                MP_Util.Doc.SetQOCPersonalFavArray(r);
                p.push("\x3c/div\x3e");
                folderHTML = p.join("");
                a.innerHTML = folderHTML
            } else a && !o && (Util.Style.rcss(a, "noe-preloader-icon"), c = [], c.push("\x3cspan class\x3d'res-none'\x3e", i18n.ERROR_RETREIVING_DATA, "\x3c/span\x3e"), folderHTML = c.join(""), a.innerHTML = folderHTML)
        },
        DisplaySelectedFavFolder: function(a, c) {
            var b, e;
            $("#pgMnuFavFolderVenueBtns input[name\x3d'page-menu-venue-select']:checked");
            var g = $("#pgMnuFavFolderVenueBtns input[name\x3d'page-menu-venue-select']:checked").attr("venue-val"),
                o = Util.gps(Util.gp(event.target ||
                    event.srcElement)).innerHTML;
            b = _g("pgMnuFavFolderPath" + c);
            b = Util.Style.g("noe-folder-info", b, "DL")[0];
            var p = _gbt("DT", b),
                r = _gbt("DD", b),
                t = null;
            b = 0;
            for (e = p.length; b < e; b++) p[b].innerHTML == o && (t = b);
            if (null !== t) {
                for (b = p.length; b--;) e = p[b], t < b && Util.de(e);
                for (b = r.length; b--;) p = r[b], t < b && Util.de(p);
                3 < t && (Util.Style.acss(r[t - 1], "noe-fav-separator"), Util.Style.rcss(r[t - 1], "hidden"), Util.Style.acss(r[t - 2], "noe-fav-folder"), Util.Style.rcss(r[t - 2], "hidden"));
                if (b = _g("pgMnuFavFolderContents" + c)) b.innerHTML = "",
                    b.style.overflowY = "auto", Util.Style.acss(b, "noe-preloader-icon");
                o = MP_Util.Doc.GetFavFolders(o, a.person_id, a.encntr_id, a.provider_id, a.position_cd, a.ppr_cd, g);
                MP_Util.Doc.LoadFavFolder(o, c, a, g)
            }
        },
        AddFavoriteComponent: function(b, e) {
            $(".modal-div").remove();
            $(".modal-dialog-actionable").remove();
            $("html").css("overflow", "auto");
            var o = "undefined" == typeof m_viewpointJSON ? !1 : !0,
                r = Util.Style.g("div-tab-item-selected", document.body, "DIV")[0],
                t = MP_Util.Doc.GetQOCPersonalFavArray();
            if (r) {
                var v, y, w;
                if (t) {
                    v =
                        t.length;
                    for (w = Util.gp(e.target).getAttribute("data-folder-id"); v--;) favObj = t[v], favObj.Id === w && (y = favObj.folderName)
                }
                var z = w.concat("-" + r.id),
                    t = new OrderSelectionComponent;
                t.setCriterion(b);
                t.setStyles(new OrderSelectionComponentStyle);
                t.setComponentId(z);
                t.setReportId(w);
                t.setFavFolderId(w);
                t.setCustomizeView(!1);
                t.setExpanded(1);
                t.setColumn(1);
                t.setSequence(0);
                t.setPageGroupSequence(1);
                t.setLabel(y);
                o && t.setModalScratchPadEnabled(1);
                var E = t.getStyles();
                E.setComponentId(z);
                w = i18n.discernabu;
                y = [];
                v = t.getStyles();
                var f = v.getNameSpace(),
                    J = t.getComponentId();
                v.getClassName();
                t.getLink();
                t.getCriterion();
                var M = t.getLabel(),
                    o = Util.cep("div", {
                        className: v.getClassName(),
                        id: v.getId()
                    });
                y.push("\x3ch2 class\x3d'", v.getHeaderClass(), "' style\x3d'cursor: move;'\x3e\x3cspan class\x3d'", v.getHeaderToggle(), "' title\x3d'", w.HIDE_SECTION, "'\x3e-\x3c/span\x3e\x3cspan class\x3d'opts-menu menu-hide' id\x3d'mainCompMenu", f, J, "'\x3e\x26nbsp;\x3c/span\x3e\x3cspan class\x3d'", v.getTitle(), "'\x3e\x3cspan\x3e", M,
                    "\x3c/span\x3e\x3cspan class\x3d'sec-total'\x3e\x3c/span\x3e\x3c/span\x3e\x3c/h2\x3e\x3cdiv id\x3d'", v.getContentId(), "' class\x3d'", v.getContentClass(), "'\x3e\x3c/div\x3e");
                (w = t.getFooterText()) && "" !== w && y.push("\x3cdiv class\x3dsec-footer\x3e", w, "\x3c/div\x3e");
                y = y.join("");
                o.innerHTML = y;
                t.startComponentDataRetrieval();
                y = Util.Style.g("col1", r, "DIV")[0];
                w = Util.Style.g("section", y, "DIV")[0];
                y.insertBefore(o, w);
                $(".div-tab-item-selected").hasClass("qoc-dnd-enabled") || $("#" + E.getId() + " ." + E.getHeaderClass()).css("cursor",
                    "auto");
                CERN_MPageComponents.push(t);
                MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, !0, r.id);
                t = Util.Style.g(E.getHeaderToggle(), o, "span")[0];
                Util.addEvent(t, "click", MP_Util.Doc.ExpandCollapse);
                var N = "mainCompMenu" + E.getNameSpace() + z,
                    G = Util.cep("div", {
                        className: "opts-menu-content menu-hide",
                        id: "moreOptMenu" + z
                    }),
                    U = i18n.discernabu;
                G.innerHTML = ['\x3cdiv class\x3d"opts-actions-sec" id\x3d"optsMenuActions', z, '"\x3e\x3c/div\x3e\x3cdiv class\x3d"opts-personalize-sec" id\x3d"optsMenupersonalize',
                    z, '"\x3e\x3cdiv class\x3d"opts-menu-item opts-def-theme" id\x3d"optsDefTheme', z, '"\x3e', U.COLOR_THEME, '\x3c/div\x3e\x3cdiv class\x3d"opts-menu-item opts-def-state" id\x3d"optsDefState', z, '"\x3e', U.DEFAULT_EXPANDED, '\x3cspan class\x3d"opts-menu-def-exp"\x3e\x26nbsp;\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d"opts-menu-item" id\x3d"optsRemoveFavComp', z, '"\x3e', U.REMOVE_FAVORITE, "\x3c/div\x3e\x3c/div\x3e"
                ].join("");
                Util.ac(G, document.body);
                a(G, z, !1);
                var S = N.replace("mainCompMenu", "");
                Util.addEvent(_g("mainCompMenu" +
                    S), "click", function() {
                    c(G, S)
                });
                Util.addEvent(_g("optsDefTheme" + z), "mouseover", function() {
                    g(z, N, S, this, r.id)
                });
                Util.addEvent(_g("optsDefTheme" + z), "mouseout", function(a) {
                    a || (a = window.event);
                    (a = a.relatedTarget || a.toElement) ? Util.Style.ccss(a, "opts-menu-content") || _g("optMenuConfig" + z) && Util.Style.acss(_g("optMenuConfig" + z), "menu-hide"): _g("optMenuConfig" + z) && Util.Style.acss(_g("optMenuConfig" + z), "menu-hide")
                });
                Util.addEvent(_g("optsDefState" + z), "click", function() {
                    p(z, this, r.id)
                });
                Util.addEvent(_g("optsRemoveFavComp" +
                    z), "click", function() {
                    var a = E.getId();
                    MP_Util.AlertConfirm(U.REMOVE_FAV_DIALOG + "\x3cbr /\x3e", U.REMOVE_PERSONAL_FAV_COMP, U.CONFIRM_REMOVE, U.CONFIRM_CANCEL, !0, function() {
                        MP_Core.AppUserPreferenceManager.RemoveFolder(a, r.id)
                    })
                })
            }
        },
        CreateCompMenus: function(b, e) {
            for (var g = function(b, g, o, p, r) {
                    if (_g(g)) {
                        var u = _g("moreOptMenu" + b);
                        if (!u) {
                            var u = Util.cep("div", {
                                    className: "opts-menu-content menu-hide",
                                    id: "moreOptMenu" + b
                                }),
                                t = i18n.discernabu,
                                v = "",
                                A = t.INFO_BUTTON,
                                y = "";
                            o && (v = "opts-menu-def-exp");
                            r && (y = "opts-menu-info-en");
                            o = '\x3cdiv class\x3d"opts-actions-sec" id\x3d"optsMenuActions' + b + '"\x3e\x3c/div\x3e';
                            e || (o = p ? o + ('\x3cdiv class\x3d"opts-personalize-sec" id\x3d"optsMenupersonalize' + b + '"\x3e\x3cdiv class\x3d"opts-menu-item opts-def-theme" id\x3d"optsDefTheme' + b + '"\x3e' + t.COLOR_THEME + '\x3c/div\x3e\x3cdiv class\x3d"opts-menu-item opts-def-state" id\x3d"optsDefState' + b + '"\x3e' + t.DEFAULT_EXPANDED + '\x3cspan class\x3d"' + v + '"\x3e\x26nbsp;\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d"opts-menu-item opts-personalize-sec-divider" id\x3d"optsInfoState' +
                                b + '"\x3e' + A + '\x3cspan class\x3d"' + y + '"\x3e\x26nbsp;\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e') : o + ('\x3cdiv class\x3d"opts-personalize-sec" id\x3d"optsMenupersonalize' + b + '"\x3e\x3cdiv class\x3d"opts-menu-item opts-def-theme" id\x3d"optsDefTheme' + b + '"\x3e' + t.COLOR_THEME + '\x3c/div\x3e\x3cdiv class\x3d"opts-menu-item opts-def-state" id\x3d"optsDefState' + b + '"\x3e' + t.DEFAULT_EXPANDED + '\x3cspan class\x3d"' + v + '"\x3e\x26nbsp;\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e'));
                            u.innerHTML = o;
                            Util.ac(u, document.body)
                        }
                        a(u, b, !1);
                        var w = null,
                            D = function(a) {
                                a || (a = window.event);
                                a.relatedTarget || a.toElement ? w = window.setTimeout(function() {
                                    _g("optMenuConfig" + b) && Util.Style.acss(_g("optMenuConfig" + b), "menu-hide")
                                }, U) : _g("optMenuConfig" + b) && Util.Style.acss(_g("optMenuConfig" + b), "menu-hide")
                            },
                            F = g.replace("mainCompMenu", "");
                        Util.addEvent(_g("mainCompMenu" + F), "click", function() {
                            c(u, F)
                        });
                        e || (t = _g("optsDefTheme" + b), Util.addEvent(t, "mouseenter", function() {
                            window.clearTimeout(w);
                            var e = _g("optMenuConfig" + b);
                            if (e) Util.Style.ccss(e, "menu-hide") &&
                                c(e, g, this);
                            else {
                                var e = i18n.discernabu,
                                    o = _g("optMenuConfig" + b);
                                if (!o) {
                                    var o = Util.cep("div", {
                                            className: "opts-menu-config-content menu-hide",
                                            id: "optMenuConfig" + b
                                        }),
                                        p = [];
                                    p.push("\x3cdiv title \x3d '", e.COLOR_STANDARD, "' class\x3d'opts-menu-config-item opt-config-mnu-lightgrey' data-color\x3d'lightgrey' id\x3d'optConfigMnuLightGrey", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", e.COLOR_BROWN, "' class\x3d'opts-menu-config-item opt-config-mnu-brown' data-color\x3d'brown' id\x3d'optConfigMnuBrown", b, "'\x3e\x3c/div\x3e",
                                        "\x3cdiv title \x3d '", e.COLOR_CERNER_BLUE, "' class\x3d'opts-menu-config-item opt-config-mnu-cernerblue' data-color\x3d'cernerblue' id\x3d'optConfigMnuCernerBlue", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", e.COLOR_DARK_GREEN, "' class\x3d'opts-menu-config-item opt-config-mnu-darkgreen' data-color\x3d'darkgreen' id\x3d'optConfigMnuDarkGreen", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", e.COLOR_GREEN, "' class\x3d'opts-menu-config-item opt-config-mnu-green' data-color\x3d'green' id\x3d'optConfigMnuGreen",
                                        b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", e.COLOR_GREY, "' class\x3d'opts-menu-config-item opt-config-mnu-grey' data-color\x3d'grey' id\x3d'optConfigMnuGrey", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", e.COLOR_LIGHT_BLUE, "' class\x3d'opts-menu-config-item opt-config-mnu-lightblue' data-color\x3d'lightblue' id\x3d'optConfigMnuLightBlue", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", e.COLOR_NAVY, "' class\x3d'opts-menu-config-item opt-config-mnu-navy' data-color\x3d'navy' id\x3d'optConfigMnuNavy",
                                        b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", e.COLOR_ORANGE, "' class\x3d'opts-menu-config-item opt-config-mnu-orange' data-color\x3d'orange' id\x3d'optConfigMnuOrange", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", e.COLOR_PINK, "' class\x3d'opts-menu-config-item opt-config-mnu-pink' data-color\x3d'pink' id\x3d'optConfigMnuPink", b, "'\x3e\x3c/div\x3e", "\x3cdiv title \x3d '", e.COLOR_PURPLE, "' class\x3d'opts-menu-config-item opt-config-mnu-purple' data-color\x3d'purple' id\x3d'optConfigMnuPurple", b, "'\x3e\x3c/div\x3e",
                                        "\x3cdiv title \x3d '", e.COLOR_YELLOW, "' class\x3d'opts-menu-config-item opt-config-mnu-yellow' data-color\x3d'yellow' id\x3d'optConfigMnuYellow", b, "'\x3e\x3c/div\x3e");
                                    o.innerHTML = p.join("");
                                    Util.ac(o, document.body);
                                    Util.addEvent(_g("optMenuConfig" + b), "click", function(a) {
                                        var c = (a.target || a.srcElement).getAttribute("data-color");
                                        if (a = _g(F)) 0 <= "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow".indexOf(c) && (a.className = a.className.replace(/brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/,
                                            "")), Util.Style.acss(a, c), MP_Util.GetCompObjById(b).setCompColor(c), setTimeout(function() {
                                            MP_Core.AppUserPreferenceManager.SaveCompPreferences(b, c, null, !1)
                                        }, 0)
                                    });
                                    a(o, b, !0)
                                }
                                c(o, g, this)
                            }
                        }), Util.addEvent(u, "mouseenter", function(a) {
                            a || (a = window.event);
                            Util.Style.ccss(a.target || a.srcElement, "opts-def-theme") || D(a)
                        }), Util.addEvent(t, "mouseleave", function(a) {
                            a || (a = window.event);
                            window.clearTimeout(w);
                            var b = a.relatedTarget || a.toElement;
                            b && (!Util.Style.ccss(b, "opts-menu-content") && !Util.Style.ccss(b, "opts-menu-config-content")) &&
                                D(a)
                        }), Util.addEvent(_g("optsDefState" + b), "click", function() {
                            var a = MP_Util.GetCompObjById(b),
                                c = a.isExpanded();
                            a.setExpandCollapseState(!c);
                            a = _gbt("span", this)[0];
                            c ? (a && Util.Style.rcss(a, "opts-menu-def-exp"), setTimeout(function() {
                                MP_Core.AppUserPreferenceManager.SaveCompPreferences(b, "", "0", !1)
                            }, 0)) : (a && Util.Style.acss(a, "opts-menu-def-exp"), setTimeout(function() {
                                MP_Core.AppUserPreferenceManager.SaveCompPreferences(b, "", "1", !1)
                            }, 0))
                        }), p && Util.addEvent(_g("optsInfoState" + b), "click", function() {
                            var a =
                                MP_Util.GetCompObjById(b),
                                c = a.isInfoButtonEnabled(),
                                e = _gbt("span", this)[0];
                            c ? a.setIsInfoButtonEnabled(0) : a.setIsInfoButtonEnabled(1);
                            c ? e && (Util.Style.rcss(e, "opts-menu-info-en"), a.showInfoButton(a, !1), setTimeout(function() {
                                MP_Core.AppUserPreferenceManager.SaveCompPreferences(b, "", "", !1, "0")
                            }, 0)) : e && (Util.Style.acss(e, "opts-menu-info-en"), a.showInfoButton(a, !0), setTimeout(function() {
                                MP_Core.AppUserPreferenceManager.SaveCompPreferences(b, "", "", !1, "1")
                            }, 0))
                        }))
                    }
                }, o = b.length, p = 0; p < o; p++) {
                var r = b[p],
                    t =
                    r.m_styles.m_componentId,
                    v = "mainCompMenu" + r.m_styles.m_nameSpace + t,
                    y = r.isExpanded(),
                    w = r.hasInfoButton(),
                    r = r.isInfoButtonEnabled();
                g(t, v, y, w, r)
            }
        },
        CreateQOCCompMenus: function(b, e, o) {
            for (var r = function(b, r, u) {
                    if (_g(r)) {
                        var t = _g("moreOptMenu" + b);
                        if (!t) {
                            var t = Util.cep("div", {
                                    className: "opts-menu-content menu-hide",
                                    id: "moreOptMenu" + b
                                }),
                                y = i18n.discernabu,
                                w = "",
                                D = !1,
                                F = MP_Util.GetCompObjById(b).getStyles().getId();
                            u && (w = "opts-menu-def-exp");
                            t.innerHTML = '\x3cdiv class\x3d"opts-actions-sec" id\x3d"optsMenuActions' +
                                b + '"\x3e\x3c/div\x3e';
                            e || (null !== CERN_PersonalFav && CERN_PersonalFav[v] === F ? (v++, D = !0, t.innerHTML += '\x3cdiv class\x3d"opts-personalize-sec" id\x3d"optsMenupersonalize' + b + '"\x3e\x3cdiv class\x3d"opts-menu-item opts-def-theme" id\x3d"optsDefTheme' + b + '"\x3e' + y.COLOR_THEME + '\x3c/div\x3e\x3cdiv class\x3d"opts-menu-item opts-def-state" id\x3d"optsDefState' + b + '"\x3e' + y.DEFAULT_EXPANDED + '\x3cspan class\x3d"' + w + '"\x3e\x26nbsp;\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d"opts-menu-item" id\x3d"optsRemoveFavComp' +
                                b + '"\x3e' + y.REMOVE_FAVORITE + "\x3c/div\x3e\x3c/div\x3e") : (D = !1, t.innerHTML += '\x3cdiv class\x3d"opts-personalize-sec" id\x3d"optsMenupersonalize' + b + '"\x3e\x3cdiv class\x3d"opts-menu-item opts-def-theme" id\x3d"optsDefTheme' + b + '"\x3e' + y.COLOR_THEME + '\x3c/div\x3e\x3cdiv class\x3d"opts-menu-item opts-def-state" id\x3d"optsDefState' + b + '"\x3e' + y.DEFAULT_EXPANDED + '\x3cspan class\x3d"' + w + '"\x3e\x26nbsp;\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e'));
                            Util.ac(t, document.body)
                        }
                        a(t, b, !1);
                        u = function(a) {
                            a || (a = window.event);
                            (a = a.relatedTarget || a.toElement) ? Util.Style.ccss(a, "opts-menu-content") || _g("optMenuConfig" + b) && Util.Style.acss(_g("optMenuConfig" + b), "menu-hide"): _g("optMenuConfig" + b) && Util.Style.acss(_g("optMenuConfig" + b), "menu-hide")
                        };
                        var z = r.replace("mainCompMenu", "");
                        Util.addEvent(_g("mainCompMenu" + z), "click", function() {
                            c(t, z)
                        });
                        e || (Util.addEvent(_g("optsDefTheme" + b), "mouseover", function() {
                            g(b, r, z, this, o)
                        }), Util.addEvent(_g("optsDefTheme" + b), "mouseout", u), Util.addEvent(_g("optsDefState" + b), "click", function() {
                            p(b,
                                this, o)
                        }), D && Util.addEvent(_g("optsRemoveFavComp" + b), "click", function() {
                            var a = $(".div-tab-item-selected", document.body, "DIV")[0];
                            MP_Util.AlertConfirm(y.REMOVE_FAV_DIALOG + "\x3cbr /\x3e", y.REMOVE_PERSONAL_FAV_COMP, y.CONFIRM_REMOVE, y.CONFIRM_CANCEL, !0, function() {
                                MP_Core.AppUserPreferenceManager.RemoveFolder(F, a.id)
                            })
                        }))
                    }
                }, t = b.length, v = 0, y = 0; y < t; y++) {
                var w = b[y],
                    z = w.m_styles.m_componentId,
                    E = "mainCompMenu" + w.m_styles.m_nameSpace + z,
                    w = w.isExpanded();
                r(z, E, w)
            }
        },
        HideAllCompMenus: function() {
            for (var a = Util.Style.g("opts-menu-content",
                    null, "div"), b = a.length; b--;) Util.Style.ccss(a[b], "menu-hide") || Util.Style.acss(a[b], "menu-hide")
        },
        ResetPageMenus: function() {
            for (var a = Util.Style.g("page-menu"), b = a.length; b--;) {
                var c = a[b];
                Util.Style.ccss(c, "page-menu-open") && Util.Style.rcss(c, "page-menu-open")
            }
        },
        GetComments: function(a, b) {
            for (var c = "", e = "", g = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE), o = 0, p = a.COMMENTS.length; o < p; o++) null != b.length && ("" != a.COMMENTS[o].RECORDED_DT_TM && (e = g.formatISO8601(a.COMMENTS[o].RECORDED_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)),
                0 < o && (c += "\x3cbr /\x3e"), c = 0 < a.COMMENTS[o].RECORDED_BY ? c + (e + " - " + MP_Util.GetValueFromArray(a.COMMENTS[o].RECORDED_BY, b).fullName + "\x3cbr /\x3e" + a.COMMENTS[o].COMMENT_TEXT) : c + (e + "\x3cbr /\x3e" + a.COMMENTS[o].COMMENT_TEXT));
            return c
        },
        FinalizeComponent: function(a, b, c) {
            var e = b.getStyles(),
                g = b.getRootComponentNode();
            if (g) {
                var o = Util.Style.g("sec-total", g, "span");
                c ? ($(o).removeClass("hidden"), o[0].innerHTML = c) : $(o).addClass("hidden");
                var p = b.getSectionContentNode();
                p.innerHTML = a;
                MP_Util.Doc.InitHovers(e.getInfo(),
                    p, b);
                MP_Util.Doc.InitSubToggles(p, "sub-sec-hd-tgl");
                setTimeout(function() {
                    MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", p, "div"), b.getScrollNumber(), "1.6")
                }, 0);
                a = $(g).find(".error-message");
                a.length ? ($(g).find(".sec-title\x3espan:first-child").addClass("error-icon-component"), $(a).css("border", "1px solid #C00").css("padding", "2px 4px"), CERN_EventListener.fireEvent(b, b, EventListener.EVENT_ERROR_UPDATE, {
                    error: !0
                })) : ($(g).find(".sec-title\x3espan:first-child").removeClass("error-icon-component"),
                    CERN_EventListener.fireEvent(b, b, EventListener.EVENT_ERROR_UPDATE, {
                        error: !1
                    }))
            }
        },
        InitScrolling: function(a, b, c) {
            for (var e = 0; e < a.length; e++) MP_Util.Doc.InitSectionScrolling(a[e], b, c)
        },
        InitSectionScrolling: function(a, b, c) {
            a.style.maxHeight = b * c + "em";
            a.style.overflowY = "auto";
            a.style.overflowX = "hidden"
        },
        InitHovers: function(a, b, c) {
            gen = Util.Style.g(a, b, "DL");
            a = 0;
            for (b = gen.length; a < b; a++) {
                var e = gen[a];
                if (e) {
                    var g = Util.gns(Util.gns(e));
                    g && Util.Style.ccss(g, "hvr") && hs(e, g, c)
                }
            }
        },
        InitSubToggles: function(a, b) {
            for (var c =
                    i18n.discernabu, e = Util.Style.g(b, a, "span"), g = 0; g < e.length; g++) {
                Util.addEvent(e[g], "click", MP_Util.Doc.ExpandCollapse);
                var o = Util.gp(Util.gp(e[g]));
                Util.Style.ccss(o, "closed") && (e[g].innerHTML = "+", e[g].title = c.SHOW_SECTION)
            }
        },
        ExpandCollapseAll: function(a) {
            var b = i18n.discernabu,
                c = _g(a.replace("expAll", ""));
            a = _g(a);
            c = Util.Style.g("section", c);
            if (w) {
                for (var e = 0, g = c.length; e < g; e++) {
                    var o = Util.gc(Util.gc(c[e]));
                    if ("-" == o.innerHTML || "+" == o.innerHTML) Util.Style.acss(c[e], "closed"), o.innerHTML = "+", o.title =
                        b.SHOW_SECTION;
                    else
                        for (var o = Util.Style.g("sub-sec", c[e], "div"), p = 0, r = o.length; p < r; p++) {
                            var t = Util.gc(Util.gc(o[p]));
                            Util.Style.acss(o[p], "closed");
                            t.innerHTML = "+";
                            t.title = b.SHOW_SECTION
                        }
                }
                a.innerHTML = b.EXPAND_ALL;
                w = !1
            } else {
                e = 0;
                for (g = c.length; e < g; e++)
                    if (o = Util.gc(Util.gc(c[e])), "-" == o.innerHTML || "+" == o.innerHTML) Util.Style.rcss(c[e], "closed"), o.innerHTML = "-", o.title = b.HIDE_SECTION;
                    else {
                        o = Util.Style.g("sub-sec", c[e], "div");
                        p = 0;
                        for (r = o.length; p < r; p++) t = Util.gc(Util.gc(o[p])), Util.Style.rcss(o[p], "closed"),
                            t.innerHTML = "-", t.title = b.HIDE_SECTION
                    }
                a.innerHTML = b.COLLAPSE_ALL;
                w = !0
            }
        },
        AddChartSearch: function(a, b) {
            var c = function(a) {
                try {
                    if (a) {
                        var b = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
                        b.SetPopupStringProp("REPORT_NAME", "\x3curl\x3e" + a);
                        b.SetPopupDoubleProp("WIDTH", 1200);
                        b.SetPopupDoubleProp("HEIGHT", 700);
                        b.SetPopupBoolProp("SHOW_BUTTONS", 0);
                        b.LaunchPopup()
                    } else MP_Util.LogError("Error retriving URL from search")
                } catch (c) {
                    alert(i18n.discernabu.CODE_LEVEL), MP_Util.LogError("Error creating PVFRAMEWORKLINK window \x3cbr /\x3eMessage: " +
                        c.description + "\x3cbr /\x3eName: " + c.name + "\x3cbr /\x3eNumber: " + (c.number & 65535) + "\x3cbr /\x3eDescription: " + c.description)
                }
            };
            if (!_g("chrtSearchBox")) {
                var e = Util.cep("div", {
                    id: "chrtSearchBox"
                });
                e.innerHTML = "\x3cdiv id\x3d'chart-search-input-box'\x3e\x3c/div\x3e";
                if (b) {
                    var g = _g("vwpTabList");
                    Util.ac(e, g)
                } else g = _g("pageCtrl" + a.category_mean), g.parentNode.insertBefore(e, g);
                c = {
                    patientId: a.person_id,
                    userId: a.provider_id,
                    callback: c
                };
                try {
                    ChartSearchInput.embed("chart-search-input-box", c)
                } catch (o) {
                    MP_Util.LogError("Error calling Chart Search embed \x3cbr /\x3eMessage: " +
                        o.description + "\x3cbr /\x3eName: " + o.name + "\x3cbr /\x3eNumber: " + (o.number & 65535) + "\x3cbr /\x3eDescription: " + o.description)
                }
            }
        },
        AddPageTitle: function(a, b, c, e, g, o, p, r, t) {
            o = i18n.discernabu;
            c = [];
            t ? (a = "", b = _g(t), b.innerHTML = "") : b && (b = document.body);
            c.push("\x3cdiv class\x3d'pg-hd'\x3e");
            c.push("\x3ch1\x3e\x3cspan class\x3d'pg-title'\x3e", a, "\x3c/span\x3e\x3c/h1\x3e\x3cspan id\x3d'pageCtrl", r.category_mean, "' class\x3d'page-ctrl'\x3e");
            t && (a = MP_Util.GetDateFormatter(), c.push("\x3cspan class\x3d'other-anchors'\x3e",
                o.AS_OF_TIME.replace("{0}", a.format(new Date, mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS)), "\x3c/span\x3e"));
            if (g) {
                a = 0;
                for (o = g.length; a < o; a++) c.push("\x3cspan class\x3d'other-anchors'\x3e" + g[a] + "\x3c/span\x3e")
            }(e || t) && c.push("\x3cspan id\x3d'", "pageMenu" + r.category_mean, "' class\x3d'page-menu'\x3e\x26nbsp;\x3c/span\x3e");
            c.push("\x3c/span\x3e\x3c/div\x3e");
            b.innerHTML += c.join("")
        },
        LaunchHelpWindow: function(a) {
            MP_Util.LogCclNewSessionWindowInfo(null, a, "mp_core.js", "LaunchHelpWindow");
            CCLNEWSESSIONWINDOW(a,
                "_self", "left\x3d0,top\x3d0,width\x3d1200,height\x3d700,toolbar\x3dno", 0, 1);
            Util.preventDefault()
        },
        AddCustomizeLink: function(a) {
            _g("custView" + a.category_mean) && MP_Util.LogWarn("AddCustomizeLink is a deprecated function and should not be utilized")
        },
        RenderLayout: function() {
            var a = 0,
                b = _g("MP_COMMON_ORDERS_V4");
            b && (a = "none" === $(b).css("display") ? 1 : 0);
            if (null != CERN_TabManagers && 0 === a) a = null, 0 < window.name.length ? (a = window.name.split(","), MP_Util.DisplaySelectedTab(a[0], a[1])) : (a = CERN_TabManagers[0], a.setSelectedTab(!0),
                a.loadTab());
            else if (null != CERN_MPageComponents) {
                for (a = 0; a < CERN_MPageComponents.length; a++) b = CERN_MPageComponents[a], b.isDisplayable() && (b.isExpanded() && !b.isLoaded()) && (b.setLoaded(!0), b.startComponentDataRetrieval());
                for (a = 0; a < CERN_MPageComponents.length; a++) b = CERN_MPageComponents[a], b.isDisplayable() && (!b.isExpanded() && !b.isLoaded()) && (b.setLoaded(!0), b.startComponentDataRetrieval())
            }
        },
        ExpandCollapse: function() {
            var a = i18n.discernabu,
                b = Util.gp(Util.gp(this));
            Util.Style.ccss(b, "closed") ? (Util.Style.rcss(b,
                "closed"), this.innerHTML = "-", this.title = a.HIDE_SECTION) : (Util.Style.acss(b, "closed"), this.innerHTML = "+", this.title = a.SHOW_SECTION)
        },
        HideHovers: function() {
            for (var a = Util.Style.g("hover", document.body, "DIV"), b = a.length; b--;) "BODY" == Util.gp(a[b]).nodeName && (a[b].style.display = "none", Util.de(a[b]))
        },
        ReplaceSubTitleText: function(a, b) {
            var c = $("#lookbackDisplay" + a.getStyles().getId());
            c.length && c.html(b)
        },
        ReInitSubTitleText: function(a) {
            if (0 < a.getScope()) {
                var b = $("#lookbackDisplay" + a.getStyles().getId());
                b.length && b.html(J(a))
            }
        },
        RunAccordion: function(a) {
            var b = "Accordion" + a + "Content",
                c = _g("Accordion" + a + "Title"),
                e = _g("AccordionContainer" + a);
            MP_Util.GetCompObjById(a).getCriterion();
            Util.Style.ccss(c, "Expanded") ? (Util.Style.rcss(c, "Expanded"), Util.Style.rcss(e, "Expanded")) : (Util.Style.acss(c, "Expanded"), Util.Style.acss(e, "Expanded"));
            z == b && (b = "");
            setTimeout("MP_Util.Doc.Animate(" + (new Date).getTime() + ",100,'" + z + "','" + b + "'," + a + ")", 33);
            z = b
        },
        Animate: function(a, b, c, e, g) {
            var o = b,
                p = (new Date).getTime(),
                r = p -
                a;
            a = "" == e ? null : _g(e);
            var t = "" == c ? null : _g(c);
            b <= r ? (a && (a.style.display = "block", a.style.height = "275px"), t && (t.style.display = "none", t.style.height = "0px", b = Util.Style.g("acc-filter-list-item" + g), MP_Util.Doc.GetSelected(b))) : (b -= r, o = Math.round(275 * (b / o)), a && "block" != a.style.display && (a.style.display = "block", a.style.height = 275 - o + "px"), t && (t.style.height = o + "px"), setTimeout("MP_Util.Doc.Animate(" + p + "," + b + ",'" + c + "','" + e + "'," + g + ")", 33))
        },
        GetSelected: function(a) {
            for (var b = [], c = 0, e = a.length, g = 0; g < e; g++) a[g].selected &&
                (c = b.length, b[c] = {}, b[c].value = a[g].value, b[c].index = g);
            return b
        },
        CreateLookBackMenu: function(a, b, c) {
            var e = i18n.discernabu,
                g = [],
                o = a.getStyles(),
                p = o.getNameSpace(),
                r = o.getId(),
                o = a.getComponentId(),
                t = a.getCriterion().static_content,
                v = [],
                f = r + "Mnu",
                y = a.getScope(),
                w = "",
                z = "",
                E = 0,
                N = "",
                U = "",
                ha = !1;
            0 === a.m_grouper_arr.length ? a.setCompFilters(!1) : a.setCompFilters(!0);
            if (2 === b) {
                var L = _g("lb" + f);
                a.hasCompFilters() && (c ? (z = _g("cf" + o + "msg"), U = z.title, N = z.innerHTML) : MP_Util.LaunchCompFilterSelection(o, -1, 2));
                L && (L.innerHTML =
                    "")
            }
            var ca = c ? c : J(a),
                Q = a.getLookbackMenuItems();
            if (Q) {
                for (c = 0; c < Q.length; c++) {
                    v[c] = [];
                    z = parseInt(Q[c].getDescription(), 10);
                    E = Q[c].getId();
                    switch (E) {
                        case 1:
                            E = 1;
                            break;
                        case 2:
                            E = 2;
                            break;
                        case 3:
                            E = 3;
                            break;
                        case 4:
                            E = 4;
                            break;
                        case 5:
                            E = 5;
                            break
                    }
                    if (0 < y)
                        if (0 < z && 0 < E) {
                            var T = "";
                            switch (E) {
                                case 1:
                                    T = e.LAST_N_HOURS.replace("{0}", z);
                                    break;
                                case 2:
                                    T = e.LAST_N_DAYS.replace("{0}", z);
                                    break;
                                case 3:
                                    T = e.LAST_N_WEEKS.replace("{0}", z);
                                    break;
                                case 4:
                                    T = e.LAST_N_MONTHS.replace("{0}", z);
                                    break;
                                case 5:
                                    T = e.LAST_N_YEARS.replace("{0}", z);
                                    break;
                                default:
                                    T = e.LAST_N_DAYS.replace("{0}", z)
                            }
                            switch (y) {
                                case 1:
                                    w = e.ALL_N_VISITS.replace("{0}", T);
                                    break;
                                case 2:
                                    w = e.SELECTED_N_VISIT.replace("{0}", T)
                            }
                        } else switch (y) {
                            case 1:
                                w = e.All_VISITS;
                                break;
                            case 2:
                                w = e.SELECTED_VISIT
                        }
                    v[c][0] = w;
                    v[c][1] = z;
                    v[c][2] = E
                }
                g.push("\x3cdiv id\x3d'lb", f, "'\x3e\x3cdiv id\x3d'stt", r, "' class\x3d'sub-title-disp lb-drop-down'\x3e");
                g.push("\x3cspan id\x3d'lbMnuDisplay", o, "' onclick\x3d'MP_Util.LaunchMenu(\"", f, '", "', r, "\");'\x3e", ca, "\x3ca id\x3d'", p, "Drop'\x3e\x3cimg src\x3d'", t, "/images/3943_16.gif'\x3e\x3c/a\x3e\x3c/span\x3e\x3cspan id\x3d'cf",
                    o, "msg' class\x3d'filter-applied-msg' title\x3d'", U, "'\x3e", N, "\x3c/span\x3e\x3c/div\x3e");
                g.push("\x3cdiv class\x3d'cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id\x3d'", f, "'\x3e\x3cdiv class\x3d'mnu-labelbox'\x3e", ca, "\x3c/div\x3e\x3cdiv class\x3d'mnu-contentbox'\x3e");
                c = 0;
                for (p = v.length; c < p; c++) t = v[c], g.push("\x3cdiv\x3e\x3cspan class\x3d'lb-mnu' id\x3d'lb", r, c, "' onclick\x3d'MP_Util.LaunchLookBackSelection(\"", o, '",', t[1], ',"', t[2], "\");'\x3e", t[0], "\x3c/span\x3e\x3c/div\x3e");
                g.push("\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e")
            } else g.push("\x3cdiv id\x3d'lb",
                f, "'\x3e\x3cdiv id\x3d'stt", r, "' class\x3d'sub-title-disp lb-drop-down'\x3e"), g.push("\x3cspan id\x3d'lbMnuDisplay", o, "'\x3e", ca, "\x3c/span\x3e\x3cspan id\x3d'cf", o, "msg' class\x3d'filter-applied-msg' title\x3d'", U, "'\x3e", N, "\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e");
            for (r = 0; 10 > r; r++)
                if (a.getGrouperLabel(r) || a.getGrouperCatLabel(r)) {
                    ha = !0;
                    break
                }!0 === ha && 1 === b && (g.push("\x3cdiv id\x3d'AccordionContainer", o, "' class\x3d'accordion-container'\x3e"), g.push("\x3cdiv id\x3d'Accordion", o, "Content' class\x3d'accordion-content'\x3e\x3cdiv id\x3d'Accordion",
                o, "ContentDiv' class\x3d'acc-content-div'\x3e\x3c/div\x3e\x3cdiv class\x3d'lb-pg-hd lb-page-ctrl'\x3e\x3ca class\x3d'setDefault' href\x3d'#' onclick\x3d'MP_Core.AppUserPreferenceManager.SaveCompPreferences(", o, "); return false;'\x3e", e.SET_AS_DEFAULT, "\x3c/a\x3e\x3ca class\x3d'resetAll' href\x3d'#' onclick\x3d'MP_Core.AppUserPreferenceManager.ClearCompPreferences(", o, "); return false;'\x3e", e.RESET_ALL, "\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e"), g.push("\x3cdiv id\x3d'Accordion", o, "Title' class\x3d'accordion-title' onclick\x3d'MP_Util.Doc.RunAccordion(",
                o, ");' onselectstart\x3d'return false;'\x3e\x3c/div\x3e\x3c/div\x3e"));
            switch (b) {
                case 2:
                    L.innerHTML = g.join("");
                    break;
                default:
                    return g.join("")
            }
        },
        ResetLayoutSettings: function(a) {
            var b = a.getPageSettings().BR_SET.CS,
                c = a.getComponents(),
                e = null,
                e = {},
                g = {};
            for (x = b.length; x--;) g[b[x].R_MN] = b[x];
            for (x = c.length; x--;) e = c[x], e = g[e.getReportMean()], c[x].setSequence(e.R_SQ), c[x].setColumn(e.C_SQ);
            a = a.getCriterion();
            $("body").css("cursor", "wait");
            MP_Core.AppUserPreferenceManager.UpdateAllCompPreferences(c);
            cclParams = ["^MINE^", a.person_id + ".0", a.encntr_id + ".0", a.provider_id + ".0", a.position_cd + ".0", a.ppr_cd + ".0", "^" + a.executable + "^", "^" + CERN_driver_static_content.replace(/\\/g, "\\\\") + "^", "^" + CERN_driver_mean + "^", a.debug_ind];
            "undefined" == typeof CCLLINK ? window.location.href = window.location.href : CCLLINK(CERN_driver_script, cclParams.join(","), 1)
        },
        UpdateQOCComponentsWithUserPrefs: function(a, b, c) {
            for (var e = null, g = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/, o =
                    null, p = null, e = "undefined" == typeof m_viewpointJSON ? !1 : !0, r = 0, t = b.length; r < t; r++) {
                for (var v = b[r], f = !0, y = 0, w = a.length; y < w; y++) {
                    var z = a[y];
                    z.getComponentId() === v.id && (f = !1, z.setColumn(v.col_seq), z.setSequence(v.row_seq), z.setPageGroupSequence(1), o = z.getStyles(), p = o.getClassName(), v.compThemeColor && (o.setClassName(p.replace(g, "")), z.setCompColor(v.compThemeColor)), z.setExpanded(v.expanded), v.preferencesObj && z.setPreferencesObj(v.preferencesObj))
                }
                f && (p = new OrderSelectionComponent, p.setCriterion(c), p.setStyles(new OrderSelectionComponentStyle),
                    p.setCustomizeView(!1), p.setComponentId(v.id), p.setReportId(v.reportId), p.setFavFolderId(v.reportId), p.setLabel(unescape(v.label)), p.setExpanded(v.expanded), p.setColumn(v.col_seq), p.setSequence(v.row_seq), p.setPageGroupSequence(v.group_seq), p.setDisplayEnabled(!0), p.setPreferencesObj(v.preferencesObj), e && p.setModalScratchPadEnabled(1), o = p.getStyles(), o.setComponentId(v.id), v.compThemeColor && (p.setCompColor(v.compThemeColor), o.setColor(v.compThemeColor)), v.lookbackunits && p.setLookbackUnits(v.lookbackunits),
                    v.lookbacktypeflag && p.setLookbackUnitTypeFlag(v.lookbacktypeflag), v.grouperFilterLabel ? p.setGrouperFilterLabel(v.grouperFilterLabel) : p.setGrouperFilterLabel(""), v.grouperFilterCatLabel ? p.setGrouperFilterCatLabel(v.grouperFilterCatLabel) : p.setGrouperFilterCatLabel(""), v.grouperFilterCriteria ? p.setGrouperFilterCriteria(v.grouperFilterCriteria) : p.setGrouperFilterCriteria(null), v.grouperFilterCatalogCodes ? p.setGrouperFilterCatalogCodes(v.grouperFilterCatalogCodes) : p.setGrouperFilterCatalogCodes(null),
                    v.selectedTimeFrame ? p.setSelectedTimeFrame(v.selectedTimeFrame) : p.setSelectedTimeFrame(null), v.selectedDataGroup ? p.setSelectedDataGroup(v.selectedDataGroup) : p.setSelectedDataGroup(null), v.preferencesObj ? z.setPreferencesObj(v.preferencesObj) : z.setPreferencesObj(null), null === CERN_PersonalFav && (CERN_PersonalFav = []), CERN_PersonalFav.push(o.getId()), a.push(p))
            }
            return a
        }
    }
}();
MP_Util.Measurement = function() {
    return {
        GetString: function(b, g, p, r) {
            b = b instanceof MP_Core.Measurement ? b.getResult() : MP_Util.Measurement.GetObject(b, g);
            return b instanceof MP_Core.QuantityValue ? r ? b.getValue() : b.toString() : b instanceof Date ? b.format(p) : b
        },
        GetObject: function(b, g) {
            switch (b.CLASSIFICATION.toUpperCase()) {
                case "QUANTITY_VALUE":
                    var p = new MP_Core.QuantityValue;
                    p.init(b, g);
                    return p;
                case "STRING_VALUE":
                    for (var p = b.STRING_VALUE, r = [], a = 0, c = p.length; a < c; a++) r.push(p[a].VALUE);
                    return r.join(", ");
                case "DATE_VALUE":
                    a: {
                        r = 0;
                        for (a = b.DATE_VALUE.length; r < a; r++)
                            if (p = b.DATE_VALUE[r], "" != p.DATE) {
                                r = new Date;
                                r.setISO8601(p.DATE);
                                p = r;
                                break a
                            }
                        p = null
                    }
                    return p;
                case "CODIFIED_VALUES":
                case "CODE_VALUE":
                    p = b.CODE_VALUE;
                    r = [];
                    a = 0;
                    for (c = p.length; a < c; a++) {
                        for (var o = p[a].VALUES, e = 0, t = o.length; e < t; e++) r.push(o[e].SOURCE_STRING);
                        o = p[a].OTHER_RESPONSE;
                        "" != o && r.push(o)
                    }
                    return r.join(", ");
                case "ENCAPSULATED_VALUE":
                    p = [];
                    if ((r = b.ENCAPSULATED_VALUE) && 0 < r.length) {
                        a = 0;
                        for (c = r.length; a < c; a++) o = r[a].TEXT_PLAIN, null != o && 0 < o.length &&
                            p.push(o)
                    }
                    return p.join("")
            }
        },
        SetPrecision: function(b, g) {
            return MP_Util.GetNumericFormatter().format(b, "^." + g)
        },
        GetModifiedIcon: function(b) {
            return b.isModified() ? "\x3cspan class\x3d'res-modified'\x3e\x26nbsp;\x3c/span\x3e" : ""
        },
        GetNormalcyClass: function(b) {
            var g = "res-normal";
            b = b.getNormalcy();
            null != b && (b = b.meaning, null != b && ("LOW" === b ? g = "res-low" : "HIGH" === b ? g = "res-high" : "CRITICAL" === b || "EXTREMEHIGH" === b || "PANICHIGH" === b || "EXTREMELOW" === b || "PANICLOW" === b || "VABNORMAL" === b || "POSITIVE" === b ? g = "res-severe" :
                "ABNORMAL" === b && (g = "res-abnormal")));
            return g
        },
        GetNormalcyResultDisplay: function(b, g) {
            var p = MP_Util.Measurement.GetNormalcyClass(b),
                r;
            r = MP_Util.Measurement.GetString(b, null, "longDateTime2", g);
            r = ["\x3ca onclick\x3d'MP_Util.LaunchClinNoteViewer(", [b.getPersonId(), b.getEncntrId(), b.getEventId(), '"EVENT"'].join(), "); return false;' href\x3d'#'\x3e", r, "\x3c/a\x3e"].join("");
            return ["\x3cspan class\x3d'", p, "'\x3e\x3cspan class\x3d'res-ind'\x3e\x26nbsp;\x3c/span\x3e\x3cspan class\x3d'res-value'\x3e", r, "\x3c/span\x3e",
                MP_Util.Measurement.GetModifiedIcon(b), "\x3c/span\x3e"
            ].join("")
        }
    }
}();
document.getElementsByClassName = function(b, g) {
    for (var p = [], r = RegExp("\\b" + b + "\\b"), a = this.getElementsByTagName("*", g), c = 0; c < a.length; c++) r.test(a[c].className) && p.push(a[c]);
    return p
};
Function.prototype.bind = function(b) {
    var g = this;
    return function() {
        return g.apply(b, arguments)
    }
};

function EventListener() {
    this.events = [];
    this.builtinEvts = []
}
EventListener.prototype.getActionIdx = function(b, g, p, r) {
    if (b && g && (b = this.events[b][g]))
        for (g = b.length - 1; 0 <= g; g--)
            if (b[g].action == p && b[g].binding == r) return g;
    return -1
};
EventListener.prototype.addListener = function(b, g, p, r) {
    this.events[b] ? this.events[b][g] ? -1 == this.getActionIdx(b, g, p, r) && (b = this.events[b][g], b[b.length] = {
        action: p,
        binding: r
    }) : (this.events[b][g] = [], this.events[b][g][0] = {
        action: p,
        binding: r
    }) : (this.events[b] = [], this.events[b][g] = [], this.events[b][g][0] = {
        action: p,
        binding: r
    })
};
EventListener.prototype.removeListener = function(b, g, p, r) {
    this.events[b] && this.events[b][g] && (p = this.getActionIdx(b, g, p, r), 0 <= p && this.events[b][g].splice(p, 1))
};
EventListener.prototype.removeAllListeners = function(b, g) {
    if (this.events[b])
        for (var p = this.events[b].length; p--;)
            if (this.events[b][p])
                for (var r = this.events[b][p].length; r--;) this.events[b][p][r].binding == g && this.events[b][p].splice(r, 1)
};
EventListener.prototype.fireEvent = function(b, g, p, r) {
    b || (b = window.event);
    if (g && this.events && (g = this.events[g]))
        if (p = g[p])
            for (g = p.length; g--;) {
                var a = p[g].action;
                p[g].binding && (a = a.bind(p[g].binding));
                a(b, r)
            }
};
CERN_EventListener = new EventListener;
EventListener.EVENT_CLINICAL_EVENT = 1;
EventListener.EVENT_ORDER_ACTION = 2;
EventListener.EVENT_ADD_DOC = 3;
EventListener.EVENT_PREGNANCY_EVENT = 4;
EventListener.EVENT_COMP_CUSTOMIZE = 5;
EventListener.EVENT_COUNT_UPDATE = 6;
EventListener.EVENT_CRITICAL_UPDATE = 7;
EventListener.EVENT_ERROR_UPDATE = 8;
EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE = 9;
EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT = 10;
EventListener.EVENT_SCRATCHPAD_REMOVED_ORDER_ACTION = 11;
EventListener.EVENT_SCRATCHPAD_RECEIVED_ORDER_ACTION = 12;
EventListener.EVENT_REMOVE_PERSONAL_FAV_FOLDER = 13;
EventListener.EVENT_QOC_VIEW_VENUE_CHANGED = 14;
EventListener.EVENT_SCROLL = 15;
EventListener.EVENT_NAVIGATOR_ERR = 16;
moment.fn.getOffsetStr = function() {
    return /[+-]\d{4}$/.exec(this.toString())[0]
};
moment.fn.getOffsetMilli = function() {
    return 6E4 * this.zone()
};
moment.fn.getOffsetDuration = function() {
    return moment.duration(this.getOffsetMilli())
};
moment.fn.pushOffset = function() {
    var b;
    b = this.getOffsetDuration();
    "+" === this.getOffsetStr().charAt(0) ? this.add(b) : this.subtract(b);
    return this
};
moment.fn.shiftOffset = function() {
    var b;
    b = this.getOffsetDuration();
    "+" === this.getOffsetStr().charAt(0) ? this.subtract(b) : this.add(b);
    return this
};
registerNS("com.cerner.oncology.fn");
com.cerner.oncology.fn = com.cerner.oncology.fn;
com.cerner.oncology.fn.GraphDatum = function(b) {
    this.left = this.center = 0;
    this.plot = b || []
};
com.cerner.oncology.fn.GraphDatum.prototype.getMeasurement = function() {
    return this.plot[1]
};
com.cerner.oncology.fn.GraphDatum.prototype.asMoment = function() {
    return moment(this.plot[0])
};
com.cerner.oncology.fn.GraphDatum.prototype.getTime = function() {
    return this.plot[0]
};
com.cerner.oncology.fn.GraphDatum.prototype.setMeasurement = function(b) {
    this.plot = [this.getTime(), b]
};
com.cerner.oncology.fn.TemperatureLabPopupDatum = function(b) {
    this.date = b;
    this.unit = this.result = this.label = "";
    this.xValue = 0
};
com.cerner.oncology.fn.TemperatureLabPopupDatum.prototype.asMoment = function() {
    return moment(this.date)
};
com.cerner.oncology.fn.OrderPopupDatum = function() {
    this.name = this.label = "";
    this.stopDate = this.startDate = 0;
    this.estStop = this.estStart = !1;
	this.startDateTZ = "";
	this.stopDateTZ = "";
    this.clinicalDisplayLine = this.status = "";
    this.getDateDisplay = function(b, g) {
        return isNaN(new Date(g)) ? "" : (b ? "*Est. " : "") + moment(g).format("L LT")
    }
};
com.cerner.oncology.fn.OrderPopupDatum.prototype.getStartDateDisplay = function() {
    return this.getDateDisplay(this.estStart, this.startDate)
};
com.cerner.oncology.fn.OrderPopupDatum.prototype.getStopDateDisplay = function() {
    return this.getDateDisplay(this.estStop, this.stopDate)
};
com.cerner.oncology.fn.OrderPopupDatum.prototype.stopDateAsMoment = function() {
    return this.stopDate ? moment(this.stopDate) : moment().add("y", 1)
};
com.cerner.oncology.fn.OrderPopupDatum.prototype.startDateAsMoment = function() {
    return moment(this.startDate)
};
com.cerner.oncology.fn.graphData = [];
com.cerner.oncology.fn.dataStore = {};
com.cerner.oncology.fn.xmlParser = new DOMParser;
com.cerner.oncology.fn.containerAdd = 28;
com.cerner.oncology.fn.stripUnit = function(b) {
    return parseInt(b.replace(/[^\d\.]/g, ""), 10)
};
com.cerner.oncology.fn.positionPopup = function(b, g) {
    var p, r, a, c, o, e, t, v;
    a = com.cerner.oncology.fn.stripUnit;
    r = getAbsoluteViewportWidth();
    e = getAbsoluteViewportHeight();
    c = a($(b).css("width"));
    isNaN(c) && (c = b.width());
    a = 1 * $(b).height();
    t = 1 * g.clientX + getViewportScrollX();
    v = 1 * g.clientY + getViewportScrollY();
    o = g.pageX - c - 10;
    p = getViewportScrollX();
    t + c + 10 >= r ? (o < p && (o = p), b.css({
        left: o
    })) : b.css({
        left: 1 * g.pageX + 10
    });
    r = g.pageY - a - 10;
    p = getViewportScrollY();
    v + a + 10 >= e ? (r < p && (r = p), b.css({
        top: r
    })) : b.css({
        top: 1 * g.pageY +
            10
    })
};
com.cerner.oncology.fn.resizeDynamicWidths = function(b) {
    var g;
    g = com.cerner.oncology.fn.stripUnit;
    switch (b) {
        case 14:
            $(".graph, .xAxis").removeClass("width4Weeks width8Weeks").addClass("width2Weeks");
            break;
        case 28:
            $(".graph, .xAxis").removeClass("width2Weeks width8Weeks").addClass("width4Weeks");
            break;
        case 56:
            $(".graph, .xAxis").removeClass("width2Weeks width4Weeks").addClass("width8Weeks");
            break;
        default:
            alert(i18n.oncology.fn.BAD_RANGE.replace("{0}", b))
    }
    g($(".graph").css("width"));
    g($(".graph").css("margin-left"))
};
com.cerner.oncology.fn.getSectionLabels = function() {
    var b, g, p, r, a;
    r = [{
        id: "#temperatureLabel",
        key: "FEB_NEUT_TEMP"
    }, {
        id: "#labsLabel",
        key: "FEB_NEUT_LABS"
    }, {
        id: "#ordersLabel",
        key: "FEB_NEUT_ANTIMICROBIALS"
    }];
    g = function(a) {
        var b, e;
        b = "^MINE^,^" + a.key + "^";
        com.cerner.mpage.call("onc_fn_get_bedrock", function(b) {
            e = $(b).find("bedrockInfo").eq(3).children().eq(1).text().trim();
            $(a.id).text(e)
        })(b)
    };
    b = 0;
    for (p = r.length; b < p; b++) a = r[b], 0 === $(a.id).children().length && g(a)
};
com.cerner.oncology.fn.sortTemperatureAndLabEventSet = function(b) {
    var g, p, r, a, c, o, e, t;
    r = com.cerner.oncology.fn.graphData;
    p = r[r.length - 1].asMoment().pushOffset().endOf("day");
    t = r[0].asMoment().pushOffset().startOf("day");
    o = [];
    g = [];
    a = $(b).find("event");
    c = $(b).find("event_cd_disp").text().trim();
    a.each(function() {
        var a, b, e, g, z, E, timeZone;
        b = $(this).find("effective_date").text().trim();
        z = null;
		timeZone = "";
        E = $(this).find("unit_disp").text().trim();
        e = $(this).find("classification").text().trim();
		timeZone = $(this).find("timeZone").text().trim();
        if ("quantity_value" === e) e = $(this).find("number").text().trim(),
            z = isNaN(e) ? e : (+e).toString();
        else if ("string_value" === e || "code_value" === e) z = $(this).find("value").text().trim();
        g = new com.cerner.oncology.fn.TemperatureLabPopupDatum(b);
        g.result = z;
        g.label = c;
        g.unit = E;
		g.timeZone = timeZone;
        a = g.asMoment();
        if (t > a || p < a) return !0;
        $.each(r, function(b) {
            var c, e;
            e = r[b].asMoment().pushOffset().startOf("day");
            if (c = e > a) g.xValue = r[b - 1].getTime();
            if (!c && (c = e === a)) g.xValue = r[b].getTime();
            !c && b === r.length - 1 && (g.xValue = r[b].getTime());
            return !c
        });
        o.push(g)
    });
    o.sort(function(a, b) {
        var c, e;
        c = a.xValue;
        e = b.xValue;
        return c < e ? -1 : c > e ? 1 : 0
    });
    e = 0;
    $.each(o, function(a, b) {
        var c;
        c = b.xValue;
        c !== e ? (e = c, c = [b], g.push(c)) : (c = g[g.length - 1], c.push(b))
    });
    b = 0;
    for (a = g.length; b < a; ++b) g[b] = g[b].sort(function(a, b) {
        var c, e;
        c = a.asMoment();
        e = b.asMoment();
        return c < e ? 1 : c > e ? -1 : 0
    });
    return g
};
com.cerner.oncology.fn.createTemperatureAndLabPopup = function(b, g) {
    var p, r, a, c;
    r = $("#tempLabPopup").clone();
    r.attr("style", "");
    c = r.find("#tempLabPopupTitle");
    p = r.find("#tempLabPopupDummy2");
    a = r.find("#source");
    g ? ($(c).hide(), $(p).add(a).show()) : ($(c).text(b[0].label).show(), $(p).add(a).hide());
    $.each(b, function(a, b) {
        var c, p;
        p = $(document.createElement("tr")).addClass("popupRow");
        c = $(document.createElement("td")).addClass("popupColumn tempLabColumn0");
        c.text(moment(b.date).format("L LT") + " " + b.timeZone );
        p.append(c);
        c = $(document.createElement("td")).addClass("popupColumn tempLabColumn1");
        c.text(b.result + " " + b.unit);
        p.append(c);
        g && (c = $(document.createElement("td")).addClass("popupColumn tempLabColumn1"), c.text(b.label), p.append(c));
        r.find("tbody").append(p)
    });
    r.appendTo("body");
    return r
};
com.cerner.oncology.fn.registerTemperaturePopupListener = function() {
    $("#graphDiv").unbind();
    var b;
    $("#graphDiv").bind("plothover", function(g, p, r) {
        $("#x").text(p.x.toFixed(2));
        $("#y").text(p.y.toFixed(2));
        r ? (b && b.remove(), g = r.datapoint[0], g = $.data(com.cerner.oncology.fn.dataStore, "temp-" + g), b = com.cerner.oncology.fn.createTemperatureAndLabPopup(g, !0), g = getAbsoluteViewportWidth() - p.pageX, r = getAbsoluteViewportHeight() - p.pageY, p.clientX = getViewportWidth() - g, p.clientY = getViewportHeight() - r, com.cerner.oncology.fn.positionPopup(b,
            p)) : b && b.remove()
    });
    $("#graphDiv").bind("mouseout focusout", function() {
        b && b.remove()
    })
};
com.cerner.oncology.fn.createGraph = function() {
    $("#graphDiv").empty();
    var b, g, p, r, a, c;
    b = com.cerner.oncology.fn.graphData;
    g = [];
    r = b[0].getTime();
    p = b[b.length - 1].getTime();
    a = c = 0;
    $.each(b, function(b, e) {
        var p;
        p = [e.getTime(), e.getMeasurement()];
        g.push(p);
        (p = p[1]) ? (!c && (c = p), p < c && (c = p), !a && (a = p), p > a && (a = p)) : g[b][0] = null
    });
    c && a && (c -= 2, a = 1 * a + 2);
    $("#graphDiv").css("height", Math.round(getViewportHeight() / 3));
    $(".data-sect").css("padding-top", $("#temperatureLabel").height());
    $("#temp-label").css("height", $("#graphDiv").height() +
        $("#temperatureLabel").height());
    $.plot($("#graphDiv"), [g], {
        colors: ["#FF0000"],
        grid: {
            hoverable: !0
        },
        series: {
            lines: {
                show: !0
            },
            points: {
                show: !0
            }
        },
        xaxis: {
            tickFormatter: function(a) {
                return moment(a).utc().format(moment.langData()._longDateFormat.L.substr(0, 5))
            },
            max: p,
            min: r,
            mode: "time",
            tickSize: [1, "day"]
        },
        yaxis: {
            max: Math.ceil(a),
            min: Math.floor(c)
        }
    });
    com.cerner.oncology.fn.registerTemperaturePopupListener()
};
com.cerner.oncology.fn.createXAxes = function() {
    $(".xAxis").empty();
    $(".tickLabel").clone().slice(0, com.cerner.oncology.fn.graphData.length).appendTo(".xAxis");
    $(".xAxis").children().css("top", "0px")
};
com.cerner.oncology.fn.calculatePlotsPositions = function() {
    var b = com.cerner.oncology.fn.graphData;
    $("#xAxisDiv0").children().each(function(g) {
        var p;
        b[g].left = $(this).position().left;
        p = [b[g].left, b[g].left + $(this).width()];
        b[g].center = p[0] + Math.floor((p[1] - p[0]) / 2)
    })
};
com.cerner.oncology.fn.populatePlots = function(b) {
    var g, p, r, a;
    p = com.cerner.oncology.fn.graphData;
    a = moment().shiftOffset().utc().startOf("day").subtract("d", b);
    g = new com.cerner.oncology.fn.GraphDatum([a.valueOf(), 0]);
    p.push(g);
    for (r = 0; r < b; r++) a.add("d", 1), g = new com.cerner.oncology.fn.GraphDatum([a.valueOf(), 0]), p.push(g);
    $("#graphDiv").attr("style", "");
    com.cerner.mpage.call("onc_fn_get_results", function(a) {
        var g, e, r, v, J, y, w, z, E;
        a = $(a).find("event_set");
        if (a.length) {
            v = 0;
            for (J = a.length; v < J; v++)
                if (g = a[v],
                    e = com.cerner.oncology.fn.sortTemperatureAndLabEventSet(g), 0 === v) z = e;
                else {
                    y = 0;
                    for (w = e.length; y < w; y++) {
                        g = e[y];
                        r = !1;
                        m = 0;
                        for (n = z.length; m < n; m++)
                            if (E = z[m], g[0].xValue === E[0].xValue) {
                                r = !0;
                                z[m] = E.concat(g);
                                break
                            }
                        r || z.push(g)
                    }
                }
            if (1 < a.length) {
                z.sort(function(a, b) {
                    return a[0].xValue < b[0].xValue ? -1 : a[0].xValue > b[0].xValue ? 1 : 0
                });
                v = 0;
                for (J = z.length; v < J; v++) z[v] = z[v].sort(function(a, b) {
                    var c, e;
                    c = a.asMoment();
                    e = b.asMoment();
                    return c < e ? 1 : c > e ? -1 : 0
                })
            }
            $.each(z, function() {
                var a, b, c;
                c = $(this);
                a = c[0].xValue;
                b = 0;
                $.each(c,
                    function(a, c) {
                        +c.result > b && (b = +c.result)
                    });
                $.each(p, function(e) {
                    var g, o;
                    o = p[e].getTime();
                    if (g = o === a) p[e].setMeasurement(b), $.data(com.cerner.oncology.fn.dataStore, "temp-" + o, c);
                    return !g
                })
            })
        } else $("#graphDiv").children("canvas").remove(), z = $("#noResultsDiv").clone(), z.attr("id", "noResults0"), z.attr("style", ""), z.removeClass("offsetLeft"), $("#graphDiv").prepend(z).css("height", "40"), a = $(".tickLabel").clone().slice(0, b), a.css("top", "0"), z = $("#graphDiv").find(".tickLabels"), z.empty(), a.appendTo(z), z.css({
            height: "12",
            position: "relative"
        });
        com.cerner.oncology.fn.createGraph(b);
        com.cerner.oncology.fn.createXAxes();
        com.cerner.oncology.fn.calculatePlotsPositions()
    })("^MINE^,value($PAT_Personid$),^TEMP^," + b)
};
com.cerner.oncology.fn.registerLabPopupListener = function() {
    $(".labResult").unbind();
    var b;
    b = null;
    $(".labResult").hover(function(g) {
        var p = $.data(com.cerner.oncology.fn.dataStore, $(g.target).attr("id"));
        b = com.cerner.oncology.fn.createTemperatureAndLabPopup(p, !1);
        com.cerner.oncology.fn.positionPopup(b, g)
    }, function() {
        b.remove()
    })
};
com.cerner.oncology.fn.stripeLabRows = function() {
    $(".labRow:odd").css({
        "background-color": "rgb(211,211,211)",
        color: "black"
    });
    $(".labRowLabel:odd").css({
        "background-color": "rgb(211,211,211)",
        color: "black"
    })
};
com.cerner.oncology.fn.createLabs = function(b) {
    var g, p, r, a, c;
    r = com.cerner.oncology.fn.graphData;
    a = $("#labResults");
    a.empty();
    c = $("#labSubLabel");
    c.empty();
    p = function() {
        var o;
        o = "^MINE^,value($PAT_Personid$),^LABS^," + b;
        com.cerner.mpage.call("onc_fn_get_results", function(b) {
            var o, p, J, y;
            J = p = y = o = 0;
            $(b).find("event_set").each(function(b, e) {
                var E, N, U, u, B, P, D;
                U = com.cerner.oncology.fn.stripUnit;
                P = U($("#graphDiv").css("margin-left"));
                E = r[1].center - r[0].center;
                B = Math.ceil(E / 4);
                u = com.cerner.oncology.fn.sortTemperatureAndLabEventSet(e);
                N = $(document.createElement("div"));
                N.addClass("labRow");
                N.attr("id", "labRow" + o++);
                N.css("width", r[r.length - 1].center + P);
                D = $(document.createElement("div"));
                D.addClass("labRowLabel");
                D.attr("id", "labRowlabel" + y++);
                D.css("width", $("#labels").width());
                U = $(document.createElement("p"));
                U.addClass("leftColumnText leftColumnWidth");
                U.attr("id", "labName" + p++);
                U.text($(this).find("event_cd_disp").text().trim());
                D.append(U);
                $.each(u, function(a, b) {
                    var c, e;
                    c = b[0];
                    e = $(document.createElement("div"));
                    e.addClass("labResult");
                    e.css("width", 1.5 * E);
                    e.textOverflow();
                    e.attr("id", "labResult" + J++);
                    $.each(r, function(a) {
                        var o, f, p;
                        o = c.asMoment();
                        p = r[a].asMoment().pushOffset().startOf("day");
                        if (f = p > o) e.css("left", r[a - 1].left + P - B), 0 === (a - 1) % 2 ? e.addClass("labResultEven") : e.addClass("labResultOdd");
                        if (!f && (f = p === o)) e.css("left", r[a].left + P - B), 0 === a % 2 ? e.addClass("labResultEven") : e.addClass("labResultOdd");
                        !f && a === r.length - 1 && (f = !0, e.css("left", r[a].left + P - B), 0 === a % 2 ? e.addClass("labResultEven") : e.addClass("labResultOdd"));
                        f && (a = c.result +
                            (g ? " " + c.unit : ""), e.text(a), $.data(com.cerner.oncology.fn.dataStore, e.attr("id"), b));
                        return !f
                    });
                    N.append(e)
                });
                c.append(D);
                a.append(N)
            });
            a.css("height", $("#labs-label").height() - $("#labsLabel").height());
            $(".data-sect").css("padding-top", $("#labsLabel").height());
            $("#labs-label").css("padding-bottom", $("#labsLabel").height());
            0 !== $(b).find("event").length ? com.cerner.oncology.fn.registerLabPopupListener() : (b = $("#noResultsDiv").clone(), b.attr("id", "noResults1"), b.attr("style", ""), a.prepend(b));
            com.cerner.oncology.fn.stripeLabRows()
        })(o)
    };
    com.cerner.mpage.call("onc_fn_get_bedrock", function(a) {
        $(a).find("bedrockInfo").each(function() {
            var a = !1;
            "RESULT 5:" === $(this).children().eq(0).text().trim() && (g = "1" === $(this).children().eq(1).text().trim(), a = !0);
            return !a
        });
        void 0 === g && (g = !1);
        p()
    })("^MINE^,^FEB_NEUT_LAB_UNITS_IND^")
};
com.cerner.oncology.fn.registerOrderPopupListener = function() {
    $(".orderBar").unbind();
    var b;
    b = null;
    $(".orderBar").hover(function(g) {
        var p, r, a, c, o, e, t;
        p = $.data(com.cerner.oncology.fn.dataStore, $(g.target).parent().attr("id"));
        r = $.data(com.cerner.oncology.fn.dataStore, $(g.target).attr("id"));
        t = [r];
        o = function(a) {
            return moment(a).startOf("day").valueOf()
        };
        a = o(r.startDate);
        e = moment().add("y", 1).valueOf();
        c = r.stopDate ? o(r.stopDate) : e;
        $.each(p, function(b, g) {
            var p, w;
            g !== r && (p = o(g.startDate), w = g.stopDate ? o(g.stopDate) :
                e, (p = a === p || c === w || c === p || a === w || a > p && a < w || c > p && c < w || a < p && c > w) && t.push(g))
        });
        t.sort(function(a, b) {
            return a.startDate > b.startDate ? -1 : a.startDate < b.startDate ? 1 : a.label < b.label ? -1 : a.label > b.label ? 1 : 0
        });
        b = $("#orderPopup").clone();
        b.attr("style", "");
        p = b.attr("id") + "0";
        b.attr("id", p);
        p = t[0].label;
        b.find("#orderPopupTitle").text(p);
        $.each(t, function(a, c) {
            var e, g, o, p, r, t;
            p = $(document.createElement("tr")).addClass("popupRow");
            g = $(document.createElement("td")).addClass("popupColumn orderColumn0");
            g.text(c.name);
            r = $(document.createElement("td")).addClass("popupColumn orderColumn0");
            r.text(c.getStartDateDisplay() + " " + c.startDateTZ );
            t = $(document.createElement("td")).addClass("popupColumn orderColumn0");
            t.text(isNaN(c.stopDate) ? "" : c.getStopDateDisplay() + " " + c.stopDateTZ );
            e = $(document.createElement("td")).addClass("popupColumn orderColumn1");
            e.text(c.clinicalDisplayLine);
            o = $(document.createElement("td")).addClass("popupColumn orderColumn0");
            o.text(c.status);
            b.find("tbody").append(p.append(g).append(r).append(t).append(e).append(o))
        });
        b.appendTo("body");
        com.cerner.oncology.fn.positionPopup(b, g)
    }, function() {
        b.remove()
    })
};
com.cerner.oncology.fn.applyColorToOrderBars = function() {
    var b = {
        "0": "red",
        1: "goldenrod",
        2: "blue",
        3: "chocolate",
        4: "green",
        5: "purple"
    };
    $(".orderRow").each(function(g) {
        $(this).children(".orderBar").each(function() {
            $(this).css({
                "background-color": b[(g + 6) % 6],
                color: "black"
            })
        })
    });
    $(".orderRowLabel").each(function(g) {
        $(this).children(".orderBar").each(function() {
            $(this).css({
                "background-color": b[(g + 6) % 6],
                color: "black"
            })
        })
    })
};
com.cerner.oncology.fn.createOrders = function(b) {
    var g, p, r;
    g = com.cerner.oncology.fn.graphData;
    p = $("#orderResults");
    p.empty();
    r = $("#orderSubLabel");
    r.empty();
    com.cerner.mpage.call("onc_fn_get_orders", function(a) {
        var b, o, e, t, v, J;
        e = v = J = t = 0;
        o = g[1].center - g[0].center;
        b = function(a) {
            var b, c;
            c = function(b) {
                var c, w, u, z, P, D;
                P = g[0].asMoment().pushOffset().startOf("day");
                c = g[g.length - 1].asMoment().pushOffset().endOf("day");
                u = $(document.createElement("div"));
                u.addClass("orderRow");
                u.attr("id", "orderRow" + t++);
                u.width(p.width());
                D = $(document.createElement("div"));
                D.addClass("orderRowLabel");
                D.attr("id", "orderRowName" + J++);
                D.width($("#labels").width());
                z = $(document.createElement("p"));
                z.addClass("leftColumnText leftColumnWidth");
                z.attr("id", "orderName" + v++);
                z.text($(a).find("primary_mnemonic").text().trim());
                D.append(z);
                b = $(b).find("order");
                w = [];
                b.each(function() {
                    var a, b, p, r, t, v;
                    b = $(document.createElement("div"));
                    b.addClass("orderBar");
                    b.attr("id", "orderBar" + e++);
                    p = new com.cerner.oncology.fn.OrderPopupDatum;
                    p.label = z.text();
                    p.name = $(this).find("clinical_name").text().trim();
                    p.startDate = moment($(this).find("current_start_date").text().trim()).valueOf();
                    a = $(this).find("projected_stop_date").text().trim();
                    p.stopDate = a ? moment(a).valueOf() : a;
                    p.estStart = "1" === $(this).find("start_date_estimated_ind").text().trim();
                    p.estStop = "1" === $(this).find("stop_date_estimated_ind").text().trim();
                    p.clinicalDisplayLine = $(this).find("clinical_display_line").text().trim();
					p.startDateTZ = $(this).find("start_date_timeZone").text().trim();
					p.stopDateTZ = $(this).find("stop_date_timeZone").text().trim();
                    p.status = $(this).find("order_status_disp").text().trim();
                    a = p.startDateAsMoment();
                    t = p.stopDateAsMoment();
                    r = a.clone().endOf("day").valueOf();
                    v = t.clone().endOf("day").valueOf();
                    if (P > t || c < a || a > t) return !0;
                    w.push(p);
                    $.each(g, function(a) {
                        var c, e, p, t;
                        p = com.cerner.oncology.fn.stripUnit;
                        e = p($("#graphDiv").css("margin-left"));
                        g[a].asMoment().pushOffset().startOf("day");
                        t = g[a].asMoment().pushOffset().endOf("day").valueOf();
                        if (!b.css("left") || "0px" === b.css("left")) a === g.length - 1 ? b.css("left", g[a].center + e - Math.floor(o / 3)) : (t === r || P.valueOf() > r) && b.css("left", g[a].center + e);
                        c = b.css("width");
                        if (!c || "auto" === c || !p(c)) 0 === a ? t === v && b.css("width", Math.floor(o / 3)) : a === g.length - 1 ? b.css("width", g[a].center + e - p(b.css("left"))) : t === v && (v === r ? b.css("width", Math.floor(o / 3)) : b.css("width", g[a].center - p(b.css("left")) + e))
                    });
                    u.append(b);
                    $.data(com.cerner.oncology.fn.dataStore, b.attr("id"), p)
                });
                1 <= u.children().length && (p.append(u), r.append(D), $.data(com.cerner.oncology.fn.dataStore, u.attr("id"), w));
                p.css("height", $("#orders-label").height() - $("#ordersLabel").height())
            };
            b = $(a).find("active_orders");
            0 < b.length && c(b);
            b = $(a).find("inactive_orders");
            0 < b.length && c(b)
        };
        $(".data-sect").css("padding-top", $("#ordersLabel").height());
        $(a).find("category").each(function(a, e) {
            b(e)
        });
        0 === p.children().length ? (a = $("#noResultsDiv").clone(), a.attr("id", "noResults2"), a.attr("style", ""), p.prepend(a)) : (com.cerner.oncology.fn.applyColorToOrderBars(), com.cerner.oncology.fn.registerOrderPopupListener())
    })("^MINE^,value($PAT_Personid$)," + b)
};
com.cerner.oncology.fn.getData = function(b) {
    $.cookie("daysBack", b);
    com.cerner.oncology.fn.graphData = [];
    com.cerner.oncology.fn.dataStore = [];
    com.cerner.oncology.fn.resizeDynamicWidths(b);
    com.cerner.oncology.fn.getSectionLabels();
    com.cerner.oncology.fn.populatePlots(b);
    com.cerner.oncology.fn.createLabs(b);
    com.cerner.oncology.fn.createOrders(b);
    if (0 < $("#customSectionDiv").length) try {
        com.cerner.oncology.fn.createCustomSection(b)
    } catch (g) {
        throw alert(i18n.oncology.fn.CUSTOM_ERROR), g;
    }
};
$(function() {
    var b;
    b = function(b, p) {
        var r, a;
        a = document.createElement("script");
        a.type = "text/javascript";
        a.readyState ? a.onreadystatechange = function() {
            if ("loaded" === a.readyState || "complete" === a.readyState) a.onreadystatechange = null, p()
        } : a.onload = function() {
            p()
        };
        a.src = b;
        r = document.getElementsByTagName("script")[0];
        r.parentNode.insertBefore(a, r)
    };
    com.cerner.mpage.call("onc_mp_locale", function(g) {
        var p, r, a;
        a = $("link:first").attr("href").split(/css[/\\]lib.+$/)[0];
        g = $(g).children(":first").text().toLowerCase();
        log.debug("lang: " + g);
        switch (g) {
            case "en_gb":
                p = a + "i18n/en_gb/mp-core_i18n.js";
                r = a + "i18n/en_gb/feb-neut_i18n.js";
                moment.lang("en-gb");
                break;
            case "en_au":
                p = a + "i18n/en_au/mp-core_i18n.js";
                r = a + "i18n/en_au/feb-neut_i18n.js";
                moment.lang("en-gb");
                break;
            case "fr":
                p = a + "i18n/fr/mp-core_i18n.js";
                r = a + "i18n/fr/feb-neut_i18n.js";
                moment.lang("fr");
                break;
            case "es":
                p = a + "i18n/es/mp-core_i18n.js";
                r = a + "i18n/es/feb-neut_i18n.js";
                moment.lang("es");
                break;
            case "de":
                p = a + "i18n/de/mp-core_i18n.js";
                r = a + "i18n/de/feb-neut_i18n.js";
                moment.lang("de");
                break;
            case "pt_br":
                p = a + "i18n/pt_br/mp-core_i18n.js";
                r = a + "i18n/pt_br/feb-neut_i18n.js";
                moment.lang("pt-br");
                break;
            default:
                p = a + "i18n/mp-core_i18n.js", r = a + "i18n/feb-neut_i18n.js", moment.lang("en")
        }
        /\\/.test(a) && (p = p.replace(/\//g, "\\"), r = r.replace(/\//g, "\\"));
        b(r, function() {
            log.debug(r);
            b(p, function() {
                log.debug(p);
                com.cerner.oncology.fn.init()
            })
        })
    })("^MINE^, 1")
});
com.cerner.oncology.fn.init = function() {
    var b, g, p, r, a, c;
    c = getViewportWidth() - 17;
    b = $(document.createElement("link")).attr({
        rel: "stylesheet",
        type: "text/css"
    });
    $("html").css("font-family", "Tahoma, Geneva, sans-serif");
    $("head").children("link:last").after(b);
    a = $("link[href*\x3d'onc_fn_css.css']").attr("href").split("onc_fn_css.css");
    1E3 >= c ? (b.attr("href", a[0] + "onc_fn_small.css"), $("html").css("font-size", "8pt")) : (1300 > c ? b.attr("href", a[0] + "onc_fn_medium.css") : b.attr("href", a[0] + "onc_fn_large.css"), $("html").css("font-size",
        "9pt"));
    log.debug("css loaded: " + b.attr("href"));
    $("#dateRangeLabel0").text(i18n.discernabu.X_WEEKS.replace("{0}", "2"));
    $("#dateRangeLabel1").text(i18n.discernabu.X_WEEKS.replace("{0}", "4"));
    $("#dateRangeLabel2").text(i18n.discernabu.X_WEEKS.replace("{0}", "8"));
    $("#tempLabDateTime").text(i18n.DATE_TIME);
    $("#resultUnit").text(i18n.RESULT + " \x26 " + i18n.RCM_UNIT);
    $("#source").text(i18n.oncology.fn.ROUTE);
    $("#orderName").text(i18n.oncology.fn.CLINICAL_NAME);
    $("#clinDispInfo").text(i18n.oncology.fn.CLINICAL_DISPLAY_INFO);
    $("#orderStartDateTime").text(i18n.START_DT_TM);
    $("#orderStopDateTime").text(i18n.STOP_DT_TM);
    $("#orderStatus").text(i18n.ORDER_NAME + " " + i18n.STATUS);
    $("#noResults").text(i18n.oncology.fn.NO_RESULTS);
    $("#customCode").length && ($("#customCode").text(i18n.oncology.fn.CUSTOM), $("#customJs").text(i18n.oncology.fn.CUSTOM_JS), $("#customCss").text(i18n.oncology.fn.CUSTOM_CSS), $("#customCurDir").text(i18n.oncology.fn.CUSTOM_DIR), $("#customUcern").text(i18n.oncology.fn.CUSTOM_UCERN), $("#customGoodLuck").text(i18n.oncology.fn.CUSTOM_GOOD_LUCK));
    r = function(a) {
        $(".rangeLabel").attr("style", "");
        $(a).css({
            "background-color": "white",
            color: "black",
            cursor: "default",
            "text-decoration": "none"
        })
    };
    g = {
        "0": 14,
        1: 28,
        2: 56
    };
    p = com.cerner.oncology.fn.getData;
    $(".rangeLabel").click(function() {
        r($(this));
        p(g[$(this).index()])
    });
    if (b = parseInt($.cookie("daysBack"), 10)) switch (b) {
        case 28:
            r($("#dateRangeLabel1"));
            break;
        case 56:
            r($("#dateRangeLabel2"));
            break;
        default:
            r($("#dateRangeLabel0"))
    } else r($("#dateRangeLabel0"));
    p(b || g[0])
};
$(function() {
    $("html, body, #fn_body").height($(window).height());
    $("html, body, #fn_body, #fn_content").width($(window).width());
    $("#fn_content").height($("#fn_body").height() - $("#dateRangeDiv").height());
    $("#data").width($("#fn_content").width() - $("#labels").width());
    var b, g, p;
    b = $("#data").width();
    g = 2 * b;
    p = 2 * g;
    $("#dateRangeLabel0").click(function() {
        $("#data-cont").width(b)
    });
    $("#dateRangeLabel1").click(function() {
        $("#data-cont").width(g)
    });
    $("#dateRangeLabel2").click(function() {
        $("#data-cont").width(p)
    })
});