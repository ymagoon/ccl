

// Global references to form controls

var ctrlPMResults;

var ctrlPMResultsDataset;

var btnPMSearch;

var btnPMRemove;

var formMultiSelectMode;

 

// PM search object

var pmSearch = null;

 

// Define an object to hold the constants for PmSearch

var pmSearchConst = {

   SearchDlg:"PMSearch.SearchTask",

 

   // Single or Multi Select

   pmMultiSelect : 0,

   pmSingleSelect : 1,

 

   // PMSearch Mode

   pmPersonMode : 1,

   pmPatientMode : 2,

   pmEncounterMode : 3,

 

   // Return Person Info

   pmReturnIDOnlyPerson : 0,

   pmReturnAllPerson : 1,

   pmReturnNeverPerson : 2,

 

   // Return EncounterInfo

   pmReturnIDOnlyEncounter : 0,

   pmReturnAllEncounter : 1,

   pmReturnNeverEcounter : 2

};

 

// Arrays used to determine what function to call to get data from the search object

arrGetPersonInfo = ["AGE", "BIRTH_DT_TM", "CITIZENSHIP_CD", "CONFID_LEVEL_CD", "DECEASED_DT_TM", "ETHNIC_GRP_CD", "LANGUAGE_CD",

                   "MARITAL_TYPE_CD", "NAME_FIRST", "NAME_FULL_FORMATTED", "NAME_LAST", "NATIONALITY_CD", "PERSON_ID",

                   "PERSON_TYPE_CD", "RACE_CD", "RELIGION_CD", "SEX_CD", "SPECIES_CD", "VIP_CD"];

 

arrGetPersonAlias = ["INTPERSID", "CMRN", "DONORID", "DNRN", "DRLIC", "FILLER ORDER", "HISTCMRN", "HISTMRN", "HNASYSID",

                    "MRN", "NHIN", "NMDP", "PASSPORT", "PATID_V4", "PERSON NAME", "PLACER ORDER", "PRN", "SSN", "SHIN",

                    "UNOS", "MILITARYID", "OTHER", "REF_MRN", "OUTREACH", "PBSID", "OUTREACH", "ACCOUNT", "MESSAGING",

                    "HICR", "INTLD", "NMDPD", "NMDPR", "OPOD", "OPOR", "PXR", "UNOSD", "PASSWORD", "VERSION", "MEMBERNBR"]

                    

arrGetEncounterInfo = ["ACCOMMODATION_CD", "ACCOMMODATION_REQUEST_CD", "ADMIT_MODE_CD", "ADMIT_SRC_CD",

                      "ADMIT_TYPE_CD", "ADMIT_WITH_MEDICATION_CD", "ALT_RESULT_DEST_CD", "AMBULATORY_COND_CD",

                      "ARRIVE_DT_TM", "CONFID_LEVEL_CD", "COURTESY_CD", "DATA_STATUS_CD", "DEPART_DT_TM",

                      "DIET_TYPE_CD", "DISCH_DISPOSITION_CD", "DISCH_DT_TM", "DISCH_TO_LOCTN_CD", "ENCNTR_CLASS_CD",

                      "ENCNTR_FINANCIAL_ID", "ENCNTR_STATUS_CD", "ENCNTR_TYPE_CD", "ENCOUNTER_ID", "EST_ARRIVE_DT_TM",

                      "EST_DEPART_DT_TM", "FINANCIAL_CLASS_CD", "GUARANTOR_TYPE_CD", "ISOLATION_CD", "LOC_BED_CD",

                      "LOC_BUILDING_CD", "LOC_FACILITY_CD", "LOC_NURSE_UNIT_CD", "LOC_ROOM_CD", "LOC_TEMP_CD",

                      "LOCATION_CD", "MED_SERVICE_CD", "NAME_FIRST_SYNONYM_ID", "ORGANIZATION_ID", "PRE_REG_DT_TM",

                      "PRE_REG_PRSNL_ID", "PREADMIT_NBR", "PREADMIT_TESTING_CD", "READMIT_CD", "REFERRING_COMMENT",

                      "REG_DT_TM", "REG_PRSNL_ID", "RESULT_DEST_CD", "VIP_CD"];

 

arrGetEncounterAlias = ["EXTENCNBR", "FIN NBR", "HNAENCNBR", "MRN", "REQ NBR", "VISITID", "OTHER", "PBSID"]

 

 

 

/**

* Grab references to the form controls, create the form control dataset, setup the PM Search object.

*/

function ccpsPMSearchSetup(_ctrlPMSearch, _btnPMSearch, _btnPMRemove, _PMSearchMode, _PMSelectMode, _PMCtrlDataset)

{

   ctrlPMResults = _ctrlPMSearch;

   btnPMSearch = _btnPMSearch;

   btnPMRemove = _btnPMRemove;

   formMultiSelectMode = _PMSelectMode;

   ctrlPMResultsDataset = _PMCtrlDataset;

 

   var host = theForm.getHostName();

 

   if (host != null)

   {

       var hostParts = host.split(" ");

 

       if (hostParts[0] != "win32")

       {

           alert("The person search control can only run on Windows.");

           return;

       }

   }

 

   // Set the event handlers

   ctrlPMResults.onValidate = validateResultList;

   ctrlPMResults.onChange = validateResultList;

   btnPMSearch.onClick = onPMSearchClick;

   btnPMRemove.onClick = onPMRemoveClick;

 

 

   // Setup the PM Search object

   pmSearch = new ActiveXObject(pmSearchConst.SearchDlg);

   pmSearch.Initialize(theForm.appHandle);

 

   pmSearch.Mode = _PMSearchMode;

   pmSearch.AddPersonButton = false;

   pmSearch.AddEncounterButton = false;

    

 

   if (pmSearch.Mode == pmSearch.pmPersonMode)

   {

       // Define list dataset if not passed in

       // Format is: <column header>, <internal name>, <visible>, <width>

       if (ctrlPMResultsDataset == null)

           ctrlPMResultsDataset = [["Person ID",    "PERSON_ID",           false, 20],

                                   ["MRN",          "MRN",                 true,  20],

                                   ["Patient Name", "NAME_FULL_FORMATTED", true, 100]];

 

 

       pmSearch.ReturnPersonInfo = pmSearch.pmReturnAllPerson;

 

   }

   else  // pmSearch.pmEncounterMode

   {

       // Define list dataset if not passed in

       // Format is: <column header>, <internal name>, <visible>, <width>

       if (ctrlPMResultsDataset == null)

           ctrlPMResultsDataset = [["Encounter ID", "ENCNTR_ID",           false, 20],

                                   ["FIN",          "FIN",                 true,  20],

                                   ["Patient Name", "NAME_FULL_FORMATTED", true, 100]];

 

 

       pmSearch.ReturnEncounterInfo = pmSearch.pmReturnAllEncounter;

 

       // Only allow 1 encounter for now, need to look into supporting multiple

       // pmSearch.EncounterMultiSelect = true;

       // pmSearch.AllEncountersButton = true;

 

   }

 

 

   // Build the dataset and update the control

   createDataset(ctrlPMResults, ctrlPMResultsDataset);

   ctrlPMResults.updateDisplay();

   validateResultList(btnPMRemove);

}

 

 

/**

* Open the person search dialog box and handle the selected person/encounter.

*/

function onPMSearchClick(sender)

{

   // Run the PMSearch & open the search dialog to the user

   pmSearch.Search();

 

   if (pmSearch.CancelClicked == false)

   {

       // Get the selected person/encounter

       var selectedValue;

       var status = 0;

 

       // If we are in single-select mode, replace the existing result if one exists

       if (formMultiSelectMode == pmSearchConst.pmSingleSelect && ctrlPMResults.recordCount > 0)

           ctrlPMResults.clear();

 

 

       // Add to the person list box

       var recNum = ctrlPMResults.getNextRecord();

       if (recNum >= 0)

       {

           for (var x in ctrlPMResultsDataset)

           {

               // Figure out which PMSearch API to call to get the data based on the attribute name in the dataset

               if (isInArray(arrGetPersonInfo, ctrlPMResultsDataset[x][1]))

                   selectedValue = pmSearch.GetPersonInfo(status, ctrlPMResultsDataset[x][1], pmSearch.pmDisplay);

                   

               else if (isInArray(arrGetPersonAlias, ctrlPMResultsDataset[x][1]))

                   selectedValue = pmSearch.GetPersonAlias(status, ctrlPMResultsDataset[x][1], pmSearch.pmAlias);

                   

               else if (isInArray(arrGetEncounterInfo, ctrlPMResultsDataset[x][1]))

                   selectedValue = pmSearch.GetEncounterInfo(status, ctrlPMResultsDataset[x][1], pmSearch.pmDisplay);

                   

               else if (isInArray(arrGetEncounterAlias, ctrlPMResultsDataset[x][1]))

                   selectedValue = pmSearch.GetEncounterAlias(status, ctrlPMResultsDataset[x][1], pmSearch.pmAlias);

 

 

               // Trick CCL into handling as F8 for ID values

               if (ctrlPMResultsDataset[x][1].search(/_ID/) >= 0)

                   selectedValue = selectedValue + ".00";

                   

               ctrlPMResults.setField(recNum, x, selectedValue);                   

           }

 

           ctrlPMResults.updateDisplay();

       }

   }

 

   ctrlPMResults.fireChangeEvent();

   validateResultList(sender);

}

 

 

/**

* Check if a string is in an array, used to determine which PMSearch function to call

*/

function isInArray(arrList, attrName)

{

   var returnVal = false;

   

   for (var i in arrList)

   {

       if (arrList[i].toUpperCase() == attrName.toUpperCase())

       {

           returnVal = true;

           break;

       }

   }

   

   return returnVal;

}

 

 

/**

* Remove the selected person from the selection list

*/

function onPMRemoveClick(sender)

{

   if (ctrlPMResults.selectedRecordCount > 0)

       ctrlPMResults.deleteSelectedRecords();

 

   ctrlPMResults.fireChangeEvent();

   validateResultList(sender);

}

 

 

/**

* Check the count of items in the control and enable/disable the remove & execute button accordingly

*/

function validateResultList(sender)

{

   var personCnt = ctrlPMResults.selectedRecordCount;

 

   btnPMRemove.enabled = (personCnt > 0);

 

   return (personCnt > 0);    

}

