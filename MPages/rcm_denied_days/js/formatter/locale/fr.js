/**
 * Locale file for the formatting utilized across all English locales.
 * Locales supported:
 * French - France (fr-fr)
 * 
 * Locales available for support:
 * French - Belgium (fr-be)
 * French - Canada (fr-ca)
 * French - Luxembourg (fr-lu)
 * French - Switzerland (fr-ch)
 */
if (typeof MPAGE_LC == "undefined") 
    var MPAGE_LC = {};

MPAGE_LC.fr_FR = {
    "decimal_point": ",",
    "thousands_sep": " ",
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
    fulldatetimenoyr: "dd/mm h:MM TT"
};
