var RCM_Worklist = function(criterion){

    var imageLocFlag;
    var imageLocDeleteUp;
    var imageLocDeleteOver;
    var imageLocEditOver;
    var imageLocEditUp;
    var noteImage;
    var newNoteImage;
    var quickChartImage;
    var chartFormImage;
    var medAdminImage;
    var labImage;
    var taskActionDropdownImage;
    var noTaskImage;
    var spinnerImage;

    //This variable is used to control what we want to display and for grouping risk categories and risk factors.
    var supportedRiskOutcomes = {
        categories: [{
            categoryName: rcm_discharge_i18n.RCM_AC_DEMOGRAPHICS_HDR,
            factors: [{
                factorName: "AGE_IN_YEARS",
                factorHeader: rcm_discharge_i18n.RCM_AC_AGE_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "INSURANCE",
                factorHeader: rcm_discharge_i18n.RCM_AC_INSURANCE_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }]
        }, {
            categoryName: rcm_discharge_i18n.RCM_AC_UTILITY_HDR,
            factors: [{
                factorName: "AMA_HISTORY",
                factorHeader: rcm_discharge_i18n.RCM_AC_AMA_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "ACUITY",
                factorHeader: rcm_discharge_i18n.RCM_AC_ACUITY_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "SNF_ADMIT_SOURCE",
                factorHeader: rcm_discharge_i18n.RCM_AC_SNF_ADMIT_SOURCE_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "ER_IN_LAST_SIX_MONTHS",
                factorHeader: rcm_discharge_i18n.RCM_AC_ER_IN_LAST_SIX_MONTHS_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "INPATIENT_IN_LAST_SIX_MONTHS",
                factorHeader: rcm_discharge_i18n.RCM_AC_INPATIENT_IN_LAST_SIX_MONTHS_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "OBSERVATION_IN_LAST_SIX_MONTHS",
                factorHeader: rcm_discharge_i18n.RCM_AC_OBSERVATION_IN_LAST_SIX_MONTHS_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }]
        }, {
            categoryName: rcm_discharge_i18n.RCM_AC_HP_HDR,
            factors: [{
                factorName: "BMI",
                factorHeader: rcm_discharge_i18n.RCM_AC_BMI_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "COMORBIDITY_INDEX",
                factorHeader: rcm_discharge_i18n.RCM_AC_COMORBIDITY_INDEX_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }]
        }, {
            categoryName: rcm_discharge_i18n.RCM_AC_MEDICATION_HDR,
            factors: [{
                factorName: "POLYPHARMACY",
                factorHeader: rcm_discharge_i18n.RCM_AC_POLYPHARMACY_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "DIURETICS_CURRENT",
                factorHeader: rcm_discharge_i18n.RCM_AC_DIURETICS_CURRENT_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "DIURETICS_HISTORY",
                factorHeader: rcm_discharge_i18n.RCM_AC_DIURETICS_HISTORY_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "INSULIN_CURRENT",
                factorHeader: rcm_discharge_i18n.RCM_AC_INSULIN_CURRENT_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "INSULIN_HISTORY",
                factorHeader: rcm_discharge_i18n.RCM_AC_INSULIN_HISTORY_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "HEPARIN_CURRENT",
                factorHeader: rcm_discharge_i18n.RCM_AC_HEPARIN_CURRENT_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "PLATELET_AG_CURRENT",
                factorHeader: rcm_discharge_i18n.RCM_AC_PLATELET_AG_CURRENT_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }, {
                factorName: "PLATELET_AG_HISTORY",
                factorHeader: rcm_discharge_i18n.RCM_AC_PLATELET_AG_HISTORY_LBL,
                factorValue: rcm_discharge_i18n.RCM_MISSING_DATA
            }]
        }]
    };

    function getNoteSpliceIndex(note, notes){
        var i = notes.length;
        while(i--){
            //note.ID can either be in the form X.XXXXXXXE7 or XXXXXXXX
            if(notes[i].ID === note.ID || notes[i].ID == parseInt(note.ID, 10)){
                return i;
            }
        }
        return -1;
    }

    return {
        "worklistHTMLArray": [],
        "loc": "",
        "dcworklistChangeDialog": null,
        "dcworklistNoteHover": null,
        "dcworklistModifyHover": null,
        "dcworklistModifyHoverMenu": null,
        "dcworklistNoteExtra": null,
        "dcworklistReadOnlyDialog": null,
        "personInfo": [],
        "providerSearchControl": null,
        "dischargeRelationship": [],
        "originalManagersRelOne":[],
        "originalManagersRelTwo": [],
        "listOfAllManagers": [],
        "canAddRel":0,
        "canUnassignRel":0,
        "statusCodes": [],
        "expandedSummaryRow":null,
        "detailRow":null,
        "expandedSummaryImage":null,
        "collapsedImageFile":null,
        "expandedImageFile":null,
        "worklistItemCount":0,
        "canModDischarge" : null,
        "hovered": false,
        "noteTaskAccess": 0,
        "notesToShow": 2,
        "noteTypes": {},
        "worklistItems": [],
        "patientListID": null,
        "discernOrderLabel": "",
        "patReltTypeConfig": [],
        "orderDetails": {},
        "orderDetailsLoaded":false,
        "pageLink": "",
        "ribbonSettings": {},
        "isDueDateTimeEnabled": false,
        "referrals": [],

        /**
        * Function to initialize the worklist
        */
        initialize: function(component, selectedPatientListJson, criterion, appliedFilters){
            this.component = component;
            this.criterion = criterion;
            this.loc = this.criterion.static_content;
            imageLocFlag = this.loc + "\\images\\4948_flat16.png";
            imageLocDeleteUp = this.loc + "\\images\\6457_up_16.png";
            imageLocDeleteOver = this.loc + "\\images\\6457_over_16.png";
            imageLocEditOver = this.loc + "\\images\\6250_16.png";
            imageLocEditUp = this.loc + "\\images\\6250_grayscale_16.png";
            noteImage = this.loc + "\\images\\4972.gif";
            newNoteImage = this.loc + "\\images\\5153.ico";
            quickChartImage = this.loc + "\\images\\5258_16.png";
            chartFormImage = this.loc + "\\images\\65445.png";
            medAdminImage = this.loc + "\\images\\4926_16.gif";
            labImage = this.loc + "\\images\\5547_16.png";
            taskActionDropdownImage = this.loc + "\\images\\5322_down.png";
            noTaskImage = this.loc + "\\images\\4018_disabled.gif";
            spinnerImage = this.loc + "\\images\\6439_48.gif";
            this.popOutTopImage = this.loc + "\\images\\popOutTop3.gif";
            this.collapsedImageFile = this.loc + "\\images\\5323_collapsed_16.png";
            this.expandedImageFile = this.loc + "\\images\\5323_expanded_16.png";
            this.appliedFilters = appliedFilters;
            this.patientListID = selectedPatientListJson.getWorklistReq.PATIENTLIST_ID;
            document.cookie = "rcm_drwl_pl=" + this.patientListID;
            var json = "^" + JSON.stringify(selectedPatientListJson) + "^";
            var program = "rcm_discharge_worklist";
            var paramAr = [];
            paramAr.push("^MINE^", "0.0", "^GETWORKLISTSORTED^", json);
            var recordData = this.makeTimerCall(this.component, program, paramAr, 0);
            this.worklistHTMLArray = [];

            if ((recordData === undefined) || (recordData.WORKLIST_ITEMS === undefined)) {
                this.worklistHTMLArray.push("<div id='tableDiv'>");
                this.worklistHTMLArray.push(this.getErrorTableHTML());
                this.worklistHTMLArray.push("</div>");
            }
            else {
                $.each(recordData.NOTETYPECDS, function(i, val){
                    RCM_Worklist.noteTypes[val.VALUE] = {
                        "display": val.DISPLAY,
                        "onlyImportant": val.ONLY_IMPORTANT_IND
                    };
                });
                this.loadReferrals(recordData.WORKLIST_ITEMS);
                this.ribbonSettings = {
                    isEddOn: recordData.PLANNEDDISCHARGEDATEIND,
                    eddAlertInd: recordData.PLANNEDDISCHARGEALERTIND,
                    eddWarnThreshold: recordData.PLANNEDDISCHARGETHRESHOLD ? parseInt(recordData.PLANNEDDISCHARGETHRESHOLD) : null,
                    isAuthOn: recordData.AUTHORIZATIONDATEIND,
                    authAlertInd: recordData.AUTHORIZATIONALERTIND,
                    authWarnThreshold: recordData.AUTHORIZATIONTHRESHOLD ? parseInt(recordData.AUTHORIZATIONTHRESHOLD) : null,
                    isElosOn: recordData.ESTIMATEDLENGTHOFSTAYDATEIND,
                    elosAlertInd: recordData.ESTIMATEDLENGTHOFSTAYALERTIND,
                    elosWarnThreshold: recordData.ESTIMATEDLENGTHOFSTAYTHRESHOLD ? parseInt(recordData.ESTIMATEDLENGTHOFSTAYTHRESHOLD) : null
                };
                this.canModDischarge = recordData.CANMODIFYDISCHARGEIND;
                this.canAddRel = recordData.CANASSIGNRELATIONSHIPIND;
                this.canUnassignRel = recordData.CANUNASSIGNRELATIONSHIPIND;
                this.noteTaskAccess = recordData.CANMODIFYNOTEIND;
                this.worklistItems = recordData.WORKLIST_ITEMS;
                this.isDueDateTimeEnabled = recordData.DUE_DATE_TIME_IND;
                this.worklistHTMLArray.push(this.renderFaxFailedDialog(this.getFaxFailures(this.worklistItems)));
                this.statusCodes = recordData.DISCHARGEPLANSTATUSCDS;
                this.discernOrderLabel = recordData.DISCERNORDERLABEL;
                this.pageLink = recordData.ORGANIZATIONLEVELLINK;
                this.patReltTypeConfig = recordData.PAT_PRSNL_RELTN_TYPE_CONFIGS;
                this.worklistHTMLArray.push(this.renderRCMTable(this.worklistItems));
                var orderDetailsCriteria = [];
                $.each(recordData.WORKLIST_ITEMS, function(i, item){
                    $.each(item.DISCHARGE_ORDERS.concat(item.CONSULT_ORDERS).concat(item.DISCERN_ORDERS), function(j, order){
                        orderDetailsCriteria.push({
                            "orderId": parseFloat(order.ID),
                            "orderingProviderId": parseFloat(order.ORDERINGPROVIDERID)
                        });
                    });
                });
                if(orderDetailsCriteria.length > 0)
                {
                    var request = {"orderDetailsCriteria": orderDetailsCriteria};
                    var json = "^" + JSON.stringify(request) + "^";
                    var program = "RCM_JSON_SERVICE";
                    var paramAr = [];
                    paramAr.push("^MINE^", "0.0", "^GetOrderDetailsByOrderIds^", json);
                    var orderDetailsRecordData = this.makeTimerCall(this.component, program, paramAr, 0, true);
                    if(orderDetailsRecordData) {
                        RCM_Worklist.orderDetails = orderDetailsRecordData.serviceData;
                        this.orderDetailsLoaded = true;
                    }
                    else {
                        RCM_Worklist.openLoadOrderDetailsErrorDialog();
                    }
                }
            }
        },

        loadReferrals: function (worklistItems) {
            var encounterIds = [];
            $.each(worklistItems, function (i, item) {
                encounterIds.push(parseFloat(item.ENCOUNTER_ID));
            });
            if (encounterIds.length > 0) {
                var request = { "encounterIds": encounterIds};
                var json = "^" + JSON.stringify(request) + "^";
                var program = "RCM_JSON_SERVICE";
                var paramAr = ["^MINE^", "0.0", "^GetPatientReferrals^", json];

                var referralData = RCM_Worklist.makeTimerCall(RCM_Worklist.component, program, paramAr, 0, true);
                RCM_Worklist.makeCAPTimerCall('CAP:RCM_NAVI_WL_LOAD_PROV_01', RCM_Worklist.component.getCriterion().category_mean);
                if (referralData) {
                    RCM_Worklist.referrals = referralData.serviceData;
                    RCM_Worklist.referralsLoaded = true;
                } else {
                    RCM_Worklist.openLoadReferralsErrorDialog();
                }
            } else {
                RCM_Worklist.referrals = [];
            }
        },

      /**
        * loads patient list
        */
        loadNewPatientList: function(selectedPatientListJson, appliedFilters){
            this.appliedFilters = appliedFilters;
            this.patientListID = selectedPatientListJson.getWorklistReq.PATIENTLIST_ID;
            document.cookie = "rcm_drwl_pl=" + this.patientListID;
            var json = "^" + JSON.stringify(selectedPatientListJson) + "^";
            var program = "rcm_discharge_worklist";
            var paramAr = [];
            paramAr.push("^MINE^", "0.0", "^GETWORKLISTSORTED^", json);
            var recordData = this.makeCall(program, paramAr, 0);
            RCM_Worklist.noteTypes = {};

            if ((recordData === undefined) || (recordData.WORKLIST_ITEMS === undefined)) {
                document.getElementById('tableDiv').innerHTML = this.getErrorTableHTML();
            }
            else {

                this.noteTaskAccess = recordData.CANMODIFYNOTEIND;
                $.each(recordData.NOTETYPECDS, function(i, val) {
                    RCM_Worklist.noteTypes[val.VALUE] = {
                        "display": val.DISPLAY,
                        "onlyImportant": val.ONLY_IMPORTANT_IND
                    };
                });
                this.worklistItems = recordData.WORKLIST_ITEMS;
                var parent = document.getElementById('worklistDiv');
                if (parent) {
                    var workListFailedFax = document.getElementById('worklist-failed-fax');
                    if (workListFailedFax) {
                        parent.removeChild(workListFailedFax);
                    }
                    var failedFaxAlert = this.renderFaxFailedDialog(this.getFaxFailures(this.worklistItems));
                    parent.innerHTML = failedFaxAlert + parent.innerHTML;
                }
                this.statusCodes = recordData.DISCHARGEPLANSTATUSCDS;
                this.discernOrderLabel = recordData.DISCERNORDERLABEL;
                this.patReltTypeConfig = recordData.PAT_PRSNL_RELTN_TYPE_CONFIGS;
                document.getElementById('tableDiv').innerHTML = this.loadTable(this.worklistItems);
                var orderDetailsCriteria = [];

                $.each(recordData.WORKLIST_ITEMS, function(i, item){
                    $.each(item.DISCHARGE_ORDERS.concat(item.CONSULT_ORDERS).concat(item.DISCERN_ORDERS), function(j, order){
                        orderDetailsCriteria.push({"orderId": parseFloat(order.ID), "orderingProviderId": parseFloat(order.ORDERINGPROVIDERID)});
                    });
                });
                if(orderDetailsCriteria.length > 0)
                {
                    var request = {"orderDetailsCriteria": orderDetailsCriteria};
                    var json = "^" + JSON.stringify(request) + "^";
                    var program = "RCM_JSON_SERVICE";
                    var paramAr = [];
                    paramAr.push("^MINE^", "0.0", "^GetOrderDetailsByOrderIds^", json);
                    var orderDetailsRecordData = this.makeTimerCall(this.component, program, paramAr, 0, true);
                    if(orderDetailsRecordData){
                        RCM_Worklist.orderDetails = orderDetailsRecordData.serviceData;
                        this.orderDetailsLoaded = true;
                    }
                    else{
                        RCM_Worklist.openLoadOrderDetailsErrorDialog();
                    }
                }
            }

            setVisitReasonMaximumWidth();
        },

        getWorklistHTML: function(){
            var worklistHTML = this.worklistHTMLArray.join("");
            return worklistHTML;
        },

        getWorklistItemCount: function(){
            return this.worklistItemCount;
        },
        /**
        * Makes backend call
        */
        makeCall: function(program, paramAr, async){
            var returnValue;
            var info = new XMLCclRequest();
            info.onreadystatechange = function(){
                if (info.readyState == 4 && info.status == 200) {
                    try {
                        var jsonEval = JSON.parse(info.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        if (recordData.STATUS_DATA.STATUS == "Z") {
                            //TODO HANDLE
                            var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                        }
                        else
                            if (recordData.STATUS_DATA.STATUS == "S") {
                                returnValue = recordData;
                            }
                            else {
                                var errAr = [];
                                var statusData = recordData.STATUS_DATA;
                                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                                    var ss = statusData.SUBEVENTSTATUS[x];
                                    errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                                }
                                var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                            }
                    }
                    catch (err) {
                        alert(JSON.stringify(err));
                    }
                    finally {
                    }
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                }
                else
                    if (info.readyState == 4 && info.status != 200) {
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                }
            };
            info.open('GET', program, async);
            info.send(paramAr.join(","));
            return returnValue;
        },

        /**
        * makes time backend call
        */
        makeTimerCall: function(component, program, paramAr, async, isURIEncoded){
            var usrTimerName = "USR:MPG.RCM.DischargeReviewWorklist";
            switch (paramAr[2].toLowerCase()) {
                case "^getorderdetailsbyorderids^":
                    usrTimerName = usrTimerName + " - Get Order Details";
                    break;
                case "^getcloudoutcomes^":
                    usrTimerName = usrTimerName + " - Get Readmission Risk Details";
                    break;
                case "^getworklistdetails^":
                    usrTimerName = usrTimerName + " - Get Worklist Item Details";
                    break;
                case "^getpatientreferrals^":
                    usrTimerName += " - Get Post-Acute Referral Details";
                    break;
                default:
                    usrTimerName = "USR:MPG.DischargeReviewWorklist";
                    break;
            }

            var timerLoadComponent = MP_Util.CreateTimer(usrTimerName, RCM_Worklist.component.getCriterion().category_mean);
            var returnValue;
            var info = new XMLCclRequest();
            info.onreadystatechange = function(){
                if (info.readyState == 4 && info.status == 200) {
                    try {
                        if(isURIEncoded){
                            info.responseText = decodeURIComponent(info.responseText);
                        }
                        var jsonEval = JSON.parse(info.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        if (recordData.STATUS_DATA.STATUS == "Z") {
                            //TODO HANDLE
                            var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                        }
                        else
                            if (recordData.STATUS_DATA.STATUS == "S") {
                                returnValue = recordData;
                            }
                            else {
                                var errAr = [];
                                var statusData = recordData.STATUS_DATA;
                                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                                    var ss = statusData.SUBEVENTSTATUS[x];
                                    errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                                }
                                var countText = (component.isLineNumberIncluded() ? "(0)" : "");
                            }
                    }
                    catch (err) {
                        if (timerLoadComponent) {
                            timerLoadComponent.Abort();
                            timerLoadComponent = null;
                        }
                        alert(JSON.stringify(err));
                    }
                    finally {
                        if (timerLoadComponent) {
                            timerLoadComponent.Stop();
                        }
                    }
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                }
                else
                    if (info.readyState == 4 && info.status != 200) {
                        if (timerLoadComponent) {
                            timerLoadComponent.Abort();
                        }
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                }
            };
            info.open('GET', program, async);
            info.send(paramAr.join(","));
            return returnValue;
        },
        makeCAPTimerCall: function(timerName, categoryMean){
            var capTimer = MP_Util.CreateTimer(timerName, categoryMean);
            if(capTimer){
                capTimer.Stop();
            }
        },
        addCareNote: function(jsonRequest,callback, async){
            var sendAr = [];
            sendAr.push("^MINE^", "0.0", "^ADDCAREMANAGEMENTNOTE^", "^"+JSON.stringify(jsonRequest)+"^");
            RCM_Clinical_Util.makeCCLRequest("rcm_notes", sendAr, async, callback);
        },

        deleteCareNote: function(jsonRequest,callback, async){
            var sendAr = [];
            sendAr.push("^MINE^", "0.0", "^DELETECAREMANAGEMENTNOTE^", "^"+JSON.stringify(jsonRequest)+"^");
            RCM_Clinical_Util.makeCCLRequest("rcm_notes", sendAr, async, callback);
        },

        modifyCareNote: function(jsonRequest,callback, async){
            var sendAr = [];
            sendAr.push("^MINE^", "0.0", "^MODIFYCAREMANAGEMENTNOTE^", "^"+JSON.stringify(jsonRequest)+"^");
            RCM_Clinical_Util.makeCCLRequest("rcm_notes", sendAr, async, callback);
        },

        /**
        * Backend call to modify information
        */
        modifyEncounterInformation: function(jsonRequest){
            var sendAr = [];
            sendAr.push("^MINE^", "0.0", "^MODIFY^", "^" + JSON.stringify(jsonRequest) + "^");
            var reply;
            var info = new XMLCclRequest();
            info.onreadystatechange = function() {
                if (info.readyState === 4 && info.status === 200) {
                    var jsonEval = JSON.parse(info.responseText);
                    var recordData = jsonEval.RECORD_DATA;
                    if(recordData.STATUS_DATA.STATUS === "S"){
                        reply = {
                            status: 0,
                            entityId: "",
                            entityName: "",
                            newEncounterPersonnelReltnIds : recordData.NEWENCOUNTERPERSONNELRELTNIDS
                        };
                    }
                    if (recordData.STATUS_DATA.STATUS === "F") {
                        var exceptions = recordData.EXCEPTIONINFORMATION;
                        if(exceptions.length > 0) {
                            var exception = exceptions[0];
                            switch(exception.EXCEPTIONTYPE) {
                            case "NO_PLANNER_AUTHORIZATION":
                                reply = {
                                    status: 1,
                                    entityId: exception.ENTITYID,
                                    entityName: exception.ENTITYNAME
                                };
                                break;
                            case "NO_DISCHARGE_RELTN_AUTHORIZATION":
                                reply = {
                                    status: 1,
                                    entityId: exception.ENTITYID,
                                    entityName: exception.ENTITYNAME
                                };
                                break;
                            case "STALE_DATA":
                                reply = {
                                    status: 2,
                                    entityId: "",
                                    entityName: ""
                                };
                                break;
                            default:
                                reply = {
                                    status: -1,
                                    entityId: "",
                                    entityName: ""
                                };
                            }
                        }
                        else {
                            reply = {
                                status: -1,
                                entityId: "",
                                entityName: ""
                            };
                        }
                    }
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                }
                else if (info.readyState === 4 && info.status !== 200) {
                    reply = {
                        status: -1,
                        entityId: "",
                        entityName: ""
                    };
                    try {
                        info.cleanup();
                    } catch (err) {
                        //Used to catch case in old mpages where cleanup function does not exist.
                    }
                }
            };
            info.open('GET', "RCM_MODIFY_UTILIZATION_MGMT", 0);
            info.send(sendAr.join(","));
            return reply;
        },

       /**
        * Creates hovers for worklsit
        */
        setupHovers: function(){
            var hoverParentElements = $(".DCWorklistHoverParent");
            hoverParentElements.each(function(){
                var hoverParent = $(this).get(0);
                var hoverChild = $(this).children(".DCWorklistHover").get(0);
                hs(hoverParent, hoverChild);
            });
        },
        /**
        *Prints the worklist
        */
        printWorklist: function(isMaxPrintLimitOkay){
            if(this.worklistItems.length < 100 || isMaxPrintLimitOkay)
            {

                $(".printTransparentDiv").css("visibility","visible");
                var itemsArray= [];
                for( var i = 0; i < this.worklistItems.length; i++){

                        var reltnArray= new Array();
                        for( var j = 0; j < this.worklistItems[i].CARE_MGMT_RELTN.length; j++){
                            reltnArray.push({
                                "id": this.worklistItems[i].CARE_MGMT_RELTN[j].ID,
                                "personnelId":this.worklistItems[i].CARE_MGMT_RELTN[j].PERSONNELID,
                                "typeCd":String(Math.round(this.worklistItems[i].CARE_MGMT_RELTN[j].TYPECD)),
                                "typeDisplay":this.worklistItems[i].CARE_MGMT_RELTN[j].TYPEDISPLAY,
                                "nameFull":this.worklistItems[i].CARE_MGMT_RELTN[j].NAMEFULL
                            });
                        }

                        var drgArray=new Array();
                        if(this.worklistItems[i].DRGS.length > 0)
                        {
                            for( var k = 0; k < 1; k++){
                                drgArray.push({
                                    "id": this.worklistItems[i].DRGS[k].ID,
                                    "modifiableIndicator":this.worklistItems[i].DRGS[k].MODIFIABLEINDICATOR ? 1:0,
                                    "sourceIdentifier":this.worklistItems[i].DRGS[k].SOURCEIDENTIFIER,
                                    "description":this.worklistItems[i].DRGS[k].DESCRIPTION,
                                    "estimatedLengthOfStayInHours":this.worklistItems[i].DRGS[k].ESTIMATEDLENGTHOFSTAYINHOURS,
                                    "finalIndicator":this.worklistItems[i].DRGS[k].FINALINDICATOR ? 1:0,
                                    "transferRuleIndicator":this.worklistItems[i].DRGS[k].TRANSFERRULEINDICATOR? 1:0,
                                    "cmWorkingDrgInd":this.worklistItems[i].DRGS[k].CMWORKINGDRGIND ? 1:0,
                                    "contributorSystem":this.worklistItems[i].DRGS[k].CONTRIBUTORSYSTEM,
                                    "sourceVocabularyDisplay":this.worklistItems[i].DRGS[k].SOURCEVOCABULARYDISPLAY
                                });
                            }
                        }
                        var notesArray = new Array();
                        if(this.noteTaskAccess){
                            if(this.worklistItems[i].NOTES.length > 0){
                                for( var j = 0; j <this.worklistItems[i].NOTES.length; j++){
                                    notesArray.push({
                                        "id": this.worklistItems[i].NOTES[j].ID,
                                        "typeCd":this.worklistItems[i].NOTES[j].TYPECD,
                                        "typeDisp":this.worklistItems[i].NOTES[j].TYPEDISP,
                                        "text":this.worklistItems[i].NOTES[j].TEXT,
                                        "priorityMeaning":this.worklistItems[i].NOTES[j].PRIORITYMEANING,
                                        "parentEntityName":this.worklistItems[i].NOTES[j].PARENTENTITYNAME,
                                        "parentEntityId":this.worklistItems[i].NOTES[j].PARENTENTITYID,
                                        "personnelNameFull":this.worklistItems[i].NOTES[j].PERSONNELNAMEFULL,
                                        "updateDtTm":RCM_Clinical_Util.formatDateAndTimeStringForSave(this.worklistItems[i].NOTES[j].UPDATEDTTM),
                                        "version":this.worklistItems[i].NOTES[j].VERSION
                                    });
                                }
                            }
                        }

                        itemsArray.push({
                            "encounterId": this.worklistItems[i].ENCOUNTER_ID,
                            "patientId": this.worklistItems[i].PATIENT_ID,
                            "patientNameFull":RCM_Clinical_Util.encodeString(this.worklistItems[i].PATIENT_NAME),
                            "genderDisp":this.worklistItems[i].SEX ,
                            "age":this.worklistItems[i].AGE ,
                            "reasonForVisit":RCM_Clinical_Util.encodeString(this.worklistItems[i].VISIT_REASON),
                            "finNumber":this.worklistItems[i].FINANCIAL_NUMBER ,
                            "encounterTypeDisp":this.worklistItems[i].ENCOUNTER_TYPE,
                            "lengthOfStayInHours":this.worklistItems[i].LENGTH_OF_STAY,
                            "unitName":this.worklistItems[i].NURSE_UNIT ,
                            "roomNumber":this.worklistItems[i].ROOM,
                            "bedNumber":this.worklistItems[i].BED ,
                            "utilizationMgmtStatusDisp":"",
                            "dischargePlanStatusDisp":this.worklistItems[i].DISCHARGE_PLAN_STATUS? this.worklistItems[i].DISCHARGE_PLAN_STATUS : rcm_discharge_i18n.RCM_NOT_AVAILABLE,
                            "dischargeDispositionDisp":this.worklistItems[i].DISCHARGE_ACTUAL_DISPOSITION,
                            "reviewDueDateTime": this.worklistItems[i].NEXT_DISCHARGE_ASSESSMENT ? RCM_Clinical_Util.formatDateAndTimeStringForSave(this.worklistItems[i].NEXT_DISCHARGE_ASSESSMENT) : "",
                            "dischargePlanDueDateTime":"",
                            "lastClinicalReviewDateTime":"",
                            "admitDateTime":  this.worklistItems[i].ADMIT_DATE ? RCM_Clinical_Util.formatDateAndTimeStringForSave(this.worklistItems[i].ADMIT_DATE) :  "",
                            "dischargeDateTime":this.worklistItems[i].DISCHARGE_DT_TM ? RCM_Clinical_Util.formatDateAndTimeStringForSave(this.worklistItems[i].DISCHARGE_DT_TM) :  "",
                            "attendingDocNameFull":this.worklistItems[i].ATTENDING_PHYSICIAN,
                            "primaryPayerName":this.worklistItems[i].PAYER,
                            "primaryFinClassDisp":this.worklistItems[i].FINANCIAL_CLASS,
                            "secondaryPayerName":this.worklistItems[i].SECONDARY_PAYER,
                            "secondaryFinClassDisp":this.worklistItems[i].SECONDARY_FINANCIAL_CLASS,
                            "readmissionAlertFlag": this.worklistItems[i].READMISSION_ALERT,
                            "dischargeOrderInd": this.worklistItems[i].HASDISCHARGEORDER,
                            "consultOrderInd": this.worklistItems[i].HASCONSULTORDER,
                            "drgs": drgArray.length > 0 ? drgArray : [],
                            "careMgmtPersonnelReltns":reltnArray,
                            "notes":notesArray,
                            "dateOfBirth": this.worklistItems[i].DOB, /*DOB replacing age in printed worklist*/
                            "medicalService": this.worklistItems[i].MEDICALSERVICE
                        });
                    }

                var jsonRequest = {
                    "preview_request": {
                        "sourceType": "DISCHARGE_REVIEW_WL",
                        "patientListName": $("#patientListDropbox option:selected").text()? $("#patientListDropbox option:selected").text() : "",
                        "patientListId": this.patientListID,
                        "fileNameFullPath":"",
                        "worklistBreadCrumbs": $("#appliedFilters").text() ? $("#appliedFilters").text() : "",
                        "worklistItems": itemsArray
                    }
                };

                var cclRequest = new XMLCclRequest ();

                cclRequest.onreadystatechange = function () {
                    if (cclRequest.readyState == 4 && cclRequest.status == 200) {
                        $(".printTransparentDiv").css("visibility","hidden");
                        var thisData =JSON.parse(cclRequest.responseText);
                        if(thisData.RECORD_DATA.STATUS_DATA.STATUS == "S" || thisData.RECORD_DATA.STATUS_DATA.STATUS == "Z"){
                            var jsonString = thisData.RECORD_DATA.LONG_BLOB_ID;
                            var windowParams = "left=500,top=100,width=900,height=700,toolbar=yes,resizable=yes,scrollbars=yes,status=yes";
                            var url = "javascript:CCLLINK(^rcm_call_report^, ^\'MINE\', \'\',\'\',3,\'\',\'"+jsonString+"\'^)";
                            CCLNEWSESSIONWINDOW(url, "_self", windowParams, 0, 1);
                        }else{
                            RCM_Worklist.openPrintFailedDialog();
                        }
                        try {
                            info.cleanup();
                        } catch (err) {
                            //Used to catch case in old mpages where cleanup function does not exist.
                        }
                    } else {
                        if (cclRequest.readyState == 4 && cclRequest.status != 200) {
                            $(".printTransparentDiv").css("visibility","hidden");
                            RCM_Worklist.openPrintFailedDialog();
                        }
                        try {
                            info.cleanup();
                        } catch (err) {
                            //Used to catch case in old mpages where cleanup function does not exist.
                        }
                    }
                };
            cclRequest.open("GET","rcm_print_worklist", true);
            if(this.worklistItems.length > 100)
            {
                cclRequest.requestBinding = "CpmScriptBatch";
            }
            cclRequest.setBlobIn(JSON.stringify(jsonRequest));

            cclRequest.send('MINE');
            }else{
                RCM_Worklist.openTooManyPrintDialog();
            }
        },

        openPageLink: function() {
            APPLINK(0,"Powerchart.exe","/ORGANIZERTAB=^"+RCM_Worklist.getPageLink()+"^");
        },

       /**
        * Gets fax failures
        */
        getFaxFailures: function(worklistItems){
            var faxFailures = [];
            for(var i = 0; i < worklistItems.length; i++) {
                var worklistItem = worklistItems[i];
                var worklistFaxFailures = worklistItem.POST_ACUTE_FAX_FAILURES;
                for(var j = 0; j < worklistFaxFailures.length; j++) {
                    var worklistFaxFailure = worklistFaxFailures[j];
                    faxFailures.push({
                        personId : worklistItem.PATIENT_ID,
                        encounterId : worklistItem.ENCOUNTER_ID,
                        patientName : worklistItem.PATIENT_NAME,
                        link : worklistItem.DUE_DATE_LINK,
                        viewpointLink : worklistItem.DUE_DATE_VIEWPOINT_LINK,
                        viewLink : worklistItem.DUE_DATE_VIEW_LINK,
                        communicationStatus : worklistFaxFailure.COMMUNICATION_STATUS_DISP
                    });
                }
            }

            faxFailures.sort(function(a, b) {
                var patientNameA = a.patientName ? a.patientName.toLowerCase() : "";
                var patientNameB = b.patientName ? b.patientName.toLowerCase() : "";
                return patientNameA.localeCompare(patientNameB);
            });
            return faxFailures;
        },

       /**
        * Creates fax failed dialogue
        */
        renderFaxFailedDialog: function(faxFailures){
            var html = [];
            if (faxFailures.length > 0) {
                var failedFaxImage = this.loc + "\\images\\6275_16.png";
                html.push("<div id='worklist-failed-fax' class='worklist-failed-fax'>");
                html.push("<table>");
                html.push("<tr>");
                html.push("<td>");
                html.push("<span class='worklist-failed-fax-img'><img src='", failedFaxImage, "'/></span>");
                html.push("<span id='worklist-failed-fax-message' class='worklist-failed-fax-message'>", rcm_discharge_i18n.RCM_FAX_FAILED_MESSAGE, "</span>");
                html.push("<span id='worklist-show-fax-detail' class='worklist-show-fax-detail worklist-link' onclick='RCM_Worklist.showAndHideFailedFaxDetailDialog()'>",
                        rcm_discharge_i18n.RCM_SHOW_DETAILS, "</span>");
                html.push("</td>");
                html.push("<td>");
                html.push("<span class='worklist-failed-fax-input'><input type='button' onclick='RCM_Worklist.dismissFailedFaxDialog()' value='", rcm_discharge_i18n.RCM_DISMISS, "'/></span>");
                html.push("</td>");
                html.push("</tr>");
                html.push("</table>");
                html.push("<div class='worklist-failed-fax-div'>");
                html.push("<table class='worklist-failed-fax-table'>");
                for (var i = 0; i < faxFailures.length; i++){
                    var faxFailure = faxFailures[i];
                    html.push("<tr>");
                    html.push("<td>");
                    html.push("<span class='worklist-link' onclick='javascript:VIEWLINK(0, \"" + rcm_discharge_i18n.RCM_POWERCHART + "\", \"" + faxFailure.personId + "\", \"" + faxFailure.encounterId + "\", \"" + faxFailure.link + "\", \"" + faxFailure.viewLink + "\", \"" + faxFailure.viewpointLink + "\");'>",
                                    faxFailure.patientName,"</span>");
                    html.push("</td>");
                    html.push("<td><span>", faxFailure.communicationStatus, "</span></td>");
                    html.push("</tr>");
                }
                html.push("</table>");
                html.push("</div>");
                html.push("</div>");
            }
            return html.join("");
        },

       /**
        * creates okay dialog
        */
        getOkDialogHTML: function(){
            var boxDiv = document.createElement("div");
            boxDiv.id = "dcWorklistOkDialog";
            boxDiv.className = "dcWorklist-dialog";
            var html = [];
                html.push("<div class='dcWorklist-dialog-title-bar'>");
                    html.push("<label id='dcWorklistOkDialogTitle'></label>");
                html.push("</div>");
                html.push("<div class='dcWorklist-dialog-message-area'>");
                    html.push("<label id='dcWorklistOkDialogMessage'></label>");
                html.push("</div>");
                html.push("<div class='dcWorklist-dialog-buttons'>");
                    html.push("<input id='dcWorklistBtnOk' type='button' value='",rcm_discharge_i18n.RCM_OK,"' onclick='RCM_Worklist.closeOkDialog()'/>");
                html.push("</div>");
            boxDiv.innerHTML = html.join("");
            document.body.appendChild(boxDiv);
        },

        /**
        * Gets over 100 dialog dialog
        */
        getPrintTooManyDialogHTML: function() {
            var boxDiv = document.createElement("div");
            boxDiv.id = "worklistTooManyDialog";
            boxDiv.className = "worklist-toomany-dialog";
            var html = [];
                html.push("<div class='dcWorklist-dialog-title-bar'>");
                    html.push("<label id='worklistTooManyDialogTitle'></label>");
                html.push("</div>");
                html.push("<div class='dcWorklist-dialog-message-area'>");
                    html.push("<label id='worklistTooManyDialogMessage'></label>");
                html.push("</div>");
                html.push("<div class='dcWorklist-dialog-buttons'>");
                    html.push("<input id='worklistBtnNo' type='button' value='",rcm_discharge_i18n.RCM_NO,"' onclick='RCM_Worklist.closePrintTooManyDialog()'/>");
                    html.push("<input id='worklistBtnYes' type='button' value='",rcm_discharge_i18n.RCM_YES,"' onclick='RCM_Worklist.closePrintTooManyDialog(true)'/>");
                html.push("</div>");
            boxDiv.innerHTML = html.join("");
            document.body.appendChild(boxDiv);
        },

        /**
        * creates read-only dialog.
        */
        getReadOnlyDialogHTML: function(){
            var boxDiv = document.createElement("div");
            boxDiv.id = "dcWorklistReadOnlyDialog";
            boxDiv.className = "dcWorklist-read-only-dialog";
            document.body.appendChild(boxDiv);
        },

        findSupportedRiskFactor:function (factorName) {
            var categories = supportedRiskOutcomes.categories;
            var foundFactor = null;
            if (factorName && factorName.length) {
                categoryLoop: for (var categoryCnt = 0; categoryCnt < categories.length; categoryCnt++) {
                    var factors = categories[categoryCnt].factors;
                    for (var factorCnt = 0; factorCnt < factors.length; factorCnt++) {
                        if (factors[factorCnt].factorName === factorName) {
                            foundFactor = factors[factorCnt];
                            break categoryLoop;
                        }
                    }
                }
            }
            return foundFactor;
        },

        getRiskFactorValue: function(passedFactor) {
            var returnValue = "";
            if (passedFactor && passedFactor.detailType && passedFactor.detailInfo) {
                switch (passedFactor.detailType) {
                    case "INTERPRETATION_BOOLEAN":
                        returnValue = (passedFactor.detailInfo.toLowerCase() === "true" || passedFactor.detailInfo === true) ? rcm_discharge_i18n.RCM_YES : rcm_discharge_i18n.RCM_NO;
                        break;
                    case "FACT_IDENTIFIER":
                        break;
                    default:
                        returnValue = passedFactor.detailInfo;
                        break;
                }
            }
            return returnValue;
        },

        resetSupportedRiskFactors: function() {
            var categories = supportedRiskOutcomes.categories;
            for (var categoryCnt = 0; categoryCnt < categories.length; categoryCnt++) {
                var factors = categories[categoryCnt].factors;
                for (var factorCnt = 0; factorCnt < factors.length; factorCnt++) {
                    factors[factorCnt].factorValue = rcm_discharge_i18n.RCM_MISSING_DATA;
                }
            }
        },

        loadRiskDetails: function (personId) {
            this.resetSupportedRiskFactors();
            var html = [];
            html.push("<img class ='dcWorklist-spinner' src = '",spinnerImage,"'>");
            html.push("<div class='dcWorklist-dialog-buttons'>");
            html.push("<input id='dcWorklistReadOnlyDialogBtnOk' type='button' value='",rcm_discharge_i18n.RCM_OK,"' onclick='RCM_Worklist.closeReadOnlyDialog()'/>");
            html.push("</div>");
            $("#dcWorklistReadOnlyDialog").append(html.join(""));
            var request = {"personId": personId};
                var json = "^" + JSON.stringify(request) + "^";
                var program = "RCM_JSON_SERVICE";
                var paramAr = [];
                paramAr.push("^MINE^", "0.0", "^GetCloudOutcomes^", json);
                var reply = RCM_Worklist.makeTimerCall(RCM_Worklist.component, program, paramAr, 0, true);
                html = [];
                html.push("<div class = 'dcWorklist-dialog-table'>");
                    html.push("<table id = 'dcWorklistRiskDetailsTable'>");
                        if(reply != null && reply.STATUS_DATA.STATUS !== "F" && reply.serviceData != null && reply.serviceData.outcomes.length > 0) {
                            var riskOutcomes = reply.serviceData.outcomes[0];
                            for(var i = 0; i < riskOutcomes.outcomeFactors.length; i++) {
                                var riskOutcomeFactor = this.findSupportedRiskFactor(riskOutcomes.outcomeFactors[i].factorType);
                                if (riskOutcomeFactor !== null){
                                    var outcomeFactor = riskOutcomes.outcomeFactors[i];
                                    for(var j = 0; j < outcomeFactor.outcomeFactorDetails.length; j++) {
                                        var detail = outcomeFactor.outcomeFactorDetails[j];
                                        var tempRiskFactorValue = this.getRiskFactorValue(detail);
                                        riskOutcomeFactor.factorValue = (riskOutcomeFactor.factorValue === rcm_discharge_i18n.RCM_MISSING_DATA) ? tempRiskFactorValue: riskOutcomeFactor.factorValue + " " + tempRiskFactorValue;
                                    }
                                }
                            }
                            for(var i = 0; i < supportedRiskOutcomes.categories.length; i++) {
                                var categoryName = supportedRiskOutcomes.categories[i].categoryName;
                                html.push("<tr class = 'dcWorklistCategoryRow'>");
                                html.push("<td class = 'dcWorklistCategory' colspan = '2'>", categoryName,"</td></tr>");
                                var supportedFactors = supportedRiskOutcomes.categories[i].factors;
                                for(var j = 0; j < supportedFactors.length; j++) {
                                    var supportedFactor = supportedFactors[j];
                                    html.push("<tr><td class = 'dcWorklistRiskItem'>", supportedFactor.factorHeader,"</td> <td class = 'dcWorklistRiskItem'>", supportedFactor.factorValue,"</td></tr>");
                                }
                            }
                        }
                        else {
                            RCM_Worklist.openLoadRiskDetailsErrorDialog();
                        }
                    html.push("</table>");
                html.push("</div>");
                html.push("<div class='dcWorklist-dialog-buttons'>");
                    html.push("<input id='dcWorklistReadOnlyDialogBtnOk' type='button' value='",rcm_discharge_i18n.RCM_OK,"' onclick='RCM_Worklist.closeReadOnlyDialog()'/>");
                html.push("</div>");
                this.dcworklistReadOnlyDialog.innerHTML = html.join("");
        },

        getNoteDeleteDialogHTML: function(){

            var html = [];
            html.push("<div id='dcWorklistNoteDeleteDialog' class='dcWorklist-dialog'>");
                html.push("<div class='dcWorklist-dialog-title-bar'>");
                    html.push("<label id='dcWorklistNoteDeleteDialogTitle'>", rcm_discharge_i18n.RCM_REMOVE, "</label>");
                html.push("</div>");
                html.push("<div class='dcWorklist-dialog-message-area'>");
                    html.push("<label id='dcWorklistNoteDeleteDialogMessage'>", rcm_discharge_i18n.RCM_REMOVE_NOTE, "</label>");
                html.push("</div>");
                html.push("<div class='dcWorklist-note-delete-buttons'>");
                    html.push("<input id='dcWorklistNoteDeleteBtnCancel' type='button' value='",rcm_discharge_i18n.RCM_CANCEL,"' />");
                    html.push("<input id='dcWorklistNoteDeleteBtnOk' type='button' value='",rcm_discharge_i18n.RCM_OK,"' />");
                html.push("</div>");
            html.push("</div>");

            return html.join("");
        },

       /**
        * Renders table for the worklist
        */
        renderRCMTable: function(worklistItems){
            var worklistHTML = [];
            worklistHTML.push("<div id='tableDiv'>");
            worklistHTML.push(this.loadTable(worklistItems));
            worklistHTML.push("</div>");
            return worklistHTML.join("");
        },

       /**
        * creates HTML for the table for the worklist
        */
        getTableHeaderHTML: function(tableHeaderLabel) {
            var html = [];
            html.push("<tr id='floatingPersonListHeader' class='worklist-th'>");
            html.push("<th class='worklist-th' scope='col'>" , rcm_discharge_i18n.RCM_LOCATION , "</th>");
            html.push("<th class='worklist-th' scope='col'><span class='worklist-th-patient'>"+
                    rcm_discharge_i18n.RCM_PATIENT, "</span><br/><span class='dcworklist-th-patient-status'>(", rcm_discharge_i18n.RCM_STATUS, "&nbsp;/&nbsp;<span id='rcmDischargePlannerHeader'>",tableHeaderLabel ? tableHeaderLabel : "","</span>)</span></th>");
            var pat_rltn_type_string = '';
            var pat_rltn_type_Array = [];
            if (this.patReltTypeConfig && this.patReltTypeConfig.length > 0) {
                var sortArr=[];
                for (var x = 0; x < this.patReltTypeConfig.length; x++) {
                    pat_rltn_type_Array.push(this.patReltTypeConfig[x].DISPLAY);
                }
                pat_rltn_type_string = rcm_discharge_i18n.RCM_SLASH;
                pat_rltn_type_string += pat_rltn_type_Array.join(rcm_discharge_i18n.RCM_PIPE);
            }
            html.push("<th class='worklist-th' scope='col'>", rcm_discharge_i18n.RCM_FIN, "/", rcm_discharge_i18n.RCM_VISIT_REASON, "<br />", rcm_discharge_i18n.RCM_VISIT_SUB_REASON.replace("{0}" , pat_rltn_type_string), "</th>");
            html.push("<th class='worklist-th' scope='col' >", rcm_discharge_i18n.RCM_DRG_COL, "</th>");
            html.push("<th class='worklist-th' scope='col'>", rcm_discharge_i18n.RCM_VISIT_LENGTH, "<br />", rcm_discharge_i18n.RCM_VISIT_SUB_LENGTH, "</th>");
            html.push("<th class='worklist-th' scope='col'>", rcm_discharge_i18n.RCM_NEXT_DISCHARGE_ASSESSMENT,"<br/>(", rcm_discharge_i18n.RCM_LAST_POST_ACUTE_UPDATE, ")</th>");
            html.push("<th class='worklist-th' scope='col'>", rcm_discharge_i18n.RCM_PAYER, "<br />", rcm_discharge_i18n.RCM_SUB_PAYER, "</th>");
            html.push("</tr>");
            return html.join("");
        },

        /**
        *hover mouse in listener
        */
        hoverInListener: function(obj) {
            $(obj).css('backgroundColor', '#EDEDED');
            $(obj).css('border-right-color', '#FFFFFF');
        },
        /**
        * hover mouse out listener
        */
        hoverOutListener:function(obj) {
            $(obj).css('backgroundColor', '');
            $(obj).css('border-right-color', '');
        },

        getErrorTableHTML: function() {
            var html = [];
            html.push("<table id='personListTable'>");
            html.push(this.getTableHeaderHTML());
            html.push("<tr><td colspan='7'><b><center>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</center><b></td></tr>");
            html.push("</table>");
            return html.join("");
        },

        /**
        * creates table for the worklist
        */
        loadTable: function(worklistItems){
            if(!$("#listBlockingDiv").length){
                $("body").append("<div id='listBlockingDiv' class='transDiv'></div>");
            }
            var html = [];
            html.push("<table id='personListTable'>");
            var tableHeaderLabel = "";
            if(worklistItems[0] && worklistItems[0].CARE_MGMT_RELTN && worklistItems[0].CARE_MGMT_RELTN.length > 0){
                tableHeaderLabel = worklistItems[0].CARE_MGMT_RELTN[0].TYPEDISPLAY;
            }
            html.push(this.getTableHeaderHTML(tableHeaderLabel));
            if (worklistItems.length === 0) {
                html.push("<tr><td colspan='7'><b><center>", rcm_discharge_i18n.RCM_NO_RESULTS_FOUND, "</center><b></td></tr>");
            }
            else {
                var zebraStriping = "";
                var background = "";
                var alertImage = "";
                this.personInfo = worklistItems;
                //Fill table component with data
                for (var j = 0, x = worklistItems.length; j < x; j++) {
                    var person = worklistItems[j];

                    // Sort the person DRGs.
                    RCM_Worklist.sortDRGs(person.DRGS);

                    // Determine DRG to display and the corresponding LOS/GMLOS percentage.
                    var displayDRG = RCM_Worklist.getDRGToDisplay(person.DRGS, 0);
                    var losElosPercentage = 0;
                    var elosHours = 0;
                    var losHours = person.LENGTH_OF_STAY;
                    if(displayDRG) {
                        elosHours = displayDRG.ESTIMATEDLENGTHOFSTAYINHOURS;
                        if(elosHours) {
                            var width = (losHours / elosHours) * 100;
                            losElosPercentage = Math.floor(width);
                        }
                    }

                    if (j % 2 === 0) {
                        zebraStriping = "zebra-striping-white";
                        background = "#FFFFFF";
                    }
                    else {
                        zebraStriping = "zebra-striping-blue";
                        background = "#F3F6FD";
                    }
                    var encounterId = Math.abs(person.ENCOUNTER_ID) + '.0';
                    var personId = person.PATIENT_ID;
                    var version = person.VERSION;
                    var rowId = 'recordDataRow' + encounterId;
                    html.push("<tr class='", zebraStriping, "' id='", rowId, "'>");

                    var idStrings = 'openSummary' + encounterId;
                    html.push("<td class='td-border' onclick='RCM_Worklist.expandListener(", encounterId, ", ", personId, ")'><img class='expandable-image' id='", idStrings, "' src='", this.collapsedImageFile, "'>");

                    //Location
                    if (person.NURSE_UNIT === undefined || person.ROOM === undefined || person.BED === undefined) {
                        html.push(rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</td>");
                    }
                    else {
                        html.push(person.NURSE_UNIT, "&nbsp;");
                        html.push(person.ROOM, "&nbsp;");
                        html.push(person.BED, "</td>");
                    }

                    //Patient
                    var patientEncounterVersionString = "dcWorklistPVersion" + version;
                    html.push("<td onMouseOver='RCM_Worklist.showNoteImg(this);' onMouseOut='RCM_Worklist.hideNoteImg(this);' class='patientInfo'><div id='",patientEncounterVersionString,"' class='dcWorklistPatientVersionDiv'><p>");

                    var hasAlert = false;
                    var alertsInfo = {
                            losAlert : "",
                            readmissionAlert : "",
                            unassignedWithOrdersAlert : "",
                            concurrentDenialAlert : "",
                            differingWorkingDRGAlert : "",
                            authAlert: ""
                    };

                    if(displayDRG && (losElosPercentage > 100 || ((losElosPercentage === 0) && (elosHours === 0)))) {
                        hasAlert = true;
                        alertsInfo.losAlert = rcm_discharge_i18n.RCM_ALERT_LOS_ELOS;
                    }

                    if (person.READMISSION_ALERT === 2) {
                        hasAlert = true;
                        alertsInfo.readmissionAlert = rcm_discharge_i18n.RCM_ALERT_READMIT;
                    }

                    if ((person.RELTN_ASSIGNED === 0) && (person.RELTN_ASSIGNED_OTHER === 0) && (person.HASDISCHARGEORDER === 1)) {
                        hasAlert = true;
                        alertsInfo.unassignedWithOrdersAlert = rcm_discharge_i18n.RCM_ALERT_UNASSIGNED_WITH_ORDERS;
                    }

                    if (person.CONCURRENT_DENIAL_IND === 1) {
                        hasAlert = true;
                        alertsInfo.concurrentDenialAlert = rcm_discharge_i18n.RCM_ALERT_CONCURRENT_DENIAL;
                    }

                    if(person.DIFFERINGWORKINGDRGIND === 1) {
                        hasAlert = true;
                        alertsInfo.differingWorkingDRGAlert = rcm_discharge_i18n.RCM_ALERT_DIFFERING_WORKING_DRGS;
                    }
                    if(person.EARLIEST_AUTH_END_DT_HOURS < losHours && person.HEALTH_PLAN_AUTHORIZATIONS.length > 0){
                        hasAlert = true;
                        alertsInfo.authAlert = rcm_discharge_i18n.RCM_ALERT_AUTH;
                    }

                    if (hasAlert) {
                        alertImage = this.loc + "\\images\\6047.ico";
                    }
                    else {
                        alertImage = "";
                    }
                    var link = this.patInfoLink(person, rcm_discharge_i18n.RCM_POWERCHART, background, alertImage, alertsInfo);
                    html.push("<div>");
                    html.push(link);
                    html.push("</div>");

                    html.push("<div style='clear:both;' class = 'dcWorklist-patient-table'>");


                    if (person.AGE === undefined) {
                        html.push("<p class='indention'><span class='secondary-basic'>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</span>&nbsp;&nbsp;&nbsp;");
                    }
                    else {
                        var personAge = person.AGE;
                        html.push("<p class='indention'><span class='secondary-basic'>", personAge, "</span>&nbsp;&nbsp;&nbsp;");
                    }

                    if (person.SEX === undefined) {
                        html.push("<span class='secondary-basic'>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</span></p>");
                    }
                    else {
                        html.push("<span class='secondary-basic'>", person.SEX, "</span></p>");
                    }


                    if (person.DISCHARGE_PLAN_STATUS_MEAN === undefined) {
                        html.push("<p class='indention'><span class='dcWorklist-plain-bold-font'>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</span></p>");
                    }
                    else {
                        var statusIdString = "dcWorklistStatus" + person.DISCHARGE_PLAN_STATUS_CD;
                        if (person.DISCHARGE_PLAN_STATUS_MEAN === rcm_discharge_i18n.RCM_COMPLETE || person.DISCHARGE_PLAN_STATUS_MEAN === rcm_discharge_i18n.RCM_NOT_NEEDED) {
                            if (this.canModDischarge === 1){
                                html.push("<p class='indention'><div id='",statusIdString,"' class='indention'><span id='dcWorklistStatusDisplay' class='dcWorklist-alert-font dcWorklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",personId,",",encounterId,", this, event)'>", person.DISCHARGE_PLAN_STATUS, "</span></div></p>");
                            }
                            else
                            {
                                html.push("<p class='indention'><div id='",statusIdString,"' class='indention'><span id='dcWorklistStatusDisplay' class='dcWorklist-alert-font dcWorklist-transparent-line'>", person.DISCHARGE_PLAN_STATUS, "</span></div></p>");
                            }
                        }
                        else {
                            if(person.DISCHARGE_PLAN_STATUS_MEAN === ""){
                                if(this.canModDischarge === 1){
                                    html.push("<p class='indention'><div id='",statusIdString,"' class='indention'><span id='dcWorklistStatusDisplay' class='dcWorklist-plain-font dcWorklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",personId,",",encounterId,", this, event)'>", rcm_discharge_i18n.RCM_NOT_AVAILABLE, "</span></div></p>");
                                }
                                else{
                                    html.push("<p class='indention'><div id='",statusIdString,"' class='indention'><span id='dcWorklistStatusDisplay' class='dcWorklist-plain-font dcWorklist-transparent-line'>", rcm_discharge_i18n.RCM_NOT_AVAILABLE, "</span></div></p>");
                                }
                            }
                            else{
                                if(this.canModDischarge === 1){
                                    html.push("<p class='indention'><div id='",statusIdString,"' class='indention'><span id='dcWorklistStatusDisplay' class='dcWorklist-plain-font dcWorklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",personId,",",encounterId,", this, event)'>", person.DISCHARGE_PLAN_STATUS, "</span></div></p>");
                                }
                                else{
                                    html.push("<p class='indention'><div id='",statusIdString,"' class='indention'><span id='dcWorklistStatusDisplay' class='dcWorklist-plain-font dcWorklist-transparent-line'>", person.DISCHARGE_PLAN_STATUS, "</span></div></p>");
                                }
                            }
                        }
                    }
                    if (person.HASDISCHARGEORDER !== undefined && person.HASDISCHARGEORDER === 1) {
                        html.push('<p class="indention"><span id = "dcWorklistDischargeOrderDisplay" class="dcWorklist-alert-font dcWorklist-transparent-line" onclick="RCM_Worklist.orderClickEvent(',personId,',',encounterId,',\'DISCHARGE\', this, event)" onMouseOver="RCM_Worklist.showModifyHover(',personId,',',encounterId,',\'DISCHARGE\', this, event)" onMouseOut="RCM_Worklist.hovered=false; RCM_Worklist.hideModifyHover(this)">', rcm_discharge_i18n.RCM_DISCHARGE_ORDER, '</span></p>');
                    }
                    else if (person.HASDISCHARGEORDER === undefined) {
                        html.push("<p class='indention'><span class='dcWorklist-plain-bold-font'>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</span></p>");
                    }
                    if (person.HASCONSULTORDER !== undefined && person.HASCONSULTORDER === 1){
                        html.push('<p class="indention"><span class="dcWorklist-alert-font dcWorklist-transparent-line" onclick="RCM_Worklist.orderClickEvent(',personId,',',encounterId,',\'CONSULT\', this, event)" onMouseOver="RCM_Worklist.showModifyHover(',personId,',',encounterId,',\'CONSULT\', this, event)" onMouseOut="RCM_Worklist.hovered=false; RCM_Worklist.hideModifyHover(this)">', rcm_discharge_i18n.RCM_CONSULT_ORDER, '</span></p>');                    }
                    else
                        if (person.HASCONSULTORDER === undefined) {
                            html.push("<p class='indention'><span class='dcWorklist-alert-font'>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</span></p>");
                        }
                    if (person.HASDISCERNORDER !== undefined && person.HASDISCERNORDER === 1) {
                        html.push('<p class="indention"><span class="dcWorklist-alert-font dcWorklist-transparent-line" onclick="RCM_Worklist.orderClickEvent(',personId,',',encounterId,',\'DISCERN\', this, event)" onMouseOver="RCM_Worklist.showModifyHover(',personId,',',encounterId,',\'DISCERN\', this, event)" onMouseOut="RCM_Worklist.hovered=false; RCM_Worklist.hideModifyHover(this)">', this.discernOrderLabel, '</span></p>');
                    }
                    else if (person.HASDISCERNORDER === undefined) {
                        html.push("<p class='indention'><span class='dcWorklist-plain-bold-font'>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</span></p>");
                    }
                    if(person.CARE_MGMT_RELTN && person.CARE_MGMT_RELTN.length > 0){
                        var dpRelIdString = "dcWorklistRel" + person.CARE_MGMT_RELTN[0].TYPECD;
                        if(Math.abs(person.CARE_MGMT_RELTN[0].PERSONNELID) !== 0){
                            html.push("<p id='",dpRelIdString,"' class='indention'><span id='dcWorklistDCRelationshipDisplay' class='worklist-plain-font dcWorklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",personId,",",encounterId,",this,event)'>", person.CARE_MGMT_RELTN[0].NAMEFULL, "</span></p>");
                        }
                        else{
                            html.push("<p id='",dpRelIdString,"' class='indention'><span id='dcWorklistDCRelationshipDisplay' class='worklist-plain-font dcWorklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",personId,",",encounterId,",this,event)'>", rcm_discharge_i18n.RCM_UNASSIGNED, "</span></p>");
                        }
                    }

                    html.push("</div>");
                    html.push("<img name='dcWorklistNoteImg_", person.ENCOUNTER_ID, "' onMouseOver='RCM_Worklist.showNoteHover(",personId,",",encounterId,", this, event)' onMouseOut='RCM_Worklist.hovered=false; RCM_Worklist.hideNoteHover(this)' " +
                            "onClick='RCM_Worklist.noteImgClickEvent(",personId,",",encounterId,", this, event); RCM_Worklist.keepNoteImgVisible(this);' ");
                    if(person.CARE_NOTE_IND == 0){
                        html.push("class='diswl-note-image-hidden dcWorklist-transparent-line' src='", newNoteImage, "'>");
                    }
                    else{
                        html.push("class='diswl-note-image dcWorklist-transparent-line' src='", noteImage, "'>");
                    }
                    html.push("</div></td>");



                    //Visit Reason
                    html.push("<td class='td-border visitReasonWidth'><div><p>");

                    html.push("<span class='label-text'>", rcm_discharge_i18n.RCM_FIN, ":</span>&nbsp;<span class='header-basic'>");
                    if (person.FINANCIAL_NUMBER === undefined) {
                        html.push(rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</span><br/>");
                    }
                    else {
                        html.push(person.FINANCIAL_NUMBER, "</span><br/>");
                    }

                    if (person.VISIT_REASON === undefined) {
                        html.push("<span class='header-basic'>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</span>");
                    }
                    else {
                        if (person.VISIT_REASON) {
                            html.push("<span class='header-basic'>", person.VISIT_REASON, "</span>");
                        }
                        else {
                            html.push("<span class='header-basic'></span><br/>");
                        }
                    }


                    html.push("<p class='indention2'><span class='secondary-basic'>", person.ENCOUNTER_TYPE || rcm_discharge_i18n.RCM_ERROR_MESSAGE,
                        " | ", person.MEDICALSERVICE || "--", "</span></p>");
                    if (person.ATTENDING_PHYSICIAN) {
                        html.push("<p class='indention2'><span class='secondary-basic'>", person.ATTENDING_PHYSICIAN, "</span></p>");
                    }
                    else {
                        html.push("<p class='indention2'><span class='secondary-basic'>", rcm_discharge_i18n.RCM_MISSING_DATA, "</span></p>");
                    }
                    var nameArry = [];
                    var pat_rltn_name_string = '';
                    if (person.PAT_PRSNL_RELTNS && this.patReltTypeConfig) {
                        for(var i = 0; i < this.patReltTypeConfig.length; i++) {
                            pat_rltn_name_string=rcm_discharge_i18n.RCM_MISSING_DATA;
                            for(var k = 0; k < person.PAT_PRSNL_RELTNS.length; k++){
                                if(this.patReltTypeConfig[i].TYPE_CD == person.PAT_PRSNL_RELTNS[k].TYPE_CD){
                                    if(person.PAT_PRSNL_RELTNS[k].FULL_PERSONNEL_NAME) {
                                        pat_rltn_name_string=person.PAT_PRSNL_RELTNS[k].FULL_PERSONNEL_NAME;
                                    }
                                    break;
                                }
                            }
                            nameArry.push(pat_rltn_name_string);
                        }
                        pat_rltn_name_string = nameArry.join(rcm_discharge_i18n.RCM_PIPE);
                    }
                    html.push("<p class='indention2'><span class='secondary-basic'>", pat_rltn_name_string, "</span></p></p></div></td>");
                    //DRG
                    html.push("<td class='td-border nowrap' >");
                    if (!displayDRG) {
                        html.push("<div><p></p></div>");
                    }
                    else {
                        if (displayDRG.TRANSFERRULEINDICATOR === 1){
                            html.push("<img style='float:left' src='", this.loc, "\\images\\6405_16.png' alt=''/>");
                        }
                        html.push("<div class='DCWorklistHoverParent'>");
                            html.push("<p>");
                                html.push("<span class='header-basic'");
                                        if(person.DIFFERINGWORKINGDRGIND){
                                            html.push(" style='color:red; font-weight:bold;'>");
                                        }else if (displayDRG.FINALINDICATOR){
                                            html.push(" style='color:black; font-weight:bold;'>");
                                        }else{
                                            html.push(">");
                                        }
                                    html.push(displayDRG.SOURCEIDENTIFIER);
                                html.push("</span>");
                                html.push("<div class='units-text'>");
                                    html.push(displayDRG.SOURCEVOCABULARYDISPLAY);
                                html.push("</div>");
                            html.push("</p>");

                            html.push("<div class='DCWorklistHover'>");
                                for(var k = 0; k < person.DRGS.length; k++) {
                                    var drg = person.DRGS[k];
                                    html.push("<p>");
                                        if (drg.TRANSFERRULEINDICATOR === 1){
                                            html.push("<img style='float:left' src='", this.loc, "\\images\\6405_16.png' alt=''/>");
                                        }
                                        html.push(drg.DESCRIPTION, "&nbsp;(", drg.SOURCEIDENTIFIER, ")");
                                    html.push("</p>");
                                    if(drg.SEVERITYOFILLNESSDISPLAY || drg.RISKOFMORTALITYDISPLAY || drg.DRGWEIGHT){
                                        html.push("<p class='indention2 units-text'>");
                                            html.push(rcm_discharge_i18n.RCM_SEVERITY_OF_ILLNESS, "&nbsp;", drg.SEVERITYOFILLNESSDISPLAY, "&nbsp;&nbsp;&nbsp;");
                                            html.push(rcm_discharge_i18n.RCM_RISK_OF_MORTALITY, "&nbsp;", drg.RISKOFMORTALITYDISPLAY, "&nbsp;&nbsp;&nbsp;");
                                            html.push(rcm_discharge_i18n.RCM_DRG_WEIGHT, "&nbsp;", drg.DRGWEIGHT);
                                        html.push("</p>");
                                    }
                                    html.push("<p class='indention2'><span class='units-text'>", drg.FINALINDICATOR ? rcm_discharge_i18n.RCM_DRG_FINAL_HOVER : rcm_discharge_i18n.RCM_DRG_WORKING_HOVER, "&nbsp;(", drg.CONTRIBUTORSYSTEM, ")</span></p>");
                                }
                            html.push("</div>");
                        html.push("</div>");
                    }
                    html.push("</td>");

                    //Visit Length
                    html.push("<td class='td-border'>");

                    RcmAuthRibbonHelper.setImagePath(this.loc + "\\images\\");
                    if(this.ribbonSettings.isEddOn){
                        html.push("<div id='losRibbon", encounterId.replace(".0",""),"' class='ribbon-spacing'>");
                            html.push(RcmAuthRibbonHelper.createLosDisplay(losHours));
                            html.push(RcmAuthRibbonHelper.createLoadingRibbon());
                            html.push(RcmAuthRibbonHelper.createEmptyDayTypes(this.ribbonSettings));
                        html.push("</div>");
                    }
                    else{
                        var authHours = person.EARLIEST_AUTH_END_DT_HOURS;
                        var personRibbonInfo = {
                            ENCOUNTER_ID: encounterId,
                            AUTHORIZATION_DT_TM: person.EARLIEST_AUTH_END_DT_TM,
                            HEALTH_PLAN_AUTHORIZATIONS: person.HEALTH_PLAN_AUTHORIZATIONS,
                            ELOS_DATE: RcmAuthRibbonHelper.calculateDateFromAdmit(person.ADMIT_DATE, elosHours)
                        };
                        var authRibbon = new RcmAuthRibbon(losHours, elosHours, 0, authHours, personRibbonInfo, this.ribbonSettings, this.loc);
                        html.push("<div class='ribbon-spacing'>");
                            html.push(authRibbon.getAllRibbonHtml());
                        html.push("</div>");

                    }

                    html.push("<div><p class='indention2'>");

                     var mode = 0;
                    var app = rcm_discharge_i18n.RCM_POWERCHART;
                    var tab = person.READMISSION_LINK;
                    var viewpointId = person.READMISSION_VIEWPOINT_LINK;
                    var viewId = person.READMISSION_VIEW_LINK;

                    if (person.READMISSION_ALERT === 1) {
                        html.push("<p class='indention2'><span class='units-text'><a style='color:#999999; text-decoration:none;' " +
                                        "href='javascript:VIEWLINK(" + mode + ", \"" + app + "\", \"" + personId + "\", \"" + encounterId + "\", \"" + tab + "\", \"" + viewId + "\", \"" + viewpointId + "\");'>",
                                        rcm_discharge_i18n.RCM_READMISSION, "</a>&nbsp;");
                    }
                    else if (person.READMISSION_ALERT === 2) {
                        html.push("<p class='indention2'><span class='units-text'><a style='color:red; text-decoration:none; font-weight:bold;' " +
                                        "href='javascript:VIEWLINK(" + mode + ", \"" + app + "\", \"" + personId + "\", \"" + encounterId + "\", \"" + tab + "\", \"" + viewId + "\", \"" + viewpointId + "\");'>",
                                        rcm_discharge_i18n.RCM_READMISSION, "</a>&nbsp;");
                    }
                    else {
                        html.push("<p class='indention2'><span class='units-text'>", rcm_discharge_i18n.RCM_ADMIT_DATE, "&nbsp;");
                    }
                    if (person.ADMIT_DATE === undefined) {
                        html.push(rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</span></p>");
                    }
                    else {
                        html.push(this.getDate(person.ADMIT_DATE), "</span></p>");
                    }
                    if (person.DISCHARGE_DT_TM === undefined) {
                        html.push("<p class='indention2'><span class='units-text'>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</span></p>");
                    }
                    else {
                        if (person.DISCHARGE_DT_TM != "") {
                            html.push("<p class='indention2'><span class='units-text'><b>", rcm_discharge_i18n.RCM_DISCHARGE_DATE, "</b>&nbsp;");
                            html.push(this.getDate(person.DISCHARGE_DT_TM), "</span></p>");
                        }
                    }

                    //Readmission Risk
                    tab = person.READMISSION_RISK_LINK;
                    viewpointId = person.READMISSION_RISK_VIEWPOINT_LINK;
                    viewId = person.READMISSION_RISK_VIEW_LINK;

                    if (person.RISK_FACTOR_FLAG) {
                        var riskFontClass = "";
                        if (person.RISK_FACTOR_FLAG === 1) {
                            riskFontClass = "units-text";
                        } else if (person.RISK_FACTOR_FLAG === 2) {
                            riskFontClass = "units-text-black";
                        } else if (person.RISK_FACTOR_FLAG === 3) {
                            riskFontClass = "dcWorklist-alert-font";
                        }
                        if(riskFontClass.length) {
                            html.push("<p class='indention2'>");
                                html.push("<span class='dcWorklist-readmission-risk ", riskFontClass, "' onMouseOver='RCM_Worklist.showReadOnlyDashedLine(this)' onMouseOut='RCM_Worklist.removeReadOnlyDashedLine(this)' onclick='RCM_Worklist.openReadOnlyDialog(", personId, ", this, event)'>");
                                    html.push(person.RISK_FACTOR_TEXT, " ", rcm_discharge_i18n.RCM_READMISSION_RISK, " (", person.RISK_FACTOR_VALUE, ")");
                                html.push("</span>");
                                if(tab && tab.length) {
                                    var riskLink = "javascript:VIEWLINK(" + mode + ", \"" + app + "\", \"" + personId + "\", \"" + encounterId + "\", \"" + tab + "\", \"" + viewId + "\", \"" + viewpointId + "\");";
                                    html.push("<img onclick='", riskLink, "' class='dcWorklist-readmission-risk-link' src='", this.loc, "\\images\\3308.bmp' alt=''/>");
                                }
                            html.push("</p>");
                        }
                    }
                    html.push("</p></div></td>");

                    //Next Assessment
                    html.push("<td class='td-border' onMouseOver='RCM_Worklist.showModifyDateImg(this)' onMouseOut='RCM_Worklist.hideModifyDateImg(this)'>");
                    tab = person.DUE_DATE_LINK;
                    viewpointId = person.DUE_DATE_VIEWPOINT_LINK;
                    viewId = person.DUE_DATE_VIEW_LINK;
                    if (person.NEXT_DISCHARGE_ASSESSMENT == undefined) {
                        html.push(rcm_discharge_i18n.ERROR_MESSAGE);
                    }
                    else {
                        html.push("<div id='dcWorklistDateDisplayParent' class='dcWorklist-next-review-date-container'>");
                            var recordDate = this.getComparisonDate(person.NEXT_DISCHARGE_ASSESSMENT);
                            if (recordDate === "") {
                                if(this.canModDischarge === 1){
                                    html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-plain-font header-basic dcWorklist-next-review-date-label dcworklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(", personId,",", encounterId,", this, event)'>", rcm_discharge_i18n.RCM_NO_DATE, "</div>");
                                }
                                else{
                                    html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-plain-font header-basic dcWorklist-next-review-date-label dcworklist-transparent-line' >", rcm_discharge_i18n.RCM_NO_DATE, "</div>");
                                }
                            }

                            else {
                                var todaysDate = this.getTodaysDate();
                                var tomorrowDate = this.getTomorrowsDate();
                                var yesterdayDate = this.getYesterdaysDate();
                                var twoDaysFromNowDate = this.getTwoDaysFromNowDate();
                                var nextDischargeAssessmentDateDisplay;

                                if (recordDate.getTime() < yesterdayDate.getTime()) {
                                    nextDischargeAssessmentDateDisplay = this.getNumOfDaysAgo(person.NEXT_DISCHARGE_ASSESSMENT);
                                    if (this.canModDischarge){
                                        html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-alert-font dcWorklist-next-review-date-label dcWorklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",personId,",",encounterId,", this, event)'>", nextDischargeAssessmentDateDisplay, "</div>");
                                    }
                                    else{
                                        html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-alert-font dcWorklist-next-review-date-label dcWorklist-transparent-line' >", nextDischargeAssessmentDateDisplay, "</div>");
                                    }
                                }
                                else if (recordDate.getTime() < todaysDate.getTime()) {//if the date came before todaysDate
                                    nextDischargeAssessmentDateDisplay = rcm_discharge_i18n.RCM_YESTERDAY;
                                    nextDischargeAssessmentDateDisplay += this.isDueDateTimeEnabled ? " " + RCM_Clinical_Util.formatJsonTimeString(person.NEXT_DISCHARGE_ASSESSMENT, "militaryTime") : "";
                                    if (this.canModDischarge){
                                        html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-alert-font dcWorklist-next-review-date-label dcWorklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",personId, ",",encounterId,", this, event)'>", nextDischargeAssessmentDateDisplay, "</div>");
                                    }
                                    else{
                                        html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-alert-font dcWorklist-next-review-date-label dcWorklist-transparent-line' >", nextDischargeAssessmentDateDisplay, "</div>");
                                    }
                                }
                                else if (recordDate.getTime() < tomorrowDate.getTime()) {
                                    nextDischargeAssessmentDateDisplay = rcm_discharge_i18n.RCM_TODAY;
                                    nextDischargeAssessmentDateDisplay += this.isDueDateTimeEnabled ? " " + RCM_Clinical_Util.formatJsonTimeString(person.NEXT_DISCHARGE_ASSESSMENT, "militaryTime") : "";
                                    if (this.canModDischarge){
                                        html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-plain-bold-font dcWorklist-next-review-date-label dcworklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",personId,",",encounterId,", this, event)'>", nextDischargeAssessmentDateDisplay, "</div>");
                                    }
                                    else{
                                        html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-plain-bold-font dcWorklist-next-review-date-label dcworklist-transparent-line' >", nextDischargeAssessmentDateDisplay, "</div>");
                                    }
                                }
                                else if (recordDate.getTime() < twoDaysFromNowDate.getTime()){
                                    nextDischargeAssessmentDateDisplay = rcm_discharge_i18n.RCM_TOMORROW;
                                    nextDischargeAssessmentDateDisplay += this.isDueDateTimeEnabled ? " " + RCM_Clinical_Util.formatJsonTimeString(person.NEXT_DISCHARGE_ASSESSMENT, "militaryTime") : "";
                                    if (this.canModDischarge){
                                        html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-plain-font dcWorklist-next-review-date-label dcworklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",personId,",",encounterId,", this, event)'>", nextDischargeAssessmentDateDisplay, "</div>");
                                    }
                                    else{
                                        html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-plain-font dcWorklist-next-review-date-label dcworklist-transparent-line' >", nextDischargeAssessmentDateDisplay, "</div>");
                                    }
                                }
                                else {
                                    nextDischargeAssessmentDateDisplay = this.isDueDateTimeEnabled ? " " + RCM_Clinical_Util.formatJsonDateAndTimeString(person.NEXT_DISCHARGE_ASSESSMENT, "longDateTime3") : RCM_Clinical_Util.formatJsonDateString(person.NEXT_DISCHARGE_ASSESSMENT);
                                    if (this.canModDischarge){
                                        html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-plain-font dcWorklist-next-review-date-label dcWorklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",personId,",",encounterId,", this, event)'>", nextDischargeAssessmentDateDisplay, "</div>");
                                    }
                                    else{
                                        html.push("<div id='dcWorklistDateDisplay' class='dcWorklist-plain-font dcWorklist-next-review-date-label dcWorklist-transparent-line' >", this.getDate(person.NEXT_DISCHARGE_ASSESSMENT), "</div>");
                                    }
                                }
                            }

                            html.push("<div id='dcWorklistNextReviewDateLink' class='dcWorklist-next-review-date-img-container'>");
                            html.push("<a href='javascript:VIEWLINK(" + mode + ", \"" + app + "\", \"" + personId + "\", \"" + encounterId + "\", \"" + tab + "\", \"" + viewId + "\", \"" + viewpointId + "\");'>" +
                                            "<img class='dcWorklist-next-review-date-link' src='", this.loc, "\\images\\3738.ico' alt='' onclick='RCM_Worklist.removeDialogandLine();'/></a>");
                            html.push("</div>");
                        html.push("</div>");
                    }

                    //Next Assessment (Last Post Acute Update)
                    html.push("<div class='dcWorklist-loc-pop-out-container'  onclick='RCM_Worklist.openLOCPopOut(this, \"", Number(encounterId), "\")'");
                    var mins = person.LAST_POST_ACUTE_UPDATE_IN_MINS;
                    var lastUpdateType = "";
                    var lastUpdateString = "";
                    var hrs = 0, days = 0, weeks = 0;
                    if (mins == 0) {
                        lastUpdateString = rcm_discharge_i18n.RCM_MISSING_DATA;
                        html.push("<p class='indention2'><span class='secondary-basic'>" + rcm_discharge_i18n.RCM_LAST_POST_ACUTE_UPDATE_TYPE.replace("{1} ({0})", lastUpdateString) + "</span></p>");
                    } else {
                        if (mins < 60) {
                            lastUpdateString = rcm_discharge_i18n.RCM_MINUTES_AGO.replace("{0}", mins);
                            if(mins == 1) {
                               lastUpdateString = rcm_discharge_i18n.RCM_MINUTE_AGO.replace("{0}", mins);
                            }
                        } else {
                            hrs = Math.floor(mins / 60);
                            if (hrs < 24) {
                                lastUpdateString = rcm_discharge_i18n.RCM_HOURS_AGO.replace("{0}", hrs);
                                if(hrs == 1) {
                                   lastUpdateString = rcm_discharge_i18n.RCM_HOUR_AGO.replace("{0}", hrs);
                                }
                            } else {
                                days = Math.floor(hrs / 24);
                                lastUpdateString = rcm_discharge_i18n.RCM_DAYS_AGO.replace("{0}", days);
                                if(days == 1) {
                                   lastUpdateString = rcm_discharge_i18n.RCM_DAY_AGO.replace("{0}", days);
                                }
                            }
                        }
                        switch (person.LAST_POST_ACUTE_UPDATE_TYPE) {
                            case "CURASPAN":
                                //curaspan logic
                                lastUpdateType = rcm_discharge_i18n.RCM_LAST_POST_ACUTE_UPDATE_TYPE.replace("{0}", rcm_discharge_i18n.RCM_CURASPAN);
                                break;
                            case "ENSOCARE":
                                //ensocare logic
                                lastUpdateType = rcm_discharge_i18n.RCM_LAST_POST_ACUTE_UPDATE_TYPE.replace("{0}", rcm_discharge_i18n.RCM_ENSOCARE);
                                break;
                            default:
                                //post_acute logic
                                lastUpdateType = rcm_discharge_i18n.RCM_LAST_POST_ACUTE_UPDATE_TYPE.replace("{0}", rcm_discharge_i18n.RCM_POST_ACUTE);
                                break;
                        }
                        html.push("<p class='indention2'><span class='secondary-basic'>" + lastUpdateType.replace("{1}", lastUpdateString) + "</span></p>");
                        if (RCM_Worklist.referrals[Number(encounterId)]) {
                            for (var i = 0; i < RCM_Worklist.referrals[Number(encounterId)].length; i++) {
                                var encounterReferral = RCM_Worklist.referrals[Number(encounterId)][i];
                                var statusTokens = [];
                                if (encounterReferral.bookedProviders.length === 0) {
                                    if (encounterReferral.acceptedCount > 0) {
                                        statusTokens.push(rcm_discharge_i18n.RCM_LAST_UPDATE_STATUS.replace('{0}', encounterReferral.acceptedDisplay).replace('{1}', encounterReferral.acceptedCount))
                                    }
                                    if (encounterReferral.declinedCount > 0) {
                                        statusTokens.push(rcm_discharge_i18n.RCM_LAST_UPDATE_STATUS.replace('{0}', encounterReferral.declinedDisplay).replace('{1}', encounterReferral.declinedCount))
                                    }
                                } else {
                                    for (var index in encounterReferral.bookedProviders) {
                                        if(encounterReferral.bookedProviders.hasOwnProperty(index)) {
                                            var bookedProvider = encounterReferral.bookedProviders[index];
                                            // check that trimmed name is not empty. Note: Regex here is a polyfill for String.prototype.trim()
                                            if (bookedProvider.name && bookedProvider.name.replace(/^\s+|\s+$/g, '').length > 0) {
                                                statusTokens.push(bookedProvider.name);
                                            }
                                        }
                                    }
                                }
                                if (statusTokens.length > 0) {
                                    if (encounterReferral.bookedProviders.length === 0) {
                                        html.push("<p class='indention2'><span class='referral-status-inflight secondary-basic'>", rcm_discharge_i18n.RCM_LAST_UPDATE_STATUS_LOC.replace("{0}", encounterReferral.levelOfCareAcroynm).replace('{1}', encounterReferral.totalCount), "</span></p>");
                                    } else {
                                        html.push("<p class='indention2'><span class='referral-status-inflight secondary-basic'>", encounterReferral.levelOfCareAcroynm, ":</span></p>");
                                    }

                                    html.push("<p class='indention3'><span class='referral-status-loc secondary-basic'>" + statusTokens.join('; ') + "</span></p>");
                                }
                            }
                        }
                    }
                    html.push("</div>","</td>");//closing container and table data

                    // financial class
                    html.push("<td class='td-border'>");
                        if (!person.PAYER && !person.SECONDARY_PAYER) {
                            html.push("<div><p></p></div>");
                        }
                        else {
                            html.push("<div class='DCWorklistHoverParent'>");
                                // primary health plan
                                if (person.PAYER) {
                                    html.push("<p>", person.PAYER, "</p>");
                                    html.push("<p class='indention2'><span class='secondary-basic'>", person.FINANCIAL_CLASS, "</span></p>");
                                }
                                else{
                                    html.push("<p>", rcm_discharge_i18n.RCM_NO_PRIMARY_PLAN, "</p><br/>");
                                }

                                // secondary health plan
                                if (person.SECONDARY_PAYER) {
                                    html.push("<p>", person.SECONDARY_PAYER, "</p>");
                                    html.push("<p class='indention2'><span class='secondary-basic'>", person.SECONDARY_FINANCIAL_CLASS, "</span></p>");
                                }
                                else{
                                    html.push("<br/>");
                                }

                                // hover
                                html.push("<div class='DCWorklistHover'>");
                                    html.push("<div>");
                                        html.push("<span class='DCWorklistHoverLabel'>", rcm_discharge_i18n.RCM_PRIMARY_PAYER_PLAN, "</span>");
                                        html.push("<span class='DCWorklistHoverValue'>", (person.PAYER || person.HEALTH_PLAN) ? person.PAYER + "/" +
                                                person.HEALTH_PLAN : "", "</span>");
                                    html.push("</div>");
                                    if (person.SECONDARY_PAYER || person.SECONDARY_HEALTH_PLAN)
                                    {
                                        html.push("<div>");
                                        html.push("<span class='DCWorklistHoverLabel'>", rcm_discharge_i18n.RCM_SECONDARY_PAYER_INSURANCE, "</span>");
                                        html.push("<span class='DCWorklistHoverValue'>", (person.SECONDARY_PAYER || person.SECONDARY_HEALTH_PLAN) ? person.SECONDARY_PAYER + "/" +
                                                person.SECONDARY_HEALTH_PLAN : "", "</span>");
                                        html.push("</div>");
                                    }
                                html.push("</div>");
                            html.push("</div>");

                        }
                    html.push("</td>");
                    html.push("</tr>");

                    var idString = 'summaryRow' + encounterId;
                    html.push("<tr id='", idString, "' class='collapse-row'>");
                    var idExpandableString = 'summaryExpandable' + encounterId;
                    html.push("<td style='background:", background, ";' id=", idExpandableString, " colspan='7'></td>");
                    html.push("</tr>");
                }
            }
            html.push("</table>");
            this.createWorklistModifyDialog();
            this.createNoteHover();
            this.createModifyHover();
            this.createRibbonPopOut();
            this.createLOCPopOutShell();
            html.push(this.getReadOnlyDialogHTML());
            html.push(this.getOkDialogHTML());
            html.push(this.getPrintTooManyDialogHTML());
            this.worklistItemCount = worklistItems.length;
            return html.join("");
        },

        createWorklistModifyDialog: function(){
            var modifyDiv = document.createElement("div");
            modifyDiv.id = "dcWorklistModifyDialog";
            modifyDiv.className = "dcWorklist-modify-dialog";
            document.body.appendChild(modifyDiv);
        },

        createNoteHover: function(){
            var hoverDiv = document.createElement("div");
            hoverDiv.id = "dcWorklistNoteHover";
            hoverDiv.className = "dcWorklist-note-hover";
            document.body.appendChild(hoverDiv);

            var extraDiv = document.createElement("div");
            extraDiv.id = "dcWorklistNoteExtra";
            extraDiv.className = "dcWorklist-note-extra";
            document.body.appendChild(extraDiv);
        },
        createModifyHover: function() {
            var hoverDiv = document.createElement("div");
            hoverDiv.id = "dcWorklistModifyHover";
            hoverDiv.className = "dcWorklist-modify-hover";
            document.body.appendChild(hoverDiv);

            var extraDiv = document.createElement("div");
            extraDiv.id = "dcWorklistModifyHoverMenu";
            extraDiv.className = "dcWorklist-modify-hover-menu";
            document.body.appendChild(extraDiv);

            var overlayDiv = document.createElement("div");
            overlayDiv.id = "dcworklistModifyHoverOverlay";
            overlayDiv.className = "dcWorklist-modify-hover-overlay";
            document.body.appendChild(overlayDiv);

            var overlayDiv = document.createElement("div");
            overlayDiv.id = "dcworklistModifyHoverMenuOverlay";
            overlayDiv.className = "dcWorklist-modify-hover-overlay";
            document.body.appendChild(overlayDiv);
        },

        createRibbonPopOut: function(){
            document.body.appendChild(RcmAuthRibbonHelper.createPopOutShell());
        },


        /**
        * function to show dashed line
        */
        showDashedLine: function(name){
            if((($(name).attr("id") === "dcWorklistDCRelationshipDisplay") && ((this.canAddRel===1 || this.canUnassignRel===1) || $(name).text() !== rcm_discharge_i18n.RCM_UNASSIGNED)) || ($(name).attr("id") !== "dcWorklistDCRelationshipDisplay")){
                if($(name).attr("id") === "dcWorklistDCRelationshipDisplay" && this.canUnassignRel===1 && this.canAddRel===0 && $(name).text() === rcm_discharge_i18n.RCM_UNASSIGNED){
                    //Do nothing
                }
                else{
                    if(!($(name).hasClass("dcWorklist-solid-line"))){
                        $(name).removeClass("dcWorklist-transparent-line");
                        $(name).addClass("dcWorklist-dashed-line");
                    }
                }
            }
        },

       /**
        * Function to hide the dashed line
        */
        removeDashedLine: function(name){
            if((($(name).attr("id") === "dcWorklistDCRelationshipDisplay") && ((this.canAddRel===1 || this.canUnassignRel===1) || $(name).text() !== rcm_discharge_i18n.RCM_UNASSIGNED)) || ($(name).attr("id") !== "dcWorklistDCRelationshipDisplay")){
                if($(name).attr("id") === "dcWorklistDCRelationshipDisplay" && this.canUnassignRel===1 && this.canAddRel===0 && $(name).text() === rcm_discharge_i18n.RCM_UNASSIGNED){
                    //Do nothing
                }
                else{
                    if(!($(name).hasClass("dcWorklist-solid-line"))){
                        $(name).removeClass("dcWorklist-dashed-line");
                        $(name).addClass("dcWorklist-transparent-line");
                    }
                }
            }
        },

         /**
        * function to show grey dashed line
        */
        showReadOnlyDashedLine: function(name){
            if(!($(name).hasClass("dcWorklist-solid-line-grey"))){
                $(name).removeClass("dcWorklist-transparent-line");
                $(name).addClass("dcWorklist-dashed-line-grey");
            }
        },

       /**
        * Function to hide the grey dashed line
        */
        removeReadOnlyDashedLine: function(name){
            if(!($(name).hasClass("dcWorklist-solid-line-grey"))){
                $(name).removeClass("dcWorklist-dashed-line-grey");
                $(name).addClass("dcWorklist-transparent-line");
            }
        },
        showModifyDateImg: function(name){
            if(!($(name).find("#dcWorklistDateDisplay").hasClass("dcWorklist-solid-line"))){
                var modifyImg = $(name).find("#dcWorklistNextReviewDateLink");
                $(modifyImg).css("visibility", "visible");
            }
        },

        hideModifyDateImg: function(name){
            var modifyImg = $(name).find("#dcWorklistNextReviewDateLink");
            $(modifyImg).css("visibility", "hidden");
        },

        showModifyHover: function(personId, encounterId, orderType, element, event){
            //If a dialog is open, show a dashed line around this element
            if(this.dcworklistChangeDialog || this.dcworklistReadOnlyDialog){
                $(element).addClass("dcWorklist-dashed-line");
                return false;
            }
            $(".dcWorklist-solid-line-grey").removeClass("dcWorklist-solid-line-grey");
            $(".dcWorklist-solid-line").removeClass("dcWorklist-solid-line");
            $(".diswl-note-image-show").removeClass("diswl-note-image-show");
            this.clearHover();
            if(RCM_Worklist.dcworklistModifyHoverMenu){
                RCM_Worklist.dcworklistModifyHoverMenu.innerHTML = '';
                RCM_Worklist.dcworklistModifyHoverMenu.style.display = 'none';
                RCM_Worklist.dcworklistModifyHoverMenu = null;
            }
            this.hovered = true;
            $(element).addClass("dcWorklist-solid-line");
            this.dcworklistModifyHover = document.getElementById("dcworklistModifyHover");
            this.dcworklistModifyHover.innerHTML = "";
            if(this.orderDetailsLoaded) {
                this.createModifyHoverHTML(personId, encounterId,orderType,element);
            }
            else {
                var html = [];
                html.push("<img src = '",spinnerImage,"'>");
                $("#dcWorklistModifyHover").append(html.join(""));

                var listener = setInterval(function(){
                    if(RCM_Worklist.orderDetailsLoaded) {
                        RCM_Worklist.showModifyHover(personId,encounterId, orderType, element,event);
                        clearInterval(listener);
                    }
                },300);
            }
            this.createModifyHoverMenuHTML();

            var pos = this.getMousePosition(element, event);
            this.dcworklistModifyHover.style.top = pos.y + 'px';
            this.dcworklistModifyHover.style.left = pos.x + 'px';
            this.dcworklistModifyHover.style.display = 'block';

            this.dcworklistModifyHoverOverlay = document.getElementById("dcworklistModifyHoverOverlay");
            overlayPosY = pos.y - 20;
            overlayPosX = pos.x - 20;
            this.dcworklistModifyHoverOverlay.style.top = overlayPosY + 'px';
            this.dcworklistModifyHoverOverlay.style.left = overlayPosX + 'px';
            this.dcworklistModifyHoverOverlay.style.display = 'block';
            this.sizeModifyHoverOverlay();

            var topRightPos = this.getMousePositionTopRight(element, event);
            $("#dcWorklistModifyHover, #dcWorklistModifyHoverMenu, #dcworklistModifyHoverOverlay, #dcworklistModifyHoverMenuOverlay").hover(function(){
                RCM_Worklist.hovered = true;
            }, function(){
                RCM_Worklist.hovered = false;
                RCM_Worklist.hideModifyHover(element);
            });

            var menuHovered = false;
            $("#dcWorklistModifyHoverMenu, #dcworklistModifyHoverMenuOverlay").hover(function(){
                menuHovered = true;
            }, function() {
                menuHovered = false;
                setTimeout(function(){
                    if(!menuHovered){
                        $("#dcWorklistModifyHoverMenu").hide();
                        $("#dcworklistModifyHoverMenuOverlay").hide();
                    }
                }, 300);
            });

        },
        showModifyHoverMenu: function(personId, encounterId, taskId, chartMode, element, event){
            this.dcworklistModifyHoverMenu = document.getElementById("dcWorklistModifyHoverMenu");
            var topRightPos = this.getMousePositionTopRight(element, event);
            this.dcworklistModifyHoverMenu.style.top = topRightPos.y + 'px';
            this.dcworklistModifyHoverMenu.style.left = topRightPos.x + 'px';
            this.dcworklistModifyHoverMenu.style.display = 'block';

            this.dcworklistModifyHoverMenuOverlay = document.getElementById("dcworklistModifyHoverMenuOverlay");
            overlayPosY = topRightPos.y - 20;
            overlayPosX = topRightPos.x - 20;
            overlayWidth = this.dcworklistModifyHoverMenu.offsetWidth + 50;
            overlayHeight = this.dcworklistModifyHoverMenu.offsetHeight + 50;
            this.dcworklistModifyHoverMenuOverlay.style.top = overlayPosY + 'px';
            this.dcworklistModifyHoverMenuOverlay.style.left = overlayPosX + 'px';
            this.dcworklistModifyHoverMenuOverlay.style.width = overlayWidth + 'px';
            this.dcworklistModifyHoverMenuOverlay.style.height = overlayHeight + 'px';
            this.dcworklistModifyHoverMenuOverlay.style.display = 'block';
            if(chartMode === "CHART_DONE") {
                $(".dcWorklist-task-done-with-date-time").show();
            }
            else {
                $(".dcWorklist-task-done-with-date-time").hide();
            }
            $("li.dcWorklist-task-action-menu-item").unbind("click").click(function() {
                if($(this).hasClass("dcWorklist-task-not-done")) {
                    chartMode = "CHART_NOT_DONE";
                }
                else if ($(this).hasClass("dcWorklist-task-done-with-date-time")) {
                    chartMode = "CHART_DONE_DT_TM";
                }
                RCM_Worklist.chartTask(personId, encounterId, taskId, chartMode);
            });


        },
        hideModifyHover: function(element){
            setTimeout(function(){
                if(!RCM_Worklist.hovered){
                    if(document.selection) {
                        document.selection.empty();
                    }
                    $(element).removeClass("dcWorklist-solid-line dcWorklist-dashed-line");
                    if(RCM_Worklist.dcworklistModifyHover){
                        RCM_Worklist.dcworklistModifyHover.innerHTML = '';
                        RCM_Worklist.dcworklistModifyHover.style.display = 'none';
                        RCM_Worklist.dcworklistModifyHover = null;
                    }
                    if(RCM_Worklist.dcworklistModifyHoverMenu){
                        RCM_Worklist.dcworklistModifyHoverMenu.innerHTML = '';
                        RCM_Worklist.dcworklistModifyHoverMenu.style.display = 'none';
                        RCM_Worklist.dcworklistModifyHoverMenu = null;
                    }
                    if(RCM_Worklist.dcworklistModifyHoverOverlay){
                        RCM_Worklist.dcworklistModifyHoverOverlay.style.display = 'none';
                        RCM_Worklist.dcworklistModifyHoverOverlay = null;
                    }
                    if(RCM_Worklist.dcworklistModifyHoverMenuOverlay){
                        RCM_Worklist.dcworklistModifyHoverMenuOverlay.style.display = 'none';
                        RCM_Worklist.dcworklistModifyHoverMenuOverlay = null;
                    }
                    $(window).resize();
                }
            },300);
        },
        chartTask: function(patientId, encounterId, taskId, chartMode, element) {
            var collection = window.external.DiscernObjectFactory("INDEXEDDOUBLECOLLECTION");
            collection.Add(taskId);
            var taskObject = window.external.DiscernObjectFactory("TASKDOC");
            var success = taskObject.DocumentTasks(window, patientId, collection, chartMode);
            if(success) {
                setTimeout(function() {
                    //hides the hover so the user is forced to reopen it if they want to see the updated status
                    $("#dcWorklistModifyHover").mouseout();
                    var request = {
                        encounterId: encounterId,
                        worklistType: "DISCHARGE"
                    };
                    var json = "^" + JSON.stringify(request) + "^";
                    var program = "RCM_JSON_SERVICE";
                    var paramAr = [];
                    paramAr.push("^MINE^", "0.0", "^GetWorklistOrdersByEncounter^", json);
                    var updatedOrders = RCM_Worklist.makeCall(program, paramAr, 0);
                    updatedOrders = JSON.parse(decodeURIComponent(JSON.stringify(updatedOrders)));

                    var orderDetailsCriteria = [];
                    $.each(RCM_Worklist.worklistItems, function(i, item){
                        if (patientId == item.PATIENT_ID && encounterId == item.ENCOUNTER_ID) {
                            item.CONSULT_ORDERS = updatedOrders.serviceData.consultOrders;
                            item.DISCHARGE_ORDERS = updatedOrders.serviceData.dischargeOrders;
                            item.DISCERN_ORDERS = updatedOrders.serviceData.discernOrders;
                        }
                        $.each(item.DISCHARGE_ORDERS.concat(item.CONSULT_ORDERS).concat(item.DISCERN_ORDERS), function(j, order) {
                            orderDetailsCriteria.push({
                                "orderId": parseFloat(order.ID),
                                "orderingProviderId": parseFloat(order.ORDERINGPROVIDERID)
                            });
                        });
                    });
                    if(orderDetailsCriteria.length > 0)
                    {
                        request = {"orderDetailsCriteria": orderDetailsCriteria};
                        json = "^" + JSON.stringify(request) + "^";
                        paramAr = [];
                        paramAr.push("^MINE^", "0.0", "^GetOrderDetailsByOrderIds^", json);
                        var orderDetailsRecordData = RCM_Worklist.makeTimerCall(RCM_Worklist.component, program, paramAr, 0, true);
                        if(orderDetailsRecordData) {
                            RCM_Worklist.orderDetails = orderDetailsRecordData.serviceData;
                            RCM_Worklist.orderDetailsLoaded = true;
                        }
                        else {
                            RCM_Worklist.openLoadOrderDetailsErrorDialog();
                        }
                    }
                }, 500);
            }
        },

        showNoteImg: function(name){
            if(this.noteTaskAccess && !$.isEmptyObject(this.noteTypes)){
                $(name).find(".diswl-note-image-hidden").css("visibility","visible");
            }
        },

        hideNoteImg: function(name){
            $(name).find(".diswl-note-image-hidden").css("visibility","hidden");
        },

        keepNoteImgVisible: function(name){
            $(name).addClass("diswl-note-image-show");
        },

        noteImgClickEvent: function(personId, encounterId, img, event){
            $(img).removeClass("dcWorklist-dashed-line");
            this.removeDialogandLine();
            this.showNoteHover(personId, encounterId, img, event);
        },
        orderClickEvent: function(personId, encounterId, orderType, element, event){
            $(".dcWorklist-dashed-line").removeClass("dcWorklist-dashed-line");
            this.removeDialogandLine();
            this.showModifyHover(personId, encounterId, orderType, element, event);
        },

        showNoteHover: function(personId, encounterId, img, event){
            if(this.dcworklistChangeDialog != null || this.dcworklistReadOnlyDialog){
                $(img).addClass("dcWorklist-dashed-line");
                return false;
            } else if ($(img).hasClass("diswl-note-image-edit")){
                return false;
            }

            $(".dcWorklist-solid-line").removeClass("dcWorklist-solid-line");
            $(".dcWorklist-solid-line-grey").removeClass("dcWorklist-solid-line-grey");
            $(".diswl-note-image-show").removeClass("diswl-note-image-show");
            this.clearHover();

            this.hovered = true;
            $(img).addClass("dcWorklist-solid-line");
            if($(img).hasClass("diswl-note-image-hidden")){
                $(img).addClass("diswl-note-image-show");
            }

            this.dcworklistNoteHover = document.getElementById("dcWorklistNoteHover");
            this.dcworklistNoteExtra = document.getElementById("dcWorklistNoteExtra");

            this.dcworklistNoteHover.innerHTML = "";
            this.createNoteHoverHTML(personId, encounterId);
            this.dcworklistNoteExtra.innerHTML = "<div class='dcWorklist-note-extra-inner'></div>"; //width = Hover width + border - icon width

            var pos = this.getMousePosition(img, event);
            this.dcworklistNoteHover.style.top = pos.y + 'px';
            this.dcworklistNoteHover.style.left = pos.x + 'px';
            this.dcworklistNoteHover.style.display = 'block';

            var topRightPos = this.getMousePositionTopRight(img, event);
            this.dcworklistNoteExtra.style.top = topRightPos.y + 'px';
            this.dcworklistNoteExtra.style.left = topRightPos.x + 'px';
            this.dcworklistNoteExtra.style.display = 'block';

            $("#dcWorklistNoteHover, #dcWorklistNoteExtra").hover(function(){
                RCM_Worklist.hovered = true;
            }, function(){
                RCM_Worklist.hovered = false;
                RCM_Worklist.hideNoteHover(img);
            });

            $("div[id^='noteDiv']").hover(function(){
                $(this).find(".dcWorklist-note-hover-menu").css("visibility", "visible");
            }, function(){
                $(this).find(".dcWorklist-note-hover-menu").css("visibility", "hidden");
            });

            $(".dcWorklist-note-delete-image").hover(function(){
                $(this).attr('src', imageLocDeleteOver);
            }, function(){
                $(this).attr('src', imageLocDeleteUp);
            }).click(function(){
                var deleteNote = $(this).parents("div[id^='noteDiv']:first").data('note');
                $("body").append(RCM_Worklist.getNoteDeleteDialogHTML());
                $("#dcWorklistNoteDeleteDialog").show();
                $("#listBlockingDiv").show();
                RCM_Clinical_Util.setFocus("dcWorklistNoteDeleteBtnOk");

                $("#dcWorklistNoteDeleteBtnOk").click(function(){
                    RCM_Worklist.deleteNote(deleteNote);
                });

                $("#dcWorklistNoteDeleteBtnCancel").click(function(){
                    $("#listBlockingDiv").hide();
                    $("#dcWorklistNoteDeleteDialog").remove();
                });
            });

            $(".dcWorklist-note-edit-image").hover(function(){
                $(this).attr('src', imageLocEditOver);
            }, function(){
                $(this).attr('src', imageLocEditUp);
            }).click(function(){
                var modifyDiv = $(this).parents("div[id^='noteDiv']:first");
                var modifyNote = modifyDiv.data('note');
                RCM_Worklist.convertNoteHoverToDialog(personId, encounterId, "MODIFY", modifyNote, modifyDiv.attr('id'));
            });
        },

        hideNoteHover: function(img){
            setTimeout(function(){
                if(!RCM_Worklist.hovered){
                    if(document.selection) {
                        document.selection.empty();
                    }
                    $(img).removeClass("dcWorklist-solid-line dcWorklist-dashed-line");
                    $(".diswl-note-image-show").removeClass("diswl-note-image-show");
                    if(RCM_Worklist.dcworklistNoteHover){
                        RCM_Worklist.dcworklistNoteHover.innerHTML = '';
                        RCM_Worklist.dcworklistNoteHover.style.display = 'none';
                        RCM_Worklist.dcworklistNoteHover = null;
                    }
                    if(RCM_Worklist.dcworklistNoteExtra){
                        RCM_Worklist.dcworklistNoteExtra.innerHTML = '';
                        RCM_Worklist.dcworklistNoteExtra.style.display = 'none';
                        RCM_Worklist.dcworklistNoteExtra = null;
                    }
                    $(window).resize();
                }
            }, 5);
        },

        deleteNote: function(note){
            var jsonRequest = {
                "delete_note_request":{
                    "note_id": note.ID,
                    "update_cnt": note.VERSION
                }
            };
            RCM_Worklist.deleteCareNote(jsonRequest,function(status, recordData){
                $("#listBlockingDiv").hide();
                $("#dcWorklistNoteDeleteDialog").remove();
                if (status === 'S'){
                    $.each(RCM_Worklist.worklistItems, function(i, item){
                        if((note.PARENTENTITYNAME === "PERSON" && note.PARENTENTITYID === item.PATIENT_ID) ||
                                (note.PARENTENTITYNAME === "ENCOUNTER" && note.PARENTENTITYID === item.ENCOUNTER_ID)){
                            var spliceIndex = getNoteSpliceIndex(note, item.NOTES);
                            if(spliceIndex > -1){ //spliceIndex should never be -1 on a delete
                                item.NOTES.splice(spliceIndex, 1);
                                if(item.NOTES.length === 0){
                                    $("img[name='dcWorklistNoteImg_" + item.ENCOUNTER_ID + "']").css('visibility', 'hidden');
                                    $("img[name='dcWorklistNoteImg_" + item.ENCOUNTER_ID + "']").removeClass("diswl-note-image").addClass("diswl-note-image-hidden");
                                    $("img[name='dcWorklistNoteImg_" + item.ENCOUNTER_ID + "']").attr("src", newNoteImage);
                                }
                            }
                            if(note.PARENTENTITYNAME === "ENCOUNTER"){
                                return false;
                            }
                        }
                    });
                }
                else{
                    var exception = recordData.EXCEPTIONINFORMATION[0];
                    if (exception.EXCEPTIONTYPE === "STALE_DATA"){
                        RCM_Worklist.openStaleDataDialog();
                    }
                    else{
                        RCM_Worklist.openSaveFailedDialog();
                    }
                }
            },true);
        },

        convertNoteHoverToDialog: function(personId, encounterId, type, note, divId){

            var $notesDiv = $("#notesDiv").clone(true);
            var $noteCountDiv = $("#noteCountDiv").clone(true);
            $noteCountDiv.css("padding-left", "31%");
            this.clearHover();
            this.dcworklistChangeDialog = document.getElementById("dcWorklistModifyDialog");
            this.dcworklistChangeDialog.innerHTML = this.showNoteDialog();

            var hvrParent = $("#dischargeNotePersistCheckLabel").get(0);
            var hvrChild = $("#persistHover").get(0);
            hs(hvrParent, hvrChild);

            $("#dischargeNoteType").change(function(){
                var noteTypeObj = RCM_Worklist.noteTypes[$(this).val()];
                if(noteTypeObj && noteTypeObj.onlyImportant){
                    if(!$("#dischargeNoteImportantCheck").prop("checked")){
                        $("#dischargeNoteImportantCheck").prop("checked", true);
                        $("#dischargeNoteImportantCheck").data('defaultChecked', true);
                    }
                    $("#dischargeNoteImportantCheck").prop("disabled", true);
                } else {
                    if($("#dischargeNoteImportantCheck").data('defaultChecked')){
                        $("#dischargeNoteImportantCheck").prop("checked", false);
                        $("#dischargeNoteImportantCheck").data('defaultChecked', false);
                    }
                    $("#dischargeNoteImportantCheck").prop("disabled", false);
                }
            });

            $("#dischargeNoteTextArea").bind('keyup drop', function(){
                if(this.value.length > 500){
                    $(this).val(this.value.substring(0, 500));
                }
            });

            $("#dischargeNoteTextArea").bind('paste', function(){
                var newText = this.value;
                newText += window.clipboardData.getData("Text");
                newText = newText.substring(0, 500);
                $("#dischargeNoteTextArea").val(newText);
                return false;
            });

            $("#dcWorklistModifyDialog").append("<div class='dcWorklist-note-separator'></div>")
                    .append($("<div class='dcWorklist-note-dialog'></div>")
                            .append("<div class='dcWorklist-note-edit-clear'></div>")
                            .append($notesDiv)
                            .append($noteCountDiv));
            $(".dcWorklist-note-hover-menu").css("visibility", "hidden");

            $("#noteCountDiv").hide();
            $(".dcWorklist-note-separator").hide();
            $("#notesDiv").hide();

            var img = $(".dcWorklist-solid-line");
            $(img).addClass("diswl-note-image-edit");
            var pos = this.getMousePosition(img, event);
            this.dcworklistChangeDialog.style.top = pos.y + 'px';
            this.dcworklistChangeDialog.style.left = pos.x + 'px';
            this.dcworklistChangeDialog.style.display = 'block';

            $("#dischargeNoteCancel").click(function(){
                RCM_Worklist.removeDialogandLine();
            });

            if(type === "ADD"){
                $("#dischargeNoteSave").click(function(){
                    var prntEntityName;
                    var prntEntityid;
                    var noteTypeCode;
                    var noteText;
                    var notePriorityMeaning;

                    $("#dischargeNoteSave").prop("disabled", true);
                    if($('#dischargeNotePersistCheck').prop("checked")){
                        prntEntityName = "PERSON";
                        prntEntityid = String(personId);
                    } else {
                        prntEntityName = "ENCOUNTER";
                        prntEntityid = String(encounterId);
                    }
                    noteTypeCode = $("#dischargeNoteType").val();
                    noteText = RCM_Clinical_Util.encodeString($('#dischargeNoteTextArea').val());

                    if($('#dischargeNoteImportantCheck').prop("checked")){
                        notePriorityMeaning = "HIGH";
                    } else {
                        notePriorityMeaning = "NORMAL";
                    }

                    var jsonRequest = {
                        "add_note_request":{
                            "parent_entity_name": prntEntityName,
                            "parent_entity_id": prntEntityid,
                            "note_type_cd":noteTypeCode,
                            "note_text":noteText,
                            "note_priority_meaning": notePriorityMeaning
                        }
                    };
                    RCM_Worklist.addCareNote(jsonRequest,function(status, recordData){
                        $("#dischargeNoteSave").prop("disabled", false);
                        if (status === 'S'){
                            var addedNote = {
                                "ID" : recordData.NOTE_ID,
                                "TYPECD" : noteTypeCode,
                                "TYPEDISP" : RCM_Worklist.noteTypes[noteTypeCode].display,
                                "TEXT" : noteText,
                                "PRIORITYMEANING" : notePriorityMeaning,
                                "PARENTENTITYNAME" : prntEntityName,
                                "PERSONNELNAMEFULL" : recordData.PERSONNEL_NAME,
                                "UPDATEDTTM" : recordData.UPDATE_DT_TM,
                                "VERSION" : 0
                            };
                            //personId is a number, item.PATIENT_ID is a string in the standard form X.XXXXXXXE7
                            var encountersWithoutIcons = [];
                            $.each(RCM_Worklist.worklistItems, function(i, item){
                                if((prntEntityName === "PERSON" && personId == item.PATIENT_ID) || (personId == item.PATIENT_ID && encounterId == item.ENCOUNTER_ID)){
                                    if(item.NOTES.length === 0){
                                        encountersWithoutIcons.push(item.ENCOUNTER_ID);
                                    }
                                    if(prntEntityName ==="PERSON"){
                                        addedNote.PARENTENTITYID = item.PATIENT_ID;
                                    } else {
                                        addedNote.PARENTENTITYID = item.ENCOUNTER_ID;
                                    }
                                    item.NOTES = [addedNote].concat(item.NOTES);

                                    if(prntEntityName !== "PERSON"){
                                        return false;
                                    }
                                }
                            });
                            $.each(encountersWithoutIcons, function(i, val){
                                $("img[name='dcWorklistNoteImg_" + val + "']").css('visibility', 'visible');
                                $("img[name='dcWorklistNoteImg_" + val + "']").removeClass("diswl-note-image-hidden").addClass("diswl-note-image");
                                $("img[name='dcWorklistNoteImg_" + val + "']").attr("src", noteImage);
                            });

                            $("#dischargeNotePersistCheckLabel").get(0).onmouseleave();
                            RCM_Worklist.removeDialogandLine();
                        } else {
                            alert("Error Saving Note");
                        }
                    },true);
                });

                $("#noteDiv" + (this.notesToShow - 1)).remove();
                if($("div[id^='noteDiv']").length){
                    var ofIndex = $("#noteCountLabel").text().indexOf(" " + rcm_discharge_i18n.RCM_OF);
                    if(ofIndex){
                        var noteCountText = $("div[id^='noteDiv']").length + $("#noteCountLabel").text().substring(ofIndex);
                        $("#noteCountLabel").text(noteCountText);
                    }
                }

            } else if(type === "MODIFY"){
                $("#dischargeNoteSave").click(function(){
                    var prntEntityName;
                    var prntEntityid;
                    var noteTypeCode;
                    var noteText;
                    var notePriorityMeaning;

                    $("#dischargeNoteSave").prop("disabled", true);
                    if($('#dischargeNotePersistCheck').prop("checked")){
                        prntEntityName = "PERSON";
                        prntEntityid = String(personId);
                    } else {
                        prntEntityName = "ENCOUNTER";
                        prntEntityid = String(encounterId);
                    }
                    noteTypeCode = $("#dischargeNoteType").val();
                    noteText = RCM_Clinical_Util.encodeString($('#dischargeNoteTextArea').val());

                    if($('#dischargeNoteImportantCheck').prop("checked")){
                        notePriorityMeaning = "HIGH";
                    } else {
                        notePriorityMeaning = "NORMAL";
                    }

                    var jsonRequest = {
                        "modify_note_request":{
                            "note_id": note.ID,
                            "parent_entity_name": prntEntityName,
                            "parent_entity_id": prntEntityid,
                            "note_type_cd":noteTypeCode,
                            "note_text":noteText,
                            "note_priority_meaning": notePriorityMeaning,
                            "update_cnt": note.VERSION
                        }
                    };
                    RCM_Worklist.modifyCareNote(jsonRequest,function(status, recordData){
                        $("#dischargeNoteSave").prop("disabled", false);
                        if (status === 'S'){
                            var modifiedNote = {
                                "ID" : note.ID,
                                "TYPECD" : noteTypeCode,
                                "TYPEDISP" : RCM_Worklist.noteTypes[noteTypeCode].display,
                                "TEXT" : noteText,
                                "PRIORITYMEANING" : notePriorityMeaning,
                                "PARENTENTITYNAME" : prntEntityName,
                                "PERSONNELNAMEFULL" : recordData.PERSONNEL_NAME,
                                "UPDATEDTTM" : recordData.UPDATE_DT_TM,
                                "VERSION" : note.VERSION + 1
                            };
                            $.each(RCM_Worklist.worklistItems, function(i, item){
                                var spliceIndex = getNoteSpliceIndex(note, item.NOTES);
                                if(spliceIndex > -1){
                                    item.NOTES.splice(spliceIndex, 1);
                                }
                                if((prntEntityName === "PERSON" && personId == item.PATIENT_ID) || (personId == item.PATIENT_ID && encounterId == item.ENCOUNTER_ID)){
                                    if(spliceIndex === -1){
                                        $("img[name='dcWorklistNoteImg_" + item.ENCOUNTER_ID + "']").css('visibility', 'visible');
                                        $("img[name='dcWorklistNoteImg_" + item.ENCOUNTER_ID + "']").removeClass("diswl-note-image-hidden").addClass("diswl-note-image");
                                        $("img[name='dcWorklistNoteImg_" + item.ENCOUNTER_ID + "']").attr("src", noteImage);
                                    }
                                    if(prntEntityName ==="PERSON"){
                                        modifiedNote.PARENTENTITYID = item.PATIENT_ID;
                                    } else {
                                        modifiedNote.PARENTENTITYID = item.ENCOUNTER_ID;
                                    }
                                    item.NOTES = [modifiedNote].concat(item.NOTES);
                                } else if(spliceIndex > -1 && item.NOTES.length === 0){
                                    $("img[name='dcWorklistNoteImg_" + item.ENCOUNTER_ID + "']").css('visibility', 'hidden');
                                    $("img[name='dcWorklistNoteImg_" + item.ENCOUNTER_ID + "']").removeClass("diswl-note-image").addClass("diswl-note-image-hidden");
                                    $("img[name='dcWorklistNoteImg_" + item.ENCOUNTER_ID + "']").attr("src", newNoteImage);
                                }
                            });

                            $("#dischargeNotePersistCheckLabel").get(0).onmouseleave();
                            RCM_Worklist.removeDialogandLine();
                        } else {
                            var exception = recordData.EXCEPTIONINFORMATION[0];
                            if (exception.EXCEPTIONTYPE === "STALE_DATA"){
                                RCM_Worklist.openStaleDataDialog();
                            }
                            else{
                                RCM_Worklist.openSaveFailedDialog();
                            }
                        }
                    },true);
                });

                $("#dischargeNoteType").val(note.TYPECD);
                $('#dischargeNoteTextArea').val(RCM_Clinical_Util.decodeString(note.TEXT));
                $('#dischargeNoteImportantCheck').prop('checked', note.PRIORITYMEANING === "HIGH");
                $("#dischargeNoteType").change();
                $('#dischargeNotePersistCheck').prop('checked', note.PARENTENTITYNAME === "PERSON");

                $("#" + divId).remove();
                $(".dcWorklist-note-odd").removeClass("dcWorklist-note-odd");
                $(".dcWorklist-note").filter(":odd").addClass("dcWorklist-note-odd");

            }

            $.each($("div[id^='noteDiv']"), function(i, val){
                $("#noteCountDiv").show();
                $(".dcWorklist-note-separator").show();
                $("#notesDiv").show();
                $(this).unbind('mouseenter mouseleave');
            });

            var formObject = {};
            RCM_Clinical_Util.addRequiredField(formObject, "dischargeNoteType", "select", ["dischargeNoteSave"]);
            RCM_Clinical_Util.addRequiredField(formObject, "dischargeNoteTextArea", "textarea", ["dischargeNoteSave"]);

        },

      /**
        * opens dialogue to modify relationships
        */
        openWorklistModifyDialog: function(personId, encounterId, name, event){
            if((($(name).attr("id") === "dcWorklistDCRelationshipDisplay") && ((this.canAddRel===1 || this.canUnassignRel===1) || $(name).text() !== rcm_discharge_i18n.RCM_UNASSIGNED)) || ($(name).attr("id") !== "dcWorklistDCRelationshipDisplay")){
                if($(name).attr("id") === "dcWorklistDCRelationshipDisplay" && this.canUnassignRel===1 && this.canAddRel===0 && $(name).text() === rcm_discharge_i18n.RCM_UNASSIGNED){
                    //Do nothing
                }
                else{
                    this.clearDialogs();

                    //Removes any open note hover
                    this.clearHover();

                    //Removes the solid border and background color around any other element
                    //on the worklist so that the element clicked is the only one with the solid
                    //line and background color
                    if($("#tableDiv").find("span, div, img").hasClass("dcWorklist-solid-line") && !($(name).hasClass("dcWorklist-solid-line"))){
                        $(".dcWorklist-solid-line").addClass("dcWorklist-transparent-line");
                        $(".dcWorklist-solid-line").removeClass("dcWorklist-solid-line");

                    }
                    $(".dcWorklist-solid-line-grey").removeClass("dcWorklist-solid-line-grey");
                    //Hide note icons that were previously showing due to edit mode
                    $(".diswl-note-image-show").removeClass("diswl-note-image-show");
                    $(".diswl-note-image-edit").removeClass("diswl-note-image-edit");

                    if($(name).attr("id") === "dcWorklistDateDisplay"){
                        $(name).parent().children("#dcWorklistNextReviewDateLink").css("visibility", "hidden");
                    }

                    //Removes the dashed border around the label hovered over,
                    //adds a solid border and background color, creates the modify
                    //dialog and opens it
                    $(".dcWorklist-dashed-line").removeClass("dcWorklist-dashed-line");
                    $(name).addClass("dcWorklist-solid-line");

                    this.dcworklistChangeDialog = document.getElementById("dcWorklistModifyDialog");
                    this.dcworklistChangeDialog.innerHTML = this.createModifyDialog(name, personId, encounterId);

                    var pos = this.getMousePosition(name, event);
                    this.dcworklistChangeDialog.style.top = pos.y + 'px';
                    this.dcworklistChangeDialog.style.left = pos.x + 'px';

                    this.dcworklistChangeDialog.style.display = 'block';

                    //If dialog is for the discharge status, select the previously
                    //save status in the dropdown
                    if($(name).attr("id") === "dcWorklistStatusDisplay"){
                        var parentId = $(name).closest("div").attr("id");
                        var valueCd = parentId.substring(16);
                        var $dcModifyDropdown = $("#dcWorklist-modify-dcStatus");
                        if($dcModifyDropdown.length > 0){
                            var $optionDCS = $('option', $dcModifyDropdown);
                            $optionDCS.each(function(){
                                if($(this).val() === valueCd){
                                    $(this).prop('selected', true);
                                }
                            });
                        }
                    }
                    //If the dialog is for the assessment date, set the date in the
                    //datepicker
                    if($(name).attr("id") === "dcWorklistDateDisplay"){
                        var date;
                        if($(name).hasClass("dcWorklist-date")){ //This class is assigned when a due date is edited
                            var temp = $("div.dcWorklist-solid-line").text();
                            if(temp === rcm_discharge_i18n.RCM_NO_DATE){
                                date = "";
                            }
                            else{
                                var presetDate = temp;
                            }
                        }
                        else{
                            //This value is never updated so it can only be used for the first edit
                            date = $("#dcWorklistAssessmentDatePicker").val();
                        }
                        RCM_Clinical_Util.addDatePicker(this.component, "dcWorklistAssessmentDatePicker");
                        if (this.isDueDateTimeEnabled) {
                            RCM_Clinical_Util.addTimePicker("dcWorklistAssessmentTimePicker");
                        }
                        if(presetDate){
                            if (this.isDueDateTimeEnabled) {
                                // presetDate is expected to already be in the form "mm/dd/yyyy HH:MM". Set in saveNewReviewDate.
                                $("#dcWorklistAssessmentDatePicker").val(new Date(presetDate).format("shortDate2")); // mm/dd/yyyy
                                $("#dcWorklistAssessmentTimePicker").val(new Date(presetDate).format("militaryTime")); //HH:MM
                            } else {
                                $("#dcWorklistAssessmentDatePicker").val(presetDate);
                            }
                        }else{
                            RCM_Clinical_Util.setDateString("dcWorklistAssessmentDatePicker", date);
                            if (this.isDueDateTimeEnabled) {
                                RCM_Clinical_Util.setTimeString("dcWorklistAssessmentTimePicker", date);
                            }
                        }
                    }

                    //If the dialog is for the dc relationship, populate the dialog with
                    //the list of previously saved managers and add a listener to the
                    //personnel search textbox
                    if($(name).attr("id") === "dcWorklistDCRelationshipDisplay"){
                        var relationshipTypeCd = $(name).closest("dl").attr("id");
                        if(relationshipTypeCd){
                            relationshipTypeCd = relationshipTypeCd.substring(13);
                        }
                        var listNumber = $(name).closest("dd").attr("id");
                        if(listNumber){
                            listNumber = listNumber.substring(19);
                            listNumber = Number(listNumber);
                        }
                        var tableDiv = document.getElementById("dischargeManagersTableDiv");
                        if(!listNumber && listNumber !== 0){
                            var info = this.getPersonData(personId, encounterId);
                            tableDiv.innerHTML = this.populateTable(info.CARE_MGMT_RELTN);
                        }
                        else if(listNumber === 0){
                            tableDiv.innerHTML = this.populateTable(this.originalManagersRelOne);
                        }
                        else{
                            tableDiv.innerHTML = this.populateTable(this.originalManagersRelTwo);
                        }
                        this.renumberDischargeManagerRows();
                        if(this.canAddRel === 1){
                            providerSearchControl = new ProviderSearchControl(document.getElementById("dcWorklistProviderSearch"));
                            personnelSearchControlListener = function(){
                                //Add id to dischargeRelationship array
                                newPersonnelIdToBeAdded = providerSearchControl.getSelectedProviderId();
                                var newPersonnelNameToBeAdded = $("#dcWorklistProviderSearch").val();
                                if(newPersonnelIdToBeAdded !== "" && newPersonnelNameToBeAdded !== ""){
                                    var newDischargeManagerEntry = {
                                        "ID": "",
                                        "PERSONNELID": newPersonnelIdToBeAdded,
                                        "TYPECD": "",
                                        "TYPEDISPLAY": "",
                                        "NAMEFULL": newPersonnelNameToBeAdded
                                    };
                                    var isAlreadyInList = false;
                                    for(var i = 0; i < RCM_Worklist.dischargeRelationship.length; i++){
                                        if(Number(RCM_Worklist.dischargeRelationship[i].PERSONNELID) === Number(newDischargeManagerEntry.PERSONNELID) && RCM_Worklist.dischargeRelationship[i].NAMEFULL === newDischargeManagerEntry.NAMEFULL){
                                            isAlreadyInList = true;
                                            break;
                                        }
                                    }
                                    if(!isAlreadyInList){
                                        var newArray = [];
                                        if(RCM_Worklist.dischargeRelationship && RCM_Worklist.dischargeRelationship.length > 0){
                                            newArray = RCM_Worklist.dischargeRelationship.reverse();
                                        }

                                        // Add new prsnl to the dischargeRelationship.
                                        newArray.push(newDischargeManagerEntry);
                                        RCM_Worklist.dischargeRelationship = newArray.reverse();

                                        //Add new personnel row to table in dialog
                                        var tableRowHTML = [];
                                        tableRowHTML.push("<tr id='",newPersonnelIdToBeAdded,"' class='dcworklistDischargeManagersRow' onMouseOver='RCM_Worklist.highlightAndShowX(this)' onMouseOut='RCM_Worklist.removeHighlightAndHideX(this)'><td><div class='dcWorklist-float-left'><span id='dcWorklistDischargeManagersNumbering' class='dcWorklist-discharge-manager-numbers'></span><span>",newPersonnelNameToBeAdded,"</span></div><div id='dcworklistRemoveX' class='dcWorklist-X-float-right dcWorklist-remove-x' onMouseOver='RCM_Worklist.switchXToOtherXImage(this)' onMouseOut='RCM_Worklist.switchXToOtherXImage(this)' onclick='RCM_Worklist.removeRowFromDischargeManagerTable(this)'></div></td></tr>");
                                        $("#dischargeManagersFirstEmptyRow").after(tableRowHTML.join(""));
                                        //Renumber rows
                                        RCM_Worklist.renumberDischargeManagerRows();
                                    }
                                    //Reset providerSearchControl
                                    providerSearchControl.setSelectedProvider("","");
                                }
                            };
                            providerSearchControl.addVerifyStateChangeListener(personnelSearchControlListener);
                        }
                    }
                }
            }
        },

        /**
        * creates dialogue to modify relationships
        */
        createModifyDialog: function(name, personId, encounterId){
            var html = [];
            if ($(name).attr("id") === "dcWorklistStatusDisplay"){
                html.push("<div id='dcWorklistModifyInlineEditingDialog'>");
                html.push("<select id='dcWorklist-modify-dcStatus' class='dcWorklist-input-select'>");
                html.push("<option value=''></option>");
                for(var i = 0; i < this.statusCodes.length; i++){
                    html.push("<option value='",this.statusCodes[i].VALUE,"'>", this.statusCodes[i].DISPLAY, "</option>");
                }
                html.push("</select>");
                html.push("<span class='dcWorklist-modify-action-buttons'>");
                html.push("<input type='button' id='dcWorklistStatusSaveButton' value='",rcm_discharge_i18n.RCM_SAVE,"' onclick='RCM_Worklist.saveNewStatus(",personId,",", encounterId,")'/>");
                html.push("<input type='button' id='dcWorklistModifyDialogCancelButton' value='",rcm_discharge_i18n.RCM_CANCEL,"' onclick='RCM_Worklist.cancelModifyDialog()'/>");
                html.push("</span>");
                html.push("</div>");
            }
            if($(name).attr("id") === "dcWorklistDateDisplay"){
                var selectedPerson = this.getPersonData(personId, encounterId);
                html.push("<div id='dcWorklistModifyInlineEditingDialog'>");
                html.push("<input type='text' name='dcWorklistAssessmentDatePicker' id='dcWorklistAssessmentDatePicker' value='", selectedPerson.NEXT_DISCHARGE_ASSESSMENT,"'/>");
                if(this.isDueDateTimeEnabled) {
                    html.push("<input type='text' class='' id='dcWorklistAssessmentTimePicker' value='", selectedPerson.NEXT_DISCHARGE_ASSESSMENT,"'/>");
                }
                html.push("<span class='dcWorklist-modify-action-buttons'>");
                html.push("<input type='button' id='dcWorklistReviewDateSaveButton' value='",rcm_discharge_i18n.RCM_SAVE,"' onclick='RCM_Worklist.saveNewAssessmentDate(",personId,",",encounterId,")'/>");
                html.push("<input type='button' id='dcWorklistModifyDialogCancelButton' value='",rcm_discharge_i18n.RCM_CANCEL,"' onclick='RCM_Worklist.cancelModifyDialog()'/>");
                html.push("</span>");
                html.push("</div>");
            }
            if($(name).attr("id") === "dcWorklistDCRelationshipDisplay"){
                html.push("<div id='dcWorklistModifyInlineEditingDialog'>");
                if(this.canAddRel === 1){
                    html.push("<input type='text' class='searchText searchTextSpacing' name='dcWorklistProviderSearch' id='dcWorklistProviderSearch'/>");
                    html.push("<br/>");
                }
                html.push("<div id='dischargeManagersTableDiv'></div>");
                html.push("<span class='dcworklist-modify-relationship-action-buttons'>");
                if(this.canAddRel === 1 || this.canUnassignRel === 1){
                    html.push("<input type='button' id='dcWorklistRelationshipSaveButton' value='",rcm_discharge_i18n.RCM_SAVE,"' onclick='RCM_Worklist.saveDeleteNewRelationships(",personId,",",encounterId,")'/>");
                }
                html.push("<input type='button' id='dcWorklistModifyDialogCancelButton' value='",rcm_discharge_i18n.RCM_CANCEL,"' onclick='RCM_Worklist.cancelModifyDialog()'/>");
                html.push("</span>");
                html.push("</div>");
            }
            return html.join("");
        },
        createModifyHoverMenuHTML: function() {
            var html = [];
            html.push("<div class='dcWorklist-modify-hover-menu-inner'>");
                html.push("<ul class = 'dcWorklist-modify-hover-action-menu'>");
                    html.push("<li class = 'dcWorklist-task-action-menu-item dcWorklist-task-done'>",rcm_discharge_i18n.RCM_DONE,"</li>");
                    html.push("<li class = 'dcWorklist-task-action-menu-item dcWorklist-task-done-with-date-time'>",rcm_discharge_i18n.RCM_DONE_WITH_DATE_TIME,"</li>");
                    html.push("<li class = 'dcWorklist-task-action-menu-item dcWorklist-task-not-done'>",rcm_discharge_i18n.RCM_NOT_DONE,"</li>");
                html.push("</ul>");
            html.push("</div>");
            $("#dcWorklistModifyHoverMenu").html(html.join(""));
        },
        createModifyHoverHTML: function(personId, encounterId,orderType,element){
            //Get order task details for this workitem
            var tasks = [];
            var orders;
            $.each(this.worklistItems, function(i, item){
                if(personId == item.PATIENT_ID && encounterId == item.ENCOUNTER_ID){
                    if(orderType === "DISCHARGE") {
                        orders = item.DISCHARGE_ORDERS;
                    }
                    else if (orderType === "CONSULT") {
                        orders = item.CONSULT_ORDERS;
                    }
                    else if (orderType === "DISCERN") {
                        orders = item.DISCERN_ORDERS;
                    }
                    for(var i = 0; i < orders.length; i++){
                        for(var orderId in RCM_Worklist.orderDetails){
                            var order = RCM_Worklist.orderDetails[orderId];
                            if(parseFloat(orderId) === parseFloat(orders[i].ID)) {
                                if (order.orderTasks.length > 0) {
                                    for (var index = 0; index < order.orderTasks.length; index++) {
                                        var task = {};
                                        task.orderName = orders[i].MNEMONIC;
                                        task.orderStatus = orders[i].STATUSDISPLAY;
                                        task.orderStatusMeaning = orders[i].STATUSMEANING;
                                        task.clinicalDisplay = orders[i].CLINICALDISPLAYLINE;
                                        task.orderDate = orders[i].ORDERDATE;
                                        task.orderId = orderId;
                                        if(order.taskComment){
                                            task.taskComment = order.taskComment;
                                        }
                                        task.orderingProvider = order.orderingProviderName;
                                        task.orderDiagnoses = order.orderDiagnoses;
                                        if(order.orderComment) {
                                            task.orderComment = order.orderComment;
                                        }
                                        task.taskName = order.orderTasks[index].taskDesc;
                                        task.taskDate = order.orderTasks[index].taskDate;
                                        task.taskStatus = order.orderTasks[index].taskStatus;
                                        task.taskType = order.orderTasks[index].taskType;
                                        if(orderType === "DISCHARGE") {
                                            task.canChart = false;
                                        }
                                        else {
                                            task.canChart = order.orderTasks[index].canChart;
                                        }
                                        task.taskCategory = order.orderTasks[index].taskCategory;
                                        task.taskId = order.orderTasks[index].taskId;
                                        tasks.push(task);
                                    }
                                }
                                else {
                                    var task = {};
                                    task.orderName = orders[i].MNEMONIC;
                                    task.orderStatus = orders[i].STATUSDISPLAY;
                                    task.orderStatusMeaning = orders[i].STATUSMEANING;
                                    task.clinicalDisplay = orders[i].CLINICALDISPLAYLINE;
                                    task.orderDate = orders[i].ORDERDATE;
                                    task.orderId = orderId;
                                    if(order.taskComment){
                                        task.taskComment = order.taskComment;
                                    }
                                    task.orderingProvider = order.orderingProviderName;
                                    task.orderDiagnoses = order.orderDiagnoses;
                                    if(order.orderComment) {
                                        task.orderComment = order.orderComment;
                                    }
                                    tasks.push(task);
                                }
                            }
                        }
                    }
                    return false;
                }
            });

            var html = [];
            html.push("<div class='dcWorklist-modify-hover-dialog'>");
                html.push("<div id='ModifyHoverDiv'>");
                    var isFirstCompleted = true;
                    for(var i = 0; i < tasks.length; i++){
                        var diagnoses = [];
                        for(var diagnosis = 0; diagnosis < tasks[i].orderDiagnoses.length; diagnosis++) {
                            diagnoses.push(tasks[i].orderDiagnoses[diagnosis].diagnosis + " (" + tasks[i].orderDiagnoses[diagnosis].code + ")");
                        }
                        var categoryImage = "";
                        var chartMode = "";
                        var title = "";
                        var zebraStriping = "";
                        switch(tasks[i].taskCategory) {
                            case "QUICK_CHART":
                                categoryImage = quickChartImage;
                                chartMode = "CHART_DONE";
                                if (tasks[i].canChart) {
                                    title = rcm_discharge_i18n.RCM_CHART_DONE;
                                }
                                break;
                            case "CHART_FORM":
                                categoryImage = chartFormImage;
                                chartMode = "CHART";
                                if (tasks[i].canChart) {
                                    title = rcm_discharge_i18n.RCM_CHART_DONE;
                                }
                                break;
                            case "MED":
                                categoryImage = medAdminImage;
                                break;
                            case "LAB":
                                categoryImage = labImage;
                                break;
                            default:
                                categoryImage = noTaskImage;
                                title = rcm_discharge_i18n.RCM_NO_TASK_AVAILABLE;
                        }

                        if (i % 2 === 0) {
                            zebraStriping = "zebra-striping-white";
                        } else {
                            zebraStriping = "zebra-striping-blue";
                        }

                        if(isFirstCompleted && tasks[i].orderStatusMeaning === "COMPLETED") {
                            isFirstCompleted = false;
                            html.push("<div class='dcWorklist-task dcWorklist-task-first-completed ",zebraStriping,"'>");
                        } else {
                            html.push("<div class='dcWorklist-task ",zebraStriping,"'>");
                        }
                            html.push("<img class='expandable-image dcWorklist-task-expand' onclick='RCM_Worklist.expandTaskListener(this)' src='", this.collapsedImageFile, "'>");
                            html.push("<div class='dcWorklist-task-row'>");
                                html.push("<p class = 'float-left'>",tasks[i].orderName," (",tasks[i].orderStatus,")</p>");
                            html.push("</div>");
                                    html.push("<div class = 'dcWorklist-taskImg'>");
                                        if (tasks[i].canChart) {
                                            html.push('<img src = "',categoryImage,'" title = "',title,'" onClick="RCM_Worklist.chartTask(',personId,',',encounterId,',',tasks[i].taskId,',\'',chartMode,'\')">');
                                            html.push('<img class ="dcWorklist-action-menu-image" src = "',taskActionDropdownImage,'" onClick="RCM_Worklist.showModifyHoverMenu(',personId,',',encounterId,',',tasks[i].taskId,',\'',chartMode,'\', this, event)">');
                                        }
                                        else {
                                            html.push("<img src = '",categoryImage,"' title ='",title,"'>");
                                        }
                                    html.push("</div>");
                            html.push("<p class = 'secondary-basic dcWorklist-clinical-display'>",tasks[i].clinicalDisplay,"</p>");
                            html.push("<div class = 'dcWorklist-task-expand-area'>");
                                html.push("<div class = 'dcWorklist-task-expand-col1'>");
                                    html.push("<p><span class = 'secondary-basic'>",rcm_discharge_i18n.RCM_TASK," </span>",tasks[i].taskName,"</p>");
                                    html.push("<p><span class = 'secondary-basic'>",rcm_discharge_i18n.RCM_TASK_DATE," </span>",tasks[i].taskDate,"</p>");
                                    html.push("<p><span class = 'secondary-basic'>",rcm_discharge_i18n.RCM_TASK_STATUS," </span>",tasks[i].taskStatus,"</p>");
                                    html.push("<p><span class = 'secondary-basic'>",rcm_discharge_i18n.RCM_TASK_TYPE," </span>",tasks[i].taskType,"</p>");
                                    html.push("<p><span class = 'secondary-basic'>",rcm_discharge_i18n.RCM_TASK_COMMENTS," </span>",tasks[i].taskComment,"</p>");
                                html.push("</div>");
                                html.push("<div class = 'dcWorklist-task-expand-col2'>");
                                    html.push("<p><span class = 'secondary-basic'>",rcm_discharge_i18n.RCM_ORDERED_DATE," </span>",tasks[i].orderDate,"</p>");
                                    html.push("<p><span class = 'secondary-basic'>",rcm_discharge_i18n.RCM_ORDERING_PROVIDER," </span>",tasks[i].orderingProvider,"</p>");
                                    html.push("<p><span class = 'secondary-basic'>",rcm_discharge_i18n.RCM_ORDER_ID," </span>",tasks[i].orderId,"</p>");
                                    html.push("<p><span class = 'secondary-basic'>",rcm_discharge_i18n.RCM_DIAGNOSIS," </span>",diagnoses.join(","),"</p>");
                                    html.push("<p><span class = 'secondary-basic'>",rcm_discharge_i18n.RCM_ORDER_COMMENTS," </span>",tasks[i].orderComment,"</p>");
                                html.push("</div>");
                            html.push("</div>");
                        html.push("</div>");
                    }
                html.push("</div>");
            html.push("</div>");

            $("#dcWorklistModifyHover").append(html.join(""));
        },
        expandTaskListener: function(image){
            var expand = $(image).siblings(".dcWorklist-task-expand-area");
            if($(expand).is(":visible")) {
                $(expand).hide();
                $(image).attr("src",this.collapsedImageFile);
            }
            else {
                $(expand).show();
                $(image).attr("src",this.expandedImageFile);
            }
            this.sizeModifyHoverOverlay();

        },
        createNoteHoverHTML: function(personId, encounterId){

            var notes = [];
            var dueDateLink = "";
            var dueDateViewpointLink = "";
            var dueDateViewLink = "";
            $.each(this.worklistItems, function(i, item){
                if(personId == item.PATIENT_ID && encounterId == item.ENCOUNTER_ID){
                    notes = item.NOTES;
                    dueDateLink = item.DUE_DATE_LINK;
                    dueDateViewpointLink = item.DUE_DATE_VIEWPOINT_LINK;
                    dueDateViewLink = item.DUE_DATE_VIEW_LINK;
                    return false;
                }
            });

            var html = [];
            html.push("<div class='dcWorklist-note-dialog'>");
                html.push("<div id='addNoteDiv'>");
                    html.push("<label id='addNoteLabel' class='simulate-anchor'>", rcm_discharge_i18n.RCM_ADD_NOTE, "</label>");
                html.push("</div>");
                html.push("<div class='dcWorklist-note-edit-clear'></div>");
                html.push("<div id='notesDiv' class='dcWorklist-note-container'></div>");
                html.push("<div id='noteCountDiv'>");
                    html.push("<label id='noteCountLabel' class='simulate-anchor'></label>");
                html.push("</div>");
            html.push("</div>");

            $("#dcWorklistNoteHover").append(html.join(""));

            $("#addNoteLabel").click(function(){
                RCM_Worklist.convertNoteHoverToDialog(personId, encounterId, "ADD");
            });

            var mode = 0;
            var app = rcm_discharge_i18n.RCM_POWERCHART;
            $("#noteCountLabel").click(function(){
                VIEWLINK(mode, app, personId, encounterId, dueDateLink, dueDateViewLink, dueDateViewpointLink);
            });

            if(notes.length > 0){
                var noteCountText = (notes.length > this.notesToShow ? this.notesToShow : notes.length) + " " + rcm_discharge_i18n.RCM_OF + " " + notes.length;
                $("#noteCountLabel").text(noteCountText);
                $("#noteCountDiv").show();
                $.each(notes, function(i, val){
                    if(i >= RCM_Worklist.notesToShow){
                        return false;
                    }
                    RCM_Worklist.createNote(i, val);
                });
            } else {
                $("#notesDiv").append("<div class='dcWorklist-no-notes'>" + rcm_discharge_i18n.RCM_NO_NOTES + "</div>");
            }
        },

        createNote: function(i, note){

            var html = [];

            html.push("<div id='noteDiv", i,"' class='dcWorklist-note ", i % 2 === 0 ? "" : "dcWorklist-note-odd", "'>");
                html.push("<div class='dcWorklist-note-hover-menu'>");
                    html.push("<a> <img src='", imageLocDeleteUp,"' alt='' class='dcWorklist-note-delete-image' /></a><br/>");
                    html.push("<a> <img src='", imageLocEditUp,"' alt='' class ='dcWorklist-note-edit-image' /></a>");
                html.push("</div>");

                html.push("<img class='dcWorklist-flag ", note.PRIORITYMEANING === "HIGH" ? "" : "dcWorklist-FlagHidden", "' src='", imageLocFlag,"' alt = '' />");
                html.push("<div class='dcWorklist-note-text'>");
                    var noteText = RCM_Clinical_Util.decodeString(note.TEXT);
                    html.push(RCM_Clinical_Util.loggingHtmlToText(noteText));
                html.push("</div>");

                html.push("<div class='dcWorklist-note-type'>");
                    html.push(this.noteTypes[note.TYPECD].display);
                html.push("</div>");

                html.push("<div class='dcWorklist-note-prsnl'>");
                    html.push(note.PERSONNELNAMEFULL);
                html.push("</div>");

                html.push("<div class='dcWorklist-save-date'>");
                    var dateString = this.getDateString(note.UPDATEDTTM);
                    html.push(dateString);
                html.push("</div>");
            html.push("</div>");

            $("#notesDiv").append($(html.join("")).data('note', note));

        },

        getDateString: function(date){
            var today = new Date();
            var d1 = new Date();
            d1.setISO8601(date);
            var yesterdayDate = new Date();
            var twoDaysAgo = new Date();
            var tempDate = new Date();
            var dateString;
            var hours = d1.getHours();
            var minutes = d1.getMinutes();
            if (minutes < 10){
                minutes = "0" + minutes;
            }

            today = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0,0);
            dateString = hours + ":" + minutes;

            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            yesterdayDate = new Date(yesterdayDate.getFullYear(),yesterdayDate.getMonth(),yesterdayDate.getDate(),0,0,0,0);
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            twoDaysAgo = new Date(twoDaysAgo.getFullYear(),twoDaysAgo.getMonth(),twoDaysAgo.getDate(),0,0,0,0);
            tempDate = new Date(d1.getFullYear(),d1.getMonth(),d1.getDate(),0,0,0,0);

            if( tempDate.getTime() === today.getTime()){
                return dateString + " " + rcm_discharge_i18n.RCM_TODAY;
            }
            if( tempDate.getTime() === yesterdayDate.getTime()){
                return dateString + " " + rcm_discharge_i18n.RCM_YESTERDAY;
            }
            if( tempDate.getTime() === twoDaysAgo.getTime()){
            return rcm_discharge_i18n.RCM_DAYS_AGO.replace("{0}", dateString + " 2");
            }
            else{
                return d1.format('longDateTime2');
            }
        },

        showNoteDialog: function(){

            var html = [];
            html.push("<div class='dcWorklist-note-dialog'>");
                html.push("<div class='dcWorklist-note-edit-container'>");
                    html.push("<div>");
                        html.push("<label for='dischargeNoteType'>", rcm_discharge_i18n.RCM_TYPE, "</label><br />");
                        html.push("<select id='dischargeNoteType'>");
                            html.push("<option value=''></option>");
                            var noteTypeCD;
                            for(noteTypeCD in RCM_Worklist.noteTypes){
                                html.push("<option value='", noteTypeCD,"'>",RCM_Worklist.noteTypes[noteTypeCD].display,"</option>");
                            }
                        html.push("</select>");
                    html.push("</div>");

                    html.push("<div>");
                        html.push("<label for='dischargeNoteTextArea'>", rcm_discharge_i18n.RCM_NOTE, "</label><br />");
                        html.push("<textarea id='dischargeNoteTextArea' class='dcWorklist-note-edit-textarea'></textarea>");
                    html.push("</div>");

                    html.push("<div class='dcWorklist-note-edit-checkbox-container'>");
                        html.push("<div class='dcWorklist-note-edit-important-container'>");
                            html.push("<input type='checkbox'  id='dischargeNoteImportantCheck'/>");
                            html.push("<label id='dischargeNoteImportantCheckLabel' class='dcWorklist-note-edit-checkbox-label' for='dischargeNoteImportantCheck'>", rcm_discharge_i18n.RCM_IMPORTANT, "</label>");
                        html.push("</div>");
                        html.push("<div class='dcWorklist-note-edit-persist-container'>");
                            html.push("<input type='checkbox' id='dischargeNotePersistCheck'/>");
                            html.push("<label id='dischargeNotePersistCheckLabel' class='dcWorklist-note-edit-checkbox-label' for='dischargeNotePersistCheck'>", rcm_discharge_i18n.RCM_PERSIST, "</label>");
                            html.push("<div class='dcWorklist-persist-hover hvr' id='persistHover'><dl>");
                                html.push(rcm_discharge_i18n.RCM_PERSIST_MESSAGE);
                            html.push("</dl></div>");
                        html.push("</div>");
                    html.push("</div>");
                    html.push("<div class='dcWorklist-note-edit-clear'></div>");

                    html.push("<div class='dcWorklist-note-edit-button-container'>");
                        html.push("<input type='button' class='dcWorklist-note-edit-button' id='dischargeNoteSave' value='", rcm_discharge_i18n.RCM_SAVE, "'/>");
                        html.push("<input type='button' class='dcWorklist-note-edit-button' id='dischargeNoteCancel' value='", rcm_discharge_i18n.RCM_CANCEL, "'/>");
                    html.push("</div>");
                html.push("</div>");
            html.push("</div>");

            return html.join("");
        },

        /**
        * fills table with information
        */
        populateTable:function(listOfManagers){
            var html = [];
            this.dischargeRelationship = [];
            html.push("<table id='dischargeManagersTable' class='dcWorklist-discharge-managers-table'>");
                html.push("<tr id='dischargeManagersFirstEmptyRow'><td>&nbsp;</td></tr>");
                //Add managers to list with the id equal to the managers id
                if(listOfManagers.length > 0 && Number(listOfManagers[0].PERSONNELID) !== 0){
                    for(var i = 0; i < listOfManagers.length; i++){
                        var id = listOfManagers[i].PERSONNELID;
                        var name = listOfManagers[i].NAMEFULL;
                        html.push("<tr id='",id,"' class='dcworklistDischargeManagersRow' onMouseOver='RCM_Worklist.highlightAndShowX(this)' onMouseOut='RCM_Worklist.removeHighlightAndHideX(this)'><td><div class='dcWorklist-float-left'><span id='dcWorklistDischargeManagersNumbering' class='dcWorklist-discharge-manager-numbers'></span><span>",name,"</span></div><div id='dcworklistRemoveX' class='dcWorklist-X-float-right dcWorklist-remove-x' onMouseOver='RCM_Worklist.switchXToOtherXImage(this)' onMouseOut='RCM_Worklist.switchXToOtherXImage(this)' onclick='RCM_Worklist.removeRowFromDischargeManagerTable(this)'></div></td></tr>");
                        this.dischargeRelationship.push(listOfManagers[i]);
                    }
                }
                html.push("<tr id='dischargeManagersLastEmptyRow'><td>&nbsp;</td></tr>");
            html.push("</table>");
            return html.join("");
        },

        /**
        * gets person information for worklist
        */
        getPersonData: function(personId, encounterId){
            for(var i = 0; i < this.personInfo.length; i++){
                var record = this.personInfo[i];
                //Ensure that both numbers being compared are in the same format
                //to get rid of the possibility that one number may be a whole number
                //and the other may be a whole number shown as a decimal
                //e.g. 100234 and 1.00234E5
                var selectedPersonId = Number(personId);
                var modifiedPersonId = Number(record.PATIENT_ID);
                var selectedEncounter = Number(encounterId);
                var modifiedEncounterId = Number(record.ENCOUNTER_ID);
                if(selectedPersonId === modifiedPersonId && selectedEncounter === modifiedEncounterId){
                    return record;
                }
            }
        },

        /**
         * Get prsnls with prsnl typeCd.
         */
        getListOfManagersWithRelationship: function(typeCd){
            var listOfManagers = [];
            if(this.listOfAllManagers && this.listOfAllManagers.length > 0){
                for(var i = 0; i < this.listOfAllManagers.length; i++){
                    if(Number(this.listOfAllManagers[i].TYPECD) === Number(typeCd)){
                        listOfManagers.push(this.listOfAllManagers[i]);
                    }
                }
            }
            return listOfManagers;
        },

        /**
        * gets x and y position of mouse for bottom-left corner of element
        */
        getMousePosition : function(name, e){
            var position = $(name).offset();
            var cursor = { x: 0, y: 0 };
            cursor.x = position.left;
            cursor.y = position.top + $(name).height() + 3;
            return cursor;
        },

        /**
        * gets x and y position of mouse for top-right corner of element
        */
        getMousePositionTopRight : function(name, e){
            var position = $(name).offset();
            var cursor = { x: 0, y: 0 };
            cursor.x = position.left + $(name).width() + 3;
            cursor.y = position.top;
            return cursor;
        },

        cancelModifyDialog: function(){
            $("#dcWorklistModifyDialogCancelButton").prop("disabled", true);
            this.removeDialogandLine();
        },

        renumberDischargeManagerRows: function(){
            var sequence = 1;
            $(".dcworklistDischargeManagersRow").find("#dcWorklistDischargeManagersNumbering").each(function(){
                $(this).html(sequence++);
            });
        },

        /**
        * shows X hover over
        */
        highlightAndShowX: function(name){
            if(this.canUnassignRel===1){
                $(name).addClass("dcWorklist-managerNameHoverOver");
                var hoverRemoveX = $(name).find(".dcWorklist-X-float-right");
                $(hoverRemoveX).css("visibility", "visible");
            }
        },

        /**
        * Hides X hover over
        */
        removeHighlightAndHideX: function(name){
            if(this.canUnassignRel===1){
                $(name).removeClass("dcWorklist-managerNameHoverOver");
                var hoverRemoveX = $(name).find(".dcWorklist-X-float-right");
                $(hoverRemoveX).css("visibility", "hidden");
            }
        },

        /**
        *switches X image to other image
        */
        switchXToOtherXImage: function(name){
            if(this.canUnassignRel===1){
                if($(name).hasClass("dcWorklist-remove-x")){
                    $(name).removeClass("dcWorklist-remove-x");
                    $(name).addClass("dcWorklist-hover-over-remove-x");
                }
                else{
                    $(name).removeClass("dcWorklist-hover-over-remove-x");
                    $(name).addClass("dcWorklist-remove-x");
                }
            }
        },


        removeRowFromDischargeManagerTable: function(name){
            if(this.canUnassignRel===1){
                var personIdToRemove = $(name).closest("tr").attr("id");
                personIdToRemove = Number(personIdToRemove);
                for(var i = 0; i < this.dischargeRelationship.length; i++){
                    if(Number(this.dischargeRelationship[i].PERSONNELID) === personIdToRemove){
                        this.dischargeRelationship.splice(i, 1);
                    }
                }
                $(name).closest("tr").remove();

                if(this.dischargeRelationship.length > 0){
                    this.renumberDischargeManagerRows();
                }
            }
        },

        removeFromRowAndListById: function(personnelId){
            var $dischargeModifyTable = $("#dischargeManagersTable");
            if($dischargeModifyTable.length > 0){
                var $rows = $('tr', $dischargeModifyTable);
                $rows.each(function(){
                    var rowIdNum = Number($(this).attr("id"));
                    if(rowIdNum === Number(personnelId)){
                        RCM_Worklist.removeRowFromDischargeManagerTable(this);
                    }
                });
            }
        },

        removeDialogandLine: function(){
            $(".dcWorklist-solid-line").addClass("dcWorklist-transparent-line");
            $(".dcWorklist-solid-line-grey").addClass("dcWorklist-transparent-line");
            $(".dcWorklist-solid-line").removeClass("dcWorklist-solid-line");
            $(".dcWorklist-solid-line-grey").removeClass("dcWorklist-solid-line-grey");
            $(".diswl-note-image-show").removeClass("diswl-note-image-show");
            $(".diswl-note-image-edit").removeClass("diswl-note-image-edit");
            if(this.dcworklistChangeDialog){
                this.dcworklistChangeDialog.innerHTML = '';
                this.dcworklistChangeDialog.style.display = 'none';
                this.dcworklistChangeDialog = null;
            }
            if(this.dcworklistReadOnlyDialog){
                this.dcworklistReadOnlyDialog.innerHTML = '';
                this.dcworklistReadOnlyDialog.style.display = 'none';
                this.dcworklistReadOnlyDialog = null;
            }
            $(window).resize();
        },

        clearHover: function(){
            if(document.selection) {
                document.selection.empty();
            }
            if(this.dcworklistNoteHover){
                this.dcworklistNoteHover.innerHTML = '';
                this.dcworklistNoteHover.style.display = 'none';
                this.dcworklistNoteHover = null;
            }
            if(this.dcworklistNoteExtra){
                this.dcworklistNoteExtra.innerHTML = '';
                this.dcworklistNoteExtra.style.display = 'none';
                this.dcworklistNoteExtra = null;
            }
            if(this.dcworklistModifyHover){
                this.dcworklistModifyHover.innerHTML = '';
                this.dcworklistModifyHover.style.display = 'none';
                this.dcworklistNoteHover = null;
            }
            if(this.dcworklistModifyHoverMenu){
                this.dcworklistModifyHoverMenu.innerHTML = '';
                this.dcworklistModifyHoverMenu.style.display = 'none';
                this.dcworklistModifyHoverMenu = null;
            }
            if(this.dcworklistModifyHoverOverlay){
                this.dcworklistModifyHoverOverlay.style.display = 'none';
                this.dcworklistModifyHoverOverlay = null;
            }
            if(this.dcworklistModifyHoverMenuOverlay){
                this.dcworklistModifyHoverMenuOverlay.style.display = 'none';
                this.dcworklistModifyHoverMenuOverlay = null;
            }
        },

        //Remove any open dialogs
        clearDialogs: function() {
            if(this.dcworklistChangeDialog){
                this.dcworklistChangeDialog.innerHTML = '';
                this.dcworklistChangeDialog.style.display = 'none';
                this.dcworklistChangeDialog = null;
            }
            if(this.dcworklistReadOnlyDialog){
                this.dcworklistReadOnlyDialog.innerHTML = '';
                this.dcworklistReadOnlyDialog.style.display = 'none';
                this.dcworklistReadOnlyDialog = null;
            }
        },



        /**
         * Modify discharge plan status.
         */
        saveNewStatus: function(patientId, encounterId){
            $("#dcWorklistStatusSaveButton").prop("disabled", true);
            $("#dcWorklistModifyDialogCancelButton").prop("disabled", true);
            var currentVersion = $("span.dcWorklist-solid-line").closest("tr").find("div.dcWorklistPatientVersionDiv").attr("id");
            currentVersion = Number(currentVersion.substring(18));
            var newStatus = $("#dcWorklist-modify-dcStatus").val();
            var jsonRequest = {
                "UM_REQUEST" : {
                    "ENCOUNTERID" : String(encounterId),
                    "VERSION" : currentVersion,
                    "PATIENTID" : String(patientId),
                    "_CLINICALREVIEWDUEDATETIME" : 0,
                    "CLINICALREVIEWDUEDATETIME" : "",
                    "_UTILIZATIONMGMTSTATUSCD" : 0,
                    "UTILIZATIONMGMTSTATUSCD" : "",
                    "_DISCHARGEPLANSTATUSCD" : 1,
                    "DISCHARGEPLANSTATUSCD" : newStatus,
                    "_DISCHARGEPLANDUEDATETIME" : 0,
                    "DISCHARGEPLANDUEDATETIME" : "",
                    "DIAGNOSISRELATEDGROUP" : [],
                    "_DOCUMENTREVIEWSTATUSCD" : 0,
                    "DOCUMENTREVIEWSTATUSCD" : "",
                    "_DOCUMENTREVIEWDUEDATETIME" : 0,
                    "DOCUMENTREVIEWDUEDATETIME" : "",
                    "PERSONNELRELATIONSHIPS" : {
                        "SOURCETYPE" : "DISCHARGE_REVIEW_WL",
                        "ADDPERSONNELRELATIONSHIPS" : [],
                        "REMOVEPERSONNELRELATIONSHIPS" : []
                    }
                }
            };

            var modifyReply = this.modifyEncounterInformation(jsonRequest);
            // success
            if(modifyReply.status === 0){
                for(var i = 0; i < this.worklistItems.length; i++) {
                    if(this.worklistItems[i].ENCOUNTER_ID == encounterId){
                        this.worklistItems[i].DISCHARGE_PLAN_STATUS=$("#dcWorklist-modify-dcStatus :selected").text();
                    }
                }
                //Update version number
                var newVersion = currentVersion + 1;
                var newPatientEncounterVersionString = "dcWorklistPVersion" + newVersion;
                $("span.dcWorklist-solid-line").closest("tr").find("div.dcWorklistPatientVersionDiv").attr("id", newPatientEncounterVersionString);
                var newDisplay = $("#dcWorklist-modify-dcStatus :selected").text();
                var statusIdString = "dcWorklistStatus" + newStatus;
                $("span.dcWorklist-solid-line").closest("div").attr("id", statusIdString);
                if(newDisplay){
                    $("span.dcWorklist-solid-line").text(newDisplay);
                }
                else{
                    $("span.dcWorklist-solid-line").text(rcm_discharge_i18n.RCM_NOT_AVAILABLE);
                }
                if($("span.dcWorklist-solid-line").hasClass("dcWorklist-plain-bold-font")){
                    $("span.dcWorklist-solid-line").removeClass("dcWorklist-plain-bold-font");
                }
                if($("span.dcWorklist-solid-line").hasClass("dcWorklist-alert-font")){
                    $("span.dcWorklist-solid-line").removeClass("dcWorklist-alert-font");
                }
                if(!($("span.dcWorklist-solid-line").hasClass("dcWorklist-plain-font"))){
                    $("span.dcWorklist-solid-line").addClass("dcWorklist-plain-font");
                }
                this.removeDialogandLine();
            }
            if(modifyReply.status === 2){
                this.openStaleDataDialog();
                this.removeDialogandLine();
            }
            if(modifyReply.status === -1){
                this.openSaveFailedDialog();
                this.removeDialogandLine();
            }
        },

        /**
         * Modify discharge plan due date.
         */
        saveNewAssessmentDate: function(patientId, encounterId){
            $("#dcWorklistReviewDateSaveButton").prop("disabled", true);
            $("#dcWorklistModifyDialogCancelButton").prop("disabled", true);
            var currentVersion = $("div.dcWorklist-solid-line").closest("tr").find("div.dcWorklistPatientVersionDiv").attr("id");
            currentVersion = Number(currentVersion.substring(18));
            var newDate, newTime;
            if($("#dcWorklistAssessmentDatePicker").val() === ""){
                newDate = "";
            }
            else{
                newDate = RCM_Clinical_Util.getDate("dcWorklistAssessmentDatePicker");
                if(this.isDueDateTimeEnabled) {
                    newTime = RCM_Clinical_Util.getTime("dcWorklistAssessmentTimePicker");
                    if (newTime) {
                        newDate.setHours(newTime.getHours());
                        newDate.setMinutes(newTime.getMinutes());
                    }
                }
                newDate = newDate.format("isoUtcDateTime");
            }
            var jsonRequest = {
                "UM_REQUEST" : {
                    "ENCOUNTERID" : String(encounterId),
                    "VERSION" : currentVersion,
                    "PATIENTID" : String(patientId),
                    "_CLINICALREVIEWDUEDATETIME" : 0,
                    "CLINICALREVIEWDUEDATETIME" : "",
                    "_UTILIZATIONMGMTSTATUSCD" : 0,
                    "UTILIZATIONMGMTSTATUSCD" : "",
                    "_DISCHARGEPLANSTATUSCD" : 0,
                    "DISCHARGEPLANSTATUSCD" : "",
                    "_DISCHARGEPLANDUEDATETIME" : 1,
                    "DISCHARGEPLANDUEDATETIME" : RCM_Clinical_Util.formatDateAndTimeStringForSave(newDate),
                    "DIAGNOSISRELATEDGROUP" : [],
                    "_DOCUMENTREVIEWSTATUSCD" : 0,
                    "DOCUMENTREVIEWSTATUSCD" : "",
                    "_DOCUMENTREVIEWDUEDATETIME" : 0,
                    "DOCUMENTREVIEWDUEDATETIME" : "",
                    "PERSONNELRELATIONSHIPS" : {
                        "SOURCETYPE" : "DISCHARGE_REVIEW_WL",
                        "ADDPERSONNELRELATIONSHIPS" : [],
                        "REMOVEPERSONNELRELATIONSHIPS" : []
                    }
                }
            };

            var modifyReply = this.modifyEncounterInformation(jsonRequest);
            if(modifyReply.status === 0){
                for(var i = 0; i < this.worklistItems.length; i++) {
                    if(this.worklistItems[i].ENCOUNTER_ID == encounterId){
                        this.worklistItems[i].NEXT_DISCHARGE_ASSESSMENT =  newDate;
                    }
                }
                //Update version number
                var newVersion = currentVersion + 1;
                var newPatientEncounterVersionString = "dcWorklistPVersion" + newVersion;
                $("div.dcWorklist-solid-line").closest("tr").find("div.dcWorklistPatientVersionDiv").attr("id", newPatientEncounterVersionString);
                if(newDate){
                    var newDateDisplay = this.isDueDateTimeEnabled ? RCM_Clinical_Util.formatJsonDateAndTimeString(newDate, "longDateTime3")
                        : RCM_Clinical_Util.formatJsonDateString(newDate);
                    $("div.dcWorklist-solid-line").text(newDateDisplay);
                }
                else{
                    $("div.dcWorklist-solid-line").text(rcm_discharge_i18n.RCM_NO_DATE);
                }
                $("div.dcWorklist-solid-line").addClass("dcWorklist-date");
                if($("div.dcWorklist-solid-line").hasClass("dcWorklist-alert-font")){
                    $("div.dcWorklist-solid-line").removeClass("dcWorklist-alert-font");
                }
                if($("div.dcWorklist-solid-line").hasClass("dcWorklist-plain-bold-font")){
                    $("div.dcWorklist-solid-line").removeClass("dcWorklist-plain-bold-font");
                }
                if(!($("div.dcWorklist-solid-line").hasClass("dcWorklist-plain-font"))){
                    $("div.dcWorklist-solid-line").addClass("dcWorklist-plain-font");
                }
                this.removeDialogandLine();
            }
            if(modifyReply.status === 2){
                this.openStaleDataDialog();
                this.removeDialogandLine();
            }
            if(modifyReply.status === -1){
                this.openSaveFailedDialog();
                this.removeDialogandLine();
            }
        },

        /**
         * Compare current list to exisitng dischargeRelationship return any new prsnl relationships.
         */
        getAddListItems: function(list){
            var differenceArray = [];
            for(var i = 0; i < this.dischargeRelationship.length; i++){
                differenceArray.push(this.dischargeRelationship[i]);
            }
            for(var i = 0; i < list.length; i++){
                for(var j = differenceArray.length - 1; j >= 0 ; j--){
                    if(Number(list[i].PERSONNELID) === Number(differenceArray[j].PERSONNELID)){
                        differenceArray.splice(j, 1);
                    }
                }
            }
            return differenceArray;
        },

        /**
         * Compare current list to exising dischargeRelationship return any removed prsnl relationships.
         */
        getRemoveListItems:function(list){
            var differenceArray = [];
            for(var i = 0; i < list.length; i++){
                differenceArray.push(list[i]);
            }
            // remove from differenceArray if it is no longer in dischargeRelationship
            for(var i = 0; i < this.dischargeRelationship.length; i++){
                for(var j = differenceArray.length - 1; j >= 0; j--){
                    if(Number(differenceArray[j].ID) === 0){
                        differenceArray.splice(j, 1);
                        continue;
                    }
                    if(Number(this.dischargeRelationship[i].PERSONNELID) === Number(differenceArray[j].PERSONNELID)){
                        differenceArray.splice(j, 1);
                    }
                }
            }
            return differenceArray;
        },

       /**
        * Saves and deletes relationships.
        */
        saveDeleteNewRelationships: function(patientId, encounterId){
            $("#dcWorklistRelationshipSaveButton").prop("disabled", true);
            $("#dcWorklistModifyDialogCancelButton").prop("disabled", true);
            var rowId = "recordDataRow" + Number(encounterId) + ".0";
            var rowAboveExpandable = document.getElementById(rowId);
            var currentVersion = $(rowAboveExpandable).find("div.dcWorklistPatientVersionDiv").attr("id");
            currentVersion = Number(currentVersion.substring(18));
            var listItemId = $("span.dcWorklist-solid-line").closest("dl").attr("id");
            var relationshipText = "";
            var relationshipType = "";
            var relationshipNum = 3;
            var source = "DISCHARGE_REVIEW_WL";
            if(listItemId){
                relationshipText = $("span.dcWorklist-solid-line").closest("dl").find("dt").text();
                relationshipText = relationshipText.substring(0, relationshipText.length-1);
                relationshipNum = $("span.dcWorklist-solid-line").closest("dd").attr("id");
                relationshipNum = relationshipNum.substring(19);
                relationshipNum = Number(relationshipNum);
                relationshipType = listItemId.substring(13);
            }
            else{
                relationshipText = $("#rcmDischargePlannerHeader").html();
                relationshipType = $("span.dcWorklist-solid-line").closest("p").attr("id");
                relationshipType = relationshipType.substring(13);
            }
            var list;
            // If the discharge_reltn_selection is being changed (on worklist proper)
            if(relationshipNum === 3){
                var info = this.getPersonData(patientId, encounterId);
                list = info.CARE_MGMT_RELTN;
                source = "DISCHARGE_RELTN_SELECTION";
            }
            // Else if the discharge planner relationship is being changed (in worklist details)
            else if(relationshipNum === 0){
                list = this.originalManagersRelOne;
            }
            else{
                list = this.originalManagersRelTwo;
            }
            var personnelToAdd = this.getAddListItems(list);
            var addArray = [];
            for(var i = 0; i < personnelToAdd.length; i++){
                addArray.push({
                    "PRSNLID" : String(personnelToAdd[i].PERSONNELID),
                    "TYPECD" : relationshipType
                });
            }
            var personnelToRemove = this.getRemoveListItems(list);
            var removeArray = [];
            for(var i = 0; i < personnelToRemove.length; i++){
                if(personnelToRemove[i].ID !== 0){
                    removeArray.push({
                        "ID" : String(personnelToRemove[i].ID)
                    });
                }
            }
            var jsonRequest = {
                "UM_REQUEST" : {
                    "ENCOUNTERID" : String(encounterId),
                    "VERSION" : currentVersion,
                    "PATIENTID" : String(patientId),
                    "_CLINICALREVIEWDUEDATETIME" : 0,
                    "CLINICALREVIEWDUEDATETIME" : "",
                    "_UTILIZATIONMGMTSTATUSCD" : 0,
                    "UTILIZATIONMGMTSTATUSCD" : "",
                    "_DISCHARGEPLANSTATUSCD" : 0,
                    "DISCHARGEPLANSTATUSCD" : "",
                    "_DISCHARGEPLANDUEDATETIME" : 0,
                    "DISCHARGEPLANDUEDATETIME" : "",
                    "DIAGNOSISRELATEDGROUP" : [],
                    "_DOCUMENTREVIEWSTATUSCD" : 0,
                    "DOCUMENTREVIEWSTATUSCD" : "",
                    "_DOCUMENTREVIEWDUEDATETIME" : 0,
                    "DOCUMENTREVIEWDUEDATETIME" : "",
                    "PERSONNELRELATIONSHIPS" : {
                        "SOURCETYPE" : source,
                        "ADDPERSONNELRELATIONSHIPS" : addArray,
                        "REMOVEPERSONNELRELATIONSHIPS" : removeArray
                    }
                }
            };
            var modifyReply = this.modifyEncounterInformation(jsonRequest);
            // save is successful
            if(modifyReply.status === 0){
                var expandableRowSection = document.getElementById("summaryRow" + Math.abs(encounterId) + ".0");
                if($(expandableRowSection).css("display") !== 'none' && listItemId){
                    //Close expandable and reopen to refresh data
                    this.expandListener(encounterId, patientId);
                    this.expandListener(encounterId, patientId);
                }
                else{
                    var newVersion = currentVersion + 1;
                    var newPatientEncounterVersionString = "dcWorklistPVersion" + newVersion;
                    $("span.dcWorklist-solid-line").closest("tr").find("div.dcWorklistPatientVersionDiv").attr("id", newPatientEncounterVersionString);
                    // display the first relationship's full name.
                    if(this.dischargeRelationship.length > 0){
                        $("span.dcWorklist-solid-line").text(this.dischargeRelationship[0].NAMEFULL);
                    }
                    else{
                        $("span.dcWorklist-solid-line").text(rcm_discharge_i18n.RCM_UNASSIGNED);
                    }
                    if(relationshipNum === 3){
                        // add new encounterPersonnelReltnId the dischargeRelationship JSON
                        if (modifyReply.newEncounterPersonnelReltnIds != null) {
                            for (var i = 0; i < modifyReply.newEncounterPersonnelReltnIds.length; i++) {
                                for (var j = 0; j < this.dischargeRelationship.length; j++){
                                    if(Number(this.dischargeRelationship[j].PERSONNELID) === Number(modifyReply.newEncounterPersonnelReltnIds[i].PERSONNELID)){
                                        this.dischargeRelationship[j].ID = modifyReply.newEncounterPersonnelReltnIds[i].ENCOUNTERPERSONNELRELTNID;
                                    }
                                }
                            }
                        }
                        // reset CARE_MGMT_RELTN
                        for(var i = 0; i < this.personInfo.length; i++){
                            var selectedPersonId = Number(patientId);
                            var modifiedPersonId = Number(this.personInfo[i].PATIENT_ID);
                            var selectedEncounter = Number(encounterId);
                            var modifiedEncounterId = Number(this.personInfo[i].ENCOUNTER_ID);
                            if(selectedPersonId === modifiedPersonId && selectedEncounter === modifiedEncounterId){
                                this.personInfo[i].CARE_MGMT_RELTN = this.dischargeRelationship;
                                break;
                            }
                        }
                    }
                }
                this.dischargeRelationship = [];
                this.removeDialogandLine();
            }
            else if(modifyReply.status === 1){
                this.openRelationshipErrorDialog(modifyReply.entityName, relationshipText);
                this.removeFromRowAndListById(modifyReply.entityId);
                $("#dcWorklistRelationshipSaveButton").prop("disabled", false);
                $("#dcWorklistModifyDialogCancelButton").prop("disabled", false);
            }
            else if(modifyReply.status === 2){
                this.openStaleDataDialog();
                this.removeDialogandLine();
            }
            else if(modifyReply.status === -1){
                this.openSaveFailedDialog();
                this.removeDialogandLine();
            }
        },

        dismissFailedFaxDialog: function(){
            $('.worklist-failed-fax').hide();
        },

        showAndHideFailedFaxDetailDialog: function(){
            if ( $('.worklist-failed-fax-div').is(':visible')){
                $('.worklist-failed-fax-div').hide();
                $('#worklist-show-fax-detail').text(rcm_discharge_i18n.RCM_SHOW_DETAILS);
            }
            else {
                $('.worklist-failed-fax-div').show();
                $('#worklist-show-fax-detail').text(rcm_discharge_i18n.RCM_HIDE_DETAILS);
            }
        },

        setDefaultCursor:function(){
            document.body.style.cursor = 'default';
        },
        setHourglassCursor:function(){
            document.body.style.cursor = 'wait';
        },

        expandListener: function(encounterId, personId){
            this.setHourglassCursor();
            this.removeDialogandLine();
            encounterId += '.0';
            this.personId = personId;
            var detailRow = document.getElementById('recordDataRow' + encounterId);
            var summaryRow = document.getElementById('summaryRow' + encounterId);
            var expandedSummaryImage= document.getElementById('openSummary' + encounterId);
            // If user wants to collapse.
            if (summaryRow.style.display === "inline") {
                // remove summary row
                summaryRow.style.display = "none";

                // remove expanded detail row borders.
                for ( var i = 0; i < this.detailRow.cells.length; i++) {
                    if (i === 0) {
                        this.detailRow.cells[i].style.borderLeft = "none";
                    }
                    if (i === 6) {
                        this.detailRow.cells[i].style.borderRight = "none";
                    }
                    this.detailRow.cells[i].style.borderTop = "none";
                }
                // change to collapse image to expanded summary row.
                expandedSummaryImage.src = this.collapsedImageFile;
            }
            // If user wants to expand.
            else {
                 // collapse previous expand summary row.
                 if (this.expandedSummaryRow) {
                     this.expandedSummaryRow.style.display = "none";
                 }
                 // expand the current summary row.
                 summaryRow.style.display = "inline";
                 // save the expanded summary row div so we don't need to loop through every rows to reset it later.
                 this.expandedSummaryRow = summaryRow;

                // remove previous expanded detail row borders.
                if (this.detailRow) {
                    for ( var i = 0; i < this.detailRow.cells.length; i++) {
                        if (i === 0) {
                            this.detailRow.cells[i].style.borderLeft = "none";
                        }
                        if (i === 6) {
                            this.detailRow.cells[i].style.borderRight = "none";
                        }
                        this.detailRow.cells[i].style.borderTop = "none";
                    }
                }
                // add currently expanded detail row borders.
                for (var i = 0; i < detailRow.cells.length; i++) {
                    if (i === 0) {
                        detailRow.cells[i].style.borderLeft = "2px solid #3797FE";
                    }
                    if (i === 6) {
                        detailRow.cells[i].style.borderRight = "2px solid #3797FE";
                    }
                    detailRow.cells[i].style.borderTop = "2px solid #3797FE";
                }
                this.detailRow = detailRow;

                // change to collapse image to previous expanded summary row.
                if (this.expandedSummaryImage) {
                    this.expandedSummaryImage.src = this.collapsedImageFile;
                }
                // expand the current selected summary row.
                expandedSummaryImage.src = this.expandedImageFile;
                // save the expanded summary image div so we don't need to loop through every rows to reset it later.
                this.expandedSummaryImage = expandedSummaryImage;

                var sendAr = [];
                var arg = "{\"encounterId\":\"" + encounterId + "\"}";
                var json = "^{\"getWorklistDetailsReq\":" + arg + "}^";
                sendAr.push("^MINE^", "0.0", "^GETWORKLISTDETAILS^", json);
                var detailsData;
                detailsData = this.makeTimerCall(this.component,"rcm_discharge_worklist", sendAr, 0);

                var detailsHTML = [];
                if (detailsData === undefined) {
                    detailsHTML.push("<div class='add-demog-header'>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</div>");

                }
                else {
                    // Sort the current admit's DRGs.
                    RCM_Worklist.sortDRGs(detailsData.DRGS);
                    var expandVersion = detailsData.VERSION;
                    var newPatientEncounterVersionString = "dcWorklistPVersion" + expandVersion;
                    $(detailRow).find("div.dcWorklistPatientVersionDiv").attr("id", newPatientEncounterVersionString);
                    this.listOfAllManagers = detailsData.ALLDISCHARGEPLANNERS;
                    this.canAddRel = detailsData.CANASSIGNRELATIONSHIPIND;
                    this.canUnassignRel = detailsData.CANUNASSIGNRELATIONSHIPIND;
                    detailsHTML.push("<div>");
                    detailsHTML.push("<div class='add-demog'>");
                    detailsHTML.push("<div class='scrollable'>");

                    //First Component Box
                    detailsHTML.push("<div class='component-box'>");
                    //Current Admission
                    detailsHTML.push("<div class='add-demog-header'>", rcm_discharge_i18n.RCM_CURRENT_ADMIT, "</div><div class='form-separator'></div>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_CODE_STATUS, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.CODE_STATUS), "</dd></dl>");
                    if (detailsData.MEDICARE_IND) {
                        var admIM;
                        if (RCM_Worklist.checkPersonData(detailsData.ADMIT_IM) !== rcm_discharge_i18n.RCM_ERROR_MESSAGE) {
                            if (detailsData.ADMIT_IM === 0) {
                                admIM = rcm_discharge_i18n.RCM_NO;
                            }
                            else {
                                admIM = rcm_discharge_i18n.RCM_YES;
                            }
                        }
                        else {
                            admIM = rcm_discharge_i18n.RCM_ERROR_MESSAGE;
                        }
                        detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_ADM_IM, "</dt><dd class='dd-details'>", admIM, "</dd></dl>");
                    }
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_ADVANCE_DIR, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.ADVANCE_DIRECTIVE), "</dd></dl>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_ADVANCE_DIR_LOC, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.ADVANCE_DIRECTIVE_LOCATION), "</dd></dl>");

                    //Previous Admission
                    detailsHTML.push('<div class="add-demog-header">', rcm_discharge_i18n.RCM_PREVIOUS_ADMISSION_INFO);
                    if (detailsData.PREVIOUS_ADMIT.length === 0) {
                        detailsHTML.push("</div><div class='form-sub-separator'></div>");
                    }
                    else {
                        detailsHTML.push("&nbsp;(", detailsData.PREVIOUS_ADMIT.length, ")</div><div class='form-sub-separator' style='width:55%;'></div>");

                        var previousAdmit = detailsData.PREVIOUS_ADMIT[0];

                        // Sort the previous admit's DRGs.
                        RCM_Worklist.sortDRGs(previousAdmit.DRGS);

                        var previousAdmLinkTab = detailsData.ALL_VISITS_LINK_STRING;
                        var previousAdmLinkViewpointId = detailsData.ALL_VISITS_VIEWPOINT_LINK;
                        var previousAdmLinkViewId = detailsData.ALL_VISITS_VIEW_LINK;
                        var link = this.visitInfoLink(this.personId, encounterId, previousAdmLinkTab, previousAdmLinkViewId, previousAdmLinkViewpointId);
                        var date;
                        if (RCM_Worklist.checkPersonData(previousAdmit.ADMIT_DATE) !== rcm_discharge_i18n.RCM_ERROR_MESSAGE) {
                            date = RCM_Worklist.getDate(previousAdmit.ADMIT_DATE);
                        }
                        else {
                            date = rcm_discharge_i18n.RCM_ERROR_MESSAGE;
                        }
                        // admit date
                        detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_ADMIT_DATE, "</dt><dd class='dd-details'>", date, "&nbsp;", link, "</dd></dl>");

                        // working/final DRG
                        var previousAdmitDRG = RCM_Worklist.getDRGToDisplay(previousAdmit.DRGS, 0);
                        detailsHTML.push("<dl>");
                            detailsHTML.push("<dt class='dt-details'>", (previousAdmitDRG && previousAdmitDRG.FINALINDICATOR) ? rcm_discharge_i18n.RCM_FINAL_DRG : rcm_discharge_i18n.RCM_WORKING_DRG, "</dt>");
                            detailsHTML.push("<dd class='dd-details'>");
                                if (previousAdmit.SECURED_INDICATOR) {
                                    detailsHTML.push("<span class='worklist-secured'>", rcm_discharge_i18n.RCM_SECURED, "</span>");
                                }
                                else if(previousAdmitDRG) {
                                    if (previousAdmitDRG.TRANSFERRULEINDICATOR) {
                                        detailsHTML.push("<img src='", this.loc, "\\images\\6405_16.png' alt=''/>");
                                    }
                                    detailsHTML.push("<div class='DCWorklistHoverParent'>");
                                        detailsHTML.push("<span", previousAdmit.DIFFERINGWORKINGDRGIND ? " style='font-weight:bold; color:red;'>" : ">");
                                            detailsHTML.push(previousAdmitDRG.DESCRIPTION, "&nbsp;(", previousAdmitDRG.SOURCEIDENTIFIER, ")");
                                        detailsHTML.push("</span>");
                                        detailsHTML.push("<div class='DCWorklistHover'>");
                                            for(var i = 0; i < previousAdmit.DRGS.length; i++) {
                                                var drg = previousAdmit.DRGS[i];
                                                detailsHTML.push("<p>");
                                                    if (drg.TRANSFERRULEINDICATOR) {
                                                        detailsHTML.push("<img src='", this.loc, "\\images\\6405_16.png' alt=''/>");
                                                    }
                                                    detailsHTML.push(drg.DESCRIPTION, "&nbsp;(", drg.SOURCEIDENTIFIER, ")");
                                                detailsHTML.push("</p>");
                                                if(drg.SEVERITYOFILLNESSDISPLAY || drg.RISKOFMORTALITYDISPLAY || drg.DRGWEIGHT){
                                                    detailsHTML.push("<p class='indention2 units-text'>");
                                                        detailsHTML.push(rcm_discharge_i18n.RCM_SEVERITY_OF_ILLNESS, "&nbsp;", drg.SEVERITYOFILLNESSDISPLAY, "&nbsp;&nbsp;&nbsp;");
                                                        detailsHTML.push(rcm_discharge_i18n.RCM_RISK_OF_MORTALITY, "&nbsp;", drg.RISKOFMORTALITYDISPLAY, "&nbsp;&nbsp;&nbsp;");
                                                        detailsHTML.push(rcm_discharge_i18n.RCM_DRG_WEIGHT, "&nbsp;", drg.DRGWEIGHT);
                                                    detailsHTML.push("</p>");
                                                }
                                                detailsHTML.push("<p class='indention2'><span class='units-text'>", drg.FINALINDICATOR ? rcm_discharge_i18n.RCM_DRG_FINAL_HOVER : rcm_discharge_i18n.RCM_DRG_WORKING_HOVER, " (", drg.CONTRIBUTORSYSTEM, ")</span></p>");
                                            }
                                        detailsHTML.push("</div>");
                                    detailsHTML.push("</div>");
                                }
                            detailsHTML.push("</dd>");
                        detailsHTML.push("</dl>");

                        // working/final diagnosis
                        detailsHTML.push("<dl><dt class='dt-details'>", previousAdmit.DX_FINAL_INDICATOR ? rcm_discharge_i18n.RCM_FINAL_DX : rcm_discharge_i18n.RCM_WORKING_DX, "</dt><dd class='dd-details'>");
                        if (previousAdmit.SECURED_INDICATOR) {
                            detailsHTML.push("<span class='worklist-secured'>", rcm_discharge_i18n.RCM_SECURED, "</span></dd></dl>");
                        }
                        else {
                            detailsHTML.push(previousAdmit.DX_DESC);
                            if (previousAdmit.DX) {
                                detailsHTML.push("&nbsp;(", previousAdmit.DX, ")");
                            }
                            detailsHTML.push("</dd></dl>");
                        }
                        // facility
                        detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_FACILITY, "</dt><dd class='dd-details'>", previousAdmit.SECURED_INDICATOR ? "<span class='worklist-secured'>" + rcm_discharge_i18n.RCM_SECURED + "</span>" : previousAdmit.FACILITY_DISCHARGED_FROM, "</dd></dl>");
                        // unit
                        detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_DISCHARGE_FROM, "</dt><dd class='dd-details'>", previousAdmit.SECURED_INDICATOR ? "<span class='worklist-secured'>" + rcm_discharge_i18n.RCM_SECURED + "</span>" : previousAdmit.UNIT_DISCHARGE_FROM, "</dd></dl>");
                        // attending physician
                        detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_ATTENDING_PHYSICIAN, "</dt><dd class='dd-details'>", previousAdmit.SECURED_INDICATOR ? "<span class='worklist-secured'>" + rcm_discharge_i18n.RCM_SECURED + "</span>" : previousAdmit.ATTEND_PHYSICIAN, "</dd></dl>");
                        // discharge date
                        detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_DISCHARGE_DATE, "</dt><dd class='dd-details'>", RCM_Worklist.getDate(previousAdmit.DISCHARGE_DATE), "</dd></dl>");
                    }
                    detailsHTML.push("</div>");//Current Admission and Previous Admission component-box
                    //Next Component Box
                    detailsHTML.push("<div class='component-box'>");
                    //Utilization Management
                    var umTab = detailsData.UM_SUMMARY_LINK;
                    var umViewpointId = detailsData.UM_SUMMARY_VIEWPOINT_LINK;
                    var umViewId = detailsData.UM_SUMMARY_VIEW_LINK;
                    var mode = 0;
                    var appName = rcm_discharge_i18n.RCM_POWERCHART;
                    detailsHTML.push("<div class='add-demog-header'><a style='text-decoration:none; color: #3E3E3E;' " +
                                    "href='javascript:VIEWLINK(" + mode + ", \"" + appName + "\", \"" + this.personId + "\", \"" + encounterId + "\", \"" + umTab + "\", \"" + umViewId + "\", \"" + umViewpointId + "\");'>",
                                    rcm_discharge_i18n.RCM_UM_INFO, "</a></div><div class='form-separator2'></div>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_UTILIZATION_MANAGEMENT_STATUS, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.UM_STATUS_DISP), "</dd></dl>");
                    if(detailsData.PRIMARYURNURSES){
                        for(var i = 0; i < detailsData.PRIMARYURNURSES.length; i++){
                             detailsHTML.push("<dl><dt class='dt-details'>", detailsData.PRIMARYURNURSES[i].TYPEDISPLAY, ":</dt>");
                             if(detailsData.PRIMARYURNURSES[i].NAMEFULL === ""){
                                 detailsHTML.push("<dd class='dd-details'>", rcm_discharge_i18n.RCM_UNASSIGNED, "</dd></dl>");
                             }
                             else{
                                 detailsHTML.push("<dd class='dd-details'>", detailsData.PRIMARYURNURSES[i].NAMEFULL, "</dd></dl>");
                             }
                        }
                    }

                    // Working DRG
                    var workingDRG = RCM_Worklist.getDRGToDisplay(detailsData.DRGS, 2);
                    detailsHTML.push("<dl>");
                        detailsHTML.push("<dt class='dt-details'>", rcm_discharge_i18n.RCM_WORKING_DRG, "</dt>");
                        detailsHTML.push("<dd class='dd-details'>");
                            if(workingDRG) {
                                if (workingDRG.TRANSFERRULEINDICATOR) {
                                    detailsHTML.push("<img src='", this.loc, "\\images\\6405_16.png' alt=''/>");
                                }
                                detailsHTML.push("<div class='DCWorklistHoverParent'>");
                                    detailsHTML.push("<span", detailsData.DIFFERINGWORKINGDRGIND ? " style='font-weight:bold; color:red;'>" : ">");
                                        detailsHTML.push(workingDRG.DESCRIPTION, "&nbsp;(", workingDRG.SOURCEIDENTIFIER, ")");
                                    detailsHTML.push("</span>");
                                    detailsHTML.push("<div class='DCWorklistHover'>");
                                        for(var i = 0; i < detailsData.DRGS.length; i++) {
                                            var drg = detailsData.DRGS[i];
                                            detailsHTML.push("<p>");
                                                if (drg.TRANSFERRULEINDICATOR) {
                                                    detailsHTML.push("<img src='", this.loc, "\\images\\6405_16.png' alt=''/>");
                                                }
                                                detailsHTML.push(drg.DESCRIPTION, "&nbsp;(", drg.SOURCEIDENTIFIER, ")");
                                            detailsHTML.push("</p>");
                                            if(drg.SEVERITYOFILLNESSDISPLAY || drg.RISKOFMORTALITYDISPLAY || drg.DRGWEIGHT){
                                                detailsHTML.push("<p class='indention2 units-text'>");
                                                    detailsHTML.push(rcm_discharge_i18n.RCM_SEVERITY_OF_ILLNESS, "&nbsp;", drg.SEVERITYOFILLNESSDISPLAY, "&nbsp;&nbsp;&nbsp;");
                                                    detailsHTML.push(rcm_discharge_i18n.RCM_RISK_OF_MORTALITY, "&nbsp;", drg.RISKOFMORTALITYDISPLAY, "&nbsp;&nbsp;&nbsp;");
                                                    detailsHTML.push(rcm_discharge_i18n.RCM_DRG_WEIGHT, "&nbsp;", drg.DRGWEIGHT);
                                                detailsHTML.push("</p>");
                                            }
                                            detailsHTML.push("<p class='indention2'><span class='units-text'>", drg.FINALINDICATOR ? rcm_discharge_i18n.RCM_DRG_FINAL_HOVER : rcm_discharge_i18n.RCM_DRG_WORKING_HOVER, " (", drg.CONTRIBUTORSYSTEM, ")</span></p>");
                                        }
                                    detailsHTML.push("</div>");
                                detailsHTML.push("</div>");
                            }
                        detailsHTML.push("</dd>");
                    detailsHTML.push("</dl>");

                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_WORKING_DX, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.WORKING_DX_DESC));
                    if (RCM_Worklist.checkPersonData(detailsData.WORKING_DX) !== rcm_discharge_i18n.RCM_ERROR_MESSAGE) {
                        if (detailsData.WORKING_DX) {
                            detailsHTML.push("&nbsp;(", detailsData.WORKING_DX, ")</dd></dl>");
                        }
                        else {
                            detailsHTML.push("</dd></dl>");
                        }
                    }
                    else {
                        detailsHTML.push("&nbsp;(", rcm_discharge_i18n.RCM_ERROR_MESSAGE, ")</dd></dl>");
                    }
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_ADMIT_SOURCE, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.ADMIT_SOURCE), "</dd></dl>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_ADMIT_TYPE, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.ADMIT_TYPE), "</dd></dl>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_OBS_START_DTTM, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(RCM_Worklist.getDateTime(detailsData.OBS_START_DT_TM)), "</dd></dl>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_OBS_END_DTTM, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(RCM_Worklist.getDateTime(detailsData.OBS_END_DT_TM)), "</dd></dl>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_INPATIENT_ADMIT, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(RCM_Worklist.getDate(detailsData.ADMIT_TO_BED_DT)), "</dd></dl>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_FACILITY, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.FACILITY), "</dd></dl>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_MED_SERVICE, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.MED_SERVICE), "</dd></dl>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_AVOIDABLE_DAYS, "</dt>");
                    var avoidDays = RCM_Worklist.checkPersonData(detailsData.TOTAL_AVOIDABLE_DAYS);
                    var avoidableDaysTab = detailsData.AVOIDABLE_DAYS_LINK;
                    var avoidableDaysViewpointId = detailsData.AVOIDABLE_DAYS_VIEWPOINT_LINK;
                    var avoidableDaysViewId = detailsData.AVOIDABLE_DAYS_VIEW_LINK;
                    var avoidDaysString;
                    if (avoidDays === 1) {
                        avoidDaysString = avoidDays + " " + rcm_discharge_i18n.RCM_DAY;
                    }
                    else
                        if (avoidDays !== rcm_discharge_i18n.RCM_ERROR_MESSAGE && avoidDays !== 1) {
                            avoidDaysString = avoidDays + " " + rcm_discharge_i18n.RCM_DAYS;
                        }
                        else {
                            avoidDaysString = rcm_discharge_i18n.RCM_ERROR_MESSAGE;
                        }

                    if (avoidDays !== rcm_discharge_i18n.RCM_ERROR_MESSAGE && avoidDays > 0) {
                        detailsHTML.push("<dd class='dd-details'><a style='font-weight:bold; color:red; text-decoration:none;' " +
                                        "href='javascript:VIEWLINK(" + mode + ", \"" + appName + "\", \"" + this.personId + "\", \"" + encounterId + "\", \"" + avoidableDaysTab + "\", \"" + avoidableDaysViewId + "\", \"" + avoidableDaysViewpointId + "\");'>",
                                        avoidDaysString, "</a></dd></dl>");
                    }
                    else {
                        detailsHTML.push("<dd class='dd-details'><a style='color:black; text-decoration:none;' " +
                                        "href='javascript:VIEWLINK(" + mode + ", \"" + appName + "\", \"" + this.personId + "\", \"" + encounterId + "\", \"" + avoidableDaysTab + "\", \"" + avoidableDaysViewId + "\", \"" + avoidableDaysViewpointId + "\");'>",
                                        avoidDaysString, "</a></dd></dl>");
                    }
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_DENIED_DAYS, "</dt>");
                    var deniedDays = RCM_Worklist.checkPersonData(detailsData.TOTAL_DENIED_DAYS);
                    var deniedDaysTab = detailsData.DENIED_DAYS_LINK;
                    var deniedDaysViewpointId = detailsData.DENIED_DAYS_VIEWPOINT_LINK;
                    var deniedDaysViewId = detailsData.DENIED_DAYS_VIEW_LINK;
                    var deniedDaysString;
                    if (deniedDays === 1) {
                        deniedDaysString = deniedDays + " " + rcm_discharge_i18n.RCM_DAY;
                    }
                    else
                        if (deniedDays !== rcm_discharge_i18n.RCM_ERROR_MESSAGE && deniedDays !== 1) {
                            deniedDaysString = deniedDays + " " + rcm_discharge_i18n.RCM_DAYS;
                        }
                        else {
                            deniedDaysString = rcm_discharge_i18n.RCM_ERROR_MESSAGE;
                        }

                    if (deniedDays !== rcm_discharge_i18n.RCM_ERROR_MESSAGE && deniedDays > 0) {
                        if (deniedDaysTab === "") {
                            detailsHTML.push("<dd class='dd-details'><span style='font-weight:bold; color:red;'>", deniedDaysString, "</span></dd></dl>");
                        }
                        else {
                            detailsHTML.push("<dd class='dd-details'><a style='font-weight:bold; color:red; text-decoration:none;' " +
                                            "href='javascript:VIEWLINK(" + mode + ", \"" + appName + "\", \"" + this.personId + "\", \"" + encounterId + "\", \"" + deniedDaysTab + "\", \"" + deniedDaysViewId + "\", \"" + deniedDaysViewpointId + "\");'>",
                                            deniedDaysString, "</a></dd></dl>");
                        }
                    }
                    else {
                        if (deniedDaysTab === "" || deniedDaysTab === null) {
                            detailsHTML.push("<dd class='dd-details'><span style='color:black;'>", deniedDaysString, "</span></dd></dl>");
                        }
                        else {
                            detailsHTML.push("<dd class='dd-details'><a style='color:black; text-decoration:none;' " +
                                            "href='javascript:VIEWLINK(" + mode + ", \"" + appName + "\", \"" + this.personId + "\", \"" + encounterId + "\", \"" + deniedDaysTab + "\", \"" + deniedDaysViewId + "\", \"" + deniedDaysViewpointId + "\");'>",
                                            deniedDaysString, "</a></dd></dl>");
                        }
                    }

                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_LAST_CLINICAL_REVIEW_DATE, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(RCM_Worklist.getDate(detailsData.LAST_CLINICAL_REVIEW_DT_TM)), "</dd></dl>");
                    detailsHTML.push("</div>");//Utilization Management component-box
                    //Last Component Box
                    detailsHTML.push("<div class='component-box'>");
                    //Discharge Assessment Information
                    var dischargeAssessmentTab = detailsData.DC_PLAN_SUMMARY_LINK;
                    var dischargeAssessmentViewpointId = detailsData.DC_PLAN_SUMMARY_VIEWPOINT_LINK;
                    var dischargeAssessmentViewId = detailsData.DC_PLAN_SUMMARY_VIEW_LINK;
                    detailsHTML.push("<div class='add-demog-header'><a style='text-decoration:none; color: #3E3E3E;' " +
                                    "href='javascript:VIEWLINK(" + mode + ", \"" + appName + "\", \"" + this.personId + "\", \"" + encounterId + "\", \"" + dischargeAssessmentTab + "\", \"" + dischargeAssessmentViewId + "\", \"" + dischargeAssessmentViewpointId + "\");'>",
                                    rcm_discharge_i18n.RCM_DISCHARGE_ASSESSMENT_INFO, "</a></div><div class='shorter-form-separator'></div>");
                    if (RCM_Worklist.checkPersonData(detailsData.DISCHARGE_PLANNER) === rcm_discharge_i18n.RCM_ERROR_MESSAGE) {
                        detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, ":</dt><dd class='dd-details'>", rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</dd></dl>");
                    }
                    else {
                        for (var i = 0; i < detailsData.DISCHARGE_PLANNER.length; i++) {
                            var relIdString = "dcWorklistRel" + detailsData.DISCHARGE_PLANNER[i].RELATIONSHIP_TYPE_CD;
                            var subRelNumber = "dcWorklistRelNumber" + i;
                            detailsHTML.push("<dl id='",relIdString,"'><dt class='dt-details'>", detailsData.DISCHARGE_PLANNER[i].RELATIONSHIP_TYPE, ":</dt>");
                            if(detailsData.DISCHARGE_PLANNER[i].PERSONNEL_NAME === ""){
                                detailsHTML.push("<dd id='",subRelNumber,"' class='dd-details'><span id='dcWorklistDCRelationshipDisplay' class='dcWorklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",this.personId,",",encounterId,", this, event)'>", rcm_discharge_i18n.RCM_UNASSIGNED, "</span></dd></dl>");
                            }
                            else{
                                detailsHTML.push("<dd id='",subRelNumber,"' class='dd-details'><span id='dcWorklistDCRelationshipDisplay' class='dcWorklist-transparent-line' onMouseOver='RCM_Worklist.showDashedLine(this)' onMouseOut='RCM_Worklist.removeDashedLine(this)' onclick='RCM_Worklist.openWorklistModifyDialog(",this.personId,",",encounterId,", this, event)'>", detailsData.DISCHARGE_PLANNER[i].PERSONNEL_NAME, "</span></dd></dl>");
                            }
                            if(i === 0){
                                this.originalManagersRelOne = this.getListOfManagersWithRelationship(detailsData.DISCHARGE_PLANNER[i].RELATIONSHIP_TYPE_CD);
                            }
                            else{
                                this.originalManagersRelTwo = this.getListOfManagersWithRelationship(detailsData.DISCHARGE_PLANNER[i].RELATIONSHIP_TYPE_CD);
                            }
                        }
                    }
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_PLANNED_DISCHARGE_DATE, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.PLANNED_DISCHARGE_DT), "&nbsp;", RCM_Worklist.checkPersonData(detailsData.DISCHARGE_SLOT), "</dd></dl>");
                    var pendYesNO;
                    if (RCM_Worklist.checkPersonData(detailsData.DISCHARGE_PEND) !== rcm_discharge_i18n.RCM_ERROR_MESSAGE) {
                        if (detailsData.DISCHARGE_PEND === 1) {
                            pendYesNo = rcm_discharge_i18n.RCM_YES;
                        }
                        else {
                            pendYesNo = rcm_discharge_i18n.RCM_NO;
                        }
                    }
                    else {
                        pendYesNo = rcm_discharge_i18n.RCM_ERROR_MESSAGE;
                    }
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_ORDER, "</dt><dd class='dd-details'>", pendYesNo, "</dd></dl>");
                    var barrierYesNo;
                    if (RCM_Worklist.checkPersonData(detailsData.DISCHARGE_BARRIERS) !== rcm_discharge_i18n.RCM_ERROR_MESSAGE) {
                        if (detailsData.DISCHARGE_BARRIERS === 1) {
                            barrierYesNo = rcm_discharge_i18n.RCM_YES;
                        }
                        else {
                            barrierYesNo = rcm_discharge_i18n.RCM_NO;
                        }
                    }
                    else {
                        barrierYesNo = rcm_discharge_i18n.RCM_ERROR_MESSAGE;
                    }
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_DISCHARGE_BARRIERS, "</dt><dd class='dd-details'>", barrierYesNo, "</dd></dl>");
                    if (detailsData.MEDICARE_IND) {
                        var disImYesNo;
                        if (RCM_Worklist.checkPersonData(detailsData.DISCHARGE_IM) !== rcm_discharge_i18n.RCM_ERROR_MESSAGE) {
                            if (detailsData.DISCHARGE_IM === 1) {
                                disImYesNo = rcm_discharge_i18n.RCM_YES;
                            }
                            else {
                                disImYesNo = rcm_discharge_i18n.RCM_NO;
                            }
                        }
                        else {
                            disImYesNo = rcm_discharge_i18n.RCM_ERROR_MESSAGE;
                        }
                        detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_DISCHARGE_IM, "</dt><dd class='dd-details'>", disImYesNo, "</dd></dl>");
                    }
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_DISCHARGE_NEXT_ASSESSMENT_DT, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(RCM_Worklist.getDate(detailsData.DISCHARGE_NEXT_ASSES_DT)), "</dd></dl>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_LAST_ASSESSMENT_DATE, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.LAST_ASSESS_DT), "</dd></dl>");

                    // Final DRG
                    var finalDRG = RCM_Worklist.getDRGToDisplay(detailsData.DRGS, 1);
                    detailsHTML.push("<dl>");
                        detailsHTML.push("<dt class='dt-details'>", rcm_discharge_i18n.RCM_FINAL_DRG, "</dt>");
                        detailsHTML.push("<dd class='dd-details'>");
                            if(finalDRG) {
                                if (finalDRG.TRANSFERRULEINDICATOR) {
                                    detailsHTML.push("<img src='", this.loc, "\\images\\6405_16.png' alt=''/>");
                                }
                                detailsHTML.push("<div class='DCWorklistHoverParent'>");
                                    detailsHTML.push("<span", detailsData.DIFFERINGWORKINGDRGIND ? " style='font-weight:bold; color:red;'>" : ">");
                                        detailsHTML.push(finalDRG.DESCRIPTION, "&nbsp;(", finalDRG.SOURCEIDENTIFIER, ")");
                                    detailsHTML.push("</span>");
                                    detailsHTML.push("<div class='DCWorklistHover'>");
                                        for(var i = 0; i < detailsData.DRGS.length; i++) {
                                            var drg = detailsData.DRGS[i];
                                            detailsHTML.push("<p>");
                                                if (drg.TRANSFERRULEINDICATOR) {
                                                    detailsHTML.push("<img src='", this.loc, "\\images\\6405_16.png' alt=''/>");
                                                }
                                                detailsHTML.push(drg.DESCRIPTION, "&nbsp;(", drg.SOURCEIDENTIFIER, ")");
                                            detailsHTML.push("</p>");
                                            if(drg.SEVERITYOFILLNESSDISPLAY || drg.RISKOFMORTALITYDISPLAY || drg.DRGWEIGHT){
                                                detailsHTML.push("<p class='indention2 units-text'>");
                                                    detailsHTML.push(rcm_discharge_i18n.RCM_SEVERITY_OF_ILLNESS, "&nbsp;", drg.SEVERITYOFILLNESSDISPLAY, "&nbsp;&nbsp;&nbsp;");
                                                    detailsHTML.push(rcm_discharge_i18n.RCM_RISK_OF_MORTALITY, "&nbsp;", drg.RISKOFMORTALITYDISPLAY, "&nbsp;&nbsp;&nbsp;");
                                                    detailsHTML.push(rcm_discharge_i18n.RCM_DRG_WEIGHT, "&nbsp;", drg.DRGWEIGHT);
                                                detailsHTML.push("</p>");
                                            }
                                            detailsHTML.push("<p class='indention2'><span class='units-text'>", drg.FINALINDICATOR ? rcm_discharge_i18n.RCM_DRG_FINAL_HOVER : rcm_discharge_i18n.RCM_DRG_WORKING_HOVER, " (", drg.CONTRIBUTORSYSTEM, ")</span></p>");
                                        }
                                    detailsHTML.push("</div>");
                                detailsHTML.push("</div>");
                            }
                        detailsHTML.push("</dd>");
                    detailsHTML.push("</dl>");

                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_FINAL_PRIMARY_DX, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.FINAL_DX_DESC));
                    if (RCM_Worklist.checkPersonData(detailsData.FINAL_DX) !== rcm_discharge_i18n.RCM_ERROR_MESSAGE) {
                        if (detailsData.FINAL_DX) {
                            detailsHTML.push("&nbsp;(", detailsData.FINAL_DX, ")</dd></dl>");
                        }
                        else {
                            detailsHTML.push("</dd></dl>");
                        }
                    }
                    else {
                        detailsHTML.push(rcm_discharge_i18n.RCM_ERROR_MESSAGE, "</dd></dl>");
                    }
                    if(RCM_Worklist.checkPersonData(detailsData.USE_DISCHARGE_RECOM_IND)){
                        RCM_Worklist.makeCAPTimerCall("CAP:MPG.RCM.Recommended Disposition", RCM_Worklist.component.getCriterion().category_mean);
                        detailsHTML.push("<dl><dt class='dt-details'>",
                            rcm_discharge_i18n.RCM_RECOMMENDED_DISCHARGE_DISPOSITION,
                            "</dt><dd class='dd-details'>", detailsData.DISCHARGE_RECOM_DISPOSITION === "" ? "" :
                            rcm_discharge_i18n.RCM_RECOMMENDED_DISCHARGE_DISPOSITION_VALUE
                                        .replace("{0}",detailsData.DISCHARGE_RECOM_DISPOSITION)
                                        .replace("{Location}", detailsData.DISCHARGE_RECOM_LOC),
                            "</dd></dl>");
                    }
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_PLANNED_DISCHARGE_DISPOSITION
                                , "</dt><dd class='dd-details'>"
                                , RCM_Worklist.checkPersonData(detailsData.PLANNED_DISCHARGE_DISP), "</dd></dl>");
                    detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_ACTUAL_DISCHARGE_DISPOSITION
                                , "</dt><dd class='dd-details'>"
                                , RCM_Worklist.checkPersonData(detailsData.ACTUAL_DISCHARGE_DISP), "</dd></dl>");
                    if ((detailsData.DISCHARGE_FACILITY !== null && detailsData.DISCHARGE_FACILITY !== "") && (detailsData.FINAL_POST_ACUTE_ORG_NAME === null || detailsData.FINAL_POST_ACUTE_ORG_NAME === "")) {
                        detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_DISCHARGE_FACILITY, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.DISCHARGE_FACILITY), "</dd></dl>");
                    }
                    else {
                        detailsHTML.push("<dl><dt class='dt-details'>", rcm_discharge_i18n.RCM_POST_ACUTE_FACILITY, "</dt><dd class='dd-details'>", RCM_Worklist.checkPersonData(detailsData.FINAL_POST_ACUTE_ORG_NAME), "</dd></dl>");
                    }
                    detailsHTML.push("</div>");//Discharge Assessment component-box
                    detailsHTML.push("</div>");//scrollable
                    detailsHTML.push("</div>");//add-demog
                    detailsHTML.push("</div>");//expanded-row-border
                }

                var detailsHTMLString = detailsHTML.join("");
                var parentElement = document.getElementById('summaryExpandable' + encounterId);
                parentElement.innerHTML = detailsHTMLString;


                // Setup any hovers that were just added.
                $(parentElement).find(".DCWorklistHoverParent").each(function(){
                    hs($(this).get(0), $(this).children(".DCWorklistHover").get(0));
                });

                // expanded summary row y location.
                var rowY = RCM_Worklist.findLoc(summaryRow)[1];
                var headerRow = document.getElementById('floatingPersonListHeader');
                var headerHeight = headerRow.offsetHeight;

                // expanded section top y position
                var expandedTopY = rowY;
                // expanded section bottom y position
                var expandedBottomY = rowY + summaryRow.offsetHeight;

                // the window height
                var windowHeight = document.documentElement.clientHeight;
                // current window top y position. Add the floation header height.
                var windowTopY = document.documentElement.scrollTop + headerHeight;
                // current window bottom y position
                var windowBottomY = document.documentElement.scrollTop + windowHeight;

                // the expanded section is over the bottom
                if (expandedBottomY > windowBottomY && expandedTopY >= windowTopY) {
                    document.documentElement.scrollTop = document.documentElement.scrollTop + expandedBottomY - windowBottomY;
                }
                else if (expandedTopY < windowTopY) {
                    document.documentElement.scrollTop = document.documentElement.scrollTop - summaryRow.offsetHeight - headerHeight;
                }
            }
            this.setDefaultCursor();
        },
        getDate: function(date){
            var nrDate;
            if (date === "") {
                nrDate = "";
            }
            else {
                var tempDate = new Date();
                tempDate.setISO8601(date);
                nrDate = new Date(tempDate).format('shortDate2');
            }
            return nrDate;
        },
        getDateTime: function(date){
            var nrDate;
            if (date === "") {
                nrDate = "";
            }
            else {
                var tempDate = new Date();
                tempDate.setISO8601(date);
                nrDate = new Date(tempDate).format('longDateTime3');
            }
            return nrDate;
        },
        getComparisonDate: function(date){
            var nrDate;
            if (date === "") {
                nrDate = "";
            }
            else {
                var tempDate = new Date();
                tempDate.setISO8601(date);
                nrDate = new Date(tempDate);
                nrDate.setHours(0);
                nrDate.setMinutes(0);
                nrDate.setSeconds(0);
                nrDate.setMilliseconds(0);
            }
            return nrDate;
        },
        getTodaysDate: function(){
            var tempDate = new Date();
            tempDate.setHours(0);
            tempDate.setMinutes(0);
            tempDate.setSeconds(0);
            tempDate.setMilliseconds(0);
            return tempDate;
        },

        getTomorrowsDate: function(){
            var tomorrowDate = new Date();
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            tomorrowDate.setHours(0);
            tomorrowDate.setMinutes(0);
            tomorrowDate.setSeconds(0);
            tomorrowDate.setMilliseconds(0);
            return tomorrowDate;
        },

        getYesterdaysDate: function(){
            var yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            yesterdayDate.setHours(0);
            yesterdayDate.setMinutes(0);
            yesterdayDate.setSeconds(0);
            yesterdayDate.setMilliseconds(0);
            return yesterdayDate;
        },

        getTwoDaysFromNowDate: function() {
            var twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
            twoDaysFromNow.setHours(0);
            twoDaysFromNow.setMinutes(0);
            twoDaysFromNow.setSeconds(0);
            twoDaysFromNow.setMilliseconds(0);
            return twoDaysFromNow;
        },

        getNumOfDaysAgo: function(nextReviewDate){
            var tempDate = new Date();
            tempDate.setISO8601(nextReviewDate);
            var nrDate = new Date(tempDate);
            var nextReview = nrDate.getTime();
            var tempDate2 = new Date();
            var today = tempDate2.getTime();
            var days = Math.floor((Math.abs(today - nextReview)) / (1000 * 60 * 60 * 24));
            var dateString = rcm_discharge_i18n.RCM_DAYS_AGO.replace("{0}", days);
            return dateString;
        },

        findLoc: function(obj){
            var curleft = curtop = 0;
            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                }
                while (obj = obj.offsetParent);
                return [curleft, curtop];
            }
        },

        /**
        * Creates patient link
        */
        patInfoLink: function(person, appl, background, alertImage, alertsInfo){
            this.person = person;
            if (!(person.PATIENT_NAME)) {
                var html = [];
                html.push("<div><br/></div>");
                return html.join("");
            }
            else {
                var personName = person.PATIENT_NAME;
                var personId = person.PATIENT_ID;
                var encounterId = person.ENCOUNTER_ID;
                var mode = 0;
                var appName = appl;
                var tab = person.DUE_DATE_LINK;
                var viewpointId = person.DUE_DATE_VIEWPOINT_LINK;
                var viewId = person.DUE_DATE_VIEW_LINK;
                var html = [];
                var backgroundColor = background;

                if (alertImage !== "") {
                    html.push("<div>");
                        html.push("<div class='DCWorklistHoverParent' style='float:left;'><img class='alert-image' src='", alertImage, "'>");
                            html.push("<div class='DCWorklistHover'>");
                            html.push("<div id='dcmAlertHover", Math.abs(encounterId), "' class='DCWorklistAlertsHover'>");
                            var isFirstLine = true;
                            if (alertsInfo.losAlert !== "") {
                                if (!isFirstLine) {
                                    html.push("<br />");
                                }
                                else {
                                    isFirstLine = false;
                                }
                                html.push(alertsInfo.losAlert);
                            }

                            if (alertsInfo.authAlert !== "") {
                                if (!isFirstLine) {
                                    html.push("<br />");
                                }
                                else {
                                    isFirstLine = false;
                                }
                                html.push(alertsInfo.authAlert);
                            }

                            if (alertsInfo.readmissionAlert !== "") {
                                if (!isFirstLine) {
                                    html.push("<br />");
                                }
                                else {
                                    isFirstLine = false;
                                }
                                html.push(alertsInfo.readmissionAlert);
                            }

                            if (alertsInfo.unassignedWithOrdersAlert !== "") {
                                if (!isFirstLine) {
                                    html.push("<br />");
                                }
                                else {
                                    isFirstLine = false;
                                }
                                html.push(alertsInfo.unassignedWithOrdersAlert);
                            }

                            if (alertsInfo.concurrentDenialAlert !== "") {
                                if (!isFirstLine) {
                                    html.push("<br />");
                                }
                                else {
                                    isFirstLine = false;
                                }
                                html.push(alertsInfo.concurrentDenialAlert);
                            }

                            if (alertsInfo.differingWorkingDRGAlert !== "") {
                                if (!isFirstLine) {
                                    html.push("<br />");
                                }
                                else {
                                    isFirstLine = false;
                                }
                                html.push(alertsInfo.differingWorkingDRGAlert);
                            }

                            html.push("</div>");
                            html.push("</div>");
                        html.push("</div>");
                }
                else{
                    html.push("<div>");
                        html.push("<div  id='dcmImageParent", Math.abs(encounterId), "' class='DCWorklistHoverParent' style='float:left;'>");
                            html.push("<div class='DCWorklistHover'>");
                            html.push("<div id='dcmAlertHover", Math.abs(encounterId), "' class='DCWorklistAlertsHover'>");
                            html.push("</div>");
                            html.push("</div>");
                        html.push("</div>");
                }
                    html.push("<div class='DCWorklistHoverParent'>");
                        html.push("<a style='font-size:12px; font-weight:bold; color:#2400A5; text-decoration:none; border:none; text-indent:2em;' " +
                                        "href='javascript:VIEWLINK(" + mode + ", \"" + appName + "\", \"" + personId + "\", \"" + encounterId + "\", \"" + tab + "\", \"" + viewId + "\", \"" + viewpointId + "\");'>",
                                        personName, "</a>");
                        html.push("<div class='DCWorklistHover'>");
                            html.push("<div>");
                                html.push("<span class='DCWorklistHoverLabel'>", rcm_discharge_i18n.RCM_MRN, "</span>");
                                html.push("<span class='DCWorklistHoverValue'>", person.MRN, "</span>");
                            html.push("</div>");
                            html.push("<div>");
                                html.push("<span class='DCWorklistHoverLabel'>", rcm_discharge_i18n.RCM_DOB, "</span>");
                                html.push("<span class='DCWorklistHoverValue'>", person.DOB, "</span>");
                            html.push("</div>");
                            html.push("<div>");
                                html.push("<span class='DCWorklistHoverLabel'>", rcm_discharge_i18n.RCM_DISCHARGE_PLAN_STATUS, ":</span>");
                                if(person.DISCHARGE_PLAN_STATUS){
                                    html.push("<span class='DCWorklistHoverValue'>", person.DISCHARGE_PLAN_STATUS, "</span>");
                                }
                                else{
                                    html.push("<span class='DCWorklistHoverValue'>", rcm_discharge_i18n.RCM_NOT_AVAILABLE, "</span>");
                                }
                            html.push("</div>");
                        html.push("</div>");
                    html.push("</div>");
                html.push("</div>");
            }
            return html.join("");
        },

        /**
        * Creates visit info link
        */
        visitInfoLink: function(patientId, encounterId, tab, viewId, viewpointId){
            var mode = 0;
            var appName = rcm_discharge_i18n.RCM_POWERCHART;
            var hyperlinkText = rcm_discharge_i18n.RCM_VIEW_ALL_VISITS;
            return "<a style='font-size:12px; color:#3380E5; text-decoration:none; padding-left:4em; white-space:nowrap;' " +
                "href='javascript:VIEWLINK(" + mode + ", \"" + appName + "\", \"" + patientId + "\", \"" + encounterId + "\", \"" + tab + "\", \"" + viewId + "\", \"" + viewpointId + "\");'>" +
                hyperlinkText + "</a>";
        },

        checkPersonData: function(personData){
            if (personData == undefined) {
                return rcm_discharge_i18n.RCM_ERROR_MESSAGE;
            }
            else {
                return personData;
            }
        },

        /**
         * Returns the DRG to display based on the mode.
         * @param drgs The list of DRG records.
         * @param mode The mode.  0 = Return either working or final DRG. 1 = Return only final DRG. 2 = Return only working DRG.
         * @returns
         */
        getDRGToDisplay: function(drgs, mode) {
            switch(drgs.length) {
            case 0:
                return null;
            case 1:
                var drg = drgs[0];
                switch(mode) {
                case 0:
                    return drg;
                case 1:
                    return drg.FINALINDICATOR ? drg : null;
                case 2:
                    return !drg.FINALINDICATOR ? drg : null;
                }
            default:
                // Final is not returned when there are multiple DRGs.
                if(mode === 1) {
                    return null;
                }
                for(var i = 0; i < drgs.length; i++) {
                    var drg = drgs[i];
                    if(drg.CMWORKINGDRGIND) {
                        return drg;
                    }
                }
                // There are no Care Management Working DRGs so return the first one.
                return drgs[0];
            }
        },
        openReadOnlyDialog: function(personId,element,event){
            this.clearDialogs();
            //Removes any open note hover
            this.clearHover();
            //Removes the solid border and background color around any other element
            //on the worklist so that the element clicked is the only one with the solid
            //line and background color
            if($("#tableDiv").find("span, div, img").hasClass("dcWorklist-solid-line-grey") && !($(element).hasClass("dcWorklist-solid-line-grey"))){
                $(".dcWorklist-solid-line-grey").addClass("dcWorklist-transparent-line");
                $(".dcWorklist-solid-line-grey").removeClass("dcWorklist-solid-line-grey");
            }
            if($("#tableDiv").find("span, div, img").hasClass("dcWorklist-solid-line")){
                $(".dcWorklist-solid-line").addClass("dcWorklist-transparent-line");
                $(".dcWorklist-solid-line").removeClass("dcWorklist-solid-line");
            }
            //Hide note icons that were previously showing due to edit mode
            $(".diswl-note-image-show").removeClass("diswl-note-image-show");
            $(".diswl-note-image-edit").removeClass("diswl-note-image-edit");
            //Removes the dashed border around the label hovered over,
            //adds a solid border and background color, creates the modify
            //dialog and opens it
            $(".dcWorklist-dashed-line-grey").removeClass("dcWorklist-dashed-line-grey");
            $(element).addClass("dcWorklist-solid-line-grey");
            this.dcworklistReadOnlyDialog = document.getElementById("dcWorklistReadOnlyDialog");
            var pos = this.getMousePosition(element, event);
            document.getElementById("dcWorklistReadOnlyDialog").style.top = pos.y + 'px';
            document.getElementById("dcWorklistReadOnlyDialog").style.left = pos.x + 'px';
            $("#dcWorklistReadOnlyDialog").show();
            this.loadRiskDetails(personId);

        },
        openRelationshipErrorDialog: function(personnelName, relationship){
            $("#dcWorklistOkDialogTitle").html(rcm_discharge_i18n.RCM_RELATIONSHIP_ERROR_TITLE);
            var htmlString = personnelName + rcm_discharge_i18n.RCM_RELATIONSHIP_ERROR_MESSAGE_PART_ONE + relationship + rcm_discharge_i18n.RCM_RELATIONSHIP_ERROR_MESSAGE_PART_TWO;
            $("#dcWorklistOkDialogMessage").html(htmlString);
            $("#dcWorklistOkDialog").show();
            $("#listBlockingDiv").show();
            RCM_Clinical_Util.setFocus("dcWorklistOkDialog");
        },

        openStaleDataDialog: function(){
            $("#dcWorklistOkDialogTitle").html(rcm_discharge_i18n.RCM_STALE_DATA_TITLE);
            $("#dcWorklistOkDialogMessage").html(rcm_discharge_i18n.RCM_STALE_DATA_MESSAGE);
            $("#dcWorklistOkDialog").show();
            $("#listBlockingDiv").show();
            RCM_Clinical_Util.setFocus("dcWorklistOkDialog");
        },

        openSaveFailedDialog: function(){
            $("#dcWorklistOkDialogTitle").html(rcm_discharge_i18n.RCM_SAVE_FAILED);
            $("#dcWorklistOkDialogMessage").html(rcm_discharge_i18n.RCM_SAVE_FAILED_MESSAGE);
            $("#dcWorklistOkDialog").show();
            $("#listBlockingDiv").show();
            RCM_Clinical_Util.setFocus("dcWorklistOkDialog");
        },
        openLoadOrderDetailsErrorDialog: function(){

            $("#dcWorklistOkDialogTitle").html(rcm_discharge_i18n.RCM_LOAD_ORDER_DETAILS_FAILED);
            $("#dcWorklistOkDialogMessage").html(rcm_discharge_i18n.RCM_LOAD_ORDER_DETAILS_FAILED_MESSAGE);
            $("#dcWorklistOkDialog").show();
            $("#listBlockingDiv").show();
            RCM_Clinical_Util.setFocus("dcWorklistOkDialog");
        },
        openLoadRiskDetailsErrorDialog: function(){
            $("#dcWorklistOkDialogTitle").html(rcm_discharge_i18n.RCM_LOAD_RISK_DETAILS_FAILED);
            $("#dcWorklistOkDialogMessage").html(rcm_discharge_i18n.RCM_LOAD_RISK_DETAILS_FAILED_MESSAGE);
            $("#dcWorklistOkDialog").show();
            $("#listBlockingDiv").show();
            RCM_Clinical_Util.setFocus("dcWorklistOkDialog");
        },
        openPrintFailedDialog: function(){
            $("#dcWorklistOkDialogTitle").html(rcm_discharge_i18n.RCM_PRINT_FAILED);
            $("#dcWorklistOkDialogMessage").html(rcm_discharge_i18n.RCM_PRINT_FAILED_MESSAGE);
            $("#dcWorklistOkDialog").show();
            $("#listBlockingDiv").show();
            RCM_Clinical_Util.setFocus("dcWorklistOkDialog");
        },
        openTooManyPrintDialog: function(){
            $("#worklistTooManyDialogTitle").html(rcm_discharge_i18n.RCM_PRINT_WORKLIST_TOO_MANY_TITLE);
            $("#worklistTooManyDialogMessage").html(rcm_discharge_i18n.RCM_PRINT_WORKLIST_TOO_MANY);
            $("#worklistTooManyDialog").show();
            $("#listBlockingDiv").show();
            RCM_Clinical_Util.setFocus("worklistTooManyDialog");
        },
        openLoadReferralsErrorDialog: function(){
            $("#dcWorklistOkDialogTitle").html(rcm_discharge_i18n.RCM_LOAD_REFERRALS_FAILED);
            $("#dcWorklistOkDialogMessage").html(rcm_discharge_i18n.RCM_LOAD_REFERRALS_FAILED_MESSAGE);
            $("#dcWorklistOkDialog").show();
            $("#listBlockingDiv").show();
            RCM_Clinical_Util.setFocus("dcWorklistOkDialog");
        },

        closeOkDialog: function(){
            $("#dcWorklistOkDialog").hide();
            $("#listBlockingDiv").hide();
        },
        closeReadOnlyDialog: function(){
            $(".dcWorklist-solid-line-grey").removeClass("dcWorklist-solid-line-grey");
            if(this.dcworklistReadOnlyDialog){
                this.dcworklistReadOnlyDialog.innerHTML = '';
                this.dcworklistReadOnlyDialog.style.display = 'none';
                this.dcworklistReadOnlyDialog = null;
            }
            $(window).resize();
        },
        closePrintTooManyDialog: function(printWorklist){
            $("#worklistTooManyDialog").hide();
            $("#listBlockingDiv").hide();
            if(printWorklist){
                RCM_Worklist.printWorklist(true);
            }
        },

        /**
         * Sorts the list of DRGs so that CM working DRGs are first.
         * @param drgs The list of DRGs.
         */
        sortDRGs: function(drgs) {
            drgs.sort(function(drg1, drg2) {
                // Return  0 when they are the same.
                // Return  1 when drg1 is CM and drg2 is not CM.
                // Return -1 when drg1 is not CM and drg2 is CM.
                return drg2.CMWORKINGDRGIND - drg1.CMWORKINGDRGIND;
            });
        },

        getDiscernOrderLabel: function(){
            return this.discernOrderLabel;
        },
        getPageLink: function() {
            return this.pageLink;
        },

        sizeModifyHoverOverlay: function(){
            overlayWidth = this.dcworklistModifyHover.offsetWidth + 40;
            overlayHeight = this.dcworklistModifyHover.offsetHeight + 40;
            this.dcworklistModifyHoverOverlay.style.width = overlayWidth + 'px';
            this.dcworklistModifyHoverOverlay.style.height = overlayHeight + 'px';
        },

        getEddsByEncounterIds: function(personBatch, handler){
            var encounterIds = [];
            for(var i=0; i < personBatch.length; i++){
                var encntrId = Math.abs(personBatch[i].ENCOUNTER_ID);
                if (encntrId > 0){
                    encounterIds.push(encntrId);
                }
            }
            if (encounterIds.length > 0) {
                jsonRequest = {
                    encounterIds: encounterIds,
                    topicMeaning: "MP_DCM_WORKLIST",
                    reportMeaning: "MP_DCM_WORKLIST_INFO"
                };
                var sendAr = [];
                sendAr.push("^MINE^", "0.0", "^GetPddsByEncounters^", "^" + JSON.stringify(jsonRequest) + "^");

                var businesses = [];

                var info = new XMLCclRequest();
                info.onreadystatechange = function() {
                    if (info.readyState === 4 && info.status === 200) {
                        var jsonEval = JSON.parse(decodeURIComponent(info.responseText));
                        var recordData = jsonEval.RECORD_DATA;
                        var eddList;
                        if (recordData.STATUS_DATA.STATUS === "S") {
                            eddList = recordData.serviceData;
                            handler("S", eddList);
                        } else {
                            handler("F", eddList);
                        }
                        try {
                            info.cleanup();
                        } catch (err) {
                            //Used to catch case in old mpages where cleanup function does not exist.
                        }
                    }
                };

                info.open('GET', "RCM_JSON_SERVICE", 1);
                info.send(sendAr.join(","));
            }
        },

        loadAuthRibbons: function(){
            var timerLoadAuthRibbons = MP_Util.CreateTimer("USR:MPG.DischargeReviewWorklist - Load Auth Ribbons", RCM_Worklist.component.getCriterion().category_mean);
            if(this.ribbonSettings.isEddOn){
                var getEdds = this.getEddsByEncounterIds;
                var findEdd = this.findEddByEncounter;
                var loc = this.loc;
                var personInfo = this.personInfo;
                var ribbonSettings = this.ribbonSettings;
                var lastBatch = false;
                var batchSize = 20;
                var nextStart = 0;
                var endPlace;
                $("#worklistPrintLink").hide();
                if(personInfo.length <= nextStart + batchSize){
                    lastBatch = true;
                    endPlace = personInfo.length;
                }
                else{
                    endPlace = nextStart + batchSize;
                }
                var personBatch = personInfo.slice(0, endPlace);

                var handler = function(status, eddList){
                    var callSuccess = status === "S";
                    if(!callSuccess && timerLoadAuthRibbons) {
                        timerLoadAuthRibbons.Abort();
                        timerLoadAuthRibbons = null;
                    }
                    for(var i=0; i < personBatch.length; i++){
                        var person = personBatch[i];
                        var encounterId = Math.abs(person.ENCOUNTER_ID);
                        var authHours = person.EARLIEST_AUTH_END_DT_HOURS;
                        var eddInfo = callSuccess ? findEdd(encounterId, eddList) : null;
                        var pddHours = eddInfo ? eddInfo.pddHours : 0;
                        var displayDRG = RCM_Worklist.getDRGToDisplay(person.DRGS, 0);
                        var losHours = person.LENGTH_OF_STAY;
                        var elosHours = 0;
                        if(displayDRG) {
                            elosHours = displayDRG.ESTIMATEDLENGTHOFSTAYINHOURS;
                        }
                        if(pddHours && losHours > pddHours){
                            var isFirstLine = false;
                            if($("#dcmImageParent" + encounterId).length !== 0){
                                $("#dcmImageParent" + encounterId).prepend("<img class='alert-image' src='" + loc + "\\images\\6047.ico" + "'>");
                                isFirstLine = true;
                            }
                            if (!isFirstLine) {
                                $("#dcmAlertHover" + encounterId).append("<br />");
                            }
                            $("#dcmAlertHover" + encounterId).append(rcm_discharge_i18n.RCM_ALERT_PDD);
                        }

                        var personRibbonInfo = {
                            ENCOUNTER_ID: encounterId,
                            AUTHORIZATION_DT_TM: person.EARLIEST_AUTH_END_DT_TM,
                            HEALTH_PLAN_AUTHORIZATIONS: person.HEALTH_PLAN_AUTHORIZATIONS,
                            EDD_DATE: callSuccess ? eddInfo.pddDisplay : "",
                            EDD_TIME_INTERVAL: callSuccess ? eddInfo.pddTimeSlot : "",
                            ELOS_DATE: RcmAuthRibbonHelper.calculateDateFromAdmit(person.ADMIT_DATE, elosHours)
                        };
                        var authRibbon = new RcmAuthRibbon(losHours, elosHours, pddHours, authHours, personRibbonInfo, ribbonSettings, loc);
                        $("#losRibbon" + encounterId).html(authRibbon.getAllRibbonHtml());
                    }

                    if(!lastBatch){
                        nextStart += batchSize;
                        lastBatch = personInfo.length <= nextStart + batchSize;
                        endPlace = lastBatch ? personInfo.length : nextStart + batchSize;
                        personBatch = personInfo.slice(nextStart, endPlace);
                        getEdds(personBatch, handler);
                    }
                    else{
                        $("#worklistPrintLink").show();
                        if(timerLoadAuthRibbons) {
                            timerLoadAuthRibbons.Stop();
                        }
                    }
                };
                getEdds(personBatch, handler);
            }
        },

        findEddByEncounter: function(encounterId, eddList){
            for(var i=0; i < eddList.length; i++){
                if(eddList[i].encounterId === encounterId){
                    return eddList[i];
                }
            }
            return 0;
        },
        createLOCPopOutShell: function () {
            var popOutDiv = document.createElement("div");
            popOutDiv.id = "dcWorklistLOCPopOutDiv";
            popOutDiv.className = "dcWorklist-loc-pop-out-div dcWorklist-loc-pop-out-hidden";
            document.body.appendChild(popOutDiv);
        },

        openLOCPopOut: function (name, encounterId) {
            var popOut = $("#dcWorklistLOCPopOutDiv");
            if (popOut.length > 0) {
                if (popOut.hasClass("dcWorklist-loc-pop-out-hidden")) {
                    popOut.removeClass("dcWorklist-loc-pop-out-hidden");
                    popOut.html(this.getLOCPopOut(encounterId));
                    var lineWidth = popOut.find(".dcWorklist-loc-pop-out-inner").width();
                    popOut.find(".dcWorklist-loc-horizontal-line").width(lineWidth);
                    var dcWorklistLOCOffset = $(name).offset();

                    //Numeric values mirrored from rcm-auth-ribbon
                    var popOutTop = dcWorklistLOCOffset.top + $(name).height() - 3;
                    var popOutLeft = dcWorklistLOCOffset.left + $(name).width() / 2 - popOut.width() / 2;
                    popOut.offset({
                        top: popOutTop,
                        left: popOutLeft
                    });
                    this.currentLOCEncounterId = encounterId;
                } else {
                    popOut.addClass("dcWorklist-loc-pop-out-hidden");
                    if (this.currentLOCEncounterId !== encounterId) {
                        this.openLOCPopOut(name, encounterId);
                    }
                }
            }
        },

        getLOCPopOut: function (encounterId) {
            if (RCM_Worklist.referrals[encounterId]) {
                var encounterReferrals = RCM_Worklist.referrals[encounterId]
                var jsHTML = [];
                jsHTML.push("<img class='dcWorklist-loc-pop-out-top-img' src='", this.popOutTopImage, "'>");
                jsHTML.push("<div class='dcWorklist-loc-pop-out-outer'>");
                jsHTML.push("<div class='dcWorklist-loc-pop-out-inner'>");
                var referralDetails = [];
                for (var i = 0; i < encounterReferrals.length; i++) {
                    referralDetails.push("<div class='dcWorklist-loc-bold dcWorklist-loc-bottom-spacing dcWorklist-loc-disp'>", encounterReferrals[i].levelOfCareDisplay);
                    if (encounterReferrals[i].bookedProviders.length === 0) {
                        referralDetails.push(" (", encounterReferrals[i].totalCount, ")");
                    }
                    referralDetails.push("</div>");
                    if (encounterReferrals[i].bookedProviders.length === 0) {
                        var statusTokens = [];
                        for (var response in encounterReferrals[i].responseCounts) {
                          if(encounterReferrals[i].responseCounts.hasOwnProperty(response)) {
                              if (response && parseInt(encounterReferrals[i].responseCounts[response], 10) > 0) {
                                statusTokens.push(rcm_discharge_i18n.RCM_LAST_UPDATE_STATUS.replace('{0}', response).replace('{1}', encounterReferrals[i].responseCounts[response]));
                            }
                          }
                        }
                        referralDetails.push("<div class='dcWorklist-loc-bottom-spacing'>", statusTokens.join('<br />'), "</div>")
                    }
                    for (var j = 0; j < encounterReferrals[i].bookedProviders.length; j++) {
                        var bookedProvider = encounterReferrals[i].bookedProviders[j];
                        referralDetails.push("<div class='dcWorklist-loc-bottom-spacing'><span>")
                        // check that trimmed name is not empty. Note: Regex here is a polyfill for String.prototype.trim()
                        if (bookedProvider.name && bookedProvider.name.replace(/^\s+|\s+$/g, '').length > 0) {
                            referralDetails.push(bookedProvider.name, "<br />");
                        }
                        // check that trimmed address joined together is not empty. Note: Regex here is a polyfill for String.prototype.trim()
                        if (bookedProvider.address && bookedProvider.address.join('').replace(/^\s+|\s+$/g, '').length > 0) {
                            referralDetails.push(bookedProvider.address.join("<br />"), "<br />");
                        }
                        // check that trimmed phone is not empty. Note: Regex here is a polyfill for String.prototype.trim()
                        if (bookedProvider.phone && bookedProvider.phone.replace(/^\s+|\s+$/g, '').length > 0) {
                            referralDetails.push(bookedProvider.phone, "<br />");
                        }
                        // check that trimmed email is not empty. Note: Regex here is a polyfill for String.prototype.trim()
                        if (bookedProvider.email && bookedProvider.email.replace(/^\s+|\s+$/g, '').length > 0) {
                            referralDetails.push(bookedProvider.email);
                        }
                        referralDetails.push("</span></div>");
                    }
                    if (encounterReferrals.length > 1 && i < encounterReferrals.length - 1) {
                        referralDetails.push("<div class='dcWorklist-loc-horizontal-line'></div>");
                    }
                }
                jsHTML.push(referralDetails.join(""));
                jsHTML.push("</div>");
                jsHTML.push("</div>");
                return jsHTML.join("");
            } else {
                return "";
            }
        }
    };
}();
