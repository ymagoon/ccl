var ManageCaseWorkFlow = ManageCaseWorkFlow || {};

ManageCaseWorkFlow.caseTypeModal = (function(){

  function modal(component, caseInformation, modalBody) {
    var i18nMcO2 = component.i18n,
        modalId  = component.getComponentId() + "caseTypeModal",
        modalDialog;

    // Delete any existing modal dialog object with modalId.
    MP_ModalDialog.deleteModalDialogObject(modalId);
    
    // Create a new modal dialog with the modalId.
    modalDialog = new ModalDialog(modalId);

    modalDialog.setHeaderTitle(i18nMcO2.CASE_TYPE_MODAL_TITLE)
      .setTopMarginPercentage(25)
      .setRightMarginPercentage(35)
      .setBottomMarginPercentage(20)
      .setLeftMarginPercentage(30)
      .setIsBodySizeFixed(false)
      .setHasGrayBackground(true)
      .setIsFooterAlwaysShown(true);

    modalDialog.setBodyDataFunction(function(modalObj) {
      modalObj.setBodyHTML(modalBody);
    });

    var saveButton = new ModalButton("update-case-type");
    saveButton.setText(i18nMcO2.CASE_TYPE_MODAL_UPDATE_BUTTON).setIsDithered(true).setOnClickFunction(function() {
      new CapabilityTimer('CAP:MPG MANAGE CASE O2 CASE TYPE CHANGED').capture();
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
    var body = "<p>" + component.i18n.CASE_TYPE_MODAL_TEXT.replace("{current_case_type}", caseInformation.ENCNTR_TYPE_DISP) + "</p>";
    var selectTag = "";

    selectTag = "<label class='" + namespace + "-case-type-label'>" + component.i18n.CASE_TYPE_LABEL + "</label>" + 
                "<select name='" + namespace + "-caseType' class='" + namespace + "-case-type-select'>" +
                  "<option selected value=''></option>";

    $.each(caseInformation.AVAILABLE_CASE_TYPES, function(_, caseType) {
      selectTag += "<option value='" + caseType.CASE_TYPE_CD + "'>" + caseType.CASE_TYPE_DISP + "</option>";
    });

    selectTag += "</select>";
    body += selectTag;

    return body;
  }

  function submit(caseInformation, component) {
    var criterion = component.getCriterion();
    var changeTypeRequest = {
      case_information: {
        version: caseInformation.VERSION,
        case_type: {
          type_cd: parseFloat($("select[name='" + component.namespace + "-caseType']").val() + ".0")
        }
      }
    };

    MP_Util.LoadSpinner(component.getSectionContentNode().id, 1);
    component.scriptRequest({
      name: "HCM_CHG_CASE",
      params: [criterion.person_id + ".0", criterion.encntr_id + ".0", "^" + JSON.stringify(changeTypeRequest).replace(/"/g, "'") + "^"],
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
  ManageCaseWorkFlow.__caseTypeModal = {
    modal     : modal,
    modalBody : modalBody,
    submit    : submit
  };

  return function(component, caseInformation) {
    modal(component, caseInformation, modalBody(component, caseInformation));

    $(document).on("change", "select[name='" + component.namespace + "-caseType']", function(){
      if ($("select[name='" + component.namespace + "-caseType']").val() === "") {
        $("#" + component.getComponentId() + "caseTypeModalfooter #update-case-type").prop("disabled", true);
      } else {
        $("#" + component.getComponentId() + "caseTypeModalfooter #update-case-type").prop("disabled", false);
      }
    });
  };
})();