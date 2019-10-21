function ManageCaseStyle() {
  this.initByNamespace("manageCase");
}

ManageCaseStyle.prototype = new ComponentStyle();
ManageCaseStyle.prototype.constructor = ComponentStyle;

function ManageCase(criterion) {
  this.setCriterion(criterion);
  this.setComponentLoadTimerName("USR:MPG.MANAGE_CASE.O1 - load component");
  this.setComponentRenderTimerName("ENG:MPG.MANAGE_CASE.O1 - render component");
  this.setStyles(new ManageCaseStyle());
  this.namespace = this.getStyles().getNameSpace();
  this.i18n = i18n.discernabu.manageCaseO1;
}

ManageCase.prototype = new MPageComponent();

ManageCase.prototype.setMfaStatus = function(status) {
  this.mfaStatus = status;
} 

ManageCase.prototype.getMfaStatus = function() {
  return this.mfaStatus;
} 

ManageCase.prototype.retrieveComponentData = function() {
  var component = this;
  var criterion = component.getCriterion();
  //1 - Does not return HI data 0- Returns HiData
  var hiDataInd = '0';

  this.performMultiFactorAuthentication();
  if (this.getMfaStatus() === false) { 
    hiDataInd = '1';
  }
  if (criterion.encntr_id) {
    component.scriptRequest({
      name: "HCM_GET_CASE",
      params: [criterion.encntr_id + '.0', hiDataInd]
    });
  } else {
    component.finalizeComponent('<span class="disabled">' + component.i18n.NO_ENCNTR_CASE_TYPE +'</span>');
  }
};

/**
 * This is the ManageCase implementation of the performMultiFactorAuthentication function.  It calls
 * the Mfa_Auth and populates the authStatus with appropriate response.
 * @returns {undefined} returns nothing
 */
ManageCase.prototype.performMultiFactorAuthentication = function () {
  var authStatus = new Mfa_Auth().RetrieveMfaAuthStatus();
  var authStatusData;

  if (authStatus && authStatus.isResourceAvailable()) {
    authStatusData = authStatus.getResourceData();
    if (authStatusData) {
      // 0 - Authentication Success
      // 5 - Authentication Not Required
      authStatusData.statusInd = authStatusData.status === 0 || authStatusData.status === 5;
      this.setMfaStatus(authStatusData.statusInd);
      this.mfaAuthStatusData = authStatusData;
    }
  }
  else {
    this.mfaAuthStatusData = {statusInd: false, status: 4, message: i18n.discernabu.mfa_auth.MFA_ERROR_MSG};
  }
  this.auditMultiFactorAuthentication(this.mfaAuthStatusData.status);
}

/**
 * This is the ManageCase implementation of the auditMultiFactorAuthentication function.  It uses
 * MP_EventAudit to call audit events when multi factor authentication takes place.
 * @param {boolean} status of the mfa
 * @returns {undefined} returns nothing
 */
ManageCase.prototype.auditMultiFactorAuthentication = function(status) {
  // Add Audit Event for Multi-Factor Authentication
  var criterion = this.getCriterion();
  var providerID = criterion.provider_id + '.0';
  var mpEventAudit = new MP_EventAudit();
  var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
  var dateTime = dateFormatter.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

  mpEventAudit.setAuditMode(0);
  mpEventAudit.setAuditEventName('HCM_MANAGE_CASE_SUMMARY_MFA_ATTEMPT');
  mpEventAudit.setAuditEventType('SECURITY');
  mpEventAudit.setAuditParticipantType('PERSON');
  mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
  mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
  mpEventAudit.setAuditParticipantID(providerID);
  mpEventAudit.setAuditParticipantName('STATUS=' + status + '; DATE=' + dateTime);
  mpEventAudit.addAuditEvent();
  mpEventAudit.submit();
}

ManageCase.prototype.renderComponent = function(response) {
  if (response.STATUS_DATA.STATUS === 'S' && response.CASE_TYPE_IND === 0) {
    this.finalizeComponent("<p class='disabled'>" + this.i18n.NO_ENCNTR_CASE_TYPE + "</p>");
    return;
  }
  var caseInformation      = ManageCaseSumm.caseInformation(this, response),
      caseInformationTable = ManageCaseSumm.caseInformationTable(this, caseInformation);

  this.finalizeComponent(this.getMfaBanner() + caseInformationTable);
  this.programLinkEventHandler(response);
};

/**
* Get the MPageUI AlertBanner html string
* @returns {String} - MpageUI Alert Banner HTML stringif MFA has failed,
* else returns blank string.
*/
ManageCase.prototype.getMfaBanner = function() {
  var alertBanner = '';
  var authStatus = this.mfaAuthStatusData;

  if(this.getMfaStatus() === false) {
    alertBanner = new MPageUI.AlertBanner();
    //2 - Access denied authentication failed, 3- Access denied authentication cancelled.
    if(authStatus.status === 2 || authStatus.status === 3) {
      alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
    }
    else {
      alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
    }
    alertBanner.setPrimaryText(authStatus.message).setSecondaryText(this.i18n.MFA_SECONDARY_MSG);
    alertBanner = alertBanner.render();
  }
  return alertBanner;
}

ManageCase.prototype.programLinkEventHandler = function(caseInformation) {
  var component    = this,
      $programLink = $("#" + component.getComponentId() + "-program-link");

  $programLink.off("click").on("click", function() {
    new CapabilityTimer('CAP:MPG MANAGE CASE O1 SUPPORTING FACTS VIEWED').capture();
    ManageCaseSumm.supportingFactsModal(component, caseInformation);
  });
};
/**
 * Creates and performs a ComponentScriptRequest.
 * @param {Object} settings - setting for the ComponentScriptReply.
 *        {String} name - name of the ccl program that needs to be executed.
 *        {(String|String[])} [params] - a param, or an array of params to be passed to the ccl script.
 *        {Boolean} [rawDataIndicator] - sets the raw data on ComponentScriptRequest and sets response
 *                                       handler to handle raw data correctly.
 *        {callBack} success - sets a success callback handler. This callback gets the json parsed body
 *                     from the proxyReply when raw data is set and response object when it's not set.
 *        {callBack} failure - sets a failure callback handler. This callback gets the json parsed proxyReply
 *                     when raw data is set and is never called when it's not set.
 *        {RTMSTimer} [loadTimer=new RTMSTimer(component.getComponentLoadTimerName())]
 *        {RTMSTimer} [renderTimer=new RTMSTimer(component.getComponentRenderTimerName())]
 */
ManageCase.prototype.scriptRequest = function (settings) {
  var component     = this,
      settings      = settings || {},
      loadTimer     = settings.loadTimer || new RTMSTimer(component.getComponentLoadTimerName()),
      renderTimer   = settings.renderTimer || new RTMSTimer(component.getComponentRenderTimerName()),
      scriptRequest = new ComponentScriptRequest();

  scriptRequest.setComponent(component);
  scriptRequest.setLoadTimer(loadTimer);
  scriptRequest.setRenderTimer(renderTimer);
  scriptRequest.setProgramName(settings.name);
  settings.params && scriptRequest.setParameterArray(['^MINE^'].concat(settings.params));

  if (settings.rawDataIndicator) {
    scriptRequest.setRawDataIndicator(settings.rawDataIndicator);
    scriptRequest.setResponseHandler(function(reply) {
      component.handleRawResponse(reply, settings.success, settings.failure);
    });
  } else if (settings.success) {
    scriptRequest.setResponseHandler(function(reply) { settings.success(reply.getResponse()); });
  }

  scriptRequest.performRequest();
};

MP_Util.setObjectDefinitionMapping("MANAGE_CASE", ManageCase);
