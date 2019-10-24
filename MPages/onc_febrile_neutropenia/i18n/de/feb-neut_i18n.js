if (typeof i18n === "undefined") {
    var i18n = {};
}

i18n.oncology = {};
i18n.oncology.fn = {};

/* as in, "the bodily origin or place (the route) where the temperature was taken" */
i18n.oncology.fn.ROUTE = "Verabreichungsweg";
i18n.oncology.fn.CLINICAL_NAME = "Klinischer Name";
i18n.oncology.fn.CLINICAL_DISPLAY_INFO = "Klinische Anzeigeinformationen";
i18n.oncology.fn.NO_RESULTS = "Für den ausgewählten Zeitrahmen sind keine zulässigen Ergebnisse verfügbar.";
i18n.oncology.fn.BAD_RANGE = "Unbekannter Zeitrahmen: {0}. Wählen Sie erneut aus.";
i18n.oncology.fn.CUSTOM = "Sie können nun benutzerdefinierten Kode erstellen.";
i18n.oncology.fn.CUSTOM_JS = "Erstellen Sie für den dynamischen Abschnitt Ihres Kodes eine Datei mit dem Namen <b>com.cerner.oncology.fn.client.js</b> im Unterverzeichnis .\js des aktuellen Projekts. Definieren Sie in der neuen Datei eine Funktion mit dem Namen <b>com.cerner.oncology.fn.createCustomSection(daysBack)</b>. Diese Funktion ist Ihr Einsprungspunkt von der MPage-Quelldatei, die aufgerufen wird, wenn der Rest der Seite geladen ist.";
i18n.oncology.fn.CUSTOM_CSS = "Falls Sie ein Stylesheet für Ihren Abschnitt der MPage verwenden möchten, definieren Sie eine Datei mit dem Namen <b>onc_fn_client_css.css</b> im Unterverzeichnis .\css des aktuellen Projekts.";
i18n.oncology.fn.CUSTOM_DIR = "Das aktuelle Projektverzeichnis ist";
i18n.oncology.fn.CUSTOM_UCERN = "Weitere Informationen zur benutzerdefinierten Entwicklung von Inhalten für diese Seite erhalten Sie auf der uCern-Seite";
i18n.oncology.fn.CUSTOM_GOOD_LUCK = "Viel Erfolg!";
i18n.oncology.fn.CUSTOM_ERROR = "Beim Aufrufen der benutzerdefinierten Kode-API ist ein Fehler aufgetreten.Stellen Sie sicher, dass Sie eine Quelldatei mit dem Namen com.cerner.oncology.fn.client.js und eine Funktion mit dem Namen com.cerner.oncology.fn.createCustomSection(daysBack) für Ihren Einsprungspunkt erstellt haben.Klicken Sie auf 'OK', um die Fehlermeldung aufzurufen.";