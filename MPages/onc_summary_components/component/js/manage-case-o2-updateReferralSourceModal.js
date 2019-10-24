var ManageCaseWorkFlow = ManageCaseWorkFlow || {};

ManageCaseWorkFlow.updateReferralSourceModal = (function(){

  function modal(component, caseInformation, modalBody) {
    var i18nMcO2 = component.i18n;
    var modalId  = component.getComponentId() + 'updateReferralSourceModal';
    var modalDialog;
    var referralInformation = null;

    // Delete any existing modal dialog object with modalId.
    MP_ModalDialog.deleteModalDialogObject(modalId);

    // Create a new modal dialog with the modalId.
    modalDialog = new ModalDialog(modalId);

    modalDialog.setHeaderTitle(i18nMcO2.UPDATE_REFERRAL_SOURCE_HEADER)
      .setTopMarginPercentage(25)
      .setRightMarginPercentage(35)
      .setBottomMarginPercentage(20)
      .setLeftMarginPercentage(30)
      .setIsBodySizeFixed(false)
      .setHasGrayBackground(true)
      .setIsFooterAlwaysShown(true);

    modalDialog.setBodyDataFunction(function(modalObj) {
      modalObj.setBodyElementId(component.namespace + 'updateReferralSourceModalbody');
      modalObj.setBodyHTML(modalBody);
    });

    var saveButton = new ModalButton('update-referral-source');
    saveButton.setText(i18nMcO2.UPDATE).setIsDithered(true).setOnClickFunction(function() {
      submit(caseInformation, component);
    });
    modalDialog.addFooterButton(saveButton);

    var cancelButton = new ModalButton('cancel');
    cancelButton.setText(i18nMcO2.CANCEL_TEXT).setIsDithered(false).setOnClickFunction(function() {
      MP_ModalDialog.closeModalDialog(modalId);
    });
    modalDialog.addFooterButton(cancelButton);

    MP_ModalDialog.updateModalDialogObject(modalDialog);
    MP_ModalDialog.showModalDialog(modalId);
  }

  function modalBody(component, caseInformation) {
    var namespace = component.namespace;
    var body = "<p>" + component.i18n.UPDATE_REFERRAL_SOURCE_MODAL_TEXT.replace('{referral_source}', caseInformation.REFERRAL_SOURCE_DISP) + '</p></br>';
    var selectTag = "";

    selectTag = '<label class="' + namespace + '-update-referral-source-label">' + component.i18n.REFERRAL_SOURCE_LABEL + '</label></br>' +
                '<select name="' + namespace + '-updateReferralSource" class="' + namespace + '-update-referral-source-select">' +
                  '<option selected value=""></option>';

    $.each(caseInformation.REFERRAL_SOURCES, function(_, referralSource) {
      selectTag += '<option value="' + referralSource.CODE_VALUE + '">' + referralSource.DISPLAY + '</option>';
    });

    selectTag += '</select>';
    body += selectTag;

    return body;
  }

  function submit(caseInformation, component) {
    var criterion = component.getCriterion();
    var changeReferralSourceRequest = {
      case_information: {
        version: caseInformation.VERSION,
        referral_source_cd: parseFloat($('select[name="' + component.namespace + '-updateReferralSource"]').val() + '.0')
      }
    };

    MP_Util.LoadSpinner(component.getSectionContentNode().id, 1);
    component.scriptRequest({
      name: 'HCM_CHG_CASE',
      params: [criterion.person_id + '.0', criterion.encntr_id + '.0', '^' + JSON.stringify(changeReferralSourceRequest).replace(/"/g, "'") + '^'],
      success: function(response) { checkForFailedUpdate(response, component); }
    });
  }

  function checkForFailedUpdate(response, component) {
    if (response.STATUS_DATA.STATUS === 'F') {
      ManageCaseWorkFlow.errorModal(component, component.i18n.ERROR_MODAL_TITLE,
        '<span class="' + component.namespace + '-error-icon">' + component.i18n.SYSTEM_ERROR + '</span>');
      $('#' + component.getSectionContentNode().id).find('.loading-screen').remove();
    } else {
      component.retrieveComponentData();
    }
  }

  //private api exposed for testing
  ManageCaseWorkFlow.__updateReferralSourceModal = {
    modal     : modal,
    modalBody : modalBody,
    submit    : submit
  };

  return function(component, caseInformation) {
    modal(component, caseInformation, modalBody(component, caseInformation));

    $(document).on('change', 'select[name="' + component.namespace + '-updateReferralSource"]', function(){
      if ($('select[name="' + component.namespace + '-updateReferralSource"]').val() === '') {
        $('#' + component.getComponentId() + 'updateReferralSourceModalfooter #update-referral-source').prop('disabled', true);
      } else {
        $('#' + component.getComponentId() + 'updateReferralSourceModalfooter #update-referral-source').prop('disabled', false);
      }
    });
  };
})();
