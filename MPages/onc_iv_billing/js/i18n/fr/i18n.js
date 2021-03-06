var i18n = function ()
{
    return {
        REQUEST: "Demande",
        //Return Status:
        NO_RESULTS_FOUND: "Aucun résultat n&#39;a été trouvé.",
        NO_DATA: "Aucune donnée",

        //Error Status:
        ERROR_RETREIVING_DATA: "Une erreur s&#39;est produite lors de la récupération des résultats.",
        ERROR_OPERATION: "Nom de l&#39;opération",
        ERROR_OPERATION_STATUS: "Statut de l&#39;opération",
        ERROR_TARGET_OBJECT: "Nom de l&#39;objet cible",
        ERROR_TARGET_OBJECT_VALUE: "Valeur de l&#39;objet cible",
        //Customization
        CLEAR_PREFERENCES: "Effacer les préférences",
        SAVE_PREFERENCES: "Enregistrer les préférences",
        CUSTOMIZE: "Personnaliser",
        USER_CUSTOMIZATION: "Personnalisation par l&#39;utilisateur",
        SAVE_PREF_SUCCESS: "Les préférences ont bien été enregistrées.",
        CLEAR_PREF_SUCCESS: "Les préférences ont bien été effacées.",

        //Alerts
        LYNXEPOINT_OBJECT_NULL: "L&#39;objet LYNXEPOINT est nul.",
        INITIAL_PARAMETERS_INVALID: "Impossible d&#39;effectuer la transaction car les paramètres du patient, du séjour ou du groupe de suivi ne sont pas valides.",
        WEB_SERVICE_PARAMETERS_INVALID: "Impossible d&#39;effectuer la transaction car les paramètres du service Web ne sont pas valides.",
        INVALID_OPERATION_EXCEPTION: "Une erreur d&#39;opération s&#39;est produite. Impossible d&#39;effectuer la transaction.",

        //wizard
        FACILITY_TITLE: "Facture de l&#39;établissement",
        FACILITY_CODING: "Codage de l&#39;établissement",
        URGENT_CARE_TITLE: "Codage et facturation de la clinique",
        URGENT_CARE_CODING: "Évaluation et gestion",
        INFUSION_INJECTIONS: "Perfusions et injections",
        FINALIZE_CHARGES: "Finaliser les frais",
        NEXT: "Suivant >",
        BACK: "< Retour",
        ADD: "Ajouter",
        CANCEL: "Annuler",
        ADD_NEW: "Ajouter",
        INFUSION_START_TIME: "Date/Heure de début",
        INFUSION_STOP_TIME: "Date/Heure de fin",
        HYDRATION: "Hydratation",
        INFUSION: "Perfusion",
        IV_PUSH: "Bolus intraveineux",
        SQ_INJECTION: "Injection sous-cutanée/intramusculaire",
        INTRA_ARTERIAL_INJECTION: "Injection intra-artérielle",
		INTRA_PERITONEAL: "Intrapéritonéale",
        INTRA_THECAL: "Intrathécale",
        SITE: "Site",
        NO: "Non",
        TYPE: "Type",
		ADMIN_TYPE: "Voies d&#39;administration",
        DURATION: "Durée (minutes)",
        MEDICATION: "Médicament",
        E_M: "Évaluation et gestion",
        I_I: "Perfusions et injections",
        CPT: "CPT",
        UNITS: "Unités",
        CHARGES_START: "Début de l&#39;administration",
        CHARGES_STOP: "Fin",
        CHARGES: "Frais",
        CALCULATE_CHARGES: "Calculer >",
        SUBMIT_CHARGES: "Soumettre",
        SUCCESS_MSG: "Les frais ont bien été traités.",
        ADD_SUCCESS_MSG: "Les frais supplémentaires ont bien été traités.",
        SYSTEM_DEFAULT: "&nbsp;*",
        SYSTEM_DEFAULT_XML: "&nbsp;&lowast;",
        DOCUMENTED_SECTION: "Documenté",
        SAVE: "Enregistrer",
        HELP_SECTION: "Texte de référence",
        DROP_ADDITIONAL_CHARGES: "Frais supplémentaires",
        EXPAND_SUB_SEC: "Développer tout le texte de référence",
        COLLAPSE_SUB_SEC: "Réduire tout le texte de référence",
        REFRESH: "Actualiser",
        STARTWITH: "Commence par",
        CONTAINS: "Contient",
        PRESENTING_PROBLEM_ALERT: "Un motif de venue est nécessaire pour calculer le niveau de consultation standard. Renseignez le motif de venue avant de continuer.",
        SELECT_SITE: "Sélectionnez un site.",
        SELECT_TYPE: "Sélectionnez une voie d&#39;administration.",
        SELECT_MEDICATION: "Sélectionnez un médicament.",
        FILL_OUT_START_DATE: "Renseignez la date de début.",
        FILL_OUT_START_TIME: "Renseignez l&#39;heure de début.",
        FILL_OUT_STOP_DATE: "Renseignez la date de fin.",
        FILL_OUT_STOP_TIME: "Renseignez l&#39;heure de fin.",
        STANDARD_ED_ENCOUNTER: "Séjour standard",
        START_DATE_PRIOR_STOP_DATE: "La date et l&#39;heure de début doivent être antérieures à la date et à l&#39;heure de fin",
        START_DATE_AFTER_ARRIVAL: "La date et l&#39;heure de début doivent être postérieures à la date et à l&#39;heure d&#39;arrivée du patient",
        STOP_DATE_AFTER_ARRIVAL: "La date et l&#39;heure de fin doivent être postérieures à la date et à l&#39;heure d&#39;arrivée du patient",
        START_DATE_PRIOR_CHECKOUT: "La date et l&#39;heure de début doivent être antérieures à la date et à l&#39;heure de sortie du patient",
        STOP_DATE_PRIOR_CHECKOUT: "La date et l&#39;heure de fin doivent être antérieures à la date et à l&#39;heure de sortie du patient",
        START_DATE_PRIOR_CURRENT: "La date et l&#39;heure de début doivent être antérieures à la date et à l&#39;heure actuelles",
        STOP_DATE_PRIOR_CURRENT: "La date et l&#39;heure de fin doivent être antérieures à la date et à l&#39;heure actuelles",
        IN_SYSTEM: " dans le système.",
        VISIT_TYPES_ALERT: "Si vous sélectionnez cette option, tous les autres frais d&#39;évaluation et de gestion seront ignorés.",
		AUTOMATE_IV: "Activer la vue des perfusions automatiques",
		MANUAL_IV : "Activer la vue des perfusions manuelles",
		HIDE_SUB_ORDRS : "Masquer les prescriptions soumises",
		SHOW_SUB_ORDRS : "Afficher les prescriptions soumises",
		SELECT_ALL: "Sélectionner tout",


        //Infusion and Injection
        CHOOSE_SITE: "Sélectionnez un site.",
		CHOOSE_ADMIN_ROUTE: "Sélectionnez une voie.",
        IV1: "IV1",
        MODIFY: "Modifier",
        DELETE: "Supprimer",
        REMOVE: "Supprimer",
        CHOOSE_TYPE: "Sélectionnez un type.",
		TYPES_ADD: "Voies d&#39;administration",
        //Additional Charges
        ADDITIONAL_CHARGES: "Suivant >",
		MODIFIERS: "Modificateurs",
		STATUS_COL:"Statut",
		CHRG_STATUS_SUBMIT:"Frais soumis",
		CHRG_STATUS_NOT_SUBMIT:"Frais non soumis",
        STATUS_SUBMIT:"Soumis",
        STATUS_NOT_SUBMIT:"Non soumis",
		CPT_SUBMITTED: "Les frais ont déjà été soumis pour toutes les prescriptions.",
		MISSING_DETAILS: "Détails manquants :",
		MISSING_STOP_DATE_TM: "Date et heure d&#39;arrêt manquantes pour les médicaments :",
		WARING_MSG: "Les prescriptions envoyées sont actuellement affichées.\n Si vous continuez le calcul, les prescriptions précédemment envoyées \n seront renvoyées.\n Voulez-vous continuer ?",

		AMBGUOUS_MSG: " strVarDateTime est une heure ambiguë car cette heure est répétée en raison du passage de l&#39;heure d&#39;été à l&#39;heure d&#39;hiver. Quelle heure voulez-vous utiliser ?",
		DAY_LIGHT: "Heure d&#39;été",
		STANDARD: "Standard",
		AMB_TITLE: "Heure ambiguë",
        //Commons
        GO_TO_TAB: "Aller à l&#39;onglet {0}",
        ESTIMATED_DISCHARGE_DATE: "Date de sortie prévue",
        LOADING_DATA: "Chargement",
        RENDERING_DATA: "Rendu",
        NAME: "Nom",
        DETAILS: "Détails",
        ONSET_DATE: "Date de début",
        COMMENTS: "Commentaires",
        DATE_TIME: "Date/Heure",
        ANNOTATED_DISPLAY: "Nom d&#39;affichage annoté",
        ANNOTATED_DISPLAY_NAME: "Affichage annoté",
        ARRIVAL: "Arrivée",
        CODE: "Code",
        LATEST: "Le(s) plus récent(s)",
        WITHIN: "dans",
        PREVIOUS: "Précédent(s)",
        SINCE: "Depuis",
        DISCLAIMER: "Cette page ne contient pas toutes les informations sur la consultation.",
        USER_CUST_DISCLAIMER: "Prenez en compte la résolution de l&#39;écran avant de sélectionner la vue répartie sur trois colonnes.",
        RESULT: "Résultat",
        STATUS: "Statut",
        DATE: "Date",
        ACTIVE: "Actif(s)",
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
        WITHIN_HOURS: "{0} h",
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
        DONE: "Terminé",
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
        DOB: "Né(e) le",
        SEX: "Sexe",
        AGE: "Âge",
        MRN: "IPP",
        FIN: "Numéro de séjour",
        VISIT_REASON: "Motif de venue",
        ISOLATION: "Isolement",
        LAST_DOC_DT_TM: "Date/Heure de la dernière documentation",
        LAST_DOC_BY: "Dernière documentation par",

        //InjectionInfusionCalculator
        II_INFUSION_INJECTION: "Perfusions et injections",
        II_NUMBER: "N°",
        II_TYPE: "Type",
        II_START_ADMIN: "Début de l&#39;administration",
        II_STOP: "Fin",
        II_DURATION: "Durée (minutes)",
        II_MEDICATION: "Médicament",
        II_NO_INJECTION_INFUSION: "Aucune perfusion/injection n&#39;a été saisie.",

        //Summary
        II_SUMMARY_OF_CHARGES: "Résumé des frais"
    };
} ();