/**
 * Project: mp_bedrock2
 * Version 1.0.0
 * Released 7/6/2010
 * @author Greg Howdeshell
 */
function BedrockMPage(categoryMean, componentMapping){
    this.mean = categoryMean;
    this.componentMapping = componentMapping;
    
    //public methods
    BedrockMPage.method('getCategoryMean', function(){
        return mean;
    });
}

BedrockMPage.inherits(MPage);

function BedrockMPageGroupValue(){
    m_sequence = 0;
    m_description = "";
    
    MPageGroupValue.method("getSequence", function(){
        return this.m_sequence;
    })
    MPageGroupValue.method("setSequence", function(value){
        this.m_sequence = value;
    })
    MPageGroupValue.method("getDescription", function(){
        return this.m_description;
    })
    MPageGroupValue.method("setDescription", function(value){
        this.m_description = value;
    })
}

BedrockMPageGroupValue.inherits(MPageGroupValue);

/**
 * Bedrock schema methods for loading a MPage utilizing the bedrock configuration
 * @namespace MP_Bedrock
 * @static
 * @global
 */
var MP_Bedrock = function(){
    return {
        LoadingPolicy: function(){
            var m_loadPageDetails = false;
            var m_loadComponentBasic = false;
            var m_loadComponentDetail = false;
            var m_loadCustomizeView = false;
            var m_categoryMean = "";
            var m_criterion = null;
            
            this.setLoadPageDetails = function(value){
                m_loadPageDetails = value;
            }
            this.getLoadPageDetails = function(){
                return m_loadPageDetails;
            }
            this.setLoadComponentBasics = function(value){
                m_loadComponentBasic = value;
            }
            this.getLoadComponentBasics = function(){
                return m_loadComponentBasic;
            }
            this.setLoadComponentDetails = function(value){
                m_loadComponentDetail = value;
            }
            this.getLoadComponentDetails = function(){
                return m_loadComponentDetail;
            }
            this.setCategoryMean = function(value){
                m_categoryMean = value;
            }
            this.getCategoryMean = function(){
                return m_categoryMean;
            }
            this.setCriterion = function(value){
                m_criterion = value;
            }
            this.getCriterion = function(){
                return m_criterion;
            }
            this.setCustomizeView = function(value){
                m_loadCustomizeView = value;
            }
            this.getCustomizeView = function(){
                return m_loadCustomizeView;
            }
        }
    }
}();

MP_Bedrock.MPage = function(){
    return {
        LoadBedrockMPage: function(loadingPolicy, componentMapping, funcFilterMapping, componentFunctions){
            var categoryMean = loadingPolicy.getCategoryMean();
            var returnPage = new BedrockMPage(categoryMean, componentMapping)
            var criterion = loadingPolicy.getCriterion();
            criterion.category_mean = categoryMean;
            var prefManager = MP_Core.AppUserPreferenceManager;
            prefManager.Initialize(criterion, categoryMean);
            prefManager.LoadPreferences();
            returnPage.setCriterion(criterion);
            returnPage.setCustomizeView(loadingPolicy.getCustomizeView());
            
            //Load basics about MPage
            var info = new XMLCclRequest();
            info.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    var jsonText = JSON.parse(this.responseText);
                    var recordData = jsonText.RECORD_DATA;
                    if (recordData.MPAGE.length > 0) {
                        //will only be one page for retrieval
                        var page = recordData.MPAGE[0];
                        returnPage.setPageId(page.BR_DATAMART_CATEGORY_ID);
                        
                        //load page level parameters
                        var jsMPage = page.PARAMS;
                        for (var y = 0, yl = jsMPage.length; y < yl; y++) {
                            var strFunc = MP_Util.GetItemFromMapArray(funcFilterMapping, jsMPage[y].FILTER_MEAN);
                            if (strFunc != null && strFunc != "") {
                                var jsonFunc = JSON.parse(strFunc);
                                var jsFunction = jsonFunc.FUNCTION;
                                
                                switch (jsFunction.TYPE) {
                                    case "Boolean":
                                        var location = "jsMPage[y].VALUES[0]." + jsFunction.FIELD
                                        var sValue = eval(location);
                                        var bValue = (sValue == "0") ? false : true;
                                        var strFunc = "returnPage." + jsFunction.NAME + "(" + bValue + ")";
                                        var ret = eval(strFunc);
                                        break;
                                }
                            }
                        }
                        
                        //load basic information about components, leave detailed to the component when loaded
                        var components = page.COMPONENT;
                        for (var y = 0, yl = components.length; y < yl; y++) {
                            var jsonComponent = components[y];
                            returnPage.addComponentId(jsonComponent.BR_DATAMART_REPORT_ID);
                        }
                    }
                }
                if (this.readyState == 4) {
                    MP_Util.ReleaseRequestReference(this);
                }
            }
            //  Call the ccl progam and send the parameter string
            info.open('GET', "MP_GET_BR_MPAGE", false);
            
            var loadPageIndicator = (loadingPolicy.getLoadPageDetails()) ? 1 : 0;
            var loadComponentIndicator = (loadingPolicy.getLoadComponentBasics()) ? 1 : 0;
            
            var ar = ["^MINE^", "^" + categoryMean + "^", loadPageIndicator, loadComponentIndicator];
            info.send(ar.join(","));
            if (loadComponentIndicator > 0) {
                var components = MP_Bedrock.MPage.Component.LoadBedrockComponents(loadingPolicy, returnPage.getComponentIds(), componentMapping, componentFunctions);
                returnPage.setComponents(components);
            }
            return returnPage;
        }
    };
}();

MP_Bedrock.MPage.Component = function(){
    return {
        LoadBedrockComponents: function(loadingPolicy, compIdAr, componentMapping, componentFunctions){
            if (compIdAr != null && compIdAr.length > 0) {
                var returnAr = [];
                var info = new XMLCclRequest();
                info.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) {
                        var jsonText = JSON.parse(info.responseText);
                        var reportData = jsonText.RECORD_DATA;
                        var prefManager = MP_Core.AppUserPreferenceManager;
                        var criterion = loadingPolicy.getCriterion();
                        var isCustomizeView = loadingPolicy.getCustomizeView();
                        
                        for (var x = reportData.COMPONENT.length; x--;) {
                            var jsonComponent = reportData.COMPONENT[x];
                            
                            var componentType = MP_Util.GetValueFromArray(jsonComponent.REPORT_MEAN, componentMapping);
                            if (componentType != null || isCustomizeView) //need to make sure components returned are part of the mapping requested.
                            {
                                var jsComponentFunc = null;
                                var component = null;
                                if (isCustomizeView) {
                                    component = new MPageComponent();
                                    component.setCriterion(criterion);
                                    component.setStyles(new ComponentStyle());
                                }
                                else 
                                    component = new componentType(criterion);
                                
                                component.setCustomizeView(loadingPolicy.getCustomizeView());
                                component.setComponentId(jsonComponent.BR_DATAMART_FILTER_ID);
                                component.setReportId(jsonComponent.BR_DATAMART_REPORT_ID);
                                
                                var userPrefComp = prefManager.GetComponentById(component.getComponentId())
                                if (userPrefComp != null) {
                                    component.setExpanded(userPrefComp.expanded);
                                    component.setColumn(userPrefComp.col_seq);
                                    component.setSequence(userPrefComp.row_seq);
                                    component.setPageGroupSequence(userPrefComp.group_seq);
                                }
                                else {
                                    component.setExpanded(jsonComponent.EXPANDED);
                                    component.setColumn(jsonComponent.COL_SEQ);
                                    component.setSequence(jsonComponent.ROW_SEQ);
                                    component.setPageGroupSequence(jsonComponent.GROUP_SEQ);
                                }
                                
                                component.setLabel(jsonComponent.LABEL);
                                component.setLink(jsonComponent.LINK);
                                component.setResultsDisplayEnabled(jsonComponent.TOTAL_RESULTS);
                                component.setXofYEnabled(jsonComponent.X_OF_Y);
                                component.setScrollNumber(jsonComponent.SCROLL_NUM);
                                component.setScrollingEnabled(jsonComponent.SCROLL_ENABLED);
                                if (component.getLookbackDays() == 0) //check if lookback is overridden by component
                                    component.setLookbackDays(jsonComponent.LOOKBACK_DAYS);
                                component.setPlusAddEnabled((jsonComponent.ISPLUSADD == 1 ? true : false));
			        if (component.getLookbackUnits() == 0) //check if the lookbackUnits has not been overridden
				     component.setLookbackUnits(jsonComponent.LOOKBACKUNITS);
				if (component.getLookbackUnitTypeFlag() == 0) //check if the lookbackUnitTypeFlag has been overridden
				     component.setLookbackUnitTypeFlag(jsonComponent.LOOKBACKTYPEFLAG);
                                component.setDateFormat(jsonComponent.DATE_DISPLAY_FLAG);
                                if (component.getScope() == 0) //check if the scope has not been overridden by the component requirements
                                    component.setScope(jsonComponent.SCOPE);
                                
                                var componentFunc = MP_Util.GetValueFromArray(jsonComponent.REPORT_MEAN, componentFunctions);
                                if (componentFunc != null) 
                                    jsComponentFunc = JSON.parse(componentFunc);
                                for (var y = 0, yl = jsonComponent.FILTER.length; y < yl; y++) {
                                    var filter = jsonComponent.FILTER[y];
                                    
                                    //make sure and skip known 'group' types
                                    switch (filter.FILTER_CATEGORY_MEAN) {
                                        case "EVENT":
                                            var aValue = GetFilterValues(filter);
                                            if (jsComponentFunc != null) {
                                                var filterFunc = GetFunctionByFilterMean(jsComponentFunc, filter.FILTER_MEAN);
                                                if (filterFunc) {
                                                    var strFunc = GetValueFromComponentFunc(filterFunc, aValue);
                                                    var ret = eval(strFunc);
                                                    break;
                                                }
                                            }
                                            var eGroup = new MPageEventCodeGroup();
                                            for (var z = 0, zl = aValue.length; z < zl; z++) {
                                                eGroup.addEventCode(aValue[z].getId())
                                            }
                                            eGroup.setGroupId(filter.BR_DATAMART_FILTER_ID);
                                            eGroup.setGroupName(filter.FILTER_MEAN);
                                            eGroup.setSequence(filter.FILTER_SEQ);
                                            component.addGroup(eGroup);
                                            break;
                                        case "EVENT_SET":
                                        case "PRIM_EVENT_SET":
                                            var aValue = GetFilterValues(filter);
                                            if (jsComponentFunc != null) {
                                                var filterFunc = GetFunctionByFilterMean(jsComponentFunc, filter.FILTER_MEAN);
                                                if (filterFunc) {
                                                    var strFunc = GetValueFromComponentFunc(filterFunc, aValue);
                                                    var ret = eval(strFunc);
                                                    break;
                                                }
                                            }
                                            var eGroup = new MPageEventSetGroup();
                                            for (var z = 0, zl = aValue.length; z < zl; z++) {
                                                eGroup.addEventSet(aValue[z].getId())
                                            }
                                            eGroup.setGroupId(filter.BR_DATAMART_FILTER_ID);
                                            eGroup.setGroupName(filter.FILTER_MEAN);
                                            eGroup.setSequence(filter.FILTER_SEQ);
                                            component.addGroup(eGroup);
                                            break;
                                        case "EVENT_SEQ":
                                            // 1) Find the group with the same sequence
                                            var groups = component.getGroups();
                                            if (groups != null) {
                                                for (var z = 0, zl = groups.length; z < zl; z++) {
                                                    var group = groups[z];
                                                    if (group.getSequence() == filter.FILTER_SEQ) {
                                                        //if a group with the same sequence has been discovered, remove existing event codes
                                                        // and add with sequenced event codes
                                                        group.setEventCodes(null);
                                                        group.setSequenced(true);
                                                        var aValue = GetFilterValues(filter);
                                                        for (var z = 0, zl = aValue.length; z < zl; z++) {
                                                            group.addEventCode(aValue[z].getId())
                                                        }
                                                    }
                                                }
                                            }
                                            break;
                                        case "EVENT_SET_SEQ":
                                            // 1) Find the group with the same sequence
                                            var groups = component.getGroups();
                                            if (groups != null) {
                                                for (var z = 0, zl = groups.length; z < zl; z++) {
                                                    var group = groups[z];
                                                    if (group.getSequence() == filter.FILTER_SEQ) {
                                                        //if a group with the same sequence has been discovered, remove existing event codes
                                                        // and add with sequenced event codes
                                                        group.setEventSets(null);
                                                        group.setSequenced(true);
                                                        
                                                        //there is an exception case in regards to vital signs that an event set sequence
                                                        //could be created that contains results other than event sets.  So the following exception
                                                        //logic will be added to evaluate and create a new type of group to denote the change.
                                                        
                                                        //first, place all values into a single array.  In addition, check if the types are the same,
                                                        // if all types are the same, setEventSets with the array of items found
                                                        // else, create a MPageSequenceGroup which hold multi type values and setItems with new array
                                                        //   and setMultiValue(true);
                                                        var aValue = GetFilterValues(filter);
                                                        var tempAr = [];
                                                        var tempMap = [];
                                                        var filterType = "CODE_VALUE"; //by default, all event codes or event set codes are type code value
                                                        var isMultiValue = false;
                                                        for (var zz = 0, zzl = aValue.length; zz < zzl; zz++) {
                                                            var val = aValue[zz];
                                                            tempAr.push(val.getId())
                                                            if (filterType != val.getName()) 
                                                                isMultiValue = true;
                                                            MP_Util.AddItemToMapArray(tempMap, val.getName(), val.getId())
                                                        }
                                                        if (isMultiValue == true) {
                                                            var eGroup = new MPageSequenceGroup();
                                                            eGroup.setMultiValue(isMultiValue);
                                                            eGroup.setItems(tempAr);
                                                            eGroup.setMapItems(tempMap);
                                                            eGroup.setSequence(true);
                                                            eGroup.setGroupId(group.getGroupId())
                                                            eGroup.setGroupName(group.getGroupName())
                                                            groups[z] = eGroup;
                                                        }
                                                        else {
                                                            group.setEventSets(tempAr);
                                                        }
                                                    }
                                                }
                                            }
                                            break;
                                        case "PF_MULTI_SELECT":
                                            var aValue = GetFilterValues(filter);
                                            for (var z = 0, zl = aValue.length; z < zl; z++) {
                                                var value = aValue[z];
                                                var item = new MP_Core.MenuItem();
                                                item.setName(value.getName())
                                                item.setDescription(value.getDescription())
                                                item.setId(value.getId())
                                                component.addMenuItem(item);
                                            }
                                            break;
                                        case "CAT_TYPE_ASSIGN":
                                            var aValue = GetFilterValues(filter);
                                            if (jsComponentFunc != null) {
                                                var filterFunc = GetFunctionByFilterMean(jsComponentFunc, filter.FILTER_MEAN);
                                                if (filterFunc) {
                                                    var strFunc = GetValueFromComponentFunc(filterFunc, aValue);
                                                    var ret = eval(strFunc);
                                                    break;
                                                }
                                            }
                                            
                                            var eGrouper = new MPageGrouper();
                                            var eGroup = null;
                                            var curSeq = -1;
                                            for (var z = 0, zl = aValue.length; z < zl; z++) {
                                                var val = aValue[z];
                                                if (val.getSequence() != curSeq) {
                                                    curSeq = val.getSequence();
                                                    eGroup = new MPageCodeValueGroup();
                                                    eGroup.setSequence(curSeq);
                                                    eGrouper.addGroup(eGroup);
                                                }
                                                eGroup.addCode(val.getId())
                                            }
                                            component.addGroup(eGrouper);
                                            break;
                                        case "CE_GROUP":
                                            //Understood that these grouped results have a title and then a list of event codes associated
                                            //to them.  The identifier for each group is that the group sequence is the same for the results.
                                            //Only one field will have a free text description, the other results will be event codes
                                            
                                            //because bedrock is nice enough to store the grouping of event codes seperate from a flat list of 
                                            //the codes, overwrite the existing group with the new MPageGrouper
                                            var groups = component.getGroups();
                                            if (groups != null) {
                                                for (var z = 0, zl = groups.length; z < zl; z++) {
                                                    var group = groups[z];
                                                    if (group.getSequence() == filter.FILTER_SEQ) {
                                                        var aValue = GetFilterValues(filter);
                                                        if (jsComponentFunc != null) {
                                                            var filterFunc = GetFunctionByFilterMean(jsComponentFunc, filter.FILTER_MEAN);
                                                            if (filterFunc) {
                                                                var strFunc = GetValueFromComponentFunc(filterFunc, aValue);
                                                                var ret = eval(strFunc);
                                                                break;
                                                            }
                                                        }
                                                        var eGrouper = new MPageGrouper();
                                                        eGrouper.setGroupId(group.getGroupId()); //for alignment with sequencing of groups
                                                        eGrouper.setGroupName(group.getGroupName());
                                                        var eGroup = null;
                                                        var curSeq = -1;
                                                        for (var i = 0, il = aValue.length; i < il; i++) {
                                                            var val = aValue[i];
                                                            if (val.getSequence() != curSeq) {
                                                                curSeq = val.getSequence();
                                                                eGroup = new MPageEventCodeGroup();
                                                                eGroup.setSequence(curSeq);
                                                                eGrouper.addGroup(eGroup);
                                                            }
                                                            var id = val.getId();
                                                            var desc = val.getDescription();
                                                            var name = val.getName();
                                                            if (id > 0) 
                                                                eGroup.addEventCode(id)
                                                            if (desc != "") 
                                                                eGroup.setGroupName(desc);
                                                        }
                                                        groups[z] = eGrouper;
                                                    }
                                                }
                                            }
                                            break;
                                        default:
                                            var aValue = GetFilterValues(filter);
                                            if (jsComponentFunc != null) {
                                                var filterFunc = GetFunctionByFilterMean(jsComponentFunc, filter.FILTER_MEAN);
                                                if (filterFunc) {
                                                    var strFunc = GetValueFromComponentFunc(filterFunc, aValue);
                                                    var ret = eval(strFunc);
                                                }
                                            }
                                    }
                                }
                                
                                returnAr.push(component);
                            }
                        }
                    }
                    if (this.readyState == 4) {
                        MP_Util.ReleaseRequestReference(this);
                    }
                }
                info.open('GET', "MP_GET_BR_COMPONENT", false);
                var loadComponentIndicator = (loadingPolicy.getLoadComponentBasics()) ? 1 : 0;
                loadComponentIndicator += (loadingPolicy.getLoadComponentDetails()) ? 2 : 0;
                var sComponentIds = (compIdAr != null && compIdAr.length > 0) ? "value(" + compIdAr.join(",") + ")" : "0.0";
                
                var ar = ["^MINE^", sComponentIds, loadComponentIndicator];
                info.send(ar.join(","));
                return returnAr;
            }
        }
    }
    function GetFilterValues(jsonFilter){
        var aReturn = [];
        for (var x = 0, xl = jsonFilter.VALUES.length; x < xl; x++) {
            var jsonValue = jsonFilter.VALUES[x];
            var value = new BedrockMPageGroupValue();
            value.setId(jsonValue.PARENT_ENTITY_ID);
            value.setName(jsonValue.PARENT_ENTITY_NAME);
            value.setDescription(jsonValue.FREETEXT_DESC);
            value.setSequence(jsonValue.GROUP_SEQ);
            
            aReturn.push(value);
        }
        return aReturn;
    }
    function GetFunctionByFilterMean(jsFuncs, mean){
        var funcs = jsFuncs.FUNCTIONS;
        for (var x = 0, xl = funcs.length; x < xl; x++) {
            var func = funcs[x];
            if (func && func.FILTER_MEAN == mean) 
                return funcs[x];
        }
        return null;
    }
    function GetValueFromComponentFunc(func, aValues){
        var ar = [];
        for (var x = 0, xl = aValues.length; x < xl; x++) {
            var val = aValues[x];
            switch (func.FIELD) {
                case "FREETEXT_DESC":
                    ar.push(val.getDescription());
                    break;
                case "PARENT_ENTITY_ID":
                    ar.push(val.getId());
                    break
                default:
                    break;
            }
        }
        var strFunc = "";
        switch (func.TYPE) {
            case "Array":
                strFunc = "component." + func.NAME + "([" + ar.join(",") + "])";
                break;
            case "String":
                strFunc = "component." + func.NAME + "('" + ar.join(",") + "')";
                break;
            case "Number":
                strFunc = "component." + func.NAME + "(" + ar.join(",") + ")";
                break;
            case "Boolean":
                var bVal = (ar[0] == "1") ? true : false;
                strFunc = "component." + func.NAME + "(" + bVal + ")";
                break;
            default:
                break;
        }
        return strFunc;
    }
}();
