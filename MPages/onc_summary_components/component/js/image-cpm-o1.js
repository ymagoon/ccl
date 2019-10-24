function CpmPreviewPane(){
    this.m_id = "";
    this.m_itemsList = null;
}

CpmPreviewPane.prototype.getItemsList = function(){
    if (!this.m_itemsList){
        this.m_itemsList = [];
    }
    return this.m_itemsList;
};

/**
 * Create the component style object which will be used to style various aspects of our component
 */
function DiagramCPMComponentStyle(){
    this.initByNamespace("diagCPM");
}

DiagramCPMComponentStyle.prototype = new ComponentStyle();
DiagramCPMComponentStyle.prototype.constructor = ComponentStyle;

/**
 * @constructor
 * Initialize the Existing Orders Intelligent Ordering Component
 * @param {criterion} criterion - The criterion object contains information needed to render the component
 */
function DiagramCPMComponent(criterion){
	var cpmDocI18n = i18n.discernabu.image_cpm_o1;
	this.loadTimer = new RTMSTimer("USR:MPG.IMAGE.CPM - load component");
	this.renderTimer = new RTMSTimer("ENG:MPG.IMAGE.CPM - render component");

    this.setCriterion(criterion);
    this.setStyles(new DiagramCPMComponentStyle());
    this.setScope(1);
    this.setLabel(cpmDocI18n.LABEL);


    this.m_diagramName = "";
    this.m_diagramList = null;

    this.setConceptGroupMeanings(["REFIMAGE","DIAGRAM"]);
}

/**
 * Inherits from the IOMPageComponent which inherits from MPageComponent
 */
DiagramCPMComponent.prototype = new MPageComponent();
DiagramCPMComponent.prototype.constructor = DiagramCPMComponent;

CPMMPageComponent.attachMethods(DiagramCPMComponent);

DiagramCPMComponent.CSS_MAPPINGS = {
    "DIABETES_THUMB": "diagram-cpm-diabetes-thumb"
    , "DIABETES_FULL": "diagram-cpm-diabetes-full"
    , "DIABETES_URL": "diabetes_diagram.png"
};

DiagramCPMComponent.prototype.getRefUrls = function(){
    if (!this.m_refUrls){
        this.m_refUrls = [];
    }
    return this.m_refUrls;
};

DiagramCPMComponent.prototype.getDiagramList = function(){
    if (!this.m_diagramList){
        this.m_diagramList = [];
    }
    return this.m_diagramList;
};

DiagramCPMComponent.prototype.setDiagramList = function(list){
    this.m_diagramList = list;
};

DiagramCPMComponent.prototype.getLoadTimer = function() {
	return this.loadTimer;
};

DiagramCPMComponent.prototype.getRenderTimer = function() {
	return this.renderTimer;
};

/**
 * Processes the component's configuration passed in by a view
 * @param {object} componentConfig - Object that contains component settings
 */
DiagramCPMComponent.prototype.processComponentConfig = function(componentConfig, conceptGroupConfig){
	try {
		this.loadTimer.start();
	
	    if (!componentConfig || !conceptGroupConfig){
	        return;
	    }
	    
	    //Call base class' method implementation first
	    CPMMPageComponent.prototype.processComponentConfig.call(this, componentConfig, conceptGroupConfig);
	    
	    if((!componentConfig || !componentConfig.length ) && (!conceptGroupConfig || !conceptGroupConfig.length)) {
	    	return;
	    }
	
	    var componentDetailList = null;
	    var detail = null;
	    var cLen;
	    var i;
	    var diagramList = this.getDiagramList();
	
	    cLen = componentConfig.length;
	    for (i = 0; i < cLen; i++){
	        detail = componentConfig[i];
	        if (detail.DETAIL_RELTN_CD_MEAN === "DIAGRAM"){
	            this.m_diagramName = detail.ENTITY_NAME;
	        }
	        if (detail.DETAIL_RELTN_CD_MEAN === "REFIMAGE"){
	            var diagram = {};
	            diagram["TITLE"] = detail.ENTITY_IDENT;
	            diagram["URL"] = detail.ENTITY_TEXT;
	            diagramList.push(diagram);
	        }
	    }
	
	    cLen = conceptGroupConfig.length;
	    for (i = 0; i < cLen; i++){
	        if(conceptGroupConfig[i].CONCEPT_GROUP_CD_MEAN == "DIAGRAM" 
	            || conceptGroupConfig[i].CONCEPT_GROUP_CD_MEAN == "REFIMAGE" ){
	            detailList = conceptGroupConfig[i].CG_DTL_LIST;
	            for(x = 0, xl = detailList.length; x < xl; x++){
	                detail = detailList[x];
	                var diagram = {};
	                diagram["TITLE"] = detail.CONCEPT_ENTITY_IDENT;
	                diagram["URL"] = detail.CONCEPT_ENTITY_TEXT;
	                diagramList.push(diagram);
	            }
	        }
	
	    }
	
	    //Standard component settings
	    this.setAlwaysExpanded(false);
	    this.setExpanded(false);
		this.setIsHidden(true);		
		this.populateDiagramMenu();
	} catch (err) {
		this.loadTimer.fail();
	} finally {
		this.loadTimer.stop();
	}
};

DiagramCPMComponent.prototype.populateDiagramMenu = function() {
	try {
		this.renderTimer.start();

		var diagConceptCd = this.getConceptCd();
		var cpmTabMenu = MP_MenuManager.getMenuObject("cpmTabMenu" + diagConceptCd);
		var diagramMenuItem = "cpmTabDiagramsMenu" + diagConceptCd;

		var concept = this.m_diagramName;
		var diagramList = this.getDiagramList();
		var dLen = diagramList.length;
		var i;
		var url = this.getCustomContentLocation();
		//Only for when using custom components
		url += "img/" + DiagramCPMComponent.CSS_MAPPINGS[concept + "_URL"];
		
		if(diagramList && dLen > 0) {
			MP_MenuManager.getMenuObject(diagramMenuItem).setIsDisabled(false);
			MP_MenuManager.getMenuObject(diagramMenuItem).setTypeClass("");

			$("#chxTabsMenu" + diagConceptCd).removeClass("cpm-tab-menu-inactive").addClass("cpm-tab-menu-active");

			//Update the click event on the menu to launch this menu when clicked.
			$("#chxTabsMenu" + diagConceptCd).unbind("click").click(function() {
				if (MP_MenuManager.getMenuObject("cpmTabMenu" + diagConceptCd).isActive()) {
					MP_MenuManager.closeMenuStack(true);
				} else {
					MP_MenuManager.showMenu("cpmTabMenu" + diagConceptCd);
				}
			}); 
		}



		for ( i = 0; i < dLen; i++) {
			var diagram = diagramList[i];
			menuItem = new MenuSelection("diagramsMenuSelection" + "_" + i);
			menuItem.setCloseOnClick(true);
			menuItem.setLabel(diagram.TITLE);
			menuItem.setIsDisabled(false);
			menuItem.setClickFunction( function(diagram) {
				return function() {
					window.open(diagram.URL, "_blank", "");
				};
			}(diagram));
			
			MP_MenuManager.getMenuObject(diagramMenuItem).addMenuItem(menuItem);
		}
	} catch(err) {
		this.renderTimer.fail();
	} finally {
		this.renderTimer.stop();
	}
}; 


DiagramCPMComponent.prototype.retrieveComponentData = function() {
    	//Data already retrieved
		this.renderComponent();
};


DiagramCPMComponent.prototype.renderComponent = function() {
		var concept = this.m_diagramName;
		var diagramList = this.getDiagramList();
		var dLen = diagramList.length;
		var i;
		var html = "";
		var url = this.getCustomContentLocation();
		//Only for when using custom components
		url += "img/" + DiagramCPMComponent.CSS_MAPPINGS[concept + "_URL"];

		for ( i = 0; i < dLen; i++) {
			var diagram = diagramList[i];
			html += "<div class='diag-cpm-thumb-cont'>";
			html += "<a href='" + diagram.URL + "' target='_blank'><img class='diag-cpm-img' src='" + diagram.URL + "' title='" + diagram.TITLE + "'></a>";
			html += "</div>";
		}

		this.finalizeComponent(html, "");
}; 


CPMController.prototype.addComponentMapping("DIAGRAM", DiagramCPMComponent);