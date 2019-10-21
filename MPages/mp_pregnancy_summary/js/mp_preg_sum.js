/*~BB~************************************************************************
*                                                                      *
*  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
*                              Technology, Inc.                        *
*       Revision      (c) 1984-2007 Cerner Corporation                 *
*                                                                      *
*  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
*  This material contains the valuable properties and trade secrets of *
*  Cerner Corporation of Kansas City, Missouri, United States of       *
*  America (Cerner), embodying substantial creative efforts and        *
*  confidential information, ideas and expressions, no part of which   *
*  may be reproduced or transmitted in any form or by any means, or    *
*  retained in any storage or retrieval system without the express     *
*  written permission of Cerner.                                       *
*                                                                      *
*  Cerner is a registered mark of Cerner Corporation.                  *
*                                                                      *
~BE~***********************************************************************/
/*
~DB~************************************************************************
    *                      GENERATED MODIFICATION CONTROL LOG              *
    ************************************************************************
    *                                                                      *
    *Mod Date     Feature	Engineer            Comment                             *
    *--- -------- -------	------------------- ----------------------------------- *
     ### 01/01/10 234971	Discern ABU         initial release			            *
	 001 03/15/10 234971	Sean Turk			general corrections from black box testing
	 002 08/09/10   --      Subash Katageri     renamed the script name to avoid    *
;										        passive change conflict with        *
;										        standard components					*
     003 08/09/10   --      Sreenivasan         Debug logging changes               *
                            Thirumalachar                                           *
	 004 07/29/10 259843	MT4217				CR: 1-4110609486: Fix issue where the re-open pregnancy button 
												throws an error if selected for a patient with no closed pregnancies.
	 005 07/30/10 259843	MT4217				CR: 1-4149785223: Fix issue where Age displays 
												incorrectly in the Overview component in Preg. Summary
												if the patient's birth date is within one week of the current date.
	 006 08/06/10 259843	MT4217				CR: 1-4163243451: Fix issue where The Assessment and Initial Physical Exam component's 
												may throw javascript errors if the Overview component has not loaded first.
     007 09/07/10 267995    MT4217				CR: 1-4191617783: Fix issue where an error message displays and FetaLink does not launch
												When selecting an archived strip and clicking the show button. 
	 008 09/17/10 269237    MT4217				CR 1-4254749344: Fixed issue where the Interfaced non-Cerner 
												Surgery Reports will not display in the Pathology component.
	 009 09/21/10 269237    MT4217				CR: 1-4274477211 - Results Timeline: Gestational Age should start at zero weeks instead of 1 week (confusing at first glance).
	 010 01/31/11 283779	MT4217				CR: 1-4590925469 - Pregnancy Summary Overview Component displays height in feet and inches even if entered using a different unit.
	 011 02/16/11 285923	MT4217				CR: 1-4698760101- Remove Microbiology link from the Micro component on the Pregnancy Summary.
	 012 03/10/11 285921(MAE)MT4217				Fixed issue where Administered section in Medication component showed only orders which are completed.(JIRA CERTMPAGES-182)
 	 013 03/30/11           PT017461                        CR: 1-4789492666 fix
	 014 03/30/11                PT017461          Fixed CR: 1-4786078473
	 015 04/21/11  287108     WD018719            Fixes for EDD hovers and home meds look back
	**********************************************************************************
~DE~************************************************************************
 
 
~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************/


//** AnyLink CSS Menu v2.0- (c) Dynamic Drive DHTML code library: http://www.dynamicdrive.com
//** Script Download/ instructions page: http://www.dynamicdrive.com/dynamicindex1/anylinkcss.htm
//** January 19', 2009: Script Creation date

//**May 23rd, 09': v2.1
	//1) Automatically adds a "selectedanchor" CSS class to the currrently selected anchor link
	//2) For image anchor links, the custom HTML attributes "data-image" and "data-overimage" can be inserted to set the anchor's default and over images.

//**June 1st, 09': v2.2
	//1) Script now runs automatically after DOM has loaded. anylinkcssmenu.init) can now be called in the HEAD section

// Regular expressions for normalizing white space.
var whtSpEnds 			= new RegExp("^\\s*|\\s*$", "g");
var whtSpMult 			= new RegExp("\\s\\s+", "g");

function normalizeString(s) {
  	s = s.replace(whtSpMult, " ");  // Collapse any multiple whites space.
  	s = s.replace(whtSpEnds, "");   // Remove leading or trailing white space.
 
  	return s;
}

function verify(){
    // 0 Object is not initialized
    // 1 Loading object is loading data
    // 2 Loaded object has loaded data
    // 3 Data from object can be worked with
    // 4 Object completely initialized
    if (xmlDoc.readyState != 4){
        return (false);
    }
}
 
function loadXMLString(txt) {
    try //Internet Explorer
      {
      //this creates the nex XML object
      xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async="false";
      xmlDoc.onreadystatechange=verify;
      xmlDoc.loadXML(txt);
      return(xmlDoc);
      }
    catch(e)
      {
      try //Firefox, Mozilla, Opera, etc.
        {
        parser=new DOMParser();
        xmlDoc=parser.parseFromString(txt,"text/xml");
        return(xmlDoc);
        }
      catch(e) {alert(e.message);}
      }
    alert('returning null...');
    return(null);
}

//global mpage object to store values used in subroutines
var mpObj = {
	personId : 0,
	userId : 0,
	encntrId : 0,
	expClicks: 0,
	ipath : "",
	prefs:"",
	sexCd: "",
	pregId: 0,
	eddId: 0,
	gesAge: 0,
	deliveryDt: 0,
	lookBack: 0,    	//based on today minus onset date
	rtlLookBack: 0,		//based on gestational age at delivery plus (today minus delivery date)
	overviewJSON: "",
	gravparaStr: "",
	eddDt: 0,
    pregHistLink: ""   //001 - global variable to store pregnancy history link for use within the pregnancy history section
};
var medCount =0;
var assesscount =0; 
var assess2count =0;
var lrscrl;
var lrcnt = 0;
var logFileObject = null;
var logFileOpen = false;
var logFile = null;
var btnCnt=0;

//certrn - todo - follow up on passing 'val' versus gbc() issues - Anush???
function eddAction(val){
	try{
		var formObject = window.external.DiscernObjectFactory('PREGNANCY');
	}catch(err){
		alert('An error has occurred calling DiscernObjectFactory("PREGNANCY"): '+err.name+' '+err.message);
		return;
	}
	if(!formObject){
		alert('Pregnancy object creation failed.');
		return;
	}
	//pregnancy EDD action methods
	var success = false;
	try{
		if(val == "Add"){
			success = formObject.AddEDD(window, mpObj.personId, mpObj.encntrId, mpObj.pregId);
			if(success==true){
				var paramString = "^MINE^," + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.ipath + "^";
				CCLLINK('mp_driver_preg_sum', paramString ,1);
			}
		}
		if(val == "Modify"){
			success = formObject.ModifyEDD(window, mpObj.personId, mpObj.encntrId, mpObj.eddId);
			if(success==true){
				var paramString = "^MINE^," + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.ipath + "^";
				CCLLINK('mp_driver_preg_sum', paramString ,1);
			}
		}
	}
	catch(err){
		alert('Exception thrown for pregnancy action - ' + x.innerHTML);
	}
	
	//release pregnancy object
	formObject = null;
}

function modifyEdd(id)
{
	try{
		var formObject = window.external.DiscernObjectFactory('PREGNANCY');
	}catch(err){
		alert('An error has occurred calling DiscernObjectFactory("PREGNANCY"): '+err.name+' '+err.message);
		return;
	}
	if(!formObject){
		alert('Pregnancy object creation failed.');
		return;
	}
	//pregnancy EDD action methods
	var success = false;
	try{
		success = formObject.ModifyEDD(window, mpObj.personId, mpObj.encntrId, id);
		if(success==true){
			var paramString = "^MINE^," + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.ipath + "^";
			CCLLINK('mp_driver_preg_sum', paramString ,1);
		}
	}
	catch(err){
		alert('Exception thrown for pregnancy action - ' + x.innerHTML);
	}
	
	//release pregnancy object
	formObject = null;
}

function pregFunction(object){
	var task = object.value;
	try{
		var formObject = window.external.DiscernObjectFactory('PREGNANCY');
	}catch(err){
		alert('An error has occurred calling DiscernObjectFactory("PREGNANCY"): '+err.name+' '+err.message);
		return;
	}
	if(!formObject){
		alert('Pregnancy object creation failed.');
		return;
	}

	//pregnancy action methods
	var success = false;
	try{
//certrn - todo - need to add code to refresh or alter workflow/view depending on action???
		if(task == 'Modify'){
			success = formObject.ModifyPregnancy(window, mpObj.personId, mpObj.encntrId, mpObj.pregId);
			if(success==true){
				var paramString = "^MINE^," + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.ipath + "^";
				CCLLINK('mp_driver_preg_sum', paramString ,1);
			}
		}
		if(task == 'Close'){
			success = formObject.ClosePregnancy(window, mpObj.personId, mpObj.encntrId, mpObj.pregId);
			if(success==true){
				var paramString = "^MINE^," + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.ipath + "^";
				CCLLINK('mp_driver_preg_sum', paramString ,1);
			}
		}
		if(task == 'Cancel'){
			success = formObject.CancelPregnancy(window, mpObj.personId, mpObj.encntrId, mpObj.pregId);
			if(success==true){
				var paramString = "^MINE^," + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.ipath + "^";
				CCLLINK('mp_driver_preg_sum', paramString ,1);
			}
		}
		if(task == 'Reopen'){
			success = formObject.ReopenPregnancy(window, mpObj.personId, mpObj.encntrId);
			if(success==true){
			}
//certrn - identify proper workflow - break this API out to it's own method to use with Add Pregnancy div?
//certrn - todo?			var paramString = "^MINE^," + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.ipath + "^";
//certrn - todo?			CCLLINK('mp_driver_preg_sum', paramString ,1);
		}
		//graph methods
		var success = false;
		if(task == 'FundalG'){
			success = formObject.LaunchFundalHeightGraph(window, mpObj.personId, mpObj.pregId);
			if(success!=true)
				alert('The fundal graph call failed.');
		}
		if(task == 'LaborG'){
			success = formObject.LaunchLaborGraph(window, mpObj.personId, mpObj.pregId);
			if(success!=true)
				alert('The labor graph call failed.');
		}
	}catch(err){
		alert('Exception thrown from pregnancy action - ' + task);
	}
	
	//release pregnancy object
	formObject = null;
		
	//clear selection
	object.value = 'Select';
}

function fetalEpisodes(val){
	try{
		var formObject = window.external.DiscernObjectFactory('PREGNANCY');
	}catch(err){
		alert('An error has occurred calling DiscernObjectFactory("PREGNANCY"): '+err.name+' '+err.message);
		return;
	}
	if(!formObject){
		alert('Pregnancy object creation failed.');
		return;
	}
	var success = false;
	
    success = formObject.LaunchFetalMonitoring(mpObj.personId, val);

	if (success!=true)
		alert('The Fetal Monitoring viewer call failed.');
	formObject = null;
}

function addPregnancy(){
	try{
		var formObject = window.external.DiscernObjectFactory('PREGNANCY');
	}catch(err){
		alert('An error has occurred calling DiscernObjectFactory("PREGNANCY"): '+err.name+' '+err.message);
		return null;
	}
	if(!formObject){
		alert('Pregnancy object creation failed.');
		return false;
	}

	var success = false;
	try{
		success = formObject.AddPregnancy(window, mpObj.personId, mpObj.encntrId);
		if(success==true){
//			call refresh logic
			var val = pregnancyData();
			mpObj.pregId = val.pregnancy_id;
			if(mpObj.pregId){		//show pregnancy summary
				var paramString = "^MINE^," + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.ipath + "^";
				CCLLINK('mp_driver_preg_sum', paramString ,1);
			}else{
				alert('Add pregnancy call succeeded - but pregnancy Id not found.');
			}
		}
	}catch(err){
		alert('Exception thrown from add pregnancy action.');
	}
	
	//release pregnancy object
	formObject = null;
}	

function reopenPregnancy(){
	try{
		var formObject = window.external.DiscernObjectFactory('PREGNANCY');
	}catch(err){
		alert('An error has occurred calling DiscernObjectFactory("PREGNANCY"): '+err.name+' '+err.message);
		return null;
	}
	if(!formObject){
		alert('Pregnancy object creation failed.');
		return false;
	}

	var success = false;
	try{
		success = formObject.ReopenPregnancy(window, mpObj.personId, mpObj.encntrId);
		if(success==true){
//			call refresh logic
			var val = pregnancyData();
			mpObj.pregId = val.pregnancy_id;
			if(mpObj.pregId){		//show pregnancy summary
				var paramString = "^MINE^," + mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.ipath + "^";
				CCLLINK('mp_driver_preg_sum', paramString ,1);
			}else{
				alert('Reopen pregnancy call succeeded - but pregnancy Id not found.');
			}
		}
	}catch(err){
		alert('Exception thrown from reopen pregnancy action.');
	}
	
	//release pregnancy object
	formObject = null;
}	

function printSummary(){
	var reportName = printReport;
	var paramString = "^MINE^,^" + reportName + "^," + mpObj.personId + "," + mpObj.encntrId;
	CCLLINK("pwx_rpt_driver_to_mpage",paramString,1);
}

/********************************************************************************
* Begin Onset Date Calculation
* @param - none
* @return - integer representing the number of days past pregnancy onset
********************************************************************************/

function pregnancyData() {

    var egaData = new XMLCclRequest();
    var pregObj = new Object();
    egaData.onreadystatechange = checkReady;
    egaData.open('GET', 'mp_get_ega_data', false);
    egaData.send("^MINE^, value($PAT_Personid$), value($VIS_Encntrid$)");

    function checkReady() { //check to see if request is ready
        if (egaData.readyState === 4) { // 4 = "loaded"
            if (egaData.status === 200) { // 200 = OK
                try {
                    var egaJSON = JSON.parse(egaData.responseText);
                    if (egaJSON.RECORD_DATA.STATUS_DATA.STATUS == "S") {  //success
                        pregObj.pregnancy_id = egaJSON.RECORD_DATA.GESTATION_INFO[0].PREGNANCY_ID;
                        pregObj.look_back = egaJSON.RECORD_DATA.LOOKBACK_DAYS;
                        pregObj.reopen_preg_ind = egaJSON.RECORD_DATA.REOPEN_PREG_IND;  //004
                        pregObj.est_gest_age = egaJSON.RECORD_DATA.GESTATION_INFO[0].EST_GEST_AGE;
                        pregObj.current_gest_age = egaJSON.RECORD_DATA.GESTATION_INFO[0].CURRENT_GEST_AGE;
						
                        pregObj.est_delivery_date = egaJSON.RECORD_DATA.GESTATION_INFO[0].EST_DELIVERY_DATE_FORMATTED;
                        pregObj.edd_id = egaJSON.RECORD_DATA.GESTATION_INFO[0].EDD_ID;
                        pregObj.delivered_ind = egaJSON.RECORD_DATA.GESTATION_INFO[0].DELIVERED_IND;
						pregObj.gest_age_at_delivery = 0;
						pregObj.delivery_date = "";
						pregObj.delivery_date_tz = 0;
                        if (pregObj.delivered_ind > 0) {
                            pregObj.gest_age_at_delivery = egaJSON.RECORD_DATA.GESTATION_INFO[0].GEST_AGE_AT_DELIVERY;
                            pregObj.delivery_date = egaJSON.RECORD_DATA.GESTATION_INFO[0].DELIVERY_DATE_FORMATTED;
						    pregObj.delivery_date_tz = egaJSON.RECORD_DATA.GESTATION_INFO[0].DELIVERY_DATE_TZ;
                        }
                    }
                    else if (egaJSON.RECORD_DATA.STATUS_DATA.STATUS == "Z") {   //no pregnancy
                        pregObj.pregnancy_id = 0;
						pregObj.reopen_preg_ind = egaJSON.RECORD_DATA.REOPEN_PREG_IND;  //004
                    }
                    else {      //failure
                        pregObj.pregnancy_id = -1;
						alert('Executing pregnancyData() script call failed.');
                    }
                }
                catch (err) {
					alert('An error has occurred in pregnancyData(): '+err.name+' - '+err.message);
                    pregObj.pregnancy_id = -1;
                }
            }
        }
    }
    return (pregObj);
}

function gravidaData()
{ 
   var egaData = new XMLCclRequest();
    var pregObj = new Object();
    egaData.onreadystatechange = checkReady;
    egaData.open('GET', 'mp_preg_overview', false);
	egaData.send("^MINE^, value($PAT_Personid$)," +mpObj.pregId+ "," + mpObj.lookBack);
   
    function checkReady() { //check to see if request is ready
        if (egaData.readyState === 4) { // 4 = "loaded"
            if (egaData.status === 200) { // 200 = OK
                try {
						if(debugFlag){
							logRecord("Overview JSON:");
							logRecord(egaData.responseText);
						}
						var gravidaJSON = JSON.parse(egaData.responseText);
                    
                        pregObj.gravida = gravidaJSON.RECORD_DATA.LGRAVIDA;
						pregObj.para = gravidaJSON.RECORD_DATA.LPARA;
						pregObj.fullterm = gravidaJSON.RECORD_DATA.LPARAFULLTERM;
						pregObj.preterm = gravidaJSON.RECORD_DATA.LPARAPREMATURE;
						pregObj.abortions = gravidaJSON.RECORD_DATA.LPARAABORTIONS;
						pregObj.living = gravidaJSON.RECORD_DATA.LLIVING;
						pregObj.estdate = gravidaJSON.RECORD_DATA.SESTDATE;
						pregObj.overviewReplyRaw = egaData.responseText;
                }
                catch (err) {
					alert('An error has occurred in gravidaData(): '+err.name+' - '+err.message);
                    pregObj.pregnancy_id = -1;
                }
            }
        }
    }
    return (pregObj); 
}

function deliveryDoc()
{ 
	var delData = new XMLCclRequest();
	delData.onreadystatechange = checkReady;
	delData.open('GET', 'mp_delivery_summary', false);
	delData.send("^MINE^, value($PAT_Personid$)," +mpObj.lookBack);

    function checkReady() { //check to see if request is ready
        if (delData.readyState === 4) { // 4 = "loaded"
            if (delData.status === 200) { // 200 = OK
				if(debugFlag){
					logRecord("Delivery JSON:");
					logRecord(delData.responseText);
				}
				return;
            }else{
				alert('An error has occurred in deliveryDoc() XML request.');
			}
        }
    }
 	return(delData.responseText);
}

/********************************************************************************
* End Onset Date Calculation
********************************************************************************/

/**
 * Calls the specified CCL script and passes the response text to the appropriate callback function
 * @param {string} url : The name of the CCL script
 * @param {function} callback : The function to be called with the response text
 * @param {string} params (optional) : Any additional parameters to be passed to the CCL script
 */
function load(url, callback, params) {
    var xhr = new XMLCclRequest();
    xhr.onreadystatechange = checkReady;
    xhr.open('GET', url,true);
	if (params) {
	xhr.send(params);
	}	
	else {
     xhr.send("^MINE^, value($PAT_Personid$), value($USR_Personid$), value($VIS_Encntrid$), 5");
	}

    function checkReady() { //check to see if request is ready
        if (xhr.readyState === 4) { // 4 = "loaded"
            if (xhr.status === 200) { // 200 = OK
				callback(xhr.responseText);
            }
            else {
                alert("Problem retrieving XML data ("+callback+")");
            }
        }
    }
}

//init function onload
window.onload = function() {
	var ex = "home";
	var ex1 = "one";
	var thePath = _g('file_path');
	mpObj.ipath = thePath.firstChild.data;
	var thePrefs = _g('pref_string');
	mpObj.prefs = thePrefs.firstChild.data;
//	mpObj.prefs = 'po,1,1,|assess,1,1,|ptl,1,1,|prb,2,1,|lr,2,1,|hml,2,1,|med,2,1,|dg,2,1,|doc,2,1,|mic,2,1,|edd,3,1,|edu,3,1,|bp,3,1,|fm,3,1,|preg,3,1,|genscr,3,1,|sh,3,1,|ph,3,1,|pmh,3,1,|';
	mpObj.personId = _g("person_id").firstChild.data;
	mpObj.userId = _g("user_id").firstChild.data;
	mpObj.encntrId = _g("encntr_id").firstChild.data;
	
    if(debugFlag){		//certrn set to true for JS logging
		openRecordFile(getUniqueFileName(mpObj.userId));		
	}
	//var prefString='{"Prefs": [{"pref": {"section_id": "shsec", "link_id": "shLink", "link": "Yes - Histories", "label": "Social History", "scroll": "Yes - 3","add_link": "Yes","time_span": ""}}]}';

	setPrefs(bdrkPrefString);
	var val = pregnancyData();
	mpObj.pregId = val.pregnancy_id;
	mpObj.lookBack = val.look_back;
	mpObj.gesAge = val.current_gest_age;
	mpObj.delgesAge = val.gest_age_at_delivery;
	mpObj.eddId = val.edd_id;
	mpObj.eddDt = val.est_delivery_date;
	mpObj.deliveryDt = val.delivery_date;
	mpObj.reopen_preg_ind = val.reopen_preg_ind; //004
	
	mpObj.rtlLookBack = mpObj.gesAge		//timeline lookback = gestational age if not delivered

	if(val.delivered_ind > 0){				//else it equals gestational age at delivery plus days of life
		mpObj.rtlLookBack = mpObj.delgesAge;
		var todayDate = new Date();
		var deliveryDate = new Date(fmtDt(mpObj.deliveryDt));
		var diff = todayDate - deliveryDate;
		var daysOfLife = Math.round(diff/(1000*60*60*24));
		mpObj.rtlLookBack += daysOfLife;
	}
	
	
	if(mpObj.pregId <= 0){		//show add pregnancy page or error
		var txtMsg = "";
		var addButton = '<td style="height:40px;vertical-align:middle;">&nbsp;</td>';
		var reopenButton = '<td style="height:40px;vertical-align:middle;">&nbsp;</td>';
		if(mpObj.pregId == 0){		//show add pregnancy page
			txtMsg = '<td style="height:40px;vertical-align:middle;">There are currently no active pregnancies for this patient.</td>';
			addButton = '<td style="height:40px;vertical-align:middle;"><input type="button" OnClick="addPregnancy()" value="Add Pregnancy"></td>';
			//004 begin
			if (mpObj.reopen_preg_ind == 1) 
			{
				reopenButton = '<td style="height:40px;vertical-align:middle;"><input type="button" OnClick="reopenPregnancy()" value="Reopen Pregnancy"></td>'; //004 
			}
			else
			{
				reopenButton = ''; //set the button to not display //004
			} //004 end
		}else{
			txtMsg = '<td style="height:40px;vertical-align:middle;">An error has occured retreiving pregnancy information for this patient.</td>';
		}
		if(!femalePatient){
			txtMsg = '<td style="height:40px;vertical-align:middle;">You must select a female patient to view the Pregnancy Summary.</td>';
			//Both Add Pregnancy and Reopen Pregnancy button must NOT be displayed for NOT FEMALE patient. //004
			addButton = '';  //set the button to not display //004
			reopenButton = '' ; //set the button to not display  //004
		}
		var demoHTML = ['<div style="width:99%;height:40px;border:3px solid blue">',
			'<table><tr>',
			'<td>&nbsp;&nbsp;</td>',
			'<td style="height:40px;vertical-align:middle;"><img src=\"'+mpObj.ipath+"\\images\\5104_16.gif\""+' alt="Alert: "/></td>',
			txtMsg,addButton,reopenButton,
			'</tr></table>',
			'</div>'];

		var demoarray = demoHTML.join('');
		document.getElementById('mainFrame').innerHTML  = demoarray;

	}else{			//show pregnancy summary full page
//certrn - to do - move to Delivery Summary load method to only call if needed
    if(debugFlag){
	    logRecord("******************************Log Info*******************************");
	    logRecord("Parameters:");
	    logRecord("Person ID:"+mpObj.personId+"User ID:"+mpObj.userId+"Encounter ID:"+mpObj.encntrId+"Look Back:"+mpObj.lookBack+"Gestational Age:"+mpObj.gesAge);
	    logRecord("*********************************************************************");
    }
		gpdata = gravidaData();
		mpObj.overviewJSON = gpdata.overviewReplyRaw;
		mpObj.gravparaStr = "G"+gpdata.gravida+  ",P" +gpdata.para+ "(" +gpdata.fullterm+ "," +gpdata.preterm+ ","  +gpdata.abortions+ "," +gpdata.living+ ")";

		//set up expand collapse
		var toggleArray = Util.Style.g("sec-hd-tgl");
		for (var k = 0; k < toggleArray.length; k++) {
			Util.addEvent(toggleArray[k], "click", expCol);
			var checkClosed = Util.gp(Util.gp(toggleArray[k]));
			if (Util.Style.ccss(checkClosed, "closed")) {
				toggleArray[k].innerHTML = "+";
				toggleArray[k].title = "Show Section";
			}
		}
		
		//expand all collapse all
		Util.addEvent(_g("expAll"), "click", expColAll);

		//save prefs
		Util.addEvent(_g("printView"), "click", printSummary);

		////AJAX data calls

		//demographic load
		var params = "^MINE^, value($PAT_Personid$), value($USR_Personid$), value($VIS_Encntrid$), 1";
		load('mp_preg_demographics', demographicLoad, params);

		//load labs
		if (mpObj.prefs.search(/lr/) > -1) {
			params = "^MINE^, value($PAT_Personid$), " +mpObj.lookBack;
			load('mp_preg_labs', lrLoad, params);
		}

		//// load Problems
		if (mpObj.prefs.search(/prb/) > -1) {
			params = "^MINE^, value($PAT_Personid$)";
			load('mp_preg_get_problems', prbLoad, params);
		}

		////load overview section
		if (mpObj.prefs.search(/po/) > -1) {
			poLoad(mpObj.overviewJSON);
		}	

		//// load Home Medications
		if (mpObj.prefs.search(/hml/) > -1) {
			// Hard coding the look back to 10 years instead of using the onset date (mocking the standard component). 
			params = "^MINE^,"+ mpObj.personId +", 0.0,"+ mpObj.userId +", " + 3650 + ","+ 8191 + "," + 6 + ", 0, 1, 0, 1";
			load('mp_preg_home_meds', CERN_HOME_MEDS.GetHomeMedications,params);
		}

		//// load Medications
		if (mpObj.prefs.search(/med/) > -1) {
			params = "^MINE^, value($PAT_Personid$), value($VIS_Encntrid$)," +mpObj.lookBack;
			load('mp_preg_medications', medLoad, params);
		}

		//// load Diagnostics
		if (mpObj.prefs.search(/dg/) > -1) {
		    params = "^MINE^, value($PAT_Personid$), " +mpObj.lookBack;
			load('mp_preg_diagnostics', dgLoad, params);
		}

		////load Pregnancy History section
		if (mpObj.prefs.search(/preg/) > -1) {
			params = "^MINE^, value($PAT_Personid$)";
			load('mp_pregnancy_history', pregLoad, params);
		}

		////load Birth Plan section
		if (mpObj.prefs.search(/bp/) > -1) {
			params = "^MINE^, value($PAT_Personid$), " +mpObj.lookBack;
			load('mp_get_birth_plan', bpLoad, params);
		}

		////load Education and Counseling section
		if (mpObj.prefs.search(/edu/) > -1) {
			params = "^MINE^, value($PAT_Personid$), " +mpObj.lookBack;
			load('mp_preg_ed_counseling', eduLoad, params);
		}

		////load Genetic Screening section
		if (mpObj.prefs.search(/genscr/) > -1) {
			params = "^MINE^, value($PAT_Personid$)";
			load('mp_genetic_screening', genscrLoad, params);
		}

		////load EDD Maintenance section
		if (mpObj.prefs.search(/edd/) > -1) {
			params = "^MINE^, value($PAT_Personid$), value($USR_Personid$), value($VIS_Encntrid$), " +mpObj.pregId;
			load('mp_preg_EDD_maint', eddLoad, params);
		}

		////load Assessments Section #1 
		if (mpObj.prefs.search(/assess[^0-9]/) > -1) {
			params = "^MINE^, value($PAT_Personid$), " +mpObj.lookBack+",1";
			load('mp_preg_assessment', assessLoad, params);
		}
			
		////load Assessments Section #2 
		if (mpObj.prefs.search(/assess2/) > -1) {
			params = "^MINE^, value($PAT_Personid$), " +mpObj.lookBack+",2";
			load('mp_preg_assessment', assess2Load, params);
		}
			
		//// load Timeline
		if (mpObj.prefs.search(/ptl/) > -1) {
				params = "^MINE^, value($PAT_Personid$), " +mpObj.rtlLookBack;
				load('mp_results_timeline', ptlLoad, params);
		}	
		
		//// load Past Medical History
		if (mpObj.prefs.search(/pmh/) > -1) {
			params = "^MINE^, value($PAT_Personid$)"; 
			load('mp_preg_get_past_med_data', pmhLoad, params);
		}
			
		//// load Procedure History
		if (mpObj.prefs.search(/ph/) > -1) {
			load('mp_get_procedure_history', phLoad);
		}

		//// load Social History
		if (mpObj.prefs.search(/sh/) > -1) {
			load('mp_preg_get_social_history', shLoad);
		}

		//// load Documents
		if (mpObj.prefs.search(/doc/) > -1) {
		    params = "^MINE^, " +mpObj.personId+", "+mpObj.lookBack;
			load('mp_preg_documents', docLoad, params);
		}

		//// load Pathology
		if (mpObj.prefs.search(/pat/) > -1) {
			params = "^MINE^, value($PAT_Personid$)," + mpObj.lookBack;
			load('mp_preg_pathology', patLoad, params);
		}

		//// load Pathnet Microbiology
		if (mpObj.prefs.search(/[^a-zA-Z]mic/) > -1) {
			params = "^MINE^, value($PAT_Personid$)," +mpObj.lookBack;
			load('mp_preg_sum_micro', micLoad, params);
		}

		//// load non-Microbiology
		if (mpObj.prefs.search(/nonmic/) > -1) {
			params = "^MINE^, value($PAT_Personid$)," +mpObj.lookBack;
			load('mp_get_micro_non_cerner', nonmicLoad, params);
		}

		//// load Fetal Monitoring
		if (mpObj.prefs.search(/fm/) > -1) {
		    params = "^MINE^, value($PAT_Personid$)," +mpObj.lookBack;
			load('mp_get_fetal_monitoring_data', fmLoad, params);  // Temporary for testing
		}
		
		//// load Notes/Reminders
		if (mpObj.prefs.search(/nr/) > -1) {
			params = "^MINE^, "+mpObj.personId+", "+mpObj.lookBack;
			load('mp_preg_get_notes_reminders', nrLoad, params);
		}

		//set width if column empty
		var colGroups = Util.Style.g("col-mask", null, "div");
		var colGroups1 = Util.Style.g("col-mask1", null, "div");

		for (var j=0, len=colGroups1.length; j<len; j++) {
			var colOne = Util.Style.g("col1", colGroups1[j], "div");
			var colOneContents = Util.Style.g("section", colOne[0], "div");
			if (colOneContents != 0){
			   colGroups1[j].className = "col-mask1 main-col";
			}
		}

		for (var i=0, l=colGroups.length; i<l; i++) {
			var colTwo = Util.Style.g("col2", colGroups[i], "div");
			var colTwoContents = Util.Style.g("section", colTwo[0], "div");
			var colThree = Util.Style.g("col3", colGroups[i], "div");
			var colThreeContents = Util.Style.g("section", colThree[0], "div");
			var colFour = Util.Style.g("col4", colGroups[i], "div");
			var colFourContents = Util.Style.g("section", colFour[0], "div");
			if (colFourContents == 0) {
				if (colThreeContents == 0) {
					colGroups[i].className = "col-mask one-col";
				}else {
					colGroups[i].className = "col-mask two-col";
				}
			}
			else {
				colGroups[i].className = "col-mask three-col";
			}
		} 
	} //have a pregnancy ID
};  //end init section

function openRecordFile(strFileSpec){
	// Open the text file at the specified location with append mode 
	if(logFileOpen == false){
		logFileObject = new ActiveXObject("Scripting.FileSystemObject"); 
		if(logFileObject != null){
			logFile = logFileObject.OpenTextFile(strFileSpec, 8, true, 0);
			if(logFile != null){
				logFileOpen = true;
			}else{
				alert("Problems opening C:\\preg_sum_log.txt file for logging.");
				debugFlag = false;
			}
		}else{
			alert("Problems opening ActiveXObject - Scripting.FileSystemObject.");
			debugFlag = false;
		}
	}
}

function logRecord(strRecord){
	if(logFileOpen == true){
		logFile.WriteLine(strRecord);
	}
}

function closeResources(){
	if(logFileOpen == true){
		logFile.Close();
		logFileOpen = false;
		logFileObject = null;
	}
//	SLATimer = null;
}


//certrn - to do - need to make this function handle all Cerner formats - "YYYY-MM-DDTHH:MM:SSZ"/"mm/dd/yy hh:mm:ss CDT"/free text - try or leave alone???
// indicate format - (UTC)/(actual local)/(freetext) with date???
function fmtDt(dt, mask) {
	if(dt) {
		var dateTime = new Date();
		dateTime.setISO8601(dt);	
		if(mask) {
			return dateTime.format(mask);
		}else {
			return dateTime.format("longDateTime3");
		}
	}else {
		return "";
	}
}

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
 
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};
 
	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;
 
		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}
 
		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");
 
		mask = String(dF.masks[mask] || mask || dF.masks["default"]);
 
		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}
 
		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};
 
		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();
 
// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	shortDate2:     "mm/dd/yyyy",
	shortDate3:		"mm/dd/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	militaryTime:   "HH:MM",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
	longDateTime: 	"mm/dd/yyyy h:MM:ss TT Z",
	longDateTime2:	"mm/dd/yy HH:MM",
	longDateTime3:	"mm/dd/yyyy HH:MM",
	shortDateTime:	"mm/dd h:MM TT"
};
 
// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};
 
// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
 
// For i18n formatting...
Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));
 
    var offset = 0;
    var date = new Date(d[1], 0, 1);
 
    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }
 
    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
};

var i18n = function()
{
	return {
		//Return Status:
		NO_RESULTS_FOUND:"No results found",
		
		//Error Status:
		ERROR_RETREIVING_DATA:"Error retrieving results - Possibly Bedrock configuration missing?",
		
		NAME:"Name",
		PROVIDER_NAME:"Provider Name",
		DETAILS:"Details",
		ONSET_DATE:"Onset Date",
		COMMENTS:"Comments",
		DATE_TIME: "Date/Time",
		ANNOTATED_DISPLAY:"Annotated Display Name",
		CODE: "Code",
		COMPLIANCE: "Compliance",
		TYPE: "Type",
		DISPLAY: "Display",
		ORDEREDBY: "Order Entered By",
		DETAILS: "Details",

		DISCLAIMER: "This page is not a complete source of visit information.",
		EXPAND_ALL: "Expand All",
		SHOW_SECTION: "Show Section",
		HIDE_SECTION: "Hide Section",
		LOADING_DATA: "Loading", 
			
		DOB:"DOB",
		SEX:"Sex",
		MRN:"MRN",
		FIN:"FIN",
		VISIT_REASON:"Visit Reason",
		
		PROBLEMS:"Problems",
		PROBLEMS_NAME:"Problems Name",
		PROBLEMS_DETAILS:"Problems Details",

		//Medications
		MED_DETAIL:"Medication Details",
		MED_NAME:"Home Medication",
		ORIG_DT_TM:"Order Date/Time",
		LAST_DOSE_DT_TM:"Last Dose Date/Time",
		NEXT_DOSE_DT_TM:"Next Dose Date/Time",
		START_DT_TM:"Start Date/Time",
		STOP_DT_TM:"Stop Date/Time",
		STOP_REASON:"Stop Reason",
		STATUS:"Status",
		LAST_GIVEN:"Last Given",
		NEXT_DOSE:"Next Dose",
		SCHEDULED:"Scheduled",
		CONTINOUS:"Continous",
		PRN:"PRN",
		UNSCHEDULED:"Unscheduled",
		DATE_NOT_SPECIFIED: "Date Not Specified" //008
	};
}();

function demographicLoad(demoInput) {
	var msgDemo = demoInput;
	var jsonDemo = JSON.parse(msgDemo);
	mpObj.personId = jsonDemo.ids.person_id;
	mpObj.userId = jsonDemo.ids.user_id;
	mpObj.encntrId = jsonDemo.ids.encntr_id;
	if(jsonDemo.ids.sex == null)
		mpObj.sexCd = "";
	else
		mpObj.sexCd = jsonDemo.ids.sex;
	var sexDisplay = mpObj.sexCd;

	var demoHTML = ['<dl class="dmg-info"><dt class="dmg-pt-name-lbl"><span>Patient Name:</span></dt><dd class="dmg-pt-name"><span>',
					jsonDemo.ids.name, '</span></dd><dt class="dmg-sex-age-lbl"><span>Sex, Age:</span></dt><dd class="dmg-sex-age"><span>',
					sexDisplay, ' ', jsonDemo.ids.age, '</span></dd><dt><span>DOB:</span></dt><dd class="dmg-dob"><span>',
					jsonDemo.ids.dob, '</span></dd><dt><span>MRN:</span></dt><dd class="dmg-mrn"><span>',
					jsonDemo.ids.mrn, '</span></dd><dt><span>FIN:</span></dt><dd class="dmg-fin"><span>',
					jsonDemo.ids.fin, '</span></dd><dt><span>Visit Reason:</span></dt><dd class="dmg-rfv"><span>',
					jsonDemo.ids.rfv, '</span></dd></dl><span class="disclaimer">This page is not a complete source of visit information.</span>'];
	
    var demoarray = demoHTML.join('');
	var tempDiv = document.createElement('div');
	tempDiv.innerHTML = demoarray;

	_g('banner').appendChild(tempDiv);
	 //set up section header applinks

} //end demographicLoad

function check(val) {
	var x= gbc("check",null,"SPAN")[0];
	if(x.innerHTML == "Check All"){
		for (var i =0 ; i < val; i++){
			document.getElementById("check"+i).checked=true
		}
		x.innerHTML = "Uncheck All"
	}else{
		for (var i =0 ; i < val; i++){
			document.getElementById("check"+i).checked=false
		}
		x.innerHTML = "Check All"
	}
}

function show(id)
{
	if (document.getElementById(id).style.display == 'none')
	{
		document.getElementById(id).style.display = '';
	}
}

function hide(id)
{
	document.getElementById(id).style.display = 'none';
}

function dispDiv(num){
	var x= gbc("dispDiv",null,"SPAN")[0];
	var myDivs = [];
	for(var i=0; i<num; i++){
		var cnt = i;
		myDivs[i]=cnt;
	}
	
	var myDiv;
	if(x.innerHTML == "Collapse Comments"){
		for (myDiv=0; myDiv<myDivs.length; myDiv++) {
			document.getElementById(myDivs[myDiv]).style.display = 'none';
		}
		x.innerHTML = "Expand Comments";
	}else if(x.innerHTML == "Expand Comments"){
		for (myDiv=0; myDiv<myDivs.length; myDiv++) {
			document.getElementById(myDivs[myDiv]).style.display = '';
		}
		x.innerHTML = "Collapse Comments";
	}
}

function dispDiv2(num){
	var x= gbc("dispDiv2",null,"SPAN")[0];
	var myDivs = [];
	for(var i=0; i<num; i++){
		var cnt = i;
		myDivs[i]="cmt"+cnt;
	}
	
	var myDiv;
	if(x.innerHTML == "Collapse Comments"){
		for (myDiv=0; myDiv<myDivs.length; myDiv++) {
			document.getElementById(myDivs[myDiv]).style.display = 'none';
		}
		x.innerHTML = "Expand Comments";
	}else if(x.innerHTML == "Expand Comments"){
		for (myDiv=0; myDiv<myDivs.length; myDiv++) {
			document.getElementById(myDivs[myDiv]).style.display = '';
		}
		x.innerHTML = "Collapse Comments";
	}
}


function gbc(c, e, t) {
	e = e || document;
	t = t || '*';

	var ns = [];
	var es = _gbt(t, e);
	var l = es.length;

	for (var i = 0, j = 0; i < l; i++) {
		if (ccss(es[i], c)) {
			ns[j] = es[i];
			j++;
		}
	}
	return ns;
}

function _gbt(t, e) {
	e = e || document;
	return e.getElementsByTagName(t);
}

function ccss(e, c) {
	if (typeof(e.className) === 'undefined' || !e.className) {
		return false;
	}
	var a = e.className.split(' ');
	for (var i = 0, b = a.length; i < b; i++) {
		if (a[i] === c) {
			return true;
		}
	}
	return false;
}

function setPrefs(p) {
	var secHref = "";
	var inHTML = "";
	var outHTML = "";
	var element;
	var parElement;
	var link = "";
	var plusAddLink = "";
	var scrollNum = "";
	var plusAdd = false;
	var timeSpan = "";
	try{
		var prefJSON = JSON.parse(p);
	}
	catch (err){
		alert(err.description);
	}
	var pLen = prefJSON.Prefs.length;
	var personId = mpObj.personId;
	var encntrId = mpObj.encntrId;
	for(var i = 0;i < pLen; i++){
		var lPrefs = prefJSON.Prefs[i].pref;
		
		/*Set the section link and label*/
		element = document.getElementById(lPrefs.link_id);
		if(element != null){			
			/*Set the label*/
			if(lPrefs.label !== null){
				element.innerHTML = lPrefs.label;
			}
			
			if(lPrefs.link.search(/Yes/) > -1){
				/*Set the link*/
				link = (lPrefs.link).replace("Yes - ", "");
				secHREF = 'javascript:APPLINK(0,"powerchart.exe","/PERSONID=' + personId + 
						  ' /ENCNTRID=' + encntrId + 
						  ' /FIRSTTAB=^' + link + '^")';
				element.href = secHREF;
				element.title = "Go to " + link + " tab";
				//001 Begin
				if (lPrefs.section_id == "pregSec") {
				    mpObj.pregHistLink = secHREF;
				}
				//001 End
			}
			else{
				/*remove the link*/
				link = null;
				inHTML = element.firstChild.data;
				var parElement = Util.gp(element);
				Util.de(element);
				element = Util.ce("span");
				element.innerHTML = inHTML;
				parElement.insertBefore(element, parElement.firstChild);
			}
			
			/*Load the time span display*/
			if(lPrefs.time_span != ""){
				timeSpan = lPrefs.time_span;
			}
		}
		
		/*Set the scroll preferences*/
		 if(lPrefs.scroll.search(/Yes/) > -1){
			scrollNum = lPrefs.scroll.replace("Yes - ", "");
			
		 }
		 else{
			scrollNum = null;
		 }
			 
		/*Set the +Add preferences*/
		if(lPrefs.add_link === "default"){
			//Default actions taken
			if(lPrefs.link.search(/Yes/) > -1){
				//make the +Add link the same as the link 
				plusAdd = true;
			}
			else{
				//Remove the +Add
				plusAdd = false;
				
			}
		}
		else if(lPrefs.add_link.search(/Yes/) > -1){
			//Add the +add link the +Add icon
			plusAddLink = (lPrefs.link).replace("Yes - ", "");
			plusAdd = true;
		}
		else{
			//Remove the +Add
			plusAdd = false;
		}
		if (lPrefs.section_id=="medSec")
		{
		    medCount = scrollNum;
		}
		if (lPrefs.section_id=="assessSec")
		{
		    assesscount = scrollNum;
		}
		if (lPrefs.section_id=="assess2Sec")
		{
		    assess2count = scrollNum;
		}
		if (lPrefs.section_id=="lrSec")
		{
		    lrscrl = scrollNum;
			
		}
     	if (plusAdd){
	
			switch(lPrefs.section_id){
				case "genscrSec":
					appendPlusAdd("genscr", genscrAddFn);
					break;
				case "eduSec":
					appendPlusAdd("edu", eduAddFn);
					break;
				case "eddSec":
					appendPlusAdd("edd", eddAddFn);
					break;
				case "bpSec":
					appendPlusAdd("bp", bpAddFn);
					break;
			}
		}
		var pfId = lPrefs.powerform_id;
		bedrockPrefs(lPrefs.section_id, link, plusAdd, scrollNum, timeSpan, pfId);	 
			 		
	}//end for loop
}  //end setPrefs

function bedrockPrefs(sec, tabLink, hasPlus, scroll, timeSpan, pfId) {
	return bedrockPrefs[sec] = {
		sec: sec,
		tabLink: tabLink,
		hasPlus: hasPlus,
		scroll: scroll,
		timeSpan: timeSpan,
		powerformId: pfId
	}
}

function appendPlusAdd(pre, addFn) {
    var img = Util.cep("img", { "src": mpObj.ipath + '\\images\\3941.gif' });
    var link = Util.cep("a", { 'className': 'addPlus', 'id': pre + 'Add' });
    var linkText = document.createTextNode('Add');

    Util.ac(img, link);
    Util.ac(linkText, link);
    var sec0 = Util.Style.g(pre + "-sec");
    var secCL = Util.Style.g("sec-title", sec0[0], "span");
    var secSpan = Util.gc(secCL[0]);
	
    Util.ac(link, secSpan);
	Util.addEvent(_g(pre + "Add"), "click", addFn);
}

//certrn todo - +Add link methods to excute and refresh view when +Add clicked - combine all xxxAddFn() methods to one method once Bedrock/"driver" code is defined???
function genscrAddFn() {
	var powerformId = bedrockPrefs['genscrSec'].powerformId;
	powerformId += '.0';
	MPAGES_EVENT('POWERFORM', mpObj.personId + '|' +mpObj.encntrId+'|'+powerformId+'|0.0|0');
	var params = "^MINE^, value($PAT_Personid$)";
	load('mp_genetic_screening', genscrLoad, params);
}

function bpAddFn() {
	var powerformId = bedrockPrefs['bpSec'].powerformId;
	powerformId += '.0';
	MPAGES_EVENT('POWERFORM', mpObj.personId + '|' +mpObj.encntrId+'|'+powerformId+'|0.0|0');
	var params = "^MINE^, value($PAT_Personid$), " +mpObj.lookBack;
	load('mp_get_birth_plan', bpLoad, params);
}

function eduAddFn() {
	var powerformId = bedrockPrefs['eduSec'].powerformId;
	powerformId += '.0';
	MPAGES_EVENT('POWERFORM', mpObj.personId + '|' +mpObj.encntrId+'|'+powerformId+'|0.0|0');
	var params = "^MINE^, value($PAT_Personid$), " +mpObj.lookBack;
	load('mp_preg_ed_counseling', eduLoad, params);
}

function eddAddFn() {
	eddAction('Add');
}

function openTab(pre, tabName) {
	tabHREF = 'javascript:APPLINK(0,"powerchart.exe","/PERSONID=' + mpObj.personId + '/ENCNTRID=' + mpObj.encntrId + '/FIRSTTAB=^' + tabName + '+^")';
	document.getElementById('alAdd').href = tabHREF;
}
function openForm(pre, tabName) {
//var tempstr = 'javascript:MPAGES_EVENT(\"POWERFORM\",\"" + mpObj.personId + "|" +mpObj.encntrId+"|0.0|0.0|0\")';
	tabHREF = "<a href='javascript:MPAGES_EVENT(\"POWERFORM\",\"" + mpObj.personId + "|" +mpObj.encntrId+"|0.0|0.0|0\")'><span class='dispDiv' >Call PowerForm</span></a>";
	document.getElementById(pre + 'Add').href = tabHREF;
}

// Load Pathnet Microbiology
function micLoad(xhr) {
	var micData = xhr;
	if(debugFlag){
	logRecord("Microbiology JSON:");
	logRecord(micData);
    }
	var jsonEval = JSON.parse(micData);
	var jsMicHTML = [];
	var micHTML = "";
	var micObj = jsonEval.RECORD_DATA.MICRO;
	var micNum = micObj.length;
	var micHd = "";

	if (micNum > 0) {	
		jsMicHTML.push("<dl class='mic-info-hdr'><dd class='mic-src-hd'><span>Source/Site</span></dd><dd class='mic-within-hd'><span>Collected Date/Time</span></dd><dd class='mic-norm-hd'><span>Normality</span></dd><dd class='mic-stat-hd'><span>Status</span></dd></dl>");
		for (var i=0; i<micNum; i++) {
			var sourceSite = "";
			var growthInd = "";
			var micItem = micObj[i];
			var micSite = micItem.SITE;
			if (micSite != null && micSite != "") {
				sourceSite = micSite;
			}
			else {
				sourceSite = micItem.SOURCE;
			}
			var micNorm = micItem.NORM;
			if (micNorm.toUpperCase() == "GROWTH") {
				growthInd = "<span class='res-severe'>";
			}
			else {
				growthInd = "<span>";
			}
			jsMicHTML.push(	"<h3 class='mic-info-hd'><span>", micItem.TYPE,
							"</span></h3><dl class='mic-info'><dt><span>Micro:</span></dt><dd class='mic-src'>", growthInd, sourceSite,   
							"</span></dd><dd class='mic-within'>", growthInd,fmtDt(micItem.COLLECTED,"longDateTime2"), //011
							"</span></dd><dd class='mic-norm'>", growthInd, micNorm, "</span></dd><dd class='mic-stat'>", growthInd, micItem.STATUS,
							"</span></dd></dl><h4 class='mic-det-hd'><span>Micro Details</span></h4><dl class='mic-det hvr'><dt><span>Source/Site:</span></dt><dd><span>",
							sourceSite,	"</span></dd><dt><span>Last Update Date/Time:</span></dt><dd><span>", fmtDt(micItem.UPDT_DT_TM,"longDateTime3"),
							"</span></dd><dt><span>Susceptibility:</span></dt><dd><span>", micItem.SUS,
							"</span></dd></dl>");
		}
	}
	else {
		jsMicHTML.push("<h3 class='mic-info-hd'>" + HandleNoDataResponse("mic") + "</h3><span class='res-none'>No results found</span>");
	}
	micHTML = jsMicHTML.join("");
	var countText = "(" + micNum + ")";
	sec1load(micHTML,"mic",countText);
}			
			
// Load non-Microbiology
function nonmicLoad(nonmicInput) {
	var nonmicData = nonmicInput;
	//var nonmicData = '{"RECORD_DATA":{"DOCUMENTS":[{"TITLE":"Sputum Culture","DATE":"03\/17\/2010 18:28","EVENT_ID":2437852.000000,"RESULT":"POS"}],"STATUS_DATA":{"STATUS":"S","SUBEVENTSTATUS":{"OPERATIONNAME":"","OPERATIONSTATUS":"","TARGETOBJECTNAME":"","TARGETOBJECTVALUE":""}}}}';
	if(debugFlag){
	logRecord("Non Cerner Micro JSON:");
	logRecord(nonmicData);
    }
	var jsonEval = JSON.parse(nonmicData);
	var jsNonMicHTML = [];
	var nonmicHTML = "";
	var micNum = jsonEval.RECORD_DATA.DOCUMENTS.length;
    var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	
	if (status=="S") {	
		jsNonMicHTML.push("<dl class='nonmic-info-hdr'><dd class='nonmic-src-hd'><span>&nbsp;</span></dd><dd class='nonmic-within-hd'><span>Date/Time</span></dd></dl>");
		for (var i=0; i<micNum; i++) {
			
			var growthInd = "";
		
			var micNorm = jsonEval.RECORD_DATA.DOCUMENTS[i].RESULT ;
			if (micNorm.toUpperCase() == "POS") {
				growthInd = "<span class='res-severe'>";
			}
			else {
				growthInd = "<span>";
			}
			jsNonMicHTML.push(	"<dl class='nonmic-info'><dt><span>Micro:</span></dt><dd class='nonmic-src'>", growthInd,  jsonEval.RECORD_DATA.DOCUMENTS[i].TITLE, "</span></dd><dd class='nonmic-within'>", growthInd,
							"<a href='javascript:CCLLINK(mp_preg_clin_smry_clinicaldocs,\"^MINE^,"+jsonEval.RECORD_DATA.DOCUMENTS[i].EVENT_ID+".0,1\",1)'>", fmtDt(jsonEval.RECORD_DATA.DOCUMENTS[i].DATE, "longDateTime2"),
							"</a></span></dd></dl>");
		}
	}
	else if(status=="Z")
	{
	    jsNonMicHTML.push(HandleNoDataResponse("nonmic"));
	}
	else 
	{
	    jsNonMicHTML.push(HandleErrorResponse("nonmic"));
	}
	nonmicHTML = jsNonMicHTML.join("");
	var countText = "(" + micNum + ")";
	//secLoad(nonmicHTML, "nonmic", countText, 5);
	sec1load(nonmicHTML,"nonmic",countText);

}			

/**
	updateBtn
	This function is triggered when user selects the checkbox on the Episodes list.
	The "Show" button will be enabled when 1 to 3 checkboxes are selected.
	The "Show" button will be disabled when more than 3 checkboxes are selected.
*/

function updateBtn(val)
{

	//Get the list of the Episode check boxes.
	var fmEpisodeList = Util.Style.g('fmCheck'); //007
	
	if (fmEpisodeList[val].checked == true) //007 if the item is checked, then add the btnCnt
	{
		btnCnt++;
	}
	else //uncheck checkbox
	{
		btnCnt--; 
	}
	 
	//if no box is checked or more than 3 boxes are checked, then disabled the Show button	
	if (btnCnt == 0 || btnCnt > 3) //007
	{
		  document.getElementById("shwBtn").disabled = true; //007
	}
	else //007
	{
		  document.getElementById("shwBtn").disabled = false; //007
	}
}
			
function fmLoad(fmInput)
{
	//var fmData = '{"RECORD_DATA":{"EPISODES":[{"INITIAL_DT_TM":"07\/07\/2009 11:32:18","COMPLETE_DT_TM":"07\/07\/2009 11:32:18","REASON_FOR_MONITORING":"pauladiane attempting to finalize","EPISODE_ID":"15288244"},{"INITIAL_DT_TM":"07\/07\/2009 11:28:38","COMPLETE_DT_TM":"07\/07\/2009 11:28:38","REASON_FOR_MONITORING":"episode 1","EPISODE_ID":"14432396"},{"INITIAL_DT_TM":"07\/05\/2009 00:27:03","COMPLETE_DT_TM":"07\/05\/2009 00:27:03","REASON_FOR_MONITORING":"Labor Induction; Fetal Testing","EPISODE_ID":"13411533"},{"INITIAL_DT_TM":"07\/05\/2009 00:25:57","COMPLETE_DT_TM":"07\/05\/2009 00:25:57","REASON_FOR_MONITORING":"Delivery; Non-Stress Test--EPISODE1","EPISODE_ID":"13412300"},{"INITIAL_DT_TM":"07\/05\/2009 00:25:57","COMPLETE_DT_TM":"07\/05\/2009 00:25:57","REASON_FOR_MONITORING":"not good","EPISODE_ID":"13413061"},{"INITIAL_DT_TM":"07\/05\/2009 00:22:22","COMPLETE_DT_TM":"07\/05\/2009 00:22:22","REASON_FOR_MONITORING":"EPISODE I","EPISODE_ID":"13411511"},{"INITIAL_DT_TM":"06\/10\/2009 11:13:07","COMPLETE_DT_TM":"06\/10\/2009 11:13:07","REASON_FOR_MONITORING":"test- EPISODE 1","EPISODE_ID":"13342057"},{"INITIAL_DT_TM":"06\/10\/2009 11:08:05","COMPLETE_DT_TM":"06\/10\/2009 11:08:05","REASON_FOR_MONITORING":"testing last test","EPISODE_ID":"10872079"},{"INITIAL_DT_TM":"06\/05\/2009 15:28:21","COMPLETE_DT_TM":"06\/05\/2009 15:28:21","REASON_FOR_MONITORING":"New Test Starts Here","EPISODE_ID":"9973579"},{"INITIAL_DT_TM":"06\/05\/2009 14:53:24","COMPLETE_DT_TM":"06\/05\/2009 14:53:24","REASON_FOR_MONITORING":"Hidden Reason for Monitoring","EPISODE_ID":"9949808"},{"INITIAL_DT_TM":"06\/01\/2009 18:44:03","COMPLETE_DT_TM":"06\/01\/2009 18:44:03","REASON_FOR_MONITORING":"Hidden Reason for Monitoring","EPISODE_ID":"9193351"},{"INITIAL_DT_TM":"05\/27\/2009 10:00:00","COMPLETE_DT_TM":"05\/27\/2009 10:00:00","REASON_FOR_MONITORING":"teast reason for monitoring","EPISODE_ID":"9192833"},{"INITIAL_DT_TM":"05\/26\/2009 21:04:19","COMPLETE_DT_TM":"05\/26\/2009 21:04:19","REASON_FOR_MONITORING":"rfm","EPISODE_ID":"4679422"},{"INITIAL_DT_TM":"05\/26\/2009 21:00:10","COMPLETE_DT_TM":"05\/26\/2009 21:00:10","REASON_FOR_MONITORING":"blah","EPISODE_ID":"4668507"}]}}';
	var fmData = fmInput;
	if(debugFlag){
	logRecord("Fetal Monitoring JSON:");
	logRecord(fmData);
    }
	var jsonEval = JSON.parse(fmData);
	var fmhtml = "";
    var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var fmArray = [];	
	if (status=="S")
	{   
		var fmLen = jsonEval.RECORD_DATA.EPISODES.length;
		fmArray.push("<table><tr><td style='width:5%;'><input type='button' id='shwBtn' style='height=1.5em; font:12px;' disabled='true' onclick=\"showEpisodes("+fmLen+")\" value='Show' ></td><td class='disclaimer'>Select up to 3 episodes</td></tr></table>");
		fmArray.push("<dl class='fm-info-hdr'><dd class='fm-chk-hd'><span>&#160;</span></dd><dd class='fm-dt-hd'><span>Initial</span></dd><dd class='fm-dt-hd'><span>Complete</span></dd><dd class='fm-res-hd'><span>Fetal EGA</span></dd><dd class='fm-res-hd'><span>Reason for Monitoring</span></dd></dl>");
		for(var i=0; i<fmLen; i++)
		{
			var inDt = fmtDt(jsonEval.RECORD_DATA.EPISODES[i].INITIAL_DT_TM,"shortDate2");
			var inDt1 = fmtDt(jsonEval.RECORD_DATA.EPISODES[i].INITIAL_DT_TM,"longDateTime2");
			//var inDt = fmtDt(jsonEval.RECORD_DATA.EPISODES[i].INITIAL_DT_TM,"shortDate2");
			var comDt = fmtDt(jsonEval.RECORD_DATA.EPISODES[i].COMPLETE_DT_TM, "longDateTime2");
			var eid = jsonEval.RECORD_DATA.EPISODES[i].EPISODE_ID;
			var one_day = 1000 * 60 * 60 * 24;
			var t2Dt = new Date(inDt);
			t2Dt.setDate(t2Dt.getDate()-mpObj.gesAge);
			var pre2Dt = (t2Dt.getMonth()+1)+"/"+t2Dt.getDate()+"/"+t2Dt.getYear();
			var t3Dt = new Date(inDt);
			t3Dt.setDate(t3Dt.getDate());
			var pre3Dt = (t3Dt.getMonth()+1)+"/"+t3Dt.getDate()+"/"+t3Dt.getYear();
			var fetDt = new Date(pre2Dt);
			var fet1Dt = new Date(pre3Dt);
			var diff = Math.ceil((fet1Dt.getTime()-fetDt.getTime())/one_day); 
			var inWeeks = (diff)/7;
			var inDays = (diff)%7;
			var disWeek = Math.floor(inWeeks);
		 
			fmArray.push("<dl class='fm-info'><dd class='fm-chk'><form name='cbform"+i+"'><input type='checkbox' name='chk' id='check"+i+"' value='"+eid+"' class='fmCheck' onclick=\"updateBtn("+i+")\" /></form></dd>"); //007
		
			if(inDt1==null||inDt1=="")
			{
			    fmArray.push("<dd class='fm-dt'><span>--</span></dd>");
			}
			else
			{
			    fmArray.push("<dd class='fm-dt'><span>", inDt1,"</span></dd>");
			}
			if(comDt==null||comDt=="")
			{
			    fmArray.push("<dd class='fm-dt'><span>--</span></dd>");
			}
			else
			{
			    fmArray.push("<dd class='fm-dt'><span>", comDt,"</span></dd>");
			}
			if(comDt==null||comDt==""||inDt1==null||inDt1=="")
			{
			    fmArray.push("<dd class='fm-res'><span>--</span></dd>");
			}
			else
			{
			    fmArray.push("<dd class='fm-res'><span>"+disWeek+"&nbsp;weeks&nbsp;"+inDays+"&nbsp;days</span></dd>");
			}
			fmArray.push("<dd class='fm-res'><span>", jsonEval.RECORD_DATA.EPISODES[i].REASON_FOR_MONITORING,"</dd></dl>");
		}
	}
	else if(status=="Z")
	{
	    fmArray.push(HandleNoDataResponse("fm"));
	}
	else 
	{
	    fmArray.push(HandleErrorResponse("fm"));
	}
	
	//<dl class='fet-info'><dd class='fet-chk'><form><input type='checkbox' id='check1' /></form></dd><dd class='fet-dt'><span>9/16/2009</span></dd><dd class='fet-dt'><span>9/18/2008</span></dd><dd class='fet-res'><span>11 wks 2 days</span></dd><dd class='fet-res'><span>Archived for testing</span></dd></dl><dl class='fet-info'><dd class='fet-chk'><form><input type='checkbox' id='check2' /></form></dd><dd class='fet-dt'><span>9/16/2009</span></dd><dd class='fet-dt'><span>9/18/2008</span></dd><dd class='fet-res'><span>11 wks 2 days</span></dd><dd class='fet-res'><span>No Reason Specified</span></dd></dl><dl class='fet-info'><dd class='fet-chk'><form><input type='checkbox' id='check3' /></form></dd><dd class='fet-dt'><span>9/16/2009</span></dd><dd class='fet-dt'><span>9/19/2008</span></dd><dd class='fet-res'><span>11 wks 2 days</span></dd><dd class='fet-res'><span>Archived for testing</span></dd></dl><dl class='fet-info'><dd class='fet-chk'><form><input type='checkbox' id='check4' /></form></dd><dd class='fet-dt'><span>9/16/2009</span></dd><dd class='fet-dt'><span>9/21/2008</span></dd><dd class='fet-res'><span>11 wks 2 days</span></dd><dd class='fet-res'><span>Another archived strip</span></dd></dl>");
    //for(var i=0; i<
	//fmArray.push("<dl class='fet-info'><dd class='fet-chk'><form><input type='checkbox' id='check1' /></form>
	fmhtml = fmArray.join("");
	var countText = "";
   sec1load(fmhtml,"fm",countText);
	
}		

function showEpisodes(len)
{
  var episodeArray = [];
  var epst = "";
  
  //Loop thru all fetal monitoring check boxes to get the checked values and put in array.
	var fmList = Util.Style.g('fmCheck'); //007
	var l = fmList.length; //007
	for (var i=0; i<l; i++) //007
	{
		if (fmList[i].checked == true) //007 if the item is checked, then add the value (episodeId) into array
		{
			var epStr = "";
			epStr = fmList[i].value; //007
			episodeArray[i]= epStr;
			epst = episodeArray.join("");
		}
	}
  fetalEpisodes(episodeArray);
}

function shLoad(xhr)
{
    //var shData = '{"RECORD_DATA": {"SOCIAL_CNT": 4,"SOCIAL": [{"CATEGORY": "Alcohol","CATEGORY_CNT": 1,"COLL_SEQ": 0,"RISK_ASSESSMENT": "Denies Alcohol Use","RISK_ASSESSMENT_CD": 6706061.000000,"SHX_DETAIL": [],"SHX_DETAIL_CNT": 0,"COMMENT_CNT": 0,"COMMENTS": [],"UPDT_PRSNL": "Turk , Sean","UPDT_DT_TM": "02\/01\/2010" },{"CATEGORY": "Exercise","CATEGORY_CNT": 3,"COLL_SEQ": 0,"RISK_ASSESSMENT": "Occasional exercise","RISK_ASSESSMENT_CD": 6706081.000000,"SHX_DETAIL": [{"DETAIL_TEXT": "Exercise duration: 20.  Exercise frequency: 3-4 times\/week.  Self assessment: Fair condition.  Exercise type: Hunting Bounties." } ],"SHX_DETAIL_CNT": 1,"COMMENT_CNT": 3,"COMMENTS": [{"COMMENT_TXT": "02\/02\/10 09:36 - Turk , Sean - This is the third useless comment." },{"COMMENT_TXT": "02\/02\/10 09:29 - Turk , Sean - Yet another comment" },{"COMMENT_TXT": "02\/02\/10 09:29 - Turk , Sean - Nothing particular" } ],"UPDT_PRSNL": "Turk , Sean","UPDT_DT_TM": "02\/01\/2010" },{"CATEGORY": "Sexual","CATEGORY_CNT": 7,"COLL_SEQ": 0,"RISK_ASSESSMENT": "Medium Risk","RISK_ASSESSMENT_CD": 6706073.000000,"SHX_DETAIL": [],"SHX_DETAIL_CNT": 0,"COMMENT_CNT": 0,"COMMENTS": [],"UPDT_PRSNL": "Turk , Sean","UPDT_DT_TM": "02\/01\/2010" },{"CATEGORY": "Tobacco","CATEGORY_CNT": 9,"COLL_SEQ": 0,"RISK_ASSESSMENT": "No Risk","RISK_ASSESSMENT_CD": 6706075.000000,"SHX_DETAIL": [],"SHX_DETAIL_CNT": 0,"COMMENT_CNT": 0,"COMMENTS": [],"UPDT_PRSNL": "Turk , Sean","UPDT_DT_TM": "02\/01\/2010" } ],"STATUS_DATA": {"STATUS": "S","SUBEVENTSTATUS": {"OPERATIONNAME": "","OPERATIONSTATUS": "","TARGETOBJECTNAME": "","TARGETOBJECTVALUE": "" } } }}';
	var shData = xhr;
	if(debugFlag){
	logRecord("Social History JSON:");
	logRecord(shData);
    }
	var jsonEval = JSON.parse(shData);
    var shhtml = "";
    var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var shArray = [];
	if(status=="S")
	{
	    for(var i=0; i<jsonEval.RECORD_DATA.SOCIAL_CNT; i++)
		{
		    shArray.push("<dl class='sh-info'><dt class='sh-det-hd'>Social History Information</dt><dd class='name'>", jsonEval.RECORD_DATA.SOCIAL[i].CATEGORY,
			":</dd><dd class='result'>", jsonEval.RECORD_DATA.SOCIAL[i].RISK_ASSESSMENT, 
			"</dd></dl><h4 class='sh-det-hd'>Social History Details</h4><dl class='sh-det hvr'><dt class='sh-det-type'><span>Category:</span></dt><dd class='result'><span>", jsonEval.RECORD_DATA.SOCIAL[i].CATEGORY,
			"</span></dd>");
			if(jsonEval.RECORD_DATA.SOCIAL[i].SHX_DETAIL_CNT>0)
			{
			for(var j=0; j<jsonEval.RECORD_DATA.SOCIAL[i].SHX_DETAIL_CNT; j++)
			{
			    shArray.push("<dt class='sh-det-type'><span>Details:</span></dt><dd class='result'><span>", jsonEval.RECORD_DATA.SOCIAL[i].SHX_DETAIL[j].DETAIL_TEXT,
				"</span></dd>");
			}
			}
			else
			{
			     shArray.push("<dt class='sh-det-type'><span>Details:</span></dt><dd class='result'><span>&nbsp;</span></dd>");
			}
			shArray.push("<dt class='sh-det-type'><span>Last Updated:</span></dt><dd class='result'><span>", jsonEval.RECORD_DATA.SOCIAL[i].UPDT_DT_TM,
			"</span></dd><dt class='sh-det-type'><span>Last Updated By:</span></dt><dd class='result'><span>", jsonEval.RECORD_DATA.SOCIAL[i].UPDT_PRSNL,
			"</span></dd>");
			if(jsonEval.RECORD_DATA.SOCIAL[i].COMMENT_CNT>0) 
			{
			for(var k=0; k<jsonEval.RECORD_DATA.SOCIAL[i].COMMENT_CNT; k++)
			{
			    shArray.push("<dt class='sh-det-type'><span>Comment:</span></dt><dd class='result'><span>", jsonEval.RECORD_DATA.SOCIAL[i].COMMENTS[k].COMMENT_TXT,
				"</span></dd>");
			}
			}
			else
			{
			    shArray.push("<dt class='sh-det-type'><span>Comment:</span></dt><dd class='result'><span>&nbsp;</span></dd>");
			}
			shArray.push("</dl>");            
		}   
	}
	else if(status=="Z")
	{
	    shArray.push(HandleNoDataResponse("sh"));
	}
	else 
	{
	    shArray.push(HandleErrorResponse("sh"));
	}
	
	shhtml = shArray.join("");
	var countText = "("+jsonEval.RECORD_DATA.SOCIAL_CNT+")";
    //secLoad(shhtml, "sh", countText, 0);
	sec1load(shhtml,"sh",countText);
}	



function sec1load(html,pre,count)
{
	var prefSec = pre + 'Sec';
	var secContent = _g(pre + "Content");

	//var curSec = Util.Style.g(pre + "-sec");
	if (bedrockPrefs[prefSec]) {
		var hasPlus = bedrockPrefs[prefSec].hasPlus;
		var scrollNum = bedrockPrefs[prefSec].scroll;
	}
	
	if(prefSec=="medSec")
	{
	    scrollNum =0;
	}
	
	secContent.innerHTML = "";
	// Remove count
	var curSec = Util.Style.g(pre + "-sec");
	var totalCount = Util.Style.g("sec-total", curSec[0], "span");
	if (totalCount) {
		Util.de(totalCount[0]);
	}
	
	// Populate section and initialize hovers
	var secHTML = html;
	secContent.innerHTML = secHTML;
	secInit(pre + "-info", secContent);
	expColInit(secContent, "sub-sec-hd-tgl");
		// Add count and "Add" functionality
	var totalTxt = count;
	var secCL = Util.Style.g("sec-title", curSec[0], "span");
	var secSpan = Util.gc(secCL[0]);
	var totalSpan = Util.cep("span", {"className" : "sec-total"});
	var spanText = document.createTextNode(totalTxt);
	Util.ac(spanText, totalSpan);
	var totalBefore = _g(pre + "Add");
	secSpan.insertBefore(totalSpan, totalBefore);
	// Add scroll functionality
	if (scrollNum > 0) {
	    
	if(prefSec=="lrSec")
	{
	    

		 if (lrcnt < scrollNum) {
			 secContent.style.height = 'auto';
		 }
		 else {
			var th1=0;
			var totalHeight1;
			th1 = 1.5 * scrollNum //using line height factor for now due to closed sections not having clientHeight
			totalHeight1 = th1+"em";

			secContent.style.height = totalHeight1;
			secContent.style.overflowY = 'scroll';
			secContent.style.overflowX = 'hidden';
		 }   
	}
	
	else
    {	
		 var results = Util.Style.g(pre + "-info", secContent, "dl");
		 var numberOfResults = results.length;

		 if (numberOfResults < scrollNum) {
			 secContent.style.height = 'auto';
		 }
		 else {
			var th=0;
			var totalHeight;
			th = 1.5 * scrollNum //using line height factor for now due to closed sections not having clientHeight
			totalHeight = th+"em";

			secContent.style.height = totalHeight;
			secContent.style.overflowY = 'scroll';
		 }
		 }
	}
}	

function pmhLoad(pmhInput)
{
  	var pmhData = pmhInput;
	if(debugFlag){
	logRecord("Past Medical History JSON:");
	logRecord(pmhData);
    }
	var jsonEval = JSON.parse(pmhData);
    var pmhhtml = "";
    var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var pmhArray = [];
	if(status=="S")
	{
	    var pmhLen = jsonEval.RECORD_DATA.PASTMED_CNT;
		for(var i=0; i<pmhLen; i++)
		{
			if( jsonEval.RECORD_DATA.PASTMED[i].CODE=="" || jsonEval.RECORD_DATA.PASTMED[i].CODE==null )
			{
			    
				 pmhArray.push("<dl class='pmh-info'><dt class='pmh-det-hd'>Past Medical Information</dt><dd class='pmh-name'>",  jsonEval.RECORD_DATA.PASTMED[i].NAME,
				"</dd>");
				
			}
			else
			{
			    pmhArray.push("<dl class='pmh-info'><dt class='pmh-det-hd'>Past Medical Information</dt><dd class='pmh-name'>",  jsonEval.RECORD_DATA.PASTMED[i].NAME,
				"</dd><dt><span>Code:</span></dt><dd class='pmh-code'>(", jsonEval.RECORD_DATA.PASTMED[i].CODE,
				")");
			}
			
			pmhArray.push("</dd></dl><h4 class='pmh-det-hd'><span>Past Medical Details</span></h4><dl class='pmh-det hvr'><dt><span>Problem:</span></dt><dd><span>", jsonEval.RECORD_DATA.PASTMED[i].NAME,
			"</span></dd><dt><span>Onset Date:</span></dt><dd><span>", jsonEval.RECORD_DATA.PASTMED[i].ONSET_DATE, 
			"</span></dd><dt><span>Resolved Date:</span></dt><dd><span>", jsonEval.RECORD_DATA.PASTMED[i].RES_DATE,
			"</span></dd><dt><span>Status:</span></dt><dd><span>", jsonEval.RECORD_DATA.PASTMED[i].STATUS,
			"</span></dd><dt><span>Comments:</span></dt><dd><span>", jsonEval.RECORD_DATA.PASTMED[i].COMMENTS,
			"</span></dd></dl>");
		}
	}
	else if(status=="Z")
	{
	    pmhArray.push(HandleNoDataResponse("pmh"));
	}
	else 
	{
	    pmhArray.push(HandleErrorResponse("pmh"));
	}
	
	pmhhtml = pmhArray.join("");
	if(pmhLen==null||pmhLen=="")
	{
	    pmhLen = 0;
	}
	var countText = "("+pmhLen+")";
    //secLoad(pmhhtml, "pmh", countText, 5);
	sec1load(pmhhtml,"pmh",countText);
}

// load Procedure History
function phLoad(xhr)
{
    //var phData = '{"RECORD_DATA": {"PROC_CNT": 2,"PROC": [{"NAME": "Amniocentesis; diagnostic","DATE": "","ONSET": "","LOCATION": "BASELINE EAST M","PROVIDER": "Turk , Sean","COMMENT": "","STATUS": "Active" },{"NAME": "Zoster (shingles) vaccine, live, for subcutaneous injection","DATE": "1999","ONSET": "1999","LOCATION": "BASELINE WEST M","PROVIDER": "Turk , Sean","COMMENT": "01\/29\/10 14:06 - Turk , Sean This is a test of the emergency broadcast system.  This is only a test.  In the event of a real emergency, panic dramatically and hunt down your weak neighbors for food.  You saw the way they were looking at you, with those shifty eyes.  Its kill or be killed.","STATUS": "Active" } ],"STATUS_DATA": {"STATUS": "S","SUBEVENTSTATUS": {"OPERATIONNAME": "","OPERATIONSTATUS": "","TARGETOBJECTNAME": "","TARGETOBJECTVALUE": "" } } }}';
	var phData = xhr;
	if(debugFlag){
	logRecord("Procedure History JSON:");
	logRecord(phData);
    }
	var jsonEval = JSON.parse(phData);
    var phhtml = "";
    var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var phArray = [];
	if(status=="S")
	{
	    for(var i=0; i<jsonEval.RECORD_DATA.PROC_CNT; i++)
		{
		    
			phArray.push("<dl class='ph-info'><dt class='ph-det-hd'>Procedure Information</dt><dd class='ph-name'>", jsonEval.RECORD_DATA.PROC[i].NAME,
//certrn - failing			             "</dd><dd class='ph-date'>", fmtDt(jsonEval.RECORD_DATA.PROC[i].DATE,"shortDate"),
			             "</dd><dd class='ph-date'>", jsonEval.RECORD_DATA.PROC[i].DATE,
						 "</dd></dl><h4 class='ph-det-hd'>Documentation Details</h4><dl class='ph-det hvr'><dt><span>Procedure:</span></dt><dd><span>", jsonEval.RECORD_DATA.PROC[i].NAME,
			             "</span></dd><dt><span>Procedure Date:</span></dt><dd><span>", jsonEval.RECORD_DATA.PROC[i].DATE, 
						 "</span></dd><dt><span>Status:</span></dt><dd><span>", jsonEval.RECORD_DATA.PROC[i].STATUS, 
						 "</span></dd><dt><span>Provider:</span></dt><dd><span>", jsonEval.RECORD_DATA.PROC[i].PROVIDER,
						 "</span></dd><dt><span>Location:</span></dt><dd><span>", jsonEval.RECORD_DATA.PROC[i].LOCATION,
						 "</span></dd><dt><span>Comment:</span></dt><dd><span>", jsonEval.RECORD_DATA.PROC[i].COMMENT,
						 "</span></dd></dl>");
			            
		}   
	}
	else if(status=="Z")
	{
	    phArray.push(HandleNoDataResponse("ph"));
	}
	else 
	{
	    phArray.push(HandleErrorResponse("ph"));
	}
	
	phhtml = phArray.join("");
	var countText = "("+jsonEval.RECORD_DATA.PROC_CNT+")";
    //secLoad(phhtml, "ph", countText, 5);
	sec1load(phhtml,"ph",countText);
}

function getWidth()
{
	var widthObj = new Object();
	widthObj.width = document.body.offsetWidth;  //006 
	return(widthObj);
}			

function assessLoad(assessInput)
{
	var th=0;
	var totalHeight;
	th = 1.5 * (assesscount); 
	th+= 3;
	totalHeight = th+"em";
	var setWidth = getWidth();
	var width = setWidth.width;
	var datecolWidth = Math.round(width*0.11);
	var remcolWidth = Math.round(width*0.9);
	//var assessData = '{"RECORD_DATA": {"ASSESSMENT_EVENTS": [{"EVENT_CD": 4623292.000000,"EVENT_DISPLAY": "Antepartum Note"},{"EVENT_CD": 4622426.000000,"EVENT_DISPLAY": "Next Appointment" },{"EVENT_CD": 3006516.000000,"EVENT_DISPLAY": "Glucose Urine Dipstick" },{"EVENT_CD": 3006510.000000,"EVENT_DISPLAY": "Protein Urine Dipstick" },{"EVENT_CD": 4628767.000000,"EVENT_DISPLAY": "Weight Measured" },{"EVENT_CD": 2700654.000000,"EVENT_DISPLAY": "zzWeight" },{"EVENT_CD": 703516.000000,"EVENT_DISPLAY": "Diastolic Blood Pressure" },{"EVENT_CD": 703501.000000,"EVENT_DISPLAY": "Systolic Blood Pressure" },{"EVENT_CD": 711264.000000,"EVENT_DISPLAY": "Fetal Station" },{"EVENT_CD": 711180.000000,"EVENT_DISPLAY": "Cervix Effacement" },{"EVENT_CD": 711177.000000,"EVENT_DISPLAY": "Cervix Dilation" },{"EVENT_CD": 711261.000000,"EVENT_DISPLAY": "Preterm Labor Signs" }],"QUAL": [{"COMMENT_ASSESS_FLAG": 1,"DATA_DT_TM": "2010-01-25T23:17:00Z","COMMENT_TEXT": "This is yet another comment test.","ASSESSMENT_DATA": [] },{"COMMENT_ASSESS_FLAG": 0,"DATA_DT_TM": "2009-12-23T17:08:00Z","COMMENT_TEXT": "","ASSESSMENT_DATA": [{"EVENT_CODE": 4628767.000000,"EVENT_RESULT": "70.000" } ] },{"COMMENT_ASSESS_FLAG": 1,"DATA_DT_TM": "2009-07-25T13:00:00Z","COMMENT_TEXT": "Morning comment test","ASSESSMENT_DATA": [] },{"COMMENT_ASSESS_FLAG": 2,"DATA_DT_TM": "2009-07-25T21:54:00Z","COMMENT_TEXT": "This is a test comment","ASSESSMENT_DATA": [ {"EVENT_CODE": 4628767.000000,"EVENT_RESULT": "70.000"}, {"EVENT_CODE": 703516.000000,"EVENT_RESULT": "80"},{"EVENT_CODE": 703501.000000,"EVENT_RESULT": "120" } ] },{"COMMENT_ASSESS_FLAG": 1,"DATA_DT_TM": "2009-07-25T22:18:00Z","COMMENT_TEXT": "Way back test.","ASSESSMENT_DATA": [] },{"COMMENT_ASSESS_FLAG": 2,"DATA_DT_TM": "2009-07-27T21:54:00Z","COMMENT_TEXT": "This is a test comment","ASSESSMENT_DATA": [ {"EVENT_CODE": 4628767.000000,"EVENT_RESULT": "70.000"}, {"EVENT_CODE": 703516.000000,"EVENT_RESULT": "80"},{"EVENT_CODE": 703501.000000,"EVENT_RESULT": "120" } ] } ],"STATUS_DATA": {"STATUS": "S","SUBEVENTSTATUS": {"OPERATIONNAME": "","OPERATIONSTATUS": "","TARGETOBJECTNAME": "","TARGETOBJECTVALUE": "" } } }}';
	var assessData = assessInput;
	if(debugFlag){
		logRecord("Assessments 1 JSON:");
		logRecord(assessData);
    }
	var jsonEval = JSON.parse(assessData);
	var assesshtml = "";
	var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var assessArray = [];
	var colArray = [];
	var idCnt = 0;
	var rwcol = "";
	var cnt1 = 0;
	var prev = "";
	var cnt2 = 0;
	var faceupEventsCnt = 11;
	
	if(status=="S")
	{ 
		var eventLen = jsonEval.RECORD_DATA.ASSESSMENT_EVENTS.length;
		var colWidth = 0;
		if(eventLen<=faceupEventsCnt)			//no horizontal scroll yet - fill width evenly
		{
			colWidth = Math.round(remcolWidth/eventLen);
		}
		else					//too many columns - set fixed with and scroll
		{
			colWidth = Math.round(remcolWidth/faceupEventsCnt);
		}
		var cmtcnt = 0;
		var assessCnt = 0;
		var totcnt = 0;
		var colWidthUOM = colWidth + 20;		//push column width out slightly for UOM
		var tblWidth = (eventLen * colWidth) + datecolWidth;
      
		for(var cnt=0; cnt<jsonEval.RECORD_DATA.QUAL.length; cnt++)
		{
			if(jsonEval.RECORD_DATA.QUAL[cnt].ASSESSMENT_DATA.length >0)
			++assessCnt;
			if(jsonEval.RECORD_DATA.QUAL[cnt].DYNAMIC_LIST.length >0){
				for( var cnt2 =0; cnt2 < jsonEval.RECORD_DATA.QUAL[cnt].DYNAMIC_LIST.length; cnt2++){	
					assessCnt += jsonEval.RECORD_DATA.QUAL[cnt].DYNAMIC_LIST[cnt2].DYNAMIC_DATA.length;
				}
			}
		}

		for(var i=0; i<jsonEval.RECORD_DATA.QUAL.length; i++)
		{
			if(jsonEval.RECORD_DATA.QUAL[i].COMMENT_ASSESS_FLAG==2 || jsonEval.RECORD_DATA.QUAL[i].COMMENT_ASSESS_FLAG==1)
			{
				cmtcnt++;
			}
		}
		
		totcnt = assessCnt + cmtcnt;
		if(cmtcnt>0)		//add line above column headers if comments exist for "Show/Hide"
		{
			assessArray.push("<table><tr><td class='assess-drpdn'><span>View Graph:</span><form><select id='graphTask' onchange='pregFunction(this.form.graphTask)'><option class='drop' value='Select'>select graph</option><option value='FundalG'>Fundal Graph</option><option value='LaborG'>Labor Graph</option></select></form></td><td style='width:5%'><span>&nbsp;</span></td><td style='width:20%'><a href='javascript:dispDiv("+cmtcnt+")'><span class='dispDiv'>Collapse Comments</span></a></td></tr></table>");
		}
		else
		{
			assessArray.push("<table><tr><td class='assess-drpdn'><span>View Graph:</span><form><select id='graphTask' onchange='pregFunction(this.form.graphTask)'><option class='drop' value='Select'>select graph</option><option value='FundalG'>Fundal Graph</option><option value='LaborG'>Labor Graph</option></select></form></td><td style='width:5%'><span>&nbsp;</span></td><td style='width:20%'><span>&nbsp;</span></td></tr></table>");
		}

		if(eventLen<=faceupEventsCnt)			//no horizontal scroll
		{
			if( totcnt>assesscount)
			{
				assessArray.push("<div style='overflow-y:scroll; overflow-x:hidden; height:"+totalHeight+";' ><table class='assess-table'><th class='result1' style='width:"+datecolWidth+"px;' >Date</th>"); 
			}	
			else
			{
				assessArray.push("<div><table class='assess-table'><th class='result1' style='width:"+datecolWidth+"px;' >Date</th>");
			}			
		}
		else						//add horizontal scroll
		{
			if( totcnt>assesscount)
			{
				assessArray.push("<div class='hscroll' style='width:100%; height:"+totalHeight+"; overflow-y:scroll;'><table class='assess-table' style='width:"+tblWidth+"px'><th class='label1' style='width:"+datecolWidth+"px' >Date</th>");
			}	
			else
			{
				assessArray.push("<div class='hscroll' style='width:100%;'><table class='assess-table' style='width:"+tblWidth+"px'><th class='label1' style='width:"+datecolWidth+"px' >Date</th>");
			}
		}

		for(var i=0; i<eventLen; i++)	//create event/column title row
		{
			colArray[i] = jsonEval.RECORD_DATA.ASSESSMENT_EVENTS[i].EVENT_CD;
			assessArray.push("<th class='label'  style='width:"+colWidth+"px'>", jsonEval.RECORD_DATA.ASSESSMENT_EVENTS[i].EVENT_DISPLAY,"</th>");	
		}
		assessArray.push("</tr>");
		
		for(var j=0; j<jsonEval.RECORD_DATA.QUAL.length; j++)		//build the rows of data based on type assessment/comment/both
		{
			var color; 
			var rem = j%2;
			if(rem==0)
			{
				color = "alt1";
			}
			else
			{
				color = "alt2"; 
			}

			var latestDate = fmtDt(jsonEval.RECORD_DATA.QUAL[j].DATA_DT_TM,"shortDate");
			var latestDate1 = fmtDt(jsonEval.RECORD_DATA.QUAL[j].DATA_DT_TM,"longDateTime2");
			var cmtFlag = jsonEval.RECORD_DATA.QUAL[j].COMMENT_ASSESS_FLAG;
			var cmtTxt = jsonEval.RECORD_DATA.QUAL[j].COMMENT_TEXT;
			var evecdArray = [];
			var everesArray = [];
			var dlistresArray = [];
			var dlistcdArray = [];
			var dlistunitArray = [];

			if(j>0)				//code for line zebra striping
			{
				var prevDate = fmtDt(jsonEval.RECORD_DATA.QUAL[j-1].DATA_DT_TM,"shortDate");
			    if(latestDate!=prevDate)
		        {
		            if (prev == color && prev == "alt1")
				    {
				       rwcol = "alt2";
					   var color1="alt2";
			           cnt=0;
				   }
				   else if (prev == color && prev == "alt2")
				   {
				       rwcol = "alt1";
					   var color1="alt1";
			           cnt=0;
				   }
				   else
			       {
			           rwcol = color;
			           var color1=color;
			           cnt=0;
			       }
				    cnt1 =0 ;   
					cnt2++;
					prev = rwcol;
			    }
			    else
		        {
					cnt++;
					cnt1++;
					if(cnt>0)
					{
					   rwcol = color1;
					}
					prev = rwcol;
		        }  
		    }
		    else			//j == 0 so start zebra striping
		    {
		        var rwcol = color;
			    var color1 = color;
			    prev = rwcol;
		    }
		   
			if(cmtFlag==0)			//assessment only line
			{
		       assessArray.push("<tr class='"+rwcol+"'><td class='result1' style='width:"+datecolWidth+"px' >", latestDate1,"</td>");
		       for(k=0; k<jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA.length; k++)
			   {
			       evecdArray[k]= jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[k].EVENT_CODE;
				   everesArray[k]= jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[k].EVENT_RESULT;
			   } 
               
			   if(jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length >0)
			   {
					for( var dlist =0; dlist < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length; dlist++)	
					{
					   for( var dlist1 =0; dlist1 < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA.length; dlist1++)
					   {
						   dlistcdArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_CODE;
						   dlistresArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_RESULT;
						   dlistunitArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_RESULT_UNITS;
						   
					   }
					} 
               }			   
			   for(l=0; l<eventLen; l++)
			   {
			       var cnt=0;
			      for(m=0; m<evecdArray.length; m++)
				   {
                       var eventUnit = jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].EVENT_RESULT_UNITS;				    
					   if(colArray[l]==evecdArray[m])
					   {
					       if(eventUnit==""||eventUnit==null)
						   {
						   
						        if(jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].DYNAMIC_LABEL_FLAG==1)
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >"+ everesArray[m] +"<span class='unit'>("+ jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LABEL + ")</span></td>");
								}
								else
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >", everesArray[m], "</td>");
								}
								cnt=1;
								break;
						   }
						   else
						   {
						       
							   if(jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].DYNAMIC_LABEL_FLAG==1)
								{
								    assessArray.push("<td class='result' style='width:"+colWidthUOM+"px' >"+ everesArray[m] + "<span class='unit'>" + eventUnit + "</span><span class='unit'>(" + jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LABEL + ")</span></td>");
								}
								else
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >", everesArray[m], "<span class='unit'>", eventUnit, "</span></td>");
								}
								cnt=1;
								break;
						   }
					   }
				   }
				   if(cnt==0)
				   {
				       assessArray.push("<td class='result' style='width:"+colWidth+"px' >--</td>");
				   }
			   }
			   assessArray.push("</tr>");
			   
				if(jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length >0)
				{
					assessArray.push("<tr class='"+rwcol+"'>");
					assessArray.push("<td class='result1' style='width:"+datecolWidth+"px' >", latestDate1,"</td>")
					for( var dlist =0; dlist < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length; dlist++)
					{
						for(var cdList=0; cdList<eventLen; cdList++)
						{
							var cnt=0;
							for(m=0; m<dlistcdArray.length; m++)
							{
								if(colArray[cdList]==dlistcdArray[m])
								{
									if(dlistunitArray[m] == "" || dlistunitArray[m] == null)
									{
										assessArray.push("<td class='result' style='width:"+colWidth+"px' >"+ dlistresArray[m]+ "<span class='unit'>(" + jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_LABEL + ")</span></td>");
									}
									else
									{
										assessArray.push("<td class='result' style='width:"+colWidthUOM+"px' >"+ dlistresArray[m]+ "<span class='unit'>"+ dlistunitArray[m] + "</span><span class='unit'>(" +  jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_LABEL + ")</span></td>");
									}
									cnt=1;
									break;
								}
							}
							if(cnt==0)
							{
								assessArray.push("<td class='result' style='width:"+colWidth+"px' >--</td>");
							}
						}
					}
					assessArray.push("</tr>");
				}
			}
			else if (cmtFlag==2)				//assessment and comment line
			{
				assessArray.push("<tr class='"+rwcol+"' ><td class='result1' style='width:"+datecolWidth+"px' >", latestDate1,"</td>");
				for(k=0; k<jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA.length; k++)
				{
					evecdArray[k]= jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[k].EVENT_CODE;
					everesArray[k]= jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[k].EVENT_RESULT;
				}
				
				if(jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length >0)
				{
					for( var dlist =0; dlist < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length; dlist++)	
					{
						for( var dlist1 =0; dlist1 < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA.length; dlist1++)
						{
							dlistcdArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_CODE;
							dlistresArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_RESULT;
							dlistunitArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_RESULT_UNITS;
						}
					}
				}

				for(l=0; l<eventLen; l++)
				{
					var cnt=0;
					for(m=0; m<evecdArray.length; m++)
					{
						var eventUnit = jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].EVENT_RESULT_UNITS;				    
						if(colArray[l]==evecdArray[m])
						{
							if(eventUnit==""||eventUnit==null)
							{
						   
						        if(jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].DYNAMIC_LABEL_FLAG==1)
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >"+ everesArray[m] +"<span class='unit'>("+ jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LABEL + ")</span></td>");
								}
								else
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >", everesArray[m], "</td>");
								}
								cnt=1;
								break;
							}
							else
							{
							   if(jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].DYNAMIC_LABEL_FLAG==1)
								{
								    assessArray.push("<td class='result' style='width:"+colWidthUOM+"px' >"+ everesArray[m] + "<span class='unit'>" + eventUnit + "</span><span class='unit'>(" + jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LABEL + ")</span></td>");
								}
								else
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >", everesArray[m], 
									"<span class='unit'>", eventUnit,
									"</span></td>");
								}
								cnt=1;
								break;
							}
						}
					}
					if(cnt==0)
					{
					   assessArray.push("<td class='result' style='width:"+colWidth+"px' >--</td>");
					}
				}
				assessArray.push("</tr>");

				if(jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length >0)
				{
					assessArray.push("<tr class='"+rwcol+"'>");
					assessArray.push("<td class='result1' style='width:"+datecolWidth+"px' >", latestDate1,"</td>");
					for( var dlist =0; dlist < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length; dlist++)
					{
						for(var cdList=0; cdList<eventLen; cdList++)
						{
							var cnt=0;
							for(m=0; m<dlistcdArray.length; m++)
							{
								if(colArray[cdList]==dlistcdArray[m])
								{
									if(dlistunitArray[m] == "" || dlistunitArray[m] == null)
									{
										assessArray.push("<td class='result' style='width:"+colWidth+"px' >"+ dlistresArray[m]+ "<span class='unit'>(" + jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_LABEL + ")</span></td>");
									}
									else
									{
										assessArray.push("<td class='result' style='width:"+colWidthUOM+"px' >"+ dlistresArray[m]+ "<span class='unit'>"+ dlistunitArray[m] + "</span><span class='unit'>(" +  jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_LABEL + ")</span></td>");
									}
									cnt=1;
									break;
								}
							}
							if(cnt==0)
							{
								assessArray.push("<td class='result' style='width:"+colWidth+"px' >--</td>");
							}
						}
					}
					assessArray.push("</tr>");
				}
			   
				assessArray.push("<tr class='"+rwcol+"' id='"+idCnt+"' ><td class='result1' style='width:"+datecolWidth+"px' >",latestDate1,"</td>");
				assessArray.push("<td colspan='", eventLen,"'>", cmtTxt,"</td></tr>");
				idCnt++;
			}
			else if (cmtFlag==1)				//comment only line
			{
				assessArray.push("<tr class='"+rwcol+"' id='"+idCnt+"'><td class='result1' style='width:"+datecolWidth+"px' >", latestDate1,"</td>");
				assessArray.push("<td colspan='", eventLen,"'>", cmtTxt,"</td></tr>");
				idCnt++;
			}
			else								//no data for the row?
			{
				for(n=0; n<eventLen; n++)
				{
				   assessArray.push("<td class='result' style='width:"+colWidth+"px' >--</td>");
				}
				assessArray.push("</tr>");
			}
		}
		assessArray.push("<tr><td class='result1'>&nbsp;</td><td colspan='12'>&nbsp;</td></tr>"); 
		assessArray.push("</table></div>");  
	}
	else if(status=="Z")
	{
		assessArray.push(HandleNoDataResponse("assess"));
	}
	else 
	{
		assessArray.push(HandleErrorResponse("assess"));
	}
	  
	assesshtml = assessArray.join("");
	var countText = "";

	sec1load(assesshtml,"assess",countText);
}

function assess2Load(assessInput)
{
	var th=0;
	var totalHeight;
	th = 1.5 * (assess2count); 
	th+= 3;
	totalHeight = th+"em";
	var setWidth = getWidth();
	var width = setWidth.width;
	var datecolWidth = Math.round(width*0.11);
	var remcolWidth = Math.round(width*0.9);
	//var assessData = '{"RECORD_DATA": {"ASSESSMENT_EVENTS": [{"EVENT_CD": 4623292.000000,"EVENT_DISPLAY": "Antepartum Note"},{"EVENT_CD": 4622426.000000,"EVENT_DISPLAY": "Next Appointment" },{"EVENT_CD": 3006516.000000,"EVENT_DISPLAY": "Glucose Urine Dipstick" },{"EVENT_CD": 3006510.000000,"EVENT_DISPLAY": "Protein Urine Dipstick" },{"EVENT_CD": 4628767.000000,"EVENT_DISPLAY": "Weight Measured" },{"EVENT_CD": 2700654.000000,"EVENT_DISPLAY": "zzWeight" },{"EVENT_CD": 703516.000000,"EVENT_DISPLAY": "Diastolic Blood Pressure" },{"EVENT_CD": 703501.000000,"EVENT_DISPLAY": "Systolic Blood Pressure" },{"EVENT_CD": 711264.000000,"EVENT_DISPLAY": "Fetal Station" },{"EVENT_CD": 711180.000000,"EVENT_DISPLAY": "Cervix Effacement" },{"EVENT_CD": 711177.000000,"EVENT_DISPLAY": "Cervix Dilation" },{"EVENT_CD": 711261.000000,"EVENT_DISPLAY": "Preterm Labor Signs" }],"QUAL": [{"COMMENT_ASSESS_FLAG": 1,"DATA_DT_TM": "2010-01-25T23:17:00Z","COMMENT_TEXT": "This is yet another comment test.","ASSESSMENT_DATA": [] },{"COMMENT_ASSESS_FLAG": 0,"DATA_DT_TM": "2009-12-23T17:08:00Z","COMMENT_TEXT": "","ASSESSMENT_DATA": [{"EVENT_CODE": 4628767.000000,"EVENT_RESULT": "70.000" } ] },{"COMMENT_ASSESS_FLAG": 1,"DATA_DT_TM": "2009-07-25T13:00:00Z","COMMENT_TEXT": "Morning comment test","ASSESSMENT_DATA": [] },{"COMMENT_ASSESS_FLAG": 2,"DATA_DT_TM": "2009-07-25T21:54:00Z","COMMENT_TEXT": "This is a test comment","ASSESSMENT_DATA": [ {"EVENT_CODE": 4628767.000000,"EVENT_RESULT": "70.000"}, {"EVENT_CODE": 703516.000000,"EVENT_RESULT": "80"},{"EVENT_CODE": 703501.000000,"EVENT_RESULT": "120" } ] },{"COMMENT_ASSESS_FLAG": 1,"DATA_DT_TM": "2009-07-25T22:18:00Z","COMMENT_TEXT": "Way back test.","ASSESSMENT_DATA": [] },{"COMMENT_ASSESS_FLAG": 2,"DATA_DT_TM": "2009-07-27T21:54:00Z","COMMENT_TEXT": "This is a test comment","ASSESSMENT_DATA": [ {"EVENT_CODE": 4628767.000000,"EVENT_RESULT": "70.000"}, {"EVENT_CODE": 703516.000000,"EVENT_RESULT": "80"},{"EVENT_CODE": 703501.000000,"EVENT_RESULT": "120" } ] } ],"STATUS_DATA": {"STATUS": "S","SUBEVENTSTATUS": {"OPERATIONNAME": "","OPERATIONSTATUS": "","TARGETOBJECTNAME": "","TARGETOBJECTVALUE": "" } } }}';
	var assessData = assessInput;
	if(debugFlag){
		logRecord("Assessments 2 JSON:");
		logRecord(assessData);
    }
	var jsonEval = JSON.parse(assessData);
	var assesshtml = "";
	var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var assessArray = [];
	var colArray = [];
	var idCnt = 0;
	var rwcol = "";
	var cnt1 = 0;
	var prev = "";
	var cnt2 = 0;
	var faceupEventsCnt = 11;
	
	if(status=="S")
	{ 
		var eventLen = jsonEval.RECORD_DATA.ASSESSMENT_EVENTS.length;
		var colWidth = 0;
		if(eventLen<=faceupEventsCnt)			//no horizontal scroll yet - fill width evenly
		{
			colWidth = Math.round(remcolWidth/eventLen);
		}
		else					//too many columns - set fixed with and scroll
		{
			colWidth = Math.round(remcolWidth/faceupEventsCnt);
		}
		var cmtcnt = 0;
		var assessCnt = 0;
		var totcnt = 0;
		var colWidthUOM = colWidth + 20;		//push column width out slightly for UOM
		var tblWidth = (eventLen * colWidth) + datecolWidth;
      
		for(var cnt=0; cnt<jsonEval.RECORD_DATA.QUAL.length; cnt++)
		{
			if(jsonEval.RECORD_DATA.QUAL[cnt].ASSESSMENT_DATA.length >0)
			++assessCnt;
			if(jsonEval.RECORD_DATA.QUAL[cnt].DYNAMIC_LIST.length >0){
				for( var cnt2 =0; cnt2 < jsonEval.RECORD_DATA.QUAL[cnt].DYNAMIC_LIST.length; cnt2++){	
					assessCnt += jsonEval.RECORD_DATA.QUAL[cnt].DYNAMIC_LIST[cnt2].DYNAMIC_DATA.length;
				}
			}
		}

		for(var i=0; i<jsonEval.RECORD_DATA.QUAL.length; i++)
		{
			if(jsonEval.RECORD_DATA.QUAL[i].COMMENT_ASSESS_FLAG==2 || jsonEval.RECORD_DATA.QUAL[i].COMMENT_ASSESS_FLAG==1)
			{
				cmtcnt++;
			}
		}
		
		totcnt = assessCnt + cmtcnt;
		if(cmtcnt>0)		//add line above column headers if comments exist for "Show/Hide"
		{
			assessArray.push("<table><tr><td class='assess-drpdn'><span>&nbsp;</span></td><td style='width:5%'><span>&nbsp;</span></td><td style='width:20%'><a href='javascript:dispDiv2("+cmtcnt+")'><span class='dispDiv2'>Collapse Comments</span></a></td></tr></table>");
		}

		if(eventLen<=faceupEventsCnt)			//no horizontal scroll
		{
			if( totcnt>assess2count)
			{
				assessArray.push("<div style='overflow-y:scroll; overflow-x:hidden; height:"+totalHeight+";' ><table class='assess-table'><th class='result1' style='width:"+datecolWidth+"px;' >Date</th>"); 
			}	
			else
			{
				assessArray.push("<div><table class='assess-table'><th class='result1' style='width:"+datecolWidth+"px;' >Date</th>");
			}			
		}
		else						//add horizontal scroll
		{
			if( totcnt>assess2count)
			{
				assessArray.push("<div class='hscroll' style='width:100%; height:"+totalHeight+"; overflow-y:scroll;'><table class='assess-table' style='width:"+tblWidth+"px'><th class='label1' style='width:"+datecolWidth+"px' >Date</th>");
			}	
			else
			{
				assessArray.push("<div class='hscroll' style='width:100%;'><table class='assess-table' style='width:"+tblWidth+"px'><th class='label1' style='width:"+datecolWidth+"px' >Date</th>");
			}
		}

		for(var i=0; i<eventLen; i++)	//create event/column title row
		{
			colArray[i] = jsonEval.RECORD_DATA.ASSESSMENT_EVENTS[i].EVENT_CD;
			assessArray.push("<th class='label'  style='width:"+colWidth+"px'>", jsonEval.RECORD_DATA.ASSESSMENT_EVENTS[i].EVENT_DISPLAY,"</th>");	
		}
		assessArray.push("</tr>");
		
		for(var j=0; j<jsonEval.RECORD_DATA.QUAL.length; j++)		//build the rows of data based on type assessment/comment/both
		{
			var color; 
			var rem = j%2;
			if(rem==0)
			{
				color = "alt1";
			}
			else
			{
				color = "alt2"; 
			}

			var latestDate = fmtDt(jsonEval.RECORD_DATA.QUAL[j].DATA_DT_TM,"shortDate");
			var latestDate1 = fmtDt(jsonEval.RECORD_DATA.QUAL[j].DATA_DT_TM,"longDateTime2");
			var cmtFlag = jsonEval.RECORD_DATA.QUAL[j].COMMENT_ASSESS_FLAG;
			var cmtTxt = jsonEval.RECORD_DATA.QUAL[j].COMMENT_TEXT;
			var evecdArray = [];
			var everesArray = [];
			var dlistresArray = [];
			var dlistcdArray = [];
			var dlistunitArray = [];

			if(j>0)				//code for line zebra striping
			{
				var prevDate = fmtDt(jsonEval.RECORD_DATA.QUAL[j-1].DATA_DT_TM,"shortDate");
			    if(latestDate!=prevDate)
		        {
		            if (prev == color && prev == "alt1")
				    {
				       rwcol = "alt2";
					   var color1="alt2";
			           cnt=0;
				   }
				   else if (prev == color && prev == "alt2")
				   {
				       rwcol = "alt1";
					   var color1="alt1";
			           cnt=0;
				   }
				   else
			       {
			           rwcol = color;
			           var color1=color;
			           cnt=0;
			       }
				    cnt1 =0 ;   
					cnt2++;
					prev = rwcol;
			    }
			    else
		        {
					cnt++;
					cnt1++;
					if(cnt>0)
					{
					   rwcol = color1;
					}
					prev = rwcol;
		        }  
		    }
		    else			//j == 0 so start zebra striping
		    {
		        var rwcol = color;
			    var color1 = color;
			    prev = rwcol;
		    }
		   
			if(cmtFlag==0)			//assessment only line
			{
		       assessArray.push("<tr class='"+rwcol+"'><td class='result1' style='width:"+datecolWidth+"px' >", latestDate1,"</td>");
		       for(k=0; k<jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA.length; k++)
			   {
			       evecdArray[k]= jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[k].EVENT_CODE;
				   everesArray[k]= jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[k].EVENT_RESULT;
			   } 
               
			   if(jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length >0)
			   {
					for( var dlist =0; dlist < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length; dlist++)	
					{
					   for( var dlist1 =0; dlist1 < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA.length; dlist1++)
					   {
						   dlistcdArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_CODE;
						   dlistresArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_RESULT;
						   dlistunitArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_RESULT_UNITS;
						   
					   }
					} 
               }			   
			   for(l=0; l<eventLen; l++)
			   {
			       var cnt=0;
			      for(m=0; m<evecdArray.length; m++)
				   {
                       var eventUnit = jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].EVENT_RESULT_UNITS;				    
					   if(colArray[l]==evecdArray[m])
					   {
					       if(eventUnit==""||eventUnit==null)
						   {
						   
						        if(jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].DYNAMIC_LABEL_FLAG==1)
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >"+ everesArray[m] +"<span class='unit'>("+ jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LABEL + ")</span></td>");
								}
								else
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >", everesArray[m], "</td>");
								}
								cnt=1;
								break;
						   }
						   else
						   {
						       
							   if(jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].DYNAMIC_LABEL_FLAG==1)
								{
								    assessArray.push("<td class='result' style='width:"+colWidthUOM+"px' >"+ everesArray[m] + "<span class='unit'>" + eventUnit + "</span><span class='unit'>(" + jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LABEL + ")</span></td>");
								}
								else
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >", everesArray[m], "<span class='unit'>", eventUnit, "</span></td>");
								}
								cnt=1;
								break;
						   }
					   }
				   }
				   if(cnt==0)
				   {
				       assessArray.push("<td class='result' style='width:"+colWidth+"px' >--</td>");
				   }
			   }
			   assessArray.push("</tr>");
			   
				if(jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length >0)
				{
					assessArray.push("<tr class='"+rwcol+"'>");
					assessArray.push("<td class='result1' style='width:"+datecolWidth+"px' >", latestDate1,"</td>")
					for( var dlist =0; dlist < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length; dlist++)
					{
						for(var cdList=0; cdList<eventLen; cdList++)
						{
							var cnt=0;
							for(m=0; m<dlistcdArray.length; m++)
							{
								if(colArray[cdList]==dlistcdArray[m])
								{
									if(dlistunitArray[m] == "" || dlistunitArray[m] == null)
									{
										assessArray.push("<td class='result' style='width:"+colWidth+"px' >"+ dlistresArray[m]+ "<span class='unit'>(" + jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_LABEL + ")</span></td>");
									}
									else
									{
										assessArray.push("<td class='result' style='width:"+colWidthUOM+"px' >"+ dlistresArray[m]+ "<span class='unit'>"+ dlistunitArray[m] + "</span><span class='unit'>(" +  jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_LABEL + ")</span></td>");
									}
									cnt=1;
									break;
								}
							}
							if(cnt==0)
							{
								assessArray.push("<td class='result' style='width:"+colWidth+"px' >--</td>");
							}
						}
					}
					assessArray.push("</tr>");
				}
			}
			else if (cmtFlag==2)				//assessment and comment line
			{
				assessArray.push("<tr class='"+rwcol+"' ><td class='result1' style='width:"+datecolWidth+"px' >", latestDate1,"</td>");
				for(k=0; k<jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA.length; k++)
				{
					evecdArray[k]= jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[k].EVENT_CODE;
					everesArray[k]= jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[k].EVENT_RESULT;
				}
				
				if(jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length >0)
				{
					for( var dlist =0; dlist < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length; dlist++)	
					{
						for( var dlist1 =0; dlist1 < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA.length; dlist1++)
						{
							dlistcdArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_CODE;
							dlistresArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_RESULT;
							dlistunitArray[dlist1] = jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_DATA[dlist1].EVENT_RESULT_UNITS;
						}
					}
				}

				for(l=0; l<eventLen; l++)
				{
					var cnt=0;
					for(m=0; m<evecdArray.length; m++)
					{
						var eventUnit = jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].EVENT_RESULT_UNITS;				    
						if(colArray[l]==evecdArray[m])
						{
							if(eventUnit==""||eventUnit==null)
							{
						   
						        if(jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].DYNAMIC_LABEL_FLAG==1)
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >"+ everesArray[m] +"<span class='unit'>("+ jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LABEL + ")</span></td>");
								}
								else
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >", everesArray[m], "</td>");
								}
								cnt=1;
								break;
							}
							else
							{
							   if(jsonEval.RECORD_DATA.QUAL[j].ASSESSMENT_DATA[m].DYNAMIC_LABEL_FLAG==1)
								{
								    assessArray.push("<td class='result' style='width:"+colWidthUOM+"px' >"+ everesArray[m] + "<span class='unit'>" + eventUnit + "</span><span class='unit'>(" + jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LABEL + ")</span></td>");
								}
								else
								{
									assessArray.push("<td class='result' style='width:"+colWidth+"px' >", everesArray[m], 
									"<span class='unit'>", eventUnit,
									"</span></td>");
								}
								cnt=1;
								break;
							}
						}
					}
					if(cnt==0)
					{
					   assessArray.push("<td class='result' style='width:"+colWidth+"px' >--</td>");
					}
				}
				assessArray.push("</tr>");

				if(jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length >0)
				{
					assessArray.push("<tr class='"+rwcol+"'>");
					assessArray.push("<td class='result1' style='width:"+datecolWidth+"px' >", latestDate1,"</td>");
					for( var dlist =0; dlist < jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST.length; dlist++)
					{
						for(var cdList=0; cdList<eventLen; cdList++)
						{
							var cnt=0;
							for(m=0; m<dlistcdArray.length; m++)
							{
								if(colArray[cdList]==dlistcdArray[m])
								{
									if(dlistunitArray[m] == "" || dlistunitArray[m] == null)
									{
										assessArray.push("<td class='result' style='width:"+colWidth+"px' >"+ dlistresArray[m]+ "<span class='unit'>(" + jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_LABEL + ")</span></td>");
									}
									else
									{
										assessArray.push("<td class='result' style='width:"+colWidthUOM+"px' >"+ dlistresArray[m]+ "<span class='unit'>"+ dlistunitArray[m] + "</span><span class='unit'>(" +  jsonEval.RECORD_DATA.QUAL[j].DYNAMIC_LIST[dlist].DYNAMIC_LABEL + ")</span></td>");
									}
									cnt=1;
									break;
								}
							}
							if(cnt==0)
							{
								assessArray.push("<td class='result' style='width:"+colWidth+"px' >--</td>");
							}
						}
					}
					assessArray.push("</tr>");
				}
			   
				var cmtid = "cmt"+idCnt;
				assessArray.push("<tr class='"+rwcol+"' id='"+cmtid+"' ><td class='result1' style='width:"+datecolWidth+"px' >",latestDate1,"</td>");
				assessArray.push("<td colspan='", eventLen,"'>", cmtTxt,"</td></tr>");
				idCnt++;
			}
			else if (cmtFlag==1)				//comment only line
			{
				var cmtid = "cmt"+idCnt;
				assessArray.push("<tr class='"+rwcol+"' id='"+cmtid+"'><td class='result1' style='width:"+datecolWidth+"px' >", latestDate1,"</td>");
				assessArray.push("<td colspan='", eventLen,"'>", cmtTxt,"</td></tr>");
				idCnt++;
			}
			else								//no data for the row?
			{
				for(n=0; n<eventLen; n++)
				{
				   assessArray.push("<td class='result' style='width:"+colWidth+"px' >--</td>");
				}
				assessArray.push("</tr>");
			}
		}
		assessArray.push("<tr><td class='result1'>&nbsp;</td><td colspan='12'>&nbsp;</td></tr>"); 
		assessArray.push("</table></div>");  
	}
	else if(status=="Z")
	{
		assessArray.push(HandleNoDataResponse("assess2"));
	}
	else 
	{
		assessArray.push(HandleErrorResponse("assess2"));
	}
	  
	assesshtml = assessArray.join("");
	var countText = "";

	sec1load(assesshtml,"assess2",countText);
}
   
// Load Problems
function prbLoad(prbInput) {
	var prbData = prbInput;
	if(debugFlag){
	logRecord("Problems JSON:");
	logRecord(prbData);
    }
	var jsonEval = JSON.parse(prbData);
	var jsPrbHTML = [];
	var prbHTML = "";
	var prbLen = 0;
	var jsStatus = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var cnt =0;
	var parentArray = [];
	var parent1Array = [];
	var parentlevelCnt = [];
	var type = "";
	if (jsStatus == "Z") {
		jsPrbHTML.push(HandleNoDataResponse("prb"));
	}
	else if (jsStatus == "S") {
		var prbLen = jsonEval.RECORD_DATA.PROBLEM.length;
		for (var i=0; i<prbLen; i++)
		{
			if(jsonEval.RECORD_DATA.PROBLEM[i].PARENT_PROBLEM_ID==0)
			{
			    type = "prb-name";
			}
			else
			{
			    type= "prb-assoc";
			}
			jsPrbHTML.push("<dl class='prb-info'><dt><span>Problem:</span></dt>");
			if(jsonEval.RECORD_DATA.PROBLEM[i].DISPLAY_AS=="" || jsonEval.RECORD_DATA.PROBLEM[i].DISPLAY_AS==null)
			{
			    jsPrbHTML.push("<dd class='"+type+"'><span>",jsonEval.RECORD_DATA.PROBLEM[i].NAME, "</span></dd>");
			}
			else
			{
			    jsPrbHTML.push("<dd class='"+type+"'><span>",jsonEval.RECORD_DATA.PROBLEM[i].DISPLAY_AS, "</span></dd>");
			}
			
			if(jsonEval.RECORD_DATA.PROBLEM[i].CODE=="" || jsonEval.RECORD_DATA.PROBLEM[i].CODE==null)
			{
			    jsPrbHTML.push("<dt><span>Code:</span></dt><dd class='prb-code'><span></span></dd>")
			}
			else
			{
			     jsPrbHTML.push("<dt><span>Code:</span></dt><dd class='prb-code'><span>(", jsonEval.RECORD_DATA.PROBLEM[i].CODE,
					")</span></dd>");   
			}
			
			jsPrbHTML.push("</dl><h4 class='prb-det-hd'><span>Problem Details</span></h4><dl class='prb-det hvr'><dt><span>Problem Name: </span></dt><dd><span>", jsonEval.RECORD_DATA.PROBLEM[i].NAME, 
					"</span></dd><dt><span>Annotated Display Name: </span></dt><dd><span>", jsonEval.RECORD_DATA.PROBLEM[i].DISPLAY_AS, 
					"</span></dd><dt><span>Onset Date: </span></dt><dd><span>", fmtDt(jsonEval.RECORD_DATA.PROBLEM[i].ONSET_DT_TM,"shortDate2"), 
					"</span></dd><dt><span>Comments: </span></dt>");
			var personnelArray = LoadPersonelListJSON(jsonEval.RECORD_DATA.PRSNL);
			if(jsonEval.RECORD_DATA.PROBLEM[i].COMMENTS.length>0)
			{
				for(var k=0; k<jsonEval.RECORD_DATA.PROBLEM[i].COMMENTS.length; k++)
				{
					var prsnl = "";
					var prsnlName = null;
					if(jsonEval.RECORD_DATA.PROBLEM[i].COMMENTS[k].RECORDED_BY > 0)
					{
						prsnl = GetValueFromArray(jsonEval.RECORD_DATA.PROBLEM[i].COMMENTS[k].RECORDED_BY, personnelArray);
						prsnlName = prsnl.fullName;
						jsPrbHTML.push("<dt style='color=#000000;'><span>", fmtDt(jsonEval.RECORD_DATA.PROBLEM[i].COMMENTS[k].RECORDED_DT_TM,"shortDate2"),"&nbsp;-</span></dt>");
						jsPrbHTML.push("<dd><span>", prsnlName,"</span></dd>");
						jsPrbHTML.push("<dt><span></span></dt>");
						jsPrbHTML.push("<dd><span>", jsonEval.RECORD_DATA.PROBLEM[i].COMMENTS[k].COMMENT_TEXT,"</span></dd>");
					}
					
				}
			}
			else
			{
				jsPrbHTML.push("<dd><span>&nbsp;</span></dd>");
			}					
			jsPrbHTML.push("</dl>");
		}
	}
	else {
		jsPrbHTML.push(HandleErrorResponse("prb"));
	}
	prbHTML = jsPrbHTML.join("");
	var countText = "(" + prbLen + ")";
	sec1load(prbHTML,"prb",countText);
}

function ptlLoad(ptlInput)
{
    var edddate = fmtDt(mpObj.eddDt,"shortDate2");
	var ptlData = ptlInput;
	if(debugFlag){
	logRecord("Timeline JSON:");
	logRecord(ptlData);
    }
	var jsonEval = JSON.parse(ptlData);
	var ptlhtml = "";
	var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var ptlArray = [];
	var visitdtArray = [];
	var visitdt1Array = [];
	var visitdgArray = [];
	var visitrpArray = [];
	var orderdtArray = [];
	var orderdt1Array = [];
	var orderdgArray = [];
	var visitArray = [];
	var labdtArray = [];
	var labdt1Array = [];
	var labdgArray = [];
	var labresArray = [];
	var labunitArray = [];
	var labNormalcyFlgArray = [];
	var ultradtArray = [];
	var ultradt1Array = [];
	var ultraidArray = [];
	var ultradgArray = [];
	var dtArray = [];
	var dtArray1 = [];
	var dtArray2 = [];
	var dtArray3 = [];
	var dtArray4 = [];
	var visitsec = "";
	var visitcnt = 0;
	var labcnt =0;
	var ultracnt =0;
	var setWidth = getWidth();
	var tabwidth = setWidth.width;
	var col1Width = Math.round(tabwidth*0.15);
	var divWidth = Math.round(tabwidth*0.82);
	var col2Width = divWidth;
	if(tabwidth<1200)
	{
	    var incolWidth = Math.round(col2Width*0.09);
	}
	else
	{
	    var incolWidth = Math.round(col2Width*0.0769);
	}
	if(tabwidth<1200)
	{
	    var incol1Width = Math.round(incolWidth*0.26);
	}
	else
	{
	    var incol1Width = Math.round(incolWidth*0.16);
	}
	var incol2Width = Math.round(incol1Width*5);
	var tri1Width = Math.round(incolWidth*13);
	var tri2Width = Math.round(incolWidth*14);
	var tri3Width = Math.round(incolWidth*16);
	var tlLen = jsonEval.RECORD_DATA.RESULT_ROW.length;
	var cDt = new Date();
	cDt.setDate(cDt.getDate()-1);
	var curDt = (cDt.getMonth()+1)+"/"+cDt.getDate()+"/"+cDt.getYear();
	var delDate = fmtDt(mpObj.deliveryDt,"shortDate2");
	var addate = new Date(delDate);
	addate.setDate(addate.getDate()-1);
	var actdelDate = (addate.getMonth()+1)+"/"+addate.getDate()+"/"+addate.getYear();
	var act1delDate = delDate;
	var tDt = new Date();
	tDt.setDate(tDt.getDate());
	var preDt = (tDt.getMonth()+1)+"/"+tDt.getDate()+"/"+tDt.getYear();
	var t3Dt = new Date(actdelDate);
	t3Dt.setDate(t3Dt.getDate()+1);
	var pre5Dt = (t3Dt.getMonth()+1)+"/"+t3Dt.getDate()+"/"+t3Dt.getYear();
	var t1Dt = new Date();
	t1Dt.setDate(t1Dt.getDate()-3);
	var pre1Dt = (t1Dt.getMonth()+1)+"/"+t1Dt.getDate()+"/"+t1Dt.getYear();
	var dispcnt = 1;
	var dispcnt1 = 1;
    var t2Dt = new Date(actdelDate);
	t2Dt.setDate(t2Dt.getDate()-2);
	var pre2Dt = (t2Dt.getMonth()+1)+"/"+t2Dt.getDate()+"/"+t2Dt.getYear();
	
	if(mpObj.eddId > 0)
	{
		if(status=="S")
		{
			var d1 =   new Date();
			d1.setDate(d1.getDate()-mpObj.rtlLookBack); 
			var d2 =   new Date();
			d2.setDate(d2.getDate()-mpObj.rtlLookBack); 
			var d3 =   new Date();
			d3.setDate(d3.getDate()-mpObj.rtlLookBack); 
			var d4 =   new Date();
			d4.setDate(d4.getDate()-mpObj.rtlLookBack); 
			var onsetDt = (d1.getMonth()+1)+"/"+d1.getDate()+"/"+d1.getYear();
			dtArray[0] = onsetDt;
			var doDt = new Date();
			doDt.setDate(doDt.getDate()-mpObj.lookBack);
			var onsetDate = (doDt.getMonth()+1)+"/"+doDt.getDate()+"/"+doDt.getYear();
			
			ptlArray.push("<table class='careplan-table'><tr class='dtrw'><td class='dispdt'>Onset Date:",  onsetDate,
					"</td><td>&nbsp;</td>");
			if(act1delDate=="" || act1delDate==null)
			{
				ptlArray.push("<td>Estimated Due Date: ", edddate,"</td></tr><tr><td>&nbsp;</td></tr></table>");
			}
			else
			{
				ptlArray.push("<td>Actual Delivery Date: <span class='deldate'>", act1delDate,"</span></td></tr><tr><td>&nbsp;</td></tr></table>");
			}
			ptlArray.push("<table class='careplan-table' style='width:"+tabwidth+"px'><tr><td><table class='careplan-table' style='width:"+col1Width+"px'><tr><td class='noname'>&nbsp;</td></tr>");
			ptlArray.push("<tr><td class='name1'>Gestational Age</td></tr>");
			ptlArray.push("<tr><td class='name'>(Week)</td></tr>");
			for ( var hd=0; hd<tlLen; hd++)
			{
				ptlArray.push("<tr><td class='name'>", jsonEval.RECORD_DATA.RESULT_ROW[hd].ROW_DISPLAY, 
						"</td></tr>");
			}
			ptlArray.push("<tr><td>&nbsp;</td></tr><tr><td>&nbsp;</td></tr></table></td>");
			ptlArray.push("<td><div class='hscroll' style='width:"+divWidth+"px'><table class='careplan-table' style='width:"+col2Width+"px'><tr><td><table class='careplan-table1'><tr> ");

			for(var i=0;i<301;i++)
			{
				var j= i+1;
				d4.setDate(d4.getDate()+1);    
				dispDate5 = ((d4.getMonth()+1)+"/"+d4.getDate()+"/"+d4.getYear());
				dtArray4[0] = onsetDt;
				dtArray4[j] = dispDate5;
				var cnt = i%7;
				if(cnt==0)
				{
					if( dtArray4[j] == pre2Dt)
					{
						i=i+6;
						ptlArray.push("<td style='width:"+incol2Width+"px' class='color6'><span class='num-val'>"+act1delDate+"</span></td>");
					}
					else
					{
					   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='num-val'>&nbsp;</span></td>");
					}
					dispcnt1++;
				}
				else
				{
					if( dtArray4[j] == pre2Dt)
					{
					   i=i+6;
					   ptlArray.push("<td style='width:"+incol2Width+"px' class='color6'><span class='num-val'>"+act1delDate+"</span></td>");
					}
					else
					{
					   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='num-val'>&nbsp;</span></td>");
					}
				}
			}
			ptlArray.push("</tr></table></td></tr><tr><td><table class='careplan-table1'><tr>");
		
			for(var i=0;i<301;i++)
			{
				var j= i+1;
				d3.setDate(d3.getDate()+1);    
				dispDate4 = ((d3.getMonth()+1)+"/"+d3.getDate()+"/"+d3.getYear());
				dtArray2[0] = onsetDt;
				dtArray2[j] = dispDate4;
				var cnt = i%7;
				if(cnt==0)
				{
					if( dtArray2[j] == pre1Dt)
					{
						i=i+6;
						ptlArray.push("<td style='width:"+incol2Width+"px' class='color5'><span class='num-val'>", preDt,"</span></td>");
					}
					else
					{
					   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='num-val'>&nbsp;</span></td>");
					}
					dispcnt1++;
				}
				else
				{
					if( dtArray2[j] == pre1Dt)
					{
					   i=i+6;
					   ptlArray.push("<td style='width:"+incol2Width+"px' class='color5'><span class='num-val'>", preDt,"</span></td>");
					}
					else
				   {
					   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='num-val'>&nbsp;</span></td>");
				   }
				}
			}
			ptlArray.push("</tr></table></td></tr><tr><td><table class='careplan-table1'><tr>");
		
			for(var i=0;i<301;i++)
			{
				var j= i+1;
				d2.setDate(d2.getDate()+1);    
				dispDate3 = ((d2.getMonth()+1)+"/"+d2.getDate()+"/"+d2.getYear());
				dtArray1[0] = onsetDt;
				dtArray1[j] = dispDate3;
				var cnt = i%7;
				var nDisplayEGAWkCnt = 0; //009
				
				if(cnt==0)
				{ 
				   //Display Gestational Age week count.
				   nDisplayEGAWkCnt = dispcnt - 1; //009
				   if( dtArray1[j] == preDt)
				   {
					   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2dt'><span class='num-val'>", nDisplayEGAWkCnt,"</span></td>");//009
				   }
				   else if( dtArray1[j] == pre5Dt)
				   {
					   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2deldt'><span class='num-val'>", nDisplayEGAWkCnt,"</span></td>");//009
				   }
				   else
				   {
					   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='num-val'>", nDisplayEGAWkCnt,"</span></td>");//009
				   }
				   dispcnt++;
				}
				else
				{
					if( dtArray1[j] == preDt)
					{
						ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2dt'><span class='num-val'>&nbsp;</span></td>");
					}
					else if( dtArray1[j] == pre5Dt)
				   {
					   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2deldt'><span class='num-val'>&nbsp;</span></td>");
				   }
					else
				   {
					   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='num-val'>&nbsp;</span></td>");
				   }
				}
			}
			ptlArray.push("</tr></table></td></tr><tr><td><table class='careplan-table1'><tr>");
			var d = new Date(onsetDt);
			var d1 =  new Date(onsetDt);
			d.setDate(d.getDate()+0);    
			dispDate1 = ((d.getMonth()+1)+"/"+d.getDate()+"/"+d.getYear());
			var disYr = d.getYear();
			disYr = disYr.toString().slice(2);
			var disMon = (d.getMonth()+1);
			var disDay = d.getDate();
			//disMon = (d.getMonth()+1).toString().length;
			var monLen = disMon.toString().length;
			var dayLen = disDay.toString().length;
			if(monLen==1)
			{
				var actMon = "0"+disMon;
			}
			else
			{
				var actMon = disMon;
			}
			if(dayLen==1)
			{
				var actDay = "0"+disDay;
			}
			else
			{
				var actDay = disDay;
			}
			var displayDt1 = actMon+"/"+actDay+"/"+disYr;
			
			ptlArray.push("<td style='width:"+incolWidth+"px' class='disp'><span class='dttm'>", displayDt1,"</span></td>");
			
			for(var i=0;i<42;i++)
			{
				d.setDate(d.getDate()+7);    
				dispDate = ((d.getMonth()+1)+"/"+d.getDate()+"/"+d.getYear());
				var disYr = d.getYear();
					disYr = disYr.toString().slice(2);
				var disMon = (d.getMonth()+1);
				var disDay = d.getDate();
				//disMon = (d.getMonth()+1).toString().length;
				var monLen = disMon.toString().length;
				var dayLen = disDay.toString().length;
				if(monLen==1)
				{
					var actMon = "0"+disMon;
				}
				else
				{
					var actMon = disMon;
				}
				if(dayLen==1)
				{
					var actDay = "0"+disDay;
				}
				else
				{
					var actDay = disDay;
				}
					var displayDt = actMon+"/"+actDay+"/"+disYr;
				ptlArray.push("<td style='width:"+incolWidth+"px' class='disp'><span class='dttm'>", displayDt,"</span></td>");
			}
			ptlArray.push("</tr></table></td></tr><tr><td><table class='careplan-table1'><tr>");
		   
			for( var dt=1;dt<301;dt++)
			{
				d1.setDate(d1.getDate()+1);    
				dispDate2 = ((d1.getMonth()+1)+"/"+d1.getDate()+"/"+d1.getYear());
				dtArray[dt] = dispDate2;
			} 
		   
			for(var main=0; main<tlLen; main++)
			{
				var subLen = jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST.length;
				if (subLen ==0 )
				{
					var val =  jsonEval.RECORD_DATA.RESULT_ROW[main].HOVER_CAT;
					if(val==1)
					{
						var cat1cnt =main;
					}
					/*if(val==2)
					{
						var cat2cnt =main;
					}*/
					if(val==3)
					{
						var cat3cnt =main;
					}
					if(val==4)
					{
						var cat4cnt =main;
					}
				}
				else
				{
					for(var sub=0; sub<subLen ; sub++)
					{
						var val =  jsonEval.RECORD_DATA.RESULT_ROW[main].HOVER_CAT;
						if(val==1)
						{
							var cat1cnt =main;
							var visitDt = fmtDt(jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_DT_TM,"shortDate2");
							var visitDt1 = fmtDt(jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_DT_TM,"longDateTime3");
							visitdtArray[sub] = visitDt;
							visitdt1Array[sub] = visitDt1;
							visitdgArray[sub] = jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].RESULT_VAL;  //001
							visitrpArray[sub] = jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].PROVIDER_NAME;
						}
						/*if(val==2)
						{
							var cat2cnt = main;
							var orderDt = fmtDt(jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_DT_TM,"shortDate2");
							var orderDt1 = fmtDt(jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_DT_TM,"longDateTime3");
							orderdtArray[sub] = orderDt;
							orderdt1Array[sub] = orderDt1;
							orderdgArray[sub] = jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_NAME;
						}*/
						if(val==3)
						{
							var cat3cnt = main;
							var labDt = fmtDt(jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_DT_TM,"shortDate2");
							var labDt1 = fmtDt(jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_DT_TM,"longDateTime3");
							labdtArray[sub] = labDt;
							labdt1Array[sub] = labDt1;
							labdgArray[sub] = jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_NAME;
							labresArray[sub] = jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].RESULT_VAL;
							labunitArray[sub] = jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].RESULT_UNITS;
							labNormalcyFlgArray[sub] = jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].NORMALCY_FLG;
						}
					   if(val==4)
					   {
							var cat4cnt = main;
							var ultraDt = fmtDt(jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_DT_TM,"shortDate2");
							var ultraDt1 = fmtDt(jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_DT_TM,"longDateTime3");
							ultradtArray[sub] = ultraDt;
							ultradt1Array[sub] = ultraDt1;
							ultradgArray[sub] = jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_NAME;
//					ultraidArray[sub] = jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].EVENT_ID;
					ultraidArray[sub] = jsonEval.RECORD_DATA.RESULT_ROW[main].RESULT_LIST[sub].PARENT_EVENT_ID;
					   }
					}
				}
			}
			  
			var cnt1=0;
			for( var rw=0; rw<tlLen; rw++)
			{
				if(cat1cnt==rw)
				{
					if(cat1cnt%2==0)
					{
						var st = "even";
					}
					else
					{
						var st = "odd"
					}
					if(visitdtArray.length==0)
					{
						for(var k=0; k<301; k++)
						{
							if(dtArray[k]==curDt)
							{
								ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2dt'><span class='dttm'>&nbsp;</span></td>");
							}
							else if (dtArray[k]==actdelDate)
								{
									ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2deldt'><span class='dttm'>&nbsp;</span></td>");
								}
							else
							{
								ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='dttm'>&nbsp;</span></td>");
							}
						}
					}
					else
					{
						for(var k=0; k<301; k++)
						{
							for(var l=0; l<visitdtArray.length; l++)
							{
								var cnt =0;		  
								var Date1 = new Date(visitdtArray[l]);
								Date1.setDate(Date1.getDate()+0);    
								visitDate= ((Date1.getMonth()+1)+"/"+Date1.getDate()+"/"+Date1.getYear());
								var hvrid = "visit"+l; 
								if (dtArray[k]==visitDate)
								{
									if(tabwidth<1200)
									{
										if(visitDate==curDt)
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='color1dt'><a href='#' class='anchorclass' style='color:#FF7D3E;' rel='submenu2'>&nbsp;&nbsp;</a><div id='submenu2' class='anylinkcss'><table class='careplan-table2'>");
										}
										else if (visitDate==actdelDate)
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='estdel1dt'><a href='#' class='anchorclass' style='color:#FF7D3E;' rel='submenu2'><span class='visitlink'>&nbsp;&nbsp;</a><div id='submenu2' class='anylinkcss'><table class='careplan-table2'>");
										}
										else
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='color1'><a href='#' class='anchorclass' style='color:#FF7D3E;' rel='submenu2'>&nbsp;&nbsp;</a><div id='submenu2' class='anylinkcss'><table class='careplan-table2'>");
										}
									}
									else
									{
										if(visitDate==curDt)
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='color1dt'><a href='#' class='anchorclass' style='color:#FF7D3E;' rel='submenu2'>&nbsp;&nbsp;&nbsp;</a><div id='submenu2' class='anylinkcss'><table class='careplan-table2'>");
										}
										else if (visitDate==actdelDate)
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='estdel1dt'><a href='#' class='anchorclass' style='color:#FF7D3E;' rel='submenu2'><span class='visitlink'>&nbsp;&nbsp;&nbsp;</a><div id='submenu2' class='anylinkcss'><table class='careplan-table2'>");
										}
										else
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='color1'><a href='#' class='anchorclass' style='color:#FF7D3E;' rel='submenu2'>&nbsp;&nbsp;&nbsp;</a><div id='submenu2' class='anylinkcss'><table class='careplan-table2'>");
										}   
									}
									
									if(visitdtArray[l]==visitdtArray[l+1])
									{
										ptlArray.push("<tr><td class='title'>Visit Date</td><td class='title'>Diagnosis</td><td class='title'>Responsible Provider</td></tr>");
										for(var sim=l; sim<visitdtArray.length; sim++)
										{
											if(visitdtArray[sim]==visitdtArray[sim+1])
											{
												ptlArray.push("<tr><td class='res'>"+visitdt1Array[sim]+"</td><td class='res'>"+visitdgArray[sim]+"</td><td class='res'>"+ visitrpArray[sim]+"</td></tr>");
											}
											else
											{
												ptlArray.push("<tr><td class='res'>"+visitdt1Array[sim]+"</td><td class='res'>"+visitdgArray[sim]+"</td><td class='res'>"+ visitrpArray[sim]+"</td></tr>");
												break;
											}
										}
									}
									else
									{
									   ptlArray.push("<tr><td class='title'>Visit Date</td><td class='title'>Diagnosis</td><td class='title'>Responsible Provider</td></tr><tr><td class='res'>"+visitdt1Array[l]+"</td><td class='res'>"+visitdgArray[l]+"</td><td class='res'>"+ visitrpArray[l]+"</td></tr>");
									}
									ptlArray.push("</table></div>");
									cnt++;
									break;
								}
							}
							if(cnt==0)
							{
								cnt1++;
								if(dtArray[k]==curDt)
								{
									ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2dt'><span class='dttm'>&nbsp;</span></td>");
								}
								else if (dtArray[k]==actdelDate)
									{
										ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2deldt'><span class='dttm'>&nbsp;</span></td>");
									}
								else
								{
									ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='dttm'>&nbsp;</span></td>");
								}
							}
						}
					}
					ptlArray.push("</tr></table></td></tr><tr><td><table class='careplan-table1'><tr class='"+st+"'>");
				}
			 /*
				if(cat2cnt==rw)
				{
					if(cat2cnt%2==0)
					{
						var st = "even";
					}
					else
					{
					   var st = "odd"
					}
						if(orderdtArray.length==0)
					{
					
					 
						for(var k=0; k<301; k++)
						{
							if(dtArray[k]==curDt)
							{
								ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2dt'><span class='dttm'>&nbsp;</span></td>");
							}
							else if (dtArray[k]==actdelDate)
								{
									ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2deldt'><span class='dttm'>&nbsp;</span></td>");
								}
							else
							{
								ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='dttm'>&nbsp;</span></td>");
							}
						}
						
					}
					else
					{
					for(var k=0; k<301; k++)
					{
						for(var l=0; l<orderdtArray.length; l++)
						{
							var cnt =0;		  
							var Date1 = new Date(orderdtArray[l]);
							Date1.setDate(Date1.getDate()+0);    
							orderDate= ((Date1.getMonth()+1)+"/"+Date1.getDate()+"/"+Date1.getYear());
							var hvrid = "order"+l; 
							if (dtArray[k]==orderDate)
							{
								if(orderDate==curDt)
								{
									ptlArray.push("<td style='width:"+incol1Width+"px' class='color4dt' onmouseover=\"show( '"+hvrid+"');\" onmouseout=\"hide( '"+hvrid+"');\">");
									
								}
								else if( orderDate==actdelDate)
								{
									ptlArray.push("<td style='width:"+incol1Width+"px' class='estdel4dt' onmouseover=\"show( '"+hvrid+"');\" onmouseout=\"hide( '"+hvrid+"');\">");
								}
								else
								{
									ptlArray.push("<td style='width:"+incol1Width+"px' class='color4' onmouseover=\"show( '"+hvrid+"');\" onmouseout=\"hide( '"+hvrid+"');\">");
								}
								ptlArray.push("<div id='"+hvrid+"' style='display:none; position:absolute; z-index:10000; background: #FFC; border: 1px solid #505050;' ><table class='careplan-table2'>");
								if(orderdtArray[l]==orderdtArray[l+1])
								{
								ptlArray.push("<tr><td class='title1'>Order Item</td><td class='title1'>Order Date</td></tr>");
								for(var sim=l; sim<orderdtArray.length; sim++)
								{
								if(orderdtArray[sim]==orderdtArray[sim+1])
								{
									ptlArray.push("<tr><td class='res1'>"+orderdgArray[sim]+"</td><td class='res1'>"+orderdt1Array[sim]+"</td></tr>");
								}
								else
								{
									ptlArray.push("<tr><td class='res1'>"+orderdgArray[sim]+"</td><td class='res1'>"+orderdt1Array[sim]+"</td></tr>");
								break;
								}
								}
								
								}
								else
								{
								   ptlArray.push("<tr><td class='title1'>Order Item</td><td class='title1'>Order Date</td></tr><tr><td class='res1'>"+orderdgArray[l]+"</td><td class='res1'>"+orderdt1Array[l]+"</td></tr>");
								}
								ptlArray.push("</table></div></td>");
								cnt++;
								break;
							}
						}
						if(cnt==0)
						{
							cnt1++;
							if(dtArray[k]==curDt)
							{
								ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2dt'><span class='dttm'>&nbsp;</span></td>");
							}
							else if(dtArray[k]==actdelDate)
							{
							   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2deldt'><span class='dttm'>&nbsp;</span></td>");
							}
							else
						   {
							   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='dttm'>&nbsp;</span></td>");
						   }
						}
					}
					}
					ptlArray.push("</tr></table></td></tr><tr><td><table class='careplan-table1'><tr class='"+st+"'>");
				}*/
			 
				if(cat3cnt==rw )
				{
					if(cat3cnt%2==0)
					{
						var st = "even";
					}
					else
					{
						var st = "odd"
					}

					if(labdtArray.length==0)
					{
						for(var k=0; k<301; k++)
						{
							if(dtArray[k]==curDt)
							{
								ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2dt'><span class='dttm'>&nbsp;</span></td>");
							}
							else if (dtArray[k]==actdelDate)
							{
								ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2deldt'><span class='dttm'>&nbsp;</span></td>");
							}
							else
							{
								ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='dttm'>&nbsp;</span></td>");
							}
						}
					}
					else
					{
						for(var k=0; k<301; k++)
						{
							for(var l=0; l<labdtArray.length; l++)
							{
								var cnt =0;		  
								var Date1 = new Date(labdtArray[l]);
								Date1.setDate(Date1.getDate()+0);    
								labDate= ((Date1.getMonth()+1)+"/"+Date1.getDate()+"/"+Date1.getYear());
								if (dtArray[k]==labDate)
								{
									var colorcnt =0;
									var type = "";
									var restype = "";
									var classname = "";
									
									if(labDate==curDt){
										if(labNormalcyFlgArray[l] == 3){ //if its a normal result we need to send a different class
											classname = "color2dt";
										}
										else{
											classname = "abnrmldt";
										}
										restype = DetermineResultType(classname,labdtArray,labNormalcyFlgArray, labdtArray[l]);
									}
									else if (labDate==actdelDate){
										if(labNormalcyFlgArray[l] == 3){ //if its a normal result we need to send a different class
											classname = "estdel2dt";
										}
										else{
											classname = "abnrmldeldt";
										}
										restype = DetermineResultType(classname,labdtArray,labNormalcyFlgArray, labdtArray[l]);
																			
									}
									else{
										if(labNormalcyFlgArray[l] == 3){ //if its a normal result we need to send a different class
											classname = "color2";
										}
										else{
											classname = "abnrml";
										}
										restype = DetermineResultType(classname,labdtArray,labNormalcyFlgArray, labdtArray[l]);

									}
									var hvrid = "lab"+l;
									var normalcyCdMeaning = restype.replace(classname+"-", "");
									if (normalcyCdMeaning == "crit" ||  normalcyCdMeaning == "high" || normalcyCdMeaning == "low") {
										colorcnt++;
									}
									else{
										colorcnt = 0;
									}
																	
									if(tabwidth<1000)
									{
										if(colorcnt>0)
										{
										   ptlArray.push("<td style='width:"+incol1Width+"px' class='"+restype+"'><a href='#' class='anchorclass' style='color:#FFFFFF' rel='submenu3'>&nbsp;&nbsp;</a><div id='submenu3' class='anylinkcss'><table class='careplan-table2'>"); 
										}
										else
										{
										   ptlArray.push("<td style='width:"+incol1Width+"px' class='"+restype+"'><a href='#' class='anchorclass' style='color:#842E91' rel='submenu3'>&nbsp;&nbsp;</a><div id='submenu3' class='anylinkcss'><table class='careplan-table2'>");
										}
									}  
									else
									{
										if(colorcnt>0)
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='"+restype+"'><a href='#' class='anchorclass' style='color:#FFFFFF' rel='submenu3'>&nbsp;&nbsp;&nbsp;</a><div id='submenu3' class='anylinkcss'><table class='careplan-table2'>");
										}
										else
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='"+restype+"'><a href='#' class='anchorclass' style='color:#842E91' rel='submenu3'>&nbsp;&nbsp;&nbsp;</a><div id='submenu3' class='anylinkcss'><table class='careplan-table2'>");
										}
									}							
									
									//the following if conditions ensures that a new row will be rendered if there
									//are more than 1 lab result under the same date
									if(labdtArray[l]==labdtArray[l+1])
									{
										ptlArray.push("<tr><td class='title'>Display Name</td><td class='title'>Result</td><td class='title'>Date/Time</td></tr>");
										for(var sim =l; sim<labdtArray.length; sim++)
										{
											type = DetermineTextType(labNormalcyFlgArray[sim]);
											ptlArray.push("<tr><td class='res'>", labdgArray[sim],"</td><td class='res'>");
											if(labdtArray[sim]==labdtArray[sim+1])
											{
												ptlArray.push("<span class='"+type+"'>"+labresArray[sim]+"&nbsp;"+labunitArray[sim]+"</span>");
												ptlArray.push("</td><td class='res'>", labdt1Array[sim],
														"</td></tr>");
											}
											else
											{
												ptlArray.push("<span class='"+type+"'>"+labresArray[sim]+"&nbsp;"+labunitArray[sim]+"</span>");
												ptlArray.push("</td><td>", labdt1Array[sim],
														"</td></tr>");
												break;
											}
										}
									}
									//if the dates dont match or if labdtArray[l+1] is undefined meaning there
									//is only one lab result under one date then render only one row
									else
									{
										type = DetermineTextType(labNormalcyFlgArray[l]);
										ptlArray.push("<tr><td class='title'>Display Name</td><td class='title'>Result</td><td class='title'>Date/Time</td></tr><tr><td class='res'>", labdgArray[l],"</td><td class='res'>");
										ptlArray.push("<span class='"+type+"'>"+labresArray[l]+"&nbsp;"+labunitArray[l]+"</span>");
										ptlArray.push("</td><td class='res'>", labdt1Array[l],
												"</td></tr>");
									}
									ptlArray.push("</table></div>");
									cnt++;
									break;
								}
							}
							if(cnt==0)
							{
								cnt1++;
								if(dtArray[k]==curDt)
								{
									ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2dt'><span class='dttm'>&nbsp;</span></td>");
								}
								else if(dtArray[k]==actdelDate)
								{
								   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2deldt'><span class='dttm'>&nbsp;</span></td>");
								}
								else
								{
									ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='dttm'>&nbsp;</span></td>");
								}
							}
						}
					}
					ptlArray.push("</tr></table></td></tr><tr><td><table class='careplan-table1'><tr class='"+st+"'>");
				}
			 
				if(cat4cnt==rw)
				{
					if(ultradtArray.length==0)
					{
						for(var k=0; k<301; k++)
						{
							if(dtArray[k]==curDt)
							{
								ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2dt'><span class='dttm'>&nbsp;&nbsp;</span></td>");
							}
							else if (dtArray[k]==actdelDate)
							{
								ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2deldt'><span class='dttm'>&nbsp;&nbsp;</span></td>");
							}
							else
							{
								ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='dttm'>&nbsp;&nbsp;</span></td>");
							}
						}
					}
					else
					{
						for(var k=0; k<301; k++)
						{
							for(var l=0; l<ultradtArray.length; l++)
							{
								var cnt =0;		  
								var Date1 = new Date(ultradtArray[l]);
								Date1.setDate(Date1.getDate()+0);    
								ultraDate= ((Date1.getMonth()+1)+"/"+Date1.getDate()+"/"+Date1.getYear());
								if (dtArray[k]==ultraDate)
								{
									if(tabwidth<1000)
									{
										if(ultraDate==curDt)
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='color3dt'><a href='#' class='anchorclass' rel='submenu1'>&nbsp;&nbsp;</a><div id='submenu1' class='anylinkcss'><table class='careplan-table2'>");
										
										}
										else if( ultraDate==actdelDate)
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='estdel3dt' ><a href='#' class='anchorclass' rel='submenu1'>&nbsp;&nbsp;</a><div id='submenu1' class='anylinkcss'><table class='careplan-table2'>");
										}
										else
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='color3' ><a href='#' class='anchorclass' rel='submenu1'>&nbsp;&nbsp;</a><div id='submenu1' class='anylinkcss'><table class='careplan-table2'>");
										}
									}
									else
									{
										if(ultraDate==curDt)
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='color3dt'><a href='#' class='anchorclass' rel='submenu1'>&nbsp;&nbsp;&nbsp;</a><div id='submenu1' class='anylinkcss'><table class='careplan-table2'>");
										}
										else if( ultraDate==actdelDate)
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='estdel3dt' ><a href='#' class='anchorclass' rel='submenu1'>&nbsp;&nbsp;&nbsp;</a><div id='submenu1' class='anylinkcss'><table class='careplan-table2'>");
										}
										else
										{
											ptlArray.push("<td style='width:"+incol1Width+"px' class='color3' ><a href='#' class='anchorclass' rel='submenu1'>&nbsp;&nbsp;&nbsp;</a><div id='submenu1' class='anylinkcss'><table class='careplan-table2'>");
										}
									}
									 
									if(ultradtArray[l]==ultradtArray[l+1])
									{
										 ptlArray.push("<tr><td class='title1'>Subject</td><td class='title1'>Date/Time</td></tr>");
										for(var sim=l; sim<ultradtArray.length; sim++)
										{
											if(ultradtArray[sim]==ultradtArray[sim+1])
											{
												ptlArray.push("<tr><td class='title1'>"+ultradgArray[sim]+"</td><td class='title1'><a href='javascript:CCLLINK(mp_preg_clin_smry_clinicaldocs, \"^MINE^,"+ultraidArray[sim]+".0,1\",1)'>"+ultradt1Array[sim]+"</a></td></tr>");
											}
											else
											{
												ptlArray.push("<tr><td class='title1'>"+ultradgArray[sim]+"</td><td class='title1'><a href='javascript:CCLLINK(mp_preg_clin_smry_clinicaldocs, \"^MINE^,"+ultraidArray[sim]+".0,1\",1)'>"+ultradt1Array[sim]+"</a></td></tr>");
												break;
											}
										}
									}
									else
									{
										 ptlArray.push("<tr><td class='title1'>Subject</td><td class='title1'>Date/Time</td></tr><tr><td class='title1'>"+ultradgArray[l]+"</td><td class='title1'><a href='javascript:CCLLINK(mp_preg_clin_smry_clinicaldocs, \"^MINE^,"+ultraidArray[l]+".0,1\",1)'>"+ultradt1Array[l]+"</a></td></tr>");
									}
									ptlArray.push("</table></div>");
									cnt++;
									break;
								}
							}
							if(cnt==0)
							{
								cnt1++;
								if(dtArray[k]==curDt)
								{
									ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2dt'><span class='dttm'>&nbsp;</span></td>");
								}
								else if(dtArray[k]==actdelDate)
								{
								   ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2deldt'><span class='dttm'>&nbsp;</span></td>");
								}
								else
								{
									ptlArray.push("<td style='width:"+incol1Width+"px' class='disp2'><span class='dttm'>&nbsp;</span></td>");
								}
							}
						}
					}
					ptlArray.push("</tr></table></td></tr><tr><td><table class='careplan-table1'><tr>");
				}
			}
		  
			ptlArray.push("<td style='width:"+tri1Width+"px' class='tri1'>Trimester 1</td><td style='width:"+tri2Width+"px' class='tri2'>Trimester 2</td><td style='width:"+tri3Width+"px' class='tri3'>Trimester 3</td>");
			ptlArray.push("</tr></table></td></tr><tr><td><table class='careplan-table1'><tr>");
			for(var i=0;i<43;i++)
			{
				ptlArray.push("<td style='width:"+incolWidth+"px' class='disp'><span class='dttm'>&nbsp;</span></td>");
			}
			ptlArray.push("</tr></table></td></tr>");
			ptlArray.push("</table></div></td></tr></table>");
		}
		else if(status=="Z")
		{
			ptlArray.push(HandleNoDataResponse("ptl"));
		}
		else 
		{
			ptlArray.push(HandleErrorResponse("ptl"));
		}
	}else{
		ptlArray.push("<span class='res-none'>No EDD/EGA date established.</span>");
	}
   
    ptlhtml = ptlArray.join("");
    var countText = "";
	sec1load(ptlhtml,"ptl",countText);
	anylinkcssmenu.init("anchorclass");
}

function DetermineTextType(normalcyFlg){
	var textType = "";
	if (normalcyFlg == 1) {
		textType = "crit";
	}
	else if (normalcyFlg == 2) {
		textType = "high";
	}
	else if (normalcyFlg == 3) {
		textType = "";
	}
	else if (normalcyFlg == 4) {
		textType = "low";
	}
	return textType;
}

function DetermineResultType(classname,labResultArray,labNormalcyFlgArray, curDate){
	var resultType = "";
	var labNormalcyFlg = "";
	
	var foundCrit = false;
	var foundHigh = false;
	var foundLow = false;
	var foundNorm = false;

	for(var i=0; i<labResultArray.length; i++){
		if(labResultArray[i] == curDate){
			labNormalcyFlg = labNormalcyFlgArray[i];
			if (labNormalcyFlg == 1) { //found critical
				resultType = classname + "-crit";
				foundCrit = true;
				foundHigh = false;
				foundLow = false;
				foundNorm = false;
			}
			else if(foundCrit == false && labNormalcyFlg == 2){ //found high
				resultType = classname + "-high";
				foundCrit = false;
				foundHigh = true;
				foundLow = false;
				foundNorm = false;				
			}
			else if(foundCrit == false && foundHigh == false && foundLow == false && labNormalcyFlg == 3){ //found normal
				resultType = classname + "-norm";
				foundCrit = false;
				foundHigh = false;
				foundLow = false;
				foundNorm = true;				
			}			
			else if (foundCrit == false && foundHigh == false && labNormalcyFlg == 4) { //found low
				resultType = classname + "-low";
				foundCrit = false;
				foundHigh = false;
				foundLow = true;
				foundNorm = false;					
			}		
		}
	}
	return resultType;
}
function eddLoad(eddInput)
{
   var eddData = eddInput;
	if(debugFlag){
	logRecord("EDD JSON:");
	logRecord(eddData);
    }
   var jsonEval = JSON.parse(eddData);
   var eddhtml = "";
   var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
   var eddArray = [];
   var eddLen = jsonEval.RECORD_DATA.QUAL.length;
   var dateTime = new Date();
   if (status=="S")
   {
       
       eddArray.push("<table class='edd-table'><tr><th class='status-hd'>Status</th><th class='date-time-hd'>EDD</th><th class='ega-hd'>EGA</th><th class='method-hd'>Method</th></tr>");
       for (var i=0; i<eddLen; i++)
	   {
	      var eddGesAge = jsonEval.RECORD_DATA.QUAL[i].EST_GEST_AGE_DAYS;
		  var egaWeeks = Math.floor(eddGesAge/7);
		  var egaDays = eddGesAge%7;
	      var eddDate = fmtDt(jsonEval.RECORD_DATA.QUAL[i].EST_DELIVERY_DT_TM,"shortDate3"); 
		  var docDate = fmtDt(jsonEval.RECORD_DATA.QUAL[i].ENTERED_DT_TM,"longDateTime3");
		  var confDate = fmtDt(jsonEval.RECORD_DATA.QUAL[i].METHOD_DT_TM,"longDateTime3");
		  var eddID = jsonEval.RECORD_DATA.QUAL[i].PREGNANCY_ESTIMATE_ID;
		  // handle ultrasound differently
		  var descriptionHTML = [];
		  if(jsonEval.RECORD_DATA.QUAL[i].ULTRASOUND_MEASUREMENTS.length > 0)
		  {
			  descriptionHTML.push("<dt class='result'><span>Crown Rump Length:</span></dt><dd class='edd-det-type'><span>", jsonEval.RECORD_DATA.QUAL[i].ULTRASOUND_MEASUREMENTS[0].CROWN_RUMP, " cm</span></dd>", 
				  "<dt class='result'><span>Biparietal Diameter:</span></dt><dd class='edd-det-type'><span>", jsonEval.RECORD_DATA.QUAL[i].ULTRASOUND_MEASUREMENTS[0].BIPARIETAL_DIAMETER, " cm</span></dd>", 
				  "<dt class='result'><span>Head Circumference:</span></dt><dd class='edd-det-type'><span>", jsonEval.RECORD_DATA.QUAL[i].ULTRASOUND_MEASUREMENTS[0].HEAD_CIRCUMFERENCE, " cm</span></dd>");
		  }
		  else
		  {
			  descriptionHTML.push("<dt class='result'><span>Description:</span></dt><dd class='edd-det-type'><span>", jsonEval.RECORD_DATA.QUAL[i].DESCRIPTION, "</span></dd>");
		  }
			
		  eddArray.push("<tr><td class='status'>", jsonEval.RECORD_DATA.QUAL[i].STATUS_DISPLAY,
//						"</td><td class='edd'><dl class='edd-info'><dd class='edd-det-type'><a href='javascript:modifyEdd("+eddID+")'><span class='dt-res'>", eddDate,
						"</td><td class='edd'><dl class='edd-info'><dd class='edd-det-type'><a href='javascript:modifyEdd("+eddID+")'><span>", eddDate,
						"</span></a></dd></dl><h4 class='edd-det-hd'><span>Edd Details</span></h4><dl class='edd-det hvr'><dt class='result'><span>EGA:</span></dt><dd class='edd-det-type'><span>", jsonEval.RECORD_DATA.QUAL[i].STATUS_DISPLAY,
						"</span></dd><dt class='result'><span>Confirmation:</span></dt><dd class='edd-det-type'><span>", confDate,
						"</span></dd>", descriptionHTML.join(""),
						"<dt class='result'><span>Documented By:</span></dt><dd class='edd-det-type'><span>", jsonEval.RECORD_DATA.QUAL[i].AUTHOR_NAME,
						"</span></dd><dt class='result'><span>Date/Time Documented:</span></dt><dd class='edd-det-type'><span>", docDate,
						"</span></dd></dl></td>");
						
		if( egaDays==0)
        {
		    eddArray.push("<td class='ega'>"+egaWeeks+"&nbsp;Weeks</td>"); 
        }	
        else
        {
		    eddArray.push("<td class='ega'>"+egaWeeks+"&nbsp;"+egaDays+"/7&nbsp;Weeks</td>");
        }		
		eddArray.push("<td class='method'>", jsonEval.RECORD_DATA.QUAL[i].METHOD_DISPLAY,
		                "</td></tr>");
		}
		eddArray.push("</table>");
	}
	else if(status=="Z")
	{
	    eddArray.push(HandleNoDataResponse("edd"));
	}
	else 
	{
	    eddArray.push(HandleErrorResponse("edd"));
	}
   eddhtml = eddArray.join("");
   var countText = "";
   sec1load(eddhtml,"edd",countText);
}

// Load Diagnostics
function dgLoad(dgInput) {
	var dgData = dgInput;
	if(debugFlag){
	logRecord("Diagnostics JSON:");
	logRecord(dgData);
    }
	var jsonEval = JSON.parse(dgData);
	var jsDgHTML = [];
	var dgHTML = "";
	var dgHd = "";
	var jsEKGSec = [];
	var jsCASec = [];
	var jsOtherSec = [];
	var ekgCount = 0;
	var caCount = 0;
	var otherCount = 0;
	var dgLen = 0;
	var jsStatus = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	if (jsStatus == "S") {
		var dgObj = jsonEval.RECORD_DATA.RPT;
		dgLen = dgObj.length;
		var date2YrStr= "";
		var date4YrStr= "";
		for (var i=0; i<dgLen; i++) {
			var dgRpt = [];
			var dgItem = dgObj[i];
			var dgItemNm = dgItem.NAME;
			var dgItemType = dgItem.TYPE;

			date2YrStr = dgItem.DT_TM;
			date4YrStr = dgItem.DT_TM;
			if(date2YrStr != "--" && date2YrStr != ""){
				date2YrStr = fmtDt(dgItem.DT_TM, "longDateTime2");
				date4YrStr = fmtDt(dgItem.DT_TM, "longDateTime3");
			}
			dgRpt.push("<h3 class='dg-info-hd'>", dgItemNm, "</h3><dl class='dg-info'><dt><span>Diagnostic:</span></dt><dd class='dg-name'><span>",
						dgItemNm, "</span></dd><dt><span>Date/Time</span></dt><dd class='dg-within'><span>");
				if (dgItem.REPORT_ID > 0) {
					var ekgFlag = 5;
					if (dgItemType == 1) {
						ekgFlag = 1;
					}
					dgRpt.push("<a href='javascript:CCLLINK(mp_preg_clin_smry_clinicaldocs,\"^MINE^,"+dgItem.REPORT_ID+".0,"+ekgFlag+"\",1)'>",
								date2YrStr, "</a>");
				}
				else {
					dgRpt.push(date2YrStr);
				}					
			dgRpt.push("</span></dd><dt><span>Status:</span></dt><dd class='dg-stat'><span>", dgItem.STATUS,
						"</span></dd></dl><h4 class='med-det-hd'><span>Diagnostic Details</span></h4><dl class='dg-det hvr'><dt><span>Study:</span></dt><dd><span>",
						dgItemNm, "</span></dd><dt><span>Date/Time:</span></dt><dd><span>",
						date4YrStr, "</span></dd></dl>");

			// populate the appropriate subsection
			if (dgItemType == 1) {
				jsEKGSec = jsEKGSec.concat(dgRpt);
				ekgCount++;
			}
			else if (dgItemType == 2) {
				jsCASec = jsCASec.concat(dgRpt);
				caCount++;
			}
			else {
				jsOtherSec = jsOtherSec.concat(dgRpt);
				otherCount++;
			}
		}
		jsDgHTML.push("<dl class='dg-info-hdr'><dd class='dg-name-hd'><span>&nbsp;</span></dd><dd class='dg-within-hd'><span>Date/Time</span></dd><dd class='dg-stat-hd'><span>Status</span></dd></dl>");
	}
	
	if(ekgCount <= 0)
		jsEKGSec.push(HandleNoDataResponse("dg"));
	if(caCount <= 0)
		jsCASec.push(HandleNoDataResponse("dg"));
	if(otherCount <= 0)
		jsOtherSec.push(HandleNoDataResponse("dg"));

	jsDgHTML.push(	"<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>EKG (",
					ekgCount, ")</span></h3><div class='sub-sec-content'>",	jsEKGSec.join(""), "</div></div><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>Chest\/Abd XR (", caCount, ")</span></h3><div class='sub-sec-content'>",
					jsCASec.join(""), "</div></div><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>Other Diagnostics (", otherCount, ")</span></h3><div class='sub-sec-content'>",
					jsOtherSec.join(""), "</div></div>");
					
	dgHTML = jsDgHTML.join("");
	var countText = "(" + dgLen + ")";
	sec1load(dgHTML,"dg",countText);
}

function genscrLoad(genInput)
{
	var genscrData = genInput;
	if(debugFlag){
	logRecord("Genetic Screening JSON:");
	logRecord(genscrData);
    }
	var jsonEval = JSON.parse(genscrData);
	var genscrhtml = "";
	var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var genscrArray = [];
	var genscrLen = jsonEval.RECORD_DATA.RESULTSARRAY.length;
	if (status=="S")
	{
		for (var i=0; i<genscrLen; i++)
		{
			genscrArray.push("<dl class='genscr-info'><dt class='genscr-hd'>Genetic Screening</dt><dd class='title'>", jsonEval.RECORD_DATA.RESULTSARRAY[i].SRESULTDISPLAY,
						  "</dd><dd class='result'>", jsonEval.RECORD_DATA.RESULTSARRAY[i].SRESULTVALUE,
						  "</dd></dl><h4><span class='genscr-det-hd'>Genetic Screening Details</span></h4><dl class='gen-det hvr'><dt class='gen-scr-det-type'><span>Genetic Disorder:</span></dt><dd class='result'><span>", jsonEval.RECORD_DATA.RESULTSARRAY[i].SRESULTDISPLAY,
						  "</span></dd><dt class='gen-scr-det-type'><span>Affected Person:</span></dt><dd class='result'><span>", jsonEval.RECORD_DATA.RESULTSARRAY[i].SRESULTVALUE,
						  "</span></dd><dt class='gen-scr-det-type'><span>Comments:</span></dt><dd class='result'><span>", jsonEval.RECORD_DATA.RESULTSARRAY[i].SRESULTCOMMENT,
						  "</span></dd></dl>");
		}
	}
	else if(status=="Z")
	{
	    genscrArray.push(HandleNoDataResponse("genscr"));
	}
	else 
	{
	    genscrArray.push(HandleErrorResponse("genscr"));
	}
	genscrhtml = genscrArray.join("");
	var countText = "";
	sec1load(genscrhtml,"genscr",countText);
}


function eduLoad(eduInput)
{
	var eduData = eduInput;
  if(debugFlag){
	logRecord("Education and Counseling JSON:");
	logRecord(eduData);
    }
	var jsonEval = JSON.parse(eduData);
	var eduHTML = "";
	var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var eduLength = jsonEval.RECORD_DATA.COMPLETED.length;
	var recLength = jsonEval.RECORD_DATA.RECOMMENDED.length;
	var dateTime = new Date();
	var subsec = "";
	var SUBSECHTML = [];
	var jsEDUHTML = [];
	if (status=="S")
	{
		for(var i=0; i<eduLength; i++)
		{
			jsEDUHTML = [];
			subsec = "";
			if(jsonEval.RECORD_DATA.COMPLETED[i].LEVENTCNT!=0)
			{
				var catLength = jsonEval.RECORD_DATA.COMPLETED[i].LEVENTCNT;
				for(var j=0; j<catLength; j++)
				{
				   var onsetDate = fmtDt(jsonEval.RECORD_DATA.COMPLETED[i].CATEGORYRESULTS[j].SEVENTDATE,"shortDate");
				   jsEDUHTML.push("<dl class='edu-info'><dt class='edu-det-hd'>Patient Information</dt><dd class='edu-name'>", jsonEval.RECORD_DATA.COMPLETED[i].CATEGORYRESULTS[j].SEVENTDISPLAY,
								"</dd><dd class='edu-result'>", jsonEval.RECORD_DATA.COMPLETED[i].CATEGORYRESULTS[j].SEVENTRESULT,
								"</dd><dd class='edu-date'><span class='date-time'>", onsetDate,
								"</span></dd></dl>");
				}
				subsec = jsEDUHTML.join("");
				SUBSECHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd' ><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><dl class='edu-info headr'><dt>&nbsp;</dt><dd><span class='sub-sec-title'>"); 
				if(i+1==1)
				{
					SUBSECHTML.push("1st Trimester");
				}
				else if (i+1==2)
				{
					SUBSECHTML.push("2nd Trimester");
				}
				else if (i+1==3)
				{
					SUBSECHTML.push("3rd Trimester");
				}
				SUBSECHTML.push("</span></dd></dl><h4><span class='edu-det-hd'>Education Details</span></h4><dl class='edu-det hvr'>");
				for (var rec =0; rec < jsonEval.RECORD_DATA.RECOMMENDED[i].LEVENTCNT; rec++)
				{
					 SUBSECHTML.push("<dt class='edu-det-type'><span></span></dt><dd class='edu-name'><span>", jsonEval.RECORD_DATA.RECOMMENDED[i].CATEGORYRESULTS[rec].SEVENTDISPLAY,
					 "</span></dd>");
				}		
				SUBSECHTML.push("</dl></h3><div class='sub-sec-content'>", subsec,"</div></div>");
			}
			else
			{
				SUBSECHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd' ><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><dl class='edu-info headr'><dt>&nbsp;</dt><dd><span class='sub-sec-title'>");
				if(i+1==1)
				{
					SUBSECHTML.push("1st Trimester");
				}
				else if (i+1==2)
				{
					SUBSECHTML.push("2nd Trimester");
				}
				else if (i+1==3)
				{
					SUBSECHTML.push("3rd Trimester");
				}
				SUBSECHTML.push("</span></dd></dl><h4><span class='edu-det-hd'>Education Details</span></h4><dl class='edu-det hvr'>");
				for (var rec =0; rec < jsonEval.RECORD_DATA.RECOMMENDED[i].LEVENTCNT; rec++)
				{
					SUBSECHTML.push("<dt class='edu-det-type'><span></span></dt><dd class='edu-name'><span>", jsonEval.RECORD_DATA.RECOMMENDED[i].CATEGORYRESULTS[rec].SEVENTDISPLAY,
								"</span></dd>");
				}	
				SUBSECHTML.push("</dl></h3><div class='sub-sec-content'></div></div>");
			}	 
		}
	}else if (status=="Z")
	{
	    for(var i=0; i<recLength; i++)
		{
			jsEDUHTML = [];
			subsec = "";    
			if(jsonEval.RECORD_DATA.COMPLETED[i].LEVENTCNT==0)
			{
				var catLength = jsonEval.RECORD_DATA.COMPLETED[i].CATEGORYRESULTS.length;
				var resCnt = 0;
				SUBSECHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd' ><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><dl class='edu-info headr'><dt>&nbsp;</dt><dd><span class='sub-sec-title'>");
				if(i+1==1)
				{
					SUBSECHTML.push("1st Trimester");
				}
				else if (i+1==2)
				{
					SUBSECHTML.push("2nd Trimester");
				}
				else if (i+1==3)
				{
					SUBSECHTML.push("3rd Trimester");
				}
				SUBSECHTML.push("</span></dd></dl><h4><span class='edu-det-hd'>Education Details</span></h4><dl class='edu-det hvr'>");
				for (var rec =0; rec < jsonEval.RECORD_DATA.RECOMMENDED[i].LEVENTCNT; rec++)
				{
					SUBSECHTML.push("<dt class='edu-det-type'><span></span></dt><dd class='edu-name'><span>", jsonEval.RECORD_DATA.RECOMMENDED[i].CATEGORYRESULTS[rec].SEVENTDISPLAY,
								"</span></dd>");
				}		
				SUBSECHTML.push("</dl></h3><div class='sub-sec-content'></div></div>");
			}   
		}
	    
	}else 
	{
		SUBSECHTML.push(HandleErrorResponse("edu"));
	}
	var countText = "";
	eduHTML = SUBSECHTML.join("");
	sec1load(eduHTML,"edu",countText);
}


function bpLoad(bpInput)
{
	var bpData = bpInput;
  if(debugFlag){
	logRecord("Birth Plan JSON:");
	logRecord(bpData);
    }
	var jsonEval = JSON.parse(bpData);
	var jsBPHTML = [];
	var bpHTML = "";
	//Finding the status
	var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var planLength = jsonEval.RECORD_DATA.PLANLIST.length;
  
	//Display only of status is S
	if (status=="S")
	{ 
		for (var i=0; i<planLength; i++)
		{
			jsBPHTML.push("<dl class='bp-info'><dt class='bp-det-hd'>Birth Plan</dt><dd class='title'>", jsonEval.RECORD_DATA.PLANLIST[i].SPLANNAME,
					  "</dd><dd class='result'>", jsonEval.RECORD_DATA.PLANLIST[i].SPLANRESULT,"</dd></dl>");
		}
	}
	else if(status=="Z")
	{
	    jsBPHTML.push(HandleNoDataResponse("bp"));
	}
	else 
	{
	    jsBPHTML.push(HandleErrorResponse("bp"));
	}
    var countText = "";
    bpHTML = jsBPHTML.join("");
	sec1load(bpHTML,"bp",countText);
}  


function poLoad(ovInput) {
	var poData = ovInput;
	if(debugFlag){
	logRecord("Pregnancy Overview JSON:");
	logRecord(poData);
    }
	var jsonEval = JSON.parse(ovInput);
	var jsPOHTML = [];
	var poHTML = "";
	var tableBody = "";
	var pregnancyId = mpObj.pregId;
	var poObj = new Object();
	var inWeeks = 0;
	var inDays = 0;
	var gesAge = 0;
	if(mpObj.gesAge!=0)
	{
		inWeeks = (mpObj.gesAge)/7;
		inDays = (mpObj.gesAge)%7;
		gesAge = Math.floor(inWeeks);
	}

	poObj.gravida = jsonEval.RECORD_DATA.LGRAVIDA;
	poObj.para = jsonEval.RECORD_DATA.LPARA;
	poObj.fullterm = jsonEval.RECORD_DATA.LPARAFULLTERM;
	poObj.preterm = jsonEval.RECORD_DATA.LPARAPREMATURE;
	poObj.abortions = jsonEval.RECORD_DATA.LPARAABORTIONS;
	poObj.living = jsonEval.RECORD_DATA.LLIVING;

	var height=(jsonEval.RECORD_DATA.DPATIENTHEIGHT);

	jsPOHTML.push("<table><tr><td class='po-drpdn' ><span>Update Pregnancy:</span><form><select id='pregTask' onchange='pregFunction(this.form.pregTask)'><option value='Select' class='drop' >select action</option><option value='Cancel'>Cancel</option><option value='Close'>Close</option><option value='Modify'>Modify</option></select></form></td><td style='width:5%'><span>&nbsp;</span></td><td style='width:20%'><span>&nbsp;</span></td></tr></table>");	
	jsPOHTML.push("<table><tr><td><ul class='tabmenu'><li ><a id='one' class='active' href='javascript:displayDiv(\"home\",\"one\")'>Current Pregnancy&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></li><li ><a id='two' class='inactive' href='javascript:displayDiv(\"contact\",\"two\")'>Contact Info&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></li></ul></td></tr></table>");	

	var estDate = fmtDt(mpObj.eddDt,"shortDate");
	var estDate1 = fmtDt(mpObj.eddDt,"shortDate2");
	var dobDate = fmtDt(jsonEval.RECORD_DATA.SPATIENTDOB,"shortDate");
	var pregDate = fmtDt(jsonEval.RECORD_DATA.DTPREGBEGDATE,"shortDate2");
	var pcpphoneLen = jsonEval.RECORD_DATA.PCPPHONES.length;
	var patphoneLen = jsonEval.RECORD_DATA.PATIENTPHONES.length;
	var ecphoneLen = jsonEval.RECORD_DATA.ECPHONES.length;
	
	jsPOHTML.push("<div id='home'><table class='po-table'><tr><td class='po-label'>EDD:</td><td class='po-name'><dl class='po-info'><dt class='po-det-type'><span>Result</span></dt>");
	if(mpObj.eddId > 0)
	{
		jsPOHTML.push("<dd><a href=javascript:eddAction('Modify') class='Modify'  id='Modify'><span class='Modify' >"+estDate+"&nbsp;("+jsonEval.RECORD_DATA.SEDDSTATUS+")</span></a></dd></dl>");
	}
	else
	{
		jsPOHTML.push("<dd><a href=javascript:eddAction('Add') class='Modify'  id='Modify'><span class='Modify' >Add EDD</span></a></dd></dl>");
	}
	
	var descriptionHTML = [];
	if(jsonEval.RECORD_DATA.ULTRASOUND_MEASUREMENTS.length > 0)
	{	
		descriptionHTML.push("<dt class='po-label'><span>Crown Rump Length:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.ULTRASOUND_MEASUREMENTS[0].CROWN_RUMP, " cm</span></dd>", 
			"<dt class='po-label'><span>Biparietal Diameter:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.ULTRASOUND_MEASUREMENTS[0].BIPARIETAL_DIAMETER, " cm</span></dd>",
			"<dt class='po-label'><span>Head Circumference:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.ULTRASOUND_MEASUREMENTS[0].HEAD_CIRCUMFERENCE, " cm</span></dd>");
	}
	else
	{		
		descriptionHTML.push("<dt class='po-label'><span>Description:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.SESTDESCRIPTION, "</span></dd>");
	}
	
	jsPOHTML.push("<h4><span class='po-det-hd'>EDD details</span></h4><dl class='po-det hvr'><dt class='po-label'><span>EDD:</span></dt><dd class='po-name'><span>", estDate1,
			"</span></dd><dt class='po-label'><span>EGA:</span></dt><dd class='po-name'><span>", gesAge, 
			"weeks&nbsp;", inDays,  
			"days</span></dd><dt class='po-label'><span>Status:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.SEDDSTATUS,
			"</span></dd><dt class='po-label'><span>Confirmation:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.SESTCONFIRMATIONSTATUS,
			"</span></dd><dt class='po-label'><span>Method:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.SESTMETHOD,
			"</span></dd><dt class='po-label'><span>Date:</span></dt><dd class='po-name'><span>", pregDate,
			"</span></dd>", descriptionHTML.join(""),
			"<dt class='po-label'><span>Documented By:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.SESTAUTHOR,
			"</span></dd></dl></td><td class='po-label'>Age:</td>");
	
	if(jsonEval.RECORD_DATA.SPATIENTAGE==null || jsonEval.RECORD_DATA.SPATIENTAGE == "")//005
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SPATIENTAGE,"</td>");//005
	}
	jsPOHTML.push("<td class='po-label'>Marital Status:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTMARITALSTATUS==null || jsonEval.RECORD_DATA.SPATIENTMARITALSTATUS=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SPATIENTMARITALSTATUS,"</td>");
	}
	jsPOHTML.push("<td class='po-label'>Current Weight:</td>");
	if(jsonEval.RECORD_DATA.DPATIENTWEIGHT==null || jsonEval.RECORD_DATA.DPATIENTWEIGHT=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>"+jsonEval.RECORD_DATA.DPATIENTWEIGHT+ "&nbsp;"+jsonEval.RECORD_DATA.SPATIENTWEIGHTUNITS+"</td>");
	}
	jsPOHTML.push("</tr><tr><td class='po-label'>EGA:</td>");
	jsPOHTML.push("<td class='po-name'>", gesAge,"weeks&nbsp;", inDays,"days</td>" );
	jsPOHTML.push("<td class='po-label'>DOB:</td>");
	if(dobDate==null || dobDate=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", dobDate,"</td>");
	}
	jsPOHTML.push("<td class='po-label'>Domestic Partner:</td>");
	if( jsonEval.RECORD_DATA.SPATIENTDOMESTICPARTNER==null || jsonEval.RECORD_DATA.SPATIENTDOMESTICPARTNER=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SPATIENTDOMESTICPARTNER,"</td>");
	}
	jsPOHTML.push("<td class='po-label'>Pre-Preg Weight:</td>");
	if(jsonEval.RECORD_DATA.DPATIENTPREPREGWEIGHT==null || jsonEval.RECORD_DATA.DPATIENTPREPREGWEIGHT=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>"+jsonEval.RECORD_DATA.DPATIENTPREPREGWEIGHT+"&nbsp;"+jsonEval.RECORD_DATA.SPATIENTPREPREGWEIGHTUNITS+"</td>");
	}
    //001 Update HREF for G/P link
	jsPOHTML.push("</tr><tr><td class='po-label'>Gravida/Parity:</td><td class='po-name'><dl class='po-info'><dt class='po-det-type'><span>Result</span></dt><dd>",
	              "<a href='", mpObj.pregHistLink, "'>G", jsonEval.RECORD_DATA.LGRAVIDA,
				  ",P", jsonEval.RECORD_DATA.LPARA,
				  "(", jsonEval.RECORD_DATA.LPARAFULLTERM,
				  ",", jsonEval.RECORD_DATA.LPARAPREMATURE,
				  ",", jsonEval.RECORD_DATA.LPARAABORTIONS,
				  ",", jsonEval.RECORD_DATA.LLIVING,
				  ")</a></dd></dl><h4><span class='po-det-hd'>Gravida details</span></h4><dl class='po-det hvr'><dt class='po-label'><span>Ectopic:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.LECTOPIC,
				  "</span></dd><dt class='po-label'><span>Spontaneous Abortions:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.LSPONTANEOUSABORTIONS,
				  "</span></dd><dt class='po-label'><span>Induced Abortions:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.LINDUCEDABORTIONS,
				  "</span></dd><dt class='po-label'><span>Multiple Birth Pregnancies:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.LMULTIPLEBIRTH,
				  "</span></dd><dt class='po-label'><span>Gravida:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.LGRAVIDA,
				  "</span></dd><dt class='po-label'><span>Para Full Term:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.LPARAFULLTERM,
				  "</span></dd><dt class='po-label'><span>Abortions:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.LPARAABORTIONS,
				  "</span></dd><dt class='po-label'><span>Living:</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.LLIVING,
				  "</span></dd></dl></td><td class='po-label'>Race:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTRACE==null || jsonEval.RECORD_DATA.SPATIENTRACE=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SPATIENTRACE,"</td>");
	}
	jsPOHTML.push("<td class='po-label'>FOB:</td>");
	if(jsonEval.RECORD_DATA.SFATHEROFBABY==null || jsonEval.RECORD_DATA.SFATHEROFBABY=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SFATHEROFBABY,"</td>");
	}
	jsPOHTML.push("<td class='po-label'>Height:</td>");
	
	//Display Patient Height and unit from the data returned.
	if (jsonEval.RECORD_DATA.DPATIENTHEIGHT == 0)
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.DPATIENTHEIGHT," ", jsonEval.RECORD_DATA.SPATIENTHEIGHTUNITS,"</td>"); //010
	}
	
	jsPOHTML.push("</tr><tr><td class='po-label'>Multiple Fetuses:</td>");
	if ( jsonEval.RECORD_DATA.SMULTIPLEPREGANCY == null || jsonEval.RECORD_DATA.SMULTIPLEPREGANCY=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SMULTIPLEPREGANCY,"</td>");
	}
	jsPOHTML.push("<td class='po-label'>Ethnicity:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTETHNICITY==null || jsonEval.RECORD_DATA.SPATIENTETHNICITY=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SPATIENTETHNICITY,"</td>");
	}
	jsPOHTML.push("<td class='po-label'>Insurance:</td>");
	if(jsonEval.RECORD_DATA.SINSURANCE==null || jsonEval.RECORD_DATA.SINSURANCE=="")
	{
	    jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
	    jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SINSURANCE,"</td>");
	}
	jsPOHTML.push("<td class='po-label'>BMI:</td>");
	if( jsonEval.RECORD_DATA.DPATIENTBMI == null || jsonEval.RECORD_DATA.DPATIENTBMI=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.DPATIENTBMI,"</td>");
	}
		 
	jsPOHTML.push("</tr><tr><td class='po-label'>Feeding Plan:</td>");
	if(jsonEval.RECORD_DATA.SFEEDING==null || jsonEval.RECORD_DATA.SFEEDING=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SFEEDING,"</td>");
	}
	jsPOHTML.push("<td class='po-label'>Language:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTLANG=="" || jsonEval.RECORD_DATA.SPATIENTLANG==null)
	{
	    jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
	    jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SPATIENTLANG,"</td>");
	}
	
	jsPOHTML.push("<td class='po-label'>&nbsp;</td><td class='po-name'>&nbsp;</td>");
		jsPOHTML.push("<td class='po-label'>Blood Type:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTBLOODTYPE==null || jsonEval.RECORD_DATA.SPATIENTBLOODTYPE=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SPATIENTBLOODTYPE,"</td>");
	}
	jsPOHTML.push("</tr><tr><td class='po-label'>&nbsp;</td><td class='po-name'>&nbsp;</td><td class='po-label'>Education:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTEDU==null || jsonEval.RECORD_DATA.SPATIENTEDU=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SPATIENTEDU,"</td>");
	}
	jsPOHTML.push("<td class='po-label'>&nbsp;</td><td class='po-name'>&nbsp;</td><td class='po-label'>Rh Factor:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTRHFACTOR==null || jsonEval.RECORD_DATA.SPATIENTRHFACTOR=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SPATIENTRHFACTOR,"</td>");
	}
	jsPOHTML.push("</tr><tr><td class='po-label'>&nbsp;</td><td class='po-name'>&nbsp;</td><td class='po-label'>Occupation:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTOCCUPATION==null || jsonEval.RECORD_DATA.SPATIENTOCCUPATION=="")
	{
		jsPOHTML.push("<td class='po-name'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name'>", jsonEval.RECORD_DATA.SPATIENTOCCUPATION,"</td>");
	}
		  
	jsPOHTML.push("<td class='po-label'>&nbsp;</td><td class='po-name'>&nbsp;</td><td class='po-label'>&nbsp;</td><td class='po-name'>&nbsp;</td></td></tr></table></div>");
	jsPOHTML.push("<div id='contact'><table class='po-table'><tr><td class='po-label1'><span class='head'>Patient </span></td><td class='po-name1'>&nbsp;</td><td class='po-label1'><span class='head'>Emergency Contact </span></td><td class='po-name1'>&nbsp;</td><td class='po-label1'><span class='head' >	Primary Care Physician </span></td><td class='po-name1'>&nbsp;</td></tr><tr><td class='po-label1'>Address:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTADDRESS==null || jsonEval.RECORD_DATA.SPATIENTADDRESS=="")
	{
		jsPOHTML.push("<td class='po-name1'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name1'>", jsonEval.RECORD_DATA.SPATIENTADDRESS,"</td>");
	}
	jsPOHTML.push("<td class='po-label1'>Name:</td>");
	if(jsonEval.RECORD_DATA.SECNAME==null || jsonEval.RECORD_DATA.SECNAME=="")
	{
		jsPOHTML.push("<td class='po-name1'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name1'>", jsonEval.RECORD_DATA.SECNAME,"</td>");
	}
	jsPOHTML.push("<td class='po-label1'>Name:</td>");
	if(jsonEval.RECORD_DATA.SPCPNAME==null || jsonEval.RECORD_DATA.SPCPNAME=="")
	{
		jsPOHTML.push("<td class='po-name1'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name1'>", jsonEval.RECORD_DATA.SPCPNAME,"</td>");
	}
	jsPOHTML.push("</tr><tr><td class='po-label1'>City:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTCITY==null || jsonEval.RECORD_DATA.SPATIENTCITY=="")
	{
		jsPOHTML.push("<td class='po-name1'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name1'>", jsonEval.RECORD_DATA.SPATIENTCITY,"</td>");
	}
		  
	jsPOHTML.push("<td class='po-label1'>Relationship:</td>");
	if(jsonEval.RECORD_DATA.SECRELATIONSHIP==null || jsonEval.RECORD_DATA.SECRELATIONSHIP=="")
	{
		jsPOHTML.push("<td class='po-name1'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name1'>", jsonEval.RECORD_DATA.SECRELATIONSHIP,"</td>");
	}
		  
	jsPOHTML.push("<td class='po-label1'>Phone:</td><td class='po-name'><dl class='po-info'><dt class='po-det-type'><span>Result</span></dt>");
	if(pcpphoneLen==0)
	{
		jsPOHTML.push("<dd>--</dd></dl>");
	}
	else
	{
		jsPOHTML.push("<dd>", jsonEval.RECORD_DATA.PCPPHONES[0].SPHONENUMBER, 
					"</dd></dl>");
	}
			
	jsPOHTML.push("<h4><span class='po-det-hd'>EDD details</span></h4><dl class='po-det hvr'>");
	if(pcpphoneLen==0)
	{
		jsPOHTML.push("<dt class='po-label'><span>&nbsp;</span></dt><dd class='po-name'><span>&nbsp;</span></dd>");
	}
	else
	{
		for(var i=0; i<jsonEval.RECORD_DATA.PCPPHONES.length; i++)
		{
			jsPOHTML.push("<dt class='po-label'><span>", jsonEval.RECORD_DATA.PCPPHONES[i].SPHONENUMBERTYPE, 
						":</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.PCPPHONES[i].SPHONENUMBER, 
						"</span></dd>");
		}
	}
	jsPOHTML.push("</dl></td></tr><tr><td class='po-label1'>State:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTSTATE==null || jsonEval.RECORD_DATA.SPATIENTSTATE=="")
	{
		jsPOHTML.push("<td class='po-name1'>--</td>");
	}
	else
	{
		jsPOHTML.push("<td class='po-name1'>", jsonEval.RECORD_DATA.SPATIENTSTATE,"</td>");
	}
		  
	jsPOHTML.push("<td class='po-label1'>Phone:</td><td class='po-name'><dl class='po-info'><dt class='po-det-type'><span>Result</span></dt>");
	if(ecphoneLen==0)
	{
		jsPOHTML.push("<dd>--</dd></dl>");
	}
	else
	{
		jsPOHTML.push("<dd>", jsonEval.RECORD_DATA.ECPHONES[0].SPHONENUMBER, 
					"</dd></dl>");
	}
	jsPOHTML.push("<h4><span class='po-det-hd'>EDD details</span></h4><dl class='po-det hvr'>");
	if(ecphoneLen==0)
	{
		jsPOHTML.push("<dt class='po-label'><span>&nbsp;</span></dt><dd class='po-name'><span>&nbsp;</span></dd>");
	}
		else
	{
		for(var i=0; i<jsonEval.RECORD_DATA.ECPHONES.length; i++)
		{
			jsPOHTML.push("<dt class='po-label'><span>", jsonEval.RECORD_DATA.ECPHONES[i].SPHONENUMBERTYPE, 
						":</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.ECPHONES[i].SPHONENUMBER, 
						"</span></dd>");
		}
	}
	jsPOHTML.push("</dl></td><td class='po-label1'>Email:</td><td class='po-name1'>--</td></tr><tr><td class='po-label1'>ZIP:</td>");
	if(jsonEval.RECORD_DATA.SPATIENTZIP=="" || jsonEval.RECORD_DATA.SPATIENTZIP==null)
	{
	    jsPOHTML.push("<td class='po-name1'>--</td>");
	}
	else
	{
	    jsPOHTML.push("<td class='po-name1'>", jsonEval.RECORD_DATA.SPATIENTZIP,"</td>");
	}
	jsPOHTML.push("<td class='po-label1'>Email:</td><td class='po-name1'>--</td><td class='po-label1'>&nbsp;</td><td class='po-name1'>&nbsp;</td></tr><tr><td class='po-label1'>Phone:</td><td class='po-name'><dl class='po-info'><dt class='po-det-type'><span>Result</span></dt>");
	if(patphoneLen==0)
	{
		jsPOHTML.push("<dd>--</dd></dl>");
	}
	else
	{
		jsPOHTML.push("<dd>", jsonEval.RECORD_DATA.PATIENTPHONES[0].SPHONENUMBER, 
					"</dd></dl>");
	}
	jsPOHTML.push("<h4><span class='po-det-hd'>EDD details</span></h4><dl class='po-det hvr'>");
	if(patphoneLen==0)
	{
		jsPOHTML.push("<dt class='po-label'><span>&nbsp;:</span></dt><dd class='po-name'><span>&nbsp;</span></dd>");
	}
	else
	{
		for(var i=0; i<jsonEval.RECORD_DATA.PATIENTPHONES.length; i++)
		{
			jsPOHTML.push("<dt class='po-label'><span>", jsonEval.RECORD_DATA.PATIENTPHONES[i].SPHONENUMBERTYPE, 
						":</span></dt><dd class='po-name'><span>", jsonEval.RECORD_DATA.PATIENTPHONES[i].SPHONENUMBER, 
						"</span></dd>");
		}
	}
	jsPOHTML.push("</dl></td><td class='po-label1'>&nbsp;</td><td class='po-name1'>&nbsp;</td><td class='po-label1'>&nbsp;</td><td class='po-name1'>&nbsp;</td></tr><tr><td class='po-label1'>Email:</td><td class='po-name1'>--</td><td class='po-label1'>&nbsp;</td><td class='po-name1'>&nbsp;</td><td class='po-label1'>&nbsp;</td><td class='po-name1'>&nbsp;</td></tr></table></div>");

	//if delivery date add/show delivery summary section
	if(mpObj.deliveryDt=="" || mpObj.deliveryDt==null)
	{
		jsPOHTML.push(tableBody);
	}
	else 
	{
		jsPOHTML.push(tableBody);
		var deliverydata = deliveryDoc();
		var jsonEval = JSON.parse(deliverydata);
		var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
		if(status=="S")
		{
			jsPOHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>Delivery Summary</span></h3><div class='sub-sec-content'>");
			jsPOHTML.push(" <table class='po-table'><tr><td class='po-label1'>Episiotomy/Laceration:</td>")
			if(jsonEval.RECORD_DATA.EPISIOTOMY==null || jsonEval.RECORD_DATA.EPISIOTOMY=="")
			{
			    jsPOHTML.push("<td class='po-name1'>--");
			}
			else
			{
			    jsPOHTML.push("<td class='po-name1'>"+jsonEval.RECORD_DATA.EPISIOTOMY);
			}
			
			if(jsonEval.RECORD_DATA.LACERATION == null || jsonEval.RECORD_DATA.LACERATION=="")
			{
			    jsPOHTML.push("/--");
			}
			else
			{
			    jsPOHTML.push("/", jsonEval.RECORD_DATA.LACERATION,"</td>");
			}
			jsPOHTML.push("</td><td class='po-label1'>Anesthesia:</td>");
			if ( jsonEval.RECORD_DATA.ANESTHESIA==null || jsonEval.RECORD_DATA.ANESTHESIA=="")
			{
			    jsPOHTML.push("<td class='po-name1'>--");
			}
			else
			{
			    jsPOHTML.push("<td class='po-name1'>"+jsonEval.RECORD_DATA.ANESTHESIA);
			}
			
			jsPOHTML.push("</td><td class='po-label1'>&nbsp;</td><td class='po-name1'>&nbsp;</td></tr>");
			var babyNum = jsonEval.RECORD_DATA.BABIES.length;
			if(babyNum==0)
			{
				jsPOHTML.push("<tr><td></td></tr>");
			}
			else
			{
				for(var i=0; i<babyNum; i++)
				{
					var cnt = i+1;
					var rem = i%2;
					var col;
					if(rem==0)
					{
						col = "";
					}
					else
					{
						col = "";
					}
					jsPOHTML.push("<tr><td class='po-label2 po-rwcol' >Baby", cnt,"</td><td class='po-name3 po-rwcol'>&nbsp;</td><td class='po-label3 po-rwcol' >Weight:</td>");
					if(jsonEval.RECORD_DATA.BABIES[i].WEIGHT==null || jsonEval.RECORD_DATA.BABIES[i].WEIGHT=="")
					{
					    jsPOHTML.push("<td class='po-name3 po-rwcol'>--");
					}
					else
					{
					    jsPOHTML.push("<td class='po-name3 po-rwcol'>"+jsonEval.RECORD_DATA.BABIES[i].WEIGHT);
					}
					jsPOHTML.push("</td><td class='po-label3 po-rwcol'>APGAR Score:</td>");
					if(jsonEval.RECORD_DATA.BABIES[i].APGAR1==null || jsonEval.RECORD_DATA.BABIES[i].APGAR1=="")
					{
					    jsPOHTML.push("<td class='po-name3 po-rwcol'>--");
					}
					else
					{
					     jsPOHTML.push("<td class='po-name3 po-rwcol'>"+jsonEval.RECORD_DATA.BABIES[i].APGAR1);   
					}
					if(jsonEval.RECORD_DATA.BABIES[i].APGAR5==null || jsonEval.RECORD_DATA.BABIES[i].APGAR5=="")
					{
					    jsPOHTML.push("/--");
					}
					else
					{
					    jsPOHTML.push("/"+jsonEval.RECORD_DATA.BABIES[i].APGAR5);
					}
					jsPOHTML.push("</td></tr><tr class='", col,"'><td class='po-label1'>Delivery Date:</td>");
					if(jsonEval.RECORD_DATA.BABIES[i].DELIVERY_DT_TM=="" || jsonEval.RECORD_DATA.BABIES[i].DELIVERY_DT_TM==null)
					{
					    jsPOHTML.push("<td class='po-name1'>--");
					}
					else
					{
						var dlvDate = fmtDt(jsonEval.RECORD_DATA.BABIES[i].DELIVERY_DT_TM,"longDateTime2");
					    jsPOHTML.push("<td class='po-name1'>"+dlvDate);
					}
					
					jsPOHTML.push("</td><td class='po-label1'>Neonate Outcome:</td>");
					if(jsonEval.RECORD_DATA.BABIES[i].NEONATE_OUTCOME=="" || jsonEval.RECORD_DATA.BABIES[i].NEONATE_OUTCOME==null)
					{
					    jsPOHTML.push("<td class='po-name1'>--");
					}
					else
					{
					    jsPOHTML.push("<td class='po-name1'>"+jsonEval.RECORD_DATA.BABIES[i].NEONATE_OUTCOME);
					}
					
					jsPOHTML.push("</td><td class='po-label1'>Feeding:</td>");
					if(jsonEval.RECORD_DATA.BABIES[i].FEEDING==""  || jsonEval.RECORD_DATA.BABIES[i].FEEDING==null)
					{
					    jsPOHTML.push("<td class='po-name1'>--");
					}
					else
					{
					    jsPOHTML.push("<td class='po-name1'>"+jsonEval.RECORD_DATA.BABIES[i].FEEDING);
					}
					
					jsPOHTML.push("</td></tr><tr class='", col,"' style='border-bottom =1px solid #505050;'><td class='po-label1'>Sex:</td>");
					if(jsonEval.RECORD_DATA.BABIES[i].GENDER=="" || jsonEval.RECORD_DATA.BABIES[i].GENDER==null)
					{
					    jsPOHTML.push("<td class='po-name1'>--");
					}
					else
					{
					    jsPOHTML.push("<td class='po-name1'>"+jsonEval.RECORD_DATA.BABIES[i].GENDER);
					}
					
					jsPOHTML.push("</td><td class='po-label1'>Fetal Complications:</td>");
					if(jsonEval.RECORD_DATA.BABIES[i].COMPLICATIONS==null || jsonEval.RECORD_DATA.BABIES[i].COMPLICATIONS=="")
					{
					    jsPOHTML.push("<td class='po-name1'>--");
					}
					else
					{
					    jsPOHTML.push("<td class='po-name1'>"+jsonEval.RECORD_DATA.BABIES[i].COMPLICATIONS);
					}
					
					jsPOHTML.push("</td><td class='po-label1'>Pregnancy Outcome:</td>");
					if(jsonEval.RECORD_DATA.BABIES[i].OUTCOME==null || jsonEval.RECORD_DATA.BABIES[i].OUTCOME=="")
					{
					    jsPOHTML.push("<td class='po-name1'>--"); 
					}
					else
					{
					    jsPOHTML.push("<td class='po-name1'>"+jsonEval.RECORD_DATA.BABIES[i].OUTCOME);
					}
					
					jsPOHTML.push("</td></tr>");
				}
			}
			jsPOHTML.push("</table></div></div>");		
		}
		else if(status=="Z")
		{
			jsPOHTML.push("<table><tr><td>" + HandleNoDataResponse("po") + "</td></tr></table>");
		}
		else 
		{
			jsPOHTML.push("<table><tr><td>" + HandleErrorResponse("po") + "</td></tr></table>");
		}
	}
	poHTML = jsPOHTML.join("");
    sec1load(poHTML,"po","");
    return(poObj);
}

function pregLoad(pregInput) 
{
	var pregData = pregInput;
	if(debugFlag){
	logRecord("Pregnancy History JSON:");
	logRecord(pregData);
    }
	//var pregData ='{"PREGHIST": {"PREG_CNT": 2,"PREG": [{"CHILD_CNT": 1,"BSENSITIVITYIND": 1,"CHILD": [{"DLV_DATE": "05\/14\/1995","GEST_AT_BIRTH": "0","CHILD_GENDER": "Male","LENGTH_LABOR": "-1","INFANT_WT": "0","PRETERM_LABOR": "","NEONATE_OUTCOME": "Fetal Death","PREG_OUTCOME": "","ANESTH_TYPE": "","DLV_HOSP": "","CHILD_NAME": "xyz","FATHER_NAME": "Omega Metroid","FETAL_COMPLIC": "","NEONATE_COMPLIC": "","MATERNAL_COMPLIC": "","PREG_COMMENTS": "","CHILD_COMMENT_ID": 0 } ] },{"CHILD_CNT": 2,"BSENSITIVITYIND": 0,"CHILD": [{"DLV_DATE": "12\/05\/2007","GEST_AT_BIRTH": "42wk 6d","CHILD_GENDER": "Male","LENGTH_LABOR": "0","INFANT_WT": "3884 g","PRETERM_LABOR": "","NEONATE_OUTCOME": "Live Birth","PREG_OUTCOME": "Vaginal","ANESTH_TYPE": "","DLV_HOSP": "","CHILD_NAME": "Jimbo","FATHER_NAME": "Ridley","FETAL_COMPLIC": "","NEONATE_COMPLIC": "","MATERNAL_COMPLIC": "","PREG_COMMENTS": "","CHILD_COMMENT_ID": 1766911 },{"DLV_DATE": "12\/05\/2007","GEST_AT_BIRTH": "42wk 6d","CHILD_GENDER": "Male","LENGTH_LABOR": "0","INFANT_WT": "1843 g","PRETERM_LABOR": "","NEONATE_OUTCOME": "Live Birth","PREG_OUTCOME": "Vaginal","ANESTH_TYPE": "","DLV_HOSP": "","CHILD_NAME": "Maria","FATHER_NAME": "Ridley","FETAL_COMPLIC": "","NEONATE_COMPLIC": "","MATERNAL_COMPLIC": "","PREG_COMMENTS": "","CHILD_COMMENT_ID": 1766913 } ] } ] }}';
	var jsonEval = JSON.parse(pregData);
	var jsPREGHTML = [];
	var pregHTML = "";
	var buildSec = "";
	var pic = "";
	var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	
	if(status=="S")
	{
		//getting PREG_CNT value and looping
		var len = jsonEval.RECORD_DATA.PREG_CNT;
		for( var i=0; i<len; i++)
		{
			var pregNum = i+1;
			//getting CHILD_CNT value and looping
			var childCnt = jsonEval.RECORD_DATA.PREG[i].CHILD_CNT;
			var sensitivity = jsonEval.RECORD_DATA.PREG[i].BSENSITIVITYIND;
			var sec = "";
			var tableBody = [];
			for(var j=0; j<childCnt; j++)
			{
				var num = j+1;
//certrn - failing				var dlvDate = fmtDt(jsonEval.RECORD_DATA.PREG[i].CHILD[j].DLV_DATE,"longDateTime2");
				var dlvDate = jsonEval.RECORD_DATA.PREG[i].CHILD[j].DLV_DATE;
				var neoOutcome = jsonEval.RECORD_DATA.PREG[i].CHILD[j].NEONATE_OUTCOME;
				var pregOutcome = jsonEval.RECORD_DATA.PREG[i].CHILD[j].PREG_OUTCOME;
				var gender = jsonEval.RECORD_DATA.PREG[i].CHILD[j].CHILD_GENDER;
				var infWeight = jsonEval.RECORD_DATA.PREG[i].CHILD[j].INFANT_WT;
				var gesAge = jsonEval.RECORD_DATA.PREG[i].CHILD[j].GEST_AT_BIRTH;
				//display sensitive pregnancy indicator flag
				if ( sensitivity==1)
				{
					tableBody.push ("<dl class='preg-info'><dt class='preg-det-hd'>Pregnancy</dt><dd class='preg-med-name'><span class='pregpic'>Baby", num,
					 ":</span><span class='preg-md-sig'>");
				}		   
				else
				{
					tableBody.push ("<dl class='preg-info'><dt class='preg-det-hd'>Pregnancy</dt><dd class='preg-med-name'><span class='result'>Baby", num,
					 ":</span><span class='preg-md-sig'>");
				}			   
					   
				if(dlvDate == null || dlvDate == "")
				{
					tableBody.push("");
				}
				else 
				{
					tableBody.push("" ,dlvDate,",");
				}
				if(neoOutcome == null || neoOutcome == "")
				{
					tableBody.push ("");
				}
				else 
				{
					tableBody.push("", neoOutcome,",");
				}
				if (pregOutcome == null || pregOutcome == "")
				{
					tableBody.push("");
				}
				else 
				{
					tableBody.push("", pregOutcome,",");
				}
				if(gender == null || gender == "")
				{
					tableBody.push("");
				}
				else 
				{
					tableBody.push("", gender,",");
				}
				if(infWeight == null || infWeight == "")
				{
					tableBody.push("");
				}
				else 
				{
					tableBody.push("", infWeight,",");
				}
				if(gesAge == null || gesAge == "")
				{
					tableBody.push("");
				}
				else 
				{
					tableBody.push("", gesAge,"");
				}
				tableBody.push("</span></dd></dl>");	
				tableBody.push("<h4><strong><span class='preg-det-hd'>Pregnancy Details</span></strong></h4><dl class='preg-det hvr'><dt class='preg-det-type'><strong><span>Length of Labor:</span></strong></dt><dd class='result'><span>", jsonEval.RECORD_DATA.PREG[i].CHILD[j].LENGTH_LABOR,	
						 "</span></dd><dt class='preg-det-type'><strong><span>Delivery Hospital:</span></strong></dt><dd class='result'><span>", jsonEval.RECORD_DATA.PREG[i].CHILD[j].DLV_HOSP,
						 "</span></dd><dt class='preg-det-type'><strong><span>Child's Name:</span></strong></dt><dd class='result'><span>", jsonEval.RECORD_DATA.PREG[i].CHILD[j].CHILD_NAME,
						 "</span></dd><dt class='preg-det-type'><strong><span>FOB Name:</span></strong></dt><dd class='result'><span>", jsonEval.RECORD_DATA.PREG[i].CHILD[j].FATHER_NAME,
						 "</span></dd></dl>");	
			}
			sec = tableBody.join("");
			// building the appropriate subsections
			buildSec+= 	   "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>Pregnancy#"+pregNum+"</span></h3><div class='sub-sec-content'>"+sec+"</div></div>";
		}
		jsPREGHTML.push(buildSec);	  
	}
	else if(status=="Z")
	{
		jsPREGHTML.push(HandleNoDataResponse("preg"));
	}
	else 
	{
		jsPREGHTML.push(HandleErrorResponse("preg"));
	}

	var countText = mpObj.gravparaStr;
	pregHTML = jsPREGHTML.join("");
	//secLoad(pregHTML, "preg", countText, 0);
	sec1load(pregHTML,"preg",countText);
}

// Load Notes and Reminders
function nrLoad(xhr) {
	var jsonEval = JSON.parse(xhr);
	if(debugFlag){
	logRecord("Notes and Reminders JSON:");
	logRecord(xhr);
    }
	var nrObj = [];
	var jsNotesSec = [];
	var jsRemindersSec = [];
	var jsNrHTML = [];
	var nrHTML = "";
	var noteCnt = 0;
	var reminderCnt = 0;

	noteCnt = jsonEval.RECORD_DATA.N_CNT;
	reminderCnt = jsonEval.RECORD_DATA.R_CNT;

	if(noteCnt > 0){
		nrObj = jsonEval.RECORD_DATA.NOTES;
		jsNotesSec = ["<dl class='nr-info-hdr'><dd class='nr-auth-hd'><span>Author</span></dd><dd class='nr-dt-hd'><span>Date</span></dd>",
						"<dd class='nr-txt-hd'><span>Text</span></dd></dl>"];
		for (var i=0; i<noteCnt; i++) {
			jsNotesSec.push("<dl class='nr-info'><dd class='nr-auth'><span>", nrObj[i].N_AUTHOR_NAME,
							"</span></dd><dd class='nr-dt'><span>", fmtDt(nrObj[i].N_DATE,"longDateTime2"),
							"</span></dd><dd class='nr-txt'><span>", nrObj[i].N_TEXT,
							"</span></dd></dl>");
		}
	}else{
		jsNotesSec = ["<dl class='nr-info'><dd>" + HandleNoDataResponse("nr") + "</dd></dl>"];
	}

	if(reminderCnt > 0){
		nrObj = jsonEval.RECORD_DATA.REMINDERS;
		var jsRemindersSec = ["<dl class='nr-info-hdr'><dd class='nr-prior-hd'><span>Priority</span></dd><dd class='nr-subj-hd'><span>Subject</span></dd>",
							"<dd class='nr1-dt-hd'><span>Show Up</span></dd><dd class='nr1-dt-hd'><span>Due</span></dd><dd class='nr-stat-hd'><span>Status</span></dd></dl>"];
		for (var i=0; i<reminderCnt; i++) {
			jsRemindersSec.push("<dl class='nr-info'><dd class='nr-prior'><span>", nrObj[i].R_PRIORITY,
							"</span></dd><dd class='nr-subj'><span>", nrObj[i].R_SUBJECT,
							"</span></dd><dd class='nr1-dt'><span>", fmtDt(nrObj[i].R_DATE,"longDateTime2"),
							"</span></dd><dd class='nr1-dt'><span>", fmtDt(nrObj[i].R_DUE_DATE,"longDateTime2"),
							"</span></dd><dd class='nr-stat'><span>", nrObj[i].R_STATUS,
							"</span></dd></dl>");
		}
	}else{
		jsRemindersSec = ["<dl class='nr-info'><dd>" + HandleNoDataResponse("nr") + "</dd></dl>"];
	}
	
	jsNrHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>Sticky Notes (",
					noteCnt, ")</span></h3><div class='sub-sec-content'>",	jsNotesSec.join(""), "</div></div><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>Reminders (", reminderCnt, ")</span></h3><div class='sub-sec-content'>",
					jsRemindersSec.join(""), "</div></div>");
					
	nrHTML = jsNrHTML.join("");
	var totalCnt = 0;
	totalCnt += noteCnt + reminderCnt;
	var countText = "(" + totalCnt + ")";
	sec1load(nrHTML,"nr",countText);
}

//function to display appropriate div
function displayDiv(showDiv,liDiv){
	var myDivs = new Array("home","contact");
	var inDivs = new Array("one","two");
	var myDiv;
	var inDiv;
	var prevDiv;
	for (myDiv=0; myDiv<myDivs.length; myDiv++){
		//hide all
		document.getElementById(myDivs[myDiv]).style.display = 'none';
		for (inDiv=0; inDiv<inDivs.length; inDiv++){
			document.getElementById(inDivs[inDiv]).className = 'inactive';
		}
	}
	//show desired
	document.getElementById(showDiv).style.display = 'block';
	document.getElementById(liDiv).className = 'active';
}

function LoadArrayLAB(xmlObj,aObj,cntP){
    //ok, spin through, create a new object when we need
    //it, the case will find which tag it is and place it in the
    //appropriate place in the array
    var resultCntr = -1;
    var dateCntr = -1;
    var dateShortCntr = -1;
    var collDateCntr = -1;
 
    var uomCntr = -1;
    var normalcyCntr = -1;
    var normalcyColorCntr = -1;
    var normalHighCntr = -1;
    var normalLowCntr = -1;
    var criticalHighCntr = -1;
    var criticalLowCntr = -1;
 
    var indicesTitleCntr = -1;
    var indicesResultCntr = -1;
    var indicesDateCntr = -1;

    var diffTitleCntr = -1;
    var diffResultCntr = -1;
    var diffDateCntr = -1;
    var withinCntr = -1;
    for (var loadLAB=0;loadLAB<xmlObj.length;loadLAB++){
       if (xmlObj[loadLAB].childNodes(0)){
           if(cntP==aObj.length){aObj[cntP] = new Object();}
                         switch(xmlObj[loadLAB].tagName){
                  case "lab_title":
                    aObj[cntP].title    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "lab_result":
                    indicesTitleCntr = -1;
                    indicesResultCntr = -1;
                    indicesDateCntr = -1;
                    diffTitleCntr = -1;
                    diffResultCntr = -1;
                    diffDateCntr = -1;
                    resultCntr++;
                    if (resultCntr==0){
                       aObj[cntP].result = new Object();
                       aObj[cntP].indicesTitle = new Object();
                       aObj[cntP].indicesResult = new Object();
                       aObj[cntP].indicesDate = new Object();
                       aObj[cntP].diffTitle = new Object();
                       aObj[cntP].diffResult = new Object();
                       aObj[cntP].diffDate = new Object();}
 
                    aObj[cntP].result[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    aObj[cntP].indicesTitle[resultCntr] = null;
                    aObj[cntP].diffTitle[resultCntr] = null;
                    break;
 
                  case "lab_date":
                    dateCntr++;
                    if (dateCntr==0)
                       aObj[cntP].date = new Object();
 
                    aObj[cntP].date[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "lab_short_date":
                    dateShortCntr++;
                    if (dateShortCntr==0)
                       aObj[cntP].dateShort = new Object();
 
                    aObj[cntP].dateShort[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "within_time":
                    withinCntr++;
                    if (withinCntr==0)
                       aObj[cntP].within = new Object();
 
                    aObj[cntP].within[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "lab_collection_date":
                    collDateCntr++;
                    if (collDateCntr==0)
                       aObj[cntP].collectionDate = new Object();
 
                    aObj[cntP].collectionDate[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "lab_uom":
                    uomCntr++;
                    if (uomCntr==0)
                       aObj[cntP].uom = new Object();
 
                    aObj[cntP].uom[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "lab_normalcy":
                    normalcyCntr++;
                    if (normalcyCntr==0)
                       aObj[cntP].normalcy = new Object();
 
                    aObj[cntP].normalcy[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "lab_normalcy_color":
                    normalcyColorCntr++;
                    if (normalcyColorCntr==0)
                       aObj[cntP].normalcyColor = new Object();
 
                    aObj[cntP].normalcyColor[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "lab_normal_high":
                    normalHighCntr++;
                    if (normalHighCntr==0)
                       aObj[cntP].normalHigh = new Object();
 
                    aObj[cntP].normalHigh[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "lab_normal_low":
                    normalLowCntr++;
                    if (normalLowCntr==0)
                       aObj[cntP].normalLow = new Object();
 
                    aObj[cntP].normalLow[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "lab_critical_high":
                    criticalHighCntr++;
                    if (criticalHighCntr==0)
                       aObj[cntP].criticalHigh = new Object();
 
                    aObj[cntP].criticalHigh[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "lab_critical_low":
                    criticalLowCntr++;
                    if (criticalLowCntr==0)
                       aObj[cntP].criticalLow = new Object();
 
                    aObj[cntP].criticalLow[resultCntr]    = xmlObj[loadLAB].childNodes(0).nodeValue;
                    break;
 
                  case "indices_title":
                    indicesTitleCntr++;
                    if (indicesTitleCntr==0) {
                       aObj[cntP].indicesTitle[resultCntr] = xmlObj[loadLAB].childNodes(0).nodeValue;
                    }else{
                       aObj[cntP].indicesTitle[resultCntr] = aObj[cntP].indicesTitle[resultCntr] + "," + xmlObj[loadLAB].childNodes(0).nodeValue;
                    }
                    break;
 
                  case "indices_result":
                    indicesResultCntr++;
                    if (indicesResultCntr==0) {
                       aObj[cntP].indicesResult[resultCntr] = xmlObj[loadLAB].childNodes(0).nodeValue;
                    }else{
                       aObj[cntP].indicesResult[resultCntr] = aObj[cntP].indicesResult[resultCntr] + "," + xmlObj[loadLAB].childNodes(0).nodeValue;
                    }
                    break;
 
                  case "indices_date":
                    indicesDateCntr++;
                    if (indicesDateCntr==0) {
                       aObj[cntP].indicesDate[resultCntr] = xmlObj[loadLAB].childNodes(0).nodeValue;
                    }else{
                       aObj[cntP].indicesDate[resultCntr] = aObj[cntP].indicesDate[resultCntr] + "," + xmlObj[loadLAB].childNodes(0).nodeValue;
                    }
                    break;
 
                  case "diff_title":
                    diffTitleCntr++;
                    if (diffTitleCntr==0) {
                       aObj[cntP].diffTitle[resultCntr] = xmlObj[loadLAB].childNodes(0).nodeValue;
                    }else{
                       aObj[cntP].diffTitle[resultCntr] = aObj[cntP].diffTitle[resultCntr] + "," + xmlObj[loadLAB].childNodes(0).nodeValue;
                    }
                    break;
 
                  case "diff_result":
                    diffResultCntr++;
                    if (diffResultCntr==0) {
                       aObj[cntP].diffResult[resultCntr] = xmlObj[loadLAB].childNodes(0).nodeValue;
                    }else{
                       aObj[cntP].diffResult[resultCntr] = aObj[cntP].diffResult[resultCntr] + "," + xmlObj[loadLAB].childNodes(0).nodeValue;
                    }
                    break;
 
                  case "diff_date":
                    diffDateCntr++;
                    if (diffDateCntr==0) {
                       aObj[cntP].diffDate[resultCntr] = xmlObj[loadLAB].childNodes(0).nodeValue;
                    }else{
                       aObj[cntP].diffDate[resultCntr] = aObj[cntP].diffDate[resultCntr] + "," + xmlObj[loadLAB].childNodes(0).nodeValue;
                    }
                    break;
 
                  default:
                    alert("Unidentified Tag Found. LoadArrayLAB");
            }
            aObj[cntP].result_length    = resultCntr+1
        }
    }
    cntP++;
    return(cntP);
}
 
//load labs
function lrLoad(labInput) {
	var labData = labInput;
if(debugFlag){
	logRecord("Labs JSON:");
	logRecord(labData);
    }
	var jsonEval = JSON.parse(labData);
	var jsLabHTML = [];
	var labHTML = "";
	var labLen = 0;
	var labHd = "";
	var jsStatus = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	if (jsStatus == "Z") {
			labHTML = HandleNoDataResponse("lr");
	}
	else if (jsStatus == "S") {
		var labObj = jsonEval.RECORD_DATA.LAB;
		var tblstyle = "";
		labLen = labObj.length;
		if (lrscrl < labLen)
		{
		    tblstyle = "lr-table1";
		}
		else
		{
		    tblstyle = "lr-table";
		}
		
		jsLabHTML.push("<table class='",tblstyle,"'><tr class='lr-hdr'><th class='lr-lbl'><span>&nbsp;</span></th><th class='lr-res1'><span>Latest</span></th><th class='lr-res2'><span>Previous</span></th><th class='lr-res3'><span>Previous</span></th></tr></table><table class='" +tblstyle+"'>");
		var labLow = mpObj.ipath + "\\images\\6303_11.gif";
		var labHigh = mpObj.ipath + "\\images\\6302_11.gif";
		var labCrit = mpObj.ipath + "\\images\\5278_11.gif";

		for (var i=0; i<labLen; i++) {
			var labItem = labObj[i];
			var labName = labItem.EVENT_NAME;
			var oddEven = "odd";
			if (i % 2 == 1) {
				oddEven = "even";
			}
			jsLabHTML.push("<tr class='", oddEven, "'><td class='lr-lbl'><span><a class='lr-link' href='javascript:CCLLINK(\"mp_preg_graph\",\"MINE,",
							mpObj.personId, ",^", labItem.EVENT_TYPE, "^,", labItem.EVENT_CD, ".0,", 0, ",", mpObj.lookBack, "\",1)'>", labName, "</a></span></td>");  //001
			var labMeas = labItem.MEASUREMENTS;
			var labResLen = labMeas.length;
			if (labResLen > 3) {
				labResLen = 3;
			}
			for (var j=0; j<3; j++) {
				if (j<labResLen) {
					var labRes = labMeas[j];
					var labVal = labRes.VALUE;
					var labNormalcy = labRes.NORMALCY_FLG;
					var labIcon = "";
					if (labNormalcy == 1) {
						labNormalcy = "res-severe";
						labIcon = "<img src='" + labCrit + "' />";
					}
					else if (labNormalcy == 2) {
						labNormalcy = "res-high";
						labIcon = "<img src='" + labHigh + "' />";
					}
					else if (labNormalcy == 4) {
						labNormalcy = "res-low";
						labIcon = "<img src='" + labLow + "' />";
					}
					else {
						labNormalcy = "res-normal";
					}
					var labNormRange = "";
					var labNormLow = labRes.NORMAL_LOW;
					var labNormHigh = labRes.NORMAL_HIGH;
					if (labNormLow != "" || labNormHigh != "") {
						labNormRange = labNormLow + " - " + labNormHigh;
					}
					jsLabHTML.push("<td class='lr-res", j+1, "'><dl class='lr-info'><dt class='lr-det-hd'><span>", labName, "</span></dt><dd class='lr-res'><span class='", labNormalcy, "'>", labIcon, labVal,
					"</span><br /><span class='within'>", fmtDt(labRes.EVENT_END_DT_TM, "longDateTime2"), "</span></dd></dl><h4 class='lr-det-hd'><span>Result Details</span></h4><dl class='lr-det hvr'><dt><span>Result:</span></dt><dd><span class='",
					labNormalcy, "'>", labVal, "</span></dd><dt><span>Normal Range:</span></dt><dd><span>", labNormRange,
					"</span></dd><dt><span>Unit of Measure:</span></dt><dd><span>", labRes.RESULT_UNITS, "</span></dd><dt><span>Date/Time:</span></dt><dd><span>", fmtDt(labRes.EVENT_END_DT_TM, "longDateTime3"), "</span></dd></dl></td>");
				}else {
					jsLabHTML.push("<td class='lr-res", j+1, "'><span>--</span></td>");
				}
			}
			jsLabHTML.push("</tr>");
			lrcnt++;
		}
		jsLabHTML.push("</table>");
		labHTML = jsLabHTML.join("");
	}else {
			labHTML = HandleErrorResponse("lr");
	}
	var countText = "";
	sec1load(labHTML, "lr", countText);
}

/**
  * Document methods
  * @namespace CERN_DOC
  * @static
  * @global
  */
var CERN_HOME_MEDS = function(){
	return {
		GetHomeMedications : function(homeMed){
			var jsonEval = JSON.parse(homeMed);
			if(debugFlag){
	            logRecord("Home Meds JSON:");
	            logRecord(homeMed);
            }
			var sHTML = "", countText = "", jsHTML = [];
			
			if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "Z") {
				sHTML = HandleNoDataResponse("hml");
			}
			else if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "S")
			{
				var currentDate = new Date();
				var meds = new Array();
				var medCnt = 0;
				var codeArray = LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
				var personnelArray = LoadPersonelListJSON(jsonEval.RECORD_DATA.PRSNL);
				
				jsonEval.RECORD_DATA.ORDERS.sort(SortByMedicationName);
				for (var x = 0 in jsonEval.RECORD_DATA.ORDERS){
					var orders = jsonEval.RECORD_DATA.ORDERS[x];
					var orderStatus = GetValueFromArray(orders.CORE.STATUS_CD, codeArray);
					var item = new Array();
					var medOrigDate = "", startDate = "", stopDate = "", stopReason = "", nextDoseDate = "", lastDoesDate = "", lastOccuredDate = "";

					var medName = GetMedicationDisplayName(orders);
					var dateTime = new Date();
					if (orders.SCHEDULE.ORIG_ORDER_DT_TM != "")
					{
						dateTime.setISO8601(orders.SCHEDULE.ORIG_ORDER_DT_TM);
						medOrigDate = dateTime.format("longDateTime3");
					}
					if (orders.SCHEDULE.CURRENT_START_DT_TM != ""){
						dateTime.setISO8601(orders.SCHEDULE.CURRENT_START_DT_TM);
						startDate = dateTime.format("longDateTime3");						
					}
					if (orders.SCHEDULE.PROJECTED_STOP_DT_TM != ""){
						dateTime.setISO8601(orders.SCHEDULE.PROJECTED_STOP_DT_TM);
						stopDate = dateTime.format("longDateTime3");
						var reason = GetValueFromArray(orders.SCHEDULE.STOP_TYPE_CD, codeArray);
						if (reason != null)
						{
							stopReason = reason.display;
						}
					}
					if (orders.DETAILS.NEXT_DOSE_DT_TM != "")
					{
						dateTime.setISO8601(orders.DETAILS.NEXT_DOSE_DT_TM);
						nextDoseDate = dateTime.format("longDateTime3");												
					}
					if (orders.DETAILS.LAST_DOSE_DT_TM != "")
					{
						dateTime.setISO8601(orders.DETAILS.LAST_DOSE_DT_TM);
						lastDoesDate = dateTime.format("longDateTime3");												
					}
					if (orders.DETAILS.LAST_OCCURED_DT_TM != "")
					{
						dateTime.setISO8601(orders.DETAILS.LAST_OCCURED_DT_TM);
						lastOccuredDate = dateTime.format("longDateTime3");												
					}
					
					if (orders.CORE.RESPONSIBLE_PROVIDER_ID > 0)
					{
						var provider = GetValueFromArray(orders.CORE.RESPONSIBLE_PROVIDER_ID, personnelArray);
						var profullName = provider.fullName;
					}
					if (orders.DETAILS.COMPLIANCE_STATUS_CD > 0)
					{
						var code = GetValueFromArray(orders.DETAILS.COMPLIANCE_STATUS_CD, codeArray);
						var codeDisp = (code.display);
					}	
					item.push("<h3 class='hml-info-hd'><span>", medName, "</span></h3>")
					item.push("<dl class='hml-info'><dd><span>", medName, "</span><span class='med-sig'>",GetDoseRouteInfo(orders,codeArray),"</span></dd></dl>")
					item.push("<h4 class='hml-det-hd'><span>",i18n.MED_DETAILS,"</span></h4>",
						"<dl class='med-det hvr'>", 
						"<dt><span>",i18n.MED_NAME,":</span></dt><dd class='hml-det-name'><span>", medName, 
						"</span></dd><dt><span>",i18n.ORIG_DT_TM,
						":</span></dt><dd class='hml-det-dt'><span>", medOrigDate, 
						"</span></dd><dt><span>",i18n.LAST_DOSE_DT_TM,
						":</span></dt><dd class='hml-det-dt'><span>", lastOccuredDate,
						"</span></dd><dt><span>",i18n.COMPLIANCE,
						":</span></dt><dd class='hml-det-dt'><span>", codeDisp, 
						"</span></dd><dt><span>",i18n.ORDEREDBY,
						":</span></dt><dd class='hml-det-dt'><span>", profullName, 
						"</span></dd><dt><span>",i18n.STATUS,
						":</span></dt><dd class='hml-det-dt'><span>", orderStatus.display, 
						"</span></dd>");
					if(orders.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.PRESCRIPTION_IND==1)
					{
						item.push("<dt><span>",i18n.TYPE,":</span></dt><dd class='hml-det-dt'><span>Prescribed</span></dd>"); 
					}
					else if (orders.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND==1)
					{
						item.push("<dt><span>",i18n.TYPE,":</span></dt><dd class='hml-det-dt'><span>Documented</span></dd>");
					}
					else
					{
						 item.push("<dt><span>",i18n.TYPE,":</span></dt><dd class='hml-det-dt'><span>&nbsp;</span></dd>");
					}
					item.push("</span></dd><dt><span>",i18n.DETAILS,":</span></dt><dd class='hml-det-dt'><span>", GetDoseRouteInfo(orders,codeArray),"</span></dd>"); 
					item.push("</dl>");	
					meds = meds.concat(item);
					medCnt++;
				}
				sHTML = meds.join("");
				countText = "("+ medCnt + ")";
			  
			}
			else
			{
				sHTML = HandleErrorResponse("hml");				
			}
			//secLoad(sHTML,"hml",countText,0);
			sec1load(sHTML,"hml",countText);
		}
	};
	
	function SortByOrderDate(a,b){
		if (a.SCHEDULE.ORIG_ORDER_DT_TM > b.SCHEDULE.ORIG_ORDER_DT_TM)
			return -1;
		else if (a.SCHEDULE.ORIG_ORDER_DT_TM < b.SCHEDULE.ORIG_ORDER_DT_TM)
			return 1;
		else
			return 0;
	}
	    function SortByMedicationName(a, b){
		var aDisp = GetMedicationDisplayName(a).toUpperCase();
		var bDisp = GetMedicationDisplayName(b).toUpperCase();
        if (aDisp > bDisp) 
            return 1;
        else if (aDisp < bDisp) 
            return -1;
        else 
            return 0;
    }


	function GetMedicationDisplayName(order){
		var medName = "";
		if (order.DISPLAYS != null) {
			medName = order.DISPLAYS.REFERENCE_NAME;
			if (medName == "") {
				medName = order.DISPLAYS.CLINICAL_NAME;
			}
			else{
				if (order.DISPLAYS.CLINICAL_NAME != "" && order.DISPLAYS.CLINICAL_NAME != medName){
					medName = medName.concat(" (", order.DISPLAYS.CLINICAL_NAME , ")")
				}
			}
			if (medName == "")
			{
				medName = order.DISPLAYS.DEPARTMENT_NAME;
			}
		}
		return (medName);
	}
	
	function GetDoseRouteInfo(order, codeArray){
		if (order.DISPLAYS.SIMPLIFIED_DISPLAY_LINE != "")
			return (order.DISPLAYS.SIMPLIFIED_DISPLAY_LINE);
		var returnVal = new Array();
		
		for (var x = 0 in order.MEDICATION_INFORMATION.INGREDIENTS)
		{
			var ingred = order.MEDICATION_INFORMATION.INGREDIENTS[x];
			if (x != 0)
			{
				returnVal.push(", ");
			}
			if (ingred.DOSE.STRENGTH != 0){
				returnVal.push(ingred.DOSE.STRENGTH);
				if (ingred.DOSE.STRENGTH_UNIT_CD != 0)
					returnVal.push(" ", GetValueFromArray(ingred.DOSE.STRENGTH_UNIT_CD, codeArray).display);
			}
			if (ingred.DOSE.VOLUME != 0)
			{
				returnVal.push(ingred.DOSE.VOLUME);
				if (ingred.DOSE.VOLUME_UNIT_CD != 0)
					returnVal.push(" ", GetValueFromArray(ingred.DOSE.VOLUME_UNIT_CD, codeArray).display);			
			}
			if (order.SCHEDULE.ROUTE != ""){
				returnVal.push(", ", order.SCHEDULE.ROUTE);
			}
			if (order.SCHEDULE.FREQUENCY.FREQUENCY_CD > 0){
				returnVal.push(", ", GetValueFromArray(order.SCHEDULE.FREQUENCY.FREQUENCY_CD, codeArray).display);	
			}
		}
		return returnVal.join("");
		//return (order.DISPLAYS.CLINICAL_DISPLAY_LINE);
	}
	
	function LoadCodeListJSON(parentElement){
		var codeArray = new Array();
		if (parentElement != null)
		{
			for(var x = 0; x < parentElement.length; x++)
			{
				var codeObject = new Object();
				codeElement = parentElement[x];
				codeObject.codeValue = codeElement.CODE;
				codeObject.display = codeElement.DISPLAY;
				codeObject.description = codeElement.DESCRIPTION;
				codeObject.codeSet = codeElement.CODE_SET;
				codeObject.sequence = codeElement.SEQUENCE;
				codeObject.meaning = codeElement.MEANING;
				var mapObj = new MapObject(codeObject.codeValue, codeObject);
				codeArray[x] = mapObj;
			}
		}
		return (codeArray);
	}
}();

function LoadPersonelListJSON(parentElement){
	var personnelArray = new Array();
	if (parentElement != null)
	{
		for(var x = 0; x < parentElement.length; x++)
		{
			var perObject = new Object();
			codeElement = parentElement[x];
			perObject.id = codeElement.ID;
			perObject.fullName = codeElement.PROVIDER_NAME.NAME_FULL;
			perObject.firstName = codeElement.PROVIDER_NAME.NAME_FIRST;
			perObject.middleName = codeElement.PROVIDER_NAME.NAME_MIDDLE;
			perObject.lastName = codeElement.PROVIDER_NAME.NAME_LAST;
			perObject.userName = codeElement.PROVIDER_NAME.USERNAME;
			perObject.initials = codeElement.PROVIDER_NAME.INITIALS;
			perObject.title = codeElement.PROVIDER_NAME.TITLE;
			var mapObj = new MapObject(perObject.id, perObject);
			personnelArray[x] = mapObj;
		}
	}
	return (personnelArray);
}
	
function GetValueFromArray(name, array) {
	for (var x = 0; x < array.length; x++) {
		if (array[x].name == name) {
			return (array[x].value);
		}
	}
	return (null);
}
	
function MapObject(name, value) {
	this.name = name;
	this.value = value
}	
	
function HandleNoDataResponse(nameSpace)
{
	return ("<span class='res-none'>" + i18n.NO_RESULTS_FOUND + "</span>");
}

//certrn - to do - add degug logging for failures???
function HandleErrorResponse(nameSpace)
{
	return ("<span class='res-none'>" + i18n.ERROR_RETREIVING_DATA + "</span>");
}

// Load Medications
function medLoad(xhr) {
	var medData = xhr;
    if(debugFlag){
	    logRecord("Medications JSON:");
	    logRecord(medData);
    }
	var jsonEval = JSON.parse(medData);
	var jsMedHTML = [];
	var medHTML = "";
	var medLen = 0;
	var jsStatus = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var jsSchedSec = [];
	var jsContSec = [];
	var jsPRNSec = [];
	var jsAdminSec = [];
	var jsSuspSec = [];
	var jsDiscSec = [];
	var schedCount = 0;
	var contCount = 0;
	var prnCount = 0;
	var adminCount = 0;
	var suspCount = 0;
	var discCount = 0;
	if (jsStatus == "S") {
	    var th=0;
			var totalHeight;
			th = 1.5 * medCount; 
			totalHeight = th+"em";
		var medObj = jsonEval.RECORD_DATA.MEDICATION;
		medLen = medObj.length;

		for (var i=0; i<medLen; i++) {
			var medItem = medObj[i];
			var medRow = [];
			var medSig = "";
			var medName = medItem.NAME;
			var medOrdAs = medItem.ORD_AS_MN;
			var medFaceUp = medOrdAs;
			if (medOrdAs == "" || medOrdAs == medName) {
				medOrdAs = "";
				medFaceUp = medName;
			}
			else {
				medOrdAs = "(" + medOrdAs + ")";
			}
			// build sig line
			var medDose = medItem.DOSE;
			if (medDose != "") {
				medSig = medDose + " ";
				var medUnit = medItem.DOSE_UNIT;
				if (medUnit != "") {
					medSig += medUnit + " ";
				}
			}
			var medRoute = medItem.ROUTE;
			if (medRoute != "") {
				medSig += medRoute + " ";
			}
			var medFreq = medItem.FREQUENCY;
			if (medFreq != "") {
				medSig += medFreq + " ";
			}
			
			medRow.push(	"<h3 class='med-info-hd'><span>", medName, "</span></h3><dl class='med-info'><dt><span>Medication:</span></dt><dd class='med-name'><span>",
							medFaceUp, "</span></dd><dt><span>Signature Line:</span></dt><dd class='med-sig'><span>", medSig,
							"</span></dd></dl><h4 class='med-det-hd'><span>Medication Details</span></h4><dl class='med-det hvr'><dt><span>Medication:</span></dt><dd><span>",
							medName, " ", medOrdAs, "</span></dd><dt><span>Requested Start:</span></dt><dd><span>",
							medItem.START_DT_TM, "</span></dd><dt><span>Last Dose:</span></dt><dd><span>",
							fmtDt(medItem.LAST_DOSE_DT_TM), "</span></dd><dt><span>Next Dose:</span></dt><dd><span>",
							fmtDt(medItem.NEXT_DOSE_DT_TM), "</span></dd><dt><span>Order Entered By:</span></dt><dd><span>",
							medItem.ORDERED_BY, "</span></dd><dt><span>Status:</span></dt><dd><span>",
							medItem.STATUS, "</span></dd><dt><span>Details:</span></dt><dd><span>", medItem.CLIN_SIG, "</span></dd></dl>");

			// populate the appropriate subsection
			var medType = medItem.TYPE;
			if (medType == "DISCONTINUED") {
				jsDiscSec = jsDiscSec.concat(medRow);
				discCount++;
			}
			else if (medType == "SUSPENDED") {
				jsSuspSec = jsSuspSec.concat(medRow);
				suspCount++;
			}
			else if (medType == "ADMINISTERED") {
				jsAdminSec = jsAdminSec.concat(medRow);
				adminCount++;
			}
			else if (medType == "PRN") {
				jsPRNSec = jsPRNSec.concat(medRow);
				prnCount++;
			}
			else if (medType == "CONTINUOUS") {
				jsContSec = jsContSec.concat(medRow);
				contCount++;
			}
			else if (medType == "SCHEDULED") {
				jsSchedSec = jsSchedSec.concat(medRow);
				schedCount++;
			}
			//012 if medtype is "PRN/ADMINISTERED", insert med in both section PRN and ADMINISTERED
			else if (medType == "PRN/ADMINISTERED") {
				jsPRNSec = jsPRNSec.concat(medRow);
				prnCount++;
				jsAdminSec = jsAdminSec.concat(medRow);
				adminCount++;
			}
			//012 if medtype is "SCHEDULED/ADMINISTERED", insert med in both section SCHEDULED and ADMINISTERED
			else if (medType == "SCHEDULED/ADMINISTERED") {
				jsSchedSec = jsSchedSec.concat(medRow);
				schedCount++;
				jsAdminSec = jsAdminSec.concat(medRow);
				adminCount++;
			}
		}
	}
	jsMedHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>Scheduled (", schedCount, ")</span></h3>");
	if( schedCount>medCount)
	{
	    jsMedHTML.push("<div class='sub-sec-content' style='overflow-y:scroll; height:"+totalHeight+";'>", jsSchedSec.join(""),"</div>");
	}
	else
	{
	    jsMedHTML.push("<div class='sub-sec-content'>", jsSchedSec.join(""),"</div>");
	}
	jsMedHTML.push("</div><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>Continuous (", contCount, ")</span></h3>");
	if( contCount>medCount)
	{
	    jsMedHTML.push("<div class='sub-sec-content' style='overflow-y:scroll; height:"+totalHeight+";'>", jsContSec.join(""),"</div>");
	}
	else
	{
	    jsMedHTML.push("<div class='sub-sec-content'>", jsContSec.join(""),"</div>");
	}
	jsMedHTML.push("</div><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>PRN (", prnCount, ")</span></h3>");
	if( prnCount>medCount)
	{
	    jsMedHTML.push("<div class='sub-sec-content' style='overflow-y:scroll; height:"+totalHeight+";'>", jsPRNSec.join(""),"</div>");
	}
	else
	{
	    jsMedHTML.push("<div class='sub-sec-content'>", jsPRNSec.join(""),"</div>");
	}
	jsMedHTML.push("</div><div class='sub-sec'><div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>Administered (", adminCount, ")</span></h3>");
	if( adminCount>medCount)
	{
	    jsMedHTML.push("<div class='sub-sec-content' style='overflow-y:scroll; height:"+totalHeight+";'>", jsAdminSec.join(""),"</div>");
	}
	else
	{
	    jsMedHTML.push("<div class='sub-sec-content'>", jsAdminSec.join(""),"</div>");
	}
	jsMedHTML.push("</div></div><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>Suspended (", suspCount, ")</span></h3>");
	if( suspCount>medCount)
	{
	    jsMedHTML.push("<div class='sub-sec-content' style='overflow-y:scroll; height:"+totalHeight+";'>", jsSuspSec.join(""),"</div>");
	}
	else
	{
	    jsMedHTML.push("<div class='sub-sec-content'>", jsSuspSec.join(""),"</div>");
	}
	jsMedHTML.push("</div><div class='sub-sec'><div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>Discontinued (", discCount, ")</span></h3>");
	if( discCount>medCount)
	{
	    jsMedHTML.push("<div class='sub-sec-content' style='overflow-y:scroll; height:"+totalHeight+";'>", jsDiscSec.join(""),"</div>");
	}
	else
	{
	    jsMedHTML.push("<div class='sub-sec-content'>", jsDiscSec.join(""),"</div>");
	}
	jsMedHTML.push("</div></div>");
    medHTML = jsMedHTML.join("");
	var countText = "";
	//secLoad(medHTML, "med", countText, 0);
	sec1load(medHTML,"med",countText);
}

// Load Pathology
function patLoad(patInput) {
	var patData = patInput;
	if(debugFlag){
	    logRecord("Pathology JSON:");
	    logRecord(patData);
    }
	var jsonEval = JSON.parse(patData);
	var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	var patArray = [];
	var patHTML = "";
	var eventId = 0;
	if(status=="S")
	{
		patArray.push("<dl class='pat-info-hdr'><dd class='pat-cat-hd'><span>&#160;</span></dd><dd class='pat-dt-hd'><span>Verified</span></dd></dl>");
		var patLen = jsonEval.RECORD_DATA.DOCUMENTS.length;
		var name = "";
		var date = "";
		var date2YrStr = "";
		for (var i=0; i<patLen; i++) 
		{
			date2YrStr = jsonEval.RECORD_DATA.DOCUMENTS[i].DATE;
			if(date2YrStr != "--" && date2YrStr != ""){
				date2YrStr = fmtDt(jsonEval.RECORD_DATA.DOCUMENTS[i].DATE, "longDateTime2");
			}
			
			//if the date2YrStr is blank which is the interfaced reports,
			//then display "Date Not Specified" on the Verified column //008
			if (date2YrStr.length == 0) //008
			{ //008
				date2YrStr = i18n.DATE_NOT_SPECIFIED ; //'Date Not Specified' //008
			} //008
			
			name = jsonEval.RECORD_DATA.DOCUMENTS[i].TITLE;
			eventId = jsonEval.RECORD_DATA.DOCUMENTS[i].EVENT_ID;
			patArray.push("<dl class='pat-info'><dd class='pat-cat'><span>", name,
						"</span></dd><dd class='pat-dt'><span>");
			if (eventId > 0) {
				patArray.push("<a href='javascript:CCLLINK(mp_preg_clin_smry_clinicaldocs, \"^MINE^,"+eventId+".0,4\",4)'>",
							date2YrStr, "</a>");
			}
			else {
				patArray.push(date2YrStr);
			}
			patArray.push("</span></dd></dl>");
		}
	}
	else if(status=="Z")
	{
		patArray.push(HandleNoDataResponse("pat"));
	}
	else 
	{
		patArray.push(HandleErrorResponse("pat"));
	}
	patHTML = patArray.join("");
	if(patLen==null||patLen=="")
	{
		patLen=0;
	}
	var countText = "(" + patLen + ")";
	//secLoad(patHTML, "pat", countText, 0);
	sec1load(patHTML,"pat",countText);
}

// Load Documents
function docLoad(xhr) {
	var docData = xhr;
	if(debugFlag){
	    logRecord("DOcuments JSON:");
	    logRecord(docData);
    }
	var jsonEval = JSON.parse(docData);
	var jsDocHTML = [];
	var docHTML = "";
	var docHd = "";
	var docLen = 0;
	var jsStatus = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
	if (jsStatus == "Z") {
		jsDocHTML.push(HandleNoDataResponse("doc"));
	}
	else if (jsStatus == "S") {
		var docObj = jsonEval.RECORD_DATA.DOCUMENTS;
		docLen = docObj.length;
		jsDocHTML.push("<dl class='doc-info-hdr'><dd class='doc-cat-hd'><span>&nbsp;</span></dd><dd class='doc-auth-hd'><span>Author</span></dd><dd class='doc-dt-hd'><span>Date/Time</span></dd></dl>");

		for (var i=0; i<docLen; i++) {
			var docItem = docObj[i];
			var docItemType = docItem.TYPE;
			var docDt = docItem.DATE;
			jsDocHTML.push("<h3 class='doc-info-hd'><span>", docItemType, "</span></h3><dl class='doc-info'><dt><span>Document:</span></dt><dd class='doc-cat'><span>", docItemType,
							"</span></dd><dd class='doc-auth'><span>", docItem.AUTHOR,
							"</span></dd><dd class='doc-dt'><span><a href='javascript:CCLLINK(mp_preg_clin_smry_clinicaldocs, \"^MINE^,"+docItem.EVENT_ID+".0,1\",1)'>",
							fmtDt(docDt, "longDateTime2"),
							"</a></span></dd></dl><h4 class='doc-det-hd'><span>Document Details</span></h4><dl class='doc-det hvr'><dt><span>Name:</span></dt><dd><span>", docItemType,
							"</span></dd><dt><span>Subject:</span></dt><dd><span>", docItem.SUBJECT,
							"</span></dd><dt><span>Status:</span></dt><dd><span>", docItem.STATUS,
							"</span></dd><dt><span>Date/Time:</span></dt><dd><span>", fmtDt(docDt, "longDateTime3"),
							"</span></dd></dl>");
		}
	}
	else {
		jsDocHTML.push(HandleErrorResponse("doc"));
	}
	docHTML = jsDocHTML.join("");
	var countText = "(" + docLen + ")";
	//secLoad(docHTML, "doc", countText,0);
	sec1load(docHTML,"doc",countText);
}

/**
 * Loads the component onto the page
 * @param {string} html : The html for the component body
 * @param {string} pre : The corresponding prefix for the section
 * @param {string} count : The total count of the section's elements
 * @param {int} scrollNum: The number of elements to display before scrolling (0 = no scroll)
 */
function secLoad(html, pre, count, scrollNum) { 
	// Clear for reload
	var secContent = _g(pre + "Content");
	secContent.innerHTML = "";
	// Remove count
	var curSec = Util.Style.g(pre + "-sec");
	
	var totalCount = Util.Style.g("sec-total", curSec[0], "span");
	if (totalCount) {
		Util.de(totalCount[0]);
	}

	// Populate section and initialize hovers
	var secHTML = html;
	secContent.innerHTML = secHTML;
	secInit(pre + "-info", secContent);

	// Add count and "Add" functionality
	var totalTxt = count;
	var secCL = Util.Style.g("sec-title", curSec[0], "span");
	var secSpan = Util.gc(secCL[0]);
	var totalSpan = Util.cep("span", {"className" : "sec-total"});
	var spanText = document.createTextNode(totalTxt);
	Util.ac(spanText, totalSpan);
	var totalBefore = _g(pre + "Add");
	secSpan.insertBefore(totalSpan, totalBefore);

	// Add scroll functionality
	if (scrollNum > 0) {

		 var results = Util.Style.g(pre + "-info", secContent, "dl");
		 var numberOfResults = results.length;
		 

		 if (numberOfResults < scrollNum) {
			 secContent.style.height = 'auto';
		 }
		 else {
			var th=0;
			var totalHeight;
			th = 1.2 * scrollNum //using line height factor for now due to closed sections not having clientHeight
			totalHeight = th+"em";

			secContent.style.height = totalHeight;
			secContent.style.overflowY = 'scroll';
		 }
	}
	expColInit(secContent, "sub-sec-hd-tgl");
}

/**
 * Returns all the comments for an element in a single formatted string
 * @param {Node} par : The parent node
 * @return {string} The formatted comment string
 */
/*certrn - not used
function addComments(par) {
	var com = "";
	for (var j=0, m=par.COMMENTS.length; j<m; j++) {
		if (j>0) {
			com += "<br />";
		}
		com += par.COMMENTS[j].RECORDED_DT_TM + " - " + par.COMMENTS[j].RECORDED_BY +
			"<br />" + par.COMMENTS[j].COMMENT_TEXT;
	}
	return com;
}

function savePrefs() {
	paramString = "^MINE^," + "^" + mpObj.personId + "^," + "^" + mpObj.userId + "^," + "^" + mpObj.encntrId + "^";
	javascript:CCLLINK('mp_pe_clin_smry_set', paramString ,1);
}
*/

// Setup Section hovers
/**
 * Initializes the hovers for the specified section
 * @param {string} trg : The face-up class that triggers the hover
 * @param {string} par : The parent element to search within
 */
function secInit(trg, par) {
    gen = Util.Style.g(trg, par, "DL")

    for (var i = 0, l = gen.length; i < l; i++) {
        var m = gen[i];
        if (m) {
            var nm = Util.gns(Util.gns(m));
			
            if (nm) {
                if (Util.Style.ccss(nm, "hvr")) {
                    hs(m, nm);
                }
            }
        }
    }
}

function expColInit(par, tog) {
    //set up expand collapse
    var toggleArray = Util.Style.g(tog, par, "span");
    for (var k=0; k<toggleArray.length; k++) {
        Util.addEvent(toggleArray[k], "click", expCol);
        var checkClosed = Util.gp(Util.gp(toggleArray[k]));
        if (Util.Style.ccss(checkClosed, "closed")) {
            toggleArray[k].innerHTML = "+";
            toggleArray[k].title = "Show Section";
        }
    }
	//end expand collapse set up
}

/* Hover Mouse Over */
function hmo(evt, n) {
    var s = n.style, p = getPosition(evt), top = p.y + 30, left = p.x + 20;
    evt = evt || window.event;
    n._ps = n.previousSibling;
    document.body.appendChild(n);
    s.display = "block";
    s.left = left + "px";
    s.top = top + "px";
}


/* Hover Mouse Move */
function hmm(evt, n) {
    var s = n.style, p = getPosition(evt), vp = gvs(), so = gso(), left = p.x + 20, top = p.y + 30;

    if (left + n.offsetWidth > vp[1] + so[1]) {
        left = left - 40 - n.offsetWidth;
    }

    if (top + n.offsetHeight > vp[0] + so[0]) {
		if(top - 40 - n.offsetHeight < so[0]){
			top = 20 + so[0];
		}
		else{
			top = top - 40 - n.offsetHeight;
		}
    }
    evt = evt || window.event;
    s.top = top + "px";
    s.left = left + "px";
}


/* Hover Mouse Out*/
function hmt(evt, n) {
    evt = evt || window.event;
    n.style.display = "";
    Util.ia(n, n._ps);
}

/* Hover Setup */
function hs(e, n) {
    var priorBgColor = e.style.backgroundColor;
    var priorBorderColor = e.style.borderColor;
    // var singleResultOpen = 0;
    if (n && n.tagName == "DL") {
        e.onmouseenter = function(evt) {
            e.onmouseover = null;
            e.onmouseout = null;
            hmo(evt, n);
        };
        e.onmouseover = function(evt) {
            e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
            hmo(evt, n);
        };
        e.onmousemove = function(evt) {
            e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
            hmm(evt, n);
        };
        e.onmouseout = function(evt) {
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
            //     if (singleResultOpen)
            hmt(evt, n);
        };
        e.onmouseleave = function(evt) {
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
            e.onmouseover = null;
            e.onmouseout = null;
            hmt(evt, n);
        };
        Util.Style.acss(n, "hover");
    }
} 

//// Expand/Collapse Functions

function expCol() {
    var gpp = Util.gp(Util.gp(this));
    if (Util.Style.ccss(gpp, "closed")) {
        Util.Style.rcss(gpp, "closed");
        this.innerHTML = "-";
        this.title = "Hide Section";
    }
    else {
        Util.Style.acss(gpp, "closed");
        this.innerHTML = "+";
        this.title = "Show Section";
    }
	
}

function expColAll() {
    mpObj.expClicks += 1;
    var allSections = Util.Style.g("section");
    if (mpObj.expClicks == 1) {
        for (var i = 0; i < allSections.length; i++) {
            Util.Style.rcss(allSections[i], "closed");
            var secHandle = Util.gc(Util.gc(allSections[i]));
            secHandle.innerHTML = "-";
            secHandle.title = "Hide Section";
            this.innerHTML = 'Collapse All';
        }
    }
    else if (mpObj.expClicks % 2 === 0) {
        for (var j = 0; j < allSections.length; j++) {
            Util.Style.acss(allSections[j], "closed");
            var secHandle = Util.gc(Util.gc(allSections[j]));
            secHandle.innerHTML = "+";
            secHandle.title = "Show Section";
            this.innerHTML = 'Expand All';
        }
    }
    else {
        for (var i = 0; i < allSections.length; i++) {
            Util.Style.rcss(allSections[i], "closed");
            var secHandle = Util.gc(Util.gc(allSections[i]));
            secHandle.innerHTML = "-";
            secHandle.title = "Hide Section";
            this.innerHTML = 'Collapse all';
        }   
    }
}

////// Healthe library 
 /*extern window, document*/
 /**
  * @fileOverview
 
     <h1>Utility Methods</h1>
     <p>
     These are universal utility methods, designed for speed, size and agnostic browser support. There are several namespaces:
     </p>
     <dl>
         <dt>Util</dt>
         <dd>General Utility methods</dd>
         <dd>Included in util.core.js</dd>
         <dt>Util.EventCache</dt>
         <dd>Object for ensuring proper garbage collection.</dd>
         <dd>Included in util.core.js</dd>
         <dt>Util.Convert</dt>
         <dd>Conversion Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.convert.js is not included.</dd>
         <dt>Util.Cookie</dt>
         <dd>Cookie Management Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.cookie.js is not included.</dd>
         <dt>Util.Detect</dt>
         <dd>Detection Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.detect.js is not included.</dd>
         <dt>Util.i18n</dt>
         <dd>Internationalization (i18n) Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.i18n.js is not included.</dd>
         <dt>Util.Load</dt>
         <dd>DOM-Loaded event Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.load.js is not included.</dd>
         <dt>Util.Pos</dt>
         <dd>Positioning Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.pos.js is not included.</dd>
         <dt>Util.Style</dt>
         <dd>CSS Utility methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.style.js is not included.</dd>
         <dt>Util.Timeout</dt>
         <dd>Session Management methods</dd>
         <dd>External module; will be an <strong>empty object</strong> if util.timeout.js is not included.</dd>
     </dl>
     <h2>Notes</h2>
     <p>All modules are aggregated together by Maven into a single file, util.js.</p>
     <p>Validated with JSLint.</p>
  */
 
 /**
  * Returns an element based on the id provided, <code>null</code> if no element exists.
  * @param {String} i The id.
  * @return {Node} An element with the id specified, <code>null</code> if no such element exists.
  * @static
  * @global
  * @fullname Get Element By ID
  */
 function _g(i) {
     return document.getElementById(i);
 }
 
 /**
  * Returns all elements from within the specified context matching the tag name provided, <code>null</code> if no
  * elements exist.
  * @param {String} t The tag name.
  * @param {Node} [e] The element to search within. Defaults to the document body.
  * @return {array} An array of elements with the tag name specified, <code>null</code> if no elements exist.
  * @static
  * @global
  * @fullname Get Elements By Tag Name
  */
 function _gbt(t, e) {
     e = e || document;
     return e.getElementsByTagName(t);
 }
 
 /**
  * Utility methods
  * @namespace Util
  * @static
  * @global
  */
 var Util = function () {
 
     var _e = [], _d = document, _w = window;
 
     return {
         /**
          * The Event Cache makes it possible to ensure all events attached to the DOM or browser instances are
          * properly "flushed away" after the page is unloaded. This prevents memory leaks in some implementations.
          *
          * @property
          * @memberof Util
          * @name EventCache
          */
         EventCache : function () {
             var l = [];
             return {
 
                 /**
                  * Add an event to the Event Cache.
                  * @param {Node} o The element or object to which the event is attached.
                  * @param {String} e The event name, e.g. "click" or "mouseover".
                  * @param {Function} f The function attached.
                  *
                  * @static
                  * @function
                  * @memberof Util.EventCache
                  * @name add
                  */
                 add : function (o, e, f) {
                     l.push(arguments);
                 },
 
                 /**
                  * Remove an event from the Event Cache.
                  * @param {Node} o The element or object to which the event is attached.
                  * @param {String} e The event name, e.g. "click" or "mouseover".
                  * @param {Function} f The function to detach.
                  *
                  * @static
                  * @function
                  * @memberof Util.EventCache
                  * @name remove
                  */
                 remove : function (o, e, f) {
                     var n;
                     for (var i = l.length - 1; i >= 0; i = i - 1) {
                         if (o == l[i][0] && e == l[i][1] && f == l[i][2]) {
                             n = l[i];
                             if (n[0].removeEventListener) {
                                 n[0].removeEventListener(n[1], n[2], n[3]);
                             }
                             else if (n[0].detachEvent) {
                                 if (n[1].substring(0, 2) != "on") {
                                     n[1] = "on" + n[1];
                                 }
                                 n[0].detachEvent(n[1], n[0][e + f]);
                             }
                         }
                     }
                 },
 
                 /**
                  * Remove all events from the Cache.
                  *
                  * @static
                  * @function
                  * @memberof Util.EventCache
                  * @name flush
                  */
                 flush : function () {
                     var e;
                     for (var i = l.length - 1; i >= 0; i = i - 1) {
                         var o = l[i];
                         if (o[0].removeEventListener) {
                             o[0].removeEventListener(o[1], o[2], o[3]);
                         }
                         e = o[1];
                         if (o[1].substring(0, 2) != "on") {
                             o[1] = "on" + o[1];
                         }
                         if (o[0].detachEvent) {
                             o[0].detachEvent(o[1], o[2]);
                             if (o[0][e + o[2]]) {
                                 o[0].detachEvent(o[1], o[0][e + o[2]]);
                             }
                         }
                     }
                 }
             };
         }(),
 
         /**
          * Creates an element within the document, without a parent, as if by <code>document.createElement</code>. This method
          * has better performance, as it caches instances of created objects and clones them, rather than manipulate the
          * document directly.
          * @param {String} t The tag name of the element to create.
          * @return {Node} A new element.
          *
          * @static
          * @function
          * @memberof Util
          * @name ce
          * @fullname Create Element
          */
         ce : function (t) {
             var a = _e[t];
             if (!a) {
                 a = _e[t] = _d.createElement(t);
             }
             if (!a) {
                 return null;
             }
             else {
                 return a.cloneNode(false);
             }
         },
 
         /**
          * Creates an element within the document, without a parent, as if by <code>document.createElement</code>. Any
          * given properites will then be set onto the newly created element. This method has better performance, as it
          * caches instances of created objects and clones them, rather than manipulate the document directly.
          * @param {String} t The tag name of the element to create.
          * @param {Object} [p] The properties to set onto the created element, (e.g. <code>{ "href" : "index.html", "name" : "theName"}</code>).
          * @return {Node} A new element.
          * 
          * @static
          * @function
          * @memberof Util
          * @name cep
          * @fullname Create Element with Properties
          */
         cep : function (t, p) {
             var e = this.ce(t);
             return this.mo(e, p);
         },
 
         /**
          * Merges two option objects.
          * @param {Object} o1 The option object to be modified.
          * @param {Object} o2 The option object containing properties to be copied.
          * @param {Boolean} d True if properties on o1 should be immutable, false otherwise.
          * @return {Object} An object containing properties.
          *
          * @static
          * @function
          * @memberof Util
          * @name mo
          * @fullname Merge Objects
          */
         mo : function (o1, o2, d) {
             o1 = o1 || {};
             o2 = o2 || {};
             var p;
             for (p in o2) {
                 if (p) {
                     o1[p] = (o1[p] === undefined) ? o2[p] : !d ? o2[p] : o1[p];
                 }
             }
             return o1;
         },
 
         /**
          * Deletes an element from the DOM.
          * @param {Node} e The element to delete.
          *
          * @static
          * @function
          * @memberof Util
          * @name de
          * @fullname Delete Element
          */
         de : function (e) {
             if (e) {
                 this.gp(e).removeChild(e);
             }
         },
 
         /**
          * Universal event-bubbling cancel method.
          * @param {event} e The event object, (not required in IE).
          *
          * @static
          * @function
          * @memberof Util
          * @name cancelBubble
          * @fullname Cancel Event Bubble
          */
         cancelBubble : function (e) {
             e = _w.event || e;
             if (!e) {
                 return;
             }
 
             if (e.stopPropagation) {
                 e.stopPropagation();
             }
             else {
                 e.cancelBubble = true;
             }
         },
 
         /**
          * Universal event default behavior prevention method.
          * @param {event} e The event object, (not required in IE).
          *
          * @static
          * @function
          * @memberof Util
          * @name preventDefault
          * @fullname Prevent Default Behavior
          */
         preventDefault : function (e) {
             e = _w.event || e;
 
             if (!e) {
                 return;
             }
 
             if (e.preventDefault) {
                 e.preventDefault();
             }
             else {
                 e.returnValue = false;
             }
         },
 
         /**
          * Returns the an element's offset values, traversing the tree for an accurate value.
          * @param {Node} e The element to evaluate.
          * @return {array} The offset left and offset top, in pixels, in the form of [left, top].
          *
          * @static
          * @function
          * @memberof Util
          * @name goff
          * @fullname Get Element Offset Values
          */
         goff : function (e) {
             var l = 0, t = 0;
             if (e.offsetParent) {
                 while (e.offsetParent) {
                     l += e.offsetLeft;
                     t += e.offsetTop;
                     e = e.offsetParent;
                 }
             }
             else if (e.x || e.y) {
                 l += e.x || 0;
                 t += e.y || 0;
             }
             return [l, t];
         },
 
         /**
          * Returns an accurate parent node; Some browsers will return a Text Node.
          * @param {Node} e The element to evaluate.
          * @return {Node} The actual parent node.
          *
          * @static
          * @function
          * @memberof Util
          * @name gp
          * @fullname Get Parent
          */
         gp : function (e) {
             if (!e.parentNode) {
                 return e;
             }
             e = e.parentNode;
             while (e.nodeType === 3 && e.parentNode) {
                 e = e.parentNode;
             }
             return e;
         },
		 
 
         /**
          * Some browsers will return a Text Node, so this method returns an accurate child node.
          * @param {Node} e The element to evaluate.
          * @param {int} [i] The child node index, default is 0.
          * @return {Node} The actual child node.
          *
          * @static
          * @function
          * @memberof Util
          * @name gc
          * @fullname Get Child Node
          */
         gc : function (e, i) {
             i = i || 0;
             var j = -1;
 
             if (!e.childNodes[i]) {
                 return null;
             }
 
             e = e.childNodes[0];
             while (e && j < i) {
                 if (e.nodeType === 1) {
                     j++;
                     if (j === i) {
                         break;
                     }
                 }
                 e = this.gns(e);
             }
             return e;
         },
 
         /**
          * For a given node, returns a list of children of NODETYPE 1, (Element).
          * @param {Node} e The node to evaluate.
          * @return {array} A collection of child nodes.
          *
          * @static
          * @function
          * @memberof Util
          * @name gcs
          * @fullname Get All Child Nodes
          */
         gcs : function (e) {
 
             var r = [], es = e.childNodes;
             for (var i = 0; i < es.length; i++) {
                 var x = es[i];
                 if (x.nodeType === 1) {
                     r.push(x);
                 }
             }
             return r;
         },
 
         /**
          * Returns an accurate next sibling node; Some browsers will return a Text Node.
          * @param {Node} e The element to evaluate.
          * @return {Node} The actual next sibling node.
          *
          * @static
          * @function
          * @memberof Util
          * @name gns
          * @fullname Get Next True Sibling
          */
         gns : function (e) {
			if (!e) {
				return null;
			}
             var a = e.nextSibling;
             while (a && a.nodeType !== 1) {
                 a = a.nextSibling;
             }
             return a;
         },
 
         /**
          * Returns an accurate previous sibling node; Some browsers will return a Text Node.
          * @param {Node} e The element to evaluate.
          * @return {Node} The actual previous sibling node.
          *
          * @static
          * @function
          * @memberof Util
          * @name gps
          * @fullname Get Previous True Sibling
          */
         gps : function (e) {
             var a = e.previousSibling;
             while (a && a.nodeType !== 1) {
                 a = a.previousSibling;
             }
             return a;
         },
 
         /**
          * Appends a child to the specified node.
          * @param {Node} e The element to append.
          * @param {Node} p The new parent node.
          * @return {Node} The appended element.
          *
          * @static
          * @function
          * @memberof Util
          * @name ac
          * @fullname Append Child
          */
         ac : function (e, p) {
             p.appendChild(e);
             return e;
         },
 
         /**
          * Insert a node after a specified node.
          * @param {Node} nn The new node to insert.
          * @param {Node} rn The reference node for insertion.
          *
          * @static
          * @function
          * @memberof Util
          * @name ia
          * @fullname Insert After
          */
         ia : function (nn, rn) {
             var p = Util.gp(rn), n = Util.gns(rn);
             if (n) {
                 p.insertBefore(nn, n);
             }
             else {
                 Util.ac(nn, p);
             }
         },
 
         /**
          * Adds a Javscript event to the given element with full browser compatiblity and plugs for any memory leaks.
          * @param {Node} o The object receiving the event.
          * @param {String} e The event name to attach.
          * @param {Function} f The function to run when the event is invoked.
          *
          * @static
          * @function
          * @memberof Util
          * @name addEvent
          * @fullname Add Javascript Event
          */
         addEvent : function (o, e, f) {
 
             function ae(obj, evt, fnc) {
                 if (!obj.myEvents) {
                     obj.myEvents = {};
                 }
 
                 if (!obj.myEvents[evt]) {
                     obj.myEvents[evt] = [];
                 }
 
                 var evts = obj.myEvents[evt];
                 evts[evts.length] = fnc;
             }
 
             function fe(obj, evt) {
 
                 if (!obj || !obj.myEvents || !obj.myEvents[evt]) {
                     return;
                 }
 
                 var evts = obj.myEvents[evt];
 
                 for (var i = 0, len = evts.length; i < len; i++) {
                     evts[i]();
                 }
             }
 
             if (o.addEventListener) {
                 o.addEventListener(e, f, false);
                 Util.EventCache.add(o, e, f);
             }
             else if (o.attachEvent) {
                 o["e" + e + f] = f;
                 o[e + f] = function () {
                     o["e" + e + f](window.event);
                 };
                 o.attachEvent("on" + e, o[e + f]);
                 Util.EventCache.add(o, e, f);
             }
             else {
                 ae(o, e, f);
                 o['on' + e] = function () {
                     fe(o, e);
                 };
             }
         },
 
         /**
          * Remove a Javscript event from the given element with full browser compatiblity and plugs for any memory leaks.
          * @param {Node} o The object honoring the event.
          * @param {String} e The event name.
          * @param {Function} f The function to remove.
          *
          * @static
          * @function
          * @memberof Util
          * @name removeEvent
          * @fullname Remove Javascript Event
          */
         removeEvent : function (o, e, f) {
             Util.EventCache.remove(o, e, f);
         },
 
         /**
         * Uses the native browser window object to create a new window.
         * <p>
         * <strong>NOTE:</strong> This method will utilize DOM methodology only <em>truly</em> supported by desktop
         * browsers. While some mobile browsers may allow this call, most will not. Use with caution, in specific use
         * cases.
         * </p>
         *
         * @param {String} u The url of the popup to open.
         * @param {String} n The name of the popup window.
         * @param {Object} [o The object params. If an object is not provided, the browser defaults will be used.
         * @param {String} [o.lb]  Include location bar, (default is true).
         * @param {String} [o.mb] Include menu bar, (default is true).
         * @param {String} [o.rz] Allow resize, (default is true).
         * @param {String} [o.scb] Include scrollbars, (default is true).
         * @param {String} [o.stb] Include status bar, (default is true).
         * @param {String} [o.tb] Include toolbar, (default is true).
         * @param {int} [o.w] The value for the width of the popup window.
         * @param {int} [o.h] The value for the height of the popup window.
         * @param {int} [o.tp] The value for top. (NOT SUPPORTED YET)
         * @param {int} [o.lft] The value for the left position of the popup. (NOT SUPPORTED YET)
         * @param {int} [o.sx] The screen x value. (NOT SUPPORTED YET)
         * @param {int} [o.sy] The screen y value. (NOT SUPPORTED YET)
         * @param {String} [o.dp] The value for the dependent popup property (yes or no). (NOT SUPPORTED YET)
         * @param {String} [o.dr] The value for the directories property (yes or no). (NOT SUPPORTED YET)
         * @param {String} [o.fs] The value for the fullscreen property (yes or no). (NOT SUPPORTED YET)
         * @return <code>True</code> if the window popup was successful, <code>false</code> otherwise or if the client
         * does not support popup windows.
         *
         * @static
         * @function
         * @memberof Util
         * @name popup
         * @fullname Popup New Window
         */
         popup : function (u, n, o) {
             if (!window.open) {
                 return false;
             }
 
             var d = {
                 w : screen.width,
                 h : screen.height,
                 rz : true,
                 mb : true,
                 scb : true,
                 stb : true,
                 tb : true,
                 lb : true,
                 tp : null,
                 lft : null,
                 sx : null,
                 sy : null,
                 dp : "no",
                 dr : "no",
                 fs : "no"
             };
 
             function f(n, v)
             {
                 if (!v) {
                     return "";
                 }
                 return n + '=' + v + ',';
             }
 
             function fs() {
                 o = o || {};
                 var p, n = {};
                 for (p in d) {
                     if (p) {
                         n[p] = o[p] !== undefined ? o[p] : d[p];
                     }
                 }
                 return n;
             }
 
             o = fs();
             var p = f("dependent", o.dp) + f("directories", o.dr) + f("fullscreen", o.fs) + f("location", o.lb ? 1 : 0) + f("menubar", o.mb) + f("resizable", o.rz ? 1 : 0) + f("scrollbars", o.scb ? 1 : 0) + f("status", o.stb ? 1 : 0) + f("toolbar", o.tb ? 1 : 0) + f("top", o.tp) + f("left", o.lft) + f("width", o.w) + f("height", o.h) + f("screenX", o.sx) + f("screenY", o.sy);
             p = p.substring(0, p.length - 1);
             var nw = window.open(u, n, p);
             window.blur();
 
             if (nw.focus) {
                 nw.focus();
             }
 
             return true;
         },
         Convert : {},
         Cookie : {},
         Detect : {},
         i18n : {},
         Load : {},
         Pos : {},
         Style : {},
         Timeout : {}
     };
 }();
 
 /**
  * Insert a node after a specified node.
  * @param {Node} nn The new node to insert.
  * @param {Node} rn The reference node for insertion.
  *
  * @deprecated
  * @static
  * @global
  */
 function insertAfter(nn, rn) {
     Util.ia(nn, rn);
 }

 Util.addEvent(window, 'unload', Util.EventCache.flush);

 /*extern _gbt, Util*/

 /**
 * @fileOverview
 *
 * <h1>CSS Utility module and namespace</h1>
 * <p>This module assists with managing CSS selectors and classnames.</p>
 * <h2>Usage</h2>
 * <p>Import this file <em>after</em> util.core.js.</p>
 */

 /**
 * Style Utility methods.
 * @namespace Util.Style
 * @global
 * @static
 */
 Util.Style = function() {

     return {
         /**
         * Indicates if an element has been applied with a single given CSS Classname.
         * @param {Node} e The element to evaluate.
         * @param {String} c The single CSS Classname to check.
         * @return {Boolean} True if the classname contains the given class, false otherwise.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name ccss
         * @fullname Contains CSS Class
         */
         ccss: function(e, c) {
             if (typeof (e.className) === 'undefined' || !e.className) {
                 return false;
             }
             var a = e.className.split(' ');
             for (var i = 0, b = a.length; i < b; i++) {
                 if (a[i] === c) {
                     return true;
                 }
             }
             return false;
         },

         /**
         * Adds a given CSS Classname to the given element.
         * @param {Node} e The element to evaluate.
         * @param {String} c The classname to apply.
         * @return {Node} The element with the CSS Classname applied.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name acss
         * @fullname Add CSS Class
         */
         acss: function(e, c) {
             if (this.ccss(e, c)) {
                 return e;
             }
             e.className = (e.className ? e.className + ' ' : '') + c;
             return e;
         },

         /**
         * Removes a given CSS Classname from the given element.
         * @param {Node} e The element to evaluate.
         * @param {String} c The classname to remove.
         * @return {Node} The element, with the CSS Classname removed.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name rcss
         * @fullname Remove CSS Class
         */
         rcss: function(e, c) {
             if (!this.ccss(e, c)) {
                 return e;
             }
             var a = e.className.split(' '), d = "";
             for (var i = 0, b = a.length; i < b; i++) {
                 var f = a[i];
                 if (f !== c) {
                     d += d.length > 0 ? (" " + f) : f;
                 }
             }
             e.className = d;
             return e;
         },

         /**
         * Toggles a given CSS Classname on a given element.
         * @param {Node} e The element to evaluate.
         * @param {String} c The classname to toggle.
         * @return {Boolean} True if the element now contains the classname, false if it was removed.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name tcss
         * @fullname Toggle CSS Class
         */
         tcss: function(e, c) {
             if (this.ccss(e, c)) {
                 this.rcss(e, c);
                 return false;
             }
             else {
                 this.acss(e, c);
                 return true;
             }
         },

         /**
         * Clears any opacity setting back to whatever is defined in CSS.
         * @param {Node} e The element whose opacity setting should be reset.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name co
         * @fullname Clear Opacity
         */
         co: function(e) {
             e.style.MozOpacity = "";
             e.style.opacity = "";
             e.style.filter = "";
         },

         /**
         * Returns an array of elements with the designated classname.
         * @param {String} c The CSS classname.
         * @param {Node} [e] The parent element to search within, defaults to document.
         * @param {String} [t] The tagname to scope the results, defaults to all tags.
         *
         * @static
         * @function
         * @memberof Util.Style
         * @name g
         * @fullname Get Elements by Classname
         */
         g: function(c, e, t) {
             e = e || document;
             t = t || '*';
             var ns = [], es = _gbt(t, e), l = es.length;
             for (var i = 0, j = 0; i < l; i++) {
                 if (this.ccss(es[i], c)) {
                     ns[j] = es[i];
                     j++;
                 }
             }
             return ns;
         }
     };
 } ();

//////end healthe library

// The following functions were copied from Util.Core, a module within the Healthe Widget Library
// http://prototyping.healthe.cerner.corp/repo/release/site/com.cerner.healthe.navigator/healthe-widget-library/1.2/jsdoc/

function getPosition(e) {
    e = e || window.event;
    var cursor = { x: 0, y: 0 };
    if (e.pageX || e.pageY) {
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    }
    else {
        var de = document.documentElement;
        var b = document.body;
        cursor.x = e.clientX +
                               (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
        cursor.y = e.clientY +
                               (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
    }
    return cursor;
}

// The following functions were copied from Util.Style, a module within the Healthe Widget Library
// http://prototyping.healthe.cerner.corp/repo/release/site/com.cerner.healthe.navigator/healthe-widget-library/1.2/jsdoc/

function gvs() {
    var n = window, d = document, b = d.body, e = d.documentElement;
    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof n.innerWidth !== 'undefined') {
        return [n.innerHeight, n.innerWidth];
    }
    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof e !== 'undefined' && typeof e.clientWidth !== 'undefined' && e.clientWidth !== 0) {
        return [e.clientHeight, e.clientWidth];
    }
    // older versions of IE
    else {
        return [b.clientHeight, b.clientWidth];
    }
}

function gso() {
    var d = document, b = d.body, w = window, e = d.documentElement, et = e.scrollTop, bt = b.scrollTop, el = e.scrollLeft, bl = b.scrollLeft;
    if (typeof w.pageYOffset === "number") {
        return [w.pageYOffset, w.pageXOffset];
    }
    if (typeof et === "number") {
        if (bt > et || bl > el) {
            return [bt, bl];
        }
        return [et, el];
    }
    return [bt, bl];
}

function getUniqueFileName(usrId)
{
    var currentTime = new Date()
    var month = currentTime.getMonth() + 1
    var day = currentTime.getDate()
    var year = currentTime.getFullYear()
    var hrs = currentTime.getHours()
    var min = currentTime.getMinutes()
    var sec = currentTime.getSeconds()
    var uniqueName = "C:\\temp\\preg_sum_log_"+usrId+"_" + month + day + year +"_"+ hrs + min + sec+".txt";
    return uniqueName;
}
