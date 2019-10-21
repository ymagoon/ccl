/**
 * @constructs PersonRegistriesComponentStyle
 * @returns {PersonRegistriesComponentStyle} Initialized PersonRegistriesComponentStyle
 */
function PersonRegistriesComponentStyle() {
  this.initByNamespace("hi_pr");
}
PersonRegistriesComponentStyle.prototype = new ComponentStyle();
PersonRegistriesComponentStyle.prototype.constructor = ComponentStyle;

/**
 * @constructs PersonRegistriesComponent
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 * @returns {PersonRegistriesComponent} initialized PersonRegistriesComponent
 */
function PersonRegistriesComponent(criterion) {
  this.setCriterion(criterion);
  this.setComponentLoadTimerName("USR:MPG.PERSONREG - load component");
  this.setComponentRenderTimerName("ENG:MPG.PERSONREG - render component");
  this.setIncludeLineNumber(true);
  this.setStyles(new PersonRegistriesComponentStyle());

  /* Initialize our filter values in case they were not defined in Bedrock. */
  this.testURI = "";
  this.aliasType = "";
  this.aliasPoolCode = 0;
  this.lookupKey = "";
  this.measuresStatusFilter = "";
  this.allRegistriesCollapsed = false;
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
PersonRegistriesComponent.prototype = new MPageComponent();
PersonRegistriesComponent.prototype.constructor = PersonRegistriesComponent;


/* Supporting functions */

PersonRegistriesComponent.prototype.setTestURI = function(value) {
  /* Our test uri is returned from Bedrock "scrubbed" for clean HTML presentation. This replace
     restores the '/' characters to our test uris. */
  this.testURI = value.replace(/&#047;/g, "/");
};
PersonRegistriesComponent.prototype.getTestURI = function() { return this.testURI; };
PersonRegistriesComponent.prototype.setAliasType = function(value) { this.aliasType = value; };
PersonRegistriesComponent.prototype.getAliasType = function() { return this.aliasType; };
PersonRegistriesComponent.prototype.setAliasPoolCode = function(value) { this.aliasPoolCode = value[0]; };
PersonRegistriesComponent.prototype.getAliasPoolCode = function() { return this.aliasPoolCode; };
PersonRegistriesComponent.prototype.setLookupKey = function(value) { this.lookupKey = value; };
PersonRegistriesComponent.prototype.getLookupKey = function() { return this.lookupKey; };
PersonRegistriesComponent.prototype.getMeasuresStatusFilter = function() { return this.measuresStatusFilter; };
PersonRegistriesComponent.prototype.setMeasuresStatusFilter = function(value) { this.measuresStatusFilter = value; };
PersonRegistriesComponent.prototype.setAllRegistriesCollapsed = function(value) { this.allRegistriesCollapsed = value; };
PersonRegistriesComponent.prototype.getAllRegistriesCollapsed = function() { return this.allRegistriesCollapsed; };

/**
 * This function will allow the component to handle any postprocessing that may need to take place once
 * the renderComponent function has completed execution.
 * @returns {undefined} returns nothing
 */
PersonRegistriesComponent.prototype.postProcessing = function() {
  MPageComponent.prototype.postProcessing.call(this);

  // if allRegistriesCollapsed is set to true, collapse all measures
  if(this.getAllRegistriesCollapsed()) {
    $(this.getSectionContentNode()).find(".person-registries-component .sub-sec").addClass("closed");
  }
  this.setCollapseExpandControls();

  $("#" + this.getComponentId() + "-person-registries-measure-filter-select").val(this.getMeasuresStatusFilter());
};

/*
 * isWorkflow - Check if current component is workflow or not.
 */
PersonRegistriesComponent.prototype.isWorkflow = function() {
  return this.getStyles().getComponentType() === CERN_COMPONENT_TYPE_WORKFLOW;
};

/*
 * registriesComponentToolbar - Builds the layout to display quality score, registry collapse/expand
 * button, and filter dropdown.
 *
 * @param {String} score - The string for quality score.
 *
 * @return Layout of toolbar section.
 */
PersonRegistriesComponent.prototype.registriesComponentToolbar = function(score) {
  // Build the markup for the quality score header
  var qualityScore = "--";
  var docI18n = i18n.discernabu.person_registries_o1;

  if (score !== undefined && score !== null) {
    qualityScore = score;
  }

  return "<div class='sub-title-disp'><div id='" + this.getComponentId() +
         "-person-registries-component-score' " +
         "class='person-registries-component-score summary'>" +
         docI18n.QUALITY_SCORE +
         "<span class='bold-text'>" + qualityScore + "</span>" +
         this.toolbarButtons() +
         "<span class='pull-right hi_pr-measures-filter-select'>" +
           docI18n.MEASURE_FILTER_DISPLAY.replace("{0}", this.buildFilterSelect()) +
         "</span>" +
         "</div></div>";
};

/*
 * toolbarButtons - Builds the layout for the toolbar buttons
 *
 * @return Layout of toolbar buttons.
 */
PersonRegistriesComponent.prototype.toolbarButtons = function() {
  var docI18n = i18n.discernabu.person_registries_o1;

  return "<span class='pull-right'>" +
            "<span class='expand-collapse-button' id='collapse-all-registries-btn" + this.getComponentId() + "'>" +
              docI18n.COLLAPSE_ALL +
            "</span>" +
            "<span class='expand-collapse-button hide' id='expand-all-registries-btn" + this.getComponentId() + "'>" +
              docI18n.EXPAND_ALL +
            "</span>" +
         "</span>";
};

/*
 * expandAllRegistries - Expands all the registries and toggle Expand/Collapse All button.
 */
PersonRegistriesComponent.prototype.expandAllRegistries = function() {
  var componentId = this.getComponentId();
  $(this.getSectionContentNode()).find(".person-registries-component .closed .sub-sec-hd-tgl").trigger("click");
  $("#expand-all-registries-btn" + componentId).hide();
  $("#collapse-all-registries-btn" + componentId).show();
};

/*
 * collapseAllRegistries - Collapse all the registries and toggle Expand/Collapse All button.
 */
 PersonRegistriesComponent.prototype.collapseAllRegistries = function() {
  var componentId = this.getComponentId();

  $(this.getSectionContentNode()).find(".person-registries-component .sub-sec-hd-tgl").trigger("click");
  $("#collapse-all-registries-btn" + componentId).hide();
  $("#expand-all-registries-btn" + componentId).show();
};

/*
 * setCollapseExpandControls - Set display of Collapse All and Expand All buttons when
 *                             individual registry is collapsed and expanded.
 */
PersonRegistriesComponent.prototype.setCollapseExpandControls = function() {
  var componentId = this.getComponentId(),
      collapsed = $(this.getSectionContentNode()).find(".person-registries-component .closed").length,
      $collapseAllBtn = $("#collapse-all-registries-btn" + componentId),
      $expandAllBtn = $("#expand-all-registries-btn" + componentId);

  if (collapsed === 0) {
    $collapseAllBtn.not(":visible").show();
    $expandAllBtn.not(":hidden").hide();
  } else {
    $collapseAllBtn.not(":hidden").hide();
    $expandAllBtn.not(":visible").show();
  }
};

/*
 * buildFilterSelect - Builds the layout of the Measure filter select dropdown.
 *
 * @return HTMl for the Measure Filter select.
 */
PersonRegistriesComponent.prototype.buildFilterSelect = function() {
  var docI18n = i18n.discernabu.person_registries_o1;

  return "<select id='" + this.getComponentId() + "-person-registries-measure-filter-select'>" +
           "<option value='all'>" + docI18n.MEASURE_FILTER_ALL + "</option>" +
           "<option value='not_achieved'>" + docI18n.MEASURE_FILTER_NOT_ACHIEVED + "</option>" +
           "<option value='missing'>" + docI18n.MEASURE_FILTER_MISSING + "</option>" +
           "<option value='due'>" + docI18n.MEASURE_FILTER_DUE + "</option>" +
         "</select>";
};

/*
 * renderPersonRegistriesComponentBody - Renders the template for the registry component.
 *
 * @param {Array} programs - Array of program objects.
 *
 * @return Template for registry component with detailed registry data.
 */
PersonRegistriesComponent.prototype.renderPersonRegistriesComponentBody = function(programs) {
  var output = "";

  for (var i = 0; i < programs.length; i++) {
    if (programs.hasOwnProperty(i)) {
      output += this.buildRegistryList(programs[i]);
    }
  }

  return output;
};

/*
 * buildRegistryList - Builds the layout for the entire registry list with header and body.
 *
 * @param {Object} program - The program object.
 *
 * @return Layout for the list of registries.
 */
PersonRegistriesComponent.prototype.buildRegistryList = function(program) {
  var docI18n = i18n.discernabu.person_registries_o1,
      registryList,
      i;

  registryList = "<div class='sub-sec'>" +
            this.buildRegistryListHeader(program) +
         "<div class='sub-sec-content'>";

  // Build the body part for standard measures
  if (program.measures) {
    for (i = 0; i < program.measures.length; i++) {
      var measure = program.measures[i];
      registryList += this.buildRegistryListBody(measure);
    }

    if (program.measures.length === 0) {
      if (program.total_measure_count && this.getMeasuresStatusFilter() !== "all") {
        registryList += "<span class='hi_pr-info'>" + docI18n.MEASURE_FILTER_NO_MEASURES + "</span>";
      } else {
        registryList += "<span class='hi_pr-info'>" + docI18n.NO_QUALIFYING_MEASURES + "</span>";
      }
    }
  }

  // Build the body part for event_based measures
  if (program.events) {
    for (i = 0; i < program.events.length; i++) {
      var event = program.events[i];
      registryList += this.buildRegistryEventBody(event);
    }

    if (program.events.length === 0) {
      if (program.total_measure_count && this.getMeasuresStatusFilter() !== "all") {
        registryList += "<span class='hi_pr-info'>" + docI18n.MEASURE_FILTER_NO_MEASURES + "</span>";
      } else {
        registryList += "<span class='hi_pr-info'>" + docI18n.NO_QUALIFYING_MEASURES + "</span>";
      }
    }
  }

  registryList += "</div></div>";
  return registryList;
};

/*
 * buildRegistryListHeader - Builds the layout for the header of registry list with required info.
 *
 * @param {Object} program - The program object.
 *
 * @return Layout for the header of the registry list.
 */
PersonRegistriesComponent.prototype.buildRegistryListHeader = function(program) {
  var docI18n = i18n.discernabu.person_registries_o1;
  return "<h3 class='sub-sec-hd'>" +
            "<span class='sub-sec-hd-tgl'>-</span>" +
            "<span class='sub-sec-title bold-text'>" + program.name + "</span> " +
            "<div class='sub-sec-title met-count'>" +
              "<span class='sub-sec-title met-count'>" +
                docI18n.COMPLETION_RATIO.replace("{0}", program.met_measure_count).replace("{1}", program.total_measure_count) +
                "<div class='sub-sec-title icon-info-sprite' data-type='Registry' data-id=" + program.id + "></div>" +
              "</span>" +
            "</div>" +
         "</h3>";
};

/*
 * buildRegistryListBody - Builds layout of measure row with the required info (measure name, measure status...).
 *
 * @param {Object} measure - The measure object.
 *
 * @return Layout for the body of the registry list.
 */
PersonRegistriesComponent.prototype.buildRegistryListBody = function(measure) {
  // Build the markup for each measure.
  var nameDisplay = measure.name,
      supportingFacts = measure.supporting_facts,
      measureClass = this.getMeasureClass(measure.outcome),
      measureStatus = this.getMeasureStatus(measure.outcome),
      date;

  // Find the most recent non-null date from supporting facts
  if (supportingFacts.length > 0) {
    for (var i = 0; i < supportingFacts.length; i++) {
      date = supportingFacts[i].date;
      break;
    }
  }

  return "<dl class='hi_pr-info " + measureClass + "-outcome'>" +
            "<dd class='hi_pr-name'>" +
              "<div class='wrapper'>" +
                "<div class=" + this.getMeasureIconClass(measure.outcome, measure.measure_due) + " title='" + measureStatus + "'></div>" +
                "<span title='" + nameDisplay + "'>" + nameDisplay + "</span>" +
              "</div>" +
              "<div class='icon-info-sprite' data-id=" + measure.fqn + "></div>" +
            "</dd>" +
            "<dd class='hi_pr-stat'>" +
              this.displayDueDate(measure.due_date, measure.measure_due, measure.outcome) +
            "</dd>" +
            "<dd class='hi_pr-stat'>" + measure.value_unit + "</dd>" +
            "<dd class='hi_pr-within pull-right'>" + this.dateFormatter(date) + "</dd>" +
          "</dl>";
};

/*
 * buildRegistryEventBody - Builds layout of event group with the required info (performed date, providers).
 *
 * @param {Object} event - The event object.
 *
 * @return Layout for the body of the event group.
 */
PersonRegistriesComponent.prototype.buildRegistryEventBody = function(event) {
  var body,
      performedDate = this.dateFormatter(event.date),
      providerNames = this.getProviderNames(event.responsible_providers),
      docI18n = i18n.discernabu.person_registries_o1;

  body = "<div class='event-group'>" +
          "<div class='sub-sec-hd'>" +
            "<span class='sub-sec-title'>" +
              docI18n.EVENT_PERFORMED.replace("{0}", performedDate).replace("{1}", providerNames) +
            "</span>" +
          "</div>";

  // Build the event content when there is at least one measure for this event.
  if (event.measures !== undefined && event.measures !== null && event.measures.length > 0) {
    body += "<div class='event-content'>";

    for (var i = 0; i < event.measures.length; i++) {
      var measure = event.measures[i];
      body += this.buildRegistryListBody(measure);
    }

    body += "</div>";
  }

  body += "</div>";

  return body;
};

/*
 * getMeasureClass - Determine the type of measure class based on outcome status.
 *
 * @param {String} outcome - The string for outcome status which can be 'EXCLUDED',
 *                           'ACHIEVED', 'MISSING_DATA' or 'NOT_ACHIEVED'.
 *
 * @return The string for measure class.
 */
PersonRegistriesComponent.prototype.getMeasureClass = function(outcome) {
  switch (outcome) {
    case "EXCLUDED":
      return "excluded";
    case "ACHIEVED":
      return "positive";
    case "MISSING_DATA":
      return "missing-data";
    case "NOT_ACHIEVED":
      return "negative";
    default:
      return null;
  }
};

/*
 * getMeasureIconClass - Determine the outcome icon class for the measure row based on outcome status and due date.
 *
 * @param {String} outcome     - The string for outcome status which can be 'EXCLUDED',
 *                               'ACHIEVED', 'MISSING_DATA' or 'NOT_ACHIEVED'.
 * @param {Boolean} measureDue - The boolean indicating whether the measure is due which
 *                               can be true when measure is due, false otherwise.
 *
 * @return The string of the outcome icon class.
 */
PersonRegistriesComponent.prototype.getMeasureIconClass = function(outcome, measureDue) {
  switch (outcome) {
    case "EXCLUDED":
      return "icon-excluded-sprite";
    case "ACHIEVED":
      return "icon-positive-sprite";
    case "MISSING_DATA":
      return measureDue ? "icon-time-negative-sprite" : "icon-missing-data-sprite";
    case "NOT_ACHIEVED":
      return measureDue ? "icon-time-negative-sprite" : "icon-negative-sprite";
    default:
      return null;
  }
};

/*
 * getMeasureStatus - Determine the type of measure status based on outcome status.
 *
 * @param {String} outcome - The string for outcome status which can be 'EXCLUDED',
 *                           'ACHIEVED', 'MISSING_DATA' or 'NOT_ACHIEVED'.
 *
 * @return The string for measure status.
 */
PersonRegistriesComponent.prototype.getMeasureStatus = function(outcome) {
  var docI18n = i18n.discernabu.person_registries_o1;
  switch (outcome) {
    case "EXCLUDED":
      return docI18n.MEASURE_EXCLUDED;
    case "ACHIEVED":
      return docI18n.MEASURE_ACHIEVED;
    case "MISSING_DATA":
      return docI18n.MEASURE_MISSING_DATA;
    case "NOT_ACHIEVED":
      return docI18n.MEASURE_NOT_ACHIEVED;
    default:
      return null;
  }
};

/*
 * displayDueDate - Build the layout for displaying due date based on outcome status and the existence of the due date.
 *
 * @param {String} dueDate      - The string of the due date.
 * @param {String} outcome      - The string for outcome status which can be 'EXCLUDED',
 *                                'ACHIEVED', 'MISSING_DATA' or 'NOT_ACHIEVED'.
 *
 * @return Layout for displaying due date. Display '--' when no due date or the measure is excluded.
 */
PersonRegistriesComponent.prototype.displayDueDate = function(dueDate, measureDue, outcome) {
  var dueDateIcon, dueDateText;

  if (outcome === "EXCLUDED") {
    return "--";
  }

  if (dueDate) {
    dueDateText = this.dateFormatter(dueDate);
  } else if (measureDue) {
    dueDateText = i18n.discernabu.person_registries_o1.MEASURE_DUE_NOW;
  } else {
    return "--";
  }

  dueDateIcon = outcome === "ACHIEVED" ? "icon-time-positive-sprite" : "icon-time-negative-sprite";

  return "<div class='wrapper'>" +
            "<div class='" + dueDateIcon + "'></div>" +
            "<span>" + dueDateText + "</span>" +
          "</div>";
};
/*
 * dateFormatter - Parses the datetime and converts to short date format.
 *
 * @param {String} date - The datetime string.
 *
 * @return The Date object.
 *         If the input date is not a date which has complete year, month and day, returns whatever got from API.
 *         If the input is undefined or null, returns '--'.
 */
PersonRegistriesComponent.prototype.dateFormatter = function(date) {
  if (date !== undefined && date !== null) {
    try {
      return $.datepicker.parseDate("yy-mm-dd", date.split("T")[0]).format("mediumDate");
    }
    catch (error) {
      logger.logJSError(error, PersonRegistriesComponent, "person-registries-o1.js", "dateFormatter");
      return date;
    }
  } else {
    return "--";
  }
};

/*
 * getMeasures - Retrieve either event-based measures or standard measures from one particular program.
 *
 * @param {Object} program - The program object.
 *
 * @return An array of measures.
 */
PersonRegistriesComponent.prototype.getMeasures = function(program) {
  var measures = [],
      rawMeasures = [];

  if (program.measures) {
    // Standard measures
    measures = program.measures;
  } else if (program.events) {
    // Retrieve the arrays of measures from events.
    for (var j = 0; j < program.events.length; j++) {
      var eventBasedMeasures = program.events[j].measures;

      if (eventBasedMeasures !== null && eventBasedMeasures.length > 0) {
        rawMeasures.push(eventBasedMeasures);  // Build an array which contains multiple arrays of measures.
      }
    }

    // Flatten the nested array
    measures = measures.concat.apply(measures, rawMeasures);
  }

  return measures;
};

/*
 * getProviderNames - Retrieve the names of the providers who performed the event.
 *
 * @param {Array} providers - Array of provider objects.
 *
 * @return String for multiple providers' names separated by comma.
 */
PersonRegistriesComponent.prototype.getProviderNames = function(providers) {
  var providerNames = [];

  if (providers !== undefined && providers !== null && providers.length > 0) {
    for (var i = 0; i < providers.length; i++) {
      var name = providers[i].full_name;
      if (name !== null && name !== "") {
        providerNames.push(name);
      }
    }
  }

  return providerNames.join(", ");
};

/*
 * measuresStatusFilterChangeEventHandler - Actions to be performed when the measures status
 *                                          filter select box is changed
 */
PersonRegistriesComponent.prototype.measuresStatusFilterChangeEventHandler = function() {
  this.setMeasuresStatusFilter(
    $("#" + this.getComponentId() + "-person-registries-measure-filter-select").val()
  );

  this.retrieveComponentData();
};

/*
 * initRegistriesToolbarButtons - Adds click event handler to 'expand/collapse all' button
 *                                and to control the button status when expand/collapse
 *                                the individual registry. Adds change event handler for the
 *                                measure status filter.
 */
PersonRegistriesComponent.prototype.initRegistriesToolbarButtons = function() {
  var componentId = this.getComponentId(),
      klass = this;

  // Removes any event handlers for the expand/collapse all button that may be
  // present after component reload
  $("#hi_pr" + componentId).off();

  $("#hi_pr" + componentId).on("click", "#expand-all-registries-btn" + componentId, function() {
    klass.expandAllRegistries();
  });
  $("#hi_pr" + componentId).on("click", "#collapse-all-registries-btn" + componentId, function() {
    klass.collapseAllRegistries();
  });
  $("#hi_pr" + componentId).on("click", ".person-registries-component .sub-sec-hd-tgl", function() {
    klass.setCollapseExpandControls();
  });

  // Removes any event handlers for the filter select dropdown that may be
  // present after component reload, then adds an event handler to listen
  // for change on the dropdown.
  $("#" + componentId + "-person-registries-measure-filter-select")
    .off()
    .on("change", function() {
      klass.measuresStatusFilterChangeEventHandler();
    });
};

/*
 * initSupportingFacts - Adds a click event handler to each supporting facts icon to launch the
 *                       supporting facts dialog. This function should only be called after the
 *                       sections have been added to the DOM.
 *
 * @param {Object} programs - The programs object.
 */
PersonRegistriesComponent.prototype.initSupportingFacts = function(programs) {
  var klass = this;

  // Removes any event handlers that may have been present on the supporting fact icons after component reload,
  // then builds modal dialog when clicking icon-info-sprite
  $(klass.getSectionContentNode()).off().on("click", ".person-registries-component .icon-info-sprite", function () {
    var $infoIcon = $(this),
        type = $infoIcon.data("type"),  // The type of the instance the supporting facts belongs to. Could be 'Registry' or undefined.
        supportingId = $infoIcon.data("id"), // The string to identify a certain program/measure.
        docI18n = i18n.discernabu.person_registries_o1,
        supportingFacts,
        modalHeaderTitle,
        noSupportingFactsMsg,
        tableContent,
        i;

    // Renders the modal dialog for supporting facts data.
    if (type === "Registry") {
      for (i = 0; i < programs.length; i++) {
        if (programs[i].id === supportingId) {
          modalHeaderTitle = docI18n.REGISTRY_SUPPORTING_FACTS_TITLE.replace("{0}", programs[i].name);
          supportingFacts = programs[i].supporting_facts;
        }
      }
      noSupportingFactsMsg = docI18n.NO_REGISTRY_SUPPORTING_FACTS;
    } else {
      // Get the supporting facts for either standard measures or event-based measures.
      for (i = 0; i < programs.length; i++) {
        var measures = klass.getMeasures(programs[i]);

        // Retrieve an array of supporting facts for one particular measure
        for (var j = 0; j < measures.length; j++) {
          if (measures[j].fqn === supportingId) {
            var name = measures[j].name;
            modalHeaderTitle = docI18n.MEASURE_SUPPORTING_FACTS_TITLE.replace("{0}", name);

            supportingFacts = measures[j].supporting_facts;
            break;
          }
        }
      }
      noSupportingFactsMsg = docI18n.NO_MEASURE_SUPPORTING_FACTS;
    }

    if (supportingFacts && supportingFacts.length > 0) {
      var tableRows = "";

      for (i = 0; i < supportingFacts.length; i++) {
        var supportingFact = supportingFacts[i],
            factsName = supportingFact.name || "",
            factsCode = supportingFact.formatted_code || "",
            factsSource = supportingFact.formatted_source || "",
            factsDateTime = klass.dateFormatter(supportingFact.date);

        tableRows += "<tr class='supporting-facts-content'>" +
          "<td class='fact-description'>" +
            "<div>" +
              factsName +
            "</div>" +
            "<div class='meta'>" +
              factsCode +
            "</div>" +
            "<div class='meta'>" +
              factsSource +
            "</div>" +
          "</td>" +
          "<td>" +
            "<div class='pull-right meta'>" +
              factsDateTime +
            "</div>" +
          "</td>" +
          "</tr>";
      }

      tableContent = "<table class='supporting-facts'>" +
          "<tbody>" + tableRows + "</tbody>" +
          "</table>";
    } else {
      tableContent = "<p>" + noSupportingFactsMsg + "</p>";
    }

    var supportDataModal = new ModalDialog("supportDataModal").setHeaderTitle(modalHeaderTitle);
    supportDataModal.setIsBodySizeFixed(false);
    supportDataModal.setLeftMarginPercentage(35).setRightMarginPercentage(35).setTopMarginPercentage(20);

    supportDataModal.setBodyDataFunction(function (modalObj) {
      modalObj.setBodyHTML(tableContent);
    });

    var closeButton = new ModalButton("closeButton");
    closeButton.setText(docI18n.CLOSE).setCloseOnClick(true);
    supportDataModal.addFooterButton(closeButton);

    MP_ModalDialog.updateModalDialogObject(supportDataModal);
    MP_ModalDialog.showModalDialog("supportDataModal");
  });
};

/* Main rendering functions */

/*
 * createComponentHTML - Create html for person registries component.
 *
 * @param {Object} response - The JSON object returned from the body of the reponse in ccl call.
 * @param {Number} status - The services status number returned by ccl call.
 *
 * @return Layout for person registries component.
 */
PersonRegistriesComponent.prototype.createComponentHTML = function(response, status, authStatus) {
  var docI18n = i18n.discernabu.person_registries_o1,
      jsRegistriesHTML = "<div class='sub-sec-hd exception-msg'>" + docI18n.REGISTRY_NOT_FOUND + "</div>",
      programs,
      componentId = this.getComponentId(),
      disclaimerBox = "",
      error,
      componentClass;

  // Get the css selector for current view
  if (this.isWorkflow()) {
    componentClass = this.getStyles().getNameSpace() + "-workflow";
  } else {
    componentClass = this.getStyles().getNameSpace() + "-summary";
  }

  if(authStatus !== false)  {
  // Services error handling
    switch (status) {
      case 200:
        programs = response.programs;

        if (programs === undefined || programs === null || programs.length === 0) {
          jsRegistriesHTML = "<div class='sub-sec-hd exception-msg'>" + docI18n.NOT_QUALIFY + "</div>";
        } else {

          // remove the node if it exists so we don't accidentally draw more one than toolbar
          if ($("#" + componentId + "-person-registries-component-score").length > 0) {
            $("#" + componentId + "-person-registries-component-score").parent().remove();
          }

          $("#hi_pr" + componentId + " .sec-content").before(this.registriesComponentToolbar(response.quality_score));

          // Display registries detail
          jsRegistriesHTML = this.renderPersonRegistriesComponentBody(programs);

          this.initRegistriesToolbarButtons();
          this.initSupportingFacts(programs);  // Initialize the supporting facts modal window.
        }
        break;
      case 401:
      case 403:
        jsRegistriesHTML = "<div class='sub-sec-hd exception-msg'>" + docI18n.ACCESS_DENIED + "</div>";
        break;
      case 400:
        jsRegistriesHTML = "<div class='sub-sec-hd exception-msg'>" + docI18n.BAD_REQUEST + "</div>";
        break;
      case 204:
      case 404:
        break;
      default:
        jsRegistriesHTML = "<div class='sub-sec-hd exception-msg'>" + docI18n.SYSTEM_ERROR + "</div>";
    }
    // Build disclaimer text box
    disclaimerBox = "<div class='person-registries-component-info " + componentClass + " sub-sec-hd'>" +
                          "<span class='sub-sec-title'>" +
                            docI18n.DISCLAIMER +
                          "</span>" +
                        "</div>";
  }
  else {
     error = (this.mfaAuthStatusData && this.mfaAuthStatusData.message) || '';
    jsRegistriesHTML = "<div class='sub-sec-hd exception-msg'>" + error + "</div>"
  }

  return "<div class='person-registries-component " + componentClass + "'>" +
           jsRegistriesHTML +
         "</div>" +
         disclaimerBox;
};

/**
 * Create the filter mappings for the PersonRegistriesComponent component.
 */

PersonRegistriesComponent.prototype.loadFilterMappings = function() {
  this.addFilterMappingObject("HI_PR_TEST_URI", {
    setFunction: this.setTestURI,
    type: "STRING",
    field: "FREETEXT_DESC"
  });

  this.addFilterMappingObject("HI_PR_ALIAS_TYPE", {
    setFunction: this.setAliasType,
    type: "STRING",
    field: "FREETEXT_DESC"
  });

  this.addFilterMappingObject("HI_PR_ALIAS_POOL_CD", {
    setFunction: this.setAliasPoolCode,
    type: "ARRAY",
    field: "PARENT_ENTITY_ID"
  });

  this.addFilterMappingObject("HI_PR_LOOKUP_KEY", {
    setFunction: this.setLookupKey,
    type: "STRING",
    field: "FREETEXT_DESC"
  });

  this.addFilterMappingObject("HI_PR_MEASURES_STATUS_FILTER", {
    setFunction: this.setMeasuresStatusFilter,
    type: "STRING",
    field: "FREETEXT_DESC"
  });

  this.addFilterMappingObject("HI_PR_COLLAPSE_REGISTRIES", {
    setFunction: this.setAllRegistriesCollapsed,
    type: "BOOLEAN",
    field: "FREETEXT_DESC"
  });
};

/**
 * This is the PersonRegistriesComponent implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 * This function will be called from the MPages architecture when it is ready for the component to render its content.
 * @returns {undefined} returns nothing
 */
PersonRegistriesComponent.prototype.retrieveComponentData = function() {
  var status = this.performMultiFactorAuthentication();

  if(!status) {
    this.finalizeComponent(this.createComponentHTML("", 0, status), MP_Util.CreateTitleText(this, 0));
  }
  else {
    this.setMeasuresStatusFilter(this.getMeasuresStatusFilter() || "not_achieved");
    this.setAllRegistriesCollapsed(this.getAllRegistriesCollapsed() === true);

    var namespace = "Person Registries Proxy Request";
    var sendAr = [];
    var criterion = this.getCriterion();
    var lookupKey = this.getLookupKey() || "HI_RECORD_PERSON_EMPI_LOOKUP";
    var personId = criterion.person_id || "0";
    var encounterId = criterion.encounter_id || "0";
    var providerId = criterion.provider_id || "0";

    sendAr.push("^MINE^", "^" + lookupKey + "^", "^HI_REGISTRIES_PERSON_REGISTRIES^", "^JSON^",
      personId + ".0", "^" + this.getAliasType() + "^", this.getAliasPoolCode() + ".0",
      encounterId + ".0", providerId + ".0", "^" + this.getTestURI() + "^",
      "^measures_status_filter=" + this.getMeasuresStatusFilter() + "^");

    var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), this.getCriterion().category_mean);
    loadTimer.addMetaData("namespace", namespace);

    var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
    renderTimer.addMetaData("namespace", namespace);

    var scriptRequest = new ComponentScriptRequest();
    scriptRequest.setName(namespace);
    scriptRequest.setProgramName("HI_ALIAS_LOOKUP_HTTP_PROXY_GET");
    scriptRequest.setParameterArray(sendAr);
    scriptRequest.setComponent(this);
    scriptRequest.setRawDataIndicator(true);
    scriptRequest.setLoadTimer(loadTimer);
    scriptRequest.setRenderTimer(renderTimer);
    scriptRequest.performRequest();
  }
};

/**
 * This is the PersonRegistriesComponent implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and calls the function that renders the component's visuals.
 * @param {ComponentScriptReply} response - The ComponentScriptReply object returned from the call to the DataRequest.performRequest function in the
 * retrieveComponentData function of this object.
 * @returns {undefined} returns nothing
 */
PersonRegistriesComponent.prototype.renderComponent = function(response) {
  try {
    var proxyReply = JSON.parse(response.getResponse()).PROXYREPLY,
        success = proxyReply.TRANSACTIONSTATUS.SUCCESSIND,
        prereqError = proxyReply.TRANSACTIONSTATUS.PREREQERRORIND,
        responseBody,
        status = 0,
        programCount = 0;

    // Retrieve response status if there is no transaction error
    if (success === 1) {
      status = proxyReply.HTTPREPLY.STATUS;
      // Parse JSON body only when it is 200 OK response.
      if (status === 200) {
        responseBody = JSON.parse(proxyReply.HTTPREPLY.BODY);

        if (responseBody.programs !== undefined && responseBody.programs !== null) {
          programCount = responseBody.programs.length;
        }
      }
    }
    else if (prereqError === 1) {
      // Our requirement is to handle prereq errors from the CCL script the same way that we handle 404 responses
      status = 404;
    }

    //Finalize the component
    this.finalizeComponent(this.createComponentHTML(responseBody, status),
                           MP_Util.CreateTitleText(this, programCount));
  }
  catch (err) {
    MP_Util.LogJSError(this, err, "person-registries-o1.js", "renderComponent");
    //Throw the error to the architecture
    throw err;
  }
};

/**
 * This is the PersonRegistriesComponent implementation of the performMultiFactorAuthentication function.  It calls
 * the Mfa_Auth and populates the authStatus with appropriate response.
 * @returns {undefined} returns nothing
 */
PersonRegistriesComponent.prototype.performMultiFactorAuthentication = function () {
  var authStatus = new Mfa_Auth().RetrieveMfaAuthStatus(),
      authStatusData,
      status;

  if (authStatus && authStatus.isResourceAvailable()) {
    authStatusData = authStatus.getResourceData();
    if (authStatusData) {
      // 0 - Authentication Success
      // 5 - Authentication Not Required
      authStatusData.statusInd = authStatusData.status === 0 || authStatusData.status === 5;
      this.mfaAuthStatusData = authStatusData;
    }
  } else {
    this.mfaAuthStatusData = {statusInd: false, status: 4, message: i18n.discernabu.mfa_auth.MFA_ERROR_MSG};
  }

  this.auditMultiFactorAuthentication(this.mfaAuthStatusData.status);
  return this.mfaAuthStatusData.statusInd;
}

/**
 * This is the PersonRegistriesComponent implementation of the auditMultiFactorAuthentication function.  It uses
 * MP_EventAudit to call audit events when multi factor authentication takes place.
 * @returns {undefined} returns nothing
 */
PersonRegistriesComponent.prototype.auditMultiFactorAuthentication = function(status) {
  // Add Audit Event for Multi-Factor Authentication
  var criterion = this.getCriterion(),
      providerID = criterion.provider_id + '.0',
      mpEventAudit = new MP_EventAudit(),
      dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE),
      dateTime = dateFormatter.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
      eventName = this.isWorkflow() ? 'HR_REGISTRIES_WORKFLOW_MFA_ATTEMPT' : 'HR_REGISTRIES_SUMMARY_MFA_ATTEMPT';

  mpEventAudit.setAuditMode(0);
  mpEventAudit.setAuditEventName(eventName);
  mpEventAudit.setAuditEventType('SECURITY');
  mpEventAudit.setAuditParticipantType('PERSON');
  mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
  mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
  mpEventAudit.setAuditParticipantID(providerID);
  mpEventAudit.setAuditParticipantName('STATUS=' + status + '; DATE=' + dateTime);
  mpEventAudit.addAuditEvent();
  mpEventAudit.submit();
}

/**
 * Map the Person Registries Component object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees either "VB_PERSON_REGISTRIES_SUMMARY" or "VB_PERSON_REGISTRIES_WORKFLOW" filter
 */
MP_Util.setObjectDefinitionMapping("HI_REGISTRIES", PersonRegistriesComponent);
MP_Util.setObjectDefinitionMapping("WF_HI_REGISTRIES", PersonRegistriesComponent);
