/**
* Project: fnmp_formatter
* Version 1.0.0
* Derived: http://scm.discern-abu.cerner.corp/svn/core-components/trunk/javascript/formatter/formatter.js
*/

//http://software.dzhuvinov.com/jsworld-numeric-formatting.html

mp_formatter = {};

mp_formatter.Locale = function (properties)
{
    this._className = "mp_formatter.Locale";
    this._parseList = function (names, expectedItems)
    {
        var array = [];
        if (names == null)
        {
            throw "Names not defined";
        }
        else if (typeof names == "object")
        {
            array = names;
        }
        else if (typeof names == "string")
        {
            array = names.split(";", expectedItems);
            for (var i = 0; i < array.length; i++)
            {
                if (array[i][0] == "\"" && array[i][array[i].length - 1] == "\"")
                    array[i] = array[i].slice(1, -1);
                else
                    throw "Missing double quotes";
            }
        }
        else
        {
            throw "Names must be an array or a string";
        }
        if (array.length != expectedItems)
            throw "Expected " + expectedItems + " items, got " + array.length;
        return array;
    };
    this._validateFormatString = function (formatString)
    {
        if (typeof formatString == "string" && formatString.length > 0)
            return formatString;
        else
            throw "Empty or no string";
    };
    if (properties == null || typeof properties != "object")
        throw "Error: Invalid/missing locale properties";

    if (typeof properties.decimal_point != "string")
        throw "Error: Invalid/missing decimal_point property";
    this.decimal_point = properties.decimal_point;
    if (typeof properties.thousands_sep != "string")
        throw "Error: Invalid/missing thousands_sep property";
    this.thousands_sep = properties.thousands_sep;
    if (typeof properties.grouping != "string")
        throw "Error: Invalid/missing grouping property";
    this.grouping = properties.grouping;

    if (properties == null || typeof properties != "object")
        throw "Error: Invalid/missing time locale properties";
    try
    {
        this.time24hr = this._validateFormatString(properties.time24hr);
    }
    catch (error)
    {
        throw "Error: Invalid time24hr property: " + error;
    }
    try
    {
        this.time24hrnosec = this._validateFormatString(properties.time24hrnosec);
    }
    catch (error)
    {
        throw "Error: Invalid time24hrnosec property: " + error;
    }
    try
    {
        this.shortdate2yr = this._validateFormatString(properties.shortdate2yr);
    }
    catch (error)
    {
        throw "Error: Invalid shortdate2yr property: " + error;
    }
    try
    {
        this.fulldate4yr = this._validateFormatString(properties.fulldate4yr);
    }
    catch (error)
    {
        throw "Error: Invalid fulldate4yr property: " + error;
    }
    try
    {
        this.fulldate2yr = this._validateFormatString(properties.fulldate2yr);
    }
    catch (error)
    {
        throw "Error: Invalid fulldate2yr property: " + error;
    }
    try
    {
        this.fullmonth4yrnodate = this._validateFormatString(properties.fullmonth4yrnodate);
    }
    catch (error)
    {
        throw "Error: Invalid fullmonth4yrnodate property: " + error;
    }
    try
    {
        this.full4yr = this._validateFormatString(properties.full4yr);
    }
    catch (error)
    {
        throw "Error: Invalid full4yr property: " + error;
    }
    try
    {
        this.fulldatetime2yr = this._validateFormatString(properties.fulldatetime2yr);
    }
    catch (error)
    {
        throw "Error: Invalid fulldatetime2yr property: " + error;
    }
    try
    {
        this.fulldatetime4yr = this._validateFormatString(properties.fulldatetime4yr);
    }
    catch (error)
    {
        throw "Error: Invalid fulldatetime4yr property: " + error;
    }
    try
    {
        this.fulldatetimenoyr = this._validateFormatString(properties.fulldatetimenoyr);
    }
    catch (error)
    {
        throw "Error: Invalid fulldatetimenoyr property: " + error;
    }
};

mp_formatter._getPrecision = function (optionsString)
{
    if (typeof optionsString != "string")
        return -1;
    var m = optionsString.match(/\.(\d)/);
    if (m)
        return parseInt(m[1], 10);
    else
        return -1;
};

mp_formatter._isNumber = function (arg)
{
    if (typeof arg == "number")
        return true;
    if (typeof arg != "string")
        return false;
    var s = arg + "";
    return (/^-?(\d+|\d*\.\d+)$/).test(s);
};

mp_formatter._isDate = function (arg)
{
    if (arg.getDate)
        return true;

    return false;
}

mp_formatter._trim = function (str)
{
    var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    for (var i = 0; i < str.length; i++)
    {
        if (whitespace.indexOf(str.charAt(i)) === -1)
        {
            str = str.substring(i);
            break;
        }
    }
    for (i = str.length - 1; i >= 0; i--)
    {
        if (whitespace.indexOf(str.charAt(i)) === -1)
        {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};

mp_formatter._splitNumber = function (amount)
{
    if (typeof amount == "number")
        amount = amount + "";
    var obj = {};
    if (amount.charAt(0) == "-")
        amount = amount.substring(1);
    var amountParts = amount.split(".");
    if (!amountParts[1])
        amountParts[1] = "";
    obj.integer = amountParts[0];
    obj.fraction = amountParts[1];
    return obj;
};

mp_formatter._formatIntegerPart = function (intPart, grouping, thousandsSep)
{
    if (thousandsSep == "" || grouping == "-1")
        return intPart;
    var groupSizes = grouping.split(";");
    var out = "";
    var pos = intPart.length;
    var size;
    while (pos > 0)
    {
        if (groupSizes.length > 0)
            size = parseInt(groupSizes.shift(), 10);
        if (isNaN(size))
            throw "Error: Invalid grouping";
        if (size == -1)
        {
            out = intPart.substring(0, pos) + out;
            break;
        }
        pos -= size;
        if (pos < 1)
        {
            out = intPart.substring(0, pos + size) + out;
            break;
        }
        out = thousandsSep + intPart.substring(pos, pos + size) + out;
    }
    return out;
};

mp_formatter._formatFractionPart = function (fracPart, precision)
{
    for (var i = 0; fracPart.length < precision; i++)
        fracPart = fracPart + "0";
    return fracPart;
};

mp_formatter._hasOption = function (option, optionsString)
{
    if (typeof option != "string" || typeof optionsString != "string")
        return false;
    if (optionsString.indexOf(option) != -1)
        return true;
    else
        return false;
};

mp_formatter._validateFormatString = function (formatString)
{
    if (typeof formatString == "string" && formatString.length > 0)
        return true;
    else
        return false;
};

mp_formatter.NumericFormatter = function (locale)
{
    if (typeof locale != "object" || locale._className != "mp_formatter.Locale")
        throw "Constructor error: You must provide a valid mp_formatter.Locale instance";
    this.lc = locale;
    /*
    argument to modify the output format:
    "^" suppress grouping
    ".n" specify decimal precision n
    */
    this.format = function (number, options)
    {
        if (typeof number == "string")
            number = mp_formatter._trim(number);
        if (!mp_formatter._isNumber(number))
            throw "Error: The input is not a number";
        var floatAmount = parseFloat(number, 10);
        var reqPrecision = mp_formatter._getPrecision(options);
        if (reqPrecision != -1)
            floatAmount = Math.round(floatAmount * Math.pow(10, reqPrecision)) / Math.pow(10, reqPrecision);
        var parsedAmount = mp_formatter._splitNumber(String(floatAmount));
        var formattedIntegerPart;

        if (floatAmount === 0)
            formattedIntegerPart = "0";
        else
            formattedIntegerPart = mp_formatter._hasOption("^", options) ? parsedAmount.integer : mp_formatter._formatIntegerPart(parsedAmount.integer, this.lc.grouping, this.lc.thousands_sep);
        var formattedFractionPart = reqPrecision != -1 ? mp_formatter._formatFractionPart(parsedAmount.fraction, reqPrecision) : parsedAmount.fraction;
        var formattedAmount = formattedFractionPart.length ? formattedIntegerPart + this.lc.decimal_point + formattedFractionPart : formattedIntegerPart;

        return formattedAmount;
    };
};
/*
* The singleton DateTimeFormatter has a dependency on the date.format.js (http://blog.stevenlevithan.com/archives/date-time-format)
*/
mp_formatter.DateTimeFormatter = function (locale)
{
    if (typeof locale != "object" || locale._className != "mp_formatter.Locale")
        throw "Constructor error: You must provide a valid mp_formatter.Locale instance";
    this.lc = locale;

    this.formatISO8601 = function (dateStr, option)
    {
        if (!mp_formatter._validateFormatString(dateStr))
            throw "Error: The input is either empty or no string";

        var date = new Date();
        date.setISO8601(dateStr);
        return this.format(date, option);
    }

    this.format = function (dateTime, option)
    {
        if (!mp_formatter._isDate(dateTime))
            throw "Error: The input is not a date object";

        switch (option)
        {
            case mp_formatter.DateTimeFormatter.TIME_24HOUR:
                return dateTime.format(this.lc.time24hr)
                break;
            case mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS:
                return dateTime.format(this.lc.time24hrnosec)
                break;
            case mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR:
                return dateTime.format(this.lc.shortdate2yr)
                break;
            case mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR:
                return dateTime.format(this.lc.fulldate4yr)
                break;
            case mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR:
                return dateTime.format(this.lc.fulldate2yr)
                break;
            case mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE:
                return dateTime.format(this.lc.fullmonth4yrnodate)
                break;
            case mp_formatter.DateTimeFormatter.FULL_4YEAR:
                return dateTime.format(this.lc.full4yr)
                break;
            case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR:
                return dateTime.format(this.lc.fulldatetime2yr)
                break;
            case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR:
                return dateTime.format(this.lc.fulldatetime4yr)
                break;
            case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_NO_YEAR:
                return dateTime.format(this.lc.fulldatetimenoyr)
                break;
            default:
                alert("Unhandled date time formatting option")
        }
    }
};

//Constants for DateFormat
mp_formatter.DateTimeFormatter.TIME_24HOUR = 1;
mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS = 2;
mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR = 3;
mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR = 4;
mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR = 5;
mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE = 6;
mp_formatter.DateTimeFormatter.FULL_4YEAR = 7;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR = 8;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR = 9;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_NO_YEAR = 10;