function BedrockMPage(categoryMean, componentMapping){
	this.mean = categoryMean;
	this.componentMapping = componentMapping;

	//public methods
	BedrockMPage.method('getCategoryMean', function(){
		return mean;	
	});
}
BedrockMPage.inherits(MPage);

function BedrockMPageGroupValue()
{
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
var MP_Bedrock = function () {
	
	return {
		CreateBedrockMPage : function(categoryMean, componentMapping, criterion, funcFilterMapping, compFuncFilterMapping){
			var returnPage = new BedrockMPage(categoryMean, componentMapping)
			returnPage.setCriterion(criterion);
			// Initialize the request object
			var info = new XMLCclRequest();
			var sections = null;
			// Get the response
			info.onreadystatechange = function () {
				if (info.readyState == 4 && info.status == 200)
				{
					var jsonText = JSON.parse(info.responseText);
					returnPage.setPageId(jsonText.RECORD_DATA.BR_DATAMART_CATEGORY_ID);
					
					//load page level parameters
					var jsMPage = jsonText.RECORD_DATA.MPAGE;
					for (var y = 0, yl = jsMPage.length; y < yl; y++)
					{
						var strFunc = MP_Util.GetItemFromMapArray(funcFilterMapping, jsMPage[y].FILTER_MEAN);
						if (strFunc != null && strFunc != "")
						{
							var jsonFunc = JSON.parse(strFunc);
							var jsFunction = jsonFunc.FUNCTION;
							
							switch(jsFunction.TYPE) {
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
					returnPage.setComponents(LoadBedrockComponentInformation(jsonText, componentMapping, criterion, compFuncFilterMapping));
				};   //if
			} //function
			
			//  Call the ccl progam and send the parameter string
			info.open('GET', "MP_GET_BRSEC_PARAMS", false);
			info.send("^MINE^, ^" + categoryMean + "^");
			return returnPage;
		}
	};
	function LoadBedrockComponentInformation(jsonText, componentMapping, criterion, compFuncFilterMapping)
	{
		var components = [];
		var section = jsonText.RECORD_DATA.SECTION;
		for (var x = 0, xl = section.length; x < xl; x++)
		{
			var jsonSection = section[x];
			var componentType = MP_Util.GetValueFromArray(jsonSection.BEDROCK_NAME, componentMapping);
			if (componentType != null) //need to make sure components returned are part of the mapping requested.
			{
				var jsComponentFunc = null;
				var componentFunc = MP_Util.GetValueFromArray(jsonSection.BEDROCK_NAME, compFuncFilterMapping);
				if (componentFunc != null)
					jsComponentFunc = JSON.parse(componentFunc);
				var component = new componentType(criterion);
				InitializeBedrockComponent(component, jsonSection, jsComponentFunc);
				components.push(component);				
			}
		}
		components.sort(SortMPageComponents);
		return (components);	
	}
	function InitializeBedrockComponent(component, jsonComponent, jsComponentFunc)
	{
		component.setComponentId(jsonComponent.BR_DATAMART_FILTER_ID);
		component.setLabel(jsonComponent.LABEL);
		component.setColumn(jsonComponent.COL_SEQ);
		component.setSequence(jsonComponent.ROW_SEQ);
		component.setLink(jsonComponent.LINK);
		component.setResultsDisplayEnabled(jsonComponent.TOTAL_RESULTS);
		component.setXofYEnabled(jsonComponent.X_OF_Y);
		component.setExpanded(jsonComponent.EXPANDED);
		component.setScrollNumber(jsonComponent.SCROLL_NUM);
		component.setScrollingEnabled(jsonComponent.SCROLL_ENABLED);
		if(component.getLookbackDays() == 0) //check if lookback is overridden by component	
			component.setLookbackDays(jsonComponent.LOOKBACK_DAYS);	
		component.setPlusAddEnabled((jsonComponent.ISPLUSADD==1?true:false));
		if (component.getLookbackUnits() == 0) //check if the lookbackUnits has not been overridden
			component.setLookbackUnits(jsonComponent.LOOKBACKUNITS);
		if (component.getLookbackUnitTypeFlag() == 0) //check if the lookbackUnitTypeFlag has been overridden
			component.setLookbackUnitTypeFlag(jsonComponent.LOOKBACKTYPEFLAG);
		component.setDateFormat(jsonComponent.DATE_DISPLAY_FLAG);
		if (component.getScope() == 0) //check if the scope has not been overridden by the component requirements
			component.setScope(jsonComponent.SCOPE);
		
		for (var x=0,xl=jsonComponent.FILTER.length;x<xl;x++)
		{
			var filter = jsonComponent.FILTER[x];

			//make sure and skip known 'group' types
			switch(filter.FILTER_CATEGORY_MEAN) {
				case "EVENT":
					var aValue = GetFilterValues(filter);
					if (jsComponentFunc != null){
						var filterFunc = GetFunctionByFilterMean(jsComponentFunc, filter.FILTER_MEAN);
						if (filterFunc){
							var strFunc = GetValueFromComponentFunc(filterFunc, aValue);
							var ret = eval(strFunc);
							break;
						}
					}
					var eGroup = new MPageEventCodeGroup();
					for (var y=0,yl=aValue.length;y<yl;y++)
					{
						eGroup.addEventCode(aValue[y].getId())
					}
					eGroup.setGroupName(filter.FILTER_MEAN);
					eGroup.setSequence(filter.FILTER_SEQ);
					component.addGroup(eGroup);
					break;
				case "EVENT_SET":
				case "PRIM_EVENT_SET":
					var aValue = GetFilterValues(filter);
					if (jsComponentFunc != null){
						var filterFunc = GetFunctionByFilterMean(jsComponentFunc, filter.FILTER_MEAN);
						if (filterFunc){
							var strFunc = GetValueFromComponentFunc(filterFunc, aValue);
							var ret = eval(strFunc);
							break;
						}
					}
					var eGroup = new MPageEventSetGroup();
					for (var y=0,yl=aValue.length;y<yl;y++)
					{
						eGroup.addEventSet(aValue[y].getId())
					}
					eGroup.setGroupName(filter.FILTER_MEAN);
					eGroup.setSequence(filter.FILTER_SEQ);
					component.addGroup(eGroup);
					break;
				case "EVENT_SEQ":
					// 1) Find the group with the same sequence
					var groups = component.getGroups();
					if (groups != null){
						for (var y = 0, yl = groups.length;y<yl;y++){
							var group = groups[y];
							if (group.getSequence() == filter.FILTER_SEQ)
							{
								//if a group with the same sequence has been discovered, remove existing event codes
								// and add with sequenced event codes
								group.setEventCodes(null);
								group.setSequenced(true);
								var aValue = GetFilterValues(filter);
								for (var z = 0, zl = aValue.length;z<zl;z++)
								{
									group.addEventCode(aValue[z].getId())
								}
							}
						}
					}
					break;
				case "EVENT_SET_SEQ":
					// 1) Find the group with the same sequence
					var groups = component.getGroups();
					if (groups != null){
						for (var y = 0, yl = groups.length;y<yl;y++){
							var group = groups[y];
							if (group.getSequence() == filter.FILTER_SEQ)
							{
								//if a group with the same sequence has been discovered, remove existing event codes
								// and add with sequenced event codes
								group.setEventSets(null);
								group.setSequenced(true);
								var aValue = GetFilterValues(filter);
								for (var z = 0, zl = aValue.length;z<zl;z++)
								{
									group.addEventSet(aValue[z].getId())
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
						item.setDescription(value.getDescription())
						item.setName(value.getName())
						item.setId(value.getId())
						component.addMenuItem(item);
					}
					break;
				
				default:
					var aValue = GetFilterValues(filter);
					if (jsComponentFunc != null)
					{
						var filterFunc = GetFunctionByFilterMean(jsComponentFunc, filter.FILTER_MEAN);
						if (filterFunc){
							var strFunc = GetValueFromComponentFunc(filterFunc, aValue);
							var ret = eval(strFunc);
						}
					}
			}
		}
	}
	
	function GetAssociatedGroup(filterMean, groups)
	{
		for (var x=0,xl=groups.length;x<xl;x++)
		{
			if (groups[x].getGroupName() == filterMean)
			{
				return groups[x];
			}
		}
		return null;
	}

	function GetFilterValues(jsonFilter)
	{
		var aReturn = [];
		for (var x=0,xl=jsonFilter.VALUES.length;x<xl;x++)
		{
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
	function GetFunctionByFilterMean(jsFuncs, mean)
	{
		var funcs = jsFuncs.FUNCTIONS;
		for (var x=0,xl=funcs.length;x<xl;x++)
		{
			var func = funcs[x];
//			alert("func.FILTER_MEAN: " + func.FILTER_MEAN + " mean: " + mean);
			if(func.FILTER_MEAN == mean)
				return funcs[x];
		}
		return null;
	}
	function GetValueFromComponentFunc(func, aValues)
	{
		var ar = [];
		for (var x=0,xl=aValues.length;x<xl;x++){
			switch(func.FIELD) {
				case "FREETEXT_DESC":
					ar.push(aValues[x].getDescription());
					break;
				case "PARENT_ENTITY_ID":
					ar.push(aValues[x].getId());
					break
				default: 
					break;
			}
		}
//		alert(ar.join(","));
		var strFunc = "";
		if (func.TYPE == "Array"){
			strFunc = "component." + func.NAME + "([" + ar.join(",") + "])";
		}
		else if (func.TYPE == "String"){
			strFunc = "component." + func.NAME + "('" + ar.join(",") + "')";
		}
		else{
			strFunc = "component." + func.NAME + "(" + ar.join(",") + ")";
		}
		return strFunc;
		/*
		for (var x=0,xl=aValues.length;x<xl;x++){
			switch(func.FIELD) {
				case "FREETEXT_DESC":
					var strFunc = "component." + func.NAME + "(" + aValues[x].getDescription() + ")";
					return(strFunc)
					break;
				default: 
					break;
			}
		}
		*/
	}

	function SetComponentAttribute(component, func, value){
					//load page level parameters
					var jsMPage = jsonText.RECORD_DATA.MPAGE;
					for (var y = 0, yl = jsMPage.length; y < yl; y++)
					{
						var strFunc = MP_Util.GetItemFromMapArray(funcFilterMapping, jsMPage[y].FILTER_MEAN);
						if (strFunc != null && strFunc != "")
						{
							var jsonFunc = JSON.parse(strFunc);
							var jsFunction = jsonFunc.FUNCTION;
							
							switch(jsFunction.TYPE) {
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
	}
}();
