define(['durandal/system', 'knockout', 'mpages/mp_util', 'i18next', 'mpages/logger'], function (system, ko, mp_util, i18n, logger) {
    // The view model
    var administrationEventsVM = function () {
        /*
        *   An observable array to store the administration events of the patient
        */
        this.administrationEvents = ko.observableArray([]);

    };

    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the administration events for the patient.
    *   @method activate
    */
    administrationEventsVM.prototype.activate = function (patientData) {
        if (patientData)
            this.administrationEvents(patientData.COLADMEVENTQUAL);
    };


    /*
    *   Retrieves the localized date
    *   @method getLocalizedDate
    *   @param {String} utcDateString - a UTC date
    *   @return {String} Localized date
    */
    administrationEventsVM.prototype.getLocalizedDate = function (utcDateString) {
        return mp_util.getLocalizedDate(utcDateString, system.getModuleId(this));
    };

    /*
    *   Function to format and retrieve the details of administration events
    *   @method getEventDetails
    *   @param {Object} currentEvent - passed in through the view
    *   @return {String} formatted event details
    */
    administrationEventsVM.prototype.getEventDetails = function (currentEvent) {
        var eventDetails = '';
        try {
            if (currentEvent) {
                var localizedValue = mp_util.getLocalizedValue(currentEvent.COLADMEVENTVALUE);
                eventDetails = localizedValue + ' ' + currentEvent.COLADMEVENTUNIT + '; ' + currentEvent.COLADMEVENTROUTE + '; ' + currentEvent.COLADMEVENTSITE + '; ';
            }
        } catch (error) {
            logger.log(i18n.t('app:modules.logMessage.EVENT_DETAILS_FAILED'), currentEvent, system.getModuleId(this) + ' - getEventDetails', false);
            throw error;
        }
        return eventDetails;
    };

    administrationEventsVM.prototype.detached = function (node, parentNode, viewModelReference) {
        this.administrationEvents = null;
        viewModelReference = null;
    };

    // return a new instance of the view model every time it is loaded
    return administrationEventsVM;


});