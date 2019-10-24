define(['durandal/system', 'knockout', 'mpages/mp_util', 'i18next', 'mpages/logger'], function (system, ko, mp_util, i18n, logger) {
    // The view model
    var discernAlertsVM = function () {
        /*
        *   An observable array to store the discern alerts of the patient
        */
        this.discernAlerts = ko.observableArray([]);
    };

    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the discern alerts for the patient.
    *   @method activate
    */
    discernAlertsVM.prototype.activate = function (patientData) {
        if (patientData)
            this.discernAlerts(patientData.COLALERTQUAL);
    };


    /*
    *   Retrieves the localized date
    *   @method getLocalizedDate
    *   @param {String} utcDateString - a UTC date
    *   @return {String} Localized date
    */
    discernAlertsVM.prototype.getLocalizedDate = function (utcDateString) {
        return mp_util.getLocalizedDate(utcDateString, system.getModuleId(this));
    };

    discernAlertsVM.prototype.detached = function (node, parentNode, viewModelReference) {
        this.discernAlerts = null;
        viewModelReference = null;
    };

    // return a new instance of the view model every time it is loaded
    return discernAlertsVM;


});