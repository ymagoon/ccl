
window.onerror = function(message,file,lineNumber) {
	logErrorMessages("",message + " " + file + " " + lineNumber,"");
}

/*
// ADDED TO USE .format() to convert date formats for internationalization

 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

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
}());

    // If the JSON object does not yet have a parse method, give it one.

    var json_parse = (function () {
        "use strict";
    // This is a function that can parse a JSON text, producing a JavaScript
    // data structure. It is a simple, recursive descent parser. It does not use
    // eval or regular expressions, so it can be used as a model for implementing
    // a JSON parser in other languages.
    
    // We are defining the function inside of another function to avoid creating
    // global variables.
    
        var at,     // The index of the current character
            ch,     // The current character
            escapee = {
                '"': '"',
                '\\': '\\',
                '/': '/',
                b: '\b',
                f: '\f',
                n: '\n',
                r: '\r',
                t: '\t'
            },
            text,
    
            error = function (m) {
    
    // Call error when something is wrong.
    
                throw {
                    name: 'SyntaxError',
                    message: m,
                    at: at,
                    text: text
                };
            },
    
            next = function (c) {
    
    // If a c parameter is provided, verify that it matches the current character.
    
                if (c && c !== ch) {
                    error("Expected '" + c + "' instead of '" + ch + "'");
                }
    
    // Get the next character. When there are no more characters,
    // return the empty string.
    
                ch = text.charAt(at);
                at += 1;
                return ch;
            },
    
            number = function () {
    
    // Parse a number value.
    
                var number,
                    string = '';
    
                if (ch === '-') {
                    string = '-';
                    next('-');
                }
                while (ch >= '0' && ch <= '9') {
                    string += ch;
                    next();
                }
                if (ch === '.') {
                    string += '.';
                    while (next() && ch >= '0' && ch <= '9') {
                        string += ch;
                    }
                }
                if (ch === 'e' || ch === 'E') {
                    string += ch;
                    next();
                    if (ch === '-' || ch === '+') {
                        string += ch;
                        next();
                    }
                    while (ch >= '0' && ch <= '9') {
                        string += ch;
                        next();
                    }
                }
                number = +string;
                if (!isFinite(number)) {
                    error("Bad number");
                } else {
                    return number;
                }
            },
    
            string = function () {
    
    // Parse a string value.
    
                var hex,
                    i,
                    string = '',
                    uffff;
    
    // When parsing for string values, we must look for " and \ characters.
    
                if (ch === '"') {
                    while (next()) {
                        if (ch === '"') {
                            next();
                            return string;
                        }
                        if (ch === '\\') {
                            next();
                            if (ch === 'u') {
                                uffff = 0;
                                for (i = 0; i < 4; i += 1) {
                                    hex = parseInt(next(), 16);
                                    if (!isFinite(hex)) {
                                        break;
                                    }
                                    uffff = uffff * 16 + hex;
                                }
                                string += String.fromCharCode(uffff);
                            } else if (typeof escapee[ch] === 'string') {
                                string += escapee[ch];
                            } else {
                                break;
                            }
                        } else {
                            string += ch;
                        }
                    }
                }
                error("Bad string");
            },
    
            white = function () {
    
    // Skip whitespace.
    
                while (ch && ch <= ' ') {
                    next();
                }
            },
    
            word = function () {
    
    // true, false, or null.
    
                switch (ch) {
                case 't':
                    next('t');
                    next('r');
                    next('u');
                    next('e');
                    return true;
                case 'f':
                    next('f');
                    next('a');
                    next('l');
                    next('s');
                    next('e');
                    return false;
                case 'n':
                    next('n');
                    next('u');
                    next('l');
                    next('l');
                    return null;
                }
                error("Unexpected '" + ch + "'");
            },
    
            value,  // Place holder for the value function.
    
            array = function () {
    
    // Parse an array value.
    
                var array = [];
    
                if (ch === '[') {
                    next('[');
                    white();
                    if (ch === ']') {
                        next(']');
                        return array;   // empty array
                    }
                    while (ch) {
                        array.push(value());
                        white();
                        if (ch === ']') {
                            next(']');
                            return array;
                        }
                        next(',');
                        white();
                    }
                }
                error("Bad array");
            },
    
            object = function () {
    
    // Parse an object value.
    
                var key,
                    object = {};
    
                if (ch === '{') {
                    next('{');
                    white();
                    if (ch === '}') {
                        next('}');
                        return object;   // empty object
                    }
                    while (ch) {
                        key = string();
                        white();
                        next(':');
                        if (Object.hasOwnProperty.call(object, key)) {
                            error('Duplicate key "' + key + '"');
                        }
                        object[key] = value();
                        white();
                        if (ch === '}') {
                            next('}');
                            return object;
                        }
                        next(',');
                        white();
                    }
                }
                error("Bad object");
            };
    
        value = function () {
    
    // Parse a JSON value. It could be an object, an array, a string, a number,
    // or a word.
    
            white();
            switch (ch) {
            case '{':
                return object();
            case '[':
                return array();
            case '"':
                return string();
            case '-':
                return number();
            default:
                return ch >= '0' && ch <= '9' 
                    ? number() 
                    : word();
            }
        };
    
    // Return the json_parse function. It will have access to all of the above
    // functions and variables.
    
        return function (source, reviver) {
            var result;
    
            text = source;
            at = 0;
            ch = ' ';
            result = value();
            white();
            if (ch) {
                error("Syntax error");
            }
    
    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.
    
            return typeof reviver === 'function'
                ? (function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
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
                }({'': result}, ''))
                : result;
        };
    }());

/*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function (a, b) {
    function cy(a) { return f.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1 } function cv(a) { if (!ck[a]) { var b = c.body, d = f("<" + a + ">").appendTo(b), e = d.css("display"); d.remove(); if (e === "none" || e === "") { cl || (cl = c.createElement("iframe"), cl.frameBorder = cl.width = cl.height = 0), b.appendChild(cl); if (!cm || !cl.createElement) cm = (cl.contentWindow || cl.contentDocument).document, cm.write((c.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>"), cm.close(); d = cm.createElement(a), cm.body.appendChild(d), e = f.css(d, "display"), b.removeChild(cl) } ck[a] = e } return ck[a] } function cu(a, b) { var c = {}; f.each(cq.concat.apply([], cq.slice(0, b)), function () { c[this] = a }); return c } function ct() { cr = b } function cs() { setTimeout(ct, 0); return cr = f.now() } function cj() { try { return new a.ActiveXObject("Microsoft.XMLHTTP") } catch (b) { } } function ci() { try { return new a.XMLHttpRequest } catch (b) { } } function cc(a, c) { a.dataFilter && (c = a.dataFilter(c, a.dataType)); var d = a.dataTypes, e = {}, g, h, i = d.length, j, k = d[0], l, m, n, o, p; for (g = 1; g < i; g++) { if (g === 1) for (h in a.converters) typeof h == "string" && (e[h.toLowerCase()] = a.converters[h]); l = k, k = d[g]; if (k === "*") k = l; else if (l !== "*" && l !== k) { m = l + " " + k, n = e[m] || e["* " + k]; if (!n) { p = b; for (o in e) { j = o.split(" "); if (j[0] === l || j[0] === "*") { p = e[j[1] + " " + k]; if (p) { o = e[o], o === !0 ? n = p : p === !0 && (n = o); break } } } } !n && !p && f.error("No conversion from " + m.replace(" ", " to ")), n !== !0 && (c = n ? n(c) : p(o(c))) } } return c } function cb(a, c, d) { var e = a.contents, f = a.dataTypes, g = a.responseFields, h, i, j, k; for (i in g) i in d && (c[g[i]] = d[i]); while (f[0] === "*") f.shift(), h === b && (h = a.mimeType || c.getResponseHeader("content-type")); if (h) for (i in e) if (e[i] && e[i].test(h)) { f.unshift(i); break } if (f[0] in d) j = f[0]; else { for (i in d) { if (!f[0] || a.converters[i + " " + f[0]]) { j = i; break } k || (k = i) } j = j || k } if (j) { j !== f[0] && f.unshift(j); return d[j] } } function ca(a, b, c, d) { if (f.isArray(b)) f.each(b, function (b, e) { c || bE.test(a) ? d(a, e) : ca(a + "[" + (typeof e == "object" || f.isArray(e) ? b : "") + "]", e, c, d) }); else if (!c && b != null && typeof b == "object") for (var e in b) ca(a + "[" + e + "]", b[e], c, d); else d(a, b) } function b_(a, c) { var d, e, g = f.ajaxSettings.flatOptions || {}; for (d in c) c[d] !== b && ((g[d] ? a : e || (e = {}))[d] = c[d]); e && f.extend(!0, a, e) } function b$(a, c, d, e, f, g) { f = f || c.dataTypes[0], g = g || {}, g[f] = !0; var h = a[f], i = 0, j = h ? h.length : 0, k = a === bT, l; for (; i < j && (k || !l); i++) l = h[i](c, d, e), typeof l == "string" && (!k || g[l] ? l = b : (c.dataTypes.unshift(l), l = b$(a, c, d, e, l, g))); (k || !l) && !g["*"] && (l = b$(a, c, d, e, "*", g)); return l } function bZ(a) { return function (b, c) { typeof b != "string" && (c = b, b = "*"); if (f.isFunction(c)) { var d = b.toLowerCase().split(bP), e = 0, g = d.length, h, i, j; for (; e < g; e++) h = d[e], j = /^\+/.test(h), j && (h = h.substr(1) || "*"), i = a[h] = a[h] || [], i[j ? "unshift" : "push"](c) } } } function bC(a, b, c) { var d = b === "width" ? a.offsetWidth : a.offsetHeight, e = b === "width" ? bx : by, g = 0, h = e.length; if (d > 0) { if (c !== "border") for (; g < h; g++) c || (d -= parseFloat(f.css(a, "padding" + e[g])) || 0), c === "margin" ? d += parseFloat(f.css(a, c + e[g])) || 0 : d -= parseFloat(f.css(a, "border" + e[g] + "Width")) || 0; return d + "px" } d = bz(a, b, b); if (d < 0 || d == null) d = a.style[b] || 0; d = parseFloat(d) || 0; if (c) for (; g < h; g++) d += parseFloat(f.css(a, "padding" + e[g])) || 0, c !== "padding" && (d += parseFloat(f.css(a, "border" + e[g] + "Width")) || 0), c === "margin" && (d += parseFloat(f.css(a, c + e[g])) || 0); return d + "px" } function bp(a, b) { b.src ? f.ajax({ url: b.src, async: !1, dataType: "script" }) : f.globalEval((b.text || b.textContent || b.innerHTML || "").replace(bf, "/*$0*/")), b.parentNode && b.parentNode.removeChild(b) } function bo(a) { var b = c.createElement("div"); bh.appendChild(b), b.innerHTML = a.outerHTML; return b.firstChild } function bn(a) { var b = (a.nodeName || "").toLowerCase(); b === "input" ? bm(a) : b !== "script" && typeof a.getElementsByTagName != "undefined" && f.grep(a.getElementsByTagName("input"), bm) } function bm(a) { if (a.type === "checkbox" || a.type === "radio") a.defaultChecked = a.checked } function bl(a) { return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : [] } function bk(a, b) { var c; if (b.nodeType === 1) { b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(); if (c === "object") b.outerHTML = a.outerHTML; else if (c !== "input" || a.type !== "checkbox" && a.type !== "radio") { if (c === "option") b.selected = a.defaultSelected; else if (c === "input" || c === "textarea") b.defaultValue = a.defaultValue } else a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value); b.removeAttribute(f.expando) } } function bj(a, b) { if (b.nodeType === 1 && !!f.hasData(a)) { var c, d, e, g = f._data(a), h = f._data(b, g), i = g.events; if (i) { delete h.handle, h.events = {}; for (c in i) for (d = 0, e = i[c].length; d < e; d++) f.event.add(b, c + (i[c][d].namespace ? "." : "") + i[c][d].namespace, i[c][d], i[c][d].data) } h.data && (h.data = f.extend({}, h.data)) } } function bi(a, b) { return f.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a } function U(a) { var b = V.split("|"), c = a.createDocumentFragment(); if (c.createElement) while (b.length) c.createElement(b.pop()); return c } function T(a, b, c) { b = b || 0; if (f.isFunction(b)) return f.grep(a, function (a, d) { var e = !!b.call(a, d, a); return e === c }); if (b.nodeType) return f.grep(a, function (a, d) { return a === b === c }); if (typeof b == "string") { var d = f.grep(a, function (a) { return a.nodeType === 1 }); if (O.test(b)) return f.filter(b, d, !c); b = f.filter(b, d) } return f.grep(a, function (a, d) { return f.inArray(a, b) >= 0 === c }) } function S(a) { return !a || !a.parentNode || a.parentNode.nodeType === 11 } function K() { return !0 } function J() { return !1 } function n(a, b, c) { var d = b + "defer", e = b + "queue", g = b + "mark", h = f._data(a, d); h && (c === "queue" || !f._data(a, e)) && (c === "mark" || !f._data(a, g)) && setTimeout(function () { !f._data(a, e) && !f._data(a, g) && (f.removeData(a, d, !0), h.fire()) }, 0) } function m(a) { for (var b in a) { if (b === "data" && f.isEmptyObject(a[b])) continue; if (b !== "toJSON") return !1 } return !0 } function l(a, c, d) { if (d === b && a.nodeType === 1) { var e = "data-" + c.replace(k, "-$1").toLowerCase(); d = a.getAttribute(e); if (typeof d == "string") { try { d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : f.isNumeric(d) ? parseFloat(d) : j.test(d) ? f.parseJSON(d) : d } catch (g) { } f.data(a, c, d) } else d = b } return d } function h(a) { var b = g[a] = {}, c, d; a = a.split(/\s+/); for (c = 0, d = a.length; c < d; c++) b[a[c]] = !0; return b } var c = a.document, d = a.navigator, e = a.location, f = function () { function J() { if (!e.isReady) { try { c.documentElement.doScroll("left") } catch (a) { setTimeout(J, 1); return } e.ready() } } var e = function (a, b) { return new e.fn.init(a, b, h) }, f = a.jQuery, g = a.$, h, i = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, j = /\S/, k = /^\s+/, l = /\s+$/, m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, n = /^[\],:{}\s]*$/, o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, q = /(?:^|:|,)(?:\s*\[)+/g, r = /(webkit)[ \/]([\w.]+)/, s = /(opera)(?:.*version)?[ \/]([\w.]+)/, t = /(msie) ([\w.]+)/, u = /(mozilla)(?:.*? rv:([\w.]+))?/, v = /-([a-z]|[0-9])/ig, w = /^-ms-/, x = function (a, b) { return (b + "").toUpperCase() }, y = d.userAgent, z, A, B, C = Object.prototype.toString, D = Object.prototype.hasOwnProperty, E = Array.prototype.push, F = Array.prototype.slice, G = String.prototype.trim, H = Array.prototype.indexOf, I = {}; e.fn = e.prototype = { constructor: e, init: function (a, d, f) { var g, h, j, k; if (!a) return this; if (a.nodeType) { this.context = this[0] = a, this.length = 1; return this } if (a === "body" && !d && c.body) { this.context = c, this[0] = c.body, this.selector = a, this.length = 1; return this } if (typeof a == "string") { a.charAt(0) !== "<" || a.charAt(a.length - 1) !== ">" || a.length < 3 ? g = i.exec(a) : g = [null, a, null]; if (g && (g[1] || !d)) { if (g[1]) { d = d instanceof e ? d[0] : d, k = d ? d.ownerDocument || d : c, j = m.exec(a), j ? e.isPlainObject(d) ? (a = [c.createElement(j[1])], e.fn.attr.call(a, d, !0)) : a = [k.createElement(j[1])] : (j = e.buildFragment([g[1]], [k]), a = (j.cacheable ? e.clone(j.fragment) : j.fragment).childNodes); return e.merge(this, a) } h = c.getElementById(g[2]); if (h && h.parentNode) { if (h.id !== g[2]) return f.find(a); this.length = 1, this[0] = h } this.context = c, this.selector = a; return this } return !d || d.jquery ? (d || f).find(a) : this.constructor(d).find(a) } if (e.isFunction(a)) return f.ready(a); a.selector !== b && (this.selector = a.selector, this.context = a.context); return e.makeArray(a, this) }, selector: "", jquery: "1.7.1", length: 0, size: function () { return this.length }, toArray: function () { return F.call(this, 0) }, get: function (a) { return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a] }, pushStack: function (a, b, c) { var d = this.constructor(); e.isArray(a) ? E.apply(d, a) : e.merge(d, a), d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")"); return d }, each: function (a, b) { return e.each(this, a, b) }, ready: function (a) { e.bindReady(), A.add(a); return this }, eq: function (a) { a = +a; return a === -1 ? this.slice(a) : this.slice(a, a + 1) }, first: function () { return this.eq(0) }, last: function () { return this.eq(-1) }, slice: function () { return this.pushStack(F.apply(this, arguments), "slice", F.call(arguments).join(",")) }, map: function (a) { return this.pushStack(e.map(this, function (b, c) { return a.call(b, c, b) })) }, end: function () { return this.prevObject || this.constructor(null) }, push: E, sort: [].sort, splice: [].splice }, e.fn.init.prototype = e.fn, e.extend = e.fn.extend = function () { var a, c, d, f, g, h, i = arguments[0] || {}, j = 1, k = arguments.length, l = !1; typeof i == "boolean" && (l = i, i = arguments[1] || {}, j = 2), typeof i != "object" && !e.isFunction(i) && (i = {}), k === j && (i = this, --j); for (; j < k; j++) if ((a = arguments[j]) != null) for (c in a) { d = i[c], f = a[c]; if (i === f) continue; l && f && (e.isPlainObject(f) || (g = e.isArray(f))) ? (g ? (g = !1, h = d && e.isArray(d) ? d : []) : h = d && e.isPlainObject(d) ? d : {}, i[c] = e.extend(l, h, f)) : f !== b && (i[c] = f) } return i }, e.extend({ noConflict: function (b) { a.$ === e && (a.$ = g), b && a.jQuery === e && (a.jQuery = f); return e }, isReady: !1, readyWait: 1, holdReady: function (a) { a ? e.readyWait++ : e.ready(!0) }, ready: function (a) { if (a === !0 && ! --e.readyWait || a !== !0 && !e.isReady) { if (!c.body) return setTimeout(e.ready, 1); e.isReady = !0; if (a !== !0 && --e.readyWait > 0) return; A.fireWith(c, [e]), e.fn.trigger && e(c).trigger("ready").off("ready") } }, bindReady: function () { if (!A) { A = e.Callbacks("once memory"); if (c.readyState === "complete") return setTimeout(e.ready, 1); if (c.addEventListener) c.addEventListener("DOMContentLoaded", B, !1), a.addEventListener("load", e.ready, !1); else if (c.attachEvent) { c.attachEvent("onreadystatechange", B), a.attachEvent("onload", e.ready); var b = !1; try { b = a.frameElement == null } catch (d) { } c.documentElement.doScroll && b && J() } } }, isFunction: function (a) { return e.type(a) === "function" }, isArray: Array.isArray || function (a) { return e.type(a) === "array" }, isWindow: function (a) { return a && typeof a == "object" && "setInterval" in a }, isNumeric: function (a) { return !isNaN(parseFloat(a)) && isFinite(a) }, type: function (a) { return a == null ? String(a) : I[C.call(a)] || "object" }, isPlainObject: function (a) { if (!a || e.type(a) !== "object" || a.nodeType || e.isWindow(a)) return !1; try { if (a.constructor && !D.call(a, "constructor") && !D.call(a.constructor.prototype, "isPrototypeOf")) return !1 } catch (c) { return !1 } var d; for (d in a); return d === b || D.call(a, d) }, isEmptyObject: function (a) { for (var b in a) return !1; return !0 }, error: function (a) { throw new Error(a) }, parseJSON: function (b) { if (typeof b != "string" || !b) return null; b = e.trim(b); if (a.JSON && a.json_parse) return a.json_parse(b); if (n.test(b.replace(o, "@").replace(p, "]").replace(q, ""))) return (new Function("return " + b))(); e.error("Invalid JSON: " + b) }, parseXML: function (c) { var d, f; try { a.DOMParser ? (f = new DOMParser, d = f.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c)) } catch (g) { d = b } (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && e.error("Invalid XML: " + c); return d }, noop: function () { }, globalEval: function (b) { b && j.test(b) && (a.execScript || function (b) { a.eval.call(a, b) })(b) }, camelCase: function (a) { return a.replace(w, "ms-").replace(v, x) }, nodeName: function (a, b) { return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase() }, each: function (a, c, d) { var f, g = 0, h = a.length, i = h === b || e.isFunction(a); if (d) { if (i) { for (f in a) if (c.apply(a[f], d) === !1) break } else for (; g < h; ) if (c.apply(a[g++], d) === !1) break } else if (i) { for (f in a) if (c.call(a[f], f, a[f]) === !1) break } else for (; g < h; ) if (c.call(a[g], g, a[g++]) === !1) break; return a }, trim: G ? function (a) { return a == null ? "" : G.call(a) } : function (a) { return a == null ? "" : (a + "").replace(k, "").replace(l, "") }, makeArray: function (a, b) { var c = b || []; if (a != null) { var d = e.type(a); a.length == null || d === "string" || d === "function" || d === "regexp" || e.isWindow(a) ? E.call(c, a) : e.merge(c, a) } return c }, inArray: function (a, b, c) { var d; if (b) { if (H) return H.call(b, a, c); d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0; for (; c < d; c++) if (c in b && b[c] === a) return c } return -1 }, merge: function (a, c) { var d = a.length, e = 0; if (typeof c.length == "number") for (var f = c.length; e < f; e++) a[d++] = c[e]; else while (c[e] !== b) a[d++] = c[e++]; a.length = d; return a }, grep: function (a, b, c) { var d = [], e; c = !!c; for (var f = 0, g = a.length; f < g; f++) e = !!b(a[f], f), c !== e && d.push(a[f]); return d }, map: function (a, c, d) { var f, g, h = [], i = 0, j = a.length, k = a instanceof e || j !== b && typeof j == "number" && (j > 0 && a[0] && a[j - 1] || j === 0 || e.isArray(a)); if (k) for (; i < j; i++) f = c(a[i], i, d), f != null && (h[h.length] = f); else for (g in a) f = c(a[g], g, d), f != null && (h[h.length] = f); return h.concat.apply([], h) }, guid: 1, proxy: function (a, c) { if (typeof c == "string") { var d = a[c]; c = a, a = d } if (!e.isFunction(a)) return b; var f = F.call(arguments, 2), g = function () { return a.apply(c, f.concat(F.call(arguments))) }; g.guid = a.guid = a.guid || g.guid || e.guid++; return g }, access: function (a, c, d, f, g, h) { var i = a.length; if (typeof c == "object") { for (var j in c) e.access(a, j, c[j], f, g, d); return a } if (d !== b) { f = !h && f && e.isFunction(d); for (var k = 0; k < i; k++) g(a[k], c, f ? d.call(a[k], k, g(a[k], c)) : d, h); return a } return i ? g(a[0], c) : b }, now: function () { return (new Date).getTime() }, uaMatch: function (a) { a = a.toLowerCase(); var b = r.exec(a) || s.exec(a) || t.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || []; return { browser: b[1] || "", version: b[2] || "0"} }, sub: function () { function a(b, c) { return new a.fn.init(b, c) } e.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function (d, f) { f && f instanceof e && !(f instanceof a) && (f = a(f)); return e.fn.init.call(this, d, f, b) }, a.fn.init.prototype = a.fn; var b = a(c); return a }, browser: {} }), e.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (a, b) { I["[object " + b + "]"] = b.toLowerCase() }), z = e.uaMatch(y), z.browser && (e.browser[z.browser] = !0, e.browser.version = z.version), e.browser.webkit && (e.browser.safari = !0), j.test("�") && (k = /^[\s\xA0]+/, l = /[\s\xA0]+$/), h = e(c), c.addEventListener ? B = function () { c.removeEventListener("DOMContentLoaded", B, !1), e.ready() } : c.attachEvent && (B = function () { c.readyState === "complete" && (c.detachEvent("onreadystatechange", B), e.ready()) }); return e } (), g = {}; f.Callbacks = function (a) { a = a ? g[a] || h(a) : {}; var c = [], d = [], e, i, j, k, l, m = function (b) { var d, e, g, h, i; for (d = 0, e = b.length; d < e; d++) g = b[d], h = f.type(g), h === "array" ? m(g) : h === "function" && (!a.unique || !o.has(g)) && c.push(g) }, n = function (b, f) { f = f || [], e = !a.memory || [b, f], i = !0, l = j || 0, j = 0, k = c.length; for (; c && l < k; l++) if (c[l].apply(b, f) === !1 && a.stopOnFalse) { e = !0; break } i = !1, c && (a.once ? e === !0 ? o.disable() : c = [] : d && d.length && (e = d.shift(), o.fireWith(e[0], e[1]))) }, o = { add: function () { if (c) { var a = c.length; m(arguments), i ? k = c.length : e && e !== !0 && (j = a, n(e[0], e[1])) } return this }, remove: function () { if (c) { var b = arguments, d = 0, e = b.length; for (; d < e; d++) for (var f = 0; f < c.length; f++) if (b[d] === c[f]) { i && f <= k && (k--, f <= l && l--), c.splice(f--, 1); if (a.unique) break } } return this }, has: function (a) { if (c) { var b = 0, d = c.length; for (; b < d; b++) if (a === c[b]) return !0 } return !1 }, empty: function () { c = []; return this }, disable: function () { c = d = e = b; return this }, disabled: function () { return !c }, lock: function () { d = b, (!e || e === !0) && o.disable(); return this }, locked: function () { return !d }, fireWith: function (b, c) { d && (i ? a.once || d.push([b, c]) : (!a.once || !e) && n(b, c)); return this }, fire: function () { o.fireWith(this, arguments); return this }, fired: function () { return !!e } }; return o }; var i = [].slice; f.extend({ Deferred: function (a) { var b = f.Callbacks("once memory"), c = f.Callbacks("once memory"), d = f.Callbacks("memory"), e = "pending", g = { resolve: b, reject: c, notify: d }, h = { done: b.add, fail: c.add, progress: d.add, state: function () { return e }, isResolved: b.fired, isRejected: c.fired, then: function (a, b, c) { i.done(a).fail(b).progress(c); return this }, always: function () { i.done.apply(i, arguments).fail.apply(i, arguments); return this }, pipe: function (a, b, c) { return f.Deferred(function (d) { f.each({ done: [a, "resolve"], fail: [b, "reject"], progress: [c, "notify"] }, function (a, b) { var c = b[0], e = b[1], g; f.isFunction(c) ? i[a](function () { g = c.apply(this, arguments), g && f.isFunction(g.promise) ? g.promise().then(d.resolve, d.reject, d.notify) : d[e + "With"](this === i ? d : this, [g]) }) : i[a](d[e]) }) }).promise() }, promise: function (a) { if (a == null) a = h; else for (var b in h) a[b] = h[b]; return a } }, i = h.promise({}), j; for (j in g) i[j] = g[j].fire, i[j + "With"] = g[j].fireWith; i.done(function () { e = "resolved" }, c.disable, d.lock).fail(function () { e = "rejected" }, b.disable, d.lock), a && a.call(i, i); return i }, when: function (a) { function m(a) { return function (b) { e[a] = arguments.length > 1 ? i.call(arguments, 0) : b, j.notifyWith(k, e) } } function l(a) { return function (c) { b[a] = arguments.length > 1 ? i.call(arguments, 0) : c, --g || j.resolveWith(j, b) } } var b = i.call(arguments, 0), c = 0, d = b.length, e = Array(d), g = d, h = d, j = d <= 1 && a && f.isFunction(a.promise) ? a : f.Deferred(), k = j.promise(); if (d > 1) { for (; c < d; c++) b[c] && b[c].promise && f.isFunction(b[c].promise) ? b[c].promise().then(l(c), j.reject, m(c)) : --g; g || j.resolveWith(j, b) } else j !== a && j.resolveWith(j, d ? [a] : []); return k } }), f.support = function () { var b, d, e, g, h, i, j, k, l, m, n, o, p, q = c.createElement("div"), r = c.documentElement; q.setAttribute("className", "t"), q.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", d = q.getElementsByTagName("*"), e = q.getElementsByTagName("a")[0]; if (!d || !d.length || !e) return {}; g = c.createElement("select"), h = g.appendChild(c.createElement("option")), i = q.getElementsByTagName("input")[0], b = { leadingWhitespace: q.firstChild.nodeType === 3, tbody: !q.getElementsByTagName("tbody").length, htmlSerialize: !!q.getElementsByTagName("link").length, style: /top/.test(e.getAttribute("style")), hrefNormalized: e.getAttribute("href") === "/a", opacity: /^0.55/.test(e.style.opacity), cssFloat: !!e.style.cssFloat, checkOn: i.value === "on", optSelected: h.selected, getSetAttribute: q.className !== "t", enctype: !!c.createElement("form").enctype, html5Clone: c.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", submitBubbles: !0, changeBubbles: !0, focusinBubbles: !1, deleteExpando: !0, noCloneEvent: !0, inlineBlockNeedsLayout: !1, shrinkWrapBlocks: !1, reliableMarginRight: !0 }, i.checked = !0, b.noCloneChecked = i.cloneNode(!0).checked, g.disabled = !0, b.optDisabled = !h.disabled; try { delete q.test } catch (s) { b.deleteExpando = !1 } !q.addEventListener && q.attachEvent && q.fireEvent && (q.attachEvent("onclick", function () { b.noCloneEvent = !1 }), q.cloneNode(!0).fireEvent("onclick")), i = c.createElement("input"), i.value = "t", i.setAttribute("type", "radio"), b.radioValue = i.value === "t", i.setAttribute("checked", "checked"), q.appendChild(i), k = c.createDocumentFragment(), k.appendChild(q.lastChild), b.checkClone = k.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = i.checked, k.removeChild(i), k.appendChild(q), q.innerHTML = "", a.getComputedStyle && (j = c.createElement("div"), j.style.width = "0", j.style.marginRight = "0", q.style.width = "2px", q.appendChild(j), b.reliableMarginRight = (parseInt((a.getComputedStyle(j, null) || { marginRight: 0 }).marginRight, 10) || 0) === 0); if (q.attachEvent) for (o in { submit: 1, change: 1, focusin: 1 }) n = "on" + o, p = n in q, p || (q.setAttribute(n, "return;"), p = typeof q[n] == "function"), b[o + "Bubbles"] = p; k.removeChild(q), k = g = h = j = q = i = null, f(function () { var a, d, e, g, h, i, j, k, m, n, o, r = c.getElementsByTagName("body")[0]; !r || (j = 1, k = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;", m = "visibility:hidden;border:0;", n = "style='" + k + "border:5px solid #000;padding:0;'", o = "<div " + n + "><div></div></div>" + "<table " + n + " cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", a = c.createElement("div"), a.style.cssText = m + "width:0;height:0;position:static;top:0;margin-top:" + j + "px", r.insertBefore(a, r.firstChild), q = c.createElement("div"), a.appendChild(q), q.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>", l = q.getElementsByTagName("td"), p = l[0].offsetHeight === 0, l[0].style.display = "", l[1].style.display = "none", b.reliableHiddenOffsets = p && l[0].offsetHeight === 0, q.innerHTML = "", q.style.width = q.style.paddingLeft = "1px", f.boxModel = b.boxModel = q.offsetWidth === 2, typeof q.style.zoom != "undefined" && (q.style.display = "inline", q.style.zoom = 1, b.inlineBlockNeedsLayout = q.offsetWidth === 2, q.style.display = "", q.innerHTML = "<div style='width:4px;'></div>", b.shrinkWrapBlocks = q.offsetWidth !== 2), q.style.cssText = k + m, q.innerHTML = o, d = q.firstChild, e = d.firstChild, h = d.nextSibling.firstChild.firstChild, i = { doesNotAddBorder: e.offsetTop !== 5, doesAddBorderForTableAndCells: h.offsetTop === 5 }, e.style.position = "fixed", e.style.top = "20px", i.fixedPosition = e.offsetTop === 20 || e.offsetTop === 15, e.style.position = e.style.top = "", d.style.overflow = "hidden", d.style.position = "relative", i.subtractsBorderForOverflowNotVisible = e.offsetTop === -5, i.doesNotIncludeMarginInBodyOffset = r.offsetTop !== j, r.removeChild(a), q = a = null, f.extend(b, i)) }); return b } (); var j = /^(?:\{.*\}|\[.*\])$/, k = /([A-Z])/g; f.extend({ cache: {}, uuid: 0, expando: "jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""), noData: { embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet: !0 }, hasData: function (a) { a = a.nodeType ? f.cache[a[f.expando]] : a[f.expando]; return !!a && !m(a) }, data: function (a, c, d, e) { if (!!f.acceptData(a)) { var g, h, i, j = f.expando, k = typeof c == "string", l = a.nodeType, m = l ? f.cache : a, n = l ? a[j] : a[j] && j, o = c === "events"; if ((!n || !m[n] || !o && !e && !m[n].data) && k && d === b) return; n || (l ? a[j] = n = ++f.uuid : n = j), m[n] || (m[n] = {}, l || (m[n].toJSON = f.noop)); if (typeof c == "object" || typeof c == "function") e ? m[n] = f.extend(m[n], c) : m[n].data = f.extend(m[n].data, c); g = h = m[n], e || (h.data || (h.data = {}), h = h.data), d !== b && (h[f.camelCase(c)] = d); if (o && !h[c]) return g.events; k ? (i = h[c], i == null && (i = h[f.camelCase(c)])) : i = h; return i } }, removeData: function (a, b, c) { if (!!f.acceptData(a)) { var d, e, g, h = f.expando, i = a.nodeType, j = i ? f.cache : a, k = i ? a[h] : h; if (!j[k]) return; if (b) { d = c ? j[k] : j[k].data; if (d) { f.isArray(b) || (b in d ? b = [b] : (b = f.camelCase(b), b in d ? b = [b] : b = b.split(" "))); for (e = 0, g = b.length; e < g; e++) delete d[b[e]]; if (!(c ? m : f.isEmptyObject)(d)) return } } if (!c) { delete j[k].data; if (!m(j[k])) return } f.support.deleteExpando || !j.setInterval ? delete j[k] : j[k] = null, i && (f.support.deleteExpando ? delete a[h] : a.removeAttribute ? a.removeAttribute(h) : a[h] = null) } }, _data: function (a, b, c) { return f.data(a, b, c, !0) }, acceptData: function (a) { if (a.nodeName) { var b = f.noData[a.nodeName.toLowerCase()]; if (b) return b !== !0 && a.getAttribute("classid") === b } return !0 } }), f.fn.extend({ data: function (a, c) { var d, e, g, h = null; if (typeof a == "undefined") { if (this.length) { h = f.data(this[0]); if (this[0].nodeType === 1 && !f._data(this[0], "parsedAttrs")) { e = this[0].attributes; for (var i = 0, j = e.length; i < j; i++) g = e[i].name, g.indexOf("data-") === 0 && (g = f.camelCase(g.substring(5)), l(this[0], g, h[g])); f._data(this[0], "parsedAttrs", !0) } } return h } if (typeof a == "object") return this.each(function () { f.data(this, a) }); d = a.split("."), d[1] = d[1] ? "." + d[1] : ""; if (c === b) { h = this.triggerHandler("getData" + d[1] + "!", [d[0]]), h === b && this.length && (h = f.data(this[0], a), h = l(this[0], a, h)); return h === b && d[1] ? this.data(d[0]) : h } return this.each(function () { var b = f(this), e = [d[0], c]; b.triggerHandler("setData" + d[1] + "!", e), f.data(this, a, c), b.triggerHandler("changeData" + d[1] + "!", e) }) }, removeData: function (a) { return this.each(function () { f.removeData(this, a) }) } }), f.extend({ _mark: function (a, b) { a && (b = (b || "fx") + "mark", f._data(a, b, (f._data(a, b) || 0) + 1)) }, _unmark: function (a, b, c) { a !== !0 && (c = b, b = a, a = !1); if (b) { c = c || "fx"; var d = c + "mark", e = a ? 0 : (f._data(b, d) || 1) - 1; e ? f._data(b, d, e) : (f.removeData(b, d, !0), n(b, c, "mark")) } }, queue: function (a, b, c) { var d; if (a) { b = (b || "fx") + "queue", d = f._data(a, b), c && (!d || f.isArray(c) ? d = f._data(a, b, f.makeArray(c)) : d.push(c)); return d || [] } }, dequeue: function (a, b) { b = b || "fx"; var c = f.queue(a, b), d = c.shift(), e = {}; d === "inprogress" && (d = c.shift()), d && (b === "fx" && c.unshift("inprogress"), f._data(a, b + ".run", e), d.call(a, function () { f.dequeue(a, b) }, e)), c.length || (f.removeData(a, b + "queue " + b + ".run", !0), n(a, b, "queue")) } }), f.fn.extend({ queue: function (a, c) { typeof a != "string" && (c = a, a = "fx"); if (c === b) return f.queue(this[0], a); return this.each(function () { var b = f.queue(this, a, c); a === "fx" && b[0] !== "inprogress" && f.dequeue(this, a) }) }, dequeue: function (a) { return this.each(function () { f.dequeue(this, a) }) }, delay: function (a, b) { a = f.fx ? f.fx.speeds[a] || a : a, b = b || "fx"; return this.queue(b, function (b, c) { var d = setTimeout(b, a); c.stop = function () { clearTimeout(d) } }) }, clearQueue: function (a) { return this.queue(a || "fx", []) }, promise: function (a, c) { function m() { --h || d.resolveWith(e, [e]) } typeof a != "string" && (c = a, a = b), a = a || "fx"; var d = f.Deferred(), e = this, g = e.length, h = 1, i = a + "defer", j = a + "queue", k = a + "mark", l; while (g--) if (l = f.data(e[g], i, b, !0) || (f.data(e[g], j, b, !0) || f.data(e[g], k, b, !0)) && f.data(e[g], i, f.Callbacks("once memory"), !0)) h++, l.add(m); m(); return d.promise() } }); var o = /[\n\t\r]/g, p = /\s+/, q = /\r/g, r = /^(?:button|input)$/i, s = /^(?:button|input|object|select|textarea)$/i, t = /^a(?:rea)?$/i, u = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, v = f.support.getSetAttribute, w, x, y; f.fn.extend({ attr: function (a, b) { return f.access(this, a, b, !0, f.attr) }, removeAttr: function (a) { return this.each(function () { f.removeAttr(this, a) }) }, prop: function (a, b) { return f.access(this, a, b, !0, f.prop) }, removeProp: function (a) { a = f.propFix[a] || a; return this.each(function () { try { this[a] = b, delete this[a] } catch (c) { } }) }, addClass: function (a) { var b, c, d, e, g, h, i; if (f.isFunction(a)) return this.each(function (b) { f(this).addClass(a.call(this, b, this.className)) }); if (a && typeof a == "string") { b = a.split(p); for (c = 0, d = this.length; c < d; c++) { e = this[c]; if (e.nodeType === 1) if (!e.className && b.length === 1) e.className = a; else { g = " " + e.className + " "; for (h = 0, i = b.length; h < i; h++) ~g.indexOf(" " + b[h] + " ") || (g += b[h] + " "); e.className = f.trim(g) } } } return this }, removeClass: function (a) { var c, d, e, g, h, i, j; if (f.isFunction(a)) return this.each(function (b) { f(this).removeClass(a.call(this, b, this.className)) }); if (a && typeof a == "string" || a === b) { c = (a || "").split(p); for (d = 0, e = this.length; d < e; d++) { g = this[d]; if (g.nodeType === 1 && g.className) if (a) { h = (" " + g.className + " ").replace(o, " "); for (i = 0, j = c.length; i < j; i++) h = h.replace(" " + c[i] + " ", " "); g.className = f.trim(h) } else g.className = "" } } return this }, toggleClass: function (a, b) { var c = typeof a, d = typeof b == "boolean"; if (f.isFunction(a)) return this.each(function (c) { f(this).toggleClass(a.call(this, c, this.className, b), b) }); return this.each(function () { if (c === "string") { var e, g = 0, h = f(this), i = b, j = a.split(p); while (e = j[g++]) i = d ? i : !h.hasClass(e), h[i ? "addClass" : "removeClass"](e) } else if (c === "undefined" || c === "boolean") this.className && f._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : f._data(this, "__className__") || "" }) }, hasClass: function (a) { var b = " " + a + " ", c = 0, d = this.length; for (; c < d; c++) if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(o, " ").indexOf(b) > -1) return !0; return !1 }, val: function (a) { var c, d, e, g = this[0]; { if (!!arguments.length) { e = f.isFunction(a); return this.each(function (d) { var g = f(this), h; if (this.nodeType === 1) { e ? h = a.call(this, d, g.val()) : h = a, h == null ? h = "" : typeof h == "number" ? h += "" : f.isArray(h) && (h = f.map(h, function (a) { return a == null ? "" : a + "" })), c = f.valHooks[this.nodeName.toLowerCase()] || f.valHooks[this.type]; if (!c || !("set" in c) || c.set(this, h, "value") === b) this.value = h } }) } if (g) { c = f.valHooks[g.nodeName.toLowerCase()] || f.valHooks[g.type]; if (c && "get" in c && (d = c.get(g, "value")) !== b) return d; d = g.value; return typeof d == "string" ? d.replace(q, "") : d == null ? "" : d } } } }), f.extend({ valHooks: { option: { get: function (a) { var b = a.attributes.value; return !b || b.specified ? a.value : a.text } }, select: { get: function (a) { var b, c, d, e, g = a.selectedIndex, h = [], i = a.options, j = a.type === "select-one"; if (g < 0) return null; c = j ? g : 0, d = j ? g + 1 : i.length; for (; c < d; c++) { e = i[c]; if (e.selected && (f.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !f.nodeName(e.parentNode, "optgroup"))) { b = f(e).val(); if (j) return b; h.push(b) } } if (j && !h.length && i.length) return f(i[g]).val(); return h }, set: function (a, b) { var c = f.makeArray(b); f(a).find("option").each(function () { this.selected = f.inArray(f(this).val(), c) >= 0 }), c.length || (a.selectedIndex = -1); return c } } }, attrFn: { val: !0, css: !0, html: !0, text: !0, data: !0, width: !0, height: !0, offset: !0 }, attr: function (a, c, d, e) { var g, h, i, j = a.nodeType; if (!!a && j !== 3 && j !== 8 && j !== 2) { if (e && c in f.attrFn) return f(a)[c](d); if (typeof a.getAttribute == "undefined") return f.prop(a, c, d); i = j !== 1 || !f.isXMLDoc(a), i && (c = c.toLowerCase(), h = f.attrHooks[c] || (u.test(c) ? x : w)); if (d !== b) { if (d === null) { f.removeAttr(a, c); return } if (h && "set" in h && i && (g = h.set(a, d, c)) !== b) return g; a.setAttribute(c, "" + d); return d } if (h && "get" in h && i && (g = h.get(a, c)) !== null) return g; g = a.getAttribute(c); return g === null ? b : g } }, removeAttr: function (a, b) { var c, d, e, g, h = 0; if (b && a.nodeType === 1) { d = b.toLowerCase().split(p), g = d.length; for (; h < g; h++) e = d[h], e && (c = f.propFix[e] || e, f.attr(a, e, ""), a.removeAttribute(v ? e : c), u.test(e) && c in a && (a[c] = !1)) } }, attrHooks: { type: { set: function (a, b) { if (r.test(a.nodeName) && a.parentNode) f.error("type property can't be changed"); else if (!f.support.radioValue && b === "radio" && f.nodeName(a, "input")) { var c = a.value; a.setAttribute("type", b), c && (a.value = c); return b } } }, value: { get: function (a, b) { if (w && f.nodeName(a, "button")) return w.get(a, b); return b in a ? a.value : null }, set: function (a, b, c) { if (w && f.nodeName(a, "button")) return w.set(a, b, c); a.value = b } } }, propFix: { tabindex: "tabIndex", readonly: "readOnly", "for": "htmlFor", "class": "className", maxlength: "maxLength", cellspacing: "cellSpacing", cellpadding: "cellPadding", rowspan: "rowSpan", colspan: "colSpan", usemap: "useMap", frameborder: "frameBorder", contenteditable: "contentEditable" }, prop: function (a, c, d) { var e, g, h, i = a.nodeType; if (!!a && i !== 3 && i !== 8 && i !== 2) { h = i !== 1 || !f.isXMLDoc(a), h && (c = f.propFix[c] || c, g = f.propHooks[c]); return d !== b ? g && "set" in g && (e = g.set(a, d, c)) !== b ? e : a[c] = d : g && "get" in g && (e = g.get(a, c)) !== null ? e : a[c] } }, propHooks: { tabIndex: { get: function (a) { var c = a.getAttributeNode("tabindex"); return c && c.specified ? parseInt(c.value, 10) : s.test(a.nodeName) || t.test(a.nodeName) && a.href ? 0 : b } }} }), f.attrHooks.tabindex = f.propHooks.tabIndex, x = { get: function (a, c) { var d, e = f.prop(a, c); return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b }, set: function (a, b, c) { var d; b === !1 ? f.removeAttr(a, c) : (d = f.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase())); return c } }, v || (y = { name: !0, id: !0 }, w = f.valHooks.button = { get: function (a, c) { var d; d = a.getAttributeNode(c); return d && (y[c] ? d.nodeValue !== "" : d.specified) ? d.nodeValue : b }, set: function (a, b, d) { var e = a.getAttributeNode(d); e || (e = c.createAttribute(d), a.setAttributeNode(e)); return e.nodeValue = b + "" } }, f.attrHooks.tabindex.set = w.set, f.each(["width", "height"], function (a, b) { f.attrHooks[b] = f.extend(f.attrHooks[b], { set: function (a, c) { if (c === "") { a.setAttribute(b, "auto"); return c } } }) }), f.attrHooks.contenteditable = { get: w.get, set: function (a, b, c) { b === "" && (b = "false"), w.set(a, b, c) } }), f.support.hrefNormalized || f.each(["href", "src", "width", "height"], function (a, c) { f.attrHooks[c] = f.extend(f.attrHooks[c], { get: function (a) { var d = a.getAttribute(c, 2); return d === null ? b : d } }) }), f.support.style || (f.attrHooks.style = { get: function (a) { return a.style.cssText.toLowerCase() || b }, set: function (a, b) { return a.style.cssText = "" + b } }), f.support.optSelected || (f.propHooks.selected = f.extend(f.propHooks.selected, { get: function (a) { var b = a.parentNode; b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex); return null } })), f.support.enctype || (f.propFix.enctype = "encoding"), f.support.checkOn || f.each(["radio", "checkbox"], function () { f.valHooks[this] = { get: function (a) { return a.getAttribute("value") === null ? "on" : a.value } } }), f.each(["radio", "checkbox"], function () { f.valHooks[this] = f.extend(f.valHooks[this], { set: function (a, b) { if (f.isArray(b)) return a.checked = f.inArray(f(a).val(), b) >= 0 } }) }); var z = /^(?:textarea|input|select)$/i, A = /^([^\.]*)?(?:\.(.+))?$/, B = /\bhover(\.\S+)?\b/, C = /^key/, D = /^(?:mouse|contextmenu)|click/, E = /^(?:focusinfocus|focusoutblur)$/, F = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/, G = function (a) { var b = F.exec(a); b && (b[1] = (b[1] || "").toLowerCase(), b[3] = b[3] && new RegExp("(?:^|\\s)" + b[3] + "(?:\\s|$)")); return b }, H = function (a, b) { var c = a.attributes || {}; return (!b[1] || a.nodeName.toLowerCase() === b[1]) && (!b[2] || (c.id || {}).value === b[2]) && (!b[3] || b[3].test((c["class"] || {}).value)) }, I = function (a) { return f.event.special.hover ? a : a.replace(B, "mouseenter$1 mouseleave$1") };
    f.event = { add: function (a, c, d, e, g) { var h, i, j, k, l, m, n, o, p, q, r, s; if (!(a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(h = f._data(a)))) { d.handler && (p = d, d = p.handler), d.guid || (d.guid = f.guid++), j = h.events, j || (h.events = j = {}), i = h.handle, i || (h.handle = i = function (a) { return typeof f != "undefined" && (!a || f.event.triggered !== a.type) ? f.event.dispatch.apply(i.elem, arguments) : b }, i.elem = a), c = f.trim(I(c)).split(" "); for (k = 0; k < c.length; k++) { l = A.exec(c[k]) || [], m = l[1], n = (l[2] || "").split(".").sort(), s = f.event.special[m] || {}, m = (g ? s.delegateType : s.bindType) || m, s = f.event.special[m] || {}, o = f.extend({ type: m, origType: l[1], data: e, handler: d, guid: d.guid, selector: g, quick: G(g), namespace: n.join(".") }, p), r = j[m]; if (!r) { r = j[m] = [], r.delegateCount = 0; if (!s.setup || s.setup.call(a, e, n, i) === !1) a.addEventListener ? a.addEventListener(m, i, !1) : a.attachEvent && a.attachEvent("on" + m, i) } s.add && (s.add.call(a, o), o.handler.guid || (o.handler.guid = d.guid)), g ? r.splice(r.delegateCount++, 0, o) : r.push(o), f.event.global[m] = !0 } a = null } }, global: {}, remove: function (a, b, c, d, e) { var g = f.hasData(a) && f._data(a), h, i, j, k, l, m, n, o, p, q, r, s; if (!!g && !!(o = g.events)) { b = f.trim(I(b || "")).split(" "); for (h = 0; h < b.length; h++) { i = A.exec(b[h]) || [], j = k = i[1], l = i[2]; if (!j) { for (j in o) f.event.remove(a, j + b[h], c, d, !0); continue } p = f.event.special[j] || {}, j = (d ? p.delegateType : p.bindType) || j, r = o[j] || [], m = r.length, l = l ? new RegExp("(^|\\.)" + l.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null; for (n = 0; n < r.length; n++) s = r[n], (e || k === s.origType) && (!c || c.guid === s.guid) && (!l || l.test(s.namespace)) && (!d || d === s.selector || d === "**" && s.selector) && (r.splice(n--, 1), s.selector && r.delegateCount--, p.remove && p.remove.call(a, s)); r.length === 0 && m !== r.length && ((!p.teardown || p.teardown.call(a, l) === !1) && f.removeEvent(a, j, g.handle), delete o[j]) } f.isEmptyObject(o) && (q = g.handle, q && (q.elem = null), f.removeData(a, ["events", "handle"], !0)) } }, customEvent: { getData: !0, setData: !0, changeData: !0 }, trigger: function (c, d, e, g) { if (!e || e.nodeType !== 3 && e.nodeType !== 8) { var h = c.type || c, i = [], j, k, l, m, n, o, p, q, r, s; if (E.test(h + f.event.triggered)) return; h.indexOf("!") >= 0 && (h = h.slice(0, -1), k = !0), h.indexOf(".") >= 0 && (i = h.split("."), h = i.shift(), i.sort()); if ((!e || f.event.customEvent[h]) && !f.event.global[h]) return; c = typeof c == "object" ? c[f.expando] ? c : new f.Event(h, c) : new f.Event(h), c.type = h, c.isTrigger = !0, c.exclusive = k, c.namespace = i.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, o = h.indexOf(":") < 0 ? "on" + h : ""; if (!e) { j = f.cache; for (l in j) j[l].events && j[l].events[h] && f.event.trigger(c, d, j[l].handle.elem, !0); return } c.result = b, c.target || (c.target = e), d = d != null ? f.makeArray(d) : [], d.unshift(c), p = f.event.special[h] || {}; if (p.trigger && p.trigger.apply(e, d) === !1) return; r = [[e, p.bindType || h]]; if (!g && !p.noBubble && !f.isWindow(e)) { s = p.delegateType || h, m = E.test(s + h) ? e : e.parentNode, n = null; for (; m; m = m.parentNode) r.push([m, s]), n = m; n && n === e.ownerDocument && r.push([n.defaultView || n.parentWindow || a, s]) } for (l = 0; l < r.length && !c.isPropagationStopped(); l++) m = r[l][0], c.type = r[l][1], q = (f._data(m, "events") || {})[c.type] && f._data(m, "handle"), q && q.apply(m, d), q = o && m[o], q && f.acceptData(m) && q.apply(m, d) === !1 && c.preventDefault(); c.type = h, !g && !c.isDefaultPrevented() && (!p._default || p._default.apply(e.ownerDocument, d) === !1) && (h !== "click" || !f.nodeName(e, "a")) && f.acceptData(e) && o && e[h] && (h !== "focus" && h !== "blur" || c.target.offsetWidth !== 0) && !f.isWindow(e) && (n = e[o], n && (e[o] = null), f.event.triggered = h, e[h](), f.event.triggered = b, n && (e[o] = n)); return c.result } }, dispatch: function (c) { c = f.event.fix(c || a.event); var d = (f._data(this, "events") || {})[c.type] || [], e = d.delegateCount, g = [].slice.call(arguments, 0), h = !c.exclusive && !c.namespace, i = [], j, k, l, m, n, o, p, q, r, s, t; g[0] = c, c.delegateTarget = this; if (e && !c.target.disabled && (!c.button || c.type !== "click")) { m = f(this), m.context = this.ownerDocument || this; for (l = c.target; l != this; l = l.parentNode || this) { o = {}, q = [], m[0] = l; for (j = 0; j < e; j++) r = d[j], s = r.selector, o[s] === b && (o[s] = r.quick ? H(l, r.quick) : m.is(s)), o[s] && q.push(r); q.length && i.push({ elem: l, matches: q }) } } d.length > e && i.push({ elem: this, matches: d.slice(e) }); for (j = 0; j < i.length && !c.isPropagationStopped(); j++) { p = i[j], c.currentTarget = p.elem; for (k = 0; k < p.matches.length && !c.isImmediatePropagationStopped(); k++) { r = p.matches[k]; if (h || !c.namespace && !r.namespace || c.namespace_re && c.namespace_re.test(r.namespace)) c.data = r.data, c.handleObj = r, n = ((f.event.special[r.origType] || {}).handle || r.handler).apply(p.elem, g), n !== b && (c.result = n, n === !1 && (c.preventDefault(), c.stopPropagation())) } } return c.result }, props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks: {}, keyHooks: { props: "char charCode key keyCode".split(" "), filter: function (a, b) { a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode); return a } }, mouseHooks: { props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter: function (a, d) { var e, f, g, h = d.button, i = d.fromElement; a.pageX == null && d.clientX != null && (e = a.target.ownerDocument || c, f = e.documentElement, g = e.body, a.pageX = d.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = d.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? d.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0); return a } }, fix: function (a) { if (a[f.expando]) return a; var d, e, g = a, h = f.event.fixHooks[a.type] || {}, i = h.props ? this.props.concat(h.props) : this.props; a = f.Event(g); for (d = i.length; d; ) e = i[--d], a[e] = g[e]; a.target || (a.target = g.srcElement || c), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey === b && (a.metaKey = a.ctrlKey); return h.filter ? h.filter(a, g) : a }, special: { ready: { setup: f.bindReady }, load: { noBubble: !0 }, focus: { delegateType: "focusin" }, blur: { delegateType: "focusout" }, beforeunload: { setup: function (a, b, c) { f.isWindow(this) && (this.onbeforeunload = c) }, teardown: function (a, b) { this.onbeforeunload === b && (this.onbeforeunload = null) } } }, simulate: function (a, b, c, d) { var e = f.extend(new f.Event, c, { type: a, isSimulated: !0, originalEvent: {} }); d ? f.event.trigger(e, null, b) : f.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault() } }, f.event.handle = f.event.dispatch, f.removeEvent = c.removeEventListener ? function (a, b, c) { a.removeEventListener && a.removeEventListener(b, c, !1) } : function (a, b, c) { a.detachEvent && a.detachEvent("on" + b, c) }, f.Event = function (a, b) { if (!(this instanceof f.Event)) return new f.Event(a, b); a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? K : J) : this.type = a, b && f.extend(this, b), this.timeStamp = a && a.timeStamp || f.now(), this[f.expando] = !0 }, f.Event.prototype = { preventDefault: function () { this.isDefaultPrevented = K; var a = this.originalEvent; !a || (a.preventDefault ? a.preventDefault() : a.returnValue = !1) }, stopPropagation: function () { this.isPropagationStopped = K; var a = this.originalEvent; !a || (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0) }, stopImmediatePropagation: function () { this.isImmediatePropagationStopped = K, this.stopPropagation() }, isDefaultPrevented: J, isPropagationStopped: J, isImmediatePropagationStopped: J }, f.each({ mouseenter: "mouseover", mouseleave: "mouseout" }, function (a, b) { f.event.special[a] = { delegateType: b, bindType: b, handle: function (a) { var c = this, d = a.relatedTarget, e = a.handleObj, g = e.selector, h; if (!d || d !== c && !f.contains(c, d)) a.type = e.origType, h = e.handler.apply(this, arguments), a.type = b; return h } } }), f.support.submitBubbles || (f.event.special.submit = { setup: function () { if (f.nodeName(this, "form")) return !1; f.event.add(this, "click._submit keypress._submit", function (a) { var c = a.target, d = f.nodeName(c, "input") || f.nodeName(c, "button") ? c.form : b; d && !d._submit_attached && (f.event.add(d, "submit._submit", function (a) { this.parentNode && !a.isTrigger && f.event.simulate("submit", this.parentNode, a, !0) }), d._submit_attached = !0) }) }, teardown: function () { if (f.nodeName(this, "form")) return !1; f.event.remove(this, "._submit") } }), f.support.changeBubbles || (f.event.special.change = { setup: function () { if (z.test(this.nodeName)) { if (this.type === "checkbox" || this.type === "radio") f.event.add(this, "propertychange._change", function (a) { a.originalEvent.propertyName === "checked" && (this._just_changed = !0) }), f.event.add(this, "click._change", function (a) { this._just_changed && !a.isTrigger && (this._just_changed = !1, f.event.simulate("change", this, a, !0)) }); return !1 } f.event.add(this, "beforeactivate._change", function (a) { var b = a.target; z.test(b.nodeName) && !b._change_attached && (f.event.add(b, "change._change", function (a) { this.parentNode && !a.isSimulated && !a.isTrigger && f.event.simulate("change", this.parentNode, a, !0) }), b._change_attached = !0) }) }, handle: function (a) { var b = a.target; if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") return a.handleObj.handler.apply(this, arguments) }, teardown: function () { f.event.remove(this, "._change"); return z.test(this.nodeName) } }), f.support.focusinBubbles || f.each({ focus: "focusin", blur: "focusout" }, function (a, b) { var d = 0, e = function (a) { f.event.simulate(b, a.target, f.event.fix(a), !0) }; f.event.special[b] = { setup: function () { d++ === 0 && c.addEventListener(a, e, !0) }, teardown: function () { --d === 0 && c.removeEventListener(a, e, !0) } } }), f.fn.extend({ on: function (a, c, d, e, g) { var h, i; if (typeof a == "object") { typeof c != "string" && (d = c, c = b); for (i in a) this.on(i, c, d, a[i], g); return this } d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b)); if (e === !1) e = J; else if (!e) return this; g === 1 && (h = e, e = function (a) { f().off(a); return h.apply(this, arguments) }, e.guid = h.guid || (h.guid = f.guid++)); return this.each(function () { f.event.add(this, a, e, d, c) }) }, one: function (a, b, c, d) { return this.on.call(this, a, b, c, d, 1) }, off: function (a, c, d) { if (a && a.preventDefault && a.handleObj) { var e = a.handleObj; f(a.delegateTarget).off(e.namespace ? e.type + "." + e.namespace : e.type, e.selector, e.handler); return this } if (typeof a == "object") { for (var g in a) this.off(g, c, a[g]); return this } if (c === !1 || typeof c == "function") d = c, c = b; d === !1 && (d = J); return this.each(function () { f.event.remove(this, a, d, c) }) }, bind: function (a, b, c) { return this.on(a, null, b, c) }, unbind: function (a, b) { return this.off(a, null, b) }, live: function (a, b, c) { f(this.context).on(a, this.selector, b, c); return this }, die: function (a, b) { f(this.context).off(a, this.selector || "**", b); return this }, delegate: function (a, b, c, d) { return this.on(b, a, c, d) }, undelegate: function (a, b, c) { return arguments.length == 1 ? this.off(a, "**") : this.off(b, a, c) }, trigger: function (a, b) { return this.each(function () { f.event.trigger(a, b, this) }) }, triggerHandler: function (a, b) { if (this[0]) return f.event.trigger(a, b, this[0], !0) }, toggle: function (a) { var b = arguments, c = a.guid || f.guid++, d = 0, e = function (c) { var e = (f._data(this, "lastToggle" + a.guid) || 0) % d; f._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault(); return b[e].apply(this, arguments) || !1 }; e.guid = c; while (d < b.length) b[d++].guid = c; return this.click(e) }, hover: function (a, b) { return this.mouseenter(a).mouseleave(b || a) } }), f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) { f.fn[b] = function (a, c) { c == null && (c = a, a = null); return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b) }, f.attrFn && (f.attrFn[b] = !0), C.test(b) && (f.event.fixHooks[b] = f.event.keyHooks), D.test(b) && (f.event.fixHooks[b] = f.event.mouseHooks) }), function () { function x(a, b, c, e, f, g) { for (var h = 0, i = e.length; h < i; h++) { var j = e[h]; if (j) { var k = !1; j = j[a]; while (j) { if (j[d] === c) { k = e[j.sizset]; break } if (j.nodeType === 1) { g || (j[d] = c, j.sizset = h); if (typeof b != "string") { if (j === b) { k = !0; break } } else if (m.filter(b, [j]).length > 0) { k = j; break } } j = j[a] } e[h] = k } } } function w(a, b, c, e, f, g) { for (var h = 0, i = e.length; h < i; h++) { var j = e[h]; if (j) { var k = !1; j = j[a]; while (j) { if (j[d] === c) { k = e[j.sizset]; break } j.nodeType === 1 && !g && (j[d] = c, j.sizset = h); if (j.nodeName.toLowerCase() === b) { k = j; break } j = j[a] } e[h] = k } } } var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, d = "sizcache" + (Math.random() + "").replace(".", ""), e = 0, g = Object.prototype.toString, h = !1, i = !0, j = /\\/g, k = /\r\n/g, l = /\W/; [0, 0].sort(function () { i = !1; return 0 }); var m = function (b, d, e, f) { e = e || [], d = d || c; var h = d; if (d.nodeType !== 1 && d.nodeType !== 9) return []; if (!b || typeof b != "string") return e; var i, j, k, l, n, q, r, t, u = !0, v = m.isXML(d), w = [], x = b; do { a.exec(""), i = a.exec(x); if (i) { x = i[3], w.push(i[1]); if (i[2]) { l = i[3]; break } } } while (i); if (w.length > 1 && p.exec(b)) if (w.length === 2 && o.relative[w[0]]) j = y(w[0] + w[1], d, f); else { j = o.relative[w[0]] ? [d] : m(w.shift(), d); while (w.length) b = w.shift(), o.relative[b] && (b += w.shift()), j = y(b, j, f) } else { !f && w.length > 1 && d.nodeType === 9 && !v && o.match.ID.test(w[0]) && !o.match.ID.test(w[w.length - 1]) && (n = m.find(w.shift(), d, v), d = n.expr ? m.filter(n.expr, n.set)[0] : n.set[0]); if (d) { n = f ? { expr: w.pop(), set: s(f)} : m.find(w.pop(), w.length === 1 && (w[0] === "~" || w[0] === "+") && d.parentNode ? d.parentNode : d, v), j = n.expr ? m.filter(n.expr, n.set) : n.set, w.length > 0 ? k = s(j) : u = !1; while (w.length) q = w.pop(), r = q, o.relative[q] ? r = w.pop() : q = "", r == null && (r = d), o.relative[q](k, r, v) } else k = w = [] } k || (k = j), k || m.error(q || b); if (g.call(k) === "[object Array]") if (!u) e.push.apply(e, k); else if (d && d.nodeType === 1) for (t = 0; k[t] != null; t++) k[t] && (k[t] === !0 || k[t].nodeType === 1 && m.contains(d, k[t])) && e.push(j[t]); else for (t = 0; k[t] != null; t++) k[t] && k[t].nodeType === 1 && e.push(j[t]); else s(k, e); l && (m(l, h, e, f), m.uniqueSort(e)); return e }; m.uniqueSort = function (a) { if (u) { h = i, a.sort(u); if (h) for (var b = 1; b < a.length; b++) a[b] === a[b - 1] && a.splice(b--, 1) } return a }, m.matches = function (a, b) { return m(a, null, null, b) }, m.matchesSelector = function (a, b) { return m(b, null, null, [a]).length > 0 }, m.find = function (a, b, c) { var d, e, f, g, h, i; if (!a) return []; for (e = 0, f = o.order.length; e < f; e++) { h = o.order[e]; if (g = o.leftMatch[h].exec(a)) { i = g[1], g.splice(1, 1); if (i.substr(i.length - 1) !== "\\") { g[1] = (g[1] || "").replace(j, ""), d = o.find[h](g, b, c); if (d != null) { a = a.replace(o.match[h], ""); break } } } } d || (d = typeof b.getElementsByTagName != "undefined" ? b.getElementsByTagName("*") : []); return { set: d, expr: a} }, m.filter = function (a, c, d, e) { var f, g, h, i, j, k, l, n, p, q = a, r = [], s = c, t = c && c[0] && m.isXML(c[0]); while (a && c.length) { for (h in o.filter) if ((f = o.leftMatch[h].exec(a)) != null && f[2]) { k = o.filter[h], l = f[1], g = !1, f.splice(1, 1); if (l.substr(l.length - 1) === "\\") continue; s === r && (r = []); if (o.preFilter[h]) { f = o.preFilter[h](f, s, d, r, e, t); if (!f) g = i = !0; else if (f === !0) continue } if (f) for (n = 0; (j = s[n]) != null; n++) j && (i = k(j, f, n, s), p = e ^ i, d && i != null ? p ? g = !0 : s[n] = !1 : p && (r.push(j), g = !0)); if (i !== b) { d || (s = r), a = a.replace(o.match[h], ""); if (!g) return []; break } } if (a === q) if (g == null) m.error(a); else break; q = a } return s }, m.error = function (a) { throw new Error("Syntax error, unrecognized expression: " + a) }; var n = m.getText = function (a) { var b, c, d = a.nodeType, e = ""; if (d) { if (d === 1 || d === 9) { if (typeof a.textContent == "string") return a.textContent; if (typeof a.innerText == "string") return a.innerText.replace(k, ""); for (a = a.firstChild; a; a = a.nextSibling) e += n(a) } else if (d === 3 || d === 4) return a.nodeValue } else for (b = 0; c = a[b]; b++) c.nodeType !== 8 && (e += n(c)); return e }, o = m.selectors = { order: ["ID", "NAME", "TAG"], match: { ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/, ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/, TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/, CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/, POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/, PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/ }, leftMatch: {}, attrMap: { "class": "className", "for": "htmlFor" }, attrHandle: { href: function (a) { return a.getAttribute("href") }, type: function (a) { return a.getAttribute("type") } }, relative: { "+": function (a, b) { var c = typeof b == "string", d = c && !l.test(b), e = c && !d; d && (b = b.toLowerCase()); for (var f = 0, g = a.length, h; f < g; f++) if (h = a[f]) { while ((h = h.previousSibling) && h.nodeType !== 1); a[f] = e || h && h.nodeName.toLowerCase() === b ? h || !1 : h === b } e && m.filter(b, a, !0) }, ">": function (a, b) { var c, d = typeof b == "string", e = 0, f = a.length; if (d && !l.test(b)) { b = b.toLowerCase(); for (; e < f; e++) { c = a[e]; if (c) { var g = c.parentNode; a[e] = g.nodeName.toLowerCase() === b ? g : !1 } } } else { for (; e < f; e++) c = a[e], c && (a[e] = d ? c.parentNode : c.parentNode === b); d && m.filter(b, a, !0) } }, "": function (a, b, c) { var d, f = e++, g = x; typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("parentNode", b, f, a, d, c) }, "~": function (a, b, c) { var d, f = e++, g = x; typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("previousSibling", b, f, a, d, c) } }, find: { ID: function (a, b, c) { if (typeof b.getElementById != "undefined" && !c) { var d = b.getElementById(a[1]); return d && d.parentNode ? [d] : [] } }, NAME: function (a, b) { if (typeof b.getElementsByName != "undefined") { var c = [], d = b.getElementsByName(a[1]); for (var e = 0, f = d.length; e < f; e++) d[e].getAttribute("name") === a[1] && c.push(d[e]); return c.length === 0 ? null : c } }, TAG: function (a, b) { if (typeof b.getElementsByTagName != "undefined") return b.getElementsByTagName(a[1]) } }, preFilter: { CLASS: function (a, b, c, d, e, f) { a = " " + a[1].replace(j, "") + " "; if (f) return a; for (var g = 0, h; (h = b[g]) != null; g++) h && (e ^ (h.className && (" " + h.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1)); return !1 }, ID: function (a) { return a[1].replace(j, "") }, TAG: function (a, b) { return a[1].replace(j, "").toLowerCase() }, CHILD: function (a) { if (a[1] === "nth") { a[2] || m.error(a[0]), a[2] = a[2].replace(/^\+|\s*/g, ""); var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]); a[2] = b[1] + (b[2] || 1) - 0, a[3] = b[3] - 0 } else a[2] && m.error(a[0]); a[0] = e++; return a }, ATTR: function (a, b, c, d, e, f) { var g = a[1] = a[1].replace(j, ""); !f && o.attrMap[g] && (a[1] = o.attrMap[g]), a[4] = (a[4] || a[5] || "").replace(j, ""), a[2] === "~=" && (a[4] = " " + a[4] + " "); return a }, PSEUDO: function (b, c, d, e, f) { if (b[1] === "not") if ((a.exec(b[3]) || "").length > 1 || /^\w/.test(b[3])) b[3] = m(b[3], null, null, c); else { var g = m.filter(b[3], c, d, !0 ^ f); d || e.push.apply(e, g); return !1 } else if (o.match.POS.test(b[0]) || o.match.CHILD.test(b[0])) return !0; return b }, POS: function (a) { a.unshift(!0); return a } }, filters: { enabled: function (a) { return a.disabled === !1 && a.type !== "hidden" }, disabled: function (a) { return a.disabled === !0 }, checked: function (a) { return a.checked === !0 }, selected: function (a) { a.parentNode && a.parentNode.selectedIndex; return a.selected === !0 }, parent: function (a) { return !!a.firstChild }, empty: function (a) { return !a.firstChild }, has: function (a, b, c) { return !!m(c[3], a).length }, header: function (a) { return /h\d/i.test(a.nodeName) }, text: function (a) { var b = a.getAttribute("type"), c = a.type; return a.nodeName.toLowerCase() === "input" && "text" === c && (b === c || b === null) }, radio: function (a) { return a.nodeName.toLowerCase() === "input" && "radio" === a.type }, checkbox: function (a) { return a.nodeName.toLowerCase() === "input" && "checkbox" === a.type }, file: function (a) { return a.nodeName.toLowerCase() === "input" && "file" === a.type }, password: function (a) { return a.nodeName.toLowerCase() === "input" && "password" === a.type }, submit: function (a) { var b = a.nodeName.toLowerCase(); return (b === "input" || b === "button") && "submit" === a.type }, image: function (a) { return a.nodeName.toLowerCase() === "input" && "image" === a.type }, reset: function (a) { var b = a.nodeName.toLowerCase(); return (b === "input" || b === "button") && "reset" === a.type }, button: function (a) { var b = a.nodeName.toLowerCase(); return b === "input" && "button" === a.type || b === "button" }, input: function (a) { return /input|select|textarea|button/i.test(a.nodeName) }, focus: function (a) { return a === a.ownerDocument.activeElement } }, setFilters: { first: function (a, b) { return b === 0 }, last: function (a, b, c, d) { return b === d.length - 1 }, even: function (a, b) { return b % 2 === 0 }, odd: function (a, b) { return b % 2 === 1 }, lt: function (a, b, c) { return b < c[3] - 0 }, gt: function (a, b, c) { return b > c[3] - 0 }, nth: function (a, b, c) { return c[3] - 0 === b }, eq: function (a, b, c) { return c[3] - 0 === b } }, filter: { PSEUDO: function (a, b, c, d) { var e = b[1], f = o.filters[e]; if (f) return f(a, c, b, d); if (e === "contains") return (a.textContent || a.innerText || n([a]) || "").indexOf(b[3]) >= 0; if (e === "not") { var g = b[3]; for (var h = 0, i = g.length; h < i; h++) if (g[h] === a) return !1; return !0 } m.error(e) }, CHILD: function (a, b) { var c, e, f, g, h, i, j, k = b[1], l = a; switch (k) { case "only": case "first": while (l = l.previousSibling) if (l.nodeType === 1) return !1; if (k === "first") return !0; l = a; case "last": while (l = l.nextSibling) if (l.nodeType === 1) return !1; return !0; case "nth": c = b[2], e = b[3]; if (c === 1 && e === 0) return !0; f = b[0], g = a.parentNode; if (g && (g[d] !== f || !a.nodeIndex)) { i = 0; for (l = g.firstChild; l; l = l.nextSibling) l.nodeType === 1 && (l.nodeIndex = ++i); g[d] = f } j = a.nodeIndex - e; return c === 0 ? j === 0 : j % c === 0 && j / c >= 0 } }, ID: function (a, b) { return a.nodeType === 1 && a.getAttribute("id") === b }, TAG: function (a, b) { return b === "*" && a.nodeType === 1 || !!a.nodeName && a.nodeName.toLowerCase() === b }, CLASS: function (a, b) { return (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1 }, ATTR: function (a, b) { var c = b[1], d = m.attr ? m.attr(a, c) : o.attrHandle[c] ? o.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c), e = d + "", f = b[2], g = b[4]; return d == null ? f === "!=" : !f && m.attr ? d != null : f === "=" ? e === g : f === "*=" ? e.indexOf(g) >= 0 : f === "~=" ? (" " + e + " ").indexOf(g) >= 0 : g ? f === "!=" ? e !== g : f === "^=" ? e.indexOf(g) === 0 : f === "$=" ? e.substr(e.length - g.length) === g : f === "|=" ? e === g || e.substr(0, g.length + 1) === g + "-" : !1 : e && d !== !1 }, POS: function (a, b, c, d) { var e = b[2], f = o.setFilters[e]; if (f) return f(a, c, b, d) } } }, p = o.match.POS, q = function (a, b) { return "\\" + (b - 0 + 1) }; for (var r in o.match) o.match[r] = new RegExp(o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source), o.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q)); var s = function (a, b) { a = Array.prototype.slice.call(a, 0); if (b) { b.push.apply(b, a); return b } return a }; try { Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType } catch (t) { s = function (a, b) { var c = 0, d = b || []; if (g.call(a) === "[object Array]") Array.prototype.push.apply(d, a); else if (typeof a.length == "number") for (var e = a.length; c < e; c++) d.push(a[c]); else for (; a[c]; c++) d.push(a[c]); return d } } var u, v; c.documentElement.compareDocumentPosition ? u = function (a, b) { if (a === b) { h = !0; return 0 } if (!a.compareDocumentPosition || !b.compareDocumentPosition) return a.compareDocumentPosition ? -1 : 1; return a.compareDocumentPosition(b) & 4 ? -1 : 1 } : (u = function (a, b) { if (a === b) { h = !0; return 0 } if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex; var c, d, e = [], f = [], g = a.parentNode, i = b.parentNode, j = g; if (g === i) return v(a, b); if (!g) return -1; if (!i) return 1; while (j) e.unshift(j), j = j.parentNode; j = i; while (j) f.unshift(j), j = j.parentNode; c = e.length, d = f.length; for (var k = 0; k < c && k < d; k++) if (e[k] !== f[k]) return v(e[k], f[k]); return k === c ? v(a, f[k], -1) : v(e[k], b, 1) }, v = function (a, b, c) { if (a === b) return c; var d = a.nextSibling; while (d) { if (d === b) return -1; d = d.nextSibling } return 1 }), function () { var a = c.createElement("div"), d = "script" + (new Date).getTime(), e = c.documentElement; a.innerHTML = "<a name='" + d + "'/>", e.insertBefore(a, e.firstChild), c.getElementById(d) && (o.find.ID = function (a, c, d) { if (typeof c.getElementById != "undefined" && !d) { var e = c.getElementById(a[1]); return e ? e.id === a[1] || typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id").nodeValue === a[1] ? [e] : b : [] } }, o.filter.ID = function (a, b) { var c = typeof a.getAttributeNode != "undefined" && a.getAttributeNode("id"); return a.nodeType === 1 && c && c.nodeValue === b }), e.removeChild(a), e = a = null } (), function () { var a = c.createElement("div"); a.appendChild(c.createComment("")), a.getElementsByTagName("*").length > 0 && (o.find.TAG = function (a, b) { var c = b.getElementsByTagName(a[1]); if (a[1] === "*") { var d = []; for (var e = 0; c[e]; e++) c[e].nodeType === 1 && d.push(c[e]); c = d } return c }), a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute != "undefined" && a.firstChild.getAttribute("href") !== "#" && (o.attrHandle.href = function (a) { return a.getAttribute("href", 2) }), a = null } (), c.querySelectorAll && function () { var a = m, b = c.createElement("div"), d = "__sizzle__"; b.innerHTML = "<p class='TEST'></p>"; if (!b.querySelectorAll || b.querySelectorAll(".TEST").length !== 0) { m = function (b, e, f, g) { e = e || c; if (!g && !m.isXML(e)) { var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b); if (h && (e.nodeType === 1 || e.nodeType === 9)) { if (h[1]) return s(e.getElementsByTagName(b), f); if (h[2] && o.find.CLASS && e.getElementsByClassName) return s(e.getElementsByClassName(h[2]), f) } if (e.nodeType === 9) { if (b === "body" && e.body) return s([e.body], f); if (h && h[3]) { var i = e.getElementById(h[3]); if (!i || !i.parentNode) return s([], f); if (i.id === h[3]) return s([i], f) } try { return s(e.querySelectorAll(b), f) } catch (j) { } } else if (e.nodeType === 1 && e.nodeName.toLowerCase() !== "object") { var k = e, l = e.getAttribute("id"), n = l || d, p = e.parentNode, q = /^\s*[+~]/.test(b); l ? n = n.replace(/'/g, "\\$&") : e.setAttribute("id", n), q && p && (e = e.parentNode); try { if (!q || p) return s(e.querySelectorAll("[id='" + n + "'] " + b), f) } catch (r) { } finally { l || k.removeAttribute("id") } } } return a(b, e, f, g) }; for (var e in a) m[e] = a[e]; b = null } } (), function () { var a = c.documentElement, b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector; if (b) { var d = !b.call(c.createElement("div"), "div"), e = !1; try { b.call(c.documentElement, "[test!='']:sizzle") } catch (f) { e = !0 } m.matchesSelector = function (a, c) { c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']"); if (!m.isXML(a)) try { if (e || !o.match.PSEUDO.test(c) && !/!=/.test(c)) { var f = b.call(a, c); if (f || !d || a.document && a.document.nodeType !== 11) return f } } catch (g) { } return m(c, null, null, [a]).length > 0 } } } (), function () { var a = c.createElement("div"); a.innerHTML = "<div class='test e'></div><div class='test'></div>"; if (!!a.getElementsByClassName && a.getElementsByClassName("e").length !== 0) { a.lastChild.className = "e"; if (a.getElementsByClassName("e").length === 1) return; o.order.splice(1, 0, "CLASS"), o.find.CLASS = function (a, b, c) { if (typeof b.getElementsByClassName != "undefined" && !c) return b.getElementsByClassName(a[1]) }, a = null } } (), c.documentElement.contains ? m.contains = function (a, b) { return a !== b && (a.contains ? a.contains(b) : !0) } : c.documentElement.compareDocumentPosition ? m.contains = function (a, b) { return !!(a.compareDocumentPosition(b) & 16) } : m.contains = function () { return !1 }, m.isXML = function (a) { var b = (a ? a.ownerDocument || a : 0).documentElement; return b ? b.nodeName !== "HTML" : !1 }; var y = function (a, b, c) { var d, e = [], f = "", g = b.nodeType ? [b] : b; while (d = o.match.PSEUDO.exec(a)) f += d[0], a = a.replace(o.match.PSEUDO, ""); a = o.relative[a] ? a + "*" : a; for (var h = 0, i = g.length; h < i; h++) m(a, g[h], e, c); return m.filter(f, e) }; m.attr = f.attr, m.selectors.attrMap = {}, f.find = m, f.expr = m.selectors, f.expr[":"] = f.expr.filters, f.unique = m.uniqueSort, f.text = m.getText, f.isXMLDoc = m.isXML, f.contains = m.contains } (); var L = /Until$/, M = /^(?:parents|prevUntil|prevAll)/, N = /,/, O = /^.[^:#\[\.,]*$/, P = Array.prototype.slice, Q = f.expr.match.POS, R = { children: !0, contents: !0, next: !0, prev: !0 }; f.fn.extend({ find: function (a) { var b = this, c, d; if (typeof a != "string") return f(a).filter(function () { for (c = 0, d = b.length; c < d; c++) if (f.contains(b[c], this)) return !0 }); var e = this.pushStack("", "find", a), g, h, i; for (c = 0, d = this.length; c < d; c++) { g = e.length, f.find(a, this[c], e); if (c > 0) for (h = g; h < e.length; h++) for (i = 0; i < g; i++) if (e[i] === e[h]) { e.splice(h--, 1); break } } return e }, has: function (a) { var b = f(a); return this.filter(function () { for (var a = 0, c = b.length; a < c; a++) if (f.contains(this, b[a])) return !0 }) }, not: function (a) { return this.pushStack(T(this, a, !1), "not", a) }, filter: function (a) { return this.pushStack(T(this, a, !0), "filter", a) }, is: function (a) { return !!a && (typeof a == "string" ? Q.test(a) ? f(a, this.context).index(this[0]) >= 0 : f.filter(a, this).length > 0 : this.filter(a).length > 0) }, closest: function (a, b) { var c = [], d, e, g = this[0]; if (f.isArray(a)) { var h = 1; while (g && g.ownerDocument && g !== b) { for (d = 0; d < a.length; d++) f(g).is(a[d]) && c.push({ selector: a[d], elem: g, level: h }); g = g.parentNode, h++ } return c } var i = Q.test(a) || typeof a != "string" ? f(a, b || this.context) : 0; for (d = 0, e = this.length; d < e; d++) { g = this[d]; while (g) { if (i ? i.index(g) > -1 : f.find.matchesSelector(g, a)) { c.push(g); break } g = g.parentNode; if (!g || !g.ownerDocument || g === b || g.nodeType === 11) break } } c = c.length > 1 ? f.unique(c) : c; return this.pushStack(c, "closest", a) }, index: function (a) { if (!a) return this[0] && this[0].parentNode ? this.prevAll().length : -1; if (typeof a == "string") return f.inArray(this[0], f(a)); return f.inArray(a.jquery ? a[0] : a, this) }, add: function (a, b) { var c = typeof a == "string" ? f(a, b) : f.makeArray(a && a.nodeType ? [a] : a), d = f.merge(this.get(), c); return this.pushStack(S(c[0]) || S(d[0]) ? d : f.unique(d)) }, andSelf: function () { return this.add(this.prevObject) } }), f.each({ parent: function (a) { var b = a.parentNode; return b && b.nodeType !== 11 ? b : null }, parents: function (a) { return f.dir(a, "parentNode") }, parentsUntil: function (a, b, c) { return f.dir(a, "parentNode", c) }, next: function (a) { return f.nth(a, 2, "nextSibling") }, prev: function (a) { return f.nth(a, 2, "previousSibling") }, nextAll: function (a) { return f.dir(a, "nextSibling") }, prevAll: function (a) { return f.dir(a, "previousSibling") }, nextUntil: function (a, b, c) { return f.dir(a, "nextSibling", c) }, prevUntil: function (a, b, c) { return f.dir(a, "previousSibling", c) }, siblings: function (a) { return f.sibling(a.parentNode.firstChild, a) }, children: function (a) { return f.sibling(a.firstChild) }, contents: function (a) { return f.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : f.makeArray(a.childNodes) } }, function (a, b) { f.fn[a] = function (c, d) { var e = f.map(this, b, c); L.test(a) || (d = c), d && typeof d == "string" && (e = f.filter(d, e)), e = this.length > 1 && !R[a] ? f.unique(e) : e, (this.length > 1 || N.test(d)) && M.test(a) && (e = e.reverse()); return this.pushStack(e, a, P.call(arguments).join(",")) } }), f.extend({ filter: function (a, b, c) { c && (a = ":not(" + a + ")"); return b.length === 1 ? f.find.matchesSelector(b[0], a) ? [b[0]] : [] : f.find.matches(a, b) }, dir: function (a, c, d) { var e = [], g = a[c]; while (g && g.nodeType !== 9 && (d === b || g.nodeType !== 1 || !f(g).is(d))) g.nodeType === 1 && e.push(g), g = g[c]; return e }, nth: function (a, b, c, d) { b = b || 1; var e = 0; for (; a; a = a[c]) if (a.nodeType === 1 && ++e === b) break; return a }, sibling: function (a, b) { var c = []; for (; a; a = a.nextSibling) a.nodeType === 1 && a !== b && c.push(a); return c } }); var V = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", W = / jQuery\d+="(?:\d+|null)"/g, X = /^\s+/, Y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, Z = /<([\w:]+)/, $ = /<tbody/i, _ = /<|&#?\w+;/, ba = /<(?:script|style)/i, bb = /<(?:script|object|embed|option|style)/i, bc = new RegExp("<(?:" + V + ")", "i"), bd = /checked\s*(?:[^=]|=\s*.checked.)/i, be = /\/(java|ecma)script/i, bf = /^\s*<!(?:\[CDATA\[|\-\-)/, bg = { option: [1, "<select multiple='multiple'>", "</select>"], legend: [1, "<fieldset>", "</fieldset>"], thead: [1, "<table>", "</table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], area: [1, "<map>", "</map>"], _default: [0, "", ""] }, bh = U(c); bg.optgroup = bg.option, bg.tbody = bg.tfoot = bg.colgroup = bg.caption = bg.thead, bg.th = bg.td, f.support.htmlSerialize || (bg._default = [1, "div<div>", "</div>"]), f.fn.extend({ text: function (a) { if (f.isFunction(a)) return this.each(function (b) { var c = f(this); c.text(a.call(this, b, c.text())) }); if (typeof a != "object" && a !== b) return this.empty().append((this[0] && this[0].ownerDocument || c).createTextNode(a)); return f.text(this) }, wrapAll: function (a) { if (f.isFunction(a)) return this.each(function (b) { f(this).wrapAll(a.call(this, b)) }); if (this[0]) { var b = f(a, this[0].ownerDocument).eq(0).clone(!0); this[0].parentNode && b.insertBefore(this[0]), b.map(function () { var a = this; while (a.firstChild && a.firstChild.nodeType === 1) a = a.firstChild; return a }).append(this) } return this }, wrapInner: function (a) { if (f.isFunction(a)) return this.each(function (b) { f(this).wrapInner(a.call(this, b)) }); return this.each(function () { var b = f(this), c = b.contents(); c.length ? c.wrapAll(a) : b.append(a) }) }, wrap: function (a) { var b = f.isFunction(a); return this.each(function (c) { f(this).wrapAll(b ? a.call(this, c) : a) }) }, unwrap: function () { return this.parent().each(function () { f.nodeName(this, "body") || f(this).replaceWith(this.childNodes) }).end() }, append: function () { return this.domManip(arguments, !0, function (a) { this.nodeType === 1 && this.appendChild(a) }) }, prepend: function () { return this.domManip(arguments, !0, function (a) { this.nodeType === 1 && this.insertBefore(a, this.firstChild) }) }, before: function () { if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function (a) { this.parentNode.insertBefore(a, this) }); if (arguments.length) { var a = f.clean(arguments); a.push.apply(a, this.toArray()); return this.pushStack(a, "before", arguments) } }, after: function () { if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function (a) { this.parentNode.insertBefore(a, this.nextSibling) }); if (arguments.length) { var a = this.pushStack(this, "after", arguments); a.push.apply(a, f.clean(arguments)); return a } }, remove: function (a, b) { for (var c = 0, d; (d = this[c]) != null; c++) if (!a || f.filter(a, [d]).length) !b && d.nodeType === 1 && (f.cleanData(d.getElementsByTagName("*")), f.cleanData([d])), d.parentNode && d.parentNode.removeChild(d); return this }, empty: function ()
    { for (var a = 0, b; (b = this[a]) != null; a++) { b.nodeType === 1 && f.cleanData(b.getElementsByTagName("*")); while (b.firstChild) b.removeChild(b.firstChild) } return this }, clone: function (a, b) { a = a == null ? !1 : a, b = b == null ? a : b; return this.map(function () { return f.clone(this, a, b) }) }, html: function (a) { if (a === b) return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(W, "") : null; if (typeof a == "string" && !ba.test(a) && (f.support.leadingWhitespace || !X.test(a)) && !bg[(Z.exec(a) || ["", ""])[1].toLowerCase()]) { a = a.replace(Y, "<$1></$2>"); try { for (var c = 0, d = this.length; c < d; c++) this[c].nodeType === 1 && (f.cleanData(this[c].getElementsByTagName("*")), this[c].innerHTML = a) } catch (e) { this.empty().append(a) } } else f.isFunction(a) ? this.each(function (b) { var c = f(this); c.html(a.call(this, b, c.html())) }) : this.empty().append(a); return this }, replaceWith: function (a) { if (this[0] && this[0].parentNode) { if (f.isFunction(a)) return this.each(function (b) { var c = f(this), d = c.html(); c.replaceWith(a.call(this, b, d)) }); typeof a != "string" && (a = f(a).detach()); return this.each(function () { var b = this.nextSibling, c = this.parentNode; f(this).remove(), b ? f(b).before(a) : f(c).append(a) }) } return this.length ? this.pushStack(f(f.isFunction(a) ? a() : a), "replaceWith", a) : this }, detach: function (a) { return this.remove(a, !0) }, domManip: function (a, c, d) { var e, g, h, i, j = a[0], k = []; if (!f.support.checkClone && arguments.length === 3 && typeof j == "string" && bd.test(j)) return this.each(function () { f(this).domManip(a, c, d, !0) }); if (f.isFunction(j)) return this.each(function (e) { var g = f(this); a[0] = j.call(this, e, c ? g.html() : b), g.domManip(a, c, d) }); if (this[0]) { i = j && j.parentNode, f.support.parentNode && i && i.nodeType === 11 && i.childNodes.length === this.length ? e = { fragment: i} : e = f.buildFragment(a, this, k), h = e.fragment, h.childNodes.length === 1 ? g = h = h.firstChild : g = h.firstChild; if (g) { c = c && f.nodeName(g, "tr"); for (var l = 0, m = this.length, n = m - 1; l < m; l++) d.call(c ? bi(this[l], g) : this[l], e.cacheable || m > 1 && l < n ? f.clone(h, !0, !0) : h) } k.length && f.each(k, bp) } return this }
    }), f.buildFragment = function (a, b, d) { var e, g, h, i, j = a[0]; b && b[0] && (i = b[0].ownerDocument || b[0]), i.createDocumentFragment || (i = c), a.length === 1 && typeof j == "string" && j.length < 512 && i === c && j.charAt(0) === "<" && !bb.test(j) && (f.support.checkClone || !bd.test(j)) && (f.support.html5Clone || !bc.test(j)) && (g = !0, h = f.fragments[j], h && h !== 1 && (e = h)), e || (e = i.createDocumentFragment(), f.clean(a, i, e, d)), g && (f.fragments[j] = h ? e : 1); return { fragment: e, cacheable: g} }, f.fragments = {}, f.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (a, b) { f.fn[a] = function (c) { var d = [], e = f(c), g = this.length === 1 && this[0].parentNode; if (g && g.nodeType === 11 && g.childNodes.length === 1 && e.length === 1) { e[b](this[0]); return this } for (var h = 0, i = e.length; h < i; h++) { var j = (h > 0 ? this.clone(!0) : this).get(); f(e[h])[b](j), d = d.concat(j) } return this.pushStack(d, a, e.selector) } }), f.extend({ clone: function (a, b, c) { var d, e, g, h = f.support.html5Clone || !bc.test("<" + a.nodeName) ? a.cloneNode(!0) : bo(a); if ((!f.support.noCloneEvent || !f.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !f.isXMLDoc(a)) { bk(a, h), d = bl(a), e = bl(h); for (g = 0; d[g]; ++g) e[g] && bk(d[g], e[g]) } if (b) { bj(a, h); if (c) { d = bl(a), e = bl(h); for (g = 0; d[g]; ++g) bj(d[g], e[g]) } } d = e = null; return h }, clean: function (a, b, d, e) { var g; b = b || c, typeof b.createElement == "undefined" && (b = b.ownerDocument || b[0] && b[0].ownerDocument || c); var h = [], i; for (var j = 0, k; (k = a[j]) != null; j++) { typeof k == "number" && (k += ""); if (!k) continue; if (typeof k == "string") if (!_.test(k)) k = b.createTextNode(k); else { k = k.replace(Y, "<$1></$2>"); var l = (Z.exec(k) || ["", ""])[1].toLowerCase(), m = bg[l] || bg._default, n = m[0], o = b.createElement("div"); b === c ? bh.appendChild(o) : U(b).appendChild(o), o.innerHTML = m[1] + k + m[2]; while (n--) o = o.lastChild; if (!f.support.tbody) { var p = $.test(k), q = l === "table" && !p ? o.firstChild && o.firstChild.childNodes : m[1] === "<table>" && !p ? o.childNodes : []; for (i = q.length - 1; i >= 0; --i) f.nodeName(q[i], "tbody") && !q[i].childNodes.length && q[i].parentNode.removeChild(q[i]) } !f.support.leadingWhitespace && X.test(k) && o.insertBefore(b.createTextNode(X.exec(k)[0]), o.firstChild), k = o.childNodes } var r; if (!f.support.appendChecked) if (k[0] && typeof (r = k.length) == "number") for (i = 0; i < r; i++) bn(k[i]); else bn(k); k.nodeType ? h.push(k) : h = f.merge(h, k) } if (d) { g = function (a) { return !a.type || be.test(a.type) }; for (j = 0; h[j]; j++) if (e && f.nodeName(h[j], "script") && (!h[j].type || h[j].type.toLowerCase() === "text/javascript")) e.push(h[j].parentNode ? h[j].parentNode.removeChild(h[j]) : h[j]); else { if (h[j].nodeType === 1) { var s = f.grep(h[j].getElementsByTagName("script"), g); h.splice.apply(h, [j + 1, 0].concat(s)) } d.appendChild(h[j]) } } return h }, cleanData: function (a) { var b, c, d = f.cache, e = f.event.special, g = f.support.deleteExpando; for (var h = 0, i; (i = a[h]) != null; h++) { if (i.nodeName && f.noData[i.nodeName.toLowerCase()]) continue; c = i[f.expando]; if (c) { b = d[c]; if (b && b.events) { for (var j in b.events) e[j] ? f.event.remove(i, j) : f.removeEvent(i, j, b.handle); b.handle && (b.handle.elem = null) } g ? delete i[f.expando] : i.removeAttribute && i.removeAttribute(f.expando), delete d[c] } } } }); var bq = /alpha\([^)]*\)/i, br = /opacity=([^)]*)/, bs = /([A-Z]|^ms)/g, bt = /^-?\d+(?:px)?$/i, bu = /^-?\d/, bv = /^([\-+])=([\-+.\de]+)/, bw = { position: "absolute", visibility: "hidden", display: "block" }, bx = ["Left", "Right"], by = ["Top", "Bottom"], bz, bA, bB; f.fn.css = function (a, c) { if (arguments.length === 2 && c === b) return this; return f.access(this, a, c, !0, function (a, c, d) { return d !== b ? f.style(a, c, d) : f.css(a, c) }) }, f.extend({ cssHooks: { opacity: { get: function (a, b) { if (b) { var c = bz(a, "opacity", "opacity"); return c === "" ? "1" : c } return a.style.opacity } } }, cssNumber: { fillOpacity: !0, fontWeight: !0, lineHeight: !0, opacity: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 }, cssProps: { "float": f.support.cssFloat ? "cssFloat" : "styleFloat" }, style: function (a, c, d, e) { if (!!a && a.nodeType !== 3 && a.nodeType !== 8 && !!a.style) { var g, h, i = f.camelCase(c), j = a.style, k = f.cssHooks[i]; c = f.cssProps[i] || i; if (d === b) { if (k && "get" in k && (g = k.get(a, !1, e)) !== b) return g; return j[c] } h = typeof d, h === "string" && (g = bv.exec(d)) && (d = +(g[1] + 1) * +g[2] + parseFloat(f.css(a, c)), h = "number"); if (d == null || h === "number" && isNaN(d)) return; h === "number" && !f.cssNumber[i] && (d += "px"); if (!k || !("set" in k) || (d = k.set(a, d)) !== b) try { j[c] = d } catch (l) { } } }, css: function (a, c, d) { var e, g; c = f.camelCase(c), g = f.cssHooks[c], c = f.cssProps[c] || c, c === "cssFloat" && (c = "float"); if (g && "get" in g && (e = g.get(a, !0, d)) !== b) return e; if (bz) return bz(a, c) }, swap: function (a, b, c) { var d = {}; for (var e in b) d[e] = a.style[e], a.style[e] = b[e]; c.call(a); for (e in b) a.style[e] = d[e] } }), f.curCSS = f.css, f.each(["height", "width"], function (a, b) { f.cssHooks[b] = { get: function (a, c, d) { var e; if (c) { if (a.offsetWidth !== 0) return bC(a, b, d); f.swap(a, bw, function () { e = bC(a, b, d) }); return e } }, set: function (a, b) { if (!bt.test(b)) return b; b = parseFloat(b); if (b >= 0) return b + "px" } } }), f.support.opacity || (f.cssHooks.opacity = { get: function (a, b) { return br.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : "" }, set: function (a, b) { var c = a.style, d = a.currentStyle, e = f.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "", g = d && d.filter || c.filter || ""; c.zoom = 1; if (b >= 1 && f.trim(g.replace(bq, "")) === "") { c.removeAttribute("filter"); if (d && !d.filter) return } c.filter = bq.test(g) ? g.replace(bq, e) : g + " " + e } }), f(function () { f.support.reliableMarginRight || (f.cssHooks.marginRight = { get: function (a, b) { var c; f.swap(a, { display: "inline-block" }, function () { b ? c = bz(a, "margin-right", "marginRight") : c = a.style.marginRight }); return c } }) }), c.defaultView && c.defaultView.getComputedStyle && (bA = function (a, b) { var c, d, e; b = b.replace(bs, "-$1").toLowerCase(), (d = a.ownerDocument.defaultView) && (e = d.getComputedStyle(a, null)) && (c = e.getPropertyValue(b), c === "" && !f.contains(a.ownerDocument.documentElement, a) && (c = f.style(a, b))); return c }), c.documentElement.currentStyle && (bB = function (a, b) { var c, d, e, f = a.currentStyle && a.currentStyle[b], g = a.style; f === null && g && (e = g[b]) && (f = e), !bt.test(f) && bu.test(f) && (c = g.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), g.left = b === "fontSize" ? "1em" : f || 0, f = g.pixelLeft + "px", g.left = c, d && (a.runtimeStyle.left = d)); return f === "" ? "auto" : f }), bz = bA || bB, f.expr && f.expr.filters && (f.expr.filters.hidden = function (a) { var b = a.offsetWidth, c = a.offsetHeight; return b === 0 && c === 0 || !f.support.reliableHiddenOffsets && (a.style && a.style.display || f.css(a, "display")) === "none" }, f.expr.filters.visible = function (a) { return !f.expr.filters.hidden(a) }); var bD = /%20/g, bE = /\[\]$/, bF = /\r?\n/g, bG = /#.*$/, bH = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, bI = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, bJ = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, bK = /^(?:GET|HEAD)$/, bL = /^\/\//, bM = /\?/, bN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, bO = /^(?:select|textarea)/i, bP = /\s+/, bQ = /([?&])_=[^&]*/, bR = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/, bS = f.fn.load, bT = {}, bU = {}, bV, bW, bX = ["*/"] + ["*"]; try { bV = e.href } catch (bY) { bV = c.createElement("a"), bV.href = "", bV = bV.href } bW = bR.exec(bV.toLowerCase()) || [], f.fn.extend({ load: function (a, c, d) { if (typeof a != "string" && bS) return bS.apply(this, arguments); if (!this.length) return this; var e = a.indexOf(" "); if (e >= 0) { var g = a.slice(e, a.length); a = a.slice(0, e) } var h = "GET"; c && (f.isFunction(c) ? (d = c, c = b) : typeof c == "object" && (c = f.param(c, f.ajaxSettings.traditional), h = "POST")); var i = this; f.ajax({ url: a, type: h, dataType: "html", data: c, complete: function (a, b, c) { c = a.responseText, a.isResolved() && (a.done(function (a) { c = a }), i.html(g ? f("<div>").append(c.replace(bN, "")).find(g) : c)), d && i.each(d, [c, b, a]) } }); return this }, serialize: function () { return f.param(this.serializeArray()) }, serializeArray: function () { return this.map(function () { return this.elements ? f.makeArray(this.elements) : this }).filter(function () { return this.name && !this.disabled && (this.checked || bO.test(this.nodeName) || bI.test(this.type)) }).map(function (a, b) { var c = f(this).val(); return c == null ? null : f.isArray(c) ? f.map(c, function (a, c) { return { name: b.name, value: a.replace(bF, "\r\n")} }) : { name: b.name, value: c.replace(bF, "\r\n")} }).get() } }), f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (a, b) { f.fn[b] = function (a) { return this.on(b, a) } }), f.each(["get", "post"], function (a, c) { f[c] = function (a, d, e, g) { f.isFunction(d) && (g = g || e, e = d, d = b); return f.ajax({ type: c, url: a, data: d, success: e, dataType: g }) } }), f.extend({ getScript: function (a, c) { return f.get(a, b, c, "script") }, getJSON: function (a, b, c) { return f.get(a, b, c, "json") }, ajaxSetup: function (a, b) { b ? b_(a, f.ajaxSettings) : (b = a, a = f.ajaxSettings), b_(a, b); return a }, ajaxSettings: { url: bV, isLocal: bJ.test(bW[1]), global: !0, type: "GET", contentType: "application/x-www-form-urlencoded", processData: !0, async: !0, accepts: { xml: "application/xml, text/xml", html: "text/html", text: "text/plain", json: "application/json, text/javascript", "*": bX }, contents: { xml: /xml/, html: /html/, json: /json/ }, responseFields: { xml: "responseXML", text: "responseText" }, converters: { "* text": a.String, "text html": !0, "text json": f.parseJSON, "text xml": f.parseXML }, flatOptions: { context: !0, url: !0} }, ajaxPrefilter: bZ(bT), ajaxTransport: bZ(bU), ajax: function (a, c) { function w(a, c, l, m) { if (s !== 2) { s = 2, q && clearTimeout(q), p = b, n = m || "", v.readyState = a > 0 ? 4 : 0; var o, r, u, w = c, x = l ? cb(d, v, l) : b, y, z; if (a >= 200 && a < 300 || a === 304) { if (d.ifModified) { if (y = v.getResponseHeader("Last-Modified")) f.lastModified[k] = y; if (z = v.getResponseHeader("Etag")) f.etag[k] = z } if (a === 304) w = "notmodified", o = !0; else try { r = cc(d, x), w = "success", o = !0 } catch (A) { w = "parsererror", u = A } } else { u = w; if (!w || a) w = "error", a < 0 && (a = 0) } v.status = a, v.statusText = "" + (c || w), o ? h.resolveWith(e, [r, w, v]) : h.rejectWith(e, [v, w, u]), v.statusCode(j), j = b, t && g.trigger("ajax" + (o ? "Success" : "Error"), [v, d, o ? r : u]), i.fireWith(e, [v, w]), t && (g.trigger("ajaxComplete", [v, d]), --f.active || f.event.trigger("ajaxStop")) } } typeof a == "object" && (c = a, a = b), c = c || {}; var d = f.ajaxSetup({}, c), e = d.context || d, g = e !== d && (e.nodeType || e instanceof f) ? f(e) : f.event, h = f.Deferred(), i = f.Callbacks("once memory"), j = d.statusCode || {}, k, l = {}, m = {}, n, o, p, q, r, s = 0, t, u, v = { readyState: 0, setRequestHeader: function (a, b) { if (!s) { var c = a.toLowerCase(); a = m[c] = m[c] || a, l[a] = b } return this }, getAllResponseHeaders: function () { return s === 2 ? n : null }, getResponseHeader: function (a) { var c; if (s === 2) { if (!o) { o = {}; while (c = bH.exec(n)) o[c[1].toLowerCase()] = c[2] } c = o[a.toLowerCase()] } return c === b ? null : c }, overrideMimeType: function (a) { s || (d.mimeType = a); return this }, abort: function (a) { a = a || "abort", p && p.abort(a), w(0, a); return this } }; h.promise(v), v.success = v.done, v.error = v.fail, v.complete = i.add, v.statusCode = function (a) { if (a) { var b; if (s < 2) for (b in a) j[b] = [j[b], a[b]]; else b = a[v.status], v.then(b, b) } return this }, d.url = ((a || d.url) + "").replace(bG, "").replace(bL, bW[1] + "//"), d.dataTypes = f.trim(d.dataType || "*").toLowerCase().split(bP), d.crossDomain == null && (r = bR.exec(d.url.toLowerCase()), d.crossDomain = !(!r || r[1] == bW[1] && r[2] == bW[2] && (r[3] || (r[1] === "http:" ? 80 : 443)) == (bW[3] || (bW[1] === "http:" ? 80 : 443)))), d.data && d.processData && typeof d.data != "string" && (d.data = f.param(d.data, d.traditional)), b$(bT, d, c, v); if (s === 2) return !1; t = d.global, d.type = d.type.toUpperCase(), d.hasContent = !bK.test(d.type), t && f.active++ === 0 && f.event.trigger("ajaxStart"); if (!d.hasContent) { d.data && (d.url += (bM.test(d.url) ? "&" : "?") + d.data, delete d.data), k = d.url; if (d.cache === !1) { var x = f.now(), y = d.url.replace(bQ, "$1_=" + x); d.url = y + (y === d.url ? (bM.test(d.url) ? "&" : "?") + "_=" + x : "") } } (d.data && d.hasContent && d.contentType !== !1 || c.contentType) && v.setRequestHeader("Content-Type", d.contentType), d.ifModified && (k = k || d.url, f.lastModified[k] && v.setRequestHeader("If-Modified-Since", f.lastModified[k]), f.etag[k] && v.setRequestHeader("If-None-Match", f.etag[k])), v.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + (d.dataTypes[0] !== "*" ? ", " + bX + "; q=0.01" : "") : d.accepts["*"]); for (u in d.headers) v.setRequestHeader(u, d.headers[u]); if (d.beforeSend && (d.beforeSend.call(e, v, d) === !1 || s === 2)) { v.abort(); return !1 } for (u in { success: 1, error: 1, complete: 1 }) v[u](d[u]); p = b$(bU, d, c, v); if (!p) w(-1, "No Transport"); else { v.readyState = 1, t && g.trigger("ajaxSend", [v, d]), d.async && d.timeout > 0 && (q = setTimeout(function () { v.abort("timeout") }, d.timeout)); try { s = 1, p.send(l, w) } catch (z) { if (s < 2) w(-1, z); else throw z } } return v }, param: function (a, c) { var d = [], e = function (a, b) { b = f.isFunction(b) ? b() : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b) }; c === b && (c = f.ajaxSettings.traditional); if (f.isArray(a) || a.jquery && !f.isPlainObject(a)) f.each(a, function () { e(this.name, this.value) }); else for (var g in a) ca(g, a[g], c, e); return d.join("&").replace(bD, "+") } }), f.extend({ active: 0, lastModified: {}, etag: {} }); var cd = f.now(), ce = /(\=)\?(&|$)|\?\?/i; f.ajaxSetup({ jsonp: "callback", jsonpCallback: function () { return f.expando + "_" + cd++ } }), f.ajaxPrefilter("json jsonp", function (b, c, d) { var e = b.contentType === "application/x-www-form-urlencoded" && typeof b.data == "string"; if (b.dataTypes[0] === "jsonp" || b.jsonp !== !1 && (ce.test(b.url) || e && ce.test(b.data))) { var g, h = b.jsonpCallback = f.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, i = a[h], j = b.url, k = b.data, l = "$1" + h + "$2"; b.jsonp !== !1 && (j = j.replace(ce, l), b.url === j && (e && (k = k.replace(ce, l)), b.data === k && (j += (/\?/.test(j) ? "&" : "?") + b.jsonp + "=" + h))), b.url = j, b.data = k, a[h] = function (a) { g = [a] }, d.always(function () { a[h] = i, g && f.isFunction(i) && a[h](g[0]) }), b.converters["script json"] = function () { g || f.error(h + " was not called"); return g[0] }, b.dataTypes[0] = "json"; return "script" } }), f.ajaxSetup({ accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" }, contents: { script: /javascript|ecmascript/ }, converters: { "text script": function (a) { f.globalEval(a); return a } } }), f.ajaxPrefilter("script", function (a) { a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1) }), f.ajaxTransport("script", function (a) { if (a.crossDomain) { var d, e = c.head || c.getElementsByTagName("head")[0] || c.documentElement; return { send: function (f, g) { d = c.createElement("script"), d.async = "async", a.scriptCharset && (d.charset = a.scriptCharset), d.src = a.url, d.onload = d.onreadystatechange = function (a, c) { if (c || !d.readyState || /loaded|complete/.test(d.readyState)) d.onload = d.onreadystatechange = null, e && d.parentNode && e.removeChild(d), d = b, c || g(200, "success") }, e.insertBefore(d, e.firstChild) }, abort: function () { d && d.onload(0, 1) } } } }); var cf = a.ActiveXObject ? function () { for (var a in ch) ch[a](0, 1) } : !1, cg = 0, ch; f.ajaxSettings.xhr = a.ActiveXObject ? function () { return !this.isLocal && ci() || cj() } : ci, function (a) { f.extend(f.support, { ajax: !!a, cors: !!a && "withCredentials" in a }) } (f.ajaxSettings.xhr()), f.support.ajax && f.ajaxTransport(function (c) { if (!c.crossDomain || f.support.cors) { var d; return { send: function (e, g) { var h = c.xhr(), i, j; c.username ? h.open(c.type, c.url, c.async, c.username, c.password) : h.open(c.type, c.url, c.async); if (c.xhrFields) for (j in c.xhrFields) h[j] = c.xhrFields[j]; c.mimeType && h.overrideMimeType && h.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest"); try { for (j in e) h.setRequestHeader(j, e[j]) } catch (k) { } h.send(c.hasContent && c.data || null), d = function (a, e) { var j, k, l, m, n; try { if (d && (e || h.readyState === 4)) { d = b, i && (h.onreadystatechange = f.noop, cf && delete ch[i]); if (e) h.readyState !== 4 && h.abort(); else { j = h.status, l = h.getAllResponseHeaders(), m = {}, n = h.responseXML, n && n.documentElement && (m.xml = n), m.text = h.responseText; try { k = h.statusText } catch (o) { k = "" } !j && c.isLocal && !c.crossDomain ? j = m.text ? 200 : 404 : j === 1223 && (j = 204) } } } catch (p) { e || g(-1, p) } m && g(j, k, m, l) }, !c.async || h.readyState === 4 ? d() : (i = ++cg, cf && (ch || (ch = {}, f(a).unload(cf)), ch[i] = d), h.onreadystatechange = d) }, abort: function () { d && d(0, 1) } } } }); var ck = {}, cl, cm, cn = /^(?:toggle|show|hide)$/, co = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, cp, cq = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"], ["opacity"]], cr; f.fn.extend({ show: function (a, b, c) { var d, e; if (a || a === 0) return this.animate(cu("show", 3), a, b, c); for (var g = 0, h = this.length; g < h; g++) d = this[g], d.style && (e = d.style.display, !f._data(d, "olddisplay") && e === "none" && (e = d.style.display = ""), e === "" && f.css(d, "display") === "none" && f._data(d, "olddisplay", cv(d.nodeName))); for (g = 0; g < h; g++) { d = this[g]; if (d.style) { e = d.style.display; if (e === "" || e === "none") d.style.display = f._data(d, "olddisplay") || "" } } return this }, hide: function (a, b, c) { if (a || a === 0) return this.animate(cu("hide", 3), a, b, c); var d, e, g = 0, h = this.length; for (; g < h; g++) d = this[g], d.style && (e = f.css(d, "display"), e !== "none" && !f._data(d, "olddisplay") && f._data(d, "olddisplay", e)); for (g = 0; g < h; g++) this[g].style && (this[g].style.display = "none"); return this }, _toggle: f.fn.toggle, toggle: function (a, b, c) { var d = typeof a == "boolean"; f.isFunction(a) && f.isFunction(b) ? this._toggle.apply(this, arguments) : a == null || d ? this.each(function () { var b = d ? a : f(this).is(":hidden"); f(this)[b ? "show" : "hide"]() }) : this.animate(cu("toggle", 3), a, b, c); return this }, fadeTo: function (a, b, c, d) { return this.filter(":hidden").css("opacity", 0).show().end().animate({ opacity: b }, a, c, d) }, animate: function (a, b, c, d) { function g() { e.queue === !1 && f._mark(this); var b = f.extend({}, e), c = this.nodeType === 1, d = c && f(this).is(":hidden"), g, h, i, j, k, l, m, n, o; b.animatedProperties = {}; for (i in a) { g = f.camelCase(i), i !== g && (a[g] = a[i], delete a[i]), h = a[g], f.isArray(h) ? (b.animatedProperties[g] = h[1], h = a[g] = h[0]) : b.animatedProperties[g] = b.specialEasing && b.specialEasing[g] || b.easing || "swing"; if (h === "hide" && d || h === "show" && !d) return b.complete.call(this); c && (g === "height" || g === "width") && (b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], f.css(this, "display") === "inline" && f.css(this, "float") === "none" && (!f.support.inlineBlockNeedsLayout || cv(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1)) } b.overflow != null && (this.style.overflow = "hidden"); for (i in a) j = new f.fx(this, b, i), h = a[i], cn.test(h) ? (o = f._data(this, "toggle" + i) || (h === "toggle" ? d ? "show" : "hide" : 0), o ? (f._data(this, "toggle" + i, o === "show" ? "hide" : "show"), j[o]()) : j[h]()) : (k = co.exec(h), l = j.cur(), k ? (m = parseFloat(k[2]), n = k[3] || (f.cssNumber[i] ? "" : "px"), n !== "px" && (f.style(this, i, (m || 1) + n), l = (m || 1) / j.cur() * l, f.style(this, i, l + n)), k[1] && (m = (k[1] === "-=" ? -1 : 1) * m + l), j.custom(l, m, n)) : j.custom(l, h, "")); return !0 } var e = f.speed(b, c, d); if (f.isEmptyObject(a)) return this.each(e.complete, [!1]); a = f.extend({}, a); return e.queue === !1 ? this.each(g) : this.queue(e.queue, g) }, stop: function (a, c, d) { typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []); return this.each(function () { function h(a, b, c) { var e = b[c]; f.removeData(a, c, !0), e.stop(d) } var b, c = !1, e = f.timers, g = f._data(this); d || f._unmark(!0, this); if (a == null) for (b in g) g[b] && g[b].stop && b.indexOf(".run") === b.length - 4 && h(this, g, b); else g[b = a + ".run"] && g[b].stop && h(this, g, b); for (b = e.length; b--; ) e[b].elem === this && (a == null || e[b].queue === a) && (d ? e[b](!0) : e[b].saveState(), c = !0, e.splice(b, 1)); (!d || !c) && f.dequeue(this, a) }) } }), f.each({ slideDown: cu("show", 1), slideUp: cu("hide", 1), slideToggle: cu("toggle", 1), fadeIn: { opacity: "show" }, fadeOut: { opacity: "hide" }, fadeToggle: { opacity: "toggle"} }, function (a, b) { f.fn[a] = function (a, c, d) { return this.animate(b, a, c, d) } }), f.extend({ speed: function (a, b, c) { var d = a && typeof a == "object" ? f.extend({}, a) : { complete: c || !c && b || f.isFunction(a) && a, duration: a, easing: c && b || b && !f.isFunction(b) && b }; d.duration = f.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in f.fx.speeds ? f.fx.speeds[d.duration] : f.fx.speeds._default; if (d.queue == null || d.queue === !0) d.queue = "fx"; d.old = d.complete, d.complete = function (a) { f.isFunction(d.old) && d.old.call(this), d.queue ? f.dequeue(this, d.queue) : a !== !1 && f._unmark(this) }; return d }, easing: { linear: function (a, b, c, d) { return c + d * a }, swing: function (a, b, c, d) { return (-Math.cos(a * Math.PI) / 2 + .5) * d + c } }, timers: [], fx: function (a, b, c) { this.options = b, this.elem = a, this.prop = c, b.orig = b.orig || {} } }), f.fx.prototype = { update: function () { this.options.step && this.options.step.call(this.elem, this.now, this), (f.fx.step[this.prop] || f.fx.step._default)(this) }, cur: function () { if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) return this.elem[this.prop]; var a, b = f.css(this.elem, this.prop); return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b : a }, custom: function (a, c, d) { function h(a) { return e.step(a) } var e = this, g = f.fx; this.startTime = cr || cs(), this.end = c, this.now = this.start = a, this.pos = this.state = 0, this.unit = d || this.unit || (f.cssNumber[this.prop] ? "" : "px"), h.queue = this.options.queue, h.elem = this.elem, h.saveState = function () { e.options.hide && f._data(e.elem, "fxshow" + e.prop) === b && f._data(e.elem, "fxshow" + e.prop, e.start) }, h() && f.timers.push(h) && !cp && (cp = setInterval(g.tick, g.interval)) }, show: function () { var a = f._data(this.elem, "fxshow" + this.prop); this.options.orig[this.prop] = a || f.style(this.elem, this.prop), this.options.show = !0, a !== b ? this.custom(this.cur(), a) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), f(this.elem).show() }, hide: function () { this.options.orig[this.prop] = f._data(this.elem, "fxshow" + this.prop) || f.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0) }, step: function (a) { var b, c, d, e = cr || cs(), g = !0, h = this.elem, i = this.options; if (a || e >= i.duration + this.startTime) { this.now = this.end, this.pos = this.state = 1, this.update(), i.animatedProperties[this.prop] = !0; for (b in i.animatedProperties) i.animatedProperties[b] !== !0 && (g = !1); if (g) { i.overflow != null && !f.support.shrinkWrapBlocks && f.each(["", "X", "Y"], function (a, b) { h.style["overflow" + b] = i.overflow[a] }), i.hide && f(h).hide(); if (i.hide || i.show) for (b in i.animatedProperties) f.style(h, b, i.orig[b]), f.removeData(h, "fxshow" + b, !0), f.removeData(h, "toggle" + b, !0); d = i.complete, d && (i.complete = !1, d.call(h)) } return !1 } i.duration == Infinity ? this.now = e : (c = e - this.startTime, this.state = c / i.duration, this.pos = f.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update(); return !0 } }, f.extend(f.fx, { tick: function () { var a, b = f.timers, c = 0; for (; c < b.length; c++) a = b[c], !a() && b[c] === a && b.splice(c--, 1); b.length || f.fx.stop() }, interval: 13, stop: function () { clearInterval(cp), cp = null }, speeds: { slow: 600, fast: 200, _default: 400 }, step: { opacity: function (a) { f.style(a.elem, "opacity", a.now) }, _default: function (a) { a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now } } }), f.each(["width", "height"], function (a, b) { f.fx.step[b] = function (a) { f.style(a.elem, b, Math.max(0, a.now) + a.unit) } }), f.expr && f.expr.filters && (f.expr.filters.animated = function (a) { return f.grep(f.timers, function (b) { return a === b.elem }).length }); var cw = /^t(?:able|d|h)$/i, cx = /^(?:body|html)$/i; "getBoundingClientRect" in c.documentElement ? f.fn.offset = function (a) { var b = this[0], c; if (a) return this.each(function (b) { f.offset.setOffset(this, a, b) }); if (!b || !b.ownerDocument) return null; if (b === b.ownerDocument.body) return f.offset.bodyOffset(b); try { c = b.getBoundingClientRect() } catch (d) { } var e = b.ownerDocument, g = e.documentElement; if (!c || !f.contains(g, b)) return c ? { top: c.top, left: c.left} : { top: 0, left: 0 }; var h = e.body, i = cy(e), j = g.clientTop || h.clientTop || 0, k = g.clientLeft || h.clientLeft || 0, l = i.pageYOffset || f.support.boxModel && g.scrollTop || h.scrollTop, m = i.pageXOffset || f.support.boxModel && g.scrollLeft || h.scrollLeft, n = c.top + l - j, o = c.left + m - k; return { top: n, left: o} } : f.fn.offset = function (a) { var b = this[0]; if (a) return this.each(function (b) { f.offset.setOffset(this, a, b) }); if (!b || !b.ownerDocument) return null; if (b === b.ownerDocument.body) return f.offset.bodyOffset(b); var c, d = b.offsetParent, e = b, g = b.ownerDocument, h = g.documentElement, i = g.body, j = g.defaultView, k = j ? j.getComputedStyle(b, null) : b.currentStyle, l = b.offsetTop, m = b.offsetLeft; while ((b = b.parentNode) && b !== i && b !== h) { if (f.support.fixedPosition && k.position === "fixed") break; c = j ? j.getComputedStyle(b, null) : b.currentStyle, l -= b.scrollTop, m -= b.scrollLeft, b === d && (l += b.offsetTop, m += b.offsetLeft, f.support.doesNotAddBorder && (!f.support.doesAddBorderForTableAndCells || !cw.test(b.nodeName)) && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 0), e = d, d = b.offsetParent), f.support.subtractsBorderForOverflowNotVisible && c.overflow !== "visible" && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 0), k = c } if (k.position === "relative" || k.position === "static") l += i.offsetTop, m += i.offsetLeft; f.support.fixedPosition && k.position === "fixed" && (l += Math.max(h.scrollTop, i.scrollTop), m += Math.max(h.scrollLeft, i.scrollLeft)); return { top: l, left: m} }, f.offset = { bodyOffset: function (a) { var b = a.offsetTop, c = a.offsetLeft; f.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(f.css(a, "marginTop")) || 0, c += parseFloat(f.css(a, "marginLeft")) || 0); return { top: b, left: c} }, setOffset: function (a, b, c) { var d = f.css(a, "position"); d === "static" && (a.style.position = "relative"); var e = f(a), g = e.offset(), h = f.css(a, "top"), i = f.css(a, "left"), j = (d === "absolute" || d === "fixed") && f.inArray("auto", [h, i]) > -1, k = {}, l = {}, m, n; j ? (l = e.position(), m = l.top, n = l.left) : (m = parseFloat(h) || 0, n = parseFloat(i) || 0), f.isFunction(b) && (b = b.call(a, c, g)), b.top != null && (k.top = b.top - g.top + m), b.left != null && (k.left = b.left - g.left + n), "using" in b ? b.using.call(a, k) : e.css(k) } }, f.fn.extend({ position: function () { if (!this[0]) return null; var a = this[0], b = this.offsetParent(), c = this.offset(), d = cx.test(b[0].nodeName) ? { top: 0, left: 0} : b.offset(); c.top -= parseFloat(f.css(a, "marginTop")) || 0, c.left -= parseFloat(f.css(a, "marginLeft")) || 0, d.top += parseFloat(f.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(f.css(b[0], "borderLeftWidth")) || 0; return { top: c.top - d.top, left: c.left - d.left} }, offsetParent: function () { return this.map(function () { var a = this.offsetParent || c.body; while (a && !cx.test(a.nodeName) && f.css(a, "position") === "static") a = a.offsetParent; return a }) } }), f.each(["Left", "Top"], function (a, c) { var d = "scroll" + c; f.fn[d] = function (c) { var e, g; if (c === b) { e = this[0]; if (!e) return null; g = cy(e); return g ? "pageXOffset" in g ? g[a ? "pageYOffset" : "pageXOffset"] : f.support.boxModel && g.document.documentElement[d] || g.document.body[d] : e[d] } return this.each(function () { g = cy(this), g ? g.scrollTo(a ? f(g).scrollLeft() : c, a ? c : f(g).scrollTop()) : this[d] = c }) } }), f.each(["Height", "Width"], function (a, c) { var d = c.toLowerCase(); f.fn["inner" + c] = function () { var a = this[0]; return a ? a.style ? parseFloat(f.css(a, d, "padding")) : this[d]() : null }, f.fn["outer" + c] = function (a) { var b = this[0]; return b ? b.style ? parseFloat(f.css(b, d, a ? "margin" : "border")) : this[d]() : null }, f.fn[d] = function (a) { var e = this[0]; if (!e) return a == null ? null : this; if (f.isFunction(a)) return this.each(function (b) { var c = f(this); c[d](a.call(this, b, c[d]())) }); if (f.isWindow(e)) { var g = e.document.documentElement["client" + c], h = e.document.body; return e.document.compatMode === "CSS1Compat" && g || h && h["client" + c] || g } if (e.nodeType === 9) return Math.max(e.documentElement["client" + c], e.body["scroll" + c], e.documentElement["scroll" + c], e.body["offset" + c], e.documentElement["offset" + c]); if (a === b) { var i = f.css(e, d), j = parseFloat(i); return f.isNumeric(j) ? j : i } return this.css(d, typeof a == "string" ? a : a + "px") } }), a.jQuery = a.$ = f, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function () { return f })
})(window);

/*!
* jQuery UI 1.8.18
*
* Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* http://docs.jquery.com/UI
*/
(function (a, b) { function d(b) { return !a(b).parents().andSelf().filter(function () { return a.curCSS(this, "visibility") === "hidden" || a.expr.filters.hidden(this) }).length } function c(b, c) { var e = b.nodeName.toLowerCase(); if ("area" === e) { var f = b.parentNode, g = f.name, h; if (!b.href || !g || f.nodeName.toLowerCase() !== "map") return !1; h = a("img[usemap=#" + g + "]")[0]; return !!h && d(h) } return (/input|select|textarea|button|object/.test(e) ? !b.disabled : "a" == e ? b.href || c : c) && d(b) } a.ui = a.ui || {}; a.ui.version || (a.extend(a.ui, { version: "1.8.18", keyCode: { ALT: 18, BACKSPACE: 8, CAPS_LOCK: 20, COMMA: 188, COMMAND: 91, COMMAND_LEFT: 91, COMMAND_RIGHT: 93, CONTROL: 17, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, INSERT: 45, LEFT: 37, MENU: 93, NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108, NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38, WINDOWS: 91} }), a.fn.extend({ propAttr: a.fn.prop || a.fn.attr, _focus: a.fn.focus, focus: function (b, c) { return typeof b == "number" ? this.each(function () { var d = this; setTimeout(function () { a(d).focus(), c && c.call(d) }, b) }) : this._focus.apply(this, arguments) }, scrollParent: function () { var b; a.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? b = this.parents().filter(function () { return /(relative|absolute|fixed)/.test(a.curCSS(this, "position", 1)) && /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1)) }).eq(0) : b = this.parents().filter(function () { return /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1)) }).eq(0); return /fixed/.test(this.css("position")) || !b.length ? a(document) : b }, zIndex: function (c) { if (c !== b) return this.css("zIndex", c); if (this.length) { var d = a(this[0]), e, f; while (d.length && d[0] !== document) { e = d.css("position"); if (e === "absolute" || e === "relative" || e === "fixed") { f = parseInt(d.css("zIndex"), 10); if (!isNaN(f) && f !== 0) return f } d = d.parent() } } return 0 }, disableSelection: function () { return this.bind((a.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (a) { a.preventDefault() }) }, enableSelection: function () { return this.unbind(".ui-disableSelection") } }), a.each(["Width", "Height"], function (c, d) { function h(b, c, d, f) { a.each(e, function () { c -= parseFloat(a.curCSS(b, "padding" + this, !0)) || 0, d && (c -= parseFloat(a.curCSS(b, "border" + this + "Width", !0)) || 0), f && (c -= parseFloat(a.curCSS(b, "margin" + this, !0)) || 0) }); return c } var e = d === "Width" ? ["Left", "Right"] : ["Top", "Bottom"], f = d.toLowerCase(), g = { innerWidth: a.fn.innerWidth, innerHeight: a.fn.innerHeight, outerWidth: a.fn.outerWidth, outerHeight: a.fn.outerHeight }; a.fn["inner" + d] = function (c) { if (c === b) return g["inner" + d].call(this); return this.each(function () { a(this).css(f, h(this, c) + "px") }) }, a.fn["outer" + d] = function (b, c) { if (typeof b != "number") return g["outer" + d].call(this, b); return this.each(function () { a(this).css(f, h(this, b, !0, c) + "px") }) } }), a.extend(a.expr[":"], { data: function (b, c, d) { return !!a.data(b, d[3]) }, focusable: function (b) { return c(b, !isNaN(a.attr(b, "tabindex"))) }, tabbable: function (b) { var d = a.attr(b, "tabindex"), e = isNaN(d); return (e || d >= 0) && c(b, !e) } }), a(function () { var b = document.body, c = b.appendChild(c = document.createElement("div")); c.offsetHeight, a.extend(c.style, { minHeight: "100px", height: "auto", padding: 0, borderWidth: 0 }), a.support.minHeight = c.offsetHeight === 100, a.support.selectstart = "onselectstart" in c, b.removeChild(c).style.display = "none" }), a.extend(a.ui, { plugin: { add: function (b, c, d) { var e = a.ui[b].prototype; for (var f in d) e.plugins[f] = e.plugins[f] || [], e.plugins[f].push([c, d[f]]) }, call: function (a, b, c) { var d = a.plugins[b]; if (!!d && !!a.element[0].parentNode) for (var e = 0; e < d.length; e++) a.options[d[e][0]] && d[e][1].apply(a.element, c) } }, contains: function (a, b) { return document.compareDocumentPosition ? a.compareDocumentPosition(b) & 16 : a !== b && a.contains(b) }, hasScroll: function (b, c) { if (a(b).css("overflow") === "hidden") return !1; var d = c && c === "left" ? "scrollLeft" : "scrollTop", e = !1; if (b[d] > 0) return !0; b[d] = 1, e = b[d] > 0, b[d] = 0; return e }, isOverAxis: function (a, b, c) { return a > b && a < b + c }, isOver: function (b, c, d, e, f, g) { return a.ui.isOverAxis(b, d, f) && a.ui.isOverAxis(c, e, g) } })) })(jQuery); /*!
 * jQuery UI Widget 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function (a, b) { if (a.cleanData) { var c = a.cleanData; a.cleanData = function (b) { for (var d = 0, e; (e = b[d]) != null; d++) try { a(e).triggerHandler("remove") } catch (f) { } c(b) } } else { var d = a.fn.remove; a.fn.remove = function (b, c) { return this.each(function () { c || (!b || a.filter(b, [this]).length) && a("*", this).add([this]).each(function () { try { a(this).triggerHandler("remove") } catch (b) { } }); return d.call(a(this), b, c) }) } } a.widget = function (b, c, d) { var e = b.split(".")[0], f; b = b.split(".")[1], f = e + "-" + b, d || (d = c, c = a.Widget), a.expr[":"][f] = function (c) { return !!a.data(c, b) }, a[e] = a[e] || {}, a[e][b] = function (a, b) { arguments.length && this._createWidget(a, b) }; var g = new c; g.options = a.extend(!0, {}, g.options), a[e][b].prototype = a.extend(!0, g, { namespace: e, widgetName: b, widgetEventPrefix: a[e][b].prototype.widgetEventPrefix || b, widgetBaseClass: f }, d), a.widget.bridge(b, a[e][b]) }, a.widget.bridge = function (c, d) { a.fn[c] = function (e) { var f = typeof e == "string", g = Array.prototype.slice.call(arguments, 1), h = this; e = !f && g.length ? a.extend.apply(null, [!0, e].concat(g)) : e; if (f && e.charAt(0) === "_") return h; f ? this.each(function () { var d = a.data(this, c), f = d && a.isFunction(d[e]) ? d[e].apply(d, g) : d; if (f !== d && f !== b) { h = f; return !1 } }) : this.each(function () { var b = a.data(this, c); b ? b.option(e || {})._init() : a.data(this, c, new d(e, this)) }); return h } }, a.Widget = function (a, b) { arguments.length && this._createWidget(a, b) }, a.Widget.prototype = { widgetName: "widget", widgetEventPrefix: "", options: { disabled: !1 }, _createWidget: function (b, c) { a.data(c, this.widgetName, this), this.element = a(c), this.options = a.extend(!0, {}, this.options, this._getCreateOptions(), b); var d = this; this.element.bind("remove." + this.widgetName, function () { d.destroy() }), this._create(), this._trigger("create"), this._init() }, _getCreateOptions: function () { return a.metadata && a.metadata.get(this.element[0])[this.widgetName] }, _create: function () { }, _init: function () { }, destroy: function () { this.element.unbind("." + this.widgetName).removeData(this.widgetName), this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled " + "ui-state-disabled") }, widget: function () { return this.element }, option: function (c, d) { var e = c; if (arguments.length === 0) return a.extend({}, this.options); if (typeof c == "string") { if (d === b) return this.options[c]; e = {}, e[c] = d } this._setOptions(e); return this }, _setOptions: function (b) { var c = this; a.each(b, function (a, b) { c._setOption(a, b) }); return this }, _setOption: function (a, b) { this.options[a] = b, a === "disabled" && this.widget()[b ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled" + " " + "ui-state-disabled").attr("aria-disabled", b); return this }, enable: function () { return this._setOption("disabled", !1) }, disable: function () { return this._setOption("disabled", !0) }, _trigger: function (b, c, d) { var e, f, g = this.options[b]; d = d || {}, c = a.Event(c), c.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase(), c.target = this.element[0], f = c.originalEvent; if (f) for (e in f) e in c || (c[e] = f[e]); this.element.trigger(c, d); return !(a.isFunction(g) && g.call(this.element[0], c, d) === !1 || c.isDefaultPrevented()) } } })(jQuery); /*!
* jQuery UI Mouse 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function (a, b) { var c = !1; a(document).mouseup(function (a) { c = !1 }), a.widget("ui.mouse", { options: { cancel: ":input,option", distance: 1, delay: 0 }, _mouseInit: function () { var b = this; this.element.bind("mousedown." + this.widgetName, function (a) { return b._mouseDown(a) }).bind("click." + this.widgetName, function (c) { if (!0 === a.data(c.target, b.widgetName + ".preventClickEvent")) { a.removeData(c.target, b.widgetName + ".preventClickEvent"), c.stopImmediatePropagation(); return !1 } }), this.started = !1 }, _mouseDestroy: function () { this.element.unbind("." + this.widgetName) }, _mouseDown: function (b) { if (!c) { this._mouseStarted && this._mouseUp(b), this._mouseDownEvent = b; var d = this, e = b.which == 1, f = typeof this.options.cancel == "string" && b.target.nodeName ? a(b.target).closest(this.options.cancel).length : !1; if (!e || f || !this._mouseCapture(b)) return !0; this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () { d.mouseDelayMet = !0 }, this.options.delay)); if (this._mouseDistanceMet(b) && this._mouseDelayMet(b)) { this._mouseStarted = this._mouseStart(b) !== !1; if (!this._mouseStarted) { b.preventDefault(); return !0 } } !0 === a.data(b.target, this.widgetName + ".preventClickEvent") && a.removeData(b.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (a) { return d._mouseMove(a) }, this._mouseUpDelegate = function (a) { return d._mouseUp(a) }, a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), b.preventDefault(), c = !0; return !0 } }, _mouseMove: function (b) { if (a.browser.msie && !(document.documentMode >= 9) && !b.button) return this._mouseUp(b); if (this._mouseStarted) { this._mouseDrag(b); return b.preventDefault() } this._mouseDistanceMet(b) && this._mouseDelayMet(b) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== !1, this._mouseStarted ? this._mouseDrag(b) : this._mouseUp(b)); return !this._mouseStarted }, _mouseUp: function (b) { a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, b.target == this._mouseDownEvent.target && a.data(b.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(b)); return !1 }, _mouseDistanceMet: function (a) { return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance }, _mouseDelayMet: function (a) { return this.mouseDelayMet }, _mouseStart: function (a) { }, _mouseDrag: function (a) { }, _mouseStop: function (a) { }, _mouseCapture: function (a) { return !0 } }) })(jQuery); /*!
* jQuery UI Tabs 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function (a, b) { function f() { return ++d } function e() { return ++c } var c = 0, d = 0; a.widget("ui.tabs", { options: { add: null, ajaxOptions: null, cache: !1, cookie: null, collapsible: !1, disable: null, disabled: [], enable: null, event: "click", fx: null, idPrefix: "ui-tabs-", load: null, panelTemplate: "<div></div>", remove: null, select: null, show: null, spinner: "<em>Loading&#8230;</em>", tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>" }, _create: function () { this._tabify(!0) }, _setOption: function (a, b) { if (a == "selected") { if (this.options.collapsible && b == this.options.selected) return; this.select(b) } else this.options[a] = b, this._tabify() }, _tabId: function (a) { return a.title && a.title.replace(/\s/g, "_").replace(/[^\w\u00c0-\uFFFF-]/g, "") || this.options.idPrefix + e() }, _sanitizeSelector: function (a) { return a.replace(/:/g, "\\:") }, _cookie: function () { var b = this.cookie || (this.cookie = this.options.cookie.name || "ui-tabs-" + f()); return a.cookie.apply(null, [b].concat(a.makeArray(arguments))) }, _ui: function (a, b) { return { tab: a, panel: b, index: this.anchors.index(a)} }, _cleanup: function () { this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function () { var b = a(this); b.html(b.data("label.tabs")).removeData("label.tabs") }) }, _tabify: function (c) { function m(b, c) { b.css("display", ""), !a.support.opacity && c.opacity && b[0].style.removeAttribute("filter") } var d = this, e = this.options, f = /^#.+/; this.list = this.element.find("ol,ul").eq(0), this.lis = a(" > li:has(a[href])", this.list), this.anchors = this.lis.map(function () { return a("a", this)[0] }), this.panels = a([]), this.anchors.each(function (b, c) { var g = a(c).attr("href"), h = g.split("#")[0], i; h && (h === location.toString().split("#")[0] || (i = a("base")[0]) && h === i.href) && (g = c.hash, c.href = g); if (f.test(g)) d.panels = d.panels.add(d.element.find(d._sanitizeSelector(g))); else if (g && g !== "#") { a.data(c, "href.tabs", g), a.data(c, "load.tabs", g.replace(/#.*$/, "")); var j = d._tabId(c); c.href = "#" + j; var k = d.element.find("#" + j); k.length || (k = a(e.panelTemplate).attr("id", j).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(d.panels[b - 1] || d.list), k.data("destroy.tabs", !0)), d.panels = d.panels.add(k) } else e.disabled.push(b) }), c ? (this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all"), this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"), this.lis.addClass("ui-state-default ui-corner-top"), this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom"), e.selected === b ? (location.hash && this.anchors.each(function (a, b) { if (b.hash == location.hash) { e.selected = a; return !1 } }), typeof e.selected != "number" && e.cookie && (e.selected = parseInt(d._cookie(), 10)), typeof e.selected != "number" && this.lis.filter(".ui-tabs-selected").length && (e.selected = this.lis.index(this.lis.filter(".ui-tabs-selected"))), e.selected = e.selected || (this.lis.length ? 0 : -1)) : e.selected === null && (e.selected = -1), e.selected = e.selected >= 0 && this.anchors[e.selected] || e.selected < 0 ? e.selected : 0, e.disabled = a.unique(e.disabled.concat(a.map(this.lis.filter(".ui-state-disabled"), function (a, b) { return d.lis.index(a) }))).sort(), a.inArray(e.selected, e.disabled) != -1 && e.disabled.splice(a.inArray(e.selected, e.disabled), 1), this.panels.addClass("ui-tabs-hide"), this.lis.removeClass("ui-tabs-selected ui-state-active"), e.selected >= 0 && this.anchors.length && (d.element.find(d._sanitizeSelector(d.anchors[e.selected].hash)).removeClass("ui-tabs-hide"), this.lis.eq(e.selected).addClass("ui-tabs-selected ui-state-active"), d.element.queue("tabs", function () { d._trigger("show", null, d._ui(d.anchors[e.selected], d.element.find(d._sanitizeSelector(d.anchors[e.selected].hash))[0])) }), this.load(e.selected)), a(window).bind("unload", function () { d.lis.add(d.anchors).unbind(".tabs"), d.lis = d.anchors = d.panels = null })) : e.selected = this.lis.index(this.lis.filter(".ui-tabs-selected")), this.element[e.collapsible ? "addClass" : "removeClass"]("ui-tabs-collapsible"), e.cookie && this._cookie(e.selected, e.cookie); for (var g = 0, h; h = this.lis[g]; g++) a(h)[a.inArray(g, e.disabled) != -1 && !a(h).hasClass("ui-tabs-selected") ? "addClass" : "removeClass"]("ui-state-disabled"); e.cache === !1 && this.anchors.removeData("cache.tabs"), this.lis.add(this.anchors).unbind(".tabs"); if (e.event !== "mouseover") { var i = function (a, b) { b.is(":not(.ui-state-disabled)") && b.addClass("ui-state-" + a) }, j = function (a, b) { b.removeClass("ui-state-" + a) }; this.lis.bind("mouseover.tabs", function () { i("hover", a(this)) }), this.lis.bind("mouseout.tabs", function () { j("hover", a(this)) }), this.anchors.bind("focus.tabs", function () { i("focus", a(this).closest("li")) }), this.anchors.bind("blur.tabs", function () { j("focus", a(this).closest("li")) }) } var k, l; e.fx && (a.isArray(e.fx) ? (k = e.fx[0], l = e.fx[1]) : k = l = e.fx); var n = l ? function (b, c) { a(b).closest("li").addClass("ui-tabs-selected ui-state-active"), c.hide().removeClass("ui-tabs-hide").animate(l, l.duration || "normal", function () { m(c, l), d._trigger("show", null, d._ui(b, c[0])) }) } : function (b, c) { a(b).closest("li").addClass("ui-tabs-selected ui-state-active"), c.removeClass("ui-tabs-hide"), d._trigger("show", null, d._ui(b, c[0])) }, o = k ? function (a, b) { b.animate(k, k.duration || "normal", function () { d.lis.removeClass("ui-tabs-selected ui-state-active"), b.addClass("ui-tabs-hide"), m(b, k), d.element.dequeue("tabs") }) } : function (a, b, c) { d.lis.removeClass("ui-tabs-selected ui-state-active"), b.addClass("ui-tabs-hide"), d.element.dequeue("tabs") }; this.anchors.bind(e.event + ".tabs", function () { var b = this, c = a(b).closest("li"), f = d.panels.filter(":not(.ui-tabs-hide)"), g = d.element.find(d._sanitizeSelector(b.hash)); if (c.hasClass("ui-tabs-selected") && !e.collapsible || c.hasClass("ui-state-disabled") || c.hasClass("ui-state-processing") || d.panels.filter(":animated").length || d._trigger("select", null, d._ui(this, g[0])) === !1) { this.blur(); return !1 } e.selected = d.anchors.index(this), d.abort(); if (e.collapsible) { if (c.hasClass("ui-tabs-selected")) { e.selected = -1, e.cookie && d._cookie(e.selected, e.cookie), d.element.queue("tabs", function () { o(b, f) }).dequeue("tabs"), this.blur(); return !1 } if (!f.length) { e.cookie && d._cookie(e.selected, e.cookie), d.element.queue("tabs", function () { n(b, g) }), d.load(d.anchors.index(this)), this.blur(); return !1 } } e.cookie && d._cookie(e.selected, e.cookie); if (g.length) f.length && d.element.queue("tabs", function () { o(b, f) }), d.element.queue("tabs", function () { n(b, g) }), d.load(d.anchors.index(this)); else throw "jQuery UI Tabs: Mismatching fragment identifier."; a.browser.msie && this.blur() }), this.anchors.bind("click.tabs", function () { return !1 }) }, _getIndex: function (a) { typeof a == "string" && (a = this.anchors.index(this.anchors.filter("[href$=" + a + "]"))); return a }, destroy: function () { var b = this.options; this.abort(), this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs"), this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"), this.anchors.each(function () { var b = a.data(this, "href.tabs"); b && (this.href = b); var c = a(this).unbind(".tabs"); a.each(["href", "load", "cache"], function (a, b) { c.removeData(b + ".tabs") }) }), this.lis.unbind(".tabs").add(this.panels).each(function () { a.data(this, "destroy.tabs") ? a(this).remove() : a(this).removeClass(["ui-state-default", "ui-corner-top", "ui-tabs-selected", "ui-state-active", "ui-state-hover", "ui-state-focus", "ui-state-disabled", "ui-tabs-panel", "ui-widget-content", "ui-corner-bottom", "ui-tabs-hide"].join(" ")) }), b.cookie && this._cookie(null, b.cookie); return this }, add: function (c, d, e) { e === b && (e = this.anchors.length); var f = this, g = this.options, h = a(g.tabTemplate.replace(/#\{href\}/g, c).replace(/#\{label\}/g, d)), i = c.indexOf("#") ? this._tabId(a("a", h)[0]) : c.replace("#", ""); h.addClass("ui-state-default ui-corner-top").data("destroy.tabs", !0); var j = f.element.find("#" + i); j.length || (j = a(g.panelTemplate).attr("id", i).data("destroy.tabs", !0)), j.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"), e >= this.lis.length ? (h.appendTo(this.list), j.appendTo(this.list[0].parentNode)) : (h.insertBefore(this.lis[e]), j.insertBefore(this.panels[e])), g.disabled = a.map(g.disabled, function (a, b) { return a >= e ? ++a : a }), this._tabify(), this.anchors.length == 1 && (g.selected = 0, h.addClass("ui-tabs-selected ui-state-active"), j.removeClass("ui-tabs-hide"), this.element.queue("tabs", function () { f._trigger("show", null, f._ui(f.anchors[0], f.panels[0])) }), this.load(0)), this._trigger("add", null, this._ui(this.anchors[e], this.panels[e])); return this }, remove: function (b) { b = this._getIndex(b); var c = this.options, d = this.lis.eq(b).remove(), e = this.panels.eq(b).remove(); d.hasClass("ui-tabs-selected") && this.anchors.length > 1 && this.select(b + (b + 1 < this.anchors.length ? 1 : -1)), c.disabled = a.map(a.grep(c.disabled, function (a, c) { return a != b }), function (a, c) { return a >= b ? --a : a }), this._tabify(), this._trigger("remove", null, this._ui(d.find("a")[0], e[0])); return this }, enable: function (b) { b = this._getIndex(b); var c = this.options; if (a.inArray(b, c.disabled) != -1) { this.lis.eq(b).removeClass("ui-state-disabled"), c.disabled = a.grep(c.disabled, function (a, c) { return a != b }), this._trigger("enable", null, this._ui(this.anchors[b], this.panels[b])); return this } }, disable: function (a) { a = this._getIndex(a); var b = this, c = this.options; a != c.selected && (this.lis.eq(a).addClass("ui-state-disabled"), c.disabled.push(a), c.disabled.sort(), this._trigger("disable", null, this._ui(this.anchors[a], this.panels[a]))); return this }, select: function (a) { a = this._getIndex(a); if (a == -1) if (this.options.collapsible && this.options.selected != -1) a = this.options.selected; else return this; this.anchors.eq(a).trigger(this.options.event + ".tabs"); return this }, load: function (b) { b = this._getIndex(b); var c = this, d = this.options, e = this.anchors.eq(b)[0], f = a.data(e, "load.tabs"); this.abort(); if (!f || this.element.queue("tabs").length !== 0 && a.data(e, "cache.tabs")) this.element.dequeue("tabs"); else { this.lis.eq(b).addClass("ui-state-processing"); if (d.spinner) { var g = a("span", e); g.data("label.tabs", g.html()).html(d.spinner) } this.xhr = a.ajax(a.extend({}, d.ajaxOptions, { url: f, success: function (f, g) { c.element.find(c._sanitizeSelector(e.hash)).html(f), c._cleanup(), d.cache && a.data(e, "cache.tabs", !0), c._trigger("load", null, c._ui(c.anchors[b], c.panels[b])); try { d.ajaxOptions.success(f, g) } catch (h) { } }, error: function (a, f, g) { c._cleanup(), c._trigger("load", null, c._ui(c.anchors[b], c.panels[b])); try { d.ajaxOptions.error(a, f, b, e) } catch (g) { } } })), c.element.dequeue("tabs"); return this } }, abort: function () { this.element.queue([]), this.panels.stop(!1, !0), this.element.queue("tabs", this.element.queue("tabs").splice(-2, 2)), this.xhr && (this.xhr.abort(), delete this.xhr), this._cleanup(); return this }, url: function (a, b) { this.anchors.eq(a).removeData("cache.tabs").data("load.tabs", b); return this }, length: function () { return this.anchors.length } }), a.extend(a.ui.tabs, { version: "1.8.18" }), a.extend(a.ui.tabs.prototype, { rotation: null, rotate: function (a, b) { var c = this, d = this.options, e = c._rotate || (c._rotate = function (b) { clearTimeout(c.rotation), c.rotation = setTimeout(function () { var a = d.selected; c.select(++a < c.anchors.length ? a : 0) }, a), b && b.stopPropagation() }), f = c._unrotate || (c._unrotate = b ? function (a) { t = d.selected, e() } : function (a) { a.clientX && c.rotate(null) }); a ? (this.element.bind("tabsshow", e), this.anchors.bind(d.event + ".tabs", f), e()) : (clearTimeout(c.rotation), this.element.unbind("tabsshow", e), this.anchors.unbind(d.event + ".tabs", f), delete this._rotate, delete this._unrotate); return this } }) })(jQuery); /*
 * jQuery UI Position 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function (a, b) { a.ui = a.ui || {}; var c = /left|center|right/, d = /top|center|bottom/, e = "center", f = {}, g = a.fn.position, h = a.fn.offset; a.fn.position = function (b) { if (!b || !b.of) return g.apply(this, arguments); b = a.extend({}, b); var h = a(b.of), i = h[0], j = (b.collision || "flip").split(" "), k = b.offset ? b.offset.split(" ") : [0, 0], l, m, n; i.nodeType === 9 ? (l = h.width(), m = h.height(), n = { top: 0, left: 0 }) : i.setTimeout ? (l = h.width(), m = h.height(), n = { top: h.scrollTop(), left: h.scrollLeft() }) : i.preventDefault ? (b.at = "left top", l = m = 0, n = { top: b.of.pageY, left: b.of.pageX }) : (l = h.outerWidth(), m = h.outerHeight(), n = h.offset()), a.each(["my", "at"], function () { var a = (b[this] || "").split(" "); a.length === 1 && (a = c.test(a[0]) ? a.concat([e]) : d.test(a[0]) ? [e].concat(a) : [e, e]), a[0] = c.test(a[0]) ? a[0] : e, a[1] = d.test(a[1]) ? a[1] : e, b[this] = a }), j.length === 1 && (j[1] = j[0]), k[0] = parseInt(k[0], 10) || 0, k.length === 1 && (k[1] = k[0]), k[1] = parseInt(k[1], 10) || 0, b.at[0] === "right" ? n.left += l : b.at[0] === e && (n.left += l / 2), b.at[1] === "bottom" ? n.top += m : b.at[1] === e && (n.top += m / 2), n.left += k[0], n.top += k[1]; return this.each(function () { var c = a(this), d = c.outerWidth(), g = c.outerHeight(), h = parseInt(a.curCSS(this, "marginLeft", !0)) || 0, i = parseInt(a.curCSS(this, "marginTop", !0)) || 0, o = d + h + (parseInt(a.curCSS(this, "marginRight", !0)) || 0), p = g + i + (parseInt(a.curCSS(this, "marginBottom", !0)) || 0), q = a.extend({}, n), r; b.my[0] === "right" ? q.left -= d : b.my[0] === e && (q.left -= d / 2), b.my[1] === "bottom" ? q.top -= g : b.my[1] === e && (q.top -= g / 2), f.fractions || (q.left = Math.round(q.left), q.top = Math.round(q.top)), r = { left: q.left - h, top: q.top - i }, a.each(["left", "top"], function (c, e) { a.ui.position[j[c]] && a.ui.position[j[c]][e](q, { targetWidth: l, targetHeight: m, elemWidth: d, elemHeight: g, collisionPosition: r, collisionWidth: o, collisionHeight: p, offset: k, my: b.my, at: b.at }) }), a.fn.bgiframe && c.bgiframe(), c.offset(a.extend(q, { using: b.using })) }) }, a.ui.position = { fit: { left: function (b, c) { var d = a(window), e = c.collisionPosition.left + c.collisionWidth - d.width() - d.scrollLeft(); b.left = e > 0 ? b.left - e : Math.max(b.left - c.collisionPosition.left, b.left) }, top: function (b, c) { var d = a(window), e = c.collisionPosition.top + c.collisionHeight - d.height() - d.scrollTop(); b.top = e > 0 ? b.top - e : Math.max(b.top - c.collisionPosition.top, b.top) } }, flip: { left: function (b, c) { if (c.at[0] !== e) { var d = a(window), f = c.collisionPosition.left + c.collisionWidth - d.width() - d.scrollLeft(), g = c.my[0] === "left" ? -c.elemWidth : c.my[0] === "right" ? c.elemWidth : 0, h = c.at[0] === "left" ? c.targetWidth : -c.targetWidth, i = -2 * c.offset[0]; b.left += c.collisionPosition.left < 0 ? g + h + i : f > 0 ? g + h + i : 0 } }, top: function (b, c) { if (c.at[1] !== e) { var d = a(window), f = c.collisionPosition.top + c.collisionHeight - d.height() - d.scrollTop(), g = c.my[1] === "top" ? -c.elemHeight : c.my[1] === "bottom" ? c.elemHeight : 0, h = c.at[1] === "top" ? c.targetHeight : -c.targetHeight, i = -2 * c.offset[1]; b.top += c.collisionPosition.top < 0 ? g + h + i : f > 0 ? g + h + i : 0 } } } }, a.offset.setOffset || (a.offset.setOffset = function (b, c) { /static/.test(a.curCSS(b, "position")) && (b.style.position = "relative"); var d = a(b), e = d.offset(), f = parseInt(a.curCSS(b, "top", !0), 10) || 0, g = parseInt(a.curCSS(b, "left", !0), 10) || 0, h = { top: c.top - e.top + f, left: c.left - e.left + g }; "using" in c ? c.using.call(b, h) : d.css(h) }, a.fn.offset = function (b) { var c = this[0]; if (!c || !c.ownerDocument) return null; if (b) return this.each(function () { a.offset.setOffset(this, b) }); return h.call(this) }), function () { var b = document.getElementsByTagName("body")[0], c = document.createElement("div"), d, e, g, h, i; d = document.createElement(b ? "div" : "body"), g = { visibility: "hidden", width: 0, height: 0, border: 0, margin: 0, background: "none" }, b && a.extend(g, { position: "absolute", left: "-1000px", top: "-1000px" }); for (var j in g) d.style[j] = g[j]; d.appendChild(c), e = b || document.documentElement, e.insertBefore(d, e.firstChild), c.style.cssText = "position: absolute; left: 10.7432222px; top: 10.432325px; height: 30px; width: 201px;", h = a(c).offset(function (a, b) { return b }).offset(), d.innerHTML = "", e.removeChild(d), i = h.top + h.left + (b ? 2e3 : 0), f.fractions = i > 21 && i < 22 } () })(jQuery); /*
 * jQuery UI Draggable 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
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
(function (a, b) { a.widget("ui.draggable", a.ui.mouse, { widgetEventPrefix: "drag", options: { addClasses: !0, appendTo: "parent", axis: !1, connectToSortable: !1, containment: !1, cursor: "auto", cursorAt: !1, grid: !1, handle: !1, helper: "original", iframeFix: !1, opacity: !1, refreshPositions: !1, revert: !1, revertDuration: 500, scope: "default", scroll: !0, scrollSensitivity: 20, scrollSpeed: 20, snap: !1, snapMode: "both", snapTolerance: 20, stack: !1, zIndex: !1 }, _create: function () { this.options.helper == "original" && !/^(?:r|a|f)/.test(this.element.css("position")) && (this.element[0].style.position = "relative"), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._mouseInit() }, destroy: function () { if (!!this.element.data("draggable")) { this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._mouseDestroy(); return this } }, _mouseCapture: function (b) { var c = this.options; if (this.helper || c.disabled || a(b.target).is(".ui-resizable-handle")) return !1; this.handle = this._getHandle(b); if (!this.handle) return !1; c.iframeFix && a(c.iframeFix === !0 ? "iframe" : c.iframeFix).each(function () { a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({ width: this.offsetWidth + "px", height: this.offsetHeight + "px", position: "absolute", opacity: "0.001", zIndex: 1e3 }).css(a(this).offset()).appendTo("body") }); return !0 }, _mouseStart: function (b) { var c = this.options; this.helper = this._createHelper(b), this._cacheHelperProportions(), a.ui.ddmanager && (a.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), this.offset = this.positionAbs = this.element.offset(), this.offset = { top: this.offset.top - this.margins.top, left: this.offset.left - this.margins.left }, a.extend(this.offset, { click: { left: b.pageX - this.offset.left, top: b.pageY - this.offset.top }, parent: this._getParentOffset(), relative: this._getRelativeOffset() }), this.originalPosition = this.position = this._generatePosition(b), this.originalPageX = b.pageX, this.originalPageY = b.pageY, c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt), c.containment && this._setContainment(); if (this._trigger("start", b) === !1) { this._clear(); return !1 } this._cacheHelperProportions(), a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, b), this.helper.addClass("ui-draggable-dragging"), this._mouseDrag(b, !0), a.ui.ddmanager && a.ui.ddmanager.dragStart(this, b); return !0 }, _mouseDrag: function (b, c) { this.position = this._generatePosition(b), this.positionAbs = this._convertPositionTo("absolute"); if (!c) { var d = this._uiHash(); if (this._trigger("drag", b, d) === !1) { this._mouseUp({}); return !1 } this.position = d.position } if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + "px"; if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + "px"; a.ui.ddmanager && a.ui.ddmanager.drag(this, b); return !1 }, _mouseStop: function (b) { var c = !1; a.ui.ddmanager && !this.options.dropBehaviour && (c = a.ui.ddmanager.drop(this, b)), this.dropped && (c = this.dropped, this.dropped = !1); if ((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original") return !1; if (this.options.revert == "invalid" && !c || this.options.revert == "valid" && c || this.options.revert === !0 || a.isFunction(this.options.revert) && this.options.revert.call(this.element, c)) { var d = this; a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () { d._trigger("stop", b) !== !1 && d._clear() }) } else this._trigger("stop", b) !== !1 && this._clear(); return !1 }, _mouseUp: function (b) { this.options.iframeFix === !0 && a("div.ui-draggable-iframeFix").each(function () { this.parentNode.removeChild(this) }), a.ui.ddmanager && a.ui.ddmanager.dragStop(this, b); return a.ui.mouse.prototype._mouseUp.call(this, b) }, cancel: function () { this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(); return this }, _getHandle: function (b) { var c = !this.options.handle || !a(this.options.handle, this.element).length ? !0 : !1; a(this.options.handle, this.element).find("*").andSelf().each(function () { this == b.target && (c = !0) }); return c }, _createHelper: function (b) { var c = this.options, d = a.isFunction(c.helper) ? a(c.helper.apply(this.element[0], [b])) : c.helper == "clone" ? this.element.clone().removeAttr("id") : this.element; d.parents("body").length || d.appendTo(c.appendTo == "parent" ? this.element[0].parentNode : c.appendTo), d[0] != this.element[0] && !/(fixed|absolute)/.test(d.css("position")) && d.css("position", "absolute"); return d }, _adjustOffsetFromHelper: function (b) { typeof b == "string" && (b = b.split(" ")), a.isArray(b) && (b = { left: +b[0], top: +b[1] || 0 }), "left" in b && (this.offset.click.left = b.left + this.margins.left), "right" in b && (this.offset.click.left = this.helperProportions.width - b.right + this.margins.left), "top" in b && (this.offset.click.top = b.top + this.margins.top), "bottom" in b && (this.offset.click.top = this.helperProportions.height - b.bottom + this.margins.top) }, _getParentOffset: function () { this.offsetParent = this.helper.offsetParent(); var b = this.offsetParent.offset(); this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0]) && (b.left += this.scrollParent.scrollLeft(), b.top += this.scrollParent.scrollTop()); if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie) b = { top: 0, left: 0 }; return { top: b.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left: b.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)} }, _getRelativeOffset: function () { if (this.cssPosition == "relative") { var a = this.element.position(); return { top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()} } return { top: 0, left: 0} }, _cacheMargins: function () { this.margins = { left: parseInt(this.element.css("marginLeft"), 10) || 0, top: parseInt(this.element.css("marginTop"), 10) || 0, right: parseInt(this.element.css("marginRight"), 10) || 0, bottom: parseInt(this.element.css("marginBottom"), 10) || 0} }, _cacheHelperProportions: function () { this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight()} }, _setContainment: function () { var b = this.options; b.containment == "parent" && (b.containment = this.helper[0].parentNode); if (b.containment == "document" || b.containment == "window") this.containment = [b.containment == "document" ? 0 : a(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, b.containment == "document" ? 0 : a(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, (b.containment == "document" ? 0 : a(window).scrollLeft()) + a(b.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (b.containment == "document" ? 0 : a(window).scrollTop()) + (a(b.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]; if (!/^(document|window|parent)$/.test(b.containment) && b.containment.constructor != Array) { var c = a(b.containment), d = c[0]; if (!d) return; var e = c.offset(), f = a(d).css("overflow") != "hidden"; this.containment = [(parseInt(a(d).css("borderLeftWidth"), 10) || 0) + (parseInt(a(d).css("paddingLeft"), 10) || 0), (parseInt(a(d).css("borderTopWidth"), 10) || 0) + (parseInt(a(d).css("paddingTop"), 10) || 0), (f ? Math.max(d.scrollWidth, d.offsetWidth) : d.offsetWidth) - (parseInt(a(d).css("borderLeftWidth"), 10) || 0) - (parseInt(a(d).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (f ? Math.max(d.scrollHeight, d.offsetHeight) : d.offsetHeight) - (parseInt(a(d).css("borderTopWidth"), 10) || 0) - (parseInt(a(d).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relative_container = c } else b.containment.constructor == Array && (this.containment = b.containment) }, _convertPositionTo: function (b, c) { c || (c = this.position); var d = b == "absolute" ? 1 : -1, e = this.options, f = this.cssPosition == "absolute" && (this.scrollParent[0] == document || !a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, g = /(html|body)/i.test(f[0].tagName); return { top: c.top + this.offset.relative.top * d + this.offset.parent.top * d - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : g ? 0 : f.scrollTop()) * d), left: c.left + this.offset.relative.left * d + this.offset.parent.left * d - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : g ? 0 : f.scrollLeft()) * d)} }, _generatePosition: function (b) { var c = this.options, d = this.cssPosition == "absolute" && (this.scrollParent[0] == document || !a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, e = /(html|body)/i.test(d[0].tagName), f = b.pageX, g = b.pageY; if (this.originalPosition) { var h; if (this.containment) { if (this.relative_container) { var i = this.relative_container.offset(); h = [this.containment[0] + i.left, this.containment[1] + i.top, this.containment[2] + i.left, this.containment[3] + i.top] } else h = this.containment; b.pageX - this.offset.click.left < h[0] && (f = h[0] + this.offset.click.left), b.pageY - this.offset.click.top < h[1] && (g = h[1] + this.offset.click.top), b.pageX - this.offset.click.left > h[2] && (f = h[2] + this.offset.click.left), b.pageY - this.offset.click.top > h[3] && (g = h[3] + this.offset.click.top) } if (c.grid) { var j = c.grid[1] ? this.originalPageY + Math.round((g - this.originalPageY) / c.grid[1]) * c.grid[1] : this.originalPageY; g = h ? j - this.offset.click.top < h[1] || j - this.offset.click.top > h[3] ? j - this.offset.click.top < h[1] ? j + c.grid[1] : j - c.grid[1] : j : j; var k = c.grid[0] ? this.originalPageX + Math.round((f - this.originalPageX) / c.grid[0]) * c.grid[0] : this.originalPageX; f = h ? k - this.offset.click.left < h[0] || k - this.offset.click.left > h[2] ? k - this.offset.click.left < h[0] ? k + c.grid[0] : k - c.grid[0] : k : k } } return { top: g - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : d.scrollTop()), left: f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : d.scrollLeft())} }, _clear: function () { this.helper.removeClass("ui-draggable-dragging"), this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1 }, _trigger: function (b, c, d) { d = d || this._uiHash(), a.ui.plugin.call(this, b, [c, d]), b == "drag" && (this.positionAbs = this._convertPositionTo("absolute")); return a.Widget.prototype._trigger.call(this, b, c, d) }, plugins: {}, _uiHash: function (a) { return { helper: this.helper, position: this.position, originalPosition: this.originalPosition, offset: this.positionAbs} } }), a.extend(a.ui.draggable, { version: "1.8.18" }), a.ui.plugin.add("draggable", "connectToSortable", { start: function (b, c) { var d = a(this).data("draggable"), e = d.options, f = a.extend({}, c, { item: d.element }); d.sortables = [], a(e.connectToSortable).each(function () { var c = a.data(this, "sortable"); c && !c.options.disabled && (d.sortables.push({ instance: c, shouldRevert: c.options.revert }), c.refreshPositions(), c._trigger("activate", b, f)) }) }, stop: function (b, c) { var d = a(this).data("draggable"), e = a.extend({}, c, { item: d.element }); a.each(d.sortables, function () { this.instance.isOver ? (this.instance.isOver = 0, d.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = !0), this.instance._mouseStop(b), this.instance.options.helper = this.instance.options._helper, d.options.helper == "original" && this.instance.currentItem.css({ top: "auto", left: "auto" })) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", b, e)) }) }, drag: function (b, c) { var d = a(this).data("draggable"), e = this, f = function (b) { var c = this.offset.click.top, d = this.offset.click.left, e = this.positionAbs.top, f = this.positionAbs.left, g = b.height, h = b.width, i = b.top, j = b.left; return a.ui.isOver(e + c, f + d, i, j, g, h) }; a.each(d.sortables, function (f) { this.instance.positionAbs = d.positionAbs, this.instance.helperProportions = d.helperProportions, this.instance.offset.click = d.offset.click, this.instance._intersectsWith(this.instance.containerCache) ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = a(e).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function () { return c.helper[0] }, b.target = this.instance.currentItem[0], this.instance._mouseCapture(b, !0), this.instance._mouseStart(b, !0, !0), this.instance.offset.click.top = d.offset.click.top, this.instance.offset.click.left = d.offset.click.left, this.instance.offset.parent.left -= d.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= d.offset.parent.top - this.instance.offset.parent.top, d._trigger("toSortable", b), d.dropped = this.instance.element, d.currentItem = d.element, this.instance.fromOutside = d), this.instance.currentItem && this.instance._mouseDrag(b)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", b, this.instance._uiHash(this.instance)), this.instance._mouseStop(b, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), d._trigger("fromSortable", b), d.dropped = !1) }) } }), a.ui.plugin.add("draggable", "cursor", { start: function (b, c) { var d = a("body"), e = a(this).data("draggable").options; d.css("cursor") && (e._cursor = d.css("cursor")), d.css("cursor", e.cursor) }, stop: function (b, c) { var d = a(this).data("draggable").options; d._cursor && a("body").css("cursor", d._cursor) } }), a.ui.plugin.add("draggable", "opacity", { start: function (b, c) { var d = a(c.helper), e = a(this).data("draggable").options; d.css("opacity") && (e._opacity = d.css("opacity")), d.css("opacity", e.opacity) }, stop: function (b, c) { var d = a(this).data("draggable").options; d._opacity && a(c.helper).css("opacity", d._opacity) } }), a.ui.plugin.add("draggable", "scroll", { start: function (b, c) { var d = a(this).data("draggable"); d.scrollParent[0] != document && d.scrollParent[0].tagName != "HTML" && (d.overflowOffset = d.scrollParent.offset()) }, drag: function (b, c) { var d = a(this).data("draggable"), e = d.options, f = !1; if (d.scrollParent[0] != document && d.scrollParent[0].tagName != "HTML") { if (!e.axis || e.axis != "x") d.overflowOffset.top + d.scrollParent[0].offsetHeight - b.pageY < e.scrollSensitivity ? d.scrollParent[0].scrollTop = f = d.scrollParent[0].scrollTop + e.scrollSpeed : b.pageY - d.overflowOffset.top < e.scrollSensitivity && (d.scrollParent[0].scrollTop = f = d.scrollParent[0].scrollTop - e.scrollSpeed); if (!e.axis || e.axis != "y") d.overflowOffset.left + d.scrollParent[0].offsetWidth - b.pageX < e.scrollSensitivity ? d.scrollParent[0].scrollLeft = f = d.scrollParent[0].scrollLeft + e.scrollSpeed : b.pageX - d.overflowOffset.left < e.scrollSensitivity && (d.scrollParent[0].scrollLeft = f = d.scrollParent[0].scrollLeft - e.scrollSpeed) } else { if (!e.axis || e.axis != "x") b.pageY - a(document).scrollTop() < e.scrollSensitivity ? f = a(document).scrollTop(a(document).scrollTop() - e.scrollSpeed) : a(window).height() - (b.pageY - a(document).scrollTop()) < e.scrollSensitivity && (f = a(document).scrollTop(a(document).scrollTop() + e.scrollSpeed)); if (!e.axis || e.axis != "y") b.pageX - a(document).scrollLeft() < e.scrollSensitivity ? f = a(document).scrollLeft(a(document).scrollLeft() - e.scrollSpeed) : a(window).width() - (b.pageX - a(document).scrollLeft()) < e.scrollSensitivity && (f = a(document).scrollLeft(a(document).scrollLeft() + e.scrollSpeed)) } f !== !1 && a.ui.ddmanager && !e.dropBehaviour && a.ui.ddmanager.prepareOffsets(d, b) } }), a.ui.plugin.add("draggable", "snap", { start: function (b, c) { var d = a(this).data("draggable"), e = d.options; d.snapElements = [], a(e.snap.constructor != String ? e.snap.items || ":data(draggable)" : e.snap).each(function () { var b = a(this), c = b.offset(); this != d.element[0] && d.snapElements.push({ item: this, width: b.outerWidth(), height: b.outerHeight(), top: c.top, left: c.left }) }) }, drag: function (b, c) { var d = a(this).data("draggable"), e = d.options, f = e.snapTolerance, g = c.offset.left, h = g + d.helperProportions.width, i = c.offset.top, j = i + d.helperProportions.height; for (var k = d.snapElements.length - 1; k >= 0; k--) { var l = d.snapElements[k].left, m = l + d.snapElements[k].width, n = d.snapElements[k].top, o = n + d.snapElements[k].height; if (!(l - f < g && g < m + f && n - f < i && i < o + f || l - f < g && g < m + f && n - f < j && j < o + f || l - f < h && h < m + f && n - f < i && i < o + f || l - f < h && h < m + f && n - f < j && j < o + f)) { d.snapElements[k].snapping && d.options.snap.release && d.options.snap.release.call(d.element, b, a.extend(d._uiHash(), { snapItem: d.snapElements[k].item })), d.snapElements[k].snapping = !1; continue } if (e.snapMode != "inner") { var p = Math.abs(n - j) <= f, q = Math.abs(o - i) <= f, r = Math.abs(l - h) <= f, s = Math.abs(m - g) <= f; p && (c.position.top = d._convertPositionTo("relative", { top: n - d.helperProportions.height, left: 0 }).top - d.margins.top), q && (c.position.top = d._convertPositionTo("relative", { top: o, left: 0 }).top - d.margins.top), r && (c.position.left = d._convertPositionTo("relative", { top: 0, left: l - d.helperProportions.width }).left - d.margins.left), s && (c.position.left = d._convertPositionTo("relative", { top: 0, left: m }).left - d.margins.left) } var t = p || q || r || s; if (e.snapMode != "outer") { var p = Math.abs(n - i) <= f, q = Math.abs(o - j) <= f, r = Math.abs(l - g) <= f, s = Math.abs(m - h) <= f; p && (c.position.top = d._convertPositionTo("relative", { top: n, left: 0 }).top - d.margins.top), q && (c.position.top = d._convertPositionTo("relative", { top: o - d.helperProportions.height, left: 0 }).top - d.margins.top), r && (c.position.left = d._convertPositionTo("relative", { top: 0, left: l }).left - d.margins.left), s && (c.position.left = d._convertPositionTo("relative", { top: 0, left: m - d.helperProportions.width }).left - d.margins.left) } !d.snapElements[k].snapping && (p || q || r || s || t) && d.options.snap.snap && d.options.snap.snap.call(d.element, b, a.extend(d._uiHash(), { snapItem: d.snapElements[k].item })), d.snapElements[k].snapping = p || q || r || s || t } } }), a.ui.plugin.add("draggable", "stack", { start: function (b, c) { var d = a(this).data("draggable").options, e = a.makeArray(a(d.stack)).sort(function (b, c) { return (parseInt(a(b).css("zIndex"), 10) || 0) - (parseInt(a(c).css("zIndex"), 10) || 0) }); if (!!e.length) { var f = parseInt(e[0].style.zIndex) || 0; a(e).each(function (a) { this.style.zIndex = f + a }), this[0].style.zIndex = f + e.length } } }), a.ui.plugin.add("draggable", "zIndex", { start: function (b, c) { var d = a(c.helper), e = a(this).data("draggable").options; d.css("zIndex") && (e._zIndex = d.css("zIndex")), d.css("zIndex", e.zIndex) }, stop: function (b, c) { var d = a(this).data("draggable").options; d._zIndex && a(c.helper).css("zIndex", d._zIndex) } }) })(jQuery); /*
 * jQuery UI Droppable 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	jquery.ui.draggable.js
 */
(function (a, b) { a.widget("ui.droppable", { widgetEventPrefix: "drop", options: { accept: "*", activeClass: !1, addClasses: !0, greedy: !1, hoverClass: !1, scope: "default", tolerance: "intersect" }, _create: function () { var b = this.options, c = b.accept; this.isover = 0, this.isout = 1, this.accept = a.isFunction(c) ? c : function (a) { return a.is(c) }, this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight }, a.ui.ddmanager.droppables[b.scope] = a.ui.ddmanager.droppables[b.scope] || [], a.ui.ddmanager.droppables[b.scope].push(this), b.addClasses && this.element.addClass("ui-droppable") }, destroy: function () { var b = a.ui.ddmanager.droppables[this.options.scope]; for (var c = 0; c < b.length; c++) b[c] == this && b.splice(c, 1); this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable"); return this }, _setOption: function (b, c) { b == "accept" && (this.accept = a.isFunction(c) ? c : function (a) { return a.is(c) }), a.Widget.prototype._setOption.apply(this, arguments) }, _activate: function (b) { var c = a.ui.ddmanager.current; this.options.activeClass && this.element.addClass(this.options.activeClass), c && this._trigger("activate", b, this.ui(c)) }, _deactivate: function (b) { var c = a.ui.ddmanager.current; this.options.activeClass && this.element.removeClass(this.options.activeClass), c && this._trigger("deactivate", b, this.ui(c)) }, _over: function (b) { var c = a.ui.ddmanager.current; !!c && (c.currentItem || c.element)[0] != this.element[0] && this.accept.call(this.element[0], c.currentItem || c.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass), this._trigger("over", b, this.ui(c))) }, _out: function (b) { var c = a.ui.ddmanager.current; !!c && (c.currentItem || c.element)[0] != this.element[0] && this.accept.call(this.element[0], c.currentItem || c.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("out", b, this.ui(c))) }, _drop: function (b, c) { var d = c || a.ui.ddmanager.current; if (!d || (d.currentItem || d.element)[0] == this.element[0]) return !1; var e = !1; this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function () { var b = a.data(this, "droppable"); if (b.options.greedy && !b.options.disabled && b.options.scope == d.options.scope && b.accept.call(b.element[0], d.currentItem || d.element) && a.ui.intersect(d, a.extend(b, { offset: b.element.offset() }), b.options.tolerance)) { e = !0; return !1 } }); if (e) return !1; if (this.accept.call(this.element[0], d.currentItem || d.element)) { this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop", b, this.ui(d)); return this.element } return !1 }, ui: function (a) { return { draggable: a.currentItem || a.element, helper: a.helper, position: a.position, offset: a.positionAbs} } }), a.extend(a.ui.droppable, { version: "1.8.18" }), a.ui.intersect = function (b, c, d) { if (!c.offset) return !1; var e = (b.positionAbs || b.position.absolute).left, f = e + b.helperProportions.width, g = (b.positionAbs || b.position.absolute).top, h = g + b.helperProportions.height, i = c.offset.left, j = i + c.proportions.width, k = c.offset.top, l = k + c.proportions.height; switch (d) { case "fit": return i <= e && f <= j && k <= g && h <= l; case "intersect": return i < e + b.helperProportions.width / 2 && f - b.helperProportions.width / 2 < j && k < g + b.helperProportions.height / 2 && h - b.helperProportions.height / 2 < l; case "pointer": var m = (b.positionAbs || b.position.absolute).left + (b.clickOffset || b.offset.click).left, n = (b.positionAbs || b.position.absolute).top + (b.clickOffset || b.offset.click).top, o = a.ui.isOver(n, m, k, i, c.proportions.height, c.proportions.width); return o; case "touch": return (g >= k && g <= l || h >= k && h <= l || g < k && h > l) && (e >= i && e <= j || f >= i && f <= j || e < i && f > j); default: return !1 } }, a.ui.ddmanager = { current: null, droppables: { "default": [] }, prepareOffsets: function (b, c) { var d = a.ui.ddmanager.droppables[b.options.scope] || [], e = c ? c.type : null, f = (b.currentItem || b.element).find(":data(droppable)").andSelf(); droppablesLoop: for (var g = 0; g < d.length; g++) { if (d[g].options.disabled || b && !d[g].accept.call(d[g].element[0], b.currentItem || b.element)) continue; for (var h = 0; h < f.length; h++) if (f[h] == d[g].element[0]) { d[g].proportions.height = 0; continue droppablesLoop } d[g].visible = d[g].element.css("display") != "none"; if (!d[g].visible) continue; e == "mousedown" && d[g]._activate.call(d[g], c), d[g].offset = d[g].element.offset(), d[g].proportions = { width: d[g].element[0].offsetWidth, height: d[g].element[0].offsetHeight} } }, drop: function (b, c) { var d = !1; a.each(a.ui.ddmanager.droppables[b.options.scope] || [], function () { !this.options || (!this.options.disabled && this.visible && a.ui.intersect(b, this, this.options.tolerance) && (d = this._drop.call(this, c) || d), !this.options.disabled && this.visible && this.accept.call(this.element[0], b.currentItem || b.element) && (this.isout = 1, this.isover = 0, this._deactivate.call(this, c))) }); return d }, dragStart: function (b, c) { b.element.parents(":not(body,html)").bind("scroll.droppable", function () { b.options.refreshPositions || a.ui.ddmanager.prepareOffsets(b, c) }) }, drag: function (b, c) { b.options.refreshPositions && a.ui.ddmanager.prepareOffsets(b, c), a.each(a.ui.ddmanager.droppables[b.options.scope] || [], function () { if (!(this.options.disabled || this.greedyChild || !this.visible)) { var d = a.ui.intersect(b, this, this.options.tolerance), e = !d && this.isover == 1 ? "isout" : d && this.isover == 0 ? "isover" : null; if (!e) return; var f; if (this.options.greedy) { var g = this.element.parents(":data(droppable):eq(0)"); g.length && (f = a.data(g[0], "droppable"), f.greedyChild = e == "isover" ? 1 : 0) } f && e == "isover" && (f.isover = 0, f.isout = 1, f._out.call(f, c)), this[e] = 1, this[e == "isout" ? "isover" : "isout"] = 0, this[e == "isover" ? "_over" : "_out"].call(this, c), f && e == "isout" && (f.isout = 0, f.isover = 1, f._over.call(f, c)) } }) }, dragStop: function (b, c) { b.element.parents(":not(body,html)").unbind("scroll.droppable"), b.options.refreshPositions || a.ui.ddmanager.prepareOffsets(b, c) } } })(jQuery); /*
 * jQuery UI Resizable 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function (a, b) { a.widget("ui.resizable", a.ui.mouse, { widgetEventPrefix: "resize", options: { alsoResize: !1, animate: !1, animateDuration: "slow", animateEasing: "swing", aspectRatio: !1, autoHide: !1, containment: !1, ghost: !1, grid: !1, handles: "e,s,se", helper: !1, maxHeight: null, maxWidth: null, minHeight: 10, minWidth: 10, zIndex: 1e3 }, _create: function () { var b = this, c = this.options; this.element.addClass("ui-resizable"), a.extend(this, { _aspectRatio: !!c.aspectRatio, aspectRatio: c.aspectRatio, originalElement: this.element, _proportionallyResizeElements: [], _helper: c.helper || c.ghost || c.animate ? c.helper || "ui-resizable-helper" : null }), this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i) && (this.element.wrap(a('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({ position: this.element.css("position"), width: this.element.outerWidth(), height: this.element.outerHeight(), top: this.element.css("top"), left: this.element.css("left") })), this.element = this.element.parent().data("resizable", this.element.data("resizable")), this.elementIsWrapper = !0, this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") }), this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0 }), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({ position: "static", zoom: 1, display: "block" })), this.originalElement.css({ margin: this.originalElement.css("margin") }), this._proportionallyResize()), this.handles = c.handles || (a(".ui-resizable-handle", this.element).length ? { n: ".ui-resizable-n", e: ".ui-resizable-e", s: ".ui-resizable-s", w: ".ui-resizable-w", se: ".ui-resizable-se", sw: ".ui-resizable-sw", ne: ".ui-resizable-ne", nw: ".ui-resizable-nw"} : "e,s,se"); if (this.handles.constructor == String) { this.handles == "all" && (this.handles = "n,e,s,w,se,sw,ne,nw"); var d = this.handles.split(","); this.handles = {}; for (var e = 0; e < d.length; e++) { var f = a.trim(d[e]), g = "ui-resizable-" + f, h = a('<div class="ui-resizable-handle ' + g + '"></div>'); /sw|se|ne|nw/.test(f) && h.css({ zIndex: ++c.zIndex }), "se" == f && h.addClass("ui-icon ui-icon-gripsmall-diagonal-se"), this.handles[f] = ".ui-resizable-" + f, this.element.append(h) } } this._renderAxis = function (b) { b = b || this.element; for (var c in this.handles) { this.handles[c].constructor == String && (this.handles[c] = a(this.handles[c], this.element).show()); if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) { var d = a(this.handles[c], this.element), e = 0; e = /sw|ne|nw|se|n|s/.test(c) ? d.outerHeight() : d.outerWidth(); var f = ["padding", /ne|nw|n/.test(c) ? "Top" : /se|sw|s/.test(c) ? "Bottom" : /^e$/.test(c) ? "Right" : "Left"].join(""); b.css(f, e), this._proportionallyResize() } if (!a(this.handles[c]).length) continue } }, this._renderAxis(this.element), this._handles = a(".ui-resizable-handle", this.element).disableSelection(), this._handles.mouseover(function () { if (!b.resizing) { if (this.className) var a = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i); b.axis = a && a[1] ? a[1] : "se" } }), c.autoHide && (this._handles.hide(), a(this.element).addClass("ui-resizable-autohide").hover(function () { c.disabled || (a(this).removeClass("ui-resizable-autohide"), b._handles.show()) }, function () { c.disabled || b.resizing || (a(this).addClass("ui-resizable-autohide"), b._handles.hide()) })), this._mouseInit() }, destroy: function () { this._mouseDestroy(); var b = function (b) { a(b).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove() }; if (this.elementIsWrapper) { b(this.element); var c = this.element; c.after(this.originalElement.css({ position: c.css("position"), width: c.outerWidth(), height: c.outerHeight(), top: c.css("top"), left: c.css("left") })).remove() } this.originalElement.css("resize", this.originalResizeStyle), b(this.originalElement); return this }, _mouseCapture: function (b) { var c = !1; for (var d in this.handles) a(this.handles[d])[0] == b.target && (c = !0); return !this.options.disabled && c }, _mouseStart: function (b) { var d = this.options, e = this.element.position(), f = this.element; this.resizing = !0, this.documentScroll = { top: a(document).scrollTop(), left: a(document).scrollLeft() }, (f.is(".ui-draggable") || /absolute/.test(f.css("position"))) && f.css({ position: "absolute", top: e.top, left: e.left }), this._renderProxy(); var g = c(this.helper.css("left")), h = c(this.helper.css("top")); d.containment && (g += a(d.containment).scrollLeft() || 0, h += a(d.containment).scrollTop() || 0), this.offset = this.helper.offset(), this.position = { left: g, top: h }, this.size = this._helper ? { width: f.outerWidth(), height: f.outerHeight()} : { width: f.width(), height: f.height() }, this.originalSize = this._helper ? { width: f.outerWidth(), height: f.outerHeight()} : { width: f.width(), height: f.height() }, this.originalPosition = { left: g, top: h }, this.sizeDiff = { width: f.outerWidth() - f.width(), height: f.outerHeight() - f.height() }, this.originalMousePosition = { left: b.pageX, top: b.pageY }, this.aspectRatio = typeof d.aspectRatio == "number" ? d.aspectRatio : this.originalSize.width / this.originalSize.height || 1; var i = a(".ui-resizable-" + this.axis).css("cursor"); a("body").css("cursor", i == "auto" ? this.axis + "-resize" : i), f.addClass("ui-resizable-resizing"), this._propagate("start", b); return !0 }, _mouseDrag: function (b) { var c = this.helper, d = this.options, e = {}, f = this, g = this.originalMousePosition, h = this.axis, i = b.pageX - g.left || 0, j = b.pageY - g.top || 0, k = this._change[h]; if (!k) return !1; var l = k.apply(this, [b, i, j]), m = a.browser.msie && a.browser.version < 7, n = this.sizeDiff; this._updateVirtualBoundaries(b.shiftKey); if (this._aspectRatio || b.shiftKey) l = this._updateRatio(l, b); l = this._respectSize(l, b), this._propagate("resize", b), c.css({ top: this.position.top + "px", left: this.position.left + "px", width: this.size.width + "px", height: this.size.height + "px" }), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), this._updateCache(l), this._trigger("resize", b, this.ui()); return !1 }, _mouseStop: function (b) { this.resizing = !1; var c = this.options, d = this; if (this._helper) { var e = this._proportionallyResizeElements, f = e.length && /textarea/i.test(e[0].nodeName), g = f && a.ui.hasScroll(e[0], "left") ? 0 : d.sizeDiff.height, h = f ? 0 : d.sizeDiff.width, i = { width: d.helper.width() - h, height: d.helper.height() - g }, j = parseInt(d.element.css("left"), 10) + (d.position.left - d.originalPosition.left) || null, k = parseInt(d.element.css("top"), 10) + (d.position.top - d.originalPosition.top) || null; c.animate || this.element.css(a.extend(i, { top: k, left: j })), d.helper.height(d.size.height), d.helper.width(d.size.width), this._helper && !c.animate && this._proportionallyResize() } a("body").css("cursor", "auto"), this.element.removeClass("ui-resizable-resizing"), this._propagate("stop", b), this._helper && this.helper.remove(); return !1 }, _updateVirtualBoundaries: function (a) { var b = this.options, c, e, f, g, h; h = { minWidth: d(b.minWidth) ? b.minWidth : 0, maxWidth: d(b.maxWidth) ? b.maxWidth : Infinity, minHeight: d(b.minHeight) ? b.minHeight : 0, maxHeight: d(b.maxHeight) ? b.maxHeight : Infinity }; if (this._aspectRatio || a) c = h.minHeight * this.aspectRatio, f = h.minWidth / this.aspectRatio, e = h.maxHeight * this.aspectRatio, g = h.maxWidth / this.aspectRatio, c > h.minWidth && (h.minWidth = c), f > h.minHeight && (h.minHeight = f), e < h.maxWidth && (h.maxWidth = e), g < h.maxHeight && (h.maxHeight = g); this._vBoundaries = h }, _updateCache: function (a) { var b = this.options; this.offset = this.helper.offset(), d(a.left) && (this.position.left = a.left), d(a.top) && (this.position.top = a.top), d(a.height) && (this.size.height = a.height), d(a.width) && (this.size.width = a.width) }, _updateRatio: function (a, b) { var c = this.options, e = this.position, f = this.size, g = this.axis; d(a.height) ? a.width = a.height * this.aspectRatio : d(a.width) && (a.height = a.width / this.aspectRatio), g == "sw" && (a.left = e.left + (f.width - a.width), a.top = null), g == "nw" && (a.top = e.top + (f.height - a.height), a.left = e.left + (f.width - a.width)); return a }, _respectSize: function (a, b) { var c = this.helper, e = this._vBoundaries, f = this._aspectRatio || b.shiftKey, g = this.axis, h = d(a.width) && e.maxWidth && e.maxWidth < a.width, i = d(a.height) && e.maxHeight && e.maxHeight < a.height, j = d(a.width) && e.minWidth && e.minWidth > a.width, k = d(a.height) && e.minHeight && e.minHeight > a.height; j && (a.width = e.minWidth), k && (a.height = e.minHeight), h && (a.width = e.maxWidth), i && (a.height = e.maxHeight); var l = this.originalPosition.left + this.originalSize.width, m = this.position.top + this.size.height, n = /sw|nw|w/.test(g), o = /nw|ne|n/.test(g); j && n && (a.left = l - e.minWidth), h && n && (a.left = l - e.maxWidth), k && o && (a.top = m - e.minHeight), i && o && (a.top = m - e.maxHeight); var p = !a.width && !a.height; p && !a.left && a.top ? a.top = null : p && !a.top && a.left && (a.left = null); return a }, _proportionallyResize: function () { var b = this.options; if (!!this._proportionallyResizeElements.length) { var c = this.helper || this.element; for (var d = 0; d < this._proportionallyResizeElements.length; d++) { var e = this._proportionallyResizeElements[d]; if (!this.borderDif) { var f = [e.css("borderTopWidth"), e.css("borderRightWidth"), e.css("borderBottomWidth"), e.css("borderLeftWidth")], g = [e.css("paddingTop"), e.css("paddingRight"), e.css("paddingBottom"), e.css("paddingLeft")]; this.borderDif = a.map(f, function (a, b) { var c = parseInt(a, 10) || 0, d = parseInt(g[b], 10) || 0; return c + d }) } if (a.browser.msie && (!!a(c).is(":hidden") || !!a(c).parents(":hidden").length)) continue; e.css({ height: c.height() - this.borderDif[0] - this.borderDif[2] || 0, width: c.width() - this.borderDif[1] - this.borderDif[3] || 0 }) } } }, _renderProxy: function () { var b = this.element, c = this.options; this.elementOffset = b.offset(); if (this._helper) { this.helper = this.helper || a('<div style="overflow:hidden;"></div>'); var d = a.browser.msie && a.browser.version < 7, e = d ? 1 : 0, f = d ? 2 : -1; this.helper.addClass(this._helper).css({ width: this.element.outerWidth() + f, height: this.element.outerHeight() + f, position: "absolute", left: this.elementOffset.left - e + "px", top: this.elementOffset.top - e + "px", zIndex: ++c.zIndex }), this.helper.appendTo("body").disableSelection() } else this.helper = this.element }, _change: { e: function (a, b, c) { return { width: this.originalSize.width + b} }, w: function (a, b, c) { var d = this.options, e = this.originalSize, f = this.originalPosition; return { left: f.left + b, width: e.width - b} }, n: function (a, b, c) { var d = this.options, e = this.originalSize, f = this.originalPosition; return { top: f.top + c, height: e.height - c} }, s: function (a, b, c) { return { height: this.originalSize.height + c} }, se: function (b, c, d) { return a.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [b, c, d])) }, sw: function (b, c, d) { return a.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [b, c, d])) }, ne: function (b, c, d) { return a.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [b, c, d])) }, nw: function (b, c, d) { return a.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [b, c, d])) } }, _propagate: function (b, c) { a.ui.plugin.call(this, b, [c, this.ui()]), b != "resize" && this._trigger(b, c, this.ui()) }, plugins: {}, ui: function () { return { originalElement: this.originalElement, element: this.element, helper: this.helper, position: this.position, size: this.size, originalSize: this.originalSize, originalPosition: this.originalPosition} } }), a.extend(a.ui.resizable, { version: "1.8.18" }), a.ui.plugin.add("resizable", "alsoResize", { start: function (b, c) { var d = a(this).data("resizable"), e = d.options, f = function (b) { a(b).each(function () { var b = a(this); b.data("resizable-alsoresize", { width: parseInt(b.width(), 10), height: parseInt(b.height(), 10), left: parseInt(b.css("left"), 10), top: parseInt(b.css("top"), 10) }) }) }; typeof e.alsoResize == "object" && !e.alsoResize.parentNode ? e.alsoResize.length ? (e.alsoResize = e.alsoResize[0], f(e.alsoResize)) : a.each(e.alsoResize, function (a) { f(a) }) : f(e.alsoResize) }, resize: function (b, c) { var d = a(this).data("resizable"), e = d.options, f = d.originalSize, g = d.originalPosition, h = { height: d.size.height - f.height || 0, width: d.size.width - f.width || 0, top: d.position.top - g.top || 0, left: d.position.left - g.left || 0 }, i = function (b, d) { a(b).each(function () { var b = a(this), e = a(this).data("resizable-alsoresize"), f = {}, g = d && d.length ? d : b.parents(c.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"]; a.each(g, function (a, b) { var c = (e[b] || 0) + (h[b] || 0); c && c >= 0 && (f[b] = c || null) }), b.css(f) }) }; typeof e.alsoResize == "object" && !e.alsoResize.nodeType ? a.each(e.alsoResize, function (a, b) { i(a, b) }) : i(e.alsoResize) }, stop: function (b, c) { a(this).removeData("resizable-alsoresize") } }), a.ui.plugin.add("resizable", "animate", { stop: function (b, c) { var d = a(this).data("resizable"), e = d.options, f = d._proportionallyResizeElements, g = f.length && /textarea/i.test(f[0].nodeName), h = g && a.ui.hasScroll(f[0], "left") ? 0 : d.sizeDiff.height, i = g ? 0 : d.sizeDiff.width, j = { width: d.size.width - i, height: d.size.height - h }, k = parseInt(d.element.css("left"), 10) + (d.position.left - d.originalPosition.left) || null, l = parseInt(d.element.css("top"), 10) + (d.position.top - d.originalPosition.top) || null; d.element.animate(a.extend(j, l && k ? { top: l, left: k} : {}), { duration: e.animateDuration, easing: e.animateEasing, step: function () { var c = { width: parseInt(d.element.css("width"), 10), height: parseInt(d.element.css("height"), 10), top: parseInt(d.element.css("top"), 10), left: parseInt(d.element.css("left"), 10) }; f && f.length && a(f[0]).css({ width: c.width, height: c.height }), d._updateCache(c), d._propagate("resize", b) } }) } }), a.ui.plugin.add("resizable", "containment", { start: function (b, d) { var e = a(this).data("resizable"), f = e.options, g = e.element, h = f.containment, i = h instanceof a ? h.get(0) : /parent/.test(h) ? g.parent().get(0) : h; if (!!i) { e.containerElement = a(i); if (/document/.test(h) || h == document) e.containerOffset = { left: 0, top: 0 }, e.containerPosition = { left: 0, top: 0 }, e.parentData = { element: a(document), left: 0, top: 0, width: a(document).width(), height: a(document).height() || document.body.parentNode.scrollHeight }; else { var j = a(i), k = []; a(["Top", "Right", "Left", "Bottom"]).each(function (a, b) { k[a] = c(j.css("padding" + b)) }), e.containerOffset = j.offset(), e.containerPosition = j.position(), e.containerSize = { height: j.innerHeight() - k[3], width: j.innerWidth() - k[1] }; var l = e.containerOffset, m = e.containerSize.height, n = e.containerSize.width, o = a.ui.hasScroll(i, "left") ? i.scrollWidth : n, p = a.ui.hasScroll(i) ? i.scrollHeight : m; e.parentData = { element: i, left: l.left, top: l.top, width: o, height: p} } } }, resize: function (b, c) { var d = a(this).data("resizable"), e = d.options, f = d.containerSize, g = d.containerOffset, h = d.size, i = d.position, j = d._aspectRatio || b.shiftKey, k = { top: 0, left: 0 }, l = d.containerElement; l[0] != document && /static/.test(l.css("position")) && (k = g), i.left < (d._helper ? g.left : 0) && (d.size.width = d.size.width + (d._helper ? d.position.left - g.left : d.position.left - k.left), j && (d.size.height = d.size.width / e.aspectRatio), d.position.left = e.helper ? g.left : 0), i.top < (d._helper ? g.top : 0) && (d.size.height = d.size.height + (d._helper ? d.position.top - g.top : d.position.top), j && (d.size.width = d.size.height * e.aspectRatio), d.position.top = d._helper ? g.top : 0), d.offset.left = d.parentData.left + d.position.left, d.offset.top = d.parentData.top + d.position.top; var m = Math.abs((d._helper ? d.offset.left - k.left : d.offset.left - k.left) + d.sizeDiff.width), n = Math.abs((d._helper ? d.offset.top - k.top : d.offset.top - g.top) + d.sizeDiff.height), o = d.containerElement.get(0) == d.element.parent().get(0), p = /relative|absolute/.test(d.containerElement.css("position")); o && p && (m -= d.parentData.left), m + d.size.width >= d.parentData.width && (d.size.width = d.parentData.width - m, j && (d.size.height = d.size.width / d.aspectRatio)), n + d.size.height >= d.parentData.height && (d.size.height = d.parentData.height - n, j && (d.size.width = d.size.height * d.aspectRatio)) }, stop: function (b, c) { var d = a(this).data("resizable"), e = d.options, f = d.position, g = d.containerOffset, h = d.containerPosition, i = d.containerElement, j = a(d.helper), k = j.offset(), l = j.outerWidth() - d.sizeDiff.width, m = j.outerHeight() - d.sizeDiff.height; d._helper && !e.animate && /relative/.test(i.css("position")) && a(this).css({ left: k.left - h.left - g.left, width: l, height: m }), d._helper && !e.animate && /static/.test(i.css("position")) && a(this).css({ left: k.left - h.left - g.left, width: l, height: m }) } }), a.ui.plugin.add("resizable", "ghost", { start: function (b, c) { var d = a(this).data("resizable"), e = d.options, f = d.size; d.ghost = d.originalElement.clone(), d.ghost.css({ opacity: .25, display: "block", position: "relative", height: f.height, width: f.width, margin: 0, left: 0, top: 0 }).addClass("ui-resizable-ghost").addClass(typeof e.ghost == "string" ? e.ghost : ""), d.ghost.appendTo(d.helper) }, resize: function (b, c) { var d = a(this).data("resizable"), e = d.options; d.ghost && d.ghost.css({ position: "relative", height: d.size.height, width: d.size.width }) }, stop: function (b, c) { var d = a(this).data("resizable"), e = d.options; d.ghost && d.helper && d.helper.get(0).removeChild(d.ghost.get(0)) } }), a.ui.plugin.add("resizable", "grid", { resize: function (b, c) { var d = a(this).data("resizable"), e = d.options, f = d.size, g = d.originalSize, h = d.originalPosition, i = d.axis, j = e._aspectRatio || b.shiftKey; e.grid = typeof e.grid == "number" ? [e.grid, e.grid] : e.grid; var k = Math.round((f.width - g.width) / (e.grid[0] || 1)) * (e.grid[0] || 1), l = Math.round((f.height - g.height) / (e.grid[1] || 1)) * (e.grid[1] || 1); /^(se|s|e)$/.test(i) ? (d.size.width = g.width + k, d.size.height = g.height + l) : /^(ne)$/.test(i) ? (d.size.width = g.width + k, d.size.height = g.height + l, d.position.top = h.top - l) : /^(sw)$/.test(i) ? (d.size.width = g.width + k, d.size.height = g.height + l, d.position.left = h.left - k) : (d.size.width = g.width + k, d.size.height = g.height + l, d.position.top = h.top - l, d.position.left = h.left - k) } }); var c = function (a) { return parseInt(a, 10) || 0 }, d = function (a) { return !isNaN(parseInt(a, 10)) } })(jQuery); /*
 * jQuery UI Selectable 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Selectables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function (a, b) { a.widget("ui.selectable", a.ui.mouse, { options: { appendTo: "body", autoRefresh: !0, distance: 0, filter: "*", tolerance: "touch" }, _create: function () { var b = this; this.element.addClass("ui-selectable"), this.dragged = !1; var c; this.refresh = function () { c = a(b.options.filter, b.element[0]), c.addClass("ui-selectee"), c.each(function () { var b = a(this), c = b.offset(); a.data(this, "selectable-item", { element: this, $element: b, left: c.left, top: c.top, right: c.left + b.outerWidth(), bottom: c.top + b.outerHeight(), startselected: !1, selected: b.hasClass("ui-selected"), selecting: b.hasClass("ui-selecting"), unselecting: b.hasClass("ui-unselecting") }) }) }, this.refresh(), this.selectees = c.addClass("ui-selectee"), this._mouseInit(), this.helper = a("<div class='ui-selectable-helper'></div>") }, destroy: function () { this.selectees.removeClass("ui-selectee").removeData("selectable-item"), this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable"), this._mouseDestroy(); return this }, _mouseStart: function (b) { var c = this; this.opos = [b.pageX, b.pageY]; if (!this.options.disabled) { var d = this.options; this.selectees = a(d.filter, this.element[0]), this._trigger("start", b), a(d.appendTo).append(this.helper), this.helper.css({ left: b.clientX, top: b.clientY, width: 0, height: 0 }), d.autoRefresh && this.refresh(), this.selectees.filter(".ui-selected").each(function () { var d = a.data(this, "selectable-item"); d.startselected = !0, !b.metaKey && !b.ctrlKey && (d.$element.removeClass("ui-selected"), d.selected = !1, d.$element.addClass("ui-unselecting"), d.unselecting = !0, c._trigger("unselecting", b, { unselecting: d.element })) }), a(b.target).parents().andSelf().each(function () { var d = a.data(this, "selectable-item"); if (d) { var e = !b.metaKey && !b.ctrlKey || !d.$element.hasClass("ui-selected"); d.$element.removeClass(e ? "ui-unselecting" : "ui-selected").addClass(e ? "ui-selecting" : "ui-unselecting"), d.unselecting = !e, d.selecting = e, d.selected = e, e ? c._trigger("selecting", b, { selecting: d.element }) : c._trigger("unselecting", b, { unselecting: d.element }); return !1 } }) } }, _mouseDrag: function (b) { var c = this; this.dragged = !0; if (!this.options.disabled) { var d = this.options, e = this.opos[0], f = this.opos[1], g = b.pageX, h = b.pageY; if (e > g) { var i = g; g = e, e = i } if (f > h) { var i = h; h = f, f = i } this.helper.css({ left: e, top: f, width: g - e, height: h - f }), this.selectees.each(function () { var i = a.data(this, "selectable-item"); if (!!i && i.element != c.element[0]) { var j = !1; d.tolerance == "touch" ? j = !(i.left > g || i.right < e || i.top > h || i.bottom < f) : d.tolerance == "fit" && (j = i.left > e && i.right < g && i.top > f && i.bottom < h), j ? (i.selected && (i.$element.removeClass("ui-selected"), i.selected = !1), i.unselecting && (i.$element.removeClass("ui-unselecting"), i.unselecting = !1), i.selecting || (i.$element.addClass("ui-selecting"), i.selecting = !0, c._trigger("selecting", b, { selecting: i.element }))) : (i.selecting && ((b.metaKey || b.ctrlKey) && i.startselected ? (i.$element.removeClass("ui-selecting"), i.selecting = !1, i.$element.addClass("ui-selected"), i.selected = !0) : (i.$element.removeClass("ui-selecting"), i.selecting = !1, i.startselected && (i.$element.addClass("ui-unselecting"), i.unselecting = !0), c._trigger("unselecting", b, { unselecting: i.element }))), i.selected && !b.metaKey && !b.ctrlKey && !i.startselected && (i.$element.removeClass("ui-selected"), i.selected = !1, i.$element.addClass("ui-unselecting"), i.unselecting = !0, c._trigger("unselecting", b, { unselecting: i.element }))) } }); return !1 } }, _mouseStop: function (b) { var c = this; this.dragged = !1; var d = this.options; a(".ui-unselecting", this.element[0]).each(function () { var d = a.data(this, "selectable-item"); d.$element.removeClass("ui-unselecting"), d.unselecting = !1, d.startselected = !1, c._trigger("unselected", b, { unselected: d.element }) }), a(".ui-selecting", this.element[0]).each(function () { var d = a.data(this, "selectable-item"); d.$element.removeClass("ui-selecting").addClass("ui-selected"), d.selecting = !1, d.selected = !0, d.startselected = !0, c._trigger("selected", b, { selected: d.element }) }), this._trigger("stop", b), this.helper.remove(); return !1 } }), a.extend(a.ui.selectable, { version: "1.8.18" }) })(jQuery); /*
 * jQuery UI Sortable 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
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
(function (a, b) { a.widget("ui.sortable", a.ui.mouse, { widgetEventPrefix: "sort", ready: !1, options: { appendTo: "parent", axis: !1, connectWith: !1, containment: !1, cursor: "auto", cursorAt: !1, dropOnEmpty: !0, forcePlaceholderSize: !1, forceHelperSize: !1, grid: !1, handle: !1, helper: "original", items: "> *", opacity: !1, placeholder: !1, revert: !1, scroll: !0, scrollSensitivity: 20, scrollSpeed: 20, scope: "default", tolerance: "intersect", zIndex: 1e3 }, _create: function () { var a = this.options; this.containerCache = {}, this.element.addClass("ui-sortable"), this.refresh(), this.floating = this.items.length ? a.axis === "x" || /left|right/.test(this.items[0].item.css("float")) || /inline|table-cell/.test(this.items[0].item.css("display")) : !1, this.offset = this.element.offset(), this._mouseInit(), this.ready = !0 }, destroy: function () { a.Widget.prototype.destroy.call(this), this.element.removeClass("ui-sortable ui-sortable-disabled"), this._mouseDestroy(); for (var b = this.items.length - 1; b >= 0; b--) this.items[b].item.removeData(this.widgetName + "-item"); return this }, _setOption: function (b, c) { b === "disabled" ? (this.options[b] = c, this.widget()[c ? "addClass" : "removeClass"]("ui-sortable-disabled")) : a.Widget.prototype._setOption.apply(this, arguments) }, _mouseCapture: function (b, c) { var d = this; if (this.reverting) return !1; if (this.options.disabled || this.options.type == "static") return !1; this._refreshItems(b); var e = null, f = this, g = a(b.target).parents().each(function () { if (a.data(this, d.widgetName + "-item") == f) { e = a(this); return !1 } }); a.data(b.target, d.widgetName + "-item") == f && (e = a(b.target)); if (!e) return !1; if (this.options.handle && !c) { var h = !1; a(this.options.handle, e).find("*").andSelf().each(function () { this == b.target && (h = !0) }); if (!h) return !1 } this.currentItem = e, this._removeCurrentsFromItems(); return !0 }, _mouseStart: function (b, c, d) { var e = this.options, f = this; this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(b), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = { top: this.offset.top - this.margins.top, left: this.offset.left - this.margins.left }, this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), a.extend(this.offset, { click: { left: b.pageX - this.offset.left, top: b.pageY - this.offset.top }, parent: this._getParentOffset(), relative: this._getRelativeOffset() }), this.originalPosition = this._generatePosition(b), this.originalPageX = b.pageX, this.originalPageY = b.pageY, e.cursorAt && this._adjustOffsetFromHelper(e.cursorAt), this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] }, this.helper[0] != this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), e.containment && this._setContainment(), e.cursor && (a("body").css("cursor") && (this._storedCursor = a("body").css("cursor")), a("body").css("cursor", e.cursor)), e.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", e.opacity)), e.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", e.zIndex)), this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML" && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", b, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(); if (!d) for (var g = this.containers.length - 1; g >= 0; g--) this.containers[g]._trigger("activate", b, f._uiHash(this)); a.ui.ddmanager && (a.ui.ddmanager.current = this), a.ui.ddmanager && !e.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, b), this.dragging = !0, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(b); return !0 }, _mouseDrag: function (b) { this.position = this._generatePosition(b), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs); if (this.options.scroll) { var c = this.options, d = !1; this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML" ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - b.pageY < c.scrollSensitivity ? this.scrollParent[0].scrollTop = d = this.scrollParent[0].scrollTop + c.scrollSpeed : b.pageY - this.overflowOffset.top < c.scrollSensitivity && (this.scrollParent[0].scrollTop = d = this.scrollParent[0].scrollTop - c.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - b.pageX < c.scrollSensitivity ? this.scrollParent[0].scrollLeft = d = this.scrollParent[0].scrollLeft + c.scrollSpeed : b.pageX - this.overflowOffset.left < c.scrollSensitivity && (this.scrollParent[0].scrollLeft = d = this.scrollParent[0].scrollLeft - c.scrollSpeed)) : (b.pageY - a(document).scrollTop() < c.scrollSensitivity ? d = a(document).scrollTop(a(document).scrollTop() - c.scrollSpeed) : a(window).height() - (b.pageY - a(document).scrollTop()) < c.scrollSensitivity && (d = a(document).scrollTop(a(document).scrollTop() + c.scrollSpeed)), b.pageX - a(document).scrollLeft() < c.scrollSensitivity ? d = a(document).scrollLeft(a(document).scrollLeft() - c.scrollSpeed) : a(window).width() - (b.pageX - a(document).scrollLeft()) < c.scrollSensitivity && (d = a(document).scrollLeft(a(document).scrollLeft() + c.scrollSpeed))), d !== !1 && a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, b) } this.positionAbs = this._convertPositionTo("absolute"); if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + "px"; if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + "px"; for (var e = this.items.length - 1; e >= 0; e--) { var f = this.items[e], g = f.item[0], h = this._intersectsWithPointer(f); if (!h) continue; if (g != this.currentItem[0] && this.placeholder[h == 1 ? "next" : "prev"]()[0] != g && !a.ui.contains(this.placeholder[0], g) && (this.options.type == "semi-dynamic" ? !a.ui.contains(this.element[0], g) : !0)) { this.direction = h == 1 ? "down" : "up"; if (this.options.tolerance == "pointer" || this._intersectsWithSides(f)) this._rearrange(b, f); else break; this._trigger("change", b, this._uiHash()); break } } this._contactContainers(b), a.ui.ddmanager && a.ui.ddmanager.drag(this, b), this._trigger("sort", b, this._uiHash()), this.lastPositionAbs = this.positionAbs; return !1 }, _mouseStop: function (b, c) { if (!!b) { a.ui.ddmanager && !this.options.dropBehaviour && a.ui.ddmanager.drop(this, b); if (this.options.revert) { var d = this, e = d.placeholder.offset(); d.reverting = !0, a(this.helper).animate({ left: e.left - this.offset.parent.left - d.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft), top: e.top - this.offset.parent.top - d.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop) }, parseInt(this.options.revert, 10) || 500, function () { d._clear(b) }) } else this._clear(b, c); return !1 } }, cancel: function () { var b = this; if (this.dragging) { this._mouseUp({ target: null }), this.options.helper == "original" ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show(); for (var c = this.containers.length - 1; c >= 0; c--) this.containers[c]._trigger("deactivate", null, b._uiHash(this)), this.containers[c].containerCache.over && (this.containers[c]._trigger("out", null, b._uiHash(this)), this.containers[c].containerCache.over = 0) } this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.options.helper != "original" && this.helper && this.helper[0].parentNode && this.helper.remove(), a.extend(this, { helper: null, dragging: !1, reverting: !1, _noFinalSort: null }), this.domPosition.prev ? a(this.domPosition.prev).after(this.currentItem) : a(this.domPosition.parent).prepend(this.currentItem)); return this }, serialize: function (b) { var c = this._getItemsAsjQuery(b && b.connected), d = []; b = b || {}, a(c).each(function () { var c = (a(b.item || this).attr(b.attribute || "id") || "").match(b.expression || /(.+)[-=_](.+)/); c && d.push((b.key || c[1] + "[]") + "=" + (b.key && b.expression ? c[1] : c[2])) }), !d.length && b.key && d.push(b.key + "="); return d.join("&") }, toArray: function (b) { var c = this._getItemsAsjQuery(b && b.connected), d = []; b = b || {}, c.each(function () { d.push(a(b.item || this).attr(b.attribute || "id") || "") }); return d }, _intersectsWith: function (a) { var b = this.positionAbs.left, c = b + this.helperProportions.width, d = this.positionAbs.top, e = d + this.helperProportions.height, f = a.left, g = f + a.width, h = a.top, i = h + a.height, j = this.offset.click.top, k = this.offset.click.left, l = d + j > h && d + j < i && b + k > f && b + k < g; return this.options.tolerance == "pointer" || this.options.forcePointerForContainers || this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > a[this.floating ? "width" : "height"] ? l : f < b + this.helperProportions.width / 2 && c - this.helperProportions.width / 2 < g && h < d + this.helperProportions.height / 2 && e - this.helperProportions.height / 2 < i }, _intersectsWithPointer: function (b) { var c = a.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, b.top, b.height), d = a.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, b.left, b.width), e = c && d, f = this._getDragVerticalDirection(), g = this._getDragHorizontalDirection(); if (!e) return !1; return this.floating ? g && g == "right" || f == "down" ? 2 : 1 : f && (f == "down" ? 2 : 1) }, _intersectsWithSides: function (b) { var c = a.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, b.top + b.height / 2, b.height), d = a.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, b.left + b.width / 2, b.width), e = this._getDragVerticalDirection(), f = this._getDragHorizontalDirection(); return this.floating && f ? f == "right" && d || f == "left" && !d : e && (e == "down" && c || e == "up" && !c) }, _getDragVerticalDirection: function () { var a = this.positionAbs.top - this.lastPositionAbs.top; return a != 0 && (a > 0 ? "down" : "up") }, _getDragHorizontalDirection: function () { var a = this.positionAbs.left - this.lastPositionAbs.left; return a != 0 && (a > 0 ? "right" : "left") }, refresh: function (a) { this._refreshItems(a), this.refreshPositions(); return this }, _connectWith: function () { var a = this.options; return a.connectWith.constructor == String ? [a.connectWith] : a.connectWith }, _getItemsAsjQuery: function (b) { var c = this, d = [], e = [], f = this._connectWith(); if (f && b) for (var g = f.length - 1; g >= 0; g--) { var h = a(f[g]); for (var i = h.length - 1; i >= 0; i--) { var j = a.data(h[i], this.widgetName); j && j != this && !j.options.disabled && e.push([a.isFunction(j.options.items) ? j.options.items.call(j.element) : a(j.options.items, j.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), j]) } } e.push([a.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : a(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]); for (var g = e.length - 1; g >= 0; g--) e[g][0].each(function () { d.push(this) }); return a(d) }, _removeCurrentsFromItems: function () { var a = this.currentItem.find(":data(" + this.widgetName + "-item)"); for (var b = 0; b < this.items.length; b++) for (var c = 0; c < a.length; c++) a[c] == this.items[b].item[0] && this.items.splice(b, 1) }, _refreshItems: function (b) { this.items = [], this.containers = [this]; var c = this.items, d = this, e = [[a.isFunction(this.options.items) ? this.options.items.call(this.element[0], b, { item: this.currentItem }) : a(this.options.items, this.element), this]], f = this._connectWith(); if (f && this.ready) for (var g = f.length - 1; g >= 0; g--) { var h = a(f[g]); for (var i = h.length - 1; i >= 0; i--) { var j = a.data(h[i], this.widgetName); j && j != this && !j.options.disabled && (e.push([a.isFunction(j.options.items) ? j.options.items.call(j.element[0], b, { item: this.currentItem }) : a(j.options.items, j.element), j]), this.containers.push(j)) } } for (var g = e.length - 1; g >= 0; g--) { var k = e[g][1], l = e[g][0]; for (var i = 0, m = l.length; i < m; i++) { var n = a(l[i]); n.data(this.widgetName + "-item", k), c.push({ item: n, instance: k, width: 0, height: 0, left: 0, top: 0 }) } } }, refreshPositions: function (b) { this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset()); for (var c = this.items.length - 1; c >= 0; c--) { var d = this.items[c]; if (d.instance != this.currentContainer && this.currentContainer && d.item[0] != this.currentItem[0]) continue; var e = this.options.toleranceElement ? a(this.options.toleranceElement, d.item) : d.item; b || (d.width = e.outerWidth(), d.height = e.outerHeight()); var f = e.offset(); d.left = f.left, d.top = f.top } if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this); else for (var c = this.containers.length - 1; c >= 0; c--) { var f = this.containers[c].element.offset(); this.containers[c].containerCache.left = f.left, this.containers[c].containerCache.top = f.top, this.containers[c].containerCache.width = this.containers[c].element.outerWidth(), this.containers[c].containerCache.height = this.containers[c].element.outerHeight() } return this }, _createPlaceholder: function (b) { var c = b || this, d = c.options; if (!d.placeholder || d.placeholder.constructor == String) { var e = d.placeholder; d.placeholder = { element: function () { var b = a(document.createElement(c.currentItem[0].nodeName)).addClass(e || c.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0]; e || (b.style.visibility = "hidden"); return b }, update: function (a, b) { if (!e || !!d.forcePlaceholderSize) b.height() || b.height(c.currentItem.innerHeight() - parseInt(c.currentItem.css("paddingTop") || 0, 10) - parseInt(c.currentItem.css("paddingBottom") || 0, 10)), b.width() || b.width(c.currentItem.innerWidth() - parseInt(c.currentItem.css("paddingLeft") || 0, 10) - parseInt(c.currentItem.css("paddingRight") || 0, 10)) } } } c.placeholder = a(d.placeholder.element.call(c.element, c.currentItem)), c.currentItem.after(c.placeholder), d.placeholder.update(c, c.placeholder) }, _contactContainers: function (b) { var c = null, d = null; for (var e = this.containers.length - 1; e >= 0; e--) { if (a.ui.contains(this.currentItem[0], this.containers[e].element[0])) continue; if (this._intersectsWith(this.containers[e].containerCache)) { if (c && a.ui.contains(this.containers[e].element[0], c.element[0])) continue; c = this.containers[e], d = e } else this.containers[e].containerCache.over && (this.containers[e]._trigger("out", b, this._uiHash(this)), this.containers[e].containerCache.over = 0) } if (!!c) if (this.containers.length === 1) this.containers[d]._trigger("over", b, this._uiHash(this)), this.containers[d].containerCache.over = 1; else if (this.currentContainer != this.containers[d]) { var f = 1e4, g = null, h = this.positionAbs[this.containers[d].floating ? "left" : "top"]; for (var i = this.items.length - 1; i >= 0; i--) { if (!a.ui.contains(this.containers[d].element[0], this.items[i].item[0])) continue; var j = this.items[i][this.containers[d].floating ? "left" : "top"]; Math.abs(j - h) < f && (f = Math.abs(j - h), g = this.items[i]) } if (!g && !this.options.dropOnEmpty) return; this.currentContainer = this.containers[d], g ? this._rearrange(b, g, null, !0) : this._rearrange(b, null, this.containers[d].element, !0), this._trigger("change", b, this._uiHash()), this.containers[d]._trigger("change", b, this._uiHash(this)), this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[d]._trigger("over", b, this._uiHash(this)), this.containers[d].containerCache.over = 1 } }, _createHelper: function (b) { var c = this.options, d = a.isFunction(c.helper) ? a(c.helper.apply(this.element[0], [b, this.currentItem])) : c.helper == "clone" ? this.currentItem.clone() : this.currentItem; d.parents("body").length || a(c.appendTo != "parent" ? c.appendTo : this.currentItem[0].parentNode)[0].appendChild(d[0]), d[0] == this.currentItem[0] && (this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") }), (d[0].style.width == "" || c.forceHelperSize) && d.width(this.currentItem.width()), (d[0].style.height == "" || c.forceHelperSize) && d.height(this.currentItem.height()); return d }, _adjustOffsetFromHelper: function (b) { typeof b == "string" && (b = b.split(" ")), a.isArray(b) && (b = { left: +b[0], top: +b[1] || 0 }), "left" in b && (this.offset.click.left = b.left + this.margins.left), "right" in b && (this.offset.click.left = this.helperProportions.width - b.right + this.margins.left), "top" in b && (this.offset.click.top = b.top + this.margins.top), "bottom" in b && (this.offset.click.top = this.helperProportions.height - b.bottom + this.margins.top) }, _getParentOffset: function () { this.offsetParent = this.helper.offsetParent(); var b = this.offsetParent.offset(); this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0]) && (b.left += this.scrollParent.scrollLeft(), b.top += this.scrollParent.scrollTop()); if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie) b = { top: 0, left: 0 }; return { top: b.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left: b.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)} }, _getRelativeOffset: function () { if (this.cssPosition == "relative") { var a = this.currentItem.position(); return { top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()} } return { top: 0, left: 0} }, _cacheMargins: function () { this.margins = { left: parseInt(this.currentItem.css("marginLeft"), 10) || 0, top: parseInt(this.currentItem.css("marginTop"), 10) || 0} }, _cacheHelperProportions: function () { this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight()} }, _setContainment: function () { var b = this.options; b.containment == "parent" && (b.containment = this.helper[0].parentNode); if (b.containment == "document" || b.containment == "window") this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, a(b.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (a(b.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]; if (!/^(document|window|parent)$/.test(b.containment)) { var c = a(b.containment)[0], d = a(b.containment).offset(), e = a(c).css("overflow") != "hidden"; this.containment = [d.left + (parseInt(a(c).css("borderLeftWidth"), 10) || 0) + (parseInt(a(c).css("paddingLeft"), 10) || 0) - this.margins.left, d.top + (parseInt(a(c).css("borderTopWidth"), 10) || 0) + (parseInt(a(c).css("paddingTop"), 10) || 0) - this.margins.top, d.left + (e ? Math.max(c.scrollWidth, c.offsetWidth) : c.offsetWidth) - (parseInt(a(c).css("borderLeftWidth"), 10) || 0) - (parseInt(a(c).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, d.top + (e ? Math.max(c.scrollHeight, c.offsetHeight) : c.offsetHeight) - (parseInt(a(c).css("borderTopWidth"), 10) || 0) - (parseInt(a(c).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top] } }, _convertPositionTo: function (b, c) { c || (c = this.position); var d = b == "absolute" ? 1 : -1, e = this.options, f = this.cssPosition == "absolute" && (this.scrollParent[0] == document || !a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, g = /(html|body)/i.test(f[0].tagName); return { top: c.top + this.offset.relative.top * d + this.offset.parent.top * d - (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : g ? 0 : f.scrollTop()) * d), left: c.left + this.offset.relative.left * d + this.offset.parent.left * d - (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : g ? 0 : f.scrollLeft()) * d)} }, _generatePosition: function (b) { var c = this.options, d = this.cssPosition == "absolute" && (this.scrollParent[0] == document || !a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, e = /(html|body)/i.test(d[0].tagName); this.cssPosition == "relative" && (this.scrollParent[0] == document || this.scrollParent[0] == this.offsetParent[0]) && (this.offset.relative = this._getRelativeOffset()); var f = b.pageX, g = b.pageY; if (this.originalPosition) { this.containment && (b.pageX - this.offset.click.left < this.containment[0] && (f = this.containment[0] + this.offset.click.left), b.pageY - this.offset.click.top < this.containment[1] && (g = this.containment[1] + this.offset.click.top), b.pageX - this.offset.click.left > this.containment[2] && (f = this.containment[2] + this.offset.click.left), b.pageY - this.offset.click.top > this.containment[3] && (g = this.containment[3] + this.offset.click.top)); if (c.grid) { var h = this.originalPageY + Math.round((g - this.originalPageY) / c.grid[1]) * c.grid[1]; g = this.containment ? h - this.offset.click.top < this.containment[1] || h - this.offset.click.top > this.containment[3] ? h - this.offset.click.top < this.containment[1] ? h + c.grid[1] : h - c.grid[1] : h : h; var i = this.originalPageX + Math.round((f - this.originalPageX) / c.grid[0]) * c.grid[0]; f = this.containment ? i - this.offset.click.left < this.containment[0] || i - this.offset.click.left > this.containment[2] ? i - this.offset.click.left < this.containment[0] ? i + c.grid[0] : i - c.grid[0] : i : i } } return { top: g - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : d.scrollTop()), left: f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : d.scrollLeft())} }, _rearrange: function (a, b, c, d) { c ? c[0].appendChild(this.placeholder[0]) : b.item[0].parentNode.insertBefore(this.placeholder[0], this.direction == "down" ? b.item[0] : b.item[0].nextSibling), this.counter = this.counter ? ++this.counter : 1; var e = this, f = this.counter; window.setTimeout(function () { f == e.counter && e.refreshPositions(!d) }, 0) }, _clear: function (b, c) { this.reverting = !1; var d = [], e = this; !this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null; if (this.helper[0] == this.currentItem[0]) { for (var f in this._storedCSS) if (this._storedCSS[f] == "auto" || this._storedCSS[f] == "static") this._storedCSS[f] = ""; this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") } else this.currentItem.show(); this.fromOutside && !c && d.push(function (a) { this._trigger("receive", a, this._uiHash(this.fromOutside)) }), (this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !c && d.push(function (a) { this._trigger("update", a, this._uiHash()) }); if (!a.ui.contains(this.element[0], this.currentItem[0])) { c || d.push(function (a) { this._trigger("remove", a, this._uiHash()) }); for (var f = this.containers.length - 1; f >= 0; f--) a.ui.contains(this.containers[f].element[0], this.currentItem[0]) && !c && (d.push(function (a) { return function (b) { a._trigger("receive", b, this._uiHash(this)) } } .call(this, this.containers[f])), d.push(function (a) { return function (b) { a._trigger("update", b, this._uiHash(this)) } } .call(this, this.containers[f]))) } for (var f = this.containers.length - 1; f >= 0; f--) c || d.push(function (a) { return function (b) { a._trigger("deactivate", b, this._uiHash(this)) } } .call(this, this.containers[f])), this.containers[f].containerCache.over && (d.push(function (a) { return function (b) { a._trigger("out", b, this._uiHash(this)) } } .call(this, this.containers[f])), this.containers[f].containerCache.over = 0); this._storedCursor && a("body").css("cursor", this._storedCursor), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", this._storedZIndex == "auto" ? "" : this._storedZIndex), this.dragging = !1; if (this.cancelHelperRemoval) { if (!c) { this._trigger("beforeStop", b, this._uiHash()); for (var f = 0; f < d.length; f++) d[f].call(this, b); this._trigger("stop", b, this._uiHash()) } return !1 } c || this._trigger("beforeStop", b, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.helper[0] != this.currentItem[0] && this.helper.remove(), this.helper = null; if (!c) { for (var f = 0; f < d.length; f++) d[f].call(this, b); this._trigger("stop", b, this._uiHash()) } this.fromOutside = !1; return !0 }, _trigger: function () { a.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel() }, _uiHash: function (b) { var c = b || this; return { helper: c.helper, placeholder: c.placeholder || a([]), position: c.position, originalPosition: c.originalPosition, offset: c.positionAbs, item: c.currentItem, sender: b ? b.element : null} } }), a.extend(a.ui.sortable, { version: "1.8.18" }) })(jQuery); /*
* jQuery UI Accordion 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Accordion
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function (a, b) { a.widget("ui.accordion", { options: { active: 0, animated: "slide", autoHeight: !0, clearStyle: !1, collapsible: !1, event: "click", fillSpace: !1, header: "> li > :first-child,> :not(li):even", icons: { header: "ui-icon-triangle-1-e", headerSelected: "ui-icon-triangle-1-s" }, navigation: !1, navigationFilter: function () { return this.href.toLowerCase() === location.href.toLowerCase() } }, _create: function () { var b = this, c = b.options; b.running = 0, b.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix"), b.headers = b.element.find(c.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion", function () { c.disabled || a(this).addClass("ui-state-hover") }).bind("mouseleave.accordion", function () { c.disabled || a(this).removeClass("ui-state-hover") }).bind("focus.accordion", function () { c.disabled || a(this).addClass("ui-state-focus") }).bind("blur.accordion", function () { c.disabled || a(this).removeClass("ui-state-focus") }), b.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom"); if (c.navigation) { var d = b.element.find("a").filter(c.navigationFilter).eq(0); if (d.length) { var e = d.closest(".ui-accordion-header"); e.length ? b.active = e : b.active = d.closest(".ui-accordion-content").prev() } } b.active = b._findActive(b.active || c.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top"), b.active.next().addClass("ui-accordion-content-active"), b._createIcons(), b.resize(), b.element.attr("role", "tablist"), b.headers.attr("role", "tab").bind("keydown.accordion", function (a) { return b._keydown(a) }).next().attr("role", "tabpanel"), b.headers.not(b.active || "").attr({ "aria-expanded": "false", "aria-selected": "false", tabIndex: -1 }).next().hide(), b.active.length ? b.active.attr({ "aria-expanded": "true", "aria-selected": "true", tabIndex: 0 }) : b.headers.eq(0).attr("tabIndex", 0), a.browser.safari || b.headers.find("a").attr("tabIndex", -1), c.event && b.headers.bind(c.event.split(" ").join(".accordion ") + ".accordion", function (a) { b._clickHandler.call(b, a, this), a.preventDefault() }) }, _createIcons: function () { var b = this.options; b.icons && (a("<span></span>").addClass("ui-icon " + b.icons.header).prependTo(this.headers), this.active.children(".ui-icon").toggleClass(b.icons.header).toggleClass(b.icons.headerSelected), this.element.addClass("ui-accordion-icons")) }, _destroyIcons: function () { this.headers.children(".ui-icon").remove(), this.element.removeClass("ui-accordion-icons") }, destroy: function () { var b = this.options; this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"), this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex"), this.headers.find("a").removeAttr("tabIndex"), this._destroyIcons(); var c = this.headers.next().css("display", "").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled"); (b.autoHeight || b.fillHeight) && c.css("height", ""); return a.Widget.prototype.destroy.call(this) }, _setOption: function (b, c) { a.Widget.prototype._setOption.apply(this, arguments), b == "active" && this.activate(c), b == "icons" && (this._destroyIcons(), c && this._createIcons()), b == "disabled" && this.headers.add(this.headers.next())[c ? "addClass" : "removeClass"]("ui-accordion-disabled ui-state-disabled") }, _keydown: function (b) { if (!(this.options.disabled || b.altKey || b.ctrlKey)) { var c = a.ui.keyCode, d = this.headers.length, e = this.headers.index(b.target), f = !1; switch (b.keyCode) { case c.RIGHT: case c.DOWN: f = this.headers[(e + 1) % d]; break; case c.LEFT: case c.UP: f = this.headers[(e - 1 + d) % d]; break; case c.SPACE: case c.ENTER: this._clickHandler({ target: b.target }, b.target), b.preventDefault() } if (f) { a(b.target).attr("tabIndex", -1), a(f).attr("tabIndex", 0), f.focus(); return !1 } return !0 } }, resize: function () { var b = this.options, c; if (b.fillSpace) { if (a.browser.msie) { var d = this.element.parent().css("overflow"); this.element.parent().css("overflow", "hidden") } c = this.element.parent().height(), a.browser.msie && this.element.parent().css("overflow", d), this.headers.each(function () { c -= a(this).outerHeight(!0) }), this.headers.next().each(function () { a(this).height(Math.max(0, c - a(this).innerHeight() + a(this).height())) }).css("overflow", "auto") } else b.autoHeight && (c = 0, this.headers.next().each(function () { c = Math.max(c, a(this).height("").height()) }).height(c)); return this }, activate: function (a) { this.options.active = a; var b = this._findActive(a)[0]; this._clickHandler({ target: b }, b); return this }, _findActive: function (b) { return b ? typeof b == "number" ? this.headers.filter(":eq(" + b + ")") : this.headers.not(this.headers.not(b)) : b === !1 ? a([]) : this.headers.filter(":eq(0)") }, _clickHandler: function (b, c) { var d = this.options; if (!d.disabled) { if (!b.target) { if (!d.collapsible) return; this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header), this.active.next().addClass("ui-accordion-content-active"); var e = this.active.next(), f = { options: d, newHeader: a([]), oldHeader: d.active, newContent: a([]), oldContent: e }, g = this.active = a([]); this._toggle(g, e, f); return } var h = a(b.currentTarget || c), i = h[0] === this.active[0]; d.active = d.collapsible && i ? !1 : this.headers.index(h); if (this.running || !d.collapsible && i) return; var j = this.active, g = h.next(), e = this.active.next(), f = { options: d, newHeader: i && d.collapsible ? a([]) : h, oldHeader: this.active, newContent: i && d.collapsible ? a([]) : g, oldContent: e }, k = this.headers.index(this.active[0]) > this.headers.index(h[0]); this.active = i ? a([]) : h, this._toggle(g, e, f, i, k), j.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header), i || (h.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(d.icons.header).addClass(d.icons.headerSelected), h.next().addClass("ui-accordion-content-active")); return } }, _toggle: function (b, c, d, e, f) { var g = this, h = g.options; g.toShow = b, g.toHide = c, g.data = d; var i = function () { if (!!g) return g._completed.apply(g, arguments) }; g._trigger("changestart", null, g.data), g.running = c.size() === 0 ? b.size() : c.size(); if (h.animated) { var j = {}; h.collapsible && e ? j = { toShow: a([]), toHide: c, complete: i, down: f, autoHeight: h.autoHeight || h.fillSpace} : j = { toShow: b, toHide: c, complete: i, down: f, autoHeight: h.autoHeight || h.fillSpace }, h.proxied || (h.proxied = h.animated), h.proxiedDuration || (h.proxiedDuration = h.duration), h.animated = a.isFunction(h.proxied) ? h.proxied(j) : h.proxied, h.duration = a.isFunction(h.proxiedDuration) ? h.proxiedDuration(j) : h.proxiedDuration; var k = a.ui.accordion.animations, l = h.duration, m = h.animated; m && !k[m] && !a.easing[m] && (m = "slide"), k[m] || (k[m] = function (a) { this.slide(a, { easing: m, duration: l || 700 }) }), k[m](j) } else h.collapsible && e ? b.toggle() : (c.hide(), b.show()), i(!0); c.prev().attr({ "aria-expanded": "false", "aria-selected": "false", tabIndex: -1 }).blur(), b.prev().attr({ "aria-expanded": "true", "aria-selected": "true", tabIndex: 0 }).focus() }, _completed: function (a) { this.running = a ? 0 : --this.running; this.running || (this.options.clearStyle && this.toShow.add(this.toHide).css({ height: "", overflow: "" }), this.toHide.removeClass("ui-accordion-content-active"), this.toHide.length && (this.toHide.parent()[0].className = this.toHide.parent()[0].className), this._trigger("change", null, this.data)) } }), a.extend(a.ui.accordion, { version: "1.8.18", animations: { slide: function (b, c) { b = a.extend({ easing: "swing", duration: 300 }, b, c); if (!b.toHide.size()) b.toShow.animate({ height: "show", paddingTop: "show", paddingBottom: "show" }, b); else { if (!b.toShow.size()) { b.toHide.animate({ height: "hide", paddingTop: "hide", paddingBottom: "hide" }, b); return } var d = b.toShow.css("overflow"), e = 0, f = {}, g = {}, h = ["height", "paddingTop", "paddingBottom"], i, j = b.toShow; i = j[0].style.width, j.width(j.parent().width() - parseFloat(j.css("paddingLeft")) - parseFloat(j.css("paddingRight")) - (parseFloat(j.css("borderLeftWidth")) || 0) - (parseFloat(j.css("borderRightWidth")) || 0)), a.each(h, function (c, d) { g[d] = "hide"; var e = ("" + a.css(b.toShow[0], d)).match(/^([\d+-.]+)(.*)$/); f[d] = { value: e[1], unit: e[2] || "px"} }), b.toShow.css({ height: 0, overflow: "hidden" }).show(), b.toHide.filter(":hidden").each(b.complete).end().filter(":visible").animate(g, { step: function (a, c) { c.prop == "height" && (e = c.end - c.start === 0 ? 0 : (c.now - c.start) / (c.end - c.start)), b.toShow[0].style[c.prop] = e * f[c.prop].value + f[c.prop].unit }, duration: b.duration, easing: b.easing, complete: function () { b.autoHeight || b.toShow.css("height", ""), b.toShow.css({ width: i, overflow: d }), b.complete() } }) } }, bounceslide: function (a) { this.slide(a, { easing: a.down ? "easeOutBounce" : "swing", duration: a.down ? 1e3 : 200 }) } } }) })(jQuery); /*
 * jQuery UI Autocomplete 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Autocomplete
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
(function (a, b) { var c = 0; a.widget("ui.autocomplete", { options: { appendTo: "body", autoFocus: !1, delay: 300, minLength: 1, position: { my: "left top", at: "left bottom", collision: "none" }, source: null }, pending: 0, _create: function () { var b = this, c = this.element[0].ownerDocument, d; this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off").attr({ role: "textbox", "aria-autocomplete": "list", "aria-haspopup": "true" }).bind("keydown.autocomplete", function (c) { if (!b.options.disabled && !b.element.propAttr("readOnly")) { d = !1; var e = a.ui.keyCode; switch (c.keyCode) { case e.PAGE_UP: b._move("previousPage", c); break; case e.PAGE_DOWN: b._move("nextPage", c); break; case e.UP: b._move("previous", c), c.preventDefault(); break; case e.DOWN: b._move("next", c), c.preventDefault(); break; case e.ENTER: case e.NUMPAD_ENTER: b.menu.active && (d = !0, c.preventDefault()); case e.TAB: if (!b.menu.active) return; b.menu.select(c); break; case e.ESCAPE: b.element.val(b.term), b.close(c); break; default: clearTimeout(b.searching), b.searching = setTimeout(function () { b.term != b.element.val() && (b.selectedItem = null, b.search(null, c)) }, b.options.delay) } } }).bind("keypress.autocomplete", function (a) { d && (d = !1, a.preventDefault()) }).bind("focus.autocomplete", function () { b.options.disabled || (b.selectedItem = null, b.previous = b.element.val()) }).bind("blur.autocomplete", function (a) { b.options.disabled || (clearTimeout(b.searching), b.closing = setTimeout(function () { b.close(a), b._change(a) }, 150)) }), this._initSource(), this.response = function () { return b._response.apply(b, arguments) }, this.menu = a("<ul></ul>").addClass("ui-autocomplete").appendTo(a(this.options.appendTo || "body", c)[0]).mousedown(function (c) { var d = b.menu.element[0]; a(c.target).closest(".ui-menu-item").length || setTimeout(function () { a(document).one("mousedown", function (c) { c.target !== b.element[0] && c.target !== d && !a.ui.contains(d, c.target) && b.close() }) }, 1), setTimeout(function () { clearTimeout(b.closing) }, 13) }).menu({ focus: function (a, c) { var d = c.item.data("item.autocomplete"); !1 !== b._trigger("focus", a, { item: d }) && /^key/.test(a.originalEvent.type) && b.element.val(d.value) }, selected: function (a, d) { var e = d.item.data("item.autocomplete"), f = b.previous; b.element[0] !== c.activeElement && (b.element.focus(), b.previous = f, setTimeout(function () { b.previous = f, b.selectedItem = e }, 1)), !1 !== b._trigger("select", a, { item: e }) && b.element.val(e.value), b.term = b.element.val(), b.close(a), b.selectedItem = e }, blur: function (a, c) { b.menu.element.is(":visible") && b.element.val() !== b.term && b.element.val(b.term) } }).zIndex(this.element.zIndex() + 1).css({ top: 0, left: 0 }).hide().data("menu"), a.fn.bgiframe && this.menu.element.bgiframe(), b.beforeunloadHandler = function () { b.element.removeAttr("autocomplete") }, a(window).bind("beforeunload", b.beforeunloadHandler) }, destroy: function () { this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup"), this.menu.element.remove(), a(window).unbind("beforeunload", this.beforeunloadHandler), a.Widget.prototype.destroy.call(this) }, _setOption: function (b, c) { a.Widget.prototype._setOption.apply(this, arguments), b === "source" && this._initSource(), b === "appendTo" && this.menu.element.appendTo(a(c || "body", this.element[0].ownerDocument)[0]), b === "disabled" && c && this.xhr && this.xhr.abort() }, _initSource: function () { var b = this, d, e; a.isArray(this.options.source) ? (d = this.options.source, this.source = function (b, c) { c(a.ui.autocomplete.filter(d, b.term)) }) : typeof this.options.source == "string" ? (e = this.options.source, this.source = function (d, f) { b.xhr && b.xhr.abort(), b.xhr = a.ajax({ url: e, data: d, dataType: "json", context: { autocompleteRequest: ++c }, success: function (a, b) { this.autocompleteRequest === c && f(a) }, error: function () { this.autocompleteRequest === c && f([]) } }) }) : this.source = this.options.source }, search: function (a, b) { a = a != null ? a : this.element.val(), this.term = this.element.val(); if (a.length < this.options.minLength) return this.close(b); clearTimeout(this.closing); if (this._trigger("search", b) !== !1) return this._search(a) }, _search: function (a) { this.pending++, this.element.addClass("ui-autocomplete-loading"), this.source({ term: a }, this.response) }, _response: function (a) { !this.options.disabled && a && a.length ? (a = this._normalize(a), this._suggest(a), this._trigger("open")) : this.close(), this.pending--, this.pending || this.element.removeClass("ui-autocomplete-loading") }, close: function (a) { clearTimeout(this.closing), this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.deactivate(), this._trigger("close", a)) }, _change: function (a) { this.previous !== this.element.val() && this._trigger("change", a, { item: this.selectedItem }) }, _normalize: function (b) { if (b.length && b[0].label && b[0].value) return b; return a.map(b, function (b) { if (typeof b == "string") return { label: b, value: b }; return a.extend({ label: b.label || b.value, value: b.value || b.label }, b) }) }, _suggest: function (b) { var c = this.menu.element.empty().zIndex(this.element.zIndex() + 1); this._renderMenu(c, b), this.menu.deactivate(), this.menu.refresh(), c.show(), this._resizeMenu(), c.position(a.extend({ of: this.element }, this.options.position)), this.options.autoFocus && this.menu.next(new a.Event("mouseover")) }, _resizeMenu: function () { var a = this.menu.element; a.outerWidth(Math.max(a.width("").outerWidth() + 1, this.element.outerWidth())) }, _renderMenu: function (b, c) { var d = this; a.each(c, function (a, c) { d._renderItem(b, c) }) }, _renderItem: function (b, c) { return a("<li></li>").data("item.autocomplete", c).append(a("<a></a>").text(c.label)).appendTo(b) }, _move: function (a, b) { if (!this.menu.element.is(":visible")) this.search(null, b); else { if (this.menu.first() && /^previous/.test(a) || this.menu.last() && /^next/.test(a)) { this.element.val(this.term), this.menu.deactivate(); return } this.menu[a](b) } }, widget: function () { return this.menu.element } }), a.extend(a.ui.autocomplete, { escapeRegex: function (a) { return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") }, filter: function (b, c) { var d = new RegExp(a.ui.autocomplete.escapeRegex(c), "i"); return a.grep(b, function (a) { return d.test(a.label || a.value || a) }) } }) })(jQuery), function (a) { a.widget("ui.menu", { _create: function () { var b = this; this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({ role: "listbox", "aria-activedescendant": "ui-active-menuitem" }).click(function (c) { !a(c.target).closest(".ui-menu-item a").length || (c.preventDefault(), b.select(c)) }), this.refresh() }, refresh: function () { var b = this, c = this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "menuitem"); c.children("a").addClass("ui-corner-all").attr("tabindex", -1).mouseenter(function (c) { b.activate(c, a(this).parent()) }).mouseleave(function () { b.deactivate() }) }, activate: function (a, b) { this.deactivate(); if (this.hasScroll()) { var c = b.offset().top - this.element.offset().top, d = this.element.scrollTop(), e = this.element.height(); c < 0 ? this.element.scrollTop(d + c) : c >= e && this.element.scrollTop(d + c - e + b.height()) } this.active = b.eq(0).children("a").addClass("ui-state-hover").attr("id", "ui-active-menuitem").end(), this._trigger("focus", a, { item: b }) }, deactivate: function () { !this.active || (this.active.children("a").removeClass("ui-state-hover").removeAttr("id"), this._trigger("blur"), this.active = null) }, next: function (a) { this.move("next", ".ui-menu-item:first", a) }, previous: function (a) { this.move("prev", ".ui-menu-item:last", a) }, first: function () { return this.active && !this.active.prevAll(".ui-menu-item").length }, last: function () { return this.active && !this.active.nextAll(".ui-menu-item").length }, move: function (a, b, c) { if (!this.active) this.activate(c, this.element.children(b)); else { var d = this.active[a + "All"](".ui-menu-item").eq(0); d.length ? this.activate(c, d) : this.activate(c, this.element.children(b)) } }, nextPage: function (b) { if (this.hasScroll()) { if (!this.active || this.last()) { this.activate(b, this.element.children(".ui-menu-item:first")); return } var c = this.active.offset().top, d = this.element.height(), e = this.element.children(".ui-menu-item").filter(function () { var b = a(this).offset().top - c - d + a(this).height(); return b < 10 && b > -10 }); e.length || (e = this.element.children(".ui-menu-item:last")), this.activate(b, e) } else this.activate(b, this.element.children(".ui-menu-item").filter(!this.active || this.last() ? ":first" : ":last")) }, previousPage: function (b) { if (this.hasScroll()) { if (!this.active || this.first()) { this.activate(b, this.element.children(".ui-menu-item:last")); return } var c = this.active.offset().top, d = this.element.height(); result = this.element.children(".ui-menu-item").filter(function () { var b = a(this).offset().top - c + d - a(this).height(); return b < 10 && b > -10 }), result.length || (result = this.element.children(".ui-menu-item:first")), this.activate(b, result) } else this.activate(b, this.element.children(".ui-menu-item").filter(!this.active || this.first() ? ":last" : ":first")) }, hasScroll: function () { return this.element.height() < this.element[a.fn.prop ? "prop" : "attr"]("scrollHeight") }, select: function (a) { this._trigger("selected", a, { item: this.active }) } }) } (jQuery); /*
 * jQuery UI Button 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Button
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function (a, b) { var c, d, e, f, g = "ui-button ui-widget ui-state-default ui-corner-all", h = "ui-state-hover ui-state-active ", i = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only", j = function () { var b = a(this).find(":ui-button"); setTimeout(function () { b.button("refresh") }, 1) }, k = function (b) { var c = b.name, d = b.form, e = a([]); c && (d ? e = a(d).find("[name='" + c + "']") : e = a("[name='" + c + "']", b.ownerDocument).filter(function () { return !this.form })); return e }; a.widget("ui.button", { options: { disabled: null, text: !0, label: null, icons: { primary: null, secondary: null} }, _create: function () { this.element.closest("form").unbind("reset.button").bind("reset.button", j), typeof this.options.disabled != "boolean" ? this.options.disabled = !!this.element.propAttr("disabled") : this.element.propAttr("disabled", this.options.disabled), this._determineButtonType(), this.hasTitle = !!this.buttonElement.attr("title"); var b = this, h = this.options, i = this.type === "checkbox" || this.type === "radio", l = "ui-state-hover" + (i ? "" : " ui-state-active"), m = "ui-state-focus"; h.label === null && (h.label = this.buttonElement.html()), this.buttonElement.addClass(g).attr("role", "button").bind("mouseenter.button", function () { h.disabled || (a(this).addClass("ui-state-hover"), this === c && a(this).addClass("ui-state-active")) }).bind("mouseleave.button", function () { h.disabled || a(this).removeClass(l) }).bind("click.button", function (a) { h.disabled && (a.preventDefault(), a.stopImmediatePropagation()) }), this.element.bind("focus.button", function () { b.buttonElement.addClass(m) }).bind("blur.button", function () { b.buttonElement.removeClass(m) }), i && (this.element.bind("change.button", function () { f || b.refresh() }), this.buttonElement.bind("mousedown.button", function (a) { h.disabled || (f = !1, d = a.pageX, e = a.pageY) }).bind("mouseup.button", function (a) { !h.disabled && (d !== a.pageX || e !== a.pageY) && (f = !0) })), this.type === "checkbox" ? this.buttonElement.bind("click.button", function () { if (h.disabled || f) return !1; a(this).toggleClass("ui-state-active"), b.buttonElement.attr("aria-pressed", b.element[0].checked) }) : this.type === "radio" ? this.buttonElement.bind("click.button", function () { if (h.disabled || f) return !1; a(this).addClass("ui-state-active"), b.buttonElement.attr("aria-pressed", "true"); var c = b.element[0]; k(c).not(c).map(function () { return a(this).button("widget")[0] }).removeClass("ui-state-active").attr("aria-pressed", "false") }) : (this.buttonElement.bind("mousedown.button", function () { if (h.disabled) return !1; a(this).addClass("ui-state-active"), c = this, a(document).one("mouseup", function () { c = null }) }).bind("mouseup.button", function () { if (h.disabled) return !1; a(this).removeClass("ui-state-active") }).bind("keydown.button", function (b) { if (h.disabled) return !1; (b.keyCode == a.ui.keyCode.SPACE || b.keyCode == a.ui.keyCode.ENTER) && a(this).addClass("ui-state-active") }).bind("keyup.button", function () { a(this).removeClass("ui-state-active") }), this.buttonElement.is("a") && this.buttonElement.keyup(function (b) { b.keyCode === a.ui.keyCode.SPACE && a(this).click() })), this._setOption("disabled", h.disabled), this._resetButton() }, _determineButtonType: function () { this.element.is(":checkbox") ? this.type = "checkbox" : this.element.is(":radio") ? this.type = "radio" : this.element.is("input") ? this.type = "input" : this.type = "button"; if (this.type === "checkbox" || this.type === "radio") { var a = this.element.parents().filter(":last"), b = "label[for='" + this.element.attr("id") + "']"; this.buttonElement = a.find(b), this.buttonElement.length || (a = a.length ? a.siblings() : this.element.siblings(), this.buttonElement = a.filter(b), this.buttonElement.length || (this.buttonElement = a.find(b))), this.element.addClass("ui-helper-hidden-accessible"); var c = this.element.is(":checked"); c && this.buttonElement.addClass("ui-state-active"), this.buttonElement.attr("aria-pressed", c) } else this.buttonElement = this.element }, widget: function () { return this.buttonElement }, destroy: function () { this.element.removeClass("ui-helper-hidden-accessible"), this.buttonElement.removeClass(g + " " + h + " " + i).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()), this.hasTitle || this.buttonElement.removeAttr("title"), a.Widget.prototype.destroy.call(this) }, _setOption: function (b, c) { a.Widget.prototype._setOption.apply(this, arguments); b === "disabled" ? c ? this.element.propAttr("disabled", !0) : this.element.propAttr("disabled", !1) : this._resetButton() }, refresh: function () { var b = this.element.is(":disabled"); b !== this.options.disabled && this._setOption("disabled", b), this.type === "radio" ? k(this.element[0]).each(function () { a(this).is(":checked") ? a(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true") : a(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false") }) : this.type === "checkbox" && (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false")) }, _resetButton: function () { if (this.type === "input") this.options.label && this.element.val(this.options.label); else { var b = this.buttonElement.removeClass(i), c = a("<span></span>", this.element[0].ownerDocument).addClass("ui-button-text").html(this.options.label).appendTo(b.empty()).text(), d = this.options.icons, e = d.primary && d.secondary, f = []; d.primary || d.secondary ? (this.options.text && f.push("ui-button-text-icon" + (e ? "s" : d.primary ? "-primary" : "-secondary")), d.primary && b.prepend("<span class='ui-button-icon-primary ui-icon " + d.primary + "'></span>"), d.secondary && b.append("<span class='ui-button-icon-secondary ui-icon " + d.secondary + "'></span>"), this.options.text || (f.push(e ? "ui-button-icons-only" : "ui-button-icon-only"), this.hasTitle || b.attr("title", c))) : f.push("ui-button-text-only"), b.addClass(f.join(" ")) } } }), a.widget("ui.buttonset", { options: { items: ":button, :submit, :reset, :checkbox, :radio, a, :data(button)" }, _create: function () { this.element.addClass("ui-buttonset") }, _init: function () { this.refresh() }, _setOption: function (b, c) { b === "disabled" && this.buttons.button("option", b, c), a.Widget.prototype._setOption.apply(this, arguments) }, refresh: function () { var b = this.element.css("direction") === "rtl"; this.buttons = this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function () { return a(this).button("widget")[0] }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(b ? "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(b ? "ui-corner-left" : "ui-corner-right").end().end() }, destroy: function () { this.element.removeClass("ui-buttonset"), this.buttons.map(function () { return a(this).button("widget")[0] }).removeClass("ui-corner-left ui-corner-right").end().button("destroy"), a.Widget.prototype.destroy.call(this) } }) })(jQuery); /*
 * jQuery UI Dialog 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 */
(function (a, b) { var c = "ui-dialog ui-widget ui-widget-content ui-corner-all ", d = { buttons: !0, height: !0, maxHeight: !0, maxWidth: !0, minHeight: !0, minWidth: !0, width: !0 }, e = { maxHeight: !0, maxWidth: !0, minHeight: !0, minWidth: !0 }, f = a.attrFn || { val: !0, css: !0, html: !0, text: !0, data: !0, width: !0, height: !0, offset: !0, click: !0 }; a.widget("ui.dialog", { options: { autoOpen: !0, buttons: {}, closeOnEscape: !0, closeText: "close", dialogClass: "", draggable: !0, hide: null, height: "auto", maxHeight: !1, maxWidth: !1, minHeight: 150, minWidth: 150, modal: !1, position: { my: "center", at: "center", collision: "fit", using: function (b) { var c = a(this).css(b).offset().top; c < 0 && a(this).css("top", b.top - c) } }, resizable: !0, show: null, stack: !0, title: "", width: 300, zIndex: 1e3 }, _create: function () { this.originalTitle = this.element.attr("title"), typeof this.originalTitle != "string" && (this.originalTitle = ""), this.options.title = this.options.title || this.originalTitle; var b = this, d = b.options, e = d.title || "&#160;", f = a.ui.dialog.getTitleId(b.element), g = (b.uiDialog = a("<div></div>")).appendTo(document.body).hide().addClass(c + d.dialogClass).css({ zIndex: d.zIndex }).attr("tabIndex", -1).css("outline", 0).keydown(function (c) { d.closeOnEscape && !c.isDefaultPrevented() && c.keyCode && c.keyCode === a.ui.keyCode.ESCAPE && (b.close(c), c.preventDefault()) }).attr({ role: "dialog", "aria-labelledby": f }).mousedown(function (a) { b.moveToTop(!1, a) }), h = b.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(g), i = (b.uiDialogTitlebar = a("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(g), j = a('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role", "button").hover(function () { j.addClass("ui-state-hover") }, function () { j.removeClass("ui-state-hover") }).focus(function () { j.addClass("ui-state-focus") }).blur(function () { j.removeClass("ui-state-focus") }).click(function (a) { b.close(a); return !1 }).appendTo(i), k = (b.uiDialogTitlebarCloseText = a("<span></span>")).addClass("ui-icon ui-icon-closethick").text(d.closeText).appendTo(j), l = a("<span></span>").addClass("ui-dialog-title").attr("id", f).html(e).prependTo(i); a.isFunction(d.beforeclose) && !a.isFunction(d.beforeClose) && (d.beforeClose = d.beforeclose), i.find("*").add(i).disableSelection(), d.draggable && a.fn.draggable && b._makeDraggable(), d.resizable && a.fn.resizable && b._makeResizable(), b._createButtons(d.buttons), b._isOpen = !1, a.fn.bgiframe && g.bgiframe() }, _init: function () { this.options.autoOpen && this.open() }, destroy: function () { var a = this; a.overlay && a.overlay.destroy(), a.uiDialog.hide(), a.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body"), a.uiDialog.remove(), a.originalTitle && a.element.attr("title", a.originalTitle); return a }, widget: function () { return this.uiDialog }, close: function (b) { var c = this, d, e; if (!1 !== c._trigger("beforeClose", b)) { c.overlay && c.overlay.destroy(), c.uiDialog.unbind("keypress.ui-dialog"), c._isOpen = !1, c.options.hide ? c.uiDialog.hide(c.options.hide, function () { c._trigger("close", b) }) : (c.uiDialog.hide(), c._trigger("close", b)), a.ui.dialog.overlay.resize(), c.options.modal && (d = 0, a(".ui-dialog").each(function () { this !== c.uiDialog[0] && (e = a(this).css("z-index"), isNaN(e) || (d = Math.max(d, e))) }), a.ui.dialog.maxZ = d); return c } }, isOpen: function () { return this._isOpen }, moveToTop: function (b, c) { var d = this, e = d.options, f; if (e.modal && !b || !e.stack && !e.modal) return d._trigger("focus", c); e.zIndex > a.ui.dialog.maxZ && (a.ui.dialog.maxZ = e.zIndex), d.overlay && (a.ui.dialog.maxZ += 1, d.overlay.$el.css("z-index", a.ui.dialog.overlay.maxZ = a.ui.dialog.maxZ)), f = { scrollTop: d.element.scrollTop(), scrollLeft: d.element.scrollLeft() }, a.ui.dialog.maxZ += 1, d.uiDialog.css("z-index", a.ui.dialog.maxZ), d.element.attr(f), d._trigger("focus", c); return d }, open: function () { if (!this._isOpen) { var b = this, c = b.options, d = b.uiDialog; b.overlay = c.modal ? new a.ui.dialog.overlay(b) : null, b._size(), b._position(c.position), d.show(c.show), b.moveToTop(!0), c.modal && d.bind("keydown.ui-dialog", function (b) { if (b.keyCode === a.ui.keyCode.TAB) { var c = a(":tabbable", this), d = c.filter(":first"), e = c.filter(":last"); if (b.target === e[0] && !b.shiftKey) { d.focus(1); return !1 } if (b.target === d[0] && b.shiftKey) { e.focus(1); return !1 } } }), a(b.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus(), b._isOpen = !0, b._trigger("open"); return b } }, _createButtons: function (b) { var c = this, d = !1, e = a("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"), g = a("<div></div>").addClass("ui-dialog-buttonset").appendTo(e); c.uiDialog.find(".ui-dialog-buttonpane").remove(), typeof b == "object" && b !== null && a.each(b, function () { return !(d = !0) }), d && (a.each(b, function (b, d) { d = a.isFunction(d) ? { click: d, text: b} : d; var e = a('<button type="button"></button>').click(function () { d.click.apply(c.element[0], arguments) }).appendTo(g); a.each(d, function (a, b) { a !== "click" && (a in f ? e[a](b) : e.attr(a, b)) }), a.fn.button && e.button() }), e.appendTo(c.uiDialog)) }, _makeDraggable: function () { function f(a) { return { position: a.position, offset: a.offset} } var b = this, c = b.options, d = a(document), e; b.uiDialog.draggable({ cancel: ".ui-dialog-content, .ui-dialog-titlebar-close", handle: ".ui-dialog-titlebar", containment: "document", start: function (d, g) { e = c.height === "auto" ? "auto" : a(this).height(), a(this).height(a(this).height()).addClass("ui-dialog-dragging"), b._trigger("dragStart", d, f(g)) }, drag: function (a, c) { b._trigger("drag", a, f(c)) }, stop: function (g, h) { c.position = [h.position.left - d.scrollLeft(), h.position.top - d.scrollTop()], a(this).removeClass("ui-dialog-dragging").height(e), b._trigger("dragStop", g, f(h)), a.ui.dialog.overlay.resize() } }) }, _makeResizable: function (c) { function h(a) { return { originalPosition: a.originalPosition, originalSize: a.originalSize, position: a.position, size: a.size} } c = c === b ? this.options.resizable : c; var d = this, e = d.options, f = d.uiDialog.css("position"), g = typeof c == "string" ? c : "n,e,s,w,se,sw,ne,nw"; d.uiDialog.resizable({ cancel: ".ui-dialog-content", containment: "document", alsoResize: d.element, maxWidth: e.maxWidth, maxHeight: e.maxHeight, minWidth: e.minWidth, minHeight: d._minHeight(), handles: g, start: function (b, c) { a(this).addClass("ui-dialog-resizing"), d._trigger("resizeStart", b, h(c)) }, resize: function (a, b) { d._trigger("resize", a, h(b)) }, stop: function (b, c) { a(this).removeClass("ui-dialog-resizing"), e.height = a(this).height(), e.width = a(this).width(), d._trigger("resizeStop", b, h(c)), a.ui.dialog.overlay.resize() } }).css("position", f).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se") }, _minHeight: function () { var a = this.options; return a.height === "auto" ? a.minHeight : Math.min(a.minHeight, a.height) }, _position: function (b) { var c = [], d = [0, 0], e; if (b) { if (typeof b == "string" || typeof b == "object" && "0" in b) c = b.split ? b.split(" ") : [b[0], b[1]], c.length === 1 && (c[1] = c[0]), a.each(["left", "top"], function (a, b) { +c[a] === c[a] && (d[a] = c[a], c[a] = b) }), b = { my: c.join(" "), at: c.join(" "), offset: d.join(" ") }; b = a.extend({}, a.ui.dialog.prototype.options.position, b) } else b = a.ui.dialog.prototype.options.position; e = this.uiDialog.is(":visible"), e || this.uiDialog.show(), this.uiDialog.css({ top: 0, left: 0 }).position(a.extend({ of: window }, b)), e || this.uiDialog.hide() }, _setOptions: function (b) { var c = this, f = {}, g = !1; a.each(b, function (a, b) { c._setOption(a, b), a in d && (g = !0), a in e && (f[a] = b) }), g && this._size(), this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", f) }, _setOption: function (b, d) { var e = this, f = e.uiDialog; switch (b) { case "beforeclose": b = "beforeClose"; break; case "buttons": e._createButtons(d); break; case "closeText": e.uiDialogTitlebarCloseText.text("" + d); break; case "dialogClass": f.removeClass(e.options.dialogClass).addClass(c + d); break; case "disabled": d ? f.addClass("ui-dialog-disabled") : f.removeClass("ui-dialog-disabled"); break; case "draggable": var g = f.is(":data(draggable)"); g && !d && f.draggable("destroy"), !g && d && e._makeDraggable(); break; case "position": e._position(d); break; case "resizable": var h = f.is(":data(resizable)"); h && !d && f.resizable("destroy"), h && typeof d == "string" && f.resizable("option", "handles", d), !h && d !== !1 && e._makeResizable(d); break; case "title": a(".ui-dialog-title", e.uiDialogTitlebar).html("" + (d || "&#160;")) } a.Widget.prototype._setOption.apply(e, arguments) }, _size: function () { var b = this.options, c, d, e = this.uiDialog.is(":visible"); this.element.show().css({ width: "auto", minHeight: 0, height: 0 }), b.minWidth > b.width && (b.width = b.minWidth), c = this.uiDialog.css({ height: "auto", width: b.width }).height(), d = Math.max(0, b.minHeight - c); if (b.height === "auto") if (a.support.minHeight) this.element.css({ minHeight: d, height: "auto" }); else { this.uiDialog.show(); var f = this.element.css("height", "auto").height(); e || this.uiDialog.hide(), this.element.height(Math.max(f, d)) } else this.element.height(Math.max(b.height - c, 0)); this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight()) } }), a.extend(a.ui.dialog, { version: "1.8.18", uuid: 0, maxZ: 0, getTitleId: function (a) { var b = a.attr("id"); b || (this.uuid += 1, b = this.uuid); return "ui-dialog-title-" + b }, overlay: function (b) { this.$el = a.ui.dialog.overlay.create(b) } }), a.extend(a.ui.dialog.overlay, { instances: [], oldInstances: [], maxZ: 0, events: a.map("focus,mousedown,mouseup,keydown,keypress,click".split(","), function (a) { return a + ".dialog-overlay" }).join(" "), create: function (b) { this.instances.length === 0 && (setTimeout(function () { a.ui.dialog.overlay.instances.length && a(document).bind(a.ui.dialog.overlay.events, function (b) { if (a(b.target).zIndex() < a.ui.dialog.overlay.maxZ) return !1 }) }, 1), a(document).bind("keydown.dialog-overlay", function (c) { b.options.closeOnEscape && !c.isDefaultPrevented() && c.keyCode && c.keyCode === a.ui.keyCode.ESCAPE && (b.close(c), c.preventDefault()) }), a(window).bind("resize.dialog-overlay", a.ui.dialog.overlay.resize)); var c = (this.oldInstances.pop() || a("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({ width: this.width(), height: this.height() }); a.fn.bgiframe && c.bgiframe(), this.instances.push(c); return c }, destroy: function (b) { var c = a.inArray(b, this.instances); c != -1 && this.oldInstances.push(this.instances.splice(c, 1)[0]), this.instances.length === 0 && a([document, window]).unbind(".dialog-overlay"), b.remove(); var d = 0; a.each(this.instances, function () { d = Math.max(d, this.css("z-index")) }), this.maxZ = d }, height: function () { var b, c; if (a.browser.msie && a.browser.version < 7) { b = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), c = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight); return b < c ? a(window).height() + "px" : b + "px" } return a(document).height() + "px" }, width: function () { var b, c; if (a.browser.msie) { b = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), c = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth); return b < c ? a(window).width() + "px" : b + "px" } return a(document).width() + "px" }, resize: function () { var b = a([]); a.each(a.ui.dialog.overlay.instances, function () { b = b.add(this) }), b.css({ width: 0, height: 0 }).css({ width: a.ui.dialog.overlay.width(), height: a.ui.dialog.overlay.height() }) } }), a.extend(a.ui.dialog.overlay.prototype, { destroy: function () { a.ui.dialog.overlay.destroy(this.$el) } }) })(jQuery); /*
 * jQuery UI Slider 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function (a, b) { var c = 5; a.widget("ui.slider", a.ui.mouse, { widgetEventPrefix: "slide", options: { animate: !1, distance: 0, max: 100, min: 0, orientation: "horizontal", range: !1, step: 1, value: 0, values: null }, _create: function () { var b = this, d = this.options, e = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"), f = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>", g = d.values && d.values.length || 1, h = []; this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget" + " ui-widget-content" + " ui-corner-all" + (d.disabled ? " ui-slider-disabled ui-disabled" : "")), this.range = a([]), d.range && (d.range === !0 && (d.values || (d.values = [this._valueMin(), this._valueMin()]), d.values.length && d.values.length !== 2 && (d.values = [d.values[0], d.values[0]])), this.range = a("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header" + (d.range === "min" || d.range === "max" ? " ui-slider-range-" + d.range : ""))); for (var i = e.length; i < g; i += 1) h.push(f); this.handles = e.add(a(h.join("")).appendTo(b.element)), this.handle = this.handles.eq(0), this.handles.add(this.range).filter("a").click(function (a) { a.preventDefault() }).hover(function () { d.disabled || a(this).addClass("ui-state-hover") }, function () { a(this).removeClass("ui-state-hover") }).focus(function () { d.disabled ? a(this).blur() : (a(".ui-slider .ui-state-focus").removeClass("ui-state-focus"), a(this).addClass("ui-state-focus")) }).blur(function () { a(this).removeClass("ui-state-focus") }), this.handles.each(function (b) { a(this).data("index.ui-slider-handle", b) }), this.handles.keydown(function (d) { var e = a(this).data("index.ui-slider-handle"), f, g, h, i; if (!b.options.disabled) { switch (d.keyCode) { case a.ui.keyCode.HOME: case a.ui.keyCode.END: case a.ui.keyCode.PAGE_UP: case a.ui.keyCode.PAGE_DOWN: case a.ui.keyCode.UP: case a.ui.keyCode.RIGHT: case a.ui.keyCode.DOWN: case a.ui.keyCode.LEFT: d.preventDefault(); if (!b._keySliding) { b._keySliding = !0, a(this).addClass("ui-state-active"), f = b._start(d, e); if (f === !1) return } } i = b.options.step, b.options.values && b.options.values.length ? g = h = b.values(e) : g = h = b.value(); switch (d.keyCode) { case a.ui.keyCode.HOME: h = b._valueMin(); break; case a.ui.keyCode.END: h = b._valueMax(); break; case a.ui.keyCode.PAGE_UP: h = b._trimAlignValue(g + (b._valueMax() - b._valueMin()) / c); break; case a.ui.keyCode.PAGE_DOWN: h = b._trimAlignValue(g - (b._valueMax() - b._valueMin()) / c); break; case a.ui.keyCode.UP: case a.ui.keyCode.RIGHT: if (g === b._valueMax()) return; h = b._trimAlignValue(g + i); break; case a.ui.keyCode.DOWN: case a.ui.keyCode.LEFT: if (g === b._valueMin()) return; h = b._trimAlignValue(g - i) } b._slide(d, e, h) } }).keyup(function (c) { var d = a(this).data("index.ui-slider-handle"); b._keySliding && (b._keySliding = !1, b._stop(c, d), b._change(c, d), a(this).removeClass("ui-state-active")) }), this._refreshValue(), this._animateOff = !1 }, destroy: function () { this.handles.remove(), this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider"), this._mouseDestroy(); return this }, _mouseCapture: function (b) { var c = this.options, d, e, f, g, h, i, j, k, l; if (c.disabled) return !1; this.elementSize = { width: this.element.outerWidth(), height: this.element.outerHeight() }, this.elementOffset = this.element.offset(), d = { x: b.pageX, y: b.pageY }, e = this._normValueFromMouse(d), f = this._valueMax() - this._valueMin() + 1, h = this, this.handles.each(function (b) { var c = Math.abs(e - h.values(b)); f > c && (f = c, g = a(this), i = b) }), c.range === !0 && this.values(1) === c.min && (i += 1, g = a(this.handles[i])), j = this._start(b, i); if (j === !1) return !1; this._mouseSliding = !0, h._handleIndex = i, g.addClass("ui-state-active").focus(), k = g.offset(), l = !a(b.target).parents().andSelf().is(".ui-slider-handle"), this._clickOffset = l ? { left: 0, top: 0} : { left: b.pageX - k.left - g.width() / 2, top: b.pageY - k.top - g.height() / 2 - (parseInt(g.css("borderTopWidth"), 10) || 0) - (parseInt(g.css("borderBottomWidth"), 10) || 0) + (parseInt(g.css("marginTop"), 10) || 0) }, this.handles.hasClass("ui-state-hover") || this._slide(b, i, e), this._animateOff = !0; return !0 }, _mouseStart: function (a) { return !0 }, _mouseDrag: function (a) { var b = { x: a.pageX, y: a.pageY }, c = this._normValueFromMouse(b); this._slide(a, this._handleIndex, c); return !1 }, _mouseStop: function (a) { this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(a, this._handleIndex), this._change(a, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1; return !1 }, _detectOrientation: function () { this.orientation = this.options.orientation === "vertical" ? "vertical" : "horizontal" }, _normValueFromMouse: function (a) { var b, c, d, e, f; this.orientation === "horizontal" ? (b = this.elementSize.width, c = a.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (b = this.elementSize.height, c = a.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), d = c / b, d > 1 && (d = 1), d < 0 && (d = 0), this.orientation === "vertical" && (d = 1 - d), e = this._valueMax() - this._valueMin(), f = this._valueMin() + d * e; return this._trimAlignValue(f) }, _start: function (a, b) { var c = { handle: this.handles[b], value: this.value() }; this.options.values && this.options.values.length && (c.value = this.values(b), c.values = this.values()); return this._trigger("start", a, c) }, _slide: function (a, b, c) { var d, e, f; this.options.values && this.options.values.length ? (d = this.values(b ? 0 : 1), this.options.values.length === 2 && this.options.range === !0 && (b === 0 && c > d || b === 1 && c < d) && (c = d), c !== this.values(b) && (e = this.values(), e[b] = c, f = this._trigger("slide", a, { handle: this.handles[b], value: c, values: e }), d = this.values(b ? 0 : 1), f !== !1 && this.values(b, c, !0))) : c !== this.value() && (f = this._trigger("slide", a, { handle: this.handles[b], value: c }), f !== !1 && this.value(c)) }, _stop: function (a, b) { var c = { handle: this.handles[b], value: this.value() }; this.options.values && this.options.values.length && (c.value = this.values(b), c.values = this.values()), this._trigger("stop", a, c) }, _change: function (a, b) { if (!this._keySliding && !this._mouseSliding) { var c = { handle: this.handles[b], value: this.value() }; this.options.values && this.options.values.length && (c.value = this.values(b), c.values = this.values()), this._trigger("change", a, c) } }, value: function (a) { if (arguments.length) this.options.value = this._trimAlignValue(a), this._refreshValue(), this._change(null, 0); else return this._value() }, values: function (b, c) { var d, e, f; if (arguments.length > 1) this.options.values[b] = this._trimAlignValue(c), this._refreshValue(), this._change(null, b); else { if (!arguments.length) return this._values(); if (!a.isArray(arguments[0])) return this.options.values && this.options.values.length ? this._values(b) : this.value(); d = this.options.values, e = arguments[0]; for (f = 0; f < d.length; f += 1) d[f] = this._trimAlignValue(e[f]), this._change(null, f); this._refreshValue() } }, _setOption: function (b, c) { var d, e = 0; a.isArray(this.options.values) && (e = this.options.values.length), a.Widget.prototype._setOption.apply(this, arguments); switch (b) { case "disabled": c ? (this.handles.filter(".ui-state-focus").blur(), this.handles.removeClass("ui-state-hover"), this.handles.propAttr("disabled", !0), this.element.addClass("ui-disabled")) : (this.handles.propAttr("disabled", !1), this.element.removeClass("ui-disabled")); break; case "orientation": this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue(); break; case "value": this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1; break; case "values": this._animateOff = !0, this._refreshValue(); for (d = 0; d < e; d += 1) this._change(null, d); this._animateOff = !1 } }, _value: function () { var a = this.options.value; a = this._trimAlignValue(a); return a }, _values: function (a) { var b, c, d; if (arguments.length) { b = this.options.values[a], b = this._trimAlignValue(b); return b } c = this.options.values.slice(); for (d = 0; d < c.length; d += 1) c[d] = this._trimAlignValue(c[d]); return c }, _trimAlignValue: function (a) { if (a <= this._valueMin()) return this._valueMin(); if (a >= this._valueMax()) return this._valueMax(); var b = this.options.step > 0 ? this.options.step : 1, c = (a - this._valueMin()) % b, d = a - c; Math.abs(c) * 2 >= b && (d += c > 0 ? b : -b); return parseFloat(d.toFixed(5)) }, _valueMin: function () { return this.options.min }, _valueMax: function () { return this.options.max }, _refreshValue: function () { var b = this.options.range, c = this.options, d = this, e = this._animateOff ? !1 : c.animate, f, g = {}, h, i, j, k; this.options.values && this.options.values.length ? this.handles.each(function (b, i) { f = (d.values(b) - d._valueMin()) / (d._valueMax() - d._valueMin()) * 100, g[d.orientation === "horizontal" ? "left" : "bottom"] = f + "%", a(this).stop(1, 1)[e ? "animate" : "css"](g, c.animate), d.options.range === !0 && (d.orientation === "horizontal" ? (b === 0 && d.range.stop(1, 1)[e ? "animate" : "css"]({ left: f + "%" }, c.animate), b === 1 && d.range[e ? "animate" : "css"]({ width: f - h + "%" }, { queue: !1, duration: c.animate })) : (b === 0 && d.range.stop(1, 1)[e ? "animate" : "css"]({ bottom: f + "%" }, c.animate), b === 1 && d.range[e ? "animate" : "css"]({ height: f - h + "%" }, { queue: !1, duration: c.animate }))), h = f }) : (i = this.value(), j = this._valueMin(), k = this._valueMax(), f = k !== j ? (i - j) / (k - j) * 100 : 0, g[d.orientation === "horizontal" ? "left" : "bottom"] = f + "%", this.handle.stop(1, 1)[e ? "animate" : "css"](g, c.animate), b === "min" && this.orientation === "horizontal" && this.range.stop(1, 1)[e ? "animate" : "css"]({ width: f + "%" }, c.animate), b === "max" && this.orientation === "horizontal" && this.range[e ? "animate" : "css"]({ width: 100 - f + "%" }, { queue: !1, duration: c.animate }), b === "min" && this.orientation === "vertical" && this.range.stop(1, 1)[e ? "animate" : "css"]({ height: f + "%" }, c.animate), b === "max" && this.orientation === "vertical" && this.range[e ? "animate" : "css"]({ height: 100 - f + "%" }, { queue: !1, duration: c.animate })) } }), a.extend(a.ui.slider, { version: "1.8.18" }) })(jQuery); /*
/*
 * jQuery MultiSelect UI Widget 1.13
 * Copyright (c) 2012 Eric Hynds
 *
 * http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/
 *
 * Depends:
 *   - jQuery 1.4.2+
 *   - jQuery UI 1.8 widget factory
 *
 * Optional:
 *   - jQuery UI effects
 *   - jQuery UI position utility
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
(function (d) { var k = 0; d.widget("ech.multiselect", { options: { header: !0, height: 175, minWidth: 225, classes: "", checkAllText: "Check all", uncheckAllText: "Uncheck all", noneSelectedText: "Select options", selectedText: "# selected", selectedList: 0, show: null, hide: null, autoOpen: !1, multiple: !0, position: {} }, _create: function () { var a = this.element.hide(), b = this.options; this.speed = d.fx.speeds._default; this._isOpen = !1; a = (this.button = d('<button type="button"><span class="ui-icon ui-icon-triangle-1-s"></span></button>')).addClass("ui-multiselect ui-widget ui-state-default ui-corner-all").addClass(b.classes).attr({ title: a.attr("title"), "aria-haspopup": !0, tabIndex: a.attr("tabIndex") }).insertAfter(a); (this.buttonlabel = d("<span />")).html(b.noneSelectedText).appendTo(a); var a = (this.menu = d("<div />")).addClass("ui-multiselect-menu ui-widget ui-widget-content ui-corner-all").addClass(b.classes).appendTo(document.body), c = (this.header = d("<div />")).addClass("ui-widget-header ui-corner-all ui-multiselect-header ui-helper-clearfix").appendTo(a); (this.headerLinkContainer = d("<ul />")).addClass("ui-helper-reset").html(function () { return !0 === b.header ? '<li><a class="ui-multiselect-all" href="#"><span class="ui-icon ui-icon-check"></span><span>' + b.checkAllText + '</span></a></li><li><a class="ui-multiselect-none" href="#"><span class="ui-icon ui-icon-closethick"></span><span>' + b.uncheckAllText + "</span></a></li>" : "string" === typeof b.header ? "<li>" + b.header + "</li>" : "" }).append('<li class="ui-multiselect-close"><a href="#" class="ui-multiselect-close"><span class="ui-icon ui-icon-circle-close"></span></a></li>').appendTo(c); (this.checkboxContainer = d("<ul />")).addClass("ui-multiselect-checkboxes ui-helper-reset").appendTo(a); this._bindEvents(); this.refresh(!0); b.multiple || a.addClass("ui-multiselect-single") }, _init: function () { !1 === this.options.header && this.header.hide(); this.options.multiple || this.headerLinkContainer.find(".ui-multiselect-all, .ui-multiselect-none").hide(); this.options.autoOpen && this.open(); this.element.is(":disabled") && this.disable() }, refresh: function (a) { var b = this.element, c = this.options, f = this.menu, h = this.checkboxContainer, g = [], e = "", i = b.attr("id") || k++; b.find("option").each(function (b) { d(this); var a = this.parentNode, f = this.innerHTML, h = this.title, k = this.value, b = "ui-multiselect-" + (this.id || i + "-option-" + b), l = this.disabled, n = this.selected, m = ["ui-corner-all"], o = (l ? "ui-multiselect-disabled " : " ") + this.className, j; "OPTGROUP" === a.tagName && (j = a.getAttribute("label"), -1 === d.inArray(j, g) && (e += '<li class="ui-multiselect-optgroup-label ' + a.className + '"><a href="#">' + j + "</a></li>", g.push(j))); l && m.push("ui-state-disabled"); n && !c.multiple && m.push("ui-state-active"); e += '<li class="' + o + '">'; e += '<label for="' + b + '" title="' + h + '" class="' + m.join(" ") + '">'; e += '<input id="' + b + '" name="multiselect_' + i + '" type="' + (c.multiple ? "checkbox" : "radio") + '" value="' + k + '" title="' + f + '"'; n && (e += ' checked="checked"', e += ' aria-selected="true"'); l && (e += ' disabled="disabled"', e += ' aria-disabled="true"'); e += " /><span>" + f + "</span></label></li>" }); h.html(e); this.labels = f.find("label"); this.inputs = this.labels.children("input"); this._setButtonWidth(); this._setMenuWidth(); this.button[0].defaultValue = this.update(); a || this._trigger("refresh") }, update: function () { var a = this.options, b = this.inputs, c = b.filter(":checked"), f = c.length, a = 0 === f ? a.noneSelectedText : d.isFunction(a.selectedText) ? a.selectedText.call(this, f, b.length, c.get()) : /\d/.test(a.selectedList) && 0 < a.selectedList && f <= a.selectedList ? c.map(function () { return d(this).next().html() }).get().join(", ") : a.selectedText.replace("#", f).replace("#", b.length); this.buttonlabel.html(a); return a }, _bindEvents: function () { function a() { b[b._isOpen ? "close" : "open"](); return !1 } var b = this, c = this.button; c.find("span").bind("click.multiselect", a); c.bind({ click: a, keypress: function (a) { switch (a.which) { case 27: case 38: case 37: b.close(); break; case 39: case 40: b.open() } }, mouseenter: function () { c.hasClass("ui-state-disabled") || d(this).addClass("ui-state-hover") }, mouseleave: function () { d(this).removeClass("ui-state-hover") }, focus: function () { c.hasClass("ui-state-disabled") || d(this).addClass("ui-state-focus") }, blur: function () { d(this).removeClass("ui-state-focus") } }); this.header.delegate("a", "click.multiselect", function (a) { if (d(this).hasClass("ui-multiselect-close")) b.close(); else b[d(this).hasClass("ui-multiselect-all") ? "checkAll" : "uncheckAll"](); a.preventDefault() }); this.menu.delegate("li.ui-multiselect-optgroup-label a", "click.multiselect", function (a) { a.preventDefault(); var c = d(this), g = c.parent().nextUntil("li.ui-multiselect-optgroup-label").find("input:visible:not(:disabled)"), e = g.get(), c = c.parent().text(); !1 !== b._trigger("beforeoptgrouptoggle", a, { inputs: e, label: c }) && (b._toggleChecked(g.filter(":checked").length !== g.length, g), b._trigger("optgrouptoggle", a, { inputs: e, label: c, checked: e[0].checked })) }).delegate("label", "mouseenter.multiselect", function () { d(this).hasClass("ui-state-disabled") || (b.labels.removeClass("ui-state-hover"), d(this).addClass("ui-state-hover").find("input").focus()) }).delegate("label", "keydown.multiselect", function (a) { a.preventDefault(); switch (a.which) { case 9: case 27: b.close(); break; case 38: case 40: case 37: case 39: b._traverse(a.which, this); break; case 13: d(this).find("input")[0].click() } }).delegate('input[type="checkbox"], input[type="radio"]', "click.multiselect", function (a) { var c = d(this), g = this.value, e = this.checked, i = b.element.find("option"); this.disabled || !1 === b._trigger("click", a, { value: g, text: this.title, checked: e }) ? a.preventDefault() : (c.focus(), c.attr("aria-selected", e), i.each(function () { this.value === g ? this.selected = e : b.options.multiple || (this.selected = !1) }), b.options.multiple || (b.labels.removeClass("ui-state-active"), c.closest("label").toggleClass("ui-state-active", e), b.close()), b.element.trigger("change"), setTimeout(d.proxy(b.update, b), 10)) }); d(document).bind("mousedown.multiselect", function (a) { b._isOpen && (!d.contains(b.menu[0], a.target) && !d.contains(b.button[0], a.target) && a.target !== b.button[0]) && b.close() }); d(this.element[0].form).bind("reset.multiselect", function () { setTimeout(d.proxy(b.refresh, b), 10) }) }, _setButtonWidth: function () { var a = this.element.outerWidth(), b = this.options; /\d/.test(b.minWidth) && a < b.minWidth && (a = b.minWidth); this.button.width(a) }, _setMenuWidth: function () { var a = this.menu, b = this.button.outerWidth() - parseInt(a.css("padding-left"), 10) - parseInt(a.css("padding-right"), 10) - parseInt(a.css("border-right-width"), 10) - parseInt(a.css("border-left-width"), 10); a.width(b || this.button.outerWidth()) }, _traverse: function (a, b) { var c = d(b), f = 38 === a || 37 === a, c = c.parent()[f ? "prevAll" : "nextAll"]("li:not(.ui-multiselect-disabled, .ui-multiselect-optgroup-label)")[f ? "last" : "first"](); c.length ? c.find("label").trigger("mouseover") : (c = this.menu.find("ul").last(), this.menu.find("label")[f ? "last" : "first"]().trigger("mouseover"), c.scrollTop(f ? c.height() : 0)) }, _toggleState: function (a, b) { return function () { this.disabled || (this[a] = b); b ? this.setAttribute("aria-selected", !0) : this.removeAttribute("aria-selected") } }, _toggleChecked: function (a, b) { var c = b && b.length ? b : this.inputs, f = this; c.each(this._toggleState("checked", a)); c.eq(0).focus(); this.update(); var h = c.map(function () { return this.value }).get(); this.element.find("option").each(function () { !this.disabled && -1 < d.inArray(this.value, h) && f._toggleState("selected", a).call(this) }); c.length && this.element.trigger("change") }, _toggleDisabled: function (a) { this.button.attr({ disabled: a, "aria-disabled": a })[a ? "addClass" : "removeClass"]("ui-state-disabled"); var b = this.menu.find("input"), b = a ? b.filter(":enabled").data("ech-multiselect-disabled", !0) : b.filter(function () { return !0 === d.data(this, "ech-multiselect-disabled") }).removeData("ech-multiselect-disabled"); b.attr({ disabled: a, "arial-disabled": a }).parent()[a ? "addClass" : "removeClass"]("ui-state-disabled"); this.element.attr({ disabled: a, "aria-disabled": a }) }, open: function () { var a = this.button, b = this.menu, c = this.speed, f = this.options, h = []; if (!(!1 === this._trigger("beforeopen") || a.hasClass("ui-state-disabled") || this._isOpen)) { var g = b.find("ul").last(), e = f.show, i = a.offset(); d.isArray(f.show) && (e = f.show[0], c = f.show[1] || this.speed); e && (h = [e, c]); g.scrollTop(0).height(f.height); d.ui.position && !d.isEmptyObject(f.position) ? (f.position.of = f.position.of || a, b.show().position(f.position).hide()) : b.css({ top: i.top + a.outerHeight(), left: i.left }); d.fn.show.apply(b, h); this.labels.eq(0).trigger("mouseover").trigger("mouseenter").find("input").trigger("focus"); a.addClass("ui-state-active"); this._isOpen = !0; this._trigger("open") } }, close: function () { if (!1 !== this._trigger("beforeclose")) { var a = this.options, b = a.hide, c = this.speed, f = []; d.isArray(a.hide) && (b = a.hide[0], c = a.hide[1] || this.speed); b && (f = [b, c]); d.fn.hide.apply(this.menu, f); this.button.removeClass("ui-state-active").trigger("blur").trigger("mouseleave"); this._isOpen = !1; this._trigger("close") } }, enable: function () { this._toggleDisabled(!1) }, disable: function () { this._toggleDisabled(!0) }, checkAll: function () { this._toggleChecked(!0); this._trigger("checkAll") }, uncheckAll: function () { this._toggleChecked(!1); this._trigger("uncheckAll") }, getChecked: function () { return this.menu.find("input").filter(":checked") }, destroy: function () { d.Widget.prototype.destroy.call(this); this.button.remove(); this.menu.remove(); this.element.show(); return this }, isOpen: function () { return this._isOpen }, widget: function () { return this.menu }, getButton: function () { return this.button }, _setOption: function (a, b) { var c = this.menu; switch (a) { case "header": c.find("div.ui-multiselect-header")[b ? "show" : "hide"](); break; case "checkAllText": c.find("a.ui-multiselect-all span").eq(-1).text(b); break; case "uncheckAllText": c.find("a.ui-multiselect-none span").eq(-1).text(b); break; case "height": c.find("ul").last().height(parseInt(b, 10)); break; case "minWidth": this.options[a] = parseInt(b, 10); this._setButtonWidth(); this._setMenuWidth(); break; case "selectedText": case "selectedList": case "noneSelectedText": this.options[a] = b; this.update(); break; case "classes": c.add(this.button).removeClass(this.options.classes).addClass(b); break; case "multiple": c.toggleClass("ui-multiselect-single", !b), this.options.multiple = b, this.element[0].multiple = b, this.refresh() } d.Widget.prototype._setOption.apply(this, arguments) } }) })(jQuery);
/* jQuery UI Datepicker 1.8.18
*
* Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* http://docs.jquery.com/UI/Datepicker
*
* Depends:
*	jquery.ui.core.js
*/
(function ($, undefined) {
    function isArray(a) { return a && ($.browser.safari && typeof a == "object" && a.length || a.constructor && a.constructor.toString().match(/\Array\(\)/)) } function extendRemove(a, b) { $.extend(a, b); for (var c in b) if (b[c] == null || b[c] == undefined) a[c] = b[c]; return a } function bindHover(a) { var b = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a"; return a.bind("mouseout", function (a) { var c = $(a.target).closest(b); !c.length || c.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover") }).bind("mouseover", function (c) { var d = $(c.target).closest(b); !$.datepicker._isDisabledDatepicker(instActive.inline ? a.parent()[0] : instActive.input[0]) && !!d.length && (d.parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), d.addClass("ui-state-hover"), d.hasClass("ui-datepicker-prev") && d.addClass("ui-datepicker-prev-hover"), d.hasClass("ui-datepicker-next") && d.addClass("ui-datepicker-next-hover")) }) } function Datepicker() { this.debug = !1, this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = { closeText: "Done", prevText: "Prev", nextText: "Next", currentText: "Today", monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], weekHeader: "Wk", dateFormat: "mm/dd/yy", firstDay: 0, isRTL: !1, showMonthAfterYear: !1, yearSuffix: "" }, this._defaults = { showOn: "focus", showAnim: "fadeIn", showOptions: {}, defaultDate: null, appendText: "", buttonText: "...", buttonImage: "", buttonImageOnly: !1, hideIfNoPrevNext: !1, navigationAsDateFormat: !1, gotoCurrent: !1, changeMonth: !1, changeYear: !1, yearRange: "c-10:c+10", showOtherMonths: !1, selectOtherMonths: !1, showWeek: !1, calculateWeek: this.iso8601Week, shortYearCutoff: "+10", minDate: null, maxDate: null, duration: "fast", beforeShowDay: null, beforeShow: null, onSelect: null, onChangeMonthYear: null, onClose: null, numberOfMonths: 1, showCurrentAtPos: 0, stepMonths: 1, stepBigMonths: 12, altField: "", altFormat: "", constrainInput: !0, showButtonPanel: !1, autoSize: !1, disabled: !1 }, $.extend(this._defaults, this.regional[""]), this.dpDiv = bindHover($('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')) } $.extend($.ui, { datepicker: { version: "1.8.18"} }); var PROP_NAME = "datepicker", dpuuid = (new Date).getTime(), instActive; $.extend(Datepicker.prototype, { markerClassName: "hasDatepicker", maxRows: 4, log: function () { this.debug && console.log.apply("", arguments) }, _widgetDatepicker: function () { return this.dpDiv }, setDefaults: function (a) { extendRemove(this._defaults, a || {}); return this }, _attachDatepicker: function (target, settings) { var inlineSettings = null; for (var attrName in this._defaults) { var attrValue = target.getAttribute("date:" + attrName); if (attrValue) { inlineSettings = inlineSettings || {}; try { inlineSettings[attrName] = eval(attrValue) } catch (err) { inlineSettings[attrName] = attrValue } } } var nodeName = target.nodeName.toLowerCase(), inline = nodeName == "div" || nodeName == "span"; target.id || (this.uuid += 1, target.id = "dp" + this.uuid); var inst = this._newInst($(target), inline); inst.settings = $.extend({}, settings || {}, inlineSettings || {}), nodeName == "input" ? this._connectDatepicker(target, inst) : inline && this._inlineDatepicker(target, inst) }, _newInst: function (a, b) { var c = a[0].id.replace(/([^A-Za-z0-9_-])/g, "\\\\$1"); return { id: c, input: a, selectedDay: 0, selectedMonth: 0, selectedYear: 0, drawMonth: 0, drawYear: 0, inline: b, dpDiv: b ? bindHover($('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')) : this.dpDiv} }, _connectDatepicker: function (a, b) { var c = $(a); b.append = $([]), b.trigger = $([]); c.hasClass(this.markerClassName) || (this._attachments(c, b), c.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker", function (a, c, d) { b.settings[c] = d }).bind("getData.datepicker", function (a, c) { return this._get(b, c) }), this._autoSize(b), $.data(a, PROP_NAME, b), b.settings.disabled && this._disableDatepicker(a)) }, _attachments: function (a, b) { var c = this._get(b, "appendText"), d = this._get(b, "isRTL"); b.append && b.append.remove(), c && (b.append = $('<span class="' + this._appendClass + '">' + c + "</span>"), a[d ? "before" : "after"](b.append)), a.unbind("focus", this._showDatepicker), b.trigger && b.trigger.remove(); var e = this._get(b, "showOn"); (e == "focus" || e == "both") && a.focus(this._showDatepicker); if (e == "button" || e == "both") { var f = this._get(b, "buttonText"), g = this._get(b, "buttonImage"); b.trigger = $(this._get(b, "buttonImageOnly") ? $("<img/>").addClass(this._triggerClass).attr({ src: g, alt: f, title: f }) : $('<button type="button"></button>').addClass(this._triggerClass).html(g == "" ? f : $("<img/>").attr({ src: g, alt: f, title: f }))), a[d ? "before" : "after"](b.trigger), b.trigger.click(function () { $.datepicker._datepickerShowing && $.datepicker._lastInput == a[0] ? $.datepicker._hideDatepicker() : $.datepicker._datepickerShowing && $.datepicker._lastInput != a[0] ? ($.datepicker._hideDatepicker(), $.datepicker._showDatepicker(a[0])) : $.datepicker._showDatepicker(a[0]); return !1 }) } }, _autoSize: function (a) { if (this._get(a, "autoSize") && !a.inline) { var b = new Date(2009, 11, 20), c = this._get(a, "dateFormat"); if (c.match(/[DM]/)) { var d = function (a) { var b = 0, c = 0; for (var d = 0; d < a.length; d++) a[d].length > b && (b = a[d].length, c = d); return c }; b.setMonth(d(this._get(a, c.match(/MM/) ? "monthNames" : "monthNamesShort"))), b.setDate(d(this._get(a, c.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - b.getDay()) } a.input.attr("size", this._formatDate(a, b).length) } }, _inlineDatepicker: function (a, b) { var c = $(a); c.hasClass(this.markerClassName) || (c.addClass(this.markerClassName).append(b.dpDiv).bind("setData.datepicker", function (a, c, d) { b.settings[c] = d }).bind("getData.datepicker", function (a, c) { return this._get(b, c) }), $.data(a, PROP_NAME, b), this._setDate(b, this._getDefaultDate(b), !0), this._updateDatepicker(b), this._updateAlternate(b), b.settings.disabled && this._disableDatepicker(a), b.dpDiv.css("display", "block")) }, _dialogDatepicker: function (a, b, c, d, e) { var f = this._dialogInst; if (!f) { this.uuid += 1; var g = "dp" + this.uuid; this._dialogInput = $('<input type="text" id="' + g + '" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>'), this._dialogInput.keydown(this._doKeyDown), $("body").append(this._dialogInput), f = this._dialogInst = this._newInst(this._dialogInput, !1), f.settings = {}, $.data(this._dialogInput[0], PROP_NAME, f) } extendRemove(f.settings, d || {}), b = b && b.constructor == Date ? this._formatDate(f, b) : b, this._dialogInput.val(b), this._pos = e ? e.length ? e : [e.pageX, e.pageY] : null; if (!this._pos) { var h = document.documentElement.clientWidth, i = document.documentElement.clientHeight, j = document.documentElement.scrollLeft || document.body.scrollLeft, k = document.documentElement.scrollTop || document.body.scrollTop; this._pos = [h / 2 - 100 + j, i / 2 - 150 + k] } this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), f.settings.onSelect = c, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), $.blockUI && $.blockUI(this.dpDiv), $.data(this._dialogInput[0], PROP_NAME, f); return this }, _destroyDatepicker: function (a) { var b = $(a), c = $.data(a, PROP_NAME); if (!!b.hasClass(this.markerClassName)) { var d = a.nodeName.toLowerCase(); $.removeData(a, PROP_NAME), d == "input" ? (c.append.remove(), c.trigger.remove(), b.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : (d == "div" || d == "span") && b.removeClass(this.markerClassName).empty() } }, _enableDatepicker: function (a) { var b = $(a), c = $.data(a, PROP_NAME); if (!!b.hasClass(this.markerClassName)) { var d = a.nodeName.toLowerCase(); if (d == "input") a.disabled = !1, c.trigger.filter("button").each(function () { this.disabled = !1 }).end().filter("img").css({ opacity: "1.0", cursor: "" }); else if (d == "div" || d == "span") { var e = b.children("." + this._inlineClass); e.children().removeClass("ui-state-disabled"), e.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled") } this._disabledInputs = $.map(this._disabledInputs, function (b) { return b == a ? null : b }) } }, _disableDatepicker: function (a) { var b = $(a), c = $.data(a, PROP_NAME); if (!!b.hasClass(this.markerClassName)) { var d = a.nodeName.toLowerCase(); if (d == "input") a.disabled = !0, c.trigger.filter("button").each(function () { this.disabled = !0 }).end().filter("img").css({ opacity: "0.5", cursor: "default" }); else if (d == "div" || d == "span") { var e = b.children("." + this._inlineClass); e.children().addClass("ui-state-disabled"), e.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled", "disabled") } this._disabledInputs = $.map(this._disabledInputs, function (b) { return b == a ? null : b }), this._disabledInputs[this._disabledInputs.length] = a } }, _isDisabledDatepicker: function (a) { if (!a) return !1; for (var b = 0; b < this._disabledInputs.length; b++) if (this._disabledInputs[b] == a) return !0; return !1 }, _getInst: function (a) { try { return $.data(a, PROP_NAME) } catch (b) { throw "Missing instance data for this datepicker" } }, _optionDatepicker: function (a, b, c) { var d = this._getInst(a); if (arguments.length == 2 && typeof b == "string") return b == "defaults" ? $.extend({}, $.datepicker._defaults) : d ? b == "all" ? $.extend({}, d.settings) : this._get(d, b) : null; var e = b || {}; typeof b == "string" && (e = {}, e[b] = c); if (d) { this._curInst == d && this._hideDatepicker(); var f = this._getDateDatepicker(a, !0), g = this._getMinMaxDate(d, "min"), h = this._getMinMaxDate(d, "max"); extendRemove(d.settings, e), g !== null && e.dateFormat !== undefined && e.minDate === undefined && (d.settings.minDate = this._formatDate(d, g)), h !== null && e.dateFormat !== undefined && e.maxDate === undefined && (d.settings.maxDate = this._formatDate(d, h)), this._attachments($(a), d), this._autoSize(d), this._setDate(d, f), this._updateAlternate(d), this._updateDatepicker(d) } }, _changeDatepicker: function (a, b, c) { this._optionDatepicker(a, b, c) }, _refreshDatepicker: function (a) { var b = this._getInst(a); b && this._updateDatepicker(b) }, _setDateDatepicker: function (a, b) { var c = this._getInst(a); c && (this._setDate(c, b), this._updateDatepicker(c), this._updateAlternate(c)) }, _getDateDatepicker: function (a, b) { var c = this._getInst(a); c && !c.inline && this._setDateFromField(c, b); return c ? this._getDate(c) : null }, _doKeyDown: function (a) { var b = $.datepicker._getInst(a.target), c = !0, d = b.dpDiv.is(".ui-datepicker-rtl"); b._keyEvent = !0; if ($.datepicker._datepickerShowing) switch (a.keyCode) { case 9: $.datepicker._hideDatepicker(), c = !1; break; case 13: var e = $("td." + $.datepicker._dayOverClass + ":not(." + $.datepicker._currentClass + ")", b.dpDiv); e[0] && $.datepicker._selectDay(a.target, b.selectedMonth, b.selectedYear, e[0]); var f = $.datepicker._get(b, "onSelect"); if (f) { var g = $.datepicker._formatDate(b); f.apply(b.input ? b.input[0] : null, [g, b]) } else $.datepicker._hideDatepicker(); return !1; case 27: $.datepicker._hideDatepicker(); break; case 33: $.datepicker._adjustDate(a.target, a.ctrlKey ? -$.datepicker._get(b, "stepBigMonths") : -$.datepicker._get(b, "stepMonths"), "M"); break; case 34: $.datepicker._adjustDate(a.target, a.ctrlKey ? +$.datepicker._get(b, "stepBigMonths") : +$.datepicker._get(b, "stepMonths"), "M"); break; case 35: (a.ctrlKey || a.metaKey) && $.datepicker._clearDate(a.target), c = a.ctrlKey || a.metaKey; break; case 36: (a.ctrlKey || a.metaKey) && $.datepicker._gotoToday(a.target), c = a.ctrlKey || a.metaKey; break; case 37: (a.ctrlKey || a.metaKey) && $.datepicker._adjustDate(a.target, d ? 1 : -1, "D"), c = a.ctrlKey || a.metaKey, a.originalEvent.altKey && $.datepicker._adjustDate(a.target, a.ctrlKey ? -$.datepicker._get(b, "stepBigMonths") : -$.datepicker._get(b, "stepMonths"), "M"); break; case 38: (a.ctrlKey || a.metaKey) && $.datepicker._adjustDate(a.target, -7, "D"), c = a.ctrlKey || a.metaKey; break; case 39: (a.ctrlKey || a.metaKey) && $.datepicker._adjustDate(a.target, d ? -1 : 1, "D"), c = a.ctrlKey || a.metaKey, a.originalEvent.altKey && $.datepicker._adjustDate(a.target, a.ctrlKey ? +$.datepicker._get(b, "stepBigMonths") : +$.datepicker._get(b, "stepMonths"), "M"); break; case 40: (a.ctrlKey || a.metaKey) && $.datepicker._adjustDate(a.target, 7, "D"), c = a.ctrlKey || a.metaKey; break; default: c = !1 } else a.keyCode == 36 && a.ctrlKey ? $.datepicker._showDatepicker(this) : c = !1; c && (a.preventDefault(), a.stopPropagation()) }, _doKeyPress: function (a) { var b = $.datepicker._getInst(a.target); if ($.datepicker._get(b, "constrainInput")) { var c = $.datepicker._possibleChars($.datepicker._get(b, "dateFormat")), d = String.fromCharCode(a.charCode == undefined ? a.keyCode : a.charCode); return a.ctrlKey || a.metaKey || d < " " || !c || c.indexOf(d) > -1 } }, _doKeyUp: function (a) { var b = $.datepicker._getInst(a.target); if (b.input.val() != b.lastVal) try { var c = $.datepicker.parseDate($.datepicker._get(b, "dateFormat"), b.input ? b.input.val() : null, $.datepicker._getFormatConfig(b)); c && ($.datepicker._setDateFromField(b), $.datepicker._updateAlternate(b), $.datepicker._updateDatepicker(b)) } catch (a) { $.datepicker.log(a) } return !0 }, _showDatepicker: function (a) { a = a.target || a, a.nodeName.toLowerCase() != "input" && (a = $("input", a.parentNode)[0]); if (!$.datepicker._isDisabledDatepicker(a) && $.datepicker._lastInput != a) { var b = $.datepicker._getInst(a); $.datepicker._curInst && $.datepicker._curInst != b && ($.datepicker._curInst.dpDiv.stop(!0, !0), b && $.datepicker._datepickerShowing && $.datepicker._hideDatepicker($.datepicker._curInst.input[0])); var c = $.datepicker._get(b, "beforeShow"), d = c ? c.apply(a, [a, b]) : {}; if (d === !1) return; extendRemove(b.settings, d), b.lastVal = null, $.datepicker._lastInput = a, $.datepicker._setDateFromField(b), $.datepicker._inDialog && (a.value = ""), $.datepicker._pos || ($.datepicker._pos = $.datepicker._findPos(a), $.datepicker._pos[1] += a.offsetHeight); var e = !1; $(a).parents().each(function () { e |= $(this).css("position") == "fixed"; return !e }), e && $.browser.opera && ($.datepicker._pos[0] -= document.documentElement.scrollLeft, $.datepicker._pos[1] -= document.documentElement.scrollTop); var f = { left: $.datepicker._pos[0], top: $.datepicker._pos[1] }; $.datepicker._pos = null, b.dpDiv.empty(), b.dpDiv.css({ position: "absolute", display: "block", top: "-1000px" }), $.datepicker._updateDatepicker(b), f = $.datepicker._checkOffset(b, f, e), b.dpDiv.css({ position: $.datepicker._inDialog && $.blockUI ? "static" : e ? "fixed" : "absolute", display: "none", left: f.left + "px", top: f.top + "px" }); if (!b.inline) { var g = $.datepicker._get(b, "showAnim"), h = $.datepicker._get(b, "duration"), i = function () { var a = b.dpDiv.find("iframe.ui-datepicker-cover"); if (!!a.length) { var c = $.datepicker._getBorders(b.dpDiv); a.css({ left: -c[0], top: -c[1], width: b.dpDiv.outerWidth(), height: b.dpDiv.outerHeight() }) } }; b.dpDiv.zIndex($(a).zIndex() + 1), $.datepicker._datepickerShowing = !0, $.effects && $.effects[g] ? b.dpDiv.show(g, $.datepicker._get(b, "showOptions"), h, i) : b.dpDiv[g || "show"](g ? h : null, i), (!g || !h) && i(), b.input.is(":visible") && !b.input.is(":disabled") && b.input.focus(), $.datepicker._curInst = b } } }, _updateDatepicker: function (a) { var b = this; b.maxRows = 4; var c = $.datepicker._getBorders(a.dpDiv); instActive = a, a.dpDiv.empty().append(this._generateHTML(a)); var d = a.dpDiv.find("iframe.ui-datepicker-cover"); !d.length || d.css({ left: -c[0], top: -c[1], width: a.dpDiv.outerWidth(), height: a.dpDiv.outerHeight() }), a.dpDiv.find("." + this._dayOverClass + " a").mouseover(); var e = this._getNumberOfMonths(a), f = e[1], g = 17; a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), f > 1 && a.dpDiv.addClass("ui-datepicker-multi-" + f).css("width", g * f + "em"), a.dpDiv[(e[0] != 1 || e[1] != 1 ? "add" : "remove") + "Class"]("ui-datepicker-multi"), a.dpDiv[(this._get(a, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), a == $.datepicker._curInst && $.datepicker._datepickerShowing && a.input && a.input.is(":visible") && !a.input.is(":disabled") && a.input[0] != document.activeElement && a.input.focus(); if (a.yearshtml) { var h = a.yearshtml; setTimeout(function () { h === a.yearshtml && a.yearshtml && a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml), h = a.yearshtml = null }, 0) } }, _getBorders: function (a) { var b = function (a) { return { thin: 1, medium: 2, thick: 3}[a] || a }; return [parseFloat(b(a.css("border-left-width"))), parseFloat(b(a.css("border-top-width")))] }, _checkOffset: function (a, b, c) { var d = a.dpDiv.outerWidth(), e = a.dpDiv.outerHeight(), f = a.input ? a.input.outerWidth() : 0, g = a.input ? a.input.outerHeight() : 0, h = document.documentElement.clientWidth + $(document).scrollLeft(), i = document.documentElement.clientHeight + $(document).scrollTop(); b.left -= this._get(a, "isRTL") ? d - f : 0, b.left -= c && b.left == a.input.offset().left ? $(document).scrollLeft() : 0, b.top -= c && b.top == a.input.offset().top + g ? $(document).scrollTop() : 0, b.left -= Math.min(b.left, b.left + d > h && h > d ? Math.abs(b.left + d - h) : 0), b.top -= Math.min(b.top, b.top + e > i && i > e ? Math.abs(e + g) : 0); return b }, _findPos: function (a) { var b = this._getInst(a), c = this._get(b, "isRTL"); while (a && (a.type == "hidden" || a.nodeType != 1 || $.expr.filters.hidden(a))) a = a[c ? "previousSibling" : "nextSibling"]; var d = $(a).offset(); return [d.left, d.top] }, _hideDatepicker: function (a) { var b = this._curInst; if (!(!b || a && b != $.data(a, PROP_NAME)) && this._datepickerShowing) { var c = this._get(b, "showAnim"), d = this._get(b, "duration"), e = this, f = function () { $.datepicker._tidyDialog(b), e._curInst = null }; $.effects && $.effects[c] ? b.dpDiv.hide(c, $.datepicker._get(b, "showOptions"), d, f) : b.dpDiv[c == "slideDown" ? "slideUp" : c == "fadeIn" ? "fadeOut" : "hide"](c ? d : null, f), c || f(), this._datepickerShowing = !1; var g = this._get(b, "onClose"); g && g.apply(b.input ? b.input[0] : null, [b.input ? b.input.val() : "", b]), this._lastInput = null, this._inDialog && (this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" }), $.blockUI && ($.unblockUI(), $("body").append(this.dpDiv))), this._inDialog = !1 } }, _tidyDialog: function (a) { a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar") }, _checkExternalClick: function (a) { if (!!$.datepicker._curInst) { var b = $(a.target), c = $.datepicker._getInst(b[0]); (b[0].id != $.datepicker._mainDivId && b.parents("#" + $.datepicker._mainDivId).length == 0 && !b.hasClass($.datepicker.markerClassName) && !b.closest("." + $.datepicker._triggerClass).length && $.datepicker._datepickerShowing && (!$.datepicker._inDialog || !$.blockUI) || b.hasClass($.datepicker.markerClassName) && $.datepicker._curInst != c) && $.datepicker._hideDatepicker() } }, _adjustDate: function (a, b, c) { var d = $(a), e = this._getInst(d[0]); this._isDisabledDatepicker(d[0]) || (this._adjustInstDate(e, b + (c == "M" ? this._get(e, "showCurrentAtPos") : 0), c), this._updateDatepicker(e)) }, _gotoToday: function (a) { var b = $(a), c = this._getInst(b[0]); if (this._get(c, "gotoCurrent") && c.currentDay) c.selectedDay = c.currentDay, c.drawMonth = c.selectedMonth = c.currentMonth, c.drawYear = c.selectedYear = c.currentYear; else { var d = new Date; c.selectedDay = d.getDate(), c.drawMonth = c.selectedMonth = d.getMonth(), c.drawYear = c.selectedYear = d.getFullYear() } this._notifyChange(c), this._adjustDate(b) }, _selectMonthYear: function (a, b, c) { var d = $(a), e = this._getInst(d[0]); e["selected" + (c == "M" ? "Month" : "Year")] = e["draw" + (c == "M" ? "Month" : "Year")] = parseInt(b.options[b.selectedIndex].value, 10), this._notifyChange(e), this._adjustDate(d) }, _selectDay: function (a, b, c, d) { var e = $(a); if (!$(d).hasClass(this._unselectableClass) && !this._isDisabledDatepicker(e[0])) { var f = this._getInst(e[0]); f.selectedDay = f.currentDay = $("a", d).html(), f.selectedMonth = f.currentMonth = b, f.selectedYear = f.currentYear = c, this._selectDate(a, this._formatDate(f, f.currentDay, f.currentMonth, f.currentYear)) } }, _clearDate: function (a) { var b = $(a), c = this._getInst(b[0]); this._selectDate(b, "") }, _selectDate: function (a, b) { var c = $(a), d = this._getInst(c[0]); b = b != null ? b : this._formatDate(d), d.input && d.input.val(b), this._updateAlternate(d); var e = this._get(d, "onSelect"); e ? e.apply(d.input ? d.input[0] : null, [b, d]) : d.input && d.input.trigger("change"), d.inline ? this._updateDatepicker(d) : (this._hideDatepicker(), this._lastInput = d.input[0], typeof d.input[0] != "object" && d.input.focus(), this._lastInput = null) }, _updateAlternate: function (a) { var b = this._get(a, "altField"); if (b) { var c = this._get(a, "altFormat") || this._get(a, "dateFormat"), d = this._getDate(a), e = this.formatDate(c, d, this._getFormatConfig(a)); $(b).each(function () { $(this).val(e) }) } }, noWeekends: function (a) { var b = a.getDay(); return [b > 0 && b < 6, ""] }, iso8601Week: function (a) { var b = new Date(a.getTime()); b.setDate(b.getDate() + 4 - (b.getDay() || 7)); var c = b.getTime(); b.setMonth(0), b.setDate(1); return Math.floor(Math.round((c - b) / 864e5) / 7) + 1 }, parseDate: function (a, b, c) { if (a == null || b == null) throw "Invalid arguments"; b = typeof b == "object" ? b.toString() : b + ""; if (b == "") return null; var d = (c ? c.shortYearCutoff : null) || this._defaults.shortYearCutoff; d = typeof d != "string" ? d : (new Date).getFullYear() % 100 + parseInt(d, 10); var e = (c ? c.dayNamesShort : null) || this._defaults.dayNamesShort, f = (c ? c.dayNames : null) || this._defaults.dayNames, g = (c ? c.monthNamesShort : null) || this._defaults.monthNamesShort, h = (c ? c.monthNames : null) || this._defaults.monthNames, i = -1, j = -1, k = -1, l = -1, m = !1, n = function (b) { var c = s + 1 < a.length && a.charAt(s + 1) == b; c && s++; return c }, o = function (a) { var c = n(a), d = a == "@" ? 14 : a == "!" ? 20 : a == "y" && c ? 4 : a == "o" ? 3 : 2, e = new RegExp("^\\d{1," + d + "}"), f = b.substring(r).match(e); if (!f) throw "Missing number at position " + r; r += f[0].length; return parseInt(f[0], 10) }, p = function (a, c, d) { var e = $.map(n(a) ? d : c, function (a, b) { return [[b, a]] }).sort(function (a, b) { return -(a[1].length - b[1].length) }), f = -1; $.each(e, function (a, c) { var d = c[1]; if (b.substr(r, d.length).toLowerCase() == d.toLowerCase()) { f = c[0], r += d.length; return !1 } }); if (f != -1) return f + 1; throw "Unknown name at position " + r }, q = function () { if (b.charAt(r) != a.charAt(s)) throw "Unexpected literal at position " + r; r++ }, r = 0; for (var s = 0; s < a.length; s++) if (m) a.charAt(s) == "'" && !n("'") ? m = !1 : q(); else switch (a.charAt(s)) { case "d": k = o("d"); break; case "D": p("D", e, f); break; case "o": l = o("o"); break; case "m": j = o("m"); break; case "M": j = p("M", g, h); break; case "y": i = o("y"); break; case "@": var t = new Date(o("@")); i = t.getFullYear(), j = t.getMonth() + 1, k = t.getDate(); break; case "!": var t = new Date((o("!") - this._ticksTo1970) / 1e4); i = t.getFullYear(), j = t.getMonth() + 1, k = t.getDate(); break; case "'": n("'") ? q() : m = !0; break; default: q() } if (r < b.length) throw "Extra/unparsed characters found in date: " + b.substring(r); i == -1 ? i = (new Date).getFullYear() : i < 100 && (i += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (i <= d ? 0 : -100)); if (l > -1) { j = 1, k = l; for (; ; ) { var u = this._getDaysInMonth(i, j - 1); if (k <= u) break; j++, k -= u } } var t = this._daylightSavingAdjust(new Date(i, j - 1, k)); if (t.getFullYear() != i || t.getMonth() + 1 != j || t.getDate() != k) throw "Invalid date"; return t }, ATOM: "yy-mm-dd", COOKIE: "D, dd M yy", ISO_8601: "yy-mm-dd", RFC_822: "D, d M y", RFC_850: "DD, dd-M-y", RFC_1036: "D, d M y", RFC_1123: "D, d M yy", RFC_2822: "D, d M yy", RSS: "D, d M y", TICKS: "!", TIMESTAMP: "@", W3C: "yy-mm-dd", _ticksTo1970: (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 24 * 60 * 60 * 1e7, formatDate: function (a, b, c) { if (!b) return ""; var d = (c ? c.dayNamesShort : null) || this._defaults.dayNamesShort, e = (c ? c.dayNames : null) || this._defaults.dayNames, f = (c ? c.monthNamesShort : null) || this._defaults.monthNamesShort, g = (c ? c.monthNames : null) || this._defaults.monthNames, h = function (b) { var c = m + 1 < a.length && a.charAt(m + 1) == b; c && m++; return c }, i = function (a, b, c) { var d = "" + b; if (h(a)) while (d.length < c) d = "0" + d; return d }, j = function (a, b, c, d) { return h(a) ? d[b] : c[b] }, k = "", l = !1; if (b) for (var m = 0; m < a.length; m++) if (l) a.charAt(m) == "'" && !h("'") ? l = !1 : k += a.charAt(m); else switch (a.charAt(m)) { case "d": k += i("d", b.getDate(), 2); break; case "D": k += j("D", b.getDay(), d, e); break; case "o": k += i("o", Math.round(((new Date(b.getFullYear(), b.getMonth(), b.getDate())).getTime() - (new Date(b.getFullYear(), 0, 0)).getTime()) / 864e5), 3); break; case "m": k += i("m", b.getMonth() + 1, 2); break; case "M": k += j("M", b.getMonth(), f, g); break; case "y": k += h("y") ? b.getFullYear() : (b.getYear() % 100 < 10 ? "0" : "") + b.getYear() % 100; break; case "@": k += b.getTime(); break; case "!": k += b.getTime() * 1e4 + this._ticksTo1970; break; case "'": h("'") ? k += "'" : l = !0; break; default: k += a.charAt(m) } return k }, _possibleChars: function (a) { var b = "", c = !1, d = function (b) { var c = e + 1 < a.length && a.charAt(e + 1) == b; c && e++; return c }; for (var e = 0; e < a.length; e++) if (c) a.charAt(e) == "'" && !d("'") ? c = !1 : b += a.charAt(e); else switch (a.charAt(e)) { case "d": case "m": case "y": case "@": b += "0123456789"; break; case "D": case "M": return null; case "'": d("'") ? b += "'" : c = !0; break; default: b += a.charAt(e) } return b }, _get: function (a, b) { return a.settings[b] !== undefined ? a.settings[b] : this._defaults[b] }, _setDateFromField: function (a, b) { if (a.input.val() != a.lastVal) { var c = this._get(a, "dateFormat"), d = a.lastVal = a.input ? a.input.val() : null, e, f; e = f = this._getDefaultDate(a); var g = this._getFormatConfig(a); try { e = this.parseDate(c, d, g) || f } catch (h) { this.log(h), d = b ? "" : d } a.selectedDay = e.getDate(), a.drawMonth = a.selectedMonth = e.getMonth(), a.drawYear = a.selectedYear = e.getFullYear(), a.currentDay = d ? e.getDate() : 0, a.currentMonth = d ? e.getMonth() : 0, a.currentYear = d ? e.getFullYear() : 0, this._adjustInstDate(a) } }, _getDefaultDate: function (a) { return this._restrictMinMax(a, this._determineDate(a, this._get(a, "defaultDate"), new Date)) }, _determineDate: function (a, b, c) { var d = function (a) { var b = new Date; b.setDate(b.getDate() + a); return b }, e = function (b) { try { return $.datepicker.parseDate($.datepicker._get(a, "dateFormat"), b, $.datepicker._getFormatConfig(a)) } catch (c) { } var d = (b.toLowerCase().match(/^c/) ? $.datepicker._getDate(a) : null) || new Date, e = d.getFullYear(), f = d.getMonth(), g = d.getDate(), h = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, i = h.exec(b); while (i) { switch (i[2] || "d") { case "d": case "D": g += parseInt(i[1], 10); break; case "w": case "W": g += parseInt(i[1], 10) * 7; break; case "m": case "M": f += parseInt(i[1], 10), g = Math.min(g, $.datepicker._getDaysInMonth(e, f)); break; case "y": case "Y": e += parseInt(i[1], 10), g = Math.min(g, $.datepicker._getDaysInMonth(e, f)) } i = h.exec(b) } return new Date(e, f, g) }, f = b == null || b === "" ? c : typeof b == "string" ? e(b) : typeof b == "number" ? isNaN(b) ? c : d(b) : new Date(b.getTime()); f = f && f.toString() == "Invalid Date" ? c : f, f && (f.setHours(0), f.setMinutes(0), f.setSeconds(0), f.setMilliseconds(0)); return this._daylightSavingAdjust(f) }, _daylightSavingAdjust: function (a) { if (!a) return null; a.setHours(a.getHours() > 12 ? a.getHours() + 2 : 0); return a }, _setDate: function (a, b, c) { var d = !b, e = a.selectedMonth, f = a.selectedYear, g = this._restrictMinMax(a, this._determineDate(a, b, new Date)); a.selectedDay = a.currentDay = g.getDate(), a.drawMonth = a.selectedMonth = a.currentMonth = g.getMonth(), a.drawYear = a.selectedYear = a.currentYear = g.getFullYear(), (e != a.selectedMonth || f != a.selectedYear) && !c && this._notifyChange(a), this._adjustInstDate(a), a.input && a.input.val(d ? "" : this._formatDate(a)) }, _getDate: function (a) { var b = !a.currentYear || a.input && a.input.val() == "" ? null : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay)); return b }, _generateHTML: function (a) {
        var b = new Date; b = this._daylightSavingAdjust(new Date(b.getFullYear(), b.getMonth(), b.getDate())); var c = this._get(a, "isRTL"), d = this._get(a, "showButtonPanel"), e = this._get(a, "hideIfNoPrevNext"), f = this._get(a, "navigationAsDateFormat"), g = this._getNumberOfMonths(a), h = this._get(a, "showCurrentAtPos"), i = this._get(a, "stepMonths"), j = g[0] != 1 || g[1] != 1, k = this._daylightSavingAdjust(a.currentDay ? new Date(a.currentYear, a.currentMonth, a.currentDay) : new Date(9999, 9, 9)), l = this._getMinMaxDate(a, "min"), m = this._getMinMaxDate(a, "max"), n = a.drawMonth - h, o = a.drawYear; n < 0 && (n += 12, o--); if (m) { var p = this._daylightSavingAdjust(new Date(m.getFullYear(), m.getMonth() - g[0] * g[1] + 1, m.getDate())); p = l && p < l ? l : p; while (this._daylightSavingAdjust(new Date(o, n, 1)) > p) n--, n < 0 && (n = 11, o--) } a.drawMonth = n, a.drawYear = o; var q = this._get(a, "prevText"); q = f ? this.formatDate(q, this._daylightSavingAdjust(new Date(o, n - i, 1)), this._getFormatConfig(a)) : q; var r = this._canAdjustMonth(a, -1, o, n) ? '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + dpuuid + ".datepicker._adjustDate('#" + a.id + "', -" + i + ", 'M');\"" + ' title="' + q + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "e" : "w") + '">' + q + "</span></a>" : e ? "" : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + q + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "e" : "w") + '">' + q + "</span></a>", s = this._get(a, "nextText"); s = f ? this.formatDate(s, this._daylightSavingAdjust(new Date(o, n + i, 1)), this._getFormatConfig(a)) : s; var t = this._canAdjustMonth(a, 1, o, n) ? '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' + dpuuid + ".datepicker._adjustDate('#" + a.id + "', +" + i + ", 'M');\"" + ' title="' + s + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "w" : "e") + '">' + s + "</span></a>" : e ? "" : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + s + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "w" : "e") + '">' + s + "</span></a>", u = this._get(a, "currentText"), v = this._get(a, "gotoCurrent") && a.currentDay ? k : b; u = f ? this.formatDate(u, v, this._getFormatConfig(a)) : u; var w = a.inline ? "" : '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + dpuuid + '.datepicker._hideDatepicker();">' + this._get(a, "closeText") + "</button>", x = d ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (c ? w : "") + (this._isInRange(a, v) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_' + dpuuid + ".datepicker._gotoToday('#" + a.id + "');\"" + ">" + u + "</button>" : "") + (c ? "" : w) + "</div>" : "", y = parseInt(this._get(a, "firstDay"), 10); y = isNaN(y) ? 0 : y; var z = this._get(a, "showWeek"), A = this._get(a, "dayNames"), B = this._get(a, "dayNamesShort"), C = this._get(a, "dayNamesMin"), D = this._get(a, "monthNames"), E = this._get(a, "monthNamesShort"), F = this._get(a, "beforeShowDay"), G = this._get(a, "showOtherMonths"), H = this._get(a, "selectOtherMonths"), I = this._get(a, "calculateWeek") || this.iso8601Week, J = this._getDefaultDate(a), K = ""; for (var L = 0; L < g[0]; L++) { var M = ""; this.maxRows = 4; for (var N = 0; N < g[1]; N++) { var O = this._daylightSavingAdjust(new Date(o, n, a.selectedDay)), P = " ui-corner-all", Q = ""; if (j) { Q += '<div class="ui-datepicker-group'; if (g[1] > 1) switch (N) { case 0: Q += " ui-datepicker-group-first", P = " ui-corner-" + (c ? "right" : "left"); break; case g[1] - 1: Q += " ui-datepicker-group-last", P = " ui-corner-" + (c ? "left" : "right"); break; default: Q += " ui-datepicker-group-middle", P = "" } Q += '">' } Q += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + P + '">' + (/all|left/.test(P) && L == 0 ? c ? t : r : "") + (/all|right/.test(P) && L == 0 ? c ? r : t : "") + this._generateMonthYearHeader(a, n, o, l, m, L > 0 || N > 0, D, E) + '</div><table class="ui-datepicker-calendar"><thead>' + "<tr>"; var R = z ? '<th class="ui-datepicker-week-col">' + this._get(a, "weekHeader") + "</th>" : ""; for (var S = 0; S < 7; S++) { var T = (S + y) % 7; R += "<th" + ((S + y + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : "") + ">" + '<span title="' + A[T] + '">' + C[T] + "</span></th>" } Q += R + "</tr></thead><tbody>"; var U = this._getDaysInMonth(o, n); o == a.selectedYear && n == a.selectedMonth && (a.selectedDay = Math.min(a.selectedDay, U)); var V = (this._getFirstDayOfMonth(o, n) - y + 7) % 7, W = Math.ceil((V + U) / 7), X = j ? this.maxRows > W ? this.maxRows : W : W; this.maxRows = X; var Y = this._daylightSavingAdjust(new Date(o, n, 1 - V)); for (var Z = 0; Z < X; Z++) { Q += "<tr>"; var _ = z ? '<td class="ui-datepicker-week-col">' + this._get(a, "calculateWeek")(Y) + "</td>" : ""; for (var S = 0; S < 7; S++) { var ba = F ? F.apply(a.input ? a.input[0] : null, [Y]) : [!0, ""], bb = Y.getMonth() != n, bc = bb && !H || !ba[0] || l && Y < l || m && Y > m; _ += '<td class="' + ((S + y + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (bb ? " ui-datepicker-other-month" : "") + (Y.getTime() == O.getTime() && n == a.selectedMonth && a._keyEvent || J.getTime() == Y.getTime() && J.getTime() == O.getTime() ? " " + this._dayOverClass : "") + (bc ? " " + this._unselectableClass + " ui-state-disabled" : "") + (bb && !G ? "" : " " + ba[1] + (Y.getTime() == k.getTime() ? " " + this._currentClass : "") + (Y.getTime() == b.getTime() ? " ui-datepicker-today" : "")) + '"' + ((!bb || G) && ba[2] ? ' title="' + ba[2] + '"' : "") + (bc ? "" : ' onclick="DP_jQuery_' + dpuuid + ".datepicker._selectDay('#" + a.id + "'," + Y.getMonth() + "," + Y.getFullYear() + ', this);return false;"') + ">" + (bb && !G ? "&#xa0;" : bc ? '<span class="ui-state-default">' + Y.getDate() + "</span>" : '<a class="ui-state-default' + (Y.getTime() == b.getTime() ? " ui-state-highlight" : "") + (Y.getTime() == k.getTime() ? " ui-state-active" : "") + (bb ? " ui-priority-secondary" : "") + '" href="#">' + Y.getDate() + "</a>") + "</td>", Y.setDate(Y.getDate() + 1), Y = this._daylightSavingAdjust(Y) } Q += _ + "</tr>" } n++, n > 11 && (n = 0, o++), Q += "</tbody></table>" + (j ? "</div>" + (g[0] > 0 && N == g[1] - 1 ? '<div class="ui-datepicker-row-break"></div>' : "") : ""), M += Q } K += M } K += x + ($.browser.msie && parseInt($.browser.version, 10) < 7 && !a.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : ""),
a._keyEvent = !1; return K
    }, _generateMonthYearHeader: function (a, b, c, d, e, f, g, h) { var i = this._get(a, "changeMonth"), j = this._get(a, "changeYear"), k = this._get(a, "showMonthAfterYear"), l = '<div class="ui-datepicker-title">', m = ""; if (f || !i) m += '<span class="ui-datepicker-month">' + g[b] + "</span>"; else { var n = d && d.getFullYear() == c, o = e && e.getFullYear() == c; m += '<select class="ui-datepicker-month" onchange="DP_jQuery_' + dpuuid + ".datepicker._selectMonthYear('#" + a.id + "', this, 'M');\" " + ">"; for (var p = 0; p < 12; p++) (!n || p >= d.getMonth()) && (!o || p <= e.getMonth()) && (m += '<option value="' + p + '"' + (p == b ? ' selected="selected"' : "") + ">" + h[p] + "</option>"); m += "</select>" } k || (l += m + (f || !i || !j ? "&#xa0;" : "")); if (!a.yearshtml) { a.yearshtml = ""; if (f || !j) l += '<span class="ui-datepicker-year">' + c + "</span>"; else { var q = this._get(a, "yearRange").split(":"), r = (new Date).getFullYear(), s = function (a) { var b = a.match(/c[+-].*/) ? c + parseInt(a.substring(1), 10) : a.match(/[+-].*/) ? r + parseInt(a, 10) : parseInt(a, 10); return isNaN(b) ? r : b }, t = s(q[0]), u = Math.max(t, s(q[1] || "")); t = d ? Math.max(t, d.getFullYear()) : t, u = e ? Math.min(u, e.getFullYear()) : u, a.yearshtml += '<select class="ui-datepicker-year" onchange="DP_jQuery_' + dpuuid + ".datepicker._selectMonthYear('#" + a.id + "', this, 'Y');\" " + ">"; for (; t <= u; t++) a.yearshtml += '<option value="' + t + '"' + (t == c ? ' selected="selected"' : "") + ">" + t + "</option>"; a.yearshtml += "</select>", l += a.yearshtml, a.yearshtml = null } } l += this._get(a, "yearSuffix"), k && (l += (f || !i || !j ? "&#xa0;" : "") + m), l += "</div>"; return l }, _adjustInstDate: function (a, b, c) { var d = a.drawYear + (c == "Y" ? b : 0), e = a.drawMonth + (c == "M" ? b : 0), f = Math.min(a.selectedDay, this._getDaysInMonth(d, e)) + (c == "D" ? b : 0), g = this._restrictMinMax(a, this._daylightSavingAdjust(new Date(d, e, f))); a.selectedDay = g.getDate(), a.drawMonth = a.selectedMonth = g.getMonth(), a.drawYear = a.selectedYear = g.getFullYear(), (c == "M" || c == "Y") && this._notifyChange(a) }, _restrictMinMax: function (a, b) { var c = this._getMinMaxDate(a, "min"), d = this._getMinMaxDate(a, "max"), e = c && b < c ? c : b; e = d && e > d ? d : e; return e }, _notifyChange: function (a) { var b = this._get(a, "onChangeMonthYear"); b && b.apply(a.input ? a.input[0] : null, [a.selectedYear, a.selectedMonth + 1, a]) }, _getNumberOfMonths: function (a) { var b = this._get(a, "numberOfMonths"); return b == null ? [1, 1] : typeof b == "number" ? [1, b] : b }, _getMinMaxDate: function (a, b) { return this._determineDate(a, this._get(a, b + "Date"), null) }, _getDaysInMonth: function (a, b) { return 32 - this._daylightSavingAdjust(new Date(a, b, 32)).getDate() }, _getFirstDayOfMonth: function (a, b) { return (new Date(a, b, 1)).getDay() }, _canAdjustMonth: function (a, b, c, d) { var e = this._getNumberOfMonths(a), f = this._daylightSavingAdjust(new Date(c, d + (b < 0 ? b : e[0] * e[1]), 1)); b < 0 && f.setDate(this._getDaysInMonth(f.getFullYear(), f.getMonth())); return this._isInRange(a, f) }, _isInRange: function (a, b) { var c = this._getMinMaxDate(a, "min"), d = this._getMinMaxDate(a, "max"); return (!c || b.getTime() >= c.getTime()) && (!d || b.getTime() <= d.getTime()) }, _getFormatConfig: function (a) { var b = this._get(a, "shortYearCutoff"); b = typeof b != "string" ? b : (new Date).getFullYear() % 100 + parseInt(b, 10); return { shortYearCutoff: b, dayNamesShort: this._get(a, "dayNamesShort"), dayNames: this._get(a, "dayNames"), monthNamesShort: this._get(a, "monthNamesShort"), monthNames: this._get(a, "monthNames")} }, _formatDate: function (a, b, c, d) { b || (a.currentDay = a.selectedDay, a.currentMonth = a.selectedMonth, a.currentYear = a.selectedYear); var e = b ? typeof b == "object" ? b : this._daylightSavingAdjust(new Date(d, c, b)) : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay)); return this.formatDate(this._get(a, "dateFormat"), e, this._getFormatConfig(a)) }
    }), $.fn.datepicker = function (a) { if (!this.length) return this; $.datepicker.initialized || ($(document).mousedown($.datepicker._checkExternalClick).find("body").append($.datepicker.dpDiv), $.datepicker.initialized = !0); var b = Array.prototype.slice.call(arguments, 1); if (typeof a == "string" && (a == "isDisabled" || a == "getDate" || a == "widget")) return $.datepicker["_" + a + "Datepicker"].apply($.datepicker, [this[0]].concat(b)); if (a == "option" && arguments.length == 2 && typeof arguments[1] == "string") return $.datepicker["_" + a + "Datepicker"].apply($.datepicker, [this[0]].concat(b)); return this.each(function () { typeof a == "string" ? $.datepicker["_" + a + "Datepicker"].apply($.datepicker, [this].concat(b)) : $.datepicker._attachDatepicker(this, a) }) }, $.datepicker = new Datepicker, $.datepicker.initialized = !1, $.datepicker.uuid = (new Date).getTime(), $.datepicker.version = "1.8.18", window["DP_jQuery_" + dpuuid] = $
})(jQuery); /*
/*Start Slick Grid*/
/*

(c) 2009-2012 Michael Leibman
michael{dot}leibman{at}gmail{dot}com
http://github.com/mleibman/slickgrid

Distributed under MIT license.
All rights reserved.

Copyright (c) 2010 Michael Leibman, http://github.com/mleibman/slickgrid

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

SlickGrid v2.0

NOTES:
Cell/row DOM manipulations are done directly bypassing jQuery's DOM manipulation methods.
This increases the speed dramatically, but can only be done safely because there are no event handlers
or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
and do proper cleanup.
*/
/***
* Contains core SlickGrid classes.
* @module Core
* @namespace Slick
*/

(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "Event": Event,
            "EventData": EventData,
            "EventHandler": EventHandler,
            "Range": Range,
            "NonDataRow": NonDataItem,
            "Group": Group,
            "GroupTotals": GroupTotals,
            "EditorLock": EditorLock,

            /***
            * A global singleton editor lock.
            * @class GlobalEditorLock
            * @static
            * @constructor
            */
            "GlobalEditorLock": new EditorLock()
        }
    });

    /***
    * An event object for passing data to event handlers and letting them control propagation.
    * <p>This is pretty much identical to how W3C and jQuery implement events.</p>
    * @class EventData
    * @constructor
    */
    function EventData() {
        var isPropagationStopped = false;
        var isImmediatePropagationStopped = false;

        /***
        * Stops event from propagating up the DOM tree.
        * @method stopPropagation
        */
        this.stopPropagation = function () {
            isPropagationStopped = true;
        };

        /***
        * Returns whether stopPropagation was called on this event object.
        * @method isPropagationStopped
        * @return {Boolean}
        */
        this.isPropagationStopped = function () {
            return isPropagationStopped;
        };

        /***
        * Prevents the rest of the handlers from being executed.
        * @method stopImmediatePropagation
        */
        this.stopImmediatePropagation = function () {
            isImmediatePropagationStopped = true;
        };

        /***
        * Returns whether stopImmediatePropagation was called on this event object.\
        * @method isImmediatePropagationStopped
        * @return {Boolean}
        */
        this.isImmediatePropagationStopped = function () {
            return isImmediatePropagationStopped;
        }
    }

    /***
    * A simple publisher-subscriber implementation.
    * @class Event
    * @constructor
    */
    function Event() {
        var handlers = [];

        /***
        * Adds an event handler to be called when the event is fired.
        * <p>Event handler will receive two arguments - an <code>EventData</code> and the <code>data</code>
        * object the event was fired with.<p>
        * @method subscribe
        * @param fn {Function} Event handler.
        */
        this.subscribe = function (fn) {
            handlers.push(fn);
        };

        /***
        * Removes an event handler added with <code>subscribe(fn)</code>.
        * @method unsubscribe
        * @param fn {Function} Event handler to be removed.
        */
        this.unsubscribe = function (fn) {
            for (var i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i] === fn) {
                    handlers.splice(i, 1);
                }
            }
        };

        /***
        * Fires an event notifying all subscribers.
        * @method notify
        * @param args {Object} Additional data object to be passed to all handlers.
        * @param e {EventData}
        *      Optional.
        *      An <code>EventData</code> object to be passed to all handlers.
        *      For DOM events, an existing W3C/jQuery event object can be passed in.
        * @param scope {Object}
        *      Optional.
        *      The scope ("this") within which the handler will be executed.
        *      If not specified, the scope will be set to the <code>Event</code> instance.
        */
        this.notify = function (args, e, scope) {
            e = e || new EventData();
            scope = scope || this;

            var returnValue;
            for (var i = 0; i < handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()); i++) {
                returnValue = handlers[i].call(scope, e, args);
            }

            return returnValue;
        };
    }

    function EventHandler() {
        var handlers = [];

        this.subscribe = function (event, handler) {
            handlers.push({
                event: event,
                handler: handler
            });
            event.subscribe(handler);

            return this;  // allow chaining
        };

        this.unsubscribe = function (event, handler) {
            var i = handlers.length;
            while (i--) {
                if (handlers[i].event === event &&
            handlers[i].handler === handler) {
                    handlers.splice(i, 1);
                    event.unsubscribe(handler);
                    return;
                }
            }

            return this;  // allow chaining
        };

        this.unsubscribeAll = function () {
            var i = handlers.length;
            while (i--) {
                handlers[i].event.unsubscribe(handlers[i].handler);
            }
            handlers = [];

            return this;  // allow chaining
        }
    }

    /***
    * A structure containing a range of cells.
    * @class Range
    * @constructor
    * @param fromRow {Integer} Starting row.
    * @param fromCell {Integer} Starting cell.
    * @param toRow {Integer} Optional. Ending row. Defaults to <code>fromRow</code>.
    * @param toCell {Integer} Optional. Ending cell. Defaults to <code>fromCell</code>.
    */
    function Range(fromRow, fromCell, toRow, toCell) {
        if (toRow === undefined && toCell === undefined) {
            toRow = fromRow;
            toCell = fromCell;
        }

        /***
        * @property fromRow
        * @type {Integer}
        */
        this.fromRow = Math.min(fromRow, toRow);

        /***
        * @property fromCell
        * @type {Integer}
        */
        this.fromCell = Math.min(fromCell, toCell);

        /***
        * @property toRow
        * @type {Integer}
        */
        this.toRow = Math.max(fromRow, toRow);

        /***
        * @property toCell
        * @type {Integer}
        */
        this.toCell = Math.max(fromCell, toCell);

        /***
        * Returns whether a range represents a single row.
        * @method isSingleRow
        * @return {Boolean}
        */
        this.isSingleRow = function () {
            return this.fromRow == this.toRow;
        };

        /***
        * Returns whether a range represents a single cell.
        * @method isSingleCell
        * @return {Boolean}
        */
        this.isSingleCell = function () {
            return this.fromRow == this.toRow && this.fromCell == this.toCell;
        };

        /***
        * Returns whether a range contains a given cell.
        * @method contains
        * @param row {Integer}
        * @param cell {Integer}
        * @return {Boolean}
        */
        this.contains = function (row, cell) {
            return row >= this.fromRow && row <= this.toRow &&
          cell >= this.fromCell && cell <= this.toCell;
        };

        /***
        * Returns a readable representation of a range.
        * @method toString
        * @return {String}
        */
        this.toString = function () {
            if (this.isSingleCell()) {
                return "(" + this.fromRow + ":" + this.fromCell + ")";
            }
            else {
                return "(" + this.fromRow + ":" + this.fromCell + " - " + this.toRow + ":" + this.toCell + ")";
            }
        }
    }


    /***
    * A base class that all special / non-data rows (like Group and GroupTotals) derive from.
    * @class NonDataItem
    * @constructor
    */
    function NonDataItem() {
        this.__nonDataRow = true;
    }


    /***
    * Information about a group of rows.
    * @class Group
    * @extends Slick.NonDataItem
    * @constructor
    */
    function Group() {
        this.__group = true;
        this.__updated = false;

        /***
        * Number of rows in the group.
        * @property count
        * @type {Integer}
        */
        this.count = 0;

        /***
        * Grouping value.
        * @property value
        * @type {Object}
        */
        this.value = null;

        /***
        * Formatted display value of the group.
        * @property title
        * @type {String}
        */
        this.title = null;

        /***
        * Whether a group is collapsed.
        * @property collapsed
        * @type {Boolean}
        */
        this.collapsed = false;

        /***
        * GroupTotals, if any.
        * @property totals
        * @type {GroupTotals}
        */
        this.totals = null;
    }

    Group.prototype = new NonDataItem();

    /***
    * Compares two Group instances.
    * @method equals
    * @return {Boolean}
    * @param group {Group} Group instance to compare to.
    */
    Group.prototype.equals = function (group) {
        return this.value === group.value &&
        this.count === group.count &&
        this.collapsed === group.collapsed;
    };

    /***
    * Information about group totals.
    * An instance of GroupTotals will be created for each totals row and passed to the aggregators
    * so that they can store arbitrary data in it.  That data can later be accessed by group totals
    * formatters during the display.
    * @class GroupTotals
    * @extends Slick.NonDataItem
    * @constructor
    */
    function GroupTotals() {
        this.__groupTotals = true;

        /***
        * Parent Group.
        * @param group
        * @type {Group}
        */
        this.group = null;
    }

    GroupTotals.prototype = new NonDataItem();

    /***
    * A locking helper to track the active edit controller and ensure that only a single controller
    * can be active at a time.  This prevents a whole class of state and validation synchronization
    * issues.  An edit controller (such as SlickGrid) can query if an active edit is in progress
    * and attempt a commit or cancel before proceeding.
    * @class EditorLock
    * @constructor
    */
    function EditorLock() {
        var activeEditController = null;

        /***
        * Returns true if a specified edit controller is active (has the edit lock).
        * If the parameter is not specified, returns true if any edit controller is active.
        * @method isActive
        * @param editController {EditController}
        * @return {Boolean}
        */
        this.isActive = function (editController) {
            return (editController ? activeEditController === editController : activeEditController !== null);
        };

        /***
        * Sets the specified edit controller as the active edit controller (acquire edit lock).
        * If another edit controller is already active, and exception will be thrown.
        * @method activate
        * @param editController {EditController} edit controller acquiring the lock
        */
        this.activate = function (editController) {
            if (editController === activeEditController) { // already activated?
                return;
            }
            if (activeEditController !== null) {
                throw "SlickGrid.EditorLock.activate: an editController is still active, can't activate another editController";
            }
            if (!editController.commitCurrentEdit) {
                throw "SlickGrid.EditorLock.activate: editController must implement .commitCurrentEdit()";
            }
            if (!editController.cancelCurrentEdit) {
                throw "SlickGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()";
            }
            activeEditController = editController;
        };

        /***
        * Unsets the specified edit controller as the active edit controller (release edit lock).
        * If the specified edit controller is not the active one, an exception will be thrown.
        * @method deactivate
        * @param editController {EditController} edit controller releasing the lock
        */
        this.deactivate = function (editController) {
            if (activeEditController !== editController) {
                throw "SlickGrid.EditorLock.deactivate: specified editController is not the currently active one";
            }
            activeEditController = null;
        };

        /***
        * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
        * controller and returns whether the commit attempt was successful (commit may fail due to validation
        * errors, etc.).  Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
        * and false otherwise.  If no edit controller is active, returns true.
        * @method commitCurrentEdit
        * @return {Boolean}
        */
        this.commitCurrentEdit = function () {
            return (activeEditController ? activeEditController.commitCurrentEdit() : true);
        };

        /***
        * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
        * controller and returns whether the edit was successfully cancelled.  If no edit controller is
        * active, returns true.
        * @method cancelCurrentEdit
        * @return {Boolean}
        */
        this.cancelCurrentEdit = function cancelCurrentEdit() {
            return (activeEditController ? activeEditController.cancelCurrentEdit() : true);
        };
    }
})(jQuery);
/*! 
* jquery.event.drag - v 2.0.0 
* Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
* Open Source MIT License - http://threedubmedia.com/code/license
*/
; (function (f) { f.fn.drag = function (b, a, d) { var e = typeof b == "string" ? b : "", k = f.isFunction(b) ? b : f.isFunction(a) ? a : null; if (e.indexOf("drag") !== 0) e = "drag" + e; d = (b == k ? a : d) || {}; return k ? this.bind(e, d, k) : this.trigger(e) }; var i = f.event, h = i.special, c = h.drag = { defaults: { which: 1, distance: 0, not: ":input", handle: null, relative: false, drop: true, click: false }, datakey: "dragdata", livekey: "livedrag", add: function (b) { var a = f.data(this, c.datakey), d = b.data || {}; a.related += 1; if (!a.live && b.selector) { a.live = true; i.add(this, "draginit." + c.livekey, c.delegate) } f.each(c.defaults, function (e) { if (d[e] !== undefined) a[e] = d[e] }) }, remove: function () { f.data(this, c.datakey).related -= 1 }, setup: function () { if (!f.data(this, c.datakey)) { var b = f.extend({ related: 0 }, c.defaults); f.data(this, c.datakey, b); i.add(this, "mousedown", c.init, b); this.attachEvent && this.attachEvent("ondragstart", c.dontstart) } }, teardown: function () { if (!f.data(this, c.datakey).related) { f.removeData(this, c.datakey); i.remove(this, "mousedown", c.init); i.remove(this, "draginit", c.delegate); c.textselect(true); this.detachEvent && this.detachEvent("ondragstart", c.dontstart) } }, init: function (b) { var a = b.data, d; if (!(a.which > 0 && b.which != a.which)) if (!f(b.target).is(a.not)) if (!(a.handle && !f(b.target).closest(a.handle, b.currentTarget).length)) { a.propagates = 1; a.interactions = [c.interaction(this, a)]; a.target = b.target; a.pageX = b.pageX; a.pageY = b.pageY; a.dragging = null; d = c.hijack(b, "draginit", a); if (a.propagates) { if ((d = c.flatten(d)) && d.length) { a.interactions = []; f.each(d, function () { a.interactions.push(c.interaction(this, a)) }) } a.propagates = a.interactions.length; a.drop !== false && h.drop && h.drop.handler(b, a); c.textselect(false); i.add(document, "mousemove mouseup", c.handler, a); return false } } }, interaction: function (b, a) { return { drag: b, callback: new c.callback, droppable: [], offset: f(b)[a.relative ? "position" : "offset"]() || { top: 0, left: 0}} }, handler: function (b) { var a = b.data; switch (b.type) { case !a.dragging && "mousemove": if (Math.pow(b.pageX - a.pageX, 2) + Math.pow(b.pageY - a.pageY, 2) < Math.pow(a.distance, 2)) break; b.target = a.target; c.hijack(b, "dragstart", a); if (a.propagates) a.dragging = true; case "mousemove": if (a.dragging) { c.hijack(b, "drag", a); if (a.propagates) { a.drop !== false && h.drop && h.drop.handler(b, a); break } b.type = "mouseup" } case "mouseup": i.remove(document, "mousemove mouseup", c.handler); if (a.dragging) { a.drop !== false && h.drop && h.drop.handler(b, a); c.hijack(b, "dragend", a) } c.textselect(true); if (a.click === false && a.dragging) { jQuery.event.triggered = true; setTimeout(function () { jQuery.event.triggered = false }, 20); a.dragging = false } break } }, delegate: function (b) { var a = [], d, e = f.data(this, "events") || {}; f.each(e.live || [], function (k, j) { if (j.preType.indexOf("drag") === 0) if (d = f(b.target).closest(j.selector, b.currentTarget)[0]) { i.add(d, j.origType + "." + c.livekey, j.origHandler, j.data); f.inArray(d, a) < 0 && a.push(d) } }); if (!a.length) return false; return f(a).bind("dragend." + c.livekey, function () { i.remove(this, "." + c.livekey) }) }, hijack: function (b, a, d, e, k) { if (d) { var j = { event: b.originalEvent, type: b.type }, n = a.indexOf("drop") ? "drag" : "drop", l, o = e || 0, g, m; e = !isNaN(e) ? e : d.interactions.length; b.type = a; b.originalEvent = null; d.results = []; do if (g = d.interactions[o]) if (!(a !== "dragend" && g.cancelled)) { m = c.properties(b, d, g); g.results = []; f(k || g[n] || d.droppable).each(function (q, p) { l = (m.target = p) ? i.handle.call(p, b, m) : null; if (l === false) { if (n == "drag") { g.cancelled = true; d.propagates -= 1 } if (a == "drop") g[n][q] = null } else if (a == "dropinit") g.droppable.push(c.element(l) || p); if (a == "dragstart") g.proxy = f(c.element(l) || g.drag)[0]; g.results.push(l); delete b.result; if (a !== "dropinit") return l }); d.results[o] = c.flatten(g.results); if (a == "dropinit") g.droppable = c.flatten(g.droppable); a == "dragstart" && !g.cancelled && m.update() } while (++o < e); b.type = j.type; b.originalEvent = j.event; return c.flatten(d.results) } }, properties: function (b, a, d) { var e = d.callback; e.drag = d.drag; e.proxy = d.proxy || d.drag; e.startX = a.pageX; e.startY = a.pageY; e.deltaX = b.pageX - a.pageX; e.deltaY = b.pageY - a.pageY; e.originalX = d.offset.left; e.originalY = d.offset.top; e.offsetX = b.pageX - (a.pageX - e.originalX); e.offsetY = b.pageY - (a.pageY - e.originalY); e.drop = c.flatten((d.drop || []).slice()); e.available = c.flatten((d.droppable || []).slice()); return e }, element: function (b) { if (b && (b.jquery || b.nodeType == 1)) return b }, flatten: function (b) { return f.map(b, function (a) { return a && a.jquery ? f.makeArray(a) : a && a.length ? c.flatten(a) : a }) }, textselect: function (b) { f(document)[b ? "unbind" : "bind"]("selectstart", c.dontstart).attr("unselectable", b ? "off" : "on").css("MozUserSelect", b ? "" : "none") }, dontstart: function () { return false }, callback: function () { } }; c.callback.prototype = { update: function () { h.drop && this.available.length && f.each(this.available, function (b) { h.drop.locate(this, b) }) } }; h.draginit = h.dragstart = h.dragend = c })(jQuery);


/**
* @license
* (c) 2009-2012 Michael Leibman
* michael{dot}leibman{at}gmail{dot}com
* http://github.com/mleibman/slickgrid
*
* Distributed under MIT license.
* All rights reserved.
*
* SlickGrid v2.0
*
* NOTES:
*     Cell/row DOM manipulations are done directly bypassing jQuery's DOM manipulation methods.
*     This increases the speed dramatically, but can only be done safely because there are no event handlers
*     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
*     and do proper cleanup.
*/

// make sure required JavaScript modules are loaded
if (typeof jQuery === "undefined") {
    throw "SlickGrid requires jquery module to be loaded";
}
if (!jQuery.fn.drag) {
    throw "SlickGrid requires jquery.event.drag module to be loaded";
}
if (typeof Slick === "undefined") {
    throw "slick.core.js not loaded";
}


(function ($) {
    // Slick.Grid
    $.extend(true, window, {
        Slick: {
            Grid: SlickGrid
        }
    });

    // shared across all grids on the page
    var scrollbarDimensions;
    var maxSupportedCssHeight;  // browser's breaking point

    //////////////////////////////////////////////////////////////////////////////////////////////
    // SlickGrid class implementation (available as Slick.Grid)

    /**
    * Creates a new instance of the grid.
    * @class SlickGrid
    * @constructor
    * @param {Node}              container   Container node to create the grid in.
    * @param {Array,Object}      data        An array of objects for databinding.
    * @param {Array}             columns     An array of column definitions.
    * @param {Object}            options     Grid options.
    **/
    function SlickGrid(container, data, columns, options) {
        // settings
        var defaults = {
            explicitInitialization: false,
            rowHeight: 25,
            defaultColumnWidth: 80,
            enableAddRow: false,
            leaveSpaceForNewRows: false,
            editable: false,
            autoEdit: true,
            enableCellNavigation: true,
            enableColumnReorder: true,
            asyncEditorLoading: false,
            asyncEditorLoadDelay: 100,
            forceFitColumns: false,
            enableAsyncPostRender: false,
            asyncPostRenderDelay: 60,
            autoHeight: false,
            editorLock: Slick.GlobalEditorLock,
            showHeaderRow: false,
            headerRowHeight: 25,
            showTopPanel: false,
            topPanelHeight: 25,
            formatterFactory: null,
            editorFactory: null,
            cellFlashingCssClass: "flashing",
            selectedCellCssClass: "selected",
            multiSelect: true,
            enableTextSelectionOnCells: false,
            dataItemColumnValueExtractor: null,
            fullWidthRows: false,
            multiColumnSort: false,
            defaultFormatter: defaultFormatter
        };

        var columnDefaults = {
            name: "",
            resizable: true,
            sortable: false,
            minWidth: 30,
            rerenderOnResize: false,
            headerCssClass: null
        };

        // scroller
        var th;   // virtual height
        var h;    // real scrollable height
        var ph;   // page height
        var n;    // number of pages
        var cj;   // "jumpiness" coefficient

        var page = 0;       // current page
        var offset = 0;     // current page offset
        var scrollDir = 1;

        // private
        var initialized = false;
        var $container;
        var uid = "slickgrid_" + Math.round(1000000 * Math.random());
        var self = this;
        var $focusSink;
        var $headerScroller;
        var $headers;
        var $headerRow, $headerRowScroller;
        var $topPanelScroller;
        var $topPanel;
        var $viewport;
        var $canvas;
        var $style;
        var stylesheet, columnCssRulesL, columnCssRulesR;
        var viewportH, viewportW;
        var canvasWidth;
        var viewportHasHScroll, viewportHasVScroll;
        var headerColumnWidthDiff = 0, headerColumnHeightDiff = 0, // border+padding
        cellWidthDiff = 0, cellHeightDiff = 0;
        var absoluteColumnMinWidth;
        var numberOfRows = 0;

        var activePosX;
        var activeRow, activeCell;
        var activeCellNode = null;
        var currentEditor = null;
        var serializedEditorValue;
        var editController;

        var rowsCache = {};
        var renderedRows = 0;
        var numVisibleRows;
        var prevScrollTop = 0;
        var scrollTop = 0;
        var lastRenderedScrollTop = 0;
        var prevScrollLeft = 0;

        var selectionModel;
        var selectedRows = [];

        var plugins = [];
        var cellCssClasses = {};

        var columnsById = {};
        var sortColumns = [];


        // async call handles
        var h_editorLoader = null;
        var h_render = null;
        var h_postrender = null;
        var postProcessedRows = {};
        var postProcessToRow = null;
        var postProcessFromRow = null;

        // perf counters
        var counter_rows_rendered = 0;
        var counter_rows_removed = 0;


        //////////////////////////////////////////////////////////////////////////////////////////////
        // Initialization

        function init() {
            $container = $(container);
            if ($container.length < 1) {
                throw new Error("SlickGrid requires a valid container, " + container + " does not exist in the DOM.");
            }

            // calculate these only once and share between grid instances
            maxSupportedCssHeight = maxSupportedCssHeight || getMaxSupportedCssHeight();
            scrollbarDimensions = scrollbarDimensions || measureScrollbar();

            options = $.extend({}, defaults, options);
            columnDefaults.width = options.defaultColumnWidth;

            // validate loaded JavaScript modules against requested options
            if (options.enableColumnReorder && !$.fn.sortable) {
                throw new Error("SlickGrid's 'enableColumnReorder = true' option requires jquery-ui.sortable module to be loaded");
            }

            editController = {
                "commitCurrentEdit": commitCurrentEdit,
                "cancelCurrentEdit": cancelCurrentEdit
            };

            $container
          .empty()
          .css("overflow", "hidden")
          .css("outline", 0)
          .addClass(uid)
          .addClass("ui-widget");

            // set up a positioning container if needed
            if (!/relative|absolute|fixed/.test($container.css("position"))) {
                $container.css("position", "relative");
            }

            $focusSink = $("<div tabIndex='0' hideFocus style='position:fixed;width:0;height:0;top:0;left:0;outline:0;'></div>").appendTo($container);

            $headerScroller = $("<div class='slick-header ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
            $headers = $("<div class='slick-header-columns' style='width:10000px; left:-1000px' />").appendTo($headerScroller);

            $headerRowScroller = $("<div class='slick-headerrow ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
            $headerRow = $("<div class='slick-headerrow-columns' />").appendTo($headerRowScroller);

            $topPanelScroller = $("<div class='slick-top-panel-scroller ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
            $topPanel = $("<div class='slick-top-panel' style='width:10000px' />").appendTo($topPanelScroller);

            if (!options.showTopPanel) {
                $topPanelScroller.hide();
            }

            if (!options.showHeaderRow) {
                $headerRowScroller.hide();
            }

            $viewport = $("<div class='slick-viewport' style='width:100%;overflow:auto;outline:0;position:relative;;'>").appendTo($container);
            $viewport.css("overflow-y", options.autoHeight ? "hidden" : "auto");

            $canvas = $("<div class='grid-canvas' />").appendTo($viewport);

            if (!options.explicitInitialization) {
                finishInitialization();
            }
        }

        function finishInitialization() {
            if (!initialized) {
                initialized = true;

                viewportW = parseFloat($.css($container[0], "width", true));

                // header columns and cells may have different padding/border skewing width calculations (box-sizing, hello?)
                // calculate the diff so we can set consistent sizes
                measureCellPaddingAndBorder();

                // for usability reasons, all text selection in SlickGrid is disabled
                // with the exception of input and textarea elements (selection must
                // be enabled there so that editors work as expected); note that
                // selection in grid cells (grid body) is already unavailable in
                // all browsers except IE
                disableSelection($headers); // disable all text selection in header (including input and textarea)

                if (!options.enableTextSelectionOnCells) {
                    // disable text selection in grid cells except in input and textarea elements
                    // (this is IE-specific, because selectstart event will only fire in IE)
                    $viewport.bind("selectstart.ui", function (event) {
                        return $(event.target).is("input,textarea");
                    });
                }

                createColumnHeaders();
                setupColumnSort();
                createCssRules();
                resizeCanvas();
                bindAncestorScrollEvents();

                $container
            .bind("resize.slickgrid", resizeCanvas);
                $viewport
            .bind("scroll.slickgrid", handleScroll);
                $headerScroller
            .bind("contextmenu.slickgrid", handleHeaderContextMenu)
            .bind("click.slickgrid", handleHeaderClick)
            .delegate(".slick-header-column", "mouseenter", handleHeaderMouseEnter)
            .delegate(".slick-header-column", "mouseleave", handleHeaderMouseLeave);
                $focusSink
            .bind("keydown.slickgrid", handleKeyDown);
                $canvas
            .bind("keydown.slickgrid", handleKeyDown)
            .bind("click.slickgrid", handleClick)
            .bind("dblclick.slickgrid", handleDblClick)
            .bind("contextmenu.slickgrid", handleContextMenu)
            .bind("draginit", handleDragInit)
            .bind("dragstart", handleDragStart)
            .bind("drag", handleDrag)
            .bind("dragend", handleDragEnd)
            .delegate(".slick-cell", "mouseenter", handleMouseEnter)
            .delegate(".slick-cell", "mouseleave", handleMouseLeave);
            }
        }

        function registerPlugin(plugin) {
            plugins.unshift(plugin);
            plugin.init(self);
        }

        function unregisterPlugin(plugin) {
            for (var i = plugins.length; i >= 0; i--) {
                if (plugins[i] === plugin) {
                    if (plugins[i].destroy) {
                        plugins[i].destroy();
                    }
                    plugins.splice(i, 1);
                    break;
                }
            }
        }

        function setSelectionModel(model) {
            if (selectionModel) {
                selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged);
                if (selectionModel.destroy) {
                    selectionModel.destroy();
                }
            }

            selectionModel = model;
            if (selectionModel) {
                selectionModel.init(self);
                selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged);
            }
        }

        function getSelectionModel() {
            return selectionModel;
        }

        function getCanvasNode() {
            return $canvas[0];
        }

        function measureScrollbar() {
            var $c = $("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body");
            var dim = {
                width: $c.width() - $c[0].clientWidth,
                height: $c.height() - $c[0].clientHeight
            };
            $c.remove();
            return dim;
        }

        function getCanvasWidth() {
            var availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
            var rowWidth = 0;
            var i = columns.length;
            while (i--) {
                rowWidth += (columns[i].width || columnDefaults.width);
            }
            return options.fullWidthRows ? Math.max(rowWidth, availableWidth) : rowWidth;
        }

        function updateCanvasWidth(forceColumnWidthsUpdate) {
            var oldCanvasWidth = canvasWidth;
            canvasWidth = getCanvasWidth();

            if (canvasWidth != oldCanvasWidth) {
                $canvas.width(canvasWidth);
                $headerRow.width(canvasWidth);
                viewportHasHScroll = (canvasWidth > viewportW - scrollbarDimensions.width);
            }

            if (canvasWidth != oldCanvasWidth || forceColumnWidthsUpdate) {
                applyColumnWidths();
            }
        }

        function disableSelection($target) {
            if ($target && $target.jquery) {
                $target
            .attr("unselectable", "on")
            .css("MozUserSelect", "none")
            .bind("selectstart.ui", function () {
                return false;
            }); // from jquery:ui.core.js 1.7.2
            }
        }

        function getMaxSupportedCssHeight() {
            var supportedHeight = 1000000;
            // FF reports the height back but still renders blank after ~6M px
            var testUpTo = ($.browser.mozilla) ? 6000000 : 1000000000;
            var div = $("<div style='display:none' />").appendTo(document.body);

            while (true) {
                var test = supportedHeight * 2;
                div.css("height", test);
                if (test > testUpTo || div.height() !== test) {
                    break;
                } else {
                    supportedHeight = test;
                }
            }

            div.remove();
            return supportedHeight;
        }

        // TODO:  this is static.  need to handle page mutation.
        function bindAncestorScrollEvents() {
            var elem = $canvas[0];
            while ((elem = elem.parentNode) != document.body && elem != null) {
                // bind to scroll containers only
                if (elem == $viewport[0] || elem.scrollWidth != elem.clientWidth || elem.scrollHeight != elem.clientHeight) {
                    $(elem).bind("scroll.slickgrid", handleActiveCellPositionChange);
                }
            }
        }

        function unbindAncestorScrollEvents() {
            $canvas.parents().unbind("scroll.slickgrid");
        }

        function updateColumnHeader(columnId, title, toolTip) {
            if (!initialized) { return; }
            var idx = getColumnIndex(columnId);
            var columnDef = columns[idx];
            var $header = $headers.children().eq(idx);
            if ($header) {
                if (title !== undefined) {
                    columns[idx].name = title;
                }
                if (toolTip !== undefined) {
                    columns[idx].toolTip = toolTip;
                }

                trigger(self.onBeforeHeaderDestroy, {
                    "headerNode": $header[0],
                    "column": columnDef
                });

                $header
            .attr("title", toolTip || "")
            .children().eq(0).html(title);

                trigger(self.onHeaderRendered, {
                    "headerNode": $header[0],
                    "column": columnDef
                });
            }
        }

        function getHeaderRow() {
            return $headerRow[0];
        }

        function getHeaderRowColumn(columnId) {
            var idx = getColumnIndex(columnId);
            var $header = $headerRow.children().eq(idx);
            return $header && $header[0];
        }

        function createColumnHeaders() {
            function hoverBegin() {
                $(this).addClass("ui-state-hover");
            }

            function hoverEnd() {
                $(this).removeClass("ui-state-hover");
            }

            $headers.find(".slick-header-column")
        .each(function () {
            var columnDef = $(this).data("column");
            if (columnDef) {
                trigger(self.onBeforeHeaderDestroy, {
                    "headerNode": this,
                    "column": columnDef
                });
            }
        });

            $headers.empty();
            $headerRow.empty();
            columnsById = {};

            for (var i = 0; i < columns.length; i++) {
                var m = columns[i] = $.extend({}, columnDefaults, columns[i]);
                columnsById[m.id] = i;

                var header = $("<div class='ui-state-default slick-header-column' id='" + uid + m.id + "' />")
            .html("<span class='slick-column-name'>" + m.name + "</span>")
            .width(m.width - headerColumnWidthDiff)
            .attr("title", m.toolTip || "")
            .data("column", m)
            .addClass(m.headerCssClass || "")
            .appendTo($headers);

                if (options.enableColumnReorder || m.sortable) {
                    header.hover(hoverBegin, hoverEnd);
                }

                if (m.sortable) {
                    header.append("<span class='slick-sort-indicator' />");
                }

                trigger(self.onHeaderRendered, {
                    "headerNode": header[0],
                    "column": m
                });

                if (options.showHeaderRow) {
                    $("<div class='ui-state-default slick-headerrow-column l" + i + " r" + i + "'></div>")
              .appendTo($headerRow);
                }
            }

            if (options.showHeaderRow) {
                // add a spacer to let the container scroll beyond the header row columns width
                $("<div style='display:block;height:1px;width:10000px;position:absolute;top:0;left:0;'></div>")
            .appendTo($headerRowScroller);
            }

            setSortColumns(sortColumns);
            setupColumnResize();
            if (options.enableColumnReorder) {
                setupColumnReorder();
            }
        }

        function setupColumnSort() {
            $headers.click(function (e) {
                // temporary workaround for a bug in jQuery 1.7.1 (http://bugs.jquery.com/ticket/11328)
                e.metaKey = e.metaKey || e.ctrlKey;

                if ($(e.target).hasClass("slick-resizable-handle")) {
                    return;
                }

                var $col = $(e.target).closest(".slick-header-column");
                if (!$col.length) {
                    return;
                }

                var column = $col.data("column");
                if (column.sortable) {
                    if (!getEditorLock().commitCurrentEdit()) {
                        return;
                    }

                    var sortOpts = null;
                    var i = 0;
                    for (; i < sortColumns.length; i++) {
                        if (sortColumns[i].columnId == column.id) {
                            sortOpts = sortColumns[i];
                            sortOpts.sortAsc = !sortOpts.sortAsc;
                            break;
                        }
                    }

                    if (e.metaKey && options.multiColumnSort) {
                        if (sortOpts) {
                            sortColumns.splice(i, 1);
                        }
                    }
                    else {
                        if ((!e.shiftKey && !e.metaKey) || !options.multiColumnSort) {
                            sortColumns = [];
                        }

                        if (!sortOpts) {
                            sortOpts = { columnId: column.id, sortAsc: true };
                            sortColumns.push(sortOpts);
                        } else if (sortColumns.length == 0) {
                            sortColumns.push(sortOpts);
                        }
                    }

                    setSortColumns(sortColumns);

                    if (!options.multiColumnSort) {
                        trigger(self.onSort, {
                            multiColumnSort: false,
                            sortCol: column,
                            sortAsc: sortOpts.sortAsc
                        }, e);
                    } else {
                        trigger(self.onSort, {
                            multiColumnSort: true,
                            sortCols: $.map(sortColumns, function (col) {
                                return { sortCol: columns[getColumnIndex(col.columnId)], sortAsc: col.sortAsc };
                            })
                        }, e);
                    }
                }
            });
        }

        function setupColumnReorder() {
            $headers.sortable({
                containment: "parent",
                axis: "x",
                cursor: "default",
                tolerance: "intersection",
                helper: "clone",
                placeholder: "slick-sortable-placeholder ui-state-default slick-header-column",
                forcePlaceholderSize: true,
                start: function (e, ui) {
                    $(ui.helper).addClass("slick-header-column-active");
                },
                beforeStop: function (e, ui) {
                    $(ui.helper).removeClass("slick-header-column-active");
                },
                stop: function (e) {
                    if (!getEditorLock().commitCurrentEdit()) {
                        $(this).sortable("cancel");
                        return;
                    }

                    var reorderedIds = $headers.sortable("toArray");
                    var reorderedColumns = [];
                    for (var i = 0; i < reorderedIds.length; i++) {
                        reorderedColumns.push(columns[getColumnIndex(reorderedIds[i].replace(uid, ""))]);
                    }
                    setColumns(reorderedColumns);

                    trigger(self.onColumnsReordered, {});
                    e.stopPropagation();
                    setupColumnResize();
                }
            });
        }

        function setupColumnResize() {
            var $col, j, c, pageX, columnElements, minPageX, maxPageX, firstResizable, lastResizable;
            columnElements = $headers.children();
            columnElements.find(".slick-resizable-handle").remove();
            columnElements.each(function (i, e) {
                if (columns[i].resizable) {
                    if (firstResizable === undefined) {
                        firstResizable = i;
                    }
                    lastResizable = i;
                }
            });
            if (firstResizable === undefined) {
                return;
            }
            columnElements.each(function (i, e) {
                if (i < firstResizable || (options.forceFitColumns && i >= lastResizable)) {
                    return;
                }
                $col = $(e);
                $("<div class='slick-resizable-handle' />")
            .appendTo(e)
            .bind("dragstart", function (e, dd) {
                if (!getEditorLock().commitCurrentEdit()) {
                    return false;
                }
                pageX = e.pageX;
                $(this).parent().addClass("slick-header-column-active");
                var shrinkLeewayOnRight = null, stretchLeewayOnRight = null;
                // lock each column's width option to current width
                columnElements.each(function (i, e) {
                    columns[i].previousWidth = $(e).outerWidth();
                });
                if (options.forceFitColumns) {
                    shrinkLeewayOnRight = 0;
                    stretchLeewayOnRight = 0;
                    // colums on right affect maxPageX/minPageX
                    for (j = i + 1; j < columnElements.length; j++) {
                        c = columns[j];
                        if (c.resizable) {
                            if (stretchLeewayOnRight !== null) {
                                if (c.maxWidth) {
                                    stretchLeewayOnRight += c.maxWidth - c.previousWidth;
                                } else {
                                    stretchLeewayOnRight = null;
                                }
                            }
                            shrinkLeewayOnRight += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth);
                        }
                    }
                }
                var shrinkLeewayOnLeft = 0, stretchLeewayOnLeft = 0;
                for (j = 0; j <= i; j++) {
                    // columns on left only affect minPageX
                    c = columns[j];
                    if (c.resizable) {
                        if (stretchLeewayOnLeft !== null) {
                            if (c.maxWidth) {
                                stretchLeewayOnLeft += c.maxWidth - c.previousWidth;
                            } else {
                                stretchLeewayOnLeft = null;
                            }
                        }
                        shrinkLeewayOnLeft += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth);
                    }
                }
                if (shrinkLeewayOnRight === null) {
                    shrinkLeewayOnRight = 100000;
                }
                if (shrinkLeewayOnLeft === null) {
                    shrinkLeewayOnLeft = 100000;
                }
                if (stretchLeewayOnRight === null) {
                    stretchLeewayOnRight = 100000;
                }
                if (stretchLeewayOnLeft === null) {
                    stretchLeewayOnLeft = 100000;
                }
                maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft);
                minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
            })
            .bind("drag", function (e, dd) {
                var actualMinWidth, d = Math.min(maxPageX, Math.max(minPageX, e.pageX)) - pageX, x;
                if (d < 0) { // shrink column
                    x = d;
                    for (j = i; j >= 0; j--) {
                        c = columns[j];
                        if (c.resizable) {
                            actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth);
                            if (x && c.previousWidth + x < actualMinWidth) {
                                x += c.previousWidth - actualMinWidth;
                                c.width = actualMinWidth;
                            } else {
                                c.width = c.previousWidth + x;
                                x = 0;
                            }
                        }
                    }

                    if (options.forceFitColumns) {
                        x = -d;
                        for (j = i + 1; j < columnElements.length; j++) {
                            c = columns[j];
                            if (c.resizable) {
                                if (x && c.maxWidth && (c.maxWidth - c.previousWidth < x)) {
                                    x -= c.maxWidth - c.previousWidth;
                                    c.width = c.maxWidth;
                                } else {
                                    c.width = c.previousWidth + x;
                                    x = 0;
                                }
                            }
                        }
                    }
                } else { // stretch column
                    x = d;
                    for (j = i; j >= 0; j--) {
                        c = columns[j];
                        if (c.resizable) {
                            if (x && c.maxWidth && (c.maxWidth - c.previousWidth < x)) {
                                x -= c.maxWidth - c.previousWidth;
                                c.width = c.maxWidth;
                            } else {
                                c.width = c.previousWidth + x;
                                x = 0;
                            }
                        }
                    }

                    if (options.forceFitColumns) {
                        x = -d;
                        for (j = i + 1; j < columnElements.length; j++) {
                            c = columns[j];
                            if (c.resizable) {
                                actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth);
                                if (x && c.previousWidth + x < actualMinWidth) {
                                    x += c.previousWidth - actualMinWidth;
                                    c.width = actualMinWidth;
                                } else {
                                    c.width = c.previousWidth + x;
                                    x = 0;
                                }
                            }
                        }
                    }
                }
                applyColumnHeaderWidths();
                if (options.syncColumnCellResize) {
                    applyColumnWidths();
                }
            })
            .bind("dragend", function (e, dd) {
                var newWidth;
                $(this).parent().removeClass("slick-header-column-active");
                for (j = 0; j < columnElements.length; j++) {
                    c = columns[j];
                    newWidth = $(columnElements[j]).outerWidth();

                    if (c.previousWidth !== newWidth && c.rerenderOnResize) {
                        invalidateAllRows();
                    }
                }
                updateCanvasWidth(true);
                render();
                trigger(self.onColumnsResized, {});
            });
            });
        }

        function getVBoxDelta($el) {
            var p = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];
            var delta = 0;
            $.each(p, function (n, val) {
                delta += parseFloat($el.css(val)) || 0;
            });
            return delta;
        }

        function measureCellPaddingAndBorder() {
            var el;
            var h = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"];
            var v = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];

            el = $("<div class='ui-state-default slick-header-column' style='visibility:hidden'>-</div>").appendTo($headers);
            headerColumnWidthDiff = headerColumnHeightDiff = 0;
            $.each(h, function (n, val) {
                headerColumnWidthDiff += parseFloat(el.css(val)) || 0;
            });
            $.each(v, function (n, val) {
                headerColumnHeightDiff += parseFloat(el.css(val)) || 0;
            });
            el.remove();

            var r = $("<div class='slick-row' />").appendTo($canvas);
            el = $("<div class='slick-cell' id='' style='visibility:hidden'>-</div>").appendTo(r);
            cellWidthDiff = cellHeightDiff = 0;
            $.each(h, function (n, val) {
                cellWidthDiff += parseFloat(el.css(val)) || 0;
            });
            $.each(v, function (n, val) {
                cellHeightDiff += parseFloat(el.css(val)) || 0;
            });
            r.remove();

            absoluteColumnMinWidth = Math.max(headerColumnWidthDiff, cellWidthDiff);
        }

        function createCssRules() {
            $style = $("<style type='text/css' rel='stylesheet' />").appendTo($("head"));
            var rowHeight = (options.rowHeight - cellHeightDiff);
            var rules = [
        "." + uid + " .slick-header-column { left: 1000px; }",
        "." + uid + " .slick-top-panel { height:" + options.topPanelHeight + "px; }",
        "." + uid + " .slick-headerrow-columns { height:" + options.headerRowHeight + "px; }",
        "." + uid + " .slick-cell { height:" + rowHeight + "px; }",
        "." + uid + " .slick-row { height:" + options.rowHeight + "px; }"
      ];

            for (var i = 0; i < columns.length; i++) {
                rules.push("." + uid + " .l" + i + " { }");
                rules.push("." + uid + " .r" + i + " { }");
            }

            if ($style[0].styleSheet) { // IE
                $style[0].styleSheet.cssText = rules.join(" ");
            } else {
                $style[0].appendChild(document.createTextNode(rules.join(" ")));
            }
        }

        function getColumnCssRules(idx) {
            if (!stylesheet) {
                var sheets = document.styleSheets;
                for (var i = 0; i < sheets.length; i++) {
                    if ((sheets[i].ownerNode || sheets[i].owningElement) == $style[0]) {
                        stylesheet = sheets[i];
                        break;
                    }
                }

                if (!stylesheet) {
                    throw new Error("Cannot find stylesheet.");
                }

                // find and cache column CSS rules
                columnCssRulesL = [];
                columnCssRulesR = [];
                var cssRules = (stylesheet.cssRules || stylesheet.rules);
                var matches, columnIdx;
                for (var i = 0; i < cssRules.length; i++) {
                    var selector = cssRules[i].selectorText;
                    if (matches = /\.l\d+/.exec(selector)) {
                        columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
                        columnCssRulesL[columnIdx] = cssRules[i];
                    } else if (matches = /\.r\d+/.exec(selector)) {
                        columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
                        columnCssRulesR[columnIdx] = cssRules[i];
                    }
                }
            }

            return {
                "left": columnCssRulesL[idx],
                "right": columnCssRulesR[idx]
            };
        }

        function removeCssRules() {
            $style.remove();
            stylesheet = null;
        }

        function destroy() {
            getEditorLock().cancelCurrentEdit();

            trigger(self.onBeforeDestroy, {});

            var i = plugins.length;
            while (i--) {
                unregisterPlugin(plugins[i]);
            }

            if (options.enableColumnReorder && $headers.sortable) {
                $headers.sortable("destroy");
            }

            unbindAncestorScrollEvents();
            $container.unbind(".slickgrid");
            removeCssRules();

            $canvas.unbind("draginit dragstart dragend drag");
            $container.empty().removeClass(uid);
        }


        //////////////////////////////////////////////////////////////////////////////////////////////
        // General

        function trigger(evt, args, e) {
            e = e || new Slick.EventData();
            args = args || {};
            args.grid = self;
            return evt.notify(args, e, self);
        }

        function getEditorLock() {
            return options.editorLock;
        }

        function getEditController() {
            return editController;
        }

        function getColumnIndex(id) {
            return columnsById[id];
        }

        function autosizeColumns() {
            var i, c,
          widths = [],
          shrinkLeeway = 0,
          total = 0,
          prevTotal,
          availWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;

            for (i = 0; i < columns.length; i++) {
                c = columns[i];
                widths.push(c.width);
                total += c.width;
                if (c.resizable) {
                    shrinkLeeway += c.width - Math.max(c.minWidth, absoluteColumnMinWidth);
                }
            }

            // shrink
            prevTotal = total;
            while (total > availWidth && shrinkLeeway) {
                var shrinkProportion = (total - availWidth) / shrinkLeeway;
                for (i = 0; i < columns.length && total > availWidth; i++) {
                    c = columns[i];
                    var width = widths[i];
                    if (!c.resizable || width <= c.minWidth || width <= absoluteColumnMinWidth) {
                        continue;
                    }
                    var absMinWidth = Math.max(c.minWidth, absoluteColumnMinWidth);
                    var shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
                    shrinkSize = Math.min(shrinkSize, width - absMinWidth);
                    total -= shrinkSize;
                    shrinkLeeway -= shrinkSize;
                    widths[i] -= shrinkSize;
                }
                if (prevTotal == total) {  // avoid infinite loop
                    break;
                }
                prevTotal = total;
            }

            // grow
            prevTotal = total;
            while (total < availWidth) {
                var growProportion = availWidth / total;
                for (i = 0; i < columns.length && total < availWidth; i++) {
                    c = columns[i];
                    if (!c.resizable || c.maxWidth <= c.width) {
                        continue;
                    }
                    var growSize = Math.min(Math.floor(growProportion * c.width) - c.width, (c.maxWidth - c.width) || 1000000) || 1;
                    total += growSize;
                    widths[i] += growSize;
                }
                if (prevTotal == total) {  // avoid infinite loop
                    break;
                }
                prevTotal = total;
            }

            var reRender = false;
            for (i = 0; i < columns.length; i++) {
                if (columns[i].rerenderOnResize && columns[i].width != widths[i]) {
                    reRender = true;
                }
                columns[i].width = widths[i];
            }

            applyColumnHeaderWidths();
            updateCanvasWidth(true);
            if (reRender) {
                invalidateAllRows();
                render();
            }
        }

        function applyColumnHeaderWidths() {
            if (!initialized) { return; }
            var h;
            for (var i = 0, headers = $headers.children(), ii = headers.length; i < ii; i++) {
                h = $(headers[i]);
                if (h.width() !== columns[i].width - headerColumnWidthDiff) {
                    h.width(columns[i].width - headerColumnWidthDiff);
                }
            }
        }

        function applyColumnWidths() {
            var x = 0, w, rule;
            for (var i = 0; i < columns.length; i++) {
                w = columns[i].width;

                rule = getColumnCssRules(i);
                rule.left.style.left = x + "px";
                rule.right.style.right = (canvasWidth - x - w) + "px";

                x += columns[i].width;
            }
        }

        function setSortColumn(columnId, ascending) {
            setSortColumns([{ columnId: columnId, sortAsc: ascending}]);
        }

        function setSortColumns(cols) {
            sortColumns = cols;

            var headerColumnEls = $headers.children();
            headerColumnEls
          .removeClass("slick-header-column-sorted")
          .find(".slick-sort-indicator")
              .removeClass("slick-sort-indicator-asc slick-sort-indicator-desc");

            $.each(sortColumns, function (i, col) {
                if (col.sortAsc == null) {
                    col.sortAsc = true;
                }
                var columnIndex = getColumnIndex(col.columnId);
                if (columnIndex != null) {
                    headerColumnEls.eq(columnIndex)
              .addClass("slick-header-column-sorted")
              .find(".slick-sort-indicator")
                  .addClass(col.sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc");
                }
            });
        }

        function getSortColumns() {
            return sortColumns;
        }

        function handleSelectedRangesChanged(e, ranges) {
            selectedRows = [];
            var hash = {};
            for (var i = 0; i < ranges.length; i++) {
                for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
                    if (!hash[j]) {  // prevent duplicates
                        selectedRows.push(j);
                    }
                    hash[j] = {};
                    for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
                        if (canCellBeSelected(j, k)) {
                            hash[j][columns[k].id] = options.selectedCellCssClass;
                        }
                    }
                }
            }

            setCellCssStyles(options.selectedCellCssClass, hash);

            trigger(self.onSelectedRowsChanged, { rows: getSelectedRows() }, e);
        }

        function getColumns() {
            return columns;
        }

        function setColumns(columnDefinitions) {
            columns = columnDefinitions;
            if (initialized) {
                invalidateAllRows();
                createColumnHeaders();
                removeCssRules();
                createCssRules();
                resizeCanvas();
                applyColumnWidths();
                handleScroll();
            }
        }

        function getOptions() {
            return options;
        }

        function setOptions(args) {
            if (!getEditorLock().commitCurrentEdit()) {
                return;
            }

            makeActiveCellNormal();

            if (options.enableAddRow !== args.enableAddRow) {
                invalidateRow(getDataLength());
            }

            options = $.extend(options, args);

            $viewport.css("overflow-y", options.autoHeight ? "hidden" : "auto");
            render();
        }

        function setData(newData, scrollToTop) {
            data = newData;
            invalidateAllRows();
            updateRowCount();
            if (scrollToTop) {
                scrollTo(0);
            }
        }

        function getData() {
            return data;
        }

        function getDataLength() {
            if (data.getLength) {
                return data.getLength();
            } else {
                return data.length;
            }
        }

        function getDataItem(i) {
            if (data.getItem) {
                return data.getItem(i);
            } else {
                return data[i];
            }
        }

        function getTopPanel() {
            return $topPanel[0];
        }

        function showTopPanel() {
            options.showTopPanel = true;
            $topPanelScroller.slideDown("fast", resizeCanvas);
        }

        function hideTopPanel() {
            options.showTopPanel = false;
            $topPanelScroller.slideUp("fast", resizeCanvas);
        }

        function showHeaderRowColumns() {
            options.showHeaderRow = true;
            $headerRowScroller.slideDown("fast", resizeCanvas);
        }

        function hideHeaderRowColumns() {
            options.showHeaderRow = false;
            $headerRowScroller.slideUp("fast", resizeCanvas);
        }

        //////////////////////////////////////////////////////////////////////////////////////////////
        // Rendering / Scrolling

        function scrollTo(y) {
            y = Math.max(y, 0);
            y = Math.min(y, th - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0));

            var oldOffset = offset;

            page = Math.min(n - 1, Math.floor(y / ph));
            offset = Math.round(page * cj);
            var newScrollTop = y - offset;

            if (offset != oldOffset) {
                var range = getVisibleRange(newScrollTop);
                cleanupRows(range.top, range.bottom);
                updateRowPositions();
            }

            if (prevScrollTop != newScrollTop) {
                scrollDir = (prevScrollTop + oldOffset < newScrollTop + offset) ? 1 : -1;
                $viewport[0].scrollTop = (lastRenderedScrollTop = scrollTop = prevScrollTop = newScrollTop);

                trigger(self.onViewportChanged, {});
            }
        }

        function defaultFormatter(row, cell, value, columnDef, dataContext) {
            if (value == null) {
                return "";
            } else {
                return value.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
        }

        function getFormatter(row, column) {
            var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);

            // look up by id, then index
            var columnOverrides = rowMetadata &&
          rowMetadata.columns &&
          (rowMetadata.columns[column.id] || rowMetadata.columns[getColumnIndex(column.id)]);

            return (columnOverrides && columnOverrides.formatter) ||
          (rowMetadata && rowMetadata.formatter) ||
          column.formatter ||
          (options.formatterFactory && options.formatterFactory.getFormatter(column)) ||
          options.defaultFormatter;
        }

        function getEditor(row, cell) {
            var column = columns[cell];
            var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
            var columnMetadata = rowMetadata && rowMetadata.columns;

            if (columnMetadata && columnMetadata[column.id] && columnMetadata[column.id].editor !== undefined) {
                return columnMetadata[column.id].editor;
            }
            if (columnMetadata && columnMetadata[cell] && columnMetadata[cell].editor !== undefined) {
                return columnMetadata[cell].editor;
            }

            return column.editor || (options.editorFactory && options.editorFactory.getEditor(column));
        }

        function getDataItemValueForColumn(item, columnDef) {
            if (options.dataItemColumnValueExtractor) {
                return options.dataItemColumnValueExtractor(item, columnDef);
            }
            return item[columnDef.field];
        }

        function appendRowHtml(stringArray, row) {
            var d = getDataItem(row);
            var dataLoading = row < getDataLength() && !d;
            var cellCss;
            var rowCss = "slick-row" +
          (dataLoading ? " loading" : "") +
          (row % 2 == 1 ? " odd" : " even");

            var metadata = data.getItemMetadata && data.getItemMetadata(row);

            if (metadata && metadata.cssClasses) {
                //MOD GROUP CSS NS9429 +  --Had to override the odd and even classes to allow zebra striping with groups
                if (metadata.cssClasses == 'slick-group') {
                    rowCss = "slick-row slick-group";
                }
                else {
                    rowCss += " " + metadata.cssClasses;
                }

                //rowCss += " " + metadata.cssClasses;  

                //MOD GROUP CSS NS9429 -
            }

            stringArray.push("<div class='ui-widget-content " + rowCss + "' style='top:" + (options.rowHeight * row - offset) + "px'>");

            var colspan, m;
            for (var i = 0, cols = columns.length; i < cols; i++) {
                m = columns[i];
                colspan = getColspan(row, i);
                cellCss = "slick-cell l" + i + " r" + Math.min(columns.length - 1, i + colspan - 1) + (m.cssClass ? " " + m.cssClass : "");
                if (row === activeRow && i === activeCell) {
                    cellCss += (" active");
                }

                // TODO:  merge them together in the setter
                for (var key in cellCssClasses) {
                    if (cellCssClasses[key][row] && cellCssClasses[key][row][m.id]) {
                        cellCss += (" " + cellCssClasses[key][row][m.id]);
                    }
                }

                stringArray.push("<div class='" + cellCss + "'>");

                // if there is a corresponding row (if not, this is the Add New row or this data hasn't been loaded yet)
                if (d) {
                    var value = getDataItemValueForColumn(d, m);
                    stringArray.push(getFormatter(row, m)(row, i, value, m, d));
                }

                stringArray.push("</div>");

                if (colspan) {
                    i += (colspan - 1);
                }
            }

            stringArray.push("</div>");
        }

        function cleanupRows(rangeToKeep) {
            for (var i in rowsCache) {
                if (((i = parseInt(i, 10)) !== activeRow) && (i < rangeToKeep.top || i > rangeToKeep.bottom)) {
                    removeRowFromCache(i);
                }
            }
        }

        function invalidate() {
            updateRowCount();
            invalidateAllRows();
            render();
        }

        function invalidateAllRows() {
            if (currentEditor) {
                makeActiveCellNormal();
            }
            for (var row in rowsCache) {
                removeRowFromCache(row);
            }
        }

        function removeRowFromCache(row) {
            var cacheEntry = rowsCache[row];
            if (!cacheEntry) {
                return;
            }
            $canvas[0].removeChild(cacheEntry.rowNode);
            delete rowsCache[row];
            delete postProcessedRows[row];
            renderedRows--;
            counter_rows_removed++;
        }

        function invalidateRows(rows) {
            var i, rl;
            if (!rows || !rows.length) {
                return;
            }
            scrollDir = 0;
            for (i = 0, rl = rows.length; i < rl; i++) {
                if (currentEditor && activeRow === rows[i]) {
                    makeActiveCellNormal();
                }
                if (rowsCache[rows[i]]) {
                    removeRowFromCache(rows[i]);
                }
            }
        }

        function invalidateRow(row) {
            invalidateRows([row]);
        }

        function updateCell(row, cell) {
            var cellNode = getCellNode(row, cell);
            if (!cellNode) {
                return;
            }

            var m = columns[cell], d = getDataItem(row);
            if (currentEditor && activeRow === row && activeCell === cell) {
                currentEditor.loadValue(d);
            } else {
                cellNode.innerHTML = d ? getFormatter(row, m)(row, cell, getDataItemValueForColumn(d, m), m, d) : "";
                invalidatePostProcessingResults(row);
            }
        }

        function updateRow(row) {
            var cacheEntry = rowsCache[row];
            if (!cacheEntry) {
                return;
            }

            ensureCellNodesInRowsCache(row);

            for (var columnIdx in cacheEntry.cellNodesByColumnIdx) {
                columnIdx = columnIdx | 0;
                var m = columns[columnIdx],
            d = getDataItem(row),
            node = cacheEntry.cellNodesByColumnIdx[columnIdx];

                if (row === activeRow && columnIdx === activeCell && currentEditor) {
                    currentEditor.loadValue(d);
                } else if (d) {
                    node.innerHTML = getFormatter(row, m)(row, columnIdx, getDataItemValueForColumn(d, m), m, d);
                } else {
                    node.innerHTML = "";
                }
            }

            invalidatePostProcessingResults(row);
        }

        function getViewportHeight() {
            return parseFloat($.css($container[0], "height", true)) -
          parseFloat($.css($headerScroller[0], "height")) - getVBoxDelta($headerScroller) -
          (options.showTopPanel ? options.topPanelHeight + getVBoxDelta($topPanelScroller) : 0) -
          (options.showHeaderRow ? options.headerRowHeight + getVBoxDelta($headerRowScroller) : 0);
        }

        function resizeCanvas() {
            if (!initialized) { return; }
            if (options.autoHeight) {
                viewportH = options.rowHeight * (getDataLength() + (options.enableAddRow ? 1 : 0) + (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0));
            } else {
                viewportH = getViewportHeight();
            }

            numVisibleRows = Math.ceil(viewportH / options.rowHeight);
            viewportW = parseFloat($.css($container[0], "width", true));
            $viewport.height(viewportH);

            if (options.forceFitColumns) {
                autosizeColumns();
            }

            updateRowCount();
            handleScroll();
            render();
        }

        function updateRowCount() {
            if (!initialized) { return; }
            numberOfRows = getDataLength() +
          (options.enableAddRow ? 1 : 0) +
          (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);

            var oldViewportHasVScroll = viewportHasVScroll;
            // with autoHeight, we do not need to accommodate the vertical scroll bar
            viewportHasVScroll = !options.autoHeight && (numberOfRows * options.rowHeight > viewportH);

            // remove the rows that are now outside of the data range
            // this helps avoid redundant calls to .removeRow() when the size of the data decreased by thousands of rows
            var l = options.enableAddRow ? getDataLength() : getDataLength() - 1;
            for (var i in rowsCache) {
                if (i >= l) {
                    removeRowFromCache(i);
                }
            }

            var oldH = h;
            th = Math.max(options.rowHeight * numberOfRows, viewportH - scrollbarDimensions.height);
            if (th < maxSupportedCssHeight) {
                // just one page
                h = ph = th;
                n = 1;
                cj = 0;
            } else {
                // break into pages
                h = maxSupportedCssHeight;
                ph = h / 100;
                n = Math.floor(th / ph);
                cj = (th - h) / (n - 1);
            }

            if (h !== oldH) {
                $canvas.css("height", h);
                scrollTop = $viewport[0].scrollTop;
            }

            var oldScrollTopInRange = (scrollTop + offset <= th - viewportH);

            if (th == 0 || scrollTop == 0) {
                page = offset = 0;
            } else if (oldScrollTopInRange) {
                // maintain virtual position
                scrollTo(scrollTop + offset);
            } else {
                // scroll to bottom
                scrollTo(th - viewportH);
            }

            if (h != oldH && options.autoHeight) {
                resizeCanvas();
            }

            if (options.forceFitColumns && oldViewportHasVScroll != viewportHasVScroll) {
                autosizeColumns();
            }
            updateCanvasWidth(false);
        }

        function getVisibleRange(viewportTop) {
            if (viewportTop == null) {
                viewportTop = scrollTop;
            }

            return {
                top: Math.floor((viewportTop + offset) / options.rowHeight),
                bottom: Math.ceil((viewportTop + offset + viewportH) / options.rowHeight)
            };
        }

        function getRenderedRange(viewportTop) {
            var range = getVisibleRange(viewportTop);
            var buffer = Math.round(viewportH / options.rowHeight);
            var minBuffer = 3;

            if (scrollDir == -1) {
                range.top -= buffer;
                range.bottom += minBuffer;
            } else if (scrollDir == 1) {
                range.top -= minBuffer;
                range.bottom += buffer;
            } else {
                range.top -= minBuffer;
                range.bottom += minBuffer;
            }

            range.top = Math.max(0, range.top);
            range.bottom = Math.min(options.enableAddRow ? getDataLength() : getDataLength() - 1, range.bottom);

            return range;
        }

        function ensureCellNodesInRowsCache(row) {
            var cacheEntry = rowsCache[row];
            if (cacheEntry) {
                if (!cacheEntry.cellNodes) {
                    cacheEntry.cellNodes = [];
                    cacheEntry.cellNodesByColumnIdx = [];

                    var columnIdx = 0, cellNodes = cacheEntry.rowNode.childNodes;
                    for (var j = 0, jj = cellNodes.length; j < jj; j++) {
                        cacheEntry.cellNodesByColumnIdx[columnIdx] = cacheEntry.cellNodes[j] = cellNodes[j];
                        columnIdx += getColspan(row, columnIdx);
                    }
                }
            }
        }

        function renderRows(range) {
            var parentNode = $canvas[0],
          stringArray = [],
          rows = [],
          needToReselectCell = false;

            for (var i = range.top; i <= range.bottom; i++) {
                if (rowsCache[i]) {
                    continue;
                }
                renderedRows++;
                rows.push(i);
                appendRowHtml(stringArray, i);
                if (activeCellNode && activeRow === i) {
                    needToReselectCell = true;
                }
                counter_rows_rendered++;
            }

            if (!rows.length) { return; }

            var x = document.createElement("div");
            x.innerHTML = stringArray.join("");

            for (var i = 0, ii = x.childNodes.length; i < ii; i++) {
                rowsCache[rows[i]] = {
                    "rowNode": parentNode.appendChild(x.firstChild),
                    "cellNodes": null,
                    "cellNodesByColumnIdx": null
                };
            }

            if (needToReselectCell) {
                activeCellNode = getCellNode(activeRow, activeCell);
            }
        }

        function startPostProcessing() {
            if (!options.enableAsyncPostRender) {
                return;
            }
            clearTimeout(h_postrender);
            h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
        }

        function invalidatePostProcessingResults(row) {
            delete postProcessedRows[row];
            postProcessFromRow = Math.min(postProcessFromRow, row);
            postProcessToRow = Math.max(postProcessToRow, row);
            startPostProcessing();
        }

        function updateRowPositions() {
            for (var row in rowsCache) {
                rowsCache[row].rowNode.style.top = (row * options.rowHeight - offset) + "px";
            }
        }

        function render() {
            if (!initialized) { return; }
            var visible = getVisibleRange();
            var rendered = getRenderedRange();

            // remove rows no longer in the viewport
            cleanupRows(rendered);

            // add new rows
            renderRows(rendered);

            postProcessFromRow = visible.top;
            postProcessToRow = Math.min(options.enableAddRow ? getDataLength() : getDataLength() - 1, visible.bottom);
            startPostProcessing();

            lastRenderedScrollTop = scrollTop;
            h_render = null;
        }

        function handleScroll() {
            scrollTop = $viewport[0].scrollTop;
            var scrollLeft = $viewport[0].scrollLeft;
            var scrollDist = Math.abs(scrollTop - prevScrollTop);

            if (scrollLeft !== prevScrollLeft) {
                prevScrollLeft = scrollLeft;
                $headerScroller[0].scrollLeft = scrollLeft;
                $topPanelScroller[0].scrollLeft = scrollLeft;
                $headerRowScroller[0].scrollLeft = scrollLeft;
            }

            if (scrollDist) {
                scrollDir = prevScrollTop < scrollTop ? 1 : -1;
                prevScrollTop = scrollTop;

                // switch virtual pages if needed
                if (scrollDist < viewportH) {
                    scrollTo(scrollTop + offset);
                } else {
                    var oldOffset = offset;
                    page = Math.min(n - 1, Math.floor(scrollTop * ((th - viewportH) / (h - viewportH)) * (1 / ph)));
                    offset = Math.round(page * cj);
                    if (oldOffset != offset) {
                        invalidateAllRows();
                    }
                }

                if (h_render) {
                    clearTimeout(h_render);
                }

                if (Math.abs(lastRenderedScrollTop - scrollTop) < viewportH) {
                    if (Math.abs(lastRenderedScrollTop - scrollTop) > 20) {
                        render();
                    }
                } else {
                    h_render = setTimeout(render, 50);
                }

                trigger(self.onViewportChanged, {});
            }

            trigger(self.onScroll, { scrollLeft: scrollLeft, scrollTop: scrollTop });
        }

        function asyncPostProcessRows() {
            while (postProcessFromRow <= postProcessToRow) {
                var row = (scrollDir >= 0) ? postProcessFromRow++ : postProcessToRow--;
                var cacheEntry = rowsCache[row];
                if (!cacheEntry || postProcessedRows[row] || row >= getDataLength()) {
                    continue;
                }

                ensureCellNodesInRowsCache(row);
                for (var i = 0; i < cacheEntry.cellNodesByColumnIdx.length; i++) {
                    var m = columns[i];
                    if (m.asyncPostRender) {
                        var node = cacheEntry.cellNodesByColumnIdx[i];
                        m.asyncPostRender(node, postProcessFromRow, getDataItem(row), m);
                    }
                }

                postProcessedRows[row] = true;
                h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
                return;
            }
        }

        function updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
            var node, columnId, addedRowHash, removedRowHash;
            for (var row in rowsCache) {
                removedRowHash = removedHash && removedHash[row];
                addedRowHash = addedHash && addedHash[row];

                if (removedRowHash) {
                    for (columnId in removedRowHash) {
                        if (!addedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
                            node = getCellNode(row, getColumnIndex(columnId));
                            if (node) {
                                $(node).removeClass(removedRowHash[columnId]);
                            }
                        }
                    }
                }

                if (addedRowHash) {
                    for (columnId in addedRowHash) {
                        if (!removedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
                            node = getCellNode(row, getColumnIndex(columnId));
                            if (node) {
                                $(node).addClass(addedRowHash[columnId]);
                            }
                        }
                    }
                }
            }
        }

        function addCellCssStyles(key, hash) {
            if (cellCssClasses[key]) {
                throw "addCellCssStyles: cell CSS hash with key '" + key + "' already exists.";
            }

            cellCssClasses[key] = hash;
            updateCellCssStylesOnRenderedRows(hash, null);

            trigger(self.onCellCssStylesChanged, { "key": key, "hash": hash });
        }

        function removeCellCssStyles(key) {
            if (!cellCssClasses[key]) {
                return;
            }

            updateCellCssStylesOnRenderedRows(null, cellCssClasses[key]);
            delete cellCssClasses[key];

            trigger(self.onCellCssStylesChanged, { "key": key, "hash": null });
        }

        function setCellCssStyles(key, hash) {
            var prevHash = cellCssClasses[key];

            cellCssClasses[key] = hash;
            updateCellCssStylesOnRenderedRows(hash, prevHash);

            trigger(self.onCellCssStylesChanged, { "key": key, "hash": hash });
        }

        function getCellCssStyles(key) {
            return cellCssClasses[key];
        }

        function flashCell(row, cell, speed) {
            speed = speed || 100;
            if (rowsCache[row]) {
                var $cell = $(getCellNode(row, cell));

                function toggleCellClass(times) {
                    if (!times) {
                        return;
                    }
                    setTimeout(function () {
                        $cell.queue(function () {
                            $cell.toggleClass(options.cellFlashingCssClass).dequeue();
                            toggleCellClass(times - 1);
                        });
                    },
              speed);
                }

                toggleCellClass(4);
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////////////
        // Interactivity

        function handleDragInit(e, dd) {
            var cell = getCellFromEvent(e);
            if (!cell || !cellExists(cell.row, cell.cell)) {
                return false;
            }

            retval = trigger(self.onDragInit, dd, e);
            if (e.isImmediatePropagationStopped()) {
                return retval;
            }

            // if nobody claims to be handling drag'n'drop by stopping immediate propagation,
            // cancel out of it
            return false;
        }

        function handleDragStart(e, dd) {
            var cell = getCellFromEvent(e);
            if (!cell || !cellExists(cell.row, cell.cell)) {
                return false;
            }

            var retval = trigger(self.onDragStart, dd, e);
            if (e.isImmediatePropagationStopped()) {
                return retval;
            }

            return false;
        }

        function handleDrag(e, dd) {
            return trigger(self.onDrag, dd, e);
        }

        function handleDragEnd(e, dd) {
            trigger(self.onDragEnd, dd, e);
        }

        function handleKeyDown(e) {
            trigger(self.onKeyDown, { row: activeRow, cell: activeCell }, e);
            var handled = e.isImmediatePropagationStopped();

            if (!handled) {
                if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
                    if (e.which == 27) {
                        if (!getEditorLock().isActive()) {
                            return; // no editing mode to cancel, allow bubbling and default processing (exit without cancelling the event)
                        }
                        cancelEditAndSetFocus();
                    } else if (e.which == 37) {
                        navigateLeft();
                    } else if (e.which == 39) {
                        navigateRight();
                    } else if (e.which == 38) {
                        navigateUp();
                    } else if (e.which == 40) {
                        navigateDown();
                    } else if (e.which == 9) {
                        navigateNext();
                    } else if (e.which == 13) {
                        if (options.editable) {
                            if (currentEditor) {
                                // adding new row
                                if (activeRow === getDataLength()) {
                                    navigateDown();
                                }
                                else {
                                    commitEditAndSetFocus();
                                }
                            } else {
                                if (getEditorLock().commitCurrentEdit()) {
                                    makeActiveCellEditable();
                                }
                            }
                        }
                    } else {
                        return;
                    }
                } else if (e.which == 9 && e.shiftKey && !e.ctrlKey && !e.altKey) {
                    navigatePrev();
                } else {
                    return;
                }
            }

            // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
            e.stopPropagation();
            e.preventDefault();
            try {
                e.originalEvent.keyCode = 0; // prevent default behaviour for special keys in IE browsers (F3, F5, etc.)
            }
            // ignore exceptions - setting the original event's keycode throws access denied exception for "Ctrl"
            // (hitting control key only, nothing else), "Shift" (maybe others)
            catch (error) {
            }
        }

        function handleClick(e) {
            if (!currentEditor) {
                // if this click resulted in some cell child node getting focus,
                // don't steal it back - keyboard events will still bubble up
                if (e.target != document.activeElement) {
                    setFocus();
                }
            }

            var cell = getCellFromEvent(e);
            if (!cell || (currentEditor !== null && activeRow == cell.row && activeCell == cell.cell)) {
                return;
            }

            trigger(self.onClick, { row: cell.row, cell: cell.cell }, e);
            if (e.isImmediatePropagationStopped()) {
                return;
            }

            if ((activeCell != cell.cell || activeRow != cell.row) && canCellBeActive(cell.row, cell.cell)) {
                if (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()) {
                    scrollRowIntoView(cell.row, false);
                    setActiveCellInternal(getCellNode(cell.row, cell.cell), (cell.row === getDataLength()) || options.autoEdit);
                }
            }
        }

        function handleContextMenu(e) {
            var $cell = $(e.target).closest(".slick-cell", $canvas);
            if ($cell.length === 0) {
                return;
            }

            // are we editing this cell?
            if (activeCellNode === $cell[0] && currentEditor !== null) {
                return;
            }

            trigger(self.onContextMenu, {}, e);
        }

        function handleDblClick(e) {
            var cell = getCellFromEvent(e);
            if (!cell || (currentEditor !== null && activeRow == cell.row && activeCell == cell.cell)) {
                return;
            }

            trigger(self.onDblClick, { row: cell.row, cell: cell.cell }, e);
            if (e.isImmediatePropagationStopped()) {
                return;
            }

            if (options.editable) {
                gotoCell(cell.row, cell.cell, true);
            }
        }

        function handleHeaderMouseEnter(e) {
            trigger(self.onHeaderMouseEnter, {
                "column": $(this).data("column")
            }, e);
        }

        function handleHeaderMouseLeave(e) {
            trigger(self.onHeaderMouseLeave, {
                "column": $(this).data("column")
            }, e);
        }

        function handleHeaderContextMenu(e) {
            var $header = $(e.target).closest(".slick-header-column", ".slick-header-columns");
            var column = $header && $header.data("column");
            trigger(self.onHeaderContextMenu, { column: column }, e);
        }

        function handleHeaderClick(e) {
            var $header = $(e.target).closest(".slick-header-column", ".slick-header-columns");
            var column = $header && $header.data("column");
            if (column) {
                trigger(self.onHeaderClick, { column: column }, e);
            }
        }

        function handleMouseEnter(e) {
            trigger(self.onMouseEnter, {}, e);
        }

        function handleMouseLeave(e) {
            trigger(self.onMouseLeave, {}, e);
        }

        function cellExists(row, cell) {
            return !(row < 0 || row >= getDataLength() || cell < 0 || cell >= columns.length);
        }

        function getCellFromPoint(x, y) {
            var row = Math.floor((y + offset) / options.rowHeight);
            var cell = 0;

            var w = 0;
            for (var i = 0; i < columns.length && w < x; i++) {
                w += columns[i].width;
                cell++;
            }

            if (cell < 0) {
                cell = 0;
            }

            return { row: row, cell: cell - 1 };
        }

        function getCellFromNode(cellNode) {
            // read column number from .l<columnNumber> CSS class
            var cls = /l\d+/.exec(cellNode.className);
            if (!cls) {
                throw "getCellFromNode: cannot get cell - " + cellNode.className;
            }
            return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
        }

        function getRowFromNode(rowNode) {
            for (var row in rowsCache) {
                if (rowsCache[row].rowNode === rowNode) {
                    return row | 0;
                }
            }

            return null;
        }

        function getCellFromEvent(e) {
            var $cell = $(e.target).closest(".slick-cell", $canvas);
            if (!$cell.length) {
                return null;
            }

            var row = getRowFromNode($cell[0].parentNode);
            var cell = getCellFromNode($cell[0]);

            if (row == null || cell == null) {
                return null;
            } else {
                return {
                    "row": row,
                    "cell": cell
                };
            }
        }

        function getCellNodeBox(row, cell) {
            if (!cellExists(row, cell)) {
                return null;
            }

            var y1 = row * options.rowHeight - offset;
            var y2 = y1 + options.rowHeight - 1;
            var x1 = 0;
            for (var i = 0; i < cell; i++) {
                x1 += columns[i].width;
            }
            var x2 = x1 + columns[cell].width;

            return {
                top: y1,
                left: x1,
                bottom: y2,
                right: x2
            };
        }

        //////////////////////////////////////////////////////////////////////////////////////////////
        // Cell switching

        function resetActiveCell() {
            setActiveCellInternal(null, false);
        }

        function setFocus() {
            $focusSink[0].focus();
        }

        function scrollActiveCellIntoView() {
            if (activeCellNode) {
                var left = $(activeCellNode).position().left,
            right = left + $(activeCellNode).outerWidth(),
            scrollLeft = $viewport.scrollLeft(),
            scrollRight = scrollLeft + $viewport.width();

                if (left < scrollLeft) {
                    $viewport.scrollLeft(left);
                } else if (right > scrollRight) {
                    $viewport.scrollLeft(Math.min(left, right - $viewport[0].clientWidth));
                }
            }
        }

        function setActiveCellInternal(newCell, editMode) {
            if (activeCellNode !== null) {
                makeActiveCellNormal();
                $(activeCellNode).removeClass("active");
            }

            var activeCellChanged = (activeCellNode !== newCell);
            activeCellNode = newCell;

            if (activeCellNode != null) {
                activeRow = getRowFromNode(activeCellNode.parentNode);
                activeCell = activePosX = getCellFromNode(activeCellNode);

                $(activeCellNode).addClass("active");

                if (options.editable && editMode && isCellPotentiallyEditable(activeRow, activeCell)) {
                    clearTimeout(h_editorLoader);

                    if (options.asyncEditorLoading) {
                        h_editorLoader = setTimeout(function () {
                            makeActiveCellEditable();
                        }, options.asyncEditorLoadDelay);
                    } else {
                        makeActiveCellEditable();
                    }
                }
            } else {
                activeRow = activeCell = null;
            }

            if (activeCellChanged) {
                scrollActiveCellIntoView();
                trigger(self.onActiveCellChanged, getActiveCell());
            }
        }

        function clearTextSelection() {
            if (document.selection && document.selection.empty) {
                document.selection.empty();
            } else if (window.getSelection) {
                var sel = window.getSelection();
                if (sel && sel.removeAllRanges) {
                    sel.removeAllRanges();
                }
            }
        }

        function isCellPotentiallyEditable(row, cell) {
            // is the data for this row loaded?
            if (row < getDataLength() && !getDataItem(row)) {
                return false;
            }

            // are we in the Add New row?  can we create new from this cell?
            if (columns[cell].cannotTriggerInsert && row >= getDataLength()) {
                return false;
            }

            // does this cell have an editor?
            if (!getEditor(row, cell)) {
                return false;
            }

            return true;
        }

        function makeActiveCellNormal() {
            if (!currentEditor) {
                return;
            }
            trigger(self.onBeforeCellEditorDestroy, { editor: currentEditor });
            currentEditor.destroy();
            currentEditor = null;

            if (activeCellNode) {
                var d = getDataItem(activeRow);
                $(activeCellNode).removeClass("editable invalid");
                if (d) {
                    var column = columns[activeCell];
                    var formatter = getFormatter(activeRow, column);
                    activeCellNode.innerHTML = formatter(activeRow, activeCell, getDataItemValueForColumn(d, column), column, getDataItem(activeRow));
                    invalidatePostProcessingResults(activeRow);
                }
            }

            // if there previously was text selected on a page (such as selected text in the edit cell just removed),
            // IE can't set focus to anything else correctly
            if ($.browser.msie) {
                clearTextSelection();
            }

            getEditorLock().deactivate(editController);
        }

        function makeActiveCellEditable(editor) {
            if (!activeCellNode) {
                return;
            }
            if (!options.editable) {
                throw "Grid : makeActiveCellEditable : should never get called when options.editable is false";
            }

            // cancel pending async call if there is one
            clearTimeout(h_editorLoader);

            if (!isCellPotentiallyEditable(activeRow, activeCell)) {
                return;
            }

            var columnDef = columns[activeCell];
            var item = getDataItem(activeRow);

            if (trigger(self.onBeforeEditCell, { row: activeRow, cell: activeCell, item: item, column: columnDef }) === false) {
                setFocus();
                return;
            }

            getEditorLock().activate(editController);
            $(activeCellNode).addClass("editable");

            // don't clear the cell if a custom editor is passed through
            if (!editor) {
                activeCellNode.innerHTML = "";
            }

            currentEditor = new (editor || getEditor(activeRow, activeCell))({
                grid: self,
                gridPosition: absBox($container[0]),
                position: absBox(activeCellNode),
                container: activeCellNode,
                column: columnDef,
                item: item || {},
                commitChanges: commitEditAndSetFocus,
                cancelChanges: cancelEditAndSetFocus
            });

            if (item) {
                currentEditor.loadValue(item);
            }

            serializedEditorValue = currentEditor.serializeValue();

            if (currentEditor.position) {
                handleActiveCellPositionChange();
            }
        }

        function commitEditAndSetFocus() {
            // if the commit fails, it would do so due to a validation error
            // if so, do not steal the focus from the editor
            if (getEditorLock().commitCurrentEdit()) {
                setFocus();
                if (options.autoEdit) {
                    navigateDown();
                }
            }
        }

        function cancelEditAndSetFocus() {
            if (getEditorLock().cancelCurrentEdit()) {
                setFocus();
            }
        }

        function absBox(elem) {
            var box = {
                top: elem.offsetTop,
                left: elem.offsetLeft,
                bottom: 0,
                right: 0,
                width: $(elem).outerWidth(),
                height: $(elem).outerHeight(),
                visible: true
            };
            box.bottom = box.top + box.height;
            box.right = box.left + box.width;

            // walk up the tree
            var offsetParent = elem.offsetParent;
            while ((elem = elem.parentNode) != document.body) {
                if (box.visible && elem.scrollHeight != elem.offsetHeight && $(elem).css("overflowY") != "visible") {
                    box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight;
                }

                if (box.visible && elem.scrollWidth != elem.offsetWidth && $(elem).css("overflowX") != "visible") {
                    box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth;
                }

                box.left -= elem.scrollLeft;
                box.top -= elem.scrollTop;

                if (elem === offsetParent) {
                    box.left += elem.offsetLeft;
                    box.top += elem.offsetTop;
                    offsetParent = elem.offsetParent;
                }

                box.bottom = box.top + box.height;
                box.right = box.left + box.width;
            }

            return box;
        }

        function getActiveCellPosition() {
            return absBox(activeCellNode);
        }

        function getGridPosition() {
            return absBox($container[0])
        }

        function handleActiveCellPositionChange() {
            if (!activeCellNode) {
                return;
            }

            trigger(self.onActiveCellPositionChanged, {});

            if (currentEditor) {
                var cellBox = getActiveCellPosition();
                if (currentEditor.show && currentEditor.hide) {
                    if (!cellBox.visible) {
                        currentEditor.hide();
                    } else {
                        currentEditor.show();
                    }
                }

                if (currentEditor.position) {
                    currentEditor.position(cellBox);
                }
            }
        }

        function getCellEditor() {
            return currentEditor;
        }

        function getActiveCell() {
            if (!activeCellNode) {
                return null;
            } else {
                return { row: activeRow, cell: activeCell };
            }
        }

        function getActiveCellNode() {
            return activeCellNode;
        }

        function scrollRowIntoView(row, doPaging) {
            var rowAtTop = row * options.rowHeight;
            var rowAtBottom = (row + 1) * options.rowHeight - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0);

            // need to page down?
            if ((row + 1) * options.rowHeight > scrollTop + viewportH + offset) {
                scrollTo(doPaging ? rowAtTop : rowAtBottom);
                render();
            }
            // or page up?
            else if (row * options.rowHeight < scrollTop + offset) {
                scrollTo(doPaging ? rowAtBottom : rowAtTop);
                render();
            }
        }

        function scrollRowToTop(row) {
            scrollTo(row * options.rowHeight);
            render();
        }

        function getColspan(row, cell) {
            var metadata = data.getItemMetadata && data.getItemMetadata(row);
            if (!metadata || !metadata.columns) {
                return 1;
            }

            var columnData = metadata.columns[columns[cell].id] || metadata.columns[cell];
            var colspan = (columnData && columnData.colspan);
            if (colspan === "*") {
                colspan = columns.length - cell;
            }
            return (colspan || 1);
        }

        function findFirstFocusableCell(row) {
            var cell = 0;
            while (cell < columns.length) {
                if (canCellBeActive(row, cell)) {
                    return cell;
                }
                cell += getColspan(row, cell);
            }
            return null;
        }

        function findLastFocusableCell(row) {
            var cell = 0;
            var lastFocusableCell = null;
            while (cell < columns.length) {
                if (canCellBeActive(row, cell)) {
                    lastFocusableCell = cell;
                }
                cell += getColspan(row, cell);
            }
            return lastFocusableCell;
        }

        function gotoRight(row, cell, posX) {
            if (cell >= columns.length) {
                return null;
            }

            do {
                cell += getColspan(row, cell);
            }
            while (cell < columns.length && !canCellBeActive(row, cell));

            if (cell < columns.length) {
                return {
                    "row": row,
                    "cell": cell,
                    "posX": cell
                };
            }
            return null;
        }

        function gotoLeft(row, cell, posX) {
            if (cell <= 0) {
                return null;
            }

            var firstFocusableCell = findFirstFocusableCell(row);
            if (firstFocusableCell === null || firstFocusableCell >= cell) {
                return null;
            }

            var prev = {
                "row": row,
                "cell": firstFocusableCell,
                "posX": firstFocusableCell
            };
            var pos;
            while (true) {
                pos = gotoRight(prev.row, prev.cell, prev.posX);
                if (!pos) {
                    return null;
                }
                if (pos.cell >= cell) {
                    return prev;
                }
                prev = pos;
            }
        }

        function gotoDown(row, cell, posX) {
            var prevCell;
            while (true) {
                if (++row >= getDataLength() + (options.enableAddRow ? 1 : 0)) {
                    return null;
                }

                prevCell = cell = 0;
                while (cell <= posX) {
                    prevCell = cell;
                    cell += getColspan(row, cell);
                }

                if (canCellBeActive(row, prevCell)) {
                    return {
                        "row": row,
                        "cell": prevCell,
                        "posX": posX
                    };
                }
            }
        }

        function gotoUp(row, cell, posX) {
            var prevCell;
            while (true) {
                if (--row < 0) {
                    return null;
                }

                prevCell = cell = 0;
                while (cell <= posX) {
                    prevCell = cell;
                    cell += getColspan(row, cell);
                }

                if (canCellBeActive(row, prevCell)) {
                    return {
                        "row": row,
                        "cell": prevCell,
                        "posX": posX
                    };
                }
            }
        }

        function gotoNext(row, cell, posX) {
            var pos = gotoRight(row, cell, posX);
            if (pos) {
                return pos;
            }

            var firstFocusableCell = null;
            while (++row < getDataLength() + (options.enableAddRow ? 1 : 0)) {
                firstFocusableCell = findFirstFocusableCell(row);
                if (firstFocusableCell !== null) {
                    return {
                        "row": row,
                        "cell": firstFocusableCell,
                        "posX": firstFocusableCell
                    };
                }
            }
            return null;
        }

        function gotoPrev(row, cell, posX) {
            var pos;
            var lastSelectableCell;
            while (!pos) {
                pos = gotoLeft(row, cell, posX);
                if (pos) {
                    break;
                }
                if (--row < 0) {
                    return null;
                }

                cell = 0;
                lastSelectableCell = findLastFocusableCell(row);
                if (lastSelectableCell !== null) {
                    pos = {
                        "row": row,
                        "cell": lastSelectableCell,
                        "posX": lastSelectableCell
                    };
                }
            }
            return pos;
        }

        function navigateRight() {
            navigate("right");
        }

        function navigateLeft() {
            navigate("left");
        }

        function navigateDown() {
            navigate("down");
        }

        function navigateUp() {
            navigate("up");
        }

        function navigateNext() {
            navigate("next");
        }

        function navigatePrev() {
            navigate("prev");
        }

        function navigate(dir) {
            if (!activeCellNode || !options.enableCellNavigation) {
                return;
            }
            if (!getEditorLock().commitCurrentEdit()) {
                return;
            }
            setFocus();

            var stepFunctions = {
                "up": gotoUp,
                "down": gotoDown,
                "left": gotoLeft,
                "right": gotoRight,
                "prev": gotoPrev,
                "next": gotoNext
            };
            var stepFn = stepFunctions[dir];
            var pos = stepFn(activeRow, activeCell, activePosX);
            if (pos) {
                var isAddNewRow = (pos.row == getDataLength());
                scrollRowIntoView(pos.row, !isAddNewRow);
                setActiveCellInternal(getCellNode(pos.row, pos.cell), isAddNewRow || options.autoEdit);
                activePosX = pos.posX;
            } else {
                setActiveCellInternal(getCellNode(activeRow, activeCell), (activeRow == getDataLength()) || options.autoEdit);
            }
        }

        function getCellNode(row, cell) {
            if (rowsCache[row]) {
                ensureCellNodesInRowsCache(row);
                return rowsCache[row].cellNodesByColumnIdx[cell];
            }
            return null;
        }

        function setActiveCell(row, cell) {
            if (!initialized) { return; }
            if (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
                return;
            }

            if (!options.enableCellNavigation) {
                return;
            }

            scrollRowIntoView(row, false);
            setActiveCellInternal(getCellNode(row, cell), false);
        }

        function canCellBeActive(row, cell) {
            if (!options.enableCellNavigation || row >= getDataLength() + (options.enableAddRow ? 1 : 0) ||
          row < 0 || cell >= columns.length || cell < 0) {
                return false;
            }

            var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
            if (rowMetadata && typeof rowMetadata.focusable === "boolean") {
                return rowMetadata.focusable;
            }

            var columnMetadata = rowMetadata && rowMetadata.columns;
            if (columnMetadata && columnMetadata[columns[cell].id] && typeof columnMetadata[columns[cell].id].focusable === "boolean") {
                return columnMetadata[columns[cell].id].focusable;
            }
            if (columnMetadata && columnMetadata[cell] && typeof columnMetadata[cell].focusable === "boolean") {
                return columnMetadata[cell].focusable;
            }

            if (typeof columns[cell].focusable === "boolean") {
                return columns[cell].focusable;
            }

            return true;
        }

        function canCellBeSelected(row, cell) {
            if (row >= getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
                return false;
            }
            var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
            if (rowMetadata && typeof rowMetadata.selectable === "boolean") {
                return rowMetadata.selectable;
            }

            var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[columns[cell].id] || rowMetadata.columns[cell]);
            if (columnMetadata && typeof columnMetadata.selectable === "boolean") {
                return columnMetadata.selectable;
            }

            if (typeof columns[cell].selectable === "boolean") {
                return columns[cell].selectable;
            }

            return true;
        }

        function gotoCell(row, cell, forceEdit) {
            if (!initialized) { return; }
            if (!canCellBeActive(row, cell)) {
                return;
            }

            if (!getEditorLock().commitCurrentEdit()) {
                return;
            }

            scrollRowIntoView(row, false);

            var newCell = getCellNode(row, cell);

            // if selecting the 'add new' row, start editing right away
            setActiveCellInternal(newCell, forceEdit || (row === getDataLength()) || options.autoEdit);

            // if no editor was created, set the focus back on the grid
            if (!currentEditor) {
                setFocus();
            }
        }


        //////////////////////////////////////////////////////////////////////////////////////////////
        // IEditor implementation for the editor lock

        function commitCurrentEdit() {
            var item = getDataItem(activeRow);
            var column = columns[activeCell];

            if (currentEditor) {
                if (currentEditor.isValueChanged()) {
                    var validationResults = currentEditor.validate();

                    if (validationResults.valid) {
                        if (activeRow < getDataLength()) {
                            var editCommand = {
                                row: activeRow,
                                cell: activeCell,
                                editor: currentEditor,
                                serializedValue: currentEditor.serializeValue(),
                                prevSerializedValue: serializedEditorValue,
                                execute: function () {
                                    this.editor.applyValue(item, this.serializedValue);
                                    updateRow(this.row);
                                },
                                undo: function () {
                                    this.editor.applyValue(item, this.prevSerializedValue);
                                    updateRow(this.row);
                                }
                            };

                            if (options.editCommandHandler) {
                                makeActiveCellNormal();
                                options.editCommandHandler(item, column, editCommand);
                            } else {
                                editCommand.execute();
                                makeActiveCellNormal();
                            }

                            trigger(self.onCellChange, {
                                row: activeRow,
                                cell: activeCell,
                                item: item
                            });
                        } else {
                            var newItem = {};
                            currentEditor.applyValue(newItem, currentEditor.serializeValue());
                            makeActiveCellNormal();
                            trigger(self.onAddNewRow, { item: newItem, column: column });
                        }

                        // check whether the lock has been re-acquired by event handlers
                        return !getEditorLock().isActive();
                    } else {
                        // TODO: remove and put in onValidationError handlers in examples
                        $(activeCellNode).addClass("invalid");
                        $(activeCellNode).stop(true, true).effect("highlight", { color: "red" }, 300);

                        trigger(self.onValidationError, {
                            editor: currentEditor,
                            cellNode: activeCellNode,
                            validationResults: validationResults,
                            row: activeRow,
                            cell: activeCell,
                            column: column
                        });

                        currentEditor.focus();
                        return false;
                    }
                }

                makeActiveCellNormal();
            }
            return true;
        }

        function cancelCurrentEdit() {
            makeActiveCellNormal();
            return true;
        }

        function rowsToRanges(rows) {
            var ranges = [];
            var lastCell = columns.length - 1;
            for (var i = 0; i < rows.length; i++) {
                ranges.push(new Slick.Range(rows[i], 0, rows[i], lastCell));
            }
            return ranges;
        }

        function getSelectedRows() {
            if (!selectionModel) {
                throw "Selection model is not set";
            }
            return selectedRows;
        }

        function setSelectedRows(rows) {
            if (!selectionModel) {
                throw "Selection model is not set";
            }
            selectionModel.setSelectedRanges(rowsToRanges(rows));
        }


        //////////////////////////////////////////////////////////////////////////////////////////////
        // Debug

        this.debug = function () {
            var s = "";

            s += ("\n" + "counter_rows_rendered:  " + counter_rows_rendered);
            s += ("\n" + "counter_rows_removed:  " + counter_rows_removed);
            s += ("\n" + "renderedRows:  " + renderedRows);
            s += ("\n" + "numVisibleRows:  " + numVisibleRows);
            s += ("\n" + "maxSupportedCssHeight:  " + maxSupportedCssHeight);
            s += ("\n" + "n(umber of pages):  " + n);
            s += ("\n" + "(current) page:  " + page);
            s += ("\n" + "page height (ph):  " + ph);
            s += ("\n" + "scrollDir:  " + scrollDir);

            alert(s);
        };

        // a debug helper to be able to access private members
        this.eval = function (expr) {
            return eval(expr);
        };

        //////////////////////////////////////////////////////////////////////////////////////////////
        // Public API

        $.extend(this, {
            "slickGridVersion": "2.0",

            // Events
            "onScroll": new Slick.Event(),
            "onSort": new Slick.Event(),
            "onHeaderMouseEnter": new Slick.Event(),
            "onHeaderMouseLeave": new Slick.Event(),
            "onHeaderContextMenu": new Slick.Event(),
            "onHeaderClick": new Slick.Event(),
            "onHeaderRendered": new Slick.Event(),
            "onBeforeHeaderDestroy": new Slick.Event(),
            "onMouseEnter": new Slick.Event(),
            "onMouseLeave": new Slick.Event(),
            "onClick": new Slick.Event(),
            "onDblClick": new Slick.Event(),
            "onContextMenu": new Slick.Event(),
            "onKeyDown": new Slick.Event(),
            "onAddNewRow": new Slick.Event(),
            "onValidationError": new Slick.Event(),
            "onViewportChanged": new Slick.Event(),
            "onColumnsReordered": new Slick.Event(),
            "onColumnsResized": new Slick.Event(),
            "onCellChange": new Slick.Event(),
            "onBeforeEditCell": new Slick.Event(),
            "onBeforeCellEditorDestroy": new Slick.Event(),
            "onBeforeDestroy": new Slick.Event(),
            "onActiveCellChanged": new Slick.Event(),
            "onActiveCellPositionChanged": new Slick.Event(),
            "onDragInit": new Slick.Event(),
            "onDragStart": new Slick.Event(),
            "onDrag": new Slick.Event(),
            "onDragEnd": new Slick.Event(),
            "onSelectedRowsChanged": new Slick.Event(),
            "onCellCssStylesChanged": new Slick.Event(),

            // Methods
            "registerPlugin": registerPlugin,
            "unregisterPlugin": unregisterPlugin,
            "getColumns": getColumns,
            "setColumns": setColumns,
            "getColumnIndex": getColumnIndex,
            "updateColumnHeader": updateColumnHeader,
            "setSortColumn": setSortColumn,
            "setSortColumns": setSortColumns,
            "getSortColumns": getSortColumns,
            "autosizeColumns": autosizeColumns,
            "getOptions": getOptions,
            "setOptions": setOptions,
            "getData": getData,
            "getDataLength": getDataLength,
            "getDataItem": getDataItem,
            "setData": setData,
            "getSelectionModel": getSelectionModel,
            "setSelectionModel": setSelectionModel,
            "getSelectedRows": getSelectedRows,
            "setSelectedRows": setSelectedRows,

            "render": render,
            "invalidate": invalidate,
            "invalidateRow": invalidateRow,
            "invalidateRows": invalidateRows,
            "invalidateAllRows": invalidateAllRows,
            "updateCell": updateCell,
            "updateRow": updateRow,
            "getViewport": getVisibleRange,
            "getRenderedRange": getRenderedRange,
            "resizeCanvas": resizeCanvas,
            "updateRowCount": updateRowCount,
            "scrollRowIntoView": scrollRowIntoView,
            "scrollRowToTop": scrollRowToTop,
            "getCanvasNode": getCanvasNode,
            "focus": setFocus,

            "getCellFromPoint": getCellFromPoint,
            "getCellFromEvent": getCellFromEvent,
            "getActiveCell": getActiveCell,
            "setActiveCell": setActiveCell,
            "getActiveCellNode": getActiveCellNode,
            "getActiveCellPosition": getActiveCellPosition,
            "resetActiveCell": resetActiveCell,
            "editActiveCell": makeActiveCellEditable,
            "getCellEditor": getCellEditor,
            "getCellNode": getCellNode,
            "getCellNodeBox": getCellNodeBox,
            "canCellBeSelected": canCellBeSelected,
            "canCellBeActive": canCellBeActive,
            "navigatePrev": navigatePrev,
            "navigateNext": navigateNext,
            "navigateUp": navigateUp,
            "navigateDown": navigateDown,
            "navigateLeft": navigateLeft,
            "navigateRight": navigateRight,
            "gotoCell": gotoCell,
            "getTopPanel": getTopPanel,
            "showTopPanel": showTopPanel,
            "hideTopPanel": hideTopPanel,
            "showHeaderRowColumns": showHeaderRowColumns,
            "hideHeaderRowColumns": hideHeaderRowColumns,
            "getHeaderRow": getHeaderRow,
            "getHeaderRowColumn": getHeaderRowColumn,
            "getGridPosition": getGridPosition,
            "flashCell": flashCell,
            "addCellCssStyles": addCellCssStyles,
            "setCellCssStyles": setCellCssStyles,
            "removeCellCssStyles": removeCellCssStyles,
            "getCellCssStyles": getCellCssStyles,

            "init": finishInitialization,
            "destroy": destroy,

            // IEditor implementation
            "getEditorLock": getEditorLock,
            "getEditController": getEditController
        });

        init();
    }
} (jQuery));


(function ($) {
    $.extend(true, window, {
        Slick: {
            Data: {
                DataView: DataView,
                Aggregators: {
                    Avg: AvgAggregator,
                    Min: MinAggregator,
                    Max: MaxAggregator,
                    Sum: SumAggregator
                }
            }
        }
    });


    /***
    * A sample Model implementation.
    * Provides a filtered view of the underlying data.
    *
    * Relies on the data item having an "id" property uniquely identifying it.
    */
    function DataView(options) {
        var self = this;

        var defaults = {
            groupItemMetadataProvider: null,
            inlineFilters: false
        };


        // private
        var idProperty = "id";  // property holding a unique row id
        var items = [];         // data by index
        var rows = [];          // data by row
        var idxById = {};       // indexes by id
        var rowsById = null;    // rows by id; lazy-calculated
        var filter = null;      // filter function
        var updated = null;     // updated item ids
        var suspend = false;    // suspends the recalculation
        var sortAsc = true;
        var fastSortField;
        var sortComparer;
        var refreshHints = {};
        var prevRefreshHints = {};
        var filterArgs;
        var filteredItems = [];
        var compiledFilter;
        var compiledFilterWithCaching;
        var filterCache = [];

        // grouping
        var groupingGetter;
        var groupingGetterIsAFn;
        var groupingFormatter;
        var groupingComparer;
        var groups = [];
        var collapsedGroups = {};
        var aggregators;
        var aggregateCollapsed = false;
        var compiledAccumulators;

        var pagesize = 0;
        var pagenum = 0;
        var totalRows = 0;

        // events
        var onRowCountChanged = new Slick.Event();
        var onRowsChanged = new Slick.Event();
        var onPagingInfoChanged = new Slick.Event();

        options = $.extend(true, {}, defaults, options);


        function beginUpdate() {
            suspend = true;
        }

        function endUpdate() {
            suspend = false;
            refresh();
        }

        function setRefreshHints(hints) {
            refreshHints = hints;
        }

        function setFilterArgs(args) {
            filterArgs = args;
        }

        function updateIdxById(startingIndex) {

            startingIndex = startingIndex || 0;

            var id;
            for (var i = startingIndex, l = items.length; i < l; i++) {
                id = items[i][idProperty];
                if (id === undefined) {
                    throw "Each data element must implement a unique 'id' property";
                }
                idxById[id] = i;
            }
        }

        function ensureIdUniqueness() {
            var id;
            for (var i = 0, l = items.length; i < l; i++) {
                id = items[i][idProperty];
                if (id === undefined || idxById[id] !== i) {
                    throw "Each data element must implement a unique 'id' property";
                }
            }
        }

        function getItems() {
            return items;
        }
		
		//Function that changes date format for to end users local date format
		function applyDateFormat(data) {
			for(var i = 0; i < data.length; i++) {
				var import_dt_tm;
				if(data[i].IMPORT_DT_TM) {
					import_dt_tm = new Date(data[i].IMPORT_DT_TM);
					data[i].IMPORT_DT_TM = import_dt_tm.format(i18n.rlimport_lc.fulldate4yr);
				} 
				var dob;
				if(data[i].DOB) {
					dob = new Date(data[i].DOB);
					data[i].DOB = dob.format(i18n.rlimport_lc.fulldate4yr);
				}
			}
			return data;
		}

        function setItems(data, applyDate, objectIdProperty) {
			//Apply date format according to locale
			if(applyDate) {
				data = applyDateFormat(data);
			}
			
            if (objectIdProperty !== undefined) {
                idProperty = objectIdProperty;
            }

            items = filteredItems = data;
            idxById = {};
            updateIdxById();
            ensureIdUniqueness();
            refresh();
        }

        function setPagingOptions(args) {
            if (args.pageSize != undefined) {
                pagesize = args.pageSize;
                pagenum = pagesize ? Math.min(pagenum, Math.max(0, Math.ceil(totalRows / pagesize) - 1)) : 0;
            }

            if (args.pageNum != undefined) {
                pagenum = Math.min(args.pageNum, Math.max(0, Math.ceil(totalRows / pagesize) - 1));
            }

            onPagingInfoChanged.notify(getPagingInfo(), null, self);

            refresh();
        }

        function getPagingInfo() {
            var totalPages = pagesize ? Math.max(1, Math.ceil(totalRows / pagesize)) : 1;
            return { pageSize: pagesize, pageNum: pagenum, totalRows: totalRows, totalPages: totalPages };
        }

        function sort(comparer, ascending) {
            sortAsc = ascending;
            sortComparer = comparer;
            fastSortField = null;
            if (ascending === false) {
                items.reverse();
            }
            items.sort(comparer);
            if (ascending === false) {
                items.reverse();
            }
            idxById = {};
            updateIdxById();
            refresh();
        }

        /***
        * Provides a workaround for the extremely slow sorting in IE.
        * Does a [lexicographic] sort on a give column by temporarily overriding Object.prototype.toString
        * to return the value of that field and then doing a native Array.sort().
        */
        function fastSort(field, ascending) {
            sortAsc = ascending;
            fastSortField = field;
            sortComparer = null;
            var oldToString = Object.prototype.toString;
            Object.prototype.toString = (typeof field == "function") ? field : function () {
                return this[field]
            };
            // an extra reversal for descending sort keeps the sort stable
            // (assuming a stable native sort implementation, which isn't true in some cases)
            if (ascending === false) {
                items.reverse();
            }
            items.sort();
            Object.prototype.toString = oldToString;
            if (ascending === false) {
                items.reverse();
            }
            idxById = {};
            updateIdxById();
            refresh();
        }

        function reSort() {
            if (sortComparer) {
                sort(sortComparer, sortAsc);
            } else if (fastSortField) {
                fastSort(fastSortField, sortAsc);
            }
        }

        function setFilter(filterFn) {
            filter = filterFn;
            if (options.inlineFilters) {
                compiledFilter = compileFilter();
                compiledFilterWithCaching = compileFilterWithCaching();
            }
            refresh();
        }

        function groupBy(valueGetter, valueFormatter, sortComparer) {
            if (!options.groupItemMetadataProvider) {
                options.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
            }

            groupingGetter = valueGetter;
            groupingGetterIsAFn = typeof groupingGetter === "function";
            groupingFormatter = valueFormatter;
            groupingComparer = sortComparer;
            collapsedGroups = {};
            groups = [];
            refresh();
        }

        function setAggregators(groupAggregators, includeCollapsed) {
            aggregators = groupAggregators;
            aggregateCollapsed = (includeCollapsed !== undefined)
          ? includeCollapsed : aggregateCollapsed;

            // pre-compile accumulator loops
            compiledAccumulators = [];
            var idx = aggregators.length;
            while (idx--) {
                compiledAccumulators[idx] = compileAccumulatorLoop(aggregators[idx]);
            }

            refresh();
        }

        function getItemByIdx(i) {
            return items[i];
        }

        function getIdxById(id) {
            return idxById[id];
        }

        function ensureRowsByIdCache() {
            if (!rowsById) {
                rowsById = {};
                for (var i = 0, l = rows.length; i < l; i++) {
                    rowsById[rows[i][idProperty]] = i;
                }
            }
        }

        function getRowById(id) {
            ensureRowsByIdCache();
            return rowsById[id];
        }

        function getItemById(id) {
            return items[idxById[id]];
        }

        function mapIdsToRows(idArray) {
            var rows = [];
            ensureRowsByIdCache();
            for (var i = 0; i < idArray.length; i++) {
                var row = rowsById[idArray[i]];
                if (row != null) {
                    rows[rows.length] = row;
                }
            }
            return rows;
        }

        function mapRowsToIds(rowArray) {
            var ids = [];
            for (var i = 0; i < rowArray.length; i++) {
                if (rowArray[i] < rows.length) {
                    ids[ids.length] = rows[rowArray[i]][idProperty];
                }
            }
            return ids;
        }

        function updateItem(id, item) {
            if (idxById[id] === undefined || id !== item[idProperty]) {
                throw "Invalid or non-matching id";
            }
            items[idxById[id]] = item;
            if (!updated) {
                updated = {};
            }
            updated[id] = true;
            refresh();
        }

        function insertItem(insertBefore, item) {
            items.splice(insertBefore, 0, item);
            updateIdxById(insertBefore);
            refresh();
        }

        function addItem(item) {
            items.push(item);
            updateIdxById(items.length - 1);
            refresh();
        }

        function deleteItem(id) {
            var idx = idxById[id];
            if (idx === undefined) {
                throw "Invalid id";
            }
            delete idxById[id];
            items.splice(idx, 1);
            updateIdxById(idx);
            refresh();
        }

        function getLength() {
            return rows.length;
        }

        function getItem(i) {
            return rows[i];
        }

        function getItemMetadata(i) {
            var item = rows[i];
            if (item === undefined) {
                return null;
            }

            // overrides for group rows
            if (item.__group) {
                return options.groupItemMetadataProvider.getGroupRowMetadata(item);
            }

            // overrides for totals rows
            if (item.__groupTotals) {
                return options.groupItemMetadataProvider.getTotalsRowMetadata(item);
            }

            return null;
        }

        function collapseGroup(groupingValue) {
            collapsedGroups[groupingValue] = true;
            refresh();
        }

        function expandGroup(groupingValue) {
            delete collapsedGroups[groupingValue];
            refresh();
        }

        function getGroups() {
            return groups;
        }

        function extractGroups(rows) {
            var group;
            var val;
            var groups = [];
            var groupsByVal = [];
            var r;

            for (var i = 0, l = rows.length; i < l; i++) {
                r = rows[i];
                val = (groupingGetterIsAFn) ? groupingGetter(r) : r[groupingGetter];
                val = val || 0;
                group = groupsByVal[val];

                if (!group) {
                    group = new Slick.Group();
                    group.count = 0;
                    group.value = val;
                    group.rows = [];
                    groups[groups.length] = group;
                    groupsByVal[val] = group;
                }

                group.rows[group.count++] = r;
            }

            return groups;
        }

        // TODO:  lazy totals calculation
        function calculateGroupTotals(group) {
            if (group.collapsed && !aggregateCollapsed) {
                return;
            }

            // TODO:  try moving iterating over groups into compiled accumulator
            var totals = new Slick.GroupTotals();
            var agg, idx = aggregators.length;
            while (idx--) {
                agg = aggregators[idx];
                agg.init();
                compiledAccumulators[idx].call(agg, group.rows);
                agg.storeResult(totals);
            }
            totals.group = group;
            group.totals = totals;
        }

        function calculateTotals(groups) {
            var idx = groups.length;
            while (idx--) {
                calculateGroupTotals(groups[idx]);
            }
        }

        function finalizeGroups(groups) {
            var idx = groups.length, g;
            while (idx--) {
                g = groups[idx];
                g.collapsed = (g.value in collapsedGroups);
                g.title = groupingFormatter ? groupingFormatter(g) : g.value;
            }
        }

        function flattenGroupedRows(groups) {
            var groupedRows = [], gl = 0, g;
            for (var i = 0, l = groups.length; i < l; i++) {
                g = groups[i];
                groupedRows[gl++] = g;

                if (!g.collapsed) {
                    for (var j = 0, jj = g.rows.length; j < jj; j++) {
                        groupedRows[gl++] = g.rows[j];
                    }
                }

                if (g.totals && (!g.collapsed || aggregateCollapsed)) {
                    groupedRows[gl++] = g.totals;
                }
            }
            return groupedRows;
        }

        function getFunctionInfo(fn) {
            var fnRegex = /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/;
            var matches = fn.toString().match(fnRegex);
            return {
                params: matches[1].split(","),
                body: matches[2]
            };
        }

        function compileAccumulatorLoop(aggregator) {
            var accumulatorInfo = getFunctionInfo(aggregator.accumulate);
            var fn = new Function(
          "_items",
          "for (var " + accumulatorInfo.params[0] + ", _i=0, _il=_items.length; _i<_il; _i++) {" +
              accumulatorInfo.params[0] + " = _items[_i]; " +
              accumulatorInfo.body +
              "}"
      );
            fn.displayName = fn.name = "compiledAccumulatorLoop";
            return fn;
        }

        function compileFilter() {
            var filterInfo = getFunctionInfo(filter);

            var filterBody = filterInfo.body
          .replace(/return false[;}]/gi, "{ continue _coreloop; }")
          .replace(/return true[;}]/gi, "{ _retval[_idx++] = $item$; continue _coreloop; }")
          .replace(/return ([^;}]+?);/gi,
          "{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }");

            // This preserves the function template code after JS compression,
            // so that replace() commands still work as expected.
            var tpl = [
            //"function(_items, _args) { ",
        "var _retval = [], _idx = 0; ",
        "var $item$, $args$ = _args; ",
        "_coreloop: ",
        "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
        "$item$ = _items[_i]; ",
        "$filter$; ",
        "} ",
        "return _retval; "
            //"}"
      ].join("");
            tpl = tpl.replace(/\$filter\$/gi, filterBody);
            tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
            tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

            var fn = new Function("_items,_args", tpl);
            fn.displayName = fn.name = "compiledFilter";
            return fn;
        }

        function compileFilterWithCaching() {
            var filterInfo = getFunctionInfo(filter);

            var filterBody = filterInfo.body
          .replace(/return false[;}]/gi, "{ continue _coreloop; }")
          .replace(/return true[;}]/gi, "{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }")
          .replace(/return ([^;}]+?);/gi,
          "{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }");

            // This preserves the function template code after JS compression,
            // so that replace() commands still work as expected.
            var tpl = [
            //"function(_items, _args, _cache) { ",
        "var _retval = [], _idx = 0; ",
        "var $item$, $args$ = _args; ",
        "_coreloop: ",
        "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
        "$item$ = _items[_i]; ",
        "if (_cache[_i]) { ",
        "_retval[_idx++] = $item$; ",
        "continue _coreloop; ",
        "} ",
        "$filter$; ",
        "} ",
        "return _retval; "
            //"}"
      ].join("");
            tpl = tpl.replace(/\$filter\$/gi, filterBody);
            tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
            tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

            var fn = new Function("_items,_args,_cache", tpl);
            fn.displayName = fn.name = "compiledFilterWithCaching";
            return fn;
        }

        function uncompiledFilter(items, args) {
            var retval = [], idx = 0;
            for (var i = 0, ii = items.length; i < ii; i++) {
                if (filter(items[i], args)) {
                    retval[idx++] = items[i];
                }
            }

            return retval;
        }

        function uncompiledFilterWithCaching(items, args, cache) {
            var retval = [], idx = 0, item;

            for (var i = 0, ii = items.length; i < ii; i++) {
                item = items[i];
                if (cache[i]) {
                    retval[idx++] = item;
                } else if (filter(item, args)) {
                    retval[idx++] = item;
                    cache[i] = true;
                }
            }

            return retval;
        }

        function getFilteredAndPagedItems(items) {
            if (filter) {
                var batchFilter = options.inlineFilters ? compiledFilter : uncompiledFilter;
                var batchFilterWithCaching = options.inlineFilters ? compiledFilterWithCaching : uncompiledFilterWithCaching;

                if (refreshHints.isFilterNarrowing) {
                    filteredItems = batchFilter(filteredItems, filterArgs);
                } else if (refreshHints.isFilterExpanding) {
                    filteredItems = batchFilterWithCaching(items, filterArgs, filterCache);
                } else if (!refreshHints.isFilterUnchanged) {
                    filteredItems = batchFilter(items, filterArgs);
                }
            } else {
                // special case:  if not filtering and not paging, the resulting
                // rows collection needs to be a copy so that changes due to sort
                // can be caught
                filteredItems = pagesize ? items : items.concat();
            }

            // get the current page
            var paged;
            if (pagesize) {
                if (filteredItems.length < pagenum * pagesize) {
                    pagenum = Math.floor(filteredItems.length / pagesize);
                }
                paged = filteredItems.slice(pagesize * pagenum, pagesize * pagenum + pagesize);
            } else {
                paged = filteredItems;
            }

            return { totalRows: filteredItems.length, rows: paged };
        }

        function getRowDiffs(rows, newRows) {
            var item, r, eitherIsNonData, diff = [];
            var from = 0, to = newRows.length;

            if (refreshHints && refreshHints.ignoreDiffsBefore) {
                from = Math.max(0,
            Math.min(newRows.length, refreshHints.ignoreDiffsBefore));
            }

            if (refreshHints && refreshHints.ignoreDiffsAfter) {
                to = Math.min(newRows.length,
            Math.max(0, refreshHints.ignoreDiffsAfter));
            }

            for (var i = from, rl = rows.length; i < to; i++) {
                if (i >= rl) {
                    diff[diff.length] = i;
                } else {
                    item = newRows[i];
                    r = rows[i];

                    if ((groupingGetter && (eitherIsNonData = (item.__nonDataRow) || (r.__nonDataRow)) &&
              item.__group !== r.__group ||
              item.__updated ||
              item.__group && !item.equals(r))
              || (aggregators && eitherIsNonData &&
                    // no good way to compare totals since they are arbitrary DTOs
                    // deep object comparison is pretty expensive
                    // always considering them 'dirty' seems easier for the time being
              (item.__groupTotals || r.__groupTotals))
              || item[idProperty] != r[idProperty]
              || (updated && updated[item[idProperty]])
              ) {
                        diff[diff.length] = i;
                    }
                }
            }
            return diff;
        }

        function recalc(_items) {
            rowsById = null;

            if (refreshHints.isFilterNarrowing != prevRefreshHints.isFilterNarrowing ||
          refreshHints.isFilterExpanding != prevRefreshHints.isFilterExpanding) {
                filterCache = [];
            }

            var filteredItems = getFilteredAndPagedItems(_items);
            totalRows = filteredItems.totalRows;
            var newRows = filteredItems.rows;

            groups = [];
            if (groupingGetter != null) {
                groups = extractGroups(newRows);
                if (groups.length) {
                    finalizeGroups(groups);
                    if (aggregators) {
                        calculateTotals(groups);
                    }
                    groups.sort(groupingComparer);
                    newRows = flattenGroupedRows(groups);
                }
            }

            var diff = getRowDiffs(rows, newRows);

            rows = newRows;

            return diff;
        }

        function refresh() {
            if (suspend) {
                return;
            }

            var countBefore = rows.length;
            var totalRowsBefore = totalRows;

            var diff = recalc(items, filter); // pass as direct refs to avoid closure perf hit

            // if the current page is no longer valid, go to last page and recalc
            // we suffer a performance penalty here, but the main loop (recalc) remains highly optimized
            if (pagesize && totalRows < pagenum * pagesize) {
                pagenum = Math.max(0, Math.ceil(totalRows / pagesize) - 1);
                diff = recalc(items, filter);
            }

            updated = null;
            prevRefreshHints = refreshHints;
            refreshHints = {};

            if (totalRowsBefore != totalRows) {
                onPagingInfoChanged.notify(getPagingInfo(), null, self);
            }
            if (countBefore != rows.length) {
                onRowCountChanged.notify({ previous: countBefore, current: rows.length }, null, self);
            }
            if (diff.length > 0) {
                onRowsChanged.notify({ rows: diff }, null, self);
            }
        }

        function syncGridSelection(grid, preserveHidden) {
            var self = this;
            var selectedRowIds = self.mapRowsToIds(grid.getSelectedRows()); ;
            var inHandler;

            grid.onSelectedRowsChanged.subscribe(function (e, args) {
                if (inHandler) { return; }
                selectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
            });

            this.onRowsChanged.subscribe(function (e, args) {
                if (selectedRowIds.length > 0) {
                    inHandler = true;
                    var selectedRows = self.mapIdsToRows(selectedRowIds);
                    if (!preserveHidden) {
                        selectedRowIds = self.mapRowsToIds(selectedRows);
                    }
                    grid.setSelectedRows(selectedRows);
                    inHandler = false;
                }
            });
        }

        function syncGridCellCssStyles(grid, key) {
            var hashById;
            var inHandler;

            // since this method can be called after the cell styles have been set,
            // get the existing ones right away
            storeCellCssStyles(grid.getCellCssStyles(key));

            function storeCellCssStyles(hash) {
                hashById = {};
                for (var row in hash) {
                    var id = rows[row][idProperty];
                    hashById[id] = hash[row];
                }
            }

            grid.onCellCssStylesChanged.subscribe(function (e, args) {
                if (inHandler) { return; }
                if (key != args.key) { return; }
                if (args.hash) {
                    storeCellCssStyles(args.hash);
                }
            });

            this.onRowsChanged.subscribe(function (e, args) {
                if (hashById) {
                    inHandler = true;
                    ensureRowsByIdCache();
                    var newHash = {};
                    for (var id in hashById) {
                        var row = rowsById[id];
                        if (row != undefined) {
                            newHash[row] = hashById[id];
                        }
                    }
                    grid.setCellCssStyles(key, newHash);
                    inHandler = false;
                }
            });
        }

        return {
            // methods
            "beginUpdate": beginUpdate,
            "endUpdate": endUpdate,
            "setPagingOptions": setPagingOptions,
            "getPagingInfo": getPagingInfo,
            "getItems": getItems,
            "setItems": setItems,
            "setFilter": setFilter,
            "sort": sort,
            "fastSort": fastSort,
            "reSort": reSort,
            "groupBy": groupBy,
            "setAggregators": setAggregators,
            "collapseGroup": collapseGroup,
            "expandGroup": expandGroup,
            "getGroups": getGroups,
            "getIdxById": getIdxById,
            "getRowById": getRowById,
            "getItemById": getItemById,
            "getItemByIdx": getItemByIdx,
            "mapRowsToIds": mapRowsToIds,
            "mapIdsToRows": mapIdsToRows,
            "setRefreshHints": setRefreshHints,
            "setFilterArgs": setFilterArgs,
            "refresh": refresh,
            "updateItem": updateItem,
            "insertItem": insertItem,
            "addItem": addItem,
            "deleteItem": deleteItem,
            "syncGridSelection": syncGridSelection,
            "syncGridCellCssStyles": syncGridCellCssStyles,

            // data provider methods
            "getLength": getLength,
            "getItem": getItem,
            "getItemMetadata": getItemMetadata,

            // events
            "onRowCountChanged": onRowCountChanged,
            "onRowsChanged": onRowsChanged,
            "onPagingInfoChanged": onPagingInfoChanged
        };
    }

    function AvgAggregator(field) {
        this.field_ = field;

        this.init = function () {
            this.count_ = 0;
            this.nonNullCount_ = 0;
            this.sum_ = 0;
        };

        this.accumulate = function (item) {
            var val = item[this.field_];
            this.count_++;
            if (val != null && val != "" && val != NaN) {
                this.nonNullCount_++;
                this.sum_ += parseFloat(val);
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.avg) {
                groupTotals.avg = {};
            }
            if (this.nonNullCount_ != 0) {
                groupTotals.avg[this.field_] = this.sum_ / this.nonNullCount_;
            }
        };
    }

    function MinAggregator(field) {
        this.field_ = field;

        this.init = function () {
            this.min_ = null;
        };

        this.accumulate = function (item) {
            var val = item[this.field_];
            if (val != null && val != "" && val != NaN) {
                if (this.min_ == null || val < this.min_) {
                    this.min_ = val;
                }
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.min) {
                groupTotals.min = {};
            }
            groupTotals.min[this.field_] = this.min_;
        }
    }

    function MaxAggregator(field) {
        this.field_ = field;

        this.init = function () {
            this.max_ = null;
        };

        this.accumulate = function (item) {
            var val = item[this.field_];
            if (val != null && val != "" && val != NaN) {
                if (this.max_ == null || val > this.max_) {
                    this.max_ = val;
                }
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.max) {
                groupTotals.max = {};
            }
            groupTotals.max[this.field_] = this.max_;
        }
    }

    function SumAggregator(field) {
        this.field_ = field;

        this.init = function () {
            this.sum_ = null;
        };

        this.accumulate = function (item) {
            var val = item[this.field_];
            if (val != null && val != "" && val != NaN) {
                this.sum_ += parseFloat(val);
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.sum) {
                groupTotals.sum = {};
            }
            groupTotals.sum[this.field_] = this.sum_;
        }
    }

    // TODO:  add more built-in aggregators
    // TODO:  merge common aggregators in one to prevent needles iterating

})(jQuery);
/***
* Contains basic SlickGrid formatters.
* @module Formatters
* @namespace Slick
*/

(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "Formatters": {
                "PercentComplete": PercentCompleteFormatter,
                "PercentCompleteBar": PercentCompleteBarFormatter,
                "YesNo": YesNoFormatter,
                "Checkmark": CheckmarkFormatter
            }
        }
    });

    function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
        if (value == null || value === "") {
            return "-";
        } else if (value < 50) {
            return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
        } else {
            return "<span style='color:green'>" + value + "%</span>";
        }
    }

    function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
        if (value == null || value === "") {
            return "";
        }

        var color;

        if (value < 30) {
            color = "red";
        } else if (value < 70) {
            color = "silver";
        } else {
            color = "green";
        }

        return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
    }

    function YesNoFormatter(row, cell, value, columnDef, dataContext) {
        return value ? "Yes" : "No";
    }

    function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
        return value ? "<img src='../images/tick.png'>" : "";
    }
})(jQuery);


(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "CellRangeDecorator": CellRangeDecorator
        }
    });

    /***
    * Displays an overlay on top of a given cell range.
    *
    * TODO:
    * Currently, it blocks mouse events to DOM nodes behind it.
    * Use FF and WebKit-specific "pointer-events" CSS style, or some kind of event forwarding.
    * Could also construct the borders separately using 4 individual DIVs.
    *
    * @param {Grid} grid
    * @param {Object} options
    */
    function CellRangeDecorator(grid, options) {
        var _elem;
        var _defaults = {
            selectionCss: {
                "zIndex": "9999",
                "border": "2px dashed red"
            }
        };

        options = $.extend(true, {}, _defaults, options);


        function show(range) {
            if (!_elem) {
                _elem = $("<div></div>", { css: options.selectionCss })
            .css("position", "absolute")
            .appendTo(grid.getCanvasNode());
            }

            var from = grid.getCellNodeBox(range.fromRow, range.fromCell);
            var to = grid.getCellNodeBox(range.toRow, range.toCell);

            _elem.css({
                top: from.top - 1,
                left: from.left - 1,
                height: to.bottom - from.top - 2,
                width: to.right - from.left - 2
            });

            return _elem;
        }

        function hide() {
            if (_elem) {
                _elem.remove();
                _elem = null;
            }
        }

        $.extend(this, {
            "show": show,
            "hide": hide
        });
    }
})(jQuery);

(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "CellRangeSelector": CellRangeSelector
        }
    });


    function CellRangeSelector(options) {
        var _grid;
        var _canvas;
        var _dragging;
        var _decorator;
        var _self = this;
        var _handler = new Slick.EventHandler();
        var _defaults = {
            selectionCss: {
                "border": "2px dashed blue"
            }
        };


        function init(grid) {
            options = $.extend(true, {}, _defaults, options);
            _decorator = new Slick.CellRangeDecorator(grid, options);
            _grid = grid;
            _canvas = _grid.getCanvasNode();
            _handler
        .subscribe(_grid.onDragInit, handleDragInit)
        .subscribe(_grid.onDragStart, handleDragStart)
        .subscribe(_grid.onDrag, handleDrag)
        .subscribe(_grid.onDragEnd, handleDragEnd);
        }

        function destroy() {
            _handler.unsubscribeAll();
        }

        function handleDragInit(e, dd) {
            // prevent the grid from cancelling drag'n'drop by default
            e.stopImmediatePropagation();
        }

        function handleDragStart(e, dd) {
            var cell = _grid.getCellFromEvent(e);
            if (_self.onBeforeCellRangeSelected.notify(cell) !== false) {
                if (_grid.canCellBeSelected(cell.row, cell.cell)) {
                    _dragging = true;
                    e.stopImmediatePropagation();
                }
            }
            if (!_dragging) {
                return;
            }

            var start = _grid.getCellFromPoint(
          dd.startX - $(_canvas).offset().left,
          dd.startY - $(_canvas).offset().top);

            dd.range = { start: start, end: {} };

            return _decorator.show(new Slick.Range(start.row, start.cell));
        }

        function handleDrag(e, dd) {
            if (!_dragging) {
                return;
            }
            e.stopImmediatePropagation();

            var end = _grid.getCellFromPoint(
          e.pageX - $(_canvas).offset().left,
          e.pageY - $(_canvas).offset().top);

            if (!_grid.canCellBeSelected(end.row, end.cell)) {
                return;
            }

            dd.range.end = end;
            _decorator.show(new Slick.Range(dd.range.start.row, dd.range.start.cell, end.row, end.cell));
        }

        function handleDragEnd(e, dd) {
            if (!_dragging) {
                return;
            }

            _dragging = false;
            e.stopImmediatePropagation();

            _decorator.hide();
            _self.onCellRangeSelected.notify({
                range: new Slick.Range(
            dd.range.start.row,
            dd.range.start.cell,
            dd.range.end.row,
            dd.range.end.cell
        )
            });
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "onBeforeCellRangeSelected": new Slick.Event(),
            "onCellRangeSelected": new Slick.Event()
        });
    }
})(jQuery);

(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "CellSelectionModel": CellSelectionModel
        }
    });


    function CellSelectionModel(options) {
        var _grid;
        var _canvas;
        var _ranges = [];
        var _self = this;
        var _selector = new Slick.CellRangeSelector({
            "selectionCss": {
                "border": "2px solid black"
            }
        });
        var _options;
        var _defaults = {
            selectActiveCell: true
        };


        function init(grid) {
            _options = $.extend(true, {}, _defaults, options);
            _grid = grid;
            _canvas = _grid.getCanvasNode();
            _grid.onActiveCellChanged.subscribe(handleActiveCellChange);
            grid.registerPlugin(_selector);
            _selector.onCellRangeSelected.subscribe(handleCellRangeSelected);
            _selector.onBeforeCellRangeSelected.subscribe(handleBeforeCellRangeSelected);
        }

        function destroy() {
            _grid.onActiveCellChanged.unsubscribe(handleActiveCellChange);
            _selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected);
            _selector.onBeforeCellRangeSelected.unsubscribe(handleBeforeCellRangeSelected);
            _grid.unregisterPlugin(_selector);
        }

        function removeInvalidRanges(ranges) {
            var result = [];
            for (var i = 0; i < ranges.length; i++) {
                var r = ranges[i];
                if (_grid.canCellBeSelected(r.fromRow, r.fromCell) && _grid.canCellBeSelected(r.toRow, r.toCell)) {
                    result.push(r);
                }
            }

            return result;
        }

        function setSelectedRanges(ranges) {
            _ranges = removeInvalidRanges(ranges);
            _self.onSelectedRangesChanged.notify(_ranges);
        }

        function getSelectedRanges() {
            return _ranges;
        }

        function handleBeforeCellRangeSelected(e, args) {
            if (_grid.getEditorLock().isActive()) {
                e.stopPropagation();
                return false;
            }
        }

        function handleCellRangeSelected(e, args) {
            setSelectedRanges([args.range]);
        }

        function handleActiveCellChange(e, args) {
            if (_options.selectActiveCell) {
                setSelectedRanges([new Slick.Range(args.row, args.cell)]);
            }
        }

        $.extend(this, {
            "getSelectedRanges": getSelectedRanges,
            "setSelectedRanges": setSelectedRanges,

            "init": init,
            "destroy": destroy,

            "onSelectedRangesChanged": new Slick.Event()
        });
    }
})(jQuery);

(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "CheckboxSelectColumn": CheckboxSelectColumn
        }
    });


    function CheckboxSelectColumn(options) {
        var _grid;
        var _self = this;
        var _handler = new Slick.EventHandler();
        var _selectedRowsLookup = {};
        var _defaults = {
            columnId: "_checkbox_selector",
            cssClass: null,
            toolTip: i18n.rlimport.SELDESELECTALL,
            width: 30
        };

        var _options = $.extend(true, {}, _defaults, options);

        function init(grid) {
            _grid = grid;
            _handler
        .subscribe(_grid.onSelectedRowsChanged, handleSelectedRowsChanged)
        .subscribe(_grid.onClick, handleClick)
        .subscribe(_grid.onHeaderClick, handleHeaderClick)
        .subscribe(_grid.onKeyDown, handleKeyDown);
        }

        function destroy() {
            _handler.unsubscribeAll();
        }

        function handleSelectedRowsChanged(e, args) {
            var selectedRows = _grid.getSelectedRows();
            var lookup = {}, row, i;
            for (i = 0; i < selectedRows.length; i++) {
                row = selectedRows[i];
                lookup[row] = true;
                if (lookup[row] !== _selectedRowsLookup[row]) {
                    _grid.invalidateRow(row);
                    delete _selectedRowsLookup[row];
                }
            }
            for (i in _selectedRowsLookup) {
                _grid.invalidateRow(i);
            }
            _selectedRowsLookup = lookup;
            _grid.render();

            if (selectedRows.length == _grid.getDataLength()) {
                _grid.updateColumnHeader(_options.columnId, "<input type='checkbox' checked='checked'>", _options.toolTip);
            } else {
                _grid.updateColumnHeader(_options.columnId, "<input type='checkbox'>", _options.toolTip);
            }
        }

        function handleKeyDown(e, args) {
            if (e.which == 32) {
                if (_grid.getColumns()[args.cell].id === _options.columnId) {
                    // if editing, try to commit
                    if (!_grid.getEditorLock().isActive() || _grid.getEditorLock().commitCurrentEdit()) {
                        toggleRowSelection(args.row);
                    }
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }
        }

        function handleClick(e, args) {
            // clicking on a row select checkbox
            if (_grid.getColumns()[args.cell].id === _options.columnId && $(e.target).is(":checkbox")) {
                // if editing, try to commit
                if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return;
                }

                toggleRowSelection(args.row);
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }

        function toggleRowSelection(row) {
            if (_selectedRowsLookup[row]) {
                _grid.setSelectedRows($.grep(_grid.getSelectedRows(), function (n) {
                    return n != row
                }));
            } else {
                _grid.setSelectedRows(_grid.getSelectedRows().concat(row));
            }
        }

        function handleHeaderClick(e, args) {
            if (args.column.id == _options.columnId && $(e.target).is(":checkbox")) {
                // if editing, try to commit
                if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return;
                }

                if ($(e.target).is(":checked")) {
                    var rows = [];
                    for (var i = 0; i < _grid.getDataLength(); i++) {
                        rows.push(i);
                    }
                    _grid.setSelectedRows(rows);
                } else {
                    _grid.setSelectedRows([]);
                }
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }

        function getColumnDefinition() {
            return {
                id: _options.columnId,
                name: "<input type='checkbox'>",
                toolTip: _options.toolTip,
                field: "sel",
                width: _options.width,
                resizable: false,
                sortable: false,
                cssClass: _options.cssClass,
                formatter: checkboxSelectionFormatter
            };
        }

        function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
            if (dataContext) {
                return _selectedRowsLookup[row]
            ? "<input type='checkbox' checked='checked'>"
            : "<input type='checkbox'>";
            }
            return null;
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "getColumnDefinition": getColumnDefinition
        });
    }
})(jQuery);

(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "Plugins": {
                "HeaderButtons": HeaderButtons
            }
        }
    });


    /***
    * Contains basic SlickGrid editors.
    * @module Editors
    * @namespace Slick
    */

    (function ($) {
        // register namespace
        $.extend(true, window, {
            "Slick": {
                "Editors": {
                    "Text": TextEditor,
                    "Integer": IntegerEditor,
                    "Date": DateEditor,
                    "YesNoSelect": YesNoSelectEditor,
                    "Checkbox": CheckboxEditor,
                    "PercentComplete": PercentCompleteEditor,
                    "LongText": LongTextEditor
                }
            }
        });

        function TextEditor(args) {
            var $input;
            var defaultValue;
            var scope = this;

            this.init = function () {
                $input = $("<INPUT type=text class='editor-text' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
              if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                  e.stopImmediatePropagation();
              }
          })
          .focus()
          .select();
            };

            this.destroy = function () {
                $input.remove();
            };

            this.focus = function () {
                $input.focus();
            };

            this.getValue = function () {
                return $input.val();
            };

            this.setValue = function (val) {
                $input.val(val);
            };

            this.loadValue = function (item) {
                defaultValue = item[args.column.field] || "";
                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };

            this.serializeValue = function () {
                return $input.val();
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function () {
                if (args.column.validator) {
                    var validationResults = args.column.validator($input.val());
                    if (!validationResults.valid) {
                        return validationResults;
                    }
                }

                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        }

        function IntegerEditor(args) {
            var $input;
            var defaultValue;
            var scope = this;

            this.init = function () {
                $input = $("<INPUT type=text class='editor-text' />");

                $input.bind("keydown.nav", function (e) {
                    if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                        e.stopImmediatePropagation();
                    }
                });

                $input.appendTo(args.container);
                $input.focus().select();
            };

            this.destroy = function () {
                $input.remove();
            };

            this.focus = function () {
                $input.focus();
            };

            this.loadValue = function (item) {
                defaultValue = item[args.column.field];
                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };

            this.serializeValue = function () {
                return parseInt($input.val(), 10) || 0;
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function () {
                if (isNaN($input.val())) {
                    return {
                        valid: false,
                        msg: "Please enter a valid integer"
                    };
                }

                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        }

        function DateEditor(args) {
            var $input;
            var defaultValue;
            var scope = this;
            var calendarOpen = false;

            this.init = function () {
                $input = $("<INPUT type=text class='editor-text' />");
                $input.appendTo(args.container);
                $input.focus().select();
                $input.datepicker({
                    showOn: "button",
                    buttonImageOnly: true,
                    buttonImage: "../images/calendar.gif",
                    beforeShow: function () {
                        calendarOpen = true
                    },
                    onClose: function () {
                        calendarOpen = false
                    }
                });
                $input.width($input.width() - 18);
            };

            this.destroy = function () {
                $.datepicker.dpDiv.stop(true, true);
                $input.datepicker("hide");
                $input.datepicker("destroy");
                $input.remove();
            };

            this.show = function () {
                if (calendarOpen) {
                    $.datepicker.dpDiv.stop(true, true).show();
                }
            };

            this.hide = function () {
                if (calendarOpen) {
                    $.datepicker.dpDiv.stop(true, true).hide();
                }
            };

            this.position = function (position) {
                if (!calendarOpen) {
                    return;
                }
                $.datepicker.dpDiv
          .css("top", position.top + 30)
          .css("left", position.left);
            };

            this.focus = function () {
                $input.focus();
            };

            this.loadValue = function (item) {
                defaultValue = item[args.column.field];
                $input.val(defaultValue);
                $input[0].defaultValue = defaultValue;
                $input.select();
            };

            this.serializeValue = function () {
                return $input.val();
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function () {
                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        }

        function YesNoSelectEditor(args) {
            var $select;
            var defaultValue;
            var scope = this;

            this.init = function () {
                $select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>");
                $select.appendTo(args.container);
                $select.focus();
            };

            this.destroy = function () {
                $select.remove();
            };

            this.focus = function () {
                $select.focus();
            };

            this.loadValue = function (item) {
                $select.val((defaultValue = item[args.column.field]) ? "yes" : "no");
                $select.select();
            };

            this.serializeValue = function () {
                return ($select.val() == "yes");
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return ($select.val() != defaultValue);
            };

            this.validate = function () {
                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        }

        function CheckboxEditor(args) {
            var $select;
            var defaultValue;
            var scope = this;

            this.init = function () {
                $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>");
                $select.appendTo(args.container);
                $select.focus();
            };

            this.destroy = function () {
                $select.remove();
            };

            this.focus = function () {
                $select.focus();
            };

            this.loadValue = function (item) {
                defaultValue = item[args.column.field];
                if (defaultValue) {
                    $select.attr("checked", "checked");
                } else {
                    $select.removeAttr("checked");
                }
            };

            this.serializeValue = function () {
                return $select.attr("checked");
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return ($select.attr("checked") != defaultValue);
            };

            this.validate = function () {
                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        }

        function PercentCompleteEditor(args) {
            var $input, $picker;
            var defaultValue;
            var scope = this;

            this.init = function () {
                $input = $("<INPUT type=text class='editor-percentcomplete' />");
                $input.width($(args.container).innerWidth() - 25);
                $input.appendTo(args.container);

                $picker = $("<div class='editor-percentcomplete-picker' />").appendTo(args.container);
                $picker.append("<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /></div></div>");

                $picker.find(".editor-percentcomplete-buttons").append("<button val=0>Not started</button><br/><button val=50>In Progress</button><br/><button val=100>Complete</button>");

                $input.focus().select();

                $picker.find(".editor-percentcomplete-slider").slider({
                    orientation: "vertical",
                    range: "min",
                    value: defaultValue,
                    slide: function (event, ui) {
                        $input.val(ui.value)
                    }
                });

                $picker.find(".editor-percentcomplete-buttons button").bind("click", function (e) {
                    $input.val($(this).attr("val"));
                    $picker.find(".editor-percentcomplete-slider").slider("value", $(this).attr("val"));
                })
            };

            this.destroy = function () {
                $input.remove();
                $picker.remove();
            };

            this.focus = function () {
                $input.focus();
            };

            this.loadValue = function (item) {
                $input.val(defaultValue = item[args.column.field]);
                $input.select();
            };

            this.serializeValue = function () {
                return parseInt($input.val(), 10) || 0;
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return (!($input.val() == "" && defaultValue == null)) && ((parseInt($input.val(), 10) || 0) != defaultValue);
            };

            this.validate = function () {
                if (isNaN(parseInt($input.val(), 10))) {
                    return {
                        valid: false,
                        msg: "Please enter a valid positive number"
                    };
                }

                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        }

        /*
        * An example of a "detached" editor.
        * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
        * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
        */
        function LongTextEditor(args) {
            var $input, $wrapper;
            var defaultValue;
            var scope = this;

            this.init = function () {
                var $container = $("body");

                $wrapper = $("<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
          .appendTo($container);

                $input = $("<TEXTAREA hidefocus rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'>")
          .appendTo($wrapper);

                $("<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
          .appendTo($wrapper);

                $wrapper.find("button:first").bind("click", this.save);
                $wrapper.find("button:last").bind("click", this.cancel);
                $input.bind("keydown", this.handleKeyDown);

                scope.position(args.position);
                $input.focus().select();
            };

            this.handleKeyDown = function (e) {
                if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
                    scope.save();
                } else if (e.which == $.ui.keyCode.ESCAPE) {
                    e.preventDefault();
                    scope.cancel();
                } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
                    e.preventDefault();
                    grid.navigatePrev();
                } else if (e.which == $.ui.keyCode.TAB) {
                    e.preventDefault();
                    grid.navigateNext();
                }
            };

            this.save = function () {
                args.commitChanges();
            };

            this.cancel = function () {
                $input.val(defaultValue);
                args.cancelChanges();
            };

            this.hide = function () {
                $wrapper.hide();
            };

            this.show = function () {
                $wrapper.show();
            };

            this.position = function (position) {
                $wrapper
          .css("top", position.top - 5)
          .css("left", position.left - 5)
            };

            this.destroy = function () {
                $wrapper.remove();
            };

            this.focus = function () {
                $input.focus();
            };

            this.loadValue = function (item) {
                $input.val(defaultValue = item[args.column.field]);
                $input.select();
            };

            this.serializeValue = function () {
                return $input.val();
            };

            this.applyValue = function (item, state) {
                item[args.column.field] = state;
            };

            this.isValueChanged = function () {
                return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };

            this.validate = function () {
                return {
                    valid: true,
                    msg: null
                };
            };

            this.init();
        }
    })(jQuery);

    (function ($) {
        // register namespace
        $.extend(true, window, {
            "Slick": {
                "RowSelectionModel": RowSelectionModel
            }
        });

        function RowSelectionModel(options) {
            var _grid;
            var _ranges = [];
            var _self = this;
            var _handler = new Slick.EventHandler();
            var _inHandler;
            var _options;
            var _defaults = {
                selectActiveRow: true
            };

            function init(grid) {
                _options = $.extend(true, {}, _defaults, options);
                _grid = grid;
                _handler.subscribe(_grid.onActiveCellChanged,
          wrapHandler(handleActiveCellChange));
                _handler.subscribe(_grid.onKeyDown,
          wrapHandler(handleKeyDown));
                _handler.subscribe(_grid.onClick,
          wrapHandler(handleClick));
            }

            function destroy() {
                _handler.unsubscribeAll();
            }

            function wrapHandler(handler) {
                return function () {
                    if (!_inHandler) {
                        _inHandler = true;
                        handler.apply(this, arguments);
                        _inHandler = false;
                    }
                };
            }

            function rangesToRows(ranges) {
                var rows = [];
                for (var i = 0; i < ranges.length; i++) {
                    for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
                        rows.push(j);
                    }
                }
                return rows;
            }

            function rowsToRanges(rows) {
                var ranges = [];
                var lastCell = _grid.getColumns().length - 1;
                for (var i = 0; i < rows.length; i++) {
                    ranges.push(new Slick.Range(rows[i], 0, rows[i], lastCell));
                }
                return ranges;
            }

            function getRowsRange(from, to) {
                var i, rows = [];
                for (i = from; i <= to; i++) {
                    rows.push(i);
                }
                for (i = to; i < from; i++) {
                    rows.push(i);
                }
                return rows;
            }

            function getSelectedRows() {
                return rangesToRows(_ranges);
            }

            function setSelectedRows(rows) {
                setSelectedRanges(rowsToRanges(rows));
            }

            function setSelectedRanges(ranges) {
                _ranges = ranges;
                _self.onSelectedRangesChanged.notify(_ranges);
            }

            function getSelectedRanges() {
                return _ranges;
            }

            function handleActiveCellChange(e, data) {
                if (_options.selectActiveRow) {
                    setSelectedRanges([new Slick.Range(data.row, 0, data.row, _grid.getColumns().length - 1)]);
                }
            }

            function handleKeyDown(e) {
                var activeRow = _grid.getActiveCell();
                if (activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which == 38 || e.which == 40)) {
                    var selectedRows = getSelectedRows();
                    selectedRows.sort(function (x, y) {
                        return x - y
                    });

                    if (!selectedRows.length) {
                        selectedRows = [activeRow.row];
                    }

                    var top = selectedRows[0];
                    var bottom = selectedRows[selectedRows.length - 1];
                    var active;

                    if (e.which == 40) {
                        active = activeRow.row < bottom || top == bottom ? ++bottom : ++top;
                    } else {
                        active = activeRow.row < bottom ? --bottom : --top;
                    }

                    if (active >= 0 && active < _grid.getDataLength()) {
                        _grid.scrollRowIntoView(active);
                        _ranges = rowsToRanges(getRowsRange(top, bottom));
                        setSelectedRanges(_ranges);
                    }

                    e.preventDefault();
                    e.stopPropagation();
                }
            }

            function handleClick(e) {
                var cell = _grid.getCellFromEvent(e);
                if (!cell || !_grid.canCellBeActive(cell.row, cell.cell)) {
                    return false;
                }

                var selection = rangesToRows(_ranges);
                var idx = $.inArray(cell.row, selection);

                if (!e.ctrlKey && !e.shiftKey && !e.metaKey) {
                    return false;
                }
                else if (_grid.getOptions().multiSelect) {
                    if (idx === -1 && (e.ctrlKey || e.metaKey)) {
                        selection.push(cell.row);
                        _grid.setActiveCell(cell.row, cell.cell);
                    } else if (idx !== -1 && (e.ctrlKey || e.metaKey)) {
                        selection = $.grep(selection, function (o, i) {
                            return (o !== cell.row);
                        });
                        _grid.setActiveCell(cell.row, cell.cell);
                    } else if (selection.length && e.shiftKey) {
                        var last = selection.pop();
                        var from = Math.min(cell.row, last);
                        var to = Math.max(cell.row, last);
                        selection = [];
                        for (var i = from; i <= to; i++) {
                            if (i !== last) {
                                selection.push(i);
                            }
                        }
                        selection.push(last);
                        _grid.setActiveCell(cell.row, cell.cell);
                    }
                }

                _ranges = rowsToRanges(selection);
                setSelectedRanges(_ranges);
                e.stopImmediatePropagation();

                return true;
            }

            $.extend(this, {
                "getSelectedRows": getSelectedRows,
                "setSelectedRows": setSelectedRows,

                "getSelectedRanges": getSelectedRanges,
                "setSelectedRanges": setSelectedRanges,

                "init": init,
                "destroy": destroy,

                "onSelectedRangesChanged": new Slick.Event()
            });
        }
    })(jQuery);

    (function ($) {
        // register namespace
        $.extend(true, window, {
            "Slick": {
                "RowMoveManager": RowMoveManager
            }
        });

        function RowMoveManager() {
            var _grid;
            var _canvas;
            var _dragging;
            var _self = this;
            var _handler = new Slick.EventHandler();

            function init(grid) {
                _grid = grid;
                _canvas = _grid.getCanvasNode();
                _handler
        .subscribe(_grid.onDragInit, handleDragInit)
        .subscribe(_grid.onDragStart, handleDragStart)
        .subscribe(_grid.onDrag, handleDrag)
        .subscribe(_grid.onDragEnd, handleDragEnd);
            }

            function destroy() {
                _handler.unsubscribeAll();
            }

            function handleDragInit(e, dd) {
                // prevent the grid from cancelling drag'n'drop by default
                e.stopImmediatePropagation();
            }

            function handleDragStart(e, dd) {
                var cell = _grid.getCellFromEvent(e);
                if (_grid.getEditorLock().isActive() || !/move|selectAndMove/.test(_grid.getColumns()[cell.cell].behavior)) {
                    return false;
                }

                _dragging = true;
                e.stopImmediatePropagation();

                var selectedRows = _grid.getSelectedRows();

                if (selectedRows.length == 0 || $.inArray(cell.row, selectedRows) == -1) {
                    selectedRows = [cell.row];
                    _grid.setSelectedRows(selectedRows);
                }

                var rowHeight = _grid.getOptions().rowHeight;

                dd.selectedRows = selectedRows;

                dd.selectionProxy = $("<div class='slick-reorder-proxy'/>")
          .css("position", "absolute")
          .css("zIndex", "99999")
          .css("width", $(_canvas).innerWidth())
          .css("height", rowHeight * selectedRows.length)
          .appendTo(_canvas);

                dd.guide = $("<div class='slick-reorder-guide'/>")
          .css("position", "absolute")
          .css("zIndex", "99998")
          .css("width", $(_canvas).innerWidth())
          .css("top", -1000)
          .appendTo(_canvas);

                dd.insertBefore = -1;
            }

            function handleDrag(e, dd) {
                if (!_dragging) {
                    return;
                }

                e.stopImmediatePropagation();

                var top = e.pageY - $(_canvas).offset().top;
                dd.selectionProxy.css("top", top - 5);

                var insertBefore = Math.max(0, Math.min(Math.round(top / _grid.getOptions().rowHeight), _grid.getDataLength()));
                if (insertBefore !== dd.insertBefore) {
                    var eventData = {
                        "rows": dd.selectedRows,
                        "insertBefore": insertBefore
                    };

                    if (_self.onBeforeMoveRows.notify(eventData) === false) {
                        dd.guide.css("top", -1000);
                        dd.canMove = false;
                    } else {
                        dd.guide.css("top", insertBefore * _grid.getOptions().rowHeight);
                        dd.canMove = true;
                    }

                    dd.insertBefore = insertBefore;
                }
            }

            function handleDragEnd(e, dd) {
                if (!_dragging) {
                    return;
                }
                _dragging = false;
                e.stopImmediatePropagation();

                dd.guide.remove();
                dd.selectionProxy.remove();

                if (dd.canMove) {
                    var eventData = {
                        "rows": dd.selectedRows,
                        "insertBefore": dd.insertBefore
                    };
                    // TODO:  _grid.remapCellCssClasses ?
                    _self.onMoveRows.notify(eventData);
                }
            }

            $.extend(this, {
                "onBeforeMoveRows": new Slick.Event(),
                "onMoveRows": new Slick.Event(),

                "init": init,
                "destroy": destroy
            });
        }
    })(jQuery);

    (function ($) {
        // register namespace
        $.extend(true, window, {
            "Slick": {
                "AutoTooltips": AutoTooltips
            }
        });


        function AutoTooltips(options) {
            var _grid;
            var _self = this;
            var _defaults = {
                maxToolTipLength: null
            };

            function init(grid) {
                options = $.extend(true, {}, _defaults, options);
                _grid = grid;
                _grid.onMouseEnter.subscribe(handleMouseEnter);
            }

            function destroy() {
                _grid.onMouseEnter.unsubscribe(handleMouseEnter);
            }

            function handleMouseEnter(e, args) {
                var cell = _grid.getCellFromEvent(e);
                if (cell) {
                    var node = _grid.getCellNode(cell.row, cell.cell);
                    if ($(node).innerWidth() < node.scrollWidth) {
                        var text = $.trim($(node).text());
                        if (options.maxToolTipLength && text.length > options.maxToolTipLength) {
                            text = text.substr(0, options.maxToolTipLength - 3) + "...";
                        }
                        $(node).attr("title", text);
                    } else {
                        $(node).attr("title", "");
                    }
                }
            }

            $.extend(this, {
                "init": init,
                "destroy": destroy
            });
        }
    })(jQuery);

    (function ($) {
        // register namespace
        $.extend(true, window, {
            "Slick": {
                "CellCopyManager": CellCopyManager
            }
        });


        function CellCopyManager() {
            var _grid;
            var _self = this;
            var _copiedRanges;

            function init(grid) {
                _grid = grid;
                _grid.onKeyDown.subscribe(handleKeyDown);
            }

            function destroy() {
                _grid.onKeyDown.unsubscribe(handleKeyDown);
            }

            function handleKeyDown(e, args) {
                var ranges;
                if (!_grid.getEditorLock().isActive()) {
                    if (e.which == $.ui.keyCode.ESCAPE) {
                        if (_copiedRanges) {
                            e.preventDefault();
                            clearCopySelection();
                            _self.onCopyCancelled.notify({ ranges: _copiedRanges });
                            _copiedRanges = null;
                        }
                    }

                    if (e.which == 67 && (e.ctrlKey || e.metaKey)) {
                        ranges = _grid.getSelectionModel().getSelectedRanges();
                        if (ranges.length != 0) {
                            e.preventDefault();
                            _copiedRanges = ranges;
                            markCopySelection(ranges);
                            _self.onCopyCells.notify({ ranges: ranges });
                        }
                    }

                    if (e.which == 86 && (e.ctrlKey || e.metaKey)) {
                        if (_copiedRanges) {
                            e.preventDefault();
                            clearCopySelection();
                            ranges = _grid.getSelectionModel().getSelectedRanges();
                            _self.onPasteCells.notify({ from: _copiedRanges, to: ranges });
                            _copiedRanges = null;
                        }
                    }
                }
            }

            function markCopySelection(ranges) {
                var columns = _grid.getColumns();
                var hash = {};
                for (var i = 0; i < ranges.length; i++) {
                    for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
                        hash[j] = {};
                        for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
                            hash[j][columns[k].id] = "copied";
                        }
                    }
                }
                _grid.setCellCssStyles("copy-manager", hash);
            }

            function clearCopySelection() {
                _grid.removeCellCssStyles("copy-manager");
            }

            $.extend(this, {
                "init": init,
                "destroy": destroy,
                "clearCopySelection": clearCopySelection,

                "onCopyCells": new Slick.Event(),
                "onCopyCancelled": new Slick.Event(),
                "onPasteCells": new Slick.Event()
            });
        }
    })(jQuery);

    (function ($) {
        $.extend(true, window, {
            Slick: {
                Data: {
                    GroupItemMetadataProvider: GroupItemMetadataProvider
                }
            }
        });


        /***
        * Provides item metadata for group (Slick.Group) and totals (Slick.Totals) rows produced by the DataView.
        * This metadata overrides the default behavior and formatting of those rows so that they appear and function
        * correctly when processed by the grid.
        *
        * This class also acts as a grid plugin providing event handlers to expand & collapse groups.
        * If "grid.registerPlugin(...)" is not called, expand & collapse will not work.
        *
        * @class GroupItemMetadataProvider
        * @module Data
        * @namespace Slick.Data
        * @constructor
        * @param options
        */
        function GroupItemMetadataProvider(options) {
            var _grid;
            var _defaults = {
                groupCssClass: "slick-group",
                totalsCssClass: "slick-group-totals",
                groupFocusable: true,
                totalsFocusable: false,
                toggleCssClass: "slick-group-toggle",
                toggleExpandedCssClass: "expanded",
                toggleCollapsedCssClass: "collapsed",
                enableExpandCollapse: true
            };

            options = $.extend(true, {}, _defaults, options);

            function defaultGroupCellFormatter(row, cell, value, columnDef, item) {
                if (!options.enableExpandCollapse) {
                    return item.title;
                }

                return "<span class='" + options.toggleCssClass + " " +
          (item.collapsed ? options.toggleCollapsedCssClass : options.toggleExpandedCssClass) +
          "'></span>" + item.title;

            }

            function defaultTotalsCellFormatter(row, cell, value, columnDef, item) {
                return (columnDef.groupTotalsFormatter && columnDef.groupTotalsFormatter(item, columnDef)) || "";
            }


            function init(grid) {
                _grid = grid;
                _grid.onClick.subscribe(handleGridClick);
                _grid.onKeyDown.subscribe(handleGridKeyDown);

            }

            function destroy() {
                if (_grid) {
                    _grid.onClick.unsubscribe(handleGridClick);
                    _grid.onKeyDown.unsubscribe(handleGridKeyDown);
                }
            }

            function handleGridClick(e, args) {
                var item = this.getDataItem(args.row);
                if (item && item instanceof Slick.Group && $(e.target).hasClass(options.toggleCssClass)) {
                    if (item.collapsed) {
                        this.getData().expandGroup(item.value);
                    }
                    else {
                        this.getData().collapseGroup(item.value);
                    }

                    e.stopImmediatePropagation();
                    e.preventDefault();
                }
            }

            // TODO:  add -/+ handling
            function handleGridKeyDown(e, args) {
                if (options.enableExpandCollapse && (e.which == $.ui.keyCode.SPACE)) {
                    var activeCell = this.getActiveCell();
                    if (activeCell) {
                        var item = this.getDataItem(activeCell.row);
                        if (item && item instanceof Slick.Group) {
                            if (item.collapsed) {
                                this.getData().expandGroup(item.value);
                            }
                            else {
                                this.getData().collapseGroup(item.value);
                            }

                            e.stopImmediatePropagation();
                            e.preventDefault();
                        }
                    }
                }
            }

            function getGroupRowMetadata(item) {
                return {
                    selectable: false,
                    focusable: options.groupFocusable,
                    cssClasses: options.groupCssClass,
                    columns: {
                        0: {
                            colspan: "*",
                            formatter: defaultGroupCellFormatter,
                            editor: null
                        }
                    }
                };
            }

            function getTotalsRowMetadata(item) {
                return {
                    selectable: false,
                    focusable: options.totalsFocusable,
                    cssClasses: options.totalsCssClass,
                    formatter: defaultTotalsCellFormatter,
                    editor: null
                };
            }


            return {
                "init": init,
                "destroy": destroy,
                "getGroupRowMetadata": getGroupRowMetadata,
                "getTotalsRowMetadata": getTotalsRowMetadata
            };
        }
    })(jQuery);


    /***
    * A plugin to add custom buttons to column headers.
    *
    * USAGE:
    *
    * Add the plugin .js & .css files and register it with the grid.
    *
    * To specify a custom button in a column header, extend the column definition like so:
    *
    *   var columns = [
    *     {
    *       id: 'myColumn',
    *       name: 'My column',
    *
    *       // This is the relevant part
    *       header: {
    *          buttons: [
    *              {
    *                // button options
    *              },
    *              {
    *                // button options
    *              }
    *          ]
    *       }
    *     }
    *   ];
    *
    * Available button options:
    *    cssClass:     CSS class to add to the button.
    *    image:        Relative button image path.
    *    tooltip:      Button tooltip.
    *    showOnHover:  Only show the button on hover.
    *    handler:      Button click handler.
    *    command:      A command identifier to be passed to the onCommand event handlers.
    *
    * The plugin exposes the following events:
    *    onCommand:    Fired on button click for buttons with 'command' specified.
    *        Event args:
    *            grid:     Reference to the grid.
    *            column:   Column definition.
    *            command:  Button command identified.
    *            button:   Button options.  Note that you can change the button options in your
    *                      event handler, and the column header will be automatically updated to
    *                      reflect them.  This is useful if you want to implement something like a
    *                      toggle button.
    *
    *
    * @param options {Object} Options:
    *    buttonCssClass:   a CSS class to use for buttons (default 'slick-header-button')
    * @class Slick.Plugins.HeaderButtons
    * @constructor
    */
    function HeaderButtons(options) {
        var _grid;
        var _self = this;
        var _handler = new Slick.EventHandler();
        var _defaults = {
            buttonCssClass: "slick-header-button"
        };


        function init(grid) {
            options = $.extend(true, {}, _defaults, options);
            _grid = grid;
            _handler
        .subscribe(_grid.onHeaderRendered, handleHeaderRendered)
        .subscribe(_grid.onBeforeHeaderDestroy, handleBeforeHeaderDestroy);

            // Force the grid to re-render the header now that the events are hooked up.
            _grid.setColumns(_grid.getColumns());
        }


        function destroy() {
            _handler.unsubscribeAll();
        }


        function handleHeaderRendered(e, args) {
            var column = args.column;

            if (column.header && column.header.buttons) {
                // Append buttons in reverse order since they are floated to the right.
                var i = column.header.buttons.length;
                while (i--) {
                    var button = column.header.buttons[i];
                    var btn = $("<div></div>")
            .addClass(options.buttonCssClass)
            .data("column", column)
            .data("button", button);

                    if (button.showOnHover) {
                        btn.addClass("slick-header-button-hidden");
                    }

                    if (button.image) {
                        btn.css("backgroundImage", "url(" + button.image + ")");
                    }

                    if (button.cssClass) {
                        btn.addClass(button.cssClass);
                    }

                    if (button.tooltip) {
                        btn.attr("title", button.tooltip);
                    }

                    if (button.command) {
                        btn.data("command", button.command);
                    }

                    if (button.handler) {
                        btn.bind("click", button.handler);
                    }

                    btn
            .bind("click", handleButtonClick)
            .appendTo(args.headerNode);
                }
            }
        }


        function handleBeforeHeaderDestroy(e, args) {
            var column = args.column;

            if (column.header && column.header.buttons) {
                // Removing buttons via jQuery will also clean up any event handlers and data.
                // NOTE: If you attach event handlers directly or using a different framework,
                //       you must also clean them up here to avoid memory leaks.
                $(args.headerNode).find("." + options.buttonCssClass).remove();
            }
        }


        function handleButtonClick(e) {
            var command = $(this).data("command");
            var columnDef = $(this).data("column");
            var button = $(this).data("button");

            if (command != null) {
                _self.onCommand.notify({
                    "grid": _grid,
                    "column": columnDef,
                    "command": command,
                    "button": button
                }, e, _self);

                // Update the header in case the user updated the button definition in the handler.
                _grid.updateColumnHeader(columnDef.id);
            }

            // Stop propagation so that it doesn't register as a header click event.
            e.preventDefault();
            e.stopPropagation();
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "onCommand": new Slick.Event()
        });
    }
})(jQuery);

(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "Plugins": {
                "HeaderMenu": HeaderMenu
            }
        }
    });


    /***
    * A plugin to add drop-down menus to column headers.
    *
    * USAGE:
    *
    * Add the plugin .js & .css files and register it with the grid.
    *
    * To specify a menu in a column header, extend the column definition like so:
    *
    *   var columns = [
    *     {
    *       id: 'myColumn',
    *       name: 'My column',
    *
    *       // This is the relevant part
    *       header: {
    *          menu: {
    *              items: [
    *                {
    *                  // menu item options
    *                },
    *                {
    *                  // menu item options
    *                }
    *              ]
    *          }
    *       }
    *     }
    *   ];
    *
    *
    * Available menu options:
    *    tooltip:      Menu button tooltip.
    *
    *
    * Available menu item options:
    *    title:        Menu item text.
    *    disabled:     Whether the item is disabled.
    *    tooltip:      Item tooltip.
    *    command:      A command identifier to be passed to the onCommand event handlers.
    *    iconCssClass: A CSS class to be added to the menu item icon.
    *    iconImage:    A url to the icon image.
    *
    *
    * The plugin exposes the following events:
    *    onBeforeMenuShow:   Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
    *        Event args:
    *            grid:     Reference to the grid.
    *            column:   Column definition.
    *            menu:     Menu options.  Note that you can change the menu items here.
    *
    *    onCommand:    Fired on menu item click for buttons with 'command' specified.
    *        Event args:
    *            grid:     Reference to the grid.
    *            column:   Column definition.
    *            command:  Button command identified.
    *            button:   Button options.  Note that you can change the button options in your
    *                      event handler, and the column header will be automatically updated to
    *                      reflect them.  This is useful if you want to implement something like a
    *                      toggle button.
    *
    *
    * @param options {Object} Options:
    *    buttonCssClass:   an extra CSS class to add to the menu button
    *    buttonImage:      a url to the menu button image (default '../images/down.gif')
    * @class Slick.Plugins.HeaderButtons
    * @constructor
    */
    function HeaderMenu(options) {
        var _grid;
        var _self = this;
        var _handler = new Slick.EventHandler();
        var _defaults = {
            buttonCssClass: null,
            buttonImage: "../images/down.gif"
        };
        var $menu;
        var $activeHeaderColumn;


        function init(grid) {
            options = $.extend(true, {}, _defaults, options);
            _grid = grid;
            _handler
        .subscribe(_grid.onHeaderRendered, handleHeaderRendered)
        .subscribe(_grid.onBeforeHeaderDestroy, handleBeforeHeaderDestroy);

            // Force the grid to re-render the header now that the events are hooked up.
            _grid.setColumns(_grid.getColumns());

            // Hide the menu on outside click.
            $(document.body).bind("mousedown", handleBodyMouseDown);
        }


        function destroy() {
            _handler.unsubscribeAll();
            $(document.body).unbind("mousedown", handleBodyMouseDown);
        }


        function handleBodyMouseDown(e) {
            if ($menu && !$.contains($menu[0], e.target)) {
                hideMenu();
            }
        }


        function hideMenu() {
            if ($menu) {
                $menu.remove();
                $menu = null;
                $activeHeaderColumn
          .removeClass("slick-header-column-active");
            }
        }

        function handleHeaderRendered(e, args) {
            var column = args.column;
            var menu = column.header && column.header.menu;

            if (menu) {
                var $el = $("<div></div>")
          .addClass("slick-header-menubutton")
          .data("column", column)
          .data("menu", menu);

                if (options.buttonCssClass) {
                    $el.addClass(options.buttonCssClass);
                }

                if (options.buttonImage) {
                    $el.css("background-image", "url(" + options.buttonImage + ")");
                }

                if (menu.tooltip) {
                    $el.attr("title", menu.tooltip);
                }

                $el
          .bind("click", showMenu)
          .appendTo(args.headerNode);
            }
        }


        function handleBeforeHeaderDestroy(e, args) {
            var column = args.column;

            if (column.header && column.header.menu) {
                $(args.headerNode).find(".slick-header-menubutton").remove();
            }
        }


        function showMenu(e) {
            var $menuButton = $(this);
            var menu = $menuButton.data("menu");
            var columnDef = $menuButton.data("column");

            // Let the user modify the menu or cancel altogether,
            // or provide alternative menu implementation.
            if (_self.onBeforeMenuShow.notify({
                "grid": _grid,
                "column": columnDef,
                "menu": menu
            }, e, _self) == false) {
                return;
            }


            if (!$menu) {
                $menu = $("<div class='slick-header-menu'></div>")
          .appendTo(document.body);
            }
            $menu.empty();


            // Construct the menu items.
            for (var i = 0; i < menu.items.length; i++) {
                var item = menu.items[i];

                var $li = $("<div class='slick-header-menuitem'></div>")
          .data("command", item.command || '')
          .data("column", columnDef)
          .data("item", item)
          .bind("click", handleMenuItemClick)
          .appendTo($menu);

                if (item.disabled) {
                    $li.addClass("slick-header-menuitem-disabled");
                }

                if (item.tooltip) {
                    $li.attr("title", item.tooltip);
                }

                var $icon = $("<div class='slick-header-menuicon'></div>")
          .appendTo($li);

                if (item.iconCssClass) {
                    $icon.addClass(item.iconCssClass);
                }

                if (item.iconImage) {
                    $icon.css("background-image", "url(" + item.iconImage + ")");
                }

                $("<span class='slick-header-menucontent'></span>")
          .text(item.title)
          .appendTo($li);
            }


            // Position the menu.
            $menu
        .css("top", $(this).offset().top + $(this).height())
        .css("left", $(this).offset().left);


            // Mark the header as active to keep the highlighting.
            $activeHeaderColumn = $menuButton.closest(".slick-header-column");
            $activeHeaderColumn
        .addClass("slick-header-column-active");
        }


        function handleMenuItemClick(e) {
            var command = $(this).data("command");
            var columnDef = $(this).data("column");
            var item = $(this).data("item");

            if (item.disabled) {
                return;
            }

            hideMenu();

            if (command != null && command != '') {
                _self.onCommand.notify({
                    "grid": _grid,
                    "column": columnDef,
                    "command": command,
                    "item": item
                }, e, _self);
            }

            // Stop propagation so that it doesn't register as a header click event.
            e.preventDefault();
            e.stopPropagation();
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "onBeforeMenuShow": new Slick.Event(),
            "onCommand": new Slick.Event()
        });
    }
})(jQuery);


(function ($) {
    function SlickGridPager(dataView, grid, $container) {
        var $status;

        function init() {
            dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
                updatePager(pagingInfo);
            });

            constructPagerUI();
            updatePager(dataView.getPagingInfo());
        }

        function getNavState() {
            var cannotLeaveEditMode = !Slick.GlobalEditorLock.commitCurrentEdit();
            var pagingInfo = dataView.getPagingInfo();
            var lastPage = pagingInfo.totalPages - 1;

            return {
                canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
                canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum != lastPage,
                canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
                canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum < lastPage,
                pagingInfo: pagingInfo
            }
        }

        function setPageSize(n) {
            dataView.setRefreshHints({
                isFilterUnchanged: true
            });
            dataView.setPagingOptions({ pageSize: n });
        }

        function gotoFirst() {
            if (getNavState().canGotoFirst) {
                dataView.setPagingOptions({ pageNum: 0 });
            }
        }

        function gotoLast() {
            var state = getNavState();
            if (state.canGotoLast) {
                dataView.setPagingOptions({ pageNum: state.pagingInfo.totalPages - 1 });
            }
        }

        function gotoPrev() {
            var state = getNavState();
            if (state.canGotoPrev) {
                dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum - 1 });
            }
        }

        function gotoNext() {
            var state = getNavState();
            if (state.canGotoNext) {
                dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum + 1 });
            }
        }

        function constructPagerUI() {
            $container.empty();

            var $nav = $("<span class='slick-pager-nav' />").appendTo($container);
            var $settings = $("<span class='slick-pager-settings' />").appendTo($container);
            $status = $("<span class='slick-pager-status' />").appendTo($container);

            $settings
          .append("<span class='slick-pager-settings-expanded' style='display:none'>" + i18n.rlimport.SHOW + ": <a data=0>" + i18n.rlimport.ALL + "</a><a data='-1'>" + i18n.rlimport.AUTO + "</a><a data=25>25</a><a data=50>50</a><a data=100>100</a></span>");

            $settings.find("a[data]").click(function (e) {
                var pagesize = $(e.target).attr("data");
                if (pagesize != undefined) {
                    if (pagesize == -1) {
                        var vp = grid.getViewport();
                        setPageSize(vp.bottom - vp.top);
                    } else {
                        setPageSize(parseInt(pagesize));
                    }
                }
            });

            var icon_prefix = "<span class='ui-state-default ui-corner-all ui-icon-container'><span class='ui-icon ";
            var icon_suffix = "' /></span>";

            $(icon_prefix + "ui-icon-lightbulb" + icon_suffix)
          .click(function () {
              $(".slick-pager-settings-expanded").toggle()
          })
          .appendTo($settings);

            $(icon_prefix + "ui-icon-seek-first" + icon_suffix)
          .click(gotoFirst)
          .appendTo($nav);

            $(icon_prefix + "ui-icon-seek-prev" + icon_suffix)
          .click(gotoPrev)
          .appendTo($nav);

            $(icon_prefix + "ui-icon-seek-next" + icon_suffix)
          .click(gotoNext)
          .appendTo($nav);

            $(icon_prefix + "ui-icon-seek-end" + icon_suffix)
          .click(gotoLast)
          .appendTo($nav);

            $container.find(".ui-icon-container")
          .hover(function () {
              $(this).toggleClass("ui-state-hover");
          });

            $container.children().wrapAll("<div class='slick-pager' />");
        }


        function updatePager(pagingInfo) {
            var state = getNavState();

            $container.find(".slick-pager-nav span").removeClass("ui-state-disabled");
            if (!state.canGotoFirst) {
                $container.find(".ui-icon-seek-first").addClass("ui-state-disabled");
            }
            if (!state.canGotoLast) {
                $container.find(".ui-icon-seek-end").addClass("ui-state-disabled");
            }
            if (!state.canGotoNext) {
                $container.find(".ui-icon-seek-next").addClass("ui-state-disabled");
            }
            if (!state.canGotoPrev) {
                $container.find(".ui-icon-seek-prev").addClass("ui-state-disabled");
            }

            if (pagingInfo.pageSize == 0) {
				var showingAllText = i18n.rlimport.replace("{6}",pagingInfo.totalRows);
                $status.text(showingAllText);
            } else {
				var showPageText = i18n.rlimport.SHOWINGPAGE.replace("{4}",(pagingInfo.pageNum + 1));
				showPageText = showPageText.replace("{5}",pagingInfo.totalPages);
                $status.text(showPageText);
            }
        }

        init();
    }

    // Slick.Controls.Pager
    $.extend(true, window, { Slick: { Controls: { Pager: SlickGridPager}} });
})(jQuery);


(function ($) {
    function SlickColumnPicker(columns, grid, options) {
        var $menu;
        var columnCheckboxes;

        var defaults = {
            fadeSpeed: 250
        };

        function init() {
            grid.onHeaderContextMenu.subscribe(handleHeaderContextMenu);
            options = $.extend({}, defaults, options);

            $menu = $("<span class='slick-columnpicker' style='display:none;position:absolute;z-index:20;' />").appendTo(document.body);

            $menu.bind("mouseleave", function (e) {
                $(this).fadeOut(options.fadeSpeed)
            });
            $menu.bind("click", updateColumn);

        }

        function handleHeaderContextMenu(e, args) {
            e.preventDefault();
            $menu.empty();
            columnCheckboxes = [];

            var $li, $input;
            for (var i = 0; i < columns.length; i++) {
                $li = $("<li />").appendTo($menu);
                $input = $("<input type='checkbox' />").data("column-id", columns[i].id);
                columnCheckboxes.push($input);

                if (grid.getColumnIndex(columns[i].id) != null) {
                    $input.attr("checked", "checked");
                }

                $("<label />")
            .text(columns[i].name)
            .prepend($input)
            .appendTo($li);
            }

            $("<hr/>").appendTo($menu);
            $li = $("<li />").appendTo($menu);
            $input = $("<input type='checkbox' />").data("option", "autoresize");
            $("<label />")
          .text("Force fit columns")
          .prepend($input)
          .appendTo($li);
            if (grid.getOptions().forceFitColumns) {
                $input.attr("checked", "checked");
            }

            $li = $("<li />").appendTo($menu);
            $input = $("<input type='checkbox' />").data("option", "syncresize");
            $("<label />")
          .text("Synchronous resize")
          .prepend($input)
          .appendTo($li);
            if (grid.getOptions().syncColumnCellResize) {
                $input.attr("checked", "checked");
            }

            $menu
          .css("top", e.pageY - 10)
          .css("left", e.pageX - 10)
          .fadeIn(options.fadeSpeed);
        }

        function updateColumn(e) {
            if ($(e.target).data("option") == "autoresize") {
                if (e.target.checked) {
                    grid.setOptions({ forceFitColumns: true });
                    grid.autosizeColumns();
                } else {
                    grid.setOptions({ forceFitColumns: false });
                }
                return;
            }

            if ($(e.target).data("option") == "syncresize") {
                if (e.target.checked) {
                    grid.setOptions({ syncColumnCellResize: true });
                } else {
                    grid.setOptions({ syncColumnCellResize: false });
                }
                return;
            }

            if ($(e.target).is(":checkbox")) {
                var visibleColumns = [];
                $.each(columnCheckboxes, function (i, e) {
                    if ($(this).is(":checked")) {
                        visibleColumns.push(columns[i]);
                    }
                });

                if (!visibleColumns.length) {
                    $(e.target).attr("checked", "checked");
                    return;
                }

                grid.setColumns(visibleColumns);
            }
        }

        init();
    }

    // Slick.Controls.ColumnPicker
    $.extend(true, window, { Slick: { Controls: { ColumnPicker: SlickColumnPicker}} });
})(jQuery);


/*END Slick Grid*/
/*Start CSV Parse*/

/**
* jQuery JSON Plugin
* version: 2.3 (2011-09-17)
*
* This document is licensed as free software under the terms of the
* MIT License: http://www.opensource.org/licenses/mit-license.php
*
* Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
* website's http://www.json.org/json2.js, which proclaims:
* "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
* I uphold.
*
* It is also influenced heavily by MochiKit's serializeJSON, which is
* copyrighted 2005 by Bob Ippolito.
*/

(function ($) {

    var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
		meta = {
		    '\b': '\\b',
		    '\t': '\\t',
		    '\n': '\\n',
		    '\f': '\\f',
		    '\r': '\\r',
		    '"': '\\"',
		    '\\': '\\\\'
		};

    /**
    * jQuery.toJSON
    * Converts the given argument into a JSON respresentation.
    *
    * @param o {Mixed} The json-serializble *thing* to be converted
    *
    * If an object has a toJSON prototype, that will be used to get the representation.
    * Non-integer/string keys are skipped in the object, as are keys that point to a
    * function.
    *
    */
    $.toJSON = typeof JSON === 'object' && JSON.stringify
		? JSON.stringify
		: function (o) {

		    if (o === null) {
		        return 'null';
		    }

		    var type = typeof o;

		    if (type === 'undefined') {
		        return undefined;
		    }
		    if (type === 'number' || type === 'boolean') {
		        return '' + o;
		    }
		    if (type === 'string') {
		        return $.quoteString(o);
		    }
		    if (type === 'object') {
		        if (typeof o.toJSON === 'function') {
		            return $.toJSON(o.toJSON());
		        }
		        if (o.constructor === Date) {
		            var month = o.getUTCMonth() + 1,
					day = o.getUTCDate(),
					year = o.getUTCFullYear(),
					hours = o.getUTCHours(),
					minutes = o.getUTCMinutes(),
					seconds = o.getUTCSeconds(),
					milli = o.getUTCMilliseconds();

		            if (month < 10) {
		                month = '0' + month;
		            }
		            if (day < 10) {
		                day = '0' + day;
		            }
		            if (hours < 10) {
		                hours = '0' + hours;
		            }
		            if (minutes < 10) {
		                minutes = '0' + minutes;
		            }
		            if (seconds < 10) {
		                seconds = '0' + seconds;
		            }
		            if (milli < 100) {
		                milli = '0' + milli;
		            }
		            if (milli < 10) {
		                milli = '0' + milli;
		            }
		            return '"' + year + '-' + month + '-' + day + 'T' +
					hours + ':' + minutes + ':' + seconds +
					'.' + milli + 'Z"';
		        }
		        if (o.constructor === Array) {
		            var ret = [];
		            for (var i = 0; i < o.length; i++) {
		                ret.push($.toJSON(o[i]) || 'null');
		            }
		            return '[' + ret.join(',') + ']';
		        }
		        var name,
				val,
				pairs = [];
		        for (var k in o) {
		            type = typeof k;
		            if (type === 'number') {
		                name = '"' + k + '"';
		            } else if (type === 'string') {
		                name = $.quoteString(k);
		            } else {
		                // Keys must be numerical or string. Skip others
		                continue;
		            }
		            type = typeof o[k];

		            if (type === 'function' || type === 'undefined') {
		                // Invalid values like these return undefined
		                // from toJSON, however those object members
		                // shouldn't be included in the JSON string at all.
		                continue;
		            }
		            val = $.toJSON(o[k]);
		            pairs.push(name + ':' + val);
		        }
		        return '{' + pairs.join(',') + '}';
		    }
		};

    /**
    * jQuery.evalJSON
    * Evaluates a given piece of json source.
    *
    * @param src {String}
    */
    $.evalJSON = typeof JSON === 'object' && json_parse
		? json_parse
		: function (src) {
		    return eval('(' + src + ')');
		};

    /**
    * jQuery.secureEvalJSON
    * Evals JSON in a way that is *more* secure.
    *
    * @param src {String}
    */
    $.secureEvalJSON = typeof JSON === 'object' && json_parse
		? json_parse
		: function (src) {

		    var filtered =
			src
			.replace(/\\["\\\/bfnrtu]/g, '@')
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
			.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

		    if (/^[\],:{}\s]*$/.test(filtered)) {
		        return eval('(' + src + ')');
		    } else {
		        throw new SyntaxError('Error parsing JSON, source is not valid.');
		    }
		};

    /**
    * jQuery.quoteString
    * Returns a string-repr of a string, escaping quotes intelligently.
    * Mostly a support function for toJSON.
    * Examples:
    * >>> jQuery.quoteString('apple')
    * "apple"
    *
    * >>> jQuery.quoteString('"Where are we going?", she asked.')
    * "\"Where are we going?\", she asked."
    */
    $.quoteString = function (string) {
        if (string.match(escapeable)) {
            return '"' + string.replace(escapeable, function (a) {
                var c = meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };

})(jQuery);
/**
 * jQuery-csv (jQuery Plugin)
 * version: 0.62 (2012-09-05)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * This plugin was originally designed to assist in parsing CSV files loaded
 * from client-side javascript. It's influenced by jQuery.json and the original
 * core RegEx comes directly from the following answer posted by a
 * StackOverflow.com user named Ridgerunner.
 * Source:
 * - http://stackoverflow.com/q/8493195/290340
 *
 * For legal purposes I'll include the "NO WARRANTY EXPRESSED OR IMPLIED.
 * USE AT YOUR OWN RISK.". Which, in 'layman's terms' means, by using this
 * library you are accepting responsibility if it breaks your code.
 *
 * Legal jargon aside, I will do my best to provide a useful and stable core
 * that can effectively be built on.
 *
 * Copyrighted 2012 by Evan Plaice.
 */

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

(function( $ ) {
  /**
   * jQuery.csv.defaults
   * Encapsulates the method paramater defaults for the CSV plugin module.
   */
  $.csvDefaults = {
    separator:',',
    delimiter:'"',
    escaper:'"',
    skip:0,
    headerLine:1,
    dataLine:2
  };

  /**
   * jQuery.csvEntry2Array(csv)
   * Converts a CSV string to a javascript array.
   *
   * @param {Array} csv The string containing the CSV data.
   * @param {Object} [meta] The dictionary where the meta variables (ie separator, delimiter, escaper) are defined.
   * @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
   * @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
   * @param {Character} [escaper] An override for the escaper character. Defaults to a a double-quote(").
   *
   * This method deals with simple CSV strings only. It's useful if you only
   * need to parse a single entry. If you need to parse more than one line,
   * use $.csv2Array instead.
   */
  $.csvEntry2Array = function(csv, meta) {
    var meta = (meta !== undefined ? meta : {});
    var separator = 'separator' in meta ? meta.separator : $.csvDefaults.separator;
    var delimiter = 'delimiter' in meta ? meta.delimiter : $.csvDefaults.delimiter;
    var escaper = 'escaper' in meta ? meta.escaper : $.csvDefaults.escaper;

    separator = RegExp.escape(separator);
    delimiter = RegExp.escape(delimiter);
    escaper = RegExp.escape(escaper);

    // build the CSV validator regex
    var reValid = /^\s*(?:Y[^YZ]*(?:ZY[^YZ]*)*Y|[^XYZ\s]*(?:\s+[^XYZ\s]+)*)\s*(?:X\s*(?:Y[^YZ]*(?:ZY[^YZ]*)*Y|[^XYZ\s]*(?:\s+[^XYZ\s]+)*)\s*)*$/;
    var reValidSrc = reValid.source;    
    reValidSrc = reValidSrc.replace(/X/g, separator);
    reValidSrc = reValidSrc.replace(/Y/g, delimiter);
    reValidSrc = reValidSrc.replace(/Z/g, escaper);
    reValid = RegExp(reValidSrc);

    // build the CSV line parser regex
    var reValue = /(?!\s*$)\s*(?:Y([^YZ]*(?:ZY[^YZ]*)*)Y|([^XYZ\s]*(?:\s+[^XYZ\s]+)*))\s*(?:X|$)/;
    var reValueSrc = reValue.source;
    reValueSrc = reValueSrc.replace(/X/g, separator);
    reValueSrc = reValueSrc.replace(/Y/g, delimiter);
    reValueSrc = reValueSrc.replace(/Z/g, escaper);
    reValue = RegExp(reValueSrc, 'g');

    if (csv === "") {
        return [""];
    }
    // Return NULL if input string is not well formed CSV string.
    if (!reValid.test(csv)) {
      return null;
    }

    // "Walk" the string using replace with callback.
    var output = [];
    csv.replace(reValue, function(m0, m1, m2) {
      // Remove backslash from any delimiters in the value
    if(typeof m1 === 'string' && m1.length) {        // Fix: evaluates to false for both empty strings and undefined
        var reDelimiterUnescape = /ED/;
        var reDelimiterUnescapeSrc = reDelimiterUnescape.source;
        reDelimiterUnescapeSrc = reDelimiterUnescapeSrc.replace(/E/, escaper);
        reDelimiterUnescapeSrc = reDelimiterUnescapeSrc.replace(/D/, delimiter);
        reDelimiterUnescape = RegExp(reDelimiterUnescapeSrc, 'g');
        output.push(m1.replace(reDelimiterUnescape, delimiter));
      } else if(m2 !== undefined) {
        output.push(m2);
      }
      return '';
    });

    // Handle special case of empty last value.
    var reEmptyLast = /S\s*$/;
    reEmptyLast = RegExp(reEmptyLast.source.replace(/S/, separator));
    if (reEmptyLast.test(csv)) {
      output.push('');
    }

    return output;
  };

  /**
   * jQuery.array2CSVEntry(array)
   * Converts a javascript array to a CSV String.
   *
   * @param {Array} array The array containing the CSV data.
   * @param {Object} [meta] The dictionary where the meta variables (ie separator, delimiter, escaper) are defined.
   * @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
   * @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
   * @param {Character} [escaper] An override for the escaper character. Defaults to a a double-quote(").
   *
   * This method deals with simple CSV arrays only. It's useful if you only
   * need to convert a single entry. If you need to convert more than one line,
   * use $.csv2Array instead.
   */
  $.array2CSVEntry = function(array, meta) {
    var meta = (meta !== undefined ? meta : {});
    var separator = 'separator' in meta ? meta.separator : $.csvDefaults.separator;
    var delimiter = 'delimiter' in meta ? meta.delimiter : $.csvDefaults.delimiter;
    var escaper = 'escaper' in meta ? meta.escaper : $.csvDefaults.escaper;

    var output = [];
    for(i in array) {
      output.push(array[i]);
    }

    return output;
  };

  /**
   * jQuery.csv2Array(csv)
   * Converts a CSV string to a javascript array.
   *
   * @param {String} csv The string containing the raw CSV data.
   * @param {Object} [meta] The dictionary where the meta variables (ie separator, delimiter, escaper, skip) are defined.
   * @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
   * @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
   * @param {Character} [escaper] An override for the escaper character. Defaults to a a double-quote(").
   * @param {Integer} [skip] The number of lines that need to be skipped before the parser starts. Defaults to 0.
   *
   * This method deals with multi-line CSV. The breakdown is simple. The first
   * dimension of the array represents the line (or entry/row) while the second
   * dimension contains the values (or values/columns).
   */
  $.csv2Array = function(csv, meta) {
    var meta = (meta !== undefined ? meta : {});
    var separator = 'separator' in meta ? meta.separator : $.csvDefaults.separator;
    var delimiter = 'delimiter' in meta ? meta.delimiter : $.csvDefaults.delimiter;
    var escaper = 'escaper' in meta ? meta.escaper : $.csvDefaults.escaper;
    var skip = 'skip' in meta ? meta.skip : $.csvDefaults.skip;

// Experimental line splitter, used to skip newline chars contained in entries 
//    var StateMachine = {
//      state:'',
//      char:'',
//      prevChar:'',
//      quoted:false,
//      init: function(separator, delimiter, escaper) {
//        this.separator = separator;        
//        this.delimiter = delimiter;
//        this.escaper = escaper;
//      },
//      input: function(char) {
//        this.char = char;
//        if(this.quoted && char == this.delimiter) {
//          this.quoted = false;
//          this.increment();
//          return;
//        }
//        if(!this.quoted) {
//          if(char == '\r\n' || char == '\r' || char == '\n' ) {
//            if(char != '') {
//              this.flush();
//            }
//          }
//          if(char == this.delimiter) {
//            if(this.prevChar != this.escaper) {
//              this.quoted = true;
//              this.increment();
//              return;
//            }
//          } else {
//            this.increment();
//            return;
//          }
//        }
//      },
//      increment: function() {
//        this.state += this.char;
//        this.char = this.prevChar;
//      },
//      flush: function() {
//        console.log(this.state);
//        this.process();
//        this.state = '';
//        this.char = '';
//        this.prevChar = '';
//        this.quoted = false;
//      },
//      process: function() {
//        var entry = $.csvEntry2Array(this.state, {
//          delimiter: this.delimiter,
//          separator: this.separator,
//          escaper: this.escaper,
//        });
//        output.push(entry);
//      }
//    }

//    var output = [];
//    StateMachine.init(separator, delimiter, escaper);
//    var i = csv.length;
//    while (i--) {
//      StateMachine.input(csv[i]);
//    }

//    // process by line
//    var reLineBreak = /((?:"(?:\\.|[^"\\])*"|[^/"\\,]*)*[\r](?:[\n]))/g;
//    //var reLineBreak = /(.*[\r](?:[\n]))|(.[^\r](?:[^\n])*)/g; // good shit
//    reLineBreak = RegExp(reLineBreak.source.replace(/D/g, delimiter), 'g');
//    var output = [];
//    csv.replace(reLineBreak, function(m0) {
//      if(m0 !== undefined) {
//        var line = m0;
//        // process each value
//        var entry = $.csvEntry2Array(line, {
//          delimiter: delimiter,
//          separator: separator,
//          escaper: escaper,
//        });
//        output.push(entry);
//      }
//    });

    var output = [];
    var lines = csv.split(/\r\n|\r|\n/g);
    for(var i in lines) {
      if(i < skip) {
        continue;
      }
      // process each value
      var line = $.csvEntry2Array(lines[i], {
        delimiter: delimiter,
        separator: separator,
        escaper: escaper
      });
      output.push(line);
    }

    return output;
  };

  /**
   * jQuery.array2CSV(array)
   * Converts a CSV array to a javascript string.
   *
   * @param {Array} csv The array containing the CSV data.
   * @param {Object} [meta] The dictionary where the meta variables (ie separator, delimiter, escaper, skip) are defined.
   * @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
   * @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
   * @param {Character} [escaper] An override for the escaper character. Defaults to a a double-quote(").
   * @param {Integer} [skip] The number of lines that need to be skipped before the parser starts. Defaults to 0.
   *
   * This method dimensional multi-line CSV arrays. The breakdown is simple.
   * The first dimension of the array gets mapped to rows, the second dimension
   * gets mapped to data within those rows.
   */
  //$.array2CSV = function(array, meta) {
  //  alert('Not implemented yet'); // TODO: implement this
  //};

  /**
   * jQuery.csv2Dictionary(csv)
   * Converts a CSV string to a javascript dictionary.
   * @param {String} csv The string containing the raw CSV data.
   * @param {Object} [meta] The dictionary where the meta variables (ie separator, delimiter, escaper, headerLine, dataLine) are defined.
   * @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
   * @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
   * @param {Character} [escaper] An override for the escaper character. Defaults to a a double-quote(").
   * @param {Integer} [headerLine] The line in the file that contains the header data. Defaults to 1 (1-based counting).
   * @param {Integer} [dataLine] The line where the data values start. Defaults to 2 (1-based counting).
   *
   * This method deals with multi-line CSV strings. Where the headers line is
   * used as the key for each value per entry.
   */
  $.csv2Dictionary = function(csv, meta) {
    var meta = (meta !== undefined ? meta : {});
    var separator = 'separator' in meta ? meta.separator : $.csvDefaults.separator;
    var delimiter = 'delimiter' in meta ? meta.delimiter : $.csvDefaults.delimiter;
    var escaper = 'escaper' in meta ? meta.escaper : $.csvDefaults.escaper;
    var headerLine = 'headerLine' in meta ? meta.headerLine : $.csvDefaults.headerLine;
    var dataLine = 'dataLine' in meta ? meta.dataLine : $.csvDefaults.dataLine;

    // process data into lines
    var lines = csv.split(/\r\n|\r|\n/g);
    // fetch the headers
    var headers = $.csvEntry2Array(lines[(headerLine - 1)]);
    // process the data
    var output = [];
    for(var i in lines) {
      if(i < (dataLine - 1)) {
        continue;
      }
      // process each value
      var line = $.csvEntry2Array(lines[i], {
        delimiter: delimiter,
        separator: separator,
        escaper: escaper
      });
      var lineDict = {};
      for(var j in headers) {
        lineDict[headers[j]] = line[j];
      }
      output.push(lineDict);
    }

    return output;
  };

  /**
   * jQuery.dictionary2CSV(dictionary)
   * Converts a javascript dictionary to a CSV string.
   * @param {Object} dictionary The dictionary containing the CSV data.
   * @param {Object} [meta] The dictionary where the meta variables (ie separator, delimiter, escaper, headerLine, dataLine) are defined.
   * @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
   * @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
   * @param {Character} [escaper] An override for the escaper character. Defaults to a a double-quote(").
   * @param {Integer} [headerLine] The line in the file that contains the header data. Defaults to 1 (1-based counting).
   * @param {Integer} [dataLine] The line where the data values start. Defaults to 2 (1-based counting).
   *
   * This method generates a CSV file from a javascript dictionary structure.
   * It starts by detecting the headers and adding them as the first line of
   * the CSV file, followed by a structured dump of the data.
   */
  //$.dictionary2CSV = function(dictionary, meta) {
  //  alert('Not implemented yet'); // TODO: implement this
  //};

})( jQuery );


/*END CSV Parse*/
Object.keys = Object.keys || (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{ toString: null}.propertyIsEnumerable("toString"),
        DontEnums = [
            'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty',
            'isPrototypeOf', 'propertyIsEnumerable', 'constructor'
        ],
        DontEnumsLength = DontEnums.length;

    return function (o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");

        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name))
                result.push(name);
        }

        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }
        }

        return result;
    };
})();



/*Custom Scripting*/
//Start Search Object Function
function findInObject(dataSet, findMe, firstMatchOnly) { // Find a specific data
    var mSearch = function (dFind) {
        var dFind = dFind || {}; // options setup
        for (var field in dFind) { // loop through all that was sent
            var field = field; // set the field
            var value = dFind[field]; // set the value
        }

        var finalData = []; // setup the data array of datas
        for (var info in dataSet) {  // go through the datas
            var variable = dataSet[info]; // get the variable set in the data
            for (var prop in variable) {	// get the property values of the variable set in the data
                if (value == "*") {
                    if (prop == field && variable[prop] != '') {
                        if (firstMatchOnly == true) { // to return all data
                            return dataSet[info]; // return the data
                        } else { // to return the first match only
                            if (typeof (dataSet[info]) != "undefined" || dataSet[info] != null) {
                                //finalData[info] = dataSet[info]; // add to the array ***removed it loaded null's into the object
                                finalData.push(dataSet[info]);
                            }
                        }
                    }
                }

                if (prop == field && variable[prop] == value || field == "getAll" && value == true) { // if the name value is the same as the one the user is looking for
                    if (firstMatchOnly == true) { // to return all data
                        return dataSet[info]; // return the data
                    } else { // to return the first match only
                        if (typeof (dataSet[info]) != "undefined" || dataSet[info] != null) {
                            //finalData[info] = dataSet[info]; // add to the array ***removed it loaded null's into the object
                            finalData.push(dataSet[info]);
                        }
                    }
                }
            }
        }
        return finalData; // return the found data
    }

    if (is_array(findMe)) { // if the find selection is an array
        var hold = []; // holder
        var cleaned = []; // clean data holder
        for (var i = 0, fLen = findMe.length; i < fLen; i++) { // loop through the array set				
            var gotIt = mSearch(findMe[i]); // find the data				
            if (gotIt) { // if there's data
                hold.push(gotIt); // add it to the holder
            }
        }

        for (var i = 0, hLen = hold.length; i < hLen; i++) { // loop through the holder
            for (var h = 0, ihLen = hold[i].length; h < ihLen; h++) { // loop through the data of each
                if (typeof (hold[i][h]) != "undefined") { // if there's data in it
                    if (cleaned.indexOf(hold[i][h]) < 0) { // search cleanned to see if it exist
                        cleaned.push(hold[i][h]) // add it to the cleaned data
                    }
                }
            }
        }
        var complete = cleaned; // complete the cleaned data.
    } else {
        var complete = mSearch(findMe); // run as regular
    }

    if (complete != '') { // if the array is not empty
        return complete; // return the array of found records
    } else { // if it is empty
        return false;  // return false as in "no data found"
    }
}

function is_array(input) {
    return typeof (input) == 'object' && (input instanceof Array); // check to see if the input is an array or not
}
//END Search Object Function
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
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
    };

    //The icon object contains information about the icon that the user will use to launch the modal dialog
    this.m_icon = {
        elementId: modalId + "icon",
        cssClass: "",
        text: "",
        hoverText: "",
        isActive: true
    };

    //The header object of the modal.  Contains all of the necessary information to render the header of the dialog
    this.m_header = {
        elementId: modalId + "header",
        title: "",
        closeFunction: null
    };

    //The body object of the modal.  Contains all of the necessary information to render the body of the dialog
    this.m_body = {
        elementId: modalId + "body",
        dataFunction: null,
        isBodySizeFixed: true
    };

    //The footer object of the modal.  Contains all of the necessary information to render the footer of the dialog
    this.m_footer = {
        isAlwaysShown: false,
        elementId: modalId + "footer",
        buttons: []
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
        MP_Util.LogError("ModalDialog.addFooterButton: Cannot add footer button which isnt a ModalButton object.\nModalButtons can be created using the ModalDialog.createModalButton function.");
        return this;
    }

    if (!modalButton.getId()) {
        MP_Util.LogError("ModalDialog.addFooterButton: All ModalButton objects must have an id assigned");
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
* Checks to see if the modal dialog object is active or not
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
        MP_Util.LogError("ModalDialog.setBodyDataFunction: dataFunc param must be a function or null");
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
    if (elementId && typeof elementId == "string") {
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
    if (html && typeof html == "string") {
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
    if (typeof margin == "number") {
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
        MP_Util.LogError("ModalDialog.setFooterButtonCloseOnClick: closeOnClick param must be of type boolean");
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
                if (onClickFunc && typeof onClickFunc == "function") {
                    onClickFunc();
                }
                if (closeOnClick) {
                    MP_ModalDialog.closeModalDialog(modal.getId());
                }
            });

        }
    }
    else {
        MP_Util.LogError("ModalDialog.setFooterButtonCloseOnClick: No button with the id of " + buttonId + " exists for this ModalDialog");
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
        MP_Util.LogError("ModalDialog.setFooterButtonDither: Dithered param must be of type boolean");
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
                $(buttonElement).attr("disabled", true);
            }
            else {
                $(buttonElement).attr("disabled", false);
            }
        }
    }
    else {
        MP_Util.LogError("ModalDialog.setFooterButtonDither: No button with the id of " + buttonId + " exists for this ModalDialog");
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
    if (!(typeof clickFunc == "function") && clickFunc !== null) {
        MP_Util.LogError("ModalDialog.setFooterButtonOnClickFunction: clickFunc param must be a function or null");
        return this;
    }

    //Get the modal button
    button = this.getFooterButton(buttonId);
    if (button) {
        //Set the onclick function of the button
        button.setOnClickFunction(clickFunc);
        //If the modal dialog is active, update the existing onClick function
        $("#" + buttonId).unbind("click").click(function () {
            if (clickFunc) {
                clickFunc();
            }
            if (button.closeOnClick()) {
                MP_ModalDialog.closeModalDialog(modal.getId());
            }
        });

    }
    else {
        MP_Util.LogError("ModalDialog.setFooterButtonOnClickFunction: No button with the id of " + buttonId + " exists for this ModalDialog");
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
        MP_Util.LogError("ModalDialog.setFooterButtonText: buttonText param must be a string");
        return this;
    }

    //Check make sure the string is not empty
    if (!buttonText) {
        MP_Util.LogError("ModalDialog.setFooterButtonText: buttonText param must not be empty or null");
        return this;
    }

    //Get the modal button
    button = this.getFooterButton(buttonId);
    if (button) {
        //Set the onclick function of the button
        button.setText(buttonText);
        //If the modal dialog is active, update the existing onClick function
        $("#" + buttonId).html(buttonText);
    }
    else {
        MP_Util.LogError("ModalDialog.setFooterButtonText: No button with the id of " + buttonId + " exists for this ModalDialog");
    }
    return this;
};

/**
* Sets the html element id of the modal dialog footer.  This id will be used to interact with the footer of the modal dialog.
* @param {string} elementId The id of the html element
* @return {ModalDialog} The modal dialog object calling this function so chaining can be used
*/
ModalDialog.prototype.setFooterElementId = function (elementId) {
    if (elementId && typeof elementId == "string") {
        //Update the existing element id if the modal dialog is active
        if (this.isActive()) {
            $("#" + this.getFooterElementId()).attr("id", elementId);
        }
        this.m_footer.elementId = elementId;
    }
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

    if (typeof activeInd == "boolean") {
        this.m_icon.isActive = activeInd;
        //Update the icon click event based on the indicator
        //Get the icon container and remove all events if there are any
        var iconElement = $("#" + this.getIconElementId());
        if (iconElement) {
            $(iconElement).unbind("click");
            $(iconElement).removeClass("vwp-util-icon");
            if (activeInd) {
                //Add the click event
                $(iconElement).click(function () {
                    MP_ModalDialog.showModalDialog(modal.getId());
                });


                $(iconElement).addClass("vwp-util-icon");
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
    if (typeof hasGrayBackground == "boolean") {
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
        MP_Util.LogError("ModalDialog.setHeaderCloseFunction: closeFunc param must be a function or null");
        return this;
    }

    //Update close function since it is valid
    this.m_header.closeFunction = closeFunc;

    //Update the header close function if the modal is active
    if (this.isActive()) {
        //Get the close element
        $('.dyn-modal-hdr-close').click(function () {
            if (closeFunc) {
                closeFunc();
            }
            //call the close mechanism of the modal dialog to cleanup everything
            MP_ModalDialog.closeModalDialog(modal.getId());
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
    if (elementId && typeof elementId == "string") {
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
    if (headerTitle && typeof headerTitle == "string") {
        this.m_header.title = headerTitle;
        //Update the existing header title if the modal dialog is active
        if (this.isActive()) {
            $('#' + this.getHeaderElementId() + " .dyn-modal-hdr-title").html(headerTitle);
        }
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
    if (iconClass && typeof iconClass == "string") {
        //Update the existing icon class
        $('#' + this.getIconElementId()).removeClass(this.m_icon.cssClass).addClass(iconClass);
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
    if (elementId && typeof elementId == "string") {
        //Update the existing element id if the modal dialog is active
        if (this.isActive()) {
            $("#" + this.getIconElementId()).attr("id", elementId);
        }
        this.m_icon.elementId = elementId;
    }
    return this;
};

/**
* Sets the test which will be displayed to the user when hovering over the modal dialog icon.
* @param {string} iconHoverText The text to display in the icon hover
* @return {ModalDialog} The modal dialog object calling this function so chaining can be used
*/
ModalDialog.prototype.setIconHoverText = function (iconHoverText) {
    if (iconHoverText !== null && typeof iconHoverText == "string") {
        this.m_icon.hoverText = iconHoverText;
        //Update the icon hover text
        if ($('#' + this.getIconElementId()).length > 0) {
            $('#' + this.getIconElementId()).attr("title", iconHoverText);
        }
    }
    return this;
};

/**
* Sets the text to be displayed next to the modal dialog icon.
* @param {string} iconText The text to display next to the modal dialog icon.
* @return {ModalDialog} The modal dialog object calling this function so chaining can be used
*/
ModalDialog.prototype.setIconText = function (iconText) {
    if (iconText !== null && typeof iconText == "string") {
        this.m_icon.text = iconText;
        //Update the icon text
        if ($('#' + this.getIconElementId()).length > 0) {
            $('#' + this.getIconElementId()).html(iconText);
        }
    }
    return this;
};

/**
* Sets the id which will be used to identify a particular ModalDialog object.
* @param {string} id The id that will be assigned to this ModalDialog object
* @return {ModalDialog} The modal dialog object calling this function so chaining can be used
*/
ModalDialog.prototype.setId = function (id) {
    if (id && typeof id == "string") {
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
    if (typeof activeInd == "boolean") {
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
    if (typeof bodyFixed == "boolean") {
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
    if (typeof fixedToIcon == "boolean") {
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
    if (typeof footerAlwaysShown == "boolean") {
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
    if (typeof margin == "number") {
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
    if (typeof margin == "number") {
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
    if (typeof showCloseIcon == "boolean") {
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
    if (typeof margin == "number") {
        this.m_margins.top = (margin <= 0) ? 1 : margin;
        //Resize the modal if it is active
        if (this.isActive()) {
            MP_ModalDialog.resizeModalDialog(this.getId());
        }
    }
    return this;
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

/** Setters **/

/**
* Sets the id of the ModalButton object.  The id must be a string otherwise it is ignored.
* @return {ModalButton} The modal button object calling this function so chaining can be used
*/
ModalButton.prototype.setId = function (buttonId) {
    if (buttonId && typeof buttonId == "string") {
        this.m_buttonId = buttonId;
    }
    return this;
};

/**
* Sets the close on click flag of the dialog button
* @return {ModalButton} The modal button object calling this function so chaining can be used
*/
ModalButton.prototype.setCloseOnClick = function (closeFlag) {
    if (typeof closeFlag == "boolean") {
        this.m_closeOnClick = closeFlag;
    }
    return this;
};

/**
* Sets the focus indicator flag of the dialog button
* @return {ModalButton} The modal button object calling this function so chaining can be used
*/
ModalButton.prototype.setFocusInd = function (focusInd) {
    if (typeof focusInd == "boolean") {
        this.m_focusInd = focusInd;
    }
    return this;
};

/**
* Sets the text which will be shown in the button
* @return {ModalButton} The modal button object calling this function so chaining can be used
*/
ModalButton.prototype.setText = function (buttonText) {
    if (buttonText && typeof buttonText == "string") {
        this.m_buttonText = buttonText;
    }
    return this;
};

/**
* Sets the dithered status of the dialog button
* @return {ModalButton} The modal button object calling this function so chaining can be used
*/
ModalButton.prototype.setIsDithered = function (dithered) {
    if (typeof dithered == "boolean") {
        this.m_dithered = dithered;
    }
    return this;
};

/**
* Sets the onClick function for the ModalButton
* @return {ModalButton} The modal button object calling this function so chaining can be used
*/
ModalButton.prototype.setOnClickFunction = function (clickFunc) {
    this.m_onClickFunction = clickFunc;
    return this;
};

/**
* A collection of functions which can be used to maintain, create, destroy and update modal dialogs.
* The MP_ModalDialog function keeps a copy of all of the ModalDialog objects that have been created
* for the current view.  If a ModalDialog object is updated outside of these functions, the updated
* version of the object should replace the stale version that is stored here by using the
* updateModalDialogObject functionality.
* @namespace
*/
var MP_ModalDialog = function () {
    var modalDialogObjects = {};
    var whiteSpacePixels = 26;

    //A inner function used to the resize event that can be added and also removed from the window
    var resizeFunction = function () {
        MP_ModalDialog.resizeAllModalDialogs();
    };

    return {
        /**
        * This function will be used to add ModalDialog objects to the collection of ModalDialog objects for the current
        * View.  This list of ModalDialog objects will be the one source of this type of object and will be used when
        * showing modal dialogs.
        * @param {ModalDialog} modalObject An instance of the ModalDialog object
        */
        addModalDialogObject: function (modalObject) {
            var modalId = "";
            //Check that he object is not null and that the object type is ModalDialog
            if (!(modalObject instanceof ModalDialog)) {
                MP_Util.LogError("MP_ModalDialog.addModalDialogObject only accepts objects of type ModalDialog");
                return false;
            }

            //Check for a valid id.
            modalId = modalObject.getId();
            if (!modalId) {
                //Modal id is not populated
                MP_Util.LogError("MP_ModalDialog.addModalDialogObject: no/invalid ModalDialog id given");
                return false;
            }
            else if (modalDialogObjects[modalId]) {
                //Modal id is already in use
                MP_Util.LogError("MP_ModalDialog.addModalDialogObject: modal dialog id" + modalId + " is already in use");
                return false;
            }

            //Add the ModalDialog Object to the list of ModalDialog objects
            modalDialogObjects[modalId] = modalObject;
        },

        /**
        * Add the modal dialog icon to the viewpoint framework.  This icon will be responsible for
        * launching the correct modal dialog based on the ModalDialog object that it is associated to.
        * @param {string} modalDialogId The id of the ModalDialog object to reference when creating the modal dialog icon
        * @return null
        */
        addModalDialogOptionToViewpoint: function (modalDialogId) {
            var modalObj = null;
            var iconElement = null;
            var vwpUtilElement = null;

            //Check to see if the ModalDialog exists
            modalObj = modalDialogObjects[modalDialogId];
            if (!modalObj) {
                return;
            }

            //Check to see if the modal dialog is already available
            if ($("#" + modalDialogId).length > 0) {
                MP_Util.LogError("MP_ModalDialog.addModalDialogObject: Modal dialog " + modalDialogId + " already added");
                return;
            }

            //Get the div container for Viewpoint utility icons and add an entry for this modal
            iconElement = $('<div></div>').attr({
                id: modalObj.getIconElementId(),
                title: modalObj.getIconHoverText()
            }).addClass(modalObj.getIconClass()).html(modalObj.getIconText() || "&nbsp;");
            if (modalObj.isIconActive()) {
                $(iconElement).addClass("vwp-util-icon").click(function () {
                    MP_ModalDialog.showModalDialog(modalObj.getId());
                });
            }
            $('#vwpUtilities').append(iconElement);
        },

        /**
        * Closes all of the associated modal dialog windows and removes the resize event listener
        * @return null
        */
        closeModalDialog: function (modalDialogId) {
            var modalObj = null;

            //Check to see if the ModalDialog exists
            modalObj = modalDialogObjects[modalDialogId];
            if (!modalObj) {
                return;
            }

            //destroy the modal dialog
            $("#vwpModalDialog" + modalObj.getId()).remove();
            //destroy the modal background
            $("#vwpModalBackground" + modalObj.getId()).remove();
            //remove modal dialog resize event from the window
            $(window).unbind("resize", resizeFunction);
            //Mark the modal dialog as inactive
            modalObj.setIsActive(false);
        },

        /**
        * Deletes the modal dialog object with the id modalDialogId.
        * @param {string} modalDialogId The id of the modal dialog object to be deleted
        * @return {boolean} True if a ModalDialog object was deleted, false otherwise
        */
        deleteModalDialogObject: function (modalDialogId) {
            if (modalDialogObjects[modalDialogId]) {
                modalDialogObjects[modalDialogId] = null;
                return true;
            }
            return false;
        },

        /**
        * Retrieves the ModalDialog object with the id of modalDialogId
        * @param {string} modalDialogId The id of the modal dialog object to retrieve
        */
        retrieveModalDialogObject: function (modalDialogId) {
            if (modalDialogObjects[modalDialogId]) {
                return modalDialogObjects[modalDialogId];
            }
            return null;
        },

        /**
        * Resizes all of the active modal dialogs when the window itself is being resized.
        * @param {string} modalDialogId The id of the modal dialog object to resize
        */
        resizeAllModalDialogs: function () {
            var tempObj = null;
            var attr = "";
            //Get all of the modal dialog objects from the modalDialogObjects collection
            for (attr in modalDialogObjects) {
                if (modalDialogObjects.hasOwnProperty(attr)) {
                    tempObj = modalDialogObjects[attr];
                    if ((tempObj instanceof ModalDialog) && tempObj.isActive()) {
                        MP_ModalDialog.resizeModalDialog(tempObj.getId());
                    }
                }
            }
        },

        /**
        * Resizes the modal dialog when the window itself is being resized.
        * @param {string} modalDialogId The id of the modal dialog object to resize
        */
        resizeModalDialog: function (modalDialogId) {
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
            modalObj = modalDialogObjects[modalDialogId];
            if (!modalObj) {
                MP_Util.LogError("MP_ModalDialog.resizeModalDialog: No modal dialog with the id " + modalDialogId + "exists");
                return;
            }

            if (!modalObj.isActive()) {
                MP_Util.LogError("MP_ModalDialog.resizeModalDialog: this modal dialog is not active it cannot be resized");
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
                "top": topMarginSize,
                "left": leftMarginSize,
                "width": modalWidth + "px"
            });

            //Make sure the body div fills all of the alloted space if the body is a fixed size and also make sure the modal dialog is sized correctly.
            if (modalObj.isBodySizeFixed()) {
                $("#vwpModalDialog" + modalObj.getId()).css("height", modalHeight + "px");
                $("#" + modalObj.getBodyElementId()).height(modalHeight - $("#" + modalObj.getHeaderElementId()).height() - $("#" + modalObj.getFooterElementId()).height() - whiteSpacePixels);
            }
            else {
                $("#vwpModalDialog" + modalObj.getId()).css("max-height", modalHeight + "px");
                $("#" + modalObj.getBodyElementId()).css("max-height", (modalHeight - $("#" + modalObj.getHeaderElementId()).height() - $("#" + modalObj.getFooterElementId()).height() - whiteSpacePixels) + "px");
            }

            //Make sure the modal background is resized as well
            $("#vwpModalBackground" + modalObj.getId()).css({
                "height": "100%",
                "width": "100%"
            });
        },

        /**
        * Render and show the modal dialog based on the settings applied in the ModalDialog object referenced by the
        * modalDialogId parameter.
        * @param {string} modalDialogId The id of the ModalDialog object to render
        * @return null
        */
        showModalDialog: function (modalDialogId) {
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

            /**
            * This function is used to create onClick functions for each button.  Using this function
            * will prevent closures from applying the same action onClick function to all buttons.
            */
            function createButtonClickFunc(buttonObj, modalDialogId) {
                var clickFunc = buttonObj.getOnClickFunction();
                var closeModal = buttonObj.closeOnClick();
                if (!clickFunc) {
                    clickFunc = function () {
                    };

                }
                return function () {
                    clickFunc();
                    if (closeModal) {
                        MP_ModalDialog.closeModalDialog(modalDialogId);
                    }
                };

            }

            //Get the ModalDialog object
            modalObj = modalDialogObjects[modalDialogId];
            if (!modalObj) {
                MP_Util.LogError("MP_ModalDialog.showModalDialog: No modal dialog with the id " + modalDialogId + "exists");
                return;
            }

            //Check to see if the modal dialog is already displayed.  If so, return
            if (modalObj.isActive()) {
                return;
            }

            //Create the modal window based on the ModalDialog object
            //Create the header div element
            headerDiv = $('<div></div>').attr({
                id: modalObj.getHeaderElementId()
            }).addClass("dyn-modal-hdr-container").append($('<span></span>').addClass("dyn-modal-hdr-title").html(modalObj.getHeaderTitle()));
            if (modalObj.showCloseIcon()) {
                headerDiv.append($('<span></span>').addClass("dyn-modal-hdr-close").click(function () {
                    var closeFunc = null;
                    //call the close function of the modalObj
                    closeFunc = modalObj.getHeaderCloseFunction();
                    if (closeFunc) {
                        closeFunc();
                    }
                    //call the close mechanism of the modal dialog to cleanup everything
                    MP_ModalDialog.closeModalDialog(modalDialogId);
                }));

            }

            //Create the body div element
            bodyDiv = $('<div></div>').attr({
                id: modalObj.getBodyElementId()
            }).addClass("dyn-modal-body-container");

            //Create the footer element if there are any buttons available
            footerButtons = modalObj.getFooterButtons();
            footerButtonsCnt = footerButtons.length;
            if (footerButtonsCnt) {
                footerDiv = $('<div></div>').attr({
                    id: modalObj.getFooterElementId()
                }).addClass("dyn-modal-footer-container");
                footerButtonContainer = $('<div></div>').attr({
                    id: modalObj.getFooterElementId() + "btnCont"
                }).addClass("dyn-modal-button-container");
                for (x = 0; x < footerButtonsCnt; x++) {
                    button = footerButtons[x];
                    buttonFunc = button.getOnClickFunction();
                    footerButtonContainer.append($('<button></button>').attr({
                        id: button.getId(),
                        disabled: button.isDithered()
                    }).addClass("dyn-modal-button").html(button.getText()).click(createButtonClickFunc(button, modalObj.getId())));

                    //Check to see if we should focus on this button when loading the modal dialog
                    if (!focusButtonId) {
                        focusButtonId = (button.getFocusInd()) ? button.getId() : "";
                    }
                }
                footerDiv.append(footerButtonContainer);
            }
            else if (modalObj.isFooterAlwaysShown()) {
                footerDiv = $('<div></div>').attr({
                    id: modalObj.getFooterElementId()
                }).addClass("dyn-modal-footer-container");
                footerDiv.append(footerButtonContainer);
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
            dialogDiv = $('<div></div>').attr({
                id: "vwpModalDialog" + modalObj.getId()
            }).addClass("dyn-modal-dialog").css({
                "top": topMarginSize,
                "left": leftMarginSize,
                "width": modalWidth + "px"
            }).append(headerDiv).append(bodyDiv).append(footerDiv);

            //Create the modal background if set in the ModalDialog object.
            modalDiv = $('<div></div>').attr({
                id: "vwpModalBackground" + modalObj.getId()
            }).addClass((modalObj.hasGrayBackground()) ? "dyn-modal-div" : "dyn-modal-div-clear").height($(document).height());

            //Add the flash function to the modal if using a clear background
            if (!modalObj.hasGrayBackground()) {
                modalDiv.click(function () {
                    var modal = $("#vwpModalDialog" + modalObj.getId());
                    $(modal).fadeOut(100);
                    $(modal).fadeIn(100);
                });

            }

            //Add all of these elements to the document body
            $(document.body).append(modalDiv).append(dialogDiv);
            //Set the focus of a button if indicated
            if (focusButtonId) {
                $("#" + focusButtonId).focus();
            }
            //disable page scrolling when modal is enabled
            $("html").css("overflow", "hidden");

            //Make sure the body div fills all of the alloted space if the body is a fixed size and also make sure the modal dialog is sized correctly.
            if (modalObj.isBodySizeFixed()) {
                $(dialogDiv).css("height", modalHeight + "px");
                $(bodyDiv).height(modalHeight - $(headerDiv).height() - $(footerDiv).height() - whiteSpacePixels);
            }
            else {
                $(dialogDiv).css("max-height", modalHeight + "px");
                $(bodyDiv).css("max-height", (modalHeight - $(headerDiv).height() - $(footerDiv).height() - whiteSpacePixels) + "px");
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
            $(window).resize(resizeFunction);
        },

        /**
        * Updates the existing ModalDialog with a new instance of the object.  If the modal objet does not exist it is added to the collection
        * @param {ModalDialog} modalObject The updated instance of the ModalDialog object.
        * @return null
        */
        updateModalDialogObject: function (modalObject) {
            var modalDialogId = "";

            //Check to see if we were passed a ModalDialog object
            if (!modalObject || !(modalObject instanceof ModalDialog)) {
                MP_Util.LogError("MP_ModalDialog.updateModalDialogObject only accepts objects of type ModalDialog");
                return;
            }

            //Blindly update the ModalDialog object.  If it didnt previously exist, it will now.
            modalDialogId = modalObject.getId();
            modalDialogObjects[modalDialogId] = modalObject;
            return;
        }

    };
} ();
//end mpage modal dialog
/*was a possible use for the export
function DownloadJSON2CSV(objArray) {
var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
var str = '';

for (var i = 0; i < array.length; i++) {
var line = '';
for (var index in array[i]) {
if (line != '') line += ','

line += array[i][index];
}

str += line + '\r\n';
}

if (navigator.appName != 'Microsoft Internet Explorer') {
window.open('data:text/csv;charset=utf-8,' + escape(str));
}
else {
var popup = window.open('', 'csv', '');
popup.document.body.innerHTML = '<pre>' + str + '</pre>';
}
}
*/
function pwx_timer_display() {
    pwx_task_count += 1;
    $('#pwx_loading_div_time').text(pwx_task_count + ' sec')
}
function start_pwx_timer() {
    pwx_task_count = 0;
    pwx_task_counter = 0;
    pwx_task_counter = setInterval("pwx_timer_display()", 1000);
}

function stop_pwx_timer() {
    clearInterval(pwx_task_counter)
}
function isOdd(num) { return num % 2; }

//PWX Mpage Framework
//function to call a ccl script to gather data and return the json object
function MP_DCP_IMPORT_OBJECT_CCL_Request(program, blobIn, paramAr, async, callback) {
	logRequests(program,paramAr,blobIn);
    var info = new XMLCclRequest();
    info.onreadystatechange = function () {
        if (info.status == 405 || info.status == 409 || info.status == 492 || info.status == 493 || info.status == 500) {
				logErrorMessages(program,info.responseText,"MP_DCP_IMPORT_OBJECT_CCL_Request");
                if($('#mp_dcp_manage_spinner_container').length > 0)
                {
                    $('#mp_dcp_manage_grid_container').empty()	
                } else {
                    if($('#success_dialog_cent_container').length > 0){
                        MP_ModalDialog.closeModalDialog("importsuccesseModal")
                       }
                    else{
                        $('#mp_dcp_import_content_container').empty()
                        }
                }

                //Error HTML
                var errorHTML = '<div style="pading-top:10px;">' + i18n.rlimport.SCRIPTFAILMSG + '</br></br>' + i18n.rlimport.PLSCONTACTADMIN + '</div>'
                //Build modal dialog
                MP_ModalDialog.deleteModalDialogObject("importerrorModal")
                var errorModal = new ModalDialog("importerrorModal")
                            .setHeaderTitle('Error')
                            .setTopMarginPercentage(20)
                            .setRightMarginPercentage(30)
                            .setBottomMarginPercentage(45)
                            .setLeftMarginPercentage(30)
                            .setIsBodySizeFixed(true)
                            .setHasGrayBackground(true)
                            .setIsFooterAlwaysShown(true);
                errorModal.setBodyDataFunction(
                                function (modalObj) {
                                    modalObj.setBodyHTML(errorHTML);
                                }
                            );
                var cancelbtn = new ModalButton("dupCancel");
                cancelbtn.setText("Close").setCloseOnClick(true);
                errorModal.addFooterButton(cancelbtn)
                MP_ModalDialog.addModalDialogObject(errorModal);
                MP_ModalDialog.showModalDialog("importerrorModal")
	}
        
	if (info.readyState == 4 && info.status == 200) {
            var jsonEval = json_parse(this.responseText);
			logReplies(program,jsonEval);
            if (jsonEval.CCL_QUAL.STATUS_DATA) {
                var replyData = jsonEval.CCL_QUAL;
                if($('#mp_dcp_manage_spinner_container').length > 0)
                {
                    $('#mp_dcp_manage_grid_container').empty()	
                } else {
                    $('#mp_dcp_import_content_container').empty()
                }

                //Error HTML
                var errorHTML = '<div style="pading-top:10px;">' + replyData.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONNAME + '</br></br>' + replyData.STATUS_DATA.SUBEVENTSTATUS[0].TARGETOBJECTVALUE + '</br></br>' + i18n.rlimport.PLSCONTACTADMIN + '</div>'
                //Build modal dialog
                MP_ModalDialog.deleteModalDialogObject("importerrorModal")
                var errorModal = new ModalDialog("importerrorModal")
                            .setHeaderTitle('Error')
                            .setTopMarginPercentage(20)
                            .setRightMarginPercentage(30)
                            .setBottomMarginPercentage(45)
                            .setLeftMarginPercentage(30)
                            .setIsBodySizeFixed(true)
                            .setHasGrayBackground(true)
                            .setIsFooterAlwaysShown(true);
                errorModal.setBodyDataFunction(
                                function (modalObj) {
                                    modalObj.setBodyHTML(errorHTML);
                                }
                            );
                var cancelbtn = new ModalButton("dupCancel");
                cancelbtn.setText("Close").setCloseOnClick(true);
                errorModal.addFooterButton(cancelbtn)
                MP_ModalDialog.addModalDialogObject(errorModal);
                MP_ModalDialog.showModalDialog("importerrorModal")
            } else {
                var recordData = jsonEval.CCL_QUAL;
                callback.call(recordData);
            }
        }
    };

    info.setBlobIn((typeof blobIn == 'string') ? blobIn : JSON.stringify(blobIn));
    info.open('GET', program, async);
    info.requestBinding = "CpmScriptBatch";
    info.send(paramAr.join(","));
}

/*
refresh override
*/
if  ('MPAGESOVERRIDEREFRESH' in window.external)  {
    window.external.MPAGESOVERRIDEREFRESH("mp_dcp_importmanage_refresh()");
    function mp_dcp_importmanage_refresh() {
            MP_ModalDialog.closeModalDialog("refreshModal")
            MP_ModalDialog.deleteModalDialogObject("refreshModal")
            var refreshModal = new ModalDialog("refreshModal")
                 .setHeaderTitle(i18n.rlimport.ATTENTION)
                 .setTopMarginPercentage(10)
                 .setRightMarginPercentage(30)
                 .setBottomMarginPercentage(65)
                 .setLeftMarginPercentage(30)
                 .setIsBodySizeFixed(true)
                 .setHasGrayBackground(true)
                 .setIsFooterAlwaysShown(true);
            refreshModal.setBodyDataFunction(
                 function (modalObj) {
                     modalObj.setBodyHTML("<div id='refresh_dialog_cent_container' class='mp_dcp_font_12 mp_dcp_extra_line_height'>" + i18n.rlimport.REFRESHPAGEMESSAGE + "</div>");
                 });
            var refreshbtn = new ModalButton("refresh");
            refreshbtn.setText(i18n.rlimport.REFRESH).setCloseOnClick(true).setOnClickFunction(function () { document.location.reload(true) });
            var cancelbtn = new ModalButton("refreshCancel");
            cancelbtn.setText(i18n.rlimport.CANCEL).setCloseOnClick(true);
            refreshModal.addFooterButton(refreshbtn)
            refreshModal.addFooterButton(cancelbtn)
            MP_ModalDialog.addModalDialogObject(refreshModal);
            MP_ModalDialog.showModalDialog("refreshModal")
    }
}

var mp_dcp_import_set_registry = 0;
var mp_dcp_import_set_condition = 0;
var mp_dcp_import_set_status = 0;
var mp_dcp_import_tab_counter = 0;
var mp_import_dirty_data_cnt = 0;
var mp_import_success_data_cnt = 0;
var mp_import_patient_cnt = 0;
var mp_dcp_help_link = '';
var pwx_task_counter;
var dataView;
var grid;
var displayData = [];
var groupItemMetadataProvider;
var import_success = 0;
var import_failure = 0;
var import_dup = 0;
var set_Location = 0;
var set_Organization = 0;
var regcheck = { "REGISTRY_CHECK": {} };
var pwx_task_counter;
var manage_dataView;
var manage_grid;
var manage_displayData = [];
var searchString = "";
var containsCondition = [""];
var containsRegistry = [""];
var containsLocation = [""];
var manageBeginDate = "";
var manageEndDate = "";
var gridActivated = 0;
var import_ignoreAllType = 0;
var manage_del_ind = 0;
var manage_add_ind = 0;
var manage_access_ind = 0;
var import_access_ind = 0;
var manageEndDateDispVal = "";
var manageBeginDateDispVal = "";
//render page
function mp_dcp_manage_page_open() {
    if ($('#mp_dcp_manage_tab').css('display') == 'none') {
        $('#mp_dcp_import_tab').css('display', 'none')
        $('#mp_dcp_manage_tab').css('display', 'block')
        $('div.mp-dcp-import-seg-cntrl').removeClass('tab-layout-active')
        $('div.mp-dcp-manage-seg-cntrl').addClass('tab-layout-active')
        $('#mp_dcp_import_frame_head').empty()
        var headelement = document.getElementById('mp_dcp_import_frame_head');
        var mpdcpimportHTML = [];
        mpdcpimportHTML.push('<div id="mp_dcp_import_frame_toolbar">');
        if (import_access_ind == 1) {
            mpdcpimportHTML.push('<div class="mp-dcp-import-seg-cntrl" onclick="mp_dcp_import_page_open()"><div id="importLeft"></div><div id="importCenter">' + i18n.rlimport.IMPORT + '</div><div id="importRight"></div></div>')
        }
        mpdcpimportHTML.push('<div class="mp-dcp-manage-seg-cntrl tab-layout-active" onclick="mp_dcp_manage_page_open()"><div id="manageLeft"></div><div id="manageCenter">' + i18n.rlimport.MANAGE + '</div><div id="manageRight"></div></div>')
        if (manage_add_ind == 1) {
            mpdcpimportHTML.push('<div class="mp_dcp_frame_seperator"></div>')
            mpdcpimportHTML.push('<dt class="mp_dcp_import_toolbar_icon mp_dcp_import_no_text_decor" id="mp_dcp_import_add_person_icon"><a class="mp_dcp_import_header_link" title="' + i18n.rlimport.ADDENTRY + '" onClick="">',
            '<span class="mp-dcp-import-add-icon mp_dcp_import_no_text_decor"></span><span class="mp_dcp_import_toolbar_icon_text">' + i18n.rlimport.ADDENTRY + '</span></a></dt>');
        }
        mpdcpimportHTML.push('<div class="mp_dcp_frame_seperator"></div>')
        mpdcpimportHTML.push('<dt class="mp_dcp_import_toolbar_icon_nohvr" id="mp_dcp_manage_search_string" title="' + i18n.rlimport.SEARCHBY + '"><label for="mp_dcp_manage_search_string_box"><span class="mp-dcp-import-search-glass-icon" style="padding-left:11px;padding-bottom:6px;"></span><input type="text" id="mp_dcp_manage_search_string_box"/></label></dt>')
        mpdcpimportHTML.push('</div>');
        headelement.innerHTML = mpdcpimportHTML.join("");
        //position the grid container
        if ($("#filterShell").hasClass("collapsed") == false) {
            //close and open to ensure everything is resized and set correctly
            $("#filterTab").click(); $("#filterTab").click();
        }
        $('#mp_dcp_manage_grid_container').css("left", ($('#filterShell').width() + 1))
        $('#mp_dcp_manage_grid_container').css("width", ($('#mp_dcp_manage_content_container').width() - ($('#filterShell').width() + 12)))
        $('#mp_dcp_manage_status_container').css("width", ($('#mp_dcp_manage_content_container').width() - $('#filterShell').width()))
        //check if only one org and it's prechecked. If so then load data for one org
        //if one organization pre check
        var OrgOptions = $('#filterShell-Org-Div input[name="manage_org"]')
        if (OrgOptions.length == 1) {
            var OrgOptionsChecked = $('#filterShell-Org-Div input[name="manage_org"]:checked')
            if (OrgOptionsChecked.length == 1) {
                $('#filterShell-Org-Div input[name="manage_org"]:checked').trigger("change")
                $('#mp_dcp_manage_apply_btn').trigger("click")
            }
        }
    }
}
function mp_dcp_import_page_open() {
    $('#mp_dcp_import_tab').css('display', 'block')
    $('#mp_dcp_manage_tab').css('display', 'none')
    $('div.mp-dcp-import-seg-cntrl').addClass('tab-layout-active')
    $('div.mp-dcp-manage-seg-cntrl').removeClass('tab-layout-active')
    $('#mp_dcp_import_frame_head').empty()
    var headelement = document.getElementById('mp_dcp_import_frame_head');
    var mpdcpimportHTML = [];
    mpdcpimportHTML.push('<div id="mp_dcp_import_frame_toolbar">');
    mpdcpimportHTML.push('<div class="mp-dcp-import-seg-cntrl tab-layout-active" onclick="mp_dcp_import_page_open()"><div id="importLeft"></div><div id="importCenter">' + i18n.rlimport.IMPORT + '</div><div id="importRight"></div></div>')
    mpdcpimportHTML.push('<div class="mp-dcp-manage-seg-cntrl" onclick="mp_dcp_manage_page_open()"><div id="manageLeft"></div><div id="manageCenter">' + i18n.rlimport.MANAGE + '</div><div id="manageRight"></div></div>')
    mpdcpimportHTML.push('<div class="mp_dcp_frame_seperator"></div>')
    mpdcpimportHTML.push('<dt class="mp_dcp_import_toolbar_icon mp_dcp_import_no_text_decor" id="mp_dcp_import_new_template_icon"><a class="mp_dcp_import_header_link" title="' + i18n.rlimport.DOWNLOADTEMPLATE + '" onClick="">',
        '<span class="mp-dcp-import-new-doc-icon mp_dcp_import_no_text_decor"></span><span class="mp_dcp_import_toolbar_icon_text">' + i18n.rlimport.NEWTEMPLATE + '</span></a></dt>');
    mpdcpimportHTML.push('<div class="mp_dcp_frame_seperator"></div>')
    if (mp_dcp_help_link != "") {
        mpdcpimportHTML.push('<dt class="mp_dcp_import_toolbar_icon mp_dcp_import_no_text_decor" id="mp_dcp_import_help_page_icon"><a tabindex="1" href=\'javascript: CCLNEWSESSIONWINDOW("', mp_dcp_help_link, '","_blank","left=0,top=0,width=1200,height=700,toolbar=no",0,1)\' class="mp_dcp_import_header_link" title="' + i18n.rlimport.HELPPAGE + '" onClick="">',
        '<span class="mp-dcp-import-help-icon mp_dcp_import_no_text_decor"></span><span class="mp_dcp_import_toolbar_icon_text">' + i18n.rlimport.HELP + '</span></a></dt><div class="mp_dcp_frame_seperator"></div>');
    }
    mpdcpimportHTML.push('</div>');
    headelement.innerHTML = mpdcpimportHTML.join("");
}
// Function to export log data from blackbird.js

function exportLogData() {
		try {
			m_pvFrameworkLinkObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
			var curDate = new Date();
			var strExport = $("#blackbird").find(".mainBody").text();
			var strPath = m_pvFrameworkLinkObj.SaveStringToTempFile("RLIMPORT_LOG_"+Date.parse(curDate)+".log", strExport);
			if(strPath){	
				window.open(strPath,"_blank");
			}
		} catch(err) {
			// most likely the file is still open; just continue
		} 
}

//function to log error messages to the blackbird logging window
	// @program : Script name when making script calls, otherwise send as ""
	// @errorDetails : The error message or other details related to the error
	// @functionName : Function or method where we are getting the error
	function logErrorMessages(program,errorDetails,functionName) {
		var curDate = new Date();
		var message = "<b>DATE:</b> " + curDate + " <br /><b>FAILURE ON PROGRAM:</b> " + program + "<br /><b>ERROR DETAILS:</b> " + errorDetails + " <b>Function Name:</b> " + functionName;
		log.error(message);
	};
	
	//function to log timer information
	// @timerName : Name of the function/code change where the timer information is logged
	// @totalTime : Time taken by the function/code to execute 
	function logTimerMessages(timerName,totalTime) {
		var curDate = new Date();
		var message = "<p class='centerText'><b>DATE:</b> " + curDate + " <br /><b>TIMER NAME:</b> " + timerName + "<br /><b>TOTAL TIME:</b> " + totalTime + "</p>";
		log.profile(message);
	};
	
	//function to log script requests to the blackbird logging window
	// @program : Script name when making script calls, otherwise send as ""
	// @requestParams : The script request parameters
	function logRequests(program,requestParams,blobIn) {
		var curDate = new Date();
		var message = "<p class='centerText'><b>DATE:</b> " + curDate + "<br /><b>PROGRAM:</b> " + program + "<br /><b>REQUEST PARAMS:</b> " + JSON.stringify(requestParams).toString() + "<br /><b>Blob In:</b> " + blobIn + "</p>";
		log.info(message);
	};
	
	//function to log script replies to the blackbird logging window
	// @program : Script name when making script calls, otherwise send as ""
	// @reply : Reply from script calls
	function logReplies(program,reply) {
		var curDate = new Date();
		var message = "<p class='centerText'><b>DATE:</b> " + curDate + "<br /><b>PROGRAM:</b> " + program + "<br /><b>REPLY:</b> " + JSON.stringify(reply).toString() + "</p>";
		log.debug(message);
	};

function RenderImportFrame() {
    //gather data
    var js_criterion = json_parse(m_criterionJSON);
    manage_add_ind = js_criterion.CRITERION.MANAGE_ADD_IND
    manage_del_ind = js_criterion.CRITERION.MANAGE_DEL_IND
    manage_access_ind = js_criterion.CRITERION.MANAGE_ACCESS_IND
    import_access_ind = js_criterion.CRITERION.IMPORT_ACCESS_IND
    mp_dcp_help_link = js_criterion.CRITERION.HELP_LINK
    //display frame header
    var headelement = document.getElementById('mp_dcp_import_frame_head');
    var mpdcpimportHTML = [];
    mpdcpimportHTML.push('<div id="mp_dcp_import_frame_toolbar">');
    if (import_access_ind == 1) {
        mpdcpimportHTML.push('<div class="mp-dcp-import-seg-cntrl tab-layout-active" onclick="mp_dcp_import_page_open()"><div id="importLeft"></div><div id="importCenter">' + i18n.rlimport.IMPORT + '</div><div id="importRight"></div></div>')
    }
    if (manage_access_ind == 1) {
    mpdcpimportHTML.push('<div class="mp-dcp-manage-seg-cntrl" onclick="mp_dcp_manage_page_open()"><div id="manageLeft"></div><div id="manageCenter">' + i18n.rlimport.MANAGE + '</div><div id="manageRight"></div></div>')
    }
    mpdcpimportHTML.push('<div class="mp_dcp_frame_seperator"></div>')
    mpdcpimportHTML.push('<dt class="mp_dcp_import_toolbar_icon mp_dcp_import_no_text_decor" id="mp_dcp_import_new_template_icon"><a class="mp_dcp_import_header_link" title="' + i18n.rlimport.DOWNLOADTEMPLATE + '" onClick="">',
        '<span class="mp-dcp-import-new-doc-icon mp_dcp_import_no_text_decor"></span><span class="mp_dcp_import_toolbar_icon_text">' + i18n.rlimport.NEWTEMPLATE + '</span></a></dt>');
    mpdcpimportHTML.push('<div class="mp_dcp_frame_seperator"></div>')
    if (js_criterion.CRITERION.HELP_LINK != "") {
        mpdcpimportHTML.push('<dt class="mp_dcp_import_toolbar_icon mp_dcp_import_no_text_decor" id="mp_dcp_import_help_page_icon"><a tabindex="1" href=\'javascript: CCLNEWSESSIONWINDOW("', mp_dcp_help_link, '","_blank","left=0,top=0,width=1200,height=700,toolbar=no",0,1)\' class="mp_dcp_import_header_link" title="' + i18n.rlimport.HELPPAGE + '" onClick="">',
        '<span class="mp-dcp-import-help-icon mp_dcp_import_no_text_decor"></span><span class="mp_dcp_import_toolbar_icon_text">' + i18n.rlimport.HELP + '</span></a></dt><div class="mp_dcp_frame_seperator"></div>');
    }
    mpdcpimportHTML.push('</div>');
    headelement.innerHTML = mpdcpimportHTML.join("");
    //display the filter bar with date pickers
    var tabelement = document.getElementById('mp_dcp_import_select_content');
    //build the filter bar
    var mpdcpimporttabdef = [];
    var mpdcpimportbarHTML = [];
    mpdcpimporttabdef.push('<div id="mp_dcp_import_tabs">');
    if (js_criterion.CRITERION.IMPORT_ACCESS_IND == 1) {
        //build the import select bar
        mpdcpimportbarHTML.push('<div id="mp_dcp_import_tab">');
        mpdcpimportbarHTML.push('<div id = "mp_dcp_import_frame_select_bar">');
        mpdcpimportbarHTML.push('<div id="mp_dcp_import_frame_select_bar_container">');
        mpdcpimportbarHTML.push('<div id="mp_dcp_import_file" class="mp_dcp_import_select_left mp_dcp_font_12"><label for="importfile"><span class="mp_dcp_select_label">' + i18n.rlimport.REGISTRYFILE + '</span></br><div id="mp_dcp_import_box_container" class="mp_dcp_import_box_container_hide"><input type="file" id="importfile" name="importfileload" class="mp_dcp_import_box"/></div></label><div id="mp_dcp_fake_file_browse"><input tabindex="2" type="text" class="mp_dcp_fake_import_box"/><span style="padding-left:16px;"><button tabindex="3" id="mp_dcp_fake_browse_btn" value="Browse" >' + i18n.rlimport.BROWSE + '</button></span></div></div>');
        mpdcpimportbarHTML.push('<div id="mp_dcp_import_locations_right" class="mp_dcp_import_select_right mp_dcp_font_12">');
        //add location selection
        var location_height = 30;
            mpdcpimportbarHTML.push('<span class="mp_dcp_select_label">' + i18n.rlimport.ASSOCIATEWITHLOCATION + '</span><br/>');
            mpdcpimportbarHTML.push('<select tabindex="6" id="location_list" name="location_list" multiple="multiple" style="width:217px;">');
            mpdcpimportbarHTML.push('</select>');
        mpdcpimportbarHTML.push('</div>');
        mpdcpimportbarHTML.push('<div id="mp_dcp_import_orgs_right" class="mp_dcp_import_select_right mp_dcp_font_12">');
            mpdcpimportbarHTML.push('<span class="mp_dcp_select_label"><span class="mp_dcp_required_mark">*</span> ' + i18n.rlimport.ASSOCIATEWITHORGANIZATION + ' </span></br><select tabindex="5" id="org_list" name="org_list" multiple="multiple" style="width:217px;">');
            var org_height = 5;
            
            for (var i = 0, len = js_criterion.CRITERION.ORG_LIST.length; i < len; i++) {
            //for (var i = 0; i < js_criterion.CRITERION.ORG_LIST.length; i++) {
                org_height += 26;
                if (set_Organization == js_criterion.CRITERION.ORG_LIST[i].ORG_ID || js_criterion.CRITERION.ORG_LIST.length == 1) {
                    mpdcpimportbarHTML.push('<option value="', js_criterion.CRITERION.ORG_LIST[i].ORG_ID, '|', i, '" selected="selected">', js_criterion.CRITERION.ORG_LIST[i].ORG_NAME, '</option>');
                }
                else {
                    mpdcpimportbarHTML.push('<option value="', js_criterion.CRITERION.ORG_LIST[i].ORG_ID, '|', i, '">', js_criterion.CRITERION.ORG_LIST[i].ORG_NAME, '</option>');
                }
            }
            if (org_height > 300) { org_height = 300; }
            mpdcpimportbarHTML.push('</select>');
        mpdcpimportbarHTML.push('</div>');
        mpdcpimportbarHTML.push('<div id="mp_dcp_import_defintions_right" class="mp_dcp_import_select_right mp_dcp_font_12">');
            mpdcpimportbarHTML.push('<span class="mp_dcp_select_label"><span class="mp_dcp_required_mark">*</span> ' + i18n.rlimport.ASSOCIATEWITHREGISTRY + '</span><br/><select tabindex="4" id="registry_list" name="registry_list" multiple="multiple" style="width:217px;">');
            var registry_height = 5;
            for (var i = 0, len = js_criterion.CRITERION.DEF.length; i < len; i++) {
            //for (var i = 0; i < js_criterion.CRITERION.DEF.length; i++) {
                if (js_criterion.CRITERION.DEF[i].DEF_TYPE == 1) {
                    registry_height += 26;
                    if (mp_dcp_import_set_registry == js_criterion.CRITERION.DEF[i].DEF_ID) {
                        mpdcpimportbarHTML.push('<option value="', js_criterion.CRITERION.DEF[i].DEF_ID, '" selected="selected">', js_criterion.CRITERION.DEF[i].DEF_DISP, '</option>');
                    }
                    else {
                        mpdcpimportbarHTML.push('<option value="', js_criterion.CRITERION.DEF[i].DEF_ID, '">', js_criterion.CRITERION.DEF[i].DEF_DISP, '</option>');
                    }
                }
            }
            if (registry_height > 300) { registry_height = 300; }
            mpdcpimportbarHTML.push('</select>');
        mpdcpimportbarHTML.push('</div>');
        mpdcpimportbarHTML.push('</div>');
        mpdcpimportbarHTML.push('</div>');
        //buiild import content container
        mpdcpimportbarHTML.push('<div id="mp_dcp_import_content_container">');
		var browseButtonStr = i18n.rlimport.CLICKBROWSETEXT.replace('{1}','<a id="mp_dcp_browse_link_text" class="mp_dcp_import_blue_link">{2}</a>');
		browseButtonStr = browseButtonStr.replace('{2}',i18n.rlimport.BROWSE);
        mpdcpimportbarHTML.push('<dt class ="mp_dcp_import_instruct_container_text" id="mp_dcp_import_instruct_container"><center> ' + browseButtonStr + '</center></dt>');
        mpdcpimportbarHTML.push('</div>');
        //build import status bar
        mpdcpimportbarHTML.push('<div id="mp_dcp_import_status_bar">');
        mpdcpimportbarHTML.push('<div id="mp_dcp_import_status_container"><div id="mp_dcp_import_action_buttons" class="mp_dcp_font_12"><dl>');
        mpdcpimportbarHTML.push('<dt id="mp_dcp_import_status_import_button" class="mp_dcp_import_status_button"><button value="Import" disabled="disabled" >' + i18n.rlimport.IMPORT + '</button></dt>');
        mpdcpimportbarHTML.push('</dl></div>')
        mpdcpimportbarHTML.push('</div>')
        //Closes Import_tabs-1    
        mpdcpimportbarHTML.push('</div></div>');
    }
    if (js_criterion.CRITERION.MANAGE_ACCESS_IND == 1) {
        var img_path = js_criterion.CRITERION.STATIC_CONTENT
        //build the manage select bar
        mpdcpimportbarHTML.push('<div id="mp_dcp_manage_tab" style="display:none">');
        mpdcpimportbarHTML.push('<div id="mp_dcp_manage_content_container">');
        mpdcpimportbarHTML.push('<div id="filterShell" class="collapsed"><div id="divDisabledMenu"></div>');
        //mpdcpimportbarHTML.push('<div id="filterScrollDiv" class="filterScroll"></div>');
        mpdcpimportbarHTML.push('<div id="filterTab"><img id="imgFilterCollapse" src="' + img_path + '/css/images/6364_left.png" alt="' + i18n.rlimport.COLLAPSE + '"/><div id="filterTabTitle" class="mp_dcp_font">' + i18n.rlimport.FILTERS + '</div></div>');
        mpdcpimportbarHTML.push('<div id="filterShellHeader" class="mp_dcp_font_12"><div id="filterShellHeaderText">' + i18n.rlimport.VIEWING + ' <span id="mp_dcp_manage_filter_count">--</span> ' + i18n.rlimport.ENTRIESSMALL + '.</div></div>')
        mpdcpimportbarHTML.push('<div id="filterShellHeaderContainer">');
        //organization div
        mpdcpimportbarHTML.push('<div id="filterShell-Org-Container" class="filterShell-Container"><div id="filterShell-Org" class="filterShellFilterHeader mp_dcp_font_12"><div class="filterShellFilterHeaderText"><span class="mp_dcp_required_mark">*</span>' + i18n.rlimport.ORGANIZATIONS + '</div><div id="filterShellFilterHeaderClearText-Org" class="filterShellFilterHeaderClearText mp_dcp_font mp_dcp_clear_blue_link" style="display:none">' + i18n.rlimport.CLEAR + '</div></div>');
        mpdcpimportbarHTML.push('<div id="filterShell-Org-FilteredDiv" class="filterShellFilterHeaderFilteredDiv mp_dcp_font" style="display:none"></div>');
        mpdcpimportbarHTML.push('<div id="filterShell-Org-Div" class="filterShellFilterHeaderDiv mp_dcp_font" style="display:none">');
        for (var i = 0, len = js_criterion.CRITERION.ORG_LIST.length; i < len; i++) {
        //for (var i = 0; i < js_criterion.CRITERION.ORG_LIST.length; i++) {
            mpdcpimportbarHTML.push('<div class="filterShellFilterHeaderDivOption"><label for="', js_criterion.CRITERION.ORG_LIST[i].ORG_ID, '"><input type="radio" name="manage_org" value="', js_criterion.CRITERION.ORG_LIST[i].ORG_ID, '|', i, '"id="', js_criterion.CRITERION.ORG_LIST[i].ORG_ID, '"/>', js_criterion.CRITERION.ORG_LIST[i].ORG_NAME, '</label></div>');
        }
        mpdcpimportbarHTML.push('</div></div>');
        //location div
        mpdcpimportbarHTML.push('<div id="filterShell-Location-Container" class="filterShell-Container"><div id="filterShell-Location" class="filterShellFilterHeader mp_dcp_font_12"><div class="filterShellFilterHeaderText">' + i18n.rlimport.LOCATIONS + '</div><div id="filterShellFilterHeaderClearText-Location" class="filterShellFilterHeaderClearText mp_dcp_font mp_dcp_clear_blue_link" style="display:none">' + i18n.rlimport.CLEAR + '</div></div>')
        mpdcpimportbarHTML.push('<div id="filterShell-Location-FilteredDiv" class="filterShellFilterHeaderFilteredDiv mp_dcp_font" style="display:none"></div>');
        mpdcpimportbarHTML.push('<div id="filterShell-Location-Div" class="filterShellFilterHeaderDiv mp_dcp_font" style="display:none">');
        mpdcpimportbarHTML.push('<div class="filterShellFilterHeaderDivOption">' + i18n.rlimport.NOORGSELECTED + '</div></div></div>');
        //loop through def and build conditions options and reg options at once
        var providerOpt = []
        var conditionOpt = []
        conditionOpt.push('<div class="filterShellFilterHeaderDivOption"><label for="manage_condition_none_filter"><input type="checkbox" name="manage_condition" value="' + i18n.rlimport.NONE + '" id="manage_condition_none_filter"/>' + i18n.rlimport.NONE + '</label></div>');
        for (var i = 0, len = js_criterion.CRITERION.DEF.length; i < len; i++) {
        //for (var i = 0; i < js_criterion.CRITERION.DEF.length; i++) {
            if (js_criterion.CRITERION.DEF[i].DEF_TYPE == 1) {
                providerOpt.push('<div class="filterShellFilterHeaderDivOption"><label for="', js_criterion.CRITERION.DEF[i].DEF_DISP, i, '"><input type="checkbox" name="manage_registry" value="', js_criterion.CRITERION.DEF[i].DEF_DISP, '" id="', js_criterion.CRITERION.DEF[i].DEF_DISP, i, '"/>', js_criterion.CRITERION.DEF[i].DEF_DISP, '</label></div>');
            }
            else if (js_criterion.CRITERION.DEF[i].DEF_TYPE == 2) {
                conditionOpt.push('<div class="filterShellFilterHeaderDivOption"><label for="', js_criterion.CRITERION.DEF[i].DEF_DISP, i, '"><input type="checkbox" name="manage_condition" value="', js_criterion.CRITERION.DEF[i].DEF_DISP, '" id="', js_criterion.CRITERION.DEF[i].DEF_DISP, i, '"/>', js_criterion.CRITERION.DEF[i].DEF_DISP, '</label></div>');
            }
        }
        //registry div
        mpdcpimportbarHTML.push('<div id="filterShell-Provider-Container" class="filterShell-Container"><div id="filterShell-Provider" class="filterShellFilterHeader mp_dcp_font_12"><div class="filterShellFilterHeaderText">' + i18n.rlimport.REGISTRY + '</div><div id="filterShellFilterHeaderClearText-Provider" class="filterShellFilterHeaderClearText mp_dcp_font mp_dcp_clear_blue_link" style="display:none">' + i18n.rlimport.CLEAR + '</div></div>')
        mpdcpimportbarHTML.push('<div id="filterShell-Provider-FilteredDiv" class="filterShellFilterHeaderFilteredDiv mp_dcp_font" style="display:none"></div>');
        mpdcpimportbarHTML.push('<div id="filterShell-Provider-Div" class="filterShellFilterHeaderDiv mp_dcp_font" style="display:none">');
        mpdcpimportbarHTML.push(providerOpt.join(""), '</div></div>');
        //condition div
        mpdcpimportbarHTML.push('<div id="filterShell-Condition-Container" class="filterShell-Container"><div id="filterShell-Condition" class="filterShellFilterHeader mp_dcp_font_12"><div class="filterShellFilterHeaderText">' + i18n.rlimport.CONDITIONS + '</div><div id="filterShellFilterHeaderClearText-Condition" class="filterShellFilterHeaderClearText mp_dcp_font mp_dcp_clear_blue_link" style="display:none">' + i18n.rlimport.CLEAR + '</div></div>')
        mpdcpimportbarHTML.push('<div id="filterShell-Condition-FilteredDiv" class="filterShellFilterHeaderFilteredDiv mp_dcp_font" style="display:none"></div>');
        mpdcpimportbarHTML.push('<div id="filterShell-Condition-Div" class="filterShellFilterHeaderDiv mp_dcp_font" style="display:none">');
        mpdcpimportbarHTML.push(conditionOpt.join(""), '</div></div>');
        mpdcpimportbarHTML.push('<div id="filterShell-DateAdded-Container" class="filterShell-Container"><div id="filterShell-DateAdded" class="filterShellFilterHeader mp_dcp_font_12"><div class="filterShellFilterHeaderText">' + i18n.rlimport.DATEADDED + '</div><div id="filterShellFilterHeaderClearText-DateAdded" class="filterShellFilterHeaderClearText mp_dcp_font mp_dcp_clear_blue_link" style="display:none">' + i18n.rlimport.CLEAR + '</div></div>')
        mpdcpimportbarHTML.push('<div id="filterShell-DateAdded-FilteredDiv" class="filterShellFilterHeaderFilteredDiv mp_dcp_font" style="display:none"><div id="manage_begin_filter_selected"></div><div id="manage_end_filter_selected"></div></div>');
        mpdcpimportbarHTML.push('<div id="filterShell-DateAdded-Div" class="filterShellFilterHeaderDiv mp_dcp_font" style="display:none">');
        mpdcpimportbarHTML.push('<div class="filterShellFilterHeaderDivOption"><label for="manage_begin"><span style="vertical-align:20%;">' + i18n.rlimport.BEGINDATE + ': </span><input type="text" id="manage_begin" name="manage_begin" class="mp_dcp_date_box" /></label></div>');
        mpdcpimportbarHTML.push('<div class="filterShellFilterHeaderDivOption"><label for="manage_end"><span style="vertical-align:20%;padding-right:8px;" >' + i18n.rlimport.ENDDATE + ': </span><input type="text" id="manage_end" name="manage_end" class="mp_dcp_date_box" /></label></div>');
        mpdcpimportbarHTML.push('</div></div>')
        mpdcpimportbarHTML.push('</div>')
        mpdcpimportbarHTML.push('<div id="filterShellButtonDiv" class="mp_dcp_font_12"><div id="mp_dcp_manage_apply_btn_containter"><button id="mp_dcp_manage_apply_btn" value="Apply" disabled="disabled">' + i18n.rlimport.APPLYLOWER + '</button></div></div>')
        mpdcpimportbarHTML.push('</div>')
        mpdcpimportbarHTML.push('<div id="mp_dcp_manage_grid_container"><div id="mp_dcp_manage_instruct_container"><div class="mp_dcp_manage_instruct_container_text">' + i18n.rlimport.CHOOSEFILTERSTEXT + '</div></div></div>')
        mpdcpimportbarHTML.push('</div>');
        //buiild import status bar
        mpdcpimportbarHTML.push('<div id="mp_dcp_manage_status_bar">');
        mpdcpimportbarHTML.push('<div id="mp_dcp_manage_status_container"><div id="mp_dcp_manage_action_buttons_left" class="mp_dcp_font_12"><dl>');
        mpdcpimportbarHTML.push('</dl></div>')
        mpdcpimportbarHTML.push('<div id="mp_dcp_manage_action_buttons_right" class="mp_dcp_font_12"><dl>');
        mpdcpimportbarHTML.push('</dl></div>')
        mpdcpimportbarHTML.push('</div>')
        //Closes Import_tabs-1    
        mpdcpimportbarHTML.push('</div>');
    }
    //close the mp_dcp_import_tabs div
    mpdcpimportbarHTML.push('</div>');
    //display pages
    tabelement.innerHTML = mpdcpimporttabdef.join("") + mpdcpimportbarHTML.join("");
    //$('#mp_dcp_fake_browse_btn').button();
    $('#mp_dcp_fake_browse_btn, #mp_dcp_fake_file_browse input, #mp_dcp_browse_link_text').on('click', function () {
        $('#importfile').click()
    })
    //import select bar events
    //$('#mp_dcp_import_status_import_button button').button();
    $("#registry_list").multiselect({
        height: registry_height,
        header: false,
        multiple: false,
        minWidth: "217",
        classes: "mp_dcp_import_select_box_required",
        noneSelectedText: i18n.rlimport.SELECTREGISTRY,
        selectedList: 1,
        create: function () { $(this).next().width(217); }
    });
    if ($("#registry_list option").length == 0) {
        $("#registry_list").multiselect({
            noneSelectedText: i18n.rlimport.NOREGISTRYFOUND
        });
        $("#registry_list").multiselect('disable')
    }
    $("#location_list").multiselect({
        height: location_height,
        header: false,
        multiple: false,
        minWidth: "217",
        classes: "mp_dcp_import_select_box",
        noneSelectedText: i18n.rlimport.SELECTLOCATION,
        selectedList: 1,
        create: function () { $(this).next().width(217); }
    });
    $("#org_list").multiselect({
        height: org_height,
        header: false,
        multiple: false,
        minWidth: "217",
        classes: "mp_dcp_import_select_box_required",
        noneSelectedText: i18n.rlimport.SELECTORGANIZATION,
        selectedList: 1,
        create: function () { $(this).next().width(217); }
    });
    if ($("#org_list option").length == 0) {
        $("#org_list").multiselect({
            noneSelectedText: i18n.rlimport.NONESELECTEDTEXT
        });
        $("#org_list").multiselect('disable')
    }
    if (!$("#org_list").val()) {
        $("#location_list").multiselect('disable');
    }
    else {
        var loc_obj = $("#org_list").val();
        var loc_str = String(loc_obj);
        var loc_arr = loc_str.split("|");
        set_Organization = loc_arr[0];
        var org_index = loc_arr[1];
        //switch from required to normal font indicating the selected field has been filled in
        $("#org_list").multiselect({
            classes: "mp_dcp_import_select_box"
        });
        var location_height = 31;
        var LocOptionHTML = [];
        LocOptionHTML.push('<option value="0">&nbsp;</option>');
        for (var i = 0, len = js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST.length; i < len; i++) {
        //for (var i = 0; i < js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST.length; i++) {
            location_height += 26;
            if (set_Location == js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_CD) {
                LocOptionHTML.push('<option selected="selected" value="', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_CD, '">', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_NAME, '</option>');
            }
            else {
                LocOptionHTML.push('<option value="', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_CD, '">', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_NAME, '</option>');
            }
        }
        if (location_height > 300) { location_height = 300; };
        $('#mp_dcp_import_locations_right #location_list').html(LocOptionHTML.join(""));
        $("#location_list").multiselect('enable');
        $("#location_list").multiselect('option', 'height', location_height);
        $("#location_list").multiselect('refresh');
        RegistryLocationCheck()
    }
    $("#registry_list").on("multiselectclick", function (event, ui) {
        mp_dcp_import_set_registry = ui.value;
        //switch from required to normal font indicating the selected field has been filled in
        $("#registry_list").multiselect({
            classes: "mp_dcp_import_select_box"
        });
        RegistryLocationCheck()
    });
    $("#org_list").on("multiselectclick", function (event, ui) {
        var loc_str = ui.value;
        var loc_arr = loc_str.split("|");
        set_Organization = loc_arr[0];
        set_Location = 0;
        var org_index = loc_arr[1];
        //switch from required to normal font indicating the selected field has been filled in
        $("#org_list").multiselect({
            classes: "mp_dcp_import_select_box"
        });
        var location_height = 31;
        var LocOptionHTML = [];
        LocOptionHTML.push('<option value="0">&nbsp;</option>');
        for (var i = 0, len = js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST.length; i < len; i++) {
        //for (var i = 0; i < js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST.length; i++) {
            location_height += 26;
            LocOptionHTML.push('<option value="', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_CD, '">', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_NAME, '</option>');
        }
        if (location_height > 300) { location_height = 300; };
        $('#mp_dcp_import_locations_right #location_list').html(LocOptionHTML.join(""));
        $("#location_list").multiselect('enable');
        $("#location_list").multiselect('option', 'height', location_height);
        $("#location_list").multiselect('refresh');
        RegistryLocationCheck()
    });
    $("#location_list").on("multiselectclick", function (event, ui) {
        set_Location = ui.value;
        RegistryLocationCheck()
    });
    var filetext = ""
    $('#importfile').on('change', function () {
        filetext = $(this).val();
        var filetextindex = filetext.lastIndexOf("\\")
        if (filetextindex != -1) {
            $('#mp_dcp_fake_file_browse input').val(filetext.substring(filetextindex + 1))
        }
        else {
            $('#mp_dcp_fake_file_browse input').val(filetext);
        }
        RegistryLocationCheck()
    })
    function RegistryLocationCheck() {
        if (set_Organization != 0 && mp_dcp_import_set_registry != 0 && filetext != "") {
            $('#mp_dcp_import_status_import_button button').removeAttr("disabled")
        }
        else {
            $('#mp_dcp_import_status_import_button button').attr("disabled", "disabled")
        }
    }
    $('#mp_dcp_import_status_import_button button').on('click', function () {
        RenderImportGrid(js_criterion);
    });


    //manage tab events
    //filter tab events
    $('.filterShell-Container, .filterShellFilterHeaderDiv').on("mouseover", function () {
        $(this).children('.filterShellFilterHeader').children('.filterShellFilterHeaderClearText').css('display', 'inline-block')
    })
    $('.filterShell-Container, .filterShellFilterHeaderDiv').on("mouseout", function () {
        $(this).children('.filterShellFilterHeader').children('.filterShellFilterHeaderClearText').css('display', 'none')
    })
    $('.filterShellFilterHeader').on('click', function () {
        var clicked_id = $(this).attr('id')
        $('.filterShellFilterHeaderFilteredDiv').each(function (index) {
            if ($(this).html() != "" && $(this).attr('id') != clicked_id) {
                $(this).css('display', 'inline-block')
            } else {
                $(this).css('display', 'none')
            }
        })
        if ($(this).hasClass('selected') == true) {
            $('.filterShellFilterHeader, .filterShellFilterHeaderDiv').removeClass('selected')
            $('.filterShellFilterHeaderDiv').css({ display: 'none', height: '', overflow: '' })
            if ($('#' + clicked_id + '-FilteredDiv').html() != "") {
                $('#' + clicked_id + '-FilteredDiv').css('display', 'inline-block')
            }
        }
        else {
            $('#' + clicked_id + '-FilteredDiv').css('display', 'none')
            $('.filterShellFilterHeader, .filterShellFilterHeaderDiv').removeClass('selected')
            $('.filterShellFilterHeaderDiv').css('display', 'none')
            $(this).addClass('selected')
            $('#' + clicked_id + '-Div').addClass('selected').css('display', 'inline-block')
            if ($('#' + clicked_id + '-Div').height() > 150) {
                $('#' + clicked_id + '-Div').css({ height: '150', overflow: 'auto' })
            }
            $(this).children('.filterShellFilterHeaderClearText').css('display', 'inline-block')
        }
    })
    $('#filterShell-Org-Div input[name="manage_org"]').change(function () {
        if (!$('#filterShell-Org-Div input[name="manage_org"]:checked')) {
            $('#mp_dcp_manage_apply_btn').attr('disabled', 'disabled')
            $('#filterShell-Location-Div').html('<div class="filterShellFilterHeaderDivOption">' + i18n.rlimport.NOORGSELECTED + '</div>')
            containsLocation = [""];
            $('#filterShell-Org-FilteredDiv').empty().css('display', 'none')
            $('#filterShell-Location-FilteredDiv').empty().css('display', 'none')
        }
        else {
            $('#mp_dcp_manage_apply_btn').removeAttr('disabled')
            containsLocation = [""];
            var loc_str = $('#filterShell-Org-Div input[name="manage_org"]:checked').val();
            var loc_arr = loc_str.split("|");
            $('#filterShell-Org-FilteredDiv').html('<div class="filterShellFilterHeaderFilteredDivOption">' + $('#filterShell-Org-Div input[name="manage_org"]:checked').parent('label').text() + '</div>')
            var org_index = loc_arr[1];
            var LocOptionHTML = [];
            LocOptionHTML.push('<div class="filterShellFilterHeaderDivOption"><label for="location_none_filter"><input type="checkbox" name="manage_location" value="No Location" id="location_none_filter"/>' + i18n.rlimport.NOLOCATION + '</label></div>');
            for (var i = 0, len = js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST.length; i < len; i++) {
            //for (var i = 0; i < js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST.length; i++) {
                LocOptionHTML.push('<div class="filterShellFilterHeaderDivOption"><label for="', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_NAME, i, '"><input type="checkbox" name="manage_location" value="', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_NAME, '" id="', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_NAME, i, '"/>', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_NAME, '</label></div>');
            }
            $('#filterShell-Location-Div').html(LocOptionHTML.join(""))
            $('#filterShell-Location-FilteredDiv').empty().css('display', 'none')
        }
    })

    $("#filterTab").click(function () {
        $("#filterShell").toggleClass("collapsed");
        $("#pageWrapper").toggleClass("collapsed");

        var newLeft = $("#filterShell").hasClass("collapsed") ? -275 : 275;
        $(".columnDiv").each(function () {
            var _this = $(this);
            var _left = _this.css("left").replace("px", "") * 1 + newLeft;
            _this.css("left", _left + "px");
        });

        $("#imgFilterCollapse").remove();
        if ($("#filterShell").hasClass("collapsed")) {
            $("#filterTab").prepend("<img id='imgFilterCollapse' src='" + img_path + "/css/images/6364_right.png' alt='" + i18n.rlimport.EXPAND + "'/>");
            $("#divDisabledMenu").css("display", "none");
            $("#vertShadow").css("left", 560 + newLeft);
        } else {
            $("#filterTab").prepend("<img id='imgFilterCollapse' src='" + img_path + "/css/images/6364_left.png' alt='" + i18n.rlimport.COLLAPSE + "'/>");
            $("#divDisabledMenu").css("display", "inline");
            $("#vertShadow").css("left", newLeft + 20 + 200);
        }
        //position the grid container after filter tab movement
        $('#mp_dcp_manage_grid_container').css("left", ($('#filterShell').width() + 1))
        $('#mp_dcp_manage_grid_container').css("width", ($('#mp_dcp_manage_content_container').width() - ($('#filterShell').width() + 12)))
        $('#mp_dcp_manage_status_container').css("left", ($('#filterShell').width() + 1))
        $('#mp_dcp_manage_status_container').css("width", ($('#mp_dcp_manage_content_container').width() - $('#filterShell').width()))
        var shellpos = $('#filterShell').position()
        var shellheadercontainerheight = $('#filterShell').innerHeight() - $('#filterShellButtonDiv').height() - shellpos.top - $('#filterShellHeader').height()
        $('#filterShellHeaderContainer').css('max-height', shellheadercontainerheight + 'px').css('height', shellheadercontainerheight + 'px')
    });
    //default organization open and the filterpane open
    $('#filterShell-Org').trigger('click')
    $("#filterTab").click();
    var new_managequal;
    $('#mp_dcp_manage_apply_btn').on('click', function () {
        var WaitingElem = $('#mp_dcp_manage_grid_container')
        $(WaitingElem).empty();
        var WaitingHTML = [];
        WaitingHTML.push('<dt id ="mp_dcp_manage_spinner_container"><span class="mp-dcp-import-spinner"></span></dt>');
        $(WaitingElem).html(WaitingHTML.join(""))
        $('.filterShellFilterHeaderFilteredDiv').each(function (index) {
            if ($(this).html() != "") {
                $(this).css('display', 'inline-block')
            } else {
                $(this).css('display', 'none')
            }
        })
        $('.filterShellFilterHeaderDiv').css({ display: 'none', height: '', overflow: '' })
        $('.filterShellFilterHeader, .filterShellFilterHeaderDiv').removeClass('selected')
        managequal = { "IMPORT_CSV": {} };
        var loc_str = String($('#filterShell-Org-Div input[name="manage_org"]:checked').val())
        var loc_arr = loc_str.split("|");
        managequal.IMPORT_CSV.ORGANIZATION_ID = parseFloat(loc_arr[0])
        var sendArr = ["^MINE^", "^QUERYDATA^", 0.0, js_criterion.CRITERION.PRSNL_ID + ".0"];
        MP_DCP_IMPORT_OBJECT_CCL_Request('mp_dcp_import_list', JSON.stringify(managequal).replace(/(_(?:id|cd)['"]\w*:\w*\d+)(\w*[,\}])/gi,"$1.0$2"), sendArr, true, function () {
            $('#mp_dcp_manage_grid_container').empty();
            manage_displayData = this.IMPORT_DATA
            buildManageDataGrid(js_criterion);
            gridActivated = 1;
            if (manage_del_ind == 1) {
                $('#mp_dcp_manage_action_buttons_left dl').html('<dt id="mp_dcp_manage_delete_selected" class="mp_dcp_manage_status_button_left"><button value="Inactivate Selected" disabled="disabled">' + i18n.rlimport.INACTIVATESELECTED + '</button></dt>')
            }
            //$('#mp_dcp_manage_action_buttons_right dl').html('<dt id="mp_dcp_manage_export_list" class="mp_dcp_manage_status_button_right"><button value="Export List" >i18n.RLIMPORT.EXPORTLIST</button></dt>')
            $('#mp_dcp_manage_delete_selected button').on('click', function () {
                var selectedData = [], selectedIndexes;
                selectedIndexes = manage_grid.getSelectedRows()
                if (selectedIndexes.length != 0) {
                    jQuery.each(selectedIndexes, function (index, value) {
                        selectedData.push(manage_grid.getData().getItem(value));
                    });
                    for (var i = 0, len = selectedData.length; i < len; i++) {
                        //for (var i = 0; i < selectedData.length; i++) {
                        for (var cc = 0, sublen = manage_displayData.length; cc < sublen; cc++) {
                            // for (var cc = 0; cc < manage_displayData.length; cc++) {
                            if (manage_displayData[cc].id == selectedData[i].id) {
                                manage_displayData[cc].DELETE_IND = 1
                                break;
                            }
                        }
                    }
                    var WaitingElem = $('#mp_dcp_manage_grid_container')
                    $(WaitingElem).empty();
                    var WaitingHTML = [];
                    WaitingHTML.push('<dt id ="mp_dcp_manage_spinner_container"><span class="mp-dcp-import-spinner"></span></dt>');
                    $(WaitingElem).html(WaitingHTML.join(""))
                    new_managequal = { "IMPORT_CSV": {} };
                    var loc_str = String($('#filterShell-Org-Div input[name="manage_org"]').val())
                    var loc_arr = loc_str.split("|");
                    new_managequal.IMPORT_CSV.ORGANIZATION_ID = managequal.IMPORT_CSV.ORGANIZATION_ID
                    new_managequal.IMPORT_CSV.IMPORT_DATA = manage_displayData
                    var sendArr = ["^MINE^", "^INACTIVATE^", 0.0, js_criterion.CRITERION.PRSNL_ID + ".0"];
                    MP_DCP_IMPORT_OBJECT_CCL_Request('mp_dcp_import_list', JSON.stringify(new_managequal).replace(/(_(?:id|cd)['"]\w*:\w*\d+)(\w*[,\}])/gi,"$1.0$2") , sendArr, true, function () {
                        $('#mp_dcp_manage_grid_container').empty();
                        $('#mp_dcp_manage_grid_container').html('<dt id ="mp_dcp_manage_spinner_container"><span class="mp-dcp-import-spinner"></span></dt>')
                        manage_displayData = this.IMPORT_DATA
                        buildManageDataGrid(js_criterion);
                        gridActivated = 1;
                    });
                }
            })
        });
    });
    //filtering events
    $('#filterShell-Condition-Div input[name="manage_condition"]').change(function () {
        var array_of_checked_values = $('#filterShell-Condition-Div input[name="manage_condition"]:checked').map(function () {
            return this.value;
        }).get();
        if (array_of_checked_values.length == 0) {
            containsCondition = [""]
            $('#filterShell-Condition-FilteredDiv').empty().css('display', 'none')
        } else {
            containsCondition = jQuery.makeArray(array_of_checked_values)
            var filtererCondHTML = []
            for (var i = 0, len = containsCondition.length; i < len; i++) {
            //for (var i = 0; i < containsCondition.length; i++) {
                filtererCondHTML.push('<div class="filterShellFilterHeaderFilteredDivOption">' + containsCondition[i] + '</div>')
            }
            $('#filterShell-Condition-FilteredDiv').html(filtererCondHTML.join(""))
        }
        if (gridActivated == 1) { updateFilter() }
    });
    $('#filterShell-Provider-Div input[name="manage_registry"]').change(function () {
        var array_of_checked_values = $('#filterShell-Provider-Div input[name="manage_registry"]:checked').map(function () {
            return this.value;
        }).get();
        if (array_of_checked_values.length == 0) {
            containsRegistry = [""]
            $('#filterShell-Provider-FilteredDiv').empty().css('display', 'none')
        } else {
            containsRegistry = jQuery.makeArray(array_of_checked_values)
            var filtererProvHTML = []
            for (var i = 0, len = containsRegistry.length; i < len; i++) {
            //for (var i = 0; i < containsRegistry.length; i++) {
                filtererProvHTML.push('<div class="filterShellFilterHeaderFilteredDivOption">' + containsRegistry[i] + '</div>')
            }
            $('#filterShell-Provider-FilteredDiv').html(filtererProvHTML.join(""))
        }
        if (gridActivated == 1) { updateFilter() }
    });
    $('#filterShell-Location-Div').on('change', 'input[name="manage_location"]', function () {
        var array_of_checked_values = $('#filterShell-Location-Div input[name="manage_location"]:checked').map(function () {
            return this.value;
        }).get();
        if (array_of_checked_values.length == 0) {
            containsLocation = [""]
        } else {
            containsLocation = jQuery.makeArray(array_of_checked_values)
            var filtererLocHTML = []
            for (var i = 0, len = containsLocation.length; i < len; i++) {
            //for (var i = 0; i < containsLocation.length; i++) {
                filtererLocHTML.push('<div class="filterShellFilterHeaderFilteredDivOption">' + containsLocation[i] + '</div>')
            }
            $('#filterShell-Location-FilteredDiv').html(filtererLocHTML.join(""))
        }
        if (gridActivated == 1) { updateFilter() }
    });
    //set up date filter
    $("#manage_begin").datepicker({
		dateFormat: i18n.rlimport_lc.fulldate2yr,
        showOn: "focus",
        changeMonth: true,
        changeYear: true,
        onSelect: function (selectedDate) {
			
			var arr = ["dd/mm/yy","dd.mm.yy"];
			var arrPosition = $.inArray(i18n.rlimport_lc.fulldate2yr,arr)
			if(arrPosition != -1) {
				if(arrPosition == 0) {
					splitDate = selectedDate.split(/\//);
					changedFormat = [splitDate[1],splitDate[0],splitDate[2]].join('/');
				} else {
					splitDate = selectedDate.split(/\./);
					changedFormat = [splitDate[1],splitDate[0],splitDate[2]].join('/');
				}
				manageBeginDate = changedFormat;
			} else {
				manageBeginDate = selectedDate;
			}
			
            $("#manage_end").datepicker("option", "minDate", manageBeginDate).val(manageEndDateDispVal);
			
			var beginDateText = i18n.rlimport.BEGINDATEVAL.replace("{12}",selectedDate);
            $('#manage_begin_filter_selected').html('<div class="filterShellFilterHeaderFilteredDivOption">' + beginDateText + '</div>')
            if (gridActivated == 1) { updateFilter(); }
        } 
    });
    $("#manage_end").datepicker({
		dateformat: i18n.rlimport_lc.fulldate2yr,
        showOn: "focus",
        changeMonth: true,
        changeYear: true,
        onSelect: function (selectedDate) {
			
			manageEndDateDispVal = new Date(selectedDate);
			manageEndDateDispVal = manageEndDateDispVal.format(i18n.rlimport_lc.fulldate4yr);
			$("#manage_end").val(manageEndDateDispVal);
			
            manageEndDate = selectedDate;
            $("#manage_begin").datepicker("option", "maxDate", manageEndDateDispVal);
			var endDateText = i18n.rlimport.ENDDATEVAL.replace("{14}",manageEndDateDispVal);
            $('#manage_end_filter_selected').html('<div class="filterShellFilterHeaderFilteredDivOption">' + endDateText + '</div>')
            if (gridActivated == 1) { updateFilter(); }
        }
    });
    //clearing of filter events
    $('.filterShellFilterHeaderClearText').on('click', function (event) {
        event.stopPropagation();
        var elemId = $(this).attr('id')
        switch (elemId) {
            case 'filterShellFilterHeaderClearText-Org':
                containsLocation = [""]
                $('#filterShell-Org-Div input[name="manage_org"]:checked').removeAttr('checked')
                gridActivated = 0
                $('#mp_dcp_manage_apply_btn').attr('disabled', 'disabled')
                $('#filterShell-Location-Div').html('<div class="filterShellFilterHeaderDivOption">' + i18n.rlimport.NOORGSELECTED + '</div>')
                $('#mp_dcp_manage_grid_container').empty();
                $('#filterShell-Location-FilteredDiv').html('').css('display', 'none')
                $('#filterShell-Org-FilteredDiv').html('').css('display', 'none')
                $('#mp_dcp_manage_action_buttons_left dl').empty()
                $('#mp_dcp_manage_action_buttons_right dl').empty()
                $('#mp_dcp_manage_filter_count').text('--')
                $('#filterShell-Org').trigger('click')
                break;
            case 'filterShellFilterHeaderClearText-Location':
                containsLocation = [""]
                $('#filterShell-Location-Div input[name="manage_location"]:checked').removeAttr('checked')
                $('#filterShell-Location-FilteredDiv').html('').css('display', 'none')
                if (gridActivated == 1) { updateFilter(); }
                $('#filterShell-Location').trigger('click')
                break;
            case 'filterShellFilterHeaderClearText-Provider':
                containsRegistry = [""]
                $('#filterShell-Provider-Div input[name="manage_registry"]:checked').removeAttr('checked')
                $('#filterShell-Provider-FilteredDiv').html('').css('display', 'none')
                if (gridActivated == 1) { updateFilter() }
                $('#filterShell-Provider').trigger('click')
                break;
            case 'filterShellFilterHeaderClearText-Condition':
                containsCondition = [""]
                $('#filterShell-Condition-Div input[name="manage_condition"]:checked').removeAttr('checked')
                $('#filterShell-Condition-FilteredDiv').html('').css('display', 'none')
                if (gridActivated == 1) { updateFilter() }
                $('#filterShell-Condition').trigger('click')
                break;
            case 'filterShellFilterHeaderClearText-DateAdded':
                $('#filterShell-DateAdded-FilteredDiv').html('<div id="manage_begin_filter_selected"></div><div id="manage_end_filter_selected"></div>').css('display', 'none')
                manageBeginDate = "";
				manageEndDateDispVal = "";
                manageEndDate = "";
                $("#manage_begin").datepicker("setDate", null)
                $("#manage_end").datepicker("setDate", null)
                $("#manage_end").datepicker("option", "minDate", null);
                $("#manage_begin").datepicker("option", "maxDate", null);
                if (gridActivated == 1) { updateFilter() }
                $('#filterShell-DateAdded').trigger('click')
                break

        }
    })
    //searchstring function
    $('body').on('keyup', '#mp_dcp_manage_search_string', function () {
        searchString = $('#mp_dcp_manage_search_string_box').val().toUpperCase()
        if (gridActivated == 1) { updateFilter() }
    });
    //template function
    $('body').on('click', '#mp_dcp_import_new_template_icon', function () {
		var templateStr = i18n.rlimport.CONDITIONCOLUMN + "," + i18n.rlimport.LASTNAMECOLUMN + "," + i18n.rlimport.FIRSTNAMECOLUMN + ",";
		templateStr += i18n.rlimport.MIDDLENAMECOLUMN + "," + i18n.rlimport.SEXCOLUMN + "," + i18n.rlimport.DOBCOLUMN + "," + i18n.rlimport.MRNCOLUMN + ",";
		templateStr += i18n.rlimport.DOBVALUE + "," + i18n.rlimport.SEXVALUE + "," + i18n.rlimport.CONDITIONVALUE;
		
        var ccllinkparams =  '^MINE^,^TEMPLATE^,0,0,^' + templateStr + '^';
        CCLLINK('mp_dcp_import_list', ccllinkparams, 0);
		logRequests("mp_dcp_import_list",ccllinkparams,"");
    });

    var totalAddedEntries = 0;
    //add patient function
    $('body').on('click', '#mp_dcp_import_add_person_icon', function () {
        //build the commit object
        var importcsv = { "IMPORT_CSV": { "IMPORT_DATA": {}} };
        importcsv.IMPORT_CSV.CSV_FAILURE_IND = null;
        importcsv.IMPORT_CSV.SUCCESS_CNT = null;
        importcsv.IMPORT_CSV.FAILURE_CNT = null;
        importcsv.IMPORT_CSV.ORGANIZATION_ID = 0;
        importcsv.IMPORT_CSV.LOCATION_CD = 0;
        importcsv.IMPORT_CSV.IMPORT_DATA = [{
            CONDITION_ID: 0,
            MATCH_PERSON_ID: 0,
            NAME_FULL_FORMATTED: null,
            IGNORE_IND: 0,
            DUP_IND: 0,
            INDEPENDENT_PARENT_IND:0,
            AC_CLASS_PERSON_RELTN_ID: 0,
            INSERT_REG_IND: 0,
            INSERT_CON_IND: 0,
            PARENT_CLASS_PERSON_RELTN_ID: 0,
            UPDATE_CON_IND: 0,
            UPDATE_REG_IND: 0,
            GROUPID: 0,
            CONDITION: "",
            LAST_NAME: null,
            FIRST_NAME: null,
            MIDDLE_NAME: null,
            SEX: null,
            DOB: null,
            MRN: null,
            DUP_ID: 0
        }]
		
        //build the dialog
        var duplicateHTML = [];
        duplicateHTML.push('<div id ="duplicate_patient_info">');
        duplicateHTML.push('<dl class="duplicate_patient_info_row">');
        duplicateHTML.push('<dt class="add_patient_info_label" >' + i18n.rlimport.NAME + ':</dt>');
        duplicateHTML.push('<dt class="duplicate_patient_info_value" id="add_patient_name"><a class="mp_dcp_import_blue_link" id="add_patient_search">' + i18n.rlimport.SEARCH + '</a></dt></dl>');
        duplicateHTML.push('<dl class="duplicate_patient_info_row">');
        duplicateHTML.push('<dt class="add_patient_info_label">' + i18n.rlimport.SEX + ':</dt>');
        duplicateHTML.push('<dt class="duplicate_patient_info_value" id="add_patient_gender"></dt></dl>');
        duplicateHTML.push('<dl class="duplicate_patient_info_row">');
        duplicateHTML.push('<dt class="add_patient_info_label">' + i18n.rlimport.DOB + ':</dt>');
        duplicateHTML.push('<dt class="duplicate_patient_info_value" id="add_patient_dob"></dt></dl>');
        duplicateHTML.push('<dl class="duplicate_patient_info_row">');
        duplicateHTML.push('<dt class="add_patient_info_label">' + i18n.rlimport.MRN + ':</dt>');
        duplicateHTML.push('<dt class="duplicate_patient_info_value" id="add_patient_mrn"></dt></dl>');
        //build condition dropdown.
        var selectHTML = [];
        selectHTML.push('<select id="add_patient_info_cond_select" multiple="multiple">')
        var cond_height = 31;
        selectHTML.push('<option value="0">' + i18n.rlimport.NONEMIXED + '</option>')
        for (var cidx = 0, len = js_criterion.CRITERION.DEF.length; cidx < len; cidx++) {
        //for (var cidx = 0; cidx < js_criterion.CRITERION.DEF.length; cidx++) {
            if (js_criterion.CRITERION.DEF[cidx].DEF_TYPE == 2) {
                cond_height += 26;
                selectHTML.push('<option value="' + js_criterion.CRITERION.DEF[cidx].DEF_ID + '">' + js_criterion.CRITERION.DEF[cidx].DEF_DISP + '</option>')
            }
        }
        selectHTML.push('</select>')
        duplicateHTML.push('<dl class="duplicate_patient_info_row"><dt class="add_patient_info_label"><span class="mp_dcp_required_mark">*</span> ' + i18n.rlimport.CONDITION + ':</dt>');
        duplicateHTML.push('<dt class="duplicate_patient_info_value">', selectHTML.join(""), '</dt></dl>');
        //build registry dropdown.
        selectHTML = [];
        selectHTML.push('<select id="add_patient_info_registry_select" multiple="multiple">')
        var registry_height = 5;
        for (var cidx = 0, len = js_criterion.CRITERION.DEF.length; cidx < len; cidx++) {
        //for (var cidx = 0; cidx < js_criterion.CRITERION.DEF.length; cidx++) {
            if (js_criterion.CRITERION.DEF[cidx].DEF_TYPE == 1) {
                registry_height += 26;
                selectHTML.push('<option value="' + js_criterion.CRITERION.DEF[cidx].DEF_ID + '">' + js_criterion.CRITERION.DEF[cidx].DEF_DISP + '</option>')
            }
        }
        selectHTML.push('</select>')
        duplicateHTML.push('<dl class="duplicate_patient_info_row"><dt class="add_patient_info_label"><span class="mp_dcp_required_mark">*</span> ' + i18n.rlimport.REGISTRY + ':</dt>');
        duplicateHTML.push('<dt class="duplicate_patient_info_value">', selectHTML.join(""), '</dt></dl>');
        //build organization dropdown.
        selectHTML = [];
        selectHTML.push('<select id="add_patient_info_org_select" multiple="multiple">')
        var org_height = 5;
        for (var i = 0, len = js_criterion.CRITERION.ORG_LIST.length; i < len; i++) {
        //for (var i = 0; i < js_criterion.CRITERION.ORG_LIST.length; i++) {
            org_height += 26;
            if (js_criterion.CRITERION.ORG_LIST.length == 1) {
                selectHTML.push('<option value="', js_criterion.CRITERION.ORG_LIST[i].ORG_ID, '|', i, '" selected="selected">', js_criterion.CRITERION.ORG_LIST[i].ORG_NAME, '</option>');
            }
            else {
                selectHTML.push('<option value="', js_criterion.CRITERION.ORG_LIST[i].ORG_ID, '|', i, '">', js_criterion.CRITERION.ORG_LIST[i].ORG_NAME, '</option>');
            }
        }
        selectHTML.push('</select>')
        duplicateHTML.push('<dl class="duplicate_patient_info_row"><dt class="add_patient_info_label"><span class="mp_dcp_required_mark">*</span> ' + i18n.rlimport.ORGANIZATION + ':</dt>');
        duplicateHTML.push('<dt class="duplicate_patient_info_value">', selectHTML.join(""), '</dt></dl>');
        //location placeholder
        var location_height = 30;
        duplicateHTML.push('<dl class="duplicate_patient_info_row"><dt class="add_patient_info_label">' + i18n.rlimport.LOCATION + ':</dt>');
        duplicateHTML.push('<dt class="duplicate_patient_info_value"><select id="add_patient_info_location_select" multiple="multiple"><option value="0">' + i18n.rlimport.PLACEHOLDER + '</option></select</dt></dl>');
        duplicateHTML.push('</div>');
        if (cond_height > 205) { cond_height = 205; }
        //Build modal dialog
        MP_ModalDialog.deleteModalDialogObject("manageAddPtModal")
        var addModal = new ModalDialog("manageAddPtModal")
             .setHeaderTitle(i18n.rlimport.ADDENTRY)
             .setTopMarginPercentage(10)
             .setRightMarginPercentage(30)
             .setBottomMarginPercentage(10)
             .setLeftMarginPercentage(30)
             .setIsBodySizeFixed(true)
             .setHasGrayBackground(true)
             .setIsFooterAlwaysShown(true);
        addModal.setBodyDataFunction(
             function (modalObj) {
                 modalObj.setBodyHTML(duplicateHTML.join(""));
             });
        var submitnewbtn = new ModalButton("addSubmitNew");
        submitnewbtn.setText(i18n.rlimport.APPLYANDNEW).setCloseOnClick(false).setIsDithered(true).setCloseOnClick(true).setOnClickFunction(function () { commitPatientAdd(true); });
        var submitclosebtn = new ModalButton("addSubmit");
        submitclosebtn.setText(i18n.rlimport.APPLYANDCLOSE).setCloseOnClick(false).setIsDithered(true).setCloseOnClick(true).setOnClickFunction(function () { commitPatientAdd(false); totalAddedEntries = 0; });
        var cancelbtn = new ModalButton("addCancel");
        cancelbtn.setText(i18n.rlimport.CANCEL).setCloseOnClick(true).setOnClickFunction(function () { checkAddTotal() });
        addModal.addFooterButton(submitnewbtn)
        addModal.addFooterButton(submitclosebtn)
        addModal.addFooterButton(cancelbtn)
        MP_ModalDialog.addModalDialogObject(addModal);
        MP_ModalDialog.showModalDialog("manageAddPtModal")
        if (cond_height > 205) { cond_height = 205; }
        $("#add_patient_info_cond_select").multiselect({
            height: cond_height,
            header: false,
            multiple: false,
            classes: "mp_dcp_import_select_box_required",
            noneSelectedText: i18n.rlimport.SELECTCONDITION,
            selectedList: 1
        });
        if (registry_height > 135) { registry_height = 135; }
        $("#add_patient_info_registry_select").multiselect({
            height: registry_height,
            header: false,
            multiple: false,
            classes: "mp_dcp_import_select_box_required",
            noneSelectedText: i18n.rlimport.SELECTREGISTRY,
            selectedList: 1
        });
        if (org_height > 135) { org_height = 135; }
        $("#add_patient_info_org_select").multiselect({
            height: org_height,
            header: false,
            multiple: false,
            classes: "mp_dcp_import_select_box_required",
            noneSelectedText: i18n.rlimport.SELECTORGANIZATION,
            selectedList: 1
        });
        $("#add_patient_info_location_select").multiselect({
            height: location_height,
            header: false,
            multiple: false,
            classes: "mp_dcp_import_select_box",
            noneSelectedText: i18n.rlimport.SELECTLOCATION,
            selectedList: 1
        });
        if (!$("#add_patient_info_org_select").val()) {
            $("#add_patient_info_location_select").multiselect('disable');
        }
        else {
            var loc_obj = $("#add_patient_info_org_select").val();
            var loc_str = String(loc_obj);
            var loc_arr = loc_str.split("|");
            importcsv.IMPORT_CSV.ORGANIZATION_ID = parseFloat(loc_arr[0]);
            var org_index = loc_arr[1];
            //switch from required to normal font indicating the selected field has been filled in
            $("#add_patient_info_org_select").multiselect({
                classes: "mp_dcp_import_select_box"
            });
            var location_height = 31;
            var LocOptionHTML = [];
            LocOptionHTML.push('<option value="0">&nbsp;</option>');
            for (var i = 0, len = js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST.length; i < len; i++) {
            //for (var i = 0; i < js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST.length; i++) {
                location_height += 26;
                if (set_Location == js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_CD) {
                    LocOptionHTML.push('<option selected="selected" value="', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_CD, '">', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_NAME, '</option>');
                }
                else {
                    LocOptionHTML.push('<option value="', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_CD, '">', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_NAME, '</option>');
                }
            }
            if (location_height > 135) { location_height = 135; };
            $('#add_patient_info_location_select').html(LocOptionHTML.join(""));
            $("#add_patient_info_location_select").multiselect('enable');
            $("#add_patient_info_location_select").multiselect('option', 'height', location_height);
            $("#add_patient_info_location_select").multiselect('refresh');
        }

        $('#add_patient_search').on('click', function () {
            var perslookup = { "PERS_LOOKUP": {} };
            perslookup.PERS_LOOKUP.SELECT_PERSON_ID = null;
            perslookup.PERS_LOOKUP.NAME_FULL_FORMATTED = "";
            perslookup.PERS_LOOKUP.MATCH_PERSON_ID = null;
            perslookup.PERS_LOOKUP.LAST_NAME = "";
            perslookup.PERS_LOOKUP.FIRST_NAME = "";
            perslookup.PERS_LOOKUP.MIDDLE_NAME = "";
            perslookup.PERS_LOOKUP.SEX = "";
            perslookup.PERS_LOOKUP.DOB = "";
            perslookup.PERS_LOOKUP.MRN = "";
            var patientSearch = window.external.DiscernObjectFactory("PVPATIENTSEARCHMPAGE"); //creates patient search object
            var searchResult = patientSearch.SearchForPatientAndEncounter(); //launches patient search dialog and assigns the returned object to a variable when the dialog closes.
            if (searchResult.PersonId > 0) {
                perslookup.PERS_LOOKUP.SELECT_PERSON_ID = searchResult.PersonId;
                var sendArr = ["^MINE^", "^PERSLOOKUP^", 0.0, 0.0];
                MP_DCP_IMPORT_OBJECT_CCL_Request('mp_dcp_import_list', perslookup, sendArr, true, function () {
                    //set the commit values
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].MATCH_PERSON_ID = this.MATCH_PERSON_ID
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].NAME_FULL_FORMATTED = this.NAME_FULL_FORMATTED
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].LAST_NAME = this.LAST_NAME
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].FIRST_NAME = this.FIRST_NAME
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].MIDDLE_NAME = this.MIDDLE_NAME
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].SEX = this.SEX
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].DOB = this.DOB
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].MRN = this.MRN
                    //set values on dialog
                    $('#add_patient_name').html(importcsv.IMPORT_CSV.IMPORT_DATA[0].NAME_FULL_FORMATTED)
                    $('#add_patient_gender').html(importcsv.IMPORT_CSV.IMPORT_DATA[0].SEX)
					var importDataDOB = "";
					if(importcsv.IMPORT_CSV.IMPORT_DATA[0].DOB) {
						importDataDOB = new Date(importcsv.IMPORT_CSV.IMPORT_DATA[0].DOB);
						importDataDOB = importDataDOB.format(i18n.rlimport_lc.fulldate4yr);
					}
                    $('#add_patient_dob').html(importDataDOB);
                    $('#add_patient_mrn').html(importcsv.IMPORT_CSV.IMPORT_DATA[0].MRN)
                    addPtCommitCheck()
                })
            }
        })
        var mp_dcp_add_person_registry = 0;
        $("#add_patient_info_registry_select").on("multiselectclick", function (event, ui) {
            mp_dcp_add_person_registry = parseFloat(ui.value);
            //switch from required to normal font indicating the selected field has been filled in
            $("#add_patient_info_registry_select").multiselect({
                classes: "mp_dcp_import_select_box"
            });
            addPtCommitCheck()
        });
        $("#add_patient_info_cond_select").on("multiselectclick", function (event, ui) {
            importcsv.IMPORT_CSV.IMPORT_DATA[0].CONDITION_ID = parseFloat(ui.value);
            //switch from required to normal font indicating the selected field has been filled in
            $("#add_patient_info_cond_select").multiselect({
                classes: "mp_dcp_import_select_box"
            });
            addPtCommitCheck()
        });
        $("#add_patient_info_org_select").on("multiselectclick", function (event, ui) {
            var loc_obj = ui.value;
            var loc_str = String(loc_obj);
            var loc_arr = loc_str.split("|");
            importcsv.IMPORT_CSV.ORGANIZATION_ID = parseFloat(loc_arr[0]);
            var org_index = loc_arr[1];
            //switch from required to normal font indicating the selected field has been filled in
            $("#add_patient_info_org_select").multiselect({
                classes: "mp_dcp_import_select_box"
            });
            var location_height = 31;
            var LocOptionHTML = [];
            LocOptionHTML.push('<option value="0">&nbsp;</option>');
            for (var i = 0, len = js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST.length; i < len; i++) {
            //for (var i = 0; i < js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST.length; i++) {
                location_height += 26;
                if (set_Location == js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_CD) {
                    LocOptionHTML.push('<option selected="selected" value="', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_CD, '">', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_NAME, '</option>');
                }
                else {
                    LocOptionHTML.push('<option value="', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_CD, '">', js_criterion.CRITERION.ORG_LIST[org_index].LOC_LIST[i].LOC_NAME, '</option>');
                }
            }
            if (location_height > 135) { location_height = 135; };
            $('#add_patient_info_location_select').html(LocOptionHTML.join(""));
            $("#add_patient_info_location_select").multiselect('enable');
            $("#add_patient_info_location_select").multiselect('option', 'height', location_height);
            $("#add_patient_info_location_select").multiselect('refresh');
            addPtCommitCheck()
        })
        $("#add_patient_info_location_select").on("multiselectclick", function (event, ui) {
            importcsv.IMPORT_CSV.LOCATION_CD = parseFloat(ui.value);
            addPtCommitCheck()
        });
        function addPtCommitCheck() {
            if (importcsv.IMPORT_CSV.ORGANIZATION_ID > 0 && importcsv.IMPORT_CSV.IMPORT_DATA[0].CONDITION_ID != null && mp_dcp_add_person_registry != 0 && importcsv.IMPORT_CSV.IMPORT_DATA[0].MATCH_PERSON_ID != null) {
                addModal.setFooterButtonDither("addSubmit", false);
                addModal.setFooterButtonDither("addSubmitNew", false);
            }
            else {
                addModal.setFooterButtonDither("addSubmit", true);
                addModal.setFooterButtonDither("addSubmitNew", true);
            }
        }
        function commitPatientAdd(startnewVar) {
            var sendArr = ["^MINE^", "^COMMIT^", mp_dcp_add_person_registry, js_criterion.CRITERION.PRSNL_ID + ".0"];
			MP_DCP_IMPORT_OBJECT_CCL_Request('mp_dcp_import_list', JSON.stringify(importcsv).replace(/(_(?:id|cd)['"]\w*:\w*\d+)(\w*[,\}])/gi,"$1.0$2") 
, sendArr, true, function () {
                totalAddedEntries += 1
                if (startnewVar == true) {
                    restartAddPatient()
                }
                else {
                    if (gridActivated == 1) {
                        var WaitingElem = $('#mp_dcp_manage_grid_container')
                        $(WaitingElem).empty();
                        var WaitingHTML = [];
                        WaitingHTML.push('<dt id ="mp_dcp_manage_spinner_container"><span class="mp-dcp-import-spinner"></span></dt>');
                        $(WaitingElem).html(WaitingHTML.join(""))
                        refresh_managequal = { "IMPORT_CSV": {} };
                        var loc_str = String($('#filterShell-Org-Div input[name="manage_org"]').val())
                        var loc_arr = loc_str.split("|");
                        refresh_managequal.IMPORT_CSV.ORGANIZATION_ID = managequal.IMPORT_CSV.ORGANIZATION_ID
                        var sendArr = ["^MINE^", "^QUERYDATA^", 0.0, js_criterion.CRITERION.PRSNL_ID + ".0"];
                        MP_DCP_IMPORT_OBJECT_CCL_Request('mp_dcp_import_list', JSON.stringify(refresh_managequal).replace(/(_(?:id|cd)['"]\w*:\w*\d+)(\w*[,\}])/gi,"$1.0$2"), sendArr, true, function () {
                            $('#mp_dcp_manage_grid_container').empty();
                            manage_displayData = this.IMPORT_DATA
                            buildManageDataGrid(js_criterion);
                            gridActivated = 1;
                            totalAddedEntries = 0;
                        });
                    }
                }
            })
        }
    });
    function restartAddPatient() {
        $('#mp_dcp_import_add_person_icon').trigger('click')
    }
    function checkAddTotal() {
        if (totalAddedEntries > 0) {
            if (gridActivated == 1) {
                var WaitingElem = $('#mp_dcp_manage_grid_container')
                $(WaitingElem).empty();
                var WaitingHTML = [];
                WaitingHTML.push('<dt id ="mp_dcp_manage_spinner_container"><span class="mp-dcp-import-spinner"></span></dt>');
                $(WaitingElem).html(WaitingHTML.join(""))
                refresh_managequal = { "IMPORT_CSV": {} };
                var loc_str = String($('#filterShell-Org-Div input[name="manage_org"]').val())
                var loc_arr = loc_str.split("|");
                refresh_managequal.IMPORT_CSV.ORGANIZATION_ID = managequal.IMPORT_CSV.ORGANIZATION_ID
                var sendArr = ["^MINE^", "^QUERYDATA^", 0.0, js_criterion.CRITERION.PRSNL_ID + ".0"];
                MP_DCP_IMPORT_OBJECT_CCL_Request('mp_dcp_import_list', refresh_managequal, sendArr, true, function () {
                    $('#mp_dcp_manage_grid_container').empty();
                    manage_displayData = this.IMPORT_DATA
                    buildManageDataGrid(js_criterion);
                    gridActivated = 1;
                    totalAddedEntries = 0;
                });
            }
        }
    }
    //adjust heights & padding based on screen size
    //import
    var bar_width = $('#mp_dcp_import_frame_select_bar_container').width()
    var bar_leftover_width = bar_width - ($('#mp_dcp_import_box_container').width() + $('#mp_dcp_import_defintions_right').outerWidth() + $('#mp_dcp_import_orgs_right').outerWidth() + $('#mp_dcp_import_locations_right').outerWidth())
    var flex_padding_space = parseInt(bar_leftover_width / 4)
    if (flex_padding_space > 5) {
        $('.mp_dcp_import_select_right').css('paddingRight', flex_padding_space)
    }
    else {
        $('.mp_dcp_import_select_right').css('paddingRight', 5)
    }
    //manage
    var doc_height = document.documentElement.offsetHeight
    var gridsize = doc_height - (53 + $('#mp_dcp_manage_status_container').height())
    $('#mp_dcp_manage_grid_container').css('height', gridsize + 'px');
    var shellheadercontainerheight = $('#filterShell').height() - $('#filterShellButtonDiv').height() - $('#filterShellHeader').height()
    $('#filterShellHeaderContainer').css('max-height', shellheadercontainerheight + 'px').css('height', shellheadercontainerheight + 'px')
    $('#mp_dcp_manage_status_container').css("width", ($('#mp_dcp_manage_content_container').width() - $('#filterShell').width()))
    $(window).on('resize', function () {
        //close multiselects if open
        $('#conditiongrid, #org_list, #duplicate_patient_info_cond_select, #add_patient_info_location_select, #add_patient_info_org_select, #add_patient_info_registry_select, #add_patient_info_cond_select, #location_list, #registry_list').multiselect('close')
        var parentWidth = $("#conditiongrid").parents('.slick-cell').width()
        $("#conditiongrid").css("width", parentWidth)
        $("#conditiongrid").multiselect('refresh')
        //import resizing
        var toolbarH = $('#mp_dcp_import_frame_select_bar').height() + 50;
        var doc_height = document.documentElement.offsetHeight
        var gridsize = doc_height - (toolbarH + $('#mp_dcp_import_status_container').height() + 10)
        $('#filterShellHeaderContainer').css('height', shellheadercontainerheight + 'px')
        $('#mp_dcp_import_grid_container').css('top', toolbarH + 'px');
        $('#mp_dcp_import_grid_container').css('height', gridsize + 'px');
        $('.mp_dcp_import_select_right').css('paddingRight', 0)
        var bar_width = $('#mp_dcp_import_frame_select_bar_container').width()
        var bar_leftover_width = bar_width - ($('#mp_dcp_import_box_container').width() + $('#mp_dcp_import_defintions_right').outerWidth() + $('#mp_dcp_import_orgs_right').outerWidth() + $('#mp_dcp_import_locations_right').outerWidth())
        var flex_padding_space = parseInt(bar_leftover_width / 4)
        if (flex_padding_space > 5) {
            $('.mp_dcp_import_select_right').css('paddingRight', flex_padding_space)
        }
        else {
            $('.mp_dcp_import_select_right').css('paddingRight', 5)
        }
        //manage resizing
        $('#mp_dcp_manage_grid_container').css("left", ($('#filterShell').width() + 1))
        $('#mp_dcp_manage_grid_container').css("width", ($('#mp_dcp_manage_content_container').width() - ($('#filterShell').width() + 12)))
        $('#mp_dcp_manage_status_container').css("left", ($('#filterShell').width() + 1))
        $('#mp_dcp_manage_status_container').css("width", ($('#mp_dcp_manage_content_container').width() - $('#filterShell').width()))
        if (gridActivated == 1) {
            setTimeout(function () { manage_grid.autosizeColumns() }, 100)
            manage_grid.render();
        }
        var gridsize = doc_height - (53 + $('#mp_dcp_manage_status_container').height())
        $('#mp_dcp_manage_grid_container').css('height', gridsize + 'px');
        var shellpos = $('#filterShell').position()
        var shellheadercontainerheight = $('#filterShell').innerHeight() - $('#filterShellButtonDiv').height() - shellpos.top - $('#filterShellHeader').height()
        $('#filterShellHeaderContainer').css('max-height', shellheadercontainerheight + 'px').css('height', shellheadercontainerheight + 'px')
    });
    //if one organization pre check
    if (js_criterion.CRITERION.ORG_LIST.length == 1) {
        $('#filterShell-Org-Div input[name="manage_org"]').attr("checked", "checked")
    }
    if (import_access_ind == 0) {
        mp_dcp_manage_page_open()
    }
}

function RenderImportGrid(pageCriteria) {
    //Start the timer for auditing page
    
    var WaitingElem = $('#mp_dcp_import_content_container')
    var WaitingHTML = [];
    WaitingHTML.push('<dt class ="mp_dcp_import_instruct_container_text" id="mp_dcp_import_instruct_container">' + i18n.rlimport.IMPORTREGFILE + '<br/>' + i18n.rlimport.LARGEFILEMSG + '<br/><br/>');
    WaitingHTML.push('<span class="mp-dcp-import-spinner"></span>');
    $(WaitingElem).html(WaitingHTML.join(""))
    $('#mp_dcp_import_error_container').remove()
    //validate file extension, parse the file, and call function to build the grid
    var myFile = document.getElementById("importfileload");
    var myFileBuild = ('file:///' + myFile.value);
	
    if (myFile.value.match(/\.csv$/gi) == ".csv") {
        $.get(myFileBuild, function (data) {
            //Define the levels of the object needed for CCL to convert into record structure
            var importcsv = { "IMPORT_CSV": { "IMPORT_DATA": {}} };
			
            importcsv.IMPORT_CSV.IMPORT_DATA = $.csv2Dictionary(data);
			
            importcsv.IMPORT_CSV.IMPORT_DUP = [{
                CONDITION_ID: 0,
                MATCH_PERSON_ID: 0,
                NAME_FULL_FORMATTED: "",
                IGNORE_IND: 0,
                DUP_IND: 0,
                AC_CLASS_PERSON_RELTN_ID: 0,
                INSERT_REG_IND: 0,
                INSERT_CON_IND: 0,
                PARENT_CLASS_PERSON_RELTN_ID: 0,
                UPDATE_CON_IND: 0,
                UPDATE_REG_IND: 0,
                INDEPENDENT_PARENT_IND: 0,
                GROUPID: 0,
                CONDITION: "",
                LAST_NAME: "",
                FIRST_NAME: "",
                MIDDLE_NAME: "",
                SEX: "",
                DOB: "",
                MRN: "",
                DUP_ID: 0
            }]
            if (importcsv.IMPORT_CSV.IMPORT_DATA.length > 0) {
                importcsv.IMPORT_CSV.CSV_FAILURE_IND = null;
                importcsv.IMPORT_CSV.SUCCESS_CNT = null;
                importcsv.IMPORT_CSV.FAILURE_CNT = null;
                var extraColumnInd = 0;
                obj_keys = Object.keys(importcsv.IMPORT_CSV.IMPORT_DATA[0])
                
                for (var keyid = 0, len = obj_keys.length; keyid < len; keyid++) {
                //for (var keyid = 0; keyid < obj_keys.length; keyid++) {
                    if (obj_keys[keyid] != i18n.rlimport.CONDITIONCOLUMN && obj_keys[keyid] != i18n.rlimport.LASTNAMECOLUMN && obj_keys[keyid] != i18n.rlimport.FIRSTNAMECOLUMN && obj_keys[keyid] != i18n.rlimport.MIDDLENAMECOLUMN &&
			        obj_keys[keyid] != i18n.rlimport.SEXCOLUMN && obj_keys[keyid] != i18n.rlimport.DOBCOLUMN && obj_keys[keyid] != i18n.rlimport.MRNCOLUMN && obj_keys[keyid] != "MATCH_PERSON_ID") {
                        extraColumnInd = 1;
                    }
                }
				
                //Extend the JSON object to contain all of the necessary fields for CCL
                //This may not be efficient when dealing with a few thousand rows 
				if (importcsv.IMPORT_CSV.IMPORT_DATA[0].hasOwnProperty(i18n.rlimport.CONDITIONCOLUMN) == true &&
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].hasOwnProperty(i18n.rlimport.LASTNAMECOLUMN) == true &&
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].hasOwnProperty(i18n.rlimport.FIRSTNAMECOLUMN) == true &&
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].hasOwnProperty(i18n.rlimport.MIDDLENAMECOLUMN) == true &&
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].hasOwnProperty(i18n.rlimport.SEXCOLUMN) == true &&
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].hasOwnProperty(i18n.rlimport.DOBCOLUMN) == true &&
                    importcsv.IMPORT_CSV.IMPORT_DATA[0].hasOwnProperty(i18n.rlimport.MRNCOLUMN) == true && extraColumnInd == 0) {
					
					var rowArray = data.split(/\r\n|\r|\n/g);
					var jsonStr = [];
					//Iterating through each row in the CSV excluding the first row which has column headers
					for(var i = 1; i < rowArray.length; i++) {
						var array = rowArray[i].split(",");
						jsonStr.push({CONDITION: array[0],LAST_NAME: array[1],FIRST_NAME: array[2],MIDDLE_NAME: array[3],SEX: array[4],DOB: array[5],MRN: array[6]})
					}
					
					importcsv.IMPORT_CSV.IMPORT_DATA = jsonStr;
                   
                    for (var idx = 0, len = importcsv.IMPORT_CSV.IMPORT_DATA.length; idx < len; idx++) {
                    //for (var idx = 0; idx < importcsv.IMPORT_CSV.IMPORT_DATA.length; idx++) {

                        if (typeof importcsv.IMPORT_CSV.IMPORT_DATA[idx].MATCH_PERSON_ID == 'undefined' || importcsv.IMPORT_CSV.IMPORT_DATA[idx].MATCH_PERSON_ID == "") {
                            importcsv.IMPORT_CSV.IMPORT_DATA[idx].MATCH_PERSON_ID = parseFloat(0);
                        }
                        else {
                            importcsv.IMPORT_CSV.IMPORT_DATA[idx].MATCH_PERSON_ID = parseFloat(importcsv.IMPORT_CSV.IMPORT_DATA[idx].MATCH_PERSON_ID);
                        }
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].CONDITION_ID = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].NAME_FULL_FORMATTED = "";
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].IGNORE_IND = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].DUP_IND = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].AC_CLASS_PERSON_RELTN_ID = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].INSERT_REG_IND = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].INSERT_CON_IND = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].PARENT_CLASS_PERSON_RELTN_ID = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].UPDATE_CON_IND = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].UPDATE_REG_IND = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].INDEPENDENT_PARENT_IND = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].GROUPID = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].SELECTED_IND = 0;
                        importcsv.IMPORT_CSV.IMPORT_DATA[idx].dup_id = idx;
                        //importcsv.IMPORT_CSV.IMPORT_DATA[idx].CCL_IMPORT_STATUS	= "";	
                        //importcsv.IMPORT_CSV.IMPORT_DATA[idx].CCL_COMMIT_IND = null;
                    }
                    importcsv.IMPORT_CSV.ORGANIZATION_ID = set_Organization + ".0";
                    var sendArr = ["^MINE^", "^AUDIT^", 0.0, pageCriteria.CRITERION.PRSNL_ID + ".0"];
					
                    MP_DCP_IMPORT_OBJECT_CCL_Request('mp_dcp_import_list', JSON.stringify(importcsv).replace(/(_(?:id|cd)['"]\w*:\w*\d+)(\w*[,\}])/gi,"$1.0$2")
, sendArr, true, function () {

                        
						$("#org_list").multiselect('disable');
                        var filetext = $('#mp_dcp_fake_file_browse input').val()
                        $('#mp_dcp_import_file').html('<span class="mp_dcp_select_label">' + i18n.rlimport.REGISTRYFILE + '</span></br><div id="mp_dcp_import_box_container" class="mp_dcp_bold" style="line-height:1.2em;padding-top:2px;">' + filetext + '</div>')
                        displayData = this.IMPORT_DATA
                        buildDataGrid(pageCriteria);
                        mp_import_dirty_data_cnt = this.FAILURE_CNT
                        mp_import_success_data_cnt = this.SUCCESS_CNT
                        mp_import_patient_cnt = this.IMPORT_DATA.length
                        var MPDCPIMPORTStatusBarElem = $('#mp_dcp_import_status_bar');
                        var MPDCPIMPORTStatusBarHTML = [];

                        MPDCPIMPORTStatusBarHTML.push('<div id="mp_dcp_import_status_container">');
                        MPDCPIMPORTStatusBarHTML.push('<div id="mp_dcp_import_status_info">');
                        MPDCPIMPORTStatusBarHTML.push('<div id="mp_dcp_import_status_info_first_cnt"><b id="mp-dcp-import-patient-cnt">', this.IMPORT_DATA.length, '</b> ' + i18n.rlimport.ENTRIES + '</div>');
                        MPDCPIMPORTStatusBarHTML.push('<div class="mp_dcp_import_status_info_cnts"><span class="mp-dcp-import-match-success"></span>&nbsp;');
                        MPDCPIMPORTStatusBarHTML.push('<span style="vertical-align:10%;"><b id="mp-dcp-import-success-cnt">', this.SUCCESS_CNT, '</b> ' + i18n.rlimport.SUCCESSFULENTRIES + '</span></div>');
                        MPDCPIMPORTStatusBarHTML.push('<div class="mp_dcp_import_status_info_cnts"><span class="mp-dcp-import-match-failure"></span>&nbsp;');
                        MPDCPIMPORTStatusBarHTML.push('<span style="vertical-align:10%;"><b id="mp-dcp-import-failure-cnt">', this.FAILURE_CNT, '</b> ' + i18n.rlimport.MISSINGINFO + '</span></div>');
                        MPDCPIMPORTStatusBarHTML.push('</div>');
                        MPDCPIMPORTStatusBarHTML.push('<div id="mp_dcp_import_action_buttons">');
                        MPDCPIMPORTStatusBarHTML.push('<dl>');
                        MPDCPIMPORTStatusBarHTML.push('<dt id="mp_dcp_import_status_cancel_button" class="mp_dcp_import_status_button"><button value="Cancel">' + i18n.rlimport.CANCEL + '</button></dt>');
                        //MPDCPIMPORTStatusBarHTML.push('<dt id="mp_dcp_import_status_save_button" class="mp_dcp_import_status_button"><button value="Export List">i18n.rlimport.EXPORTLIST</button></dt>');
                        MPDCPIMPORTStatusBarHTML.push('<dt id="mp_dcp_import_status_commit_button" class="mp_dcp_import_status_button" ><button value="Save to Registry" disabled="disabled">' + i18n.rlimport.SAVETOREGISTRY + '</button></dt>');
                        MPDCPIMPORTStatusBarHTML.push('</dl>');
                        MPDCPIMPORTStatusBarHTML.push('</div>');
                        MPDCPIMPORTStatusBarHTML.push('</div>');
                        $(MPDCPIMPORTStatusBarElem).html(MPDCPIMPORTStatusBarHTML.join(""))
                        //$('dt.mp_dcp_import_status_button button').button();
                        if (set_Organization != 0 && mp_dcp_import_set_registry != 0 && mp_import_dirty_data_cnt == 0) {
                            $('#mp_dcp_import_status_commit_button button').removeAttr("disabled")
                        }
                        $('#mp_dcp_import_status_cancel_button button').on('click', function () {
                            document.location.reload(true)
                        });
                        /* removed export
                        $('#mp_dcp_import_status_save_button button').on('click', function () {
                        DownloadJSON2CSV(displayData)
                        });
                        */
                        $('#mp_dcp_import_status_commit_button button').on('click', function () {
                            MP_ModalDialog.deleteModalDialogObject("importsuccesseModal")
                            var successModal = new ModalDialog("importsuccesseModal")
                                .setHeaderTitle(i18n.rlimport.COMMITTINGENTRIES)
                                .setTopMarginPercentage(15)
                                .setRightMarginPercentage(30)
                                .setBottomMarginPercentage(45)
                                .setLeftMarginPercentage(30)
                                .setIsBodySizeFixed(true)
                                .setHasGrayBackground(true)
                                .setIsFooterAlwaysShown(true);
                            successModal.setBodyDataFunction(
                                    function (modalObj) {
                                        modalObj.setBodyHTML('<div id="success_dialog_cent_container" class="mp_dcp_font_12 mp_dcp_extra_line_height"><span class="mp-dcp-import-spinner"></span></div>');
                                    });
                            var closebtn = new ModalButton("successcloseAll");
                            closebtn.setText(i18n.rlimport.CLOSE).setIsDithered(true).setCloseOnClick(true);
                            successModal.addFooterButton(closebtn)
                            MP_ModalDialog.addModalDialogObject(successModal);
                            MP_ModalDialog.showModalDialog("importsuccesseModal")
                            
                            var commitData = { "IMPORT_CSV": { "IMPORT_DATA": {}} };
                            commitData.IMPORT_CSV.ORGANIZATION_ID = set_Organization + ".0";
                            commitData.IMPORT_CSV.LOCATION_CD = set_Location + ".0";
                            commitData.IMPORT_CSV.SUCCESS_CNT = 0;
                            
							
							for(var i =0; i < displayData.length; i++) {
								if(displayData[i].PARENT_CLASS_PERSON_RELTN_ID == 0) {
									displayData[i].PARENT_CLASS_PERSON_RELTN_ID = 0;
								}
							}
							commitData.IMPORT_CSV.IMPORT_DATA = displayData;
							
                            var sendArr = ["^MINE^", "^COMMIT^", mp_dcp_import_set_registry, pageCriteria.CRITERION.PRSNL_ID + ".0"];
							
                            MP_DCP_IMPORT_OBJECT_CCL_Request('mp_dcp_import_list', JSON.stringify(commitData).replace(/(_(?:id|cd)['"]\w*:\w*\d+)(\w*[,\}])/gi,"$1.0$2") 
, sendArr, true, function () {
                                var success_cnt = this.SUCCESS_CNT
                                successModal.setFooterButtonDither("successcloseAll", false);
                                successModal.setHeaderTitle(i18n.rlimport.SUCCESSFULSAVE);
                                successModal.setBodyHTML('<div id="success_dialog_cent_container" class="mp_dcp_font_12 mp_dcp_extra_line_height"><span class="mp_dcp_bold">' + success_cnt + '</span> ' + i18n.rlimport.ENTRIESSAVED + '</div>');
                            })
                        });
                        var toolbarH = $('#mp_dcp_import_frame_select_bar').height() + 50;
                        var doc_height = document.documentElement.offsetHeight
                        var gridsize = doc_height - (toolbarH + $('#mp_dcp_import_status_container').height() + 10)
                        $('#mp_dcp_import_grid_container').css('top', toolbarH + 'px');
                        $('#mp_dcp_import_grid_container').css('height', gridsize + 'px');
                        $('#mp_dcp_import_grid_container').on('mouseover mouseout', '.slick-row', function (event) {
                            var ignoreElem = $(this).find(".mp_dcp_ignored_row")
                            var conditionArrowElem = $(this).find(".mp_dcp_condition_has_value")
                            var personSearchElem = $(this).find(".mp_dcp_person_search_icon_div")
                            if (event.type == 'mouseover') {
                                $(conditionArrowElem).children('.mp_dcp_condition_arrow_div').css('display', 'inline-block')
                                $(personSearchElem).css('display', 'inline-block')
                                $(ignoreElem).text(i18n.rlimport.ACTIVATE).addClass('mp_dcp_import_blue_link mp_dcp_remove_ignore_link').on('click', function () {
                                    removeIgnoreIndicator($(ignoreElem).attr('id'))
                                });
                            } else {
                                $(conditionArrowElem).children('.mp_dcp_condition_arrow_div').css('display', 'none')
                                $(personSearchElem).css('display', 'none')
                                $(ignoreElem).text(i18n.rlimport.IGNORED).removeClass('mp_dcp_import_blue_link mp_dcp_remove_ignore_link').off('click');
                            }
                        });
                        //go through duplicates
                        if (this.IMPORT_DUP.length > 0) {
                            var importDupObj = this.IMPORT_DUP;
                            var dup_seq = 0;
                            var duplicate_total = importDupObj.length
                            var duplicate_id_seq = displayData.length;
                            if ((dup_seq + 2) <= duplicate_total) { var btn_title_cont = " >" } else { var btn_title_cont = "" }
                            var duplicateHTML = [];
                            duplicateHTML.push('<div id="duplicate_patient_info_title"><span style="font-weight:bold;">', duplicate_total, '</span> ' + i18n.rlimport.DUPLICATEENTRIES + '</div>');
                            duplicateHTML.push('<div id ="duplicate_patient_info">');
                            duplicateHTML.push('<dl class="duplicate_patient_info_row">');
                            duplicateHTML.push('<dt class="duplicate_patient_info_label">' + i18n.rlimport.NAME + ':</dt>');
                            duplicateHTML.push('<dt class="duplicate_patient_info_value">', importDupObj[dup_seq].NAME_FULL_FORMATTED, '</dt></dl>');
                            duplicateHTML.push('<dl class="duplicate_patient_info_row">');
                            duplicateHTML.push('<dt class="duplicate_patient_info_label">' + i18n.rlimport.SEX + ':</dt>');
                            duplicateHTML.push('<dt class="duplicate_patient_info_value">', importDupObj[dup_seq].SEX, '</dt></dl>');
                            duplicateHTML.push('<dl class="duplicate_patient_info_row">');
                            duplicateHTML.push('<dt class="duplicate_patient_info_label">' + i18n.rlimport.DOB + ':</dt>');
                            duplicateHTML.push('<dt class="duplicate_patient_info_value">', importDupObj[dup_seq].DOB, '</dt></dl>');
                            duplicateHTML.push('<dl class="duplicate_patient_info_row">');
                            duplicateHTML.push('<dt class="duplicate_patient_info_label">' + i18n.rlimport.MRN + ':</dt>');
                            duplicateHTML.push('<dt class="duplicate_patient_info_value">', importDupObj[dup_seq].MRN, '</dt></dl>');
                            //build condition dropdown. first get existing conditions
                            var selectHTML = [];
                            selectHTML.push('<select id="duplicate_patient_info_cond_select">')
                            var PersonMatchObjs = findInObject(displayData, { MATCH_PERSON_ID: importDupObj[dup_seq].MATCH_PERSON_ID }, false);
                            var cond_height = 31;
                            if (importDupObj[dup_seq].CONDITION_ID == 0) {
                                selectHTML.push('<option selected="selected">' + i18n.rlimport.NONEDASHES + '</option>')
                            }
                            else {
                                var DuplicateObj = findInObject(PersonMatchObjs, { CONDITION_ID: 0 }, false);
                                if (DuplicateObj.length > 0) {
                                    selectHTML.push('<option disabled="disabled" value="0">' + i18n.rlimport.NONEMIXED + '</option>')
                                }
                                else {
                                    selectHTML.push('<option value="0">' + i18n.rlimport.NONEMIXED + '</option>')
                                }
                            }
                            
                            for (var cidx = 0, len = pageCriteria.CRITERION.DEF.length; cidx < len; cidx++) {
                            //for (var cidx = 0; cidx < pageCriteria.CRITERION.DEF.length; cidx++) {
                                if (pageCriteria.CRITERION.DEF[cidx].DEF_TYPE == 2) {
                                    cond_height += 26;
                                    if (importDupObj[dup_seq].CONDITION_ID == pageCriteria.CRITERION.DEF[cidx].DEF_ID) {
                                        selectHTML.push('<option selected="selected" value="' + pageCriteria.CRITERION.DEF[cidx].DEF_ID + '">--' + pageCriteria.CRITERION.DEF[cidx].DEF_DISP + '--</option>')
                                    }
                                    else {
                                        var DuplicateObj = findInObject(PersonMatchObjs, { CONDITION_ID: pageCriteria.CRITERION.DEF[cidx].DEF_ID }, false);
                                        if (DuplicateObj.length > 0) {
                                            selectHTML.push('<option disabled="disabled" value="' + pageCriteria.CRITERION.DEF[cidx].DEF_ID + '">' + pageCriteria.CRITERION.DEF[cidx].DEF_DISP + '</option>')

                                        }
                                        else {
                                            selectHTML.push('<option value="' + pageCriteria.CRITERION.DEF[cidx].DEF_ID + '">' + pageCriteria.CRITERION.DEF[cidx].DEF_DISP + '</option>')
                                        }
                                    }
                                }
                            }
                            selectHTML.push('</select>')
                            duplicateHTML.push('<dt class="duplicate_patient_info_label">' + i18n.rlimport.CONDITION + ':</dt>');
                            duplicateHTML.push('<dt class="duplicate_patient_info_value">', selectHTML.join(""), '</dt></dl>');
                            duplicateHTML.push('</div>');
                            if (cond_height > 205) { cond_height = 205; }
                            //Build modal dialog
                            MP_ModalDialog.deleteModalDialogObject("importduplicateModal")
							var dupEntryText = i18n.rlimport.DUPLICATEENTRY.replace('{2}','{4} <span style="font-weight:normal;">');
							dupEntryText = dupEntryText.replace('{4}',i18n.rlimport.ONE);
							dupEntryText = dupEntryText.replace('{3}','</span> ' + duplicate_total + '');
                            var dupModal = new ModalDialog("importduplicateModal")
                            .setHeaderTitle(dupEntryText)
                            .setTopMarginPercentage(15)
                            .setRightMarginPercentage(30)
                            .setBottomMarginPercentage(15)
                            .setLeftMarginPercentage(30)
                            .setIsBodySizeFixed(true)
                            .setHasGrayBackground(true)
                            .setIsFooterAlwaysShown(true);
                            dupModal.setBodyDataFunction(
                                function (modalObj) {
                                    modalObj.setBodyHTML(duplicateHTML.join(""));
                                }
                            );
                            var removeallbtn = new ModalButton("dupRemoveAll");
                            removeallbtn.setText(i18n.rlimport.REMOVEALL).setCloseOnClick(true);
                            var removebtn = new ModalButton("dupRemove");
							var removeCountText = i18n.rlimport.REMOVECOUNT.replace("{10}",btn_title_cont);
                            removebtn.setText(removeCountText).setCloseOnClick(false).setOnClickFunction(function () { duplicateIteration() }
                            );
                            var cancelbtn = new ModalButton("dupCancel");
                            cancelbtn.setText(i18n.rlimport.CANCEL).setCloseOnClick(true);
                            dupModal.addFooterButton(cancelbtn)
                            dupModal.addFooterButton(removebtn)
                            dupModal.addFooterButton(removeallbtn)
                            MP_ModalDialog.addModalDialogObject(dupModal);
                            MP_ModalDialog.showModalDialog("importduplicateModal")
                            if (cond_height > 205) { cond_height = 205; }
                            $("#duplicate_patient_info_cond_select").multiselect({
                                height: cond_height,
                                header: false,
                                multiple: false,
                                classes: "mp_dcp_import_select_box",
                                noneSelectedText: i18n.rlimport.SELECTCONDITION,
                                selectedList: 1
                            });
                            $('button#dupRemoveAll').css('float', 'left')
                            $('button#dupCancel').css('float', 'right')
                            $('button#dupRemove').css('float', 'right')
                            //$('.dyn-modal-button-container button').button()
                            $('body').on("multiselectclick", "#duplicate_patient_info_cond_select", function (event, ui) {
                                if ((dup_seq + 2) <= duplicate_total) { var btn_title_cont = " >" } else { var btn_title_cont = "" }
                                if (ui.value != importDupObj[dup_seq].CONDITION_ID) {
                                    dupModal.setFooterButtonOnClickFunction("dupRemove", function () {
                                        importDupObj[dup_seq].CONDITION_ID = parseFloat(ui.value);
                                        importDupObj[dup_seq].CONDITION = ui.text;
                                        duplicate_id_seq += 1
                                        importDupObj[dup_seq].id = duplicate_id_seq
                                        dataView.addItem(importDupObj[dup_seq])
                                        mp_import_success_data_cnt += 1
                                        mp_import_patient_cnt += 1
                                        $('#mp-dcp-import-success-cnt').text(mp_import_success_data_cnt);
                                        $('#mp-dcp-import-patient-cnt').text(mp_import_patient_cnt);
                                        duplicateIteration();
                                    })
                                    //$('.dyn-modal-button-container button').button('destroy')
									var submitCountText = i18n.rlimport.SUBMITCOUNT.replace("{11}",btn_title_cont);
                                    dupModal.setFooterButtonText("dupRemove", submitCountText)
                                    //$('.dyn-modal-button-container button').button()
                                }
                                else {
                                    dupModal.setFooterButtonOnClickFunction("dupRemove", function () { duplicateIteration() })
                                    //$('.dyn-modal-button-container button').button('destroy')
									var removeCountText = i18n.rlimport.REMOVECOUNT.replace("{10}",btn_title_cont);
                                    dupModal.setFooterButtonText("dupRemove", removeCountText)
                                    //$('.dyn-modal-button-container button').button()
                                }
                            })
                            function duplicateIteration() {
                                dup_seq += 1
                                if ((dup_seq + 1) <= duplicate_total) {
                                    var duplicateHTML = [];
                                    duplicateHTML.push('<div id="duplicate_patient_info_title"><span style="font-weight:bold;">', duplicate_total, '</span> ' + i18n.rlimport.DUPLICATEENTRIES + '</div>');
                                    duplicateHTML.push('<div id ="duplicate_patient_info">');
                                    duplicateHTML.push('<dl class="duplicate_patient_info_row">');
                                    duplicateHTML.push('<dt class="duplicate_patient_info_label">' + i18n.rlimport.NAME + ':</dt>');
                                    duplicateHTML.push('<dt class="duplicate_patient_info_value">', importDupObj[dup_seq].NAME_FULL_FORMATTED, '</dt></dl>');
                                    duplicateHTML.push('<dl class="duplicate_patient_info_row">');
                                    duplicateHTML.push('<dt class="duplicate_patient_info_label">' + i18n.rlimport.SEX + ':</dt>');
                                    duplicateHTML.push('<dt class="duplicate_patient_info_value">', importDupObj[dup_seq].SEX, '</dt></dl>');
                                    duplicateHTML.push('<dl class="duplicate_patient_info_row">');
                                    duplicateHTML.push('<dt class="duplicate_patient_info_label">' + i18n.rlimport.DOB + ':</dt>');
                                    duplicateHTML.push('<dt class="duplicate_patient_info_value">', importDupObj[dup_seq].DOB, '</dt></dl>');
                                    duplicateHTML.push('<dl class="duplicate_patient_info_row">');
                                    duplicateHTML.push('<dt class="duplicate_patient_info_label">' + i18n.rlimport.MRN + ':</dt>');
                                    duplicateHTML.push('<dt class="duplicate_patient_info_value">', importDupObj[dup_seq].MRN, '</dt></dl>');
                                    //build condition dropdown. first get existing conditions
                                    var selectHTML = [];
                                    selectHTML.push('<select id="duplicate_patient_info_cond_select">')
                                    var PersonMatchObjs = findInObject(displayData, { MATCH_PERSON_ID: importDupObj[dup_seq].MATCH_PERSON_ID }, false);

                                    if (importDupObj[dup_seq].CONDITION_ID == 0) {
                                        selectHTML.push('<option selected="selected">' + i18n.rlimport.NONEDASHES + '</option>')
                                    }
                                    else {
                                        var DuplicateObj = findInObject(PersonMatchObjs, { CONDITION_ID: 0 }, false);
                                        if (DuplicateObj.length > 0) {
                                            selectHTML.push('<option disabled="disabled" value="0">' + i18n.rlimport.NONEMIXED + '</option>')
                                        }
                                        else {
                                            selectHTML.push('<option value="0">' + i18n.rlimport.NONEMIXED + '</option>')
                                        }
                                    }
                                    for (var cidx = 0, len = pageCriteria.CRITERION.DEF.length; cidx < len; cidx++) {
                                    //for (var cidx = 0; cidx < pageCriteria.CRITERION.DEF.length; cidx++) {
                                        if (pageCriteria.CRITERION.DEF[cidx].DEF_TYPE == 2) {
                                            if (importDupObj[dup_seq].CONDITION_ID == pageCriteria.CRITERION.DEF[cidx].DEF_ID) {
                                                selectHTML.push('<option selected="selected" value="' + pageCriteria.CRITERION.DEF[cidx].DEF_ID + '">--' + pageCriteria.CRITERION.DEF[cidx].DEF_DISP + '--</option>')
                                            }
                                            else {
                                                var DuplicateObj = findInObject(PersonMatchObjs, { CONDITION_ID: pageCriteria.CRITERION.DEF[cidx].DEF_ID }, false);
                                                if (DuplicateObj.length > 0) {
                                                    selectHTML.push('<option disabled="disabled" value="' + pageCriteria.CRITERION.DEF[cidx].DEF_ID + '">' + pageCriteria.CRITERION.DEF[cidx].DEF_DISP + '</option>')

                                                }
                                                else {
                                                    selectHTML.push('<option value="' + pageCriteria.CRITERION.DEF[cidx].DEF_ID + '">' + pageCriteria.CRITERION.DEF[cidx].DEF_DISP + '</option>')
                                                }
                                            }
                                        }
                                    }
                                    selectHTML.push('</select>')
                                    duplicateHTML.push('<dt class="duplicate_patient_info_label">' + i18n.rlimport.CONDITION + ':</dt>');
                                    duplicateHTML.push('<dt class="duplicate_patient_info_value">', selectHTML.join(""), '</dt></dl>');
                                    duplicateHTML.push('</div>');
                                    dupModal.setBodyHTML(duplicateHTML.join(""));
									var dupEntryText = i18n.rlimport.DUPLICATEENTRY.replace('{2}',(dup_seq + 1) + ' <span style="font-weight:normal;">');
									dupEntryText = dupEntryText.replace('{3}','</span> ' + duplicate_total);
                                    dupModal.setHeaderTitle(dupEntryText);
                                    $("#duplicate_patient_info_cond_select").multiselect({
                                        height: cond_height,
                                        header: false,
                                        multiple: false,
                                        classes: "mp_dcp_import_select_box",
                                        noneSelectedText: i18n.rlimport.SELECTCONDITION,
                                        selectedList: 1
                                    });
                                    if ((dup_seq + 2) <= duplicate_total) { var btn_title_cont = " >" } else { var btn_title_cont = "" }
                                    dupModal.setFooterButtonOnClickFunction("dupRemove", function () { duplicateIteration() })
                                    //$('.dyn-modal-button-container button').button('destroy')
									var removeCountText = i18n.rlimport.REMOVECOUNT.replace("{10}",btn_title_cont);
                                    dupModal.setFooterButtonText("dupRemove", removeCountText)
                                    dupModal.setFooterButtonText("dupRemoveAll", i18n.rlimport.REMOVEREMAINING)
                                    //$('.dyn-modal-button-container button').button()
                                }
                                else {
                                    MP_ModalDialog.closeModalDialog("importduplicateModal")
                                    RefreshGrid()
                                }
                            }
                        }
                    });
                }
                else {
                    $('#mp_dcp_import_content_container').empty()
                    var error_text = ('<div id="mp_dcp_import_error_container" class="mp_dcp_error_container"><div class="mp_dcp_error_container_text"><span class="mp-dcp-import-error-icon" style="padding-right:10px;"></span><span style="vertical-align:10%;">' + i18n.rlimport.CSVIMPORTERROR1 + '</span></div></div>')
                    $('#mp_dcp_import_frame_select_bar').prepend(error_text)
                }
            }
            else {
                $('#mp_dcp_import_content_container').empty()
                var error_text = ('<div id="mp_dcp_import_error_container" class="mp_dcp_error_container"><div class="mp_dcp_error_container_text"><span class="mp-dcp-import-error-icon" style="padding-right:10px;"></span><span style="vertical-align:10%;">' + i18n.rlimport.CSVIMPORTERROR2 + '</span></div></div>')
                $('#mp_dcp_import_frame_select_bar').prepend(error_text)
            }

        });
    }
    else {
        $('#mp_dcp_import_content_container').empty()
        var error_text = ('<div id="mp_dcp_import_error_container" class="mp_dcp_error_container"><div class="mp_dcp_error_container_text"><span class="mp-dcp-import-error-icon" style="padding-right:10px;"></span><span style="vertical-align:10%;">' + i18n.rlimport.FILEFORMATERROR + '</span></div></div>')
        $('#mp_dcp_import_frame_select_bar').prepend(error_text)
    }

    function buildDataGrid(pageCriteria) {
        var option
        var columns = [
        { id: "NAME_FULL_FORMATTED", name: i18n.rlimport.LINKEDRECORD, field: "NAME_FULL_FORMATTED", width: 240, sortable: true, resizable: true, formatter: PersonSearchFormatter },
        { id: "CONDITION", name: i18n.rlimport.CONDITION, field: "CONDITION", width: 200, sortable: true, resizable: true, editor: SelectConditionEditor, formatter: ConditionSearchFormatter },
        { id: "LAST_NAME", name: i18n.rlimport.LASTNAME, field: "LAST_NAME", sortable: true, width: 225, resizable: true, cssClass: "mp_dcp_cell_grid_pad" },
        { id: "FIRST_NAME", name: i18n.rlimport.FIRSTNAME, field: "FIRST_NAME", sortable: true, width: 175, resizable: true, cssClass: "mp_dcp_cell_grid_pad" },
        { id: "MIDDLE_NAME", name: i18n.rlimport.MIDDLENAME, field: "MIDDLE_NAME", sortable: true, width: 143, resizable: true, cssClass: "mp_dcp_cell_grid_pad" },
        { id: "SEX", name: i18n.rlimport.SEX, field: "SEX", width: 100, sortable: true, resizable: true, cssClass: "mp_dcp_cell_grid_pad" },
        { id: "DOB", name: i18n.rlimport.DOB, field: "DOB", width: 80, sortable: true, resizable: true, cssClass: "mp_dcp_cell_grid_pad" },
        { id: "MRN", name: i18n.rlimport.MRN, field: "MRN", width: 100, sortable: true, resizable: true, cssClass: "mp_dcp_cell_grid_pad" }
      ];
        var options = {
            multiColumnSort: true,
            enableColumnReorder: false,
            editable: true,
            enableAddRow: false,
            enableCellNavigation: true,
            asyncEditorLoading: false,
            autoEdit: true,
            forcefitcolumns: true,
            syncColumnCellResize: true
        };
        function PersonSearchFormatter(row, cell, value, columnDef, dataContext) {
            if (dataContext['IGNORE_IND'] == 1) {
                return "<div class='mp_dcp_bold mp_dcp_cell_grid_pad mp_dcp_ignored_row' id='" + dataContext['id'] + "'>" + i18n.rlimport.IGNORED + "</div>"
            }
            else if (dataContext['SELECTED_IND'] == 1) {
                 if (dataContext['MATCH_PERSON_ID'] == 0) {
                    return "<div class='mp_dcp_cell_grid_pad'>" + i18n.rlimport.SEARCHIGNORE + "</div>"
                 }
                 else {
                    return "<div class='mp_dcp_cell_grid_pad'>" + value + "</div>"
                 }
            }
            else {
                if (dataContext['MATCH_PERSON_ID'] == 0) {
                    return "<div class='import_cell_highlighted mp_dcp_cell_grid_pad'><a class='mp_dcp_import_blue_link mp_dcp_font mp_dcp_bold import_cell_highlighted_left_pad' title='Search' value='" + dataContext['id'] + "' onClick='LaunchPatientSearch(this)'>" + i18n.rlimport.SEARCH + "</a> |" +
            " <a class='mp_dcp_import_blue_link mp_dcp_font mp_dcp_bold' 'title='" + i18n.rlimport.IGNORE + "' value='" + dataContext['id'] + "'onClick='setIgnoreIndicator(this)'>" + i18n.rlimport.IGNORE + "</a></div>";
                }
                else {
                    if(dataContext['CONDITION_ID'] < 0) {
                        return "<div class='mp_dcp_cell_grid_pad'><div class='mp_dcp_person_value_div'><a class='mp_dcp_import_blue_link mp_dcp_font' title='" + i18n.rlimport.LAUNCHPATIENTCHART + "' onClick='javascript:APPLINK(0,\"Powerchart.exe\",\"/PERSONID=" + dataContext['MATCH_PERSON_ID'] + "\")'>" + value + "</a> | <a class='mp_dcp_import_blue_link mp_dcp_font mp_dcp_bold' 'title='" + i18n.rlimport.IGNORE + "' value='" + dataContext['id'] + "'onClick='setIgnoreIndicator(this)'>" + i18n.rlimport.IGNORE + "</a>&nbsp;</div><div class='mp_dcp_person_search_icon_div mp_dcp_import_pointer_cursor' value='" + dataContext['id'] + "' onClick='LaunchPatientSearch(this)' style='display:none;' title='" + i18n.rlimport.PERSONSEARCH + "'><span class='mp-dcp-import-person-search-icon'></span></div></div>";
                    }
                    else {
                        return "<div class='mp_dcp_cell_grid_pad'><div class='mp_dcp_person_value_div'><a class='mp_dcp_import_blue_link mp_dcp_font' title='" + i18n.rlimport.LAUNCHPATIENTCHART + "' onClick='javascript:APPLINK(0,\"Powerchart.exe\",\"/PERSONID=" + dataContext['MATCH_PERSON_ID'] + "\")'>" + value + "</a>&nbsp;</div><div class='mp_dcp_person_search_icon_div mp_dcp_import_pointer_cursor' value='" + dataContext['id'] + "' onClick='LaunchPatientSearch(this)' style='display:none;' title='" + i18n.rlimport.PERSONSEARCH + "'><span class='mp-dcp-import-person-search-icon'></span></div></div>";
                    }
                }
            }
        };
        function ConditionSearchFormatter(row, cell, value, columnDef, dataContext) {
            if (dataContext['IGNORE_IND'] == 1) {
                return "<div class='mp_dcp_cell_grid_pad'>" + value + "</div>"
            }
            else if (dataContext['SELECTED_IND'] == 1) {
                return "<div class='mp_dcp_cell_grid_pad'>" + value + "</div>"
            }
            else {
                if (dataContext['CONDITION_ID'] < 0) {
                    return "<div class='import_cell_highlighted mp_dcp_cell_grid_pad'><div class='mp_dcp_condition_value_div import_cell_highlighted_left_pad'>" + value + "</div><div class='mp_dcp_condition_arrow_div'><span class='mp-dcp-import-drop-down-icon' style='padding-right:7px;margin-top:9px;'></span></div></div>"
                }
                else {
                    return "<div class='mp_dcp_cell_grid_pad mp_dcp_condition_has_value'><div class='mp_dcp_condition_value_div'>" + value + "</div><div class='mp_dcp_condition_arrow_div' style='display:none;'><span class='mp-dcp-import-drop-down-icon' style='padding-right:6px;margin-top:9px;'></span></div></div>"
                }
            }

        };
        //build the import data array from the displaydata object
        $(function () {
            var changes = {};
            
            for (var i = 0, len = displayData.length; i < len; i++) {
            //for (var i = 0; i < displayData.length; i++) {
                displayData[i].id = i;
            }
            //build the grid div before creating the grid
            var GridElem = $('#mp_dcp_import_content_container');
            var GridHTML = [];
            GridHTML.push('<div id="mp_dcp_import_grid_container"></div>');
            $(GridElem).html(GridHTML.join(""));
            groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
            dataView = new Slick.Data.DataView({
                groupItemMetadataProvider: groupItemMetadataProvider,
                inlineFilters: true
            });
            grid = new Slick.Grid("#mp_dcp_import_grid_container", dataView, columns, options);
            // register the group item metadata provider to add expand/collapse group handlers
            grid.registerPlugin(groupItemMetadataProvider);
            //grid.setSelectionModel(new Slick.CellSelectionModel());
            grid.onCellChange.subscribe(function (e, args) {
                setTimeout(function () { dataView.updateItem(args.item.id, args.item) }, 500);
            });
            function row_metadata(old_metadata_provider) {
                return function (row) {
                    var item = this.getItem(row),
                    ret = old_metadata_provider(row);

                    if (item && item.IGNORE_IND == 1) {
                        ret = ret || {};
                        ret.cssClasses = (ret.cssClasses || '') + ' ignored';
                    }
                    else if (item && item.SELECTED_IND == 1) {
                        ret = ret || {};
                        ret.cssClasses = (ret.cssClasses || '') + ' mp_selected';
                    }
                    return ret;
                };
            }
            dataView.getItemMetadata = row_metadata(dataView.getItemMetadata);
            grid.onSort.subscribe(function (e, args) {
                var cols = args.sortCols;
                dataView.sort(function (dataRow1, dataRow2) {
                    for (var i = 0, len = cols.length; i < len; i++) {
                        var field = cols[i].sortCol.field;
                        var sign = cols[i].sortAsc ? 1 : -1;
                        var value1, value2, result;
                    
	                    //If it's a date column parse out the date from the string
	                    if(field == "DOB") {
	                    	if(dataRow1[field] == "") {
	                    		value1 = new Date();
	                    	}
	                    	else {
	                    		value1 = Date.parse(dataRow1[field]);
	                    	}
	                    	if(dataRow2[field] == "") {
	                    		value2 = new Date();
	                    	}
	                    	else {
	                    		value2 = Date.parse(dataRow2[field]);
	                    	}
	                    	
	                    	if(sign == -1) {
	                    		result = value1 - value2;
	                    	}
	                    	else {
	                    		result = value2 - value1;
	                    	}
	                    }
	                    else { //else just use the string value in upper case
	                    	value1 = dataRow1[field].toUpperCase(), value2 = dataRow2[field].toUpperCase();
	                        result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
	                    }
	                    return result;
                    }
                });
                grid.autosizeColumns();
                grid.render();
            });
            grid.onColumnsResized.subscribe(function (e, args) {
                grid.autosizeColumns();
                grid.render();
            });
            // wire up model events to drive the grid
            dataView.onRowCountChanged.subscribe(function (e, args) {
                grid.updateRowCount();
                grid.render();
            });
            dataView.onRowsChanged.subscribe(function (e, args) {
                grid.invalidateRows(args.rows);
                grid.autosizeColumns();
                grid.render();
            });
            // initialize the model after all the events have been hooked up
            dataView.beginUpdate();
            dataView.setItems(displayData,false);
            dataView.groupBy(
          "GROUPID",
          function (g) {
              if (g.value == 0) {
				  var successEntriesText = i18n.rlimport.SUCCESSFULENTRIESCOUNT.replace("{9}",g.count);
                  return "<span class='mp-dcp-import-match-success'></span>&nbsp;" + successEntriesText + "";
              }
              else if (g.value == 2) {
                  if (import_ignoreAllType == 0) {
					  var missingInfoText = i18n.rlimport.MISSINGINFOCOUNT.replace("{13}",g.count);
                      return "<span class='mp-dcp-import-match-failure'></span>&nbsp;" + missingInfoText + "&nbsp&nbsp<span id='missingInfoAllAction'><a id='PersonIgnoreALL' class='mp_dcp_import_blue_link' title='" + i18n.rlimport.IGNOREALL + "' value='ALL' onClick='setIgnoreIndicatorAll(\"IGNORE\")'>" + i18n.rlimport.IGNOREALL + "</a></span>";
                  }
                  else {
					  var missingInfoText = i18n.rlimport.MISSINGINFOCOUNT.replace("{13}",g.count);
                      return "<span class='mp-dcp-import-match-failure'></span>&nbsp;" + missingInfoText + "&nbsp&nbsp<span id='missingInfoAllAction'><a id='PersonIgnoreALL' class='mp_dcp_import_blue_link' title='" + i18n.rlimport.ACTIVATEALL + "' value='ALL' onClick='setIgnoreIndicatorAll(\"ACTIVATE\")'>" + i18n.rlimport.ACTIVATEALL + "</a></span>";
                  }
              }
          },
          function (a, b) {
              return a.value - b.value;
          }
      );
            //Add multiple collapseGroup calls by the GROUPID to collapse various groups
            dataView.collapseGroup(0);
            dataView.endUpdate();
        })
        resizegrid(grid);
        //default sort by full name then condition
        var mancols = [{ "sortCol": { "field": "NAME_FULL_FORMATTED" }, "sortAsc": true },]
        dataView.sort(function (dataRow1, dataRow2) {
                var field = "NAME_FULL_FORMATTED";
                var sign = 1;
                var value1 = dataRow1[field].toUpperCase(), value2 = dataRow2[field].toUpperCase();
                var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                if (result != 0) {
                    return result;
                }
            return 0;
        });
        var setColManual = [{ "columnId": "NAME_FULL_FORMATTED", "sortAsc": true }]
        grid.setSortColumns(setColManual)
        grid.autosizeColumns();
        grid.render();
    }
    //Begin Custom Cell Editor--Populates Conditions in a drop down 
    function SelectConditionEditor(args) {
        var $select;
        var defaultValue;
        var scope = this;
        var current_cond_text = args.item.CONDITION;
        var current_cond_id = args.item.CONDITION_ID;
        var current_group_id = args.item.GROUPID;
        this.init = function () {
            if (0 == current_cond_id) {
                option_str = '<option selected="selected" value=0> ' + i18n.rlimport.NONE + '</option>';
            }
            else {
                option_str = '<option value=0> ' + i18n.rlimport.NONE + '</option>';
            }
            var condition_height = 30;
            
            for (var cidx = 0, len = pageCriteria.CRITERION.DEF.length; cidx < len; cidx++) {
           // for (var cidx = 0; cidx < pageCriteria.CRITERION.DEF.length; cidx++) {
                if (pageCriteria.CRITERION.DEF[cidx].DEF_TYPE == 2) {
                    condition_height += 26;
                    if (pageCriteria.CRITERION.DEF[cidx].DEF_ID == current_cond_id) {
                        option_str += '<option selected="selected" value="' + pageCriteria.CRITERION.DEF[cidx].DEF_ID + '">' + pageCriteria.CRITERION.DEF[cidx].DEF_DISP + '</option>';
                    }
                    else {
                        option_str += '<option value="' + pageCriteria.CRITERION.DEF[cidx].DEF_ID + '">' + pageCriteria.CRITERION.DEF[cidx].DEF_DISP + '</option>';
                    }
                }
            }
            if (condition_height > 180) { condition_height = 180; }
            $select = $('<SELECT tabIndex="0" id="conditiongrid" multiple="multiple">' + option_str + "</SELECT>");
            $select.appendTo(args.container);
            var parentWidth = $("#conditiongrid").parents('.slick-cell').width()
            $("#conditiongrid").css("width", parentWidth)
            $("#conditiongrid").multiselect({
                height: condition_height,
                header: false,
                multiple: false,
                minWidth: "50",
                classes: "mp_dcp_import_select_box_grid",
                noneSelectedText: "",
                selectedList: 1,
                position: {
                    my: "top",
                    at: "bottom",
                    collision: "flip"
                }
            });
            $("#conditiongrid").on("multiselectclick", function (event, ui) {
                scope.loadValue(args.item)
                scope.applyValue(args.item, ui.value)
            });
            if (args.item.IGNORE_IND != 0) {
                //$select.attr("disabled","disabled")
                $("#conditiongrid").multiselect("disable")
            }
            else {
                $("#conditiongrid").multiselect("open")
            }
        };
        this.destroy = function () {
            $select.remove();
        };
        this.focus = function () {
            $select.focus();
        };
        this.loadValue = function (item) {
            $select.val(defaultValue = item[args.column.field]);
        };
        this.serializeValue = function () {
            return ($select.val());
        };
        this.applyValue = function (item, state) {
            //Check to see if the value selected was none, not an actual condition loaded in the criterion object
            if (state != null) {
                if (state == 0) {
                    item[args.column.field] = "NONE";
                    //item[args.column.field] = newConditiondisp.DEF_DISP;
                }
                else {
                    //look up the corresponding condition display for the selected condition ID to correctly populate the condition display
                    var newConditiondisp = findInObject(pageCriteria.CRITERION.DEF, { DEF_ID: state }, true);
                    item[args.column.field] = newConditiondisp.DEF_DISP;
                }
                //update the CONDITION_ID in the array to the newly selected condition_id
                var rowRemoved = 0;
                if (args.item["MATCH_PERSON_ID"] > 0) {
                    args.item["GROUPID"] = 0;
                    var PersonMatchObjs = findInObject(displayData, { MATCH_PERSON_ID: args.item["MATCH_PERSON_ID"] }, false);
                    if (PersonMatchObjs.length > 0) {
                        var DuplicateObj = findInObject(PersonMatchObjs, { CONDITION_ID: parseFloat(state) }, false);
                        if (DuplicateObj.length > 0) {
                            dataView.deleteItem(item.id);
                            rowRemoved = 1;
                            if (current_group_id == 0) {
                                mp_import_success_data_cnt -= 1;
                                $('#mp-dcp-import-success-cnt').text(mp_import_success_data_cnt);
                            } else {
                                mp_import_dirty_data_cnt -= 1;
                                $('#mp-dcp-import-failure-cnt').text(mp_import_dirty_data_cnt);
                            }
                            mp_import_patient_cnt -= 1
                            $('#mp-dcp-import-patient-cnt').text(mp_import_patient_cnt);
                            grid.invalidate();
                        }
                        else {
                            if (current_cond_id < 0) {
                                mp_import_success_data_cnt += 1;
                                $('#mp-dcp-import-success-cnt').text(mp_import_success_data_cnt);
                                mp_import_dirty_data_cnt -= 1;
                                $('#mp-dcp-import-failure-cnt').text(mp_import_dirty_data_cnt);
                            }
                            args.item["CONDITION_ID"] = parseFloat(state);
                        }
                    }
                    else {
                        if (current_cond_id < 0) {
                            mp_import_success_data_cnt += 1;
                            $('#mp-dcp-import-success-cnt').text(mp_import_success_data_cnt);
                            mp_import_dirty_data_cnt -= 1;
                            $('#mp-dcp-import-failure-cnt').text(mp_import_dirty_data_cnt);
                        }
                        args.item["CONDITION_ID"] = parseFloat(state);
                    }

                    if (set_Organization != 0 && mp_dcp_import_set_registry != 0 && mp_import_dirty_data_cnt == 0) {
                        $('#mp_dcp_import_status_commit_button button').removeAttr("disabled")
                    }
                }
                else {
                    args.item["CONDITION_ID"] = parseFloat(state);
                }
                if (rowRemoved == 0) {
                    dataView.updateItem(item.id, item);
                    grid.render();
                }
                grid.navigateNext();
            }
        };
        this.isValueChanged = function () {
            return ($select.val() != defaultValue);
        };
        this.validate = function () {
            return {
                valid: true,
                msg: null
            };
        };
        this.init();
    }
    //End Custom Condition Cell Editor  
    function resizegrid(grid) {
        //Re-sizing the grid on window size change
        $(window).resize(function () {
            grid.autosizeColumns();
            grid.render();
        });
    }
}
function RefreshGrid() {
    dataView.sort(function (dataRow1, dataRow2) {
            var field = "NAME_FULL_FORMATTED";
            var sign = 1;
            var value1 = dataRow1[field].toUpperCase(), value2 = dataRow2[field].toUpperCase();
            var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
            if (result != 0) {
                return result;
            }
        return 0;
    });
    var setColManual = [{ "columnId": "NAME_FULL_FORMATTED", "sortAsc": true }]
    grid.setSortColumns(setColManual)
    grid.invalidate();
    grid.render();
}

function LaunchPatientSearch(item) {
    //create object to execute CCL script to set selected person information
    var perslookup = { "PERS_LOOKUP": {} };
    perslookup.PERS_LOOKUP.SELECT_PERSON_ID = null;
    perslookup.PERS_LOOKUP.NAME_FULL_FORMATTED = "";
    perslookup.PERS_LOOKUP.MATCH_PERSON_ID = null;
    perslookup.PERS_LOOKUP.LAST_NAME = "";
    perslookup.PERS_LOOKUP.FIRST_NAME = "";
    perslookup.PERS_LOOKUP.MIDDLE_NAME = "";
    perslookup.PERS_LOOKUP.SEX = "";
    perslookup.PERS_LOOKUP.DOB = "";
    perslookup.PERS_LOOKUP.MRN = "";
    //the IMPORT_DATA object is the sorted object not the original, must for loop to find the ID
    var dataObjID;
    
    for (var i = 0, len = displayData.length; i < len; i++) {
    //for (var i = 0; i < displayData.length; i++) {
        if (displayData[i].id == item.value) {
            dataObjID = i
        }
    }
    //adjust the counts for those that are modifying a person
    var currentmatch = 0
    if (displayData[dataObjID].MATCH_PERSON_ID > 0) {
        currentmatch = 1
    }

    displayData[dataObjID].SELECTED_IND = 1;
    var updateObj = findInObject(displayData, { id: dataObjID }, true);
    setTimeout(function () { dataView.updateItem(dataObjID, updateObj) }, 500);
    grid.invalidate();
    var patientSearch = window.external.DiscernObjectFactory("PVPATIENTSEARCHMPAGE"); //creates patient search object
    var searchResult = patientSearch.SearchForPatientAndEncounter(); //launches patient search dialog and assigns the returned object to a variable when the dialog closes.
    if (searchResult.PersonId > 0) { //checks to make sure a valid patient id and encounter id were returned.          
        perslookup.PERS_LOOKUP.SELECT_PERSON_ID = searchResult.PersonId;
        //dont need a prsnl_id because the user already selected the person_id
        var sendArr = ["^MINE^", "^PERSLOOKUP^", 0.0, 0.0];
        MP_DCP_IMPORT_OBJECT_CCL_Request('mp_dcp_import_list', perslookup, sendArr, true, function () {
            var matchedPersonId = this.MATCH_PERSON_ID
            displayData[dataObjID].NAME_FULL_FORMATTED = this.NAME_FULL_FORMATTED;
            displayData[dataObjID].LAST_NAME = this.LAST_NAME;
            displayData[dataObjID].FIRST_NAME = this.FIRST_NAME;
            displayData[dataObjID].MIDDLE_NAME = this.MIDDLE_NAME;
            displayData[dataObjID].SEX = this.SEX;
			var dob;
			if(this.DOB) {
				dob = new Date(this.DOB);
				displayData[dataObjID].DOB = dob.format(i18n.rlimport_lc.fulldate4yr);
			} else {
				displayData[dataObjID].DOB = this.DOB;
			}            
            displayData[dataObjID].MRN = this.MRN;
            displayData[dataObjID].IGNORE_IND = 0;
            if (displayData[dataObjID].CONDITION_ID >= 0) {
                var PersonMatchObjs = findInObject(displayData, { MATCH_PERSON_ID: matchedPersonId }, false);
                if (PersonMatchObjs.length > 0) {
                    var DuplicateObj = findInObject(PersonMatchObjs, { CONDITION_ID: displayData[dataObjID].CONDITION_ID }, false);
                    if (DuplicateObj.length > 0) {
                        if (displayData[dataObjID].GROUPID == 0) {
                            mp_import_success_data_cnt -= 1;
                            $('#mp-dcp-import-success-cnt').text(mp_import_success_data_cnt);
                        } else {
                            mp_import_dirty_data_cnt -= 1
                            $('#mp-dcp-import-failure-cnt').text(mp_import_dirty_data_cnt);
                        }
                        dataView.deleteItem(displayData[dataObjID].id);
                        mp_import_patient_cnt -= 1
                        $('#mp-dcp-import-patient-cnt').text(mp_import_patient_cnt);
                        if (set_Organization != 0 && mp_dcp_import_set_registry != 0 && mp_import_dirty_data_cnt == 0) {
                            $('#mp_dcp_import_status_commit_button button').removeAttr("disabled")
                        }
                        displayData[dataObjID].SELECTED_IND = 0;
                        grid.invalidate();
                    }
                    else {
                        displayData[dataObjID].MATCH_PERSON_ID = matchedPersonId;
                        //condition_id is set to -1 if the user is trying to only load to the registry
                        if (currentmatch == 0) {
                            displayData[dataObjID].GROUPID = 0
                            mp_import_dirty_data_cnt -= 1
                            mp_import_success_data_cnt += 1;
                            $('#mp-dcp-import-success-cnt').text(mp_import_success_data_cnt);
                            $('#mp-dcp-import-failure-cnt').text(mp_import_dirty_data_cnt);
                        }
                        if (set_Organization != 0 && mp_dcp_import_set_registry != 0 && mp_import_dirty_data_cnt == 0) {
                            $('#mp_dcp_import_status_commit_button button').removeAttr("disabled")
                        }
                        displayData[dataObjID].SELECTED_IND = 0;
                        var updateObj = findInObject(displayData, { id: dataObjID }, true);
                        setTimeout(function () { dataView.updateItem(dataObjID, updateObj) }, 500);
                        grid.invalidate();
                        grid.render();
                    }
                }
                else {
                    displayData[dataObjID].MATCH_PERSON_ID = matchedPersonId;
                    //condition_id is set to -1 if the user is trying to only load to the registry
                    if (currentmatch == 0) {
                        displayData[dataObjID].GROUPID = 0
                        mp_import_dirty_data_cnt -= 1
                        mp_import_success_data_cnt += 1;
                        $('#mp-dcp-import-success-cnt').text(mp_import_success_data_cnt);
                        $('#mp-dcp-import-failure-cnt').text(mp_import_dirty_data_cnt);
                    }
                    if (set_Organization != 0 && mp_dcp_import_set_registry != 0 && mp_import_dirty_data_cnt == 0) {
                        $('#mp_dcp_import_status_commit_button button').removeAttr("disabled")
                    }
                    displayData[dataObjID].SELECTED_IND = 0;
                    var updateObj = findInObject(displayData, { id: dataObjID }, true);
                    setTimeout(function () { dataView.updateItem(dataObjID, updateObj) }, 500);
                    grid.invalidate();
                }
            }
            else {
                displayData[dataObjID].MATCH_PERSON_ID = matchedPersonId;
                displayData[dataObjID].SELECTED_IND = 0;
                var updateObj = findInObject(displayData, { id: dataObjID }, true);
                setTimeout(function () { dataView.updateItem(dataObjID, updateObj) }, 500);
                grid.invalidate();
            }
        })
    } else {
        displayData[dataObjID].SELECTED_IND = 0;
        var updateObj = findInObject(displayData, { id: dataObjID }, true);
        setTimeout(function () { dataView.updateItem(dataObjID, updateObj) }, 500);
        grid.invalidate();
    }
}

function setIgnoreIndicator(item) {
    //the displayData object is the sorted object not the original, must for loop to find the ID  
    for (var i = 0, len = displayData.length; i < len; i++) {
    //for (var i = 0; i < displayData.length; i++) {
        if (displayData[i].id == item.value) {
            displayData[i].IGNORE_IND = 1
            mp_import_dirty_data_cnt -= 1
        }
    }
    grid.invalidate();
    if (set_Organization != 0 && mp_dcp_import_set_registry != 0 && mp_import_dirty_data_cnt == 0) {
        $('#mp_dcp_import_status_commit_button button').removeAttr("disabled");
        import_ignoreAllType = 1
    }
    if (import_ignoreAllType == 0) {
        $('#missingInfoAllAction').html("<a id='PersonIgnoreALL' class='mp_dcp_import_blue_link' title='" + i18n.rlimport.IGNOREALL + "' value='ALL' onClick='setIgnoreIndicatorAll(\"IGNORE\")'>" + i18n.rlimport.IGNOREALL + "</a></span>");
    }
    else {
        $('#missingInfoAllAction').html("<a id='PersonIgnoreALL' class='mp_dcp_import_blue_link' title='" + i18n.rlimport.ACTIVATEALL + "' value='ALL' onClick='setIgnoreIndicatorAll(\"ACTIVATE\")'>" + i18n.rlimport.ACTIVATEALL + "</a></span>");
    }
}
function setIgnoreIndicatorAll(ActionMean) {
    if (ActionMean == "IGNORE") {
        mp_import_dirty_data_cnt = 0
        for (var i = 0, len = displayData.length; i < len; i++) {
        //for (var i = 0; i < displayData.length; i++) {
            if (displayData[i].MATCH_PERSON_ID == 0 || displayData[i].CONDITION_ID < 0) {
                displayData[i].IGNORE_IND = 1
            }
        }
        import_ignoreAllType = 1
    } else if (ActionMean == "ACTIVATE") {
        for (var i = 0, len = displayData.length; i < len; i++) {
       //for (var i = 0; i < displayData.length; i++) {
            if (displayData[i].IGNORE_IND == 1) {
                displayData[i].IGNORE_IND = 0
                mp_import_dirty_data_cnt += 1
            }
        }
        import_ignoreAllType = 0
    }
    grid.invalidate();
    if (set_Organization != 0 && mp_dcp_import_set_registry != 0 && mp_import_dirty_data_cnt == 0) {
        $('#mp_dcp_import_status_commit_button button').removeAttr("disabled")
    }
    else {
        $('#mp_dcp_import_status_commit_button button').attr("disabled", "disabled")
    }
    if (import_ignoreAllType == 0) {
        $('#missingInfoAllAction').html("<a id='PersonIgnoreALL' class='mp_dcp_import_blue_link' title='" + i18n.rlimport.IGNOREALL + "' value='ALL' onClick='setIgnoreIndicatorAll(\"IGNORE\")'>" + i18n.rlimport.IGNOREALL + "</a></span>");
    }
    else {
        $('#missingInfoAllAction').html("<a id='PersonIgnoreALL' class='mp_dcp_import_blue_link' title='" + i18n.rlimport.ACTIVATEALL + "' value='ALL' onClick='setIgnoreIndicatorAll(\"ACTIVATE\")'>" + i18n.rlimport.ACTIVATEALL + "</a></span>");
    }
}

function removeIgnoreIndicator(dataid) {
    //the displayData object is the sorted object not the original, must for loop to find the ID  
    for (var i = 0, len = displayData.length; i < len; i++) {
    //for (var i = 0; i < displayData.length; i++) {
        if (displayData[i].id == dataid) {
            displayData[i].IGNORE_IND = 0
            mp_import_dirty_data_cnt += 1
            import_ignoreAllType = 0
        }
    }
    grid.invalidate();
    if (set_Organization != 0 && mp_dcp_import_set_registry != 0 && mp_import_dirty_data_cnt == 0) {
        $('#mp_dcp_import_status_commit_button button').removeAttr("disabled")
    }
    else {
        $('#mp_dcp_import_status_commit_button button').attr("disabled", "disabled")
    }
    if (import_ignoreAllType == 0) {
        $('#missingInfoAllAction').html("<a id='PersonIgnoreALL' class='mp_dcp_import_blue_link' title='" + i18n.rlimport.IGNOREALL + "' value='ALL' onClick='setIgnoreIndicatorAll(\"IGNORE\")'>" + i18n.rlimport.IGNOREALL + "</a></span>");
    }
    else {
        $('#missingInfoAllAction').html("<a id='PersonIgnoreALL' class='mp_dcp_import_blue_link' title='" + i18n.rlimport.ACTIVATEALL + "' value='ALL' onClick='setIgnoreIndicatorAll(\"ACTIVATE\")'>" + i18n.rlimport.ACTIVATEALL + "</a></span>");
    }
}

function buildManageDataGrid(pageCriteria) {
    var option
    var columns = []
    var columns = [
        { id: "NAME_FULL_FORMATTED", name: i18n.rlimport.PATIENT, field: "NAME_FULL_FORMATTED", width: 240, sortable: true, resizable: true, formatter: PersonSearchFormatter },
        { id: "CONDITION", name: i18n.rlimport.CONDITION, field: "CONDITION", width: 200, sortable: true, resizable: true, cssClass: "mp_dcp_cell_grid_pad" },
        { id: "REGISTRY", name: i18n.rlimport.REGISTRY, field: "REGISTRY", sortable: true, width: 225, resizable: true, cssClass: "mp_dcp_cell_grid_pad" },
        { id: "LOCATION_NAME", name: i18n.rlimport.LOCATION, field: "LOCATION_NAME", sortable: true, width: 175, resizable: true, cssClass: "mp_dcp_cell_grid_pad" },
        { id: "SEX", name: i18n.rlimport.SEX, field: "SEX", width: 100, sortable: true, resizable: true, cssClass: "mp_dcp_cell_grid_pad" },
        { id: "DOB", name: i18n.rlimport.DOB, field: "DOB", width: 80, sortable: true, resizable: true, cssClass: "mp_dcp_cell_grid_pad" },
        { id: "MRN", name: i18n.rlimport.MRN, field: "MRN", width: 100, sortable: true, resizable: true, cssClass: "mp_dcp_cell_grid_pad" },
        { id: "IMPORT_DT_TM", name: i18n.rlimport.DATEADDED, field: "IMPORT_DT_TM", sortable: true, width: 143, resizable: true, cssClass: "mp_dcp_cell_grid_pad" }
      ];
            var checkboxSelector = new Slick.CheckboxSelectColumn({
                cssClass: "mp_dcp_cell_grid_pad_checkbox"
            });
            if (manage_del_ind == 1) {
                columns.unshift(checkboxSelector.getColumnDefinition());
            }
    var options = {
        multiColumnSort: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true,
        forcefitcolumns: true,
        syncColumnCellResize: true
    };
    function PersonSearchFormatter(row, cell, value, columnDef, dataContext) {
        return "<div class='mp_dcp_cell_grid_pad'><a class='mp_dcp_import_blue_link mp_dcp_font' title='" + i18n.rlimport.LAUNCHPATIENTCHART + "' onClick='javascript:APPLINK(0,\"Powerchart.exe\",\"/PERSONID=" + dataContext['MATCH_PERSON_ID'] + "\")'>" + value + "</a>&nbsp;</div>";
    };
    function myFilter(item, args) {
        var conditionFound = 0;
        var locationFound = 0;
        var registryFound = 0;
        for (var i = 0, len = args.containsCondition.length; i < len; i++) {
        //for (var i = 0; i < args.containsCondition.length; i++) {
            if (args.containsCondition[i] == "" || item["CONDITION"].indexOf(args.containsCondition[i]) != -1) {
                conditionFound = 1;
            }
        }
        if (conditionFound == 0) {
            return false;
        }
        
        for (var i = 0, len = args.containsLocation.length; i < len; i++) {
        //for (var i = 0; i < args.containsLocation.length; i++) {
            if (args.containsLocation[i] == "No Location") {
                if (item["LOCATION_NAME"] == "") {
                    locationFound = 1;
                }
            }
            else if (args.containsLocation[i] == "" || item["LOCATION_NAME"].indexOf(args.containsLocation[i]) != -1) {
                locationFound = 1;
            }
        }
        if (locationFound == 0) {
            return false;
        }
        for (var i = 0, len = args.containsRegistry.length; i < len; i++) {
        //for (var i = 0; i < args.containsRegistry.length; i++) {
            if (args.containsRegistry[i] == "" || item["REGISTRY"].indexOf(args.containsRegistry[i]) != -1) {
                registryFound = 1;
            }
        }
        if (registryFound == 0) {
            return false;
        }
        upperCaseLName = item["LAST_NAME"].toUpperCase()
        upperCaseFName = item["FIRST_NAME"].toUpperCase()
        upperCaseFullName = item["NAME_FULL_FORMATTED"].toUpperCase()
        upperCaseMRN = item["MRN"].toUpperCase()
        upperCaseDOB = item["DOB"].toUpperCase()
        if (args.searchString != "" && upperCaseFullName.indexOf(args.searchString) == -1 && upperCaseLName.indexOf(args.searchString) == -1 && upperCaseFName.indexOf(args.searchString) == -1 && upperCaseMRN.indexOf(args.searchString) == -1
        && upperCaseDOB.indexOf(args.searchString) == -1) {
            return false;
        }
        var itemTempDate = item["IMPORT_DT_TM"];
		var arr = ["dd/mm/yy","dd.mm.yy"];
		var arrPosition = $.inArray(i18n.rlimport_lc.fulldate2yr,arr)
		if(arrPosition != -1) {
			if(arrPosition == 0) {
				splitDate = itemTempDate.split(/\//);
				changedFormat = [splitDate[1],splitDate[0],splitDate[2]].join('/');
			} else {
				splitDate = itemTempDate.split(/\./);
				changedFormat = [splitDate[1],splitDate[0],splitDate[2]].join('/');
			}
			itemTempDate = changedFormat;
		} 
		var itemDate = Date.parse(itemTempDate);
        if (args.manageBeginDate != "") {
            var filterDate = Date.parse(manageBeginDate)
            if (itemDate < filterDate) {
                return false;
            } 
        }
		
        if (args.manageEndDate != "") {
            var filterDate = Date.parse(manageEndDate)
            if (itemDate > filterDate) {
                return false;
            }
        }
        return true;
    }
    //build the import data array from the displaydata object
    $(function () {
        var changes = {};
        for (var i = 0, len = manage_displayData.length; i < len; i++) {
            //for (var i = 0; i < manage_displayData.length; i++) {
            manage_displayData[i].id = i;
        }
        manage_dataView = new Slick.Data.DataView({
            inlineFilters: true
        });
        manage_grid = new Slick.Grid("#mp_dcp_manage_grid_container", manage_dataView, columns, options);
        //if (manage_del_ind == 1) {
            manage_grid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
        //}
        manage_grid.registerPlugin(checkboxSelector);
        manage_grid.onCellChange.subscribe(function (e, args) {
            setTimeout(function () { manage_dataView.updateItem(args.item.id, args.item) }, 500);
        });
        manage_grid.onSort.subscribe(function (e, args) {
            var cols = args.sortCols;
            manage_dataView.sort(function (dataRow1, dataRow2) {
                for (var i = 0, len = cols.length; i < len; i++) {
                    var field = cols[i].sortCol.field;
                    var sign = cols[i].sortAsc ? 1 : -1;
                    var value1, value2, result;
                    
                    //If it's a date column parse out the date from the string
                    if(field == "DOB" || field == "IMPORT_DT_TM") {
                    	if(dataRow1[field] == "") {
                    		value1 = new Date();
                    	}
                    	else {
                    		value1 = Date.parse(dataRow1[field]);
                    	}
                    	if(dataRow2[field] == "") {
                    		value2 = new Date();
                    	}
                    	else {
                    		value2 = Date.parse(dataRow2[field]);
                    	}
                    	
                    	if(sign == -1) {
                    		result = value1 - value2;
                    	}
                    	else {
                    		result = value2 - value1;
                    	}
                    }
                    else { //else just use the string value in upper case
                    	value1 = dataRow1[field].toUpperCase(), value2 = dataRow2[field].toUpperCase();
                    	result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                   }
                    
                	return result;
                }
            });
            
            manage_grid.autosizeColumns();
            manage_grid.render();
        });
        manage_grid.onColumnsResized.subscribe(function (e, args) {
            manage_grid.autosizeColumns();
            manage_grid.render();
        });
        // wire up model events to drive the grid
        manage_dataView.onRowCountChanged.subscribe(function (e, args) {
            manage_grid.updateRowCount();
            manage_grid.render();
        });
        //manage_dataView.onSelectedRowsChanged.subscribe(function () {alert('row_change') });
        manage_dataView.onRowsChanged.subscribe(function (e, args) {
            manage_grid.invalidateRows(args.rows);
            manage_grid.autosizeColumns();
            manage_grid.render();
        });
        //rowselected event
        //if (manage_del_ind == 1) {
            manage_grid.onSelectedRowsChanged.subscribe(function () {
                var selectedRows = manage_grid.getSelectedRows();
                if (selectedRows.length === 0) {
                    $('#mp_dcp_manage_delete_selected button').attr('disabled', 'disabled')
                }
                else {
                    $('#mp_dcp_manage_delete_selected button').removeAttr('disabled')
                }
            });
        //}
        // initialize the model after all the events have been hooked up
        manage_dataView.beginUpdate();
        manage_dataView.setItems(manage_displayData,true);
        manage_dataView.setFilterArgs({
            containsLocation: containsLocation,
            containsCondition: containsCondition,
            containsRegistry: containsRegistry,
            searchString: searchString,
            manageBeginDate: manageBeginDate,
            manageEndDate: manageEndDate
        });
        manage_dataView.setFilter(myFilter);
        //Add multiple collapseGroup calls by the GROUPID to collapse various groups
        manage_dataView.endUpdate();
        manage_dataView.syncGridSelection(manage_grid, true);
    })
    //default sort by full name then condition
    manage_dataView.sort(function (dataRow1, dataRow2) {
            var field = "NAME_FULL_FORMATTED";
            var sign = 1;
            var value1 = dataRow1[field].toUpperCase(), value2 = dataRow2[field].toUpperCase();
            var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
            if (result != 0) {
                return result;
            }
        return 0;
    });
    var setColManual = [{ "columnId": "NAME_FULL_FORMATTED", "sortAsc": true }]
    manage_grid.setSortColumns(setColManual)
    manage_grid.autosizeColumns();
    manage_grid.render();
    manage_dataView.reSort();
    $('#mp_dcp_manage_filter_count').text(manage_dataView.getLength())
    if (manage_dataView.getLength() == 0) {
        $('#mp_dcp_manage_grid_container').append('<div id="mp_dcp_manage_no_results" style="position:fixed;top:85;left:45%;z-index:9000px;">' + i18n.rlimport.NORESULTRETURNED + '</div>')
    }
    $('#mp_dcp_manage_filter_count').css('font-weight', 'bold')
    $("#filterTab").click(function () {
        manage_grid.autosizeColumns();
        manage_grid.render();
    })
}

function updateFilter() {
    $('#mp_dcp_manage_no_results').remove()
    manage_dataView.setFilterArgs({
        containsLocation: containsLocation,
        containsCondition: containsCondition,
        containsRegistry: containsRegistry,
        searchString: searchString,
        manageBeginDate: manageBeginDate,
        manageEndDate: manageEndDate
    });
    manage_dataView.refresh();
    $('#mp_dcp_manage_filter_count').text(manage_dataView.getLength())
    if (manage_dataView.getLength() == 0) {
        $('#mp_dcp_manage_grid_container').append('<div id="mp_dcp_manage_no_results" style="position:fixed;top:85;left:45%;z-index:9000px;">' + i18n.rlimport.NORESULTRETURNED + '</div>')
    }
}
