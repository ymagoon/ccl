/**
 * Locale file for the formatting utilized across all English locales.
 * Locales supported:
 * German - Germany (de-de)
 * 
 * Locales available for support:
 * German - Austria (de-at)
 * German - Liechtenstein (de-li)
 * German - Luxembourg (de-lu)
 * German - Switzerland (de-ch)
 */
if (typeof MPAGE_LC == "undefined") 
    var MPAGE_LC = {};

MPAGE_LC.de_DE = {
	"decimal_point"      : ",",
	"thousands_sep"      : ".",
	"grouping"           : "3",
    
    // Some common date/time format strings (formats for usage with date.format.js)
    time24hr: "HH:MM:ss",
    time24hrnosec: "HH:MM",
    shortdate2yr: "d.m.yy",
    fulldate2yr: "dd.mm.yy",
    fulldate4yr: "dd.mm.yyyy",
    fullmonth4yrnodate: "mm.yyyy",
    full4yr: "yyyy",
    fulldatetime2yr: "dd.mm.yy HH:MM",
    fulldatetime4yr: "dd.mm.yyyy HH:MM",
    fulldatetimenoyr: "dd.mm h:MM TT"
};
﻿
if (typeof i18n == "undefined") //do not internationalize this line
    var i18n = {};

/**
 * NOTE: DO NOT ADD ADDITIONAL ITEMS TO THIS OBJECT
 * @deprecated
 */
i18n = {
    REQUEST: "Anfrage",
    //Return Status:
    NO_RESULTS_FOUND: "Keine Ergebnisse gefunden",
    NO_DATA: "Keine Daten",
    
    //Error Status:
    ERROR_RETREIVING_DATA: "Fehler beim Suchen der Ergebnisse",
    ERROR_OPERATION: "Operation",
    ERROR_OPERATION_STATUS: "Operationsstatus",
    ERROR_TARGET_OBJECT: "Zielobjekts",
    ERROR_TARGET_OBJECT_VALUE: "Wert des Zielobjekts",
    //Customization
    CLEAR_PREFERENCES: "Voreinstellungen entfernen",
    SAVE_PREFERENCES: "Voreinstellungen speichern",
    CUSTOMIZE: "Anpassen",
    USER_CUSTOMIZATION: "Benutzerspezifische Anpassung",
    SAVE_PREF_SUCCESS: "Die Voreinstellungen wurden erfolgreich gespeichert.",
    CLEAR_PREF_SUCCESS: "Die Voreinstellungen wurden erfolgreich entfernt.",
    
    //Commons
    GO_TO_TAB: "Gehe zu Register {0}",
    ESTIMATED_DISCHARGE_DATE: "Geschätztes Entlassungsdatum",
    LOADING_DATA: "Ladevorgang",
    RENDERING_DATA: "Rendern",
    NAME: "Name",
    DETAILS: "Details",
    ONSET_DATE: "Beginndatum",
    COMMENTS: "Kommentare",
    DATE_TIME: "Datum/Zeit",
    ANNOTATED_DISPLAY: "Name für Anzeige mit Annotationen",
    ANNOTATED_DISPLAY_NAME: "Anzeige mit Annotationen",
    ARRIVAL: "Ankunft",
    CODE: "Kode",
    LATEST: "Letzte/r/s",
    WITHIN: "innerhalb von",
    PREVIOUS: "Vorherige",
    SINCE: "Seit",
    DISCLAIMER: "Diese Ansicht umfasst nicht alle Daten dieses Aufenthalts.",
    USER_CUST_DISCLAIMER: "Bitte berücksichtigen Sie die Bildschirmauflösung, bevor Sie eine Ansicht mit drei Spalten auswählen.",
    RESULT: "Ergebnis",
    STATUS: "Status",
    DATE: "Datum",
    ACTIVE: "Aktiv",
    ENTERED: "Eingegeben",
    FLAGGED: "Gekennzeichnet",
    DISCONTINUED: "Abgesetzt",
    ADMIN_LAST_N_HOURS: "Innerhalb der letzten {0} Stunden verabreicht",
    LAST_N_HOURS: "Letzte {0} Stunden",
    LAST_N_DAYS: "Letzte {0} Tage",
    LAST_N_MONTHS: "Letzte {0} Monate",
    LAST_N_YEARS: "Letzte {0} Jahre",
    LAST_N_WEEKS: "Letzte{0} Wochen",
    NEXT_N_HOURS: "In den nächsten {0} Stunden",
    WITHIN_MINS: "{0} Minuten",
    WITHIN_HOURS: "{0} Stunden",
    WITHIN_DAYS: "{0} Tage",
    WITHIN_WEEKS: "{0} Wochen",
    WITHIN_MONTHS: "{0} Monate",
    WITHIN_YEARS: "{0} Jahre",
    SELECTED_VISIT: "Ausgewählter Aufenthalt",
    All_VISITS: "Alle Aufenthalte",
    SELECTED_N_VISIT: "{0} für den ausgewählten Aufenthalt",
    ALL_N_VISITS: "{0} für alle Aufenthalte",
    PRIMARY_RESULTS: "Primäre Ergebnisse",
    SECONDARY_RESULTS: "Sekundäre Ergebnisse",
    FROM: "Von",
    COLLECTED: "Abgenommen",
    DONE: "Erledigt",
    NOT_DONE: "Nicht erledigt",
    HELP: "Hilfe",
    ADD: "Hinzufügen",
    TEXT: "Text",
    //Errors
    JS_ERROR: "JavaScript-Fehler",
    DISCERN_ERROR: "Discern-Fehler",
    MESSAGE: "Nachricht",
    NUMBER: "Anzahl",
    DESCRIPTION: "Beschreibung",
    //expand collapse
    SHOW_SECTION: "Erweitern",
    HIDE_SECTION: "Minimieren",
    EXPAND_ALL: "Alle erweitern",
    COLLAPSE_ALL: "Alle minimieren",
    LOCATION: "Standort",
    //Demographic	
    DOB: "Geburtsdatum",
    SEX: "Geschlecht",
    AGE: "Alter",
    MRN: "Patientennummer",
    FIN: "Fallnummer",
    VISIT_REASON: "Aufnahmegrund",
    ISOLATION: "Isolierung",
    LAST_DOC_DT_TM: "Zuletzt dokumentiert am/um",
    LAST_DOC_BY: "Zuletzt dokumentiert von",
    
    
    //Allergy
    ALLERGY: "Allergie",
    ALLERGY_NAME: "Allergie - Name",
    REACTION: "Reaktion",
    SEVERITY: "Schweregrad",
    
    //Diagnoses
    DIAGNOSES: "Diagnose",
    DIAGNOSES_NAME: "Diagnose - Name",
    DIAGNOSES_DATE: "Diagnose - Datum",
    
    //Problems
    PROBLEM: "Beschwerde",
    PROBLEMS: "Beschwerden",
    PROBLEMS_NAME: "Beschwerden - Name",
    PROBLEMS_DETAILS: "Beschwerden - Details",
    RESPONSIBLE_PROVIDER_NAME: "Zuständiger klinischer Mitarbeiter",
    
    //intake and output
    TOTAL_FL_INTAKE: "Gesamte Flüssigkeitseinfuhr",
    TOTAL_FL_OUTPUT: "Gesamte Flüssigkeitsausfuhr",
    TOTAL_FL_BAL: "Gesamter Flüssigkeitshaushalt",
    IO: "Einfuhr und Ausfuhr",
    LAST_3_DAYS: "Letzte 3 Tage des ausgewählten Aufenthalts",
    NOTE_INDICATOR: "* Gibt einen Tag ohne 24-Stunden-Messzeitraum an.",
    
    //Growth Chart
    PERCENTILE: "Perzentile",
    ZSCORE: "Z-Wert",
    
    //Vitals & Labs
    VITALS_TABLE: "Vitalzeichentabelle",
    BLOOD_PRESSURE: "Blutdruck",
    OTHER_RESULTS: "Weitere Ergebnisse",
    TEMPERATURE: "Temperatur",
    DEGC: "Grad Celsius",
    DEGF: "Grad Fahrenheit",
    HEART_RATE: "Herzfrequenz",
    MIN: "Min.",
    MAX: "Max.",
    NORMAL_RANGE: "Normalbereich",
    CRITICAL_RANGE: "Kritischer Bereich",
    NORMAL_LOW: "Untergrenze Normalbereich",
    NORMAL_HIGH: "Obergrenze Normalbereich",
    CRITICAL_LOW: "Kritischer Minimalwert",
    CRITICAL_HIGH: "Kritischer Maximalwert",
    HI_IND: "Hoch",
    LOW_IND: "Niedrig",
    CRIT_IND: "Kritisch",
    UNIT_OF_MEASURE: "Maßeinheit",
    TWO_DAY_MAX: "Höchstwert innerhalb 48 Stunden",
    //graph
    CLOSE_X: "Schließen X",
    LABRAD: "Labor/Radiologie",
    
    //Restraints
    RESTRAINTS: "Fixiergurte",
    RESTRAINT: "Fixiergurte",
    RESTRAINT_APPLIED: "Fixiergurt angelegt",
    RESTRAINT_TYPE: "Fixierungstyp",
    RESTRAINT_LOCATION: "Körperstelle für Fixiergut",
    RESTRAINT_DEATILS: "Fixiergurt - Details",
    RESTRAINT_REASON: "Grund für Fixierung",
    ORDER_TYPE: "Anforderungstyp",
    ORDER_DATE_TIME: "Anforderungsdatum/-zeit",
    EXPIRATION_DATE_TIME: "Ablaufdatum/-zeit",
    
    //Documents
    DOCUMENTATION_DETAILS: "Dokumentation - Details",
    NOTE_NAME: "PowerNote - Name",
    SUBJECT: "Betreff",
    NOTE_TYPE: "PowerNote - Typ",
    AUTHOR: "Verfasser",
    DOCUMENT_FAVS: "Keine Favoriten gefunden",
    DOCUMENTS: "Dokumente",
    //Overdue Tasks
    OVERDUE_TASKS: "Überfällige Aufgaben",
    
    //measurements and weights
    MEASUREMENT_DETAILS: "Messung - Details",
    
    //Patient Assessment
    PATIENT_ASSESSMENT: "Patientenbewertung",
    PSYCHOSOCIAL_FACTORS: "Psychosoziale Faktoren",
    RESPIRATORY: "Respiratorisch",
    CARDIO: "Kardiovaskulär",
    PAIN: "Schmerzen",
    NEURO: "Neurologisch",
    GI: "Gastrointestinal",
    GU: "Urogenital",
    MUSCULOSKELETAL: "Muskuloskeletal",
    INTEGUMENTARY: "Integumentäres System",
    GENERAL_ASSESSMENT: "Allgemeine Einschätzung",
    
    //Patient Family Education
    PATIENT_FAMILY_EDUCATION_DETAILS: "Aufklärung der Familie des Patienten - Details",
    PATIENT_FAMILY_EDUCATION: "Aufklärung der Familie des Patienten",
    
    //Diagnostics
    DIAGNOSTIC: "Diagnostik",
    DIAGNOSTIC_DETAILS: "Diagnostik - Details",
    STUDY: "Studie",
    EKG: "EKG",
    CHEST: "Thorax",
    OTHER_DIAGNOSTICS: "Weitere Diagnostik",
    CHEST_ABD_XR: "Röntgen Thorax/Abdomen",
    
    //Respiratory
    MODEL: "Modell",
    DATE_TIME_INITIATED: "Initiierungdatum/-zeit",
    VENTILATOR_MODE: "Beatmungsmodus",
    SET_TIDAL_VOLUME: "Hubvolumen einrichten",
    PEEP: "PEEP",
    FIO2: "FIO2",
    SET_RATE: "Flussgeschwindigkeit einrichten",
    FLOW_RATE: "Flussgeschwindigkeit",
    TOTAL_RESPIRATORY_RATE: "Atemfrequenz, gesamt",
    TOTAL_MINUTE_VOLUME: "Gesamtvolumen pro Minute",
    INSPIRATORY_TIME_SET: "Einatmungszeit einrichten",
    INSPIRATORY_TIME_DELIVERED: "Einatmungszeit %",
    RESPIRATORY_DISCLAIMER: "Die angezeigten Ergebnisse für arterielle Blutgase müssen mit der Sauerstoffquelle für FIO2 und/oder der Sauerstoffflussrate zum Patienten zur Zeit der Probenabnahme synchronisiert werden.",
    UNKNOWN: "Unbekannt",
    BE: "B.E.",
    PREVIOUS_ABG_RESULTS: "Vorherige ABG-Ergebnisse",
    LATEST_ABG_RESULTS: "Letzte ABG-Ergebnisse",
    VENTILATOR_INFO: "Beatmung",
    NO_RES_LAST_24_HRS: "-- Keine Ergebnisse innerhalb der letzten 24 Stunden gefunden --",
    NO_PREV_RES_LAST_24_HRS: "-- Keine vorherigen Ergebnisse innerhalb der letzten 24 Stunden gefunden --",
    NO_RES_LAST_LOOKBACK_HRS: "--Keine Ergebnisse in Suchbereich gefunden--",
    
    //Blood Info
    TRANSFUSIONS: "Transfusionen",
    BLOOD_TYPE_RH: "Blutgruppe/Rh",
    MOTHER: "Mutter",
    BABY: "Neugeborenes",
    PHOTOTHERAPY: "Phototherapie",
    PHOTOTHERAPY_RESULT: "Ergebnis",
    TRANSFUSION_RESULT_VAL: "Ergebniswert",
    TRANSFUSION_DATE: "Transfusionsdatum",
    TRANSFUSION_EVENT_CD: "Transfusion-Eventcode",
    
    
    //Medications
    MEDICATIONS: "Medikationen",
    MED_DETAIL: "Medikationen - Details",
    MED_NAME: "Medikation",
    REQUESTED_START: "Angefordertes Beginndatum",
    ORIG_DT_TM: "Ursprüngliches Anforderungsdatum/-zeit",
    LAST_DOSE_DT_TM: "Letzte Dosis",
    NEXT_DOSE_DT_TM: "Nächste Dosis",
    START_DT_TM: "Beginndatum/-zeit",
    STOP_DT_TM: "Enddatum/-zeit",
    STOP_REASON: "Beendigungsgrund",
    STATUS: "Status",
    LAST_GIVEN: "Zuletzt verabreicht",
    NEXT_DOSE: "Nächste Dosis",
    SCHEDULED: "Geplant",
    CONTINOUS: "Dauerinfusion",
    SUSPENDED: "Unterbrochen",
    PRN: "Bedarfsmedikation",
    UNSCHEDULED: "Nicht geplant",
    RESPONSIBLE_PROVIDER: "Anforderung eingegeben von",
    COMPLIANCE: "Einhaltung",
    SCHEDULED_INH: "Geplante Inhalationen",
    PRN_ALL: "Bedarfsmedikation, alle",
    PRN_48: "Bedarfsmedikation, in letzten 48 Stunden verabreicht",
    INHALED: "Inhalator",
    NEBULIZED: "Vernebler",
    INHALALATION: "Inhalation",
    HI_FLOW_NEB: "Vernebler mit schneller Flussgeschwindigkeit",
    ADMINISTERED: "Verabreicht",
    PRN_UNSCHEDULED: "Bedarfsmedikation/Nicht geplant verfügbar",
    //Orders
    ORDER_DETAILS: "Anforderung - Details",
    ORDER_NAME: "Anforderung",
    ORDER_DATE: "Anforderungsdatum/-zeit",
    ORDER_STATUS: "Status",
    ORDER_PHYS: "Angefordert von",
    DISCONTINUED: "Abgesetzt",
    ORDERED: "Angefordert",
    CLINICAL_DISPLAY: "Klinische Anzeige",
    ORDERS: "Anforderungen",
    
    //Weights and Measurements
    MEASUREMENT_DETAILS: "Messung - Details",
    CHANGE: "Ändern",
    ADMISSION: "Aufnahme",
    
    //Patient Information
    RFV: "Grund für Aufenthalt",
    ROOM_BED: "Zimmer/Bett",
    ADMIT_DIAG: "Aufnahmediagnose",
    ADMIT_DATE: "Aufnahmedatum",
    PRIM_PHYS: "Hausarzt",
    ATTEND_PHYS: "Behandelnder Arzt",
    EMER_CONTACT: "Ansprechpartner für Notfälle",
    EMER_NUMBER: "Telefonnummer für Notfälle",
    CODE_STATUS: "Kodestatus",
    LAST_VISIT: "Letzter Aufenthalt",
    LAST: "Letzte(r)",
    VISIT: "Aufenthalt",
    CONTACTS: "Ansprechpartner",
    
    //Micro
    SOURCE_BODY_SITE: "Herkunft/Körperstelle",
    COLLECTED_DATE_TIME: "Abnahmedatum/ -zeit",
    SUSCEPTIBILITY: "Resistenztest",
    ASSOCIATED_MICRO_REPORTS: "Zugewiesene Mikrobiologiebefunde",
    ASSOCIATED_MICRO_STAIN_REPORTS: "Zugewiesene Mikrobiologie-Anfärbungsbefunde",
    GROWTH_IND: "Wachstumsindikator",
    SUSC_HEADER: "SC",
    POS: "Positiv",
    NEG: "Negativ",
    GROWTH: "Wachstum",
    NO_GROWTH: "Kein Wachstum",
    NORMALITY: "Normalzustand",
    SOURCE_SITE: "Herkunft/Körperstelle",
    SOURCE: "Herkunft",
    COLLECTED_WITHIN: "Abgenommen innerhalb",
    MICRO: "Mikrobiologie",
    
    //Patient Background
    ADVANCE_DIRECTIVE: "Vorausverfügung",
    ISOLATION: "Isolierung",
    ACTIVITY_ORDER: "Aktivitätsanforderung",
    FALL_RISK_SCORE: "Fallrisikoskala",
    SEIZURE_PRECAUTIONS: "Präventionsmaßnahmen für Anfall",
    DIET: "Kost",
    PAIN_SCORE: "Schmerzskala",
    GESTATIONAL_AGE: "Gestationsalter",
    PARA_GRAVIDA: "Para Gravida",
    TRANSPLANT_DATE: "Transplantationsdatum",
    CODE_STATUS: "Kodestatus",
    SERVICE: "Fachabteilung",
    ATTENDING_PHYSICIAN: "Behandelnder Arzt",
    PARENT_PART_TYPE: "Beziehung des gesetzlichen Vormunds",
    TARGET_DISCH_DT_TM: "Geplantes Entlassungsdatum/-zeit",
    CARE_LEVEL: "Pflegestufe",
    RESUSITATION_STATUS: "Reanimationseinwilligung",
    ASSISTIVE_DEVICES: "Hilfsgeräte",
    MULTIPLE: "Mehrfach",
    DEVICE_DETAILS: "Geräte - Details",
    
    //Lines Tubes Drains,
    LINES: "Zugänge",
    TUBES_DRAINS: "Drainagen",
    LAST_DOC_DT_TM: "Zuletzt dokumentiert am/um",
    INIT_DOC_DT_TM: "Ursprünglich dokumentiert am/um",
    LAST_DOC: "Zuletzt dokumentiert",
    LAST_DOC_WITHIN: "Zuletzt dokumentiert innerhalb",
    
    //EVENTS
    EVENTS: "Events",
    
    //Timeline Misc
    ACTIVITY_LIST: "Aktivitätsliste",
    INCOMPLETE_ORDERS: "Unvollständige Anforderungen",
    RESULTS_RETURNED: "Zurückgelieferte Ergebnisse",
    COMPLETE_ORDERS: "Abgeschlossene Anforderungen",
    MEDS_ADMINISTERED: "Verabreichte Medikationen",
    CRITICAL_RESULTS: "Pathologische Ergebnisse",
    FIRST_24HRS_ED_VISIT: "Ergebnisse umfassen die ersten 24 Stunden in der Notaufnahme",
    RESULTS_SINCE_ADMITTED: "Ergebnisse seit Aufnahme",
    HIDE_LEGEND: "Legende ausblenden",
    SHOW_LEGEND: "Legende anzeigen",
    COMPLETED: "Abgeschlossen",
    EXAM: "Untersuchung",
    ADMINISTERED: "Verabreicht",
    NO_RESULTS: "Keine Ergebnisse",
    LAST_PARTICIPATION: "Letzte Teilnahme",
    //Nursing Communication MPage specific strings
    SITUATION_BACKGROUND: "Familienverhältnisse",
    ASSESSMENT: "Bewertung",
    RECOMMENDATION: "Empfehlung",
    NURSING_COMMUNICATION: "Pflegekommunikation",
    
    //MPage title strings
    ED_SUMMARY: "Übersicht für Notaufnahme", //ED Summary v2
    ICU_SUMMARY: "Übersicht für Intensivstation", //ICU Summary
    INPATIENT_SUMMARY: "Übersicht für stationäre Patienten", //Inpatient Summary v2
    DISCHARGE_SUMMARY: "Übersicht für Entlassungen",
    
    
    //Oxygenation and Ventilation Component
    O2_FLOW_RATE: "Sauerstofffluss",
    PREVIOUS_BLOOD_GAS_ARTERIAL_RESULTS: "Ergebnisse aus vorheriger arterieller Blutgasanalyse",
    LATEST_BLOOD_GAS_ARTERIAL_RESULTS: "Ergebnisse aus letzter arterieller Blutgasanalyse",
    
    
    //Blood Group Component
    TRANSFUSIONS: "Transfusionen",
    DATE_PERFORMED: "Durchgeführt am",
    
    //Care Manager UM Page Name
    CAREMANAGERUMPAGE: "Übersicht zu Utilization Management",
    
    //Dicharge Care Management Summary
    DISCHARGECAREMANAGEMENT: "Übersicht zur Pflege nach Entlassung",
    
    //Care Manager Discharge Planning
    CUR_DOC_PLAN_SCREEN: "Aktueller dokumentierter Plan bzw. Screening",
    PLANNED_DISCHARGE_DISP: "Zielzustand bei Entlassung",
    TRANSPORATION_ARRANGED: "Arrangierter Transport",
    LOCATION: "Standort",
    TRANSFER_OF_CARE_PACKET: "Übermittlung des Pflegepakets",
    MIM_SIGNED: "Dokument zu Patientenrechten bei Aufnahme unterschrieben",
    DISCHARGE_MIM_SIGNED: "Dokument zu Patientenrechten bei Entlassung ausgehändigt",
    DISCHARE_APPEALDELIVERED: "Anfechtung der Entlassung gesendet",
    DME_ANTICIPATED: "Voraussichtlich benötigte medizinische Hilfsmittel",
    DME_COORD: "Arrangierte medizinische Hilfsmittel",
    PLANNED_DISCHARGE_DT_TM: "Geplantes Entlassungsdatum",
    DC_PLANNING_TM_TRACKED: "Zeit für Entlassungsplanung verfolgt",
    DELAYS_TRACKED: "Verzögerungen verfolgt",
    DISCHARGE_PLANNER: "Entlassungsplanung",
    HOURS: "Stunden",
    MINS: "Minuten",
    DAYS: "Tage",
    PROFSKILLEDSERVICESANTICIPATED: "Voraussichtlich benötige Fachdienste",
    
    //Care Manager Insurance Strings
    PRIMARY: "Primär",
    SECONDARY: "Sekundär",
    TERTIARY: "Tertiär",
    
    AUTHORIZATION: "Autorisierung",
    TYPE: "Typ",
    STATUS: "Status",
    DELAYREASON: "Grund für Verzögerung",
    AUTH: "Autorisiert",
    AUTHDATES: "Autorisierungsdaten",
    NUMBEROFDAYS: "Anzahl an Tagen",
    AUTHCOMMENTS: "Autorisierungskommentare",
    
    BENEFITS: "Leistungen",
    DEDUCTIBLE: "Selbstbehalt",
    DEDUCTIBLE_MET: "Erreicht",
    REMAINING: "Verbleibende",
    COPAY: "Eigenbeteiligung",
    LIFETIMEMAX: "Maximum über Lebensdauer",
    LTRDAYSREMAINING: "Verbleibende Tage - Lebensversicherung",
    LTRDAILYDEDUCTABLE: "Täglicher Eigenanteil für Langzeitrehabilitation",
    COVEREDDAYSREMAINING: "Verbleibende abgedeckte Tage",
    COINSURANCEDAYSREMAINING: "Verbleibende Tage mit Zweitversicherung",
    //Care Manager Visit Information Strings
    FIN_NUM: "Fallnummer",
    ENCNTR_TYPE: "Falltyp",
    FIN_CLASS: "Buchungsklasse",
    
    ADMIT_INFO: "Aufnahmeinformation",
    REG_DT_TM: "Anmeldedatum/-zeit",
    ADMIT_TO_BED_DT: "Datum der Aufnahme mit Bettenzuweisung",
    ATTENDING_PHD: "Behandelnder Arzt",
    REASON_FOR_VISIT: "Aufnahmegrund",
    ADMIT_DX: "Aufnahmediagnose",
    ADMIT_SOURCE: "Aufnahmeherkunft",
    LOCATION: "Standort",
    
    DISCHARGE_INFORMATION: "Entlassungsinformationen",
    DISCHARGE_DATE: "Entlassungsdatum",
    DISCHARGE_DISPOSITION: "Entlassungszustand",
    DISCHARGE_LOCATION: "Entlassungsort",
    
    ENCOUNTERS: "Fälle",
    FINAL_DRG: "Endgültiger DRG",
    FINAL_DIAGNOSIS: "Endgültige Diagnose",
    ADMIT_DATE: "Aufnahmedatum",
    LOS: "Aufenthaltsdauer",
    LENGTH_OF_STAY: "Aufenthaltsdauer",
    KEY_PERSON_RELATIONSHIPS: "Schlüsselbeziehungen mit Personen",
    NO_KEY_PERSONS: "Keine Schlüsselpersonen gefunden",
    RELATIONSHIP_HEADER: "Beziehung",
    PERSON_NAME_HEADER: "Name der Person",
    
    ADMIT_DATE: "Aufnahmedatum",
    FINAL_DIAGNOSIS: "Endgültige Diagnose",
    
    //Home medication
    HOME_MEDICATION: "Heimmedikation",
    LAST_DOSE: "Letzte Dosis",
    PRESCRIBED: "Verschrieben",
    DOCUMENTED: "Dokumentiert",
    NO_KNOWN_HOME_MEDS: "Für diesen Patienten sind keine bekannten Heimmedikationen vorhanden.",
    UNABLE_TO_OBTAIN_MED_HIST: "Angaben zur Medikationshistorie können für den ausgewählten Aufenthalt nicht abgerufen werden.",
    
    //Procedure History
    PROCEDURE: "Prozedur",
    DISPLAY_AS: "Anzeigen als",
    PROCEDURE_DETAILS: "Prozedur - Details",
    PROCEDURE_DATE: "Prozedur - Datum",
    PROVIDER: "Klin. Mitarbeiter",
    SIG_LINE: "Unterschriftszeile",
    
    //Procedural Information
    MODIFIERS: "Modifikatoren",
    CASE_NUM: "OP-Fallnummer",
    ANESTHESIA_TYPE: "Anästhesietypen",
    SURGEON: "Operateur",
    SURGERY_START: "Beginn der OP",
    SURGERY_STOP: "Ende der OP",
    ANESTH_STOP: "Ende der Anästhesie",
    ANESTH_START: "Beginn der Anästhesie",
    SECONDARY_PROCEDURE: "Sekundäre Prozedur",
    PROCEDURE_NAME: "Prozedur - Name",
    SURGICAL_FREE_TEXT: "Freitext Chirurgie",
    
    //Social History
    SOCIAL_HISTORY_INFORMATION: "Sozialanamnese",
    SOCIAL_HISTORY_DETAILS: "Sozialanamnese - Details",
    CATEGORY: "Kategorie",
    LAST_UPDATED: "Zuletzt aktualisiert",
    LAST_UPDATED_BY: "Zuletzt aktualisiert von",
    
    
    //Pregnancy History
    PREGNANCY: "Schwangerschaft",
    BABY: "Neugeborenes",
    PREGNANCY_DETAILS: "Schwangerschaft - Details",
    LENGTH_OF_LABOR: "Dauer der Geburtswehen",
    DELIVERY_HOSPITAL: "Krankenhaus für Entbindung",
    CHILD_NAME: "Name des Kindes",
    FATHER_NAME: "Name des Vaters",
    
    //Family history
    CONDITION: "Krankheitsbild",
    MEMBERS: "Mitglieder",
    DECEASED: "Verstorben",
    
    //Past Medical History
    PAST_RESOLVED_DATE: "Auflösungsdatum",
    PAST_PROBLEM: "Beschwerde",
    
    
    //Notes and Reminders
    PRIORITY: "Priorität",
    SHOW_UP: "Erschienen",
    DUE: "Fällig",
    STICKY_NOTES: "Wichtige Notizen",
    REMINDERS: "Erinnerungen",
    
    //Plan of Care
    POC_SUMMARY: "Übersicht über geplante Pflege",
    PLAN_NAME: "Name des Plans",
    STATUS_DATE: "Statusdatum/-zeit",
    LAST_EVALUATION: "Letzte Auswertung",
    DOCUMENTED_VARIANCE: "Dokumentierte Grund für Abweichung",
    DOCUMENTED_ACTION: "Dokumentierte Aktion für Abweichung",
    REASON: "Grund",
    ACTION: "Aktion",
    NOTE: "Notiz",
    ERROR_OCCURED: "Es ist ein Fehler aufgetreten.",
    SIGN_FAILED: "Abzeichnen fehlgeschlagen",
    DISPLAY_MET: "Erreichte Ziele anzeigen",
    BTN_HVR: "Hier zur Dokumentation von Abweichungen klicken",
    SIGN: "Abzeichnen",
    CANCEL: "Abbrechen",
    OF: "von",
    MET: "erreicht",
    NO_SUPPORT_CHARACTERS: "Die Zeichen ^ und $ werden momentan nicht unterstützt.",
    
    //Ventilator Settings (RT)
    VENT_MODEL: "Beatmungsgerät - Modell",
    VENT_ID: "Beatmungsgerät - Kennung",
    VENT_MODE: "Beatmungsmodus",
    SETTINGS: "Einstellungen",
    SETTINGS_DETAILS: "Einstellungen - Details",
    RESULT_DETAILS: "Ergebnis - Details",
    RESULT_DT_TM: "Datum/Zeit des Ergebnisses",
    DOCUMENTED_BY: "Dokumentiert von",
    RESP_RATE_TOTAL: "Beatmungsrate, Gesamt",
    MEASUREMENTS_ASSESSMENTS: "Messungen und Bewertungen",
    MEASUREMENTS_ASSESSMENTS_DETAILS: "Messungen und Bewertungen - Details",
    VENT_ALARMS_ON: "Beatmungswarnungen an und funktionell",
    ALARM_SETTINGS: "Einstellungen für Warnungen",
    ALARM_SETTINGS_DETAILS: "Einstellungen für Warnungen - Details",
    WEANING_PARAMETERS: "Entwöhnungsparameter",
    WEANING_PARAMETERS_DETAILS: "Entwöhnungsparameter - Details",
    
    //Respiratory Assessments (RT)
    LATEST_BLOOD_GAS_ARTERIAL: "Letzte arterielle Blutgasanalyse",
    PREVIOUS_BLOOD_GAS_ARTERIAL: "Vorherige arterielle Blutgasanalyse",
    ARTIFICIAL_AIRWAY: "Künstliche Luftröhre",
    ARTIFICIAL_AIRWAY_DETAILS: "Künstliche Luftröhre - Details",
    O2_THERAPY_TITRATION: "O2-Therapie/Titration",
    O2_THERAPY_TITRATION_DETAILS: "O2-Therapie/Titration - Details",
    BREATH_SOUNDS_ASSESSMENT: "Bewertung der Atemgeräusche",
    BREATH_SOUNDS_ASSESSMENT_DETAILS: "Bewertung der Atemgeräusche - Details",
    RESPIRATORY_DESCRIPTION: "Beschreibung der Atmung",
    RESPIRATORY_DESCRIPTION_DETAILS: "Beschreibung der Atmung - Details",
    NO_RES: "-- Keine Ergebnisse gefunden --",
    NO_PREV_RES: "-- Keine vorherigen Ergebnisse gefunden --",
    
    //Respiratory Treatments (RT)
    AEROSOL_THERAPY: "Reaktion des Patienten auf inhalierte Medikationen",
    AEROSOL_THERAPY_DETAILS: "Reaktion des Patienten auf inhalierte Medikationen - Details",
    INCENTIVE_SPIROMETRY: "Reizspirometrie",
    INCENTIVE_SPIROMETRY_DETAILS: "Reizspirometrie - Details",
    COUGH_SUCTION: "Absaugen nach Husten",
    COUGH_SUCTION_DETAILS: "Absaugen nach Husten - Details",
    CHEST_PHYSIOTHERAPY: "Bronchialpflege",
    CHEST_PHYSIOTHERAPY_DETAILS: "Bronchialpflege - Details",
    
    //Timeline View (ICU and RT)
    MASTER_GRAPH: "Hauptgrafik",
    RESP_MONITORING: "Überwachung der Atmung",
    ALL_DATA: "Alle Daten",
    A_LINE: "Intraarterieller Katheter",
    CUFF: "Manschette",
    SBP: "Systolischer Blutdruck",
    DBP: "Diastolischer Blutdruck",
    MAP: "Mittlerer arterieller Blutdruck",
    BP_UNIT: "(mmHg)",
    CURRENT: "Aktuell",
    RESET: "Zoom zurücksetzen",
    ACCORDING_TO_ZOOM: "&nbsp;(Bereich abhängig vom Zoom)",
    NO_ZOOM_APPLIED: "Kein Zoom verwendet",
    TABLE_GRAPH_DISCLAIMER: "Die letzten dokumentierten Werte werden in der Tabelle des angegebenen Zeitrahmens angezeigt.",
    JANUARY: ["Jan.", "Januar"],
    FEBRUARY: ["Feb.", "Februar"],
    MARCH: ["Mär.", "März"],
    APRIL: ["Apr.", "April"],
    MAY: ["Mai", "Mai"],
    JUNE: ["Jun.", "Juni"],
    JULY: ["Jul.", "Juli"],
    AUGUST: ["Aug.", "August"],
    SEPTEMBER: ["Sep.", "September"],
    OCTOBER: ["Okt.", "Oktober"],
    NOVEMBER: ["Nov.", "November"],
    DECEMBER: ["Dez.", "Dezember"],
    
    //patient information.
    RFV: "Aufnahmegrund",
    ROOM_BED: "Zimmer/Bett",
    ADMIT_DIAG: "Aufnahmediagnose",
    ADMIT_PHYS: "Aufnahmearzt",
    PRIM_PHYS: "Hausarzt",
    ATTEND_PHYS: "Behandelnder Arzt",
    EMER_CONTACT: "Ansprechpartner für Notfälle",
    EMER_NUMBER: "Telefonnummer für Notfälle",
    CHIEF_COMPLAINT: "Hauptbeschwerde",
    LAST_VISIT: "Letzter Aufenthalt",
    MODE_OF_ARRVAL: "Ankunftsmodus",
    LAST: "Letzte(r)",
    VISIT: "Aufenthalt",
    CONTACTS: "Ansprechpartner",
    TARGETED_DISCHARGE_DATE: "Geplantes Entlassungsdatum",
    LAST_VISIT: "Letzter Aufenthalt",
    
    //immunizations
    IMMUNIZATIONS: "Impfung",
    PRODUCT: "Produkt",
    ADMIN_DATE: "Verabreichungsdatum",
    MANUFACTURER: "Hersteller",
    LOT: "Charge",
    EXP_DATE: "Ablaufdatum",
    ADMIN_NOTES: "Verabreichungshinweise",
    IMMUNIZATIONS_DETAILS: "Impfung - Details",
    
    //Meds Recon
    START: "Beginnen",
    STOP: "Beenden",
    SIGNATURE_LINE: "Unterschriftszeile",
    ORDERING_PHYSICIAN: "Anfordernder Arzt",
    NEW: "Neu",
    CONTINUE: "Weiter",
    NO_LONGER_TAKING: "Nicht mehr einnehmen",
    CONTINUE_WITH_CHANGES: "Weiter mit Änderungen",
    CONTACT_PHYSICIAN: "Vor der Einnahme ärztlichen Rat einholen",
    
    //Visits 
    FUTURE: "In Zukunft",
    VISIT_DETAILS: "Aufenthalt - Details",
    
    DISCHARGE_PROCESS: "Entlassungsverfahren",
    CLICK_TO_GO_TO_DISCHARGE_PROCESS: "Hier für Entlassungsverfahren klicken",
    
    // New Order Entry
    MEDS: "Medikationen",
    LABS: "Labortests",
    IMAGING: "Bildgebende Verfahren",
    BILLING: "Abrechnung",
    OTHER: "Weitere",
    ORDER_FAVORITE: "Favoriten für Anforderungen",
    ORDER_NAME: "Anforderung",
    ORDER_DISPLAY_LINE: "Anforderungsanzeigezeile",
    ORDER_PARAMETERS: "Anforderungsparameter",
    NO_MEDS_FAVORITES: "Keine Favoriten für Medikationen gefunden",
    NO_LABS_FAVORITES: "Keine Favoriten für Labortests gefunden",
    NO_IMAGING_FAVORITES: "Keine Favoriten für bildgebende Verfahren gefunden",
    NO_BILLING_FAVORITES: "Keine Favoriten für Abrechnung gefunden",
    NO_OTHER_FAVORITES: "Keine weiteren Favoriten gefunden",
    ORDERS_FOR_SIGNATURE: "Anforderungen zum Abzeichnen",
    NO_ORDERS_FOR_SIGNATURE: "Keine Anforderungen zum Abzeichnen vorhanden",
    SEARCH_MODE: "Suchmodus",
    SELECT: "Auswählen",
    SUBMIT_FOR_SIGNATURE: "Zum Abzeichnen einreichen",
    
    // Care Management Strings
    RCM_ACTUAL_DISCHARGE_DISPOSITION: "Tatsächlicher Entlassungszustand",
    RCM_ADD_ADDENDUM: "Nachtrag hinzufügen",
    RCM_ADDENDUM: "Nachtrag",
    RCM_ADDENDUM_BY: "Nachtrag von:",
    RCM_ADDITIONAL_NOTES: "Zusätzliche Notizen",
    RCM_ADDITIONAL_REVIEWER_NOTES: "Zusätzliche Notizen von Überprüfer",
    RCM_ADM_MIM: "Dokument zu Patientenrechten bei Aufnahme",
    RCM_ADMIT_TO_BED_DT: "Datum der Aufnahme mit Bettenzuweisung",
    RCM_ADMITTING_DX: "Aufnahmediagnose",
    RCM_ADMITTING_DX_DESC: "Beschreibung für Aufnahmediagnose",
    RCM_ADMIT_DATE: "Aufnahmedatum",
    RCM_ADMIT_SOURCE: "Aufnahmeherkunft",
    RCM_ADVANCE_DIR_COMPL: "Vorausverfügung ausgefüllt",
    RCM_ADVANCE_DIR_ON_FILE: "Vorausverfügung in Akte",
    
    RCM_AGE: "Alter",
    RCM_ALTERNATE_DRG: "Alternativer DRG",
    RCM_ATTENDING_PHYSICIAN: "Behandelnder Arzt",
    RCM_AVOIDABLE_DAYS: "Zu vermeidende Tage",
    RCM_BED: "Bett",
    RCM_CANCEL: "Abbrechen",
    RCM_CANCEL_MESSAGE: "Möchten Sie wirklich abbrechen? Alle Änderungen gehen verloren.",
    RCM_CARE_GUIDELINE: "Pflegerichtlinie",
    RCM_CARE_MANAGEMENT: "Pflegeverwaltung",
    RCM_CLINICAL_REVIEW: "Klinische Überprüfung",
    RCM_CLINICAL_REVIEW_ENTRY: "Klinische Überprüfung - Eingabe",
    RCM_CLINICAL_REVIEW_SUMMARY: "Klinische Überprüfung - Zusammenfassung",
    RCM_COLON: ":",
    RCM_COMPLETE: "Abschließen",
    RCM_CONTINUED_STAY: "Weiterer Aufenthalt",
    RCM_CRITERIA_MET: "Erfüllte Kriterien",
    RCM_CURRENT_ENCOUNTER: "Aktueller Fall",
    RCM_DATE: "Datum",
    RCM_DATEPICKER_TEXT: "Datum auswählen",
    RCM_DAY_REVIEWED: "Überprüft am",
    RCM_DELETE: "Klinische Überprüfung löschen",
    RCM_DELETE_FAILED: "Löschen fehlgeschlagen",
    RCM_DELETE_FAILED_MESSAGE: "Die ausgewählte klinische Überprüfung wurde seit dem letzten Öffnen von einem anderen Benutzer geändert.  Die klinische Überprüfung kann nicht gelöscht werden.",
    RCM_DELETE_MESSAGE: "Möchten Sie die ausgewählte klinische Überprüfung wirklich löschen?",
    RCM_DELETE_REVIEW: "Überprüfung löschen",
    RCM_DENIED_DAYS: "Abgelehnte Tage",
    RCM_DISCHARGE_ASSESSMENT_INFO: "Informationen zur Entlassungsbewertung",
    RCM_DISCHARGE_BARRIERS: "Gründe gegen Entlassung",
    RCM_DISCHARGE_DATE: "Entlassungsdatum",
    RCM_DISCHARGE_DISPOSITION: "Entlassungszustand",
    RCM_DISCHARGE_FACILITY: "Entlassung aus Einrichtung",
    RCM_DISCHARGE_NEXT_ASSESSMENT_DT: "Datum der nächsten Untersuchung nach Entlassung",
    RCM_DISCHARGE_OF_SERVICES: "Entlassung aus Dienstleistungsbereichen",
    RCM_DISCHARGE_PENDING: "Entlassung ausstehend",
    RCM_DISCHARGE_SCREEN: "Screening bei Entlassung",
    RCM_DISCHARGE_SCREENING: "Screening bei Entlassung",
    RCM_DISCHARGE_SLOT: "Slot für Entlassung",
    RCM_DISPLAY: "Anzeigen",
    RCM_DNR: "Patientenverfügung",
    RCM_DOB: "Geburtsdatum",
    RCM_DONE: "Erledigt",
    RCM_DRG_DESC: "DRG-Beschreibung",
    RCM_ELOS: "Geschätzte Aufenthaltsdauer",
    RCM_ENCOUNTER_TYPE: "Falltyp",
    RCM_ESTIMATED_DISCHARGE_DATE: "Geschätztes Entlassungsdatum",
    RCM_FACILITY: "Einrichtung",
    RCM_FAX_REVIEWS: "Überprüfungen faxen",
    RCM_FC: "F/C",
    RCM_FIN: "Fallnummer",
    RCM_FINAL: "Finalisieren",
    RCM_FINAL_AND_NEXT: "Finalisieren & Weiter",
    RCM_FINAL_DRG: "Endgültiger DRG",
    RCM_FINAL_DX: "Endgültige Diagnose",
    RCM_FINAL_PRIMARY_DX: "Endgültige Hauptdiagnose",
    RCM_FINANCIAL_CLASS: "Buchungsklasse",
    RCM_INCLUDE_CLOSED_UM_REVIEWS: "Mit abgeschlossenen Utilization Management-Prüfungen",
    RCM_INTENSITY_OF_SERVICES: "Intensität der Leistungen",
    RCM_LAST_ASSESSMENT_DATE: "Datum der letzten Untersuchung",
    RCM_LAST_REVIEW_DATE: "Datum der letzten Überprüfung",
    RCM_LEVEL_OF_SERVICE_SUBTYPE: "Subtyp für Dienstgrad",
    RCM_LOS: "Aufenthaltsdauer",
    RCM_LOS_ELOS: "Aufenthaltsdauer/geschätzte Aufenthaltsdauer:",
    RCM_MARK_AS_FINAL: "Als 'Endgültig' markieren",
    RCM_MED_SERVICE: "Fachabteilung",
    RCM_MET: "Erreicht",
    RCM_MODIFY: "Ändern",
    RCM_MRN: "Patientennummer",
    RCM_MY_RELATIONSHIP: "Meine Beziehungen",
    RCM_NAME: "Name",
    RCM_NEXT_CLINICAL_REVIEW: "Nächste klinische Überprüfung fällig am:",
    RCM_NEXT_CLINICAL_REVIEW_DATE: "Datum der nächsten klinischen Überprüfung",
    RCM_NEXT_CL_REVIEW: "Nächste CL-Überprüfung",
    RCM_NEXT_REVIEW_NEEDED: "Nächste Überprüfung erforderlich",
    RCM_NEXT_SECTION: "Nächster Abschnitt",
    RCM_NO: "Nein",
    RCM_NOMENCLATUREID: "Nomenklaturkennung:",
    RCM_NOT_MET: "Nicht erreicht",
    RCM_OBS_END_DTTM: "Datum/Zeit des Beobachtungsendes",
    RCM_OBS_START_DTTM: "Datum/Zeit des Beobachtungsbeginns",
    RCM_OK: "OK",
    RCM_OPEN_CLINICAL_REVIEW: "Ausstehende klinische Überprüfung",
    RCM_OUTCOME: "Ergebnis",
    RCM_PATIENT_LIST: "Patientenliste",
    RCM_PAYER: "Kostenträger",
    RCM_PENDING: "Ausstehend",
    RCM_PLANNED_DISCHARGE_DATE: "Geplantes Entlassungsdatum",
    RCM_PLANNED_DISCHARGE_DISPOSITION: "Zielzustand bei Entlassung",
    RCM_PREVIOUS_ADMISSION_INFO: "Informationen zu vorherigen Aufnahmen",
    RCM_PRIMARY_DX: "Hauptdiagnose",
    RCM_PRIMARY_UR_NURSE: "Primärer Pfleger für Utilization Review",
    RCM_REASON_FOR_REFERRAL: "Grund für Überweisung",
    RCM_REVIEW: "Überprüfen",
    RCM_REVIEW_CRITERIA: "Überprüfungskriterien",
    RCM_REVIEW_DATE: "Überprüfungsdatum",
    RCM_REVIEW_DUE: "Überprüfung fällig",
    RCM_REVIEW_OUTCOME: "Ergebnis der Überprüfung",
    RCM_REVIW_TYPE: "Überprüfungstyp",
    RCM_REVIWED_BY: "Überprüft von:",
    RCM_REVIEWER: "Überprüfer",
    RCM_ROOM: "Zimmer",
    RCM_SAVE: "Speichern",
    RCM_SAVE_AND_NEW: "Speichern & Neu",
    RCM_SAVE_FAILED: "Speichern fehlgeschlagen",
    RCM_SAVE_FAILED_MESSAGE: "Die ausgewählte klinische Überprüfung wurde seit dem letzten Öffnen von einem anderen Benutzer geändert.  Ihre Änderungen an der klinischen Überprüfung können nicht übernommen werden.",
    RCM_SECONDARY_REVIEW: "Zweitüberprüfung",
    RCM_SECONDARY_REVIEW_NEEDED: "Zweitüberprüfung erforderlich",
    RCM_SEVERITY_OF_ILLNESS: "Schweregrad der Krankheit",
    RCM_SOURCE_IDENTIFIER: "Quellkennung:",
    RCM_SR_DATE: "Datum der Zweitüberprüfung",
    RCM_SR_STATUS: "Status der Zweitüberprüfung",
    RCM_SSN: "Versicherungsnummer",
    RCM_STATUS: "Status",
    RCM_TYPE: "Typ",
    RCM_UM_INFO: "Informationen zu Utilization Management",
    RCM_UM_STATUS: "Status des Utilization Management",
    RCM_UNIT: "Einheit",
    RCM_UNIT_DISCHARGE_FROM: "Einheit für 'Entlassen aus'",
    RCM_UTILIZATION_MANAGEMENT: "Verwendungsverwaltung",
    RCM_VISIT_INFO: "Informationen zum Aufenthalt",
    RCM_WORKING_DRG: "Arbeits-DRG",
    RCM_WORKING_DRG_DESC: "Beschreibung für Arbeits-DRG",
    RCM_YES: "Ja",
    
    // Discharge Readiness
    DC_NOT_STARTED: "Nicht gestartet",
    DC_IN_PROGRESS: "In Bearbeitung",
    DC_COMPLETE: "Abschließen",
    DC_REVIEWSIGN: "Überprüfen und Abzeichnen",
    
    //Follow Up
    FU_NAME: "Name:",
    FU_ADDRESS: "Anschrift:",
    
    //Patient Education
    PE_INSTRUCTION: "Anweisung:",
    PE_DATE: "Datum:",
    PE_PROVIDER: "Klin. Mitarbeiter:",
    
    //Quality Measures
    QM_COMPLETE: "Abschließen",
    QM_INCOMPLETE: "Unvollständig",
    QM_CONDITION: "Krankheitsbild:"
};

/*
 * Core namespace for architecture i18n string utilized.
 * NOTE: Keep alpha sorted to eliminate the error of duplicate strings
 */
i18n.discernabu = {
    ADD: "Hinzufügen",
    ALL_N_VISITS: "{0} für alle Aufenthalte",
    All_VISITS: "Alle Aufenthalte",
    CLEAR_PREFERENCES: "Voreinstellungen entfernen",
    COLLAPSE_ALL: "Alle minimieren",
    CUSTOMIZE: "Anpassen",
    DESCRIPTION: "Beschreibung",
    DISCERN_ERROR: "Discern-Fehler",
    DISCLAIMER: "Diese Ansicht umfasst nicht alle Daten dieses Aufenthalts.",
    ERROR_OPERATION: "Operation",
    ERROR_OPERATION_STATUS: "Operationsstatus",
    ERROR_RETREIVING_DATA: "Fehler beim Suchen der Ergebnisse",
    ERROR_TARGET_OBJECT: "Zielobjekts",
    ERROR_TARGET_OBJECT_VALUE: "Wert des Zielobjekts",
    EXPAND_ALL: "Alle erweitern",
    GO_TO_TAB: "Gehe zu Register {0}",
    HELP: "Hilfe",
    HIDE_SECTION: "Minimieren",
    JS_ERROR: "JavaScript-Fehler",
    LAST_N_DAYS: "Letzte {0} Tage",
    LAST_N_HOURS: "Letzte {0} Stunden",
    LAST_N_MONTHS: "Letzte {0} Monate",
    LAST_N_WEEKS: "Letzte{0} Wochen",
    LAST_N_YEARS: "Letzte {0} Jahre",
    LOADING_DATA: "Ladevorgang",
    MESSAGE: "Nachricht",
    NAME: "Name",
    NO_RESULTS_FOUND: "Keine Ergebnisse gefunden",
    NUMBER: "Anzahl",
    RENDERING_DATA: "Rendern",
    REQUEST: "Anfrage",
    SAVE_PREFERENCES: "Voreinstellungen speichern",
    SELECTED_N_VISIT: "{0} für den ausgewählten Aufenthalt",
    SELECTED_VISIT: "Ausgewählter Aufenthalt",
    SHOW_SECTION: "Erweitern",
    STATUS: "Status",
    USER_CUSTOMIZATION: "Benutzerspezifische Anpassung",
    USER_CUST_DISCLAIMER: "Bitte berücksichtigen Sie die Bildschirmauflösung, bevor Sie eine Ansicht mit drei Spalten auswählen.",
    WITHIN_DAYS: "{0} Tage",
    WITHIN_HOURS: "{0} Stunden",
    WITHIN_MINS: "{0} Minuten",
    WITHIN_MONTHS: "{0} Monate",
    WITHIN_WEEKS: "{0} Wochen",
    WITHIN_YEARS: "{0} Jahre",
    X_DAYS: "{0} Tage",
    X_HOURS: "{0} Stunden",
    X_MINUTES: "{0} Minuten",
    X_MONTHS: "{0} Monate",
    X_WEEKS: "{0} Wochen",
    X_YEARS: "{0} Jahre",
    
    //Auto Suggest Control
    NO_PRIVS: "Sie sind nicht berechtigt, das/den/die ausgewählte/n {name} hinzuzufügen.",
    DUPLICATE: "Diese Aktion würde ein/e/en doppelte/s/n {name} erstellen. Sie können {name} nicht hinzufügen.",
    PROBLEM: "Beschwerde",
    DIAGNOSIS: "Diagnose",

    DAYNAMES: ["SO", "MO", "DI", "MI", "DO", "FR", "SA", "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    MONTHNAMES: ["Jan.", "Feb.", "Mär.", "Apr.", "Mai", "Jun.", "Jul.", "Aug.", "Sep.", "Okt.", "Nov.", "Dez.", "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
}
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
 
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};
 
	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;
 
		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}
 
		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");
 
		mask = String(dF.masks[mask] || mask || dF.masks["default"]);
 
		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}
 
		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};
 
		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();
 
// Some common format strings
dateFormat.masks = {
	"default":      "ddd dd.mm.yyyy HH:MM:ss",
	shortDate:      "d.m.yy",
	shortDate2:     "dd.mm.yyyy",
	shortDate3:		"dd.mm.yy",
	shortDate4:		"mm.yyyy",
	shortDate5:		"yyyy",
	mediumDate:     "d. mmm. yyyy",
	longDate:       "d. mmmm yyyy",
	fullDate:       "dddd, d. mmmm yyyy",
	shortTime:      "HH:MM",
	mediumTime:     "HH:MM:ss",
	longTime:       "HH:MM:ss Z",
	militaryTime:   "HH:MM",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
	longDateTime: 	"dd.mm.yyyy HH:MM:ss Z",
	longDateTime2:	"dd.mm.yy HH:MM",
	longDateTime3:	"dd.mm.yyyy HH:MM",
	shortDateTime:	"dd.mm. HH:MM"
};
 
// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"SO", "MO", "DI", "MI", "DO", "FR", "SA",
		"Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
	],
	monthNames: [
		"Jan", "Feb", "M�r", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
		"Januar", "Februar", "M�rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"
	]
};
 
// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
 
// For i18n formatting...
Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));
 
    var offset = 0;
    var date = new Date(d[1], 0, 1);
 
    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }
 
    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
};
﻿
/**
 * Project: i18n.js (diagnoses)
 * Version 1.3.2-SNAPSHOT
 * Released TBD
 * @author Mark Davenport (MD019066)
 */
if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.diagnoses_o1 = {
	DIAGNOSES: "Diagnose",
	CODE: "Kode",
	DETAILS: "Details",
	DIAGNOSES_DATE: "Diagnose - Datum",
	RESPONSIBLE_PROVIDER_NAME: "Zuständiger klinischer Mitarbeiter",
	DIAG_TYPE: "Diagnose - Typ",
	COMMENTS: "Kommentare",
	DIAGNOSES_NAME: "Diagnose - Name",
	ANNOTATED_DISPLAY: "Anzeige mit Annotationen"
};
﻿/**
 * Project: i18n.js (Document Base)
 * Version 2.1.0-SNAPSHOT
 * Released TBD
 * @author Subash Katageri (SK018948)
 */
if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.documents_base_o1 = {
    AUTHOR: "Verfasser",
    DATE: "Datum",
    DATE_TIME: "Datum/Zeit",
    WITHIN: "innerhalb von",
    UNKNOWN: "Unbekannt",
    DOCUMENTATION_DETAILS: "Dokumentation - Details",
    NAME: "Name",
    SUBJECT: "Betreff",
    STATUS: "Status",
    LAST_UPDATED: "Zuletzt aktualisiert",
    LAST_UPDATED_BY: "Zuletzt aktualisiert von",
    DOCUMENT_FAVS: "Keine Favoriten gefunden"
};
﻿/**
 * Project: i18n.js (Growth Chart)
 * Version 1.4.0-SNAPSHOT
 * Released TBD
 * @author Sreenivasan Thirumalachar (ST017230)
 */

if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.gc_o1 = {
	PERCENTILE: "Perzentile",
	ZSCORE: "Z-Wert",
    LATEST: "Letzte/r/s",
    WITHIN: "innerhalb von",
    PREVIOUS: "Vorherige/r/s",
	RESULT_DETAILS: "Ergebnis - Details",
	RESULT_DT_TM: "Ergebnis - Datum/Zeit",
	AGE: "Alter",
	RESULT: "Ergebnis"
}﻿
/**
 * Project: i18n.js (Home Medication)
 * Version 1.4.0 -SNAPSHOT
 * Released 01/10/2011
 * @author Sreenivasan Thirumalachar (ST017230)
 * @author Subash Katageri (SK018948)
 */
if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.homemeds_o1 = {
    HOME_MEDICATION: "Heimmedikation",
    LAST_DOSE: "Letzte Dosis",
    PRESCRIBED: "Verschrieben",
    DOCUMENTED: "Dokumentiert",
    NO_KNOWN_HOME_MEDS: "Für diesen Patienten sind keine bekannten Heimmedikationen vorhanden.",
    UNABLE_TO_OBTAIN_MED_HIST: "Angaben zur Medikationshistorie können für den ausgewählten Aufenthalt nicht abgerufen werden.",
    MED_DETAIL: "Medikationen - Details",
    ORDER_DATE: "Anforderungsdatum",
    COMPLIANCE: "Einhaltung",
    RESPONSIBLE_PROVIDER: "Anforderung eingegeben von",
    STATUS: "Status",
    TYPE: "Typ",
    DETAILS: "Details",
    LAST_DOC_DT_TM: "Zuletzt dokumentiert am/um",
    LAST_DOC_BY: "Zuletzt dokumentiert von",
    ORDER_DETAILS: "Anforderung - Details"
}
﻿/**
 * Project: i18n.js (laboratory)
 * Version 1.2.0
 * Released 11/10/2010
 * @author Greg Howdeshell (GH7199)
 */
if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.laboratory_o1 = {
    WITHIN: "innerhalb von",
    LATEST: "Letzte/r/s",
    PREVIOUS: "Vorherige/r/s",
    EXPAND: "Erweitern",
    COLLAPSE: "Minimieren",
    PRIMARY_RESULTS: "Primäre Ergebnisse",
    VALUE: "Wert",
    LABORATORY_DETAILS: "Laborergebnisse - Details",
    DATE_TIME: "Datum/Zeit",
    NORMAL_LOW: "Untergrenze Normalbereich",
    NORMAL_HIGH: "Obergrenze Normalbereich",
    CRITICAL_LOW: "Kritischer Minimalwert",
    CRITICAL_HIGH: "Kritischer Maximalwert"
};
﻿/**
 * Project: i18n.js (medications)
 * Version 1.4.0 -SNAPSHOT
 * Released TBD
 * @author Mark Davenport (MD019066)
 * @author Subash Katageri (SK018948)
 */
if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.medications_o1 = {
    NEXT_N_HOURS: "In den nächsten {0} Stunden",
	HIDE_SECTION: "Minimieren",
	SCHEDULED: "Geplant",
    MED_DETAIL: "Medikationen - Details",
    MED_NAME: "Medikation",
    REQUESTED_START: "Angefordertes Beginndatum",
    ORIG_DT_TM: "Ursprüngliches Anforderungsdatum/-zeit",
    LAST_DOSE_DT_TM: "Letzte Dosis",
    NEXT_DOSE_DT_TM: "Nächste Dosis",
    STOP_DT_TM: "Enddatum/-zeit",
    STOP_REASON: "Beendigungsgrund",
    STATUS: "Status",
    LAST_GIVEN: "Zuletzt verabreicht",
    NEXT_DOSE: "Nächste Dosis",
    CONTINOUS: "Dauerinfusion",
    SUSPENDED: "Unterbrochen",
    PRN: "Bedarfsmedikation",
    UNSCHEDULED: "Nicht geplant",
    RESPONSIBLE_PROVIDER: "Anforderung eingegeben von",
    ADMINISTERED: "Verabreicht",
    PRN_UNSCHEDULED: "Bedarfsmedikation/Nicht geplant verfügbar",
	ADMIN_LAST_N_HOURS: "Innerhalb der letzten {0} Stunden verabreicht",
 	SHOW_SECTION: "Erweitern",
	LAST_N_HOURS: "Letzte {0} Stunden",
	DISCONTINUED: "Abgesetzt",
	JS_ERROR: "JavaScript-Fehler",
    MESSAGE: "Nachricht",
    NUMBER: "Anzahl",
    DESCRIPTION: "Beschreibung",
	NAME: "Name",
	DETAILS: "Details",
	NOT_DEFINED: "Nicht definiert",
	ORDER_DETAILS: "Anforderung - Details"
};﻿
/**
 * Project: i18n.js (Patient Information)
 * Version 1.3.0
 * Released 01/07/2011
 * @author Sreenivasan Thirumalachar (ST017230)
 */
if (typeof i18n == "undefined") {
    var i18n = {};
}

if (typeof i18n.discernabu == "undefined") {
    i18n.discernabu = {};
}

i18n.discernabu.patinfo_o1 = {
    NO_RESULTS_FOUND: "Keine Ergebnisse gefunden",
    RFV: "Aufnahmegrund",
    ROOM_BED: "Zimmer/Bett",
    ADMIT_DIAG: "Aufnahmediagnose",
    ADMIT_DATE: "Aufnahmedatum",
    PRIM_PHYS: "Hausarzt",
    ATTEND_PHYS: "Behandelnder Arzt",
    EMER_CONTACT: "Ansprechpartner für Notfälle",
    EMER_NUMBER: "Telefonnummer für Notfälle",
    CODE_STATUS: "Kodestatus",
    LAST_VISIT: "Letzter Aufenthalt",
    LAST: "Letzte(r)",
    VISIT: "Aufenthalt",
    CONTACTS: "Ansprechpartner",
    ADMIT_PHYS: "Aufnahmearzt",
    TARGETED_DISCHARGE_DATE: "Geplantes Entlassungsdatum",
    SERVICE: "Fachabteilung",
    MODE_OF_ARRVAL: "Ankunftsmodus",
    ADVANCE_DIRECTIVE: "Vorausverfügung",
    DETAILS: "Details",
    CHIEF_COMPLAINT: "Hauptbeschwerde"
};
﻿/**
 * Project: i18n.js (Vital signs)
 * Version 1.2.0-SNAPSHOT
 * Released TBD
 * @author Sreenivasan Thirumalachar (ST017230)
 */

if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.vitals_o1 = {
    BLOOD_PRESSURE: "Blutdruck",
    TEMPERATURE: "Temperatur",
    DEGC: "Grad Celsius",
    DEGF: "Grad Fahrenheit",
    NORMAL_LOW: "Untergrenze Normalbereich",
    NORMAL_HIGH: "Obergrenze Normalbereich",
    CRITICAL_LOW: "Kritischer Minimalwert",
    CRITICAL_HIGH: "Kritischer Maximalwert",
    TWO_DAY_MAX: "Höchstwert innerhalb 48 Stunden",
    LATEST: "Letzte/r/s",
    WITHIN: "innerhalb von",
    PREVIOUS: "Vorherige/r/s",
    DATE_TIME: "Datum/Zeit",
    ERROR_RETREIVING_DATA: "Fehler beim Suchen der Ergebnisse",
    VALUE: "Wert",
    LABORATORY_DETAILS: "Details zu Laborergebnissen"
}