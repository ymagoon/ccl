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
 
Source file name:       dc_mp_js_util_input_text.js
 
Product:                Discern Content
Product Team:           Discern Content
 
File purpose:           Provides the UtilInputText class with 
methods for Input text box.
 
Special Notes:          <add any special notes here>
 
;~DB~**********************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                    		  *
;**************************************************************************************
;*                                                                            		  *
;*Mod Date     Engineer             		Feature      Comment                      *
;*--- -------- -------------------- 		------------ -----------------------------*
;*000 		   RB018070					    ######       Initial Release              *
;*001 08/17/10 JJ7138                       ######       If user types "ENTER" key    *
;*                                                       without selecting from list, *
;*                                                       set list to 1st item.        *
;*002 09/02/10 RB018070                     268262       Resolve lost focus issues.   *
;*003 12/02/10 RB018070                     278888       Resolve sizing/selection.    *
;~DE~**********************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/

/**
* Create a new instance of UtilInputText.
* @classDescription		This class creates a new UtilInputText with to parse/debug JSON and XML.
* @return {Object}	Returns a new UtilInputText object.
* @constructor
*/
var UtilInputText = function ()
{

    /* ******* Private Variables & Methods *** */

    var current_sel_index = -1, // Main function to retrieve mouse x-y pos.s
    that = this,
    fnc_blur = function (e)
    {
        e = e || window.event;
        if (document.activeElement !== that.dom_options_list)
        {
            hide_popup(e, this, that);
        }
    }, fnc_focus = function (e)
    {
        e = e || window.event;

        if (that.dom_input.value > " ")
        {
            search_values(e, that.dom_input, that);
        }
        else
        {
            fnc_blur(e);
        }
    }
    selected_Index = -1, getMouseXY = function (e)
    {
        var tempX, tempY;
        if (event.clientX && event.clientY)
        { // grab the x-y pos.s if browser is IE
            tempX = event.clientX + document.body.scrollLeft
            tempY = event.clientY + document.body.scrollTop
        }
        else
        { // grab the x-y pos.s if browser is NS
            tempX = e.pageX
            tempY = e.pageY
        }
        // catch possible negative values in NS4
        if (tempX < 0)
        {
            tempX = 0
        }
        if (tempY < 0)
        {
            tempY = 0
        }

        return {
            x: tempX,
            y: tempY
        }
    },
purge = function (d)
{
    var a = d.attributes, i, l, n;
    if (a)
    {
        l = a.length;
        for (i = 0; i < l; i += 1)
        {
            n = a[i].name;
            if (typeof d[n] === 'function')
            {
                d[n] = null;
            }
        }
    }
    a = d.childNodes;
    if (a)
    {
        l = a.length;
        for (i = 0; i < l; i += 1)
        {
            purge(d.childNodes[i]);
        }
    }
},
    /** 
    * Validates a text field for alphabetic input
    * @memberOf UtilInputText
    * @method
    * @param  {Event} Event triggering the check.
    * @return {Boolean} Result of alphabet check.
    */
    validate_alpha = function (Obj, e)
    {
        var key;
        var keychar;
        key = get_keycode(e);
        keychar = String.fromCharCode(key);
        var isDecimal = /(\.)+/;
        if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 32) || (key === 27))
        { // control keys
            return true;
        }
        else
            if ((("abcdefghijklmnopqrstuvwxyz.*,").indexOf(keychar) > -1) || (("ABCDEFGHIJKLMNOPQRSTUVWXYZ").indexOf(keychar) > -1))
            { // numbers & decimal point
                return true;
            }
            else
            {
                return false;
            }
    },    /** 
     * Validates a text field for numeric input
     * @memberOf UtilInputText
     * @method
     * @param  {Event} Event triggering the check.
     * @return {Boolean} Result of numeric check.
     */
    validate_numeric = function (Obj, e)
    {
        var key, keychar;
        key = get_keycode(e);
        keychar = String.fromCharCode(key);
        var isDecimal = /(\.)+/;
        if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27))
        { // control keys
            return true;
        }
        else
            if ((("0123456789").indexOf(keychar) > -1) || (keychar === "." && Obj.value.search(isDecimal) === -1))
            { // numbers & decimal point
                return true;
            }
            else
            {
                return false;
            }
    }, daysInMonth = function (iMonth, iYear)
    {
        return 32 - new Date(iYear, iMonth, 32).getDate();
    }, validate_date_x = function (Obj, e)
    {

        var key_code = get_keycode(e), d = new Date();
        // evaluate any hot-key
        switch (key_code)
        {
            case 84: //t -> today
                Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(d.getDate()).padL(2, "0") + "/" + d.getFullYear();
                break;
            case 89: //y -> beginning of year
                Obj.value = String(1).padL(2, "0") + "/" + String(1).padL(2, "0") + "/" + d.getFullYear();
                break;
            case 82: //r -> end of year
                Obj.value = String(12).padL(2, "0") + "/" + String(31).padL(2, "0") + "/" + d.getFullYear();
                break;
            case 77: //m -> beginning of month
                Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(1).padL(2, "0") + "/" + d.getFullYear();
                break;
            case 72: //h -> end of month
                Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(daysInMonth(d.getMonth(), d.getFullYear())).padL(2, "0") + "/" + d.getFullYear();
                break;
            case 87: //w -> beginning of week
                Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(d.getDate() - d.getDay()).padL(2, "0") + "/" + d.getFullYear();
                break;
            case 75: //k -> end of week
                Obj.value = String(d.getMonth() + 1).padL(2, "0") + "/" + String(d.getDate() + (6 - d.getDay())).padL(2, "0") + "/" + d.getFullYear();
                break;
        }

        if (!window.event.shiftKey && !window.event.ctrlKey && !window.event.altKey)
        {
            if ((key_code > 47 && key_code < 58) || (key_code > 95 && key_code < 106))
            {
                if (key_code > 95)
                {
                    key_code -= (95 - 47);
                }

                var idx = Obj.value.search(/([*\/]*)[*]([*\/]*)$/);

                if (idx == 0 &&
                (String.fromCharCode(key_code) == '0' ||
                String.fromCharCode(key_code) == '1'))
                {
                    Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                }
                else
                    if (idx == 3 &&
                    (String.fromCharCode(key_code) == '0' ||
                    String.fromCharCode(key_code) == '1' ||
                    String.fromCharCode(key_code) == '2' ||
                    String.fromCharCode(key_code) == '3'))
                    {
                        Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                    }
                    else
                        if (idx == 4)
                        {
                            if (Obj.value.substring(3, 4) == '3')
                            {
                                if (String.fromCharCode(key_code) == '0' || String.fromCharCode(key_code) == '1')
                                {
                                    Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                                }
                            }
                            else
                            {
                                Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                            }
                        }
                        else
                            if (idx != 0 && idx != 3)
                            {
                                Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                            }

            }

            if (key_code == 8)
            {
                if (!Obj.value.match(/^[*0-9]{2}\/[*0-9]{2}\/[*0-9]{4}$/))
                {
                    Obj.value = "**/**/****";
                }

                Obj.value = Obj.value.replace(/([*\/]*)[0-9]([*\/]*)$/, function ($0, $1, $2)
                {
                    var idx = Obj.value.search(/([*\/]*)[0-9]([*\/]*)$/);
                    if (idx >= 5)
                    {
                        return $1 + "*" + $2;
                    }
                    else
                        if (idx >= 2)
                        {
                            return $1 + "*" + $2;
                        }
                        else
                        {
                            return $1 + "*" + $2;
                        }
                });
                window.event.returnValue = 0;
            }

            if (key_code == 46)
            {
                Obj.value = "**/**/****";
            }
        }

        if (key_code != 9)
        {
            event.returnValue = false;
            return false;
        }
        return true;
    }, validate_time_x = function (Obj, e)
    {
        var str1, str2, key_code = get_keycode(e), d = new Date();

        switch (key_code)
        {
            case 78: // n -> current time
                Obj.value = String(d.getHours()).padL(2, "0") + ":" + String(d.getMinutes()).padL(2, "0");
                break;
        }
        if (!window.event.shiftKey && !window.event.ctrlKey && !window.event.altKey)
        {
            if ((key_code > 47 && key_code < 58) || (key_code > 95 && key_code < 106))
            {
                if (key_code > 95)
                {
                    key_code -= (95 - 47);
                }

                var idx = Obj.value.search(/([*:]*)$/);

                if (idx == 0 &&
                (String.fromCharCode(key_code) == '0' ||
                String.fromCharCode(key_code) == '1' ||
                String.fromCharCode(key_code) == '2'))
                {
                    Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                }

                else
                    if (idx == 3 &&
                    (String.fromCharCode(key_code) == '0' ||
                    String.fromCharCode(key_code) == '1' ||
                    String.fromCharCode(key_code) == '2' ||
                    String.fromCharCode(key_code) == '3'))
                    {
                        Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                    }
                    else
                        if (idx != 0 && idx != 3)
                        {
                            Obj.value = Obj.value.replace(/[*]/, String.fromCharCode(key_code));
                        }

            }

            if (key_code == 8)
            {
                if (!Obj.value.match(/^[*0-9]{2}:[*0-9]{2}$/))
                {
                    Obj.value = "**:**";
                }

                Obj.value = Obj.value.replace(/([*:]*)[0-9]([*:]*)$/, function ($0, $1, $2)
                {
                    var idx = Obj.value.search(/([*:]*)[0-9]([*:]*)$/);
                    if (idx >= 5)
                    {
                        return $1 + "*" + $2;
                    }
                    else
                        if (idx >= 2)
                        {
                            return $1 + "*" + $2;
                        }
                        else
                        {
                            return $1 + "*" + $2;
                        }
                });
                window.event.returnValue = 0;
            }

            if (key_code == 46)
            {
                Obj.value = "**/**/****";
            }
        }

        if (key_code != 9)
        {
            event.returnValue = false;
            return false;
        }
        return true;
    },    /** 
     * Parses up the DOM tree to calculate the left and top position of given DOM element.
     * @memberOf UtilInputText
     * @method
     * @param  {Object} DOM Object with to calculate position of.
     * @return {Object} Array containing the left and top position of given DOM element.
     * */
    findPos = function (oElement)
    {
        adjustPage();
        var ws = window_size(), scrollOffset;
        function getNextAncestor(oElement)
        {
            var actualStyle;
            if (window.getComputedStyle)
            {
                actualStyle = getComputedStyle(oElement, null).position;
            }
            else
                if (oElement.currentStyle)
                {
                    actualStyle = oElement.currentStyle.position;
                }
                else
                {
                    //fallback for browsers with low support - only reliable for inline styles
                    actualStyle = oElement.style.position;
                }
            if (actualStyle == 'absolute' || actualStyle == 'fixed')
            {
                //the offsetParent of a fixed position element is null so it will stop
                return oElement.offsetParent;
            }
            return oElement.parentNode;
        }

        if (typeof (oElement.offsetParent) != 'undefined')
        {
            var originalElement = oElement;
            for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
            {
                posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
            if (!originalElement.parentNode || !originalElement.style || typeof (originalElement.scrollTop) == 'undefined')
            {
                //older browsers cannot check element scrolling
                return [posX, posY];
            }
            oElement = getNextAncestor(originalElement);
            while (oElement && oElement != document.body && oElement != document.documentElement)
            {
                posX -= oElement.scrollLeft;
                posY -= oElement.scrollTop;
                oElement = getNextAncestor(oElement);
            }
            if (document.body.scrollTop > 0)
            {
                scrollOffset = document.body.scrollTop
            }
            else
            {
                scrollOffset = document.documentElement.scrollTop;
            }
            return [posX, posY, ws.width - 5, ws.height - 5, posX, posY - scrollOffset];
        }
        else
        {
            return [oElement.x, oElement.y, ws.width - 5, ws.height - 5, oElement.x, oElement.y - document.body.scrollTop];
        }
    },
	window_size = function ()
	{
	    var w = 0;
	    var h = 0;

	    //IE
	    if (!window.innerWidth)
	    {
	        //strict mode
	        if (!(document.documentElement.clientWidth == 0))
	        {
	            w = document.documentElement.clientWidth;
	            h = document.documentElement.clientHeight;
	        }
	        //quirks mode
	        else
	        {
	            w = document.body.clientWidth;
	            h = document.body.clientHeight;
	        }
	    }
	    //w3c
	    else
	    {
	        w = window.innerWidth;
	        h = window.innerHeight;
	    }
	    return {
	        width: w,
	        height: h
	    };
	},
    autoEllipseText = function (text, width, classname)
    {
        var dom_auto_el = document.createElement("span");
        dom_auto_el.whiteSpace = "nowrap";
        dom_auto_el.className = classname;
        dom_auto_el.style.visibility = "hidden";
        dom_auto_el.innerHTML = text;
        dom_auto_el = document.body.appendChild(dom_auto_el);

        if (dom_auto_el.offsetWidth > (width - 20))
        {
            var i = 1;
            dom_auto_el.innerHTML = '';
            while (dom_auto_el.offsetWidth < (width - 20) && i < text.length)
            {
                dom_auto_el.innerHTML = text.substr(0, i) + '...';
                i++;
            }
            returnText = dom_auto_el.innerHTML;
            document.body.removeChild(dom_auto_el);
            return returnText;
        }
        document.body.removeChild(dom_auto_el);
        return text;
    },    /** 
     * Performs a linear search on the assigned JSON object list and calls functions to display the result list
     * @memberOf UtilInputText
     * @method
     * @param  {Event} Event triggering the search
     * @param  {Object} DOM Object reference to the row in the search table
     * @param  {String} JSON object name to search for in the list
     * @return {Boolean} Pass/Fail of search
     */
    search_values = function (e, Obj, that)
    {
        if (Obj.value.split(" ").join("") === "")
        {
            return null;
        }
        var cur_text = Obj.value, jsonIndex, cur_key = get_keycode(e), availHeight, entry = Obj.value, choices = that.maxResults, partialSearch = that.partialSearch, partialChars = 2, ignoreCase = that.ignoreCase, fullSearch = (!partialSearch), ret = [], // Beginning matches
 partial = [], // Inside matches
 value, count = 0;
        if (cur_key === 13 || cur_key === 38 || cur_key === 40)
        {
            if (that.dom_options_list && that.dom_options_list.hasChildNodes() && that.dom_options_list.style.visibility === "visible")
            {
                var popup_body;
                if (that.dom_options_list.childNodes[0].tagName.toUpperCase() === "TBODY")
                {
                    popup_body = that.dom_options_list.childNodes[0];
                }
                else
                    if (that.dom_options_list.childNodes[0].hasChildNodes() && that.dom_options_list.childNodes[0].childNodes[0].tagName.toUpperCase() === "TBODY")
                    {
                        popup_body = that.dom_options_list.childNodes[0].childNodes[0];
                    }
                if (current_sel_index > popup_body.childNodes.length - 1)
                {
                    current_sel_index = -1;
                }
                if (cur_key === 13 && current_sel_index === -1)
                {
                    current_sel_index = 0;
                    that.dom_options_list.scrollTop = 0;
                }
                if (cur_key === 13)
                { // Enter
                    Obj.value = popup_body.childNodes[current_sel_index].id.split("|")[1];
                    jsonIndex = popup_body.childNodes[current_sel_index].id.split("|")[2];
                    Obj.name = popup_body.childNodes[current_sel_index].title;
                    popup_body.childNodes[current_sel_index].className = "ss_list_items";
                    that.dom_options_list.style.visibility = "hidden";
                    that.dom_options_list_iframe.style.visibility = "hidden";
                    current_sel_index = -1;
                    if (that.onSelectFnc != null && that.onSelectFnc != undefined && that.options_list[jsonIndex])
                    {
                        that.onSelectFnc(that.options_list[jsonIndex]);
                    }
                }
                else
                    if (cur_key === 40)
                    { // Down
                        if (current_sel_index >= 0)
                        {
                            popup_body.childNodes[current_sel_index].className = "ss_list_items";
                        }
                        if (current_sel_index === popup_body.childNodes.length - 1)
                        {
                            current_sel_index = 0;
                            that.dom_options_list.scrollTop = 0;
                        }
                        else
                        {
                            current_sel_index++;
                        }
                        if ((popup_body.childNodes[current_sel_index].offsetTop + popup_body.childNodes[current_sel_index].offsetHeight) > that.dom_options_list.offsetHeight)
                        {
                            that.dom_options_list.scrollTop = (popup_body.childNodes[current_sel_index].offsetTop + popup_body.childNodes[current_sel_index].offsetHeight);
                        }
                        popup_body.childNodes[current_sel_index].className = "ss_list_items_tr_hover";
                    }
                    else
                        if (cur_key === 38)
                        { // Up
                            if (current_sel_index >= 0)
                            {
                                popup_body.childNodes[current_sel_index].className = "ss_list_items";
                            }
                            if (current_sel_index <= 0)
                            {
                                current_sel_index = popup_body.childNodes.length - 1;
                                that.dom_options_list.scrollTop = (popup_body.childNodes[current_sel_index].offsetTop + popup_body.childNodes[current_sel_index].offsetHeight);

                            }
                            else
                            {
                                current_sel_index--;
                            }
                            if ((popup_body.childNodes[current_sel_index].offsetTop) < that.dom_options_list.offsetHeight)
                            {
                                that.dom_options_list.scrollTop = popup_body.childNodes[current_sel_index].offsetTop;
                            }
                            popup_body.childNodes[current_sel_index].className = "ss_list_items_tr_hover";
                        }
                //  }
            }
        }
        else
        {

            current_sel_index = -1;
            for (var i = 0; i < that.options_list.length && ret.length < choices; i++)
            {

                var elem = that.options_list[i],
                	elem_name = elem[that.search_field],
					elem_value = elem[that.value_field],
                	foundPos = ignoreCase ? elem_name.toLowerCase().indexOf(entry.toLowerCase()) : elem_name.indexOf(entry);

                while (foundPos !== -1)
                {

                    if (foundPos === 0)
                    {
                        value = "<strong>" + elem_name.substr(0, entry.length) + "</strong>" + elem_name.substr(entry.length);
                        ret.push("<tr class='ss_list_items_tr' id= 'ss_list_opt_|" + elem_name + "|" + i + "'   onmouseover='this.className = \"ss_list_items_tr_hover\";' onmouseout= 'this.className = \"ss_list_items_tr\";'><td  id= 'ss_list_opt_|" + elem_name + "|" + i + "'  >" + "<span  id= 'ss_list_opt_|" + elem_name + "|" + i + "'  >" + value + "</span>" + "</td></tr>");
                        count++;
                        break;
                    }
                    else
                        if (entry.length >= partialChars && partialSearch && foundPos !== -1)
                        {
                            if (fullSearch || /\s/.test(elem_name.substr(foundPos - 1, 1)))
                            {
                                value = elem_name.substr(0, foundPos) + "<strong>" +
                                elem_name.substr(foundPos, entry.length) +
                                "</strong>" +
                                elem_name.substr(foundPos + entry.length);
                                partial.push("<tr  class='ss_list_items_tr' id= 'ss_list_opt_|" + elem_name + "|" + i + "'   onmouseover='this.className = \"ss_list_items_tr_hover\";' onmouseout= 'this.className = \"ss_list_items_tr\";'><td  id= 'ss_list_opt_|" + elem_name + "|" + i + "'  >" + "<span id= 'ss_list_opt_|" + elem_name + "|" + i + "'  >" + value + "</span>" + "</td></tr>");
                                count++;
                                break;
                            }
                        }
                    foundPos = ignoreCase ? elem_name.toLowerCase().indexOf(entry.toLowerCase(), foundPos + 1) : elem_name.indexOf(entry, foundPos + 1);
                }
            }
            if (partial.length)
            {
                ret = ret.concat(partial.slice(0, choices - ret.length));
            }

            if (that.dom_options_list === null || that.dom_options_list === undefined)
            {
                that.dom_options_list = document.createElement("div");
                that.dom_options_list_iframe = document.createElement("iframe");
                that.dom_options_list.className = "ss_popup";
                that.dom_options_list_iframe.className = "ss_popup";
                that.dom_options_list.style.zIndex = 999999;
                that.dom_options_list_iframe.style.zIndex = 999998;
                that.dom_options_list.innerHTML = "<table>" + ret.join('') + "</table>";
                that.dom_options_list.style.width = Obj.offsetWidth + "px";
                that.dom_options_list_iframe.style.width = Obj.offsetWidth + "px";
                that.dom_options_list.onclick = function (e)
                {
                    var targ, targSplit, jsonIndex;
                    e = e || window.event;
                    if (e.target)
                    {
                        targ = e.target;
                    }
                    else
                    {
                        if (e.srcElement)
                            targ = e.srcElement;
                    }
                    targSplit = targ.id.split("|");
                    if (targSplit[0] === "ss_list_opt_") //fill textfield with selected value
                    {
                        try
                        {
                            current_sel_index = -1;
                            jsonIndex = targSplit[2];
                            Obj.name = targ.title;
                            Obj.value = autoEllipseText(targSplit[1], Obj.parentNode.offsetWidth - Obj.parentNode.childNodes[1].offsetWidth, Obj.className);
                            if (that.onSelectFnc != null && that.onSelectFnc != undefined && that.options_list[jsonIndex])
                            {
                                that.onSelectFnc(that.options_list[jsonIndex]);
                            }
                        }
                        catch (err)
                        {
                            alert("Invalid   option Id");
                        }
                    }
                    that.dom_options_list.style.visibility = "hidden";
                    that.dom_options_list_iframe.style.visibility = "hidden";
                };
                that.dom_options_list = document.body.appendChild(that.dom_options_list);
                that.dom_options_list_iframe = document.body.appendChild(that.dom_options_list_iframe);
            }
            else
            {
                that.dom_options_list.innerHTML = "";
                that.dom_options_list.style.height = 'auto';
                that.dom_options_list.style.width = Obj.offsetWidth + "px";
                that.dom_options_list.innerHTML = "<table class='ss_list_items'>" + ret.join('') + "</table>";
                that.dom_options_list_iframe.style.height = that.dom_options_list.offsetHeight + 'px';
                that.dom_options_list_iframe.style.width = that.dom_options_list.offsetWidth + 'px';
            }
            var cur_pos = findPos(Obj);
            availHeight = (cur_pos[3] - (cur_pos[5] + Obj.offsetHeight));
            topInd = 0;
            if ((cur_pos[3] - cur_pos[5]) < cur_pos[5] && that.dom_options_list.offsetHeight > availHeight)
            {
                availHeight = ((cur_pos[5]));
                topInd = 1;
            }
            if (that.dom_options_list.offsetHeight > availHeight)
            {
                that.dom_options_list.style.height = availHeight + "px";
                that.dom_options_list_iframe.style.height = availHeight + "px";
            }

            that.dom_options_list.style.left = (cur_pos[0]) + "px";
            that.dom_options_list_iframe.style.left = (cur_pos[0]) + "px";
            that.dom_options_list.scrollTop = that.selectedMapIndex * (that.dom_options_list.scrollHeight / that.options_list.length);
            if (topInd == 1)
            {
                that.dom_options_list.style.top = (cur_pos[1] - that.dom_options_list.offsetHeight) + "px";
                that.dom_options_list_iframe.style.top = (cur_pos[1] - that.dom_options_list.offsetHeight) + "px";
            }
            else
            {
                that.dom_options_list.style.top = (cur_pos[1] + Obj.offsetHeight) + "px";
                that.dom_options_list_iframe.style.top = (cur_pos[1] + Obj.offsetHeight) + "px";
            }
            that.dom_options_list.onclick = function (e)
            {
                var targ, targSplit, jsonIndex;
                e = e || window.event;
                if (e.target)
                {
                    targ = e.target;
                }
                else
                {
                    if (e.srcElement)
                        targ = e.srcElement;
                }
                targSplit = targ.id.split("|");
                if (targSplit[0] === "ss_list_opt_") //fill textfield with selected value
                {
                    try
                    {
                        current_sel_index = -1;
                        jsonIndex = targSplit[2];
                        Obj.name = targ.title;
                        Obj.value = autoEllipseText(targSplit[1], Obj.parentNode.offsetWidth - Obj.parentNode.childNodes[1].offsetWidth, Obj.className);
                        if (that.onSelectFnc != null && that.onSelectFnc != undefined && that.options_list[jsonIndex])
                        {
                            that.onSelectFnc(that.options_list[jsonIndex]);
                        }
                    }
                    catch (err)
                    {
                        alert("Invalid   option Id");
                    }
                }
                that.dom_options_list.style.visibility = "hidden";
                that.dom_options_list_iframe.style.visibility = "hidden";
            };
            that.dom_options_list.onblur = function (e)
            {
                e = e || window.event;
                var el = e.srcElement;
                if (el !== null && typeof el === 'object')
                {
                    var el_pos = findPos(el), m_pos = getMouseXY(e);
                    if ((m_pos.x >= el_pos[0] && m_pos.x <= (el_pos[0] + el.offsetWidth)) &&
	                (m_pos.y >= el_pos[1] && m_pos.y <= (el_pos[1] + el.offsetHeight)))
                    {
                        return false;
                    }
                    else
                    {
                        hide_popup(e, this, that);
                    }
                }
                else
                {
                    hide_popup(e, this, that);
                }
            };
            //	that.dom_options_list.onfocusout = function(e){
            //       e = e || window.event;
            //		hide_popup(e, this, that);
            //   };

            if (entry > "" && count > 0)
            {
                that.dom_options_list.style.visibility = "visible";
                that.dom_options_list_iframe.style.visibility = "visible";
                //that.dom_options_list.focus();
            }
            else
            {
                that.dom_options_list.style.visibility = "hidden";
                that.dom_options_list_iframe.style.visibility = "hidden";
            }
        }
    },    /** 
     * Performs a linear search on the assigned JSON object list and calls functions to display the result list
     * @memberOf UtilInputText
     * @method
     * @param  {Event} Event triggering the search
     * @param  {Object} DOM Object reference to the row in the search table
     * @param  {String} JSON object name to search for in the list
     * @return {Boolean} Pass/Fail of search
     */
    toggle_dropdown_list = function (e, pObj, Obj, lObj, that)
    {
        var cur_text = Obj.innerHTML, cur_key = 0, entry = Obj.innerHTML, availHeight, topInd, scrollTop,
 		disp_list = [], cur_value, category_count = -1, cat_hash = new HashMap(), temp_arr, temp_arr2, temp_obj;
        if (that.dom_options_list == null || that.dom_options_list.style.visibility != "visible")
        {
            for (var i = 0; i < that.options_list.length; i++)
            {
                var elem = that.options_list[i], elem_name = elem[that.search_field], elem_icon = that.icon_field ? elem[that.icon_field] : "";
                elem_category = that.category_field ? elem[that.category_field] : "";
                if (elem_category > "")
                { // show categories
                    if (!cat_hash.contain(elem_category))
                    {
                        category_count += 1;
                        temp_arr = [];
                        cat_hash.put(elem_category, temp_arr);
                        temp_arr = cat_hash.get(elem_category);
                        temp_arr.push("<tr  class='ss_list_items_tr_category' id= 'ss_list_opt_category|" + elem_category + "' ><td  id= 'ss_list_opt_category|" + elem_category + "'>" + "<span id= 'ss_list_opt_category|" + elem_category + "'>" + elem_category + "</span>" + "</td></tr>");
                        cat_hash.put(elem_category, temp_arr);
                    }
                    temp_arr = cat_hash.get(elem_category);
                    cur_value = "ss_list_opt_|" + elem_name + "|" + category_count + "|" + (i - category_count) + "|" + (i)
                    if ((that.selectedMapIndex == (i - category_count) && that.selectedCategory == category_count) || (that.default_sel > "" && that.default_sel === elem_name))
                    {

                        temp_arr.push("<tr  class='ss_list_items_tr_selected' id = '" + cur_value + "'><td  id = '" + cur_value + "'>" + "<span id = '" + cur_value + "'>" + (elem_icon > "" ? "<span class='ss_list_items_tr_icon' id = '" + cur_value + "'>" + elem_icon + "&nbsp;</span>" : "") + elem_name + "</span>" + "</td></tr>");
                        that.selectedMapIndex = (i - category_count);
                        that.selectedCategory = category_count;
                        that.selectedIndex = i;
                        that.default_sel = "";
                        Obj.innerHTML = autoEllipseText(elem_name, Obj.parentNode.offsetWidth - Obj.parentNode.childNodes[1].offsetWidth, Obj.className);
                    }
                    else
                    {
                        temp_arr.push("<tr  class='ss_list_items_tr' id = '" + cur_value + "' onmouseover='this.className = \"ss_list_items_tr_hover\";' onmouseout= 'this.className = \"ss_list_items_tr\";'><td  id = '" + cur_value + "'>" + "<span id = '" + cur_value + "'>" + (elem_icon > "" ? "<span class='ss_list_items_tr_icon' id = '" + cur_value + "'>" + elem_icon + "&nbsp;</span>" : "") + elem_name + "</span>" + "</td></tr>");
                    }
                    cat_hash.put(elem_category, temp_arr);
                }
                else
                { // plain list
                    cur_value = "ss_list_opt_|" + elem_name + "||" + (i) + "|" + (i);

                    if ((that.selectedMapIndex == i) || (that.default_sel > "" && that.default_sel === elem_name))
                    {

                        disp_list.push("<tr  class='ss_list_items_tr_selected' id = '" + cur_value + "'><td  id = '" + cur_value + "'>" + "<span id = '" + cur_value + "'>" + (elem_icon > "" ? "<span class='ss_list_items_tr_icon' id = '" + cur_value + "'>" + elem_icon + "&nbsp;</span>" : "") + elem_name + "</span>" + "</td></tr>");
                        that.selectedMapIndex = i;
                        that.selectedIndex = i;
                        that.default_sel = "";
                    }
                    else
                    {
                        disp_list.push("<tr  class='ss_list_items_tr' id = '" + cur_value + "' onmouseover='this.className = \"ss_list_items_tr_hover\";' onmouseout= 'this.className = \"ss_list_items_tr\";'><td  id = '" + cur_value + "'>" + "<span id = '" + cur_value + "'>" + (elem_icon > "" ? "<span class='ss_list_items_tr_icon' id = '" + cur_value + "'>" + elem_icon + "&nbsp;</span>" : "") + elem_name + "</span>" + "</td></tr>");
                    }
                }
            }
            temp_arr = cat_hash.getMapCollection();
            for (var j = 0; j < temp_arr.length; j++)
            {
                temp_obj = temp_arr[j];
                disp_list.push(temp_obj.getValue().join(''));
            }
            if (that.dom_options_list === null || that.dom_options_list === undefined)
            {
                that.dom_options_list = document.createElement("div");
                that.dom_options_list_iframe = document.createElement("iframe");
                that.dom_options_list.className = "ss_popup";
                that.dom_options_list_iframe.className = "ss_popup";
                that.dom_options_list.style.zIndex = 999999;
                that.dom_options_list_iframe.style.zIndex = 999998;
                that.dom_options_list.style.width = pObj.offsetWidth + "px";
                that.dom_options_list.style.height = 'auto';
                purge(that.dom_options_list);
                that.dom_options_list.innerHTML = "<table class='ss_list_items'>" + disp_list.join('') + "</table>";
                that.dom_options_list_iframe.style.width = that.dom_options_list.offsetWidth + "px";
                that.dom_options_list_iframe.style.height = that.dom_options_list.offsetHeight + "px";
                that.dom_options_list = document.body.appendChild(that.dom_options_list);
                that.dom_options_list_iframe = document.body.appendChild(that.dom_options_list_iframe);
            }
            else
            {
                purge(that.dom_options_list);
                that.dom_options_list.style.height = 'auto';
                that.dom_options_list.style.width = pObj.offsetWidth + "px";
                that.dom_options_list.innerHTML = "<table class='ss_list_items'>" + disp_list.join('') + "</table>";
                that.dom_options_list_iframe.style.width = that.dom_options_list.offsetWidth + "px";
                that.dom_options_list_iframe.style.height = that.dom_options_list.offsetHeight + "px";
            }
            var cur_pos = findPos(pObj);
            availHeight = (cur_pos[3] - (cur_pos[1] + pObj.offsetHeight));
            topInd = 0;
            if ((cur_pos[3] - cur_pos[1]) < cur_pos[1] && that.dom_options_list.offsetHeight > availHeight)
            {
                availHeight = ((cur_pos[1]));
                topInd = 1;
            }
            if (that.dom_options_list.offsetHeight > availHeight)
            {
                that.dom_options_list.style.height = availHeight + "px";
                that.dom_options_list_iframe.style.height = that.dom_options_list.offsetHeight + "px";
            }

            that.dom_options_list.style.left = (cur_pos[0]) + "px";
            that.dom_options_list_iframe.style.left = (cur_pos[0]) + "px";
            scrollTop = parseInt(that.selectedMapIndex * (that.dom_options_list.scrollHeight / that.options_list.length), 10);
            if (topInd == 1)
            {
                that.dom_options_list.style.top = (cur_pos[1] - that.dom_options_list.offsetHeight) + "px";
                that.dom_options_list_iframe.style.top = (cur_pos[1] - that.dom_options_list.offsetHeight) + "px";
            }
            else
            {
                that.dom_options_list.style.top = (cur_pos[1] + pObj.offsetHeight) + "px";
                that.dom_options_list_iframe.style.top = (cur_pos[1] + pObj.offsetHeight) + "px";
            }
            that.dom_options_list.onclick = function (e)
            {
                var targ, e = (e || window.event), cur_sel_index = that.selectedMapIndex, targ_id_split;
                if (e.target)
                {
                    targ = e.target;
                }
                else
                {
                    if (e.srcElement)
                        targ = e.srcElement;
                }
                if (targ.id && targ.id.split("|")[0] === "ss_list_opt_") //fill textfield with selected value
                {
                    targ_id_split = targ.id.split("|");
                    try
                    {
                        that.selectedCategory = targ_id_split[2];
                        that.selectedMapIndex = targ_id_split[3];
                        that.selectedIndex = targ_id_split[4];
                        Obj.innerHTML = autoEllipseText(targ_id_split[1], Obj.parentNode.offsetWidth - Obj.parentNode.childNodes[1].offsetWidth, Obj.className);
                        if (cur_sel_index != that.selectedMapIndex)
                        {
                            if (that.onchange !== null &&
                            that.onchange != undefined &&
                            typeof that.onchange == 'function')
                                that.onchange();
                        }
                    }
                    catch (err)
                    {
                        alert("Invalid   option Id");
                    }
                }
                that.dom_options_list.style.visibility = "hidden";
                that.dom_options_list_iframe.style.visibility = "hidden";
            };
            that.dom_options_list.onblur = function (e)
            {
                e = e || window.event;
                var el = e.srcElement;
                if (el !== null && typeof el === 'object')
                {
                    var el_pos = findPos(el), m_pos = getMouseXY(e);
                    if ((m_pos.x >= el_pos[0] && m_pos.x <= (el_pos[0] + el.offsetWidth)) &&
	                (m_pos.y >= el_pos[1] && m_pos.y <= (el_pos[1] + el.offsetHeight)))
                    {
                        return false;
                    }
                    else
                    {
                        hide_popup(e, this, that);
                    }
                }
                else
                {
                    hide_popup(e, this, that);
                }
            };
            //	that.dom_options_list.onfocusout = function(e){
            //       e = e || window.event;
            //		hide_popup(e, this, that);
            //   };
            that.dom_options_list.style.visibility = "visible";
            that.dom_options_list_iframe.style.visibility = "visible";
            that.dom_options_list.scrollTop = scrollTop;
            that.dom_options_list.focus();
        }
        else
        {
            that.dom_options_list.style.visibility = "hidden";
            that.dom_options_list_iframe.style.visibility = "hidden";
        }
    }, sortbyname = function (name, a, b)
    {
        return (((a[name].toLowerCase() < b[name].toLowerCase()) ? -1 : ((a[name].toLowerCase() > b[name].toLowerCase()) ? 1 : 0)));
    },    /** 
     * Hides the search list popup for empty search results or when a result is selected
     * @memberOf UtilInputText
     * @method
     * @param  {Object} DOM Object reference to the input field
     * @param  {Event} Event triggering the search
     */
    hide_popup = function (e, Obj, that)
    {
        var targ = document.activeElement, targSplit, jsonIndex;
        try
        {
            if (targ && targ.id.split("|")[0] === "ss_list_opt_") //fill textfield with selected value
            {
                targSplit = targ.id.split("|");
                current_sel_index = -1;
                jsonIndex = targSplit[2];
                Obj.name = targ.title;
                Obj.value = targSplit[1];
                if (that.onSelectFnc != null && that.onSelectFnc != undefined && that.options_list[jsonIndex])
                {
                    that.onSelectFnc(that.options_list[jsonIndex]);
                }
            }
        }
        catch (err)
        {
            alert("Invalid  option Id");
        }

        if (that.dom_options_list !== null)
        {
            that.dom_options_list.style.visibility = "hidden";
            that.dom_options_list_iframe.style.visibility = "hidden";
        }

    },    /** 
     * Returns the chractercode for triggering event
     * @memberOf UtilInputText
     * @method
     * @param  {Event} Event triggering with the key
     */
    get_keycode = function (e)
    {
        var characterCode;
        try
        {
            if (e && e.which) // NN4 specific code
            {
                e = e;
                characterCode = e.which;
            }
            else
            {
                characterCode = e.keyCode; // IE specific code
            }
        }
        catch (error)
        {
            characterCode = 0;
        }
        return characterCode;
    };

    /***** Public Methods ****/
    //return{
    this.selectedIndex = -1;
    this.selectedMapIndex = -1;
    this.selectedCategory = -1;
    this.categoryCount = -1;
    this.options_list = null;
    this.search_field = "";
    this.icon_field = "";
    this.category_field = "";
    this.default_sel = "";
    this.ignoreCase = true;
    this.partialSearch = true;
    this.maxResults = 10;
    this.dom_options_list = null;
    this.dom_options_list_iframe = null;
    this.searchType = "LEADING"
    this.sortOrder = "ASC"
    this.sortOffset = 1;
    this.dom_input = null;
    this.onSelectFnc = null
    this.searchList = function (prefs)
    {
        var inputID = prefs.inputID
		, validation = prefs.inputValidation
		, JSONList = prefs.JSONList
		, JSONRefs = prefs.JSONRefs
		, JSONSource = prefs.JSONSource
		, onSelectFnc = prefs.onSelectFnc
		, onKeyUpFnc = prefs.onKeyUpFnc
		, ignoreCase = prefs.ignoreCase
		, partialSearch = prefs.partialSearch
		, searchType = prefs.searchType
		, sortOrder = prefs.sortOrder
		, maxResults = parseInt(prefs.maxResults, 10)
		, that = this
        that.onSelectFnc = onSelectFnc
        if (inputID && inputID > " " && JSONRefs && JSONRefs.length > 0)
        {
            that.dom_input = document.getElementById(inputID)
            if (validation && validation > " ")
            { // define validation
                that.set_value_type(inputID, validation);
            }
            if (searchType != undefined && (searchType === "LEADING" || searchType === "ANY"))
            { // search type
                that.searchType = searchType;
            }
            if (ignoreCase != undefined && (ignoreCase === true || ignoreCase === false))
            { // ignore case for search
                that.ignoreCase = ignoreCase;
            }
            if (partialSearch != undefined && (partialSearch === true || partialSearch === false))
            { // partial search
                that.partialSearch = partialSearch;
            }
            if (maxResults && maxResults > 0)
            { // maximum results to show
                that.maxResults = maxResults;
            }
            if (sortOrder && sortOrder > " ")
            { // define validation
                that.sortOrder = sortOrder;
                switch (sortOrder)
                {
                    case "ASC": that.sortOffset = 1; break;
                    case "DESC": that.sortOffset = -1; break;
                }
            }


            that.search_field = JSONRefs[0];
            if (JSONSource && JSONSource === "ASYNC")
            { // for async type, attach on Key Up Handler
                that.dom_input["onkeyup"] = function (e)
                {
                    e = e || window.event;
                    var cur_key = get_keycode(e);
                    if (that.dom_input.value > " ")
                    {
                        if (cur_key === 13 || cur_key === 38 || cur_key === 40)
                        {	// if up, down or enter => navigate through current list						
                            search_values(e, that.dom_input, that);
                        }
                        else
                        {
                            onKeyUpFnc(e, that);
                        }
                    }
                    else
                    {
                        fnc_blur(e);
                    }
                }
            }
            else
            {
                JSONList.sort(function (a, b)
                {
                    return (that.sortOffset * (sortbyname(JSONRefs[0], a, b)));
                })
                if (JSONList && JSONList.length > 0)
                { // define search list
                    that.set_search_list(inputID, JSONList, JSONRefs[0])
                }
            }
            window.attachEvent("onresize", function (e)
            {
                if (that.dom_options_list
				&& that.dom_options_list !== null
				&& typeof that.dom_options_list === 'object'
				&& that.dom_options_list.style.visibility === "visible")
                {
                    search_values(e, that.dom_input, that);
                }
            });
            that.dom_input["onblur"] = fnc_blur;
            that.dom_input["onfocusout"] = fnc_blur;
            that.dom_input["onDOMFocusOut"] = fnc_blur;
        }
    }

    this.loadSearchList = function (e, JSONList)
    {
        var that = this;
        that.options_list = JSONList; // set options_list
        e = e || window.event;
        if (document.activeElement == that.dom_input)
        {
            search_values(e, that.dom_input, that);
            that.dom_input["onDOMFocusIn"] = fnc_focus;
            that.dom_input["onfocus"] = fnc_focus;
        }
    }
    /** 
    * Attach the appropriate event handlers for linear text search
    * @memberOf UtilInputText
    * @method
    * @param  {String} Id of the input field to attach event
    * @param  {Object} JSON list object with the search data
    * @param  {String} Object name of the search value
    */
    this.set_search_list = function (ss_list_id, options_list, search_field)
    {
        var that = this;
        that.options_list = options_list;
        that.search_field = search_field;
        that.dom_input = document.getElementById(ss_list_id)

        that.dom_input["onkeyup"] = fnc_focus
        that.dom_input["onDOMFocusIn"] = fnc_focus;
        that.dom_input["onfocus"] = fnc_focus;
        that.dom_input["onblur"] = fnc_blur;
        that.dom_input["onfocusout"] = fnc_blur;
        that.dom_input["onDOMFocusOut"] = fnc_blur;
    };


    this.hide_list = function (e, ss_list_id)
    {
        var dom_el = document.getElementById(ss_list_id);
        hide_popup(e, dom_el, this);
    }

    /** 
    * Attach the appropriate event handlers for linear text search
    * @memberOf UtilInputText
    * @method
    * @param  {String} Id of the input field to attach event
    * @param  {Object} JSON list object with the search data
    */
    this.set_dropdown_list = function (ss_dom_el, options_list, search_field, icon_field, category_field, default_sel, default_disp)
    {
        var dom_span_el, dom_btn_el, temp_node, dom_div_el;
        var that = this;


        dom_span_el = document.createElement("span");
        dom_span_el = ss_dom_el.appendChild(dom_span_el);
        dom_span_el.className = "ss_list_dropdown_detail";
        dom_span_el.innerHTML = "&nbsp;";

        dom_btn_el = document.createElement("span");
        dom_btn_el = ss_dom_el.appendChild(dom_btn_el);
        dom_btn_el.className = "ss_list_dropdown_btn";
        dom_btn_el.innerHTML = "&#9660;";

        dom_div_el = ss_dom_el.appendChild(document.createElement("div"));

        that.search_field = search_field;
        that.icon_field = icon_field;
        that.category_field = category_field;
        that.default_sel = default_sel;
        that.options_list = options_list;

        ss_dom_el.className = "ss_list_dropdown_span";
        //	ss_dom_el =  ss_dom_el.appendChild(temp_node)

        ss_dom_el.onclick = function (e)
        {
            e = e || window.event;
            toggle_dropdown_list(e, ss_dom_el, dom_span_el, dom_div_el, that);
        };
        if (default_disp === true)
        {
            toggle_dropdown_list(null, ss_dom_el, dom_span_el, dom_div_el, that);
        }
        if (that.default_sel === "")
        {
            that.default_sel = that.options_list[0][that.search_field];
        }
        dom_span_el.innerHTML = autoEllipseText(that.default_sel, dom_span_el.parentNode.offsetWidth - dom_span_el.parentNode.childNodes[1].offsetWidth, dom_span_el.className);
        window.attachEvent("onresize", function ()
        {
            if (that.dom_options_list
				&& that.dom_options_list !== null
				&& typeof that.dom_options_list === 'object'
				&& typeof that.dom_options_list.onblur === 'function')
            {
                that.dom_options_list.onblur();
            }
        });
    };

    this.shift_option = function (obj)
    {
        var that = this;
        that.options_list.shift(obj);
    };

    this.append_option = function (obj)
    {
        var that = this;
        that.options_list.push(obj);
    };

    /** 
    * Attach the appropriate event handlers for text validation
    * @memberOf UtilInputText
    * @method
    * @param  {String} Id of the input field to validate
    * @param  {String} value type to validate
    */
    this.set_value_type = function (ss_list_id, value_type)
    {
        var dom_el = document.getElementById(ss_list_id);
        switch (value_type)
        {
            case "ALPHA":
                dom_el.onkeypress = function (e)
                {
                    if (!e)
                    {
                        e = window.event;
                    }
                    return validate_alpha(dom_el, e);
                };
                break;
            case "NUM":
                dom_el.onkeypress = function (e)
                {
                    if (!e)
                    {
                        e = window.event;
                    }
                    return validate_numeric(dom_el, e);
                };
                break;
            case "DATE":
                dom_el.value = "**/**/****";
                dom_el.onkeydown = function (e)
                {
                    if (!e)
                    {
                        e = window.event;
                    }
                    return validate_date_x(dom_el, e);
                };
                break;
            case "TIME":
                dom_el.value = "**:**";
                dom_el.onkeydown = function (e)
                {
                    if (!e)
                    {
                        e = window.event;
                    }
                    return validate_time_x(dom_el, e);
                };
                break;
        }
    }

    //}
};