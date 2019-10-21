/*
 Blackbird - Open Source JavaScript Logging Utility
 Author: G Scott Olson
 Web: http://blackbirdjs.googlecode.com/
 http://www.gscottolson.com/blackbirdjs/
 Version: 1.0

 The MIT License - Copyright (c) 2008 Blackbird Project
 */
window.CERN_Platform = window.CERN_Platform ? window.CERN_Platform : window.parent.CERN_Platform;
(function() {
    var NAMESPACE = 'log';
    var IE6_POSITION_FIXED = true; // enable IE6 {position:fixed}

    var bbird;
    var outputList;
    var cache = [];
    var loggingActive;
    var state = getState();
    var classes = {};
    var profiler = {};
    var IDs = {
        blackbird: 'blackbird',
        checkbox: 'bbVis',
        filters: 'bbFilters',
        controls: 'bbControls',
        size: 'bbSize'
    }
    var messageTypes = { //order of these properties imply render order of filter controls
        debug: true,
        info: true,
        warn: true,
        error: true,
        profile: true
    };

    function isLoggingActive() {
        return (state.active || loggingActive) ? true : false;
    }

    function generateMarkup() { //build markup
        var spans = [];
        for (type in messageTypes) {
            spans.push([ '<span class="', type, '" type="', type, '"></span>' ].join(''));
        }

        var newNode = document.createElement('DIV');
        newNode.id = IDs.blackbird;
        newNode.style.display = 'none';
        newNode.innerHTML = [
            '<div class="header">',
            '<div class="left">',
            '<div id="', IDs.filters, '" class="filters" title="click to filter by message type">', spans.join(''), '</div>',
            '</div>',
            '<div class="right">',
            '<div id="', IDs.controls, '" class="controls">',
            '<span id="', IDs.size, '" title="contract" op="resize"></span>',
            '<span class="clear" title="clear" op="clear"></span>',
            '<span class="close" title="close" op="close"></span>',
            '</div>',
            '</div>',
            '</div>',
            '<div class="main">',
            '<div class="left"></div><div class="mainBody">',
            '<ol>', cache.join(''), '</ol>',
            '</div><div class="right"></div>',
            '</div>'/*,
             '<div class="footer">',
             '<div class="left"><label for="', IDs.checkbox, '"><input type="checkbox" id="', IDs.checkbox, '" />Visible on page load</label></div>',
             '<div class="right"></div>',
             '</div>'*/
        ].join('');
        return newNode;
    }

    function backgroundImage() { //(IE6 only) change <BODY> tag's background to resolve {position:fixed} support
        var bodyTag = document.getElementsByTagName('BODY')[ 0 ];

        if (bodyTag.currentStyle && IE6_POSITION_FIXED) {
            if (bodyTag.currentStyle.backgroundImage == 'none') {
                bodyTag.style.backgroundImage = 'url(about:blank)';
            }
            if (bodyTag.currentStyle.backgroundAttachment == 'scroll') {
                bodyTag.style.backgroundAttachment = 'fixed';
            }
        }
    }

    function addMessage(type, content) { //adds a message to the output list
        content = ( content.constructor == Array ) ? content.join('') : content;
        if (outputList) {
            var newMsg = document.createElement('LI');
            newMsg.className = type;
            newMsg.innerHTML = [ '<span class="icon"></span>', content ].join('');
            outputList.appendChild(newMsg);
            scrollToBottom();
        } else {
            cache.push([ '<li class="', type, '"><span class="icon"></span>', content, '</li>' ].join(''));
        }
    }

    function clear() { //clear list output
        outputList.innerHTML = '';
    }

    function clickControl(evt) {
        if (!evt) evt = window.event;
        var el = ( evt.target ) ? evt.target : evt.srcElement;

        if (el.tagName == 'SPAN') {
            switch (el.getAttributeNode('op').nodeValue) {
                case 'resize':
                    resize();
                    break;
                case 'clear':
                    clear();
                    break;
                case 'close':
                    hide();
                    break;
            }
        }
    }

    function clickFilter(evt) { //show/hide a specific message type
        if (!evt) evt = window.event;
        var span = ( evt.target ) ? evt.target : evt.srcElement;

        if (span && span.tagName == 'SPAN') {

            var type = span.getAttributeNode('type').nodeValue;

            if (evt.altKey) {
                var filters = document.getElementById(IDs.filters).getElementsByTagName('SPAN');

                var active = 0;
                for (entry in messageTypes) {
                    if (messageTypes[ entry ]) active++;
                }
                var oneActiveFilter = ( active == 1 && messageTypes[ type ] );

                for (var i = 0; filters[ i ]; i++) {
                    var spanType = filters[ i ].getAttributeNode('type').nodeValue;

                    filters[ i ].className = ( oneActiveFilter || ( spanType == type ) ) ? spanType : spanType + 'Disabled';
                    messageTypes[ spanType ] = oneActiveFilter || ( spanType == type );
                }
            }
            else {
                messageTypes[ type ] = !messageTypes[ type ];
                span.className = ( messageTypes[ type ] ) ? type : type + 'Disabled';
            }

            //build outputList's class from messageTypes object
            var disabledTypes = [];
            for (type in messageTypes) {
                if (!messageTypes[ type ]) disabledTypes.push(type);
            }
            disabledTypes.push('');
            outputList.className = disabledTypes.join('Hidden ');

            scrollToBottom();
        }
    }

    function clickVis(evt) {
        if (!evt) evt = window.event;
        var el = ( evt.target ) ? evt.target : evt.srcElement;

        state.load = el.checked;
        setState();
    }


    function scrollToBottom() { //scroll list output to the bottom
        outputList.scrollTop = outputList.scrollHeight;
    }

    function isVisible() { //determine the visibility
        return ( bbird.style.display == 'block' );
    }

    function hide() {
        bbird.style.display = 'none';
    }

    function show() {
        var body = document.getElementsByTagName('BODY')[ 0 ];
        body.removeChild(bbird);
        body.appendChild(bbird);
        bbird.style.display = 'block';
    }

    //sets the position
    function reposition(position) {
        if (position === undefined || position == null) {
            position = ( state && state.pos === null ) ? 1 : ( state.pos + 1 ) % 4; //set to initial position ('topRight') or move to next position
        }

        switch (position) {
            case 0:
                classes[ 0 ] = 'bbTopLeft';
                break;
            case 1:
                classes[ 0 ] = 'bbTopRight';
                break;
            case 2:
                classes[ 0 ] = 'bbBottomLeft';
                break;
            case 3:
                classes[ 0 ] = 'bbBottomRight';
                break;
        }
        state.pos = position;
        setState();
    }

    function resize(size) {
        if (size === undefined || size === null) {
            size = ( state && state.size == null ) ? 1 : ( state.size + 1 ) % 2;
        }

        classes[ 1 ] = ( size === 0 ) ? 'bbSmall' : 'bbLarge'

        var span = document.getElementById(IDs.size);
        span.title = ( size === 1 ) ? 'small' : 'large';
        span.className = span.title;

        state.size = size;
        setState();
        scrollToBottom();
    }

    function setLogging() {
        state.active = true;
        state.load = true;
        state.size = 1;
        setState();
    }

    function stopLogging() {
        state.active = false;
        state.load = false;
        state.size = 1;
        setState();
    }

    function setState() {
        var props = [];
        for (entry in state) {
            var value = ( state[ entry ] && state[ entry ].constructor === String ) ? '"' + state[ entry ] + '"' : state[ entry ];
            props.push('"' + entry + '"' + ':' + value);
        }
        props = props.join(',');

        var expiration = new Date();
        expiration.setDate(expiration.getDate() + 14);
        document.cookie = [ 'blackbird={', props, '};' ].join('');

        var newClass = [];
        for (word in classes) {
            newClass.push(classes[ word ]);
        }
        //Check to see if the blackbird has been rendered before setting the className
        if (bbird) {
            bbird.className = newClass.join(' ');
        }
    }

    function getState() {
        var defState = { pos: null, size: null, load: null, active: null };
        var re = new RegExp(/blackbird=({[^;]+})(;|\b|$)/);
        var match = re.exec(document.cookie);

        try {
            return ( match && match[ 1 ] ) ? JSON.parse(match[ 1 ]) : defState;
        } catch (error) {
            return defState;
        }
    }

    //event handler for 'keyup' event for window
    function readKey(evt) {
        if (!evt) evt = window.event;
        var code = 113; //F2 key

        if (evt && evt.keyCode == code) {

            var visible = isVisible();

            if (visible && evt.shiftKey && evt.altKey) clear();
            else if (visible && evt.shiftKey) reposition();
            else if (!evt.shiftKey && !evt.altKey) {
                if (isLoggingActive()) {
                    ( visible ) ? hide() : show();
                }
            }
        }
    }

    //event management ( thanks John Resig )
    function addEvent(obj, type, fn) {
        var obj = ( obj.constructor === String ) ? document.getElementById(obj) : obj;
        if (obj.attachEvent) {
            obj[ 'e' + type + fn ] = fn;
            obj[ type + fn ] = function() {
                obj[ 'e' + type + fn ](window.event)
            };
            obj.attachEvent('on' + type, obj[ type + fn ]);
        } else obj.addEventListener(type, fn, false);
    }

    function removeEvent(obj, type, fn) {
        var obj = ( obj.constructor === String ) ? document.getElementById(obj) : obj;
        if (obj.detachEvent) {
            if (obj[ type + fn ] != undefined) {
                obj.detachEvent('on' + type, obj[ type + fn ]);
            }
            obj[ type + fn ] = null;
        } else {
            obj.removeEventListener(type, fn, false);
        }
    }

    window[ NAMESPACE ] = {
        toggle: function() {
            if (isLoggingActive()) {
                ( isVisible() ) ? hide() : show();
            }
        },
        resize: function() {
            resize();
        },
        clear: function() {
            clear();
        },
        move: function() {
            reposition();
        },
        debug: function(msg) {
            if (isLoggingActive()) {
                addMessage('debug', msg);
            }
        },
        warn: function(msg) {
            if (isLoggingActive()) {
                addMessage('warn', msg);
            }
        },
        info: function(msg) {
            if (isLoggingActive()) {
                addMessage('info', msg);
            }
        },
        error: function(msg) {
            if (isLoggingActive()) {
                addMessage('error', msg);
            }
        },
        activateLogging: function() {
            //Set the state.active to true
            setLogging();
        },
        /**
         * This will activate or deactivate logging without altering the state
         * of blackbird.
         * @param {boolean} isLoggingActive - A boolean indicating if logging
         * is to be activated.
         * @returns {undefined} Returns undefined.
         */
        setLoggingActive: function(isLoggingActive) {
            loggingActive = isLoggingActive;
        },
        disableLogging: function() {
            stopLogging();
        },
        profile: function(label) {
            var currentTime = new Date(); //record the current time when profile() is executed

            if (label == undefined || label == '') {
                addMessage('error', '<b>ERROR:</b> Please specify a label for your profile statement');
            }
            else if (profiler[ label ]) {
                addMessage('profile', [ label, ': ', currentTime - profiler[ label ], 'ms' ].join(''));
                delete profiler[ label ];
            }
            else {
                profiler[ label ] = currentTime;
                addMessage('profile', label);
            }
            return currentTime;
        },
        isBlackBirdActive: function() {
            return isLoggingActive();
        }
    }

    addEvent(window, 'load',
        /* initialize Blackbird when the page loads */
        function() {
            var body = document.getElementsByTagName('BODY')[ 0 ];
            bbird = body.appendChild(generateMarkup());
            outputList = bbird.getElementsByTagName('OL')[ 0 ];

            backgroundImage();

            //add events
            //addEvent( IDs.checkbox, 'click', clickVis );
            addEvent(IDs.filters, 'click', clickFilter);
            addEvent(IDs.controls, 'click', clickControl);
            addEvent(document, 'keyup', readKey);

            resize(state.size);
            reposition(state.pos);
            if (state.load) {
                show();
                //document.getElementById( IDs.checkbox ).checked = true;
            }

            scrollToBottom();

            window[ NAMESPACE ].init = function() {
                show();
                window[ NAMESPACE ].error([ '<b>', NAMESPACE, '</b> can only be initialized once' ]);
            }

            addEvent(window, 'unload', function() {
                //removeEvent( IDs.checkbox, 'click', clickVis );
                removeEvent(IDs.filters, 'click', clickFilter);
                removeEvent(IDs.controls, 'click', clickControl);
                removeEvent(document, 'keyup', readKey);
            });

            if (state.active) {
                //Prevent logging from occuring next reload
                loggingActive = true;
                state.active = false;
                state.load = false;
                state.size = 1;
                setState();
            }
        });
})();

/**
 * @class
 * This is the base Logger interface. It exposes the methods necessary for logging
 * but leaves specific implementation up to concrete implementations of a Logger.
 * @constructor
 */
function Logger() {
    this.m_activated = false;
    this.m_lineBreak = "";
}

/**
 * Returns a true/false value determining whether the Logger is currently active or not.
 * @returns {boolean} True if the logger is active, otherwise false.
 */
Logger.prototype.isActivated = function() {
    return this.m_activated;
};

/**
 * Sets whether the Logger is currently active or not.
 * @param {boolean} activated - Whether the Logger is currently activated or not.
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.setIsActivated = function(activated) {
    this.m_activated = activated;
};

/**
 * Sets the string to utilize for line breaks in the logging messages
 * @param {String} lineBreak - String to utilize for line breaks
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.setLineBreak = function(lineBreak) {
    this.m_lineBreak = lineBreak;
};

/**
 * Returns the string to utilize for line breaks in the logging messages
 * @returns {String} String to utilize for line breaks
 */
Logger.prototype.getLineBreak = function() {
    return this.m_lineBreak;
};

/**
 * This method will activate the logger. It sets the enabled state of the logger to true then stores the state in the
 * cookie.
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.activate = function() {
    if (this.isActivated()) {
        return;
    }
    //Make the call to update the logger prototype with actual logging function definitions
    if (this.isLoggingAvailable()) {
        this.addLoggingDefinitionsToPrototype();
    }
    this.setIsActivated(true);
};

/**
 * This method will add the necessary logging method implementations on the fly. This method will be implemented
 * by the sub-classes of the Logger.
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.addLoggingDefinitionsToPrototype = function() {
};

/**
 * Determines if logging is available. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @returns {boolean} Returns false.
 */
Logger.prototype.isLoggingAvailable = function() {
    return false;
};

/* eslint-disable no-unused-vars */
/**
 * Logs a message. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} message - The message to be logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logMessage = function(message) {
    return false;
};

/**
 * Logs a debug message. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} debug - The debug message to be logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logDebug = function(debug) {
    return false;
};

/**
 * Logs a warning. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} warning - The warning to be logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logWarning = function(warning) {
    return false;
};

/**
 * Logs an error. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} error - The error to be logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logError = function(error) {
    return false;
};

/**
 * Logs script call information.
 * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
 * @param {ScriptRequest} request - The script request that was made.
 * @param {string} file - The JS file from which the script call was made.
 * @param {string} funcName - The name of the function.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logScriptCallInfo = function(component, request, file, funcName) {
    return false;
};

/**
 * Logs a script call error.
 * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
 * @param {ScriptRequest} request - The script request that was made.
 * @param {string} file - The JS file from which the script call was made.
 * @param {string} funcName - The name of the function.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logScriptCallError = function(component, request, file, funcName) {
    return false;
};

/**
 * Logs a JavaScript error.
 * @param {Error} err - The error that occurred.
 * @param {MPageComponent} component - The component in which the error originated.
 * @param {string} file - The JS file from which the JavaScript error originated.
 * @param {string} funcName - The function from which the JavaScript error originated.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logJSError = function(err, component, file, funcName) {
    return false;
};

/**
 * Logs Discern Information.
 * @param {MPageComponent} component - The component from which the information is being logged.
 * @param {string} objectName - The name of the object for which information is being logged.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logDiscernInfo = function(component, objectName, file, funcName) {
    return false;
};

/**
 * Logs MPages event information.
 * @param {MPageComponent} component - The component from which the information is being logged.
 * @param {string} eventName - The name of the event that occurred.
 * @param {string} params - The parameters associated to the MPages event.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logMPagesEventInfo = function(component, eventName, params, file, funcName) {
    return false;
};

/**
 * Logs CCLNEWSESSIONWINDOW information.
 * @param {MPageComponent} component - The component from which the information is being logged.
 * @param {string} params - The parameters associated to the CCLNEWSESSIONWINDOW.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logCCLNewSessionWindowInfo = function(component, params, file, funcName) {
    return false;
};

/**
 * Logs timer information.
 * @param {string} timerName - The name of the timer.
 * @param {string} subTimerName - The sub timer name.
 * @param {string} timerType - The type of timer.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 * @returns {boolean} Returns false.
 */
Logger.prototype.logTimerInfo = function(timerName, subTimerName, timerType, file, funcName) {
    return false;
};
/* eslint-enable no-unused-vars */

/**
 * Creates a single log message based on array of strings seperated by line breaks
 * @param  {Array<String>} messages Array of strings to display in logger
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.logMessages = function(messages) {
    if (!(messages instanceof Array)) {
        throw new Error("Logger.prototype.logMessages only accepts array arguments");
    }
    var fullMessageString = this.joinMessagesWithBreaks(messages);
    this.logMessage(fullMessageString);
};

/**
 * Logs an error containing all the passed messages seperated by line breaks
 * @param  {Array<String>}  messages Array of strings to display in logger
 * @returns {undefined} Returns undefined.
 */
Logger.prototype.logErrors = function(messages) {
    if (!(messages instanceof Array)) {
        throw new Error("Logger.prototype.logErrors only accepts array arguments");
    }
    var fullMessageString = this.joinMessagesWithBreaks(messages);
    this.logError(fullMessageString);
};

/**
 * Creates a single log message based on array of strings seperated by line breaks
 * @param  {Array<String>} messages Array of strings to display in logger
 * @returns {String} String containing messages seperated by line breaks
 */
Logger.prototype.joinMessagesWithBreaks = function(messages) {
    if (!(messages instanceof Array)) {
        throw new Error("Logger.prototype.joinMessagesWithBreaks only accepts array arguments");
    }
    var lineBreak = this.getLineBreak();
    return messages.join(lineBreak);
};

/* global Logger, log */

/**
 * @class
 * This class is a sub-class of Logger and implements the interface methods. This implementation will
 * log all messages via Blackbird. This class serves as a wrapper (adaptor) which allows a cleaner interface
 * with Blackbird.
 * @constructor
 */
function BlackBirdLogger() {
    this.setLineBreak("<br />");
}
BlackBirdLogger.prototype = new Logger();
BlackBirdLogger.prototype.constructor = Logger;

BlackBirdLogger.prototype.addLoggingDefinitionsToPrototype = function() {
    /**
     * Logs a message out to the Blackbird logger.
     * @param {string} message - The message to be logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logMessage = function(message) {
        log.info(message);
    };

    /**
     * Logs a debug message out to the Blackbird logger.
     * @param {string} debug - The debug message to be logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logDebug = function(debug) {
        log.debug(debug);
    };

    /**
     * Logs a warning out to the Blackbird logger.
     * @param {string} warning - The warning to be logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logWarning = function(warning) {
        log.warn(warning);
    };

    /**
     * Logs an error out to the Blackbird logger.
     * @param {string} error - The error to be logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logError = function(error) {
        log.error(error);
    };

    /**
     * Logs script call information.
     * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
     * @param {ScriptRequest} request - The script request that was made.
     * @param {string} file - The JS file from which the script call was made.
     * @param {string} funcName - The name of the function.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logScriptCallInfo = function(component, request, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText ].join(""));
    };

    /**
     * Logs a script call error.
     * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
     * @param {ScriptRequest} request - The script request that was made.
     * @param {string} file - The JS file from which the script call was made.
     * @param {string} funcName - The name of the function.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logScriptCallError = function(component, request, file, funcName) {
        this.logError([ "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText, "<br />Status: ", request.status ].join(""));
    };

    /**
     * Logs a JavaScript error.
     * @param {Error} err - The error that occurred.
     * @param {MPageComponent} component - The component in which the error originated.
     * @param {string} file - The JS file from which the JavaScript error originated.
     * @param {string} funcName - The function from which the JavaScript error originated.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logJSError = function(err, component, file, funcName) {
        this.logError([ "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />JS Error", "<br />Message: ", err.message, "<br />Name: ", err.name, "<br />Number: ", (err.number & 0xFFFF), "<br />Description: ", err.description ].join(""));
    };

    /**
     * Logs Discern Information
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} objectName - The name of the object for which information is being logged.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logDiscernInfo = function(component, objectName, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Discern Object: ", objectName ].join(""));
    };

    /**
     * Logs MPages event information.
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} eventName - The name of the event that occurred.
     * @param {string} params - The parameters associated to the MPages event.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logMPagesEventInfo = function(component, eventName, params, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />MPAGES_EVENT: ", eventName, "<br />Params: ", params ].join(""));
    };

    /**
     * Logs CCLNEWSESSIONWINDOW information.
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} params - The parameters associated to the CCLNEWSESSIONWINDOW.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logCCLNewSessionWindowInfo = function(component, params, file, funcName) {
        this.logDebug([ "CCLNEWSESSIONWINDOW Creation", "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Params: ", params ].join(""));
    };

    /**
     * Logs timer information.
     * @param {string} timerName - The name of the timer.
     * @param {string} subTimerName - The sub timer name.
     * @param {string} timerType - The type of timer.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    BlackBirdLogger.prototype.logTimerInfo = function(timerName, subTimerName, timerType, file, funcName) {
        this.logDebug([ "Timer Name: ", timerName, "<br />Subtime Name:  ", subTimerName, "<br />Timer Type: ", timerType, "<br />File: ", file, "<br />Function: ", funcName ].join(""));
    };
};

/**
 * Overrides the base activate method. This will call the base activate method then make the call to the
 * Blackbird logger object to activate it as well.
 * @returns {undefined} Returns undefined.
 */
BlackBirdLogger.prototype.activate = function() {
    Logger.prototype.activate.call(this);
    //Make the call to the actual Blackbird object to activate it
    log.activateLogging();
};

/**
 * Determines if Blackbird logging is available.
 * @returns {boolean} True if the blackbird global log object is available.
 */
BlackBirdLogger.prototype.isLoggingAvailable = function() {
    return (typeof log === "object");
};

/* global Logger */

/* eslint-disable no-console */
/**
 * @class
 * This class is a sub-class of Logger and implements the interface methods. This implementation will log
 * all messages to the native console via console.log(...).
 * @constructor
 */
function ConsoleLogger() {
    if (typeof console.debug === "undefined") {
        console.debug = console.log;
    }
    this.setLineBreak("\n");
}
ConsoleLogger.prototype = new Logger();
ConsoleLogger.prototype.constructor = Logger;

ConsoleLogger.prototype.addLoggingDefinitionsToPrototype = function() {
    /**
     * Logs a message out to the native console.
     * @param {string} message - The message to be logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logMessage = function(message) {
        console.log(message);
    };
    /**
     * Logs a debug message out to the native console. Note that Internet Explorer does not have console.debug, so a
     * check is performed to see if console.debug is defined. If not, console.debug is set to console.log.
     * @param {string} debug - The debug message to be logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logDebug = function(debug) {
        console.debug(debug);
    };
    /**
     * Logs a warning out to the native console.
     * @param {string} warning - The warning to be logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logWarning = function(warning) {
        console.warn(warning);
    };
    /**
     * Logs an error out to the native console.
     * @param {string} error - The error to be logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logError = function(error) {
        console.error(error);
    };
    /**
     * Logs script call information.
     * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
     * @param {ScriptRequest} request - The script request that was made.
     * @param {string} file - The JS file from which the script call was made.
     * @param {string} funcName - The name of the function.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logScriptCallInfo = function(component, request, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nScript: ", request.url, "\nRequest: ", request.requestText, "\nReply: ", request.responseText ].join(""));
    };
    /**
     * Logs a script call error.
     * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
     * @param {ScriptRequest} request - The script request that was made.
     * @param {string} file - The JS file from which the script call was made.
     * @param {string} funcName - The name of the function.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logScriptCallError = function(component, request, file, funcName) {
        this.logError([ "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nScript: ", request.url, "\nRequest: ", request.requestText, "\nReply: ", request.responseText, "\nStatus: ", request.status ].join(""));
    };
    /**
     * Logs a JavaScript error.
     * @param {Error} err - The error that occurred.
     * @param {MPageComponent} component - The component in which the error originated.
     * @param {string} file - The JS file from which the JavaScript error originated.
     * @param {string} funcName - The function from which the JavaScript error originated.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logJSError = function(err, component, file, funcName) {
        this.logError([ "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nJS Error", "\nMessage: ", err.message, "\nName: ", err.name, "\nNumber: ", (err.number & 0xFFFF), "\nDescription: ", err.description ].join(""));
    };
    /**
     * Logs Discern Information
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} objectName - The name of the object for which information is being logged.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logDiscernInfo = function(component, objectName, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nDiscern Object: ", objectName ].join(""));
    };
    /**
     * Logs MPages event information.
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} eventName - The name of the event that occurred.
     * @param {string} params - The parameters associated to the MPages event.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logMPagesEventInfo = function(component, eventName, params, file, funcName) {
        this.logDebug([ "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nMPAGES_EVENT: ", eventName, "\nParams: ", params ].join(""));
    };
    /**
     * Logs CCLNEWSESSIONWINDOW information.
     * @param {MPageComponent} component - The component from which the information is being logged.
     * @param {string} params - The parameters associated to the CCLNEWSESSIONWINDOW.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logCCLNewSessionWindowInfo = function(component, params, file, funcName) {
        this.logDebug([ "CCLNEWSESSIONWINDOW Creation", "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nParams: ", params ].join(""));
    };
    /**
     * Logs timer information.
     * @param {string} timerName - The name of the timer.
     * @param {string} subTimerName - The sub timer name.
     * @param {string} timerType - The type of timer.
     * @param {string} file - The JS file from which the information is being logged.
     * @param {string} funcName - The function from which the information is being logged.
     * @returns {undefined} Returns undefined.
     */
    ConsoleLogger.prototype.logTimerInfo = function(timerName, subTimerName, timerType, file, funcName) {
        this.logDebug([ "Timer Name: ", timerName, "\nSubtime Name:  ", subTimerName, "\nTimer Type: ", timerType, "\nFile: ", file, "\nFunction: ", funcName ].join(""));
    };
};

/**
 * Determines if logging is available. This performs the check to see if the native console object exists.
 * @returns {boolean} True if the global console object is available.
 */
ConsoleLogger.prototype.isLoggingAvailable = function() {
    return (typeof console === "object");
};
/* eslint-enable no-console */

/**
 * Determine which type of logger to provide at a global level. If in the context of Millennium, use
 * BlackbirdLogger, otherwise use the ConsoleLogger.
 * @type {BlackBirdLogger | ConsoleLogger}
 */
window[ "logger" ] = (CERN_Platform.inMillenniumContext()) ? new BlackBirdLogger() : new ConsoleLogger();
(function() {
    var cookie = document.cookie;
    if (!cookie) {
        return;
    }
    var loggerSettingsRegex = new RegExp(/logger=({[^;]+})(;|\b|$)/);
    var loggerSettings = loggerSettingsRegex.exec(cookie);
    if (!loggerSettings || !loggerSettings.length) {
        return;
    }
    loggerSettings = JSON.parse(loggerSettings[ 1 ]);
    var wasEnabled = loggerSettings.enabled;
    if (wasEnabled === "true") {
        window.logger.activate();
    }
    //Force the logger cookie to be disabled.
    document.cookie = 'logger={"enabled":"false"}';
})();


/**
 * Listen for the CTRL+\ keypress and toggle the active state of the current Logger.
 * @param {Event} evt - The JavaScript keypress event that was triggered.
 * @returns {undefined} Returns undefined.
 */
document.onkeypress = function(evt) {
    if (!evt) {
        evt = window.event;
    }
    if (evt.ctrlKey == 1 && evt.keyCode == 28) {
        window.logger.activate();
        document.cookie = 'logger={"enabled":"true"}';
    }
};

