define(['knockout'], function (ko) {

    var synonymsVM = function () {
        /***
        *   Array of available synonyms
        */
        this.availableSynonyms = ko.observableArray([]);
    };

    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the clinical lab events for the patient.
    *   @method activate
    *   @params {Object} patientData - patient data passed in via the view
    */
    synonymsVM.prototype.activate = function (patientData) {
        if (patientData)
            this.availableSynonyms(patientData.COLSYNQUAL);
    };

    /***
    *   Function to get details of the current synonym
    *   @method getSynonymDetail
    *   @param {Object} currentSynonym
    */
    synonymsVM.prototype.getSynonymDetail = function (currentSynonym) {
        if (currentSynonym) {
            return currentSynonym.COLSYNEVENTDISP + ": " + currentSynonym.COLSYNSIMPCLINDISP;
        }

        return "";
    };

    synonymsVM.prototype.detached = function (node, parentNote, viewModelReference) {
        this.availableSynonyms = null;
        viewModelReference = null;
    };

    return synonymsVM;
});