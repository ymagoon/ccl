define(['knockout', 'services/model', 'i18next', 'durandal/system', 'mpages/logger', 'mpages/mp_util'], function (ko, model, i18n, system, logger, mp_util) {

    /*  
    *   Module level private variables
    */
    var imageMap = model.imageMap;
    var CSSMap = model.CSSMap;

    /*
    *   Retrieves the CDF Meaning of the current event depending on what qualifications apply
    *   @method getCDFMeaning
    *   @param {Object} currentEvent
    *   @return {String} currentCDFMeaning - returns the current CDF meaning
    */
    function getCDFMeaning(currentEvent) {
        var currentCDFMeaning = "";
        try {
            if (currentEvent) {
                currentCDFMeaning = currentEvent.LABCDFMEANING.toUpperCase();
                var isLabHigh = currentEvent.LABHIGH;
                var isLabLow = currentEvent.LABLOW;

                if (isLabHigh) {
                    currentCDFMeaning = "HIGH";
                } else if (isLabLow) {
                    currentCDFMeaning = "LOW";
                }
            }
        } catch (error) {
            logger.logError(i18n.t('app:modules.logMessage.CDF_MEANING_FAILED'), currentEvent, system.getModuleId(this) + " - getCDFMeaning", false);
        }

        return currentCDFMeaning;
    }

    var laboratoryEventsVM = function () {
        /*
        *   An observable array to store the lab events
        */
        this.labEvents = ko.observableArray([]);
    };

    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the clinical lab events for the patient.
    *   @method activate
    *   @params {Object} patientData - patient data passed in via the view
    */
    laboratoryEventsVM.prototype.activate = function (patientData) {
        this.labEvents(patientData.COLLABQUAL);
    };

    /*
    *   A function to decide if an image has to be shown on the view
    *   @method isImageVisible
    *   @params {Objec} currentEvent 
    *   @returns {Boolean}
    */
    laboratoryEventsVM.prototype.isImageVisible = function (currentEvent) {
        if (currentEvent) {
            var currentCDFMeaning = getCDFMeaning(currentEvent);

            if (CSSMap.hasOwnProperty(currentCDFMeaning) && imageMap.hasOwnProperty(currentCDFMeaning)) {
                return true;
            }
        }

        return false;
    };

    /*
    *   Function to retrieve the appropriate image path based on CDF meaning of the event
    *   @method getImage
    *   @params {String} currentEvent 
    *   @return {String} The image path
    */
    laboratoryEventsVM.prototype.getImage = function (currentEvent) {
        if (currentEvent) {
            var currentCDFMeaning = getCDFMeaning(currentEvent);

            if (imageMap.hasOwnProperty(currentCDFMeaning)) {
                return imageMap[currentCDFMeaning];
            }
        }
    };

    /*
    *   Function to retrieve the appropriate css class based on CDF meaning of the event
    *   @method getCssClass
    *   @params {String} currentEvent
    *   @return {String} The CSS class.
    */
    laboratoryEventsVM.prototype.getCssClass = function (currentEvent) {
        if (currentEvent) {
            var currentCDFMeaning = getCDFMeaning(currentEvent);

            if (CSSMap.hasOwnProperty(currentCDFMeaning)) {
                return CSSMap[currentCDFMeaning];
            }

            return CSSMap.DEFAULT;
        }
    };

    /*
    *   Retrieves the localized date
    *   @method getLocalizedDate
    *   @param {String} utcDateString - a UTC date
    *   @return {String} Localized date
    */
    laboratoryEventsVM.prototype.getLocalizedDate = function (utcDateString) {
        return mp_util.getLocalizedDate(utcDateString, system.getModuleId(this));
    };


    /*
    *   Retrieves the localized numerical lab value
    *   @method getLocalizedValue
    *   @param {String} numeric value 
    *   @return {String} localized and formatted numeric value
    */
    laboratoryEventsVM.prototype.getLocalizedValue = function (labValue) {
        return mp_util.getLocalizedValue(labValue);
    };

    laboratoryEventsVM.prototype.detached = function (node, parentNode, viewModelReference) {
        this.labEvents = null;
        viewModelReference = null;
    };

    return laboratoryEventsVM;


});