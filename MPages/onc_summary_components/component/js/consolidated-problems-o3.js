var ConprobO3Component = null;
									(function() {var modules = {};
var define = function(ns, deps, fun) {
    if (deps.apply) {
        fun = deps;
        deps = [];
    }

    modules[ns] = {
        definition: null,
        load: function() {

            if (this.definition) { return this.definition; }

            var args = [];
            for (var i = 0; i<deps.length; i++) {
                args.push(modules[deps[i]].load());
            }

            this.definition = fun.apply(this, args);
            return this.definition;
        }
    };
};

var require = function(deps, callback) {
    var args = [];
    for (var i = 0; i<deps.length; i++) {
        args.push(modules[deps[i]].load());
    }
    callback.apply(this, args);
};define(
    "cerner/discernabu/components/conprobo3/CPO3Factory", [
        "cerner/discernabu/components/conprobo3/model/CPO3Condition",
        "cerner/discernabu/components/conprobo3/controls/ConditionListTable",
        "cerner/discernabu/components/conprobo3/templates/ListTemplate",
        "cerner/discernabu/components/conprobo3/views/ListView",
        "cerner/discernabu/components/conprobo3/templates/DetailedTemplate",
        "cerner/discernabu/components/conprobo3/controls/DetailsPanel",
        "cerner/discernabu/components/conprobo3/views/DetailedView",
        "cerner/discernabu/components/conprobo3/controls/toggles/ThisVisitToggle",
        "cerner/discernabu/components/conprobo3/controls/buttons/SelectConditionButton",
        "cerner/discernabu/components/conprobo3/controls/toggles/ChronicToggle",
        "cerner/discernabu/components/conprobo3/controls/ConditionListTableRow",
        "cerner/discernabu/components/conprobo3/controls/buttons/CloseDetailsPanelButton",
        "cerner/discernabu/components/conprobo3/controls/PriorityDropDown",
        "cerner/discernabu/components/conprobo3/controls/toggles/ResolvedToggle",
        "cerner/discernabu/components/conprobo3/controls/buttons/ModifyButton",
        "cerner/discernabu/components/conprobo3/controls/buttons/InfoButton",
        "cerner/discernabu/components/conprobo3/templates/ComponentTemplate",
        "cerner/discernabu/components/conprobo3/model/CPO3Date",
        "cerner/discernabu/components/conprobo3/controls/buttons/CancelButton",
        "cerner/discernabu/components/conprobo3/controls/InfoButtonErrorModal",
        "cerner/discernabu/components/conprobo3/controls/ConditionListTableNKPRow",
        "cerner/discernabu/components/conprobo3/controls/buttons/DocumentNoChronicProblemsButton",
        "cerner/discernabu/components/conprobo3/controls/InfoBanner",
        "cerner/discernabu/components/conprobo3/controls/historytable/HistoricalTable",
        "cerner/discernabu/components/conprobo3/controls/historytable/HistoricalTableProblemRow",
        "cerner/discernabu/components/conprobo3/controls/historytable/HistoricalTableDxRow",
        "cerner/discernabu/components/conprobo3/templates/CommentTemplate",
        "cerner/discernabu/components/conprobo3/controls/comments/CommentPanel",
        "cerner/discernabu/components/conprobo3/controls/comments/CommentList",
        "cerner/discernabu/components/conprobo3/controls/comments/AddCommentTextbox",
        "cerner/discernabu/components/conprobo3/model/CPO3ConditionComment",
        "cerner/discernabu/components/conprobo3/controls/comments/SaveCommentButton",
        "cerner/discernabu/components/conprobo3/controls/comments/CancelCommentButton",
        "cerner/discernabu/components/conprobo3/controls/buttons/DxAssistantButton",
        "cerner/discernabu/components/conprobo3/controls/UnspecifiedAlert",
        "cerner/discernabu/components/conprobo3/controls/buttons/CommentIndicatorButton"
    ],

    function (CPO3Condition,
              ConditionListTable,
              ListTemplate,
              ListView,
              DetailedTemplate,
              DetailsPanel,
              DetailedView,
              ThisVisitToggle,
              SelectConditionButton,
              ChronicToggle,
              ConditionListTableRow,
              CloseDetailsPanelButton,
              PriorityDropDown,
              ResolvedToggle,
              ModifyButton,
              InfoButton,
              ComponentTemplate,
              CPO3Date,
              CancelButton,            
              InfoButtonErrorModal,
              ConditionListTableNKPRow,
              DocumentNoChronicProblemsButton,
              InfoBanner,
              HistoricalTable,
              HistoricalTableProblemRow,
              HistoricalTableDxRow,
              CommentTemplate,
              CommentPanel,
              CommentList,
              AddCommentTextbox,
              CPO3ConditionComment,
              SaveCommentButton,
              CancelCommentButton,
              DxAssistantButton,
              UnspecifiedAlert,
              CommentIndicatorButton) {

        /**
         * Factory object that creates any object instances needed by this component.
         * The method name will be the same name of the instance class.
         *
         * @constructor
         */
        var CPO3Factory = function () {
        };

        var method = CPO3Factory.prototype;

        method.closeDetailsPanelButton = function() {
            return new CloseDetailsPanelButton(this);
        };

        method.componentTable = function () {
            return new ComponentTable();
        };

        method.conditionEntity = function () {
            return new CPO3Condition();
        };

        method.conditionEntityClass = function() {
            return CPO3Condition;
        };

        method.conditionCommentEntity = function() {
            return new CPO3ConditionComment();
        };

        method.conditionCommentClass = function() {
            return CPO3ConditionComment;
        };

        method.conditionListTable = function (element) {
            return new ConditionListTable(element, this);
        };

        method.conditionListTableRow = function () {
            return new ConditionListTableRow(this);
        };

        method.detailsPanel = function(element) {
            return new DetailsPanel(element, this);
        };

        method.tableCellClickCallbackExtension = function () {
            return new TableCellClickCallbackExtension();
        };

        method.tableColumn = function () {
            return new TableColumn();
        };
        
        method.tableGroup = function () {
        	return new TableGroup();
        };

        method.listTemplate = function () {
            return ListTemplate;
        };

        method.selector = function() {
            return MPageControls.Selector;
        };

        method.detailedTemplate = function() {
            return DetailedTemplate;
        };

        method.listView = function (element) {
            return new ListView(element, this);
        };

        method.sidePanel = function() {
            return new CompSidePanel("dummy","dummy");
        };

        method.defaultView = function(element) {
            return this.listView(element);
        };

        method.detailedView = function(element) {
            return new DetailedView(element, this);
        };

        method.viewGroup = function() {
            return new MPageControls.Group();
        };

        method.chronicToggle = function() {
            return new ChronicToggle(this);
        };

        method.thisVisitToggle = function() {
            return new ThisVisitToggle(this);
        };

        method.selectConditionButton = function() {
            return new SelectConditionButton(this);
        };

        method.priorityDropDown = function() {
            return new PriorityDropDown(this);
        };

        method.resolvedToggle = function() {
            return new ResolvedToggle(this);
        };

        method.modifyButton = function() {
            return new ModifyButton(this);
        };

        method.infoButton = function() {
            return new InfoButton(this);
        };

        method.componentTemplate = function() {
            return ComponentTemplate;
        };

        method.cpo3Date = function(date) {
            return new CPO3Date(date);
        };

        method.bedrockConfig = function() {
            return new MPageEntity.BedrockConfig();
        };

        method.cancelButton = function() {
            return new CancelButton(this);
        };
        method.infoButtonApi = function(){
          return CERN_Platform.getDiscernObject("INFOBUTTONLINK");
        };
        method.mpageUtil = function(){
            return MP_Util;
        };	
        method.mpageModalDialog = function(){
          return MP_ModalDialog;	
        };
        method.mpageModalButton = function(buttonId){
          return new ModalButton(buttonId);	
        };
        method.infoButtonErrorModal = function(){
          return new InfoButtonErrorModal(this);
        };
        method.conditionListTableNKPRow = function () {
            return new ConditionListTableNKPRow(this);
        };
        method.documentNoChronicProblemsBtn = function(){
            return new DocumentNoChronicProblemsButton(this);
        };
        method.infoBanner = function(){
            return new InfoBanner(this);
        };
        method.alertMessageControl = function(element, messageTemplate, messageType){
            return new MPageControls.AlertMessage(element, messageTemplate, messageType);
        };
        method.dxAssistantButton = function(){
            return new DxAssistantButton(this);
        };
        method.historicalTable = function(){
            return new HistoricalTable(this);
        };
        method.historicalTableProblemRow = function(){
            return new HistoricalTableProblemRow(this);
        };
        method.historicalTableDxRow = function(){
            return new HistoricalTableDxRow(this);
        };
        method.unspecifiedAlert = function() {
            return new UnspecifiedAlert(this);
        };

        method.textboxControl = function() {
            return new TextControl();
        };

        method.commentTemplate = function() {
            return CommentTemplate;
        };

        method.commentPanel = function() {
            return new CommentPanel(this);
        };

        method.commentList = function() {
            return new CommentList(this);
        };

        method.addCommentTextbox = function() {
            return new AddCommentTextbox(this);
        };

        method.transaction = function() {
            return new MPageEntity.Transaction();
        };

        method.saveCommentButton = function() {
            return new SaveCommentButton(this);
        };

        method.cancelCommentButton = function() {
            return new CancelCommentButton(this);
        };

        method.commentIndicatorButton = function() {
            return new CommentIndicatorButton(this);
        };

        method.nomenclatureSearch = function(element) {
            return new MPageControls.NomenclatureSearch(element);
        };

        method.conditionList = function() {
            return new MPageEntity.entities.ConditionList();
        };

        return CPO3Factory;
    }
);
define(
    "cerner/discernabu/components/conprobo3/CPO3Style",

    function () {

        /**
         * The MPageComponent style for the Consolidated Problems Option 3
         * component.
         * @constructor
         */
        var ConprobO3Style = function () {
            this.initByNamespace("wf_consol_problems_o3");
        };

        ConprobO3Style.prototype = new ComponentStyle();

        return ConprobO3Style;
    }
);define(
    "cerner/discernabu/components/conprobo3/CPO3View",

    function() {

        var Selector = MPageControls.Selector;
        var attribute = MPageOO.attribute;

        // ------------------------------------------------------------------------------
        // Initialization
        // ------------------------------------------------------------------------------

        /**
         * Base class for any consolidated problems O3 view.
         *
         * @param element
         * @constructor
         * @extends {Control}
         */
        var CPO3View = function(element, factory) {
            Selector.call(this, element);
            this.setUnselectedClass("hidden");
            this.setEnabled(false);
            this.setFactory(factory);
            this.setIsCreated(false);
            this.setOnUnselect(function() {
                this.hideView();
            });
            this.setOnSelect(function() {
                this.update();
                this.showView();
            });
        };

        CPO3View.prototype = new Selector();

        var method = CPO3View.prototype;

        // ------------------------------------------------------------------------------
        // Attributes
        // ------------------------------------------------------------------------------

        /**
         * Whether the view's create() method has been called or not.
         * It is used by switchView to identify if a view needs to be recreated.
         */
        attribute(CPO3View, "IsCreated");

        /**
         * The factory used to create the control
         */
        attribute(CPO3View, "Factory");

        attribute(CPO3View, "CanModifyThisVisit");

        attribute(CPO3View, "CanModifyChronic");

        /**
         * Whether the priority drop down is enabled
         */
        attribute(CPO3View, "IsPriorityEnabled");

        attribute(CPO3View, "IsDxAssistantEnabled");

        // ------------------------------------------------------------------------------
        // Methods
        // ------------------------------------------------------------------------------

        /**
         * Marks the view as created.
         * @param build
         */
        method.create = function (build) {
            this.setIsCreated(true);
        };

        /**
         * Switches to the view that was being displayed previously
         */
        method.switchToPreviousView = function() {
          this.getParent().switchToPreviousView();
        };

        method.showView = function() {
            // abstract
        };

        method.hideView = function() {
            // abstract
        };

        method.updateSpecifiedConditions = function(conditions) {
          this.fire("updateSpecifiedConditions", [conditions]);
        };

        return CPO3View;
    }
);define(
	"cerner/discernabu/components/conprobo3/ConprobO3Component", [
		"cerner/discernabu/components/conprobo3/CPO3Style",
		"cerner/discernabu/components/conprobo3/CPO3Factory"
	],

	function(ConprobO3Style, CPO3Factory) {

		var attribute = MPageOO.attribute;
		var Control = MPageControls.Control;

		// ------------------------------------------------------------------------
		// Initialization
		// ------------------------------------------------------------------------

		/**
		 * THE consolidated problems option 3 component - AKA Project Phoenix
		 *
		 * @param criterion
		 * @constructor
		 * @extends MPageComponent
		 */
		var ConprobO3Component = function(criterion) {
			MPageComponent.call(this);

			this.setIsDxAssistantEnabled(true);
			this.setCriterion(criterion);
			this.setStyles(new ConprobO3Style());
			this.setIncludeLineNumber(true);
			this.setMarginBottom(30);
			this.setScope(1);
			this.setViewsContainer(new Control());
			this.setIsRendered(false);
			this.setFactory(new CPO3Factory());
			this.setBedrockConfig(this.getFactory().bedrockConfig());
			this.setViews(this.getFactory().viewGroup());
			this.m_nomenSearchBar = null;
			this.setDocumentNoChronicProblemsButton(this.getFactory().documentNoChronicProblemsBtn());
		};

		ConprobO3Component.prototype = new MPageComponent();
		MP_Util.setObjectDefinitionMapping("WF_CONSOL_PROBLEMS_O3", ConprobO3Component);
		var method = ConprobO3Component.prototype;

		// ------------------------------------------------------------------------------
		// Attributes
		// ------------------------------------------------------------------------------

		/**
		 * All the conditions currently being handled by the component
		 */
		attribute(ConprobO3Component, "Conditions");

		/**
		 * The factory used to create object instances
		 */
		attribute(ConprobO3Component, "Factory");

		/**
		 * A Control group with all the views of the component
		 */
		attribute(ConprobO3Component, "Views");

		/**
		 * Reference to the detailed view
		 */
		attribute(ConprobO3Component, "DetailedView");

		/**
		 * Reference to the list view
		 */
		attribute(ConprobO3Component, "ListView");

		/**
		 * The last view that was displayed by the component. Used by the
		 * switchToPreviousView method
		 */
		attribute(ConprobO3Component, "PreviousView");

		/**
		 * The control which contains the views
		 */
		attribute(ConprobO3Component, "ViewsContainer");

		/**
		 * A fixed amount of margin bottom to be added to the calculation of the
		 * component's viewable area. The bigger the margin, the shorter the
		 * component will be.
		 */
		attribute(ConprobO3Component, "MarginBottom");

		/**
		 * Whether the component has been rendered or not
		 */
		attribute(ConprobO3Component, "IsRendered");

		/**
		 * Bedrock related attributes
		 */
		attribute(ConprobO3Component, "BedrockConfig");

		/**
		 * The current instance of the nomenclature search bar associated with the component
		 */
		attribute(ConprobO3Component, "NomenclatureSearchBar");

		/**
		 * The current instance of the classification drop down associated with the component
		 */
		attribute(ConprobO3Component, "ClassificationFilterDropDown");
		
		/**
		 * The current classification filter being applied 
		 */
		attribute(ConprobO3Component, "ClassificationFilter");
		
		/**
		 * The current instance of the 'Add new as..' drop down associated with the component 
		 */
		attribute(ConprobO3Component, "AddNewAsDropDown");
		
		/**
		 * The current 'Add new as..' option being used 
		 */
		attribute(ConprobO3Component, "AddNewAsOption");

		/**
		 * Privilege results around NKP and modification
		 */
		attribute(ConprobO3Component, "CanViewNKP");
		attribute(ConprobO3Component, "CanUpdtNKP");
		attribute(ConprobO3Component, "CanModifyThisVisit");
		attribute(ConprobO3Component, "CanModifyChronic");
		attribute(ConprobO3Component, "CancelledNKPCondition");
		attribute(ConprobO3Component, "CernerNKPNomenclature");
		attribute(ConprobO3Component, "HasChronicProbs");
		attribute(ConprobO3Component, "NKPNomenclatures");
		attribute(ConprobO3Component, "SharedCondResObj");
		attribute(ConprobO3Component, "IsDxAssistantEnabled");
		/**
		 *Extra meta object
		 */
		attribute(ConprobO3Component, "MetaObj");
		attribute(ConprobO3Component, "DocumentNoChronicProblemsButton");
		/**
		 * The current instance of the 'No Chronic Problems' alert message bar
		 */
		attribute(ConprobO3Component, "NCPAlertMessageBar");

		/**
		 * Whether the priority drop down is enabled or not
		 */
		attribute(ConprobO3Component, "IsPriorityEnabled");

		attribute(ConprobO3Component, "UnspecifiedAlert");

		// ------------------------------------------------------------------------------
		// Bedrock Gap-check Attributes
		// ------------------------------------------------------------------------------
		attribute(ConprobO3Component, "ReqdThisVisitVocab");
		attribute(ConprobO3Component, "ReqdThisVisitClassification");
		attribute(ConprobO3Component, "ReqdThisVisitConfirmation");
		attribute(ConprobO3Component, "ReqdThisVisitType");
		attribute(ConprobO3Component, "ReqdChronicVocab");
		attribute(ConprobO3Component, "ReqdChronicClassification");
		attribute(ConprobO3Component, "ReqdChronicConfirmation");
		attribute(ConprobO3Component, "ReqdChronicLifeCycleStatus");

		// ------------------------------------------------------------------------
		// Bedrock Setters/Getters
		// ------------------------------------------------------------------------
		/*
		 * Sets the default vocabulary source flag to be used when using the nomenclature search
		 *
		 *  SourceFlag Valid Values
		 *      1 -     Condition ICD9
		 *      2 -     Condition SNOMED
		 *      3 -     Condition IMO
		 *      4 -     Condition IMO as synonyms of ICD-9
		 *      5 -     Condition HLI PFT
		 *      6 -     Condition Mayo Problems
		 *      7 -     Condition ICD-10
		 *      8 -     Procedure CPT-4
		 *      9 -     Procedure ICD-9
		 *      10 -    Procedure ICD-10
		 *
		 *  Note: 1-7 calls mp_ent_nomencalture while 8-10 calls the ProcedureSearch (4174064) transaction
		 */
		method.setDefaultSearchVocab = function(value) {
			this.getBedrockConfig().setDefaultSearchVocab(value);
		};
		/**
		 * Gets the default vocabulary source flag to be used when using the nomenclature search
		 */
		method.getDefaultSearchVocab = function() {
			return this.getBedrockConfig().getDefaultSearchVocab();
		};
		/**
		 * Sets the vocabulary to be used when adding a new condition to this visit.
		 */
		method.setThisVisitVocab = function(value) {
			this.getBedrockConfig().setThisVisitVocab(value);
		};
		/**
		 * Gets the vocabulary to be used when adding a new condition to this visit.
		 */
		method.getThisVisitVocab = function() {
			return this.getBedrockConfig().getThisVisitVocab();
		};
		/**
		 * Sets the vocabulary to be used when adding a new chronic condition.
		 */
		method.setChronicVocab = function(value) {
			this.getBedrockConfig().setChronicVocab(value);
		};
		/**
		 * Gets the vocabulary to be used when adding a new chronic condition.
		 */
		method.getChronicVocab = function() {
			return this.getBedrockConfig().getChronicVocab();
		};
		/**
		 * Sets the Dx Classification applied to This Visit
		 */
		method.setThisVisitDxClassification = function(value) {
			this.getBedrockConfig().setDiagnosisClassification(value);
		};
		/**
		 * Gets the Dx Classification applied to This Visit
		 */
		method.getThisVisitDxClassification = function() {
			return this.getBedrockConfig().getDiagnosisClassification();
		};
		/**
		 * Sets the Dx Confirmation applied to This Visit
		 */
		method.setThisVisitDxConfirmation = function(value) {
			this.getBedrockConfig().setDiagnosisConfirmation(value);
		};
		/**
		 * Gets the Dx Confirmation applied to This Visit
		 */
		method.getThisVisitDxConfirmation = function() {
			return this.getBedrockConfig().getDiagnosisConfirmation();
		};
		/**
		 * Sets the Dx type applied to This Visit
		 */
		method.setThisVisitDxType = function(value) {
			this.getBedrockConfig().setDiagnosisType(value);
		};
		/**
		 * Gets the Dx Type applied to This Visit
		 */
		method.getThisVisitDxType = function() {
			return this.getBedrockConfig().getDiagnosisType();
		};
		/**
		 * Sets the classification to be used when adding a condition as Chronic/Historic
		 */
		method.setChronicHistoricClassification = function(value) {
			this.getBedrockConfig().setProblemClassification(value);
		};
		/**
		 * Gets the classification to be used when adding a condition as Chronic/Historic
		 */
		method.getChronicHistoricClassification = function() {
			return this.getBedrockConfig().getProblemClassification();
		};
		/**
		 * Sets the confirmation to be used when adding a condition as Chronic/Historic
		 */
		method.setChronicHistoricConfirmation = function(value) {
			this.getBedrockConfig().setProblemConfirmation(value);
		};
		/**
		 * Gets the confirmation to be used when adding a condition as Chronic/Historic
		 */
		method.getChronicHistoricConfirmation = function() {
			return this.getBedrockConfig().getProblemConfirmation();
		};
		/**
		 * Set the flag for enabling/disabling the Modify Condition functionality
		 */
		method.setModifyConditionInd = function(value) {
			this.getBedrockConfig().setModifyInd(value);
		};
		/**
		 * Gets the flag for enabling/disabling the Modify Condition functionality
		 */
		method.getModifyConditionInd = function() {
			return this.getBedrockConfig().getModifyInd();
		};
		/**
		 * Set the flag for enabling/disabling the Info Button functionality
		 */
		method.setInfoButtonInd = function(value) {
			this.getBedrockConfig().setInfoButtonInd(value);
		};
		/**
		 * Gets the flag for enabling/disabling the Info Button functionality
		 */
		method.getInfoButtonInd = function() {
			return this.getBedrockConfig().getInfoButtonInd();
		};

		method.setProblemListFlag = function(value) {
			this.getBedrockConfig().setProblemListFlag(value);
		};

		method.getProblemListFlag = function(){
			return this.getBedrockConfig().getProblemListFlag();
		};

		/**
		 * Set the flag for enabling/disabling the This Visit Prioritization functionality
		 */
		method.setThisVisitPriorityInd = function(value) {
			//TODO
		};
		/**
		 * Gets the flag for enabling/disabling the This Visit Prioritization functionality
		 */
		method.getThisVisitPriorityInd = function() {
			//TODO
			return;
		};

		// ------------------------------------------------------------------------
		// Methods
		// ------------------------------------------------------------------------

		/**
		 * Calls the condition entity list action and renders the component when
		 * the request is ready.
		 */
		method.InsertData = function() {

			if (this.getIsRendered()) {
				this.getSharedCondResObj().retrieveSharedResourceData();
				return;
			}

			var loadTimer = new RTMSTimer("USR:MPG.CONSOL_PROBS.O3 - load component");
    		loadTimer.addMetaData("key");
			try {
				loadTimer.start();
				var self = this;
				var criterion = this.getCriterion();
	
				// initial data retrieval
				var listQual = {
					personId: criterion.person_id,
					encounterId: criterion.encntr_id
				};
	
				//Load conditions from shared resource and render component
				var loadConditions = function(conditions, privsObj, metaObj) {
					var conditionCnt = conditions.length;
					var condition;
					var cancelledNKPCondition;
					var cpCondition = self.getFactory().conditionEntity();
					var elist = self.getFactory().conditionList();
					elist.setResponseMeta(conditions.getResponseMeta());
					for (var i = 0; i < conditionCnt; i++) {
						condition = conditions[i];
						condition.setEncounterValue(criterion.encntr_id);
						cpCondition = self.getFactory().conditionEntity();
						cpCondition.setData(condition.getData());
						cpCondition.setResponseMeta(condition.getResponseMeta());
						elist.push(cpCondition);
					}
					self.setConditions(elist);
					self.setCanViewNKP(privsObj.canViewNKP);
					self.setCanUpdtNKP(privsObj.canUpdtNKP);
					self.setCanModifyThisVisit(privsObj.canModifyThisVisit);
					self.setCanModifyChronic(privsObj.canModifyChronic);
					self.setNKPNomenclatures(privsObj.nkpNomenclatures);
					self.setCernerNKPNomenclature(privsObj.cernerNKPNomenclature);
					self.setHasChronicProbs(privsObj.hasChronicProbs);
					self.setMetaObj(metaObj);
					cancelledNKPCondition = elist.filter("isCernerNKP", true).filter("isChronic", false)[0];
					self.setCancelledNKPCondition(cancelledNKPCondition);
	
					if (self.getNomenclatureSearchBar()) {
						self.clearCount();

						// check for any classification filter applied
						if (self.getClassificationFilter()) {
							self.getListView().getConditionListTable().setClassificationFilter(self.getClassificationFilter());
						}
						// refresh the views
						var loadedViews = self.getViews().getControls();
						var numViews = loadedViews.length;
						for (var x = 0; x < numViews; x++) {
							var view = loadedViews[x];
							view.setConditions(self.getConditions());
							if (view === self.getDetailedView()) {
								view.closeDetailsPanel();
							} else {
								view.update();
							}
						}
						self.getUnspecifiedAlert().setConditions(self.getConditions());
						self.getUnspecifiedAlert().update();
						self.checkForNoChronicProblems();
						self.postProcessing();
					} else {
						self.renderComponent();
					}
					if(self.getGapCheckRequiredInd()){
						self.updateSatisfierRequirementIndicator();
					}
					if(loadTimer) {
						loadTimer.stop();
					}
				};
	
				if (!self.getClassificationFilterDropDown()) {
					//before initiating the data retrieval, build the classification filter drop down
					self.buildClassificationFilterDropDown();
				}
				/*since diagnoses types are not being displayed face-up currently and are required only for gap-check validation, we need them only if gap-check
					is enabled; so load them only when needed*/
				if (self.getGapCheckRequiredInd()) {
					MPageEntity.entities.Condition.meta.loadDiagnosisTypes = 1;
				}
				//retrieve the data from the shared resource
				self.setSharedCondResObj(SharedConditionResource.getSharedResource(loadConditions, self));
				
			} catch(err) {
				if(loadTimer) {
					loadTimer.fail();
				}
				throw(err);
			}
		};

		/**
		 * Marks the views as not created so that they can be refreshed by the refresh
		 * button.
		 */
		method.resetViews = function() {
			this.setViews(this.getFactory().viewGroup());
			this.setListView(null);
			this.setDetailedView(null);
		};

		/**
		 * Creates the control which displays the number of conditions that are
		 * unspecified.
		 */
		method.buildUnspecifiedAlert = function() {
			var conditions = this.getConditions();
			var build = this.getFactory();
			var unspecifiedAlert = build.unspecifiedAlert();
			unspecifiedAlert.setConditions(conditions);
			unspecifiedAlert.setTemplate(build.componentTemplate().unspecifiedAlert);
			unspecifiedAlert.setParent(this);
			unspecifiedAlert.setIsDxAssistantEnabled(this.getIsDxAssistantEnabled());
			this.setUnspecifiedAlert(unspecifiedAlert);
			return unspecifiedAlert;
		};

		/**
		 * Checks if all required criteria for gap-check are met
		 * @return {Boolean} true: satisfied, false: unsatisfied
		 */
		method.isGapCheckRequirementSatisfied = function () {
			var i = 0;
			var currCondition = null;
			var currDxType = null;
			var currClassification = null;
			var currConfirmation = null;
			var currLifeCycleStatus = null;
			//Retrieve the conditions and filter them
			var conditions = this.getConditions();
			var chronicConditions = conditions.filter("isChronic", true);
			var thisVisitConditions = conditions.filter("isThisVisit", true);
			var resolvedConditions = conditions.filter("isHistorical", true);
			var chronicOrResolvedConditions = chronicConditions.concat(resolvedConditions);
			//Retrieve gap-check requirements
			var reqdThisVisitVocab = this.getReqdThisVisitVocab();
			var reqdThisVisitClassification = this.getReqdThisVisitClassification();
			var reqdThisVisitConfirmation = this.getReqdThisVisitConfirmation();
			var reqdThisVisitType = this.getReqdThisVisitType();
			var reqdChronicVocab = this.getReqdChronicVocab();
			var reqdChronicClassification = this.getReqdChronicClassification();
			var reqdChronicConfirmation = this.getReqdChronicConfirmation();
			var reqdLifeCycleStatus = this.getReqdChronicLifeCycleStatus();

			var chronicCnt = chronicConditions.length;
			var thisVisitCnt = thisVisitConditions.length;
			var chronicResolvedCnt = chronicOrResolvedConditions.length;

			var isThisVisitCriteriaSatisfied = false;
			var isChronicCriteriaSatisfied = false;
			//If No Known Chronic Problems is documented and is active: skip chronic check
			if (chronicConditions.filter("isCernerNKP", true).length) {
				isChronicCriteriaSatisfied = true;
			} else {
				for (i = 0; i < chronicResolvedCnt; i++) {
					currCondition = chronicOrResolvedConditions[i];
					currTargetVocab = Number(currCondition.getTargetNomenclature().getSourceVocabularyValue());
					currClassification = Number(currCondition.getClassificationValue());
					currConfirmation = Number(currCondition.getConfirmationStatusValue());
					currLifeCycleStatus = Number(currCondition.getLifeCycleStatusValue());
					if ($.inArray(currTargetVocab, reqdChronicVocab) === -1 || $.inArray(currClassification, reqdChronicClassification) === -1 || $.inArray(currConfirmation, reqdChronicConfirmation) === -1 || $.inArray(currLifeCycleStatus, reqdLifeCycleStatus) === -1) {
						continue;
					}
					// all required criteria met- no need to check further
					isChronicCriteriaSatisfied = true;
					break;
				}
			}
			for (i = 0; i < thisVisitCnt; i++) {
				currCondition = thisVisitConditions[i];
				currTargetVocab = Number(currCondition.getTargetNomenclature().getSourceVocabularyValue());
				currDxType = Number(currCondition.getDiagnosisTypeValue());
				currClassification = Number(currCondition.getClassificationValue());
				currConfirmation = Number(currCondition.getConfirmationStatusValue());
				if ($.inArray(currTargetVocab, reqdThisVisitVocab) === -1 || $.inArray(currClassification, reqdThisVisitClassification) === -1 || $.inArray(currConfirmation, reqdThisVisitConfirmation) === -1 || $.inArray(currDxType, reqdThisVisitType) === -1) {
					continue;
				}
				// all required criteria met- no need to check further
				isThisVisitCriteriaSatisfied = true;
				break;
			}
			return isThisVisitCriteriaSatisfied && isChronicCriteriaSatisfied;
		};

		/**
		 * Fires event to update the gap-check indicators depending whether gap-check is satisfied or not
		 *  @returns {undefined} This function does not return a value
		 */
		method.updateSatisfierRequirementIndicator = function () {
			var isRequirementSatisfied = this.isGapCheckRequirementSatisfied();
			this.setSatisfiedInd(isRequirementSatisfied);
			CERN_EventListener.fireEvent(this, this, EventListener.EVENT_SATISFIER_UPDATE, {
				satisfied : isRequirementSatisfied
			});
			this.updateComponentRequiredIndicator();
		};

		/**
		 * Checks to see if all gap-check filters have been set and returns true if all are set else returns false
		 *  @returns {boolean} value indicating whether all gap-check filters have been set
		 */
		method.getGapCheckRequiredInd = function () {
			if (this.getReqdThisVisitVocab() && this.getReqdThisVisitClassification() && this.getReqdThisVisitConfirmation() && this.getReqdThisVisitType() && this.getReqdChronicVocab() && this.getReqdChronicClassification() && this.getReqdChronicConfirmation() && this.getReqdChronicLifeCycleStatus()) {
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Finalizes the component with the total condition count and switches to the
		 * default view (list view)
		 */
		method.renderComponent = function() {
			var renderTimer = new RTMSTimer("ENG:MPG.CONSOL_PROBS.O3 - render component");
			renderTimer.addMetaData("key");
			try {
				renderTimer.start();
				this.resetViews();
				var self = this;
				var compId = this.getComponentId();
				var build = this.getFactory();
				var conditions = this.getConditions();
				var condLen = conditions.filter("isCernerNKP", false).length;
				var cp3i18n = i18n.discernabu.conprobo3_i18n;

				var alert = this.buildUnspecifiedAlert();

				var nkpMsgHtml = build.componentTemplate().nkpMessageContainer({
					compId: this.getComponentId()
				});

				var infoBarHtml = build.componentTemplate().infoBarSkeleton({
					compId: this.getComponentId(),
					cp3i18n: i18n.discernabu.conprobo3_i18n,
					unspecifiedAlertId: alert ? alert.getElementId() : null
				});
	
				//creates the nomenclature search bar and a container div for displaying messages
	            var html =  nkpMsgHtml + infoBarHtml;
	
				//creates the html by rendering the componentTemplate
				html += build.componentTemplate().component({
					viewsContainerId: this.getViewsContainer().getElementId()
				});
	
				//render the component
				this.finalizeComponent(html);
	
				this.checkForNoChronicProblems();
				// build the 'Add new as..' drop down menu
				this.buildAddNewAsDropDown();
				//build the nomenclature search bar
				this.createNomenclatureSearchBar();

				// initialize child controls
				if (alert) {
					this.getUnspecifiedAlert().create();
					this.getUnspecifiedAlert().update();
				}

				// Shows list view by default
				this.showListView();
			} catch(err) {
				if(renderTimer) {
					renderTimer.fail();
				}
				throw(err);
			} finally {
				if(renderTimer) {
					renderTimer.stop();
				}
			}
		};

		/**
		 * Renders the specified view in the component body. If the view was already
		 * created, only the update() method will be called. Else, it will be created.
		 *
		 * @param view
		 */
		method.switchToView = function(view) {
			if (!view) {
				return;
			}

			if (!view.getIsCreated()) {
				var el = document.createElement("div");
				el.id = view.getElementId();
				this.getViewsContainer().getElement().append(el);
				view.setElement(el);
				view.setParent(this);
				if (view.setConditions) {
					view.setConditions(this.getConditions());
				}
				view.setBedrockConfig(this.getBedrockConfig());
				view.setCanModifyThisVisit(this.getCanModifyThisVisit());
				view.setCanModifyChronic(this.getCanModifyChronic());
				view.setIsPriorityEnabled(this.isPriorityEnabledConsideringPrivs());
				view.setIsDxAssistantEnabled(this.getIsDxAssistantEnabled());
				view.create();
				this.getViews().add(view);
			}

			this.setPreviousView(this.getViews().getCurrent());
			this.getViews().selectSingle(view);
			this.setIsRendered(true);
			this.postProcessing();
		};

		/**
		 * Builds the drop down menu for selecting a classification filter
		 */
		method.buildClassificationFilterDropDown = function() {
			var self = this;
			var cp3i18n = i18n.discernabu.conprobo3_i18n;
			var compHdrNode = this.getHeaderElement();
			var controlId = "cpo3ClassFilterMenu" + this.getComponentId();
			var contentId = "cpo3FilterMenuContent" + this.getComponentId();
			var classFilterDropDown = null;
			var dropDownList = null;
			var ddArrowHTML = "<span class='conprobo3-drop-down-arrow'>&nbsp;</span>";
			var userPrefs = this.getPreferencesObj();
			var localPrefs = userPrefs ? userPrefs : {};
			var validKeys = ["ALL", "MED_PATIENT"];
			var filters = [{
				display: cp3i18n.ALL,
				key: 'ALL'
			}, {
				display: cp3i18n.MEDICAL_PATIENT_FILTER,
				key: 'MED_PATIENT'
			}];
			var dropDownHTML = "<div id='" + controlId + "' class='conprobo3-classification-drop-down'><span>" + cp3i18n.CLASSIFICATION + ":</span>" + "<span id='" + contentId + "' class='conprobo3-drop-down-display'></span></div>";

			var dropDownShell = $(dropDownHTML);

			//add the empty shell to the header element
			this.getRenderStrategy().addComponentSection(compHdrNode, dropDownShell);

			//create the drop down list control
			classFilterDropDown = new MPageControls.DropDownList($('#' + contentId));
			classFilterDropDown.setDisplayKey("display");
			if(userPrefs && userPrefs.classFilterPref && validKeys.indexOf(userPrefs.classFilterPref.key) > -1){
				classFilterDropDown.setValue(userPrefs.classFilterPref.display + ddArrowHTML);
				this.setClassificationFilter(userPrefs.classFilterPref.key);
			}else{
				classFilterDropDown.setValue(filters[1].display + ddArrowHTML);
				this.setClassificationFilter(filters[1].key);
			}
			classFilterDropDown.renderItems(filters);
			

			//format the selector's width for proper display. 11px is for the width of the drop down arrow
			classFilterDropDown.show();
			classFilterDropDown.getElement().width(classFilterDropDown.getContents().width() + 11);
			classFilterDropDown.hide();

			classFilterDropDown.setOnSelect(function(item) {
				var classificationFilterCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Classification_Filter");
				if(classificationFilterCAPTimer){
		        	classificationFilterCAPTimer.addMetaData("key");
		        	classificationFilterCAPTimer.start();
		        	classificationFilterCAPTimer.stop();
				}
				var listView = self.getListView();
				var detailedView = self.getDetailedView();
				var dropDown = self.getClassificationFilterDropDown();
				userPrefs = self.getPreferencesObj();
				localPrefs = userPrefs ? userPrefs : {};
				self.setClassificationFilter(item.key);
				listView.setClassificationFilter(item.key);
				listView.update();
				self.resizeComponent();
				dropDown.setValue(item.display + ddArrowHTML);
				
				if(detailedView){
					detailedView.setClassificationFilter(item.key);
					detailedView.update();
				}
				//user prefs
				if(localPrefs && localPrefs.classFilterPref){
					localPrefs.classFilterPref = item;
				}else{
					localPrefs['classFilterPref'] = item;
				}
				self.setPreferencesObj(localPrefs);
				self.savePreferences(true);
			});
			this.setClassificationFilterDropDown(classFilterDropDown);

			// initialize the self-closing timeout
			self.initHoverTimeout(classFilterDropDown);
		};
		
		/**
		 * Builds the drop down menu for selecting how new conditions will be added 
		 */
		method.buildAddNewAsDropDown = function() {
			var self = this;
			var cp3i18n = i18n.discernabu.conprobo3_i18n;
			var contentObj = $("#cpo3AddNewAsMenuContent" + this.getComponentId());
			var ddArrowHTML = "<span class='conprobo3-drop-down-arrow'>&nbsp;</span>";
			var addNewAsDD = null;
			var userPrefs = this.getPreferencesObj();
			var localPrefs = userPrefs ? userPrefs : {};
			var validKeys = ["TV", "TV_CHRONIC", "CHRONIC"];
			var options = [{
				display: cp3i18n.THIS_VISIT,
				key: "TV"
			}, {
				display: cp3i18n.THIS_VISIT_AND_CHRONIC,
				key: "TV_CHRONIC"
			}, {
				display: cp3i18n.CHRONIC,
				key: "CHRONIC"
			}];
			
			addNewAsDD = new MPageControls.DropDownList(contentObj);
			addNewAsDD.setDisplayKey("display");
			if(userPrefs && userPrefs.addNewAsPref && validKeys.indexOf(userPrefs.addNewAsPref.key) > -1){
				// the user preference could be in a different language at this point...so make sure the proper translated value is used
				switch(userPrefs.addNewAsPref.key){
					case "TV":
						addNewAsDD.setValue(options[0].display + ddArrowHTML);
						break;
					case "TV_CHRONIC":
						addNewAsDD.setValue(options[1].display + ddArrowHTML);
						break;
					case "CHRONIC":
						addNewAsDD.setValue(options[2].display + ddArrowHTML);
						break;
				}
				this.setAddNewAsOption(userPrefs.addNewAsPref.key);
			} else {
				addNewAsDD.setValue(options[0].display + ddArrowHTML);
				this.setAddNewAsOption(options[0].key);
			}
			addNewAsDD.renderItems(options);

			addNewAsDD.setOnSelect(function(item) {
				var addProblemAsCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Add_New_As");
				if(addProblemAsCAPTimer){
		        	addProblemAsCAPTimer.addMetaData("key");
		        	addProblemAsCAPTimer.start();
		        	addProblemAsCAPTimer.stop();
	        	}
				var nomenSearchObj = self.getNomenclatureSearchBar();
				var dropDown = self.getAddNewAsDropDown();
				userPrefs = self.getPreferencesObj();
				localPrefs = userPrefs ? userPrefs : {};
				self.setAddNewAsOption(item.key);
				
				dropDown.setValue(item.display + ddArrowHTML);
				
				if(nomenSearchObj){
					self.validateNomenSearchDisplay();
				}
				
				// user prefs
				if(localPrefs && localPrefs.addNewAsPref){
					localPrefs.addNewAsPref = item;
				}else{
					localPrefs['addNewAsPref'] = item;
				}
				self.setPreferencesObj(localPrefs);
				self.savePreferences(true);
			});			
			this.setAddNewAsDropDown(addNewAsDD);
			
			// initialize the self-closing timeout
			self.initHoverTimeout(addNewAsDD);
		};

		/**
		 * Debounced method to handle closing the drop down list after the user has stopped hovering over the control
		 *
		 * @param {object} : The classification drop down list control associated to this instance of the component
		 */
		method.initHoverTimeout = function(dropDown) {
			var self = this;
			var contentId = "cpo3FilterMenuContent" + this.getComponentId();
			var timeout = null;
			$('#' + contentId).mouseenter(function() {
				if (timeout) {
					clearTimeout(timeout);
				}
			});
			$('#' + contentId).mouseleave(function() {
				timeout = setTimeout(function() {
					dropDown.getSelector().unselect();
				}, 1000);
			});
		};

		method.checkForNoChronicProblems = function() {
			var cp3i18n = i18n.discernabu.conprobo3_i18n;
			var compId = this.getComponentId();
			var self = this;
			var metaObj = this.getMetaObj();
			var build = this.getFactory();
			var hasChronicProbs = metaObj.HASCHRONICPROBS;
			var cernerNKPNomenId = metaObj.CERNERNKPNOMENID;
			var canViewNKP = this.getCanViewNKP();
			var canUpdtNKP = this.getCanUpdtNKP();
			var conditions = this.getConditions();
			var hasNKP = false;

			var noChronicAlertMsg = null;
			var messageType;
			var messageContent;
			var messageTemplate;
			var documentNkpMsg;

			var activeConds = conditions.filter("isCernerNKP", true).filter("isChronic", true);
			if (activeConds.length) {
				hasNKP = true;
			}
			var targetElement = $("#noChronicProbMsg" + compId);
			if (!parseInt(hasChronicProbs) && cernerNKPNomenId > 0.0) {
				if (canViewNKP && canUpdtNKP) {
					if (!hasNKP) {
						messageType = MPageControls.AlertMessage.MessageTypes.INFORMATION;
						if (!targetElement.children().length) {

							documentNkpMsg = cp3i18n.DOCUMENT_NO_CHRONIC_PROBLEMS.replace(/\{0\}/g, build.componentTemplate().documentNkpLink({
								buttonId: this.getDocumentNoChronicProblemsButton().getElementId(),
								display: cp3i18n.NO_CHRONIC_PROBLEMS
							}));
							messageContent = build.componentTemplate().nkpMessageContent({
								noChronicProbsDocumented: cp3i18n.NO_CHRONIC_PROBLEMS_DOCUMENTED,
								documentNkpMsg: documentNkpMsg
							});

							messageTemplate = MPageControls.getDefaultTemplates().messageBar;
							noChronicAlertMsg = build.alertMessageControl(targetElement, messageTemplate, messageType);
							noChronicAlertMsg.render(messageContent);
							this.getDocumentNoChronicProblemsButton().setAddNKPFunction(function() {
								self.documentNoChronicProblems();
							});
							this.getDocumentNoChronicProblemsButton().init();
							this.setNCPAlertMessageBar(noChronicAlertMsg);
						}
						return;
					}
				}
			}
			targetElement.empty();
		};

		/**
		 * Returns the component header DOM element
		 *
		 * @return {element}
		 */
		method.documentNoChronicProblems = function() {
			var self = this;
			var cancelledNKPCondition = this.getCancelledNKPCondition();
			if (cancelledNKPCondition) {
				//If cancelled NKP exists, reactive
				cancelledNKPCondition.setIsChronic(true);
				cancelledNKPCondition.activate(function() {
					self.getSharedCondResObj().retrieveSharedResourceData();
				});
            }
           else{
				//Otherwise, create new NKP condition
				var cond = new MPageEntity.entities.Condition();
				var encntr = this.getCriterion().encntr_id;
				var prsn = this.getCriterion().person_id;
				var cernerNKPNomenclature = this.getCernerNKPNomenclature();

				cond.setIsThisVisit(false);
				cond.setIsChronic(true);
				cond.setClassificationValue(0.0);
				cond.setNomenclatureValue(cernerNKPNomenclature);
				cond.setTargetNomenclatureValue(cernerNKPNomenclature);
				cond.setEncounterValue(encntr);
				cond.setPersonValue(prsn);
				cond.create(function() {
					self.getSharedCondResObj().retrieveSharedResourceData();
				});
			}
		};

		/**
		 * Builds the nomenclature search bar for adding new conditions
		 */
		method.createNomenclatureSearchBar = function() {
			var cp3i18n = i18n.discernabu.conprobo3_i18n;
			var controlId = "#nomenSearchBar" + this.getComponentId();
			var nomenSearchBar = this.getFactory().nomenclatureSearch($(controlId));
			var self = this;

			nomenSearchBar.setCaption(cp3i18n.NOMENCLATURE_SEARCH_CAPTION);
			nomenSearchBar.setICD10CodeValues(this.getConditions().getICD10CodeValuesFromMeta());
			nomenSearchBar.activateCaption();

			var searchVocab = new MPageEntity.CodeValue();
			searchVocab.setId(this.getDefaultSearchVocab());
			nomenSearchBar.setSourceVocabCodeValue(searchVocab);

			nomenSearchBar.setOnDelay(function() {
				var searchText = $(controlId + ' :input').val();
				if (searchText) {
					nomenSearchBar.setValue(searchText);
					nomenSearchBar.searchNomens();
				}
			});

			nomenSearchBar.getList().setOnSelect(function(item) {
				self.addCondition(item);
				nomenSearchBar.setValue("");
				nomenSearchBar.getTextbox().focus();
			});

			this.setNomenclatureSearchBar(nomenSearchBar);

			this.validateNomenSearchDisplay();
		};

		/**
		 * Checks various scenarios to determine if the nomenclature search bar should be disabled
		 */
		method.validateNomenSearchDisplay = function() {
			var infoDivId = '#cpo3InfoDiv' + this.getComponentId();
			var nomenSearchCtrl = this.getNomenclatureSearchBar();
			var addAsThisVisit = (this.getAddNewAsOption() === "TV") ? true : false;
			var addAsChronic = (this.getAddNewAsOption() === "CHRONIC") ? true : false;
			var addAsTVChronic = (this.getAddNewAsOption() === "TV_CHRONIC") ? true : false;
			var searchVocab = this.getDefaultSearchVocab();
			var thisVisitVocab = this.getThisVisitVocab();
			var chronicVocab = this.getChronicVocab();
			var modThisVisitPriv = this.getCanModifyThisVisit();
			var modChronicPriv = this.getCanModifyChronic();
			var validSearchFlags = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

			function disableNomenSearch() {
				if($(infoDivId).find('span').hasClass('secondary-text')){
					$(infoDivId).find('span').toggleClass('secondary-text disabled');
					nomenSearchCtrl.disable();
				}
			}
			function enableNomenSearch() {
				if($(infoDivId).find('span').hasClass('disabled')){
					$(infoDivId).find('span').toggleClass('secondary-text disabled');
					nomenSearchCtrl.enable();
				}
			}

			// disable the search if viewed in a web browser
			if (!CERN_Platform.inMillenniumContext()) {
				disableNomenSearch();
				return;
			}

			// if the searchVocab isn't configured, or the searchVocab is an invalid value, disable the search
			if (!searchVocab) {
				disableNomenSearch();
				return;
			}
			
			// if the 'add as this visit..' option is enabled and the thisVisitVocab isn't defined or the modify This Visit privs are not enabled, disable the search
			if ((addAsThisVisit || addAsTVChronic) && (!thisVisitVocab || !modThisVisitPriv)) {
				disableNomenSearch();
				return;
			}

			// if the 'add as chronic..' option is enabled and the chronicVocab isn't defined or the modify Chronic privs are not enabled, disable the search
			if ((addAsChronic || addAsTVChronic) && (!chronicVocab || !modChronicPriv)) {
				disableNomenSearch();
				return;
			}

			// if the code has made it this far, then the search should be enabled, if not already
			if (!nomenSearchCtrl.getIsEnabled()) {
				enableNomenSearch();
				return;
			}
		};

		/**
		 * Adds a condition as either This Visit or Chronic & This Visit
		 *
		 * @param item : The condition to be added
		 */
		method.addCondition = function(item) {
			var addNewCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Add");
			if(addNewCAPTimer){
		       	addNewCAPTimer.addMetaData("key");
		       	addNewCAPTimer.start();
		       	addNewCAPTimer.stop();
	        }
			var self = this;
			var nomenSearchBar = this.getNomenclatureSearchBar();
			var encntr = this.getCriterion().encntr_id;
			var prsn = this.getCriterion().person_id;
			var addAsThisVisit = (this.getAddNewAsOption() === "TV" || this.getAddNewAsOption() === "TV_CHRONIC") ? true : false;
			var addAsChronic = (this.getAddNewAsOption() === "CHRONIC" || this.getAddNewAsOption() === "TV_CHRONIC") ? true: false;
			var conditionId = item.getId();
			var bedrockConfig = this.getBedrockConfig();
			var tvCond = null;
			var chronCond = null;

			if(addAsThisVisit){
				var thisVisitClassification = this.getThisVisitDxClassification();
				var thisVisitConfirmation = this.getThisVisitDxConfirmation();
				var thisVisitDxType = this.getThisVisitDxType();
				tvCond = new MPageEntity.entities.Condition();
				tvCond.setIsThisVisit(true);
				tvCond.setDiagnosisTypeValue(thisVisitDxType);
				tvCond.setClassificationValue(thisVisitClassification);
				tvCond.setConfirmationStatusValue(thisVisitConfirmation);
				tvCond.setNomenclatureValue(conditionId);
				tvCond.setEncounterValue(encntr);
				tvCond.setPersonValue(prsn);

				if (this.getIsPriorityEnabled()) {
					tvCond.setClinicalPriority(this.getConditions().getHighestPriority() + 1);
				}
				tvCond.getCrossMapping(bedrockConfig);
			}

			if (addAsChronic) {
				var chronClassification = this.getChronicHistoricClassification();
				var chronConfirmation = this.getChronicHistoricConfirmation();
				var iso8601Date = new MPageEntity.Iso8601DateTime();
				var nkpIds = self.getNKPNomenclatures();
				var cernNKP = self.getCernerNKPNomenclature();
				
				chronCond = new MPageEntity.entities.Condition();
				chronCond.setIsChronic(true);
				chronCond.setClassificationValue(chronClassification);
				chronCond.setConfirmationStatusValue(chronConfirmation);
				chronCond.setNomenclatureValue(conditionId);
				chronCond.setEncounterValue(encntr);
				chronCond.setPersonValue(prsn);
				chronCond.setOnset(iso8601Date.toCcl(new Date()));
			}

			// create the condition
			if(tvCond){
				// create the diagnosis first then set up the problem and create it afterwards to prevent a race condition
				tvCond.create(function(reponse, reply, err) {
					if (err) {
						// make sure the user did not just cancel out of the cross mapping window
						if(tvCond.getTargetNomenclatureValue()) {
							// Alert the user that they can't add the condition
							self.showErrorModal();
						}
					}
					self.handleDuplicates(true, reply);
					self.getSharedCondResObj().retrieveSharedResourceData();
					
					if(chronCond){
						chronCond.getCrossMapping(bedrockConfig);
	
						// create the chronic problem
						chronCond.create(function(response, reply, err) {
							if (err) {
								// make sure the user did not just cancel out of the cross mapping window
								if(chronCond.getTargetNomenclatureValue()) {
									// Alert the user that they can't add the problem
									self.showErrorModal();
								}
							}
							self.handleDuplicates(false, reply);
							self.getSharedCondResObj().retrieveSharedResourceData();
						});
					}
				});
			} else if(chronCond){
				chronCond.getCrossMapping(bedrockConfig);

				// create the chronic problem
				chronCond.create(function(response, reply, err) {
					if (err) {
						// make sure the user did not just cancel out of the cross mapping window
						if(chronCond.getTargetNomenclatureValue()) {
							// Alert the user that they can't add the problem
							self.showErrorModal();
						}
						return;
					}
					self.handleDuplicates(false, reply);
					self.getSharedCondResObj().retrieveSharedResourceData();
				});
			}
		};

		/**
		 * Display an error message modal if there's an error performing an action
		 */
		method.showErrorModal = function() {
			var modalBodyHTML = "";

			modalBodyHTML = "<div class='conprobo3-modal'><div class='error-icon-component'><span class='error-text'>" + i18n.discernabu.conprobo3_i18n.ERROR_DUE_TO_PRIVS + "</span></div></div>";

			var modalObjExists = MP_ModalDialog.retrieveModalDialogObject("addProblemErrorModal");
			//will actually be the modal object if it exists, else null
			var addProblemErrorModalObj = modalObjExists ? modalObjExists : new ModalDialog("addProblemErrorModal");

			if (!modalObjExists) {
				var okCloseErrorBtn = new ModalButton("okCloseErrorBtn");

				okCloseErrorBtn.setText(i18n.discernabu.CONFIRM_OK);
				okCloseErrorBtn.setFocusInd(true);
				okCloseErrorBtn.setCloseOnClick(true);

				addProblemErrorModalObj.setTopMarginPercentage(25).setRightMarginPercentage(30).setBottomMarginPercentage(25).setLeftMarginPercentage(30).setIsBodySizeFixed(false);
				addProblemErrorModalObj.setHeaderTitle(i18n.ERROR_OCCURED);
				addProblemErrorModalObj.addFooterButton(okCloseErrorBtn);
				addProblemErrorModalObj.setShowCloseIcon(true);

				MP_ModalDialog.addModalDialogObject(addProblemErrorModalObj);
				MP_ModalDialog.showModalDialog("addProblemErrorModal");

				addProblemErrorModalObj.setBodyHTML(modalBodyHTML);
			} else {
				MP_ModalDialog.showModalDialog("addProblemErrorModal");
				addProblemErrorModalObj.setBodyHTML(modalBodyHTML);
			}
		};

		/**
		 * Displays an alert message indicating duplicates are present
		 * @param  {Boolean} isThisVisit  True if "This Visit", false if "Chronic"
		 * @param  {[type]}  raw          Raw response string returned from condition action
		 * @return {Boolean} isDuplicate  Returns true if duplicates of condition were found
		 */
		 method.handleDuplicates = function(isThisVisit, raw){
		 	var reply = JSON.parse(raw);
		 	var sTargetSection;
			// If cross mapping is launched and nothing get selected from cross mapping window.
			if (reply.RECORD_DATA.META.ERRORCD == 1) {
				if (isThisVisit){
					sTargetSection = i18n.discernabu.conprobo3_i18n.THIS_VISIT;
				}
				else{
					sTargetSection = i18n.discernabu.conprobo3_i18n.CHRONIC;
				}
				var sDuplicateMessage = i18n.discernabu.conprobo3_i18n.DUPLICATE_MSG.replace(/\{0\}/g, sTargetSection);
				alert(sDuplicateMessage);
				return true;
			}
			return false;
		};

		/**
		 * Renders the view that was being displayed before switchToView was invoked.
		 */
		method.switchToPreviousView = function() {
			this.switchToView(this.getPreviousView());
		};

		/**
		 * Returns the view currently being shown.
		 * @return {*}
		 */
		method.getCurrentView = function() {
			return this.getViews().getCurrent();
		};

		/**
		 * Executed by the viewpoint when the window is resized. Will only execute if
		 * the component has already been rendered. Fires the current view's setMaxHeight
		 * and resize events.
		 */
		method.resizeComponent = function() {
			if (!this.getIsRendered()) {
				return;
			}

			this.getViews().getCurrent().trigger("setMaxHeight", [this.calculateViewHeight()]);
			this.getViews().getCurrent().trigger("resize");
		};

		/**
		 * Overrides the base post processing function for custom logic
		 */
		method.postProcessing = function() {
			var compId = this.getComponentId();
			var searchLabel = $('#wf_consol_problems_o3Content' + compId).find('.conprobo3-top-wrapper').find('span');
			var searchBar = $('#nomenSearchBar' + compId);
			var labelWidth = 0;

			this.resizeComponent();

			//offset the left margin so that the suggestions box displays properly
			if (searchLabel.length > 0 && searchBar.length > 0) {
				//get the width + any padding/margins of the label
				labelWidth = searchLabel.outerWidth(true);
				searchBar.css({
					'margin-left': labelWidth
				});
			}
		};

		method.showListView = function() {
			var listView = this.getListView();
			if (!listView) {
				listView = this.getFactory().listView();
				listView.setComponent(this);
				listView.setSharedCondResObj(this.getSharedCondResObj());
				listView.setClassificationFilter(this.getClassificationFilter());
				this.setListView(listView);
			}
			this.switchToView(listView);
		};

		method.showDetailedView = function(condition) {
			var detailedView = this.getDetailedView();
			if (!detailedView) {
				detailedView = this.getFactory().detailedView();
				detailedView.setComponent(this);
				detailedView.setSharedCondResObj(this.getSharedCondResObj());
				detailedView.setClassificationFilter(this.getClassificationFilter());
				detailedView.setCriterion(this.getCriterion());
				detailedView.setMetaObj(this.getMetaObj());
				detailedView.setIsInfoButtonEnabled(this.getInfoButtonInd());
				this.setDetailedView(detailedView);
			}
			this.switchToView(detailedView);
			detailedView.selectCondition(condition);
			this.resizeComponent();
		};

		/**
		 * Returns the height of the viewpoint viewable area when scroll is not
		 * considered. Used to determine how tall the component can be.
		 */
		method.calculateViewHeight = function() {
			var container = $("#vwpBody");
			if (!container.length) {
				return null;
			}

			var viewHeight = container.height();
			var sectionHeaderHeight = $(this.getHeaderElement()).outerHeight();
			var infoDivHeight = $("#cpo3InfoDiv" + this.getComponentId()).outerHeight();
			return viewHeight - sectionHeaderHeight - infoDivHeight - this.getMarginBottom();
		};

		/**
		 * Returns the component header DOM element
		 *
		 * @return {element}
		 */
		method.getHeaderElement = function() {
			return this.getRootComponentNode().firstChild;
		};

		/**
		 * Called when a condition is unresolved downstream
		 * @param condition
		 */
		method.unresolveCondition = function(condition) {
			this.getSharedCondResObj().retrieveSharedResourceData();
		};

		/**
		 * Called when a condition is unresolved downstream
		 * @param condition
		 */
		method.resolveCondition = function(condition) {
			this.getSharedCondResObj().retrieveSharedResourceData();
		};

		/**
		 * Called when a condition has a priority changed downstream
		 * @param condition
		 */
		method.changePriority = function(condition) {
			this.getSharedCondResObj().retrieveSharedResourceData();
		};

		/**
		 * Called when a condition is moved to chronic downstream
		 * @param condition
		 */
		method.moveConditionToChronic = function(condition) {
			this.getSharedCondResObj().retrieveSharedResourceData();
		};

		/**
		 * Called when a condition is moved to this visit downstream
		 * @param condition
		 */
		method.moveConditionToThisVisit = function(condition) {
			this.getSharedCondResObj().retrieveSharedResourceData();
		};

		method.cancelCondition = function(condition) {
			this.getSharedCondResObj().retrieveSharedResourceData();
		};

		method.updateSpecifiedConditions = function(conditions) {
			this.getUnspecifiedAlert().update();
			this.getCurrentView().update();
		};

		/**
		 * Called from downstream whenever the scrolling position of the
		 * current view needs to be updated.
		 *
		 * @param position
		 */
		method.updateCurrentViewScrollPosition = function(position) {
			this.getCurrentView().trigger("setScrollPosition", [position]);
		};

		/**
		 * Called when a condition is removed from this visit downstream.
		 * It will shift the priority of the next condition to the priority
		 * of the current one so that the resequencing algorithm knows
		 * which ones to resequence.
		 *
		 *
		 * @param condition
		 */
		method.removeConditionFromThisVisit = function(condition) {
			var toUpdate = this.getConditions().removeAndResequence(condition);
			var self = this;

			if (!toUpdate.length) {
				self.getSharedCondResObj().retrieveSharedResourceData();
				return;
			}

			toUpdate.update(function() {
				self.getSharedCondResObj().retrieveSharedResourceData();
			});
		};

		method.isPriorityEnabledConsideringPrivs = function() {
			return this.getCanModifyThisVisit() && this.getIsPriorityEnabled();
		};

		/**
		 * Cleans the count number displayed at the top of the component.
		 */
		method.clearCount = function() {
			var rootComponentNode = this.getRootComponentNode();
			var totalCount = $(rootComponentNode).find(".sec-total");
			totalCount.html("");
		};

		/**
		 * Called when someone downstream wants to scroll down to comments
		 */
		method.scrollToComments = function() {
			this.getCurrentView().trigger('scrollToComments');
		};

		/**
		 * Creates the filterMappings that will be used when loading the component's
		 * bedrock settings.
		 */
		method.loadFilterMappings = function() {
			// Vocabulary to be used when using the nomenclature search
			this.addFilterMappingObject("WF_CP3_DFT_SRCH_VCB", {
				setFunction: this.setDefaultSearchVocab,
				type: "NUMBER",
				field: "PARENT_ENTITY_ID"
			});
			// Vocabulary to be used when adding a condition for This Visit
			this.addFilterMappingObject("WF_CP3_VISIT_VOCAB", {
				setFunction: this.setThisVisitVocab,
				type: "NUMBER",
				field: "PARENT_ENTITY_ID"
			});
			// Vocabulary to be used when adding a condition as Chronic
			this.addFilterMappingObject("WF_CP3_ACTIVE_VOCAB", {
				setFunction: this.setChronicVocab,
				type: "NUMBER",
				field: "PARENT_ENTITY_ID"
			});
			// Diagnosis Classification applied to This Visit
			this.addFilterMappingObject("WF_CP3_QKADD_CLASS_DX", {
				setFunction: this.setThisVisitDxClassification,
				type: "NUMBER",
				field: "PARENT_ENTITY_ID"
			});
			// Diagnosis Type applied to This Visit.
			this.addFilterMappingObject("WF_CP3_QKADD_TYPE_DX", {
				setFunction: this.setThisVisitDxType,
				type: "NUMBER",
				field: "PARENT_ENTITY_ID"
			});
			// Confirmation applied to a diagnosis for This Visit
			this.addFilterMappingObject("WF_CP3_QKADD_CONF_STAT", {
				setFunction: this.setThisVisitDxConfirmation,
				type: "NUMBER",
				field: "PARENT_ENTITY_ID"
			});
			// Chronic/Historic Problem Classification
			this.addFilterMappingObject("WF_CP3_QKADD_CLASS", {
				setFunction: this.setChronicHistoricClassification,
				type: "NUMBER",
				field: "PARENT_ENTITY_ID"
			});
			// Confirmation applied to Chronic/ Historical.
			this.addFilterMappingObject("WF_CP3_QKADD_TYPE_CONF", {
				setFunction: this.setChronicHistoricConfirmation,
				type: "NUMBER",
				field: "PARENT_ENTITY_ID"
			});
			// Determines if the InfoButton should be displayed
			this.addFilterMappingObject("WF_CP3_INFO_BTN_IND", {
				setFunction: this.setInfoButtonInd,
				type: "BOOLEAN",
				field: "FREETEXT_DESC"
			});
			// Determines if This Visit Prioritization should be enabled
			this.addFilterMappingObject("WF_CP3_TV_PRIORITY_IND", {
				setFunction: this.setIsPriorityEnabled,
				type: "BOOLEAN",
				field: "FREETEXT_DESC"
			});
			// Determines if Modify Condition functionality should be enabled
			this.addFilterMappingObject("WF_CP3_MDF_DLG_IND", {
				setFunction: this.setModifyConditionInd,
				type: "BOOLEAN",
				field: "FREETEXT_DESC"
			});
			// Determines if the Diagnosis Assistant should be enabled
			this.addFilterMappingObject("WF_CP3_ENBL_DX_ASSIST", {
				setFunction: this.setIsDxAssistantEnabled,
				type: "BOOLEAN",
				field: "FREETEXT_DESC"
			});
			// Determines if any terminology flagging should be done
			this.addFilterMappingObject("WF_CP3_PROB_LIST_FLAG", {
				setFunction: this.setProblemListFlag,
				type: "NUMBER",
				field: "FREETEXT_DESC"
			});
			//Add the filter mapping object for the disclaimer text to be displayed in error banner when gap-check requirements are unsatisfied
			this.addFilterMappingObject("WF_CP3_HELP_TXT", {
				setFunction : this.setRequiredCompDisclaimerText,
				type : "STRING",
				field : "FTXT"
			});
			//Add the filter mapping for deciding whether override functionality is required or not
			this.addFilterMappingObject("WF_CP3_REQ_OVR", {
				setFunction : this.setOverrideInd,
				type : "Boolean",
				field : "FREETEXT_DESC"
			});
			//Add the filter mapping for required this visit vocabulary
			this.addFilterMappingObject("WF_CP3_VISIT_REQD_VOCAB", {
				setFunction : this.setReqdThisVisitVocab,
				type : "Array",
				field : "PARENT_ENTITY_ID"
			});
			//Add the filter mapping for required this vist classification
			this.addFilterMappingObject("WF_CP3_VISIT_REQD_CLASS", {
				setFunction : this.setReqdThisVisitClassification,
				type : "Array",
				field : "PARENT_ENTITY_ID"
			});
			//Add the filter mapping for required this vist confirmation
			this.addFilterMappingObject("WF_CP3_VISIT_REQD_CONF", {
				setFunction : this.setReqdThisVisitConfirmation,
				type : "Array",
				field : "PARENT_ENTITY_ID"
			});
			//Add the filter mapping for required this vist type
			this.addFilterMappingObject("WF_CP3_VISIT_REQD_TYPE", {
				setFunction : this.setReqdThisVisitType,
				type : "Array",
				field : "PARENT_ENTITY_ID"
			});
			//Add the filter mapping for required chronic vocabulary
			this.addFilterMappingObject("WF_CP3_CHRONIC_REQD_VOCAB", {
				setFunction : this.setReqdChronicVocab,
				type : "Array",
				field : "PARENT_ENTITY_ID"
			});
			//Add the filter mapping for required chronic classification
			this.addFilterMappingObject("WF_CP3_CHRONIC_REQD_CLASS", {
				setFunction : this.setReqdChronicClassification,
				type : "Array",
				field : "PARENT_ENTITY_ID"
			});
			//Add the filter mapping for required chronic confirmation
			this.addFilterMappingObject("WF_CP3_CHRONIC_REQD_CONF", {
				setFunction : this.setReqdChronicConfirmation,
				type : "Array",
				field : "PARENT_ENTITY_ID"
			});
			//Add the filter mapping for required chronic life-cycle status
			this.addFilterMappingObject("WF_CP3_CHRONIC_REQD_STATUS", {
				setFunction : this.setReqdChronicLifeCycleStatus,
				type : "Array",
				field : "PARENT_ENTITY_ID"
			});
		};

		return ConprobO3Component;
	});
define(
    "cerner/discernabu/components/conprobo3/controls/ConditionListTable",

    function () {

        var attribute = MPageOO.attribute;
        var inherits = MPageOO.inherits;
        var Condition = MPageEntity.entities.Condition;
        var i18n = window.i18n.discernabu.conprobo3_i18n;

        // ------------------------------------------------------------------------------
        // Initialization
        // ------------------------------------------------------------------------------

        /**
         * Lists the conditions specified by setConditions in a HTML table
         *
         * @constructor
         */
        var ConditionListTable = function (element, factory) {
            MPageControls.Control.call(this, element);
            this.setFactory(factory);
            var table = factory.componentTable();
            var activeGroup = factory.tableGroup();
            var historicalGroup = factory.tableGroup();
            
        	this.setTable(table);
            this.setActiveGroup(activeGroup);
            this.setHistoricalGroup(historicalGroup);

            /**
             * The DOM ID to be used for the component table.
             * Will be set on create.
             * @private
             */
            this.componentTableId = "";
        };
        
        ConditionListTable.prototype = new MPageControls.Control();
        var method = ConditionListTable.prototype;

        var COLUMNS = {
            DISPLAY: "display",
            CLASSIFICATION: "classification",
            ONSET: "onset",
            ACTIONS: "actions",
            COMMENT_IND: "comment_indicator"
        };
        
        var GROUPS = {
        	ACTIVE: "active_group",
        	HISTORICAL: "historical_group"
        };

        // ------------------------------------------------------------------------------
        // Attributes
        // ------------------------------------------------------------------------------

        /**
         * The Consolidated Problems option 3 component instance that this table is associated to
         */
        attribute(ConditionListTable, "Component");

        /**
         * The component table instance used to render the conditions.
         *
         */
        attribute(ConditionListTable, "Table");
        
        /**
         * The active conditions subsection
         */        
        attribute(ConditionListTable, "ActiveGroup");
        
        /**
         * The historical conditions subsection 
         */        
        attribute(ConditionListTable, "HistoricalGroup");

        /**
         * The list of conditions to be rendered.
         */
        attribute(ConditionListTable, "Conditions");

        /**
         * The factory object that will create instances of classes
         */
        attribute(ConditionListTable, "Factory");

        /**
         * Templates to be used for rendering
         */
        attribute(ConditionListTable, "Templates");

        /**
         * Instances of ConditionListTableRow that represent all the rows in the table
         */
        attribute(ConditionListTable, "Rows");
        
        attribute(ConditionListTable, "ActiveRows");
        
        attribute(ConditionListTable, "HistoricalRows");

        attribute(ConditionListTable, "TVHistoricalRows");

        /**
         * The maximum height, in pixels, the details panel will cover when not expanded.
         */
        attribute(ConditionListTable, "MaxHeight");

        /**
         * The current classification filter that is being used
         */
        attribute(ConditionListTable, "ClassificationFilter");
        
        /**
         * Vocab config from bedrock.
         */
		attribute(ConditionListTable, "BedrockConfig");

        attribute(ConditionListTable, "SharedCondResObj");

        attribute(ConditionListTable, "CanModifyThisVisit");

        attribute(ConditionListTable, "CanModifyChronic");

        attribute(ConditionListTable, "IsPriorityEnabled");

        attribute(ConditionListTable, "IsDxAssistantEnabled");

        // ------------------------------------------------------------------------------
        // Private Methods
        // ------------------------------------------------------------------------------

        /**
         * Instantiates row objects given a list of conditions.
         *
         * @param conditions
         */
        var createRows = function (conditions) {
            var rows = [];
            var activeRows = [];
            var historicalRows = [];
            var tvHistoricalRows = [];
            var build = this.getFactory();
            var self = this;
            var classFilter = this.getClassificationFilter();            
            this.setRows(rows);
            this.setActiveRows(activeRows);
            this.setHistoricalRows(historicalRows);
            this.setTVHistoricalRows(tvHistoricalRows);

            //Render conditions according to the current classification filter
            conditions.each(function (condition) {
                var row = null;
                var dxMeaning = (condition.getDiagnosisDriverFromArray()) ? condition.getDiagnosisDriverFromArray().getClassification().getMeaning() : "";
                var probMeaning = (condition.getProblemDriverFromArray()) ? condition.getProblemDriverFromArray().getClassificationMeaning() : "";
                var classificationFilterQual = ["MEDICAL", "PATSTATED"];
                if(condition.getIsCernerNKP()){
                    if(condition.getIsChronic()){
                        //create row for active NKP condition
                        row = build.conditionListTableNKPRow();
                    }
                    else{
                        //Avoid creation of row for inactive NKP condtion
                        return;
                    }
                }
                else if(classFilter === "ALL" || (classFilter === "MED_PATIENT" && (classificationFilterQual.indexOf(dxMeaning) > -1 || classificationFilterQual.indexOf(probMeaning) > -1))){
                    row = build.conditionListTableRow();
                    row.setBedrockConfig(self.getBedrockConfig());
                    row.setCanModifyChronic(self.getCanModifyChronic());
                    row.setCanModifyThisVisit(self.getCanModifyThisVisit());
                }
                if (row){
                    row.setComponent(self.getComponent());
                    row.setParent(self);
                    row.setCondition(condition);
                    row.setConditionList(conditions);
                    row.setSharedCondResObj(self.getSharedCondResObj());
                    row.setTemplates(self.getTemplates());
                    row.setIsPriorityEnabled(self.getIsPriorityEnabled());
                    row.setIsDxAssistantEnabled(self.getIsDxAssistantEnabled());
                    rows.push(row);
                    row.create();
                    
                    if(condition.getIsHistorical() && condition.getDiagnosisDriverFromArray() && !condition.getProblemDriverFromArray()){
                        tvHistoricalRows.push(row);
                    }
                    else if(condition.getIsHistorical() && !(condition.getIsChronic() || condition.getIsThisVisit())){
	                	historicalRows.push(row);

                        // also add to tvHistoricalRows so we can swap data out for the Previous Visit condition user filter
                        tvHistoricalRows.push(row);
	                } else {
	                	activeRows.push(row);
	                }
                }
            });
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Associates the element to the row and calls update on every instance.
         */
        var updateRows = function (noTVHistorical) {
            var rows = (noTVHistorical) ? this.getActiveRows().concat(this.getHistoricalRows()) : this.getRows();
            var activeCount = 0;
            var rowsLen = rows.length;
            for (var i=0; i<rowsLen; i++) {
                var row = rows[i];
                var isHistorical = row.getCondition().getIsHistorical() && !(row.getCondition().getIsChronic() || row.getCondition().getIsThisVisit());
                if(!isHistorical){
                	activeCount++;
                	row.setElement(this.getRowElement(i, isHistorical));
                } else{
                	row.setElement(this.getRowElement(i - activeCount, isHistorical));
                }
                row.update();
            }
        };

        // ------------------------------------------------------------------------------
        // Methods
        // ------------------------------------------------------------------------------

        /**
         * Creates the table that will hold the condition list
         */
        method.create = function () {
            this.componentTableId = this.getElementId();
            var table = this.getTable();
            table.setNamespace(this.componentTableId);
            this.initGroups();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Binds the table to the data and renders the HTML inside the control element
         */
        method.update = function () {
            if (!this.getConditions()) {
                throw new Error("There are no conditions for the ConditionListTable to " +
                                "render. Please use <ConditionListTable>.setConditions() " +
                                "method to specify a condition array.");
            }
            
            var table = this.getTable();
            var activeGroup = this.getActiveGroup();
            var historicalGroup = this.getHistoricalGroup();
            var userPrefs = this.getComponent().getPreferencesObj();
            var noTVHistorical = true;
            
            // check for a this visit historical pref, if it doesn't exist create it and set it to blank by default
            if(userPrefs && userPrefs.tvHistFilterPref == undefined) {
            	userPrefs.tvHistFilterPref = "";
            }

            table.clearGroups();

            // order the conditions by their types
            var ordered = this.getConditions().sortByType([
                Condition.TYPES.THIS_VISIT,
                Condition.TYPES.NKP,
                Condition.TYPES.CHRONIC,
                Condition.TYPES.HISTORICAL
            ]);

            // sort the dx priorities
            var sortedByPriority = ordered.sortByPriority();
            ordered = ordered.filter("isThisVisit", false);
            ordered = sortedByPriority.concat(ordered);

            createRows.call(this, ordered);
            
            if(this.getActiveRows().length){
            	activeGroup.clearData();
            	activeGroup.bindData(this.getActiveRows());
            	
            	if(!table.hasGroup(GROUPS.ACTIVE)){
					table.addGroup(activeGroup);
				}
			}
            
            if(userPrefs && userPrefs.tvHistFilterPref && this.getTVHistoricalRows().length){
                noTVHistorical = false;
                historicalGroup.clearData();
                historicalGroup.bindData(this.getTVHistoricalRows());

                if(!table.hasGroup(GROUPS.HISTORICAL)){
                    table.addGroup(historicalGroup);
                }
            }
            else if(this.getHistoricalRows().length || this.getTVHistoricalRows().length){
            	// previous visit conditions filter is not selected but only previous visit conditions may exisit
                noTVHistorical = true;
            	historicalGroup.clearData();
            	historicalGroup.bindData(this.getHistoricalRows());
            	
            	if(!table.hasGroup(GROUPS.HISTORICAL)){
            		table.addGroup(historicalGroup);
            	}
            }

            // initialize the component table override functions
            this.compTableOverrides(table);

            // renders the table
            table.bindData(this.getRows());
            this.getElement().html(table.render());

            table.finalize();

            this.attachEvents();

            updateRows.call(this, noTVHistorical);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Returns the DOM element for the row at a specified index within either the Active or Historical group.
         * @param {number} index : The index number of the row relative to the group its within
         * @param {boolean} isHistorical : True/False value to determine if the desired row resides within the Historical group
         * 
         * In order to grab the dom element of the specified row, we must traverse the structure of the table body element.
         * This structure is as follows:
         * 	
         * 	<TableBody>
         * 			<div>
         * 					<Active Group>
         * 							<h3 - active group header>
         * 							<active group content>
         * 									<row elements @ [index]..>
         * 									..
         * 					<Historical Group>
         * 							<h3 - historical group header>
         * 							<historical group content>
         * 									<row elements @ [index]..>
         * 									..
         */
        method.getRowElement = function(index, isHistorical) {
            var tableBody = this.getBodyElement();
            var activeSection = tableBody.children[0].children[0];
            var historicalSection = tableBody.children[0].children[1];
            
            if(isHistorical && historicalSection){
            	return historicalSection.children[1].children[index];
            }
            if(activeSection){
            	return activeSection.children[1].children[index];
            }
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.getBodyElement = function() {
            return document.getElementById(this.componentTableId + "tableBody");
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.getHeaderElement = function() {
            return document.getElementById(this.componentTableId + "headerWrapper");
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        
        /**
         * Initializes the active and historical subsection groups 
         */
        method.initGroups = function() {
        	var activeGroup = null;
        	var historicalGroup = null;
        	
        	// check for previously initialized groups
        	if(this.getParent().getParent().getCurrentView()){
        		activeGroup = this.getParent().getParent().getCurrentView().getConditionListTable().getActiveGroup();
        		historicalGroup = this.getParent().getParent().getCurrentView().getConditionListTable().getHistoricalGroup();
        		this.setActiveGroup(activeGroup);
        		this.setHistoricalGroup(historicalGroup);
        	} else {
        		activeGroup = this.getActiveGroup();
        		historicalGroup = this.getHistoricalGroup();
        		
        		activeGroup.setGroupId(GROUPS.ACTIVE);
        		activeGroup.setIsExpanded(true);
        		activeGroup.setHideHeader(true);
        		
        		historicalGroup.setGroupId(GROUPS.HISTORICAL);
        		historicalGroup.setIsExpanded(false);
        		historicalGroup.setDisplay(i18n.HISTORICAL);
        	}
        };

        /**
         * Tells the control that the display column of the table will be rendered.
         * Must be used before create.
         */
        method.addCommentIndicatorColumn = function() {
            var commentIndColumn = this.getFactory().tableColumn();
            commentIndColumn.setColumnId(COLUMNS.COMMENT_IND);
            commentIndColumn.setColumnDisplay("");
            commentIndColumn.setCustomClass("condition-comment");
            commentIndColumn.setIsSortable(false);
            commentIndColumn.setRenderTemplate("${makeCommentsIndCellHtml()}");
            this.getTable().addColumn(commentIndColumn);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Tells the control that the display column of the table will be rendered.
         * Must be used before create.
         */
        method.addDisplayColumn = function() {
            var displayColumn = this.getFactory().tableColumn();
            displayColumn.setColumnId(COLUMNS.DISPLAY);
            displayColumn.setColumnDisplay(i18n.NAME);
            displayColumn.setCustomClass("condition-name");
            displayColumn.setIsSortable(false);
            displayColumn.setRenderTemplate("${makeDisplayCellHtml()}");
            this.getTable().addColumn(displayColumn);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

   		/**
         * Tells the control that the onset column of the table will be rendered.
         * Must be used before create.
         */
        method.addClassificationColumn = function() {
            var classificationColumn = this.getFactory().tableColumn();
            classificationColumn.setColumnId(COLUMNS.CLASSIFICATION);
            classificationColumn.setColumnDisplay(i18n.CLASSIFICATION);
            classificationColumn.setIsSortable(false);
            classificationColumn.setCustomClass("condition-classification");
            classificationColumn.setRenderTemplate("${makeClassificationCellHtml()}");
            this.getTable().addColumn(classificationColumn);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Adds the "actions" column
         */
        method.addActionsColumn = function() {
            var actionsColumn = this.getFactory().tableColumn();
            actionsColumn.setColumnId(COLUMNS.ACTIONS);
            actionsColumn.setColumnDisplay(i18n.ACTIONS);
            actionsColumn.setIsSortable(false);
            actionsColumn.setCustomClass("condition-actions");
            actionsColumn.setRenderTemplate("${makeActionsCellHtml()}");
            this.getTable().addColumn(actionsColumn);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Adds a highlight class to the row of the specified condition.
         * Will also remove any previous highlighting
         */
        method.highlightCondition = function(condition) {
            var rows = this.getRows();
            for (var i=rows.length; i--;) {
                var row = rows[i];
                if (row.getCondition() == condition) {
                    row.highlight();
                } else {
                    row.unhighlight();
                }
            }
        };

        /**
         * Method used to attached events to various elements as needed.
         * This is currently utilized for the This Visit Historical Filter.
         */
        method.attachEvents = function() {
            var self = this;
            var component = this.getComponent();
            var historicalGroupId = this.getElementId() + '\\:historical_group';
            var tvHistFilter = $('#tvHistFilter' + historicalGroupId);
            var listTable = this.getTable();

            if(tvHistFilter.length > 0){
                tvHistFilter.on("click", "input", function() {
                    var checkedPref = $(this).prop('checked') ? 'checked' : '';
                    var data = (checkedPref) ? self.getTVHistoricalRows() : self.getHistoricalRows();
                    var histGroup = listTable.getGroupById('historical_group');
                    var userPrefs = component.getPreferencesObj();
            		var localPrefs = userPrefs ? userPrefs : {};

                    // save the user preference
                    if(localPrefs) {
                        localPrefs.tvHistFilterPref = checkedPref;
                        component.setPreferencesObj(localPrefs);
                        component.savePreferences(true);
                    }

                    histGroup.clearData();
                    histGroup.bindData(data);
                    listTable.refresh();
                    self.update();
                    component.resizeComponent();
                });
            }
        };

        /**
         * Method containing various override functions for component table
         */
        method.compTableOverrides = function (compTable) {

            /**
             * Overrides the base function so that a user filter can be added to 
             * show/hide conditions only associated wtih previous visit diagnoses
             */
            compTable.renderGroup = function(group) {
                var headId = this.namespace + ":" + group.getGroupId();
                var escapedHeadId = this.namespace + "\\:" + group.getGroupId();
                var headToggleTitle = group.isExpanded() ? window.i18n.discernabu.HIDE_SECTION : window.i18n.discernabu.SHOW_SECTION;
                var headToggleContent = group.isExpanded() ? "-" : "+";
                var headToggleClass = group.isExpanded() ? "" : "closed";
                var countHtml = group.getShowCount() ? "<span class='sub-sec-total'>&nbsp;(" + group.getRows().length + ")</span>" : "";
                var toggleHtml = group.getCanCollapse() ? ("<span class='sub-sec-hd-tgl' title='"+headToggleTitle + "'>"+ headToggleContent +"</span>") : "";
                var groupCollapsibility = group.getCanCollapse() ? "can-collapse " : "";
                var hideHeader = group.getHideHeader() ? "hidden'" : "";
                var tvHistFilter = $('#' + escapedHeadId).find('#tvHistFilter' + escapedHeadId + '> input');
                var component = (this.getRows().length > 0) ? this.getRows()[0].getResultData().getComponent() : null;
                var userPrefs = (component) ? component.getPreferencesObj() : null;
                var localPrefs = (userPrefs) ? userPrefs : {};
                var isChecked = (tvHistFilter.length && tvHistFilter.prop('checked')) ? 'checked' : '';

                if(localPrefs.tvHistFilterPref && !tvHistFilter.length) {
                    // Only apply the user pref if the filter hasn't been rendered yet
                    isChecked = localPrefs.tvHistFilterPref;
                }

                return "<div id='" + headId + "' class='" + headToggleClass + "'><h3 id='" + headId + ":header" + "' class='sub-sec-hd " + groupCollapsibility + hideHeader + "'>" + toggleHtml + "<span class='sub-sec-title' style='display:inline-block'><" + this.getRowTag() + "><" + this.getColumnTag() + "><span class='sub-sec-display'>" + group.getDisplay() + "</span>" + countHtml + "</" + this.getColumnTag() + "></" + this.getRowTag() + "></span><span id='tvHistFilter" + headId + "' class='conprobo3-tv-hist-filter'>" + i18n.SHOW_PREV_VISITS + "  <input type='checkbox' style='vertical-align:middle' " + isChecked + "></input></span></h3>" +
                    "<div id='" + headId + ":content' class='sub-sec-content'>" +
                    (group.getRows().length ? this.renderRows(group.getRows(), group.getGroupId()) : this.renderNoResults()) +
                    "</div>" +
                    "</div>";
            };
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.getHeight = function() {
            return this.getElement().outerHeight();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.setMaxHeight = function(height) {
            var body = this.getBodyElement();
            var header = this.getHeaderElement();
            var bodyMaxHeight = height - $(header).outerHeight();
            $(body).css("max-height", bodyMaxHeight);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.resize = function() {
            this.getTable().updateAfterResize();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.getScrollPosition = function() {
            return this.getBodyElement().scrollTop;
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.setScrollPosition = function(position) {
            this.getBodyElement().scrollTop = position;
        };


        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.scrollToComments = function() {
            this.fire('scrollToComments');
        };

        // --------------------------------------------------------------------
        // Routed Events
        // --------------------------------------------------------------------

        method.moveConditionToThisVisit = function (condition) {
            this.fire("moveConditionToThisVisit",[condition]);
        };

        method.removeConditionFromThisVisit = function (condition) {
            this.fire("removeConditionFromThisVisit",[condition]);
        };

        method.moveConditionToChronic = function (condition) {
            this.fire("moveConditionToChronic",[condition]);
        };

        method.resolveCondition= function (condition) {
            this.fire("resolveCondition",[condition]);
        };

        method.unresolveCondition= function (condition) {
            this.fire("unresolveCondition",[condition]);
        };

        method.handleDuplicates = function(isThisVisit, raw){
            this.fire("handleDuplicates", [isThisVisit, raw]);
        };

        method.selectCondition = function (condition) {
            this.fire("selectCondition",[condition]);
        };

        method.changePriority = function(condition) {
            this.fire("changePriority", [condition]);
        };

        method.cancelCondition = function(condition) {
            this.fire("cancelCondition", [condition]);
        };

        method.updateSpecifiedConditions = function(conditions) {
            this.update();
            this.fire("updateSpecifiedConditions", [conditions]);
        };

        return ConditionListTable;
    }
);
define(
    "cerner/discernabu/components/conprobo3/controls/ConditionListTableNKPRow", 
    ["cerner/discernabu/components/conprobo3/controls/ConditionListTableRow"],

    function (ConditionListTableRow) {

        var Control = MPageControls.Control;
        var attribute = MPageOO.attribute;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var ConditionListTableNKPRow = function (factory) {
            ConditionListTableRow.call(this, factory);
        };

       ConditionListTableNKPRow.prototype = new ConditionListTableRow();
        var method = ConditionListTableNKPRow.prototype;

        attribute(ConditionListTableNKPRow, "CancelButton");

        // --------------------------------------------------------------------
        // Attributes
        // --------------------------------------------------------------------


        // --------------------------------------------------------------------
        // Private
        // --------------------------------------------------------------------

        var createControl = function(control) {
          control.setParent(this);
          control.setCondition(this.getCondition());
        };

        var initControl = function (control) {
            if (control.getElement() === null) {
                return;
            }
            control.init();
        };

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------

        method.create = function () {
            var build = this.getFactory();
            var cancelButton = build.cancelButton();
            cancelButton.setSharedCondResObj(this.getSharedCondResObj());
            this.setCancelButton(cancelButton);
            createControl.call(this, this.getCancelButton());
        };

        method.update = function () {
            initControl.call(this, this.getCancelButton());
        };

        method.highlight = function() {
            //Ensure rows are not selected in NKP row
        };

        method.unhighlight = function() {
            //Ensure highlight action not performed on NKP row
        };

        method.redirectEventToControls = function (eventName, args) {
            //Not relevent besides cancel action
            this.getCancelButton().trigger(eventName, args);
        };

        method.makeTemplateContext = function() {
            var canNKPModify = false;
            var nkpProblemDriver = this.getCondition().getProblemDriverFromArray();
            if (nkpProblemDriver){
                canNKPModify = nkpProblemDriver.getCanCondModify();
            }
            if (this.templateContext) {
                return this.templateContext;
            }

            this.templateContext = {
                cancelButtonId: this.getCancelButton().getElementId(),
                canModify: canNKPModify,
                condition: {
                	targetNomenclature: this.getCondition().getTargetNomenclatureValue(),
                    classificationDisplay: this.getCondition().getClassificationDisplay(),
                    display: this.getCondition().getDisplay()
                }
            };
            return this.templateContext;
        };

        method.makeDisplayCellHtml = function() {
            return this.getTemplates().nkpDisplayColumn(this.makeTemplateContext());
        };

        method.makeActionsCellHtml = function() {
            return this.getTemplates().nkpActionColumn(this.makeTemplateContext());
        };

        method.makeClassificationCellHtml = function() {
            return this.getTemplates().classificationColumn(this.makeTemplateContext());
        };

        // --------------------------------------------------------------------
        // Routed Events
        // --------------------------------------------------------------------

        method.moveConditionToThisVisit = function (condition) {
            //remove this event for nkp
        };

        method.removeConditionFromThisVisit = function (condition) {
            //remove this event for nkp
        };

        method.moveConditionToChronic = function (condition) {
            //Remove move to chronic
        };

        method.resolveCondition= function (condition) {
            //Remove resolve event
        };

        method.selectCondition = function (condition) {
            //Remove select event
        };

        return ConditionListTableNKPRow;
    }
);
define(
    "cerner/discernabu/components/conprobo3/controls/ConditionListTableRow",

    function () {

        var Control = MPageControls.Control;
        var attribute = MPageOO.attribute;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var ConditionListTableRow = function (factory) {
            Control.call(this);
            this.setFactory(factory);
        };

        ConditionListTableRow.prototype = new Control();
        var method = ConditionListTableRow.prototype;

        // --------------------------------------------------------------------
        // Attributes
        // --------------------------------------------------------------------

        attribute(ConditionListTableRow, "Component");
        attribute(ConditionListTableRow, "Factory");
        attribute(ConditionListTableRow, "ThisVisitToggle");
        attribute(ConditionListTableRow, "ChronicToggle");
        attribute(ConditionListTableRow, "SelectConditionButton");
        attribute(ConditionListTableRow, "Condition");
        attribute(ConditionListTableRow, "BedrockConfig");
        attribute(ConditionListTableRow, "SharedCondResObj");
        attribute(ConditionListTableRow, "PriorityDropDown");
        attribute(ConditionListTableRow, "ResolvedToggle");
        attribute(ConditionListTableRow, "Templates");
        attribute(ConditionListTableRow, "CanModifyThisVisit");
        attribute(ConditionListTableRow, "CanModifyChronic");
        attribute(ConditionListTableRow, "ConditionList");
        attribute(ConditionListTableRow, "IsPriorityEnabled");
        attribute(ConditionListTableRow, "IsDxAssistantEnabled");
        attribute(ConditionListTableRow, "DxAssistantButton");
        attribute(ConditionListTableRow, "CommentIndicatorButton");

        // --------------------------------------------------------------------
        // Private
        // --------------------------------------------------------------------

        var createControl = function(control) {
          control.setParent(this);
          control.setCondition(this.getCondition());
        };

        var initControl = function (control) {
            if (control.getElement() === null) {
                return;
            }
            control.init();
        };

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------

        method.create = function () {
            var build = this.getFactory();
            var thisVisitToggle = build.thisVisitToggle();
            var chronicToggle = build.chronicToggle();
            var resolvedToggle = build.resolvedToggle();
            var dxAssistantButton = build.dxAssistantButton();
            var commentIndicatorButton = build.commentIndicatorButton();

            thisVisitToggle.setBedrockConfig(this.getBedrockConfig());
            thisVisitToggle.setSharedCondResObj(this.getSharedCondResObj());
            thisVisitToggle.setCanModifyThisVisit(this.getCanModifyThisVisit());
            thisVisitToggle.setConditions(this.getConditionList());
            thisVisitToggle.setIsPriorityEnabled(this.getIsPriorityEnabled());
            chronicToggle.setBedrockConfig(this.getBedrockConfig());
            chronicToggle.setSharedCondResObj(this.getSharedCondResObj());
            chronicToggle.setCanModifyChronic(this.getCanModifyChronic());
            resolvedToggle.setBedrockConfig(this.getBedrockConfig());
            resolvedToggle.setSharedCondResObj(this.getSharedCondResObj());
            resolvedToggle.setCanModifyChronic(this.getCanModifyChronic());

            this.setCommentIndicatorButton(commentIndicatorButton);
            this.setThisVisitToggle(thisVisitToggle);
            this.setChronicToggle(chronicToggle);
            this.setSelectConditionButton(build.selectConditionButton());
            this.setResolvedToggle(resolvedToggle);
            this.setPriorityDropDown(build.priorityDropDown());
            this.setDxAssistantButton(build.dxAssistantButton());

            this.getPriorityDropDown().setItemTemplate(this.getTemplates().priorityDropDownItem);
            this.getPriorityDropDown().setConditions(this.getConditionList());
            this.getDxAssistantButton().setConditions(this.getConditionList());

            createControl.call(this, this.getCommentIndicatorButton());
            createControl.call(this, this.getThisVisitToggle());
            createControl.call(this, this.getChronicToggle());
            createControl.call(this, this.getSelectConditionButton());
            createControl.call(this, this.getResolvedToggle());
            createControl.call(this, this.getPriorityDropDown());
            createControl.call(this, this.getDxAssistantButton());
        };

        method.update = function () {
            initControl.call(this, this.getThisVisitToggle());
            initControl.call(this, this.getChronicToggle());
            initControl.call(this, this.getSelectConditionButton());
            initControl.call(this, this.getResolvedToggle());
            initControl.call(this, this.getPriorityDropDown());
            initControl.call(this, this.getDxAssistantButton());
            initControl.call(this, this.getCommentIndicatorButton());
            this.flagProblemRow();
        };

        method.highlight = function() {
            var el = document.getElementById(this.getElementId());
            $(el).addClass("highlight");
        };

        method.unhighlight = function() {
            var el = document.getElementById(this.getElementId());
            $(el).removeClass("highlight");
        };

        method.flagProblemRow = function() {
            var el = document.getElementById(this.getElementId());
            var condition = this.getCondition();
            var bedrockConfig = this.getBedrockConfig();
            if(condition.isFlagged(bedrockConfig)){
                $(el).addClass('flagged-problem');
            }
        };

        method.redirectEventToControls = function (eventName, args) {
            this.getThisVisitToggle().trigger(eventName, args);
            this.getChronicToggle().trigger(eventName, args);
            this.getSelectConditionButton().trigger(eventName, args);
            this.getResolvedToggle().trigger(eventName, args);
            this.getPriorityDropDown().trigger(eventName, args);
        };

        method.makeTemplateContext = function() {
            if (this.templateContext) {
                return this.templateContext;
            }

            this.templateContext = {
                selectConditionBtnId: this.getSelectConditionButton().getElementId(),
                chronicToggleId: this.getChronicToggle().getElementId(),
                thisVisitToggleId: this.getThisVisitToggle().getElementId(),
                resolvedToggleId: this.getResolvedToggle().getElementId(),
                priorityDropDownId: this.getPriorityDropDown().getElementId(),
                canModifyThisVisit: this.getCanModifyThisVisit(),
                canModifyChronic: this.getCanModifyChronic(),
                isPriorityEnabled: this.getIsPriorityEnabled(),
                isDxAssistantEnabled : this.getIsDxAssistantEnabled(),
                dxAssButtId: this.getDxAssistantButton().getElementId(),
                showDxAssIcon: this.getCondition().hasDxAssistant() && !this.getCondition().getIsSpecific(),
                commentsIndButtId: this.getCommentIndicatorButton().getElementId(),
                condition: {
                    priorityDisplay: this.getCondition().getPriorityDisplay(),
                	targetNomenclature: this.getCondition().getTargetNomenclatureValue(),
                    classificationDisplay: this.getCondition().getClassificationDisplay(),
                    display: this.getCondition().getDisplay(),
                    isThisVisit: this.getCondition().getIsThisVisit(),
                    isChronic: this.getCondition().getIsChronic(),
                    canModifyThisVisit: this.getCondition().canModifyThisVisit(),
                    canModifyChronic: this.getCondition().canModifyChronic(),
                    isInactive: this.getCondition().getIsInactive(),
                    isHistorical: this.getCondition().getIsHistorical(),
                    showCommentIcon: this.getCondition().getComments().length ? true : false,
                    canModify: this.getCondition().canModify(),
                    hasProblem: (this.getCondition().getProblemDriverValue()) ? true : false,
                    Problems: this.getCondition().getProblems(),
                    hasDx: (this.getCondition().getDiagnosisDriverValue()) ? true : false
                }
            };
            return this.templateContext;
        };

        method.makeDisplayCellHtml = function() {
            return this.getTemplates().displayColumn(this.makeTemplateContext());
        };

        method.makeActionsCellHtml = function() {
            return this.getTemplates().actionsColumn(this.makeTemplateContext());
        };

        method.makeClassificationCellHtml = function() {
            return this.getTemplates().classificationColumn(this.makeTemplateContext());
        };

        method.makeCommentsIndCellHtml = function() {
            return this.getTemplates().commentsIndicatorColumn(this.makeTemplateContext());
        };

        // --------------------------------------------------------------------
        // Routed Events
        // --------------------------------------------------------------------

        method.moveConditionToThisVisit = function (condition) {
            this.redirectEventToControls("moveConditionToThisVisit", [condition]);
            this.fire("moveConditionToThisVisit", [condition]);
        };

        method.removeConditionFromThisVisit = function (condition) {
            this.fire("removeConditionFromThisVisit", [condition]);
        };

        method.moveConditionToChronic = function (condition) {
            this.redirectEventToControls("moveConditionToChronic", [condition]);
            this.fire("moveConditionToChronic", [condition]);
        };

        method.resolveCondition= function (condition) {
            this.redirectEventToControls("resolveCondition", [condition]);
            this.fire("resolveCondition",[condition]);
        };

        method.selectCondition = function (condition) {
            this.fire("selectCondition", [condition]);
        };

        method.unresolveCondition = function(condition) {
            this.fire("unresolveCondition", [condition]);
        };

        method.handleDuplicates = function(isThisVisit, raw){
            this.fire("handleDuplicates", [isThisVisit, raw]);
        };
        
        method.changePriority = function(condition) {
            this.fire("changePriority", [condition]);
        };

        method.cancelCondition = function(condition) {
            this.fire("cancelCondition", [condition]);
        };

        method.updateSpecifiedConditions = function(conditions) {
            this.fire("updateSpecifiedConditions", [conditions]);
        };

        method.scrollToComments = function() {
            this.fire('scrollToComments');
        };

        return ConditionListTableRow;
    }
);
define(
    "cerner/discernabu/components/conprobo3/controls/DetailsPanel",

    function () {

        var attribute = MPageOO.attribute;
        var Control = MPageControls.Control;
        var i18n = window.i18n.discernabu.conprobo3_i18n;
        // ------------------------------------------------------------------------------
        // Initialization
        // ------------------------------------------------------------------------------

        /**
         * Displays a side panel with detailed condition information
         *
         * @param element
         * @param factory
         * @constructor
         */
        var DetailsPanel = function (element, factory) {
            Control.call(this, element);
            this.setIsExpanded(false);
            this.setFactory(factory);
            this.setIsCreated(false);
        };

        DetailsPanel.prototype = new Control();
        var method = DetailsPanel.prototype;

        // ------------------------------------------------------------------------------
        // Attributes
        // ------------------------------------------------------------------------------

        /**
         * The sidepanel control instance
         */
        attribute(DetailsPanel, "SidePanel");

        /**
         * The condition that is currently being displayed
         */
        attribute(DetailsPanel, "Condition");

        /**
         * The factory responsible for creating object instances
         */
        attribute(DetailsPanel, "Factory");

		/**
         * The toggle button for this visit
         */
        attribute(DetailsPanel, "ThisVisitToggle");

		/**
         * The toggle button for chronic (ongoing)
         */
        attribute(DetailsPanel, "ChronicToggle");
	
		/*
         * Vocab configuration from bedrock.	 
         */
		attribute(DetailsPanel, "BedrockConfig");

        /**
         * Button to launch the modify dialog (win32 or web, depending on platform) for
         * the current condition.
         */
        attribute(DetailsPanel, "ModifyButton");

        /**
         * Resolves a condition when toggled, or displays a condition as resolved
         * by being active.
         */ 
        attribute(DetailsPanel, "ResolvedToggle");

        /**
         * Link/button to launch a page with information about the current condition
         */
        attribute(DetailsPanel, "InfoButton");

        /**
         * Button to collapse the side panel
         */
        attribute(DetailsPanel, "CloseButton");

        /**
         * Banner for problem flags
         */
        attribute(DetailsPanel, "FlaggedProblemBanner");

        /**
         * The maximum height, in pixels, the details panel will cover when not expanded.
         */
        attribute(DetailsPanel, "MaxHeight");

        /**
         * Whether this control has been created already
         */
        attribute(DetailsPanel, "IsCreated");

        attribute(DetailsPanel, "CanModifyThisVisit");

        attribute(DetailsPanel, "CanModifyChronic");

        /**
         * The button for cancellation
         */
        attribute(DetailsPanel, "CancelButton");

        attribute(DetailsPanel, "HistoricalTable");

        /**
         * The shared resource object for this component
         */
         attribute(DetailsPanel, "SharedCondResObj");
                    
         /**
         * The criterion object for this component
         */
         attribute(DetailsPanel, "Criterion");
         
         /**
         * The extra meta object returned by the condition entity
         */
         attribute(DetailsPanel, "MetaObj");
         
         /**
         * The InfoButton Modal Window object
         */
         attribute(DetailsPanel, "InfoButtonErrorModal");
         
         /**
          * Flag to determiner the InfoButton is enabled.
          */
         attribute(DetailsPanel, "IsInfoButtonEnabled");
         
        /**
         * Whether the panel is expanded or collapsed
         */
        attribute(DetailsPanel, "IsExpanded");

        /**
         * The control that manages condition comments
         */
         attribute(DetailsPanel, "CommentPanel");

        /**
         * Whether the dx assistant functionality is enabled or not
         */
        attribute(DetailsPanel, "IsDxAssistantEnabled");

        /**
         * The button that, when clicked, launches the dx assistant
         */
        attribute(DetailsPanel, "DxAssistantButton");

        /**
         * All the conditions
         */
        attribute(DetailsPanel, "ConditionList");


        // ------------------------------------------------------------------------------
        // Private Methods
        // ------------------------------------------------------------------------------
        var createSidePanel = function() {
            var sp = this.getFactory().sidePanel();
            sp.setContainerElementId(this.getElementId());
            sp.setExpandOption(sp.expandOption.EXPAND_DOWN);
            sp.setUniqueId("side_panel_" + this.getControlId());
            sp.setContainerElementId(this.getElementId());
            sp.setMinHeight("400px");

            var self = this;
            sp.setOnExpandFunction(function() {
                self.setIsExpanded(true);
            });
            sp.setOnCollapseFunction(function() {
                self.setIsExpanded(false);
                self.resize();
            });

            this.setSidePanel(sp);
        };

        // ------------------------------------------------------------------------------
        // Methods
        // ------------------------------------------------------------------------------

        /**
         * Initializes the side panel object instance
         */
        method.create = function () {
            createSidePanel.call(this);

            var build = this.getFactory();

            var flaggedBanner = build.infoBanner();
            flaggedBanner.setMessage("<span>" + i18n.NONPREFERRED_TERM_MSG + "</span>");
            flaggedBanner.setBedrockConfig(this.getBedrockConfig());
            flaggedBanner.setParent(this);
            this.setFlaggedProblemBanner(flaggedBanner);

            var closeBtn = build.closeDetailsPanelButton();
            closeBtn.setParent(this);
            this.setCloseButton(closeBtn);

            var thisVisitToggle = build.thisVisitToggle();
	    	thisVisitToggle.setBedrockConfig(this.getBedrockConfig());
	    	thisVisitToggle.setCanModifyThisVisit(this.getCanModifyThisVisit());
            thisVisitToggle.setParent(this);
            this.setThisVisitToggle(thisVisitToggle);

            var chronicToggle = build.chronicToggle();
            chronicToggle.setBedrockConfig(this.getBedrockConfig());
            chronicToggle.setCanModifyChronic(this.getCanModifyChronic());
            chronicToggle.setParent(this);
            this.setChronicToggle(chronicToggle);

            var modifyButton = build.modifyButton();
            modifyButton.setParent(this);
            modifyButton.setSharedCondResObj(this.getSharedCondResObj());
            modifyButton.setBedrockConfig(this.getBedrockConfig());
            this.setModifyButton(modifyButton);

            var resolvedToggle = build.resolvedToggle();
            resolvedToggle.setParent(this);
            resolvedToggle.setBedrockConfig(this.getBedrockConfig());
            resolvedToggle.setCanModifyChronic(this.getCanModifyChronic());
            this.setResolvedToggle(resolvedToggle);

            var infoButton = build.infoButton();
            infoButton.setParent(this);
			infoButton.setCriterion(this.getCriterion());
            this.setInfoButton(infoButton);

            var cancelButton = build.cancelButton();
            cancelButton.setParent(this);
            cancelButton.setSharedCondResObj(this.getSharedCondResObj());
            this.setCancelButton(cancelButton);

            var commentPanel = build.commentPanel();
            commentPanel.setParent(this);
            this.setCommentPanel(commentPanel);

            var historicalTable = build.historicalTable();
            historicalTable.setParent(this);
            historicalTable.addOnsetColumn();
            historicalTable.addDisplayColumn();
            historicalTable.create();
            this.setHistoricalTable(historicalTable);

            var dxAssButt = build.dxAssistantButton();
            dxAssButt.setParent(this);
            dxAssButt.setConditions(this.getConditionList());
            dxAssButt.setCondition(this.getCondition());
            this.setDxAssistantButton(dxAssButt);
        };

        method.show = function() {
            if (this.getIsCreated()) {
                this.getSidePanel().collapseSidePanel();
            }
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * (re)render the side panel with up to date condition information as set by
         * setCondition()
         */
        method.update = function () {
            if (!this.getCondition()) {
                return;
            }

            var build = this.getFactory();
            var sp = this.getSidePanel();
            var condition = this.getCondition();
            
            // updates the controls with the condition
            this.getFlaggedProblemBanner().setCondition(condition);
            this.getThisVisitToggle().setCondition(condition);
            this.getChronicToggle().setCondition(condition);
            this.getModifyButton().setCondition(condition);
            this.getResolvedToggle().setCondition(condition);
            this.getInfoButton().setCondition(condition);
            this.getCancelButton().setCondition(condition);
            this.getHistoricalTable().setCondition(condition);
            this.getCommentPanel().setCondition(condition);
            this.getDxAssistantButton().setCondition(condition);
            this.getDxAssistantButton().setConditions(this.getConditionList());

            // renders the side panel
            var section = this.getElement().closest(".section");
            this.getSidePanel().renderSidePanel();
            sp.setContents(build.detailedTemplate().sidePanel(this), section.attr("id"));
            sp.showCloseButton();

            // initializes the buttons
            this.getFlaggedProblemBanner().init();
            this.getThisVisitToggle().init();
            this.getChronicToggle().init();
            this.getModifyButton().init();
            this.getResolvedToggle().init();
            this.getInfoButton().init();
            this.getCloseButton().init();
            this.getCancelButton().init();
            this.getDxAssistantButton().init();

            this.getHistoricalTable().loadNomenclatureInfo();

            // comments
            this.getCommentPanel().create();
            this.getCommentPanel().update();

            this.setIsCreated(true);
            this.resize();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Triggers the specified event on all child controls
         */
        method.redirectEventToControls = function(eventName, args) {
            this.getThisVisitToggle().trigger(eventName, args);
            this.getChronicToggle().trigger(eventName, args);
            this.getModifyButton().trigger(eventName, args);
            this.getResolvedToggle().trigger(eventName, args);
            this.getInfoButton().trigger(eventName, args);
            this.getCancelButton().trigger(eventName, args);
        };

        /**
         * Intercepts the resolveCondition event, bubbles it up and redirects to controls
         */
        method.resolveCondition = function(condition) {
            this.fire("resolveCondition", [condition]);
            this.redirectEventToControls("resolveCondition", [condition]);
        };

        /**
         * Intercepts the handleDuplicates event and bubbles it up
         */
        method.handleDuplicates = function(isThisVisit, raw){
            this.fire("handleDuplicates", [isThisVisit, raw]);
        };
	
        /**
         * Intercepts the unresolveCondition event and bubbles it up
         */
        method.unresolveCondition= function (condition) {
            this.fire("resolveCondition",[condition]);
        };
	
        /**
         * Intercepts the removeConditionFromThisVisit event and bubbles it up
         */
	   method.removeConditionFromThisVisit = function(condition) {
            this.fire("removeConditionFromThisVisit", [condition]);
        };

        method.moveConditionToThisVisit = function(condition) {
            this.redirectEventToControls("moveConditionToThisVisit", [condition]);
            this.fire("moveConditionToThisVisit", [condition]);
        };
	
        method.moveConditionToChronic = function(condition) {
            this.redirectEventToControls("moveConditionToChronic", [condition]);
            this.fire("moveConditionToChronic", [condition]);
        };

        method.cancelCondition = function(condition) {
            this.fire("cancelCondition", [condition]);
        };

        /**
         * Returns the height of the side panel contents.
         */
        method.getContentHeight = function() {
            if (!this.getSidePanel().m_sidePanelContents) {
                return null;
            }
            return this.getSidePanel().m_sidePanelContents.outerHeight();
        };

        /**
         * Sets the height of the side panel, but only if it is greater than the
         * minimum height.
         */
        method.setHeight = function(height) {
            var minHeight = parseInt(this.getSidePanel().getMinHeight());
            if (height < minHeight) {
                // one pixel is added due to sidepanel offset
                this.getSidePanel().setHeight(minHeight + 1 + "px");
            } else {
                this.getSidePanel().setHeight(height + "px");
            }
        };

        /**
         * Returns this control's height
         */
        method.getHeight = function() {
            return this.getElement().outerHeight();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.resize = function() {
            if (!this.getIsCreated()) {
                return;
            }

            // the sidepanel doesn't like to be resized while expanded
            if (this.getIsExpanded()) {
                this.getSidePanel().collapseSidePanel();
                this.getSidePanel().resizePanel();
                this.getSidePanel().expandSidePanel();
                this.getElement().find(".sp-expand-collapse").removeClass("hidden");
                return;
            }

            this.getSidePanel().resizePanel();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Called when the close button is clicked
         */
        method.closeDetailsPanel = function() {
            this.fire("closeDetailsPanel");
        };

        method.getScrollContainerId = function() {
            return "sidePanelScrollContainer" + this.getSidePanel().getUniqueId();
        };
				
        method.updateSpecifiedConditions = function(conditions) {
          this.update();
          this.fire("updateSpecifiedConditions", [conditions]);
        };

        /**
		 * Scrolls the side panel down until the comment panel is as close to the
		 * top of the container as possible.
		 */
		method.scrollToComments = function() {
			this.getSidePanel().expandSidePanel();
            var scrollContainer = document.getElementById(this.getScrollContainerId());
            scrollContainer.scrollTop = this.getCommentPanel().getElement()[0].offsetTop;
		};

        /**
         * Called when a comment is added
         */
        method.addComment = function(comment) {
            this.fire('addComment', [comment]);
        };

		/**
         * Called when the Infobutton icon is clicked.
         */
		method.invokeInfoBtnApi = function() {			
			var priCriteriaCd = 0.0;
			var errorModal = null;
			var build = this.getFactory();			
			var infoBtnApi = null;
			var mpageUtil = build.mpageUtil();			
			var mpageModalButton = build.mpageModalButton();
			var criterion = this.getCriterion();
			var condition = this.getCondition();
			var metaObj = this.getMetaObj();
			var conditionIsThisVisit = condition.getIsThisVisit();			
			var conditionIsChronic = condition.getIsChronic();
			var conditionIsHistorical = condition.getIsHistorical();
			var conditionIsInactive = condition.getIsInactive();
			var nomenId;	
			var searchNomId;
			if(conditionIsThisVisit){				
				priCriteriaCd = metaObj.DIAG_PRIMARY_CRITERIA_CD;
				nomenId = condition.getNomenclatureValue();								
			}else if(conditionIsChronic || conditionIsInactive){
				priCriteriaCd = metaObj.PROB_PRIMARY_CRITERIA_CD;
				nomenId = condition.getTargetNomenclatureValue();				
				searchNomId =  condition.getNomenclatureValue();		 
			}else if(conditionIsHistorical){
				if(condition.getProblems().length){
					priCriteriaCd = metaObj.PROB_PRIMARY_CRITERIA_CD;
					nomenId = condition.getTargetNomenclatureValue();				
					searchNomId =  condition.getNomenclatureValue();	
				}else if(condition.getDiagnoses().length){
					priCriteriaCd = metaObj.DIAG_PRIMARY_CRITERIA_CD;
					nomenId = condition.getNomenclatureValue();
				}
			}
			var patientId = criterion.person_id;
			var encounterId = criterion.encntr_id;
			
			var description = condition.getDisplay();
			
			try {
				// Retrieve the infobutton object from the factory.		
				infoBtnApi = build.infoButtonApi();		
				if (infoBtnApi){
					infoBtnApi.SetInfoButtonData(patientId, encounterId, priCriteriaCd, 1, 2); 
					if (conditionIsThisVisit){
						infoBtnApi.AddDiagnosis(nomenId, nomenId, description);
					} else {
						infoBtnApi.AddProblem(nomenId, searchNomId, description);
					}
					infoBtnApi.LaunchInfoButton();
				}
			} catch (err) {
				var errorModal = build.infoButtonErrorModal(this.getFactory());
				this.setInfoButtonErrorModal(errorModal);				
				errorModal.setError(err);
				errorModal.launchModalDialog();
			}
		};
		
        return DetailsPanel;
    }
);
define(
    "cerner/discernabu/components/conprobo3/controls/InfoBanner",

    function () {

        var attribute = MPageOO.attribute;
        var Control = MPageControls.Control;

        // ------------------------------------------------------------------------------
        // Initialization
        // ------------------------------------------------------------------------------

        /**
         * Displays a side panel with detailed condition information
         *
         * @param element
         * @param factory
         * @constructor
         */
        var InfoBanner = function (factory) {
            Control.call(this);
            this.setFactory(factory);
        };

        InfoBanner.prototype = new Control();
        var method = InfoBanner.prototype;

        // ------------------------------------------------------------------------------
        // Attributes
        // ------------------------------------------------------------------------------

        /**
         * The sidepanel control instance
         */
        attribute(InfoBanner, "SidePanel");

        /**
         * The condition that is currently being displayed
         */
        attribute(InfoBanner, "Condition");

        /**
         * The factory responsible for creating object instances
         */
        attribute(InfoBanner, "Factory");

		/*
         * Vocab configuration from bedrock.	 
         */
		attribute(InfoBanner, "BedrockConfig");

        attribute(InfoBanner, "Message");


        method.init = function(){
            var bedrockConfig = this.getBedrockConfig();
            var condition = this.getCondition();
            var build = this.getFactory();
            var infoMessageType = MPageControls.AlertMessage.MessageTypes.INFORMATION;
            var messageTemplate = MPageControls.getDefaultTemplates().messageBar;
            var messageControl;

            if (!this.getElement() || !this.getMessage()) { 
                return;
            }
            // Generate banner only if condition is flagged
            if (condition.isFlagged(bedrockConfig)){
                messageControl = build.alertMessageControl(this.getElement(), messageTemplate , infoMessageType);
                messageControl.render(this.getMessage());
            }
        };

        return InfoBanner;
    }
);
define("cerner/discernabu/components/conprobo3/controls/InfoButtonErrorModal", 


	function() {

		var attribute = MPageOO.attribute;
		var Control = MPageControls.Control;
		var i18nABU = i18n.discernabu;
		// --------------------------------------------------------------------
		// Initialization
		// --------------------------------------------------------------------
	
		var InfoButtonErrorModal = function(factory) {
			Control.call(this);
			this.setFactory(factory);
		};
	
		InfoButtonErrorModal.prototype = new Control();
		var method = InfoButtonErrorModal.prototype;
	
		// --------------------------------------------------------------------
		// Attributes
		// --------------------------------------------------------------------
		attribute(InfoButtonErrorModal, "Error");
		
		/**
         * The factory responsible for creating object instances
         */
        attribute(InfoButtonErrorModal, "Factory");
	
		// --------------------------------------------------------------------
		// Methods
		// --------------------------------------------------------------------
	
		method.launchModalDialog = function() {
			var build = this.getFactory();
			var mpageUtil = build.mpageUtil();
			var mpageModalDialog = build.mpageModalDialog();
			var closeButton = build.mpageModalButton("closeButton");
	
			var error = this.getError();
			var errorName = error.name;
			var errorMessage = error.message || i18nABU.INFO_BUTTON_ERROR_MSG;
			var errorModal = mpageModalDialog.retrieveModalDialogObject("errorModal");
			if (!errorModal) {
				errorModal = mpageUtil.generateModalDialogBody("errorModal", "error", errorMessage, i18nABU.INFO_BUTTON_ERROR_ACTION);
				errorModal.setHeaderTitle(i18n.ERROR_OCCURED);				
				closeButton.setText(i18n.CLOSE);
				closeButton.setCloseOnClick(true);
				errorModal.addFooterButton(closeButton);
			}
			mpageModalDialog.updateModalDialogObject(errorModal);
			mpageModalDialog.showModalDialog("errorModal");
		};
		return InfoButtonErrorModal;
});

define(
    "cerner/discernabu/components/conprobo3/controls/PriorityDropDown",

    function () {

        var attribute = MPageOO.attribute;
        var DropDownList = MPageControls.DropDownList;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var PriorityDropDown = function () {
            DropDownList.call(this);
            this.setDisplayKey("display");
        };

        PriorityDropDown.prototype = new DropDownList();
        var method = PriorityDropDown.prototype;

        // --------------------------------------------------------------------
        // Attributes
        // --------------------------------------------------------------------
        attribute(PriorityDropDown, "Condition");

        attribute(PriorityDropDown, "Conditions");

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------

        method.init = function () {
            DropDownList.prototype.init.call(this);
            var self = this;
            var emptyItem = {
                priority: 0,
                display: "--"
            };
            var selectedItem = emptyItem;

            var items = [];
            items.push(emptyItem);

            // builds the list of priorities
            var highestPriority = this.getConditions().getHighestPriority();

            // add one if the priority was not set before
            if (this.getCondition().getClinicalPriority() <=0) {
                highestPriority++;
            }

            for (var i=1; i<=highestPriority; i++) {
                var item = {
                    priority: i,
                    display: i
                };
                items.push(item);
                if (i == this.getCondition().getClinicalPriority()) {
                    selectedItem = item;
                }
            }

            this.setOnShow(function() {
               self.renderItems(items);
            });

            // default value of the drop down
            this.setItems(items);
            this.setSelectedItem(selectedItem);

            this.setOnSelect(function(item) {
                self.selectPriority(item);
            });
        };
		/**
		 * This method is called when a new priority for a condition is selected and will be updated by calling the 
		 * updatePriorityAndResquence method by passing the condition, new priority and a flag that it is not removing the condition
 		 * @param {Object} item, the current priority value.
		 */
        method.selectPriority = function(item) {
            var cond = this.getCondition();
            if (cond.getClinicalPriority() == item.priority) {
                return;
            }
            var self = this;
            var removeConditionFlag = 0;
            var toUpdate = this.getConditions().updatePriorityAndResequence(cond, item.priority, removeConditionFlag);
            toUpdate.update(function() {
                self.fire("changePriority", [cond]);
            });
        };

        return PriorityDropDown;
    }
);define(
    "cerner/discernabu/components/conprobo3/controls/UnspecifiedAlert",

    function () {

        var attribute = MPageOO.attribute;
        var Control = MPageControls.Control;

        var UnspecifiedAlert = function (factory) {
            Control.call(this);
            this.setFactory(factory);
        };
        UnspecifiedAlert.prototype = new Control();
        var method = UnspecifiedAlert.prototype;

        attribute(UnspecifiedAlert, "Template");

        attribute(UnspecifiedAlert, "Conditions");

        attribute(UnspecifiedAlert, "Factory");

        attribute(UnspecifiedAlert, "DxAssButton");

        attribute(UnspecifiedAlert, "IsDxAssistantEnabled");

        method.create = function() {
            var dxAssistantButton = this.getFactory().dxAssistantButton();
            dxAssistantButton.setParent(this);
            dxAssistantButton.setConditions(this.getConditions());
            this.setDxAssButton(dxAssistantButton);
        };

        method.update = function() {

          if (!this.getIsDxAssistantEnabled()) {
               this.hide();
               return;
          }

          var self = this;
          var unspecifiedConditions = this
            .getConditions()
            .filter("isSpecific", false)
            .filter(function (c) {
              return c.hasDxAssistant();
            });

          if (unspecifiedConditions.length) {
            this.show();
          } else {
            this.hide();
          }

          this.getDxAssButton().setConditions(unspecifiedConditions);

          this.renderTemplate(this.getTemplate(), {
              dxAssButtId: self.getDxAssButton().getElementId(),
              conditionsLength: unspecifiedConditions.length
          });

          this.getDxAssButton().init();
        };

        method.updateSpecifiedConditions = function(conditions) {
            this.fire("updateSpecifiedConditions", [conditions]);
        };

        method.hide = function() {
            this.getElement().addClass("hide");
        };

        method.show = function() {
            this.getElement().removeClass("hide");
        };

        return UnspecifiedAlert;
    });
define(
    "cerner/discernabu/components/conprobo3/controls/buttons/Button",

    function () {

        var attribute = MPageOO.attribute;
        var Control = MPageControls.Control;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var Button = function (factory) {
            Control.call(this);
            this.setFactory(factory);
        };
        Button.prototype = new Control();
        var method = Button.prototype;

        // --------------------------------------------------------------------
        // Attributes
        // --------------------------------------------------------------------
        attribute(Button, "Condition");
        attribute(Button, "Factory");

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------
        method.init = function () {
            MPageControls.Control.prototype.init.call(this);

            if (!this.getElement()) { return; }

            var self = this;
            this.getElement().click(function() {
                self.click();
            });
        };
        
        method.setEnabled = function(value) {
        	if(value){
        		// enable the button
        		this.getElement().prop("disabled", false);
        		this.getElement().toggleClass("dithered");
        	}
        	else{
        		// disable the button
        		this.getElement().prop("disabled", true);
        		this.getElement().toggleClass("dithered");
        	}
        };

        method.show = function() {
            if (!this.getElement()) return;

            this.getElement().css('display', 'inline');
        };

        method.hide = function() {
            if (!this.getElement()) return;

            this.getElement().css('display', 'none');
        };

        method.click = function() {
            // Abstract. Should be implemented by child.
        };

        return Button;
    }
);define(
    "cerner/discernabu/components/conprobo3/controls/buttons/CancelButton", [
        "cerner/discernabu/components/conprobo3/controls/buttons/Button"
        ],

    function (Button) {

        var attribute = MPageOO.attribute;
        var Control = MPageControls.Control;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var CancelButton = function (factory) {
            Button.call(this, factory);
        };
        CancelButton.prototype = new Button();
        var method = CancelButton.prototype;

        attribute(CancelButton, "SharedCondResObj");

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------
        method.click = function () {
        	var cancelCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Cancel");
        	if(cancelCAPTimer){
	        	cancelCAPTimer.addMetaData("key");
	        	cancelCAPTimer.start();
	        	cancelCAPTimer.stop();
        	}
            var self = this;
            this.getCondition().cancel(function(condition) {
                self.fire("cancel", [condition]);
                self.getSharedCondResObj().retrieveSharedResourceData();
            });
        };

        return CancelButton;
    }
);define(
    "cerner/discernabu/components/conprobo3/controls/buttons/CloseDetailsPanelButton", [
        "cerner/discernabu/components/conprobo3/controls/buttons/Button"
    ],

    function (Button) {

        var Control = MPageControls.Control;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var CloseDetailsPanelButton = function (factory) {
            Button.call(this, factory);
        };
        CloseDetailsPanelButton.prototype = new Button();
        var method = CloseDetailsPanelButton.prototype;

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------
        method.click = function() {
            this.fire("closeDetailsPanel");
        };

        return CloseDetailsPanelButton;
    }
);define(
    "cerner/discernabu/components/conprobo3/controls/buttons/CommentIndicatorButton", [
        "cerner/discernabu/components/conprobo3/controls/buttons/Button"
    ],

    function (Button) {

        var Control = MPageControls.Control;
        var attribute = MPageOO.attribute;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var CommentIndicatorButton = function (factory) {
            Button.call(this, factory);
        };
        CommentIndicatorButton.prototype = new Button();
        var method = CommentIndicatorButton.prototype;

        attribute(CommentIndicatorButton, 'Condition');

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------
        method.click = function() {
            this.fire('selectCondition', [this.getCondition()]);
            this.fire('scrollToComments');
        };

        return CommentIndicatorButton;
    }
);define(
    "cerner/discernabu/components/conprobo3/controls/buttons/DocumentNoChronicProblemsButton", [
        "cerner/discernabu/components/conprobo3/controls/buttons/Button"
    ],

    function (Button) {
		var attribute = MPageOO.attribute;
        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var DocumentNoChronicProblemsButton = function (factory) {
            Button.call(this, factory);
        };
        DocumentNoChronicProblemsButton.prototype = new Button();
        var method = DocumentNoChronicProblemsButton.prototype;
				
        attribute(DocumentNoChronicProblemsButton, "AddNKPFunction");

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------
        method.click = function () {
            var addNKPFunction = this.getAddNKPFunction();
            if(addNKPFunction){
                addNKPFunction();
            }
            this.fire("documentNoChronicProblems", [this.getCondition()]);
        };

        return DocumentNoChronicProblemsButton;
    }
);define(
    "cerner/discernabu/components/conprobo3/controls/buttons/DxAssistantButton", [
        "cerner/discernabu/components/conprobo3/controls/buttons/Button"
    ],

    function (Button) {
		var attribute = MPageOO.attribute;
        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var DxAssistantButton = function (factory) {
            Button.call(this, factory);
        };

        DxAssistantButton.prototype = new Button();

        var method = DxAssistantButton.prototype;

		attribute(DxAssistantButton, "Conditions");

		attribute(DxAssistantButton, "Condition");

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------

        method.click = function () {
            var self = this;

            var conditions = this.getConditions()
                .getUnspecified()
                .filter(function(c) {
                    return c.hasDxAssistant();
                });

            // bubbles up the current condition to the top of the list
            if (this.getCondition()) {
                var i = conditions.indexOf(this.getCondition());
                if (i >= 0) {
                    conditions.splice(i, 1);
                }
                conditions.unshift(this.getCondition());
            }

            conditions.launchDxAssistant(function(conditions) {
                 self.fire("updateSpecifiedConditions", [conditions]);
            });
        };

        return DxAssistantButton;
    }
);
define(
    "cerner/discernabu/components/conprobo3/controls/buttons/InfoButton", [
        "cerner/discernabu/components/conprobo3/controls/buttons/Button"
    ],

    function (Button) {
		var attribute = MPageOO.attribute;
        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var InfoButton = function (factory) {
            Button.call(this, factory);
        };
        InfoButton.prototype = new Button();
        var method = InfoButton.prototype;
		
		attribute(InfoButton, "Criterion");
        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------
        method.click = function () {
            this.fire("invokeInfoBtnApi", [this.getCondition()]);
        };

        return InfoButton;
    }
);define("cerner/discernabu/components/conprobo3/controls/buttons/ModifyButton", ["cerner/discernabu/components/conprobo3/controls/buttons/Button"], function(Button) {

	var attribute = MPageOO.attribute;

	// --------------------------------------------------------------------
	// Initialization
	// --------------------------------------------------------------------

	var ModifyButton = function(factory) {
		Button.call(this, factory);
	};
	ModifyButton.prototype = new Button();
	var method = ModifyButton.prototype;

	attribute(ModifyButton, "SharedCondResObj");
	attribute(ModifyButton, "BedrockConfig");
	attribute(ModifyButton, "CanModify");

	// --------------------------------------------------------------------
	// Methods
	// --------------------------------------------------------------------
	method.init = function() {
		if (!this.getElement()) {
			return;
		}

		Button.prototype.init.call(this);

		if (!this.getBedrockConfig().getModifyInd() || !CERN_Platform.inMillenniumContext()) {
			this.setEnabled(false);
		}
	};

	method.click = function() {
		var modifyCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Modify");
		if(modifyCAPTimer){
			modifyCAPTimer.addMetaData("key");
			modifyCAPTimer.start();
			modifyCAPTimer.stop();	
		}
		var self = this;
		MPageEntity.Win32ConditionModifier(this.getCondition(), function() {
			self.getSharedCondResObj().retrieveSharedResourceData();
		});
	};

	return ModifyButton;
});define(
    "cerner/discernabu/components/conprobo3/controls/buttons/SelectConditionButton", [
        "cerner/discernabu/components/conprobo3/controls/buttons/Button"
    ],

    function (Button) {

        var attribute = MPageOO.attribute;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var SelectConditionButton = function (factory) {
            Button.call(this);
        };
        SelectConditionButton.prototype = new Button();
        var method = SelectConditionButton.prototype;

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------

        method.click = function () {
        	var openSidePanelCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Open_side_panel");
        	if(openSidePanelCAPTimer){
				openSidePanelCAPTimer.addMetaData("key");
        		openSidePanelCAPTimer.start();
        		openSidePanelCAPTimer.stop();        		
        	}        	
            this.fire("selectCondition", [this.getCondition()]);
        };

        return SelectConditionButton;
    }
);define(
	"cerner/discernabu/components/conprobo3/controls/comments/AddCommentTextbox",

	function() {

		var attribute = MPageOO.attribute;
		var Control = MPageControls.Control;
		var i18n = window.i18n.discernabu.conprobo3_i18n;

		// --------------------------------------------------------------------
		// Initialization
		// --------------------------------------------------------------------
		var AddCommentTextbox = function(factory) {
			Control.call(this);
			this.setFactory(factory);
			this.setPlaceholderText(i18n.ADD_COMMENT);
			this.setPlaceholderCssClass("placeholder");
			this.setLoadingClass("loading");
		};

		AddCommentTextbox.prototype = new Control();
		var method = AddCommentTextbox.prototype;

		// --------------------------------------------------------------------
		// Attributes
		// --------------------------------------------------------------------
		attribute(AddCommentTextbox, "Factory");
		attribute(AddCommentTextbox, "PlaceholderText");
		attribute(AddCommentTextbox, "PlaceholderCssClass");
		attribute(AddCommentTextbox, "IsPlaceholderActive");
		attribute(AddCommentTextbox, "LoadingClass");
		attribute(AddCommentTextbox, "IsFocused");

		// --------------------------------------------------------------------
		// Methods
		// --------------------------------------------------------------------

		/**
		 * Creates the standard text control and attaches events
		 */
		method.create = function() {
			var element = this.getElement();

			if (!element) return;

			var self = this;
			element.focus(function() {
				self.onFocus();
			});
			element.blur(function() {
				self.onBlur();
			});
			element.keydown(function(key) {
				if (key.keyCode == 13) self.onEnter();
			});
			this.enablePlaceholder();
		};

		method.update = function() {
			// implement if needed
		};

		/**
		 * Disables the placeholder if it was enabled
		 */
		method.onFocus = function() {
			this.setIsFocused(true);
			if (this.getIsPlaceholderActive()) {
				this.disablePlaceholder();
			}
			this.fire("startAddingComment");
		};

		/**
		 * Enables the placeholder if there is no text on unselect
		 */
		method.onBlur = function() {
			this.setIsFocused(false);
			if (!this.getValue().length) {
				this.enablePlaceholder();
				this.fire("cancelAddingComment");
			}
		};

		/**
		 * Fires the addComment event
		 */
		method.onEnter = function() {
			this.fire("addComment");
		};

		/**
		 * Shows the placeholder text in the textbox
		 */
		method.enablePlaceholder = function() {
			this.setIsPlaceholderActive(true);
			this.setValue(this.getPlaceholderText());
			if (this.getIsFocused()) this.getElement().blur();
			this.getElement()
				.addClass(this.getPlaceholderCssClass());
		};

		/**
		 * Removes the placeholder text from the textbox
		 */
		method.disablePlaceholder = function() {
			this.setIsPlaceholderActive(false);
			this.setValue("");
			this.getElement()
				.removeClass(this.getPlaceholderCssClass());
		};

		/**
		 * Returns the current value in the textbox
		 */
		method.getValue = function() {
			return this.getElement().val();
		};

		method.setValue = function(val) {
			this.getElement().val(val);
		};

		/**
		 * Visually displays the textbox if it was hidden
		 */
		method.show = function() {
			this.getElement().css("display", "block");
		};

		/**
		 * Makes the textbox invisible
		 */
		method.hide = function() {
			this.getElement().css("display", "none");
		};

		/**
		 * Shows the spinning wheel
		 */
		method.showLoading = function() {
			if (!this.getElement()) return;
			this.getElement().addClass(this.getLoadingClass());
		};

		/**
		 * Hides the spinning wheel
		 */
		 method.hideLoading = function() {
		 	if (!this.getElement()) return;
		 	this.getElement().removeClass(this.getLoadingClass());
		 };

		return AddCommentTextbox;
	}
);define(
	"cerner/discernabu/components/conprobo3/controls/comments/CancelCommentButton", [
	    "cerner/discernabu/components/conprobo3/controls/buttons/Button"
	],

	function(Button) {

        var attribute = MPageOO.attribute;
        var Control = MPageControls.Control;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------
	    var CancelCommentButton = function(factory) {
            Button.call(this);
	    };
	    CancelCommentButton.prototype = new Button();
	    var method = CancelCommentButton.prototype;

	    method.click = function() {
            this.fire("cancelAddingComment");
	    };

	    return CancelCommentButton;
    }
);

define(
	"cerner/discernabu/components/conprobo3/controls/comments/CommentList",

	function() {

		var attribute = MPageOO.attribute;
		var Control = MPageControls.Control;
		var SORTING = MPageEntity.EntityList.SORTING;

		// --------------------------------------------------------------------
		// Initialization
		// --------------------------------------------------------------------
		var CommentList = function(factory) {
			Control.call(this);
			if (factory) {
			    this.setFactory(factory);
			    this.setTemplate(factory.commentTemplate());
			}
		};

		CommentList.prototype = new Control();
		var method = CommentList.prototype;

		// --------------------------------------------------------------------
		// Attributes
		// --------------------------------------------------------------------
		attribute(CommentList, "Template");
		attribute(CommentList, "Factory");
		attribute(CommentList, "Comments");

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------
        method.create = function() {
            // abstract
        };

        /**
         * Displays the loading icon while we query for the comment personnel
         * info. The loading of the comment text is wrapped in a transaction
         * so that we only perform one query to the Prsnl entity.
         */
        method.update = function() {
            if (!this.getElement()) { return; }

            this.showLoading();
            var self = this;
            var transaction = this.getFactory().transaction();
            transaction.track(function() {
                self.getComments().each(function(comment) {
                    comment.getAuthor();
                });
            });
            transaction.commit(function() {
                self.renderComments();
            });
        };

        /**
         * Renders the loading icon
         */
        method.showLoading = function() {
            var self = this;
            this.renderTemplate(this.getTemplate().loading);
        };

        /**
         * Sorts and renders all the comments
         */
        method.renderComments = function() {
            var comments = this.getFactory()
                .conditionCommentClass()
                .splitDxComments(this.getComments());

            var sorted = comments.sortBy("createdDateTime", SORTING.DESC);
            this.setComments(sorted);
            this.renderTemplate(this.getTemplate().commentList, {
                comments: sorted
            });
        };

        return CommentList;
	}
);define(
	"cerner/discernabu/components/conprobo3/controls/comments/CommentPanel",

	function() {

        var attribute = MPageOO.attribute;
        var Control = MPageControls.Control;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------
	    var CommentPanel = function(factory) {
            Control.call(this);
            if (factory) {
                this.setFactory(factory);
                this.setTemplate(factory.commentTemplate());
            }
	    };

	    CommentPanel.prototype = new Control();
	    var method = CommentPanel.prototype;

	    // IE8 compatible trim function
        var trim = function(text) {
            return text.replace(/^\s+|\s+$/g, '');
        };

        // --------------------------------------------------------------------
        // Attributes
        // --------------------------------------------------------------------
        attribute(CommentPanel, "Template");
		attribute(CommentPanel, "Factory");
		attribute(CommentPanel, "Condition");
		attribute(CommentPanel, "AddCommentTextbox");
		attribute(CommentPanel, "CommentList");
		attribute(CommentPanel, "AuthorId");
		attribute(CommentPanel, "SaveButton");
		attribute(CommentPanel, "CancelButton");

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------

        /**
         * Initializes the child controls and renders the main template
         */
        method.create = function() {
            var build = this.getFactory();

            // instantiate child controls
            var commentList = build.commentList();
            var textbox = build.addCommentTextbox();
            var saveButton = build.saveCommentButton();
            var cancelButton = build.cancelCommentButton();

            saveButton.setParent(this);
            commentList.setParent(this);
            textbox.setParent(this);
            cancelButton.setParent(this);

            this.setCommentList(commentList);
            this.setAddCommentTextbox(textbox);
            this.setSaveButton(saveButton);
            this.setCancelButton(cancelButton);

        };

        /**
         * Hides or shows the comment textbox depending on privs and
         * updates the comment list.
         */
        method.update = function() {
            if (!this.getElement()) { return; }

            var commentList = this.getCommentList();
            var textbox = this.getAddCommentTextbox();
            var saveButton = this.getSaveButton();
            var cancelButton = this.getCancelButton();

            this.renderTemplate(this.getTemplate().commentPanel, {
                commentListId: commentList.getElementId(),
                addCommentTextboxId: textbox.getElementId(),
                saveButtonId: saveButton.getElementId(),
                cancelButtonId: cancelButton.getElementId(),
                showAddComments: this.canAddComment(),
                comments: this.getCondition().getComments()
            });

            commentList.create();
            textbox.create();
            saveButton.init();
            cancelButton.init();

            this.getSaveButton().hide();
            this.getCancelButton().hide();

            this.getCommentList().setComments(this.getCondition().getCommentsWithAssociation());
            this.getCommentList().update();
            this.getAddCommentTextbox().update();
        };

        /**
         * Creates a new comment with contents based on the textbox
         */
        method.addComment = function() {
            var self = this;

            // don't do anything if the textbox is empty (even with spaces)
            if (!trim(this.getAddCommentTextbox().getValue()).length) {
                return;
            }

            this.getAddCommentTextbox().showLoading();
            var comment = this.getFactory().conditionCommentEntity();
            comment.setAuthorValue(this.getAuthorId());
            comment.setText(this.getAddCommentTextbox().getValue());
            comment.setCondition(this.getCondition());
            comment.create(function() {
                self.getCondition().getComments().push(comment);
                self.update();
                self.getAddCommentTextbox().hideLoading();
                self.fire("addComment", [comment]);
            });
        };

        method.startAddingComment = function() {
            this.getSaveButton().show();
            this.getCancelButton().show();
        };

        method.cancelAddingComment = function() {
            this.getSaveButton().hide();
            this.getCancelButton().hide();
            this.getAddCommentTextbox().setValue("");
            this.getAddCommentTextbox().enablePlaceholder();
        };

        method.canAddComment = function() {
            var cond = this.getCondition();
            if (cond.getDiagnosisDriverValue() && cond.canModifyThisVisit()) {
                return true;
            }

            if (cond.getProblemDriverValue() && cond.canModifyChronic()) {
                return true;
            }
            return false;
        };

        return CommentPanel;
	});define(
	"cerner/discernabu/components/conprobo3/controls/comments/SaveCommentButton", [
	    "cerner/discernabu/components/conprobo3/controls/buttons/Button"
	],

	function(Button) {

        var attribute = MPageOO.attribute;
        var Control = MPageControls.Control;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------
	    var SaveCommentButton = function(factory) {
            Button.call(this);
	    };
	    SaveCommentButton.prototype = new Button();
	    var method = SaveCommentButton.prototype;

	    method.click = function() {
            this.fire("addComment");
	    };

	    return SaveCommentButton;
    }
);

define(
    "cerner/discernabu/components/conprobo3/controls/historytable/HistoricalTable", [
        "cerner/discernabu/components/conprobo3/model/CPO3Diagnosis"
    ],

    function (CPO3Diagnosis) {

        var attribute = MPageOO.attribute;
        var inherits = MPageOO.inherits;
        var Condition = MPageEntity.entities.Condition;

        // ------------------------------------------------------------------------------
        // Initialization
        // ------------------------------------------------------------------------------

        /**
         * Lists the conditions specified by setConditions in a HTML table
         *
         * @constructor
         */
        var HistoricalTable = function (factory) {
            MPageControls.Control.call(this);
            this.setFactory(factory);
            var table = factory.componentTable();
            this.setTable(table);

            /**
             * The DOM ID to be used for the component table.
             * Will be set on create.
             * @private
             */
            this.componentTableId = "";
        };
        
        HistoricalTable.prototype = new MPageControls.Control();
        var method = HistoricalTable.prototype;

        var COLUMNS = {
            DISPLAY: "display",
            ONSET: "onset"
        };

        // ------------------------------------------------------------------------------
        // Attributes
        // ------------------------------------------------------------------------------

        /**
         * The component table instance used to render the conditions.
         *
         */
        attribute(HistoricalTable, "Table");

        /**
         * The list of conditions to be rendered.
         */
        attribute(HistoricalTable, "Condition");

        /**
         * The factory object that will create instances of classes
         */
        attribute(HistoricalTable, "Factory");

        /**
         * Templates to be used for rendering
         */
        attribute(HistoricalTable, "Templates");

        /**
         * Instances of HistoricalTableRow that represent all the rows in the table
         */
        attribute(HistoricalTable, "Rows");

        /**
         * The maximum height, in pixels, the details panel will cover when not expanded.
         */
        attribute(HistoricalTable, "MaxHeight");

        /**
         * Instantiates row objects given a list of conditions.
         *
         * @param conditions
         */
        method.createRows = function () {
            var rows = [];
            var build = this.getFactory();
            var self = this;
            this.setRows(rows);
            var condition = this.getCondition();
            var problems = condition.getProblems();
            var diagnoses = condition.getDiagnoses();
            problems.each(function(problem){
                var historyTableRow = build.historicalTableProblemRow();
                historyTableRow.setCondition(problem);
                rows.push(historyTableRow);
            });
            diagnoses.each(function(dx){
                var historyTableRow = build.historicalTableDxRow();
                var cpo3Dx = new CPO3Diagnosis();
                cpo3Dx.setData(dx.getData());
                historyTableRow.setCondition(cpo3Dx);
                rows.push(historyTableRow);
            });
            rows.sort(function(a, b){
                return b.getDateTime() - a.getDateTime();
            });
            return rows;
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .


        method.loadNomenclatureInfo = function(){
            var self = this;
            var condition = this.getCondition();
            var diagnoses = condition.getDiagnoses();
            var problems = condition.getProblems();
            //Only render if multiple problems/diagnoses present on patient
            if (problems.length + diagnoses.length < 1){
                return;
            }
            var transaction = new MPageEntity.Transaction();
            transaction.track(function(){
                diagnoses.each(function(dx){
                    dx.getNomenclature();
                });
            });
            this.getElement().html("<div class='loading history-section-preload'></div>");
            transaction.commit(function(){
                self.update();  
            });
        };
        // ------------------------------------------------------------------------------
        // Methods
        // ------------------------------------------------------------------------------

        /**
         * Creates the table that will hold the condition list
         */
        method.create = function () {
            this.componentTableId = this.getElementId();
            var table = this.getTable();
            table.setIsHeaderEnabled(false);
            table.setZebraStripe(true);
            table.setNamespace(this.componentTableId);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Binds the table to the data and renders the HTML inside the control element
         */
        method.update = function () {
            var detailPanel = this.getParent();
            this.createRows();
            var rows = this.getRows();

            // renders the table
            var table = this.getTable();
            table.bindData(rows);
            this.getElement().html(table.render());

            table.finalize();
            detailPanel.resize();
        };

        /**
         * Tells the control that the display column of the table will be rendered.
         * Must be used before create.
         */
        method.addDisplayColumn = function() {
            var displayColumn = this.getFactory().tableColumn();
            displayColumn.setColumnId(COLUMNS.DISPLAY);
            displayColumn.setCustomClass("historical-name-column");
            displayColumn.setIsSortable(false);
            displayColumn.setRenderTemplate("${makeDisplayCellHtml()}");
            this.getTable().addColumn(displayColumn);
        };

        method.addOnsetColumn = function(){
        	var onsetColumn = this.getFactory().tableColumn();
        	onsetColumn.setColumnId(COLUMNS.ONSET);
        	onsetColumn.setCustomClass("historical-onset-column");
        	onsetColumn.setIsSortable(false);
        	onsetColumn.setRenderTemplate("${makeOnsetCellHtml()}");
            this.getTable().addColumn(onsetColumn);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Returns the DOM element for row at specified index.
         * @param index
         */
        method.getRowElement = function(index) {
            var tableBody = this.getBodyElement();
            return tableBody.children[0].children[index];
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.getBodyElement = function() {
            return document.getElementById(this.componentTableId + "tableBody");
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.getHeaderElement = function() {
            return document.getElementById(this.componentTableId + "headerWrapper");
        };


        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.getHeight = function() {
            return this.getElement().outerHeight();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.setMaxHeight = function(height) {
            var body = this.getBodyElement();
            var header = this.getHeaderElement();
            var bodyMaxHeight = height - $(header).outerHeight();
            $(body).css("max-height", bodyMaxHeight);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.resize = function() {
            this.getTable().updateAfterResize();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.getScrollPosition = function() {
            return this.getBodyElement().scrollTop;
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.setScrollPosition = function(position) {
            this.getBodyElement().scrollTop = position;
        };

        return HistoricalTable;
    }
);
define(
    "cerner/discernabu/components/conprobo3/controls/historytable/HistoricalTableDxRow", 
    ["cerner/discernabu/components/conprobo3/controls/historytable/HistoricalTableRow"],

    function (HistoricalTableRow) {


        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var HistoricalTableDxRow = function (factory) {
            HistoricalTableRow.call(this, factory);
            this.setIsChronic(false);
        };

        HistoricalTableDxRow.prototype = new HistoricalTableRow();
        var method = HistoricalTableDxRow.prototype;

        // --------------------------------------------------------------------
        // Methods
        // -------------------------------------------------------------------

        method.getDateTime = function(){
            var dx = this.getCondition();
            return dx.getDiagDtTm();
        };

        method.makeTemplateContext = function() {
            if (this.templateContext) {
                return this.templateContext;
            }
            var dx = this.getCondition();
            
            this.templateContext = {
                onsetDate: dx.getFormattedDate(),
                vocab: dx.getNomenclature().getSourceVocabulary().getDisplay(),
                display: dx.getNomenclature().getSourceString(),
                termCode: dx.getNomenclature().getSourceIdentifier(),
                classification: dx.getClassificationDisplay(),
                isHistorical: dx.getIsHistorical(),
                isChronic: false
            };
            
            return this.templateContext;
        };

        return HistoricalTableDxRow;
    }
);define(
    "cerner/discernabu/components/conprobo3/controls/historytable/HistoricalTableProblemRow", 
    ["cerner/discernabu/components/conprobo3/controls/historytable/HistoricalTableRow"],

    function (HistoricalTableRow) {


        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var HistoricalTableProblemRow = function (factory) {
            HistoricalTableRow.call(this, factory);
            this.setIsChronic(true);
        };

        HistoricalTableProblemRow.prototype = new HistoricalTableRow();
        var method = HistoricalTableProblemRow.prototype;

        // --------------------------------------------------------------------
        // Methods
        // -------------------------------------------------------------------

        method.getDateTime = function(){
            var problem = this.getCondition();
            return problem.getOnsetDateTime();
        };

        method.makeTemplateContext = function() {
            if (this.templateContext) {
                return this.templateContext;
            }
            var problem = this.getCondition();
            this.templateContext = {
                onsetDate: problem.getFormattedOnset(),
                display: problem.getNomenclature().getSourceString(),
                vocab: problem.getNomenclature().getSourceVocabulary().getDisplay(),
                termCode: problem.getNomenclature().getSourceIdentifier(),
                classification: problem.getClassificationDisplay(),
                isHistorical: problem.getIsHistorical(),
                isChronic: true
            };
            return this.templateContext;
        };

        return HistoricalTableProblemRow;
    }
);define(
    "cerner/discernabu/components/conprobo3/controls/historytable/HistoricalTableRow",

    function () {
        var Control = MPageControls.Control;
        var attribute = MPageOO.attribute;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var HistoricalTableRow = function (factory) {
            this.setFactory(factory);
        };

        HistoricalTableRow.prototype = new Control();
        var method = HistoricalTableRow.prototype;

        // --------------------------------------------------------------------
        // Attributes
        // --------------------------------------------------------------------

        attribute(HistoricalTableRow, "Factory");
        attribute(HistoricalTableRow, "Templates");
        attribute(HistoricalTableRow, "IsChronic");
        attribute(HistoricalTableRow, "Condition");

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------


        method.getDateTime = function(){
            throw new Error("To be implemented by child class");
        };

        method.makeTemplateContext = function() {
            throw new Error("To be implemented by child class");
        };

        method.makeDisplayCellHtml = function() {
            return this.getFactory().detailedTemplate().historicalDisplayColumn(this.makeTemplateContext());
        };

        method.makeOnsetCellHtml = function() {
            return this.getFactory().detailedTemplate().historicalOnsetColumn(this.makeTemplateContext());
        };


        return HistoricalTableRow;
    }
);
define(
    "cerner/discernabu/components/conprobo3/controls/toggles/ChronicToggle",
    ["cerner/discernabu/components/conprobo3/controls/toggles/ToggleButton"],

    function (ToggleButton) {

        var attribute = MPageOO.attribute;
        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var ChronicToggle = function (factory) {
            ToggleButton.call(this, factory);
        };

        ChronicToggle.prototype = new ToggleButton();
        var method = ChronicToggle.prototype;

        attribute(ChronicToggle, "SharedCondResObj");

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------

        /**
         * Sets the toggle as selected or unselected depending on if the
         * condition is chronic or not
         */
        method.init = function () {
        	var condition = this.getCondition();
        	var targetNomenclature = condition.getTargetNomenclatureValue();
        	var freetextInd = targetNomenclature <= 0;
            var pregnancyInd = (condition.getProblems().length > 0 && condition.getProblems()[0].getProblemTypeFlag() == 2);
            var noActionsInd = (freetextInd || pregnancyInd);
            var modifyProblemInd = this.getCanModifyChronic();
            
            if(condition.getProblemDriverValue() && !condition.getProblemDriverFromArray().getCanCondModify()){
            	// this particular problem is not available to be modified due to a privilege exception
            	modifyProblemInd = false;
            }
            
            if (!this.getElement()) { return; }

            ToggleButton.prototype.init.call(this);
            if (condition.getIsChronic() || condition.getIsInactive()) {
                this.performSelection();
            } 
			else if (condition.getIsHistorical()){
            	this.performUnselection();
				this.setEnabled(true);
				if(condition.getProblemDriverValue() && !condition.getIsThisVisit()){
					this.getElement().toggleClass("resolved-problem");
				}
            } else {
                this.performUnselection();
            }            
            
            if(noActionsInd || !modifyProblemInd){
            	this.setEnabled(false);
            }
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.onSelect = function () {
        	var moveToChronicCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Move_to_Chronic");
        	if(moveToChronicCAPTimer){
	        	moveToChronicCAPTimer.addMetaData("key");
	        	moveToChronicCAPTimer.start();
	        	moveToChronicCAPTimer.stop();
	        }        	
            var self = this;
            this.remoteCallStarted();
            // get the vocab config object and pass it to entity.
            var vc = this.getBedrockConfig();
            var cond = this.getCondition();
            var diagnosisClassification = cond.getClassificationValue();
            var diagnosisConfirmation = cond.getConfirmationStatusValue();
            var diagnosisTargetNomen = cond.getTargetNomenclatureValue();
            // Rereive Problem preferences from bedrock.
            cond.setClassificationValue(vc.getProblemClassification());
            cond.setConfirmationStatusValue(vc.getProblemConfirmation());
            
            if(cond.getIsResolved()){
            	cond.unresolve(function (condition, raw) {
	                self.remoteCallEnded();
	                self.fire("handleDuplicates", [true, raw]);
	                self.fire("unresolveCondition", [condition]);
	            });
            } else {
	            cond.moveToChronic(vc, function(condition, raw) {
	                self.remoteCallEnded();
	                    var reply = JSON.parse(raw);
	                    // If cross mapping is launched and nothing get selected from cross mapping window.
	                if (reply.RECORD_DATA.META.ERRORCD == 1 || reply.RECORD_DATA.META.ERRORCD == 2) {
	                    if (reply.RECORD_DATA.VALUES[0].TARGETNOMENCLATURE === 0) {
	                            cond.setTargetNomenclatureValue(diagnosisTargetNomen);
	                    }
	                    if (reply.RECORD_DATA.META.ERRORCD == 1) {
	                        var sTargetSection = i18n.discernabu.conprobo3_i18n.CHRONIC;
	                        var sDuplicateMessage = i18n.discernabu.conprobo3_i18n.DUPLICATE_MSG.replace(/\{0\}/g, sTargetSection);
	                        alert(sDuplicateMessage);
	                    }
	                    // Reset fields back to original fields.
	                    cond.setClassificationValue(diagnosisClassification);
	                    cond.setConfirmationStatusValue(diagnosisConfirmation);
	                    self.remoteCallEnded();
	                        self.performUnselection();
	                    }
	                self.fire("moveConditionToChronic", [condition]);
	            });
			}
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.onUnselect = function () {
        	var moveToChronicCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Move_to_Chronic");
        	if(moveToChronicCAPTimer){
	        	moveToChronicCAPTimer.addMetaData("key");
	        	moveToChronicCAPTimer.start();
	        	moveToChronicCAPTimer.stop();
	        }
            var self = this;
            this.remoteCallStarted();
            this.getCondition().cancel(function(condition) {
                self.remoteCallEnded();
                self.fire("cancelCondition", [condition]);
            });
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.resolveCondition = function(condition) {
            if (condition == this.getCondition()) {
                this.setEnabled(false);
                this.performUnselection();
            }
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.moveConditionToChronic = function(condition) {
            if (condition == this.getCondition()) {
                this.setEnabled(true);
            }
        };

        return ChronicToggle;
    }
);
define(
    "cerner/discernabu/components/conprobo3/controls/toggles/ResolvedToggle", [
        "cerner/discernabu/components/conprobo3/controls/toggles/ToggleButton"
    ],

    function (ToggleButton) {

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var ResolvedToggle = function (factory) {
            ToggleButton.call(this, factory);
        };
        ResolvedToggle.prototype = new ToggleButton();
        var method = ResolvedToggle.prototype;
        

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------
        method.init = function () {
        	var condition = this.getCondition();
        	var targetNomenclature = condition.getTargetNomenclatureValue();
            var freetextInd = targetNomenclature <= 0;
            var pregnancyInd = (condition.getProblems().length > 0 && condition.getProblems()[0].getProblemTypeFlag() == 2);
            var noActionsInd = (freetextInd || pregnancyInd);
            var modifyProblemInd = this.getCanModifyChronic();
            
            if(condition.getProblemDriverValue() && !condition.getProblemDriverFromArray().getCanCondModify()){
            	// this particular problem is not available to be modified due to a privilege exception
            	modifyProblemInd = false;
            }
            
            if (!this.getElement()) { return; }
            
            ToggleButton.prototype.init.call(this);
            this.setEnabled(true);

            if ((condition.getIsHistorical() && condition.getProblemDriverValue() && !condition.getIsChronic()) || (condition.getDiagnosisDriverValue() && !condition.getIsThisVisit() && !condition.getIsChronic())) {
                this.performSelection();
                this.setEnabled(false);
            } else {
                this.performUnselection();

                if (condition.getDiagnosisDriverValue() && !condition.getIsChronic()) {
                    this.setEnabled(false);
                }
            }
            
            if(noActionsInd || !modifyProblemInd){
            	this.setEnabled(false);
            }
        };

        method.onSelect = function () {
        	var resolveCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Resolve");
        	if(resolveCAPTimer){
	        	resolveCAPTimer.addMetaData("key");
	        	resolveCAPTimer.start();
	        	resolveCAPTimer.stop();
        	}
            var self = this;
            this.remoteCallStarted();
            this.getCondition().moveToHistorical(function (condition) {
               self.remoteCallEnded();
               self.fire("resolveCondition", [condition]);
            });
        };

        method.onUnselect = function () {
        	var resolveCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Resolve");
        	if(resolveCAPTimer){
	        	resolveCAPTimer.addMetaData("key");
	        	resolveCAPTimer.start();
	        	resolveCAPTimer.stop();
        	}
            var self = this;
            var vc = this.getBedrockConfig();
            this.remoteCallStarted();
            this.getCondition().setDiagnosisTypeValue(vc.getDiagnosisType());
            this.getCondition().unresolve(function (condition, raw) {
                self.remoteCallEnded();
                self.fire("handleDuplicates", [true, raw]);
                self.fire("unresolveCondition", [condition]);
            });
        };

        return ResolvedToggle;
    }
);
define(
    "cerner/discernabu/components/conprobo3/controls/toggles/ThisVisitToggle",
    ["cerner/discernabu/components/conprobo3/controls/toggles/ToggleButton"],

    function (ToggleButton) {
        
        var attribute = MPageOO.attribute;
        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var ThisVisitToggle = function (factory) {
            ToggleButton.call(this, factory);
        };

        ThisVisitToggle.prototype = new ToggleButton();
        var method = ThisVisitToggle.prototype;

        attribute(ThisVisitToggle, "SharedCondResObj");
        attribute(ThisVisitToggle, "IsPriorityEnabled");


        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------

        /**
         * Sets the toggle as selected or unselected depending on if the
         * condition is chronic or not
         */
        method.init = function () {
        	var condition = this.getCondition();
        	var targetNomenclature = condition.getTargetNomenclatureValue();
            var freetextInd = targetNomenclature <= 0;
            var pregnancyInd = (condition.getProblems().length > 0 && condition.getProblems()[0].getProblemTypeFlag() == 2);
            var noActionsInd = (freetextInd || pregnancyInd);
            var modifyDxInd = this.getCanModifyThisVisit();
            
            if(condition.getDiagnosisDriverValue() && !condition.getDiagnosisDriverFromArray().getCanCondModify()){
            	// this particular diagnosis is not available to be modified due to a privilege exception
            	modifyDxInd = false;
            }
            
            if (!this.getElement()) { return; }
            
            ToggleButton.prototype.init.call(this);
            if (condition.getIsThisVisit()) {
                this.performSelection();
            } else {
                this.performUnselection();
            }

            if (condition.getIsHistorical() && !condition.getIsThisVisit()){
            	this.performUnselection();
                this.setEnabled(true);
                if(condition.getDiagnosisDriverValue() && !condition.getIsThisVisit() && !condition.getIsChronic()){
                	this.getElement().toggleClass("resolved-problem");
                }
            }
            
            if((pregnancyInd && condition.getIsThisVisit() && (!condition.getIsChronic() || condition.getIsHistorical())) || freetextInd || !modifyDxInd){
            	this.setEnabled(false);
            }
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.onSelect = function () {
        	var moveToThisVisitCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Move_to_This_Visit");
        	if(moveToThisVisitCAPTimer){
	        	moveToThisVisitCAPTimer.addMetaData("key");
	        	moveToThisVisitCAPTimer.start();
	        	moveToThisVisitCAPTimer.stop();
        	}
            var self = this;
            this.remoteCallStarted();
            // get the vocab config object and pass it to entity.
            var vc = this.getBedrockConfig();
            var cond = this.getCondition();
            var problemTargetNomen = cond.getTargetNomenclatureValue();
            var problemClassification = cond.getClassificationValue();
            var problemConfirmation = cond.getConfirmationStatus();
            // Retreive necessary Diagnosis preferences from bedrock.
            cond.setDiagnosisTypeValue(vc.getDiagnosisType());
            cond.setClassificationValue(vc.getDiagnosisClassification());
            cond.setConfirmationStatusValue(vc.getDiagnosisConfirmation());
            
            if (this.getIsPriorityEnabled()) {
				cond.setClinicalPriority(this.getConditions().getHighestPriority() + 1);
			}
			
            cond.moveToThisVisit(vc, function(condition, raw) {
                    self.remoteCallEnded();
                    var reply = JSON.parse(raw);
                    // If cross mapping is launched and nothing get selected from cross mapping window.
                if (reply.RECORD_DATA.META.ERRORCD == 1 || reply.RECORD_DATA.META.ERRORCD == 2) {
                    if (reply.RECORD_DATA.VALUES[0].TARGETNOMENCLATURE === 0) {
                            cond.setTargetNomenclatureValue(problemTargetNomen);
                    }
                    if (reply.RECORD_DATA.META.ERRORCD == 1) {
                        var sTargetSection = i18n.discernabu.conprobo3_i18n.THIS_VISIT;
                        var sDuplicateMessage = i18n.discernabu.conprobo3_i18n.DUPLICATE_MSG.replace(/\{0\}/g, sTargetSection);
                        alert(sDuplicateMessage);
                    }
                    // Reset fields back to original fields.
                    cond.setClassificationValue(problemClassification);
                    cond.setConfirmationStatusValue(problemConfirmation);
                    self.remoteCallEnded();
                        self.performUnselection();
                    }
                    self.fire("moveConditionToThisVisit", [condition]);
            });
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.onUnselect = function () {
        	var moveToThisVisitCAPTimer = new RTMSTimer("CAP:MPG_Consolidated_Problems_o3_Move_to_This_Visit");
        	if(moveToThisVisitCAPTimer){
	        	moveToThisVisitCAPTimer.addMetaData("key");
	        	moveToThisVisitCAPTimer.start();
	        	moveToThisVisitCAPTimer.stop();
        	}
            var self = this;
            var condition = this.getCondition();
            this.remoteCallStarted();
            condition.removeFromThisVisit(function (conditions) {
                self.remoteCallEnded();
                self.fire("removeConditionFromThisVisit", [condition]);
            });
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Called when a condition is resolved somewhere in the component.
         * @param condition
         */
        method.resolveCondition = function (condition) {
            if (condition == this.getCondition()) {
                this.setEnabled(false);
                this.performUnselection();
            }
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Called when a condition is moved to chronic somwhere in the
         * component.
         *
         * @param condition
         */
        method.moveConditionToChronic = function (condition) {
            if (condition == this.getCondition()) {
                this.setEnabled(true);
            }
        };

        return ThisVisitToggle;
    }
);
define(
    "cerner/discernabu/components/conprobo3/controls/toggles/ToggleButton",

    function () {

        var attribute = MPageOO.attribute;
        var Selector = MPageControls.Selector;

        // --------------------------------------------------------------------
        // Initialization
        // --------------------------------------------------------------------

        var ToggleButton = function (factory) {
            Selector.call(this);
            this.setFactory(factory);
        };
        ToggleButton.prototype = new Selector();
        var method = ToggleButton.prototype;

        // --------------------------------------------------------------------
        // Attributes
        // --------------------------------------------------------------------

        attribute(ToggleButton, "Selector");

        /**
         * The CSS class to be applied when a remote call is in progress
         */
        attribute(ToggleButton, "LoadingClass");

        /**
         * The condition entity instance currently associated with the button.
         */
        attribute(ToggleButton, "Condition");
        
        /**
         * The total list of Conditions associated with the component 
         */
        attribute(ToggleButton, "Conditions");

        attribute(ToggleButton, "BedrockConfig");

        attribute(ToggleButton, "SharedCondResObj");
        
        attribute(ToggleButton, "Factory");
        
        attribute(ToggleButton, "CanModifyChronic");
        
        attribute(ToggleButton, "CanModifyThisVisit");

        // --------------------------------------------------------------------
        // Methods
        // --------------------------------------------------------------------

        method.init = function () {
            if (!this.getElement()) {
                return;
            }

            this.getFactory().selector().prototype.init.call(this);

            this.setLoadingClass("loading");
            this.setSelectedClass("selected");
            this.setUnselectedClass("");

            var self = this;
            this.setOnSelect(function () {
                self.onSelect();
            });
            this.setOnUnselect(function() {
                self.onUnselect();
            });
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.remoteCallStarted = function () {
            this.setBedrockConfig(this.getBedrockConfig());
            this.setSharedCondResObj(this.getSharedCondResObj());
            this.getElement().addClass(this.getLoadingClass());
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.remoteCallEnded = function () {
            // the element could have vanished when the call is complete
            if (!this.getElement()) { return; }
            this.getElement().removeClass(this.getLoadingClass());
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.onSelect = function () {
            // Abstract. Should be implemented by child class.
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.onUnselect = function () {
            // Abstract. Should be implemented by child class.
        };

        return ToggleButton;
    }
);define(
    "cerner/discernabu/components/conprobo3/model/CPO3Condition", [
        "cerner/discernabu/components/conprobo3/model/CPO3Diagnosis",
        "cerner/discernabu/components/conprobo3/model/CPO3Problem",
        "cerner/discernabu/components/conprobo3/model/CPO3Date",
        "cerner/discernabu/components/conprobo3/model/CPO3ConditionComment"
    ],

    function (CPO3Diagnosis, CPO3Problem, CPO3Date, CPO3ConditionComment) {

        var entityNamespace = {};
        var Condition = MPageEntity.entities.Condition;
        var OneToMany = MPageEntity.OneToMany;
        var i18n = window.i18n.discernabu.conprobo3_i18n;

        // ------------------------------------------------------------------------------
        // Initialization
        // ------------------------------------------------------------------------------

        /**
         * Extends the Condition entity with methods specific for
         * consolidated problems O3.
         */
        MPageEntity.Entity.extend(Condition, entityNamespace, "Condition", {
            "fields": {
                "diagnoses": new OneToMany(CPO3Diagnosis),
                "problems": new OneToMany(CPO3Problem),
                "comments": new OneToMany(CPO3ConditionComment)
            }
        });

        /**
         * @constructor
         */
        var CPO3Condition = entityNamespace.Condition;
        var method = CPO3Condition.prototype;

        // sets which class will handle a group of conditions
        CPO3Condition.defaultEntityListClass = MPageEntity.entities.ConditionList;

        // ------------------------------------------------------------------------------
        // Methods
        // ------------------------------------------------------------------------------

        /**
         * Returns a string where the onset date will be formatted according
         * to the onsetPrecision field.
         */
        method.getFormattedOnset = function () {

            // no onset for dx only conditions
            if (this.getDiagnoses().length && !this.getProblems().length) {
                return "--";
            }

            var dt = new CPO3Date(this.getOnset());
            dt.setPrecision(this.getOnsetPrecision());
            return dt.getStr();
        };
        
        /**
         * Returns the text string display for the classification of the current condition
         * @return {string} classDisplay : The string variable containing the classification display
         */
        method.getClassificationDisplay = function() {
        	var classDisplay = (this.getClassification().getDisplay()) ? this.getClassification().getDisplay() : "--"; 
        	return classDisplay;
        };

        /**
         * Returns the test string meaning for the classification of the current condition
         * @return {string}
         */
        method.getClassificationMeaning = function() {
            return this.getClassification().getMeaning();
        };

        method.getPriorityDisplay = function() {
            var priority = this.getClinicalPriority();
            if (!priority || priority === 0) {
                return "--";
            }
            return priority;
        };

        method.getStatusDisplay = function() {
            var lifecycleStatus = this.getLifeCycleStatus();
            if (!lifecycleStatus || lifecycleStatus.getDisplay() === "") {
                return "--";
            }
            return lifecycleStatus.getDisplay();
        };

        method.getLastUpdateDateFormatted = function() {
            var dt = new CPO3Date(this.getLastUpdate());
            return dt.getStr();
        };

        method.getClinicalServiceDisplay = function() {
            var clinService = this.getClinicalService();
            if (clinService && clinService.getDisplay()) {
                return clinService.getDisplay();
            }
            return "--";
        };

        method.getDiagnosisTypeDisplay = function() {
            var dxType = this.getDiagnosisType();
            if (!dxType || dxType.getDisplay() === "") {
                return "--";
            }
            return dxType.getDisplay();
        };

        /**
         * Returns the type of the condition (This Visit, Chronic, Resolved) as a
         * string.
         */
        method.getConditionTypeDisplay = function() {
            if (this.getIsThisVisit() && this.getIsChronic()) {
                return i18n.THIS_VISIT_AND_CHRONIC;
            }
            if (this.getIsThisVisit()) {
                return i18n.THIS_VISIT;
            }
            if (this.getIsChronic()) {
                return i18n.CHRONIC;
            }
            if (this.getIsHistorical()) {
                return i18n.HISTORICAL;
            }
            if (this.getIsInactive()) {
                return i18n.CHRONIC;
            }
        };

        /**
         * Returns a string with the confirmation status, or "--" if null
         */
        method.getConfirmationStatusDisplay = function() {
            var conf = this.getConfirmationStatus();
            if (!conf || conf.getDisplay() === "") {
                return "--";
            }
            return conf.getDisplay();
        };
        
        /**
         * Returns a true/false value if the condition has a resolved chronic problem 
         */
        method.getIsResolved = function() {
        	return (!this.getIsChronic() && !this.getIsInactive() && this.getIsHistorical() && this.getProblemDriverValue());
        };

        /**
         * Whether this condition meets all the criteria necessary
         * to be able to open the dx assistant.
         */
        method.hasDxAssistant = function() {
          if (this.getDiagnosisDriverValue() &&
             this.isMapped() &&
             !this.isFreeText() &&
             this.getIsSpecific() !== null &&
             this.getIsSpecific() !== undefined) {
              return true;
          }

          return false;
        };

        return CPO3Condition;

    });define(
    "cerner/discernabu/components/conprobo3/model/CPO3ConditionComment",

    function () {

        var entityNamespace = {};
        var ConditionComment = MPageEntity.entities.ConditionComment;
        var OneToMany = MPageEntity.OneToMany;
        var i18n = window.i18n.discernabu.conprobo3_i18n;

        // ------------------------------------------------------------------------------
        // Initialization
        // ------------------------------------------------------------------------------

        /**
         * Extends the ConditionComment entity with methods specific for
         * consolidated problems O3.
         */
        MPageEntity.Entity.extend(ConditionComment, entityNamespace, "ConditionComment", {});
        var CPO3ConditionComment = entityNamespace.ConditionComment;

        return CPO3ConditionComment;
    }
);define("cerner/discernabu/components/conprobo3/model/CPO3Date", function() {

    var attribute = MPageOO.attribute;

    var CPO3Date = function(date) {
        if (date) {
            this.setDate(date);
        }
        if (typeof(dateFormat) !== "undefined" && dateFormat && dateFormat.masks) {
            this.setMaskForShortDate2(dateFormat.masks.shortDate2);
            this.setMaskForShortDate4(dateFormat.masks.shortDate4);
            this.setMaskForShortDate5(dateFormat.masks.shortDate5);
        }
    };

    attribute(CPO3Date, "Date");
    attribute(CPO3Date, "Precision");
    attribute(CPO3Date, "MaskForShortDate2");
    attribute(CPO3Date, "MaskForShortDate4");
    attribute(CPO3Date, "MaskForShortDate5");

    var method = CPO3Date.prototype;

    method.getStrWithPrecision = function() {
        var dt = this.getDate();
        if (!dt) {
            return "--";
        }
        var precision = this.getPrecision();
        switch (precision) {
            case 1:  //Day month and year
                return dt.format(this.getMaskForShortDate2());
            case 2: //Month
                return dt.format(this.getMaskForShortDate4());
            case 3: //Year
                return dt.format(this.getMaskForShortDate5());
            default:  //This would be an unknown flag, so will default to just showing the year.
                return dt.format(this.getMaskForShortDate5());
        }
    };

    method.getStr = function () {
        var dt = this.getDate();
        if (!dt) {
            return "--";
        }
        return dt.format(this.getMaskForShortDate2());
    };

    return CPO3Date;
});define(
    "cerner/discernabu/components/conprobo3/model/CPO3Diagnosis",

    function () {

        var entityNamespace = {};
        var Diagnosis = MPageEntity.entities.Diagnosis;

        // ------------------------------------------------------------------------------
        // Initialization
        // ------------------------------------------------------------------------------

        /**
         * Extends the Condition entity with methods specific for
         * consolidated problems O3.
         */
        MPageEntity.Entity.extend(Diagnosis, entityNamespace, "Diagnosis", {});

        var CPO3Diagnosis = entityNamespace.Diagnosis;
        var method = CPO3Diagnosis.prototype;

        method.getFormattedDate = function() {
          if (!this.getDiagDtTm()) {
              return "--";
          }
          return this.getDiagDtTm().format(dateFormat.masks.shortDate2);
        };

        method.getClassificationDisplay = function() {
            var classification = this.getClassification();
            if (!classification ||
                !classification.getDisplay() ||
                classification.getDisplay() === "") {
                return "--";
            }
            return classification.getDisplay();
        };
        
        method.getClassificationMeaning = function() {
        	var classification = this.getClassification();
        	if(!classification || !classification.getMeaning() || classification.getMeaning() === "") {
        		return "--";
        	}
        	
        	return classification.getMeaning();
        };


        return CPO3Diagnosis;
    }
);define(
    "cerner/discernabu/components/conprobo3/model/CPO3Problem", [
        "cerner/discernabu/components/conprobo3/model/CPO3Date"
    ],

    function (CPO3Date) {

        var entityNamespace = {};
        var Problem = MPageEntity.entities.Problem;
        var i18n = window.i18n.discernabu.conprobo3_i18n;

        // ------------------------------------------------------------------------------
        // Initialization
        // ------------------------------------------------------------------------------

        /**
         * Extends the Condition entity with methods specific for
         * consolidated problems O3.
         */
        MPageEntity.Entity.extend(Problem, entityNamespace, "Problem", {});

        var CPO3Problem = entityNamespace.Problem;

        CPO3Problem.STATUSES = {
            RESOLVED: 3304,
            ACTIVE: 3301,
            INACTIVE: 3303,
            CANCELED: 3302
        };

        var method = CPO3Problem.prototype;


        method.getFormattedOnset = function() {
            var dt = new CPO3Date(this.getOnsetDateTime());
            dt.setPrecision(this.getOnsetPrecision());
            return dt.getStr();
        };

        /**
         * Returns an i18n string with the problem category, which varies according to its
         * lifecycle status code, according to:
         *
         * lifecycle status | i18n string
         * ------------------------------
         * RESOLVED           HISTORICAL
         * ACTIVE             CHRONIC
         * INACTIVE           INACTIVE
         */
        method.getStatusLabel = function() {
            var ST = CPO3Problem.STATUSES;
            switch(this.getLifeCycleStatusCd()) {
                case ST.ACTIVE:
                    return i18n.CHRONIC;
                case ST.INACTIVE:
                    return i18n.CHRONIC + " - " + i18n.INACTIVE;
                case ST.RESOLVED:
                    return i18n.HISTORICAL;
                default:
                    return "--";
            }
        };


        method.getClassificationDisplay = function() {
            var classification = this.getClassificationCd();
            if (!classification ||
                !classification.getDisplay() ||
                classification.getDisplay() === "") {
                return "--";
            }
            return classification.getDisplay();
        };

        method.isInactive = function() {
          return this.getLifeCycleStatusCd() == CPO3Problem.STATUSES.INACTIVE;
        };
        
        method.getClassificationMeaning = function() {
        	var classification = this.getClassificationCd();
        	if(!classification || !classification.getMeaning() || classification.getMeaning() === "") {
        		return "--";
        	}
        	
        	return classification.getMeaning();
        };

        return CPO3Problem;
    }
);
define(
    "cerner/discernabu/components/conprobo3/templates/CommentTemplate",

    function() {
        var tpl = {};
        var i18n = window.i18n;

        tpl.loading = function() {
            return "<div class='loading' />";
        };

        tpl.commentList = function(ctx) {
            var out = [];

            ctx.comments.each(function (comment) {
                out.push(
                    "<div class='comment'>",
                        "<div class='comment-header'>",
                            comment.getFormattedHeader(),
                        "</div>",
                        comment.getText().replace(/\n/g, "<br />"),
                    "</div>");
            });
            return out.join("");
        };

        tpl.commentPanel = function(ctx) {

            // if you can't add any comments and there are no comments to show, we don't bother
            // showing anything
            if (!ctx.showAddComments && !ctx.comments.length) {
                return "";
            }

            var out = [
                "<div class = 'sp-separator'></div>",
                "<h2>", i18n.COMMENTS, "</h2>"
            ];

            if (ctx.showAddComments) {
                out.push("<div class='add-comments'>",
                    "<div class='add-comment'><input type='text' class='input' id='", ctx.addCommentTextboxId, "' /></div>",
                    "<input type='button' class='save-comment' id='", ctx.saveButtonId, "' value='", i18n.SAVE, "' />",
                    "<input type='button' class='cancel-comment' id='", ctx.cancelButtonId, "' value='", i18n.CANCEL, "' />",
                "</div>");
            }

            out.push("<div class='comments' id='", ctx.commentListId, "'></div>")
            return out.join("");
        };

        return tpl;
    });
define(
    "cerner/discernabu/components/conprobo3/templates/ComponentTemplate",

    function() {
        var i18n = window.i18n.discernabu.conprobo3_i18n;
        var tpl = {};

        tpl.nkpMessageContainer = function(ctx){
            return "<div class ='message-container cpo3-nkp-msg' id ='noChronicProbMsg" + ctx.compId +"'></div>";
        };
        
        tpl.unspecifiedAlert = function(ctx){
            return [
                "<a class='unspecified-alert' id='"+ctx.dxAssButtId+"'>",
                   ctx.conditionsLength, " ", i18n.UNSPECIFIED_PROBLEM,
                "</a>"
            ].join('');
        };

        tpl.documentNkpLink = function(ctx){
            return "<a id ='" + ctx.buttonId + "'>" + ctx.display +"</a>";
        };
        
        tpl.nkpMessageContent = function(ctx){
            return "<span>" + ctx.noChronicProbsDocumented +" </span>" + 
                   "<span class ='conprobo3-document-ncp'>" + 
                        ctx.documentNkpMsg +
                   "</span>";
        };
        
        tpl.infoBarSkeleton = function(ctx){
            var out = ["<div id='cpo3InfoDiv", ctx.compId ,"' class='conprobo3-top-wrapper'>"];

            if (ctx.unspecifiedAlertId) {
                out.push("<div id='", ctx.unspecifiedAlertId, "'></div>");
            }

            out.push(
                "<div class='conprobo3-search-bar-wrapper'>",
                    "<span class='secondary-text'>" + ctx.cp3i18n.ADD_NEW_AS + ":</span>",
                    "<div id='cpo3AddNewAsMenu" + ctx.compId + "' class='conprobo3-add-new-drop-down'>",
                        "<div id='cpo3AddNewAsMenuContent" + ctx.compId + "' class='conprobo3-drop-down-display'></div>",
                    "</div>",
                    "<div id='nomenSearchBar" + ctx.compId + "'></div>",
                "</div>",
            "</div>");

        	return out.join("");
        };
        
        tpl.component = function(ctx) {

            var out = "" +
                "<div class='conprobo3'>" +
                    "<div class='views' id='" + ctx.viewsContainerId + "'></div>" +
                "</div>";

            return out;
        };

        return tpl;
    }
);
define("cerner/discernabu/components/conprobo3/templates/DetailedTemplate", function() {

	var i18n = window.i18n.discernabu.conprobo3_i18n;
	var i18nCore = window.i18n;

	var tpl = {};

	tpl.main = function(ctx) {
            return "<div class='cond-list' id='" + ctx.tableId + "'></div>" +
                "<div class='cond-details' id='" + ctx.detailsId + "'></div>";
	};

	tpl.sidePanelField = function(ctx) {
		var out = "";

		out += "<dl>";
		out += "<dt>" + ctx.label + "</dt>";
		out += "<dd>" + ctx.value + "</dd>";
		out += "</dl>";

		return out;
	};
    tpl.display = function (ctx) {
            var out = ctx.getCondition().getDisplay();

            if (ctx.getCondition().isFreeText()) {
              out += " (" + i18n.FREETEXT + ")";
            }
            return out;
        };

        tpl.topButtons = function (ctx) {
            var out = "";
            var condition = ctx.getCondition();
            var targetNomenclature = condition.getTargetNomenclatureValue();
            var freetextInd = targetNomenclature <= 0;
            var pregnancyInd = (condition.getProblems().length > 0 && condition.getProblems()[0].getProblemTypeFlag() == 2);
            var noActionsInd = (freetextInd || pregnancyInd);
            var modifyDxInd = ctx.getCanModifyThisVisit();
            var modifyProblemInd = ctx.getCanModifyChronic();
            var disabledClass = "";
            
            if(condition.getDiagnosisDriverValue() && !condition.getDiagnosisDriverFromArray().getCanCondModify()){
            	// this particular diagnosis is not available to be modified due to a privilege exception
            	modifyDxInd = false;
            }
            
            if(condition.getProblemDriverValue() && !condition.getProblemDriverFromArray().getCanCondModify()){
            	// this particular problem is not available to be modified due to a privilege exception
            	modifyProblemInd = false;
            }

            // this visit toggle
			disabledClass = ((pregnancyInd && condition.getIsThisVisit() && (!condition.getIsChronic() || condition.getIsHistorical())) || freetextInd || !modifyDxInd) ? "disabled no-privs" : "";
			out += "<div class='this-visit toggle " + disabledClass + "' id='" + ctx.getThisVisitToggle().getElementId() + "'>";
			out += i18n.THIS_VISIT;
			out += "</div>";

			// chronic toggle
			disabledClass = (noActionsInd || !modifyProblemInd) ? "disabled no-privs" : "";
			out += "<div class='chronic toggle " + disabledClass + "' id='" + ctx.getChronicToggle().getElementId() + "'>";
			out += i18n.CHRONIC;
			out += "</div>";
			
			// Cancel button - only add if a problem is available
			if (!noActionsInd && condition.canModifyChronic()) {
				// cancel button
				out += "<div class='cancel toggle' id='" + ctx.getCancelButton().getElementId() + "'>";
				out += i18n.CANCEL;
				out += "</div>";
			}
				
			if (!pregnancyInd) {
				// modify button - only add if condition is not a pregnancy and contains either a This Visit diagnosis, an eligible Problem, or both
				if((condition.getDiagnosisDriverValue() && condition.getIsThisVisit() && modifyDxInd) 	|| (condition.getProblemDriverValue() && condition.getIsChronic() && modifyProblemInd)
						|| (condition.isResolved() && modifyProblemInd)){
					out += "<div class='modify toggle' id='" + ctx.getModifyButton().getElementId() + "'>";
					out += i18n.MODIFY;
					out += "</div>";
				}
				
				if(modifyProblemInd && condition.getIsChronic() && !freetextInd){
					// resolve button
					out += "<div class='resolve-action' id='" + ctx.getResolvedToggle().getElementId() + "'>";
					out += i18n.RESOLVE;
					out += "</div>";
				}
			}			

            return out;
        };

        tpl.flaggedProblemBanner = function(ctx) {
        	return "<div class='flagged-problem-banner message-container' id='" + ctx.getFlaggedProblemBanner().getElementId() + "'></div>";
        };

	tpl.sidePanel = function(ctx) {
		var out = "";
		var condition = ctx.getCondition();
		var targetNomenclature = condition.getTargetNomenclatureValue();

		out += "<div class='sp-close-btn' id='" + ctx.getCloseButton().getElementId() + "'></div>";
		out += tpl.flaggedProblemBanner(ctx);
		out += "<div class='condition-details-panel'>";
	    out += "<div class='sp-action-holder'>";
	    if (CERN_Platform.inMillenniumContext() || CERN_BrowserDevInd) {
            out += tpl.topButtons(ctx);
		}
        out += "</div>";

        out += "<h1>"+ tpl.display(ctx) + "</h1>";
		out += "<div class='sp-separator'></div>";

		out += "<div id='" + ctx.getScrollContainerId() + "'>";

		out += "<div class='condition-details'>";

		// main condition fields
		out += tpl.sidePanelField({
			label : i18n.CONDITION_TYPE,
			value : condition.getConditionTypeDisplay()
		});

		out += tpl.sidePanelField({
			label : i18n.CLASSIFICATION,
			value : condition.getClassificationDisplay()
		});

			out += tpl.sidePanelField({
				label : i18n.ONSET_DATE,
				value : condition.getFormattedOnset()
			});

		out += tpl.sidePanelField({
			label : i18n.STATUS,
			value : condition.getStatusDisplay()
		});

		out += tpl.sidePanelField({
			label : i18n.CONFIRMATION,
			value : condition.getConfirmationStatusDisplay()
		});

		if (!condition.isFreeText() && ctx.getIsInfoButtonEnabled()) {
			out += "<dl id='" + ctx.getInfoButton().getElementId() + "' class = 'conprobo3-info-btn'><span class ='info-icon'>&nbsp;</span><a>" + i18n.ONLINE_RESOURCE + " (" + i18n.INFOBUTTON + ")" + "</a></dl>";
		}

		if (condition.hasDxAssistant() && ctx.getIsDxAssistantEnabled()) {
			var dxBtnId = ctx.getDxAssistantButton().getElementId();
			if (condition.getIsSpecific()) {
				out += "<dl id='"+dxBtnId+"'><a class='specified-condition' >" + i18n.SPECIFIED + "</a></dl>";
			} else {
				out += "<dl id='"+dxBtnId+"'><a class='unspecified-condition' >" + i18n.UNSPECIFIED + "</a></dl>";
			}
		}

		out += "</div>";

		out += "<div id='" + ctx.getCommentPanel().getElementId() + "'></div>";

		if (condition.getDiagnoses().length + condition.getProblems().length >= 1){
			out += "<div class = 'sp-separator'></div>";
			out += "<h2>" + i18nCore.DETAILS + "</h2>";
			out += "<div class='historical-section' id='" + ctx.getHistoricalTable().getElementId() + "'></div>";
		}
		out += "</div>";
		out += "</div>";
		out += "</div>";

		return out;
	};

	tpl.conditionTypeLabel = function(ctx){
		if (ctx.isHistorical){
			return i18n.HISTORICAL;
		}
		else if (ctx.isChronic){
			return i18n.CHRONIC;
		}
		else{
			return i18n.THIS_VISIT;
		}
	};

	tpl.historicalDisplayColumn = function(ctx){
		out =  "<span class='historical-label'>" +  ctx.vocab + ": </span><span>" + ctx.display + " (" + ctx.termCode + ")";
		out += " - " + tpl.conditionTypeLabel(ctx) + "</span><br/>";
		out += "<span class='historical-label'>" + i18n.CLASSIFICATION + ": </span><span>" + ctx.classification + "</span>";
		return out;
	};

	tpl.historicalOnsetColumn = function(ctx){
		return "<span>" + ctx.onsetDate + "</span>";
	};

	return tpl;
});
define(
    "cerner/discernabu/components/conprobo3/templates/ListTemplate", function() {

        var i18n = window.i18n.discernabu.conprobo3_i18n;
        var tpl = {};

        tpl.chronicToggle = function(ctx) {
        	var privClass = ctx.canModifyChronic ? "" : "no-privs";
        	var disabledClass = (ctx.condition.hasProblem && ctx.condition.Problems[0].getProblemTypeFlag() == 2) ? "disabled " : "";
        	if(disabledClass || (ctx.condition.hasProblem && !ctx.condition.canModifyChronic)){
        		privClass = "no-privs";
        	}
        	
        	return "<div class='chronic toggle " + disabledClass + privClass + "' id='" + ctx.chronicToggleId + "'>" + i18n.CHRONIC + "</div>";	
        };

        tpl.thisVisitToggle = function(ctx) {
        	var pregInd = (ctx.condition.hasProblem && ctx.condition.Problems[0].getProblemTypeFlag() == 2);
        	var privClass = (ctx.canModifyThisVisit) ? "" : "no-privs";
        	var disabledClass =  (pregInd && ctx.condition.isThisVisit && (!ctx.condition.isChronic || ctx.condition.isHistorical)) ? "disabled " : "";
        	if(disabledClass || (ctx.condition.hasDx && !ctx.condition.canModifyThisVisit)){
        		privClass = "no-privs";
        	}
        	
        	return "<div class='this-visit toggle " + disabledClass + privClass + "' id='" + ctx.thisVisitToggleId + "'>" + i18n.THIS_VISIT + "</div>";            
        };

        tpl.resolvedToggle = function(ctx) {
        	if(ctx.condition.hasProblem && ctx.condition.isChronic && ctx.canModifyChronic && ctx.condition.canModifyChronic){
           		return "<div class='resolve-action' id='" + ctx.resolvedToggleId + "'>" + i18n.RESOLVE + "</div>";
           	 } else {
	         	return "";
	         }
        };
        
        tpl.disabledActions = function(ctx) {
        	return "<div class='this-visit toggle disabled no-privs' id='" + ctx.thisVisitToggleId + "'>" + i18n.THIS_VISIT + "</div>" +
        			"<div class='chronic toggle disabled no-privs' id='" + ctx.chronicToggleId + "'>" + i18n.CHRONIC + "</div>";
        };

        tpl.priorityDropDown = function(ctx) {
            if (ctx.isPriorityEnabled && ctx.condition.canModify) {
            return "<span class='priority drop-down' id='" + ctx.priorityDropDownId + "'></span>";
            }
            return "<span class='priority view-only'>" + ctx.condition.priorityDisplay + "</span>";
        };

        tpl.priorityDropDownItem = function(ctx) {
            return "<dd id='" + ctx._elementId + '">' + ctx.priority + "</dd>";
        };

        tpl.removeNKPLink = function(ctx){
            return "<a id='" + ctx.cancelButtonId + "'>" + i18n.REMOVE + "</a>";
        };

        tpl.nkpActionColumn = function(ctx){
            if (ctx.canModify){
                return tpl.removeNKPLink(ctx);
            }
        };

        tpl.nkpDisplayColumn = function(ctx){
            return "<span class='priority' /><i>" + ctx.condition.display + "</i>";
        }; 

        tpl.buttons = function(ctx) {
        	if(ctx.condition.targetNomenclature > 0){
        		if(ctx.condition.hasProblem && ctx.condition.Problems[0].getProblemTypeFlag() == 2){
        			// pregnancy condition, display enabled This Visit & Disabled Chronic
        			return tpl.thisVisitToggle(ctx) + tpl.chronicToggle(ctx);
        		}
	            return tpl.thisVisitToggle(ctx) + tpl.chronicToggle(ctx) + tpl.resolvedToggle(ctx);
	        } else {
	        	// free text problem, display disabled actions
	        	return tpl.disabledActions(ctx);
	        }
        };

        tpl.actionsColumn = function(ctx) {
            var out = [tpl.buttons(ctx)];
            if (ctx.condition.isHistorical && ctx.condition.isThisVisit) {
                out.push("<span class='resolved'>" + i18n.RESOLVED+ "</span>");
            }
            return out.join('');
        };

        tpl.displayColumn = function(ctx) {
            var out = "";

            if (ctx.condition.isThisVisit) {
                out += tpl.priorityDropDown(ctx);
            } else {
                out += "<span class='priority' />";
            }

            if (ctx.isDxAssistantEnabled && ctx.showDxAssIcon) {
              out += "<span id='"+ctx.dxAssButtId+"' class='unspecified-condition'>&nbsp;</span>";
            }

            out += "<span class='display' id='" + ctx.selectConditionBtnId + "'>";
            out += ctx.condition.display;
            
            if(ctx.condition.isInactive) {
            	out += "<span class='sec-text'>" + i18n.INACTIVE + "</span>";
            }
            
            out += "</span>";

            return out;
        };

        tpl.commentsIndicatorColumn = function(ctx) {
             if (!ctx.condition.showCommentIcon) { return ""; }

             return ['<div class="comment-indicator" id="',
                    ctx.commentsIndButtId,'" />'].join('');
        };

        tpl.classificationColumn = function(ctx) {
            return "<span>" + ctx.condition.classificationDisplay + "</span>";
        };

        tpl.main = function (ctx) {
            return "<div class='list-view' id='" + ctx.getConditionListTableId() + "'></div>";
        };

        return tpl;
    }
);
define(
    "cerner/discernabu/components/conprobo3/views/DetailedView", [
        "cerner/discernabu/components/conprobo3/CPO3View"
    ],

    function (CPO3View) {
        var attribute = MPageOO.attribute;

        /**
         * A view consisting of a list of conditions and a panel that displays the details
         * of a condition when that condition is selected from the list.
         *
         * @param element
         * @param factory
         * @constructor
         */
        var DetailedView = function (element, factory) {
            CPO3View.call(this, element, factory);
        };

        DetailedView.prototype = new CPO3View();
        var method = DetailedView.prototype;

        // ------------------------------------------------------------------------------
        // Attributes
        // ------------------------------------------------------------------------------

        /**
         * The Consolidated Problems option 3 component instance that this table is associated to
         */
        attribute(DetailedView, "Component");

        /**
         * The condition list to be displayed on the left hand side
         */
        attribute(DetailedView, "ConditionListTable");

        /**
         * The detail panel instance to be displayed on the right hand side
         */
        attribute(DetailedView, "DetailsPanel");

        /**
         * The ID of the DOM element for the details panel. This is generated
         * automatically on create and passed to the template.
         */
        attribute(DetailedView, "DetailsPanelId");

        /**
         * The ID of the DOM element for the conditions list panel. This is
         * generated automatically on create.
         */
        attribute(DetailedView, "ConditionListTableId");

        /**
         * The current selected condition
         */
        attribute(DetailedView, "Condition");

        /**
         * The list of conditions that will be displayed in the left side table
         */
        attribute(DetailedView, "Conditions");

		/**
         * The button which will collapse the side panel and return to list view
         */
        attribute(DetailedView, "CloseDetailsPanelButton");

        attribute(DetailedView, "MaxHeight");
	
        attribute(DetailedView, "BedrockConfig");

        attribute(DetailedView, "SharedCondResObj");
        
		/**
         * The criterion object for this component
         */
        attribute(DetailedView, "Criterion");
        
        /**
         * The criterion object for this component
         */
        attribute(DetailedView, "MetaObj");
		
		/**
         * Is the InfoButton filter set to on
         */
        attribute(DetailedView, "IsInfoButtonEnabled");
        
        attribute(DetailedView, "ClassificationFilter");
        // ------------------------------------------------------------------------------
        // Methods
        // ------------------------------------------------------------------------------

        /**
         * Instantiates the condition list and the detail panel
         */
        method.create = function () {
            CPO3View.prototype.create.call(this);

            var build = this.getFactory();
            var table = build.conditionListTable(this.getConditionListTableId());
            var details = build.detailsPanel(this.getDetailsPanelId());
            var closeButton = build.closeDetailsPanelButton();

            this.setCloseDetailsPanelButton(closeButton);
            closeButton.setParent(this);

            this.renderTemplate(build.detailedTemplate().main, {
                detailsId: details.getElementId(),
                closeBtnId: closeButton.getElementId(),
                tableId: table.getElementId()
            });

            table.setTemplates(build.listTemplate());
            table.setComponent(this.getComponent());
            table.addDisplayColumn();
            table.addCommentIndicatorColumn();
            table.setParent(this);
            table.setBedrockConfig(this.getBedrockConfig());
            table.setClassificationFilter(this.getClassificationFilter());
            table.setCanModifyThisVisit(this.getCanModifyThisVisit());
            table.setCanModifyChronic(this.getCanModifyChronic());
            table.setIsPriorityEnabled(this.getIsPriorityEnabled());
            table.setIsDxAssistantEnabled(this.getIsDxAssistantEnabled());
            table.create();

            details.setParent(this);
            details.setBedrockConfig(this.getBedrockConfig());
            details.setSharedCondResObj(this.getSharedCondResObj());
            details.setCanModifyThisVisit(this.getCanModifyThisVisit());
            details.setCanModifyChronic(this.getCanModifyChronic());
            details.setCriterion(this.getCriterion());
            details.setMetaObj(this.getMetaObj());
            details.setIsInfoButtonEnabled(this.getIsInfoButtonEnabled());
            details.setIsDxAssistantEnabled(this.getIsDxAssistantEnabled());
            details.setConditionList(this.getConditions());
            details.create();

            this.setConditionListTable(table);
            this.setDetailsPanel(details);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Updates the entire view - the table and the details panel
         */
        method.update = function () {
            this.getElement().addClass("detailed-view");
            var table = this.getConditionListTable();
            table.setConditions(this.getConditions());
            table.setClassificationFilter(this.getClassificationFilter());
            table.update();
            this.updateDetails();
            this.getCloseDetailsPanelButton().init();
            this.getDetailsPanel().setConditionList(this.getConditions());
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Updates the details panel with the condition as set by setCondition()
         */
        method.updateDetails = function() {
            var details = this.getDetailsPanel();
            details.setCondition(this.getCondition());
            details.update();
            this.resize();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Event executed when a condition is selected from the table
         * @param condition
         */
        method.selectCondition = function(condition) {
            if (this.getCondition() === condition) {
                this.closeDetailsPanel();
                return;
            }

            this.setCondition(condition);
            this.getConditionListTable().highlightCondition(condition);
            this.updateDetails();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Executed when the details panel is closed
         */
        method.closeDetailsPanel = function() {
            var currentScrollPosition = this.getConditionListTable().getScrollPosition();
            this.fire("showListView");
            this.fire("updateCurrentViewScrollPosition", [currentScrollPosition]);
            this.setCondition(null);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.resize = function() {
            var maxHeight = this.getMaxHeight();

            if (!maxHeight) {
                return;
            }

            // update the size of the table
            this.getConditionListTable().trigger("setMaxHeight", [maxHeight]);
            this.getConditionListTable().trigger("resize");

            var tableHeight = this.getConditionListTable().getHeight();
            this.getDetailsPanel().setHeight(tableHeight);
            this.getDetailsPanel().trigger("resize");
        };

        method.scrollToComments = function() {
            this.getDetailsPanel().scrollToComments();
        };

        method.showView = function() {
            this.getDetailsPanel().show();
        };

        method.setScrollPosition = function(pos) {
            this.getConditionListTable().setScrollPosition(pos);
        };

        method.removeConditionFromThisVisit = function(condition) {
            this.fire("removeConditionFromThisVisit", [condition]);
        };

        method.resolveCondition = function(condition) {
            this.fire("resolveCondition", [condition]);
        };

        method.unresolveCondition= function (condition) {
            this.fire("unresolveCondition", [condition]);
        };

        method.handleDuplicates = function(isThisVisit, raw){
            this.fire("handleDuplicates", [isThisVisit, raw]);
        };

        method.changePriority = function(condition) {
            this.fire("changePriority", [condition]);
        };

        method.moveConditionToThisVisit = function(condition){
            this.fire("moveConditionToThisVisit", [condition]);
        };
        
        method.moveConditionToChronic = function(condition){
            this.fire("moveConditionToChronic", [condition]);
        };

        method.cancelCondition = function(condition) {
            this.fire("cancelCondition", [condition]);
        };

        method.addComment = function(comment) {
            this.getConditionListTable().update();
            this.getConditionListTable().highlightCondition(this.getCondition());
        };

        method.updateSpecifiedConditions = function(conditions) {
            CPO3View.prototype.updateSpecifiedConditions.call(this, conditions);
            this.getConditionListTable().highlightCondition(this.getCondition());
        };

        return DetailedView;
    }
);
define(
    "cerner/discernabu/components/conprobo3/views/ListView", [
        "cerner/discernabu/components/conprobo3/CPO3View"
    ],

    function (CPO3View) {

        var attribute = MPageOO.attribute;

        // ------------------------------------------------------------------------------
        // Initialization
        // ------------------------------------------------------------------------------

        /**
         * Renders a HTML table with the conditions display and onset dates. Clicking on
         * a display column will change to the detail view for that condition.
         *
         * @param {DOMElement} element the html element where the list will be rendered
         * @param {CPO3Factory} factory the factory for creating object instances
         * @constructor
         */
        var ListView = function (element, factory) {
            CPO3View.call(this, element, factory);
        };

        ListView.prototype = new CPO3View();
        var method = ListView.prototype;

        // ------------------------------------------------------------------------------
        // Attributes
        // ------------------------------------------------------------------------------

        /**
         * The Consolidated Problems option 3 component instance that this table is associated to
         */
        attribute(ListView, "Component");

        /**
         * The ConditionListTable object responsible for rendering the list of conditions
         */
        attribute(ListView, "ConditionListTable");

        /**
         * An array of condition entities
         */
        attribute(ListView, "Conditions");

        /**
         * The id prefix in which the ConditionListTable will be inserted.
         * This will be postfixed with the control id in the template.
         */
        attribute(ListView, "ConditionListTableId");

        attribute(ListView, "BedrockConfig");

        attribute(ListView, "SharedCondResObj");

        attribute(ListView, "IsPriorityEnabled");
        
        attribute(ListView, "ClassificationFilter");

        // ------------------------------------------------------------------------------
        // Methods
        // ------------------------------------------------------------------------------

        /**
         * Initializes the HTML table
         */
        method.create = function () {
            CPO3View.prototype.create.call(this);

            if (!this.getConditionListTableId()) {
                this.setConditionListTableId("cond_list_table_" + this.getControlId());
            }

            var build = this.getFactory();
            var templates = build.listTemplate();
            this.renderTemplate(templates.main, this);

            // creates the table with display and onset columns
            var table = build.conditionListTable(this.getConditionListTableId());
            table.setComponent(this.getComponent());
            table.setTemplates(templates);
            table.setParent(this);
            table.addDisplayColumn();
            table.addCommentIndicatorColumn();
            table.addClassificationColumn();
            table.addActionsColumn();
            table.setIsPriorityEnabled(this.getIsPriorityEnabled());
            table.setCanModifyThisVisit(this.getCanModifyThisVisit());
            table.setCanModifyChronic(this.getCanModifyChronic());
			table.setBedrockConfig(this.getBedrockConfig());
            table.setSharedCondResObj(this.getSharedCondResObj());
            table.setClassificationFilter(this.getClassificationFilter());
            table.setIsDxAssistantEnabled(this.getIsDxAssistantEnabled());
            table.create();
            this.setConditionListTable(table);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * (re)renders the table with the conditions specified by setConditions()
         */
        method.update = function () {
            var table = this.getConditionListTable();
            table.setConditions(this.getConditions());
            table.setClassificationFilter(this.getClassificationFilter());
            table.update();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.setMaxHeight = function(height) {
            this.getConditionListTable().setMaxHeight(height);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.resize = function() {
            this.getConditionListTable().resize();
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.setScrollPosition = function(pos) {
            this.getConditionListTable().setScrollPosition(pos);
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        method.scrollToComments = function() {
            this.fire('scrollToComments');
        };

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

        /**
         * Opens the detailed view with the specified condition.
         *
         * @param {CPO3Condition} condition
         */
        method.selectCondition = function(condition) {
            var currentScrollPosition = this.getConditionListTable().getScrollPosition();
            this.fire("showDetailedView", [condition]);
            this.fire("updateCurrentViewScrollPosition", [currentScrollPosition]);
        };

        method.resolveCondition = function(condition) {
            this.fire("resolveCondition", [condition]);
        };

        method.unresolveCondition= function (condition) {
            this.fire("unresolveCondition",[condition]);
        };

        method.handleDuplicates = function(isThisVisit, raw){
            this.fire("handleDuplicates", [isThisVisit, raw]);
        };

        method.changePriority = function(condition) {
            this.fire("changePriority", [condition]);
        };

        method.moveConditionToThisVisit = function(condition){
            this.fire("moveConditionToThisVisit", [condition]);
        };
        
        method.moveConditionToChronic = function(condition){
            this.fire("moveConditionToChronic", [condition]);
        };

        method.removeConditionFromThisVisit = function(condition) {
            this.fire("removeConditionFromThisVisit", [condition]);
        };

        method.cancelCondition = function(condition) {
            this.fire("cancelCondition", [condition]);
        };

        return ListView;
    }
);
require(["cerner/discernabu/components/conprobo3/ConprobO3Component"],
									function(comp) {
									ConprobO3Component = comp;
									});
									})();