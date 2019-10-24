/*~BB~*************************************************************************
      *                                                                       *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &         *
      *                              Technology, Inc.                         *
      *       Revision      (c) 1984-2010 Cerner Corporation                  *
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
	  *  (3) install the Script Source Code in Client’s environment.          *
	  *  B. Use of the Script Source Code is for Client’s internal purposes   *
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
	  *     Source Code prior to moving such code into Client’s production    *
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
	  *     performance of Client’s System.                                   *
	  *  C. Client waives, releases, relinquishes, and discharges Cerner from *
      *     any and all claims, liabilities, suits, damages, actions, or      *
	  *     manner of actions, whether in contract, tort, or otherwise which  *
	  *     Client may have against Cerner, whether the same be in            *
	  *     administrative proceedings, in arbitration, at law, in equity, or *
      *     mixed, arising from or relating to Client’s use of Script Source  *
	  *     Code.                                                             *
	  * 5. Retention of Ownership                                             *
	  *    Cerner retains ownership of all software and source code in this   *
	  *    service package. Client agrees that Cerner owns the derivative     *
	  *    works to the modified source code. Furthermore, Client agrees to   *
	  *    deliver the derivative works to Cerner.                            *
  ~BE~************************************************************************/
/******************************************************************************
 
        Source file name:       dc_mp_js_util_sort.js
 
        Product:                Discern Content
        Product Team:           Discern Content
 
        File purpose:           Sorting functions for tables.						
 
        Special Notes:          Calling Sort when user clicks on column header:
                                 sortTable('tbody', 1, "alpha", false);
                                 sortTable('tbody', 2, "date", false);
                                 sortTable('tbody', 3, "numeric", false);
 
;~DB~**********************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                    		  *
;**************************************************************************************
;*                                                                            		  *
;*Mod Date     Engineer             		Feature      Comment                      *
;*--- -------- -------------------- 		------------ -----------------------------*
;*000 02/02/10 JJ7138					    ######       Initial Release              *
;~DE~**********************************************************************************
;~END~ **********************  END OF ALL MODCONTROL BLOCKS  *************************/
function normalizeString(s) {
    s = s.replace(whtSpMult, " "); // Collapse any multiple whites space.
    s = s.replace(whtSpEnds, ""); // Remove leading or trailing white space.
    return (s);
}

function sortTable(id, col,type, rev) {
//	alert("id = " + id + "\ncol = " + col + "\ntype = " + type + "\nrev = "+ rev);
//-----------------------------------------------------------------------------
// sortTable(id, col, rev)
//
//  id   - ID of the TABLE, TBODY, THEAD or TFOOT element to be sorted.
//  col  - Index of the column to sort, 0 = first column, 1 = second column, etc.
//  type - Type of sort ("date","numeric","alpha"). Default is "alpha". 
//  rev  - If true, the column is sorted in reverse (descending) order initially.
//
// Note: column (index 1) is used as a secondary sort column and
// always sorted in ascending order.
//-----------------------------------------------------------------------------
	try {
		// Get the table or table section to sort.
		var tblEl = document.getElementById(id);
		// The first time this function is called for a given table, set up an
		// array of reverse sort flags.
		if (tblEl.reverseSort == null) {
			tblEl.reverseSort = new Array();
			// Also, assume the name column is initially sorted.
			tblEl.lastColumn = 1;
		}
		
		// If this column has not been sorted before, set the initial sort direction.
//		alert("tblEl.reverseSort["+col+"] = " + tblEl.reverseSort[col]);
		if (tblEl.reverseSort[col] == null) 
			tblEl.reverseSort[col] = rev;
		
		// If this column was the last one sorted, reverse its sort direction.
		if (col == tblEl.lastColumn) 
			tblEl.reverseSort[col] = !tblEl.reverseSort[col];
		
		// Remember this column as the last one sorted.
		tblEl.lastColumn = col;
		
		// Set the table display style to "none" - necessary for Netscape 6 browsers.
		var oldDsply = tblEl.style.display;
		//tblEl.style.display = "none";
		
		// Sort the rows based on the content of the specified column using a selection sort.
		
		var tmpEl;
		var i, j;
		var minVal, minIdx;
		var testVal;
		var cmp;
		
		for (i = 0; i < tblEl.rows.length; i++) {
			// Assume the current row has the minimum value.
			minIdx = i;
			minVal = getTextValue(tblEl.rows[i].cells[col]);
			
			// Search the rows that follow the current one for a smaller value.
			for (j = i + 1; j < tblEl.rows.length; j++) {
				
				testVal = getTextValue(tblEl.rows[j].cells[col]);
				
				cmp = compareValues(minVal, testVal, col, type);
				// Negate the comparison result if the reverse sort flag is set.
				if (tblEl.reverseSort[col]) 
					cmp = -cmp;
				// Sort by the first column (name) if those values are equal.
				if (cmp == 0 && col != tblEl.lastColumn) {
					cmp = compareValues(getTextValue(tblEl.rows[i].cells[1]), getTextValue(tblEl.rows[j].cells[1]), tblEl.lastColumn, type);
				}
				// If this row has a smaller value than the current minimum, remember its
				// position and update the current minimum value.
				if (cmp > 0) {
					minIdx = j;
					minVal = testVal;
				}
			}
			// By now, we have the row with the smallest value. Remove it from the
			// table and insert it before the current row.
			if (minIdx > i) {
				tmpEl = tblEl.removeChild(tblEl.rows[minIdx]);
				tblEl.insertBefore(tmpEl, tblEl.rows[i]);
			}
			if (minVal == ''){
				tmpEl = tblEl.removeChild(tblEl.rows[minIdx]);
				tblEl.insertBefore(tmpEl, tblEl.rows[0]);
			}
		}
		
		// UNCOMMENT THE FOLLOWING ROW to make it look pretty.
		// You will need to create a function to format your rows as you like.		
		formatrows(id);
		
		// Restore the table's display style.
		tblEl.style.display = oldDsply;
		
		return false;
	}
	catch (error){
		showErrorMessage(error.message, "sortTable("+id+", "+col+","+type+", "+rev+")");
	}
}

//-----------------------------------------------------------------------------
// Functions to get and compare values during a sort.
//-----------------------------------------------------------------------------
function getTextValue(el) {
	try {
		var i;
		var s;
		
		// Find and concatenate the values of all text nodes contained within the element.
		s = "";
		for (i = 0; i < el.childNodes.length; i++) 
			if (el.childNodes[i].nodeType == 3) 
				s += el.childNodes[i].nodeValue;
			else 
				if (el.childNodes[i].nodeType == 1 &&
				el.childNodes[i].tagName == "BR") 
					s += " ";
				else 
					// Use recursion to get text within sub-elements.
					s += getTextValue(el.childNodes[i]);
//		alert("getTextValue("+el+")...s = "+ s);
		return normalizeString(s);
	}
	catch (error){
		showErrorMessage(error.message, "getTextValue("+el+")");
	}
}

function compareValues(v1, v2,col,type) {
	// Sort by DATE
	if (type == "date") {
		var dttmdiff = new Date();
		var tempdate1 = new Date(v1);
		var tempdate2 = new Date(v2);
		dttmdiff.setTime(tempdate1.getTime() - tempdate2.getTime());
		timediff = dttmdiff.getTime();
		
		if (timediff > 0) {return 1;}
	 	if (timediff == 0){return 0;} 
	}
	// Sort by NUMERIC
	else if (type == "numeric")	{
		if (parseInt(v1) == parseInt(v2)) 
			return 0;
		if (parseInt(v1) > parseInt(v2))
			return 1;
	}
	// DEFAULT:  Sort by ALPHA
	else{
		var vu1 = v1.toUpperCase();
		var vu2 = v2.toUpperCase();
		
		if (vu1 == vu2) {
			return 0;
		}
		if (vu1 > vu2){
			return 1;
		}
	}
	return -1;
}
