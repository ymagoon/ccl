/**
 * @author JJ7138
 */
	 /*~BB~********************************************************************
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
	  *  (3) install the Script Source Code in Client�s environment.          *
	  *  B. Use of the Script Source Code is for Client�s internal purposes   *
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
	  *     Source Code prior to moving such code into Client�s production    *
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
	  *     performance of Client�s System.                                   *
	  *  C. Client waives, releases, relinquishes, and discharges Cerner from *
      *     any and all claims, liabilities, suits, damages, actions, or      *
	  *     manner of actions, whether in contract, tort, or otherwise which  *
	  *     Client may have against Cerner, whether the same be in            *
	  *     administrative proceedings, in arbitration, at law, in equity, or *
      *     mixed, arising from or relating to Client�s use of Script Source  *
	  *     Code.                                                             *
	  * 5. Retention of Ownership                                             *
	  *    Cerner retains ownership of all software and source code in this   *
	  *    service package. Client agrees that Cerner owns the derivative     *
	  *    works to the modified source code. Furthermore, Client agrees to   *
	  *    deliver the derivative works to Cerner.                            *
  ~BE~************************************************************************/
/******************************************************************************
 
        Source file name:       dc_mp_dm_common.js
 
        Product:                Discern Content
        Product Team:           Discern Content
 
        File purpose:           General JS file for functions for
                                Diabetes Management MPages.
 
        Special Notes:          <add any special notes here>
 
;~DB~*****************************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                    				 *
;*********************************************************************************************
;*                                                                           	 	 		 *
;*Mod Date     Engineer             	Feature      Comment                      			 *
;*--- -------- -------------------- 	------------ ----------------------------------------*
;*000 06/01/10 Jim Jensen               230340       Initial Release		 				 *
;~DE~*****************************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/
var curpage = 1;
var curpatientindex = -1;
var selPID = 0;
var popupWindowHandle;
var icon_comb_drop;
var bar1, bar2, bar3;
var timer1;
var whtSpEnds = new RegExp("^\\s*|\\s*$", "g");
var whtSpMult = new RegExp("\\s\\s+", "g");
var uid = 0;
var debug_ind = 0;
var initHeader = true;
var initPatients = true;
var initPatTxt;
var locArray = new Array();
var tbodyArray = new Array();
var hCounter = 0 ;
	
function initPage(){
	//Get parameters from the URL.
	var cur_params	=  window.location.search.replace(/%20/g, " ").split("?").join("").split(",");
	var filePath	= cur_params[0];
	uid 			= cur_params[1];
	debug_ind       = cur_params[2];
	if (debug_ind == 1){
		alert("Debug is ON.")
	}
	
	getAnimatedGIF();
	json_handler = new UtilJsonXml();
	js_load = true;
	getJSONPage("dc_mp_dm_page","'WKLST1'");
	getJSONPList("dc_mp_dm_tb_get_ptlist",uid);
}

function holdForProcessing(b){
//	alert(b);
	selPList.disabled = b;
	selFac.disabled = b;
	selUnit.disabled = b;
}

function getAnimatedGIF(){
	try{
		newImage = "url(" + ajaxLoader + ")";
    	document.getElementById("bodyDMTB").style.backgroundImage = newImage;
	}
	catch (error){
		showErrorMessage(error.message, "getAnimatedGIF");
	}
}

function getJSONPage(cclProg,sect){
	 try {
	 	var jsonTimerObj = new Timer();
		jsonTimerObj.TimerStart();
	 	cclParam = "'MINE'" + "," + sect;
    	var requestAsync = getXMLCclRequest();
    	requestAsync.onreadystatechange = function(){		
        	if (requestAsync.readyState == 4 && requestAsync.status == 200) {
				if (requestAsync.responseText > " ") {
					try {
						jsonTimerObj.TimerStop();
						jsonTimerObj.TimerReset();
						page_data = json_handler.parse_json(requestAsync.responseText); 
						json_handler.append_json(page_data); 
						if (debug_ind == 1){
							json_handler.launch_debug();
						}
                	} 
                	catch (error) {
                    	showErrorMessage(error.message, "Invalid JSON Format...getJSONPage");
                	}
            	}
				if (initHeader){
					initHeader = fillheaders("theadPlist");
					initHeader = fillheaders("theadOlist");
				}
        	}
    	};
        requestAsync.open("GET", cclProg);
        requestAsync.send(cclParam);
	} 
    catch (error) {
        showErrorMessage(error.message, "getJSONPage()")
    }
}

function getJSONPList(cclProg,uid){
	 try {
	 	var jsonTimerObj = new Timer();
		jsonTimerObj.TimerStart();
	 	cclParam = "'MINE'" + "," + uid;
    	var requestAsync = getXMLCclRequest();
    	requestAsync.onreadystatechange = function(){		
			if (requestAsync.readyState == 4 && requestAsync.status == 200) {
				if (requestAsync.responseText > " ") {
					try {
						jsonTimerObj.TimerStop();
						jsonTimerObj.TimerReset();
						pl_data = json_handler.parse_json(requestAsync.responseText); 
						json_handler.append_json(pl_data); 
                	} 
                	catch (error) {
                    	showErrorMessage(error.message, "Invalid JSON Format...getJSONPList");
                	}
					if (pl_data.LISTREPLY.LIST_CNT > 0){
						document.getElementById('ptListType_IV').checked = true;
						
						
						fillPtLists(pl_data.LISTREPLY,document.getElementById('selPList'));
						//Get stored "window.name" value.
						strStoredIndex = Windowstorage.get("StoredIndex");
						//Verify if the stored value is not undefined.
						
						if (strStoredIndex != 'undefined'){
							document.getElementById('selPList').selectedIndex = strStoredIndex;
							PList_change(strStoredIndex);
						}
						else{
							var mList = pl_data.LISTREPLY.PTLIST[0];
							getJSONPatients("dc_mp_dm_tb_get_pts",mList.LISTID,mList.LISTTYPECD,mList.DEFAULTLOCCD,mList.APPID);
						}
					}
					else{
						holdForProcessing(false);
					}
					
            	}
        	}
    	};
        requestAsync.open("GET", cclProg);
        requestAsync.send(cclParam);
	} 
    catch (error) {
        showErrorMessage(error.message, "getJSONPList()")
    }
}

function getJSONPatients(cclProg,lid,ltcd,llcd,aid){
	 try {
		holdForProcessing(true);
		hCounter = 0;
		var jsonTimerObj = new Timer();
		jsonTimerObj.TimerStart();
	 	cclParam = "'MINE'" + "," + lid + "," + ltcd + "," + llcd + "," + aid;
    	var requestAsync = getXMLCclRequest();
    	requestAsync.onreadystatechange = function(){		
			if (requestAsync.readyState == 4 && requestAsync.status == 200) {
				if (requestAsync.responseText > " ") {
					try {
						jsonTimerObj.TimerStop();
						jsonTimerObj.TimerReset();
						p_data = json_handler.parse_json(requestAsync.responseText);
						
						json_handler.append_json(p_data);
						if (debug_ind == 1){
							json_handler.launch_debug();
						} 
                	} 
                	catch (error) {
                    	showErrorMessage(error.message, "Invalid JSON Format...getJSONPatients");
                	}
					LoadPatients("tbodyPlist","tbodyOlist",curpage);
					pdArray = [];
					if (p_data.PTQ.PT_CNT == 0){
						holdForProcessing(false);
					}
					else{
						for (var p = 0; p < p_data.PTQ.PT_CNT; p++) {
							pdArray[p] = new Object();
							getJSONPatientDetails("dc_mp_dm_tb_details",
							                        p_data.PTQ.PATIENTS[p].PT_ID,
													p_data.PTQ.PATIENTS[p].ENCNTR_ID, 
													pdArray[p],
													p_data.PTQ.PATIENTS[p].NAME);
						}
					}
					document.getElementById("bodyDMTB").style.backgroundImage = "none";
            	}
        	}
    	};
        requestAsync.open("GET", cclProg);
        requestAsync.send(cclParam);
	} 
    catch (error) {
        showErrorMessage(error.message, "getJSONPatients()");
    }
}

function getJSONPatientDetails(cclProg,pid,eid,pobj,name){
	 try {
		var data;
		var jsonTimerObj = new Timer();
		jsonTimerObj.TimerStart();
		cclParam = "'MINE'" + "," + pid + "," + eid;
		var requestAsync = getXMLCclRequest();
		requestAsync.onreadystatechange = function(){
			if (requestAsync.readyState == 4 && requestAsync.status == 200) {
				if (requestAsync.responseText > " ") {
					try {
						jsonTimerObj.TimerStop();
						jsonTimerObj.TimerReset();
						pobj = json_handler.parse_json(requestAsync.responseText);
						fillPatientCell(pobj.D_DATA);
						json_handler.append_text("***************************************************************************<BR>");
						json_handler.append_text(name);
						json_handler.append_json(pobj);
						if (debug_ind == 1){
							json_handler.launch_debug();
						} 
					} 
					catch (error) {
						showErrorMessage(error.message, "Invalid JSON Format...getJSONPatientDetails");
					}
					document.getElementById("bodyDMTB").style.backgroundImage = "none";
				}
			}
		};
		requestAsync.open("GET", cclProg);
		requestAsync.send(cclParam);
	} 
    catch (error) {
        showErrorMessage(error.message, "getJSONPatientDetails()");
    }
}

function fillPatientCell(d){
	var row = document.getElementById(d.ENCNTR_ID);	
	for (var num = 0; num < page_data.DM_COMP.COMPONENT_CNT; num++) {
		switch (page_data.DM_COMP.COMPONENTS[num].CSECT) {
			case "STAT":
				var curdate = new Date();
				var taskdate = new Date(d.TASK_SDTTM);
				if (taskdate < curdate) {
//					row.cells[num].innerHTML = buildAdvsrLink(d.PT_ID, d.ENCNTR_ID, img_alert);
					row.cells[num].innerHTML = img_alert;
					row.cells[num].className = "imgtablecell";
				}
				else {
//					row.cells[num].innerHTML = buildAdvsrLink(d.PT_ID, d.ENCNTR_ID, img_good);
					row.cells[num].innerHTML = img_good;
					row.cells[num].className = "imgtablecell";
				}
				break;
				
			case "DUE":
				row.cells[num].innerHTML = d.TASK_SDTTM;
				break;
				
			case "TI":
				if (row.type == 1){
					row.cells[num].innerHTML = d.TOTAL_INS.toFixed(2);
				}
				break;
				
			case "RATE":
				if (row.type == 1) {
					row.cells[num].innerHTML = d.CURRATE;
				}
				break;
				
			case "MRBG":
				row.cells[num].innerHTML = d.BG_MR;
				row.cells[num].title = "Documented:  " + d.BG_MR_SDTTM;
				break;
				
			default:
				var test = false;		
		}
	}
	hCounter = hCounter + 1;
	if (hCounter == p_data.PTQ.PT_CNT-1){
//		alert("hCounter = " + hCounter + "\np_data.PTQ.PT_CNT = " + p_data.PTQ.PT_CNT);
		holdForProcessing(false);
	}
	return(true);
}

function fillPtLists(jobj,sobj){
	try{
        var mCnt = jobj.LIST_CNT;
        for (var i = 0; i < mCnt; i++) {
            // Fill in Patient List Box
            var o = document.createElement("option");
            var s = String(jobj.PTLIST[i].LISTNM);
            o.text = s;
            o.value = String(jobj.PTLIST[i].LISTID);
            sobj.add(o);
        }
        sobj.selectedIndex = 0;
	}
	catch(error){
		showErrorMessage(error.message, "fillPtLists(jobj,sobj)");
	}
}

function getJSONLastDose(cclProg,oid,d,i){
	 try {
	 	var jsonTimerObj = new Timer();
		var jobj;
		jsonTimerObj.TimerStart();
	 	cclParam = "'MINE'" + "," + oid;
    	var requestAsync = getXMLCclRequest();
    	requestAsync.onreadystatechange = function(){		
			if (requestAsync.readyState == 4 && requestAsync.status == 200) {
				if (requestAsync.responseText > " ") {
					try {
						jsonTimerObj.TimerStop();
						jsonTimerObj.TimerReset();
						jobj = json_handler.parse_json(requestAsync.responseText); 
						if (i == 0) {
							d.innerHTML = jobj.LD.LASTDOSE_AMT;
							if (jobj.LD.LASTDOSE_DTTM.length > 0) {
								d.innerHTML += " (<i>" + jobj.LD.LASTDOSE_DTTM + "</i>)";
							}
						}
						else {
							d.innerHTML += "<BR><BR>" + jobj.LD.LASTDOSE_AMT;
							if (jobj.LD.LASTDOSE_DTTM.length > 0) {
								d.innerHTML += " (<i>" + jobj.LD.LASTDOSE_DTTM + "</i>)";
							}
						}
						json_handler.append_json(jobj); 
						if (debug_ind == 1){
							json_handler.launch_debug();
						}
                	} 
                	catch (error) {
                    	showErrorMessage(error.message, "Invalid JSON Format...getJSONPList");
                	}
					
            	}
        	}
    	};
        requestAsync.open("GET", cclProg);
        requestAsync.send(cclParam);
	} 
    catch (error) {
        showErrorMessage(error.message, "getJSONPList()")
    }
}

function Browser(){
    var ua, s, i;
    this.isIE = false;
    this.isNS = false;
    this.version = null;
    ua = navigator.userAgent;
    s = "MSIE";
    if ((i = ua.indexOf(s)) >= 0) {
        this.isIE = true;
        this.version = parseFloat(ua.substr(i + s.length));
        return;
    }
}

function showErrorMessage(errorMessage, functionName){
	var completeErrorMessage = "Error Message: " + errorMessage + "\n Function: " + functionName;
	alert (completeErrorMessage);
}
function getBrowserName(){
	//Validate Browser Name.
	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
		return "MSIE";
	}
	if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
		return "Firefox";
	}
}

var browser = new Browser();

var Timer = function(){
    this.Interval = 100;
    this.Enable = new Boolean(false);
    this.Tick;
    var timerId = 0;
    var thisObject;
    this.elapsed = 0;
    this.counter_interval = 1000;
    this.counterid;
    
    
    this.Start = function(){
        this.Enable = new Boolean(true);
        thisObject = this;
        if (thisObject.Enable) {
            thisObject.timerId = setInterval(function(){
                thisObject.Tick();
            }, thisObject.Interval);
        }
    };
    this.Stop = function(){
        thisObject.Enable = new Boolean(false);
        clearInterval(thisObject.timerId);
    };
    
    this.TimerStart = function(){
        thisObject = this;
        thisObject.counterid = setInterval(function(){
            thisObject.elapsed += thisObject.counter_interval
        }, thisObject.counter_interval);
    };
    this.TimerStop = function(){
        clearInterval(thisObject.counterid);
    };
    this.TimerReset = function(){
        thisObject.elapsed = 0;
    }
    
};

function setSort(id){
	var tag = page_data.DM_COMP.COMPONENTS[id].CSECT;
	var body;
	if (document.getElementById('ptListType_IV').checked == true){ 
		body = 'tbodyPlist';
	}
	else{
		body = 'tbodyOlist';
	}		
	
	if (tag == 'NAME' || tag == 'LOC') {
		sortTable(body, id, 'alpha', false);
	}
	if (tag == 'ALIAS' || tag == 'LOS'){
		sortTable(body, id, 'numeric', false);
	}
	if (tag == 'DUE' || tag == 'AGE'){
		if (tag == 'AGE'){
			sortTable(body, page_data.DM_COMP.COMPONENT_CNT-2, 'date', true);
		}
		else{
			sortTable(body, id, 'date', true);
		}
	}	
}

function fillheaders(tabid){
	try {
		var timerFillHeaders = new Timer();
		timerFillHeaders.TimerStart();
		var tableobj = document.getElementById(tabid);
		var newrow;
		var expr;
		var pct,tag;
		var nSort = 0;
		var nType = 'alpha';
		var bSort = false;
		var bCnt  = 0;
		var ctot = page_data.DM_COMP.COMPONENT_CNT-2;
		
		if (tableobj.rows.length == 0) {
			if (browser.isIE) {
				newrow = tableobj.insertRow();
			}
			else {
				newrow = tableobj.insertRow(0);
			}
			
			if (tabid == 'theadPlist'){
				newrow.id = 'pHEADROW';
			}
			else{
				newrow.id = 'oHEADROW';
			}
		}
		for (var ccnt = 0; ccnt <= ctot; ccnt++) {
			bCnt = ccnt;
			expr = document.createElement("span");
			expr.innerHTML = "|";
			tag = page_data.DM_COMP.COMPONENTS[ccnt].CSECT;
			expr.id = tableobj.id + "head_" + tag;
			
			if (browser.isIE) {
				newrow.insertCell();
			}
			else {
				newrow.insertCell(ccnt);
			}
			newrow.cells[ccnt].id = ccnt;
			newrow.cells[ccnt].className = "tableheader";
			if (ccnt < ctot){
				nSort = page_data.DM_COMP.COMPONENTS[ccnt].CSEQNBR-1;
				tag = page_data.DM_COMP.COMPONENTS[ccnt].CSECT;
				newrow.cells[ccnt].tag = tag;
				if (tag == 'NAME' || tag == 'LOC' || tag == 'ALIAS' || tag == 'LOS' || tag == 'DUE' || tag == 'AGE'){
					newrow.cells[ccnt].title = "Sort By " + page_data.DM_COMP.COMPONENTS[ccnt].CLBL;
					newrow.cells[ccnt].style.cursor = "pointer";
					newrow.cells[ccnt].className = "sortHead";
					newrow.cells[ccnt].onclick = function(){
						setSort(this.id);
					};
				}
				else{
					newrow.cells[ccnt].style.cursor = "default";
				}
				
				if (tabid == 'theadOlist') {
					if (tag == 'TI') {
						bCnt = ctot;
					}
					if (tag == 'RATE') {
						bCnt = ctot+1;
					}
				}
				pct = String(page_data.DM_COMP.COMPONENTS[bCnt].CFLAG) + "%";
				newrow.cells[ccnt].style.width = pct;
				newrow.cells[ccnt].innerHTML = page_data.DM_COMP.COMPONENTS[bCnt].CLBL;	
					
				
			}
			else{
				newrow.cells[ccnt].style.width = "0.000%";
				newrow.cells[ccnt].style.display = "none";
				newrow.cells[ccnt].innerHTML = "DOB";
				newrow.cells[ccnt].tag ="DOB";
			}
		}
		if (tabid == "theadOlist"){
			document.getElementById()
		}
		timerFillHeaders.TimerStop();
		return(false);
	}
	catch (error) {
        showErrorMessage(error.message, "fillheaders("+tabid+")");
    }
}

function LoadPatients(tbody,obody,page){
	try{
		var timerLoadPatients = new Timer();
		timerLoadPatients.TimerStart();
		var tObj,fbody;
		var sdata 	= " ";
		var alink;
		var formatstr;
		var newrow;
		var txt_cell;
		var ind_img = 0;
		var ind_wrap= 0;
		var rMin	= page-1;
		var rMax 	= page*25;
		var myCnt 	= p_data.PTQ.PT_CNT;
		var pCnt    = p_data.PTQ.PCNT;
		var oCnt    = p_data.PTQ.OCNT;
		
		if (pCnt == 0){
			tObj = document.getElementById(tbody);
			fbody = tbody;
			newrow = tObj.insertRow();
			newrow.id = -1;
			newrow.colSpan = page_data.DM_COMP.COMPONENT_CNT - 1;
			newrow.backg = "rgb(255,255,255)";
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = "<b><i>None found.<i><b>";
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
		}
		if (oCnt == 0){
			tObj = document.getElementById(obody);
			fbody = obody;
			newrow = tObj.insertRow();
			newrow.id = -1;
			newrow.colSpan = page_data.DM_COMP.COMPONENT_CNT - 1;
			newrow.backg = "rgb(255,255,255)";
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = "<b><i>None found.<i><b>";
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
			newrow.insertCell().innerHTML = '';
		}
		
		for (var j=0;j<myCnt;j++){
			if (p_data.PTQ.PATIENTS[j].PTQUALIND == 1){
				tObj = document.getElementById(tbody);
				fbody = tbody;
			}
			else{
				tObj = document.getElementById(obody);
				fbody = obody;				
			}
			
			if(browser.isIE){
				newrow = tObj.insertRow();
			}				
			else{
				newrow = tObj.insertRow(j+1);
			}

			newrow.colSpan  = page_data.DM_COMP.COMPONENT_CNT + 1;
			if ((tObj.rows.length) % 2 == 0) {
				newrow.className = 'RowTypeWhite';
				newrow.backg = "rgb(255,255,255)";
			}
			else {
				newrow.className = 'RowTypeBlue';
				newrow.backg = "rgb(245,247,251)";
			}
			var eObj = p_data.PTQ.PATIENTS[j];

			ind_img = 0;
			ind_wrap = 0;
			txt_cell = " ";
	        newrow.id       = eObj.ENCNTR_ID;
			newrow.pid		= eObj.PT_ID;
			newrow.eid		= eObj.ENCNTR_ID;
			newrow.type     = eObj.PTQUALIND;
			newrow.unit		= eObj.NURSE_UNIT;
			newrow.facility = eObj.FACILITYCD;
			newrow.cnt      = j;
			addLoc(eObj);
			if (browser.isIE) {
				for (var o=0;o<page_data.DM_COMP.COMPONENT_CNT;o++){
					if (initPatients){
						initFillPatientCell(newrow.cells.length,eObj,newrow)
					}
				}
				newrow.insertCell().innerHTML = eObj.BIRTHDTJS;
				newrow.cells[newrow.cells.length-1].style.width   = "0.000%";
				newrow.cells[newrow.cells.length-1].style.display = "none";
				
			}
			else {
				newrow.insertCell(j - 1).innerHTML = img_alert;
				newrow.insertCell(j - 1).innerHTML = buildChartLink(eObj.PNAME,eObj.PID,eObj.EID,page_data.DM_COMP.MPAGE_LINK,page_data.DM_COMP.MPAGE_HOVER);
				newrow.insertCell(j - 1).innerHTML = eObj.AGE;
				newrow.insertCell(j - 1).innerHTML = eObj.MRN;
				newrow.insertCell(j - 1).innerHTML = eObj.NURSE_UNIT;
				newrow.insertCell(j - 1).innerHTML = eObj.LOS;
				newrow.insertCell(j - 1).innerHTML = eObj.TASK_SDTTM;
				newrow.insertCell(j - 1).innerHTML = eObj.TOTAL_INS.toFixed(2);
				newrow.insertCell(j - 1).innerHTML = eObj.CURRATE;
				newrow.insertCell(j - 1).innerHTML = eObj.BG_MR;
				newrow.insertCell(j - 1).innerHTML = eObj.BIRTHDTJS;
			}
			newrow.onmouseover = function(){
				curelement = event.srcElement
				while (curelement.className != 'RowTypeWhite' && curelement.className != 'RowTypeBlue') {
					curelement = curelement.parentNode;
				}
				if (curelement.pid == selPID){
					curelement.style.background = "#66FF66";
				}
				else{
					curelement.style.background = "rgb(153,204,255)";
				}
			}
			newrow.onmouseout = function(){
				curelement = event.srcElement;
				var cln = curelement.className;
				while (curelement.className != 'RowTypeWhite' && curelement.className != 'RowTypeBlue') {
					curelement = curelement.parentNode;
				}
				if(!curelement.active  && curelement.pid != curpatientindex){
					curelement.style.background = curelement.backg;
				}
				formatrows(tbody);
				formatrows(obody);
				
			}
			newrow.onclick = function(){
				curelement = event.srcElement;						
				curelement = curelement.parentNode;
				if(curpatientindex > -1){ 
					curpatientindex = -1;
				}
				curpatientindex = curelement.rowIndex;
				curpatientindex = curelement.rowIndex;
				selPID = curelement.pid;
				formatrows(tbody);
				formatrows(obody);
				
			}
		}
		initPatients = false;
		formatrows(tbody);
		formatrows(obody);
		timerLoadPatients.TimerStop();
		
		fillLists();
		setLists();
		document.getElementById('spLoad').style.display		= 'none';
		
		document.getElementById('spPLIV').style.display 	= "";
		document.getElementById('spIVCnt').innerHTML 		= "(<i>"+pCnt+"</i>)";
		document.getElementById('spPLO').style.display 		= "";
		document.getElementById('spOCnt').innerHTML 		= "(<i>"+oCnt+"</i>)";
	}
	catch (error) {
        showErrorMessage(error.message, "LoadPatients("+tbody+","+obody+","+page+")");
    }	
}

function initFillPatientCell(num,e,row){
	var pct = String(page_data.DM_COMP.COMPONENTS[num].CFLAG)+'%';
	var m = new Array();
	var temp = '';
	switch (page_data.DM_COMP.COMPONENTS[num].CSECT){
		case "STAT":
			row.insertCell().innerHTML = '';
			break;
		
		case "NAME":
			row.insertCell().innerHTML 	= buildChartLink(e.NAME,e.PT_ID,e.ENCNTR_ID,page_data.DM_COMP.MPAGE_LINK,page_data.DM_COMP.MPAGE_HOVER);
			break;
		
		case "AGE":
			row.insertCell().innerHTML 	= e.AGE;
			row.cells[num].title	   	= "Date of Birth:  " + e.BIRTHDTJS;
			break;
		
		case "ALIAS":
			row.insertCell().innerHTML 	= e.MRN;
			if (e.FIN.length > 0){
				row.cells[num].title	= "FIN:  " + e.FIN;
			}
			break;
		
		case "LOC":
			row.insertCell().innerHTML 	= e.NURSE_UNIT;
			break;
		
		case "LOS":
			row.insertCell().innerHTML 	= e.LOS.toFixed(0);
			row.cells[num].title		= "Admitted:  " + e.ADMITDTJS;
			if (e.DISCHDTJS.length > 0){
				 row.cells[num].title  += "\nDischarged:  " + e.DISCHDTJS
			}
			break;
		
		case "DUE":
			row.insertCell().innerHTML 	= '';
			break;
		
		case "TI":
			row.insertCell().innerHTML 	= '';
			if (e.ORDERCNT > 0){
				for (var oc=0;oc<e.ORDERCNT;oc++){
					if (oc == 0){
						row.cells[num].innerHTML = e.ORDERS[oc].ORDER_MNEM;
						if (e.ORDERS[oc].ORDER_DET.length > 0) {
							row.cells[num].innerHTML += " (<i>" + e.ORDERS[oc].ORDER_DET + "</i>)";
						}
					}
					else{
						row.cells[num].innerHTML += "<BR><BR>" + e.ORDERS[oc].ORDER_MNEM;
						if (e.ORDERS[oc].ORDER_DET.length > 0) {
							row.cells[num].innerHTML += " (<i>" + e.ORDERS[oc].ORDER_DET + "</i>)";
						}
					}	
				}	
			}
			break;
		
		case "RATE":
			row.insertCell().innerHTML 	= '';
			if (e.ORDERCNT > 0){
				for (var dg=0;dg<e.ORDERCNT;dg++){
					m[dg] = new Object();
					m[dg].dose = '';
					m[dg].dttm = '';
					m[dg].disp = '';
					getJSONLastDose('dc_mp_dm_tb_lastdose',e.ORDERS[dg].ORDER_ID, row.cells[num],dg);

				}	
			}
			break;
		
		case "MRBG":
			row.insertCell().innerHTML 	= '';
			break;
		
		default:
			return;	
	}
	row.cells[num].style.width = pct;
}

function addLoc(e){
	var bf = true;
	var bn = true;
	var n = 0;
	var c = locArray.length;
    if (c>0){
		for (i=0;i<c;i++){
			if (locArray[i].fac_cd == e.FACILITYCD && bf){
				bf = false;
				n = i;
			}
		}
	}
	if (bf){
		locArray[c]	= new Object();
		locArray[c].fac 			= e.FACILITY;
		locArray[c].fac_cd 			= e.FACILITYCD;
		locArray[c].type            = e.PTQUALIND;
		locArray[c].units			= new Array();
		locArray[c].units[0]		= new Object();
		locArray[c].units[0].unit 	= e.NURSE_UNIT;
		locArray[c].units[0].type   = e.PTQUALIND;
	}
	else{
		var u = locArray[n].units.length;
		for (i=0;i<u;i++){
			if (locArray[n].units[i].unit == e.NURSE_UNIT && bn){
				bn = false;
			}
		}
		if (bn){
			locArray[n].units[u]		= new Object();
			locArray[n].units[u].unit 	= e.NURSE_UNIT;
			locArray[n].units[u].type 	= e.PTQUALIND;
		}
	}
}

function buildChartLink(name,pid,eid,tab,title){
    var alink = 'javascript:APPLINK(0,"powerchart.exe","/PERSONID='+pid+' /ENCNTRID='+eid+' /FIRSTTAB='+tab+'");';
    return ("<a title=\""+title+"\" href='"+alink+"'>"+name+"</a>");
}

function buildAdvsrLink(pid,eid,img){
	var r = "<span onclick='javascript:setCallSync("+pid+","+eid+");' style='cursor:pointer;cursor:hand'>"+img+"</span>";
	return(r);
}

function setCallSync(pid,eid){
	var wParams;
	var window_top = 0;
	var window_left = 0;
	var window_height = 0;
	var window_width = 0;
						
	if(window.innerHeight && window.innerWidth){
		window_height	= window.innerHeight;
		window_width	= window.innerWidth; 
	}
	else if(document.documentElement.clientHeight && document.documentElement.clientWidth){
		window_height	= document.documentElement.clientHeight;
		window_width	= document.documentElement.clientWidth;
	}
	else if(document.body.clientHeight && document.body.clientWidth){
		window_height	= document.body.clientHeight;
		window_width	= document.body.clientWidth;
	}
	window_top = (window_height*(100 - page_data.DM_COMP.ADVSR_H)/100);
	window_left =  (window_width*(100 - page_data.DM_COMP.ADVSR_W)/100);
	window_height = (window_height*(page_data.DM_COMP.ADVSR_H)/100);
	window_width =  (window_width*(page_data.DM_COMP.ADVSR_W)/100);
	var rule = "javascript:CCLLINK('eks_call_synch_event', '"+getParams(pid,eid)+"',1);";
	wParams	= "fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=no,left="+window_left+",top="+window_top+",width="+window_width+",height="+window_height;
	
	
	CCLNEWSESSIONWINDOW(rule,'_blank',wParams,0,1);
}

function getParams(pid,eid){
	var params = '^MINE^,^';
	params += (pid + "^,");
	params += ("^"+ eid + "^,");
	params += ("^0.0^,^" + page_data.DM_COMP.ADVSR_TRIGGER + "^,^"+uid);
	params += '^';
	return params;
}
						
function formatrows(tableid){
	try{
		var tableObj = document.getElementById(tableid);
		var rMin = curpage-1;
		var rMax = curpage*25;
		var cntr = 0;
		for (var j = 0; j < tableObj.rows.length; j++) {
			if (tableObj.rows[j].style.display != "none"){
				if ((cntr+1) % 2 == 0) {
					tableObj.rows[j].className = "RowTypeWhite";
					if (tableObj.rows[j].pid == selPID) {
						tableObj.rows[j].style.background = "#66FF66";
						tableObj.rows[j].style.backg = "#66FF66";
					}
					else {
						tableObj.rows[j].style.background = "rgb(255,255,255)";
						tableObj.rows[j].backg = "rgb(255,255,255)";
					}
				}
				else {
					tableObj.rows[j].className = "RowTypeBlue";
					if (tableObj.rows[j].pid == selPID) {
						tableObj.rows[j].style.background = "#66FF66";
						tableObj.rows[j].style.backg = "#66FF66";
					}
					else {
						tableObj.rows[j].style.background = "rgb(228,238,255)";
						tableObj.rows[j].backg = "rgb(228,238,255)";
					}
				}
				cntr++;
			}
		}
	}
	catch (error){
		showErrorMessage(error.message, "formatrows("+tableid+")");
	}		
}

function fillLists(){
	try{
		var timerFillLists = new Timer();
		timerFillLists.TimerStart();
		if (document.getElementById('ptListType_IV').checked == true){
			var el = 1; 
		}
		else{
			var el = 2;
		}
		
		var fSpan = document.getElementById('spFac');
		var uSpan = document.getElementById('spUnit');
		
		var fCnt = locArray.length;
		for (var i=0;i<fCnt;i++){
			// Fill in Facility List Box
			if (i == 0 && fCnt > 1){
				var blankOption		= document.createElement("option");
				blankOption.text 	= 'All';
				blankOption.value	= i;
				this.document.getElementById('selFac').add(blankOption);
			} 
			var o 	= document.createElement("option");
			//var s   = String(org_data.OLIST.FQUAL[i].FNAME);
			var s   = String(locArray[i].fac);
			o.text	= s;
			//o.value	= org_data.OLIST.FQUAL[i].FCD;
			o.value	= locArray[i].fac_cd;
			document.getElementById('selFac').add(o);
			
			if (i == 0 && locArray[i].units.length > 1){
				var blankOption = document.createElement("option");
				blankOption.text = 'All';
				blankOption.value = 0;
				document.getElementById('selUnit').add(blankOption);
			}
			if (locArray[i].units.length > 0){
				AddFacUnits(locArray[i]);
			}
		}
		if (document.getElementById('selFac').length == 0){
			fSpan.style.display = 'none';
			uSpan.style.display = 'none';
			document.getElementById('spFacH').style.display		= 'none';
			document.getElementById('spUnitH').style.display	= 'none';
		}
		else{
			document.getElementById('spFacH').style.display		= '';
			fSpan.style.display = '';
			document.getElementById('spUnitH').style.display	= '';
			uSpan.style.display = '';
		}
		timerFillLists.TimerStop();
	}
	catch (error) {
        showErrorMessage(error.message, "fillLists()");
    }	
}

function AddFacUnits(fbj){
	var nuCnt = fbj.units.length;
	for (var j=0; j<nuCnt; j++) {
		// Fill in Nurse Unit List Box
		var oo = document.createElement("option");
		var ss = String(fbj.units[j].unit);
		oo.text = ss;
		oo.value = fbj.fac_cd;
		this.document.getElementById('selUnit').add(oo);
	}
}

function resetSelUnits(){
	var i;
	var fCnt 	= 0;
	var uCnt	= 0;
	var f		= document.getElementById('selUnit');
	var o 		= document.getElementById('selFac');
	if (f.length == 0){
		return(false);
	}
	var oIdx  	= o.selectedIndex;
	var oVal 	= o.options[oIdx].value;
	for (i = f.length-1;i>0;i--) {
	    f.remove(i);
  	}
	for (i=0;i<locArray.length;i++){
		if (oVal == locArray[i].fac_cd || oVal == 0){
			AddFacUnits(locArray[i]);
			fCnt = fCnt + 1;	
		}
	}
	
	return(true);
}

function resetUnits(){
	if (resetSelUnits()){
		resetList();
	}
	
}

function resetList(){
	var i,j;
	var b = false;
	var o		 = document.getElementById('selUnit');
	var oIdx 	 = o.selectedIndex;
	var oVal 	 = o.options[oIdx].text;
	if (document.getElementById('ptListType_IV').checked == true){
		var el = 1; 
		var tableObj = document.getElementById('tbodyPlist');
	}
	else{
		var el = 2;
		var tableObj = document.getElementById('tbodyOlist');
	}
	
	if (oIdx == 0){
		for(i=0;i<tableObj.rows.length;i++){
			b = false;
			for (j=1;j<o.length;j++) {
				if (  (tableObj.rows[i].unit == o.options[j].text && b == false) || tableObj.rows[i].id == -1 ){
					b = true;	
				}
			}
			if (b){
				tableObj.rows[i].style.display = "";
			}
			else{
				tableObj.rows[i].style.display = "none";
			}
  		}
	}
	else{
		for (i=0;i<tableObj.rows.length;i++){
			if (tableObj.rows[i].unit == oVal || oIdx == 0){
				tableObj.rows[i].style.display = "";
			}
			else{
				tableObj.rows[i].style.display = "none";
			}
		}
	}
		
	formatrows('tbodyPlist');
}

function PList_change(idx){
	getAnimatedGIF();
	document.getElementById('spPLIV').style.display = "none";
	document.getElementById('spPLO').style.display = "none";	
	removeRows('tbodyPlist','tbodyOlist');
	
	var i,elSel;
	elSel = document.getElementById('selFac');
	for (i = elSel.length-1;i>=0;i--) {
	    elSel.remove(i);
  	}
	
	elSel = document.getElementById('selUnit');
	for (i = elSel.length-1;i>=0;i--) {
	    elSel.remove(i);
  	}
	
	document.getElementById('spFacH').style.display		= 'none';
	document.getElementById('spFac').style.display		= 'none';
	document.getElementById('spUnitH').style.display	= 'none';
	document.getElementById('spUnit').style.display		= 'none';
	document.getElementById('spLoad').style.display		= '';
	
	locArray.clear();
	initPatients = true;
	var mList = pl_data.LISTREPLY.PTLIST[idx];
	getJSONPatients("dc_mp_dm_tb_get_pts",mList.LISTID,mList.LISTTYPECD,mList.DEFAULTLOCCD,mList.APPID);
	
}

function removeRows(tbody,obody){
	var tObj = document.getElementById(tbody);
	var rows = tObj.rows; 
    while(rows.length) // length=0 -> stop 
        tObj.deleteRow(rows.length-1); 
		
	tObj = document.getElementById(obody);
	rows = tObj.rows; 
    while(rows.length) // length=0 -> stop 
        tObj.deleteRow(rows.length-1);
}

function ptListType_Click(el){
	var p  		= document.getElementById('tbodyPlist');
	var o 		= document.getElementById('tbodyOlist');
	var ph 		= document.getElementById('theadPlist');
	var oh 		= document.getElementById('theadOlist');
	var pCnt    = p_data.PTQ.PCNT;
	var oCnt    = p_data.PTQ.OCNT;
	if (el == 'ptListType_IV'){
		ph.style.display	= '';
		p.style.display		= '';
		oh.style.display	= 'none';
		o.style.display		= 'none';
		if (pCnt > 0){
			document.getElementById('spFacH').style.display		= '';
			document.getElementById('spFac').style.display		= '';
			document.getElementById('spUnitH').style.display	= '';
			document.getElementById('spUnit').style.display		= '';
		}
		else{
			document.getElementById('spFacH').style.display		= 'none';
			document.getElementById('spFac').style.display		= 'none';
			document.getElementById('spUnitH').style.display	= 'none';
			document.getElementById('spUnit').style.display		= 'none';
		}
	}
	if (el == 'ptListType_Other'){
		ph.style.display	= 'none';
		p.style.display		= 'none';
		oh.style.display	= '';
		o.style.display		= '';
		if (oCnt > 0){
			document.getElementById('spFacH').style.display		= '';
			document.getElementById('spFac').style.display		= '';
			document.getElementById('spUnitH').style.display	= '';
			document.getElementById('spUnit').style.display		= '';
		}
		else{
			document.getElementById('spFacH').style.display		= 'none';
			document.getElementById('spFac').style.display		= 'none';
			document.getElementById('spUnitH').style.display	= 'none';
			document.getElementById('spUnit').style.display		= 'none';
		}
	}
	resetUnits();
	setLists();
}

function setLists(){
	if (document.getElementById('ptListType_IV').checked == true){
		var el = 1; 
		var tableObj = document.getElementById('tbodyPlist');
	}
	else{
		var el = 2;
		var tableObj = document.getElementById('tbodyOlist');
	}		
	
	var i,j,elSel,bRemove;
	elSel = document.getElementById('selFac');
	for (i = elSel.length-1;i>=0;i--) {
		bRemove = true;
	    for (j=0;j<tableObj.rows.length;j++){
			if (tableObj.rows[j].facility == elSel.options[i].text || i == 0 || bRemove == false){
				bRemove = false;
			}
		}
		if (bRemove){
			elSel.remove(i);
		}
  	}
	
	elSel = document.getElementById('selUnit');
	for (i = elSel.length-1;i>=0;i--) {
		bRemove = true;
	    for (j=0;j<tableObj.rows.length;j++){
			if (tableObj.rows[j].unit == elSel.options[i].text || i == 0 || bRemove == false){
				bRemove = false;
			}
		}
		if (bRemove){
			elSel.remove(i);
		}
  	}
}

/**
* This function is called when the web page is "on unload". It will store a value in "window.name" that is used
* to determine which value that has been selected in the dropdown list Patient List.
*/
function refreshPage(){
	Windowstorage.set("StoredIndex",document.getElementById('selPList').selectedIndex);
	window.location.reload(true);
}

var Windowstorage ={
	cache: null,
	get: function(key) {
		if (window.name.length > 0){
			this.cache = eval("(" + window.name + ")");
		}
		else{
			this.cache = {};
		}
		return unescape(this.cache[key]);
	}, 
	encodeString: function(value) {
		return encodeURIComponent(value).replace(/'/g, "'");
	},
	set: function(key, value) {
		this.get();
		if (typeof key != "undefined" && typeof value != "undefined"){
			this.cache[key] = value;
		}
		var jsonString = "{";
		var itemCount = 0;
		for (var item in this.cache) {
			if (itemCount > 0){
				jsonString += ", ";
			}
			jsonString += "'" + this.encodeString(item) + "':'" + this.encodeString(this.cache[item]) + "'";
			itemCount++;
		}
		jsonString += "}";
		window.name = jsonString;
	},
	del: function(key) {
		this.get();
		delete this.cache[key];
		this.serialize(this.cache);
	},
	clear: function() {
		window.name = "";
	}
};
window.onunload = refreshPage;