if (typeof i18n === "undefined") {
    var i18n = {};
}

i18n.oncology = {};
i18n.oncology.fn = {};

/* as in, "the bodily origin or place (the route) where the temperature was taken" */
i18n.oncology.fn.ROUTE = "Vía";
i18n.oncology.fn.CLINICAL_NAME = "Nombre clínico";
i18n.oncology.fn.CLINICAL_DISPLAY_INFO = "Información sobre visualización clínica";
i18n.oncology.fn.NO_RESULTS = "No hay resultados cualificados disponibles para el intervalo de tiempo seleccionado.";
i18n.oncology.fn.BAD_RANGE = "Intervalo de fechas no reconocido: {0}. Seleccione de nuevo.";
i18n.oncology.fn.CUSTOM = "Ya puede crear el código personalizado.";
i18n.oncology.fn.CUSTOM_JS = "Cree un archivo llamado <b>com.cerner.oncology.fn.client.js</b> en el subdirectorio .\\js del proyecto actual para la parte dinámica de su código. Defina una función llamada <b>com.cerner.oncology.fn.createCustomSection(daysBack)</b> en el archivo nuevo. Esta función es su punto de entrada desde el archivo de origen principal de MPage y se ejecutará cuando se cargue el resto de la página.";
i18n.oncology.fn.CUSTOM_CSS = "Cree un archivo llamado <b>onc_fn_client_css.css</b> en el subdirectorio .\\css del proyecto actual si quiere usar una hoja de estilo para su sección de MPage.";
i18n.oncology.fn.CUSTOM_DIR = "El directorio del proyecto actual está establecido en";
i18n.oncology.fn.CUSTOM_UCERN = "Dispone de información adicional relativa al desarrollo de contenido personalizado para esta página en uCern en";
i18n.oncology.fn.CUSTOM_GOOD_LUCK = "¡Buena suerte!";
i18n.oncology.fn.CUSTOM_ERROR = "La petición para personalizar el código de una API da error.\\n\\nAsegúrese de que ha creado un archivo de origen llamado com.cerner.oncology.fn.client.js y una función llamada com.cerner.oncology.fn.createCustomSection(daysBack) para su punto de entrada.\\n\\nHaga clic en Aceptar para ver el mensaje de error.";