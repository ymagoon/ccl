define(['durandal/system', 'services/dataservice', 'durandal/app', 'mpages/logger', 'knockout', 'ko.command', 'i18next', 'plugins/dialog', 'services/model', 'jquery'], function (system, dataService, app, logger, ko, koCommand, i18n, dialog, model, $) {
    /***********************************************************************
    *   Constants
    ***********************************************************************/
    var TOPIC_MEAN = "MP_RPH_WORKLIST";
    var CDF_MEANING = "^RX_WLIST^";
    var MPAGE_DESCRIPTION = "^Clinical Pharmacist Worklist^";
    var MESSAGE_BOX_YES = i18n.t('app:modules.stickyNote.MESSAGE_BOX_YES'),
        MESSAGE_BOX_NO = i18n.t('app:modules.stickyNote.MESSAGE_BOX_NO'),
        MESSAGE_BOX_TITLE = i18n.t('app:modules.myPopulation.MESSAGE_BOX_TITLE'),
        MESSAGE_BOX_CONTENT = i18n.t('app:modules.myPopulation.MESSAGE_BOX_CONTENT');

    var vm = function () {
        /*********************************************************************
        *   Private Variables
        *
        **********************************************************************/
        var detached = false;
        var self = this;
        // Constant value for displaying the "--New--" text in the Views dropdown.
        var viewCaption = i18n.t('app:modules.myPopulation.MY_VIEWS_CAPTION');

        /***
        *   Stores the current default view. This is required when another
        *   view is marked as default. In such a case, the original default view
        *   needs to be reset.
        */
        var defaultView = null;

        /*********************************************************************
        *   Observables
        *
        **********************************************************************/

        /**
        * The following objects should be identical to the objects seen in the patient_population file.
        * These objects are necessary to provide the lists of views, facilities, associated nurse units, patient lists, and all risk categories.
        * Additionally, these objects are set to provide details on which of the these lists have been selected.
        **/
        var catPopulationListName = ko.observable();
        var patientsList = ko.observableArray([]);
        var selectedList = ko.observable();
        var selectedMyView = ko.observable();
        var selectedFacility = ko.observable();
        var facilitiesList = ko.observableArray([]);
        var selectedNurseUnits = ko.observableArray([]);
        var fullRiskCategories = ko.observableArray([]);
        var myViewsList = ko.observableArray([]);
        // List of High Risk Categories selected to be added to "My Categories" listbox
        var selectedAddRisks = ko.observableArray([]);
        // List of High Risk Categories selected to be removed from "My Categories" listbox
        var selectedRemoveRisks = ko.observableArray([]);
        // List of High Risk Categories currently in the "My Categories" listbox
        var myRiskCategories = ko.observableArray([]);
        // First selected High Risk Category in the "My Categories" listbox. This is used for sequencing purposes only.
        var firstSelectedRemoveRisk = ko.observable();
        // List of all High Risk Categories. This is cached so that when changes are made by moving High Risks from the "High Risk Categories" listbox over to the "My Categories" listbox,
        // that the data can be easily retrieved by slicing the data from the fullCachedRisks.
        var fullCachedRisks = ko.observableArray([]);
        // Determines whether the Apply or OK button can be clicked.
        var disabledActionButtons = ko.observable(true);
        // Object that stores information about the selected facility or patient list.
        var catPopulationList = ko.observable();

        // Variable to hold the textual value of the selected view in order to display it in the Selected Patient Population column.
        var displayedSelectedViewText = ko.observable(viewCaption);
        // Holds the value of the Default checkbox.
        var defaultInd = ko.observable();
        // Variable holding the value of the "Enter Name of View" textbox.
        var selectedViewText = ko.observable();


        var disablePatientList = ko.observable(false);
        var disableFacilitiesList = ko.observable(false);
        /**********************************************************************************************
        *   Computed Variables
        *
        **********************************************************************************************/

        // Enables/disables the Nurse Unit button depending on whether a Facility is selected from the dropdown or not.
        var isNurseUnitActive = ko.computed(function () {
            if (selectedFacility()) {
                return true;
            }
            return false;
        });

        /**
        * A computed field to decide if the Patien List dropdown is enabled.
        */
        var isPatientListActive = ko.computed(function () {
            if (selectedFacility() || disablePatientList()) {
                return false;
            }

            return true;
        });

        /**
        * A computed field to decide if the Facilities dropdown is enabled.
        */
        var isFacilitiesActive = ko.computed(function () {
            if (selectedList() || disableFacilitiesList()) {
                return false;
            }
            return true;
        });


        /*************************************************************************************
        *   Manual Subscriptions
        *
        *************************************************************************************/

        /** Executes the appropriate actions when selecting an option from the Views dropdown.
        * - If an available view (already assigned to the user) is selected, then the assigned patient list or facility and nurse units are selected in the dropdowns
        *   and checkboxes (nurse units), the High Risk Categories are shown in the "My Categories" listbox" and the appropriate text is shown in the "Selected Patient Population".
        * - If the "--New--" view option (to create a new view) is selected, then the patient list, facility list, nurse units and High Risk Categories are reset to show
        *   that nothing is currently selected. The only text shown in the "Selected Patient Population" column is "--New--".
        **/
        var selectedViewSubscription = selectedMyView.subscribe(function (newValue) {
            try {
                if (newValue) {
                    selectedViewText(newValue.MYPOPJSON.LISTREPLY.DISPLAYNAME);
                    displayedSelectedViewText(newValue.MYPOPJSON.LISTREPLY.DISPLAYNAME);
                    displayViewDetails();
                }
                else {
                    displayedSelectedViewText(viewCaption);
                    selectedViewText(null);
                    clearDialogBetweenViews();
                }
            } catch (error) {
                logger.logError(i18n.t('app:modules.logMessage.VIEW_SELECTION_FAILED'), newValue, system.getModuleId(self) + "-selectedMyView", true);
            }
        });

        var selectedListSubscription = selectedList.subscribe(
            function (curPatient) {
                catPopulationList({});
                selectedNurseUnits([]);
                if (curPatient) {
                    catPopulationList(new model.MyPopulation(curPatient, "PTLIST"));
                }
            }
        );

        // Sets the high risk category in the "My Categories" listbox, so that only the first selected high risk category can be sequenced up or down.
        var selectedRemoveRiskSubscription = selectedRemoveRisks.subscribe(
        function (curRisk) {
            if (curRisk) {
                if (selectedRemoveRisks().length === 1) {
                    firstSelectedRemoveRisk(curRisk);
                }
            }
            else {
                firstSelectedRemoveRisk();
            }
        }
        );

        /**
        * Manually subscribes to changes to the 'selectedFacility' observable.
        * This ensures that the formatting (appending .0) for float fields is 
        * handled and selects the default nurse-units.
        */
        var selectedFacilitySubscription = selectedFacility.subscribe(function (newFacility) {
            if (newFacility) {
                var defaultNurseUnits = [];

                // apply extensions to the facilities.
                model.facilityExtender(newFacility);

                // apply the extensions to the nurse unit model and pick the default options.
                ko.utils.arrayForEach(newFacility.LOCQUAL, function (nurseUnit) {
                    model.nurseUnitExtender(nurseUnit);

                    if (nurseUnit.isSelected()) {
                        defaultNurseUnits.push(nurseUnit);
                    }
                });

                // set the default selections
                selectedNurseUnits(defaultNurseUnits);

                catPopulationList({});
                if (newFacility) {
                    catPopulationList(new model.MyPopulation(newFacility, "FUQUAL"));
                }
            }
            else {
                catPopulationList({});
                selectedNurseUnits([]);
            }
        });

        /******************************************************************************
        *   Private functions
        *
        *******************************************************************************/

        function sortBySequence(a, b) {
            return (a.FILTER_ID < b.FILTER_ID) ? -1 : ((a.FILTER_ID > b.FILTER_ID) ? 1 : 0);
        }

        function SortViewNames(a, b) {
            return a.MYPOPJSON.LISTREPLY.DISPLAYNAME.localeCompare(b.MYPOPJSON.LISTREPLY.DISPLAYNAME);
        }


        function resetPreviousDefaultView(viewName, isDefault) {
            var actionStr = "^COMPLETE^";
            var deferred = $.Deferred();
            if (isDefault == 1 && defaultView() && defaultView().MYPOPJSON.LISTREPLY.DISPLAYNAME != viewName) {
                defaultView().MYPOPJSON.LISTREPLY.DISPLAYDEFAULT = 0;
                var cclParams = ["^MINE^", CERN_params.personnelId, 0.0, 0.0, defaultView().MYPOPADVSRGROUPID, CDF_MEANING, actionStr, MPAGE_DESCRIPTION, '^^']; //, "'" + JSON.stringify(defaultView().MYPOPJSON) + "'"];

                dataService.saveMyPopulationView(cclParams, defaultView().MYPOPJSON)
                    .done(function (data) {
                        if (data) {
                            logger.logSuccess(i18n.t('app:modules.myPopulation.RESET_DEFAULT', { postProcess: 'sprintf', sprintf: ['"' + selectedViewText() + '"'] }),
                                                        cclParams, system.getModuleId(self) + '- resetPreviousDefaultView', false);
                            deferred.resolve(data);
                        }
                    })
                    .fail(function (response) {
                        logger.logError(i18n.t('app:modules.myPopulation.SAVE_FAILED', { postProcess: 'sprintf', sprintf: ['"' + selectedViewText() + '"'] }),
                                                        cclParams, system.getModuleId(self) + '- resetPreviousDefaultView', true);
                        deferred.reject(response);
                    });
            } else {
                deferred.resolve();
            }

            return deferred;
        }

        /** 
        *   Clears all selected data so that the user can take action on any view, select either a patient list
        *   or a facility and the related nurse units as well as any high risk categories.
        **/
        function resetMyPopulations() {
            if (!detached) {
                selectedNurseUnits.removeAll();
                selectedAddRisks.removeAll();
                selectedRemoveRisks.removeAll();
                myRiskCategories.removeAll();
                fullRiskCategories.removeAll();

                if (fullCachedRisks()) {
                    for (var i = 0; i < fullCachedRisks().length; i++) {
                        fullRiskCategories.push(fullCachedRisks()[i]);
                    }
                }
                catPopulationList({});
                selectedFacility(null);
                selectedList(null);
                selectedViewText(null);
                selectedMyView(null);
                displayedSelectedViewText(viewCaption);
                self.enableApplyOk(false);
            }
        }
        //Clears the selected patient list or the selected facility and nurse units, as well as the selected high risk categories.
        function clearDialogBetweenViews() {
            selectedNurseUnits.removeAll();
            selectedAddRisks.removeAll();
            selectedRemoveRisks.removeAll();
            myRiskCategories.removeAll();
            fullRiskCategories.removeAll();
            if (fullCachedRisks()) {
                for (var i = 0; i < fullCachedRisks().length; i++) {
                    fullRiskCategories.push(fullCachedRisks()[i]);
                }
            }
            catPopulationList();
            selectedFacility(null);
            selectedList(null);
            selectedViewText(null);
        }


        /**
        * Determines and sets which High Risk Categories need to be added to the "My Categories" listbox and which High Risk Categories need to be removed from
        * the "High Risk Categories" listbox when a view is selected.
        **/
        function addRiskCategoryByMatching() {
            if (selectedAddRisks() && selectedAddRisks().length) {
                var curId = 0;
                var addRisks = selectedAddRisks();
                var curFullRisks = fullRiskCategories();
                var selectedRisksLength = addRisks.length;
                var fullRisksLength = curFullRisks.length;

                for (var i = 0; i < selectedRisksLength; i++) {
                    curId = addRisks[i].FILTER_ID;
                    fullRisksLength = curFullRisks.length;
                    for (var j = 0; j < fullRisksLength; j++) {
                        if (curFullRisks[j].FILTER_ID == curId) {
                            myRiskCategories.push(addRisks[i]);
                            fullRiskCategories.remove(curFullRisks[j]);
                            break;
                        }
                    }
                }
                fullRiskCategories.sort(function (a, b) { return sortBySequence(a, b); });
                myRiskCategories.sort(function (categoryA, categoryB) { return sortByDisplaySequence(categoryA, categoryB); });
                selectedAddRisks.removeAll();
            }
        }

        function sortByDisplaySequence(categoryA, categoryB) {
            return (categoryA.DISPLAYSEQ < categoryB.DISPLAYSEQ) ? -1 : ((categoryA.DISPLAYSEQ > categoryB.DISPLAYSEQ) ? 1 : 0);
        }

        /**
        * Displays the details of the selected view. This includes showing the selected patient list or facility and nurse units, as well as the High Risk Categories.
        **/
        function displayViewDetails() {
            var listReply = selectedMyView().MYPOPJSON.LISTREPLY;
            var index = 0;
            var nurseUnitIndex = 0;
            var listItemFound = false;
            // Updated Selected Patient List / Facility
            if (listReply.PTCNT > 0) {
                var ptList = listReply.PTLIST[0];
                var patList = patientsList();

                for (index = patList.length; index--; ) {
                    if (patList[index].LISTID == ptList.LISTID) {
                        selectedList(patList[index]);
                        listItemFound = true;
                        break;
                    }
                }

                if (listItemFound) {
                    catPopulationList(new model.MyPopulation(ptList, "PTLIST"));
                }
            } else {
                var fuQual = listReply.FUQUAL[0];
                var nurseUnitCodes = {};
                // build a list of nurse unit codes that need to be selected
                for (nurseUnitIndex = 0; nurseUnitIndex < fuQual.LOCQUAL.length; nurseUnitIndex++) {
                    nurseUnitCodes[parseFloat(fuQual.LOCQUAL[nurseUnitIndex].NULOCATIONCD)] = fuQual.LOCQUAL[nurseUnitIndex].NULOCATIONCD;
                }

                var facList = facilitiesList();
               

                for (index = facList.length; index--; ) {
                    if (facList[index].ORGID == fuQual.ORGID) {
                        model.facilityExtender(facList[index]);
                        for (nurseUnitIndex = 0; nurseUnitIndex < facList[index].LOCQUAL.length; nurseUnitIndex++) {
                            model.nurseUnitExtender(facList[index].LOCQUAL[nurseUnitIndex]);
                            // mark the nurse units that match as selected
                            if (nurseUnitCodes[parseFloat(facList[index].LOCQUAL[nurseUnitIndex].NULOCATIONCD)]) {
                                facList[index].LOCQUAL[nurseUnitIndex].isSelected(true);
                                facList[index].LOCQUAL[nurseUnitIndex].dirtyFlag().reset();
                            }
                        }
                        //update the selected facility
                        selectedFacility(facList[index]);
                        listItemFound = true;
                        break;
                    }
                }
                if (listItemFound) {
                    catPopulationList(new model.MyPopulation(fuQual, "FUQUAL"));
                    selectedNurseUnits(fuQual.LOCQUAL.slice(0));
                }
            }

            // update the selected High Risk Categories
            if (listReply.COLUMNCNT > 0) {
                selectedAddRisks(listReply.COLUMNS.slice());
                var addRisks = selectedAddRisks();

                for (index = addRisks.length; index--; ) {
                    addRisks[index].COLNAME = addRisks[index].DISPLAYNAME;
                }
                addRiskCategoryByMatching();
            }

            if (listReply.DISPLAYDEFAULT == 1)
                defaultInd(true);
            else
                defaultInd(false);
        }
        /**
        * Loads the High Risk Categories List using the data service.
        * @method loadFullRiskCategories
        */
        function loadFullRiskCategories() {
            return dataService.getHighRiskCatDescriptions()
                    .done(function (data) {
                        if (data) {
                            fullCachedRisks(data);
                            fullRiskCategories(fullCachedRisks.slice(0));
                        }
                    })
                    .fail(function (response) {
                        logger.logError(i18n.t('app:modules.populationLinks.HRC_LOAD_FAILED'), response, system.getModuleId(self) + "- loadFullRiskCategories", true);
                    });
        }

        function loadQualifierSettings() {
            return dataService.getPatientQualifierSettings()
                    .done(function (qualifierSettings) {
                        if (qualifierSettings) {
                            disableFacilitiesList(qualifierSettings.BWPTPOP == 1);
                            disablePatientList(qualifierSettings.BWPTPOP == 2);
                        }
                    })
                    .fail(function (response) {
                        logger.log(i18n.t('app:modules.logMessage.QUALIFIER_SETTINGS_FAILED'), response, system.getModuleId(self) + ' - loadQualifierSettings', false);
                    });
        }

        /**
        * Loads the Patients List using the data service.
        * @method loadPatientsList
        */
        function loadPatientsList() {
            dataService.getPatientsList()
                    .done(function (data, isFirstListDefault) {

                        if (data) {
                            // update the patient list to contain proper float values
                            for (var index = 0, count = data.length; index < count; index++) {
                                model.patientListExtender(data[index]);
                            }

                            // set the observable
                            patientsList(data);

                        }
                    })
                    .fail(function (response) {
                        logger.logError(i18n.t('app:modules.patientPopulation.PATIENT_LIST_LOAD_FAILED'), response, system.getModuleId(self) + "- loadPatientsList", true);
                    });
        }

        /**
        * Loads the Facilities List using the data service.
        * @method loadFacilitiesList
        */
        function loadFacilitiesList() {
            dataService.getFacilitiesList()
                    .done(function (data) {
                        if (data) {
                            // update the patient list
                            facilitiesList(data);
                        }
                    })
                    .fail(function (response) {
                        logger.logError(i18n.t('app:modules.patientPopulation.FACILITES_LOAD_FAILED'), response, system.getModuleId(self) + "- loadPatientsList", true);
                    });
        }


        // Check the list of views to see if the new view name matches any existing view names.
        function isDuplicateViewName() {
            var curViewName = selectedViewText().toUpperCase();
            var myViews = myViewsList()();
            var str = "";
            for (var i = myViews.length; i--; ) {
                if (curViewName == myViews[i].MYPOPJSON.LISTREPLY.DISPLAYNAME.toUpperCase()) {
                    return true;
                }
            }
            return false;
        }

        function updateMyPopulationList(groupId, data, listObj) {
            if (!groupId) {
                myViewsList().push({ MYPOPJSON: listObj, MYPOPADVSRGROUPID: data.REPLY.NEW_EVENT_ID });
                myViewsList().sort(SortViewNames);
            }
            else {
                // update current view
                var currentView = null;
                var views = myViewsList()();
                for (var index = 0, length = views.length; index < length; index++) {
                    if (views[index].MYPOPJSON.LISTREPLY.DISPLAYNAME == listObj.LISTREPLY.DISPLAYNAME) {
                        currentView = views[index];
                        break;
                    }
                }
                if (currentView)
                    currentView.MYPOPJSON.LISTREPLY = listObj.LISTREPLY;
            }
        }

        function updateDefaultPopulation(groupId, data, listObj) {
            var listReply = listObj.LISTREPLY;

            if (!detached) {
                if (defaultView()) {
                    if (listReply.DISPLAYDEFAULT == 1) {
                        defaultView({ MYPOPJSON: listObj, MYPOPADVSRGROUPID: groupId === 0 ? data.REPLY.NEW_EVENT_ID : groupId });

                    } else {
                        if (listReply.DISPLAYNAME === defaultView().MYPOPJSON.LISTREPLY.DISPLAYNAME) {
                            defaultView(null);
                        }
                    }
                } else {
                    if (listReply.DISPLAYDEFAULT == 1) {
                        defaultView({
                            MYPOPADVSRGROUPID: data.REPLY.NEW_EVENT_ID,
                            MYPOPJSON: {
                                LISTREPLY: listReply
                            }
                        });
                    }
                }
            }
        }


        function buildMyPopulationObject() {
            var listObj = {};
            listObj.LISTREPLY = {};
            var listReply = listObj.LISTREPLY;
            var riskCategoryLength = myRiskCategories().length;
            var i = 0;

            if (catPopulationList().type == "PTLIST") {
                var ptList = catPopulationList();

                listReply.PTCNT = 1;
                listReply.FUCNT = 0;

                listReply.PTLIST = [{
                    LISTID: ptList.LISTID,
                    LISTNM: ptList.LISTNM,
                    LISTTYPECD: ptList.LISTTYPECD,
                    DEFAULTLOCCD: ptList.DEFAULTLOCCD,
                    LISTSEQ: ptList.LISTSEQ,
                    OWNERID: ptList.OWNERID,
                    PRSNLID: ptList.PRSNLID,
                    APPCNTXID: ptList.APPCNTXID,
                    APPID: ptList.APPID
                }];

            }
            else {
                var fuQual = catPopulationList();
                var nurseUnitLength = selectedNurseUnits().length;
                var mapping = {
                    'ignore': ["isSelected", "dirtyFlag"]
                };

                listReply.PTCNT = 0;
                listReply.FUCNT = 1;
                listReply.FUQUAL = [{
                    ORGID: fuQual.ORGID,
                    ORGNAME: fuQual.ORGNAME,
                    ORGNAMEKEY: fuQual.ORGNAMEKEY,
                    ENDDT: fuQual.ENDDT,
                    DEFAULTIND: fuQual.DEFAULTIND,
                    LOCNT: nurseUnitLength,
                    LOCQUAL: ko.mapping.toJS(selectedNurseUnits(), mapping)
                }];

            }

            listReply.ORGSEC = 0;
            listReply.PRSNLID = CERN_params.personnelId;
            listReply.BWTOPICMEAN = TOPIC_MEAN;
            listReply.DISPLAYNAME = selectedViewText();
            listReply.DISPLAYDEFAULT = (defaultInd() === true ? 1 : 0);
            listReply.COLUMNCNT = riskCategoryLength;
            listReply.COLUMNS = [];
            var listColumn = listReply.COLUMNS;

            for (i = 0; i < riskCategoryLength; i++) {
                curObj = myRiskCategories()[i];
                listColumn.push({
                    DESCRIPTION: curObj.DESCRIPTION,
                    FILTER_ID: curObj.FILTER_ID,
                    DISPLAYSEQ: i
                });
            }

            return listObj;
        }
        //Function to create/modify a view.
        function saveView(groupId) {
            var currentViewName = selectedViewText();
            //Note that the following two IDs zero mainly because this is not specific to a patient/encounter.
            if (groupId || !isDuplicateViewName()) {
                self.enableApplyOk(false);
                var listObj = buildMyPopulationObject();
                var listReply = listObj.LISTREPLY;
                var toast = null;
                var encounterId = 0.0;
                var eventId = 0.0;
                var actionStr = "^COMPLETE^";
                toast = logger.stickyToast(i18n.t('app:modules.myPopulation.SAVE_STARTED', { postProcess: 'sprintf', sprintf: ['"' + currentViewName + '"'] }), groupId, 'my_populations.js : saveGroup', true, 'info');
                $.when(resetPreviousDefaultView(listReply.DISPLAYNAME, listReply.DISPLAYDEFAULT)).done(function () {
                    var cclParams = ["^MINE^", CERN_params.personnelId, encounterId, eventId, groupId, CDF_MEANING, actionStr, MPAGE_DESCRIPTION, '^^']; 
                    dataService.saveMyPopulationView(cclParams, listObj)
                    .done(function (data) {
                        if (data) {
                            updateMyPopulationList(groupId, data, listObj);

                            updateDefaultPopulation(groupId, data, listObj);

                            logger.clearToast(toast);

                            logger.logSuccess(i18n.t('app:modules.myPopulation.SAVE_SUCCESS', { postProcess: 'sprintf', sprintf: ['"' + currentViewName + '"'] }),
                                cclParams, system.getModuleId(self) + '-saveView', true);

                            resetMyPopulations();

                            app.trigger('views-updated', myViewsList());

                            if (detached) {
                                myViewsList(null);
                                myViewsList = null;
                            }
                        }
                    })
                    .fail(function (response) {
                        logger.clearToast(toast);
                        logger.logError(i18n.t('app:modules.myPopulation.SAVE_FAILED', { postProcess: 'sprintf', sprintf: ['"' + currentViewName + '"'] }),
                    cclParams, system.getModuleId(self) + '- saveView', true);
                    });

                })
            .fail(function () {
                logger.clearToast(toast);
                logger.logError(i18n.t('app:modules.myPopulation.SAVE_FAILED', { postProcess: 'sprintf', sprintf: ['"' + currentViewName + '"'] }),
                    cclParams, system.getModuleId(self) + '- saveView', true);
                if (!detached && self.enableApplyOk)
                    self.enableApplyOk(true);
            });
                return true;
            }
            else {
                app.showMessage(i18n.t('app:modules.myPopulation.DUPLICATE_VIEW_NAME', { postProcess: 'sprintf', sprintf: ['"' + currentViewName + '"'] }), i18n.t('app:modules.myPopulation.MY_POPULATIONS'), [i18n.t('app:modules.myPopulation.OK_CAPTION')]);
                return false;
            }
        }
        // Function to delete the selected view.
        function deleteView() {
            var listReplyStr = selectedMyView().MYPOPJSON;
            var encounterId = 0.0;
            var eventId = 0.0;
            var groupId = selectedMyView().MYPOPADVSRGROUPID;
            var toast = null;
            var actionStr = "^DELETE^";
            var viewToDelete = selectedMyView();
            app.showMessage(MESSAGE_BOX_CONTENT, MESSAGE_BOX_TITLE, [MESSAGE_BOX_YES, MESSAGE_BOX_NO]).then(function (dialogResult) {
                if (dialogResult == MESSAGE_BOX_YES) {
                    self.enableApplyOk(false);
                    var cclParams = ["^MINE^", CERN_params.personnelId, encounterId, eventId, groupId, CDF_MEANING, actionStr, MPAGE_DESCRIPTION, '^^']; 
                    toast = logger.stickyToast(i18n.t('app:modules.myPopulation.REMOVE_STARTED', { postProcess: 'sprintf', sprintf: ['"' + listReplyStr.LISTREPLY.DISPLAYNAME + '"'] }), null, null, true, 'info');
                    dataService.saveMyPopulationView(cclParams, listReplyStr)
                    .done(function () {
                        if (defaultView() && defaultView().MYPOPJSON.LISTREPLY.DISPLAYNAME == listReplyStr.LISTREPLY.DISPLAYNAME) {
                            defaultView(null);
                        }
                        myViewsList().remove(viewToDelete);

                        if (!detached)
                            selectedMyView(null);

                        logger.clearToast(toast);
                        logger.logSuccess(i18n.t('app:modules.myPopulation.REMOVE_SUCCESS', { postProcess: 'sprintf', sprintf: ['"' + listReplyStr.LISTREPLY.DISPLAYNAME + '"'] }),
                            cclParams, system.getModuleId(self) + '- deleteView', true);
                        resetMyPopulations();
                    })
                    .fail(function (response) {
                        logger.clearToast(toast);
                        logger.logError(i18n.t('app:modules.myPopulation.REMOVE_FAILED', { postProcess: 'sprintf', sprintf: ['"' + listReplyStr.LISTREPLY.DISPLAYNAME + '"'] }),
                    cclParams, system.getModuleId(self) + '- deleteView', true);
                        if (!detached && self.enableApplyOk)
                            self.enableApplyOk(true);
                    });
                }
            });
        }


        /*********************************************************************
        *   Exposed functions of the ViewModel
        *
        *********************************************************************/

        self.activate = function (data) {
            // Populates the list of Risk Categories
            $.when(loadFullRiskCategories(), loadQualifierSettings()).then(function () {
                var i = 0;
                var nurseUnitCodes = {};
                // Populates all patient lists
                loadPatientsList();
                // Populates the facility list
                loadFacilitiesList();

                // Checks to see if data is available
                if (data) {
                    var patList = data.selectedPatientList;
                    var facList = data.selectedFacility;
                    var nurseList = data.selectedNurseUnits;
                    var viewsList = data.myViewsList;
                    // Populations the myViewsList if any views available.
                    if (viewsList) {
                        myViewsList(viewsList);
                        if (data.defaultView)
                            defaultView = data.defaultView;
                    }


                    // Assigns the selected patient list if any patient list is selected.
                    if (patList && patList()) {
                        selectedList(ko.utils.arrayFirst(patientsList(), function (patientList) {
                            return parseFloat(patientList.LISTID) === parseFloat(patList().LISTID);
                        }));
                    }

                    if (nurseList && nurseList()) {
                        var unwrappedNurseLists = nurseList();
                        for (i = 0; i < unwrappedNurseLists.length; i++) {
                            nurseUnitCodes[parseFloat(unwrappedNurseLists[i].NULOCATIONCD)] = unwrappedNurseLists[i].NULOCATIONCD;
                        }
                    }

                    if (facList && facList()) {
                        var currentFacility = ko.utils.arrayFirst(facilitiesList(), function (facility) {
                            return parseFloat(facility.ORGID) === parseFloat(facList().ORGID);
                        });
                        selectedFacility(currentFacility);
                        if (currentFacility) {

                            for (i = 0; i < currentFacility.LOCQUAL.length; i++) {
                                if (nurseUnitCodes[parseFloat(currentFacility.LOCQUAL[i].NULOCATIONCD)]) {
                                    currentFacility.LOCQUAL[i].isSelected(true);
                                    currentFacility.LOCQUAL[i].dirtyFlag().reset();
                                }
                            }

                        }
                    }

                    if (nurseList && nurseList() && nurseList().length > 0) {
                        selectedNurseUnits(nurseList().slice(0));
                        var nurseUnit = null;
                        for (i = selectedNurseUnits().length; i--; ) {
                            nurseUnit = selectedNurseUnits()[i];
                            model.nurseUnitExtender(nurseUnit);
                            nurseUnit.isSelected(true);
                            nurseUnit.dirtyFlag().reset();
                        }
                    }



                    if (data.selectedHRC) {
                        selectedAddRisks(data.selectedHRC);
                        addRiskCategoryByMatching();
                    }
                }
            })
            .fail(function (response) {
                logger.logError(i18n.t('app:modules.myPopulation.ACTIVATION_FAILED'), response, system.getModuleId(self) + "- activate", true);
            });
        };
        /**
        * The following properties should be identical to the properties seen in the patient_population file.
        * These properties are necessary to provide the lists of views, facilities, associated nurse units, patient lists, and all risk categories.
        * Additionally, these properties are set to provide details on which of the these lists have been selected.
        **/
        self.availablePatientsList = patientsList;
        self.selectedPatientList = selectedList;
        self.selectedMyView = selectedMyView;
        self.availableFacilities = facilitiesList;
        self.selectedFacility = selectedFacility;
        self.fullRiskCategories = fullRiskCategories;
        self.patientsListCaption = i18n.t('app:modules.patientPopulation.PATIENT_LIST_CAPTION');
        self.facilitiesCaption = i18n.t('app:modules.patientPopulation.FACILITIES_CAPTION');
        self.viewsCaption = viewCaption;
        self.isPatientListActive = isPatientListActive;
        self.isFacilitiesActive = isFacilitiesActive;
        self.isNurseUnitActive = isNurseUnitActive;
        self.selectedNurseUnits = selectedNurseUnits;
        self.myViewsList = myViewsList;

        self.catPopulationListName = catPopulationListName;
        // Contains details (specifically the name) of either the selected patient list or facility. This is to display the information in the "Selected Patient Population" column.
        self.catPopulationList = ko.computed(function () {
            if (catPopulationList()) {
                catPopulationListName(catPopulationList().name);
            }
            else {
                catPopulationListName();
            }
        });
        // The text name of the view that is currently selected (if "--New--" is selected in the dropdown, then "--New--" will be displayed)
        self.displayedSelectedViewText = displayedSelectedViewText;
        // List of risks (in the "High Risk Categories" listbox) selected to be added to "My Categories".
        self.selectedAddRisks = selectedAddRisks;
        // List of risks (in the "My Categories" listbox) selected to be removed (and thus, added back to the "High Risk Categories" listbox).
        self.selectedRemoveRisks = selectedRemoveRisks;
        // List of risks in the "My Categories" listbox.
        self.myRiskCategories = myRiskCategories;
        // Indicator for the "Default" checkbox, used to set the current view as default.
        self.defaultInd = defaultInd;
        // Indicator used to tell if the Apply or OK button will perform their function or not.
        self.disabledActionButtons = disabledActionButtons;
        // The selected view object from the Views dropdown list.
        self.selectedViewText = selectedViewText;

        // Prevents the user from using any special characters when naming a new view.
        // *NOTE - This is different from the previous mpage, where an alert would popup indicating the invalid character (only the 1st character if multiple special characters are entered) when the user would click either Apply or OK.
        self.validateString = function (p, data, event) {
            var character = data.char;
            var validation = /[^A-Za-z0-9\s]/gi;
            if (character) {
                if (!character.match(validation)) {
                    if (selectedViewText()) {
                        selectedViewText(selectedViewText() + character);
                    }
                    else {
                        selectedViewText(character);
                    }
                }
            }
            else {
                var keyCode = data.keyCode;
                if (keyCode) {
                    if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || keyCode == 32) {
                        return true;
                    }
                }
            }
        };
        // Enables the "Enter Name of View" textbox when "--New--" is selected in the Views dropdown; else, it is disabled (but shows the name of the selected view in the textbox).
        self.myViewTextEnabled = ko.computed(function () {
            if (selectedMyView()) {
                return false;
            }
            else {
                return true;
            }
        });
        // Launches the nurse unit dialog window.
        self.showNurseUnits = function () {
            if (isNurseUnitActive()) {
                app.showDialog("viewmodels/nurse_unit", selectedFacility(), 'custom').then(function (data) {
                    if (data) {
                        selectedNurseUnits(data);
                    }
                });
            }
        };
        // Adds risks to the "My Categories" listbox.
        self.addRiskCategory = function () {
            var addRisks = selectedAddRisks();

            if (addRisks && addRisks.length) {
                for (var i = 0, il = addRisks.length; i < il; i++) {
                    myRiskCategories.push(addRisks[i]);
                    fullRiskCategories.remove(addRisks[i]);
                }
                fullRiskCategories.sort(function (a, b) { return sortBySequence(a, b); });
                selectedAddRisks.removeAll();
            }
        };
        // Removes risks from the "My Categories" listbox.
        self.removeRiskCategory = function () {
            var removeRisks = selectedRemoveRisks();

            if (removeRisks && removeRisks.length) {
                for (var i = removeRisks.length; i--; ) {
                    fullRiskCategories.push(removeRisks[i]);
                    myRiskCategories.remove(removeRisks[i]);
                }
                fullRiskCategories.sort(function (a, b) { return sortBySequence(a, b); });
                selectedRemoveRisks.removeAll();
            }
        };
        // Display values in the Views dropdown.
        self.populationOptions = function (item) {
            return item.MYPOPJSON.LISTREPLY.DISPLAYNAME;
        };
        // Sets the classname of the "Nurse Units" button when it is activated (by selecting a Facility from the Facilities dropdown).
        self.activeStatus = ko.computed(function () {
            if (isNurseUnitActive()) {
                return "WLLinkText";
            } else {
                return "WLDisableText";
            }
        });
        // Sets the visibility binding to the element in the "Selected Patient Population" column to show the name of the new view.
        self.showViewName = ko.computed(function () {
            if (!selectedMyView() && selectedViewText()) {
                return true;
            }
            return false;
        });
        // Function to delete the selected view.
        self.deleteSelectedView = function () {
            deleteView();
        };
        // Executes the action on the view (create, modify or delete) and resets the dialog so that additional actions can be taken on other views.
        self.applyCommand = function () {
            if (disabledActionButtons() === false) {
                if (selectedMyView()) {
                    saveView(selectedMyView().MYPOPADVSRGROUPID);
                }
                else {
                    saveView(0);
                }
            }
        };
        // Executes the action on the view (create, modify or delete) and closes the dialog.
        self.okCommand = function () {
            if (disabledActionButtons() === false) {
                var isSaved = false;
                if (selectedMyView()) {
                    isSaved = saveView(selectedMyView().MYPOPADVSRGROUPID);
                }
                else {
                    isSaved = saveView(0);
                }
                if (isSaved === true) {
                    dialog.close(this);
                }
            }
        };
        // Checks to see if all details are selected in order to click on Apply or OK.
        // The details are: Selected view or a View name (if "--New--" is selected), either patient list or facility and nurse units, and selected high risk categories.
        self.enableApplyOk = ko.computed({
            read: function () {
                if (selectedViewText() && myRiskCategories().length && (selectedList() || selectedNurseUnits().length)) {
                    disabledActionButtons(false);
                    $(".my-population-save-buttons").removeClass("my-population-disabled");
                }
                else {
                    disabledActionButtons(true);
                    $(".my-population-save-buttons").addClass("my-population-disabled");
                }

            },
            write: function (enabled) {
                if (enabled) {
                    disabledActionButtons(false);
                    $(".my-population-save-buttons").removeClass("my-population-disabled");
                } else {
                    disabledActionButtons(true);
                    $(".my-population-save-buttons").addClass("my-population-disabled");
                }
            },
            owner: this
        });
        // Moves the selected high risk category up one (only in the "My Categories" listbox)
        self.sequenceUp = function () {
            if (firstSelectedRemoveRisk()) {
                selectedRemoveRisks([]);
                var selectedRiskId = firstSelectedRemoveRisk()[0].FILTER_ID;
                var previousRisk = null;
                var curRisk = null;
                var myCategories = myRiskCategories();

                if (myCategories[0].FILTER_ID != selectedRiskId) {
                    for (var i = 1, il = myCategories.length; i < il; i++) {
                        if (myCategories[i].FILTER_ID == selectedRiskId) {
                            previousRisk = myCategories[i - 1];
                            curRisk = myCategories[i];
                            myRiskCategories.splice(i - 1, 2, curRisk, previousRisk);
                            break;
                        }
                    }
                }
            }
        };
        // Moves the selected high risk category down one (only in the "My Categories" listbox)
        self.sequenceDown = function () {
            if (firstSelectedRemoveRisk()) {
                selectedRemoveRisks([]);
                var selectedRiskId = firstSelectedRemoveRisk()[0].FILTER_ID;
                var nextRisk = null;
                var curRisk = null;
                var myCategories = myRiskCategories();
                var riskCategoriesLength = myCategories.length;

                if (myCategories[riskCategoriesLength - 1].FILTER_ID != selectedRiskId) {
                    for (var i = riskCategoriesLength - 1; i--; ) {
                        if (myCategories[i].FILTER_ID == selectedRiskId) {
                            curRisk = myCategories[i];
                            nextRisk = myCategories[i + 1];
                            myRiskCategories.splice(i, 2, nextRisk, curRisk);
                            break;
                        }
                    }
                }
            }
        };
        // Closes the dialog
        self.cancelCommand = function () {
            resetMyPopulations();
            dialog.close(this);
        };
        // Resets the dialog box before closing. This way no cached data is shown when launching the MyPopulations dialog again in the same session. 
        self.beforeClose = function () {
            resetMyPopulations();
        };
        //The following are properties set for the MyPopulations dialog, such as: height, width, title and buttons
        self.height = "800px";
        self.width = "800px";
        self.title = i18n.t('app:modules.myPopulation.MY_POPULATIONS'),
        self.buttons = [{ attr: { "class": "my-population-save-buttons my-population-disabled" }, text: i18n.t('app:modules.myPopulation.APPLY_CAPTION'), click: function () { self.applyCommand(); } },
        { attr: { "class": "my-population-save-buttons my-population-disabled" }, text: i18n.t('app:modules.myPopulation.OK_CAPTION'), click: function () { self.okCommand(); } },
        { text: i18n.t('app:modules.patientPopulation.CANCEL_CAPTION'), click: function () { self.cancelCommand(); } }];


        self.detached = function (node, parentNode, viewModelReference) {
            detached = true;
            if (isNurseUnitActive) {
                isNurseUnitActive.dispose();
                isNurseUnitActive = null;
            }

            if (isPatientListActive) {
                isPatientListActive.dispose();
                isPatientListActive = null;
            }

            if (isFacilitiesActive) {
                isFacilitiesActive.dispose();
                isFacilitiesActive = null;
            }

            if (selectedViewSubscription) {
                selectedViewSubscription.dispose();
                selectedViewSubscription = null;
            }

            if (selectedListSubscription) {
                selectedListSubscription.dispose();
                selectedListSubscription = null;
            }

            if (selectedRemoveRiskSubscription) {
                selectedRemoveRiskSubscription.dispose();
                selectedRemoveRiskSubscription = null;
            }

            if (selectedFacilitySubscription) {
                selectedFacilitySubscription.dispose();
                selectedFacilitySubscription = null;
            }

            if (self.catPopulationList) {
                self.catPopulationList.dispose();
                self.catPopulationList = null;
            }
            if (self.activeStatus) {
                self.activeStatus.dispose();
                self.activeStatus = null;
            }
            if (self.showViewName) {
                self.showViewName.dispose();
                self.showViewName = null;
            }
            if (self.enableApplyOk) {
                self.enableApplyOk.dispose();
                self.enableApplyOk = null;
            }
            self.availablePatientsList = patientsList = null;
            self.selectedPatientList = selectedList = null;
            self.selectedMyView = selectedMyView = null;
            self.availableFacilities = facilitiesList = null;
            self.selectedFacility = selectedFacility = null;
            self.fullRiskCategories = fullRiskCategories = null;
            self.patientsListCaption = null;
            self.facilitiesCaption = null;
            self.viewsCaption = null;
            self.isPatientListActive = isPatientListActive = null;
            self.isFacilitiesActive = isFacilitiesActive = null;
            self.isNurseUnitActive = isNurseUnitActive = null;
            self.selectedNurseUnits = selectedNurseUnits = null;

            self.catPopulationListName = catPopulationListName = null;
            self.displayedSelectedViewText = displayedSelectedViewText = null;
            self.selectedAddRisks = selectedAddRisks = null;
            self.selectedRemoveRisks = selectedRemoveRisks = null;
            self.myRiskCategories = myRiskCategories = null;
            self.defaultInd = defaultInd = null;
            self.disabledActionButtons = disabledActionButtons = null;

            self.selectedViewText = selectedViewText = null;
            viewModelReference = null;

        };
    };

    return vm;
});