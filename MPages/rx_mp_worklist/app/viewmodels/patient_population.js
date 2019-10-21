define(['services/dataservice', 'durandal/app', 'durandal/system', 'mpages/logger', 'knockout', 'ko.command', 'i18next', 'plugins/dialog', 'services/model', 'mpages/load_timer'], function (dataService, app, system, logger, ko, koCommand, i18n, dialog, model, loadTimer) {
    // The ViewModel

    var vm = function () {
        var self = this;

        /*************************************
        *   Private variables
        *************************************/

        /**
        Stores settings required to populate the qualification criteria 
        */
        var qualifierSettings = null;
        var NURSE_UNITS_LABEL_LENGTH = 30;

        /****************************************
        *   Private functions
        *****************************************/
        function buildSelectedNurseUnitString() {
            var selectedNurseUnitsString = '';

            ko.utils.arrayForEach(selectedNurseUnits(), function (nurseUnit) {
                if (nurseUnit) {
                    selectedNurseUnitsString += (nurseUnit.LOCATIONDISP + ": ");
                }
            });

            if (selectedNurseUnits() && selectedNurseUnits().length > 0)
                selectedNurseUnitsString = selectedNurseUnitsString.substring(0, selectedNurseUnitsString.length - 2); // remove the last : and space

            return selectedNurseUnitsString;
        }
        /**************************************
        *   Private Observable Variables
        **************************************/

        /**
        *   An observable array that stores the patients' list
        */
        var patientsList = ko.observableArray([]);

        var facilitiesList = ko.observableArray([]);
        var myViewsList = ko.observableArray([]);
        var selectedList = ko.observable();
        var selectedFacility = ko.observable();
        var selectedNurseUnits = ko.observableArray();
        var isLoading = ko.observable(false);

        var isPatientListVisible = ko.observable(true);
        var isFacilitiesListVisible = ko.observable(true);
        var isNurseUnitsLinkVisible = ko.observable(true);
        var isWorklistLoading = ko.observable(false);
        var nurseUnitLabel = ko.observable(i18n.t('app:modules.patientPopulation.NURSE_UNIT_LABEL'));

        /**********************************
        *   Private Computed Variables
        ************************************/

        /**
        * A computed field to decide if the Nurse Unit link is enabled.
        */
        var isNurseUnitActive = ko.computed(function () {
            if (selectedFacility() && selectedFacility().LOCQUAL.length > 0) {
                return true;
            }
            return false;
        });

        /**
        * A computed field to decide if the Patient List dropdown is enabled.
        */
        var isPatientListActive = ko.computed(function () {
            if (selectedFacility()) {
                return false;
            }
            return true;
        });

        /**
        * A computed field to decide if the Facilities dropdown is enabled.
        */
        var isFacilitiesActive = ko.computed(function () {
            if (selectedList()) {
                return false;
            }
            return true;
        });

        /**
        * A computed field that sets the text of the Nurse Unit link. If no nurse units are selected,
        it displays the i18n label for Nurse Units. If one or more Nurse Units are selected, it displays
        their corresponding names.
        */
        var nurseUnitsLabel = ko.computed(function () {
            if (selectedNurseUnits() && selectedNurseUnits().length > 0) {
                var nurseUnitNames = '';
                try {
                    nurseUnitNames = buildSelectedNurseUnitString();

                    if (nurseUnitNames.length > NURSE_UNITS_LABEL_LENGTH) {
                        nurseUnitNames = nurseUnitNames.substring(0, NURSE_UNITS_LABEL_LENGTH);
                        nurseUnitNames = nurseUnitNames + "...";
                    }
                } catch (error) {
                    log.logError(i18n.t('app:modules.logMessage.NURSE_UNIT_LIST_FAILED'), selectedNurseUnits(), system.getModuleId(self) + ' - nurseUnitLabel', false);
                }
                return nurseUnitNames;
            } else {
                return i18n.t('app:modules.patientPopulation.NURSE_UNIT_LABEL');
            }
        });

        /**
        * A computed field that sets the tooltip of the Nurse Unit link. If no nurse units are selected,
        it displays the i18n label for Nurse Units. If one or more Nurse Units are selected, it displays
        their corresponding names.
        */
        var nurseUnitsTooltip = ko.computed(function () {
            if (selectedNurseUnits() && selectedNurseUnits().length > 0) {
                var nurseUnitNames = '';
                try {
                    nurseUnitNames = buildSelectedNurseUnitString();
                } catch (error) {
                    logger.logError(i18n.t('app:modules.logMessage.NURSE_UNIT_LIST_FAILED'), selectedNurseUnits(), system.getModuleId(self) + ' - nurseUnitsTooltip', false);
                }
                return nurseUnitNames;
            } else {
                return i18n.t('app:modules.patientPopulation.NURSE_UNIT_LABEL');
            }
        });

        /**
        * A computed field that sets the appropriate tooltip for the submit button
        * depending on the criteria.
        */
        var submitTooltip = ko.computed(function () {
            if (!(selectedList() || selectedFacility())) {
                return i18n.t('app:modules.patientPopulation.PL_FACILITIES_TOOLTIP');
            } else if (selectedFacility() && selectedNurseUnits().length === 0) {
                return i18n.t('app:modules.patientPopulation.FACILITIES_NU_TOOLTIP');
            } else {
                return i18n.t('app:modules.patientPopulation.SUBMIT_TOOLTIP');
            }
        });

        /**
        *   A computed field that decides the appropriate CSS class for the
        *   nurse unit hyperlink based on its active status.
        */
        var nurseUnitCssClass = ko.computed(function () {
            if (isNurseUnitActive()) {
                return "WLLinkText";
            } else {
                return "WLDisableText";
            }
        });

        /***************************************************
        *   Manual notification change subscriptions 
        ***************************************************/

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
            }
            else {
                selectedNurseUnits([]);
            }
        });


        var reloadWorklistSubscription = app.on('mpage-reload').then(function () {
            dispose();
            if (reloadWorklistSubscription) {
                reloadWorklistSubscription.off();
                reloadWorklistSubscription = null;
            }
        });

        /*****************************************
        *   Private Functions
        *******************************************/

        /**
        * Loads the Patients List using the data service.
        * @method loadPatientsList
        * @return {Promise} A promise for the loaded patient list(s)
        */
        function loadPatientsList() {
            return dataService.getPatientsList()
                .done(function (data, isFirstListDefault) {

                    if (data) {
                        // update the patient list to contain proper float values

                        for (var index = 0, count = data.length; index < count; index++) {
                            model.patientListExtender(data[index]);
                        }

                        // set the observable
                        patientsList(data);

                        // set the first item as default 
                        if (isFirstListDefault) {
                            selectedList(patientsList()[0]);
                            self.submitCommand();
                        }
                    }

                })
                .fail(function (response) {
                    logger.log(i18n.t('app:modules.logMessage.PATIENT_LIST_FAILED'), response, system.getModuleId(self) + ' - loadPatientsList', false);
                });
        }

        /**
        * Loads the Facilities List using the data service.
        * @method loadFacilitiesList
        * @return {Promise} A promise for the loaded facilities
        */
        function loadFacilitiesList() {
            return dataService.getFacilitiesList()
                .done(function (data, autoLoadSearchResults) {
                    if (data) {
                        // update the patient list
                        facilitiesList(data);
                        // set the default facility
                        var defaultFacility = ko.utils.arrayFirst(facilitiesList(), function (item) {
                            return item.DEFAULTIND == 1;
                        });

                        if (defaultFacility && autoLoadSearchResults) {
                            selectedFacility(defaultFacility);
                        } else {
                            selectedFacility(undefined);
                        }

                        // Automatically load facility search results, if setup
                        if (autoLoadSearchResults && selectedFacility() && selectedNurseUnits() && selectedNurseUnits().length > 0) {
                            self.submitCommand();
                        }

                    }

                })
                .fail(function (response) {
                    logger.log(i18n.t('app:modules.logMessage.FACILITIES_FAILED'), response, system.getModuleId(self) + ' - loadFacilitiesList', false);
                });
        }

        /**
        * Store the patient qualifier settings for later use.
        * @method cachePatientQualifierSettings
        * @return {Promise} A promise for the loaded patient qualifier settings
        */
        function cachePatientQualifierSettings() {

            return dataService.getPatientQualifierSettings()
                .done(function (data) {

                    if (data) {
                        qualifierSettings = data;
                        isPatientListVisible(qualifierSettings.BWPTPOP != 2);
                        isFacilitiesListVisible(qualifierSettings.BWPTPOP != 1);
                        isNurseUnitsLinkVisible(isFacilitiesListVisible());
                    }
                })
                .fail(function (response) {
                    logger.log(i18n.t('app:modules.logMessage.QUALIFIER_SETTINGS_FAILED'), response, system.getModuleId(self) + ' - cachePatientQualifierSettings', false);
                });
        }

        /**
        * Store the patient qualifier settings for later use.
        * @method getSearchCriteria
        * @return {PatientQualificationCriteria} An object containing the patient qualification criteria to be sent to the service layer
        */
        function getSearchCriteria() {

            var patientQualifier = new model.PatientQualificationCriteria(selectedList, selectedFacility, selectedNurseUnits);
            try {
                patientQualifier.ORGSEC = qualifierSettings.ORGSEC;
                patientQualifier.PRSNLID = CERN_params.personnelId + ".0";
                patientQualifier.BWTOPICMEAN = qualifierSettings.BWTOPICMEAN;
                // these are used only for component level. Hence set to 0 here
                patientQualifier.PATIENT_ID = "0.0";
                patientQualifier.ENCNTR_ID = "0.0";
            } catch (error) {
                logger.logError(i18n.t('app:modules.logMessage.SEARCH_CRITERIA'), patientQualifier, system.getModuleId(self) + ' - getSearchCriteria', false);
            }
            return patientQualifier;

        }

        function dispose() {
            if (isNurseUnitActive)
                isNurseUnitActive.dispose();

            if (isPatientListActive)
                isPatientListActive.dispose();

            if (isFacilitiesActive)
                isFacilitiesActive.dispose();

            if (nurseUnitsLabel)
                nurseUnitsLabel.dispose();

            if (nurseUnitsTooltip)
                nurseUnitsTooltip.dispose();

            if (submitTooltip)
                submitTooltip.dispose();

            if (nurseUnitCssClass)
                nurseUnitCssClass.dispose();

            if (selectedFacilitySubscription)
                selectedFacilitySubscription.dispose();

            if (worklistFailedEventSubscription)
                worklistFailedEventSubscription.off();

            if (viewsLoadedEventSubscription)
                viewsLoadedEventSubscription.off();

            if (viewLoadFailedSubscription)
                viewLoadFailedSubscription.off();

            patientsList = null;
            facilitiesList = null;
            myViewsList = null;
            selectedList = null;
            selectedFacility = null;
            selectedNurseUnits = null;
            isLoading = null;
            isPatientListVisible = null;
            isFacilitiesListVisible = null;
            isNurseUnitsLinkVisible = null;
            isWorklistLoading = null;
            nurseUnitLabel = null;
        }

        /**********************************
        Event subscriptions
        ***********************************/

        var worklistFailedEventSubscription = app.on('worklist-load-failed worklist-loaded').then(function () {
            isWorklistLoading(false);
        });

        app.on('worklist-loading').then(function (isTriggeredViaSearch) {
            if (!isTriggeredViaSearch) {
                selectedFacility(null);
                selectedList(null);
                selectedNurseUnits([]);
            }

            isWorklistLoading(true);
        });


        var viewsLoadedEventSubscription = app.on('views-loaded').then(function () {
            // only if patient population has already loaded, turn off the loading symbol
            if (loadTimer.patientPopulationLoaded()) {
                isLoading(false);
            }
        });

        var viewLoadFailedSubscription = app.on('views-load-failed').then(function () {
            isLoading(false);
        });

        var mpageReloadSubscription = app.on('mpage-reload').then(function () {
            dispose();
        });

        /********************************************
        *   Exposed functions and variables
        ********************************************/
        self.isLoading = isLoading;

        /**
        *   Called by Durandal when this view is activated
        */
        self.activate = function () {

            isLoading(true);

            $.when(cachePatientQualifierSettings(), loadPatientsList(), loadFacilitiesList())
                    .done(function () {
                        // only if views are loaded, turn off the loading symbol
                        if (loadTimer.populationLinksLoaded()) {
                            isLoading(false);
                        }
                        // patient population is loaded. The views may or maynot be loaded at this stage
                        loadTimer.patientPopulationLoaded(true);
                    })
                     .fail(function () {
                         logger.logError(i18n.t('app:modules.patientPopulation.PATIENT_POPULATION_FAILED'), null, system.getModuleId(self) + ' - activate', true);
                         isLoading(false);
                         loadTimer.abort();
                     });

        };


        self.availablePatientsList = patientsList;
        self.availableFacilities = facilitiesList;

        self.selectedPatientList = selectedList;
        self.selectedFacility = selectedFacility;
        self.selectedNurseUnits = selectedNurseUnits;

        self.patientsListCaption = i18n.t('app:modules.patientPopulation.PATIENT_LIST_CAPTION');
        self.facilitiesCaption = i18n.t('app:modules.patientPopulation.FACILITIES_CAPTION');
        self.nurseUnitsLabel = nurseUnitsLabel;
        self.nurseUnitsTooltip = nurseUnitsTooltip;
        self.submitTooltip = submitTooltip;


        self.isPatientListActive = isPatientListActive;
        self.isFacilitiesActive = isFacilitiesActive;
        self.isNurseUnitActive = isNurseUnitActive;

        self.isPatientListVisible = isPatientListVisible;
        self.isFacilitiesListVisible = isFacilitiesListVisible;
        self.isNurseUnitsLinkVisible = isNurseUnitsLinkVisible;

        /**
        *   Function executed when nurse unit hyperlink is clicked
        */
        self.showNurseUnits = function () {
            if (selectedFacility()) {
                app.showDialog("viewmodels/nurse_unit", selectedFacility(), 'custom').then(function (data) {
                    if (data) {
                        selectedNurseUnits(data);
                    }
                })
                .fail(function () {
                    logger.logError(i18n.t('app:modules.patientPopulation.NURSE_UNITS_LOAD_FAILED'), selectedFacility(), system.getModuleId(self) + ' - showNurseUnits', true);
                });
            }
        };
        /**
        *   CSS class to apply for nurseUnit link
        */
        self.activeStatus = nurseUnitCssClass;

        /**
        *   The command executed when "Select" button is clicked
        */
        self.submitCommand = koCommand.asyncCommand({
            execute: function (callback) {
                // populate the json and raise event
                var patientQualifierCriteria = getSearchCriteria();
                var params = {
                    MPREQUEST: patientQualifierCriteria
                };
                app.on('worklist-loaded worklist-load-failed').then(function () {
                    callback();
                });

                app.trigger('load-search-results', params);

            },

            canExecute: function (isExecuting) {
                if (!isLoading() && !isExecuting && !isWorklistLoading() &&
        (selectedList() || (selectedFacility() && selectedNurseUnits() && selectedNurseUnits().length > 0))) {
                    return true;
                }

                return false;

            }
        });
        /**
        *   The command executed when Reset button is clicked
        */
        self.resetCommand = koCommand.command({
            execute: function () {
                selectedFacility(null);
                selectedList(null);
                selectedNurseUnits([]);
                
                ko.utils.arrayForEach(facilitiesList(), function (facility) {
                    ko.utils.arrayForEach(facility.LOCQUAL, function (nurseUnit) {
                        model.nurseUnitExtender(nurseUnit, true);
                    });
                });
            },

            canExecute: function () {
                if (!isLoading() && !isWorklistLoading() && (selectedList() || selectedFacility())) {
                    return true;
                }

                return false;
            }
        });

        self.detached = function (node, parentNode, viewModelReference) {
            dispose();
            viewModelReference = null;
        };
    };

    return vm;
});