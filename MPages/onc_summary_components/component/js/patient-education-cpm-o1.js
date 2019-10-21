/**
 * Create the Patient Education component style object
 * @constructor
 */
function PatientEdComponentCPMStyle() {
	this.initByNamespace("patientEdCPM");
}

PatientEdComponentCPMStyle.prototype = new ComponentStyle();
PatientEdComponentCPMStyle.prototype.constructor = ComponentStyle;

/**
 * The Patient Education component will retrieve Education materials related to the current condition
 *
 * @constructor
 * @param {Criterion} criterion - The Criterion object
 */
function PatientEdComponentCPM(criterion) {
	var cpmDocI18n = i18n.discernabu.patient_education_cpm_o1;
	this.setCriterion(criterion);
	this.setStyles(new PatientEdComponentCPMStyle());
	this.setComponentLoadTimerName("USR:MPG.RELPATED.CPM - load component");
	this.setComponentRenderTimerName("ENG:MPG.RELPATED.CPM - render component");
	this.setLabel(cpmDocI18n.LABEL);
	this.m_docKeys = [];
	this.setConceptGroupMeanings("RELPATED");
}

PatientEdComponentCPM.prototype = new CPMMPageComponent();
PatientEdComponentCPM.prototype.constructor = PatientEdComponentCPM;

CPMMPageComponent.attachMethods(PatientEdComponentCPM);

PatientEdComponentCPM.prototype.setDocKeys = function(docKeys){
	this.m_docKeys = docKeys;
};

PatientEdComponentCPM.prototype.getDocKeys = function(){
	return this.m_docKeys;
};
/**
* Processes configuration gathered from CPM architecture and passed to this component
* @param {Object} componentConfig: Object containing config data for Patient Education component
* @param {Object} conceptGroupConfig - Object containing config for the concept group
* @return {undefined} if conceptGroupConfig is undefined.
*/
PatientEdComponentCPM.prototype.processComponentConfig = function(componentConfig, conceptGroupConfig){
	if (!conceptGroupConfig || !conceptGroupConfig.length){
		return;
	}
	CPMMPageComponent.prototype.processComponentConfig.call(this, componentConfig, conceptGroupConfig);
	var detailList;
	var cLen;
	var i;
	var x;
	var xl;
	var docKeyArray = [];
	cLen = conceptGroupConfig.length;
	for (i = 0; i < cLen; i++){
		if(conceptGroupConfig[i].CONCEPT_GROUP_CD_MEAN == "RELPATED"){
			detailList = conceptGroupConfig[i].CG_DTL_LIST;
			for(x = 0, xl = detailList.length; x < xl; x++){
				if(detailList[x].CONCEPT_ENTITY_IDENT !== ""){
					docKeyArray.push("^" + detailList[x].CONCEPT_ENTITY_IDENT + "^");
				}
			}
		}
	}
    
    cLen = componentConfig.length;
    for (i = 0; i < cLen; i++){
        detailList =  componentConfig[i]
        if(detailList.ENTITY_IDENT !== ""){
            docKeyArray.push("^" + detailList.ENTITY_IDENT + "^"); 
        }
    }
    
	this.setDocKeys(docKeyArray);
};
/**
* Sets initial parameters and calls load script to gather Patient Education Data
*/
PatientEdComponentCPM.prototype.retrieveComponentData = function() {
	var self = this;
	var params = ["^MINE^", "value(" + this.getDocKeys() + ")", this.getCriterion().person_id, this.getCriterion().encntr_id + ".0", 0.0, 0.0, 1];
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("MP_GET_PAT_ED_DETAILS");
	scriptRequest.setParameterArray(params);
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(function(scriptReply){
		self.renderComponent(scriptReply.getResponse());
	});
	scriptRequest.performRequest();
};

/**
* Processes data from initial load script and creates the front end markup
* @param {object} reply : Response object containing data
*/
PatientEdComponentCPM.prototype.renderComponent = function(reply) {
	var cpmDocI18n = i18n.discernabu.patient_education_cpm_o1;
	var self = this;
	var html = "";
	var componentId = this.getStyles().getId();
	var criterion = this.getCriterion();
	var patEd = reply.QUAL;
	var patEdLength = reply.CNT;
	var patEdList = [];
	var domainCds = reply.DOMAIN_CDS;
	var domainCdLength = domainCds.length;
	var langIds = reply.LANGUAGES;
	var langLength = langIds.length;
	var existingPatEd = reply.EXISTING_QUAL;
	var existingPatEdLength = existingPatEd.length;
	var existingPatEdList = [];
	var x = 0;
	var y = 0;
	var i = 0;
	var z = 0;
	//Set up array for the Available Instructions ComponentTable
	for(i = 0;i < patEdLength; i++){
		patEdList.push({
			"LABEL": patEd[i].DESCRIPTION,
			"KEY_DOC_IDENT": patEd[i].KEY_DOC_IDENT,
			"PAT_ED_RELTN_ID": patEd[i].PAT_ED_RELTN_ID,
			"DESCRIPTION": patEd[i].DESCRIPTION,
			"DOMAIN_CD": patEd[i].PAT_ED_DOMAIN_CD,
			"LANGUAGE_VAL": patEd[i].DOC_LANG_ID_VALUE
		});
	}
	//Set up array for the Existing Instructions ComponentTable
	for(y = 0;y < existingPatEdLength; y++){
		existingPatEdList.push({
			"LABEL": existingPatEd[y].DESCRIPTION,
			"PAT_ED_DOC_ACTIVITY_ID": existingPatEd[y].PAT_ED_DOC_ACTIVITY_ID,
			"PAT_ED_RELTN_ID": existingPatEd[y].PAT_ED_RELTN_ID
		});
	}
	html += "<div class='pated-cpm-left-container'>";
	html += "<div id='" + componentId + "patEdDiv' class='pated-cpm-form-container'>";
	//Create dropdown with available Content Domain codes, select the one flagged as default
	if(domainCds && domainCdLength > 0){
		var domains;
		html += "<form class ='pated-cpm-form pated-content-domain'><span>" + cpmDocI18n.CONTENT_DOMAIN + "&nbsp;</span><select id='" + componentId + "ContentSelect' name='Content Domain'>";
		for(x = 0;x < domainCdLength;x++){
			domains = domainCds[x];
			if(domains.DEFAULT === 1){
				html += "<option value='" + domains.DOMAIN_CD + "' selected>" + domains.DISPLAY + "</option>";
			}else{
				html += "<option value='" + domains.DOMAIN_CD + "'>" + domains.DISPLAY + "</option>";
			}
		}
	}
	html += "</select>&nbsp;</form>";
	//Create dropdown with available Language codes, select the one flagged as default
	html += "<form class='pated-cpm-form pated-language'><span>" + cpmDocI18n.LANGUAGE + "&nbsp;</span><select id='" + componentId + "LangSelect' name='Language'>";
	var language;
	for(z = 0;z < langLength; z++){
		language = langIds[z];
		if(language.DEFAULT === 1){
			html += "<option value='" + language.DOC_LANG_ID_VALUE + "' selected>" + language.DISPLAY + "</option>";
		}else{
			html += "<option value='" + language.DOC_LANG_ID_VALUE + "'>" + language.DISPLAY + "</option>";
		}
	}
	html += "</select></form>";
	html += "</div>";
	//Create Table of Available Instructions to add using ComponentTable API
	html += "<div class = 'pat-ed-cpm-instr-div pat-ed-cpm-avail-instr-div'>";
	var patEdTable = new ComponentTable();
	patEdTable.setNamespace(componentId + "PatEdTable");
	patEdTable.setCustomClass("pated-cpm-table");
	patEdTable.setZebraStripe(false);
	patEdTable.setIsHeaderEnabled(false);
	
	var labelColumn = new TableColumn();
	labelColumn.setColumnId("LABEL");
	labelColumn.setCustomClass("pated-cpm-table-label-col pated-cpm-list-item");
	labelColumn.setRenderTemplate("${LABEL}");
	
	var addButtonColumn = new TableColumn();
	addButtonColumn.setColumnId("PAT_ED_ADD_BUTTON");
	addButtonColumn.setCustomClass("pated-cpm-table-btn-col");
	addButtonColumn.setRenderTemplate("<button class='pated-cpm-button'>" + cpmDocI18n.ADD_BUTTON + "</button>");
	
	patEdTable.addColumn(labelColumn);
	patEdTable.addColumn(addButtonColumn);
	patEdTable.bindData(patEdList);
	var counter = 0;
	var addPatientEducation = new TableCellClickCallbackExtension();
	addPatientEducation.setCellClickCallback(function(event, data){
		var instruction = data.RESULT_DATA;
		var target = event.target;
		/*
		* Click patient education list item to add to existing patient education list
		*/
		if (target.classList.contains("pated-cpm-button")){
			if (instruction){
				var sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", 0, instruction.PAT_ED_RELTN_ID + ".0", 0, 1, "^" + instruction.DESCRIPTION + "^", instruction.DOMAIN_CD + ".0", instruction.LANGUAGE_VAL + ".0", "^" + instruction.KEY_DOC_IDENT + "^", 0];
				MP_Util.LoadSpinner(componentId + "patEdDiv");
				counter++;
				self.addRemoveInstruction(sendAr, counter);
			}
		}
	});
	patEdTable.addExtension(addPatientEducation);
	html += patEdTable.render();
	html += "</div>";
	html += "</div>";
	//Create table of Existing Instructions on this encounter using ComponentTable API
	html += "<div class='pated-cpm-right-container'>";
	html += "<div class='pat-ed-cpm-instr-div instructions'>";
	if(existingPatEdLength > 0){
		var existingPatEdTable = new ComponentTable();
		existingPatEdTable.setNamespace(componentId + "ExistingPatEdTable");
		existingPatEdTable.setCustomClass("pated-cpm-table");
		existingPatEdTable.setZebraStripe(false);
		existingPatEdTable.setIsHeaderEnabled(true);
		
		var existingLabelColumn = new TableColumn();
		existingLabelColumn.setColumnDisplay(cpmDocI18n.ADDED_PATIENT_EDUCATION);
		existingLabelColumn.setColumnId("LABEL");
		existingLabelColumn.setCustomClass("pated-cpm-table-label-col");
		existingLabelColumn.setRenderTemplate("${LABEL}");
		
		var removeButton = new TableColumn();
		removeButton.setColumnId("PAT_ED_REMOVE_BUTTON");
		removeButton.setCustomClass("pat-ed-cpm remove-button");
		removeButton.setRenderTemplate("<span class='pated-remove-icon'></span>");
		
		existingPatEdTable.addColumn(existingLabelColumn);
		existingPatEdTable.addColumn(removeButton);
		existingPatEdTable.bindData(existingPatEdList);
		var removePatientEducation = new TableCellClickCallbackExtension();
		removePatientEducation.setCellClickCallback(function(event, data){
			var existingInstruction = data.RESULT_DATA;
			var target = event.target;
			if (data.COLUMN_ID !== "PAT_ED_REMOVE_BUTTON"){
				return;
			}
			/*
			 * Click Remove Icon
			 */
			else if (target.classList.contains("pated-remove-icon")){
				if (existingInstruction){
					var sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", 0, existingInstruction.PAT_ED_DOC_ACTIVITY_ID + ".0", 0, 1, "^" + existingInstruction.DESCRIPTION + "^", 0 + ".0", 0 + ".0", "^^", 1];
					MP_Util.LoadSpinner(componentId + "patEdDiv");
					self.addRemoveInstruction(sendAr);
				}
			}
		});
		existingPatEdTable.addExtension(removePatientEducation);
		html += existingPatEdTable.render();
	}else{
		html += "<div class='no-pated'>";
		html += "<span class='pated-patient-education-icon'></span>";
		html += "<span>" + cpmDocI18n.NO_INSTRUCTIONS_FOUND + "</span>";
		html += "</div>";
	}
	html += "</div>";
	html += "</div>";
	html += "</div>";
	this.finalizeComponent(html, "");
	var jqFormContainer = $("#" + componentId + "patEdDiv");
	jqFormContainer.on("change", "select", function(event){
		MP_Util.LoadSpinner(componentId + "patEdDiv");
		self.attachEventHandlers(event);
	});
	patEdTable.finalize();
	existingPatEdTable.finalize();
};

/**
 * Attach event handlers for clicking on CPMs in the list
 * and changing Content Domain / language drop downs
 * @param {event} event - The event object to keep track of what was selected
 */
PatientEdComponentCPM.prototype.attachEventHandlers = function(event){
	var eventType = event.type;
	var componentId = this.getStyles().getId();
	var langSelectBox = $("#" + componentId + "LangSelect");
	var domainSelectBox = $("#" + componentId + "ContentSelect");
	var jqSelected = $(event.target);
	var id = jqSelected.prop("id");
	if(eventType === "change" && (id === componentId + "LangSelect" || id === componentId + "ContentSelect")){
		var selectedLanguageId = null;
		if(langSelectBox.length > 0){
			selectedLanguageId = langSelectBox.val();
		}else{
			selectedLanguageId = 0.0;
		}
		var selectedDomainCd = domainSelectBox.val();
		this.updateComponent(selectedDomainCd, selectedLanguageId);
	}
};

/**
* Adds or removes a patient education instruction to/from the patient's encounter
* Then calls a method to update the component with the latest data
* @param {array} params: array of parameters to be passed to the CCL program
* @param {number} counter: A counter to keep track of when to update the component.
*/
PatientEdComponentCPM.prototype.addRemoveInstruction = function(params, counter) {
	var self = this;
	var componentId = this.getStyles().getId();
	var langSelectBox = $("#" + componentId + "LangSelect");
	var domainSelectBox = $("#" + componentId + "ContentSelect");
	var selectedLanguageId = null;
	if(langSelectBox.length > 0){
		selectedLanguageId = langSelectBox.val();
	}else{
		selectedLanguageId = 0.0;
	}
	var selectedContentCd = domainSelectBox.val();
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("MP_ADD_UPD_PAT_EDU");
	scriptRequest.setParameterArray(params);
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(function(scriptReply){
		self.updateComponent(selectedContentCd, selectedLanguageId, counter);
	});
	scriptRequest.performRequest();
};

/**
* Calls the initial load script with appropriate parameters after the content or
* language dropdown is changed to a different value or an Instruction is added/removed
* @param {number} contentCd: Content Domain Code currently selected
* @param {number} langId: Language code currently selected
* @param {number} counter: A counter to keep track of when to update the component
*/
PatientEdComponentCPM.prototype.updateComponent = function(contentCd, langId, counter){
	var self = this;
	var params = ["^MINE^", "value(" + this.getDocKeys() + ")", this.getCriterion().person_id, this.getCriterion().encntr_id + ".0", contentCd + ".0", langId + ".0", 1];
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("MP_GET_PAT_ED_DETAILS");
	scriptRequest.setParameterArray(params);
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(function(scriptReply){
		self.renderComponent(scriptReply.getResponse());
	});
	scriptRequest.performRequest();
	counter = 0;
};

/**
 * Map the Patient Education object to the bedrock filter mapping so the architecture will know what object to create
 */
CPMController.prototype.addComponentMapping("PATED", PatientEdComponentCPM);