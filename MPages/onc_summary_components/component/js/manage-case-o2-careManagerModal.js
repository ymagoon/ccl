var ManageCaseWorkFlow = ManageCaseWorkFlow || {};

ManageCaseWorkFlow.careManagerModal = (function(){

  function modal(component, caseInformation, modalBody) {
    var i18nMcO2 = component.i18n,
        modalId  = component.getComponentId() + "careManagerModal",
        modalDialog;

    // Delete any existing modal dialog object with modalId.
    MP_ModalDialog.deleteModalDialogObject(modalId);

    // Create a new modal dialog with the modalId.
    modalDialog = new ModalDialog(modalId);

    modalDialog.setHeaderTitle(i18nMcO2.REASSIGN_CASE)
      .setTopMarginPercentage(25)
      .setRightMarginPercentage(35)
      .setBottomMarginPercentage(20)
      .setLeftMarginPercentage(30)
      .setIsBodySizeFixed(false)
      .setHasGrayBackground(true)
      .setIsFooterAlwaysShown(true);

    modalDialog.setBodyDataFunction(function(modalObj) {
      modalObj.setBodyElementId(component.namespace + "careManagerModalbody");
      modalObj.setBodyHTML(modalBody);
    });

    var saveButton = new ModalButton("reassign-care-manager");
    saveButton.setText(i18nMcO2.REASSIGN).setIsDithered(true).setOnClickFunction(function() {
      new CapabilityTimer('CAP:MPG MANAGE CASE O2 CASE REASSIGNED').capture();
      submit(caseInformation, component);
    });
    modalDialog.addFooterButton(saveButton);

    var cancelButton = new ModalButton("cancel");
    cancelButton.setText(i18nMcO2.CANCEL_TEXT).setIsDithered(false).setOnClickFunction(function() {
      MP_ModalDialog.closeModalDialog(modalId);
    });
    modalDialog.addFooterButton(cancelButton);

    MP_ModalDialog.updateModalDialogObject(modalDialog);
    MP_ModalDialog.showModalDialog(modalId);
  }

  function modalBody(component, caseInformation) {
    var namespace = component.namespace;

    var body = "<p>" +
                 component.i18n.CURRENT_CARE_MANAGER.replace("{name}", caseInformation.CARE_MANAGER_FULL_NAME) +
               "</p>";

    body += "<div id='personnel-name-details'>" +
              "<br><label>" + component.i18n.CARE_MANAGER_SEARCH + "</label><br>" +
              "<input type='text' class='searchText' name='personnel_search' id='personnel-search'>" +
            "</div>";

    return body;
  }

  function submit(caseInformation, component) {
    var criterion = component.getCriterion();
    var changeStatusRequest = {
      case_information: {
        version: caseInformation.VERSION,
        current_care_manager_prsnl_reltn_id: parseFloat(caseInformation.CURRENT_CARE_MANAGER_PRSNL_RELTN_ID),
        current_care_manager_id: caseInformation.CARE_MANAGER_PRSNL_ID,
        care_manager: {
          id: parseFloat(component.providerSearchControl.getSelectedProviderId())
        }
      }
    };

    MP_Util.LoadSpinner(component.getSectionContentNode().id, 1);
    component.scriptRequest({
      name: "HCM_CHG_CASE",
      params: [criterion.person_id + ".0", criterion.encntr_id + ".0", "^" + JSON.stringify(changeStatusRequest).replace(/"/g, "'") + "^"],
      success: function(response) { checkForFailedUpdate(response, component); }
    });
  }

  function checkForFailedUpdate(response, component) {
    if (response.STATUS_DATA.STATUS === "F") {
      ManageCaseWorkFlow.errorModal(component, component.i18n.ERROR_MODAL_TITLE,
        "<span class='" + component.namespace + "-error-icon'>" + component.i18n.SYSTEM_ERROR + "</span>");
      $("#" + component.getSectionContentNode().id).find(".loading-screen").remove();
    } else if (response.STATUS_DATA.STATUS === "P") {
      ManageCaseWorkFlow.errorModal(component, component.i18n.UNABLE_TO_PROCESS,
        "<span class='" + component.namespace + "-info-icon'>" + component.i18n.CARE_TEAM_UPDATE_FAILURE + "</span>");
      $("#" + component.getSectionContentNode().id).find(".loading-screen").remove();
      component.retrieveComponentData();
    } else {
      component.retrieveComponentData();
    }
  }

  function setPersonnelSearchFilters(component, caseInformation) {
    var filter_data = $.map(caseInformation.CM_POSITIONS, function(cm_position) { return {DATA_ID: cm_position.POSITION_CD}; });
    component.providerSearchControl.setAdvanceFilters([{FILTER_NAME: "position", FILTER_DATA: filter_data}]);
  }

  //private api exposed for testing
  ManageCaseWorkFlow.__careManagerModal = {
    modal     : modal,
    modalBody : modalBody,
    submit    : submit,
    setPersonnelSearchFilters : setPersonnelSearchFilters
  };

  return function(component, caseInformation) {
    modal(component, caseInformation, modalBody(component, caseInformation));
    component.providerSearchControl = new ProviderSearchControl($("#" + component.namespace + "careManagerModalbody #personnel-search")[0]);
    setPersonnelSearchFilters(component, caseInformation);

    $('input[name="personnel_search"]').focus();

    $("input[name='personnel_search']").blur(function() {
      if (component.providerSearchControl.getSelectedProviderId() > 0) {
        $("#" + component.getComponentId() + "careManagerModalfooter #reassign-care-manager").prop("disabled", false);
      } else {
        $("#" + component.getComponentId() + "careManagerModalfooter #reassign-care-manager").prop("disabled", true);
      }
    });
  };
})();
