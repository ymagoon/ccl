var ManageCaseWorkFlow = ManageCaseWorkFlow || {};

ManageCaseWorkFlow.errorModal = (function(){

  function modal(component, modalHeader, modalBody) {
    var modalId = component.getComponentId() +"errorModal",
        modalDialog;

    // Delete any existing modal dialog object with modalId.
    MP_ModalDialog.deleteModalDialogObject(modalId);
    
    // Create a new modal dialog with the modalId.
    modalDialog = new ModalDialog(modalId);

    modalDialog.setHeaderTitle(modalHeader)
      .setTopMarginPercentage(25)
      .setRightMarginPercentage(35)
      .setBottomMarginPercentage(20)
      .setLeftMarginPercentage(30)
      .setIsBodySizeFixed(false)
      .setHasGrayBackground(true)
      .setIsFooterAlwaysShown(true);

    modalDialog.setBodyDataFunction(function(modalObj) {
      modalObj.setBodyElementId(component.namespace + "errorModalbody");
      modalObj.setBodyHTML(modalBody);
    });

    var cancelButton = new ModalButton("close");
    cancelButton.setText(component.i18n.CLOSE_TEXT).setIsDithered(false).setOnClickFunction(function() {
      MP_ModalDialog.closeModalDialog(modalId);
    });
    modalDialog.addFooterButton(cancelButton);

    MP_ModalDialog.updateModalDialogObject(modalDialog);
    MP_ModalDialog.showModalDialog(modalId);
  }

  return function(component, modalHeader, modalBody) {
    modal(component, modalHeader, modalBody);
  };
})();
