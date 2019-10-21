function CvComponentStyle() {
  this.initByNamespace("cv");
}

CvComponentStyle.inherits(ComponentStyle);

/**
 * The Consolidated Problems component will allow the user to view conditions, with related diagnoses and problems, for the patient from within the MPage
 *
 * @param {Criterion} criterion
 */
function CvComponent(criterion) {
  // Global Variable for conditionView Search
  this.m_diagnosisTargetVocabCd = 0.0;
  this.m_problemTargetVocabCd = 0.0;
  // 0: No Privs, 1:Has update Dx, 2: Has Update Prob, 3: Has both Update Dx and Prob privs
  this.m_canAddConditionFlag = 0;
  this.m_historicalLabelDisplay = "";
  this.m_activeLabelDisplay = "";
  this.m_visitLabelDisplay = "";
  this.m_canAddConditionPref = -1;
  this.m_historicalCheckbox = -1;
  // Newly added condition's nomenclature id
  this.m_nNewConditionType = -1;
  this.m_dNewConditionNomenclatureId = 0.0;
  this.m_nNewConditionIndx = 0;
  this.m_loadedConditions = null;
  // Drag and Drop variables
  this.m_sList = [];
  this.m_sPlaceHolder = "";
  this.m_cvDragging = false;
  this.m_cvDragHvr = "";
  this.m_cvDragHvrLeft = 0;
  this.m_cvActiveHvr = "";
  this.m_mousePos = "";
  this.m_isDragging = false;
  this.m_dragStart = "";
  this.m_dragStop = "";
  this.m_dragTarget = "";
  this.m_cvDragParentDiv = "";
  this.m_cvDragNomenId = 0.0;
  this.m_cvSourceSection = "";
  this.m_rootNode = "";
  this.m_selectedOnDown = false;
  this.m_lastMouseDownId = "";
  this.m_iconPath = "";
  this.m_isDropMenu = false;
  // Re-prioritized Diagnoses
  this.m_reprioritizedDiagnoses = null;
  // Processing count
  this.m_nProcessing = 0;
  this.m_nWaitCursor = 0;
  // Expand/Collapse for Sections
  this.m_bActiveExpanded = true;
  this.m_bHistoricalExpanded = false;
  // Refresh count
  this.m_nRefreshCount = 0;
  // Add as type
  this.m_cvAddAsType = -1;
  // Date Formatter
  this.m_df = null;
  // Object handle to the ProbDxUtils com dll
  this.m_cvProbDxObj = null;
  this.setCriterion(criterion);
  this.setStyles(new CvComponentStyle());
  this.setComponentLoadTimerName("USR:MPG.CONSOL_PROB.O1 - load component");
  this.setComponentRenderTimerName("ENG:MPG.CONSOL_PROB.O1 - render component");
  this.setIncludeLineNumber(false);
  this.m_editMode = false;
  this.m_defaultSearchVocab = 0;
  this.m_visitVocab = 0;
  this.m_activeVocab = 0;
  this.m_visitLabel = "";
  this.m_activeLabel = "";
  this.m_historicalLabel = "";
  this.m_visitAddClass = 0.0;
  this.m_visitAddConf = 0.0;
  this.m_visitAddType = 0.0;
  this.m_activeAddClass = 0.0;
  this.m_activeAddType = 0.0;
  this.m_compObject = {
    cvObject: [],
    cvModRootId: null,
    cvCompId: null,
    cvCompSec: null,
    iSearchTypeFlag: 0,
    sec: "",
    criterion: null,
    curSearchCounter: 0,
    replySearchCounter: 0
  };
  this.setScope(1);
  this.setHasActionsMenu(true);
  this.m_commentExpandFlag = [];
  this.m_allowComments = 1;
  this.m_showAnnotatedDisplay = 1; //TODO this will be set by a bedrock pref
  this.m_enableModifyPrioritization = 0; //TODO this wil be set by a bedrock pref
  this.m_viewPriorities = 0;
  //NKP Variables
  this.nkpNomenclatureId = 0.0;
  this.nkpProblemId = 0.0;
  this.nkpNomenArray = [];
  this.nNKPCanUpdate = 0;
  this.nNKPCanView = 0;
  this.nNKPChronicProbExist = 0;

  this.m_diagnosisTargetVocabCode = 0;
  this.m_quickSearchLimit = 0;
  this.m_enableDxAssistant = 0;
  this.m_minQuickSearchItems = 10;
  this.m_specificityMap = {};
  this.m_MU2State = 0;
  this.nkpEventProcessing = false; //Prevents errors when the user rapidly clicks the checkbox.
  this.m_enableEarlyTransitionDx = false;

  window.cp_mpage = criterion.category_mean;

  CvComponent.method("getPrefJson", function() {
    var json = {
      "CONSOLIDATED_PREFS": {
        "CAN_ADD_CONDITION_PREF": this.m_canAddConditionPref,
        "HISTORICAL_CHECKBOX_PREF": this.m_historicalCheckbox
      }
    };
    return json;
  });
  CvComponent.method("InsertData", function() {
    CERN_CV_O1.GetCvTable(this);
  });
  CvComponent.method("HandleSuccess", function(conditionData) {
    CERN_CV_O1.RenderComponent(this, conditionData);
  });
  CvComponent.method("setDefaultSearchVocab", function(value) {
    this.m_defaultSearchVocab = value;
  });
  CvComponent.method("getDefaultSearchVocab", function() {
    return this.m_defaultSearchVocab;
  });
  CvComponent.method("setMU2State", function(value) {
    //Need to convert to numbers to single digit for switch that takes in this value
    if (value == 1.00)
      this.m_MU2State = 1;
    //A value of 2 from bedrock is the same as the default case of 0
    else if (value == 2.00)
      this.m_MU2State = 0;
    else if (value == 3.00)
      this.m_MU2State = 2;
    else
      this.m_MU2State = 0;
  });
  CvComponent.method("getMU2State", function() {
    return this.m_MU2State;
  })
  CvComponent.method("setQuickSearchLimit", function(value) {
    this.m_quickSearchLimit = value;
  });
  CvComponent.method("getQuickSearchLimit", function() {
    return this.m_quickSearchLimit;
  });
  CvComponent.method("setVisitVocab", function(value) {
    this.m_visitVocab = value;
  });

  CvComponent.method("getVisitVocab", function() {
    return this.m_visitVocab;
  });
  CvComponent.method("setActiveVocab", function(value) {
    this.m_activeVocab = value;
  });
  CvComponent.method("getActiveVocab", function() {
    return this.m_activeVocab;
  });
  CvComponent.method("setVisitLabel", function(value) {
    this.m_visitLabel = value;
  });
  CvComponent.method("getVisitLabel", function() {
    return this.m_visitLabel;
  });
  CvComponent.method("setActiveLabel", function(value) {
    this.m_activeLabel = value;
  });

  CvComponent.method("getActiveLabel", function() {
    return this.m_activeLabel;
  });
  CvComponent.method("setHistoricalLabel", function(value) {
    this.m_historicalLabel = value;
  });
  CvComponent.method("getHistoricalLabel", function() {
    return this.m_historicalLabel;
  });
  CvComponent.method("getVisitAddType", function() {
    return this.m_visitAddType;
  });
  CvComponent.method("setVisitAddType", function(value) {
    this.m_visitAddType = value;
  });
  CvComponent.method("getVisitAddClass", function() {
    return this.m_visitAddClass;
  });
  CvComponent.method("setVisitAddClass", function(value) {
    this.m_visitAddClass = value;
  });
  CvComponent.method("getVisitAddConf", function() {
    return this.m_visitAddConf;
  });
  CvComponent.method("setVisitAddConf", function(value) {
    this.m_visitAddConf = value;
  });
  CvComponent.method("getActiveAddType", function() {
    return this.m_activeAddType;
  });
  CvComponent.method("setActiveAddType", function(value) {
    this.m_activeAddType = value;
  });
  CvComponent.method("getActiveAddClass", function() {
    return this.m_activeAddClass;
  });
  CvComponent.method("setActiveAddClass", function(value) {
    this.m_activeAddClass = value;
  });
  CvComponent.method("setModifyInd", function(value) {
    this.m_modifyInd = (value == 1 ? true : false);
  });
  CvComponent.method("getModifyInd", function() {
    return this.m_modifyInd;
  });
  CvComponent.method("setEnableModifyPrioritization", function(value) {
    this.m_enableModifyPrioritization = (value == true ? 1 : 0);
  });
  CvComponent.method("getEnableModifyPrioritization", function() {
    return this.m_enableModifyPrioritization;
  });
  CvComponent.method("openTab", function() {
    var criterion = this.getCriterion();
    var sParms = '/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + this.getLink() + '+^';
    APPLINK(0, criterion.executable, sParms);
    this.InsertData();
  });
  CvComponent.method("getDateFormatter", function() {
    if (!this.m_df) {
      this.m_df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
    }
    return this.m_df;
  });
  CvComponent.method("hasInfoButton", function() {
    return (this.m_hasInfoButton);
  });
  CvComponent.method("setHasInfoButton", function(value) {
    this.m_hasInfoButton = (value == 1 ? true : false);
  });
  CvComponent.method("isInfoButtonEnabled", function() {
    return (this.m_isInfoButtonEnabled);
  });
  CvComponent.method("setIsInfoButtonEnabled", function(value) {
    this.m_isInfoButtonEnabled = (value == 1 ? true : false);
  });
  CvComponent.method("setEnableDxAssistant", function(value) {
    this.m_enableDxAssistant = (value == true ? true : false);
  });
  CvComponent.method("getEnableDxAssistant", function() {
    return this.m_enableDxAssistant;
  });
}

CvComponent.inherits(MPageComponent);

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 */
CvComponent.prototype.loadFilterMappings = function() {

  //Add the filter mapping object for the Catalog Type Codes
  this.addFilterMappingObject("CONSOL_PROB_INFO_BUTTON_IND", {
    setFunction: this.setHasInfoButton,
    type: "BOOLEAN",
    field: "FREETEXT_DESC"
  });

  //Add the filter mapping object for Enabling Diagnosis Assistant.
  this.addFilterMappingObject("CONSOL_ENABLE_DX_ASSIST", {
    setFunction: this.setEnableDxAssistant,
    type: "BOOLEAN",
    field: "FREETEXT_DESC"
  });

  //Add the filter mapping object for Quick Search Limit.
  this.addFilterMappingObject("CONSOL_QUICK_SEARCH_LIMIT", {
    setFunction: this.setQuickSearchLimit,
    type: "NUMBER",
    field: "FREETEXT_DESC"
  });

  //Add the filter mapping object for Quick Search Limit.
  this.addFilterMappingObject("CONSOL_PROB_LIST_FLAG", {
    setFunction: this.setMU2State,
    type: "NUMBER",
    field: "FREETEXT_DESC"
  });
};

/**
 * Returns the handle to the PROBDXUTILS object if it has already been loaded.  If it hasn't been loaded it will attempt to lazy load the object
 */
CvComponent.prototype.getProbDxUtilsObject = function() {
  if (!this.m_cvProbDxObj) {
    try {
      this.m_cvProbDxObj = window.external.DiscernObjectFactory("PROBDXUTILS");
      MP_Util.LogDiscernInfo(this, "PROBDXUTILS", "consolidatedproblems.js", "CvComponent");
    } catch (error) {
      MP_Util.LogJSError(error, this, "consolidatedproblems.js", "getProbAndDxObject");
    }
  }
  return this.m_cvProbDxObj;
};
var CERN_CV_O1 = function() {
  return {

    GetCvTable: function(component) {
      component.m_compObject.cvCompId = component.getComponentId();
      component.m_compObject.cvModRootId = 'cv' + component.m_compObject.cvCompId;
      component.m_compObject.cvCompSec = $('#' + component.m_compObject.cvModRootId).get(0);

      var titleFrag = $('<span/>');
      var innerHTMLArr = [];
      innerHTMLArr.push('<span id="cvProcessing', component.m_compObject.cvCompId, '" class="processing hide">', i18n.discernabu.consolproblem_o1.PROCESSING, '</span>');

      $(titleFrag).html(innerHTMLArr.join(''));
      var secTitle = $(component.m_compObject.cvCompSec).find('.sec-title').first();

      $(secTitle).after(titleFrag);

      CERN_CV_O1.processingUI(component, "cvProcessing" + component.m_compObject.cvCompId, 0, true, CERN_CV_O1.updateCVActions, component.m_compObject.cvCompId);
      var sendAr = [];
      component.m_compObject.criterion = component.getCriterion();
      sendAr.push("^MINE^", component.m_compObject.criterion.person_id + ".0", component.m_compObject.criterion.provider_id + ".0", component.m_compObject.criterion.encntr_id + ".0", component.m_compObject.criterion.ppr_cd + ".0", component.m_compObject.criterion.position_cd + ".0", "^" + component.m_compObject.criterion.category_mean + "^", component.getDefaultSearchVocab() + ".0", "1");
      MP_Core.XMLCclRequestWrapper(component, "MP_GET_CONDITIONS", sendAr, true);
      component.m_compObject.sec = component.getStyles().getNameSpace();
      // Setting Bedrock Prefs
      component.m_diagnosisTargetVocabCd = component.getVisitVocab();
      component.m_diagnosisTargetVocabCd = parseFloat(component.m_diagnosisTargetVocabCd.toFixed(1));
      component.m_problemTargetVocabCd = component.getActiveVocab();
      component.m_problemTargetVocabCd = parseFloat(component.m_problemTargetVocabCd.toFixed(1));
      component.m_historicalLabelDisplay = component.getHistoricalLabel();
      component.m_activeLabelDisplay = component.getActiveLabel();
      component.m_visitLabelDisplay = component.getVisitLabel();
      component.m_quickSearchLimit = component.getQuickSearchLimit();
      component.m_enableDxAssistant = component.getEnableDxAssistant();
    },
    /**
     * Refreshes any global variables that need to be reset when the conditions are reloaded and the page is rebuilt.
     *
     * @param {Object} component - the consolidated problems component
     */
    RefreshGlobals: function(component) {
      //reset refresh counts
      component.m_nProcessing = 0;
      component.m_nWaitCursor = 0;
      component.m_nRefreshCount = 0;
    },

    /**
     * Sets whether priority information should be displayed to the user
     *
     * @param {Object} component - the consolidated problems component
     */
    SetViewPriorityPriv: function(component) {
      //hide priority display if all priorities on the diagnoses are 0
      //and modification of priority is disabled
      if (component.m_enableModifyPrioritization == 0) {
        var thisVisitConditions = component.m_loadedConditions.DATA.THIS_VISIT;
        var maxPriority = CERN_CV_O1.getMaxPriority(component, thisVisitConditions);
        if (maxPriority > 0) {
          component.m_viewPriorities = 1;
        }
      } else {
        component.m_viewPriorities = 1;
      }
    },

    /**
     * Builds a string that contains all html markup and builds it using MP_Util.Doc.FinalizeComponent
     * Calls all methods needed to attach addition events and handly and resizing
     *
     * @param {Object} component - the consolidated problems component
     * @param {Object} conditionData - the reply structure from mp_get_conditions.prg
     */
    RenderComponent: function(component, conditionData) {
      try {
        CERN_CV_O1.RefreshGlobals(component);
        MP_Util.Doc.HideHovers();
        component.setEditMode(true);

        var iconPath = "";
        iconPath = component.m_compObject.criterion.static_content.replace(/%5C/g, "\\");
        iconPath = iconPath.replace(/%20/g, " ");
        component.m_iconPath = iconPath;
        var secHTMLArray = [];
        var secHTML = "";
        var countText = "";
        var cvSetObject = conditionData.SETTINGS;
        var cvDataObject = conditionData.DATA;
        var optMenuCV = "";
        var compID = component.m_compObject.cvCompId;
        component.m_loadedConditions = conditionData;
        CERN_CV_O1.SetViewPriorityPriv(component);
        CERN_CV_O1.SetEarlyTransitionEnabled(component);

        if (cvSetObject) {
          component.m_canAddConditionFlag = cvSetObject.CAN_ADD_CONDITION_FLAG;
          component.nkpProblemId = cvDataObject.NKPPROBLEMID;
          component.nkpNomenclatureId = cvDataObject.NKPNOMENCLATUREID;
          component.nNKPCanUpdate = cvDataObject.NKPCANUPDATE;
          component.nNKPCanView = cvDataObject.NKPCANVIEW;
          component.nNKPChronicProbExist = cvDataObject.NKPACTIVEINACTIVEPROBEXIST;
          component.m_canAddConditionPref = cvSetObject.CAN_ADD_CONDITION_PREF;
          component.m_historicalCheckbox = cvSetObject.HISTORICAL_CHECKBOX_PREF;
          component.m_diagnosisTargetVocabCode = cvSetObject.DIAGNOSIS_TARGET_VOCAB_CD;

          for (var i = 0; i < cvDataObject.NKPNOMENQUAL.length; i++) {
            component.nkpNomenArray.push(cvDataObject.NKPNOMENQUAL[i].NKPNOMENCLATUREID);
          }

          // Determine what text to show for the current classification
          secHTMLArray.push("<div class='cv-ControlDiv sub-title-disp' id='cvClassificationDiv", compID, "'>");
          secHTMLArray.push("<span class='cv-ClassFilterLabel'>", i18n.discernabu.consolproblem_o1.CLASSIFICATION, ":</span>");
          secHTMLArray.push("<span class='cvClassFilterSpan' id='cvClassFilterSpan", compID, "'></span></div>");
          secHTMLArray.push("<div class ='cv-ControlDiv' id ='cvControlsDiv", compID, "'>");
          secHTMLArray.push("<span class='cv-AddLabel'>", i18n.discernabu.consolproblem_o1.ADD_NEW_AS, "</span>");
          secHTMLArray.push("<span class='cvAddTypeSpan' id='cvAddTypeSpan", compID, "'></span>");
          secHTMLArray.push("<span class='cv-SelectList' id='cvSelectListId", compID, "'></span>");
          // Auto Suggest control with a vertical scroll bar for more than 10 items.
          secHTMLArray.push(CERN_CV_O1.CreateAutoSuggestBoxHtml(component));
          secHTMLArray.push("</div>");
          secHTMLArray.push("<br/>");
          secHTMLArray.push('<table id="cvTable', compID, '" class="cv-table">');
          secHTMLArray.push('<thead><tr>');
          secHTMLArray.push('<td class="cv-column1 cv-header"><span id="priorityHeader', compID, '">', (component.m_viewPriorities) ? i18n.discernabu.consolproblem_o1.PRIORITY_HEADER : '',
            '</span></td>');
          secHTMLArray.push('<td class="cv-column2 cv-header"><span>', i18n.discernabu.consolproblem_o1.PROBLEM_HEADER, '</span></td>');
          secHTMLArray.push('<td class="cv-column3 cv-header"></td>');
          secHTMLArray.push('</tr></thead>');
          secHTMLArray.push(CERN_CV_O1.buildTableSection(component, cvDataObject.THIS_VISIT, "TV", iconPath));
          secHTMLArray.push(CERN_CV_O1.buildDropZoneSection(component, "TV"));
          secHTMLArray.push(CERN_CV_O1.buildTableSection(component, cvDataObject.ACTIVE, "AC", iconPath));
          secHTMLArray.push(CERN_CV_O1.buildTableSection(component, cvDataObject.HISTORICAL, "HX", iconPath));

          secHTMLArray.push('</table>');
          secHTML = secHTMLArray.join("");
          MP_Util.Doc.FinalizeComponent(secHTML, component, countText);

          component.m_compObject.iSearchTypeFlag = cvSetObject.CONDITION_SEARCH_TYPE_FLAG;
          CERN_CV_O1.CPAddAutoSuggestControl(component, CERN_CV_O1.Debounce(CERN_CV_O1.searchNomenclature), CERN_CV_O1.addCondition, CERN_CV_O1.CreateSuggestionLine);


          //to set up onchange event for historical section Checkbox
          var histCheckBox = $("#HXHD" + compID).find("input");
          var checkBoxStatus = (component.m_historicalCheckbox != 0) ? true : false;
          CERN_CV_O1.historyCheckboxChange(checkBoxStatus, component, cvDataObject.HISTORICAL, compID);
          $(histCheckBox).click(function() {
            //  ---- Code for Timers
            var slaTimer = MP_Util.CreateTimer("CAP:MPG_Consolidated_Problems_01_Show_Previous_Visits");
            if (slaTimer) {
              slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
              slaTimer.Stop();
            }
            //  ---- Code for Timers
            CERN_CV_O1.historyCheckboxChange(this.checked, component, cvDataObject.HISTORICAL, compID);
            //write prefs to the database
            CERN_CV_O1.WritePreferences(component.getPrefJson(), "CONSOLIDATED_PREFS", true, compID);
          });
          //to set up onchange event for active section Checkbox
          var ncpCheckBox = $("#cv" + compID + "NKPCont");
          component.nkpEventProcessing = false;
          $(ncpCheckBox).click(function() {
            CERN_CV_O1.ncpCheckboxChange(component, compID);
          });

          //Add code for classification filter menu
          CERN_CV_O1.cvBuildClassificationMenu(compID, cvSetObject.CLASS_VIEW_FILTER_FLAG);
          //Show the classification filter menu in cv
          var classificationDiv = $("#cvClassificationDiv" + compID);
          if ($(classificationDiv).hasClass("cv-ControlDiv")) {
            $(classificationDiv).removeClass("cv-ControlDiv");
            $(classificationDiv).addClass("cv-ClassificationDiv");
          }

          //Determine whether to show the control menus in cv
          var controlsDiv = $('#cvControlsDiv' + compID);
          if (component.m_canAddConditionFlag > 0) {
            $(controlsDiv).removeClass();
            $(controlsDiv).addClass('sec-content');
            $(controlsDiv).css('overflow', 'hidden');
          }

          //If this is the initial load after a refresh, proceed to initialize the control
          if (component.m_cvAddAsType == -1) {
            //Initialize the add type and build the options in the condition add dropdown
            switch (component.m_canAddConditionFlag) {
              case 1:
                component.m_cvAddAsType = 0;
                component.m_canAddConditionPref = 0;
                break;
              case 3:
                if (component.m_canAddConditionPref == -1) {
                  component.m_cvAddAsType = 0;
                  component.m_canAddConditionPref = 0;
                } else {
                  component.m_cvAddAsType = component.m_canAddConditionPref;
                }
                break;
              case 2:
                if (component.m_canAddConditionPref < 2) {
                  component.m_cvAddAsType = 2;
                  component.m_canAddConditionPref = 2;
                } else {
                  component.m_cvAddAsType = component.m_canAddConditionPref;
                }
                break;
            }
            if (component.m_canAddConditionFlag > 0) {
              CERN_CV_O1.cvBuildConditionAddOptions(component.m_cvAddAsType, compID);
            }
          } else if (component.m_canAddConditionFlag > 0) {
            CERN_CV_O1.cvBuildConditionAddOptions(component.m_cvAddAsType, compID);
          }
          //Clear the new condition nomenclature, as we don't want to change the display after a refresh
          component.m_nNewConditionType = -1;
          component.m_dNewConditionNomenclatureId = 0.0;
          component.m_nNewConditionIndx = 0.0;
        }

        //Reset the consolidated view menu if it exists
        var mnuConsolidatedViewMenu = $("#moreOptCV" + compID);
        if (mnuConsolidatedViewMenu) {
          //Hide the drop down menu, since the browser would still display it
          optMenuCV = $("#moreOptMenuCV" + compID);
          $(optMenuCV).addClass("menu-hide");

          //Remove the menu
          $(mnuConsolidatedViewMenu).remove();
        }

        //add code for menu
        component.addMenuOption("mnuCVRemoveDiagnoses", "mnuCVRemoveDiagnoses" + compID, i18n.discernabu.consolproblem_o1.REMOVE_FROM.replace("{0}", component.m_visitLabelDisplay), true);
        component.addMenuOption("mnuCVResolve", "mnuCVResolve" + compID, i18n.discernabu.consolproblem_o1.RESOLVE, true);
        component.addMenuOption("mnuCVInactive", "mnuCVInactive" + compID, i18n.discernabu.consolproblem_o1.INACTIVATE, true);
        component.addMenuOption("mnuCVCancel", "mnuCVCancel" + compID, i18n.discernabu.consolproblem_o1.CANCEL, true);
        component.addMenuOption("mnuCVMoveToActive", "mnuCVMoveToActive" + compID, i18n.discernabu.consolproblem_o1.MOVE_TO.replace("{0}", component.m_activeLabelDisplay), true);
        component.addMenuOption("mnuCVMoveToThisVisit", "mnuCVMoveToThisVisit" + compID, i18n.discernabu.consolproblem_o1.MOVE_TO.replace("{0}", component.m_visitLabelDisplay), true);

        component.createMenu();

        //Add Info Button click events
        if (component.hasInfoButton()) {
          var cvInfoIcons = $("#cvContent" + compID).find(".info-icon");
          $.each(cvInfoIcons, function() {
            $(this).mousedown(function(e) {
              var errorModal = null;
              var closeButton = null;
              var error_name = null;
              var error_msg = null;
              //Get the values needed for the API
              var patId = $(this).attr("data-patId");
              var encId = $(this).attr("data-encId");
              var section = $(this).attr("data-section");
              var priCriteriaCd = $(this).attr("data-priCriteriaCd");
              var nomenId = $(this).attr("data-nomId");
              var searchNomId = $(this).attr("data-sNomId");
              if (section === "TV") {
                var description = $(this).attr("data-diagDesc");
              } else {
                if (section === "AC" || section === "HX") {
                  var description = $(this).attr("data-probDesc");
                }
              }
              try {
                var launchInfoBtnApp = window.external.DiscernObjectFactory("INFOBUTTONLINK");
                if (launchInfoBtnApp) {
                  launchInfoBtnApp.SetInfoButtonData(parseFloat(patId), parseFloat(encId), parseFloat(priCriteriaCd), 1, 2);
                  if (section === "AC" || section === "HX") {
                    launchInfoBtnApp.AddProblem(parseFloat(nomenId), parseFloat(searchNomId), description);
                  } else {
                    if (section === "TV") {
                      launchInfoBtnApp.AddDiagnosis(parseFloat(nomenId), parseFloat(searchNomId), description);
                    }
                  }
                  launchInfoBtnApp.LaunchInfoButton();
                }
              } catch (err) {
                if (err.name) {
                  if (err.message) {
                    error_name = err.name;
                    error_msg = err.message;
                  } else {
                    error_name = err.name;
                    error_msg = i18n.discernabu.INFO_BUTTON_ERROR_MSG;
                  }
                } else {
                  error_name = err.name;
                  error_msg = i18n.discernabu.INFO_BUTTON_ERROR_MSG;
                }
                MP_Util.LogError(error_name + error_msg);
                errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
                if (!errorModal) {
                  errorModal = MP_Util.generateModalDialogBody("errorModal", "error", error_msg, i18n.discernabu.INFO_BUTTON_ERROR_ACTION);
                  errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
                  //Create and add the close button
                  closeButton = new ModalButton("closeButton");
                  closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
                  errorModal.addFooterButton(closeButton);
                }
                MP_ModalDialog.updateModalDialogObject(errorModal);
                MP_ModalDialog.showModalDialog("errorModal");
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
            });
          });
        }

        //Highlighting the row's background in #FFFCE1 color when default and search vocbulary codes are different. 
        $('.cv-flag-chronic').closest("tr").addClass('cv-row-hover');

        //Add consolidated view row clicked events and hover events
        var cvRows = $('#cv' + compID).find('.cv-info');
        for (var i = 0, l = cvRows.length; i < l; i++) {
          var nameColumn = $(cvRows[i]).find("td").filter(".cv-column2").first();
          CERN_CV_O1.initDragTargetMouseEvents(nameColumn, 1, compID);

          //Add modify icons to the rows when default and search vocbulary codes are different.
          if ($(cvRows[i]).find(".cv-flag-chronic").length != 0) {
            CERN_CV_O1.cvDisplayModifyIcon(cvRows[i], compID);
          }

          if (component.getModifyInd()) {
            $(cvRows[i]).mouseenter(function(e) {
              if ($(this).find(".cv-flag-chronic").length == 0) {
                CERN_CV_O1.cvDisplayModifyIcon(this, compID);
              }
              CERN_CV_O1.cvDisplayRowIcons(this, compID);
            });

            $(cvRows[i]).mouseleave(function(e) {
              //Hide modify icon to the row only when default and search vocbulary codes are same.
              if ($(this).find(".cv-flag-chronic").length == 0) {
                CERN_CV_O1.cvHideModifyIcon(this, compID);
              }
              CERN_CV_O1.cvHideRowIcons(this, compID);
            });
          } else {
            $(cvRows[i]).mouseenter(function(e) {
              CERN_CV_O1.cvDisplayRowIcons(this, compID);
            });

            $(cvRows[i]).mouseleave(function(e) {
              CERN_CV_O1.cvHideRowIcons(this, compID);
            });
          }
        }

        var cvEmptyRows = $('#cv' + compID).find('.cv-empty');
        for (var i = 0, l = cvEmptyRows.length; i < l; i++) {
          var nameColumn = $(cvEmptyRows[i]).find("td").first();
          CERN_CV_O1.initDragTargetMouseEvents(nameColumn, 3, compID);
        }


        //Add modify icon clicked events if code supported
        if (component.getModifyInd()) {
          var cvModIcons = $("#cvContent" + compID).find(".cv-edit-img");
          $.each(cvModIcons, function() {
            $(this).click(function(e) {
              CERN_CV_O1.cvLaunchModifyDlg(this, compID);
            });
          });
        }
        // Add Dx Assistant Click Events.
        var cvSpecIcons = $("#cvContent" + compID).find(".cv-spec-img");
        $.each(cvSpecIcons, function() {
          $(this).click(function(e) {
            if (component.m_enableDxAssistant) {
              if ($(this).hasClass('cv-unspecified')) {
                CERN_CV_O1.cvLaunchDiagnosisAssistantDlg(this, CERN_CV_O1.getUnspecifiedDiagnoses(compID), compID);
              } else {
                CERN_CV_O1.cvLaunchDiagnosisAssistantDlg(this, null, compID);
              }
            }
          });
        });

        CERN_CV_O1.initMouseTracking(compID);
        var TVHeaderElement = $("#TVHD" + compID).find('td').first();
        CERN_CV_O1.initDragTargetMouseEvents(TVHeaderElement, 2, compID);
        // initialize the comment icon hovers system similar to the main hover system
        CERN_CV_O1.initializeCommentHovers(component, cvRows);
        CERN_CV_O1.initializeDisplayHovers(component, cvRows);
        // If Dx Assistant is enabled then Initilize hovers for the specificity icons.
        if (component.m_enableDxAssistant) {
          CERN_CV_O1.initializeSpecificityHovers(component, cvRows);
        }
        if (component.m_enableModifyPrioritization) {
          CERN_CV_O1.initDropZoneMouseEvents(compID);
          CERN_CV_O1.initInputEvents(compID);
          //Initialize the drag and drop functionality
          CERN_CV_O1.initializeDropDownMenuHovers(component, cvRows);
        }
        //Add the expand/collapse functionality for the section headers that applies
        CERN_CV_O1.initializeToggle("cvHistoricalToggle" + compID, "HXSEC", component.m_bHistoricalExpanded, compID);
        CERN_CV_O1.initializeToggle("cvActiveToggle" + compID, "ACSEC", component.m_bActiveExpanded, compID);
        CERN_CV_O1.sizeTable(compID);
        CERN_CV_O1.defaultExpandComments(component);
        CERN_CV_O1.resizeCommentDisplay(compID);
      } catch (err) {
        alert(i18n.ERROR_OCCURED + ": " + err.description);
        throw (err);
      } finally {
        component.setEditMode(false);
      }
    },

    /**
     * Initializes the display of the draggable table hover
     * and adds selected rows to draggable table
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    dragRowsEvent: function(compID) {
      CERN_CV_O1.setDragHvrHorizontalLoc(compID);
      var jqSelectedRows = CERN_CV_O1.getSelectedRows("cv" + compID);
      CERN_CV_O1.addDragHvrRows(jqSelectedRows, compID);
    },

    /**
     * Returns the selected rows as an array
     *
     * @param {numeric} elementID - the id of the consolidated problems component
     * @return {jqArray) Jquery array of row elements that are selected
     */
    getSelectedRows: function(elementID) {
      var selectedRows = $('#' + elementID).find('.cv-selected');
      return selectedRows;
    },

    /**
     * Returns the root DOM element of consolidated problems
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {Element) The root DOM element of consolidated problems
     */
    getRootNode: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      return component.getRootComponentNode();
    },

    /**
     * Sets a global variable that contains the horizontal starting coordinate
     * for the drag hover
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    setDragHvrHorizontalLoc: function(compID) {
      CERN_CV_O1.createDragHvr(compID);
      var component = getCompObjByStringOrIntId(compID);
      var cvTableWidth = $('#cvTable' + compID).width();
      //need to set the correct left offset so the drag hover lines up
      var compElement = $('#cv' + compID);
      var componentOffset = $('#cv' + compID).offset();
      var componentWidth = $('#cv' + compID).outerWidth();

      component.m_cvDragHvrLeft = componentOffset.left + componentWidth - cvTableWidth - 2;
    },

    /**
     * Creates the drag hover if it is not created
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    createDragHvr: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      if (!component.m_cvDragHvr) {
        var draggableTableDiv = $('<div id="dragHelper' + compID + '" class="cv-drag-helper"><table id="dragTable' + compID + '"></table></div>');
        var dragTable = draggableTableDiv.find('table');
        var element = CERN_CV_O1.getRootNode(compID);
        $(element).append(draggableTableDiv);
        component.m_cvDragHvr = draggableTableDiv.get(0);
      }
    },

    /**
     * Add rows to the drag hover and sizes the drag hover
     *
     * @param {Array} elements - list of row elements
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    addDragHvrRows: function(elements, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var table = $(component.m_cvDragHvr).find('table');
      for (var i = 0; i < elements.length; i++) {
        CERN_CV_O1.addDragHvrRow(table, elements[i]);
      }
      CERN_CV_O1.sizeDragHvr($('#cvTable' + compID), table);
    },

    /**
     * Adds single row to the drag hover
     *
     * @param {Array} elements - List of row elements
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    addDragHvrRow: function(table, element) {
      var elementId = $(element).attr('id');
      var exists = $(table).find("#" + elementId + "drag");
      if (exists.length < 1) {
        var row = CERN_CV_O1.convertRowToDragDisplay(element);
        $(table).append(row);
      }
    },

    /**
     * Updates the id of any row added to the drag hover
     * to ensure ids are unique
     *
     * @param {Element} element - A row element created from .clone
     */
    updateIdForDrag: function(element) {
      //ids need to be unique
      var sId = $(element).attr('id');
      sId = sId + 'drag';
      $(element).attr('id', sId);
    },

    /**
     * Clones row element and styles the clone for use in the drag hover.
     *
     * @param {Element} element - A row element
     */
    convertRowToDragDisplay: function(element) {
      var dragRow = $(element).clone();
      var dragTDs = $(dragRow).children();
      dragTDs.last().remove();
      CERN_CV_O1.updateIdForDrag(dragRow);
      $(dragRow).removeClass("cv-row-even");
      $(dragRow).removeClass("cv-row-odd");
      $(dragRow).removeClass('cv-selected');

      return dragRow;
    },

    /**
     * Sets the width of the drag hover to match the width of an original row element
     *
     * @param {Element} original - An original row element
     * @param {Element} dragTable - The table element inside the dragHvr
     */
    sizeDragHvr: function(original, dragTable) {
      $(dragTable).width($(original).width());
    },

    /**
     * Empties and hides the drag hover
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    clearDragHvr: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      if (component.m_cvDragHvr) {
        var jqDragRow = $(component.m_cvDragHvr);
        jqDragRow.css("display", "none");
        var table = jqDragRow.find('table');
        $(table).empty();
      }
    },

    /**
     * Attaches event to the document that will stop the dragging action
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    dragMouseUpEvent: function(compID) {
      $(document).mouseup(function(e) {
        var component = getCompObjByStringOrIntId(compID);
        CERN_CV_O1.clearDragHvr(compID);
        component.m_isDragging = false;
        $("#cv" + compID).find(".cv-drag-line").removeClass("cv-drag-line");
        component.m_dragTarget = "";
      });
    },

    /**
     * Attaches event to the document that will stop the dragging action
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    clearDragPriorities: function(compID) {
      var rows = $("#cv" + compID).find("#dragTable" + compID).find("tr");
      rows.each(function(idx) {
        var input = $(rows[idx]).find("input");
        $(input).val("");
      });
    },

    /**
     * Updates the priorities in the drag hover
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {IPVCollectionPtr} rePrioritizedDiagnoses - A collection of win32 ClinicalDiagnosis objects
     * @param {boolean} clear - if true, rePrioritizedDiagnoses is ignored and priorities are cleared
     */
    updateDragPriorities: function(compID, rePrioritizedDiagnoses, clear) {
      if (!rePrioritizedDiagnoses && clear == false) {
        return;
      }
      try {
        var rows = $("#dragTable" + compID).find("tr");
        rows.each(function(idx) {
          var jqRow = $(rows[idx]);
          var rowID = jqRow.attr("id");
          if (rowID == "") {
            return true; //jquery continue
          }
          var jqInput = jqRow.find("input");
          jqInput.css('color', '#0391EB'); //change color of number on drag
          if (clear) {
            jqInput.val("");
            return true; //jquery continue
          }
          var mostRecentDx = CERN_CV_O1.getMostRecentEncntrDiagnosis(0, CERN_CV_O1.getConditionIndex(rowID, compID), compID);
          if (mostRecentDx) {
            var newDxCnt = rePrioritizedDiagnoses.GetCount();

            for (newDxIdx = 0; newDxIdx < newDxCnt; newDxIdx++) {
              var newDxObj = window.external.DiscernObjectFactory("CLINICALDIAGNOSIS");
              newDxObj = rePrioritizedDiagnoses.GetItem(newDxIdx);
              if (newDxObj) {
                if (mostRecentDx.DIAGNOSIS_ID == newDxObj.DiagnosisId) {
                  jqInput.val(newDxObj.ClinicalPriority);
                }
              }
            }
          }
        })
      } catch (err) {
        //suppress dll errors
      }
    },

    /**
     * Updates the priorities in the drag hover
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    initInputEvents: function(compID) {
      var inputs = $("#cv" + compID).find(".cv-priority-input");
      $(inputs).blur(function(e) {
        var row = CERN_CV_O1.getParentRowFromElement(this);
        var oldPriority = 0;
        var condition = CERN_CV_O1.getConditionsByRowIds([row.id], compID);
        if (condition.length > 0) {
          var diagnosis = CERN_CV_O1.getMostRecentDiagnosisFromCondition(condition[0]);
          if (diagnosis) {
            oldPriority = diagnosis.CLINICAL_PRIORITY;
            if (oldPriority == "") {
              oldPriority = 0;
            }
          }
        }
        var priorityVal = $(this).val();
        if (priorityVal == oldPriority) {
          return;
        }
        if ((priorityVal == "" && oldPriority > 0) || (/^-?\d+$/.test(priorityVal))) { //check to make sure only a number was entered
          CERN_CV_O1.inlineModifyDiagnosisPriority(this, compID);
        } else {
          $(this).val("");
        }
      });
    },

    /**
     * Attaches the events to the diagnolly striped drop zone region.
     * handles mouse over highlighting
     * handles releasing drag over the drop zone.
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    initDropZoneMouseEvents: function(compID) {
      var element = $("#TVDropZone" + compID);
      $(element).mouseover(function(e) {
        var component = getCompObjByStringOrIntId(compID);
        if (component.m_isDragging == true) {
          $(this).find('.cv-drop-zone').first().css("background-image", "url('" + component.m_iconPath + "/images/tile-diagonal-hover.png')");
          var startSectionId = CERN_CV_O1.getSectionIdFromRow(component.m_dragStart);
          var stopSectionId = CERN_CV_O1.getSectionIdFromRow(component.m_dragStop);
          if (stopSectionId == 'TV' && startSectionId == 'TV') {
            if (component.m_enableModifyPrioritization) {
              component.m_reprioritizedDiagnoses = CERN_CV_O1.reprioritizeDiagnosesByIDs(0, true, compID);
              CERN_CV_O1.updateDragPriorities(compID, component.m_reprioritizedDiagnoses, true);
            }
          }
        }
      });
      $(element).mouseout(function(e) {
        var component = getCompObjByStringOrIntId(compID);
        $(this).find('.cv-drop-zone').first().css("background-image", "url('" + component.m_iconPath + "/images/tile-diagonal-gray.png')");
      });

      $(element).mouseup(function(e) {
        var component = getCompObjByStringOrIntId(compID);
        $(this).find('.cv-drop-zone').first().css("background-image", "url('" + component.m_iconPath + "/images/tile-diagonal-gray.png')");
        if (!e) {
          e = window.event;
        }
        if (1 == (e.keyCode || e.which)) {
          component.m_dragStop = $(this).attr('id');
          var startSectionId = CERN_CV_O1.getSectionIdFromRow(component.m_dragStart);
          var stopSectionId = CERN_CV_O1.getSectionIdFromRow(component.m_dragStop);
          if (component.m_isDragging == true) {
            if (stopSectionId == 'TV' && startSectionId == 'TV') {
              if (component.m_enableModifyPrioritization && component.m_reprioritizedDiagnoses) {
                CERN_CV_O1.modifyReprioritizedDiagnoses(component.m_reprioritizedDiagnoses, compID);
              }
            } else if (stopSectionId == 'TV' && startSectionId == 'HX') {
              CERN_CV_O1.moveCondition(compID, 1, 0);
            } else if (stopSectionId == 'TV' && startSectionId == 'AC') {
              CERN_CV_O1.moveCondition(compID, 0, 0);
            } else if (stopSectionId == 'AC' && (startSectionId == 'HX' || startSectionId == 'TV')) {
              CERN_CV_O1.moveCondition(compID, 2, 0);
            }
            component.m_isDragging = false;
          }
          CERN_CV_O1.clearDragHvr(compID);
          CERN_CV_O1.selectSectionRow(this, compID, true);
          if (component.m_dragTarget) {
            component.m_dragTarget = "";
          }
        }
      });
    },

    /**
     * Finds the insert position to add new conditions being dragged
     * New conditions will be added right after the existing prioritized conditions
     * and have a priority that is one higher than the current highest priority
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {string} sectionId - the id of the section
     */
    getAddConditionInsertRow: function(compID, sectionId) {
      var component = getCompObjByStringOrIntId(compID);
      var jqElement;
      if (sectionId == 'TV' && component.m_enableModifyPrioritization) {
        var inputs = $("#cv" + compID).find(".cv-priority-input");
        for (var i = 0, l = inputs.length; i < l; i++) {
          var value = parseInt($(inputs[i]).val());
          if (!isNaN(value) && value > 0) {
            jqElement = $(inputs[i]);
          }
        }
      }

      if (!jqElement) {
        jqElement = $("#" + sectionId + "HDROW" + compID);
      }

      return CERN_CV_O1.getParentRowFromElement(jqElement);
    },

    /**
     * Searches for NKP is the selected items. If found prevent dragging.
     *
     * @param {Element} element - the element events are attached to
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    IsDragAllowed: function(element, compID) {
      var isNKPPresent = false;
      var jqCvSelRows = CERN_CV_O1.getSelectedRows("cv" + compID);
      var cvSelLen = jqCvSelRows.length;

      if (cvSelLen > 1) {
        var component = getCompObjByStringOrIntId(compID);
        // Loop through the rows, and search for NKP
        for (var i = 0; i < cvSelLen; i++) {
          var selectedRowId = jqCvSelRows[i].id;
          var dNomenclatureId = parseFloat(selectedRowId.substring(2));
          if (CERN_CV_O1.IsNKP(dNomenclatureId, component)) {
            isNKPPresent = true;
            break;
          }
        }
      } else {
        isNKPPresent = $(element).hasClass("cv-nkp");
      }

      return isNKPPresent;
    },

    /**
     * Attaches the drag target events to the passed in element
     * handles start of drag with mouse down
     * handles end of drag with mouse up on the target element
     * handles mouseover to update drag insert line and hover priorities
     *
     * @param {Element} element - the element events are attached to
     * @param {numeric} elementType - the type of the element
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    initDragTargetMouseEvents: function(element, elementType, compID) {
      /* elementType
       * 1 = draggable row
       * 2 = header row
       * 3 = emtpy row
       */

      //prevents text in the drag row from being selectable to avoid accidentally highlighting text while trying to drag
      $(element).attr("unselectable", "on");
      $(element).bind('selectstart', function(event) {
        event.preventDefault();
      });

      // only draggable rows need mouse down which starts the hover
      if (elementType == 1) {
        $(element).mousedown(function(e) {
          if (1 == e.which) {
            CERN_CV_O1.clearActiveHover(compID);
            CERN_CV_O1.clearDragHvr(compID);
            CERN_CV_O1.selectSectionRow(this, compID, false);
            // Preventing dragging for NKAP condition row
            if (!CERN_CV_O1.IsDragAllowed(element, compID)) {
              CERN_CV_O1.dragRowsEvent(compID);
              var component = getCompObjByStringOrIntId(compID);
              $(component.m_cvDragHvr).css("display", "inline");
              CERN_CV_O1.dragMouseUpEvent(compID);
              component.m_dragStart = $(CERN_CV_O1.getParentRowFromElement(this)).attr('id');
              component.m_isDragging = true;
              $(component).addClass('cv-mouse-drag');
            }
          }
        });
      }

      //Rows that are acceptable drop targets need mouse over to update hover and insert lines.
      if (elementType == 1 || elementType == 2) {
        $(element).parent().mouseover(function(e) {
          var component = getCompObjByStringOrIntId(compID);
          if (component.m_isDragging == true) {
            component.m_dragStop = $(CERN_CV_O1.getParentRowFromElement(this)).attr('id');
            if (component.m_dragStart != component.m_dragStop) {
              var startSectionId = CERN_CV_O1.getSectionIdFromRow(component.m_dragStart);
              var stopSectionId = CERN_CV_O1.getSectionIdFromRow(component.m_dragStop);
              if (stopSectionId == 'TV' && startSectionId == 'TV') {
                if (component.m_enableModifyPrioritization) {
                  var jqRow = $(this);
                  jqRow.addClass("cv-drag-line");
                  component.m_dragTarget = jqRow.get(0);
                  var rowIndex = 0;
                  var bClearPriority = false;
                  if (elementType == 1) {
                    rowIndex = $(component.m_dragTarget).prevAll('.cv-info').length + 1;
                    var parentRow = $(CERN_CV_O1.getParentRowFromElement(this));

                    // Update the condition type and condition index so that the cvRefresh will refresh the Win32 diagnoses collection.
                    var rowID = parentRow.attr('id');
                    var condIdx = -1;
                    condIdx = CERN_CV_O1.getConditionIndex(rowID, compID);
                    component.m_nNewConditionType = 0;
                    component.m_nNewConditionIndx = condIdx;
                    var priority = CERN_CV_O1.getPriorityByRow(parentRow, compID);

                    if (priority <= 0) {
                      bClearPriority = true;
                    }
                  }
                  component.m_reprioritizedDiagnoses = CERN_CV_O1.reprioritizeDiagnosesByIDs(rowIndex, bClearPriority, compID);
                  CERN_CV_O1.updateDragPriorities(compID, component.m_reprioritizedDiagnoses, bClearPriority);
                }
              } else if (stopSectionId == 'TV' && startSectionId == 'HX') {
                var insertRow = CERN_CV_O1.getAddConditionInsertRow(compID, stopSectionId);
                $(insertRow).addClass("cv-drag-line");
              } else if (stopSectionId == 'TV' && startSectionId == 'AC') {
                var insertRow = CERN_CV_O1.getAddConditionInsertRow(compID, stopSectionId);
                $(insertRow).addClass("cv-drag-line");
              } else if (stopSectionId == 'AC' && (startSectionId == 'HX' || startSectionId == 'TV')) {
                var insertRow = CERN_CV_O1.getAddConditionInsertRow(compID, stopSectionId);
                $(insertRow).addClass("cv-drag-line");
                CERN_CV_O1.clearDragPriorities(compID);
              }
            }
          }
        });

        //removes all drag lines when leaving the section containing the drag rows.
        $(element).parent().mouseout(function(e) {
          var component = getCompObjByStringOrIntId(compID);
          if (component.m_isDragging == true) {
            $("#cv" + compID).find('.cv-drag-line').removeClass("cv-drag-line");
            component.m_dragTarget = "";
          }
        });
      }

      //All elements need to end dragging when the mouse is released
      //Different actions occur depending on what sections dragging was started and stopped in
      $(element).mouseup(function(e) {
        var component = getCompObjByStringOrIntId(compID);
        if (!e) {
          e = window.event;
        }
        if (1 == (e.keyCode || e.which)) {
          $("#cv" + compID).find('.cv-drag-line').removeClass("cv-drag-line");
          if (component.m_isDragging == true) {
            component.m_dragStop = $(CERN_CV_O1.getParentRowFromElement(this)).attr('id');
            if (component.m_dragStart != component.m_dragStop) {
              var startSectionId = CERN_CV_O1.getSectionIdFromRow(component.m_dragStart);
              var stopSectionId = CERN_CV_O1.getSectionIdFromRow(component.m_dragStop);
              if (stopSectionId == 'TV' && startSectionId == 'TV') {
                if (component.m_enableModifyPrioritization && component.m_reprioritizedDiagnoses) {
                  CERN_CV_O1.modifyReprioritizedDiagnoses(component.m_reprioritizedDiagnoses, compID);
                }
              } else if (stopSectionId == 'TV' && startSectionId == 'HX') {
                var nextPriority = 0;
                if (component.m_enableModifyPrioritization) {
                  nextPriority = CERN_CV_O1.getNextPriority(compID);
                }
                CERN_CV_O1.moveCondition(compID, 0, nextPriority);
              } else if (stopSectionId == 'TV' && startSectionId == 'AC') {
                //  ---- Code for Timers
                var slaTimer = MP_Util.CreateTimer("CAP:MPG Consolidated Problem Active to This Visit");
                if (slaTimer) {
                  slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
                  slaTimer.Stop();
                }
                //  ---- Code for Timers
                var nextPriority = 0;
                if (component.m_enableModifyPrioritization) {
                  nextPriority = CERN_CV_O1.getNextPriority(compID);
                }
                CERN_CV_O1.moveCondition(compID, 0, nextPriority);
              } else if (stopSectionId == 'AC' && (startSectionId == 'HX' || startSectionId == 'TV')) {
                if (startSectionId == 'HX') {
                  // --- Code for Timers 
                  var slaTimer = MP_Util.CreateTimer("CAP:MPG Consolidated Problem History to Active");
                  if (slaTimer) {
                    slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
                    slaTimer.Stop();
                  }
                  //  ---- Code for Timers
                } else {
                  //  ---- Code for Timers
                  var slaTimer = MP_Util.CreateTimer("CAP:MPG Consolidated Problem This Visit to Active");
                  if (slaTimer) {
                    slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
                    slaTimer.Stop();
                  }
                  //  ---- Code for Timers
                }
                CERN_CV_O1.moveCondition(compID, 2, 0);
              }
            }
            component.m_isDragging = false;
          }
          CERN_CV_O1.clearDragHvr(compID);
          CERN_CV_O1.selectSectionRow(this, compID, true);
          if (component.m_dragTarget) {
            component.m_dragTarget = "";
          }
        }
      });
    },

    /**
     * Handles moving a condition between sections
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {numeric} type - the add condition type
     * @param {numeric} iPriority - the priority that will be assigned to the new condition
     */
    moveCondition: function(compID, type, iPriority) { //dragging from one section to another
      /* Add condition types
       *  0 = New diagnosis
       *  1 = New diagnosis and new active problem
       *   2 = New active problem
       *   3 = New resolved problem
       */
      var nextPriority = iPriority;
      var component = getCompObjByStringOrIntId(compID);
      var jqCvSelRows = CERN_CV_O1.getSelectedRows("cv" + compID);
      var cvSelLen = jqCvSelRows.length;
      if (cvSelLen <= 0) {
        return;
      }

      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);
      component.m_nRefreshCount++;

      for (var i = 0, l = cvSelLen; i < l; i++) {
        //Extract the numeric NomenclatureId.
        var rowId = jqCvSelRows[i].id;
        var dNomenclatureId = 0.0;
        dNomenclatureId = (rowId.substring(2));
        dNomenclatureId = parseFloat(dNomenclatureId.replace(compID, ""));

        //gaps in numbering can occur if individual add calls fail
        if (type == 0 || type == 1) {
          CERN_CV_O1.addConditionWithType(dNomenclatureId, type, 0, compID, nextPriority, CERN_CV_O1.validateCarryForwardForThisVisit(), 1);
        } else {
          CERN_CV_O1.addConditionWithType(dNomenclatureId, type, 0, compID, nextPriority, false, 1);
        }
        if (component.m_enableModifyPrioritization && nextPriority > 0) {
          nextPriority++;
        }
      }

      CERN_CV_O1.refreshConditions(compID);
    },

    /**
     * Returns the sectionId from a given rowId
     *
     * @param {numeric} rowId - the id of the row
     * @return {string} The id of the section
     */
    getSectionIdFromRow: function(rowId) {
      var section = rowId.substring(0, 2);
      return section;
    },

    /**
     * Returns a collection of diagnosis ids for the selected row elements
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {DoubleMap} Win32 DoubleMap object containing a collection of diagnosis ids
     */
    getSelectedDiagnosesIDs: function(compID) {
      var pvDxIdsObj = window.external.DiscernObjectFactory("DOUBLEMAP");
      if (pvDxIdsObj) {
        var jqSelectedRows = CERN_CV_O1.getSelectedRows('cv' + compID);
        var selCnt = jqSelectedRows.length;
        for (var idx = 0; idx < selCnt; idx++) {
          var rowID = jqSelectedRows[idx].id;
          var selDx = CERN_CV_O1.getMostRecentEncntrDiagnosis(0, CERN_CV_O1.getConditionIndex(rowID, compID), compID);
          if (selDx) {
            pvDxIdsObj.Add(selDx.DIAGNOSIS_ID, selDx.DIAGNOSIS_ID);
          }
        }
      }

      return pvDxIdsObj;
    },

    /**
     * Converts a ccl condition struct into a win32 ClinicalDiagnosis object
     *
     * @param {Condition} condition - ccl condition struct from mp_get_conditions
     * @return {ClinicalDiagnosis} Win32 ClinicalDiagnosis object
     */
    populateClinicalDiagnosisObj: function(condition, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var clinicalDiagnosis = null;
      if (condition) {
        var diagnosis = CERN_CV_O1.getMostRecentDiagnosisFromCondition(condition);
        clinicalDiagnosis = window.external.DiscernObjectFactory("CLINICALDIAGNOSIS");
        if (diagnosis && clinicalDiagnosis) {
          clinicalDiagnosis.DiagnosisID = diagnosis.DIAGNOSIS_ID;
          clinicalDiagnosis.DiagnosisGroupID = diagnosis.DIAGNOSIS_ID; // diagnosis.DIAGNOSIS_ID is actually the diagnosis_group from the service.
          clinicalDiagnosis.EncounterID = diagnosis.ENCOUNTER_ID;
		  //DATE will be stored as double value in COM. for example "1899/12/30 00:00:00" will be stored as 0.0 and calculating difference from origin date
		  try {var startDateTime = new Date(1899, 11, 30, 00, 00, 00);
				var begDateTime = new Date();
				if (diagnosis.BEG_EFFECTIVE_DT_TM != undefined) {
					begDateTime.setISO8601(diagnosis.BEG_EFFECTIVE_DT_TM);
					var timeDiff = begDateTime.getTime()-startDateTime.getTime();
					var begEffectiveDtTm = timeDiff/(1000*60*60*24);
				}			
				if (clinicalDiagnosis.BegEffectiveDtTm != undefined) {
					clinicalDiagnosis.BegEffectiveDtTm = begEffectiveDtTm;
				}
			} catch(err){MP_Util.LogJSError(err,this,"consolidatedproblems.js","populateClinicalDiagnosisObj");}

          if (clinicalDiagnosis.ClinicalPriority != undefined) {
            clinicalDiagnosis.ClinicalPriority = diagnosis.CLINICAL_PRIORITY;
          }
          clinicalDiagnosis.DiagnosisDisplay = condition.ANNOTATED_DISPLAY; // clinicalDiagnosis.DiagnosisDisplay is the win32 field for annotated_display.
          //Need to validate OriginatingSourceString exists on the object to prevent crash on pre 2010.02 code lines
          if (clinicalDiagnosis.OriginatingSourceString != undefined) {
            clinicalDiagnosis.OriginatingSourceString = condition.DISPLAY; // condition.DISPLAY is from the source_string.
          }
          //Need to validate OriginatingNomenclatureID exists on the object to prevent crash on pre 2010.02 code lines
          if (clinicalDiagnosis.OriginatingNomenclatureID != undefined && clinicalDiagnosis.OriginatingNomenclatureID == 0) {
            clinicalDiagnosis.OriginatingNomenclatureID = condition.NOMENCLATURE_ID; // condition.NOMENCLATURE_ID is the source Nomenclature Id.
          } 
          //Need to validate TransitionNomenclatureID exists on the object to prevent crash
          if(clinicalDiagnosis.TransitionNomenclatureID != undefined) {
            clinicalDiagnosis.TransitionNomenclatureID = diagnosis.TRANSITION_NOMENCLATURE_ID;
            clinicalDiagnosis.TransitionSourceStr = diagnosis.TRANSITION_DISPLAY;
            clinicalDiagnosis.TransitionSourceIdentifier = diagnosis.TRANSITION_CODE;
          }
          clinicalDiagnosis.NomenclatureID = diagnosis.TARGET_NOMENCLATURE_ID; // diagnosis.TARGET_NOMENCLATURE_ID is the target Nomenclature Id.
        }
      }
      return clinicalDiagnosis;
    },

    /**
     * Returns a collection of ClinicalDiagnosis objects
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {PVCollection} Win32 PVCollection object containing a collection of Win32 ClinicalDiagnosis objects
     */
    getThisVisitDiagnosisCol: function(compID) {
      var conditions = CERN_CV_O1.getThisVisitConditions(compID);
      var pvDxColObj = window.external.DiscernObjectFactory("PVCOLLECTION");
      if (conditions && pvDxColObj) {
        for (var i = 0, length = conditions.length; i < length; i++) {
          var condition = conditions[i];
          var clinicalDiagnosis = CERN_CV_O1.populateClinicalDiagnosisObj(condition, compID);
          if (clinicalDiagnosis) {
            pvDxColObj.Add(clinicalDiagnosis);
          }
        }
      }

      return pvDxColObj;
    },

    /**
     * Calls the into win32 DLL and returns a list of reprioritized diagnosis
     * after either inserting or removing the selected diagnoses
     *
     * @param {numeric} toPos - the zero based insert location
     * @param {boolean} bRemove - if true, selected diagnosis will have their priorities removed instead of being inserted
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {PVCollection} Win32 PVCollection object containing a collection of Win32 ClinicalDiagnosis objects
     */
    reprioritizeDiagnosesByIDs: function(toPos, bRemove, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var rePrioritizedDxCol = null;
      var probDxUtils = component.getProbDxUtilsObject();
      if (probDxUtils) {
        var colDxObj = CERN_CV_O1.getThisVisitDiagnosisCol(compID);
        var mapDxIDsObj = CERN_CV_O1.getSelectedDiagnosesIDs(compID);
        try {
          rePrioritizedDxCol = probDxUtils.ReprioritizeDiagnosesByIds(colDxObj, mapDxIDsObj, toPos, bRemove);
        } catch (err) {
          //suppress dll errors
        }
      }

      return rePrioritizedDxCol;
    },

    /**
     * Calls the into win32 DLL and returns a list of reprioritized diagnosis
     * after setting the new priority of the specified diagnosis
     *
     * @param {numeric} rowID - the id of the row element for a diagnosis
     * @param {numeric} newPriority - the priority being assigned to the diagnosis
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {PVCollection} Win32 PVCollection object containing a collection of Win32 ClinicalDiagnosis objects
     */
    reprioritizeDiagnosesByPriority: function(rowID, newPriority, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var rePrioritizedDxCol = null;
      var probDxUtils = component.getProbDxUtilsObject();
      if (probDxUtils) {
        var colDxObj = CERN_CV_O1.getThisVisitDiagnosisCol(compID);
        var diagnosis = CERN_CV_O1.getMostRecentEncntrDiagnosis(0, CERN_CV_O1.getConditionIndex(rowID, compID), compID);
        if (diagnosis) {
          try {
            rePrioritizedDxCol = probDxUtils.ReprioritizeDiagnosesByPriority(colDxObj, diagnosis.DIAGNOSIS_ID, newPriority);
          } catch (err) {
            //suppress dll errors
          }
        }
      }

      return rePrioritizedDxCol;
    },

    /**
     * Calls the into win32 DLL and returns a list of reprioritized diagnosis
     * after setting the new priority of the specified diagnosis
     *
     * @param {numeric} rowID - the id of the row element for a diagnosis
     * @param {numeric} newPriority - The priority being assigned to the diagnosis
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {PVCollection} Win32 PVCollection object containing a collection of Win32 ClinicalDiagnosis objects
     */
    getThisVisitDiagnosisColRemove: function(arrDxIdsToRemove, compID) {
      var conditions = CERN_CV_O1.getThisVisitConditions(compID);
      var pvDxColObj = window.external.DiscernObjectFactory("PVCOLLECTION");
      if (arrDxIdsToRemove && conditions && pvDxColObj) {
        for (var i = 0, length = conditions.length; i < length; i++) {
          var condition = conditions[i];
          var clinicalDiagnosis = CERN_CV_O1.populateClinicalDiagnosisObj(condition, compID);
          if (clinicalDiagnosis) {
            var clinDxId = clinicalDiagnosis.DiagnosisId;
            var loc = $.inArray(clinDxId, arrDxIdsToRemove);
            if (loc < 0) {
              pvDxColObj.Add(clinicalDiagnosis);
            }
          }
        }
      }

      return pvDxColObj;
    },

    /**
     * Calls the into win32 DLL and returns a list of reprioritized diagnosis
     * while removing the priorities of the specified diagnoses
     *
     * @param {Array} arrDxIdsToRemove - A collection of diagnosis ids that will have their priorities removed
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {PVCollection} Win32 PVCollection object containing a collection of Win32 ClinicalDiagnosis objects
     */
    reprioritizeDiagnosesListForRemove: function(arrDxIdsToRemove, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var rePrioritizedDxCol = null;
      var probDxUtils = component.getProbDxUtilsObject();
      if (probDxUtils) {
        var colDxObj = CERN_CV_O1.getThisVisitDiagnosisColRemove(arrDxIdsToRemove, compID);
        try {
          rePrioritizedDxCol = probDxUtils.ReprioritizeDiagnosesList(colDxObj);
        } catch (err) {
          //suppress dll errors
        }
      }

      return rePrioritizedDxCol;
    },

    /**
     * Attaches mouse events to the component's root node
     * Handles moving the drag hover while dragging
     * Handles ending drag and drop when leaving the component
     * Handles closing priority drop down when clicking outside of the drop down menu
     *
     * @param {Array} arrDxIdsToRemove - A collection of diagnosis ids that will have their priorities removed
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {PVCollection} Win32 PVCollection object containing a collection of Win32 ClinicalDiagnosis objects
     */
    initMouseTracking: function(compID) {

      //moves drag hover and updates any other active hovers
      $(CERN_CV_O1.getRootNode(compID)).mousemove(function(e) {
        var component = getCompObjByStringOrIntId(compID);
        component.m_mousePos = CERN_CV_O1.absoluteCursorPostion();
        if (component.m_cvDragHvr) {
          var currentOffset = $(component.m_cvDragHvr).offset();
          var cvRow = $('#TVSEC' + compID).find('tr').first();
          var cvRowHeight = cvRow.height();
          var dragHeight = $(component.m_cvDragHvr).height();
          $(component.m_cvDragHvr).offset({
            top: component.m_mousePos.Y + 10 + cvRowHeight,
            left: component.m_cvDragHvrLeft
          });
          CERN_CV_O1.updateActiveHover(component);
        }
      });

      //ends dragging and hides priority drop down menu when leaving component
      $(CERN_CV_O1.getRootNode(compID)).mouseleave(function(e) {
        $("#cv" + compID).find(".suggestions").css("display", "none");
        var component = getCompObjByStringOrIntId(compID);
        CERN_CV_O1.clearDragHvr(compID);
        $("#cv" + compID).find(".cv-drag-line").removeClass("cv-drag-line");
        component.m_isDragging = false;
        if (component.m_dragTarget) {
          component.m_dragTarget = "";
        }
        if (component.m_enableModifyPrioritization) {
          $("#cv" + compID).find(".cv-priority-drop-down-menu").css("display", "none");
        }
      });

      var comp = getCompObjByStringOrIntId(compID);
      //hides priority drop down menu when clicking anywhere else in the component
      if (comp.m_enableModifyPrioritization) {
        $(CERN_CV_O1.getRootNode(compID)).mousedown(function(e) {
          var component = getCompObjByStringOrIntId(compID);
          if (component.m_isDropMenu == false) {
            $("#cv" + compID).find(".cv-priority-drop-down-menu").css("display", "none");
          }
        });
      }
    },

    /**
     * Determines the pixel width of a text label
     *
     * @param {string} text - the text to measure
     * @param {string} font - the font to apply to text for measurement
     * @return {numeric} Width of text in pixels
     */
    getTextSize: function(text, font) {
      var font = font || "12px arial";
      var jqDiv = $("<div id='cvFontSize'>" + text + "</div>")
        .css({
          'position': 'aboslute',
          'float': 'left',
          'white-space': 'nowrap',
          'visibility': 'hidden',
          'font': font
        })
        .appendTo($('body'));
      var width = jqDiv.width();
      jqDiv.remove();

      return width;
    },

    /**
     * Sizes the problem table using information that can only be gathered after finanlized component is called
     * First and last column are sized to fit contents, middle column fills up all left over space
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    sizeTable: function(compID) {
      var jqComponent = $("#cv" + compID);
      //size first column
      var width = $("#priorityHeader" + compID).outerWidth();
      var freeTextWidth = 15;

      //Width of first column in this visit
      var tvWidth = 0;
      var component = getCompObjByStringOrIntId(compID);
      if (component.m_enableDxAssistant) {
        var specImg = jqComponent.find(".cv-spec-img").first();
        //If cv-spec-img is empty, use a default buffer
        if (!specImg.outerWidth()) {
          tvWidth += freeTextWidth;
        } else {
          tvWidth += specImg.outerWidth(); // Diagnosis assistant icon
        }
      }
      tvWidth += jqComponent.find(".cv-collapse-div").first().outerWidth(); //comment image width
      tvWidth += jqComponent.find(".cv-priority-drop-down-img").first().outerWidth(); //priority drown down button width 
      tvWidth += jqComponent.find(".cv-priority-drop-down-menu").first().outerWidth();

      tvWidth += 6; //need to add room for the border width when mouseover         
      if (tvWidth > width) {
        width = tvWidth;
      }

      //Width of first column in active
      var acWidth = jqComponent.find(".cv-collapse-div").first().outerWidth();
      acWidth += jqComponent.find(".cv-non-priority").first().outerWidth();
      acWidth += 2; //space for padding
      if (acWidth > width) {
        width = acWidth;
      }

      //Width of first column in historical
      var hWidth = jqComponent.find(".cv-collapse-div").first().outerWidth();
      hWidth += jqComponent.find(".cv-non-priority").first().outerWidth();
      hWidth += 2; //space for padding
      if (hWidth > width) {
        width = hWidth;
      }

      jqComponent.find(".cv-column1").css("width", width + "px");

      //size last column
      width = jqComponent.find(".icon4972").outerWidth();
      width += jqComponent.find(".cv-edit-img").outerWidth();
      width += jqComponent.find(".cv-hand-img").outerWidth();
      jqComponent.find(".cv-column3").css("width", width + "px");
    },

    /**
     * Clears the active hover variable and hides it
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    clearActiveHover: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      if (component.m_cvActiveHvr) {
        $(component.m_cvActiveHvr).css("display", "none");
        component.m_cvActiveHvr = "";
      }
    },

    /**
     * Updates the position of the active hover as the mouse moves
     *
     * @param {CvComponent} component - the consolidated problems object
     */
    updateActiveHover: function(component) {
      if (component.m_cvActiveHvr && component.m_mousePos) {
        //Check if hover will display offscreen, set position relative to mouse accordingly
        if (component.m_mousePos.Y + component.m_cvActiveHvr.height() < $(window).height() - 10) {
          var top_pos = component.m_mousePos.Y + 10;
        } else {
          var top_pos = component.m_mousePos.Y - component.m_cvActiveHvr.height() - 10;
        }

        if (component.m_mousePos.X + component.m_cvActiveHvr.width() < $(window).width() - 10) {
          var left_pos = component.m_mousePos.X + 10;
        } else {
          var left_pos = component.m_mousePos.X - component.m_cvActiveHvr.width() - 10;
        }
        $(component.m_cvActiveHvr).offset({
          top: top_pos,
          left: left_pos
        });
      }
    },

    /**
     * Cycles through row elements and calls method to activate each priority drop down menu
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {Array} cvRows - collection of row elements
     */
    initializeDropDownMenuHovers: function(component, cvRows) {
      for (var i = 0; i < cvRows.length; i++) {
        var jqRow = $(cvRows[i]);
        var dropDownIMG = jqRow.find('.cv-priority-drop-down-img').first();
        var dropDownHVR = jqRow.find('.cv-priority-drop-down-menu').first();
        CERN_CV_O1.initializeDropMenu(dropDownHVR, dropDownIMG, component);
      }
    },

    /**
     * Attaches mouse events to enable priority drop down menu
     *
     * @param {Element} menu - the DOM element that is the drop down menu
     * @param {Element} target - the DOM element that activates the drop down menu
     * @param {CvComponent} component - the consolidated problems object
     */
    initializeDropMenu: function(menu, target, component) {
      var compID = component.m_compObject.cvCompId;
      if (menu && target) {
        var jqTarget = $(target);
        var jqMenu = $(menu);
        //displays the priority drop down menu on mouse up over the drop down button
        jqTarget.mouseup(function(e) {
          var jqMenu = $(menu);
          if (jqMenu.css("display") != "inline") {
            jqMenu.css("display", "inline");
            var jqParentSpan = $(this).parent();
            var locationOffset = jqParentSpan.offset();
            var height = jqParentSpan.height();

            jqMenu.offset({
              top: locationOffset.top + height,
              left: locationOffset.left
            });
            jqMenu.width(jqParentSpan.width());
          } else {
            jqMenu.css("display", "none");
          }
        });
        //hides all existing priority drop downs on mouse down
        jqTarget.mousedown(function(e) {
          $("#cv" + compID).find(".cv-priority-drop-down-menu").css("display", "none");
          CERN_CV_O1.cancelEvent(e);
        });
        //sets global variable to signify that the mouse is over the drop down menu
        jqMenu.mouseenter(function(e) {
          component.m_isDropMenu = true;
        });
        //sets global variable to signify that the mouse is no longer over the drop down menu
        jqMenu.mouseleave(function(e) {
          component.m_isDropMenu = false;
        });

        CERN_CV_O1.initializeMenuClick(component, menu);
      }
    },

    /**
     * Attaches mouse events to enable priority drop down menu clicking and hovering
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {Element} menu - the DOM element that is the drop down menu
     */
    initializeMenuClick: function(component, menu) {
      var rows = $(menu).find('.cv-menu-selectable');
      var compID = component.m_compObject.cvCompId;
      for (var i = 0, l = rows.length; i < l; i++) {
        var jqRow = $(rows[i]);
        //handles clicking an option in the drop down menu
        jqRow.click(function(e) {
          if ($(this).hasClass("cv-menu-current-priority") == false) {
            CERN_CV_O1.dropMenuModifyDiagnosisPriority(this, menu, compID);
          } else {
            $("#cv" + compID).find(".cv-priority-drop-down-menu").css("display", "none");
          }
        });

        //highlights option in drop down menu when hovering over it
        jqRow.mouseenter(function(e) {
          $(this).addClass('cv-priority-drop-down-menu-hover');
        });

        //removes highlight in drop down menu when no longer hover over option
        jqRow.mouseleave(function(e) {
          $(this).removeClass('cv-priority-drop-down-menu-hover');
        });
      }
    },

    /**
     * Cycles through collection of row elements and initializes the hovers
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {Array} cvRows - collection of DOM elements
     */
    initializeCommentHovers: function(component, cvRows) {
      for (var i = 0, l = cvRows.length; i < l; i++) {
        var jqRow = $(cvRows[i]);
        var jqCommentImg = jqRow.find('.icon4972').first();
        var jqCommentHvr = jqRow.find('.cv-comment').first();
        CERN_CV_O1.initializeHover(jqCommentHvr, jqCommentImg, component);
      }
    },
    /**
       Cycles through collection of row elements and initializes the hovers
       *
       * @param {CvComponent} component - the consolidated problems object
       * @param {Array} cvRows - collection of DOM elements
       */
    initializeSpecificityHovers: function(component, cvRows) {
      for (var i = 0, l = cvRows.length; i < l; i++) {
        var jqRow = $(cvRows[i]);
        var jqSpecificityImg = jqRow.find('.cv-spec-img').first();
        var jqSpecificityHvr = jqRow.find('.cv-spec-img.hover').first();
        CERN_CV_O1.initializeHover(jqSpecificityHvr, jqSpecificityImg, component);
      }
    },
    /**
     * Cycles through collection of row elements and initializes the hovers
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {Array} cvRows - collection of DOM elements
     */
    initializeDisplayHovers: function(component, cvRows) {
      for (var i = 0, l = cvRows.length; i < l; i++) {
        var jqRow = $(cvRows[i]);
        var jqDisplayTd = jqRow.find('.cv-column2').first();
        var jqDisplayHvr = jqRow.find('.hvr').first();
        CERN_CV_O1.initializeHover(jqDisplayHvr, jqDisplayTd, component);
      }
    },

    /**
     * Adds events to target element to enable hovers
     *
     * @param {Element} hvr - the hover DOM element
     * @param {Element} target - the target DOM element
     * @param {CvComponent} component - the consolidated problems object
     */
    initializeHover: function(hvr, target, component) {
      if (hvr && target) {
        var compID = component.m_compObject.cvCompId;
        var jqTarget = $(target);
        //display hover when mouse moves over target
        jqTarget.mouseenter(function(e) {
          if (component.m_isDragging == false) {
            CERN_CV_O1.clearActiveHover(compID);
            component.m_cvActiveHvr = hvr;
            //append active hover to body so that it displays in front of neighboring components
            $(component.m_cvActiveHvr).appendTo($('body'));
            $(hvr).css("display", "inline");
            var jqRow = $(CERN_CV_O1.getParentRowFromElement(target));
            if (jqRow.hasClass("cv-selected") == false) {
              if ($(jqRow).find(".cv-flag-chronic").length == 0) {
                jqRow.addClass("cv-row-hover");
              }
            }
            //Update the position of the hover to avoid initially being 
            //displayed off the screen
            CERN_CV_O1.updateActiveHover(component);
          }
        });
        //hide hover when mouse leaves target
        jqTarget.mouseleave(function(e) {
          if (component.m_isDragging == false) {
            $(hvr).css("display", "none");
            var jqRow = $(CERN_CV_O1.getParentRowFromElement(target));
            $(component.m_cvActiveHvr).appendTo(jqRow.find(".cv-column2"));
            CERN_CV_O1.clearActiveHover(compID);
            if ($(jqRow).find(".cv-flag-chronic").length == 0) {
              jqRow.removeClass("cv-row-hover");
            }
          }
        });
      }
    },

    /**
     * Get the largest priority from a collection of conditions
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {Array} oConditions - list of conditions populated by mp_get_conditions
     * @return {numeric} The integer value of the highest valued priority from passed in conditions
     */
    getMaxPriority: function(component, oConditions) {
      var highestPriority = 0;
      var compID = component.m_compObject.cvCompId;
      for (var i = 0, l = oConditions.length; i < l; i++) {
        var mostRecentDiagnosis = CERN_CV_O1.getMostRecentEncntrDiagnosis(0, oConditions[i].CONDITION_INDEX, compID);

        if (mostRecentDiagnosis && mostRecentDiagnosis.CLINICAL_PRIORITY > highestPriority) {
          highestPriority = mostRecentDiagnosis.CLINICAL_PRIORITY;
        }
      }

      return highestPriority;
    },

    /**
     * Returns the next available priority to be used
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {numeric} The integer value of the next available priority
     */
    getNextPriority: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      var thisVisitConditions = component.m_loadedConditions.DATA.THIS_VISIT;
      var maxPriority = CERN_CV_O1.getMaxPriority(component, thisVisitConditions);

      return maxPriority + 1;

    },

    /**
     * Return the priority drop down menu html for a condition row
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {Condition} condition - ccl condition struct from mp_get_conditions
     * @param {numeric} currentPriority - the current priority of the passed in condition
     * @param {Array} oConditions - list of conditions populated by mp_get_conditions
     * @return {string} HTML code for priority drop down menu
     */
    buildDropDownMenu: function(component, oCondition, currentPriority, oConditions) {
      var compID = component.m_compObject.cvCompId;
      var nextPriority = CERN_CV_O1.getNextPriority(compID);
      var htmlArray = [];
      htmlArray.push('<div class="cv-priority-drop-down-menu">');
      htmlArray.push('<table>');
      htmlArray.push('<tbody>');

      /* remove option */
      htmlArray.push('<tr class="cv-menu-selectable">');
      htmlArray.push('<td unselectable="on">');
      htmlArray.push('--');
      htmlArray.push('</td>');
      htmlArray.push('</tr>');

      /* number options */
      for (var i = 1, l = nextPriority; i <= l; i++) {

        if (i === currentPriority) {
          htmlArray.push('<tr class="cv-menu-selectable cv-menu-current-priority">');
        } else {
          htmlArray.push('<tr class="cv-menu-selectable">');
        }
        htmlArray.push('<td unselectable="on">');
        htmlArray.push(i);
        htmlArray.push('</td>');
        htmlArray.push('</tr>');
      }
      htmlArray.push('</tbody>');
      htmlArray.push('</table>');
      htmlArray.push('</div>');

      return htmlArray.join('');
    },
    /**
     * Return the details hover html for a condition row
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {Condition} oCondition - ccl condition struct from mp_get_conditions
     * @param {string} conditionRowID - the row id for the condition row
     * @param  {string} conditionHeaderID - the Header id for the condition row.
     * @return {string} HTML code for details hover
     */
    buildDetailsHover: function(component, oCondition, conditionRowID, conditionHeaderID) {
      var htmlArray = [];
      var compID = component.m_compObject.cvCompId;
      htmlArray.push('<div id="' + conditionRowID + 'DISPHVR' + compID + '" class="hvr hover">');
      htmlArray.push('<span class="cv-det-name">' + i18n.discernabu.consolproblem_o1.CONDITION + ': ' + oCondition.DISPLAY);
      if (oCondition.NOMENCLATURE_ID == 0) {
        htmlArray.push(' (free text)');
      }
      htmlArray.push('</span><br/>');
      for (var j = 0, l = oCondition.DIAGNOSES.length; j < l; j++) {
        if (oCondition.NOMENCLATURE_ID != 0) {
          htmlArray.push('<span class="cv-det-name">' + component.m_visitLabel + " - " + oCondition.DIAGNOSES[j].TARGET_VOCAB_DISPLAY + " " + i18n.discernabu.consolproblem_o1.TARGET_DISPLAY + ': ' + oCondition.DIAGNOSES[j].TARGET_DISPLAY + " " + "(" + oCondition.DIAGNOSES[j].TARGET_CODE + ")");
          htmlArray.push('</span><br/>');
          if(conditionHeaderID =="TV" && oCondition.DIAGNOSES[j].TRANSITION_VOCAB_DISPLAY != "") {
            htmlArray.push('<span class="cv-det-name">' + component.m_visitLabel + " - " + oCondition.DIAGNOSES[j].TRANSITION_VOCAB_DISPLAY + " " + i18n.discernabu.consolproblem_o1.TARGET_DISPLAY + ": " + oCondition.DIAGNOSES[j].TRANSITION_DISPLAY + " " + "(" + oCondition.DIAGNOSES[j].TRANSITION_CODE + ")");
            htmlArray.push("</span><br/>");
          }
        }
      }

      for (var j = 0, l = oCondition.PROBLEMS.length; j < l; j++) {
        if (oCondition.NOMENCLATURE_ID != 0) {
          if (conditionHeaderID == "HX") {
            htmlArray.push('<span class="cv-det-name">' + component.m_historicalLabel + ' - ' + oCondition.PROBLEMS[j].TARGET_VOCAB_DISPLAY + " " + i18n.discernabu.consolproblem_o1.TARGET_DISPLAY + ': ' + oCondition.PROBLEMS[j].TARGET_DISPLAY + " " + "(" + oCondition.PROBLEMS[j].TARGET_CODE + ")");
          } else {
            htmlArray.push('<span class="cv-det-name">' + component.m_activeLabel + ' - ' + oCondition.PROBLEMS[j].TARGET_VOCAB_DISPLAY + " " + i18n.discernabu.consolproblem_o1.TARGET_DISPLAY + ': ' + oCondition.PROBLEMS[j].TARGET_DISPLAY + " " + "(" + oCondition.PROBLEMS[j].TARGET_CODE + ")");
          }
        }
        if (oCondition.NOMENCLATURE_ID != 0) {
          htmlArray.push('</span><br/>');
        }
        htmlArray.push('<span class="cv-det-name">' + i18n.discernabu.consolproblem_o1.PROBLEM_STATUS + ': ' + oCondition.PROBLEMS[j].LIFECYCLE_STATUS_DISP);
        if (oCondition.PROBLEMS[j].CLASSIFICATION_DISPLAY !== "") {
          htmlArray.push(' ' + i18n.discernabu.consolproblem_o1.CLASSIFICATION + ': ' + oCondition.PROBLEMS[j].CLASSIFICATION_DISPLAY);
        }
        htmlArray.push('</span><br/>');
        if (oCondition.PROBLEMS[j].ONSET_PRECISION_FLAG > 0 && oCondition.PROBLEMS[j].ONSET_DATE != "") {
          var dateTime = new Date();
          dateTime.setISO8601(oCondition.PROBLEMS[j].ONSET_DATE);

          switch (oCondition.PROBLEMS[j].ONSET_PRECISION_FLAG) {
            case 1:
              onsetDate = dateTime.format(dateFormat.masks.shortDate2);
              break;
            case 2:
              onsetDate = dateTime.format(dateFormat.masks.shortDate4);
              break;
            case 3:
              onsetDate = dateTime.format(dateFormat.masks.shortDate5);
              break;
          }
          htmlArray.push('<span class="cv-det-name">' + i18n.discernabu.consolproblem_o1.ONSET_DATE + ': ' + onsetDate);
          htmlArray.push('</span><br/>');
        }
      }

      htmlArray.push('<span class="cv-det-name">', i18n.discernabu.consolproblem_o1.RECENT_VISITS, ': </span><br/>');
      var diagLength = oCondition.DIAGNOSES.length;
      if (diagLength === 0) {
        htmlArray.push('<span class="cv-det-name">--</span><br/>');
      } else {
        var diagLeftOverCnt = 0;
        if (diagLength > 5) {
          diagLeftOverCnt = diagLength - 5;
          diagLength = 5;
        }

        for (var j = 0, l = diagLength; j < l; j++) {
          var dateTime = new Date();
          var diagDate = "";
          if (oCondition.DIAGNOSES[j].DIAGNOSIS_DATE !== "") {
            var df = component.getDateFormatter();
            dateTime.setISO8601(oCondition.DIAGNOSES[j].DIAGNOSIS_DATE);
            diagDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
          }
          htmlArray.push('<span class="cv-dx-text">', diagDate, ' </span>');

          if (oCondition.DIAGNOSES[j].CLASSIFICATION_DISPLAY !== "") {
            htmlArray.push('<span class="cv-det-name">', i18n.discernabu.consolproblem_o1.CLASSIFICATION, ': ',
              oCondition.DIAGNOSES[j].CLASSIFICATION_DISPLAY, '</span><br/>');
          }
        }

        if (diagLeftOverCnt > 0) {
          htmlArray.push('<span class="cv-dx-text">', diagLeftOverCnt, ' more</span>');
        }
      }
      htmlArray.push('</div>');

      return htmlArray.join("");
    },

    /**
     * Return the comment hover html for a condition row
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {Condition} oCondition - ccl condition struct from mp_get_conditions
     * @param {string} conditionRowID - the row id for the condition row
     * @return {string} HTML code for comment hover
     */
    buildCommentHover: function(component, oCondition, conditionRowID) {
      var htmlArray = [];
      var compID = component.m_compObject.cvCompId;

      // Below, we will add the 3 most recent comments to the hover
      var commentCnt = oCondition.COMMENTS.length;
      var indx = (commentCnt > 3) ? 3 : commentCnt;
      var commentLength = 0;
      var charLimit = 600;
      var breakComment = false;
      var dateTime = new Date();
      var commentDate = "";
      var df = component.getDateFormatter();

      if (indx > 0) {
        htmlArray.push('<div id="' + conditionRowID + 'COMHVR' + compID + '" class="cv-comment hover"><span class="cv-det-name">' + i18n.discernabu.consolproblem_o1.COMMENT + ':</span><br/>');

        for (var j = 0; j < indx; j++) {
          var oComments = oCondition.COMMENTS[j];
          //Handling the escape characters of Java Script.
          var sComment = oComments.TEXT.split("&").join("&amp;");
          sComment = sComment.split("<").join("&lt;");
          sComment = sComment.replace(/\r\n|\r|\n/g, '<br />');

          if ((commentLength + sComment.length) > charLimit) {
            // We have exceeded the allowed number of characters for out tooltip
            sComment = sComment.substring(0, (charLimit - commentLength));
            breakComment = true;
          }

          if (oComments.COMMENT_DT_TM.substring(0, 7) == sComment.substring(0, 7) || oComments.COMMENT_DT_TM.substring(1, 8) == sComment.substring(0, 7)) {
            htmlArray.push('<span class="cv-det-name">', sComment, '</span><br/>');
          } else {
            htmlArray.push('<span class="cv-det-name">');
            //COMMENT_DATE is the ISO date from the backend.  COMMENT_DT_TM is the display formatted date.
            //We are using the mpage formatter instead of the displayed date from the backend so we can show
            //a short date instead of a full date and time.
            if (oComments.COMMENT_DATE != "") {
              dateTime.setISO8601(oComments.COMMENT_DATE);
              commentDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
              htmlArray.push(commentDate, ' - ');
            }
            htmlArray.push(oComments.AUTHOR_NAME, ': ', sComment, '</span><br/>');
          }

          commentLength = commentLength + sComment.length;
          if (breakComment) {
            break;
          }
        }

        // If the comment is trancated or there are more than 3 comments, display more option
        if (breakComment || commentCnt > 3) {
          htmlArray.push('<span class="cv-det-name">more...</span>');
        }

        htmlArray.push('</div>');
      }

      return htmlArray.join("");
    },

    /**
     * Return the specificity hover for the Specified diagnosis.
     *
     * @param {component} component - the consolidated problems object.
     * @param {Condition} oCondition - ccl condition struct from mp_get_conditions
     * @param {string} conditionRowID - the row id for the condition row
     * @return {string} HTML code for specificity Icon hover
     */
    buildSpecificityHover: function(component, oCondition, conditionRowID, iconFlag) {
      var htmlArray = [];
      var compID = component.m_compObject.cvCompId;
      var hoverDisplay = (iconFlag) ? i18n.discernabu.consolproblem_o1.SPECIFIC : i18n.discernabu.consolproblem_o1.UNSPECIFIC;
      htmlArray.push('<div id="' + conditionRowID + 'DISPHVR' + compID + '" class="cv-spec-img hover">' + hoverDisplay + '<br/>');
      htmlArray.push('</div>');
      return htmlArray.join("");
    },

    /**
     * Return the drop zone html for the passed in section
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {string} sectionId - the section id for the section to have a drop zone added to it
     * @return {string} HTML code for the drop zone
     */
    buildDropZoneSection: function(component, sectionId) {
      var htmlArray = [];
      var compID = component.m_compObject.cvCompId;

      htmlArray.push('<tbody id="' + sectionId + 'DropZoneSEC' + compID + '">');
      htmlArray.push('<tr id="' + sectionId + 'DropZone' + compID + '"><td colspan="3" class="cv-drop-zone" style="background-image: url(' + component.m_iconPath + '/images/tile-diagonal-gray.png)" unselectable="on"></td></tr>');
      htmlArray.push('<tr><td class="cv-drop-zone-spacer" colspan="3"></td></tr>');
      htmlArray.push('</tbody>');
      return htmlArray.join("");
    },

    /**
     * Returns a collection of conditions from all sections
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {Array} Collection of conditions
     */
    getHistoricalConditions: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      var conditions = [];
      var secHistorical = component.m_loadedConditions.DATA.HISTORICAL;

      $.merge(conditions, CERN_CV_O1.getConditionsBySectionList(secHistorical));

      return conditions;
    },

    /**
     * Return the table section html for the passed in table section
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {Section} sectionList - ccl section struct from mp_get_conditions
     * @param {string} conditionHeaderID - the header id for the section
     * @param {string} iconPath - the path to the icon folder
     * @return {string} HTML code for the table section
     */
    buildTableSection: function(component, sectionList, conditionHeaderID, iconPath) {
      var htmlArray = [];
      var compID = component.m_compObject.cvCompId;
      var infoClass = "";
      var dNomenId = 0.0;
      var dPriCriteriaCd = 0.0;

      //Determine if Info Button should be included
      if (component.hasInfoButton() && component.isInfoButtonEnabled()) {
        infoClass = "info-icon";
      } else {
        infoClass = "info-icon hidden";
      }

      if (conditionHeaderID === "TV") {
        CERN_CV_O1.PopulateDiagnosesNomenclatureSpecificity(sectionList, compID);
      }

      htmlArray.push('<tbody id="' + conditionHeaderID + 'HD' + compID + '" class="sub-sec-hd">');
      htmlArray.push('<tr id="' + conditionHeaderID + 'HDROW' + compID + '" class="cv-no-drag-line"><td colspan="3" class="" unselectable="on">' + CERN_CV_O1.buildSectionHeader(component, conditionHeaderID, sectionList) + '</td></tr></tbody>');
      htmlArray.push('<tbody id="' + conditionHeaderID + 'SEC' + compID + '">');
      if (sectionList && sectionList.length > 0) {
        for (var i = 0, l = sectionList.length; i < l; i++) {
          oCondition = sectionList[i];
          var zebraStripeClass = (i % 2) ? " cv-row-even" : " cv-row-odd";

          var conditionRowID = conditionHeaderID + oCondition.NOMENCLATURE_ID + "IDX" + oCondition.CONDITION_INDEX + "UNIQ" + compID;
          var dOrigNomenId = parseFloat(conditionRowID.substring(2));
          if (conditionHeaderID === "TV") {
            dNomenId = parseFloat(oCondition.DIAGNOSES[0].DESCRIPTION_NOMEN_ID);
            dPriCriteriaCd = parseFloat(oCondition.DIAGNOSES[0].PRIMARY_CRITERIA_CD);
          }
          if (conditionHeaderID === "AC") {
            dNomenId = parseFloat(oCondition.PROBLEMS[0].DESCRIPTION_NOMEN_ID);
            dPriCriteriaCd = parseFloat(oCondition.PROBLEMS[0].PRIMARY_CRITERIA_CD);
          }
          if (conditionHeaderID === "HX") {
            if (typeof oCondition.PROBLEMS[0] != "undefined") {
              dNomenId = parseFloat(oCondition.PROBLEMS[0].DESCRIPTION_NOMEN_ID);
              dPriCriteriaCd = parseFloat(oCondition.PROBLEMS[0].PRIMARY_CRITERIA_CD);
            } else {
              dNomenId = parseFloat(oCondition.DIAGNOSES[0].DESCRIPTION_NOMEN_ID);
              dPriCriteriaCd = parseFloat(oCondition.DIAGNOSES[0].PRIMARY_CRITERIA_CD);
            }
          }
          htmlArray.push('<tr class="cv-info cv-no-drag-line' + zebraStripeClass + '" id="' + conditionRowID + '">');
          htmlArray.push('<td class="cv-column1" unselectable="on">');
          var isNKP = CERN_CV_O1.IsNKP(oCondition.NOMENCLATURE_ID, component);
          if (isNKP == false) { //Not an NKP            
            if ((conditionHeaderID == "TV")) {
              var diagnosisAssistantObj = window.external.DiscernObjectFactory("DIAGNOSISASSISTANT");
              //Check to make sure Dx Assistant dll exists and preferences set from bedrock.
              if (diagnosisAssistantObj && component.m_enableDxAssistant) {
                var diagnosis = CERN_CV_O1.getMostRecentDiagnosisFromCondition(oCondition);
                // Check if Object exists inside Specificity Map.
                if(diagnosis && diagnosis.DIAGNOSIS_ID != 0 && diagnosis.DIAGNOSIS_ID in component.m_specificityMap) {
                  var specified = component.m_specificityMap[diagnosis.DIAGNOSIS_ID] > 0;
                  var specClass = specified ? 'cv-specified' : 'cv-unspecified';
                  htmlArray.push('<img id="' + conditionRowID + "SPEC" + compID + '" class="cv-spec-img ' + specClass + '" src="', iconPath, '/images/transparent.png"/>');
                  htmlArray.push(CERN_CV_O1.buildSpecificityHover(component, oCondition, conditionRowID, specified));
                }
                //Otherwise the diagnosis is free text or can't be specified
                else {
                  // Adding extra blank spaces for free text or not specified problems.
                  htmlArray.push('<div id="' + conditionRowID + 'DHVR' + compID + '" class="free text padding" style="padding:5px 9px">' + "" + '<br/> </div>');
                }
              }
            }
            htmlArray.push(CERN_CV_O1.buildPriorityColumnDisplay(component, oCondition, sectionList, conditionHeaderID));
          }
          htmlArray.push('</td>');
          var tdClass = "cv-column2";
          if (isNKP) {
            tdClass += " cv-nkp";
          }

          //If the diagnosis or problem is free text then do not show the info button.
          if (dOrigNomenId === 0 || dNomenId === 0) {
            infoClass = "";
          }

          var invalidChronic_start = "";
          var invalidChronic_end = "";
          //Determine if this problem needs to be colored
          if (this.isFlagged(component, oCondition, conditionHeaderID, isNKP)) {
            invalidChronic_start = '<span class="cv-flag-chronic">';
            invalidChronic_end = '</span>';
          }
          htmlArray.push('<td class="' + tdClass + '" unselectable="on"><span data-patId="', component.m_compObject.criterion.person_id, '" data-encId="', component.m_compObject.criterion.encntr_id, '" data-nomId="', dNomenId, '" data-sNomId="', dOrigNomenId, '" data-probDesc="', oCondition.DISPLAY, '" data-diagDesc="', oCondition.DISPLAY, '" data-section="', conditionHeaderID, '" data-priCriteriaCd="', dPriCriteriaCd, '" class="', infoClass, '" id="infoIcon', compID, '">&nbsp;</span>' + invalidChronic_start + CERN_CV_O1.buildConditionDisplay(component, conditionHeaderID, oCondition) + invalidChronic_end + CERN_CV_O1.buildDetailsHover(component, oCondition, conditionRowID, conditionHeaderID) + '</td>');
          htmlArray.push('<td class="cv-column3" unselectable="on">');
          htmlArray.push('<img id="' + conditionRowID + "HAND" + compID + '" class="cv-hand-img" src="', iconPath, '/images/transparent.png"/>');
          if (isNKP == false) { //Not an NKP
            //Find total comments for this condition. Push total comments in to array and use
            //index of array to manage which conditions have X amount of comments.
            var tvCommentCnt = oCondition.COMMENTS.length;
            if (tvCommentCnt > 0) {
              htmlArray.push('<img class="icon4972" id="' + conditionRowID + "COM" + compID + '" src="', iconPath, '/images/transparent.png"/>');
              htmlArray.push(CERN_CV_O1.buildCommentHover(component, oCondition, conditionRowID));
            }
            if (component.getModifyInd()) {
              htmlArray.push('<img id="' + conditionRowID + "MOD" + compID + '" class="cv-edit-img cv-hidden" src="', iconPath, '/images/transparent.png"/>');
            }
          }
          htmlArray.push('</td>');
          htmlArray.push('</tr>');
          if (component.m_allowComments == 1) {
            var uniqueRow = conditionHeaderID + oCondition.CONDITION_INDEX; //section + row number
            htmlArray.push('<tr id="' + uniqueRow + 'commentRow' + compID + '" class="cv-closed cv-comment-row"><td/><td colspan=\'3\'>');
            htmlArray.push(CERN_CV_O1.buildCommentDisplay(component, oCondition, oCondition.CONDITION_INDEX, conditionHeaderID));
            htmlArray.push('</td></tr>');
          }
        }
      } else {
        //Build "No Results to display and NKAP button
        if (conditionHeaderID == "AC") {
          htmlArray.push('<tr id="' + conditionHeaderID + "EMPTY" + compID + '" class="cv-empty">');
          htmlArray.push('<td colspan="2"><span class="cv-noresult">' + i18n.discernabu.consolproblem_o1.NO_RESULTS_TO_DISPLAY + "</span></td>");

          htmlArray.push('<td class="cv-column3 " unselectable="on">');
          htmlArray.push('</td>');
          htmlArray.push('</tr>');
        } else {
          htmlArray.push('<tr id="' + conditionHeaderID + 'EMPTY' + compID + '" class="cv-empty"><td colspan="3">&nbsp;--&nbsp;</td></tr>');
        }
      }
      htmlArray.push('</tbody>');
      return htmlArray.join("");
    },

    /**
     * Return true or false as to whether or not the problem should be coloured according to bedrock filter and other rules clearly defined in the function
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {struct} oCondition - the current struct being looked at from the section
     * @param {string} conditionHeaderID - the header id for the section
     * @param {boolean} isNKP - whether or not there are NKP
     * @return {boolean} HTML code for the table section header
     */
    isFlagged: function(component, oCondition, conditionHeaderID, isNKP) {
      //Default search vocab must be defined
      if (component.m_defaultSearchVocab <= 0)
        return false;
      //If this condition is not active or historic then don't flag it
      if (conditionHeaderID !== "AC" && conditionHeaderID !== "HX")
        return false;
      //If this is not a problem then don't flag it and if this condition is Pregnancy then don't flag it
      if (oCondition.PROBLEMS.length == 0 || oCondition.PROBLEMS[0].PROBLEM_TYPE_FLAG == 2)
        return false;
      //If there are NKP then dont flag anything
      if (isNKP)
        return false;
      switch (component.getMU2State()) {
        //In this case, the filter was not defined in bedrock, so no flagging will be done, or off was selected in bedrock
        case 0:
          return false;
          //In this case, if the search vocab is different from the default search vocab assigned in bedrock, this problem should be flagged
        case 1:
          //If this is a free text, at this point in the code we want to flag this problem because we know getMU2State is defined and is not defaulted to off
          if (oCondition.SEARCH_VOCAB_CD === 0)
            return true;
          if (oCondition.SEARCH_VOCAB_CD != component.m_defaultSearchVocab) //When  component.m_defaultSearchVocab not defined, don't flag anything
            return true;
          return false;
          //In this case, if either the source vocab or target vocab are one of the following, don't flag the problem: HLI, IMO, SNOMED, MAYO
        case 2:
          //If this is a free text, at this point in the code we want to flag this problem because we know getMU2State is defined and is not defaulted to off
          if (oCondition.SEARCH_VOCAB_CD === 0)
            return true;
          var problemTargetVocabCd = oCondition.PROBLEMS[0].TARGET_VOCAB_CD;
          var problemSearchVocabCd = oCondition.SEARCH_VOCAB_CD;
          var validSourceVocabArray = component.m_loadedConditions.DATA.VALID_SOURCE_VOCAB_CDS;
          if (validSourceVocabArray === undefined || validSourceVocabArray == null)
            return false;
          //if the source (aka search in this case) or target vocab is either IMO, HLI, SNOMEDCT, or MAYO, then don't flag the problem
          for (var i = 0; i < validSourceVocabArray.length; i++) {
            if (problemSearchVocabCd === validSourceVocabArray[i].VOCAB_CD || problemTargetVocabCd === validSourceVocabArray[i].VOCAB_CD)
              return false;
          }
          //If none of the above if statements in this case are true, that means that the problem source and target vocabs are not any of the 4 listed above, the problem should be flagged
          return true;
          //A value other than 1,2,3 or 0 was returned from bedrock.  Any other value is not valid and no flagging should be done.
        default:
          return false;
      }
    },

    /**
     * Return the section header html for the passed in table section
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {string} conditionHeaderID - the header id for the section
     * @param {Section} sectionList - ccl section struct from mp_get_conditions
     * @return {string} HTML code for the table section header
     */
    buildSectionHeader: function(component, conditionHeaderID, sectionList) {
      var htmlArray = [];
      var sectionDisplayLabel = "";
      var sectionToggleId = "";
      var isExpanded = true;
      var isEmpty = (sectionList && sectionList.length > 0) ? false : true;
      var sectionCount = sectionList ? " (" + sectionList.length + ")" : "";
      var compID = component.m_compObject.cvCompId;

      switch (conditionHeaderID) {
        case "TV":
          sectionDisplayLabel = component.m_visitLabelDisplay;
          break;
        case "AC":
          sectionDisplayLabel = component.m_activeLabelDisplay;
          sectionToggleId = "cvActiveToggle" + compID;
          isExpanded = component.m_bActiveExpanded;
          break;
        case "HX":
          sectionDisplayLabel = component.m_historicalLabelDisplay;
          sectionToggleId = "cvHistoricalToggle" + compID;
          isExpanded = component.m_bHistoricalExpanded;
          break;
      }

      if (sectionToggleId != "" && !isEmpty) {
        htmlArray.push('<span id="' + sectionToggleId + '" title="' + i18n.HIDE_SECTION + '" class="cv-collapse cv-middle" unselectable="on"><img src="', component.m_iconPath, '/images/5323_expanded_16.png"/></span>');
      }

      var headerTextClass = (isEmpty) ? "cv-section-header-empty" : "sub-sec-title cv-section-header";
      var countTextClass = (isEmpty) ? "cv-section-count-empty" : "sub-sec-title cv-section-count";
      htmlArray.push('<span unselectable="on" class="cv-middle ' + headerTextClass + '">' + sectionDisplayLabel + '</span><span class="' + countTextClass + '">' + sectionCount + '</span>');
      if (conditionHeaderID == "HX") {
        htmlArray.push('<span class="cv-hist-checkbox-span"><input class="cv-hist-checkbox" type="checkbox" ');
        if (component.m_historicalCheckbox != 0) {
          htmlArray.push('checked="true" ');
        }
        htmlArray.push('name="historyPreviousVisit"> ' + i18n.discernabu.consolproblem_o1.SHOW_PREVIOUS_VISIT + '</span>');
      }

      if (conditionHeaderID == "AC" && component.nNKPCanUpdate == 1 && component.nNKPChronicProbExist != 1) {
        htmlArray.push("<span id='cv", compID, "NKPCont' class='cv-nkp-cont'>");

        var conditions = CERN_CV_O1.getActiveConditions(compID);
        var chronicProblemRecorded = false;

        for (var i = 0, l = conditions.length; i < l; i++) {
          if (conditions[i].NOMENCLATURE_ID == component.nkpNomenclatureId) {
            chronicProblemRecorded = true;
            break;
          }
        }

        if (chronicProblemRecorded) {
          htmlArray.push("<div id='cv", compID, "chkbx' class='cv-chkbx cv-chkbx-selected'></div><span unselectable='on' class='cv-nkp-text'>", i18n.discernabu.consolproblem_o1.NO_ACTIVE_PROBLEMS, "</span>");
        } else {
          htmlArray.push("<div id='cv", compID, "chkbx' class='cv-chkbx cv-chkbx-deselected'></div><span unselectable='on' class='cv-nkp-text cv-nkp-rec'>", i18n.discernabu.consolproblem_o2.RECORD_NO_CHRONIC_PROBLEMS, "</span>");
        }
        htmlArray.push("</span>");
      }
      return htmlArray.join("");
    },

    /**
     * Executes when the no chronic problems section checkbox changes
     *
     * @param {CvComponent} component - the consolidated problems object
     * @return {string} HTML code for the table section header
     */
    ncpCheckboxChange: function(component, compID) {
      if (component.nNKPCanUpdate == 1) {
        if (!component.nkpEventProcessing) { //Prevents errors when the user rapidly clicks the checkbox.

          var jqChkBx = $("#cv" + compID + "chkbx");

          //Check 'state' of checkbox by class
          if (jqChkBx.hasClass("cv-chkbx-selected")) {
            component.nkpEventProcessing = true;
            CERN_CV_O1.cancelNKP(component);
          } else if (jqChkBx.hasClass("cv-chkbx-deselected") && component.nkpNomenclatureId > 0) {
            component.nkpEventProcessing = true;
            CERN_CV_O1.addNKAP(component);
          }
        } else {
          return;
        }

      } else {
        alert(i18n.discernabu.consolproblem_o2.NO_PRIVS_MSG);
      }
    },

    /**
     * Executes when the historical section checkbox changes and it hides the previous encounter diagnosis when checkbox unchecked
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {Boolean} checked - checked status of the checkbox
     * @param {Section} sectionList - ccl section struct from mp_get_conditions
     * @return {string} HTML code for the table section header
     */
    historyCheckboxChange: function(checked, component, sectionList, compID) {
      var oCondition;
      var conditionRowID;
      var sectionCount = $("#HXHD" + compID).find(".cv-section-count");
      var itemCnt = sectionList.length;
      if (!checked) {
        component.m_historicalCheckbox = 0;
        for (var i = 0, l = sectionList.length; i < l; i++) {
          oCondition = sectionList[i];
          conditionRowID = "#HX" + oCondition.NOMENCLATURE_ID + "IDX" + oCondition.CONDITION_INDEX + "UNIQ" + compID;
          if (oCondition.DIAGNOSES.length != 0) {
            if (oCondition.PROBLEMS.length == 0) {
              $(conditionRowID).addClass("hide");
              itemCnt--;
            }
          }
        }
        $(sectionCount).text("(" + itemCnt + ")");
      } else {
        component.m_historicalCheckbox = 1;
        for (var i = 0, l = sectionList.length; i < l; i++) {
          oCondition = sectionList[i];
          conditionRowID = "#HX" + oCondition.NOMENCLATURE_ID + "IDX" + oCondition.CONDITION_INDEX + "UNIQ" + compID;
          $(conditionRowID).removeClass("hide");
          $(sectionCount).text("(" + itemCnt + ")");
        }
      }
      if (itemCnt == 0) {
        $("#cvHistoricalToggle" + compID).addClass("hide");
      } else {
        $("#cvHistoricalToggle" + compID).removeClass("hide");
      }
    },

    /**
     * Return the condition display string
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {string} conditionHeaderID - the header id for the section
     * @param {Condition} oCondition - ccl condition struct from mp_get_conditions
     * @return {string} Condition display string
     */
    buildConditionDisplay: function(component, conditionHeaderID, oCondition) {
      var sConditionDisplay = "";
      var sIndicator = "";
      var conditionNameDisplay;
      if (component.m_showAnnotatedDisplay) {
        conditionNameDisplay = oCondition.ANNOTATED_DISPLAY;
      } else {
        conditionNameDisplay = oCondition.DISPLAY;
      }

      switch (conditionHeaderID) {
        case "TV":
          if ((component.m_nNewConditionType === 0 || component.m_nNewConditionType === 1) && ((component.m_dNewConditionNomenclatureId > 0.0 && component.m_dNewConditionNomenclatureId == oCondition.NOMENCLATURE_ID) || (component.m_dNewConditionNomenclatureId === 0.0 && component.m_nNewConditionIndx == oCondition.CONDITION_INDEX))) {
            sIndicator = "*";
          }
          sConditionDisplay = sIndicator + conditionNameDisplay;
          // Display HTML as plain text.
          sConditionDisplay = sConditionDisplay.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          if (oCondition.ICD9DISPLAY) {
            sConditionDisplay += ' <span class="cv-gray-detail">(' + oCondition.ICD9DISPLAY + ')</span>';
          }
          break;
        case "AC":
          if ((component.m_nNewConditionType === 1 || component.m_nNewConditionType === 2) && ((component.m_dNewConditionNomenclatureId > 0.0 && component.m_dNewConditionNomenclatureId == oCondition.NOMENCLATURE_ID) || (component.m_dNewConditionNomenclatureId === 0.0 && component.m_nNewConditionIndx == oCondition.CONDITION_INDEX))) {
            sIndicator = "*";
          }
          sConditionDisplay = sIndicator + conditionNameDisplay;
          // Display HTML as plain text.
          sConditionDisplay = sConditionDisplay.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          if (oCondition.PROBLEMS[0].LIFECYCLE_STATUS_MEAN == "INACTIVE") {
            sConditionDisplay += ' <span class="cv-gray-detail">(' + oCondition.PROBLEMS[0].LIFECYCLE_STATUS_DISP + ')</span>';
          }
          break;
        case "HX":
          if (component.m_nNewConditionType === 3 && ((component.m_dNewConditionNomenclatureId > 0.0 && component.m_dNewConditionNomenclatureId == oCondition.NOMENCLATURE_ID) || (component.m_dNewConditionNomenclatureId === 0.0 && component.m_nNewConditionIndx == oCondition.CONDITION_INDEX))) {
            sIndicator = "*";
          }
          sConditionDisplay = sIndicator + conditionNameDisplay;
          // Display HTML as plain text.
          sConditionDisplay = sConditionDisplay.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          break;
      }
      // Display HTML as plain text.
      return sConditionDisplay;
    },

    /**
     * Return the clinical priority display string
     *
     * @param {numeric} clinical_priority - the clinical priority
     * @return {string} Clinical priority display string
     */
    getClinicalPriorityDisplay: function(clinical_priority) {
      if (clinical_priority < 1) {
        return "";
      }

      return clinical_priority;
    },

    /**
     * Return the priority column display HTML
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {Condition} oCondition - ccl condition struct from mp_get_conditions
     * @param {Array} arSectionConditions - ccl section struct from mp_get_conditions
     * @param {string} conditionHeaderID - the header id for the section
     
     * @return {string} Priority column display HTML
     */
    buildPriorityColumnDisplay: function(component, oCondition, arSectionConditions, conditionHeaderID) {
      var htmlArray = [];
      var compID = component.m_compObject.cvCompId;

      var mostRecentDiagnosis = CERN_CV_O1.getMostRecentEncntrDiagnosis(0, oCondition.CONDITION_INDEX, compID);

      if (component.m_allowComments == 1) {
        htmlArray.push(CERN_CV_O1.buildCommentToggleButton(compID, conditionHeaderID, oCondition.CONDITION_INDEX));
      }

      if (component.m_viewPriorities && conditionHeaderID == "TV") {
        htmlArray.push(
          '<div id="cvPriorityDiv' + oCondition.CONDITION_INDEX + compID + '" ', (component.m_enableModifyPrioritization) ? 'onmouseenter="this.className=\'cv-input-container-hover\';$(this).children(\'img\').removeClass(\'cv-hidden\');" ' : '', (component.m_enableModifyPrioritization) ? 'onmouseleave="this.className=\'cv-input-container\';$(this).children(\'img\').addClass(\'cv-hidden\');" ' : '',
          'class="cv-input-container">');
        htmlArray.push('<input ',
          'id="cvEditDiv' + oCondition.CONDITION_INDEX + compID + '" ',
          'maxlength="2" ', (component.m_enableModifyPrioritization) ? 'onkeypress="return CERN_CV_O1.validatePriorityInput(event);" ' : '', (component.m_enableModifyPrioritization) ? 'class="cv-priority-input" ' : 'class="cv-priority-input cv-default-cursor" ', (component.m_enableModifyPrioritization) ? '' : 'unselectable="on" ', (component.m_enableModifyPrioritization) ? '' : 'readonly="readonly" ', (component.m_enableModifyPrioritization) ? 'onclick="this.select()" ' : '',
          'value="' + CERN_CV_O1.getClinicalPriorityDisplay(mostRecentDiagnosis.CLINICAL_PRIORITY) + '" ',
          '/>');
        if (component.m_enableModifyPrioritization) {
          htmlArray.push('<img ' +
            'class="cv-priority-drop-down-img cv-hidden" ' +
            'src="' + component.m_iconPath + '/images/5322_down_hover.png"/>');
        }
        htmlArray.push('</div>');

        if (component.m_enableModifyPrioritization) {
          htmlArray.push(CERN_CV_O1.buildDropDownMenu(component, oCondition, mostRecentDiagnosis.CLINICAL_PRIORITY, arSectionConditions));
        }
      } else if (conditionHeaderID !== "TV") {
        htmlArray.push('<img id="cv' + conditionHeaderID + 'MOV' + compID + '" class="cv-non-priority cv-hidden" onclick="CERN_CV_O1.moveConditionIcon(\'' + compID + '\', this)" src="' + component.m_iconPath + '/images/transparent.png"/>');
      }

      return htmlArray.join("");
    },

    /**
     * Return the comment toggle button HTML
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {string} conditionHeaderID - the header id for the section
     * @param {numeric} conditionIndex - the unique index of the condition from mp_get_conditions
     * @return {string} Comment toggle button HTML
     */
    buildCommentToggleButton: function(compID, conditionHeaderID, conditionIndex) {
      var htmlArray = [];
      var uniqueRowId = conditionHeaderID + conditionIndex;
      htmlArray.push('<div id="cv-comment-div' + uniqueRowId + compID + '" class="cv-collapse-div cv-hidden" onclick="CERN_CV_O1.toggleCommentSection(id, \'' + compID + '\', ' + '\'' + conditionHeaderID + '\'' + ', ' + '\'' + conditionIndex + '\'' + ')" ></div>');
      return htmlArray.join("");
    },

    /**
     * Toggles comment section collapse and uncollapse
     *
     * @param {string} iconId - the unique id of a comment section toggle button image
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {string} conditionHeaderID - the header id for the section
     * @param {numeric} conditionIndex - the unique index of the condition from mp_get_conditions
     */
    toggleCommentSection: function(iconId, compID, conditionHeaderID, conditionIndex) {
      var jqIconElement = $('#' + iconId);
      var uniqueRowId = conditionHeaderID + conditionIndex;
      var jqRow = $('#' + uniqueRowId + "commentRow" + compID);
      var expanded = false;
      if (jqIconElement.hasClass('cv-collapse-div')) {
        jqIconElement.removeClass("cv-collapse-div");
        jqIconElement.addClass("cv-expand-div");
        jqIconElement.innerHTML = "-";
        jqRow.removeClass("cv-closed");
        $('#TextArea' + uniqueRowId + compID).focus();
        expanded = true;
      } else {
        jqIconElement.removeClass("cv-expand-div");
        jqIconElement.addClass("cv-collapse-div");
        jqRow.addClass("cv-closed");
      }
      CERN_CV_O1.sizeTable(compID);
      CERN_CV_O1.resizeCommentDisplay(compID);
      CERN_CV_O1.setExpandFlag(getCompObjByStringOrIntId(compID), conditionHeaderID, uniqueRowId, expanded);
    },

    /**
     * Clears the expand ids from the global array variable
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    clearExpandFlags: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      if (component.m_commentExpandFlag) {
        component.m_commentExpandFlag.length = 0;
      }
    },

    /**
     * Adds expand ids to the global array variable if they are not already in it
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {string} conditionHeaderID - the header id for the section
     * @param {string} uniqueRowId - the unique portion of the comment row id
     * @param {boolean} expand - If true, add id to array.  If false, remove id from array.
     */
    setExpandFlag: function(component, conditionHeaderID, uniqueRowId, expand) {
      var commentRows = component.m_commentExpandFlag;
      var loc = $.inArray(uniqueRowId, component.m_commentExpandFlag)
      if (expand == true) {
        if (loc < 0) {
          component.m_commentExpandFlag.push(uniqueRowId);
        }
      } else {
        if (loc >= 0) {
          component.m_commentExpandFlag.splice(loc, 1);
        }
      }
    },

    /**
     * Expands comments that should stay opened after a refresh
     *
     * @param {CvComponent} component - the consolidated problems object
     */
    defaultExpandComments: function(component) {
      var compID = component.m_compObject.cvCompId;
      var commentRows = component.m_commentExpandFlag;

      for (var i = 0, l = commentRows.length; i < l; i++) {
        var uniqueRowId = commentRows[i];
        var commentRowId = uniqueRowId + "commentRow" + compID;
        var section = commentRowId.substring(0, 2);
        var endIndex = commentRowId.indexOf("commentRow");
        var conditionIndex = parseFloat(commentRowId.substring(2, endIndex));
        CERN_CV_O1.toggleCommentSection("cv-comment-div" + uniqueRowId + compID, compID, section, conditionIndex);
      }
    },

    /**
     * Returns comment display HTML
     *
     * @param {CvComponent} component - the consolidated problems object
     * @param {object} condition - condition object containing comments to be displayed
     * @param {numeric} conditionIndex - the unique index of the condition from mp_get_conditions
     * @param {string} sectionHeaderId - the unique string id of the section
     * @return {string} Comment display HTML
     */
    buildCommentDisplay: function(component, condition, conditionIndex, sectionHeaderId) {
      var htmlArray = [];
      var compID = component.m_compObject.cvCompId;
      var uniqueRowId = sectionHeaderId + conditionIndex; //Section + row number
      var ensureValidCommentVars = "'" + uniqueRowId + "', '" + compID + "'";
      htmlArray.push('<div id="comments-div' + uniqueRowId + compID + '" class="cv-comments-div cv-no-drag-line">', '<div id="AddCommentSec' + uniqueRowId + compID + '" class=""><textarea id="TextArea' + uniqueRowId + compID +
        '" name="textBox" class="comment-form" rows="2" onKeyUp="CERN_CV_O1.ensureValidComment(' + ensureValidCommentVars + ', this)" style = "overflow:auto;" ></textarea></div>');
      htmlArray.push('<div><button id="AddCommentBtn' + uniqueRowId + compID + '" type="button" class="addCommentBtn" onclick="CERN_CV_O1.addComment(\'' + compID + '\',' + conditionIndex + ', id, ' + '\'' + sectionHeaderId + '\'' + ')" disabled="disabled">' +
        i18n.discernabu.consolproblem_o1.ADD_COMMENTS + '</button></div>');

      var comments = condition.COMMENTS;
      var commentCnt = comments.length;
      var comNum = 0;
      var diagnosesExist = (condition.DIAGNOSES.length == 0) ? false : true;
      var problemsExist = (condition.PROBLEMS.length == 0) ? false : true;
      for (var j = 0, l = comments.length; j < l; j++) {
        var displayClass = (j > 2) ? "cv-closed" : "";
        var comment = comments[j].TEXT;
        var isProblemComment = true;
        var c = comment;
        if (!problemsExist) {
          isProblemComment = false;
        }
        //If comment header is already in the text, treat as diagnosis comment
        else if (diagnosesExist && c.replace(/0/g, "").match(comments[j].COMMENT_DT_TM.slice(0, comments[j].COMMENT_DT_TM.length - 2).replace(/0/g, ""))) {
          isProblemComment = false;
        }

        //Adds comments for diagnoses
        if (!isProblemComment) {
          do {
            //Since the diagnosis comments are saved as one big string, here
            //we try to detect the number of comments present in the string
            //and separate them out.
            var endIdx = c.search(/\r\n/g);
            var userInfo = c.substring(0, endIdx);
            c = c.substring(endIdx + 1, c.length);

            endIdx = c.search(/\r\n/g);
            var commentPart = "";
            if (endIdx < 0) {
              commentPart = c;
            } else {
              commentPart = c.substring(0, endIdx);
              c = c.substring(endIdx + 4, c.length);
            }
			
            commentPart = commentPart.split("&").join("&amp;");
            commentPart = commentPart.split("<").join("&lt;");
            var displayClass = (comNum > 2) ? "cv-closed" : "";
            var commentStripeClass = (comNum % 2) ? " cv-comment-row-even" : " cv-comment-row-odd";
            if (sectionHeaderId == 'TV') {
              htmlArray.push('<div id="comment-text-TV' + conditionIndex + compID + comNum + '" class="cv-comment-text ' + displayClass + commentStripeClass + '">');
            } else {
              htmlArray.push('<div id="comment-text-' + uniqueRowId + compID + comNum + '" class="cv-comment-text ' + displayClass + commentStripeClass + '">');
            }
            htmlArray.push('<span>' + userInfo + '</span><br /><span class="cv-indent-comment">' + commentPart + '</span></div>');
            comNum++;
          }
          while (endIdx >= 0);

          commentCnt = comNum;
          continue;
        }

        //Adds comments for problem
        var commentStripeClass = (j % 2) ? " cv-comment-row-even" : " cv-comment-row-odd";
        var sComment = comment.replace(/\r\n|\r|\n/g, '<br />');
        sComment = sComment.split("&").join("&amp;");
        sComment = sComment.split("<").join("&lt;");
        htmlArray.push('<div id="comment-text-' + uniqueRowId + compID + comNum + '" class="cv-comment-text ' + displayClass + commentStripeClass + '">');
        htmlArray.push('<span>');
        //COMMENT_DATE is the ISO date from the backend.  COMMENT_DT_TM is the formatted display with date and time.
        //We are checking the COMMENT_DATE because when the comment has no date, the COMMENT_DATE is blank.
        //COMMENT DT_TM incorrectly shows as "00:00 am" when the date is blank.
        if (comments[j].COMMENT_DATE != "") {
          htmlArray.push(comments[j].COMMENT_DT_TM, ' - ');
        }
        htmlArray.push(comments[j].AUTHOR_NAME, '</span><br/>');
        htmlArray.push('<span class="cv-indent-comment">' + sComment + '</span></div>');
        comNum++;
      }

      if (commentCnt > 3) {
        var showAllCommentsVars = "id, '" + uniqueRowId + "', '" + compID + "'";
        htmlArray.push('<div><span id="cv-show-comments' + uniqueRowId + compID + '" >',
          '<a id="cv-show-all-comments' + uniqueRowId + compID + '" class="cv-comments-link" ' +
          'onclick="CERN_CV_O1.showAllComments(' + showAllCommentsVars + ')">', i18n.discernabu.consolproblem_o1.SHOW_ALL_COMMENTS, '</a>',
          '</span></div>');
      }
      return htmlArray.join("");
    },

    /**
     * Handles resizing of comment forms and text
     * Based upon width of second table column
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    resizeCommentDisplay: function(compID) {
      //Set width of comment box
      var jqComponent = $("#cv" + compID);
      var width = jqComponent.find(".cv-column2").outerWidth();
      jqComponent.find(".comment-form").css("width", width);
      jqComponent.find(".cv-comment-text").css("width", width);
    },

    /**
     * Handles clicking the show all/hide comments link
     * Clicking shows all comments will show every comment
     * Click hide comments will hide all but the first 3 comments
     *
     * @param {string} id - the id of the anchor tag element
     * @param {string} uniqueRowId - the unique portion of the comment row id
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    showAllComments: function(id, uniqueRowId, compID) {
      var jqLinkElement = $('#' + id);
      var comments = $('div[id^="comment-text-' + uniqueRowId + compID + '"]');
      if (jqLinkElement.text() == i18n.discernabu.consolproblem_o1.SHOW_ALL_COMMENTS) {
        jqLinkElement.text(i18n.discernabu.consolproblem_o1.SHOW_LESS_COMMENTS);
        for (var i = 0, l = comments.length; i < l; i++) {
          $(comments[i]).removeClass("cv-closed");
        }
      } else if (jqLinkElement.text() == i18n.discernabu.consolproblem_o1.SHOW_LESS_COMMENTS) {
        jqLinkElement.text(i18n.discernabu.consolproblem_o1.SHOW_ALL_COMMENTS);
        for (var i = 3, l = comments.length; i < l; i++) {
          $(comments[i]).addClass("cv-closed");
        }
      }

    },

    /**
     * Saves a new comment which refreshes the display of the component
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {numeric} conditionIndex - the unique index of the condition from mp_get_conditions
     * @param {string} id - element id of the add comment button that was clicked
     * @param {string} sectionHeaderId - the unique string id of the section
     */
    addComment: function(compID, conditionIndex, id, sectionHeaderId) {
      var uniqueRowId = sectionHeaderId + conditionIndex;
      var comment = $('textarea#TextArea' + uniqueRowId + compID).val();
      if (!comment || comment.length == 0) {
        // The textbox is empty, don't do anything
        return;
      }
      var component = getCompObjByStringOrIntId(compID);
      var iType = -1;
      if (sectionHeaderId == "TV") {
        iType = 0;
      } else if (sectionHeaderId == "AC") {
        iType = 2;
      } else if (sectionHeaderId == "HX") {
        iType = 3;
      }
      // Update the condition type and condition index so that the cvRefresh will refresh the Win32 problems/diagnoses collection.
      component.m_nNewConditionType = iType;
      component.m_nNewConditionIndx = conditionIndex;

      //Set the section to default expanded on refresh
      CERN_CV_O1.setExpandFlag(component, sectionHeaderId, uniqueRowId, true);

      // Set up text processing indicator
      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);

      // Write out comment to database for most recent diaganosis or problem.
      var mostRecentProblem = CERN_CV_O1.getMostRecentProblem(0.0, conditionIndex, compID);
      if (mostRecentProblem != null) {
        var dProblemId = mostRecentProblem.PROBLEM_ID;
        if (dProblemId > 0.0) {
          CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);
          component.m_nRefreshCount++;
          CERN_CV_O1.modifyProblemComments(dProblemId.toFixed(1), [comment], compID, CERN_CV_O1.getLifeCycleStatusFlag(mostRecentProblem.LIFECYCLE_STATUS_MEAN));
        }
      } else {
        var diag = CERN_CV_O1.getMostRecentDiagnosis(0, conditionIndex, compID);
        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);
        component.m_nRefreshCount++;
        CERN_CV_O1.modifyDiagnosisComments([diag], [comment], conditionIndex, compID);
      }

      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
    },

    /**
     * Enables the add comment button if valid comment text is entered into the comment text box
     *
     * @param {string} uniqueRowId - the unique portion of the comment row id
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    ensureValidComment: function(uniqueRowId, compID) {
      var comment = $('textarea#TextArea' + uniqueRowId + compID).val();
      var jqAddCommentBtn = $('#AddCommentBtn' + uniqueRowId + compID);
      if (!comment.trim()) {
        jqAddCommentBtn.attr('disabled', 'disabled');
      } else {
        jqAddCommentBtn.removeAttr('disabled');
      }
    },

    /**
     * Creates script call parameter string and calls function to call script to save problem comments
     *
     * @param {string} problemId - the problem_id value from mp_get_conditions
     * @param {Array} commentArray - collection of comments to be saved
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {numeric} lifeCycleFlag - LIFECYCLE_STATUS_MEAN value for problem from mp_get_conditions
     */
    modifyProblemComments: function(problemId, commentArray, compID, lifeCycleFlag) {
      var sendAr = CERN_CV_O1.getProblemCommentServiceCallArray(problemId, commentArray, compID, lifeCycleFlag);
      CERN_CV_O1.loadWithCBParameters('mp_modify_problem', CERN_CV_O1.cvRefresh, 'cv', sendAr.join(","), compID);
    },

    /**
     * Build the parameter string needed to save comments with the mp_modify_problem script
     *
     * @param {string} problemId - the problem_id value from mp_get_conditions
     * @param {Array} commentArray - collection of comments to be saved
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {string} lifeCycleFlag - string flag value based on integer LIFECYCLE_STATUS_MEAN value from mp_get_conditions
     */
    getProblemCommentServiceCallArray: function(problemId, commentArray, compID, lifeCycleFlag) {
      var component = getCompObjByStringOrIntId(compID);
      var providerId = component.m_compObject.criterion.provider_id.toFixed(1);
      var pprCd = component.m_compObject.criterion.ppr_cd.toFixed(1);
      var patientId = component.m_compObject.criterion.person_id.toFixed(1);
      var medInd = 0;
      var confirmProbInd = 0;
      var commentInd = 1;

      var sendAr = [];
      sendAr.push("^MINE^");
      sendAr.push(problemId);
      sendAr.push(providerId);
      sendAr.push(pprCd);
      sendAr.push(lifeCycleFlag);
      sendAr.push(medInd);
      sendAr.push(confirmProbInd);
      sendAr.push(CERN_CV_O1.getStringArrayString(commentArray));
      sendAr.push(commentInd);
      return sendAr;
    },

    /**
     * Converts the string life cycle status mean to a numeric flag value
     *
     * @param {string} lifeCycleStatusMean - LIFECYCLE_STATUS_MEAN value from mp_get_conditions
     * @return {numeric} A numeric value that is mapped to the original LIFECYCLE_STATUS_MEAN value from mp_get_conditions
     */
    getLifeCycleStatusFlag: function(lifeCycleStatusMean) {
      switch (lifeCycleStatusMean) {
        case "ACTIVE":
          return 1;
        case "CANCELED":
          return 2;
        case "INACTIVE":
          return 3;
        case "RESOLVED":
          return 4;
        default:
          return 0;
      }
    },
    /**
     * Returns an array of annotated displays from the corresponding array of Win32 diagnosis objects
     *
     * @param arrDiagnoses - array of win32 diagnosis objects
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {Array} A collection of priority values
     */
    getAnnotatedDisplayFromCondition: function(conditionIndex, compID) {
      var annotatedDisplays = [];

      var condition = CERN_CV_O1.getCondition(0, conditionIndex, compID);
      if (condition) {
        annotatedDisplays.push("\"" + condition.ANNOTATED_DISPLAY + "\"");
      }

      return annotatedDisplays;
    },

    /**
     * Creates script call parameter string and calls function to call script to save diagnosis comments
     *
     * @param {Array} arDiagnoses - collection of diagnoses to save comments on
     * @param {Array} arComments - collection of comments to be saved
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    modifyDiagnosisComments: function(arDiagnoses, arComments, conditionIndex, compID) {
      if (arDiagnoses.length < 1 || arDiagnoses.length != arComments.length) {
        alert(i18n.discernabu.consolproblem_o1.DIAGNOSIS_MODIFY_FAILURE);
        return;
      }
      var annotatedDisplays = CERN_CV_O1.getAnnotatedDisplayFromCondition(conditionIndex, compID);
      var sendAr = CERN_CV_O1.getDiagnosisCommentServiceCallArray(arDiagnoses, arComments, annotatedDisplays, compID);
      CERN_CV_O1.loadWithCBParameters('mp_modify_diagnosis', CERN_CV_O1.cvRefresh, 'cv', sendAr.join(","), compID);
    },

    /**
     * Creates script call parameter string that will be passed into mp_modify_diagnosis to save comments
     *
     * @param {Array} arDiagnoses - collection of diagnoses to save comments on
     * @param {Array} arComments - collection of comments to be saved
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    getDiagnosisCommentServiceCallArray: function(arDiagnoses, arComments, annotatedDisplayArray, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var providerId = component.m_compObject.criterion.provider_id.toFixed(1);
      var pprCd = component.m_compObject.criterion.ppr_cd.toFixed(1);
      var patientId = component.m_compObject.criterion.person_id.toFixed(1);
      var removeInd = 0;
      var commentInd = 1;

      var sendAr = [];
      sendAr.push("^MINE^");
      sendAr.push(providerId);
      sendAr.push(pprCd);
      sendAr.push(patientId);
      sendAr.push(CERN_CV_O1.getDoubleArrayString(CERN_CV_O1.getPropertyArray(arDiagnoses, "DIAGNOSIS_ID")));
      sendAr.push(CERN_CV_O1.getEmptyArrayString(1, "0.0"));
      sendAr.push(CERN_CV_O1.getEmptyArrayString(1, "0.0"));
      sendAr.push(CERN_CV_O1.getStringArrayString(arComments));
      sendAr.push(commentInd);
      sendAr.push(CERN_CV_O1.getEmptyArrayString(1, "0"));
      sendAr.push(CERN_CV_O1.getEmptyArrayString(1, "0"));
      sendAr.push(removeInd);
      sendAr.push(CERN_CV_O1.getArrayString(annotatedDisplayArray));
      return sendAr;
    },

    /**
     * Prevents non numbers from being entered into the priority textbox
     *
     * @param {Event} e - event from input box keypress
     * @param {boolean} True if input is a number.  False if input is not a number.
     */
    validatePriorityInput: function(e) {
      if (!e) {
        e = window.event;
      }
      var charCode = e.which || e.keyCode;

      var charString = String.fromCharCode(charCode);
      if (charString.match(/^\d{1}$/)) {
        return true;
      }

      return false;
    },


    /**
     * Loads CCL script and calls the passed in callback method upon script reply
     *
     * @param {string} url - the url or script name to be called
     * @param {Function} callback - the function to be called when the script replies
     * @param {string} sec - component identifier
     * @param {string} parameters - paramter string used for script call
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    loadWithCBParameters: function(url, callback, sec, parameters, compID) {
      function checkReady() { //check to see if request is ready
        if (xhr.readyState === 4) { // 4 = "loaded"
          if (xhr.status === 200) { // 200 = OK
            // ...callback function
            MP_Util.LogScriptCallInfo(getCompObjByStringOrIntId(compID), this, "consolidatedproblems.js", "loadWithCBParameters");
            if (url == "mp_modify_problems") {
              callback(xhr.responseText, sec, compID, 2);
            } else if (url == "mp_modify_diagnosis") {
              callback(xhr.responseText, sec, compID, 3);
            } else {
              callback(xhr.responseText, sec, compID, 1); //.responseText
            }
          } else {
            var component = getCompObjByStringOrIntId(compID);
            CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
            component.m_nRefreshCount--;
            alert(i18n.discernabu.consolproblem_o1.PROBLEM_RETRIEVING_DATA.replace('{0}', sec));
          }
        }
      }

      var component = getCompObjByStringOrIntId(compID);
      var xhr = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
      xhr.onreadystatechange = checkReady;

      if (!parameters) {
        parameters = "^MINE^, " + component.m_compObject.criterion.person_id.toFixed(1) + "," + component.m_compObject.criterion.provider_id.toFixed(1) + "," + component.m_compObject.criterion.encntr_id.toFixed(1) + ",^" + component.m_compObject.criterion.app_name + "^," + component.m_compObject.criterion.position_cd.toFixed(1) + "," + component.m_compObject.criterion.ppr_cd.toFixed(1);
      }
      if (CERN_BrowserDevInd) {
        var requestUrl = url + "?parameters=" + parameters;
        xhr.open("GET", requestUrl, true);
        xhr.send(null);
      } else {
        xhr.open('GET', url, true);
        xhr.send(parameters);
      }
    },

    /**
     * Callback function used by processingUI when processing is complete to update the main component menu
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    updateCVActions: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      if (component.m_nProcessing == 1) { //We only need to disable it once
        // call updateCVMenu to disable the action items
        CERN_CV_O1.updateCVMenu(compID);
      }
    },

    /**
     * This method provides the basic framework to inform the user that the page is processing the last action.  A typical usage for this method is as follow:
     * processingUI(oNamespace, "elementId", 0) - This call will set the processing text.  Typically, this is called during the first load.
     * processingUI(oNamespace, "elementId", 1) - This call will increment the processing count and set the processing text.  Typically, this is called right
     *  before a long processing code such as an IO operation.
     * processingUI(oNamespace, "elementId", -1) - This call will decrement the processing count, and if there is no more operations in process, it will clear
     *  the processing text.  Typically, this is called after a long processing code such as an IO operation.
     * @param {Object} oNamespace - a namespace that holds the processing count.  This namespace must have a variable called m_nProcessing. ex(CvComponent)
     * @param {string} sElementId - the string id of the HTML element that this method should managed.
     * @param {numeric} nIncrement - the processing increments.  See the description of the method for details.
     * @param {boolean} bChangeCursor - if true, cursor is changed to wait cursor.  If false, cursor is not changed while processing.
     * @param {Function} updateCallback - function that is called after processing is complete
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    processingUI: function(oNamespace, sElementId, nIncrement, bChangeCursor, updateCallback, compID) {

      var processingElement = $('#' + sElementId);
      if (processingElement) {

        if (nIncrement === 0) {
          // Resetting the element
          oNamespace.m_nProcessing = 0;
          oNamespace.m_nWaitCursor = 0;
        } else {
          oNamespace.m_nProcessing += nIncrement;
          if (bChangeCursor) {
            oNamespace.m_nWaitCursor += nIncrement;
          }

          if (oNamespace.m_nProcessing < 0) {
            oNamespace.m_nProcessing = 0;
          }
          if (oNamespace.m_nWaitCursor < 0) {
            oNamespace.m_nWaitCursor = 0;
          }
        }

        var bodyElement = $("body");
        if (oNamespace.m_nProcessing === 0) {
          $(processingElement).addClass("hide");
        } else {
          $(processingElement).removeClass("hide");
        }

        if (oNamespace.m_nWaitCursor === 0) {
          $(bodyElement).removeClass("cv-busy");
        } else {
          $(bodyElement).addClass("cv-busy");
        }

        // Call function to disable all actions.
        if (updateCallback) {
          updateCallback(compID);
        }
      }
    },

    /**
     * Displays row icons on mouseover
     *
     * @param {Element} element - HTML element of the condition row
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    cvDisplayRowIcons: function(element, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var jqRow = $(CERN_CV_O1.getParentRowFromElement(element));
      //If dragging a condition, do not display icons
      if (jqRow.hasClass("cv-drag-line") || component.m_isDragging) {
        return;
      }
      if (jqRow && jqRow.hasClass("cv-info")) {
        var rowId = jqRow.attr('id');
        // ParseFloat on the id will parse all the numeric characters up to the first occurance of a non-numeric char
        var nIndex = rowId.indexOf("IDX") + 3;
        var nIndex2 = rowId.indexOf("UNIQ");
        var dConditionIndx = parseFloat(rowId.substring(nIndex, nIndex2));
        var section = rowId.substring(0, 2);

        // Show collapse icon
        var jqCollapseIcon = $('#' + "cv-comment-div" + section + dConditionIndx + compID);
        jqCollapseIcon.removeClass("cv-hidden");

        if (section == "TV") {
          // Show priority dropdown
          var jqCol1 = jqRow.children(".cv-column1");
          jqCol1.children(".cv-input-container").children(".cv-priority-drop-down-img").removeClass("cv-hidden");

        } else if (section == "AC" || section == "HX") {
          // Show the move chevron
          var jqCol1 = jqRow.children(".cv-column1");
          jqCol1.children(".cv-non-priority").removeClass("cv-hidden");
        }
      }
    },

    /**
     * Hides the row icons on mouse leave
     *
     * @param {Element} rowElement - HTML element of the condition row
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    cvHideRowIcons: function(element, compID) {
      var rowId = $(element).attr('id');
      var jqRow = $(CERN_CV_O1.getParentRowFromElement(element));
      var nIndex = rowId.indexOf("IDX") + 3;
      var nIndex2 = rowId.indexOf("UNIQ");
      var dConditionIndx = parseFloat(rowId.substring(nIndex, nIndex2));
      var section = rowId.substring(0, 2);

      // Hide collapse icon
      var jqCollapseIcon = $('#' + "cv-comment-div" + section + dConditionIndx + compID);
      var jqSpecificityIcon = $('#' + "cv-spec-img-div" + section + dConditionIndx + compID);
      jqCollapseIcon.addClass("cv-hidden");
      jqSpecificityIcon.addClass("cv-hidden");
      if (section == "TV") {
        // Hide priority dropdown
        var jqCol1 = jqRow.children(".cv-column1");
        jqCol1.children(".cv-input-container").children(".cv-priority-drop-down-img").addClass("cv-hidden");
      } else if (section == "AC" || section == "HX") {
        // Hide the move chevron
        var jqCol1 = jqRow.children(".cv-column1");
        jqCol1.children(".cv-non-priority").addClass("cv-hidden");
      }
    },

    /**
     * Displays modification icons on rows that can be modified when mouse is over them
     *
     * @param {Element} element - HTML element of the condition row
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    cvDisplayModifyIcon: function(element, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var jqRow = $(CERN_CV_O1.getParentRowFromElement(element));
      //If dragging a condition, do not display icons
      if (jqRow.hasClass("cv-drag-line") || component.m_isDragging) {
        return;
      }
      //validate that we are dealing with the row
      if (jqRow && jqRow.hasClass("cv-info")) {
        var rowId = jqRow.attr('id');
        // ParseFloat on the id will parse all the numeric characters up to the first occurance of a non-numeric char
        var nIndex = rowId.indexOf("IDX") + 3;
        var nIndex2 = rowId.indexOf("UNIQ");
        var dConditionIndx = parseFloat(rowId.substring(nIndex, nIndex2));
        var section = rowId.substring(0, 2);
        var canModify = 0;

        if (section == "TV") {
          // For diagnosis modify, check if there is a most recent encounter diagnosis. Also check if selection privs are valid
          var mostRecentDiagnosis = CERN_CV_O1.getMostRecentEncntrDiagnosis(0.0, dConditionIndx, compID);
          if (mostRecentDiagnosis && mostRecentDiagnosis.CAN_MODIFY == 1) {
            canModify = 1;
          }
        } else if (section == "AC" || section == "HX") {
          var mostRecentProblem = CERN_CV_O1.getMostRecentProblem(0.0, dConditionIndx, compID);
          if (mostRecentProblem && mostRecentProblem.CAN_MODIFY == 1 && mostRecentProblem.PROBLEM_TYPE_FLAG != 2) {
            canModify = 1;
          }
        }
        if (canModify === 1) {
          // remove the hidden class from the icon
          var jqCvModIcon = $('#' + rowId + "MOD" + compID);
          jqCvModIcon.removeClass('cv-hidden');
        }
      }
    },


    /**
     * Hides the modify icon for the given row element
     *
     * @param {Element} rowElement - HTML element of the condition row
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    cvHideModifyIcon: function(rowElement, compID) {
      // add the hidden class from the icon
      var rowId = $(rowElement).attr('id');
      var jqCvModIcon = $('#' + rowId + 'MOD' + compID);
      jqCvModIcon.addClass("cv-hidden");
    },


    /**
     * Launches win32 condition modify dialog
     *
     * @param {Element} rowElement - HTML element of the condition row
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    cvLaunchModifyDlg: function(rowElement, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var probDxUtils = component.getProbDxUtilsObject();
      var jqRow = $(CERN_CV_O1.getParentRowFromElement(rowElement));
      var rowID = jqRow.attr('id');

      var bFound = false;
      var mostRecentProblem = null;
      var mostRecentEncntrDiagnosis = null;
      var retVal = false;
      var iType = -1;
      var dOriginatingNomenclatureId = parseFloat(rowID.substring(2));

      var nIndex = rowID.indexOf("IDX") + 3;
      var nIndex2 = (rowID).indexOf("UNIQ");
      var dConditionIndx = parseFloat(rowID.substring(nIndex, nIndex2));

      if (rowID.substring(0, 2) == "TV") {
        iType = 0;
        mostRecentEncntrDiagnosis = CERN_CV_O1.getMostRecentEncntrDiagnosis(0.0, dConditionIndx, compID);
        if (mostRecentEncntrDiagnosis && probDxUtils) {
          try {
            retVal = probDxUtils.LoadDiagnosisAndInvokeModify(mostRecentEncntrDiagnosis.DIAGNOSIS_ID,
              component.m_compObject.criterion.person_id, component.m_compObject.criterion.encntr_id, true);
          } catch (err) {
            //supress dll error
          }
        }
      } else if (rowID.substring(0, 2) == "AC" || rowID.substring(0, 2) == "HX") {
        if (rowID.substring(0, 2) == "AC") {
          iType = 2;
        } else {
          iType = 3;
        }

        mostRecentProblem = CERN_CV_O1.getMostRecentProblem(0.0, dConditionIndx, compID);

        if (mostRecentProblem && probDxUtils) {
          try {
            retVal = probDxUtils.LoadProblemAndInvokeModify(mostRecentProblem.PROBLEM_ID, component.m_compObject.criterion.person_id, true);
          } catch (err) {
            //suppress dll errors
          }
        }
      }

      if (retVal) {
        component.m_nNewConditionType = iType;
        component.m_dNewConditionNomenclatureId = dOriginatingNomenclatureId;
        component.m_nNewConditionIndx = dConditionIndx;
        var compCriterion = component.m_compObject.criterion;
        CERN_CV_O1.refreshConditions(compID);
      }

      //hide all existing comment hovers
      var commentHovers = $('cv' + compID).find('.cv-comment').css('display', 'none');

      Util.cancelBubble(window.event);
    },

    /**
     * Finds the parent row of any child object
     *
     * @param {Element} element - HTML element used to find the parent row
     * @return {Element} The parent row element
     */
    getParentRowFromElement: function(element) {
      var jqCurrentTag = $(element);
      while (jqCurrentTag.length !== 0 && jqCurrentTag.get(0).tagName != "TR") {
        jqCurrentTag = jqCurrentTag.parent();
      }
      return jqCurrentTag.get(0);
    },

    /**
     * Finds the parent section id of any child object
     *
     * @param {Element} element - HTML element used to find the parent row
     * @return {Element} The parent section id
     */
    getElementSectionId: function(element) {
      var jqCurrentTag = $(element);
      while (jqCurrentTag.length !== 0 && jqCurrentTag.get(0).tagName != "TBODY") {
        jqCurrentTag = jqCurrentTag.parent();
      }

      return jqCurrentTag.attr('id');
    },

    /**
     * Deselects any rows currently selected in other sections when selecting a row in the current section
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @rparam {string} sectionId - the string id of the section being clicked in
     */
    deselectOtherSections: function(compID, sectionId) {
      var component = getCompObjByStringOrIntId(compID);
      var deselectSectionIds = [];
      if (sectionId == "TVSEC" + compID) {
        // --- Code for Timers 
        var slaTimer = MP_Util.CreateTimer("CAP:MPG Consolidated Problem Select : This Visit Section");
        if (slaTimer) {
          slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
          slaTimer.Stop();
        }

        //  ---- Code for Timers
        deselectSectionIds.push("ACSEC" + compID);
        deselectSectionIds.push("HXSEC" + compID);
      } else if (sectionId == "ACSEC" + compID) {
        // --- Code for Timers 
        var slaTimer = MP_Util.CreateTimer("CAP:MPG Consolidated Problem Select : Active Section");
        if (slaTimer) {
          slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
          slaTimer.Stop();
        }

        //  ---- Code for Timers
        deselectSectionIds.push("TVSEC" + compID);
        deselectSectionIds.push("HXSEC" + compID);
      } else if (sectionId == "HXSEC" + compID) {
        // --- Code for Timers 
        var slaTimer = MP_Util.CreateTimer("CAP:MPG Consolidated Problem Select : Historical Section");
        if (slaTimer) {
          slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
          slaTimer.Stop();
        }

        //  ---- Code for Timers
        deselectSectionIds.push("TVSEC" + compID);
        deselectSectionIds.push("ACSEC" + compID);
      }
      for (var i = 0, l = deselectSectionIds.length; i < l; i++) {
        var jqSelectedRows = CERN_CV_O1.getSelectedRows(deselectSectionIds[i]);
        jqSelectedRows.removeClass("cv-selected");
      }
    },

    /**
     * Handles highlighting/unhighlighting  clicked rows and calls method to deselect other sections
     *
     * @param {Element} element - child element of parent row that will be selected or unselected
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {boolean} onMouseUp - if true, method was called in a mouse up event
     */
    selectSectionRow: function(element, compID, onMouseUp) {
      var jqRow = $(CERN_CV_O1.getParentRowFromElement(element));
      var component = getCompObjByStringOrIntId(compID);
      var sectionId = CERN_CV_O1.getElementSectionId(element);
      var rowId = jqRow.attr('id');

      if (onMouseUp && rowId != component.m_lastMouseDownId) {
        return;
      } else if (!onMouseUp) {
        component.m_lastMouseDownId = rowId;
      }

      if (jqRow.hasClass("cv-selected")) {
        if (!component.m_selectedOnDown && onMouseUp) {
          jqRow.removeClass("cv-selected");
        } else {
          component.m_selectedOnDown = false;
        }
      } else if (!onMouseUp) {
        jqRow.addClass("cv-selected");
        jqRow.removeClass("cv-row-hover");
        component.m_selectedOnDown = true;
        CERN_CV_O1.deselectOtherSections(compID, sectionId);
      }

      CERN_CV_O1.updateCVMenu(compID);
    },

    /**
     * Hides the main component menu
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    hideComponentMenu: function(compID) {
      $("#moreOptMenu" + compID).addClass("menu-hide");
    },


    /**
     * Update the menu in the Consolidated View component.  This method will determine the options that
     *  are available, and adjust the menu items accordingly.
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    updateCVMenu: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      var bEnableMenuResolve = false;
      var bEnableMenuInactive = false;
      var bEnableMenuCancel = false;
      var bEnableMenuMedical = false;
      var bEnableMenuConfirmProblem = false;
      var selectedSectionTV = 1;
      var selectedSectionActive = 2;
      var selectedSectionHx = 4;
      var selectedSection = 0;
      var dNomenclatureId = 0.0;
      var rowType = "";
      var bPregnancyFound = false;
      var dConditionIndx = 0.0;
      var nIndex = 0;
      var bFoundFreeText = false;
      var isNKPItem = false;

      // Check and make sure the conditions are loaded and nothing is processing.
      if (component.m_nProcessing <= 0 && component.m_loadedConditions !== null) {
        component.m_nProcessing = 0;
        // Get all the selected rows.
        var jqCvSelRows = CERN_CV_O1.getSelectedRows("cv" + compID);
        var cvSelLen = jqCvSelRows.length;
        if (cvSelLen > 0) {
          // There is at least one item selected, use reverse logic to
          // determine the menu
          bEnableMenuResolve = true;
          bEnableMenuInactive = true;
          bEnableMenuCancel = true;
          bEnableMenuMedical = true;
          bEnableMenuConfirmProblem = true;

          // Loop through the rows, and check each selected condition
          for (var i = 0, l = cvSelLen; i < l; i++) {
            // Retrieve the numeric condition index without the row identifier.
            var selectedRowId = jqCvSelRows[i].id;
            nIndex = selectedRowId.indexOf("IDX") + 3;
            dConditionIndx = parseFloat(selectedRowId.substring(nIndex));
            dNomenclatureId = parseFloat(selectedRowId.substring(2));

            if (dNomenclatureId == 0.0) {
              bFoundFreeText = true;
            }

            var condition = CERN_CV_O1.getCondition(0, dConditionIndx, compID);
            if (condition) {
              if (CERN_CV_O1.IsNKP(condition.NOMENCLATURE_ID, component)) {
                // No Known Problem
                bEnableMenuResolve = false;
                bEnableMenuInactive = false;
                bEnableMenuMedical = false;
                bEnableMenuConfirmProblem = false;
                if (component.nNKPCanUpdate == 0) {
                  bEnableMenuCancel = false;
                } else {
                  bEnableMenuCancel = true;
                }
                isNKPItem = true;
              } else if (condition.PROBLEMS.length === 0) {
                // No problem object at all, all menu should be disabled
                bEnableMenuResolve = false;
                bEnableMenuInactive = false;
                bEnableMenuCancel = false;
                bEnableMenuMedical = false;
                bEnableMenuConfirmProblem = false;
              } else if (condition.PROBLEMS[0].PROBLEM_TYPE_FLAG === 2) {
                bPregnancyFound = true;
              } else if (condition.PROBLEMS[0].LIFECYCLE_STATUS_MEAN == "RESOLVED") {
                // The most recent problem is resolved, disable the menu
                bEnableMenuResolve = false;
              } else if (condition.PROBLEMS[0].LIFECYCLE_STATUS_MEAN == "INACTIVE") {
                // The most recent problem is inactive, disable the menu
                bEnableMenuInactive = false;
              }

              // Change to Medical option
              if (condition.PROBLEMS.length > 0 && condition.PROBLEMS[0].CLASSIFICATION_MEAN == "MEDICAL") {
                bEnableMenuMedical = false;
              }

              // User may Confirm "Possible" Problems only.
              if (condition.PROBLEMS.length > 0 && condition.PROBLEMS[0].CONFIRMATION_STATUS_MEAN != "POSSIBLE") {
                bEnableMenuConfirmProblem = false;
              }
            }

            // Find the row identifier from the first two letters in the row Id.
            rowType = selectedRowId.substring(0, 2);

            if (rowType == "TV") {
              selectedSection |= selectedSectionTV;
            } else if (rowType == "AC") {
              selectedSection |= selectedSectionActive;
            } else if (rowType == "HX") {
              selectedSection |= selectedSectionHx;
            }
          }
        }
      }

      // Menu Item Remove Diagnosis
      if (selectedSection == selectedSectionTV && (component.m_canAddConditionFlag === 1 || component.m_canAddConditionFlag === 3)) {

        //rcss - remove 'dithered' css style.
        component.removeMenuDither("mnuCVRemoveDiagnoses");
        $("#mnuCVRemoveDiagnoses" + compID).click(function(e) {
          CERN_CV_O1.removeDiagnoses(compID);
          CERN_CV_O1.hideComponentMenu(compID);
        });
      } else {
        //acss - add 'dithered' css style.
        component.addMenuDither("mnuCVRemoveDiagnoses");
      }

      // Menu Item Resolve
      if (bEnableMenuResolve && (component.m_canAddConditionFlag === 2 || component.m_canAddConditionFlag === 3) && bPregnancyFound === false) {

        component.removeMenuDither("mnuCVResolve");
        $("#mnuCVResolve" + compID).click(function(e) {
          CERN_CV_O1.modifyProblem(compID, $(this).attr('id'));
          CERN_CV_O1.hideComponentMenu(compID);
        });
      } else {
        component.addMenuDither("mnuCVResolve");
      }

      // Menu Item Inactivate
      if (bEnableMenuInactive && (component.m_canAddConditionFlag === 2 || component.m_canAddConditionFlag === 3) && bPregnancyFound === false) {

        component.removeMenuDither("mnuCVInactive");
        $("#mnuCVInactive" + compID).click(function(e) {
          CERN_CV_O1.modifyProblem(compID, $(this).attr('id'));
          CERN_CV_O1.hideComponentMenu(compID);
        });
      } else {
        component.addMenuDither("mnuCVInactive");
      }

      // Menu Item Cancel
      if (bEnableMenuCancel && (component.m_canAddConditionFlag === 2 || component.m_canAddConditionFlag === 3) && bPregnancyFound === false) {

        component.removeMenuDither("mnuCVCancel");
        $("#mnuCVCancel" + compID).click(function(e) {
          CERN_CV_O1.modifyProblem(compID, $(this).attr('id'));
          CERN_CV_O1.hideComponentMenu(compID);
        });
      } else {
        component.addMenuDither("mnuCVCancel");
      }


      // Menu Item Move To Active
      if (selectedSection && !(selectedSection & selectedSectionActive) && (component.m_canAddConditionFlag === 2 || component.m_canAddConditionFlag === 3) && bPregnancyFound === false && !bFoundFreeText && !isNKPItem) {

        component.removeMenuDither("mnuCVMoveToActive");
        $("#mnuCVMoveToActive" + compID).click(function(e) {
          //  ---- Code for Timers
          var slaTimer = MP_Util.CreateTimer("CAP:MPG_Consolidated_Problems_01_Dropdown_Move_To_Active");
          if (slaTimer) {
            slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
            slaTimer.Stop();
          }
          //  ---- Code for Timers
          CERN_CV_O1.moveConditionMenu(compID, $(this).attr('id'));
          CERN_CV_O1.hideComponentMenu(compID);
        });
      } else {
        component.addMenuDither("mnuCVMoveToActive");
      }

      // Menu Item Move To This Visit
      // If the selected rows do not contain a This Visit Row, then
      // remove the 'dithered' style for Move to This Visit.
      if (selectedSection && !(selectedSection & selectedSectionTV) && (component.m_canAddConditionFlag === 1 || component.m_canAddConditionFlag === 3) && !bFoundFreeText && !isNKPItem) {

        component.removeMenuDither("mnuCVMoveToThisVisit");
        $("#mnuCVMoveToThisVisit" + compID).click(function(e) {
          //  ---- Code for Timers
          var slaTimer = MP_Util.CreateTimer("CAP:MPG_Consolidated_Problems_01_Dropdown_Move_To_This_Visit");
          if (slaTimer) {
            slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
            slaTimer.Stop();
          }
          //  ---- Code for Timers
          CERN_CV_O1.moveConditionMenu(compID, $(this).attr('id'));
          CERN_CV_O1.hideComponentMenu(compID);
        });
      } else {
        component.addMenuDither("mnuCVMoveToThisVisit");
      }
    },


    /**
     * Handles the NKAP button click by calling in addNKAP if Nomenclature
     * data is already fetched.
     *
     * @param {numeric}
     *            compID - the unique id of the consolidated problems
     *            component
     */
    HandleNKAPClick: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      CERN_CV_O1.addNKAP(component);
    },

    /**
     * Check whether passed in nomen_Id matches NKP
     *
     * @param {numeric} nomen_Id - the nomenclature id of the condition
     * @return {bool} True if it matches NKP else False
     */
    IsNKP: function(nomen_Id, component) {
      var nomenArray = component.nkpNomenArray;

      for (var i = 0, l = nomenArray.length; i < l; i++) {
        var nomenclatureId = nomenArray[i];
        if (nomenclatureId == nomen_Id) {
          return true;
        }
      }

      return false;
    },

    cancelNKP: function(component) {
      var compID = component.m_compObject.cvCompId;
      var statusFlag = 2; //2 - cancelled

      // Increment the processing count
      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);

      if (component.nkpProblemId > 0) {
        var dMrpProbID = parseFloat(component.nkpProblemId);
        var paramString = "^MINE^," + dMrpProbID.toFixed(1) + "," + component.m_compObject.criterion.provider_id.toFixed(1) + "," + component.m_compObject.criterion.ppr_cd.toFixed(1) + "," + statusFlag + "," + 0 + "," + 0;
        CERN_CV_O1.loadWithCBParameters('mp_modify_problem', CERN_CV_O1.cvRefresh, 'cv', paramString, component.m_compObject.cvCompId);
      }

      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
    },

    /**
     * This method adds No Known Problems to the active list, if no active problems are present.
     *
     * @param {CvComponent} component - the consolidated problems object
     */
    addNKAP: function(component) {

      var compID = component.m_compObject.cvCompId;

      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);
      if (component.nkpProblemId > 0.0) {
        var dProblemId = parseFloat(component.nkpProblemId);
        var paramString = "^MINE^," + dProblemId.toFixed(1) + "," + component.m_compObject.criterion.provider_id.toFixed(1) + "," + component.m_compObject.criterion.ppr_cd.toFixed(1) + "," + 1 + "," + 0 + "," + 0;

        CERN_CV_O1.loadWithCBParameters('mp_modify_problem', CERN_CV_O1.cvRefresh, 'cv', paramString, compID);
      } else {
        var dProbNomenID = parseFloat(component.nkpNomenclatureId);
        var paramString = "^MINE^," + component.m_compObject.criterion.person_id.toFixed(1) + "," + component.m_compObject.criterion.encntr_id.toFixed(1) + "," + component.m_compObject.criterion.provider_id.toFixed(1) + "," + component.m_compObject.criterion.position_cd.toFixed(1) +
          "," + component.m_compObject.criterion.ppr_cd.toFixed(1) + "," + 2 + "," + 0 + "," + dProbNomenID.toFixed(1) + "," +
          dProbNomenID.toFixed(1) + "," + 1 + "," + 0 + "," + 0 + "," + 0 + "," + 0 +
          "," + 0 + "," + 0 + "," + 0 + "," + "''";
        CERN_CV_O1.loadWithCBParameters('mp_add_condition', CERN_CV_O1.cvAddLoad, 'cv', paramString, compID);
      }
    },

    /**
     * Returns a collection of conditions in the active section
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {Array} Collection of conditions
     */
    getActiveConditions: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      var conditions = [];
      var secActive = component.m_loadedConditions.DATA.ACTIVE;
      $.merge(conditions, CERN_CV_O1.getConditionsBySectionList(secActive));

      return conditions;
    },

    /**
     * Function is used by the auto suggest control to call the search script as characters are
     * entered in the search textbox and display the results as a drop down.
     *
     * @param {Function} callback - the function to be called when the script replies
     * @param {Element} textBox - textbox HTML element that contains the search string
     * @param {CvComponent} component - the consolidated problems object
     */
    searchNomenclature: function(callback, textBox, component) {
      if (textBox.value.length > 1) {
        // Check for valid search type flag
        if (component.m_compObject.iSearchTypeFlag < 1) {
          return;
        }
        // Check if exactly two characters in the field, launch timer for search use
        if (textBox.value.length === 2) {
          //  ---- Code for Timers
          var slaTimer = MP_Util.CreateTimer("CAP:MPG_Consolidated_Problems_01_Search_Window");
          if (slaTimer) {
            slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
            slaTimer.Stop();
          }
          //  ---- Code for Timers
        }

        // Initialize the request object
        var xhr = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
        var returnData;
        var searchPhrase = textBox.value;
        var searchLimit = 10;

        if (component.m_quickSearchLimit && component.m_quickSearchLimit > 0) {
          searchLimit = parseInt(component.m_quickSearchLimit, 10);
        }
        component.m_compObject.curSearchCounter = component.m_compObject.curSearchCounter + 1;

        // Currently, this is specific to the consolidated view section. Later, we should move this out of this general function
        CERN_CV_O1.processingUI(component, "cvProcessing" + component.m_compObject.cvCompId, 1, false, CERN_CV_O1.updateCVActions, component.m_compObject.cvCompId);

        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            MP_Util.LogScriptCallInfo(component, this, "consolidatedproblems.js", "searchNomenclature");
            var msg = xhr.responseText;
            var jsonMsg = "";

            if (msg) {
              jsonMsg = JSON.parse(msg);
            }

            if (jsonMsg) {
              component.m_compObject.replySearchCounter = jsonMsg.RECORD_DATA.SEARCHINDEX;
              if (component.m_compObject.replySearchCounter === component.m_compObject.curSearchCounter && textBox.value !== "") {
                returnData = jsonMsg.RECORD_DATA.NOMENCLATURE;
                callback.autosuggest(returnData, component);
              }
            }

            CERN_CV_O1.processingUI(component, "cvProcessing" + component.m_compObject.cvCompId, -1, false, CERN_CV_O1.updateCVActions, component.m_compObject.cvCompId);
          }
        };
        var sendAr = ["^MINE^", "^" + searchPhrase + "^", searchLimit, component.m_compObject.curSearchCounter, component.m_compObject.iSearchTypeFlag, "0", component.m_enableEarlyTransitionDx ? "1" : "0"];
        if (CERN_BrowserDevInd) {
          var url = "MP_SEARCH_NOMENCLATURES?parameters=" + sendAr.join(",");
          xhr.open("GET", url, true);
          xhr.send(null);
        } else {
          xhr.open('GET', "mp_search_nomenclatures", true);
          xhr.send(sendAr.join(","));
        }
      }
    },

    /**
     * Create the html for the suggestion which will be displayed in the suggestion drop down
     *
     * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
     * @param {string} searchVal : The value types into the search box.  This values is needed to highlight matches within the suggestions.
     */
    CreateSuggestionLine: function(suggestionObj, searchVal) {
      //Need to check and see if there is a sentence to display
      return CERN_CV_O1.HighlightValue(suggestionObj.NAME, searchVal);
    },

    /**
     * Highlight specific portions of a string for display purposes
     *
     * @param {string} inString : The string to be highlighted
     * @param {string] term : The string to highlight
     * @return {string} outString : The string highlighted using HTML tags
     */
    HighlightValue: function(inString, term) {
      return "<strong>" + inString.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong>$1<strong>") + "</strong>";
    },

    /**
     * Checks whether NKP condition is present
     *
     * @scope global
     * @param {CvComponent} component - the consolidated problems object
     */
    IsNKPExists: function(component) {
      var compID = component.m_compObject.cvCompId;
      var conditions = CERN_CV_O1.getActiveConditions(compID);
      if (conditions && conditions.length > 0) {
        if (component.nkpNomenclatureId > 0.0 && conditions[0].NOMENCLATURE_ID == component.nkpNomenclatureId) {
          return true;
        }
      }
      return false;
    },

    /**
     * Consolidated View to add a condition.  The value of the combo box cs-SelectedListId will
     *  be used to determine the switch options.
     *     Switch Options:
     *      0 = This Visit (Add as Diagnosis)
     *      1 = This Visit and Active (Add as Diagnosis & Problem)
     *      2 = Active (Add as Problem)
     *      3 = Historical (Add as Resolved Problem)
     *
     * @scope global
     * @param nomenclature_id is the nomenclature id of the condition being added.
     * NOTE: The addProblem function takes in the nomenclature_id and the lifeCycleStatusFlag
     * If the problem being added is based on one of the Active conditions, then the status flag
     *  will be Active or 1. If the problem being added is Hx, then we will send in the flag for
     *  a status of Resolved or 2. The mp_pe_add_problem.prg will handle the lifeCycleStatusFlag.
     */
    addCondition: function(nomenclature_id, textbox, component) { //handles adding a condition
      if (nomenclature_id) {
        var compID = component.m_compObject.cvCompId;
        // Get the condition combo box and get the index of the selection
        var addConditionType = component.m_cvAddAsType;
        // Clear out the consolidated view search box
        var cvSearch = $('#cvContentCtrl' + compID);
        $(cvSearch).val("");
        var nextPriority = 0;
        var conditions = CERN_CV_O1.getActiveConditions(compID);
        if (component.nkpNomenclatureId > 0.0 && nomenclature_id == component.nkpNomenclatureId && conditions && conditions.length > 0) {
          if (conditions.length > 1) {
            alert(i18n.discernabu.consolproblem_o1.NO_ADD_CONDITION_NKP_MSG);
            CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
            return;
          } else {
            if (conditions[0].NOMENCLATURE_ID != component.nkpNomenclatureId) {
              alert(i18n.discernabu.consolproblem_o1.NO_ADD_CONDITION_NKP_MSG);
              CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
              return;
            }
          }
        }
        if (component.m_enableModifyPrioritization) {
          nextPriority = CERN_CV_O1.getNextPriority(compID);
        }
        CERN_CV_O1.addConditionWithType(nomenclature_id.VALUE, addConditionType, 0, compID, nextPriority, false, 0);

        if (addConditionType === 0) {
          // --- Code for Timers 

          var slaTimer = MP_Util.CreateTimer("CAP:MPG Consolidated Problem Add This Visit");
          if (slaTimer) {
            slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
            slaTimer.Stop();
          }
          //  ---- Code for Timers
        }
        if (addConditionType === 1) {

          // --- Code for Timers 
          var slaTimer = MP_Util.CreateTimer("CAP:MPG Consolidated Problem Add This Visit and Active");
          if (slaTimer) {
            slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
            slaTimer.Stop();
          }
          //  ---- Code for Timers
        }
        if (addConditionType === 2) {

          // --- Code for Timers 
          var slaTimer = MP_Util.CreateTimer("CAP:MPG Consolidated Problem Add Active");
          if (slaTimer) {
            slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
            slaTimer.Stop();
          }
          //  ---- Code for Timers
        }
        if (addConditionType === 3) {

          // --- Code for Timers 
          var slaTimer = MP_Util.CreateTimer("CAP:MPG Consolidated Problem Add History");
          if (slaTimer) {
            slaTimer.SubtimerName = component.m_compObject.criterion.category_mean;
            slaTimer.Stop();
          }
          //  ---- Code for Timers
        }

      }
    },
    /**
     * If CrossMapModeEnum: 9 or eMapModeToThisVisitFromProblems exist in kiacrossmapping
     * then we will return true to carry forward for this visit
     * else return false
     */
    validateCarryForwardForThisVisit: function() {
      // Check if the cross map mode is valid, if the function does not exist, 
      // they have an older kiacrossmapping dll, so return false.

        var bIsValidCrossMapMode = false;
        try {
          var kiaCrossMappingObj = window.external.DiscernObjectFactory("KIACROSSMAPPING");
          bIsValidCrossMapMode = kiaCrossMappingObj.IsValidCrossMapMode(9);
        }
        // If the cross map mode is NOT valid, return false
        catch (err) {
          MP_Util.LogError("Failed in validateCarryForwardForThisVisit calling IsValidCrossMapMode: " + err);
          return false;
        }
        return bIsValidCrossMapMode;
      },

    /**
     * Manage a condition.  Depending on the supplied type, different database entry will be added.
     *      0 = New diagnosis
     *      1 = New diagnosis and new active problem
     *      2 = New active problem
     *      3 = New resolved problem
     * If a problem is needed, this method checks to see if one exists first before creating a new
     * problem.  The most recent problem will be modified instead of a new one being created. The
     * appropriate problem LifeCycleStatus Flag will be applied.  The flags currently consist of:
     *       1 = Active
     *       2 = Canceled
     *       3 = Inactive
     *       4 = Resolved
     *
     * @scope global
     * @param {Float} dOriginatingNomenclatureId The nomenclature id of the condition being added.
     * @param {Int} iType The type of condition that should be added.
     * @param {Float} dConditionIndx The unique condition index. (Pass 0 if its a new condition)
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {numeric} iPriority - the priority to assign the newly added condition
     * @param {boolean}isValidCarryForward - the bool to determine if carry forward
     * @param {numeric} iConditionType - condition is of type add or convert (0 - Add, 1 - convert)
     */
    addConditionWithType: function(dOriginatingNomenclatureId, iType, dConditionIndx, compID, iPriority, isValidCarryForward, iConditionType) {
      var component = getCompObjByStringOrIntId(compID);
      // Add the condition
      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);
      // Variables for the add condition script
      var dDiagnosisNomenclatureId = 0.0;
      var dDiagnosisTransitionNomenclatureId = 0;
      var dProblemNomenclatureId = 0.0;
      var nLifeStatusCodeFlag = 1;
      var mostRecentProblem = null;
      var paramString = "";
      var compCriterion = component.m_compObject.criterion;
      var mapModeEnum = 4; /*eMapModeToThisVisit*/
      var condition = "";
      var sAnnotatedDisplay = "";

      // Check modification privileges before continuing
      // 0: No Privs, 1:Has update Dx, 2: Has Update Prob, 3: Has both Update Dx and Prob privs
      switch (component.m_canAddConditionFlag) {
        case 0:
          alert(i18n.discernabu.consolproblem_o1.NO_PRIVS_MSG);
          CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
          return;
          break;
        case 1:
          if (iType == 1 || iType == 2) {
            alert(i18n.discernabu.consolproblem_o1.NO_ADD_CONDITION_MSG.replace('{0}', component.m_activeLabelDisplay));
            CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
            return;
            break;
          } else if (iType == 3) {
            alert(i18n.discernabu.consolproblem_o1.NO_ADD_CONDITION_MSG.replace('{0}', component.m_historicalLabelDisplay));
            CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
            return;
            break;
          }
          break;
        case 2:
          if (iType == 0) {
            alert(i18n.discernabu.consolproblem_o1.NO_ADD_CONDITION_MSG.replace('{0}', component.m_visitLabelDisplay));
            CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
            return;
            break;
          }
          break;
        default:
      }

      // Check and see if we are dealing with the problem part of the condition
      if (iType == 1 || iType == 2 || iType == 3) {

        // Attempt to get the most recent problem
        mostRecentProblem = CERN_CV_O1.getMostRecentProblem(dOriginatingNomenclatureId, 0, compID);
      }

      try {
        // Create the cross mapping object
        var kiaCrossMappingObj = window.external.DiscernObjectFactory("KIACROSSMAPPING");
        if (!kiaCrossMappingObj) {
          MP_Util.LogError("The kiaCrossMappingObj object is null. KiaCrossMapping DLL may not be registered or does not exist.");
          return;
        }

        MP_Util.LogDiscernInfo(component, "KIACROSSMAPPING", "consolidatedproblems.js", "addConditionWithType");

        if (isValidCarryForward) //if the cross map mode enum exist and we are carrying forward
        {
          mapModeEnum = 9; /*eMapModeToThisVisitFromProblems*/
        }

        // Get the cross mapped nomenclature ids
        switch (iType) {
          case 0: //adding to tv
            try {
              var diagnosisItemObj = kiaCrossMappingObj.GetDxProbMappingObj(compCriterion.person_id, compCriterion.encntr_id, mapModeEnum, dOriginatingNomenclatureId, component.m_diagnosisTargetVocabCd, compCriterion.ppr_cd, compCriterion.position_cd, component.m_visitLabelDisplay, component.m_activeLabelDisplay, component.m_historicalLabelDisplay);              
              dDiagnosisNomenclatureId = diagnosisItemObj.NomenclatureID;
              dDiagnosisTransitionNomenclatureId = diagnosisItemObj.TransitionNomenclatureID;
              if (iConditionType !== 1){
                   sAnnotatedDisplay = diagnosisItemObj.DiagnosisDisplay;
              }
            } catch (err) {
              MP_Util.LogError("Error occurred when using the KIACROSSMAPPING.GetDxProbMappingObj COM method while adding to TV. Latest KiaCrossMapping DLL may not exist. Reverting back to the old method. Error: " + err)
              try {
                dDiagnosisNomenclatureId = kiaCrossMappingObj.GetDxProbMapping(compCriterion.person_id, compCriterion.encntr_id, mapModeEnum, dOriginatingNomenclatureId, component.m_diagnosisTargetVocabCd, compCriterion.ppr_cd, compCriterion.position_cd, component.m_visitLabelDisplay, component.m_activeLabelDisplay, component.m_historicalLabelDisplay);
              } catch (err) {
                MP_Util.LogJSError(err, this, "consolidatedproblems.js", "addConditionWithType")
              }
            }
            break;
          case 1: //add to TV and Active/add a problem and diagnosis
            try {
              var diagnosisItemObj = kiaCrossMappingObj.GetDxProbMappingObj(compCriterion.person_id, compCriterion.encntr_id, mapModeEnum, dOriginatingNomenclatureId, component.m_diagnosisTargetVocabCd, compCriterion.ppr_cd, compCriterion.position_cd, component.m_visitLabelDisplay, component.m_activeLabelDisplay, component.m_historicalLabelDisplay);
              dDiagnosisNomenclatureId = diagnosisItemObj.NomenclatureID;
              dDiagnosisTransitionNomenclatureId = diagnosisItemObj.TransitionNomenclatureID;
              if (iConditionType !== 1){
                   sAnnotatedDisplay = diagnosisItemObj.DiagnosisDisplay;
              }
            } catch(err) {
              MP_Util.LogError("Error occurred when using the KIACROSSMAPPING.GetDxProbMappingObj COM method while adding to TV/Active. Latest KiaCrossMapping DLL may not exist. Reverting back to the old method. Error: " + err)
              try {
                dDiagnosisNomenclatureId = kiaCrossMappingObj.GetDxProbMapping(compCriterion.person_id, compCriterion.encntr_id, mapModeEnum, dOriginatingNomenclatureId, component.m_diagnosisTargetVocabCd, compCriterion.ppr_cd, compCriterion.position_cd, component.m_visitLabelDisplay, component.m_activeLabelDisplay, component.m_historicalLabelDisplay);
              } catch (err) {
                MP_Util.LogJSError(err, this, "consolidatedproblems.js", "addConditionWithType")
              }
            }

            // Only need to do the cross mapping if the problem doesn't exist, or the most recent problem is active
            if (mostRecentProblem === null || mostRecentProblem.LIFECYCLE_STATUS_MEAN === "ACTIVE") {
              try {
                dProblemNomenclatureId = kiaCrossMappingObj.GetDxProbMapping(compCriterion.person_id, compCriterion.encntr_id, 5 /*eMapModeToActive*/ , dOriginatingNomenclatureId, component.m_problemTargetVocabCd, compCriterion.ppr_cd, compCriterion.position_cd, component.m_visitLabelDisplay, component.m_activeLabelDisplay, component.m_historicalLabelDisplay);
              } catch (err) {
                MP_Util.LogJSError(err, this, "consolidatedproblems.js", "addConditionWithType")
              }

              // Clear the most recent problem, because we want the add script to handles the duplicate
              mostRecentProblem = null;
            }

            nLifeStatusCodeFlag = 1;
            break;
          case 2: //add to active/ chronic(new active)
            // Only need to do the cross mapping if the problem doesn't exist, or the most recent problem is active
            if (mostRecentProblem === null || mostRecentProblem.LIFECYCLE_STATUS_MEAN === "ACTIVE") {
              try {
                dProblemNomenclatureId = kiaCrossMappingObj.GetDxProbMapping(compCriterion.person_id, compCriterion.encntr_id, 5 /*eMapModeToActive*/ , dOriginatingNomenclatureId, component.m_problemTargetVocabCd, compCriterion.ppr_cd, compCriterion.position_cd, component.m_visitLabelDisplay, component.m_activeLabelDisplay, component.m_historicalLabelDisplay);
              } catch (err) {
                MP_Util.LogJSError(err, this, "consolidatedproblems.js", "addConditionWithType")
              }
              // Clear the most recent problem, because we want the add script to handle the duplicate
              mostRecentProblem = null;
            }

            nLifeStatusCodeFlag = 1;
            break;
          case 3: //add to historical(new resolved)
            // Only need to do the cross mapping if the problem doesn't exist, or the most recent problem is resolved
            if (mostRecentProblem === null || mostRecentProblem.LIFECYCLE_STATUS_MEAN === "RESOLVED") {
              try {
                dProblemNomenclatureId = kiaCrossMappingObj.GetDxProbMapping(compCriterion.person_id, compCriterion.encntr_id, 6 /*eMapModeToHistorical*/ , dOriginatingNomenclatureId, component.m_problemTargetVocabCd, compCriterion.ppr_cd, compCriterion.position_cd, component.m_visitLabelDisplay, component.m_activeLabelDisplay, component.m_historicalLabelDisplay);
              } catch (err) {
                MP_Util.LogJSError(err, this, "consolidatedproblems.js", "addConditionWithType")                
              }
              
              // If the Historical section is closed, expand the section since something was added.
              if (component.m_bHistoricalExpanded === false) {
                CERN_CV_O1.initializeToggle("cvHistoricalToggle" + compID, "HXSEC", true, compID);
              }

              // Clear the most recent problem, because we want the add script to handles the duplicate
              mostRecentProblem = null;
            }

            // Set LifeCycleStatusCodeFlag for Resolved.
            nLifeStatusCodeFlag = 4;
            break;
          default:
        }
        if (iConditionType === 1){
            condition = CERN_CV_O1.getCondition(dOriginatingNomenclatureId,dConditionIndx,compID);
            sAnnotatedDisplay = condition.ANNOTATED_DISPLAY;
        }
      } catch (err) {
        MP_Util.LogError("Failed in addConditionWithType: " + err);
      }

      //refresh counts must be updated before any service calls so refresh only happens after all calls are complete
      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 2, true, CERN_CV_O1.updateCVActions, compID);
      component.m_nRefreshCount += 2;

      //Handle NKP
      if (component.nkpNomenclatureId > 0.0 && dProblemNomenclatureId == component.nkpNomenclatureId) {
        // Add NKP nomenclature and prevent the same from being added in next if statement
        CERN_CV_O1.addNKAP(component)
        dProblemNomenclatureId = 0.0
      }

      // If either diagnosis or problem was cross mapped, save the data
      if (dDiagnosisNomenclatureId > 0.0 || dProblemNomenclatureId > 0.0) {
        // Save the new condition nomenclature id, so it can display an indicator later
        component.m_nNewConditionType = iType;
        component.m_dNewConditionNomenclatureId = dOriginatingNomenclatureId;
        component.m_nNewConditionIndx = dConditionIndx;

        var dDiagNomenID = parseFloat(dDiagnosisNomenclatureId);
        var dDiagTransNomenID = parseFloat(dDiagnosisTransitionNomenclatureId);
        var sDisplay = sAnnotatedDisplay;
        var dProbNomenID = parseFloat(dProblemNomenclatureId);
        var dOrigNomenID = parseFloat(dOriginatingNomenclatureId);
        var dDxAddType = parseFloat(component.getVisitAddType());
        var dDxAddClass = parseFloat(component.getVisitAddClass());
        var dPlAddType = parseFloat(component.getActiveAddType());
        var dPlAddClass = parseFloat(component.getActiveAddClass());
        var dDxAddConf = parseFloat(component.getVisitAddConf());
        var iDxPriority = (dDiagNomenID > 0.0) ? iPriority : 0;
        if(sDisplay.indexOf('"') == -1)
        {
            sDisplay = '"' + sDisplay + '"';
        }
        paramString = "^MINE^," + compCriterion.person_id.toFixed(1) + "," + compCriterion.encntr_id.toFixed(1) + "," + compCriterion.provider_id.toFixed(1) + "," + compCriterion.position_cd.toFixed(1) +
          "," + compCriterion.ppr_cd.toFixed(1) + "," + iType + "," + dDiagNomenID.toFixed(1) + "," + dProbNomenID.toFixed(1) + "," +
          dOrigNomenID.toFixed(1) + "," + nLifeStatusCodeFlag + "," + dDxAddType.toFixed(1) + "," + dDxAddClass.toFixed(1) + "," + dPlAddType.toFixed(1) + "," + dPlAddClass.toFixed(1) +
          "," + dDxAddConf.toFixed(1) + "," + iDxPriority + "," + dDiagTransNomenID.toFixed(1)+ "," + sDisplay;
        CERN_CV_O1.loadWithCBParameters('mp_add_condition', CERN_CV_O1.cvAddLoad, 'cv', paramString, compID);
      } else {
        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
        component.m_nRefreshCount--;
      }

      // If the most recent problem was found, we need to modify it
      var dProblemId = 0.0;
      var iProblemType = 0;
      if (mostRecentProblem) {
        dProblemId = mostRecentProblem.PROBLEM_ID;
        iProblemType = mostRecentProblem.PROBLEM_TYPE_FLAG;
      }

      if (dProblemId > 0.0) {
        if (iProblemType == 2) {
          CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
          component.m_nRefreshCount--;
          alertMsg = i18n.discernabu.consolproblem_o1.PROBLEM_TYPE_FLAG_2_MSG;
          alert(alertMsg);
        } else {
          // set the flag to 1 = Active
          component.m_nNewConditionType = iType;
          component.m_dNewConditionNomenclatureId = dOriginatingNomenclatureId;
          component.m_nNewConditionIndx = dConditionIndx;

          paramString = "^MINE^," + dProblemId.toFixed(1) + "," + compCriterion.provider_id.toFixed(1) + "," + compCriterion.ppr_cd.toFixed(1) + "," + nLifeStatusCodeFlag + "," + 0 + "," + 0;
          CERN_CV_O1.loadWithCBParameters('mp_modify_problem', CERN_CV_O1.cvRefresh, 'cv', paramString, compID);
        }
      } else {
        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
        component.m_nRefreshCount--;
      }

      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
    },

    /**
     * Removes the selected diagnoses by cycling through them and calling script to remove
     * then calling function to repritize what is left over
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    removeDiagnoses: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      if (component.isMenuDithered("mnuCVRemoveDiagnoses")) {
        return;
      } else {
        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);
        var jqCvSelRows = CERN_CV_O1.getSelectedRows("cv" + compID);
        var nIndex = 0;

        var arrDiagnoses = [];
        // Loop through all the selected items
        for (var i = 0, l = jqCvSelRows.length; i < l; i++) {
          // Get the condition
          var rowId = jqCvSelRows[i].id;
          nIndex = rowId.indexOf("IDX") + 3;
          //parsefloat parses numbers until the first non number character is hit then returns what it parsed
          var dConditionIndx = parseFloat(rowId.substring(nIndex));
          var condition = CERN_CV_O1.getCondition(0, dConditionIndx, compID);

          // Does this diagnosis have an existing problem in an inactivated or resolved status ?  If Diagnosis 
          // in This Visit is being removed and  there is an associated Problem in a resolved/inactivated
          // status, then the resolved/inactivated Problem will now appear in the Historical view.  Open the Historical 
          // section, if it is being populated.         
          var mostRecentProblem = CERN_CV_O1.getMostRecentProblem(0.0, dConditionIndx, compID);
          var dNomenclatureId = parseFloat(rowId.substring(2));

          // Loop through all the diagnoses
          var iNumberOfDiagnoses = condition.DIAGNOSES.length;
          for (var iDiagnosisIndex = 0, dxLength = iNumberOfDiagnoses; iDiagnosisIndex < dxLength; iDiagnosisIndex++) {
            var diagnosis = condition.DIAGNOSES[iDiagnosisIndex];

            if (diagnosis.ENCOUNTER_ID == component.m_compObject.criterion.encntr_id) {
              // This item is a current diagnosis, remove it

              arrDiagnoses.push(parseFloat(diagnosis.DIAGNOSIS_ID));

              // set the conditionType. Populate the object variables because they are needed in CVRefresh
              component.m_nNewConditionType = 0;
              component.m_dNewConditionNomenclatureId = dNomenclatureId;
              component.m_nNewConditionIndx = dConditionIndx;

              if (mostRecentProblem === null || mostRecentProblem.LIFECYCLE_STATUS_MEAN === "RESOLVED" || mostRecentProblem.LIFECYCLE_STATUS_MEAN === "INACTIVE") {

                // If the Historical section is closed, expand the section since something was added.
                if (component.m_bHistoricalExpanded === false) {
                  CERN_CV_O1.initializeToggle("cvHistoricalToggle" + compID, "HXSEC", true, compID);
                }
              }
            }
          }
        }

        if (arrDiagnoses.length > 0) {
          // Add 1 processing count to handle loadWithCBParameters
          //Add 1 processing count to pad it so that both requests can be made before any refresh attempt
          CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 2, true, CERN_CV_O1.updateCVActions, compID);
          component.m_nRefreshCount += 2;
          var sendAr = CERN_CV_O1.getServiceCallArrayForBatchRemove(arrDiagnoses, compID);
          CERN_CV_O1.loadWithCBParameters('mp_modify_diagnosis', CERN_CV_O1.cvRefresh, 'cv', sendAr.join(","), compID);

          //this function internally adds 1 to the processing count.
          CERN_CV_O1.reprioritizeAndModifyDiagnoses(arrDiagnoses, compID);

          //extra refresh count was added to prevent a refresh in between two calls
          //this call will remove extra refresh count and trigger refresh if other calls both finished by this point
          CERN_CV_O1.refreshConditions(compID);
        }

        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
      }
    },

    /**
     * Handles clicking an option in the priority drop down menu to update the inline priority
     *
     * @param {Element} element - drop down menu row element
     * @param {Element} menu - drop down menu hover div
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    dropMenuModifyDiagnosisPriority: function(element, menu, compID) {
      var newPriority = $(element).children().filter(':first').text();
      if (newPriority == '--') newPriority = "";

      var parentRow = CERN_CV_O1.getParentRowFromElement(menu);
      var rowId = $(parentRow).attr('id');
      var priorityInput = $("#" + rowId).find('input');
      $(priorityInput).val(newPriority);

      CERN_CV_O1.modifyDiagnosisPriority(rowId, compID);
    },

    /**
     * Handles changing the value in the priority input box and saving the changes
     *
     * @param {Element} element - priority drop down input box
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    inlineModifyDiagnosisPriority: function(element, compID) {
      var row = CERN_CV_O1.getParentRowFromElement(element);
      var rowID = row.id;
      CERN_CV_O1.modifyDiagnosisPriority(rowID, compID);
    },

    /**
     * Handles saving the priority in the input box to the database
     *
     * @param {string} rowID - the unique rowId for the condition being saved
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    modifyDiagnosisPriority: function(rowID, compID) {
      // Update the condition type and condition index so that the cvRefresh will refresh the Win32 diagnoses collection.
      var component = getCompObjByStringOrIntId(compID);
      component.m_nNewConditionType = 0;
      component.m_nNewConditionIndx = CERN_CV_O1.getConditionIndex(rowID, compID);

      var priority = CERN_CV_O1.getPriorityByRowID(rowID, compID);
      //must change an empty display value back to a numerical value
      if (priority == "") {
        priority = 0;
      }

      var reprioritizedDiagnoses = CERN_CV_O1.reprioritizeDiagnosesByPriority(rowID, priority, compID);
      CERN_CV_O1.modifyReprioritizedDiagnoses(reprioritizedDiagnoses, compID);
    },

    /**
     * Handles reprioritizing all diagnoses when removing one or more diagnoses
     *
     * @param {Array} arrDxIDsToRemove - collection of diagnosis ids that will be removed
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    reprioritizeAndModifyDiagnoses: function(arrDxIDsToRemove, compID) {
      var reprioritizedDiagnoses = CERN_CV_O1.reprioritizeDiagnosesListForRemove(arrDxIDsToRemove, compID);
      //If reprioritizedDiagnoses is empty, all conditions have been removed from the section, and do not need to be reprioritized.
      if (!reprioritizedDiagnoses || reprioritizedDiagnoses.GetCount() < 1)
        return;
      CERN_CV_O1.modifyReprioritizedDiagnoses(reprioritizedDiagnoses, compID);
    },

    /**
     * Returns a collection of diagnosis ids from the corresponding collection of Win32 diagnosis objects
     *
     * @param {PVCollection} diagnosisCollection - collection of win32 diagnosis objects
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {Array} A collection of diagnosis Ids
     */
    getDiagnosisIDsFromCollection: function( /*PVCollection*/ diagnosisCollection, compID) {
      var diagnosisIDs = [];
      if (!diagnosisCollection) {
        return diagnosisIDs;
      }
      for (var idx = 0, count = diagnosisCollection.GetCount(); idx < count; idx++) {
        var clinicalDiagnosis = diagnosisCollection.GetItem(idx);
        if (clinicalDiagnosis) {
          diagnosisIDs.push(clinicalDiagnosis.DiagnosisID);
        }
      }

      return diagnosisIDs;
    },

    /**
     * Returns a collection of priorities from the corresponding collection of Win32 diagnosis objects
     *
     * @param {PVCollection} diagnosisCollection - collection of win32 diagnosis objects
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {Array} A collection of priority values
     */
    getPrioritiesFromCollection: function( /*PVCollection*/ diagnosisCollection, compID) {
      var priorities = [];
      if (!diagnosisCollection) {
        return priorities;
      }
      for (var idx = 0, count = diagnosisCollection.GetCount(); idx < count; idx++) {
        var clinicalDiagnosis = diagnosisCollection.GetItem(idx);
        if (clinicalDiagnosis) {
          priorities.push(clinicalDiagnosis.ClinicalPriority);
        }
      }

      return priorities;
    },

    /**
     * Modifies reqprioritized diagnoses based on the passed in diagnosis collection containing new priorities
     *
     * @param {PVCollection} diagnosisCollection - collection of win32 diagnosis objects
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    modifyReprioritizedDiagnoses: function( /*PVCollection*/ diagnosisCollection, compID) {
      if (!diagnosisCollection || diagnosisCollection.GetCount() < 1) {
        alert(i18n.discernabu.consolproblem_o1.DIAGNOSIS_MODIFY_FAILURE);
        return;
      }

      var component = getCompObjByStringOrIntId(compID);

      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);
      component.m_nRefreshCount++;
      var diagnosisIDs = CERN_CV_O1.getDiagnosisIDsFromCollection(diagnosisCollection, compID);
      var priorities = CERN_CV_O1.getPrioritiesFromCollection(diagnosisCollection, compID);
      var sendAr = CERN_CV_O1.getServiceCallArrayForBatchModify(diagnosisIDs, priorities, compID);
      CERN_CV_O1.loadWithCBParameters('mp_modify_diagnosis', CERN_CV_O1.cvRefresh, 'cv', sendAr.join(","), compID);
    },

    /**
     * Returns the most recent diagnois from the passed in condition.
     * mp_get_conditions orders diagnosis by date so the first diagnosis in the list is the most recent
     *
     * @param {Condition} condition - a condition struct from mp_get_conditions
     */
    getMostRecentDiagnosisFromCondition: function(condition) {
      if (condition) {
        if (condition.DIAGNOSES.length > 0) {
          var mostRecentDiagnosis = condition.DIAGNOSES[0];
          return mostRecentDiagnosis;
        }
      }
      return null;
    },

    /**
     * Returns parameter string to be used with mp_modify_diagnosis for removing diangoses
     *
     * @param {Array} diagnosisIDs - collection of diagnosis ids
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {string} Parameter string for mp_modify_diagnosis
     */
    getServiceCallArrayForBatchRemove: function(diagnosisIDs, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var providerId = component.m_compObject.criterion.provider_id.toFixed(1);
      var pprCd = component.m_compObject.criterion.ppr_cd.toFixed(1);
      var patientId = component.m_compObject.criterion.person_id.toFixed(1);
      var removeInd = 1;
      var commentInd = 0;

      var sendAr = [];

      sendAr.push("^MINE^");
      sendAr.push(providerId);
      sendAr.push(pprCd);
      sendAr.push(patientId);
      sendAr.push(CERN_CV_O1.getDoubleArrayString(diagnosisIDs, "DIAGNOSIS_ID"));
      sendAr.push(CERN_CV_O1.getEmptyArrayString(diagnosisIDs.length, "0.0"));
      sendAr.push(CERN_CV_O1.getEmptyArrayString(diagnosisIDs.length, "0.0"));
      sendAr.push(CERN_CV_O1.getEmptyArrayString(diagnosisIDs.length, "\"\""));
      sendAr.push(commentInd);
      sendAr.push(CERN_CV_O1.getEmptyArrayString(diagnosisIDs.length, "0"));
      sendAr.push(CERN_CV_O1.getEmptyArrayString(diagnosisIDs.length, "0"));
      sendAr.push(removeInd);

      return sendAr;
    },

    /**
     * Returns parameter string to be used with mp_modify_diagnosis for modifying priorities
     *
     * @param {Array} diagnosisIDs - collection of diagnosis ids
     * @param {Array} priorityArray - collection of priority values
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {string} Parameter string for mp_modify_diagnosis
     */
    getServiceCallArrayForBatchModify: function(diagnosisIDs, priorityArray, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var providerId = component.m_compObject.criterion.provider_id.toFixed(1);
      var pprCd = component.m_compObject.criterion.ppr_cd.toFixed(1);
      var patientId = component.m_compObject.criterion.person_id.toFixed(1);
      var removeInd = 0;
      var commentInd = 0;

      var sendAr = [];

      sendAr.push("^MINE^");
      sendAr.push(providerId);
      sendAr.push(pprCd);
      sendAr.push(patientId);
      sendAr.push(CERN_CV_O1.getDoubleArrayString(diagnosisIDs, "DIAGNOSIS_ID"));
      sendAr.push(CERN_CV_O1.getEmptyArrayString(diagnosisIDs.length, "0.0"));
      sendAr.push(CERN_CV_O1.getEmptyArrayString(diagnosisIDs.length, "0.0"));
      sendAr.push(CERN_CV_O1.getEmptyArrayString(diagnosisIDs.length, "\"\""));
      sendAr.push(commentInd);
      sendAr.push(CERN_CV_O1.getArrayString(priorityArray));
      sendAr.push(CERN_CV_O1.getEmptyArrayString(diagnosisIDs.length, "1"));
      sendAr.push(removeInd);

      return sendAr;
    },

    /**
     * Returns a collection of property values corresponding to the the passed
     * in proprty name that is a memeber of the objects in the object array
     *
     * @param {Array} objects - collection of objects
     * @param {string} propName - the string name of a valid property
     * @return {Array} A collection of values for the given property.
     */
    getPropertyArray: function(objects, propName) {
      var propertyArray = [];
      for (var i = 0, l = objects.length; i < l; i++) {
        propertyArray.push(objects[i][propName]);
      }

      return propertyArray;
    },

    /**
     * Generates an empty parameter string that has a length equal to arrayCount
     * ex. value(0.0,0.0,0.0) ex. value("","","")
     *
     * @param {numeric} arrayCount - the length of the generated array
     * @param {string} emptyValue - the value used to generate the parameter string
     * @return {string} An empty parameter string
     */
    getEmptyArrayString: function(arrayCount, emptyValue) {
      var emptyArray = [];
      for (var i = 0, l = arrayCount; i < l; i++) {
        emptyArray.push(emptyValue);
      }
      var arrayString = "value(";
      arrayString += emptyArray.join(",");
      arrayString += ")";

      return arrayString;
    },

    /**
     * Generates a parameter string for the string values contained in the passed in array
     * ex. value("value 1","value 2","value 3")
     *
     * @param {Array} valueArray - collection of string values
     * @return {string} A parameter string containing the passed in string values
     */
    getArrayString: function(valueArray) {
      var stringArray = [];
      for (var i = 0, l = valueArray.length; i < l; i++) {
        stringArray.push(valueArray[i]);
      }

      var string = "value(";
      string += stringArray.join(",");
      string += ")";

      return string;
    },

    /**
     * Generates a parameter string for the double values contained in the passed in array
     * ex. value(1.0,2.0,3.0)
     *
     * @param {Array} doubleArray - collection of numerical values
     * @return {string} A parameter string containing the passed in double values
     */
    getDoubleArrayString: function(doubleArray) {
      var stringArray = [];
      for (var i = 0, l = doubleArray.length; i < l; i++) {
        stringArray.push(doubleArray[i].toFixed(1));
      }

      var string = "value(";
      string += stringArray.join(",");
      string += ")";

      return string;
    },

    /**
     * Generates a parameter string in a standard format that is passed to the script.
     *
     * @param {Array} valueArray - string that has to be formatted to the standards.
     * @return {string} A parameter string containing the passed in string format
     */ 
	
	getStringArrayString:function(valueArray){
		var stringArray = [];			
		var strArr = [];
		var string;
		for(var i = 0, l = valueArray.length; i < l; i++)
		{		
			stringArray.push(valueArray[i]);
			var valueString = stringArray[i];			
			if (valueString.indexOf('"') > -1) 
			{
				strArr = valueString.split('"');
				valueString = "value(concat(";
				for (var i = 0; i < strArr.length; i++) 
				{					
					if((strArr[i].length) != 0)
					{
						valueString += '\"';	
						valueString += strArr[i];
						if(i != (strArr.length -1))
						{
							valueString += '\",';
						}
						else
						{
							valueString +='\"';	
						}
					}
					
					if(i != (strArr.length - 1))
					{
						if (strArr.length > (i+2))
						{
							valueString += "char(34),";
						}
						else
						{
							if((strArr[i+1].length) != 0)
							{
								valueString += "char(34),";
							}
							else
							{
								valueString += "char(34)";
							}
						}
					}					
				}
				valueString += "))";				
				string = valueString;							
			}
			else
			{
				string = "value(\"";
				string += stringArray.join("\",\"");
				string += "\")";
			}
		}		
		return string;
	},

    /**
     * Returns collection of condition indexes for passed in rowIDs
     *
     * @param {Array} rowIDs - collection of condition rowIDs
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {Array} A collection of condition indexes
     */
    getConditionIndexes: function(rowIDs, compID) {
      var conditionIndexes = [];
      for (var i = 0; i < rowIDs.length; i++) {
        conditionIndexes.push(CERN_CV_O1.getConditionIndex(rowIDs[i], compID));
      }

      return conditionIndexes;
    },

    /**
     * Returns condition index for passed in rowID
     *
     * @param {string} rowID - condition row id
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {numeric} Condition index
     */
    getConditionIndex: function(rowID, compID) {
      var ConditionIndex = -1;
      var start = rowID.indexOf("IDX") + 3;
      var end = rowID.indexOf("UNIQ");
      ConditionIndex = rowID.substring(start, end);
      return ConditionIndex;
    },

    /**
     * Returns priority value for passed in condition row element
     *
     * @param {Element} row - row DOM element
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {numeric} Priority value
     */
    getPriorityByRow: function(row, compID) {
      var priority = $(row).find("input").first().val();
      return priority;
    },

    /**
     * Returns priority value for passed in condition rowID
     *
     * @param {string} rowID - condition row id
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {numeric} Priority value
     */
    getPriorityByRowID: function(rowID, compID) {
      var priority = $("#" + rowID).find('input').val();
      return priority;
    },

    /**
     * Returns a collection of conditions based on passed in row ids
     *
     * @param {Array} rowIDs - collection of condition row ids
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {Array} Collection of conditions
     */
    getConditionsByRowIds: function(rowIDs, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var conditionIndexes = CERN_CV_O1.getConditionIndexes(rowIDs, compID);
      var modifiedConditions = [];
      if (component.m_loadedConditions) {
        var conditions = CERN_CV_O1.getThisVisitConditions(compID);
        for (var i = 0, l = conditions.length; i < l; i++) {
          var index = $.inArray(conditions[i].CONDITION_INDEX.toString(), conditionIndexes);
          if (index >= 0) {
            modifiedConditions.push(conditions[i]);
          }
        }
      }
      return modifiedConditions;
    },

    /**
     * Returns a collection of conditions in the this_visit section
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {Array} Collection of conditions
     */
    getThisVisitConditions: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      var conditions = [];
      var secThisVisit = component.m_loadedConditions.DATA.THIS_VISIT;
      $.merge(conditions, CERN_CV_O1.getConditionsBySectionList(secThisVisit));

      return conditions;
    },

    /**
     * Returns a collection of conditions from all sections
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {Array} Collection of conditions
     */
    getAllConditions: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      var conditions = [];
      var secThisVisit = component.m_loadedConditions.DATA.THIS_VISIT;
      var secActive = component.m_loadedConditions.DATA.ACTIVE;
      var secHistorical = component.m_loadedConditions.DATA.HISTORICAL;

      $.merge(conditions, CERN_CV_O1.getConditionsBySectionList(secThisVisit));
      $.merge(conditions, CERN_CV_O1.getConditionsBySectionList(secActive));
      $.merge(conditions, CERN_CV_O1.getConditionsBySectionList(secHistorical));

      return conditions;
    },

    /**
     * Returns a collection of conditions from passed in section list
     *
     * @param {Array} sectionList - ccl section struct from mp_get_conditions
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @return {Array} Collection of conditions
     */
    getConditionsBySectionList: function(sectionList, compID) {
      var conditions = [];
      for (var i = 0, l = sectionList.length; i < l; i++) {
        conditions.push(sectionList[i]);
      }

      return conditions;
    },

    /**
     * This method will obtain a list of currently seleceted highlighted conditions and proceed to perform the action
     * selected in the action menu. This method will also increment/decrement the processingUI and refresh count for
     * each problem.
     * This method should ensure that a particular condition (nomenclature ID) is only processed once per call
     * lifeCycleStatusFlag: 1 = Active, 2 = Canceled, 3 = Inactive, 4 = Resolved
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {string} mnuItemId - the string id of the menu option that was clicked
     */
    modifyProblem: function(compID, mnuItemID) {
      var component = getCompObjByStringOrIntId(compID);
      var jqMenu = $('#' + mnuItemID);
      if (jqMenu.hasClass("opts-menu-item-dthr")) {
        return;
      } else {
        // Increment the processing count
        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);

        var jqCvSelRows = CERN_CV_O1.getSelectedRows('cv' + compID);
        var cvSelLen = jqCvSelRows.length;
        var dNomenclatureId = 0.0;
        var dConditionIndx = 0;
        var nIndex = 0;

        if (cvSelLen > 0) {
          var statusFlag = 0;
          var classification2MedInd = 0;
          var confirmProblemInd = 0;

          switch (mnuItemID) {
            case "mnuCVCancel" + compID:
              statusFlag = 2;
              break;
            case "mnuCVInactive" + compID:
              statusFlag = 3;
              break;
            case "mnuCVResolve" + compID:
              statusFlag = 4;
              break;
            case "mnuCVMedical" + compID:
              classification2MedInd = 1;
              break;
            case "mnuCVConfirmProblem" + compID:
              confirmProblemInd = 1;
              break;
            default:
              statusFlag = 0;
          }

          // Use array to store uniquely selected conditions.
          var nomenArray = [];
          var nomenArrayCnt = 0;
          var nomenProcessed = false;

          //update counts so refresh will not happen until the last reply
          CERN_CV_O1.processingUI(component, "cvProcessing" + compID, cvSelLen, true, CERN_CV_O1.updateCVActions, compID);
          component.m_nRefreshCount += cvSelLen;

          for (var i = 0, l = cvSelLen; i < l; i++) {
            var rowId = jqCvSelRows[i].id;
            dNomenclatureId = (rowId.substring(2));
            dNomenclatureId = parseFloat(dNomenclatureId.replace(compID, ""));
            nIndex = rowId.indexOf("IDX") + 3;
            dConditionIndx = parseFloat(rowId.substring(nIndex));

            // Check if this condition index (Condition) has been processed already
            nomenProcessed = false;
            nomenArrayCnt = nomenArray.length;
            for (var j = 0; j < nomenArrayCnt; j++) {
              if (nomenArray[j] == dConditionIndx) {
                nomenProcessed = true;
                break;
              }
            }

            if (nomenProcessed) {
              CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
              component.m_nRefreshCount--;
              continue;
            }

            nomenArray[nomenArrayCnt] = dConditionIndx;

            var condition = CERN_CV_O1.getCondition(0, dConditionIndx, compID);
            // Do not hit script unless we have a problem ID.
            if (condition === null || condition.PROBLEMS.length === 0 || condition.PROBLEMS[0].PROBLEM_ID === 0.0) {
              CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
              component.m_nRefreshCount--;
              continue;
            }
            for (var index = 0; index < condition.PROBLEMS.length; index++) {
              var indexedProblem = condition.PROBLEMS[index];
              if (indexedProblem === null || indexedProblem.PROBLEM_ID === 0.0) {
                continue;
              }

              var dMrpProbID = parseFloat(indexedProblem.PROBLEM_ID);
              var paramString = "^MINE^," + dMrpProbID.toFixed(1) + "," + component.m_compObject.criterion.provider_id.toFixed(1) + "," + component.m_compObject.criterion.ppr_cd.toFixed(1) + "," + statusFlag + "," + classification2MedInd + "," + confirmProblemInd;
              CERN_CV_O1.loadWithCBParameters('mp_modify_problem', CERN_CV_O1.cvRefresh, 'cv', paramString, component.m_compObject.cvCompId);
            }

            // Is this problem being inactivated or resolved and does it have an existing diagnosis?  If an Active Problem 
            // is being resolved/inactivated and there is an associated Diagnosis in This Visit, then the Problem will not appear 
            // in the Historical view.  We only want to open the Historical section, if it is being populated.
            if (statusFlag == 3 || statusFlag == 4) {
              var mostRecentDiagnosis = CERN_CV_O1.getMostRecentDiagnosis(0.0, parseFloat(dConditionIndx), compID);

              if (mostRecentDiagnosis === null || mostRecentDiagnosis.ENCOUNTER_ID !== component.m_compObject.criterion.encntr_id) {

                // If the Historical section is closed, expand the section since something was added.
                if (component.m_bHistoricalExpanded === false) {
                  CERN_CV_O1.initializeToggle("cvHistoricalToggle" + compID, "HXSEC", true, compID);
                }
              }
            }

            // Save the problem condition nomenclature id, so it can display an indicator later.
            component.m_nNewConditionType = 3;
            component.m_dNewConditionNomenclatureId = dNomenclatureId;
            component.m_nNewConditionIndx = dConditionIndx;
          }
        }

        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
      }
    },

    /**
     * Return the problem object of the most recent problem in a condition defined by the given nomenclature id.
     *  This method will call getProblemByIndex with an index of 0 to return the most recent problem because the
     *  problems are sorted with the most recent one being the first item.
     * @param {Float} dNomenclatureId The source nomenclature id.
     * @param {Float} dConditionIndx The unique condition index.
     * @return {Object} The problem Object that should be used for modification.  Null if no proper problem is found.
     */
    getMostRecentProblem: function(dNomenclatureId, dConditionIndx, compID) {
      return CERN_CV_O1.getProblemByIndex(dNomenclatureId, dConditionIndx, compID, 0);
    },

    /**
     * Return the problem object of a given index in a condition defined by the given nomenclature id.
     *  This method will search through the loaded conditions to obtain the source condition.  It will return
     *  the problem object at the given index to affect problems other than the most recent problem
     * @param {Float} dNomenclatureId The source nomenclature id.
     * @param {Float} dConditionIndx The unique condition index.
     * @param {int} nIndex The index of the requested problem.
     * @return {Object} The problem Object that should be used for modification.  Null if no proper problem is found.
     */
    getProblemByIndex: function(dNomenclatureId, dConditionIndx, compID, nIndex) {
      var condition = CERN_CV_O1.getCondition(dNomenclatureId, dConditionIndx, compID);
      if (condition !== null && condition.PROBLEMS.length > nIndex) {
        // A condition is found, now get the indexed problem
        return condition.PROBLEMS[nIndex];
      }
      return null;
    },



    /**
     * Return the diagnosis object of the most recent diagnosis in a condition defined by the given nomenclature id.
     *  This method will search through the loaded conditions to obtain the source condition.  It will return
     *  the the diagnosis object of the first diagnosis in the condition because the problems are sorted with the most recent one
     *  being the first item.
     * @param {Float} dNomenclatureId The source nomenclature id.
     * @param {Float} dConditionIndx The unique condition index.
     * @return {Object} The diagnosis Object that should be used for modification.  Null if no proper diagnosis is found.
     */
    getMostRecentDiagnosis: function(dNomenclatureId, dConditionIndx, compID) {
      var condition = CERN_CV_O1.getCondition(dNomenclatureId, dConditionIndx, compID);
      if (condition) {
        // A condition is found, now get the most recent diagnosis 
        if (condition.DIAGNOSES.length > 0) {
          var mostRecentDiagnosis = condition.DIAGNOSES[0];
          return mostRecentDiagnosis;
        }
      }
      return null;
    },

    /**
     * Return the diagnosis object of the most recent diagnosis in a condition defined by the given nomenclature id.
     *  This method will search through the loaded conditions to obtain the source condition.  It will return
     *  the the diagnosis object of the first diagnosis in the condition because the problems are sorted with the most recent one
     *  being the first item.
     * @param {Float} dNomenclatureId The source nomenclature id.
     * @param {Float} dConditionIndx The unique condition index.
     * @return {Object} The diagnosis Object that should be used for modification.  Null if no proper diagnosis is found.
     */
    getMostRecentEncntrDiagnosis: function(dNomenclatureId, dConditionIndx, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var condition = CERN_CV_O1.getCondition(dNomenclatureId, dConditionIndx, compID);
      if (condition) {
        // A condition is found, now get the most recent diagnosis 
        var diagnosesLen = condition.DIAGNOSES.length;
        if (diagnosesLen > 0) {
          var mostRecentDiagnosis = 0.0;
          for (var i = 0; i < diagnosesLen; i++) {
            mostRecentDiagnosis = condition.DIAGNOSES[i];
            if (mostRecentDiagnosis.ENCOUNTER_ID == component.m_compObject.criterion.encntr_id) {
              return mostRecentDiagnosis;
            }
          }
        }
      }
      return null;
    },

    /**
     * Handles clicking the move condition icon to move a condition between sections
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {Element} icon - the icon element for the move condition button
     */
    moveConditionIcon: function(compID, icon) { //click on  double up arrow to move from one section to another
      var jqIcon = $(icon);
      var iconID = jqIcon.attr('id');
      var component = getCompObjByStringOrIntId(compID);
      var jqCvClickedRow = $(CERN_CV_O1.getParentRowFromElement(jqIcon));
      var dNomenclatureId = 0.0;
      var moveToActiveIconID = "cvHXMOV" + compID;
      var moveToThisVisitIconID = "cvACMOV" + compID;

      // Increment the processing count
      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);

      //Extract the numeric NomenclatureId.
      var rowId = jqCvClickedRow.attr('id');
      dNomenclatureId = (rowId.substring(2));
      dNomenclatureId = parseFloat(dNomenclatureId.replace(compID, ""));
      switch (iconID) {
        case moveToActiveIconID:
          CERN_CV_O1.addConditionWithType(dNomenclatureId, 2, 0, compID, 0, false, 1);
          break;
        case moveToThisVisitIconID:
          var nextPriority = 0;
          if (component.m_enableModifyPrioritization) {
            nextPriority = CERN_CV_O1.getNextPriority(compID);
          }
          CERN_CV_O1.addConditionWithType(dNomenclatureId, 0, 0, compID, nextPriority, CERN_CV_O1.validateCarryForwardForThisVisit(), 1);
          break;
        default:
      }

      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
    },

    /**
     * User has selected Move to This Visit or Move to Active from the
     * smart menu options.
     * The numeric value in the addConditionWithType parameter list
     *  specifies the type of condition that will be added.
     *      0 = New diagnosis
     *      1 = New diagnosis and new active problem
     *      2 = New active problem
     *      3 = New resolved problem
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {string} mnuItemId - the string id of the menu option that was clicked
     */
    moveConditionMenu: function(compID, mnuItemID) { //handle 'move to this visit' or 'move to active' from the MPage Menu 
      var component = getCompObjByStringOrIntId(compID);
      var jqMenuItem = $('#' + mnuItemID);
      if (jqMenuItem.hasClass("opts-menu-item-dthr") == true) {
        return;
      } else {
        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);
        component.m_nRefreshCount++;
        var jqCvSelRows = CERN_CV_O1.getSelectedRows('cv' + compID);
        var cvSelLen = jqCvSelRows.length;
        var dNomenclatureId = 0.0;
        var moveToActiveID = "mnuCVMoveToActive" + compID;
        var moveToThisVisitID = "mnuCVMoveToThisVisit" + compID;

        // Increment the processing count
        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, cvSelLen, true, CERN_CV_O1.updateCVActions, compID);
        component.m_nRefreshCount += cvSelLen;
        for (var i = 0, l = cvSelLen; i < l; i++) {
          //Extract the numeric NomenclatureId.
          var rowId = jqCvSelRows[i].id;
          dNomenclatureId = (rowId.substring(2));
          dNomenclatureId = parseFloat(dNomenclatureId.replace(compID, ""));
          switch (mnuItemID) {
            case moveToActiveID:
              CERN_CV_O1.addConditionWithType(dNomenclatureId, 2, 0, compID, 0, false, 1);
              CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
              component.m_nRefreshCount--;
              break;
            case moveToThisVisitID:
              var nextPriority = 0;
              if (component.m_enableModifyPrioritization) {
                nextPriority = CERN_CV_O1.getNextPriority(compID) + i;
              }
              CERN_CV_O1.addConditionWithType(dNomenclatureId, 0, 0, compID, nextPriority, CERN_CV_O1.validateCarryForwardForThisVisit(), 1);
              CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
              component.m_nRefreshCount--;
              break;
            default:
              CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
              component.m_nRefreshCount--;
              break;
          }
        }
        CERN_CV_O1.refreshConditions(compID);
      }
    },

    /**
     * Return the condition given the nomenclature id.
     *  This method will search through the loaded conditions to obtain the source condition.
     * @param {Float} dNomenclatureId The source nomenclature id.
     * @param {Float} dConditionIndx The unique condition index.
     * @param {Float} compId The component id.
     * @return {Object} The condition object that is found.  Null if the given nomenclature id does not have a match in the loaded condition.
     */
    getCondition: function(dNomenclatureId, dConditionIndx, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var condition = null;

      if (component.m_loadedConditions) {
        // Attempt to find the condition in all the conditions
        condition = CERN_CV_O1.findCondition(dNomenclatureId, dConditionIndx, component.m_loadedConditions.DATA.THIS_VISIT, compID);
        if (condition === null) {
          condition = CERN_CV_O1.findCondition(dNomenclatureId, dConditionIndx, component.m_loadedConditions.DATA.ACTIVE, compID);
        }
        if (condition === null) {
          condition = CERN_CV_O1.findCondition(dNomenclatureId, dConditionIndx, component.m_loadedConditions.DATA.HISTORICAL, compID);
        }
      }

      return condition;
    },
    /**
     * Get the condition in an unsorted condition array given a nomenclauture id.
     * @param {Float} dNomenclatureId The source nomenclature id.
     * @param {Float} dConditionIndx The unique condition index.
     * @param {Object} arrConditions The array of the source condition
     * @return {Object} The condition object that is found.  Null if the given nomenclature id does not have a match in the given array.
     */
    findCondition: function(dNomenclatureId, dConditionIndx, arrConditions, compID) {
      var iLength = arrConditions.length;
      for (var iIndex = 0; iIndex < iLength; iIndex++) {
        if (dNomenclatureId > 0.0) {
          if (arrConditions[iIndex].NOMENCLATURE_ID == dNomenclatureId) {
            // The condition is found, return the condition object
            return arrConditions[iIndex];
          }
        } else if (dConditionIndx > 0) {
          if (arrConditions[iIndex].CONDITION_INDEX == dConditionIndx) {
            // The condition is found, return the condition object
            return arrConditions[iIndex];
          }
        }
      }

      return null;
    },

    /**
     * Initialize the add condition selection combo box
     *
     * @param {numeric} nAddTypeDisp - the currently selected classification type
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    cvBuildConditionAddOptions: function(nAddTypeDisp, compID) {
      var component = getCompObjByStringOrIntId(compID);
      // delete the classification filter element before rebuilding it on refresh
      var jqAddTypeSpan = $("#cvAddTypeSpan" + compID);
      if (jqAddTypeSpan) {
        //Remove the menu
        $(jqAddTypeSpan).remove();
      }

      // Determine what text to show for the current classification
      jqAddTypeSpan = $('<span/>');

      var sDisplay = "";
      switch (nAddTypeDisp) {
        case 0:
          sDisplay = component.m_visitLabelDisplay;
          break;
        case 1:
          sDisplay = component.m_visitLabelDisplay + ' ' + i18n.discernabu.consolproblem_o1.AND + ' ' + component.m_activeLabelDisplay;
          break;
        case 2:
          sDisplay = component.m_activeLabelDisplay;
          break;
        case 3:
          sDisplay = component.m_historicalLabelDisplay;
          break;
        default:
          if (component.m_canAddConditionFlag === 1 || component.m_canAddConditionFlag === 3) {
            sDisplay = component.m_visitLabelDisplay;
          } else {
            sDisplay = component.m_activeLabelDisplay;
          }
          break;
      }

      var addTypeInnerHTMLArr = [];
      addTypeInnerHTMLArr.push('<span class="cvAddTypeSpan" id="cvAddTypeSpan', compID, '">', sDisplay, '&nbsp;',
        '<div class="mnu-selectWindow cv-menu2 menu-hide" id="cvAddTypeMenu', compID, '">',
        '<div class="mnu-labelbox">', sDisplay, '</div>',
        '<div class="cv-mnu-contentbox cv-mnu-contentbox-class">');

      switch (component.m_canAddConditionFlag) {
        case 1:
          addTypeInnerHTMLArr.push('<div class="cv-AddTypeOpt" id="mnuCVAddTypeTV', compID, '">', component.m_visitLabelDisplay, '</div></div></div></span>');
          break;
        case 2:
          addTypeInnerHTMLArr.push('<div class="cv-AddTypeOpt" id="mnuCVAddTypeAC', compID, '">', component.m_activeLabelDisplay, '</div>',
            '<div class="cv-AddTypeOpt" id="mnuCVAddTypeHS', compID, '">', component.m_historicalLabelDisplay, '</div></div></div></span>');
          break;
        case 3:
          addTypeInnerHTMLArr.push('<div class="cv-AddTypeOpt" id="mnuCVAddTypeTV', compID, '">', component.m_visitLabelDisplay, '</div>',
            '<div class="cv-AddTypeOpt" id="mnuCVAddTypeTvAc', compID, '">', component.m_visitLabelDisplay + ' ' + i18n.discernabu.consolproblem_o1.AND + ' ' + component.m_activeLabelDisplay, '</div>',
            '<div class="cv-AddTypeOpt" id="mnuCVAddTypeAC', compID, '">', component.m_activeLabelDisplay, '</div>',
            '<div class="cv-AddTypeOpt" id="mnuCVAddTypeHS', compID, '">', component.m_historicalLabelDisplay, '</div></div></div></span>');
          break;
      }
      jqAddTypeSpan.html(addTypeInnerHTMLArr.join(''));
      var jqSecAddTypeList = $("#cv" + compID).find('.cv-AddLabel').first();
      jqSecAddTypeList.after(jqAddTypeSpan);



      jqAddTypeSpan.click(function(e) {
        if (component.m_nProcessing === 0) {
          var jqAddTypeMenu = $("#cvAddTypeMenu" + compID);
          if (jqAddTypeMenu.hasClass('menu-hide')) {
            jqAddTypeMenu.removeClass('menu-hide');
          } else {
            jqAddTypeMenu.addClass('menu-hide');
          }

          var jqOptMenuCVAddDiv = $("#cvControlsDiv" + compID);
          var jqSpanElement = $(this);

          var spanOffset = jqSpanElement.offset();
          var optMenuOffset = jqOptMenuCVAddDiv.offset();

          jqAddTypeMenu.offset({
            top: spanOffset.top - spanOffset.top / 25,
            left: spanOffset.left
          });
        }
      });

      // Add border to the add type text on hover
      jqAddTypeSpan.mouseover(function(e) {
        var jqThis = $(this);
        if (jqThis.hasClass('cv-mnu-border') == false) {
          jqThis.addClass('cv-mnu-border');
        }
      });

      jqAddTypeSpan.mouseout(function(e) {
        var jqThis = $(this);
        if (jqThis.hasClass('cv-mnu-border') == true) {
          jqThis.removeClass('cv-mnu-border');
        }
      });

      // highlight unhighlight
      var jqAddTypeMenu = $("#cvAddTypeMenu" + compID);
      var menuRows = jqAddTypeMenu.find('.cv-AddTypeOpt');
      $.each(menuRows, function() {
        var item = $(this);
        item.mousedown(function(e) {
          CERN_CV_O1.cvHandleAddTypeEvents(compID);
        });

        item.mouseenter(function(e) {
          item.addClass('cv-mnu-hover-over');
        });

        item.mouseleave(function(e) {
          item.removeClass('cv-mnu-hover-over');
        });
      });

      CERN_CV_O1.closeMenuInit(compID, jqAddTypeMenu);
    },

    /**
     * Handles clicking on a type from the new type menu
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    cvHandleAddTypeEvents: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      var oEvent = window.event;
      var oTarget = oEvent.target || oEvent.srcElement;

      if (oEvent.type == "mousedown") {
        // check the user selection
        if (oTarget.id == "mnuCVAddTypeTV" + compID) {
          component.m_cvAddAsType = 0;
          component.m_canAddConditionPref = 0;
        } else if (oTarget.id == "mnuCVAddTypeTvAc" + compID) {
          component.m_cvAddAsType = 1;
          component.m_canAddConditionPref = 1;
        } else if (oTarget.id == "mnuCVAddTypeAC" + compID) {
          component.m_cvAddAsType = 2;
          component.m_canAddConditionPref = 2;
        } else if (oTarget.id == "mnuCVAddTypeHS" + compID) {
          component.m_cvAddAsType = 3;
          component.m_canAddConditionPref = 3;
        }

        // redraw
        CERN_CV_O1.cvBuildConditionAddOptions(component.m_cvAddAsType, compID);

        //save preference to the database
        CERN_CV_O1.WritePreferences(component.getPrefJson(), "CONSOLIDATED_PREFS", true, compID);
      }
    },

    /**
     * Writes to the app_prefs table
     * pvc_name =  CONSOLIDATED_PREFS
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    WritePreferences: function(jsonObject, prefIdent, saveAsync, compID) {
      var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
      //If SaveAync is anything but true, its set to false
      if (!saveAsync) {
        saveAsync = false;
      }
      info.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "WritePreferences");
          var jsonEval = JSON.parse(this.responseText);
          var recordData = jsonEval.RECORD_DATA;
          if (recordData.STATUS_DATA.STATUS == "Z") {
            return;
          } else if (recordData.STATUS_DATA.STATUS == "S") {
            return;
          } else {
            MP_Util.LogScriptCallError(null, this, "mp_core.js", "WritePreferences");
            var errAr = [];
            var statusData = recordData.STATUS_DATA;
            errAr.push("STATUS: " + statusData.STATUS);
            for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
              var ss = statusData.SUBEVENTSTATUS[x];
              errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
            }
            window.status = "Error saving user preferences: " + errAr.join(",");
          }
        }
      };
      var component = getCompObjByStringOrIntId(compID);
      var sJson = (jsonObject != null) ? JSON.stringify(jsonObject) : "";
      var ar = ["^mine^", component.m_compObject.criterion.provider_id + ".0", "^" + prefIdent + "^", "~" + sJson + "~"];
      if (CERN_BrowserDevInd) {
        var url = "MP_MAINTAIN_USER_PREFS?parameters=" + ar.join(",");
        info.open('GET', url, saveAsync);
        info.send(null);
      } else {
        info.open('GET', "MP_MAINTAIN_USER_PREFS", saveAsync);
        info.send(ar.join(","));
      }
    },

    /**
     * Decrements processing and refresh counts.
     * Will refresh when refresh count reaches zero.
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    refreshConditions: function(compID) {
      var component = getCompObjByStringOrIntId(compID);
      CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
      component.m_nRefreshCount--;
      if (component.m_nRefreshCount <= 0) {
        // Remember the current expand situation
        component.m_bHistoricalExpanded = CERN_CV_O1.isExpanded("cvHistoricalToggle" + compID);
        component.m_bActiveExpanded = CERN_CV_O1.isExpanded("cvActiveToggle" + compID);

        var refreshAr = [];
        refreshAr.push("^MINE^", component.m_compObject.criterion.person_id + ".0", component.m_compObject.criterion.provider_id + ".0", component.m_compObject.criterion.encntr_id + ".0", component.m_compObject.criterion.ppr_cd + ".0", component.m_compObject.criterion.position_cd + ".0", "^" + component.m_compObject.criterion.category_mean + "^", component.getDefaultSearchVocab() + ".0", "1");
        MP_Core.XMLCclRequestWrapper(component, "MP_GET_CONDITIONS", refreshAr, true);
      }
    },

    /**
     * Callback function when adding a new condition.
     * Handles reply checking and refreshing.
     *
     * @param {JSON} xhr - json string reply from ccl script
     * @param {string} sec - component identifier
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {numeric} functionID - type of json data that was received
     */
    cvAddLoad: function(xhr, sec, compID, functionID) {
      var component = getCompObjByStringOrIntId(compID);
      var msgCondition = xhr;
      var alertMsg = "";
      var jsonCondition = null;
      var noProblemPriv = false;
      var noDiagnosisPriv = false;
      var newFunctionID = functionID;
      if (msgCondition) {
        jsonCondition = JSON.parse(msgCondition);
      }

      if (jsonCondition) {

        var m_nNewConditionType = jsonCondition.CONDITION_REPORT.NEWCONDITIONTYPE;

        if (jsonCondition.CONDITION_REPORT.PROBLEM.length > 0 && jsonCondition.CONDITION_REPORT.PROBLEM[0].RECORD_DATA.PRIVILEGE_IND === 0) {
          noProblemPriv = true;
        }

        if (jsonCondition.CONDITION_REPORT.DIAGNOSIS.length > 0 && jsonCondition.CONDITION_REPORT.DIAGNOSIS[0].RECORD_DATA.PRIVILEGE_IND === 0) {
          noDiagnosisPriv = true;
        }

        if (noProblemPriv && noDiagnosisPriv) {
          alertMsg = i18n.discernabu.consolproblem_o1.NO_PRIVS_MSG;
          alert(alertMsg);
        } else if (noProblemPriv) {
          if (m_nNewConditionType === 3) {
            alertMsg = i18n.discernabu.consolproblem_o1.NO_ADD_CONDITION_MSG.replace('{0}', component.m_historicalLabelDisplay);
          } else {
            alertMsg = i18n.discernabu.consolproblem_o1.NO_ADD_CONDITION_MSG.replace('{0}', component.m_activeLabelDisplay);
          }
          alert(alertMsg);
        } else if (noDiagnosisPriv) {
          alertMsg = i18n.discernabu.consolproblem_o1.NO_ADD_CONDITION_MSG.replace('{0}', component.m_visitLabelDisplay);
          alert(alertMsg);
        }

        // Duplicate message handling
        var sTargetSection = null;
        var bHasDiagnosisDuplicate = (jsonCondition.CONDITION_REPORT.DIAGNOSIS.length > 0 &&
          jsonCondition.CONDITION_REPORT.DIAGNOSIS[0].RECORD_DATA.DUPLICATES.length > 0);
        var bHasProblemDuplicate = (jsonCondition.CONDITION_REPORT.PROBLEM.length > 0 &&
          jsonCondition.CONDITION_REPORT.PROBLEM[0].RECORD_DATA.DUPLICATE_IND == 1);

        if (m_nNewConditionType == 1 && bHasDiagnosisDuplicate && bHasProblemDuplicate) {
          sTargetSection = component.m_visitLabelDisplay + ' ' + i18n.discernabu.consolproblem_o1.AND + ' ' + component.m_activeLabelDisplay;
        } else if (m_nNewConditionType == 3 && bHasProblemDuplicate) {
          sTargetSection = component.m_historicalLabelDisplay;
        } else if (bHasDiagnosisDuplicate) {
          sTargetSection = component.m_visitLabelDisplay;
        } else if (bHasProblemDuplicate) {
          sTargetSection = component.m_activeLabelDisplay;
        }

        if (sTargetSection) {
          var sDuplicateMessage = i18n.discernabu.consolproblem_o1.DUPLICATE_MSG.replace(/\{0\}/g, sTargetSection);
          alert(sDuplicateMessage);
          component.m_dNewConditionNomenclatureId = 0.0;
          component.m_nNewConditionIndx = 0;
        }

        if (jsonCondition.CONDITION_REPORT.DIAGNOSIS.length > 0) {
          newFunctionID = 0;
        } else {
          newFunctionID = 2;
        }

        // Always refresh to simplify the logic
        CERN_CV_O1.cvRefresh(xhr, component.m_compObject.sec, compID, newFunctionID);

        // after adding diagnosis, fire even for listeners to handle.
        component.fireDiagnosisAddedEvent();
      }
    },

    /**
     * Callback function when modifying a condition.
     * Handles reply checking and refreshing.
     *
     * @param {JSON} xhr - json string reply from ccl script
     * @param {string} sec - component identifier
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {numeric} functionID - type of json data that was received
     */
    cvRefresh: function(xhr, sec, compID, functionID) {
      var component = getCompObjByStringOrIntId(compID);
      var probDxUtils = component.getProbDxUtilsObject();
      var msgCondition = xhr;
      var alertMsg = "";
      var jsonCondition = "";
      var cRpt = "";
      var cRptLen = 0;

      // Refresh the appropriate diagnosis or problem collection
      if (probDxUtils) {
        if (component.m_nNewConditionType == 0 && (component.m_dNewConditionNomenclatureId > 0.0 || component.m_nNewConditionIndx > 0)) {
          try {
            probDxUtils.RefreshDiagnosisCollection(component.m_compObject.criterion.person_id, component.m_compObject.criterion.encntr_id);
          } catch (err) {
            //suppress dll errors
          }
        } else if ((component.m_nNewConditionType == 2 || component.m_nNewConditionType == 3) && (component.m_dNewConditionNomenclatureId > 0.0 || component.m_nNewConditionIndx > 0)) {
          try {
            probDxUtils.RefreshProblemCollection(component.m_compObject.criterion.person_id);
          } catch (err) {
            //suppress dll errors
          }
        } else if (component.m_nNewConditionType == 1 && (component.m_dNewConditionNomenclatureId > 0.0 || component.m_nNewConditionIndx > 0)) {
          try {
            probDxUtils.RefreshDiagnosisCollection(component.m_compObject.criterion.person_id, component.m_compObject.criterion.encntr_id);
            probDxUtils.RefreshProblemCollection(component.m_compObject.criterion.person_id);
          } catch (err) {
            //suppress dll errors
          }
        } else {
          try {
            probDxUtils.RefreshDiagnosisCollection(component.m_compObject.criterion.person_id, component.m_compObject.criterion.encntr_id);
            probDxUtils.RefreshProblemCollection(component.m_compObject.criterion.person_id);
          } catch (err) {
            // suppress dll errors
          }
        }
      }
      if (msgCondition) {
        jsonCondition = JSON.parse(msgCondition);
      }

      if (functionID === 0) {
        cRpt = jsonCondition.CONDITION_REPORT.DIAGNOSIS[0].RECORD_DATA;
      } else if (functionID === 1) {
        cRpt = jsonCondition.CONDITION_DATA;
      } else if (functionID === 2) {
        cRpt = jsonCondition.CONDITION_REPORT.PROBLEM[0].RECORD_DATA;
      } else if (functionID === 3) {
        cRpt = jsonCondition.DIAGNOSIS_REPLY;
      }

      if (functionID === 1 && cRpt.PRIVILEGE_IND === 0) {
        // Finished processing, decrement the count, and refresh the menu
        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
        component.m_nRefreshCount--;

        alert(i18n.discernabu.consolproblem_o1.NO_ADD_CONDITION_MSG.replace('{0}', component.m_activeLabelDisplay));

        CERN_CV_O1.updateCVMenu(compID);
        return;
      }

      if (functionID === 3 && cRpt.SUCCESS_IND === 0) {
        // Finished processing, decrement the count, and refresh the menu
        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
        component.m_nRefreshCount--;

        alert(i18n.discernabu.consolproblem_o1.DIAGNOSIS_MODIFY_FAILURE);

        CERN_CV_O1.updateCVMenu(compID);
        return;
      }

      if (jsonCondition && cRpt.PRIVILEGE_IND === 0) {
        // Finished processing, decrement the count, and refresh the menu
        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
        component.m_nRefreshCount--;

        CERN_CV_O1.updateCVMenu(compID);
        return;
      }

      CERN_CV_O1.refreshConditions(compID);
    },

    /**
     * Check whether a toggle element is expanded.
     * @param {String} sElementId The target element id.  This must be a valid id.
     * @return {Boolean} True for expanded, false otherwise.
     */
    isExpanded: function(sElementId) {
      var jqToggleElement = $('#' + sElementId);

      //If toggle does not exist (as a span), simply return false
      if (jqToggleElement.length !== 0 && jqToggleElement.get(0).tagName != "SPAN") {
        return false;
      }

      //If the toggle exists (as a span), check the next tbody
      //for the expanded state
      var jqRow = jqToggleElement;
      while ((jqRow.length !== 0 && jqRow.get(0).tagName != "TBODY")) {
        jqRow = jqRow.parent();
      }
      jqRow = jqRow.next('tbody');

      return !jqRow.hasClass("cv-closed");
    },

    /**
     * Builds the classification menu
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {numeric} filterFlag - the currently selected filter
     */
    cvBuildClassificationMenu: function(compID, filterFlag) {
      // delete the classification filter element before rebuilding it on refresh
      var component = getCompObjByStringOrIntId(compID);
      var jqClassificationSpan = $("#cvClassFilterSpan" + compID);
      if (jqClassificationSpan) {
        // Remove the menu
        jqClassificationSpan.remove();
      }

      // Determine what text to show for the current classification
      var classType = "";
      switch (filterFlag) {
        case 0:
          classType = i18n.discernabu.consolproblem_o1.ALL;
          break;
        case 1:
          classType = i18n.discernabu.consolproblem_o1.MEDICAL_AND_PATIENT_STATED;
          break;
      }

      var jqClassificationSpan = $('<span/>');
      var classInnerHTMLArr = [];
      classInnerHTMLArr.push('<span class="cvClassFilterSpan" id="cvClassFilterSpan', compID, '">', classType, '&nbsp;',
        '<div class="mnu-selectWindow cv-menu2 menu-hide" id="cvClassFilterMenu', compID, '">',
        '<div class="mnu-labelbox">', classType, '</div>',
        '<div class="cv-mnu-contentbox">',
        '<div class="cv-ClassOpt" id="mnuCVClassificationAll', compID, '">', i18n.discernabu.consolproblem_o1.ALL, '</div>',
        '<div class="cv-ClassOpt" id="mnuCVClassificationPSMed', compID, '">', i18n.discernabu.consolproblem_o1.MEDICAL_AND_PATIENT_STATED, '</div></div></div></span>');
      jqClassificationSpan.html(classInnerHTMLArr.join(''));

      var jqSecClassificationTgl = $("#cv" + compID).find('.cv-ClassFilterLabel').first();
      jqSecClassificationTgl.after(jqClassificationSpan);

      jqClassificationSpan.click(function(e) {
        if (component.m_nProcessing === 0) {
          var jqClassFilterMenu = $("#cvClassFilterMenu" + compID);
          if (jqClassFilterMenu.hasClass("menu-hide") == true) {
            jqClassFilterMenu.removeClass("menu-hide");
          }

          var jqOptMenuCVClassDiv = $("#cvClassificationDiv" + compID);
          var jqSpanElement = $("#cvClassFilterSpan" + compID);

          var spanOffset = jqSpanElement.offset();
          var optMenuOffset = jqOptMenuCVClassDiv.offset();

          jqClassFilterMenu.offset({
            top: optMenuOffset.top,
            left: spanOffset.left
          });
        }
      });

      jqClassificationSpan.mouseover(function(e) {
        if ($(this).hasClass('cv-mnu-border') == false) {
          $(this).addClass('cv-mnu-border');
        }
      });

      jqClassificationSpan.mouseout(function(e) {
        if ($(this).hasClass('cv-mnu-border') == true) {
          $(this).removeClass('cv-mnu-border');
        }
      });

      // highlight unhighlight
      var jqClassFilterMenu = $("#cvClassFilterMenu" + compID);
      var menuRows = jqClassFilterMenu.find('.cv-ClassOpt');
      $.each(menuRows, function() {
        var item = $(this);
        item.mousedown(function(e) {
          CERN_CV_O1.cvHandleClassificationEvents(compID);
        });

        item.mouseenter(function(e) {
          item.addClass('cv-mnu-hover-over');
        });

        item.mouseleave(function(e) {
          item.removeClass('cv-mnu-hover-over');
        });
      });

      CERN_CV_O1.closeMenuInit(compID, jqClassFilterMenu);
    },

    /**
     * This function will process the mouse down event on the classification filter.
     * @scope global
     * @fullname cvHandleClassificationEvents
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    cvHandleClassificationEvents: function(compID) {
      function checkReady() { //Check to see if request is ready
        if (xhr.readyState === 4) { // 4 = "loaded"
          if (xhr.status === 200) { // 200 = OK
            MP_Util.LogScriptCallInfo(getCompObjByStringOrIntId(compID), this, "consolidatedproblems.js", "cvHandleClassificationEvents");
            //Refresh the data with the new selection.
            CERN_CV_O1.refreshConditions(compID);
          } else {
            CERN_CV_O1.processingUI(component, "cvProcessing" + compID, -1, true, CERN_CV_O1.updateCVActions, compID);
            component.m_nRefreshCount--;
            alert(i18n.discernabu.consolproblem_o1.FILTER_MSG);
          }
        }
      }

      var component = getCompObjByStringOrIntId(compID);
      var oEvent = window.event;
      var oTarget = oEvent.target || oEvent.srcElement;
      var paramString = "";
      if (oEvent.type == "mousedown") {
        CERN_CV_O1.processingUI(component, "cvProcessing" + compID, 1, true, CERN_CV_O1.updateCVActions, compID);
        component.m_nRefreshCount++;
        // check the user selection
        var selValue = "0";
        if (oTarget.id == "mnuCVClassificationAll" + compID) {
          selValue = "0";
        } else if (oTarget.id == "mnuCVClassificationPSMed" + compID) {
          selValue = "1";
        }

        //Save the users preference. Trying to pass in the variable (selValue) for the param string will not work. 
        // Narrative Problem Management (NPM) - Classification Filter - NPM_CLASS_VIEW_FILTER
        switch (selValue) {
          case "0":
            paramString = "^MINE^, " + component.m_compObject.criterion.provider_id + "," + "^NPM_CLASS_VIEW_FILTER^" + "," + "^0^";
            break;
          case "1":
            paramString = "^MINE^, " + component.m_compObject.criterion.provider_id + "," + "^NPM_CLASS_VIEW_FILTER^" + "," + "^1^";
            break;
        }

        var xhr = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
        xhr.onreadystatechange = checkReady;
        if (CERN_BrowserDevInd) {
          var url = "MP_MAINTAIN_USER_PREFS?parameters=" + paramString;
          xhr.open("GET", url, true);
          xhr.send(null);
        } else {
          xhr.open('GET', "mp_maintain_user_prefs", true);
          xhr.send(paramString);
        }
      }
    },

    /**
     * Updates section toggle icon display when section is expanded or collapsed
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {Element} togElement - the element that toggles sections
     * @param {string} sectionId - the string id of the section
     */
    expCol: function(compID, togElement, sectionId) {
      var jqSection = $('#' + sectionId + compID);
      var jqTogElement = $(togElement);
      var component = getCompObjByStringOrIntId(compID);
      if (jqSection.hasClass("cv-closed")) {
        jqSection.removeClass("cv-closed");
        jqTogElement.find('img').attr("src", component.m_iconPath + "/images/5323_expanded_16.png");
        jqTogElement.attr("title", i18n.HIDE_SECTION);
      } else {
        jqSection.addClass("cv-closed");
        jqTogElement.find('img').attr("src", component.m_iconPath + "/images/5323_collapsed_16.png");
        jqTogElement.attr("title", i18n.SHOW_SECTION);
        var jqOptMenuCV = $("#moreOptMenuCV" + compID);
        if (jqOptMenuCV) {
          jqOptMenuCV.addClass("menu-hide");
        }
      }
    },

    /**
     * After initializing a toggle element, this function is called to determine if the section is being
     *  closed, and if so, it un-highlights any highlighted rows.
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {Element} togElement - the element that toggles sections
     * @param {string} sectionId - the string id of the section
     */
    expColSecHdr: function(compID, togElement, sectionId) {
      var jqSection = $('#' + sectionId + compID); //Get the grandparent to the section-header (togElement) to determine if closed.
      if (jqSection.hasClass("cv-closed")) {
        jqSection.find('tr').removeClass("cv-selected");
      }
    },

    /**
     * Initialize a toggle element given the element id and the state that it should be in.  This method assumes
     *  that the element is current in an expanded state.
     *
     * @param {string} sElementId The target element id.  This must be a valid id.
     * @param {string} sectionId - the string id of the section
     * @param {boolean} bExpanded The state that the toggle should be in.
     * @param {numeric} compID - the unique id of the consolidated problems component
     */
    initializeToggle: function(sElementId, sectionId, bExpanded, compID) {
      var jqToggleElement = $('#' + sElementId);
      var component = getCompObjByStringOrIntId(compID);

      jqToggleElement.click(function() {
        CERN_CV_O1.expCol(compID, this, sectionId);
        CERN_CV_O1.expColSecHdr(compID, this, sectionId);
      }); //Call first or there will be a lag time.

      var jqSection = $('#' + sectionId + compID);
      if (!bExpanded) {
        jqSection.addClass('cv-closed');
        jqToggleElement.find('img').attr("src", component.m_iconPath + "/images/5323_collapsed_16.png");
        jqToggleElement.attr('title', i18n.SHOW_SECTION);
      } else {
        if (jqSection.hasClass("cv-closed")) {
          jqSection.removeClass("cv-closed");
          jqToggleElement.find('img').attr("src", component.m_iconPath + "/images/5323_expanded_16.png");
          jqToggleElement.attr('title', i18n.HIDE_SECTION);
        }
      }
    },

    /**
     * Closes the flyout menu
     *
     * @param {numeric} compID - the unique id of the consolidated problems component
     * @param {Element} inMenu -  menu DOM element
     */
    closeMenuInit: function(compID, inMenu) {
      $(inMenu).mouseleave(function() {
        $(this).addClass('menu-hide');
      });
    },

    /**
     * Cancels event bubbling
     *
     * @param {Event} e - event from any user event
     */
    cancelEvent: function(e) {
      e = e ? e : window.event;
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.cancelBubble = true;
      e.cancel = true;
      e.returnValue = false;
      return false;
    },

    /**
     * Object that stores a position value and provide helper methods
     *
     * @param {numeric} x - the x cordinate to store
     * @param {numeric} y - the y cordinate to store
     */
    Position: function(x, y) {
      this.X = x;
      this.Y = y;

      this.Add = function(val) {
        var newPos = new CERN_CV_O1.Position(this.X, this.Y);
        if (val) {
          if (!isNaN(val.X)) {
            newPos.X += val.X;
          }
          if (!isNaN(val.Y)) {
            newPos.Y += val.Y;
          }
        }
        return newPos;
      };

      this.Subtract = function(val) {
        var newPos = new CERN_CV_O1.Position(this.X, this.Y);
        if (val) {
          if (!isNaN(val.X)) {
            newPos.X -= val.X;
          }
          if (!isNaN(val.Y)) {
            newPos.Y -= val.Y;
          }
        }
        return newPos;
      };

      this.Min = function(val) {
        var newPos = new CERN_CV_O1.Position(this.X, this.Y);
        if (val == null) {
          return newPos;
        }
        if (!isNaN(val.X) && this.X > val.X) {
          newPos.X = val.X;
        }
        if (!isNaN(val.Y) && this.Y > val.Y) {
          newPos.Y = val.Y;
        }

        return newPos;
      };

      this.Max = function(val) {
        var newPos = new CERN_CV_O1.Position(this.X, this.Y)
        if (val == null) {
          return newPos;
        }
        if (!isNaN(val.X) && this.X < val.X) {
          newPos.X = val.X;
        }
        if (!isNaN(val.Y) && this.Y < val.Y) {
          newPos.Y = val.Y;
        }

        return newPos;
      };

      this.Bound = function(lower, upper) {
        var newPos = this.Max(lower);
        return newPos.Min(upper);
      };

      this.Check = function() {
        var newPos = new CERN_CV_O1.Position(this.X, this.Y);
        if (isNaN(newPos.X)) {
          newPos.X = 0;
        }
        if (isNaN(newPos.Y)) {
          newPos.Y = 0;
        }
        return newPos;
      };

      this.Apply = function(element) {
        if (typeof element == "string") {
          return;
        }
        if (!isNaN(this.X)) {
          element.style.left = this.X + 'px';
        }
        if (!isNaN(this.Y)) {
          element.style.top = this.Y + 'px';
        }
      };
    },

    /**
     * Returns the current cursor position
     *
     * @param {Event} eventObj - a window event
     */
    absoluteCursorPostion: function(eventObj) {
      eventObj = eventObj ? eventObj : window.event;

      if (isNaN(window.scrollX)) {
        return new CERN_CV_O1.Position(eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
          eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop);
      } else {
        return new CERN_CV_O1.Position(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY);
      }
    },

    /* Dx Assistant Methods */

    /**
     * Populates the Specificity for the Diagnosis List
     *
     * @param {Section} sectionList - the Diagnosis List retreived by mp_get_conditions.
     * @param {compID} the unique id of the consolidated problems component
     */
    PopulateDiagnosesNomenclatureSpecificity: function(sectionList, compID) {
      try {
        var component = getCompObjByStringOrIntId(compID);

        // If DiagnosisAssistant is not enabled, return.
        if (!component.m_enableDxAssistant) {
          MP_Util.LogInfo("Diagnosis Assistant is not enabled. Nomenclature Specificity will not be loaded.")
          return;
        }

        // If sectionList is not defined, return.
        if (!sectionList) {
          MP_Util.LogInfo("Diagnosis List provided was null or undefined for the Nomenclature Specificity check.")
          return;
        }
	
        // If the DiagnosisAssistant COM object could not be created, return.
        var diagnosisAssistantObj = window.external.DiscernObjectFactory("DIAGNOSISASSISTANT");
        if (!diagnosisAssistantObj) {
          MP_Util.LogError("Error creating DiagnosisAssistant COM object. Nomenclature Specificity will not be loaded.")
          return;
        }

        // If the DispatchCollection COM object could not be created, return.
        var dxColObj = window.external.DiscernObjectFactory("DISPATCHCOLLECTION");
        if(!dxColObj) {
          MP_Util.LogError("Error creating DispatchCollection COM object. Nomenclature Specificity will not be loaded.")
          return;
        }

        // Populates a ClincialDiagnosis object for each condition and adds it to the collection.
        for(var index = 0; index < sectionList.length; index++){
          var oCondition = sectionList[index]; 

          // If the user is not allowed to view the transition nomenclature (TRANSITION_PRIVILEGE_FLAG = 0), 
          // there is no need to look up the specificity for that diagnosis since the icon will not be shown.
          var diagnosis = CERN_CV_O1.getMostRecentDiagnosisFromCondition(oCondition);
          if(diagnosis.TRANSITION_PRIVILEGE_FLAG == 0){
            continue;
          }
          var dxObj = CERN_CV_O1.populateClinicalDiagnosisObj(oCondition, compID);
          if (dxObj && (dxObj.NomenclatureID || dxObj.TransitionNomenclatureID > 0)){
            dxColObj.Add(dxObj);
          }
        }

        // If the GetSpecificityCriteria COM Object could be created successfully, use the GetNomenclatureSpecificityByCriteria() 
        // method. Otherwise use the older GetNomenclatureSpecificityInfo() which doesn't support transition early.
        var retVal = false;
        try {
          var getSpecificityCriteria = window.external.DiscernObjectFactory("GETSPECIFICITYCRITERIA");
          getSpecificityCriteria.AddClinicalDiagnosisCol(dxColObj);
          getSpecificityCriteria.SetReturnEffectiveDtTmByEnum(component.m_enableEarlyTransitionDx ? 1 : 0);
          retVal = diagnosisAssistantObj.GetNomenclatureSpecificityByCriteria(getSpecificityCriteria);
        } catch (err) {
          MP_Util.LogError("Failed to create GetSpecificityCriteria COM object. Utilizing older method without early transition support. Error: " + err);
          retVal = diagnosisAssistantObj.GetNomenclatureSpecificityInfo(dxColObj);
        }

        // If the Specificity retrieval was not successful, return.
        if (!retVal) {
          MP_Util.LogError("Diagnosis Assistant Specificity retrieval was not successful.")
          return;
        }

        // Populate m_specificityMap based on the specificity response.
        for(var index = 0; index < dxColObj.GetCount(); index++) {
          var clinDxObj = dxColObj.GetAt(index);
          if (!clinDxObj) {
            continue;
          }
                  
          var specificInd = clinDxObj.NomenclatureSpecific;
          if(specificInd >= 0) {
            component.m_specificityMap[clinDxObj.DiagnosisID] = specificInd;
          }
        }
      } catch (err) {
        // Suppress dll errors
        MP_Util.LogError("An error occurred when attempting to retrieve Diagnosis Assistant nomenclature specificity. Error: " + err);
        return;
      }
    },
	  
    /**
     * Determines if the early transition preference is active and sets the m_enableEarlyTransitionDx variable of the component accordingly. 
     * This indicates if transition nomenclature should be utilized in DA and if future effective results should be returned using the nomenclature search.
     *
     * @param {component} the consolidated problems component.
     */
    SetEarlyTransitionEnabled: function(component) {
      var probDxUtils = component.getProbDxUtilsObject();

      if(!probDxUtils) {
        MP_Util.LogError("Unable to generate the ProbDxUtils COM object. Early transition will be considered inactive.");
        component.m_enableEarlyTransitionDx = false;
        return;
      }

      // If the early transition preference is not set, then the transition nomenclature should not be utilized.
      try {
        component.m_enableEarlyTransitionDx = probDxUtils.GetEarlyTransitionDxPreference(component.m_compObject.criterion.person_id, component.m_diagnosisTargetVocabCd);
      } catch(err) {
        MP_Util.LogError("Error occurred when using the ProbDxUtils.GetEarlyTransitionDxPreference COM method. Early transition will be considered inactive. Error: " + err);
        component.m_enableEarlyTransitionDx = false;
      }

      // Log result of preference lookup.
      if(component.m_enableEarlyTransitionDx){
        MP_Util.LogInfo("Early Transition preference active.");
      } else {
        MP_Util.LogInfo("Early Transition preference not active.");
      }
    },

    /**
     * Return the collection of Unspecified diagnosis.
     *
     * @param {compID} the unique id of the consolidated problems component
     * @return {var} collection value
     */
    getUnspecifiedDiagnoses: function(compID) {
      var cvUnclarifiedDiagnoses = $("#cv" + compID).find(".cv-unspecified");
      return cvUnclarifiedDiagnoses;
    },

    updateUnspecifiedDiagnoses: function(rowID, compID) {
      var component = getCompObjByStringOrIntId(compID);
      var jqSpecIcon = $('#' + rowID);
      jqSpecIcon.removeClass("cv-unspecified");
      var specifityIcon = component.m_iconPath + "/images/icd10-specific.png";
      var src = jqSpecIcon.attr('src', specifityIcon);
    },

    /**
     * Launches the Dx Assistant dialog.
     * @param {jqSelRow} The selected row that user clicked the Dx Assistant Specificity icon for.
     * @param {jqCvUnspecRows} The collection of rows that are considered unspecified - these diagnoses are passed to Dx Assistant. 
     * @param {compID} the unique id of the consolidated problems component
     */
    cvLaunchDiagnosisAssistantDlg: function(jqSelRow, jqCvUnspecRows, compID) {
      try {
        var dxColObj = window.external.DiscernObjectFactory("DISPATCHCOLLECTION");
        if (dxColObj == null) {
          MP_Util.LogError("Error creating DISPATCHCOLLECTION object - dxColObj is null.");
          return;
        }
      } catch (error) {
        // Suppress dll errors
        MP_Util.LogError(error);
        return;
      }

      var component = getCompObjByStringOrIntId(compID);
      var selRowID = 0;

      // Add the condition user selected to the list first, so DA displays it first.
      if (jqSelRow) {
        selRowID = jqSelRow.id;
        var dConditionIdx = CERN_CV_O1.getConditionIndex(selRowID, compID);
        if (selRowID.substring(0, 2) == "TV") {
          var condition = CERN_CV_O1.getCondition(0.0, dConditionIdx, compID);
          var dxObj = CERN_CV_O1.populateClinicalDiagnosisObj(condition, compID);
          if (dxObj) {
            dxColObj.Add(dxObj);
          }
        }
      }

      if (jqCvUnspecRows) {
        var rowsLen = jqCvUnspecRows.length;
        for (var rowIdx = 0; rowIdx < rowsLen; rowIdx++) {
          var rowID = jqCvUnspecRows[rowIdx].id;
          var dConditionIdx = CERN_CV_O1.getConditionIndex(rowID, compID);
          if (rowID.substring(0, 2) == "TV" && selRowID != rowID) {
            var condition = CERN_CV_O1.getCondition(0.0, dConditionIdx, compID);
            var dxObj = CERN_CV_O1.populateClinicalDiagnosisObj(condition, compID);
            if (dxObj) {
              dxColObj.Add(dxObj);
            }
          }
        }
      }

      // Launch Diagnosis Assistant
      try {
        var diagnosisAssistantObj = window.external.DiscernObjectFactory("DIAGNOSISASSISTANT");
        if (!diagnosisAssistantObj) {
          MP_Util.LogError("The diagnosisAssistantObj is null. The DiagnosisAssistant dll may not be registered or does not exist.");
          return;
        }

        // Diagnosis Collection with Privileges.
        var dxColWithPriv = diagnosisAssistantObj.IsDxAssistantNeeded(component.m_compObject.criterion.provider_id, component.m_compObject.criterion.ppr_cd, component.m_compObject.criterion.position_cd, dxColObj);
        // Only If Count > 0 launch Diagnosis Assistant.            
        if (dxColWithPriv.GetCount()) {
          // Initialize retVal for the DxAssistantDialog to false indicating nothing happened.
          var retVal = false;
          try { // Check if DxAssistant DLL contains the new DXASSISTANTCRITERIA, if not, use the old method to launch DA.
            var dxAssistantCriteriaObj = window.external.DiscernObjectFactory("DXASSISTANTCRITERIA");
            dxAssistantCriteriaObj.SetParentWnd(0.0);
            dxAssistantCriteriaObj.SetUserID(component.m_compObject.criterion.provider_id);
            dxAssistantCriteriaObj.SetPPRCD(component.m_compObject.criterion.ppr_cd);
            dxAssistantCriteriaObj.SetPatientID(component.m_compObject.criterion.person_id);
            dxAssistantCriteriaObj.SetEncounterID(component.m_compObject.criterion.encntr_id);
            dxAssistantCriteriaObj.SetCrossMapModeByEnum(0);
            dxAssistantCriteriaObj.SetDialogType(0);

            try {
              dxAssistantCriteriaObj.SetEnableEarlyTransitionDx(component.m_enableEarlyTransitionDx);
              dxAssistantCriteriaObj.SetReturnEffectiveDtTmByEnum(component.m_enableEarlyTransitionDx ? 1 : 0);
            } catch (err) {
              dxAssistantCriteriaObj.SetReturnEffectiveDtTmByEnum(0);
              MP_Util.LogError("Error occurred when attempting to set the early transition options in Diagnosis Assistant. An update of DiagnosisAssistant.dll may be required for this functionality. Error: " + err)
            }

            retVal = diagnosisAssistantObj.LaunchDiagnosisAssistantByCriteria(dxAssistantCriteriaObj, dxColObj);
          } catch (err) {
            MP_Util.LogError("Failed to create DXASSISTANTCRITERIA object: " + err);
            retVal = diagnosisAssistantObj.LaunchDiagnosisAssistant(0, component.m_compObject.criterion.provider_id, component.m_compObject.criterion.ppr_cd, component.m_compObject.criterion.person_id, component.m_compObject.criterion.encntr_id, dxColObj);
          }

          if (retVal === true) { // Dx Assistant had successfully launched and the user pressed Save or OK indicating a change was made.
            try {              
              // Refresh the Win32 Diagnoses and Problems collections since DA can update both diagnoses and problems.
              var probDxUtils = component.getProbDxUtilsObject();
              if (probDxUtils) {
                probDxUtils.RefreshDiagnosisCollection(component.m_compObject.criterion.person_id, component.m_compObject.criterion.encntr_id);
                probDxUtils.RefreshProblemCollection(component.m_compObject.criterion.person_id);
              } else {
                MP_Util.LogError("The probDxUtils object is null. The ProbDxUtils dll may not be registered or does not exist.");
              }

              // Refresh the conditions collection to reload any changes.
              CERN_CV_O1.refreshConditions(compID);
            } catch (err) {
              MP_Util.LogError("Failed to refresh conditions after Diagnosis Assistant had successfully launched & closed: " + err);
            }
          }
        }
      } catch (err) {
        // Suppress dll errors
        MP_Util.LogError("Failed to create and launch DIAGNOSISASSISTANT: " + err);
        return;
      }

      // Hide all existing comment hovers
      var commentHovers = $('cv' + compID).find('.cv-comment').css('display', 'none');
      Util.cancelBubble(window.event);
    },

    /**
     *Debounce the event so that it only gets fired once
     * @param {function} func : The function being called on the debounced event
     * @param {int} threshold : The amount of time to wait before firing the event
     */
    Debounce: function(func, threshold) {
      var timeoutID;
      var timeout = threshold || 200;

      return function debounced() {
        var obj = this;
        var args = arguments;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
          func.apply(obj, args);
        }, timeout);
      };
    },


    /* BEGIN Customized Auto Suggest Control to support Scrollbars */

    /**
         Method to create Auto Suggest Search Box.
      */
    CreateAutoSuggestBoxHtml: function(component) {
      var searchBoxHTML = [];
      var txtBoxId = "";
      var compNs = component.getStyles().getNameSpace();
      var compId = component.getComponentId();
      txtBoxId = compNs + "ContentCtrl" + compId;

      searchBoxHTML.push("<div class='search-box-div'><form name='contentForm' onSubmit='return false'><input type='text' id='", txtBoxId, "'", " class='search-box'></form></div>");
      return searchBoxHTML.join("");
    },
    /**Creates the auto suggest text box control used for search functionality
     */
    CPAddAutoSuggestControl: function(oComponent /*:ComponentToAddTo*/ ,
      oQueryHandler /*:SuggestionProvider*/ ,
      oSelectionHandler /*:SelectionHandler*/ ,
      oSuggestionDisplayHandler) /*:SuggestionDisplayHandler*/ {
      new CVAutoSuggestControl(oComponent, oQueryHandler, oSelectionHandler, oSuggestionDisplayHandler);
    }
  };


  /**
   * Returns the component object whether the id is stored as a string (QOC) or an integer (all other MPages).
   * This is to counteract the Quick Orders and Charges MPages hyjacking of the component ids.
   * @param  {string} compID - The id of the component, passed in as a string
   */
  function getCompObjByStringOrIntId(compID) {
    var intComponentId = parseInt(compID, 10); //convert the compID to a numeric value for all MPages except QOC
    var component = MP_Util.GetCompObjById(intComponentId); //try to grab the component object
    if (!component) { //if for some reason we don't have a component object, we know we are on the QOC page and we must pass in the string compID
      component = MP_Util.GetCompObjById(compID);
    }
    //component should now be an object on all MPages (this includes QOC)
    return component;
  };
}();

/**
 * An autosuggest textbox control.
 * @class
 * @scope public
 */
function CVAutoSuggestControl(oComponent /*:ComponentToAddTo*/ ,
  oQueryHandler /*:SuggestionProvider*/ ,
  oSelectionHandler /*:SelectionHandler*/ ,
  oSuggestionDisplayHandler) // /*:SuggestionDisplayHandler*/
{

  /**
   * The currently selected suggestions.
   * @scope private
   */
  this.cur /*:int*/ = 0;

  /**
   * The dropdown list layer.
   * @scope private
   */
  this.layer = null;

  this.suggestionswrapper = null;

  /**
   * Component AutoSuggest is being added to
   * @scope private.
   */
  this.component /*:Component*/ = oComponent;

  /**
   * Suggestion provider for the autosuggest feature.
   * @scope private.
   */
  this.queryHandler /*:SuggestionProvider*/ = oQueryHandler;

  /**
   * Selection Handler for the autosuggest feature.
   * @scope private.
   */
  this.selectionHandler /*:SelectionHandler*/ = oSelectionHandler;

  /**
   * Selection Display Handler for the autosuggest feature.
   * @scope private.
   */
  this.suggestionDisplayHandler /*:SuggestionDisplayHandler*/ = oSuggestionDisplayHandler;

  /**
   * The textbox to capture.
   * @scope private
   */


  this.textbox /*:HTMLInputElement*/ = _g(oComponent.getStyles().getNameSpace() + "ContentCtrl" + oComponent.getComponentId());

  /**
   * The JSON string.
   * @scope private
   */
  this.objArray /*JSON*/ = "";

  //initialize the control
  this.init();
};

/**
 * Autosuggests one or more suggestions for what the user has typed.
 * If no suggestions are passed in, then no autosuggest occurs.
 * @scope private
 * @param aSuggestions A JSON array of suggestion strings.  The JSON object passed in
 * must have a list at the first level.  This list should be the list of items that will be
 * displayed in the AutoSuggestion drop down.
 * @param defaultSelected a flag to turn off the feature that highlights the first item
 * displayed in the AutoSuggestion drop down.
 */

CVAutoSuggestControl.prototype.autosuggest = function(aSuggestions /*:Array JSON*/ , component, defaultSelected) {
  this.layer.style.width = this.textbox.offsetWidth;
  //make sure there's at least one suggestion
  this.objArray = aSuggestions;
  if (aSuggestions && aSuggestions.length > 0) {
    this.showSuggestions(aSuggestions, component, defaultSelected);
  } else {
    this.hideSuggestions();
  }
};

// /**
// * Creates the dropdown layer to display multiple suggestions.
// * @scope private
// */
CVAutoSuggestControl.prototype.createDropDown = function() {
  var oThis = this;

  this.suggestionswrapper = document.createElement("div");
  this.suggestionswrapper.className = "cv-suggestionsParent";
  //create the layer and assign styles
  this.layer = document.createElement("div");
  this.layer.className = "suggestions cv-suggestions";
  this.layer.style.display = "none";
  this.layer.style.zIndex = "9999";
  this.layer.style.overflow = "auto";
  this.layer.onscroll = function(oEvent) {
    oEvent = oEvent || window.event;
  },

  this.layer.onkeydown = function(oEvent) {
    oEvent = oEvent || window.event;
    var top = -1;
    var bottom = oThis.layer.childNodes.length;
    for (var i = 0; i < oThis.layer.childNodes.length; i++) {
      var oNode = oThis.layer.childNodes[i];

      if ((oNode.offsetTop - oThis.layer.scrollTop) > 0) {
        top = i;
        break;
      }
    }

    for (var i = 0; i < oThis.layer.childNodes.length; i++) {
      var oNode = oThis.layer.childNodes[i];

      if (oNode.offsetTop > (oThis.layer.scrollTop + oThis.layer.offsetHeight)) {
        bottom = i;
        break;
      }
    }

    if (bottom > oThis.layer.childNodes.length) {
      bottom = oThis.layer.childNodes.length;
    }

    if (oThis.cur < top || oThis.cur > bottom) {
      oThis.cur = top;
    }
    flag = 1;
    oThis.handleKeyDown(oEvent, flag);
  },

  this.layer.onmousedown =
    this.layer.onmouseup =
    this.layer.onmouseover = function(oEvent) {
      oEvent = oEvent || window.event;
      oTarget = oEvent.target || oEvent.srcElement;
      var index;

      if (oEvent.type == "mousedown") {
        index = oThis.indexOf(this, oTarget);
        oThis.selectionHandler(oThis.objArray[index], oThis.textbox, oThis.component);
      } else if (oEvent.type == "mouseover") {
        index = oThis.indexOf(this, oTarget);
        oThis.cur = index;
        oThis.highlightSuggestion(oTarget);
      } else {
        oThis.textbox.focus();
      }
  },

  Util.ia(this.suggestionswrapper, Util.gp(this.textbox));
};

// /**
// * Handles three keydown events.
// * @scope private
// * @param oEvent The event object for the keydown event.
// */
CVAutoSuggestControl.prototype.handleKeyDown = function(oEvent /*:Event*/ , flag) {
  if (this.layer.style.display != "none") {
    switch (oEvent.keyCode) {
      case 38: //up arrow
        this.previousSuggestion(flag);
        break;
      case 40: //down arrow 
        this.nextSuggestion(flag);
        break;
      case 13: //enter
        this.selectionHandler(this.objArray[this.cur], this.textbox, this.component);
        this.hideSuggestions();
        break;
    }
  }
};

// /**
// * Handles keyup events.
// * @scope private
// * @param oEvent The event object for the keyup event.
// */
CVAutoSuggestControl.prototype.handleKeyUp = function(oEvent /*:Event*/ ) {

  var iKeyCode = oEvent.keyCode;

  //for backspace (8) and delete (46), shows suggestions without typeahead
  if (iKeyCode == 8 || iKeyCode == 46) {
    if (this.textbox.value.length > 0) {
      this.queryHandler(this, this.textbox, this.component);
    } else {
      this.hideSuggestions();
    }

    //make sure not to interfere with non-character keys
  } else if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode < 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
    //ignore
  } else {
    //request suggestions from the suggestion provider
    this.queryHandler(this, this.textbox, this.component);
  }
};

// /**
// * Hides the suggestion dropdown.
// * @scope private
// */
CVAutoSuggestControl.prototype.hideSuggestions = function() {
  var oNode = this.textbox;
  while (oNode && !Util.Style.ccss(oNode, "section")) {
    oNode = Util.gp(oNode);
  }
  //at the end of the while loop, oNode should be equal to
  //the main component div that has a class of section
  if (oNode) {
    oNode.style.position = "relative";
    oNode.style.zIndex = "1";
  }

  this.layer.style.zIndex = "9999";
  this.layer.style.display = "none";
};

// /**
// * Highlights the given node in the suggestions dropdown.
// * @scope private
// * @param oSuggestionNode The node representing a suggestion in the dropdown.
// */
CVAutoSuggestControl.prototype.highlightSuggestion = function(oSuggestionNode, flag) {

  for (var i = 0; i < this.layer.childNodes.length; i++) {
    var oNode = this.layer.childNodes[i];
    if (oNode == oSuggestionNode || oNode == oSuggestionNode.parentNode) {
      oNode.className = "current";
      // Only calls this When handleKeyDown is called directly.
      if (flag == 0) {
        this.layer.scrollTop = oNode.offsetTop;
      }

    } else if (oNode.className == "current") {
      oNode.className = "";
    }
  }
};

// /**
// * Initializes the textbox with event handlers for
// * auto suggest functionality.
// * @scope private
// */
CVAutoSuggestControl.prototype.init = function() {
  //save a reference to this object
  var oThis = this;

  var flag = 0;

  //assign the onkeyup event handler
  this.textbox.onkeyup = function(oEvent) {

    //check for the proper location of the event object
    if (!oEvent) {
      oEvent = window.event;
    }
    //call the handleKeyUp() method with the event object
    oThis.handleKeyUp(oEvent);
  };
  //assign onkeydown event handler
  this.textbox.onkeydown = function(oEvent) {

    //check for the proper location of the event object
    if (!oEvent) {
      oEvent = window.event;
    }
    //call the handleKeyDown() method with the event object
    oThis.handleKeyDown(oEvent, flag);
  };
  //assign onblur event handler (hides suggestions)    
  this.textbox.onblur = function() {
    // oThis.hideSuggestions();
  };
  //create the suggestions dropdown
  this.createDropDown();
};

// /**
// * Highlights the next suggestion in the dropdown and
// * places the suggestion into the textbox.
// * @scope private
// */
CVAutoSuggestControl.prototype.nextSuggestion = function(flag) {
  var cSuggestionNodes = this.layer.childNodes;
  if (cSuggestionNodes.length > 0 && this.cur < cSuggestionNodes.length - 1) {
    var oNode = cSuggestionNodes[++this.cur];
    this.highlightSuggestion(oNode, flag);
  }
};

/**
 * Highlights the previous suggestion in the dropdown and
 * places the suggestion into the textbox.
 * @scope private
 */
CVAutoSuggestControl.prototype.previousSuggestion = function(flag) {
  var cSuggestionNodes = this.layer.childNodes;
  if (cSuggestionNodes.length > 0 && this.cur > 0) {
    var oNode = cSuggestionNodes[--this.cur];
    this.highlightSuggestion(oNode, flag);
  }
};

/**
 * Builds the suggestion layer contents, moves it into position,
 * and displays the layer.
 * @scope private
 * @param aSuggestions An array of suggestions for the control.
 * @param defaultSelected a flag to turn off the highlighting of the first item of suggestions array
 */
CVAutoSuggestControl.prototype.showSuggestions = function(aSuggestions /*:Array*/ , component, defaultSelected) {
  var oDiv = null;
  this.layer.innerHTML = ""; //clear contents of the layer
  this.layer.className = "suggestions cv-suggestions";
  var compID = component.getComponentId();
  //Determine whether to show the control menus in cv
  var controlsDiv = $("#cvControlsDiv" + compID);
  $(controlsDiv).removeClass();
  $(controlsDiv).addClass("sec-content");
  $(controlsDiv).css('overflow', 'visible');

  this.suggestionswrapper.appendChild(this.layer);

  for (var i = 0; i < aSuggestions.length; i++) {
    oDiv = document.createElement("div");
    if (i === 0 && !defaultSelected) {
      oDiv.className = "current";
    }
    if (defaultSelected) {
      this.cur = -1;
    } else {
      this.cur = 0;
    }
    var domText = this.suggestionDisplayHandler(aSuggestions[i], this.textbox.value);
    oDiv.innerHTML = domText;
    oDiv.appendChild(document.createTextNode(""));
    this.layer.appendChild(oDiv);
  }
  if (aSuggestions.length < 10) {
    this.layer.className = "suggestions cv-hidesuggestionscroll";
  }
  this.layer.style.height = '180px';

  var oNode = this.textbox;
  while (oNode && !Util.Style.ccss(oNode, "section")) {
    oNode = Util.gp(oNode);
  }
  //at the end of the while loop, oNode should be equal to
  //the main component div that has a class of section
  if (oNode) {
    oNode.style.position = "relative";
    oNode.style.zIndex = "2";
  }
  this.layer.style.zIndex = "100000"; //when autosuggest is active, nothing should have a greater z-index than it
  this.layer.style.display = "block";
};

CVAutoSuggestControl.prototype.indexOf = function(parent, el) {
  var nodeList = parent.childNodes;
  for (var i = 0; i < nodeList.length; i++) {
    var oNode = nodeList[i];
    //Parent Node grabs the BODY element if user clicked on a bolded section of the suggestions
    if (oNode == el || oNode == el.parentNode) {
      return i;
    }
  }
  return -1;
};

CVAutoSuggestControl.prototype.highlight = function(value, term) {
  return "<strong>" + value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong>$1<strong>") + "</strong>";
};

/* END Customized Auto Suggest Control to support Scrollbars */
