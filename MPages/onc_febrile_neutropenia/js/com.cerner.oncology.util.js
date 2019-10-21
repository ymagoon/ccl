if(typeof(DOMParser) == 'undefined') {
    var xmldata = null;
    DOMParser = function() {};
    DOMParser.prototype.parseFromString = function(str, contentType) {
        if(typeof(ActiveXObject) != 'undefined') {
             xmldata = new ActiveXObject('MSXML.DomDocument');
             xmldata.async = false;
             xmldata.loadXML(str);
             return xmldata;
        } else if(typeof(XMLHttpRequest) != 'undefined') {
             xmldata = new XMLHttpRequest();
             if(!contentType) {
                contentType = 'application/xml';
             }
             xmldata.open('GET', 'data:' + contentType + ';charset=utf-8,' + encodeURIComponent(str), false);
             if(xmldata.overrideMimeType) {
                xmldata.overrideMimeType(contentType);
             }
             xmldata.send(null);
             return xmldata.responseXML;
        }
    };
}

/**
 * Retrieves the viewport width.
 * 
 * @return {Number} Viewport width, in pixels.
 * 
 * Taken from http://13thparallel.com/archive/viewport/.
 */
var getViewportWidth = function() {
  var width = 0;
  if( document.documentElement && document.documentElement.clientWidth ) {
    width = document.documentElement.clientWidth;
  }
  else if( document.body && document.body.clientWidth ) {
    width = document.body.clientWidth;
  }
  else if( window.innerWidth ) {
    width = window.innerWidth - 18;
  }
  return width;
};

/**
 * Retrieves the viewport height.
 * 
 * @return {Number} Viewport height, in pixels.
 * 
 * Taken from http://13thparallel.com/archive/viewport/.
 */
var getViewportHeight = function() {
  var height = 0;
  if( document.documentElement && document.documentElement.clientHeight ) {
    height = document.documentElement.clientHeight;
  }
  else if( document.body && document.body.clientHeight ) {
    height = document.body.clientHeight;
  }
  else if( window.innerHeight ) {
    height = window.innerHeight - 18;
  }
  return height;
};

/**
 * Retrieves the viewport horizontal coordinate.
 * 
 * @return {Number} Viewport horizontal scroll, in pixels.
 * 
 * Taken from http://13thparallel.com/archive/viewport/.
 */
var getViewportScrollX = function() {
  var scrollX = 0;
  if( document.documentElement && document.documentElement.scrollLeft ) {
    scrollX = document.documentElement.scrollLeft;
  }
  else if( document.body && document.body.scrollLeft ) {
    scrollX = document.body.scrollLeft;
  }
  else if( window.pageXOffset ) {
    scrollX = window.pageXOffset;
  }
  else if( window.scrollX ) {
    scrollX = window.scrollX;
  }
  return scrollX;
};

/**
 * Retrieves the viewport vertical coordinate.
 * 
 * @return {Number} Viewport vertical scroll, in pixels.
 * 
 * Taken from http://13thparallel.com/archive/viewport/.
 */
var getViewportScrollY = function() {
  var scrollY = 0;
  if( document.documentElement && document.documentElement.scrollTop ) {
    scrollY = document.documentElement.scrollTop;
  }
  else if( document.body && document.body.scrollTop ) {
    scrollY = document.body.scrollTop;
  }
  else if( window.pageYOffset ) {
    scrollY = window.pageYOffset;
  }
  else if( window.scrollY ) {
    scrollY = window.scrollY;
  }
  return scrollY;
};

/**
 * Retrieves the absolute width of the viewport, with scrolling included.
 * 
 * @return {Number} The absolute viewport width, in pixels.
 */
var getAbsoluteViewportWidth = function() {
    return (getViewportWidth() * 1) + getViewportScrollX();
};

/**
 * Retrieves the absolute height of the viewport, with scrolling included.
 * 
 * @return {Number} The absolute viewport height, in pixels.
 */
var getAbsoluteViewportHeight = function() {
    return (getViewportHeight() * 1) + getViewportScrollY();
};

/**
 * @class window
 */
/** 
 * Namespace registration function.
 * 
 * @method registerNS
 * 
 * @param {String} ns A '.'-separated namespace.
 */
var registerNS = function(ns)
{
    var nsParts = ns.split(".");
    var root = window;

    for(var i=0; i<nsParts.length; i++)
    {
        if (root[nsParts[i]] === null || typeof(root[nsParts[i]]) !== "object") {
            root[nsParts[i]] = {};
        }
        root = root[nsParts[i]];
    }
};

/**
 * Add a function to all Strings that will remove leading and trailing white-
 * spaces, newline characters, etc.
 * 
 * @method trim
 * 
 * @return {String} This String, stripped of leading and trailing whitespace,
 *          newline characters, etc.
 */
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/gm, '');        
};