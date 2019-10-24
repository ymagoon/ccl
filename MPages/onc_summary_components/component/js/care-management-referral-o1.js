function HcmReferralStyle() {
  this.initByNamespace('hcmReferral');
}

HcmReferralStyle.prototype = new ComponentStyle();

function HcmReferral(criterion) {
  this.setCriterion(criterion);
  this.setComponentLoadTimerName('USR:MPG.CARE_MANAGEMENT_REFERRAL.O1 - load component');
  this.setComponentRenderTimerName('ENG:MPG.CARE_MANAGEMENT_REFERRAL.O1 - render component');
  this.setStyles(new HcmReferralStyle());

  this.namespace = this.getStyles().getNameSpace();
  HcmReferral.i18n = i18n.discernabu.HcmReferral;
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
HcmReferral.prototype = new MPageComponent();

HcmReferral.prototype.setAddPmConversationTask = function(value) {
  this.taskNumber = value.length > 0 ? parseFloat(value) : null;
};

HcmReferral.prototype.getAddPmConversationTask = function() {
  return this.taskNumber;
};

HcmReferral.prototype.setEditPmConversationTask = function(value) {
  this.editPmConversationTask = value.length > 0 ? parseFloat(value) : null;
};

HcmReferral.prototype.getEditPmConversationTask = function() {
  return this.editPmConversationTask;
};

HcmReferral.prototype.personDemographicsUri = function(hiPersonId) {
  return this.personDemographicsTestUri || 'hi_record_api_person_demographics';
};

HcmReferral.prototype.setAddNewPersonInd = function(value) {
  this.addNewPersonInd = value;
};

HcmReferral.prototype.getAddNewPersonInd = function() {
  return this.addNewPersonInd;
};

HcmReferral.prototype.setEditPatientInfoInd = function(value) {
  this.editPatientInfo = value;
};

HcmReferral.prototype.getEditPatientInfoInd = function() {
  return this.editPatientInfo;
};

HcmReferral.prototype.setAddEditInd = function(value) {
  this.addEditInd = value;
};

HcmReferral.prototype.getAddEditInd = function() {
  return this.addEditInd;
};

HcmReferral.prototype.setHiSearchInd = function(value) {
  this.hiSearchInd = value;
};

HcmReferral.prototype.getHiSearchInd = function() {
  //Return false only when 'Search External Filter' bedrock is false,
  //return true otherwise(true, null, undefined - when bedrock filter is unavailable.)
  return (this.hiSearchInd === false) ? false : true;
};

HcmReferral.prototype.setMfaBanner = function(value) {
  this.mfaBanner = value;
};

HcmReferral.prototype.getMfaBanner = function() {
  return this.mfaBanner;
};

/**
 * This function is used to load the filters that are associated to this
 * component. Each filter mapping is associated to one specific component
 * setting. The filter mapping lets the MPages architecture know which functions
 * to call for each filter.
 */
HcmReferral.prototype.loadFilterMappings = function() {
  var component = this;

  var generateSetFunctionFor = function(attribute) {
    return function(value) {
      // Our test uri is returned from Bedrock "scrubbed" for clean HTML presentation. This replace
      // restores the '/' characters to our test uris.
      component[attribute] = value.replace(/&#047;/g, '/');
    };
  };

  this.addFilterMappingObject('REFERRAL_CONVERSATION', {
    setFunction: this.setAddPmConversationTask,
    type: 'STRING',
    field: 'FREETEXT_DESC'
  });

  this.addFilterMappingObject('PERSON_SEARCH_TEST_URI', {
    type: 'STRING',
    field: 'FREETEXT_DESC',
    setFunction: generateSetFunctionFor('personSearchTestUri')
  });

  this.addFilterMappingObject('PERSON_DEMOGRAPHICS_TEST_URI', {
    type: 'STRING',
    field: 'FREETEXT_DESC',
    setFunction: generateSetFunctionFor('personDemographicsTestUri')
  });

  this.addFilterMappingObject('EDIT_PM_CONVERSATION', {
    setFunction: this.setEditPmConversationTask,
    type: 'STRING',
    field: 'FREETEXT_DESC'
  });

  this.addFilterMappingObject('ADD_NEW_PERSON', {
    setFunction: this.setAddNewPersonInd,
    type: 'BOOLEAN',
    field: 'FREETEXT_DESC'
  });

  this.addFilterMappingObject('EDIT_PATIENT_INFO', {
    setFunction: this.setEditPatientInfoInd,
    type: 'BOOLEAN',
    field: 'FREETEXT_DESC'
  });

  this.addFilterMappingObject('SHOW_HI_SEARCH', {
    setFunction: this.setHiSearchInd,
    type: 'BOOLEAN',
    field: 'FREETEXT_DESC'
  });
};

/* Main rendering functions */

/**
 * This is the HcmReferral implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 * This function will be called from the MPages architecture when it is ready for the component to render its content.
 */
HcmReferral.prototype.retrieveComponentData = function() {
  var component = this;
  var criterion = this.getCriterion();
  var careManagerId = component.criterion.getPersonnelInfo().getPersonnelId();

  if (component.getHiSearchInd()) {
    component.authenticateHealtheIntentAccess();
  }

  HcmReferral.utils.scriptRequest(component, {
    name: 'HCM_GET_REFERRAL_DATA',
    params: [ criterion.provider_id + '.0', careManagerId, '^' + this.criterion.position_cd + '^' ],
    success: function(response) {
      component.cmOrganizationID = response.ORGANIZATION_ID;
      component.setAddEditInd(response.HAS_ADD_EDIT_PRIVILEGE);
      component.renderComponent(response.HAS_REFERRAL_PRIVILEGE, response.IS_SUPERVISOR);
    }
  });
};

/**
 * This function calls the MFA utility to verify the users ability to view external HI data.
 * Upon successful verification, the HI person search will search HI data.
 * If authentication fails, the search will be restricted to Millennium data.
 */
HcmReferral.prototype.authenticateHealtheIntentAccess = function() {
  var component = this;
  var authStatus;
  var authStatusData;
  // MFA error status
  var status = 4;
  var disableExternalData = function(status, message) {
    component.createMfaBanner(status, message);
    component.setHiSearchInd(false);
  }

  // MFA Auth API call
  authStatus = new Mfa_Auth().RetrieveMfaAuthStatus();
  if (authStatus.isResourceAvailable()) {
    authStatusData = authStatus.getResourceData();
    if (authStatusData) {
      status = authStatusData.status;
      // If status is not successful and needed still for current session
      if (status !== 0 && status !== 5) {
        disableExternalData(status, authStatusData.message);
      }
    }
  }
  else {
    disableExternalData(status, i18n.discernabu.mfa_auth.MFA_ERROR_MSG);
  }

  component.auditMfaAuth(status);
};

/**
 * This function creates and sets the appropriate mfa alert banner.
 * @param {int} status - status number of the mfa call
 * @param {String} message - the message to display on the alert banner
 */
HcmReferral.prototype.createMfaBanner = function(status, message) {
  var component = this;
  var alertBanner = new MPageUI.AlertBanner();

  // If user fails to authenticate or cancels authentication
  if (status === 2 || status === 3) {
    alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
  }
  else {
    alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
  }
  alertBanner
    .setPrimaryText(message)
    .setSecondaryText(HcmReferral.i18n.MFA_RESTRICTION);
  component.setMfaBanner(alertBanner);
}

/**
 * This function submits the event audit for MFA.
 * @param {int} status - status number of the mfa call
 */
HcmReferral.prototype.auditMfaAuth = function(status) {
  var component = this;
  var providerID = component.getCriterion().provider_id + '.0';
  var mpEventAudit = new MP_EventAudit();
  var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
  var dateTime = new Date();

  dateTime = dateFormatter.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

  mpEventAudit.setAuditMode(0);
  mpEventAudit.setAuditEventName('HCM_MANUAL_REFERRAL_MFA_ATTEMPT');
  mpEventAudit.setAuditEventType('SECURITY');
  mpEventAudit.setAuditParticipantType('PERSON');
  mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
  mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
  mpEventAudit.setAuditParticipantID(providerID);
  mpEventAudit.setAuditParticipantName('STATUS=' + status + ';DATE=' + dateTime);
  mpEventAudit.addAuditEvent();
  mpEventAudit.submit();
};

/**
 * Method returns modalIds after prepending componentId
 */
HcmReferral.prototype.componentSubId = function(subId) {
  return this.getComponentId() + subId;
};

/**
 * This is the HcmReferral implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.
 * @param {hasComponentPrivilege} Indicates if the user has privilege or not to access this component
 * @param {isSupervisor} Indicates if the user is a supervisor
 */
HcmReferral.prototype.renderComponent = function(hasComponentPrivilege, isSupervisor) {
  var component = this;
  var componentViewId = component.getCriterion().category_mean;
  var componentId = this.namespace + this.getComponentId();
  var subTitleId = componentId + '-sub-title';
  var cmNameClass = this.namespace + '-cm-name';
  var componentBody = '';
  var searchButton;
  var $subTitle;
  var mfaBanner = component.getMfaBanner();

  // stop here if user does not have privileges
  if (!hasComponentPrivilege) {
    return component.finalizeComponent('<div class="no-priv-msg">' + HcmReferral.i18n.NO_PRIV_MSG + '</div>');
  }

  if (mfaBanner) {
    componentBody += mfaBanner.render();
  }

  searchButton = HcmReferral.SearchButton.create(component);

  componentBody += searchButton.render();

  componentBody += '<div class="' + component.namespace + '-recently-assigned-table">'
      + '<div class="' + component.namespace + '-recently-assigned-table-header"> ' + HcmReferral.i18n.RECENTLY_ASSIGNED_CASES + ' </div>'
      + '<span class="disabled">' + HcmReferral.i18n.NO_RESULTS_FOUND + '</span> </div>';

  component.finalizeComponent(componentBody);
  searchButton.finalize();

  $('#' + componentId + ' .sec-hd').after('<div id = "' + subTitleId + '" class = "sub-title-disp"></div>');
  $subTitle = $('#' + subTitleId);

  if (isSupervisor) {
    $subTitle.hide();
    searchButton.disable();

    $(document).one('careManagerSelected', function(event) {
      if (componentViewId === event.viewId) {
        $subTitle.show();
        searchButton.enable();
      }
    });

    // Load recently referred people menu when supervisor selects care manager
    $(document).on('careManagerSelected', function(event) {
      if (componentViewId === event.viewId) {
        component.selectedCareManager = event.careManagerId;
        $('#' + subTitleId).html('Care Manager: <span class="' + cmNameClass + '">' + event.name + '</span>');
        HcmReferral.dataRequests.retrieveRecentReferredPeople(component);
      }
    });
  }
  else {
    // Load recently referred people menu for logged in care manager
    HcmReferral.dataRequests.retrieveRecentReferredPeople(component);
  }
};

HcmReferral.prototype.failureCallBack = function() {
  MP_Util.LogError('Error retrieving results');
};

MP_Util.setObjectDefinitionMapping('HCM_REFERRAL', HcmReferral);
var HcmReferral = HcmReferral || {};

HcmReferral.recentlyReferredTable = function(component, people) {
  this.people = people;
  this.component = component;

    // Returns the first FIN number from the list
  var getFinNumDisplay = function(aliases) {
    var encounterAliases = aliases || [];
    var finNbrAliases = $.grep(encounterAliases, function(alias){ return alias.TYPE_MEANING === 'FIN NBR'; });
    return finNbrAliases.length ? finNbrAliases[0].ALIAS : null;
  };

  var formatDataForTable = function(people) {
    var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
    var dateOfBirth;

    $.each(people, function(_, person) {
      person.ASSIGNED_DATE = person.CASE_ASSIGNED_DT_TM ? df.formatISO8601(person.CASE_ASSIGNED_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR) : HcmReferral.i18n.NO_DATA;

      if (CERN_Platform.inMillenniumContext()) {
        person.CHART_LINK = '<a href="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + person.ID + ' /ENCNTRID=' + person.ENCNTR_ID + ' /FIRSTTAB=^^\')">' + person.FULL_NAME + '</a>';
      }
      else {
        person.CHART_LINK = person.FULL_NAME;
      }

      if (person.BIRTH_DT_TM){
        dateOfBirth = new Date();
        dateOfBirth.setISO8601(person.BIRTH_DT_TM);
        person.DATE_OF_BIRTH = dateOfBirth.format(MPAGE_LOCALE.fulldate4yr, true);
      }
      else {
        person.DATE_OF_BIRTH = HcmReferral.i18n.NO_DATA;
      }

      person.FIN_NUM = getFinNumDisplay(person.ENCOUNTER_ALIASES);
      if(person.FIN_NUM) {
        person.DEMOGRAPHICS = '<span class="disabled">' + HcmReferral.i18n.PERSON_DEMOGRAPHICS_TEMPLATE.replace('${AGE}', person.AGE).replace('${SEX_DISP}', person.SEX_DISP).replace('${DATE_OF_BIRTH}', person.DATE_OF_BIRTH) + '</span><br><span class="disabled">' + HcmReferral.i18n.PERSON_FIN_TEMPLATE.replace('${FIN_NUM}', person.FIN_NUM) + '</span>';
      }
      else {
        person.DEMOGRAPHICS = '<span class="disabled">' + HcmReferral.i18n.PERSON_DEMOGRAPHICS_TEMPLATE.replace('${AGE}', person.AGE).replace('${SEX_DISP}', person.SEX_DISP).replace('${DATE_OF_BIRTH}', person.DATE_OF_BIRTH) + '</span>';
      }
    });
  };

  var createColumn = function(columnId, columnClass, display, template) {
    var column = new TableColumn();

    column.setColumnId(columnId);
    column.setCustomClass(columnClass);
    column.setColumnDisplay(display);
    column.setRenderTemplate(template);

    return column;
  };

  this.table = function() {
    var table = new ComponentTable();
    var component = this.component;
    var patientInfoInd = component.getEditPatientInfoInd();
    var addEditInd = component.getAddEditInd();
    var namespace = component.namespace;
    var customClass = (patientInfoInd && addEditInd) ? namespace + '-width-six-column' : namespace + '-width-five-column';

    table.setNamespace(namespace);

    table.addColumn(createColumn('name', customClass, HcmReferral.i18n.PERSON, '${CHART_LINK} <br> ${DEMOGRAPHICS}'));
    table.addColumn(createColumn('referral-source', customClass, HcmReferral.i18n.REFERRAL_SOURCE_TABLE_HEADER, '${REFERRAL_SOURCE_DISP}'));
    table.addColumn(createColumn('referral-reason', customClass, HcmReferral.i18n.REFERRAL_REASON_TABLE_HEADER, '${REFERRAL_REASON_DISP}'));
    table.addColumn(createColumn('case-type', customClass, HcmReferral.i18n.CASE_TYPE_TABLE_HEADER, '${CASE_TYPE_DISP}'));
    table.addColumn(createColumn('date-assigned', customClass, HcmReferral.i18n.DATE_ASSIGNED, '${ASSIGNED_DATE}'));
    if(patientInfoInd && addEditInd) {
      table.addColumn(createColumn('modify', customClass, '', '<a href="#" class="' + namespace + '-modify-pat-details" id="${ID}"> ' + HcmReferral.i18n.EDIT_PATIENT_INFORMATION + ' </a>'));
    }
    return table;
  };

  this.html = function(options) {
    var table = this.table();
    var component = this.component;
    var modifyPatientDetails = '.' + component.namespace + '-modify-pat-details';
    var tableHeader = '';

    formatDataForTable(this.people);
    table.bindData(this.people);

    $(document).off('click', modifyPatientDetails).on('click', modifyPatientDetails, function(event) {
      HcmReferral.personDetails.modifyPatientDetails(component, event.target.id);
    });

    if (options.header) {
      var tableHeader = '<div class="' + component.namespace + '-recently-assigned-table-header"> ' +
                          options.header +
                        ' </div>';
    }
    return (tableHeader + table.render());
  };

  //private api exposed for testing
  HcmReferral.__recentlyReferredTable = {
    formatDataForTable: formatDataForTable
  };

  return this;
};
var HcmReferral = HcmReferral || {};

HcmReferral.callBacks = (function() {

  /**
  * This function will return the error message depending upon the sub event status.
  * @param {string} subEventStatus - sub event status of the script response.
  * @returns {string} error message
  */
  function getErrorMsg(subEventStatus) {
    if (subEventStatus === 'NO_CARE_MANAGEMENT_ORG' ) {
      return HcmReferral.i18n.CREATE_CASE_NO_ORG_ERROR;
    }
    else if (subEventStatus === 'TOO_MANY_DEFAULT_ORGS') {
      return HcmReferral.i18n.CREATE_CASE_MULTIPLE_ORG_ERROR;
    }
    else {
      return HcmReferral.i18n.CASE_RETRIEVAL_ERROR;
    }
  }

  function onAddPersonCallback(component, personSearchModalId, isMillSearchEnabled) {
    var pmConvo;
    var calledConveration;

    if($.trim(component.getAddPmConversationTask()) !== '') {
      calledConveration = true;
      pmConvo = HcmReferral.personDetails.runConversation(
        component.getAddPmConversationTask(),
        component.cmOrganizationID,
        null,
        isMillSearchEnabled
      );

      if (pmConvo.success) {
        //trigger the cap timer for add new person
        new CapabilityTimer('CAP:MPG CARE MANAGEMENT REFERRAL NEW PERSON ADDED').capture();

        MP_ModalDialog.closeModalDialog(personSearchModalId);
        if(!isMillSearchEnabled) {
          HcmReferral.utils.scriptRequest(component, {
            name: 'MP_GET_PATIENT_DEMO',
            params: [ pmConvo.personId + '.0' ],
            success: function(response) {
              HcmReferral.personDetails.extractPersonDemoData(component, response);
            }
          });
        }
        HcmReferral.caseModals.newCase(component, pmConvo.personId, '');
      }
    }

    if (!calledConveration || pmConvo.failure) {
      HcmReferral.caseModals.errorModal(
        component.getComponentId() + 'ConversationErrorModal',
        HcmReferral.i18n.ERROR_OCCURRED,
        HcmReferral.i18n.PM_ERROR_MSG
      );
    }
  }

  function onPersonSelectedCallBack(component, response) {
    // Get the sub event status for the response object
    var subEventStatus = response.STATUS_DATA.SUBEVENTSTATUS.length > 0 ? $.trim(response.STATUS_DATA.SUBEVENTSTATUS[0].TARGETOBJECTNAME) : null;
    // removing the loading indicator
    $('#' + component.getSectionContentNode().id).find('.loading-screen').remove();

    if (response.STATUS_DATA.STATUS.toUpperCase() === 'S') {
      var cases = response.CASES;
      var personId = response.PERSON_ID;
      var hiPersonId = response.HI_PERSON_ID || '';
      var caseTypes = $.map(cases, function(kase, index) {
        return kase.CASE_TYPE_DISPLAY;
      });

      if (response.DEMOGRAPHICS) {
        component.patientInfo = JSON.parse(response.DEMOGRAPHICS);
      }

      if (personId === 0 || cases.length === 0) {
        HcmReferral.caseModals.newCase(component, personId, hiPersonId);
      }
      else {
        HcmReferral.caseModals.caseConfirmationModal(component, response.PERSON_FORMATTED_NAME, personId, caseTypes, hiPersonId);
      }
    }
    else {
      HcmReferral.caseModals.errorModal(
        component.componentSubId('MillenniumPerson'),
        HcmReferral.i18n.ERROR_OCCURRED,
        getErrorMsg(subEventStatus)
      );
    }
  }

  /**
  * This function acts as a call back for when Hi Person Search is activated.
  * @param {Object} component - component for which callBack is associated.
  * @returns {void}
  */
  function hiSearchCallBack(component) {
    var hiPersonSearch;

    hiPersonSearch = new MPageControls.HealtheIntentPersonSearch()
      .setTestUrl(component.personSearchTestUri)
      .setOnSelect(function(empiId) {
        HcmReferral.dataRequests.retrievePersonFromMillennium(component, empiId, onPersonSelectedCallBack);
      });

    if(component.getAddNewPersonInd() && component.getAddEditInd()) {
      hiPersonSearch.setOnAddPerson(function() {
        HcmReferral.callBacks.onAddPersonCallback(component, 'HealtheIntent_PersonSearch_' + hiPersonSearch.id);
      });
    }
    hiPersonSearch.show();
  }

  /**
  * This function acts as a callback function when only Millennium Person Search is activated.
  * @param {Object} component - component for which callBack is associated.
  * @returns {void}
  */
  function millSearchCallBack(component) {
    if(component.getAddNewPersonInd() && component.getAddEditInd()) {
      HcmReferral.callBacks.onAddPersonCallback(component, 'HealtheIntent_PersonSearch_' + component.getComponentId(), false);
    }
  }

  return {
    hiSearchCallBack: hiSearchCallBack,
    millSearchCallBack: millSearchCallBack,
    onAddPersonCallback: onAddPersonCallback,
    onPersonSelectedCallBack: onPersonSelectedCallBack
  };
})();
var HcmReferral = HcmReferral || {};

HcmReferral.caseModals = (function() {

  /*
  * This function creates error modal and shows it.
  *
  * @param {String} id - id of the error modal.
  * @param {String} header - Modal Header to be displayed.
  * @param {String} errorMsg - Error message to be displayed in modal body.
  * @param {String} details - Details section to be displayed in modal body.
  * @returns {void}
  */
  function errorModal(id, header, errorMsg, details) {
    function modalBody(errorMsg, details) {
      var detailsSection = '';
      if (details) {
        detailsSection = '<br>' +
          '<p><b>' + HcmReferral.i18n.DETAILS + '</b>' +
            '<br><span>' + details + '</span>' +
          '</p>';
      }

      return errorMsg + detailsSection;
    }

    var closeButton;
    var modal = MP_Util.generateModalDialogBody(id, 'error', ' ', modalBody(errorMsg, details));

    modal.setHeaderTitle(header);

    if (!modal.getFooterButton('closeButton')) {
      closeButton = new ModalButton('closeButton')
        .setText(HcmReferral.i18n.CLOSE)
        .setCloseOnClick(true);
      modal.addFooterButton(closeButton);
    }

    MP_ModalDialog.updateModalDialogObject(modal);
    MP_ModalDialog.showModalDialog(id);
  }

  function caseConfirmationModal(component, personName, personId, caseTypes, hiPersonId) {

    function footerButton(modal, id, text, onClickHandler) {
      var button = modal.getFooterButton(id);

      if(!button) {
        button = new ModalButton(id);
        button.setText(text);
        modal.addFooterButton(button);
      }

      if(onClickHandler) {
        modal.setFooterButtonOnClickFunction(id, onClickHandler);
      }
    }

    function caseList(caseTypes) {
      return $.map(caseTypes, function(caseType, _) {
        return '<li>' + caseType + '</li>';
      }).join('');
    }

    function body(personName, caseTypes) {
      return '<div class="' + component.namespace + '-case-confirmation">' +
          '<span>' +
            HcmReferral.i18n.CASE_CONFIRMATION.replace('{personName}', personName) +
          '</span>' +
          '<ul class="' + component.namespace +'-bulleted-list">' +
            caseList(caseTypes) +
          '</ul>' +
        '</div>';
    }

    var modalId = component.componentSubId('CaseConfirmation');
    var modal = MP_ModalDialog.retrieveModalDialogObject(modalId);

    modal = modal || new ModalDialog(modalId);
    modal.setHasGrayBackground(true);
    modal.setTopMarginPercentage(15);
    modal.setBottomMarginPercentage(15);
    modal.setLeftMarginPercentage(30);
    modal.setRightMarginPercentage(30);
    modal.setHeaderTitle(HcmReferral.i18n.CASE_ALREADY_EXISTS);
    modal.setBodyDataFunction(function(modal) { modal.setBodyHTML(body(personName, caseTypes)); });

    footerButton(modal, 'create_case_confirm', HcmReferral.i18n.CREATE_CASE, function() {
      //trigger the cap timer for case exists modal create case
      new CapabilityTimer('CAP:MPG CARE MANAGEMENT REFERRAL REACHED CASE ALREADY EXISTS MODAL', 'CREATE CASE').capture();

      MP_Util.LoadSpinner(component.getSectionContentNode().id, 1);
      newCase(component, personId, hiPersonId);
    });

    footerButton(modal, 'create_case_cancel', HcmReferral.i18n.CANCEL, function() {
      //trigger the cap timer for case exists modal cancel
      new CapabilityTimer('CAP:MPG CARE MANAGEMENT REFERRAL REACHED CASE ALREADY EXISTS MODAL', 'CANCEL').capture();
    });

    MP_ModalDialog.addModalDialogObject(modal);
    MP_ModalDialog.showModalDialog(modal.getId());

    //trigger the cap timer for case exists modal
    new CapabilityTimer('CAP:MPG CARE MANAGEMENT REFERRAL REACHED CASE ALREADY EXISTS MODAL').capture();

    return modal;
  }

  function newCase(component, personId, hiPersonId) {
    function footerButton(modal, id, text, isDithered, onClickHandler) {
      var button = modal.getFooterButton(id);

      if(!button) {
        button = new ModalButton(id);
        button.setText(text)
          .setIsDithered(isDithered);
        modal.addFooterButton(button);
      }

      if(onClickHandler) {
        modal.setFooterButtonOnClickFunction(id, onClickHandler);
      }
    }

    function selectTag(name, referralInformation) {
      function options(optionList) {
        var opt = optionList.slice(0);
        if(opt) {
          // Adds empty display as the first option
          opt.unshift({ CODE_VALUE: 0, DISPLAY: '' });
        }

        return $.map(opt, function(value){
          return '<option value="' + value.CODE_VALUE + '">' + value.DISPLAY + '</option>';
        }).join('');
      }

      $(document).on('change', '#' + name, function() {
        if ($('#case_type').val() > 0 && $('#referral_reason').val() > 0 && $('#referral_source').val() > 0) {
          $('#create_case_submit').prop('disabled', false);
        }
        else {
          $('#create_case_submit').prop('disabled', true);
        }
      });

      return '<select id="' + name + '" name="' + name + '">' +
          options(referralInformation) +
        '</select>';
    }

    function callNewCaseErrorModals(component, caseCreated) {
      $('#' + component.getSectionContentNode().id).find('.loading-screen').remove();
      var subEventStatus = caseCreated.STATUS_DATA.SUBEVENTSTATUS ? $.trim(caseCreated.STATUS_DATA.SUBEVENTSTATUS[0].TARGETOBJECTNAME) : null;
      if(subEventStatus === 'NO_CARE_MANAGEMENT_ORG' || subEventStatus === 'TOO_MANY_CARE_MGMT_ORGS') {
        HcmReferral.caseModals.errorModal(
          component.componentSubId('CreateCaseError'),
          HcmReferral.i18n.ERROR_OCCURRED,
          (subEventStatus === 'NO_CARE_MANAGEMENT_ORG') ? HcmReferral.i18n.CREATE_CASE_NO_ORG_ERROR : HcmReferral.i18n.CREATE_CASE_MULTIPLE_ORG_ERROR
        );
      }
      else if (caseCreated.ASSIGNMENT_STATUS === 'CARE_TEAM_ASSIGN_ERROR') {
        HcmReferral.caseModals.errorModal(
          component.componentSubId('CareTeamAssignError'),
          HcmReferral.i18n.FAILED_REQUEST,
          HcmReferral.i18n.REQUEST_FAILURE,
          HcmReferral.i18n.CARE_TEAM_ASSIGN_ERROR
        );
      }
      else if (subEventStatus === 'ERROR_GETTING_PERSON_ID' || subEventStatus === 'ERROR_GETTING_ALIAS' || subEventStatus === 'ERROR_GETTING_DEMOGRAPHICS') {
        HcmReferral.caseModals.errorModal(component.componentSubId('CreateCaseError'), HcmReferral.i18n.ERROR_OCCURRED, HcmReferral.i18n.CREATE_PERSON_ERROR_MSG);
      }
      else {
        HcmReferral.caseModals.errorModal(
          component.componentSubId('CreateCaseError'),
          HcmReferral.i18n.FAILED_REQUEST,
          HcmReferral.i18n.REQUEST_FAILURE,
          HcmReferral.i18n.CREATE_CASE_ERROR
        );
      }
    }

    function triggerNewCaseCapabilityTimers(component, personId) {
      //trigger the cap timer for manual case referred
      new CapabilityTimer('CAP:MPG CARE MANAGEMENT REFERRAL CASE MANUALLY REFERRED').capture();

      if (component.selectedCareManager) {
        //trigger the cap timer for manual case referred for selected care manager
        new CapabilityTimer(
          'CAP:MPG CARE MANAGEMENT REFERRAL CASE MANUALLY REFERRED',
          'REFERRAL WITH SELECTED CARE MANAGER'
        ).capture();
      }
      else {
        //trigger the cap timer for manual case referred for logged in care manager
        new CapabilityTimer(
          'CAP:MPG CARE MANAGEMENT REFERRAL CASE MANUALLY REFERRED',
          'REFERRAL WITH CURRENT CARE MANAGER'
        ).capture();
      }

      if (personId) {
        //trigger the cap timer for manual case referred from millennium
        new CapabilityTimer(
          'CAP:MPG CARE MANAGEMENT REFERRAL CASE MANUALLY REFERRED',
          'REFERRAL FROM MILLENNIUM'
        ).capture();
      }
      else {
        //trigger the cap timer for manual case referred from healthe intent
        new CapabilityTimer(
          'CAP:MPG CARE MANAGEMENT REFERRAL CASE MANUALLY REFERRED',
          'REFERRAL FROM HEALTHE INTENT'
        ).capture();
      }

      HcmReferral.dataRequests.retrieveRecentReferredPeople(component);
    }

    function body(component, referralInformation) {
      var caseTypeOptions = referralInformation.CASE_TYPES;
      var referralReasonOptions = referralInformation.REFERRAL_REASONS;
      var referralSourceOptions = referralInformation.REFERRAL_SOURCES;

      return HcmReferral.personDetails.getDemoBanner(component.patientInfo) + '<div class="hcm-case-form">' +
        '<span>' + HcmReferral.i18n.SELECT_CASE_DETAILS + '</span>' +
        '<form id="create_case" class="' + component.namespace + '-form-columned">' +
          '<label for="referral_source">' + HcmReferral.i18n.REFERRAL_SOURCE + '</label>' +
            selectTag('referral_source', referralSourceOptions) +
          '<label for="referral_reason">' + HcmReferral.i18n.REFERRAL_REASON + '</label>' +
            selectTag('referral_reason', referralReasonOptions) +
          '<label for="case_type">' + HcmReferral.i18n.CASE_TYPE + '</label>' +
            selectTag('case_type', caseTypeOptions) +
        '</form>' +
      '</div>';
    }

    function modal(component, personId, referralInformation, hiPersonId) {
      var modalId = component.componentSubId('NewCase');
      var modal = MP_ModalDialog.retrieveModalDialogObject(modalId) || new ModalDialog(modalId);

      modal.setTopMarginPercentage(15);
      modal.setBottomMarginPercentage(15);
      modal.setHasGrayBackground(true);
      modal.setLeftMarginPercentage(30);
      modal.setRightMarginPercentage(30);
      modal.setHeaderTitle(HcmReferral.i18n.ENTER_CASE_DETAILS);
      modal.setBodyDataFunction(function(modal) { modal.setBodyHTML(body(component, referralInformation)); });

      footerButton(modal, 'create_case_submit', HcmReferral.i18n.CREATE_CASE, true, function(event) {
        var formData = HcmReferral.utils.serializeFormToJson($('#create_case'));
        HcmReferral.dataRequests.createCase(component, personId, formData.case_type, formData.referral_reason, formData.referral_source, hiPersonId, function(caseCreated) {
          if (caseCreated.STATUS_DATA.STATUS.toUpperCase() !== 'S') {
            callNewCaseErrorModals(component, caseCreated);
          }
          else if (caseCreated.STATUS_DATA.STATUS.toUpperCase() === 'S') {
            triggerNewCaseCapabilityTimers(component, personId);
          }
        });
      });

      footerButton(modal, 'create_case_cancel', HcmReferral.i18n.CANCEL, false);
      // Removes the loading indicator when 'Cancel' button clicked.
      $('#' + component.getSectionContentNode().id).find('.loading-screen').remove();
      MP_ModalDialog.addModalDialogObject(modal);
      MP_ModalDialog.showModalDialog(modal.getId());

      return modal;
    }

    HcmReferral.utils.scriptRequest(component,
    {
      name: 'HCM_GET_REFERRAL_INFORMATION',
      params: [],
      success: function(referralInformation) { modal(component, personId, referralInformation, hiPersonId); }
    });

    // private api exposed for testing
    HcmReferral.caseModals.__newCase = {
      body: body,
      callNewCaseErrorModals: callNewCaseErrorModals,
      footerButton: footerButton,
      modal: modal,
      selectTag: selectTag,
      triggerNewCaseCapabilityTimers: triggerNewCaseCapabilityTimers
    };
  }

  return {
    caseConfirmationModal: caseConfirmationModal,
    errorModal: errorModal,
    newCase: newCase
  };
})();


var HcmReferral = HcmReferral || {};

HcmReferral.dataRequests = (function() {

  function retrieveRecentReferredPeople(component) {
    var careManagerId = component.selectedCareManager || component.criterion.getPersonnelInfo().getPersonnelId();

    $('#' + component.getSectionContentNode().id).find('.loading-screen').remove();

    HcmReferral.utils.scriptRequest(component, {
      name: 'HCM_GET_RECENT_REFERRED_PEOPLE',
      params: [ component.getCriterion().provider_id + '.0', careManagerId + '.0' ],
      success: function(response) {
        var tableHtml = HcmReferral.recentlyReferredTable(component, response.PERSONS)
          .html({ header: HcmReferral.i18n.RECENTLY_ASSIGNED_CASES });
        $('#' + component.namespace + 'Content' + component.getComponentId())
          .find('.' + component.namespace + '-recently-assigned-table').html(tableHtml);
      }
    });
  }

  function retrievePersonFromMillennium(component, hiPersonId, successCallBack) {
    MP_Util.LoadSpinner(component.getSectionContentNode().id, 1);
    HcmReferral.utils.scriptRequest(component, {
      name: 'HCM_GET_REF_PERSON_CASE_V2',
      params: [ '^' + hiPersonId + '^', '^' + component.personDemographicsUri() + '^' ],
      success: function(response) { successCallBack(component, response); }
    });
  }

  function createCase(component, personId, caseType, referralReason, referralSource, hiPersonId, successCallBack) {
    var careManagerId = component.selectedCareManager || component.criterion.getPersonnelInfo().getPersonnelId();

    MP_Util.LoadSpinner(component.getSectionContentNode().id, 1);

    HcmReferral.utils.scriptRequest(component, {
      name: 'HCM_REFERRAL_CREATE_CASE_V2',
      params: [
        caseType,
        referralReason,
        personId,
        careManagerId,
        '^' + hiPersonId + '^',
        '^' + component.personDemographicsUri() + '^',
        referralSource
      ],
      success: successCallBack
    });
  }

  return {
    createCase: createCase,
    retrievePersonFromMillennium: retrievePersonFromMillennium,
    retrieveRecentReferredPeople: retrieveRecentReferredPeople
  };
})();
var HcmReferral = HcmReferral || {};

HcmReferral.personDetails = (function() {

  function calculateAge(dateOfBirth) {
    var parsedAge = $.datepicker.parseDate('yy-mm-dd', dateOfBirth.split('T')[0]);
    return MP_Util.CalcAge(parsedAge);
  }

  // PMAction API: https://wiki.ucern.com/pages/viewpageattachments.action?pageId=26116576
  function conversation(action, taskNumber, cmOrganizationID, personId, isMillSearchEnabled) {
    var pmConvo;
    if(window.external.DiscernObjectFactory) {
      //PMCONVO is the DISPLAY_KEY for the C# based PMAction.dll and PMCONVOVB is the DISPLAY_KEY for the VB based PMAction.dll
      pmConvo = window.external.DiscernObjectFactory('PMCONVO') || window.external.DiscernObjectFactory('PMCONVOVB');
    }
    if (pmConvo) {
      pmConvo.action = action;
      pmConvo.Task = taskNumber; // PM Conversation
      if (personId) {
        pmConvo.Person_ID = personId;
      }
      if (cmOrganizationID) {
        pmConvo.Organization_ID = cmOrganizationID;
      }
      // The way this check is being implemented this way is because assigning false value to the SkipSearch does not work
      // It has to be assigned true or not assigned at all.
      if(isMillSearchEnabled !== false) {
        pmConvo.SkipSearch = true;
      }
      pmConvo.ConversationHidden = 0;
      pmConvo.Run();
    }
    return pmConvo;
  }

  // personId is optional. Only send it if you want to open edit person.
  function runConversation(taskNumber, cmOrganizationID, personId, isMillSearchEnabled) {
    var response = { failure: true };

    // Action 100 - Add Person
    var convResponse = conversation(100, taskNumber, cmOrganizationID, personId, isMillSearchEnabled);
    if (convResponse) {
      if (convResponse.CancelStatus) {
        response = { cancel: true };
      }
      else if (convResponse.ConversationStatus === 0) {
        response = { success: true, personId: convResponse.GetFieldValue('person.person_id') };
      }
    }
    return response;
  }

  function modifyPatientDetails(component, personId) {
    var pmConversationStatus;
    var calledConveration;

    if($.trim(component.getEditPmConversationTask()) !== '') {
      calledConveration = true;
      pmConversationStatus = HcmReferral.personDetails.runConversation(
        component.getEditPmConversationTask(),
        component.cmOrganizationID,
        personId
      );

      if (pmConversationStatus.success) {
        //trigger the cap timer for edit person
        new CapabilityTimer('CAP:MPG CARE MANAGEMENT REFERRAL EDIT PATIENT LINK USED').capture();

        HcmReferral.dataRequests.retrieveRecentReferredPeople(component);
      }
    }

    if (!calledConveration || pmConversationStatus.failure) {
      HcmReferral.caseModals.errorModal(
        component.getComponentId() + 'ConversationErrorModal',
        HcmReferral.i18n.ERROR_OCCURRED,
        HcmReferral.i18n.PM_ERROR_MSG
      );
    }
  }

  function getDemoBanner(patientInfo) {
    var demoBannerHtml = '';
    var patientAge = HcmReferral.i18n.NO_DATA;
    var dob = HcmReferral.i18n.NO_DATA;

    if (patientInfo) {
      // extractPersonDemoData sets age and date of birth of the form MM/DD/YYYY.
      if (patientInfo.age) {
        dob = patientInfo.date_of_birth;
        patientAge = patientInfo.age;
      }
      else if(patientInfo.date_of_birth) {
        dob = new Date();
        dob.setISO8601(patientInfo.date_of_birth);
        dob = dob.format(MPAGE_LOCALE.fulldate4yr, true);
        patientAge = calculateAge(patientInfo.date_of_birth);
      }

      demoBannerHtml = '<div class="hcmReferral-demo-banner-container">' +
        '<span>'+ (patientInfo.formatted_name || HcmReferral.i18n.NO_DATA) + '</span>' +
        '<ul class="hcmReferral-inline-list">' +
          '<li>' + patientAge + '</li>' +
          '<li>' + ((patientInfo.gender && patientInfo.gender.display) || HcmReferral.i18n.NO_DATA) + '</li>' +
          '<li>' + dob + '</li>' +
        '</ul>' +
      '</div>';
    }

    return demoBannerHtml;
  }

  function extractPersonDemoData(component, personData) {
    var patientAge = '';
    var birthDateDisplay = '';
    var birthDateTime = new Date();
    var codeArray = null;
    var patInfo = null;
    var localBirthDtTm = new Date();
    var localDeceasedDtTm = new Date();
    var absBirthDtTmRegExpMatch;
    var absBirthDtTmRegExp = '([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?';

    codeArray = MP_Util.LoadCodeListJSON(personData.CODES);
    patInfo = personData.DEMOGRAPHICS.PATIENT_INFO;
    //Determine the patient's age based on the absolute date stored in the DB or the calculated date and time
    if (patInfo.ABS_BIRTH_DT_TM !== '') {
      absBirthDtTmRegExpMatch = patInfo.ABS_BIRTH_DT_TM.match(new RegExp(absBirthDtTmRegExp));
      birthDateDisplay = new Date(
        absBirthDtTmRegExpMatch[1],
        absBirthDtTmRegExpMatch[3] - 1,
        absBirthDtTmRegExpMatch[5],
        absBirthDtTmRegExpMatch[7],
        absBirthDtTmRegExpMatch[8],
        absBirthDtTmRegExpMatch[10]
      ).format('shortDate2');
    }
    else if (patInfo.BIRTH_DT_TM !== '') {
      birthDateTime.setISO8601(patInfo.BIRTH_DT_TM)
      birthDateDisplay = birthDateTime.format('shortDate2');
    }

    //Calculate the correct age of the patient based on the local time of birth and death
    if (patInfo.LOCAL_DECEASED_DT_TM && patInfo.LOCAL_BIRTH_DT_TM) {
      localBirthDtTm.setISO8601(patInfo.LOCAL_BIRTH_DT_TM);
      localDeceasedDtTm.setISO8601(patInfo.LOCAL_DECEASED_DT_TM);
      patientAge = MP_Util.CalcAge(localBirthDtTm, localDeceasedDtTm);
    }
    else if (patInfo.LOCAL_BIRTH_DT_TM) {
      localBirthDtTm.setISO8601(patInfo.LOCAL_BIRTH_DT_TM);
      patientAge = MP_Util.CalcAge(localBirthDtTm);
    }

    component.patientInfo = {
      formatted_name: patInfo.PATIENT_NAME.NAME_FULL,
      age: patientAge,
      date_of_birth: birthDateDisplay,
      gender: MP_Util.GetValueFromArray(patInfo.SEX_CD, codeArray)
    };
  }

  return {
    getDemoBanner: getDemoBanner,
    modifyPatientDetails: modifyPatientDetails,
    runConversation: runConversation,
    extractPersonDemoData: extractPersonDemoData
  };
})();
var HcmReferral = HcmReferral || {};

HcmReferral.SearchButton = (function() {

  var id = 0;

  function newId() {
    return id++;
  }

  function Button(namespace, onClickCallback) {
    this._namespace = namespace;
    this._id = newId();
    this._onClickCallback = onClickCallback;
  }

  $.extend(Button.prototype, {
    attributeId: function() {
      return 'person_search_button' + this._id;
    },

    attributeClass: function() {
      return this._namespace + '_person_search';
    },

    enable: function() {
      $('#' + this.attributeId()).prop('disabled', false);
    },

    disable: function() {
      $('#' + this.attributeId()).prop('disabled', true);
    },

    render: function() {
      return '<button id="' + this.attributeId() + '" type="button" class="' + this.attributeClass() + '">' +
          HcmReferral.i18n.SEARCH_PERSON +
        '</button>';
    },

    finalize: function() {
      $(document).on('click', '#' + this.attributeId(), this._onClickCallback);
    }
  });

  /**
  * This method is used to create a search button based on the millenium search filter value. If the filter is set to true
  * it will create the button which would only trigger the Millenium person search. When set to false it will set the button to open
  * HI search.
  * @returns {object} search button object
  */
  function create(component) {
    var searchButton;

    if(component.getHiSearchInd()) {
      searchButton = new Button(component.namespace, function() {
        HcmReferral.callBacks.hiSearchCallBack(component);
      });
    }
    else {
      searchButton = new Button(component.namespace, function() {
        HcmReferral.callBacks.millSearchCallBack(component);
      });
    }
    return searchButton;
  }

  return {
    create: create
  };
})();


var HcmReferral = HcmReferral || {};

HcmReferral.utils = (function() {

  function handleRawResponse(reply, successHandler, failureHandler) {
    var proxyReply = JSON.parse(reply.getResponse()).PROXYREPLY;
    var status = proxyReply.HTTPREPLY.STATUS;

    if (proxyReply.TRANSACTIONSTATUS.SUCCESSIND === 1 && status === 200 && successHandler) {
      successHandler(JSON.parse(proxyReply.HTTPREPLY.BODY));
    }
    else if (proxyReply.TRANSACTIONSTATUS.PREREQERRORIND === 1 && failureHandler) {
      failureHandler(proxyReply);
    }
  }

  /**
  * Creates and performs a ComponentScriptRequest.
  * @param {Object} component - component for script request has to be performed.
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
  function scriptRequest(component, settings) {
    settings = settings || {};
    var loadTimer = settings.loadTimer || new RTMSTimer(component.getComponentLoadTimerName());
    var renderTimer = settings.renderTimer || new RTMSTimer(component.getComponentRenderTimerName());
    var scriptRequest = new ComponentScriptRequest();

    scriptRequest.setComponent(component);
    scriptRequest.setLoadTimer(loadTimer);
    scriptRequest.setRenderTimer(renderTimer);
    scriptRequest.setProgramName(settings.name);
    if(settings.params) {
      scriptRequest.setParameterArray([ '^MINE^' ].concat(settings.params));
    }

    if (settings.rawDataIndicator) {
      scriptRequest.setRawDataIndicator(settings.rawDataIndicator);
      scriptRequest.setResponseHandler(function(reply) {
        handleRawResponse(reply, settings.success, settings.failure);
      });
    }
    else {
      scriptRequest.setResponseHandler(function(reply) { settings.success(reply.getResponse()); });
    }

    scriptRequest.performRequest();
   }

  function serializeFormToJson($form) {
    var formElements = $form.serializeArray(); // [{name: 'a', value: '1'}, {name: 'b', value: '2'}]
    var formJsonObj = {};

    $.each(formElements, function(_, inputElement){
      formJsonObj[inputElement.name] = inputElement.value;
    });

    return formJsonObj; // {a: '1', b: '2'}
  }

  return {
    scriptRequest: scriptRequest,
    serializeFormToJson: serializeFormToJson
  };
})();

