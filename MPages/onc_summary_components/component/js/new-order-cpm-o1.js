/* globals CPMMPageComponent, CPEventManager, InteractionChecking, MPageTooltip, HoverExtension, HoverRenderFactory, ComponentTableDataRetriever, CPMController, CapabilityTimer, MP_Core */
/**
 * Create the component style object which will be used to style various aspects of our component
 * @returns {undefined} - undefined
 */
function NewOrdersCPMComponentStyle(){
    this.initByNamespace("noCPM");
}

NewOrdersCPMComponentStyle.prototype = new ComponentStyle();

/**
 * Initialize the New Orders CPM Component
 * @param {criterion} criterion - The criterion object contains information needed to render the component
 * @constructor
 */
function NewOrdersCPMComponent(criterion){
    var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

    this.setCriterion(criterion);
    this.setStyles(new NewOrdersCPMComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.ORDEROPTS.CPM - load component");
    this.setComponentRenderTimerName("ENG:MPG.ORDEROPTS.CPM - render component");
    this.setScope(1);
    this.setLabel(cpmDocI18n.LABEL);
    this.setConceptGroupMeanings("ORDEROPTS");

    this.m_foldersList = null;
    this.m_orderController = null;
    //Variables that store component settings
    this.m_altSelCatId = null; //Folders to grab order synonyms from - new orders
    this.m_ruleTrigger = "";  //Discern expert trigger name - new orders
    this.m_conceptGroupCd = 0; //Eventually may be an array
    this.m_ocId = ""; //Identifier used to narrow down order results.  Likely set through interaction with the treatment-assessment component.
    this.m_currentVenueType = 2;
    this.m_venueList = null;
}

/**
 * Inherits from the IOMPageComponent which inherits from MPageComponent
 */
NewOrdersCPMComponent.prototype = new CPMMPageComponent();
NewOrdersCPMComponent.prototype.constructor = CPMMPageComponent;

NewOrdersCPMComponent.prototype.getCurrentVenueType = function(){
    return this.m_currentVenueType;
};

NewOrdersCPMComponent.prototype.setCurrentVenueType = function(type){
    this.m_currentVenueType = type;
};

NewOrdersCPMComponent.prototype.getFoldersList = function(){
	if (!this.m_foldersList) {
		this.m_foldersList = [];
	}
	return this.m_foldersList;
};

NewOrdersCPMComponent.prototype.setFoldersList = function(list) {
	this.m_foldersList = list;
};

NewOrdersCPMComponent.prototype.getOrderController = function(){
    if (!this.m_orderController){
        this.initializeOrderController();
    }
    return this.m_orderController;
};

NewOrdersCPMComponent.prototype.initializeOrderController = function(){
    var self = this;
    this.m_orderController = new this.OrderController(this.getComponentId(), this.getCriterion());
    this.m_orderController.setVenueSelectionClickFunction(function(venueVal){
            self.handleVenueTypeClick(venueVal);
        });
    var conceptCd = this.getConceptCd();
    this.m_orderController.setConceptCd(conceptCd);
};

/**
 * Gets an array of alt sel category ids that represent the folders to pull in order synonyms from
 * @returns {Array} - Always an array, contains alt sel category ids
 */
NewOrdersCPMComponent.prototype.getAltSelCatIdList = function(){
    if (!this.m_altSelCatId){
        this.m_altSelCatId = [];
    }
    return this.m_altSelCatId;
};

/**
 * Sets the alt sel category ids array
 * @param {Array | null} list - array of alt sel cat ids, or null
 * @returns {undefined} - undefined
 */
NewOrdersCPMComponent.prototype.setAltSelCatIdList = function(list){
    this.m_altSelCatId = list;
};

/**
* Sets the ocId
* @param {string | null} value - single identifier, or null
* @returns {undefined} - undefined
*/
NewOrdersCPMComponent.prototype.setOcId = function(value){
    this.m_ocId = value;
};

/**
 * Gets the ocId
 * @returns {string} - current OCID
 */
NewOrdersCPMComponent.prototype.getOcId = function(){
    return this.m_ocId;
};

/**
* Perform operations before the the component is rendered.
* @returns {undefined} - undefined
*/
NewOrdersCPMComponent.prototype.preProcessing = function(){
    //add listener for suggested orders from the docEventManager.
    CPEventManager.addObserver("BROADCAST_EVENT_ORDER_OPTION", this.broadcastEventCallbackFunc.bind(this));
};

/**
 * Refreshes the component based on the data pushed by the BROADCAST_EVENT event
 * @param {{}} item - data object send with the BROADCAST_EVENT event
 * @returns {undefined} - undefined
 */
NewOrdersCPMComponent.prototype.broadcastEventCallbackFunc = function(item){
    if (!item || !item.TERMS || !item.TERMS.length){
        return;
    }
    //Need to inverse the state
    var term = item.TERMS[0];
    var docEventManager = item.MANAGER;
    if (!term || !docEventManager || this.getPathwayId() !== docEventManager.getPathwayId()){
        return;
    }
    var ocid = term.getOCID();
    //Get current state
    var state = docEventManager.getStateByOCID(ocid);
    if (!state){
        //We are suggesting
        logger.logMPagesEventInfo(this, "SUGGEST", ocid, "new-order-cpm-o1.js", "broadcastEventCallbackFunc");
        docEventManager.setStateByOCID(ocid, true);
        this.filterOrders(ocid);
    } else {
        logger.logMPagesEventInfo(this, "UNSUGGEST", ocid, "new-order-cpm-o1.js", "broadcastEventCallbackFunc");
        docEventManager.setStateByOCID(ocid, false);
        this.unsuggestOrders();
    }
};

/**
* Filter the population of orders using the responses derived from the Treatment Assessment
* @param {string} ocId - an ocid to pass into the CCL data retrieval script
* @returns {undefined} - undefined
*/
NewOrdersCPMComponent.prototype.filterOrders = function(ocId){
    this.setOcId(ocId);
    this.retrieveComponentData();
};

/**
* Filter the population of orders using the responses derived from the Treatment Assesment.
* @returns {undefined} - undefined
*/
NewOrdersCPMComponent.prototype.unsuggestOrders = function(){
    this.setOcId("");
    this.retrieveComponentData();
    return;
};

/**
* Gets the Discern Expert Rule Trigger to use when retrieving related order synonyms
* @returns {string} - Discern expert rule trigger
*/
NewOrdersCPMComponent.prototype.getDiscernExpertRuleTrigger = function(){
    return this.m_ruleTrigger;
};

/**
 * Sets the Discern Expert Rule Trigger to use when retrieving related order synonyms
 * @param {string} ruleName - Name of the Discern Expert Rule Trigger
 * @returns {undefined} - undefined
 */
NewOrdersCPMComponent.prototype.setDiscernExpertRuleTrigger = function(ruleName){
    if (typeof ruleName !== "string"){
        throw new Error("Type Error: Non-string type 'ruleName' passed into NewOrdersCPMComponent method 'setDiscernExpertRuleTrigger'");
    }
    this.m_ruleTrigger = ruleName;
};

/**
 * Processes the component's configuration passed in by a view
 * @param {object} componentConfig - Object that contains component settings based on pathways
 * @param {object} conceptGroupConfig - Component settings based on concepts
 * @returns {undefined} - undefined
 */
NewOrdersCPMComponent.prototype.processComponentConfig = function(componentConfig, conceptGroupConfig){
    /*
     Current Configuration Options:
     - Order Options Rule - Used to trigger a rule
     - Order Options / ALT_SEL_CAT - Points to folder that contains orders
     */

    if (!conceptGroupConfig || !conceptGroupConfig.length){
            return;
    }
    //Call base class' method implementation first
    CPMMPageComponent.prototype.processComponentConfig.call(this, componentConfig, conceptGroupConfig);

    this.setAltSelCatIdList(null);
    var altSelCatList = this.getAltSelCatIdList();
    var detail = null;
    var detailList = null;
    var cLen;
    var i;
    var x;
    var xl;

    cLen = conceptGroupConfig.length;
    for (i = 0; i < cLen; i++){
        if(conceptGroupConfig[i].CONCEPT_GROUP_CD_MEAN === "ORDEROPTS"){
            detailList = conceptGroupConfig[i].CG_DTL_LIST;
            this.m_conceptGroupCd = conceptGroupConfig[i].CONCEPT_GROUP_CD;
            for(x = 0, xl = detailList.length; x < xl; x++){
                detail = detailList[x];
                if (detail.CONCEPT_ENTITY_IDENT === "DISCERN_EXPERT_TRIGGER_NAME"){
                    this.setDiscernExpertRuleTrigger(detail.CONCEPT_ENTITY_NAME || "");
                } else if (detail.CONCEPT_ENTITY_NAME === "ALT_SEL_CAT" && detail.CONCEPT_ENTITY_ID){
                    altSelCatList.push(detail.CONCEPT_ENTITY_ID);
                }
            }
        }
    }
    cLen = componentConfig.length;
    for (i = 0; i < cLen; i++){
        detail = componentConfig[i];
        if(detail.DETAIL_RELTN_CD_MEAN === "ORDEROPTS" && detail.ENTITY_NAME === "ALT_SEL_CAT"){
            altSelCatList.push(detail.ENTITY_ID);
        }
    }
};

/**
 * Generates the order folders and order options from the CCL data retrieval script
 * @param {{}} response - JSON object containing data from CCL data retrieval script
 * @returns {undefined} - undefined
 */
NewOrdersCPMComponent.prototype.processOrderOptionsData = function(response){
    var orderController = this.getOrderController();
    //Clear any suggested orders/folders before processing.
    orderController.setFolderList(null);
    orderController.setSuggestedOrders(null);
    orderController.setSuggestedFolders(null);
    orderController.setTriggeringNomenclature(this.getTriggeringNomenclature());
    var folderList = orderController.getFolderList();
    var suggestedOrdersList = orderController.getSuggestedOrders();
    var suggestedFoldersList = orderController.getSuggestedFolders();
    var folder;
    var parent;
    var pLen;
    var i;

    if (!response){
        return;
    }

    if (response.VENUE_TYPE_LIST){
        orderController.setVenueTypeList(response.VENUE_TYPE_LIST);
    }
    parent = response.PARENT || [];
    pLen = parent.length;
    for (i = 0; i < pLen; i++){
        folder = new this.OrderFolder();
        folder.importFolder(parent[i], null, this.getCurrentVenueType());
        folderList.push(folder);
        suggestedOrdersList.push.apply(suggestedOrdersList, folder.getSuggestedOrders());
        if (folder.m_recommendInd){
            suggestedFoldersList.push(folder);
            folderList.pop();
        }
        suggestedFoldersList.push.apply(suggestedFoldersList, folder.getSuggestedFolders());
    }
};

/**
 * Refreshes the component, calling the data retrieval script with the passed in venue type
 * @param {Number} venueType - Number representing the venueType
 * @returns {undefined} - undefined
 */
NewOrdersCPMComponent.prototype.handleVenueTypeClick = function(venueType){
    var self = this;
    var orderController = this.getOrderController();
    orderController.setCurrentVenueValue(venueType);
    this.setCurrentVenueType(venueType);
    $("#" + orderController.getId() + "OCExplorerContainer").html("<div class='cpm-tab-loading-cont'><p class='loading-spinner'></p></div></div>");
    this.cclGetOrders(function(scriptReply){
        self.handleOrderOptionsReply(scriptReply);
    });
};

/**
 * Handles the reply from the data retrieval script
 * Based on the reply's status, will either process the response and render, or display an error or no results found
 * @param {ScriptReply} reply - ScriptReply object from CCL data retrieval script
 * @returns {undefined} - undefined
 */
NewOrdersCPMComponent.prototype.handleOrderOptionsReply = function(reply){
    var response;
	var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

    if (!reply){
        this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), "Component Data Retrieval Failed"), "");
        return;
    }

    if (reply.getStatus() === "S"){
        response = reply.getResponse();
        this.processOrderOptionsData(response);
        this.renderComponent();
    } else if (reply.getStatus() === "Z"){
        this.finalizeComponent("<span class='res-none'>" + cpmDocI18n.NO_RESULTS_FOUND + "</span>", "");
    } else {
        this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), "Component Data Retrieval Failed"), "");
    }
};

/**
 * Calls the CCL data retrieval script, then executes the callback method
 * @param {function} callback - callback function to execute once data retrieval script has completed
 * @returns {undefined} - undefined
 */
NewOrdersCPMComponent.prototype.cclGetOrders = function(callback){
    var self = this;
    var criterion = this.getCriterion();
    var sendAr = [];
    var request;
    var altSelCatIdList = this.getAltSelCatIdList();
    var altSelCatIdsParam = (altSelCatIdList.length) ? MP_Util.CreateParamArray(altSelCatIdList, 1) : "0.0";

    sendAr.push(
        "^MINE^"
        , criterion.person_id + ".0"
        , criterion.encntr_id + ".0"
        , criterion.provider_id + ".0"
        , this.getConceptCd() + ".0" //Concept CD
        , this.m_conceptGroupCd + ".0" //Concept Group CD
        , this.getIntentionCd() + ".0" //Intention CD
        , altSelCatIdsParam
        , "^" + this.getOcId() + "^" //Used to identify suggested orders through treatment assessment.
        , this.getCurrentVenueType()
    );

    request = new MP_Core.ScriptRequest(this, "ENG:NewOrdersCPMComponent_GetOrders");
    request.setParameters(sendAr);
    request.setName("getOrderOptions");
    request.setProgramName("cpm_get_orders_flex");
    request.setAsync(true);

    MP_Core.XmlStandardRequest(this, request, function(reply){
        callback.apply(self, [reply]);
    });
};

/**
 * Calls CCL data retrieval script
 * Triggered by the architecture
 * @override
 * @returns {undefined} - undefined
 */
NewOrdersCPMComponent.prototype.retrieveComponentData = function(){
    var self = this;
    this.cclGetOrders(function(reply){
        self.handleOrderOptionsReply(reply);
    });
};

/**
 * Handles the rendering of the component, and attaching event listeners
 * @override
 * @returns {undefined} - undefined
 */
NewOrdersCPMComponent.prototype.renderComponent = function(){
    try {
        var orderController = this.getOrderController();
        var html = "";

        html += orderController.buildExplorerHtml();
        this.finalizeComponent(html, "");
        orderController.attachExplorerNavEvents();
        orderController.attachExplorerContentEvents();
    } catch (err){
        MP_Util.logJSError(err, this, "new-order-cpm.js", "renderComponent");
        throw err;
    }
};

(function(){
    /**
     * Gets the scratchpad shared resource
     * Will create the shared resource if it doesn't already exist
     * @returns {SharedResource} - scratchpad shared resource
     */
    var getScratchpadSharedResource = function(){
        var sharedResourceName = "scratchpadSR";
        var scratchpadSharedResource = MP_Resources.getSharedResource(sharedResourceName);
        var dataObj = {};
        var listenerObj = {};
        //Check if the resource exists (very likely if component inside of a viewpoint)
        if (scratchpadSharedResource){
            return scratchpadSharedResource;
        }

        //Create resource since it doesn't exist yet
        scratchpadSharedResource = new SharedResource(sharedResourceName);
        dataObj.scratchpadObjArr = [];
        scratchpadSharedResource.setIsAvailable(true);
        scratchpadSharedResource.setResourceData(dataObj);
        scratchpadSharedResource.setEventListenerObject(listenerObj);
        scratchpadSharedResource.setEventListenerFlag(EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE);
        MP_Resources.addSharedResource(sharedResourceName, scratchpadSharedResource);
        return scratchpadSharedResource;
    };

    /**
     * OrderFolder Class
     * @constructor
     */
    var OrderFolder = function(){
        this.m_listType = 0;
        this.m_categoryId = 0;
        this.m_description = "";
        this.m_sequence = 0;
        this.m_catalogCd = 0;
        this.m_folderList = null;
        this.m_orderList = null;
        this.m_suggestedOrders = null;
        this.m_suggestedFolders = null;
        this.m_parentFolder = null;

        //Flags/Reasons
        this.m_hideInd = 0;
        this.m_openInd = 0;
        this.m_recommendInd = 0;
        this.m_hideReason = "";
        this.m_openReason = "";
        this.m_recommendReason = "";

        //Dynatree variables
        this.title = "";
        this.children = [];
        this.isFolder = true;
        this.hideCheckbox = true;
        this.unselectable = false;
        this.expand = false;
    };

    /**
     * Gets the list type of the object
     * 1 - Order Folder, 2 - Order Option
     * @returns {number} - the list type
     */
    OrderFolder.prototype.getListType = function(){
        return this.m_listType;
    };

    /**
     * Gets the Category Id
     * This is the folder's ID (alt_sel_cat)
     * @returns {number} - the category id
     */
    OrderFolder.prototype.getCategoryId = function(){
        return this.m_categoryId;
    };

    /**
     * Sets the Category Id
     * Throws an error if the id is not a number.
     * @param {number} id - category id (alt_sel_cat)
     * @returns {undefined} - undefined
     */
    OrderFolder.prototype.setCategoryId = function(id){
        if (typeof id !== "number"){
            throw new Error("Type Error: Non-number 'id' passed into 'OrderFolder' method 'setCategoryId'");
        }
        this.m_categoryId = id;
    };

    /**
     * Gets the array of child suggested folders.
     * Child suggested folders will populate the array regardless of how many levels deep they reside.
     * @returns {Array} - Array of child suggested folders
     */
    OrderFolder.prototype.getSuggestedFolders = function(){
        if (!this.m_suggestedFolders){
            this.m_suggestedFolders = [];
        }
        return this.m_suggestedFolders;
    };

    /**
     * Gets the array of child suggested orders
     * Child suggested orders will populate the array regardless of how many levels deep they reside.
     * @returns {Array} - Array of child suggested orders
     */
    OrderFolder.prototype.getSuggestedOrders = function(){
        if (!this.m_suggestedOrders){
            this.m_suggestedOrders = [];
        }
        return this.m_suggestedOrders;
    };

    /**
     * Gets the folder's description
     * The description is what should be used when showing the folder's label face-up
     * @returns {string} - folder description
     */
    OrderFolder.prototype.getDescription = function(){
        return this.m_description;
    };

    /**
     * Sets the folder's description
     * Throws an error if the description is not a string
     * @param {string} desc - folder's description
     * @returns {undefined} - undefined
     */
    OrderFolder.prototype.setDescription = function(desc){
        if (typeof desc !== "string"){
            throw new Error("Type Error: Non-string 'desc' passed into 'OrderFolder' method 'setDescription'");
        }
        this.m_description = desc;
    };

    /**
     * Gets the folder's sequence
     * The sequence may be used to 'sort' the items in an array.
     * @returns {number} - folder's sequence
     */
    OrderFolder.prototype.getSequence = function(){
        return this.m_sequence;
    };

    /**
     * Sets the folder's sequence
     * Throws an error if sequenced passed in is not a number.
     * @param {number} num - the folder's sequence
     * @returns {undefined} - undefined
     */
    OrderFolder.prototype.setSequence = function(num){
        if (typeof num !== "number"){
            throw new Error("Type Error: Non-number 'num' passed into 'OrderFolder' method 'setSequence'");
        }
        this.m_sequence = num;
    };

    /**
     * Returns true if the folder is expanded, false otherwise.
     * This should be used when determining the visual state of the folder.
     * @returns {boolean} - is the folder expanded
     */
    OrderFolder.prototype.isExpanded = function(){
        return this.expand;
    };

    /**
     * Sets the folder's isExpanded flag
     * This should be used when setting the visual state of the folder.
     * @param {boolean} flag - true if expanded, false otherwise
     * @returns {undefined} - undefined
     */
    OrderFolder.prototype.setIsExpanded = function(flag){
        this.expand = flag;
    };

    /**
     * Gets the array of child folders
     * The array will be populated with immediate children only.
     * @returns {Array} - array of child folders
     */
    OrderFolder.prototype.getChildFolderList = function(){
        if (!this.m_folderList){
            this.m_folderList = [];
        }
        return this.m_folderList;
    };

    /**
     * Sets the array of folders
     * Most common use case would be setting to null.
     * @param {null|Array} list - null or array of child folders
     * @returns {undefined} - undefined
     */
    OrderFolder.prototype.setChildFolderList = function(list){
        this.m_folderList = list;
    };

    /**
     * Gets the array of Order Options contained in the folder
     * Does not include orders in child folders.
     * @returns {Array} - array of orders options
     */
    OrderFolder.prototype.getOrdersList = function(){
        if (!this.m_orderList){
            this.m_orderList = [];
        }
        return this.m_orderList;
    };

    /**
     * Sets the array of Order Options contained in the folder
     * Most common use case would be setting to null.
     * @param {null|Array} list - null or array of order options
     * @returns {undefined} - undefined
     */
    OrderFolder.prototype.setOrdersList = function(list){
        this.m_orderList = list;
    };

    /**
     * Gets the HTML for a description column
     * This is required when wanting to show OrderFolder information in ComponentTable alongside other classes (i.e. OrderOption)
     * @returns {string} - Description Column HTML
     */
    OrderFolder.prototype.getDescColHtml = function(){
        var html = "";
        var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

        html += "<span class='order-controller-folder-ico' title='" + cpmDocI18n.FOLDER + "'>&nbsp;</span>";
        html += "<span class='order-controller-order-desc'>" + this.m_description + "</span>";
        return html;
    };

    /**
     * Gets the HTML for an order column
     * This is required when wanting to show OrderFolder information in ComponentTable alongside other classes (i.e. OrderOption)
     * @returns {string} - Order Column HTML
     */
    OrderFolder.prototype.getOrderColHtml = function(){
        var html = "";
        var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

        html += "<a href='#' class='order-controller-folder-expand' data-dynatree-key='" + this.key + "'>" + cpmDocI18n.OPEN_FOLDER + "</a>";
        return html;
    };

    /**
     * Gets the HTML for a reason column
     * This is required when wanting to show OrderFolder information in ComponentTable alongside other classes (i.e. OrderOption)
     * @returns {string} - Reason Column HTML
     */
    OrderFolder.prototype.getReasonColHtml = function(){
        return this.m_recommendReason;
    };

    /**
     * Gets the HTML for a Breadcrumb Column
     * This will create a breadcrumb starting with the parent folder, to the top-most parent folder.
     * The HTML contains a data-dynatree-key that can be used to reference the parent folder in a dynatree object
     * @returns {string} - Breadcrumb HTML
     */
    OrderFolder.prototype.getBreadcrumbColHtml = function(){
        var html = "";
        var bcList = [];
        var parentFolder = this.m_parentFolder;

        while (parentFolder){
            bcList.push("<span class='order-controller-bread-crumb-text' data-dynatree-key='" + parentFolder.key + "'>" + parentFolder.getDescription() + "</span>");
            parentFolder = parentFolder.m_parentFolder;
        }
        bcList.reverse();
        html += bcList.join(" ... ");

        return html;
    };

    /**
     * Gets the array of ancestor folders
     * The array is sorted with the furthest ancestor first
     * @returns {Array} - list of ancestor folders
     */
    OrderFolder.prototype.getBreadcrumbArray = function(){
        var bcList = [];
        var parentFolder = this;
        while (parentFolder){
            bcList.push(parentFolder);
            parentFolder = parentFolder.m_parentFolder;
        }
        bcList.reverse();
        return bcList;
    };

    /**
     * Populates the OrderFolder instance based on the JSON passed in.
     * The JSON should have the same attributes as provided by the cpm_get_orders CCL script.
     * It is expected, but not required, that the JSON defines a root folder.
     * This method will also create any children folders/orders as defined by the JSON.
     * @param {Object} folderJson - JSON to populate the OrderFolder
     * @param {null|OrderFolder} parentOrderFolder - Null if this is a root folder, otherwise an instance of OrderFolder
     * @param {number} venueType
     * @returns {undefined} - undefined
     */
    OrderFolder.prototype.importFolder = function(folderJson, parentOrderFolder, venueType){
        this.m_sequence = folderJson.SEQUENCE || 0;
        this.m_categoryId = folderJson.CATEGORY_ID;
        this.m_description = folderJson.DESCRIPTION;
        this.m_catalogCd = folderJson.CATALOG_CD || 0;
        this.m_listType = folderJson.LIST_TYPE || 1;
        var ordersList = this.getOrdersList();
        var childFolderList = this.getChildFolderList();
        var suggestedOrdersList = this.getSuggestedOrders();
        var suggestedFoldersList = this.getSuggestedFolders();
        var orderOption;
        var i;
        //Children to be displayed in dynatree must be referenced by this.children
        var dynatreeChildren = this.children;

        //Flags/reasons
        this.m_openInd = folderJson.OPEN_IND || 0;
        this.m_hideInd = folderJson.HIDE_IND || 0;
        this.m_recommendInd = folderJson.RECOMMEND_IND || 0;
        this.m_openReason = folderJson.OPEN_REASON || "";
        this.m_hideReason = folderJson.HIDE_REASON || "";
        this.m_recommendReason = folderJson.RECOMMEND_REASON || "";
        this.title = folderJson.DESCRIPTION;

        //Check if it has children
        if (folderJson.CHILD && folderJson.CHILD.length){
            var children = folderJson.CHILD;
            var cLen = children.length;
            for (i = 0; i < cLen; i++){
                var child = children[i];
                //Check if the child is another folder
                if (child.LIST_TYPE === 1){ //Should eventually base this check on the LIST_TYPE
                    var folder = new OrderFolder();
                    child.CHILD = child.SYNONYMS;
                    folder.importFolder(child, this, venueType);
                    if (folder.m_hideInd){
                        continue;
                    }
                    if(!folder.m_recommendInd){
                        childFolderList.push(folder);
                    }
                    dynatreeChildren.push(folder);
                } else if (child.LIST_TYPE > 1) {
                    //This was an order
                    orderOption = new OrderOption();
                    orderOption.importData(child, this);
                    orderOption.setVenue(venueType);
                    if (orderOption.m_hideInd){
                        continue; //We don't add hidden orders to the tree
                    }
                    if (orderOption.m_recommendInd){
                        //Move recommended to the top of the folder
                        ordersList.splice(0, 0, orderOption);
                        dynatreeChildren.splice(0, 0, orderOption);
                        suggestedOrdersList.push(orderOption);
                    } else {
                        ordersList.push(orderOption);
                        dynatreeChildren.push(orderOption);
                    }
                }
            }
        }

        if (suggestedOrdersList.length){
            //suggested orders exist, so don't expand the folder
            this.setIsExpanded(false);
        }

        //Propagates suggested children to the parent
        if (parentOrderFolder){
            this.m_parentFolder = parentOrderFolder;
            parentOrderFolder.setIsExpanded(this.isExpanded());
            var parentSuggestedOrders = parentOrderFolder.getSuggestedOrders();
            parentSuggestedOrders.push.apply(parentSuggestedOrders, suggestedOrdersList);
            var parentSuggestedFolders = parentOrderFolder.getSuggestedFolders();
            if (this.m_recommendInd){
                parentSuggestedFolders.push(this);
            }
            parentSuggestedFolders.push.apply(parentSuggestedFolders, suggestedFoldersList);
        }
    };

    /**
     * OrderOption Class
     * @constructor
     */
    var OrderOption = function(){
        this.m_listType = 0;
        this.m_sequence = 0;
        this.m_synonymId = 0;
        this.m_synonym = "";
        this.m_sentenceId = 0;
        this.m_sentence = "";
        this.m_commentId = 0;
        this.m_sentenceComment = "";
        this.m_pathCatId = 0;
        this.m_pathCatSynId = 0;
        this.m_pathCatSynName = "";
        this.m_planDescription = "";
        this.m_catalogCd = 0;
        this.m_orderableTypeFlag = 0;
        this.m_pendingState = 0;
        this.m_parentFolder = null;

        //Flags/Reasons
        this.m_hideInd = 0;
        this.m_openInd = 0;
        this.m_recommendInd = 0;
        this.m_hideReason = "";
        this.m_openReason = "";
        this.m_recommendReason = "";
        this.m_dupFlag = 0;
        this.m_allergyFlag = 0;
        this.m_drugFlag = 0;
        this.m_mnrFlag = 0;
        this.m_modFlag = 0;
        this.m_sevFlag = 0;
        this.m_table_id = "";
        this.m_hasInteraction = false;
        this.m_venue = 0;
        //Dynatree variables
        this.title = "";
        this.children = [];
        this.isFolder = false;
        this.hideCheckbox = false;
        this.icon = false;
        this.unselectable = false;
    };

    /**
     * Enumeration of OrderOption 'ordered' states
     * These correspond to where the OrderOption is with relation to the Scratchpad.
     * @type {{UNORDERED: number, ORDERED: number}}
     */
    OrderOption.STATES = {
        "UNORDERED": 1
        , "ORDERED": 2
    };

    /**
     * Gets the list type of the object
     * 1 - Order Folder, 2 - Order Option
     * @returns {number} - the list type
     */
    OrderOption.prototype.getListType = function(){
        return this.m_listType;
    };

    /**
     * Gets the venue for Order Option
     * @returns {number} - venue
     */
    OrderOption.prototype.getVenue = function(){
        return this.m_venue;
    };

    /**
     * sets the venue for Order Option
     * @param {number} venue - the order option's venue
     * @returns {undefined} - undefined
     */
    OrderOption.prototype.setVenue = function(venue){
        this.m_venue = venue;
    };

    /**
     * Gets the order options's sequence
     * The sequence may be used to 'sort' the items in an array.
     * @returns {number} - order option's sequence
     */
    OrderOption.prototype.getSequence = function(){
        return this.m_sequence;
    };

    /**
     * Sets the order option's sequence
     * Throws an error if sequenced passed in is not a number.
     * @param {number} num - the order option's sequence
     * @returns {undefined} - undefined
     */
    OrderOption.prototype.setSequence = function(num){
        if (typeof num !== "number"){
            throw new Error("Type Error: Non-number 'num' passed into 'OrderOption' method 'setSequence'");
        }
        this.m_sequence = num;
    };

    /**
     * Indicates if the OrderOption has had an interaction found.
     * @returns {boolean} - Returns true if interactions exist, false otherwise
     */
    OrderOption.prototype.hasInteraction = function(){
        return this.m_hasInteraction;
    };

    /**
     * Sets the OrderOption's Interaction indication.
     * @param {boolean} hasInteraction - True if OrderOption has interactions, false otherwise.
     * @returns {undefined} - undefined
     */
    OrderOption.prototype.setHasInteraction = function(hasInteraction){
        this.m_hasInteraction = hasInteraction;
    };

    /**
     * Gets the order option's pending state
     * The pending state refers to the state of the Order Option with relation to the Scratchpad
     * @returns {number} - Enumeration of the OrderOption's pending state
     */
    OrderOption.prototype.getPendingState = function(){
        return this.m_pendingState;
    };

    /**
     * Sets the order option's pending state
     * The pending state refers to the state of the Order Option with relation to the Scratchpad
     * Passed in state should exist in OrderOption.prototype.STATES
     * Throws an error if passed in state is not a number.
     * @param {number} state -The OrderOption's pending state
     * @returns {undefined} - undefined
     */
    OrderOption.prototype.setPendingState = function(state){
        if (typeof state !== "number"){
            throw new Error("Type Error: Non-number 'state' passed into 'OrderOption' method 'setPendingState'");
        }
        this.m_pendingState = state;
    };

    /**
     * Returns the appropriate type for the order option
     * 0 - order, 1 - careset, 2 - powerplan
     * @returns {number} - order option type
     */
    OrderOption.prototype.getFavoriteType = function(){
        /*
         0 - order
         1 - careset
         2 - powerplan
         */
        var favType = 0;
        if (this.m_pathCatId){
            favType = 2;
        } else if (this.m_orderableTypeFlag === 6){
            favType = 1;
        }
        return favType;
    };

    /**
     * Returns the appropriate synonym id
     * Accounts for the type of the order option.
     * @returns {string} - Text representation of the synonym id in decimal form.
     */
    OrderOption.prototype.getFavSynonymId = function(){
        var favType = this.getFavoriteType();
        return (favType === 2) ? this.m_pathCatId + ".0" : this.m_synonymId + ".0";
    };

    /**
     * Creates an object the Scratchpad can use that represents the OrderOption
     * @param {number|string} compId - component id
     * @param {number} sNomenId - Nomenclature ID to associate to the scratchpad object
     * @returns {Object} - Scratchpad object representation of OrderOption
     */
    OrderOption.prototype.createScratchpadObj = function(compId, sNomenId){
        var scratchpadObj = {};
        var favType = this.getFavoriteType();
        var favId = (favType === 2) ? this.m_pathCatId : this.m_synonymId;
        var favNomenId = sNomenId || "";
        scratchpadObj.componentId = compId;
        scratchpadObj.addedFrom = "OrderOption";
        scratchpadObj.favType = favType; //0 - Order, 1 - Careset, 2 - PowerPlan
        scratchpadObj.favName = (favType === 2) ? this.m_pathCatSynName : this.m_synonym;
        scratchpadObj.favOrderSentDisp = (favType !== 2) ? this.m_sentence : "";
        scratchpadObj.favSynId = this.getFavSynonymId();
        scratchpadObj.favSentId = (favType === 2) ? this.m_pathCatSynId + ".0" : this.m_sentenceId + ".0";
        scratchpadObj.favNomenIds = favNomenId;
        //Set nulls for safety
        scratchpadObj.favId = "OrderOption" + compId + favId;
        scratchpadObj.favVenueType = (this.getVenue() === 2) ? 1 : 0;
        scratchpadObj.favOrdSet = (favType === 1) ? 6 : 0;
        scratchpadObj.favPPEventType = (favType === 2) ? 0 : null;
        scratchpadObj.favParam = (favType === 2) ? this.m_pathCatId + ".0|" + this.m_pathCatSynId + ".0" : this.m_synonymId + ".0|0|" + this.m_sentenceId + ".0";
        return scratchpadObj;
    };

    /**
     * Gets the HTML for a description column
     * This is required when wanting to show OrderOption information in ComponentTable alongside other classes (i.e. OrderFolder)
     * @returns {string} - Description Column HTML
     */
    OrderOption.prototype.getDescColHtml = function(){
        var html = "";
        var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

        if (this.hasInteraction()) {
            html += "<span class='order-controller-drug-ico'>&nbsp;</span>";
        }

        var favType = this.getFavoriteType();
        if (favType === 2){
            html += "<span class='order-controller-powerplan-ico' title='" + cpmDocI18n.POWER_PLAN + "'>&nbsp</span>";
        } else if (favType === 1){
            html += "<span class='order-controller-careset-ico' title='" + cpmDocI18n.CARE_SET + "'>&nbsp;</span>";
        }

        html += "<span class='order-controller-order-desc'>" + (favType === 2) ? this.m_pathCatSynName : this.m_synonym + "</span>";
        html += "<span class='order-controller-order-sentence'>" + this.m_sentence + "</span>";
        return html;
    };

    /**
     * Gets the HTML for a reason column
     * This is required when wanting to show OrderOption information in ComponentTable alongside other classes (i.e. OrderFolder)
     * @returns {string} - Reason Column HTML
     */
    OrderOption.prototype.getReasonColHtml = function(){
        return this.m_recommendReason;
    };

    /**
     * Gets the HTML for a breadcrumb column
     * This is required when wanting to show OrderOption information in ComponentTable alongside other classes (i.e. OrderFolder)
     * The HTML contains a data-dynatree-key that can be used to reference the parent folder in a dynatree object
     * @returns {string} - Breadcrumb HTML
     */
    OrderOption.prototype.getBreadcrumbColHtml = function(){
        var html = "";
        var bcList = [];
        var parentFolder = this.m_parentFolder;

        while (parentFolder){
            bcList.push("<span class='order-controller-bread-crumb-text' data-dynatree-key='" + parentFolder.key + "'>" + parentFolder.getDescription() + "</span>");
            parentFolder = parentFolder.m_parentFolder;
        }
        bcList.reverse();
        html += bcList.join(" ... ");
        return html;
    };

    /**
     * Gets the HTML for the OrderOption's dyntree title
     * @returns {string} - HTML representation of the dyntree title
     */
    OrderOption.prototype.getDynTreeTitleHtml = function(){
        var html = "";
        var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

        if (this.hasInteraction()){
            html += "<span class='order-controller-drug-ico' data-dynatree-key='" + this.key + "'>&nbsp;</span>";
        }

        var favType = this.getFavoriteType();
        if (favType === 2){
            html += "<span class='order-controller-powerplan-ico' title='" + cpmDocI18n.POWER_PLAN + "'>&nbsp</span>";
        } else if (favType === 1){
            html += "<span class='order-controller-careset-ico' title='" + cpmDocI18n.POWER_PLAN + "'>&nbsp;</span>";
        }

        if (this.m_recommendInd){
            html += "<span class='order-controller-suggested-order'>";
        }

        html += "<span id='" + this.m_synonymId + "_" + this.m_sentenceId + "' class='order-controller-order-desc'>" + ((favType === 2) ? this.m_pathCatSynName : this.m_synonym) + "</span>";
        html += "<span class='order-controller-order-sentence'>" + this.m_sentence + "</span>";

        if (this.m_recommendInd){
            html += "</span>";
        }

        return html;
    };

    /**
     * Gets the HTML for an order column
     * This is required when wanting to show OrderOption information in ComponentTable alongside other classes (i.e. OrderFolder)
     * @returns {string} - Order Column HTML
     */
    OrderOption.prototype.getOrderColHtml = function(){
        var pendingState = this.getPendingState();
        var btnText = "";
        var html = "";
        var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

        if (pendingState === OrderOption.STATES.ORDERED){
            btnText = cpmDocI18n.REMOVE_BUTTON;
        } else if (pendingState === OrderOption.STATES.UNORDERED){
            btnText = cpmDocI18n.ORDER_BUTTON;
        } else {
            btnText = cpmDocI18n.DISABLED_BUTTON;
        }

        html += "<button class='order-controller-order-btn'>" + btnText + "</button>";
        return html;
    };

    /**
     * Sets the pending state of the OrderOption on initial load.
     * This will check the Scratchpad to see if the order option has already been placed there.
     * @returns {undefined} - undefined
     */
    OrderOption.prototype.initializePendingState = function(){
        var scratchpadSharedResource = getScratchpadSharedResource();
        var dataObj;
        var orderedState = OrderOption.STATES.ORDERED;
        var unorderedState = OrderOption.STATES.UNORDERED;
        var scratchpadArray;
        var sLen;
        var i;

        //Default state
        this.setPendingState(unorderedState);
        //Ensure we have the scratchpad shared resource
        if (!scratchpadSharedResource){
            throw new Error("Runtime Error: Failed to create or retrieve scratchpad shared resource in 'OrderOption' method 'initializePendingStates'");
        }
         dataObj = scratchpadSharedResource.getResourceData();
        if (!dataObj){
            return;
        }

        scratchpadArray = dataObj.scratchpadObjArr;
        if (scratchpadArray && scratchpadArray.length){
            var favVenue = (this.getVenue() === 2) ? 2 : 1;
            sLen = scratchpadArray.length;
            //Iterate through scratchpad orders
            for (i = 0; i < sLen; i++){
                if (scratchpadArray[i].favSynId === this.getFavSynonymId()
                		&& scratchpadArray[i].favSentId === (this.m_sentenceId + ".0")
                		&& scratchpadArray[i].favVenueType === favVenue){
                    //Match found, set state to ordered
                    this.setPendingState(orderedState);
                    break;
                }
            }
        }
    };

    /**
     * Returns the HTML for the Interaction Checking hover
     * @returns {string} - HTML for interaction checking hover
     */
    OrderOption.prototype.showInteractionCheckingHover = function(){
        var html = "";
        var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

        html += "<div class='hvr order-controller-hvr'>";
        html += "<div>";
        html += "<dl>";
        html += "<dt><span class='order-controller-bold order-controller-size'>" + this.m_synonym + "</span></dt>";
        html += "<dt><span class='order-controller-bold'>" + cpmDocI18n.INTERACTIONS + ":</span></dt>";
        if (this.m_mnrFlag == 1) {
            html += "<dt><span><span class='order-controller-minor-ico'>&nbsp;</span><span>" + cpmDocI18n.MINOR_DRUG_INTERACTION + "</span></span></dt>";
        }
        if (this.m_modFlag == 1) {
            html += "<dt><span><span class='order-controller-moderate-ico'>&nbsp;</span><span>" + cpmDocI18n.MODERATE_DRUG_INTERACTION + "</span></span></dt>";
        }
        if (this.m_sevFlag == 1) {
            html += "<dt><span><span class='order-controller-severe-ico'>&nbsp;</span><span>" + cpmDocI18n.SEVERE_DRUG_INTERACTION + "</span></span></dt>";
        }
        if (this.m_dupFlag == 1) {
            html += "<dt><span><span class='order-controller-dup-ico'>&nbsp;</span><span>" + cpmDocI18n.DUPLICATE_THERAPY_INTERACTION + "</span></span></dt>";
        }
        if (this.m_allergyFlag == 1 || this.m_drugFlag == 1) {
            html += "<dt><span><span class='order-controller-allergic-ico'>&nbsp;</span><span>" + cpmDocI18n.DRUG_ALLERGY_INTERACTION + "</span></span></dt>";
        }
        html += "</div>";
        html += "</dl>";
        html += "</div>";
        return html;
    };

    /**
     * Populates the OrderOption instance based on the JSON passed in.
     * The JSON should have the same attributes as provided by the cpm_get_orders CCL script.
     * @param {Object} orderOptJson - JSON to populate the OrderOption
     * @param {OrderFolder} orderFolder - (Optional) the parent folder containing the OrderOption
     * @returns {undefined} - undefined
     */
    OrderOption.prototype.importData = function(orderOptJson, orderFolder){
        if (!orderOptJson || orderOptJson.LIST_TYPE === 1){
            return;
        }

        this.m_sequence = orderOptJson.SEQUENCE;
        this.m_listType = orderOptJson.LIST_TYPE;
        this.m_synonymId = orderOptJson.SYNONYM_ID;
        this.m_synonym = orderOptJson.SYNONYM;
        this.m_sentenceId = orderOptJson.SENTENCE_ID;
        this.m_sentence = orderOptJson.SENTENCE;
        this.m_commentId = orderOptJson.COMMENT_ID;
        this.m_sentenceComment = orderOptJson.SENTENCE_COMMENT;
        this.m_pathCatId = orderOptJson.PATH_CAT_ID;
        this.m_pathCatSynId = orderOptJson.PATH_CAT_SYN_ID;
        this.m_pathCatSynName = orderOptJson.PATH_CAT_SYN_NAME;
        this.m_planDescription = orderOptJson.PLAN_DESCRIPTION;
        this.m_catalogCd = orderOptJson.CATALOG_CD;
        this.m_orderableTypeFlag = orderOptJson.ORDERABLE_TYPE_FLAG;
        this.m_parentFolder = orderFolder;

        //Flags/reasons
        this.m_openInd = orderOptJson.OPEN_IND || 0;
        this.m_hideInd = orderOptJson.HIDE_IND || 0;
        this.m_recommendInd = orderOptJson.RECOMMEND_IND || 0;
        this.m_openReason = orderOptJson.OPEN_REASON || "";
        this.m_hideReason = orderOptJson.HIDE_REASON || "";
        this.m_recommendReason = orderOptJson.RECOMMEND_REASON || "";

        this.initializePendingState();
        this.title = this.getDynTreeTitleHtml();
    };

    /**
     * OrderController Class
     * The OrderController handles DOM/Event manipulations based on its models (OrderFolder/OrderOption)
     * @param {string|number} id - should be unique in the context of the DOM
     * @param {Object} criterion - MPage Criterion object
     * @constructor
     */
    var OrderController = function(id, criterion){
        this.m_id = id || "orderController";
        this.criterion = criterion;
        this.m_folderList = null;
        this.m_tableList = null;
        this.m_suggestedOrders = null;
        this.m_suggestedFolders = null;
        this.m_dynaTree = null;
        this.m_dynaTreeDOM = null;
        this.m_triggeringNomenclature = 0;
        this.m_folderMap = null;
        this.m_orderMap = null;
        this.m_venueTypeList = null;
        this.m_idToVenueMap = null;
        this.m_venueSelectionClickFunction = null;
        this.m_currentVenueValue = null;
        this.m_wasVenueClicked = false;
        this.m_selectedFolderCategoryId = null;
        this.m_conceptCd = null;
    };

    OrderController.prototype.wasVenueClicked = function(){
        return this.m_wasVenueClicked;
    };

    OrderController.prototype.setWasVenueClicked = function(flag){
        this.m_wasVenueClicked = flag;
    };

    OrderController.prototype.getSelectedFolderCategoryId = function(){
        return this.m_selectedFolderCategoryId;
    };

    OrderController.prototype.setSelectedFolderCategoryId = function(id){
        this.m_selectedFolderCategoryId = id;
    };

    OrderController.prototype.getCurrentVenueValue = function(){
        return this.m_currentVenueValue;
    };

    OrderController.prototype.setCurrentVenueValue = function(val){
        this.m_currentVenueValue = val;
    };

	OrderController.prototype.getCriterion = function(){
		return this.criterion;
	};

    OrderController.prototype.getVenueSelectionClickFunction = function(){
        return this.m_venueSelectionClickFunction;
    };

    OrderController.prototype.setVenueSelectionClickFunction = function(callback){
        if (typeof callback === "function"){
            this.m_venueSelectionClickFunction = callback;
        } else {
            this.m_venueSelectionClickFunction = null;
        }
    };

    OrderController.prototype.getIdToVenueMap = function(){
        if (!this.m_idToVenueMap){
            this.m_idToVenueMap = {};
        }
        return this.m_idToVenueMap;
    };

    OrderController.prototype.setIdToVenueMap = function(map){
        this.m_idToVenueMap = map;
    };

    OrderController.prototype.getVenueTypeList = function(){
        return this.m_venueTypeList;
    };

    OrderController.prototype.setVenueTypeList = function(list){
        this.m_venueTypeList = list;
    };

    OrderController.prototype.getFolderMap = function(){
        if (!this.m_folderMap){
            this.m_folderMap = {};
        }
        return this.m_folderMap;
    };

    OrderController.prototype.setFolderMap = function(map){
        this.m_folderMap = map;
    };

    OrderController.prototype.getOrderMap = function(){
        if (!this.m_orderMap){
            this.m_orderMap = {};
        }
        return this.m_orderMap;
    };

    OrderController.prototype.setOrderMap = function(map){
        this.m_orderMap = map;
    };

    OrderController.prototype.setTriggeringNomenclature = function(nomenclatureId){
        this.m_triggeringNomenclature = nomenclatureId;
    };

    OrderController.prototype.getTriggeringNomenclature = function(){
        return this.m_triggeringNomenclature;
    };

    /**
     * Gets the controller's ID
     * @returns {string|number} - id
     */
    OrderController.prototype.getId = function(){
        return this.m_id;
    };

    /**
     * Gets the controller's array of folders
     * The array of folders will contain root folders only.
     * @returns {Array<OrderFolder>} - array of OrderFolders
     */
    OrderController.prototype.getFolderList = function(){
        if (!this.m_folderList){
            this.m_folderList = [];
        }
        return this.m_folderList;
    };

    /**
     * Sets the controller's array of folders
     * Most common use case is to set the folder list to null.
     * @param {null|Array<OrderFolder>} list - null or array of OrderFolders
     * @returns {undefined} - undefined
     */
    OrderController.prototype.setFolderList = function(list){
        this.m_folderList = list;
    };

    OrderController.prototype.getTableList = function(){
        if (!this.m_tableList){
            this.m_tableList = [];
        }
        return this.m_tableList;
    };

    /**
     * Gets the controller's array of suggested orders
     * @returns {Array<OrderOption>} - array of suggested orders
     */
    OrderController.prototype.getSuggestedOrders = function(){
        if (!this.m_suggestedOrders){
            this.m_suggestedOrders = [];
        }
        return this.m_suggestedOrders;
    };

    /**
     * Sets the controller's array of suggested orders
     * Most common use case is to set the suggested order list to null.
     * @param {null|Array<SuggestedOrders>} list - null or array of Orders
     * @returns {undefined} - undefined
     */
	OrderController.prototype.setSuggestedOrders = function(value){
		this.m_suggestedOrders = value;
		return this.m_suggestedOrders;
	};

    /**
     * Gets the controller's array of suggested folders
     * @returns {Array<OrderFolder>} - array of suggested folders
     */
    OrderController.prototype.getSuggestedFolders = function(){
        if (!this.m_suggestedFolders){
            this.m_suggestedFolders = [];
        }
        return this.m_suggestedFolders;
    };

    /**
     * Sets the controller's array of suggested folders
     * Most common use case is to set the suggested folder list to null.
     * @param {null|Array<SuggestedOrderFolder>} list - null or array of OrderFolders
     * @returns {undefined} - undefined
     */
    OrderController.prototype.setSuggestedFolders = function(value){
		this.m_suggestedFolders = value;
        return this.m_suggestedFolders;
    };
    
    /**
     *Sets the controllers conceptCd from the CPM component
     * @param conceptCd of parent CPM component
     * @returns {undefined} - undefined
     */
    OrderController.prototype.setConceptCd = function(conceptCd){
        this.m_conceptCd = conceptCd;
    };
    
    /**
     *Gets the conceptCd that was from the parent CPM object
     * @returns conceptCd
     */
    OrderController.prototype.getConceptCd = function(){
        return this.m_conceptCd;
    };

    /**
     * Updates an OrderOption HTML Button
     * Expected to be called by other OrderController methods.
     * @param {OrderOption} orderOption - Order Option to update
     * @param {jQuery} jqButton - jQuery Object containing the Order Option's 'Order' button
     * @returns {undefined} - undefined
     */
    OrderController.prototype.updateOrderOptionButton = function(orderOption, jqButton){
        var pendingState = orderOption.getPendingState();
        var states = OrderOption.STATES;
        var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

        if (pendingState === states.UNORDERED){
            //Update button text to "Order" since the order has not been 'ordered'
            jqButton.text(cpmDocI18n.ORDER_BUTTON);
        } else if (pendingState === states.ORDERED){
            //Update button text to "Remove" since the order has been 'ordered'
            jqButton.text(cpmDocI18n.REMOVE_BUTTON);
        }
    };

    /**
	 *Fires a CAP timer if an order option is added to the scratchpad
     * @returns {undefined} - undefined
	 */
	OrderController.prototype.addOrderTimerTrigger = function(orderOption, conceptCode){
		var selectedFolderId = null;
		var favSynId = null;
		var favType = null;
		var favSentId = null;
		var suggestedFolders = null;
		var suggestedFolderIds = null;
		var synonym = 0.0;
		var sentenceId = 0.0;
		var suggestedOrders = null;
		var meta1 = null;
		var meta2 = null;
		var criterion = null;
		var category_mean = null;
		var timer = null;
		
		// meta 1 part 1
		// uses conceptCode
		
		// meta 1 part 2
		selectedFolderId = orderOption.m_parentFolder.m_categoryId;
				
		// meta 1 part 3
		favSynId = orderOption.getFavSynonymId();
		
		// meta 1 part 4
		favType = orderOption.getFavoriteType(); //0 - Order, 1 - Careset, 2 - PowerPlan
        favSentId = (favType === 2) ? orderOption.m_pathCatSynId + ".0" : orderOption.m_sentenceId + ".0";
		
		// meta 2 part 1
		// use conceptCode variable
		// meta 2 part 2
		suggestedFolders = this.getSuggestedFolders();
		suggestedFolderIds = [];
		var i;
		for(i = 0; i < suggestedFolders.length; ++i){
			suggestedFolderIds.push(suggestedFolders[i].m_categoryId);
		}
		suggestedOrders = this.getSuggestedOrders();
		
		if (suggestedOrders.length > 0){
			if (suggestedOrders[0].m_synonym){
				synonym = suggestedOrders[0].m_synonym;
			}
			if (suggestedOrders[0].m_sentenceId){
				sentenceId = suggestedOrders[0].m_sentenceId;
			}
		}
		
		// build metadata strings
		meta1 = conceptCode + "|" + selectedFolderId + "|" + favSynId + "|" + favSentId;
		meta2 = conceptCode + "|" + suggestedFolderIds+ "|" + synonym + "|" + sentenceId;
		
		criterion = this.getCriterion();
    	category_mean = criterion.category_mean;
		timer = new CapabilityTimer("CAP:MPG_CPM-O1_ITEM_ORDERED", category_mean);
		timer.addMetaData("rtms.legacy.metadata.1", meta1);
		timer.addMetaData("rtms.legacy.metadata.2", meta2);
		timer.capture();
	};

    /**
     * Adds or removes an order option from the Scratchpad
     * Throws an error if orderScratchpadObj resolves to false.
     * @param {Object} orderScratchpadObj - Scratchpad Data Object
     * @param {boolean} isRemoving - Set true to remove from scratchpad, false to add to scratchpad
     * @returns {undefined} - undefined
     */
    OrderController.prototype.addToOrRemoveFromScratchpad = function(orderScratchpadObj, isRemoving){
        var scratchpadSharedResource = getScratchpadSharedResource();
        var dataObj;
        var scratchpadArray;
        var scratchpadObj;
        var i;

        //Sanity checks
        if (!orderScratchpadObj){
            throw new Error("Type Error: 'orderScratchpadObj' passed into 'OrderController' method 'addToOrRemoveFromScratchpad' is invalid");
        }

        //Ensure we have the scratchpad shared resource
        if (!scratchpadSharedResource){
            throw new Error("Runtime Error: Failed to create or retrieve scratchpad shared resource in 'OrderController' method 'addToOrRemoveFromScratchpad'");
        }

        dataObj = scratchpadSharedResource.getResourceData();
        if (!dataObj){
            return;
        }
        scratchpadArray = dataObj.scratchpadObjArr;
        if (scratchpadArray){
            if (isRemoving){
                //Search through the array for our object
                i = scratchpadArray.length;
                while (i--){
                    scratchpadObj = scratchpadArray[i];
                    if (scratchpadObj.favSynId == orderScratchpadObj.favSynId && scratchpadObj.favSentId === orderScratchpadObj.favSentId){
                        scratchpadArray.splice(i, 1);
                        break;
                    }
                }
            } else {
                scratchpadArray.push(orderScratchpadObj);
            }
        }
        //Update data object TODO: Check if this is necessary
        dataObj.scratchpadObjArr = scratchpadArray;
        //Update shared resource
        MP_Resources.setSharedResourceData(scratchpadSharedResource.getName(), dataObj);
        //Notify consumers that the shared resource has been updated
        scratchpadSharedResource.notifyResourceConsumers();
    };

    /**
     * Adds or removes order option from scratchpad based on the order option's current relationship in the scratchpad
     * @param {OrderOption} orderOption - OrderOption to toggle
     * @returns {undefined} - undefined
     */
    OrderController.prototype.toggleOrderOptionInScratchpad = function(orderOption){
        var id = this.getId();
        var pendingState = orderOption.getPendingState();
        var states = OrderOption.STATES;
        var doRemove = true;
        var sNomenclatureId = (this.getTriggeringNomenclature()) ? this.getTriggeringNomenclature() + '' : '';

        if (pendingState === states.ORDERED) {
            //Add to scratchpad
            doRemove = false;
        }
        this.addToOrRemoveFromScratchpad(orderOption.createScratchpadObj(id, sNomenclatureId), doRemove);
    };

    /**
     *
     * @param orderOption
     */
    OrderController.prototype.togglePendingStateFor = function(orderOption){
        var states = OrderOption.STATES;
        var pendingState = orderOption.getPendingState();

        if (pendingState === states.ORDERED){
            orderOption.setPendingState(states.UNORDERED);
        } else if (pendingState === states.UNORDERED){
            orderOption.setPendingState(states.ORDERED);
        }
    };

    OrderController.prototype.checkForInteractions = function(orderOptsList){
        if (!window.external || !window.external.DiscernObjectFactory){
            return;
        }

        if (!InteractionChecking){
            return;
        }

        if (!orderOptsList || !orderOptsList.length){
            return;
        }

        //This method can return true even when DLL is not supported
        if (!InteractionChecking.GetisDllSupported()){
            return;
        }

        var personId = this.criterion.person_id;
        var synId;
        var synName;
        var sentDisp;
        var oLen = orderOptsList.length;
        var venueType = (this.getCurrentVenueValue() === 2) ? 2 : 1;
        var i;

        InteractionChecking.init();
        //Clear the medication count if there already is one
        if (InteractionChecking.GetMedicationCnt() > 0){
            InteractionChecking.ClearMedicationCollection();
        }

        for (i = 0; i < oLen; i++){
            //TODO: Handle caresets/powerplans
            var orderOpt = orderOptsList[i];
            if (orderOpt.getFavoriteType() !== 0){
                //0 - orders, all else likely can't be checked
                continue;
            }
            synId = orderOpt.getFavSynonymId();
            synName = orderOpt.m_synonym;
            sentDisp = orderOpt.m_sentence || "n/a";

            InteractionChecking.AddMedication(synId, synName, sentDisp, venueType);
        }
        if (!InteractionChecking.GetMedicationCnt()){
            return;
        }

        var interactions = InteractionChecking.CheckforInteractions(personId);
        if (!interactions){
            return;
        }
        this.setInteractionCheckingFlags(orderOptsList, interactions);
    };

    OrderController.prototype.setInteractionCheckingFlags = function(orderOptsList, interactionsList){
        if (!orderOptsList || !orderOptsList.length){
            return;
        }

        if (!interactionsList){
            return;
        }

        var interactionCheckingMeds = interactionsList.Medications;
        var icmLen = interactionCheckingMeds.length;
        var oLen = orderOptsList.length;
        var orderIndx;
        var medIndx;

        for (medIndx = 0; medIndx < icmLen; medIndx++){
            var med = interactionCheckingMeds[medIndx];

            for (orderIndx = 0; orderIndx < oLen; orderIndx++){
                var orderOpt = orderOptsList[orderIndx];
                if (orderOpt.getFavSynonymId() != med.synonym_id){
                    continue;
                }

                var medTypes = med.types;
                var tLen = medTypes.length;
                var typeIdx;
                var hasInteraction = false;

                for (typeIdx = 0; typeIdx < tLen; typeIdx++){
                    var type = medTypes[typeIdx];
                    var iType = type.InteractionType;
                    var severityLevel = type.SeverityLevel;

                    //Set the applicable flags based on Interaction Type
                    switch (iType){
                        case 0:
                            orderOpt.m_drugFlag = 1;
                            hasInteraction = true;
                            break;
                        case 1:
                        case 2:
                            orderOpt.m_allergyFlag = 1;
                            hasInteraction = true;
                            break;
                        case 3:
                            orderOpt.m_dupFlag = 1;
                            hasInteraction = true;
                            break;
                        default:
                            break;
                    }

                    //Set the applicable flags based on Severity Level
                    switch (severityLevel){
                        case 1:
                            orderOpt.m_mnrFlag = 1;
                            hasInteraction = true;
                            break;
                        case 2:
                            orderOpt.m_modFlag = 1;
                            hasInteraction = true;
                            break;
                        case 3:
                            orderOpt.m_sevFlag = 1;
                            hasInteraction = true;
                            break;
                        default:
                            break;
                    }
                }
                orderOpt.setHasInteraction(hasInteraction);
            }
        }
    };

    OrderController.prototype.buildVenueSectionHtml = function(){
        var DEFAULT_VENUE_VAL = 2;
        this.setIdToVenueMap(null);
        var idToVenueMap = this.getIdToVenueMap();
        var currentVenueVal = this.getCurrentVenueValue();
        var html = "";
        var i;
        var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

        //Venue selection section
        var venueTypeList = this.getVenueTypeList();
        if (venueTypeList && venueTypeList.length) {
            var vLen = venueTypeList.length;
            var hasSelectedVenue = false;
            html += "<div class='order-controller-exp-venue-sec' id='" + this.getId() + "VenueSelectionSection'>";
            html += "<div class='order-controller-exp-venue-inner'>" + cpmDocI18n.VENUE + ": ";
            for (i = 0; i < vLen; i++) {
                var id = this.getId() + "VenueItem" + i;
                var venueObj = venueTypeList[i];
                idToVenueMap[id] = venueObj;
                var selectedCss = "";
                var display = venueObj.DISPLAY || null;
                if (!display) {
                    continue;
                }
                if (currentVenueVal){
                    if (currentVenueVal === venueObj.SOURCE_COMPONENT_LIST[0].VALUE) {
                        selectedCss = " enabled";
                    }
                } else if (venueObj.SOURCE_COMPONENT_LIST[0].VALUE === DEFAULT_VENUE_VAL && !hasSelectedVenue) {
                    selectedCss = " enabled";
                    this.setCurrentVenueValue(DEFAULT_VENUE_VAL);
                    hasSelectedVenue = true;
                }
                html += "<span id='" + id + "' class='order-controller-venue-btn" + selectedCss + "'>" + display + "</span>";
            }
            html += "</div>";
            html += "</div>";
        }
        return html;
    };

    OrderController.prototype.venueSelectionClick = function(event){
        var idToVenueMap = this.getIdToVenueMap();
        var jqVenueButton = $(event.currentTarget);
        var venueSelectionClickFunc = this.getVenueSelectionClickFunction();
        var id = jqVenueButton.prop("id");
        var venueObj = idToVenueMap[id];

        if (!venueSelectionClickFunc || !venueObj || jqVenueButton.hasClass("enabled")){
            return;
        }
        //Need to remove 'enabled' class from all buttons
        $("#" + this.getId() + "VenueSelectionSection").find(".order-controller-venue-btn").removeClass("enabled");
        jqVenueButton.addClass("enabled");
        //Grab the venue value
        var venueVal = venueObj.SOURCE_COMPONENT_LIST[0].VALUE;
        //Add loading screen
        venueSelectionClickFunc(venueVal);
    };

    OrderController.prototype.populateExplorerContentSection = function(folder){
        if (!folder){
            return;
        }

        this.setOrderMap(null);
        var orderMap = this.getOrderMap();
        var jqExplorerContent = $("#" + this.getId() + "ExplorerContent");
        //Get immediate orders
        var orderList = folder.getOrdersList();
        var oLen = orderList.length;
        var i;
        var html = "";
        var orderHtmlId = this.getId() + "ExplorerContentItem_";
		var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

		//Venue selection section
        html += this.buildVenueSectionHtml();
        
        if (folder.m_recommendInd){
            html += "<div class='order-controller-exp-rec-folder order-controller-explorer-content-item'><span class='secondary-text'>" + cpmDocI18n.RECOMMENDED_REASON +"</span>" + folder.m_recommendReason + "</div>";
        }

        for (i = 0; i < oLen; i++){
            var order = orderList[i];
            var favType = order.getFavoriteType();
            var fullId = orderHtmlId + i;
            orderMap[fullId] = order;
            var pendingState = order.getPendingState();
            var btnText = "";

            if (pendingState === OrderOption.STATES.ORDERED){
                btnText = cpmDocI18n.REMOVE_BUTTON;
            } else if (pendingState === OrderOption.STATES.UNORDERED){
                btnText = cpmDocI18n.ORDER_BUTTON;
            } else {
                btnText = cpmDocI18n.DISABLED_BUTTON;
            }

            if (order.m_recommendInd && order.m_recommendReason){
                html += "<div class='order-controller-exp-rec-order'>" + order.m_recommendReason + "</div>";
            }

            html += "<div id='" + fullId + "' class='order-controller-explorer-content-item'>";

            if (order.hasInteraction()){
                html += "<span class='order-controller-drug-ico'>&nbsp;</span>";
            }
            if (favType === 2){
                html += "<span class='order-controller-powerplan-ico' title='" + cpmDocI18n.POWER_PLAN + "'>&nbsp;</span>";
            } else if (favType === 1){
                html += "<span class='order-controller-careset-ico' title='" + cpmDocI18n.CARE_SET + "'>&nbsp;</span>";
            }

            html += "<span class='order-controller-exp-cont-desc-col" + ((order.m_recommendInd) ? " order-controller-suggested-order" : "") + "'>";
            html += "<div class='order-controller-exp-cont-lbl'>" + ((favType === 2) ? order.m_pathCatSynName : order.m_synonym) + "</div>";
            html += "<div class='order-controller-exp-cont-sent secondary-text'>" + order.m_sentence + "</div>";
            html += "</span>";
            html += "<span class='order-controller-exp-cont-action-col'>";
            html += "<button class='order-controller-order-btn'>" + btnText + "</button>";
            html += "</span>";
            html += "</div>";
        }

        if (!oLen){
            html += "<div class='res-none'>" + cpmDocI18n.NO_ORDERS + "</div>";
        }

        jqExplorerContent.html(html);
    };

    OrderController.prototype.attachExplorerContentEvents = function(){
        var self = this;
        var controllerId = this.getId();
        var jqExplorerContentContainer = $("#" + controllerId + "ExplorerContent");

        var hoverTimeout = null;
        var tooltip = new MPageTooltip().setShowDelay(0);

        function routeTask(event){
            //Helper function to clear existing tooltips
            function clearTooltip(){
                if (tooltip.getContent()){
                    tooltip.getContent().remove();
                }
                if (hoverTimeout){
                    //Prevent 'sticky' hovers
                    clearTimeout(hoverTimeout);
                }
            }

            function showHover(jqIcon, orderOption, event){
                var posX = event.pageX;
                var posY = event.pageY;
                var content = orderOption.showInteractionCheckingHover();
                tooltip.setX(posX).setY(posY).setAnchor(jqIcon.get(0)).setContent(content);
                tooltip.show();
            }

            if (!event){
                return;
            }
            var eventType = event.type;
            var jqContentItem = $(event.currentTarget).closest(".order-controller-explorer-content-item");
            var jqSrcElement = $(event.target);

            //Grab the order based on the html id
            var orderMap = self.getOrderMap();
            var orderId = jqContentItem.prop("id");
            var order = orderMap[orderId];

            //safety check
            if (!order){
                return;
            }

            /*
             Order Button Click
             */
            if (eventType === "click" && jqSrcElement.hasClass("order-controller-order-btn")){
                self.togglePendingStateFor(order);
                self.toggleOrderOptionInScratchpad(order);
                var states = OrderOption.STATES;
                var pendingState = order.getPendingState();
                if (pendingState === states.ORDERED) {
                    //Add to scratchpad
                    // Trigger CAP timer
					var conceptCode = self.getConceptCd();
					self.addOrderTimerTrigger(order, conceptCode);
                }
                self.updateOrderOptionButton(order, jqSrcElement);
            }
            /*
             Drug Icon Hover
             */
            else if (eventType === "mouseenter" && jqSrcElement.hasClass("order-controller-drug-ico")){
                clearTooltip();
                hoverTimeout = setTimeout(function(){
                    showHover(jqSrcElement, order, event);
                }, 500);
            }
            /*
             Drug Icon Hover (Leave)
             */
            else if (eventType === "mouseleave" && jqSrcElement.hasClass("order-controller-drug-ico")){
                clearTooltip();
            }
        }
        jqExplorerContentContainer.on("click", ".order-controller-explorer-content-item", function(event){
            routeTask(event);
        });
        jqExplorerContentContainer.on("mouseenter mouseleave", ".order-controller-drug-ico", function(event){
            routeTask(event);
        });
        jqExplorerContentContainer.on("click", ".order-controller-venue-btn", function(event){
            self.venueSelectionClick(event);
        });
    };

    OrderController.prototype.attachExplorerNavEvents = function(){
        var self = this;
        var controllerId = this.getId();
        var jqExplorerNavBar = $("#" + controllerId + "ExplorerNavigationBar");
        var folderMap = this.getFolderMap();

        jqExplorerNavBar.on("click", "li", function(event){
            var jqTarget = $(event.currentTarget);//.css("background-color", "#acacac");
            var navId = jqTarget.prop("id");
            //We'll need to expand the folders, and show orders within current folder
            var jqChildFolders = jqTarget.children("ul");

            if (!jqTarget.hasClass("selected")){
                jqExplorerNavBar.find(".selected").removeClass("selected");
                jqTarget.addClass("selected");
                jqChildFolders.removeClass("hide");
                var folder = folderMap[navId];
                self.setSelectedFolderCategoryId(folder.getCategoryId());
                try{
                    self.checkForInteractions(folder.getOrdersList());
                } catch(err){
                    logger.logScriptCallError("Order Controller", "inn_util_interaction_checking.js", "new-order-cpm-o1.js", "attachExplorerNavEvents");
                } finally {
                    self.populateExplorerContentSection(folder);
                    Util.cancelBubble(event);
                    return false;
                }
            } else {
                if (jqChildFolders.hasClass("hide")){
                    jqChildFolders.removeClass("hide");
                } else {
                    jqChildFolders.addClass("hide");
                }
            }
            Util.cancelBubble(event);
            return false;
        });

        //Check if there is a suggested folder
        var suggestedFolder = $("#" + controllerId + "ExplorerNavigationBarSuggestedItem_0");
        if (suggestedFolder.length){
            var folderId = suggestedFolder.prop("id");
            var folder = folderMap[folderId];
            var childFolders = folder.getChildFolderList();
            if (childFolders.length){
                suggestedFolder.click();
                suggestedFolder.find("li").first().click();
            } else{
                suggestedFolder.click();
            }
        }
    };

    OrderController.prototype.buildExplorerHtml = function(){
        var folderList = this.getFolderList();
        var html = "";
		var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

        html += "<div id='" + this.getId() + "OCExplorerContainer' class='order-controller-explorer-container'>";
        //Need a row so firefox won't complain
        html += "<div class='order-controller-explorer-row'>";
        html += this.buildExplorerNavigationHtml(folderList);
        html += "<span id='" + this.getId() + "ExplorerContent' class='order-controller-content'>" + this.buildVenueSectionHtml() + "<div class='res-none'>" + cpmDocI18n.SELECT_ORDER_FOLDER + "</div></span>";
        html += "</div>";
        html += "</div>";

        return html;
    };

    /**
     *
     * @param {Array<OrderFolder>} orderFolderList - list of OrderFolders
     * @param {string} idPrefix - id prefix for folder HTML element
     * @returns {undefined} - undefined
     */
    OrderController.prototype.buildExplorerFolderHtml = function(orderFolderList, idPrefix, isRoot){
        if (!orderFolderList || !orderFolderList.length){
            return "";
        }

        var folderMap = this.getFolderMap();
        var oLen = orderFolderList.length;
        var i;
        var isRootCss = (!isRoot) ? "order-controller-nav-child hide" : "";
        var html = "";

        for (i = 0; i < oLen; i++){
            var folder = orderFolderList[i];
            var id = idPrefix + "_" + i;
            folder.navId = id;
            folderMap[id] = folder;
            html += "<ul class='" + isRootCss + "'><li id='" + id + "' class='order-controller-navbar-item'>";
            html += "<span class='order-controller-navbar-item-lbl'>" + folder.getDescription() + "</span>";
            //Get sub-folders
            html += this.buildExplorerFolderHtml(folder.getChildFolderList(), id);
            html += "</li></ul>";
        }
        return html;
    };

    OrderController.prototype.buildExplorerNavigationHtml = function(folderList){
        var id = this.getId() + "ExplorerNavigationBar";
        var html = "";
		var cpmDocI18n = i18n.discernabu.new_order_cpm_o1;

        //Create a map as well, with the ID as the key, and the folder as the value (quick retrieval of orders)
        if (this.getSuggestedFolders().length || this.getSuggestedOrders().length){
            var suggestedFolder = new OrderFolder();
            suggestedFolder.setDescription(cpmDocI18n.DESCRIPTION);
            suggestedFolder.setChildFolderList(this.getSuggestedFolders());
            suggestedFolder.setOrdersList(this.getSuggestedOrders());
            suggestedFolder.setCategoryId(-999);
        }

        var folderId = id + "Item";
        html += "<span class='order-controller-navbar' id='" + id + "'>";
        if (suggestedFolder){
            html += this.buildExplorerFolderHtml([suggestedFolder], id + "SuggestedItem", true);
        }

        html += this.buildExplorerFolderHtml(folderList, folderId, true);
        html += "</span>";

        return html;
    };

    NewOrdersCPMComponent.prototype.OrderController = OrderController;
    NewOrdersCPMComponent.prototype.OrderOption = OrderOption;
    NewOrdersCPMComponent.prototype.OrderFolder = OrderFolder;
})();

function TableElementHoverExtension(){
    this.templateMap = {};
    return this;
}

TableElementHoverExtension.prototype = new HoverExtension();
TableElementHoverExtension.prototype.constructor = TableElementHoverExtension;

TableElementHoverExtension.prototype.addHoverForElement = function(elementClass, renderer){
    if (!elementClass){
        throw new Error("Called addHoverForColumn on TableElementHoverExtension with null element for element parameter");
    }
    this.templateMap[elementClass] = HoverRenderFactory.getHoverRenderer(renderer);
    this.setTarget("." + elementClass);
};

TableElementHoverExtension.prototype.showHover = function(event, table, anchor){
    var data = {};
    var templateMap = this.templateMap;
    var jqAnchor = $(anchor);
    var hoverRenderer = null;
    for (var key in templateMap){
        if (templateMap.hasOwnProperty(key)){
            if (jqAnchor.hasClass(key)){
                hoverRenderer = templateMap[key];
                break;
            }
        }
    }

    if (!hoverRenderer){
        return;
    }
    data.RESULT_DATA = ComponentTableDataRetriever.getResultFromTable(table, jqAnchor.closest("dl.result-info").get(0));
    data.ELEMENT_CLASS = key;
    data.SOURCE = "TableElementHoverExtension:ELEMENT_HOVER";
    data.EVENT = event;
    var content = hoverRenderer.render(data);
    if (!content){
        return;
    }
    var tooltip = this.getTooltip();
    tooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(content);
    tooltip.show();
};

CPMController.prototype.addComponentMapping("ORDEROPTS", NewOrdersCPMComponent);
