/*
 * Project: mp_discharge_dashboard.js
 * Version 1.0.0
 * Released 10/5/2010
 * @author Megha Rao (MR018925)
 * @author Randy Rogers (RR4690)
 * @author Michael Smith(MS010922)
*/

//global mpage object to store values used in subroutines
var mpObj = {
userId : "",
appName : "",
expClicks: 0,
ipath : "",
sortType : 0,
dischName: "",
sortOrder : 0,
prefs:"",
catMean: ""
};

//var prsnlId = "1764163.0"
var activeList = [];

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
                alert("Problem retrieving data");
            }
        }
    }
}

function WriteToFile(sText) {
  try {
	var ForAppending = 8;
	var TriStateFalse = 0;
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var newFile = fso.OpenTextFile("c:\\temp\\test.txt",ForAppending, true, TriStateFalse);
	newFile.write(sText);
	newFile.close();
  }
 catch(err){
   var strErr = 'Error:';
   strErr += '\nNumber:' + err.number;
   strErr += '\nDescription:' + err.description;
   document.write(strErr);
  }
}

//init function onload
window.onload = function() {
mpObj.ipath = _g('file_path').firstChild.data;
mpObj.userId = _g("user_id").firstChild.data;
mpObj.catMean = _g("cat_mean").firstChild.data;
// Load Patient Lists
//var ptlParams = "^MINE^,"+prsnlId;
var ptlParams = "^MINE^, value($USR_Personid$)";
load("mp_drd_patient_list", ptlLoad, ptlParams);
};  //end init section


function ptlLoad (xhr){
	var ptlData = xhr;
	var jsonEval = JSON.parse(ptlData);
	var jsonObj = jsonEval.RECORD_DATA;
	var jsStatus = jsonObj.STATUS_DATA.STATUS;
	var patLists = _g("patLists");
	
	if (jsStatus == "Z") {
		patLists.options[0] = new Option("No Lists Defined", 0);
	}
	else if (jsStatus == "S") {
		var ptlObj = jsonObj.QUAL;
		var ptlLists = [];
		for (var i=0; i<ptlObj.length; i++){
			var ptlItem = ptlObj[i];
			var ptlList = {
				NAME : ptlItem.NAME,
				ID : ptlItem.PATIENT_LIST_ID
			};
			ptlLists.push(ptlList);
		}

		for (var i=0; i<ptlObj.length; i++) {
			var ptlItem = ptlLists[i];
			patLists.options[i] = new Option(ptlItem.NAME, ptlItem.ID);
		}
		loadPatientList();
		Util.addEvent(patLists, "change", loadPatientList);
	}
	else {
		patLists.options[0] = new Option("Error Retrieving Data", 0);
	}
}

function loadPatientList (){
	var patSec = _g("pat");
	patSec.innerHTML = "<span class='pat-txt'>Loading...</span>";
	var patLists = _g("patLists");
	
	patLists.onchange = function(){
		window.name = patLists.options[patLists.options.selectedIndex].value;	
	}

	var listID = 0;
	if (window.name.length > 0)
	{
		listID = window.name;
		for (var i=0; i<patLists.options.length; i++) {
			if (patLists.options[i].value == window.name)
			{
				patLists.options[i].selected = true;
			}
		}
	}
	else
	{
		listID = patLists.options[patLists.options.selectedIndex].value;
		window.name = listID;
	}
	
	var params = "^MINE^, value($USR_Personid$)," +listID+",^"+mpObj.catMean+"^";
	
	load("mp_drd_avail_patient_list", loadPatients, params);
}

function loadPatients(xhr){
    activeList = [];
    var patData = xhr;
    var jsonEval = JSON.parse(patData);
    var jsonObj = jsonEval.RECORD_DATA;
    var jsStatus = jsonObj.STATUS_DATA.STATUS;
    var jsPatHTML = [];
    var patHTML = "";
    var patLen = 0, statLen = 0;
    var patSec = _g("pat");
    // if "S"
    var patObj = jsonObj.PATIENTS;
    patLen = patObj.length;
    if (patLen == 0) {
        patHTML = "<span class='pat-txt'>No patients on selected patient list.</span>";
    }
    else {
		var patHdrItem = patObj [0];
		var widthClass = 0;
        var nmWidthCls = 30 / 2;
        var losWidthCls = 30 / 4;
        var dcWidthCls = 30 / 4;
	
        var patHdrAr = ["<div class='pat-sec'><div class ='table-hdr'><table class='pat-table'><tr class='pat-table-hdr'><td class='pat-col-hdr' style='width: " + nmWidthCls + "%'><span onclick='javascript:sortPatients(this,0,1)'>Patient Name</span></td><td class='pat-col-hdr' style='width: " + losWidthCls + "%'><span onclick='javascript:sortPatients(this,1, 2)'>Length of stay<br/>(DD:HH:MM)</span></td><td class='pat-col-hdr' style='width: " + dcWidthCls + "%;border-right:#E6E8F1 3px solid;'><span onclick='javascript:sortPatients(this,2,3)'>Estimated Discharge Date</span></td>"];
		// populate header and output it
		var cnt = 2;
		var statLen = patHdrItem.SECTIONS.length - 1    //excluding  readiness component
		if (statLen >0){
		 widthClass = 69.5 / (statLen);
		}
		else if (statLen <= 0){		// if statLen  = 0, only reaadiness component is selected in bedrock, and if statLen < 0, it should be -1 meaning no component is selected and we have to display only Name, LOS and est d/c dt
			 widthClass = 69.5 / 1;		
			}
		

	   	for (var s= 0; s < patHdrItem.SECTIONS.length; s++) {
			patHdrItem.SECTIONS.length
			var statHdrItem =  patHdrItem.SECTIONS[s];
			if ("mp_dc_order|mp_dc_diagnosis|mp_dc_pat_ed|mp_dc_followup|mp_dc_med_rec|mp_dc_clin_doc|mp_dc_activities|mp_dc_order|mp_dc_social|mp_dc_results|mp_dc_care_mgmt|mp_dc_qm|mp_dc_v4_order|mp_dc_v4_diagnosis|mp_dc_v4_pat_ed|mp_dc_v4_followup|mp_dc_v4_med_rec|mp_dc_v4_clin_doc|mp_dc_v4_activities|mp_dc_v4_order|mp_dc_v4_social|mp_dc_v4_results|mp_dc_v4_care_mgmt|mp_dc_v4_qm".indexOf(statHdrItem.NAME) >= 0) {   
				cnt = cnt+1;
				patHdrAr.push("<td class='pat-col-hdr' style= 'width: " + widthClass + "%'><span onclick='javascript:sortPatients(this,",cnt,",\""+statHdrItem.NAME +"\")'>" + statHdrItem.LABEL + "</span></td>");
			}
		}
	   	 patHdrAr.push("</tr></table></div><div id='patContent'></div>")
   		 var  patHdrHTML = patHdrAr.join("");
  		 patSec.innerHTML = patHdrHTML;
		 
	    for (var i = 0; i < patLen; i++) {
            var patItem = patObj[i];
            var statObj = patItem.SECTIONS;
            var statLen = statObj.length;
            var dxSeq, resSeq, fuSeq,medSeq, docSeq, socSeq,actSeq, cmSeq,pedSeq, ordSeq, qmSeq;
           	var patId = patItem.PERSON_ID;
            var encId = patItem.ENCNTR_ID;
            var sHov = "";
		  	sHov="<div class='hvr'><dl><dt><span>Name:</span></dt><dd><span>"+patItem.PERSON_NAME
			+"</span><dd><dt><span>MRN:</span></dt><dd><span>"+patItem.MRN+"</span><dd> <dt><span>DOB</span></dt><dd><span>"+fmtDt(patItem.DOB, "shortDate2")
			+"</span><dd><dt><span>Location:</span></dt><dd><span>"+patItem.NU_ROOM_BED+"</span><dd></dl></div>"
			var estDcdt = "";
			if (patItem.EST_DC != "") {
				estDcdt = fmtDt(patItem.EST_DC, "shortDate2")
			}
			else
			estDcdt = "--"
            //populate the patient demographic headerresult row for each patient in dashboard.
            var tabName = "Discharge Summary";
            var params = "/PERSONID=" + patId + " /ENCNTRID=" + encId + " /FIRSTTAB=^" + tabName + "^";
            var patDataRows = ["<tr class ='test'><td class='pat-name' style='width: " + nmWidthCls + "%'><dl class='pat-info'><dt><span>Name</span></dt><dd><span><a class= 'pat-link' href='javascript:APPLINK(0,\"powerchart.exe\",\"" + params + "\");'>"
							  , patItem.PERSON_NAME, "</a></span><br/><span class='within'>", patItem.GENDER_AGE
							  , "</span><br/><span class='within'>", patItem.ROOM_BED, "</span></dd></dl><h4 class='pat-det-hd'><span>Patient Info</span></h4>",sHov,"</td><td class='pat-col-hdr' style='width: " + losWidthCls + "%'><span>", patItem.LOS
								, "</span></td><td class='pat-col-hdr' style='width: " + dcWidthCls + "%; border-right:#E6E8F1 3px solid;'><span>", estDcdt, "</span></td>"]

            for (var j = 0; j < statLen; j++) {
                var statItem = statObj[j];
                switch (statItem.NAME) {
						case "mp_dc_diagnosis":
							dxSeq	=	statItem.STATUS_FLAG_SEQ;
							break;
						case "mp_dc_followup":
							fuSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_pat_ed":
							pedSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_med_rec":
							medSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_order":
							ordSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_clin_doc":
							docSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_activities":
							actSeq =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_care_mgmt":
							cmSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_social":
							socSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_results":
							resSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_qm":
							qmSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_v4_diagnosis":
							dxSeq	=	statItem.STATUS_FLAG_SEQ;
							break;
						case "mp_dc_v4_followup":
							fuSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_v4_pat_ed":
							pedSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_v4_med_rec":
							medSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_v4_order":
							ordSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_v4_clin_doc":
							docSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_v4_activities":
							actSeq =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_v4_care_mgmt":
							cmSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_v4_social":
							socSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_v4_results":
							resSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;
						case "mp_dc_v4_qm":
							qmSeq	  =	statItem.STATUS_FLAG_SEQ ;
							break;		
					}
                              
                //populate the 	data rows for each section in dashboard.	
                if ("mp_dc_order|mp_dc_diagnosis|mp_dc_pat_ed|mp_dc_followup|mp_dc_med_rec|mp_dc_clin_doc|mp_dc_activities|mp_dc_order|mp_dc_social|mp_dc_results|mp_dc_care_mgmt|mp_dc_qm|mp_dc_v4_order|mp_dc_v4_diagnosis|mp_dc_v4_pat_ed|mp_dc_v4_followup|mp_dc_v4_med_rec|mp_dc_v4_clin_doc|mp_dc_v4_activities|mp_dc_v4_order|mp_dc_v4_social|mp_dc_v4_results|mp_dc_v4_care_mgmt|mp_dc_v4_qm".indexOf(statItem.NAME) >= 0) { 
                   patDataRows.push("<td class='pat-col-hdr' style='width: " + widthClass + "%'><span>", getDischargeStatus(statItem.NAME, statItem.STATUS_FLAG), "</span></td>");
                }
            }
            patDataRows.push("</tr>")
		//	var  patHdrHTML = patHdrAr.join("");
			var patDataHTML = patDataRows.join("");
		//	WriteToFile(patDataRows)
			var thisPatArr = [];
            var thisPatHTML = "";   			
			thisPatArr.push(patDataHTML);
			thisPatHTML = thisPatArr.join("");
			//WriteToFile(thisPatHTML)
			
            var thisPat = {
                NAME: patItem.PERSON_NAME,
                LOS: patItem.LOS_SEQ,
                DISCHARGE_DATE: patItem.EST_DC,
                DX_STATUS_FLAG: dxSeq,
                RES_STATUS_FLAG: resSeq,
                SOC_STATUS_FLAG: socSeq,
                DOC_STATUS_FLAG: docSeq,
                CM_STATUS_FLAG : cmSeq,
                ACT_STATUS_FLAG: actSeq,
                MED_STATUS_FLAG: medSeq,
                PED_STATUS_FLAG: pedSeq,
                FU_STATUS_FLAG: fuSeq,
                ORD_STATUS_FLAG: ordSeq,
				QM_STATUS_FLAG: qmSeq,
                HTML: thisPatHTML
            };
            
            activeList.push(thisPat);  
        }
    }
    mpObj.sortType = 0;
    mpObj.sortOrder = 0;
    sortPatients(0,0,0);  
}

function sortPatients(spn,colNum, typ) {
	if (typ != 0) {
		var spnPar = Util.gp(Util.gp(spn));
		var tdAr = Util.Style.g("pat-col-hdr", spnPar, "TD")
		for (var t = 0; t < tdAr.length; t++) {
			var td = tdAr[t];
			if (t == colNum) {
				if (!Util.Style.ccss(td, "uline")) 
					Util.Style.acss(td, "uline");
			}
			else {
				if (Util.Style.ccss(td, "uline")) 
					Util.Style.rcss(td, "uline");
			}
		}
	}
	var sortOrd = 0;
	if (typ == mpObj.sortType) {
		sortOrd = (mpObj.sortOrder + 1) % 2;
		mpObj.sortOrder = sortOrd;
	}
	else if (typ == 0) {
		sortOrd = 1;
		mpObj.sortOrder = 1;
	}
	mpObj.sortOrder = sortOrd;
	mpObj.sortType = typ;
	switch (typ) {
		case 1:  // Name
			function sortByName(a, b) {
				var sortRes = 0;
				if (a.NAME.toUpperCase() < b.NAME.toUpperCase()) {
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
			activeList.sort(sortByName);
			break;
		case 2:  // Length of stay sort
			function sortByLos(a, b) {
				var sortRes = 0;
				if (a.LOS < b.LOS) {
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
			activeList.sort(sortByLos);
			break;
		
		case 3:  
			function sortByDiscDt(a, b){
					var sortRes = 0;
					if (a.DISCHARGE_DATE < b.DISCHARGE_DATE) {
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
				activeList.sort(sortByDiscDt);
			break;	
	
		case "mp_dc_order":  
			function sortByOrderStatus(a, b){
					var sortRes = 0;
					if (a.ORD_STATUS_FLAG < b.ORD_STATUS_FLAG) {
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
				activeList.sort(sortByOrderStatus);
			break;	
			
			
			
		case "mp_dc_diagnosis":  
			function sortByDxStatus(a, b){
					var sortRes = 0;
					if (a.DX_STATUS_FLAG < b.DX_STATUS_FLAG) {
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
				activeList.sort(sortByDxStatus);
			break;	
			
			
			
		case "mp_dc_pat_ed":  
			function sortByPatEdStatus(a, b){
					var sortRes = 0;
					if (a.PED_STATUS_FLAG < b.PED_STATUS_FLAG) {
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
				activeList.sort(sortByPatEdStatus);
			break;	
			
			
			
		case "mp_dc_followup":  
			function sortByFuStatus(a, b){
					var sortRes = 0;
					if (a.FU_STATUS_FLAG < b.FU_STATUS_FLAG) {
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
				activeList.sort(sortByFuStatus);
			break;	
			
			
		case "mp_dc_med_rec":  
			function sortByMedStatus(a, b){
					var sortRes = 0;
					if (a.MED_STATUS_FLAG <= b.MED_STATUS_FLAG) {
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
				activeList.sort(sortByMedStatus);
			break;	

		case "mp_dc_clin_doc":  
			function sortByDocStatus(a, b){
					var sortRes = 0;
					if (a.DOC_STATUS_FLAG < b.DOC_STATUS_FLAG) {
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
				activeList.sort(sortByDocStatus);
			break;	
			
			
		case "mp_dc_activities":  
			function sortByActivitiesStatus(a, b){
					var sortRes = 0;
					if (a.ACT_STATUS_FLAG < b.ACT_STATUS_FLAG) {
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
				activeList.sort(sortByActivitiesStatus);
			break;		
			
		case "mp_dc_social":  
			function sortBySocialStatus(a, b){
					var sortRes = 0;
					if (a.SOC_STATUS_FLAG < b.SOC_STATUS_FLAG) {
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
				activeList.sort(sortBySocialStatus);
			break;	
		
		case "mp_dc_care_mgmt":  
			function sortByCareMgmtStatus(a, b){
					var sortRes = 0;
					if (a.CM_STATUS_FLAG < b.CM_STATUS_FLAG) {
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
				activeList.sort(sortByCareMgmtStatus);
			break;		
		
		case "mp_dc_results":  
			function sortByResults(a, b){
					var sortRes = 0;
					if (a.RES_STATUS_FLAG < b.RES_STATUS_FLAG) {
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
				activeList.sort(sortByResults);
			break;	
		case "mp_dc_qm":  
			function sortByQM(a, b){
					var sortRes = 0;
				//	alert(a.QM_STATUS_FLAG +"--"+ b.QM_STATUS_FLAG)
					if (a.QM_STATUS_FLAG <= b.QM_STATUS_FLAG) {
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
				activeList.sort(sortByQM);
			break;				
		
		case "mp_dc_v4_order":  
			function sortByOrderStatus(a, b){
					var sortRes = 0;
					if (a.ORD_STATUS_FLAG < b.ORD_STATUS_FLAG) {
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
				activeList.sort(sortByOrderStatus);
			break;	
			
			
			
		case "mp_dc_v4_diagnosis":  
			function sortByDxStatus(a, b){
					var sortRes = 0;
					if (a.DX_STATUS_FLAG < b.DX_STATUS_FLAG) {
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
				activeList.sort(sortByDxStatus);
			break;	
			
			
			
		case "mp_dc_v4_pat_ed":  
			function sortByPatEdStatus(a, b){
					var sortRes = 0;
					if (a.PED_STATUS_FLAG < b.PED_STATUS_FLAG) {
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
				activeList.sort(sortByPatEdStatus);
			break;	
			
			
			
		case "mp_dc_v4_followup":  
			function sortByFuStatus(a, b){
					var sortRes = 0;
					if (a.FU_STATUS_FLAG < b.FU_STATUS_FLAG) {
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
				activeList.sort(sortByFuStatus);
			break;	
			
			
		case "mp_dc_v4_med_rec":  
			function sortByMedStatus(a, b){
					var sortRes = 0;
					if (a.MED_STATUS_FLAG <= b.MED_STATUS_FLAG) {
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
				activeList.sort(sortByMedStatus);
			break;	

		case "mp_dc_v4_clin_doc":  
			function sortByDocStatus(a, b){
					var sortRes = 0;
					if (a.DOC_STATUS_FLAG < b.DOC_STATUS_FLAG) {
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
				activeList.sort(sortByDocStatus);
			break;	
			
			
		case "mp_dc_v4_activities":  
			function sortByActivitiesStatus(a, b){
					var sortRes = 0;
					if (a.ACT_STATUS_FLAG < b.ACT_STATUS_FLAG) {
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
				activeList.sort(sortByActivitiesStatus);
			break;		
			
		case "mp_dc_v4_social":  
			function sortBySocialStatus(a, b){
					var sortRes = 0;
					if (a.SOC_STATUS_FLAG < b.SOC_STATUS_FLAG) {
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
				activeList.sort(sortBySocialStatus);
			break;	
		
		case "mp_dc_v4_care_mgmt":  
			function sortByCareMgmtStatus(a, b){
					var sortRes = 0;
					if (a.CM_STATUS_FLAG < b.CM_STATUS_FLAG) {
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
				activeList.sort(sortByCareMgmtStatus);
			break;		
		
		case "mp_dc_v4_results":  
			function sortByResults(a, b){
					var sortRes = 0;
					if (a.RES_STATUS_FLAG < b.RES_STATUS_FLAG) {
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
				activeList.sort(sortByResults);
			break;	
		case "mp_dc_v4_qm":  
			function sortByQM(a, b){
					var sortRes = 0;
				//	alert(a.QM_STATUS_FLAG +"--"+ b.QM_STATUS_FLAG)
					if (a.QM_STATUS_FLAG <= b.QM_STATUS_FLAG) {
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
				activeList.sort(sortByQM);
			break;
	}
	var totalHeight=(document.documentElement.clientHeight) - 165 + 'px' ;
	var jsActivePats = ["<div style='position:relative; height:"+totalHeight+";  overflow-y:scroll; overflow-x:hidden; border:#F6F6F6 2px solid'><table class='pat-table1'>"];
	var activePats = "";
	for (var i=activeList.length; i--;) {
		jsActivePats.push(activeList[i].HTML);
	}
	jsActivePats.push ("</table></div></div>")
	activePats = jsActivePats.join("");
	
	var patContent = _g("patContent")
	if (patContent == null) {
		var patSec = _g("pat");
		patSec.innerHTML = "No patients in the list"
	}
	else {
		patContent.innerHTML = activePats;
		secInit("pat", patContent);
		makePretty();
	}

}


function makePretty(){
    var tRAr = Util.Style.g("test", document, "TR")
    for (var t = 0; t < tRAr.length; t++) {
        var tr = tRAr[t];
        if (t % 2) {
            Util.Style.rcss(tr, "test");
            Util.Style.acss(tr, "even");
        }
        else {
            Util.Style.rcss(tr, "test");
            Util.Style.acss(tr, "odd");
        }
    }
}

function getDischargeStatus (statName,flg ){
	var default_ntStarted = mpObj.ipath + "\\images\\5970_16.gif";
    var defimgLnk = "<img title='Not Started' src='" + default_ntStarted + "' />";
    var statusIcon = defimgLnk;
	if("mp_dc_results|mp_dc_v4_results".indexOf(statName) >= 0)
	{
		statusIcon = getResultStatus(flg)
	}
	else{
		statusIcon = getStatus(flg);
	}
	
	return statusIcon;
	
}

function getStatus(flg){	
	var stat =flg; 
	var comp = mpObj.ipath + "\\images\\3918_16.gif";
	var ntStarted = mpObj.ipath + "\\images\\5970_16.gif";
	var inProg = mpObj.ipath + "\\images\\5971_16.gif";
	var  imgLnk = "";
	if (stat == 0 ||stat==3){
		imgLnk ="<img title='Not Started' src='" + ntStarted + "' />"
		return imgLnk;	
	}
	else if (stat==1 ||stat==4){
		imgLnk ="<img title='Completed' src='" + comp + "' />"
		return imgLnk;	
	}
	else if (stat ==2 || stat==5){
		imgLnk ="<img title='In Progress' src='" + inProg + "' />"
		return imgLnk;	
	}
	else{
		imgLnk ="<img title='Not Started' src='" + ntStarted + "' />"
		}
	return imgLnk;	
	
}

function getResultStatus(stat) {
	var comp = mpObj.ipath + "\\images\\5278.gif";
	var crit = mpObj.ipath + "\\images\\6272_16.gif";
	var  imgLnk = "";
	if (stat == 3) {   //no result
		imgLnk = "--"
		return imgLnk;
	}
	else if (stat == 4) { //result
			imgLnk = "<img title='Completed' src='" + comp + "' />"
			return imgLnk;
		}
		
	else if (stat == 5) {  //crit result
			imgLnk = "<img title='Critical' src='" + crit + "' />"
				return imgLnk;
			}
			
	else  {
				imgLnk = "--"
				return imgLnk;
			}
}

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

function secInit(pre, par) {
    gen = Util.Style.g(pre + "-info")
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


