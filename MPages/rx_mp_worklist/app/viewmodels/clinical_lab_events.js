define(['durandal/system', 'knockout', 'services/model', 'mpages/mp_util'], function (system, ko, model, mp_util) {
    /*  
    *   Module level private variables
    */
    var imageMap = model.imageMap;
    var CSSMap = model.CSSMap;



    // The View Model
    var clinicalLabEventsVM = function () {
        /*
        *   An observable array to store the clinical lab events
        */
        this.clinicalLabEvents = ko.observableArray([]);
    };

    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the clinical lab events for the patient.
    *   @method activate
    *   @params {Object} patientData - patient data passed in via the view
    */
    clinicalLabEventsVM.prototype.activate = function (patientData) {
        if (patientData)
            this.clinicalLabEvents(patientData.COLCELABQUAL);
    };


    /*
    *   A function to decide if an image has to be shown on the view
    *   @method isImageVisible
    *   @params {Object} cdfMeaning - The CDF meaning of the clinical event. Only if the CDF meaning is
    *                               present in the css and image maps, the image will be shown
    *   @returns {Boolean}
    */
    clinicalLabEventsVM.prototype.isImageVisible = function (cdfMeaning) {
        if (cdfMeaning) {
            var currentCDFMeaning = cdfMeaning.toUpperCase();
            if (CSSMap.hasOwnProperty(currentCDFMeaning) && imageMap.hasOwnProperty(currentCDFMeaning)) {
                return true;
            }
        }

        return false;
    };

    /*
    *   Function to retrieve the appropriate image path based on CDF meaning of the event
    *   @method getImage
    *   @params {String} cdfMeaning - CDF meaning of the event
    *   @return {String} The image path
    */
    clinicalLabEventsVM.prototype.getImage = function (cdfMeaning) {
        if (cdfMeaning) {
            var currentCDFMeaning = cdfMeaning.toUpperCase();
            if (imageMap.hasOwnProperty(currentCDFMeaning)) {
                return imageMap[currentCDFMeaning];
            }
        }
    };

    /*
    *   Function to retrieve the appropriate css class based on CDF meaning of the event
    *   @method getCssClass
    *   @params {String} cdfMeaning - CDF meaning of the event
    *   @return {String} The CSS class.
    */
    clinicalLabEventsVM.prototype.getCssClass = function (cdfMeaning) {
        if (cdfMeaning) {
            var currentCDFMeaning = cdfMeaning.toUpperCase();

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
    clinicalLabEventsVM.prototype.getLocalizedDate = function (utcDateString) {
        return mp_util.getLocalizedDate(utcDateString, system.getModuleId(this));
    };

    /*
    *   Retrieves the localized numerical lab value
    *   @method getLocalizedValue
    *   @param {String} numeric value 
    *   @return {String} localized and formatted numeric value
    */
    clinicalLabEventsVM.prototype.getLocalizedValue = function (labValue) {
        return mp_util.getLocalizedValue(labValue);
    };

    clinicalLabEventsVM.prototype.detached = function (node, parentNode, viewModelReference) {
        this.clinicalLabEvents = null;
        viewModelReference = null;
    };


    return clinicalLabEventsVM;


});