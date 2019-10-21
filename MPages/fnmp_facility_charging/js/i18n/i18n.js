var i18n = function ()
{
    return {
        REQUEST: "Request",
        //Return Status:
        NO_RESULTS_FOUND: "No results found",
        NO_DATA: "No Data",

        //Error Status:
        ERROR_RETREIVING_DATA: "Error retrieving results",
        ERROR_OPERATION: "Operation Name",
        ERROR_OPERATION_STATUS: "Operation Status",
        ERROR_TARGET_OBJECT: "Target Object Name",
        ERROR_TARGET_OBJECT_VALUE: "Target Object Value",
        //Customization
        CLEAR_PREFERENCES: "Clear Preferences",
        SAVE_PREFERENCES: "Save Preferences",
        CUSTOMIZE: "Customize",
        USER_CUSTOMIZATION: "User Customization",
        SAVE_PREF_SUCCESS: "Preferences Successfully Saved",
        CLEAR_PREF_SUCCESS: "Preferences Successfully Cleared",

        //Alerts
        LYNXEPOINT_OBJECT_NULL: "LYNXEPOINT object = null",
        INITIAL_PARAMETERS_INVALID: "The transaction cannot be completed because the person, encounter or tracking group parameters are invalid.",
        WEB_SERVICE_PARAMETERS_INVALID: "The transaction cannot be completed because the web service parameters are invalid.",
        INVALID_OPERATION_EXCEPTION: "An operation error has occurred. Unable to complete the transaction.",

        //wizard
        FACILITY_TITLE: "Facility Charge Ticket",
        FACILITY_CODING: "Facility Coding",
        URGENT_CARE_TITLE: "Clinic Charging and Coding",
        URGENT_CARE_CODING: "Evaluation & Management",
        INFUSION_INJECTIONS: "Infusion & Injections",
        FINALIZE_CHARGES: "Finalize Charges",
        NEXT: "Next >",
        BACK: "< Back",
        ADD: "Add",
        CANCEL: "Cancel",
        ADD_NEW: "Add New",
        INFUSION_START_TIME: "Start Time",
        INFUSION_STOP_TIME: "Stop Time",
        HYDRATION: "Hydration",
        INFUSION: "Infusion",
        IV_PUSH: "IV Push",
        SQ_INJECTION: "IM/SQ Injection",
        INTRA_ARTERIAL_INJECTION: "Intra-Arterial Injection",
        SITE: "Site",
        NO: "No",
        TYPE: "Type",
        DURATION: "Duration(minutes)",
        MEDICATION: "Medication",
        E_M: "Evaluation & Management",
        I_I: "Infusion & Injections",
        CPT: "CPT",
        UNITS: "Units",
        CHARGES_START: "Start/Admin",
        CHARGES_STOP: "Stop",
        CHARGES: "Charges",
        CALCULATE_CHARGES: "Calculate >",
        SUBMIT_CHARGES: "Submit",
        SUCCESS_MSG: "The Charges have been successfully processed",
        ADD_SUCCESS_MSG: "The Additional Charges have been successfully processed",
        SYSTEM_DEFAULT: "&nbsp;*",
        SYSTEM_DEFAULT_XML: "&nbsp;&lowast;",
        DOCUMENTED_SECTION: "Documented",
        SAVE: "Save",
        HELP_SECTION: "Reference Text",
        DROP_ADDITIONAL_CHARGES: "Additional Charges",
        EXPAND_SUB_SEC: "Expand All Reference Text",
        COLLAPSE_SUB_SEC: "Collapse All Reference Text",
        REFRESH: "Refresh",
        STARTWITH: "Starts with",
        CONTAINS: "Contains",
        PRESENTING_PROBLEM_ALERT: "A presenting problem is required to calculate the Typical Visit Level. Please enter the problem before proceeding",
        SELECT_SITE: "Please select a site.",
        SELECT_TYPE: "Please select a type.",
        SELECT_MEDICATION: "Please select a medication.",
        FILL_OUT_START_DATE: "Please fill out start date.",
        FILL_OUT_START_TIME: "Please fill out start time.",
        FILL_OUT_STOP_DATE: "Please fill out stop date.",
        FILL_OUT_STOP_TIME: "Please fill out stop time.",
        STANDARD_ED_ENCOUNTER: "Standard Encounter",
        START_DATE_PRIOR_STOP_DATE: "The Start Date/Time must be prior to the Stop Date/Time.",
        START_DATE_AFTER_ARRIVAL: "The Start Date/Time must be after the patient's arrival date/time",
        STOP_DATE_AFTER_ARRIVAL: "The Stop Date/Time must be after the patient's arrival date/time",
        START_DATE_PRIOR_CHECKOUT: "The Start Date/Time must be prior to the patient's discharge date/time",
        STOP_DATE_PRIOR_CHECKOUT: "The Stop Date/Time must be prior to the patient's discharge date/time",
        START_DATE_PRIOR_CURRENT: "The Start Date/Time must be prior to the current date/time",
        STOP_DATE_PRIOR_CURRENT: "The Stop Date/Time must be prior to the current date/time",
        IN_SYSTEM: " in the system.",
        VISIT_TYPES_ALERT: "Selecting this option will override all other EM level charges",

        //Infusion and Injection
        CHOOSE_SITE: "choose a site ..",
        IV1: "IV1",
        MODIFY: "Modify",
        DELETE: "Delete",
        REMOVE: "Remove",
        CHOOSE_TYPE: "Choose a type ..",
		
        //Additional Charges
        ADDITIONAL_CHARGES: "Next >",


        //Commons
        GO_TO_TAB: "Go to {0} tab",
        ESTIMATED_DISCHARGE_DATE: "Estimated D/C Date",
        LOADING_DATA: "Loading",
        RENDERING_DATA: "Rendering",
        NAME: "Name",
        DETAILS: "Details",
        ONSET_DATE: "Onset Date",
        COMMENTS: "Comments",
        DATE_TIME: "Date/Time",
        ANNOTATED_DISPLAY: "Annotated Display Name",
        ANNOTATED_DISPLAY_NAME: "Annotated Display",
        ARRIVAL: "Arrival",
        CODE: "Code",
        LATEST: "Latest",
        WITHIN: "within",
        PREVIOUS: "Previous",
        SINCE: "Since",
        DISCLAIMER: "This page is not a complete source of visit information.",
        USER_CUST_DISCLAIMER: "Please consider screen resolution before selecting a three column view.",
        RESULT: "Result",
        STATUS: "Status",
        DATE: "Date",
        ACTIVE: "Active",
        ENTERED: "Entered",
        FLAGGED: "Flagged",
        DISCONTINUED: "Discontinued",
        ADMIN_LAST_N_HOURS: "Administered last {0} hours",
        LAST_N_HOURS: "Last {0} hours",
        LAST_N_DAYS: "Last {0} days",
        LAST_N_MONTHS: "Last {0} months",
        LAST_N_YEARS: "Last {0} years",
        LAST_N_WEEKS: "Last {0} weeks",
        NEXT_N_HOURS: "Next {0} hours",
        WITHIN_MINS: "{0} mins",
        WITHIN_HOURS: "{0} hrs",
        WITHIN_DAYS: "{0} days",
        WITHIN_WEEKS: "{0} wks",
        WITHIN_MONTHS: "{0} mos",
        WITHIN_YEARS: "{0} yrs",
        SELECTED_VISIT: "Selected visit",
        All_VISITS: "All Visits",
        SELECTED_N_VISIT: "{0} for the selected visit",
        ALL_N_VISITS: "{0} for all visits",
        PRIMARY_RESULTS: "Primary Results",
        SECONDARY_RESULTS: "Secondary Results",
        FROM: "From",
        COLLECTED: "Collected",
        DONE: "Done",
        NOT_DONE: "Not Done",
        HELP: "Help",
        ADD: "Add",
        TEXT: "Text",

        //Errors
        JS_ERROR: "JavaScript Error",
        DISCERN_ERROR: "Discern Error",
        MESSAGE: "Message",
        NUMBER: "Number",
        DESCRIPTION: "Description",
        //expand collapse
        SHOW_SECTION: "Expand",
        HIDE_SECTION: "Collapse",
        EXPAND_ALL: "Expand All",
        COLLAPSE_ALL: "Collapse All",
        LOCATION: "Location",
        //Demographic	
        DOB: "DOB",
        SEX: "Sex",
        AGE: "Age",
        MRN: "MRN",
        FIN: "FIN",
        VISIT_REASON: "Visit Reason",
        ISOLATION: "Isolation",
        LAST_DOC_DT_TM: "Last Documented Date/Time",
        LAST_DOC_BY: "Last Documented By",


        //Allergy
        ALLERGY: "Allergy",
        ALLERGY_NAME: "Allergy Name",
        REACTION: "Reaction",
        SEVERITY: "Severity",

        //Diagnoses
        DIAGNOSES: "Diagnosis",
        DIAGNOSES_NAME: "Diagnosis Name",
        DIAGNOSES_DATE: "Diagnosis Date",

        //Problems
        PROBLEM: "Problem",
        PROBLEMS: "Problems",
        PROBLEMS_NAME: "Problems Name",
        PROBLEMS_DETAILS: "Problems Details",
        RESPONSIBLE_PROVIDER_NAME: "Responsible Provider",

        //intake and output
        TOTAL_FL_INTAKE: "Total Fluid Intake",
        TOTAL_FL_OUTPUT: "Total Fluid Output",
        TOTAL_FL_BAL: "Total Fluid Balance",
        IO: "Intake and Output",
        LAST_3_DAYS: "Last 3 days for the selected visit",
        NOTE_INDICATOR: "* Indicates a day without a full 24 hour measurement period.",

        //Growth Chart
        PERCENTILE: "Percentile",
        ZSCORE: "Z-score",

        //Vitals & Labs
        VITALS_TABLE: "Vitals Table",
        BLOOD_PRESSURE: "BP",
        OTHER_RESULTS: "Other Results",
        TEMPERATURE: "Temp",
        DEGC: "DegC",
        DEGF: "DegF",
        HEART_RATE: "HR",
        MIN: "Min",
        MAX: "Max",
        NORMAL_RANGE: "Normal Range",
        CRITICAL_RANGE: "Critical Range",
        NORMAL_LOW: "Normal Low",
        NORMAL_HIGH: "Normal High",
        CRITICAL_LOW: "Critical Low",
        CRITICAL_HIGH: "Critical High",
        HI_IND: "H",
        LOW_IND: "L",
        CRIT_IND: "C",
        UNIT_OF_MEASURE: "Unit of Measure",
        TWO_DAY_MAX: "48 Hour Max",
        //graph
        CLOSE_X: "CLOSE X",
        LABRAD: "Lab/Radiology",

        //Restraints
        RESTRAINTS: "Restraints",
        RESTRAINT: "Restraint",
        RESTRAINT_APPLIED: "Restraint Applied",
        RESTRAINT_TYPE: "Restraint Type",
        RESTRAINT_LOCATION: "Restraint Location",
        RESTRAINT_DEATILS: "Restraint Details",
        RESTRAINT_REASON: "Restraint Reason",
        ORDER_TYPE: "Order Type",
        ORDER_DATE_TIME: "Order Date/Time",
        EXPIRATION_DATE_TIME: "Expiration Date/Time",

        //Documents
        DOCUMENTATION_DETAILS: "Documentation Details",
        NOTE_NAME: "Note Name",
        SUBJECT: "Subject",
        NOTE_TYPE: "Note Type",
        AUTHOR: "Author",
        DOCUMENT_FAVS: "No Favs Found",
        DOCUMENTS: "Documents",
        //Overdue Tasks
        OVERDUE_TASKS: "Overdue Tasks",

        //measurements and weights
        MEASUREMENT_DETAILS: "Measurement Details",

        //Patient Assessment
        PATIENT_ASSESSMENT: "Patient Assessment",
        PSYCHOSOCIAL_FACTORS: "Psychosocial Factors",
        RESPIRATORY: "Respiratory",
        CARDIO: "Cardiovascular",
        PAIN: "Pain",
        NEURO: "Neuro",
        GI: "GI",
        GU: "GU",
        MUSCULOSKELETAL: "Musculoskeletal",
        INTEGUMENTARY: "Integumentary",
        GENERAL_ASSESSMENT: "General Assessment",

        //Patient Family Education
        PATIENT_FAMILY_EDUCATION_DETAILS: "Patient Family Education Details",
        PATIENT_FAMILY_EDUCATION: "Patient Family Education",

        //Diagnostics
        DIAGNOSTIC: "Diagnostic",
        DIAGNOSTIC_DETAILS: "Diagnostic Details",
        STUDY: "Study",
        EKG: "EKG",
        CHEST: "Chest",
        OTHER_DIAGNOSTICS: "Other Diagnostics",
        CHEST_ABD_XR: "Chest/ABD XR",

        //Respiratory
        MODEL: "Model",
        DATE_TIME_INITIATED: "Date Time Initiated",
        VENTILATOR_MODE: "Ventilator Mode",
        SET_TIDAL_VOLUME: "Set Tidal Volume",
        PEEP: "PEEP",
        FIO2: "FIO2",
        SET_RATE: "Set Rate",
        FLOW_RATE: "Flow Rate",
        TOTAL_RESPIRATORY_RATE: "Total Respiratory Rate",
        TOTAL_MINUTE_VOLUME: "Total Minute Volume",
        INSPIRATORY_TIME_SET: "Inspiratory Time Set",
        INSPIRATORY_TIME_DELIVERED: "Inspiratory Time %",
        RESPIRATORY_DISCLAIMER: "The displayed Arterial Blood Gas result(s) must be synchronized with the oxygen source FIO2, and/or oxygen flow rate that was being delivered to the patient at the time the sample was obtained.",
        UNKNOWN: "Unknown",
        BE: "B.E.",
        PREVIOUS_ABG_RESULTS: "Previous ABG Results",
        LATEST_ABG_RESULTS: "Latest ABG Results",
        VENTILATOR_INFO: "Ventilator Information",
        NO_RES_LAST_24_HRS: "-- No Results found in the last 24 hours --",
        NO_PREV_RES_LAST_24_HRS: "-- No Previous results found in the last 24 hours --",
        NO_RES_LAST_LOOKBACK_HRS: "--No Results in the look back period--",

        //Blood Info
        TRANSFUSIONS: "Transfusions",
        BLOOD_TYPE_RH: "Blood Type RH",
        MOTHER: "Mother",
        BABY: "Baby",
        PHOTOTHERAPY: "Phototherapy",
        PHOTOTHERAPY_RESULT: "Result",
        TRANSFUSION_RESULT_VAL: "Result Value",
        TRANSFUSION_DATE: "Transfusion Date",
        TRANSFUSION_EVENT_CD: "Transfusion Event Code",


        //Medications
        MEDICATIONS: "Medications",
        MED_DETAIL: "Medication Details",
        MED_NAME: "Medication",
        REQUESTED_START: "Requested Start",
        ORIG_DT_TM: "Original Order Date/Time",
        LAST_DOSE_DT_TM: "Last Dose",
        NEXT_DOSE_DT_TM: "Next Dose",
        START_DT_TM: "Start Date/Time",
        STOP_DT_TM: "Stop Date/Time",
        STOP_REASON: "Stop Reason",
        STATUS: "Status",
        LAST_GIVEN: "Last Given",
        NEXT_DOSE: "Next Dose",
        SCHEDULED: "Scheduled",
        CONTINOUS: "Continuous",
        SUSPENDED: "Suspended",
        PRN: "PRN",
        UNSCHEDULED: "Unscheduled",
        RESPONSIBLE_PROVIDER: "Order Entered By",
        COMPLIANCE: "Compliance",
        SCHEDULED_INH: "Scheduled Inhaled",
        PRN_ALL: "PRN All",
        PRN_48: "PRN administered last 48 hours",
        INHALED: "INH",
        NEBULIZED: "NEB",
        INHALALATION: "Inhalation",
        HI_FLOW_NEB: "Hi-Flow Neb",
        ADMINISTERED: "Administered",
        PRN_UNSCHEDULED: "PRN/Unscheduled Available",
        //Orders
        ORDER_DETAILS: "Order Details",
        ORDER_NAME: "Order",
        ORDER_DATE: "Order Date/Time",
        ORDER_STATUS: "Status",
        ORDER_PHYS: "Ordered by",
        DISCONTINUED: "Discontinued",
        ORDERED: "Ordered",
        CLINICAL_DISPLAY: "Clinical Display",
        ORDERS: "Orders",

        //Weights and Measurements
        MEASUREMENT_DETAILS: "Measurement Details",
        CHANGE: "Change",
        ADMISSION: "Admission",

        //Patient Information
        RFV: "Reason For Visit",
        ROOM_BED: "Room/Bed",
        ADMIT_DIAG: "Admitting Diagnosis",
        ADMIT_DATE: "Admit Date",
        PRIM_PHYS: "Primary Physician",
        ATTEND_PHYS: "Attending Physician",
        EMER_CONTACT: "Emergency Contact",
        EMER_NUMBER: "Emergency #",
        CODE_STATUS: "Code Status",
        LAST_VISIT: "Last Visit",
        LAST: "Last",
        VISIT: "Visit",
        CONTACTS: "Contacts",

        //Micro
        SOURCE_BODY_SITE: "Source/Body Site",
        COLLECTED_DATE_TIME: "Collected Date/Time",
        SUSCEPTIBILITY: "Susceptibility",
        ASSOCIATED_MICRO_REPORTS: "Associated Micro Reports",
        ASSOCIATED_MICRO_STAIN_REPORTS: "Associated Micro Stain Reports",
        GROWTH_IND: "Growth Ind",
        SUSC_HEADER: "SC",
        POS: "POS",
        NEG: "NEG",
        GROWTH: "Growth",
        NO_GROWTH: "No Growth",
        NORMALITY: "Normality",
        SOURCE_SITE: "Source/Site",
        SOURCE: "Source",
        COLLECTED_WITHIN: "Collected within",
        MICRO: "Micro",

        //Patient Background
        ADVANCE_DIRECTIVE: "Advance Directive",
        ISOLATION: "Isolation",
        ACTIVITY_ORDER: "Activity Order",
        FALL_RISK_SCORE: "Fall Risk Score",
        SEIZURE_PRECAUTIONS: "Seizure Precautions",
        DIET: "Diet",
        PAIN_SCORE: "Pain Score",
        GESTATIONAL_AGE: "Gestational Age",
        PARA_GRAVIDA: "Para Gravida",
        TRANSPLANT_DATE: "Transplant Date",
        CODE_STATUS: "Code Status",
        SERVICE: "Service",
        ATTENDING_PHYSICIAN: "Attending Physician",
        PARENT_PART_TYPE: "Legal Guardian Reltn",
        TARGET_DISCH_DT_TM: "Target Discharge Date Time",
        CARE_LEVEL: "Care Level",
        RESUSITATION_STATUS: "Resuscitation Status",
        ASSISTIVE_DEVICES: "Assistive Devices",
        MULTIPLE: "Multiple",
        DEVICE_DETAILS: "Device Details",

        //Lines Tubes Drains,
        LINES: "Lines",
        TUBES_DRAINS: "Tubes/Drains",
        LAST_DOC_DT_TM: "Last Documented Date/Time",
        INIT_DOC_DT_TM: "Initial Documented Date/Time",
        LAST_DOC: "Last Documented",
        LAST_DOC_WITHIN: "Last Documented Within",

        //EVENTS
        EVENTS: "Events",

        //Timeline Misc
        ACTIVITY_LIST: "Activity List",
        INCOMPLETE_ORDERS: "Incomplete Order(s)",
        RESULTS_RETURNED: "Result(s) Returned",
        COMPLETE_ORDERS: "Complete Order(s)",
        MEDS_ADMINISTERED: "Medication(s) Administered",
        CRITICAL_RESULTS: "Critical Results",
        FIRST_24HRS_ED_VISIT: "Results represent the first 24 hours of the Emergency visit",
        RESULTS_SINCE_ADMITTED: "Results since time admitted",
        HIDE_LEGEND: "Hide Legend",
        SHOW_LEGEND: "Show Legend",
        COMPLETED: "Completed",
        EXAM: "Exam",
        ADMINISTERED: "Administered",
        NO_RESULTS: "No Results",
        LAST_PARTICIPATION: "Last Participation",
        //Nursing Communication MPage specific strings
        SITUATION_BACKGROUND: "Situation/Background",
        ASSESSMENT: "Assessment",
        RECOMMENDATION: "Recommendation",
        NURSING_COMMUNICATION: "Nursing Communication",

        //MPage title strings
        ED_SUMMARY: "ED Summary", 	//ED Summary v2
        ICU_SUMMARY: "ICU Summary", 	//ICU Summary
        INPATIENT_SUMMARY: "Inpatient Summary", //Inpatient Summary v2
        DISCHARGE_SUMMARY: "Discharge Summary",

        //Oxygenation and Ventilation Component
        O2_FLOW_RATE: "02 Flow Rate",
        PREVIOUS_BLOOD_GAS_ARTERIAL_RESULTS: "Previous Blood Gas Arterial Results",
        LATEST_BLOOD_GAS_ARTERIAL_RESULTS: "Latest Blood Gas Arterial Results",


        //Blood Group Component
        TRANSFUSIONS: "Transfusions",
        DATE_PERFORMED: "Date Performed",

        //Care Manager UM Page Name
        CAREMANAGERUMPAGE: "Utilization Review Summary",

        //Dicharge Care Management Summary
        DISCHARGECAREMANAGEMENT: "Discharge Care Management Summary",

        //Care Manager Discharge Planning
        CUR_DOC_PLAN_SCREEN: "Current Documented Plan/Screen",
        PLANNED_DISCHARGE_DISP: "Planned Discharge Disposition",
        TRANSPORATION_ARRANGED: "Transportation Arranged",
        LOCATION: "Location",
        TRANSFER_OF_CARE_PACKET: "Transfer of Care Packet",
        MIM_SIGNED: "Admit MIM Signed",
        DISCHARGE_MIM_SIGNED: "Discharge MIM Given",
        DISCHARE_APPEALDELIVERED: "Discharge Appeal Delivered",
        DME_ANTICIPATED: "DME Anticipated",
        DME_COORD: "DME Coordinated",
        PLANNED_DISCHARGE_DT_TM: "Planned Discharge Date",
        DC_PLANNING_TM_TRACKED: "DC Planning Time Tracked",
        DELAYS_TRACKED: "Delays Tracked",
        DISCHARGE_PLANNER: "Discharge Planner",
        HOURS: "Hours",
        MINS: "Minutes",
        DAYS: "Days",
        PROFSKILLEDSERVICESANTICIPATED: "Prof Skilled Services Anticipated",

        //Care Manager Insurance Strings
        PRIMARY: "Primary",
        SECONDARY: "Secondary",
        TERTIARY: "Tertiary",

        AUTHORIZATION: "Authorization",
        TYPE: "Type",
        STATUS: "Status",
        DELAYREASON: "Delay Reason",
        AUTH: "Auth",
        AUTHDATES: "Auth Dates",
        NUMBEROFDAYS: "Number of Days",
        AUTHCOMMENTS: "Auth Comments",

        BENEFITS: "Benefits",
        DEDUCTIBLE: "Deductible",
        DEDUCTIBLE_MET: "Met",
        REMAINING: "Remaining",
        COPAY: "Copay",
        LIFETIMEMAX: "Life Time Max",
        LTRDAYSREMAINING: "LTR Days Remaining",
        LTRDAILYDEDUCTABLE: "LTR Daily Deductible",
        COVEREDDAYSREMAINING: "Covered Days Remaining",
        COINSURANCEDAYSREMAINING: "Coinsurance Days Remaining",
        //Care Manager Visit Information Strings
        FIN_NUM: "FIN Number",
        ENCNTR_TYPE: "Encounter Type",
        FIN_CLASS: "Financial Class",

        ADMIT_INFO: "Admission Information",
        REG_DT_TM: "Registration Date/Time",
        ADMIT_TO_BED_DT: "Admit to Bed Date",
        ATTENDING_PHD: "Attending Physician",
        REASON_FOR_VISIT: "Reason for Visit",
        ADMIT_DX: "Admit Dx",
        ADMIT_SOURCE: "Admit Source",
        LOCATION: "Location",

        DISCHARGE_INFORMATION: "Discharge Information",
        DISCHARGE_DATE: "Discharge Date",
        DISCHARGE_DISPOSITION: "Discharge Disposition",
        DISCHARGE_LOCATION: "Discharge Location",

        ENCOUNTERS: "Encounters",
        FINAL_DRG: "Final DRG",
        FINAL_DIAGNOSIS: "Final Dx",
        ADMIT_DATE: "Admit Date",
        LOS: "LOS",
        LENGTH_OF_STAY: "Length Of Stay",
        KEY_PERSON_RELATIONSHIPS: "Key Person Relationships",
        NO_KEY_PERSONS: "No key persons found",
        RELATIONSHIP_HEADER: "Relationship",
        PERSON_NAME_HEADER: "Person Name",

        ADMIT_DATE: "Admit Date",
        FINAL_DIAGNOSIS: "Final Diagnosis",

        //Home medication
        HOME_MEDICATION: "Home Medication",
        LAST_DOSE: "Last Dose",
        PRESCRIBED: "Prescribed",
        DOCUMENTED: "Documented",
        NO_KNOWN_HOME_MEDS: "No known home medications exist for this patient.",
        UNABLE_TO_OBTAIN_MED_HIST: "Unable to obtain the medication history information for the selected visit.",

        //Procedure History
        PROCEDURE: "Procedure",
        DISPLAY_AS: "Display As",
        PROCEDURE_DETAILS: "Procedure Details",
        PROCEDURE_DATE: "Procedure Date",
        PROVIDER: "Provider",
        SIG_LINE: "Sig. Line",

        //Procedural Information
        MODIFIERS: "Modifiers",
        CASE_NUM: "Case Number",
        ANESTHESIA_TYPE: "Anesthesia Type(s)",
        SURGEON: "Surgeon",
        SURGERY_START: "Surgery Start",
        SURGERY_STOP: "Surgery Stop",
        ANESTH_STOP: "Anesth Stop",
        ANESTH_START: "Anesth Start",
        SECONDARY_PROCEDURE: "Secondary Procedure",
        PROCEDURE_NAME: "Procedure Name",
        SURGICAL_FREE_TEXT: "Surgical Free Text",

        //Social History
        SOCIAL_HISTORY_INFORMATION: "Social History Information",
        SOCIAL_HISTORY_DETAILS: "Social History Details",
        CATEGORY: "Category",
        LAST_UPDATED: "Last Updated",
        LAST_UPDATED_BY: "Last Updated By",


        //Pregnancy History
        PREGNANCY: "Pregnancy",
        BABY: "Baby",
        PREGNANCY_DETAILS: "Pregnancy Details",
        LENGTH_OF_LABOR: "Length of Labor",
        DELIVERY_HOSPITAL: "Delivery Hospital",
        CHILD_NAME: "Child's Name",
        FATHER_NAME: "Father's Name",

        //Family history
        CONDITION: "Condition",
        MEMBERS: "Members",
        DECEASED: "Deceased",

        //Past Medical History
        PAST_RESOLVED_DATE: "Resolved Date",
        PAST_PROBLEM: "Problem",


        //Notes and Reminders
        PRIORITY: "Priority",
        SHOW_UP: "Show Up",
        DUE: "Due",
        STICKY_NOTES: "Sticky Notes",
        REMINDERS: "Reminders",

        //Plan of Care
        POC_SUMMARY: "Plan of Care Summary",
        PLAN_NAME: "Plan Name",
        STATUS_DATE: "Status Date/Time",
        LAST_EVALUATION: "Last Evaluation",
        DOCUMENTED_VARIANCE: "Documented Variance Reason",
        DOCUMENTED_ACTION: "Documented Variance Action",
        REASON: "Reason",
        ACTION: "Action",
        NOTE: "Note",
        ERROR_OCCURED: "Error Occurred",
        SIGN_FAILED: "Sign Failed",
        DISPLAY_MET: "Display Met Outcomes",
        BTN_HVR: "Click to document variance",
        SIGN: "Sign",
        CANCEL: "Cancel",
        OF: "of",
        MET: "met",
        NO_SUPPORT_CHARACTERS: "Characters ^ and $ are currently not supported.",

        //Ventilator Settings (RT)
        VENT_MODEL: "Ventilator/Machine Model",
        VENT_ID: "Ventilator/Machine ID",
        VENT_MODE: "Ventilator Mode",
        SETTINGS: "Settings",
        SETTINGS_DETAILS: "Settings Details",
        RESULT_DETAILS: "Result Details",
        RESULT_DT_TM: "Result Date/Time",
        DOCUMENTED_BY: "Documented By",
        RESP_RATE_TOTAL: "Respiratory Rate Total",
        MEASUREMENTS_ASSESSMENTS: "Measurements and Assessments",
        MEASUREMENTS_ASSESSMENTS_DETAILS: "Measurements and Assessments Details",
        VENT_ALARMS_ON: "Vent Alarms On and Functional",
        ALARM_SETTINGS: "Alarm Settings",
        ALARM_SETTINGS_DETAILS: "Alarm Settings Details",
        WEANING_PARAMETERS: "Weaning Parameters",
        WEANING_PARAMETERS_DETAILS: "Weaning Parameters Details",

        //Respiratory Assessments (RT)
        LATEST_BLOOD_GAS_ARTERIAL: "Latest Blood Gas Arterial",
        PREVIOUS_BLOOD_GAS_ARTERIAL: "Previous Blood Gas Arterial",
        ARTIFICIAL_AIRWAY: "Artificial Airway",
        ARTIFICIAL_AIRWAY_DETAILS: "Artificial Airway Details",
        O2_THERAPY_TITRATION: "O2 Therapy/Titration",
        O2_THERAPY_TITRATION_DETAILS: "O2 Therapy/Titration Details",
        BREATH_SOUNDS_ASSESSMENT: "Breath Sounds Assessment",
        BREATH_SOUNDS_ASSESSMENT_DETAILS: "Breath Sounds Assessment Details",
        RESPIRATORY_DESCRIPTION: "Respiratory Description",
        RESPIRATORY_DESCRIPTION_DETAILS: "Respiratory Description Details",
        NO_RES: "-- No Results found --",
        NO_PREV_RES: "-- No Previous results found --",

        //Respiratory Treatments (RT)
        AEROSOL_THERAPY: "Patient Response to Inhaled Medications",
        AEROSOL_THERAPY_DETAILS: "Patient Response to Inhaled Medications Details",
        INCENTIVE_SPIROMETRY: "Incentive Spirometry",
        INCENTIVE_SPIROMETRY_DETAILS: "Incentive Spirometry Details",
        COUGH_SUCTION: "Cough Suction",
        COUGH_SUCTION_DETAILS: "Cough Suction Details",
        CHEST_PHYSIOTHERAPY: "Bronchial Hygiene",
        CHEST_PHYSIOTHERAPY_DETAILS: "Bronchial Hygiene Details",

        //Timeline View (ICU and RT)
        MASTER_GRAPH: "Master Graph",
        RESP_MONITORING: "Respiratory Monitoring",
        ALL_DATA: "All Data",
        A_LINE: "A-line",
        CUFF: "Cuff",
        SBP: "SBP",
        DBP: "DBP",
        MAP: "MAP",
        BP_UNIT: "(mmHg)",
        CURRENT: "Current",
        RESET: "Reset Zoom",
        ACCORDING_TO_ZOOM: "&nbsp;(range depends on zoom)",
        NO_ZOOM_APPLIED: "No Zoom Applied",
        TABLE_GRAPH_DISCLAIMER: "The last documented values appear in the table for the indicated time frame.",
        JANUARY: ["Jan", "January"],
        FEBRUARY: ["Feb", "February"],
        MARCH: ["Mar", "March"],
        APRIL: ["Apr", "April"],
        MAY: ["May", "May"],
        JUNE: ["Jun", "June"],
        JULY: ["Jul", "July"],
        AUGUST: ["Aug", "August"],
        SEPTEMBER: ["Sep", "September"],
        OCTOBER: ["Oct", "October"],
        NOVEMBER: ["Nov", "November"],
        DECEMBER: ["Dec", "December"],

        //patient information.
        RFV: "Reason For Visit",
        ROOM_BED: "Room-Bed",
        ADMIT_DIAG: "Admitting Diagnosis",
        ADMIT_PHYS: "Admitting Physician",
        PRIM_PHYS: "Primary Physician",
        ATTEND_PHYS: "Attending Physician",
        EMER_CONTACT: "Emergency Contacts",
        EMER_NUMBER: "Emergency #",
        CHIEF_COMPLAINT: "Chief Complaint",
        LAST_VISIT: "Last Visit",
        MODE_OF_ARRVAL: "Mode of Arrival",
        LAST: "Last",
        VISIT: "Visit",
        CONTACTS: "Contacts",
        TARGETED_DISCHARGE_DATE: "Targeted Discharge Date",
        LAST_VISIT: "Last Visit",

        //immunizations
        IMMUNIZATIONS: "Immunization",
        PRODUCT: "Product",
        ADMIN_DATE: "Admin Date",
        MANUFACTURER: "Manufacturer",
        LOT: "Lot",
        EXP_DATE: "Expiration Date",
        ADMIN_NOTES: "Admin Notes",
        IMMUNIZATIONS_DETAILS: "Immunization Details",

        //Meds Recon
        START: "Start",
        STOP: "Stop",
        SIGNATURE_LINE: "Signature Line",
        ORDERING_PHYSICIAN: "Ordering Physician",
        NEW: "New",
        CONTINUE: "Continue",
        NO_LONGER_TAKING: "No longer taking",
        CONTINUE_WITH_CHANGES: "Continue with changes",
        CONTACT_PHYSICIAN: "Contact physician prior to taking",
        //Visits 
        FUTURE: "Future",
        VISIT_DETAILS: "Visit Details",

        DISCHARGE_PROCESS: "Discharge Process",
        CLICK_TO_GO_TO_DISCHARGE_PROCESS: "Click to go to Discharge Process",

        // New Order Entry
        MEDS: "Meds",
        LABS: "Labs",
        IMAGING: "Imaging",
        BILLING: "Billing",
        OTHER: "Other",
        ORDER_FAVORITE: "Order Favorite",
        ORDER_NAME: "Order Name",
        ORDER_DISPLAY_LINE: "Order Display Line",
        ORDER_PARAMETERS: "Order Parameters",
        NO_MEDS_FAVORITES: "No Meds Favorites Found",
        NO_LABS_FAVORITES: "No Labs Favorites Found",
        NO_IMAGING_FAVORITES: "No Imaging Favorites Found",
        NO_BILLING_FAVORITES: "No Billing Favorites Found",
        NO_OTHER_FAVORITES: "No Other Favorites Found",
        ORDERS_FOR_SIGNATURE: "Orders for Signature",
        NO_ORDERS_FOR_SIGNATURE: "No Orders for Signature",
        SEARCH_MODE: "Search Mode",
        SELECT: "Select",
        SUBMIT_FOR_SIGNATURE: "Submit for Signature",

        // Care Management Strings
        RCM_ACTUAL_DISCHARGE_DISPOSITION: "Actual Discharge Disposition",
        RCM_ADD_ADDENDUM: "Add Addendum",
        RCM_ADDENDUM: "Addendum",
        RCM_ADDENDUM_BY: "Addendum by:",
        RCM_ADDITIONAL_NOTES: "Additional Notes",
        RCM_ADDITIONAL_REVIEWER_NOTES: "Additional Reviewer Notes",
        RCM_ADM_MIM: "Adm Mim",
        RCM_ADMIT_TO_BED_DT: "Admit To Bed DT",
        RCM_ADMITTING_DX: "Admitting DX",
        RCM_ADMITTING_DX_DESC: "Admitting DX Desc",
        RCM_ADMIT_DATE: "Adm Date",
        RCM_ADMIT_SOURCE: "Admit Source",
        RCM_ADVANCE_DIR_COMPL: "Advance Dir Compl",
        RCM_ADVANCE_DIR_ON_FILE: "Advance Dir On File",

        RCM_AGE: "Age",
        RCM_ALTERNATE_DRG: "Alternate DRG",
        RCM_ATTENDING_PHYSICIAN: "Attending Physician",
        RCM_AVOIDABLE_DAYS: "Avoidable Days",
        RCM_BED: "Bed",
        RCM_CANCEL: "Cancel",
        RCM_CANCEL_MESSAGE: "Are you sure you want to cancel?  All changes will be lost.",
        RCM_CARE_GUIDELINE: "Care Guideline",
        RCM_CARE_MANAGEMENT: "Care Management",
        RCM_CLINICAL_REVIEW: "Clinical Review",
        RCM_CLINICAL_REVIEW_ENTRY: "Clinical Review Entry",
        RCM_CLINICAL_REVIEW_SUMMARY: "Clinical Review Summary",
        RCM_COLON: ":",
        RCM_COMPLETE: "Complete",
        RCM_CONTINUED_STAY: "Continued Stay",
        RCM_CRITERIA_MET: "Criteria Met",
        RCM_CURRENT_ENCOUNTER: "Current encounter",
        RCM_DATE: "Date",
        RCM_DATEPICKER_TEXT: "Choose a Date",
        RCM_DAY_REVIEWED: "Day Reviewed",
        RCM_DELETE: "Delete Clinical Review",
        RCM_DELETE_FAILED: "Delete Failed",
        RCM_DELETE_FAILED_MESSAGE: "The selected clinical review has been changed by another user since opening.  The clinical review cannot be deleted.",
        RCM_DELETE_MESSAGE: "Are you sure you want to delete the selected clinical review?",
        RCM_DELETE_REVIEW: "Delete Review",
        RCM_DENIED_DAYS: "Denied Days",
        RCM_DISCHARGE_ASSESSMENT_INFO: "Discharge Assessment Information",
        RCM_DISCHARGE_BARRIERS: "Discharge Barriers",
        RCM_DISCHARGE_DATE: "Discharge Date",
        RCM_DISCHARGE_DISPOSITION: "Discharge Disposition",
        RCM_DISCHARGE_FACILITY: "Discharge Facility",
        RCM_DISCHARGE_NEXT_ASSESSMENT_DT: "Discharge Next Assessment DT",
        RCM_DISCHARGE_OF_SERVICES: "Discharge of Services",
        RCM_DISCHARGE_PENDING: "Discharge Pending",
        RCM_DISCHARGE_SCREEN: "Discharge Screen",
        RCM_DISCHARGE_SCREENING: "Discharge Screening",
        RCM_DISCHARGE_SLOT: "Discharge Slot",
        RCM_DISPLAY: "Display",
        RCM_DNR: "DNR",
        RCM_DOB: "DOB",
        RCM_DONE: "Done",
        RCM_DRG_DESC: "DRG Desc",
        RCM_ELOS: "ELOS",
        RCM_ENCOUNTER_TYPE: "Encounter Type",
        RCM_ESTIMATED_DISCHARGE_DATE: "Estimated Discharge Date",
        RCM_FACILITY: "Facility",
        RCM_FAX_REVIEWS: "Fax Reviews",
        RCM_FC: "F/C",
        RCM_FIN: "FIN",
        RCM_FINAL: "Final",
        RCM_FINAL_AND_NEXT: "Final & Next",
        RCM_FINAL_DRG: "Final DRG",
        RCM_FINAL_DX: "Final DX",
        RCM_FINAL_PRIMARY_DX: "Final Primary DX",
        RCM_FINANCIAL_CLASS: "Financial Class",
        RCM_INCLUDE_CLOSED_UM_REVIEWS: "Include Closed UM Reviews",
        RCM_INTENSITY_OF_SERVICES: "Intensity of Services",
        RCM_LAST_ASSESSMENT_DATE: "Last Assessment Date",
        RCM_LAST_REVIEW_DATE: "Last Review Date",
        RCM_LEVEL_OF_SERVICE_SUBTYPE: "Level Of Service Subtype",
        RCM_LOS: "LOS",
        RCM_LOS_ELOS: "LOS / ELOS:",
        RCM_MARK_AS_FINAL: "Mark as Final",
        RCM_MED_SERVICE: "Med Service",
        RCM_MET: "Met",
        RCM_MODIFY: "Modify",
        RCM_MRN: "MRN",
        RCM_MY_RELATIONSHIP: "My Relationship",
        RCM_NAME: "Name",
        RCM_NEXT_CLINICAL_REVIEW: "Next clinical review due:",
        RCM_NEXT_CLINICAL_REVIEW_DATE: "Next Clinical Review Date",
        RCM_NEXT_CL_REVIEW: "Next CL Review",
        RCM_NEXT_REVIEW_NEEDED: "Next Review Needed",
        RCM_NEXT_SECTION: "Next Section",
        RCM_NO: "No",
        RCM_NOMENCLATUREID: "Nomenclature Id:",
        RCM_NOT_MET: "Not Met",
        RCM_OBS_END_DTTM: "OBS End DT/TM",
        RCM_OBS_START_DTTM: "OBS Start DT/TM",
        RCM_OK: "OK",
        RCM_OPEN_CLINICAL_REVIEW: "Open Clinical Review",
        RCM_OUTCOME: "Outcome",
        RCM_PATIENT_LIST: "Patient List",
        RCM_PAYER: "Payer",
        RCM_PENDING: "Pending",
        RCM_PLANNED_DISCHARGE_DATE: "Planned Discharge Date",
        RCM_PLANNED_DISCHARGE_DISPOSITION: "Planned Discharge Disposition",
        RCM_PREVIOUS_ADMISSION_INFO: "Previous Admission Info",
        RCM_PRIMARY_DX: "Primary Dx",
        RCM_PRIMARY_UR_NURSE: "Primary UR Nurse",
        RCM_REASON_FOR_REFERRAL: "Reason for Referral",
        RCM_REVIEW: "Review",
        RCM_REVIEW_CRITERIA: "Review Criteria",
        RCM_REVIEW_DATE: "Review Date",
        RCM_REVIEW_DUE: "Review Due",
        RCM_REVIEW_OUTCOME: "Review Outcome",
        RCM_REVIW_TYPE: "Review Type",
        RCM_REVIWED_BY: "Reviewed By:",
        RCM_REVIEWER: "Reviewer",
        RCM_ROOM: "Room",
        RCM_SAVE: "Save",
        RCM_SAVE_AND_NEW: "Save & New",
        RCM_SAVE_FAILED: "Save Failed",
        RCM_SAVE_FAILED_MESSAGE: "The selected clinical review has been changed by another user since opening.  Your clinical review changes cannot be updated.",
        RCM_SECONDARY_REVIEW: "Secondary Review",
        RCM_SECONDARY_REVIEW_NEEDED: "Secondary Review Needed",
        RCM_SEVERITY_OF_ILLNESS: "Severity Of Illness",
        RCM_SOURCE_IDENTIFIER: "Source Identifier:",
        RCM_SR_DATE: "SR Date",
        RCM_SR_STATUS: "SR Status",
        RCM_SSN: "SSN",
        RCM_STATUS: "Status",
        RCM_TYPE: "Type",
        RCM_UM_INFO: "UM Information",
        RCM_UM_STATUS: "UM Status",
        RCM_UNIT: "Unit",
        RCM_UNIT_DISCHARGE_FROM: "Unit Discharge From",
        RCM_UTILIZATION_MANAGEMENT: "Utilization Management",
        RCM_VISIT_INFO: "Visit Information",
        RCM_WORKING_DRG: "Working DRG",
        RCM_WORKING_DRG_DESC: "Working DRG Desc",
        RCM_YES: "Yes",

        // Discharge Readiness
        DC_NOT_STARTED: "Not Started",
        DC_IN_PROGRESS: "In Progress",
        DC_COMPLETE: "Complete",
        DC_REVIEWSIGN: "Review and Sign",

        //Follow Up
        FU_NAME: "Name:",
        FU_ADDRESS: "Address:",

        //Patient Education
        PE_INSTRUCTION: "Instruction:",
        PE_DATE: "Date:",
        PE_PROVIDER: "Provider:",

        //Quality Measures
        QM_COMPLETE: "Complete",
        QM_INCOMPLETE: "Incomplete",
        QM_CONDITION: "Condition:",


        //InjectionInfusionCalculator
        II_INFUSION_INJECTION: "Infusion and Injection",
        II_NUMBER: "No.",
        II_TYPE: "Type",
        II_START_ADMIN: "Start/Admin",
        II_STOP: "Stop",
        II_DURATION: "Duration (minutes)",
        II_MEDICATION: "Medication",
        II_NO_INJECTION_INFUSION: "No Injections/Infusions Entered",

        //Observations 
        OBS_RFT: "Reason For Visit",
        OBS_PATIENT_IN_OBSERVATION: "Patient in Observation",
        OBS_YES: "Yes",
        OBS_NO: "No",
        OBS_PAYER_CLASS: "Payer Class",
        OBS_MEDICARE: "Medicare",
        OBS_OTHER: "Other",
        OBS_OBSERVATION_START: "Start Date/Time",
        OBS_SELECT_DATE: "Click to select date **/**/****",
        OBS_OBSERVATION_STOP: "Stop Date/Time",
        OBS_HIST_RETRIEVED: "History retrieved",
        //OBS_YES,OBS_NO
        OBS_EXAM_GIVEN: "Exam given",
        //OBS_YES,OBS_NO
        OBS_MED_DECISION_COMPLEXITY: "Medical decision complexity",
        OBS_NONE: "None",
        OBS_LOW: "Low",
        OBS_MEDIUM: "Medium",
        OBS_HIGH: "High",
        OBS_OBSERVATION_VISIT_LEVEL: "Visit Level",
        //OBS_LOW, OBS_MEDIUM, OBS_HIGH
        OBS_DISCHARGE: "Discharge",
        OBS_NO_CHARGE: "No Charge",

        //Summary
        II_SUMMARY_OF_CHARGES: "Summary of Charges"
    };
} ();