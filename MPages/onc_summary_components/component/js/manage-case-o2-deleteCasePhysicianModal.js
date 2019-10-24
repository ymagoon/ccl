var ManageCaseWorkFlow = ManageCaseWorkFlow || {};

ManageCaseWorkFlow.deleteCasePhysicianModal = (function(){

  function modal(component, caseInformation, modalBody) {
    var i18nMcO2 = component.i18n,
        modalId  = component.getComponentId() + "deleteCasePhysicianModal",
        modalDialog;

    // Delete any existing modal dialog object with modalId.
    MP_ModalDialog.deleteModalDialogObject(modalId);

    // Create a new modal dialog with the modalId.
    modalDialog = new ModalDialog(modalId);

    modalDialog.setHeaderTitle(i18nMcO2.REMOVE_CASE_PHYSICIAN_HEADER)
      .setTopMarginPercentage(25)
      .setRightMarginPercentage(35)
      .setBottomMarginPercentage(20)
      .setLeftMarginPercentage(30)
      .setIsBodySizeFixed(false)
      .setHasGrayBackground(true)
      .setIsFooterAlwaysShown(true);

    modalDialog.setBodyDataFunction(function(modalObj) {
      modalObj.setBodyElementId(component.namespace + "deleteCasePhysicianModalbody");
      modalObj.setBodyHTML(modalBody);
    });

    var saveButton = new ModalButton("delete-case-physician");
    saveButton.setText(i18nMcO2.REMOVE).setIsDithered(false).setOnClickFunction(function() {
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
    var body = "<span class='" + namespace + "-warning-icon'>" + component.i18n.REMOVE_CASE_PHYSICIAN.replace("{name}", caseInformation.CASE_PHYSICIAN_FULL_NAME) + "</span>";

    return body;
  }

  function submit(caseInformation, component) {
    var criterion = component.getCriterion();
    var changeStatusRequest = {
      case_information: {
        version: caseInformation.VERSION,
        case_physician: {
          prsnl_id: 0.0,
          current_case_physician_prsnl_reltn_id: parseFloat(caseInformation.CURRENT_CASE_PHYSICIAN_PRSNL_RELTN_ID),
          delete_ind: 1
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
  ManageCaseWorkFlow.__deleteCasePhysicianModal = {
    modal     : modal,
    modalBody : modalBody,
    submit    : submit
  };

  return function(component, caseInformation) {
    modal(component, caseInformation, modalBody(component, caseInformation));
  };
})();
