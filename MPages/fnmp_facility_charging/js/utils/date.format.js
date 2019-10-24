/*
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

var dateFormat = function ()
{
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len)
		{
		    val = String(val);
		    len = len || 2;
		    while (val.length < len) val = "0" + val;
		    return val;
		};

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc)
    {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date))
        {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:")
        {
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
			    d: d,
			    dd: pad(d),
			    ddd: dF.i18n.dayNames[D],
			    dddd: dF.i18n.dayNames[D + 7],
			    m: m + 1,
			    mm: pad(m + 1),
			    mmm: dF.i18n.monthNames[m],
			    mmmm: dF.i18n.monthNames[m + 12],
			    yy: String(y).slice(2),
			    yyyy: y,
			    h: H % 12 || 12,
			    hh: pad(H % 12 || 12),
			    H: H,
			    HH: pad(H),
			    M: M,
			    MM: pad(M),
			    s: s,
			    ss: pad(s),
			    l: pad(L, 3),
			    L: pad(L > 99 ? Math.round(L / 10) : L),
			    t: H < 12 ? "a" : "p",
			    tt: H < 12 ? "am" : "pm",
			    T: H < 12 ? "A" : "P",
			    TT: H < 12 ? "AM" : "PM",
			    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

        return mask.replace(token, function ($0)
        {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
} ();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    shortDate2: "mm/dd/yyyy",
    shortDate3: "mm/dd/yy",
    shortDate4: "mm/yyyy",
    shortDate5: "yyyy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    militaryTime: "HH:MM",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
    longDateTime: "mm/dd/yyyy h:MM:ss TT Z",
    longDateTime2: "mm/dd/yy HH:MM",
    longDateTime3: "mm/dd/yyyy HH:MM",
    longDateTime4: "mm/dd/yyyy HH:MM Z",
    shortDateTime: "mm/dd h:MM TT"
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
Date.prototype.format = function (mask, utc)
{
    return dateFormat(this, mask, utc);
};

Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?" +
        "Z?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var date = new Date(d[1], 0, 1);

    // set the times
    if (d[7]) { date.setUTCHours(d[7]); } else { date.setUTCHours(0); }
    if (d[8]) { date.setUTCMinutes(d[8]); } else { date.setUTCMinutes(0); }
    if (d[10]) { date.setUTCSeconds(d[10]); } else { date.setUTCSeconds(0); }
    if (d[12]) { date.setUTCMilliseconds(Number("0." + d[12]) * 1000); } else { date.setUTCMilliseconds(0); }

    // set year before month/date
    if (d[1]) { date.setUTCFullYear(d[1]); }

    // set date before month
    if (d[5]) { date.setUTCDate(d[5]); }
    if (d[3]) { date.setUTCMonth(d[3] - 1); }

    this.setTime(date.getTime());
};

function validate_time(Obj)
{
    var b = true;
    var e = window.event;
    var str1, str2, key_code = get_keycode(e), d = new Date();
    var oElement = window.event.srcElement;
    switch (key_code)
    {
        case 78: // n -> current time
            Obj.value = String(d.getHours()).padL(2, "0") + ":" + String(d.getMinutes()).padL(2, "0");
            break;
    }
    if (!window.event.shiftKey && !window.event.ctrlKey && !window.event.altKey)
    {
        if ((key_code > 47 && key_code < 58) || (key_code > 95 && key_code < 106))
        {
            if (key_code > 95)
            {
                key_code -= (95 - 47);
            }
            var idx = Obj.value.search(/([*:]*)$/);

            if (idx == 0 &&
				(String.fromCharCode(key_code) == '0' ||
				 String.fromCharCode(key_code) == '1' ||
				 String.fromCharCode(key_code) == '2'))
            {
                var test = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                idx = test.search(/[*]/);
                if (idx == -1)
                {
                    if (isValidTime(test))
                    {
                        Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                    }
                }
                else
                {
                    Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                }
            }
            else if (idx == 1 && ((Obj.value.substring(0, 1) == "1") || (Obj.value.substring(0, 1) == "0") ||
			                       (Obj.value.substring(0, 1) == "2" && (String.fromCharCode(key_code) == '0' ||
			                       										String.fromCharCode(key_code) == '1' ||
																		String.fromCharCode(key_code) == '2' ||
																		String.fromCharCode(key_code) == '3'))))
            {
                var test = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                idx = test.search(/[*]/);
                if (idx == -1)
                {
                    if (isValidTime(test))
                    {
                        Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                    }
                }
                else
                {
                    Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                }
            }
            else if (idx == 2 &&
					(String.fromCharCode(key_code) == '0' ||
					 String.fromCharCode(key_code) == '1' ||
					 String.fromCharCode(key_code) == '2' ||
					 String.fromCharCode(key_code) == '3' ||
					 String.fromCharCode(key_code) == '4' ||
					 String.fromCharCode(key_code) == '5'))
            {
                var test = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                idx = test.search(/[*]/);
                if (idx == -1)
                {
                    if (isValidTime(test))
                    {
                        Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                    }
                }
                else
                {
                    Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                }
            }
            else if (idx != 0 && idx != 1 && idx != 2)
            {
                var test = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                idx = test.search(/[*]/);
                if (idx == -1)
                {
                    if (isValidTime(test))
                    {
                        Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                    }
                }
                else
                {
                    Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                }
            }

        }
        if (key_code == 8)
        {
            if (!Obj.value.match(/^[*0-9]{2}:[*0-9]{2}$/))
            {
                Obj.value = "**:**";
            }
            else if (Obj.value.match(/^[*0-9]{2}:[*0-9]{2}$/) && isTextSelected(Obj))
            {
                Obj.value = "**:**";
            }
            var range = document.selection.createRange();
            range.moveStart('character', -Obj.value.length);
            var idx = range.text.length;
            if (Obj.value.charAt(idx - 1) != ":")
                Obj.value = Obj.value.replaceAt(idx - 1, "*");
            $(Obj).setCursorPosition(idx - 1);
            window.event.returnValue = 0;
        }

        if (key_code == 46)
        {
            Obj.value = "**:**";
        }
    }
    // Obj.value = format_time(Obj.value);

    if (key_code != 9 && key_code != 37 && key_code != 39)
    {
        event.returnValue = false;
        return false;
    }

    return true;
}

function format_time(val)
{
    var len = val.length;
    var ret = '';
    switch (len)
    {
        case 1:
            ret = val + "*:**";
            break;
        case 2:
            ret = val + ":**";
            break;
        case 4:
            ret = val + "**";
            break;
        case 5:
            ret = val;
            break;
        default:
            ret = "**:**";
    }
    return (ret);
}
function get_keycode(e)
{
    var characterCode;
    if (e && e.which)
    { // NN4 specific code
        e = e;
        characterCode = e.which;
    }
    else
    {
        characterCode = e.keyCode; // IE specific code
    }
    return characterCode;
};
function daysInMonth(iMonth, iYear)
{
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function validate_date(Obj)
{
    var e = window.event;
    var key_code = get_keycode(e), d = new Date();
    switch (key_code)
    {
        case 84: //t -> today
            Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(d.getDate()).padL(2, "0") + "/" + d.getFullYear();
            break;
        case 89: //y -> beginning of year
            Obj.value = String(1).padL(2, "0") + "/" + String(1).padL(2, "0") + "/" + d.getFullYear();
            break;
        case 82: //r -> end of year
            Obj.value = String(12).padL(2, "0") + "/" + String(31).padL(2, "0") + "/" + d.getFullYear();
            break;
        case 77: //m -> beginning of month
            Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(1).padL(2, "0") + "/" + d.getFullYear();
            break;
        case 72: //h -> end of month
            Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(daysInMonth(d.getMonth(), d.getFullYear())).padL(2, "0") + "/" + d.getFullYear();
            break;
        case 87: //w -> beginning of week
            Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(d.getDate() - d.getDay()).padL(2, "0") + "/" + d.getFullYear();
            break;
        case 75: //k -> end of week
            Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(d.getDate() + (6 - d.getDay())).padL(2, "0") + "/" + d.getFullYear();
            break;
    }

    if (!window.event.shiftKey && !window.event.ctrlKey && !window.event.altKey)
    {

        if ((key_code > 47 && key_code < 58) || (key_code > 95 && key_code < 106))
        {
            if (key_code > 95)
            {
                key_code -= (95 - 47);
            }

            var idx = Obj.value.search(/[*]/); //(/([*\/]*)[*]([*\/]*)$/);

            if (idx == 0 && (String.fromCharCode(key_code) == '0' || String.fromCharCode(key_code) == '1'))
            {
                var test = Obj.value.replace(/[*]/, String.fromCharCode(key_code));

                idx = test.search(/[*]/);
                if (idx == -1)
                {
                    if (isDate(test))
                    {
                        Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                    }
                }
                else
                {
                    Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                }
            }
            else if (idx == 3 &&
					(String.fromCharCode(key_code) == '0' ||
					 String.fromCharCode(key_code) == '1' ||
					 String.fromCharCode(key_code) == '2' ||
					 String.fromCharCode(key_code) == '3'))
            {

                var test = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                idx = test.search(/[*]/);

                if (idx == -1)
                {
                    if (isDate(test))
                    {
                        Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                    }
                }
                else
                {
                    Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                }
            }
            else if (idx == 4)
            {
                if (Obj.value.substring(3, 4) == '3')
                {
                    if (String.fromCharCode(key_code) == '0' || String.fromCharCode(key_code) == '1')
                    {
                        Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                    }
                }
                else
                {
                    Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                }
            }
            else if (idx != 0 && idx != 3)
            {
                var test = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                idx = test.search(/[*]/);
                if (idx == -1)
                {
                    if (isDate(test))
                    {
                        Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                    }
                }
                else
                {
                    Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                }
            }
        }

        if (key_code == 8)
        {
            if (!Obj.value.match(/^[*0-9]{2}\/[*0-9]{2}\/[*0-9]{4}$/))
            {
                Obj.value = "**/**/****";
            }
            else if (Obj.value.match(/^[*0-9]{2}\/[*0-9]{2}\/[*0-9]{4}$/) && isTextSelected(Obj))
            {
                Obj.value = "**/**/****";
            }
            var range = document.selection.createRange();
            range.moveStart('character', -Obj.value.length);
            var idx = range.text.length;
            if (Obj.value.charAt(idx - 1) != "/")
                Obj.value = Obj.value.replaceAt(idx - 1, "*");
            $(Obj).setCursorPosition(idx - 1);
            window.event.returnValue = 0;
        }

        if (key_code == 46)
        {
            Obj.value = "**/**/****";
        }
    }

    if (key_code != 9 && key_code != 37 && key_code != 39)
    {
        event.returnValue = false;
        return false;
    }
    return true;
}

String.prototype.replaceAt = function (index, char)
{
    return this.substr(0, index) + char + this.substr(index + char.length);
}



function isTextSelected(input)
{
    if (typeof input.selectionStart == "number")
    {
        return input.selectionStart == 0 && input.selectionEnd == input.value.length;
    } else if (typeof document.selection != "undefined")
    {
        input.focus();
        return document.selection.createRange().text == input.value;
    }
}

String.prototype.padL = function (nLength, sChar)
{
    var sreturn = this;
    while (sreturn.length < nLength)
    {
        sreturn = String(sChar) + sreturn;
    }
    return sreturn;
}


function NumOnly()
{
    if (window.event.srcElement.readOnly)
    {
        return;
    }
    var oElement = window.event.srcElement;
    var key_code = window.event.keyCode;
    if ((key_code > 58 || key_code < 47) && key_code != 8 && key_code != 46 && key_code != 37 && key_code != 39 && key_code != 9)
    {
        window.event.returnValue = 0;
    }
}

function isDate(txtDate)
{
    var objDate,  // date object initialized from the txtDate string
        mSeconds, // txtDate in milliseconds
        day,      // day
        month,    // month
        year;     // year

    // extract month, day and year from the txtDate (expected format is mm/dd/yyyy)
    // subtraction will cast variables to integer implicitly (needed
    // for !== comparing)
    month = txtDate.substring(0, 2) - 1; // because months in JS start from 0
    day = txtDate.substring(3, 5) - 0;
    year = txtDate.substring(6, 10) - 0;

    // convert txtDate to milliseconds
    mSeconds = (new Date(year, month, day)).getTime();
    // initialize Date() object from calculated milliseconds
    objDate = new Date();
    objDate.setTime(mSeconds);
    // compare input date and parts from Date() object
    // if difference exists then date isn't valid
    if (objDate.getFullYear() !== year ||
        objDate.getMonth() !== month ||
        objDate.getDate() !== day)
    {
        return false;
    }
    // otherwise return true
    return true;
}
function isValidTime(inputTime)
{
    var splittime = inputTime.split(":");
    if (splittime[0] > 23 || splittime[1] > 59)
    {
        return false;
    }
    return true;
}
new function ($)
{
    $.fn.setCursorPosition = function (pos)
    {
        if ($(this).get(0).setSelectionRange)
        {
            $(this).get(0).setSelectionRange(pos, pos);
        } else if ($(this).get(0).createTextRange)
        {
            var range = $(this).get(0).createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }
} (jQuery);



