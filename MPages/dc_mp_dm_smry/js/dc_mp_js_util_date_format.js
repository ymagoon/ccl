/*~BB~*************************************************************************
      *                                                                       *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &         *
      *                              Technology, Inc.                         *
      *       Revision      (c) 1984-2009 Cerner Corporation                  *
      *                                                                       *
      *  Cerner (R) Proprietary Rights Notice:  All rights reserved.          *
      *  This material contains the valuable properties and trade secrets of  *
      *  Cerner Corporation of Kansas City, Missouri, United States of        *
      *  America (Cerner), embodying substantial creative efforts and         *
      *  confidential information, ideas and expressions, no part of which    *
      *  may be reproduced or transmitted in any form or by any means, or     *
      *  retained in any storage or retrieval system without the express      *
      *  written permission of Cerner.                                        *
      *                                                                       *
      *  Cerner is a registered mark of Cerner Corporation.                   *
      *                                                                       *
	  * 1. Scope of Restrictions                                              *
	  *  A.  Us of this Script Source Code shall include the right to:        *
	  *  (1) copy the Script Source Code for internal purposes;               *
	  *  (2) modify the Script Source Code;                                   *
	  *  (3) install the Script Source Code in Client’s environment.          *
	  *  B. Use of the Script Source Code is for Client’s internal purposes   *
	  *     only. Client shall not, and shall not cause or permit others, to  *
	  *     sell, redistribute, loan, rent, retransmit, publish, exchange,    *
	  *     sublicense or otherwise transfer the Script Source Code, in       *
	  *     whole or part.                                                    *
	  * 2. Protection of Script Source Code                                   *
	  *  A. Script Source Code is a product proprietary to Cerner based upon  *
	  *     and containing trade secrets and other confidential information   *
      *     not known to the public. Client shall protect the Script Source   *
	  *     Code with security measures adequate to prevent disclosures and   *
	  *     uses of the Script Source Code.                                   *
	  *  B. Client agrees that Client shall not share the Script Source Code  *
	  *     with any person or business outside of Client.                    *
	  * 3. Client Obligations                                                 *
	  *  A. Client shall make a copy of the Script Source Code before         *
	  *     modifying any of the scripts.                                     *
	  *  B. Client assumes all responsibility for support and maintenance of  *
	  *     modified Script Source Code.                                      *
	  *  C. Client assumes all responsibility for any future modifications to *
      *     the modified Script Source Code.                                  *
	  *  D. Client assumes all responsibility for testing the modified Script * 
	  *     Source Code prior to moving such code into Client’s production    *
	  *     environment.                                                      *
	  *  E. Prior to making first productive use of the Script Source Code,   *
	  *     Client shall perform whatever tests it deems necessary to verify  *
	  *     and certify that the Script Source Code, as used by Client,       *
	  *     complies with all FDA and other governmental, accrediting, and    *
	  *     professional regulatory requirements which are applicable to use  *
	  *     of the scripts in Client's environment.                           *
	  *  F. In the event Client requests that Cerner make further             *
	  *     modifications to the Script Source Code after such code has been  *
	  *     modified by Client, Client shall notify Cerner of any             *
	  *     modifications to the code and will provide Cerner with the        *
	  *     modified Script Source Code. If Client fails to provide Cerner    *
	  *     with notice and a copy of the modified Script Source Code, Cerner *
	  *     shall have no liability or responsibility for costs, expenses,    *
	  *     claims or damages for failure of the scripts to function properly *
	  *     and/or without interruption.                                      *
	  * 4. Limitations                                                        *
	  *  A. Client acknowledges and agrees that once the Script Source Code is*
	  *     modified, any warranties set forth in the Agreement between Cerner*
	  *     and Client shall not apply.                                       *
	  *  B. Cerner assumes no responsibility for any adverse impacts which the*
	  *     modified Script Source Code may cause to the functionality or     *
	  *     performance of Client’s System.                                   *
	  *  C. Client waives, releases, relinquishes, and discharges Cerner from *
      *     any and all claims, liabilities, suits, damages, actions, or      *
	  *     manner of actions, whether in contract, tort, or otherwise which  *
	  *     Client may have against Cerner, whether the same be in            *
	  *     administrative proceedings, in arbitration, at law, in equity, or *
      *     mixed, arising from or relating to Client’s use of Script Source  *
	  *     Code.                                                             *
	  * 5. Retention of Ownership                                             *
	  *    Cerner retains ownership of all software and source code in this   *
	  *    service package. Client agrees that Cerner owns the derivative     *
	  *    works to the modified source code. Furthermore, Client agrees to   *
	  *    deliver the derivative works to Cerner.                            *
  ~BE~************************************************************************/
/******************************************************************************
 
        Source file name:       dc_mp_js_date_format.js
 
        Product:                Discern Content
        Product Team:           Discern Content
 
        File purpose:           Formats the date into different strings.
 
        Special Notes:          <add any special notes here>
 
;~DB~**************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                    *
;******************************************************************************
;*                                                                            *
;*Mod Date     Engineer             Feature      Comment                      *
;*--- -------- -------------------- ------------ -----------------------------*
;*000 12/15/09  PT018777             ######       Initial Release              *
;*                                                                            *
;~DE~**************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/

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
	shortDate:      "m/d/yy",
	shortDate2:     "mm/dd/yyyy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	militaryTime:   "HH:MM",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
	longDateTime: 	"mm/dd/yyyy h:MM:ss TT Z",
	longDateTime2:	"mm/dd/yy HH:MM",
	longDateTime3:	"mm/dd/yyyy HH:MM",
	shortDateTime:	"mm/dd h:MM TT"
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
 
// For i18n formatting...
Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));
 
    var offset = 0;
    var date = new Date(d[1], 0, 1);
 
    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }
 
    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
};