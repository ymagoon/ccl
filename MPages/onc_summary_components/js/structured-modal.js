/*globals pvFrameworkLink, Infobutton, MPAGES_EVENT*/

/**
 * @namespace
 * The CERN_Platform namespace is utilized to house information about the Millennium Platform.  It also contains functions
 * which will allow the consumer to indirectly interact with specific Millennium Win32 APIs.  Essentially the CERN_Platform will
 * act as a middle man between the Millennium platform and the consumer.  This will allow the for passivity when MPages are being
 * run within and outside of a Millennium context.  More specific information can be found in each of the available functions below.
 */
var CERN_Platform = {
	m_inMillenniumContext: null,
	m_inPatientChartContext: null,
	m_inTouchMode: false,
	m_scriptServletLoc: "",
	m_webappRoot : null,
	m_criterion: null
};

/**
 * This function is used to retrieve the criterion object that is used to identify basic information about the execution of
 * an MPageView.
 * @return {object} The parsed criterion object
 */
CERN_Platform.getCriterion = function(){
	if(!this.m_criterion){
		try{
			this.m_criterion = JSON.parse(m_criterionJSON);
		}
		catch(err){
			logger.logError("Unable to successfully parse the criterion JSON: " + m_criterionJSON);
			throw new Error("Unable to successfully parse the criterion JSON");
		}
	}
	return this.m_criterion;
};

/**
 * Returns an object via DiscernObjectFactory with the specified name. If not within the context of Millennium,
 * getDiscernObjectWebEquivalent function returns the web equivalent of a Discern object if it exists else null will
 * be returned.
 * @param {string} objectName - The name of the object to be obtained via DiscernObjectFactory or web equivalent of a Discern object.
 * @returns {object} The discern object or its web equivalent if available
 */
CERN_Platform.getDiscernObject = function (objectName) {
	try {
		return this.inMillenniumContext() ? window.external.DiscernObjectFactory(objectName) : this.getDiscernObjectWebEquivalent(objectName);
	} catch (exe) {
		logger.logError("In CERN_Platform.getDiscernObject: An error occurred when trying to retrieve: " + objectName + " from window.external.DiscernObjectFactory");
		return null;
	}
};

/**
 * This function will return the web equivalent of a Discern object if it exists.  Web equivalents mimic the APIs that are available
 * within Discern Object.
 * @param {string} discernObjectName The name of the discern object being retrieved
 * @return {object} The web equivalent of the discern object or null if it does not exist
 */
CERN_Platform.getDiscernObjectWebEquivalent = function(discernObjectName){
	switch(discernObjectName){
		case "DOCUTILSHELPER":
			return null; //docUtilsHelper;
		case "AUTOTEXTHELPER":
			return null; //autotextHelper;
		case "PVFRAMEWORKLINK":
			return pvFrameworkLink;
		case "INFOBUTTONLINK":
			return new Infobutton();
		case "CHECKPOINT":
			return new webCheckpoint.checkpoint();
		case "PVCONTXTMPAGE":
			return WebPVContxtMpage;	
		default:
			return null;
	}
};

/**
 * The inMillenniumContext function can be used to determine if the the current MPage is being run from within the context of a
 * Millennium application or not.  From there the consumer can utilize Win32 pieces of functionality or gracefully degrade based on the
 * availability of alternative solutions.
 * @return {boolean} true if the mpage is being run within Millennium, false otherwise.
 */
CERN_Platform.inMillenniumContext = function () {
	if (this.m_inMillenniumContext === null) {
		this.m_inMillenniumContext = (window.external && (typeof window.external.DiscernObjectFactory !== "undefined")) ? true : false;
	}
	return this.m_inMillenniumContext;
};

/**
 * This function is used to determine if the MPagesView is being shown within the context of a patient's chart.
 * It determines this by checking the global criterion object for a person_id.  If that is populated, the MPages
 * is for sure being shown within some patient context.  Otherwise, if it is not populated we can assume the MPage
 * is being shown in a different context.
 * @return {boolean} True if the MPage is being shown within a patient context, false otherwise
 */
CERN_Platform.inPatientChartContext = function(){
	if (this.m_inPatientChartContext === null) {
		//Get the criterion object and check the personid
		var criterion = this.getCriterion().CRITERION;
		this.m_inPatientChartContext = criterion.PERSON_ID ? true : false;
	}
	return this.m_inPatientChartContext;
};

/**
 * Returns a flag indicating if touch mode is enabled
 * @returns {boolean} A flag indicating if touch mode is enabled
 */
CERN_Platform.isTouchModeEnabled = function () {
	return this.m_inTouchMode;
};

/**
 * Sets the servlet location.
 * @param {String} servletLocation A string used to indicate the location of servlet.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.setScriptServletLocation = function(servletLocation) {
    this.m_scriptServletLoc = servletLocation;
};

/**
 *Gets the servlet location.
 *@returns {String} A string used to indicate the location of the script servlet.
 */
CERN_Platform.getScriptServletLocation = function() {
    return this.m_scriptServletLoc;
};

 /*
 * Sets a flag to indicate if touch mode is enabled
 * @param {boolean} touchModeFlag A flag to indicate if touch mode is enabled
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.setTouchModeEnabled = function (touchModeFlag) {
	this.m_inTouchMode = touchModeFlag;
	// Add a class to body if touch mode is enabled
	// No need to remove the class if touch mode is disabled because the page refreshes and MPage is painted again
	if(touchModeFlag){
		$("body").addClass("touch-mode");
	}
};

/**
 * Single function to redirect the page, for use in CCLLINK replacement
 * @param {Object} newUrl The new page location
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.setLocation = function(newUrl){
	window.location.assign(newUrl);
};

/**
 * This function is used to refresh the MPage View programatically.  Determines the parameters to utilze based on the 
 * context of the MPage.
 */
CERN_Platform.refreshMPage = function(){
	var criterion = CERN_Platform.getCriterion().CRITERION;
	var cclParams = null;
	
	//Determine if we are viewing the current MPage in a patient context
	if(CERN_Platform.inPatientChartContext()){
		cclParams = ["^MINE^", criterion.PERSON_ID + ".0", criterion.ENCNTRS[0].ENCNTR_ID + ".0", criterion.PRSNL_ID + ".0", criterion.POSITION_CD + ".0", criterion.PPR_CD + ".0", "^" + criterion.EXECUTABLE + "^", "^" + CERN_driver_static_content.replace(/\\/g, "\\\\") + "^", "^" + CERN_driver_mean + "^", criterion.DEBUG_IND];
	}
	else{
		cclParams = ["^MINE^", criterion.PRSNL_ID + ".0", criterion.POSITION_CD + ".0", "^" + criterion.EXECUTABLE + "^", "^" + CERN_driver_static_content.replace(/\\/g, "\\\\") + "^", "^" + CERN_driver_mean + "^", criterion.DEBUG_IND];
	}
	CCLLINK(CERN_driver_script, cclParams.join(","), 1);
};

/**
 * This function will create a global CCLLINK function that will launch a CCL program through the MPages webserver and displaying the contents.
 * This also prevents situations where IE pre-loads global functions before JS execution.
 * @param {String} reportName - CCL program name
 * @param {String} prompts - prompt parameters for the reportName
 * @param {String} linkDestination - a function used in the original CCLLINK to determine if the URL is launched into a separate DiscernReportViewer.
 * 										This is ignored in this implementation.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.CCLLINK = function(reportName, prompts, linkDestination){
	//For web enabled MPages, only enable CCLLINK functionality if the reportName is "MP_UNIFIED_DRIVER" or "MP_UNIFIED_ORG_DRIVER".  
	//All other implementations should fail silently.
	if(/^MP_UNIFIED_.*DRIVER/.test(reportName.toUpperCase())){
		CERN_Platform.setLocation(window.location.href);
	} else {
		logger.logWarning("CCLLINK is not supported outside of Millennium for program: " + reportName + ".");
	}
};

/**
 * A replacement for the MPAGES_EVENT function that will do nothing, but prevent a failure.
 * @param {String} eventType - the type of event to be used.  This will be ignored in this function
 * @param {String} eventParams - the parameters of the event to be used.  This will be ignored in this function.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.MPAGES_EVENT = function(eventType, eventParams){
	return;
};

/**
 * This function will create a global APPLINK function that will do nothing, but prevent a failure.
 * @param {Integer} mode - A numeric value representing the mode to start the application link
 * 		0 - Used for starting a solution by executable name
 * 		1 - Used for starting a solution by the application object, such as DiscernAnalytics.Application
 * 		100 - Used to launch a file, link, or executable through a shell execute.
 * @param {String} appname - The application executable name
 * @param {String} params - The person_id, encntr_id and Powerchart tab name.
 * @returns {undefined} This function does not return a value
 */
CERN_Platform.APPLINK = function(mode, appname, params){
	return;
};

/*This function retrieves a cookie that contains info about the context root for the webpage
 * Then creates and returns the mpRoot as a string
 */
CERN_Platform.makeRoot = function(){
	return document.cookie.replace(/(?:(?:^|.*;\s*)mpRoot\s*\=\s*([^;]*).*$)|^.*$/, "$1");
};

/**
 * This function will attempt to read the context root of the webapp from a cookie named "mpRoot", and then return the full URL 
 *   of the webapp with context root.
 *   Note that the "mpRoot" cookie is the context root string is created by the login.jsp page.
 * @param none
 * @returns {String} A string representing the full URL of the webapp.  For example: "https://subDomainName.domainName.com/webappName/canonical.domain.name"
 */
CERN_Platform.getWebappRoot = function() {
	var setWebAppRoot = function (newRoot) {	
		if (newRoot) {
			CERN_Platform.m_webappRoot = location.protocol + "//" + location.host + newRoot;
		}
	};

	if (typeof this.m_webappRoot !== 'string') {
		setWebAppRoot(CERN_Platform.makeRoot());
	}
	return this.m_webappRoot;
};


/**
 * This code will update the CCLLINK function if necessary, ensuring that it's action is similar both inside and outside of a Win32
 * context.  It is defined at a global level since CCLLINK is defined at the global level.  Default CCLLINK functionality is detailed
 * here:
 * https://wiki.ucern.com/display/public/MPDEVWIKI/CCLLINK
 */
if(typeof CCLLINK === "undefined"){
	CCLLINK = CERN_Platform.CCLLINK;
}

/**
 * This code will update the MPAGES_EVENT function if necessary, ensuring that it's action is will not cause a failure message.
 * It is defined at a global level since MPAGES_EVENT is defined at the global level.  Default MPAGES_EVENT functionality is detailed
 * here:
 * https://wiki.ucern.com/display/public/MPDEVWIKI/MPAGES_EVENT
 */
if(typeof MPAGES_EVENT === "undefined"){
	MPAGES_EVENT = CERN_Platform.MPAGES_EVENT;
}

/**
 * This code will update the APPLINK function if necessary, ensuring that it's action is similar both inside and outside of a Win32
 * context.  It is defined at a global level since APPLINK is defined at the global level.  Default APPLINK functionality is detailed
 * here:
 * https://wiki.ucern.com/display/public/MPDEVWIKI/APPLINK
 */
if(typeof APPLINK === "undefined"){
	APPLINK = CERN_Platform.APPLINK;
}
/*
	Blackbird - Open Source JavaScript Logging Utility
	Author: G Scott Olson
	Web: http://blackbirdjs.googlecode.com/
	     http://www.gscottolson.com/blackbirdjs/
	Version: 1.0

	The MIT License - Copyright (c) 2008 Blackbird Project
*/
( function() {
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
	
	function isLoggingActive(){
		return (state.active || loggingActive) ? true : false;
	}
	
	function generateMarkup() { //build markup
		var spans = [];
		for ( type in messageTypes ) {
			spans.push( [ '<span class="', type, '" type="', type, '"></span>'].join( '' ) );
		}

		var newNode = document.createElement( 'DIV' );
		newNode.id = IDs.blackbird;
		newNode.style.display = 'none';
		newNode.innerHTML = [
			'<div class="header">',
				'<div class="left">',
					'<div id="', IDs.filters, '" class="filters" title="click to filter by message type">', spans.join( '' ), '</div>',
				'</div>',
				'<div class="right">',
					'<div id="', IDs.controls, '" class="controls">',
						'<span id="', IDs.size ,'" title="contract" op="resize"></span>',
						'<span class="clear" title="clear" op="clear"></span>',
						'<span class="close" title="close" op="close"></span>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="main">',
				'<div class="left"></div><div class="mainBody">',
					'<ol>', cache.join( '' ), '</ol>',
				'</div><div class="right"></div>',
			'</div>'/*,
			'<div class="footer">',
				'<div class="left"><label for="', IDs.checkbox, '"><input type="checkbox" id="', IDs.checkbox, '" />Visible on page load</label></div>',
				'<div class="right"></div>',
			'</div>'*/
		].join( '' );
		return newNode;
	}

	function backgroundImage() { //(IE6 only) change <BODY> tag's background to resolve {position:fixed} support
		var bodyTag = document.getElementsByTagName( 'BODY' )[ 0 ];
		
		if ( bodyTag.currentStyle && IE6_POSITION_FIXED ) {
			if (bodyTag.currentStyle.backgroundImage == 'none' ) {
				bodyTag.style.backgroundImage = 'url(about:blank)';
			}
			if (bodyTag.currentStyle.backgroundAttachment == 'scroll' ) {
				bodyTag.style.backgroundAttachment = 'fixed';
			}
		}
	}

	function addMessage( type, content ) { //adds a message to the output list
		content = ( content.constructor == Array ) ? content.join( '' ) : content;
		if ( outputList ) {
			var newMsg = document.createElement( 'LI' );
			newMsg.className = type;
			newMsg.innerHTML = [ '<span class="icon"></span>', content ].join( '' );
			outputList.appendChild( newMsg );
			scrollToBottom();
		} else {
			cache.push( [ '<li class="', type, '"><span class="icon"></span>', content, '</li>' ].join( '' ) );
		}
	}
	
	function clear() { //clear list output
		outputList.innerHTML = '';
	}
	
	function clickControl( evt ) {
		if ( !evt ) evt = window.event;
		var el = ( evt.target ) ? evt.target : evt.srcElement;

		if ( el.tagName == 'SPAN' ) {
			switch ( el.getAttributeNode( 'op' ).nodeValue ) {
				case 'resize': resize(); break;
				case 'clear':  clear();  break;
				case 'close':  hide();   break;
			}
		}
	}
	
	function clickFilter( evt ) { //show/hide a specific message type
		if ( !evt ) evt = window.event;
		var span = ( evt.target ) ? evt.target : evt.srcElement;

		if ( span && span.tagName == 'SPAN' ) {

			var type = span.getAttributeNode( 'type' ).nodeValue;

			if ( evt.altKey ) {
				var filters = document.getElementById( IDs.filters ).getElementsByTagName( 'SPAN' );

				var active = 0;
				for ( entry in messageTypes ) {
					if ( messageTypes[ entry ] ) active++;
				}
				var oneActiveFilter = ( active == 1 && messageTypes[ type ] );

				for ( var i = 0; filters[ i ]; i++ ) {
					var spanType = filters[ i ].getAttributeNode( 'type' ).nodeValue;

					filters[ i ].className = ( oneActiveFilter || ( spanType == type ) ) ? spanType : spanType + 'Disabled';
					messageTypes[ spanType ] = oneActiveFilter || ( spanType == type );
				}
			}
			else {
				messageTypes[ type ] = ! messageTypes[ type ];
				span.className = ( messageTypes[ type ] ) ? type : type + 'Disabled';
			}

			//build outputList's class from messageTypes object
			var disabledTypes = [];
			for ( type in messageTypes ) {
				if ( ! messageTypes[ type ] ) disabledTypes.push( type );
			}
			disabledTypes.push( '' );
			outputList.className = disabledTypes.join( 'Hidden ' );

			scrollToBottom();
		}
	}

	function clickVis( evt ) {
		if ( !evt ) evt = window.event;
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
		var body = document.getElementsByTagName( 'BODY' )[ 0 ];
		body.removeChild( bbird );
		body.appendChild( bbird );
		bbird.style.display = 'block';
	}
	
	//sets the position
	function reposition( position ) {
		if ( position === undefined || position == null ) {
			position = ( state && state.pos === null ) ? 1 : ( state.pos + 1 ) % 4; //set to initial position ('topRight') or move to next position
		}
				
		switch ( position ) {
			case 0: classes[ 0 ] = 'bbTopLeft'; break;
			case 1: classes[ 0 ] = 'bbTopRight'; break;
			case 2: classes[ 0 ] = 'bbBottomLeft'; break;
			case 3: classes[ 0 ] = 'bbBottomRight'; break;
		}
		state.pos = position;
		setState();
	}

	function resize( size ) {
		if ( size === undefined || size === null ) {
			size = ( state && state.size == null ) ? 1 : ( state.size + 1 ) % 2;
	  	}

		classes[ 1 ] = ( size === 0 ) ? 'bbSmall' : 'bbLarge'

		var span = document.getElementById( IDs.size );
		span.title = ( size === 1 ) ? 'small' : 'large';
		span.className = span.title;	  

		state.size = size;
		setState();
		scrollToBottom();
	}

	function setLogging(){
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
		for ( entry in state ) {
			var value = ( state[ entry ] && state[ entry ].constructor === String ) ? '"' + state[ entry ] + '"' : state[ entry ]; 
			props.push( entry + ':' + value );
		}
		props = props.join( ',' );
		
		var expiration = new Date();
		expiration.setDate( expiration.getDate() + 14 );
		document.cookie = [ 'blackbird={', props, '};'].join( '' );

		var newClass = [];
		for ( word in classes ) {
			newClass.push( classes[ word ] );
		}
		//Check to see if the blackbird has been rendered before setting the className
		if(bbird) {
			bbird.className = newClass.join(' ');
		}
	}
	
	function getState() {
		var re = new RegExp( /blackbird=({[^;]+})(;|\b|$)/ );
		var match = re.exec( document.cookie );
		return ( match && match[ 1 ] ) ? eval( '(' + match[ 1 ] + ')' ) : { pos:null, size:null, load:null, active:null };
	}
	
	//event handler for 'keyup' event for window
	function readKey( evt ) {
		if ( !evt ) evt = window.event;
		var code = 113; //F2 key
					
		if ( evt && evt.keyCode == code ) {
					
			var visible = isVisible();
					
			if ( visible && evt.shiftKey && evt.altKey ) clear();
			else if	 (visible && evt.shiftKey ) reposition();
			else if ( !evt.shiftKey && !evt.altKey ) {
			  if(isLoggingActive()){
			    ( visible ) ? hide() : show();
			  }
			}
		}
	}

	//event management ( thanks John Resig )
	function addEvent( obj, type, fn ) {
		var obj = ( obj.constructor === String ) ? document.getElementById( obj ) : obj;
		if ( obj.attachEvent ) {
			obj[ 'e' + type + fn ] = fn;
			obj[ type + fn ] = function(){ obj[ 'e' + type + fn ]( window.event ) };
			obj.attachEvent( 'on' + type, obj[ type + fn ] );
		} else obj.addEventListener( type, fn, false );
	}
	function removeEvent( obj, type, fn ) {
		var obj = ( obj.constructor === String ) ? document.getElementById( obj ) : obj;		
		if ( obj.detachEvent ) {
			if (obj[ type + fn ] != undefined)
            {
				obj.detachEvent( 'on' + type, obj[ type + fn ] );
			}
			obj[ type + fn ] = null;
	  } else {
		obj.removeEventListener( type, fn, false );
	  }
	}
	
	window[ NAMESPACE ] = {
		toggle:
			function() { if(isLoggingActive()){( isVisible() ) ? hide() : show(); }},
		resize:
			function() { resize(); },
		clear:
			function() { clear(); },
		move:
			function() { reposition(); },
		debug: 
			function( msg ) { if(isLoggingActive()){addMessage( 'debug', msg ); }},
		warn:
			function( msg ) { if(isLoggingActive()){addMessage( 'warn', msg ); }},
		info:
			function( msg ) { if(isLoggingActive()){addMessage( 'info', msg ); }},
		error: 
			function( msg ) { if(isLoggingActive()){addMessage( 'error', msg ); }},
		activateLogging:
			function(){
				//Set the state.active to true
				setLogging();
			},
		disableLogging:
			function(){
				stopLogging();
			},
		profile: 
			function( label ) {
				var currentTime = new Date(); //record the current time when profile() is executed
				
				if ( label == undefined || label == '' ) {
					addMessage( 'error', '<b>ERROR:</b> Please specify a label for your profile statement' );
				}
				else if ( profiler[ label ] ) {
					addMessage( 'profile', [ label, ': ', currentTime - profiler[ label ],	'ms' ].join( '' ) );
					delete profiler[ label ];
				}
				else {
					profiler[ label ] = currentTime;
					addMessage( 'profile', label );
				}
				return currentTime;
			},
		isBlackBirdActive:
			function() {
				return isLoggingActive();
			}
	}

	addEvent( window, 'load', 
		/* initialize Blackbird when the page loads */
		function() {
			var body = document.getElementsByTagName( 'BODY' )[ 0 ];
			bbird = body.appendChild( generateMarkup() );
			outputList = bbird.getElementsByTagName( 'OL' )[ 0 ];
		
			backgroundImage();
		
			//add events
			//addEvent( IDs.checkbox, 'click', clickVis );
			addEvent( IDs.filters, 'click', clickFilter );
			addEvent( IDs.controls, 'click', clickControl );
			addEvent( document, 'keyup', readKey);

			resize( state.size );
			reposition( state.pos );
			if ( state.load ) {
				show();
				//document.getElementById( IDs.checkbox ).checked = true; 
			}

			scrollToBottom();

			window[ NAMESPACE ].init = function() {
				show();
				window[ NAMESPACE ].error( [ '<b>', NAMESPACE, '</b> can only be initialized once' ] );
			}

			addEvent( window, 'unload', function() {
				//removeEvent( IDs.checkbox, 'click', clickVis );
				removeEvent( IDs.filters, 'click', clickFilter );
				removeEvent( IDs.controls, 'click', clickControl );
				removeEvent( document, 'keyup', readKey );
			});
			
			if(state.active){
				//Prevent logging from occuring next reload
				loggingActive = true;
				state.active = false;
				state.load = false;
				state.size = 1;
				setState();
			}
		});
})();/**
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
 * @returns {boolean}
 */
Logger.prototype.isActivated = function() {
	return this.m_activated;
};

/**
 * Sets whether the Logger is currently active or not.
 * @param {boolean} activated - Whether the Logger is currently activated or not.
 * @returns {undefined}
 */
Logger.prototype.setIsActivated = function(activated) {
	this.m_activated = activated;
};

/**
 * Sets the string to utilize for line breaks in the logging messages
 * @param {String} lineBreak String to utilize for line breaks
 * @returns {undefined}
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
 * @param {boolean} refreshCookie - Whether the document cookie should be updated.
 */
Logger.prototype.activate = function () {
	if(this.isActivated()) {
		return;
	}
	//Make the call to update the logger prototype with actual logging function definitions
	if(this.isLoggingAvailable()) {
		this.addLoggingDefinitionsToPrototype();
	}
	this.setIsActivated(true);
};

/**
 * This method will add the necessary logging method implementations on the fly. This method will be implemented
 * by the sub-classes of the Logger.
 */
Logger.prototype.addLoggingDefinitionsToPrototype = function() {
	return;
};

/**
 * Determines if logging is available. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @returns {boolean}
 */
Logger.prototype.isLoggingAvailable = function () {
	return false;
};


/**
 * Logs a message. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} message - The message to be logged.
 */
Logger.prototype.logMessage = function (message) {
	return false;
};

/**
 * Logs a debug message. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} debug - The debug message to be logged.
 */
Logger.prototype.logDebug = function (debug) {
	return false;
};

/**
 * Logs a warning. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} warning - The warning to be logged.
 */
Logger.prototype.logWarning = function (warning) {
	return false;
};

/**
 * Logs an error. This is an interface method and should be implemented by sub-classes of the
 * Logger class.
 * @param {string} error - The error to be logged.
 */
Logger.prototype.logError = function (error) {
	return false;
};

/**
 * Logs script call information.
 * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
 * @param {ScriptRequest} request - The script request that was made.
 * @param {string} file - The JS file from which the script call was made.
 * @param {string} funcName - The name of the function.
 */
Logger.prototype.logScriptCallInfo = function (component, request, file, funcName) {
	return false;
};

/**
 * Logs a script call error.
 * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
 * @param {ScriptRequest} request - The script request that was made.
 * @param {string} file - The JS file from which the script call was made.
 * @param {string} funcName - The name of the function.
 */
Logger.prototype.logScriptCallError = function (component, request, file, funcName) {
	return false;
};

/**
 * Logs a JavaScript error.
 * @param {Error} err - The error that occurred.
 * @param {MPageComponent} component - The component in which the error originated.
 * @param {string} file - The JS file from which the JavaScript error originated.
 * @param {string} funcName - The function from which the JavaScript error originated.
 */
Logger.prototype.logJSError = function (err, component, file, funcName) {
	return false;
};

/**
 * Logs Discern Information.
 * @param {MPageComponent} component - The component from which the information is being logged.
 * @param {string} objectName - The name of the object for which information is being logged.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 */
Logger.prototype.logDiscernInfo = function (component, objectName, file, funcName) {
	return false;
};

/**
 * Logs MPages event information.
 * @param {MPageComponent} component - The component from which the information is being logged.
 * @param {string} eventName - The name of the event that occurred.
 * @param {string} params - The parameters associated to the MPages event.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 */
Logger.prototype.logMPagesEventInfo = function (component, eventName, params, file, funcName) {
	return false;
};

/**
 * Logs CCLNEWSESSIONWINDOW information.
 * @param {MPageComponent} component - The component from which the information is being logged.
 * @param {string} params - The parameters associated to the CCLNEWSESSIONWINDOW.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 */
Logger.prototype.logCCLNewSessionWindowInfo = function (component, params, file, funcName) {
	return false;
};

/**
 * Logs timer information.
 * @param {string} timerName - The name of the timer.
 * @param {string} subTimerName - The sub timer name.
 * @param {string} timerType - The type of timer.
 * @param {string} file - The JS file from which the information is being logged.
 * @param {string} funcName - The function from which the information is being logged.
 */
Logger.prototype.logTimerInfo = function (timerName, subTimerName, timerType, file, funcName) {
	return false;
};

/**
 * Creates a single log message based on array of strings seperated by line breaks
 * @param  {Array<String>} messages Array of strings to display in logger
 * @returns {undefined}
 */
Logger.prototype.logMessages = function (messages) {
	if (!(messages instanceof Array)){
		throw new Error("Logger.prototype.logMessages only accepts array arguments");
	}
	var fullMessageString = this.joinMessagesWithBreaks(messages);
	this.logMessage(fullMessageString);
};

/**
 * Logs an error containing all the passed messages seperated by line breaks
 * @param  {Array<String>}  messages Array of strings to display in logger
 * @returns {undefined}
 */
Logger.prototype.logErrors = function(messages) {
	if (!(messages instanceof Array)){
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
Logger.prototype.joinMessagesWithBreaks = function (messages) {
	if (!(messages instanceof Array)){
		throw new Error("Logger.prototype.joinMessagesWithBreaks only accepts array arguments");
	}
	var lineBreak = this.getLineBreak();
	return messages.join(lineBreak);
};
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
	 */
	BlackBirdLogger.prototype.logMessage = function (message) {
		log.info(message);
	};

	/**
	 * Logs a debug message out to the Blackbird logger.
	 * @param {string} debug - The debug message to be logged.
	 */
	BlackBirdLogger.prototype.logDebug = function (debug) {
		log.debug(debug);
	};

	/**
	 * Logs a warning out to the Blackbird logger.
	 * @param {string} warning - The warning to be logged.
	 */
	BlackBirdLogger.prototype.logWarning = function (warning) {
		log.warn(warning);
	};

	/**
	 * Logs an error out to the Blackbird logger.
	 * @param {string} error - The error to be logged.
	 */
	BlackBirdLogger.prototype.logError = function (error) {
		log.error(error);
	};

	/**
	 * Logs script call information.
	 * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
	 * @param {ScriptRequest} request - The script request that was made.
	 * @param {string} file - The JS file from which the script call was made.
	 * @param {string} funcName - The name of the function.
	 */
	BlackBirdLogger.prototype.logScriptCallInfo = function (component, request, file, funcName) {
		this.logDebug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText].join(""));
	};

	/**
	 * Logs a script call error.
	 * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
	 * @param {ScriptRequest} request - The script request that was made.
	 * @param {string} file - The JS file from which the script call was made.
	 * @param {string} funcName - The name of the function.
	 */
	BlackBirdLogger.prototype.logScriptCallError = function (component, request, file, funcName) {
		this.logError(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText, "<br />Status: ", request.status].join(""));
	};

	/**
	 * Logs a JavaScript error.
	 * @param {Error} err - The error that occurred.
	 * @param {MPageComponent} component - The component in which the error originated.
	 * @param {string} file - The JS file from which the JavaScript error originated.
	 * @param {string} funcName - The function from which the JavaScript error originated.
	 */
	BlackBirdLogger.prototype.logJSError = function (err, component, file, funcName) {
		this.logError(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />JS Error", "<br />Message: ", err.message, "<br />Name: ", err.name, "<br />Number: ", (err.number & 0xFFFF), "<br />Description: ", err.description].join(""));
	};

	/**
	 * Logs Discern Information
	 * @param {MPageComponent} component - The component from which the information is being logged.
	 * @param {string} objectName - The name of the object for which information is being logged.
	 * @param {string} file - The JS file from which the information is being logged.
	 * @param {string} funcName - The function from which the information is being logged.
	 */
	BlackBirdLogger.prototype.logDiscernInfo = function (component, objectName, file, funcName) {
		this.logDebug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Discern Object: ", objectName].join(""));
	};

	/**
	 * Logs MPages event information.
	 * @param {MPageComponent} component - The component from which the information is being logged.
	 * @param {string} eventName - The name of the event that occurred.
	 * @param {string} params - The parameters associated to the MPages event.
	 * @param {string} file - The JS file from which the information is being logged.
	 * @param {string} funcName - The function from which the information is being logged.
	 */
	BlackBirdLogger.prototype.logMPagesEventInfo = function (component, eventName, params, file, funcName) {
		this.logDebug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />MPAGES_EVENT: ", eventName, "<br />Params: ", params].join(""));
	};

	/**
	 * Logs CCLNEWSESSIONWINDOW information.
	 * @param {MPageComponent} component - The component from which the information is being logged.
	 * @param {string} params - The parameters associated to the CCLNEWSESSIONWINDOW.
	 * @param {string} file - The JS file from which the information is being logged.
	 * @param {string} funcName - The function from which the information is being logged.
	 */
	BlackBirdLogger.prototype.logCCLNewSessionWindowInfo = function (component, params, file, funcName) {
		this.logDebug(["CCLNEWSESSIONWINDOW Creation", "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Params: ", params].join(""));
	};

	/**
	 * Logs timer information.
	 * @param {string} timerName - The name of the timer.
	 * @param {string} subTimerName - The sub timer name.
	 * @param {string} timerType - The type of timer.
	 * @param {string} file - The JS file from which the information is being logged.
	 * @param {string} funcName - The function from which the information is being logged.
	 */
	BlackBirdLogger.prototype.logTimerInfo = function (timerName, subTimerName, timerType, file, funcName) {
		this.logDebug(["Timer Name: ", timerName, "<br />Subtime Name:  ", subTimerName, "<br />Timer Type: ", timerType, "<br />File: ", file, "<br />Function: ", funcName].join(""));
	};
};

/**
 * Overrides the base activate method. This will call the base activate method then make the call to the
 * Blackbird logger object to activate it as well.
 * @param {boolean} refreshCookie - Whether the document cookie should be updated.
 */
BlackBirdLogger.prototype.activate = function () {
	Logger.prototype.activate.call(this);
	//Make the call to the actual Blackbird object to activate it
	log.activateLogging();
};

/**
 * Determines if Blackbird logging is available.
 * @returns {boolean}
 */
BlackBirdLogger.prototype.isLoggingAvailable = function () {
	return (typeof log == "object");
};
/**
 * @class
 * This class is a sub-class of Logger and implements the interface methods. This implementation will log
 * all messages to the native console via console.log(...).
 * @constructor
 */
function ConsoleLogger() {
	if(typeof console.debug === "undefined") {
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
	 */
	ConsoleLogger.prototype.logMessage = function(message) {
		console.log(message);
	};
	/**
	 * Logs a debug message out to the native console. Note that Internet Explorer does not have console.debug, so a
	 * check is performed to see if console.debug is defined. If not, console.debug is set to console.log.
	 * @param {string} debug - The debug message to be logged.
	 */
	ConsoleLogger.prototype.logDebug = function(debug) {
		console.debug(debug);
	};
	/**
	 * Logs a warning out to the native console.
	 * @param {string} warning - The warning to be logged.
	 */
	ConsoleLogger.prototype.logWarning = function(warning) {
		console.warn(warning);
	};
	/**
	 * Logs an error out to the native console.
	 * @param {string} error - The error to be logged.
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
	 */
	ConsoleLogger.prototype.logScriptCallInfo = function (component, request, file, funcName) {
		this.logDebug(["Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nScript: ", request.url, "\nRequest: ", request.requestText, "\nReply: ", request.responseText].join(""));
	};
	/**
	 * Logs a script call error.
	 * @param {MPageComponent} component - The MPageComponent for which the script call info was made (if any).
	 * @param {ScriptRequest} request - The script request that was made.
	 * @param {string} file - The JS file from which the script call was made.
	 * @param {string} funcName - The name of the function.
	 */
	ConsoleLogger.prototype.logScriptCallError = function (component, request, file, funcName) {
		this.logError(["Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nScript: ", request.url, "\nRequest: ", request.requestText, "\nReply: ", request.responseText, "\nStatus: ", request.status].join(""));
	};
	/**
	 * Logs a JavaScript error.
	 * @param {Error} err - The error that occurred.
	 * @param {MPageComponent} component - The component in which the error originated.
	 * @param {string} file - The JS file from which the JavaScript error originated.
	 * @param {string} funcName - The function from which the JavaScript error originated.
	 */
	ConsoleLogger.prototype.logJSError = function (err, component, file, funcName) {
		this.logError(["Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nJS Error", "\nMessage: ", err.message, "\nName: ", err.name, "\nNumber: ", (err.number & 0xFFFF), "\nDescription: ", err.description].join(""));
	};
	/**
	 * Logs Discern Information
	 * @param {MPageComponent} component - The component from which the information is being logged.
	 * @param {string} objectName - The name of the object for which information is being logged.
	 * @param {string} file - The JS file from which the information is being logged.
	 * @param {string} funcName - The function from which the information is being logged.
	 */
	ConsoleLogger.prototype.logDiscernInfo = function (component, objectName, file, funcName) {
		this.logDebug(["Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nDiscern Object: ", objectName].join(""));
	};
	/**
	 * Logs MPages event information.
	 * @param {MPageComponent} component - The component from which the information is being logged.
	 * @param {string} eventName - The name of the event that occurred.
	 * @param {string} params - The parameters associated to the MPages event.
	 * @param {string} file - The JS file from which the information is being logged.
	 * @param {string} funcName - The function from which the information is being logged.
	 */
	ConsoleLogger.prototype.logMPagesEventInfo = function (component, eventName, params, file, funcName) {
		this.logDebug(["Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nMPAGES_EVENT: ", eventName, "\nParams: ", params].join(""));
	};
	/**
	 * Logs CCLNEWSESSIONWINDOW information.
	 * @param {MPageComponent} component - The component from which the information is being logged.
	 * @param {string} params - The parameters associated to the CCLNEWSESSIONWINDOW.
	 * @param {string} file - The JS file from which the information is being logged.
	 * @param {string} funcName - The function from which the information is being logged.
	 */
	ConsoleLogger.prototype.logCCLNewSessionWindowInfo = function (component, params, file, funcName) {
		this.logDebug(["CCLNEWSESSIONWINDOW Creation", "Component: ", ( component ? component.getLabel() : ""), "\nID: ", ( component ? component.getComponentId() : ""), "\nFile: ", file, "\nFunction: ", funcName, "\nParams: ", params].join(""));
	};
	/**
	 * Logs timer information.
	 * @param {string} timerName - The name of the timer.
	 * @param {string} subTimerName - The sub timer name.
	 * @param {string} timerType - The type of timer.
	 * @param {string} file - The JS file from which the information is being logged.
	 * @param {string} funcName - The function from which the information is being logged.
	 */
	ConsoleLogger.prototype.logTimerInfo = function (timerName, subTimerName, timerType, file, funcName) {
		this.logDebug(["Timer Name: ", timerName, "\nSubtime Name:  ", subTimerName, "\nTimer Type: ", timerType, "\nFile: ", file, "\nFunction: ", funcName].join(""));
	};
};

/**
 * Determines if logging is available. This performs the check to see if the native console object exists.
 * @returns {boolean}
 */
ConsoleLogger.prototype.isLoggingAvailable = function () {
	return (typeof console === "object");
};
/**
 * Determine which type of logger to provide at a global level. If in the context of Millennium, use
 * BlackbirdLogger, otherwise use the ConsoleLogger.
 * @type {BlackBirdLogger | ConsoleLogger}
 */
window["logger"] = (CERN_Platform.inMillenniumContext()) ? new BlackBirdLogger() : new ConsoleLogger();
(function(){
	var cookie = document.cookie;
	if (!cookie) {
		return;
	}
	var loggerSettingsRegex = new RegExp(/logger=({[^;]+})(;|\b|$)/);
	var loggerSettings = loggerSettingsRegex.exec(cookie);
	if (!loggerSettings || !loggerSettings.length) {
		return;
	}
	loggerSettings = JSON.parse(loggerSettings[1]);
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
 */
document.onkeypress = function(evt){
	if (!evt) {
		evt = window.event;
	}
	if(evt.ctrlKey==1 && evt.keyCode == 28){
		window.logger.activate();
		document.cookie = 'logger={"enabled":"true"}';
	}
};
/**
 * The StructureOrganizerBuilder class.
 * @constructor
 * @author Will Reynolds
 * @description This class is used to help construct StructureOrganizer objects as the process is very complex. It
 * benefits by separating the construction logic from the StructureOrganizer object itself.
 */
function StructureOrganizerBuilder() {
    this.m_structureOrganizer = null;                 //The StructureOrganizer object being constructed.
    this.m_nodeCount = 0;                             //The number of nodes that belong to the StructureOrganizer object.
    this.m_namespace = "";                            //A DOM namespace for the StructureOrganizer object.
}

/**
 * Get the namespace used when constructing the StructureOrganizer object.
 * @return {string} the namespace for the StructureOrganizer objects being created.
 */
StructureOrganizerBuilder.prototype.getNamespace = function() {
    return this.m_namespace;
};

/**
 * Sets the namespace used when constructing the StructureOrganizer object. This namespace must be unique as it
 * will provide the objects with a unique DOM id.
 * @param namespace the namespace to be used when constructing the StructureOrganizer object.
 */
StructureOrganizerBuilder.prototype.setNamespace = function(namespace) {
	if(typeof namespace !== "string") {
		throw new Error("Attempted to call StructureOrganizerBuilder.prototype.setNamespace with invalid parameter.");
	}
    this.m_namespace = namespace;
	return this;
};

/**
 * Gets the node count for the StructureOrganizer object.
 * @return {number} the number of nodes in the StructureOrganizer object.
 */
StructureOrganizerBuilder.prototype.getNodeCount = function(){
    return this.m_nodeCount;
};

/**
 * Sets the node count for the StructureOrganizer object.
 * @param nodeCount the number of nodes belonging to the StructureOrganizer object.
 */
StructureOrganizerBuilder.prototype.setNodeCount = function(nodeCount) {
    if(typeof nodeCount !== "number") {
        throw new Error("Attempted to call StructureOrganizerBuilder.prototype.setNodeCount with invalid parameter.");
    }
    this.m_nodeCount = nodeCount;
	return this;
};

/**
 * Gets the StructureOrganizer object that has been constructed. Note that this method must be called after
 * the construct method has been called.
 * @return {StructureOrganizer} the StructureOrganizer object that was built.
 */
StructureOrganizerBuilder.prototype.getStructureOrganizer = function () {
    return this.m_structureOrganizer;
};

/**
 * Starts a new instance of a StructureOrganizer object. This method must be called before beginning construction
 * of a StructureOrganizer object.
 */
StructureOrganizerBuilder.prototype.startNewStructureOrganizer = function () {
    this.m_structureOrganizer = new StructureOrganizer();
    this.m_structureOrganizer.setNamespace(this.getNamespace());
    this.m_structureOrganizer.setId(""+this.m_nodeCount++);
};

/**
 * Interface method for building the navigator object.
 */
StructureOrganizerBuilder.prototype.buildNavigator = function() {
	throw new Error("Attempted to call StructureOrganizerBuilder.prototype.buildNavigator. This function must be implemented by a sub-class");
};

/**
 * The JSONStructureOrganizerBuilder class.
 * @constructor
 * @description This class extends the StructureOrganizerBuilder class. This class specifically uses JSON to create
 * the StructureOrganizer system.
 */
function JSONStructureOrganizerBuilder() {
    this.m_structureJSON = null;                      //The JSON being used to create the StructureOrganizer object.
}
JSONStructureOrganizerBuilder.prototype = new StructureOrganizerBuilder();
JSONStructureOrganizerBuilder.prototype.constructor = StructureOrganizerBuilder;

/**
 * Gets the JSON being used to construct the StructureOrganizer object.
 * @return {Object} the JSON being used to construct the StructureOrganizer object.
 */
JSONStructureOrganizerBuilder.prototype.getStructureJSON = function () {
    return this.m_structureJSON;
};

/**
 * Sets the JSON being used to construct the StructureOrganizer object.
 * @param structureJSON the JSON being used to construct the StructureOrganizer object.
 */
JSONStructureOrganizerBuilder.prototype.setStructureJSON = function (structureJSON) {
    this.m_structureJSON = structureJSON;
	return this;
};

/**
 * Constructs a structured documentation tree data structure based on the JSON that was retrieved by the
 * dynamic documentation services. It first constructs a root (SECTION -> StructureOrganizer) node, then parses
 * through the JSON, building the necessary objects and adding them to the tree.
 * @returns {StructureOrganizer} The root structured documentation node.
 */
JSONStructureOrganizerBuilder.prototype.buildStructureTree = function() {
    this.m_nodeCount = 0;
    var structureJSON = this.m_structureJSON;
    var root = new StructureOrganizer();
    this.m_structureOrganizer = root;
    root.setTemplateRelations(structureJSON.template_rltns);
    root.setReferenceSectionId(structureJSON.dd_sref_section_id);
    root.setNamespace(this.getNamespace());
    root.setId(""+this.m_nodeCount++);
    root.setOrganizer(root);
    this.traverse(structureJSON, root);
    this.handleMultiSectionStructure();
    //Only build the navigator for the root if it is not a multi-section tree.
    if(!root.isMultiSection()) {
        root.setNavigator(this.buildNavigatorForSection(root));
    }
    return root;
};

/**
 * Helper function that handles the possibility of a structure tree containing multiple sections (subsections). When
 * this occurs, a flag is set indicating that the root section is a multi-section tree. Additionally, a navigator
 * is built for each sub-section. The first subsection is set as the active section of the root.
 */
JSONStructureOrganizerBuilder.prototype.handleMultiSectionStructure = function() {
    var root = this.m_structureOrganizer;
    var children = root.getChildren();
    var childrenCount = children.length;
    var child = null;
    for(var i = 0; i < childrenCount; i++) {
        child = children[i];
        if(StructureOrganizer.prototype.isPrototypeOf(child)) {
            //You have multiple sections
            root.setIsMultiSection(true);
            child.setNavigator(this.buildNavigatorForSection(child));
            //Keep track of the active section (it starts as the first section).
            if(!root.m_activeSection) {
                root.setActiveSection(child);
            }
        }
    }
};

/**
 * Constructs a structured documentation navigator for the provided section (StructureOrganizer) node.
 * @param {StructureOrganizer} section - The section for which a navigator object will be constructed.
 * @returns {Navigator} The navigator that was constructed for the provided section.
 */
JSONStructureOrganizerBuilder.prototype.buildNavigatorForSection = function(section) {
    var navigator = new Navigator();
    navigator.setId(this.getNamespace() + ":structureNavigator:" + section.getId());
    var groups = section.getChildren();
    var group = null;
    var groupCount = groups.length;
    var namespace = this.m_namespace;
    for(var i = 0; i < groupCount; i++) {
        group = groups[i];
        var navigation = new StructureNavigation();
        navigation.setContainerId(namespace + ":organizer:CONTENT:" + section.getId());
        navigation.setAnchorId(namespace + ":group:ROOT:" + group.getId());
        navigation.setLabel(group.getTitle().replace(":", ""));
        navigation.setId(namespace + ":structureNavigation:" + group.getId());
        navigation.setNode(group);
        navigator.addNavigation(navigation);
    }
    return navigator;
};

/**
 * Builds the navigator object that represents the navigation section of the structured documentation view.
 * 
 * @returns {Navigator} navigator object that represents the navigation section
 */
JSONStructureOrganizerBuilder.prototype.buildNavigator = function() {
	var navigator = new Navigator();
	navigator.setId(this.getNamespace()+":structureNavigator");
	var groups = this.m_structureOrganizer.getChildren();
	var group = null;
	var groupCount = groups.length;
	for(var i = 0; i < groupCount; i++) {
		group = groups[i];
		var navigation = new StructureNavigation();
		navigation.setContainerId(this.getNamespace() + ":organizer:CONTENT:" + this.m_structureOrganizer.getId());
		navigation.setAnchorId(this.getNamespace() + ":group:ROOT:" + group.getId());
		navigation.setLabel(group.getTitle().replace(":", ""));
		navigation.setId(this.getNamespace()+":structureNavigation:"+group.getId());
		navigator.addNavigation(navigation);
	}
	return navigator;
};



/**
 * This is a recursive method that traverses the structure JSON, creating the associated JavaScript objects and
 * creating the necessary tree structure.
 * @param node the JSON node we are processing.
 * @param owner The parent JavaScript object is passed down a level of recursion so the new nodes can be correctly
 * added to their corresponding parent.
 */
JSONStructureOrganizerBuilder.prototype.traverse = function (node, owner) {
    var child;
    //We don't care about non-object types, so skip them.
    if (!(node instanceof Object)) {
        return;
    }
    //Go through the child JSON nodes
    for (child in node) {
        //If this is a valid node.
        if (node.hasOwnProperty(child)) {
            //Skip any non-object JSON nodes.
            if (!(node[child] instanceof  Object)) {
                continue;
            }
            //If we found an array, go through each item, processing it accordingly
            if (Array.prototype.isPrototypeOf(node[child])) {
                var childArr = node[child];
                for (var i = 0; i < childArr.length; i++) {
                    //Create a node based on the JSON
                    var structureNode = this.buildNode(child, childArr[i], owner);
                    
                    	// Check if the child node has items to expand.
					if (child === "attribute_menu_items" && (childArr[i].ui_type === "EXPAND" || childArr[i].ui_type === "TABLE")) {
						// Extract the matching children.
						this.extractMatchingChildren(childArr, i);
					}
                    //Go a level deeper, using the newly created structureNode as the new owner.
                    this.traverse(childArr[i], structureNode);
                }
            } else {
                //If we didn't find an array, just go down a level deeper, passing through the owner.
                this.traverse(node[child], owner);
            }
        }
    }
};

/**
 * This function extracts the children by CHILD_LABELID and add it to the node which has the same LABELID.
 * @param attrMenuItems - parent of the node which contains the attribute menu items
 * @param index - current node's index  in attrMenuItems.
 */
JSONStructureOrganizerBuilder.prototype.extractMatchingChildren = function(attrMenuItems, index) {
    var childIndex = 0;
    var node = attrMenuItems[index];
    var totalItems = attrMenuItems.length;
    // Iterate through the attribute items. Start validating from the next node from current node.
    for (var i = index + 1; i < totalItems; i++) {
        // Check if the node has children with same labelId and group all child nodes together.
        var attrMenuItem = attrMenuItems[i];
        if (node.label_id && attrMenuItem.child_label_id && (node.label_id === attrMenuItem.child_label_id)) {
            
            // The child node may have children, so recursively validate and group them.
            if(attrMenuItem.label_id){
                totalItems = this.extractMatchingChildren(attrMenuItems, i);
            }

            // The node has children, so initialize "attribute_menu_items".
            if ( typeof node.attribute_menu_items === "undefined") {
                node.attribute_menu_items = [];
            }
            //Add matched children into "attribute_menu_items".
            node.attribute_menu_items[childIndex++] = attrMenuItem;
            //Remove matched children from the attrMenuItems
            attrMenuItems.splice(i, 1);
            totalItems--;
            i--;
        }
    }
    return totalItems;
}; 

/**
 * A big nasty builder method that creates JavaScript structure objects based on their node type.
 * @param nodeType the type of node.
 * @param nodeJSON the corresponding node JSON.
 * @param owner the parent of this new StructureNode object.
 * @return {StructureNode} the newly created StructureNode.
 */
JSONStructureOrganizerBuilder.prototype.buildNode = function(nodeType, nodeJSON, owner) {
    var node = null;
    if(nodeType === "subsections") {
        node = new StructureOrganizer();
        node.setReferenceSectionId(nodeJSON.dd_sref_section_id);
        node.setTemplateRelations(nodeJSON.template_rltns);
    } else if(nodeType === "groupbys") {
        node = new StructureGroup();
    } else if(nodeType === "subgroupbys") {
        node = new StructureSubGroup();
    } else if(nodeType === "items") {
        node = new StructureItemGroup();
    } else if(nodeType === "attributes") {
        node = this.buildStructureTermGroupNode(nodeJSON);
    } else if(nodeType === "attribute_menu_items") {
        if(nodeJSON.user_input) {
            if(nodeJSON.ui_type === "FREE_TEXT") {
                node = this.buildFreeTextNode(nodeJSON);
            } else {
                node = this.buildInputNode(nodeJSON);
            }
        } else {
            if(nodeJSON.ui_type ==="LINE") {
                node = new LineStructureTerm();
            } else if(nodeJSON.ui_type ==="EXPAND") {
            	node =  new ExpandStructureTermGroup();
            	this.addNormality(node, nodeJSON);
            } else if(nodeJSON.ui_type ==="TABLE") {
                node = this.buildTableStructureTermGroupNode(nodeJSON);
            } else {
                node = this.buildCycleNode(nodeJSON, owner);
            }
        }
        node.setCaption(nodeJSON.caption || "");
        node.setDisplayPosition(nodeJSON.display_seq);
        node.setUIValue(nodeJSON.ui_value);
        node.setPriority(nodeJSON.priority);
    } else {
        // the traverse function checks every attribute on the JSON
        // so there will be times where it will be called on something that doesn't
        // translate into a node that can be built, like "CODE"
        return null;
    }
    //Set the display flag for the node
    if(typeof nodeJSON.displayflag !== "undefined") {
        node.setShouldRender(nodeJSON.displayflag ? true : false);
    }
    //Give the node the namespace so it will have a unique DOM existence
    node.setNamespace(this.getNamespace());
    //Set the OCID for the node if it has one, otherwise it's null
    //TODO: Figure out if no OCID means "" or null
    node.setOCID(nodeJSON.ocid || "");
    //Store the node type
    node.setType(nodeType);
    //Set the title of the node, this is either the value or name property in the JSON
    node.setTitle(nodeJSON.label || nodeJSON.value || nodeJSON.name || nodeJSON.section_label || "");
    //Use a count variable to give each node a unique numerical identifier
    node.setId((this.m_nodeCount++)+"");
    //Associate the current organizer to the node
    node.setOrganizer(this.getStructureOrganizer());
    //Add the node to the lookup so we can access it later via the DOM id
    this.m_structureOrganizer.addTermToLookup(node);
    //Add the new node to the parent
    owner.addChild(node);
    return node;
};

/**
 * Creates a StructureTermGroup object based on the attrib_type json field. This will either construct a
 * Single, Multiple, or YesNo grouping.
 * @param nodeJSON the node's JSON.
 * @return {StructureTermGroup} a "Single" -> SingleStructureTermGroup, "Multiple" -> MultiStructureTermGroup,
 * "YesNo" -> YesNoStructureTermGroup.
 */
JSONStructureOrganizerBuilder.prototype.buildStructureTermGroupNode = function(nodeJSON) {
    switch(nodeJSON.attrib_type) {
        case "Single":
            return new SingleStructureTermGroup();
        case "Multiple":
            return new MultiStructureTermGroup();
        case "YesNo":
            return new YesNoStructureTermGroup();
        default:
            throw new Error("Attempted to call JSONStructureOrganizerBuilder.prototype.buildStructureTermGroupNode with" +
				" unsupported ATTRIB_TYPE");
    }
};

/**
 * Creates an InputStructureTerm object. Based on the data type, the object will be given validators to verify correct
 * input has been provided.
 * @param nodeJSON
 * @return {InputStructureTerm}
 */
JSONStructureOrganizerBuilder.prototype.buildInputNode = function(nodeJSON) {
    var node = new InputStructureTerm();
    node.setDataType(nodeJSON.data_type);
    node.setActiveState(new TermState().setCSSClass((nodeJSON.normalfinding === "Abnormal") ? "documented-abnormal" : "documented").setValue(true));
    node.setInactiveState(new TermState().setCSSClass("undocumented").setValue(null));
    node.setInitialState(node.getInactiveState());
    if(nodeJSON.data_type === "NUMERIC") {
        if(nodeJSON.min_value === 0.0 && nodeJSON.max_value === 0.0) {
            //Just add the default since it accepts any number
            node.addValidator(new DataRangeValidator());
        } else {
            node.addValidator(new DataRangeValidator().setMinValue(nodeJSON.min_value).setMaxValue(nodeJSON.max_value));
        }
    }

    node.addValidator(new DataTypeValidator().setDataType(nodeJSON.data_type));

    return node;
};

/**
 * Creates a FreeTextStructureTerm object. This object is always an ALPHA (plus more).
 * @return {FreeTextStructureTerm} the FreeTextStructureTerm object that was constructed.
 */
JSONStructureOrganizerBuilder.prototype.buildFreeTextNode = function(nodeJSON) {
    var node = new FreeTextStructureTerm();
    node.setDataType(nodeJSON.data_type);
    node.setActiveState(new TermState().setCSSClass(nodeJSON.normalfinding === "Abnormal" ? "documented-abnormal" : "documented").setValue(true));
    node.setInactiveState(new TermState().setCSSClass("undocumented").setValue(null));
    node.setInitialState(node.getInactiveState());
    return node;
};

/**
 * Creates a TableStructureTermGroup object.
 * @param  {JSON} nodeJSON JSON representation of the Table Group to be generated
 * @return {TableStructureTermGroup} the TableStructureTermGroup object what was constructed.
 */
JSONStructureOrganizerBuilder.prototype.buildTableStructureTermGroupNode = function(nodeJSON) {
    var node = new TableStructureTermGroup();
    this.addNormality(node, nodeJSON);
    return node;
};


/**
 * Creates a CycleStructureTerm object.
 * @param nodeJSON the JSON representation of the node.
 * @param owner the parent of this CycleStructureTerm. It is necessary to know the owner of this term because
 * if it exists within a YesNo StructureTermGroup, it will be given an additional no-state.
 * @return {CycleStructureTerm} the CycleStructureTerm object that was created.
 */
JSONStructureOrganizerBuilder.prototype.buildCycleNode = function(nodeJSON, owner) {
    var node = null;
    var nodeUIType = nodeJSON.ui_type;
    // Yes/No terms have 2 documented states. The first documented state is "Yes", the second documented state is "No". It should not be NONE term.
    var isYesNo = YesNoStructureTermGroup.prototype.isPrototypeOf(owner) && nodeUIType !== "NONE";
    if(isYesNo) {
        node = new YesNoStructureTerm();
    } else if(nodeUIType === "NONE"){
		node = new NoneStructureTerm();			
	} else if(TableStructureTermGroup.prototype.isPrototypeOf(owner)){
        node = new TableStructureTerm();
    }
    else {
        node = new CycleStructureTerm();
    }
    this.addNormality(node, nodeJSON);

    return node;
};

/**
 * Adds states to the passed node based on the normality
 * @param {StructureNode}  node  The node to associate the normality to
 * @param {JSON}  nodeJSON JSON containing node details (including normality)
 */
JSONStructureOrganizerBuilder.prototype.addNormality = function(node, nodeJSON) {
    // Check if node is a YesNo node (to determine whether or not to add 3rd state)
    var isYesNo = YesNoStructureTerm.prototype.isPrototypeOf(node);
    var normality = nodeJSON.normalfinding;
    // add the undocumented state
    node.addState(new TermState().setCSSClass("undocumented").setValue(null));

    // add the documented state(s)
    // Yes/No terms have 2 documented states. The first documented state is "Yes", the second documented state is "No".
    switch(normality) {
        case "Neutral":
            node.addState(new TermState().setCSSClass("documented").setValue(true));
            if (isYesNo) {
                // add second/No state for the Yes/No term
                node.addState(new TermState().setCSSClass("documented").setValue(false));
            }
            break;
        case "Normal":
            node.addState(new TermState().setCSSClass("documented").setValue(true));
            if (isYesNo) {
                // add second/No state for the Yes/No term... where answering "No" to something normal = abnormal
                node.addState(new TermState().setCSSClass("documented-abnormal").setValue(false));
            }
            break;
        case "Abnormal":
            node.addState(new TermState().setCSSClass("documented-abnormal").setValue(true));
            if (isYesNo) {
                // add second/No state for the Yes/No term... where answersing "No" to something abnormal = normal
                node.addState(new TermState().setCSSClass("documented").setValue(false));
            }
            break;
        default:
            throw new Error("Unexpected normal finding value in the JSON: " + normality);
    }

    node.setInitialState(node.getStates()[0]);
    return node;
};


/**
 * Overrides the StructureOrganizerBuilder update method. It initiates the update process by starting a
 * recursive travel through the JSON, updating the associated JavaScript objects.
 *
 * @param organizer The StrutureOrganizer being updated.
 * @param activityJson the JSON object that contains activity data.
 */
JSONStructureOrganizerBuilder.prototype.update = function (organizer, activityJson) {
	organizer.setActivityId(activityJson.dd_section_id);
	this.updateTraverse(activityJson, organizer);
};

/**
 * This is a recursive method that traverses the structure JSON, creating the associated JavaScript objects and
 * creating the necessary tree structure.
 * @param node the JSON node we are processing.
 * @param owner The parent JavaScript object is passed down a level of recursion so the new nodes can be correctly
 * added to their corresponding parent.
 */
JSONStructureOrganizerBuilder.prototype.updateTraverse = function (node, owner) {
    var child;
    //We don't care about non-object types, so skip them.
    if (!(node instanceof Object)) {
        return;
    }
    //Go through the child JSON nodes
    for (child in node) {
        //If this is a valid node.
        if (node.hasOwnProperty(child)) {
            //Skip any non-object JSON nodes.
            if (!(node[child] instanceof  Object)) {
                continue;
            }
            //If we found an array, go through each item, processing it accordingly
            if (Array.prototype.isPrototypeOf(node[child])) {
                var childArr = node[child];
                for (var i = 0; i < childArr.length; i++) {
                    //Create a node based on the JSON
                    var structureNode = this.updateNode(child, childArr[i], owner);

                    if (structureNode) {
                        //Go a level deeper, using the newly created structureNode as the new owner.
                        this.updateTraverse(childArr[i], structureNode);
                    }
                }
            } else {
                //If we didn't find an array, just go down a level deeper, passing through the owner.
                this.updateTraverse(node[child], owner);
            }
        }
    }
};

/**
 * A big nasty update method that updates JavaScript structure objects based on their node type.
 * @param nodeType the type of node.
 * @param nodeJSON the corresponding node JSON.
 * @param owner the parent of this new StructureNode object.
 * @return {StructureNode} the newly created StructureNode.
 */
JSONStructureOrganizerBuilder.prototype.updateNode = function(nodeType, nodeJSON, owner) {
	var node = null;
	var children = owner.getChildren();
	var i;
	var currentNode;
	// find the correct node
	// and set its activity id
	if(nodeType === "subsections") {
		for(i = 0; i < children.length; i++) {
			currentNode = children[i];
			if(this.matchesSubsection(children[i], nodeJSON)) {
				node = currentNode;
				node.setActivityId(nodeJSON.dd_section_id);
				break;
			}
		}
	} else if(nodeType === "groupbys") {
		for (i = 0; i < children.length; i++) {
			currentNode = children[i];
			if (nodeJSON.label === currentNode.getTitle()) {
				node = currentNode;
				node.setActivityId(nodeJSON.dd_groupby_id);
				break;
			}
		}
	} else if(nodeType === "subgroupbys") {
		for (i = 0; i < children.length; i++) {
			currentNode = children[i];
			if (nodeJSON.label === currentNode.getTitle()) {
				node = currentNode;
				node.setActivityId(nodeJSON.dd_sgroupby_id);
				break;
			}
		}
	} else if(nodeType === "items") {
		for (i = 0; i < children.length; i++) {
			currentNode = children[i];
			if (nodeJSON.ocid === currentNode.getOCID()) {
				node = currentNode;
				node.setActivityId(nodeJSON.dd_item_id);
				break;
			}
		}
	} else if(nodeType === "attributes") {
		for (i = 0; i < children.length; i++) {
			currentNode = children[i];
			if (nodeJSON.ocid === currentNode.getOCID()) {
				node = currentNode;
				node.setActivityId(nodeJSON.dd_attribute_id);
				break;
			}
		}
	} else if(nodeType === "attribute_menu_items") {
		// Loop through to find the correct JSON child
		for (i = 0; i < children.length; i++) {
			currentNode = children[i];

            // Ensure to search lower levels if this is an attribute_menu_item with children (Expand/Table)
            if (currentNode.getChildren().length > 0) {
                this.updateNode(nodeType, nodeJSON, currentNode);
            }

			if (nodeJSON.ocid === currentNode.getOCID() && nodeJSON.display_seq === currentNode.getDisplayPosition()) {
				node = currentNode;
				node.setActivityId(nodeJSON.dd_attr_menu_item_id);
				//builds and displays comment if the node JSON has comment
				if(nodeJSON.comment) {				
					node.displayComment(nodeJSON.comment);
				}
				// update state/value based on type of term
				if (node instanceof InputStructureTerm) {
					//Store the current text value on the term
					node.setCurrentValue(nodeJSON.value_text ? node.unescapePlaintextAsHtml(nodeJSON.value_text) : nodeJSON.value_number + "");
					//Update the term (may have a visual update as well)
					node.update();
				} else if (node instanceof CycleStructureTerm) {
					node.jumpToState(nodeJSON.truth_state_mean === "T" ? 1 : 2);
				}

				break;
			}
		}
	}

	return node;
};

/**
 * Determines if an existing subsection structure node matches the provided subsection JSON. This is so we can match up
 * activity data to the corresponding subsection object. The subsection node and JSON are considered a match only if all
 * of the template_rltns match.
 * @param {StructureOrganizer} subsectionNode - The subsection structure node against which we are comparing the
 * provided JSON to determine if it matches.
 * @param { { "dd_section_id" : number, ..., "template_rltns" : [ ... ]} } subsectionJSON - A subsection JSON against
 * which we are comparing the provided subsection node to determine if it matches.
 * @returns {boolean} True if the subsection node matches the subsection JSON, otherwise false.
 */
JSONStructureOrganizerBuilder.prototype.matchesSubsection = function(subsectionNode, subsectionJSON) {
	var subsectionTemplateRelations = subsectionNode.getTemplateRelations();
	var activityTemplateRelations = subsectionJSON.template_rltns;
	var subsectionTemplateRelationCount = subsectionTemplateRelations.length;
	var activityTemplateRelationCount = activityTemplateRelations.length;
	var subsectionTemplateRelation = null;
	var activityTemplateRelation = null;
	var matchedRelation = false;
	if(subsectionTemplateRelationCount !== activityTemplateRelationCount) {
		return false;
	}
	for(var i = 0; i < subsectionTemplateRelationCount; i++) {
		subsectionTemplateRelation = subsectionTemplateRelations[i];
		matchedRelation = false;
		for(var j = 0; j < activityTemplateRelationCount; j++) {
			activityTemplateRelation = activityTemplateRelations[j];
			if(subsectionTemplateRelation.dd_sref_chf_cmplnt_crit_id === activityTemplateRelation.dd_sref_chf_cmplnt_crit_id &&
				subsectionTemplateRelation.dd_sref_templ_instance_ident === activityTemplateRelation.dd_sref_templ_instance_ident &&
				subsectionTemplateRelation.parent_entity_id === activityTemplateRelation.parent_entity_id &&
				subsectionTemplateRelation.parent_entity_name === activityTemplateRelation.parent_entity_name) {
				matchedRelation = true;
				break;
			}
		}
		if(!matchedRelation) {
			return false;
		}
	}
	return true;
};

/**
 * Generates the question set object which is used to display structure template questions.
 * @param {Object} questionData - The JSON question data which is translated into the associated
 * StructureQuestionSet object.
 * @returns {StructureQuestionSet} The structure question set object generated from the provided JSON.
 */
JSONStructureOrganizerBuilder.prototype.buildQuestionSet = function(questionData) {
	var rawQuestion = null;
	var rawAnswers = null;
	var rawAnswer = null;
	var rawAnswerCount = null;

	var questionCount = questionData.length;
	var questionSet = new StructureQuestionSet();
	var question = null;
	var answer = null;

	var nodeCount = 0;

	questionSet.setNamespace(this.m_namespace);
	var lookup = questionSet.getLookup();

	//Loop through the data and generate the question objects
	for(var i = 0; i < questionCount; i++) {
		rawQuestion = questionData[i];
		question = new StructureQuestion();
		question.setId(++nodeCount + "");
		question.setNamespace(this.m_namespace);
		question.setQuestionDisplay(rawQuestion.label);
		question.setParentEntityId(rawQuestion.parent_entity_id);
		question.setParentEntityName(rawQuestion.parent_entity_name);

		rawAnswers = rawQuestion.choices;
		rawAnswerCount = rawAnswers.length;
		for(var j = 0; j < rawAnswerCount; j++) {
			rawAnswer = rawAnswers[j];
			answer = new StructureAnswer();
			answer.setAnswerDisplay(rawAnswer.label);
			answer.setTemplateId(rawAnswer.dd_sref_chf_cmplnt_crit_id);
			answer.setId(++nodeCount + "");
			answer.setNamespace(this.m_namespace);
			//Add the answer to the lookup.
			lookup[answer.getId()] = answer;
			question.addChild(answer);
		}
		questionSet.addChild(question);
	}
	return questionSet;
};

/**
 * This argument will be used to have individual methods of a child class inherit from a parent class
 * @param  {Class} childClass  The class that will 'inherit' methods
 * @param  {Class} parentClass The class that's methods will be 'inherited'
 * @param  {Array<String>} methods An array of methods (as strings) to inherit.  Will be added to child class to call parent method.
 * @return {undefined}
 */
JSONStructureOrganizerBuilder.extendClassMethods = function(childClass, parentClass, methods) {
    var methodCnt = methods.length;
    for (var i = 0; i < methodCnt; i++){
        (function(x){
            //Create method on child class that calls the parent class method with child context.
            childClass.prototype[methods[x]] = function(args) {
                return parentClass.prototype[methods[x]].apply(this, arguments);
            };
        })(i);
    }
};
/**
 * StructureNode
 * This class represents the very base level node concept for structure documentation. This node allows for
 * construction of an (n)ary tree. All base functionality, within reason, for structure nodes is encapsulated in
 * this base class.
 * @constructor
 */
function StructureNode() {
	this.m_activityId = 0.0;			//The id that links to activity data, as opposed to reference data
	this.m_children = null;				//The child nodes of this node
	this.m_dirty = false;				//The dirty status of the node (whether is has been modified since load)
	this.m_displayPosition = 0;			//The display position of the node
	this.m_id = "";						//A unique identifier for the node.
	this.m_initialState = null;			//The starting state of the node (on creation)
	this.m_namespace = "";				//The namespace for the node (useful for giving unique DOM ids)
	this.m_numberDocumented = 0;		//The number of child nodes that have been documented
	this.m_ocid = "";					//The OCID of the node (not always present)
	this.m_parent = null;				//The parent of this node (root node will have null parent)
	this.m_previousState = null;		//The previous state of the node
	this.m_rootElement = null;			//The root element of the node (if available)
	this.m_shouldRender = true;			//Whether the node should ever be rendered or not.
	this.m_isDefaultDisplayed = true;	//Whether the node should be displayed (rendered) initially
	this.m_state = null;				//What state the node is in (documented or not, etc)
	this.m_title = "";					//The title of the node (not always visible)
	this.m_type = "";					//The node type (json key value)
	this.m_inNavigateStructureTree = true; //The node should be default searched for in the structure tree
	this.m_shouldSave = true;			//The node will be defaulted to be included when saving
}

/**
 * Returns the activityId of the StructureNode.
 * @returns {number} activity id
 */
StructureNode.prototype.getActivityId = function () {
	return this.m_activityId;
};
/**
 * Sets the activityId of the StructureNode.
 * @param {string} id - The id of the StructureNode.
 */
StructureNode.prototype.setActivityId = function (activityId) {
	if (typeof activityId !== "number") {
		throw new Error("Called setActivityId on StructureNode with invalid parameter for activityId");
	}
	this.m_activityId = activityId;
	return this;
};

/**
 * Returns the Array of children for this StructureNode.
 * @returns {Array<StructureNode>}
 */
StructureNode.prototype.getChildren = function () {
	if (!this.m_children) {
		this.m_children = [];
	}
	return this.m_children;
};

/**
 * Returns the dirty state of this StructureNode.
 * @returns {boolean}
 */
StructureNode.prototype.isDirty = function () {
	return this.m_dirty;
};

/**
 * Sets the dirty state of this StructureNode.
 * @param {boolean} dirty - The dirty state of this StructureNode. True if dirty, otherwise false.
 * @returns {StructureNode}
 */
StructureNode.prototype.setIsDirty = function (dirty) {
	if (typeof dirty !== "boolean") {
		throw new Error("Called setIsDirty on StructureNode with invalid dirty parameter.");
	}
	this.m_dirty = dirty;
	return this;
};

/**
 * Returns the displayPosition value of the StructureNode.
 * @returns {number}
 */
StructureNode.prototype.getDisplayPosition = function () {
	return this.m_displayPosition;
};

/**
 * Sets the displayPosition value of the StructureNode.
 * @param {number} displayPosition - The displayPosition value of the StructureNode.
 */
StructureNode.prototype.setDisplayPosition = function (displayPosition) {
	if(typeof displayPosition !== "number") {
		throw new Error("Attempted to call StructureNode.prototype.setDisplayPosition with invalid parameter.");
	}
	this.m_displayPosition = displayPosition;
	return this;
};

/**
 * Returns the id of the StructureNode.
 * @return {string}
 */
StructureNode.prototype.getId = function () {
	return this.m_id;
};
/**
 * Sets the id of the StructureNode.
 * @param {string} id - The id of the StructureNode. This will give the node a unique presence on the DOM.
 * @returns {StructureNode}
 */
StructureNode.prototype.setId = function (id) {
	if (typeof id !== "string") {
		throw new Error("Called setId on StructureNode with invalid parameter for id");
	}
	this.m_id = id;
	return this;
};

/**
 * Returns the initial TermState of this StructureNode. This is the state since the last save.
 * @returns {TermState}
 */
StructureNode.prototype.getInitialState = function () {
	return this.m_initialState;
};

/**
 * Sets the initial TermState of this StructureNode. This is the state since the last save.
 * @param {TermState} initialState - The TermState since the last save operation.
 * @returns {StructureNode}
 */
StructureNode.prototype.setInitialState = function (initialState) {
	if (!TermState.prototype.isPrototypeOf(initialState)) {
		throw new Error("Called setInitialState on StructureNode with invalid initialState parameter.");
	}
	this.m_initialState = initialState;
	return this;
};

/**
 * Returns the namespace of this StructureNode. Namespaces are used to provide unique html identification across
 * multiple instances of structured documentation.
 * @returns {string}
 */
StructureNode.prototype.getNamespace = function () {
	return this.m_namespace;
};

/**
 * Sets the namespace of this StructureNode. Namespaces are used to provide unique html identification across
 * multiple instances of structured documentation.
 * @param {string} namespace - The namespace of this StructureNode.
 * @returns {StructureNode}
 */
StructureNode.prototype.setNamespace = function (namespace) {
	if (typeof namespace !== "string") {
		throw new Error("Called setNamespace on StructureNode with invalid namespace parameter.");
	}
	this.m_namespace = namespace;
	return this;
};

/**
 * Returns the number of children that are documented.
 * @returns {number}
 */
StructureNode.prototype.getNumberOfDocumentedChildren = function () {
	return this.m_numberDocumented;
};

/**
 * Returns the OCID of this StructureNode.
 * @returns {string}
 */
StructureNode.prototype.getOCID = function () {
	return this.m_ocid;
};

/**
 * Sets the OCID of this StructureNode.
 * @param {string} ocid - The OCID of this StructureNode.
 */
StructureNode.prototype.setOCID = function (ocid) {
	if(typeof ocid !== "string") {
		throw new Error("Attempted to call StructureNode.prototype.setOCID with invalid parameter.");
	}
	this.m_ocid = ocid;
	return this;
};

/**
 * Returns the parent of this StructureNode, if there is one.
 * @returns {StructureNode}
 */
StructureNode.prototype.getParent = function () {
	return this.m_parent;
};

/**
 * Sets the parent of this StructureNode.
 * @param {StructureNode} parent - The StructureNode that is the parent of this StructureNode.
 * @returns {StructureNode}
 */
StructureNode.prototype.setParent = function (parent) {
	if (!StructureNode.prototype.isPrototypeOf(parent)) {
		throw new Error("Called setParent on StructureNode with invalid parent parameter.");
	}
	this.m_parent = parent;
	return this;
};

/**
 * Returns the previous TermState of this StructureNode. This is the TermState since the last state change.
 * @returns {TermState}
 */
StructureNode.prototype.getPreviousState = function () {
	return this.m_previousState;
};

/**
 * Sets the previous TermState of this StructureNode.
 * @param {TermState} previousState - The TermState since the last state change.
 */
StructureNode.prototype.setPreviousState = function (previousState) {
	if(!TermState.prototype.isPrototypeOf(previousState) && previousState !== null) {
		throw new Error("Attempted to call StructureNode.prototype.setPreviousState with invalid parameter.");
	}
	this.m_previousState = previousState;
	return this;
};

StructureNode.prototype.getRootElement = function () {
	return this.m_rootElement;
};

/**
 * Returns whether or not this StructureNode should render its contents. This is simply a display flag.
 * @returns {boolean}
 */
StructureNode.prototype.getShouldRender = function () {
	return this.m_shouldRender;
};

/**
 * Sets whether or not this StructureNode should render its contents. This is simply a display flag. Note that
 * this flag has no effect on the children. If this node is invisible, its children may still render.
 * @param {boolean} shouldRender - Whether this StructureNode should render its contents.
 */
StructureNode.prototype.setShouldRender = function (shouldRender) {
	if (typeof shouldRender !== "boolean") {
		throw new Error("Called setShouldRender on StructureNode with invalid shouldRender parameter.");
	}
	this.m_shouldRender = shouldRender;
	return this;
};


/**
 * Method used for determining whether or not a node is in the correct position in the navigation-data coming from cernstructure plugin.
 * This is utilized to handle how the nodes heirarchy is searched to match a node based on label/ocid details from the cernstructure.
 * Certain nodes (Table/Expand) are not in the correct tree structure in the structured plugin due to linearization of AMIs there.
 * Nodes that should be ignored when searching (due to the linearized AMIs from cernstructure node heirarchy) will return false here.
 * By default, Nodes will be included when searching through the structure tree.
 * @return {Boolean} Returns true if the node should be considered when searching the structure tree
 */
StructureNode.prototype.inNavigationStructureTree = function() {
	return this.m_inNavigateStructureTree;
};

/**
 * Returns whether or not the details of the current node should be added to the JSON on save
 * @return {Boolean} Whether the current node should be included in the JSON to save
 */
StructureNode.prototype.shouldSave = function() {
	return this.m_shouldSave;
};

/**
 * Returns whether or not this StructureNode should render on initial structure render.  
 * This differs from getShouldRender as it only affects whether the node is rendered on the initial render.
 * The intent of this function is to limit the nodes that are displayed (and rendered) initially for performance reasons.
 * @return {Boolean} Returns true if the node should be displayed on the initial page load
 */
StructureNode.prototype.isDefaultDisplayed = function() {
	return this.m_isDefaultDisplayed;
};

/**
 * Sets whether or not this StructureNode should render on the initial structure tab render
 * @param {Boolean} defaultDisplayed - Whether this StructureNode should render initially
 */
StructureNode.prototype.setIsDefaultDisplayed = function(defaultDisplayed){
	if (typeof defaultDisplayed !== "boolean") {
		throw new Error("Called setIsDefaultDisplayed on StructureNode with invalid defaultDisplayed paramater");
	}
	this.m_isDefaultDisplayed = defaultDisplayed;
	return this;
};

/**
 * Method to be implemented by child nodes.  Returns whether or not the node is currently displayed on the page.
 * This function is intended to be used to ensure that a node is visible on the page before performing certain operations
 * @return {Boolean} Returns true if the node is currently displayed on the page
 */
StructureNode.prototype.isCurrentlyDisplayed = function() {
	return true;
};

/**
 * Method to be implemented by child nodes.  Performs updates to ensure that the node is displayed on the page.
 */
StructureNode.prototype.displayNode = function() {
	throw new Error("displayNode is abstract, to be implemented by children");
};

/**
 * Returns the TermState this StructureNode is in.
 * @returns {TermState}
 */
StructureNode.prototype.getState = function () {
	return this.m_state;
};

/**
 * Sets the TermState this StructureNode is in.
 * @param {TermState} state - The current TermState this StructureNode is in.
 */
StructureNode.prototype.setState = function (state) {
	if(!TermState.prototype.isPrototypeOf(state)) {
		throw new Error("Attempted to call StructureNode.prototype.setState with invalid parameter.");
	}
	this.m_state = state;
	return this;
};

/**
 * Returns the title of this StructureNode. This is the value that will display in the markup.
 * @returns {string}
 */
StructureNode.prototype.getTitle = function () {
	return this.m_title;
};

/**
 * Sets the title of this StructureNode. This is the value that will display in the markup.
 * @param {string} title - The title of this StructureNode.
 */
StructureNode.prototype.setTitle = function (title) {
	if(typeof title !== "string") {
		throw new Error("Attempted to call StructureNode.prototype.setTitle with invalid parameter.");
	}
	this.m_title = title;
	return this;
};

/**
 * Returns the type of this StructureNode.
 * @returns {string}
 */
StructureNode.prototype.getType = function () {
	return this.m_type;
};

/**
 * Sets the type of this StructureNode.
 * @param {string} type - The type of this StructureNode.
 */
StructureNode.prototype.setType = function (type) {
	if(typeof type !== "string") {
		throw new Error("Attempted to call StructureNode.prototype.setType with invalid parameter.");
	}
	this.m_type = type;
	return this;
};

/**
 * This method allows a node to notify another node that it is dirty. The base implementation is to simply pass
 * this notification up the chain of parents. If a sub-class needs to perform some functionality, this method should
 * be overridden.
 * @param {StructureNode} node - The StructureNode that is informing of a dirty change.
 */
StructureNode.prototype.notifyDirty = function (node) {
	if (this.getParent()) {
		this.getParent().notifyDirty(node);
	}
};

/**
 * This method simply restores the StructureNode to a non-dirty state by setting the dirty member variable to false.
 */
StructureNode.prototype.resetDirty = function () {
	this.m_dirty = false;
};

/**
 * This turns a StructureNode into the JSON necessary for the save function
 * @return {string} a JSON string representation of the activity data of the node
 */
StructureNode.prototype.convertToJSON = function () {
	return {};
};

/**
 * This returns the parent organizer (SectionNode) of the current node (or null if not found)
 * @return {StructureOrganizer} The parent StructureOrganizer of the current node
 */
StructureNode.prototype.getOrganizer = function() {
	return this.m_organizer;
};

/**
 * Sets the StructureOrganizer associated with the current node
 * @param {StructureOrganizer} organizer - StructureOrganizer associated with the node
 */
StructureNode.prototype.setOrganizer = function(organizer) {
	if(!StructureOrganizer.prototype.isPrototypeOf(organizer)) {
		throw new Error("StructureOrganizer.prototype.setOrganizer expects a StructureOrganizer object.");
	}
	this.m_organizer = organizer;
};

/**
 * Returns the closest StructureOrganizer ancestor of the current node
 * @return {StructureOrganizer} The StructureOrganizer node that the current node descends from
 */
StructureNode.prototype.getParentSectionNode = function() {
	var currentNode = this;
	var sectionNode = null;
	//Find the section node that is the parent to the provided node
	while(currentNode !== null && !StructureOrganizer.prototype.isPrototypeOf(currentNode)) {
		currentNode = currentNode.getParent();
	}
	sectionNode = currentNode;
	return sectionNode;
};

/**
 * Returns the element that should be updated when the node should be highlighted
 * @return {undefined}
 */
StructureNode.prototype.getHighlightElement = function() {
	return this.getRootElement();
};

/**
 * Handles actions necessary after the initial rendering of a Structured tab.
 * @return {undefined} 
 */
StructureNode.prototype.postProcessing = function () {
	//Allow to be overwritten by children
};

/**
 * Add the children's json into the supplied array.
 *
 * @param {Array<JSON>} jsonArray - The array to push the children's json into
 */
StructureNode.prototype.addChildrenJSON = function (jsonArray) {
	// prep children json
	var children = this.getChildren();
	this.addNodesToJSON(children, jsonArray);
};

/**
 * Adds specified nodes to the given JSON
 * @param {Array<StructureNode>} nodes  StructureNodes to add to JSON
 * @param {Array<JSON>} jsonArray The array to push the children's json into
 */
StructureNode.prototype.addNodesToJSON = function (nodes, jsonArray) {
	var childrenMap = {};
	// map the children's json to their type, eg. "ITEM" => ["{....}", ... ]
	for (var i = 0; i < nodes.length; i++) {
		var child = nodes[i];
		var stateTruth = (child.getState() ? child.getState().getValue() : null);
		//If the node is not in a documented state then skip it unless it is a subsection node.
		//Subsection nodes must always be added, regardless of documented state.
		//Nodes that shouldn't be saved will be skipped
		if (stateTruth === null && child.getType() !== "subsections" || !child.shouldSave()) {
			continue;
		}

		// create the initial array if it doesn't exist
		if (!childrenMap[child.getType()]) {
			childrenMap[child.getType()] = [];
		}

		// convert the child into a json string and push into the array
		var childJSON = child.convertToJSON();
		childrenMap[child.getType()].push(childJSON);
	}

	// push the child into the section json
	for (var type in childrenMap) {
		jsonArray.push('"' + type + '": [' + childrenMap[type].join(',') + ']');
	}
};

/**
 * Adds all descendents of the current node to a passed array
 * @param  {Array} childList Array to add descendent StructureNodes to
 * @return {Array} Returns the passed array with added descendents
 */
StructureNode.prototype.getAllDescendents = function(childList) {
	var children = this.getChildren();
	var childCnt = children.length;
	var child;
	for (var i = 0; i < childCnt; i++){
		child = children[i];
		childList.push(child);
		child.getAllDescendents(childList);
	}
	return childList;
};

/**
 * Adds the descendent's json into the supplied array.  This is utilized when children AMI nodes 
 * exist at multiple levels in the structure tree (i.e. EXPAND/TABLE).  This handles adding converting
 * the tree structure into a linear JSON array.
 * @param {Array<JSON>} jsonArray The array to push the descendents' json into
 */
StructureNode.prototype.addDescendentJSON = function(jsonArray) {
	var descendents = this.getAllDescendents([]);
	this.addNodesToJSON(descendents, jsonArray);
};

/**
 * Escapes the special characters in the supplied string as HTML to make it safe for CCL and JSON.
 *
 * Special characters escaped:
 *	& - &#38;
 *	" - &#34;
 *	' - &#39;
 *	< - &#60;
 *	> - &#62;
 *	\ - &#92;
 *	^ - &#94;
 *	~ - &#126;
 *	\t - "&#9;
 *	\r - &#10;
 * 	\n - &#13;
 *
 * @param {string} plaintext - plain text, could be something like a free text comment
 * @returns {string} plain text that is represented as html, and is safe for to be handled by CCL and as part of a JSON string
 */
StructureNode.prototype.escapePlaintextAsHtml = function (plaintext) {
	// NOTE: always replace ampersand (&) first!
	return plaintext.replace(/\&/g, "&#38;").replace(/\"/g, "&#34;").replace(/\'/g, "&#39;").replace(/\</g, "&#60;").replace(/\>/g, "&#62;")
		.replace(/\\/g, "&#92;").replace(/\^/g, "&#94;").replace(/\~/g, "&#126;").replace(/\t/g, "&#9;").replace(/\r/g, "&#10;").replace(/\n/g, "&#13;");
};

/**
 * Converts HTML escapes back to plain text by
 * undoing the escapes performed by the escapePlaintextAsHtml() method.
 *
 * Special characters un-escaped:
 *	& - &#38;
 *	" - &#34;
 *	' - &#39;
 *	< - &#60;
 *	> - &#62;
 *	\ - &#92;
 *	^ - &#94;
 *	~ - &#126;
 *	\t - "&#9;
 *	\r - &#10;
 * 	\n - &#13;
 * 
 * @param {string} html - text as html with special character that needs to be unescaped back into plain text
 * @returns {string} regular plain text without any escapes for HTML/CCL/JSON
 */
StructureNode.prototype.unescapePlaintextAsHtml = function (html) {
	// NOTE: always unescape ampersand (&) last!
	return html.replace(/\&\#34\;/g, '"').replace(/\&\#39\;/g, "'").replace(/\&\#60\;/g, '<').replace(/\&\#62\;/g, '>').replace(/\&\#92\;/g, "\\")
		.replace(/\&\#94\;/g, "^").replace(/\&\#126\;/g, "~").replace(/\&\#9\;/g, "\t").replace(/\&\#10\;/g, "\r").replace(/\&\#13\;/g, "\n").replace(/\&\#38\;/g, "&");
};


/**
 * This method acts as a notification of a state change in a child node. Certain parent nodes need to know the
 * state of their children and perform actions accordingly. This base method simply keeps track of the number of
 * children nodes that are documented.
 * @param {StructureNode} node - The StructureNode child that is informing of a state change event.
 */
StructureNode.prototype.notifyStateChange = function (node) {
	var currentState = node.getState();
	var previousState = node.getPreviousState();
	if (previousState && currentState.getValue() === previousState.getValue()) {
		return;
	}
	var previousNumber = this.m_numberDocumented;
	if (currentState.getValue() === null) {
		this.m_numberDocumented = Math.max(0, this.m_numberDocumented - 1);
	} else if ((!node.getPreviousState() || node.getPreviousState().getValue() === null) && currentState.getValue() !== null) {
		this.m_numberDocumented = Math.min(this.m_children.length, this.m_numberDocumented + 1);
	}
	if (this.m_numberDocumented === 0) {
		this.updateState(new TermState().setValue(null).setKey("NULL"));
	} else if (this.m_numberDocumented > 0 && previousNumber === 0) {
		this.updateState(new TermState().setValue(true).setKey("TRUE"));
	}
};

/**
 * This method performs the necessary actions to update the state of the StructureNode. If the state being updated
 * to is different than the current state, a notification of state change is sent to the parent. The node is then
 * refreshed and the new state is stored.
 * @param {TermState} state - The state the StructureNode should be updated to.
 */
StructureNode.prototype.updateState = function (state) {
	var currentState = this.getState();
	if (state !== currentState) {
//		this.m_state = state;
		this.setState(state);
		this.setPreviousState(currentState);
		//If the node has a parent, notify of the state change
		if (this.getParent()) {
			this.getParent().notifyStateChange(this);
		}
	}

	// refresh anyways, something else (like whether the node is valid) may have changed while keeping the state the same
	this.refresh();
};

/**
 * Base refresh method for a StructureNode. This is simply an interface. This method should be implemented by
 * sub-classes of StructureNode.
 */
StructureNode.prototype.refresh = function () {
};

/**
 * Adds a child node to this StructureNode. This also performs the necessary operation of linking the child to this
 * node as the parent.
 * @param {StructureNode} child - The StructureNode that is to become a child of this StructureNode.
 */
StructureNode.prototype.addChild = function (child) {
	if (child.getParent() !== this) {
		child.setParent(this);
	}
	this.getChildren().push(child);
};

/**
 * The base render method. Any subclasses of StructureNode should provide their implementation of the render method.
 * @param {StructureHtml} structureHtml - The StructureHtml package to which any html content will be appended.
 */
StructureNode.prototype.render = function (structureHtml) {
	return;
};

/**
 * Clears the node and its decendents of all data, effectively resetting them to the state of being freshly created.
 *
 */
StructureNode.prototype.clear = function () {
	var children = this.getChildren();
	var i;
	for (i = 0; i < children.length; i++) {
		children[i].clear();
	}

	this.clearSelf();
};

/**
 * Clears only this node, effectively resetting itself to the state of being freshly created.
 *
 * Subclasses are to override this method as the implementation will vary with each subclass.
 * Generally, for all subclasses, clearing the activity id is the first thing that needs to happen.
 */
StructureNode.prototype.clearSelf = function () {
	this.setActivityId(0);
	this.m_previousState = null;
	this.m_state = null;
	this.m_numberDocumented = 0;
};
/**
 * StructureHtml
 * A very simple class which just encapsulates an html string. This is necessary as structured documentation html
 * is recursively generated. A string is pass-by-value, thus it is impossible to recursively generate a string using
 * a string object. This encapsulation allows for said recursive html generation.
 * @constructor
 */
function StructureHtml() {
	this.m_html = "";
}

/**
 * Returns the html package.
 * @returns {string} the html string
 */
StructureHtml.prototype.getHtml = function () {
	return this.m_html;
};

/**
 * Appends the provided html string to the current html member variable.
 * @param {string} html - An html string to be appended.
 * @returns {StructureHtml} self, for chaining
 */
StructureHtml.prototype.append = function (html) {
	this.m_html += html;
	return this;
};
/**
 * StructureOrganizer
 * This class represents a structured documentation SECTION node. This class is largely responsible for providing
 * the interface between the user and the underlying object structure. This class should eventually be refactored
 * into something called StructureSection, serving only as a data object. The rendering, navigation, and event
 * attachment should then be moved into a true StructureOrganizer object.
 * @constructor
 */
function StructureOrganizer() {
	this.m_lookup = null;
	this.m_navigator = null;
	this.m_referenceSectionId = null;
	this.m_type = "SECTION";

	this.m_templateIds = {};
	this.m_templateRelations = null;
	this.m_rootElement = null;
	this.m_contentElement = null;
	this.m_navigatorElement = null;
	this.m_resizeFunction = null;
	this.m_dirtyNodeList = null;
	this.m_onDirtyChangeCallback = null;
	this.m_previousHighlightedNode = null;
	this.m_rendered = false;
	this.m_isPriorityEnabled = true;
	
	//Multi-section variables
	this.m_isMultiSection = false;
	this.m_activeSection = null;
}
StructureOrganizer.prototype = new StructureNode();
StructureOrganizer.prototype.constructor = StructureNode;

/**
 * Sets whether or not the section has been rendered.
 * @param {boolean} rendered - A boolean indicating whether the section has been rendered or not.
 * @returns {StructureOrganizer} Returns self to allow chainin.
 */
StructureOrganizer.prototype.setIsRendered = function(rendered) {
	if(typeof rendered !== "boolean") {
		throw new Error("StructureOrganizer.prototype.setIsRendered expects a boolean.");
	}
	this.m_rendered = rendered;
	return this;
};

/**
 * Retrieves whether or not the section has been rendered.
 * @returns {boolean} True if the section has been rendered, otherwise false.
 */
StructureOrganizer.prototype.isRendered = function() {
	return this.m_rendered;
};

/**
 * Sets the template relations for the section.
 * @param {Array<Object>} templateRelations - The template relations for the section.
 */
StructureOrganizer.prototype.setTemplateRelations = function(templateRelations) {
	this.m_templateRelations = templateRelations;
	return this;
};

/**
 * Retrieves the list of template relations for the section.
 * @returns {Array<Object>} The template relations for the section.
 */
StructureOrganizer.prototype.getTemplateRelations = function() {
	return this.m_templateRelations;
};


/**
 * Sets the active section for the parent
 * @param {StructureOrganizer} activeSection - Sets the active section.
 * @returns {StructureOrganizer} The active section.
 */
StructureOrganizer.prototype.setActiveSection = function(activeSection) {
	if(!StructureOrganizer.prototype.isPrototypeOf(activeSection)) {
		throw new Error("StructureOrganizer.prototype.setActiveSection expects a jQuery element.");
	}
	this.m_activeSection = activeSection;
	return this;
};

/**
 * Retrieves the active section.
 * @returns {StructureOrganizer} Retrieves the active section.
 */
StructureOrganizer.prototype.getActiveSection = function() {
	return this.m_activeSection;
};

/**
 * Retrieves whether or not the section has subsections (multi section).
 * @returns {boolean} True if this section is multi section (has subsection children).
 */
StructureOrganizer.prototype.isMultiSection = function() {
	return this.m_isMultiSection;
};

/**
 * Sets whether the organizer is considered multi-section or not.
 * @param {boolean} multiSection - An indicator specifying whether an organizer is considered multi-section or not.
 * @returns {StructureOrganizer} Returns self to allow chaining.
 */
StructureOrganizer.prototype.setIsMultiSection = function(multiSection) {
	if(typeof multiSection !== "boolean") {
		throw new Error("StructureOrganizer.prototype.setIsMultiSection expects a boolean.");
	}
	this.m_isMultiSection = multiSection;
	return this;
};

/**
 * Returns whether AMI prioritization is enabled
 * @return {Boolean} Returns true if AMI priotization is enabled for child nodes
 */
StructureOrganizer.prototype.isPriorityEnabled = function(){
	return this.m_isPriorityEnabled;
};

/**
 * Sets whether the AMI prioritization is enabled
 * @param {Boolean} priorityEnabled True if AMI priotiziation (Show More) is on, False otherwise
 */
StructureOrganizer.prototype.setIsPriorityEnabled = function(priorityEnabled){
	if(typeof priorityEnabled !== "boolean") {
		throw new Error("StructureOrganizer.prototype.setIsPriorityEnabled expects a boolean.");
	}
	this.m_isPriorityEnabled = priorityEnabled;
};

/**
 * Sets the function that is called when the dirty state changes at the organizer level.
 * @param {function} onDirtyChangeCallback - The function to be called when the dirty state changes at
 * the organizer level.
 */
StructureOrganizer.prototype.setOnDirtyChangeCallback = function (onDirtyChangeCallback) {
	if (typeof onDirtyChangeCallback !== "function") {
		throw new Error("Attempted to call StructureOrganizer.prototype.setOnDirtyChangeCallback with invalid parameter.");
	}
	this.m_onDirtyChangeCallback = onDirtyChangeCallback;
	return this;
};

/**
 * Overrides the base notifyDirty method from the StructureNode class. The organizer keeps track of a list of
 * dirty nodes via a hashmap.
 * @param {StructureNode} node - The structure node that has sent the notification about it's dirty state.
 */
StructureOrganizer.prototype.notifyDirty = function (node) {
	var parent = this.getParent();
	//A section can potentially have a parent section...
	if(parent) {
		parent.notifyDirty(node);
	}
	//If this is the root element, handle the dirty node list
	if(!parent) {
		if (node.isDirty()) {
			this.addNodeToDirtyList(node);
		}
		else {
			this.removeNodeFromDirtyList(node);
		}
		this.updateDirty();
	}
};

/**
 * Overrides the base resetDirty method. This will go through the stored dirty nodes and call their resetDirty method.
 * This will also clear out the mapping of dirty nodes.
 */
StructureOrganizer.prototype.resetDirty = function () {
	StructureNode.prototype.resetDirty.call(this);
	var dirtyNodeList = this.getDirtyNodeList();
	for (var key in dirtyNodeList) {
		if (dirtyNodeList.hasOwnProperty(key)) {
			this.m_lookup[key].resetDirty();
		}
	}
	this.m_dirtyNodeList = {};
};

/**
 * Returns the dirty node list which is a mapping of node id to true/false values. The advantage of this
 * over a flat array is that when a node updates its dirty state, the cost to update this list is
 * essentially nothing.
 * @returns {Map<string,boolean>} a map/object of node id and their dirty state as boolean
 */
StructureOrganizer.prototype.getDirtyNodeList = function () {
	if (!this.m_dirtyNodeList) {
		this.m_dirtyNodeList = {};
	}
	return this.m_dirtyNodeList;
};

/**
 * Removes a node from the dirty list by updating its true/false value in the map.
 * @param {StructureNode} node - The node to be removed from the dirty list.
 */
StructureOrganizer.prototype.removeNodeFromDirtyList = function (node) {
	this.getDirtyNodeList()[node.getId()] = false;
};

/**
 * Adds a node to the dirty list by updating its true/false value in the map to true.
 * @param {StructureNode} node - The node to be added to the dirty list.
 */
StructureOrganizer.prototype.addNodeToDirtyList = function (node) {
	this.getDirtyNodeList()[node.getId()] = true;
};

/**
 * Returns the root element of the structure organizer and caches it.
 * @returns {object} jQuery object of the organizer root element
 */
StructureOrganizer.prototype.getRootElement = function () {
	if (!this.m_rootElement || !this.m_rootElement.length) {
		if(this.m_isMultiSection) {
			this.m_rootElement = $("#" + this.getNamespace() + "\\:parentOrganizer\\:ROOT\\:" + this.getId());
		} else {
			this.m_rootElement = $("#" + this.getNamespace() + "\\:organizer\\:ROOT\\:" + this.getId());
		}
	}
	return this.m_rootElement;
};

/**
 * Returns the custom resize function to be called when the organizer is resized. This should be provided by
 * the consumer as there is no guarantee where this artifact will exist.
 * @returns {function} resize function
 */
StructureOrganizer.prototype.getResizeFunction = function () {
	return this.m_resizeFunction;
};

/**
 * Sets the custom resize function to be called when the organizer is resized. This should be provided by the
 * consumer as there is not guarantee where this artifact will exist.
 * @param {function} resizeFunction - The custom resize function.
 */
StructureOrganizer.prototype.setResizeFunction = function (resizeFunction) {
	if (typeof resizeFunction !== "function") {
		throw new Error("Called setResizeFunction on StructureOrganizer with invalid parameter resizeFunction");
	}
	this.m_resizeFunction = resizeFunction;
	return this;
};

/**
 * Returns the structure navigator element and caches it.
 * @returns {object} jQuery object of the navigator html element
 */
StructureOrganizer.prototype.getNavigatorElement = function () {
	if (!this.m_navigatorElement) {
		this.m_navigatorElement = $("#" + this.getNamespace() + "\\:navigatorPanel\\:" + this.getId());
	}
	return this.m_navigatorElement;
};

/**
 * Navigates to the particular element in the structure view
 * @param navigationData - JSON data which contains the element details to navigate to
 */
StructureOrganizer.prototype.navigateToNode = function(navigationData) {
	var desiredString = "";
	var jsonData = JSON.parse(navigationData);
	//Build a navigation string that uniquely identifies the node we are searching for.
	for (var i = 0; i < jsonData.length; i++) {
		var value = jsonData[i];
		if (value.label) {
			desiredString = desiredString + "label:" + value.label;
		} else if (value.ocid) {
			desiredString = desiredString + ", ocid:" + value.ocid;
		}
	}
	//Using the identification string, find the corresponding structure node in the tree
	var returnNode = this.findNode(this, this.m_ocid, desiredString);
	this.goToNode(returnNode, true, true);
};

/**
 * Updates the scroll position to navigate to the given node on the page.  No navigation is performed if already visible.
 * @param destinationNode {StructureNode} The node to navigate to 
 * @param highlightNode {Boolean} True iff the node to navigate to should be highlighted
 * @param alwaysNavigate {Boolean} True iff the scroll postion should always be updated to navigate to the selected node
 */
StructureOrganizer.prototype.goToNode = function(destinationNode, highlightNode, alwaysNavigate){
	var sectionNode = null;
	var contentOffsetTop;
	var nodeOffsetTop;
	var nodeOffsetBottom;
	var contentHeight;
	var $contentElement;
	var $nodeRootElement;
	//If the desired node could not be found in the structure tree, log an error and exit.
	if(!destinationNode) {
		logger.logWarning("StructureOrganizer.prototype.navigateToNode: unable to find the specified node");
		return;
	}

	//Find the section node that is the parent to the provided node
	sectionNode = destinationNode.getParentSectionNode();

	//If a section node was not found as an ancestor to the node we are navigating to.
	if(!sectionNode || !StructureOrganizer.prototype.isPrototypeOf(sectionNode)) {
		logger.logWarning("StructureOrganizer.prototype.navigateToNode: unable to find a section node that is parent to the node that was navigated to.");
		return;
	}

	//If this is a multi-section tree, first navigate to the appropriate tab
	if(this.isMultiSection() && (this.getActiveSection() !== sectionNode)) {
		$("#" + this.getNamespace() + "\\:tab\\:" + sectionNode.getId()).click();
	}

	//If node is not currently displayed on the page, update accordingly before attempting to scroll
	if(!destinationNode.isCurrentlyDisplayed()){
		destinationNode.displayNode();
	}
	
	//The body element of the active section
	$contentElement = sectionNode.getContentElement();
	//The first rendered element out of the node and its ancestors
	$nodeRootElement = this.findRenderedRootHighlightElement(destinationNode);
	//If an element was successfully found, navigate the content body (via scroll) to the node and highlight it.
	if($nodeRootElement && $nodeRootElement.length) {
		//Updating highlighting if turned on 
		if(highlightNode){
			$nodeRootElement.addClass('highlight-navigation');
			this.m_previousHighlightedNode = $nodeRootElement;
		}

		contentOffsetTop = $contentElement.offset().top;
		nodeOffsetTop = $nodeRootElement.offset().top;
		nodeOffsetBottom = nodeOffsetTop + $nodeRootElement.height();
		contentHeight = $contentElement.height();
		//Only update scroll positioning if the node is not in view
		if(alwaysNavigate || !((nodeOffsetBottom - contentOffsetTop > 0) && (nodeOffsetBottom - contentOffsetTop <= contentHeight))){
			$contentElement.scrollTop((nodeOffsetTop - contentOffsetTop + $contentElement.scrollTop()) - ((contentHeight / 2) - $nodeRootElement.height() / 2));
		}
	}
};

/**
 * Function to find the node from Organizer tree which matches the navigation data
 * @param currentNode - current node - intially the organizer
 * @param currentString - contains the formation of ocids and label of the node
 * @param desiredString - which contains the formation of ocids and labels of the node navigates to
 */
StructureOrganizer.prototype.findNode = function(currentNode, currentString, desiredString) {
	if (desiredString === currentString) {
		return currentNode;
	} else {
		for (var i = 0; i < currentNode.getChildren().length; i++) {
			var childNode = currentNode.m_children[i];
			var node;
			//If the Node is not in its correct position in the cern-structure plugin tree, check children
			if(!childNode.inNavigationStructureTree()){
				node = this.findNode(childNode, currentString, desiredString);
			}
			else {
				var labelText = currentString + "label:" + childNode.m_title;
				var ocidText = childNode.m_ocid ? currentString + ", ocid:" + childNode.m_ocid : currentString;
				node = this.findNode(childNode, childNode.m_type === "groupbys" || childNode.m_type === "subgroupbys" || childNode.m_type === "subsections" ? labelText : ocidText, desiredString);
			}
			if (node) {
				return node;
			}
		}
		return null;
	}
};

/**
* returns the rendered root highlight element
* @returns(rootElement)- rendered Root Element
*/
StructureOrganizer.prototype.findRenderedRootHighlightElement = function(returnedNode) {
	if (returnedNode.getShouldRender()) {
		return returnedNode.getHighlightElement();
	}
	var rootElement = this.findRenderedRootHighlightElement(returnedNode.getParent());
	if (rootElement) {
		return rootElement;
	} else {
		return null;
	}
};

/**
 * Function to clear the highliter for the previous selected elements on navigation to structure view
 */
StructureOrganizer.prototype.clearHighlighter = function () {
	var node = this.m_previousHighlightedNode;
	if(node) {
		node.removeClass('highlight-navigation');
	}	
};

/**
 * Wraps the resize functionality of the structure organizer. It checks to see if the
 * consumer has provided a custom resize function. If so, call that function and pass the
 * necessary elements.
 */
StructureOrganizer.prototype.resize = function () {
	if (this.m_resizeFunction) {
		this.m_resizeFunction({
			"rootElement": this.getRootElement(),
			"navigatorElement": this.getNavigatorElement(),
			"contentElement": this.getContentElement()
		});
	}
};

/**
 * Returns the content element and caches it.
 * @returns {object} jQuery object of the content html element
 */
StructureOrganizer.prototype.getContentElement = function () {
	if (!this.m_contentElement) {
		this.m_contentElement = $("#" + this.getNamespace() + "\\:organizer\\:CONTENT\\:" + this.getId());
	}
	return this.m_contentElement;
};

/**
 * Returns the navigator object associated to the StructureOrganizer.
 * @returns {Navigator} the navigator object/model that represents the navigator pane
 */
StructureOrganizer.prototype.getNavigator = function () {
	return this.m_navigator;
};

/**
 * Sets the navigator object associated to the StructureOrganizer.
 * @param {Navigator} navigator - The navigator associated to the StructureOrganizer.
 */
StructureOrganizer.prototype.setNavigator = function (navigator) {
	if (!Navigator.prototype.isPrototypeOf(navigator)) {
		throw new Error("Attempted to call StructureOrganizer.prototype.setNavigator with invalid parameter.");
	}
	this.m_navigator = navigator;
	return this;
};

/**
 * This method performs the check to see if the StructureOrganizer is in a dirty state. The StructureOrganizer
 * is considered dirty when at least one child, or term, is dirty.
 * @returns {boolean} true, if the organizer is dirty
 */
StructureOrganizer.prototype.checkIsDirty = function () {
	var dirtyNodeList = this.getDirtyNodeList();
	for (var key in dirtyNodeList) {
		if (dirtyNodeList.hasOwnProperty(key)) {
			if (dirtyNodeList[key]) {
				return true;
			}
		}
	}
	return false;
};

/**
 * Overrides the base updateDirty method. If the dirty state of the organizer has changed, there is a callback
 * provided, and the organizer has at least 1 documented child, the m_onDirtyChangeCallback function is called.
 */
StructureOrganizer.prototype.updateDirty = function () {
	var wasDirty = this.m_dirty;
	this.m_dirty = this.checkIsDirty();
	if (wasDirty !== this.m_dirty && this.m_onDirtyChangeCallback) {
		this.m_onDirtyChangeCallback(this.m_dirty);
	}
	// clears the previous highlighted node when a change happen to the structure
	if(this.m_previousHighlightedNode) {
		this.clearHighlighter();
	}
};

/**
 * Returns a list of template ids associated with the StructureOrganizer.
 * @returns {List<string>} a list of ids of the templates associated with the organizer
 */
StructureOrganizer.prototype.getTemplateIds = function () {
	return this.m_templateIds;
};

/**
 * Sets the list of template ids associated with the StructureOrganizer.
 * @param {List<string>} templateIds - The list of template ids associated with the StructureOrganizer.
 */
StructureOrganizer.prototype.setTemplateIds = function (templateIds) {
	if (!Array.prototype.isPrototypeOf(templateIds)) {
		throw new Error("Attempted to call StructureOrganizer.prototype.setTemplateIds with invalid parameter");
	}
	this.m_templateIds = templateIds;
	return this;
};

/**
 * Returns the reference section id associated with the StructureOrganizer.
 * @returns {number} reference section id
 */
StructureOrganizer.prototype.getReferenceSectionId = function () {
	return this.m_referenceSectionId;
};

/**
 * Sets the reference section id associated with the StructureOrganizer.
 * @param {number} referenceId - The reference section id associated with the StructureOrganizer.
 */
StructureOrganizer.prototype.setReferenceSectionId = function (referenceId) {
	if (typeof referenceId !== "number") {
		throw new Error("Attempted to call StructureOrganizer.prototype.setReferenceSectionId with invalid parameter");
	}
	this.m_referenceSectionId = referenceId;
	return this;
};

/**
 * Helper method to parse a structure element id and obtain the node id.
 * @param {string} id - The DOM element id of the StructureNode to be parsed.
 * @returns {string} the node id
 */
StructureOrganizer.prototype.parseIdForLookup = function (id) {
	return id.split(":")[3];
};

/**
 * Adds a StructureNode (typically a StructureTerm) to a lookup hashmap.
 * @param {StructureNode} term - The StructureNode to be added to the lookup.
 */
StructureOrganizer.prototype.addTermToLookup = function (term) {
	this.getLookup()[term.getId()] = term;
};

/**
 * Returns the StructureNode lookup hashmap. This is a hashmap that maps the StructureNode id to the actual
 * StructureNode object.
 * @returns {Map<string, StructureNode>} a map of the node id to the node object
 */
StructureOrganizer.prototype.getLookup = function () {
	if (!this.m_lookup) {
		this.m_lookup = {};
	}
	return this.m_lookup;
};

/**
 * Overrides the base render method. This will render the StructureOrganizer object as an html string and return
 * the html.
 * @returns {string} the organizer rendered as html string
 */
StructureOrganizer.prototype.render = function (structureHtml) {
	var children = this.getChildren();
	var childrenCount = children.length;
	var namespace = this.m_namespace;
	var child = null;
	var childId = "";
	var tabDisplay = "";
	var id = this.getId();
	//If this is a multi-section node, the child sections (subsections) must be rendered into tabs.
	if(this.m_isMultiSection) {
		structureHtml.append("<div id='" + namespace + ":parentOrganizer:ROOT:" + this.getId() + "' class='structure-organizer-parent structure-multi-section'>");
		structureHtml.append("<div id='" + namespace + "StructureTabParent' class='structure-tab-parent'>");
		structureHtml.append("<div id='" + namespace + "StructureTabBlock' class='structure-tab-block'>");
		structureHtml.append("<div id='" + namespace + "StructureTabGroupWrapper' class='structure-tab-wrapper'>");
		//Tabs for each sub-section
		structureHtml.append("<ul id='" + namespace + "StructureTabGroup' class='structure-tab-group'>");
		for(var i = 0; i < childrenCount; i++) {
			child = children[i];
			childId = child.getId();
			structureHtml.append(
				"<li class='structure-tab'>" +
					"<span id='" + namespace + ":tab:" + childId + "' data-lookup='"+childId+"' class='structure-tab-display" + ((i === 0) ? " structure-tab-active" : "") + "' title='" + child.getTitle().replace(":", "") + "'>" + child.getTitle().replace(":", "") + "</span>" +
				"</li>"
			);
		}
		structureHtml.append("</ul></div><li id='" + namespace + "StructureTabMenuButton' class='structure-tab structure-add-tab'><span>&nbsp;</span></li></div><div class='structure-tab-bottom'></div></div>");
		structureHtml.append("<div id='" + namespace + "StructureTabContents' class='structure-tab-contents'>");
		//Loop through the sub-sections and create a tab container for each of them. Only the first is displayed.
		for(var i = 0; i < childrenCount; i++) {
			//Only show the first tab by default.
			if(i > 0) {
				tabDisplay = "style='display:none;'";
			}
			structureHtml.append("<div id='" + namespace + ":tabContent:" + children[i].getId() + "' class='structure-tab-content' "+tabDisplay+">");
			if(i === 0) {
				children[i].render(structureHtml, true);
				children[i].setIsRendered(true);
			}
			structureHtml.append("</div>");
		}
		structureHtml.append("</div>");
		structureHtml.append("</div>");
	} else {
		structureHtml.append("<div id='" + namespace + ":organizer:ROOT:" + id + "' class='structure-organizer' data-lookup='" + id + "'>" +
			"<div id='" + namespace + ":navigatorPanel:" + id + "' class='structure-navigator-panel'>" +
			"<div class='structure-navigator-label'>" + i18n.discernabu.mpage_structured_documentation.NAVIGATION + "</div>" +
			this.getNavigator().render() + "</div><div id='" + namespace + ":organizer:CONTENT:" + id + "' class='structure-body structure-section-body' data-lookup='" + id + "'>"
		);
		//Force the organizer to render all of the children
		for (var i = 0; i < childrenCount; i++) {
			children[i].render(structureHtml, true);
		}
		//Close off any remaining elements
		structureHtml.append("<div id='" + namespace + ":structureHeightAdjust:" + id + "' class='structure-height-adjust'></div></div></div>");
	}
	return structureHtml.getHtml();
};

/**
 * This function renders the StructureOrganizer as an HTML string.
 * @returns {string} The StructureOrganizer rendered as an HTML string.
 */
StructureOrganizer.prototype.renderHtml = function() {
	var html = new StructureHtml();
	this.render(html);
	return html.getHtml();
};

/**
 * This finalize method will attach the event handlers. This must be called after render.
 */
StructureOrganizer.prototype.finalize = function () {
	var now = new Date().getTime();
	var last = new Date().getTime();
	var threshold = 150; //(milliseconds)
	var self = this;
	var scrollTimeout = null;
	var groupInView = null;

	/**
	 * Helper function which attempts to find the group in view and activate it, if found.
	 */
	function attemptGroupActivation() {
		groupInView = self.findGroupInView();
		if (groupInView) {
			self.updateActiveGroup(groupInView);
		}
	}
	//If the section has subsections, finalize each of them separately
	if(this.m_isMultiSection) {
		var children = this.getChildren();
		var childrenCount = children.length;
		for(var i = 0; i < childrenCount; i++) {
			if(children[i].isRendered()) {
				children[i].finalize();
			}
		}
	} else {
		$("#" + this.getNamespace() + "\\:organizer\\:CONTENT\\:" + this.getId()).on("scroll", function () {
			now = new Date().getTime();
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
			}
			//Use a timeout to ensure that after scrolling has stopped, we perform at least one more update.
			scrollTimeout = setTimeout(function () {
				last = now;
				attemptGroupActivation();
			}, 200);
			//If we have hit our threshold, then process the scroll event. This throttles the event to prevent rapid
			//DOM querying.
			if ((now - last) >= threshold) {
				last = now;
				attemptGroupActivation();
			}
		});
		this.getNavigator().finalize();
		this.adjustContentHeight();
		//If the organizer has children, activate the first child (group).
		if (this.getChildren().length) {
			this.updateActiveGroup(this.getChildren()[0]);
		}
		//Perform any additional post-processing necessary
		this.performNodePostProcessing();
	}
};

/**
 * Perfoms post-processing on all organizer child nodes after node finalized
 * @return {undefined}
 */
StructureOrganizer.prototype.performNodePostProcessing = function () {
	var postProcess = function(node){
		if(node){
			node.postProcessing();
		}
		//Recursively process children
		var childNodes = node.getChildren();
		var childCnt = childNodes.length;
		for(var i = 0; i < childCnt; i++){
			postProcess(childNodes[i]);
		}
	}
	postProcess(this);
};

/**
 * This method will adjust the height of the content within the scrollable area to ensure that the last
 * group can scroll up to its header.
 */
StructureOrganizer.prototype.adjustContentHeight = function () {
	var groups = this.getChildren();
	if (!groups.length) {
		return;
	}
	var $contentElement = this.getContentElement();
	if(!$contentElement || !$contentElement.length) {
		return;
	}
	var rawContentElement = $contentElement[0];
	var contentHeight = rawContentElement.offsetHeight;
	var $heightAdjustElement = $("#" + this.getNamespace() + "\\:structureHeightAdjust\\:" + this.getId());
	var lastGroup = groups[groups.length - 1];
	var lastGroupHeight = lastGroup.getRootElement().height();
	var miscPadding = 12;
	$heightAdjustElement.height(Math.max(0, (contentHeight - lastGroupHeight) - miscPadding));
};

/**
 * This method will update the currently active group. It calls on the Navigator object to ensure the
 * navigation item corresponding to the group is highlighted.
 * @param {StructureGroup} group - The currently active group.
 */
StructureOrganizer.prototype.updateActiveGroup = function (group) {
	this.m_navigator.updateActiveNavigation(this.getNamespace() + ":structureNavigation:" + group.getId());
};

/**
 * This method will iterate over the groups (the children of the organizer) to determine which group is in view.
 * The logic assumes a viewport that is broken into 2 zones, an upper and lower zone. If the top of the group lies
 * within the upper zone, it is assumed to be in view. If the top of the group lies within the bottom zone, it is
 * then assumed that the group above it is in view. Finally, if the group encompasses the entire viewport (both the
 * upper and lower zones) it is also assumed to be in view.
 * @returns {StructureGroup} If a group is found to be in view, that group is returned. If no group is found,
 * null is returned.
 */
StructureOrganizer.prototype.findGroupInView = function () {
	var group = null;
	var rootGroupElement = null;
	var rootGroupTop = null;
	var groups = this.getChildren();
	var groupCount = groups.length;
	var $contentElement = this.getContentElement();
	var rawContentElement = $contentElement[0];
	var contentHeight = rawContentElement.offsetHeight;
	var contentTop = $contentElement.position().top;
	var totalContentHeight = rawContentElement.scrollHeight;
	var scrollPosition = rawContentElement.scrollTop;
	var scrollPercentage = scrollPosition / totalContentHeight;
	var groupInView = null;

	/**
	 * Helper function to check if groupTop lies between zoneTop and zoneBottom
	 * @param {Number} zoneTop - The top y position of the zone.
	 * @param {Number} zoneBottom - The bottom y position of the zone.
	 * @param {Number} groupTop - The y position of the top of the group.
	 * @returns {boolean} True if the groupTop lies between zoneTop and zoneBottom, otherwise false.
	 */
	function isWithinZone(zoneTop, zoneBottom, groupTop) {
		return groupTop >= zoneTop && groupTop <= zoneBottom;
	}

	/**
	 * Helper function to determine if a group takes up the entire zone.
	 * @param {Number} zoneTop - The top y position of the zone.
	 * @param {Number} zoneBottom - The bottom y position of the zone.
	 * @param {Number} groupTop - The top y position of the group.
	 * @param {Number} groupBottom - The bottom y position of the group.
	 * @returns {boolean} True if the group takes up the entire viewable area.
	 */
	function isCompletelyInView(zoneTop, zoneBottom, groupTop, groupBottom) {
		return groupTop <= zoneTop && groupBottom >= (zoneBottom - 12);
	}

	/**
	 * Helper function which performs the necessary boundary checks to see if a group is in view.
	 * @param {Number} index - The index in the list of groups at which we are checking.
	 * @returns {StructureGroup|false} - If the group at the specified index is in view, returns that group. Otherwise
	 * false is returned.
	 */
	function isGroupInView(index) {
		group = groups[index];
		rootGroupElement = group.getRootElement();
		rootGroupTop = rootGroupElement.position().top;
		if (isWithinZone(contentDimensions.midpoint, contentDimensions.bottom, rootGroupTop)) {
			return groups[i - 1];
		}
		if (isWithinZone(contentDimensions.top, contentDimensions.midpoint, rootGroupTop)) {
			return group;
		}
		if (isCompletelyInView(contentDimensions.top, contentDimensions.bottom, rootGroupTop, rootGroupTop + rootGroupElement.height())) {
			return group;
		}
		return null;
	}

	var contentDimensions = { top: contentTop, midpoint: (contentTop + contentHeight / 2), bottom: contentTop + contentHeight };

	for (var i = 0; i < groupCount; i++) {
		groupInView = isGroupInView(i);
		if (groupInView) {
			return groupInView;
		}
	}
	//If this is reached, no group was found (this should never occur)
	return null;
};

/**
 * Generates a JSON string representation of the activity data.
 *
 * @returns {string} a JSON string representation of the activity data that is safe and compatible with CCL.
 * Example:
 * section_act: {
 * 		"dd_section_id" : 123.0,
 * 		"dd_sref_section_id" : 456.0,
 *		"template_rltns" : [],
 		"subsections" : [],
 		"groupbys": []
 * }
 */
StructureOrganizer.prototype.convertToJSON = function () {
	var saveJSON = [];
	//Begin section json
	saveJSON.push('"section_act": {');

	var sectionJson = [];
	sectionJson.push('"dd_section_id": ' + this.getActivityId() + '.0');
	sectionJson.push('"dd_sref_section_id": ' + this.getReferenceSectionId() + '.0');

	//Add templates json
	var templateRelations = this.getTemplateRelations() || [];
	var templateRelationJSON = [];
	for (var i = 0; i < templateRelations.length; i++) {
		templateRelationJSON.push(
			'{' +
			'"dd_sref_chf_cmplnt_crit_id": ' + templateRelations[i].dd_sref_chf_cmplnt_crit_id + ".0" +
			',"dd_sref_templ_instance_ident": "' + templateRelations[i].dd_sref_templ_instance_ident + '"' +
			',"parent_entity_id": ' + templateRelations[i].parent_entity_id + ".0" +
			',"parent_entity_name": "' + templateRelations[i].parent_entity_name +
			'"}'
		);
	}
	//Push template relations JSON
	sectionJson.push('"template_rltns": [' + templateRelationJSON.join(',') + ']');

	this.addChildrenJSON(sectionJson);

	//If this is a subsection node, some additional fields must be populated. Furthermore, just short-circuit and
	//return the basic JSON. The parent section is responsible for packaging up the entire contents as the section_act
	//JSON.
	if(this.getType() === "subsections") {
		sectionJson.push('"parent_section_id": ' + this.getParent().getActivityId() + '.0');
		return '{' + sectionJson.join(',') + '}';
	}

	//Finalize and add in section json
	saveJSON.push(sectionJson.join(','));

	//End save json
	saveJSON.push('}');

	return saveJSON.join('');
};
/**
 * StructureGroup
 * This class represents the concept of a structure documentation group. It is simply a node which has child nodes.
 * @constructor
 */
function StructureGroup() {
}

StructureGroup.prototype = new StructureNode();
StructureGroup.prototype.constructor = StructureNode;

/**
 * This method retrieves the root element of the StructureGroup.
 * @returns {*|jQuery|HTMLElement}
 */
StructureGroup.prototype.getRootElement = function () {
	if (!this.m_rootElement) {
		this.m_rootElement = $("#" + this.getNamespace() + "\\:group\\:ROOT\\:" + this.getId());
	}
	return this.m_rootElement;
};

/**
 * Overrides the parent convertToJSON method.
 * @return {string} the save/activity JSON representation of the group.
 */
StructureGroup.prototype.convertToJSON = function () {
	var json = [];
	json.push('"dd_groupby_id": ' + this.getActivityId() + '.0');
	json.push('"label": "' + this.getTitle() + '"');
	json.push('"truth_state_mean": "T"');

	this.addChildrenJSON(json);

	return '{' + json.join(',') + '}';
};

/**
 * This method handles notification of a state change in a child node.
 * Updates the corresponding navigational item in the navigation pane to reflect the documented status of this StructureGroup.
 *
 * @param {StructureNode} node - The StructureNode child that is informing of a state change event.
 */
StructureGroup.prototype.notifyStateChange = function (node) {
	StructureNode.prototype.notifyStateChange.call(this, node);
	var navigationElement = $("#" + this.getNamespace() + "\\:structureNavigation\\:" + this.getId());
	if(this.getType() !== "groupbys") {
		return;
	}
	//If this is a top-level group and has children documented, add a documented class to the associated navigation
	//element, otherwise remove the documented class from the navigator element.
	(this.m_numberDocumented) && (navigationElement.addClass("navigation-documented")) || (navigationElement.removeClass("navigation-documented"));
};

/**
 * Overrides the base refresh method.
 */
StructureGroup.prototype.refresh = function () {
	if (this.getState() && this.getState().getValue()) {
		$("#" + this.getNamespace() + "\\:group\\:ROOT\\:" + this.getId()).addClass("documented");
	} else {
		$("#" + this.getNamespace() + "\\:group\\:ROOT\\:" + this.getId()).removeClass("documented");
	}
};

/**
 * Retrieve the children nodes that should be rendered on initial load
 * @return {Array<StructureNode>} Array of children nodes that should be rendered
 */
StructureGroup.prototype.getDefaultRenderChildren = function() {
	var children = this.getChildren();
	var childCnt = children.length;
	var defaultChildren = [];
	var child = null;
	// Gather child nodes that should be initially rendered
	for (var i = 0; i < childCnt; i++){
		child = children[i];
		if(child.isDefaultDisplayed()){
			defaultChildren.push(child);
		}
	}
	return defaultChildren;
};

/**
 * Handles rendering of children for StructureGroup objects. It determines the rendering strategy. Children should
 * either be rendered into columns, or simply rendered. This is to handle maximizing the use of the white-space and
 * ensure columns are created at the best level in the tree.
 * @param {StructureHtml } structureHtml - The structure html package object.
 * @param {boolean} shouldRenderColumns - If this node should render columns.
 */
StructureGroup.prototype.renderChildren = function (structureHtml, shouldRenderColumns) {
	var children = this.getDefaultRenderChildren();
	var childrenCount = children.length;
	//If columns should be created at this level in the tree, otherwise just render the children.
	if (shouldRenderColumns && childrenCount > 1) {
		var maxColumns = 3;
		var numberColumns = (childrenCount / maxColumns) >= 1 ? maxColumns : childrenCount;
		var childrenPerColumn = Math.floor(childrenCount / numberColumns);
		var remainingChildren = childrenCount % numberColumns;
		var currentIndex = 0;
		var columnWidth = (100 / numberColumns) + "%";
		//Distribute the children of the group evenly among the columns.
		for (var i = 0; i < numberColumns; i++) {
			structureHtml.append("<div class='structure-column' style='width: " + columnWidth + ";'>");          //Open column
			var numberToRender = remainingChildren ? (childrenPerColumn + 1) : childrenPerColumn;
			for (var j = 0; j < numberToRender; j++) {
				var child = children[j + currentIndex];
				//Don't create additional subcolumns for children
				child.render(structureHtml, false);
			}
			currentIndex = currentIndex + j;
			remainingChildren = Math.max(0, remainingChildren - 1);
			structureHtml.append("</div>");                                 //Close column
		}
	} else {
		for (var i = 0; i < childrenCount; i++) {
			//If only one column exists at current level, allow possibility of rendering columns for children
			children[i].render(structureHtml, shouldRenderColumns);
		}
	}
};

/**
 * Overrides the StructureNode render method. If this node is supposed to be rendered, it will render its necessary
 * html as well as the children html beneath it. Otherwise, it will bypass its own html and simply render its children.
 * @param {StructureHtml} structureHtml - The structure html packaged object.
 * @param {boolean} shouldRenderColumns - If this node should render columns.
 */
StructureGroup.prototype.render = function (structureHtml, shouldRenderColumns) {
	//If this node should render, render the header grouping, otherwise skip it
	//TODO: stop forcing groups to render when WK updates their content
	if (true || this.getShouldRender()) {
		structureHtml.append(
			"<div id='" + this.getNamespace() + ":group:ROOT:" + this.getId() + "' class='structure-group group expanded'>"+
			"<div class='structure-group-header'>" +
			"<div class='structure-group-title-wrapper'>" +
			"<span class='structure-group-title'>" + this.getTitle().replace(":", "") + "</span>" +
			"</div>" +
			"</div>" +
			"<div class='structure-group-children'>"
		);
	}
	this.renderChildren(structureHtml, shouldRenderColumns);
	// TODO: stop forcing groups to render when WK updates their content
	if (true || this.getShouldRender()) {
		structureHtml.append("</div></div>");
	}
};

/**
 *Checks whether the current Group node is expanded or not. 
 */
StructureGroup.prototype.isExpanded = function () {
	var root = this.getRootElement();
	return root.hasClass("expanded");
};

/*
 * Toggles the state of a html node between expand and collapse.
 */
StructureGroup.prototype.toggleExpand = function(){
	var root = this.getRootElement();
	var addRemoveClass = root.hasClass("expanded") ? {"add" : "collapsed", "remove" : "expanded"} : {"add" : "expanded", "remove" : "collapsed"};
    root.addClass(addRemoveClass.add).removeClass(addRemoveClass.remove);
    this.onToggleExpand();
};

/**
 * Method that gets executed when a group is expand toggled.  To be implemented by children.
 * @return {undefined}
 */
StructureGroup.prototype.onToggleExpand = function() {
	return;
};

/**
 * StructureItemGroup
 * This class represents a sub-level structure documentation group. Its function is almost exactly identical to
 * that of a StructureGroup but has slightly different html markup when rendered.
 * @constructor
 */
function StructureItemGroup() {
}
StructureItemGroup.prototype = new StructureGroup();
StructureItemGroup.prototype.constructor = StructureGroup;

/**
 * Overrides the parent convertToJSON method. This is the JSON used when saving.
 * @return {string} a save/activity JSON representation
 */
StructureItemGroup.prototype.convertToJSON = function () {
	var json = [];
	json.push('"dd_item_id": ' + this.getActivityId() + '.0');
	json.push('"ocid": "' + this.getOCID() + '"');
	json.push('"truth_state_mean": "T"');

	this.addChildrenJSON(json);

	return '{' + json.join(',') + '}';
};

/**
 * returns the root element from the node.
 * @returns {m_rootElement}
 */
StructureItemGroup.prototype.getRootElement = function() {
   if(!this.m_rootElement || !this.m_rootElement.length) {
      this.m_rootElement = $("#" + this.getNamespace() + "\\:group\\:ROOT\\:" + this.getId());
   }
   return this.m_rootElement;
};

/**
 * Overrides the StructureNode render method. If this node is supposed to be rendered, it will render its necessary
 * html as well as the children html beneath it. Otherwise, it will bypass its own html and simply render its children.
 * @param {StructureHtml} structureHtml - The structure html packaged object.
 * @param {boolean} shouldRenderColumns - If this node should render columns.
 */
StructureItemGroup.prototype.render = function (structureHtml, shouldRenderColumns) {
	if (this.getShouldRender()) {
		structureHtml.append(
				"<div id='" + this.getNamespace() + ":group:ROOT:" + this.getId() + "' class='structure-group item expanded'>" +
				"<div class='structure-group-header item'>" +
				"<span class='structure-component-toggle'></span>" +
				"<span class='structure-group-title'>" + this.getTitle().replace(":", "") + "</span>" +
				"</div>" +
				"<div class='structure-group-children'>"
		);
	}
	this.renderChildren(structureHtml, shouldRenderColumns);
	if (this.getShouldRender()) {
		structureHtml.append("</div></div>");
	}
};

/**
 * StructureSubGroup
 * This class represents a sub-level structure documentation group. Its function is almost exactly identical to
 * that of a StructureGroup but has slightly different html markup when rendered.
 * @constructor
 */
function StructureSubGroup() {
}
StructureSubGroup.prototype = new StructureGroup();
StructureSubGroup.prototype.constructor = StructureGroup;
/**
 * Overrides the parent convertToJSON method. This is the JSON used when saving.
 * @returns {string} a JSON representation of the activity data
 */
StructureSubGroup.prototype.convertToJSON = function () {
	var json = [];
	json.push('"dd_sgroupby_id": ' + this.getActivityId() + '.0');
	json.push('"label": "' + this.getTitle() + '"');
	json.push('"truth_state_mean": "T"');

	this.addChildrenJSON(json);

	return '{' + json.join(',') + '}';
};

/**
 * returns the root element from the node.
 * @returns {m_rootElement}
 */
StructureSubGroup.prototype.getRootElement = function() {
   if(!this.m_rootElement) {
      this.m_rootElement = $("#" + this.getNamespace() + "\\:subgroup\\:ROOT\\:" + this.getId());
   }
   return this.m_rootElement;
};

/**
 * Overrides the StructureNode render method. If this node is supposed to be rendered, it will render its necessary
 * html as well as the children html beneath it. Otherwise, it will bypass its own html and simply render its children.
 * @param {StructureHtml} structureHtml - The structure html packaged object.
 * @param {boolean} shouldRenderColumns - If this node should render columns.
 */
StructureSubGroup.prototype.render = function (structureHtml, shouldRenderColumns) {
	if (this.getShouldRender()) {
		structureHtml.append(
				"<div id='" + this.getNamespace() + ":subgroup:ROOT:" + this.getId() + "' class='structure-group sub-group expanded'>" +
				"<div class='structure-group-header'>" +
				"<span class='structure-group-title sub-group'>" + this.getTitle().replace(":", "") + "</span>" +
				"</div>" +
				"<div class='structure-group-children'>"
		);
	}
	this.renderChildren(structureHtml, shouldRenderColumns);
	if (this.getShouldRender()) {
		structureHtml.append("</div></div>");
	}
};
/**
 * A model that represents a group of StructureTerms.
 */
function StructureTermGroup() {
	this.m_activeTerm = null;
	this.m_previousActiveTerm = null;
	this.m_isShowMore = false; // Default to Show Less
	return this;
}
StructureTermGroup.prototype = new StructureGroup();
StructureTermGroup.prototype.constructor = StructureGroup;

/**
 * Gets the active term.
 * @returns {StructureTerm} the active term
 */
StructureTermGroup.prototype.getActiveTerm = function () {
	return this.m_activeTerm;
};
/**
 * Sets the active term.
 * @param {StructureTerm} activeTerm - the active term
 */
StructureTermGroup.prototype.setActiveTerm = function (activeTerm) {
	if (!StructureTerm.prototype.isPrototypeOf(activeTerm)) {
		throw new Error("Called setActiveTerm on StructureTermGroup with invalid activeTerm parameter.");
	}
	this.m_activeTerm = activeTerm;
	return this;
};

/**
 * Gets the previous active term.
 * @returns {StructureTerm} the active term
 */
StructureTermGroup.prototype.getPreviousActiveTerm = function () {
	return this.m_previousActiveTerm;
};
/**
 * Sets the previous active term.
 * @param {StructureTerm} activeTerm - the active term
 */
StructureTermGroup.prototype.setPreviousActiveTerm = function (activeTerm) {
	if (!StructureTerm.prototype.isPrototypeOf(activeTerm)) {
		throw new Error("Called setPreviousActiveTerm on StructureTermGroup with invalid activeTerm parameter.");
	}
	this.m_previousActiveTerm = activeTerm;
	return this;
};


/**
 * Returns a JSON string representation of the StructureTermGroup used for saving purposes
 * @returns {string} JSON string representation of the activity data
 */
StructureTermGroup.prototype.convertToJSON = function () {
	var json = [];
	json.push('"dd_attribute_id": ' + this.getActivityId() + '.0');
	json.push('"ocid": "' + this.getOCID() + '"');
	json.push('"truth_state_mean": "T"');

	this.addDescendentJSON(json);

	return '{' + json.join(',') + '}';
};

/**
 * Returns a Boolean indicating whether the term group is showing all terms
 * @return {Boolean} True iff the term group should be showing all terms
 */
StructureTermGroup.prototype.isShowMore = function() {
	return this.m_isShowMore;
};

/**
 * Sets the indicator for whether a term group should be displaying all terms
 * @param {Boolean} showMore True if all terms should be displayed, false if only prioritized terms should show
 */
StructureTermGroup.prototype.setIsShowMore = function(showMore) {
	if (typeof showMore !== "boolean") {
		throw new Error("Called setIsShowMore on StructureNode with invalid showMore paramater");
	}
	this.m_isShowMore = showMore;
};

/**
 * Returns a Boolean indicating whether or not this term group has previously shown all terms.
 * Utilized to avoid re-rendering if the unprioritized terms have previously been rendered
 * @return {Boolean} True if all terms have been previously displayed (Show More has been clicked)
 */
StructureTermGroup.prototype.hasShownMore = function(){
	return this.m_hasShownMore;
};

/**
 * Sets the indicator for whether a term group has previously displayed all terms
 * @param {Boolean} hasShownMore True if all terms have been displayed
 */
StructureTermGroup.prototype.setHasShownMore = function(hasShownMore){
	if (typeof hasShownMore !== "boolean") {
		throw new Error("Called setHasShownMore on StructureNode with invalid hasShownMore paramater");
	}
	this.m_hasShownMore = hasShownMore;
};

/**
 * Retrieves an array of StructureTerms with the given priority
 * @param  {Number} priority - The priority of terms to retireve
 * @return {Array<StructureTerm>} Array of StructureTerms with the given priority
 */
StructureTermGroup.prototype.getChildrenWithPriority = function(priority){
	var children = this.getChildren();
	var childrenWithPriority = [];
	childrenWithPriority = $.grep(children, (function(term, i){
		return term.getPriority && (term.getPriority() === priority);
	}));
	return childrenWithPriority;
};

/**
 * This method acts as a notification of a state change in a child node. Certain parent nodes need to know the
 * state of their children and perform actions accordingly. This base method simply keeps track of the number of
 * children nodes that are documented.
 * @param {StructureNode} node - The node that is informing of a state change event.
 */
StructureTermGroup.prototype.notifyStateChange = function (node) {
	StructureNode.prototype.notifyStateChange.call(this, node);
	this.handleTermActivity(node);
};

/*
 * Method to handle activity on a term group only if it has a None term as the first child and
 * if the current selected term has a valid state.
 * @param {StructureTerm} term - the term being switched to, or being selected
*/
StructureTermGroup.prototype.handleTermActivity = function (term) {	
	//Perform updates related to None-term functionality
	this.performNoneTermUpdates(term);
};

StructureTermGroup.prototype.performNoneTermUpdates = function (term) {
	var noneTerm = this.getNoneTerm();
	var freeTextTerms = null;
	var stateOfFreeText = null;
	var self = this;
	var noneTermHasValidState = null;
	// Don't perform any actions if none-term not found
	if (!noneTerm) {
		return;
	}
	noneTermHasValidState = noneTerm.getState() && noneTerm.getState().getValue();
	//If term other than none term has been documented, deactive the none term
	if (term !== noneTerm && term.getState() && term.getState().getValue() && noneTermHasValidState){
		noneTerm.deactivate();
	}
	else if (noneTermHasValidState){
		//Filter the free text object from the current term group
		//If free text object exists within the current active terms.
		//call the launchRemoveFreeTextWarning
		freeTextTerms = this.getActiveFreeTextTerm();
		if (!freeTextTerms.length) {//if free text object does not exist, just loop over all the active terms and deactivate them
			this.deactivateTerms();
		} else {
			var stateOfFreeText = freeTextTerms[0].getState().getValue();
			if (stateOfFreeText) {
				this.setPreviousActiveTerm(this.m_activeTerm);
				this.launchRemoveFreeTextWarning(function() {
					self.deactivateTerms();
				});
			}
		}	
	}
	this.m_activeTerm = term;
};

/**
 * Returns the number of document terms that are not currently being displayed due to prioritization
 * @return {Number} Number of undocumented terms that are not being displayed by default
 */
StructureTermGroup.prototype.getUnshownDocumentedCount = function() {
	var unshownChildren = this.getChildrenWithPriority(2);
	var unshownChildCnt = unshownChildren.length;
	var unshownDocumentedCount = 0;
	// Add up number of documented children for all unshown descendents
	for(var i = 0; i < unshownChildCnt; i++){
		var unshownChild = unshownChildren[i];
		//If term has children return number of documented children
		if(unshownChild.getChildren().length){
			unshownDocumentedCount += unshownChild.getNumberOfDocumentedChildren();
		}
		//Otherwise check if current term is documented
		else if(unshownChild.getState() && unshownChild.getState().getValue()){
			unshownDocumentedCount++;
		}
	}
	return unshownDocumentedCount;
};

/**
 * Updates the documented count for the term group
 * @return {undefined}
 */
StructureTermGroup.prototype.updateUnshownDocumentedCount = function() {
	var $undocumentedCount = this.getDocumentedCountContainer();
	var undocumentedCount = this.getUnshownDocumentedCount();
	// Display documented count when "Show Less" and has documented terms
	if (undocumentedCount && !this.isShowMore()){
		$undocumentedCount.html(undocumentedCount);
		$undocumentedCount.addClass("shown");
	}
	else {
		$undocumentedCount.empty();
		$undocumentedCount.removeClass("shown");
	}
};

/**
 * Returns the container for the documented count
 * @return {jQuery} jQuery element container of the documented
 */
StructureTermGroup.prototype.getDocumentedCountContainer = function() {
	if (!this.m_documentedCountContainer || !this.m_documentedCountContainer.length){
		this.m_documentedCountContainer = $("#documentedCountContainer" + this.getId());
	}
	return this.m_documentedCountContainer;
};


/**
 *Gets the currently active FreeText term in the section/term group. 
 */
StructureTermGroup.prototype.getActiveFreeTextTerm = function (term) {	
		var freeTextTerms = this.filterTerms(function(obj){
			return FreeTextStructureTerm.prototype.isPrototypeOf(obj) && obj.getState() ? obj.getState().getValue() !== null : false;
		});
		return freeTextTerms;
};

/**
 *Gets the none term from the current section/term group. 
 */
StructureTermGroup.prototype.getNoneTerm = function(term) {
	if (!this.m_noneTerm){
		this.m_noneTerm = this.filterTerms(function(obj){
			return NoneStructureTerm.prototype.isPrototypeOf(obj);
		})[0];
	}
	return this.m_noneTerm;
};
/**
 * Changes the state of all the active/documented terms in the group 
 * to undocumented by calling deactivate method on non input type terms and 
 * setting the current value of the free text term to  empty string.
 */
StructureTermGroup.prototype.deactivateTerms = function(){
	var activeTerms = this.filterTerms(function(obj) {
		return !NoneStructureTerm.prototype.isPrototypeOf(obj) && obj.getState() ? obj.getState().getValue() !== null : false;
	});
	for (var t = 0; t < activeTerms.length; t++) {
		var currentTerm = activeTerms[t];
		currentTerm.deactivate();
	}
};

/**
 * Method to filter terms based on the filter function provided. 
 */
StructureTermGroup.prototype.filterTerms = function(func) {
	if(typeof func !== "function") {
		throw new Error("Called filterTerms on the StructureTermGroup with an invalid callback function");
	}
	var terms = [];
	var childrenTerms = this.getAllDescendents([]);
	for(var i=0;i<childrenTerms.length;i++){
		if(func(childrenTerms[i])){
			terms.push(childrenTerms[i]);			
		}
	}
	return terms;
};

/**
 * Builds and launches a Modal Dialog that will act as a prompt when 
 * a active free text term is being cleared by clicking a None term. It prompts with two actions
 * 1. Remove to continue clearing the free text
 * 2. Cancel to prevent clearing of the free text and other active terms. 
 */
StructureTermGroup.prototype.launchRemoveFreeTextWarning = function(removeBtnClickFunc){
		
		if(typeof removeBtnClickFunc !== "function"){
			throw new Error("Called launchRemoveFreeTextWarning on the StructureTermGroup with an invalid callback function");
		}
		var self = this;
		var modalId = "removeFreeText" + this.getId();
		var cancelModalBtn = null;
		var removeModalBtn = null;
		var removeFreeTextModal = MP_ModalDialog.retrieveModalDialogObject(modalId);		
		if(!removeFreeTextModal){
			removeFreeTextModal = new ModalDialog(modalId);		
			removeFreeTextModal.setShowCloseIcon(false);
			removeFreeTextModal.setHeaderTitle(i18n.discernabu.mpage_structured_documentation.REMOVE_FREE_TEXT_HEADER);
			//Apply the proper margins for User informational messages
			removeFreeTextModal.setLeftMarginPercentage(35).setRightMarginPercentage(35).setTopMarginPercentage(20).setIsBodySizeFixed(false).setIsFooterAlwaysShown(true);
			//Create the modal remove button
			removeModalBtn = new ModalButton("removeModal");
			removeModalBtn.setFocusInd(true).setCloseOnClick(true);
			removeModalBtn.setOnClickFunction(removeBtnClickFunc);			
			removeModalBtn.setText(i18n.discernabu.mpage_structured_documentation.REMOVE);
			removeFreeTextModal.addFooterButton(removeModalBtn);		
			//Create the modal cancel button
			cancelModalBtn = new ModalButton("cnlModal");
			cancelModalBtn.setText(i18n.discernabu.mpage_structured_documentation.CANCEL);
			
			cancelModalBtn.setOnClickFunction(function(){
				self.cancelFreeTextBtnCallback();
			});			
			removeFreeTextModal.addFooterButton(cancelModalBtn);			
			removeFreeTextModal.setBodyDataFunction(function(modalObj){
					modalObj.setBodyHTML("<div class='structure-remove-free-text-warning'><span>"+i18n.discernabu.mpage_structured_documentation.REMOVE_FREE_TEXT_WARNING+"</span>" + "</div>");
			});			
			MP_ModalDialog.addModalDialogObject(removeFreeTextModal);
		}					
		MP_ModalDialog.showModalDialog(modalId);
};

/**
 * Handles canceling a remove free text action
 * @return {[type]} [description]
 */
StructureTermGroup.prototype.cancelFreeTextBtnCallback = function(){
	var modalId = "removeFreeText" + this.getId();
	this.getActiveTerm().jumpToState(0);
	this.setActiveTerm(this.getPreviousActiveTerm());
	MP_ModalDialog.closeModalDialog(modalId);
	MP_ModalDialog.deleteModalDialogObject(modalId);
};

/**
 * Overrides the StructureNode render method. If this node is supposed to be rendered, it will render its necessary
 * html as well as the children html beneath it. Otherwise, it will bypass its own html and simply render its children.
 * @param {StructureHtml} structureHtml - The structure html packaged object.
 * @param {boolean} shouldRenderColumns - If this node should render columns.
 */
StructureTermGroup.prototype.render = function (structureHtml, shouldRenderColumns) {
	if (this.getShouldRender()) {
		structureHtml.append(
				"<div id='" + this.getNamespace() + ":group:ROOT:" + this.getId() + "' class='structure-group item expanded'>" +
				"<div class='structure-group-header item'>" +
				"<span class='structure-group-title'>" + this.getTitle() + "</span>" +
				"</div>" +
				"<div class='structure-group-children'>"
		);
	}
	this.renderChildren(structureHtml, shouldRenderColumns);
	if (this.getShouldRender()) {
		//Handle rendering Show More link/Unprioritized terms if necessary
		structureHtml.append("</div>");
		this.renderShowMore(structureHtml);
		structureHtml.append("</div>");
	}
};

/**
 * Renders the 'Show More' link html as well as unprioritized API terms if the 
 * current term group should show more terms
 * @param  {StructureHtml} structureHtml - The structure html package object
 */
StructureTermGroup.prototype.renderShowMore = function(structureHtml){
	var docI18n = i18n.discernabu.mpage_structured_documentation;
	var organizer = this.getOrganizer();
	if (organizer.isPriorityEnabled()){
		var showMoreText = docI18n.SHOW_MORE;
		// Display link only when unprioritized terms exist
		if(this.getChildrenWithPriority(2).length){
			structureHtml.append("<div class='show-more-link-container'><a id='showMoreLink" + this.getId() + "' class='show-more-link'>" + showMoreText + "</a>" + "<div id='documentedCountContainer" + this.getId() + "' class='documented-count'></div></div>");
		}		
	}
	else{
		//All terms are shown if API prioritization is off
		this.setIsShowMore(true);
	}
};

StructureTermGroup.prototype.getUnprioritizedContentContainer = function() {
	if (!this.m_unprioritizedContent || !this.m_unprioritizedContent.length){
		this.m_unprioritizedContent = $("#unprioritizedContent" + this.getId());
	}
	return this.m_unprioritizedContent;
};

StructureTermGroup.prototype.getShowMoreLinkContainer = function() {
	if (!this.m_showMoreLinkContainer || !this.m_showMoreLinkContainer.length){
		this.m_showMoreLinkContainer = $("#showMoreLink" + this.getId());
	}
	return this.m_showMoreLinkContainer;
};
/**
 * Displays all terms in the term group independent of priority
 */
StructureTermGroup.prototype.showMore = function () {
	var docI18n = i18n.discernabu.mpage_structured_documentation;
	var $root = $(this.getRootElement());
	var $unprioritizedTerms = this.getUnprioritizedContentContainer();
	var defaultRenderedChildren = this.getDefaultRenderChildren();
	var defaultChildrenLen = defaultRenderedChildren.length;
	var lastTerm = defaultChildrenLen ? defaultRenderedChildren[defaultChildrenLen-1] : null;
	var $lastTerm =  null;
	
	if (lastTerm){
		$lastTerm = $(lastTerm.getRootElement());	
	}
	if($root.length){
		if (this.hasShownMore()){
			$unprioritizedTerms.show();
		}
		else{		
			var structureHtml = new StructureHtml();
			this.renderUnprioritizedSectionHtml(structureHtml);
			if($lastTerm && $lastTerm.length){
				$lastTerm.after(structureHtml.getHtml());
			}
			else{				
				$root.find('.structure-group-children').prepend(structureHtml.getHtml());
			}
			this.setHasShownMore(true);
		}	
		this.getShowMoreLinkContainer().text(docI18n.SHOW_LESS);
		this.setIsShowMore(true);
	}
};

/**
 * Hides unprioritized (priority 2) terms within the term group
 */
StructureTermGroup.prototype.showLess = function () {
	var docI18n = i18n.discernabu.mpage_structured_documentation;
	var $unprioritizedTerms = this.getUnprioritizedContentContainer();

	$unprioritizedTerms.hide();
	this.getShowMoreLinkContainer().text(docI18n.SHOW_MORE);
	this.setIsShowMore(false);
	var organizer = this.getOrganizer();
	//Navigate to node if out of view
	organizer.goToNode(this, false);
};

/**
 * Toggles whether all terms are shown or only prioritized terms
 */
StructureTermGroup.prototype.toggleShowMore = function () {
	if (this.isShowMore()){
		this.showLess();
	}
	else{
		this.showMore();
	}
	//Update whether or not the documented count is displayed
	this.updateUnshownDocumentedCount();
};

/**
 * Renders the section containing unprioritized (priority 2) API terms when all terms should be shown
 * @param  {StructureHtml} structureHtml - The structure html package object
 */
StructureTermGroup.prototype.renderUnprioritizedSectionHtml = function(structureHtml){
	var children = this.getChildrenWithPriority(2);
	var childrenCnt = children.length;
	var hasOtherShownClass = "";
	if (childrenCnt !== this.getChildren().length){
		hasOtherShownClass = "structured-has-shown-terms";
	}
	if(childrenCnt){
		structureHtml.append("<div id='unprioritizedContent" + this.getId() + "' class='unprioritized-terms " + hasOtherShownClass + "'>");

		for (var i = 0; i < childrenCnt; i++){
			children[i].render(structureHtml, false);
		}
		structureHtml.append("</div>");
	}
};


/**
 * A model that represents a group of terms that is single-select.
 */
function SingleStructureTermGroup() {
}
SingleStructureTermGroup.prototype = new StructureTermGroup();
SingleStructureTermGroup.prototype.constructor = StructureTermGroup;

/**
 * Handles additional process on the group when the user chooses a different term in the term group.
 * @param {StructureTerm} term - the term being switched to, or being selected
 */
SingleStructureTermGroup.prototype.handleTermActivity = function (term) {
	StructureTermGroup.prototype.handleTermActivity.call(this, term);
	var isValidState = term.getState().getValue();
	var self = this;
	var freeTextTerm = this.getActiveFreeTextTerm();
	if(isValidState) {
		if (term !== this.m_activeTerm && this.m_activeTerm) {
			if(freeTextTerm.length && freeTextTerm[0] === this.m_activeTerm) {
				this.setPreviousActiveTerm(this.m_activeTerm);		
				self.launchRemoveFreeTextWarning(function() {
					freeTextTerm[0].deactivate();
				});
			} else {
				this.m_activeTerm.deactivate();		
			}
		}
		this.m_activeTerm = term;	
	}
};

/**
 * Clears only this SingleStructureTermGroup by resetting its active term to null.
 */
SingleStructureTermGroup.prototype.clearSelf = function () {
	StructureTermGroup.prototype.clearSelf.call(this);
	this.m_activeTerm = null;
};

/**
 * A model that represents a multi-select group of terms
 */
function MultiStructureTermGroup() {
}
MultiStructureTermGroup.prototype = new StructureTermGroup();
MultiStructureTermGroup.prototype.constructor = StructureTermGroup;

/**
 * A model that represents a group of Yes/No terms
 */
function YesNoStructureTermGroup() {
}
YesNoStructureTermGroup.prototype = new StructureTermGroup();
YesNoStructureTermGroup.prototype.constructor = StructureTermGroup;

/**
 * A model that represents a table containing multiple cycle terms.
 * Inherits from SingleStructureTermGroup for allowing only a single child term to be selected at time.
 * Inherits CycleStructureterm methods for allowing 'states' and 'comments' and other AMI functionality
 */
function TableStructureTermGroup() {
	this.m_comment = "";						//Ensure no comment is associated by default
	this.m_inNavigateStructureTree = false; 	// Don't search for Table node when searching tree from cern-structured
	this.m_shouldSave = false;					// Table grouping terms are not saved.  Child terms are saved.
	SingleStructureTermGroup.call(this);
	CycleStructureTerm.call(this);
}

TableStructureTermGroup.prototype = new SingleStructureTermGroup();
TableStructureTermGroup.prototype.constructor = TableStructureTermGroup;
JSONStructureOrganizerBuilder.extendClassMethods(TableStructureTermGroup, CycleStructureTerm, ["setCaption", "getCaption", "addState", "getCurrentState", "setCurrentState", "getStates", "cycleState", "jumpToState", "deactivate", "refresh", "getComment", "setComment", "setSavedComment", "buildTextArea", "displayComment", "checkIsDirty", "getRootElement", "getSavedComment", "resetDirty", "setPriority", "getPriority", "setUIValue", "getUIValue", "displayNode", "isDefaultDisplayed", "isCurrentlyDisplayed"]);

/**
 * Overrides checkIsDirty to ensure that the TableStructureTermGroup isn't marked as dirty. Only child terms can be dirty.
 * @return {Boolean}  False as "TABLE" alone cannot be dirty
 */
TableStructureTermGroup.prototype.checkIsDirty = function () {
	return false;
};

/**
 * Returns JSON representation of TableStructureTerm.  Doesn't return JSON as the "TABLE" term is not saved (only child terms are).
 * @return {undefined}
 */
TableStructureTermGroup.prototype.convertToJSON = function() {
	return;
};

/**
 * Override default render method to render out table group.
 * Handles rendering child terms and associated comment.
 * @param  {StructureHtml} structureHtml The StructureHtml object to append "html" string to
 * @return {undefined} 
 */
TableStructureTermGroup.prototype.render = function(structureHtml) {
	var commentClass = "";
	var commentHTML = "";
	var stateClass = this.m_state ? this.m_state.getCSSClass() : "";
	// create a comment section when the term has a comment and the term is documented
	if(this.getComment()) {
		commentHTML = "<div class='structure-term-comment-wrapper'>" + this.buildTextArea() + "</div>";
		commentClass = "comment"+ " ";
	}
	structureHtml.append(
			"<div id='" + this.getNamespace() + ":term:ROOT:" + this.getId() + "' class='structure-term-item table-group-term " + commentClass + stateClass + "' title='" + this.getCaption() + "'>" +
			"<div class='structure-term-info-wrapper'>" +
			"<span class='structure-term-title'>" + this.getTitle() + "</span>" +
			"<span class='structure-comment'>&nbsp;</span>" + 
			"</div>" +
			"<div class='structure-table-group-terms'>"
	);
	this.renderChildren(structureHtml, false);
	structureHtml.append("</div>"  + commentHTML + "</div>");
};


/**
 * Handles additional process on the group when the user chooses a different term in the term group.
 * Updates styling of the table appropriately.
 * @param {StructureTerm} term - the term being switched to, or being selected
 */
TableStructureTermGroup.prototype.handleTermActivity = function (term) {
	SingleStructureTermGroup.prototype.handleTermActivity.call(this, term);
	var activeTerm = this.getActiveTerm();
	var termGroupState = activeTerm ? activeTerm.getState() : null;
	if (termGroupState){
		//Use the active child term's state if present
		this.updateState(termGroupState);		
	}
	else{
		//If no active term, use default undocumented state
		this.jumpToState(0);
	}
	this.refresh();
};


/**
 * Override notifyStateChange to notify parent group of updated child terms.
 * This is used so that the parent group can handle Single Select and None terms.
 * @param  {SturctureNode} node The StructureNode that has been updated
 * @return {undefined}
 */
TableStructureTermGroup.prototype.notifyStateChange = function(node) {
	StructureTermGroup.prototype.notifyStateChange.call(this, node);
	if (this.getParent()){
		this.getParent().notifyStateChange(node);
	}
};


/**
 * Overriding updateState as to not trigger parent notification on updates
 * @param {TermState} state - The state the StructureNode should be updated to.
 */
TableStructureTermGroup.prototype.updateState = function (state) {
	var currentState = this.getState();
	if (state !== currentState) {
		this.setState(state);
		this.setPreviousState(currentState);
	}
	// refresh anyways, something else (like whether the node is valid) may have changed while keeping the state the same
	this.refresh();
};

/**
 * Overriding clearSelf to ensure that both state is updated for both active term and styling
 * @return {undefined}
 */
TableStructureTermGroup.prototype.clearSelf = function() {
	SingleStructureTermGroup.prototype.clearSelf.call(this);
	CycleStructureTerm.prototype.clearSelf.call(this);
};

/**
 * A model that represents the expand attribute menu item. It functions likes a TermGroup 
 * and has children terms grouped together. 
 * Inherits attribute level grouping logic from StructureTermGroup
 * Extends some methods from the CycleStructureTerm model in order to perform interactive term(AMI) level functionality 
 * and TableStructureTermGroup model which overrides parent (attribute level) term group logic.
 * @constructor
 */
function ExpandStructureTermGroup() {
	this.m_inNavigateStructureTree = false; 	// Don't search for Table node when searching tree from cern-structured
	this.m_shouldSave = false;
	StructureTermGroup.call(this);
	CycleStructureTerm.call(this);
}
ExpandStructureTermGroup.prototype = new StructureTermGroup();
ExpandStructureTermGroup.prototype.constructor = ExpandStructureTermGroup;
JSONStructureOrganizerBuilder.extendClassMethods(ExpandStructureTermGroup, CycleStructureTerm, ["setCaption", "getCaption", "addState", "getCurrentState", "setCurrentState", "getStates", "cycleState", "jumpToState", "deactivate", "refresh", "checkIsDirty", "getRootElement", "resetDirty", "setPriority", "getPriority","displayNode", "isDefaultDisplayed", "isCurrentlyDisplayed","setUIValue", "getUIValue","postProcessing"]);
JSONStructureOrganizerBuilder.extendClassMethods(ExpandStructureTermGroup, TableStructureTermGroup, ["convertToJSON", "updateState", "notifyStateChange", "checkIsDirty"]);

/**
 * Overrides the base StructureTermGroup render method. It renders the ExpandStructureTermGroup object as an html string
 * and appends it to the structure html parameter.
 * @param {StructureHtml} structureHtml Ta- A StructureHtml package object. All html shall be appended to this object.
 */
ExpandStructureTermGroup.prototype.render = function (structureHtml) {	
	structureHtml.append(
			"<div class ='structure-group expand-group collapsed' id='" + this.getNamespace() + ":term:ROOT:" + this.getId() + "'>" +
			"<div class ='structure-group-header'> " + 
			"<span class='structure-component-toggle'></span>" +
			"<span class='structure-group-title' title ='"+this.getCaption()+"'>"+ this.getTitle() + "</span>" +
			"<div id='documentedExpandCountContainer" + this.getId() + "' class='documented-count'></div></div>" +
			"<div class='structure-group-children'>"
			);
	// passing false to make sure it does not create a new column for the children
	this.renderChildren(structureHtml, false); 	
	if (this.getShouldRender() && this.getDefaultRenderChildren() !== this.getChildren()) {
		//Handle rendering Show More link/Unprioritized terms if necessary		
		this.renderShowMore(structureHtml);		
	}
	structureHtml.append("</div></div>");
};

/**
 * Overrides the base getDefaultRenderChildren method and returns all the children with the priority 2 
 * if there only priortiy 2 terms. If it contains a mixture of both priorities, it returns only priority 1 terms.
 */
ExpandStructureTermGroup.prototype.getDefaultRenderChildren = function(){
	var defaultRenderedChildren = StructureGroup.prototype.getDefaultRenderChildren.call(this);
	if(!defaultRenderedChildren.length){
		defaultRenderedChildren = this.getChildren();
		this.setIsShowMore(true);
	}
	return defaultRenderedChildren;
};



/**
 * Updates the count displayed next to the expand title
 * @return {undefined}
 */
ExpandStructureTermGroup.prototype.updateExpandDocumentedCount = function() {
	var $documentedCntContainer = this.getDocumentedExpandCountContainer();
	var documentedCnt = this.getNumberOfDocumentedChildren();
	// Don't display count if no documented terms within or if expanded
	if (this.isExpanded() || !documentedCnt){
		$documentedCntContainer.empty();
		$documentedCntContainer.removeClass("shown");
	}
	else{
		$documentedCntContainer.html(documentedCnt);
		$documentedCntContainer.addClass("shown");
	}
};

/**
 * Returns the container for the expand documented count
 * @return {jQuery} jQuery element container of the expand documented count
 */
ExpandStructureTermGroup.prototype.getDocumentedExpandCountContainer = function() {
	if (!this.m_documentedExpandCountContainer || !this.m_documentedExpandCountContainer.length){
		this.m_documentedExpandCountContainer = $("#documentedExpandCountContainer" + this.getId());
	}
	return this.m_documentedExpandCountContainer;
};

/**
 * Override onToggleExpand to update the documented count next to expand (displays only when collapsed and documented terms present)
 * @return {undefined}
 */
ExpandStructureTermGroup.prototype.onToggleExpand = function() {
	this.updateExpandDocumentedCount();
};
/**
 * The TermState object
 * @return {TermState} returns self to allow chaining
 * @constructor
 * @author Will Reynolds
 */
function TermState() {
	this.m_value = null;                          //The state value (true / false / null)
	this.m_cssClass = "";                         //The associated css class for the state (not always necessary)
	this.m_key = "";                              //An identifier for the state ("NEUTRAL", "NULL", "TRUE", "FALSE")
	this.m_data = {};                             //Any additional data can be stored in the state
	return this;                                //Return a reference to self so you can do constructor chaining
}

/**
 * Get the state value (true / false / null)
 * @return {*} returns the value of the state, either (true / false / null)
 */
TermState.prototype.getValue = function () {
	return this.m_value;
};

/**
 * Sets the value of the state, either (true / false / null)
 * @param value the value of the state
 * @return {TermState} returns self.
 */
TermState.prototype.setValue = function (value) {
	this.m_value = value;
	return this;
};

/**
 * Gets the CSS class for the state (if any). This is used for StructureTerm objects as they have styling based
 * on which state they are in.
 * @return {string} the css class associated with the state.
 */
TermState.prototype.getCSSClass = function () {
	return this.m_cssClass;
};

/**
 * Sets the CSS class for the state (if any). This is used for StructureTerm objects as they have styling based
 * on which state they are in.
 * @param cssClass the css class associated with the state (if any).
 * @return {TermState} returns self
 */
TermState.prototype.setCSSClass = function (cssClass) {
	if(typeof cssClass !== "string") {
		throw new Error("Attempted to call TermState.prototype.setCSSClass with invalid parameter.");
	}
	this.m_cssClass = cssClass;
	return this;
};

/**
 * Get the state key. This is a string identifier for the state.
 * @return {string} the string identifier for the state.
 */
TermState.prototype.getKey = function () {
	return this.m_key;
};

/**
 * Set the state key. This is a string identifier for the state.
 * @param key the string identifier for the state.
 * @return {TermState} returns self.
 */
TermState.prototype.setKey = function (key) {
	this.m_key = key;
	return this;
};

/**
 * Gets the data package tied to the state. This is not always necessary.
 * @return {Object} a JSON data package tied to the state.
 */
TermState.prototype.getData = function () {
	return this.m_data;
};

/**
 * Sets the data package tied to the state. This is not always necessary.
 * @param data the JSON data package tied to the state.
 * @return {TermState} returns self.
 */
TermState.prototype.setData = function (data) {
	this.m_data = data;
	return this;
};

/**
 * Adds a piece of data to the JSON data package tied to the state.
 * @param key the key value in which to store the new data.
 * @param dataPack the piece of data to be added into the state data at the key value. (ex. { key : dataPack })
 * @return {TermState} returns self.
 */
TermState.prototype.addData = function (key, dataPack) {
	this.m_data[key] = dataPack;
	return this;
};

/**
 * Get a piece of data at the key value.
 * @param key the key at which to obtain the data. (ex. { key : value}). You are retrieving value.
 * @return {Object} the data at the key value.
 */
TermState.prototype.getDataValue = function (key) {
	if (!this.m_data[key]) {
		this.m_data[key] = {};
	}
	return this.m_data[key];
};
/**
 * StructureTerm
 * The base StructureTerm object. This represents the individual answers users can interract with inside
 * structured documentation. Any new answer types should inherit from this base class.
 * @returns {StructureTerm}
 * @constructor
 */
function StructureTerm() {
	this.m_caption = "";
	this.m_comment = "";
	//stores already saved comment
	this.m_savedComment = "";
	return this;
}

StructureTerm.prototype = new StructureNode();
StructureTerm.prototype.constructor = StructureNode;

/**
 * Gets the comment of the StructureTerm.
 * @returns {string}
 */
StructureTerm.prototype.getComment = function () {
	return this.m_comment;
};

/**
 * Sets the comment of the StructureTerm.
 * @param {string} comment - The comment of the StructureTerm.
 * @returns {StructureTerm}
 */
StructureTerm.prototype.setComment = function (comment) {
	if (typeof comment !== "string") {
		throw new Error("Attempted to call StructureTerm.prototype.setComment with invalid parameter.");
	}
	this.m_comment = comment;
	return this;
};

/**
 * Returns the priority of a StructureTerm (API)
 * @return {Number} 1 - If term should be shown, 2 - If should be hidden on initial load
 */
StructureTerm.prototype.getPriority = function () {
	return this.m_priority;
};

/**
 * Returns whether or not a term is shown by default based on its priority
 * @return {Boolean} True iff the term should be shown by default
 */
StructureTerm.prototype.isDefaultDisplayed = function () {
	var DONT_SHOW_PRIORITY = 2;
	var priority = this.getPriority();
	var organizer = this.getOrganizer();
	//Always display if AMI prioritization is off
	if(organizer && organizer.isPriorityEnabled()){
		//Default terms to be displayed if priority not 2
		return ( priority === DONT_SHOW_PRIORITY) ? false : true;
	}
	else{
		return true;
	}
};

/**
 * Returns whether or not the term is currently displayed based on API prioritization or whether it is already displayed
 * @return {Boolean} True iff the term is currently displayed on the page
 */
StructureTerm.prototype.isCurrentlyDisplayed = function() {
	var termGroup = this.getParent();
	var DONT_SHOW_PRIORITY = 2;
	var priority = this.getPriority();	
	//Validates on the parent's visibility or its siblings based on the value returned by isCurrentlyDisplayed or showMore of the parent. 	
	//For terms within an expand, checks whether the expanded it is expanded or collapsed.
	if ((StructureTermGroup.prototype.isPrototypeOf(termGroup) && 
		(!termGroup.isCurrentlyDisplayed() || !termGroup.isShowMore()) && 
			priority === DONT_SHOW_PRIORITY)|| 
			(ExpandStructureTermGroup.prototype.isPrototypeOf(termGroup) && !termGroup.isExpanded())){
		return false;
	}
	else{
		return true;
	}
};

/**
 * Ensure that the current node is displayed by displaying hidden unprioritized nodes.
 * @return {[type]} [description]
 */
StructureTerm.prototype.displayNode = function() {
	var termGroup = this.getParent();
	if (StructureTermGroup.prototype.isPrototypeOf(termGroup) && !termGroup.isShowMore()) {
		termGroup.toggleShowMore();
	}
	if (!termGroup.isCurrentlyDisplayed()) {
		termGroup.displayNode();
	}
	if (ExpandStructureTermGroup.prototype.isPrototypeOf(termGroup) && !termGroup.isExpanded()) {
		termGroup.toggleExpand();
	}
};

/**
 * Ensure that the node is displayed after postProcessing is completed
 * @return {undefined}
 */
StructureTerm.prototype.postProcessing = function () {
	var node = this;
    // If there is documented value for a term, ensure it is displayed
    if (node.getState() && node.getState().getValue() && !node.isCurrentlyDisplayed()){
    	node.displayNode();
    }
};

/**
 * Sets the priority of the structure term 
 * @param {Number} priority The priority to set the API term as
 */
StructureTerm.prototype.setPriority = function (priority) {
	if (typeof priority !== "number") {
		throw new Error("Attempted to call StructureTerm.prototype.setPriority with invalid paramater.");
	}
	this.m_priority = priority;
};

/**
 * Sets the UI Value of the structure term (e.g. Expand/Table)
 * @param {String} uiValue The UI value to be associated with the structure term
 */
StructureTerm.prototype.setUIValue = function(uiValue){
	this.m_uiValue = uiValue;
};

/**
 * Returns the UI value associated to the structure term
 * @return {String} The term's associated UI value
 */
StructureTerm.prototype.getUIValue = function() {
	return this.m_uiValue;
};

/**
 * Gets the comment of the StructureTerm.
 * @returns {string}
 */
StructureTerm.prototype.getSavedComment = function () {
	return this.m_savedComment;
};

/**
 * Sets the comment of the StructureTerm.
 * @param {string} comment - The comment of the StructureTerm.
 * @returns {StructureTerm}
 */
StructureTerm.prototype.setSavedComment = function (comment) {
	if (typeof comment !== "string") {
		throw new Error("Attempted to call StructureTerm.prototype.setComment with invalid parameter.");
	}
	this.m_savedComment = comment;
	return this;
};

/**
 * Builds the text area
 * @returns {HTML String}- raw HTMl string of the text area
 */	
StructureTerm.prototype.buildTextArea = function() {
	var textArea = "<textarea id='" + "comment" + this.getNamespace() + this.getId() + "' class='term-textarea textarea-fill' type='text' title='Add Comment' placeholder='Add Comment'>" + this.getComment() + "</textarea>";
	return textArea;
};

/**
 * Displays comment for the term
 * @param {string} comment - The comment of the StructureTerm.
 */
StructureTerm.prototype.displayComment = function(comment) {
	// validates the comment received and covert them to the actual text
	var validatedComment = comment ? this.unescapePlaintextAsHtml(comment) : comment + "";
	// sets comment to the term
	this.setComment(validatedComment);
	this.setSavedComment(validatedComment);
	//builds the comment section with comment
	var termContainer = this.getRootElement();
	var commentSection = termContainer.children("div.structure-term-comment-wrapper");
	//checks if the comment section is not already build then build the comment section
	if (termContainer.length > 0 && commentSection.length < 1) {
		commentSection = "<div class='structure-term-comment-wrapper'>" + this.buildTextArea() + "</div>";
		termContainer.append(commentSection);
	}
	termContainer.addClass("comment");
};
	
/**
 * Gets the caption (html title) of the StructureTerm.
 * @returns {string}
 */
StructureTerm.prototype.getCaption = function () {
	return this.m_caption;
};

/**
 * Sets the caption (html title) of the StructureTerm.
 * @param {string} caption - The html title of the StructureTerm.
 * @returns {StructureTerm}
 */
StructureTerm.prototype.setCaption = function (caption) {
	if (typeof caption !== "string") {
		throw new Error("Attempted to call StructureTerm.prototype.setCaption with invalid parameter.");
	}
	this.m_caption = caption;
	return this;
};

/**
 * Returns a JSON string representation of the StructureTerm used for saving purposes
 * @returns {string}
 */
StructureTerm.prototype.convertToJSON = function () {
	var comment = this.getComment();
	var json = [];
	json.push('"dd_attr_menu_item_id": ' + this.getActivityId() + '.0');
	json.push('"ocid": "' + this.getOCID() + '"');
	json.push('"display_seq": ' + this.getDisplayPosition());
	json.push('"truth_state_mean": "' + ((this.getState().getValue()) ? "T" : "F") + '"');
	json.push('"comment": "' 
		//escape special characters in comment
		+ (comment ? this.escapePlaintextAsHtml(comment) : comment) 
		+ '"');
	json.push('"comment_format_mean": "XHTML"');
	json.push('"value_text": ""');
	json.push('"value_text_format_mean": "XHTML"');
	json.push('"value_number": 0.0');

	return '{' + json.join(',') + '}';
};


/**
 * Updates the StructureTerm to the specified state.
 * @param {TermState} state - The state the StructureTerm is in.
 */
StructureTerm.prototype.updateState = function (state) {
	StructureNode.prototype.updateState.call(this, state);
	this.updateDirty();
};

/**
 * returns the root element from the node.
 * @returns {m_rootElement}
 */
StructureTerm.prototype.getRootElement = function() {
   if(!this.m_rootElement || !this.m_rootElement.length) {
      this.m_rootElement = $("#" + this.getNamespace() + "\\:term\\:ROOT\\:" + this.getId());
   }
   return this.m_rootElement;
};

/**
 * Performs a check to see if the StructureTerm is considered dirty. This simply checks if the
 * current state is not equal to the initial state.
 * @returns {boolean}
 */
StructureTerm.prototype.checkIsDirty = function () {
	return this.getState() !== this.getInitialState();
};

/**
 * Updates the dirty state of the StructureTerm. First, we set the dirty state based on the check
 * for dirty. After this occurs, a dirty class is added to the structure term root level. Finally,
 * the organizer node is found and informed that a term's dirty state has changed.
 */
StructureTerm.prototype.updateDirty = function () {
	var wasDirty = this.m_dirty;
	this.m_dirty = this.checkIsDirty();
	if (wasDirty !== this.m_dirty) {
		this.getParent().notifyDirty(this);
	}
};

/**
 * This simply resets the dirty state of the StructureTerm by setting the initial state to the current state.
 * This occurs when the tree is saved.
 */
StructureTerm.prototype.resetDirty = function () {
	StructureNode.prototype.resetDirty.call(this);
	this.setInitialState(this.getState());
};

/**
 * Renders the StructureTerm as an html string. Currently this base StructureTerm is just a div with a title. It is
 * up to sub-classes of StructureTerm to override this method and provide html.
 * @param {StructureHtml} structureHtml - The structure html package to which this term will be appended.
 */
StructureTerm.prototype.render = function (structureHtml) {
	structureHtml.append("<div>" + this.getTitle() + "</div>");
};

/**
 * Base deactivate method for the StructureTerm. This method should be implemented by any sub-classes of StructureTerm.
 */
StructureTerm.prototype.deactivate = function () {
	return;
};

/**
 * The base refresh method for StructureTerm objects. This removes the CSS class of the previous state and adds the
 * CSS class of the current state.
 */
StructureTerm.prototype.refresh = function () {
	if (this.m_state !== this.m_previousState) {
		$("#" + this.getNamespace() + "\\:term\\:ROOT\\:" + this.getId()).removeClass((this.m_previousState) ? this.m_previousState.getCSSClass() : "").addClass(this.m_state.getCSSClass());
	}
};

/**
 * LineStructureTerm
 * This term has no user-interaction and is simply a placeholder term, designed to delineate regions within
 * structured documentation.
 * @returns {LineStructureTerm}
 * @constructor
 */
function LineStructureTerm() {
	this.m_type = "LINE";
	return this;
}
LineStructureTerm.prototype = new StructureTerm();
LineStructureTerm.prototype.constructor = StructureTerm;

/**
 * Overrides the base StructureTerm render method. It renders the LineStructureTerm object as an html string
 * and appends it to the structure html parameter.
 * @param {StructureHtml} structureHtml - A StructureHtml package object. All html shall be appended to this object.
 */
LineStructureTerm.prototype.render = function (structureHtml) {
	structureHtml.append("<div id='" + this.getNamespace() + ":term:ROOT:" + this.getId() + "' class='structure-term-item line-term'></div>");
};

/**
 * CycleStructureTerm
 * This term represents a structured documentation answer with multiple states that can be cycled through via clicking.
 * This term can have any number of states.
 * @returns {CycleStructureTerm}
 * @constructor
 */
function CycleStructureTerm() {
	this.m_currentState = 0;                  //A state counter to know which state index we sit at
	this.m_states = null;                     //A list of states that will be cycled through
	return this;                            //Return a reference to self to allow chaining
}
CycleStructureTerm.prototype = new StructureTerm();
CycleStructureTerm.prototype.constructor = StructureTerm;

/**
 * Returns the index of the current state.
 * @returns {number}
 */
CycleStructureTerm.prototype.getCurrentState = function () {
	return this.m_currentState;
};

/**
 * Sets the state index.
 * @param {number} currentState - The current state of the term. This value must be within the bounds of the
 * number of states. (0 -> # states).
 * @return {CycleStructureTerm}
 */
CycleStructureTerm.prototype.setCurrentState = function (currentState) {
	if (typeof currentState !== "number") {
		throw new Error("Called setCurrentState on CycleStructureTerm with invalid currentState parameter.");
	}
	if (currentState < 0 || currentState >= this.m_states.length) {
		throw new Error("Called setCurrentState on CycleStructureTerm with an invalid state index.");
	}
	this.m_currentState = currentState;
	return this;
};

/**
 * Adds a TermState to the list of available states for the CycleStructureTerm.
 * @param {TermState} state - A TermState to be added to the CycleStructureTerm.
 * @returns {CycleStructureTerm}
 */
CycleStructureTerm.prototype.addState = function (state) {
	if (!TermState.prototype.isPrototypeOf(state)) {
		throw new Error("Called addState on CycleStructureTerm with invalid state parameter.");
	}
	this.getStates().push(state);
	return this;
};

/**
 * Returns the list of states available on the CycleStructureTerm.
 * @return {List<TermState>}
 */
CycleStructureTerm.prototype.getStates = function () {
	if (!this.m_states) {
		this.m_states = [];
	}
	return this.m_states;
};

/**
 * Increments the state by one and calls the updateState method which will handle state change functionality.
 */
CycleStructureTerm.prototype.cycleState = function () {
	this.m_currentState = (this.m_currentState + 1) % this.m_states.length;
	this.updateState(this.m_states[this.m_currentState]);
};

/**
 * Jumps immediately to the specified state. If the number provided is out of bounds, it will
 * mod the number to make it work.
 * @param {number} stateNumber - The index of the state to jump to.
 */
CycleStructureTerm.prototype.jumpToState = function (stateNumber) {
	this.m_currentState = stateNumber % this.m_states.length;
	this.updateState(this.m_states[this.m_currentState]);
};

/**
 * Overrides the deactivation method. This will simply jump to the 0 state, which is expected to be the NULL
 * state.
 */
CycleStructureTerm.prototype.deactivate = function () {
	this.m_currentState = 0;
	this.updateState(this.m_states[this.m_currentState]);
};

/**
 * Overrides the render method.
 * @param {StructureHtml} structureHtml - A StructureHtml package object. All html shall be appended to this object.
 */
CycleStructureTerm.prototype.render = function (structureHtml) {
	var commentClass = "";
	var commentHTML = "";
	var stateClass = this.m_state ? this.m_state.getCSSClass() : "";
	// create a comment section when the term has a comment and the term is documented
	if(this.getComment()) {
		commentHTML = "<div class='structure-term-comment-wrapper'>" + this.buildTextArea() + "</div>";
		commentClass = "comment"+ " ";
	}	
	structureHtml.append(
			"<div id='" + this.getNamespace() + ":term:ROOT:" + this.getId() + "' class='structure-term-item cycle-term " + commentClass + stateClass + "' title='" + this.getCaption() + "'>" +
			"<div class='structure-term-info-wrapper'>" +
			"<span class='structure-term-title'>" + this.getTitle() + "</span>" +
			"<span class='structure-comment'>&nbsp;</span>" + 
			"</div>" +
			"<div class='structure-documented-icon-area'></div>" +
			commentHTML +
			"</div>"
	);
};

/**
 * Clear the term of activity data and restores its state back to a freshly created state
 */
CycleStructureTerm.prototype.clearSelf = function () {
	StructureTerm.prototype.clearSelf.call(this);
	this.deactivate();
};

/**
 * YesNoStructureTerm
 * This represents a structured documentation answer which has two state; Yes and No. Thus, this class
 * inherits from the CycleStructureTerm and enforces the use of a yes and no state.
 * @returns {YesNoStructureTerm}
 * @constructor
 */
function YesNoStructureTerm() {
	return this;
}
YesNoStructureTerm.prototype = new CycleStructureTerm();
YesNoStructureTerm.prototype.constructor = CycleStructureTerm;

/**
 * Overrides the render method.
 * @param {StructureHtml} structureHtml - A StructureHtml package object. All html shall be appended to this object.
 */
YesNoStructureTerm.prototype.render = function (structureHtml) {
	var commentClass = "";
	var commentHTML = "";
	var stateClass = this.m_state ? (this.m_state.getCSSClass() + " " + this.getYesNoValue()) : "";
	// create a comment section when the term has a comment and the term is documented
	if(this.getComment()) {
		commentHTML = "<div class='structure-term-comment-wrapper'>" + this.buildTextArea() + "</div>";
		commentClass = "comment"+ " ";
	}	
	structureHtml.append("<div id='" + this.getNamespace() + ":term:ROOT:" + this.getId() + "' class='structure-term-item cycle-term yes-no " + commentClass + stateClass + "' title='" + this.getCaption() + "'>" +
			"<div class='structure-term-info-wrapper'>" +
			"<span class='structure-term-title'>" + this.getTitle() + "</span>" +
			"<span class='structure-comment'>&nbsp;</span>" + 
			"</div>" +
			"<div id='" + this.getNamespace() + ":term:YES:" + this.getId() + "' class='structure-yes-no-icon structure-yes'>Y</div>" +
			"<div id='" + this.getNamespace() + ":term:NO:" + this.getId() + "' class='structure-yes-no-icon structure-no'>N</div>" +
			commentHTML +
			"</div>"
	);
};

/**
 * Simply returns the yes or no string value of the term. If the state value is true, return yes, otherwise return false.
 * @returns {string}
 */
YesNoStructureTerm.prototype.getYesNoValue = function () {
	if (!this.m_state || this.m_state.getValue() === null) {
		return "";
	}
	if (this.m_state.getValue()) {
		return "yes";
	}
	return "no";
};

/**
 * Overrides the refresh method, handling the 'Y' and 'N' displays.
 */
YesNoStructureTerm.prototype.refresh = function () {
	StructureTerm.prototype.refresh.call(this);
	var root = $("#" + this.getNamespace() + "\\:term\\:ROOT\\:" + this.getId());
	if (this.getState() && this.getState().getValue() === true) {
		root.addClass("yes").removeClass("no");
	} else if (this.getState() && this.getState().getValue() === false) {
		root.addClass("no").removeClass("yes");
	} else {
		root.removeClass("yes").removeClass("no");
	}
};

/**
 * InputStructureTerm
 * This represents a structured documentation answer which allows user input via a textbox.
 * @returns {InputStructureTerm}
 * @constructor
 */
function InputStructureTerm() {
	this.m_dataType = "";                 //Which types of data the input term accepts (alpha/alphanumeric, or numeric)
	this.m_currentValue = "";             //The value the user has currently entered in the available input
	this.m_previousValue = "";            //The value since the last save
	this.m_validators = null;
	this.m_activeState = null;
	this.m_inactiveState = null;
	// indicates whether the input is valid, true by default/blank
	this.m_isValid = true;

	return this;
}

InputStructureTerm.prototype = new StructureTerm();
InputStructureTerm.prototype.constructor = StructureTerm;

/**
 * Gets the data type for the InputStructureTerm.
 * @return {string} the data type for the InputStructureTerm.
 */
InputStructureTerm.prototype.getDataType = function () {
	return this.m_dataType;
};

/**
 * Sets the data type for the InputStructureTerm.
 * @param dataType the data type for the InputStructureTerm.
 * @return {InputStructureTerm} returns self.
 */
InputStructureTerm.prototype.setDataType = function (dataType) {
	if (typeof dataType !== "string") {
		throw new Error("Called setDataType on InputStructureTerm with invalid dataType parameter.");
	}
	this.m_dataType = dataType;
	return this;
};

/**
 * Returns the previous text value that was input in the InputStructureTerm.
 * @returns {string}
 */
InputStructureTerm.prototype.getPreviousValue = function () {
	return this.m_previousValue;
};

/**
 * Overrides the resetDirty method. This calls the base resetDirty method, then sets the previousValue to the
 * currentValue.
 */
InputStructureTerm.prototype.resetDirty = function () {
	StructureTerm.prototype.resetDirty.call(this);
	this.m_previousValue = this.m_currentValue;
};

/**
 * Overrides the checkIsDirty method. InputSructureTerm has a complicated system for determining dirty state. There
 * are three scenarios which guarantee dirty state.
 * 1). If the term was active and is currently inactive.
 * 2). If the term was inactive and is currently active.
 * 3). If the term was active, is currently active, but the previousValue and currentValue are not equal.
 * @returns {boolean}
 */
InputStructureTerm.prototype.checkIsDirty = function () {
	var currentlyActive = this.getState() === this.getActiveState();
	var wasInactive = this.getInitialState() === this.getInactiveState();
	var currentValue = this.getCurrentValue();
	var previousValue = this.getPreviousValue();
	//If it was not active and is currently active, it's dirty. If it was active and is currently inactive, it's dirty. Or
	//if it was active and is still currently active, but the text value is different, it's dirty.
	return (wasInactive && currentlyActive) || (!wasInactive && currentlyActive && currentValue !== previousValue) || (!wasInactive && !currentlyActive);
};

/**
 * Overrides the convertToJSON method.
 * @return {Object} the JSON version of this term.
 */
InputStructureTerm.prototype.convertToJSON = function () {
	var currentValue = this.getCurrentValue();
	var comment = this.getComment();

	var json = [];
	json.push('"dd_attr_menu_item_id": ' + this.getActivityId() + '.0');
	json.push('"ocid": "' + this.getOCID() + '"');
	json.push('"display_seq": ' + this.getDisplayPosition());
	json.push('"truth_state_mean": "' + ((this.getState().getValue()) ? "T" : "F") + '"');
	json.push('"comment": "' 
		//escape special characters in comment
		+ (comment ? this.escapePlaintextAsHtml(comment) : comment) 
		+ '"');
	json.push('"comment_format_mean": "XHTML"');
	json.push('"value_text": "'
		// escape value text
		+ (currentValue ? this.escapePlaintextAsHtml(currentValue) : currentValue)
		+ '"');
	json.push('"value_text_format_mean": "XHTML"');

	if (this.m_dataType === "NUMERIC") {
		currentValue = parseFloat(this.getCurrentValue());

		// append a .0 if it is a whole number
		if (currentValue % 1 === 0) {
			currentValue = currentValue + ".0";
		}

		json.push('"value_number": ' + currentValue);

	} else {
		json.push('"value_number": 0.0');
	}

	return '{' + json.join(',') + '}';
};


/**
 * Gets the current value (in the textbox) for the InputStructureTerm.
 * @return {string} the current value in the textbox.
 */
InputStructureTerm.prototype.getCurrentValue = function () {
	return this.m_currentValue;
};

/**
 * Updates the validity and the state of the term based on the current value of the term.
 * Should be called after a change in the current value of the term.
 */
InputStructureTerm.prototype.update = function () {
	if (this.validate()) {
		this.m_isValid = true;

		if (this.m_currentValue !== "") {
			this.getActiveState().addData("value", this.m_currentValue);
			this.updateState(this.m_activeState);
		} else {
			this.updateState(this.m_inactiveState);
		}
	} else {
		this.m_isValid = false;

		this.updateState(this.m_inactiveState);
	}
};

/**
 * Overrides the refresh method to update the input displays/UI based on the current value.
 */
InputStructureTerm.prototype.refresh = function () {
	StructureTerm.prototype.refresh.call(this);

	// update input value with the current value
	var input = $("#" + this.getNamespace() + "\\:term\\:INPUT\\:" + this.getId());
	if (this.getCurrentValue() !== input.val()) {
		input.val(this.getCurrentValue());
	}

	// if the input is in an invalid state, we are going to add an "invalid" class to the term
	if (!this.m_isValid) {
		$("#" + this.getNamespace() + "\\:term\\:ROOT\\:" + this.getId()).addClass("invalid");
	} else {
		$("#" + this.getNamespace() + "\\:term\\:ROOT\\:" + this.getId()).removeClass("invalid");
	}
};


/**
 * Sets the current text value within the InputStructureTerm.
 * @param {string} currentValue - The current value within the InputStructureTerm.
 * @returns {InputStructureTerm}
 */
InputStructureTerm.prototype.setCurrentValue = function (currentValue) {
	if (typeof currentValue !== "string") {
		throw new Error("Called setCurrentValue on InputStructureTerm with invalid type: expected {String}");
	}
	this.m_currentValue = currentValue;
	return this;
};

/**
 * This method forces the InputStructureTerm into the inactive state.
 */
InputStructureTerm.prototype.deactivate = function () {
	this.setCurrentValue("");
	this.updateState(this.m_inactiveState);
};

/**
 * Clear the term of activity data and restores its state back to a freshly created state
 */
InputStructureTerm.prototype.clearSelf = function () {
	StructureTerm.prototype.clearSelf.call(this);
	this.deactivate();
};

/**
 * Returns a list of validators associated to the InputStructureTerm.
 * @returns {Array<InputValidator>}
 */
InputStructureTerm.prototype.getValidators = function () {
	if (!this.m_validators) {
		this.m_validators = [];
	}
	return this.m_validators;
};

/**
 * Add an InputValidator to the InputStructureTerm.
 * @param {InputValidator} validator - A validator to be associated to the InputStructureTerm.
 * @returns {InputStructureTerm}
 */
InputStructureTerm.prototype.addValidator = function (validator) {
	if (!InputValidator.prototype.isPrototypeOf(validator)) {
		throw new Error("Called addValidator on InputStructureTerm with invalid type, expected InputValidator");
	}
	this.getValidators().push(validator);
	return this;
};

/**
 * Simply returns a boolean as for whether or not the currentValue on the InputStructureTerm matches the data type
 * required.
 * @return {Boolean}
 */
InputStructureTerm.prototype.validate = function () {
	//If nothing has been entered, we consider that valid (nothing entered)
	var currentValue = this.getCurrentValue();
	if (currentValue == "") {
		return true;
	}
	//Iterate over each of the validators and ensure they evaluate to true
	var validators = this.getValidators();
	var numberValidators = validators.length;
	for (var i = 0; i < numberValidators; i++) {
		if (!validators[i].validate(currentValue)) {
			return false;
		}
	}
	//If we have made it this far, the input term has successfully validated
	return true;
};

/**
 * Renders the InputStructureTerm object as an html string.
 * @param {StructureHtml} structureHtml - A StructureHtml package object. All html shall be appended to this object.
 */
InputStructureTerm.prototype.render = function (structureHtml) {
	var commentClass = "";
	var commentHTML = "";
	var titleText = this.getTitle();
	var itemWidth = "45%";

	// escape current value plain text to be safe for html
	var currentValueHtml = this.escapePlaintextAsHtml(this.m_currentValue);

	var inputElement = "<input style='width: " + itemWidth + ";' type='text' id='" + this.getNamespace() + ":term:INPUT:" + this.getId() + "' value='" + currentValueHtml + "'>";
	//If somehow the input term does not contain the _ character, add one at the end by default.
	if(titleText.indexOf("_") === -1) {
		titleText += "_";
	}
	if (titleText.indexOf("_") === 0) {
		titleText = inputElement + "<span class='structure-term-title' style='width: " + itemWidth + ";'>" + titleText.replace(/_/g, "") + "</span>";
	} else if (titleText.lastIndexOf("_") === (titleText.length - 1)) {
		titleText = "<span class='structure-term-title' style='width: " + itemWidth + ";'>" + titleText.replace(/_/g, "") + "</span>" + inputElement;
	} else {
		var textSplit = titleText.split(/_+/g);
		var numberOfNonBlank = 0;
		var i = 0;
		for (i = 0; i < textSplit.length; i++) {
			(textSplit[i]) && numberOfNonBlank++;
		}
		itemWidth = (90 / (numberOfNonBlank + 1)) + "%";
		inputElement = "<input style='width: " + itemWidth + ";' type='text' id='" + this.getNamespace() + ":term:INPUT:" + this.getId() + "' value='" + currentValueHtml + "'>";
		for (i = 0; i < textSplit.length; i++) {
			if (textSplit[i]) {
				textSplit[i] = ("<span class='structure-term-title' style='width: " + itemWidth + ";'>" + textSplit[i] + "</span>");
			}
		}
		titleText = textSplit.join(inputElement);
	}
	var stateClass = this.m_state ? this.m_state.getCSSClass() : "";
	// create a comment section when the term has a comment and the term is documented
	if(this.getComment()) {
		commentHTML = "<div class='structure-term-comment-wrapper'>" + this.buildTextArea() + "</div>";
		commentClass = "comment"+ " ";
	}
	structureHtml.append(
			"<div id='" + this.getNamespace() + ":term:ROOT:" + this.getId() + "' class='structure-term-item input-term " + commentClass + stateClass + "' title='" + this.getCaption() + "'>" +
			"<div class='structure-term-info-wrapper'>" +
			titleText +
			"<span class='structure-comment'>&nbsp;</span>" + 
			"</div>" +
			"<div class='structure-documented-icon-area'></div>" +
			commentHTML +
			"</div>"
	);
};

/**
 * Gets the active state for the term
 * @returns {TermState} a TermState object that represents the active state
 */
InputStructureTerm.prototype.getActiveState = function () {
	return this.m_activeState;
};

/**
 * Sets the active state for the term
 * @param {TermState} activeState - a TermState object that represents the active state
 */
InputStructureTerm.prototype.setActiveState = function (activeState) {
	if(!TermState.prototype.isPrototypeOf(activeState)) {
		throw new Error("Attempted to call InputStructureTerm.prototype.setActiveState with invalid parameter");
	}
	this.m_activeState = activeState;
	return this;
};

/**
 * Gets the inactive state for the term
 * @returns {TermState} a TermState object that represents the inactive state
 */
InputStructureTerm.prototype.getInactiveState = function () {
	return this.m_inactiveState;
};

/**
 * Sets the inactive state for the term.
 * @param {TermState}inactiveState
 * @returns {InputStructureTerm}
 */
InputStructureTerm.prototype.setInactiveState = function (inactiveState) {
	if(!TermState.prototype.isPrototypeOf(inactiveState)) {
		throw new Error("Attempted to call InputStructureTerm.prototype.setInactiveState with invalid parameter.");
	}
	this.m_inactiveState = inactiveState;
	return this;
};

/**
 * FreeTextStructureTerm
 * @returns {FreeTextStructureTerm}
 * @constructor
 */
function FreeTextStructureTerm() {
	return this;
}

FreeTextStructureTerm.prototype = new InputStructureTerm();
FreeTextStructureTerm.prototype.constructor = InputStructureTerm;

/**
 * Renders the freetext term as html and appends it to the supplied html
 * @param {StructureHtml} structureHtml - existing html to append the rendered freetext term onto
 */
FreeTextStructureTerm.prototype.render = function (structureHtml) {
	var stateClass = this.m_state ? this.m_state.getCSSClass() : "";

	// escape current value plain text to be safe for html
	var currentValueHtml = this.escapePlaintextAsHtml(this.m_currentValue);

	structureHtml.append(
			"<div id='" + this.getNamespace() + ":term:ROOT:" + this.getId() + "' class='structure-term-item input-term freetext-term " + stateClass + "' title='" + this.getCaption() + "'>" +
			"<div class='structure-term-info-wrapper'>" +
			"<input type='text' id='" + this.getNamespace() + ":term:INPUT:" + this.getId() + "' value='" + currentValueHtml + "' placeholder='" + i18n.discernabu.mpage_structured_documentation.ADD_FREE_TEXT_TERM + "'>" +
			"</div>" +
			"</div>"
	);
};

/**
 * NoneStructureTerm
 * This represents a structured documentation answer that reflects None
 * @returns {NoneStructureTerm}
 * @constructor 
 */
function NoneStructureTerm (){
	return this;
}
NoneStructureTerm.prototype = new CycleStructureTerm();
NoneStructureTerm.prototype.constructor = CycleStructureTerm;

/**
 * TableStructureTerm
 * This represents a structured documentation term within a Table (R/L/Bi)
 * @returns {TableStructureTerm}
 * @constructore
 */
function TableStructureTerm () {
	return this;
}

TableStructureTerm.prototype = new CycleStructureTerm();
TableStructureTerm.prototype.constructor = CycleStructureTerm;

/**
 * Overrides the render method.
 * @param {StructureHtml} structureHtml - A StructureHtml package object. All html shall be appended to this object.
 */
TableStructureTerm.prototype.render = function (structureHtml) {
	var commentClass = "";
	var commentHTML = "";
	var stateClass = this.m_state ? this.m_state.getCSSClass() : "";
	var columnWidth = (100 / this.getParent().getChildren().length) + "%";

	structureHtml.append(
			"<div id='" + this.getNamespace() + ":term:ROOT:" + this.getId() + "' class='table-term " + stateClass + "' title='" + this.getCaption() +  "'  style='width: " + columnWidth + ";'>" +
			"<div class='structure-documented-icon-area'>" + this.getUIValue() + "</div>" +
			"</div>"
	);
};

/**
 * Implements isDefaultDisplayed term for TableStructureTerm.  Returns true as the term should always
 * be displayed independent of priority if that parent Table is displayed
 * @return {Boolean} Returns true if the node should be rendered by default
 */
TableStructureTerm.prototype.isDefaultDisplayed = function() {
	return true;
};

/**
 * Override the getComment function, to retrieve comment from the Table level. 
 * This is because the comment on the front-end is associated to the table, but to the term on the back-end.
 * @return {String} The comment associated to the term/table
 */
TableStructureTerm.prototype.getComment = function() {
	var tableGroupTerm = this.getParent();
	var tableGroupTermComment = tableGroupTerm.getComment();
	//If current tem is active, return associated comment
	if(tableGroupTerm.getActiveTerm() === this){
		this.setComment(tableGroupTermComment);
		return tableGroupTermComment;
	}
	//Otherwise, remove comment from current table item
	else {
		this.setComment("");
		return "";
	}
};

/**
 * Override getSaveComment to return parent table's saved comment
 * @return {String} The comment saved in the table
 */
TableStructureTerm.prototype.getSavedComment = function() {
	var tableGroupTerm = this.getParent();
	return tableGroupTerm.getSavedComment();
};

/**
 * Displays comment for the term
 * @param {string} comment - The comment of the StructureTerm.
 */
TableStructureTerm.prototype.displayComment = function(comment) {
	// validates the comment received and covert them to the actual text
	var validatedComment = comment ? this.unescapePlaintextAsHtml(comment) : comment + "";
	// sets comment to the term
	this.setComment(validatedComment);
	this.setSavedComment(validatedComment);

	var tableTermGroup = this.getParent();
	tableTermGroup.displayComment(comment);
};

/**
 * Override default getHighlightElement to return highLightElement of parent table.
 * @return {undefined}
 */
TableStructureTerm.prototype.getHighlightElement = function() {
	var tableGroupTerm = this.getParent();
	return tableGroupTerm.getHighlightElement();
};

/**
 * Overiding isDefaultDisplayed such that term is always default rendered when parent is rendered
 * @return {Boolean} True iff the term should be shown by default
 */
TableStructureTerm.prototype.isDefaultDisplayed = function () {
	return true;
};

/**
 * Overiding isCurrentlyDisplayed as term will always be displayed if parent table is displayed
 * @return {Boolean} True iff the term is currently displayed on the page
 */
TableStructureTerm.prototype.isCurrentlyDisplayed = function() {
	var parentTable = this.getParent();
	return parentTable.isCurrentlyDisplayed();
};

/**
 * Overriding displayNode to display parent table when node is not displayed
 * @return {[type]} [description]
 */
TableStructureTerm.prototype.displayNode = function() {
	var table = this.getParent();
	table.displayNode();
};
/**
 * Navigator
 * This class serves as a standard navigation bar which simply displays a list of navigation options
 * @returns {Navigator}
 * @constructor
 */
function Navigator() {
	this.m_activeNavigation = null;
	this.m_clickCallback = null;
	this.m_id = "";
	this.m_navigationMap = null;
	this.m_navigations = null;
	this.m_skin = "";
	return this;
}

/**
 * Returns the click callback function. To execute the callback, it must be called as getClickCallback()().
 * @returns {null | function}
 */
Navigator.prototype.getClickCallback = function () {
	return this.m_clickCallback;
};

/**
 * Sets the callback that is executed when a navigation item is selected.
 * @param {function} callback - The callback function to be executed when a navigation item is selected from the
 * navigator. This function must be in the following format.
 * function(navigationItem) { ... }.
 */
Navigator.prototype.setClickCallback = function (callback) {
	if (typeof callback !== "function") {
		throw new Error("Attempted to call setClickCallback with invalid parameter");
	}
	this.m_clickCallback = callback;
	return this;
};

/**
 * Applies a custom CSS skin to the root level of the navigator.
 * @param {string} skin - The CSS skin to be applied to the root level of the navigator.
 * @returns {Navigator}
 */
Navigator.prototype.applyCustomSkin = function (skin) {
	if (typeof skin !== "string") {
		throw new Error("Attempted to call applyCustomSkin with invalid parameter.");
	}
	this.m_skin = skin;
	return this;
};

/**
 * Returns the custom CSS skin that will be applied to the root level of the navigator.
 * @returns {string}
 */
Navigator.prototype.getCustomSkin = function () {
	return this.m_skin;
};

/**
 * Returns the Navigation item that is currently active within the Navigator.
 * @returns {null|Navigation}
 */
Navigator.prototype.getActiveNavigation = function () {
	return this.m_activeNavigation;
};

/**
 * Sets the Navigation item that is currently active within the Navigator.
 * @param {Navigation} activeNavigation - The Navigation item that is currently active within the Navigator.
 * @returns {Navigator}
 */
Navigator.prototype.setActiveNavigation = function (activeNavigation) {
	if (!Navigation.prototype.isPrototypeOf(activeNavigation)) {
		throw new Error("Attempted to call setActiveNavigation with invalid parameter.");
	}
	this.m_activeNavigation = activeNavigation;
	return this;
};

/**
 * Returns the id of the Navigator element.
 * @returns {string}
 */
Navigator.prototype.getId = function () {
	return this.m_id;
};

/**
 * Sets the id of the Navigator element.
 * @param {string} id - The id of the Navigator element.
 * @returns {Navigator}
 */
Navigator.prototype.setId = function (id) {
	if (typeof id !== "string") {
		throw new Error("Attempted to call setId with invalid parameter.");
	}
	this.m_id = id;
	return this;
};

/**
 * Returns the list of Navigation items associated to the Navigator.
 * @returns {Array<Navigation>}
 */
Navigator.prototype.getNavigations = function () {
	if (!this.m_navigations) {
		this.m_navigations = [];
	}
	return this.m_navigations;
};

/**
 * Sets the list of Navigation items associated to the Navigator.
 * @param {Array<Navigation>} navigations - The list of Navigation items to be associated to the Navigator
 * @returns {Navigator}
 */
Navigator.prototype.setNavigations = function (navigations) {
	if (!Array.prototype.isPrototypeOf(navigations)) {
		throw new Error("Attempted to call setNavigations with invalid parameter.");
	}
	this.m_navigations = navigations;
	return this;
};

/**
 * Adds a Navigation item to the list of Navigation items associated to the Navigator.
 * The Navigation item is put in a flat list as well as a map which maps from the Navigation id to the object.
 * @param {Navigation} navigation - A single Navigation item to be associated to the Navigator.
 * @returns {Navigator}
 */
Navigator.prototype.addNavigation = function (navigation) {
	if (!Navigation.prototype.isPrototypeOf(navigation)) {
		throw new Error("Attempted to call addNavigation with invalid parameter.");
	}
	this.getNavigations().push(navigation);
	this.getNavigationMap()[navigation.getId()] = navigation;
	return this;
};

/**
 * Returns the Navigation map which is an association of Navigation ids to objects.
 * @returns {null|Object}
 */
Navigator.prototype.getNavigationMap = function () {
	if (!this.m_navigationMap) {
		this.m_navigationMap = {};
	}
	return this.m_navigationMap;
};

/**
 * Renders the Navigator object as an html string which is to be appended to the DOM. This method will render the
 * shell of the Navigator as well as render each individual Navigation item.
 * @returns {string}
 */
Navigator.prototype.render = function () {
	var html = "";
	var navigationList = this.getNavigations();
	var navigationCount = navigationList.length;
	html += "<div id='" + this.getId() + "' class='" + this.getCustomSkin() + " structure-navigator'>";
	for (var i = 0; i < navigationCount; i++) {
		html += navigationList[i].render();
	}
	html += "</div>";
	return html;
};

/**
 * Finalizes the Navigator object. This attaches a click delegate at the root level to listen for click events
 * on the individual Navigation items. When an item is clicked, it is activated and the onSelect method is called.
 * The currently active Navigation item is deselected.
 */
Navigator.prototype.finalize = function () {
	var self = this;
	var elementId = this.getId().replace(/:/g, "\\:");
	//Attach a delegate and listen for clicks on any of the navigation items
	$("#" + elementId).on('click', '.navigator-button', function () {
		self.handleNavigationSelection(this.id);
	});
};

Navigator.prototype.updateActiveNavigation = function (navigationId) {
	var navigationItem = this.getNavigationMap()[navigationId];
	if (!navigationItem || navigationItem === this.getActiveNavigation()) {
		return;
	}
	//If there is a currently active Navigation item, deselect it first
	if (this.getActiveNavigation()) {
		this.getActiveNavigation().deselect();
	}
	navigationItem.getElement().addClass("active");
	this.setActiveNavigation(navigationItem);
};

Navigator.prototype.handleNavigationSelection = function (navigationId) {
	//Using the id of the element, look up the Navigation object in the navigation map
	var navigationItem = this.getNavigationMap()[navigationId];
	if (!navigationItem || navigationItem === this.getActiveNavigation()) {
		return;
	}
	//If there is a currently active Navigation item, deselect it first
	if (this.getActiveNavigation()) {
		this.getActiveNavigation().deselect();
	}
	this.setActiveNavigation(navigationItem);
	navigationItem.onSelect();
	if (this.m_clickCallback) {
		this.m_clickCallback(navigationItem);
	}
};


/**
 * Navigation
 * This class serves as the base Navigation object which is meant to be added into a Navigator.
 * @returns {Navigation}
 * @constructor
 */
function Navigation() {
	this.m_id = "";
	this.m_label = "";
	this.m_element = null;
	return this;
}

/**
 * Returns the Navigation DOM element.
 * @returns {Object}
 */
Navigation.prototype.getElement = function () {
	if (!this.m_element) {
		this.m_element = $("#" + this.getId().replace(/\:/g, "\\:"));
	}
	return this.m_element;
};

/**
 * Returns the id of the Navigation element.
 * @returns {string}
 */
Navigation.prototype.getId = function () {
	return this.m_id;
};

/**
 * Sets the id of the Navigation element.
 * @param {string} id - The id of the Navigation element.
 * @returns {Navigation}
 */
Navigation.prototype.setId = function (id) {
	if (typeof id !== "string") {
		throw new Error("Attempted to call Navigation.prototype.setId with invalid parameter.");
	}
	this.m_id = id;
	return this;
};

/**
 * Returns the label of the Navigation element.
 * @returns {string}
 */
Navigation.prototype.getLabel = function () {
	return this.m_label;
};

/**
 * Sets the label of the Navigation element.
 * @param {string} label - The label of the Navigation element.
 * @returns {Navigation}
 */
Navigation.prototype.setLabel = function (label) {
	if (typeof label !== "string") {
		throw new Error("Attempted to call Navigation.prototype.setLabel with invalid parameter.");
	}
	this.m_label = label;
	return this;
};

/**
 * This method performs the base onSelect operations. Any sub-class that overrides this method should call this
 * base method.
 */
Navigation.prototype.onSelect = function () {
	this.getElement().addClass("active");
};

/**
 * This method deselects the Navigation item.
 */
Navigation.prototype.deselect = function () {
	this.getElement().removeClass("active").blur();
};

/**
 * This method renders the Navigation item. Note that it uses the standard button implementation and applies a custom
 * skin to the button.
 * @returns {string}
 */
Navigation.prototype.render = function () {
	return "<button id='" + this.getId() + "' class='navigator-button'>" + this.getLabel() + "</button>";
};

/**
 * ScrollNavigation
 * This class inherits from the base Navigation item. Its purpose is to scroll some other element to a specified
 * anchor.
 * @returns {ScrollNavigation}
 * @constructor
 */
function ScrollNavigation() {
	this.m_anchorId = "";
	this.m_anchorElement = null;
	this.m_containerId = "";
	this.m_containerElement = null;
	return this;
}
ScrollNavigation.prototype = new Navigation();
ScrollNavigation.prototype.constructor = Navigation;

/**
 * Returns the id of the anchor element. The anchor element is the anchor to which the container element will be
 * scrolled.
 * @returns {string}
 */
ScrollNavigation.prototype.getAnchorId = function () {
	return this.m_anchorId;
};

/**
 * Sets the id of the anchor element. The anchor element is the anchor to which the container element will be scrolled.
 * @param {string} anchorId - The id of the element to which the container element will be scrolled.
 * @returns {ScrollNavigation}
 */
ScrollNavigation.prototype.setAnchorId = function (anchorId) {
	if (typeof anchorId !== "string") {
		throw new Error("Attempted to call ScrollNavigation.prototype.setAnchorId with invalid parameter.");
	}
	this.m_anchorId = anchorId;
	return this;
};

/**
 * Returns the anchor element jQuery object. The anchor element is the anchor to which the container element will be
 * scrolled.
 * @returns {Object}
 */
ScrollNavigation.prototype.getAnchorElement = function () {
	if (!this.m_anchorElement) {
		this.m_anchorElement = $("#" + this.getAnchorId().replace(/:/g, "\\:"));
	}
	return this.m_anchorElement;
};

/**
 * Returns the id of the container element. The container element is the element which will be scrolled to the specified
 * anchor.
 * @returns {string}
 */
ScrollNavigation.prototype.getContainerId = function () {
	return this.m_containerId;
};

/**
 * Sets the id of the container element. The container element is the element which will be scrolled to the specified
 * anchor.
 * @param {string} containerId - The id of the container element.
 * @returns {ScrollNavigation}
 */
ScrollNavigation.prototype.setContainerId = function (containerId) {
	if (typeof containerId !== "string") {
		throw new Error("Attempted to call ScrollNavigation.prototype.setContainerId with invalid parameter.");
	}
	this.m_containerId = containerId;
	return this;
};

/**
 * Returns the container element jQuery object. The container element is the element which will be scrolled to the
 * specified anchor.
 * @returns {Object}
 */
ScrollNavigation.prototype.getContainerElement = function () {
	if (!this.m_containerElement) {
		this.m_containerElement = $("#" + this.getContainerId().replace(/:/g, "\\:"));
	}
	return this.m_containerElement;
};

/**
 * This method overrides the base Navigation onSelect method. It calls the base onSelect method then scrolls the
 * container element to the anchor element.
 */
ScrollNavigation.prototype.onSelect = function () {
	Navigation.prototype.onSelect.call(this);
	var containerElement = this.getContainerElement();
	var anchorElement = this.getAnchorElement();
	containerElement.scrollTop(anchorElement.offset().top - containerElement.offset().top + containerElement.scrollTop());
};

/**
 * CallbackNavigation
 * This class inherits from the base Navigation item. Its purpose is to provide a simple entry point to a Navigation
 * item which allows a user to provide a callback when the item is selected. The functionality is mostly left to the
 * developer.
 * @returns {CallbackNavigation}
 * @constructor
 */
function CallbackNavigation() {
	this.m_onSelect = null;
	return this;
}
CallbackNavigation.prototype = new Navigation();
CallbackNavigation.prototype.constructor = Navigation;

/**
 * Sets the callback function to be run when the CallbackNavigation item is selected in the Navigator.
 * @param {function} onSelect - The callback function to be run when the CallbackNavigation item is selected in the
 * Navigator.
 * @returns {CallbackNavigation}
 */
CallbackNavigation.prototype.setOnSelect = function (onSelect) {
	if(typeof onSelect !== "function") {
		throw new Error("Attempted to call CallbackNavigation.prototype.setOnSelect with invalid parameter.");
	}
	this.m_onSelect = onSelect;
	return this;
};

/**
 * Overrides the base onSelect method. This will call the on select callback if one is provided.
 */
CallbackNavigation.prototype.onSelect = function () {
	Navigation.prototype.onSelect.call(this);
	if (this.m_onSelect) {
		this.m_onSelect();
	}
};

/**
 * StructureNavigation
 * This class inherits from the CallbackNavigation item. Its purpose is to integrate with structured documentation.
 * The structured documentation functionality requires a navigation item for each group. When a navigation item
 * is selected, it is necessary to know which StructureNode it is associated with. Thus, this class keeps a reference
 * to the associated StructureNode.
 * @constructor
 */
function StructureNavigation() {
	this.m_node = null;
}
StructureNavigation.prototype = new ScrollNavigation();
StructureNavigation.prototype.constructor = ScrollNavigation;

/**
 * Set the node that the navigation is associated to.
 * @param {StructureNode} node - The node that the navigation is associated to.
 * @returns {StructureNavigation} Returns self to allow chaining.
 */
StructureNavigation.prototype.setNode = function(node) {
	this.m_node = node;
	return this;
};

/**
 * Renders the structure navigation as an html string
 * @returns {string} structure navigation html string
 */
StructureNavigation.prototype.render = function () {
	var documentedClass = (this.m_node && this.m_node.getNumberOfDocumentedChildren() > 0) ? " navigation-documented" : "";
	return "<div id='" + this.getId() + "' class='navigator-button structure-navigator-button" + documentedClass + "'><span>" + this.getLabel() + "</span><div class='navigation-documented-icon'></div></div>";
};
/**
 * The StructureQuestionSet class.
 * This class is used to group a set of structure questions so they can be handled as a unit.
 * @constructor
 */
function StructureQuestionSet() {
	this.m_onCompleteCallback = null;
	this.m_lookup = null;
}

StructureQuestionSet.prototype = new StructureGroup();
StructureQuestionSet.prototype.constructor = StructureGroup;

/**
 * Gets the lookup hashmap for child nodes of the StructureQuestionSet. This should only contain StructureAnswer
 * objects.
 * @returns {HashMap<string, StructureNode>} A hashmap of node ids to StructureNode objects.
 */
StructureQuestionSet.prototype.getLookup = function() {
	if(!this.m_lookup) {
		this.m_lookup = {};
	}
	return this.m_lookup;
};

/**
 * Goes through the answers and finds all that have been answered (or checked). The answers are pushed into an array
 * then serialized as a JSON string.
 * @returns {string} The answers as a serialized array (in string format).
 */
StructureQuestionSet.prototype.getAnswers = function() {
	var answered = [];

	var questions = this.getChildren();
	var questionCount = questions.length;
	var question = null;

	var answers = null;
	var answerCount = null;
	var answer = null;
	for(var i = 0; i < questionCount; i++) {
		question = questions[i];
		answers = question.getChildren();
		answerCount = answers.length;
		for(var j = 0; j < answerCount; j++) {
			answer = answers[j];
			//This answer has been chosen
			if(answer.getState().getValue()) {
				answered.push({
					"parent_entity_id" : question.getParentEntityId() + ".0",
					"parent_entity_name" : question.getParentEntityName(),
					"dd_sref_chf_cmplnt_crit_id" : answer.getTemplateId() + ".0"
				});
			}
		}
	}
	return JSON.stringify(answered);
};

/**
 * Sets the callback function that is triggered when all questions in the set have been answered.
 * @param {function} onCompleteCallback - The callback function.
 * @returns {StructureQuestionSet} Returns self to allow chaining.
 */
StructureQuestionSet.prototype.setOnCompleteCallback = function(onCompleteCallback) {
	if(typeof onCompleteCallback !== "function") {
		throw new Error("StructureQuestionSet.prototype.setOnCompleteCallback expects a function");
	}
	this.m_onCompleteCallback = onCompleteCallback;
	return this;
};

/**
 * Retrieves the root element of the question set.
 * @returns {jQuery|HTMLElement} The root element of the question set.
 */
StructureQuestionSet.prototype.getRootElement = function() {
	if(!this.m_rootElement || !this.m_rootElement.length) {
		this.m_rootElement = $("#" + this.m_namespace + "StructureQuestionSet");
	}
	return this.m_rootElement;
};

/**
 * Override the notifyStateChange function. For a structure question set, we need to know when all questions of the
 * question set have been answered in some fashion. When this occurs, we can trigger the callback.
 * @param {StructureQuestion} node - The StructureQuestion (or node) that changed state.
 */
StructureQuestionSet.prototype.notifyStateChange = function(node) {
	StructureNode.prototype.notifyStateChange.call(this, node);
	if(this.m_numberDocumented === this.m_children.length) {
		if(this.m_onCompleteCallback) {
			this.m_onCompleteCallback(true);
		}
	} else {
		this.m_onCompleteCallback(false);
	}
};

/**
 * First assign unique ids and namespace to the nodes then create the HTML representation of the question set.
 * @returns {string} The question set rendered as an HTML string.
 */
StructureQuestionSet.prototype.render = function() {
	var structureHtml = new StructureHtml();
	structureHtml.append("<div id='"+this.m_namespace+"StructureQuestionSet' class='structure-question-set' data-lookup='"+this.m_id+"'>");
	this.renderChildren(structureHtml, false);
	structureHtml.append("</div>");
	return structureHtml.getHtml();
};

/**
 * The StructureQuestion class.
 * This represents a single structure question. It inherits from the MultiStructureTermGroup which means that any number
 * of its children can be documented at once.
 * @constructor
 */
function StructureQuestion() {
	this.m_questionDisplay = "";
	this.m_diagnosisGroup = 0.0;

	//Question data
	this.m_parentEntityId = 0.0;
	this.m_parentEntityName = "";
}

StructureQuestion.prototype = new MultiStructureTermGroup();
StructureQuestion.prototype.constructor = MultiStructureTermGroup;

/**
 * Sets the parent entity id of the structure question.
 * @param {number} parentEntityId - The parent entity id of the structure question.
 * @returns {StructureQuestion} Returns self to allow chaining.
 */
StructureQuestion.prototype.setParentEntityId = function(parentEntityId) {
	if(typeof parentEntityId !== "number") {
		throw new Error("StructureQuestion.prototype.setParentEntityId expects a number.");
	}
	this.m_parentEntityId = parentEntityId;
	return this;
};

/**
 * Sets the parent entity name of the structure question.
 * @param {string} parentEntityName - The parent entity name of the structure question.
 * @returns {StructureQuestion} Returns self to allow chaining.
 */
StructureQuestion.prototype.setParentEntityName = function(parentEntityName) {
	if(typeof parentEntityName !== "string") {
		throw new Error("StructureQuestion.prototype.setParentEntityName expects a string.");
	}
	this.m_parentEntityName = parentEntityName;
	return this;
};

/**
 * Retrieves the structure question parent entity id.
 * @returns {number} The structure question parent entity id.
 */
StructureQuestion.prototype.getParentEntityId = function() {
	return this.m_parentEntityId;
};

/**
 * Retrieves the structure question parent entity name.
 * @returns {string} The structure question parent entity name.
 */
StructureQuestion.prototype.getParentEntityName = function() {
	return this.m_parentEntityName;
};

/**
 * Sets the question display.
 * @param {string} questionDisplay - The question display.
 * @returns {StructureQuestion} Returns self to allow chaining.
 */
StructureQuestion.prototype.setQuestionDisplay = function(questionDisplay) {
	if(typeof questionDisplay !== "string") {
		throw new Error("StructureQuestion.prototype.setQuestionDisplay expects a string.");
	}
	this.m_questionDisplay = questionDisplay;
	return this;
};

/**
 * Sets the diagnosis group for the structure question.
 * @param {number} diagnosisGroup - The (double) diagnosis group value.
 * @returns {StructureQuestion} Returns self to allow chaining.
 */
StructureQuestion.prototype.setDiagnosisGroup = function(diagnosisGroup) {
	if(typeof diagnosisGroup !== "number") {
		throw new Error("StructureQuestion.prototype.setDiagnosisGroup expects a number.");
	}
	this.m_diagnosisGroup = diagnosisGroup;
	return this;
};

/**
 * Renders the StructureQuestion out as an HTML string.
 * @param {StructureHtml} structureHtml - The packaged HTML passed through the recursive rendering.
 * @param {boolean} shouldRenderColumns - Unused boolean determining if the node should render columns.
 */
StructureQuestion.prototype.render = function(structureHtml, shouldRenderColumns) {
	structureHtml.append("<div class='structure-question' data-lookup='"+this.m_id+"'>");
	structureHtml.append("<div>" + this.m_questionDisplay + "</div>");
	this.renderChildren(structureHtml, false);
	structureHtml.append("</div>");
};

/**
 * The StructureAnswer class.
 * This represents an answer to a StructureQuestion. A StructureAnswer always has two states: undocumented (null)
 * and documented (true). The default state is undocumented.
 * @returns {StructureAnswer} Returns self to allow chaining.
 * @constructor
 */
function StructureAnswer() {
	this.m_answerDisplay = "";
	this.m_templateId = 0.0;
	this.addState(new TermState().setValue(null).setCSSClass(""));
	this.addState(new TermState().setValue(true).setCSSClass("structure-answer-yes"));
	this.setInitialState(this.m_states[0]);
	this.m_state = this.m_states[0];
	return this;
}
StructureAnswer.prototype = new CycleStructureTerm();
StructureAnswer.prototype.constructor = CycleStructureTerm;

/**
 * Sets tha id of the answer, this id must be unique.
 * @param {number} templateId - The id of the answer.
 * @returns {StructureAnswer} Returns self to allow chaining.
 */
StructureAnswer.prototype.setTemplateId = function(templateId) {
	if(typeof templateId !== "number") {
		throw new Error("StructureAnswer.prototype.setAnswerId expects a number.");
	}
	this.m_templateId = templateId;
	return this;
};

/**
 * Retrieves the answer template id.
 * @returns {number} The answer template id.
 */
StructureAnswer.prototype.getTemplateId = function() {
	return this.m_templateId;
};

/**
 * Returns the root rendered HTML element of a single structure answer.
 * @returns {jQuery|HTMLElement} The root HTML element of the structure answer.
 */
StructureAnswer.prototype.getRootElement = function() {
	if(!this.m_rootElement || !this.m_rootElement.length) {
		this.m_rootElement = $("#" + this.m_namespace + "Answer" + this.m_id);
	}
	return this.m_rootElement;
};

/**
 * Handles the refresh of the structure answer.
 */
StructureAnswer.prototype.refresh = function() {
	if(this.m_state !== this.m_previousState) {
		this.getRootElement().removeClass(this.m_previousState.getCSSClass()).addClass(this.m_state.getCSSClass());
	}
};

/**
 * Sets the answer display of the StructureAnswer.
 * @param {string} answerDisplay - The answer disaplay.
 * @returns {StructureAnswer} Returns self to allow chaining.
 */
StructureAnswer.prototype.setAnswerDisplay = function(answerDisplay) {
	if(typeof answerDisplay !== "string") {
		throw new Error("");
	}
	this.m_answerDisplay = answerDisplay;
	return this;
};

/**
 * Renders the StructureAnswer as an HTML string.
 * @param {StructureHtml} structureHtml - The packaged HTML passed through the recursive rendering.
 * @param {boolean} shouldRenderColumns - Unused boolean determining if the node should render columns.
 */
StructureAnswer.prototype.render = function(structureHtml, shouldRenderColumns) {
	structureHtml.append(
		"<div id='"+this.m_namespace +"Answer"+this.m_id+"' class='structure-answer' data-lookup='"+this.m_id+"'>" +
			"<input class='structure-answer-box' type='checkbox' data-lookup='"+this.m_id+"'>"+
			"<span class='structure-answer-display' data-lookup='" + this.m_id + "'>" + this.m_answerDisplay + "</span>"+
		"</div>"
	);
};


/**
 * StructureTermController
 * This class represents the base interface for a StructureTermController. It simply encapsulates the necessary
 * event attachment which allows for StructureTerms to behave correctly.
 * @constructor
 */
function StructureTermController() {
}

/**
 * This is an interface method in which you will attach events to the root of the organizer.
 * @param organizer the organizer for which you are attaching the events.
 */
StructureTermController.prototype.attach = function(organizer) {
    throw new Error("Attempted to call StructureTermController.prototype.attach, method must be implemented by sub-class");
};

/**
 * InputStructureTermController
 * This is the controller for the InputStructureTerm object. It attaches and handles event delegation
 * for input terms.
 * @constructor
 */
function InputStructureTermController() {
}
InputStructureTermController.prototype = new StructureTermController();
InputStructureTermController.prototype.constructor = StructureTermController;

/**
 * Overrides the base attach method. This will attach both a keyup and a click event to the inputs in order to handle
 * user interaction with them.
 * @param {StructureOrganizer} organizer - The StructureOrganizer for which the events will be attached.
 */
InputStructureTermController.prototype.attach = function(organizer) {
    //Cache the root object since we're going to call it twice.
    var organizerRoot = organizer.getRootElement();
    //Handle keyup events on input terms
    organizerRoot.on("keyup", "div.input-term input", function(){
        //Grab the term from the organizer lookup table
        var term = organizer.getLookup()[organizer.parseIdForLookup($(this).attr("id"))];
        //Store the current text value on the term
        term.setCurrentValue($(this).val());
        //Update the term (may have a visual update as well)
        term.update();
    });
    //Handle click events on the input terms.
    organizerRoot.on("click", "div.input-term input", function(){
        //Grab the term from the organizer lookup table
        var term = organizer.getLookup()[organizer.parseIdForLookup($(this).attr("id"))];
        //If there is nothing in the text field, do nothing
        if(!$(this).val()) {
            return;
        }
        term.update();
    });
};

/**
 * CycleStructureTermController
 * This is the controller for the CycleStructureTerm object. It attaches and handles event delegation for any
 * CycleStructureTerm objects.
 * @constructor
 */
function CycleStructureTermController(){
}
CycleStructureTermController.prototype = new StructureTermController();
CycleStructureTermController.prototype.constructor = StructureTermController;

/**
 * Overrides the base attach method. This will attach an event delegate for clicking on CycleStructureTerm elements. When
 * the event is triggered, cycleState will be called on the associated CycleStructureTerm object.
 * @param {StructureOrganizer} organizer - The StructureOrganizer for which the events will be attached.
 */
CycleStructureTermController.prototype.attach = function(organizer) {
	var rootElement = organizer.getRootElement();
	//Handle click events on cycle structure terms.
	rootElement.on("click", "div.cycle-term >.structure-documented-icon-area, div.cycle-term >.structure-term-info-wrapper", function(event) {
		// ignore click events originating from comment icon
		if ($(event.target).hasClass('structure-comment')) {
			return;
		}
		//Grab the term from the lookup table
		var term = organizer.getLookup()[organizer.parseIdForLookup($(this).closest(".structure-term-item").attr("id"))];
		//Cycle the state of the term
		term.cycleState();
		var termContainer = $(this).closest(".structure-term-item");
		//display/create the comments section if term has comment.
		if (term.getComment()) {
			// checking if the comment section is already available for the term. 
			var commentSection = $(this).siblings("div.structure-term-comment-wrapper");
			termContainer.addClass("comment");		
			if (commentSection.length < 1) {
				commentSection = "<div class='structure-term-comment-wrapper'>" + term.buildTextArea() + "</div>";
				termContainer.append(commentSection);
			}				
		} else {
			termContainer.removeClass("comment");	
		}	
	});
	//Handles the click event on structure comment icon
	rootElement.on("click", "span.structure-comment", function(event) {
		var termInfoSection = $(this).closest(".structure-term-info-wrapper");
		var commentSection = $(termInfoSection).siblings("div.structure-term-comment-wrapper");
		var termContainer = $(this).closest(".structure-term-item");
		termContainer.addClass("comment");
		// builds comment section if it is not available for the particular term
		if (commentSection.length < 1) {
			// create new comment section
			var term = organizer.getLookup()[organizer.parseIdForLookup($(this).closest(".structure-term-item").attr("id"))];
			commentSection = "<div class='structure-term-comment-wrapper'>" + term.buildTextArea() + "</div>";
			termContainer.append(commentSection);
		}
		//setting on focus to the comment section text area
		$(termContainer).find('textarea')[0].focus();		
		});
	//Handles the focus out event on text area of the comment section
	rootElement.on("focusout", "div.structure-term-comment-wrapper", function(event) {
		var term = organizer.getLookup()[organizer.parseIdForLookup($(this).closest(".structure-term-item").attr("id"))];
		var comment = $(this).find("textarea").val();
		var termContainer = $(this).closest(".structure-term-item");
		//check if the text input is empty, if empty then hide the comment section by removing comment class, if it has a value set it to the concern term(AMI)
		if (comment === "") {
			termContainer.removeClass("comment");			
		}
		// setting comment to the term 
		term.setComment(comment);
		// notify the term as dirty to enable the save button
		if (!term.checkIsDirty()) {
			if (term.getComment() !== term.getSavedComment()) {
				term.m_dirty = true;
				term.notifyDirty(term);
			} else {
				term.m_dirty = false;
				term.notifyDirty(term);
			}
		}
	});
}; 

/**
 * YesNoStructureTermController
 * This is the controller for the YesNoStructureTerm object. It attaches and handles event delegation for any
 * YesNoStructureTerm objects.
 * @constructor
 */
function YesNoStructureTermController(){
}
YesNoStructureTermController.prototype = new StructureTermController();
YesNoStructureTermController.prototype.constructor = StructureTermController;

/**
 * Overrides the base attach method. This will attach an event delegate for clicking the 'Y' and 'N' on
 * YesNoStructureTerm elements. This allows users to quickly jump from a 'Y' and 'N' state without having to rely
 * on cycling the state.
 * @param {StructureOrganizer} organizer - The StructureOrganizer for which the events will be attached.
 */
YesNoStructureTermController.prototype.attach = function(organizer) {
	organizer.getRootElement().on("click", "div.structure-yes, div.structure-no", function(event) {
		//Grab the term from the lookup table
		var term = organizer.getLookup()[organizer.parseIdForLookup($(this).attr("id"))];
		//Cycle the state of the term
		var parent = term.getParent();
		var noneTerm = parent.getChildren()[0];
		
		if(NoneStructureTerm.prototype.isPrototypeOf(noneTerm) && noneTerm === term){
			noneTerm.jumpToState(0);
		}
		var jumpTo = $(this).hasClass("structure-yes") ? 1 : 2;
		var current = term.getCurrentState();
		term.jumpToState(jumpTo === current ? 0 : jumpTo);
		var termContainer = $(this).closest(".structure-term-item");
		if (term.getComment()) {
			//create or display the comments sections if the term has comment
			var commentSection = $(this).siblings("div.structure-term-comment-wrapper");
			//add class comment to display the comment section			
			termContainer.addClass("comment");
			// builds comment section if it is not available for the particular term
			if (commentSection.length < 1) {
				commentSection = "<div class='structure-term-comment-wrapper'>" + term.buildTextArea() + "</div>";
				termContainer.append(commentSection);
			}
		} else {
			termContainer.removeClass("comment");	
		}	
	});
};

/**
 * StructureGroupController
 * This is the controller for the StructureGroup object. It attaches and handles event delegation for any
 * StructureGroup objects.
 * @constructor
 */
function StructureGroupController(){
}
StructureGroupController.prototype = new StructureTermController();
StructureGroupController.prototype.constructor = StructureTermController;

/**
 * Overrides the base attach method. This will attach an event delegate for clicking the toggle controls on
 * StructureGroup elements.
 * @param {StructureOrganizer} organizer - The StructureOrganizer for which the events will be attached.
 */
StructureGroupController.prototype.attach = function(organizer){
    organizer.getRootElement().on("click", ".structure-component-toggle, .structure-component-toggle + .structure-group-title", function(event){
        var group = $(this).parents(".structure-group").first();
        var groupNode = organizer.getLookup()[organizer.parseIdForLookup($(group).attr("id"))];
		groupNode.toggleExpand();
    });
};

/**
 * TableTermConstructor
 * This is the controller for the TableStructureTerm object. It attaches and handles event delegation for any
 * TableStructureTerm objects.
 * @constructor
 */
function TableTermController(){
}
TableTermController.prototype = new StructureTermController();
TableTermController.prototype.constructor = StructureTermController;

/**
 * Overrides the base attach method. This will attach an event delegate for clicking on TableStructureTerm elements. When
 * the event is triggered, cycleState will be called on the associated TableStructureTerm object.
 * @param {StructureOrganizer} organizer - The StructureOrganizer for which the events will be attached.
 */
TableTermController.prototype.attach = function(organizer) {
	var rootElement = organizer.getRootElement();
	//Handle click events on cycle structure terms.
	rootElement.on("click", "div.table-term >.structure-documented-icon-area", function(event) {
		//Grab the term from the lookup table
		var term = organizer.getLookup()[organizer.parseIdForLookup($(this).closest(".table-term").attr("id"))];
		//Cycle the state of the term
		term.cycleState();
	});

}; 
/**
 * The StructureTabControll class.
 * This will handle attaching events for structured documentation tabs. This occurs when there are subsections
 * present in a section.
 * @constructor
 */
function StructureTabController() {
	this.m_scrollMap = {};
	this.m_organizer = null;

	this.m_$structureTabGroup = null;
	this.m_$structureTabParent = null;
	this.m_$structureTabWrapper = null;
	this.m_$structureTabMenuButton = null;
}

StructureTabController.prototype = new StructureTermController();
StructureTabController.prototype.constructor = StructureTermController;

/**
 * Retrieves the tab group jQuery element.
 * @returns {jQuery} The tab group jQuery element.
 */
StructureTabController.prototype.getStructureTabGroup = function () {
	if (!this.m_$structureTabGroup || !this.m_$structureTabGroup.length) {
		this.m_$structureTabGroup = $("#" + this.m_organizer.getNamespace() + "StructureTabGroup");
	}
	return this.m_$structureTabGroup;
};

/**
 * Retrieves the tab parent jQuery element.
 * @returns {jQuery} The tab parent element.
 */
StructureTabController.prototype.getStructureTabParent = function () {
	if (!this.m_$structureTabParent || !this.m_$structureTabParent.length) {
		this.m_$structureTabParent = $("#" + this.m_organizer.getNamespace() + "StructureTabParent");
	}
	return this.m_$structureTabParent;
};

/**
 * Retrieves the tab wrapper jQuery element.
 * @returns {jQuery} The tab group wrapper element.
 */
StructureTabController.prototype.getStructureTabWrapper = function () {
	if (!this.m_$structureTabWrapper || !this.m_$structureTabWrapper.length) {
		this.m_$structureTabWrapper = $("#" + this.m_organizer.getNamespace() + "StructureTabGroupWrapper");
	}
	return this.m_$structureTabWrapper;
};

/**
 * Retrieves the structure tab menu button jQuery element.
 * @returns {jQuery} The structure tab menu button jQuery element.
 */
StructureTabController.prototype.getStructureTabMenuButton = function () {
	if (!this.m_$structureTabMenuButton || !this.m_$structureTabMenuButton.length) {
		this.m_$structureTabMenuButton = $("#" + this.m_organizer.getNamespace() + "StructureTabMenuButton");
	}
	return this.m_$structureTabMenuButton;
};

/**
 * Resize function to handle hiding/showing the tab menu icon.
 */
StructureTabController.prototype.resize = function () {
	var $structureTabParent = this.getStructureTabParent();
	var $structureTabWrapper = this.getStructureTabWrapper();
	var structureTabWrapperRaw = $structureTabWrapper[0];
	var $structureTabMenuButton = this.getStructureTabMenuButton();
	var miscPadding = 8;
	structureTabWrapperRaw.style.width = (($structureTabParent[0].offsetWidth - $structureTabMenuButton[0].offsetWidth) - miscPadding) + "px";
};

/**
 * Disables the active tab.
 * @param {StructureOrganizer} organizer - The organizer to which this controller is bound.
 * @param {jQuery} $activeTab - The active tab jQuery element.
 */
StructureTabController.prototype.disableActiveTab = function (organizer, $activeTab) {
	$activeTab.removeClass("structure-tab-active");
	var activeNode = organizer.getLookup()[$activeTab.attr("data-lookup")];
	//If we find the active node, find the closest tab contents (a direct ancestor to the node's root element) and hide it.
	if (activeNode) {
		//Remember the scroll position so it can be restored later
		this.m_scrollMap[activeNode.getId()] = activeNode.getContentElement().scrollTop();
		activeNode.getRootElement().closest(".structure-tab-content").hide();
	}
};

/**
 * Restores the scroll position for the specified node. This is expected to be a StructureOrganizer (section) node.
 * @param {StructureOrganizer} node - The node for which the scroll position is to be restored.
 */
StructureTabController.prototype.restoreScrollPosition = function (node) {
	var scrollTop = this.m_scrollMap[node.getId()];
	//If the scroll-top has not been stored for the node, just return.
	if (typeof scrollTop === "undefined") {
		return;
	}
	node.getContentElement().scrollTop(scrollTop);
};

/**
 * Overrides the attach function in the base StructureTermController class.
 * @param {StructureOrganizer} organizer - The organizer object which is considered the root of the structured
 * documentation tree.
 */
StructureTabController.prototype.attach = function (organizer) {
	this.m_organizer = organizer;
	var namespace = organizer.getNamespace();
	var menuItem = null;
	var $structureTabGroup = $("#" + namespace + "StructureTabGroup");
	var $structureTabs = $structureTabGroup.find(".structure-tab-display");
	var $structureTabWrapper = this.getStructureTabWrapper();
	var previousSelection = null;
	var self = this;
	var tabSelectionMenu = null;
	var menuItemArray = null;
	var selectedTabIndex = 0;
	var $contentBody = organizer.getRootElement().closest(".structured-documentation-view");
	var miscPadding = 8;

	//Make sure to resize up-front.
	this.resize();

	//This function is used when an element is selected in the component selection menu.
	var createSelectionFunc = function (index) {
		return function () {
			var $selectedTab = $structureTabs.eq(index);
			$selectedTab.click();

			var tabPosition = $selectedTab.closest(".structure-tab").position().left + $structureTabWrapper.scrollLeft();
			$structureTabWrapper.scrollLeft(tabPosition - miscPadding);
		};
	};
	//Attach a click event for the structure tabs.
	organizer.getRootElement().on("click", ".structure-tab-group .structure-tab .structure-tab-display", function (event) {
		var node = organizer.getLookup()[$(this).attr("data-lookup")];
		if (!node) {
			return;
		}
		if(node === organizer.getActiveSection()) {
			return;
		}
		//Prevent overflow when switching tabs (it will create a scrollbar on the right and throw off widths)
		$contentBody.css("overflow-y", "hidden");
		//If the section has not been rendered (lazy rendering of tabs)
		if(!node.isRendered()) {
			var $tabContentContainer = $("#" + namespace + "\\:tabContent\\:" + node.getId());
			$tabContentContainer.html(node.renderHtml());
			node.finalize();
			node.setIsRendered(true);
			node.getParent().resize();
		}
		//Show the content of the selected tab
		node.getRootElement().closest(".structure-tab-content").show();
		//Disable the currently active tab.
		self.disableActiveTab(organizer, $structureTabGroup.find(".structure-tab-active"));

		$(this).addClass("structure-tab-active");

		//The height adjustment can become invalid when switching views and resizing, so adjust.
		node.adjustContentHeight();

		//Store off the active section.
		organizer.setActiveSection(node);

		//Attempt to restore the scroll position.
		self.restoreScrollPosition(node);

		//Find the tab in the menu and make sure it is selected.
		selectedTabIndex = $(this).closest(".structure-tab").index();

		//Check that the menu and menu items exist (user may switch tabs before loading the menu).
		if(tabSelectionMenu && menuItemArray) {
			menuItemArray[selectedTabIndex].setIsSelected(true);
			if(previousSelection) {
				previousSelection.setIsSelected(false);
			}
			previousSelection = menuItemArray[selectedTabIndex];
		}
		$contentBody.css("overflow-y", "auto");
	});
	//Attach the click event for the extra tab menu. On first click, the menu will be created.
	organizer.getRootElement().on("click", ".structure-add-tab", function (event) {
		tabSelectionMenu = MP_MenuManager.getMenuObject(namespace + "structureAddTab");
		//Make sure this is a fresh menu. The organizer may have added children, so we cannot cache the menu.
		if(tabSelectionMenu) {
			MP_MenuManager.deleteMenuObject(namespace + "structureAddTab");
		}
		tabSelectionMenu = new Menu(namespace + "structureAddTab");
		tabSelectionMenu.setTypeClass("menu-page-menu structure-tab-menu");
		tabSelectionMenu.setIsRootMenu(true);
		tabSelectionMenu.setAnchorElementId(namespace + "StructureTabMenuButton");
		tabSelectionMenu.setAnchorConnectionCorner(["bottom", "right"]);
		tabSelectionMenu.setContentConnectionCorner(["top", "right"]);
		tabSelectionMenu.setLabel("");

		var children = organizer.getChildren();
		var childrenCount = children.length;
		var child = null;
		for (var i = 0; i < childrenCount; i++) {
			child = children[i];
			menuItem = new MenuSelection(namespace + "structureSectionTab" + child.getId());
			menuItem.setLabel(child.getTitle());
			menuItem.setCloseOnClick(true);
			menuItem.setClickFunction(createSelectionFunc(i));
			//Default the selected menu item to the tab that is currently selected.
			if(i === selectedTabIndex) {
				menuItem.setIsSelected(true);
				previousSelection = menuItem;
			}
			tabSelectionMenu.addMenuItem(menuItem);
		}
		//Keep reference to the array of menu items.
		menuItemArray = tabSelectionMenu.getMenuItemArray();
		MP_MenuManager.addMenuObject(tabSelectionMenu);
		MP_MenuManager.showMenu(namespace + "structureAddTab");
	});
};/**
 * StructureTermGroupController
 * This class represents the base interface for a StructureTermGroupController. It simply encapsulates the necessary
 * event attachment which allows for StructureTermGroups to behave correctly.
 * @constructor
 */
function StructureTermGroupController() {
}

/**
 * This is an interface method in which you will attach events to the root of the organizer.
 * @param {StructureOrganizer} organizer the organizer for which you are attaching the events.
 */
StructureTermGroupController.prototype.attach = function(organizer) {
	var organizerRoot = organizer.getRootElement();
	//Handle click event on Show More/Show Less link
	organizerRoot.on("click", "a.show-more-link", function(){
		var $sourceTermGroup = $(this).closest(".structure-group");
		var termGroup = organizer.getLookup()[organizer.parseIdForLookup($sourceTermGroup.attr("id"))];
		termGroup.toggleShowMore();
	});
};function StructureManager() {
	//JSON data
	this.m_replyData = null;
	this.m_referenceData = null;
	this.m_activityData = null;
	this.m_questionData = null;
	this.m_status = "";

	//Structure objects
	this.m_organizer = null;
	this.m_resizeFunction = null;
	this.m_tabController = null;
	this.m_questionSet = null;
	this.m_openExistingCheckFunction = null;
	this.m_answers = null;
	this.m_openExistingFunction = null;
	this.m_queryTemplateFunction = null;
	this.m_onDirtyChangeCallback = null;

	//Element cache
	this.m_$structureManagerContainer = null;
	this.m_$structureContainer = null;
	this.m_$structureOrganizerContents = null;
	this.m_$questionContainer = null;
	this.m_$questionContents = null;
	this.m_$messageContainer = null;
	this.m_$addTemplateButton = null;

	this.m_namespace = "";
}

/**
 * Sets the namespace of the structured documentation manager. This will provide unique DOM ids for any generated
 * elements.
 * @param {string} namespace - The namespace for all generated DOM elements.
 * @returns {StructureManager} Returns self to allow chaining.
 */
StructureManager.prototype.setNamespace = function(namespace) {
	if(typeof namespace !== "string") {
		throw new Error("StructureManager.prototype.setNamespace expects a string.");
	}
	this.m_namespace = namespace;
	return this;
};

/**
 * Sets the dirty change callback function that is triggered when the structure organizer is considered dirty.
 * @param {function} dirtyChangeCallback - The callback function to be triggered when the structured documentation
 * content changes dirty state.
 * @returns {StructureManager} Returns self to allow chaining.
 */
StructureManager.prototype.setOnDirtyChangeCallback = function(dirtyChangeCallback) {
	if(typeof dirtyChangeCallback !== "function") {
		throw new Error("StructureManager.prototype.setOnDirtyChangeCallback expects a function.");
	}
	this.m_onDirtyChangeCallback = dirtyChangeCallback;
	return this;
};

/**
 * Sets the callback function which is expected to perform the open existing operation. This will flex depending on the
 * consumer of the artifact.
 * @param {function} openExistingFunction - The provided callback function which is expected to perform the open
 * existing operation. This function must be of the form...
 * exampleManager.setOpenExistingFunction(function(structureData, postOpenCallback){
 * 		//Perform open existing operation
 * 		//After open existing operation, call callback with response data...
 * });
 * The consumer must call the postQueryCallback function with the following information...
 * postOpenCallback({
 * 		"status" : "S/F/Z",
 * 		"section_ref" : [...]
 * 		"section_act" : [...],
 * 		"user_options" : [...]
 * });
 * @returns {StructureManager} Returns self to allow chaining.
 */
StructureManager.prototype.setOpenExistingFunction = function(openExistingFunction) {
	if(typeof openExistingFunction !== "function") {
		throw new Error("StructureManager.prototype.setOpenExistingFunction expects a function.");
	}
	this.m_openExistingFunction = openExistingFunction;
	return this;
};

/**
 * Sets the callback function which is expected to perform the query template operation. This will flex depending on the
 * consumer of the artifact.
 * @param {function} queryTemplateFunction - The provided callback function which is expected to perform the query
 * template operation. This function must be of the form...
 * exampleManager.setQueryTemplateFunction(function(structureData, postQueryCallback){
 * 		//Perform query template operation
 * 		//After query template operation, call callback with response data...
 * });
 * The consumer must call the postQueryCallback function with the following information...
 * postQueryCallback({
 * 		"status" : "S/F/Z",
 * 		"section_ref" : [...]
 * 		"section_act" : [...],
 * 		"user_options" : [...]
 * });
 * @returns {StructureManager} Returns self to allow chaining.
 */
StructureManager.prototype.setQueryTemplateFunction = function(queryTemplateFunction) {
	if(typeof queryTemplateFunction !== "function") {
		throw new Error("StructureManager.prototype.setQueryTemplateFunction expects a function.");
	}
	this.m_queryTemplateFunction = queryTemplateFunction;
	return this;
};

/**
 * Sets the callback function which is expected to determine if the StructureManager needs to perform the open existing
 * operation. If this function returns true, the manager will open-existing on refresh, otherwise it will perform the
 * query template operation.
 * @param {function} openExistingCheckFunction - The callback function which will determine if the manager should perform
 * the open existing or query template operation. It must be of the form...
 * manager.setOpenExistingCheckFunction(function(){
 * 		//Perform necessary checks to determine if open existing should be performed.
 * 		return true/false;
 * });
 * @returns {StructureManager} Returns self to allow chaining.
 */
StructureManager.prototype.setOpenExistingCheckFunction = function(openExistingCheckFunction) {
	if(typeof openExistingCheckFunction !== "function") {
		throw new Error("StructureManager.prototype.setOpenExistingCheckFunction expects a function.");
	}
	this.m_openExistingCheckFunction = openExistingCheckFunction;
	return this;
};

/**
 * Sets the resize function which is passed to the m_organizer object (when built).
 * @param resizeFunction
 * @returns {StructureManager}
 */
StructureManager.prototype.setOrganizerResizeFunction = function(resizeFunction) {
	if(typeof resizeFunction !== "function") {
		throw new Error("StructureManager.prototype.setResizeFunction expects a function");
	}
	this.m_resizeFunction = resizeFunction;
	return this;
};

/**
 * Resizes structured documentation. First calls resize on the organizer then subsequently resizes
 * the tab controller if there is one.
 */
StructureManager.prototype.resize = function() {
	var self = this;
	setTimeout(function(){
		if(self.m_organizer) {
			self.m_organizer.resize();
		}
		if(self.m_tabController) {
			self.m_tabController.resize();
		}
	}, 100);
};

/**
 * Handles the event when the user clicks the Add Template(s) button. This will obtain and store the set of answers that
 * the user chose from the question set and make a call to refresh the structure manager.
 */
StructureManager.prototype.onAddTemplateClick = function() {
	this.m_$addTemplateButton.prop("disabled", true);
	this.m_answers = this.m_questionSet.getAnswers();
	this.completeRefresh();
};

/**
 * Determines if structured documentation should make a call to open existing structured content or not. This
 * relies on the m_openExistingCheckFunction which is provided by the consumer of this artifact. The aforementioned
 * callback function must return a boolean indicating true or false.
 * @returns {boolean} True if the callback function indicates, otherwise false.
 */
StructureManager.prototype.shouldOpenExisting = function() {
	if(!this.m_openExistingCheckFunction) {
		throw new Error("StructureManager.prototype.shouldOpenExisting function expects you to have set an open existing check function.");
	}
	return this.m_openExistingCheckFunction();
};

/**
 * Performs a complete refresh of the structured documentation. It will either make the call to open existing or
 * query template.
 */
StructureManager.prototype.completeRefresh = function() {
	this.resetReplyData();
	if(this.shouldOpenExisting()) {
		this.openExisting();
	} else {
		this.queryTemplate();
	}
};

/**
 * This renders the shell of the structure manager.
 * @returns {*|jQuery|HTMLElement} The structure manager shell.
 */
StructureManager.prototype.render = function() {
	var self = this;
	var namespace = this.m_namespace;

	//Wrapper
	var $structureView = $("<div id='" + namespace +"StructureView' class='structured-documentation-view content-body'></div>");
	this.m_$structureManagerContainer = $structureView;

	//Questions
	var $questionContainer = $("<div id='" + namespace + "QuestionContainer' class='structure-question-container'></div>").hide();
	this.m_$questionContainer = $questionContainer;
	var $addTemplateButton = $("<button id='" + namespace + "AddTemplateButton' class='structure-add-template-btn' disabled>Add Template(s)</button>");
	$addTemplateButton.click(function(){
		self.onAddTemplateClick();
	});
	this.m_$addTemplateButton = $addTemplateButton;
	$questionContainer.append($addTemplateButton);
	$questionContainer.append($("<div class='structure-question-info-icon'></div>"));
	var $questionContents = $("<div id='" + namespace + "QuestionContents' class='structure-question-contents'></div>");
	$questionContainer.append($questionContents);
	this.m_$questionContents = $questionContents;
	$structureView.append($questionContainer);

	//Structure Organizer
	//The structure content container, structure content is injected here.
	var $structureContainer = $("<div id='" + namespace + "StructureContainer'></div>").hide();
	this.m_$structureContainer = $structureContainer;

	var $structureOrganizerContents = $("<div id='" + namespace + "StructureOrganizerContents'></div>");
	this.m_$structureOrganizerContents = $structureOrganizerContents;
	$structureContainer.append($structureOrganizerContents);

	$structureView.append($structureContainer);

	//Message
	var $messageContainer = $("<div id='" + namespace + "StructureMessageContainer'></div>").hide();
	this.m_$messageContainer = $messageContainer;
	$structureView.append($messageContainer);

	//Perform initial render based on the reply data we were supplied.
	if(this.m_status !== "S") {
		this.showStructureErrorMessage(i18n.discernabu.documentation_base.STRUCTURED_DOC_UNAVAILABLE);
		return $structureView;
	}
	if(this.hasQuestions()) {
		this.showQuestions();
	} else if(this.hasStructuredContent()) {
		this.showStructure();
	} else {
		this.showStructureErrorMessage(i18n.discernabu.documentation_base.STRUCTURED_TEMPLATES_NOT_FOUND);
	}
	return $structureView;
};

/**
 * Renders the structured content into the specified element.
 * @param {jQuery} $destinationElement - The element into which structure shall be rendered.
 */
StructureManager.prototype.renderInto = function($destinationElement) {
	$destinationElement.append(this.render());
	this.attachQuestionDelegates();
	this.mergeActivity();
	this.finalizeStructure();
};

/**
 * This function attaches the necessary question delegates. This currently attaches events for
 * clicking on the checkbox or the title of an answer.
 */
StructureManager.prototype.attachQuestionDelegates = function() {
	var self = this;
	//Attach the delegate for answering questions.
	this.m_$questionContainer.on("change", ".structure-answer-box", function(event){
		var nodeId = $(this).attr("data-lookup");
		var node = self.m_questionSet.getLookup()[nodeId];
		if(!node) {
			logger.logWarning("StructureDocumentationView.prototype.finalizeQuestions: could not find answer node with id = " + nodeId);
			return;
		}
		node.cycleState();
	});
	//Attach a delegate for clicking on the answer display which will trigger the click event on the checkbox.
	this.m_$questionContainer.on("click", ".structure-answer-display", function(event){
		var nodeId = $(this).attr("data-lookup");
		var node = self.m_questionSet.getLookup()[nodeId];
		if(!node) {
			logger.logWarning("StructureDocumentationView.prototype.finalizeQuestions: could not find answer node with id = " + nodeId);
			return;
		}
		node.cycleState();
		//Now ensure that the checkbox is updated according to the state of the answer.
		$(this).siblings(".structure-answer-box").prop("checked", (node.getState().getValue() ? true : false));
	});
};

/**
 * This function refresh the structure manager. This must only be called post-render, in other words, structure has
 * already been shown and is being refreshed.
 */
StructureManager.prototype.refresh = function() {
	if(this.m_status !== "S") {
		this.m_$structureContainer.hide();
		this.m_$questionContainer.hide();
		this.showStructureErrorMessage(i18n.discernabu.documentation_base.STRUCTURED_DOC_UNAVAILABLE);
		return;
	}
	if(this.hasQuestions()) {
		this.m_$structureContainer.hide();
		this.m_$messageContainer.hide();
		this.showQuestions();
	} else if(this.hasStructuredContent()) {
		this.m_$questionContainer.hide();
		this.m_$messageContainer.hide();
		this.showStructure();
		this.mergeActivity();
		this.finalizeStructure();
	} else {
		this.m_$structureContainer.hide();
		this.m_$questionContainer.hide();
		this.showStructureErrorMessage(i18n.discernabu.documentation_base.STRUCTURED_TEMPLATES_NOT_FOUND);
	}
};

/**
 * Wrapper call to navigate structured documentation to the specified node.
 * @param {Object} navigationData - The navigation data that is used to find a node within the structured
 * documentation tree and navigate to it.
 */
StructureManager.prototype.navigateToNode = function(navigationData) {
	if(!navigationData) {
		logger.logWarning("StructureManager.prototype.navigateToNode expects navigation data.");
		return;
	}
	if(!this.m_organizer) {
		logger.logWarning("StructureManager.prototype.navigateToNode: attempted to navigate to node without a structure organizer object.");
		return;
	}
	this.m_organizer.navigateToNode(navigationData);
};

/**
 * Attaches necessary controllers to the structure organizer as well as other customized events such as the dirty handler
 * and a resize function.
 */
StructureManager.prototype.finalizeStructure = function() {
	var organizer = this.m_organizer;
	if(!organizer) {
		return;
	}
	//Set the resize function on the organizer
	organizer.setResizeFunction(this.m_resizeFunction);
	//Set the dirty change callback.
	organizer.setOnDirtyChangeCallback(this.m_onDirtyChangeCallback);
	//Finalize the structure object.
	organizer.finalize();
	//Attach the interaction controllers.
	(new CycleStructureTermController()).attach(organizer);
	(new InputStructureTermController()).attach(organizer);
	(new StructureGroupController()).attach(organizer);
	(new YesNoStructureTermController()).attach(organizer);
	(new TableTermController()).attach(organizer);
	(new StructureTermGroupController()).attach(organizer);
	//Only attach the tab controller if it is a multi-section structure.
	if(organizer.isMultiSection()) {
		var tabController = new StructureTabController();
		tabController.attach(organizer);
		//Keep reference to the tab controller since it requires some resize logic later.
		this.m_tabController = tabController;
	}
};

/**
 * Simple check to determine if the data received from the server has provided reference data for structured documentation.
 * This should come back from the server in the form of section_ref[].
 * @returns {boolean} True if the data received contains structured reference data, otherwise false.
 */
StructureManager.prototype.hasStructuredContent = function() {
	return (this.m_referenceData !== null) && this.m_referenceData.length > 0;
};

/**
 * Determines if the data received from the server has provided question data. This should come back from the server
 * in the form of user_options: [].
 * @returns {boolean} True if the data received contains questions, otherwise false.
 */
StructureManager.prototype.hasQuestions = function() {
	return this.m_questionData !== null;
};

/**
 * Uses the JSONStructureOrganizerBuilder to build a set of questions.
 * @returns {StructureQuestionSet} A question set built from the question data received.
 */
StructureManager.prototype.generateQuestionSet = function() {
	var self = this;
	var questionData = this.m_questionData;
	this.m_questionSet = (new JSONStructureOrganizerBuilder().setNamespace(this.m_namespace)).buildQuestionSet(questionData);
	this.m_questionSet.setOnCompleteCallback(function(complete){
		self.m_$addTemplateButton.prop("disabled", !complete);
	});
	return this.m_questionSet;
};

/**
 * Helper function to attach necessary events.
 */
StructureManager.prototype.finalize = function() {
	this.finalizeStructure();
	this.attachQuestionDelegates();
};

/**
 * Shows the question container and injects the question set into the question contents wrapper. It also defaults the
 * add templates button to being disabled until the question set is considered complete.
 */
StructureManager.prototype.showQuestions = function() {
	var $questionContainer = this.m_$questionContainer;
	$questionContainer.show();
	//Generate the question set
	var questionSet = this.generateQuestionSet();
	this.m_$questionContents.html(questionSet.render());
	this.m_$addTemplateButton.prop("disabled", true);
};

/**
 * Shows the structure container and injects the structured documentation html into the contents wrapper. It first builds
 * the structure content based on the data retrieved from the server.
 */
StructureManager.prototype.showStructure = function() {
	this.m_$structureContainer.show();
	var $structureOrganizerContents = this.m_$structureOrganizerContents;
	var builder = new JSONStructureOrganizerBuilder();
	builder.setNamespace(this.m_namespace);
	builder.setStructureJSON(this.m_referenceData[0]);
	var organizer = builder.buildStructureTree();
	this.m_organizer = organizer;
	//Append the organizer html
	$structureOrganizerContents.html(organizer.renderHtml());
};

/**
 * Shows a structured documentation error message in the message container element.
 * @param {string} message - The message to be shown.
 */
StructureManager.prototype.showStructureErrorMessage = function(message) {
	this.m_$messageContainer.html(message);
	this.m_$messageContainer.show();
};


/**
 * Sets the reply information based on the data retrieval response. This data must be of the form...
 * {
 * 		"status" : "S/F/Z",
 * 		"section_ref" : [...],
 * 		"section_act" : {},
 		"user_options" : [...]
 * }
 * @param replyData - The information received from a call to retrieve structured documentation data. This information
 * can be retrieved by either query template or open existing.
 */
StructureManager.prototype.setReplyData = function(replyData) {
	this.setStatus(replyData.status || "F");
	this.setReferenceData(replyData.section_ref || null);
	this.setActivityData(replyData.section_act || null);
	if(replyData.user_options && replyData.user_options.length) {
		this.setQuestionData(replyData.user_options);
	} else {
		this.setQuestionData(null);
	}
};

/**
 * Simple passthrough function which calls resetDirty on the structure organizer.
 */
StructureManager.prototype.resetDirty = function() {
	if(this.m_organizer) {
		this.m_organizer.resetDirty();
	}
};

/**
 * Resets all of the service-retrieved field back to their defauls. Take note that the status is
 * defaulted to 'F', so failure is assumed until proven otherwise by the services that retrieve the
 * data.
 */
StructureManager.prototype.resetReplyData = function() {
	this.m_replyData = null;
	this.m_referenceData = null;
	this.m_activityData = null;
	this.m_questionData = null;
	this.m_status = "F";
};

/**
 * Sets the status of the service call to query template or open existing.
 * @param {string} status - The status of the service call. This is either successful, failure,
 * or a Z status.
 * @returns {StructureManager} Returns self to allow chaining.
 */
StructureManager.prototype.setStatus = function(status) {
	if(typeof status !== "string") {
		throw new Error("StructureManager.prototype.setStatus expects a string (S/F/Z)");
	}
	this.m_status = status;
	return this;
};

/**
 * Sets the reference data retrieved from the call to query template or open existing.
 * @param {Object} referenceData - The reference data (section_ref) retrieved from the service call
 * to open existing or query template.
 * @returns {StructureManager} returns self to allow chaining.
 */
StructureManager.prototype.setReferenceData = function(referenceData) {
	this.m_referenceData = referenceData;
	return this;
};

/**
 * Sets the activity data retrieved from the call to query template or open existing.
 * @param {Object} activityData - The activity data (section_act) retrieved from the service call
 * to open existing or query template.
 * @returns {StructureManager} Returns self to allow chaining.
 */
StructureManager.prototype.setActivityData = function(activityData) {
	this.m_activityData = activityData;
	return this;
};

/**
 * Sets the question data retrieved from the call to query template or open existing.
 * @param {Object} questionData - The user options (user_options) retrieved from the service call
 * to open existing or query template.
 * @returns {StructureManager} Returns self to allow chaining.
 */
StructureManager.prototype.setQuestionData = function(questionData) {
	this.m_questionData = questionData;
	return this;
};

/**
 * Handles merging activity data (section_act) into the pre-constructed structure tree. This function
 * will do nothing if there is no structure tree (structure organizer) or there is no activity data.
 */
StructureManager.prototype.mergeActivity = function() {
	if(!this.m_organizer || !this.m_activityData) {
		return;
	}
	var updater = new JSONStructureOrganizerBuilder();
	updater.update(this.m_organizer, this.m_activityData);
	this.resetDirty();
};

/**
 * Exposes a function for querying template in structured documentation. It is expected that the consumer has provided
 * the m_queryTemplateFunction which makes a call to query template and calls the callback with the response data.
 */
StructureManager.prototype.queryTemplate = function() {
	if(!this.m_queryTemplateFunction) {
		logger.logError("StructureManager.prototype.queryTemplate: No query template function provided.");
		return;
	}
	var self = this;
	var requestData = {
		"USER_OPTION_RESPONSES" : this.m_answers
	};
	this.m_queryTemplateFunction(requestData, function(reply){
		self.m_answers = null;
		self.setReplyData(reply);
		self.refresh();
	});
};

/**
 * Exposes a function for opening existing structured documentation sections. It is expected that the consumer has
 * provided the m_openExistingFunction which makes a call to open existing and calls the callback with the response
 * data.
 */
StructureManager.prototype.openExisting = function() {
	if(!this.m_openExistingFunction) {
		logger.logError("StructureManager.prototype.openExisting: No open existing function provided.");
		return;
	}
	var self = this;
	var requestData = {
		"USER_OPTION_RESPONSES" : this.m_answers
	};
	this.m_openExistingFunction(requestData, function(reply){
		self.m_answers = null;
		self.setReplyData(reply);
		self.refresh();
	});
};
/**
 * Base class for validators that validates input
 */
function InputValidator() {
}

InputValidator.prototype.validate = function (input) {
	return true;
};

InputValidator.prototype.getMessage = function () {
	return "";
};

/**
 * DataTypeValidator
 * This class is for validating specified data types. The supported data types are ALPHA,
 * NUMERIC. Depending on the data type, a specific regular expression will
 * be created.
 * @returns {DataTypeValidator}
 * @constructor
 */
function DataTypeValidator() {
	this.m_dataType = DataTypeValidator.ALPHA_TYPE;
	this.m_dataRegex = DataTypeValidator.ALPHA_REGEX;
	return this;
}

/**
 * The string constant that denotes an alpha data type
 * 
 * @constant {string}
 * @static
 */
DataTypeValidator.ALPHA_TYPE = "ALPHA";

/**
 * The regular expression regular expression for validating the alpha data type.
 * The alpha type consists of alphanumerics and symbols.
 * 
 * Allowed symbols: `~!@#$%^&*()_+-=,.<>?;:''"{}|\/[]
 * 
 * TODO: revisit to support other languages/regions
 * 
 * @constant {RegExp}
 * @static
 */
DataTypeValidator.ALPHA_REGEX = /^[a-zA-Z0-9 `~!@#$%^&*()_+-=,.<>?;:''"{}|\\\/\[\]]*$/;

/**
 * The string constant that denotes an numeric data type
 * 
 * TODO: revisit to support other languages/regions
 * 
 * @constant {string}
 * @static
 */
DataTypeValidator.NUMERIC_TYPE = "NUMERIC";

/**
 * The regular expression regular expression for validating the numeric data type.
 * The numeric type allows for positive and negative integers.
 *  
 * @constant {RegExp}
 * @static
 */
DataTypeValidator.NUMERIC_REGEX = /^[-]?[0-9]*[.]?[0-9]*$/;

/**
 * The string constant that denotes an alpha data type
 * 
 * @constant {string}
 * @static
 */
DataTypeValidator.prototype = new InputValidator();
DataTypeValidator.prototype.constructor = InputValidator;

/**
 * Gets the data type for this validator.
 * 
 * @returns {string} The data type for this validator
 */
DataTypeValidator.prototype.getDataType = function () {
	return this.m_dataType;
};

/**
 * Sets the data type for the DataTypeValidator. This data type will determine the regular
 * expression that is created.
 * 
 * @param {string} dataType - The data type that this DataTypeValidator should expect. This can
 * be "ALPHA" or "NUMERIC". The default is "ALPHA" values.
 * @returns {DataTypeValidator}
 */
DataTypeValidator.prototype.setDataType = function (dataType) {
	this.m_dataType = dataType;
	switch (dataType) {
		case DataTypeValidator.NUMERIC_TYPE:
			this.m_dataRegex = DataTypeValidator.NUMERIC_REGEX;
			break;
		// ALPH includes alphanumerics and it is the default as well
		case DataTypeValidator.ALPHA_TYPE:
		default:
			this.m_dataType = DataTypeValidator.ALPHA_TYPE;
			this.m_dataRegex = DataTypeValidator.ALPHA_REGEX;
	}
	return this;
};

/**
 * Overrides the base getMessage function. This generates a message informing
 * what values this validator expects.
 * @returns {string} The message explaining what types this validator accepts.
 */
DataTypeValidator.prototype.getMessage = function () {
	var message = '';
	
	switch (this.m_dataType) {
		case DataTypeValidator.NUMERIC_TYPE:
			message = "Number (+- 0-9)";
			break;
		case DataTypeValidator.ALPHA_TYPE:
		default:
			message = "Alphabetical and Numeric";
	}

	return "<span class='term-info-item'>This field accepts only {0} characters</span>".replace("{0}", message);
};

DataTypeValidator.prototype.validate = function (input) {
	return this.m_dataRegex.test(input);
};

DataTypeValidator.prototype.getDataRegex = function () {
	return this.m_dataRegex;
};

DataTypeValidator.prototype.setDataRegex = function (dataRegex) {
	if (!RegExp.prototype.isPrototypeOf(dataRegex)) {
		throw new Error("Cannot set regex with non regex type");
	}
	this.m_dataRegex = dataRegex;
	return this;
};

function DataRangeValidator() {
	this.m_minValue = Number.NEGATIVE_INFINITY;
	this.m_maxValue = Number.POSITIVE_INFINITY;
	return this;
}

DataRangeValidator.prototype = new InputValidator();
DataRangeValidator.prototype.constructor = InputValidator;

DataRangeValidator.prototype.getMessage = function () {
	return "<span class='term-info-item'>Number must be between {0} and {1}</span>".replace("{0}", this.m_minValue).replace("{1}", this.m_maxValue);
};

DataRangeValidator.prototype.validate = function (input) {
	try {
		var numericValue = parseFloat(input);
		if (isNaN(numericValue)) {
			throw new Error("Input is not a number type, cannot validate");
		}
		return (numericValue <= this.m_maxValue && numericValue >= this.m_minValue);
	} catch (exe) {
		return false;
	}
};

DataRangeValidator.prototype.setMinValue = function (minValue) {
	if (typeof minValue !== "number") {
		throw new Error("Cannot setMinValue with non number type");
	}
	if (minValue > this.m_maxValue) {
		throw new Error("Cannot set a minValue greater than the max value");
	}
	this.m_minValue = minValue;
	return this;
};

DataRangeValidator.prototype.setMaxValue = function (maxValue) {
	if (typeof maxValue !== "number") {
		throw new Error("Cannot setMaxValue with non number type");
	}
	if (maxValue < this.m_minValue) {
		throw new Error("Cannot set a maxValue less than the min value");
	}
	this.m_maxValue = maxValue;
	return this;
};

/*global logger, MP_Viewpoint*/

/**
 * A collection of functions which can be used to maintain, create, destroy and update modal dialogs.
 * The MP_ModalDialog function keeps a copy of all of the ModalDialog objects that have been created
 * for the current view.  If a ModalDialog object is updated outside of these functions, the updated
 * version of the object should replace the stale version that is stored here by using the
 * updateModalDialogObject functionality.
 * @namespace
 */
var MP_ModalDialog = {};
MP_ModalDialog.modalDialogObjects = {};
MP_ModalDialog.whiteSpacePixels = 26;

/**
 * This function will be used to add ModalDialog objects to the collection of ModalDialog objects for the current
 * View.  This list of ModalDialog objects will be the one source of this type of object and will be used when
 * showing modal dialogs.
 * @param {ModalDialog} modalObject An instance of the ModalDialog object
 * @return [boolean] true if the ModalDialog object was added successfully, false otherwise.
 */
MP_ModalDialog.addModalDialogObject = function (modalObject) {
	var modalId = "";
	//Check that he object is not null and that the object type is ModalDialog
	if (!(modalObject instanceof ModalDialog)) {
		logger.logError("MP_ModalDialog.addModalDialogObject only accepts objects of type ModalDialog");
		return false;
	}

	//Check for a valid id.
	modalId = modalObject.getId();
	if (!modalId) {
		//Modal id is not populated
		logger.logError("MP_ModalDialog.addModalDialogObject: no/invalid ModalDialog id given");
		return false;
	}
	else if(this.modalDialogObjects[modalId]) {
		//Modal id is already in use
		logger.logError("MP_ModalDialog.addModalDialogObject: modal dialog id " + modalId + " is already in use");
		return false;
	}

	//Add the ModalDialog Object to the list of ModalDialog objects
	this.modalDialogObjects[modalId] = modalObject;
	return true;
};

/**
 * Add the modal dialog icon to the viewpoint framework.  This icon will be responsible for
 * launching the correct modal dialog based on the ModalDialog object that it is associated to.
 * @param {string} modalDialogId The id of the ModalDialog object to reference when creating the modal dialog icon
 * @return {boolean} true if the dialog was added to the viewpoint, false otherwise.
 */
MP_ModalDialog.addModalDialogOptionToViewpoint = function (modalDialogId) {
	var modalObj = null;

	//Check to see if the ModalDialog exists
	modalObj = this.modalDialogObjects[modalDialogId];
	if (!modalObj) {
		return false;
	}

	//If the MP_Viewpoint function is defined call it
	if (typeof MP_Viewpoint !== "undefined" && typeof MP_Viewpoint.addModalDialogUtility !== "undefined") {
		MP_Viewpoint.addModalDialogUtility(modalObj);
		return true;
	}
};

/**
 * Closes all of the associated modal dialog windows
 * @param {string} modalDialogId The id of the modal dialog to close
 * @return {boolean} true if the dialog was closed, false otherwise
 */
MP_ModalDialog.closeModalDialog = function (modalDialogId) {
	var modalObj = null;

	//Check to see if the ModalDialog exists
	modalObj = this.modalDialogObjects[modalDialogId];
	if (!modalObj) {
		return false;
	}

	//destroy the modal dialog
	$("#vwpModalDialog" + modalObj.getId()).remove();
	//destroy the modal background
	$("#vwpModalBackground" + modalObj.getId()).remove();
	//Mark the modal dialog as inactive
	modalObj.setIsActive(false);
	$("body").css("overflow", "auto");
	return true;
};

/**
 * Deletes the modal dialog object with the id modalDialogId.
 * @param {string} modalDialogId The id of the modal dialog object to be deleted
 * @return {boolean} True if a ModalDialog object was deleted, false otherwise
 */
MP_ModalDialog.deleteModalDialogObject = function (modalDialogId) {
	if (this.modalDialogObjects[modalDialogId]) {
		delete this.modalDialogObjects[modalDialogId];
		return true;
	}
	return false;
};

/**
 * Retrieves the ModalDialog object with the id of modalDialogId
 * @param {string} modalDialogId The id of the modal dialog object to retrieve
 * @return {ModalDialog} Returns the modal dialog object if it exists in the collection
 */
MP_ModalDialog.retrieveModalDialogObject = function (modalDialogId) {
	if (this.modalDialogObjects[modalDialogId]) {
		return this.modalDialogObjects[modalDialogId];
	}
	return null;
};

/**
 * Resizes all of the active modal dialogs when the window itself is being resized.
 * @param {string} modalDialogId The id of the modal dialog object to resize
 * @return null
 */
MP_ModalDialog.resizeAllModalDialogs = function () {
	var dialog = null;
	var attr = "";
	//Get all of the modal dialog objects from the modalDialogObjects collection
	for (attr in MP_ModalDialog.modalDialogObjects) {
		if (MP_ModalDialog.modalDialogObjects.hasOwnProperty(attr)) {
			dialog = MP_ModalDialog.modalDialogObjects[attr];
			if (dialog.isActive()) {
				MP_ModalDialog.resizeModalDialog(dialog.getId());
			}
		}
	}
};

/**
 * Resizes the modal dialog when the window itself is being resized.
 * @param {string} modalDialogId The id of the modal dialog object to resize
 * @return null
 */
MP_ModalDialog.resizeModalDialog = function (modalDialogId) {
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
	modalObj = this.modalDialogObjects[modalDialogId];
	if (!modalObj) {
		logger.logError("MP_ModalDialog.resizeModalDialog: No modal dialog with the id " + modalDialogId + " exists");
		return;
	}

	if (!modalObj.isActive()) {
		logger.logError("MP_ModalDialog.resizeModalDialog: this modal dialog is not active it cannot be resized");
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
		"top" : topMarginSize,
		"left" : leftMarginSize,
		"width" : modalWidth + "px"
	});

	//Make sure the body div fills all of the alloted space if the body is a fixed size and also make sure the modal dialog is sized correctly.
	if (modalObj.isBodySizeFixed()) {
		$("#vwpModalDialog" + modalObj.getId()).css("height", modalHeight + "px");
		$("#" + modalObj.getBodyElementId()).height(modalHeight - $("#" + modalObj.getHeaderElementId()).height() - $("#" + modalObj.getFooterElementId()).height() - this.whiteSpacePixels);
	}
	else {
		$("#vwpModalDialog" + modalObj.getId()).css("max-height", modalHeight + "px");
		$("#" + modalObj.getBodyElementId()).css("max-height", (modalHeight - $("#" + modalObj.getHeaderElementId()).height() - $("#" + modalObj.getFooterElementId()).height() - this.whiteSpacePixels) + "px");
	}

	//Make sure the modal background is resized as well
	$("#vwpModalBackground" + modalObj.getId()).css({
		"height" : "100%",
		"width" : "100%"
	});
};

/**
 * Render and show the modal dialog based on the settings applied in the ModalDialog object referenced by the
 * modalDialogId parameter.
 * @param {string} modalDialogId The id of the ModalDialog object to render
 * @return null
 */
MP_ModalDialog.showModalDialog = function (modalDialogId) {
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
	var footerCheckbox = null;
	var footerText = "";

	/**
	 * This function is used to create onClick functions for each button.  Using this function
	 * will prevent closures from applying the same action onClick function to all buttons.
	 */
	function createButtonClickFunc(buttonObj, modalDialogId) {
		var clickFunc = buttonObj.getOnClickFunction();
		var closeModal = buttonObj.closeOnClick();
		if (!clickFunc) {
			clickFunc = function () {};

		}
		return function () {
			clickFunc();
			if (closeModal) {
				MP_ModalDialog.closeModalDialog(modalDialogId);
			}
		};

	}

	//Get the ModalDialog object
	modalObj = this.modalDialogObjects[modalDialogId];
	if (!modalObj) {
		logger.logError("MP_ModalDialog.showModalDialog: No modal dialog with the id " + modalDialogId + " exists");
		return;
	}

	//Check to see if the modal dialog is already displayed.  If so, return
	if (modalObj.isActive()) {
		return;
	}

	//Create the modal window based on the ModalDialog object
	//Create the header div element
	headerDiv = $("<div id='" + modalObj.getHeaderElementId() + "' class='dyn-modal-hdr-container'><span class='dyn-modal-hdr-title'>" + (modalObj.getHeaderTitle() || "&nbsp;") + "</span></div>");
	if (modalObj.showCloseIcon()) {
		headerDiv.append($("<span class='dyn-modal-hdr-close'></span>").click(function () {
				var closeFunc = null;
				var closeFunctionResponse = true;
				//call the close function of the modalObj
				closeFunc = modalObj.getHeaderCloseFunction();
				if (closeFunc) {
					closeFunctionResponse = closeFunc();
				}

				//Determine if we should close the modal or not
				if (modalObj.verifyCloseFunctionResponse()) {
					//Since we need to verify the close function response only close the modal when
					//the close function returned a truthy value or no close function is executed
					if (closeFunctionResponse) {
						MP_ModalDialog.closeModalDialog(modalObj.getId());
					}
			}
			else {
					MP_ModalDialog.closeModalDialog(modalObj.getId());
				}
			}));
	}

	//Create the body div element
	bodyDiv = $("<div id='" + modalObj.getBodyElementId() + "' class='dyn-modal-body-container'></div>");

	//Create the footer element if there are any buttons available or the checkbox is available
	footerButtons = modalObj.getFooterButtons();
	footerButtonsCnt = footerButtons.length;
	footerCheckbox = modalObj.getFooterCheckbox();
	footerText = modalObj.getFooterText();
	if (footerButtonsCnt || footerCheckbox.enabled || footerText !== "") {
		//Create the footer element
		footerDiv = $("<div id='" + modalObj.getFooterElementId() + "' class='dyn-modal-footer-container'></div>");
		//If the checkbox is enabled create the necessary elements
		if (footerCheckbox.enabled) {
			var checkboxContainer = $("<label class='dyn-modal-checkbox-container'></label>");
			var checkboxEle = $("<input type='checkbox' class='dyn-modal-checkbox'" + ((footerCheckbox.isChecked) ? " checked" : "") + ">");
			checkboxEle.click(footerCheckbox.onClick);
			checkboxContainer.append(checkboxEle);
			checkboxContainer.append("<span class='dyn-modal-checkbox-label'>" + footerCheckbox.label + "</span>");
			footerDiv.append(checkboxContainer);
		}
		
		//If footer buttons are enabled, rendering each button and apply the necessary click events
		if (footerButtonsCnt) {
			footerButtonContainer = $("<div id='" + modalObj.getFooterElementId() + "btnCont' class='dyn-modal-button-container'></div>");
			for (x = 0; x < footerButtonsCnt; x++) {
				button = footerButtons[x];
				footerButtonContainer.append($("<button id='" + button.getId() + "' class='dyn-modal-button'" + ((button.isDithered()) ? " disabled" : "") + ">" + button.getText() + "</button>").click(createButtonClickFunc(button, modalObj.getId())));
				//Check to see the footer button has a separator.
				if (button.getSeparatorInd()) {
					footerButtonContainer.append("<span class='dyn-modal-button-separator'></span>");
				}
				//Check to see if we should focus on this button when loading the modal dialog
				if (!focusButtonId) {
					focusButtonId = (button.getFocusInd()) ? button.getId() : "";
				}
			}
			footerDiv.append(footerButtonContainer);
		}

		//Create a footer text element if there is a label
		if (footerText !== "") {
			footerDiv.append("<span id='" + modalObj.getFooterTextElementId() + "' class='dyn-modal-footer-text'>" + footerText + "</span>");
		}

	}
	else if(modalObj.isFooterAlwaysShown()) {
		footerDiv = $("<div id='" + modalObj.getFooterElementId() + "' class='dyn-modal-footer-container'></div>");
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
	dialogDiv = $("<div id='vwpModalDialog" + modalObj.getId() + "' class='dyn-modal-dialog'></div>").css({
			"top" : topMarginSize,
			"left" : leftMarginSize,
			"width" : modalWidth + "px"
		});
	dialogDiv.append(headerDiv).append(bodyDiv).append(footerDiv);

	//Create the modal background if set in the ModalDialog object.
	modalDiv = $("<div id='vwpModalBackground" + modalObj.getId() + "' class='" + ((modalObj.hasGrayBackground()) ? "dyn-modal-div" : "dyn-modal-div-clear") + "'></div>").height($(document).height());

	//Add the flash function to the modal if using a clear background
	if (!modalObj.hasGrayBackground()) {
		modalDiv.click(function () {
			var modal = $("#vwpModalDialog" + modalObj.getId());
			modal.fadeOut(100);
			modal.fadeIn(100);
		});

	}

	//Add all of these elements to the document body
	$(document.body).append(modalDiv).append(dialogDiv);

	//Set the focus of a button if indicated
	if (focusButtonId) {
		$("#" + focusButtonId).focus();
	}
	//disable page scrolling when modal is enabled
	$("body").css("overflow", "hidden");

	//Make sure the body div fills all of the alloted space if the body is a fixed size and also make sure the modal dialog is sized correctly.
	if (modalObj.isBodySizeFixed()) {
		$(dialogDiv).css("height", modalHeight + "px");
		$(bodyDiv).height(modalHeight - $(headerDiv).height() - $(footerDiv).height() - this.whiteSpacePixels);
	}
	else {
		$(dialogDiv).css("max-height", modalHeight + "px");
		$(bodyDiv).css("max-height", (modalHeight - $(headerDiv).height() - $(footerDiv).height() - this.whiteSpacePixels) + "px");
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
	$(window).resize(this.resizeAllModalDialogs);
};

/**
 * Updates the existing ModalDialog with a new instance of the object.  If the modal objet does not exist it is added to the collection
 * @param {ModalDialog} modalObject The updated instance of the ModalDialog object.
 * @return null
 */
MP_ModalDialog.updateModalDialogObject = function (modalObject) {
	var modalDialogId = "";

	//Check to see if we were passed a ModalDialog object
	if (!modalObject || !(modalObject instanceof ModalDialog)) {
		logger.logError("MP_ModalDialog.updateModalDialogObject only accepts objects of type ModalDialog");
		return;
	}

	//Blindly update the ModalDialog object.  If it didnt previously exist, it will now.
	modalDialogId = modalObject.getId();
	this.modalDialogObjects[modalDialogId] = modalObject;
	return;
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
	//A flag to determine if this button should show a separator next to it.
	this.m_separatorInd = false;
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
/**
 * Retrieve the button separator indicator flag of the ModalButton object
 * @return {boolean} The button separator indicator flag of the ModalButton object
 */
ModalButton.prototype.getSeparatorInd = function () {
	return this.m_separatorInd;
};

/** Setters **/

/**
 * Sets the id of the ModalButton object.  The id must be a string otherwise it is ignored.
 * @param {string} buttonId The id which will be assigned to the button DOM element
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setId = function (buttonId) {
	if (buttonId && typeof buttonId === "string") {
		this.m_buttonId = buttonId;
	}
	return this;
};

/**
 * Sets the close on click flag of the dialog button
 * @param {boolean} closeFlag A boolean flag which determines if the dialog should close when the
 * button is clicked
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setCloseOnClick = function (closeFlag) {
	if (typeof closeFlag === "boolean") {
		this.m_closeOnClick = closeFlag;
	}
	return this;
};

/**
 * Sets the focus indicator flag of the dialog button
 * @param {boolean} focusInd A boolean flag which determines if the button should have focus on
 * initial dialog load.
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setFocusInd = function (focusInd) {
	if (typeof focusInd === "boolean") {
		this.m_focusInd = focusInd;
	}
	return this;
};

/**
 * Sets the text which will be shown in the button
 * @param {string} buttonText The string value to display as the button text
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setText = function (buttonText) {
	if (buttonText && typeof buttonText === "string") {
		this.m_buttonText = buttonText;
	}
	return this;
};

/**
 * Sets the dithered status of the dialog button
 * @param {boolean} dithere A boolean flag which determines if the button should be dithered
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setIsDithered = function (dithered) {
	if (typeof dithered === "boolean") {
		this.m_dithered = dithered;
	}
	return this;
};

/**
 * Sets the onClick function for the ModalButton
 * @param {function} clickFunc The function to execute when this button is clicked.
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setOnClickFunction = function (clickFunc) {
	if (typeof clickFunc === "function") {
		this.m_onClickFunction = clickFunc;
	}
	return this;
};

/**
 * Sets the button separator indicator flag of the dialog button.If the separator indicator is
 * set to true then the separator is displayed to the right of the button.
 * @param {boolean} separatorFlag A boolean flag which determines if the button will have a visual
 * separator displayed to the right of the button.
 * @return {ModalButton} The modal button object calling this function so chaining can be used
 */
ModalButton.prototype.setSeparatorInd = function (separatorFlag) {
	if (typeof separatorFlag === "boolean") {
		this.m_separatorInd = separatorFlag;
	}
	return this;
};

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
		top : 5,
		right : 5,
		bottom : 5,
		left : 5
	};

	//The icon object contains information about the icon that the user will use to launch the modal dialog
	this.m_icon = {
		elementId : modalId + "icon",
		cssClass : "",
		text : "",
		hoverText : "",
		isActive : true
	};

	//The header object of the modal.  Contains all of the necessary information to render the header of the dialog
	this.m_header = {
		elementId : modalId + "header",
		title : "",
		closeFunction : null,
		verifyCloseFunctionResponse : false
	};

	//The body object of the modal.  Contains all of the necessary information to render the body of the dialog
	this.m_body = {
		elementId : modalId + "body",
		dataFunction : null,
		isBodySizeFixed : true
	};

	//The footer object of the modal.  Contains all of the necessary information to render the footer of the dialog
	this.m_footer = {
		isAlwaysShown : false,
		elementId : modalId + "footer",
		buttons : [],
		checkbox : {
			enabled : false,
			isChecked : false,
			onClick : function () {
				return false;
			},
			label : ""
		},
		footerText : {
			text : "",
			elementId : modalId + "FooterText"
		}
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
		logger.logError("ModalDialog.addFooterButton: Cannot add footer button which isnt a ModalButton object.\nModalButtons can be created using the ModalDialog.createModalButton function.");
		return this;
	}

	if (!modalButton.getId()) {
		logger.logError("ModalDialog.addFooterButton: All ModalButton objects must have an id assigned");
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
 * Checks if the modal should be fixed to the icon used to activate the modal
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

/**
 * Checks to see if the response of the close function associated to the Header close icon
 * should be checked before closing the dialog.  If set to true, the response of the close function will determine
 * if the dialog will be closed or not.  A true response indicates that the dialog can be closed.  A false response
 * indicates that they dialog should not be closed.
 * @return {boolean} A flag which determines if the dialog should check the response of the close function
 * before closing the dialog.
 */
ModalDialog.prototype.verifyCloseFunctionResponse = function () {
	return this.m_header.verifyCloseFunctionResponse;
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
	var button = null;
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
 * Retrieves the footer checkbox object associated to the modal dialog
 * @return {object} The checkbox associated to the modal dialog footer element
 */
ModalDialog.prototype.getFooterCheckbox = function () {
	return this.m_footer.checkbox;
};

/**
 * Retrieves a boolean which determines if the checkbox is enabled in the modal dialog footer.
 * @return {boolean} The flag which determines if this modal dialog should display a checkbox in the footer
 */
ModalDialog.prototype.getIsFooterCheckboxEnabled = function () {
	return this.m_footer.checkbox.enabled;
};

/**
 * Retrieves a boolean which determines if the checkbox is checked in the modal dialog footer.
 * @return {boolean} The flag which returns the state of the modal dialog footer checkbox
 */
ModalDialog.prototype.getFooterCheckboxIsChecked = function () {
	return this.m_footer.checkbox.isChecked;
};

/**
 * Retrieves the string label for the checkbox in the modal dialog footer.
 * @return {string} The label that appears next to the checkbox in the modal dialog footer
 */
ModalDialog.prototype.getFooterCheckboxLabel = function () {
	return this.m_footer.checkbox.label;
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
/**
 * Retrieves the footer text which will be displayed in the footer of the modal dialog
 * @return {string} The text to display in the footer of the modal dialog.
 */
ModalDialog.prototype.getFooterText = function () {
	return this.m_footer.footerText.text;
};
/**
 * Retrieves the id associated to the modal dialog footer text element
 * @return {string} The id associated to the modal dialog footer text element
 */
ModalDialog.prototype.getFooterTextElementId = function () {
	return this.m_footer.footerText.elementId;
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
		logger.logError("ModalDialog.setBodyDataFunction: dataFunc param must be a function or null");
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
	if (elementId && typeof elementId === "string") {
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
	if (html && typeof html === "string") {
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
	if (typeof margin === "number") {
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
		logger.logError("ModalDialog.setFooterButtonCloseOnClick: closeOnClick param must be of type boolean");
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
				if (onClickFunc && typeof onClickFunc === "function") {
					onClickFunc();
				}
				if (closeOnClick) {
					MP_ModalDialog.closeModalDialog(modal.getId());
				}
			});

		}
	}
	else {
		logger.logError("ModalDialog.setFooterButtonCloseOnClick: No button with the id of " + buttonId + " exists for this ModalDialog");
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
		logger.logError("ModalDialog.setFooterButtonDither: Dithered param must be of type boolean");
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
				buttonElement.attr("disabled", true);
			}
			else {
				buttonElement.attr("disabled", false);
			}
		}
	}
	else {
		logger.logError("ModalDialog.setFooterButtonDither: No button with the id of " + buttonId + " exists for this ModalDialog");
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
	if (!(typeof clickFunc === "function") && clickFunc !== null) {
		logger.logError("ModalDialog.setFooterButtonOnClickFunction: clickFunc param must be a function or null");
		return this;
	}

	//Get the modal button
	button = this.getFooterButton(buttonId);
	if (button) {
		//Set the onclick function of the button
		button.setOnClickFunction(clickFunc);
		//If the modal dialog is active, update the existing onClick function
		if (this.isActive()) {
			$("#" + buttonId).unbind("click").click(function () {
				if (clickFunc) {
					clickFunc();
				}
				if (button.closeOnClick()) {
					MP_ModalDialog.closeModalDialog(modal.getId());
				}
			});
		}
	}
	else {
		logger.logError("ModalDialog.setFooterButtonOnClickFunction: No button with the id of " + buttonId + " exists for this ModalDialog");
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
		logger.logError("ModalDialog.setFooterButtonText: buttonText param must be a string");
		return this;
	}

	//Check make sure the string is not empty
	if (!buttonText) {
		logger.logError("ModalDialog.setFooterButtonText: buttonText param must not be empty or null");
		return this;
	}

	//Get the modal button
	button = this.getFooterButton(buttonId);
	if (button) {
		//Set the onclick function of the button
		button.setText(buttonText);
		//If the modal dialog is active, update the existing onClick function
		if (this.isActive()) {
			$("#" + buttonId).html(buttonText);
		}
	}
	else {
		logger.logError("ModalDialog.setFooterButtonText: No button with the id of " + buttonId + " exists for this ModalDialog");
	}
	return this;
};

/**
 * Sets the html element id of the modal dialog footer.  This id will be used to interact with the footer of the modal dialog.
 * @param {string} elementId The id of the html element
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterElementId = function (elementId) {
	if (elementId && typeof elementId === "string") {
		//Update the existing element id if the modal dialog is active
		if (this.isActive()) {
			$("#" + this.getFooterElementId()).attr("id", elementId);
		}
		this.m_footer.elementId = elementId;
	}
	return this;
};

/**
 * Sets the label that will appear next to the checkbox in the modal dialog footer
 * @param {string} label A label that will appear next to the corresponding checkbox
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxLabel = function (label) {
	if (typeof label === "string" && label !== "") {
		this.m_footer.checkbox.label = label;
	}
	return this;
};

/**
 * Sets the flag that will determine if the checkbox in the footer of the modal dialog
 * is visible or not.
 * @param {boolean} isEnabled A flag that will determine if the footer checkbox is visible or not.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxEnabled = function (isEnabled) {
	if (typeof isEnabled === "boolean") {
		this.m_footer.checkbox.enabled = isEnabled;
	}
	return this;
};

/**
 * Sets the flag that will determine if the checkbox in the footer of the modal dialog
 * is checked or not checked.
 * @param {boolean} isChecked A flag that will determine the state of the footer checkbox.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxIsChecked = function (isChecked) {
	if (typeof isChecked === "boolean") {
		this.m_footer.checkbox.isChecked = isChecked;
	}
	return this;
};

/**
 * Sets the function that will be called when the footer checkbox is clicked.
 * @param {function} checkboxClickFunction A function that will be called whenever the footer
 * checkbox is clicked
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterCheckboxClickFunction = function (checkboxClickFunction) {
	if (checkboxClickFunction && (typeof checkboxClickFunction === "function")) {
		//If the user defines the checkbox click function, assume they want it enabled
		this.setFooterCheckboxEnabled(true);
		this.m_footer.checkbox.onClick = checkboxClickFunction;
	}
	return this;
};

/**
 * Sets the flag which determines if the dialog should verify the response from the close function
 * before attempting to close.  If the response is true, the dialog can be closed.  If the response is
 * false the dialog should not be closed.
 * @param {boolean} verifyResponse The flag which will indicate if verification of the close function response
 * is needed
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used.
 */
ModalDialog.prototype.setVerifyCloseFunctionResponse = function (verifyResponse) {
	if (typeof verifyResponse === "boolean") {
		this.m_header.verifyCloseFunctionResponse = verifyResponse;
	}
	return this;
};

/**
 * EventHandler for the click on the icon when it is active. This will call the showModalDialog method
 * which renders the ModalDialog. It can be overwritten by any implementations of ModalDialog.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.activeIconClickEventHandler = function () {
	MP_ModalDialog.showModalDialog(this.getId());
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

	if (typeof activeInd === "boolean") {
		this.m_icon.isActive = activeInd;
		//Update the icon click event based on the indicator
		//Get the icon container and remove all events if there are any
		var iconElement = $("#" + this.getIconElementId());
		if (iconElement) {
			iconElement.unbind("click");
			iconElement.removeClass("vwp-util-icon");
			if (activeInd) {
				//Add the click event
				iconElement.click(function () {
					modal.activeIconClickEventHandler();
				});
				iconElement.addClass("vwp-util-icon");
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
	if (typeof hasGrayBackground === "boolean") {
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
		logger.logError("ModalDialog.setHeaderCloseFunction: closeFunc param must be a function or null");
		return this;
	}

	//Update close function since it is valid
	this.m_header.closeFunction = closeFunc;

	//Update the header close function if the modal is active
	if (this.isActive()) {
		//Get the close element
		$(".dyn-modal-hdr-close").click(function () {
			var closeFunctionResponse = true;
			if (closeFunc) {
				closeFunctionResponse = closeFunc();
			}

			//Determine if we should close the modal or not
			if (modal.verifyCloseFunctionResponse()) {
				//Since we need to verify the close function response only close the modal when
				//the close function returned a truthy value or no close function is executed
				if (closeFunctionResponse) {
					MP_ModalDialog.closeModalDialog(modal.getId());
				}
			}
			else {
				MP_ModalDialog.closeModalDialog(modal.getId());
			}
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
	if (elementId && typeof elementId === "string") {
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
	if (headerTitle && typeof headerTitle === "string") {
		//Update the existing header title if the modal dialog is active
		if (this.isActive()) {
			$("#" + this.getHeaderElementId() + " .dyn-modal-hdr-title").html(headerTitle);
		}
		this.m_header.title = headerTitle;
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
	if (iconClass && typeof iconClass === "string") {
		//Update the existing icon class
		$("#" + this.getIconElementId()).removeClass(this.m_icon.cssClass).addClass(iconClass);
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
	if (elementId && typeof elementId === "string") {
		//Update the existing element id if the modal dialog is active
		$("#" + this.getIconElementId()).attr("id", elementId);
		this.m_icon.elementId = elementId;
	}
	return this;
};

/**
 * Sets the text which will be displayed to the user when hovering over the modal dialog icon.
 * @param {string} iconHoverText The text to display in the icon hover
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconHoverText = function (iconHoverText) {
	if (iconHoverText !== null && typeof iconHoverText === "string") {
		this.m_icon.hoverText = iconHoverText;
		//Update the icon hover text
		$("#" + this.getIconElementId()).attr("title", iconHoverText);
	}
	return this;
};

/**
 * Sets the text to be displayed next to the modal dialog icon.
 * @param {string} iconText The text to display next to the modal dialog icon.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setIconText = function (iconText) {
	if (iconText !== null && typeof iconText === "string") {
		this.m_icon.text = iconText;
		//Update the icon text
		$("#" + this.getIconElementId()).html(iconText);
	}
	return this;
};

/**
 * Sets the id which will be used to identify a particular ModalDialog object.
 * @param {string} id The id that will be assigned to this ModalDialog object
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setId = function (id) {
	if (id && typeof id === "string") {
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
	if (typeof activeInd === "boolean") {
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
	if (typeof bodyFixed === "boolean") {
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
	if (typeof fixedToIcon === "boolean") {
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
	if (typeof footerAlwaysShown === "boolean") {
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
	if (typeof margin === "number") {
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
	if (typeof margin === "number") {
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
	if (typeof showCloseIcon === "boolean") {
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
	if (typeof margin === "number") {
		this.m_margins.top = (margin <= 0) ? 1 : margin;
		//Resize the modal if it is active
		if (this.isActive()) {
			MP_ModalDialog.resizeModalDialog(this.getId());
		}
	}
	return this;
};
/**
 * Sets the text to be displayed in the footer of the modal dialog.
 * @param {string} footerText The text to display in the footer of the modal dialog.
 * @return {ModalDialog} The modal dialog object calling this function so chaining can be used
 */
ModalDialog.prototype.setFooterText = function (footerText) {
	if (typeof footerText === "string" && footerText !== "") {
		this.m_footer.footerText.text = footerText;
		if (this.isActive()) {
			//Update the footer text if the dialog is active
			$("#" + this.getFooterTextElementId()).html(footerText);
		}
	}
	return this;
};
/**
 * Polyfill for Object.keys so we can start using it in
 * IE8. This will help when we transition to IE10, since that 
 * method will yield better performance.
 */

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnPropertyMet = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnPropertyMet.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnPropertyMet.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}


MPageOO = {

	/**
	* Allows inheriting two classes without having to call the constructor.
	* Can be replaced with Object.create() once we go over supporting IE10+.
	*/
	inherits: function (clazz, parent) {
		var Dummy = function() {};
		Dummy.prototype = parent.prototype;
		clazz.prototype = new Dummy();
		
		// static methods
		var methods = Object.keys(parent);
		for (var i=methods.length;i--;) {
		    var m = methods[i];
		    clazz[m] = parent[m];
		}
	},

	attribute: function(clazz, name) {

		clazz.prototype["set" + name] = function(value) {
			this["m_"+name] = value;
		};

		clazz.prototype["get" + name] = function() {
			return this["m_" + name];
		};
	}
};
TemplateEngine={};
(function(ns,$){ns.getHtmlTags=function(){var tags=["html","span","head","body","pre","h1","h2","h3","h4","h5","h6","b","i","em","strong","font","a","p","br","dl","dt","dd","ol","ul","li","div","img","hr","table","th","tr","td","tbody","thead","form","option","input","textarea","button"];
var result={};
result=ns.getTags(tags);
return result;
};
ns.getTags=function(tags){var result={};
$.each(tags,function(i,tagname){result[tagname]=ns.tag(tagname);
});
return result;
};
ns.tag=function(tagname){return function(){var args=[].slice.call(arguments);
args.unshift(tagname);
var tagObj=new ns.Tag(tagname);
ns.Tag.apply(tagObj,args);
return tagObj;
};
};
ns.button=function(attributes){attributes.type="button";
return new ns.Tag("input",attributes,null);
};
ns.textbox=function(attributes){attributes.type="text";
return new ns.Tag("input",attributes,null);
};
ns.Tag=function(name,args){this.name=name;
this.parent=null;
this.element=null;
this.content="";
this.attributes={};
if(arguments.length==1){return;
}var arg2=arguments[1];
var contentOffset=1;
if(arg2 instanceof Object&&!(arg2 instanceof ns.Tag)&&!(arg2 instanceof String)&&!(arg2 instanceof Array)){this.attributes=arg2;
contentOffset=2;
}if(arguments.length==2&&contentOffset==2){return;
}var contentArr=[];
for(var i=contentOffset;
i<arguments.length;
i++){if(arguments[i] instanceof Array){$.merge(contentArr,arguments[i]);
}else{contentArr.push(arguments[i]);
}}this.content=contentArr;
};
ns.Tag.prototype.render=function(){this.makeElement();
this.makeContent();
return this.element;
};
ns.Tag.prototype.makeElement=function(){var element=$("<"+this.name+"></"+this.name+">");
$.each(this.attributes,function(key,value){if(!value){value="";
}element.attr(key,value);
});
this.element=element;
return element;
};
ns.Tag.traverse=function(content,parentTag){if(!content){return;
}if(content instanceof ns.Tag){content.parent=parentTag;
parentTag.element.append(content.render());
return;
}if(!(content instanceof Array)){parentTag.element.append(content);
return;
}$.each(content,function(key,value){ns.Tag.traverse(value,parentTag);
});
};
ns.Tag.prototype.makeContent=function(){ns.Tag.traverse(this.content,this);
};
ns.Template=function(templateFunction){this.m_function=templateFunction;
this.m_factory=null;
};
ns.Template.prototype.render=function(context){var scope=new ns.ScopeManager();
if(this.m_factory){this.m_factory.before(scope);
}var rootTag=this.m_function(context);
if(!(rootTag instanceof ns.Tag)){alert("The template function does not return a Tag instance.");
}var rendered=rootTag.render();
scope.clean();
if(this.m_factory){this.m_factory.after(scope);
}return rendered;
};
ns.TemplateFactory=function(templates){var self=this;
$.each(templates,function(k,v){if(k!="before"&&k!="after"){self[k]=new ns.Template(v);
self[k].m_factory=self;
}else{self[k]=v;
}});
};
ns.TemplateFactory.prototype.before=function(){};
ns.TemplateFactory.prototype.after=function(){};
ns.ScopeManager=function(){this.m_originalScope={};
};
ns.ScopeManager.prototype.use=function(objects){var self=this;
$.each(objects,function(k,v){if(window[k]!==undefined){self.m_originalScope[k]=window[k];
}window[k]=v;
});
};
ns.ScopeManager.prototype.clean=function(){var self=this;
$.each(this.m_originalScope,function(k,v){window[k]=v;
});
};
}(TemplateEngine,jQuery));
/**
 * Simple template class to encapsulate an html template
 * @author Will Reynolds
 * @constructor
 */
function Template() {
    this.id = "";
    this.templateFunction = null;
}

/**
 * Sets the id of the template
 * @param id the id of the template
 */
Template.prototype.setId = function(id) {
    this.id = id;
};

/**
 * Gets the id of the template
 * @return {string} the id of the template (this can be used to find it in the template cache)
 */
Template.prototype.getId = function() {
    return this.id;
};

/**
 * Set the template rendering function
 * @param templateFunction the template rendering function
 */
Template.prototype.setTemplateFunction = function(templateFunction) {
    this.templateFunction = templateFunction;
};

/**
 * Get the template rendering function
 * @return {Function} the template rendering function
 */
Template.prototype.getTemplateFunction = function() {
    return this.templateFunction;
};

/**
 * Renders the template with provided data
 * @param data the data object you wish to provide to the template
 * @return {string} the populated template
 */
Template.prototype.render = function(data) {
    data = data || {};
    try {
        return this.templateFunction(data);
    } catch(exe) {
        throw new Error("There was an error rendering the template: " + exe.message);
    }
};
/**
 * Simple template builder class
 * @author Will Reynolds
 * @constructor
 */
function TemplateBuilder() {
}

/**
 * Builds a template from a string
 * @param template a template string
 * @return {Template} a template object based on the template string passed in
 */
TemplateBuilder.buildTemplate = function(template) {
    if(typeof template !== "string") {
        throw new Error("Called buildTemplate on TemplateBuilder with non string type for template parameter");
    }
	
	// escape double quotes
	template = template.replace(/"/g, '\\"');
	
    var newTemplate = new Template();
    //Build the template rendering function
    var templateFunction = new Function("data", "var params=[];" +
        "params.push(\"" + template.split("${").join("\");params.push(data.").split("}").join(");params.push(\"") + "\");"+
        "return params.join(\"\");");
    newTemplate.setTemplateFunction(templateFunction);
    return newTemplate;
};

/**
 * Creates a template AND caches it in the template cache
 * @param id the id by which the template can be accessed
 * @param template the template string
 * @return {Template} the template object created
 */
TemplateBuilder.buildAndCacheTemplate = function(id, template) {
    var templateObject = TemplateBuilder.buildTemplate(template);
    TemplateCache.cacheTemplate(id, templateObject);
    return templateObject;
};
/**
 * Simple template cache class to store off constructed templates
 * @author Will Reynolds
 * @constructor
 */
function TemplateCache(){
}

TemplateCache.templates = {};

/**
 * Loads all standard template into the cache to be used later (only do this if you wish to load all templates)
 */
TemplateCache.loadStandardTemplates = function() {
    for(var templateKey in StandardTemplates) {
        var template = StandardTemplates[templateKey];
        if(template && typeof template === "string") {
            TemplateCache.cacheTemplate(templateKey, TemplateBuilder.buildTemplate(template));
        }
    }
};

/**
 * Stores a template in the cache
 * @param id the id of the template that you'll use to get it later
 * @param template the template object you're caching
 */
TemplateCache.cacheTemplate = function(id, template) {
    if(typeof id !== "string") {
        throw new Error("Called cacheTemplate on TemplateCache with non string type for id parameter");
    }
    if(!Template.prototype.isPrototypeOf(template)) {
        throw new Error("Called cacheTemplate on TemplateCache with non Template type for template parameter");
    }
    if(TemplateCache.hasTemplate(id)) {
        throw new Error("Called cacheTemplate on TemplateCache. Template with id: " + id + " already exists. Please use a different identifier.");
    }
    TemplateCache.templates[id] = template;
};

/**
 * Gets a template by the id passed in
 * @param id the id of the template one wishes to obtain
 * @return {Template} if a template exists for the id, returns that Template, otherwise returns null
 */
TemplateCache.getTemplate = function(id) {
    if(!TemplateCache.hasTemplate(id)) {
        throw new Error("Template with id: " + id + " does not exist");
    }
    return TemplateCache.templates[id];
};

/**
 * Checks if a template object exists in the cache
 * @param id the id of the template
 * @return {boolean} true if the template exists, otherwise false
 */
TemplateCache.hasTemplate = function(id) {
    return (typeof TemplateCache.templates[id] !== "undefined" && TemplateCache.templates[id] !== null);
};
var MPageControls = MPageControls || {};
MPageObjectOriented = {};

MPageObjectOriented.inherits = function (clazz, parent) {
	// instance methods
	$.each(parent.prototype, function(k, m) {
		clazz.prototype[k] = m;
	});
	
	// static methods
	$.each(parent, function(k, m) {
	   clazz[k] = m; 
	});
};

MPageObjectOriented.createAttribute = function(clazz, name) {
	clazz.prototype["set" + name] = function(value) {
		this["m_"+name] = value;
	};

	clazz.prototype["get" + name] = function() {
		return this["m_" + name];
	};
};

/**
 * Returns a string with the ID of the element. Element can be an ID string,
 * a jquery object, or a plain DOM element. Either way, the ID will be
 * automatically detected. If it can't detect, then an exception will
 * be thrown.
 *  
 * @param {Object} element 
 */
MPageControls.getId = function(element) {
	if (element instanceof String || typeof element === "string") {
		return element;
	}
	
	// note that null != undefined. We only want to return
	// an empty string when the client has explicitly informed
	// that it is a null variable.
	if (element === null) {
		return "";
	}
	
	var id = undefined;
	if (element instanceof jQuery) {
		 id = element.attr("id");
	}
	
	if (element && element.getAttribute) {
		id = element.getAttribute("id");
	}
	
	if (!id) {
		throw new Error("You have tried to pass an object to MPageControls.getId that does not have a valid ID attribute.");
	}
	
	return id;
};

MPageControls.getDefaultTemplates = function() {
	return new TemplateEngine.TemplateFactory(MPageControls.defaultTemplates());
};

MPageControls.fromId = function(idStr) {
	var el = $("#" + idStr);
	return el.length === 0 ? null : el;
};

MPageControls.setMaxHeight = function(maxHeight) {
	this.m_maxHeight = maxHeight;
};

MPageControls.getMaxHeight = function() {
	return this.m_maxHeight;
};
/**
 * control.js
 * @author Leonardo Sa
 *
 * Control class
 * ============================================================================
 *
 * Serves as a base class for all other controls. It automatically assigns the
 * "element" constructor argument to its element attribute. It will also
 * automatically call the init method, that is meant to be overriden by child
 * classes.
 */

(function() {
    // ------------------------------------------------------------------------
    // Imports
    // ------------------------------------------------------------------------
	var ns = MPageControls;
    var attribute = MPageObjectOriented.createAttribute;

    // ------------------------------------------------------------------------
    // Class Declaration
    // ------------------------------------------------------------------------
	ns.Control = function(element) {

	    this.setControlId(ns.Control.idCounter);
	    ns.Control.idCounter++;

        if (element) {
            this.setElement(element);
            this.init();
        } else {
            this.setElement(ns.Control.ID_PREFIX + this.getControlId());
        }
	};
	
	ns.Control.idCounter = 0;
    ns.Control.ID_PREFIX = "mpage_controls_control_";
	
	// ------------------------------------------------------------------------
    // Attributes
    // ------------------------------------------------------------------------
	
	/**
	 * A unique ID that identifies this control 
	 */
	attribute(ns.Control, "ControlId");

	/**
	 * Some controls can be nested in a parent/child relationship
	 */
	 attribute(ns.Control, "Parent");
	
	// ------------------------------------------------------------------------
    // Member Methods
    // ------------------------------------------------------------------------
	
	/**
	 * Executed right after the control is created. Can be overriden by child
	 * classes. The purpose of a separate init method is to allow the user
	 * to rebuild the control from the ground up without having to call
	 * its constructor, removing the need to copy all properties.
	 */
	ns.Control.prototype.init = function() {

	};
	
	ns.Control.prototype.setElement = function(element) {
	    this.m_element = MPageControls.getId(element);
	};
	
	ns.Control.prototype.getElement = function() {
	    return MPageControls.fromId(this.m_element);
	};
	
	ns.Control.prototype.setContents = function(contents) {
	    this.m_contents = MPageControls.getId(contents);
	};
	
	ns.Control.prototype.getContents = function() { 
	    return MPageControls.fromId(this.m_contents);
	};

    ns.Control.prototype.getElementId = function() {
        return this.m_element;
    };

    /**
     * Renders a template function into the current element.
     *
     * Executes a function as specified by the template argument, passing the context
     * as an argument, and sets the innerHTML of the current element to the result
     * of the function execution. A "control_[id]" string will be set to the controlId
     * property of the context if it has not been set yet.
     *
     * @param template
     * @param context
     */
    ns.Control.prototype.renderTemplate = function(template, context) {
        if (!context) {
            context = {};
        }

        if (!context.controlId) {
            context.controlId = this.getControlId();
        }

        var html = template(context);
        this.getElement().html(html);
    };

	// ________________________________________________________________________

	/**
	 * Calls the function as specified by eventName in the parent,
	 * passing the arguments.
	 */
	ns.Control.prototype.fire = function(eventName, args) {
	    var parent = this.getParent();
	    if (!parent) { return; }
        if (!(parent[eventName])) { return; }
        if(args != undefined || args != null){
        	parent[eventName].apply(parent, args);
        }else{
        	parent[eventName].apply(parent, []);
        }        
	};

	// ________________________________________________________________________
	
	/**
	 * Binds an event to a jQuery element. This is similar to jQuery's bind,
	 * except that here we keep track of the binded events in the control so
	 * we can destroy them later if needed. 
     * @param {Object} eventName
     * @param {Object} element
     * @param {Object} handler
	 */
	ns.Control.prototype.bind = function(eventName, element, handler) {
	    element.bind(eventName + ".control" + this.getControlId(), handler);
	};
	
	// ________________________________________________________________________
	
	/**
	 * Destroys all the events associated with the current control 
	 */
	ns.Control.prototype.destroyEvents = function() {
	    if (this.getElement()) {
	       this.getElement().unbind(".control" + this.getControlId());
	    }
	};
	
	// ________________________________________________________________________
	
	ns.Control.prototype.focus = function() {
	   this.getElement().focus();    
	};

    // ________________________________________________________________________

    ns.Control.prototype.trigger = function (eventName, args) {
      if (this[eventName]) {
          if (!args) { args = []; }
          return this[eventName].apply(this, args);
      }
    };

})();
MPageControls.defaultTemplates = function() {
	var te = TemplateEngine;
	var div = te.tag("div");
	var input = te.tag("input");
	var span = te.tag("span");

	return {
		
		// --------------------------------------------------------------------
		// List
		// --------------------------------------------------------------------
		
		list: function(context) {
			return div({"class": "list", "tabindex":"0", "id": context.listId}, context.items);
		},
		
		listItem: function(context) {
			return div({"class": "list-item", "id": context._elementId}, context.content);
		},

		// --------------------------------------------------------------------
		// Drop Down List
		// --------------------------------------------------------------------

		ddListItem: function(context) {
			return div({"class": "list-item", "id": context._elementId}, context[context.displayKey]);
		},
		
		// --------------------------------------------------------------------
		// AutoSuggent
		// --------------------------------------------------------------------
		
		autoSuggest: function(context) {
			return div({"class":"auto-suggest input"},
				div({"id": context.closebtnId,"class":"close-btn"}, "&nbsp;"),
				div({"class":"auto-suggest-input-wrapper"},
					input({"type":"text", "class":"search-box", "id": context.textboxId})
				)
			);
		},
		
		autoSuggestList: function(context) {
			return div({
				"class":"auto-suggest suggestions", 
				"style":"position: relative", 
				"tabindex":"0", 
				"id": context.listId}, context.items);
		},

		emptyList: function() {
			return div({
				"class":"auto-suggest suggestions res-none",
				"style":"position: relative",
				"tabindex":"0"}, i18n.NO_RESULTS_FOUND);
		},

		// --------------------------------------------------------------------
		// ScriptSearch
		// --------------------------------------------------------------------
		cclSearch: function(context) {
			return div({"class":"auto-suggest"},
				div({"class":"auto-suggest-search-box"},
					input({"type":"text", "id": context.textboxId})
				),
				div({"class":"clear-search", "id": context.closebtnId},
					span({"class":"clear-button", "style": "display: inline-block"})
				)
			);
		},

		personnelSearchItem: function(context) {
			return div({"id": context._elementId},
				context.NAME_FULL_FORMATTED
			);
		},

		providerSuggestList: function(context) {
			var divDetails = {
				"class":"auto-suggest suggestions",
				"style":"position: relative;",
				"tabindex":"0",
				"id": context.listId
			};

			var maxHeight = MPageControls.getMaxHeight();

			if(maxHeight) {
				divDetails.style = "position: relative; max-height: " + maxHeight + "px;";
			}

			return div(
				divDetails,
				context.items,
				div({"id":"newProviderAssignment"}, i18n.ASSIGN_NEW_PROVIDER)
			);
		},

		// --------------------------------------------------------------------
		// OrderSearch
		// --------------------------------------------------------------------

		orderSearch: function(context) {
			return div({"class":"auto-suggest"},
				div({"class":"order-search-box"},
					input({"type":"text", "class":"search-box noe2-search", "id": context.textboxId})
				),
				div({"class":"clear-search", "id": context.closebtnId}, 
					span({"class":"clear-button", "style": "display: inline-block"})
				)
			); 
		},
		
		orderSearchItem: function(context) {
			return div({"id": context._elementId},
				span({"class":context.iconClass}, "&nbsp;"), 
				context.content,
				span({"class":"order-sentence"}, context.SENTENCE)
			);
		},
		
		// --------------------------------------------------------------------
		// NomenclatureSearch
		// --------------------------------------------------------------------
		nomenSearchItem: function(context){
			return div({"id": context._elementId}, context.m_Data.SOURCESTRING);
		},
		
		// --------------------------------------------------------------------
		// Message
		// --------------------------------------------------------------------
		messageBar : function(context){
			return  div({"class": context.msgDivClass},
				span("&nbsp;"), 
				context.message,
				span({"class":'close-btn hidden','id':context.closeBtnId},"&nbsp;"));
		},
		
		// --------------------------------------------------------------------
		// Venue dropdown
		// --------------------------------------------------------------------
		venueTemplate : function(context) {
			return div({
				"id" : context._elementId
			}, div({
				"class" : 'venue-item'
			}, context.VENUE_DISPLAY));

		}

	};
};
(function($) {
	var ns = MPageControls;
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;
	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	/**
	 * A control that represents alert message, which can be added to any 
	 * summary or workflow component. 
	 */
	ns.AlertMessage = function(element, messageTemplate, messageType) {
		this.setTemplate(messageTemplate);
		this.setCssClass(messageType);
		this.setIsClosable(false);		
		ns.Control.call(this, element);
	};
	
	inherits(ns.AlertMessage, ns.Control);
	/**
	 *The MessageTypes object will map the type of message with the css class. 
	 */
	ns.AlertMessage.MessageTypes = {
			WARNING : "msg-warning",
			INFORMATION : "msg-info",
			ERROR: "msg-error"
	};
	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------

	/**
	 * A string-template that will be used when rendering the Message bar.
	 */
	attribute(ns.AlertMessage, "Template");

	/**
	 *Css class for the message div. 
	 */
	attribute(ns.AlertMessage, "CssClass");
	
	/**
	 *Flag to allow closing of the alert message 
	 */
	attribute(ns.AlertMessage, "IsClosable");
	
	
	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	
	var prot = ns.AlertMessage.prototype;
	
	// ________________________________________________________________________
	
	prot.getCloseBtnId = function() {
		return "control_" + this.getControlId() + "_closebtn";
	};
	/**
	 * Appends the html markup created by the template to the target element.
	 */
	prot.render = function(message) {
		var context = {
			"msgDivClass":this.getCssClass(),
			"message": message,
			"closeBtnId":this.getCloseBtnId()
		};
		var self = this;
		this.getElement().html(this.getTemplate().render(context));
		if(this.getIsClosable()){
			$("#"+this.getCloseBtnId()).removeClass("hidden");
			$("#"+this.getCloseBtnId()).click(function(){
				self.close();
			});	
		}
	};
	prot.close = function(){
		$(this.getElement()).hide();
	};	
})(jQuery);
(function($) {
	var ns = MPageControls;
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.AutoSuggest = function(element) {
		this.setCaptionClass("caption");
		this.setTemplate(MPageControls.getDefaultTemplates().autoSuggest);
		this.setCaption("");
		this.setAutoHideCloseButton(true);
		this.setDelay(50);
		this.setDetailDialog(null);
		this.setHighlightEnabled(true);
		this.setSynchSuggestionsWidth(true);
		this.setBackgroundClass("search-box-image");
		this.mBlurEnabled = true;

		this.setOnChange(function() {
		});
		this.setOnClose(function() {
		});
		this.setOnEnter(function() {
		});
		this.setOnDelay(function() {
		});
		this.setRequestItemValueCallback(function(item) {
			return item.content;
		});

		ns.Control.call(this, element);
	};

	inherits(ns.AutoSuggest, ns.Control);

	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------

	/**
	 * The list control responsible for displaying the suggestions
	 */
	attribute(ns.AutoSuggest, "List");

	/**
	 * Class that will be applied to the textbox when it has a caption
	 */
	attribute(ns.AutoSuggest, "CaptionClass");

	/**
	 * The DetailDialog where the List of suggestions will reside
	 */
	attribute(ns.AutoSuggest, "DetailDialog");

	/**
	 * Delay, in ms, that the control waits until it starts processing keys
	 */
	attribute(ns.AutoSuggest, "Delay");

	/**
	 * Template used to render the textbox and the close button - can be
	 * completely customized by the client.
	 */
	attribute(ns.AutoSuggest, "Template");

	/**
	 * A text to be displayed inside the textbox when it is empty and
	 * out of focus. This text will be erased once it receives focus.
	 * If the caption is not set, then the caption class will not be
	 * added.
	 */
	attribute(ns.AutoSuggest, "Caption");

	/**
	 * Callback to be executed when the textbox value is changed.
	 * The delay attribute has no effect here.
	 */
	attribute(ns.AutoSuggest, "OnChange");

	/**
	 * Callback to be executed when the suggestions drop down
	 * is closed.
	 */
	attribute(ns.AutoSuggest, "OnClose");

	/**
	 * Callback to be executed after the delay timer has expired.
	 * Here is where you will add logic to call setSuggestions()
	 * in order to show suggestions.
	 */
	attribute(ns.AutoSuggest, "OnDelay");

	/**
	 * Callback to be executed when the user presses "enter"
	 * while in the textbox.
	 */
	attribute(ns.AutoSuggest, "OnEnter");

	/**
	 * Holds the delay timer. If cleared, the timer will not fire.
	 */
	attribute(ns.AutoSuggest, "Timer");

	/**
	 * Callback to be executed whenever the control needs a textual
	 * value from an item object. This essentially needs to convert
	 * an Item object into a string.
	 */
	attribute(ns.AutoSuggest, "RequestItemValueCallback");

	/**
	 * Whether the suggestions will be highlighted with the text
	 * typed into the textbox or not.
	 *
	 * For custom highlighting logic, set this to false and manually
	 * instantiate the TextHighlighter class after calling renderItems
	 * in your script.
	 */
	attribute(ns.AutoSuggest, "HighlightEnabled");
	
	/**
	 * Whether the suggestion drop down will be resized to be the same
	 * width as the search text box 
	 */
	attribute(ns.AutoSuggest, "SynchSuggestionsWidth");
	
	/**
	 * If set to true, hides the close button if there are no suggestions
	 * opened. 
	 */
	attribute(ns.AutoSuggest, "AutoHideCloseButton");
	
	/**
	 * Will be automatically set to whatever value "items" is on
	 * "setSuggestions". This is useful to retrieve JSON data set by
	 * controls that abstract the setSuggestions method.
	 */
	attribute(ns.AutoSuggest, "Items");
	
	/**
	 * Class that will be applied to the textbox when search icon has to be set.
	 * This attribute will help maintain passivity.
	 */
	attribute(ns.AutoSuggest,"BackgroundClass");

	// ------------------------------------------------------------------------
	// Public Member Methods
	// ------------------------------------------------------------------------
	var prot = ns.AutoSuggest.prototype;

	/**
	 * Renders the template and attaches events to the textbox. The template
	 * must provide a textbox with getTextboxId() as its ID. The variable
	 * "textboxId" will be passed through the context.
	 */
	prot.init = function() {
		var self = this;
		var txtBox = null;

		// --------------------------------------------------------------------
		// Render template
		// --------------------------------------------------------------------
		this.getElement().empty();
		this.getElement().append(this.getTemplate().render({
			"textboxId": this.getTextboxId(),
			"closebtnId": this.getClosebtnId()
		}));
		txtBox = this.getTextbox();
		this.activateCaption();
		this.createDialog();
		this.setListTemplate(MPageControls.getDefaultTemplates().autoSuggestList);
		
		// --------------------------------------------------------------------
		// Textbox events
		// --------------------------------------------------------------------
		txtBox.click(function() {
			self.deactivateCaption();
		});

		txtBox.blur(function() {
			if (self.getValue().length === 0) {
				self.activateCaption();
			}
			
			// Gives a little time to process list click events
			setTimeout(function() {
				var suggestionsContainer = $("#control_" + self.getControlId() + "_content .suggestions");
				//close only if the autosuggest content is not in focus
				if (!suggestionsContainer.is(":focus")) {
					self.close();
				}
			}, 300);
		});

		txtBox.keyup(function(e) {
			self.processTextboxKeyDown(e);
		});

		// ------------------------------------------------------------------------
		// Attach event to the close button
		// ------------------------------------------------------------------------
		$("#" + this.getClosebtnId()).click(function() {
			self.close();
			self.getTextbox()[0].value = "";
			self.activateCaption();
		});
		
		// hide the close button, if necessary
        if (this.getAutoHideCloseButton()) {
           this.hideCloseButton();
        }

	};

	// ________________________________________________________________________

	/**
	 * Handles key presses in the textbox
	 */
	prot.processTextboxKeyDown = function(e) {
		var self = this;
		var dialog = this.getDetailDialog();
		
		// Cleans the timer, if it exists
		if (self.getTimer()) {
			clearTimeout(self.getTimer());
		}

		// Disables the caption if it was enabled
		if (this.getTextbox().hasClass(this.getCaptionClass())) {
			this.getTextbox().removeClass(this.getCaptionClass());
		}
		
		// hides the close button and results if the text is empty. Displays it otherwise
        if (this.getValue().length === 0) {
           this.hideCloseButton();
           if (dialog && dialog.getVisible()) {
        	   this.close();
           }
           return;
        } else {
           $("#" + this.getClosebtnId()).css("display","inline-block"); 
        }
		
		// The "enter" key will close the dialog, if any, and execute the
		// "onEnter" event. It will stop all other processing. Unless there
		// is an item selected in the dropdown. In that case, it will execute
		// the list's onEnter
		if (e.keyCode == 13) {
			
			if (dialog && 
					dialog.getVisible() &&
					this.getList().getSelectedIndex() >= 0) {
				this.getList().getOnEnter()();
				this.close();
				return;
			}
			
			this.close();
			this.getOnEnter()();
			return;
		}

		// binds key events to the list, so we can use the arrows to move
		// between suggestions.
		if (self.getList()) {
			self.getList().processKeyEvent(e);
		}

		// we wont process these keycodes:
		// up arrow, down arrow
		var dontProcess = [38, 40];
		if ($.inArray(e.keyCode, dontProcess) != -1) {
			this.moveCaretToEnd();
			return;
		}
		
		// fires the on change event
		this.getOnChange()();
		
		// ----------------------------------------------------------------
		// Triggers the OnDelay event after waiting "Delay" milliseconds
		// ----------------------------------------------------------------
		var t = setTimeout(function() {
			self.getOnDelay()();

			// we check textbox here because the user can delete the textbox in
			// the delay callback
			if (self.getValue() && self.getValue().length === 0) {
				self.close();
			}
		}, self.getDelay());

		self.setTimer(t);
	};

	// ________________________________________________________________________

	/**
	 * Displays the caption text in the textbox
	 */
	prot.activateCaption = function() {
		if (this.getCaption().length === 0) {
			return;
		}

		this.getTextbox().addClass(this.getCaptionClass());
		this.getTextbox()[0].value = this.getCaption();
		
		// hide the close button
        if (this.getAutoHideCloseButton()) {
            this.hideCloseButton();
        }
	};
	
	// ________________________________________________________________________
	
	/**
	 * Moves the caret position of the textbox to the last character
	 */
	prot.moveCaretToEnd = function() {
		var txtbox = this.getTextbox().get(0);
		var pos = this.getValue().length;
		
		if (txtbox.setSelectionRange) {
			txtbox.setSelectionRange(pos,pos);
			return;
		}
		
		if (txtbox.createTextRange) {
			var range = txtbox.createTextRange();
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	};

	// ________________________________________________________________________
	
	/**
	 * Removes the close button from the search box
	 */
	prot.hideCloseButton = function() {
		$("#" + this.getClosebtnId()).css("display","none");
	};

	// ________________________________________________________________________

	/**
	 * Erases the caption text from the textbox and removes the caption class
	 * from it. Will not fire if the class has already been removed.
	 */
	prot.deactivateCaption = function() {
		if (!this.getTextbox().hasClass(this.getCaptionClass())) {
			return;
		}

		this.getTextbox().removeClass(this.getCaptionClass());
		this.getTextbox()[0].value = "";
	};

	// ________________________________________________________________________

	/**
	 * Returns the textbox element
	 */
	prot.getTextbox = function() {
		return this.getElement().find("#" + this.getTextboxId());
	};

	// ________________________________________________________________________

	/**
	 * Returns the generated textbox element id
	 */
	prot.getTextboxId = function() {
		return "control_" + this.getControlId() + "_textbox";
	};

	// ________________________________________________________________________

	prot.getClosebtnId = function() {
		return "control_" + this.getControlId() + "_closebtn";
	};

	// ________________________________________________________________________

	/**
	 * Closes the suggestion drop down
	 */
	prot.close = function() {
		if (this.getDetailDialog()) {
			this.getDetailDialog().hide();
		}
		
		this.mBlurEnabled = true;
	};

	// ________________________________________________________________________

	/**
	 * Sets the items to be displayed as suggestions. These items should be an
	 * array of objects.
	 */
	prot.setSuggestions = function(items) {
		this.setItems(items);
		
		// No items or no text or caption active, hide it
		if (items.length === 0 || this.getValue().length === 0 || this.getTextbox().hasClass(this.getCaptionClass())) {
			this.close();
			return;
		}
		
		// Synchs the listDiv width, if necessary
		if (this.getSynchSuggestionsWidth()) {
		      $("#control_" + this.getControlId() + "_content").css('min-width', this.getElement().width() + "px");
		}

		this.getList().renderItems(items);
		this.getDetailDialog().show();
		this.getDetailDialog().updatePosition();

		// apply highlighting, if enabled
		if (this.getHighlightEnabled()) {
			var hl = new ns.TextHighlighter(this.getList().getElement());
			hl.highlight(this.getValue());
		}

		var self = this;
		var suggestionsContainer = "#control_" + self.getControlId() + "_content .suggestions";
		//make the suggestions container focusable
		$(suggestionsContainer).attr("tabindex", 0);

		$(suggestionsContainer).on("blur", function() { 
			// Gives a little time to process the blur event
			setTimeout(function() {
				//close the autosuggest content if the search textbox is not focused
				if (self.getElement() && !self.getTextbox().is(":focus")) {
					self.close();
				}
			}, 300);
		});
	};

	// ________________________________________________________________________

	/**
	 * Creates the detail dialog that contains the suggestions
	 */
	prot.createDialog = function() {
		var self = this;

		// creates the div that will contain the list
		var listDiv = $("<div></div>");
		listDiv.appendTo(this.getElement().offsetParent());
		listDiv.attr("id", "control_" + this.getControlId() + "_content");

		// creates the detail dialog that contains the list
		// and is attached to the textbox
		var dd = new ns.DetailDialog(this.getElement(), listDiv);
		dd.setElementCorner(["bottom", "left"]);
		dd.setAlwaysOnTop(true);
		
		// creates the list
		var list = new ns.List(listDiv);

		// When an item is selected, sets the value of the textbox,
		// fires this component's onEnter and closes the list.
		list.setOnSelect(function(item) {
			self.setValue(self.getRequestItemValueCallback()(item));
			self.getOnEnter()();
			self.close();
		});

		this.setList(list);
		this.setDetailDialog(dd);
	};

	// ________________________________________________________________________

	/**
	 * Returns the value that is currently in the textbox
	 */
	prot.getValue = function() {
		if (!this.getElement() || !this.getTextbox().length ) {
			return null;
		}
		
		return this.getTextbox()[0].value;
	};

	// ________________________________________________________________________

	/**
	 * sets the textbox value
	 * @param {Object} value
	 */
	prot.setValue = function(value) {
		this.getTextbox()[0].value = value;
	};

	// ________________________________________________________________________

	/**
	 * Destroys this control and its children controls
	 */
	prot.destroy = function() {
		if (this.getList()) {
			this.getList().destroy();
		}

		if (this.getDetailDialog()) {
			this.getDetailDialog().destroy();
		}
	};
	
	// ________________________________________________________________________
	
	/**
     * Template used to render each item in the suggestion list
     */
	prot.setListItemTemplate = function(template) {
	    this.getList().setItemTemplate(template);
	};
	
	// ________________________________________________________________________
    
    /**
     * Template used to render the list of suggestions
     */
    prot.setListTemplate = function(template) {
        this.getList().setListTemplate(template);
    };
	
	//_________________________________________________________________________
	
	/**
     * Displays the search icon in the textbox
     */
	prot.activateBackground = function() {
		this.getTextbox().addClass(this.getBackgroundClass());
	};

})(jQuery);
/**
 * detail_dialog.js
 * @author Leonardo Sa
 *
 * DetailDialog class
 * ============================================================================
 *
 * Shows a dialog that is attached to an element. This means that
 * it will show next to that element when the show() method is called, similar
 * to drop down menus, except one can make it drop left, right, or even up
 * by changing the ElementCorner and ContentsCorner attributes.
 *
 */

(function($) {
	// ------------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var ns = MPageControls;
	var oo = MPageObjectOriented;
	var inherits = oo.inherits;
	var attribute = oo.createAttribute;

	// -----------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------

	/**
	 * Instantiates a new detail dialog attached to element, where its contents
	 * will be an element defined by contentsElement.
	 */
	ns.DetailDialog = function(element, contentsElement) {
		var defaultHideFx = function(element) {
			element.slideUp(150);
		};

		var defaultShowFx = function(element) {
		    element.slideDown(150);
		};

		this.setAlwaysOnTop(false);
		this.setElementCorner(["bottom", "left"]);
		this.setContentsCorner(["top", "left"]);
		this.setBeforeShow(function() {
		});
		this.setAutoFlipVertical(true);
		this.setAutoFlipHorizontal(true);
		this.setContents(contentsElement);
		this.setShowEffect(defaultShowFx);
		this.setHideEffect(defaultHideFx);
		this.setVisible(false);
		this.setOnShow(function() {
		});
		this.setOnHide(function() {
		});

		// Calls the parent class constructor
		ns.Control.call(this, element);
	};

	inherits(ns.DetailDialog, ns.Control);

	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------

	/**
	 * The contents of the dialog. Since we are using an external library
	 * to render the window, those contents will be used only as a base
	 * to create the dialog. To access the dialog HTML, use the pane()
	 * function.
	 */

	/**
	 * A jQuery effect for showing the dialog
	 */
	attribute(ns.DetailDialog, "ShowEffect");

	/**
	 * A jQuery effect for hiding the dialog
	 */
	attribute(ns.DetailDialog, "HideEffect");

	/**
	 * Whether the dialog is visible or not. This is read only - to change
	 * the visibility, use the hide() and show() functions.
	 */
	attribute(ns.DetailDialog, "Visible");

	/**
	 * Function to be executed after the dialog is shown and the
	 * animation is complete
	 */
	attribute(ns.DetailDialog, "OnShow");

	/**
	 * Function to be executed after the dialog is shown and the
	 * animation is complete
	 */
	attribute(ns.DetailDialog, "OnHide");

	/**
	 * Whether the dialog has been created or not. This is read only
	 * and does not signify that a dialog is visible, only that its
	 * HTML elements have been created.
	 */
	attribute(ns.DetailDialog, "Created");

	/**
	 * Defines to which corner of the element the dialog will attach to
	 */
	attribute(ns.DetailDialog, "ElementCorner");

	/**
	 * Defines which corner of the contents will attach to the element
	 */
	attribute(ns.DetailDialog, "ContentsCorner");

	/**
	 * Defines to which corner of the element the dialog will attach to when being flipped
	 */
	attribute(ns.DetailDialog, "ElementFlippedCorner");

	/**
	 * Defines which corner of the contents will attach to the element when being flipped
	 */
	attribute(ns.DetailDialog, "ContentsFlippedCorner");
	
	/**
	 * Event to be executed right before the dialog is shown
	 */
	attribute(ns.DetailDialog, "BeforeShow");

	/**
	 * Whether the dialog will automatically flip up, down or center if it's near
	 * the edge of the page.
	 */
	attribute(ns.DetailDialog, "AutoFlipVertical");
	
	/**
	 * Whether the dialog will automatically flip left or right if it's near
	 * the edge of the page.
	 */
	attribute(ns.DetailDialog, "AutoFlipHorizontal");
	
	/**
	 * When true, sets the z-index of the dialog to 100 to ensure
	 * it will be above everything else.
	 */
	attribute(ns.DetailDialog, "AlwaysOnTop");
	

	// ------------------------------------------------------------------------
	// Public Member Methods
	// ------------------------------------------------------------------------
	var prot = ns.DetailDialog.prototype;

	prot.init = function() {
	};
	
	// ________________________________________________________________________

    /**
     * Defines a jQuery element to be used as a reference for the autoflip.
     * Sometimes this is necessary if you want the detail dialog to flip
     * when it reaches the end of a certain DIV instead of the window. 
     */
    prot.setFlipReference = function(reference) {
        this.m_flipReference = MPageControls.getId(reference);
    };

    prot.getFlipReference = function() {
       return MPageControls.fromId(this.m_flipReference);
    };

	// ________________________________________________________________________

	/**
	 * Hides or shows the dialog every time this method is called
	 */
	prot.toggle = function() {
		if (this.getVisible()) {
			this.hide();
		}
		else {
			this.show();
		}
	};

	// ________________________________________________________________________

	/**
	 * Updates the position of the dialog in relation to its attached element.
	 * The position will vary according to values of getElementCorner and
	 * getContentsCorner, which specify which corners will be used for alignment.
	 */
	prot.updatePosition = function(elementConnection, contentConnection) {

		// --------------------------------------------------------------------
		// Gets the element x and y
		// --------------------------------------------------------------------
		var element = this.getElement();
		var content = this.getContents();
		
		var elx = 0;
		var ely = 0;
		var elpos = element.offset();
		
		//Make sure we have connections defined
		if(!elementConnection){
			elementConnection = this.getElementCorner();
		}
		
		if(!contentConnection){
			contentConnection = this.getContentsCorner();
		}
		
		switch (elementConnection[0]) {
			case "top":
				ely = elpos.top;
				break;
			case "bottom":
				ely = elpos.top + element.outerHeight();
				break;
		}

		switch (elementConnection[1]) {
			case "left":
				elx = elpos.left;
				break;
			case "right":
				elx = elpos.left + element.outerWidth();
				break;
		}

		// --------------------------------------------------------------------
		// Offsets the x and y with the width and height of the contents
		// --------------------------------------------------------------------
		if (contentConnection[0] == "bottom") {
			ely = ely - content.outerHeight();
		}

		if (contentConnection[1] == "right") {
			elx = elx - content.outerWidth();
		}

		// --------------------------------------------------------------------
		// Compensate coordinates to be relative to parent instead of window
		// --------------------------------------------------------------------
		//This is a special case for IE7 when offsetParent returns the HTML tag which has offset of {top: 2, left: 2} even though it should be {top:0. left:0}.
		var parent = content.offsetParent();
		if(parent.length && parent.prop('tagName') === "HTML"){
			parent = $(document.body);
		}
		var x = elx - parent.offset().left;
		var y = 0;
		
		//windowTop is a special condition where the dialog contents will be hidden if flipped to the opposite side
		//so we use the top of the viewable area for the y offset.
		if(contentConnection[0] == "windowTop"){
			y = parent.offset().top;
		}
		else{
			y = ely - parent.offset().top;
		}

		// --------------------------------------------------------------------
		// Updates the contents
		// --------------------------------------------------------------------
		if (this.getAlwaysOnTop()) {
			this.getContents().css("z-index","100");
		}
		this.getContents().css("position", "absolute");
		this.getContents().css({
			left: x,
			top: y
		}).show();
	};

	// ________________________________________________________________________

	/**
	 * Displays the dialog
	 */
	prot.show = function() {
		if (this.getVisible()) {
			return;
		}

        // show it to calculate the position
		var self = this;
		this.beforeShow();
		this.getContents().css("display", "block");
		this.updatePosition(this.getElementCorner(), this.getContentsCorner());
		
		//Save a copy of the current connection corners for use when we attempt to flip the content
		this.setElementFlippedCorner(this.getElementCorner());
		this.setContentsFlippedCorner(this.getContentsCorner());
		this.autoFlipVertical();
		this.autoFlipHorizontal();
		this.m_OnShow(this);
		this.setVisible(true);
	};

	// ________________________________________________________________________

	/**
	 * This function is used for passivity reasons and will call the updated autoFlipVertical function 
	 */
	prot.autoFlipUp = function(){
		this.autoFlipVertical();
	};

	/**
	 * If the AutoFlipVertical is true and the content is close to the bottom of
	 * the viewport, this will move it to the top instead.  If it then does not fit in the top
	 * it will be positioned so that the top of the content is aligned with the top of the screen.
	 * If the contents still do not fit the content will be scrolled and a max-height will be set
	 * on the content element container. 
	 */
	prot.autoFlipVertical = function() {
		var anchorVertical = "";
		//Check to see if we should attempt to auto flip
		if (!this.getAutoFlipVertical()) {
			return;
		}
		
		//Get the bottom edge of the window based on the scrolled position and the window height
		var windowEdge = $(window).scrollTop() + $(window).height();
		var contents = this.getContents();
		// If we have a flip reference, then we will use that as the edge instead of the window element
		if (this.getFlipReference()) {
		  //May need to apply scrollTop() to the filp reference if it is scrolled
		  windowEdge = this.getFlipReference().offset().top + parseInt(this.getFlipReference().outerHeight(), 10);
		}
		var contentHeight = parseInt(contents.outerHeight(), 10);
		var contentTop = contents.offset().top;
		var bottomEdge = contentTop + contentHeight;
		if (bottomEdge >= windowEdge) {
			anchorVertical = (this.getElementFlippedCorner()[1] == this.getContentsFlippedCorner()[1]) ? "top" : "bottom";
			if(contentTop <= contentHeight){
				//Check to see if the dialog is larger than the screen.  If so we will scroll its content.
				if(contentHeight >= windowEdge){
					//Reduce the size of the content container plus some padding
					contents.outerHeight(windowEdge - 10);
					//Expand the menu width to account for the scroll bar
					contents.outerWidth(contents.outerWidth() + 17);
					//Apply scrolling to the container
					contents.css("overflow-y", "auto");
				}
				//Flipping the content up will still hide some of the content so we will align it with the top of the screen
				this.setElementFlippedCorner([anchorVertical, this.getElementFlippedCorner()[1]]);
				this.setContentsFlippedCorner(["windowTop", this.getContentsFlippedCorner()[1]]);
				this.updatePosition(this.getElementFlippedCorner(), this.getContentsFlippedCorner());
			}
			else{
				//Flipping the menu up will let it show all of its contents
				this.setElementFlippedCorner([anchorVertical, this.getElementFlippedCorner()[1]]);
				this.setContentsFlippedCorner(["bottom", this.getContentsFlippedCorner()[1]]);
				this.updatePosition(this.getElementFlippedCorner(), this.getContentsFlippedCorner());
			}
		}
	};

	// ________________________________________________________________________

	
	/**
	 * If the AutoFlipHorizontal is true and the content is close to edge of
	 * the viewport, this will move it to the opposite side.
	 */
	prot.autoFlipHorizontal = function() {
		//Check to see if we should attempt to flip horizontally
		if (!this.getAutoFlipHorizontal()) {
			return;
		}
		
		//Get the viewport edge offsets
		var windowRightEdge = $(window).width();
		var windowLeftEdge = 0;
		var flipReference = this.getFlipReference();
		// if we have a flip reference, then we will use that as the edge instead
		if (flipReference) {
			windowLeftEdge = flipReference.offset().left;
			windowRightEdge = windowLeftEdge + parseInt(flipReference.outerWidth(), 10);
		}
		//Get the dialog edge offsets
		var dialogLeftEdge = this.getContents().offset().left;
		var dialogRightEdge = dialogLeftEdge + parseInt(this.getContents().outerWidth(), 10);
		
		//Flip the dialog if necessary
		if(dialogLeftEdge < windowLeftEdge){
			//Dialog left edge is less than the viewport left edge so we will flip right
			this.updatePosition([this.getElementFlippedCorner()[0], "right"], [this.getContentsFlippedCorner()[0], "left"]);
		}
		else if(dialogRightEdge > windowRightEdge){
			//Dialog right edge is greater than the viewport left edge so we will flip left
			this.updatePosition([this.getElementFlippedCorner()[0], "left"], [this.getContentsFlippedCorner()[0], "right"]);
		}
	};

	// ________________________________________________________________________

	/**
	 * Hides the dialog
	 */
	prot.hide = function() {
		if (!this.getVisible()) {
			return;
		}

		this.getContents().css("display", "none");
		this.setVisible(false);
		this.m_OnHide(this);
	};

	// ________________________________________________________________________

	/**
	 * Executed before showing the dialog. Is a wrapper for the beforeShow
	 * event.
	 */
	prot.beforeShow = function() {
		this.getBeforeShow()(this);
	};

	// ________________________________________________________________________

	/**
	 * Destroys the HTML elements inside the dialog, along with the dialog
	 * itself.
	 */
	prot.destroy = function() {
	    if (this.getContents()) {
		  this.getContents().remove();
		}
		this.setVisible(false);
		this.setCreated(false);
	};
})(jQuery);
/**
 * drop_down.js
 * @author Leonardo Sa
 *
 * DropDown Class
 * ============================================================================
 *
 * Abstract base for other drop down classes. Connects a detail dialog with a selector 
 * in order to form a drop down like control. Also, makes it possible to change 
 * or set a value by calling get/setValue.
 *
 */
(function($) {
	// -----------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var ns = MPageControls;
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.DropDown = function(element, contentsElement, defaultValue) {

        if (element) {
            this.setSelector(new ns.Selector(element, "selected", "unselected"));
        }

		if (contentsElement) {
			this.setContents(contentsElement);
		}
		
		this.setOnShow(function() {
		});
		this.setOnHide(function() {
		});
		this.setOnSelect(function() {
		});
		this.setDisabledCssClass("disabled");

		this.m_value = defaultValue;

		ns.Control.call(this, element);
	};

	inherits(ns.DropDown, ns.Control);

	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------

	/**
	 * The DetailDialog that contains the menu content
	 */
	attribute(ns.DropDown, "DetailDialog");

	/**
	 * The selector that triggers the DetailDialog
	 */
	attribute(ns.DropDown, "Selector");

	/**
	 * Function to be executed when the drop down is shown
	 */
	attribute(ns.DropDown, "OnShow");

	/**
	 * Function to be executed when the drop down has been hidden
	 */
	attribute(ns.DropDown, "OnHide");

	/**
	 * Function to be executed when an item is selected
	 */
	attribute(ns.DropDown, "OnSelect");

    /**
     * Whether the drop down will be clickable to be displayed or not
     */
    attribute(ns.DropDown, "Enabled");

    /**
     * Class to be added to the Selector when this control is disabled
     */
     attribute(ns.DropDown, "DisabledCssClass");

	// ------------------------------------------------------------------------
	// Public Member Methods
	// ------------------------------------------------------------------------
	
	var prot = ns.DropDown.prototype;

	/**
	 * Generates the root node with a tree of nodes and updates the contents
	 * of the DetailDialog with the generated <ul>s from the Node.
	 */
	prot.init = function() {
		this.setDetailDialog(new ns.DetailDialog(this.getElement(), this.getContents()));

        if (!this.getSelector()) {
            this.setSelector(new ns.Selector(this.getElement(), "selected", "unselected"));
        }

		var self = this;
		this.getSelector().setOnSelect(function() {
			self.getDetailDialog().show();
		});

		this.getSelector().setOnUnselect(function() {
			self.getDetailDialog().hide();
		});

		this.getDetailDialog().setOnShow(function() {
			// make sure this will be above everyone else
			self.getDetailDialog().getContents().css("z-index", "7000");
			self.onShow();
		});

		this.getDetailDialog().setOnHide(function() {
			self.m_OnHide(self);
		});

		// this is needed to force updating the value of the textbox
		this.setValue(this.getValue());
	};

	// ________________________________________________________________________

	prot.setValue = function(value) {
		this.m_value = value;
		
		if (this.getElement()) {
		  this.getElement().html(value);
		}
	};
	
	// ________________________________________________________________________

	prot.onShow = function() {
		this.m_OnShow(this);
	};
	
	// ________________________________________________________________________

	prot.getValue = function() {
		if (!this.getDetailDialog()) {
            return "";
        }
		
		return this.m_value;
	};
	
	// ________________________________________________________________________

	/**
	 * Shows the drop down list
	 */
	prot.show = function() {
	    if (!this.getDetailDialog()) {
	        return;
	    }
	    
		this.getDetailDialog().show();
	};
	
	// ________________________________________________________________________

	/**
	 * Hides the drop down list
	 */
	prot.hide = function() {
	    if (!this.getDetailDialog()) {
	        return;
	    }
	    
		this.getDetailDialog().hide();
		this.getSelector().unselect();
	};
	
	// ________________________________________________________________________

	/**
	 * Erases the drop down list from the DOM
	 */
	prot.destroy = function() {
	    if (!this.getDetailDialog() || !this.getElement()) {
	        return;
	    }
	    
		this.getDetailDialog().destroy();
		this.getElement().remove();
	};

	// ________________________________________________________________________

	prot.disable = function() {
	    this.m_Enabled = false;
	    this.hide();
	    this.getSelector().setEnabled(false);
	    this.getSelector().getElement().addClass(this.getDisabledCssClass());
	};

	// ________________________________________________________________________

	prot.enable = function() {
	    this.m_Enabled = true;
	    this.getSelector().setEnabled(true);
	    this.getSelector().getElement().removeClass(this.getDisabledCssClass());
	};

	// ________________________________________________________________________

	prot.setEnabled = function(val) {
	    if (val) {
	        this.enable();
	    } else {
	        this.disabled();
	    }
	};

})(jQuery);
/**
 * drop_down_list.js
 * @author Leonardo Sa
 *
 * DropDownNested Class
 * ============================================================================
 *
 * Renders a drop down list attached to the specified element.
 * The drop down list data can be provided in the form of a tree, causing the actual
 * drop down menu to appear nested into different levels. The tree format must
 * follow the standard set on DropDownNested.Node class.
 *
 * It uses a DetailDialog as the generator for the list. Therefore, to change
 * its position, one can change the associated DetailDialog alignment.
 *
 */
(function($) {
    // ------------------------------------------------------------------------
    // Imports
    // ------------------------------------------------------------------------
	var ns = MPageControls;
	var attribute = MPageObjectOriented.createAttribute;
    var inherits = MPageObjectOriented.inherits;
    
	// -----------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.DropDownNested = function(element, tree) {
        this.setSelector(new ns.Selector(element, "selected", "unselected"));
        this.setOnShow(function() {
        });
        this.setOnHide(function() {
        });
        this.setOnSelect(function() {
        });
        this.setTree(tree);

		ns.Control.call(this, element);
	};

	inherits(ns.DropDownNested, ns.Control);
	var prot = ns.DropDownNested.prototype;

    // ------------------------------------------------------------------------
    // Attributes
    // ------------------------------------------------------------------------

    /**
     * The DetailDialog that contains the menu content
     */
    attribute(ns.DropDownNested, "DetailDialog");

    /**
     * The selector that triggers the DetailDialog
     */
    attribute(ns.DropDownNested, "Selector");

    /**
     * Data for the list
     */
    attribute(ns.DropDownNested, "Tree");

    /**
     * Root node element of the tree, once the tree is parsed
     */
    attribute(ns.DropDownNested, "RootNode");

    /**
     * Function to be executed when the drop down is shown
     */
    attribute(ns.DropDownNested, "OnShow");

    /**
     * Function to be executed when the drop down has been hidden
     */
    attribute(ns.DropDownNested, "OnHide");

    /**
     * Function to be executed when an item is selected
     */
    attribute(ns.DropDownNested, "OnSelect");

    /**
     * Returns the current selected node in the tree. It is
     * updated by the select() method.
     */
    attribute(ns.DropDownNested, "SelectedNode");

	// ------------------------------------------------------------------------
	// Inner Classes
	// ------------------------------------------------------------------------

	/**
	 * Represents a single node in a tree structure.
	 *
	 * This constructor will build an entire node tree according to JsonData
	 * and the provided arguments. If you are making a root node, parentNode
	 * can be null. ParentDropDown will be the same for all nodes in the tree.
	 *
	 * JsonData needs to be provided according to the following standard:
	 *
	 * var jsonData = {
	 *     name: "root",
	 *     children: [
	 *          {name: "Child 1" },
	 *          {
	 *           name: "Child 2",
	 *           children: [ ... ]
	 *          }
	 *     ]
	 * }   
	 *
	 * @param {Object} jsonData
	 * @param {Object} parentNode
	 * @param {Object} parentDropDown
	 */
	ns.DropDownNested.Node = function(jsonData, parentNode, parentDropDown) {
		this.children = [];
		this.parent = parentNode;
		this.dropDown = parentDropDown;
		var self = this;

		$.each(jsonData, function(k, v) {
			if (k == "children") {
				$.each(v, function() {
					self.children.push(new ns.DropDownNested.Node(this, self, parentDropDown));
				});
			}
			else {
				self[k] = v;
			}
		});
	};

	// ________________________________________________________________________

	/**
	 * Appends a series of nested lists of <ul> and <li> tags based on the tree
	 * structure of the current node. Also, attaches dropdown.select() to the
	 * on click event of each <li>.
	 *
	 * @param {Object} parentElement
	 */
	ns.DropDownNested.Node.prototype.makeElement = function(parentElement) {
		var current = $("<li></li>").html(this.name);
		var self = this;
		$(current).click(function() {
			self.dropDown.select(self);
		});
		parentElement.append(current);

		var rootUl = "";
		if (this.children.length > 0) {
			rootUl = $("<ul></ul>");
			$.each(this.children, function() {
				this.makeElement(rootUl);
			});
		}
		parentElement.append(rootUl);

		return current;
	};

	// ------------------------------------------------------------------------
	// Public Member Methods
	// ------------------------------------------------------------------------

	/**
	 * Generates the root node with a tree of nodes and updates the contents
	 * of the DetailDialog with the generated <ul>s from the Node.
	 */
	prot.init = function() {
		this.setRootNode(new ns.DropDownNested.Node(this.getTree(), null, this));
		var id = "controlContents" + this.getControlId();
		var rootUl = $("<ul></ul>");
		this.getRootNode().makeElement(rootUl);
		
		// we exclude the root node here
		var menuContent = $("<div></div>");
		menuContent.attr("id", id);
		menuContent.append(rootUl.children("ul"));
		menuContent.appendTo($("body"));
		
		this.setDetailDialog(new ns.DetailDialog(this.getElement(), menuContent));
		var self = this;
		this.getSelector().setOnSelect(function() {
			self.getDetailDialog().show();
		});
		this.getSelector().setOnUnselect(function() {
			self.getDetailDialog().hide();
		});
		this.getDetailDialog().setOnShow(function() {
			// make sure this will be above everyone else
			self.getDetailDialog().getContents().css("z-index", "7000");
			self.m_OnShow(self);
		});
		this.getDetailDialog().setOnHide(function() {
			self.m_OnHide(self);
		});
	};

	// ________________________________________________________________________

	/**
	 * Marks a node as selected, causing the drop down list to hide and its
	 * value to change.
	 *
	 * @param {Object} node
	 */
	prot.select = function(node) {
		this.getElement().html(node.name);
		this.setSelectedNode(node);
		this.getSelector().unselect();
		this.m_OnSelect(node);
	};

	// ________________________________________________________________________

	/**
	 * Shows the drop down list
	 */
	prot.show = function() {
		this.getDetailDialog().show();
	};
	// ________________________________________________________________________

	/**
	 * Hides the drop down list
	 */
	prot.hide = function() {
		this.getDetailDialog().hide();
	};
	// ________________________________________________________________________

	/**
	 * Erases the drop down list from the DOM
	 */
	prot.destroy = function() {
		this.getDetailDialog().destroy();
		this.getElement().remove();
	};
})(jQuery);
/**
 * drop_down_list.js
 * @author Leonardo Sa
 *
 * DropDownTree Class
 * ============================================================================
 *
 * Renders a detail dialog which contains a tree, usually used to lazy load
 * folders. The main difference between this control and the drop down list
 * is that this control can expand and controct folders, and perform ajax
 * calls for the folders
 *
 */

(function($) {
	// ------------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var ns = MPageControls;
	var DropDown = MPageControls.DropDown;
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;
	var Tree = MPageControls.Tree;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.DropDownTree = function(element) {
		this.setTreeCreated(false);
		this.setOnSelect(function() {
		});
		this.setOnCreate(function() {
		    
		});
        DropDown.call(this, element, null);
	};

	inherits(ns.DropDownTree, DropDown);

	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------
	attribute(ns.DropDownTree, "Tree");
	attribute(ns.DropDownTree, "TreeCreated");
	attribute(ns.DropDownTree, "OnLazyRead");
	attribute(ns.DropDownTree, "OnCreate");
	attribute(ns.DropDownTree, "OnSelect");

	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	var prot = ns.DropDownTree.prototype;

	prot.init = function() {
		var content = $("<div></div>");

        content.appendTo(this.getElement().offsetParent());
        content.attr("id", "content" + this.getControlId());
        this.setContents(content);
		
		DropDown.prototype.init.call(this);
		
		var self = this;
		this.getDetailDialog().setBeforeShow(function() {
			self.beforeShow();
		});
		
	};

    prot.setTreeElement = function(element) {
        this.mTreeElement = MPageControls.getId(element);
    };
    
    prot.getTreeElement = function() {
      return MPageControls.fromId(this.mTreeElement);  
    };

	// ________________________________________________________________________

	prot.create = function() {
		var self = this;
		var treeElement = $("<div class='dynatree'></div>").appendTo(this.getContents());
		var id = "treeElement" + this.getControlId();
		treeElement.attr("id", id);
		
		this.setTreeElement(treeElement);
		this.setTree(new MPageControls.Tree(this.getTreeElement()));
		this.getTree().setOnSelect(function(node) {
			self.onSelect(node);
		});
		this.getOnCreate()();
		this.setTreeCreated(true);
	};

	// ________________________________________________________________________

	prot.onSelect = function(node) {
		this.setValue(node.data.title);
		this.getSelector().unselect();
	};

	// ________________________________________________________________________

    /**
     * Returns the node that has been selected by the user mouse click 
     */
	prot.getSelectedNode = function() {
		if (this.getTree() === null || this.getTree() === undefined) {
			return null;
		}

		return this.getTree().getSelectedNode();
	};
	// ________________________________________________________________________

	/**
	 * Is executed before the tree is shown, and automatically triggers lazy
	 * loading if the tree hasn't been initialized yet.
	 */
	prot.beforeShow = function() {
		if (this.getTreeCreated()) {
			return;
		}

		this.create();
		if (this.getOnLazyRead()) {
			this.getTree().setOnLazyRead(this.getOnLazyRead());
		}
	};

})(jQuery);
(function($) {
	var ns = MPageControls;
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	
	
	/**
	 * Serves as a generic container for any functionality that can be applied 
	 * to a range of controls
	 */
	ns.Group = function() {
		this.setControls([]);
		this.setCurrent(null);
	};
	
	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------
	
	/**
	 * An array of mpage controls – or any other object that has select() and
	 * unselect() methods
	 */
	attribute(ns.Group, "Controls");
	
	/**
	 * The control(s) that are/is currently selected.
	 */
	attribute(ns.Group, "Current");

	// ------------------------------------------------------------------------
	// Member methods
	// ------------------------------------------------------------------------
	
	var prot = ns.Group.prototype;
	
	/**
	 * Appends a new control to the controls array
	 */
	prot.add = function(control) {
		this.getControls().push(control);
	};
	
	// ________________________________________________________________________
	
	/**
	 * Loops through the control array and executes unselect() on all the 
	 * controls that are different than the one specified in the argument.
	 * Control.select() will then be performed.
	 *  
	 *  @param control the control to be selected
	 */
	prot.selectSingle = function(control) {
		this.unselectAllExcept(control);
		control.select();	
	};
	
	// ________________________________________________________________________
	
	/**
	 * Calls unselect on all controls except the one specified in the parameter
	 */
	prot.unselectAllExcept = function(control) {
		var controls = this.getControls();
		
		for (var i=controls.length;i--;) {
			if (controls[i].unselect && controls[i] != control) {
				controls[i].unselect();
			}
		}
		
		this.setCurrent(control);
	};

    // ________________________________________________________________________

    /**
     * Executes fun for each item in the group
     * @param fun
     */
    prot.each = function(fun) {
        var controls = this.getControls();
        for (var i=controls.length;i--;) {
            fun(controls[i]);
        }
    };

})(jQuery);(function($) {
	var ns = MPageControls;
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.List = function(element) {
		var self = this;

		ns.Control.call(this, element);
		this.setSelectedIndex(-1);
		this.setSelectedOption(0);
		this.setListTemplate(MPageControls.getDefaultTemplates().list);
		this.setItemTemplate(MPageControls.getDefaultTemplates().listItem);
		this.setHighlightClass("current");
		this.setSelectedOptionClass("selected-option");
		this.setOnSelect(function() {
		});
		this.setOnMoveUp(function() {
		});
		this.setOnMoveDown(function() {
		});
		this.setOnKeyDown(function() {
		});
		this.setOnDblClick(function() {
		});

		// By default, when pressing the enter key the control will perform
		// a select. This can be changed by the user by setting another
		// onEnter function.
		this.setOnEnter(function() {
			self.select(self.getSelectedIndex());
		});
	};

	inherits(ns.List, ns.Control);

	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------
	attribute(ns.List, "SelectedIndex");
	attribute(ns.List, "ListTemplate");
	attribute(ns.List, "ItemTemplate");
	attribute(ns.List, "Items");
	attribute(ns.List, "OnSelect");
	attribute(ns.List, "OnMoveUp");
	attribute(ns.List, "OnMoveDown");
	attribute(ns.List, "OnEnter");
	attribute(ns.List, "OnKeyDown");
	attribute(ns.List, "OnDblClick");
	attribute(ns.List, "HighlightClass");
	attribute(ns.List, "DisplayKey");
	attribute(ns.List, "SelectedOption");
	attribute(ns.List, "SelectedOptionClass");



	// ------------------------------------------------------------------------
	// Public Member Methods
	// ------------------------------------------------------------------------
	var prot = ns.List.prototype;

	prot.init = function() {

	};

	/**
	 * Can be overriden to provide custom item processing logic
	 */
	prot.makeItem = function(item) {
	    if (!item.content) {
	        item.content = item[this.getDisplayKey()];
	    }

	    return item;
	};

	// ________________________________________________________________________

	/**
	 * Highlights the item placed before the currently selected item
	 */
	prot.moveUp = function() {
		if (this.getSelectedIndex() <= 0) {
			this.setSelectedIndex(0);
		}
		else {
			this.setSelectedIndex(this.getSelectedIndex() - 1);
		}
		var listDiv = $(this.getElement()).children();
		//Scroll up when current item is at the top
		var index = this.getSelectedIndex();
		var curItemDiv = listDiv.children().eq(index);
		//Calculate distance from item's top to list's top
		var itemTopY = curItemDiv.position().top;
		if (itemTopY < 0) {
			listDiv.scrollTop(listDiv.scrollTop() + itemTopY);
		}
		this.highlight(index);
		this.getOnMoveUp()(this.getSelectedItem());
	};

	// ________________________________________________________________________

	/**
	 * Highlights the item placed after the currently selected item
	 */
	prot.moveDown = function() {
		if (this.getSelectedIndex() >= this.getItems().length - 1) {
			this.setSelectedIndex(this.getItems().length - 1);
		}
		else {
			this.setSelectedIndex(this.getSelectedIndex() + 1);
		}
		var listDiv = $(this.getElement()).children();
		//Scroll down when current item is at the bottom
		var index = this.getSelectedIndex();
		var curItemDiv = listDiv.children().eq(index);
		//Calculate distance from item's bottom to list's bottom
		var itemBottomYDistance = curItemDiv.position().top + curItemDiv.outerHeight(true) - listDiv.height();
		if (itemBottomYDistance > 0) {
			listDiv.scrollTop(listDiv.scrollTop() + itemBottomYDistance);
		}
		
		this.highlight(index);
		this.getOnMoveDown()(this.getSelectedItem());
	};

	// ________________________________________________________________________

	/**
	 * Highlights the item at the specified index.
	 *
	 * @param {int} index The index to be selected
	 */
	prot.highlight = function(index) {
		// Removes highlight from other items
		this.getElement().find("." + this.getHighlightClass()).removeClass(this.getHighlightClass());

		// Adds highlight to the current element
		this.getElement().find("#" + this.getIdByIndex(index)).addClass(this.getHighlightClass());
	};
	
	// ________________________________________________________________________

	/**
	*Highlight s the current selected option
	*
	*@param {int} index The index to be selected
	*/

	prot.highlightSelectedOption = function(index) {
		var selectedOption = this.getSelectedOption();
		// When the list is clicked for the first time, highlight the current option
		if(index < 0 && selectedOption === 0){
			this.getElement().find("#" + this.getIdByIndex(selectedOption)).addClass(this.getSelectedOptionClass());		
			this.getElement().find("#" + this.getIdByIndex(index)).removeClass(this.getSelectedOptionClass());	
		}
		//When any item other than the first one is selected.
		if(index > 0 || selectedOption > 0){
			this.getElement().find(".selected-item").removeClass(this.getSelectedOptionClass());
			this.getElement().find("#" + this.getIdByIndex(selectedOption)).addClass(this.getSelectedOptionClass());	
		}
	};

	/**
	 * Get the current item. Index <=-1 assume not item is selected, so it will return null 
	 */
	prot.getSelectedItem = function() {
		if (this.getSelectedIndex() <= -1) {
			return null;
		}

		var items = this.getItems();

		return items[this.getSelectedIndex()];
	};

	/**
	 * Highlights and marks the provided item as the selected one.
	 * Will not trigger any events.
	 *
	 * @param item
	 */
	prot.setSelectedItem = function(item) {
		var index = this.getItemIndex(item);
		this.setSelectedIndex(index);
		this.highlight(index);
	};

	/**
	 * Returns the position of the provided item in the list
	 *
	 * @param item
	 */
	prot.getItemIndex = function(item) {
		var items = this.getItems();
		for (var i=items.length; i--;) {
			if (items[i] == item) {
				return i;
			}
		}
		return -1;
	};

	// ________________________________________________________________________

	prot.renderItems = function(items) {
		var self = this;
		this.setItems(items);
		this.setSelectedIndex(-1);
		
		// --------------------------------------------------------------------
		// Render items
		// --------------------------------------------------------------------
		var renderedItems = [];
		$.each(items, function(i, item) {
		    item = self.makeItem(item);
			item._elementId = self.getIdByIndex(i);
			var rendered = self.getItemTemplate().render(item);
			renderedItems.push(rendered);

			// Attaches the click event of the item to the select method
			rendered.click(function() {
				(function(index) {
					self.select(index);
				})(i);
			});
			
			// Attaches the click event of the item to the select method
			rendered.dblclick(function() {
				(function(index) {
					self.doubleClick(index);
				})(i);
			});

		});
		
		// --------------------------------------------------------------------
		// Renders the list
		// --------------------------------------------------------------------
		var list = this.getListTemplate().render({
			"items": renderedItems,
			"listId": this.getListId()
		});
		this.getElement().empty();
		this.getElement().append(list);

		// --------------------------------------------------------------------
		// Attaches key press events
		// --------------------------------------------------------------------
		list.keydown(function(e) {
			self.processKeyEvent(e);
		});
	};

    // ________________________________________________________________________

	prot.processKeyEvent = function(e) {
		this.getOnKeyDown()(e);
		switch(e.keyCode) {
			case(40):
				e.preventDefault();
				this.moveDown();
				break;
			case(38):
				e.preventDefault();
				this.moveUp();
				break;
			case(13):
				this.getOnEnter()();
				break;
		}
	};
	
	// ________________________________________________________________________

	prot.select = function(index) {
	    if (typeof index === "undefined" || index === null) {
	        index = this.getSelectedIndex();
	    }
		this.setSelectedIndex(index);
		this.highlight(index);
		this.getOnSelect()(this.getSelectedItem());
		this.setSelectedOption(index);
	};
	
	// ________________________________________________________________________

	prot.doubleClick = function(index) {
		//doesn't need to set index or highlight, because onclick -> select function will do it.  
		this.getOnDblClick()(this.getSelectedItem());
	};


	// ________________________________________________________________________

	prot.getIdByIndex = function(index) {
		return "controls_" + this.getControlId() + "_" + index;
	};
	// ________________________________________________________________________

	prot.getListId = function() {
		return "controls_" + this.getControlId() + "_list";
	};
	// ________________________________________________________________________

	prot.focus = function() {
		$("#" + this.getListId()).focus();
	};
	// ________________________________________________________________________

	prot.destroy = function() {
		this.getElement().remove();
	};
})(jQuery);
/**
 * drop_down_list.js
 * @author Leonardo Sa
 *
 * Modeless Class
 * ============================================================================
 *
 * Renders a drop down list attached to the specified element. The only difference
 * between this class and the detaildialog class is that modeless windows can only
 * be opened one at a time.
 *
 */
(function($) {
	// ------------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var ns = MPageControls;
	var oo = MPageObjectOriented;
	var inherits = oo.inherits;
	var attribute = oo.createAttribute;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.Modeless = function(element, contentsElement) {
		this.setOnForceHide(function() {
		});
		ns.DetailDialog.call(this, element, contentsElement);
	};
	
	/**
	 * hides the last shown modeless instance
	 */
	ns.Modeless.hide = function() {
		
		if (ns.Modeless.visibleInstance && ns.Modeless.visibleInstance.getVisible()) {
			ns.Modeless.visibleInstance.hide();
			ns.Modeless.visibleInstance.getOnForceHide()();
		}
	};
	
	
	ns.Modeless.visibleInstance = null;
    inherits(ns.Modeless, ns.DetailDialog);

    // ------------------------------------------------------------------------
    // Attributes
    // ------------------------------------------------------------------------

	/**
	 * Callback executed when the modeless is forced to hide because another
	 * one is about to be shown
	 */
	attribute(ns.Modeless, "OnForceHide");

	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	var prot = ns.Modeless.prototype;
	
	prot.show = function() {
		ns.Modeless.hide();
		ns.DetailDialog.prototype.show.call(this);
		ns.Modeless.visibleInstance = this;
	};

})(jQuery);
/**
 * selector.js
 * @author Leonardo Sa
 *
 * Selector class
 * ============================================================================
 * A simple selector that alternates between two css classes on click, much
 * like a checkbox would do. The css styles can be specified in the constructor.
 */
(function($) {
    // -----------------------------------------------------------------------
    // Imports
    // ------------------------------------------------------------------------
	var ns = MPageControls;
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	ns.Selector = function(element, selClass, unselClass) {
		this.setIsSelected(false);
		this.setEnabled(true);
		this.setSelectedClass(selClass);
		this.setUnselectedClass(unselClass);
		this.setUnselectOnClickEnabled(true);
		this.setOnSelect(function() {
		});
		this.setOnUnselect(function() {
		});
        this.setDisabledClass("dithered");

		ns.Control.call(this, element);
	};
	
	// -----------------------------------------------------------------------
    // Attributes
    // ------------------------------------------------------------------------

	/**
	 * The CSS class to be applied to the element when it is selected
	 */
	attribute(ns.Selector, "SelectedClass");

	/**
	 * The CSS class to be applied to the element when it is unselected
	 */
	attribute(ns.Selector, "UnselectedClass");

	/**
	 * Whether the control has been selected or not
	 */
	attribute(ns.Selector, "IsSelected");

	/**
	 * Event fired on select
	 */
	attribute(ns.Selector, "OnSelect");

	/**
	 * Event fired on unselect
	 */
	attribute(ns.Selector, "OnUnselect");
	
	/**
	 * Whether the star will toggle when clicked on 
	 */
	attribute(ns.Selector, "Enabled");

    /**
     * CSS class to be applied to the element when it is set to enabled = false.
     * Defaults to "dithered". The class will be removed once the element is enabled.
     */
	attribute(ns.Selector, "DisabledClass");

	/**
	 * If set to false, the selector will not unselect after it is
	 * selected on a click event. Direct calls to select() will
	 * still work.
	 */
	attribute(ns.Selector, "UnselectOnClickEnabled");

	inherits(ns.Selector, ns.Control);
	var prot = ns.Selector.prototype;

	// ------------------------------------------------------------------------
	// Public Member Methods
	// ------------------------------------------------------------------------

	prot.init = function() {
		var self = this;
		this.getElement().addClass(this.getUnselectedClass());
		this.bind("click", this.getElement(), function() {
			if (self.getIsSelected() && !self.getUnselectOnClickEnabled()) {
				return;
			}
			
		    if (self.getEnabled()) {
			 self.toggle();
			}
		});

		if (this.getIsSelected()) {
			this.performSelection();
		}
		else {
			this.performUnselection();
		}
	};

	// ________________________________________________________________________

	/**
	 * Toggles the selector to select() or unselect()
	 */
	prot.toggle = function() {
		if (this.getIsSelected()) {
			this.unselect();
		}
		else {
			this.select();
		}
	};

	// ________________________________________________________________________

	/**
	 * Triggers the selection of the control
	 */
	prot.select = function() {
		if (this.getIsSelected()) {
			return;
		}

		this.performSelection();
		this.m_OnSelect(this);
	};
    
    // ________________________________________________________________________

	prot.performSelection = function() {
		if (this.getUnselectedClass() !== undefined) {
			this.getElement().removeClass(this.getUnselectedClass());
		}
		
		this.getElement().addClass(this.getSelectedClass());
		this.setIsSelected(true);
	};

	// ________________________________________________________________________

	/**
	 * Triggers the unselection of the control
	 */
	prot.unselect = function() {
		if (!this.getIsSelected()) {
			return;
		}

		this.performUnselection();
		this.m_OnUnselect(this);
	};

    // ________________________________________________________________________

	prot.performUnselection = function() {
		if (this.getSelectedClass() !== undefined) {
			this.getElement().removeClass(this.getSelectedClass());
		}
		
		this.getElement().addClass(this.getUnselectedClass());
		this.setIsSelected(false);
	};

	// ________________________________________________________________________

	prot.destroy = function() {
		this.destroyEvents();
	};

    // ________________________________________________________________________

    prot.setEnabled = function(value) {
        this.m_Enabled = value;

        if (!this.getElement()) { return; }

        if (value) {
            this.getElement().removeClass(this.getDisabledClass());
        } else {
            this.getElement().addClass(this.getDisabledClass());
        }
    };

})(jQuery); (function($) {
	var ns = MPageControls;
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	/**
	 * A control that represents a single tab, which can be added to a tab 
	 * group. 
	 */
	ns.Tab = function() {
		this.setButtonTemplate(null);
		this.setButtonSelectedClass("selected");
		this.setContentUnselectedClass("hidden");
		this.setOnSelect(function() {});
		this.setOnUnselect(function() {});
		this.setOnRender(function() {});
		this.setEnabled(true);
		
		ns.Control.call(this, null);
	};
	
	inherits(ns.Tab, ns.Control);
	
	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------
	
	/**
	 * The name of the tab. It is not used by this class itself, but is a
	 * standardized way for derived class to set the title.
	 */
	attribute(ns.Tab, "Title");
	
	/**
	 * A selector that represents the button which the user will click to 
	 * select the tab.
	 */
	attribute(ns.Tab, "Button");
	
	/**
	 * A selector that represents the contents of the tab
	 */
	attribute(ns.Tab, "Content");
	
	/**
	 * A string-template that will be used when rendering the button
	 */
	attribute(ns.Tab, "ButtonTemplate");
	
	/**
	 * The CSS class to be applied when the tab button is selected. Will
	 * default to "selected"
	 */
	attribute(ns.Tab, "ButtonSelectedClass");
	
	/**
	 * The CSS class to be applied when a tab is not selected. Will default to
	 * "hidden"
	 */
	attribute(ns.Tab, "ContentUnselectedClass");
	
	/**
	 * Callback executed whenever the tab is selected.
	 */
	attribute(ns.Tab, "OnSelect");
	
	/**
	 * Callback executed whenever the tab is unselected
	 */
	attribute(ns.Tab, "OnUnselect");
	
	/**
	 * Whether the tab can be selected or not
	 */
	attribute(ns.Tab, "Enabled");
	
	/**
	 * Callback executed whenever the tab is rendered. Tabs are initially 
	 * rendered all at the same time, hence lazy loading functions should be 
	 * placed inside OnSelect instead.
	 */
	attribute(ns.Tab, "OnRender");
	
	
	/**
	 * The tab group that this tab belongs to
	 */
	attribute(ns.Tab, "TabGroup");
	
	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	
	var prot = ns.Tab.prototype;
	
	/**
	 * Returns the ID to be used for the button div
	 */
	prot.getButtonId = function() {
		return "control_" + this.getControlId() + "_button";
	};
	
	// ________________________________________________________________________
	
	/**
	 * Returns the ID to be used for the content div
	 */
	prot.getContentId = function() {
		return "control_" + this.getControlId() + "_content";
	};
	
	// ________________________________________________________________________
	
	/**
	 * When set to true, the user will not be able to click the tab button
	 */
	prot.setEnabled = function(isEnabled) {
		this.m_Enabled = isEnabled;
		if (this.getButton()) {
			this.getButton().setEnabled(isEnabled);
		}
	};

	// ________________________________________________________________________
	
	/**
	 * Creates a blank div in the target, where its id is 
	 * control_[controlid]_button, and appends that div to targetId. Then 
	 * creates a Selector with the newly created div, and sets that as the 
	 * Button instance variable. Finally, renders the template set in 
	 * buttonTemplate into the div.
	 * 
	 * @param targetId the ID of the element that will contain the button
	 */
	prot.renderButton = function(targetId) {
		var template = TemplateBuilder.buildTemplate(this.getButtonTemplate());
		var self = this;
		
		// button html
		var html = template.render({"tab": this, "tabButtonId": this.getButtonId()});
		$("#" + targetId).append(html);
		var btnDiv = $("#" + this.getButtonId());
		
		if (!btnDiv.length) {
			// there is no button. This might happen if the template was empty
			this.setButton(undefined);
			return;
		}
		
		// button selector instance
		var selector = new ns.Selector(btnDiv);
		selector.setSelectedClass(this.getButtonSelectedClass());
		selector.setUnselectOnClickEnabled(false);
		selector.setOnSelect(function() { self.select(); });
		selector.performUnselection();
		
		this.setButton(selector);
	};
	
	// ________________________________________________________________________
	
	/**
	 * Creates a blank div in the target, where its id is [controlid]_content, 
	 * and appends that div to targetId. Then creates a Selector with the newly
	 * created div, and sets that as the Content instance variable.
	 * 
	 * @param targetId the ID of the element that will contain the content
	 */
	prot.renderContent = function(targetId) {
		var contentDiv = $("<div id='" + this.getContentId() + "'></div>");
		$("#" + targetId).append(contentDiv);
		this.setElement(contentDiv);
		var selector = new ns.Selector(contentDiv);
		selector.setUnselectedClass(this.getContentUnselectedClass());
		selector.setEnabled(false);
		selector.performUnselection();
		this.setContent(selector);
	};
	
	// ________________________________________________________________________
	
	/**
	 * Calls renderButton and renderContents with their respective arguments
	 */
	prot.render = function(targetButtonId, targetContentId) {
		this.renderButton(targetButtonId);
		this.renderContent(targetContentId);
		this.getOnRender()();
	};
	
	// ________________________________________________________________________
	
	/**
	 * Makes the current tab visible
	 */
	prot.select = function() {
		var button = this.getButton();
		if (button !== undefined) {
			button.performSelection();
		}
		if (this.getTabGroup()) {
            this.getTabGroup().unselectAllExcept(this);
        }
		this.getContent().performSelection();
		this.getOnSelect()();
	};
	
	// ________________________________________________________________________
	
	/**
	 * Hides the current tab
	 */
	prot.unselect = function() {
		var button = this.getButton();
		if (button !== undefined) {
			button.unselect();
		}
		this.getContent().unselect();
		this.getOnUnselect()();
	};
	
})(jQuery);(function($) {
	var ns = MPageControls;
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	
	/**
	 * Extends the Group class, and assists on rendering a group of tabs and 
	 * ensuring only one is displayed at a time.
     *
     * Example:
     *
     * var tab1 = new Tab();
     * tab1.setButtonTemplate("<div id=${tabButtonId}>CLICK ME!</div>");
     *
     * var tab2 = new Tab();
     * tab2.setTitle("my tab name");
     * tab2.setButtonTemplate("<div id=${tabButtonId}> ${tab.getTitle()} </div>");
     *
     * var group = new TabGroup();
     * group.addTab(tab1);
     * group.addTab(tab2);
     *
     * group.setButtonsContainerId("an_id_to_store_the_buttons");
     * group.setContentsContainerId("an_id_to_store_the_contents");
     * group.render();
     *
     * tab1.getContentsElement().html("<div> some content </div>");
     * tab2.getContentsElement().html("<div> some other tab </div>");
	 */
	ns.TabGroup = function() {
		ns.Group.call(this);
		
		this.setFirstTabCSSClass("first");
		this.setLastTabCSSClass("last");
	};
	
	inherits(ns.TabGroup, ns.Group);
	
	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------
	
	/**
	 * The ID of the HTML element which will contain all the tab buttons
	 */
	attribute(ns.TabGroup, "ButtonsContainerId");
	
	/**
	 * The ID of the HTML element which will hold the tab contents
	 */
	attribute(ns.TabGroup, "ContentsContainerId");
	
	/**
	 * A string template to be used when rendering a single button
	 */
	attribute(ns.TabGroup, "DefaultButtonTemplate");
	
	/**
	 * A CSS class to be added to the first tab in the list
	 */
	attribute(ns.TabGroup, "FirstTabCSSClass");
	
	/**
	 * A CSS class to be added to the last tab in the list
	 */
	attribute(ns.TabGroup, "LastTabCSSClass");
	
	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------
	
	var prot = ns.TabGroup.prototype;
	
	/**
	 * Will cycle through the controls array, and execute the render method on
	 * each, passing buttonsContainerId and contentsContainerId as arguments. 
	 * If the control (tab) does not have a buttonTemplate, the 
	 * defaultButtonTemplate will be set as the template.
	 */
	prot.render = function() {
		var controls = this.getControls();
		var firstTabElement = null;
		var lastTabElement = null;
		
		for (var i=0; i < controls.length; i++) {
			var tab = controls[i];
			if (tab.getButtonTemplate() === null) {
				tab.setButtonTemplate(this.getDefaultButtonTemplate());
			}
			
			tab.render(this.getButtonsContainerId(), 
					this.getContentsContainerId());
			
			// no button? then we're done.
			if (tab.getButton() === undefined) {
				continue;
			}
			
			// identifies the first and last rendered tabs
			var tabElement = tab.getButton().getElement();
			if (firstTabElement === null) {
				firstTabElement = tabElement;
			}
			lastTabElement = tabElement;
			
			tab.setTabGroup(this);
			
		}
		
		// adds the CSS classes for first and last tabs
		var firstCssClass = this.getFirstTabCSSClass();
		var lastCssClass = this.getLastTabCSSClass();
		
		if (firstTabElement !== null && firstCssClass !== null) {
			firstTabElement.addClass(firstCssClass);
		}
		if (lastTabElement !== null && lastCssClass !== null) {
			lastTabElement.addClass(lastCssClass);
		}
	};
	
	// ________________________________________________________________________
	
	/**
	 * Executes a function in each control
	 */
	prot.eachControl = function(fun) {
		var controls = this.getControls();
		for (var i=controls.length; i--;) {
			fun(controls[i]);
		}
	};

	// ________________________________________________________________________	
	
	/**
	 * Sets the enabled attribute of all controls to false
	 */
	prot.disableAll = function() {
		this.eachControl(function(control) {
			if (control.setEnabled) {
				control.setEnabled(false);
			}
		});
	};
	
	// ________________________________________________________________________
	
	/**
	 * Sets the enabled attribute of all controls to true
	 */
	prot.enableAll = function() {
		this.eachControl(function(control) {
			if (control.setEnabled) {
				control.setEnabled(true);
			}
		});
	};

    // ________________________________________________________________________

    /**
     * Adds a new tab to be rendered
     */
	prot.addTab = function(tab) {
        this.getControls().push(tab);
    };

})(jQuery);/**
 * @author LS025469
 */
(function($) {
    var ns = MPageControls;
    var inherits = MPageObjectOriented.inherits;
    var attribute = MPageObjectOriented.createAttribute;

    // ------------------------------------------------------------------------
    // Class Declaration
    // ------------------------------------------------------------------------
    ns.TextHighlighter = function(element) {
        this.setClass("highlight");
        this.setTag("span");
        
        ns.Control.call(this, element);
    };
    
    inherits(ns.TextHighlighter, ns.Control);
    
    attribute(ns.TextHighlighter, "Tag");
    attribute(ns.TextHighlighter, "Class");
    attribute(ns.TextHighlighter, "OnHighlightWord");
    
    ns.TextHighlighter.prototype.highlight = function(term) {
        // regex efficiently reused from the original autosuggest control
        var regex = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(/[, ]/).join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi");
        
        var tagStart = "<" + this.getTag() + " class='" + this.getClass() + "'>";
        var tagEnd = "</" + this.getTag() + ">";
        var textNode;
        var newHtml;
        
        // we have to cycle through the elements instead of just getting
        // the HTML so we don't lose event data attached to the DOM.
        var textNodes = this.getElement().find('*').contents().filter(function() { return (this.nodeType === 3); });
        $.each(textNodes, function(i, node) {
            textNode = $(node);
            newHtml = textNode.text().replace(regex, tagStart + "$1" + tagEnd);
            textNode.replaceWith(newHtml);
        });
    };
})(jQuery);
/**
 * tree.js
 * @author Leonardo Sa
 *
 * Tree class
 * ============================================================================
 *
 * Renders a AJAX tree of folders, based on the dynatree jquery plugin.
 * In order to populate the tree, one needs to register a function listener
 * by using setOnLazyRead.
 *
 */

(function($) {
	// ------------------------------------------------------------------------
	// Imports
	// ------------------------------------------------------------------------
	var ns = MPageControls;
	var attribute = MPageObjectOriented.createAttribute;
	var inherits = MPageObjectOriented.inherits;

	// ------------------------------------------------------------------------
	// Class declaration
	// ------------------------------------------------------------------------
	ns.Tree = function(element) {
		this.setDynatreeOptions({});
		this.setOnSelect(function() {
		});

		ns.Control.call(this, element);
	};

	inherits(ns.Tree, ns.Control);

	// ------------------------------------------------------------------------
	// Attributes
	// ------------------------------------------------------------------------

	/**
	 * Options for the dynatree third party library
	 */
	attribute(ns.Tree, "DynatreeOptions");

	/**
	 * Function to be executed when an element is selected
	 */
	attribute(ns.Tree, "OnSelect");

	/**
	 * Returns the dynatree node that is currently selected
	 */
	attribute(ns.Tree, "SelectedNode");

	var prot = ns.Tree.prototype;

	// ________________________________________________________________________

	prot.init = function() {

		var self = this;
		var opts = this.getDynatreeOptions();
		opts.onLazyRead = function(node) {
			self.lazyRead(node);
		};
		opts.onActivate = function(node) {
			self.onSelect(node);
		};
		opts.OnPostInit = this.treeInit;
		opts.autoFocus = false;
		opts.initAjax = {};
		this.getElement().dynatree(opts);
	};

	// ________________________________________________________________________

	/**
	 * Defines a function to be executed whenever there is a need to load more
	 * nodes in the tree. A "node" argument will be passed with the node that
	 * is the parent caller. A first call to this function will be performed
	 * with the dynatree's root node to populate the initial folders.
	 *
	 * @param {function} function to be executed
	 */
	prot.setOnLazyRead = function(fun) {
		this.m_OnLazyRead = fun;
		this.lazyRead(this.getElement().dynatree("getRoot"));
	};

	// ________________________________________________________________________

	prot.getOnLazyRead = function() {
		return this.m_OnLazyRead;
	};

	// ________________________________________________________________________

	prot.lazyRead = function(node) {
		this.m_OnLazyRead(node);
	};

	// ________________________________________________________________________

	prot.onSelect = function(node) {
		this.getOnSelect()(node);
		this.setSelectedNode(node);
	};
})(jQuery); (function() {

    var ns = MPageControls;
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;
    var List = MPageControls.List;

    ns.DropDownList = function(element) {
        this.setList(new List());
        this.setHighlightClass("current");
        this.setIsMouseOverContents(false);
        ns.DropDown.call(this, element);
    };

    attribute(ns.DropDownList, "List");
    attribute(ns.DropDownList, "DisplayKey");

    /**
     * The CSS class to be applied to the current value in the list. Defaults to
     * "current"
     *
     * @type String
     */
    attribute(ns.DropDownList, "HighlightClass");

    /**
     * Whether the mouse is currently hovering over the contents or not.
     * Is set automatically.
     *
     * @type boolean
     */
    attribute(ns.DropDownList, "IsMouseOverContents");

    inherits(ns.DropDownList, ns.DropDown);

    var prot = ns.DropDownList.prototype;

    prot.init = function() {
    	var self = this;
        var selector = $("<div tabindex='0' id='control_" + this.getControlId() + "_selector' class='selector'></div>");
        var contents = $("<div style='display: none' id='control_" + this.getControlId() + "_contents' class ='contents' ></div>");

        var list = this.getList();
        list.setElement(contents);
        list.setListTemplate(MPageControls.getDefaultTemplates().list);
        list.setItemTemplate(MPageControls.getDefaultTemplates().ddListItem);
        list.setHighlightClass(this.getHighlightClass());
        list.setOnSelect(function() {
            self.selectItem();
        });

        list.bind("mouseover", contents, function() {
            self.setIsMouseOverContents(true);
        });
        list.bind("mouseout", contents, function() {
            self.setIsMouseOverContents(false);
        });
        list.bind("blur", selector, function() {
            if (!self.getIsMouseOverContents()) {
                self.hide();
            }
        });

        this.getElement().append(selector);
        this.getElement().append(contents);
        this.setContents(contents);
        this.setElement(selector);

        // if an element is passed in the constructor it will build a selector automatically.
        // this ensures we remove the events of the old selector before changing the element.
        if (this.getSelector()) {
            this.getSelector().destroyEvents();
            this.getSelector().setElement(selector);
            this.getSelector().init();
        }

        this.getList().makeItem = function(item) {
            item.displayKey = self.getDisplayKey();
			return item;
        };

        ns.DropDown.prototype.init.call(this);

        // we rendered contents with display none, so it is hidden
        this.getDetailDialog().setVisible(false);
			
    };

    /**
     * Overrides the DropDown onShow method to provide highlighting
     * functionality for the currently selected item.
     */
    prot.onShow = function() {
        var selectedIndex = this.getList().getSelectedIndex();

        ns.DropDown.prototype.onShow.call(this);

        this.getList().setSelectedIndex(selectedIndex);
        this.getList().highlight(selectedIndex);
    };

    /**
     * Collapses the drop down and sets the display value according
     * to the current selected item
     */
    prot.selectItem = function() {
        this.hide();
        this.setValue(this.getList().getSelectedItem()[this.getDisplayKey()]);
        this.getOnSelect()(this.getList().getSelectedItem());
    };

    /**
     * Returns the currently selected item
     * @return {*}
     */
    prot.getSelectedItem = function() {
        return this.getList().getSelectedItem();
    };

    /**
     * Sets the currently selected item without firing any events or
     * callbacks.
     *
     * @param item
     */
    prot.setSelectedItem = function(item) {
        this.setValue(item[this.getDisplayKey()]);
        this.getList().setSelectedItem(item);
    };

    /**
     * Renders all the items inside the drop down
     *
     * @param items
     * @return {*}
     */
    prot.renderItems = function(items) {
        return this.getList().renderItems(items);
    };

    prot.setItemTemplate = function(template) {
        this.getList().setItemTemplate(template);
    };

    prot.setItems = function(items) {
        this.getList().setItems(items);
    };

    prot.selectByIndex = function(index) {
        this.getList().select(index);
    };

})();(function($) {

    var inherits = MPageObjectOriented.inherits;
    var attribute = MPageObjectOriented.createAttribute;
    var ns = MPageControls;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------

	MPageControls.CclSearch = function(element) {
	    this.setRequestCount(0);
        this.setSynchSuggestionsWidth(true);
        this.setInBrowserDir("../../mpages/reports/");
        ns.AutoSuggest.call(this, element);
	};

	inherits(ns.CclSearch, ns.AutoSuggest);

    /**
     * Name of the CCL program to be executed
     */
	attribute(ns.CclSearch, "ProgramName");

	/**
	 * How many requests have been queued. This is needed to ensure
	 * the right request will be displayed in case there are multiple
	 * keystrokes in a period less than the delay.
	 */
	attribute(ns.CclSearch, "RequestCount");

	/**
	 * Directory to be prepended to a CCL call when CERN_BrowserDevInd is true
	 */
	attribute(ns.CclSearch, "InBrowserDir")

	var prot = ns.CclSearch.prototype;

	// ------------------------------------------------------------------------
	// Member Methods
	// ------------------------------------------------------------------------

	/**
     * Sets the template to render list items and attaches searchOrders()
     * function to be triggered when the user types.
     */
    prot.init = function() {
       MPageControls.AutoSuggest.prototype.init.call(this);

       var self = this;

       this.setTemplate(MPageControls.getDefaultTemplates().cclSearch);

       this.setOnDelay(function() {
           self.callProgram();
       });

       this.setRequestItemValueCallback(function(item) {
            return item.content;
       });
    };

    // ..................................................................................

    /**
    * Performs a CCL call to the program specified by setProgramName(), with parameters
    * generated by buildParameters()
    */
    prot.callProgram = function(httpRequestHandler) {
        var searchPhrase = this.getValue();
        var self = this;

        // increase the request count
        this.setRequestCount(this.getRequestCount() + 1);
        var reqNumber = this.getRequestCount();

        // Initialize request object
        if (httpRequestHandler) {
            var xhr = httpRequestHandler;
        } else {
            var xhr = (!CERN_Platform.inMillenniumContext()) ? new XMLHttpRequest() : new XMLCclRequest();
        }

        // Handle response
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
               MP_Util.LogScriptCallInfo(null, this, "script_search.js", "callProgram");
               self.handleSuccess(reqNumber, xhr.responseText);
            }
        };

        // Send request
        var params = this.buildParameters();
        if (!CERN_Platform.inMillenniumContext()) {
            var urlSuffix = this.getProgramName() + "?parameters=" + params;
            var url = CERN_Platform.getScriptServletLocation() || this.getInBrowserDir();
            url += urlSuffix;

            xhr.open("GET", url);
            xhr.send(null);
        }
        else {
            xhr.open('GET', this.getProgramName());
            xhr.send(params);
        }
    };

    // ..................................................................................

    /**
     * Handles a successful request from the Ajax program call
     */
    prot.handleSuccess = function(reqNumber, responseText) {

        // ensure we are processing the latest request made
		if (reqNumber != this.getRequestCount() || !responseText) {
			return;
		}

        var jsonSearch = JSON.parse(responseText);

        // Handle failed CCL call
        if (jsonSearch.RECORD_DATA.STATUS_DATA.STATUS === "F") {
            MP_Util.LogScriptCallError(null, responseText, "program_search.js", "handleSuccess");
            MP_Util.LogError(this.getProgramName() + " failed: " + responseText);
            return;
        }

        // Do not render if there is no response
        if (!jsonSearch) {
            return;
        }

        var context = this.makeContext(jsonSearch);
        this.setSuggestions(context);
    };

    // ..................................................................................

    /**
     * Should be overwritten by the derived class to return the parameter string
     * to be used on the CCL call
     */
    prot.buildParameters = function() {
        throw "buildParameters() is abstract.";
    };

    // ..................................................................................

    /**
     * Can be overriden by the client if there is a need to edit the context before
     * it is sent to rendering.
     */
    prot.makeContext = function(responseJson) {
        return responseJson;
    };


}(jQuery));(function($) {
    var inherits = MPageObjectOriented.inherits;
    var attribute = MPageObjectOriented.createAttribute;
    var ns = MPageControls;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	MPageControls.OrderSearch = function(element) {
		this.setRequestCount(0);
		this.setSynchSuggestionsWidth(true);
		
	    ns.AutoSuggest.call(this, element);
	};
	
	inherits(ns.OrderSearch, ns.AutoSuggest);
        
    // ----------------------------------------------------------------
    // Attributes
    // ----------------------------------------------------------------
    attribute(ns.OrderSearch, "Criterion");
    attribute(ns.OrderSearch, "SuggestionLimit");
    attribute(ns.OrderSearch, "EncounterTypeCd");
    attribute(ns.OrderSearch, "FacilityId");
    attribute(ns.OrderSearch, "SearchIndicators");
    attribute(ns.OrderSearch, "VenueType");
    attribute(ns.OrderSearch, "RequestCount");
    attribute(ns.OrderSearch, "BirthDate");
    attribute(ns.OrderSearch, "BirthDateTimeZone");
    attribute(ns.OrderSearch, "ClinicalWeight");
    attribute(ns.OrderSearch, "ClinicalWeightUnit");
    attribute(ns.OrderSearch, "PMAInDays");    
	
	// ------------------------------------------------------------------------
	// Public Member Methods
	// ------------------------------------------------------------------------
	var prot = MPageControls.OrderSearch.prototype;

	/**
	 * Sets the template to render list items and attaches searchOrders()
	 * function to be triggered when the user types.
	 */
	prot.init = function() {
	   MPageControls.AutoSuggest.prototype.init.call(this);
		
	   var self = this;
	    
	   this.setListItemTemplate(MPageControls.getDefaultTemplates().orderSearchItem);
	   this.setTemplate(MPageControls.getDefaultTemplates().orderSearch);
	   
		this.setOnDelay(function() {
			var originalValue = self.m_SearchIndicators;
			self.m_SearchIndicators &= ~(1 << 10); //Turns 10th bit of searchIndicators off. Auto-search always filtered
			self.searchOrders();
			self.m_SearchIndicators = originalValue;
		}); 

	   	   this.setRequestItemValueCallback(function(item) {
	        return item.content;
	        
       });
       
       
	};
	
	// ________________________________________________________________________
	
	prot.searchOrders = function(callback) {
	    var searchPhrase = this.getValue();
	    var self = this;
	    
	    // increase the request count
	    this.setRequestCount(this.getRequestCount() + 1);
	    var reqNumber = this.getRequestCount();
	    
	    // --------------------------------------------------------------------
        // Initialize the request object
	    // --------------------------------------------------------------------
        var xhr = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
        
	    // --------------------------------------------------------------------
        // Handle response
	    // --------------------------------------------------------------------
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
               MP_Util.LogScriptCallInfo(null, this, "order_search.js", "handleSearchOrderSuccess");
               self.handleSearchOrdersSuccess(reqNumber, 
            		   xhr.responseText, callback);
            }
        };

	    // --------------------------------------------------------------------
        // Send request
	    // --------------------------------------------------------------------
        if (this.getSearchIndicators() === null) {
        	throw "OrderSearch: no search indicators specified";
        }

        var birthDate = this.getBirthDate() ? this.getBirthDate() : "";
        var birthDateTimeZone = this.getBirthDateTimeZone() ? this.getBirthDateTimeZone() : 0;
        var weightValue = this.getClinicalWeight() ? this.getClinicalWeight() : 0.0;
        var weightUnit = this.getClinicalWeightUnit() ? this.getClinicalWeightUnit() : 0;
        var pmaInDays = this.getPMAInDays() ? this.getPMAInDays() : 0;
		      
        var sugLimit = this.getSuggestionLimit();
        if (this.getSuggestionLimit() <= 0) {
        	sugLimit = 50;
        }
        
        var params = "^MINE^,^" + searchPhrase + "^," + sugLimit + "," + this.getEncounterTypeCd() + ".0," + this.getFacilityId() + ".0," + this.getCriterion().provider_id + ".0," + this.getCriterion().ppr_cd + ".0," + this.getVenueType() + "," + this.getSearchIndicators() + "," + 1 + "," + this.getCriterion().person_id + ".0,^" + birthDate + "^," + birthDateTimeZone + "," + weightValue + "," + weightUnit + "," + pmaInDays;
        if (CERN_BrowserDevInd) {
            var url = "mp_search_orders?parameters=" + params;
            xhr.open("GET", url);
            xhr.send(null);
        }
        else {
            xhr.open('GET', "mp_search_orders");
            xhr.send(params);
        }      
	};
	
	// ________________________________________________________________________
	
	prot.handleSearchOrdersSuccess = function(requestNumber, responseText, callback) {
		// ensure we are processing the latest request made
		if ((requestNumber != this.getRequestCount())|| !responseText) {
			return;
		}
		 
         var jsonSearch = "";
         
         jsonSearch = JSON.parse(responseText);
         
         if (!jsonSearch) {
             return;
         }
         
         if (jsonSearch.RESULTS.STATUS_DATA.STATUS === "F") {
        	 MP_Util.LogScriptCallError(null, responseText, "order_search.js", "handleSearchOrderSuccess");
        	 MP_Util.LogError("mp_search_orders failed: " + responseText);
        	 return;
         }
         
         //Cache the patient demographic information for future use.
         if (jsonSearch.RESULTS.BIRTH_DATE) {
             this.setBirthDate(jsonSearch.RESULTS.BIRTH_DATE);
         }
         if (jsonSearch.RESULTS.BIRTH_DATE_TZ) {
             this.setBirthDateTimeZone(jsonSearch.RESULTS.BIRTH_DATE_TZ);
         }
         if (jsonSearch.RESULTS.WEIGHT_VALUE) {
             this.setClinicalWeight(jsonSearch.RESULTS.WEIGHT_VALUE);
         }
         if (jsonSearch.RESULTS.WEIGHT_CODE) {
             this.setClinicalWeightUnit(jsonSearch.RESULTS.WEIGHT_CODE);
         }
         if (jsonSearch.RESULTS.PMA_VALUE) {
             this.setPMAInDays(jsonSearch.RESULTS.PMA_VALUE);
         }	      	          
         if (callback) {
         	callback(responseText);
         } else {
        	var returnData = jsonSearch.RESULTS.ORDERS.concat(jsonSearch.RESULTS.PLANS);
         	this.renderJson(returnData);
         }
         
	};
	
	// ________________________________________________________________________
	
	prot.renderJson = function(returnData) {
	   var self = this;
	    
	   $.each(returnData, function(i, item) {
	        // Figures out the item content
            if (item.SYNONYM) {
                item.content = item.SYNONYM;
            } else if (item.PW_CAT_SYN_NAME) {
                item.content = item.PW_CAT_SYN_NAME;
            }
            
            // Figures out the item CSS class
            if (item.ORDERABLE_TYPE_FLAG == 6) {
                item.iconClass = "careset-icon";
            } else if (item.ORDERABLE_TYPE_FLAG === 0) {
                item.iconClass = "";
            } else if (item.PATH_CAT_ID) {
                item.iconClass = "powerplan-icon";
            }
	   });

	   this.setSuggestions(returnData);
	    
	};
	
})(jQuery);
(function($) {
	var ns = MPageControls;
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;

	// ------------------------------------------------------------------------
	// Class Declaration
	// ------------------------------------------------------------------------
	/**
	 * A component level control that creates a dropdown list for venues, which can be used by components like New order entry option 1 and 2.
	 */
	ns.OrderVenueGroup = function(element,defaultValue,venueList, selectedOption) {
		ns.DropDownList.call(this, element);
		this.setValue(defaultValue);
		this.setVenueList(venueList);
		this.getList().setSelectedOption(selectedOption);
		this.getList().setItemTemplate(MPageControls.getDefaultTemplates().venueTemplate);
	};

	attribute(ns.OrderVenueGroup, "VenueList");
	inherits(ns.OrderVenueGroup, ns.DropDownList);
	
	var prot = ns.OrderVenueGroup.prototype;

	prot.init = function(){
		var self = this;
		this.setOnShow( function(){

			self.getList().setDisplayKey("VENUE_DISPLAY");
			self.getList().renderItems(self.getVenueList());
			self.getList().highlightSelectedOption(self.getList().getSelectedIndex());
		});
		ns.DropDownList.prototype.init.call(this);
	};
	
})(jQuery);(function($) {
	var inherits = MPageObjectOriented.inherits;
	var attribute = MPageObjectOriented.createAttribute;
	var ns = MPageControls;

	/**
	 * Renders a textbox autosuggest control into element and uses
	 * MP_GET_PRSNL_JSON to suggest results.
	 */
	MPageControls.PersonnelSearch = function(element) {
		ns.CclSearch.call(this, element);

		this.setProgramName("MP_GET_PRSNL_JSON");
		this.setSuggestionLimit(10);
		this.setListItemTemplate(MPageControls.getDefaultTemplates().personnelSearchItem);
	};

	inherits(ns.PersonnelSearch, MPageControls.CclSearch);

	attribute(ns.PersonnelSearch, "UserId");
	attribute(ns.PersonnelSearch, "SuggestionLimit");

	var prot = ns.PersonnelSearch.prototype;

	prot.buildParameters = function() {
		var lastName = "";
		var firstName = "";
		// split first/last name if a comma exists
		var splitted = this.getValue().split(",");
		if (splitted.length > 1) {
			lastName = splitted[0];
			firstName = splitted[1];
		} else {
			lastName = splitted[0];
			firstName = "";
		}

		// builds the parameter string
		return "^MINE^"
		+ "," + this.getUserId() + ".00"
		+ ",^" + lastName + "^"
		+ ",^" + firstName + "^"
		+ "," + this.getSuggestionLimit();
	};

	prot.makeContext = function(response) {
		return response.RECORD_DATA.PRSNL;
	};

	prot.setTemplateMaxHeight = function(maxHeight) {
		ns.setMaxHeight(maxHeight);
	};
})(jQuery);
/**
 * A collection of functions which can be used to maintain, create, destroy and update menus.
 * The MP_MenuManager function keeps a copy of all of the Menu objects that have been created
 * for the current view.  If a Menu object is updated outside of these functions, the updated
 * version of the object should replace the stale version that is stored here by using the
 * updateMenuObject functionality.
 * @constructor
 */
var MenuManager = function() {
	//A collection of menu objects references by a unique i
	this.menuCollection = {};
	//Active Menu Stack
	this.menuStack = [];
	//Root menu offsetParent which will be used by submenus to attach their content
	this.offsetParent = null;
};

/**
 * This function will be used to add Menu objects to the collection of Menu objects.  This collection of
 * Menu objects will be the one source of this type of object and will be used when showing menus.
 * @param {Menu} menuObj An instance of the Menu object
 * @return {boolean} true if the object was added successfully, false otherwise
 */
MenuManager.prototype.addMenuObject = function(menuObj) {
	var menuId = "";
	//Check that he object is not null and that the object type is Menu
	if(!(Menu.prototype.isPrototypeOf(menuObj))) {
		logger.logError("MenuManager.addMenuObject only accepts objects of type Menu or any object that uses Menu.prototype");
		return false;
	}

	//Check for a valid id.
	menuId = menuObj.getId();
	if(!menuId) {
		//Menu id is not populated
		logger.logError("MenuManager.addMenuObject: no/invalid menu id given");
		return false;
	}
	else if(this.menuCollection[menuId]) {
		//Menu id is already in use
		logger.logError("MenuManager.addMenuObject: menu id" + menuId + " is already in use");
		return false;
	}

	//Add the Menu Object to the list of Menu objects
	this.menuCollection[menuId] = menuObj;
	return true;
};

/**
 * Closes the menus based on the elements currently in the menuStack.  If the forceClose flag is set to true, all menus will be
 * closed regardless of where a user is hovering.  If the forceClose flag is set to true all menus will be closed up to the first menu
 * that is being hovered over by the user.
 * @param {boolean} forceClose A flag which determines if all menus should be closed or if if we should stop closing menus when we find one
 * that the user is still hovering over.
 * @return {boolean} True if the top menu was closed successfully, false otherwise
 */
MenuManager.prototype.closeMenuStack = function(forceClose) {
	var anchorActiveClass = "";
	var topMenuItem = null;

	try {
		//Check to see if there are any menus on the stack
		topMenuItem = this.menuStack.pop();
		if(topMenuItem) {
			//Check to see if the cursor is still over this menu, if so return
			if(!forceClose) {
				if(topMenuItem.isMouseOverMenu()) {
					//Push the menu back on the stack since we aren't closing it
					this.menuStack.push(topMenuItem);
					return true;
				}
			}

			//Delete the menu DOM elements
			$("#" + topMenuItem.getContentElementId()).remove();
			topMenuItem.setContentElementId("");

			//Remove the active class for the anchor element if supplied
			anchorActiveClass = topMenuItem.getAnchorActiveClass();
			if(anchorActiveClass) {
				$("#" + topMenuItem.getAnchorElementId()).removeClass(anchorActiveClass);
			}

			//Mark the menu as inactive so it can update all of its MenuItems with the proper active indicator
			topMenuItem.setIsActive(false);
			topMenuItem.setIsVisible(false);

			//Reset the mouse hover flag
			topMenuItem.setIsMouseOverMenu(false);

			//Clear the hover timeout since we are forcing the menu closed
			topMenuItem.clearHoverTimeout();

			//Close the next menu on stack and close it.
			return this.closeMenuStack(forceClose);
		}
		//Reset the offset parent since we have closed all menus down to the root
		this.offsetParent = null;
		return true;
	}
	catch(err) {
		logger.logJSError(err, null, "MenuManager", "closeMenu");
		return false;
	}
};

/**
 * Deletes the Menu object with the associated id of menuId from the collection of Menu objects.
 * @param {string} menuId The id of the Menu item to be deleted
 * @param {boolean} True if the menu was removed from the collection
 */
MenuManager.prototype.deleteMenuObject = function(menuId) {
	return delete this.menuCollection[menuId];
};

/**
 * Retrieves the Menu object with the associated id of menuId.
 * @param {string} menuId The id of the Menu object to retrieve
 * @return {Menu} The Menu object if it exists, null otherwise
 */
MenuManager.prototype.getMenuObject = function(menuId) {
	return this.menuCollection[menuId] || null;
};

/**
 * Render and show the menu based on the settings applied in the Menu object referenced by the menuId parameter.  This function will
 * create the container for the menu and have the menu populate the contents for that container.
 * @param {string} menuId The id of the Menu object to render
 * @return {boolean} True if the menu was rendered successfully, false otherwise.
 */
MenuManager.prototype.showMenu = function(menuId) {
	var anchorActiveClass = "";
	var anchorElement = null;
	var contentParentElement = null;
	var menuClass = "";
	var menuControl = null;
	var menuEle = null;
	var menuItems = null;
	var menuObj = null;

	//Get the Menu object
	menuObj = this.getMenuObject(menuId);
	if(!menuObj) {
		logger.logError("Menu " + menuId + " does not exist");
		return false;
	}

	//See if the menu already exists, if so delete it
	$("#menuContent" + menuId).remove();

	//See if this is a root menu.  If so close all other open menus
	if(menuObj.isRootMenu()) {
		this.closeMenuStack(true);
	}

	//Create the main container for the menu
	menuClass = (menuObj.isRootMenu()) ? "menu-container-root" : "menu-container-submenu";
	menuEle = $("<div></div>").attr("id", "menuContent" + menuId).addClass(menuClass + " " + menuObj.getTypeClass());
	
	//Check to see if the menu should be persistent.  If it is persistent ignore the hover events else create the hover events.
	if(!(menuObj.isPersistent() && menuObj.isRootMenu())){  
		//Setup the hover actions so we know which menu item the user is hovering over
		menuEle.hover(function() {
			//Set the flag to indicate that the user is hovering over the menu content
			menuObj.setIsMouseOverMenu(true);
			//Clear the timeout since we are back in the menu
			menuObj.clearHoverTimeout();
		}, function() {
			//Set the flag to indicate that the user is not hovering over the menu content
			menuObj.setIsMouseOverMenu(false);
			//Set the timeout since we have left the menu
			menuObj.startHoverTimeout();
		});
	}
	//Set the id for the menu's content section
	menuObj.setContentElementId("menuContent" + menuId);

	//Tell the menu object to create its own content
	menuItems = menuObj.generateMenuContent();
	$(menuItems).each(function(index, element) {
		$(menuEle).append(element);
	});

	//Apply the active class for the anchor element if supplied
	anchorActiveClass = menuObj.getAnchorActiveClass();
	if(anchorActiveClass) {
		$("#" + menuObj.getAnchorElementId()).addClass(anchorActiveClass);
	}

	//Append the menu to the offsetParent for the anchor so it will scroll correctly
	anchorElement = $("#" + menuObj.getAnchorElementId());
	//If the developer has defined a content parent element id then append the content to that location
	contentParentElement = $("#" + menuObj.getContentParentId());
	if(contentParentElement.length){
		$(contentParentElement).append(menuEle);
	}
	else{
		$(document.body).append(menuEle);
	}

	//We must explicitly set the width of the menu element for the controls framework
	$(menuEle).width($(menuEle).outerWidth());
	//Create the controls DetailDialog for our menu visuals
	menuControl = new MPageControls.DetailDialog(anchorElement, menuEle);
	menuControl.setAutoFlipHorizontal(menuObj.autoFlipHorizontal());
	menuControl.setAutoFlipVertical(menuObj.autoFlipVertical());
	menuControl.setElementCorner(menuObj.getAnchorConnectionCorner());
	menuControl.setContentsCorner(menuObj.getContentConnectionCorner());
	menuControl.show();

	//Push this menu onto the stack and update all of the necessary identifiers
	menuObj.setIsActive(true);
	menuObj.setIsVisible(true);
	if(menuObj.isRootMenu() && !menuObj.isPersistent()) {
		menuObj.startHoverTimeout(3000);
	}
	this.menuStack.push(menuObj);
};

/**
 * This function will update the visuals of the top menu currently being shown.  This function is typically
 * called when visual elements of a menu are being changed, such as the label for a menu item.
 * @param {string} menuId The id of the menu that needs to be refreshed.
 */
MenuManager.prototype.refreshMenuDisplay = function(menuId) {
	var menuObj = null;
	var topMenuIndex = 0;

	//Get the Menu object
	menuObj = this.getMenuObject(menuId);
	if(!menuObj) {
		logger.logError("Menu " + menuId + " does not exist");
		return false;
	}

	//Check to see if the menu is on top of the menu stack
	topMenuIndex = this.menuStack.length - 1;
	if(topMenuIndex >= 0 && menuObj === this.menuStack[topMenuIndex]) {
		this.showMenu(menuId);
	}
};

/**
 * Updates the existing Menu with a new instance of the object.  If the menu object does not exist it is added to the
 * collection
 * @param {Menu} menuObj The updated instance of the Menu object.
 * @return {boolean} True if the menu object was added/updated successfully, false otherwise.
 */
MenuManager.prototype.updateMenuObject = function(menuObj) {
	//Check that the object is not null and that the object type is Menu
	if(!Menu.prototype.isPrototypeOf(menuObj)) {
		logger.logError("MenuManager.updateMenuObject only accepts objects of type Menu");
		return false;
	}

	//Blindly update the Menu object.  If it didn't previously exist, it will now.
	this.menuCollection[menuObj.getId()] = menuObj;
	return true;
};

//This should only be instantiated once
/*eslint-disable no-unused-vars*/
var MP_MenuManager = new MenuManager();
/*eslint-enable no-unused-vars*//**
 * The MenuItem object contains all of the basic information needed for the various menu item elements.  Depending on how these
 * variables are set the menu will flex accordingly.  All elements that will be displayed within a menu will inherit from this
 * base class.
 * @constructor
 */
function MenuItem(menuId) {

	//A boolean to determine if this MenuItem is active or not
	this.m_activeInd = false;

	//This is the developer defined click function that can be created to handle any custom logic that needs to occur when the menu item
	// is selected
	this.m_clickFunc = function() {};

	//This flag will determine if the containing menu should be closed when the item is clicked
	this.m_closeOnClick = true;

	//This is the default function that will be executed when the MenuItem is clicked
	this.m_defaultClickFunction = function() {};

	//This flag will determine if the menu item is disabled or not.
	this.m_disabledInd = false;

	//This will be the id of the DOM element associated with this MenuItem
	this.m_elementId = "";

	//This will be the label used when the MenuItem is shown within a menu
	this.m_label = "";

	//The id given to the MenuItem object.  This id should be unique and will be used to set/retrieve the
	//MenuItem object
	this.m_menuItemId = menuId;

	//This type CSS class will be used to style the different types of menu item elements
	this.m_menuItemTypeClass = "";

}

/** Checkers **/

/**
 * A check to see if this MenuItem object will force the containing Menu to close when clicked
 * @return {boolean} True if the containing menu should close, false otherwise
 */
MenuItem.prototype.closeOnClick = function() {
	return this.m_closeOnClick;
};

/**
 * Checks to see if this MenuItem is actively being used or shown to the user
 */
MenuItem.prototype.isActive = function() {
	return this.m_activeInd;
};

/**
 * A check to see if this MenuItem object is disabled or not
 * @return {boolean} True if the menu item is disabled, false otherwise
 */
MenuItem.prototype.isDisabled = function() {
	return this.m_disabledInd;
};

/** Getters **/

/**
 * Returns the click function assigned to this MenuItem object.
 * @return {function} The function to be assigned to the click action for this MenuItem
 */
MenuItem.prototype.getClickFunction = function() {
	return this.m_clickFunc;
};

/**
 * Retrieves the default onClick function for the MenuItem object.  This default functionality should be created for each object
 * that uses the MenuItem prototype if special actions need to occur when the element is clicked.  The developer will still be able
 * to define custom actions in the standard onClick function.
 * @return {function} The default function to execute when an element is clicked.
 */
MenuItem.prototype.getDefaultClickFunction = function() {
	return this.m_defaultClickFunction;
};

/**
 * Retrieves the DOM element id associated with the visuals for this MenuItem object
 * @return {string} The DOM element id given to this MenuItem object
 */
MenuItem.prototype.getElementId = function() {
	return this.m_elementId;
};

/**
 * Retrieves the id given to this MenuItem object
 * @return {string} The id given to this MenuItem object
 */
MenuItem.prototype.getId = function() {
	return this.m_menuItemId;
};

/**
 * Retrieves the menu item label for this MenuItem object
 * @return {string} The label given to this MenuItem object
 */
MenuItem.prototype.getLabel = function() {
	return this.m_label;
};

/**
 * Retrieves the menu item type class given to this MenuItem object for visual styling purposes
 * @return {string} The type class given to this MenuItem object
 */
MenuItem.prototype.getTypeClass = function() {
	return this.m_menuItemTypeClass;
};

/** Setters **/

/**
 * Sets the function to execute when the MenuItem item is clicked within the context of a menu
 * @param {function} clickFunc The function that will be executed when the MenuItem item is clicked
 * @return {MenuItem} The menu item object calling this function so chaining can be used
 */
MenuItem.prototype.setClickFunction = function(clickFunc) {
	if(typeof clickFunc === "function") {
		this.m_clickFunc = clickFunc;
	}
	return this;
};

/**
 * Sets the flag which determines if the menu which contains this MenuItem should be closed when the user selects this item.
 * @param {boolean} closeFlag The boolean that identifies whether the containing menu will be closed or not.
 * @return {MenuItem} The menu item object calling this function so chaining can be used
 */
MenuItem.prototype.setCloseOnClick = function(closeFlag) {
	if(typeof closeFlag === "boolean") {
		this.m_closeOnClick = closeFlag;
	}
	return this;
};

/**
 * Retrieves the default onClick function for the MenuItem object.  This default functionality should be created for each object
 * that uses the MenuItem prototype if special actions need to occur when the element is clicked.  The developer will still be able
 * to define custom actions in the standard onClick function.
 * @param {function} The default function to execute when an element is clicked.
 * @return {MenuItem} The menu item object calling this function so chaining can be used
 */
MenuItem.prototype.setDefaultClickFunction = function(clickFunc) {
	if(typeof clickFunc === "function") {
		this.m_defaultClickFunction = clickFunc;
	}
	return this;
};

/**
 * Sets the id which will be used to identify the DOM element associated with this MenuItem
 * @param {string} elementId The id that will be assigned to this MenuItem object
 * @return {MenuItem} The menu item object calling this function so chaining can be used
 */
MenuItem.prototype.setElementId = function(elementId) {
	if(typeof elementId === "string") {
		this.m_elementId = elementId;
	}
	return this;
};

/**
 * Sets the id which will be used to identify a particular MenuItem object.
 * @param {string} id The id that will be assigned to this MenuItem object
 * @return {MenuItem} The menu item object calling this function so chaining can be used
 */
MenuItem.prototype.setId = function(id) {
	if(id && typeof id === "string") {
		this.m_menuItemId = id;
	}
	return this;
};

/**
 * Sets the active flag for this MenuItem indicating that the containing menu is being shown
 * @param {boolean} activeInd The indicator which will be used to determine if the menu is active or not
 * @return {MenuItem} The menu item object calling this function so chaining can be used
 */
MenuItem.prototype.setIsActive = function(activeInd) {
	if( typeof activeInd === "boolean") {
		this.m_activeInd = activeInd;
	}
	return this;
};

/**
 * Sets the flag which determines if the menu item should be disabled or not.
 * @param {boolean} disabled The boolean that identifies whether the menu item should be disabled or not
 * @return {MenuItem} The menu item object calling this function so chaining can be used
 */
MenuItem.prototype.setIsDisabled = function(disabled) {
	if(typeof disabled === "boolean") {
		this.m_disabledInd = disabled;
	}
	return this;
};

/**
 * Sets the label used when showing the MenuItem within the context of a menu.  The display of the menu will be updated if the menu
 * is currently being shown
 * @param {string} label The label that will be shown within the menu for this menu item
 * @return {MenuItem} The menu item object calling this function so chaining can be used
 */
MenuItem.prototype.setLabel = function(label) {
	var menuContainerId = "";

	if(label && typeof label === "string") {
		this.m_label = label;

		//Update the label if this menu item is acive
		if(this.isActive()) {
			//Refresh the menu contents
			menuContainerId = this.getElementId().replace(/menuSel[0-9]+-/, "");
			MP_MenuManager.refreshMenuDisplay(menuContainerId);
		}
	}

	return this;
};

/**
 * Sets the specific css class for this type of MenuItem object.  This class will be used for styling purposes
 * @param {string} typeClass The CSS class that will be assigned to this MenuItem object for styling purposes
 * @return {MenuItem} The menu item object calling this function so chaining can be used
 */
MenuItem.prototype.setTypeClass = function(typeClass) {
	if(typeof typeClass === "string") {
		this.m_menuItemTypeClass = typeClass;
	}
	return this;
};

/**
 * This function is used to generate the default HTML for the MenuItem.  This includes a selection indicator and the label.  Any
 * object which inherits the MenuItem prototype can override this function and create its own selection content.
 * @return {[jQuery]} An array of jQuery objects which will be appended to the menu.
 */
MenuItem.prototype.generateSelectionContent = function() {
	return [$("<span>&nbsp;</span>").addClass("menu-selection-ind"), $("<span></span>").addClass("menu-selection").html(this.getLabel())];
};
/**
 * The Menu object inherits from the MenuItem object and adds additional functionality used to create standard menus.
 * Specifically the developer can define the individual items that will be displayed within the menu.  Those elements
 * must be an object that inherits from the MenuItem object.
 * @constructor
 */
function Menu(menuId) {
	//Set the id for this object
	this.setId(menuId);

	//Set the close on click flag to false
	this.setCloseOnClick(false);

	//Set the default on click function for this element.  This function will be run regardless of the existence of the
	//developer defined click function.  This function is used when a menu items is defined as a submenu.  If the menu is
	//defined as a root menu, this will be ignored.
	/*eslint-disable no-unused-vars*/
	this.setDefaultClickFunction(function(clickEvent) {
		MP_MenuManager.showMenu(this.getId());
	});
	/*eslint-enable no-unused-vars*/
	
	//This following flags are used to allow the menu content to flip horizontally and vertically when there isn't room on the screen to 
	//accommodate them based on the anchor/content connection corners.
	this.m_autoFlipVertical = true;
	this.m_autoFlipHorizontal = true;
	
	//This string identifies the CSS class to add to the anchor element when the menu it is
	//associated with is active
	this.m_anchorActiveClass = "";

	//This string identifies the id of the anchor element that this menu will be attached to
	this.m_anchorElementId = "";

	//This object defines which corners of the content section and the anchor will be connected.  The default
	//values attach the bottom right corner of the anchor with the top right corner of the content
	this.anchorCorner = null;
	this.contentCorner = null;

	//This string identifies the id of the content element that will be created when the menu is opened.  This id
	//will be created on the fly when the menu is opened.
	this.m_contentElementId = "";
	
	//This string will identify the id of the element to append the menu to.  If this is not defined the menu will be appended to the body
	this.m_contentParentId = "";
	
	//This flag will determine if the menu can be shown as persistent.  If set, no hover timeout or mouseleave will cause the 
	//menu to disappear.  This setting is only valid for root menus
	this.m_isPersistent = false;

	//This this the timeout reference we are using to determine if the menu contents should still be displayed or not
	this.m_hoverTimout = null;

	//This array contains the list of MenuItem objects which will make up the contents of the Menu.  This element starts off
	//as null to ensure each instance of the Menu object gets its own list of MenuItem objects.
	this.m_menuItemArr = null;

	//This will be the function which gets executed when the menu is being closed
	this.m_onCloseFunction = null;

	//This boolean will be used to determine if this menu item is the root or a submenu item
	this.m_rootMenuInd = false;

	//This boolean indicates if the user is hovering over the menu or not
	this.m_mouseOverContent = false;

	//This boolean indicated whether the user has their mouse over the MenuItem selection within a menu
	this.m_mouseOverAnchor = false;

	//This boolean indicates if the menu contents are visible to the user or not
	this.m_visibleInd = false;

}

/**
 * Setup the prototype and constructor to inherit from the base Menu object
 */
Menu.prototype = new MenuItem();
Menu.prototype.constructor = MenuItem;

/** Checkers **/

/**
 * Checks to see if the menu should be auto flipped horizontally by the detailed dialog controls.
 * @return {boolean} True if this Menu should be auto flipped horizontally
 */
Menu.prototype.autoFlipHorizontal = function() {
	return this.m_autoFlipHorizontal;
};

/**
 * Checks to see if the menu should be auto flipped vertically by the detailed dialog controls.
 * @return {boolean} True if this Menu should be auto flipped vertically
 */
Menu.prototype.autoFlipVertical = function() {
	return this.m_autoFlipVertical;
};

/**
 * Checks to see if the MenuItem with the passed in id is already defined within the context of this menu.
 */
Menu.prototype.containsMenuItem = function(menuItemId) {
	var x = 0;
	var itemArr = this.m_menuItemArr;
	if(!itemArr) {
		return false;
	}
	for( x = itemArr.length; x--; ) {
		if(itemArr[x].getId() === menuItemId) {
			return true;
		}
	}
	return false;
};

/**
 * Checks to see if the menu is a root menu or a sub menu element
 * @return {boolean} True if this Menu is considered a root menu, false otherwise
 */
Menu.prototype.isRootMenu = function() {
	return this.m_rootMenuInd;
};

/**
 * Checks to see if the user is hovering over the menu or not
 * @return {boolean} True if the mouse is currently over the menu content
 */
Menu.prototype.isMouseOverMenu = function() {
	return this.m_mouseOverContent;
};

/**
 * Checks to see if the user is hovering over the menu anchor or not.
 * @return {boolean} True if the mouse is hovering over the menu anchor, false otherwise
 */
Menu.prototype.isMouseOverAnchor = function() {
	return this.m_mouseOverAnchor;
};

/**
 * Checks to see if the menu should be persistent or not.  A persistent menu does not have a hover timeout nor does the menu 
 * disappear when the user hovers outside of the menu's area.  The menu can only be closed programatically or when another menu
 * is opened.
 * @return {boolean} True if the menu should be shown as persistent, false otherwise
 */
Menu.prototype.isPersistent = function() {
	return this.m_isPersistent;
};

/**
 * Checks to see if the menu contents are visible to the user or not.
 * @return {boolean} True if the menu is currently visible, false otherwise
 */
Menu.prototype.isVisible = function() {
	return this.m_visibleInd;
};

/** Getters **/

/**
 * Gets the CSS class to apply to the menu's anchor element when the menu is active
 * @return {string} The CSS class to apply to the anchor element when the associated menu is active
 */
Menu.prototype.getAnchorActiveClass = function() {
	return this.m_anchorActiveClass;
};

/**
 * Gets the corner of the anchor element which the content section should connect with.
 * @return {[string]} An array of two strings which identify which corner of the anchor element should connect with the content
 * element.
 */
Menu.prototype.getAnchorConnectionCorner = function() {
	if(!this.anchorCorner){
		return ["bottom", "right"];
	}
	return this.anchorCorner;
};

/**
 * Gets the id of the DOM element that this menu is attached to.
 * @return {string} The id of the DOM element that this menu is attached to
 */
Menu.prototype.getAnchorElementId = function() {
	return this.m_anchorElementId;
};

/**
 * Gets the function to call when the Menu is closed
 * @return {function} The function to execute when the Menu is closed
 */
Menu.prototype.getCloseFunction = function() {
	return this.m_onCloseFunction;
};

/**
 * Gets the corner of the content section which the anchor element should connect with.
 * @return {[string]} An array of two strings which identify which corner of the content element should connect with the anchor
 * element.
 */
Menu.prototype.getContentConnectionCorner = function() {
	if(!this.contentCorner){
		return ["top", "right"];
	}
	return this.contentCorner;
};

/**
 * Gets the id of the content container element that is created when the menu is active.
 * @return {string} The id of the DOM element that contains all of the menus contents.
 */
Menu.prototype.getContentElementId = function() {
	return this.m_contentElementId;
};

/**
 * Gets the id of the parent element where the content will be appended.  If this is not set the the document.body will be used
 * @return {string} The id of the DOM element where the menu content will be appended.
 */
Menu.prototype.getContentParentId = function() {
	return this.m_contentParentId;
};

/**
 * Gets the array of MenuItem elements that are set to show within this menu.
 * @return {[MenuItem]} An array of MenuItem object that will be used when creating the menu
 */
Menu.prototype.getMenuItemArray = function() {
	return this.m_menuItemArr;
};

/** Setters **/

/**
 * Sets the corner of the anchor element which should connect with the content section.  The cornerArr should only contain two
 * strings.  The first string will determine the top or bottom edge of the anchor element and the second string will determine the
 * left or right edge of the anchor element.  For example, ["top", "left"].
 * @param {[string]} cornerArr The string array identifying the corner of the anchor element which should connect with the content
 * section
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setAnchorConnectionCorner = function(cornerArr) {
	if( typeof cornerArr === "object" && cornerArr.length) {
		this.anchorCorner = cornerArr;
	}
	return this;
};

/**
 * Sets the CSS class to apply to the anchor element when it's associated menu is active
 * @param {string} activeClass The CSS class to apply to the anchor element when the menu is active
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setAnchorActiveClass = function(activeClass) {
	if( typeof activeClass === "string") {
		this.m_anchorActiveClass = activeClass;
	}
	return this;
};

/**
 * Sets the id of the DOM element that this menu is anchored to
 * @param {string} anchorId The id of the DOM element that this menu is attached to
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setAnchorElementId = function(anchorId) {
	if( typeof anchorId === "string") {
		this.m_anchorElementId = anchorId;
	}
	return this;
};

/**
 * Sets the flag to allow/disallow the horizontal repositioning of menus based on available space.
 * @param {boolean} horizontalFlip A flag used to set the horizontal flip indicator of the detail dialog that is used to house the menu contents
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setAutoFlipHorizontal = function(horizontalFlip) {
	if( typeof horizontalFlip === "boolean") {
		this.m_autoFlipHorizontal = horizontalFlip;
	}
	return this;
};

/**
 * Sets the flag to allow/disallow the vertical repositioning of menus based on available space.
 * @param {boolean} verticalFlip A flag used to set the vertical flip indicator of the detail dialog that is used to house the menu contents
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setAutoFlipVertical = function(verticalFlip) {
	if( typeof verticalFlip === "boolean") {
		this.m_autoFlipVertical = verticalFlip;
	}
	return this;
};

/**
 * Sets the function that will be called when this menu is closed
 * @param {function} closeFunc The function to execute when the menu is closed
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setCloseFunction = function(closeFunc) {
	if(typeof closeFunc === "function") {
		this.m_onCloseFunction = closeFunc;
	}
	return this;
};

/**
 * Sets the corner of the content container element which should connect with the anchor element.  The cornerArr should only contain
 * two strings. The first string will determine the top or bottom edge of the content container element and the second string will
 * determine the left or right edge of the content container element.  For example, ["top", "left"].
 * @param {[string]} cornerArr The string array identifying the corner of the anchor element which should connect with the content
 * section
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setContentConnectionCorner = function(cornerArr) {
	if( typeof cornerArr === "object" && cornerArr.length) {
		this.contentCorner = cornerArr;
	}
	return this;
};

/**
 * Sets the id of the DOM element that contains this menu's content.  This id will be set when the menu is being shown and removed
 * with it is closed.
 * @param {[string]} elementId The id of the DOM element that contains all of the menus contents.
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setContentElementId = function(elementId) {
	if( typeof elementId === "string") {
		this.m_contentElementId = elementId;
	}
	return this;
};

/**
 * Sets the id of the DOM element where the menu contents will be appended.  If this value is set in the root menu 
 * all submenus will also be appended to the same parent.  If no value is supplied then the menu content will be
 * appended to the document.body
 * @param {[string]} parentId The id of the DOM element where the menu content will be appended
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setContentParentId = function(parentId) {
	if( typeof parentId === "string") {
		this.m_contentParentId = parentId;
	}
	return this;
};

/**
 * Sets the element id for the sub menu selection.  This element is only used when creating sub menus
 * @param {string} elementId The element id for the sub menu selection
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setElementId = function(elementId) {
	if(typeof elementId === "string") {
		this.m_elementId = elementId;
		this.m_anchorElementId = elementId;
	}
	return this;
};

/**
 * Sets the active flag for this menu item indicating that the menu is being shown.  Setting a Menu item as active also sets all of
 * the MenuItems that are contained within it to active
 * @param {boolean} activeInd The indicator which will be used to determine if the menu is active or not
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setIsActive = function(activeInd) {
	var menuItems = null;
	var x = 0;

	if( typeof activeInd === "boolean") {
		this.m_activeInd = activeInd;
	}

	//Set all of the menuItems as active/inactive as well
	menuItems = this.getMenuItemArray();
	if(menuItems && menuItems.length) {
		for( x = menuItems.length; x--; ) {
			menuItems[x].setIsActive(activeInd);
		}
	}

	return this;
};

/**
 * Sets the flag which determines if this menu is a root menu or not
 * @param {boolean} rootMenuInd The indicator which will be used to determine if the menu is a root menu or a submenu
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setIsRootMenu = function(rootMenuInd) {
	if( typeof rootMenuInd === "boolean") {
		this.m_rootMenuInd = rootMenuInd;
	}
	return this;
};

/**
 * Sets the flag which indicates if the mouse is hovering over the menu's contents or not.
 * @param {boolean} mouseOver The indicator which indicates if the mouse if over the menu's contents or not
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setIsMouseOverMenu = function(mouseOver) {
	if( typeof mouseOver === "boolean") {
		this.m_mouseOverContent = mouseOver;
	}
	return this;
};

/**
 * Sets the flag which indicates if the mouse is hovering over the menu's anchor or not.
 * @param {boolean} mouseOver The indicator which indicates if the mouse if over the menu's anchor or not
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setIsMouseOverAnchor = function(mouseOver) {
	if( typeof mouseOver === "boolean") {
		this.m_mouseOverAnchor = mouseOver;
	}
	return this;
};


/**
 * Sets the flag which indicates if the menu is persistent or not.  A persistent menu does not have a hover timeout nor does the menu 
 * disappear when the user hovers outside of the menu's area.  The menu can only be closed programatically or when another menu
 * is opened.
 * @param {boolean} persistent The boolean which indicates if the menu should be persistent or not.
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setIsPersistent = function(persistent) {
	if( typeof persistent === "boolean") {
		this.m_isPersistent = persistent;
	}
	return this;
};

/**
 * Sets the visible flag for this menu item indicating that the menu is being shown
 * @param {boolean} visibleInd The indicator which will be used to determine if the menu is being shown or not
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.setIsVisible = function(visibleInd) {
	if( typeof visibleInd === "boolean") {
		this.m_visibleInd = visibleInd;
	}
	return this;
};

/** Helper Functions **/

/**
 * Adds a MenuItem object to the list of menu items that will be shown within this menu
 * @param {MenuItem} menuItem The MenuItem object to add to the Menu.
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.addMenuItem = function(menuItem) {
	//Verify that this element is a MenuItem
	if(MenuItem.prototype.isPrototypeOf(menuItem)) {
		if(!this.m_menuItemArr) {
			this.m_menuItemArr = [];
		}
		this.m_menuItemArr.push(menuItem);
		
		//Add the menu to the collection within MP_MenuManager so we can reference it later when attempting to render the menu
		if(Menu.prototype.isPrototypeOf(menuItem)) {
			//Make sure we append the submenu to the same parent as the root
			menuItem.setContentParentId(this.m_contentParentId);
			MP_MenuManager.updateMenuObject(menuItem);
		}
	}
	return this;
};

/**
 * Sets the hover timeout for the menu contents.  This hover timeout will be used when moving the mouse over and out of the menu's
 * content.  This can be set to a specific time or default to 250 ms.
 * @param {number} setTime The time in milliseconds before the menu will atempt to close itself
 */
Menu.prototype.startHoverTimeout = function(setTime) {
	var that = this;
	setTime = setTime || 250;
	this.clearHoverTimeout();
	this.m_hoverTimout = window.setTimeout(function() {
		//Get the close function and execute it
		var closeFunc = that.getCloseFunction();
		if(closeFunc) {
			closeFunc.call(that);
		}
		MP_MenuManager.closeMenuStack(false);
	}, setTime);

};

/**
 * Clears the hover timeout for the menu.  This happens when the user hovers over the menu's content or when the user hovers
 * over the menu's anchor.
 */
Menu.prototype.clearHoverTimeout = function() {
	window.clearTimeout(this.m_hoverTimout);
};

/**
 * This function will insert a MenuItem object into the list of MenuItems that will be shown within the menu.
 * @param {MenuItem} menuItem The MenuItem object to insert
 * @param {number} index The index where the MenuItem will be inserted
 * @return {Menu} The Menu object calling this function so chaining can be used
 */
Menu.prototype.insertMenuItem = function(menuItem, index) {
	//create the menu item array if it is null
	if(!this.m_menuItemArr) {
		this.m_menuItemArr = [];
	}

	if(typeof index !== "number") {
		return this;
	}

	//Verify that this element is a MenuItem and the index is valid
	if(MenuItem.prototype.isPrototypeOf(menuItem) && index <= this.m_menuItemArr.length && index >= 0) {
		this.m_menuItemArr.splice(index, 0, menuItem);
		//Add the menu to the collection so we can reference it later when attempting to render the menu
		if(Menu.prototype.isPrototypeOf(menuItem)) {
			MP_MenuManager.updateMenuObject(menuItem);
		}
	}
	return this;
};

/**
 * This function removes a specific MenuItem element from the menu item array
 * @param {MenuItem} menuItem The MenuItem object to remove from the Menu's list of menu items.
 * @return {boolean} True if a MenuItem was removed, false otherwise
 */
Menu.prototype.removeMenuItem = function(menuItem) {
	var x = 0;
	var menuItemArr = this.m_menuItemArr;

	if(!menuItemArr) {
		return false;
	}
	//Verify that this element is a MenuItem
	if(MenuItem.prototype.isPrototypeOf(menuItem) && !this.isActive()) {
		for( x = menuItemArr.length; x--; ) {
			if(menuItemArr[x] === menuItem) {
				menuItemArr.splice(x, 1);
				//Remove the menu from  the collection
				if(Menu.prototype.isPrototypeOf(menuItem)) {
					MP_MenuManager.deleteMenuObject(menuItem);
				}
				return true;
			}
		}
	}
	return false;
};

/**
 * This function is used to generate the HTML content for this menu.  It examines each MenuItem that is contained within
 * the m_menuItemArray and generates the content for each item, applies the hover events, applies the click events and returns an
 * array of jQuery objects which will make up the contents of the menu.
 * @return {[jQuery]} An array of jQuery object which make of the menu contents.
 */
Menu.prototype.generateMenuContent = function() {
	var disabledClass = "";
	var element = null;
	var elementArr = [];
	var itemArr = this.getMenuItemArray();
	var itemArrCnt = (itemArr) ? itemArr.length : 0;
	var menuItem = null;
	var menuItemId = "";
	var selectorEle = null;
	var x = 0;

	function generateClickFunction(menuItemObj) {
		return function(ele) {
			var clickFunc = null;
			if(!menuItemObj.isDisabled()) {
				//Check to see if the element should close on click
				if(menuItemObj.closeOnClick()) {
					//Close the entire menu
					MP_MenuManager.closeMenuStack(true);
				}
				else {
					//Close any menus above this item
					MP_MenuManager.closeMenuStack(false);
				}

				//Perform the default MenuItem click event
				clickFunc = menuItemObj.getDefaultClickFunction();
				clickFunc.call(menuItemObj, ele);

				//Perform the specialized MenuItem click action
				clickFunc = menuItemObj.getClickFunction();
				if(clickFunc) {
					clickFunc.call(menuItemObj, ele);
				}

			}
		};

	}

	function generateHoverOverFunction(menuItemObj) {
		return function() {
			//If the MenuItem is a Menu
			if(Menu.prototype.isPrototypeOf(menuItemObj)) {
				//Set the flag to indicate that the user is hovering over the menu anchor
				menuItemObj.setIsMouseOverAnchor(true);
				//Check to see if the menu is currently active
				if(menuItemObj.isVisible()) {
					//Clear the hover timeout so it doesn't disappear
					menuItemObj.clearHoverTimeout();
				}
				else {
					//Show the menu after a quarter of a second
					//Need to make sure we don't open this menu item too soon
					window.setTimeout(function() {
						//If we are still hovering over this menu item selector, show the menu
						if(menuItemObj.isMouseOverAnchor()) {
							MP_MenuManager.showMenu(menuItemObj.getId());
						}
					}, 251);

				}
			}
		};

	}

	function generateHoverOutFunction(menuItemObj) {
		return function() {
			//If the MenuItem is a Menu
			if(Menu.prototype.isPrototypeOf(menuItemObj)) {
				//Set the flag to indicate that the user is no longer hovering over the menu anchor
				menuItemObj.setIsMouseOverAnchor(false);
				//Check to see if the menu is currently active
				if(menuItemObj.isVisible()) {
					//Start the hover timeout so the menu will disappear if we dont go back
					menuItemObj.startHoverTimeout();
				}
			}
		};

	}

	//Loop through each MenuItem and have it generate its menu selection content
	for( x = 0; x < itemArrCnt; x++) {
		menuItem = itemArr[x];
		//Create and store the dom element id for the menu item
		menuItemId = "menuSel" + x + "-" + this.getId();
		menuItem.setElementId(menuItemId);
		//Create the menu item html container
		disabledClass = (menuItem.isDisabled()) ? "menu-item-disabled" : "";
		element = $("<div></div>").addClass("menu-item " + disabledClass + " " + menuItem.getTypeClass()).attr("id", menuItemId);

		//Hover logic for the menu items
		$(element).hover(generateHoverOverFunction(menuItem), generateHoverOutFunction(menuItem));
		selectorEle = menuItem.generateSelectionContent();
		/*eslint-disable no-loop-func*/
		$(selectorEle).each(function(index, selector) {
			$(element).append(selector);
		});
		/*eslint-enable no-loop-func*/

		//Add the default and custom click event to the action
		$(element).click(generateClickFunction(menuItem));

		elementArr.push(element);
	}
	return elementArr;
};

/**
 * This function is in charge of generating the selection content when it is defined as a submenu.  This content will make up the
 * anchor of the submenu.
 * @return {[jQuery]} An array of jQuery elements which will make up the menu selection HTML content.
 */
Menu.prototype.generateSelectionContent = function() {
	return [$("<span>&nbsp;</span>").addClass("menu-selection-ind"), $("<span></span>").addClass("menu-selection").html(this.getLabel()), $("<span>&nbsp;</span>").addClass("menu-submenu-ind")];
};
/**
 * The DynamicMenu object inherits from the Menu object and adds additional functionality used when creating dynamic menus.
 * Specifically the developer can define the content creation function which will be in charge of generating the HTML content
 * to show within the menu display.
 * @constructor
 */
function DynamicMenu(menuId) {
	//Set the id for this object
	this.setId(menuId);

	//Set the close on click flag to false
	this.setCloseOnClick(false);

	//This will be the function used to generate the dynamic menu's content
	this.m_contentCreationFunc = function() {};

}

/**
 * Setup the prototype and constructor to inherit from the base Menu object
 */
DynamicMenu.prototype = new Menu();
DynamicMenu.prototype.constructor = Menu;

/** Checkers **/

/** Getters **/

/**
 * Returns the function that will be used to create the dynamic menu content.
 * @return {function} The function to call when the dynamic menu should create its content
 */
DynamicMenu.prototype.getContentCreationFunction = function() {
	return this.m_contentCreationFunc;
};

/** Setters **/

/**
 * Sets the function to execute when the DynamicMenu should render its contents.
 * @param {function} creationFunc The function that will be executed when the MenuSelection items is clicked for this DynamicMenu
 * @return {DynamicMenu} The DynamicMenu object calling this function so chaining can be used
 */
DynamicMenu.prototype.setContentCreationFunction = function(creationFunc) {
	if(typeof creationFunc === "function") {
		this.m_contentCreationFunc = creationFunc;
	}
	return this;
};

/** Helper Functions **/
/**
 * Call the function defined to create the dynamic menu's content and passes the results back to the caller.  If no function
 * is defined it will simply return null.
 * @return {[jQuery]} An array of jQuery object which will be used as the dynamic menu content.  Null of the content creation
 * function is not defined.
 */
DynamicMenu.prototype.generateMenuContent = function() {
	var contentCreationFunct = this.getContentCreationFunction();
	if(contentCreationFunct) {
		return contentCreationFunct.call(this);
	}
	return null;
};
/*global DynamicMenu*/
/**
 * @constructor
 * The AdvancedFilterMenu object will be used by component developers creating specialized filter menus for components.
 * This menu creates dialog for the developer so that advanced filter menus are consistent across all uses.
 */
function AdvancedFilterMenu(menuId) {

	//Set the id for the menu element
	this.setId(menuId);

	//Set the type class for this type of menu
	this.setTypeClass("adv-filter-menu-override");
	
	//Prevent the vertical flipping of the advanced filter menu
	this.setAutoFlipVertical(false);
	
	//Default settings for the Advanced Filter Menu
	this.settings = {
		//Settings for the cancel button
		cancel : {
			enabled : false,
			onclick : function() {
				return false;
			},

			label : i18n.CANCEL
		},
		//Settings for the options checkbox
		checkbox : {
			enabled : false,
			isChecked : false,
			onclick : function() {
				return false;
			},

			label : ""
		},
		//Settins for the sction link
		actionLink : {
			enabled : false,
			onclick : function() {
				return false;
			},

			label : ""
		},
		//This is the function that will be called when attempting to populate the advanced filter menu content
		advancedFilterCreationFunction : function() {
			return null;
		},
		//This is the width that will be applied to the menu when rendering
		dimensions : {
			width : 600
		},
		//Settings for the save button
		save : {
			enabled : false,
			onclick : function() {
				return false;
			},

			label : i18n.SAVE
		}
	};
	//Set the content creation function for this instance of the AdvnacedFilterMenu
	this.setContentCreationFunction(function() {
		var checkbox = this.settings.checkbox;
		var actionLink = this.settings.actionLink;
		var save = this.settings.save;
		var cancel = this.settings.cancel;
		//Create the main container for all of the AdvancedFilterMenu
		var menuContent = $("<div class='adv-filter-menu'></div>").width(this.settings.dimensions.width);
		//Create the inner container for the AdvancedFilterMenu
		var innerContainer = $("<div class='adv-filter-menu-inner-container'></div>").appendTo(menuContent);
		//Create the label based on the label defined in the object and append to the innerContainer
		$("<div class='adv-filter-menu-label'>" + this.getLabel() + "</div>").appendTo(innerContainer);
		//Add the custom content into a pre-defined section by calling the advancedFilterCreationFunction
		$("<div class='adv-filter-menu-custom-content'></div>").html(this.settings.advancedFilterCreationFunction()).appendTo(innerContainer);
		//If we do not have any of the controls enabled, just return the menu without any controls
		if(!(checkbox.enabled || save.enabled || cancel.enabled || actionLink.enabled)) {
			return menuContent;
		}

		//At this point, we have at least one control
		var controlContainer = $("<div class='adv-filter-menu-control-container'></div>").appendTo(menuContent);
		var buttonContainer = $("<span class='adv-filter-menu-button-container'></span>");
		var savePadding = 0;
		//Check to see if we should create a check box or an action link
		if(checkbox.enabled && checkbox.label) {
			var checkBoxContainer = $("<span class='adv-filter-menu-checkbox-container'></span>");
			//Create the contents for the checkbox and label and apply the click events
			var checkboxEle = $("<input type='checkbox'>");
			checkboxEle[0].checked = checkbox.isChecked;
			checkboxEle.click(checkbox.onclick).appendTo(checkBoxContainer);
			$("<span class='adv-filter-menu-checkbox-label'>" + checkbox.label + "</span>").appendTo(checkBoxContainer);
			checkBoxContainer.appendTo(controlContainer);
		}
		else if(actionLink.enabled && actionLink.label) {
			//Create the content for the action link and apply the click events
			var actionLinkContainer = $("<span class='adv-filter-menu-action-container'></span>");
			$("<span class='adv-filter-menu-action-label'>" + actionLink.label + "</span>").click(actionLink.onclick).appendTo(actionLinkContainer);
			actionLinkContainer.appendTo(controlContainer);
		}
		//If the cancel button is enabled
		if(cancel.enabled) {
			$("<button type='button' class='adv-filter-menu-button'>").html(cancel.label).click(cancel.onclick).appendTo(buttonContainer);
			savePadding = 6;
			buttonContainer.appendTo(controlContainer);
		}
		//If the save button has been enabled
		if(save.enabled) {
			$("<button type='button' class='adv-filter-menu-button'>").html(save.label).css("margin-right", savePadding).click(save.onclick).appendTo(buttonContainer);
			buttonContainer.appendTo(controlContainer);
		}
		return menuContent;
	});

}

AdvancedFilterMenu.prototype = new DynamicMenu();
AdvancedFilterMenu.prototype.constructor = DynamicMenu;

/**
 * Sets the function that will inject the custom menu content for the AdvancedFilterMenu
 * @param {function} contentFunction The function used to inject the custom content into this menu
 */
AdvancedFilterMenu.prototype.setAdvancedFilterCreationFunction = function(contentFunction) {
	if(contentFunction && typeof contentFunction === "function") {
		this.settings.advancedFilterCreationFunction = contentFunction;
	}
};

/**
 * Sets the label to appear on the Cancel button
 * @param {string} lebel The string used as the label
 */
AdvancedFilterMenu.prototype.setCancelButtonLabel = function(label) {
	if(label && typeof label === "string") {
		//If the user is setting the label, assume they want the button enabled
		this.setIsCancelButtonEnabled(true);
		this.settings.cancel.label = label;
	}
};

/**
 * Sets the function to occur when the user clicks the cancel button
 * @param {function} cancelFunction The function to execute when the user clicks the cancel button
 */
AdvancedFilterMenu.prototype.setCancelFunction = function(cancelFunction) {
	if(cancelFunction && (typeof cancelFunction === "function")) {
		//If the user is setting the cancel function, assume they want the button enabled
		this.setIsCancelButtonEnabled(true);
		this.settings.cancel.onclick = cancelFunction;
	}
};

/**
 * Sets the function for when the user clicks the check box
 * @param {function} checkboxClickFunction the function to execute when the user clicks the check box
 */
AdvancedFilterMenu.prototype.setCheckboxClickFunction = function(checkboxClickFunction) {
	if(checkboxClickFunction && (typeof checkboxClickFunction === "function")) {
		//If the user defines the checkbox click function, assume they want it enabled
		this.setIsCheckboxEnabled(true);
		this.settings.checkbox.onclick = checkboxClickFunction;
	}
};

/**
 * Sets the label to the right of the checkbox
 * @param {string} label The label to the right of the checkbox
 */
AdvancedFilterMenu.prototype.setCheckboxLabel = function(label) {
	if(typeof label === "string") {
		this.settings.checkbox.label = label;
	}
};

/**
 * Sets the function to execute when you click on the action link
 * @param {function} linkFunc The function to execute when the action link is clicked
 */
AdvancedFilterMenu.prototype.setActionLinkFunction = function(linkFunc) {
	if(linkFunc && typeof linkFunc === "function") {
		//If the user is setting the action label assume they are wanting it to show
		this.setIsActionLinkEnabled(true);
		this.settings.actionLink.onclick = linkFunc;
	}
};

/**
 * Sets the label for the action link
 * @param {string} label The label for the action link
 */
AdvancedFilterMenu.prototype.setActionLinkLabel = function(label) {
	if(typeof label === "string") {
		this.settings.actionLink.label = label;
	}
};

/**
 * Function to set if the cancel button is enabled
 * @param {boolean} isEnabled True if the cancel button is to be enabled, false otherwise
 */
AdvancedFilterMenu.prototype.setIsCancelButtonEnabled = function(isEnabled) {
	if(typeof isEnabled === "boolean") {
		this.settings.cancel.enabled = isEnabled;
	}
};

/**
 * Sets whether or not the check box is checked by default
 * @param {boolean} isChecked True if the check box is checked by default, false otherwise
 */
AdvancedFilterMenu.prototype.setIsCheckboxChecked = function(isChecked) {
	if(typeof isChecked === "boolean") {
		this.settings.checkbox.isChecked = isChecked;
	}
};

/**
 * Sets whether or not the check box for the menu is enabled
 * @param {boolean} isEnabled True if the check box should be enabled, false otherwise
 */
AdvancedFilterMenu.prototype.setIsCheckboxEnabled = function(isEnabled) {
	if(typeof isEnabled === "boolean") {
		this.settings.checkbox.enabled = isEnabled;
	}
};

/**
 * Sets whether or not the action link for the menu is enabled
 * @param {boolean} isEnabled True if the action link should be enabled or not
 */
AdvancedFilterMenu.prototype.setIsActionLinkEnabled = function(isEnabled) {
	if(typeof isEnabled === "boolean") {
		this.settings.actionLink.enabled = isEnabled;
	}
};

/**
 * Function to set if the save button is enabled
 * @param {boolean} isEnabled True if the save button should be enabled or not
 */
AdvancedFilterMenu.prototype.setIsSaveButtonEnabled = function(isEnabled) {
	if(typeof isEnabled === "boolean") {
		this.settings.save.enabled = isEnabled;
	}
};

/**
 * Sets the label to appear on the Save button
 * @param {string} label The string used as the label
 */
AdvancedFilterMenu.prototype.setSaveButtonLabel = function(label) {
	if(label && typeof label === "string") {
		this.setIsSaveButtonEnabled(true);
		this.settings.save.label = label;
	}
};

/**
 * Sets the function to occur when the user clicks the save button
 * @param {function} saveFunction The function to execute when the user clicks the save button
 */
AdvancedFilterMenu.prototype.setSaveFunction = function(saveFunction) {
	if(saveFunction && (typeof saveFunction === "function")) {
		//If the user is setting the save function, assume they want the button enabled
		this.setIsSaveButtonEnabled(true);
		this.settings.save.onclick = saveFunction;
	}
};

/**
 * Sets the width of the AdvancedFilterMenu
 * @param {number} width How wide the menu is to be when first rendered
 */
AdvancedFilterMenu.prototype.setWidth = function(width) {
	if(width && typeof width === "number") {
		this.settings.dimensions.width = width;
	}
};

function ContextMenu(menuId) {
	//Set the id for this object
	this.setId(menuId);
	//The is the x offset of the cursor at the time of the context menu creation
	this.m_xOffset = 0;
	//The is the x offset of the cursor at the time of the context menu creation
	this.m_yOffset = 0;
}

/**
 * Setup the prototype and constructor to inherit from the base Menu object
 */
ContextMenu.prototype = new Menu();
ContextMenu.prototype.constructor = Menu;

/** Checkers **/

/** Getters **/

ContextMenu.prototype.getXOffset = function() {
	return this.m_xOffset;
};


ContextMenu.prototype.getYOffset = function() {
	return this.m_yOffset;
};


/** Setters **/


ContextMenu.prototype.setXOffset = function(xOffset) {
	if(typeof xOffset === "number") {
		this.m_xOffset = xOffset;
	}
	return this;
};


ContextMenu.prototype.setYOffset = function(yOffset) {
	if(typeof yOffset === "number") {
		this.m_yOffset = yOffset;
	}
	return this;
};

/** Helper Functions **/

ContextMenu.prototype.setAnchorElement = function() {
	$(document.body).append($("<div id='" + this.getId() + "Anchor' class='context-menu'></div>").css({
		"top": this.getYOffset(),
		"left": this.getXOffset()
	}));
};

ContextMenu.prototype.removeAnchorElement = function(){
	$("#" + this.getId() + "Anchor").remove();
};
/**
 * The MenuSelection object inherits from the MenuItem object and is used as a basic selection option for a menu.  
 * The MenuSelection object does have the power to determine if the parent Menu will closed or not when it is clicked.
 * Additional options for this menu item include showing a custom selection icon in front of the menu item.
 * @constructor
 */
function MenuSelection(selectionId) {
	//Set the id for this object
	this.setId(selectionId);
	
	//Set the default on click function for this element.  This function will be run regardless of the existence of the 
	//developer defined click function.
	/*eslint-disable no-unused-vars*/
	this.setDefaultClickFunction(function(clickEvent){
		//Toggle the selection indicator if we aren't supposed to close the menu and this item isn't disabled
		if(!this.closeOnClick() && !this.isDisabled()){
			this.toggleSelection();
		}
	});
	/*eslint-enable no-unused-vars*/
	
	//This flag determines if the menu selection should show as being selected or not.
	this.m_selectedInd = false;
	
	//The selection class will be used to style item which have been selected within the menu
	this.m_selectedClass = "menu-item-selected";
}

/**
 * Setup the prototype and constructor to inherit from the base MenuItem object
 */
MenuSelection.prototype = new MenuItem();
MenuSelection.prototype.constructor = MenuItem;

/** Checkers **/
/**
 * Checks to see if this MenuSelection should be shown as selected or not
 * @return {boolean} True if this MenuSelection has been selected or should default to being selected
 */
MenuSelection.prototype.isSelected = function(){
	return this.m_selectedInd;
};

/** Getters **/
/**
 * Returns the class to apply to items which have been selected within the menu or are defaulted to being selected
 * @return {string} The class which will be applied to selected menu selection items
 */
MenuSelection.prototype.getSelectedClass = function(){
	return this.m_selectedClass;
};

/** Setters **/
/**
 * Sets the indicator which determines if this MenuSelection should be shown as selected or not within the menu
 * @param {boolean} selected A boolean which indicates if this MenuSelection item should show up as selected within the menu
 * @return {MenuSelection}
 */
MenuSelection.prototype.setIsSelected = function(selected){
	var selectedClass = "";
	var element = null;
	if(typeof selected === "boolean"){
		this.m_selectedInd = selected;
	
		//If the MenuSelection element is active update the visuals
		if(this.isActive()){
			selectedClass = this.getSelectedClass();
			element = $("#" + this.getElementId() + " :first-child");
			if(selected){
				$(element).addClass(selectedClass);
			}
			else{
				$(element).removeClass(selectedClass);
			}
		}
	}
		
	return this;
};

/**
 * Sets the class which will be applied to the menu item element which indicates an item has been selected.
 * @param {string} selectedClass The CSS class to apply to a selected menu item
 * @return {MenuSelection} The MenuSelection object calling this function so chaining can be used
 */
MenuSelection.prototype.setSelectedClass = function(selectedClass){
	if(typeof selectedClass === "string"){
		this.m_selectedClass = selectedClass;
	}
	return this;
};

/** Helper Functions **/

/**
 * This function is used to toggle the isSelected flag for the MenuSelection item
 */
MenuSelection.prototype.toggleSelection = function(){
	this.setIsSelected(!this.isSelected());
};

/**
 * This function is used to generate the HTML which will be shown within the menu when it is rendered
 */
MenuSelection.prototype.generateSelectionContent = function(){
	var selectedClass = this.getSelectedClass();
	if(!this.isSelected()){
		selectedClass = "";
	}
	return [$("<span>&nbsp;</span>").addClass("menu-selection-ind " + selectedClass), $("<span></span>").addClass("menu-selection").html(this.getLabel())];
};/* This object is used to easily place a separator within the context of a menu */
function MenuSeparator(seperatorId) {
	//Set the id for this object
	this.setId(seperatorId);

	//Set the type class for this item since it requires special styling
	this.setTypeClass("menu-separator");
}

/**
 * Setup the prototype and constructor to inherit from the base MenuItem object
 */
MenuSeparator.prototype = new MenuItem();
MenuSeparator.prototype.constructor = MenuItem;

/**
 * Returns a non-breaking space so the container element will always show.
 */
MenuSeparator.prototype.generateSelectionContent = function() {
	return ["&nbsp;"];
};/* This object is used to easily place a separator within the context of a menu */
function MenuSeparator(seperatorId) {
	//Set the id for this object
	this.setId(seperatorId);
	
	//Set the type class for this item since it requires special styling
	this.setTypeClass("menu-separator");
}

/**
 * Setup the prototype and constructor to inherit from the base MenuItem object
 */
MenuSeparator.prototype = new MenuItem();
MenuSeparator.prototype.constructor = MenuItem;

/**
 * Returns a non-breaking space so the container element will always show.
 */
MenuSeparator.prototype.generateSelectionContent = function(){
	return ["&nbsp;"];
};/**
 * The ThemeSelector object inherits from the DynamicMenu object and adds additional functionality used when choosing a theme color.
 * @param themeSelectorId This is the id of the MenuItem
 * @param compId This theme selector should be tied to a component, this component id is for that component
 * @param fullId Used to specify the anchor element of this menu
 * @param ns Used the specify the namespace for the component, e.g. "cust" for custom components (available in getStyles())
 * @constructor
 */
function ThemeSelector(themeSelectorId, compId, fullId, ns) {

    this.m_componentId = compId;
    this.m_styleId = ns + compId;

	//Set the id for this object
	this.setId(themeSelectorId);
    this.setLabel(i18n.discernabu.COLOR_THEME);
    this.setAnchorElementId(fullId);
    this.setAnchorConnectionCorner(["top", "left"]);
    this.setContentConnectionCorner(["top", "right"]);
    this.setContentCreationFunction(function() {
        var themeSelectorHtml = "";
        var i18nCore = i18n.discernabu;
        var themeSelectorColors = [
            { "title": i18nCore.COLOR_STANDARD, "name": "lightgrey", "capsName": "LightGrey" },
            { "title": i18nCore.COLOR_BROWN, "name": "brown", "capsName": "Brown" },
            { "title": i18nCore.COLOR_CERNER_BLUE, "name": "cernerblue", "capsName": "CernerBlue" },
            { "title": i18nCore.COLOR_DARK_GREEN, "name": "darkgreen", "capsName": "DarkGreen" },
            { "title": i18nCore.COLOR_GREEN, "name": "green", "capsName": "Green" },
            { "title": i18nCore.COLOR_GREY, "name": "grey", "capsName": "Grey" },
            { "title": i18nCore.COLOR_LIGHT_BLUE, "name": "lightblue", "capsName": "LightBlue" },
            { "title": i18nCore.COLOR_NAVY, "name": "navy", "capsName": "Navy" },
            { "title": i18nCore.COLOR_ORANGE, "name": "orange", "capsName": "Orange" },
            { "title": i18nCore.COLOR_PINK, "name": "pink", "capsName": "Pink" },
            { "title": i18nCore.COLOR_PURPLE, "name": "purple", "capsName": "Purple" },
            { "title": i18nCore.COLOR_YELLOW, "name": "yellow", "capsName": "Yellow" }
        ];
        var titleMarkup;
        var idMarkup;
        var classMarkup;
        var dataMarkup;
        var componentIdMarkup;
        var styleIdMarkup;

        for (var i = 0; i < themeSelectorColors.length; i++) {
            titleMarkup = ' title="' + themeSelectorColors[i].title + '"';
            idMarkup = ' id="optConfigMnu' + themeSelectorColors[i].capsName + '"';
            classMarkup = ' class="opts-menu-config-item opt-config-mnu-' + themeSelectorColors[i].name + '"';
            dataMarkup = ' data-color="' + themeSelectorColors[i].name + '"';
            componentIdMarkup = ' component-id="' + this.m_componentId + '"';
            styleIdMarkup = ' style-id="' + this.m_styleId + '"';

            themeSelectorHtml += '<div' + titleMarkup + classMarkup + dataMarkup + componentIdMarkup + styleIdMarkup + idMarkup + '></div>';
        }
        themeSelectorHtml = '<div class="opts-menu-config-content-custom" id="optMenuConfig' + this.m_componentId + '">' + themeSelectorHtml + '</div>';

        return [ $("<span>&nbsp;</span>").html(themeSelectorHtml).click(this.themeSelectorClickHandler) ];
    });

}

/**
 * Setup the prototype and constructor to inherit from the base DynamicMenu object
 */
ThemeSelector.prototype = new DynamicMenu();
ThemeSelector.prototype.constructor = DynamicMenu;


/**
 * This function will handle the click events on the menu colors
 * @param e
 */
ThemeSelector.prototype.themeSelectorClickHandler = function(e) {
    var color = e.target.getAttribute("data-color");
    var section = _g(e.target.getAttribute("style-id"));
    if (section) {
        var colorString = "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow";
        //a color is found in the class name so replace it with ""
        if (colorString.indexOf(color) >= 0) {
            var colorRegExp = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/;
            section.className = section.className.replace(colorRegExp, "");
        }

        //add the new color so it changes for the user
        Util.Style.acss(section, color);
        var componentId = Number(e.target.getAttribute("component-id"));
        var component = MP_Util.GetCompObjById(componentId);
        component.setCompColor(color);
        //add the color to the component properties
        setTimeout(function() {
            MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, color, null, false);
        }, 0);
    }
};


/** Checkers **/

/** Getters **/
/*global DynamicMenu*/
/**
 * @constructor
 * The UtilitiesMenu object will be used by component developers to create utilities drop down dialogs which are persistent.
 * This means that there will be no timeout when the user hovers over and hovers our of the menus content area.  These menus 
 * will need to be closed programitically or will be closed automatically when another menu is opened.
 */
function UtilitiesMenu(menuId) {

	//Set the id for the menu element
	this.setId(menuId);

	//Set the type class for this type of menu
	this.setTypeClass("utilities-menu-override");

	//Set the default active anchor class
	this.setAnchorActiveClass("vwp-util-active");
	//Set the menu as persistent
	this.setIsPersistent(true);
	
	//Set the root menu flag
	this.setIsRootMenu(true);
	
	//Default settings for the Utilities Menu
	this.settings = {
		//This is the function that will be called when attempting to populate the Utilities Menu content
		utilitiesContentCreationFunction : function() {
			return null;
		},
		//This is the width that will be applied to the menu when rendering
		dimensions : {
			width : 300,
			maxHeight: ""
		}
	};
	//Set the content creation function for this instance of the UtilitiesMenu
	this.setContentCreationFunction(function() {
		//Create the main container for all of the UtilitiesMenu
		var menuContent = $("<div class='utilities-menu'></div>").width(this.settings.dimensions.width);
		//Create the inner container for the UtilitiesMenu
		var innerContainer = $("<div class='utilities-menu-inner-container'></div>").appendTo(menuContent);
		//Create the label based on the label defined in the object and append to the innerContainer
		$("<div class='utilities-menu-label'>" + this.getLabel() + "</div>").appendTo(innerContainer);
		//Add the custom content into a pre-defined section by calling the utilitiesContentCreationFunction
		$("<div class='utilities-menu-custom-content'></div>").css("max-height", this.settings.dimensions.maxHeight || "").html(this.settings.utilitiesContentCreationFunction()).appendTo(innerContainer);
		return menuContent;
	});

}

UtilitiesMenu.prototype = new DynamicMenu();
UtilitiesMenu.prototype.constructor = DynamicMenu;

UtilitiesMenu.prototype.setIsRootMenu = function(isRoot){
	if(typeof isRoot === "boolean") {
		if(!isRoot){
			throw new Error("UtilitiesMenu can only be used as root menus");
		}
		else{
			this.m_rootMenuInd = isRoot;
		}
	}
};

UtilitiesMenu.prototype.setIsPersistent = function(isPersistent){
	if(typeof isPersistent === "boolean") {
		if(!isPersistent){
			throw new Error("UtilitiesMenu can only be used as a persistent menu");
		}
		else{
			this.m_isPersistent = isPersistent;
		}
	}
};

/**
 * Sets the function that will inject the custom menu content for the UtilitiesMenu
 * @param {function} contentFunction The function used to inject the custom content into this menu
 */
UtilitiesMenu.prototype.setUtilitiesContentCreationFunction = function(contentFunction) {
	if(contentFunction && typeof contentFunction === "function") {
		this.settings.utilitiesContentCreationFunction = contentFunction;
	}
};

/**
 * Sets the width of the UtilitiesMenu
 * @param {number} width How wide the menu is to be when first rendered
 */
UtilitiesMenu.prototype.setWidth = function(width) {
	if(width && typeof width === "number") {
		this.settings.dimensions.width = width;
	}
};
/**
 * Sets the maxHeight of the utilities menu
 * @param {number} width How wide the menu is to be when first rendered
 */
UtilitiesMenu.prototype.setMaxHeight = function(maxHeight) {
	if(maxHeight && typeof maxHeight === "number") {
		this.settings.dimensions.maxHeight = maxHeight;
	}
};
