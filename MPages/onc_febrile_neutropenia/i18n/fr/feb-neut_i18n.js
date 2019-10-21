if (typeof i18n === "undefined") {
    var i18n = {};
}

i18n.oncology = {};
i18n.oncology.fn = {};

/* as in, "the bodily origin or place (the route) where the temperature was taken" */
i18n.oncology.fn.ROUTE = "Emplacement";
i18n.oncology.fn.CLINICAL_NAME = "Nom clinique";
i18n.oncology.fn.CLINICAL_DISPLAY_INFO = "Information de l'affichage clinique";
i18n.oncology.fn.NO_RESULTS = "Il n'y a aucun résultat correspondant à la plage horaire sélectionnée.";
i18n.oncology.fn.BAD_RANGE = "Plage de dates non reconnue : {0}. Veuillez recommencer votre sélection.";
i18n.oncology.fn.CUSTOM = "Vous êtes désormais prêt à créer le code personnalisé.";
i18n.oncology.fn.CUSTOM_JS = "Veuillez créer un fichier nommé <b>com.cerner.oncology.fn.client.js</b> dans le sous-répertoire .\\js du projet en cours pour la portion dynamique de votre code. Veuillez définir une fonction appelée <b>com.cerner.oncology.fn.createCustomSection(daysBack)</b> dans le nouveau fichier. Cette fonction constitue votre point d'entrée à partir du fichier source MPage principal et sera appelée une fois le reste de la page chargé.";
i18n.oncology.fn.CUSTOM_CSS = "Veuillez créer un fichier nommé <b>onc_fn_client_css.css</b> dans le sous-répertoire .\\css du projet en cours si vous voulez utiliser une feuille de style pour votre section de la MPage.";
i18n.oncology.fn.CUSTOM_DIR = "Le répertoire du projet actuel est défini sur";
i18n.oncology.fn.CUSTOM_UCERN = "Les informations supplémentaires concernant le développement du contenu personnalité pour cette page sont disponibles sur uCern à l'adresse";
i18n.oncology.fn.CUSTOM_GOOD_LUCK = "Bonne chance!";
i18n.oncology.fn.CUSTOM_ERROR = "L'appel du code personnalisé API renvoie une erreur.\n\nVeuillez vérifier que vous avez bien créé un fichier source nommé com.cerner.oncology.fn.client.js et une fonction nommée com.cerner.oncology.fn.createCustomSection(daysBack) pour votre point d'entrée.\n\nCliquez sur OK pour voir le message d'erreur.";