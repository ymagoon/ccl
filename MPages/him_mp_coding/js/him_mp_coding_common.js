function AutoSuggestControl(oComponent,oQueryHandler,oSelectionHandler,oSuggestionDisplayHandler){this.cur=0;
this.layer=null;
this.component=oComponent;
this.queryHandler=oQueryHandler;
this.selectionHandler=oSelectionHandler;
this.suggestionDisplayHandler=oSuggestionDisplayHandler;
this.textbox=_g(oComponent.getStyles().getNameSpace()+"ContentCtrl"+oComponent.getComponentId());
this.objArray="";
this.init();
}AutoSuggestControl.prototype.autosuggest=function(aSuggestions){this.layer.style.width=this.textbox.offsetWidth;
this.objArray=aSuggestions;
if(aSuggestions&&aSuggestions.length>0){this.showSuggestions(aSuggestions);
}else{this.hideSuggestions();
}};
AutoSuggestControl.prototype.createDropDown=function(){var oThis=this;
this.layer=document.createElement("div");
this.layer.className="suggestions";
this.layer.style.visibility="hidden";
this.layer.style.width=this.textbox.offsetWidth;
this.layer.onmousedown=this.layer.onmouseup=this.layer.onmouseover=function(oEvent){oEvent=oEvent||window.event;
oTarget=oEvent.target||oEvent.srcElement;
if(oEvent.type=="mousedown"){var index=AutoSuggestControl.prototype.indexOf(this,oTarget);
oThis.selectionHandler(oThis.objArray[index],oThis.textbox,oThis.component);
oThis.hideSuggestions();
}else{if(oEvent.type=="mouseover"){var index=AutoSuggestControl.prototype.indexOf(this,oTarget);
oThis.cur=index;
oThis.highlightSuggestion(oTarget);
}else{oThis.textbox.focus();
}}};
document.body.appendChild(this.layer);
};
AutoSuggestControl.prototype.getLeft=function(){var oNode=this.textbox;
var iLeft=0;
while(oNode&&oNode.tagName!="BODY"){iLeft+=oNode.offsetLeft;
oNode=oNode.offsetParent;
}return iLeft;
};
AutoSuggestControl.prototype.getTop=function(){var oNode=this.textbox;
var iTop=0;
while(oNode&&oNode.tagName!="BODY"){iTop+=oNode.offsetTop;
oNode=oNode.offsetParent;
}return iTop;
};
AutoSuggestControl.prototype.handleKeyDown=function(oEvent){if(this.layer.style.visibility!="hidden"){switch(oEvent.keyCode){case 38:this.previousSuggestion();
break;
case 40:this.nextSuggestion();
break;
case 13:this.selectionHandler(this.objArray[this.cur],this.textbox,this.component);
this.hideSuggestions();
break;
}}};
AutoSuggestControl.prototype.handleKeyUp=function(oEvent){var iKeyCode=oEvent.keyCode;
if(iKeyCode==8||iKeyCode==46){if(this.textbox.value.length>0){this.queryHandler(this,this.textbox,this.component);
}else{this.hideSuggestions();
}}else{if(iKeyCode<32||(iKeyCode>=33&&iKeyCode<46)||(iKeyCode>=112&&iKeyCode<=123)){}else{this.queryHandler(this,this.textbox,this.component);
}}};
AutoSuggestControl.prototype.hideSuggestions=function(){this.layer.style.visibility="hidden";
};
AutoSuggestControl.prototype.highlightSuggestion=function(oSuggestionNode){for(var i=0;
i<this.layer.childNodes.length;
i++){var oNode=this.layer.childNodes[i];
if(oNode==oSuggestionNode||oNode==oSuggestionNode.parentNode){oNode.className="current";
}else{if(oNode.className=="current"){oNode.className="";
}}}};
AutoSuggestControl.prototype.init=function(){var oThis=this;
this.textbox.onkeyup=function(oEvent){if(!oEvent){oEvent=window.event;
}oThis.handleKeyUp(oEvent);
};
this.textbox.onkeydown=function(oEvent){if(!oEvent){oEvent=window.event;
}oThis.handleKeyDown(oEvent);
};
this.textbox.onblur=function(){oThis.hideSuggestions();
};
this.createDropDown();
};
AutoSuggestControl.prototype.nextSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur<cSuggestionNodes.length-1){var oNode=cSuggestionNodes[++this.cur];
this.highlightSuggestion(oNode);
}};
AutoSuggestControl.prototype.previousSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur>0){var oNode=cSuggestionNodes[--this.cur];
this.highlightSuggestion(oNode);
}};
AutoSuggestControl.prototype.showSuggestions=function(aSuggestions){var oDiv=null;
this.layer.innerHTML="";
for(var i=0;
i<aSuggestions.length;
i++){oDiv=document.createElement("div");
if(i==0){oDiv.className="current";
}this.cur=0;
var domText=this.suggestionDisplayHandler(aSuggestions[i],this.textbox.value);
oDiv.innerHTML=domText;
oDiv.appendChild(document.createTextNode(""));
this.layer.appendChild(oDiv);
}this.layer.style.left=this.getLeft()+"px";
this.layer.style.top=(this.getTop()+this.textbox.offsetHeight)+"px";
this.layer.style.visibility="visible";
this.layer.style.position="absolute";
};
AutoSuggestControl.prototype.indexOf=function(parent,el){var nodeList=parent.childNodes;
for(var i=0;
i<nodeList.length;
i++){var oNode=nodeList[i];
if(oNode==el||oNode==el.parentNode){return i;
}}return -1;
};
AutoSuggestControl.prototype.highlight=function(value,term){return"<strong>"+value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1").split(" ").join("|")+")(?![^<>]*>)(?![^&;]+;)","gi"),"</strong>$1<strong>")+"</strong>";
};
/**
 * Handles utility functions for Coding mPage.
 * 
 * @author Devin Kelly-Collins
 */
var HIM_Coding_Util = new function() {
	return {

		/**
		 * Sets the mp formatter locale to the default locale, which is English
		 * US.
		 */
		setMpFormatterLocale : function() {
			if (!window.MPAGE_LOCALE) {
				window.MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC.en_US);
			}
		},

		/**
		 * Creates the component mapping.
		 */
		createComponentMappings : function(prefix) {
			var mappings = [];

			function CreateComponentMapping(fullComponentName, constructorName) {
				var componentConstructor = window[constructorName];
				if (componentConstructor) {
					mappings.push(new MP_Core.MapObject(fullComponentName, componentConstructor));
				}
			}

			CreateComponentMapping(prefix + "_reg_dschg", "RegistrationDischargeInfoComponent");
			CreateComponentMapping(prefix + "_clin_doc", "DocumentComponent");
			CreateComponentMapping(prefix + "_diagnosis", "DiagnosesComponent");
			CreateComponentMapping(prefix + "_lab", "LaboratoryComponent");
			CreateComponentMapping(prefix + "_weight", "WeightsComponent");
			CreateComponentMapping(prefix + "_meds", "MedicationsComponent");
			CreateComponentMapping(prefix + "_micro_pathnet", "MicrobiologyComponent");
			CreateComponentMapping(prefix + "_path", "PathologyComponent");
			CreateComponentMapping(prefix + "_resp", "RespiratoryComponent");
			CreateComponentMapping(prefix + "_past_med_hx", "PastMedicalHistoryComponent");
			CreateComponentMapping(prefix + "_pt_info", "PatientInfoComponent");
			CreateComponentMapping(prefix + "_problem", "ProblemsComponent");
			CreateComponentMapping(prefix + "_proc_hx", "ProcedureComponent");
			CreateComponentMapping(prefix + "_incomplete_orders", "OrdersComponent");
			CreateComponentMapping(prefix + "_social_hx", "SocialHistoryComponent");
			CreateComponentMapping(prefix + "_visits", "VisitsComponent");
			CreateComponentMapping(prefix + "_con_prob", "CvComponent");
			CreateComponentMapping(prefix + "_lines", "LinesTubesDrainsComponent");
			CreateComponentMapping(prefix + "_resp_tx", "RespTreatmentsComponent");
			CreateComponentMapping(prefix + "_resp_assess", "RespAssessmentsComponent");
			CreateComponentMapping(prefix + "_immunizations", "ImmunizationComponent");
			CreateComponentMapping(prefix + "_pt_assess", "PatientAssessmentComponent");
			CreateComponentMapping(prefix + "_rad", "DiagnosticsComponent");
			CreateComponentMapping(prefix + "_activities", "ActivitiesComponent");
			CreateComponentMapping(prefix + "_pt_background", "PatientBackgroundComponent");
			CreateComponentMapping(prefix + "_vs", "VitalSignComponent");
			CreateComponentMapping(prefix + "_social", "SocialComponent");
			CreateComponentMapping(prefix + "_procedures", "ProceduresComponent")
			CreateComponentMapping("mp_cust_comp_1", "CustomComponent");
			CreateComponentMapping("mp_cust_comp_2", "CustomComponent");

			return mappings;
		},

		/**
		 * Creates the function mapping.
		 */
		createFuncMapping : function(prefix) {
			var functionMappings = new Array(
					new MP_Core.MapObject(
							prefix + '_reg_dschg',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "ENC_TYPE_IND", "NAME": "rdiComponentRows[component.ENCOUNTER_TYPE_ROW].setEnabled", "TYPE":"Boolean", "FIELD":"FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ENC_TYPE_NAME", "NAME": "rdiComponentRows[component.ENCOUNTER_TYPE_ROW].setDisplay", "TYPE":"String", "FIELD":"FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ENC_TYPE_SEQ", "NAME": "rdiComponentRows[component.ENCOUNTER_TYPE_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ATTEND_PHYS_IND", "NAME": "rdiComponentRows[component.ATTENDING_PHYSICIAN_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ATTEND_PHYS_NAME", "NAME": "rdiComponentRows[component.ATTENDING_PHYSICIAN_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ATTEND_PHYS_NAME_SEQ", "NAME": "rdiComponentRows[component.ATTENDING_PHYSICIAN_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "FACILITY_IND", "NAME": "rdiComponentRows[component.FACILITY_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "FACILITY_NAME", "NAME": "rdiComponentRows[component.FACILITY_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "FACILITY_NAME_SEQ", "NAME": "rdiComponentRows[component.FACILITY_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "PAYER_IND", "NAME": "rdiComponentRows[component.PAYER_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "PAYER_NAME", "NAME": "rdiComponentRows[component.PAYER_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "PAYER_NAME_SEQ", "NAME": "rdiComponentRows[component.PAYER_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECOND_PAYER_IND", "NAME": "rdiComponentRows[component.SECONDARY_PAYER_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECOND_PAYER_NAME", "NAME": "rdiComponentRows[component.SECONDARY_PAYER_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECOND_PAYER_NAME_SEQ", "NAME": "rdiComponentRows[component.SECONDARY_PAYER_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "REG_DATE_IND", "NAME": "rdiComponentRows[component.REGISTRATION_DATE_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "REG_DATE_NAME", "NAME": "rdiComponentRows[component.REGISTRATION_DATE_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "REG_DATE_NAME_SEQ", "NAME": "rdiComponentRows[component.REGISTRATION_DATE_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ADMIT_DATE_IND", "NAME": "rdiComponentRows[component.ADMIT_DATE_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ADMIT_DATE_NAME", "NAME": "rdiComponentRows[component.ADMIT_DATE_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ADMIT_DATE_NAME_SEQ", "NAME": "rdiComponentRows[component.ADMIT_DATE_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ADMIT_SOURCE_IND", "NAME": "rdiComponentRows[component.ADMIT_SOURCE_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ADMIT_SOURCE_NAME", "NAME": "rdiComponentRows[component.ADMIT_SOURCE_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ADMIT_SOURCE_NAME_SEQ", "NAME": "rdiComponentRows[component.ADMIT_SOURCE_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DISCHG_DATE_IND", "NAME": "rdiComponentRows[component.DISCHARGE_DATE_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DISCHG_DATE_NAME", "NAME": "rdiComponentRows[component.DISCHARGE_DATE_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DISCHG_DATE_NAME_SEQ", "NAME": "rdiComponentRows[component.DISCHARGE_DATE_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DISCHG_DISP_IND", "NAME": "rdiComponentRows[component.DISCHARGE_DISPOSITION_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DISCHG_DISP_NAME", "NAME": "rdiComponentRows[component.DISCHARGE_DISPOSITION_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DISCHG_DISP_NAME_SEQ", "NAME": "rdiComponentRows[component.DISCHARGE_DISPOSITION_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DISCHG_LOC_IND", "NAME": "rdiComponentRows[component.DISCHARGE_LOCATION_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DISCHG_LOC_NAME", "NAME": "rdiComponentRows[component.DISCHARGE_LOCATION_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DISCHG_LOC_NAME_SEQ", "NAME": "rdiComponentRows[component.DISCHARGE_LOCATION_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DATE_DEATH_IND", "NAME": "rdiComponentRows[component.DECEASED_DATE_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DATE_DEATH_NAME", "NAME": "rdiComponentRows[component.DECEASED_DATE_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DATE_DEATH_NAME_SEQ", "NAME": "rdiComponentRows[component.DECEASED_DATE_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "CAUSE_DEATH_IND", "NAME": "rdiComponentRows[component.CAUSE_OF_DEATH_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "CAUSE_DEATH_NAME", "NAME": "rdiComponentRows[component.CAUSE_OF_DEATH_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "CAUSE_DEATH_NAME_SEQ", "NAME": "rdiComponentRows[component.CAUSE_OF_DEATH_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "LENGTH_STAY_IND", "NAME": "rdiComponentRows[component.LENGTH_OF_STAY_ROW].setEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "LENGTH_STAY_NAME", "NAME": "rdiComponentRows[component.LENGTH_OF_STAY_ROW].setDisplay", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "LENGTH_STAY_NAME_SEQ", "NAME": "rdiComponentRows[component.LENGTH_OF_STAY_ROW].setSequence", "TYPE":"String", "FIELD": "FREETEXT_DESC"}'
									+ ']}'),
					new MP_Core.MapObject(
							prefix + '_pt_info',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "REASON_IND", "NAME":"setRFVDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "PRIMARY_DR_IND", "NAME":"setPrimaryPhysDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ATTEND_DR_IND", "NAME":"setAttendingPhysDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ADMIT_DR_IND", "NAME":"setAdmittingPhysDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "RM_IND", "NAME":"setRoomBedDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ADM_DT_IND", "NAME":"setAdmitDateDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "MED_SVC_IND", "NAME":"setMedicalServiceDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ED_CONTACT_IND", "NAME":"setEmergencyContactsDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ENC_TYPE", "NAME":"setVisitTypeCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "NOTE_ES", "NAME":"setDocumentTypes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "RESUS_ORDER", "NAME":"setResusOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "MODE_ARRIVAL_CE", "NAME":"setModeofArrival", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "CHIEF_COMP_CE", "NAME":"setChiefComplaint", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "ADV_DIRECTIVE", "NAME":"setAdvancedDirectives", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "TARGET_DC_DT", "NAME":"setEstimatedDischargeDate", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'
									+ ']}'),
					new MP_Core.MapObject(
							prefix + '_con_prob',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "DEFAULT_SEARCH_VOCAB", "NAME":"setDefaultSearchVocab", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "VISIT_LABEL", "NAME":"setVisitLabel", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ACTIVE_LABEL", "NAME":"setActiveLabel", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "HISTORICAL_LABEL", "NAME":"setHistoricalLabel", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "VISIT_VOCAB", "NAME":"setVisitVocab", "TYPE":"Numeric", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "ACTIVE_VOCAB", "NAME":"setActiveVocab", "TYPE":"Numeric", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "CP_QUICK_ADD_TYPE_DX", "NAME":"setVisitAddType", "TYPE":"Numeric", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "CP_QUICK_ADD_CLASS_DX", "NAME":"setVisitAddClass", "TYPE":"Numeric", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "CP_QUICK_ADD_TYPE_CONFIRM", "NAME":"setActiveAddType", "TYPE":"Numeric", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "CP_QUICK_ADD_CLASS", "NAME":"setActiveAddClass", "TYPE":"Numeric", "FIELD": "FREETEXT_DESC"}'
									+ ']}'),
					new MP_Core.MapObject(
							prefix + '_diagnosis',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "DIAGNOSIS_TYPE", "NAME":"setDiagnosisType", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "DX_QUICK_ADD_VOCAB", "NAME":"setDiagnosisVocab", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "DX_QUICK_ADD_VOCAB_IND", "NAME":"setDiagnosisVocabInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "DX_QUICK_ADD_TYPE", "NAME":"setDiagnosisAddTypeCd", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "DX_QUICK_ADD_CLASS_DX", "NAME":"setDiagnosisClassification", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'
									+ ']}'),
					new MP_Core.MapObject(
							prefix + '_problem',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "PROB_QUICK_ADD_VOCAB", "NAME":"setProblemsVocab", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "PROB_QUICK_ADD_VOCAB_IND", "NAME":"setProblemsVocabInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "PROB_QUICK_ADD_TYPE", "NAME":"setProblemsAddTypeCd", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "PROB_QUICK_ADD_CLASS", "NAME":"setProblemsClassification", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'
									+ ']}'),
					new MP_Core.MapObject(
							prefix + '_pt_background',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "PAIN_SCR", "NAME":"setPainScores", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "ASSIST_DEV", "NAME":"setDevices", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "DIET_ORD", "NAME":"setDietOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "PT_ACT_ORD", "NAME":"setPatientActivityOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "RESUS_ORD", "NAME":"setResucitationOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SEIZURE_ORD", "NAME":"setSeizureOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "ISOLATION_ORD", "NAME":"setIsolationOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "ADV_DIR", "NAME":"setAdvancedDirectives", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "PARA", "NAME":"setParas", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "GRAVIDA", "NAME":"setGravidas", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "FALL_PRECAUTIONS", "NAME":"setFallPrecautions", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'
									+ ']}'),
					new MP_Core.MapObject(
							prefix + '_meds',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "MEDS_ADM", "NAME":"setAdministered", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "MEDS_ADM_LB_HRS", "NAME":"setAdministeredLookBkHrs", "TYPE":"Numeric", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "MEDS_CONT", "NAME":"setContinuous", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "MEDS_DISC", "NAME":"setDiscontinued", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "MEDS_DISC_LB_HRS", "NAME":"setDiscontinuedLookBkHr", "TYPE":"Numeric", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "MEDS_PRN", "NAME":"setPRN", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "MEDS_SCHED", "NAME":"setScheduled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "MEDS_SUS", "NAME":"setSuspended", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}'
									+ ']}'),
					new MP_Core.MapObject(
							prefix + '_lab',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "LAB_PRIMARY_LABEL", "NAME":"setPrimaryLabel", "TYPE":"String", "FIELD": "FREETEXT_DESC"}'
									+ ']}'),
					new MP_Core.MapObject(
							prefix + '_procedures',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "SECTION1_IND", "NAME":"setSection1Active", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION1_DISPLAY", "NAME":"setSection1Name", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION1_PROC", "NAME":"setSection1EventSets", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SECTION2_IND", "NAME":"setSection2Active", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION2_DISPLAY", "NAME":"setSection2Name", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION2_PROC", "NAME":"setSection2EventSets", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SECTION3_IND", "NAME":"setSection3Active", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION3_DISPLAY", "NAME":"setSection3Name", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION3_PROC", "NAME":"setSection3EventSets", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SECTION4_IND", "NAME":"setSection4Active", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION4_DISPLAY", "NAME":"setSection4Name", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION4_PROC", "NAME":"setSection4EventSets", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SECTION5_IND", "NAME":"setSection5Active", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION5_DISPLAY", "NAME":"setSection5Name", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION5_PROC", "NAME":"setSection5EventSets", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SECTION6_IND", "NAME":"setSection6Active", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION6_DISPLAY", "NAME":"setSection6Name", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION6_PROC", "NAME":"setSection6EventSets", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SECTION7_IND", "NAME":"setSection7Active", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION7_DISPLAY", "NAME":"setSection7Name", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION7_PROC", "NAME":"setSection7EventSets", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SECTION8_IND", "NAME":"setSection8Active", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION8_DISPLAY", "NAME":"setSection8Name", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION8_PROC", "NAME":"setSection8EventSets", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SECTION9_IND", "NAME":"setSection9Active", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION9_DISPLAY", "NAME":"setSection9Name", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION9_PROC", "NAME":"setSection9EventSets", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SECTION10_IND", "NAME":"setSection10Active", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION10_DISPLAY", "NAME":"setSection10Name", "TYPE":"String", "FIELD": "FREETEXT_DESC"},'
									+ '{"FILTER_MEAN": "SECTION10_PROC", "NAME":"setSection10EventSets", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'
									+ ']}'),
					new MP_Core.MapObject(
							prefix + '_lines',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "LINES_ES", "NAME":"setLineCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "TUBES_DRAINS_ES", "NAME":"setTubeCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'
									+ ']}'),
					new MP_Core.MapObject(
							prefix + '_resp',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "VENT_MODE", "NAME":"setVentilatorModeCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SET_TIDAL_VOL", "NAME":"setTidalVolCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "SET_RATE", "NAME":"setSetRateCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "FIO2", "NAME":"setFIO2Codes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "PEEP", "NAME":"setPEEPCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "FLOW_RATE", "NAME":"setO2FlowRateCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "RESP_RATE", "NAME":"setRespiratoryRateCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "MIN_VOL", "NAME":"setMinVolCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "INSP_SET_TIME", "NAME":"setInspTimeSetCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "INSP_TIME_DEL", "NAME":"setInspTimeDelCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "RESP_OTHER", "NAME":"setABGCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'
									+ ']}'),											
					new MP_Core.MapObject(
							prefix + '_incomplete_orders',
							'{"FUNCTIONS":['
									+ '{"FILTER_MEAN": "INCOMPLETE_ORDERS_CAT_TYPE", "NAME":"setCatalogCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'
									+ '{"FILTER_MEAN": "INCOMPLETE_ORDERS_STATUS", "NAME":"setOrderStatuses", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'
									+ ']}'));
			return functionMappings;
		},

		/**
		 * Handles the insert data calls for all components in the mPage.
		 */
		insertData : function(mPage) {
			var components = mPage.getComponents();
			if (components == null) {
				return;
			}
			for ( var pos = 0; pos < components.length; pos++) {
				components[pos].InsertData();
			}
		}
	}
}