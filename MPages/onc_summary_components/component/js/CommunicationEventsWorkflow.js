/* global BaseCommunicationEvents, CommunicationEventsValidator, CompSidePanel, TableCellClickCallbackExtension, ProviderSearchControl, CapabilityTimer*/

function CommunicationEventsWFStyle() {
  this.initByNamespace('wfHcmCommEvents');
}

CommunicationEventsWFStyle.prototype = new ComponentStyle();
CommunicationEventsWFStyle.prototype.constructor = ComponentStyle;

/**
 * Initialize the Communication Events Option 1 component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 * @returns {void}
 */
function CommunicationEventsWF(criterion) {
  //This is your component's constructor.
  this.setCriterion(criterion);
  this.setComponentLoadTimerName('USR:MPG.COMMUNICATION_EVENTS.O1.WF - load component');
  this.setComponentRenderTimerName('ENG:MPG.COMMUNICATION_EVENTS.O1.WF - render component');

  if (criterion.encntr_id) {
    this.setPlusAddCustomInd(true);
  }

  this.setIncludeLineNumber(true);
  this.setStyles(new CommunicationEventsWFStyle());
  this.TYPE_CODE_SET = 4003448;
  this.OUTCOME_CODE_SET = 4003449;
  this.ROLE_CODE_SET = 4003451;
  this.METHOD_CODE_SET = 4003498;
  this.ROLE_TYPE_CODE_SET = 4003458;
}

CommunicationEventsWF.prototype = new BaseCommunicationEvents();

CommunicationEventsWF.prototype.preProcessing = function() {
  var component = this;

  if (!component.getCriterion().encntr_id) {
    component.setPlusAddEnabled(false);
    component.setLookbackMenuItems([]);
  }
};

/**
 * This is a temporary fix that adds View All label to default lookback filter and will be removed once
 * http://jira2.cerner.corp/browse/DISCERNABU-6127(Result range api) is closed
 * @returns {void}
 */
CommunicationEventsWF.prototype.postProcessing = function(){
  var compNS = this.getStyles().getNameSpace();
  var componentId = this.getComponentId();

  if($('#lookbackContainer' + compNS + componentId).children().length) {
    $('#lookbackContainer' + compNS + componentId).children()[0].innerHTML = i18n.discernabu.communication_events_o1.VIEW_ALL;
  }
};


CommunicationEventsWF.prototype.personnelId = function() {
  return this.criterion.getPersonnelInfo().getPersonnelId();
};

/**
 * This method performs form submission to the CCL program with the corresponding parameters.
 * @param {string} cclProgram: CCL program string.
 * @param {object} cclParams: An array of parameters for the CCL program.
 * @returns {void}
 */
CommunicationEventsWF.prototype.submitForm = function(cclProgram, cclParams) {
  var component = this;
  var scriptRequest = new ComponentScriptRequest();

  scriptRequest.setProgramName(cclProgram);
  scriptRequest.setParameterArray(cclParams);
  scriptRequest.setComponent(this);
  scriptRequest.setResponseHandler(function() {
    component.retrieveComponentData();
  });

  scriptRequest.performRequest();
};

/**
 * This method builds the string parameter that is being passed to a CCL program.
 * All instances of a semicolon in the string are replaced with the encoding '|-_|'.  This due to a ; being recognized as the beginning of
 * a comment, which breaks the @length:string@ parameter.
 * @param {string} string: desired string to be passed to the CCL program.
 * @returns {string} '@<stringLength>:<string>@': string parameter with the @ delimiter to allow passing of special charaters to CCL program
 */
CommunicationEventsWF.prototype.stringParamBuilder = function(string) {
  function encodeSemicolons(stringToEncode) {
    return stringToEncode.replace(/;/g, '|-_|');
  }
  string = encodeSemicolons(string);
  return '@' + string.length + ':' + string + '@';
};

/**
 * This method extracts form data and calls the submitForm method with the CCL program string and parameters
 * to update an existing communication event.
 * @returns {void}
 */
CommunicationEventsWF.prototype.updateCommunicationEvent = function() {
  var component = this;
  var componentId = component.getComponentId();
  var $communicationForm = $('#' + componentId + '-edit-communication-form');
  var commType = ($communicationForm.find('input[name="typeRadio"]:checked').val() || '0') + '.0';
  var commId = $communicationForm.find('input[name="comm_id"]').val() + '.0';
  var contactedPersonNameParam = component.stringParamBuilder($communicationForm.find('input[name="contacted_person_name"]').val());
  var contactedPersonId = $communicationForm.find('input[name="contacted_person_id"]').length > 0 ? $communicationForm.find('input[name="contacted_person_id"]').val() + '.0' : '0.0';
  var personRole = $communicationForm.find('select[name="role"]').val() + '.0';
  var commOutcome = $communicationForm.find('select[name="outcome"]').val() + '.0';
  var commMethod = $communicationForm.find('select[name="method"]').val() + '.0';
  var commNotesParam = component.stringParamBuilder($communicationForm.find('textarea[name="notes"]').val());
  var durationInMin = '"' + $.trim($communicationForm.find('input[name="duration"]').val()) + '"';
  var commDate = $communicationForm.find('.date-input').val();
  var commTime = $communicationForm.find('.time-input').val();
  var commDtTmObj = new Date(commDate.concat(' ', commTime));
  var commDtTm = '"' + commDtTmObj.toISOString() + '"';
  var personnelId = component.personnelSearchControl.getSelectedProviderId() + '.0';
  var cclParams = [ '^MINE^', commId, commType, commMethod, personRole, durationInMin, commOutcome, commNotesParam, personnelId, contactedPersonNameParam, contactedPersonId, commDtTm ];

  component.submitForm('HCM_CHG_COMM_EVENT', cclParams);
  var capTimer = new CapabilityTimer('CAP:MPG COMMUNICATION EVENTS MODIFIED EVENT');
  capTimer.capture();
};

/**
 * This calls confirm Remove Modal.
 * @param {number} commId: id of the communication event.
 * @returns {void}
 */
CommunicationEventsWF.prototype.confirmDeleteCommunicationEvent = function(commId) {
  var component = this;
  var compNS = component.getStyles().getNameSpace();
  var modalId = 'RemoveCommunicationEvent' + this.getComponentId();
  var mDialog = new ModalDialog(modalId);
  var mBodyContent = '<span class="' + compNS + '-warning-icon">' + component.i18n.DELETE_MODAL_BODY + '</span>';
  mDialog.setHeaderTitle(component.i18n.DELETE_MODAL_HEADER)
        .setTopMarginPercentage(25)
        .setRightMarginPercentage(35)
        .setBottomMarginPercentage(30)
        .setLeftMarginPercentage(25)
        .setIsBodySizeFixed(false)
        .setHasGrayBackground(true)
        .setIsFooterAlwaysShown(true);

  mDialog.setBodyDataFunction(function(modalObj) {
    modalObj.setBodyHTML('<div class="' + compNS + '-communication-remove-modal"><p>' + mBodyContent + '</p></div>');
  });

  var removeButton = new ModalButton('Remove');
  removeButton.setText(component.i18n.REMOVE).setIsDithered(false).setOnClickFunction(function() {
    MP_Util.LoadSpinner('sidePanelContents' + component.getComponentId(), 1);
    component.deleteCommunicationEvent(commId);
    MP_ModalDialog.closeModalDialog(modalId);
  });
  mDialog.addFooterButton(removeButton);

  var cancelButton = new ModalButton('Cancel');
  cancelButton.setText(component.i18n.CANCEL).setIsDithered(false).setOnClickFunction(function() {
    MP_ModalDialog.closeModalDialog(modalId);
  });
  mDialog.addFooterButton(cancelButton);

  MP_ModalDialog.updateModalDialogObject(mDialog);
  MP_ModalDialog.showModalDialog(modalId);
};

/**
 * This deletes communication event.
 * @param {number} commId: id of the communication event.
 * @returns {void}
 */
CommunicationEventsWF.prototype.deleteCommunicationEvent = function(commId) {
  var component = this;
  var cclParams = [ '^MINE^', commId ];
  component.submitForm('HCM_DELETE_COMM_EVENTS', cclParams);
  var capTimer = new CapabilityTimer('CAP:MPG COMMUNICATION EVENTS REMOVED EVENT');
  capTimer.capture();
};

/**
 * This method adds a side panel for edit form to update the current event.
 * @param {object} currentRow: Object containing details for the current event row.
 * @returns {void}
 */
CommunicationEventsWF.prototype.renderSidePanelForEdit = function(currentRow) {
  var component = this;
  var componentId = component.getComponentId();
  var compNS = component.getStyles().getNameSpace();
  var panelId = componentId + '-side-panel-container';
  var actionButtonsHtml = '<input type="button" id="' + componentId + '-cancel-edit-communication-btn" class="sp-button2" value="' + component.i18n.CANCEL + '">' +
                          '<input type="button" id="' + componentId + '-save-communication-btn" class="sp-button2" value="' + component.i18n.SAVE + '">';

  // create cloned codesets to keep the original unaffected.
  component.clonedCodeSets = [];
  $.extend(true, component.clonedCodeSets, component.codeSets);

  // Get flags for inactive values.
  var codeValueFlags = {
    isCurrentMethodInactive: component.isCurrentCodeValueInactive(currentRow.METHOD_CD),
    isCurrentTypeInactive: component.isCurrentCodeValueInactive(currentRow.TYPE_CD),
    isCurrentRoleInactive: component.isCurrentCodeValueInactive(currentRow.PERSON_ROLE_CD),
    isCurrentOutcomeInactive: component.isCurrentCodeValueInactive(currentRow.OUTCOME_CD)
  };
  // Add currently selected inactive codesets to codeset array.
  component.buildInactiveCodeSets(codeValueFlags, currentRow);

   var contents = '<div id="' + componentId + '-edit-communication-form" class="' + compNS + '-communication-form">' +
                    '<div class="sp-content-section" id="sidePanelScrollContainer' + componentId + '">' +
                      '<span class="date-container">' +
                        '<label class="date-label required">' + component.i18n.DATE + '</label>' +
                        '<input type="text" class="date-input" />' +
                      '</span>' +
                      '<span class="time-container">' +
                        '<label class="time-label required">' + component.i18n.TIME + '</label>' +
                        '<input type="text" class="time-input" />' +
                        '<span class="wfHcmCommEvents-clock-icon"/>' +
                      '</span>' +
                      '<label for="duration">' + component.i18n.DURATION_IN_MIN + '</label><input type="text" name="duration" maxlength="3" value=' + currentRow.DURATION_IN_MIN + '>' +
                      '<label for="method" class="required">' + component.i18n.METHOD + '</label>' + component.buildSelect(component.METHOD_CODE_SET, 'method', currentRow.METHOD_CD) +
                      '<label for="type" class="required">' + component.i18n.TYPE + '</label>' +
                      '<span class="radio" name="type">' + component.buildTypeRadio(currentRow.TYPE_CD) + '</span>' +
                      '<label for="role" class="required">' + component.i18n.CONTACT_TYPE + '</label>' + component.buildSelect(component.ROLE_CODE_SET, 'role', currentRow.PERSON_ROLE_CD) +
                      '<input type="hidden" name="comm_id" value=' + currentRow.ID + '>' +
                      '<div id="contacted-field"/>' +
                      '<label for="outcome" class="required">' + component.i18n.OUTCOME + '</label>' + component.buildSelectForOutcomesEdit(currentRow.OUTCOME_CD, currentRow.TYPE_CD, currentRow.METHOD_CD) +
                      '<label for="notes">' + component.i18n.NOTES + '</label>' +
                      '<textarea rows="8" cols="35" maxLength="250" name="notes">' + currentRow.NOTES + '</textarea>' +
                      '<div class="created-by">' +
                        '<label for="created_by">' +
                          component.i18n.CREATED_BY_OTHER_COLON.replace('{full_name}', currentRow.CREATED_BY.FULL_NAME).replace('{date_time}', currentRow.CREATED_AT) +
                        '</label>' +
                      '</div>' +
                      '<div class="edited-by">' + component.buildEditedBy(currentRow) + '</div>' +
                    '</div>' +
                  '</div>';

  try {
    if (component.$sidePanelContainer && component.$sidePanelContainer.length) {
      component.sidePanelEdit = new CompSidePanel(componentId, panelId);
      component.sidePanelEdit.setExpandOption(component.sidePanelEdit.expandOption.EXPAND_DOWN);
      component.sidePanelEdit.renderPreBuiltSidePanel();
      component.sidePanelEdit.showCornerCloseButton();
      component.sidePanelEdit.setCornerCloseFunction(function() {
        component.sidePanelEdit.hidePanel();
        component.updateSelRowBgColor();
        component.stretchTable();
      });

      component.sidePanelEdit.setTitleText(component.i18n.EDIT_COMMUNICATION_HEADER);
      component.sidePanelEdit.setActionsAsHTML(actionButtonsHtml);
      component.sidePanelEdit.setContents(contents, 'sidePanelContents' + componentId);
      component.initializeDateSelector(currentRow.FORMATTED_DT_TM);
      component.initializeTimeSelector(currentRow.FORMATTED_DT_TM);
      component.personnelSearchControl = component.initializeContactedField();

      component.flexTypeByMethod(currentRow);
      component.flexNameByRoleType(currentRow);
      component.setClickHandlersForEdit(currentRow);
      component.editFormValidator = new CommunicationEventsValidator(componentId + '-edit-communication-form', component);
      component.resizeSidePanel();
    }
  }
  catch(err) {
    logger.logJSError(err, component, 'communication-events-o1.js', 'renderSidePanelForEdit');
  }
};

/**
 * This method returns the last modified by markup for current communication event.
 * @param {object} currentRow: Object containing details for the current event row.
 * @param {boolean} sidePanelForView: Boolean to indicate whether its view sidepanel or not.
 * @returns {string} editedBYMarkup: Markup for last modified by.
 */
CommunicationEventsWF.prototype.buildEditedBy = function(currentRow, sidePanelForView) {
  var component = this;
  var editedByMarkup = '';

  if (currentRow.EDITED_BY.FULL_NAME) {
    if (sidePanelForView) {
      editedByMarkup = '<span class="disabled">' + component.i18n.LAST_MODIFIED_BY + '</span>' +
                        '<span>' + currentRow.EDITED_BY.FULL_NAME + '<br>' + currentRow.EDITED_AT + '</span>';
    }
    else {
      editedByMarkup = '<label for="last-modified-by">' +
                          component.i18n.LAST_MODIFIED_BY_COLON.replace('{full_name}', currentRow.EDITED_BY.FULL_NAME).replace('{date_time}', currentRow.EDITED_AT) +
                        '</label>';
    }
  }

  return editedByMarkup;
};

/**
 * This method adds a side panel containing the communication event details to update the current event.
 * @param {object} currentRow: Object containing details for the current event row.
 * @returns {void}
 */
CommunicationEventsWF.prototype.renderSidePanelForView = function(currentRow) {
  var component = this;
  var componentId = component.getComponentId();
  var compNS = component.getStyles().getNameSpace();
  var panelId = componentId + '-side-panel-container';
  var actionButtonsHtml = '<input type="button" id="' + componentId + '-delete-communication-btn" class="sp-button2" value="' + component.i18n.REMOVE + '">' +
                          '<input type="button" id="' + componentId + '-modify-communication-btn" class="sp-button2" value="' + component.i18n.MODIFY + '">';

  var contents = '<div id="' + componentId + '-communication-event-details" class="' + compNS + '-communication-event-details">' +
                    '<div class="sp-content-section" id="sidePanelScrollContainer' + componentId + '">' +
                      '<div class="person-contacted">' +
                        '<span class="disabled">' + component.i18n.CONTACT_NAME + '</span>' +
                        '<span>' + currentRow.CONTACTED_PERSON_NAME_VIEW + ' ' + component.i18n.FORMATTED_DISPLAY.replace('{display_value}', currentRow.PERSON_ROLE_DISP) + '</span><br>' +
                      '</div>' +
                      '<div class="created-by">' +
                        '<span class="disabled">' + component.i18n.CREATED_BY_OTHER + '</span>' +
                        '<span>' + currentRow.CREATED_BY.FULL_NAME + '<br>' + currentRow.CREATED_AT + '</span>' +
                      '</div>' +
                      '<div class="outcome">' +
                        '<span class="disabled">' + component.i18n.OUTCOME + '</span>' +
                        '<span>' + currentRow.OUTCOME_DISP + '</span>' +
                      '</div>' +
                      '<div class="edited-by">' + component.buildEditedBy(currentRow, true) + '</div>' +
                      '<div class="notes">' +
                        '<span class="disabled">' + component.i18n.NOTES + '</span>' +
                        '<span>' + currentRow.NOTES_VIEW + '</span>' +
                      '</div>' +
                    '</div>' +
                  '</div>';

  var titleText = component.i18n.FORMATTED_METHOD_DISPLAY.replace('{title_text}', currentRow.METHOD_DISP);
  if (currentRow.TYPE_DISP) {
    titleText = titleText.replace('{type_value}', currentRow.TYPE_DISP_VIEW);
  }
  else {
    titleText = titleText.replace('({type_value})', '');
  }
  var subTitleText = component.i18n.FORMATTED_DISPLAY_TIME.replace('{date_value}', currentRow.FORMATTED_DT_TM);
  subTitleText = subTitleText.replace('{minute_value}', currentRow.DURATION_IN_MIN_VIEW);

  try {
    if (component.$sidePanelContainer && component.$sidePanelContainer.length) {
      component.sidePanelView = new CompSidePanel(componentId, panelId);
      component.sidePanelView.setExpandOption(component.sidePanelView.expandOption.EXPAND_DOWN);
      component.sidePanelView.renderPreBuiltSidePanel();
      component.sidePanelView.showCornerCloseButton();
      component.sidePanelView.setCornerCloseFunction(function() {
        component.sidePanelView.hidePanel();
        component.updateSelRowBgColor();
        component.stretchTable();
      });

      component.sidePanelView.setTitleText(titleText);
      component.sidePanelView.setSubtitleText(subTitleText);
      component.sidePanelView.setActionsAsHTML(actionButtonsHtml);
      component.sidePanelView.setContents(contents, 'sidePanelContents' + componentId);
      component.setClickHandlersForView(currentRow);
      if (currentRow.CREATED_BY.ID !== parseInt(component.personnelId(), 10) && component.hasModifyCommEventInd !== 1) {
        $('#' + componentId + '-modify-communication-btn').hide();
        $('#' + componentId + '-delete-communication-btn').hide();
      }
      component.resizeSidePanel();
    }
  }
  catch(err) {
    logger.logJSError(err, component, 'communication-events-o1.js', 'renderSidePanelForView');
  }
};

/**
 * This method adds on-click handlers in the sidepanel for viewing a communication event.
 * @param {object} currentRow: Object containing details for the current event row.
 * @returns {void}
 */
CommunicationEventsWF.prototype.setClickHandlersForView = function(currentRow) {
  var component = this;
  var componentId = component.getComponentId();
  $('#' + componentId + '-modify-communication-btn').click(function() {
    component.renderSidePanelForEdit(currentRow);
  });

  $('#' + componentId + '-delete-communication-btn').click(function() {
    component.confirmDeleteCommunicationEvent(currentRow.ID);
  });

};

/**
 * This method adds on-click handlers in the sidepanel for viewing a communication event.
 * @param {object} currentRow: Object containing details for the current event row.
 * @returns {void}
 */
CommunicationEventsWF.prototype.setClickHandlersForEdit = function(currentRow) {
  var component = this;
  var componentId = component.getComponentId();
  $('#' + componentId + '-save-communication-btn').click(function() {
    if (component.editFormValidator.isFormValid()) {
      MP_Util.LoadSpinner('sidePanelContents' + componentId, 1);
      component.updateCommunicationEvent();
      component.triggerPersonnelSearchTimer(currentRow.CONTACTED_PERSONNEL.ID, component.personnelSearchControl.getSelectedProviderId());
    }
  });

  $('#' + componentId + '-cancel-edit-communication-btn').click(function() {
    component.renderSidePanelForView(currentRow);
  });

  // Maxlength attribute does not work in IE prior to IE10.
  component.imposeMaxlengthOnNotes();
};

/**
 * This method maxlength on notes textarea. Maxlength attribute does not work in IE prior to IE10.
 * @returns {void}
 */
CommunicationEventsWF.prototype.imposeMaxlengthOnNotes = function() {
  var component = this;
  component.$sidePanelContainer.on('input keyup', 'textarea', function(e) {
    var maxlength = this.maxLength;
    if (maxlength > 0) {
      var notes = this.value;
      if (notes.length > maxlength) {
        // truncate excess text (in the case of a paste)
        $(this).val(notes.substring(0, maxlength));
        e.preventDefault();
      }
    }
  });
};

/**
 * This method will be called on each row selection to update the background color.
 * @param {object} selRowObj: Current selected row object.
 * @returns {void}
 */
CommunicationEventsWF.prototype.updateSelRowBgColor = function(selRowObj) {
  var prevRow = this.$tableView.find('.selected');

  // Remove the background color of previous selected row.
  if (prevRow.length > 0) {
    prevRow.removeClass('selected');
  }

  // Change the background color to indicate that its selected.
  if (selRowObj) {
    $(selRowObj).addClass('selected');
  }
};

/**
 * This method adds cellClickExtension for the component table.
 * @returns {void}
 */
CommunicationEventsWF.prototype.addCellClickExtension = function() {
  var component = this;
  var selectedRow = null;
  var cellClickExtension = new TableCellClickCallbackExtension();

  cellClickExtension.setCellClickCallback(function(event, data) {
    selectedRow = $(event.target).parents('#' + component.getSectionContentNode().id + ' dl.result-info');
    component.updateSelRowBgColor(selectedRow);

    if (component.sidePanelAdd) {
      component.sidePanelAdd.hidePanel();
    }
    component.shrinkTable();
    component.renderSidePanelForView(data.RESULT_DATA);
  });

  component.communicationTable.addExtension(cellClickExtension);
};

/**
 * This function adds inactive outcome code values to code set.
 *
 * @param {object} codeValueFlags: Object containing status flags for saved communication events.
 * @param {object} currentRow: Object containing the saved communication event.
 * @returns {void}
 */
CommunicationEventsWF.prototype.addInactiveOutcomeCodeValues = function(codeValueFlags, currentRow) {
  var parent;
  var component = this;
  var isOutcomeParentOnlyInactive = component.isOutcomeParentOnlyInactive(codeValueFlags, currentRow);

  if (codeValueFlags.isCurrentOutcomeInactive) {
    // If current outcome or one of it's parents (type/method) is inactive add them.
    parent = component.getParentForOutcome(currentRow, codeValueFlags.isCurrentTypeInactive,
      codeValueFlags.isCurrentMethodInactive,
      codeValueFlags.isCurrentOutcomeInactive);
    component.addInactiveCodeValue(component.getCodeSetArray(component.OUTCOME_CODE_SET), currentRow.OUTCOME_CD,
      currentRow.OUTCOME_DISP, parent);
  }
  else if (isOutcomeParentOnlyInactive) {
    // push current outcome's parents.
    parent = component.getParentForOutcome(currentRow, codeValueFlags.isCurrentTypeInactive,
      codeValueFlags.isCurrentMethodInactive,
      codeValueFlags.isCurrentOutcomeInactive);
    component.addCodeValueParent(component.getCodeSetArray(component.OUTCOME_CODE_SET), currentRow.OUTCOME_CD, parent);
  }
};

/**
 * Removes all code values except the currently selected. While modifying a communication event,
 * when currently selected type is inactive, this method makes sure that all other type code values
 * are removed except current.
 *
 * @param {Object} codeValueFlags: Object containing status flags for saved communication events.
 * @param {Object[]} codeSetArray: An Array of codesets with code values.
 * @param {Object} currentRow: Object containing the saved communication event.
 * @returns {void}
 */
CommunicationEventsWF.prototype.removeNonCurrentCodeValues = function(codeValueFlags, codeSetArray, currentRow) {
  if (codeValueFlags.isCurrentMethodInactive) {
    // Remove all children except currently selected if parent inactive
    for (var i = codeSetArray[0].CODE_VALUES.length - 1; i >= 0; i--) {
      if (codeSetArray[0].CODE_VALUES[i].CODE_VALUE !== currentRow.TYPE_CD) {
        codeSetArray[0].CODE_VALUES.splice(i, 1);
      }
    }
  }
};

/**
 * Adds code values for inactive types e.g. 'Inbound/Outbound' and its parents
 * to the cloned code sets array.
 *
 * @param {Object} currentRow: contains current row data.
 * @param {Object} codeValueFlags: contains flags to determine active/inactive code values.
 * @returns {void}
 */
CommunicationEventsWF.prototype.addInactiveTypeCodeValues = function(currentRow, codeValueFlags) {
  if (currentRow.TYPE_CD) {
    var component = this;
    var codeSetArray = component.getCodeSetArray(component.TYPE_CODE_SET);
    var isTypeParentOnlyInactive = !codeValueFlags.isCurrentTypeInactive &&
        codeValueFlags.isCurrentMethodInactive;

    // Declare parent for type.
    var parent = {
      'CODE_SET': component.METHOD_CODE_SET,
      'CODE_VALUE': currentRow.METHOD_CD,
      'CDF_MEANING': ''
    };

    if (codeValueFlags.isCurrentMethodInactive) {
      // Remove all children except the current one.
      component.removeNonCurrentCodeValues(codeValueFlags, codeSetArray, currentRow);
    }

    if (codeValueFlags.isCurrentTypeInactive) {
      component.addInactiveCodeValue(codeSetArray, currentRow.TYPE_CD, currentRow.TYPE_DISP, parent);
    }
    else if (isTypeParentOnlyInactive) {
      component.addCodeValueParent(codeSetArray, currentRow.TYPE_CD, parent);
    }
  }
};

/**
 *
 * @param {Object} codeValueFlags: contains flags to determine active/inactive code values
 * @param {Object} currentRow: contains current row data
 * @returns {boolean} if outcome's parent only is inactive or not
 */
CommunicationEventsWF.prototype.isOutcomeParentOnlyInactive = function(codeValueFlags, currentRow) {
  return !codeValueFlags.isCurrentOutcomeInactive &&
      (!currentRow.TYPE_CD && codeValueFlags.isCurrentMethodInactive) ||
      (currentRow.TYPE_CD && codeValueFlags.isCurrentTypeInactive);
};

/**
 * Triggers the personnel search timer if a personnel was added or updated.
 * @param {Number} oldPersonnelId: contains the old saved personnel Id
 * @param {Number} newPersonnelId: contains the newly selected personnel Id
 * @returns {void}
 */
CommunicationEventsWF.prototype.triggerPersonnelSearchTimer = function(oldPersonnelId, newPersonnelId) {
  if (oldPersonnelId > 0) {
    if (newPersonnelId > 0 && oldPersonnelId !== newPersonnelId) {   // If different personnel was selected
      var capTimer = new CapabilityTimer('CAP:MPG COMMUNICATION EVENTS SEARCHED FOR PERSONNEL');
      capTimer.capture();
    }
  }
  else if (newPersonnelId > 0) { // If a new personnel was selected
    var capTimer = new CapabilityTimer('CAP:MPG COMMUNICATION EVENTS SEARCHED FOR PERSONNEL');
    capTimer.capture();
  }
};

/***
 * Add inactive method code values to codesets.
 * @param {Object} codeValueFlags: contains flags to determine active/inactive code values
 * @param {Object} currentRow: contains current row data
  * @returns {void}
 */
CommunicationEventsWF.prototype.addInactiveMethodCodeValues = function(codeValueFlags, currentRow) {
  if (codeValueFlags.isCurrentMethodInactive) {
    var component = this;
    component.addInactiveCodeValue(component.getCodeSetArray(component.METHOD_CODE_SET),
        currentRow.METHOD_CD, currentRow.METHOD_DISP);
  }
};

/***
 * Adds inactive role code values to code sets.
 * @param {Object} codeValueFlags contains flags to determine active/inactive code values
 * @param {Object} currentRow contains current row data
 * @returns {void}
 */
CommunicationEventsWF.prototype.addInactiveRoleCodeValues = function(codeValueFlags, currentRow) {
  var component = this;
  var parent = {
    'CODE_SET': component.ROLE_TYPE_CODE_SET,
    'CODE_VALUE': currentRow.PERSON_ROLE_PARENT_CD,
    'CDF_MEANING': currentRow.PERSON_ROLE_PARENT_MEAN
  };
  if (codeValueFlags.isCurrentRoleInactive) {
    component.addInactiveCodeValue(component.getCodeSetArray(component.ROLE_CODE_SET),
        currentRow.PERSON_ROLE_CD, currentRow.PERSON_ROLE_DISP, parent);
  }
};

/**
 * This method adds inactive code values and/or its parents to the cloned code sets array.
 * If current saved data is inactive, this method makes sure that the selection still displays
 * while editing the communication event. It handles method, types, roles and outcomes displayed
 * on the modal.
 *
 * @param {object} codeValueFlags: Object containing status flags for saved communication events.
 * @param {object} currentRow: Object containing the saved communication event.
 * @returns {void}
 */
CommunicationEventsWF.prototype.buildInactiveCodeSets = function(codeValueFlags, currentRow) {
  var component = this;
  component.addInactiveMethodCodeValues(codeValueFlags, currentRow);
  component.addInactiveRoleCodeValues(codeValueFlags, currentRow);
  component.addInactiveTypeCodeValues(currentRow, codeValueFlags);
  component.addInactiveOutcomeCodeValues(codeValueFlags, currentRow);
};

/**
 * For a particular code set, this method pushes an object to the CODE_VALUES array.
 * This object represents the current selection which is inactive.
 * .
 * @param {Object[]} codeSetArray - An array indicating the code set.
 * @param {number} codeValue - A number indicating the codevalue.
 * @param {string} display - A string indicating the display.
 * @param {Object} parent - An object indicating the parent for the code value group.
 * @returns {void}
 */
CommunicationEventsWF.prototype.addInactiveCodeValue = function(codeSetArray, codeValue, display, parent) {
  parent = parent || {};
  codeSetArray[0].CODE_VALUES.push({ CODE_VALUE: codeValue, DISPLAY: display, PARENTS: [ parent ] });
};

/**
 * Adds parent to each code value object.
 *
 * @param {Object[]} codeSetArray - An array indicating the code set.
 * @param {number} codeValue - A number indicating the codevalue.
 * @param {Object} parentToAdd - An object indicating the parent for the code value group.
 * @returns {void}
 */
CommunicationEventsWF.prototype.addCodeValueParent = function(codeSetArray, codeValue, parentToAdd) {
  var parentAlreadyExists = false;
  $.each(codeSetArray[0].CODE_VALUES, function(_, codeVal) {
    // Add active parent for inactive current selection.
    if (codeVal.CODE_VALUE === codeValue) {
      $.each(codeVal.PARENTS, function(_, parent) {
        if (parent.CODE_VALUE === parentToAdd.CODE_VALUE) {
          parentAlreadyExists = true;
          return false;
        }
      });
      // Do not add the parent if it already exists to prevent duplication.
      if (!parentAlreadyExists) {
        codeVal.PARENTS.push(parentToAdd);
      }
    }
  });
};

/**
 * This method builds the html for select input fields utilized in the create communication event form.
 * @param {number} codeSetToMap: codeSet number that is required to generate the options for the select input field.
 * @param {string} name: Name of the select input field.
 * @param {number} currCodeValue: Code value of existing selection in edit form. This will be null in case of the add form.
 * @returns {string} select: Html for select input field.
 */
CommunicationEventsWF.prototype.buildSelect = function(codeSetToMap, name, currCodeValue) {
  var component = this;
  var codeSetArray = component.getCodeSetArray(codeSetToMap);
  var options = {
    prompt: ' ',
    cssClass: 'comm-event-required'
  };
  var idDisplayList = $.map(codeSetArray[0].CODE_VALUES, function(codeValue) {
    return { id: codeValue.CODE_VALUE, display: codeValue.DISPLAY };
  });
  if (currCodeValue) {
    options = {
      selected: currCodeValue
    };
  }
  var select = component.selectTag(name, idDisplayList, options, currCodeValue);

  return select;
};

/**
 * Based on presence of 'type' code value, it's status (active/inactive) and status of 'method' and 'outcome',
 * this method returns an object which forms the parents for the 'outcomes' code values.
 *
 * @param {object} currentRow: Object containing the saved communication event.
 * @param {string} isCurrentTypeInactive: A string indicating status of current Type.
 * @param {string} isCurrentMethodInactive: A string indicating status of current Method.
 * @param {string} isOutcomeInactive: A string indicating status of outcome.
 * @returns {Object} an object with data or an empty object.
 */
CommunicationEventsWF.prototype.getParentForOutcome = function(currentRow, isCurrentTypeInactive, isCurrentMethodInactive, isOutcomeInactive) {
  var component = this;
  // Type was saved e.g. 'Inbound' selected when method 'Phone call' is selected.
  if (currentRow.TYPE_CD && (isCurrentTypeInactive || isOutcomeInactive)) {
    return {
      CODE_SET: component.TYPE_CODE_SET,
      CODE_VALUE: currentRow.TYPE_CD,
      CDF_MEANING: currentRow.TYPE_DISP.toUpperCase()
    };
  }
  // Type was not saved e.g. method 'In Person' is selected and it does not have any types.
  else if (!currentRow.TYPE_CD && (isCurrentMethodInactive || isOutcomeInactive)) {
    return {
      CODE_SET: component.METHOD_CODE_SET,
      CODE_VALUE: currentRow.METHOD_CD,
      CDF_MEANING: ''
    };
  }
  else {
    return {};
  }
};

/**
 * This method is responsible for building the selected outcomes to display when the user attempts to modify an existing
 * communication event.
 * @param {number} currOutcomeCode: Number respresenting the currently selected outcome code.
 * @param {number} currTypeCode: Number respresenting the currently selected type code.
 * @param {number} currMethodCode: Number respresenting the currently selected method code.
 * @returns {string} outcomeSelectorHTML: Html for outcome select input field.
 */
CommunicationEventsWF.prototype.buildSelectForOutcomesEdit = function(currOutcomeCode, currTypeCode, currMethodCode) {
  var component = this;
  var codeSetArray = component.getCodeSetArray();
  currTypeCode = currTypeCode || currMethodCode;
  var outcomesToDisplay = component.buildOutcomesToDisplay(codeSetArray, currTypeCode);

  var idDisplayList = $.map(outcomesToDisplay, function(codeValue) { return { id: codeValue.CODE_VALUE, display: codeValue.DISPLAY }; });
  var options = {
    selected: currOutcomeCode
  };

  var outcomeSelectorHTML = component.selectTag('outcome', idDisplayList, options);

  return outcomeSelectorHTML;
};

/**
 * creates html string for select Tag.
 * @param {String} name - the name of the select tag
 * @param {(Object|Object[])} idDisplayList - {id:, display:} Object or array of Objects to create option
 *                              tags within the select tag. {id} is used as the value attribute and {display}
 *                              is used as the display name.
 * @param {Object} [options] - optional options for selectTag
 *        {String} [prompt] - first option in the select tag. This is used as the display text to explain
 *                    the purpose of the select tag.
 *        {String} [selected] - the id for the option that should be selected by default.
 *        {String} [cssClass] - the class to be added to the select tag.
 * @returns {string} selectTag: html string for select tag.
 */
CommunicationEventsWF.prototype.selectTag = function(name, idDisplayList, options) {
  var selectTag = '<select name="' + name + '">';
  idDisplayList = $.makeArray(idDisplayList);
  options = options || { prompt: null, selected: null, cssClass: null };

  if (options.cssClass) {
    selectTag = '<select name="' + name + '" class="' + options.cssClass + '">';
  }

  // adds prompt as the first option for select with no name (only display value)
  if (options.prompt) {
    idDisplayList.unshift({ id: '', display: options.prompt });
  }

  selectTag += $.map(idDisplayList, function(value){
    if (options.selected && options.selected === value.id) {
      return '<option value="' + value.id + '" selected>' + value.display + '</option>';
    }
    else{
      return '<option value="' + value.id + '">' + value.display + '</option>';
    }
  }).join('');

  selectTag += '</select>';

  return selectTag;
};

/**
 * This method is an event handler for the plus button for adding a new communication event.
 * @returns {void}
 */
CommunicationEventsWF.prototype.openTab = function() {
  var component = this;

  if (component.sidePanelView) {
      component.sidePanelView.hidePanel();
      component.updateSelRowBgColor();
    }

  component.shrinkTable();
  component.renderSidePanelForAdd();
};

/**
 * This method extracts form data and calls the submitForm method with the CCL program string and parameters
 * to create a new communication event.
 * @returns {void}
 */
CommunicationEventsWF.prototype.addCommunicationEvent = function() {
  var component = this;
  var componentId = component.getComponentId();
  var criterion = component.criterion;
  var $communicationForm = $('#' + componentId + '-add-communication-form');
  var commType = ($communicationForm.find('input[name="typeRadio"]:checked').val() || '0') + '.0';
  var contactedPersonNameParam = component.stringParamBuilder($communicationForm.find('input[name="contacted_person_name"]').val());
  var contactedPersonId = $communicationForm.find('input[name="contacted_person_id"]').length > 0 ? $communicationForm.find('input[name="contacted_person_id"]').val() + '.0' : '0.0';
  var commDate = $communicationForm.find('.date-input').val();
  var commTime = $communicationForm.find('.time-input').val();
  var commDtTmObj = new Date(commDate.concat(' ', commTime));
  var commDtTm = '"' + commDtTmObj.toISOString() + '"';
  var commMethod = $communicationForm.find('select[name="method"]').val() + '.0';
  var personRole = $communicationForm.find('select[name="role"]').val() + '.0';
  var commOutcome = $communicationForm.find('select[name="outcome"]').val() + '.0';
  var commNotesParam = component.stringParamBuilder($communicationForm.find('textarea[name="notes"]').val());
  var durationInMin = '"' + $.trim($communicationForm.find('input[name="duration"]').val()) + '"';
  var personnelId = component.personnelSearchControl.getSelectedProviderId() + '.0';
  if (component.personnelSearchControl.getSelectedProviderId() > 0) {
    var capTimer = new CapabilityTimer('CAP:MPG COMMUNICATION EVENTS SEARCHED FOR PERSONNEL');
    capTimer.capture();    
  }
  var cclParams = [ '^MINE^', criterion.person_id, criterion.encntr_id, commType, commMethod, personRole, durationInMin,
                    commOutcome, commNotesParam, contactedPersonNameParam, contactedPersonId, commDtTm, personnelId ];

  component.submitForm('HCM_ADD_COMM_EVENT', cclParams);
  var capTimer = new CapabilityTimer('CAP:MPG COMMUNICATION EVENTS ADDED EVENT');
  capTimer.capture();    
};

/**
 * This method adds a side panel containing the form to create a new communication event.
 * @param {object} codeSets: An array of objects containing codeSets and codeValues returned from the HCM_GET_COMM_EVENTS ccl script.
 * @returns {void}
 */
CommunicationEventsWF.prototype.renderSidePanelForAdd = function() {
  var component = this;
  var componentId = component.getComponentId();
  var compNS = component.getStyles().getNameSpace();
  var panelId = componentId + '-side-panel-container';

  // reset cloned codesets to keep the original unaffected.
  component.clonedCodeSets = null;

  var actionButtonsHtml = '<input type="button" id="' + componentId + '-cancel-add-communication-btn" class="sp-button2" value="' + component.i18n.CANCEL + '">' +
                          '<input type="button" id="' + componentId + '-add-communication-btn" class="sp-button2" value="' + component.i18n.SAVE + '">';

  var addForm = '<div id="' + componentId + '-add-communication-form" class="' + compNS + '-communication-form">' +
                  '<div class="sp-content-section" id="sidePanelScrollContainer' + componentId + '">' +
                    '<span class="date-container">' +
                      '<label class="date-label required">' + component.i18n.DATE + '</label>' +
                      '<input type="text" class="date-input" />' +
                    '</span>' +
                    '<span class="time-container">' +
                      '<label class="time-label required">' + component.i18n.TIME + '</label>' +
                      '<input type="text" class="time-input" />' +
                      '<span class="wfHcmCommEvents-clock-icon"/>' +
                    '</span>' +
                    '<label for="duration">' + component.i18n.DURATION_IN_MIN + '</label><input type="text" name="duration" maxlength="3">' +
                    '<label for="method" class="required">' + component.i18n.METHOD + '</label>' + component.buildSelect(component.METHOD_CODE_SET, 'method') +
                    '<label for="type" class="required">' + component.i18n.TYPE + '</label>' +
                    '<span class="radio" name="type">' + component.buildTypeRadio() + '</span>' +
                    '<label for="role" class="required">' + component.i18n.CONTACT_TYPE + '</label>' + component.buildSelect(component.ROLE_CODE_SET, 'role') +
                    '<div id="contacted-field"/>' +
                    '<label for="outcome" class="required">' + component.i18n.OUTCOME + '</label>' + '<select name="outcome" class="comm-event-required"></select>' +
                    '<label for="notes">' + component.i18n.NOTES + '</label>' +
                    '<textarea rows="8" cols="35" maxLength="250" name="notes"></textarea>' +
                  '</div>' +
                '</div>';

  try {
    if (component.$sidePanelContainer && component.$sidePanelContainer.length) {
      component.sidePanelAdd = new CompSidePanel(componentId, panelId);

      component.sidePanelAdd.setExpandOption(component.sidePanelAdd.expandOption.EXPAND_DOWN);
      component.sidePanelAdd.renderPreBuiltSidePanel();
      component.sidePanelAdd.showCornerCloseButton();

      component.sidePanelAdd.setCornerCloseFunction(function() {
        component.sidePanelAdd.hidePanel();
        component.stretchTable();
      });

      component.sidePanelAdd.setTitleText(component.i18n.ADD_COMMUNICATION_HEADER);
      component.sidePanelAdd.setActionsAsHTML(actionButtonsHtml);

      component.sidePanelAdd.setContents(addForm, 'sidePanelContents' + componentId);
      component.initializeDateSelector();
      component.initializeTimeSelector();

      component.personnelSearchControl = component.initializeContactedField();
      component.flexTypeByMethod();
      component.flexNameByRoleType();
      component.addFormValidator = new CommunicationEventsValidator(componentId + '-add-communication-form', component);
      component.setClickHandlersForAdd();
      component.resizeSidePanel();
    }
  }
  catch(err) {
    logger.logJSError(err, component, 'communication-events-o1.js', 'renderSidePanelForAdd');
  }
};

/**
 * This method initializes the jQuery datepicker with defined options.
 * @param {string} dateTime: date of the communication event.
 * @returns {void}
 */
CommunicationEventsWF.prototype.initializeDateSelector = function(dateTime) {
  var component = this,
      $datePicker = component.$sidePanelContainer.find('.date-container .date-input');
  var datepickerOptions = {
    dateFormat: this.i18n.DATE_PICKER_FORMAT,
    showOn: 'both',
    buttonImage: CERN_static_content + '/images/4974.png',
    buttonImageOnly: true,
    changeMonth: true,
    changeYear: true
  };

  $datePicker.datepicker(datepickerOptions);
  if (dateTime) {
    $datePicker.datepicker('setDate', new Date(dateTime));
  }
  else {
    $datePicker.datepicker('setDate', new Date());
  }
};

/**
 * This method initializes the jQuery timepicker with defined options.
 * @param {string} dateTime: date of the communication event.
 * @returns {void}
 */
CommunicationEventsWF.prototype.initializeTimeSelector = function(dateTime) {
  var component = this,
      $timePicker = component.$sidePanelContainer.find('.time-container .time-input'),
      timepickerOptions = {
    timeFormat: this.i18n.TIME_FORMAT,
    step: 15
  };

  $timePicker.timepicker(timepickerOptions);
  if (dateTime) {
    $timePicker.timepicker('setTime', new Date(dateTime));
  }
  else {
    $timePicker.timepicker('setTime', new Date());
  }

  component.$sidePanelContainer.find('.wfHcmCommEvents-clock-icon').click(function() {
    $timePicker.timepicker('show');
  });
};

/**
 * This method adds on-click handlers in the sidepanel for adding a communication event.
 * @returns {void}
 */
CommunicationEventsWF.prototype.setClickHandlersForAdd = function() {
  var component = this;
  var componentId = component.getComponentId();

  $('#' + componentId + '-add-communication-btn').click(function() {
    if (component.addFormValidator.isFormValid()) {
      MP_Util.LoadSpinner('sidePanelContents' + component.getComponentId(), 1);
      component.addCommunicationEvent();
    }
  });

  $('#' + componentId + '-cancel-add-communication-btn').click(function() {
    component.sidePanelAdd.hidePanel();
    component.stretchTable();
  });

  // Maxlength attribute does not work in IE prior to IE10.
  component.imposeMaxlengthOnNotes();
};

/**
 * This function finds value in the array based on the predicate function
 *
 * @param {Array} array - Any array
 * @param {Function} predicateFunction - Function which returns true or false based on the array values
 *
 * @returns {Object} returns the value found if the predicate function returns true.
*/
CommunicationEventsWF.prototype.findValue = function(array, predicateFunction) {
  var valueToReturn;
  var index = 0;

  for(index = 0; index < array.length; index++) {

    if (predicateFunction(array[index], index)) {
      valueToReturn = array[index];
      break;
    }
  }

  return valueToReturn;
};

/**
 * This method sets the default values in the contacted field for the edit communication form.
 * @param {object} currentRow: Object containing details for the current event row.
 * @returns {void}
 */
CommunicationEventsWF.prototype.setDefaultContactedField = function(currentRow) {
  var component = this;
  var parentCodeValues = component.getParentDetails(currentRow.PERSON_ROLE_CD);

  var selectedParentCodeValue = component.findValue(parentCodeValues, function(parentCodeValue) {
    return parentCodeValue.CODE_SET === component.ROLE_TYPE_CODE_SET;
  });

  if (selectedParentCodeValue) {
    switch (selectedParentCodeValue.CDF_MEANING) {
      case 'PERSONNEL':
        component.renderPersonnelSearchMarkup(currentRow);
        break;
      case 'PTADVOCATE':
        component.renderPatientAdvocateFieldMarkup(currentRow);
        break;
      case 'PATIENT':
        component.renderPatientFieldMarkup();
        break;
      default:
        break;
    }
  }

  component.resizeSidePanel();
};

/**
 * This method is responsible for flexing the outcome field based on the method and type selection made by the user.
 * @param {object} currentRow: Object containing details for the current event row.
 * @returns {void}
 */
CommunicationEventsWF.prototype.flexTypeByMethod = function(currentRow) {
  var component = this;

  if (typeof currentRow === 'undefined') {
    // Current row is undefined hide outcome selection and radio buttons
    component.$sidePanelContainer.find('span.radio, label[for="type"]').hide();
    component.$sidePanelContainer.find('label[for="outcome"], select[name="outcome"]').hide();
  }
  else if (!currentRow.TYPE_CD) {
      component.$sidePanelContainer.find('span.radio, label[for="type"]').hide();
  }
  // On method type change hide existing outcomes and clear radio buttons.
  component.$sidePanelContainer.find('select[name="method"]').change(function() {
    component.$sidePanelContainer.find('input[name="typeRadio"]').prop('checked', false);
    component.$sidePanelContainer.find('#outcome').remove();
    component.$sidePanelContainer.find('#type').remove();

    component.determineSelectedMethod();
  });

  component.$sidePanelContainer.find('input[name=typeRadio]:radio').change(function() {
    // convert the html value to number because the code values returned from the ccl script are all
    // numbers which will be used to build flexed outcome.
    var selectedTypeCode = Number(component.$sidePanelContainer.find('input[type=radio]:checked').val());
    component.buildFlexedOutcomes(selectedTypeCode);
  });
};

/**
 * This method is responsible for determining which method code value was selected.
 * @returns {void}
 */
CommunicationEventsWF.prototype.determineSelectedMethod = function() {
  var component = this;
  var selectedMethodCode = component.$sidePanelContainer.find('select[name="method"]').val();

  if (selectedMethodCode === '') {
    component.$sidePanelContainer.find('span.radio, label[for="type"]').hide();
    component.$sidePanelContainer.find('label[for="outcome"], select[name="outcome"]').hide();
    return;
  }

  // convert the html value to number because the code values returned from the ccl script are all
  // numbers which will be used to build flexed outcome.
  component.selectViewFromMethod(Number(selectedMethodCode));
};

/**
 * This method is responsible for displaying the type or outcome fields based off of the method selection.
 * @param {number} selectedMethodCode: The currently selected method or outcome code.
 * @returns {void}
 */
CommunicationEventsWF.prototype.selectViewFromMethod = function(selectedMethodCode) {
  var component = this;
  var typeCodeSet = component.getCodeSetArray(component.TYPE_CODE_SET);
  var parentCodeValues = component.getParentDetails(typeCodeSet[0].CODE_VALUES[0].CODE_VALUE);

  var showType = component.findValue(parentCodeValues, function(parentCodeValue) {
    return parentCodeValue.CODE_VALUE === selectedMethodCode;
  }) !== undefined;

  if (showType) {
    // Show the type
    component.$sidePanelContainer.find('span.radio, label[for="type"]').show();
    component.$sidePanelContainer.find('label[for="outcome"], select[name="outcome"]').hide();
  }
  else {
    // go to outcomes
    component.$sidePanelContainer.find('span.radio, label[for="type"]').hide();
    component.buildFlexedOutcomes(selectedMethodCode);
  }
};

/**
 * This method is responsible for building the outcomes that will be displayed depending upon the type
 * or method code selections.
 * @param {number} selectedCode: The currently selected method or outcome code.
 * @returns {void}
 */
CommunicationEventsWF.prototype.buildFlexedOutcomes = function(selectedCode) {
  var component = this;
  var codeSetArray = component.getCodeSetArray();
  var outcomesToDisplay = component.buildOutcomesToDisplay(codeSetArray, selectedCode);

  var $outcomeSelecter = component.$sidePanelContainer.find('select[name="outcome"]');
  var outcomes = '<option value=""></option>';

  $.each(outcomesToDisplay, function(_, value) {
    outcomes += '<option value="' + value.CODE_VALUE + '">' + value.DISPLAY + '</option>';
  });

  $outcomeSelecter.empty().append(outcomes);
  component.$sidePanelContainer.find('label[for="outcome"], select[name="outcome"]').show();

  component.resizeSidePanel();
};

/**
 * This method is responsible for building the radio buttons for the type selection.
 * @param {number} currentTypeCode: Number respresenting the currently selected type code
 * @returns {string} radioHTML: Html for type radio buttons.
 */
CommunicationEventsWF.prototype.buildTypeRadio = function(currentTypeCode) {
  var component = this;
  var radioHTML = '';
  var codeSetArray = component.getCodeSetArray(component.TYPE_CODE_SET);

  $.each(codeSetArray[0].CODE_VALUES, function(_, value) {
    if (currentTypeCode === value.CODE_VALUE) {
      radioHTML += '<input type="radio" value = "' + value.CODE_VALUE + '" name="typeRadio" checked="checked"/> <label for="' + value.DISPLAY + '">' + value.DISPLAY + '</label>';
    }
    else {
      radioHTML += '<input type="radio" value = "' + value.CODE_VALUE + '" name="typeRadio"/> <label for="' + value.DISPLAY + '">' + value.DISPLAY + '</label>';
    }
  });

  return radioHTML;
};

/**
 * Compares if the current code value present in the code sets array returned by the script.
 * The script does not return inactive code values. This method is useful in determining if
 * the code values in the saved communication event are inactive by comparing with the values
 * returned by the script.
 *
 * @param {number} currCodeValue: A number indicating the code value.
 * @returns {Boolean} true if code value active and false if code value inactive
 */
CommunicationEventsWF.prototype.isCurrentCodeValueInactive = function(currCodeValue) {
  var component = this;
  var codeValueInactive = true;

  // Check if the saved code value present in returned code values
  $.each(component.clonedCodeSets, function(index1, codeSet) {
    $.each(codeSet.CODE_VALUES, function(index2, codeVal) {
      if (codeVal.CODE_VALUE === currCodeValue) {
        codeValueInactive = false;
      }
    });
  });

  return codeValueInactive;
};

/**
 * This method is responsible for getting the code set array that contains all the code values of
 * the selected code set.
 * @param {number} codeSetToMap: Number representing the current code set.
 * @returns {array} codeSetArray: Array containing code values of selected code set.
 */
CommunicationEventsWF.prototype.getCodeSetArray = function(codeSetToMap) {
  var component = this;
  var codeSetArray = null;
  var codeSets = component.clonedCodeSets || component.codeSets;
  codeSetToMap = codeSetToMap || component.OUTCOME_CODE_SET;
  codeSetArray = $.grep(codeSets, function(codeSet) {
    return codeSet.CODE_SET === codeSetToMap;
  });

  return codeSetArray;
};

/**
 * This method is responsible for building the code value group array that contains all the outcome code values
 * to be displayed in the select.
 * @param {number} codeSetArray: array containing the outcome code values.
 * @param {number} typeCode: Number representing parent code value of outcomes to display.
 * @returns {array} outcomesToDisplay: Array containing outcome code values to display.
 */
CommunicationEventsWF.prototype.buildOutcomesToDisplay = function(codeSetArray, typeCode) {
  var component = this;
  var outcomesToDisplay = [];
  $.each(codeSetArray[0].CODE_VALUES, function(index1, value) {
    var parentCodeValues = component.getParentDetails(value.CODE_VALUE);

    $.each(parentCodeValues, function(index2, parentValue) {
      if (parentValue.CODE_VALUE === typeCode) {
        outcomesToDisplay.push(value);
      }
    });
  });
  return outcomesToDisplay;
};

/**
 * This method is responsible for flexing the contact name field based on the Role selection made by the user.
 * @param {object} currentRow: Object containing details for the current event row.
 * @returns {void}
 */
CommunicationEventsWF.prototype.flexNameByRoleType = function(currentRow) {
  var component = this;

  if (currentRow) {
    component.setDefaultContactedField(currentRow);
  }

  component.$sidePanelContainer.find('select[name="role"]').change(function() {
    // Hide the personnel search elements as it may not a personnel search selection.
    component.$sidePanelContainer.find('#contacted_person, #personnel-not-found, #personnel-name-details').hide();
    component.personnelSearchControl.setSelectedProvider(0, '');
    var parentCodeValues = component.getParentDetails(parseInt(this.value, 10));

    var selectedParentCodeValue = component.findValue(parentCodeValues, function(parentCodeValue) {
      return parentCodeValue.CODE_SET === component.ROLE_TYPE_CODE_SET;
    });

    // compare with the codeset for Communication Role Type
    if(selectedParentCodeValue) {
      switch(selectedParentCodeValue.CDF_MEANING) {
        case 'PERSONNEL':
          component.renderPersonnelSearchMarkup();
          break;
        case 'PTADVOCATE':
          component.renderPatientAdvocateFieldMarkup();
          break;
        case 'PATIENT':
          component.renderPatientFieldMarkup();
          break;
        default:
          break;
      }
    }
    component.resizeSidePanel();
  });
};

/**
 * This method creates and appends the contacted field markup to both (add and edit) communication event forms.
 * @returns {object} personnelSearchControl: A ProviderSearchControl object.
 */
CommunicationEventsWF.prototype.initializeContactedField = function() {
  var component = this;
  var contactedHTML = $('<div id="personnel-name-details">' +
                          '<label>' + component.i18n.PERSONNEL_SEARCH + '</label>' +
                          '<input type="text" class="searchText" name="personnel_search" id="personnel-search"><br>' +
                        '</div>' +
                        '<div id="personnel-not-found">' +
                          '<input type="checkbox" name="personnel_not_found">' + component.i18n.PERSONNEL_NOT_FOUND +
                        '</div>' +
                        '<div id="contacted_person">' +
                          '<label>' + component.i18n.CONTACT_NAME + '</label>' +
                          '<input type="text" maxlength="75" name="contacted_person_name">' +
                        '</div>');

  component.$sidePanelContainer.find('#contacted-field').append(contactedHTML);

  var personnelSearchControl = new ProviderSearchControl(component.$sidePanelContainer.find('#personnel-search').get(0));
  // Hide the personnel search elements to only show when personnel search is selected from contact role
  component.$sidePanelContainer.find('#contacted_person, #personnel-not-found, #personnel-name-details').hide();

  return personnelSearchControl;
};

/**
 * This method displays the markup for personnel search when the Role type is PERSONNEL.
 * @param {object} currentRow: Object containing details for the current event row.
 * @returns {void}
 */
CommunicationEventsWF.prototype.renderPersonnelSearchMarkup = function(currentRow) {
  var component = this;
  var personnelDetails = component.$sidePanelContainer.find('#personnel-name-details');
  var personnelNotFound = component.$sidePanelContainer.find('#personnel-not-found');
  var personnelNotFoundInput = component.$sidePanelContainer.find('input:checkbox[name="personnel_not_found"]');
  var contactedPersonNameInput = component.$sidePanelContainer.find('input[name="contacted_person_name"]');
  var contactedPersonId = component.$sidePanelContainer.find('input[name="contacted_person_id"]');
  var personnelSearchInput = component.$sidePanelContainer.find('input[name="personnel_search"]');

  personnelDetails.show();
  personnelNotFound.show();

  personnelSearchInput.prop('disabled', false);
  personnelNotFoundInput.prop('checked', false);

  contactedPersonNameInput.val('').prop('disabled', false);
  contactedPersonId.remove();

  if (currentRow) {
    if (currentRow.CONTACTED_PERSONNEL.ID === 0.0) {
      if (currentRow.CONTACTED_PERSON_NAME) {
        personnelSearchInput.prop('disabled', true);
        personnelNotFoundInput.prop('checked', true);
        contactedPersonNameInput.val(currentRow.CONTACTED_PERSON_NAME);
        component.toggleContactName();
      }
    }
    else {
      component.personnelSearchControl.setSelectedProvider(currentRow.CONTACTED_PERSONNEL.ID, currentRow.CONTACTED_PERSONNEL.FULL_NAME);
    }
  }

  personnelNotFoundInput.click(function() {
    component.togglePersonnelSearch(personnelNotFoundInput.is(':checked'));
    component.resizeSidePanel();
  });
};


/**
 * This method displays the markup for patient advocate name when the Role type is PTADVOCATE.
 * @param {object} currentRow: Object containing details for the current event row.
 * @returns {void}
 */
CommunicationEventsWF.prototype.renderPatientAdvocateFieldMarkup = function(currentRow) {
  var component = this;

  component.$sidePanelContainer.find('#contacted_person').show();
  component.$sidePanelContainer.find('input[name="contacted_person_name"]').val('').prop('disabled', false);
  component.$sidePanelContainer.find('input[name="contacted_person_id"]').remove();

  if (currentRow) {
    component.$sidePanelContainer.find('input[name="contacted_person_name"]').val(currentRow.CONTACTED_PERSON_NAME);
  }
};

/**
 * This method displays the markup for patient field (defaulted to patient name in context)
 * when the Role type is PATIENT.
 * @returns {void}
 */
CommunicationEventsWF.prototype.renderPatientFieldMarkup = function() {
  var component = this;
  var personIdHTML = $('<input type="hidden" name="contacted_person_id" value="' + component.criterion.person_id + '"></div>');

  component.$sidePanelContainer.find('#contacted_person').show();
  component.$sidePanelContainer.find('input[name="contacted_person_name"]').val(component.criterion.getPatientInfo().getName()).prop('disabled', true);
  component.$sidePanelContainer.find('#contacted_person').append(personIdHTML);
};

/**
 * This method returns a hash containing the parent codeset, parent code value, and cdf meaning for a given codevalue.
 * @param {string} codeValue: Code value for which parent details are to be retrieved.
 * @returns {object}: A hash containing parent codeset and parent cdf meaning.
 */
CommunicationEventsWF.prototype.getParentDetails = function(codeValue) {
  var parentCodeValues = [];
  var component = this;
  var codeSets = component.clonedCodeSets || component.codeSets;
  $(codeSets).each(function(index1, codeSet) {
    $(codeSet.CODE_VALUES).each(function(index2, currentCodeValue) {
      if (currentCodeValue.CODE_VALUE === codeValue) {
        for (var i = 0; i < currentCodeValue.PARENTS.length; i++) {
          parentCodeValues.push(
              {
                CDF_MEANING: currentCodeValue.PARENTS[i].CDF_MEANING,
                CODE_VALUE: currentCodeValue.PARENTS[i].CODE_VALUE,
                CODE_SET: currentCodeValue.PARENTS[i].CODE_SET
              }
          );
        }
      }
    });
  });

  return parentCodeValues;
};

/**
 * This method toggles the personnel search when checkbox for 'personnel_not_found' id checked
 * @param {boolean} personnelNotFound: Boolean to indicate personnel not found.
 * @returns {void}
 */
CommunicationEventsWF.prototype.togglePersonnelSearch = function(personnelNotFound) {
  var component = this;

  if (personnelNotFound) {
    var capTimer = new CapabilityTimer('CAP:MPG COMMUNICATION EVENTS CHECKED PERSONNEL NOT FOUND');
    capTimer.capture();
    component.$sidePanelContainer.find('input[name="personnel_search"]').prop('disabled', true);
    component.personnelSearchControl.setSelectedProvider(0, '');
    component.$sidePanelContainer.find('#contacted_person').show();
  }
  else {
    component.$sidePanelContainer.find('input[name="personnel_search"]').prop('disabled', false);
    component.$sidePanelContainer.find('input[name="contacted_person_name"]').val('');
    component.$sidePanelContainer.find('#contacted_person').hide();
  }
};


/**
 * This method toggle the contact name textbox when 'personnel_not_found' is checked when modifying comm event
 * @returns {void}
 */
CommunicationEventsWF.prototype.toggleContactName = function() {
  var component = this;

  component.$sidePanelContainer.find('input[name="personnel_search"]').prop('disabled', true);
  component.personnelSearchControl.setSelectedProvider(0, '');
  component.$sidePanelContainer.find('#contacted_person').show();
};


/**
 * This method stretches the component table
 * @returns {void}
 */
CommunicationEventsWF.prototype.stretchTable = function() {
  this.$tableView.width('100%');
};

/**
 * This method shrinks the component table
 * @returns {void}
 */
CommunicationEventsWF.prototype.shrinkTable = function() {
  this.$tableView.width('60%');
};

/**
 * This method resizes the sidepanel when the form fields are flexed.
 * @returns {void}
 */
CommunicationEventsWF.prototype.resizeSidePanel = function() {
  var component = this;
  var $spContectSection = component.$sidePanelContainer.find('div[class="sp-content-section sp-add-scroll"]');
  var scrollPosition = $spContectSection.scrollTop();

  if (component.sidePanelAdd) {
    component.sidePanelAdd.collapseSidePanel();
    component.sidePanelAdd.expandSidePanel();
  }
  if (component.sidePanelView) {
    component.sidePanelView.collapseSidePanel();
    component.sidePanelView.expandSidePanel();
  }
  if (component.sidePanelEdit) {
    component.sidePanelEdit.collapseSidePanel();
    component.sidePanelEdit.expandSidePanel();
  }
  $(window).resize(function() {
    component.$sidePanelContainer.find('.date-container .date-input').datepicker('hide');
    component.$sidePanelContainer.find('.time-container .time-input').timepicker('hide');
  });

  component.$sidePanelContainer.find('.wfHcmCommEvents-sec .sp-expand-collapse').removeClass('hidden');

  if ($spContectSection.scrollTop() !== scrollPosition) {
    $spContectSection.scrollTop(scrollPosition);
  }
};

/**
 * This is the communication_events (workflow component) implementation of the renderComponent function.
 * It takes the information retrieved from the HCM_GET_COMM_EVENTS script call and renders the component's visuals.
 * @param {object} reply The data object returned from the HCM_GET_COMM_EVENTS script.
 * @returns {void}
 */
CommunicationEventsWF.prototype.renderComponent = function(reply) {
  var component = this;
  var numberResults = 0;
  var displayNumber = null;
  var communicationHTML = '';
  var $mainContainerObj = null;
  var $tableView = null;
  var $sidePanelContainer = null;
  var compNS = component.getStyles().getNameSpace();
  var componentId = component.getComponentId();
  numberResults = reply.COMM_EVENTS.length;
  displayNumber = '(' + numberResults + ')';
  component.resultCount = numberResults;

  $mainContainerObj = $('<div id="' + componentId + '-main-container" class="' + compNS + '-main-container">');
  $tableView = $('<div id="' + componentId + '-table-view" class="' + compNS + '-communication-table"/>');
  $sidePanelContainer = $('<div id="' + componentId + '-side-panel-container" class="' + compNS + '-sidepanel-container"/>');

  component.formatDataForTableDisplay(reply.COMM_EVENTS);
  component.communicationTable = component.getCommunicationTable();
  component.hasModifyCommEventInd = reply.HAS_MODIFY_COMM_EVENT_IND;

  // Bind the data to the table
  component.communicationTable.bindData(reply.COMM_EVENTS);

  // Store off the component table
  component.setComponentTable(component.communicationTable);

  component.addCellClickExtension();

  // Append the recommendationsTable object to table view
  $tableView.append($(component.communicationTable.render()));

  // Append both table view and reading pane to main container
  $mainContainerObj.append($tableView, $sidePanelContainer);

  // Append the main container markup to component markup
  communicationHTML += $mainContainerObj[0].outerHTML;
  component.finalizeComponent(communicationHTML, displayNumber);

  component.$tableView = $('#' + componentId + '-table-view');
  component.$sidePanelContainer = $('#' + componentId + '-side-panel-container');
  component.codeSets = reply.CODE_SETS;


  // Display comm event counter in workflow
  CERN_EventListener.fireEvent(component, component, EventListener.EVENT_COUNT_UPDATE, {
    count: numberResults
  });

};

/**
 * Need to shim toISOString() method for IE 8
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 */
if (!Date.prototype.toISOString) {
  (function() {

    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    Date.prototype.toISOString = function() {
      return this.getUTCFullYear() +
        '-' + pad(this.getUTCMonth() + 1) +
        '-' + pad(this.getUTCDate()) +
        'T' + pad(this.getUTCHours()) +
        ':' + pad(this.getUTCMinutes()) +
        ':' + pad(this.getUTCSeconds()) +
        '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
    };

  }());
}

/**
 * Map the Communication Events Option 1 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the 'WF_COMMUNICATION_EVENTS' filter
 */
MP_Util.setObjectDefinitionMapping('WF_COMMUNICATION_EVENTS', CommunicationEventsWF);
