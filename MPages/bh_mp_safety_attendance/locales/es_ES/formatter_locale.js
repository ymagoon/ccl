/**
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
