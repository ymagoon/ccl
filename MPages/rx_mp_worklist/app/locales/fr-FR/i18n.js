﻿define({
    app: {
        modules: {
            localization: {
                title: "Liste de travail du pharmacien clinique",
                GENERIC_ERROR: "Une erreur s'est produite lors du chargement de la liste de travail du pharmacien clinique."
            },
            patientPopulation: {
                DEFAULT: "Valeur par défaut",
                PATIENT_LIST_LABEL: "Liste de patients :",
                PATIENT_LIST_CAPTION: "Sélectionner une liste de patients",
                FACILITIES: "Établissements :",
                FACILITIES_CAPTION: "Sélectionner un établissement",
                NURSE_UNIT_TITLE: "Unités de soins",
                NURSE_UNIT_LABEL: "Unités de soins",
                NURSE_UNIT_CAPTION: "Cliquez pour ouvrir les unités de soins.",
                NURSE_UNIT_DIALOG_TITLE: "Veuillez sélectionner une ou plusieurs unités de soins.",
                SUBMIT_CAPTION: "Soumettre",
                CANCEL_CAPTION: "Annuler",
                FACILITES_LOAD_FAILED: "Impossible de charger les établissements",
                NURSE_UNITS_LOAD_FAILED: "Impossible de charger les unités de soins",
                PATIENT_LIST_LOAD_FAILED: "Impossible de charger la liste des patients",
                RESET_CAPTION: "Effacer",
                FILTER_CAPTION: "Filtre",
                SAVE_CAPTION: "Enregistrer",
                SELECTED_PATIENT_POPULATION: "Population de patients sélectionnée",
                SUBMIT_TOOLTIP: "Cliquez pour afficher la liste des patients éligibles.",
                PL_FACILITIES_TOOLTIP: "Sélectionnez une liste de patients ou un établissement, puis une unité de soins dans les sélections ci-dessus et cliquez sur le bouton Envoyer pour afficher la liste des patients éligibles.",
                FACILITIES_NU_TOOLTIP: "Sélectionnez un établissement et une unité de soins dans les sélections ci-dessus et cliquez sur le bouton Envoyer pour afficher la liste des patients éligibles.",
                PATIENT_POPULATION_FAILED: "Erreur de chargement des informations sur la population de patients."
            },
            myPopulation: {
                MY_POPULATIONS: "Mes populations",
                DUPLICATE_VIEW_NAME: "Le nom Ma population %s existe déjà. Saisissez un nom unique.",
                SAVE_SUCCESS: "Ma population %s a été enregistrée avec succès",
                SAVE_STARTED: "Enregistrement de Ma population %s",
                SAVE_FAILED: "Impossible d'enregistrer Ma population %s. Veuillez réessayer.",
                REMOVE_STARTED: "Suppression de Ma population %s",
                REMOVE_SUCCESS: "Ma population %s a été supprimée avec succès",
                REMOVE_FAILED: "Impossible de supprimer Ma population %s. Veuillez réessayer.",
                HIGH_RISK_CATEGORIES: "Catégories à haut risque :",
                MY_CATEGORIES: "Mes catégories :",
                MY_VIEWS_CAPTION: "--Nouveau--",
                VIEWS: "Vues:",
                VIEW_NAME_TITLE: "Saisissez le nom de la vue :",
                APPLY_CAPTION: "Appliquer",
                OK_CAPTION: "OK",
                RESET_DEFAULT: "Réinitialisation de l'indicateur par défaut des vues %s",
                ACTIVATION_FAILED: "Impossible de charger la fenêtre Mes populations",
                MESSAGE_BOX_TITLE: "Supprimer Ma population",
                MESSAGE_BOX_CONTENT: "Voulez-vous vraiment supprimer définitivement Ma population sélectionnée ?"
            },
            tooltip: {
                DOB_CAPTION: "Né(e) le :",
                LATEST_NOTE_CAPTION: "Dernier mémo:"
            },
            populationLinks: {
                MY_POP_BUTTON: "Mes populations",
                VIEWS_LABEL: "Vues:",
                VIEW_LIST_CAPTION: "Sélectionnez une vue",
                HRC_LOAD_FAILED: "Impossible de charger les catégories à haut risque",
                VIEWS_LOAD_FAILED: "Impossible de charger les vues Ma population",
                MY_POPULAIONS_FAILED: "Impossible d'afficher Mes populations",
                UPDATE_VIEW_FAILED: "Impossible de charger les vues actualisées Ma population"
            },
            patientInformation: {
                ATTENDING_PHYSICIAN_CAPTION: "Médecin responsable :",
                ADMITTING_PHYSICIAN_CAPTION: "Médecin responsable de l'admission :",
                LOCATION_CAPTION: "Emplacement:",
                ADMITTED_CAPTION: "Admis le :",
                LOS_CAPTION: "Durée du séjour :",
                LINK_CLICK_CAPTION: "Cliquez pour ouvrir",
                STICKY_NOTE_ICON_TOOLTIP: "Cliquez afin d'ajouter un nouveau mémo pour ce patient.",
                DAY_CAPTION: "jour",
                DAYS_CAPTION: "jours",
                PCP_CAPTION: "Médecin traitant :"
            },
            worklist: {
                REMOVE_CAPTION: "Supprimer",
                RESET_CAPTION: "Réinitialiser",
                SAVE_CAPTION: "Enregistrer",
                CLINICAL_NOTE_CAPTION: "Cliquez pour ouvrir le lien.",
                NO_DATA_MESSAGE: "Selon les critères définis, il n'existe aucun patient éligible à afficher.",
                CLINICAL_NOTE_OPEN_FAILED: "Impossible d'ouvrir la note clinique",
                TAB_OPEN_FAILED: "Impossible de lancer l'onglet PowerChart",
                WORKLIST_LOAD_FAILED: "Impossible de charger la liste de travail pour les critères de recherche spécifiés",
                CDC_REPORT_FAILED: "Impossible d'ouvrir le rapport CDC",
                HRC_COLUMN_CLICK_FAILED: "Impossible d'ouvrir le lien de la colonne Catégorie à haut risque",
                LOADING_CAPTION: "Chargement des données de la liste de travail..."
            },
            stickyNote: {
                NOTE_ENTRY: "Entrée de mémo",
                NOTE_VIEW: "Vue de mémo",
                CLOSE_CAPTION: "Fermer",
                MESSAGE_BOX_TITLE: "Mémo modifié",
                MESSAGE_BOX_CONTENT: "Voulez-vous enregistrer la note ?",
                MESSAGE_BOX_YES: "Oui",
                MESSAGE_BOX_NO: "Non",
                MESSAGE_BOX_CANCEL: "Annuler",
                NOTE_SAVE_FAILED: "Impossible d'enregistrer le mémo",
                NOTE_DELETE_FAILED: "Impossible de supprimer le mémo",
                NOTE_SAVED: "Mémo enregistré avec succès",
                NOTE_DELETED: "Mémo supprimé",
                DELETING_NOTE: "Suppression du mémo",
                SAVING_NOTE: "Enregistrement du mémo",
                WRITTEN_BY_CAPTION: "Écrit par",
                DATE_CAPTION: "Date",
                DELETE_NOTE_TITLE: "Supprimer la note",
                DELETE_NOTE_CONTENT: "Voulez-vous vraiment supprimer définitivement la note sélectionnée ?"
            },
            logMessage: {
                INVALID_DATE: "Champ de date non valide",
                MISSING_LOCALE: "Paramètres régionaux manquants",
                EVENT_DETAILS_FAILED: "Impossible d'obtenir les informations sur les événements d'administration médicale",
                CDF_MEANING_FAILED: "Impossible d'obtenir la signification CDF",
                VIEW_SELECTION_FAILED: "Impossible de sélectionner Ma population",
                DIAGNOSIS_DETAILS_FAILED: "Impossible d'obtenir les informations sur le diagnostic",
                DRUG_DETAIL_FAILED: "Impossible d'obtenir les informations sur la classe de médicament",
                MICRO_HEADER_FAILED: "Impossible d'obtenir l'en-tête de microbiologie",
                MICRO_DETAIL_FAILED: "Impossible d'obtenir les informations de microbiologie",
                ORDER_DETAIL_FAILED: "Impossible d'obtenir les informations sur la prescription",
                STICKY_NOTES_FAILED: "Impossible de lancer les mémos",
                IMAGE_PATH_FAILED: "Impossible d'obtenir le chemin de l'image",
                PATIENT_INFO_FAILED: "Impossible de charger les informations du patient",
                UPDATE_INFORMATION_FAILED: "Impossible de mettre à jour les informations du patient",
                NURSE_UNIT_LIST_FAILED: "Impossible de composer la liste des unités de soins sélectionnées",
                PATIENT_LIST_FAILED: "Impossible de charger la liste des patients",
                FACILITIES_FAILED: "Impossible de charger les établissements",
                QUALIFIER_SETTINGS_FAILED: "Impossible de charger les paramètres d'éligibilité du patient",
                SEARCH_CRITERIA: "Impossible de renseigner les critères de recherche du patient"
            }
        }
    }
});
