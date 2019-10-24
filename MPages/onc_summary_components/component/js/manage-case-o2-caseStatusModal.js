var ManageCaseWorkFlow = ManageCaseWorkFlow || {};

ManageCaseWorkFlow.caseStatusModal = (function(){

  function modal(component, caseInformation, modalBody) {
    var i18nMcO2 = component.i18n,
        modalId  = component.getComponentId() + "caseStatusModal",
        modalDialog;

    // Delete any existing modal dialog object with modalId.
    MP_ModalDialog.deleteModalDialogObject(modalId);
    
    // Create a new modal dialog with the modalId.
    modalDialog = new ModalDialog(modalId);

    modalDialog.setHeaderTitle(i18nMcO2.CASE_STATUS_MODAL_TITLE)
      .setTopMarginPercentage(25)
      .setRightMarginPercentage(35)
      .setBottomMarginPercentage(20)
      .setLeftMarginPercentage(30)
      .setIsBodySizeFixed(false)
      .setHasGrayBackground(true)
      .setIsFooterAlwaysShown(true);

    modalDialog.setBodyDataFunction(function(modalObj) {
      modalObj.setBodyElementId(component.namespace + "caseStatusModalbody");
      modalObj.setBodyHTML(modalBody);
    });

    var saveButton = new ModalButton("update-case");
    saveButton.setText(i18nMcO2.CASE_STATUS_MODAL_UPDATE_BUTTON).setIsDithered(true).setOnClickFunction(function() {
      new CapabilityTimer('CAP:MPG MANAGE CASE O2 CASE STATUS CHANGED').capture();
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
    var body = "<p>" + component.i18n.CASE_STATUS_MODAL_TEXT.replace("{current_status}", caseInformation.CURRENT_CASE.STATUS_DISP) + "</p><br/>";

    $.each(caseInformation.AVAILABLE_CASE_STATUSES.STATUSES, function(_, status) {
      body += "<input type='radio' name='" + namespace + "caseStatus' id='" + namespace + status.STATUS_CDF_MEANING + "' value='"+ status.STATUS_CD +"'/>";
      body += "<label for='" + namespace + status.STATUS_CDF_MEANING + "'>" + status.STATUS_DISP + "</label><br/>";
    });

    return body;
  }

  function submit(caseInformation, component) {
    var criterion = component.getCriterion();
    var changeStatusRequest = {
      case_information: {
        version: caseInformation.VERSION,
        current_status_cd: caseInformation.CURRENT_STATUS_CD,
        case_status: {
          case_cd: parseFloat($("input[name='" + component.namespace + "caseStatus']:checked").val())
        }
      }
    };

    //create timer to count how often each status is chosen
    var newCaseStatus = $("input[name='" + component.namespace + "caseStatus']:checked").attr('id') || '';
    if(newCaseStatus){
      createCaseStatusTimer(component.namespace, newCaseStatus);
    }

    MP_Util.LoadSpinner(component.getSectionContentNode().id, 1);
    component.scriptRequest({
      name: "HCM_CHG_CASE",
      params: [criterion.person_id + ".0", criterion.encntr_id + ".0", "^" + JSON.stringify(changeStatusRequest).replace(/"/g, "'") + "^"],
      success: function(response) { checkForFailedUpdate(response, component); }
    });
  }

  function createCaseStatusTimer(namespace, caseStatusId){
    var caseStatusIndex = {};
    caseStatusIndex[namespace + 'ENROLLED'] = 'ENROLLED';
    caseStatusIndex[namespace + 'PENDENROLL'] = 'PENDING ENROLLMENT';
    caseStatusIndex[namespace + 'ACTIVE'] = 'ACTIVE';
    caseStatusIndex[namespace + 'PENDCLOSURE'] = 'PENDING CLOSURE';
    caseStatusIndex[namespace + 'NEW'] = 'NEW';
    caseStatusIndex[namespace + 'CLOSED'] = 'CLOSED';

    var statusSubtimer = caseStatusIndex[caseStatusId] || '';
    if(statusSubtimer.length){
      new CapabilityTimer('CAP:MPG MANAGE CASE O2 CASE STATUS CHANGED', statusSubtimer).capture();
    }
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
  ManageCaseWorkFlow.__caseStatusModal = {
    modal     : modal,
    modalBody : modalBody,
    submit    : submit,
    createCaseStatusTimer : createCaseStatusTimer
  };

  return function(component, caseInformation) {
    modal(component, caseInformation, modalBody(component, caseInformation));

    $(document).on("click","input[name='" + component.namespace + "caseStatus']",function(){
      $("#" + component.getComponentId() + "caseStatusModalfooter #update-case").prop("disabled", false);
    });
  };
})();
