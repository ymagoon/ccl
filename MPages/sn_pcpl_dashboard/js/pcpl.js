//global mpage object to store values used in subroutines
var mpObj = {
userId : "",
userName : "",
appName : "",
sortType : 0,
sortOrder : 0,
areaCd : 0,
docTypeCd : 0,
ipath : ""
};

var mpPrefs = {
addThreshold : 0,
caseRange : 0,
minCases : 0,
itemDescription : "",
removeThreshold : 0,
snoozeOption : 0
};
// The current patient list, stored in global array to prevent repeated script calls
var activeList = [];

function clearPrefs() {
	// Reset global preference variables
	mpPrefs.addThreshold = 0;
	mpPrefs.caseRange = 0;
	mpPrefs.minCases = 0;
	mpPrefs.itemDescription = "";
	mpPrefs.removeThreshold = 0;
	mpPrefs.snoozeOption = 0;
}


/**
 * Calls the specified CCL script and passes the response text to the appropriate callback function
 * @param {string} url : The name of the CCL script
 * @param {function} callback : The function to be called with the response text
 * @param {string} params (optional) : Any additional parameters to be passed to the CCL script
 */
function load(url, callback, params, dat) {
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
				callback(xhr.responseText, dat);
            }
            else {
                alert("Problem retrieving data");
            }
        }
    }
}

//init function onload
window.onload = function() {
mpObj.ipath = _g('file_path').firstChild.data;
mpObj.userId = _g("user_id").firstChild.data;
mpObj.userName = _g("userName").firstChild.data;
mpObj.appName = _g("appName").firstChild.data;

// Load Patient Lists
var ptlParams = "^MINE^, value($USR_Personid$)";
load("sn_pcpl_location_list", ptlLoad, ptlParams);
};  //end init section




function saveFilterPrefs(){
var areaFilter = _g("locLists");
var areaIndex = areaFilter.options.selectedIndex;
var areaCd = areaFilter.options[areaIndex].value;
var docFilters = _g("docFilter");
var curFilter = docFilters.options.selectedIndex;
var docTypeCd = docFilters.options[curFilter].value;

// Save Area Cd and document Type before exiting
if ((docTypeCd != mpObj.docTypeCd) || (areaCd != mpObj.areaCd)) {
  var saveParams = "^MINE^, value($USR_Personid$)" + ",^"+areaCd +"^,^" + docTypeCd + "^";
  load("sn_pcpl_save_prefs", savePrefs, saveParams);
  }	
  
  function savePrefs(xhr) {
	  var ptlData = xhr;
	  var jsonEval = JSON.parse(ptlData);
	  var jsonObj = jsonEval.RECORD_DATA;
	  var jsStatus = jsonObj.STATUS_DATA.STATUS;	
	  if (jsStatus == "S") {
	    var prefObj = jsonObj.PREFS;
	    mpObj.areaCd = prefObj[0].PREF_VALUE;
	    mpObj.docTypeCd = prefObj[1].PREF_VALUE ;
	  }
  }
}


// Load Patient Lists
function ptlLoad(xhr) {

	var ptlData = xhr;
	var jsonEval = JSON.parse(ptlData);
	var jsonObj = jsonEval.RECORD_DATA;
	var jsStatus = jsonObj.STATUS_DATA.STATUS;
	var locLen = 0;
	var locLists = _g("locLists");
	if (jsStatus == "Z") {
		locLists.options[0] = new Option("No Location Defined", 0);
	}
	else if (jsStatus == "S") {
		function sortLists(a, b) {
			var sortRes = 0;
			if (a.DISP < b.DISP) {
				sortRes = -1;
			}
			else {
				sortRes = 1;
			}
			return sortRes;
		}
		var locObj = jsonObj.QUAL;
		mpObj.areaCd = jsonObj.PCPL_DEFAULT_AREA_CD;
		mpObj.docTypeCd = jsonObj.PCPL_DEFAULT_DOCUMENT_TYPE_CD;
		lctLen = locObj.length;
		var lctLists = [];
		for (var i=lctLen; i--;) {
			var lctItem = locObj[i];
			var lctList = {
				DESC : lctItem.DESCRIPTION,
				DISP : lctItem.DISPLAY,
				SEQ : lctItem.COLLATION_SEQ,
				CV  : lctItem.CODE_VALUE
			};
			lctLists.push(lctList);
		}
		lctLists.sort(sortLists);
		for (var i=0; i<lctLen; i++) {
			var lctItem = lctLists[i];
			locLists.options[i] = new Option(lctItem.DISP, lctItem.CV);
		}
		if(mpObj.areaCd>0)
		  locLists.value = mpObj.areaCd;
		loadLocationList();
		Util.addEvent(locLists, "change", loadLocationList);
		var docFilters = _g("docFilter");		
		Util.addEvent(docFilters, "change", filterResults);
	}
	else {
		locLists.options[0] = new Option("Error Retrieving Data", 0);
	}
}

function loadLocationList() {
    clearPrefs();
		var locLists = _g("locLists");
		var curList = locLists.options.selectedIndex;
		var listID = locLists.options[curList].value;
		mpObj.areaCd = listID;
		var docType = _g("docFilter");
		docType.options.length=0;
		var params = "^MINE^, value($USR_Personid$), " + listID + ".0";
		load("sn_pcpl_doc_types", loadFilters, params);
}

function sortPatients(typ) {	
		// Sort order : 0 = ascending, 1 = descending
		var sortOrd = 0;
		// If the current sorting column is clicked again, reverse the sort
		//if (typ == mpObj.sortType) {
		//	sortOrd = (mpObj.sortOrder + 1) % 2;
		//}
		
		mpObj.sortOrder = sortOrd;
		mpObj.sortType = typ;
		switch (typ) {
			case 0:  // Specialty				
				function sortBySpec(a, b) {
					var sortRes = 0;
					if (a.SPECIALTY < b.SPECIALTY) {
						sortRes = 1;
					}
					else {
						sortRes = -1;
					}
					if (sortOrd == 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}
				activeList.sort(sortBySpec);
				break;			
		// using switch inorder to add column sorting for multiple headers.
		
		}// end of switch
		
		var jsActivePats = [];
		var activePats = "";
		var SpecHeader = "None";
		for (var i=activeList.length; i--;) {
		  	if (activeList[i].SPECIALTY != SpecHeader)
				{
				  if(activeList[i].SPECIALTY == "")
				    jsActivePats.push("<div class='pcpl-hd'><table class='pat-table-hd'><tr class='specHdr' id='hdrRow'>None </tr></table></div>");
				  else
				    jsActivePats.push("<div class='specHdr'>"+activeList[i].SPECIALTY+" </div>");				    
				}
		  SpecHeader = activeList[i].SPECIALTY;
			jsActivePats.push(activeList[i].HTML);
		}
		activePats = jsActivePats.join("");
		var patContent = _g("patContent");
		patContent.innerHTML = activePats;
		hvrInit("pat-info", patContent);		
		calcOddEven();
		// Indicate column with active sort
		var pat = _g("report");
		var sortArr = Util.Style.g("col-sort", pat, "SPAN");
		for (var i=sortArr.length; i--;) {
			Util.Style.rcss(sortArr[i], "col-sort");
		}
		var hdArr = Util.Style.g("col-hd", pat, "SPAN");
		Util.Style.acss(hdArr[typ], "col-sort");
}

function loadFilters(xhr) {
	activeList = [];
	var patData = xhr;
	var jsonEval = JSON.parse(patData);
	var jsonObj = jsonEval.RECORD_DATA;
	var jsStatus = jsonObj.STATUS_DATA.STATUS;
	var patHTML = "";
	var surgLen = 0;
	var sNoDocType = "No Document Type Defined";
	var errorData = "Error Retrieving Data";
	var allDisp = "ALL";
	var docType = _g("docFilter");
	var surgFilter = _g("surgFilter");
	var procFilter = _g("procFilter");
	var specFilter = _g("specFilter");
	var btnLoad = _g("loadReport");
	btnLoad.disabled = true;
	docType.options.length=0;
	surgFilter.options.length=0;
	procFilter.options.length=0;
	specFilter.options.length=0;
	if (jsStatus == "Z") {
		docType.options[0] = new Option(sNoDocType, 0);
	}
	else if (jsStatus == "S") {	 
    function sortFilter(a, b) {
	    var sortRes = 0;
	    if (a.NAME < b.NAME) {
		    sortRes = -1;
	    }
	    else {
		    sortRes = 1;
	    }
	    return sortRes;
    }				
		var docTypeObj = jsonObj.DOC_TYPE_CDS_QUAL;
		var surgObj = jsonObj.SURG_LIST_QUAL;
		var procObj = jsonObj.PROCEDURE_LIST_QUAL;
		var specObj = jsonObj.PRSNL_GROUPS_QUAL;
		docLen = docTypeObj.length;
		surgLen = surgObj.length;
		procLen = procObj.length;
		specLen = specObj.length;
		var docLists = [];
		var surgLists = [];
		var procLists = [];
		var specLists = [];
		for (var i=docLen; i--;) {
			var docItem = docTypeObj[i];
			var docList = {
				DOCTYPE : docItem.DOC_TYPE_CD,
				NAME : docItem.DOC_TYPE_DISP,
				DOCREF : docItem.DOC_REF_ID,
				DOCSTAGE  : docItem.DOC_STAGE_CD
			};
			docLists.push(docList);
		}
		docLists.sort(sortFilter);     
    for (var i=surgLen; i--;) {
			var surgItem = surgObj[i];
			var surgList = {
				NAME : surgItem.SURG_NAME,
				ID : surgItem.SURG_ID
			};
			surgLists.push(surgList);
		}
		surgLists.sort(sortFilter);
		for (var i=specLen; i--;) {
			var specItem = specObj[i];
			var specList = {
				NAME : specItem.PRSNL_GROUP_NAME,
				ID : specItem.PRSNL_GROUP_ID
			};
			specLists.push(specList);
		}
		specLists.sort(sortFilter);
		for (var i=procLen; i--;) {
			var procItem = procObj[i];
			var procList = {				
				NAME : procItem.PRIMARY_MNEMONIC,
				CATALOG : procItem.CATALOG_CD
			};
			procLists.push(procList);
		}
	  procLists.sort(sortFilter);
		for (var i=0; i<docLen; i++) {
			var lctItem = docLists[i];
			docType.options[i] = new Option(lctItem.NAME, lctItem.DOCTYPE);
			if((mpObj.docTypeCd>0) && (mpObj.docTypeCd == lctItem.DOCTYPE))
		  docType.value = mpObj.docTypeCd;
		}
	
		
		surgFilter.options[0] = new Option(allDisp, 0); 
		for (var i=0; i<surgLen; i++) {
			var srgItem = surgLists[i];
			surgFilter.options[i+1] = new Option(srgItem.NAME, srgItem.ID);
		}
		
		procFilter.options[0] = new Option(allDisp, 0);
		for (var i=0; i<procLen; i++) {
			var prcItem = procLists[i];
			procFilter.options[i+1] = new Option(prcItem.NAME, prcItem.CATALOG);
		}
		
		specFilter.options[0]= new Option(allDisp, 0);
		for (var i=0; i<specLen; i++) {
			var spcItem = specLists[i];
			specFilter.options[i+1] = new Option(spcItem.NAME, spcItem.ID);
		}
		btnLoad.disabled = false;
	}
	else {
		locLists.options[0] = new Option(errorData, 0);
	}
}

function loadItemUsage() {	
		var patSec = _g("report");
		patSec.innerHTML = "<span class='pat-txt'>Loading...</span>";
		var locLists = _g("locLists");
		var docTypeLists = _g("docFilter");
		var surgLists = _g("surgFilter");
		var specLists = _g("specFilter");
		var procLists = _g("procFilter");
		var pcSubmit = _g("dispSubmit");
	  pcSubmit.innerHTML = "";
		
		var selLocList = locLists.options.selectedIndex;
		var locCd = locLists.options[selLocList].value;
		var seldocTypeList = docTypeLists.options.selectedIndex;
		var docTypeCd = docTypeLists.options[seldocTypeList].value;
		var selSurgList = surgLists.options.selectedIndex;
		var surdId = surgLists.options[selSurgList].value;		
		var selSpecList = specLists.options.selectedIndex;
		var specId = specLists.options[selSpecList].value;		
		var selprocList = procLists.options.selectedIndex;
		var procCd = procLists.options[selprocList].value;
    var params="";
		if(mpPrefs.caseRange>0)
		  params = "^MINE^, value($USR_Personid$), " + locCd + ".0, " + docTypeCd + ".0, " + surdId + ".0, " + specId + ".0, " + procCd + ".0," + mpPrefs.caseRange + ",^" + mpPrefs.itemDescription + "^," + mpPrefs.minCases +"," + mpPrefs.removeThreshold +"," + mpPrefs.addThreshold;
		else
		  params = "^MINE^, value($USR_Personid$), " + locCd + ".0, " + docTypeCd + ".0, " + surdId + ".0, " + specId + ".0, " + procCd + ".0," + mpPrefs.caseRange;
		load("sn_pcpl_item_usage", loadResults, params);	
}

function loadResults(xhr) {
	activeList = [];
	var pcData = xhr;
	var jsonEval = JSON.parse(pcData);
	var jsonObj = jsonEval.RECORD_DATA;
	var jsStatus = jsonObj.STATUS_DATA.STATUS;
	var colHeadPrefCardDesc = "Preference Card Description";
	var colHeadItemId = "Item Identifiers";
	var colHeadAnalysis = "Analysis";
	var colHeadSug = "Suggestion";
	var colHeadQty = "Open/Hold";
	var colHeadAccept = "Accept";
	var colHeadSnooze = "Snooze";
	var noItem = "No items found.";
	var pcHTML = "";
	var pcLen = 0;
	var pcSec = _g("report");
	pcSec.innerHTML = "";
	var pcSubmit = _g("dispSubmit");
	pcSubmit.innerHTML = "";
	
	if (jsStatus == "Z") {
		pcHTML = "<div><table class='pat-table-hd'><tr class='hdr' id='hdrRow'><th class='pcpl-pc-desc'><span class='col-hd'>"+colHeadPrefCardDesc+"</span></th><th class='pcpl-item-id'><span class='col-hd'>"+colHeadItemId+"</span></th><th class='pcpl-analysis'><span class='col-hd'>"+colHeadAnalysis+"</span></th><th class='pcpl-sug-mod'><span class='col-hd'>"+colHeadSug+"</span></th><th class='pcpl-open-hold'><span class='col-hd'>"+colHeadQty+"</span></th><th class='pcpl-accept'><span class='col-hd'>"+colHeadAccept+"</span></th><th class='pcpl-snooze'><span class='col-hd'>"+colHeadSnooze+"</span></th></tr></table></div><div id='patContent'><span class='pat-txt'>"+noItem+"</span></div><div id='submitButton'></div>";
		pcSec.innerHTML = pcHTML;		
	}
	else if (jsStatus == "S") {
		var pcObj = jsonObj.PC_QUAL;
		if(jsonObj.CASE_RANGE > 0){
		  mpPrefs.snoozeOption = jsonObj.SNOOZE;
		  mpPrefs.addThreshold = jsonObj.ADD_THRESHOLD;
		  mpPrefs.removeThreshold = jsonObj.REMOVE_THRESHOLD;
		  mpPrefs.caseRange = jsonObj.CASE_RANGE;
		  mpPrefs.itemDescription = jsonObj.ITEM_DESC;
		  mpPrefs.minCases = jsonObj.MIN_CASES;
		}
		pcLen = pcObj.length;
		pcHTML = "<div class='pat-hd'>" +
		           "<table class='pat-table-hd'  id='PLItems'>" +
		             "<tr class='hdr' id='hdrRow'>" +
		               "<th class='pcpl-pc-desc'><span class='col-hd'>"+colHeadPrefCardDesc+"</span></th>" +
		               "<th class='pcpl-item-id'><span class='col-hd'>"+colHeadItemId+"</span></th>" +
		               "<th class='pcpl-analysis'><span class='col-hd'>"+colHeadAnalysis+"</span></th>" +
		               "<th class='pcpl-sug-mod'><span class='col-hd'>"+colHeadSug+"</span></th>" +
		               "<th class='pcpl-open-hold'><span class='col-hd'>"+colHeadQty+"</span></th>" +
		               "<th class='pcpl-accept'><span class='col-hd'>"+colHeadAccept+"</span></th>" +
		               "<th class='pcpl-snooze'><span class='col-hd'>"+colHeadSnooze+"</span></th>" +
		             "</tr>" +
		           "</table>" +
		         "</div>" +
		         "<div id='patContent' class='pat-content'></div>";
		for (var i=pcLen; i--;) {
			var pcItem = pcObj[i];
			if (pcItem.PREF_CARD_ID > 0) {
				var pcId = pcItem.PREF_CARD_ID;
				var pcSpec = pcItem.SPECIALTY;
				var pcSurg = pcItem.SURGEON;
				var pcProc = pcItem.PROCEDURE;
				var pcCaseCnt = pcItem.CASE_CNT;
				
				// Obtain Preference Card pick list Items 
				var pcplItem = pcItem.ITEMS;
				var pcplLen = pcplItem.length;
				var pcplItemArr = [];
				var rrtTxt = "";
				var lastActDt = "";
				var pcCurrOpen = "";
				var pcCurrHold = "";
				var pcPlanOpen = "";
				var pcPlanHold = "";
				var openQty = 0;
				var holdQty = 0;
				var pcHoldQty = "";
				var na = "N/A";
				var rowId ="";			
				var rmvPrefCard = "Remove";
				var addPrefCard = "Add";
				var pcSugMod = "";
				var pcAnalysis = "";
				// Obtain Items Identifiers
				
				for(j = pcplLen; j--;){
				  var itemTxt = "";
				  var itemId = "";
				  var pcplItemArr = [];
				  			  
				  itemId = pcplItem[j].ITEM_ID;
				  rowId = "S"+pcId +""+itemId;
				  pcOpenQty = pcplItem[j].OPEN_QTY;
				  pcHoldQty = pcplItem[j].HOLD_QTY;
				  pcUseCnt = pcplItem[j].USE_CNT;
				  var pcActionFlag = pcplItem[j].ACTION_FLAG;
				  if (pcActionFlag == "1")
				  {
				    pcCurrOpen = pcCurrHold = na;
				    openQty=pcPlanOpen = pcOpenQty;
				    pcPlanHold = 0;
				    pcSugMod = addPrefCard;
				    pcAnalysis = "Added on " + parseInt(pcUseCnt*100/pcCaseCnt) + "% [" + pcUseCnt +" of " + pcCaseCnt+ "] of cases";
				  }
				  else if (pcActionFlag == "2")
				  {
				    openQty=pcCurrOpen = pcOpenQty;
				    holdQty=pcCurrHold = pcHoldQty;
				    pcPlanOpen = na;
				    pcPlanHold = na;
				    pcSugMod = rmvPrefCard;	
				    pcAnalysis = "Returned on " + parseInt((pcCaseCnt-pcUseCnt)*100/pcCaseCnt) +"% [" + (pcCaseCnt - pcUseCnt) +" of " + pcCaseCnt+ "] of cases";
				  }
				  var pcplItemId = pcplItem[j].IDENTIFIERS;
				  var itemLen = pcplItemId.length;	
				  for (var k=itemLen; k--;) {
			      var pcItem = pcplItemId[k];			    
			      pcplItemArr.push(pcItem.VALUE, "<br>");
			      itemTxt = pcplItemArr.join("");
          }         
				//}
				var thisPcArr = []; 
				var thisPcHTML = "";
				var selectHTML = buildSelect(mpPrefs.snoozeOption);
				

					 thisPcArr.push(
					 "<div class='pat-sec' id ='",rowId,"'>",
					   "<table class='pat-table'>",
					     "<tr>",
					       "<td class='pcpl-pc-desc'>"+pcProc+ "<br>" +pcSurg+ "</td>",
					       "<td class='pcpl-item-id'><span>"+itemTxt+"</span></td>",
					       "<td class='pcpl-analysis'><span>"+pcAnalysis+"</span></td>",
					       "<td class='pcpl-sug-mod'><span>"+pcSugMod+"</span></td>",
					       "<td class='pcpl-open-hold'>",
					          "<span>",
					            "<table>",
					              "<tr>",
					                "<th><span class='open-hold'> Curr</span></th> <th><span class='open-hold'> Plan</span></th> ",
					              "</tr>",  
					              "<tr>",
					                "<td class='open-hold'>O = "+pcCurrOpen+" </td> <td class='open-hold'>"+pcPlanOpen+"</td> ",					                
					              "</tr>",
					              "<tr>",					               
					                "<td class='open-hold'>H = "+pcCurrHold+"</td> <td class='open-hold'>"+pcPlanHold+"</td> ",
					              "</tr>",    
					            "</table>",
					          "</span>",
					       "</td>",
					       "<td class='pcpl-accept'><span><input type='checkbox' name='chkAccept' id='chkAccept' onclick='toggleCheckBoxes(this,"+rowId+");'></span></td>",
					       "<td class='pcpl-snooze'><span><input type='checkbox' name='chkSnooze' id='chkSnooze' onclick='toggleCheckBoxes(this,"+rowId+");'></span><span>"+selectHTML+"</span></td>",
					     "</tr>",
						 "</table>",						 
				   "</div>");
	
				thisPcHTML = thisPcArr.join("");				
				
				// Create object and push onto array for front end re-sorting
				var thisPc = {
					ROWID : rowId,
					SPECIALTY : pcSpec,
					PREFCARDID : pcId,
					DOCTYPE : pcSpec,
					SURG : pcSurg,
					PROC : pcSurg,
					PCDISP : pcSurg,
					ITEMID : itemId,
					ANALSIS : pcSurg,
					SUGMOD : pcSurg,
					OPENQTY : openQty,
					HOLDQTY : holdQty,
					ACTION : pcActionFlag,
					HTML : thisPcHTML
				};
				activeList.push(thisPc);
			}
		 }//end of for(j = pcplLen; j--;)
		}		
		pcSec.innerHTML = pcHTML;
		mpObj.sortType = 0;
		mpObj.sortOrder = 0;
		sortPatients(0);
		if (pcLen > 0){
		  var addSubmitHtml = ""
		  addSubmitHtml = "<div id='submitButton'><span class='pat-btns'><input class='pat-btn' type='submit' id ='SubmitChg' value='SUBMIT' onclick='javascript:submitSuggestions()'></span></div>";
		  pcSubmit.innerHTML = addSubmitHtml;
		}
	}
	else {
		pcHTML = "<div class='pat-hd'><table class='pat-table-hd'><tr class='hdr' id='hdrRow'><th class='pcpl-spec'><span class='col-hd'>Specialty</span></th><th class='pcpl-area'><span class='col-hd'>Area</span></th><th class='pcpl-doc-type'><span class='col-hd'>Document Type</span></th><th class='pcpl-surg'><span class='col-hd'>Surgeon</span></th><th class='pcpl-proc'><span class='col-hd'>Procedure</span></th><th class='pcpl-pc-desc'><span class='col-hd'>Preference card decription</span></th><th class='pcpl-item-id'><span class='col-hd'>Item Identifiers</span></th><th class='pcpl-analysis'><span class='col-hd'>Analysis</span></th><th class='pcpl-sug-mod'><span class='col-hd'>Suggested Modofication</span></th><th class='pcpl-open-hold'><span class='col-hd'>Open/Hold</span></th><th class='pcpl-accept'><span class='col-hd'>Accept</span></th><th class='pcpl-snooze'><span class='col-hd'>Snooze</span></th></tr></table></div><div id='patContent'><span class='pat-txt'>Error retrieving data.</span></div>";
		pcSec.innerHTML = pcHTML;		
	}
	saveFilterPrefs();
}


function buildSelect( defaultSel) {
    var MONTH="month";   
    var options = { 0 : 1,
                    1 : 3,
                    2 : 6,
                    3 : 9,
                    4 : 12
                  }
    var select = '<select id="selSnooze" name="selSnooze" disabled="true">';
    var option,html;
    for (var val in options) {      
        if(val != 0)
          MONTH = "months";
        if (val == defaultSel) {
          html += '<option value="'+options[val]+'" selected="selected">'+options[val]+' '+MONTH+'</option>';            
        }
        else{
          html += '<option value="'+options[val]+'">'+options[val]+' '+MONTH+'</option>'; 
        }        
    }
    select = select + html + '</select>';
    return select;
}


function submitSuggestions() {	
  var updateList = [];
	
  var snoozeInd = 0;
	var actionFlag = 0;
  var value = 0;
  var btnSubmit = _g("SubmitChg");
  btnSubmit.disabled = true;
 
 for (var i=activeList.length; i--;) {
    var curItem = activeList[i];
    var bSnooze = false;
	  var bAccept = false;
    
    var divRow = _g(curItem.ROWID);
    //var chk = divRow.getElementsByTagName('input');
    var chk = _gbt("input", divRow);
    var len = chk.length;
    if(chk[0].id == 'chkAccept' && chk[0].checked == true) 
      bAccept = true;
    else
      if(chk[1].id == 'chkSnooze' && chk[1].checked == true) 
        bSnooze = true;  

    var snooze = _gbt("select", divRow);
    var snoozeMonth = snooze[0].options.value;
    
    if (bAccept == true)
    {
      actionFlag =curItem.ACTION;// or 2 based on the analysi and suggestion
      value = curItem.OPENQTY; 
    }
    else if(bSnooze == true)
    {
      if(curItem.ACTION == 1)
        actionFlag = 3;
      else
        actionFlag = 4;  
        value = snoozeMonth;      
    }  
    // Create object and push onto array for pref card updates
		var pcplUpdateObj = {
			PREFCARDID : curItem.PREFCARDID,
			ACTIONFLAG : actionFlag,
			ITEMID : curItem.ITEMID,											
			VALUE: value			
		};
		if(bAccept == true || bSnooze == true)
		updateList.push(pcplUpdateObj);
 }
  //build pref json  
  var len = updateList.length;
  var jsonPref = "{'updateItem': {'qual': ["
  var jsonEOL = ',';
  for (var i=0; i< len; i++) {
	  if (i+1 == len || len == 1){
		  jsonEOL = '';
	  }

	  jsonPref += " {'pref_card_id': '" + updateList[i].PREFCARDID + ".0','action_flag': '" + updateList[i].ACTIONFLAG +
				  "','item_id': '" + updateList[i].ITEMID + ".0','value1': '" + updateList[i].VALUE + "'}" + jsonEOL;
  }

  jsonPref += "]}}";
  //end build pref json
    
  var params = "^MINE^, value($USR_Personid$), "  + "^" + jsonPref + "^";
  //alert(jsonPref);
  if(updateList.length == 0){
    alert("Please make sure to select at least one item");
    btnSubmit.disabled = false;
  }
  else  
		load("sn_updt_pcpl", displayMessage, params);
  	
}

function displayMessage(xhr){
  var pcData = xhr;
	var jsonEval = JSON.parse(pcData);
	var jsonObj = jsonEval.RECORD_DATA;
	var jsStatus = jsonObj.STATUS_DATA.STATUS;
	
	if (jsStatus == "Z") {
		alert("Error Updating Preference card");
	}
	else if (jsStatus == "F") {
	alert("One of the modifications didn't go through, Please check the log files.");
	}		
	else if (jsStatus == "S") {	
	}		
	loadItemUsage();
}


function toggleCheckBoxes(elem,ID) {   
   var divRow = _g(ID.id);
   var chk = _gbt("input", ID);
   var selSnooze = _gbt("select", ID);
   var chkAccept;
   var chkSnooze;
 
   var len = chk.length;
    for (var i = 0; i < len; i++) {
        if (chk[i].type === 'checkbox') {
          if(chk[i].id == 'chkAccept'){
             chkAccept = chk[i];
             }
          else 
            if(chk[i].id === 'chkSnooze'){
             chkSnooze = chk[i];
            }                        
        }
    }   
    
   if(elem.checked == true){
     if(elem.id === 'chkAccept'){      
        chkSnooze.checked = false;
        selSnooze[0].disabled = true;
     }      
     else {
        chkAccept.checked = false;
        selSnooze[0].disabled = false;
     }
   }
   else
      if(elem.id === 'chkSnooze') 
        selSnooze[0].disabled = true;     
}



function filterResults() {
	var patFilters = _g("docFilter");
	var curFilter = patFilters.options.selectedIndex;	
	var docTypeCd = patFilters.options[curFilter].value;
	if (docTypeCd != mpObj.docTypeCd) {
		clearPrefs();
	}	
}

function calcOddEven() {
	var scrTyp = "pat-sec";
	var fltrPats = Util.Style.g(scrTyp, _g("report"), "DIV");
	var fltrTotal = fltrPats.length;
	for (var i=fltrTotal; i--;) {
		if (i%2) {
			if (Util.Style.ccss(fltrPats[i], "odd")) {
				Util.Style.rcss(fltrPats[i], "odd");
				Util.Style.acss(fltrPats[i], "even");
			}
			else if (!Util.Style.ccss(fltrPats[i], "even")) {
				Util.Style.acss(fltrPats[i], "even");
			}
		}
		else {
			if (Util.Style.ccss(fltrPats[i], "even")) {
				Util.Style.rcss(fltrPats[i], "even");
				Util.Style.acss(fltrPats[i], "odd");
			}
			else if (!Util.Style.ccss(fltrPats[i], "odd")) {
				Util.Style.acss(fltrPats[i], "odd");
			}
		}
	}
}



/**
 * Formats the date/time using the appropriate mask
 * @param {String} dt : The date/time in standard UTC format
 * @param {String} mask (optional) : The name of the mask to be used
 * @return {Date} : The formatted date/time
 */
function fmtDt(dt, mask) {
	if (dt) {
		var dateTime = new Date();
		dateTime.setISO8601(dt);	
		if (mask) {
			return dateTime.format(mask);
		}
		else {
			return dateTime.format("longDateTime3");
		}
	}
	else {
		return "";
	}
}

/**
 * Initializes the hovers for the specified section
 * @param {string} trg : The face-up class that triggers the hover
 * @param {node} par : The parent element to search within
 */
function hvrInit(trg, par) {
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

/* Hover Mouse Over */
function hmo(evt, n) {
    var s = n.style, p = getPosition(evt), top = p.y + 30, left = p.x + 20;
    evt = evt || window.event;
    document.body.appendChild(n);
    s.display = "block";
    s.left = left + "px";
    s.top = top + "px";
}

/* Hover Mouse Move */
function hmm(evt, n) {
    var s = n.style, p = getPosition(evt), vp = gvs(), so = gso(), left = p.x + 20, top = p.y + 20;

    if (left + n.offsetWidth > vp[1] + so[1]) {
        left = left - 40 - n.offsetWidth;
		if (left < 0) {
			left = 0;
		}
    }

    if (top + n.offsetHeight > vp[0] + so[0]) {
		if(top - 40 - n.offsetHeight < so[0]){
			if (left > 0) {
				top = 10 + so[0];
			}
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
	Util.ia(n, n.previousSibling);
}

/* Hover Setup */
function hs(e, n) {
    var priorBgColor = e.style.backgroundColor;
    var priorBorderColor = e.style.borderColor;
	var priorTextColor = e.style.color;
        e.onmouseenter = function(evt) {
            e.onmouseover = null;
            e.onmouseout = null;
            hmo(evt, n);
        };
        e.onmouseover = function(evt) {
            e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
			e.style.color = "#000";
            hmo(evt, n);
        };
        e.onmousemove = function(evt) {
            e.style.backgroundColor = "#FFFFCC";
            e.style.borderColor = "#CCCCCC";
			e.style.color = "#000";
            hmm(evt, n);
        };
        e.onmouseout = function(evt) {
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
			e.style.color = priorTextColor;
            hmt(evt, n);
        };
        e.onmouseleave = function(evt) {
            e.style.backgroundColor = priorBgColor;
            e.style.borderColor = priorBorderColor;
			e.style.color = priorTextColor;
            e.onmouseover = null;
            e.onmouseout = null;
            hmt(evt, n);
        };
        Util.Style.acss(n, "hover");
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

/************************************************************************************
Cerner Graphics
Author: Brian Heits
Created: 07/08/2009
Updated: 07/17/2009
Modified for RRT Dashboard: 06/18/2010
************************************************************************************/
function CernerGraphics( iWidth, iHeight, node )
{
	this.browser = 0; /* default is IE */
	this.title = "Cerner Graphics";
	this.backgroundColor = "#ffffff";
	if (navigator.userAgent.match(/firefox/i) !== null)
	{
		this.browser = 1;
	}
	else if (navigator.userAgent.match(/safari/i) !== null)
	{
		this.browser = 2;
	}
	/*************************************************************************************************
	isPrintable works great for IE and looks pixelated for Netscape (increase in pixSize leads to
		pixelated view in both cases).
	The reason these graphics don't print is print is meant to NOT show background colors and images.
	There are two alternative ways to enable it to print through browser settings:
		*IE: Tools->Internet Options->Advanced->Printing->Print background
		 colors & images (think only available IE7 and up)
		*Firefox: File->Page Setup->Options->Print Background (colors & images)
	isPrintable is by default "true" since firefox will look correct (in pixSize=1) once the above is done.
	*************************************************************************************************/
	this.isPrintable = true;
	/* This can be used to scale the picture without a performance hit */
	this.pixSize = 1;
	this.divObj = node;
	/* bigger height and width => higher resolution => slower performance */
	this.height = parseFloat(iHeight);
	if ((isNaN(this.height) || this.height === 0) && this.divObj !== null)
	{
		this.height = parseFloat(this.divObj.style.height.toString().match(/\d+/));
	}
	this.width = parseFloat(iWidth);
	if ((isNaN(this.width) || this.width === 0) && this.divObj !== null)
	{
		this.width = parseFloat(this.divObj.style.width.toString().match(/\d+/));
	}
	/* border for image */
	this.border = "1px solid #dddddd";
	this.outputString = "";
	this.grid = [];
	for (var i=0;i<(this.height);i++)
	{
		this.grid.push([]);
		for (var j=0;j<(this.width);j++)
		{
			this.grid[i].push([]);
			this.grid[i][j] = ["",0];
		}
	}
 
	/************************************************
	This allows for setting a grid point where +x is
	left to right and +y is bottom to top.
	************************************************/
	this.setPoint = function( iX, iY, iValue, iType )
	{
		try{
		var isAutoWrite = true;
		if (arguments.length == 5)
		{
			isAutoWrite = arguments[4];
		}
		
		var tmpX = iX-1;
		var tmpY = this.height-iY;
		if ((tmpY >= this.grid.length || tmpY < 0 || tmpX >= this.grid[tmpY].length || tmpX < 0) && !isAutoWrite)
		{
			return false;
		}
		if (tmpY >= this.grid.length)
		{
			tmpY = this.grid.length-1;
		}
		else if (tmpY < 0)
		{
			tmpY = 0;
		}
		if (tmpX >= this.grid[tmpY].length)
		{
			tmpX = this.grid[tmpY].length-1;
		}
		else if (tmpX < 0)
		{
			tmpX = 0;
		}
 
		this.grid[tmpY][tmpX][0] = iValue;
		this.grid[tmpY][tmpX][1] = iType;
		}catch(err){}
	};
 
	/************************************************
	This allows for scaling a value according to width.
	Parameters are as follows:
	iValue ==> value to scale
	iScaleX ==> value to scale by (divide by)
	iOffset ==> (optional) offset that is usually used
				in differences between minx and maxx
	************************************************/
	this.scaleX = function( iValue, iScaleX )
	{
		return Math.round((iValue*this.width)/iScaleX);
	};
 
	/************************************************
	This allows for scaling a value according to height.
	Parameters are as follows:
	iValue ==> value to scale
	iScaleY ==> value to scale by (divide by)
	iOffset ==> (optional) offset that is usually used
				in differences between miny and maxy
	************************************************/
	this.scaleY = function( iValue, iScaleY )
	{
		var iOffset = 0;
		if (arguments.length == 3)
		{
			iOffset = parseFloat( arguments[2] );
		}
		return Math.round(((iValue-iOffset)*this.height)/(iScaleY-iOffset));
	};
 
	/******************* GRAPHICS DRAWING FUNCTIONS *****************/
 
	/************************************************
	This draws a line from point (x1, y1) to (x2, y2)
	with color = iColor.  This uses the formula of
	y = mx + b
	************************************************/
	this.drawLine = function( x1, y1, x2, y2, iColor )
	{
		/* y = mx + b */
		var rise = (y2 - y1);
		var run = (x2 - x1);
		var m = (rise/run);
		var b = y1 - (m * x1);
		var maxX = Math.max( x1, x2 );
		var minX = Math.min( x1, x2 );
		var maxY = Math.max( y1, y2 );
		var minY = Math.min( y1, y2 );
		if (run === 0 || rise === 0)
		{
			if (run === 0) /* x2 == x1 */
			{
				for (var i=minY; i<=maxY; i++)
				{
					this.setPoint( x1, i, iColor, 0 );
				}
			}
			else if (rise === 0) /* y2 == y1 */
			{
				for (var i=minX; i<=maxX; i++)
				{
					this.setPoint( i, y1, iColor, 0 );
				}
			}
			else /* x2 == x1 && y2 == y1 */
			{
				this.setPoint( x1, y1, iColor, 0 );
			}
		}
		else
		{
			for (var i=minX; i<=maxX; i++)
			{
				this.setPoint( i, Math.round((m * i)+b), iColor, 0 );
			}
			for (var i=minY; i<=maxY; i++)
			{
				this.setPoint( Math.round((i-b)/m), i, iColor, 0 );
			}
		}
	};
 
	/************************************************
	This draws a circle at point (x, y) with radius r,
	border color = iBorder, and fill color = iFill.
	This uses the formula of
	(x-h)^2 + (y-k)^2 = r^2
	************************************************/
	this.drawCircle = function( x, y, r, iBorder, iFill )
	{
		var h = x;
		var k = y;
		var xi = h-r;
		var xf = h+r;
		var yi = k-r;
		var yf = k+r;
		for (var i=xi;i<=xf;i++)
		{
			var y1 = Math.round(k+Math.sqrt(Math.pow(r,2)-Math.pow((i-h),2)));
			var y2 = Math.round(k-Math.sqrt(Math.pow(r,2)-Math.pow((i-h),2)));
			this.setPoint( i, y1, iBorder, 0 );
			this.setPoint( i, y2, iBorder, 0 );
			if (arguments.length == 5)
			{
				if (y1 > y2)
				{
					this.drawLine( i, y2+1, i, y1-1, iFill );
				}
				else if (y2 > y1)
				{
					this.drawLine( i, y1+1, i, y2-1, iFill );
				}
			}
		}
		for (var i=yi;i<=yf;i++)
		{
			var x1 = Math.round(h+Math.sqrt(Math.pow(r,2)-Math.pow((i-k),2)));
			var x2 = Math.round(h-Math.sqrt(Math.pow(r,2)-Math.pow((i-k),2)));
			this.setPoint( x1, i, iBorder, 0 );
			this.setPoint( x2, i, iBorder, 0 );
			if (arguments.length == 5)
			{
				if (x1 > x2)
				{
					this.drawLine( x2+1, i, x1-1, i, iFill );
				}
				else if (x2 > x1)
				{
					this.drawLine( x1+1, i, x2-1, i, iFill );
				}
			}
		}
	};
 
	/***************************************************************
	This outputs graphics to this.divObj.innerHTML.  Each iType has the
	following characteristics:
	iType == 0 is for setting this.outputString only
	iType == 1 will set this.outputString and output to div object
	***************************************************************/
	this.outputGraphics = function( iType )
	{
		var tmpString = ["<div style='position:relative;overflow:hidden;"];
		tmpString.push("");
 
		tmpString.push("width:");
		if (this.browser>=0)
		{
			tmpString.push(this.width*this.pixSize);
		}
		else
		{
			tmpString.push((this.width*this.pixSize)+2);
		}
		tmpString.push("px;height:");
		if (this.browser>=0)
		{
			tmpString.push(this.height*this.pixSize);
		}
		else
		{
			tmpString.push((this.height*this.pixSize)+2);
		}
		tmpString.push("px;");
 
		tmpString.push("border:");
		tmpString.push(this.border);
		tmpString.push(";background-color:");
		tmpString.push(this.backgroundColor);
		tmpString.push(";'>");
		var foundTxt = false;
		for (var j=0;j<this.grid.length; j++)
		{
			for (var i=0;i<this.grid[j].length; i++)
			{
				if (this.grid[j][i][1] === 0)
				{
					tmpString.push("<div style='position:absolute;");
					tmpString.push("top:");
					tmpString.push(j*this.pixSize);
					tmpString.push("px;left:");
					tmpString.push(i*this.pixSize);
					tmpString.push("px;");
					tmpString.push("width:");
					tmpString.push(this.pixSize);
					tmpString.push("px;height:");
					tmpString.push(this.pixSize);
					tmpString.push("px;");
					if (this.grid[j][i][0] != "")
					{
						tmpString.push("background-color:");
						tmpString.push(this.grid[j][i][0]);
						tmpString.push(";");
					}
					else
					{
						tmpString.push("background-color:");
						tmpString.push(this.backgroundColor);
						tmpString.push(";");
					}
					if (this.isPrintable && this.grid[j][i][0] != "")
					{
						tmpString.push("border:1px solid ");
						tmpString.push(this.grid[j][i][0]);
						tmpString.push(";");
					}
					tmpString.push("'>");
					tmpString.push("</div>");
				}
				else
				{
					if (this.grid[j][i][0] != "holder")
					{
						tmpString.push(this.grid[j][i][0]);
					}
				}
			}
		}
		/* tmpString.push("</div>"); */
		if (iType === 0)
		{
			this.outputString = tmpString.join("");
		}
		else
		{
			this.outputString = tmpString.join("");
			if (this.divObj !== null)
			{
				this.divObj.style.display = "none";
				this.divObj.innerHTML = this.outputString;
				this.divObj.style.display = "";
			}
		}
	};
}
 
/************************************************************************************
Graphic Rendering Objects/Tools
Author: Brian Heits
Created: 07/13/2009
Updated: 07/21/2009
Modified for RRT Dashboard: 06/18/2010
************************************************************************************/ 
function MakeSparklineSingle(data, norm, node, len)
{
	var graphic = new CernerGraphics( 100, 25, node );
	graphic.border = "none";
	if (graphic.divObj === null)
	{
		return;
	}

	var dataArray = data.split(',');

	/* split the data into value date pairs */
	var valueDateArray = [];
	for(var i = 0; i < dataArray.length; i++)
	{
		valueDateArray[i] = dataArray[i].split('|');
	}

	/* make sure all the data elements are numbers */
	if(valueDateArray.length > 0)
	{
		for(var i=valueDateArray.length; i--;)
		{
			if( isNaN(valueDateArray[i][0]) || isNaN(valueDateArray[i][1]) )
			{
				valueDateArray.splice(i,1);
			}
		}
		
		if (valueDateArray.length < 1) {
			return;
		}
		
		var miny = valueDateArray[0][0];
		var maxy = valueDateArray[0][0];		

		/* find the min and maximum values */
		for(var i = 0; i < valueDateArray.length; i++)
		{
			miny = Math.min( miny, valueDateArray[i][0] );
			maxy = Math.max( maxy, valueDateArray[i][0] );
		}
		
		miny = Math.round(miny * 0.9);
		maxy = Math.round(maxy * 1.1);
		
		var maxx = valueDateArray.length-1;
		// If there is only one result, center the point
		if (maxx == 0) {
			maxx = 2;
			maxy = maxy*2;
			miny = 0;
		}		
		
		/* prevents output errors when all values are the same */
		
		if (miny == maxy && maxy !== 0)
		{
			miny = miny - 2;
			if (miny < 0) {
				miny = 0;
			}
		}
		else if (miny == maxy && maxy === 0)
		{
			maxy = 10;
		}

		/* draw the spark line */
		for(var i = 1; i < valueDateArray.length; i++)
		{
			graphic.drawLine(graphic.scaleX(i-1, maxx),graphic.scaleY(valueDateArray[i-1][0], maxy, miny-1),graphic.scaleX(i, maxx),graphic.scaleY(valueDateArray[i][0], maxy, miny-1), "#000000") ;
		}

		var lastx = maxx;
		if (valueDateArray.length == 1) {
			lastx = 1;
		}

		graphic.drawCircle(graphic.scaleX(lastx, maxx),graphic.scaleY(valueDateArray[valueDateArray.length - 1][0], maxy, miny-1),2, "#000000", "#000000" );

		graphic.outputGraphics(1);
		graphic.divObj.style.display = "";
	}
}

function MakeSparklineDouble(data, norm, node, len)
{
	var graphic = new CernerGraphics( 100, 25, node );
	graphic.border = "none";
	if (graphic.divObj === null)
	{
		return;
	}
	var dataArray = data.split(',');
 
	/* split the data into value date pairs */
	var valueDateArray = [];
	for(var i = 0; i < dataArray.length; i++)
	{
		valueDateArray[i] = dataArray[i].split('|');
	}
 
	var pairedValueDateArray = [];
	var curIndex = 0;
	for(var i = 0; i < valueDateArray.length; i++)
	{
		/* systolic = index 0, diastolic = index 1, date = index 2 */
		var tmpSplit = valueDateArray[i][0].split('/');

		if (tmpSplit.length == 2)
		{
			pairedValueDateArray[curIndex] = [];
			pairedValueDateArray[curIndex].push(tmpSplit[0]);
			pairedValueDateArray[curIndex].push(tmpSplit[1]);
			pairedValueDateArray[curIndex].push(valueDateArray[i][1]);
			curIndex++;
		}
	}
 
	/* make sure all the data elements are numbers */
	if(pairedValueDateArray.length > 0)
	{
		for(var i=pairedValueDateArray.length; i--;)
		{
			if( isNaN( pairedValueDateArray[i][0] ) || isNaN( pairedValueDateArray[i][1] ) || isNaN( pairedValueDateArray[i][2] ))
			{
				pairedValueDateArray.splice(i,1);
			}
		}
		if (pairedValueDateArray.length < 1) {
			return;
		}
		var maxx = pairedValueDateArray.length-1;
		// If there is only one result, center the points
		if (maxx == 0) {
			maxx = 2;
		}
		var miny = valueDateArray[0][0];
		var maxy = valueDateArray[0][0]; 
 
		graphic.backgroundColor = "#ffffff";
		var miny = pairedValueDateArray[0][1];  /* diastolic */
		var maxy = pairedValueDateArray[0][0];  /* systolic */

		/* find the min and maximum values */
		for(var i = 0; i < pairedValueDateArray.length; i++)
		{
			miny = Math.min( miny, pairedValueDateArray[i][1] );
			maxy = Math.max( maxy, pairedValueDateArray[i][0] );
		}

		miny = Math.round(miny * 0.9);
		maxy = Math.round(maxy * 1.1);
		/* prevents output errors when all values are the same */
		if (miny == maxy && maxy !== 0)
		{
			miny = miny - 2;
			if (miny < 0) {
				miny = 0;
			}
		}
		else if (miny == maxy && maxy === 0)
		{
			maxy = 10;
		}
		if (maxy == 1) {
			maxy = 2;
		}

		/* draw the spark lines */
		for(var i = 1; i < pairedValueDateArray.length; i++)
		{
			graphic.drawLine(graphic.scaleX(i-1, maxx),graphic.scaleY(pairedValueDateArray[i-1][0], maxy, miny),graphic.scaleX(i, maxx),graphic.scaleY(pairedValueDateArray[i][0], maxy, miny), "#000000");
			graphic.drawLine(graphic.scaleX(i-1, maxx),graphic.scaleY(pairedValueDateArray[i-1][1], maxy, miny),graphic.scaleX(i, maxx),graphic.scaleY(pairedValueDateArray[i][1], maxy, miny), "#c0c0c0");
		}
		
		var lastx = maxx;
		if (pairedValueDateArray.length == 1) {
			lastx = 1;
		}
		
		graphic.drawCircle(graphic.scaleX(lastx, maxx),graphic.scaleY(pairedValueDateArray[pairedValueDateArray.length - 1][0], maxy, miny),2, "#000000", "#000000" );
		graphic.drawCircle(graphic.scaleX(lastx, maxx),graphic.scaleY(pairedValueDateArray[pairedValueDateArray.length - 1][1], maxy, miny),2, "#c0c0c0", "#c0c0c0" );

		graphic.outputGraphics(1);
		graphic.divObj.style.display = "";

	}
}