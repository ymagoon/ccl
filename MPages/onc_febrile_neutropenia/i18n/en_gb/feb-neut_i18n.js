if (typeof i18n === "undefined") {
    var i18n = {};
}

i18n.oncology = {};
i18n.oncology.fn = {};

/* as in, "the bodily origin or place (the route) where the temperature was taken" */
i18n.oncology.fn.ROUTE = "Route";
i18n.oncology.fn.CLINICAL_NAME = "Clinical Name";
i18n.oncology.fn.CLINICAL_DISPLAY_INFO = "Clinical Display Info";
i18n.oncology.fn.NO_RESULTS = "There are no qualifying results available for the selected time range.";
i18n.oncology.fn.BAD_RANGE = "Unrecognised date range: {0}. Please select again.";
i18n.oncology.fn.CUSTOM = "You are now ready to create custom code.";
i18n.oncology.fn.CUSTOM_JS = "Please create a file named <b>com.cerner.oncology.fn.client.js</b> in the .\\js subdirectory of the current project for the dynamic portion of your code. Please define a function called <b>com.cerner.oncology.fn.createCustomSection(daysBack)</b> in the new file. This function is your entry point from the main MPage source file and will be called when the rest of the page is loaded.";
i18n.oncology.fn.CUSTOM_CSS = "Please create a file named <b>onc_fn_client_css.css</b> in the .\\css subdirectory of the current project if you would like to use a stylesheet for your section of the MPage.";
i18n.oncology.fn.CUSTOM_DIR = "Current project directory is set to";
i18n.oncology.fn.CUSTOM_UCERN = "Additional information regarding custom content development for this page is available on uCern at";
i18n.oncology.fn.CUSTOM_GOOD_LUCK = "Good luck!";
i18n.oncology.fn.CUSTOM_ERROR = "The call to custom code API is throwing an error.\n\nPlease, make sure you have created a source file named com.cerner.oncology.fn.client.js and a function named com.cerner.oncology.fn.createCustomSection(daysBack) for your entry point.\n\nClick OK to view the error message.";