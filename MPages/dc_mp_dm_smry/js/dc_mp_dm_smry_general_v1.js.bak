var nGluPage = 1;
var nGluMax  = 0;
var gMaxPage = 1;
var nLabPage = 1;
var nLabMax  = 0;
var lMaxPage = 1;

// Graph Variables
var JGraphdata = new Array();
var JGraphdata2 = new Array();
var JGraphdata3 = new Array();
var JGraphdata4 = new Array();
var JGraphhoverdata = new Array();
var JGraphhoverdata2 = new Array();
var JGraphhoverdata3 = new Array();
var JGraphhoverdata4 = new Array();
var JGraphlabels;
var JGraphlabelsfull;
var JGraphUnits;
var JGraphVal;
var curr_width ;
var interval_length= 1000*60*60*4;
var tot_insunits = 0;

var person_id;
var encounter_id;
var user_id;
var rootpath;
var imagepath = "..\\img\\";

// Lab Results
var testarray = new Array();
var cur_hours = 0;
var cur_starttm ;
var cur_stoptm	;
var pocInd = false;
var glfInd = false;
var glrInd = false;
var drpInd = false;
var hoverPopupDOM = document.createElement("div");
hoverPopupDOM.className = "popup_hover";
// Pop Up Window
var p = window.createPopup();
var pbody = p.document.body;

function ShowHide(id){
	try{
		var sp_id = "sp_"+String(id);
		var spDOM = document.getElementById(sp_id);
		var s_id = "hdr_"+String(id);
		var hdrDOM = document.getElementById(s_id);
		var chkDOM = document.getElementById("spGrChks");
		var spcanvas = document.getElementById("spCanvas")
		var gluCanvas = document.getElementById("gluCanvas")
		var spGlucRslts = document.getElementById("spGlucRslts")
		if (spDOM.style.display == ''){
			hdrDOM.innerHTML = "+&nbsp&nbsp";
			spDOM.style.display = 'none';
			hdrDOM.title = "Click to expand";
			if (id=='8' && chkDOM){
					chkDOM.style.visibility = "hidden";
			}		
		}
		else{
			spDOM.style.display = '';
			hdrDOM.innerHTML = "-&nbsp&nbsp";
			hdrDOM.title = "Click to collapse";
			if (id== '8' && chkDOM){
				chkDOM.style.visibility = 'visible';
				fillGraph(json_data_poc);
			}
		}
	}
	catch(e){
        errmsg(e.message, "ShowHide()");	
	}
}


function buildChartLink(name,pid,eid,tab,title){
    var alink = 'javascript:APPLINK(0,"powerchart.exe","/PERSONID='+pid+' /ENCNTRID='+eid+' /FIRSTTAB='+tab+'");';
    return ("&nbsp;&nbsp;<a title='"+title+"' href='"+alink+"'>"+name+"</a>");
}

/***** Load functions ***/
window.onload = function (){
	unloadParams();
	//img_loader = "<img id='img-load-initial' src='..\\img\\ajax-loader.gif' class='img-abs-center'></img>";
	json_handler = new UtilJsonXml();
	json_handler.debug_mode_ind = parseInt(debug_mode_ind);
	var cclParam = "'MINE','DMPAGE'";	
	json_handler.ajax_request({request:{type:"XMLCCLREQUEST",target:'DC_MP_DM_PAGE',parameters:cclParam},response:{type:"JSON",target:loadCompDetails}})
		
};

function loadCompDetails(Obj){
	try{
		json_data_comps = Obj.response.DM_COMP;
	 	json_data_comps.COMPONENTS.sort(function(a,b){return sortbyseq("CSEQNBR",a,b)})
		for(var i = 0; i < json_data_comps.COMPONENTS.length; i++){
			switch(json_data_comps.COMPONENTS[i].CSECT){
				case "ADMEDS":  admeds_comp = json_data_comps.COMPONENTS[i];
								move_component(document.getElementById("comp_1"),json_data_comps.COMPONENTS[i].CSEQNBR);
								break;
				case "AMMEDS":  ammeds_comp = json_data_comps.COMPONENTS[i];
								move_component(document.getElementById("comp_2"),json_data_comps.COMPONENTS[i].CSEQNBR);
								break;
				case "DMMISC":  diabmgmt_comp = json_data_comps.COMPONENTS[i];
								move_component(document.getElementById("comp_3"),json_data_comps.COMPONENTS[i].CSEQNBR);
								break;
				case "ADVSR":  	advsr_comp = json_data_comps.COMPONENTS[i];
								move_component(document.getElementById("comp_4"),json_data_comps.COMPONENTS[i].CSEQNBR);
								break;
				case "LABS":  	labs_comp = json_data_comps.COMPONENTS[i];
								move_component(document.getElementById("comp_5"),json_data_comps.COMPONENTS[i].CSEQNBR);
								break;
				case "DIET":  	diets_comp = json_data_comps.COMPONENTS[i];
								move_component(document.getElementById("comp_6"),json_data_comps.COMPONENTS[i].CSEQNBR);
								break;
				case "INS24":  	insulin_comp = json_data_comps.COMPONENTS[i];
								move_component(document.getElementById("comp_7"),json_data_comps.COMPONENTS[i].CSEQNBR);
								break;
				case "GLUGRAPH":  graph_comp = json_data_comps.COMPONENTS[i];
							//	move_component(document.getElementById("comp_8"),json_data_comps.COMPONENTS[i].CSEQNBR);
								break;		
			}		
		}
		var cclParam = "'MINE'" + ",^{\"DEMO_REQUEST\":{\"PTCNT\":1,\"PTS\":[{\"PERSON_ID\":" + parseInt(person_id) + ".0,\"ENCNTR_ID\":" + parseInt(encounter_id)+".0}]}}^";
        json_handler.ajax_request({
            request: {
                type: "XMLCCLREQUEST",
                target: 'DC_MP_DM_PT_DEMO',
                parameters: cclParam
            },
            response: {
                type: "JSON",
                target: fillPatientDemographics,
                parameters: ""
            }
        });
		cclParam = "'MINE'" + "," + person_id+ "," + encounter_id;		
		json_handler.ajax_request({request:{type:"XMLCCLREQUEST",target:'DC_MP_DM_MEDS',parameters:cclParam},response:{type:"JSON",target:fillMEDSlist}})
		json_handler.ajax_request({request:{type:"XMLCCLREQUEST",target:'DC_MP_DM_MISC',parameters:cclParam},response:{type:"JSON",target:fillDMlist}})
		json_handler.ajax_request({request:{type:"XMLCCLREQUEST",target:'DC_MP_DM_LABS',parameters:cclParam},response:{type:"JSON",target:fillLabList}})
		json_handler.ajax_request({request:{type:"XMLCCLREQUEST",target:'DC_MP_DM_DIETS',parameters:cclParam},response:{type:"JSON",target:fillDietList}})
		json_handler.ajax_request({request:{type:"XMLCCLREQUEST",target:'DC_MP_DM_BGPOC',parameters:cclParam},response:{type:"JSON",target:fillGraphWrapper}})
		json_handler.ajax_request({request:{type:"XMLCCLREQUEST",target:'DC_MP_DM_DRIP',parameters:cclParam},response:{type:"JSON",target:fillGraphWrapper}})
			
	}
	catch(e){
        errmsg(e.message, "loadCompDetails()")
	}
};

function move_component(dom_comp_el,nbr_seq){
	try{
	   var dom_parent_el = dom_comp_el.parentNode;
	   dom_comp_el = dom_parent_el.removeChild(dom_comp_el);
		if(nbr_seq >= 1){
			if(nbr_seq > 6){
				if(nbr_seq > 12){ 
					document.getElementById("sectionThree").appendChild(dom_comp_el);
				}
				else{
					document.getElementById("sectionTwo").appendChild(dom_comp_el);
				}
			}
			else{
				document.getElementById("sectionOne").appendChild(dom_comp_el);
			}
		}
	}
	catch(e){
        errmsg(e.message, "move_component()")
	}
}

function sortbyseq(seq,a,b){
	return ((a[seq] < b[seq]) ? -1 : ((a[seq] > b[seq]) ? 1 : 0));
}

function unloadParams(){
	 try {
		var cur_params = window.location.search.replace(/%20/g, " ").split("?").join("").split(",");
		user_id = cur_params[1];
		person_id = cur_params[2];
		encounter_id = cur_params[3];
		if(cur_params[4]){
			debug_mode_ind = cur_params[4]; 
		}
	} 
    catch (e) {
        errmsg(e.message, "unloadParams()")
    }
}
/************/

/***** Error handling functions ***/
function errmsg(msg, det){
    alert(msg + "--" + det)
}
/************/
    function fillPatientDemographics (jsonData){
        try {
        	var  contentHTML = ""
				,dobAge = new Date()//shortDate2
				,demoJson = jsonData.response.DEMO_REPLY
				,demoHTML;
				dobAge.setISO8601(demoJson.PTS[0].DOB); 
				demoHTML = ['<dl class="dmg-info"><dt class="dmg-pt-name-lbl"><span>Patient Name:</span></dt><dd class="dmg-pt-name"><span>',
					demoJson.PTS[0].NAME > "" ? demoJson.PTS[0].NAME : "", '</span></dd><dt class="dmg-sex-age-lbl"><span>Sex, Age:</span></dt><dd class="dmg-sex-age"><span>',
					demoJson.PTS[0].GENDER > "" ? demoJson.PTS[0].GENDER : "", ", ", 
					demoJson.PTS[0].AGE > "" ? demoJson.PTS[0].AGE : "", '</span></dd><dt><span>DOB:</span></dt><dd class="dmg-dob"><span>',
					demoJson.PTS[0].DOB > "" ? dobAge.format("shortDate2"): "", '</span></dd><dt><span>MRN:</span></dt><dd class="dmg-mrn"><span>',
					demoJson.PTS[0].MRN > "" ? demoJson.PTS[0].MRN : "", '</span></dd><dt><span>FIN:</span></dt><dd class="dmg-fin"><span>',
					demoJson.PTS[0].FIN > "" ? demoJson.PTS[0].FIN : "", '</span></dd><dt><span>Visit Reason:</span></dt><dd class="dmg-rfv"><span>',
					demoJson.PTS[0].ADMIT_REASON > "" ? demoJson.PTS[0].ADMIT_REASON : "", '</span></dd></dl><span class="disclaimer">This page is not a complete source of visit information.</span>'];
				contentHTML = "<span>"+demoHTML.join('')+"</span>";
				document.getElementById("bannerBar").innerHTML = contentHTML;
		} 
        catch (e) {
            errmsg(e.message, "fillPatientDemographics()"); 
        }
    }


/********* Anti-Diabetic Medications and Active Medications ***********/
function fillMEDSlist(json_data){
	try{
		json_data_meds = json_data.response;
		fillADMlist(json_data_meds.DM_MEDS.ANTI_DIAB_MEDS);
		fillAMlist(json_data_meds.DM_MEDS.ACTIVE_MEDS);
	}
	catch(e){
        errmsg(e.message, "fillMEDSlist()")
	}
}

function fillADMlist(ADMObj){
	try{
		var spADMList = document.getElementById("spADMList");
		var ahover;
		if(admeds_comp.CFLAG >= 0){
			var dBody =  '<span><table  class="sec-hd">'
			dBody += '<tbody>'
			dBody += '<tr>'
			dBody += '<td class="sec-hd-title">'
			dBody +=  buildChartLink(admeds_comp.CLBL,person_id,encounter_id,admeds_comp.CLINK,"See "+admeds_comp.CLINK)
			dBody += '</td>'					
			dBody += '<td class="sec-hd-collapse" id="hdr_1" title="Click to collapse" onclick="ShowHide(\'1\');">-&nbsp&nbsp</td>'
			dBody += '<tr>'
			dBody += '</tbody>'
			dBody += '</table></span><span id="sp_1">'  
			
			if (ADMObj.length > 0){
				for (var i=0;i<ADMObj.length;i++){
				ahover = 'onmousemove="showHover(\'<span class=hoverlabel> Order Date/Time: </span>'+ADMObj[i].SORDERDTTM+'\')" onmouseout="hideHover()"';
	
					dBody	+= '<h3 class="adm-med"><span>'+ADMObj[i].DISPLAY+'</span></h3>'
							+   '<dl class="adm-detail">'
								+ '<dt class="adm-md-name"><span>Medication Name</span></dt>'
								+ '<dd class="adm-md-name"><span>'+ADMObj[i].DISPLAY+'</span></dd>'
								+ '<dt class="adm-md-sig"><span><abbr title="Signature Line">Sig. Line</abbr></span></dt>'
								+ '<dd class="adm-md-sig"'+ahover+'><span>'+ADMObj[i].DETAILS+'</span></dd>'
							+ '</dl>';
				}
			}
			else{
				dBody	+= '<h3 class="adm-med"><span></span></h3>'
							+   '<dl class="adm-detail">'
								+ '<dt class="adm-md-name"><span>Medication Name</span></dt>'
								+ '<dd class="adm-md-name nf"><span>No orders found.</span></dd>'
							+ '</dl>';
			}
			spADMList.innerHTML = dBody+'</span>';
			if(admeds_comp.CFLAG == 0)
				document.getElementById("hdr_1").onclick();
		}
		else{
			spADMList.offsetParent.style.display = "none";
		}
	}
	catch(e){
			errmsg(e.message, "fillADMlist()");	
	}	
}

function fillAMlist(AMObj){
	try{
		var spAMList = document.getElementById("spAMList");
		if(ammeds_comp.CFLAG >= 0){
			var bNone = true;
			var hypo_less_ind = 0;
			var hypo_more_ind = 0;
			var hyper_less_ind = 0;
			var hyper_more_ind = 0;
			var dBody =  '<span><table  class="sec-hd">'
			dBody += '<tbody>'
			dBody += '<tr>'
			dBody += '<td class="sec-hd-title">'
			dBody +=  buildChartLink(ammeds_comp.CLBL,person_id,encounter_id,ammeds_comp.CLINK,"See "+ammeds_comp.CLINK)
			dBody += '</td>'					
			dBody += '<td class="sec-hd-collapse" id="hdr_2" title="Click to collapse" onclick="ShowHide(\'2\');">-&nbsp&nbsp</td>'
			dBody += '<tr>'
			dBody += '</tbody>'
			dBody += '</table></span><span id="sp_2">' 
		//	AMObj.sort(function(a,b){return sortbyname("CSFLAG",a,b);})
			SortIt(AMObj,1,"CSFLAG")
			for (var i=0;i<AMObj.length;i++){
				bNone = false;
				switch(AMObj[i].CSFLAG){
					case "hypo_less": if(hypo_less_ind == 0){
										dBody	+= '<h3><b>Active Medications Less Likely to Cause Hypoglycemia</b></h3>';
										hypo_less_ind = 1;
									}	
									 break;
					case "hypo_more": if(hypo_more_ind == 0){
										dBody	+= '<h3><b>Active Medications More Likely to Cause Hypoglycemia</b></h3>';
										hypo_more_ind = 1;
									}	
									 break;
					case "hyper_less": if(hyper_less_ind == 0){
										dBody	+= '<h3><b>Active Medications Less Likely to Cause Hyperglycemia</b></h3>';
										hyper_less_ind = 1;
									}	
									 break;
					case "hyper_more": if(hyper_more_ind == 0){
										dBody	+= '<h3><b>Active Medications More Likely to Cause Hyperglycemia</b></h3>';
										hyper_more_ind = 1;
									}	
									 break;
				
				}		
				dBody	+= ADMitem(AMObj[i]);		
			}
			if (bNone){
				dBody 	+= '<h3 class="am-med"><span></span></h3>'
							+ '<dl class="am-detail">'
								+ '<dt class="am-md-name"><span>Medication Name</span></dt>'
									+ '<dd class="am-md-name nf"><span><i>No orders found.</i></span></dd>'
							+ '</dl>';
			}   
			spAMList.innerHTML = dBody+'</span>';
			if(ammeds_comp.CFLAG == 0)
				document.getElementById("hdr_2").onclick();
		}
		else{
			spAMList.offsetParent.style.display = "none";
		}
	}
	catch(e){
			errmsg(e.message, "fillAMlist()");	
	}
}

function sortbyname(name,a,b){
		return ((a[name] < b[name]) ? -1 : ((a[name] < b[name]) ? 1 : 0));
}

function ADMitem(obj){
    var txt = obj.dttm;
	var ahover = 'onmousemove="showHover(\'<span class=hoverlabel> Order Date/Time: </span>'+obj.SORDERDTTM+'\')" onmouseout="hideHover()"';
	return ('<h3 class="am-med"><span>'+obj.DISPLAY+'</span></h3>'
        + '<dl class="am-detail">'
           + '<dt class="am-md-name"><span>Medication Name</span></dt>'
            + '<dd class="am-md-name"><span>'+obj.DISPLAY+'</span></dd>'
            + '<dt class="am-md-sig"><span><abbr title="Signature Line">Sig. Line</abbr></span></dt>'
            + '<dd class="am-md-sig"'+ahover+'><span>'+obj.DETAILS+'</span></dd>'
        + '</dl>');
}
/********************/

/********* Diabetes Management ********/
function fillDMlist(json_data){
	try{
		var spDMList = document.getElementById("spDMList");
		if(diabmgmt_comp.CFLAG >= 0){
			json_data_dm = json_data.response;
			var bNone = true;
			var dBody =  '<span><table  class="sec-hd">'
			dBody += '<tbody>'
			dBody += '<tr>'
			dBody += '<td class="sec-hd-title">'
			dBody +=  buildChartLink(diabmgmt_comp.CLBL,person_id,encounter_id,diabmgmt_comp.CLINK,"See "+diabmgmt_comp.CLINK)
			dBody += '</td>'					
			dBody += '<td class="sec-hd-collapse" id="hdr_3" title="Click to collapse" onclick="ShowHide(\'3\');">-&nbsp&nbsp</td>'
			dBody += '<tr>'
			dBody += '</tbody>'
			dBody += '</table></span><span id="sp_3">' 
			 
			for(var i = 0; i < json_data_dm.DM_MISC.EVENTS.length; i++){
				switch(json_data_dm.DM_MISC.EVENTS[i].CS_FLAG){
					case "SBP":
						bNone = false;
						dBody	+= DMitem(json_data_dm.DM_MISC.EVENTS[i],"Goal:  Result < 130",130,1);
						break;
					case "DBP":
						bNone = false;
						dBody	+= DMitem(json_data_dm.DM_MISC.EVENTS[i],"Goal:  Result < 80",80,1);
						break;
					case "BMI":
						bNone = false;
						dBody	+= DMitem(json_data_dm.DM_MISC.EVENTS[i],"Goal:  n/a",999,0);
						break;
					case "FLU":
						bNone = false;
						dBody	+= DMitem(json_data_dm.DM_MISC.EVENTS[i],"Goal:  Yearly","Administered prior to hospitalization|Received this season",2);
						break;
					case "PNU":
						bNone = false;
						dBody	+= DMitem(json_data_dm.DM_MISC.EVENTS[i],"Goal:  Every 5 years","Less than 5 years",2);
						break;
					case "LDL":
						bNone = false;
						dBody	+= DMitem(json_data_dm.DM_MISC.EVENTS[i],"Goal:  Result < 130",130,1);
						break;		
					default:
						bNone = false;
						dBody	+= DMitem(json_data_dm.DM_MISC.EVENTS[i],"",-1);
				}		
			}
			if (bNone){
				dBody 	+= '<h3 class="am-med"><span></span></h3>'
							+ '<dl class="am-detail">'
								+ '<dt class="am-md-name"><span></span></dt>'
									+ '<dd class="am-md-name nf"><span><i>No results found.</i></span></dd>'
							+ '</dl>';
			}	    
			spDMList.innerHTML = dBody+'</span>';
			if(diabmgmt_comp.CFLAG == 0)
				document.getElementById("hdr_3").onclick();
		}
		else{
			spDMList.offsetParent.style.display = "none";
		}
		//fillAdvisor();
	}
	catch(e){
			errmsg(e.message, "fillDMlist()");	
	}
}

function DMitem(obj,goal,gVal,type){
    var gLight = "<img src='"+imagepath+"3918_16.gif'>";
	var rLight = "<img src='"+imagepath+"5970_16.gif'>";
	var vLight
		,sReturn;
	
	var txt = obj.SRESULTDTTM;
	var ahover = 'onmousemove="showHover(\'<span class=hoverlabel> Result Date/Time: </span>'+obj.SRESULTDTTM+'\')" onmouseout="hideHover()"';
	
	switch (type){
		case 1:
			var oSplit = obj.RESULT_V;
			var oData  = oSplit.split(" ");
			var oVal   = oData[0];
			if (oVal < gVal){
				vLight = gLight;
			}
			else{
				vLight = rLight;
			}
			break;
		case 2:
			if (parseInt(obj.GOAL_MET_IND) === 1){
					vLight = gLight;
				}
				else{
					vLight = rLight;
				}
			break;
		default:
			vLight = gLight;
	}	
	switch(obj.NORMALCY){
        case "L":
            sReturn = '<dd class="result low"><span '+ahover+'>'+obj.RESULT_V+'&nbsp;'+obj.RESULT_U+'</span></dd>'
                    + '<dt class="normalcy"><span>Normalcy</span></dt>'
                    + '<dd class="normalcy"><em>&nbsp('+obj.NORMALCY+')</em></dd>';
            break;
        case "LC":
            sReturn = '<dd class="result critical"><span '+ahover+'>'+obj.RESULT_V+'&nbsp;'+obj.RESULT_U+'</span></dd>'
                    + '<dt class="normalcy"><span>Normalcy</span></dt>'
                    + '<dd class="normalcy"><strong><em>&nbsp('+obj.NORMALCY+')</em></strong></dd>';
            break;
        case "H":
            sReturn = '<dd class="result high"><span '+ahover+'>'+obj.RESULT_V+'&nbsp;'+obj.RESULT_U+'</span></dd>'
                    + '<dt class="normalcy"><span>Normalcy</span></dt>'
                    + '<dd class="normalcy"><strong><strong>&nbsp('+obj.NORMALCY+')</strong></dd>';
            break;
        case "HC":
            sReturn = '<dd class="result critical"><span '+ahover+'>'+obj.RESULT_V+'&nbsp;'+obj.RESULT_U+'</span></dd>'
                    + '<dt class="normalcy"><span>Normalcy</span></dt>'
                    + '<dd class="normalcy"><strong><em>&nbsp('+obj.NORMALCY+')</em></strong></dd>';
            break;
        default:
            sReturn = '<dd class="result"><span '+ahover+'>'+obj.RESULT_V+'&nbsp;'+obj.RESULT_U+'</span></dd>'
                    + '<dt class="normalcy"><span>Normalcy</span></dt>'
                    + '<dd class="normalcy"><span>Normal</span></dd>';
    }
	return ('<h3 class="am-med"><span>'+obj.CE_LBL+'</span></h3>'
        + '<table class="am-detail" colspan="3" width="100%">'
            + '<tr class="am-md-name" title="'+goal+'">'
            + '<td class="am-md-name" colspan="1" width="60%"><span>'+obj.CE_LBL+'</span></td>'
            + '<td colspan="1" width="35%">'+sReturn+'</td>'
			+ '<td class="am-md-sig"  colspan="1" width="5%"><span>'+vLight+'</span></td>'
			+ '</tr>'
        + '</table>');
}
/********************/

/******** Insulin Advisor ***********/
function fillAdvisor(){
	try{
		var spADVSRList = document.getElementById("spADVSRList");
		if(advsr_comp.CFLAG >= 0){
			var dBody =  '<span><table  class="sec-hd">'
			dBody += '<tbody>'
			dBody += '<tr>'
			dBody += '<td class="sec-hd-title">'
			dBody +=  buildChartLink(advsr_comp.CLBL,person_id,encounter_id,advsr_comp.CLINK,"See "+advsr_comp.CLINK)
			dBody += '</td>'					
			dBody += '<td class="sec-hd-collapse" id="hdr_4" title="Click to collapse" onclick="ShowHide(\'4\');">-&nbsp&nbsp</td>'
			dBody += '<tr>'
			dBody += '</tbody>'
			dBody += '</table>' 
			dBody +='<dl class="gac-detail" id="sp_4"><dt class="gac-md-name"></dt><dd class="gac-md-sig"><span><a href=\'javascript:setCallSync("'+json_data_dm.DM_MISC.ADVSR_TRIGGER+'")\';">';
			dBody +='Launch <i>Discern Advisor&reg;</i> -' 
			dBody +=json_data_dm.DM_MISC.ADVSR_LBL;	
			dBody +='</a></span></dd>'
			spADVSRList.innerHTML = dBody;
				if(advsr_comp.CFLAG == 0)
					document.getElementById("hdr_4").onclick();
		}
		else{
			spADVSRList.offsetParent.style.display = "none";
		}
	}
	catch(e){
			errmsg(e.message, "fillAdvisor()");	
	}		
}

function setCallSync(id){
	var wParams;
	var rule = "javascript:CCLLINK('eks_call_synch_event', '"+getParams(id)+"',1);";
	if (id == 2){
		wParams	= "fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=no,left=120,top=200,width="+(2*(screen.width/4))+",height="+((3*(screen.height)/5.5));
	}
	else{
		wParams	= "fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=no,left=120,top=200,width="+(3*(screen.width/4))+",height="+((3*(screen.height)/5.5));
	}
	
	CCLNEWSESSIONWINDOW(rule,'_blank',wParams,0,1);
}

function fillModDavidsonVals(obj){
	var j = obj.length;
	if (j>0){
		document.getElementById('txtPassBG').value = parseInt(obj[j-1].r_val).toFixed(0);
		document.getElementById('spPassBGinfo').innerHTML = obj[j-1].r_val+'|'+obj[j-1].ce_id+'|'+obj[j-1].dttm;
		//alert("document.getElementById('spPassBGinfo').innerHTML = " + document.getElementById('spPassBGinfo').innerHTML);
	}
}
/********************/

/********* Laboratory Results ********/
function setMaxPage(val){
    if (val>1){
		var rVal = Math.ceil((val-1)/3);
	    return( rVal );
	}
	else{
		return(1);
	}
}

function fillLabList(json_data){
	try{
		var spLabList = document.getElementById("spLabList");
		if(labs_comp.CFLAG >= 0){
			json_data_labs = json_data.response;
			nLabMax = json_data_labs.DM_LABS.RESULTS_MAX_CNT;
			lMaxPage = setMaxPage(nLabMax);
			if (lMaxPage > 1){
				var spPage = 'Page 1 of '+lMaxPage;
			}
			else{
				var spPage = 'Page 1 of 1';
			}			
			var labBody = 	 '<span><table  class="sec-hd">'
			labBody += '<tbody>'
			labBody += '<tr>'
			labBody += '<td class="sec-hd-title">'
			labBody += buildChartLink(labs_comp.CLBL,person_id,encounter_id,labs_comp.CLINK,"See "+labs_comp.CLINK)	
			labBody += '</td>'					
			labBody += '<td class="sec-hd-collapse" id="hdr_5" title="Click to collapse" onclick="ShowHide(\'5\');">-&nbsp&nbsp</td>'
			labBody += '</tr>'
			labBody += '</tbody>'
			labBody += '</table></span>' 			
			
			if (nLabMax == 0) {
				labBody += '<span id="sp_5">';//No Lab Results Found.
				labBody += '<h3 class="am-med"><span></span></h3>'
							+ '<dl class="am-detail">'
								+ '<dt class="am-md-name"><span>Medication Name</span></dt>'
									+ '<dd class="am-md-name nf"><span><i>No lab results found.</i></span></dd>'
							+ '</dl>';
			}
			else {
				labBody += '<span id="sp_5">'
				labBody += '<span class="sec-hd-title-full" >'
				labBody +=  '<ul class="prev-next"><span id="spLabPage">'+spPage+'</span><li><a id="sp2" href="javascript:ShowSecondary();">Show Secondary Lab(s)</a>'
				labBody +=  '<li><a href="javascript:lPrevPage();">Previous</a></li><li><a href="javascript:lNextPage();">Next</a></li></ul>'
				labBody += '</span>'
				labBody += '<table class="lr-table" cellspacing="0"summary="A listing of the most recent lab results, sorted by type, with past measurements.">' +
				'<caption>Table 1: Lab Results, by type</caption>' +
				'<col class="lr-v"/>' +
				'<col class="lr-v-current"/>' +
				'<col class="lr-v-previous" span="3"/>' +
				'<thead>' +
				'<tr>' +
				'<th scope="col" abbr="Lab" class="current">Lab Result</th>' +
				'<th scope="col" abbr="Current">Latest Result</th>' +
				'<th scope="colgroup" abbr="Previous" colspan="3">Previous Results</th>' +
				'</tr>' +
				'</thead>';
				for (var p = 1; p <= lMaxPage; p++) {
					var hRow = "odd";
					//labBody += '<tbody id="tl_"' + p + '">';
					if (p == 1) {
						labBody += '<tbody id="tl_' + p + '">';
					}
					else {
						labBody += '<tbody id="tl_' + p + '" style="display:none">';
					}
					for(var q = 0; q < json_data_labs.DM_LABS.EVENTS.length; q++){			
						if( json_data_labs.DM_LABS.EVENTS[q].CS_FLAG == 1){
							labBody += fillLab(json_data_labs.DM_LABS.EVENTS[q], hRow, p, false);
							hRow = OddEven(hRow);
						}
						else{				
							labBody += fillLab(json_data_labs.DM_LABS.EVENTS[q], hRow, p, true);
							hRow = OddEven(hRow);
						}
					}
					labBody += '</tbody>';
				}
				labBody += '</table>'
			}
			labBody += '</span>';
			spLabList.innerHTML = labBody;
			if(labs_comp.CFLAG == 0)
				document.getElementById("hdr_5").onclick();
		}
		else{
			spLabList.offsetParent.style.display = "none";
		}
	}
	catch(e){	
        errmsg(e.message, "fillLabList()");	
	}
}

function fillLab(obj,rType,page,hide){
try{
    var tBody = "";
    var hMax  = 3*page;
    var hCnt  = hMax-2;
    var rName = "lr2_"+rType;
    if (hide){tBody = '<tr name="'+rName+'" class="lr-table '+rType+' hide">';}else{tBody = '<tr class="lr-table '+rType+'">';}
        
    tBody += '<th scope="row">'+obj.CE_LBL+'</th>';
    // Always show the latest
    var hNorm = getNormalcy(obj.RESULTS[0].RESULT_V,obj.RESULTS[0].NORMALCY);
    tBody += '<td class="first">';
    tBody += '<dl>'
                + '<dt class="result"><span>Result</span></dt>'+ hNorm
                + '<dt class="date-time"><span>Date / Time</span></dt>'
                + '<dd class="date-time"><span>'+obj.RESULTS[0].SRESULTDTTM+'</span></dd>'
            + '</dl>'
            + '</td>';
    
    for (var i=hCnt;i<obj.RESULTS.length;i++){
        if (i <= hMax){
            var hNorm = getNormalcy(obj.RESULTS[i].RESULT_V,obj.RESULTS[i].NORMALCY);
            tBody += '<td>'
                    + '<dl>'
                        + '<dt class="result"><span>Result</span></dt>'+ hNorm
                        + '<dt class="date-time"><span>Date / Time</span></dt>'
                        + '<dd class="date-time"><span>'+obj.RESULTS[i].SRESULTDTTM+'</span></dd>'
                    + '</dl>'
                    + '</td>';
            hCnt++;
        }
    }
    if (hCnt <= hMax){
        tBody += fillExtras(hCnt,hMax);
    }
    tBody += '</tr>';
    return (tBody);
	}
	catch(e){	
        errmsg(e.message, "fillLab()");	
	}
}

function lNextPage(){
    if (nLabPage < lMaxPage){
        var curpage = "tl_"+String(nLabPage);
        var nexpage = "tl_"+String(nLabPage+1);
        var x = document.getElementById(curpage);
        var y = document.getElementById(nexpage);
        x.style.display = 'none';
        y.style.display = '';
        nLabPage = nLabPage+1;
    }
    this.document.getElementById("spLabPage").innerHTML = "Page "+String(nLabPage)+" of "+String(lMaxPage);
}

function lPrevPage(){
    if (nLabPage > 1){
        var curpage = "tl_"+String(nLabPage);
        var nexpage = "tl_"+String(nLabPage-1);
        var x = document.getElementById(curpage);
        var y = document.getElementById(nexpage);
        x.style.display = 'none';
        y.style.display = '';
        nLabPage = nLabPage-1;
    }
    this.document.getElementById("spLabPage").innerHTML = "Page "+String(nLabPage)+" of "+String(lMaxPage);
}

function ShowSecondary(){
    var sClOdd  = "lr-table odd";
    var sClEven = "lr-table even";
    if (document.getElementById("sp2").innerHTML == "Show Secondary Lab(s)"){
        document.getElementById("sp2").innerHTML = "Hide Secondary Lab(s)";
    }
    else{
        sClOdd  = sClOdd  + " hide";
        sClEven = sClEven + " hide";
        document.getElementById("sp2").innerHTML = "Show Secondary Lab(s)";
    }
    var x = document.getElementsByTagName('tr');
    for (var i=0;i<x.length;i++){
        var hd = x[i];
        if (hd.name == "lr2_odd"){
            hd.className = sClOdd;
        }
        else if (hd.name == "lr2_even"){
            hd.className = sClEven;
        }
    }   
}

function OddEven(val){
    if (val == "odd"){
        return ("even");
    }
    else{
        return ("odd");
    }
}

function getNormalcy(result,val){
    var sReturn = '';
    switch(val){
        case "L":
            sReturn = '<dd class="result low"><span>'+result+'</span></dd>'
                    + '<dt class="normalcy"><span>Normalcy</span></dt>'
                    + '<dd class="normalcy"><em>&nbsp('+val+')</em></dd>';
            break;
        case "LC":
            sReturn = '<dd class="result critical"><span>'+result+'</span></dd>'
                    + '<dt class="normalcy"><span>Normalcy</span></dt>'
                    + '<dd class="normalcy"><strong><em>&nbsp('+val+')</em></strong></dd>';
            break;
        case "H":
            sReturn = '<dd class="result high"><span>'+result+'</span></dd>'
                    + '<dt class="normalcy"><span>Normalcy</span></dt>'
                    + '<dd class="normalcy"><strong><strong>&nbsp('+val+')</strong></dd>';
            break;
        case "HC":
            sReturn = '<dd class="result critical"><span>'+result+'</span></dd>'
                    + '<dt class="normalcy"><span>Normalcy</span></dt>'
                    + '<dd class="normalcy"><strong><em>&nbsp('+val+')</em></strong></dd>';
            break;
        default:
            sReturn = '<dd class="result"><span>' + result + '</span></dd>'
                    + '<dt class="normalcy"><span>Normalcy</span></dt>'
                    + '<dd class="normalcy"><span>Normal</span></dd>';
    }
    return (sReturn);
}

function fillExtras(cnt,max){
    var body = '';
    for (var j=cnt;j<=max;j++){
        body += '<td>'
                + '<dl>'
                + '<dt class="result"><span>Result</span></dt>'
                + '<dd class="result"><span>--</span></dd>'
                + '<dt class="date-time"><span>Date / Time</span></dt>'
                + '<dd class="date-time"><span>(--)</span></dd>'
            + '</dl>'
            + '</td>';
    }
    return (body);
}
/********************/

/********* Diet(s)********/
function fillDietList(json_data){
	var spDietList = document.getElementById("spDietList");
	if(diets_comp.CFLAG >= 0){
	
		json_data_diets = json_data.response;
		var dBody = '<span><table  class="sec-hd">'
		dBody += '<tbody>'
		dBody += '<tr>'
		dBody += '<td class="sec-hd-title">'
		dBody += buildChartLink(diets_comp.CLBL,person_id,encounter_id,diets_comp.CLINK,"See "+diets_comp.CLINK)
		dBody += '</td>'					
		dBody += '<td class="sec-hd-collapse" id="hdr_6" title="Click to collapse" onclick="ShowHide(\'6\');">-&nbsp&nbsp</td>'
		dBody += '<tr>'
		dBody += '</tbody>'
		dBody += '</table></span><span id="sp_6">' 
		  
		var cnt = json_data_diets.DM_DIETS.ORDERS.length; 
		if (cnt > 0){
			for (var i=0;i<cnt;i++){
				var hover = json_data_diets.DM_DIETS.ORDERS[i].SSTARTDTTM+" - "+json_data_diets.DM_DIETS.ORDERS[i].SENDDTTM;
				dBody	+= '<h3 class="adm-med"><span>'+json_data_diets.DM_DIETS.ORDERS[i].DISPLAY+'</span></h3>'
						+   '<dl class="adm-detail">'
							+ '<dt class="adm-md-name"><span>Medication Name</span></dt>'
							+ '<dd class="adm-md-name"><span>'+json_data_diets.DM_DIETS.ORDERS[i].DISPLAY+'</span></dd>'
							+ '<dt class="adm-md-sig"><span><abbr title="Signature Line">Sig. Line</abbr></span></dt>'
							+ '<dd class="adm-md-sig"><span title="'+hover+'">'+json_data_diets.DM_DIETS.ORDERS[i].DETAILS+'</span></dd>'
						+ '</dl>';
			}
		}
		else{
			dBody	+= '<h3 class="adm-med"><span></span></h3>'
						+   '<dl class="adm-detail">'
							+ '<dt class="adm-md-name"><span>Medication Name</span></dt>'
							+ '<dd class="adm-md-name nf"><span>No orders found.</span></dd>'
						+ '</dl>';
		}
		spDietList.innerHTML = dBody+'</span>';
		if(diets_comp.CFLAG == 0)
			document.getElementById("hdr_6").onclick();
	}
	else{
		spDietList.offsetParent.style.display = "none";
	}	
	fillGraphTable();
}
/********************/

/********* Interventions Documented ********/ 
/*WO# 759844 - dc*/
function fillInterventionsList(json_data){
	var spInterventionsList = document.getElementById("spInterventionsList");
	if(interventions_comp.CFLAG >= 0){
	
		json_data_interventions = json_data.response;
		var dBody = '<span><table  class="sec-hd">'
		dBody += '<tbody>'
		dBody += '<tr>'
		dBody += '<td class="sec-hd-title">'
		dBody += buildChartLink(interventions_comp.CLBL,person_id,encounter_id,interventions_comp.CLINK,"See "+interventions_comp.CLINK)
		dBody += '</td>'					
		dBody += '<td class="sec-hd-collapse" id="hdr_6" title="Click to collapse" onclick="ShowHide(\'6\');">-&nbsp&nbsp</td>'
		dBody += '<tr>'
		dBody += '</tbody>'
		dBody += '</table></span><span id="sp_6">' 
		  
		var cnt = json_data_interventions.DM_INTERVENTIONS.length; 
		if (cnt > 0){
			for (var i=0;i<cnt;i++){
				var hover = json_data_interventions.DM_INTERVENTIONS[i].SSTARTDTTM+" - "+json_data_interventions.DM_INTERVENTIONS[i].SENDDTTM;
				dBody	+= '<h3 class="adm-med"><span>'+json_data_interventions.DM_INTERVENTIONS[i].DISPLAY+'</span></h3>'
						+   '<dl class="adm-detail">'
							+ '<dt class="adm-md-name"><span>Medication Name</span></dt>'
							+ '<dd class="adm-md-name"><span>'+json_data_interventions.DM_INTERVENTIONS[i].DISPLAY+'</span></dd>'
							+ '<dt class="adm-md-sig"><span><abbr title="Signature Line">Sig. Line</abbr></span></dt>'
							+ '<dd class="adm-md-sig"><span title="'+hover+'">'+json_data_interventions.DM_INTERVENTIONS[i].DETAILS+'</span></dd>'
						+ '</dl>';
			}
		}
		else{
			dBody	+= '<h3 class="adm-med"><span></span></h3>'
						+   '<dl class="adm-detail">'
							+ '<dt class="adm-md-name"><span>Medication Name</span></dt>'
							+ '<dd class="adm-md-name nf"><span>No orders found.</span></dd>'
						+ '</dl>';
		}
		spInterventionsList.innerHTML = dBody+'</span>';
		if(interventions_comp.CFLAG == 0)
			document.getElementById("hdr_6").onclick();
	}
	else{
		spInterventionsList.offsetParent.style.display = "none";
	}	
	fillGraphTable();
}
/*********END Interventions Documented***********/

/******** Total Insulin ******/
function fillTotInsulin(){
	try{
		var spTotInsulin = document.getElementById("spTotInsulin");
		if(insulin_comp.CFLAG >= 0){
			var dBody = '<span><table  class="sec-hd">'
			dBody += '<tbody>'
			dBody += '<tr>'
			dBody += '<td class="sec-hd-title">'
			dBody += buildChartLink(insulin_comp.CLBL,person_id,encounter_id,insulin_comp.CLINK,"See "+insulin_comp.CLINK)	
			dBody += '</td>'					
			dBody += '<td class="sec-hd-collapse" id="hdr_7" title="Click to collapse" onclick="ShowHide(\'7\');">-&nbsp&nbsp</td>'
			dBody += '<tr>'
			dBody += '</tbody>'
			dBody += '</table></span>' 
			
			dBody += '<span id="sp_7"><table class="sq-table" colspan="3"><tbody>'
			dBody += '<tr colspan="3">'
			dBody += '<th colspan="1" style="width:25%"><u>Total Insulin</u></th>'
			dBody += '<th colspan="1" style="width:32%"><u>Correction Factor</u></th>'
			dBody += '<th colspan="1" style="width:43%"><u>Subcutaneous Insulin Requirement</u></th>'
			dBody += '</tr>'
			dBody += '<tr colspan="3">'
			dBody += '<td colspan="1" style="width:32%">'
			dBody += '<input type="text" id="txtTotInst" class="minputs"/>unit(s) x  '
			dBody += '</td>'
			dBody += '<td colspan="1" style="width:25%">'
			dBody += '<input type="text" id="txtCF" class="minputs">%'
			dBody += '</td>'
			dBody += '<td colspan="1" style="width:43%">'
			dBody += '<input type="button" value="=" id="btnEqual" onclick="javascript:CalcSubqReq();"/>'
			dBody += '<span id="spSubQReq"></span>'
			dBody += '</td>'
			dBody += '</tr>'
			dBody += '</tbody></table></span>'			
			spTotInsulin.innerHTML = dBody;
			document.getElementById("txtTotInst").value = Math.round(tot_insunits*100)/100;
			if(insulin_comp.CFLAG == 0)
				document.getElementById("hdr_7").onclick();			
		}
		else{
			document.getElementById("comp_7").style.display = "none";
		}
	}
	catch(e){
        errmsg(e.message, "fillTotInsulin()");	
	}
}

function CalcSubqReq(){
      var totins = Number(document.getElementById("txtTotInst").value);
      var cfactor = Number(document.getElementById("txtCF").value);
      if (document.getElementById("txtTotInst").value.length == 0 || isNaN(totins)){
            alert("Please fill out the Total Number Insulin given over the past 24 hours.");
            document.getElementById("txtTotInst").value = '';
            document.getElementById("spSubQReq").innerHTML = '';
            document.getElementById("txtTotInst").focus();
            return;
      }
      if (document.getElementById("txtCF").value.length == 0 ||  isNaN(cfactor)){
            alert("Please fill out the Correction Factor.");
            document.getElementById("txtCF").value = '';
            document.getElementById("spSubQReq").innerHTML = '';
            document.getElementById("txtCF").focus();
            return;
      }
      var dSubVal = totins * (cfactor / 100);
      dSubVal = dSubVal.toFixed(2);
      document.getElementById("spSubQReq").innerHTML = dSubVal + " unit(s)";
}

/********* Graph ********/

function fillGraphWrapper(json_data){
	fillGraph(json_data.response);
	if(graph_comp.CFLAG == 0){
		document.getElementById("hdr_8").onclick();	
		graph_comp.CFLAG = 2;
	}
}			

function curMousePos(e){
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

function showHover(txt,e){
						if (!e) {
							e = window.event;
						}
						var curMousePosition = curMousePos(e);
						//,curWindowDim = Util.Pos.gvs()
						if (hoverPopupDOM.parentNode == null) {
							hoverPopupDOM = document.body.appendChild(hoverPopupDOM);
						}
						hoverPopupDOM.style.display = "block";
						hoverPopupDOM.innerHTML = txt;
						x = curMousePosition[1];
						y = curMousePosition[0];
						
						//Sticky Hover
						
						if (y < hoverPopupDOM.offsetHeight && x > hoverPopupDOM.offsetWidth) // right edges of screen
						{
							hoverPopupDOM.style.top = (y + 5) + "px";
							hoverPopupDOM.style.left = (x - hoverPopupDOM.offsetWidth) + "px";
						}
						else 
							if (y > hoverPopupDOM.offsetHeight && x < hoverPopupDOM.offsetWidth) // right edges of screen
							{
								hoverPopupDOM.style.top = (y - hoverPopupDOM.offsetHeight) + "px";
								hoverPopupDOM.style.left = (x + 5) + "px";
							}
							else 
								if (y > hoverPopupDOM.offsetHeight && x > hoverPopupDOM.offsetWidth) // right edges of screen
								{
									hoverPopupDOM.style.top = (y - hoverPopupDOM.offsetHeight) + "px";
									hoverPopupDOM.style.left = (x - hoverPopupDOM.offsetWidth) + "px";
								}
								else {
									hoverPopupDOM.style.top = (y + 5) + "px";
									hoverPopupDOM.style.left = (x + 5) + "px";
								}
						hoverPopupDOM.style.visibility = "visible";
					
}

function hideHover(e){
					hoverPopupDOM.style.visibility = "hidden";
					hoverPopupDOM.style.display = "none";
}

function fillGraph(json_data){
	try{
		var spGraph = document.getElementById("spGraph")
		,spGraphHdr = document.getElementById("spGraphHdr");
		if(graph_comp.CFLAG >= 0){
			if(typeof(json_data.DM_POC) == 'object')
				json_data_poc = json_data.DM_POC;
			if(typeof(json_data.DM_DRIP) == 'object'){
				json_data_drp = json_data.DM_DRIP;
				tot_insunits = json_data.DM_DRIP.TOTAL_INS;
				fillTotInsulin();
			}	
			if (typeof json_data_poc != 'object' || typeof json_data_drp != 'object') {
				return;
			}	
				
			cur_starttm = new Date();
			cur_stoptm	= new Date();
			cur_stoptm.setHours(cur_stoptm.getHours(),59,59,999);
			cur_starttm.setTime(cur_starttm.getTime() - (1000*60*60*24))
			cur_starttm.setHours(cur_starttm.getHours()+1,0,0,0)	
			JGraphlabels = {};
			JGraphlabelsfull = {};
			JGraphUnits = {};
			JGraphVal = {};
			var str ='<div id="spGrChks" class="cl-form">';
			if (json_data_poc && json_data_poc.RESULTS.length > 0) {
				str += "<input type='checkbox' checked=true disabled = true id='checkGraph1' value='Graph1' onclick = 'javascript:redrawGraph();'><span class='gr1'>" + json_data_poc.CS_LBL + "</span>";
			}
			if (json_data_drp && json_data_drp.RESULTS.length > 0) {
				str += "<input type='checkbox' checked=true disabled = true id='checkGraph4' value='Graph4' onclick = 'javascript:redrawGraph();'><span class='gr4'>" + json_data_drp.RESULTS[0].CS_LBL + "</span>";
			}
			str+= "</div>";
			//str += "</form></nobr>";
			spGraphHdr.innerHTML = buildChartLink(graph_comp.CLBL,person_id,encounter_id,graph_comp.CLINK,"See "+graph_comp.CLINK)+str;
		//	spGraph.innerHTML = '<table  class="sec-hd"><tr>'
		//			  + '<td class="sec-hd-title">'+buildChartLink(graph_comp.CLBL,person_id,encounter_id,graph_comp.CLINK,"See "+graph_comp.CLINK)+str+ '</td>'
		//			  + '<td class="sec-hd-collapse" id="hdr_8" title="Click to collapse" onclick="ShowHide(\'8\');">---&nbsp&nbsp</td>'
		//			  +'</tr></table>';
			
			testarray = new Array();
			JGraphdata = new Array();
			JGraphdata2 = new Array();
			JGraphdata3 = new Array();
			JGraphdata4 = new Array();
			JGraphhoverdata = new Array();
			JGraphhoverdata2 = new Array();
			JGraphhoverdata3 = new Array();
			JGraphhoverdata4 = new Array();
			var xSplit ;
			var xData ;
			var xVal ;
			var tempindex =-1;
			var temp_date = new Date();

			//testarray = json_data_poc.concat(json_data_drp);
			if (json_data_poc && json_data_poc.RESULTS.length > 0){
				testarray = json_data_poc.RESULTS;
			}
			if (json_data_drp && json_data_drp.RESULTS.length > 0){
				testarray = testarray.concat(json_data_drp.RESULTS);	
			}
			testarray.sort(function(a,b){return sortbydate("SRESULTDTTM",a,b)});
			for(var i = 0; i<= testarray.length-1;i++){
				if(testarray[i].SRESULTDTTM > ""){
					convertdate(testarray[i].SRESULTDTTM,temp_date);
					if ((cur_stoptm.getTime() - temp_date.getTime()) / (1000 * 60) < 0 || (cur_starttm.getTime() - temp_date.getTime()) / (1000 * 60) > 0) {
						testarray.remove(i);
						i--;
					}
				}
			}
			for(var j = 0; j <= 12; j++){
				temp_date.setTime(cur_starttm.getTime()+(interval_length*j));
				JGraphlabels[j] = (temp_date.getMonth()+1)+"/"+(temp_date.getDate())+"/"+(temp_date.getYear())+" "+format_hours(temp_date.getHours())+":"+format_minutes(temp_date.getMinutes());
			}
			pocInd = false;
			drpInd = false;
			var cnt = 0;
			testarray =  testarray.uniquedttm();
			for(var i=testarray.length-1;i>=0;i--){
				var x = i % 10;		
				if(testarray[i].SRESULTDTTM > ""){
					JGraphlabelsfull[cnt] = testarray[i].SRESULTDTTM;		
					if(json_data_poc){
						tempindex = finddate(json_data_poc.RESULTS.length - 1, json_data_poc.RESULTS, testarray[i].SRESULTDTTM);
						if (tempindex > -1 && json_data_poc.RESULTS[tempindex].RESULT_V) {
							xSplit = json_data_poc.RESULTS[tempindex].RESULT_V;
							xData = xSplit.split(" ");
							xVal = xData[0];
							sVal = xData[1];
							JGraphdata[cnt] = parseInt(xVal)+"|"+get_dataposition(testarray[i].SRESULTDTTM)+"|"+testarray[i].SRESULTDTTM;
							JGraphUnits[cnt] = sVal;
							JGraphVal[cnt] = parseInt(xVal);
							pocInd = true;
							JGraphhoverdata[cnt] = "<b><u>"+json_data_poc.CS_LBL+"</b></u><br>"+  parseInt(json_data_poc.RESULTS[tempindex].RESULT_V)+ "  "+json_data_poc.RESULTS[tempindex].RESULT_U+"<br>"+ json_data_poc.RESULTS[tempindex].SRESULTDTTM;
						}
						else{ JGraphdata[cnt] = -1+"|-1|-1";
								JGraphhoverdata[cnt] = " "; }
					}		
					if(json_data_drp){
						tempindex = finddate(json_data_drp.RESULTS.length - 1, json_data_drp.RESULTS, testarray[i].SRESULTDTTM);
						if (tempindex > -1 && json_data_drp.RESULTS[tempindex].DETAILS) {
							xSplit = json_data_drp.RESULTS[tempindex].DETAILS;
							xData = xSplit.split(" ");
							xVal = xData[0];
							sVal = xData[1];
							JGraphdata4[cnt] = parseFloat(xVal)+"|"+get_dataposition(testarray[i].SRESULTDTTM)+"|"+testarray[i].SRESULTDTTM;
							JGraphUnits[cnt] = sVal;
							JGraphVal[cnt] = parseFloat(xVal);
							drpInd = true;
							JGraphhoverdata4[cnt] = "<b><u>"+json_data_drp.RESULTS[tempindex].CS_LBL+"</b></u><br>"+  json_data_drp.RESULTS[tempindex].DETAILS+ "<br>"+ json_data_drp.RESULTS[tempindex].SRESULTDTTM;            
						}
						else{JGraphdata4[cnt] = -1+"|-1|-1";
							 JGraphhoverdata4[cnt] = " ";}
					}	 
					cnt++;
				}
			}
			cnt = 0;
			g = new JGraph.Line('gluCanvas', (document.getElementById("spGraph").offsetWidth-30)+"x250");
			g.tooltipid = "gentooltip";
			g.graphid = "gluCanvas";
			g.clear();
			g.title_font_size = 9;
			g.legend_font_size = 6; 
			g.marker_font_size = 6;
			g.theme_mine();
			g.set_margins(0);
			g.title = 'Blood Glucose Results';
			g.hide_title = true;
			g.hide_legend = true;
			g.intervals = 6;
			g.interval_length = interval_length
			g.start_dttm = cur_starttm;
			g.stop_dttm =  cur_stoptm;

			if (pocInd == true) {
				g.data(json_data_poc.CS_LBL, JGraphdata, 0, 350, "#AC0000",JGraphhoverdata,"line");
				document.getElementById("checkGraph1").disabled = false;
			}
			if (drpInd == true) {
				g.data(json_data_drp.RESULTS[0].CS_LBL, JGraphdata4, 0, 35, "#000080",JGraphhoverdata4,"step");
				document.getElementById("checkGraph4").disabled = false;
			}
			//axis label commands
			g.labels = JGraphlabels;
			g.legend_box_size = 10;
			//   g.hide_title = true;
			g.hide_dots = false;
			/* Min Max Values (set only after data() */
			g.minimum_value = 0;
			g.maximum_value = 350;
			g.y_axis_increment = 50;
			g.y_axis_label = "mg/dL";
			g.y2_axis_type = true;
			g.y2_minimum_value = 0;
			g.y2_maximum_value = 35;
			g.y2_axis_increment = 5;
			g.y2_axis_label = "Units/Hr";
			//
			
			//range commands
			//g.range_color = "#66ff66";
			g.range_color = "#FCFAAF";
			g.range_name = "Normal Level 80 - 110 mg/dL";
			g.range_high = 110;
			g.range_low = 80;
			g.range_opacity = 0.10;
			//
			g.no_data_message = " No Qualifying Data Found "
			grapharray = g.draw();	
			fillGraphTable(); 
			
			
			window.onresize = function(){if( typeof(json_data_poc) == 'object') fillGraph(json_data_poc);};
						 			
		}
		else{
			spGraph.offsetParent.style.display = "none";
		}
	}
	catch(e){
        errmsg(e.message, "fillGraph()");	
	}
}

function redrawGraph(){
	try{	
		curr_width = document.getElementById("divGraph").offsetWidth;
		curr_width = curr_width - 30;
		cur_starttm = new Date();
		cur_stoptm	= new Date();
		cur_stoptm.setHours(cur_stoptm.getHours(),59,59,999);
		cur_starttm.setTime(cur_starttm.getTime() - (1000*60*60*24))
		cur_starttm.setHours(cur_starttm.getHours()+1,0,0,0)	
		g = new JGraph.Line('gluCanvas', curr_width+"x250");
		g.tooltipid = "gentooltip";
		g.graphid = "gluCanvas";
		g.clear();
		g.title_font_size = 9;
		g.legend_font_size = 6; 
		g.marker_font_size = 6;
		g.theme_mine();
		g.set_margins(0);
		g.title = 'Blood Glucose Results';
		g.hide_title = true;
		g.hide_legend = true;
		g.intervals = 6;
		g.interval_length = interval_length
		g.start_dttm = cur_starttm;
		g.stop_dttm =  cur_stoptm;
		if(pocInd && document.getElementById("checkGraph1").checked){g.data(json_data_poc.CS_LBL, JGraphdata, 0, 350, "#AC0000",JGraphhoverdata,"line");}
		if(drpInd && document.getElementById("checkGraph4").checked){g.data(json_data_drp.RESULTS[0].CS_LBL, JGraphdata4, 0, 35, "#000080",JGraphhoverdata4,"step");}
		g.labels = JGraphlabels;
		g.legend_box_size = 10;
		//   g.hide_title = true;
		g.hide_dots = false;
		/* Min Max Values (set only after data() */
		g.minimum_value = 0;
		g.maximum_value = 350;
		g.y_axis_increment = 50;
		g.y_axis_label = "mg/dL";
		g.y2_axis_type = true;
		g.y2_minimum_value = 0;
		g.y2_maximum_value = 35;
		g.y2_axis_increment = 5;
		g.y2_axis_label = "Unit/Hr";
			//range commands
		g.range_color = "#FCFAAF";
		g.range_name = "Normal Level 80 - 110 mg/dL";
		g.range_high = 110;
		g.range_low = 80;
		g.range_opacity = 0.01;
		//
		g.no_data_message = " No Qualifying Data Found "
		grapharray = g.draw();
	}
	catch(e){
        errmsg(e.message, "redrawGraph()");	
	}
}

function fillGraphTable(){
	try{
		var spGlucRslts = document.getElementById("spGlucRslts");
		var poc_json_ind = false;
		var drp_json_ind = false;
		var diet_json_ind = false;
		if(typeof(json_data_poc) == 'object')
			poc_json_ind = true;
		if(typeof(json_data_drp) == 'object')
			drp_json_ind = true;	
		if(typeof(json_data_diets) == 'object')
			diet_json_ind = true;	
			
		if(poc_json_ind  && nGluMax < json_data_poc.RESULT_CNT) 
			nGluMax = json_data_poc.RESULT_CNT		
		if(drp_json_ind  && nGluMax < json_data_drp.RESULT_CNT) 
			nGluMax = json_data_drp.RESULT_CNT
		if(diet_json_ind  && nGluMax < json_data_diets.DM_DIETS.ORDER_CNT) 
			nGluMax = json_data_diets.DM_DIETS.ORDER_CNT
		gMaxPage = 1;//setMaxPage(nGluMax);
		if (gMaxPage > 1){
			var spPage = 'Page 1 of '+gMaxPage;
		}
		else{
			var spPage = 'Page 1 of 1';
		}
		//alert("gMaxPage = "+gMaxPage);
		var gluBody = "<br>";
	//		'<h2 class="sec-hd">'
	//        + '<span id="hdr_5" title="Click to collapse" style="cursor:pointer" onclick="ShowHide(\'5\');">-&nbsp&nbsp</span>'
	//        + '<span>' + buildChartLink("Glucose Results",person_id,encounter_id,"Flowsheet","See Flowsheet")+'</span></h2>'
	//        + '<ul class="prev-next"><span id="spGluPage">'+spPage+'</span><li><a href="javascript:gPrevPage();">Previous</a></li><li><a href="javascript:gNextPage();">Next</a></li></ul>';

		if (nGluMax == 0) {
			gluBody += '<span id="sp_9">';//No Lab Results Found.'
			gluBody += '<h3 class="am-med"><span></span></h3>'
						+ '<dl class="am-detail">'
							+ '<dt class="am-md-name"><span>Medication Name</span></dt>'
								+ '<dd class="am-md-name nf"><span>No glucose results found.</span></dd>'
						+ '</dl>';
		}
		else{
			gluBody += '<span id="sp_9"><table id="gTable" class="lr-table" cellspacing="0" style = "width:'+curr_width+';table-layout:fixed;" summary="A listing of the most recent lab results, sorted by type, with past measurements.">'
			+ '<caption>Table 1: Lab Results, by type</caption>'
			+ '<col class="lr-v" />'
			+ '<col class="lr-v-current" />'
			+ '<col class="lr-v-previous" span="3" />'
			+ '<thead>'
				+ '<tr>'
					+ '<th scope="col" abbr="Result" class="current" colSpan = 25>&nbsp;</th>'
				+ '</tr>'
			+ '</thead>';
			if(poc_json_ind)
				json_data_poc.RESULTS.sort(function(a,b){return ascsortbydate("SRESULTDTTM",a,b)});
			if(drp_json_ind)
				json_data_drp.RESULTS.sort(function(a,b){return ascsortbydate("SRESULTDTTM",a,b)});
			if(diet_json_ind)
				json_data_diets.DM_DIETS.ORDERS.sort(function(a,b){return ascsortbydate("SSTARTDTTM",a,b)});
			
			for (var g=1;g<=gMaxPage;g++){
				var hRow = "odd";
				if (g==1){gluBody += '<tbody id="tg_'+g+'">';}
				else{gluBody += '<tbody id="tg_'+g+'" style="display: none">';}
				if(poc_json_ind)
					gluBody += fillGraphTableRow("Blood Glucose, Capillary",json_data_poc.RESULTS,hRow,g,false);hRow = OddEven(hRow);
				if(drp_json_ind)
					gluBody += fillGraphTableRow("Insulin Regular",json_data_drp.RESULTS,hRow,g,false);hRow = OddEven(hRow);
				if(diet_json_ind)
					gluBody += fillGraphTableRow("Diet", json_data_diets.DM_DIETS.ORDERS,hRow,g,false);hRow = OddEven(hRow);
				gluBody += '</tbody>';
			}
		}
			
		gluBody += '</table></span>';
		spGlucRslts.innerHTML = gluBody;	
	}
	catch(e){
        errmsg(e.message, "fillGraphTable()");	
	}
	
}

function fillGraphTableRow(disp,obj,rType,page,hide){
try{
    var tBody = "";
    var hMax  = 24*page;
    var hCnt  = hMax-2;
    var rName = "lr2_"+rType;
	var tempdate = new Date();
	tempdate.setHours(0,0,0,0);
	var hrscnt = 0;
	var prev_units = 0;
	cur_starttm = new Date();
	cur_stoptm	= new Date();
	cur_stoptm.setHours(cur_stoptm.getHours(),59,59,999);
	cur_starttm.setTime(cur_starttm.getTime() - (1000*60*60*24))
	cur_starttm.setHours(cur_starttm.getHours()+1,0,0,0)
	var curdttm = new Date();
	curdttm.setTime(cur_starttm.getTime());
	
	var curdatarray = new Array();
	
    if (hide){tBody = '<tr name="'+rName+'" class="lr-table '+rType+' hide">';}else{tBody = '<tr class="lr-table '+rType+'">';}
        
  //  tBody += '<th scope="row">'+disp+'</th>';
    // Always show the latest
    var hNorm;
	 for (var i = 0; i < obj.length; i++) 
	 {	if(disp == "Diet"){
			obj[i].dttm = obj[i].SSTARTDTTM;
			obj[i].dose = obj[i].DETAILS;
		}	
		else if(disp != "Diet"){
			obj[i].dttm = obj[i].SRESULTDTTM;
			if(disp == "Insulin Regular")
				obj[i].dose = obj[i].DETAILS;
			else		
				obj[i].dose = parseInt(obj[i].RESULT_V) +" "+obj[i].RESULT_U;
		}
	 	if(obj[i].dttm && obj[i].dttm.split(" ").length > 1)
	 	{	
				convertdate(obj[i].dttm,tempdate);
				
				if (tempdate.getTime() >= cur_starttm.getTime()) {
					
					while (tempdate.getTime() > curdttm.getTime()) {
						hrscnt++;
						curdttm.setHours(curdttm.getHours() + 1);
					}
					
				
					if (!curdatarray[hrscnt]) 
						curdatarray[hrscnt] = new Object();
					curdatarray[hrscnt].disp = obj[i].DISPLAY;
					curdatarray[hrscnt].dose = obj[i].dose;
					curdatarray[hrscnt].norm = obj[i].NORMALCY;
					curdatarray[hrscnt].dttm = obj[i].dttm;				
					
					//	alert(curdttm);
					if (curdttm.getTime() > cur_stoptm.getTime()) 
						break;
				}		
			
		}
		//cur_starttm;
		//cur_stoptm;
	 }
	//alert(curdatarray.length)
	
    for (var i=0;i<25;i++){
        if (i <= curdatarray.length-1 && 
			((disp != "Diet" && curdatarray[i] && curdatarray[i].dose) || 
			(disp == "Diet" && curdatarray[i] ))){
			
			if(disp != "Diet")
           	 hNorm = getNormalcy(curdatarray[i].dose,curdatarray[i].norm);
		   else
		   		 hNorm =curdatarray[i].disp;
			
            tBody += '<td class="first" style="width:'+(curr_width/24)+'";>'
                    + '<dl>'
                        + '<dt class="result"><span>Result</span></dt>'+ hNorm
                        + '<dt class="date-time"><span>Date / Time</span></dt>'
                        + '<dd class="date-time"><span>'+curdatarray[i].dttm+'</span></dd>'
                    + '</dl>'
                    + '</td>';
            hCnt++;
        }
		else{
			
            tBody += '<td class="first" style="width:'+(curr_width/24)+'";>'
                + '<dl>'
                + '<dt class="result"><span>Result</span></dt>'
                + '<dd class="result"><span>--</span></dd>'
                + '<dt class="date-time"><span>Date / Time</span></dt>'
                + '<dd class="date-time"><span>(--)</span></dd>'
            + '</dl>'
            + '</td>';
		}
    }
	
    tBody += '</tr>';
    return (tBody);
	}
	catch(e){
        errmsg(e.message, "fillGraphTableRow()");	
	}
}

function gNextPage(){
    if (nGluPage < gMaxPage){
        var curpage = "tg_"+String(nGluPage);
        var nexpage = "tg_"+String(nGluPage+1);
        var x = document.getElementById(curpage);
        var y = document.getElementById(nexpage);
        x.style.display = 'none';
        y.style.display = '';
        nGluPage = nGluPage+1;
    }
    this.document.getElementById("spGluPage").innerHTML = "Page "+String(nGluPage)+" of "+String(gMaxPage);
}

function gPrevPage(){
    if (nGluPage > 1){
        var curpage = "tg_"+String(nGluPage);
        var nexpage = "tg_"+String(nGluPage-1);
        var x = document.getElementById(curpage);
        var y = document.getElementById(nexpage);
        x.style.display = 'none';
        y.style.display = '';
        nGluPage = nGluPage-1;
    }
    this.document.getElementById("spGluPage").innerHTML = "Page "+String(nGluPage)+" of "+String(gMaxPage);
}

function get_dataposition(inp_dttm){
	var data_dttm = new Date();
	convertdate(inp_dttm,data_dttm);
	return(Math.floor(( data_dttm .getTime() - cur_starttm.getTime() )/(1000*60*60))+"|"+Math.ceil((data_dttm .getTime()-cur_starttm.getTime() )/(1000*60*60)))
	

}
/**************/

/********* Date/Time Formatting Functions ********/
function convertdate(input, tempdate){
	var date1 = input.split("/");
	var year1 = date1[2].split(" ");
	var time1 = year1[1].split(":");
	tempdate.setFullYear(year1[0],date1[0]-1,date1[1]);
	tempdate.setMinutes(time1[1]);
	tempdate.setHours(time1[0]);
}

function ascsortbydate(dttm,input1,input2){

	var tempdate1 = new Date();
	var tempdate2 = new Date();
	var dttmdiff = new Date();
	if(input1[dttm] > "" && input2[dttm] > ""){
		convertdate(input1[dttm],tempdate1);
		convertdate(input2[dttm],tempdate2);
		dttmdiff.setTime(tempdate2.getTime() - tempdate1.getTime());
		timediff = dttmdiff.getTime();
		seconds = Math.floor(timediff / (1000 )); 
		return ((seconds < 0) ? 1 : ((seconds > 0) ? -1 : 0));
	}
	else
		return 0;
}

function sortbydate(dttm,input1,input2){
	var tempdate1 = new Date();
	var tempdate2 = new Date();
	var dttmdiff = new Date();
	if(input1[dttm] > "" && input2[dttm] > ""){
		convertdate(input1[dttm],tempdate1);
		convertdate(input2[dttm],tempdate2);
		dttmdiff.setTime(tempdate2.getTime() - tempdate1.getTime());
		timediff = dttmdiff.getTime();
		seconds = Math.floor(timediff / (1000 )); 
		return ((seconds < 0) ? -1 : ((seconds > 0) ? 1 : 0));
	}
	else
		return 0;
}

function finddate(listsize,datearray,input){
	var tempdate1 = new Date();
	var tempdate2 = new Date();
	var dttmdiff = new Date();
	for(i = 0; i<=listsize;i++){
		if(datearray[i].SRESULTDTTM > ""){
			convertdate(datearray[i].SRESULTDTTM,tempdate1);
			convertdate(input,tempdate2);
			dttmdiff.setTime(tempdate1.getTime() - tempdate2.getTime());
			timediff = dttmdiff.getTime();
			seconds= Math.floor(timediff / (1000 )); 
			if (seconds < 60 &&seconds >= 0) {
				return i;
			}
		}
	}
	return -1;
}

function format_minutes(mins){

	if(mins < 10)
		mins =  "0"+mins;
	return mins;
}

function format_hours(hrs){
	if(hrs < 10)
		hrs =  "0"+hrs;
	return hrs;
}
/**************/

Array.prototype.forEach = function( f ) {
 var i = this.length, j, l = this.length;
 for( i=0; i<l; i++ ) { if( ( j = this[i] ) ) { f( j ); } }
};
Array.prototype.indexOf = function( v, b, s ) {
 for( var i = +b || 0, l = this.length; i < l; i++ ) {
  if( this[i].dttm===v || s && this[i].dttm==v ) { return i; }
 }
 return -1;
};
Array.prototype.lastIndexOf = function( v, b, s ) {
 b = +b || 0;
 var i = this.length; while(i-->b) {
  if( this[i].dttm===v || s && this[i].dttm==v ) { return i; }
 }
 return -1;
};
Array.prototype.uniquedttm = function( b ) {
 var a = [], i, l = this.length;
 for( i=0; i<l; i++ ) {
  if( a.indexOf( this[i].SRESULTDTTM, 0, b ) < 0 ) { a.push( this[i] ); }
 }
 return a;
};
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function expandcomps(){
	try{
		var dom_hdr_el;
		var dom_sp_el;
		var dom_comp_el;
		for(var i = 1; i <= 8; i++){
			dom_hdr_el = document.getElementById("hdr_"+i);
			dom_sp_el = document.getElementById("sp_"+i);
			dom_comp_el = document.getElementById("comp_"+i);
			if(typeof(dom_hdr_el) == 'object' && typeof(dom_comp_el) == 'object'  && typeof(dom_sp_el) == 'object'   && dom_comp_el.style.display != "none" && dom_sp_el.style.display == "none")
				dom_hdr_el.onclick();
		}
	}
	catch(e){
       //  errmsg(e.message, "expandcomps()");	
	}
}

function collapsecomps(){
	try{
		var dom_hdr_el;
		var dom_sp_el;
		var dom_comp_el;
		for(var i = 1; i <= 8; i++){
			dom_hdr_el = document.getElementById("hdr_"+i);
			dom_sp_el = document.getElementById("sp_"+i);
			dom_comp_el = document.getElementById("comp_"+i);
			if(typeof(dom_hdr_el) == 'object' && typeof(dom_comp_el) == 'object'  && typeof(dom_sp_el) == 'object'   && dom_comp_el.style.display != "none" && dom_sp_el.style.display != "none"){
				dom_hdr_el.onclick();
			}	
		}
	}
	catch(e){
        // errmsg(e.message, "collapsecomps()");	
	}
}


function chgPassBG(){
	document.getElementById('spPassBGinfo').innerHTML = document.getElementById('txtPassBG').value +"|0|0";
}

function getParams(trig_name){
	var val;
	var params = 'MINE,^';
	var length = json_data_poc.length-1;
	params += (person_id + "^,");
	params += ("^"+ encounter_id + "^,");
	 params += ("^0.0^,^"+trig_name+"^,^"+user_id);
	// if (i == 0){
		// params += ("^0.0^,^ADVSR_GCA_D^,^"+user_id);
	// }
	// if (i == 1){
		// params += ("^0.0^,^ADVSR_GCA_Y^,^"+user_id);
	// }
	// if (i == 2){
		// params += ("^0.0^,^ADVSR_GCA_D_MOD^,^<P>USERID="+user_id);
		// val = parseInt(document.getElementById('txtPassBG').value);
		// if (isNaN(val)){
			// params += "<P>PASS_BG=-1";	
		// }
		// else{
			// params += "<P>PASS_BG="+document.getElementById('spPassBGinfo').innerHTML;
		// }
		// val = parseInt(document.getElementById('txtPassLT').value);
		// if (isNaN(val)){
			// params += "<P>PASS_LT=-1";	
		// }
		// else{
			// params += "<P>PASS_LT="+val;
		// }
		// val = parseInt(document.getElementById('txtPassHT').value);
		// if (isNaN(val)){
			// params += "<P>PASS_HT=-1";	
		// }
		// else{
			// params += "<P>PASS_HT="+val;
		// }
	// }
//	var tStr = '';
//	for (j=0;j<json_data_poc.length;j++){
//		if (j==0){tStr = j+". " + json_data_poc[j].dose + " (" + json_data_poc[j].dttm + ")";}
//		else {tStr += "\n"+j+". "+ json_data_poc[j].dose + " (" + json_data_poc[j].dttm + ")";}
//	}
//	alert(tStr);
//	if (json_data_poc.length>0){
//        params += json_data_poc[length].r_val;
//        params += "|";
//        params += json_data_poc[length].r_units;
//    	params += "|";
//    	params += json_data_poc[length].ce_id;
//        params += "|";
//    	params += json_data_poc[length].dttm;
//    }
//    if (json_data_poc.length>1){
//        params += "|";
//        params += json_data_poc[length-1].r_val;
//        params += "|";
//        params += json_data_poc[length-1].r_units;
//    	params += "|";
//    	params += json_data_poc[length-1].ce_id;
//        params += "|";
//    	params += json_data_poc[length-1].dttm;
//    }
    
	params += '^';
//	alert("Params\n"+params);
	return params;
}

function txtToolTip_hide(id){
    it = document.getElementById(id); 
    it.style.visibility = 'hidden'; 
}

function oShowPopup(item){
 //   alert(item);
	var tableBody = "<table width='100.00%' align='center' id='PopTbl' style='font: 8pt Helvetica' colspan='1'><form name= 'popup'>";

	tableBody  += "<tr>"
					+ "<td width='100.00%' colspan='1'><b><u>Documented</u></b></td>"
                + "</tr>";
                tableBody    += "<tr>"
				                + "<td width='100.00%'  colspan='1' style='padding: 0.000in 0.000in 0.000in 0.050in'>"+item+"</td>"
                              + "</tr>";
                
                
                    
                
               + "</form></table>";
    
//    if (hCnt == 0){hCnt = 1;}
//    var hDiff = hCnt * 17;
//    var hSet = 25 + hDiff;
    pbody.innerHTML 	= '';
    pbody.style.opacity = '0.5';
	pbody.style.border	= 'solid black 1px';
	pbody.style.font	= '8pt Helvetica';
    
    pbody.innerHTML 	= tableBody;
	p.show(window.event.clientX + 10, window.event.clientY + 5, 350, 200, document.body);
	
//	Syntax
//	popup.show(iX, iY, iWidth, iHeight [, oElement])

//	Parameters
//	iX Required. Integer that specifies the x-coordinate of the pop-up window, in pixels. 
//	iY Required. Integer that specifies the y-coordinate of the pop-up window, in pixels. 
//	iWidth Required. Integer that specifies the width of the pop-up window, in pixels. 
//	iHeight Required. Integer that specifies the height of the pop-up window, in pixels. 
//	oElement Optional. Object that specifies the element to which the x,y coordinates are relative. 
//  .If none is given, the x,y coordinates are relative to the desktop, where (0,0) is the upper left corner. 
}

function ClosePopup(){
	p.show();
	pbody.innerHTML = '';
}

function SortIt(TheArr, us, u, vs, v, ws, w, xs, x, ys, y, zs, z){
                // us-zs: 1=asc, -1=desc.  u-z: column-numbers.  See example
                
                if (u == undefined) {
                    TheArr.sort(Sortsingle);
                } // if this is a simple array, not multi-dimensional, ie, SortIt(TheArr,1): ascending.
                else {
                    TheArr.sort(Sortmulti);
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
