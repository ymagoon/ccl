/**
 * Create the component style object which will be used to style various aspects of our component
 */
function LinksCPMComponentStyle(){
    this.initByNamespace("linksCPM");
}

LinksCPMComponentStyle.prototype = new ComponentStyle();
LinksCPMComponentStyle.prototype.constructor = ComponentStyle;

/**
 * @constructor
 * Initialize the Existing Orders Intelligent Ordering Component
 * @param {criterion} criterion - The criterion object contains information needed to render the component
 */
function LinksCPMComponent(criterion){
    var cpmDocI18n = i18n.discernabu.links_cpm_o1;
	// set timers
	this.loadTimer = new RTMSTimer("USR:MPG.LINKS.CPM - load component");
	this.renderTimer = new RTMSTimer("ENG:MPG.LINKS.CPM - render component");

	
    this.setCriterion(criterion);
    this.setStyles(new LinksCPMComponentStyle());
    this.setScope(1);
    this.setLabel(cpmDocI18n.LABEL);

    this.m_refUrls = null;

    this.setConceptGroupMeanings("REFURL");
}

/**
 * Inherits from the IOMPageComponent which inherits from MPageComponent
 */
LinksCPMComponent.prototype = new MPageComponent();
LinksCPMComponent.prototype.constructor = LinksCPMComponent;

CPMMPageComponent.attachMethods(LinksCPMComponent);

LinksCPMComponent.prototype.getRefUrls = function(){
    if (!this.m_refUrls){
        this.m_refUrls = [];
    }
    return this.m_refUrls;
};

LinksCPMComponent.prototype.getLoadTimer =  function(){
	return this.loadTimer;
};

LinksCPMComponent.prototype.getRenderTimer = function(){
	return this.renderTimer;
};

/**
 * Processes the component's configuration passed in by a view
 * @param {object} componentConfig - Object that contains component settings
 */
LinksCPMComponent.prototype.processComponentConfig = function(componentConfig, conceptGroupConfig){
 	try{
 		
	    if (!conceptGroupConfig){
	        return;
	    }
	    this.loadTimer.start();
	    //Call base class' method implementation first
	    CPMMPageComponent.prototype.processComponentConfig.call(this, componentConfig, conceptGroupConfig);
	
	    var refUrlList = this.getRefUrls();
	    var detail = null;
	    var detialList = null;
	    var cLen;
	    var i;
	    var x;
	    var xl;
	
	    if (!conceptGroupConfig || !conceptGroupConfig.length){
	        return;
	    }
	
	    cLen = conceptGroupConfig.length;
	    for (i = 0; i < cLen; i++){
	        if(conceptGroupConfig[i].CONCEPT_GROUP_CD_MEAN == "REFURL"){
	            detailList = conceptGroupConfig[i].CG_DTL_LIST;
	            for(x = 0, xl = detailList.length; x < xl; x++){
	                detail = detailList[x];
	                refUrlList.push({
	                    "URL" : detail.CONCEPT_ENTITY_TEXT
	                    , "LABEL" : detail.CONCEPT_ENTITY_IDENT
	                });  
	            }
	        }
	    }
        
        cLen = componentConfig.length;
	    for (i = 0; i < cLen; i++){
            if(componentConfig[i].DETAIL_RELTN_CD_MEAN == "REFURL") {
                detail = componentConfig[i];
                refUrlList.push({
                        "URL"   : detail.ENTITY_TEXT
                    ,   "LABEL" : detail.ENTITY_IDENT
                });
            }
        }
		
		this.setIsHidden(true);
		this.populateLinksMenu();	

 	}
 	catch (e){
 		this.loadTimer.fail();
 	}
 	finally{
 		this.loadTimer.stop();
 	}
	
};

LinksCPMComponent.prototype.retrieveComponentData = function() {
    //Data already retrieved
    this.renderComponent();
};

LinksCPMComponent.prototype.populateLinksMenu = function(){
    try{
		this.renderTimer.start();	
		var linksConceptCd = this.getConceptCd();
   		var compSelMenuId = "cpmTabMenu" + linksConceptCd;
    	var detail = null;
	    var cLen;
	    var i;
		var cpmTabMenu = MP_MenuManager.getMenuObject("cpmTabMenu" + this.getConceptCd());
		var linksMenuItem = "cpmTabLinksMenu" + this.getConceptCd();
		var refUrlList = this.getRefUrls();
		

		
	    if (!refUrlList || !refUrlList.length){
	        return;
	    }
	    //undisable the menu item since there will be links in it now
		MP_MenuManager.getMenuObject("cpmTabLinksMenu" + this.getConceptCd()).setTypeClass("");
		MP_MenuManager.getMenuObject("cpmTabLinksMenu" + this.getConceptCd()).setIsDisabled(false);
		
		$("#chxTabsMenu" + linksConceptCd).removeClass("cpm-tab-menu-inactive").addClass("cpm-tab-menu-active");

		//Update the click event on the menu to launch this menu when clicked.
		$("#chxTabsMenu" + this.getConceptCd()).unbind("click").click(function() {
			//if(compSelMenuId.isActive()){
			if(MP_MenuManager.getMenuObject(compSelMenuId).isActive()){
				MP_MenuManager.closeMenuStack(true);
			}
			else{
				MP_MenuManager.showMenu(compSelMenuId);
			}
		});	
		
		
		//cpmTabMenu.setTypeClass("");	
	    cLen = refUrlList.length;
	    for (i = 0; i < cLen; i++){
	        detail = refUrlList[i];
				menuItem = new MenuSelection("linksMenuSelection"+"_"+i);
				menuItem.setCloseOnClick(true);
				menuItem.setLabel(detail.LABEL );
				menuItem.setIsDisabled(false);
				menuItem.setClickFunction(function(detail) {
					return function(){
						window.open(detail.URL, "_blank", "");
					};
				}(detail));
				// populate the menu
				MP_MenuManager.getMenuObject("cpmTabLinksMenu" + this.getConceptCd()).addMenuItem(menuItem);
	    }	
    }
    catch (e) {
    	this.renderTimer.fail();
    }
    finally{
    	this.renderTimer.stop();
    }
};


LinksCPMComponent.prototype.createLinksTable = function(){
    var refUrls = this.getRefUrls();

    var table = new ComponentTable();
    table.setNamespace(this.getStyles().getId() + "LinksTable");
    table.setCustomClass("links-cpm-table");
    table.setZebraStripe(false);

    var labelColumn = new TableColumn();
    labelColumn.setColumnId("LABEL");
    labelColumn.setCustomClass("links-cpm-table-label-col");
    labelColumn.setColumnDisplay("Resource");
    labelColumn.setRenderTemplate('<a href="${URL}" target="_blank">${LABEL}</a>');

    table.addColumn(labelColumn);

    table.bindData(refUrls);

    this.setComponentTable(table);
    return table;
};

LinksCPMComponent.prototype.renderComponent = function(){
    var table = this.createLinksTable();
    this.finalizeComponent(table.render(), "");
};

CPMController.prototype.addComponentMapping("LINKS", LinksCPMComponent);
