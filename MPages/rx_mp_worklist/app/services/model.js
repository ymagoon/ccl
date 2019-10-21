define(['mpages/logger', 'knockout', 'ko.dirtyFlag', 'jquery', 'durandal/app'], function (logger, ko, koDirty, $, app) {
    /***************************************************************************
    *   Private variables
    ****************************************************************************/
    /*
    *   Contains the javascript properties/methods that needs to be ignored
    *   while converting an observable to a plain javascript object
    */
    var mapping = {
        'ignore': ["isSelected", "dirtyFlag"]
    };

    /*
    *   Stores the number of High Risk categories that are selected
    */
    var columnSelections = 0;

    /*
    *   Stores if the high risk category column selection event has been triggered
    */
    var columnSelectionEventTriggered = false;

    /*
    *   Stores the number of patients that are selected
    */
    var rowSelections = 0;

    /*
    *   Stores if the patient row selection event has been triggered
    */
    var rowSelectionEventTriggered = false;

    /*
    *   Stores the base path of the application
    */
    var basePath = require.toUrl('').split(".js")[0];

    /*
    *   A map for images and CDF meanings
    */
    var imageMap = {
        "CRITICAL": basePath + "../img/5278_11.gif",
        "LOW": basePath + "../img/6303_11.gif",
        "HIGH": basePath + "../img/6302_11.gif",
        "ABNORMAL": basePath + "../img/AbnormalIcon_11.gif"
    };

    /*
    *   A map for css classes and CDF meanings
    */
    var CSSMap = {
        "CRITICAL": "hrc-res-severe",
        "LOW": "hrc-res-low",
        "HIGH": "hrc-res-high",
        "ABNORMAL": "hrc-res-abnormal",
        "POSITIVE": "hrc-res-positive",
        "DEFAULT": "hrc-res-default"
    };

    /*
    *   Converts an integer value to a string with a decimal point. This is required fields marked F8 in CCL.
    *   Otherwise, CCL will consider then as integers and there is a possibility of overflow.
    */
    function convertToFloat(valueToConvert) {
        var convertedValue = valueToConvert;
        if ((typeof valueToConvert === "number" || typeof valueToConvert === "string") && valueToConvert.toString().indexOf(".") == -1) {
            convertedValue = valueToConvert + ".0";
        }

        return convertedValue;
    }

    /*
    *   An extender function to extend a facility object to have floating fields.
    */
    function facilityExtender(facility) {
        if (facility) {
            facility.ORGID = convertToFloat(facility.ORGID);
        }
    }

    /*
    *   An extender function to extend a nurse-unit object to have floating fields. It also
    *   adds an observable- isSelected and a dirtyFlag, which is set whenever the nurse-unit's selection field changes.
    */
    function nurseUnitExtender(nurseUnit, resetState) {
        if (nurseUnit) {

            if (nurseUnit.isSelected && resetState) {
                nurseUnit.isSelected(false);
            } else if (!nurseUnit.isSelected) {
                nurseUnit.isSelected = ko.observable(nurseUnit.DEFAULTIND == 1);
            }

            if (!nurseUnit.dirtyFlag)
                nurseUnit.dirtyFlag = koDirty.DirtyFlag(nurseUnit.isSelected);

            nurseUnit.NULOCATIONCD = convertToFloat(nurseUnit.NULOCATIONCD);
        }
    }

    /*
    *   An extender function for the patient list to have floating fields represented correctly.
    */
    function patientListExtender(patientList) {
        if (patientList) {
            patientList.LISTID = convertToFloat(patientList.LISTID);
            patientList.LISTTYPECD = convertToFloat(patientList.LISTTYPECD);
            patientList.DEFAULTLOCCD = convertToFloat(patientList.DEFAULTLOCCD);
            patientList.OWNERID = convertToFloat(patientList.OWNERID);
            patientList.PRSNLID = convertToFloat(patientList.PRSNLID);
            patientList.APPCNTXID = convertToFloat(patientList.APPCNTXID);
        }
    }

    /* 
    *   Model object for MyPopulation.
    *   Sets commonly named attributes to their appropriate attribute in order to display/function correctly. 
    */

    var MyPopulation = function (obj, type) {
        var $this = this;
        $this.type = type;
        if (type == "PTLIST") {
            $this.name = obj.LISTNM;
        }
        else if (type == "FUQUAL") {
            $this.name = ko.observable(obj.ORGNAME);
        }
        for (var i in obj) {
            $this[i] = obj[i];
        }
    };

    /*
    *   Model object for PatientQualificationCriteria. This is used to build the criteria object
    *   which is passed along to the data service to check if a patient qualifies.
    */
    function PatientQualificationCriteria(selectedPatientList, selectedFacility, selectedNurseUnits) {

        this.PTCNT = selectedPatientList() ? 1 : 0;

        if (this.PTCNT === 0)
            this.PTLIST = [];
        else
            this.PTLIST = [ko.mapping.toJS(selectedPatientList, mapping)];

        this.FUCNT = selectedFacility() ? 1 : 0;

        if (this.FUCNT === 0)
            this.FUQUAL = [];
        else {
            this.FUQUAL = [ko.mapping.toJS(selectedFacility, mapping)];
            this.FUQUAL[0].LOCNT = selectedNurseUnits().length;
            this.FUQUAL[0].LOCQUAL = ko.mapping.toJS(selectedNurseUnits, mapping);
        }

    }

    /*
    *   A model object that stores information of patients who have met the qualification criteria.
    */
    function PatientInfo(qualificationData) {
        var qualifiedColumns = [];
        var qualifiedPatients = {
            hrcQual: qualifiedColumns
        };

        var validColumn = null;
        var currentColumn = null;
        if (qualificationData) {
            for (var index = 0, length = qualificationData.COLQUAL.length; index < length; index++) {
                currentColumn = qualificationData.COLQUAL[index];
                if (currentColumn.COLVALID === 1) {
                    validColumn = {
                        filterId: convertToFloat(currentColumn.FILTERID),
                        patQual: []
                    };
                    for (var patientIndex = 0, totalPatients = currentColumn.PERSONIDCNT; patientIndex < totalPatients; patientIndex++) {
                        validColumn.patQual
						.push({ personId: convertToFloat(currentColumn.PERSONIDQUAL[patientIndex].PERSONID), encntrId: convertToFloat(currentColumn.PERSONIDQUAL[patientIndex].ENCNTR_ID)
						});
                    }

                    qualifiedColumns.push(validColumn);
                }
            }
        }
        return qualifiedPatients;
    }

    /*
    *   A model object to store the qualified patient information. This is passed to the getHighRiskCatRes script
    */
    function QualifiedPatientInfo(qualificationData) {
        this.QUAL = new PatientInfo(qualificationData);
    }

    /*
    *   A model object that represents a row of data for the worklist
    */
    function WorklistRowData(patientDetails, validColumns) {

        this.HRCColumns = [];
        this.isVisible = ko.observable(true);
        this.isSelected = ko.observable(false);
        this.isValid = false;
        var patientInformationColumn = {};
        // Store all deatils of the patient
        for (var property in patientDetails) {
            patientInformationColumn[property] = patientDetails[property];
        }

        for (property in validColumns[0]) {
            patientInformationColumn[property] = validColumns[0][property];
        }
        // Add patient details as the first column of the worklist row
        this.HRCColumns.push(new HRCColumn(patientInformationColumn));
        this.HRCColumns[0].qualifiedData.push("PATIENT_INFORMATION");

        // Add the other qualified high risk category columns
        for (var index = 1, length = validColumns.length; index < length; index++) {
            this.HRCColumns.push(new HRCColumn(validColumns[index]));
        }

        // listen for the worklist row selection change
        this.isSelectedSubscription = this.isSelected.subscribe(function (newValue) {
            if (newValue)
                rowSelections += 1;
            else if (rowSelections > 0)
                rowSelections -= 1;

            if (!rowSelectionEventTriggered && rowSelections > 0) {
                app.trigger('row-selected', true);
                rowSelectionEventTriggered = true;
            } else if (rowSelectionEventTriggered && rowSelections <= 0) {
                app.trigger('row-selected', false);
                rowSelectionEventTriggered = false;
            }
        }, this);

        // subscribe for 'remove-checked' event from the worklist
        this.removeChecked = app.on('remove-checked').then(function () {
            if (this.isSelected()) {
                this.isVisible(false);
                this.isSelected(false);
            }
        }, this);

        // subscribe for 'reset' event from the worklist
        this.reset = app.on('reset').then(function () {
            if (!this.isVisible())
                this.isVisible(true);
        }, this);
    }

    // Dispose event subscriptions and reset state as new worklist data will be loaded
    WorklistRowData.prototype.dispose = function () {
        if (this.removeChecked) {
            this.removeChecked.off();
            this.removeChecked = null;
        }

        if (this.reset) {
            this.reset.off();
            this.reset = null;
        }

        if (this.isSelectedSubscription) {
            this.isSelectedSubscription.dispose();
            this.isSelectedSubscription = null;
        }

        rowSelectionEventTriggered = false;
        rowSelections = 0;

        this.isVisible = null;
        this.isSelected = null;
        if (this.HRCColumns) {
            for (var columnIndex = 0; columnIndex < this.HRCColumns.length; columnIndex++) {
                this.HRCColumns[columnIndex].dispose();
            }
            this.HRCColumns.length = 0;
            this.HRCColumns = null;
        }
    };

    /*
    *   A model object to represent each High Risk Category column
    */
    var HRCColumn = function (columnData, isAlwaysVisible) {

        for (var property in columnData) {
            this[property] = columnData[property];
        }

        this.COLADMEVENTQUAL = [];
        this.COLALERTQUAL = [];
        this.COLCELABQUAL = [];
        this.COLDIAGNOSQUAL = [];
        this.COLDOCQUAL = [];
        this.COLDRUGQUAL = [];
        this.COLLABQUAL = [];
        this.COLMBRESQUAL = [];
        this.COLORDQUAL = [];
        this.COLPROBLEMQUAL = [];
        this.COLSYNQUAL = [];
        this.COLTASKQUAL = [];

        this.isCDCReportColumn = ko.observable(false);

        this.isLink = ko.computed(function () {
            return this.isCDCReportColumn() || (this.COLLINK && this.COLLINK !== '');
        }, this);

        this.isSelected = ko.observable(false);

        this.openLink = ko.computed(function () {
            if (this.isLink() && !this.isCDCReportColumn() && typeof APPLINK !== "undefined")
                return "javascript:APPLINK(100," + "'" + this.COLLINK + "','')";
            else if (this.isLink() && this.isCDCReportColumn() && typeof CCLLINK !== "undefined")
                return 'javascript:CCLLINK("inn_rpt_get_antib_use_res","",0)';
            else
                return "#";
        }, this);

        if (isAlwaysVisible)
            this.totalQualifications = ko.observable(1);
        else
            this.totalQualifications = ko.observable(0);

        this.isActive = ko.observable(true);

        this.qualifiedData = [];

        this.isVisible = ko.computed(function () {
            return this.isActive() && this.totalQualifications();
        }, this);

        this.isSelectedSubscription = this.isSelected.subscribe(function (newValue) {
            if (newValue)
                columnSelections += 1;
            else if (columnSelections > 0)
                columnSelections -= 1;

            if (!columnSelectionEventTriggered && columnSelections > 0) {
                app.trigger('column-selected', true);
                columnSelectionEventTriggered = true;
            } else if (columnSelectionEventTriggered && columnSelections <= 0) {
                app.trigger('column-selected', false);
                columnSelectionEventTriggered = false;
            }
        }, this);

        this.removeChecked = app.on('remove-checked').then(function () {
            if (this.isSelected()) {
                this.isActive(false);
                this.isSelected(false);
            }
        }, this);

        this.reset = app.on('reset').then(function () {
            if (!this.isActive())
                this.isActive(true);
        }, this);

    }

    HRCColumn.prototype.dispose = function () {
        if (this.removeChecked) {
            this.removeChecked.off();
            this.removeChecked = null;
        }

        if (this.reset) {
            this.reset.off();
            this.reset = null;
        }

        if (this.isSelectedSubscription) {
            this.isSelectedSubscription.dispose();
            this.isSelectedSubscription = null;
        }
        columnSelections = 0;
        columnSelectionEventTriggered = false;
        if (this.isVisible) {
            this.isVisible.dispose();
            this.isVisible = null;
        }

        if (this.isLink) {
            this.isLink.dispose();
            this.isLink = null;
        }

        if (this.openLink) {
            this.openLink.dispose();
            this.openLink = null;
        }

        this.isCDCReportColumn = null;
        this.isSelected = null;
        this.totalQualifications = null;
        this.isActive = null;
    };

    /* 
    *   Helper function to get the column data depending on the column's filter id
    */
    function getColumnDataByFilterID(columns, filterID) {
        for (var index = 0, length = columns.length; index < length; index++) {
            if (columns[index].FILTERID === filterID)
                return columns[index];
        }

        return null;
    }

    /* 
    *   Helper function to get the CDC column numbers from CSV
    */
    function getCDCColumnNumbers(validColumns) {
        var cdcColumns = [];
        if (validColumns) {
            var cdcCSV = validColumns[0].CDCLINK;

            if (cdcCSV !== '') {
                cdcColumns = cdcCSV.split(",");
            }
        }
        return cdcColumns;
    }

    /*  
    *   Function that maps the qualified high risk categories to appropriate patient data
    */
    function mapHRCData(rowsMap, validColumns, hrcDetails) {
        var columns = hrcDetails.COLQUAL;
        var cdcColumnNumbers = getCDCColumnNumbers(validColumns);
        var columnQualifiesData = false;
        // index 0 contains patient information, which is not a HRC column
        for (var index = 1, length = validColumns.length; index < length; index++) {
            var filterID = validColumns[index].FILTERID;
            var columnData = getColumnDataByFilterID(columns, filterID);
            var qualifierArray = null;
            var patientData = null;
            var mapKey = '';

            columnQualifiesData = false;

            // Set if the column links to a CDC Report
            for (var cdcIndex = 0, totalCDCColumns = cdcColumnNumbers.length; cdcIndex < totalCDCColumns; cdcIndex++) {
                if (cdcColumnNumbers[cdcIndex] == columnData.HRCNUM) {
                    validColumns[index].isCDCReportColumn(true);
                    break;
                }
            }

            for (var property in columnData) {
                if ($.isArray(columnData[property]) && columnData[property].length > 0) {
                    qualifierArray = columnData[property];
                    columnQualifiesData = true;
                    for (var resultsIndex = 0, totalResults = qualifierArray.length; resultsIndex < totalResults; resultsIndex++) {
                        mapKey = qualifierArray[resultsIndex].PERSONID + "_" + qualifierArray[resultsIndex].ENCOUNTERID;
                        patientData = rowsMap[mapKey];
                        // if encounter-id is not present, for e.g: in case of COLPROBLEMQUAL, match directly to the first record for the person
                        if (!patientData && !qualifierArray[resultsIndex].ENCOUNTERID) {
                            var partialMatch = qualifierArray[resultsIndex].PERSONID.toString();
                            for (var key in rowsMap) {
                                if (key.slice(0, partialMatch.length) == partialMatch) {
                                    patientData = rowsMap[key];
                                    break;
                                }
                            }
                        }

                        if (patientData) {
                            patientData.HRCColumns[index][property].push(qualifierArray[resultsIndex]);
                            if ($.inArray(property, patientData.HRCColumns[index].qualifiedData) === -1) {
                                patientData.HRCColumns[index].qualifiedData.push(property);
                                patientData.isValid = true;
                            }

                            // A special case for "COLDOCQUAL". It requires "COLDOCTYPECNT" during rendering. So include it.
                            if (property === "COLDOCQUAL") {
                                patientData.HRCColumns[index].COLDOCTYPECNT = columnData.COLDOCTYPECNT;
                            }
                        }
                    }
                }
            }

            if (columnData && columnQualifiesData) {
                validColumns[index].totalQualifications(validColumns[index].totalQualifications() + 1);
            }
        }
    }



    return {
        nurseUnitExtender: nurseUnitExtender,
        patientListExtender: patientListExtender,
        facilityExtender: facilityExtender,
        MyPopulation: MyPopulation,
        PatientQualificationCriteria: PatientQualificationCriteria,
        QualifiedPatientInfo: QualifiedPatientInfo,
        WorklistRowData: WorklistRowData,
        WorklistColumn: HRCColumn,
        mapHRCData: mapHRCData,
        imageMap: imageMap,
        CSSMap: CSSMap
    };
});