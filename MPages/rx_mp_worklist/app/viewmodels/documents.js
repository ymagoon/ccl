define(['durandal/system', 'knockout', 'mpages/mp_util', 'i18next'], function (system, ko, mp_util, i18n) {
    /*
    *   A private function to get the documents that must be displayed
    *   @method getDocumentsToDisplay
    *   @param {Array} availableDocuments
    *   @param {Integer} maximumLimit - maximum number of documents to display
    *   @return {Array} validDocuments - array of valid documents
    */
    function getDocumentsToDisplay(availableDocuments, maximumLimit) {
        var validDocuments = [];
        if (availableDocuments && mp_util.isArray(availableDocuments) && mp_util.isNumber(maximumLimit)) {
            var totalDocuments = availableDocuments.length;
            var currentDocDate = null;
            var previousDocDate = null;
            var currentDocumentInfo = null;
            var currentDocEventCd = 0.0;
            var previousDocEventCd = 0.0;
            // set the below two fields so that the first document is rendered
            var renderDocument = false;
            var renderedDocumentCount = 0;

            for (var documentIndex = 0; documentIndex < totalDocuments; documentIndex++) {
                currentDocumentInfo = availableDocuments[documentIndex];
                currentDocEventCd = currentDocumentInfo.COLDOCEVENTCD;
                currentDocDate = currentDocumentInfo.COLDOCDTDISP;

                // if it is a redundant record, ignore it. Otherwise, render it.
                if (previousDocEventCd === currentDocEventCd && currentDocDate === previousDocDate) {
                    continue;
                } else {
                    renderedDocumentCount++;
                    renderDocument = true;
                }

                if (renderDocument) {
                    if (renderedDocumentCount <= maximumLimit) {
                        validDocuments.push(currentDocumentInfo);
                    } else {
                        break;
                    }
                }

                previousDocEventCd = currentDocEventCd;
                previousDocDate = currentDocDate;
                renderDocument = false;
            }


        }
        return validDocuments;
    }

    var documentsVM = function () {
        /*
        *   An observable array to store all documents of the patient
        */
        this.documents = ko.observableArray([]);
    };

    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the documents for the patient.
    *   @method activate
    *   @params {Object} patientDetails - patient data passed in via the view
    */
    documentsVM.prototype.activate = function (patientDetails) {
        if (patientDetails)
            this.documents(getDocumentsToDisplay(patientDetails.COLDOCQUAL, patientDetails.COLDOCTYPECNT));
    };

    /*
    *   Retrieves the localized date
    *   @method getLocalizedDate
    *   @param {String} utcDateString - a UTC date
    *   @return {String} Localized date
    */
    documentsVM.prototype.getLocalizedDate = function (utcDateString) {
        return mp_util.getLocalizedDate(utcDateString, system.getModuleId(this));
    };

    documentsVM.prototype.detached = function (node, parentNode, viewModelReference) {
        this.documents = null;
        viewModelReference = null;
    };

    return documentsVM;


});