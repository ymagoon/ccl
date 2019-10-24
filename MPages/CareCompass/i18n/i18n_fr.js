﻿/* contains the strings to internationalize */

var i18n = function()
{
	return { 
		//Headers
		LOCATION: "Emplacement",
		PATIENT: "Patient",
		VISIT: "Séjour",
		CARE_TEAM: "Équipe de soins",
		ACUITY: "Niveau de gravité",
		VENTILATOR: "Paramètres du respirateur",
		ERROR_TASK: "Messages de la pharmacie",
		
		//Blood Gases
		ARTERIAL_BLOOD_GASES: "Gaz du sang artériel",
		PH: "pH",
		O2SAT: "Saturation de l&#39;oxygène",
		HCO3: "HCO3",
		PCO2: "PaCO2",
		PO2: "PO2",
		OXYGEN_THERAPY: "Oxygénothérapie",
		ACTIVITIES: "Activités",
		QUALITY_MEASURES: "Mesures de qualité",

		//Allergies
		NO_ALLERGIES_RECORDED: "Aucune allergie enregistrée",
		NO_KNOWN_ALLERGIES: "Aucune allergie connue",
		ALLERGIES: "Allergies",
		HIDDEN_ALLERGIES: "Allergies masquées",
		HIDDEN_ALLERGIES_MSG_SOME: "Certaines allergies sont masquées à cause des privilèges.",
		HIDDEN_ALLERGIES_MSG_ALL: "Toutes les allergies sont masquées à cause des privilèges.",
		ADD_ALLERGIES_MSG : "Allergies : Cliquez pour ajouter des allergies",

		//Drill Down
		DISPLAYING: "Affichage",
		MEDICATIONS: "Médicaments",
		MEDICATION: "Médicament",
		PATIENT_CARE: "Soins du patient",
		ASSESSMENT: "Évaluation",
		OTHER: "Autre",
		NO_ACTIVITIES: "Aucune activité",
		AND: "et",
		REASON_FOR_VISIT: "Motif de venue",
		TARGETED_DISCHARGE: "Date cible de sortie",
		LOS: "Durée du séjour",
		LOS_ABRV: "Durée du séjour",
		RESUSCITATION_STATUS: "Statut de réanimation",
		ISOLATION: "Isolement",
		DIET: "Régime",
		HIGH_RISKS: "Risques élevés",
		QUICK_LINKS: "Liens rapides",
		PLAN_OF_CARE: "Plan de soins",
		NEXT_2_HOURS: "2 heures",
		NEXT_4_HOURS: "4 heures",
		NEXT_12_HOURS: "12 heures",
		PROVIDER: "Soignant",
		LAUNCH_ORDERS: "Lancer les prescriptions",
		PRINT_LABELS: "Imprimer les étiquettes",
		COLLECT: "À prélever",
		VOLUME: "Volume",
		INFORMATION_TAB: "Informations sur le patient",
		ACTIVITY_SUMMARY_TAB: "Planifié/Non planifié",
		ACTIVITY_PRN_TAB: "PRN/Continu(e)",
		PLANS_OF_CARE_TAB: "Plans de soins",
		NO_ACTIVITY_SELECTED: "Aucune activité sélectionnée",
		LOADING_ACTIVITY: "Chargement",
		UNABLE_TO_LOAD_ACTIVITY: "Échec du chargement",
		CONTAINER_TYPE:"Type de récipient",
		FILTERS: "Filtres",
		NO_INFORMATION: "Aucune information",
		TASK: "Tâche",
		COMPLETED_TASK_WARNING: "Cette tâche a été mise à jour depuis la dernière consultation. CareCompass sera actualisé pour mettre à jour le statut de la tâche.",

		//Patient Cell hover
		AGE: "Âge",
		DOB: "Date de naissance",
		SEX: "Sexe",
		MRN: "IPP",
		FIN: "N° de séjour",
		DATE_OF_BIRTH: "Date de naissance",
		NAME: "Nom",
		REASONFORVIP: "Motif",
		//Visit Cell Hover
		ADMISSION_DATE: "Date d&#39;admission",
		OBS: "Observation",
		VIP: "VIP",

		//Medication Icon Hover
		MEDICATION_ACTIVITIES: "Activités médicamenteuses",
		PATIENT_CARE_ACTIVITIES: "Activités de soins du patient",
		ASSESSMENT_ACTIVITIES: "Activités d&#39;évaluation",
		OTHER_ACTIVITIES: "Autres activités",

		//Toolbar
		PATIENT_LIST: "Liste de patients",
		LIST_MAINTENANCE: "Maintenance des listes",
		LAUNCH_LIST_MAINTENANCE: "Lancer Maintenance des listes",
		ADD_PATIENT: "Ajouter un patient",
		LAUNCH_ADD_PATIENT: "Lancer Recherche de patient",
		ESTABLISH_RELATIONSHIPS: "Établir des relations",
		LAUNCH_ESTABLISH_RELATIONSHIPS: "Lancer la boîte de dialogue Relations",
		ESTABLISH: "Établir",
		RELATIONSHIP: "Relation",
		MORE_INFO: "Informations supplémentaires",

		//Error / No data screens
		SYSTEM_FAILURE: "Erreur système",
		SHOW_DETAILS: "Afficher les détails",
		ACTIVITY_LIMIT: "La liste d&#39;activités contient plus de 250 activités.",
		PATIENT_LIMIT: "Cette liste excède le nombre de patients autorisés.",
 		NO_ACTIVE_LISTS: "Il n&#39;existe aucune liste active.",
		NO_ACTIVE_LISTS_LINE_2: "Pour gérer vos listes de patients, accédez à ",
		NO_PATIENTS: "La liste de patients sélectionnée ne contient aucun patient.",
		NO_PATIENTS_MEDICATION_ROUTE_FILTER: "Il n&#39;existe aucun patient dans la liste qui correspond aux critères de recherche.",
		NO_PATIENTS_ADD_PATIENT: "Ajouter un patient",
		NO_PATIENTS_MANAGE_LIST: "Pour gérer vos listes de patients, accédez à",
		NO_PATIENTS_LINE_3: "à la liste de patients.",
		PATIENT_ALREADY_PRESENT : "existe déjà dans le liste actuelle de patients.",
		NO_RELATIONSHIPS: "Il n&#39;y a aucune relation disponible à établir.",
    		QUALITY_MEASURE_FAILURE: "Le chargement des mesures de qualité a échoué.",

		//Hovers
		ACTIVITY_TYPE: "Type d&#39;activité",
		COMMENT: "Commentaire",
		COMMENTS: "Commentaires",
		INSTRUCTION: "Instruction",
		URGENT: "Ceci est une prescription prioritaire.",
		URGENT_HEADER: "Urgent",
		URGENT_ACTIVITY_HEADER: "Activité urgente",
		URGENT_ACTIVITY: "Cette activité est associée à une prescription urgente",
		TIMED_STUDY_HEADER: "Heure spécifique",
		NURSE: "Cette prescription n&#39;a encore été révisée.",
		NURSE_HEADER: "Révision par le personnel infirmier",
		CRITICAL: "Critique",
		CRITICAL_VALUE: "Ce résultat a une valeur critique.",
		HIGH: "Élevée",
		HIGH_VALUE: "Ce résultat a une valeur élevée.",
		LOW: "Faible",
		LOW_VALUE: "Ce résultat a une valeur basse.",
		ABNORMAL: "Anormal",		
		ABNORMAL_VALUE: "Ce résultat a une valeur anormale.",

		//Right Click
		REMOVE_PATIENT: "Supprimer le patient",
		REMOVE_PATIENT_WARNING: "Voulez-vous vraiment supprimer ce patient ?",
		//Patient Cell
		NO_RELATIONSHIPS_EXISTS: "Il n&#39;existe aucune relation",
		NO_ENCOUNTER_EXISTS: "Il n&#39;existe aucun séjour",

		//New Data
		NEW_DATA: "Afficher les nouveaux résultats et nouvelles prescriptions.",
		NEW_DATA_HEADER: "Nouveaux résultats/Nouvelles prescriptions",
		RESULT: "Résultat",
		RESULTS: "Résultats",
		VALUE: "Valeur",
		DATE: "Date",
		ORDER: "Prescription",
		ORDERS: "Prescriptions",
		ACTION: "Action",
		ORDERED_BY: "Prescrit par",
		ENTERED_BY: "Saisi par",
		REVIEW: "Éléments à réviser",
		NO_NEW_RESULTS: "Aucun nouveau résultat",
		NO_NEW_ORDERS: "Aucune nouvelle prescription",

		//Ventilator Cell
		RATE: "Débit",
		VOLUME: "Volume",
		MODE: "Mode",

		//Oxygen Cell
		O2_TYPE: "Type O2",
		FIO2: "FiO2",
		FLOW_RATE: "Débit",
		SPO2: "SpO2",

		//MISC
		OVERDUE: "En retard",
		CURRENT: "Actuel",
		UNSCHEDULED: "Non planifié",
        PRN: "PRN",
        CONTINUOUS: "Continu",
		QUALITY_MEASURE: "Mesure de la qualité",
		ACTIVITY_TIMELINE: "Calendrier des activités",
		PRN_UNSCHEDULED: "PRN/Non planifié",
		INTERDISCIPLANARY: "Interdisciplinaire",
		PRN_INDICATOR_HOVER_MSG: "Cliquez pour consulter les activités PRN/continues",

		//Reason For Visit
		REASON_FOR_VISIT_ORDERED: "Prescrit",
		REASON_FOR_VISIT_REGISTERED: "Enregistré",
		REASON_FOR_VISIT_DOCUMENTED: "Documenté",

		//Buttons
		SELECT_ALL: "Sélectionner tout",
		DESELECT_ALL: "Désélectionner tout",
		MARKED_AS_REVIEWED: "Marquer comme révisé",
		CANCEL: "Annuler",
		DONE: "Effectué",
		NOT_DONE: "Non effectué",
		DOCUMENT: "Documenter",
		INCOMPLETE: "Incomplet",
		COMPLETE: "Terminer",

		//Dates
		YEARS: "ans",
		MONTHS: "m",
		WEEKS: "sem",
		DAYS: "jr(s)",
		HOURS: "h",
		MINUTES: "min",

		HOVER_YEARS: "années",
		HOVER_MONTHS: "mois",
		HOVER_WEEKS: "semaines",
		HOVER_DAYS: "jours",
		HOVER_HOURS: "heures",
		HOVER_MINUTES: "minutes",

		TODAY: "Aujourd&#39;hui",
		TOMORROW: "Demain",
		YESTERDAY: "Hier",
		TWO_DAYS_AGO: "Il y a 2 jours",
		THREE_DAYS_AGO: "Il y a 3 jours",
		IN_2_DAYS: "Dans 2 jours",
		IN_3_DAYS: "Dans 3 jours",
		
		//Date formatting
		DATE_FORMAT_SHORTDATE: "dd/mm/yyyy",
		DATE_FORMAT_SHORTDATE2: "dd/mm/yyyy",
		DATE_FORMAT_SHORTDATE3: "d mmm",
		DATE_FORMAT_MEDIUMDATE: "d mmm yyyy",
		DATE_FORMAT_MILITARY_TIME: "HH:MM",
		DATE_FORMAT_LONGDATETIME2: "dd/mm/yy HH:MM",
		DATE_FORMAT_LONGDATETIME3: "dd/mm/yyyy HH:MM",
		DATE_FORMAT_LONGDATETIME4: "d mmm yyyy HH:MM",
		DATE_FORMAT_SHORTDATETIME: "d mmm HH:MM",

		//Timeline
		SHOW_TIMELINE: "Afficher le calendrier des activités.",
		HIDE_TIMELINE: "Masquer le calendrier des activités.",
		MEDICATIONS_FILTERED: "Activités médicamenteuses filtrées",
		MEDICATIONS_DISPLAYED: "Activités médicamenteuses affichées",
		ASSESSMENTS_FILTERED: "Activités d&#39;évaluation filtrées",
		ASSESSMENTS_DISPLAYED: "Activités d&#39;évaluation affichées",
		PATIENTCARE_FILTERED: "Activités de soins du patient filtrées",
		PATIENTCARE_DISPLAYED: "Activités de soins du patient affichées",
		OTHER_FILTERED: "Autres activités filtrées",
		OTHER_DISPLAYED: "Autres activités affichées",
		TASKS_UPDATED_WARNING: "Une ou plusieurs tâches ont été mises à jour depuis la dernière consultation. CareCompass sera actualisé pour mettre à jour le statut de ces tâches.",
		
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
		AMI_ECG: "Infarctus du myocarde aigu – ECG initial",
		PC_CESAREAN: "Soins périnatals – Césarienne",
		PC_HEALTH: "Soins périnatals – Santé",
		SUB_ASSESS:"Substance – Évaluation de la consommation d&#39;alcool après la sortie",
		VTE_DIAG: "Diagnostics de la thromboembolie veineuse",
		
		//Plan of Care cell
		NO_PLANS_EXIST: "Ajouter des protocoles",
		SUGGESTED_PLAN: "protocole suggéré",
		SUGGESTED_PLANS: "protocoles suggérés",
		MORE: "plus",
		NO_CARE_PLANS_EXIST: "Aucun plan de soins n&#39;existe.",
		PLANNED_PLAN_LABEL: "Protocole planifié",
		PLANNED_PLANS_LABEL: "Protocoles planifiés",
		SUGGESTED_PLAN_LABEL: "Protocole suggéré",
		SUGGESTED_PLANS_LABEL: "Protocoles suggérés",
		INITIATED_PLAN_LABEL: "Protocole démarré",
		INITIATED_PLANS_LABEL: "Protocoles démarrés",


		//Care Order/Result Hover
		DATE_TIME: "Date/Heure",
		DETAILS: "Détails",
		DISPLAY: "Affichage",
		NORMAL_RANGE: "Plage normale",
		COMMENT_BY: "Commentaire de",
		STATUS: "Statut",
		
		//Speciment Collect container
		CONTAINER_DETAILS: "Données du récipient",
		TASK_NO_LONGER_EXISTS: "Une tâche en cours d&#39;utilisation a été supprimée.  Veuillez actualiser CareCompass",
		
		//Allergy Hover
		ALLERGY: "Allergie",
		REACTION: "Réaction",
		SEVERITY: "Gravité",
		
		//Help Button
		HELP_TEXT: "Cliquez ici pour afficher l&#39;aide de CareCompass.",
		OVERDUE_ACTIVITY: "Activités en retard",
		SCHEDULED_ACTIVITY: "Activités planifiées",
		SHOW_POPOVER_MESSAGE: "Aucune activité ne correspond aux filtres sélectionnés.",

		//Error Task Popover
		ERROR_TASK_POPOVER_LABEL: "Messages de la pharmacie",

		//Acknowledge button
		ACKNOWLEDGE_BUTTON: "Confirmer"
	};
}();

