/**
 * Locale file for the formatting utilized across all English locales.
 * Locales supported:
 * French - France (fr-fr)
 * 
 * Locales available for support:
 * French - Belgium (fr-be)
 * French - Canada (fr-ca)
 * French - Luxembourg (fr-lu)
 * French - Switzerland (fr-ch)
 */
if (typeof MPAGE_LC == "undefined") 
    var MPAGE_LC = {};

MPAGE_LC.fr_FR = {
    "decimal_point": ",",
    "thousands_sep": " ",
    "grouping": "3",
    
    // Some common date/time format strings (formats for usage with date.format.js)
    time24hr: "HH:MM:ss",
    time24hrnosec: "HH:MM",
    shortdate2yr: "d/m/yy",
    fulldate2yr: "dd/mm/yy",
    fulldate4yr: "dd/mm/yyyy",
    fullmonth4yrnodate: "mm/yyyy",
    full4yr: "yyyy",
    fulldatetime2yr: "dd/mm/yy HH:MM",
    fulldatetime4yr: "dd/mm/yyyy HH:MM",
    fulldatetimenoyr: "dd/mm h:MM TT"
};
﻿
if (typeof i18n == "undefined") //do not internationalize this line
    var i18n = {};

/**
 * NOTE: DO NOT ADD ADDITIONAL ITEMS TO THIS OBJECT
 * @deprecated
 */
i18n = {
    REQUEST: "Requête",
    //Return Status:
    NO_RESULTS_FOUND: "Aucun résultat n'a été trouvé.",
    NO_DATA: "Aucune donnée",
    
    //Error Status:
    ERROR_RETREIVING_DATA: "Erreur de récupération des résultats",
    ERROR_OPERATION: "Nom de l'opération",
    ERROR_OPERATION_STATUS: "Statut de l'opération",
    ERROR_TARGET_OBJECT: "Nom de l'objet cible",
    ERROR_TARGET_OBJECT_VALUE: "Valeur de l'objet cible",
    //Customization
    CLEAR_PREFERENCES: "Effacer les préférences",
    SAVE_PREFERENCES: "Enregistrer les préférences",
    CUSTOMIZE: "Personnaliser",
    USER_CUSTOMIZATION: "Personnalisation par l'utilisateur",
    SAVE_PREF_SUCCESS: "Préférences enregistrées avec succès",
    CLEAR_PREF_SUCCESS: "Préférences effacées avec succès",
    
    //Commons
    GO_TO_TAB: "Aller à l''onglet {0}",
    ESTIMATED_DISCHARGE_DATE: "Date de sortie prévue",
    LOADING_DATA: "Chargement",
    RENDERING_DATA: "Rendu",
    NAME: "Nom",
    DETAILS: "Détails",
    ONSET_DATE: "Date de début",
    COMMENTS: "Commentaires",
    DATE_TIME: "Date/Heure",
    ANNOTATED_DISPLAY: "Nom d'affichage annoté",
    ANNOTATED_DISPLAY_NAME: "Affichage annoté",
    ARRIVAL: "Arrivée",
    CODE: "Code",
    LATEST: "Dernier résultat",
    WITHIN: "dans",
    PREVIOUS: "Précédent",
    SINCE: "Depuis",
    DISCLAIMER: "Cette page ne comprend pas toutes les informations sur le séjour.",
    USER_CUST_DISCLAIMER: "Veuillez prendre en compte la résolution de l'écran avant de sélectionner la vue répartie sur trois colonnes.",
    RESULT: "Résultat",
    STATUS: "Statut",
    DATE: "Date",
    ACTIVE: "Actif",
    ENTERED: "Saisi",
    FLAGGED: "Marqué",
    DISCONTINUED: "Arrêté",
    ADMIN_LAST_N_HOURS: "Administré au cours des dernières {0} heures",
    LAST_N_HOURS: "{0} dernières heures",
    LAST_N_DAYS: "{0} derniers jours",
    LAST_N_MONTHS: "{0} derniers mois",
    LAST_N_YEARS: "{0} dernières années",
    LAST_N_WEEKS: "{0} dernières semaines",
    NEXT_N_HOURS: "{0} prochaines heures",
    WITHIN_MINS: "{0} min",
    WITHIN_HOURS: "{0} hres",
    WITHIN_DAYS: "{0} jours",
    WITHIN_WEEKS: "{0} sem.",
    WITHIN_MONTHS: "{0} mois",
    WITHIN_YEARS: "{0} ans",
    SELECTED_VISIT: "Consultation sélectionnée",
    All_VISITS: "Toutes les consultations",
    SELECTED_N_VISIT: "{0} pour la consultation sélectionnée",
    ALL_N_VISITS: "{0} pour toutes les consultations",
    PRIMARY_RESULTS: "Résultats principaux",
    SECONDARY_RESULTS: "Résultats secondaires",
    FROM: "De",
    COLLECTED: "Prélevé",
    DONE: "Effectué",
    NOT_DONE: "Non effectué",
    HELP: "Aide",
    ADD: "Ajouter",
    TEXT: "Texte",
    //Errors
    JS_ERROR: "Erreur JavaScript",
    DISCERN_ERROR: "Erreur Discern",
    MESSAGE: "Message",
    NUMBER: "Numéro",
    DESCRIPTION: "Description",
    //expand collapse
    SHOW_SECTION: "Développer",
    HIDE_SECTION: "Réduire",
    EXPAND_ALL: "Développer tout",
    COLLAPSE_ALL: "Réduire tout",
    LOCATION: "Emplacement",
    //Demographic	
    DOB: "Date de naissance",
    SEX: "Sexe",
    AGE: "Âge",
    MRN: "IPP",
    FIN: "N° de séjour",
    VISIT_REASON: "Motif de venue",
    ISOLATION: "Isolement",
    LAST_DOC_DT_TM: "Date/Heure de la dernière documentation",
    LAST_DOC_BY: "Dernière documentation par",
    
    
    //Allergy
    ALLERGY: "Allergie",
    ALLERGY_NAME: "Nom de l'allergie",
    REACTION: "Réaction",
    SEVERITY: "Gravité",
    
    //Diagnoses
    DIAGNOSES: "Diagnostic",
    DIAGNOSES_NAME: "Nom du diagnostic",
    DIAGNOSES_DATE: "Date du diagnostic",
    
    //Problems
    PROBLEM: "Problème",
    PROBLEMS: "Problèmes",
    PROBLEMS_NAME: "Nom des problèmes",
    PROBLEMS_DETAILS: "Informations sur les problèmes",
    RESPONSIBLE_PROVIDER_NAME: "Soignant responsable",
    
    //intake and output
    TOTAL_FL_INTAKE: "Entrées de liquide totales",
    TOTAL_FL_OUTPUT: "Sorties de liquide totales",
    TOTAL_FL_BAL: "Équilibre électrolytique total",
    IO: "Entrées et sorties",
    LAST_3_DAYS: "Les 3 derniers jours de la consultation sélectionnée",
    NOTE_INDICATOR: "* Indique une journée sans une période de mesure de 24 heures complète",
    
    //Growth Chart
    PERCENTILE: "Percentile",
    ZSCORE: "Note Z",
    
    //Vitals & Labs
    VITALS_TABLE: "Tableau des signes vitaux",
    BLOOD_PRESSURE: "Pression artérielle",
    OTHER_RESULTS: "Autres résultats",
    TEMPERATURE: "Température",
    DEGC: "DegC",
    DEGF: "DegF",
    HEART_RATE: "Hre",
    MIN: "Min.",
    MAX: "Max.",
    NORMAL_RANGE: "Plage normale",
    CRITICAL_RANGE: "Plage critique",
    NORMAL_LOW: "Normal faible",
    NORMAL_HIGH: "Normal élevé",
    CRITICAL_LOW: "Critique faible",
    CRITICAL_HIGH: "Critique élevé",
    HI_IND: "É",
    LOW_IND: "F",
    CRIT_IND: "C",
    UNIT_OF_MEASURE: "Unité de mesure",
    TWO_DAY_MAX: "48 heures maximum",
    //graph
    CLOSE_X: "Fermer X",
    LABRAD: "Laboratoire/Radiologie",
    
    //Restraints
    RESTRAINTS: "Contentions",
    RESTRAINT: "Contention",
    RESTRAINT_APPLIED: "Contention appliquée",
    RESTRAINT_TYPE: "Type de contention",
    RESTRAINT_LOCATION: "Emplacement de la contention",
    RESTRAINT_DEATILS: "Informations sur la contention",
    RESTRAINT_REASON: "Motif de la contention",
    ORDER_TYPE: "Type de prescription",
    ORDER_DATE_TIME: "Date/Heure de prescription",
    EXPIRATION_DATE_TIME: "Date/Heure de péremption",
    
    //Documents
    DOCUMENTATION_DETAILS: "Informations sur la documentation",
    NOTE_NAME: "Intitulé de la note",
    SUBJECT: "Objet",
    NOTE_TYPE: "Type de note",
    AUTHOR: "Auteur",
    DOCUMENT_FAVS: "Favoris introuvables",
    DOCUMENTS: "Documents",
    //Overdue Tasks
    OVERDUE_TASKS: "Tâches en retard",
    
    //measurements and weights
    MEASUREMENT_DETAILS: "Détails des mesures",
    
    //Patient Assessment
    PATIENT_ASSESSMENT: "Évaluation du patient",
    PSYCHOSOCIAL_FACTORS: "Facteurs psychosociaux",
    RESPIRATORY: "Respiratoire",
    CARDIO: "Cardiovasculaire",
    PAIN: "Douleur",
    NEURO: "Neuro",
    GI: "GI",
    GU: "GU",
    MUSCULOSKELETAL: "Appareil musculo-squelettique",
    INTEGUMENTARY: "Tégumentaire",
    GENERAL_ASSESSMENT: "Évaluation générale",
    
    //Patient Family Education
    PATIENT_FAMILY_EDUCATION_DETAILS: "Informations sur l'éducation du patient/de la famille",
    PATIENT_FAMILY_EDUCATION: "Éducation du patient/de la famille",
    
    //Diagnostics
    DIAGNOSTIC: "Examen et test",
    DIAGNOSTIC_DETAILS: "Informations sur l'examen/le test",
    STUDY: "Étude",
    EKG: "ECG",
    CHEST: "Thorax",
    OTHER_DIAGNOSTICS: "Autres examens et tests",
    CHEST_ABD_XR: "Radio thoracique/abdominale",
    
    //Respiratory
    MODEL: "Modèle",
    DATE_TIME_INITIATED: "Date/Heure de lancement",
    VENTILATOR_MODE: "Mode respirateur",
    SET_TIDAL_VOLUME: "Définir le volume courant",
    PEEP: "PEEP",
    FIO2: "FiO2",
    SET_RATE: "Définir le débit",
    FLOW_RATE: "Débit",
    TOTAL_RESPIRATORY_RATE: "Fréquence respiratoire totale",
    TOTAL_MINUTE_VOLUME: "Ventilation minute totale",
    INSPIRATORY_TIME_SET: "Durée inspiratoire",
    INSPIRATORY_TIME_DELIVERED: "% du temps inspiratoire",
    RESPIRATORY_DISCLAIMER: "Les résultats de gaz du sang affichés doivent être synchronisés avec la source d'oxygène FiO2 et/ou le débit d'oxygène qui était administré au patient au moment où l'échantillon a été prélevé.",
    UNKNOWN: "Inconnu",
    BE: "B.E.",
    PREVIOUS_ABG_RESULTS: "Résultats GDS précédents",
    LATEST_ABG_RESULTS: "Résultats GDS les plus récents",
    VENTILATOR_INFO: "Données du respirateur",
    NO_RES_LAST_24_HRS: "-- Aucun résultat n'a été trouvé au cours des dernières 24 heures --",
    NO_PREV_RES_LAST_24_HRS: "-- Aucun résultat précédent n'a été trouvé au cours des dernières 24 heures --",
    NO_RES_LAST_LOOKBACK_HRS: "--Aucun résultat n'existe dans la période de recherche rétrospective--",
    
    //Blood Info
    TRANSFUSIONS: "Transfusions",
    BLOOD_TYPE_RH: "Sang de type Rh",
    MOTHER: "Mère",
    BABY: "Bébé",
    PHOTOTHERAPY: "Photothérapie",
    PHOTOTHERAPY_RESULT: "Résultat",
    TRANSFUSION_RESULT_VAL: "Valeur du résultat",
    TRANSFUSION_DATE: "Date de transfusion",
    TRANSFUSION_EVENT_CD: "Event code de transfusion",
    
    
    //Medications
    MEDICATIONS: "Médicaments",
    MED_DETAIL: "Informations sur le médicament",
    MED_NAME: "Médicament",
    REQUESTED_START: "Début demandé",
    ORIG_DT_TM: "Date/Heure de la prescription d'origine",
    LAST_DOSE_DT_TM: "Dernière dose",
    NEXT_DOSE_DT_TM: "Dose suivante",
    START_DT_TM: "Date/Heure de début",
    STOP_DT_TM: "Date/Heure d'arrêt",
    STOP_REASON: "Motif d'arrêt",
    STATUS: "Statut",
    LAST_GIVEN: "Dernière administration",
    NEXT_DOSE: "Dose suivante",
    SCHEDULED: "Planifié",
    CONTINOUS: "Continu",
    SUSPENDED: "Interrompu",
    PRN: "PRN",
    UNSCHEDULED: "Non planifié",
    RESPONSIBLE_PROVIDER: "Prescription saisie par",
    COMPLIANCE: "Observance",
    SCHEDULED_INH: "Planifié/inhalé",
    PRN_ALL: "PRN - Tous",
    PRN_48: "PRN - Administrés au cours des dernières 48 heures",
    INHALED: "Inhalation",
    NEBULIZED: "Nébulisateur",
    INHALALATION: "Inhalation",
    HI_FLOW_NEB: "Nébulisation haut débit",
    ADMINISTERED: "Administré",
    PRN_UNSCHEDULED: "PRN/Non planifié disponible",
    //Orders
    ORDER_DETAILS: "Informations sur la prescription",
    ORDER_NAME: "Prescription",
    ORDER_DATE: "Date/Heure de prescription",
    ORDER_STATUS: "Statut",
    ORDER_PHYS: "Prescrit par",
    DISCONTINUED: "Arrêté",
    ORDERED: "Prescrit",
    CLINICAL_DISPLAY: "Affichage clinique",
    ORDERS: "Prescriptions",
    
    //Weights and Measurements
    MEASUREMENT_DETAILS: "Détails des mesures",
    CHANGE: "Modifier",
    ADMISSION: "Admission",
    
    //Patient Information
    RFV: "Motif de venue",
    ROOM_BED: "Chambre/lit",
    ADMIT_DIAG: "Diagnostic à l'admission",
    ADMIT_DATE: "Date d'admission",
    PRIM_PHYS: "Médecin traitant",
    ATTEND_PHYS: "Médecin responsable",
    EMER_CONTACT: "Personne à prévenir en cas d'urgence",
    EMER_NUMBER: "N° de tel en cas d'urgence",
    CODE_STATUS: "Statut de code",
    LAST_VISIT: "Dernière consultation",
    LAST: "Dernière",
    VISIT: "Consultation",
    CONTACTS: "Contacts",
    
    //Micro
    SOURCE_BODY_SITE: "Source/Site de prélèvement",
    COLLECTED_DATE_TIME: "Date/Heure de prélèvement",
    SUSCEPTIBILITY: "Sensibilité",
    ASSOCIATED_MICRO_REPORTS: "Rapports de microbiologie associés",
    ASSOCIATED_MICRO_STAIN_REPORTS: "Rapports de coloration microbiologique associés",
    GROWTH_IND: "Indice de croissance",
    SUSC_HEADER: "SC",
    POS: "POS.",
    NEG: "NÉG.",
    GROWTH: "Croissance",
    NO_GROWTH: "Absence de croissance",
    NORMALITY: "Normalité",
    SOURCE_SITE: "Source/Site de prélèvement",
    SOURCE: "Source",
    COLLECTED_WITHIN: "Prélèvement dans",
    MICRO: "Microbiologie",
    
    //Patient Background
    ADVANCE_DIRECTIVE: "Directives anticipées",
    ISOLATION: "Isolement",
    ACTIVITY_ORDER: "Prescription d'activité",
    FALL_RISK_SCORE: "Échelle de risque de chute",
    SEIZURE_PRECAUTIONS: "Précautions lors de crises",
    DIET: "Régime",
    PAIN_SCORE: "Niveau de douleur",
    GESTATIONAL_AGE: "Âge gestationnel",
    PARA_GRAVIDA: "Accouchement/Grossesse",
    TRANSPLANT_DATE: "Date de la transplantation",
    CODE_STATUS: "Statut de code",
    SERVICE: "Service",
    ATTENDING_PHYSICIAN: "Médecin responsable",
    PARENT_PART_TYPE: "Relation du tuteur légal",
    TARGET_DISCH_DT_TM: "Date/Heure cibles de sortie",
    CARE_LEVEL: "Niveau de soins",
    RESUSITATION_STATUS: "État de réanimation",
    ASSISTIVE_DEVICES: "Matériel d'aide",
    MULTIPLE: "Multiple",
    DEVICE_DETAILS: "Données du dispositif",
    
    //Lines Tubes Drains,
    LINES: "Voies",
    TUBES_DRAINS: "Tubes/Drains",
    LAST_DOC_DT_TM: "Date/Heure de la dernière documentation",
    INIT_DOC_DT_TM: "Date/Heure de la première documentation",
    LAST_DOC: "Dernière documentation",
    LAST_DOC_WITHIN: "Dernières documentations au cours des",
    
    //EVENTS
    EVENTS: "Événements",
    
    //Timeline Misc
    ACTIVITY_LIST: "Liste d'activités",
    INCOMPLETE_ORDERS: "Prescription(s) incomplète(s)",
    RESULTS_RETURNED: "Résultat(s) retourné(s)",
    COMPLETE_ORDERS: "Remplir la ou les prescriptions",
    MEDS_ADMINISTERED: "Médicament(s) administré(s)",
    CRITICAL_RESULTS: "Résultats critiques",
    FIRST_24HRS_ED_VISIT: "Les résultats représentent les 24 premières heures de la consultation aux urgences",
    RESULTS_SINCE_ADMITTED: "Résultats depuis le moment de l'admission",
    HIDE_LEGEND: "Masquer la légende",
    SHOW_LEGEND: "Afficher la légende",
    COMPLETED: "Terminé",
    EXAM: "Examen",
    ADMINISTERED: "Administré",
    NO_RESULTS: "Aucun résultat",
    LAST_PARTICIPATION: "Dernière participation",
    //Nursing Communication MPage specific strings
    SITUATION_BACKGROUND: "Situation/Antécédents",
    ASSESSMENT: "Évaluation",
    RECOMMENDATION: "Recommandation",
    NURSING_COMMUNICATION: "Communication des soins",
    
    //MPage title strings
    ED_SUMMARY: "Résumé du séjour aux urgences", //ED Summary v2
    ICU_SUMMARY: "Résumé du séjour aux soins intensifs", //ICU Summary
    INPATIENT_SUMMARY: "Résumé d'hospitalisation", //Inpatient Summary v2
    DISCHARGE_SUMMARY: "Résumé de sortie",
    
    
    //Oxygenation and Ventilation Component
    O2_FLOW_RATE: "Débit 02",
    PREVIOUS_BLOOD_GAS_ARTERIAL_RESULTS: "Résultats de l'examen de gaz du sang précédent",
    LATEST_BLOOD_GAS_ARTERIAL_RESULTS: "Résultats de l'examen de gaz du sang le plus récent",
    
    
    //Blood Group Component
    TRANSFUSIONS: "Transfusions",
    DATE_PERFORMED: "Date d'exécution",
    
    //Care Manager UM Page Name
    CAREMANAGERUMPAGE: "Résumé de la révision de l'utilisation",
    
    //Dicharge Care Management Summary
    DISCHARGECAREMANAGEMENT: "Résumé de la gestion des soins à la sortie",
    
    //Care Manager Discharge Planning
    CUR_DOC_PLAN_SCREEN: "Protocole/Test de dépistage actuel documenté",
    PLANNED_DISCHARGE_DISP: "Modalités de sortie planifiées",
    TRANSPORATION_ARRANGED: "Transport organisé",
    LOCATION: "Emplacement",
    TRANSFER_OF_CARE_PACKET: "Transfert de la pochette de soins",
    MIM_SIGNED: "Document sur les droits du patient signé à l'admission",
    DISCHARGE_MIM_SIGNED: "Document sur les droits du patient donné à la sortie",
    DISCHARE_APPEALDELIVERED: "Appel d'une décision de sortie livrée",
    DME_ANTICIPATED: "Équipement médical durable anticipé",
    DME_COORD: "Équipement médical durable coordonné",
    PLANNED_DISCHARGE_DT_TM: "Date de sortie planifiée",
    DC_PLANNING_TM_TRACKED: "Heure de la planification de la sortie suivie",
    DELAYS_TRACKED: "Délais suivis",
    DISCHARGE_PLANNER: "Planificateur de sortie",
    HOURS: "Heures",
    MINS: "Minutes",
    DAYS: "Jours",
    PROFSKILLEDSERVICESANTICIPATED: "Services de professionnels compétents anticipés",
    
    //Care Manager Insurance Strings
    PRIMARY: "Principal",
    SECONDARY: "Secondaire",
    TERTIARY: "Tertiaire",
    
    AUTHORIZATION: "Autorisation",
    TYPE: "Type",
    STATUS: "Statut",
    DELAYREASON: "Motif du retard",
    AUTH: "Auth.",
    AUTHDATES: "Dates d'auth.",
    NUMBEROFDAYS: "Nombre de jours",
    AUTHCOMMENTS: "Commentaires d'auth.",
    
    BENEFITS: "Avantages",
    DEDUCTIBLE: "Déductible",
    DEDUCTIBLE_MET: "Atteint",
    REMAINING: "Restant",
    COPAY: "Ticket modérateur",
    LIFETIMEMAX: "Durée de vie max.",
    LTRDAYSREMAINING: "Jours restants LTR",
    LTRDAILYDEDUCTABLE: "Franchise quotidienne pour la rééducation à long terme",
    COVEREDDAYSREMAINING: "Jours restants avec assurance",
    COINSURANCEDAYSREMAINING: "Jours restants avec coassurance",
    //Care Manager Visit Information Strings
    FIN_NUM: "N° de séjour",
    ENCNTR_TYPE: "Type de séjour",
    FIN_CLASS: "Classe de séjour",
    
    ADMIT_INFO: "Informations sur l'admission",
    REG_DT_TM: "Date/Heure de l'enregistrement",
    ADMIT_TO_BED_DT: "Date d'admission au lit",
    ATTENDING_PHD: "Médecin responsable",
    REASON_FOR_VISIT: "Motif de venue",
    ADMIT_DX: "Diagnostic à l'admission",
    ADMIT_SOURCE: "Source d'admission",
    LOCATION: "Emplacement",
    
    DISCHARGE_INFORMATION: "Informations sur la sortie",
    DISCHARGE_DATE: "Date de sortie",
    DISCHARGE_DISPOSITION: "Modalité de sortie",
    DISCHARGE_LOCATION: "Emplacement de sortie",
    
    ENCOUNTERS: "Séjours",
    FINAL_DRG: "DRG finaux",
    FINAL_DIAGNOSIS: "Diagnostic final",
    ADMIT_DATE: "Date d'admission",
    LOS: "Durée de séjour",
    LENGTH_OF_STAY: "Durée du séjour",
    KEY_PERSON_RELATIONSHIPS: "Relations avec personnes clés",
    NO_KEY_PERSONS: "Personne clé introuvable",
    RELATIONSHIP_HEADER: "Relation",
    PERSON_NAME_HEADER: "Nom de la personne",
    
    ADMIT_DATE: "Date d'admission",
    FINAL_DIAGNOSIS: "Diagnostic final",
    
    //Home medication
    HOME_MEDICATION: "Traitement personnel",
    LAST_DOSE: "Dernière dose",
    PRESCRIBED: "Prescrit",
    DOCUMENTED: "Documenté",
    NO_KNOWN_HOME_MEDS: "Aucun traitement personnel connu n'existe pour ce patient.",
    UNABLE_TO_OBTAIN_MED_HIST: "Impossible d'obtenir des informations relatives à l'historique des médicaments pour la consultation sélectionnée.",
    
    //Procedure History
    PROCEDURE: "Procédure",
    DISPLAY_AS: "Afficher sous forme de",
    PROCEDURE_DETAILS: "Informations sur la procédure",
    PROCEDURE_DATE: "Date de la procédure",
    PROVIDER: "Soignant",
    SIG_LINE: "Ligne de signature",
    
    //Procedural Information
    MODIFIERS: "Modificateurs",
    CASE_NUM: "Numéro de cas",
    ANESTHESIA_TYPE: "Type(s) d’anesthésie",
    SURGEON: "Chirurgien",
    SURGERY_START: "Début de l'intervention chirurgicale",
    SURGERY_STOP: "Fin de l'intervention chirurgicale",
    ANESTH_STOP: "Fin de l'anesthésie",
    ANESTH_START: "Début de l'anesthésie",
    SECONDARY_PROCEDURE: "Procédure secondaire",
    PROCEDURE_NAME: "Nom de la procédure",
    SURGICAL_FREE_TEXT: "Texte libre à propos de l'intervention chirurgicale",
    
    //Social History
    SOCIAL_HISTORY_INFORMATION: "Informations sur les antécédents sociaux",
    SOCIAL_HISTORY_DETAILS: "Détails sur les antécédents sociaux",
    CATEGORY: "Catégorie",
    LAST_UPDATED: "Dernière mise à jour",
    LAST_UPDATED_BY: "Dernière mise à jour par",
    
    
    //Pregnancy History
    PREGNANCY: "Grossesse",
    BABY: "Bébé",
    PREGNANCY_DETAILS: "Informations sur la grossesse",
    LENGTH_OF_LABOR: "Durée du travail",
    DELIVERY_HOSPITAL: "Hôpital de l'accouchement",
    CHILD_NAME: "Nom de l'enfant",
    FATHER_NAME: "Nom du père",
    
    //Family history
    CONDITION: "État",
    MEMBERS: "Membres",
    DECEASED: "Décédé(e)",
    
    //Past Medical History
    PAST_RESOLVED_DATE: "Date de résolution",
    PAST_PROBLEM: "Problème",
    
    
    //Notes and Reminders
    PRIORITY: "Priorité",
    SHOW_UP: "Présent",
    DUE: "Dû",
    STICKY_NOTES: "Mémos",
    REMINDERS: "Rappels",
    
    //Plan of Care
    POC_SUMMARY: "Résumé du plan de soins",
    PLAN_NAME: "Nom du plan",
    STATUS_DATE: "Date/Heure du statut",
    LAST_EVALUATION: "Dernière évaluation",
    DOCUMENTED_VARIANCE: "Motif de divergence documenté",
    DOCUMENTED_ACTION: "Action de divergence documentée",
    REASON: "Motif",
    ACTION: "Action",
    NOTE: "Remarque",
    ERROR_OCCURED: "Une erreur s'est produite.",
    SIGN_FAILED: "Échec de la signature",
    DISPLAY_MET: "Afficher les résultats atteints",
    BTN_HVR: "Cliquer pour documenter la divergence",
    SIGN: "Signer",
    CANCEL: "Annuler",
    OF: "sur",
    MET: "atteint",
    NO_SUPPORT_CHARACTERS: "Les symboles ^ et $ ne sont actuellement pas pris en charge.",
    
    //Ventilator Settings (RT)
    VENT_MODEL: "Modèle de respirateur/machine",
    VENT_ID: "ID de respirateur/machine",
    VENT_MODE: "Mode respirateur",
    SETTINGS: "Paramètres",
    SETTINGS_DETAILS: "Informations sur les paramètres",
    RESULT_DETAILS: "Données de résultat",
    RESULT_DT_TM: "Date/Heure de résultat",
    DOCUMENTED_BY: "Documenté par",
    RESP_RATE_TOTAL: "Fréquence respiratoire totale",
    MEASUREMENTS_ASSESSMENTS: "Mesures et évaluations",
    MEASUREMENTS_ASSESSMENTS_DETAILS: "Données des mesures et évaluations",
    VENT_ALARMS_ON: "Alarmes respirateur activées et fonctionnelles",
    ALARM_SETTINGS: "Paramètres de l'alarme",
    ALARM_SETTINGS_DETAILS: "Informations sur les paramètres de l'alarme",
    WEANING_PARAMETERS: "Paramètres de sevrage",
    WEANING_PARAMETERS_DETAILS: "Informations sur les paramètres de sevrage",
    
    //Respiratory Assessments (RT)
    LATEST_BLOOD_GAS_ARTERIAL: "Examen de gaz du sang le plus récent",
    PREVIOUS_BLOOD_GAS_ARTERIAL: "Examen de gaz du sang précédent",
    ARTIFICIAL_AIRWAY: "Canule pharyngée",
    ARTIFICIAL_AIRWAY_DETAILS: "Informations sur la canule pharyngée",
    O2_THERAPY_TITRATION: "Thérapie/titrage O2",
    O2_THERAPY_TITRATION_DETAILS: "Informations sur la thérapie/le titrage O2",
    BREATH_SOUNDS_ASSESSMENT: "Évaluation des bruits respiratoires",
    BREATH_SOUNDS_ASSESSMENT_DETAILS: "Informations sur l'évaluation des bruits respiratoires",
    RESPIRATORY_DESCRIPTION: "Description de la respiration",
    RESPIRATORY_DESCRIPTION_DETAILS: "Informations sur la description de la respiration",
    NO_RES: "-- Aucun résultat n'a été trouvé --",
    NO_PREV_RES: "-- Aucun résultat précédent n'a été trouvé --",
    
    //Respiratory Treatments (RT)
    AEROSOL_THERAPY: "Réaction du patient aux médicaments inhalés",
    AEROSOL_THERAPY_DETAILS: "Informations sur la réaction du patient aux médicaments inhalés",
    INCENTIVE_SPIROMETRY: "Spirométrie de stimulation",
    INCENTIVE_SPIROMETRY_DETAILS: "Informations sur la spirométrie de stimulation",
    COUGH_SUCTION: "Toux/Aspiration",
    COUGH_SUCTION_DETAILS: "Informations sur la toux/aspiration",
    CHEST_PHYSIOTHERAPY: "Hygiène bronchique",
    CHEST_PHYSIOTHERAPY_DETAILS: "Informations sur l'hygiène bronchique",
    
    //Timeline View (ICU and RT)
    MASTER_GRAPH: "Graphique principal",
    RESP_MONITORING: "Surveillance respiratoire",
    ALL_DATA: "Toutes les données",
    A_LINE: "Voie artérielle",
    CUFF: "Brassard pneumatique",
    SBP: "Pression artérielle systolique",
    DBP: "Pression artérielle diastolique",
    MAP: "Pression artérielle moyenne",
    BP_UNIT: "(mmHg)",
    CURRENT: "Actuel",
    RESET: "Réinitialiser le zoom",
    ACCORDING_TO_ZOOM: "&nbsp;(la plage dépend du zoom)",
    NO_ZOOM_APPLIED: "Aucun zoom n'est appliqué.",
    TABLE_GRAPH_DISCLAIMER: "Les dernières valeurs documentées apparaissent dans la table correspondant à la période indiquée.",
    JANUARY: ["Jan", "Janvier"],
    FEBRUARY: ["Fév", "Février"],
    MARCH: ["Mar", "Mars"],
    APRIL: ["Avr", "Avril"],
    MAY: ["Mai", "Mai"],
    JUNE: ["Jun", "Juin"],
    JULY: ["Jui", "Juillet"],
    AUGUST: ["Aoû", "Août"],
    SEPTEMBER: ["Sep", "Septembre"],
    OCTOBER: ["Oct", "Octobre"],
    NOVEMBER: ["Nov", "Novembre"],
    DECEMBER: ["Déc", "Décembre"],
    
    //patient information.
    RFV: "Motif de venue",
    ROOM_BED: "Chambre-Lit",
    ADMIT_DIAG: "Diagnostic à l'admission",
    ADMIT_PHYS: "Médecin responsable de l'admission",
    PRIM_PHYS: "Médecin traitant",
    ATTEND_PHYS: "Médecin responsable",
    EMER_CONTACT: "Personne à prévenir en cas d'urgence",
    EMER_NUMBER: "N° de tel en cas d'urgence",
    CHIEF_COMPLAINT: "Plainte principale",
    LAST_VISIT: "Dernière consultation",
    MODE_OF_ARRVAL: "Mode d’arrivée",
    LAST: "Dernière",
    VISIT: "Consultation",
    CONTACTS: "Contacts",
    TARGETED_DISCHARGE_DATE: "Date cible de sortie",
    LAST_VISIT: "Dernière consultation",
    
    //immunizations
    IMMUNIZATIONS: "Vaccination",
    PRODUCT: "Produit",
    ADMIN_DATE: "Date d'administration",
    MANUFACTURER: "Fabricant",
    LOT: "Lot",
    EXP_DATE: "Date de péremption",
    ADMIN_NOTES: "Notes d'administration",
    IMMUNIZATIONS_DETAILS: "Détails sur la vaccination",
    
    //Meds Recon
    START: "Commencer",
    STOP: "Arrêter",
    SIGNATURE_LINE: "Ligne de signature",
    ORDERING_PHYSICIAN: "Médecin prescripteur",
    NEW: "Nouveau",
    CONTINUE: "Continuer",
    NO_LONGER_TAKING: "Ne prend plus",
    CONTINUE_WITH_CHANGES: "Continuer avec modifications",
    CONTACT_PHYSICIAN: "Contacter le médecin avant de prendre",
    
    //Visits 
    FUTURE: "Futur",
    VISIT_DETAILS: "Détails de la consultation",
    
    DISCHARGE_PROCESS: "Processus de sortie",
    CLICK_TO_GO_TO_DISCHARGE_PROCESS: "Cliquez pour vous rendre au Processus de sortie",
    
    // New Order Entry
    MEDS: "Médicaments",
    LABS: "Laboratoire",
    IMAGING: "Imagerie",
    BILLING: "Facturation",
    OTHER: "Autre",
    ORDER_FAVORITE: "Favoris - Prescriptions",
    ORDER_NAME: "Nom de la prescription",
    ORDER_DISPLAY_LINE: "Ligne d'affichage de prescription",
    ORDER_PARAMETERS: "Paramètres de prescription",
    NO_MEDS_FAVORITES: "Aucun favori de médicament n'a été trouvé",
    NO_LABS_FAVORITES: "Aucun favori de résultat de laboratoire n'a été trouvé",
    NO_IMAGING_FAVORITES: "Aucun favori d'imagerie n'a été trouvé",
    NO_BILLING_FAVORITES: "Aucun favori de facturation n'a été trouvé",
    NO_OTHER_FAVORITES: "Aucun autre favori n'a été trouvé",
    ORDERS_FOR_SIGNATURE: "Prescriptions à signer",
    NO_ORDERS_FOR_SIGNATURE: "Aucune prescription à signer",
    SEARCH_MODE: "Mode de recherche",
    SELECT: "Sélectionner",
    SUBMIT_FOR_SIGNATURE: "Soumettre pour signature",
    
    // Care Management Strings
    RCM_ACTUAL_DISCHARGE_DISPOSITION: "Modalité de sortie actuelle",
    RCM_ADD_ADDENDUM: "Ajouter un addendum",
    RCM_ADDENDUM: "Addendum",
    RCM_ADDENDUM_BY: "Addendum par :",
    RCM_ADDITIONAL_NOTES: "Notes supplémentaires",
    RCM_ADDITIONAL_REVIEWER_NOTES: "Notes supplémentaires du réviseur",
    RCM_ADM_MIM: "Document sur les droits du patient à l'admission",
    RCM_ADMIT_TO_BED_DT: "Date/Heure de l'admission au lit",
    RCM_ADMITTING_DX: "Diagnostic à l'admission",
    RCM_ADMITTING_DX_DESC: "Description du diagnostic à l'admission",
    RCM_ADMIT_DATE: "Date d'admission",
    RCM_ADMIT_SOURCE: "Source d'admission",
    RCM_ADVANCE_DIR_COMPL: "Directives anticipées complétées",
    RCM_ADVANCE_DIR_ON_FILE: "Directives anticipées archivées",
    
    RCM_AGE: "Âge",
    RCM_ALTERNATE_DRG: "DRG alternatif",
    RCM_ATTENDING_PHYSICIAN: "Médecin responsable",
    RCM_AVOIDABLE_DAYS: "Jours évitables",
    RCM_BED: "Lit",
    RCM_CANCEL: "Annuler",
    RCM_CANCEL_MESSAGE: "Êtes-vous sûr de vouloir annuler ? Toutes les modifications seront perdues.",
    RCM_CARE_GUIDELINE: "Consignes de soins",
    RCM_CARE_MANAGEMENT: "Gestion des soins",
    RCM_CLINICAL_REVIEW: "Révision clinique",
    RCM_CLINICAL_REVIEW_ENTRY: "Saisie de la révision clinique",
    RCM_CLINICAL_REVIEW_SUMMARY: "Résumé de la révision clinique",
    RCM_COLON: ":",
    RCM_COMPLETE: "Terminer",
    RCM_CONTINUED_STAY: "Séjour continu",
    RCM_CRITERIA_MET: "Critères remplis",
    RCM_CURRENT_ENCOUNTER: "Séjour actuel",
    RCM_DATE: "Date",
    RCM_DATEPICKER_TEXT: "Choisissez une date.",
    RCM_DAY_REVIEWED: "Jour révisé",
    RCM_DELETE: "Supprimer la révision clinique",
    RCM_DELETE_FAILED: "Échec de la suppression",
    RCM_DELETE_FAILED_MESSAGE: "La révision clinique sélectionnée a été modifiée par un autre utilisateur depuis son ouverture. La révision clinique ne peut pas être supprimée.",
    RCM_DELETE_MESSAGE: "Êtes-vous sûr de vouloir supprimer la révision clinique sélectionnée ?",
    RCM_DELETE_REVIEW: "Supprimer la révision",
    RCM_DENIED_DAYS: "Jours refusés",
    RCM_DISCHARGE_ASSESSMENT_INFO: "Informations sur l'évaluation à la sortie",
    RCM_DISCHARGE_BARRIERS: "Obstacles à la sortie",
    RCM_DISCHARGE_DATE: "Date de sortie",
    RCM_DISCHARGE_DISPOSITION: "Modalité de sortie",
    RCM_DISCHARGE_FACILITY: "Établissement de sortie",
    RCM_DISCHARGE_NEXT_ASSESSMENT_DT: "Date/Heure de l'évaluation de la prochaine sortie",
    RCM_DISCHARGE_OF_SERVICES: "Sortie des services",
    RCM_DISCHARGE_PENDING: "Sortie en attente",
    RCM_DISCHARGE_SCREEN: "Évaluer au moment de la sortie",
    RCM_DISCHARGE_SCREENING: "Évaluation au moment de la sortie",
    RCM_DISCHARGE_SLOT: "Créneau de sortie",
    RCM_DISPLAY: "Affichage",
    RCM_DNR: "Ne pas ressusciter",
    RCM_DOB: "Date de naissance",
    RCM_DONE: "Effectué",
    RCM_DRG_DESC: "Description DRG",
    RCM_ELOS: "ELOS",
    RCM_ENCOUNTER_TYPE: "Type de séjour",
    RCM_ESTIMATED_DISCHARGE_DATE: "Date de sortie prévue",
    RCM_FACILITY: "Établissement",
    RCM_FAX_REVIEWS: "Révisions des fax",
    RCM_FC: "F/C",
    RCM_FIN: "N° de séjour",
    RCM_FINAL: "Final",
    RCM_FINAL_AND_NEXT: "Final et suivant",
    RCM_FINAL_DRG: "DRG finaux",
    RCM_FINAL_DX: "Diagnostic final",
    RCM_FINAL_PRIMARY_DX: "Diagnostic principal final",
    RCM_FINANCIAL_CLASS: "Classe de séjour",
    RCM_INCLUDE_CLOSED_UM_REVIEWS: "Inclure les révisions de gestion de l'utilisation fermées",
    RCM_INTENSITY_OF_SERVICES: "Intensité des services",
    RCM_LAST_ASSESSMENT_DATE: "Date de la dernière évaluation",
    RCM_LAST_REVIEW_DATE: "Date de la dernière révision",
    RCM_LEVEL_OF_SERVICE_SUBTYPE: "Sous-type du niveau de service",
    RCM_LOS: "Durée de séjour",
    RCM_LOS_ELOS: "Durée du séjour / Durée du séjour estimée :",
    RCM_MARK_AS_FINAL: "Marquer comme Final",
    RCM_MED_SERVICE: "UF",
    RCM_MET: "Atteint",
    RCM_MODIFY: "Modifier",
    RCM_MRN: "IPP",
    RCM_MY_RELATIONSHIP: "Ma relation",
    RCM_NAME: "Nom",
    RCM_NEXT_CLINICAL_REVIEW: "Prochaine révision clinique à rendre le :",
    RCM_NEXT_CLINICAL_REVIEW_DATE: "Date de la prochaine révision clinique",
    RCM_NEXT_CL_REVIEW: "Prochaine révision clinique",
    RCM_NEXT_REVIEW_NEEDED: "Prochaine révision nécessaire",
    RCM_NEXT_SECTION: "Section suivante",
    RCM_NO: "Non",
    RCM_NOMENCLATUREID: "ID de nomenclature :",
    RCM_NOT_MET: "Non atteint",
    RCM_OBS_END_DTTM: "Date/Heure de fin de l'observation",
    RCM_OBS_START_DTTM: "Date/Heure de début de l'observation",
    RCM_OK: "OK",
    RCM_OPEN_CLINICAL_REVIEW: "Ouvrir Révision clinique",
    RCM_OUTCOME: "Résultat",
    RCM_PATIENT_LIST: "Liste de patients",
    RCM_PAYER: "Payeur",
    RCM_PENDING: "En attente",
    RCM_PLANNED_DISCHARGE_DATE: "Date de sortie planifiée",
    RCM_PLANNED_DISCHARGE_DISPOSITION: "Modalités de sortie planifiées",
    RCM_PREVIOUS_ADMISSION_INFO: "Informations sur l'admission précédente",
    RCM_PRIMARY_DX: "Diagnostic principal",
    RCM_PRIMARY_UR_NURSE: "Infirmière principale UR",
    RCM_REASON_FOR_REFERRAL: "Motif de l'orientation :",
    RCM_REVIEW: "Réviser",
    RCM_REVIEW_CRITERIA: "Critères de révision",
    RCM_REVIEW_DATE: "Date de révision",
    RCM_REVIEW_DUE: "Révision due",
    RCM_REVIEW_OUTCOME: "Résultat de la révision",
    RCM_REVIW_TYPE: "Type de révision",
    RCM_REVIWED_BY: "Révisé par :",
    RCM_REVIEWER: "Réviseur",
    RCM_ROOM: "Chambre",
    RCM_SAVE: "Enregistrer",
    RCM_SAVE_AND_NEW: "Enregistrer et Nouveau",
    RCM_SAVE_FAILED: "L'enregistrement a échoué.",
    RCM_SAVE_FAILED_MESSAGE: "La révision clinique sélectionnée a été modifiée par un autre utilisateur depuis son ouverture.  Les modifications apportées à la révision clinique ne peuvent être mises à jour.",
    RCM_SECONDARY_REVIEW: "Deuxième révision",
    RCM_SECONDARY_REVIEW_NEEDED: "Révision secondaire nécessaire",
    RCM_SEVERITY_OF_ILLNESS: "Gravité de la maladie",
    RCM_SOURCE_IDENTIFIER: "ID de la source :",
    RCM_SR_DATE: "Date de la révision secondaire",
    RCM_SR_STATUS: "Statut de la révision secondaire",
    RCM_SSN: "N° de sécurité sociale",
    RCM_STATUS: "Statut",
    RCM_TYPE: "Type",
    RCM_UM_INFO: "Informations sur la gestion de l'utilisation",
    RCM_UM_STATUS: "Statut de la gestion de l'utilisation",
    RCM_UNIT: "Unité",
    RCM_UNIT_DISCHARGE_FROM: "Sortie de l'unité de",
    RCM_UTILIZATION_MANAGEMENT: "Gestion de l'utilisation",
    RCM_VISIT_INFO: "Informations sur la consultation",
    RCM_WORKING_DRG: "DRG de travail",
    RCM_WORKING_DRG_DESC: "Description du DRG de travail",
    RCM_YES: "Oui",
    
    // Discharge Readiness
    DC_NOT_STARTED: "Non commencé",
    DC_IN_PROGRESS: "En cours",
    DC_COMPLETE: "Terminer",
    DC_REVIEWSIGN: "Réviser et signer",
    
    //Follow Up
    FU_NAME: "Nom :",
    FU_ADDRESS: "Adresse :",
    
    //Patient Education
    PE_INSTRUCTION: "Instruction :",
    PE_DATE: "Date :",
    PE_PROVIDER: "Soignant :",
    
    //Quality Measures
    QM_COMPLETE: "Terminer",
    QM_INCOMPLETE: "Incomplet",
    QM_CONDITION: "Condition :"
};

/*
 * Core namespace for architecture i18n string utilized.
 * NOTE: Keep alpha sorted to eliminate the error of duplicate strings
 */
i18n.discernabu = {
    ADD: "Ajouter",
    ALL_N_VISITS: "{0} pour toutes les consultations",
    All_VISITS: "Toutes les consultations",
    CLEAR_PREFERENCES: "Effacer les préférences",
    COLLAPSE_ALL: "Réduire tout",
    CUSTOMIZE: "Personnaliser",
    DESCRIPTION: "Description",
    DISCERN_ERROR: "Erreur Discern",
    DISCLAIMER: "Cette page ne comprend pas toutes les informations sur le séjour.",
    ERROR_OPERATION: "Nom de l'opération",
    ERROR_OPERATION_STATUS: "Statut de l'opération",
    ERROR_RETREIVING_DATA: "Erreur de récupération des résultats",
    ERROR_TARGET_OBJECT: "Nom de l'objet cible",
    ERROR_TARGET_OBJECT_VALUE: "Valeur de l'objet cible",
    EXPAND_ALL: "Développer tout",
    GO_TO_TAB: "Aller à l''onglet {0}",
    HELP: "Aide",
    HIDE_SECTION: "Réduire",
    JS_ERROR: "Erreur JavaScript",
    LAST_N_DAYS: "{0} derniers jours",
    LAST_N_HOURS: "{0} dernières heures",
    LAST_N_MONTHS: "{0} derniers mois",
    LAST_N_WEEKS: "{0} dernières semaines",
    LAST_N_YEARS: "{0} dernières années",
    LOADING_DATA: "Chargement",
    MESSAGE: "Message",
    NAME: "Nom",
    NO_RESULTS_FOUND: "Aucun résultat n'a été trouvé.",
    NUMBER: "Numéro",
    RENDERING_DATA: "Rendu",
    REQUEST: "Requête",
    SAVE_PREFERENCES: "Enregistrer les préférences",
    SELECTED_N_VISIT: "{0} pour la consultation sélectionnée",
    SELECTED_VISIT: "Consultation sélectionnée",
    SHOW_SECTION: "Développer",
    STATUS: "Statut",
    USER_CUSTOMIZATION: "Personnalisation par l'utilisateur",
    USER_CUST_DISCLAIMER: "Veuillez prendre en compte la résolution de l'écran avant de sélectionner la vue répartie sur trois colonnes.",
    WITHIN_DAYS: "{0} jours",
    WITHIN_HOURS: "{0} hres",
    WITHIN_MINS: "{0} min",
    WITHIN_MONTHS: "{0} mois",
    WITHIN_WEEKS: "{0} sem.",
    WITHIN_YEARS: "{0} ans",
    X_DAYS: "{0} jours",
    X_HOURS: "{0} heure(s)",
    X_MINUTES: "{0} minute(s)",
    X_MONTHS: "{0} mois",
    X_WEEKS: "{0} semaine(s)",
    X_YEARS: "{0} an(s)",
    
    //Auto Suggest Control
    NO_PRIVS: "Vous n''êtes pas autorisé à ajouter la/le {name} sélectionné(e).",
    DUPLICATE: "Cette action créera un(e) {name} en double. Vous ne pouvez ajouter ce/cette {name}.",
    PROBLEM: "Problème",
    DIAGNOSIS: "Diagnostic",

    DAYNAMES: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam", "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    MONTHNAMES: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
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
	"default":      "ddd, dd mmm yyyy HH:MM:ss",
	shortDate:      "d/m/yy",
	shortDate2:     "dd/mm/yyyy",
	shortDate3:		"dd/mm/yy",
	shortDate4:		"mm/yyyy",
	shortDate5:		"yyyy",
	mediumDate:     "d mmm, yyyy",
	longDate:       "d mmmm, yyyy",
	fullDate:       "dddd, d mmmm, yyyy",
	shortTime:      "HH:MM",
	mediumTime:     "HH:MM:ss",
	longTime:       "HH:MM:ss Z",
	militaryTime:   "HH:MM",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
	longDateTime: 	"dd/mm/yyyy HH:MM:ss Z",
	longDateTime2:	"dd/mm/yy HH:MM",
	longDateTime3:	"dd/mm/yyyy HH:MM",
	shortDateTime:	"dd/mm HH:MM"
};
 
// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam",
		"Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
	],
	monthNames: [
		"Jan", "F�v", "Mar", "Avr", "Mai", "Jun", "Jui", "Ao�", "Sep", "Oct", "Nov", "D�c",
		"Janvier", "F�vrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Ao�t", "Septembre", "Octobre", "Novembre", "D�cembre"
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
	DIAGNOSES: "Diagnostic",
	CODE: "Code",
	DETAILS: "Détails",
	DIAGNOSES_DATE: "Date du diagnostic",
	RESPONSIBLE_PROVIDER_NAME: "Soignant responsable",
	DIAG_TYPE: "Type de diagnostic",
	COMMENTS: "Commentaires",
	DIAGNOSES_NAME: "Nom du diagnostic",
	ANNOTATED_DISPLAY: "Affichage annoté"
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
    AUTHOR: "Auteur",
    DATE: "Date",
    DATE_TIME: "Date/Heure",
    WITHIN: "dans",
    UNKNOWN: "Inconnu",
    DOCUMENTATION_DETAILS: "Informations sur la documentation",
    NAME: "Nom",
    SUBJECT: "Objet",
    STATUS: "Statut",
    LAST_UPDATED: "Dernière mise à jour",
    LAST_UPDATED_BY: "Dernière mise à jour par",
    DOCUMENT_FAVS: "Favoris introuvables"
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
	PERCENTILE: "Percentile",
	ZSCORE: "Note Z",
    LATEST: "Dernier résultat",
    WITHIN: "dans",
    PREVIOUS: "Précédent",
	RESULT_DETAILS: "Données de résultat",
	RESULT_DT_TM: "Date/Heure de résultat",
	AGE: "Âge",
	RESULT: "Résultat"
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
    HOME_MEDICATION: "Traitement personnel",
    LAST_DOSE: "Dernière dose",
    PRESCRIBED: "Prescrit",
    DOCUMENTED: "Documenté",
    NO_KNOWN_HOME_MEDS: "Aucun traitement personnel connu n'existe pour ce patient.",
    UNABLE_TO_OBTAIN_MED_HIST: "Impossible d'obtenir des informations relatives à l'historique des médicaments pour la consultation sélectionnée.",
    MED_DETAIL: "Informations sur le médicament",
    ORDER_DATE: "Date de prescription",
    COMPLIANCE: "Observance",
    RESPONSIBLE_PROVIDER: "Prescription saisie par",
    STATUS: "Statut",
    TYPE: "Type",
    DETAILS: "Détails",
    LAST_DOC_DT_TM: "Date/Heure de la dernière documentation",
    LAST_DOC_BY: "Dernière documentation par",
    ORDER_DETAILS: "Informations sur la prescription"
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
    WITHIN: "dans",
    LATEST: "Dernier résultat",
    PREVIOUS: "Précédent",
    EXPAND: "Développer",
    COLLAPSE: "Réduire",
    PRIMARY_RESULTS: "Résultats principaux",
    VALUE: "Valeur",
    LABORATORY_DETAILS: "Détails de laboratoire",
    DATE_TIME: "Date/Heure",
    NORMAL_LOW: "Normal faible",
    NORMAL_HIGH: "Normal élevé",
    CRITICAL_LOW: "Critique faible",
    CRITICAL_HIGH: "Critique élevé"
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
    NEXT_N_HOURS: "{0} prochaines heures",
	HIDE_SECTION: "Réduire",
	SCHEDULED: "Planifié",
    MED_DETAIL: "Informations sur le médicament",
    MED_NAME: "Médicament",
    REQUESTED_START: "Début demandé",
    ORIG_DT_TM: "Date/Heure de la prescription d'origine",
    LAST_DOSE_DT_TM: "Dernière dose",
    NEXT_DOSE_DT_TM: "Dose suivante",
    STOP_DT_TM: "Date/Heure d'arrêt",
    STOP_REASON: "Motif d'arrêt",
    STATUS: "Statut",
    LAST_GIVEN: "Dernière administration",
    NEXT_DOSE: "Dose suivante",
    CONTINOUS: "Continu",
    SUSPENDED: "Interrompu",
    PRN: "PRN",
    UNSCHEDULED: "Non planifié",
    RESPONSIBLE_PROVIDER: "Prescription saisie par",
    ADMINISTERED: "Administré",
    PRN_UNSCHEDULED: "PRN/Non planifié disponible",
	ADMIN_LAST_N_HOURS: "Administré au cours des dernières {0} heures",
 	SHOW_SECTION: "Développer",
	LAST_N_HOURS: "{0} dernières heures",
	DISCONTINUED: "Arrêté",
	JS_ERROR: "Erreur JavaScript",
    MESSAGE: "Message",
    NUMBER: "Numéro",
    DESCRIPTION: "Description",
	NAME: "Nom",
	DETAILS: "Détails",
	NOT_DEFINED: "Non défini",
	ORDER_DETAILS: "Informations sur la prescription"
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
    NO_RESULTS_FOUND: "Aucun résultat n'a été trouvé.",
    RFV: "Motif de venue",
    ROOM_BED: "Chambre/lit",
    ADMIT_DIAG: "Diagnostic à l'admission",
    ADMIT_DATE: "Date d'admission",
    PRIM_PHYS: "Médecin traitant",
    ATTEND_PHYS: "Médecin responsable",
    EMER_CONTACT: "Personne à prévenir en cas d'urgence",
    EMER_NUMBER: "N° de tel en cas d'urgence",
    CODE_STATUS: "Statut de code",
    LAST_VISIT: "Dernière consultation",
    LAST: "Dernière",
    VISIT: "Consultation",
    CONTACTS: "Contacts",
    ADMIT_PHYS: "Médecin responsable de l'admission",
    TARGETED_DISCHARGE_DATE: "Date cible de sortie",
    SERVICE: "Service",
    MODE_OF_ARRVAL: "Mode d’arrivée",
    ADVANCE_DIRECTIVE: "Directives anticipées",
    DETAILS: "Détails",
    CHIEF_COMPLAINT: "Plainte principale"
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
    BLOOD_PRESSURE: "Pression artérielle",
    TEMPERATURE: "Température",
    DEGC: "DegC",
    DEGF: "DegF",
    NORMAL_LOW: "Normal faible",
    NORMAL_HIGH: "Normal élevé",
    CRITICAL_LOW: "Critique faible",
    CRITICAL_HIGH: "Critique élevé",
    TWO_DAY_MAX: "48 heures maximum",
    LATEST: "Dernier résultat",
    WITHIN: "dans",
    PREVIOUS: "Précédent",
    DATE_TIME: "Date/Heure",
    ERROR_RETREIVING_DATA: "Erreur de récupération des résultats",
    VALUE: "Valeur",
    LABORATORY_DETAILS: "Détails de laboratoire"
}