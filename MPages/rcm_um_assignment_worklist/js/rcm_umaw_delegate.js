/**
 * Defines a Millennium service delegate for the um assignment worklist.
 *
 * @author Eric Amavizca (ea026644)
 */
var UMAssignmentWorklistDelegate = {

    getPatientLists: function() {
        var sendAr = [];
        sendAr.push("^MINE^", "0.0", "^GetUMAssignmentPatientLists^", "^^");
        var info = new XMLCclRequest();
        info.onreadystatechange = function() {
            if (info.readyState === 4 && info.status === 200) {
                //responseText will always be uri encoded using RCM_JSON_SERVICE, so decode it before parsing so we don't have to do it later.
                var jsonEval = JSON.parse(decodeURIComponent(info.responseText));
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS === "S") {
                    patientLists = recordData.serviceData;
                } else {
                    patientLists = null;
                }
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
        };
        info.open('GET', "RCM_JSON_SERVICE", 0);
        info.send(sendAr.join(","));
        return patientLists;
    },

    getWorklist: function() {
        var jsonRequest = {
            "selectedPatientList": {
                "name": umaw.selectedPatientList.patientList.name,
                "id": umaw.selectedPatientList.patientList.id,
                "typeCd": umaw.selectedPatientList.patientList.typeCd,
                "arguments": umaw.selectedPatientList.patientList.arguments,
                "encounterTypes": umaw.selectedPatientList.patientList.encounterTypes,
                "displaySequence": umaw.selectedPatientList.patientList.displaySequence
            },
            "encounterTypeCds": umaw.selectedPatientList.workListDefaults.encounterTypeCds,
            "payerIds": RCM_UMAW_Filters.getPayerFilterIds(),
            "careManagerRelation": umaw.selectedPatientList.workListDefaults.careManagerRelationship,
            "careManagerId": umaw.selectedPatientList.workListDefaults.careManagerId,
            "primarySortColumnNameKey": umaw.selectedPatientList.workListDefaults.primarySortColumn,
            "primarySortAscending": !umaw.selectedPatientList.workListDefaults.isPrimaryDescendingSort,
            "secondarySortColumnNameKey": umaw.selectedPatientList.workListDefaults.secondarySortColumn,
            "secondarySortAscending": !umaw.selectedPatientList.workListDefaults.isSecondaryDescendingSort,
            "financialClassCds": umaw.selectedPatientList.workListDefaults.financialClassCds,
            "nextClinicalReviewDateRange": umaw.selectedPatientList.workListDefaults.nextClinicalReviewDateRange,
            "UMStatusCd": umaw.selectedPatientList.workListDefaults.UMStatusCd,
            "authStatusCd": umaw.selectedPatientList.workListDefaults.authStatusCd,
            "isClosedUMReviews": umaw.selectedPatientList.workListDefaults.isClosedUMReviews,
            "isNoNextClinicalReview": umaw.selectedPatientList.workListDefaults.isClosedClinicalReviews
        };

        var sendAr = [];
        sendAr.push("^MINE^", "0.0", "^GetUMAssignmentWorkList^", "^" + this.stringifyJSON(jsonRequest) + "^");
        var info = new XMLCclRequest();
        var worklistData = null;
        info.onreadystatechange = function() {
            if (info.readyState === 4 && info.status === 200) {
                var jsonEval = JSON.parse(decodeURIComponent(info.responseText));
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS === "S") {
                    worklistData = recordData.serviceData;
                } else {
                    umaw.openDialog(i18n.UMAW_GENERIC_ERROR_TITLE, i18n.UMAW_GET_DATA_ERROR);
                    return null;
                }
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
        };
        info.open('GET', "RCM_JSON_SERVICE", 0);
        info.send(sendAr.join(","));
        return worklistData;
    },

    saveFilters: function() {

        var jsonRequest = {
            "patientListName": umaw.selectedPatientList.workListDefaults.patientListName,
            "encounterTypeCds": umaw.selectedPatientList.workListDefaults.encounterTypeCds,
            "payers": umaw.selectedPatientList.workListDefaults.payers,
            "careManagerRelationship": umaw.selectedPatientList.workListDefaults.careManagerRelationship,
            "careManagerId": umaw.selectedPatientList.workListDefaults.careManagerId,
            "primarySortColumn": umaw.selectedPatientList.workListDefaults.primarySortColumn,
            "isPrimaryDescendingSort": umaw.selectedPatientList.workListDefaults.isPrimaryDescendingSort,
            "secondarySortColumn": umaw.selectedPatientList.workListDefaults.secondarySortColumn,
            "isSecondaryDescendingSort": umaw.selectedPatientList.workListDefaults.isSecondaryDescendingSort,
            "financialClassCds": umaw.selectedPatientList.workListDefaults.financialClassCds,
            "nextClinicalReviewDateRange": umaw.selectedPatientList.workListDefaults.nextClinicalReviewDateRange,
            "UMStatusCd": umaw.selectedPatientList.workListDefaults.UMStatusCd,
            "authStatusCd": umaw.selectedPatientList.workListDefaults.authStatusCd,
            "isClosedUMReviews": umaw.selectedPatientList.workListDefaults.isClosedUMReviews,
            "isClosedClinicalReviews": umaw.selectedPatientList.workListDefaults.isClosedClinicalReviews
        };

        var sendAr = [];
        sendAr.push("^MINE^", "0.0", "^SaveUMAssignmentDefaults^", "^" + this.stringifyJSON(jsonRequest) + "^");
        var info = new XMLCclRequest();
        var worklistData = null;
        info.onreadystatechange = function() {
            if (info.readyState === 4 && info.status === 200) {
                //responseText will always be uri encoded using RCM_JSON_SERVICE, so decode it before parsing so we don't have to do it later.
                var jsonEval = JSON.parse(decodeURIComponent(info.responseText));
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS === "S") {
                    worklistData = recordData.serviceData;
                } else {
                    umaw.openDialog(i18n.UMAW_GENERIC_ERROR_TITLE, i18n.UMAW_SAVE_FILTERS_FAILED_MESSAGE);
                }
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
        };
        info.open('GET', "RCM_JSON_SERVICE", 0);
        info.send(sendAr.join(","));
        return worklistData;
    },

    updateCareManagers: function(updateMap, successHandler) {

        var jsonRequest = {
            maintainAssignmentWorkListItems: []
        };
        $.each(updateMap, function(i, val) {
            jsonRequest.maintainAssignmentWorkListItems.push(val);
        });

        var sendAr = [];
        sendAr.push("^MINE^", "0.0", "^SaveUMAssignmentPersonnel^", "^" + this.stringifyJSON(jsonRequest) + "^");
        var info = new XMLCclRequest();
        var status = null;
        info.onreadystatechange = function() {
            if (info.readyState === 4 && info.status === 200) {
                //responseText will always be uri encoded using RCM_JSON_SERVICE, so decode it before parsing so we don't have to do it later.
                var jsonEval = JSON.parse(decodeURIComponent(info.responseText));
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS === "S") {
                    successHandler(recordData.serviceData.encounterResults);
                } else {
                    var exceptionType = recordData.exceptionInformation ? recordData.exceptionInformation.exceptionType : "";
                    if (exceptionType === "STALE_DATA") {
                        umaw.openDialog(i18n.UMAW_STALE_DATA_TITLE, i18n.UMAW_STALE_DATA_MESSAGE);
                    } else if (exceptionType === "NO_MANAGER_AUTHORIZATION") {
                        umaw.openDialog(i18n.UMAW_NO_AUTH_TITLE, i18n.UMAW_NO_AUTH_MESSAGE);
                    } else {
                        umaw.openDialog(i18n.UMAW_GENERIC_ERROR_TITLE, i18n.UMAW_GENERIC_ERROR_MESSAGE);
                    }
                }
                try {
                    info.cleanup();
                } catch (err) {
                    //Used to catch case in old mpages where cleanup function does not exist.
                }
            }
        };
        info.open('GET', "RCM_JSON_SERVICE", 0);
        info.send(sendAr.join(","));
    },

    stringifyJSON: function(jsonObject) {
        return JSON.stringify(jsonObject, function(key, value) {
            if ( typeof value === "string") {
                return encodeURIComponent(value);
            }
            return value;
        });
    }
};