define(['durandal/system', 'knockout', 'moment', 'i18next', 'mpages/logger', 'mpages/mp_util'], function (system, ko, moment, i18n, logger, mp_util) {
    var MICRO_VIEWER_RESULTS = "MICRO";
    var microbiologyVM = function () {
        /*
        *   An observable array of microbiology results
        */
        this.microBiologyResults = ko.observableArray([]);
    };

    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the microbiology events for the patient.
    *   @method activate
    *   @params {Object} patientDetails - patient data passed in via the view
    */
    microbiologyVM.prototype.activate = function (patientDetails) {
        this.microBiologyResults(patientDetails.COLMBRESQUAL);
    };



    /*
    *   Retrieves the header display for the current microbiology result
    *   @method getMicroBiologyHeader
    *   @param {Object} currentMicroBioResult
    *   @return {String} header
    */
    microbiologyVM.prototype.getMicroBiologyHeader = function (currentMicroBioResult) {
        var header = '';
        try {
            if (currentMicroBioResult) {
                header = currentMicroBioResult.SOURCETYPECDDISP + '/' + currentMicroBioResult.BODYSITECDDISP;
            }
        } catch (error) {
            logger.log(i18n.t('app:modules.logMessage.MICRO_HEADER_FAILED'), currentMicroBioResult, system.getModuleId(this) + ' - currentMicroBiologyHeader', false);
        }
        return header;
    };

    /*
    *   Retrieves the CSS class if the micro result is marked red with a normalcy
    *   @method getNormalcyCdRedClass
    *   @param {Object} currentMicroBioResult
    *   @return {String} normalcyCdRedClass
    */
    microbiologyVM.prototype.getNormalcyCdRedClass = function (currentMicroBioResult) {
        var normalcyCdRedClass = '';

        if (currentMicroBioResult && currentMicroBioResult.NORMALCYCDRED) {
            normalcyCdRedClass = 'hrc-micro-severe';
        }

        return normalcyCdRedClass;
    };

    /*
    *   Retrieves the details of the current microbiology result
    *   @method getMicroBiologyDetail
    *   @param {Object} currentMicroBioResult
    *   @return {String} details
    */
    microbiologyVM.prototype.getMicroBiologyDetail = function (currentMicroBioResult) {
        var details = '';
        try {
            if (currentMicroBioResult) {
                details = currentMicroBioResult.NORMALCYCDDISP + ' ' + currentMicroBioResult.ORGANISMCDDISP + ' ' + currentMicroBioResult.RESULTSTATUSCDDISP + ' ';
            }
        } catch (error) {
            logger.log(i18n.t('app:modules.logMessage.MICRO_DETAIL_FAILED'), currentMicroBioResult, system.getModuleId(this) + ' - getMicroBiologyDetail', false);
        }
        return details;
    };

    /*
    *   Retrieves the localized date
    *   @method getLocalizedDate
    *   @param {String} utcDateString - a UTC date
    *   @return {String} Localized date
    */
    microbiologyVM.prototype.getLocalizedDate = function (utcDateString) {
        return mp_util.getLocalizedDate(utcDateString, system.getModuleId(this));
    };

    /*
    *   The caption for the hyperlink to open a clinical note
    */
    microbiologyVM.prototype.clinicalNoteCaption = i18n.t('app:modules.worklist.CLINICAL_NOTE_CAPTION');

    /*
    *   Retrieves the CSS class of the clinical note depending on the normalcy
    *   @method getClinicalNoteClass
    *   @param {Object} currentMicroBioResult
    *   @return {String} clinicalNoteClass
    */
    microbiologyVM.prototype.getClinicalNoteClass = function (currentMicroBioResult) {
        var clinicalNoteClass = '';

        if (currentMicroBioResult) {
            if (currentMicroBioResult.NORMALCYCDRED) {
                clinicalNoteClass = 'hrc-micro-severe';
            } else {
                clinicalNoteClass = 'hrc-link-text';
            }
        }

        return clinicalNoteClass;
    };


    /*
    *   Opens the clinical note
    *   @method showClinicalNote
    *   @param currentMicroBioResult
    */
    microbiologyVM.prototype.showClinicalNote = function (currentMicroBioResult) {
        if (currentMicroBioResult) {
            try {
                mp_util.LaunchClinNoteViewer(currentMicroBioResult.PERSONID, currentMicroBioResult.ENCOUNTERID, currentMicroBioResult.EVENTID, MICRO_VIEWER_RESULTS);
            } catch (error) {
                logger.logError(i18n.t('app:modules.worklist.CLINICAL_NOTE_OPEN_FAILED'), currentMicroBioResult, system.getModuleId(this) + "- showClinicalNote", true);
            }
        } else {
            logger.logError(i18n.t('app:modules.worklist.CLINICAL_NOTE_OPEN_FAILED'), currentMicroBioResult, system.getModuleId(this) + "- showClinicalNote", true);
        }
    };

    microbiologyVM.prototype.detached = function (node, parentNode, viewModelReference) {
        this.microBiologyResults = null;
        viewModelReference = null;
    };

    return microbiologyVM;
});