/*
 *Outcomes/Goals
 */

function OutcomesCPMComponentStyle() {
	this.initByNamespace("outcomesCPM");
}

OutcomesCPMComponentStyle.prototype = new ComponentStyle();
OutcomesCPMComponentStyle.prototype.constructor = ComponentStyle;

function OutcomesCPMComponent(criterion) {
	var i18nObj = i18n.discernabu.outcomes_cpm_o1;
	this.setCriterion(criterion);
	this.setStyles(new OutcomesCPMComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.RELOUTCOMES.CPM - load component");
	this.setComponentRenderTimerName("ENG:MPG.RELOUTCOMES.CPM - render component");
	this.setScope(1);
	this.setLabel(i18nObj.LABEL); //May need to go in preprocessing
	this.m_cpmOutcomes = null;
	this.setConceptGroupMeanings("RELOUTCOMES");
}

OutcomesCPMComponent.prototype = new CPMMPageComponent();
OutcomesCPMComponent.prototype.constructor = OutcomesCPMComponent;

CPMMPageComponent.attachMethods(OutcomesCPMComponent);

OutcomesCPMComponent.prototype.getGoalResultEventSet = function () {
	return this.m_goalResultId;
};

OutcomesCPMComponent.prototype.setGoalResultEventSet = function (id) {
	if (typeof id !== "number") {
		throw new Error("Type Error: Non-number type 'id' passed into OutcomesCPMComponent method 'setGoalResultEventSet'");
	}
	this.m_goalResultId = id;
};

OutcomesCPMComponent.prototype.getCPMOutcomes = function () {
	if (!this.m_cpmOutcomes) {
		this.m_cpmOutcomes = [];
	}
	return this.m_cpmOutcomes;
};

OutcomesCPMComponent.prototype.processResultsForTable = function (results) {
	var dateTime = null;
	var dateStr = "";
	var timeStr = "";
	var arrLen = 0;
	var dsResult = null;
	var df = MP_Util.GetDateFormatter();

	for (arrLen = results.length; arrLen--; ) {
		dateStr = "";
		timeStr = "";
		dsResult = results[arrLen];
		dateTime = new Date();
		if (dsResult.STARTDTTM) {
			dateTime.setISO8601(dsResult.STARTDTTM);
			dateStr = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
			timeStr = df.format(dateTime, mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS);
		}
		dsResult["FORMATTED_DATE"] = dateStr;
		dsResult["FORMATTED_TIME"] = timeStr;
	}
};

OutcomesCPMComponent.prototype.buildTable = function (table, objData) {
	var i18nObj = i18n.discernabu.outcomes_cpm_o1;
	table.setNamespace(this.getStyles().getId());
	table.setZebraStripe(true);
	//Name|Start date/time
	var nameColumn = new TableColumn();
	nameColumn.setColumnId("NAME");
	nameColumn.setColumnDisplay(i18nObj.DESCRIPTION);
	nameColumn.setCustomClass("io-dstates-name-col");
	nameColumn.setIsSortable(false);
	nameColumn.setRenderTemplate("<div>${DESCRIPTION}</div>");

	var sDateColumn = new TableColumn();
	sDateColumn.setColumnId("SDATE");
	sDateColumn.setColumnDisplay(i18nObj.STARTDATE);
	sDateColumn.setCustomClass("io-dstates-sdate-col");
	sDateColumn.setIsSortable(false);
	sDateColumn.setRenderTemplate("<span class='io-dstates-sdate-date'>${FORMATTED_DATE}</span><span class='io-dstates-sdate-time'>${FORMATTED_TIME}</span>");

	var expectColumn = new TableColumn();
	expectColumn.setColumnId("EXPECT");
	expectColumn.setColumnDisplay(i18nObj.EXPECTATION);
	expectColumn.setCustomClass("io-dstates-expect-col");
	expectColumn.setIsSortable(false);
	expectColumn.setRenderTemplate("<div>${EXPECTATION}</div>");

	table.addColumn(nameColumn);
	table.addColumn(sDateColumn);
	table.addColumn(expectColumn);

	table.bindData(objData);
};

//filter by outcome catalog cd
OutcomesCPMComponent.prototype.processComponentConfig = function (componentConfig, conceptGroupConfig) {
	if (!conceptGroupConfig || !conceptGroupConfig.length) {
		return;
	}
	CPMMPageComponent.prototype.processComponentConfig.call(this, componentConfig, conceptGroupConfig);
	var CPMOutcomes = this.getCPMOutcomes();
	var detailList;
	var cLen;
	var i;
	var x;
	var xl;

	cLen = conceptGroupConfig.length;
    for (i = 0; i < cLen; i++){
        if(conceptGroupConfig[i].CONCEPT_GROUP_CD_MEAN === "RELOUTCOMES"){
            detailList = conceptGroupConfig[i].CG_DTL_LIST;
            for(x = 0, xl = detailList.length; x < xl; x++){
				if (detailList[x].CONCEPT_ENTITY_NAME === "OUTCOME_CATALOG") {
					CPMOutcomes.push(detailList[x].CONCEPT_ENTITY_ID);
				}
            }
        }
    }
};

OutcomesCPMComponent.prototype.buildNewSection = function () {
	var html = "";
	//Create Container...
	html += "<div class='io-dstates-new-cont'>";
	//...and text box
	html += "<input id='ioDesStatesNewTxt" + this.getStyles().getId() + "' class='io-dstates-new-txt-box' maxlength='100' />";
	//Closing tags
	html += "</div>";
	return html;
};

OutcomesCPMComponent.prototype.retrieveComponentData = function () {
	var i18nObj = i18n.discernabu.outcomes_cpm_o1;
	var self = this;
	var criterion = this.getCriterion();
	var sendAr = [];
	var request;
	/*
	Parameters for inn_get_outcomes_by_event
	^MINE^ - output
	patient id
	encounter
	outcomes
	*/
	var outcomesArr = this.getCPMOutcomes();
	var outcomesParam = outcomesArr.length ? MP_Util.CreateParamArray(outcomesArr, 1) : "0.0";
	sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", "0", outcomesParam);
	//Create and configure request
	request = new MP_Core.ScriptRequest(this, "ENG:OutcomesCPMComponent_RetrieveDesiredStates");
	request.setParameters(sendAr);
	request.setName("getDesiredStates");
	request.setProgramName("INN_MP_GET_OUTCOMES_CPM");
	request.setAsync(true);
	MP_Core.XmlStandardRequest(this, request, function (reply) {
		var html = "";
		if (reply.getStatus() === "S") {
			self.renderComponent(reply.getResponse());
		} else if (reply.getStatus() === "Z") {
			html += "<span class='res-none'>";
			html += i18nObj.NOOUTCOMES.replace("{0}", self.getLabel());
			html += "</span>";
			self.finalizeComponent(html, "");
		} else {
			MP_Util.LogScriptCallError(self, reply, "desiredstates-io.js", "retrieveComponentData");
			self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), ""), "");
		}
	});
	//Script call goes here
	//this.renderComponent(null);
};

OutcomesCPMComponent.prototype.renderComponent = function (reply) {
	var html = "";
	var dsTable = null;
	var states = reply.UNMETOUTCOMES;
	this.processResultsForTable(states);
	dsTable = new ComponentTable();
	this.buildTable(dsTable, states);
	this.setComponentTable(dsTable);
	html += dsTable.render();
	this.finalizeComponent(html, "");
};

CPMController.prototype.addComponentMapping("OUTCOMES", OutcomesCPMComponent);