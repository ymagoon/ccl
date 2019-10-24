define(['knockout', 'durandal/system', 'mpages/logger', 'i18next'], function (ko, system, logger, i18n) {
    // The View Model
    var diagnosisVM = function () {

        /*
        *   Observable array to store diagnoses
        */
        this.diagnoses = ko.observableArray([]);
    };

    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the diagnosis for the patient.
    *   @method activate
    *   @params {Object} patientDetails - patient data passed in via the view
    */
    diagnosisVM.prototype.activate = function (patientDetails) {
        if (patientDetails) {
            this.diagnoses(patientDetails.COLDIAGNOSQUAL);
        }
    };

    /*
    *   Retrieves the header for the diagnosis
    *   @method getDiagnosisHeader
    *   @param {Object} currentDiagnosis
    *   @return {String} header - a string containing the current diagnosis display header
    */
    diagnosisVM.prototype.getDiagnosisHeader = function (currentDiagnosis) {
        var header = '';
        if (currentDiagnosis) {
            if (currentDiagnosis.COLDIAGNOSDISPLAY !== '') {
                header = currentDiagnosis.COLDIAGNOSDISPLAY;
            }
            else {
                header = currentDiagnosis.COLDIAGNOSSOURCEST;
            }
        }
        return header;
    };

    /*
    *   Retrieves details of the current diagnosis
    *   @method getDiagnosisDetail
    *   @param {Object} currentDiagnosis
    *   @return {String} detail - A string containing the details of the diagnosis
    */
    diagnosisVM.prototype.getDiagnosisDetail = function (currentDiagnosis) {
        var detail = '';
        try {
            if (currentDiagnosis && currentDiagnosis.COLDIAGNOSSOURCEID !== '') {
                detail = '(' + currentDiagnosis.COLDIAGNOSSOURCEID + ')';
            }
        } catch (error) {
            logger.logError(i18n.t('app:modules.logMessages.DIAGNOSIS_DETAILS_FAILED'), currentDiagnosis, system.getModuleId(this) + ' - getDiagnosisDetail', false);
        }

        return detail;
    };

    diagnosisVM.prototype.detached = function (node, parentNode, viewModelReference) {
        this.diagnoses = null;
        viewModelReference = null;
    };

    return diagnosisVM;
});