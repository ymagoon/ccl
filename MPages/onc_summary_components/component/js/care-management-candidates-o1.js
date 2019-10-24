function CandidatesStyle() {
  this.initByNamespace("hcmCandidates");
}

CandidatesStyle.prototype = new ComponentStyle();

/**
 * @constructor
 * Initialize the Care Management Candidates Option 1 component
 * @param {object} criterion - The Criterion object which contains information needed to render the component.
 */
function Candidates(criterion) {
  this.setCriterion(criterion);
  this.setComponentLoadTimerName("USR:MPG.CARE_MANAGEMENT_CANDIDATES.O1 - load component");
  this.setComponentRenderTimerName("ENG:MPG.CARE_MANAGEMENT_CANDIDATES.O1 - render component");
  this.setStyles(new CandidatesStyle());
  this.setResourceRequired(true);
  this.nameSpace = this.getStyles().getNameSpace();
  this.pageSize = 20;
  this.currentPage = 0;
  this.providersTable;
  Candidates.i18n = i18n.discernabu.Candidates;
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
Candidates.prototype = new MPageComponent();

Candidates.prototype.getCaseTypeFilters = function() {
  return this.caseTypeFilters;
};

Candidates.prototype.setCaseTypeFilters = function(value) {
  this.caseTypeFilters = value;
};

/* Supporting functions */
Candidates.prototype.RetrieveRequiredResources = function() {
  var component = this;
  component.retrieveFilterResources();
};

Candidates.prototype.retrieveFilterResources = function() {
  var component = this;
  component.scriptRequest({
    name: "HCM_GET_CASE_TYPE_PROG_MAP",
    params: "^MINE^",
    success: function(response) {
      component.setCaseTypeFilters(response.CASE_TYPES);
      component.scriptRequest({
        name: "HCM_GET_CODE_DETAILS",
        params: "^" + component.criterion.position_cd + "^",
        success: function(response) {
          component.flexOnPosition(response);
        }
      });
    },
    failure: function(response) { MP_Util.LogError("Error retrieving results"); }
  });
};

Candidates.prototype.flexOnPosition = function(response) {
  var component = this;
  var position;
  var componentViewId = component.getCriterion().category_mean;

  if(response.STATUS_DATA.STATUS === "S") {
    position = response.MEANING;
  }

  // Render no data and wait for a careManagerSelected event from care-managers-o1 if the user is a
  // care management supervisor, otherwise use the user's personnel id to retrieve their candidates.
  if(position === "CMSUPERVISOR") {
    component.renderNoData();
    $(document).on('careManagerSelected', function(event) {
      if(event.viewId === componentViewId) {
        component.careManagerId = event.careManagerId;
        component.currentPage = 0;
        component.careManagerName = event.name;
        component.position = position;
        component.retrieveComponentData($.extend(component.currentOptions(), {
          plan: "",
          product_type: "",
          program_id: "",
          aligned_provider_id: ""
        }));
      }
    });
  } else {
    component.careManagerId = component.criterion.getPersonnelInfo().getPersonnelId();
    component.retrieveComponentData();
  }
};

Candidates.prototype.planUri = function() { return this.planTestUri; };

Candidates.prototype.productTypeUri = function() { return this.productTypeTestUri; };

Candidates.prototype.candidateUri = function() { return this.candidateTestUri; };

Candidates.prototype.candidatesUri = function(queryParams) {
  var queryString = queryParams ? "?" + $.param(queryParams, true) : "";

  return this.candidatesTestUri ? this.candidatesTestUri + queryString : "";
};

Candidates.prototype.candidatesBatchUri = function() { return this.candidatesBatchTestUri || ''; };

Candidates.prototype.renderNoData = function() {
  this.finalizeComponent(
    "<span id='" + this.getComponentId() + "-main-container'>" +
      Candidates.i18n.NO_RESULTS_FOUND +
    "</span>");
};

Candidates.prototype.noCandidatesDiv = function() {
  return "<div class='" + this.nameSpace + "-none'>" +
            "<span class='res-none'>" + Candidates.i18n.NO_RESULTS_FOUND + "</span>" +
          "</div>";
};

Candidates.prototype.loadFilterMappings = function() {
  var component = this;

  var generateSetFunctionFor = function(attribute) {
    return function(value) {
      // Our test uri is returned from Bedrock "scrubbed" for clean HTML presentation. This replace
      // restores the '/' characters to our test uris.
      component[attribute] = value.replace(/&#047;/g, '/');
    };
  };

  this.addFilterMappingObject('CANDIDATES_TEST_URI', {
    type: 'STRING',
    field: 'FREETEXT_DESC',
    setFunction: generateSetFunctionFor('candidatesTestUri')
  });

  this.addFilterMappingObject('CANDIDATE_TEST_URI', {
    type: "STRING",
    field: "FREETEXT_DESC",
    setFunction: generateSetFunctionFor("candidateTestUri")
  });

  this.addFilterMappingObject('CANDIDATES_BATCH_TEST_URI', {
    type: 'STRING',
    field: 'FREETEXT_DESC',
    setFunction: generateSetFunctionFor('candidatesBatchTestUri')
  });

  this.addFilterMappingObject('HCM_PLAN_TEST_URI', {
    type: 'STRING',
    field: 'FREETEXT_DESC',
    setFunction: generateSetFunctionFor('planTestUri')
  });

  this.addFilterMappingObject('HCM_PRODUCT_TYPE_TEST_URI', {
    type: 'STRING',
    field: 'FREETEXT_DESC',
    setFunction: generateSetFunctionFor('productTypeTestUri')
  });
};

Candidates.prototype.candidateListParams = function(options) {
  var params = {
    start: this.currentPage * this.pageSize,
    limit: this.pageSize
  };

  $.each(options, function(option, value) {
    if(value) {
      params[option] = value;
    }
  });

  return params;
};

Candidates.prototype.mockParams = function(mockUri, queryParams) {
  queryParams = queryParams || {};
  queryParams.personnel_id = this.careManagerId;

  return ["^" + mockUri + "^", "^JSON^", "0.0", "0.0", "^" + Candidates.templateVariables(queryParams) + "^"];
};

Candidates.prototype.cclParams = function(key, queryParams) {
  var templateArgs = queryParams ? "^" + Candidates.templateVariables(queryParams) + "^" : "^^";

  return ["^HI_BATCH_PERSONNEL_LOOKUP^", "^" + key + "^", "^JSON^", "^" + this.careManagerId + ".0^", "^^", "0.0", templateArgs];
};

Candidates.prototype.refineOptions = function(filterOptions) {
  var caseTypeFilters = this.getCaseTypeFilters();
  var programs = [];
  var refinedOptions = filterOptions || {};
  if (refinedOptions.case_type && caseTypeFilters) {
    caseTypeFilters.forEach( function(caseType) {
      if (caseType.CASE_TYPE_CD.toString() === refinedOptions.case_type) {
        (caseType.PROGRAMS).forEach(function(program) {
          programs.push(program.PROGRAM_IDENTIFIER);
        }) ;
        refinedOptions.program_id = programs;
      }
    });
  }
  return refinedOptions;
};

/**
 * This is the Candidates implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 * This function will be called from the MPages architecture when it is ready for the component to render its content.
 * @param {Hash} options - An hash containing filter form data.
 * @param {String[]} assignedCandidates - An array of EMPI_IDs of successfully assigned candidates.
 * @return null
 */
Candidates.prototype.retrieveComponentData = function(options, assignedCandidates) {
  var component        = this,
      criterion        = component.getCriterion(),
      options          = component.refineOptions(options) || {},
      candidatesParams = this.candidateListParams(options),
      candidatesUri    = this.candidatesUri(candidatesParams),
      cclName,
      cclParams;

  MP_Util.LoadSpinner(component.getSectionContentNode().id, 1);

  if (candidatesUri) {
    cclName = "HI_HTTP_PROXY_GET_REQUEST";
    cclParams = this.mockParams(candidatesUri, options);
  } else {
    cclName = "HI_PRSNL_LOOKUP_HTTP_PROXY_GET";
    cclParams = component.cclParams("HI_CM_CANDIDATES", candidatesParams);
  }

  component.scriptRequest({
    name: cclName,
    params: cclParams,
    rawDataIndicator: true,
    success: function(response) {
      var candidates = response.candidates;
      var filters = {
        plans: response.plans,
        productTypes: response.product_types,
        alignedProviders: response.aligned_providers,
        caseTypes: component.getCaseTypeFilters()
      };

      component.retrieveCandidatesWithCases(candidates, function(candidatesWithCasesResponse) {
        var aliases = [];
        var finNbrAliases = [];
        var candidatesWithCases = candidatesWithCasesResponse.CANDIDATES;

        $.each(candidatesWithCases, function(_, candidateWithCase) {
          for(var i = 0; i < candidates.length; i++) {
            if (candidates[i].empi_id === candidateWithCase.EMPI_ID) {
              candidates[i].hasOpenCase = true;
              candidates[i].assignedCareManager = candidateWithCase.LATEST_ASSIGNED_CARE_MANAGER;
              candidates[i].lastAssignedDate = candidateWithCase.LATEST_ASSIGNED_DATE;

              aliases = candidateWithCase.ENCOUNTERS[0].ALIASES || [];
              finNbrAliases = $.grep(aliases, function(alias){ return alias.TYPE_MEANING === "FIN NBR"; })
              if (finNbrAliases.length > 0) {
                candidates[i].fin = finNbrAliases[0].ALIAS;
              }

              break;
            }
          }
        });

        candidates = component.addCandidateFields(candidates);

        candidates.total_results = response.total_results;

        component.renderComponent(candidates, filters, options, assignedCandidates);
      });
    },
    failure: function(response) {
      var countText = component.isLineNumberIncluded() ? '(0)' : '';
      component.scriptRequest.logScriptExecutionError(this);
      component.finalizeComponent(component.generateScriptFailureHTML(), countText);
    }
  });
};

/**
 * Decorate candidate objects with additional fields.
 * @param {Object} candidates - A list of candidate objects to decorate
 * @param {Date}   fromDate   - An optional date to inject for calculating age. Used for testing.
 */
Candidates.prototype.addCandidateFields = function(candidates, fromDate) {
  var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);

  function name(candidate) {
    var firstName = candidate.demographics.given_names.length > 0 && candidate.demographics.given_names[0];
    var lastName = candidate.demographics.family_names.length > 0 && candidate.demographics.family_names[0];

    if (lastName && firstName) {
      return Candidates.i18n.FULL_NAME.replace("{firstName}", firstName).replace("{lastName}", lastName);
    } else {
      return candidate.demographics.full_name;
    }
  }

  function age(candidate) {
    if (candidates && candidate.demographics && candidate.demographics.date_of_birth) {
      return MP_Util.CalcAge(Candidates.parseBirthDate(candidate.demographics.date_of_birth), fromDate)
    } else {
      return Candidates.i18n.NO_DATA;
    }
  }

  function dob(candidate) {
    var dob;

    if (candidates && candidate.demographics && candidate.demographics.date_of_birth) {
      dob = new Date();
      dob.setISO8601(candidate.demographics.date_of_birth);
      return dob.format(MPAGE_LOCALE.fulldate4yr, true);
    } else {
      return Candidates.i18n.NO_DATA;
    }
  }

  function gender(candidate) {
    return candidate.demographics.gender;
  }

  function riskScore(candidate) {
    var risk_mara = candidate.risk_scores.mara_risk_scores ? candidate.risk_scores.mara_risk_scores : candidate.risk_scores;
    var scores = $.grep(risk_mara, function(riskScore) {
      return riskScore.model_name === "CXCONLAG0";
    });
    return scores[0] && scores[0].total_score;
  }

  function programList(candidate) {
    return $.map(candidate.programs, function(program) { return program.name; });
  }

  function identificationDate(candidate) {
    var identification_date = candidate.programs[0].identification_date;

    $(candidate.programs).each(function(_,program) {
      if (Date.parse(program.identification_date) < Date.parse(identification_date)) {
        identification_date = program.identification_date;
      }
      program.formatted_identification_date = fullDateLocal(program.identification_date);
    });

    return fullDateLocal(identification_date);
  }

  function visitDisplay(count, endDate) {
    if (count) {
      return fullDateLocal(endDate) + "<div>" + Candidates.i18n.RECENT_VISIT_COUNT.replace("{count}", count) + "</div>";
    }

    return Candidates.i18n.NO_DATA
  }

  function edVisitTooltip(candidate) {
    var count     = candidate.total_ed_visits,
        startDate = fullDateLocal(candidate.start_date_of_latest_ed_visit),
        endDate   = fullDateLocal(candidate.end_date_of_latest_ed_visit);

    if (count) {
      return [
        Candidates.i18n.LAST_ED_VISIT_RANGE.replace("{startDate}", startDate).replace("{endDate}", endDate),
        Candidates.i18n.RECENT_ED_VISITS.replace("{count}", count)
      ].join("\n");
    }

    return Candidates.i18n.NO_DATA
  }

  function inpatientVisitTooltip(candidate) {
    var count     = candidate.total_inpatient_visits,
        startDate = fullDateLocal(candidate.start_date_of_latest_inpatient_visit),
        endDate   = fullDateLocal(candidate.end_date_of_latest_inpatient_visit);

    if (count) {
      return [
        Candidates.i18n.LAST_INPATIENT_VISIT_RANGE.replace("{startDate}", startDate).replace("{endDate}", endDate),
        Candidates.i18n.RECENT_INPATIENT_VISITS.replace("{count}", count)
      ].join("\n");
    }

    return Candidates.i18n.NO_DATA
  }

  function payerPlanType(candidate) {
        planCount = 0,
        planDisplays = [],
        planToolTips = [],
        planDisplayStr = "",
        uniquePlansHash = {};

    // get unique plans displays
    $.each($.makeArray(candidate.benefit_coverages), function(_, benefit) {
      var display = Candidates.i18n.PAYER_PLAN_TYPE
        .replace("{payerName}", benefit.payer_name || Candidates.i18n.NO_DATA)
        .replace("{planName}", benefit.plan_name || Candidates.i18n.NO_DATA)
        .replace("{productType}", benefit.product_type || Candidates.i18n.NO_DATA);
      uniquePlansHash[display] = benefit;
    });

    planToolTips = $.map(uniquePlansHash, function(benefit, display) { return display; });

    // get 3 unique plans
    $.each(uniquePlansHash, function(display, benefit) {
      planCount++;
      if (planCount <= 3) {
        planDisplays.push(display);
      } else {
        planDisplays.push(Candidates.i18n.ELLIPSIS);
        return false;
      }
    });

    var display = (planDisplays.length === 0 ? [Candidates.i18n.NO_DATA] : planDisplays).join("<br/>");
    var toolTip = (planToolTips.length === 0 ? [Candidates.i18n.NO_DATA] : planToolTips).join("\n");
    return {display: display, toolTip: toolTip};
  }

  function alignedProviders(candidate) {
    var display;
    var toolTip;
    var alignedProviderTooltip = [];
    var alignedProviderDisplay = [];

    candidate.aligned_providers = candidate.aligned_providers || [];

    alignedProviderTooltip = $.map(candidate.aligned_providers, function(alignedProvider) { return alignedProvider.provider_name; });

    alignedProviderDisplay = alignedProviderTooltip.slice(0, 3);
    if (alignedProviderTooltip.length > 3) {
      alignedProviderDisplay.push(Candidates.i18n.ELLIPSIS);
    }

    display = (alignedProviderDisplay.length === 0 ? [Candidates.i18n.NO_DATA] : alignedProviderDisplay).join("<br/>");
    toolTip = (alignedProviderTooltip.length === 0 ? [Candidates.i18n.NO_DATA] : alignedProviderTooltip).join("\n");
    return {display: display, toolTip: toolTip};
  }

  function addSupportingFactFields(candidate) {
    var programs = candidate.programs;
    $.each(programs, function(_, program) {
      if(program.supporting_data_points) {
        var supportingFacts = program.supporting_data_points;

        $.each(supportingFacts, function(type, supportingFact) {
          var data_partition_desc,
              source_type;

          $.each(supportingFact, function(_, dataPoint) {
            source_type = (dataPoint.source && dataPoint.source.type) ? dataPoint.source.type : Candidates.i18n.NO_DATA;
            data_partition_desc = (dataPoint.source && dataPoint.source.partition_description) ? dataPoint.source.partition_description : Candidates.i18n.NO_DATA;

            if (source_type === Candidates.i18n.NO_DATA) {
              dataPoint.formatted_source = data_partition_desc;
            } else {
              dataPoint.formatted_source = Candidates.i18n.FORMATTED_SOURCE
                                            .replace("{partition}", data_partition_desc)
                                            .replace("{type}", source_type);
            }
            dataPoint.type = type;
            dataPoint.IDENTIFICATION_DATE = dataPoint.date;

            if (dataPoint.code && dataPoint.code_system) {
              dataPoint.DESCRIPTION = Candidates.i18n.DESCRIPTION_BODY
                                        .replace("{name}", dataPoint.name)
                                        .replace("{code_system}", dataPoint.code_system)
                                        .replace("{code}", dataPoint.code);
            } else {
              dataPoint.DESCRIPTION = dataPoint.name;
            }
          });
        });
      };
    });

    return candidate;
  };

  function fullDateLocal(date) {
    return date && df.formatISO8601(date, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
  }

  /**
   * Returns a formatted date time in mm/dd/yyyy hh:mm format.
   *
   * @param {DateTime} date - The unformatted date time.
   */
  function localDateTime(date) {
    return date && df.formatISO8601(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
  }

  function createCaseTemplate(candidate) {
    if (candidate.hasOpenCase) {
      var assigned_care_manager = candidate.assignedCareManager? candidate.assignedCareManager : Candidates.i18n.NO_DATA;
      var last_assigned_date = candidate.lastAssignedDate? localDateTime(candidate.lastAssignedDate) : Candidates.i18n.NO_DATA;
      var tooltip = Candidates.i18n.ASSIGNED_CARE_MANAGER.replace("{care_manager}", assigned_care_manager) + "\n"
                  + Candidates.i18n.ASSIGNED_CM_DATE.replace("{date}", last_assigned_date);

      if (candidate.fin) {
        tooltip += "\n" + Candidates.i18n.FIN.replace("{FIN}", candidate.fin);
      }

      return "<span class='hcmCandidates-assigned-icon' title='" + tooltip + "'></span>";
    } else {
      return "<input type='checkbox' class= 'hcmCandidates-create-case-checkbox' name='select_case' id=" + candidate.empi_id + ">";
    }
  }

  function addFields(candidate) {
    var plans = payerPlanType(candidate);
    var providers = alignedProviders(candidate);

    candidate.AGE = age(candidate);
    candidate.GENDER = gender(candidate);
    candidate.DOB = dob(candidate);

    candidate.IDENTIFICATION_DATE = identificationDate(candidate);
    candidate.NAME = name(candidate);
    candidate.PAYER_PLAN_TYPE = plans.display;
    candidate.PAYER_PLAN_TYPE_TOOLTIP = plans.toolTip;
    candidate.PROGRAM_LIST = programList(candidate).join("<br/>");
    candidate.RISK_SCORE = riskScore(candidate);
    candidate.LAST_ED_VISIT = visitDisplay(candidate.total_ed_visits, candidate.end_date_of_latest_ed_visit);
    candidate.LAST_ED_VISIT_TOOLTIP = edVisitTooltip(candidate);
    candidate.LAST_INPATIENT_VISIT = visitDisplay(candidate.total_inpatient_visits, candidate.end_date_of_latest_inpatient_visit);
    candidate.LAST_INPATIENT_VISIT_TOOLTIP = inpatientVisitTooltip(candidate);
    candidate.CREATE_CASE = createCaseTemplate(candidate);
    candidate.ALIGNED_PROVIDERS = providers.display;
    candidate.ALIGNED_PROVIDERS_TOOLTIP = providers.toolTip;

    return candidate;
  };

  $.each($.makeArray(candidates), function(_, candidate) {
    addFields(candidate);
    addSupportingFactFields(candidate);
  });

  return candidates;
};

Candidates.prototype.processAlignedCareManagers = function(careManagers) {

  function loadOrgList(careManagerObject) {
    if(careManagerObject.orgTooltipList && careManagerObject.orgTooltipList.length) {
      careManagerObject.ORG_DISPLAY_LIST = careManagerObject.orgTooltipList.slice(0, 3).join(Candidates.i18n.SEPARATOR) + (careManagerObject.orgTooltipList.length > 3 ?  Candidates.i18n.ELLIPSIS : "");
    }
    else {
      careManagerObject.ORG_DISPLAY_LIST = Candidates.i18n.NO_DATA;
    }
  }

  var alignedCareManagersDisplay = {};
  $.each(careManagers, function(_, careManager) {
    var careManagerData = [];
    var managerName = careManager.name || Candidates.i18n.NO_DATA;
    var managerId = careManager.id;
    var fact = careManager.alignment_supporting_facts;
    if(fact) {
      $.each(fact.provider_attribution, function(_,attribution) {
        var careManagerObject = {};
        careManagerObject.PROVIDER = attribution.provider_name ? attribution.provider_name : Candidates.i18n.NO_DATA;
        careManagerObject.ID = managerId;
        careManagerObject.NAME = managerName;
        careManagerObject.orgTooltipList = [];

        $.each(attribution.org_names_list, function(index, org) {
          if(org.org_name) {
            careManagerObject.orgTooltipList[index] = org.org_name;
          }
        });

        careManagerObject.FULL_ORG_LIST = careManagerObject.orgTooltipList.length ? careManagerObject.orgTooltipList.join(Candidates.i18n.SEPARATOR) : Candidates.i18n.NO_DATA;
        loadOrgList(careManagerObject)
        careManagerData.push(careManagerObject);
      });
    };
    alignedCareManagersDisplay[managerId] = careManagerData;
  });
  return alignedCareManagersDisplay;
}

Candidates.prototype.alignedCareManagers = function(candidate) {

  function getName(careManager) {
    var managerData = careManager[0];
    if(managerData && managerData.NAME) {
      return managerData.NAME;
    }
  }
  var providerTableHeader = "<div'><h2 class= '"+this.nameSpace+"-provider-header'>"+ Candidates.i18n.RECOMMENDED_CARE_MANAGERS +"</h2></div>"
  var component = this;
  var careManagers = component.processAlignedCareManagers(candidate.assignable_care_managers);
  var groups = [];
  var careManagerData = [];
  $.each(careManagers, function(managerId, careManager) {
    var name = getName(careManager);
    groups.push(
      {
        key: "ID",
        value: managerId,
        data: careManager,
        display: name
      }
    );
    careManagerData = careManagerData.concat(careManager);
  });

  var columns = [
        {
          field: "PROVIDER",
          options: {
            id: "aligned-provider",
            cssClass: this.nameSpace + "-aligned-provider",
            display: Candidates.i18n.PROVIDERS,
            template: "<div>${PROVIDER}</div>"
          }
        },
        {
          field: "ORG_DISPLAY_LIST",
          options: {
            id: "source",
            cssClass: this.nameSpace + "-provider-organization",
            display: Candidates.i18n.ORGANIZATIONS,
            template: "<div title='${FULL_ORG_LIST}'>${ORG_DISPLAY_LIST}</div>"
          }
        }
      ]
      providersTable = component.createTable('hcmCandidates-provider', columns).bindData(careManagerData);

  providersTable = component.addTableGroups(groups, providersTable);
  component.providersTable = providersTable;
  return providerTableHeader + component.providersTable.render();
}

Candidates.prototype.createSupportingFactsTable = function (dataPointGroups) {
  var component = this,
      supportingFacts = [],
      groups = [];

  $.each(dataPointGroups, function(type, dataPoints) {
    if (dataPoints && dataPoints.length > 0) {
      type = type.toUpperCase();
      var group = {
        key: "type",
        value: Candidates.i18n[type] || type,
        data: dataPoints
      };

      groups = groups.concat(group);
      supportingFacts = supportingFacts.concat(dataPoints);
    }
  });

  var columns = [
    {
      field: "DESCRIPTION",
      options: {
        id: "data-point-description",
        cssClass: "hcmCandidates-data-point",
        display: Candidates.i18n.DESCRIPTION
      }
    },
    {
      field: "formatted_source",
      options: {
        id: "source",
        cssClass: "hcmCandidates-data-point",
        display: Candidates.i18n.SOURCE
      }
    },
    {
      field: "IDENTIFICATION_DATE",
      options: {
        id: "data-point-date",
        cssClass: "hcmCandidates-data-point",
        display: Candidates.i18n.DATE
      }
    }
  ];

  var supportingFactsTable = component.createTable("supporting-facts", columns).bindData(supportingFacts);
  supportingFactsTable = component.addTableGroups(groups, supportingFactsTable);

  return supportingFactsTable;
};

Candidates.prototype.detailModal = function(candidate) {
  function button(id, display) {
    return new ModalButton(id)
      .setText(display)
      .setCloseOnClick(true);
  }

  function createSupportingFactsDisplay(programs) {
    if (programs) {
      var supportingFactsHtml = [];
      var supportingDataPts;
      var supportingFactsTable = [];
      var supportingFactsDisplay;
      var dataPointsPresent = false;

      var tables = $.map(programs, function(program) {
        supportingDataPts = program.supporting_data_points;
        if (supportingDataPts) {
          // If atleast one supporting data point present, exit the loop.
          $.each(supportingDataPts, function(_, dataPoint) {
            dataPointsPresent = dataPoint.length > 0;
            if (dataPointsPresent) { return false; }
          });

          // Create the component table only when supporting facts present.
          if (dataPointsPresent) {
            supportingFactsTable = component.createSupportingFactsTable(supportingDataPts);
            supportingFactsDisplay = supportingFactsTable.render();
          } else {
            supportingFactsDisplay = "<div class='" + component.nameSpace + "-no-supporting-facts'>" + Candidates.i18n.NO_SUPPORTING_FACTS_PRESENT + "</div>";
          }

          supportingFactsHtml.push(
            "<div class ='" + component.nameSpace + "-supporting-fact'>" +
              "<h2 class='" + component.nameSpace + "-identification-detail-header'>" + Candidates.i18n.IDENTIFICATION_DETAILS + "</h2>" +
              "<dl class='"+ component.nameSpace +"-inline-list " + component.nameSpace +"-program-header'>" +
                "<dt>" + Candidates.i18n.PROGRAM + "</dt>" +
                "<dd>" + program.name + "</dd>" +
                "<dt>" + Candidates.i18n.IDENTIFICATION_DATE + "</dt>" +
                "<dd>" + program.formatted_identification_date + "</dt>" +
              "</dl>" + supportingFactsDisplay +
            "</div>"
          );

          // return componentTable or empty array.
          return supportingFactsTable;
        }
      });

      return {template: supportingFactsHtml.join(), tables: tables};
    }
  }

  var component       = this,
      programs        = candidate.programs,
      supportingFacts = createSupportingFactsDisplay(programs),
      demoBanner =
        "<div class='" + this.nameSpace + "-demo-banner'>" +
          "<h2>" + candidate.NAME + "</h2>" +
          "<ul class='" + this.nameSpace +"-inline-list'>" +
            "<li>" + candidate.AGE + "</li>" +
            "<li>" + candidate.GENDER + "</li>" +
            "<li>" + candidate.DOB + "</li>" +
          "</ul>" +
        "</div>";

  var modalBody = demoBanner + supportingFacts.template + component.alignedCareManagers(candidate),
      modalId = component.getComponentId() + "CandidateDetailModal";

  if (component.providersTable) {
    supportingFacts.tables.push(component.providersTable);
  }

  MP_ModalDialog.deleteModalDialogObject(modalId);
  var modalDialog = new ModalDialog(modalId)
    .setHeaderTitle(Candidates.i18n.POTENTIAL_CASE_DETAIL)
    .setTopMarginPercentage(20)
    .setRightMarginPercentage(20)
    .setBottomMarginPercentage(20)
    .setLeftMarginPercentage(20)
    .setIsBodySizeFixed(true)
    .addFooterButton(button('close-modal', Candidates.i18n.CLOSE))
    .setBodyDataFunction(function(modalDialog) {
      modalDialog.setBodyHTML(modalBody);
    });

  if (supportingFacts.tables && supportingFacts.tables.length > 0) {
    modalDialog.tables = supportingFacts.tables;
  }

  return modalDialog;
};

Candidates.prototype.initCandidateDetailModal = function(target) {
  var component = this,
      tableCellClicked = $(target).closest(".table-cell"),
      candidateLite = ComponentTableDataRetriever.getResultFromTable(component.m_componentTable, tableCellClicked);

  component.retrieveCandidate(candidateLite.empi_id, function(candidate) {
    candidate = component.addCandidateFields(candidate);
    detailModal = component.detailModal(candidate);

    MP_ModalDialog.addModalDialogObject(detailModal);
    MP_ModalDialog.showModalDialog(detailModal.m_modalId);

    if (detailModal.tables) {
      $.each(detailModal.tables, function(_, table) {
        table.finalize();
      });
    }
  });
};

/**
 * Creates the alert banner using the input message.
 *
 * @param {String} message - The message to set inside the banner.
 * @return {Object} of type MPageUI.AlertBanner.
 */
Candidates.prototype.initConfirmationMessage = function(message) {
  var alertBanner = new MPageUI.AlertBanner();

  alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
  alertBanner.setPrimaryText(message);
  alertBanner.setDismissible(true);

  return alertBanner;
};

/**
 * Get the candidate name for the input candidateEmpiId from input the candidates list.
 *
 * @param {Object[]} candidates - An array of candidates for the current care manager.
 * @param {String} candidateEmpiId - A EMPI_ID of successfully assigned candidate.
 * @return {String} name of the candidate.
 */
Candidates.prototype.getCandidateName = function(candidates, candidateEmpiId) {
  var name = "";

  $.each(candidates, function(_, candidate) {
    if (candidate.empi_id === candidateEmpiId) {
      name = candidate.NAME;
    return false; // break
  }
  });

  return name;
};

/**
 * This method builds the i18ned banner message depending on the number of candidates assigned.
 *
 * @param {Object[]} candidates - An array of candidates for the current care manager.
 * @param {String[]} assignedCandidates - An array of EMPI_IDs of successfully assigned candidates.
 * @return {String} i18n translated message.
 */
Candidates.prototype.buildBannerMessage = function(candidates, assignedCandidates) {
  var component = this,
      numOfAssignedCandidates = assignedCandidates.length,
      message = "",
      name;

  // Display candidate name if only single candidate is assigned.
  if (numOfAssignedCandidates === 1) {
    name = component.getCandidateName(candidates, assignedCandidates[0]);
    message = Candidates.i18n.ASSIGN_SUCCESS_MSG_1.replace("{personName}", name);
  }
  // Display alphabetical numbers if more than 1 and less than 11 candidates are assigned.
  else if (numOfAssignedCandidates > 1 && numOfAssignedCandidates < 11) {
    // Convert the string to object using eval().
    message = eval("Candidates.i18n.ASSIGN_SUCCESS_MSG_" + numOfAssignedCandidates);
  }
  // Display numerical value if more than 10 candidates are assigned.
  else if (numOfAssignedCandidates > 10) {
    message = Candidates.i18n.ASSIGN_SUCCESS_MSG.replace("{numOfCases}", numOfAssignedCandidates);
  }

  return message;
};

/**
 * This is the Candidates implementation of the renderComponent function.  It takes the information retrieved
 * from the script call and renders the component's visuals.
 *
 * @param {Object[]} candidates - An array of candidates for the current care manager.
 * @param {Object[]} product_types - An array of product_type objects.
 * @param {Object[]} plans - An array of plan objects.
 * @param {Object} options - An object containing filter form data.
 * @param {String[]} assignedCandidateList - An array of EMPI_IDs of successfully assigned candidates.
 * @return null
 */
Candidates.prototype.renderComponent = function(candidates, filters, options, assignedCandidateList) {
  var candidateDetailModal,
      columns,
      candidatesTable,
      pager              = null,
      component          = this,
      compNS             = component.getStyles().getNameSpace(),
      componentId        = component.getComponentId(),
      filterFormStr      = component.filterForm(filters, options),
      $mainContainerObj  = $("<div id='" + componentId + "-main-container' class='" + this.nameSpace + "-main-container'>"),
      assignedCandidates = assignedCandidateList || [],
      confirmationMessage,
      cmNameSpan;

  var mfaSuccessStatus = this.getMfaAuthStatus();
  this.addMfaAuditEvent();

  if (mfaSuccessStatus) {
    if (component.position === "CMSUPERVISOR") {
      //This will remove existing care manager displayed which will be added again later with current care manager
      $("#" + componentId + "-sub-title").remove();

      if (component.careManagerName) {
        cmNameSpan = "<span class ='" + component.nameSpace + "-cm-name'>" + component.careManagerName + "</span>";

        // Find the candidate name div and update the candidates name
        $("#" + component.getRootComponentNode().id).find('.sec-hd').after(
            "<div  id ='" + componentId + "-sub-title' class='sub-title-disp'>" +
            Candidates.i18n.CARE_MANAGER.replace("{name}", cmNameSpan) +
            " </div>"
        );
      }
    }

    // Display no data found message if no candidates available.
    if (candidates.length === 0) {
      $mainContainerObj.append(filterFormStr, component.noCandidatesDiv());
      this.finalizeComponent($mainContainerObj[0].outerHTML);
      component.bindFilterEvents(candidates);
      return;
    }

    // Display successful candidate assignment confirmation message banner.
    if (assignedCandidates.length > 0) {
      var message = component.buildBannerMessage(candidates, assignedCandidates);

      confirmationMessage = component.initConfirmationMessage(message);
      $mainContainerObj.append(confirmationMessage.render());
    }

    columns = [
      {
        field: "CREATE_CASE",
        options: {
          cssClass: component.nameSpace + "-createcase",
          display: "<input type='checkbox' name='select_case' id='" + componentId + "-select-all'> ",
          template: "${CREATE_CASE}"
        }
      },
      {
        field: "PERSON",
        options: {
          id: "candidate-name",
          cssClass: component.nameSpace + "-name",
          template: "<span class='" + component.nameSpace + "-candidate-name'>${NAME}</span><a class='" + component.nameSpace + "-detail-icon'>&nbsp;</a>" +
          "<ul class='" + component.nameSpace + "-inline-list hcmDemographics " + component.nameSpace + "-meta'>" +
          "<li>${AGE}</li>" +
          "<li>${GENDER}</li>" +
          "<li><span class='" + component.nameSpace + "-meta-label'>" + Candidates.i18n.DOB_LABEL + "</span>${DOB}</li>" +
          "</ul>"
        }
      },
      {
        field: "RISK_SCORE",
        options: {
          cssClass: "hcmCandidates-risk-score"
        }
      },
      {
        field: "PROGRAM_LIST",
        options: {
          id: "programs",
          cssClass: component.nameSpace + "-programs",
          template: "<div class='" + component.nameSpace + "-program-list'>${PROGRAM_LIST}</div>" +
          "<div class='" + component.nameSpace + "-identification-date " + component.nameSpace + "-meta'>" +
          "<span>" + Candidates.i18n.IDENTIFICATION_DATE_LABEL + " </span>" +
          "<span>${IDENTIFICATION_DATE}</span>" +
          "</div>"
        }
      },
      {
        field: "LAST_ED_VISIT",
        options: {
          cssClass: component.nameSpace + "-visit-date",
          display: Candidates.i18n.LAST_ED_VISIT,
          template: "<div title='${LAST_ED_VISIT_TOOLTIP}'>${LAST_ED_VISIT}</div>"
        }
      },
      {
        field: "LAST_INPATIENT_VISIT",
        options: {
          cssClass: component.nameSpace + "-visit-date",
          display: Candidates.i18n.LAST_INPATIENT_VISIT,
          template: "<div title='${LAST_INPATIENT_VISIT_TOOLTIP}'>${LAST_INPATIENT_VISIT}</div>"
        }
      },
      {
        field: "PAYER_PLAN_TYPE",
        options: {
          cssClass: component.nameSpace + "-plan-payer",
          display: Candidates.i18n.PAYER_PLAN_COLUMN_LABEL,
          template: "<span title='${PAYER_PLAN_TYPE_TOOLTIP}'>${PAYER_PLAN_TYPE}</span>"
        }
      },
      {
        field: "ALIGNED_PROVIDERS",
        options: {
          cssClass: component.nameSpace + "-aligned-providers",
          display: Candidates.i18n.PROVIDERS_COLUMN_LABEL,
          template: "<span title='${ALIGNED_PROVIDERS_TOOLTIP}'>${ALIGNED_PROVIDERS}</span>"
        }
      }
    ];

    candidatesTable = component.createTable('results', columns);
    candidatesTable.bindData(candidates);

    $mainContainerObj.append(filterFormStr, candidatesTable.render());

    // To be improved upon in http://jira2.cerner.corp/browse/HICAREDEV-564
    //Allows graying out of the row corresponding to candidate with assigned cases
    $mainContainerObj.find("span.hcmCandidates-assigned-icon").each(function () {
      $(this).parents("dl:first").css({"color": "grey"});
    });

    if (candidates.total_results > component.pageSize) {
      pager = component.createPager(candidates);
      $mainContainerObj.append(pager.render());
    }

    component.setComponentTable(candidatesTable);
    component.finalizeComponent($mainContainerObj[0].outerHTML, "(" + candidates.total_results + ")");
    //Only attach events to the pager once it is available on the DOM
    if (pager) {
      pager.attachEvents();
    }

    component.bindFilterEvents(candidates);
    if (candidates.total_results > component.pageSize) {
      pager.setCurrentPage(component.currentPage);
    }

    component.bindAssignedIconEvents();

    component.setClickHandlersForTable();
    $(document)
        .off("click", ".hcmCandidates-detail-icon")
        .on("click", ".hcmCandidates-detail-icon", function () {
          var capTimer = new CapabilityTimer('CAP:MPG Care Management Candidates Detail Modal');
          capTimer.capture();
          component.initCandidateDetailModal(this);
        });
  }
  else {
    this.displayMfaErrorBanner($mainContainerObj);
  }
};

/***
 * Gets the Multi factor authentication data and sets mfaAuthErrorStatus
 */
Candidates.prototype.getMfaAuthStatus = function() {
  // MFA Auth API call
  var isMfaSuccess = false;
  var authStatus = new Mfa_Auth().RetrieveMfaAuthStatus();
  var authResourceAvailable = authStatus && authStatus.isResourceAvailable();
  var authStatusData = authResourceAvailable && authStatus.getResourceData();
  if (authStatusData) {
    // 0 - Authentication Success 5 - Authentication Not Required
    isMfaSuccess = authStatusData.status === 0 || authStatusData.status === 5;
    this.mfaAuthStatus = authStatusData;
  }
  else { // If there was a failure with the mfa auth utility set a generic failure message
    this.mfaAuthStatus = { message: i18n.discernabu.mfa_auth.MFA_ERROR_MSG, status: 4 };
  }
  return isMfaSuccess;
};
/**
 *  Adds audit event data for multi factor authentication
 */
Candidates.prototype.addMfaAuditEvent = function () {
  // Add Audit Event for Multi-Factor Authentication
  var providerID = this.criterion.provider_id + '.0';
  var mpEventAudit = new MP_EventAudit();
  mpEventAudit.setAuditMode(0); // 0 - one-part audit mode
  mpEventAudit.setAuditEventName('HCM_POTENTIAL_CASE_LIST_MFA_ATTEMPT');
  mpEventAudit.setAuditEventType('SECURITY');
  mpEventAudit.setAuditParticipantType('PERSON');
  mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
  mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
  mpEventAudit.setAuditParticipantID(providerID);
  var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE); 
  var dateTime = dateFormatter.format(new Date() , mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
  mpEventAudit.setAuditParticipantName('STATUS=' + this.mfaAuthStatus.status + ';DATE=' + dateTime);
  mpEventAudit.addAuditEvent();
  mpEventAudit.submit();
};

/***
 * Displays the MPage UI error banner when MFA authentication has an error
 * @param {object} mainContainerObj - object which has the html for main container
 */
Candidates.prototype.displayMfaErrorBanner = function(mainContainerObj) {
  // If user fails to authenticate (2) or cancels authentication(3)
  var isInfoBanner = this.mfaAuthStatus.status === 2 || this.mfaAuthStatus.status === 3; 
  var alertType;
  
  if (isInfoBanner) {
    alertType = MPageUI.ALERT_OPTIONS.TYPE.INFO
  } else {
    alertType = MPageUI.ALERT_OPTIONS.TYPE.ERROR;
  }
  
  var bannerHtml = new MPageUI.AlertBanner()
    .setType(alertType)
    .setPrimaryText(this.mfaAuthStatus.message)
    .render();
    
  mainContainerObj.append(bannerHtml);
  this.finalizeComponent(mainContainerObj.prop('outerHTML'));
};

/**
 * Creates the candidates pager.
 * @param {object} candidates - The candidates object.
 * @returns {MPageUI.Pager} The pager object for candidates.
 */
Candidates.prototype.createPager = function(candidates) {
  var component = this;
  var pager = new MPageUI.Pager()
      .setCurrentPageLabelPattern("${currentPage} / ${numberPages}")
      .setPreviousLabel(Candidates.i18n.PREVIOUS)
      .setNextLabel(Candidates.i18n.NEXT)
      .setNumberPages(Math.ceil(candidates.total_results / this.pageSize))
      .setOnPageChangeCallback(function(pageInfo) {
        var capTimer = new CapabilityTimer('CAP:MPG CARE MANAGEMENT CANDIDATES NEXT PAGE');
        capTimer.capture();
        component.currentPage = pageInfo.currentPage;
        component.retrieveComponentData(component.currentOptions());
      });

  return pager;
};

Candidates.prototype.bindFilterEvents = function(candidates) {
  var component = this,
      componentId = component.getComponentId();

  $("#" + componentId + "-assign-cases").click(function() {
    MP_Util.LoadSpinner(component.getSectionContentNode().id, 1);
    component.createCaseEncounters(candidates);
  });

  $("#" + componentId +"-filter-form select[name='plan']").change(function() {
    var capTimer = new CapabilityTimer('CAP:MPG CARE MANAGEMENT CANDIDATES FILTERS', 'PLAN');
    capTimer.capture();
  });

  $("#" + componentId +"-filter-form select[name='product_type']").change(function() {
    var capTimer = new CapabilityTimer('CAP:MPG CARE MANAGEMENT CANDIDATES FILTERS', 'PRODUCT TYPE');
    capTimer.capture();
  });

  $("#" + componentId +"-filter-form select[name='program_id']").change(function() {
    var capTimer = new CapabilityTimer('CAP:MPG CARE MANAGEMENT CANDIDATES FILTERS', 'PROGRAM');
    capTimer.capture();
  });

  $("#" + componentId +"-filter-form select[name='aligned_provider_id']").change(function() {
    var capTimer = new CapabilityTimer('CAP:MPG CARE MANAGEMENT CANDIDATES FILTERS', 'ALIGNED PROVIDER');
    capTimer.capture();
  });

  $("#" + componentId +"-filter-form select[name='sort']").change(function() {
    var capTimer = new CapabilityTimer('CAP:MPG CARE MANAGEMENT CANDIDATES SORTS', component.sortTimer());
    capTimer.capture();
  });

  // Reloads the page based on the changed values in dropdown list
  $("#" + componentId + "-filter-form").change(function() {
    component.currentPage = 0;
    component.retrieveComponentData(component.currentOptions());
  });
};

/**
 * This method calls the HCM_ASSIGN_CASES to create case encounters.
 * @param {Object[]} candidatesData - Array of Candidate data.
 * @return null.
 */
Candidates.prototype.createCaseEncounters = function(candidatesData){
  var component = this,
      compNS = component.getStyles().getNameSpace(),
      candidateList =  $("#" + this.getComponentId() + "-resultstable .hcmCandidates-create-case-checkbox:checked").map(function() { return this.id; }).toArray(),
      CANDIDATES = {};
  CANDIDATES.EMPI_IDS = [];

  $.each(candidateList, function(_, candidate){
    CANDIDATES.EMPI_IDS.push({"ID" : candidate});
  });
  var candidatesJsonString = JSON.stringify({"CANDIDATES": CANDIDATES});

  var subTimerName = component.careManagerName ? 'ASSIGNMENT WITH SELECTED CARE MANAGER' : 'ASSIGNMENT WITH CURRENT CARE MANAGER';
  var capTimer = new CapabilityTimer('CAP:MPG CARE MANAGEMENT CANDIDATES ASSIGNED', subTimerName);
  capTimer.addMetaData('assignments', CANDIDATES.EMPI_IDS.length.toString());
  capTimer.capture();

  component.scriptRequest({
  name: "HCM_ASSIGN_CASES",
  params: [component.careManagerId + '.0', '^' + candidatesJsonString.replace(/"/g, "'") + '^', '^' + component.candidatesBatchUri() + '^'],
    success: function(reply) {
      if (reply.STATUS_DATA.STATUS === 'S') {
        // Pass the successfully assigned candidates to display banner.
        component.retrieveComponentData(component.currentOptions(), candidateList);
      } else {
        // Display error modal for failed cases.
        component.displayFailedCases(reply, candidatesData);
        component.retrieveComponentData(component.currentOptions());
      }
    }
  });
};

Candidates.CASE_ASSIGNMENT_CONFIG_ERRORS = [
  'NO_DEFAULT_CASE_TYPE',
  'NO_DEFAULT_ORG',
  'TOO_MANY_DEFAULT_ORGS',
  'NO_SYSTEM_REFERRAL_SRC_CD'
];

/**
 * This method finds the specific type of failed cases and calls the method to display those cases in error modal.
 * @param {object} reply - Reply from HCM_ASSIGN_CASES.
 * @param {object} candidates - Array of Candidate data.
 * @return null.
 */
Candidates.prototype.displayFailedCases = function(reply, candidates) {
  var component = this;
  var compNS = component.getStyles().getNameSpace();
  var caseCreationErrorNames;
  var careTeamAssignErrorNames;
  var existingCaseNames;
  var modalBody;
  var subEventStatus = reply.STATUS_DATA.SUBEVENTSTATUS[0] && $.trim(reply.STATUS_DATA.SUBEVENTSTATUS[0].TARGETOBJECTNAME);

  if (subEventStatus && $.inArray(subEventStatus, Candidates.CASE_ASSIGNMENT_CONFIG_ERRORS) >= 0) {
    modalBody = "<span class='" + compNS + "-error-icon'>" + Candidates.i18n[subEventStatus] + '</span><br/>';

    component.displayErrorModal(modalBody, Candidates.i18n.MODAL_ERROR_HEADER);
  } else {
    caseCreationErrorNames = component.getCandidateNamesByStatus(reply, 'CASE_CREATION_ERROR', candidates);
    careTeamAssignErrorNames = component.getCandidateNamesByStatus(reply, 'CARE_TEAM_ASSIGN_ERROR', candidates);
    existingCaseNames = component.getCandidateNamesByStatus(reply, 'EXISTING_ENCOUNTER', candidates);
    component.displayErrorModal(component.getModalBodyForPartialSuccess(caseCreationErrorNames, careTeamAssignErrorNames, existingCaseNames), Candidates.i18n.UNABLE_TO_PROCESS);
  }
};

Candidates.prototype.getModalBodyForPartialSuccess = function(caseCreationErrorNames, careTeamAssignErrorNames, existingCaseNames) {
  var component = this;
  var compNS = component.getStyles().getNameSpace();
  var i18n = Candidates.i18n;
  var modalBody = '';

  if (caseCreationErrorNames.length || careTeamAssignErrorNames.length || existingCaseNames.length) {
    modalBody += '<span class="' + compNS + '-error-icon">' + i18n.ACTION_ERROR_TEXT + '</span><br/>';
    modalBody += '<br/><span class = "' + compNS + '-error-message"/><b>' + i18n.DETAILS +'</b><br/>';

    // case creation
    if (caseCreationErrorNames.length){
      var caseCreationErrorList = '<li class = "' + compNS + '-failed-candidates">' + caseCreationErrorNames.join('</li><li class = "' + compNS + '-failed-candidates">') + '</li>';
      modalBody += '<p class = "' + compNS + '-failed-candidate-error-message">' + i18n.CASE_CREATION_MODAL_ERROR + '</p>' + caseCreationErrorList;
    }

    // care team
    if (careTeamAssignErrorNames.length) {
      var caseCreationErrorList = '<li class = "' + compNS + '-failed-candidates">' + careTeamAssignErrorNames.join('</li><li class = "' + compNS + '-failed-candidates">') + '</li>';
      modalBody += '<br/><p class = "' + compNS + '-failed-candidate-error-message">' + i18n.CARE_TEAM_MODAL_ERROR + '</p>' + careTeamErrorList;
    }
  }

  // existing cases
  if (existingCaseNames.length) {
    modalBody +=  '<span class="' + compNS + '-info-icon">' + i18n.CASE_EXISTING_ERROR + '</span>';
    modalBody += '<li class = "' + compNS + '-failed-candidates">' + existingCaseNames.join('</li><li class = "' + compNS + '-failed-candidates">') + '</li>';
  }

  return modalBody;
};

/**
 * Get a list of candidate names for the given failed assingment status.
 * @param {object} reply - Reply from HCM_ASSIGN_CASES.
 * @param {String} status - Failed assignment status.
 * @param {object} candidates - Array of Candidate data.
 * @return {String[]} Names of filtered candidates.
 */
Candidates.prototype.getCandidateNamesByStatus = function(reply, status, candidates) {
  return $.map(reply.CANDIDATES, function(replyCandidate) {
    if ($.trim(replyCandidate.ASSIGNMENT_STATUS) === status) {
      return $.map(candidates, function(candidate) {
        if (candidate.empi_id === replyCandidate.EMPI_ID) {
          return candidate.NAME;
        }
      });
    }
  });
};

Candidates.prototype.displayErrorModal = function(modalBody, header) {
  var component = this,
      modalId = component.getComponentId() + "CandidateError",
      modalDialog;

  MP_ModalDialog.deleteModalDialogObject(modalId);
  modalDialog = new ModalDialog(modalId);

  modalDialog.setHeaderTitle(header)
    .setTopMarginPercentage(25)
    .setRightMarginPercentage(35)
    .setBottomMarginPercentage(20)
    .setLeftMarginPercentage(30)
    .setIsBodySizeFixed(false)
    .setHasGrayBackground(true)
    .setIsFooterAlwaysShown(true);

  modalDialog.setBodyDataFunction(function(modalObj) {
    modalObj.setBodyElementId(component.nameSpace + "CandidateErrorBody");
    modalObj.setBodyHTML(modalBody);
  });

  var cancelButton = new ModalButton("Close");
  cancelButton.setText(Candidates.i18n.CLOSE).setIsDithered(false).setOnClickFunction(function() {
    MP_ModalDialog.closeModalDialog(modalId);
  });
  modalDialog.addFooterButton(cancelButton);

  MP_ModalDialog.updateModalDialogObject(modalDialog);
  MP_ModalDialog.showModalDialog(modalId);
};

Candidates.prototype.filterForm = function(filters, filterData) {
  var component = this;
  var plansOptions = $.map(filters.plans, function(plan) {
    return {id: plan.plan_name, display: plan.plan_name};
  });
  var productTypesOptions = $.map(filters.productTypes, function(productType) {
    return {id: productType.product_type, display: productType.product_type};
  });
  var caseTypesOptions = $.map(filters.caseTypes, function(caseType) {
    return {id: caseType.CASE_TYPE_CD , display: caseType.CASE_TYPE_DISP};
  });
  var alignedProvidersOptions = $.map(filters.alignedProviders, function(alignedProvider) {
    return {id: alignedProvider.fact_id, display: alignedProvider.fact_display};
  });
  var plansSelectTag = component.selectTag('plan', plansOptions, {
    prompt: Candidates.i18n.PLAN_FILTER_PROMPT,
    selected: filterData.plan
  });
  var productTypesSelectTag = component.selectTag('product_type', productTypesOptions, {
    prompt: Candidates.i18n.PLAN_TYPE_FILTER_PROMPT,
    selected: filterData.product_type
  });
  var caseTypesSelectTag = component.selectTag('case_type', caseTypesOptions, {
    prompt: Candidates.i18n.CASE_TYPE_PROMPT,
    selected: filterData.case_type
  });
  var alignedProvidersSelectTag = component.selectTag('aligned_provider_id', alignedProvidersOptions, {
    prompt: Candidates.i18n.ALIGNED_PROVIDER_PROMPT,
    selected: filterData.aligned_provider_id
  });
  var sortSelectTag = component.selectTag('sort', Candidates.sortOptions(), {
    selected: filterData.sort + "_" + filterData.order
  });
  var formStr = "<form id='" + component.getComponentId() + "-filter-form' class='hcmCandidates-filter-form'>" +
                  "<div class='" + component.nameSpace + "-filters-wrapper'>" +
                    "<div class='" + component.nameSpace + "-filters'>" +
                      "<span>" + Candidates.i18n.PLAN_LABEL + "</span>" +
                      plansSelectTag +
                      "<span>" + Candidates.i18n.PRODUCT_TYPE_LABEL + "</span>" +
                      productTypesSelectTag +
                      "<span>" + Candidates.i18n.CASE_TYPE_LABEL + "</span>" +
                      caseTypesSelectTag +
                    "</div>" +
                    "<div class='" + component.nameSpace + "-sort'>" +
                      "<span>" + Candidates.i18n.SORT_LABEL + "</span>" +
                      sortSelectTag +
                      "<span>" + Candidates.i18n.ALIGNED_PROVIDER_LABEL + "</span>" +
                      alignedProvidersSelectTag +
                    "</div>" +
                  "</div>" +
                  "<div class='hcmCandidates-button-separator'>" +
                    "<input type='button' id='" + component.getComponentId() + "-assign-cases' class='" + component.nameSpace + "-assign-cases' value='" + Candidates.i18n.ASSIGN_SELECTED + "' disabled='disabled'>" +
                  "</div>" +
                "</form>";

  return formStr;
};

Candidates.prototype.currentOptions = function() {
  var json = Candidates.serializeFormToJson($("#" + this.getComponentId() + "-filter-form"));

  if (json.sort) {
    json.order = json.sort.substring(json.sort.lastIndexOf("_") + 1);
    json.sort  = json.sort.substring(0, json.sort.lastIndexOf("_"));
  }

  return json;
};

Candidates.prototype.retrievePlans = function(successhandler) {
  this.scriptRequest({
    name  : this.planUri() ? "HI_HTTP_PROXY_GET_REQUEST" : "HI_PRSNL_LOOKUP_HTTP_PROXY_GET",
    params: this.planUri() ? this.mockParams(this.planUri()) : this.cclParams("HI_CM_PLANS"),
    rawDataIndicator: true,
    success: successhandler,
    failure: function(response) { MP_Util.LogError("Error retrieving results"); }
  });
};

/**
 * This method builds the request json structure to call HCM_GET_CASES_FOR_CANDIDATES script.
 *
 * @param {Object[]} candidates - An array of candidates for the current care manager.
 * @param {function} successhandler - The function to be called on a successful script call.
 *
 * @returns {null} nothing.
 */
Candidates.prototype.retrieveCandidatesWithCases = function(candidates, successhandler) {
  var recordIdsCount;
  var recordIds = [];
  var persons = $.map(candidates, function(candidate) {
    recordIdsCount = candidate.record_ids ? candidate.record_ids.length : 0;

    if (recordIdsCount > 1) {
      recordIds = $.map(candidate.record_ids, function(record) {
        return {person_id: parseFloat(record['person_id'])};
      });
      return {record_ids: recordIds, empi_id: candidate['empi_id']};
    } else if (recordIdsCount === 1) {
      return {person_id: parseFloat(candidate.record_ids[0]['person_id']), empi_id: candidate['empi_id']};
    } else {
      return {person_id: 0, empi_id: candidate.empi_id};
    }
  });

  var requestJson = {
    candidates: {
      persons: persons
    }
  };

  var requestJsonString = JSON.stringify(requestJson);
  this.scriptRequest({
    name  : "HCM_GET_CASES_FOR_CANDIDATES",
    params: "@" + requestJsonString.length + ":" + requestJsonString + "@",
    success: successhandler
  });
};

Candidates.prototype.retrieveProductTypes = function(successhandler) {
  this.scriptRequest({
    name  : this.productTypeUri() ? "HI_HTTP_PROXY_GET_REQUEST" : "HI_PRSNL_LOOKUP_HTTP_PROXY_GET",
    params: this.productTypeUri() ? this.mockParams(this.productTypeUri()) : this.cclParams("HI_CM_PRODUCT_TYPES"),
    rawDataIndicator: true,
    success: successhandler,
    failure: function(response) { MP_Util.LogError("Error retrieving results"); }
  });
};

Candidates.prototype.retrieveCandidate = function(candidateId, successhandler) {
  var uri = this.candidateUri();

  this.scriptRequest({
    name  : "HI_HTTP_PROXY_GET_REQUEST",
    params: uri ? this.mockParams(uri) : this.mockParams("HI_CM_CANDIDATE", {candidate_id: candidateId}),
    rawDataIndicator: true,
    success: successhandler,
    failure: function(response) { MP_Util.LogError("Error retrieving results"); }
  });
};

Candidates.prototype.createTable = function(id, columns) {
  function toDashCase(string) {
    return string.toLowerCase().replace(/([_])/g,"-");
  }

  function createColumn(field, options) {
    var column = new TableColumn();
    var options = options || {};

    column.setCustomClass(options.cssClass);
    column.setColumnId(options.id || toDashCase(field));
    column.setColumnDisplay(options.display || Candidates.i18n[field]);
    column.setIsSortable(options.sortable || false);
    column.setPrimarySortField(options.sort || field);
    column.setRenderTemplate(options.template || "${" + field + "}");
    return column;
  }

  var candidatesTable = new ComponentTable();
  candidatesTable.setCustomClass(this.nameSpace + "-table");
  candidatesTable.setNamespace(this.getComponentId() + "-" + id);
  var candidateColumns = $.map(columns, function(column, _) { return createColumn(column.field, column.options); });
  $.each(candidateColumns, function(_, column) { candidatesTable.addColumn(column); });

  return candidatesTable;
};

Candidates.prototype.addTableGroups = function(groups, table) {
  function capitalize (groupValue) {
    return groupValue.charAt(0).toUpperCase() + groupValue.slice(1);
  };

  $.each(groups, function(_, group) {
    var id = group.value.toUpperCase(),
        tableGroup = new TableGroup()
          .setGroupId(id)
          .setKey(group.key)
          .setValue(group.value)
          .setDisplay(group.display || capitalize(group.value))
          .setCanCollapse(true)
          .setShowCount(true)
          .bindData(group.data);

    table.addGroup(tableGroup);
  });

  var groupToggleExtension = new TableGroupToggleCallbackExtension()
    .setGroupToggleCallback(function(event, data) {
      // Make sure to collapse theContent table section as well
      if (data.GROUP_DATA.EXPANDED) {
        table.openGroup(data.GROUP_DATA.GROUP_ID);
      }
      else {
        table.collapseGroup(data.GROUP_DATA.GROUP_ID);
      }
    });

  table.addExtension(groupToggleExtension);

  return table;
};

Candidates.sortOptions = function() {
  return [
    {id: "risk_score_desc", display: Candidates.i18n.RISK_SCORE_DESC},
    {id: "risk_score_asc", display: Candidates.i18n.RISK_SCORE_ASC},
    {id: "identification_date_desc", display: Candidates.i18n.IDENTIFICATION_DATE_DESC},
    {id: "identification_date_asc", display: Candidates.i18n.IDENTIFICATION_DATE_ASC},
    {id: "latest_ed_visit_desc", display: Candidates.i18n.LAST_ED_VISIT_DESC},
    {id: "latest_ed_visit_asc", display: Candidates.i18n.LAST_ED_VISIT_ASC},
    {id: "latest_inpatient_visit_desc", display: Candidates.i18n.LAST_INPATIENT_VISIT_DESC},
    {id: "latest_inpatient_visit_asc", display: Candidates.i18n.LAST_INPATIENT_VISIT_ASC}
  ];
};

Candidates.prototype.sortTimer = function() {
  var sortTimerIndex = {
    risk_score: 'RISK SCORE',
    identification_date: 'ID DATE',
    latest_ed_visit: 'ED VISIT',
    latest_inpatient_visit: 'INPATIENT VISIT'
  };
  var sort = sortTimerIndex[this.currentOptions().sort];

  return sort + ' ' + this.currentOptions().order.toUpperCase();
}

Candidates.prototype.bindAssignedIconEvents = function() {
  $('.hcmCandidates-assigned-icon').mouseover(function() {
    var capTimer = new CapabilityTimer('CAP:MPG CARE MANAGEMENT CANDIDATES CHECKMARK TOOLTIP');
    capTimer.capture();
  });
};

/**
 * Calls Event Handlers for the component table
 */
Candidates.prototype.setClickHandlersForTable = function() {
  var component = this;
  var componentId = component.getComponentId();
  var compNS = component.getStyles().getNameSpace();
  $("#" + componentId + "-resultstable .hcmCandidates-create-case-checkbox").change(function() {
    $('#' + componentId + '-assign-cases').prop("disabled", !$("#" + componentId + "-resultstable .hcmCandidates-create-case-checkbox:checked").length);
  });

// checks if there are any available un-flagged candidates with select checkbox, if not, this disables the select all checkbox
  if($("#" + componentId + "-resultstableBody").find(".hcmCandidates-create-case-checkbox").length === 0) {
    $("#" + componentId + "-select-all").prop("disabled",true);
  }

  $("#" + componentId + "-resultstable #header .hcmCandidates-detail").click(function() {
    $("#" + componentId + "-resultstable .hcmCandidates-create-case-checkbox").each(function() {
      $(this).prop("checked", false);
    });
    $('#' + componentId + '-assign-cases').prop("disabled", true);
    $('#' + componentId + '-select-all').prop("checked",false);
  });

  //Selects/Deselects all candidates depending on the select-all checkbox
  $('#' + componentId + '-select-all').click(function() {  //on click
    //finds all candidate checkboxes within the component
    $('#' + componentId + '-resultstableBody').find('.hcmCandidates-create-case-checkbox').each(function() {
      $(this).prop("checked", $('#' + componentId + '-select-all').prop('checked'));
    });
    $('#' + componentId + '-assign-cases').prop("disabled", !$("#" + componentId + "-select-all:checked").length);
  });
};

/**
 * HELPER FUNCTIONS
 */

Candidates.templateVariables = function(queryParams) {
  var paramStrings = [];

  $.each(queryParams, function(key, value) {
    if(value instanceof Array) {

      // for repeatable params
      $.each(value, function(_, subValue) {
        paramStrings.push(key + "=" + subValue);
      });
    } else {
      paramStrings.push(key + "=" + value);
    }
  });

  return paramStrings.join(";");
};

/**
 * Creates a new birth date from a date, ignoring time and time zone. Date does not support all ISO8601 formats in ie8,
 * e.g. "1980-05-04T00:00:00Z", so this is required to parse those dates correctly. Generally, birth dates do not
 * contain time information so this method should be safe assuming midnight UTC has just been appended to the string.
 */
Candidates.parseBirthDate = function(dateString) {
  return $.datepicker.parseDate('yy-mm-dd', dateString.split('T')[0]);
};

Candidates.serializeFormToJson = function($form) {
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function(n, i){
      indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
};

/**
 * Creates and performs a ComponentScriptRequest.
 * @param {Object} settings - setting for the ComponentScriptReply.
 *        {String} name - name of the ccl program that needs to be executed.
 *        {(String|String[])} [params] - a param, or an array of params to be passed to the ccl script.
 *        {Boolean} [rawDataIndicator] - sets the raw data on ComponentScriptRequest and sets response
 *                                       handler to handle raw data correctly.
 *        {callBack} success - sets a success callback handler. This callback gets the json parsed body
 *                     from the proxyReply when raw data is set and response object when it's not set.
 *        {callBack} failure - sets a failure callback handler. This callback gets the json parsed proxyReply
 *                     when raw data is set and is never called when it's not set.
 *        {RTMSTimer} [loadTimer=new RTMSTimer(component.getComponentLoadTimerName())]
 *        {RTMSTimer} [renderTimer=new RTMSTimer(component.getComponentRenderTimerName())]
 */
Candidates.prototype.scriptRequest = function(settings) {
  var component     = this,
      settings      = settings || {},
      loadTimer     = settings.loadTimer || new RTMSTimer(component.getComponentLoadTimerName()),
      renderTimer   = settings.renderTimer || new RTMSTimer(component.getComponentRenderTimerName()),
      scriptRequest = new ComponentScriptRequest();

  scriptRequest.setComponent(component);
  scriptRequest.setLoadTimer(loadTimer);
  scriptRequest.setRenderTimer(renderTimer);
  scriptRequest.setProgramName(settings.name);
  settings.params && scriptRequest.setParameterArray(['^MINE^'].concat(settings.params));

  if(settings.rawDataIndicator) {
    scriptRequest.setRawDataIndicator(settings.rawDataIndicator);
    scriptRequest.setResponseHandler(function(reply) {
      component.handleRawResponse(reply, settings.success, settings.failure);
    });
  } else {
    scriptRequest.setResponseHandler(function(reply) { settings.success(reply.getResponse()); });
  }

  scriptRequest.performRequest();
 };

Candidates.prototype.handleRawResponse = function(reply, successHandler, failureHandler) {
  var proxyReply = JSON.parse(reply.getResponse()).PROXYREPLY,
      status     = proxyReply.HTTPREPLY.STATUS;

  if (proxyReply.TRANSACTIONSTATUS.SUCCESSIND === 1 && status === 200) {
    successHandler && successHandler(JSON.parse(proxyReply.HTTPREPLY.BODY));
  } else {
    failureHandler && failureHandler(proxyReply);
  }
};

/**
 * creates html string for select Tag.
 * @param {String} name - the name of the select tag
 * @param {(Object|Object[])} idDisplayList - {id:, display:} Object or array of Objects to create option
 *                              tags within the select tag. {id} is used as the value attribute and {display}
 *                              is used as the display name.
 * @param {Object} [options] - optional options for selectTag
 *        {String} [prompt] - first option in the select tag. This is used as the display text to explain
 *                    the purpose of the select tag.
 *        {String} [selected] - the id for the option that should be selected by default.
 */
Candidates.prototype.selectTag = function(name, idDisplayList, options) {
  var idDisplayList = $.makeArray(idDisplayList),
      selectTag = "<select name='" + name + "'>",
      options = options || {prompt: null, selected: null};

  // adds prompt as the first option for select with no name (only display value)
  options.prompt && idDisplayList.unshift({id: "", display: options.prompt});

  selectTag += $.map(idDisplayList, function(value){
    if (options.selected && options.selected == value.id) {
      return "<option value='" + value.id + "' selected>" + value.display + "</option>";
    } else{
      return "<option value='" + value.id + "'>" + value.display + "</option>";
    };
  }).join("");

  selectTag += "</select>";

  return selectTag;
};

MP_Util.setObjectDefinitionMapping("HCM_CANDIDATES", Candidates);
