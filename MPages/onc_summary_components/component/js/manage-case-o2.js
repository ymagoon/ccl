/**
 * Create the component style object which will be used to style various aspects of our component
 */
function ManageCaseWFStyle() {
  this.initByNamespace("manageCaseWf");
}

ManageCaseWFStyle.prototype = new ComponentStyle();

function ManageCaseWF(criterion) {
  this.setCriterion(criterion);
  this.setComponentLoadTimerName("USR:MPG.MANAGE_CASE.O2 - load component");
  this.setComponentRenderTimerName("ENG:MPG.MANAGE_CASE.O2 - render component");
  this.setStyles(new ManageCaseWFStyle());
  this.namespace = this.getStyles().getNameSpace();
  this.m_readOnly = false;
  this.i18n = i18n.discernabu.manageCaseO2;
}

ManageCaseWF.prototype = new MPageComponent();

ManageCaseWF.prototype.setReadOnly = function(value) {
  this.m_readOnly = value;
};

ManageCaseWF.prototype.getReadOnly = function() {
  return this.m_readOnly;
};

ManageCaseWF.prototype.retrieveComponentData = function() {
  var component = this;
  var criterion = component.getCriterion();
  var noHIData;

  if (criterion.encntr_id) {
    // Peform Multi-Factor Authentication which sets this.mfaAuthStatus value.
    this.performMFA();

    noHIData = this.mfaAuthStatus.value ? '0' : '1';

    component.scriptRequest({
      name: 'HCM_GET_CASE',
      params: [criterion.encntr_id + '.0', noHIData]
    });
  } else  {
    component.finalizeComponent('<span class="disabled">'+ component.i18n.NO_ENCNTR_CASE_TYPE +'</span>');
  }
};

ManageCaseWF.prototype.renderComponent = function(response) {
  var caseInformation;
  var caseInformationTable;

  if (response.STATUS_DATA.STATUS === 'S' && response.CASE_TYPE_IND === 0) {
    this.finalizeComponent('<p class="disabled">' + this.i18n.NO_ENCNTR_CASE_TYPE + '</p>');
    return;
  }

  caseInformation = ManageCaseWorkFlow.caseInformation(response, this.getReadOnly(), this.mfaAuthStatus.value);
  caseInformationTable = ManageCaseWorkFlow.caseInformationTable(this, caseInformation);

  this.finalizeComponent(this.mfaAlertBanner() + caseInformationTable);

  // Attach event handlers
  this.changeCaseStatusEventHandler(caseInformation);
  this.changeCaseTypeEventHandler(caseInformation);
  this.reassignCaseEventHandler(caseInformation);
  this.addPhysicianEventHandler(caseInformation);
  this.updatePhysicianEventHandler(caseInformation);
  this.programLinkEventHandler(caseInformation);
  this.updateReferralSourceEventHandler(caseInformation);
};

/***
 * Gets the Multi factor authentication data and sets the mfaAuthStatus which is used in alert banner.
 */
ManageCaseWF.prototype.performMFA = function() {
  var authStatus = new Mfa_Auth().RetrieveMfaAuthStatus();
  var authResourceAvailable = authStatus && authStatus.isResourceAvailable();
  var authStatusData = authResourceAvailable && authStatus.getResourceData();
  var isAuthSuccess;

  if (authStatusData) {
    // 0 - Authentication Success 5 - Authentication Not Required
    isAuthSuccess = authStatusData.status === 0 || authStatusData.status === 5;

    this.mfaAuthStatus = { value: isAuthSuccess, message: authStatusData.message, status: authStatusData.status };
  }
  else {
    this.mfaAuthStatus = { value: false, message: i18n.discernabu.mfa_auth.MFA_ERROR_MSG, status: 4 };
  }

  // Audit the MFA event.
  this.auditMFAEvent(this.mfaAuthStatus.status);
};

/***
 *  Adds audit event data for multi factor authentication
 */
ManageCaseWF.prototype.auditMFAEvent = function(status) {
  var providerID = this.criterion.provider_id + '.0';
  var mpEventAudit = new MP_EventAudit();
  var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
  var dateTime = dateFormatter.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

  mpEventAudit.setAuditMode(0); // 0 - one-part audit mode
  mpEventAudit.setAuditEventName('HCM_MANAGE_CASE_WORKFLOW_MFA_ATTEMPT');
  mpEventAudit.setAuditEventType('SECURITY');
  mpEventAudit.setAuditParticipantType('PERSON');
  mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
  mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
  mpEventAudit.setAuditParticipantID(providerID);
  mpEventAudit.setAuditParticipantName('STATUS=' + status + '; DATE=' + dateTime);
  mpEventAudit.addAuditEvent();
  mpEventAudit.submit();
};

/***
 * Get the MPage UI alert banner when MFA authentication has an error.
 * @returns {String} alert banner html string.
 */
ManageCaseWF.prototype.mfaAlertBanner = function() {
  var alertBanner = '';

  // Return an empty string if Multi factor authetication is successful.
  if (this.mfaAuthStatus.value) {
    return alertBanner;
  }

  // Return an alert banner if Multi factor authetication fails.
  alertBanner = new MPageUI.AlertBanner();

  // 2 - Access denied  authentication failed, 3 - Access denied authentication cancelled 
  if (this.mfaAuthStatus.status === 2 || this.mfaAuthStatus.status === 3) {
    alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
  } else {
    alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
  }

  alertBanner.setPrimaryText(this.mfaAuthStatus.message)
             .setSecondaryText(this.i18n.MFA_SECONDARY_ALERT_MSG);

  return alertBanner.render();
};

ManageCaseWF.prototype.changeCaseStatusEventHandler = function(caseInformation) {
  var component       = this,
      $caseStatusLink = $("#" + component.getComponentId() + "CaseStatusLink");

  $caseStatusLink.off("click").on("click", function() {
    ManageCaseWorkFlow.caseStatusModal(component, caseInformation);
  });
};

ManageCaseWF.prototype.changeCaseTypeEventHandler = function(caseInformation) {
  var component     = this,
      $caseTypeLink = $("#" + component.getComponentId() + "CaseTypeLink");

  $caseTypeLink.off("click").on("click", function() {
    ManageCaseWorkFlow.caseTypeModal(component, caseInformation);
  });
};

ManageCaseWF.prototype.reassignCaseEventHandler = function(caseInformation) {
  var component        = this,
      $careManagerLink = $("#" + component.getComponentId() + "CareManagerLink");

  $careManagerLink.off("click").on("click", function() {
    ManageCaseWorkFlow.careManagerModal(component, caseInformation);
  });
};

ManageCaseWF.prototype.addPhysicianEventHandler = function(caseInformation) {
  var component          = this,
      $casePhysicianLink = $("#" + component.getComponentId() + "CasePhysicianAddLink");

  $casePhysicianLink.off("click").on("click", function() {
    ManageCaseWorkFlow.addCasePhysicianModal(component, caseInformation);
  });
};

ManageCaseWF.prototype.updateReferralSourceEventHandler = function(caseInformation) {
  var component = this;
  var $referralSourceLink = $('#' + component.getComponentId() + 'ReferralSourceUpdateLink');

  $referralSourceLink.off('click').on('click', function() {
    ManageCaseWorkFlow.updateReferralSourceModal(component, caseInformation);
  });
};

ManageCaseWF.prototype.updatePhysicianEventHandler = function(caseInformation) {
  var component          = this,
      $casePhysicianLink = $("#" + component.getComponentId() + "CasePhysicianUpdateLink");

  $casePhysicianLink.off("click").on("click", function() {
    ManageCaseWorkFlow.updateCasePhysicianModal(component, caseInformation);
  });
};

ManageCaseWF.prototype.programLinkEventHandler = function(caseInformation) {
  var component    = this,
      $programLink = $("#" + component.getComponentId() + "ProgramLink");

  $programLink.off("click").on("click", function() {
    new CapabilityTimer('CAP:MPG MANAGE CASE O2 SUPPORTING FACTS VIEWED').capture();
    ManageCaseWorkFlow.supportingFactsModal(component, caseInformation);
  });
};

ManageCaseWF.prototype.loadFilterMappings = function(){
  this.addFilterMappingObject("WF_MANAGE_CASE_READ_ONLY", {
    setFunction: this.setReadOnly,
    type: "BOOLEAN",
    field: "FREETEXT_DESC"
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
ManageCaseWF.prototype.scriptRequest = function (settings) {
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

  if(settings.success) {
    scriptRequest.setResponseHandler(function(reply) { settings.success(reply.getResponse()); });
  }

  scriptRequest.performRequest();
};

MP_Util.setObjectDefinitionMapping("WF_MANAGE_CASE", ManageCaseWF);
