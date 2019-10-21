/**
 * Locale file for the formatting utilized across all English locales.
 * Locales supported:
 * English - United States (en-us)
 * English - Australia (en-au)
 * English - Great Britain (en-gb)
 * 
 * Locales available for support:
 * English - Belize (en-bz)
 * English - Canada (en-ca)
 * English - Caribbean (en-cb)
 * English - India (en-in)
 * English - Ireland (en-ie)
 * English - Jamaica (en-jm)
 * English - Malaysia (en-my)
 * English - New Zealand (en-nz)
 * English - Phillippines (en-ph)
 * English - Singapore (en-sg)
 * English - Southern Africa (en-za)
 * English - Trinidad (en-tt)
 * English - Zimbabwe (en-zw)
 */
if (typeof MPAGE_LC == "undefined"){
    var MPAGE_LC = {};
}

MPAGE_LC.en_US = {
    "decimal_point": ".",
    "thousands_sep": ",",
    "grouping": "3",
    
    // Some common date/time format strings (formats for usage with date.format.js)
    time24hr: "HH:MM:ss",
    time24hrnosec: "HH:MM",
    shortdate2yr: "m/d/yy",
    fulldate2yr: "mm/dd/yy",
    fulldate4yr: "mm/dd/yyyy",
    fullmonth4yrnodate: "mm/yyyy",
    full4yr: "yyyy",
    fulldatetime2yr: "mm/dd/yy HH:MM",
    fulldatetime4yr: "mm/dd/yyyy HH:MM",
    fulldatetimenoyr: "mm/dd h:MM TT",
	fulldatetimeMMM4yr:"dd/mmm/yyyy HH:MM:ss"
};

MPAGE_LC.en_AU = {
    "decimal_point": ".",
    "thousands_sep": ",",
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

MPAGE_LC.en_GB = {
    "decimal_point": ".",
    "thousands_sep": ",",
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