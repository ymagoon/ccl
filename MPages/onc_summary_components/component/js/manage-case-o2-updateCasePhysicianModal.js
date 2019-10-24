var ManageCaseWorkFlow = ManageCaseWorkFlow || {};

ManageCaseWorkFlow.updateCasePhysicianModal = (function(){

  function modal(component, caseInformation, modalBody) {
    var i18nMcO2 = component.i18n,
        modalId  = component.getComponentId() + "updateCasePhysicianModal",
        modalDialog;

    // Delete any existing modal dialog object with modalId.
    MP_ModalDialog.deleteModalDialogObject(modalId);
    
    // Create a new modal dialog with the modalId.
    modalDialog = new ModalDialog(modalId);

    modalDialog.setHeaderTitle(i18nMcO2.UPDATE_CASE_PHYSICIAN_HEADER)
      .setTopMarginPercentage(25)
      .setRightMarginPercentage(35)
      .setBottomMarginPercentage(20)
      .setLeftMarginPercentage(30)
      .setIsBodySizeFixed(false)
      .setHasGrayBackground(true)
      .setIsFooterAlwaysShown(true);

    modalDialog.setBodyDataFunction(function(modalObj) {
      modalObj.setBodyElementId(component.namespace + "updateCasePhysicianModalbody");
      modalObj.setBodyHTML(modalBody);
    });

    var deleteButton = new ModalButton("delete-case-physician");
    deleteButton.setText(i18nMcO2.REMOVE).setIsDithered(false).setOnClickFunction(function() {
      ManageCaseWorkFlow.deleteCasePhysicianModal(component, caseInformation);
    });
    modalDialog.addFooterButton(deleteButton);

    var saveButton = new ModalButton("update-case-physician");
    saveButton.setText(i18nMcO2.UPDATE).setIsDithered(true).setOnClickFunction(function() {
      new CapabilityTimer('CAP:MPG MANAGE CASE O2 PHYSICIAN UPDATED').capture();
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
                 component.i18n.CURRENT_CASE_PHYSICIAN.replace("{name}", caseInformation.CASE_PHYSICIAN_FULL_NAME) +
               "</p>";

    body += "<div id='personnel-name-details'>" +
              "<br><label>" + component.i18n.CASE_PHYSICIAN_SEARCH + "</label><br>" +
              "<input type='text' class='searchText' name='personnel_search' id='personnel-search'>" +
            "</div>";

    return body;
  }

  function submit(caseInformation, component) {
    var criterion = component.getCriterion();
    var changeStatusRequest = {
      case_information: {
        version: caseInformation.VERSION,
        case_physician: {
          prsnl_id: parseFloat(component.providerSearchControl.getSelectedProviderId()),
          current_case_physician_prsnl_reltn_id: parseFloat(caseInformation.CURRENT_CASE_PHYSICIAN_PRSNL_RELTN_ID),
          delete_ind: 0
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
    } else {
      component.retrieveComponentData();
    }
  }

  //private api exposed for testing
  ManageCaseWorkFlow.__updateCasePhysicianModal = {
    modal                     : modal,
    modalBody                 : modalBody,
    submit                    : submit
  };

  return function(component, caseInformation) {
    modal(component, caseInformation, modalBody(component, caseInformation));
    component.providerSearchControl = new ProviderSearchControl($("#" + component.namespace + "updateCasePhysicianModalbody #personnel-search")[0]);

    $("input[name='personnel_search']").focus();

    $("input[name='personnel_search']").blur(function() {
      if (component.providerSearchControl.getSelectedProviderId() > 0) {
        $("#" + component.getComponentId() + "updateCasePhysicianModalfooter #update-case-physician").prop("disabled", false);
      } else {
        $("#" + component.getComponentId() + "updateCasePhysicianModalfooter #update-case-physician").prop("disabled", true);
      }
    });
  };
})();
