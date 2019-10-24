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
 
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
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
 
		var	_ = utc ? "getUTC" : "get",
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
	shortDate:      "dd/m/yy",
	shortDate2:     "dd/mm/yyyy",
	shortDate3:		"dd/mm/yy",
	shortDate4:		"mm/yyyy",
	shortDate5:		"yyyy",
	mediumDate:     "d mmm, yyyy",
	longDate:       "d mmmm, yyyy",
	fullDate:       "dddd, d mmmm, yyyy",
	shortTime:      "HH:MM",
	mediumTime:     "HH:MM:ss",
	longTime:       "HH:MM:ss Z",
	militaryTime:   "HH:MM",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
	longDateTime: 	"dd/mm/yyyy HH:MM:ss Z",
	longDateTime2:	"dd/mm/yy HH:MM",
	longDateTime3:	"dd/mm/yyyy HH:MM",
	shortDateTime:	"dd/mm HH:MM",
	mediumDateNoYear: "d mmm"
};
 
// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb.",
		"Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
	],
	monthNames: [
		"Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sep.", "Oct.", "Nov.", "Dic.",
		"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
	]
};
 
// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
 
// For i18n formatting...
/**
 * Sets <code>this</code> instance of the Date object to the value specified by the UTC date/time string.
 * 
 * The setISO8601 method only accepts date/time strings in the format with a Zulu offset.
 * Examples of setISO8601 string inputs are: "2009-07-01", "2009-07-01T17:31:00Z" and "2009-07-01T17:31:00.000Z"
 * Please be aware that when "2009-07-01" is passed in, it is equivalent to "2009-07-01T00:00:00Z"
 * 
 * setISO8601 method is duplicated in all the locale date.format.js files
 * 
 * The year/month/date/time has to be set in a certain order to avoid inadvertent changes in the date/time.
 * The rules governing the order are:
 * 		year must be set before month and date (to avoid issues with leap year)
 * 		date must be set before month (to avoid issues with months not supporting the 31st on +offset tz)
 * 		times should be set before date/month/year (because setting the time on certain dates can cause date adjustments)
 * 
 * @param string - An ISO8601 formatted date/time string
 */
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
};/**
 * Locale file for the formatting utilized across all English locales.
 * Locales supported:
 * Spanish – Spain (Modern) (es-es)
 * 
 * Locales available for support:
 * Spanish - Spain (Traditional)
 * Spanish - Argentina (es-ar)
 * Spanish - Bolivia (es-bo
 * Spanish - Chile (es-cl)
 * Spanish - Colombia (es-co)
 * Spanish - Costa Rica (es-cr)
 * Spanish - Dominican Republic (es-do)
 * Spanish - Ecuador (es-ec)
 * Spanish - Guatemala (es-gt)
 * Spanish - Honduras (es-hn)
 * Spanish - Mexico (es-mx)
 * Spanish - Nicaragua (es-ni)
 * Spanish - Panama (es-pa)
 * Spanish - Peru (es-pe)
 * Spanish - Puerto Rico (es-pr)
 * Spanish - Paraguay (es-py)
 * Spanish - El Salvador (es-sv)
 * Spanish - Uruguay (es-uy)
 * Spanish - Venezuela (es-ve)
 */
if (typeof MPAGE_LC == "undefined"){
    var MPAGE_LC = {};
}

MPAGE_LC.es_ES = {
    "decimal_point": ",",
    "thousands_sep": ".",
    "grouping": "3",
    
    // Some common date/time format strings (formats for usage with date.format.js)
    time24hr: "HH:MM:ss",
    time24hrnosec: "HH:MM",
    shortdate2yr: "d/m/yy",
    fulldate2yr: "dd/mm/yy",
    fulldate4yr: "dd/mm/yyyy",
    fullmonth4yrnodate: "mm/yyyy",
    full4yr: "yyyy",
    fulldatetime2yr: "dd/mm/yy HH:MM",
    fulldatetime4yr: "dd/mm/yyyy HH:MM",
    fulldatetimenoyr: "dd/mm h:MM TT",
	fulldatetimeMMM4yr:"dd/mmm/yyyy HH:MM:ss"
};
