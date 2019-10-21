/** extern healthe-widget-library-1.3.2-min , dc_mp_js_util_popup */

/**~BB~************************************************************************
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
 
 Source file name:       dc_mp_js_layout_table.js
 
 Product:                Discern Content
 Product Team:           Discern Content
 
 File purpose:           Provides the TableLayout class with methods
 to build/load table DOM fragments.
 
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
 * @author RB018070
 * Reference
 *
 Preference value list:
 
 headerDisplay  	 	(String) 	-	Display string for table header
 headerLink	  		(String) 	-	Link for headerDisplay
 headerToggle  		(Array) 	-	[HideIcon,ShowIcon] Display value for header toggle
 headerCSS			(String) 	-	CSS classname for header
 tableMaxRows	   	(Number)	-	Maximum number of rows to show before scrollbar is displayed **Requires tableRowHeight**
 tableRowHeight		(String)	-	Height of the table ( used to calculate scrolling)
 tableHeaderRowCSS	(String)	-   CSS classname for thead rows on table
 tableHeaderCellCSS	(String)	-   CSS classname for th cells on table
 tableBodyRowCSS		(String)	-   CSS classname for tbody rows on table
 tableBodyRowCSS		(String)	-   CSS classname for td cells on table
 tableBodyRowCSS		(Array)		-	Hover template text for each cell **Requires JSONList**
 tableHeaders		(Array)		-   Headers for each table column
 tableHeadersFixed	(String)	-	True/False value for fixed table columns **Requires tableHeaders**
 tableHeadersResize	(String)	-	True/False value for resizable table columns **Requires tableHeaders**
 numberColumns		(Numbers)	-	Number of columns to generate on table (*optional* if tableHeaders is specified)
 JSONList			(Array)		-	JSON array consisting of data
 JSONRefs			(Array)		-	JSON reference names in JSONList **Requires JSONList**
 JSONRefHvrSticky
 JSONRefHvrStickyTimeOut
 
 <div>    						wrapperDOM
 <span>
 headerDOM
 </span>
 <div>						tableOuterWrapperDOM
 <div>					tableHeaderWrapperDOM 		(optional)
 <table></table>	tableHeaderDOM	> tHeadDOM	(optional)
 </div>
 <div>					tableWrapperDOM
 <table></table>		tableDOM > tableBodyDOM
 </div>
 </div>
 </div>
 
 
 **/
var TableLayout = function(){
    // Private Methods
    function TableLayout_replaceTags(tagTxt, jsonList){
        var objRegExp = /=%(\w+)/g, tagSplit = tagTxt.match(objRegExp), i = 0, l = 0;
        if (tagSplit && tagSplit.length > 0) {
            for (i = 0, l = tagSplit.length; i < l; i++) {
                tagTxt = tagTxt.split(tagSplit[i]).join(jsonList[tagSplit[i].split("=%").join("")]);
            }
        }
        return (tagTxt)
    }
    function TableLayout_attachResizeEvents(dragDOM, leftColDOM, rightColDOM, leftHeaderColDOM, rightheaderColDOM){
        var startMousePosition, startLeftColWidth, startRightColWidth, mouseMovefnc = function(e){
            var e, curMousePosition = TableLayout_mpo(e), widthdiff1 = startMousePosition[1] - curMousePosition[1], widthdiff2 = curMousePosition[1] - startMousePosition[1];
            if (!e) {
                e = window.event;
            }
            if (widthdiff2 <= 0) { // dragging left (leftColDOM width decreases)
                if ((startLeftColWidth - widthdiff1) < 0) {
                    leftHeaderColDOM.style.width = "0px";
                    leftColDOM.style.width = "0px";
                }
                else {
                    leftHeaderColDOM.style.width = (startLeftColWidth - widthdiff1) + "px";
                    leftColDOM.style.width = (startLeftColWidth - widthdiff1) + "px";
                }
                rightheaderColDOM.style.width = (startRightColWidth + widthdiff1) + "px";
                rightColDOM.style.width = (startRightColWidth + widthdiff1) + "px";
            }
            else {// dragging right (rightColDOM width decreases)
                leftHeaderColDOM.style.width = (startLeftColWidth + widthdiff2) + "px";
                leftColDOM.style.width = (startLeftColWidth + widthdiff2) + "px";
                if (startRightColWidth - widthdiff2 < 0) {
                    rightheaderColDOM.style.width = "0px";
                    rightColDOM.style.width = "0px";
                }
                else {
                    rightheaderColDOM.style.width = (startRightColWidth - widthdiff2) + "px";
                    rightColDOM.style.width = (startRightColWidth - widthdiff2) + "px";
                }
            }
            Util.preventDefault(e);
        }, mouseUpfnc = function(e){
            var e;
            if (!e) {
                e = window.event;
            }
            Util.removeEvent(document, "mousemove", mouseMovefnc);
            Util.removeEvent(document, "mouseup", mouseUpfnc);
            Util.preventDefault(e);
        }, mouseDownfnc = function(e){
            var e;
            if (!e) {
                e = window.event;
            }
            startMousePosition = TableLayout_mpo(e);
            startLeftColWidth = leftColDOM.offsetWidth;
            startRightColWidth = rightColDOM.offsetWidth;
            Util.addEvent(document, "mousemove", mouseMovefnc);
            Util.addEvent(document, "mouseup", mouseUpfnc);
            Util.preventDefault(e);
        }
        
        Util.addEvent(dragDOM, "mousedown", mouseDownfnc);
    }
    function TableLayout_mpo(e){
        var posx = 0;
        var posy = 0;
        if (!e) 
            var e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else 
            if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
            }
        return [posy, posx];
    }
    function TableLayout_RealTypeOf(v){
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
        
            error_handler(e.message, "TableLayout_RealTypeOf()");
        }
    }
    function sortTable(tblEl, col, type){
        //-----------------------------------------------------------------------------
        // sortTable(id, col, rev)
        //
        //  id  - ID of the TABLE, TBODY, THEAD or TFOOT element to be sorted.
        //  col - Index of the column to sort, 0 = first column, 1 = second column,
        //        etc.
        //  rev - If true, the column is sorted in reverse (descending) order
        //        initially.
        //
        // Note: the team name column (index 1) is used as a secondary sort column and
        // always sorted in ascending order.
        //-----------------------------------------------------------------------------
        
        // Get the table or table section to sort.
        var rev = false;
        var imghtml;
        // The first time this function is called for a given table, set up an
        // array of reverse sort flags.
        if (tblEl.reverseSort == null) {
            tblEl.reverseSort = new Array();
            // Also, assume the team name column is initially sorted.
            tblEl.lastColumn = 2;
        }
        
        // If this column has not been sorted before, set the initial sort direction.
        if (tblEl.reverseSort[col] == null) 
            tblEl.reverseSort[col] = rev;
        
        
        
        // If this column was the last one sorted, reverse its sort direction.
        if (col == tblEl.lastColumn) {
            tblEl.reverseSort[col] = !tblEl.reverseSort[col];
        }
        
        
        // Remember this column as the last one sorted.
        tblEl.lastColumn = col;
        
        var tmpEl;
        var i, j;
        var minVal, minIdx;
        var testVal;
        var cmp;
        for (i = 0; i < tblEl.rows.length - 1; i++) {
            // Assume the current row has the minimum value.
            minIdx = i;
            if (tblEl.rows[i].cells[col].childNodes && tblEl.rows[i].cells[col].childNodes[0] && tblEl.rows[i].cells[col].childNodes[0].innerHTML) 
                minVal = tblEl.rows[i].cells[col].childNodes[0].innerHTML;
            else 
                minVal = tblEl.rows[i].cells[col].innerHTML;
            // Search the rows that follow the current one for a smaller value.
            for (j = i + 1; j < tblEl.rows.length; j++) {
                if (tblEl.rows[j].cells[col].childNodes && tblEl.rows[j].cells[col].childNodes[0] && tblEl.rows[j].cells[col].childNodes[0].innerHTML) 
                    testVal = tblEl.rows[j].cells[col].childNodes[0].innerHTML;
                else 
                    testVal = tblEl.rows[j].cells[col].innerHTML;
                if (testVal > " ") {
                
                    cmp = compareValues(minVal, testVal, type);
                    
                    // Negate the comparison result if the reverse sort flag is set.
                    if (tblEl.reverseSort[col]) 
                        cmp = -cmp;
                    
                    
                    // If this row has a smaller value than the current minimum, remember its
                    // position and update the current minimum value.
                    if (cmp > 0) {
                        minIdx = j;
                        minVal = testVal;
                    }
                }
            }
            
            // By now, we have the row with the smallest value. Remove it from the
            // table and insert it before the current row.
            if (minIdx > i) {
            
                tmpEl = tblEl.removeChild(tblEl.rows[minIdx]);
                tblEl.insertBefore(tmpEl, tblEl.rows[i]);
            }
            
        }
        return false;
    }
    function compareValues(v1, v2, type){
        if (type == "date") {
            var date1 = v1.split("/");
            var date2 = v2.split("/");
            var tempdate1 = new Date();
            var tempdate2 = new Date();
            var dttmdiff = new Date();
            tempdate1.setFullYear(date1[2], date1[0] - 1, date1[1]);
            tempdate2.setFullYear(date2[2], date2[0] - 1, date2[1]);
            dttmdiff.setTime(tempdate1.getTime() - tempdate2.getTime());
            timediff = dttmdiff.getTime();
            days = Math.floor(timediff / (1000 * 60 * 60 * 24));
            if (days > 0) 
                return 1;
            else 
                if (days == 0) 
                    return 0;
        }
        else 
            if (type == "numeric") {
                if (parseInt(v1) == parseInt(v2)) 
                    return 0;
                if (parseInt(v1) > parseInt(v2)) 
                    return 1
            }
            else {
                if (v1 == v2) 
                    return 0;
                if (v1 > v2) 
                    return 1
            }
        return -1;
    }
    function TableLayout_attachSortEvent(tableHeadCellDOM, tableBodyDOM, colIndex, sortType){
        Util.addEvent(tableHeadCellDOM, "click", function(){
            sortTable(tableBodyDOM, colIndex, sortType);
        });
    }
	function addTableRowEvent(tableRowEvent,tableRowFnc,curRowDOM)
	{	
			if (tableRowEvent == "contextmenu") {
				curRowDOM.oncontextmenu = function(e1){
					return (tableRowFnc(e1, curRowDOM));
				};
			}
			else {
				Util.addEvent(curRowDOM, tableRowEvent, function(e){
					return (tableRowFnc(e, curRowDOM));
				})
			}			
	}
    // Return API
    return {
        generateLayout: function(prefs){
            var wrapperDOM, headerDOM,tempcellDOM, tableOuterWrapperDOM,fnc_cntr = 0, fnc_cnt = 0, tableHeaderWrapperDOM, tableHeaderDOM, tableWrapperDOM, tableDOM, headerlinkDOM, toggleDOM, tHeadDOM, tableBodyDOM, tableHeadCellDOM, prevtableHeadCellDOM, headerRowDOM, curRowDOM, resizeDOM, tableheaderCSS, tableRowId = prefs.JSONRowId, tableRowEvent = prefs.JSONRowEvent, tableRowFnc = prefs.JSONRowFnc, tempstr, cnt1, cntr1, cnt2, cntr2, cntr3, cnt3, hcntr = -1, ccntr = -1, ccntr2 = -1, rcntr = -1;
            
            wrapperDOM = Util.cep("div", {
                "className": "table-layout-wrapper"
            });
            tableOuterWrapperDOM = Util.ce("div");
            tableHeaderWrapperDOM = Util.ce("div");
            tableWrapperDOM = Util.cep("div", {
                "className": "table-layout-wrapper-table"
            });
            tableHeaderDOM = Util.cep("table", {
                "className": "table-layout-table-head"
            });
            tableDOM = Util.cep("table", {
                "className": "table-layout-table"
            });
            if (Util.Detect.ie6() == true) {
                tableDOM.style.width = "auto";
            }
            
            // build header
            if (prefs.headerDisplay && prefs.headerDisplay > "") {
                headerDOM = Util.cep("div", {
                    "className": "table-layout-header"
                });
                if (prefs.headerLink && prefs.headerLink > "") {
                    headerlinkDOM = Util.cep("a", {
                        "href": prefs.headerLink
                    })
                    headerlinkDOM.innerHTML = prefs.headerDisplay;
                    Util.ac(headerlinkDOM, headerDOM);
                }
                else {
                    headerDOM.innerHTML = "<span>" + prefs.headerDisplay + "</span>";
                }
                if (prefs.tableCSS && prefs.tableCSS > "") {
                    tableHeaderDOM.className = tableHeaderDOM.className + " " + prefs.tableCSS;
                    tableDOM.className = tableDOM.className + " " + prefs.tableCSS;
                }
                if (prefs.headerCSS && prefs.headerCSS > "") {
                    headerDOM.className = headerDOM.className + " " + prefs.headerCSS;
                }
                if (prefs.headerToggle && prefs.headerToggle > "") {
                    toggleDOM = Util.cep("span", {
                        "className": "table-layout-header-toggle"
                    });
                    toggleDOM.innerHTML = prefs.headerToggle[0];
                    toggleDOM = Util.ac(toggleDOM, headerDOM);
                    Util.addEvent(toggleDOM, "click", function(){
                        if (tableOuterWrapperDOM.style.display != "none") {
                            tableOuterWrapperDOM.style.display = "none";
                            toggleDOM.innerHTML = prefs.headerToggle[1];
                        }
                        else {
                            tableOuterWrapperDOM.style.display = "";
                            toggleDOM.innerHTML = prefs.headerToggle[0];
                        }
                    });
                };
                headerDOM = Util.ac(headerDOM, wrapperDOM);
            }
            
            tableHeaderDOM = Util.ac(tableHeaderDOM, tableHeaderWrapperDOM);
            tableDOM = Util.ac(tableDOM, tableWrapperDOM);
            tableHeaderWrapperDOM = Util.ac(tableHeaderWrapperDOM, tableOuterWrapperDOM);
            tableWrapperDOM = Util.ac(tableWrapperDOM, tableOuterWrapperDOM);
            tableOuterWrapperDOM = Util.ac(tableOuterWrapperDOM, wrapperDOM);
            //build Table 
            if ((prefs.tableHeaders && prefs.tableHeaders.length && prefs.tableHeaders.length > 0) ||
            (prefs.numberColumns && parseInt(prefs.numberColumns) > 0)) {
                if (prefs.tableHeaders && prefs.tableHeaders.length && prefs.tableHeaders.length > 0) {
                    // Create Table Header Row         
                    if (prefs.tableHeadersFixed &&
                    (prefs.tableHeadersFixed == "true" || prefs.tableHeadersFixed == "1")) {
                        tHeadDOM = tableHeaderDOM.createTHead();
                        tableheaderCSS = "table-layout-table-head-th";
                    }
                    else {
                        tHeadDOM = tableDOM.createTHead();
                        tableheaderCSS = "table-layout-table-th";
                    }
                    
                    tHeadDOM.insertRow(-1);
                    headerRowDOM = tHeadDOM.rows[0];
                    headerRowDOM.colSpan = prefs.tableHeaders.length;
                    // Attach any declared CSS class names for <tr> in <thead>
                    if (prefs.tableHeaderRowCSS && prefs.tableHeaderRowCSS > "") {
                        if (TableLayout_RealTypeOf(prefs.tableHeaderRowCSS) == "string") {
                            headerRowDOM.className = headerRowDOM.className + " " + prefs.tableHeaderRowCSS;
                        }
                    }
                }
                // Load JSON data to table body
                tableBodyDOM = Util.ce("tbody");
                tableBodyDOM = Util.ac(tableBodyDOM, tableDOM);
                if (prefs.numberColumns) 
                    tableBodyDOM.colSpan = parseInt(prefs.numberColumns);
                else 
                    tableBodyDOM.colSpan = prefs.tableHeaders.length;
                
                
                if (prefs.JSONList &&
                prefs.JSONList.length &&
                prefs.JSONList.length > 0 &&
                prefs.JSONRefs &&
                prefs.JSONRefs.length &&
                prefs.JSONRefs.length > 0) {
                    tableBodyDOM.className = "scrollContent";
                    for (var cntr1 = 0, cnt1 = prefs.JSONList.length; cntr1 < cnt1; cntr1++) {
                    
                        tableBodyDOM.insertRow(-1);
                        curRowDOM = tableBodyDOM.rows[cntr1];
                        if (tableRowId) {
                            tempstr = "";
                            
                            if (TableLayout_RealTypeOf(tableRowId) == "array") {
                                for (var cntr3 = 0, cnt3 = tableRowId.length; cntr3 < cnt3; cntr3++) {
                                    if ((prefs.JSONList[cntr1])[tableRowId[cntr3]]) {
                                        tempstr += "_";
                                        tempstr += (prefs.JSONList[cntr1])[tableRowId[cntr3]];
                                    }
                                }
                            }
                            else {
                                if ((prefs.JSONList[cntr1])[tableRowId]) {
                                    tempstr = (prefs.JSONList[cntr1])[tableRowId];
                                }
                            }
                            curRowDOM.id = tempstr;
                        }
						if(tableRowFnc && tableRowEvent && tableRowEvent > "" ){
							if(TableLayout_RealTypeOf(tableRowFnc) == "array"){
								fnc_cnt = tableRowFnc.length;
								for (fnc_cntr = 0; fnc_cntr < fnc_cnt; fnc_cntr++) {
									addTableRowEvent(tableRowEvent[fnc_cntr],tableRowFnc[fnc_cntr],curRowDOM);
								}									
							}
							else{
									addTableRowEvent(tableRowEvent,tableRowFnc,curRowDOM);		
							}					
						}
                        // Attach any declared CSS class names for <tr> in <tbody>
                        if (prefs.tableBodyRowCSS && prefs.tableBodyRowCSS > "") {
                            if (TableLayout_RealTypeOf(prefs.tableBodyRowCSS) == "string") {
                                curRowDOM.className = prefs.tableBodyRowCSS;
                            }
                            else 
                                if (TableLayout_RealTypeOf(prefs.tableBodyRowCSS) == "array") {
                                    if (prefs.tableBodyRowCSS.length == 1) {
                                        curRowDOM.className = curRowDOM.className + " " + prefs.tableBodyRowCSS[0];
                                    }
                                    else {
                                        rcntr += 1;
                                        if (rcntr == prefs.tableBodyRowCSS.length) {
                                            rcntr = 0;
                                        }
                                        curRowDOM.className = curRowDOM.className + " " + prefs.tableBodyRowCSS[rcntr];
                                    }
                                }
                        }
                        
                        if (prefs.tableMaxRows && prefs.tableRowHeight && prefs.tableMaxRows == cntr1) {
                            if (prefs.tableHeadersFixed &&
                            (prefs.tableHeadersFixed == "true" || prefs.tableHeadersFixed == "1")) {
                                tableHeaderWrapperDOM.style.paddingRight = "17px";
                            }
							
                           // tableWrapperDOM.style.height = (prefs.tableMaxRows * parseFloat(prefs.tableRowHeight)) + "em";
							
                        }
                        if (prefs.numberColumns) 
                            curRowDOM.colSpan = parseInt(prefs.numberColumns);
                        else 
                            curRowDOM.colSpan = prefs.tableHeaders.length;
                        for (var cntr2 = 0, cnt2 = prefs.JSONRefs.length; cntr2 < cnt2; cntr2++) {
                            curRowDOM.insertCell(-1);
                            if ((prefs.JSONList[cntr1])[prefs.JSONRefs[cntr2]]) {
								tempcellDOM = Util.ce("span");
								tempcellDOM.innerHTML = ((prefs.JSONList[cntr1])[prefs.JSONRefs[cntr2]]);
								if (prefs.JSONRefCSS && prefs.JSONRefCSS[cntr2] && prefs.JSONRefCSS[cntr2] > " ") {
									tempcellDOM.className = prefs.JSONRefCSS[cntr2];
								}
								Util.ac(tempcellDOM,curRowDOM.cells[cntr2])
							}
                            curRowDOM.cells[cntr2].className = "table-layout-table-td";
                            // Attach any declared CSS class names for <td> in <tbody>
                            if (prefs.tableBodyCellCSS && prefs.tableBodyCellCSS > "") {
                                if (TableLayout_RealTypeOf(prefs.tableBodyCellCSS) == "string") {
                                    curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS;
                                }
                                else 
                                    if (TableLayout_RealTypeOf(prefs.tableBodyCellCSS) == "array") {
                                        if (prefs.tableBodyCellCSS.length == 1) {
                                            curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS[0];
                                        }
                                        else {
                                            ccntr += 1;
                                            if (ccntr == prefs.tableBodyCellCSS.length) {
                                                ccntr = 0;
                                            }
                                            curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS[ccntr];
                                        }
                                    }
                            }
                            
                            // Attach any declare hovers for <tr> in <tbody>
                            if (prefs.tableBodyRowHover && prefs.tableBodyRowHover > "") {
                                hcntr += 1;
                                if (hcntr == prefs.tableBodyRowHover.length) {
                                    hcntr = 0;
                                }
                                if (prefs.tableBodyRowHover[hcntr] > "") {
                                    UtilPopup.attachHover({
                                        "elementDOM": curRowDOM.cells[cntr2],
                                        "event": "mousemove",
                                        "content": TableLayout_replaceTags(prefs.tableBodyRowHover[hcntr], prefs.JSONList[cntr1])
                                    });
                                }
                            }
                        }
                    }
                }
                // Build Table Header Cells
                if (prefs.tableHeaders && prefs.tableHeaders.length && prefs.tableHeaders.length > 0) {
                    for (cntr1 = 0, cnt1 = prefs.tableHeaders.length; cntr1 < cnt1; cntr1++) {
                        tableHeadCellDOM = Util.ce("th");
                        tableHeadCellDOM.innerHTML = prefs.tableHeaders[cntr1];
                        // Attach Resize handlers				
                        if (prefs.tableHeadersResize &&
                        (prefs.tableHeadersResize == "true" || prefs.tableHeadersResize == "1")) {
                            if (cntr1 > 0) {
                                if (prefs.tableHeadersFixed &&
                                (prefs.tableHeadersFixed == "true" || prefs.tableHeadersFixed == "1") &&
                                (tableBodyDOM && tableBodyDOM.rows && tableBodyDOM.rows[0])) {
                                    TableLayout_attachResizeEvents(resizeDOM, tableBodyDOM.rows[0].cells[cntr1 - 1], tableBodyDOM.rows[0].cells[cntr1], prevtableHeadCellDOM, tableHeadCellDOM);
                                }
                                else {
                                    TableLayout_attachResizeEvents(resizeDOM, prevtableHeadCellDOM, tableHeadCellDOM, prevtableHeadCellDOM, tableHeadCellDOM);
                                }
                            }
                            resizeDOM = Util.cep("span", {
                                "className": "table-layout-header-resize"
                            });
                            resizeDOM.innerHTML = "&nbsp;";
                            resizeDOM = Util.ac(resizeDOM, tableHeadCellDOM);
                        }
                        //Attach Sort handlers
                        if (prefs.tableSort && prefs.tableSort.length > 0 && prefs.tableSort[cntr1]) {
                            tableHeadCellDOM.title = "Click to sort";
                            tableHeadCellDOM.style.cursor = "pointer";
                            TableLayout_attachSortEvent(tableHeadCellDOM, tableBodyDOM, cntr1, prefs.tableSort[cntr1]);
                        }
                        tableHeadCellDOM.className = tableheaderCSS;
                        // Attach any declared CSS class names for <td> in <thead>
                        if (prefs.tableHeaderCellCSS && prefs.tableHeaderCellCSS > "") {
                            if (TableLayout_RealTypeOf(prefs.tableHeaderCellCSS) == "string") {
                                tableHeadCellDOM.className = tableHeadCellDOM.className + " " + prefs.tableHeaderCellCSS;
                            }
                            else 
                                if (TableLayout_RealTypeOf(prefs.tableHeaderCellCSS) == "array") {
                                    if (prefs.tableHeaderCellCSS.length == 1) {
                                        tableHeadCellDOM.className = tableHeadCellDOM.className + " " + prefs.tableHeaderCellCSS[0];
                                    }
                                    else {
                                        ccntr2 += 1;
                                        if (ccntr2 == prefs.tableHeaderCellCSS.length) {
                                            ccntr2 = 0;
                                        }
                                        tableHeadCellDOM.className = tableHeadCellDOM.className + " " + prefs.tableHeaderCellCSS[ccntr2];
                                    }
                                }
                        }
                        Util.ac(tableHeadCellDOM, headerRowDOM);
                        prevtableHeadCellDOM = tableHeadCellDOM;
                    }
                }
            }
            return ({
                "layoutDOM": wrapperDOM,
                "contentDOM": tableOuterWrapperDOM,
                "tableDOM": tableBodyDOM,
				"headerRowDOM": headerRowDOM,
				"wrapperDOM":tableWrapperDOM
            })
        },
		//Append Rows to existing table
		
		appendRows: function(prefs){
			var  fnc_cntr = 0, fnc_cnt = 0, tableBodyDOM = prefs.tableBodyDOM,tempcellDOM,  curRowDOM, tableRowId = prefs.JSONRowId, tableRowEvent = prefs.JSONRowEvent, tableRowFnc = prefs.JSONRowFnc, tempstr, cnt1, cntr1, cnt2, cntr2, cntr3, cnt3, hcntr = -1, ccntr = -1,rcntr = -1;
			
			
			// Load JSON data to table body
               	if (prefs.numberColumns) {
			   		tableBodyDOM.colSpan = parseInt(prefs.numberColumns);
			   	}
			   	
			   	
			   	if (prefs.JSONList &&
			   	prefs.JSONList.length &&
			   	prefs.JSONList.length > 0 &&
			   	prefs.JSONRefs &&
			   	prefs.JSONRefs.length &&
			   	prefs.JSONRefs.length > 0) {
			   		tableBodyDOM.className = "scrollContent";
			   		for (var cntr1 = 0, cnt1 = prefs.JSONList.length; cntr1 < cnt1; cntr1++) {
					
						if (tableRowId) {
							tempstr = "";
							if (TableLayout_RealTypeOf(tableRowId) == "array") {
								for (var cntr3 = 0, cnt3 = tableRowId.length; cntr3 < cnt3; cntr3++) {
									if ((prefs.JSONList[cntr1])[tableRowId[cntr3]]) {
										tempstr += "_";
										tempstr += (prefs.JSONList[cntr1])[tableRowId[cntr3]];
									}
								}
							}
							else {
								if ((prefs.JSONList[cntr1])[tableRowId]) {
									tempstr = (prefs.JSONList[cntr1])[tableRowId];
								}
							}
						}
						if (_g(tempstr) === undefined || _g(tempstr) === null || !tableRowId) {
							tableBodyDOM.insertRow(-1);
							curRowDOM = tableBodyDOM.rows[tableBodyDOM.rows.length - 1];
							curRowDOM.id = tempstr;
							
							if (tableRowFnc && tableRowEvent && tableRowEvent > "") {
								if (TableLayout_RealTypeOf(tableRowFnc) == "array") {
									fnc_cnt = tableRowFnc.length;
									for (fnc_cntr = 0; fnc_cntr < fnc_cnt; fnc_cntr++) {
										addTableRowEvent(tableRowEvent[fnc_cntr], tableRowFnc[fnc_cntr], curRowDOM);
									}
								}
								else {
									addTableRowEvent(tableRowEvent, tableRowFnc, curRowDOM);
								}
							}
							// Attach any declared CSS class names for <tr> in <tbody>
							if (prefs.tableBodyRowCSS && prefs.tableBodyRowCSS > "") {
								if (TableLayout_RealTypeOf(prefs.tableBodyRowCSS) == "string") {
									curRowDOM.className = prefs.tableBodyRowCSS;
								}
								else 
									if (TableLayout_RealTypeOf(prefs.tableBodyRowCSS) == "array") {
										if (prefs.tableBodyRowCSS.length == 1) {
											curRowDOM.className = curRowDOM.className + " " + prefs.tableBodyRowCSS[0];
										}
										else {
											rcntr = (tableBodyDOM.rows.length-1)%prefs.tableBodyRowCSS.length;
											curRowDOM.className = curRowDOM.className + " " + prefs.tableBodyRowCSS[rcntr];
										}
									}
							}
							
							if (prefs.numberColumns) {
								curRowDOM.colSpan = parseInt(prefs.numberColumns);
							}
							
							for (var cntr2 = 0, cnt2 = prefs.JSONRefs.length; cntr2 < cnt2; cntr2++) {
								curRowDOM.insertCell(-1);
								 if ((prefs.JSONList[cntr1])[prefs.JSONRefs[cntr2]]) {
										tempcellDOM = Util.ce("span");
										tempcellDOM.innerHTML = ((prefs.JSONList[cntr1])[prefs.JSONRefs[cntr2]]);
										if (prefs.JSONRefCSS && prefs.JSONRefCSS[cntr2] && prefs.JSONRefCSS[cntr2] > " ") {
											tempcellDOM.className = prefs.JSONRefCSS[cntr2];
										}
										Util.ac(tempcellDOM,curRowDOM.cells[cntr2])
								}
								curRowDOM.cells[cntr2].className = "table-layout-table-td";
								// Attach any declared CSS class names for <td> in <tbody>
								if (prefs.tableBodyCellCSS && prefs.tableBodyCellCSS > "") {
									if (TableLayout_RealTypeOf(prefs.tableBodyCellCSS) == "string") {
										curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS;
									}
									else 
										if (TableLayout_RealTypeOf(prefs.tableBodyCellCSS) == "array") {
											if (prefs.tableBodyCellCSS.length == 1) {
												curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS[0];
											}
											else {
												ccntr += 1;
												if (ccntr == prefs.tableBodyCellCSS.length) {
													ccntr = 0;
												}
												curRowDOM.cells[cntr2].className = curRowDOM.cells[cntr2].className + " " + prefs.tableBodyCellCSS[ccntr];
											}
										}
								}
								
								// Attach any declare hovers for <tr> in <tbody>
								if (prefs.tableBodyRowHover && prefs.tableBodyRowHover > "") {
									hcntr += 1;
									if (hcntr == prefs.tableBodyRowHover.length) {
										hcntr = 0;
									}
									if (prefs.tableBodyRowHover[hcntr] > "") {
										UtilPopup.attachHover({
											"elementDOM": curRowDOM.cells[cntr2],
											"event": "mousemove",
											"content": TableLayout_replaceTags(prefs.tableBodyRowHover[hcntr], prefs.JSONList[cntr1])
										});
									}
								}
							}
						}
					}
				}
					return({
					"tableDOM": tableBodyDOM
				}) 
		},	
		setMaxRowScroll: function(tableObj,maxRows){
							    var rowsInTable = tableObj.tableDOM.rows.length;
							    try {
							        var border = getComputedStyle(tableObj.tableDOM.rows[0].cells[0], '').getPropertyValue('border-top-width');
							        border = border.replace('px', '') * 1;
							    } catch (e) {
							        var border = tableObj.tableDOM.rows[0].cells[0].currentStyle.borderWidth;
							        border = (border.replace('px', '') * 1) / 2;
							    }
							    var height = 0;
							    if (rowsInTable >= maxRows) {
							        for (var i = 0; i < maxRows; i++) {
							            height += tableObj.tableDOM.rows[i].clientHeight + (border ? border : 0);
							        }
							        tableObj.wrapperDOM.style.height = height+"px";
							    }
							
							},
        insertColumnData: function(prefs){
            var tableDOM = prefs.tableDOM,tableJSONMap = (prefs.tableJSONMap) ? prefs.tableJSONMap : {},indexOffset = (prefs.indexOffset) ? prefs.indexOffset : 0,columnCellCSS = prefs.columnCellCSS,columnIndex = (prefs.columnIndex) ? prefs.columnIndex : 0, tableRowId = prefs.JSONRowId, idInd = (tableRowId) ? true : false, tempstr, tempcellDOM, curRowDOM, curCellDOM, cntr1, cnt1, cntr3, cnt3, cntr4, cnt4;
            if (tableDOM && TableLayout_RealTypeOf(tableDOM) === "object") { // valid table
                for (var cntr1 = 0, cnt1 = prefs.JSONList.length; cntr1 < cnt1; cntr1++) {
                    if (idInd) { // Id based insert
                        tempstr = "";
                        
                        if (TableLayout_RealTypeOf(tableRowId) == "array") {
                            for (var cntr3 = 0, cnt3 = tableRowId.length; cntr3 < cnt3; cntr3++) {
                                if ((prefs.JSONList[cntr1])[tableRowId[cntr3]]) {
                                    tempstr += "_";
                                    tempstr += (prefs.JSONList[cntr1])[tableRowId[cntr3]];
                                }
                            }
                        }
                        else {
                            if ((prefs.JSONList[cntr1])[tableRowId]) {
                                tempstr = (prefs.JSONList[cntr1])[tableRowId];
                            }
                        }
                        if (tempstr > "") {
                            curRowDOM = _g(tempstr);
							tableJSONMap[tempstr] = cntr1+indexOffset;
                            if (TableLayout_RealTypeOf(curRowDOM) === "object") { // valid table row
                                if (curRowDOM.cells[columnIndex]) { // valid table cell
                                    curCellDOM = curRowDOM.cells[columnIndex];
									if (!prefs.JSONRefAppendInd || prefs.JSONRefAppendInd == 0) { // Clear cell data if not appending
										curCellDOM.innerHTML = "";
									}
									if (prefs.HideExistingCellDataInd && prefs.HideExistingCellDataInd == 1) {
										curCellDOM.innerHTML = "<span style='display:none'>" + curCellDOM.innerHTML + "</span>";
									}
                                    if (TableLayout_RealTypeOf(prefs.JSONRef) === "array") {
                                        for (cntr4 = 0, cnt4 = prefs.JSONRef.length; cntr4 < cnt4; cntr4++) {
											if ((prefs.JSONList[cntr1])[prefs.JSONRef[cntr4]] > " ") {
												tempcellDOM = Util.ce("span");													
												if (prefs.JSONRefAppendInd && prefs.JSONRefAppendInd == 1) { // appending to current cell data
													tempcellDOM.innerHTML += (prefs.JSONList[cntr1])[prefs.JSONRef[cntr4]];
												}
												else{
													tempcellDOM.innerHTML = (prefs.JSONList[cntr1])[prefs.JSONRef[cntr4]];
												}												
												if (prefs.JSONRefCSS && prefs.JSONRefCSS[cntr4] && prefs.JSONRefCSS[cntr4] > " ") {
													tempcellDOM.className = prefs.JSONRefCSS[cntr4];
												}
												else 
													if (columnCellCSS) {
														tempcellDOM.className = columnCellCSS;
													}
												tempcellDOM = Util.ac(tempcellDOM, curCellDOM);
												
												if (prefs.JSONRefHvr && prefs.JSONRefHvr[cntr4]) {
													UtilPopup.attachHover({
														"elementDOM": tempcellDOM,
														"event": "mousemove",
														"sticky": prefs.JSONRefHvrSticky,
														"stickyTimeOut": prefs.JSONRefHvrStickyTimeOut,
														"displayTimeOut": "450",
														"content": (prefs.JSONList[cntr1])[prefs.JSONRefHvr[cntr4]]
													});
												}
											}
										}
										if (columnCellCSS) {
											curCellDOM.className += " "+columnCellCSS;
										}
                                    }
                                    else {
										if (prefs.JSONRefAppendInd && prefs.JSONRefAppendInd == 1) {
											curCellDOM.innerHTML += (prefs.JSONList[cntr1])[prefs.JSONRef];
										}
										else {
											curCellDOM.innerHTML = (prefs.JSONList[cntr1])[prefs.JSONRef];
										}
										if(columnCellCSS){
											curCellDOM.className = columnCellCSS;
										}
										
                                    }
                                    
                                }
                            }
                        }
                    }
                    else { // non-id insert => create new table rows
                    }
                }
            }
			return tableJSONMap;
        },
    	setFixedHeader: function(prefs){
			try {
				var fixedHeaderclassName = prefs.fixedHeaderclassName
				, scrollContainerNode = prefs.scrollContainerNode
				, fixedHeaderNode = prefs.fixedHeaderNode ? prefs.fixedHeaderNode : Util.Style.g(fixedHeaderclassName, scrollContainerNode)[0]
				, scrollFunction = function(e){
					var targ;
					if (!e) 
						var e = window.event;
					if (e.target) 
						targ = e.target;
					else 
						if (e.srcElement) 
							targ = e.srcElement;
					if (targ.nodeType == 3) // defeat Safari bug
						targ = targ.parentNode;
					fixedHeaderNode.style.top = (targ.scrollTop - 1) + "px";
					
				};
				//set minimum styles for fixedHeaderNode
				fixedHeaderNode.style.position = 'relative';
				fixedHeaderNode.style.display = 'block';
				//assign onscroll and onresize scrollFunction to the scrollContainer
				Util.addEvent(scrollContainerNode, 'scroll', scrollFunction);
				Util.addEvent(scrollContainerNode, 'resize', scrollFunction);
			} 			
			catch (err) {
				alert("Error: TableLayout.setFixedHeader()" )
			}
		}
	}
}();

var TableSortable = function(prefs){
    var tableDOM = prefs.tableDOM,rowCSSName,row2CSSName,jsonObj=prefs.tableJSONMap,tableRowId = prefs.JSONRowId,jsonList = prefs.JSONList, toggleCmp = -1, jsonHandler = new UtilJsonXml();
   function getVal(stype){
   	switch(stype){
		case "numeric": return "-99999999999";
		default: return ""
	}
   }
	function sortTable(JSONRef, col, type){
        //-----------------------------------------------------------------------------
        // sortTable(id, col, rev)
        //
        //  JSONRef  - reference to the JSON to sort (optional).
        //  col - Index of the column to sort, 0 = first column, 1 = second column,
        //        etc.
        //  rev - If true, the column is sorted in reverse (descending) order
        //        initially.
        //
        // Note: the team name column (index 1) is used as a secondary sort column and
        // always sorted in ascending order.
        //-----------------------------------------------------------------------------
        
        // Get the table or table section to sort.
		 var rev = false,tempstr = "",tempstr2 = "",tempind	= 0,tempind2= 0,loopLength, cmpJSON = (JSONRef && JSONRef > "" && jsonList) ? true : false, imghtml, tmpEl, i, j, minVal, minIdx, testVal, cmp,cntr1,cnt1;
        loopLength = cmpJSON == true ? jsonList.length : tableDOM.rows.length;
		for (i = 0; i < loopLength ; i++) {
            // Assume the current row has the minimum value.
            minIdx = i;
            if (!cmpJSON) {
                if (tableDOM.rows[i].cells[col].childNodes && tableDOM.rows[i].cells[col].childNodes[0] && tableDOM.rows[i].cells[col].childNodes[0].innerHTML) 
                    minVal = tableDOM.rows[i].cells[col].childNodes[0].innerHTML;
                else 
                    minVal = tableDOM.rows[i].cells[col].innerHTML;
            }
            else {
				if (jsonList[i]) 
					minVal = (jsonList[i])[JSONRef];
				else {
					minVal = getVal(type);
					 jsonList[i]= {};
					 jsonList[i][JSONRef] = minVal;
					 jsonList[i].TABLE_ROW_ID= tableDOM.rows[i].id
				}
            }
            // Search the rows that follow the current one for a smaller value.
            for (j = i + 1; j < loopLength; j++) {
                if (!cmpJSON) {
                    if (tableDOM.rows[j].cells[col].childNodes && tableDOM.rows[j].cells[col].childNodes[0] && tableDOM.rows[j].cells[col].childNodes[0].innerHTML) 
                        testVal = tableDOM.rows[j].cells[col].childNodes[0].innerHTML;
                    else 
                        testVal = tableDOM.rows[j].cells[col].innerHTML;
                }
                else {
					if (jsonList[j]) 
						testVal = (jsonList[j])[JSONRef];
					else {
						testVal = getVal(type);
						(jsonList[j]) = {};
						(jsonList[j])[JSONRef] = testVal;
						 jsonList[j]["TABLE_ROW_ID"]= tableDOM.rows[j].id
					}
                }
            //    if (testVal > " ") {
                    cmp = compareValues(minVal, testVal, type);
					
                    // Negate the comparison result if the reverse sort flag is set.
                    cmp *= toggleCmp;
                    // If this row has a smaller value than the current minimum, remember its
                    // position and update the current minimum value.
                    if (cmp > 0) {
                        minIdx = j;
                        minVal = testVal;
                    }
            //    }
				
            }
            // By now, we have the row with the smallest value. Remove it from the
            // table and insert it before the current row.
            if (minIdx > i) {
				if(tableRowId){					
					cntr1 = 0;
					tempind		= 0;
					tempind2	= 0;
					cnt1 = tableRowId.length;
					if (jsonList[i].TABLE_ROW_ID) {
						tempstr = jsonList[i].TABLE_ROW_ID;
						tempind = 1;
					}
					else{
						tempstr = "";
					}
					if (jsonList[minIdx].TABLE_ROW_ID) {
						tempstr2 = jsonList[minIdx].TABLE_ROW_ID;
						tempind2 = 1;
					}
					else{
						tempstr2 = "";
					}
					for(cntr1 = 0; cntr1 < cnt1; cntr1++){
						if (tempind == 0) {
							tempstr += "_";
							tempstr += (jsonList[i])[tableRowId[cntr1]];
						}
						if (tempind2 == 0) {
							tempstr2 += "_";
							tempstr2 += (jsonList[minIdx])[tableRowId[cntr1]];
						}
					}			
                	tmpEl = tableDOM.removeChild(_g(tempstr2));
                	tableDOM.insertBefore(tmpEl,_g(tempstr));
				}
				else{										
                	tmpEl = tableDOM.removeChild(tableDOM.rows[minIdx]);
                	tableDOM.insertBefore(tmpEl, tableDOM.rows[i]);
				}
            	
                if (cmpJSON) {
						tmpEl = jsonList.splice(minIdx, 1);
						jsonList.splice(i, 0, tmpEl[0]);
                }
			}
            
        }
		
        toggleCmp *= -1;
    }
    function compareValues(v1, v2, type){
        if (type == "date") {
            var date1 = v1.split("/");
            var date2 = v2.split("/");
            var tempdate1 = new Date();
            var tempdate2 = new Date();
            var dttmdiff = new Date();
            tempdate1.setFullYear(date1[2], date1[0] - 1, date1[1]);
            tempdate2.setFullYear(date2[2], date2[0] - 1, date2[1]);
            dttmdiff.setTime(tempdate1.getTime() - tempdate2.getTime());
            timediff = dttmdiff.getTime();
            days = Math.floor(timediff / (1000 * 60 * 60 * 24));
            if (days > 0) 
                return 1;
            else 
                if (days == 0) 
                    return 0;
        }
        else 
            if (type == "numeric") {
                if (parseInt(v1) == parseInt(v2)) 
                    return 0;
                if (parseInt(v1) > parseInt(v2)) 
                    return 1
            }
            else {
                if (v1 == v2) 
                    return 0;
                if (v1 > v2) 
                    return 1
            }
        return -1;
    }
    // return API
    return {
		sort: function(JSONRef, colIndex, sortType){
			sortTable(JSONRef, colIndex, sortType);
		},
		sortMulti: function(us, u, vs, v, ws, w, xs, x, ys, y, zs, z){
			// us-zs: 1=asc, -1=desc.  u-z: column-numbers.  See example
			try {
				var loopLength = tableDOM.rows.length, i, j, jsonObj1, jsonObj2, tmpEl;
				for (i = 0; i < loopLength; i++) {
					jsonObj1 = jsonList[parseInt(jsonObj[tableDOM.rows[i].id])];
					for (j = i + 1; j < loopLength; j++) {
						jsonObj2 = jsonList[parseInt(jsonObj[tableDOM.rows[j].id])];
						switch (Sortmulti(jsonObj1, jsonObj2)*toggleCmp) {
							case -1:
								tmpEl = tableDOM.removeChild(tableDOM.rows[j]);
								tableDOM.insertBefore(tmpEl, tableDOM.rows[i]);
								break;
							case 1:
								tmpEl = tableDOM.removeChild(tableDOM.rows[i]);
								tableDOM.insertBefore(tmpEl, tableDOM.rows[j]);
								break;
						}
					}
				}
				toggleCmp *= -1
			} 
			catch (e) {
				alert("i -> "+i+"  j ->"+ j+" jsonList.length - >"+jsonList.length+" jsonObj1['MICRO_FLAG'] ->"+jsonObj1[u]+" jsonObj2['MICRO_FLAG'] ->"+jsonObj2[u])
			}
			
//			if (u == undefined) {
//				jsonList.sort(Sortsingle);
//			} // if this is a simple array, not multi-dimensional, ie, SortIt(jsonList,1): ascending.
//			else {
//				jsonList.sort(Sortmulti);
//				}
			
			function Sortsingle(a, b){
				var swap = 0;
				if (isNaN(a - b)) {
					if ((isNaN(a)) && (isNaN(b))) {
						swap = (b < a) - (a < b);
					}
					else {
						swap = (isNaN(a) ? 1 : -1);
					}
				}
				else {
					swap = (a - b);
				}
				return swap * us;
			}
			
			function Sortmulti(a, b){
			//	try{
				var swap = 0;
				if (isNaN(a[u] - b[u])) {
					if ((isNaN(a[u])) && (isNaN(b[u]))) {
						swap = (b[u] < a[u]) - (a[u] < b[u]);
					}
					else {
						swap = (isNaN(a[u]) ? 1 : -1);
					}
				}
				else {
					swap = (a[u] - b[u]);
				}
				/*
				if (!v || (v == undefined) || (swap != 0)) {
					alert("-")
					return swap * us;
				}
				else {
					if (isNaN(a[v] - b[v])) {
						if ((isNaN(a[v])) && (isNaN(b[v]))) {
							swap = (b[v] < a[v]) - (a[v] < b[v]);
						}
						else {
							swap = (isNaN(a[v]) ? 1 : -1);
						}
					}
					else {
						swap = (a[v] - b[v]);
					}
					if ((w == undefined) || (swap != 0)) {
						return swap * vs;
					}
					else {
						if (isNaN(a[w] - b[w])) {
							if ((isNaN(a[w])) && (isNaN(b[w]))) {
								swap = (b[w] < a[w]) - (a[w] < b[w]);
							}
							else {
								swap = (isNaN(a[w]) ? 1 : -1);
							}
						}
						else {
							swap = (a[w] - b[w]);
						}
						if ((x == undefined) || (swap != 0)) {
							return swap * ws;
						}
						else {
							if (isNaN(a[x] - b[x])) {
								if ((isNaN(a[x])) && (isNaN(b[x]))) {
									swap = (b[x] < a[x]) - (a[x] < b[x]);
								}
								else {
									swap = (isNaN(a[x]) ? 1 : -1);
								}
							}
							else {
								swap = (a[x] - b[x]);
							}
							if ((y == undefined) || (swap != 0)) {
								return swap * xs;
							}
							else {
								if (isNaN(a[y] - b[y])) {
									if ((isNaN(a[y])) && (isNaN(b[y]))) {
										swap = (b[y] < a[y]) - (a[y] < b[y]);
									}
									else {
										swap = (isNaN(a[y]) ? 1 : -1);
									}
								}
								else {
									swap = (a[y] - b[y]);
								}
								if ((z = undefined) || (swap != 0)) {
									return swap * ys;
								}
								else {
									if (isNaN(a[z] - b[z])) {
										if ((isNaN(a[z])) && (isNaN(b[z]))) {
											swap = (b[z] < a[z]) - (a[z] < b[z]);
										}
										else {
											swap = (isNaN(a[z]) ? 1 : -1);
										}
									}
									else {
										swap = (a[z] - b[z]);
									}
									return swap * zs;
								}
							}
						}
					}
				}*/
						
			}
		}
	}
}

function SortIt(jsonList, us, u, vs, v, ws, w, xs, x, ys, y, zs, z){
    // us-zs: 1=asc, -1=desc.  u-z: column-numbers.  See example
    
    if (u == undefined) {
        jsonList.sort(Sortsingle);
    } // if this is a simple array, not multi-dimensional, ie, SortIt(jsonList,1): ascending.
    else {
        jsonList.sort(Sortmulti);
    }
    
    function Sortsingle(a, b){
        var swap = 0; 
        if (isNaN(a - b)) {
            if ((isNaN(a)) && (isNaN(b))) {
                swap = (b < a) - (a < b);
            }
            else {
                swap = (isNaN(a) ? 1 : -1);
            }
        }
        else {
            swap = (a - b);
        }
        return swap * us;
    }
    
    function Sortmulti(a, b){
        var swap = 0;
        if (isNaN(a[u] - b[u])) {
            if ((isNaN(a[u])) && (isNaN(b[u]))) {
                swap = (b[u] < a[u]) - (a[u] < b[u]);
            }
            else {
                swap = (isNaN(a[u]) ? 1 : -1);
            }
        }
        else {
            swap = (a[u] - b[u]);
        }
        if ((v == undefined) || (swap != 0)) {
            return swap * us;
        }
        else {
            if (isNaN(a[v] - b[v])) {
                if ((isNaN(a[v])) && (isNaN(b[v]))) {
                    swap = (b[v] < a[v]) - (a[v] < b[v]);
                }
                else {
                    swap = (isNaN(a[v]) ? 1 : -1);
                }
            }
            else {
                swap = (a[v] - b[v]);
            }
            if ((w == undefined) || (swap != 0)) {
                return swap * vs;
            }
            else {
                if (isNaN(a[w] - b[w])) {
                    if ((isNaN(a[w])) && (isNaN(b[w]))) {
                        swap = (b[w] < a[w]) - (a[w] < b[w]);
                    }
                    else {
                        swap = (isNaN(a[w]) ? 1 : -1);
                    }
                }
                else {
                    swap = (a[w] - b[w]);
                }
                if ((x == undefined) || (swap != 0)) {
                    return swap * ws;
                }
                else {
                    if (isNaN(a[x] - b[x])) {
                        if ((isNaN(a[x])) && (isNaN(b[x]))) {
                            swap = (b[x] < a[x]) - (a[x] < b[x]);
                        }
                        else {
                            swap = (isNaN(a[x]) ? 1 : -1);
                        }
                    }
                    else {
                        swap = (a[x] - b[x]);
                    }
                    if ((y == undefined) || (swap != 0)) {
                        return swap * xs;
                    }
                    else {
                        if (isNaN(a[y] - b[y])) {
                            if ((isNaN(a[y])) && (isNaN(b[y]))) {
                                swap = (b[y] < a[y]) - (a[y] < b[y]);
                            }
                            else {
                                swap = (isNaN(a[y]) ? 1 : -1);
                            }
                        }
                        else {
                            swap = (a[y] - b[y]);
                        }
                        if ((z = undefined) || (swap != 0)) {
                            return swap * ys;
                        }
                        else {
                            if (isNaN(a[z] - b[z])) {
                                if ((isNaN(a[z])) && (isNaN(b[z]))) {
                                    swap = (b[z] < a[z]) - (a[z] < b[z]);
                                }
                                else {
                                    swap = (isNaN(a[z]) ? 1 : -1);
                                }
                            }
                            else {
                                swap = (a[z] - b[z]);
                            }
                            return swap * zs;
                        }
                    }
                }
            }
        }
    }
}
