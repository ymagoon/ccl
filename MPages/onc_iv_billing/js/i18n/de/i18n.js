var i18n = function ()
{
    return {
        REQUEST: "Anfrage",
        //Return Status:
        NO_RESULTS_FOUND: "Keine Ergebnisse gefunden",
        NO_DATA: "Keine Daten",

        //Error Status:
        ERROR_RETREIVING_DATA: "Fehler beim Abrufen der Ergebnisse",
        ERROR_OPERATION: "Operation",
        ERROR_OPERATION_STATUS: "Operationsstatus",
        ERROR_TARGET_OBJECT: "Zielobjektname",
        ERROR_TARGET_OBJECT_VALUE: "Zielobjektwert",
        //Customization
        CLEAR_PREFERENCES: "Voreinstellungen entfernen",
        SAVE_PREFERENCES: "Voreinstellungen speichern",
        CUSTOMIZE: "Anpassen",
        USER_CUSTOMIZATION: "Benutzerspezifische Anpassung",
        SAVE_PREF_SUCCESS: "Voreinstellungen wurden erfolgreich gespeichert",
        CLEAR_PREF_SUCCESS: "Voreinstellungen wurden erfolgreich entfernt",

        //Alerts
        LYNXEPOINT_OBJECT_NULL: "LYNXEPOINT-Objekt = Null",
        INITIAL_PARAMETERS_INVALID: "Die Transaktion kann nicht abgeschlossen werden, da die Parameter für Patient, Fall oder Aufenthaltsgruppe ungültig sind.",
        WEB_SERVICE_PARAMETERS_INVALID: "Die Transaktion kann nicht abgeschlossen werden, da die Webdienstparameter ungültig sind.",
        INVALID_OPERATION_EXCEPTION: "Es ist ein Operationsfehler aufgetreten. Transaktion kann nicht abgeschlossen werden.",

        //wizard
        FACILITY_TITLE: "Einrichtungsabrechnungsticket",
        FACILITY_CODING: "Einrichtungskodierung",
        URGENT_CARE_TITLE: "Klinische Abrechnung und Kodierung",
        URGENT_CARE_CODING: "Bewertung und Management",
        INFUSION_INJECTIONS: "Infusion und Injektionen",
        FINALIZE_CHARGES: "Leistungen abschließen",
        NEXT: "Weiter >",
        BACK: "< Zurück",
        ADD: "Neu hinzufügen",
        CANCEL: "Abbrechen",
        ADD_NEW: "Neu hinzufügen",
        INFUSION_START_TIME: "Beginndatum/-zeit",
        INFUSION_STOP_TIME: "Enddatum/-zeit",
        HYDRATION: "Hydration",
        INFUSION: "Infusion",
        IV_PUSH: "Bolus",
        SQ_INJECTION: "IM/SQ-Injektion",
        INTRA_ARTERIAL_INJECTION: "Intraarterielle Injektion",
		INTRA_PERITONEAL: "Intraperitoneal",
        INTRA_THECAL: "Intrathekal",
        SITE: "Körperstelle",
        NO: "Nein",
        TYPE: "Typ",
		ADMIN_TYPE: "Verabreichungswege",
        DURATION: "Dauer (Minuten)",
        MEDICATION: "Medikation",
        E_M: "Bewertung und Management",
        I_I: "Infusion und Injektionen",
        CPT: "CPT",
        UNITS: "Einheiten",
        CHARGES_START: "Beginn/Verabreichung",
        CHARGES_STOP: "Ende",
        CHARGES: "Leistungen",
        CALCULATE_CHARGES: "Berechnen >",
        SUBMIT_CHARGES: "Einreichen",
        SUCCESS_MSG: "Die Leistungen wurden erfolgreich verarbeitet",
        ADD_SUCCESS_MSG: "Die zusätzlichen Leistungen wurden erfolgreich verarbeitet",
        SYSTEM_DEFAULT: "&nbsp;*",
        SYSTEM_DEFAULT_XML: "&nbsp;&lowast;",
        DOCUMENTED_SECTION: "Dokumentiert",
        SAVE: "Speichern",
        HELP_SECTION: "Referenztext",
        DROP_ADDITIONAL_CHARGES: "Zusätzliche Leistungen",
        EXPAND_SUB_SEC: "Gesamten Referenztext erweitern",
        COLLAPSE_SUB_SEC: "Gesamten Referenztext minimieren",
        REFRESH: "Aktualisieren",
        STARTWITH: "Beginnt mit",
        CONTAINS: "Enthält",
        PRESENTING_PROBLEM_ALERT: "Für die Bestimmung der typischen Aufenthaltsebene wird eine Langzeitdiagnose bei Ankunft benötigt. Geben Sie eine Langzeitdiagnose ein.",
        SELECT_SITE: "Wählen Sie eine Körperstelle aus.",
        SELECT_TYPE: "Wählen Sie einen Verabreichungsweg aus.",
        SELECT_MEDICATION: "Wählen Sie eine Medikation aus.",
        FILL_OUT_START_DATE: "Geben Sie ein Beginndatum an.",
        FILL_OUT_START_TIME: "Geben Sie eine Beginnzeit an.",
        FILL_OUT_STOP_DATE: "Geben Sie ein Enddatum an.",
        FILL_OUT_STOP_TIME: "Geben Sie eine Endzeit an.",
        STANDARD_ED_ENCOUNTER: "Standardfall",
        START_DATE_PRIOR_STOP_DATE: "Beginndatum/-zeit muss vor Enddatum/-zeit liegen",
        START_DATE_AFTER_ARRIVAL: "Beginndatum/-zeit muss nach Ankunftsdatum/-zeit des Patienten liegen",
        STOP_DATE_AFTER_ARRIVAL: "Enddatum/-zeit muss nach Ankunftsdatum/-zeit des Patienten liegen.",
        START_DATE_PRIOR_CHECKOUT: "Beginndatum/-zeit muss vor Entlassungsdatum/-zeit des Patienten liegen",
        STOP_DATE_PRIOR_CHECKOUT: "Enddatum/-zeit muss vor Entlassungsdatum/-zeit des Patienten liegen",
        START_DATE_PRIOR_CURRENT: "Beginndatum/-zeit muss vor aktuellem Datum/aktueller Zeit liegen",
        STOP_DATE_PRIOR_CURRENT: "Enddatum/-zeit muss vor aktuellem Datum/aktueller Zeit liegen",
        IN_SYSTEM: " im System.",
        VISIT_TYPES_ALERT: "Bei Auswahl dieser Option werden alle anderen EM-Leistungen überschrieben",
		AUTOMATE_IV: "Zur Ansicht für automatische Infusion wechseln",
		MANUAL_IV : "Zur Ansicht für manuelle Infusion wechseln",
		HIDE_SUB_ORDRS : "Eingereichte Anforderungen ausblenden",
		SHOW_SUB_ORDRS : "Eingereichte Anforderungen anzeigen",
		SELECT_ALL: "Alle auswählen",


        //Infusion and Injection
        CHOOSE_SITE: "Körperstelle auswählen",
		CHOOSE_ADMIN_ROUTE: "Verabreichungsweg auswählen",
        IV1: "Infusion 1",
        MODIFY: "Ändern",
        DELETE: "Löschen",
        REMOVE: "Entfernen",
        CHOOSE_TYPE: "Typ auswählen",
		TYPES_ADD: "Verabreichungswege",
        //Additional Charges
        ADDITIONAL_CHARGES: "Weiter >",
		MODIFIERS: "Modifikatoren",
		STATUS_COL:"Status",
		CHRG_STATUS_SUBMIT:"Eingereichte Leistungen",
		CHRG_STATUS_NOT_SUBMIT:"Nicht eingereichte Leistungen",
        STATUS_SUBMIT:"Eingereicht",
        STATUS_NOT_SUBMIT:"Nicht eingereicht",
		CPT_SUBMITTED: "Leistungen wurden bereits für alle Anforderungen eingereicht",
		MISSING_DETAILS: "Fehlende Details:",
		MISSING_STOP_DATE_TM: "Enddatum/-zeit fehlen für folgende Medikationen:",
		WARING_MSG: "Zurzeit werden eingereichte Anforderungen angezeigt.\n Wenn Sie mit der Berechnung fortfahren,\n werden die zuvor eingereichten Anforderungen erneut eingereicht.\nWeiter?",

		AMBGUOUS_MSG: " strVarDateTime ist eine mehrdeutige Zeit, weil sie bei der Umstellung von Sommer- auf Normalzeit wiederholt wird. Für welche Zeit möchten Sie sich entscheiden??",
		DAY_LIGHT: "Sommerzeit",
		STANDARD: "Standard",
		AMB_TITLE: "Mehrdeutige Zeit",
        //Commons
        GO_TO_TAB: "Gehe zu Registerkarte &#39;{0}&#39;",
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
        LATEST: "Aktuelle",
        WITHIN: "innerhalb von",
        PREVIOUS: "Vorherige",
        SINCE: "Seit",
        DISCLAIMER: "Die Ansicht umfasst nicht alle Daten dieses Aufenthalts.",
        USER_CUST_DISCLAIMER: "Berücksichtigen Sie die Bildschirmauflösung, bevor Sie eine Ansicht mit drei Spalten auswählen.",
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
        LAST_N_WEEKS: "Letzte {0} Wochen",
        NEXT_N_HOURS: "Nächste {0} Stunden",
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
        DONE: "Abgeschlossen",
        NOT_DONE: "Nicht erledigt",
        HELP: "Hilfe",
        ADD: "Neu hinzufügen",
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

        //InjectionInfusionCalculator
        II_INFUSION_INJECTION: "Infusion und Injektion",
        II_NUMBER: "Nr.",
        II_TYPE: "Typ",
        II_START_ADMIN: "Beginn/Verabreichung",
        II_STOP: "Ende",
        II_DURATION: "Dauer (Minuten)",
        II_MEDICATION: "Medikation",
        II_NO_INJECTION_INFUSION: "Keine eingegebenen Infusionen/Injektionen",

        //Summary
        II_SUMMARY_OF_CHARGES: "Übersicht über Leistungen"
    };
} ();