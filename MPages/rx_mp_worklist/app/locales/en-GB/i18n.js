﻿define({
    app: {
        modules: {
            localization: {
                title: "Clinical Pharmacist Worklist",
                GENERIC_ERROR: "An error occurred while loading the Clinical Pharmacist Worklist."
            },
            patientPopulation: {
                DEFAULT: "Default",
                PATIENT_LIST_LABEL: "Patient List:",
                PATIENT_LIST_CAPTION: "Select a Patient List",
                FACILITIES: "Facilities:",
                FACILITIES_CAPTION: "Select a Facility",
                NURSE_UNIT_TITLE: "Nurse Wards",
                NURSE_UNIT_LABEL: "Nurse Wards",
                NURSE_UNIT_CAPTION: "Click to open Nurse Wards.",
                NURSE_UNIT_DIALOG_TITLE: "Please select one or more nurse wards.",
                SUBMIT_CAPTION: "Submit",
                CANCEL_CAPTION: "Cancel",
                FACILITES_LOAD_FAILED: "Unable to load Facilities",
                NURSE_UNITS_LOAD_FAILED: "Unable to load available Wards",
                PATIENT_LIST_LOAD_FAILED: "Unable to load Patient list",
                RESET_CAPTION: "Clear",
                FILTER_CAPTION: "Filter",
                SAVE_CAPTION: "Save",
                SELECTED_PATIENT_POPULATION: "Selected Patient Population",
                SUBMIT_TOOLTIP: "Click to display list of qualifying patients",
                PL_FACILITIES_TOOLTIP: "In order to display list of qualifying patients, select either a Patient List or a Facility and Nurse ward from the selections above and click the Submit button.",
                FACILITIES_NU_TOOLTIP: "In order to display list of qualifying patients, select a Facility and Nurse ward from the selections above and click the Submit button.",
                PATIENT_POPULATION_FAILED: "Error loading patient population information."
            },
            myPopulation: {
                MY_POPULATIONS: "My Populations",
                DUPLICATE_VIEW_NAME: "The My Population name %s already exists. Please enter a unique name.",
                SAVE_SUCCESS: "My Population %s saved successfully",
                SAVE_STARTED: "Saving My Population %s",
                SAVE_FAILED: "Unable to save My Population %s. Please try again.",
                REMOVE_STARTED: "Deleting My Population %s",
                REMOVE_SUCCESS: "My Population %s deleted successfully",
                REMOVE_FAILED: "Unable to delete My Population %s. Please try again.",
                HIGH_RISK_CATEGORIES: "High Risk Categories:",
                MY_CATEGORIES: "My Categories:",
                MY_VIEWS_CAPTION: "--New--",
                VIEWS: "Views:",
                VIEW_NAME_TITLE: "Enter Name of View:",
                APPLY_CAPTION: "Apply",
                OK_CAPTION: "Ok",
                RESET_DEFAULT: "Reset default flag of view %s",
                ACTIVATION_FAILED: "Unable to load My Populations window",
                MESSAGE_BOX_TITLE: "Delete My Population",
                MESSAGE_BOX_CONTENT: "Are you sure you want to permanently delete the selected My Population?"
            },
            tooltip: {
                DOB_CAPTION: "DOB:",
                LATEST_NOTE_CAPTION: "Latest Sticky Note:"
            },
            populationLinks: {
                MY_POP_BUTTON: "My Populations",
                VIEWS_LABEL: "Views:",
                VIEW_LIST_CAPTION: "Select a View",
                HRC_LOAD_FAILED: "Unable to load High Risk Categories",
                VIEWS_LOAD_FAILED: "Unable to load My Population views",
                MY_POPULAIONS_FAILED: "Unable to display My Populations",
                UPDATE_VIEW_FAILED: "Unable to load the updated My Population views"
            },
            patientInformation: {
                ATTENDING_PHYSICIAN_CAPTION: "Attending:",
                ADMITTING_PHYSICIAN_CAPTION: "Admitting:",
                LOCATION_CAPTION: "LOC:",
                ADMITTED_CAPTION: "Admitted:",
                LOS_CAPTION: "LOS:",
                LINK_CLICK_CAPTION: "Click to open",
                STICKY_NOTE_ICON_TOOLTIP: "Click to add new sticky note for this patient.",
                DAY_CAPTION: "day",
                DAYS_CAPTION: "days",
                PCP_CAPTION: "PCC:"
            },
            worklist: {
                REMOVE_CAPTION: "Remove",
                RESET_CAPTION: "Reset",
                SAVE_CAPTION: "Save",
                CLINICAL_NOTE_CAPTION: "Click to open link.",
                NO_DATA_MESSAGE: "Based on the criteria defined, there are no qualifying patients to display.",
                CLINICAL_NOTE_OPEN_FAILED: "Unable to open the Clinical Note",
                TAB_OPEN_FAILED: "Unable to launch PowerChart tab",
                WORKLIST_LOAD_FAILED: "Unable to load worklist for the specified search criteria",
                CDC_REPORT_FAILED: "Unable to open CDC Report",
                HRC_COLUMN_CLICK_FAILED: "Unable to open High Risk Category column link",
                LOADING_CAPTION: "Loading worklist data"
            },
            stickyNote: {
                NOTE_ENTRY: "Sticky Note Entry",
                NOTE_VIEW: "Sticky Note View",
                CLOSE_CAPTION: "Close",
                MESSAGE_BOX_TITLE: "Sticky Note changed",
                MESSAGE_BOX_CONTENT: "Do you want to save the note?",
                MESSAGE_BOX_YES: "Yes",
                MESSAGE_BOX_NO: "No",
                MESSAGE_BOX_CANCEL: "Cancel",
                NOTE_SAVE_FAILED: "Unable to save the sticky note",
                NOTE_DELETE_FAILED: "Unable to delete the sticky note",
                NOTE_SAVED: "Sticky note saved successfully",
                NOTE_DELETED: "Sticky note deleted",
                DELETING_NOTE: "Deleting sticky note",
                SAVING_NOTE: "Saving sticky note",
                WRITTEN_BY_CAPTION: "Written By",
                DATE_CAPTION: "Date",
                DELETE_NOTE_TITLE: "Delete Note",
                DELETE_NOTE_CONTENT: "Are you sure you want to permanently delete the selected note?"
            },
            logMessage: {
                INVALID_DATE: "Invalid date field",
                MISSING_LOCALE: "Missing locale information",
                EVENT_DETAILS_FAILED: "Unable to get details for medical administration events",
                CDF_MEANING_FAILED: "Unable to get CDF meaning",
                VIEW_SELECTION_FAILED: "Unable to select My Population",
                DIAGNOSIS_DETAILS_FAILED: "Unable to get details for diagnosis",
                DRUG_DETAIL_FAILED: "Unable to get details for drug class",
                MICRO_HEADER_FAILED: "Unable to get microbiology header",
                MICRO_DETAIL_FAILED: "Unable to get microbiology detail",
                ORDER_DETAIL_FAILED: "Unable to get order details",
                STICKY_NOTES_FAILED: "Unable to launch Sticky Notes",
                IMAGE_PATH_FAILED: "Unable to get image path",
                PATIENT_INFO_FAILED: "Unable to load patient information",
                UPDATE_INFORMATION_FAILED: "Unable to update patient information",
                NURSE_UNIT_LIST_FAILED: "Unable to build list of selected wards",
                PATIENT_LIST_FAILED: "Unable to load patient list",
                FACILITIES_FAILED: "Unable to load facilities",
                QUALIFIER_SETTINGS_FAILED: "Unable to load patient qualifier settings",
                SEARCH_CRITERIA: "Unable to populate patient search criteria"
            }
        }
    }
});
