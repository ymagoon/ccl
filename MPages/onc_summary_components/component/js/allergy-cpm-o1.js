
/**
 * Create the allergy component style object
 * @constructor
 */
function AllergyComponentCPMStyle() {
    this.initByNamespace("cpmAllergy");
}
AllergyComponentCPMStyle.prototype = new ComponentStyle();
AllergyComponentCPMStyle.prototype.constructor = ComponentStyle;

/**
 * The Allergy component will retrieve all allergies associated to the patient
 *
 * @constructor
 * @param {Criterion} criterion-contains basic information such as patientId,
 * encounterId, etc. for the visit
 */
function AllergyComponentCPM(criterion) {
   	var cpmDocI18n = i18n.discernabu.allergy_cpm_o1;
    this.setComponentLoadTimerName("USR:MPG.ALLERGY.CPM - load component");
    this.setComponentRenderTimerName("ENG:MPG.ALLERGY.CPM - render component");

    this.setCriterion(criterion);
    this.setStyles(new AllergyComponentCPMStyle());
    this.setIncludeLineNumber(true);
    this.setScope(1);
    this.setLabel(cpmDocI18n.LABEL);
    this.resultCount = 0;
}

AllergyComponentCPM.prototype = new CPMMPageComponent();
AllergyComponentCPM.prototype.constructor = AllergyComponentCPM;

/**
 * Builds the html for the reactions column
 * @param {Array} reactionArray-List of paitent reactions
 * @param {String} cssclass-Class that is to be added to the span for each reations
 */
AllergyComponentCPM.prototype.buildReaction = function(reactionArray, cssclass) {
    var reactions = "<div>";
    for (var i = 0; i < reactionArray.length; i++) {
        reactions += "<span class =" + cssclass + ">" + reactionArray[i].REACTION_NAME + "</span>";
        if(i < reactionArray.length - 1){
            reactions += "<br />";
        }
    }
    reactions += "</div>";
    return reactions;
};

/**
 * Opens links with the APPLINK API
 */
AllergyComponentCPM.prototype.openTab = function() {
    var criterion = this.getCriterion();
    var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + this.getLink() + "+^";
    APPLINK(0, criterion.executable, sParms);
};

/**
 * Takes in the results from CCL script call and adds data and formats to
 * later be added to tableColumns.
 * @param {ResultsObject} results-CCLScriptResults
 */
AllergyComponentCPM.prototype.processResultsForRender = function(results) {
    var resultLength = results.ALLERGY.length;
    var jsSeverity, jsSeverityObj, onsetPrecision, reactionType, infoSource, comments = "";
    var datetimeFlag = 0;
    var onsetDate = "--";
    var allergyResult, dateTime = null;
    var codeArray = MP_Util.LoadCodeListJSON(results.CODES);
    var personnelArray = MP_Util.LoadPersonelListJSON(results.PRSNL);
    var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);

    for (resultLength; resultLength--; ) {
        allergyResult = results.ALLERGY[resultLength];
        jsSeverityObj = (allergyResult.SEVERITY_CD) ? MP_Util.GetValueFromArray(allergyResult.SEVERITY_CD, codeArray) : {
            meaning: "",
            display: "--"
        };
        jsSeverity = (jsSeverityObj.meaning === "SEVERE" || jsSeverityObj.display.toUpperCase() === "ANAPHYLLAXIS") ? "res-severe" : "res-normal";

        //add the name field to the result JSON
        allergyResult.ALLERGY_NAME = "<span class =" + jsSeverity + ">" + allergyResult.NAME + "</span>";

        //Set up the date
        onsetDate = "--";
        dateTime = new Date();
        datetimeFlag = 0;
        onsetPrecision = (allergyResult.ONSET_PRECISION_CD ) ? MP_Util.GetValueFromArray(allergyResult.ONSET_PRECISION_CD, codeArray).display : "";

        //process the date from the JSON (copied from allergy_o1)
        if (allergyResult.ONSET_DT_TM && allergyResult.ONSET_DT_TM !== "") {
            dateTime.setISO8601(allergyResult.ONSET_DT_TM);
        }

        //format the date to be displayed correctly
        datetimeFlag = allergyResult.ONSETDATE_FLAG;
        switch (datetimeFlag) {
            case 30:
                onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
                break;
            case 40:
                onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE);
                break;
            case 50:
                onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_4YEAR);
                break;
            case 0:
                onsetDate = "--";
                break;
            default:
                onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                break;
        }

        //add the date field to the result JSON
        allergyResult.ALLERGY_DATE = "<span class=" + jsSeverity + ">" + ( onsetPrecision ? onsetPrecision + "&nbsp;" : "") + onsetDate + "</span>";

        //add the severity field to the result JSON
        allergyResult.ALLERGY_SEVERITY = "<span class =" + jsSeverity + ">" + jsSeverityObj.display + "</span>";

        //add the reaction field to the result JSON
        allergyResult.ALLERGY_REACTIONS = (allergyResult.REACTIONS.length !== 0) ? this.buildReaction(allergyResult.REACTIONS, jsSeverity) : "<span class =" + jsSeverity + ">--</span>";

        //add the reactionType field to the result JSON
        reactionType = MP_Util.GetValueFromArray(allergyResult.REACTION_CLASS_CD, codeArray);
        allergyResult.ALLERGY_REACTION_TYPE = "<span class=" + jsSeverity + ">" + ( reactionType ? reactionType.display : "--") + "</span>";

        //add the informationSource field to the result JSON
        infoSource = MP_Util.GetValueFromArray(allergyResult.SOURCE_OF_INFO_CD, codeArray);
        allergyResult.ALLERGY_INFORMATION_SOURCE = "<span class =" + jsSeverity + ">" + ( infoSource ? infoSource.display : "--") + "</span>";

        //add the Comments field to the result JSON
        comments = MP_Util.Doc.GetComments(allergyResult, personnelArray);
        allergyResult.ALLERGY_COMMENTS = "<span class =" + jsSeverity + ">" + ( comments ? comments : "--") + "</span>";

        //setting up the fields to be sortable
        allergyResult.NAME_TEXT = allergyResult.NAME;
        allergyResult.ONSET_DATE = allergyResult.ONSET_DATE;
        allergyResult.SEVERITY_TEXT = allergyResult.SORT_SEQ;
        allergyResult.REACTION_TEXT = (allergyResult.REACTIONS.length !== 0) ? allergyResult.REACTIONS[0].REACTION_NAME : "--";
        allergyResult.REACTION_TYPE_TEXT = ( reactionType ? reactionType.display : "--");
        allergyResult.INFO_SOURCE_TEXT = ( infoSource ? infoSource.display : "--");
        allergyResult.COMMENTS_TEXT = comments;
    }
};

/**
 * Calls MP_GET_ALLERGIES cclScript to retrieve patient allergy data
 */
AllergyComponentCPM.prototype.retrieveComponentData = function() {
    var criterion = this.getCriterion();
    var sendAr = ["^MINE^", criterion.person_id + ".0", "0.0", 0, criterion.provider_id + ".0", criterion.ppr_cd + ".0"];
    var self = this;

    var scriptRequest = new ComponentScriptRequest();
    scriptRequest.setProgramName("MP_GET_ALLERGIES");
    scriptRequest.setParameterArray(sendAr);
    scriptRequest.setComponent(self);
    scriptRequest.performRequest();
};

/**
 * Adds all the nessacery allergy columns to a ComponentTable and
 * renders the table for the component.
 *
 * @param {cclScriptReply} reply-Reply from CCLScript call
 */
AllergyComponentCPM.prototype.renderComponent = function(reply) {
    var numberResults = 0;
    var results = null;
    var docI18n = i18n.discernabu.allergy_o2;

    //Process the results so rendering becomes more trivial
    this.processResultsForRender(reply);
    results = reply.ALLERGY;
    numberResults = results.length;
    this.resultCount = numberResults;

    //Get the component table (the first time this is called, it is created)
    var allergyTable = new ComponentTable();
    allergyTable.setNamespace(this.getStyles().getId());

    //Create the name column
    var nameColumn = new TableColumn();
    nameColumn.setColumnId("NAME");
    nameColumn.setCustomClass("cpm-allergy-o1-col");
    nameColumn.setColumnDisplay(docI18n.NAME);
    nameColumn.setPrimarySortField("NAME_TEXT");
    nameColumn.setIsSortable(true);
    nameColumn.setRenderTemplate("${ALLERGY_NAME}");

    //Create the Severity column
    var severityColumn = new TableColumn();
    severityColumn.setColumnId("Severity");
    severityColumn.setCustomClass("cpm-allergy-o1-col");
    severityColumn.setColumnDisplay(docI18n.SEVERITY);
    severityColumn.setPrimarySortField("SEVERITY_TEXT");
    severityColumn.setIsSortable(true);
    severityColumn.setRenderTemplate("${ALLERGY_SEVERITY}");
    severityColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);

    //Create the Reaction column
    var reactionColumn = new TableColumn();
    reactionColumn.setColumnId("Reaction");
    reactionColumn.setCustomClass("cpm-allergy-o1-col");
    reactionColumn.setColumnDisplay(docI18n.REACTION);
    reactionColumn.setPrimarySortField("REACTION_TEXT");
    reactionColumn.setIsSortable(true);
    reactionColumn.setRenderTemplate("${ ALLERGY_REACTIONS}");
    reactionColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);

    //Create the Reaction Type column
    var reacTypeColumn = new TableColumn();
    reacTypeColumn.setColumnId("ReactionType");
    reacTypeColumn.setCustomClass("cpm-allergy-o1-col");
    reacTypeColumn.setColumnDisplay(docI18n.REACTION_TYPE);
    reacTypeColumn.setPrimarySortField("REACTION_TYPE_TEXT");
    reacTypeColumn.setIsSortable(true);
    reacTypeColumn.setRenderTemplate("${ ALLERGY_REACTION_TYPE }");
    reacTypeColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);

    //Create the Source column
    var sourceColumn = new TableColumn();
    sourceColumn.setColumnId("Source");
    sourceColumn.setCustomClass("cpm-allergy-o1-col");
    sourceColumn.setColumnDisplay(i18n.SOURCE);
    sourceColumn.setPrimarySortField("INFO_SOURCE_TEXT");
    sourceColumn.setIsSortable(true);
    sourceColumn.setRenderTemplate("${ ALLERGY_INFORMATION_SOURCE }");
    sourceColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);

    //Create the Comments column
    var commentColumn = new TableColumn();
    commentColumn.setColumnId("Comments");
    commentColumn.setCustomClass("cpm-allergy-o1-col");
    commentColumn.setColumnDisplay(docI18n.COMMENTS);
    commentColumn.setPrimarySortField("COMMENTS_TEXT");
    commentColumn.setIsSortable(true);
    commentColumn.setRenderTemplate("${ ALLERGY_COMMENTS }");
    commentColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);

    //Add the columns to the table
    allergyTable.addColumn(nameColumn);
    allergyTable.addColumn(severityColumn);
    allergyTable.addColumn(reactionColumn);
    allergyTable.addColumn(reacTypeColumn);
    allergyTable.addColumn(sourceColumn);
    allergyTable.addColumn(commentColumn);

    //Bind the data to the results
    allergyTable.bindData(results);

    //Default the sorting to the Date Column descending
    allergyTable.sortByColumnInDirection("Severity", TableColumn.SORT.DESCENDING);

    //Store off the component table
    this.setComponentTable(allergyTable);

    //Finalize the component using the allergyTable.render() method to create the table html
    this.finalizeComponent(allergyTable.render(), MP_Util.CreateTitleText(this, numberResults));

    //Update the component result count
    CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
        "count": numberResults
    });
};

/**
 * Map the Allergy O2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_ALLERGY" filter
 */
CPMController.prototype.addComponentMapping("ALLERGY", AllergyComponentCPM);