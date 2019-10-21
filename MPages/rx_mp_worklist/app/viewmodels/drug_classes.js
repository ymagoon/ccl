define(['knockout', 'durandal/system', 'mpages/logger', 'i18next'], function (ko, system, logger, i18n) {
    // The view model
    var drugClassesVM = function () {
        /*
        *   An observable array to store the drug classes for the patient
        */
        this.drugClasses = ko.observableArray([]);
    };

    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the drug classes for the patient.
    *   @method activate
    *   @params {Object} patientDetails - patient data passed in via the view
    */
    drugClassesVM.prototype.activate = function (patientDetails) {
        if (patientDetails) {
            this.drugClasses(patientDetails.COLDRUGQUAL);
        }
    };

    /*
    *   Retrieves details of the drug class
    *   @method getDrugClassDetail
    *   @param {Object} currentDrugClass
    *   @return {String} details of the drug class
    */
    drugClassesVM.prototype.getDrugClassDetail = function (currentDrugClass) {
        try {
            if (currentDrugClass) {
                return currentDrugClass.COLDRUGEVENTDISP + ": " + currentDrugClass.COLDRUGSIMPCLINDISP;
            }
        } catch (error) {
            logger.logError(i18n.t('app:modules.logMessage.DRUG_DETAIL_FAILED'), currentDrugClass, system.getModuleId(this) + ' - getDrugClassDetail', false);
        }
        return "";
    };

    drugClassesVM.prototype.detached = function (node, parentNode, viewModelReference) {
        this.drugClasses = null;
        viewModelReference = null;
    };

    return drugClassesVM;
});