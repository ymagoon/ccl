// Health Maint

function RecommendationsCPMComponentStyle() {
	this.initByNamespace("recomCPM");
}

RecommendationsCPMComponentStyle.prototype = new ComponentStyle();
RecommendationsCPMComponentStyle.prototype.constructor = ComponentStyle();

function RecommendationsCPMComponent(criterion) {
	var cpmDocI18n = i18n.discernabu.health_maint_cpm_o1;
	
	this.setCriterion(criterion);
	this.setStyles(new RecommendationsO2ComponentStyle());
	this.setScope(1);
	this.setLabel(cpmDocI18n.LABEL);
	
	this.m_cpmFilteredExp = null;
	this.m_expectToAdd = null;
	
	//Set the timers
    this.setComponentLoadTimerName("USR:MPG.HEALTH-MAINT.CPM - load component");
    this.setComponentRenderTimerName("ENG:MPG.HEALTH-MAINT.CPM - render component");

	
	//set up plus add
	this.setPlusAddEnabled(true);
	this.setConceptGroupMeanings("RELHLTHMAINT");
		
}

//inherit from WF Recommendations O2 component
RecommendationsCPMComponent.prototype = new RecommendationsO2Component();
RecommendationsCPMComponent.prototype.constructor = RecommendationsCPMComponent;

CPMMPageComponent.attachMethods(RecommendationsCPMComponent);



RecommendationsCPMComponent.prototype.getCPMFilteredExp= function () {
	if (!this.m_cpmFilteredExp) {
		this.m_cpmFilteredExp = [];
	}
	return this.m_cpmFilteredExp;
};


RecommendationsCPMComponent.prototype.getExpectToAdd= function () {
	if (!this.m_expectToAdd) {
		this.m_expectToAdd = [];
	}
	return this.m_expectToAdd;
};

RecommendationsCPMComponent.prototype.generateFilterHtml = function(filter) {
	return "";
};

RecommendationsCPMComponent.prototype.openTab = function() {

	var cpmDocI18n = i18n.discernabu.health_maint_cpm_o1;

	//set up modal for add
	var component =  this;
	var componentId = this.getComponentId();
	if (MP_ModalDialog.retrieveModalDialogObject("addRecommDialog" + componentId) == null) {
			var modalDialog = new ModalDialog("addRecommDialog"+componentId);
			modalDialog.setLeftMarginPercentage(35).setRightMarginPercentage(35).setTopMarginPercentage(20).setIsBodySizeFixed(true).setIsFooterAlwaysShown(true);
			modalDialog.setShowCloseIcon(true);
			modalDialog.setHeaderTitle(cpmDocI18n.ADDREC);
			
			modalDialog.setBodyDataFunction(function (modalObj) {
			
			var bodyHTML = [];
			var expectToAdd = component.getExpectToAdd();
			if(expectToAdd.length==0){
				modalObj.setBodyHTML("<div class=''>"+ cpmDocI18n.NORELREC + "</div>");
			}
			else{
					bodyHTML.push("<div id ='cpm-add-expect-cont'>")
					for(var y=0;y<expectToAdd.length;y++){
						bodyHTML.push("<div class='cpm-add-expect-entry' id='cpm-add-expect-"+y+"' data-cpm-expect-id='"+expectToAdd[y].EXPECT_ID+"'>"
									 ,expectToAdd[y].EXPECT_STEP
									 ,"</div>");
					}
					bodyHTML.push("</div>")
			}	
				modalObj.setBodyHTML(bodyHTML.join(""));


					
		});

			var cancelButton = new ModalButton("RecommCancel");
			cancelButton.setText(cpmDocI18n.CANCEL).setCloseOnClick(true);

			var addButton = new ModalButton("RecommAdd");
			addButton.setText("Add").setCloseOnClick(true).setOnClickFunction(function () {
				var jqSelected = $("#" + modalDialog.getBodyElementId()).find("div.selected");
				var expectId = jqSelected.attr("data-cpm-expect-id");
				modalDialog.setFooterButtonDither("RecommAdd", true);
				MP_ModalDialog.closeModalDialog("addRecommDialog"+componentId);
				component.addExpect(expectId);
			});

			modalDialog.addFooterButton(addButton);
			modalDialog.addFooterButton(cancelButton);
			modalDialog.setFooterButtonDither("RecommAdd", true);

			MP_ModalDialog.updateModalDialogObject(modalDialog);
	}
	MP_ModalDialog.showModalDialog("addRecommDialog"+componentId);
	
	var jqSearchResults = $("#cpm-add-expect-cont");
	
	jqSearchResults.on("click", "div.cpm-add-expect-entry", function (event) {
		MP_ModalDialog.retrieveModalDialogObject("addRecommDialog"+componentId).setFooterButtonDither("RecommAdd", false);

		jqResult = $(event.currentTarget);

		if (jqResult.hasClass("selected")) {
			jqResult.removeClass("selected");
		} else {
			jqSearchResults.find(".selected").removeClass("selected");
			jqResult.addClass("selected");
		}
	});

	jqSearchResults.on("dblclick", "div.cpm-add-expect-entry", function (event) {
		var jqSelected = $(event.currentTarget);
		var expectId = jqSelected.attr("data-cpm-expect-id");
		MP_ModalDialog.closeModalDialog("addRecommDialog"+componentId
		);
		component.addExpect(expectId);
	});
};

RecommendationsCPMComponent.prototype.addExpect = function (expectId){

	//set up call to Add script
    var self = this;
	var criterion = this.getCriterion();
	var request;
	var sendAr = [];

	sendAr.push(
		"^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0",expectId+".0");  //can send reason code

	request = new MP_Core.ScriptRequest(this, "ENG:" + "USR" + "_AddCPMExpectation"); //TODO create timer

	request.setParameters(sendAr);
	request.setName("addCPMExpectation");
	request.setProgramName("mp_cpm_add_expect");
	request.setAsync(true);

	MP_Core.XmlStandardRequest(this, request, function (reply) {
		self.handleAddExpectResponse(reply);
	});
	
};


RecommendationsCPMComponent.prototype.handleAddExpectResponse = function (reply){
		
		var self = this;

		if (!reply) {
		throw new Error("No 'reply' passed into 'handleAddExpectResponse' method on 'HEalthMaintenanceCPMComponent'");
	}

	var replyStatus = reply.getStatus();
/*
	if (replyStatus !== 'S' && replyStatus !== 'Z') {
		this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), "CPM Add Health Maint expectation failed"), "");
		return;
	}
*/
	self.retrieveComponentData();
};

RecommendationsCPMComponent.prototype.postProcessing = function () {
	MPageComponent.prototype.postProcessing.call(this);
};

//filter by Expectation Id
RecommendationsCPMComponent.prototype.processComponentConfig = function (componentConfig, conceptGroupConfig) {

	if (!conceptGroupConfig) {
		return;
	}


	CPMMPageComponent.prototype.processComponentConfig.call(this, componentConfig, conceptGroupConfig);

	var CPMFilteredExp = this.getCPMFilteredExp();
	var detail;
	var detailList;
	var cLen;
	var i;
	var x;
	var xl;

	if (!conceptGroupConfig || !conceptGroupConfig.length) {
		return;
	}
	
	cLen = conceptGroupConfig.length;
	for (i = 0; i < cLen; i++){
        if(conceptGroupConfig[i].CONCEPT_GROUP_CD_MEAN == "RELHLTHMAINT"){
            detailList = conceptGroupConfig[i].CG_DTL_LIST;
            for(x = 0, xl = detailList.length; x < xl; x++){
            	detail = detailList[x];
				if (detail.CONCEPT_ENTITY_NAME === "HM_EXPECT") {
					CPMFilteredExp.push({"EXPECT_STEP":detail.CONCEPT_ENTITY_TEXT,"EXPECT_ID":detail.CONCEPT_ENTITY_ID});
				}
            }
        }
    }
};

//override standard
RecommendationsCPMComponent.prototype.retrieveComponentData = function () {
	
	var expArr = this.getCPMFilteredExp();
	var paramArr = [];
	for(var x =0;x < expArr.length;x++){
		paramArr.push(expArr[x].EXPECT_ID);
	}
	var expParam = (paramArr.length) ? MP_Util.CreateParamArray(paramArr, 1) : "0.0";
	
	var sendAr = [];
	var criterion = this.getCriterion();
	sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0", 1,expParam);
	var request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
	request.setProgramName("MP_GET_FILTERED_HMI_CPM");
	request.setParameters(sendAr);
	request.setAsync(true);
	MP_Core.XMLCCLRequestCallBack(this, request, this.processFilteredResults);
};

// need to locate expectation ids that did not qualify to display in modal-add window
RecommendationsCPMComponent.prototype.processFilteredResults = function (replyObj) {
	
	var reply = replyObj.getResponse();
	var component = replyObj.getComponent();

	if (replyObj.getStatus() !="S" && replyObj.getStatus() !="Z") { //pass through to render to process
		component.renderComponent(replyObj);
	}
	else{
		var recs = reply.RECS;		
		var filteredExp = component.getCPMFilteredExp();
		component.m_expectToAdd = [];
		var expToAdd =  component.getExpectToAdd();
		var compId = component.getComponentId();
		var returnedExp=[];
		

		for (var x=0;x <recs.length;x++){
			returnedExp.push(recs[x].EXPECT_ID);
		}
		

		for (var y=0;y <filteredExp.length;y++){

			if (returnedExp.indexOf(filteredExp[y].EXPECT_ID)<0){
					expToAdd.push({"EXPECT_STEP":filteredExp[y].EXPECT_STEP,"EXPECT_ID":filteredExp[y].EXPECT_ID});
				}
		}
		
		
		component.renderComponent(replyObj);
		
		//TODO hide add if nothing to add
		if(expToAdd.length==0){
			//alert($("#"+compId).length);
		}
		
	}

};

CPMController.prototype.addComponentMapping("HEALTHMAINT", RecommendationsCPMComponent);