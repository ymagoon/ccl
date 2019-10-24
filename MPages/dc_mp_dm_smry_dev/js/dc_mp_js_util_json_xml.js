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
	  *  (3) install the Script Source Code in Client's environment.          *
	  *  B. Use of the Script Source Code is for Client's internal purposes   *
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
	  *     Source Code prior to moving such code into Client's production    *
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
	  *     performance of Client's System.                                   *
	  *  C. Client waives, releases, relinquishes, and discharges Cerner from *
      *     any and all claims, liabilities, suits, damages, actions, or      *
	  *     manner of actions, whether in contract, tort, or otherwise which  *
	  *     Client may have against Cerner, whether the same be in            *
	  *     administrative proceedings, in arbitration, at law, in equity, or *
      *     mixed, arising from or relating to Client's use of Script Source  *
	  *     Code.                                                             *
	  * 5. Retention of Ownership                                             *
	  *    Cerner retains ownership of all software and source code in this   *
	  *    service package. Client agrees that Cerner owns the derivative     *
	  *    works to the modified source code. Furthermore, Client agrees to   *
	  *    deliver the derivative works to Cerner.                            *
  ~BE~************************************************************************/
/******************************************************************************
 
        Source file name:       dc_mp_js_util_json_xml.js
 
        Product:                Discern Content
        Product Team:           Discern Content
 
        File purpose:           Provides the UtilJsonXml class with methods
        						to parse and debug JSON/XML.
 
        Special Notes:          <add any special notes here>
 
;~DB~**********************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                    		  *
;**************************************************************************************
;*                                                                            		  *
;*Mod Date     Engineer             		Feature      Comment                      *
;*--- -------- -------------------- 		------------ -----------------------------*
;*000 		   RB018070				    	######       Initial Release              *
;~DE~**********************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/

/**
* Create a new instance of UtilJsonXml.
* @classDescription		This class creates a new UtilJsonXml with to parse/debug JSON and XML.
* @return {Object}	Returns a new UtilJsonXml object.
* @constructor	
*/
var UtilJsonXml = function () {
	"use strict";
	/* ***** Private Methods & Variables ***** */
	var cur_dt_tm = new Date(),
	debug_window,
	_w = window,
	_d = document,
	whtSpEnds = new RegExp("^\\s*|\\s*$", "g"),
	whtSpMult = new RegExp("\\s\\s+", "g"),
	/** 
     * Display an alert message with the error details and method name
     * @memberOf UtilJsonXml
     * @method
     * @param  {String}	msg	Error message.
     * @param  {String}	fnc	Method name of error.
     * @private
     */
	error_handler = function(msg, fnc){
		alert(msg + " - " + fnc);
	},	
	
	/** 
     * Returns the real type of a variable.
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	v	Variable to check type of.
     * @return {String}		Type of the variable.
     * @private
     */
	RealTypeOf = function(v){
		try {
			if (typeof(v) === "object") {
				if (v === null) {
					return "null";
				}
				if (v.constructor === ([]).constructor) {
					return "array";
				}
				if (v.constructor === (new Date()).constructor) {
					return "date";
				}
				if (v.constructor === (new RegExp()).constructor) {
					return "regex";
				}
				return "object";
			}
			return typeof(v);
		} 
		catch (e) {
		
			error_handler(e.message, "RealTypeOf()");
		}
	},
	
	 /** 
     * Formats the given JSON Object for display
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object} jObj	JSON Object to be formatted.
     * @param  {String} sIndent Indent string to be appended before each line of formatted text.
     * @return {String}		Formatted JSON String.
     * @private
     */
	format_json = function (jObj, sIndent) {
		try {
			if (!sIndent) {
				sIndent = "";
			}
			var sIndentStyle = "&nbsp;&nbsp;"
			,iCount = 0
			,sDataType = RealTypeOf(jObj)
			,sHTML
			,j;
			// open object
			if (sDataType === "array") {
				if (jObj.length === 0) {
					return "[]";
				}
				sHTML = "[";
			}
			else {
				if (sDataType === "object" && sDataType !== null) {
					sHTML = "{";
				}
				else { // object is empty
					return "{}";
				}
			}
			
			// loop through items
			iCount = 0;
			for (j in jObj) {
				if (RealTypeOf(jObj[j]) !== "function") {
					if (iCount > 0) {
						sHTML += ",";
					}
					if (sDataType === "array") {
						sHTML += ("<br>" + sIndent + sIndentStyle);
					}
					else {
						sHTML += ("<br>" + sIndent + sIndentStyle + "\"" + j + "\"" + ": ");
					}
					
					// display relevant data type
					switch (RealTypeOf(jObj[j])) {
						case "array":
						case "object":
							sHTML += format_json(jObj[j], (sIndent + sIndentStyle));
							break;
						case "boolean":
						case "number":
							sHTML += jObj[j].toString();
							break;
						case "null":
							sHTML += "null";
							break;
						case "string":
							sHTML += ("\"" + jObj[j] + "\"");
							break;
						case "function":
							break;
						default:
							sHTML += ("TYPEOF: " + typeof(jObj[j]));
					}
					// loop
					iCount = iCount +1;
				}
			}
			
			// close object
			if (sDataType === "array") {
				sHTML += ("<br>" + sIndent + "]");
			}
			else {
				sHTML += ("<br>" + sIndent + "}");
			}
			// return
			return sHTML;
		} 
		catch (e) {
			error_handler(e.message, "format_json()");
		}
		
	},
	
	/** 
     * Formats the given XML Object for display.
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	xObj	XML Object to be formatted.
     * @param  {String}	sIndent	Indent string to be appended before each line of formatted text.
     * @return {String}		Formatted XML String.
     * @private
     */
	format_xml = function(Obj,sIndent){
		try {
			var str = "",
				sIndentStyle = "&nbsp;&nbsp;",
				i = 0,
				j = 0;
			if (!sIndent) {
				sIndent = "";
			}
			for (i = 0; i < Obj.childNodes.length; i++) { // loop through child nodes on same level
				if (Obj.childNodes[i].tagName) { // valid tag
					str += sIndent + "&#60" + Obj.childNodes[i].tagName;
					if (Obj.childNodes[i].attributes) // valid attributes
						for (j = 0; j < Obj.childNodes[i].attributes.length; j++) // loop through tag attributes				
 							str += "&nbsp;&nbsp;" + Obj.childNodes[i].attributes[j].name + "&nbsp;=&nbsp;'" + Obj.childNodes[i].attributes[j].value + "'";
					str += "&#62;<br>";
				}				
				if (!Obj.childNodes[i].nodeValue && RealTypeOf(Obj.childNodes[i].childNodes) === "object") // Recurse Child Nodes
					str += sIndent + format_xml(Obj.childNodes[i], sIndent + sIndentStyle);
				else 
					if (Obj.childNodes[i].nodeValue) // valid Node value
						str += sIndent + Obj.childNodes[i].nodeValue + "<br>";
				
				if (Obj.childNodes[i].tagName) // valid tag			
					str += sIndent + "&#60/" + Obj.childNodes[i].tagName + "&#62;<br>";
			}
			return str;
		}
		catch(e){
			
            error_handler(e.message, "format_xml()");
		}
    },
		
	 /** 
     * Normalize the given string by removing trailing and leading whitespaces.
     * @memberOf UtilJsonXml
     * @method
     * @param {String}	s	String to be normalized.
     * @return {String}		Normalized string.
     * @private
     */ 
	normalizeString = function(s){
		// Collapse any multiple whites space.
		s = s.replace(whtSpMult, " ");
		// Remove leading or trailing white space.  
		s = s.replace(whtSpEnds, "");
		return (s);
	},
	
	/** 
     * Returns the appropriate ActiveXObject based on the Internet Explorer Version.
     * @memberOf UtilJsonXml
     * @method
     * @return {Object}		ActiveXObject used to load XML.
     * @private
     */
	createDocument = function(){
		try {
			if (typeof arguments.callee.activeXString !== "string") {
				var versions = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument"],
				i,
				len = versions.length;
				//Loop through possible ActiveX versions.
				for (i = 0; i < len; i+=1) {
					try {
						this.xml_object = new ActiveXObject(versions[i]);
						arguments.callee.activeXString = versions[i];
						return this.xml_object;
					} 
					catch (ex) {
						//If the version isn't available, the call to
						//create a new ActiveXObject throws an error,
						//in which case the catch statement catches the error
						//and the loop continues.
					}
				}
			}
			return new ActiveXObject(arguments.callee.activeXString);
		} 
		catch (e) {
			error_handler(e.message, "createDocument()");
		}
	};
	
	/* ***** Public Methods & Variables ***** */
	this.text_debug = " ";
	this.debug_mode_ind = 0;
	this.text_format = "html";
	this.target_url = "";
	this.json_object = {};
	this.xml_object = {};
	this.browserName = "msie";
	this.target_debug = "_utiljsonxml_";
	this.wParams = "fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no";
		
	this.launch_debug = function(){
		try {
			if (!debug_window) {
				debug_window = _w.open(this.target_url, this.target_debug, this.wParams, 0);
				debug_window.document.write("<title>DC MPages Debugger</title><div>" + this.text_debug + "</div>");
			}
			else {
				debug_window.document.write("<div>" + this.text_debug + "</div>");
			}
			this.text_debug = " ";
		} 
		catch (e) { // fails if window is closed, try to reopen a new window
			try {
				debug_window = _w.open(this.target_url, this.target_debug, this.wParams, 0);
				debug_window.document.write("<title>DC MPages Debugger</title><div>" + this.text_debug + "</div>");
			} 
			catch (e2) {
				error_handler(e.message, "launch_debug()");
			}
		}
	};
	
	/** 
     * Parses the given JSON string and builds the JSON Object
     * @memberOf UtilJsonXml
     * @method
     * @param  {String}	text	JSON String to be parsed.
     * @return {Object}			JSON Object.
     */
	this.parse_json = (function(){
        var at, // The index of the current character
 		ch, // The current character
 		escapee = {
            '"': '"',
            '\\': '\\',
            '/': '/',
            b: '\b',
            f: '\f',
            n: '\n',
            r: '\r',
            t: '\t'
        }, text, error = function(m){
            // Call error when something is wrong.
			error_handler(m,"parse_json()");  
        }, next = function(c){
        
            // If a c parameter is provided, verify that it matches the current character.            
            if (c && c !== ch) {
                error("Expected '" + c + "' instead of '" + ch + "'");
            }
            // Get the next character. When there are no more characters,
            // return the empty string.            
            ch = text.charAt(at);
            at += 1;
            return ch;
        }, number = function(){
            // Parse a number value.            
            var number, string = '';
            
            if (ch === '-') {
                string = '-';
                next('-');
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
            if (ch === '.') {
                string += '.';
                while (next() && ch >= '0' && ch <= '9') {
                    string += ch;
                }
            }
            if (ch === 'e' || ch === 'E') {
                string += ch;
                next();
                if (ch === '-' || ch === '+') {
                    string += ch;
                    next();
                }
                while (ch >= '0' && ch <= '9') {
                    string += ch;
                    next();
                }
            }
            number = +string;
            if (isNaN(number)) {
                error("Bad number");
            }
            else {
                return number;
            }
        }, string = function(){
            // Parse a string value.            
            var hex, i, string = '', uffff;
            // When parsing for string values, we must look for " and \ characters.            
            if (ch === '"') {
                while (next()) {
                    if (ch === '"') {
                        next();
                        return string;
                    }
                    else 
                        if (ch === '\\') {
                            next();
                            if (ch === 'u') {
                                uffff = 0;
                                for (i = 0; i < 4; i += 1) {
                                    hex = parseInt(next(), 16);
                                    if (!isFinite(hex)) {
                                        break;
                                    }
                                    uffff = uffff * 16 + hex;
                                }
                                string += String.fromCharCode(uffff);
                            }
                            else 
                                if (typeof escapee[ch] === 'string') {
                                    string += escapee[ch];
                                }
                                else {
                                    break;
                                }
                        }
                        else {
                            string += ch;
                        }
                }
            }
            error("Bad string");
        }, white = function(){
            // Skip whitespace.            
            while (ch && ch <= ' ') {
                next();
            }
        }, word = function(){
            // true, false, or null.            
            switch (ch) {
                case 't':
                    next('t');
                    next('r');
                    next('u');
                    next('e');
                    return true;
                case 'f':
                    next('f');
                    next('a');
                    next('l');
                    next('s');
                    next('e');
                    return false;
                case 'n':
                    next('n');
                    next('u');
                    next('l');
                    next('l');
                    return null;
            }
            error("Unexpected '" + ch + "'");
        }, value, // Place holder for the value function.
 			array = function(){
            // Parse an array value.            
            var array = [];
            if (ch === '[') {
                next('[');
                white();
                if (ch === ']') {
                    next(']');
                    return array; // empty array
                }
                while (ch) {
                    array.push(value());
                    white();
                    if (ch === ']') {
                        next(']');
                        return array;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad array");
        }, object = function(){
            // Parse an object value.            
            var key, object = {};
            if (ch === '{') {
                next('{');
                white();
                if (ch === '}') {
                    next('}');
                    return object; // empty object
                }
                while (ch) {
                    key = string();
                    white();
                    next(':');
                    if (Object.hasOwnProperty.call(object, key)) {
                        error('Duplicate key "' + key + '"');
                    }
                    object[key] = value();
                    white();
                    if (ch === '}') {
                        next('}');
                        return object;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad object");
        };
        value = function(){
            // Parse a JSON value. It could be an object, an array, a string, a number,
            // or a word.            
            white();
            switch (ch) {
                case '{':
                    return object();
                case '[':
                    return array();
                case '"':
                    return string();
                case '-':
                    return number();
                default:
                    return ch >= '0' && ch <= '9' ? number() : word();
            }
        };
        // Return the json_parse function. It will have access to all of the above
        // functions and variables.        
        return function(source, reviver){
            var result;
            
            text = source;
            at = 0;
            ch = ' ';
            result = value();
            white();
            if (ch) {
                error("Syntax error");
            }
            // If there is a reviver function, we recursively walk the new structure,
            // passing each name/value pair to the reviver function for possible
            // transformation, starting with a temporary root object that holds the result
            // in an empty key. If there is not a reviver function, we simply return the
            // result.            
            return typeof reviver === 'function' ? (function walk(holder, key){
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            }
                            else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }({
                '': result
            }, '')) : result;
        };
    }());
	
	/** 
     * Parses the given XML string and builds the XML Object
     * @memberOf UtilJsonXml
     * @method
     * @param  {String}	data	XML String to be parsed.
     * @return {Object}		XML Object.
     */
	this.parse_xml = function(data){
		try { //Verify which web browser that is used.
			switch (this.browserName.toLowerCase()) {
				case "firefox":
					this.xml_object = document.implementation.createDocument("", "", null);
					this.xml_object.async = false;
					this.xml_object.load(normalizeString(data));
					break;
				case "msie":
					this.xml_object = createDocument();
					this.xml_object.async = false;
					this.xml_object.loadXML(normalizeString(data));
					break;
			}
			
			return (this.xml_object);
		} 
		catch (e) {
			error_handler(e.message, "parse_xml()");
		}
	};
	
	/** 
     * Formats the text from the  given JSON object and appends the text to the debug text for display.
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	jObj	JSON Object to be formatted for display.
     */
	this.append_json = function(jObj){
		try {
			cur_dt_tm = new Date();
			this.text_debug += "<br><b>*************** JSON Formatted ( " + cur_dt_tm.toUTCString() + " ) ***************</b><br>";
			this.text_debug += format_json(jObj, "");
			if (this.debug_mode_ind === 1) {
				this.launch_debug();
			}	
			return jObj;				
		} 
		catch (e) {
			error_handler(e.message, "append_json()");
		}
	};
	
	/** 
     * Formats the text from the  given XML object and appends the text to the debug text for display.
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	xObj	XML Object to be formatted for display.
     */
	this.append_xml = function(xObj){
		try {
			cur_dt_tm = new Date();
			this.text_debug += "<br><b>*************** XML Formatted ( " + cur_dt_tm.toUTCString() + " ) ***************</b><br>";
			this.text_debug += format_xml(xObj);
			if (this.debug_mode_ind === 1) {
				this.launch_debug();
			}	
			return xObj;	
		} 
		catch (e) {
			error_handler(e.message, "append_xml()");
		}
	};
	
	/** 
     * Appends the given text to the debug text for display.
     * @memberOf UtilJsonXml
     * @method
     * @param  {String}	data	Text to be appended to the debug text for display.
     */
	this.append_text = function(data){
		try {
			this.text_debug += data;
			if (this.debug_mode_ind === 1) {
				this.launch_debug();
			}	
		} 
		catch (e) {
			error_handler(e.message, "append_text()");
		}
	};
	
	/**
	 * 
	 * @param {Object} json_text
	 */
	this.load_json_obj = function(json_text,that){
        try {
			that === undefined ? this : that;            
            return (that.append_json(that.parse_json(json_text)));
        } 
        catch (e) {
            errmsg(e.message, "load_json_obj()")
        }
	};
	
	/**
	 * 
	 * @param {Object} xml_text
	 */
	this.load_xml_obj = function(xml_text,that){
        try {
			that === undefined ? this : that;
            return (that.append_xml(that.parse_xml(xml_text)));
        } 
        catch (e) {
            errmsg(e.message, "load_xml_obj()")
        }
	};
	

	/** 
     * Stringify the given JSON Object for display
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	jObj	JSON Object to be formatted.
     * @return {String}			Formatted JSON String.
     */
	this.stringify_json = function(jObj){
		try {
			var sIndent = ""
			,iCount = 0
			,sIndentStyle = ""
			,sDataType = RealTypeOf(jObj)
			,sHTML
			,j;
			// open object
			if (sDataType === "array") {
				if (jObj.length === 0) {
					return "[]";
				}
				sHTML = "[";
			}
			else {
				if (sDataType === "object" && sDataType !== null) {
					sHTML = "{";
				}
				else { // object is empty
					return "{}";
				}
			}
			
			// loop through items
			iCount = 0;
			for (j in jObj) {
				if (RealTypeOf(jObj[j]) !== "function") {
					if (iCount > 0) {
						sHTML += ",";
					}
					if (sDataType === "array") {
						sHTML += ("" + sIndent + sIndentStyle);
					}
					else {
						sHTML += ("" + sIndent + sIndentStyle + "\"" + j + "\"" + ": ");
					}
					
					// display relevant data type
					switch (RealTypeOf(jObj[j])) {
						case "array":
						case "object":
							sHTML += this.stringify_json(jObj[j]);
							break;
						case "boolean":
						case "number":
							sHTML += jObj[j].toString();
							break;
						case "null":
							sHTML += "null";
							break;
						case "string":
							sHTML += ("\"" + jObj[j] + "\"");
							break;
						case "function":
							break;
						default:
							sHTML += ("TYPEOF: " + typeof(jObj[j]));
					}
					// loop
					iCount = iCount +1;
				}
			}
			
			// close object
			if (sDataType === "array") {
				sHTML += ("" + sIndent + "]");
			}
			else {
				sHTML += ("" + sIndent + "}");
			}
			// return
			return sHTML;
		} 
		catch (e) {
			error_handler(e.message, "stringify_json()");
		}
		
	};
	
	/** 
     * Performs a XmlCclRequest or XMLHttpRequest. Loads request details from spec and calls target method specified in the response details of spec.
     * @memberOf UtilJsonXml
     * @method
     * @param  {Object}	spec	JSON Object containing request and response data.
     * @see dc_mp_js_util_mpage needs to included to utlize XmlCclRequest().
     * @see spec is expected to be in following format:
     * 		{
     * 			request:{
     * 						type: "XMLCCLREQUEST" or "XMLHTTPREQUEST",
     * 						target: " CCL Program Name" or " Webservice Url ",
     * 						parameters: "CCL Program Parameters" or "Webservice Url Parameters"
     * 			},
     * 			response:{
     * 						type: "JSON" or  "XML",
     * 						target: " Name of target JavaScript function to call on response",
     * 						parameters: " Additional Parameters to target JavaScript function "
     * 			}
     * 		}	
     * @see response_spec passed to the spec.response.target will be in the following format:	
     * 		{
     * 			response : "JSON or XML object response from CCL Program or Webservice",
     * 			parameters: " Additional Parameters to target JavaScript function"
     * 		}		
     */
	this.ajax_request = function(spec){
        try {
            var requestAsync,
				load_json_obj_fnc = this.load_json_obj,
				load_xml_obj_fnc = this.load_xml_obj,
				that = this,
				ready_state_msg,
				status_msg,
				response_spec;				
                
                if (spec.request.type === "XMLHTTPREQUEST") {
                    if (window.XMLHttpRequest) {
                        // If IE7, Mozilla, Safari, and so on: Use native object
                        requestAsync = new XMLHttpRequest();
                    }
                    else 
                        if (window.ActiveXObject) {
                            // ...otherwise, use the ActiveX control for IE5.x and IE6
                            requestAsync = new ActiveXObject('MSXML2.XMLHTTP.3.0');
                        }
                }
				else {
					requestAsync = getXMLCclRequest();
				}
			var that = this;
            //requestAsync.requestBinding = "cpmbatch_discern";    //optional
            requestAsync.onreadystatechange = function(){
            	if (requestAsync.readyState === 4 && requestAsync.status === 200) {
                    if (requestAsync.responseText > " ") {
                        try {
							if (spec.response.type.toUpperCase()  === "JSON") {
								if (spec.response.parameters !== undefined && RealTypeOf(spec.response.parameters) !== null) {
									response_spec = {response: load_json_obj_fnc(requestAsync.responseText,that), parameters: spec.response.parameters};
								}
								else{	
									response_spec = {response: load_json_obj_fnc(requestAsync.responseText,that)};
								}
							}
							else{
								if (spec.response.parameters !== undefined && RealTypeOf(spec.response.parameters) !== null) {
									response_spec = {response: load_xml_obj_fnc(requestAsync.responseText,that), parameters: spec.response.parameters};
								}
								else{	
									response_spec = {response: load_xml_obj_fnc(requestAsync.responseText,that)};
								}
							}
							spec.response.target(response_spec);
                        } 
                        catch (e) {
                            error_handler(e.message, "ajax_request.requestAsync.responseText");
                        }
                    }
                }
				else{ // Invalid readyState or status
					switch(requestAsync.readyState){
						case 0: ready_state_msg = "0 - Uninitalized"; break;
						case 1: ready_state_msg = "1 - Loading"; break;
						case 2: ready_state_msg = "2 - Loaded"; break;
						case 3: ready_state_msg = "3 - Interactive"; break;
						case 4: ready_state_msg = "4 - Completed"; break;
					}
					switch(requestAsync.status){
						case 200: status_msg = "200 - Success"; break;
						case 405: status_msg = "405 - Method Not Allowed"; break;
						case 409: status_msg = "409 - Invalid State"; break;
						case 492: status_msg = "492 - Non-Fatal Error"; break;
						case 493: status_msg = "493 - Memory Error"; break;
						case 500: status_msg = "500 - Internal Server Exception"; break;
					}
					ready_state_msg = " requestAsync.readyState -> "+ready_state_msg;
					status_msg = " requestAsync.status -> "+status_msg;
					if(requestAsync.readyState ==  4 )
						error_handler(ready_state_msg,status_msg);					
				}
            };			
			// send request
			if (spec.request.type === "XMLHTTPREQUEST") {
				requestAsync.open("GET", spec.request.target);
				if (spec.request.parameters === "null" || spec.request.parameters === "") {
					requestAsync.send(null);
				}
				else{
                	requestAsync.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                	requestAsync.setRequestHeader("Content-length", spec.request.parameters.length);
                	requestAsync.setRequestHeader("Connection", "close");
					requestAsync.send(spec.request.parameters);
				}
			}			
			else {
				//cpmscript_discern
				if (location.protocol.substr(0, 4) === "http") {
					var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + spec.request.target + "?parameters=" + spec.request.parameters;
					requestAsync.open("GET", url);
					requestAsync.send(null);
				}
				else {
					requestAsync.open("GET", spec.request.target);
					requestAsync.send(spec.request.parameters);
				}
			}	
        } 
        catch (e) {
            error_handler(e.message, "ajax_request()")
        }
	};
		
};
