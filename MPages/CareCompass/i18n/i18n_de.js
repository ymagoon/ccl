﻿/* contains the strings to internationalize */

var i18n = function()
{
	return { 
		//Headers
		LOCATION: "Standort",
		PATIENT: "Patient",
		VISIT: "Aufenthalt",
		CARE_TEAM: "Pflegeteam",
		ACUITY: "Schweregrad",
		VENTILATOR: "Einstellungen für Beatmungsgeräte",
		ERROR_TASK: "Nachrichten der Apotheke",
		
		//Blood Gases
		ARTERIAL_BLOOD_GASES: "Arterielle Blutgase",
		PH: "pH",
		O2SAT: "O2Sat",
		HCO3: "HCO3",
		PCO2: "pCO2",
		PO2: "pO2",
		OXYGEN_THERAPY: "Sauerstofftherapie",
		ACTIVITIES: "Aktivitäten",
		QUALITY_MEASURES: "Qualitätsmaßnahmen",

		//Allergies
		NO_ALLERGIES_RECORDED: "Allergien nicht erfasst",
		NO_KNOWN_ALLERGIES: "Keine Allergien bekannt",
		ALLERGIES: "Allergien",
		HIDDEN_ALLERGIES: "Allergien ausgeblendet",
		HIDDEN_ALLERGIES_MSG_SOME: "Einige Allergien sind aufgrund von Zugriffsberechtigungen ausgeblendet.",
		HIDDEN_ALLERGIES_MSG_ALL: "Alle Allergien sind aufgrund von Zugriffsberechtigungen ausgeblendet.",
		ADD_ALLERGIES_MSG : "Allergien: Klicken Sie, um Allergien hinzuzufügen",

		//Drill Down
		DISPLAYING: "Anzeige",
		MEDICATIONS: "Medikationen",
		MEDICATION: "Medikation",
		PATIENT_CARE: "Patientenversorgung",
		ASSESSMENT: "Bewertung",
		OTHER: "Weitere",
		NO_ACTIVITIES: "Keine Aktivitäten",
		AND: "und",
		REASON_FOR_VISIT: "Aufnahmegrund",
		TARGETED_DISCHARGE: "Geplante Entlassung",
		LOS: "Aufenthaltsdauer",
		LOS_ABRV: "Aufenthaltsdauer",
		RESUSCITATION_STATUS: "Reanimationsstatus",
		ISOLATION: "Isolierung",
		DIET: "Kost",
		HIGH_RISKS: "Hohe Risiken",
		QUICK_LINKS: "Schnellzugriff",
		PLAN_OF_CARE: "Geplante Pflege",
		NEXT_2_HOURS: "2 Stunden",
		NEXT_4_HOURS: "4 Stunden",
		NEXT_12_HOURS: "12 Stunden",
		PROVIDER: "Klin. Mitarbeiter",
		LAUNCH_ORDERS: "Anforderungen aufrufen",
		PRINT_LABELS: "Etiketten drucken",
		COLLECT: "Abnahme erforderlich",
		VOLUME: "Volumen",
		INFORMATION_TAB: "Patienteninformationen",
		ACTIVITY_SUMMARY_TAB: "Geplante/Ungeplante",
		ACTIVITY_PRN_TAB: "Bei Bedarf/kontinuierlich",
		PLANS_OF_CARE_TAB: "Pflegepläne",
		NO_ACTIVITY_SELECTED: "Keine Aktivität ausgewählt",
		LOADING_ACTIVITY: "Ladevorgang",
		UNABLE_TO_LOAD_ACTIVITY: "Laden nicht möglich",
		CONTAINER_TYPE:"Probengefäßtyp",
		FILTERS: "Filter",
		NO_INFORMATION: "Keine Informationen",
		TASK: "Aufgabe",
		COMPLETED_TASK_WARNING: "Nach der letzten Anzeige wurde die Aufgabe aktualisiert. CareCompass wird zur Aktualisierung der Aufgabe auf den letzten Status aktualisiert.",

		//Patient Cell hover
		AGE: "Alter",
		DOB: "Geburtsdatum",
		SEX: "Geschlecht",
		MRN: "Patientennummer",
		FIN: "Fallnummer",
		DATE_OF_BIRTH: "Geburtsdatum",
		NAME: "Name",
		REASONFORVIP: "Grund",
		//Visit Cell Hover
		ADMISSION_DATE: "Aufnahmedatum",
		OBS: "Beobachtung",
		VIP: "VIP",

		//Medication Icon Hover
		MEDICATION_ACTIVITIES: "Medikationsaktivitäten",
		PATIENT_CARE_ACTIVITIES: "Pflegeaktivitäten",
		ASSESSMENT_ACTIVITIES: "Bewertungsaktivitäten",
		OTHER_ACTIVITIES: "Weitere Aktivitäten",

		//Toolbar
		PATIENT_LIST: "Patientenliste",
		LIST_MAINTENANCE: "Listenverwaltung",
		LAUNCH_LIST_MAINTENANCE: "Listenverwaltung aufrufen",
		ADD_PATIENT: "Patienten hinzufügen",
		LAUNCH_ADD_PATIENT: "Patientensuche aufrufen",
		ESTABLISH_RELATIONSHIPS: "Beziehungen erstellen",
		LAUNCH_ESTABLISH_RELATIONSHIPS: "Fenster &#39;Beziehungen&#39; aufrufen",
		ESTABLISH: "Einrichten",
		RELATIONSHIP: "Beziehung",
		MORE_INFO: "Weitere Info",

		//Error / No data screens
		SYSTEM_FAILURE: "Systemfehler",
		SHOW_DETAILS: "Details anzeigen",
		ACTIVITY_LIMIT: "Die Aktivitätenliste hat mehr als 250 Aktivitäten.",
		PATIENT_LIMIT: "Die Liste überschreitet die Anzahl der zulässigen Patienten.",
 		NO_ACTIVE_LISTS: "Es sind keine aktiven Listen vorhanden.",
		NO_ACTIVE_LISTS_LINE_2: "Um Ihre Patientenlisten zu verwalten, gehen Sie zu ",
		NO_PATIENTS: "In der Patientenliste sind keine Patienten vorhanden.",
		NO_PATIENTS_MEDICATION_ROUTE_FILTER: "Keine Patienten der Liste entsprechen den Filterkriterien.",
		NO_PATIENTS_ADD_PATIENT: "Patienten hinzufügen",
		NO_PATIENTS_MANAGE_LIST: "Um Ihre Patientenlisten zu verwalten, gehen Sie zu",
		NO_PATIENTS_LINE_3: "zur Patientenliste",
		PATIENT_ALREADY_PRESENT : "ist in der aktuellen Patientenliste bereits vorhanden.",
		NO_RELATIONSHIPS: "Keine Beziehungen vorhanden, die eingerichtet werden könnten.",
    		QUALITY_MEASURE_FAILURE: "Qualitätsmaßnahmen konnten nicht geladen werden",

		//Hovers
		ACTIVITY_TYPE: "Aktivitätstyp",
		COMMENT: "Kommentar",
		COMMENTS: "Kommentare",
		INSTRUCTION: "Anweisungen",
		URGENT: "Dies ist eine Sofort-Anforderung.",
		URGENT_HEADER: "Dringend",
		URGENT_ACTIVITY_HEADER: "Dringende Aktivität",
		URGENT_ACTIVITY: "Diese Aktivität ist mit einer dringenden Anforderung verknüpft",
		TIMED_STUDY_HEADER: "Zeitbegrenzte Studie",
		NURSE: "Noch nicht überprüft.",
		NURSE_HEADER: "Überprüfung durch Pflegepersonal",
		CRITICAL: "Kritisch",
		CRITICAL_VALUE: "Dieses Ergebnis enthält einen kritischen Wert.",
		HIGH: "Hoch",
		HIGH_VALUE: "Dieses Ergebnis enthält einen hohen Wert.",
		LOW: "Niedrig",
		LOW_VALUE: "Dieses Ergebnis enthält einen niedrigen Wert.",
		ABNORMAL: "Abnorm",		
		ABNORMAL_VALUE: "Dieses Ergebnis enthält einen abnormen Wert.",

		//Right Click
		REMOVE_PATIENT: "Patient entfernen",
		REMOVE_PATIENT_WARNING: "Möchten Sie diesen Patienten wirklich entfernen?",
		//Patient Cell
		NO_RELATIONSHIPS_EXISTS: "Keine Beziehungen vorhanden",
		NO_ENCOUNTER_EXISTS: "Kein Fall vorhanden",

		//New Data
		NEW_DATA: "Neue Ergebnisse und Anforderungen anzeigen.",
		NEW_DATA_HEADER: "Neue Ergebnisse/Anforderungen",
		RESULT: "Ergebnis",
		RESULTS: "Ergebnisse",
		VALUE: "Wert",
		DATE: "Datum",
		ORDER: "Anforderung",
		ORDERS: "Anforderungen",
		ACTION: "Aktion",
		ORDERED_BY: "Angefordert von",
		ENTERED_BY: "Eingegeben von",
		REVIEW: "Zur Überprüfung",
		NO_NEW_RESULTS: "Keine neuen Ergebnisse",
		NO_NEW_ORDERS: "Keine neuen Anforderungen",

		//Ventilator Cell
		RATE: "Rate",
		VOLUME: "Volumen",
		MODE: "Modus",

		//Oxygen Cell
		O2_TYPE: "Sauerstofftyp",
		FIO2: "FiO2",
		FLOW_RATE: "Flussrate",
		SPO2: "SpO2",

		//MISC
		OVERDUE: "Überfällig",
		CURRENT: "Aktuell",
		UNSCHEDULED: "Bei Bedarf",
        PRN: "Bedarfsmedikation",
        CONTINUOUS: "Dauerinfusion",
		QUALITY_MEASURE: "Qualitätsmaßnahme",
		ACTIVITY_TIMELINE: "Zeitleiste mit Aktivitäten",
		PRN_UNSCHEDULED: "Bedarfsmedikation/Bei Bedarf",
		INTERDISCIPLANARY: "Interdisziplinär",
		PRN_INDICATOR_HOVER_MSG: "Klicken, um Bedarfsmedikations-/Daueraktivitäten anzuzeigen",

		//Reason For Visit
		REASON_FOR_VISIT_ORDERED: "Angefordert",
		REASON_FOR_VISIT_REGISTERED: "Registriert",
		REASON_FOR_VISIT_DOCUMENTED: "Dokumentiert",

		//Buttons
		SELECT_ALL: "Alle auswählen",
		DESELECT_ALL: "Auswahl aufheben",
		MARKED_AS_REVIEWED: "Als &#39;Geprüft&#39; markieren",
		CANCEL: "Abbrechen",
		DONE: "Erledigt",
		NOT_DONE: "Nicht erledigt",
		DOCUMENT: "Dokument",
		INCOMPLETE: "Unvollständig",
		COMPLETE: "Abschließen",

		//Dates
		YEARS: "Jahre",
		MONTHS: "M",
		WEEKS: "W",
		DAYS: "T",
		HOURS: "Std.",
		MINUTES: "Min.",

		HOVER_YEARS: "Jahre",
		HOVER_MONTHS: "Monate",
		HOVER_WEEKS: "Wochen",
		HOVER_DAYS: "Tage",
		HOVER_HOURS: "Stunden",
		HOVER_MINUTES: "Minuten",

		TODAY: "Heute",
		TOMORROW: "Morgen",
		YESTERDAY: "Gestern",
		TWO_DAYS_AGO: "Vor 2 Tagen",
		THREE_DAYS_AGO: "Vor 3 Tagen",
		IN_2_DAYS: "In 2 Tagen",
		IN_3_DAYS: "In 3 Tagen",
		
		//Date formatting
		DATE_FORMAT_SHORTDATE: "dd.m.yyyy",
		DATE_FORMAT_SHORTDATE2: "dd.mm.yyyy",
		DATE_FORMAT_SHORTDATE3: "d. mmm",
		DATE_FORMAT_MEDIUMDATE: "d. mmm yyyy",
		DATE_FORMAT_MILITARY_TIME: "HH:MM",
		DATE_FORMAT_LONGDATETIME2: "dd.mm.yy HH:MM",
		DATE_FORMAT_LONGDATETIME3: "dd.mm.yyyy HH:MM",
		DATE_FORMAT_LONGDATETIME4: "d. mmm yyyy HH:MM",
		DATE_FORMAT_SHORTDATETIME: "d. mmm HH:MM",

		//Timeline
		SHOW_TIMELINE: "Zeitleiste mit Aktivitäten anzeigen.",
		HIDE_TIMELINE: "Zeitleiste mit Aktivitäten ausblenden.",
		MEDICATIONS_FILTERED: "Gefilterte Medikationsaktivitäten",
		MEDICATIONS_DISPLAYED: "Angezeigte Medikationsaktivitäten",
		ASSESSMENTS_FILTERED: "Gefilterte Bewertungsaktivitäten",
		ASSESSMENTS_DISPLAYED: "Angezeigte Bewertungsaktivitäten",
		PATIENTCARE_FILTERED: "Gefilterte Pflegeaktivitäten",
		PATIENTCARE_DISPLAYED: "Angezeigte Pflegeaktivitäten",
		OTHER_FILTERED: "Andere gefilterte Aktivitäten",
		OTHER_DISPLAYED: "Andere angezeigte Aktivitäten",
		TASKS_UPDATED_WARNING: "Nach der letzten Anzeige wurden die Aufgabe(n) aktualisiert. CareCompass wird zur Aktualisierung der Aufgabe(n) auf deren letzten Status aktualisiert.",
		
		//Quality Measure Content
		SUB_SCR: "SUB Alcohol Use Screening",
		SUB_INT: "SUB Alcohol Use Brief Intervention",
		SUB_SUB: "SUB Substance Use Treatment at Discharge",
		TOB_SCR: "TOB Tobacco Use Screening",
		TOB_TRE: "TOB Tobacco Use Treatment",
		TOB_DISCH: "TOB Tobacco Use Treatment at Discharge",
		TOB_ASSESS: "TOB Tobacco Use Assess after Discharge",
		IMM_PNEUM: "IMM Pneumococcal Immunization",
		IMM_INFLU: "IMM Influenza Immunization",
		SCIP_APP_PROPH: "SCIP Appropriate Prophylactic Antibiotic Received Prior to Surgery",
		SCIP_DISC: "SCIP Prophylactic Antibiotics Discontinued After Surgery",
		SCIP_GLUC: "SCIP Glucose PostOp",
		SCIP_HAIR: "SCIP Surgical Hair Removal",
		SCIP_BETA: "SCIP Surgical Beta Blocker Therapy",
		SCIP_URIN: "SCIP Urinary Catheter Removal",
		SCIP_PERI: "SCIP Surgical PeriOp Temperature",
		SCIP_PROPH: "SCIP VTE Prophylaxis",
		CAC_ASTH: "CAC Asthma Relievers",
		CAC_CORT: "CAC Corticosteroids",
		CAC_ASTH_HOME: "CAC Asthma Home Management",
		PN_BLOOD: "PN Blood Culture Collection",
		PN_ANTI: "PN Antibiotic Selection",
		PN_RISK: "PN Risk Factors",
		PN_DIAG: "PN Diagnostic Documentation",
		HF_LVSF: "HF LVSF Assessment",
		HF_ACEI: "HF ACEI/ARB for LVSD at Discharge",
		HF_DISCH: "HF Discharge Instructions",
		AMI_ASP: "AMI Aspirin at Arrival",
		AMI_FIB: "AMI Fibrinolytics Therapy",
		AMI_PRI: "AMI Primary PCI Balloon Time",
		AMI_DISCH: "AMI Aspirin at Discharge",
		AMI_BETA: "AMI Beta-Blocker at Discharge",
		AMI_ACEI: "AMI ACEI/ARB for LVSD at Discharge",
		AMI_STAT: "AMI Statin at Discharge",
		VTE_PROPH: "VTE Prophylaxis Received",
		VTE_OVERLAP: "VTE Overlap Therapy",
		VTE_UFH: "VTE UFH and Platelet Count",
		VTE_WAR: "VTE Warfarin Discharge Instructions",
		STK_PROPH: "STK VTE Prophylaxis",
		STK_THROM: "STK Thrombolytic Therapy",
		STK_ANTITHROM: "STK Antithrombotic by End of Hospital Day 2",
		STK_REHAB: "STK Rehabilitation Assessment",
		STK_ANTITHROM_DISCH: "STK Antithrombotic at Discharge",
		STK_ANTICOAG_DISCH: "STK Anticoagulants at Discharge",
		STK_STATIN_DISCH: "STK Statins at Discharge",
		STK_EDUC: "STK Stroke Education",
		PC_DELIV: "PC Vaginal Delivery and Cesarean Section",
		PC_STEROID: "PC Antenatal Steroid",
		PC_EXCL: "PC Exclusive Breast Milk Feeding",
		HBIPS_SCR: "HBIPS Admission Screening",
		HBIPS_RES: "HBIPS Physical Restraint",
		HBIPS_SEC: "HBIPS Seclusion",
		HBIPS_ANTI: "HBIPS Antipsychotics at DC",
		HBIPS_DISCH: "HBIPS Post Discharge Care Plan",
		AMI_ECG: "AMI Erstes EKG",
		PC_CESAREAN: "PC Kaiserschnitt",
		PC_HEALTH: "PC Gesundheit",
		SUB_ASSESS:"SUB Bewertung des Alkoholkonsums nach Entlassung",
		VTE_DIAG: "VTE Diagnostik",
		
		//Plan of Care cell
		NO_PLANS_EXIST: "Pläne hinzufügen",
		SUGGESTED_PLAN: "Vorgeschlagener Plan",
		SUGGESTED_PLANS: "Vorgeschlagene Pläne",
		MORE: "Weiteres",
		NO_CARE_PLANS_EXIST: "Es gibt keinen Pflegeplan",
		PLANNED_PLAN_LABEL: "Geplanter Plan",
		PLANNED_PLANS_LABEL: "Geplante Pläne",
		SUGGESTED_PLAN_LABEL: "Vorgeschlagener Plan",
		SUGGESTED_PLANS_LABEL: "Vorgeschlagene Pläne",
		INITIATED_PLAN_LABEL: "Initiierter Plan",
		INITIATED_PLANS_LABEL: "Initiierte Pläne",


		//Care Order/Result Hover
		DATE_TIME: "Datum/Zeit",
		DETAILS: "Details",
		DISPLAY: "Anzeigen",
		NORMAL_RANGE: "Normalbereich",
		COMMENT_BY: "Kommentar von",
		STATUS: "Status",
		
		//Speciment Collect container
		CONTAINER_DETAILS: "Probengefäßdetails",
		TASK_NO_LONGER_EXISTS: "Eine aktive Aufgabe wurde entfernt. Aktualisieren Sie CareCompass",
		
		//Allergy Hover
		ALLERGY: "Allergie",
		REACTION: "Reaktion",
		SEVERITY: "Schweregrad",
		
		//Help Button
		HELP_TEXT: "Für Hilfe zu CareCompass hier klicken",
		OVERDUE_ACTIVITY: "Überfällige Aktivitäten",
		SCHEDULED_ACTIVITY: "Geplante Aktivitäten",
		SHOW_POPOVER_MESSAGE: "Für die ausgewählten Filter sind keine Aktivitäten vorhanden",

		//Error Task Popover
		ERROR_TASK_POPOVER_LABEL: "Nachrichten der Apotheke",

		//Acknowledge button
		ACKNOWLEDGE_BUTTON: "Bestätigen"
	};
}();

