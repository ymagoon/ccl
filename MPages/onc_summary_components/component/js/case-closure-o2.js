/**
 * Create the component style object which will be used to style various aspects of our component
 * @returns {void}
 */
function CaseClosureWfStyle() {
  this.initByNamespace('caseClosureWf');
}
CaseClosureWfStyle.prototype = new ComponentStyle();
CaseClosureWfStyle.prototype.constructor = ComponentStyle;

/**
 * Initialize the case-closure-o2 component
 * @param {object} criterion : The Criterion object which contains information needed to render the component.
 * @returns {void}
 */
function CaseClosureWf(criterion) {
  this.setCriterion(criterion);
  this.setComponentLoadTimerName('USR:MPG.CASE_CLOSURE.O2 - load component');
  this.setComponentRenderTimerName('ENG:MPG.CASE_CLOSURE.O2 - render component');
  this.setStyles(new CaseClosureWfStyle());
  this.namespace = this.getStyles().getNameSpace();
  this.i18n = i18n.discernabu.CaseClosureO2;
  this.hasOpenReminders = false;
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
CaseClosureWf.prototype = new MPageComponent();
CaseClosureWf.prototype.constructor = MPageComponent;


/**
 * This is the CaseClosureWf implementation of the retrieveComponentData function.
 * @returns {void}
 */
CaseClosureWf.prototype.retrieveComponentData = function() {
  var component = this;
  var criterion = component.getCriterion();

  if (criterion.encntr_id) {
    component.scriptRequest({
      name: 'HCM_GET_CASE',
      params: [ criterion.encntr_id + '.0' ]
    });
  }
  else {
    component.finalizeComponent('<span class="disabled">' + component.i18n.NO_ENCNTR_CASE_TYPE + '</span>');
  }
};

CaseClosureWf.prototype.selectTag = function(name, idDisplayList, options) {
  idDisplayList = $.makeArray(idDisplayList);
  options = options || { prompt: null, selected: null, disabled: '' };
  var selectTag = '<select ' + options.disabled + ' name="' + name + '">';

  // adds prompt as the first option for select with no name (only display value)
  if (options.prompt) {
    idDisplayList.unshift({ id: '', display: options.prompt });
  }

  selectTag += $.map(idDisplayList, function(value){
    if (options.selected && options.selected === value.id) {
      return '<option value="' + value.id + '" selected>' + value.display + '</option>';
    }
    else {
      return '<option value="' + value.id + '">' + value.display + '</option>';
    }
  }).join('');
  selectTag += '</select>';

  return selectTag;
};

CaseClosureWf.prototype.caseClosureHtml = function(reply) {
  var component = this;
  var closureReasons = reply.AVAILABLE_CASE_STATUSES.CLOSURE_REASONS;
  var selectedReason = '';
  var disabled = '';
  var currentStatus = reply.CURRENT_STATUS_CD;
  var closureStatus = component.getCaseClosure(reply.CASE_STATUSES);

  if(!closureStatus && !reply.HAS_MODIFY_CASE_IND){
    var errorPrivilegeMessage = component.i18n.PRIVILEGE_ERROR;
    return errorPrivilegeMessage;
  }

  if(closureStatus && closureStatus.STATUS_CD === currentStatus){
    selectedReason = reply.CLOSURE_REASON_CD;
    disabled = 'disabled';
  }

  var formStr = '<form id="' + component.getComponentId() + '-filter-form" class="' + component.namespace + '-filter-form"><div>';
  var closureOptions = $.map(closureReasons, function(closureReason) { return { id: closureReason.REASON_CD, display: closureReason.REASON_DISP }; });

  formStr += '<div class="' + component.namespace + '-reason-label">' + component.i18n.CLOSURE_REASON + '</div><div>' + component.selectTag('reason', closureOptions, { prompt: ' ', selected: selectedReason, disabled: disabled });
  formStr += '</div><div class="' + component.namespace + '-button-div"><input type="button" class="' + component.namespace + '-right-aligned-button" id="' + component.getComponentId() + '-clear-cases" value="' + component.i18n.CLEAR + '" disabled="disabled">';
  formStr += '<input type="button" id="' + component.getComponentId() + '-close-case" class="' + component.namespace + '-right-aligned-button" value="' + component.i18n.CLOSURE_CONFIRM + '" disabled="disabled"></div> ';
  formStr += '</form>';
  return formStr;
};

CaseClosureWf.prototype.getCaseClosure = function(statuses){
  return $.grep(statuses, function(caseStatus) {
            return caseStatus.STATUS_CDF_MEANING === 'CLOSED';
         })[0];
};

CaseClosureWf.prototype.renderComponent = function(reply) {
  if (reply.STATUS_DATA.STATUS === 'S' && reply.CASE_TYPE_IND === 0) {
    this.finalizeComponent('<p class="disabled">' + this.i18n.NO_ENCNTR_CASE_TYPE + '</p>');
    return;
  }

  var component = this;
  var componentId = component.getComponentId();
  var $mainContainerObj = $('<div id="' + componentId + '-main-container" class="' + this.nameSpace + '-main-container">');
  var filterFormStr = component.caseClosureHtml(reply);

  $mainContainerObj.append(filterFormStr);
  component.finalizeComponent($mainContainerObj[0].outerHTML);

  $('#' + componentId + '-filter-form select' ).change(function() {
    component.disableButtons($.trim(this.value) === '');
  });

  $('#' + componentId + '-filter-form #' + componentId + '-clear-cases').click(function() {
    $('#' + componentId + '-filter-form select').prop('selectedIndex', 0);
    component.disableButtons(true);
  });

  $('#' + componentId + '-filter-form #' + componentId + '-close-case').click(function() {
    component.getOpenReminders(reply);
  });

};

CaseClosureWf.prototype.closeCaseEncounters = function(caseInfo, reasonId){
  var component = this;
  var componentId = component.getComponentId();
  var caseInfoJson = this.caseInformation(caseInfo, reasonId);

  component.disableButtons(true);
  MP_Util.LoadSpinner(component.getSectionContentNode().id, 1);
  component.scriptRequest({
  name: 'HCM_CHG_CASE',
  params: [ component.criterion.person_id + '.0', component.criterion.encntr_id + '.0', '^' + caseInfoJson + '^' ],
    success: function(reply) {
      component.checkForFailedUpdate(reply);
    }
  });
};

CaseClosureWf.prototype.checkForFailedUpdate = function(reply) {
  var component = this;
  var componentId = component.getComponentId();

  component.disableButtons(false);
  if (reply.STATUS_DATA.STATUS !== 'S') {
    $('#' + componentId + '-main-container').find('.loading-screen').remove();
    component.displayErrorModal();
  }
  else {
    component.retrieveComponentData();
  }
};

CaseClosureWf.prototype.displayErrorModal = function() {
  var component = this;
  var compNS = component.namespace;
  var modalId = component.getComponentId() + 'displayError';
  var modalDialog;
  var modalBody = '<span class="' + compNS + '-error-icon">' + component.i18n.CLOSURE_FAILURE + '</span><br>';

  // Delete any existing modal dialog object with modalId.
  MP_ModalDialog.deleteModalDialogObject(modalId);

  // Create a new modal dialog with the modalId.
  modalDialog = new ModalDialog(modalId);

  modalDialog.setHeaderTitle(this.i18n.ERROR_OCCURRED)
       .setTopMarginPercentage(25)
       .setRightMarginPercentage(35)
       .setBottomMarginPercentage(20)
       .setLeftMarginPercentage(30)
       .setIsBodySizeFixed(false)
       .setHasGrayBackground(true)
       .setIsFooterAlwaysShown(true);

  modalDialog.setBodyDataFunction(function(modalObj) {
    modalObj.setBodyElementId(component.namespace + 'modalBody');
    modalObj.setBodyHTML('<div><p>' + modalBody + '</p></div>');
  });

  var cancelButton = new ModalButton('Close');
  cancelButton.setText(this.i18n.CLOSE).setIsDithered(false).setOnClickFunction(function() {
    MP_ModalDialog.closeModalDialog(modalId);
  });
  modalDialog.addFooterButton(cancelButton);

  MP_ModalDialog.updateModalDialogObject(modalDialog);
  MP_ModalDialog.showModalDialog(modalId);
};

CaseClosureWf.prototype.caseInformation = function(caseInfo, reasonId) {
	var CASE_INFO = {};
	CASE_INFO.CASE_INFORMATION = {};
	CASE_INFO.CASE_INFORMATION.VERSION = caseInfo.VERSION;
	CASE_INFO.CASE_INFORMATION.CURRENT_STATUS_CD = caseInfo.CURRENT_STATUS_CD;
	CASE_INFO.CASE_INFORMATION.CURRENT_CARE_MANAGER_PRSNL_RELTN_ID = caseInfo.CURRENT_CARE_MANAGER_PRSNL_RELTN_ID;
	CASE_INFO.CASE_INFORMATION.CASE_STATUS = {};

  var caseStatus = this.getCaseClosure(caseInfo.AVAILABLE_CASE_STATUSES.STATUSES);

  CASE_INFO.CASE_INFORMATION.CASE_STATUS.CASE_CD = caseStatus.STATUS_CD;
  CASE_INFO.CASE_INFORMATION.CASE_STATUS.REASON_CD = parseFloat(reasonId);

  var caseInfoJsonString = JSON.stringify(CASE_INFO);

  // Replacing double quotes (") with single quotes (') to pass json to CCL
  return caseInfoJsonString.replace(/"/g, '\'');
};

CaseClosureWf.prototype.confirmCloseCase = function(caseInfo, reasonId) {
  var component = this;
  var compNS = component.namespace;
  var modalId = component.getComponentId() + 'confirmCloseCase';
  var modalDialog;
  var modalBody = '';

  if (component.hasOpenReminders) {
    modalBody = '<span class="' + compNS + '-warn-icon">' + component.i18n.OPEN_REMINDERS + '</span><br>';
  }
  else {
    modalBody = '<span class="' + compNS + '-warn-icon">' + component.i18n.CLOSURE_WARNING + '</span><br>';
  }

  // Delete any existing modal dialog object with modalId.
  MP_ModalDialog.deleteModalDialogObject(modalId);

  // Create a new modal dialog with the modalId.
  modalDialog = new ModalDialog(modalId);

  modalDialog.setHeaderTitle(this.i18n.CASE_CLOSURE)
       .setTopMarginPercentage(25)
       .setRightMarginPercentage(35)
       .setBottomMarginPercentage(20)
       .setLeftMarginPercentage(30)
       .setIsBodySizeFixed(false)
       .setHasGrayBackground(true)
       .setIsFooterAlwaysShown(true);

  modalDialog.setBodyDataFunction(function(modalObj) {
    modalObj.setBodyElementId(compNS + 'modalBody');
    modalObj.setBodyHTML('<div><p>' + modalBody + '</p></div>');
  });

  var confirmButton = new ModalButton('Confirm');
  confirmButton.setText(this.i18n.CONFIRM).setIsDithered(false).setFocusInd(true).setOnClickFunction(function() {
    new CapabilityTimer('CAP:MPG CASE CLOSURE O2 CASE CLOSED').capture();
    MP_ModalDialog.closeModalDialog(modalId);
    component.closeCaseEncounters(caseInfo, reasonId);
  });
  modalDialog.addFooterButton(confirmButton);

  var cancelButton = new ModalButton('Cancel');
  cancelButton.setText(this.i18n.CANCEL).setIsDithered(false).setOnClickFunction(function() {
    MP_ModalDialog.closeModalDialog(modalId);
  });
  modalDialog.addFooterButton(cancelButton);

  MP_ModalDialog.updateModalDialogObject(modalDialog);
  MP_ModalDialog.showModalDialog(modalId);
};

CaseClosureWf.prototype.disableButtons = function(bool) {
  $('#' + this.getComponentId() + '-clear-cases').prop('disabled', bool);
  $('#' + this.getComponentId() + '-close-case').prop('disabled', bool);
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
 * @returns {void}
 */
CaseClosureWf.prototype.scriptRequest = function(settings) {
  var component = this;
  settings = settings || {};
  var loadTimer = settings.loadTimer || new RTMSTimer(component.getComponentLoadTimerName());
  var renderTimer = settings.renderTimer || new RTMSTimer(component.getComponentRenderTimerName());
  var scriptRequest = new ComponentScriptRequest();

  scriptRequest.setComponent(component);
  scriptRequest.setLoadTimer(loadTimer);
  scriptRequest.setRenderTimer(renderTimer);
  scriptRequest.setProgramName(settings.name);
  if (settings.params) {
    scriptRequest.setParameterArray([ '^MINE^' ].concat(settings.params));
  }

  if(settings.success) {
    scriptRequest.setResponseHandler(function(reply) {
      settings.success(reply.getResponse());
    });
  }
  scriptRequest.performRequest();

};

CaseClosureWf.prototype.getOpenReminders = function(caseInfo) {
  var component = this;
  var criterion = component.getCriterion();
  var encntrVal = 'value(' + criterion.encntr_id + ')';
  var stickNoteTypes = 0.0;
  /*The MP_RETRIEVE_NOTE_REMINDER_JSON CCL program takes in a parameter which is a sum of mask it needs to set in order to retrieve codes.
   *LOAD_STICKNOTES_IND at 1, LOAD_NOTESREMINDERS_IND at 2, RESOLVE_CODES_IND at 4 & RESOLVE_PRSNL_IND at 8
   * So, if we would like to get all we need to sum all four and pass it as a parameter to MP_RETRIEVE_NOTE_REMINDER_JSON program,
   * In this case we would like to avoid getting Sticky notes, so we would sum the rest to get 2+4+8 and that is 14
   */
  var loadingPolicy = 14;
  var lookbackUnits = 0;
  var lookbackFlag = 0;
  var componentId = component.getComponentId();

  MP_Util.LoadSpinner(component.getSectionContentNode().id, 1);

  component.scriptRequest({
    name: 'MP_RETRIEVE_NOTE_REMINDER_JSON',
    params: [ criterion.person_id + '.0', stickNoteTypes, loadingPolicy, encntrVal, lookbackUnits, lookbackFlag, criterion.provider_id + '.0', criterion.ppr_cd + '.0' ],
    success: function(reply) {
      var reminders = reply.REMINDERS;
      component.hasOpenReminders = reminders.length > 0;
      $('#' + component.getSectionContentNode().id).find('.loading-screen').remove();
      component.confirmCloseCase(caseInfo, $('#' + componentId + '-filter-form select').val());
    }
  });

};

/**
 * Map the case-closure-o2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_CASE_CLOSURE" filter
 */
MP_Util.setObjectDefinitionMapping('WF_CASE_CLOSURE', CaseClosureWf);
