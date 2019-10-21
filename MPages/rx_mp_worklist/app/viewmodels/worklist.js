define(['durandal/app', 'durandal/system', 'knockout', 'ko.command', 'services/dataservice', 'services/model', 'mpages/logger', 'i18next', 'mpages/request_timer'], function (app, system, ko, koCommand, dataService, model, logger, i18n, RequestTimer) {

    /*
    *   Checks if a given High Risk Category(HRC) Column is present in the list of 
    *   currently available High Risk Categories. If it is present, the HRC column
    *   is considered as active and is available for display.
    *   @method isActiveHRCColumn
    *   @param {Object} column - The HRC column to check for being active
    *   @param {Array} availableHRCList - The list of available HRC columns
    *   @returns {Boolean} isFound - true, if active column is found, otherwise false
    */
    function isActiveHRCColumn(column, availableHRCList) {
        var isFound = false;
        if (column) {
            isFound = ko.utils.arrayFirst(availableHRCList, function (hrcColumn) {
                return hrcColumn.FILTER_ID == column.FILTERID;
            });
        }

        return isFound;
    }

    function SortBySequenceNumber(columnA, columnB) {
        return (columnA.DISPLAYSEQ < columnB.DISPLAYSEQ) ? -1 : ((columnA.DISPLAYSEQ > columnB.DISPLAYSEQ) ? 1 : 0);
    }

    /**
    *   Sorts the patient rows alphabetically, by name.
    */
    function sortPatients(patientA, patientB) {
        // sort by patient name and then by person id if there are two patients with same name
        var patientAInfo = patientA.HRCColumns[0];
        var patientBInfo = patientB.HRCColumns[0];
        var compareResult = patientAInfo.PATNAME.localeCompare(patientBInfo.PATNAME);
        if (compareResult === 0) {
            compareResult = parseFloat(patientAInfo.PERSONID) - parseFloat(patientBInfo.PERSONID);
        }

        return compareResult;
    }

    /***
    *   Checks if a HRC Column can be displayed or not. For an adhoc search, a column is displayed
    *   only if it is a default column. For a view, a column is displayed only if it selected for
    *   that particular view.
    *   @method isValidColumn
    *   @param {Object} column - The HRC column to check for being active
    *   @param {Object} view - The current view that is selected
    *   @param {Array} availableHRCList - The list of available HRC columns
    *   @returns {Boolean} isValid - true, if HRC column is valid for display, otherwise false
    */
    function isValidColumn(column, view, availableHRCList, isAdHocSearch) {
        var isValid = false;
        if (column && column.COLVALID === 1) {
            // If the worklist is loaded via Ad-hoc search
            if (isAdHocSearch) {
                if (column.COLDEFAULT === 1)
                    isValid = true;
            } else {
                // If the worklist is loaded via MyPopulation view
                if (view() && availableHRCList) {
                    var viewData = view().MYPOPJSON.LISTREPLY;
                    for (var index = 0, length = viewData.COLUMNCNT; index < length; index++) {
                        if (viewData.COLUMNS[index].FILTER_ID == column.FILTERID && isActiveHRCColumn(column, availableHRCList)) {
                            isValid = true;
                            column.DISPLAYSEQ = viewData.COLUMNS[index].DISPLAYSEQ;
                            break;
                        }
                    }
                }
            }
        }
        return isValid;
    }

    var vm = function () {
        var self = this;
        var validColumns = ko.observableArray([]);
        var rows = ko.observableArray([]);
        var defaultMyPopulationView = null;
        var rowsMap = {};
        var worklistTimer = new RequestTimer().setTimerName("USR:MPG.WRKLIST.INIT_PHARMACIST_WORKLIST - load worklist");
        /***
        *   A variable that is set when the worklist is loaded. Worklist grid can be loaded either via ad-hocs search
        *   or by selecting a population view. The shell viewmodel handles both cases and passes an appropriate flag.
        *   This variable is set during activation.
        */
        var isAdHocSearch = false;




        /*
        *   This function is used to dispose the model objects used for HRC columns
        *   and data rows of the worklist. It is called when the current worklist 
        *   is being unloaded and a new one is being loaded.
        *   @method dispose
        */
        function dispose() {
            var index = 0;
            var length = 0;
            self.rows.dispose();
            self.columns.dispose();

            if (rowsMap) {
                for (var key in rowsMap) {
                    rowsMap[key].dispose();
                }
                rowsMap = null;
            }

            if (validColumns) {
                for (index = 0, length = validColumns().length; index < length; index++) {
                    validColumns()[index].dispose();
                }

                for (index = 0, length = self.columns.length; index < length; index++) {
                    self.columns()[index].dispose();
                }
                validColumns.length = self.columns().length = 0;
                self.columns = validColumns = null;
            }

            if (rows) {
                for (index = 0, length = rows().length; index < length; index++) {
                    rows()[index].dispose();
                }

                for (index = 0, length = self.rows.length; index < length; index++) {
                    self.rows()[index].dispose();
                }

                rows.length = self.rows().length = 0;
                self.rows = rows = null;
            }

            if (columnSelectedSubscription) {
                columnSelectedSubscription.off();
                columnSelectedSubscription = null;
            }

            if (rowSelectedSubscription) {
                rowSelectedSubscription.off();
                rowSelectedSubscription = null;
            }

            if (reloadWorklistSubscription) {
                reloadWorklistSubscription.off();
                reloadWorklistSubscription = null;
            }

            defaultMyPopulationView = null;
            worklistTimer = null;
            isDataAvailable = null;
            isHRCColumnChecked = null;
            isPatientRowChecked = null;
            isWorklistDataFiltered = null;
            isLoading = null;
            selectedPatientList = null;
            selectedFacility = null;
            selectedNurseUnits = null;
            availableViews = null;
        }


        /**
        *   An observable that indicates if worklist data has been loaded
        */
        var isDataAvailable = ko.observable(false);

        /**
        *   An observable that indicates if one of the High Risk Category columns
        *   in the worklist is checked.
        */
        var isHRCColumnChecked = ko.observable(false);

        /**
        *   An observable that indicates if one or more patient rows
        *   in the worklist is checked.
        */
        var isPatientRowChecked = ko.observable(false);
        /**
        *   An observable that indicates if the current worklist data is a filtered 
        */
        var isWorklistDataFiltered = ko.observable(false);

        /**
        *   An observable to decide if the loading symbol should be shown or not
        */
        var isLoading = ko.observable(false);

        /**
        *   An observable to store the currently selected Patient List while performing
        *   an Ad-hoc search. This is passed to the MyPopulation dialog when Save button
        *   is clicked.
        */
        var selectedPatientList = ko.observable();

        /**
        *   An observable to store the currently selected Facility while performing
        *   an Ad-hoc search. This is passed to the MyPopulation dialog when Save button
        *   is clicked.
        */
        var selectedFacility = ko.observable();

        /**
        *   An observable to store the currently selected Nurse Units while performing
        *   an Ad-hoc search. This is passed to the MyPopulation dialog when Save button
        *   is clicked.
        */
        var selectedNurseUnits = ko.observableArray([]);

        /**
        *   An observable to store the available list of views
        *   This is passed to the MyPopulation dialog when Save button
        *   is clicked.
        */
        var availableViews = null;

        /********************************************************************
        *   Event Handlers
        *   
        ********************************************************************/

        /**
        *   Event handler for column-selected event of the worklist column.
        *   Whenever a column is checked/unchecked, the isHRCColumnChecked observable
        *   is set. The worklist action buttons (Save, Filter, Reset) update their
        *   display state based on this observable.
        */
        var columnSelectedSubscription = app.on('column-selected').then(function (isChecked) {
            isHRCColumnChecked(isChecked);
        });

        /**
        *   Event handler for row-selected event of the worklist row.
        *   Whenever a row is checked/unchecked, the isPatientRowChecked observable
        *   is set. The worklist action buttons (Save, Filter, Reset) update their
        *   display state based on this observable.
        */
        var rowSelectedSubscription = app.on('row-selected').then(function (isChecked) {
            isPatientRowChecked(isChecked);
        });

        var reloadWorklistSubscription = app.on('mpage-reload').then(function () {
            dispose();
        });

        /*****************************************************************************
        *   Exposed View Model properties
        *****************************************************************************/

        /*
        *   Exposed computed variable containing the rows to be displayed in the worklist
        */
        self.rows = ko.computed(function () {
            if (isDataAvailable() && !isLoading()) {
                return rows();
            }

            return [];
        });

        /*
        *   Exposed computed variable containing the column headers to be displayed in the worklist
        */
        self.columns = ko.computed(function () {
            if (isDataAvailable() && !isLoading()) {
                return validColumns();
            }

            return [];
        });

        /*
        *   Activate function that is invoked by Durandal when this View Model is loaded.
        *   It initializes the worklist for specified qualification criteria.
        *   @method activate
        *   @params {Object} activationData - defines the qualification information for the worklist
        */
        self.activate = function (activationData) {
            if (activationData) {
                worklistTimer.start();
                var qualificationCriteria = activationData.QualificationCriteria;

                isAdHocSearch = activationData.isAdHocSearch;
                availableViews = activationData.AvailableViews;
                defaultMyPopulationView = activationData.DefaultView;
                isLoading(true);

                app.trigger('worklist-loading', isAdHocSearch);

                try {
                    // If it is ad-hoc search, store patient list or facility-nurseunit mapping
                    // These are used when save button is clicked.
                    if (isAdHocSearch) {
                        //set selected patient list, facility and nurse unit
                        // if required, run through extender for each of them
                        if (qualificationCriteria.MPREQUEST.PTCNT > 0) {
                            selectedPatientList(qualificationCriteria.MPREQUEST.PTLIST[0]);
                        }
                        if (qualificationCriteria.MPREQUEST.FUCNT > 0) {
                            selectedFacility(qualificationCriteria.MPREQUEST.FUQUAL[0]);
                            // nurse units are extended in my populations
                            selectedNurseUnits(qualificationCriteria.MPREQUEST.FUQUAL[0].LOCQUAL);
                        }
                    }

                    // when there are not HRCs to display, bail out
                    if (qualificationCriteria.MPREQUEST.HRCsToDisplay.length === 0) {
                        isLoading(false);
                        isDataAvailable(false);
                        app.trigger('worklist-loaded', false, isAdHocSearch);
                        worklistTimer.stop();
                        return;
                    }

                    // Check if there are patients that match the inclusion-exclusion criteria.
                    dataService.getQualifiedPatients(qualificationCriteria).done(function (qualificationInformation) {

                        if (qualificationInformation.PATCNT > 0 && qualificationInformation.COLVALIDCNT > 0) {

                            // get the valid columns
                            var availableColumns = qualificationInformation.COLQUAL;

                            // Add patient-information column as the first valid column
                            validColumns().push(new model.WorklistColumn(
                            {
                                COLNAME: qualificationInformation.PATINFO,
                                SNACTIVE: qualificationInformation.SNACTIVE,
                                SNTYPECNT: qualificationInformation.SNTYPECNT,
                                SNCODEVALUE: qualificationInformation.SNCODEVALUE,
                                SNTYPEQUAL: qualificationInformation.SNTYPEQUAL,
                                SNAUTHOR: qualificationInformation.SNAUTHOR,
                                TABNAME: qualificationInformation.PATINFOLINK,
                                CDCLINK: qualificationInformation.CDCLINK
                            }, true));

                            // Check which of the columns are valid and add them to the observable
                            for (var index = 0, length = availableColumns.length; index < length; index++) {
                                if (isValidColumn(availableColumns[index], activationData.ViewInfo, activationData.HRCList, isAdHocSearch)) {
                                    validColumns().push(new model.WorklistColumn(availableColumns[index]));
                                }
                            }

                            // if none of the patients qualify for high risk categories,stop here
                            if (validColumns().length == 1) {
                                isLoading(false);
                                isDataAvailable(false);
                                app.trigger('worklist-loaded', false, isAdHocSearch);
                                worklistTimer.stop();
                                dispose();
                                return;
                            }

                            // Sort the columns by display sequence specified in the view
                            if (!isAdHocSearch)
                                validColumns.sort(SortBySequenceNumber);

                            // create the rows map that maps the WorklistRow data for each patient
                            var availablePatients = qualificationInformation.PATQUAL;
                            var mapKey = null;
                            for (index = 0, length = availablePatients.length; index < length; index++) {
                                mapKey = availablePatients[index].PERSONID + "_" + availablePatients[index].ENCNTRID;
                                rowsMap[mapKey] = new model.WorklistRowData(availablePatients[index], validColumns());
                            }

                            // Create the model object for qualified patient information. This is used
                            // to query details for the qualifying patients.
                            var qualifiedPatientInfo = new model.QualifiedPatientInfo(qualificationInformation);

                            // Query details for the qualifying patients
                            dataService.getHRCDetailsForPatients(qualifiedPatientInfo)
                            .done(function (hrcDetails) {
                                var worklistRow = null;

                                // map the details with appropriate patients
                                model.mapHRCData(rowsMap, validColumns(), hrcDetails);

                                // Add the details to the rows observable
                                for (var key in rowsMap) {
                                    worklistRow = rowsMap[key];
                                    if (worklistRow && worklistRow.isValid)
                                        rows().push(worklistRow);
                                }

                                if (rows().length > 0) {
                                    rows(rows().sort(sortPatients));
                                    isDataAvailable(true);
                                    isLoading(false);
                                    app.trigger('worklist-loaded', true);
                                    worklistTimer.stop();
                                } else {
                                    isLoading(false);
                                    isDataAvailable(false);
                                    app.trigger('worklist-loaded', false);
                                    worklistTimer.stop();
                                }


                            })
                            .fail(function (errorDetails) {
                                logger.logError(i18n.t('app:modules.worklist.WORKLIST_LOAD_FAILED'), errorDetails, system.getModuleId(self) + ' - activate:getHRCDetailsForPatient', true);
                                app.trigger('worklist-load-failed');
                                isLoading(false);
                                isDataAvailable(false);
                                worklistTimer.abort();
                            });
                        } else {
                            isLoading(false);
                            isDataAvailable(false);
                            app.trigger('worklist-loaded', false, isAdHocSearch);
                            worklistTimer.stop();
                        }
                    })
                .fail(function (errorDetails) {
                    logger.logError(i18n.t('app:modules.worklist.WORKLIST_LOAD_FAILED'), errorDetails, system.getModuleId(self) + ' - activate:getQualifiedPatients', true);
                    app.trigger('worklist-load-failed');
                    isLoading(false);
                    isDataAvailable(false);
                    worklistTimer.abort();
                });

                } catch (err) {
                    logger.logError(i18n.t('app:modules.worklist.WORKLIST_LOAD_FAILED'), err, system.getModuleId(self) + ' - activate:getQualifiedPatients', true);
                    app.trigger('worklist-load-failed');
                    isLoading(false);
                    isDataAvailable(false);
                    worklistTimer.abort();
                }
            }
        };

        /**
        *   An observable to indicate if data is loading or not
        */
        self.isLoading = isLoading;


        /**
        *   An observable to decide if the data is available. If data is
        *   not available, the no records found message is displayed.
        */
        self.isDataAvailable = isDataAvailable;

        /***
        *   A function to decide the CSS class to apply for the HRC columns
        */
        self.cellStyle = function (columnIndex) {
            var index = columnIndex();
            if (index >= 0 && index != validColumns().length - 1) {
                return "MainColumnLeftRight";
            } else {
                return "MainColumnLeftRightLast";
            }
        };

        /***
        *   A function to decide if a particular column is visible or not.
        */
        self.isColumnVisible = function (columnIndex) {
            return validColumns()[columnIndex()].isVisible;
        };

        /***
        *   A Command that is executed when the Remove button is clicked
        */
        self.removeCommand = koCommand.command({
            execute: function () {
                app.trigger('remove-checked');
                isWorklistDataFiltered(true);
            },
            canExecute: function (isExecuting) {
                return !isExecuting && isDataAvailable() && (isPatientRowChecked() || isHRCColumnChecked());
            }
        });

        /***
        *   A Command that is executed when the Reset button is clicked
        */
        self.resetCommand = koCommand.command({
            execute: function () {
                app.trigger('reset');
                isWorklistDataFiltered(false);
            },
            canExecute: function (isExecuting) {
                return !isExecuting && isWorklistDataFiltered();
            }
        });

        /***
        *   A Command that is executed when the Save button is clicked
        */
        self.saveCommand = koCommand.asyncCommand({
            execute: function (callback) {
                var selectedColumns = [];
                for (var index = 0; index < validColumns().length; index++) {
                    if (validColumns()[index].isSelected()) {
                        selectedColumns.push({
                            COLNAME: validColumns()[index].COLNAME,
                            DESCRIPTION: validColumns()[index].COLNAME,
                            DISPLAYSEQ: index,
                            FILTER_ID: validColumns()[index].FILTERID
                        });
                    }
                }

                app.showDialog("viewmodels/my_populations", { selectedPatientList: selectedPatientList, selectedFacility: selectedFacility,
                    selectedNurseUnits: selectedNurseUnits, myViewsList: ko.observableArray(availableViews), selectedHRC: selectedColumns, defaultView: defaultMyPopulationView
                }, 'custom')
                .then(function () {
                    callback();
                });
            },
            canExecute: function (isExecuting) {
                // if it is adhoc search that loads the worklist data, the save button is enabled as soon as one of the HRC columns is checked.
                // if it is a view that loads the worklist data, the save button is enabled only when a filter operation is done after selecting one
                // of the HRC columns.
                if (!isExecuting) {
                    if (isAdHocSearch && isHRCColumnChecked() && !isWorklistDataFiltered()) {
                        return true;
                    } else if (!isAdHocSearch && isHRCColumnChecked() && isWorklistDataFiltered()) {
                        return true;
                    } else {
                        return isHRCColumnChecked();
                    }
                } else {
                    return false;
                }
                return false;
            }
        });



        self.detached = function (node, parentNode, viewModelReference) {
            dispose();
            viewModelReference = null;
        };
    };


    /***
    *   Function that opens up the appropriate link/report based on 
    *   column's configurations in bedrock
    */
    vm.prototype.openLink = function (column) {
        var cdcReport = "inn_rpt_get_antib_use_res";
        if (column.isLink()) {
            if (column.isCDCReportColumn()) {
                if (typeof CCLLINK !== "undefined") {
                    CCLLINK("'" + cdcReport + "'", "", 0);
                } else {
                    logger.logError(i18n.t('app:modules.worklist.CDC_REPORT_FAILED'), column, system.getModuleId(self) + "- openLink", true);
                }
            } else {
                if (typeof APPLINK !== "undefined") {
                    APPLINK(100, "'" + column.COLLINK + "'", "");
                } else {
                    logger.logError(i18n.t("app:modules.worklist.HRC_COLUMN_CLICK_FAILED"), column, system.getModuleId(self) + "- openLink", true);
                }
            }
        }
    };

    /**
    *   A function to decide which is appropriate view-model for the 
    *   current qualification
    */
    vm.prototype.activeView = function (qualification) {
        switch (qualification) {
            case "COLORDQUAL":
                return "viewmodels/orders";

            case "COLTASKQUAL":
                return "viewmodels/tasks";

            case "PATIENT_INFORMATION":
                return "viewmodels/patient_information";

            case "COLCELABQUAL":
                return "viewmodels/clinical_lab_events";

            case "COLLABQUAL":
                return "viewmodels/laboratory_events";

            case "COLADMEVENTQUAL":
                return "viewmodels/administration_events";

            case "COLSYNQUAL":
                return "viewmodels/synonyms";

            case "COLDRUGQUAL":
                return "viewmodels/drug_classes";

            case "COLMBRESQUAL":
                return "viewmodels/microbiology";

            case "COLPROBLEMQUAL":
                return "viewmodels/problems";

            case "COLDIAGNOSQUAL":
                return "viewmodels/diagnosis";

            case "COLDOCQUAL":
                return "viewmodels/documents";

            case "COLALERTQUAL":
                return "viewmodels/discern_alerts";
        }

    };

    /***
    *   A function to decide the CSS class to apply for a particular 
    *   data row.
    */
    vm.prototype.rowStyle = function (rowIndex) {
        var index = rowIndex();
        if (index % 2 === 0)
            return "RowTypeWhite";
        else
            return "RowTypeBlue";
    };

    /***
    *   A function to return the activation data for a particular
    *   HRC column. This data is then passed on to the respective
    *   view models.
    */
    vm.prototype.activationData = function (qualification, row, columnIndex) {
        if (qualification === "PATIENT_INFORMATION")
            return row;
        else
            return row.HRCColumns[columnIndex()];
    };

    /***
    *   A function to decide if the checkbox at the HRC column headers should be
    *    shown or not
    */
    vm.prototype.isHeaderCheckboxVisible = function (columnIndex) {
        return columnIndex() !== 0;
    };

    return vm;
});