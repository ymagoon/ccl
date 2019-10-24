/**
 * Create the Patient Instructions component style object
 * @constructor
 */
function PatientInstructionsComponentStyle() {
    this.initByNamespace("patient-instructions");
}

PatientInstructionsComponentStyle.prototype = new ComponentStyle();
PatientInstructionsComponentStyle.prototype.constructor = ComponentStyle;

/**
 * Create the Patient Instructions component object
 * @constructor
 * @param {Criterion} criterion - The component criterion.
 */


function PatientInstructionsComponent(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new PatientInstructionsComponentStyle());
    this.setDocumentationTimerName("MPG.PATIENT_INSTRUCTION.O1");
    this.setComponentLoadTimerName("USR:" + this.getDocumentationTimerName() + " - load component");
    this.setComponentRenderTimerName("ENG:" + this.getDocumentationTimerName() + " - render component");
    this.setIncludeLineNumber(true);
    this.setConceptCKI("CERNER!E8E22F29-DD0A-436B-AD3D-983DA3177775");
    this.m_eventCD = null;
    this.m_documentationTimerName = null;
    this.m_clinicalEventId = 0;
}

/**
 * The Patient Instructions Component will inherit the Documentation Base Component
 */

PatientInstructionsComponent.prototype= new DocumentationBaseComponent();
PatientInstructionsComponent.prototype.constructor = DocumentationBaseComponent;

/**
 * Gets the eventCD for this documentation component.
 * @returns {Number} The event CD.
 */
PatientInstructionsComponent.prototype.getEventCD = function() {
    return this.m_eventCD;
};

/**
 * Sets the eventCD for this documentation component.
 * @param {Number} eventCD - The event CD.
 */
PatientInstructionsComponent.prototype.setEventCD = function(eventCD) {
    this.m_eventCD = eventCD;
};


/**
 * Sets the last saved clinicalEventId for this component
 * @param {Number} [clinicalEventId] last saved blob's clinical event id
 * @return undefined
 */
 PatientInstructionsComponent.prototype.setClinicalEventID = function (clinicalEventId) {
	this.m_clinicalEventId = clinicalEventId;
};
/**
 * Get the last saved clinicalEventId for this component
 * @return {Number}  Containg value of last saved blob's Clinical event Id
 */
PatientInstructionsComponent.prototype.getClinicalEventID = function () {
	return this.m_clinicalEventId;
};

/**
 * Saves the freetext content of the documentation component.
 * @param {String} content - The freetext content to be saved.
 * @param {Function} statusCallback - The callback function to execute after saving.
 */
PatientInstructionsComponent.prototype.saveFreetext = function (content, statusCallback) {
	var self = this;
	var patInstI18N = i18n.discernabu.patient_instructions_o1;
	var lastSavedText = null;
	//Make a call to the prg of the mp_add_ce_blob_result to save the content of the CKEditor in the clinical events table as a blob.
	var ar = ["^mine^", this.getCriterion().person_id + ".0", this.getCriterion().encntr_id + ".0", this.getCriterion().provider_id + ".0", this.getEventCD(), this.getEventId(), "^^", "^POWERCHART^", 1, this.getCriterion().ppr_cd + ".0",self.getClinicalEventID()];
	var request = new ScriptRequest();
	request.setProgramName("mp_add_ce_blob_result");
	request.setParameterArray(ar);
	request.setAsyncIndicator(true);
	request.setDataBlob(content);
	request.setResponseHandler(function (scriptReply) {
		var response = scriptReply.getResponse();
		if (scriptReply.getStatus() === "S") {
			var df = MP_Util.GetDateFormatter();
			lastSavedText = patInstI18N.LAST_SAVE + df.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
			self.setLastSaveText(lastSavedText);
			statusCallback("S");
			var clinicalEventId = response.REP[0].RB_LIST[0].CLINICAL_EVENT_ID;
			self.setClinicalEventID(clinicalEventId);

		} else if (scriptReply.getStatus() === "F" && response.INVALID_CEID_FLAG === 1) {
			//Displays dialog box informing the user that the Patient Instruction component instance of User is stale.
			var refreshReqMsg = patInstI18N.REFRESH_REQUIRED_MSG.replace("{0}", response.DOCUMENTED_BY);
			MP_Util.AlertConfirm(refreshReqMsg, patInstI18N.SAVE_FAILED_MSG, i18n.discernabu.CONFIRM_OK, null, true, null);
			lastSavedText = patInstI18N.SAVE_FAILED_MSG;
			self.setLastSaveText(lastSavedText);
			statusCallback("F");
		} else {
			lastSavedText = patInstI18N.SAVE_FAILED_MSG;
			self.setLastSaveText(lastSavedText);
			statusCallback("F");
		}
	});
	request.performRequest();
};

/**
 * Overriding the processWorkflowInformation function from the DocumentationBaseComponent since it contained a different functionality.
 * 
 */

PatientInstructionsComponent.prototype.processWorkflowInformation = function () {

    this.getDocumentation();
};

/**
 * Makes the actual call to retrieve the documentation content for this component. This is the content that the
 * user actually sees within the editor.
 */
PatientInstructionsComponent.prototype.getDocumentation = function() {
    //Making a call to mp_retrieve_blob_by_cki to retrieve the contents from the clinical events table blob.
    var sendAr = ["^MINE^", this.getCriterion().person_id + ".0", this.getCriterion().encntr_id + ".0", "^" + this.getConceptCKI() + "^", 0];
    var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(),
        this.getCriterion().category_mean
    );
    var self = this;
    var getDocumentationRequest = new ScriptRequest().
    setProgramName("mp_retrieve_blob_by_cki").
    setParameterArray(sendAr).
    setLoadTimer(loadTimer).
    setResponseHandler(function(reply) {
        if (reply.getStatus() === "S") {
            self.handleSuccess(reply.getResponse());
	    var data = reply.getResponse();
	    self.setClinicalEventID(data.CLINICAL_EVENT_ID);
        } else {
            logger.logError("mp_retrieve_blob_by_cki failed: unable to get documentation for " + self.getStyles().getNamespace() + self.getComponentId());
            self.finalizeComponent(self.generateScriptFailureHTML(), "");
            if (self.m_loadTimer) {
                self.m_loadTimer.fail();
                self.m_loadTimer = null;
            }
        }
    });
    getDocumentationRequest.performRequest();

};

/**
 * The Patient Instructions component will instantiate the CKEditor
 *
 * @constructor
 * @param {Object} recordData
 */

PatientInstructionsComponent.prototype.renderComponent = function(recordData) {
    var html = null;

    //Create and start render timer
    var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
    renderTimer.start();

    try {
        var content = recordData && recordData.BLOB_CONTENTS ? recordData.BLOB_CONTENTS : "";
        var eventID = recordData && recordData.EVENT_ID ? recordData.EVENT_ID : "0.0";
        var eventCD = recordData && recordData.EVENT_CD ? recordData.EVENT_CD : "";

        //remove any extra information from content outside the <body> tags
        var contentLowerCase = content.toLowerCase();
        var indexContentHTML = contentLowerCase.indexOf("<body>");
        var indexEndContentHTML = contentLowerCase.indexOf("</body>");
        var modContentBodyHTML = content.substring((indexContentHTML + 6), indexEndContentHTML);

        // convert html from div mode to paragraph mode
        content = modContentBodyHTML.replace(/[\n\r]/g, "");

        html = ["<div class='documentation-content'>", content, "</div>"];

        this.setDocumentationContent(content);
        this.setEventId(eventID);
        this.setEventCD(eventCD);

        this.finalizeComponent(html.join(""), "");
    } catch (err) {
        var errMsg = ["<b>", i18n.JS_ERROR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li><li>", i18n.NAME, ": ", err.name, "</li><li>", i18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18n.DESCRIPTION, ": ", err.description, "</li></ul>"];
        logger.logError(errMsg.join(""));
        this.finalizeComponent(this.generateScriptFailureHTML(), "");

        //Fail the render timer due to general script failure
        if (renderTimer) {
            renderTimer.fail();
            renderTimer = null;
        }
        //Fail the load timer due to general script failure
        if (this.m_loadTimer) {
            this.m_loadTimer.fail();
            this.m_loadTimer = null;
        }
        throw (err);
    } finally {
        //Stop render timer due to successful render
        if (renderTimer) {
            renderTimer.stop();
            renderTimer = null;
        }
        //Stop load timer due to successful load
        if (this.m_loadTimer) {
            this.m_loadTimer.stop();
            this.m_loadTimer = null;
        }
    }

};

/**
 * Customize the configuration of the current editor
 * @param {Object} config - The configuration object utilized to configure that instance of CKEditor.editor utilized by the component
 * @returns {Object} returns the configuration object passed in after customizations have been made
 */
PatientInstructionsComponent.prototype.customizeEditorConfiguration = function(config) {
    //Store whether or not structure is enabled for this editor.
    config.structuredDocumentationEnabled = false;
    //Removing toolbar
    config.removeButtons = "Bold,Underline,Font,FontSize,Italic,JustifyLeft,JustifyRight,JustifyBlock,JustifyCenter,TextColor,Cut,Copy,Paste,PasteText";
    return config;
};

/**
 * Map the class to the bedrock filter mapping so the architecture will know what class to instantiate
 * when it sees the filter
 */
MP_Util.setObjectDefinitionMapping("WF_PAT_INST", PatientInstructionsComponent);
