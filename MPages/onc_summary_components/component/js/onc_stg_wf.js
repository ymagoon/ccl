/**
 * Create the staging component style object
 * @constructor
 */
function OncologyStagingComponentWFStyle(){
this.initByNamespace("staging-o1");
};
OncologyStagingComponentWFStyle.prototype=new ComponentStyle();
OncologyStagingComponentWFStyle.prototype.constructor=ComponentStyle;

/**
 * The Oncology Staging component will retrieve all Staging associated to the patient
 * @constructor
 * @param {Criterion} criterion
 */
function OncologyStagingComponentWF(criterion){
	this.setCriterion(criterion);
	this.setComponentLoadTimerName("USR:MPG.STAGING.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.STAGING.O1 - render component");
	this.setStyles(new OncologyStagingComponentWFStyle());
	this.stgwfI18n = i18n.discernabu.stg_wf;
	this.setPlusAddCustomInd(true);
	/*Total number of staged forms for encounter*/
	this.m_iNumberofStagedForms = 0;	
	/*Name of Oncology staging Tab available under Oncology from TOC*/
	this.m_ViewName = "Staging";
	this.m_isInitialScriptCalled = false;
};

OncologyStagingComponentWF.prototype=new MPageComponent();
OncologyStagingComponentWF.prototype.constructor=MPageComponent;

/**
 * Map the staging O1 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_ONC_STG" filter
 */
MP_Util.setObjectDefinitionMapping("WF_ONC_STG",OncologyStagingComponentWF);

/**
* store the view name to navigate.
* @param {string} viewName:Tab name under powerchart TOC to which navigation should be done.
*						this name will be retrived from prefmaint configuration.
* @return {Undefined}.  
*/
OncologyStagingComponentWF.prototype.setViewName=function(viewName){
	this.m_ViewName = viewName;
};
/**
* get view name to navigate.
* @param {Undefined}.
* @return {string} returns Tab name under powerchart TOC to which navigation should be done.   
*/
OncologyStagingComponentWF.prototype.getViewName=function(){
	return this.m_ViewName;
};
/**
* store number of form for encounter..
* @param {Integer}noOfForms: Total number of forms staged for the selected encounter.
* @return {Undefined}.
*/
OncologyStagingComponentWF.prototype.setFormCount=function(formCnt){
	this.m_iNumberofStagedForms = formCnt;
};
/**
* get number of forms available for encounter. 
* @param {Undefined}.
* @return {Integer} returns Total number of forms staged for the selected encounter.
*/
OncologyStagingComponentWF.prototype.getFormCount=function(){
	return this.m_iNumberofStagedForms;
};

/**
* This function is used to get staged problems for encounter. 
* @param {Undefined}.
* @return {Undefined}. 
*/
OncologyStagingComponentWF.prototype.retrieveComponentData=function(){
	var criterion = this.criterion;
	var scriptRequest = new ComponentScriptRequest();
	var viewCatagoryMean = this.criterion.category_mean;
	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), viewCatagoryMean);
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), viewCatagoryMean);
	scriptRequest.setProgramName("onc_get_form_data_wrapper");
	scriptRequest.setParameterArray(["^MINE^",parseInt(criterion.person_id,10)+".0", 
	parseInt(criterion.position_cd,10)+".0", parseInt(criterion.encntr_id,10)+".0","0"]);
	scriptRequest.setComponent(this);
	scriptRequest.setLoadTimer(loadTimer);
	scriptRequest.setRenderTimer(renderTimer);
	scriptRequest.performRequest();
};
/**
 * Function is used to render component data.
 * Is called once retrieveComponentData is succesful.
 * Accepts script reply record.
 * @param {replyJSONObject} replyJSONObject: Contains reply from onc_get_form_data_wrapper.
 * @return {Undefined}.
 */
OncologyStagingComponentWF.prototype.renderComponent=function(replyJSONObject)
{
	var layoutHtml="";
	var recordData =  replyJSONObject;
	var compId=this.getComponentId();
	var saveStagingTimerObj = null;
	var capTimer = new CapabilityTimer("CAP:MPG Launch Oncology Staging");	
	capTimer.capture();
	if(replyJSONObject.STATUS_DATA.STATUS ==='S'){
		this.setFormCount(recordData.QUAL.length);
		this.setViewName(recordData.PREF_VIEW_NAME);
		this.m_isInitialScriptCalled = false;
		/*if encounter has a staging form then display them in faceup*/
		if(recordData.QUAL.length){
			/*Call to construct staging forms*/
			layoutHtml+="<div class='stg-faceup-content' id='stg-faceup-content-"+compId+"-0'>"+
					"<div class='stg-form-header' id='stg-form-header-"+compId+"-0'></div></div>";
			layoutHtml+=this.createBasicFormHTML(recordData);
			layoutHtml+=this.createLinkButtons(recordData.FORM_COUNTS);
		}/*else add an option tion to create a new staging.*/
		else{
			layoutHtml+=this.createAddNewSatagingHTML(recordData);
		}
		layoutHtml+= "<div class='stg-details-content' id='stg-details-content-faceup"+compId+"'></div>";
		MP_Util.Doc.FinalizeComponent(layoutHtml,this,"");
		if(recordData.QUAL.length){
			this.createStagingOptionsHTML(recordData,0);
		}
		$("#stg-details-content-faceup"+compId).hide();
		$("#stg-show-details-form-section"+compId).hide();		
		this.attachListeners();
	}
};
/**
 * This function is used to create blank staging form with a option to add new staging.
 * @param {recordData} recordData:record structure containing staging information.
 * @return {string} returns HTML string to display staging form.
 */
OncologyStagingComponentWF.prototype.createAddNewSatagingHTML=function(recordData)
{
	var layoutHtml = "";
	var compId = this.getComponentId();
	layoutHtml+="<div class='stg-faceup-content' id='stg-empty-faceup-content"+compId+"'>"+
				"<div class='stg-empty-form-img'></div><div class='stg-empty-msg'><p>"+this.stgwfI18n.NO_STAGING+
				"<span class='stg-add-form'><a id='stg-add-new-form' actionTypeId='ADDSTAGING' viewName='"+
				recordData.PREF_VIEW_NAME+"'>"+this.stgwfI18n.ADDSTG+"</a></span></p></div></div>"; 
	return layoutHtml;
}
/**
 * This function is used to create the links.
 * @param {Integer} numOfFormsAvailable:contains number of avaible staging forms
 * @return {string} returns HTML string to display staging form.
 */
OncologyStagingComponentWF.prototype.createLinkButtons=function(numOfFormsAvailable)
{
	var layoutHtml = "";
	var compId = this.getComponentId();
	layoutHtml+="<div class='stg-show-form-msg'><span class='stg-showall-form' id = 'stg-showall-form-section"+compId+"'>"+
				"<a id='stg-all-form"+compId+"' numOfFormsAvailable = '"+numOfFormsAvailable+"'actionTypeId='SHOWALL'>"+
				this.stgwfI18n.SHOW_ALL_STG+"("+numOfFormsAvailable+")</a></span>"+
				"<span class='stg-showall-form' id = 'stg-show-recent-form-section"+compId+"' style='display:none'>"+
				"<a id='stg-rcnt-form"+compId+"' numOfFormsAvailable = '"+numOfFormsAvailable+"'actionTypeId='SHOWRECENT'>"+
				""+this.stgwfI18n.SHOW_RECENT_STG+"</a></span><span class='stg-showall-form' id = 'stg-show-details-form-section"+
				compId+"'><a id='stg-all-rcnt-form"+compId+"' formCount = '"+numOfFormsAvailable+"'actionTypeId='SHOWFORM'>"+
				this.stgwfI18n.SHOW_RECENT_STG+"</a></span></div>";
	return layoutHtml;
};
/**
 * This function is used to create basic HTML layout only containing a div with heading.
 * @param {Integer} numOfFormsAvailable:contains number of avaible staging forms
 * @return {string} returns HTML string to display staging form.
 */
OncologyStagingComponentWF.prototype.createBasicFormHTML=function(recordData)
{
	var layoutHtml = "";
	var compId = this.getComponentId();
	/*Creating basic HTML structure of all stage forms*/
	for(var formIndex = 1;formIndex<recordData.FORM_COUNTS;formIndex++){
		layoutHtml+="<div class='stg-faceup-content-hide' id='stg-faceup-content-"+compId+"-"+ formIndex +"'>"+
		"<div class='stg-form-header'  id='stg-form-header-"+compId+"-"+formIndex+"'></div></div>";
	}
	return layoutHtml;
};
/**
 * This function is used to create and append the  staging form Buttons , link and other required informations.
 * @param {recordData} recordData:record structure containing staging information.
 * @param {Integer} beg:form number from which data appending should begin.
 * @return {Undefined}.
 */
OncologyStagingComponentWF.prototype.createStagingOptionsHTML=function(recordData,begCount)
{
	var endCount = (begCount === 0)? 1:recordData.QUAL.length-1;
	var lastEditDtz = "";
	var startDate=new Date();
	var compId = this.getComponentId();
	for(var formIndex = 0;formIndex < endCount;formIndex++)
	{
		var index = (begCount === 0)? 0:formIndex+1;
		var layoutHtml = "";
		var staginedFormData = recordData.QUAL[formIndex];
		var preRecurFormIds =[];
		var preRecuredFormFlag = false;
		
		var formIdsObj = {};
		for(var y = 0; y < recordData.PRERECUR.length; y++){
			if(recordData.PRERECUR[y].ID){
			formIdsObj[recordData.PRERECUR[y].ID] = true;
			}
		}

		preRecuredFormFlag = typeof formIdsObj[staginedFormData.FORM_ACTIVITY_ID] !== "undefined" ? true : false;
		
		var stgHeaderElement = '#stg-form-header-'+compId+'-'+index;
		var stgInformationElement='#stg-faceup-content-'+compId+"-"+ index ;
		
		layoutHtml = "";
		var stagingInfo = this.getStagingFormInfo(staginedFormData);
		layoutHtml+="<div class='stg-form-Info' id='stg-form-Info-"+compId+"-"+ index +"'>"+stagingInfo[0]+"</div>";
		$(stgInformationElement).append(layoutHtml);
		
		layoutHtml = "";
		var problemName = (staginedFormData.PROBLEM_NAME === "" || staginedFormData.PROBLEM_ID=== 0) ? " " : (staginedFormData.PROBLEM_NAME+this.stgwfI18n.DELIMIT);
		if(stagingInfo[1]){				
			problemName += this.stgwfI18n.RECURRENT+"," + staginedFormData.FORM_STATUS_DISP;
		}
		else{
			problemName += staginedFormData.FORM_STATUS_DISP;
		}		
		layoutHtml+="<div class='stg-prblm-name'><p class ='stg-prblm-text' id='stg-prblm-text-"+compId+"-"+index+"'>"+problemName+"</p></div>";	
		
		startDate.setISO8601(staginedFormData.VALID_FROM_DT_TM);
		lastEditDtz = this.stgwfI18n.LSTEDTD+this.stgwfI18n.DELIMIT +startDate.format("shortDate2")+this.stgwfI18n.AT+startDate.format("shortTime");
		layoutHtml+="<div class='stg-last-dttm'><p class ='stg-lstdttm-text' id='stg-lstdttm-text-"+compId+"-"+ index +"'>"+lastEditDtz+"</p></div>";		
		layoutHtml+="<div class='stg-btn-section'>";
		layoutHtml+= this.createActionButtons(staginedFormData,index,preRecuredFormFlag,recordData)
		layoutHtml+="</div>";
		$(stgHeaderElement).append(layoutHtml);
		
		layoutHtml = "";
		var filteredDtas = this.filterDtas(recordData,formIndex);
		layoutHtml+=this.createDtaSection(recordData,filteredDtas);
		$(stgInformationElement).append(layoutHtml);
	}	
};
/**
 * This function is used to create staging form information text also this function 
 * sets a flag indicating is form is recured or not.
 * @param {recordData} staginedFormData:record structure containing staging information.
 * @return {array} returns having staging information text and recurrence flag.
 */
OncologyStagingComponentWF.prototype.getStagingFormInfo=function(staginedFormData)
{
	var stgInformationText = [];
	var isRecurredForm = 0;
	var startDate=new Date();
	var dateTm = staginedFormData.RECURRENCE_DT_TM;
	dateTm = dateTm.slice(6,16);
	startDate.setISO8601(staginedFormData.ONSET_DT_TM);
	
	/* Construct staging form information string in below format :
		if form is non recurred form : "Staging Sytem:AJCCv7 | Form:Breast | Onset Date:7/4/2013",
		else : "Staging Sytem:AJCCv7 | Form:Breast | Onset Date:7/4/2013 | Recurrence Date:12/12/2015".
		Store same thing so it can be used in Detail form view option.*/
	var stagingInformation = this.stgwfI18n.STG_SYSTEM +this.stgwfI18n.DELIMIT +staginedFormData.ONC_DOCSETREF_CAT_ID_DISP +" | "+
							 this.stgwfI18n.STG_FORM+this.stgwfI18n.DELIMIT +staginedFormData.DOC_SET_REF_DESC ;
	if(staginedFormData.PRE_RECURRENCE_FORM_ACT_ID.toFixed() === '0'){
		stagingInformation += " | "+this.stgwfI18n.ONSETDATE+":"+startDate.format("shortDate2"); 
	}
	else{
		stagingInformation += " | "+this.stgwfI18n.ONSETDATE+":"+startDate.format("shortDate2") ;
		if(dateTm !== '0000-00-00'){
			startDate.setISO8601(staginedFormData.RECURRENCE_DT_TM);
			stagingInformation += " | "+this.stgwfI18n.RECURDATE+":"+startDate.format("shortDate2") ;
		}
		isRecurredForm = 1;
	}
	stgInformationText[0] = stagingInformation;
	stgInformationText[1] = isRecurredForm;
	return stgInformationText;
};
/**
 * This function is used to create action buttons used in staging forms. 
 * Buttons are namely : DETAILS, MODIFY and RECURRENCE.
 * @param {recordData} staginedFormData:record structure containing staging information pertaining to specific form.
 * @param {Integer} index : Index of the form to which buttons needs to be added.
 * @param {Bool} recuredForm : Boolean flag indicating selected form is recurred or not
 * @param {recordData} recordData : record structure containing staging information .
 * @return {string} returns HTML string to display staging form.
 */
OncologyStagingComponentWF.prototype.createActionButtons=function(staginedFormData,index,recuredForm,recordData)
{
	var layoutHtml ="";
	var isDetailsDisabled = false;
	var isFormInProgress = false;
	var compId = this.getComponentId();
	if(staginedFormData.FORM_STATUS_CD === recordData.PROGRESS){
		isFormInProgress = true;
	}
	if(!staginedFormData.TEXTUAL_RENDITION_EVENT_ID){
		layoutHtml+="<button  disabled class='stg-details-modify-buttons' id='stg-details-button-"+compId+"-"+ index +"'"+
						"action = 'DETAILS'"+"numOfForms = '"+index+"'"+"recuredForm='"+recuredForm+"'"+"eventId='"+staginedFormData.EVENT_ID+"'"+
						"docSetRefId ='"+staginedFormData.DOC_SET_REF_ID+"'"+"count='"+index+"'>"+this.stgwfI18n.DETAILS+"</button>";
	}
	else{
		layoutHtml+="<button class='stg-details-modify-buttons' id='stg-details-button-"+compId+"-"+ index +"'"+
						"action = 'DETAILS'"+"numOfForms = '"+index+"'"+"recuredForm='"+recuredForm+"'"+"eventId='"+staginedFormData.EVENT_ID+"'"+
						"docSetRefId ='"+staginedFormData.DOC_SET_REF_ID+"'"+"count='"+index+"'>"+this.stgwfI18n.DETAILS+"</button>";
	}
	if(recuredForm){
		layoutHtml+="<button disabled class='stg-details-modify-buttons' id='stg-modify-button-"+compId+"-"+ index +"'"+
					"action = 'MODIFY_RECUR'"+"enctrId = '"+recordData.ENCNTR_ID+"'"+"numOfForms = '"+index+"'"+"formActId = '"+ 
					staginedFormData.FORM_ACTIVITY_ID+"'"+"actnType = '2'"+">"+this.stgwfI18n.MODIFY+"</button>"+
						
					"<button  disabled class='stg-details-modify-buttons' id='stg-recur-button-"+compId+"-"+ index +"'"+
					"action = 'MODIFY_RECUR'"+"enctrId = '"+recordData.ENCNTR_ID+"'"+"numOfForms = '"+index+"'"+"formActId = '"+ 
					staginedFormData.FORM_ACTIVITY_ID+"'"+"actnType = '3'"+">"+this.stgwfI18n.RECUR+"</button>";
	}
	else{
		layoutHtml+="<button  class='stg-details-modify-buttons' id='stg-modify-button-"+compId+"-"+ index +"'"+
					"action = 'MODIFY_RECUR'"+"enctrId = '"+recordData.ENCNTR_ID+"'"+"numOfForms = '"+index+"'"+"formActId = '"+ 
					staginedFormData.FORM_ACTIVITY_ID+"'"+"actnType = '2'"+">"+this.stgwfI18n.MODIFY+"</button>";
		if(isFormInProgress){
			layoutHtml+="<button disabled class='stg-details-modify-buttons' id='stg-recur-button-"+compId+"-"+ index +"'"+
						"action = 'MODIFY_RECUR'"+"enctrId = '"+recordData.ENCNTR_ID+"'"+"numOfForms = '"+index+"'"+"formActId = '"+ 
						staginedFormData.FORM_ACTIVITY_ID+"'"+"actnType = '3'"+">"+this.stgwfI18n.RECUR+"</button>";
		}
		else{
			layoutHtml+="<button  class='stg-details-modify-buttons' id='stg-recur-button-"+compId+"-"+ index +"'"+
						"action = 'MODIFY_RECUR'"+"enctrId = '"+staginedFormData.ENCNTR_ID+"'"+"numOfForms = '"+index+"'"+"formActId = '"+ 
						staginedFormData.FORM_ACTIVITY_ID+"'"+"actnType = '3'"+">"+this.stgwfI18n.RECUR+"</button>";
		}
	}
	return	layoutHtml;				
};
/**
* This function is used to construct clinical and pathalogical  DTA sections in staging face-up.
* Before calling this function , filterDtas(param1, param2)needs to be called to ensure ,
* all DTAs are filtered and data is ready to be rendered with HTML.
* @param {recordData} staginedFormData : holds the data required to construct staged form for patient.
* @param {array} : holds filteredDtas[0]: contains clinical stage information for staged form.
*				         filteredDtas[1]: contains pathological stage information for staged form.
*						 filteredDtas[2]: contains additional descriptor information for staged form.
* @return {string} returns HTML string to display staging form. 
*/
OncologyStagingComponentWF.prototype.createDtaSection=function(staginedFormData,filteredDtas)
{
	var layoutHtml = "";
	var stgClinicalData = filteredDtas[0];
	var stgPathologicalData = filteredDtas[1];
	var stgOtherDtaData = filteredDtas[2];
	var isStgClinDataPresnt = false;
	var isStgPathDataPresnt = false;
	var isStgOthrDataPresnt = false;
	/*	Verify Clinacal or pathalogical data is present for the form. 
		If present , show the available data in staging face-up.
		If not check for other type of data and display the other data in face-up. 
	*/
	for(var i = 0;i<stgClinicalData.length;i++)
	{
		if(stgClinicalData[i] !== 'NA'){isStgClinDataPresnt = true;}
		if(stgPathologicalData[i] !== 'NA'){isStgPathDataPresnt = true;}
	}
	if(stgOtherDtaData.length){
		isStgOthrDataPresnt = true;
	}
	//If clinical data available for the form , 
	//EX:Total 8 data is available. 
	//0,2,4,6 : indexes in array represents Results description.
	//1,3,5,7 : indexes in array represents Results value.
	if(isStgClinDataPresnt){
		layoutHtml+="<div class='stg-clin-rslt-section'><p>"+this.stgwfI18n.CLIN_RESULT+"</p><div class='stg-line'></div>";
		layoutHtml+= this.createClinicalPathDataSection(0,stgClinicalData.length,stgClinicalData);
		layoutHtml+='</div>';							
	}
	//If pathological data available for the form , 
	//EX:Total 8 data is available. 
	//0,2,4,6 : indexes in array represents Results description.
	//1,3,5,7 : indexes in array represents Results value.
	if(isStgPathDataPresnt){
		layoutHtml+="<div class='stg-path-rslt-section'><p>"+this.stgwfI18n.PATH_RESULT+"</p><div class='stg-line'></div>";
		layoutHtml+= this.createClinicalPathDataSection(0,stgPathologicalData.length,stgPathologicalData);
		layoutHtml+='</div>';
	}
	//If form is not staged with any of clinical or pathalogical data,
	//then form faceup should display additional DTAs staged , 
	//Since clinical and pathological sections will be displayed in faceup.
	//these sections will be replaced with aditional descriptors data.
	//so here will provide total 16 DTA values to fill up the sections left 
	//blank by clinical and pathalogical data.
	if(isStgOthrDataPresnt){				
		//These string will be not be displayed to user.
		//'NA' will be reply from the script , 
		//if TASKASSAY code is NOt associated to Staged form.
		//If 'NA' is encountered ,then dont display this in faceup.
		var strOthrDataArry = ['NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA'];
		var iOtherDtaLength = strOthrDataArry.length;
		for(var k =0;k < stgOtherDtaData.length;k++){
			strOthrDataArry[k] = stgOtherDtaData[k];
		}							
		if(isStgClinDataPresnt === false && isStgPathDataPresnt === false ){
			
			layoutHtml+="<div class='stg-clin-rslt-section'><div class='stg-rslt-heading'><div class='stg-rslt-string'>"+
						'<p>'+this.stgwfI18n.ITEM+'</p></div><div class="stg-rslt-data"><p>'+this.stgwfI18n.RESULT+'</p></div></div>';
			
			//To fill clinical section, will provide first 8 additional descriptor data to this section.
			layoutHtml+= this.createClinicalPathDataSection(0,stgClinicalData.length,strOthrDataArry);
			layoutHtml+="</div>";							
			
			if(stgOtherDtaData.length > stgClinicalData.length){
				layoutHtml+="<div class='stg-path-rslt-section'><div class='stg-rslt-heading'><div class='stg-rslt-string'>"+
							'<p>'+this.stgwfI18n.ITEM+'</p></div><div class="stg-rslt-data"><p>'+this.stgwfI18n.RESULT+'</p></div></div>';
				
				//To fill pathological section, will provide next 8 additional descriptor data to this section.
				layoutHtml+= this.createClinicalPathDataSection(stgClinicalData.length,iOtherDtaLength,strOthrDataArry);
				layoutHtml+="</div>";
			}
		}
	}
	return layoutHtml;
};
/**
* This function is used Show all available staging form for encounter. 
* @param {compId} compId: id of the component used to get unique id for each element.
* @return {undefined}.  
*/
OncologyStagingComponentWF.prototype.showAllStagingForm=function(compId)
{
	$("#stg-details-content-faceup"+ compId).hide();
	$("#stg-showall-form-section"+compId).hide();
	$("#stg-show-recent-form-section"+compId).show();
	if(this.m_isInitialScriptCalled === false){
		this.m_isInitialScriptCalled = true;
		this.getAllStagingFormData();
	}
	else{
		$('.stg-faceup-content-hide').show();
	}
};
/**
* This function is used fetch all the available staging forms for encounter. 
* @param {undefined} 
* @return {undefined}.  
*/
OncologyStagingComponentWF.prototype.getAllStagingFormData=function()
{
	var self=this;
	var criterion = this.criterion;
	var scriptRequest = new ScriptRequest();    
	scriptRequest.setProgramName("onc_get_form_data_wrapper");    
	scriptRequest.setParameterArray(["^MINE^",parseInt(criterion.person_id,10)+".0", 
	parseInt(criterion.position_cd,10)+".0", parseInt(criterion.encntr_id,10)+".0","1"]);
	scriptRequest.setResponseHandler(function(scriptReply){
	if (scriptReply.getResponse().STATUS_DATA.STATUS === "S"){
			self.createStagingOptionsHTML(scriptReply.getResponse(),1);	
			$('.stg-faceup-content-hide').show();
			self.attachListeners();
		}
	});
	scriptRequest.performRequest();
}
/**
 * This function is used to attach click events for buttons.
 * Event will be attached to :Details, Modify and Recurrence buttons.
 * Also Event will be attached to Add staging Link.
 * @param {this}.
 * @return {Undefined}. 
 */
OncologyStagingComponentWF.prototype.attachListeners=function()
{
	var rootNode=this.getRootComponentNode();
	$(rootNode).find('button').on('click',{self:this},this.actionButtons);
	$(rootNode).find('a').on("click",{self:this},this.attachShowActions);
};
/**
 * This function is used to execute actions binded to buttons.
 * @param {event} event:Contains the Actions specific to Buttons.
 *						Actions will be DETAILS, MODIFY_RECUR.
 * @return {Undefined}. 
 */
OncologyStagingComponentWF.prototype.actionButtons=function(event)
{
	var element = $(event.target);
	var self = event.data.self;
	switch(element.attr('action')){
    case "DETAILS":self.onViewDetails(element.attr('numOfForms'),element.attr('recuredForm'),element.attr('eventId'),element.attr('docSetRefId'),
							element.attr('count'));
		break;
    case "MODIFY_RECUR":self.onNavigationBtn(element.attr('formActId'),element.attr('actnType'),self.getViewName());
		break;
	}
};
/**
 * This function is used to execute actions binded to links.
 * @param {event} event:Contains the Actions specific to links.
 *						Actions will be SHOWALL, SHOWRECENT,ADDSTAGING.
 * @return {Undefined}. 
 */
OncologyStagingComponentWF.prototype.attachShowActions=function(event)
{
	var self = event.data.self;
	var element = $(event.target);
	var compId=self.getComponentId();
	switch(element.attr('actionTypeId')){
    case "SHOWALL":self.showAllStagingForm(compId);
		break;
    case "SHOWRECENT":self.showRecentStagingForm(compId);
		break;
    case "SHOWFORM":self.showAllStagingFormDetails(compId);
		break;
	case "ADDSTAGING":self.onNavigationBtn(0,1,element.attr('viewName'));
		break;
	}
};
/**
* This function is used to arrange DTA value in clinical, pathological and other data section.
* @param {Integer} begIndex: starting index of array from which staged form DTAs are to be read.
* @param {Integer} endIndex: last index of array containg DTA value.
* @param {array} stgFormData : array having staged DTA values.
* @return {string} returns HTML string to display clinical, pathological and other data section.
*/
OncologyStagingComponentWF.prototype.createClinicalPathDataSection=function(begIndex,endIndex,stgFormData)
{
	var layoutHtml = "";
	//Since in each cycle two elements are read, 
	//increment counter to point to valid index. 
	for(var x = begIndex;x < endIndex;x+=2)
	{
		if(stgFormData[x] !== "NA"){					
			layoutHtml+='<div class="stg-rslt-row" ><div class="stg-rslt-string" ><p class="stg-ellipsis">'+stgFormData[x]+'</p></div>'+
						'<div class="stg-rslt-data" ><p class="stg-ellipsis">'+stgFormData[x+1]+'</p></div></div>';
		}
	}
	return layoutHtml;
};
/**
* This function is used to filter and populate data for indivisual staging forms.
* @param {recordData} recordData: reply structure holding DTA values of staged form.
* @param {Integer} formCount : staged form number from which DTA values are required to be filteredout.
* @return {array} returns filteredDtas array holding: 
*				  stgClinicalData : contains clinical stage information for staged form.
*				  stgPathologicalData : contains pathological stage information for staged form.
*				  stgOtherDtaData : contains additional descriptor information for staged form. 
*/
OncologyStagingComponentWF.prototype.filterDtas=function(recordData,formCount)
{	
	var stgClinicalData = ['NA','NA','NA','NA','NA','NA','NA','NA'];
	var stgPathologicalData = ['NA','NA','NA','NA','NA','NA','NA','NA'];
	var stgOtherDtaData = [];
	var filteredDtas = [];
	/*Check for DTAs that are charted for encounter. 
	lisiting REP1000011 Holds all DTA values charted for particular encounter.*/
	for(var iREP1000011Cnt = 0 ;iREP1000011Cnt < recordData.QUAL[formCount].REP1000011.length;iREP1000011Cnt++)
	{		
		/*Check is charted DTAs has TaskAssay Codes associated to them ,
		if yes featch name of the DTA and save it in appropriate array. 
		If its clinical assay store in stgClinicalData.
		If its Pathological assay store in stgPathologicalData.
		If its otherthan clinical/Pathological assay store in stgOtherDtaData
		*/
		for(var iREP4102032Cnt = 0 ;iREP4102032Cnt < recordData.QUAL[formCount].REP4102032.length;iREP4102032Cnt++)
		{			
			if(recordData.QUAL[formCount].REP1000011[iREP1000011Cnt].TASK_ASSAY_CD.toFixed() === recordData.QUAL[formCount].REP4102032[iREP4102032Cnt].TASK_ASSAY_CD.toFixed())
			{		
				var bNoTokenMeaning = true;
				/*Check if DTA is of type Clinical Tumor.If yes Suffix it with 'c'*/					
				if(recordData.QUAL[formCount].REP4102032[iREP4102032Cnt].TOKEN_MEANING ==="CT" )
				{
					stgClinicalData = this.filterSectionDTAs(stgClinicalData,recordData,formCount,iREP1000011Cnt,"c",0);
					bNoTokenMeaning = false;
				}
				/*Check if DTA is of type Pathalogical tumor.If yes Suffix it with 'p'*/
				else if(recordData.QUAL[formCount].REP4102032[iREP4102032Cnt].TOKEN_MEANING === "PT" )
				{
					stgPathologicalData = this.filterSectionDTAs(stgPathologicalData,recordData,formCount,iREP1000011Cnt,"p",0);
					bNoTokenMeaning = false;
				}
				/*Check if DTA is of type Clinical Node.If yes Suffix it with 'c'*/
				if(recordData.QUAL[formCount].REP4102032[iREP4102032Cnt].TOKEN_MEANING === "CN" )
				{
					stgClinicalData = this.filterSectionDTAs(stgClinicalData,recordData,formCount,iREP1000011Cnt,"c",2);
					bNoTokenMeaning = false;
				}
				/*Check if DTA is of type Pathological Node.If yes Suffix it with 'p'*/
				else if(recordData.QUAL[formCount].REP4102032[iREP4102032Cnt].TOKEN_MEANING === "PN" )
				{
					stgPathologicalData = this.filterSectionDTAs(stgPathologicalData,recordData,formCount,iREP1000011Cnt,"p",2);
					bNoTokenMeaning = false;
				}
				/*Check if DTA is of type Clinical Metasis.If yes Suffix it with 'c'*/
				if(recordData.QUAL[formCount].REP4102032[iREP4102032Cnt].TOKEN_MEANING === "CM" )
				{
					stgClinicalData = this.filterSectionDTAs(stgClinicalData,recordData,formCount,iREP1000011Cnt,"c",4);
					bNoTokenMeaning = false;
				}
				/*Check if DTA is of type Pathological Metasis.If yes Suffix it with 'p'*/
				else if(recordData.QUAL[formCount].REP4102032[iREP4102032Cnt].TOKEN_MEANING === "PM" )
				{
					stgPathologicalData = this.filterSectionDTAs(stgPathologicalData,recordData,formCount,iREP1000011Cnt,"p",4);
					bNoTokenMeaning = false;
				}
				/*Check if DTA is of type Clinical Stage.*/
				if(recordData.QUAL[formCount].REP4102032[iREP4102032Cnt].TOKEN_MEANING === "CS" )
				{
					stgClinicalData = this.filterSectionDTAs(stgClinicalData,recordData,formCount,iREP1000011Cnt," ",6);
					bNoTokenMeaning = false;
				}
				/*Check if DTA is of type Pathological Stage.*/
				else if(recordData.QUAL[formCount].REP4102032[iREP4102032Cnt].TOKEN_MEANING === "PS" )
				{
					stgPathologicalData = this.filterSectionDTAs(stgPathologicalData,recordData,formCount,iREP1000011Cnt," ",6);
					bNoTokenMeaning = false;
				}						
			}
		}		
	}
	/*If DTA doesnt qualify for any of the clinical, pathological and clinical stage data , 
	group all those under otherData array*/	
	for(var iREP1000011Cnt = 0 ;iREP1000011Cnt < recordData.QUAL[formCount].REP1000011.length;iREP1000011Cnt++)
	{	
		var bOtherDataExists = false;
		for(var iREP4102032Cnt = 0 ;iREP4102032Cnt < recordData.QUAL[formCount].REP4102032.length;iREP4102032Cnt++)
		{			
			if(recordData.QUAL[formCount].REP1000011[iREP1000011Cnt].TASK_ASSAY_CD.toFixed() === recordData.QUAL[formCount].REP4102032[iREP4102032Cnt].TASK_ASSAY_CD.toFixed())
			{
				bOtherDataExists = true;
			}			
		}
		if(bOtherDataExists === false)
		{
			stgOtherDtaData.push(recordData.QUAL[formCount].REP1000011[iREP1000011Cnt].EVENT_TITLE_TEXT);
			stgOtherDtaData.push(recordData.QUAL[formCount].REP1000011[iREP1000011Cnt].EVENT_TAG);
		}
	}	
	var yClinicalFlag = false;
	var yPathologicalFlag = false;
	var rPrefixFlag = false;
	var aPrefixFlag = false;
	var mSuffixFlag = false;
	/*Check for recurrence flag.
	If yes then add 'r' suffix to all of the DTAs, except stage group.*/
	if(recordData.QUAL[formCount].PRE_RECURRENCE_FORM_ACT_ID !== 0)
	{
		rPrefixFlag = true;
	}
	/*Check if any additional descriptors are added to the DTAs.*/
	for(var iOtherDtaCount = 0; iOtherDtaCount < stgOtherDtaData.length;iOtherDtaCount++)
	{
		if(stgOtherDtaData[iOtherDtaCount]=== "y clinical" && stgOtherDtaData[iOtherDtaCount+1] === "Yes")
		{
			yClinicalFlag = true;
		}
		else if(stgOtherDtaData[iOtherDtaCount]=== "y pathologic" && stgOtherDtaData[iOtherDtaCount+1] === "Yes")
		{
			yPathologicalFlag = true;
		}
		else if(stgOtherDtaData[iOtherDtaCount]=== "r prefix" && stgOtherDtaData[iOtherDtaCount+1] === "Yes")
		{
			rPrefixFlag = true;
		}
		else if(stgOtherDtaData[iOtherDtaCount]=== "a prefix" && stgOtherDtaData[iOtherDtaCount+1] === "Yes")
		{
			aPrefixFlag = true;
		}		
		else if(stgOtherDtaData[iOtherDtaCount]=== "m suffix" && stgOtherDtaData[iOtherDtaCount+1] === "Yes")
		{
			mSuffixFlag = true;
		}
		iOtherDtaCount = iOtherDtaCount+1;
	}
		/*If Y-Flag is Yes add y prefix.
		If R-Flag is Yes add r prefix.
		If A-Flag is Yes add a prefix.
		If M-Flag is Yes add m suffix.*/
		if(yClinicalFlag)
		{	
			if(stgClinicalData[1] !=='NA'){stgClinicalData[1] = "y" + stgClinicalData[1];}
			if(stgClinicalData[3] !=='NA'){stgClinicalData[3] = "y" + stgClinicalData[3];}
			if(stgClinicalData[5] !=='NA'){stgClinicalData[5] = "y" + stgClinicalData[5];}				
		}
		if(yPathologicalFlag)
		{
			if(stgPathologicalData[1] !== 'NA'){stgPathologicalData[1] = "y" + stgPathologicalData[1];}
			if(stgPathologicalData[3] !== 'NA'){stgPathologicalData[3] = "y" + stgPathologicalData[3];}
			if(stgPathologicalData[5] !== 'NA'){stgPathologicalData[5] = "y" + stgPathologicalData[5];}
		}	
		if(rPrefixFlag)
		{
			if(stgClinicalData[1] !=='NA'){stgClinicalData[1] = "r" + stgClinicalData[1];}
			if(stgClinicalData[3] !=='NA'){stgClinicalData[3] = "r" + stgClinicalData[3];}
			if(stgClinicalData[5] !=='NA'){stgClinicalData[5] = "r" + stgClinicalData[5];}
			if(stgPathologicalData[1] !== 'NA'){stgPathologicalData[1] = "r" + stgPathologicalData[1];}
			if(stgPathologicalData[3] !== 'NA'){stgPathologicalData[3] = "r" + stgPathologicalData[3];}
			if(stgPathologicalData[5] !== 'NA'){stgPathologicalData[5] = "r" + stgPathologicalData[5];}
		}	
		if(aPrefixFlag)
		{
			if(stgClinicalData[1] !=='NA'){stgClinicalData[1] = "a" + stgClinicalData[1];}
			if(stgClinicalData[3] !=='NA'){stgClinicalData[3] = "a" + stgClinicalData[3];}
			if(stgClinicalData[5] !=='NA'){stgClinicalData[5] = "a" + stgClinicalData[5];}
			if(stgPathologicalData[1] !== 'NA'){stgPathologicalData[1] = "a" + stgPathologicalData[1];}
			if(stgPathologicalData[3] !== 'NA'){stgPathologicalData[3] = "a" + stgPathologicalData[3];}
			if(stgPathologicalData[5] !== 'NA'){stgPathologicalData[5] = "a" + stgPathologicalData[5];}
		}	
		if(mSuffixFlag)
		{
			if(stgClinicalData[1] !=='NA'){stgClinicalData[1] = stgClinicalData[1] + "(m)";}			
			if(stgPathologicalData[1] !== 'NA'){stgPathologicalData[1] = stgPathologicalData[1] + "(m)";}			
		}			
	filteredDtas.push(stgClinicalData);
	filteredDtas.push(stgPathologicalData);
	filteredDtas.push(stgOtherDtaData);
	return filteredDtas;
};
/**
* This function is used to append Modified and Progressed status to DTA for staged form.
* @param {array} stgDtaData : array holding DTA values to be filtered.
* @param {recordData} recordData : used to verify MODIFIED and IN PROGRESS status of staged DTAs.
* @param {Integer} formIndex : index of form whom DTAs to be filtered and added with tag specifying status of DTA.
* @param {Integer} dtaIndex : index of record list where specified staged DTA is available. 
* @param {string} modifierValue : value required to be added to the DTA depending clinical or pthalogical DTA.
* @param {Integer} dtaCnt : Index from which classified DTA to be stored.
* @return {array} stgDtaData : array having filtered DTA value. 
*/
OncologyStagingComponentWF.prototype.filterSectionDTAs=function(stgDtaData,recordData,formIndex,dtaIndex,modifierValue,dtaCnt)
{
	stgDtaData[dtaCnt] = recordData.QUAL[formIndex].REP1000011[dtaIndex].EVENT_TITLE_TEXT;
					
	if(recordData.QUAL[formIndex].REP1000011[dtaIndex].RESULT_DISP_CD.toFixed() === recordData.MODIFIED.toFixed())
	{
		if(modifierValue !== " "){
			stgDtaData[dtaCnt+1] = (modifierValue+recordData.QUAL[formIndex].REP1000011[dtaIndex].EVENT_TAG+"(c)");	
		}
		else{
			stgDtaData[dtaCnt+1] = (modifierValue+recordData.QUAL[formIndex].REP1000011[dtaIndex].EVENT_TAG);
		}		
	}
	else{
		stgDtaData[dtaCnt+1] = (modifierValue+recordData.QUAL[formIndex].REP1000011[dtaIndex].EVENT_TAG);
	}	
	return stgDtaData;
};
/**
* This function is used launch details pane for selected staged form.
* Also this function will clear up component faceup to display only staged form details.
* @param {Integer} formIndex : Index of the form which is required to be displayed. 
* @param {Bool} recuredForm : Boolean flag indicating selected form is recurred or not
* @param {Double} eventId : Event id of the form to to displayed.
* @param {Double} docSetRefId : Docset reference id of the form to be displayed
* @param {Integer} numOfForms : Total number of forms available for encounter.
* @return {undefined}. 
*/
OncologyStagingComponentWF.prototype.onViewDetails=function(formIndex,recuredForm,eventId,docSetRefId,numOfForms)
{	
	/*Hide all the availble staged form , and show the details pane for selcted form.*/
	var compId=this.getComponentId();
	$("#stg-details-content-faceup"+ compId).show();
	$('.stg-faceup-content').hide();
	$('.stg-faceup-content-hide').hide();
	$('.stg-details-content-show').hide();
	$("#stg-showall-form-section"+compId).hide();
	$("#stg-show-recent-form-section"+compId).hide();
	$("#stg-show-details-form-section"+compId).show();
	/*Construct Details pane to show content of staged form*/
	this.fetchFormDetails(formIndex,recuredForm,eventId,docSetRefId);
}
/**
* This function is used show all DTAs of a Staged form.
* To display Form details, this function calls onc_stg_get_form_details script.
* once after form details are fetched DTAs will be displayed on specified section.
* @param {Integer} formIndex : Index of the form which is required to be displayed. 
* @param {Bool} recuredForm : Boolean flag indicating selected form is recurred or not
* @param {Double} eventId : Event id of the form to to displayed.
* @param {Double} docSetRefId : Docset reference id of the form to be displayed
* @return {undefined}. 
*/
OncologyStagingComponentWF.prototype.fetchFormDetails=function(formId,isRecuredForm,eventId,docSetRefId)
{
	var self=this;
	var criterion = this.criterion;
	var recurdForm = 0;
	var viewCatagoryMean = criterion.category_mean;
	var capTimer = new CapabilityTimer("CAP:MPG View Oncology Staging");
	capTimer.capture();
	var scriptRequest = new ScriptRequest();    
	scriptRequest.setProgramName("onc_stg_get_form_details");    
	scriptRequest.setParameterArray(["^MINE^",isRecuredForm+".0",eventId+".0",docSetRefId+".0"]);
	scriptRequest.setResponseHandler(function(scriptReply){
	if (scriptReply.getResponse().STATUS_DATA.STATUS === "S"){
			self.displayFormDetails(formId,scriptReply.getResponse());
		}
	});
	scriptRequest.performRequest();
};
/**
* This function is used to Show detail view of available staging form for encounter. 
* @param {Integer} formId: Index of the form to which data need to be appended..
* @return {undefined}.
*/
OncologyStagingComponentWF.prototype.displayFormDetails=function(formId,recordData)
{	
	var compId=this.getComponentId();
	var layoutHtml = "";
	var $componentDom=$("#stg-details-content-faceup"+ compId);
	var lastDtStrList = $("#stg-lstdttm-text-"+compId+"-"+ formId).text();
	var stgInfText = $("#stg-form-Info-"+compId+"-" + formId).text();
	var problemList = $("#stg-prblm-text-"+compId+"-" + formId).text();
	var eventTitle =[] ; 
	var eventTag = []; 
	var eventDtTm = [];
	var dtaDate=new Date();
	for(var ki = 0;ki<recordData.AVAILABLEDTA;ki++)
	{
		eventTitle.push("NA");
		eventTag.push("NA");
		eventDtTm.push("NA");
	}
	for(var ti = 0;ti<recordData.DTAINFO.length ;ti++)
	{
		eventTitle[ti] = recordData.DTAINFO[ti].EVENT_TITLE_TEXT;
		eventTag[ti] = recordData.DTAINFO[ti].EVENT_TAG;
		dtaDate.setISO8601(recordData.DTAINFO[ti].ACTION_DT_TM);
		eventDtTm[ti] = dtaDate.format("shortDate2")+"  " +dtaDate.format("shortTime");
	}
	/*Construct HTML to show retrived data from script.
	format should be in below way.
	|------------------------------------------------------------------------|
	|Item 					Result 						Date/Time			 |
	|------------------------------------------------------------------------|
	*/
	layoutHtml+="<div class='stg-details-content-show' style='display:none;' id='stg-details-content-faceup"+ formId +"-"+compId+"'>"+
				"<div class='stg-form-header' ><div class='stg-prblm-name'><p class ='stg-prblm-text'>"+problemList+"</p></div>"+
				"<div class='stg-modify-content'><p class ='stg-lstdttm-text'>"+lastDtStrList+"</p></div></div>"+
				"<div class='stg-form-Info'>"+stgInfText+"</div>";
					
	layoutHtml+= this.createResultSection(formId,eventTitle,eventTag,eventDtTm,0,recordData.CLINDTA);
		
	if(recordData.DTAINFO.length > recordData.PATHDTA)
	{
		layoutHtml+= this.createResultSection(formId,eventTitle,eventTag,eventDtTm,recordData.PATHDTA,recordData.AVAILABLEDTA);
	}			
	$componentDom.append(layoutHtml);
	//Show the hidden div constructed for details form view.
	//this logic is implemented due to multiple form getting constructed.
	var showdetailsdiv = "#stg-details-content-faceup"+formId+"-"+compId;
	$(showdetailsdiv).show();
};
/**
* This function is used to Show detail view of available staging form for encounter. 
* @param {compId} compId: id of the component used to get unique id for each element.
* @return {undefined}.
*/
OncologyStagingComponentWF.prototype.showAllStagingFormDetails=function(compId)
{
	$("#stg-details-content-faceup"+ compId).hide();
	$("#stg-showall-form-section"+compId).show();
	$("#stg-show-recent-form-section"+compId).hide();
	$("#stg-show-details-form-section"+compId).hide();	
	$('.stg-faceup-content').hide();
	$("#stg-faceup-content-"+compId+"-0").show();
};
/**
* This function is used hide all staging forms and show only recent one. 
* @param {compId} compId: id of the component used to get unique id for each element.
* @return {undefined}.
*/
OncologyStagingComponentWF.prototype.showRecentStagingForm=function(compId)
{
	$('.stg-details-content').hide();
	$('.stg-faceup-content-hide').hide();
	$("#stg-showall-form-section"+compId).show();
	$("#stg-show-recent-form-section"+compId).hide();
	$('.stg-faceup-content').hide();
	$("#stg-faceup-content-"+compId+"-0").show();
};
/**
* This function is used launch VC staging module from oncology TOC 
* for selcted staged form in user selected mode.
* For Adding new staging, actionType is : 1.0
* For Modify mode actionType is : 2.0
* For recurrence mode actionType is : 3.0
* This function calls onc_set_formactivityid set form activity to WIN32 component.
* @param {Double} formActivityId : formactivity id of the form which is required to be opened in win32 compoent.
* @param {Integer} actionType : user selected action.
* @param {String} stgViewName : name of the view  to which control will navigation.
* @return {undefined}.
*/
OncologyStagingComponentWF.prototype.onNavigationBtn=function(formActivityId,actionType,stgViewName)
{
	var criterion = this.criterion; 
	var compId=this.getComponentId(); 
	/*To launch a staging module , patient and encounter id is required.*/
	if(criterion.encntr_id){
		var capTimer = new CapabilityTimer("CAP:MPG Modify Oncology Staging");	
		capTimer.capture();	
		var sendAr = [];
		var request = new ScriptRequest();    
		request.setProgramName("onc_set_formactivityid");    
		request.setParameterArray(["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",actionType+".00",formActivityId+".0"]);
		request.setResponseHandler(function(recordReply){
			if (recordReply.getResponse().STATUS_DATA.STATUS !== "S"){
				var errorModal=MP_Util.generateModalDialogBody("noMode"+compId,"error","",i18n.discernabu.stg_wf.NO_MODE);
				errorModal.setHeaderTitle(i18n.discernabu.stg_wf.ERROR_OCCURED);
				var closeButton=new ModalButton("noModeCloseButton"+compId);
				closeButton.setText(i18n.discernabu.stg_wf.CLOSE).setCloseOnClick(true);
				errorModal.addFooterButton(closeButton);
				MP_ModalDialog.updateModalDialogObject(errorModal);
				MP_ModalDialog.showModalDialog("noMode"+compId);
			}
		});
		request.performRequest();
		APPLINK(0,"powerchart.exe","/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB="+stgViewName+"");
	}
	else{
		var errorModal=MP_Util.generateModalDialogBody("noEnconuterError"+compId,"error","",i18n.discernabu.stg_wf.NO_ENCOUNTER);
		errorModal.setHeaderTitle(i18n.discernabu.stg_wf.ERROR_OCCURED);
		var closeButton=new ModalButton("closeButton"+compId);
		closeButton.setText(i18n.discernabu.stg_wf.CLOSE).setCloseOnClick(true);
		errorModal.addFooterButton(closeButton);
		MP_ModalDialog.updateModalDialogObject(errorModal);
		MP_ModalDialog.showModalDialog("noEnconuterError"+compId);
	}
};
/**
* This function is used show form details.
* when user selects Detail buttons.
* @param {Integer} formIndex : Index of the form which is to be displayed in deatils pane 
* @param {array} eventTitle : array holding description of each DTA value.
* @param {array} eventTag : array holding result value of each DTA.
* @param {array} eventTag : array holding date and time value of each DTA.
* @param {Integer} bgnCount : starting index of DTAs to be displayed in each section.
* @param {Integer} endCount : last index of DTAs to be displayed in each section.
* @return {string} returns HTML string to display clinical, pathological and other data section in details pane.
*/
OncologyStagingComponentWF.prototype.createResultSection=function(formIndex,eventTitle,eventTag,eventDtTm,bgnCount,endCount)
{
	var layoutHtml = "";
	layoutHtml+="<div class='stg-show-more-details-section' id='stg-show-more-details-section"+ formIndex +"' >" +    
				'<div class="stg-rslt-heading"><div class="stg-rslt-item"><p class="stg-ellipsis">'+i18n.discernabu.stg_wf.ITEM+'</p></div>'+
				'<div class="stg-rslt"><p class="stg-ellipsis">'+i18n.discernabu.stg_wf.RESULT+'</p></div>'+
				'<div class="stg-rslt-dttm"><p class="stg-ellipsis">'+i18n.discernabu.stg_wf.RESULT_DT_TM+'</p></div></div>';
	for(var x =bgnCount;x<endCount;x++)
	{
		if(eventTitle[x] !== "NA"){											
			layoutHtml+='<div class="stg-rslt-row"><div class="stg-rslt-item"><p class="stg-ellipsis" >'+eventTitle[x]+'</p></div>'+
						'<div class="stg-rslt" ><p class="stg-ellipsis" >'+eventTag[x]+'</p></div>'+
						'<div class="stg-rslt-dttm" ><p class="stg-ellipsis" >'+eventDtTm[x]+'</p></div></div>';
		}
	}
	layoutHtml+='</div>';
					 
	return layoutHtml;
}
/**
 * openTab opens the win32 staging tab.
 * @return {Undefined}
 */
OncologyStagingComponentWF.prototype.openTab=function(){
	this.onNavigationBtn(0,1,this.getViewName());
};