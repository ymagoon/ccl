function RCMAutoSuggestControl(textbox,queryHandler,selectionHandler,detailsHandler){this.cur=0;
this.layer=null;
this.queryHandler=queryHandler;
this.selectionHandler=selectionHandler;
this.detailsHandler=detailsHandler;
this.textbox=textbox;
this.prevSearchString=textbox.value;
this.suggestions=[];
this.isVerified=false;
this.isRequired=false;
this.ignoreOnBlur=false;
this.currentTimeout;
this.delay=300;
this.verifyStateChangeListeners=[];
this.init();
}RCMAutoSuggestControl.prototype.autosuggest=function(suggestions){this.layer.style.width=this.textbox.offsetWidth;
this.suggestions=suggestions;
if(suggestions.length>0){this.showSuggestions(suggestions);
}else{this.hideSuggestions();
}};
RCMAutoSuggestControl.prototype.createDropDown=function(){var that=this;
this.layer=document.createElement("div");
this.layer.className="rcm-search-suggestions";
this.layer.style.display="none";
this.layer.style.width=this.textbox.offsetWidth;
this.layer.onmousedown=this.layer.onmouseup=this.layer.onmouseover=function(oEvent){oEvent=oEvent||window.event;
oTarget=oEvent.target||oEvent.srcElement;
if(oEvent.type=="mousedown"){var index=that.indexOf(this,oTarget);
if(that.suggestions[index]){var isVerified=false;
if(that.suggestions[index].VALUE){that.textbox.value=that.suggestions[index].NAME;
isVerified=true;
}else{that.textbox.value="";
}that.selectionHandler(that.suggestions[index].VALUE);
that.hideSuggestions();
if(isVerified){that.setVerified(true);
}}}else{if(oEvent.type=="mouseover"){var index=that.indexOf(this,oTarget);
that.cur=index;
that.highlightSuggestion(oTarget);
}else{that.textbox.focus();
}}};
document.body.appendChild(this.layer);
};
RCMAutoSuggestControl.prototype.getLeft=function(){return $(this.textbox).offset().left;
};
RCMAutoSuggestControl.prototype.getTop=function(){return $(this.textbox).offset().top;
};
RCMAutoSuggestControl.prototype.handleKeyDown=function(oEvent){if(this.layer.style.display!="none"){var isVerified=false;
switch(oEvent.keyCode){case 38:this.previousSuggestion();
break;
case 40:this.nextSuggestion();
break;
case 13:if(this.suggestions[this.cur].VALUE){this.textbox.value=this.suggestions[this.cur].NAME;
isVerified=true;
}else{this.textbox.value="";
}this.selectionHandler(this.suggestions[this.cur].VALUE);
this.hideSuggestions();
if(isVerified){this.setVerified(true);
}break;
}}};
RCMAutoSuggestControl.prototype.addLoadingSpinner=function(){$(this.textbox).removeClass("searchText").addClass("searchTextLoading");
};
RCMAutoSuggestControl.prototype.removeLoadingSpinner=function(){$(this.textbox).removeClass("searchTextLoading").addClass("searchText");
};
RCMAutoSuggestControl.prototype.handleKeyUp=function(oEvent){var iKeyCode=oEvent.keyCode;
function handleQueryLater(that,searchText){return function(){that.queryHandler(that,searchText);
};
}if(iKeyCode==8||iKeyCode==46){this.setVerified(false);
if(this.currentTimeout){clearTimeout(this.currentTimeout);
}if(this.textbox.value.length>0){this.currentTimeout=setTimeout(handleQueryLater(this,this.textbox.value),this.delay);
}else{this.hideSuggestions();
}}else{if(iKeyCode<32||(iKeyCode>=33&&iKeyCode<46)||(iKeyCode>=112&&iKeyCode<=123)||this.prevSearchString===this.textbox.value){}else{this.setVerified(false);
if(this.currentTimeout){clearTimeout(this.currentTimeout);
}if(this.textbox.value.length>0){this.currentTimeout=setTimeout(handleQueryLater(this,this.textbox.value),this.delay);
this.prevSearchString=this.textbox.value;
}}}};
RCMAutoSuggestControl.prototype.setVerified=function(isVerified){if(isVerified!=this.isVerified){this.isVerified=isVerified;
this.updateRequiredDecoration();
for(var i=0;
i<this.verifyStateChangeListeners.length;
i++){this.verifyStateChangeListeners[i]();
}}};
RCMAutoSuggestControl.prototype.hideSuggestions=function(){this.layer.style.display="none";
};
RCMAutoSuggestControl.prototype.highlightSuggestion=function(suggestionNode){for(var i=0;
i<this.layer.childNodes.length;
i++){var curNode=this.layer.childNodes[i];
if(curNode==suggestionNode||curNode==suggestionNode.parentNode){curNode.className="rcm-search-current";
}else{if(curNode.className=="rcm-search-current"){curNode.className="";
}}}};
RCMAutoSuggestControl.prototype.init=function(){var that=this;
this.textbox.onkeyup=function(oEvent){if(!oEvent){oEvent=window.event;
}that.handleKeyUp(oEvent);
};
this.textbox.onkeydown=function(oEvent){if(!oEvent){oEvent=window.event;
}that.handleKeyDown(oEvent);
};
this.textbox.onblur=function(){that.hideSuggestions();
if(!that.ignoreOnBlur){if(!that.isVerified){that.textbox.value="";
that.selectionHandler(0);
}}};
this.createDropDown();
};
RCMAutoSuggestControl.prototype.nextSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur<cSuggestionNodes.length-1){var oNode=cSuggestionNodes[++this.cur];
this.highlightSuggestion(oNode);
}};
RCMAutoSuggestControl.prototype.previousSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur>0){var oNode=cSuggestionNodes[--this.cur];
this.highlightSuggestion(oNode);
}};
RCMAutoSuggestControl.prototype.showSuggestions=function(suggestions){this.ignoreOnBlur=true;
var oDiv=null;
this.layer.innerHTML="";
for(var i=0;
i<suggestions.length;
i++){oDiv=document.createElement("div");
if(i==0){oDiv.className="rcm-search-current";
}this.cur=0;
var itemText=this.emboldenTypeAheadText(suggestions[i].NAME,this.textbox.value);
oDiv.innerHTML=itemText;
this.detailsHandler(suggestions[i].DETAILS,oDiv);
this.layer.appendChild(oDiv);
}this.layer.style.left=this.getLeft()+"px";
this.layer.style.top=(this.getTop()+this.textbox.offsetHeight)+"px";
this.layer.style.display="block";
this.layer.style.position="absolute";
this.ignoreOnBlur=false;
};
RCMAutoSuggestControl.prototype.indexOf=function(parent,element){var nodeList=parent.childNodes;
for(var i=0;
i<nodeList.length;
i++){var curNode=nodeList[i];
if(curNode==element||curNode==element.parentNode){return i;
}}return -1;
};
RCMAutoSuggestControl.prototype.emboldenTypeAheadText=function(suggestionText,typedText){return"<strong>"+suggestionText.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+typedText.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1").split(" ").join("|")+")(?![^<>]*>)(?![^&;]+;)","gi"),"</strong>$1<strong>")+"</strong>";
};
RCMAutoSuggestControl.prototype.updateRequiredDecoration=function(){$(this.textbox).toggleClass("required-search-field",this.isRequired&&!this.isVerified);
};
RCMAutoSuggestControl.prototype.setRequired=function(isRequired){if(isRequired!=this.isRequired){this.isRequired=isRequired;
if(isRequired){$("label[for='"+$(this.textbox).prop("id")+"']").prepend("<span style='color:#cc0000'>*</span>");
}else{$("label[for='"+$(this.textbox).prop("id")+"']").children(1).remove();
}this.updateRequiredDecoration();
}};
RCMAutoSuggestControl.prototype.addVerifyStateChangeListener=function(listener){this.verifyStateChangeListeners.push(listener);
};
RCMAutoSuggestControl.prototype.removeVerifyStateChangeListener=function(listener){for(var i=0;
i<this.verifyStateChangeListeners.length;
i++){if(this.verifyStateChangeListeners[i]===listener){this.verifyStateChangeListeners.splice(i,1);
break;
}}};
function ToolTipDetailsHandler(details,itemDiv){if(details&&details.length>0){var oToolTipDiv=document.createElement("div");
oToolTipDiv.className="detailsToolTip";
oToolTipDiv.style.visibility="hidden";
itemDiv.appendChild(oToolTipDiv);
var oToolTipSpan=document.createElement("span");
oToolTipSpan.innerHTML=details;
oToolTipDiv.appendChild(oToolTipSpan);
itemDiv.onmouseover=function(oEvent){oToolTipDiv.style.visibility="visible";
var offsetWidth=(itemDiv.offsetWidth)?itemDiv.offsetWidth:0;
var parentMarginLeft=(itemDiv.marginLeft)?itemDiv.marginLeft:0;
var parentMarginRight=(itemDiv.marginRight)?itemDiv.marginRight:0;
oToolTipDiv.style.left=offsetWidth+parentMarginLeft+parentMarginRight+5+"px";
oToolTipDiv.style.top=0+"px";
};
itemDiv.onmouseout=function(e){oToolTipDiv.style.visibility="hidden";
};
}}function OrgSearchControl(textBox){var selectedId=0;
var serviceDelegate=new OrgServiceDelegate();
var orgSecurityInd=0;
var orgType="";
var selectionHandler=function(newSelectedId){selectedId=newSelectedId;
};
var queryHandler=function(callback,searchString){serviceDelegate.getResults(searchString,orgType,function(results){callback.autosuggest(results);
},orgSecurityInd);
};
var autoSuggestControl=new RCMAutoSuggestControl(textBox,queryHandler,selectionHandler,ToolTipDetailsHandler);
this.getSelectedOrgId=function(){return selectedId;
};
this.setSelectedOrg=function(orgId,orgName){selectedId=orgId;
textBox.value=orgName;
autoSuggestControl.setVerified(orgId>0);
};
this.setRequired=function(required){autoSuggestControl.setRequired(required);
};
this.isVerified=function(){return autoSuggestControl.isVerified;
};
this.setOrgType=function(org){orgType=org;
};
this.addVerifyStateChangeListener=function(listener){autoSuggestControl.addVerifyStateChangeListener(listener);
};
this.removeVerifyStateChangeListener=function(listener){autoSuggestControl.removeVerifyStateChangeListener(listener);
};
var addEventHandler=function(element,event,handler){element.addEventListener?element.addEventListener(event,handler,false):element.attachEvent("on"+event,handler);
};
if(textBox.form){addEventHandler(textBox.form,"reset",function(){selectedId=0;
autoSuggestControl.setVerified(false);
});
}}function OrgServiceDelegate(){var that=this;
this.getResults=function(searchString,orgType,callback,orgSecurityInd,physicianInd){if(searchString.replace(/\s+/g,"").length<3){callback(new Array());
return;
}var json={RCM_ORG_REQUEST:{ORG_CDS:[{ORG_TYPE_CD:0}],ORG_TYPE_CODE:0,ORG_TEXT:searchString+"*",MAX:10,START_NUM:1,ORG_ALIAS:"",SEARCH_IND:1,MATCH_IND:"*",SHOW_UNAUTH:0,GROUPNAMEDISP:0,SHOW_INACTIVE:0,ZIP_CODE:"",FSCONTEXT:{CONTEXTLIST:[]},SEARCH_ALL_LOGICAL_DOMAINS_IND:0,PRSNL_ID:0,RCCLINIC_FLAG:0,FILTER_OUT_RCCLINIC_FLAG:0,SPONSOR_NAME_CONTAINS_IND:0,PARENT_ORG_ID:0,RCM_ORG_TYPE_MEANING:orgType}};
var requestArgs=[];
requestArgs.push("^MINE^","0.0","8","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",requestArgs,true,function(status,recordData){if("S"===status){var orgResults=[];
for(var i=0,length=recordData.ORGANIZATION.length;
i<length;
i++){var orgResult=recordData.ORGANIZATION[i];
orgResults.push({NAME:orgResult.ORG_NAME,VALUE:orgResult.ORGANIZATION_ID,DETAILS:""});
}callback(orgResults);
}else{if("F"===status||"Z"===status){callback(new Array());
}}});
};
}function ProviderSearchControl(textBox){var selectedId=0;
var serviceDelegate=new ProviderServiceDelegate();
var orgSecurityInd=0;
var physicianOnlyInd=0;
var providerFilter=[];
var selectionHandler=function(newSelectedId){selectedId=newSelectedId;
};
var queryHandler=function(callback,searchString){if(searchString.replace(/\s+/g,"").length>2){autoSuggestControl.addLoadingSpinner();
serviceDelegate.getResults(searchString,function(results){callback.autosuggest(results);
autoSuggestControl.removeLoadingSpinner();
},orgSecurityInd,physicianOnlyInd,providerFilter);
}else{callback.autosuggest(new Array());
}};
var autoSuggestControl=new RCMAutoSuggestControl(textBox,queryHandler,selectionHandler,ToolTipDetailsHandler);
this.getSelectedProviderId=function(){return selectedId;
};
this.setSelectedProvider=function(providerId,providerName){selectedId=providerId;
textBox.value=providerName;
autoSuggestControl.setVerified(providerId>0);
};
this.setRequired=function(required){autoSuggestControl.setRequired(required);
};
this.isVerified=function(){return autoSuggestControl.isVerified;
};
this.enableProviderSearchOrgSecurity=function(isOrgSecurityEnabled){if(isOrgSecurityEnabled){orgSecurityInd=1;
}};
this.enablePhysicianOnlySearch=function(isPhysicianOnlyInd){if(isPhysicianOnlyInd){physicianOnlyInd=1;
}};
this.setAdvanceFilters=function(filterArray){if(filterArray){providerFilter=filterArray;
}};
this.addVerifyStateChangeListener=function(listener){autoSuggestControl.addVerifyStateChangeListener(listener);
};
this.removeVerifyStateChangeListener=function(listener){autoSuggestControl.removeVerifyStateChangeListener(listener);
};
var addEventHandler=function(element,event,handler){element.addEventListener?element.addEventListener(event,handler,false):element.attachEvent("on"+event,handler);
};
if(textBox.form){addEventHandler(textBox.form,"reset",function(){selectedId=0;
autoSuggestControl.setVerified(false);
});
}}function ProviderServiceDelegate(){var that=this;
this.getResults=function(searchString,callback,orgSecurityInd,physicianInd,providerFilter){var searchTokens=Search_Util.createPersonNameSearchTokens(searchString);
var nameLastKey=searchTokens[0]+"*";
var nameFirstKey=((searchTokens.length>1)?searchTokens[1]:"")+"*";
var json={RCM_PROVIDER_REQUEST:{MAX:10,NAME_LAST_KEY:nameLastKey,NAME_FIRST_KEY:nameFirstKey,PHYSICIAN_IND:physicianInd,INACTIVE_IND:0,FT_IND:0,NON_FT_IND:0,PRIV:[],PRSNL_GROUP_ID:0,LOCATION_CD:0,SEARCH_STR_IND:0,SEARCH_STR:"",TITLE_STR:"",SUFFIX_STR:"",DEGREE_STR:"",USE_ORG_SECURITY_IND:orgSecurityInd,ORGANIZATION_ID:0,ORGANIZATIONS:[],START_NAME:"",START_NAME_FIRST:"",CONTEXT_IND:0,CONTEXT_PERSON_ID:0,RETURN_ALIASES:0,RETURN_ORGS:1,RETURN_SERVICES:1,ALIAS_TYPE_LIST:"",PROVIDER_FILTER:providerFilter,AUTH_ONLY_IND:1}};
var requestArgs=[];
requestArgs.push("^MINE^","0.0","7","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",requestArgs,true,function(status,recordData){if("S"===status){var providerResults=[];
for(var i=0,length=recordData.PRSNL.length;
i<length;
i++){var providerResult=recordData.PRSNL[i];
providerResults.push({NAME:providerResult.NAME_FULL_FORMATTED.replace(/\s+$/,""),VALUE:providerResult.PERSON_ID,DETAILS:createProviderAdditionalDetails(providerResult)});
}if(recordData.PRSNL.length){callback(providerResults);
}else{callback([{NAME:rcm_search_i18n.NO_RESULTS_FOUND,VALUE:null,DETAILS:null}]);
}}else{if("F"===status){callback(new Array());
}else{if("Z"===status){callback([{NAME:rcm_search_i18n.NO_RESULTS_FOUND,VALUE:null,DETAILS:null}]);
}}}});
};
function createProviderAdditionalDetails(providerResult){var positionDetails="<strong>"+rcm_search_i18n.PROV_SEARCH_DETAILS_POSITIONS+"</strong>";
var isFirstPosition=true;
for(var i=0,positionsLength=providerResult.POSITIONS.length;
i<positionsLength;
i++){if(isFirstPosition){positionDetails+=providerResult.POSITIONS[i].POSITION_DISP;
isFirstPosition=false;
continue;
}positionDetails+=", "+providerResult.POSITIONS[i].POSITION_DISP;
}positionDetails+="<br />";
var servicesDetails="<strong>"+rcm_search_i18n.PROV_SEARCH_DETAILS_SERVICES+"</strong>";
var isFirstService=true;
for(var j=0,servicesLength=providerResult.SERVICE.lenth;
j<servicesLength;
j++){if(isFirstService){servicesDetails+=providerResult.SERVICE[j].SERVICE_DESC_NAME;
isFirstService=false;
continue;
}servicesDetails+=", "+providerResult.SERVICE[j].SERVICE_DESC_NAME;
}servicesDetails+="<br />";
var orgsDetails="<strong>"+rcm_search_i18n.PROV_SEARCH_DETAILS_ORGS+"</strong>";
var isFirstOrg=true;
var maxOrgsToDisplay=5;
for(var k=0,orgsLength=providerResult.ORG.length;
k<orgsLength;
k++){if(isFirstOrg){orgsDetails+=providerResult.ORG[k].ORG_NAME;
isFirstOrg=false;
continue;
}if(k==maxOrgsToDisplay){orgsDetails+=", "+rcm_search_i18n.PROV_SEARCH_MORE_ORGS_AVAILABLE;
break;
}orgsDetails+=", "+providerResult.ORG[k].ORG_NAME;
}return positionDetails+servicesDetails+orgsDetails;
}}// TODO: Move these i18n strings to the core i18n file, 
i18n.RCM_COMMUNICATION = "Communication";

//cross-origin resource sharing 
$.support.cors = true;

var RCM_Clinical_Util = function() {
	return {		
		getOauthToken : function(component, service, callback) {
			var sendAr = [];
			sendAr.push("^MINE^", "0.0", "^GETOAUTHINFO^");
			json = {"get_oauth_info_request":{"webService":service}};
			sendAr.push("^",JSON.stringify(json),"^");
	    	RCM_Clinical_Util.makeTimerCCLRequest(component, "RCM_OAUTH", sendAr, true,
	    		function(status, recordData, errorInfo) {
	    			callback(status, recordData);
	    		});
		},
		
		/**
		 * Returns the first component whose constructor matches the specified constructor. 
		 * 
		 * @param {Object} mPage The MPage.
		 * @param {Function} componentConstructor The component constructor function. 
		 * 
		 * @return {Object} Returns the component(s) whose constructor matches the specified constructor. Otherwise returns no value.
		 */
		getMPageComponent : function(mPage, componentConstructor) {
			var components = mPage.getComponents();
			if (components) {
				var foundDocuments = [];
				for (var pos = 0, length = components.length; pos < length; pos++) {
					if (components[pos] instanceof componentConstructor) {	
						foundDocuments.push(components[pos]);
					}
				}
				if (foundDocuments.length === 1) {
					return foundDocuments[0];
				}
				// It could have more than one component matches the type.
				else if (foundDocuments.length > 1) {
					return foundDocuments;
				}
			}
			else {
				alert("The MPage configuration has not be completed.  See your system admistrator.");
			}
		},
		
		/**
		 * Move all components in the MPage to the another location.
		 * @param {Object} mPage The MPage
		 * @param {Array} a list of excluded component
		 * @param {Object} the location the components to move to
		 * 
		 * @return {Object} the array map of components and original parent sections
		 */
		moveMpageComponent : function(mPage, excludedComponents, movedParentNode) {
			var movedComponentMap = {};
			var movedComponentArray = [];
			var movedComponentParentArray = [];
			var components = mPage.getComponents();
			for (var pos = 0, length = components.length; pos < length; pos++) {
				var component = components[pos];
				var excluded = false;
				for(var i = 0, excludedLength = excludedComponents.length; i < excludedLength; i++) {
					if(component === excludedComponents[i]) {
						excluded = true;
						break;
					}
				}
				if (excluded !== true) {
					// remember the old parent section.
					movedComponentArray.push(component.getRootComponentNode());
					movedComponentParentArray.push(component.getRootComponentNode().parentNode);
					// move components to new parent section.
					$(movedParentNode).append($(component.getRootComponentNode()));
				}
			}
			movedComponentMap["component"] = movedComponentArray;
			movedComponentMap["componetParent"] = movedComponentParentArray;
			return movedComponentMap;
		},
		
		/**
		 * Move back all components to original parent sections.
		 * @param {Object} the array map of components and original parent sections
		 */
		movebackMpageComponent : function(movedComponentMap) {
			var movedComponentArray = movedComponentMap["component"];
			var movedComponentParentArray = movedComponentMap["componetParent"];
			if (movedComponentArray && movedComponentParentArray) {
				for (var pos = 0, length = movedComponentArray.length; pos < length; pos++) {
					var componentNode = movedComponentArray[pos];
					var movebackNode = movedComponentParentArray[pos]; 
					$(movebackNode).append($(componentNode));
				}
			}
		},
		
		addNextMPageButton : function(parentNode, criterion, nextMPage, buttonLabel) {
			var button = Util.cep("input",{"type" : "button", "value" : buttonLabel, "className" : "next-mpage-button"});
			RCM_Clinical_Util.addNextMPageListener(criterion, nextMPage, button);
			parentNode.appendChild(button);
		},
		
		addNextMPageListener : function(criterion, nextMPage, button) {
			button.onclick = function() {	
				var pageParams = [];
				pageParams.push("^MINE^,");
				pageParams.push(criterion.person_id+",");		
				pageParams.push(criterion.encntr_id+",");
				pageParams.push(criterion.provider_id+",^");
				// Escape the backslashes in the static content path
				pageParams.push(criterion.static_content.replace(/\\/g, '\\\\')+"^,^");
				pageParams.push(nextMPage+"^,^powerchart.exe^,^");
				pageParams.push(criterion.backend_loc.replace(/\\/g, '\\\\')+"^");
				CCLLINK('mp_common_driver', pageParams.join(""), 1);
			};			
		},
		
		forwardNextMPage : function(criterion, nextMPage)
		{
			var pageParams = [];
			pageParams.push("^MINE^,");
			pageParams.push(criterion.person_id+",");		
			pageParams.push(criterion.encntr_id+",");
			pageParams.push(criterion.provider_id+",^");
			// Escape the backslashes in the static content path
			pageParams.push(criterion.static_content.replace(/\\/g, '\\\\')+"^,^");
			pageParams.push(nextMPage+"^,^powerchart.exe^,^");
			pageParams.push(criterion.backend_loc.replace(/\\/g, '\\\\')+"^");
			CCLLINK('mp_common_driver', pageParams.join(""), 1);
		},
		
		// Places the MPage components into the first column while maintaining their sequence order 
		moveComponentsIntoOneColumn : function(mPage) {
			var components = mPage.getComponents();
			var maxSequences = [];
			var firstColumn = 1;
			var length = components.length;
			var pos;
			var component;
			var column;			
			for (pos = 0; pos < length; pos++) {
				component = components[pos];
				column = component.getColumn();
				if (column < maxSequences.length) {
					maxSequences[column] = Math.max(maxSequences[column], component.getSequence());
				} 
				else {
					maxSequences[column] = component.getSequence();
				}
			}
			for (pos = 0; pos < length; pos++) {
				component = components[pos];
				column = component.getColumn();
				if(column > firstColumn) {
					var sequenceStart = 0;
					for(var nextColumn = firstColumn; nextColumn < column; nextColumn++) {
						sequenceStart += maxSequences[nextColumn];
					}
					component.setColumn(firstColumn);
					component.setSequence(component.getSequence()+sequenceStart);
				}
			}
			return firstColumn;
		}, 
		
		setColumnsToAvailableHeight : function(mPage, columnClasses) {			
			var columns = [];
			// The banner requires vertical space, hence the 0.90 multiplier
			var heightRatio = mPage.isBannerEnabled() ? 0.90 : 0.99;
			var height = gvs()[0] * heightRatio;
			for (var pos = 0, length = columnClasses.length; pos < length; pos++) {
				var column = Util.Style.g(columnClasses[pos], document, "div")[0];
				if (column) {
					column.style.height = height;
					columns.push(column);				
				}
			}
			return columns;
		}, 
		
		addDatePicker : function(component, textBoxId) {
			var defaultMonthDayYearForwardSlash = 'mm/dd/yyyy';
			var dayMonthYearForwardSlash = 'dd/mm/yyyy';
			var dayMonthYearPeriod = 'dd.mm.yyyy';
			var dayMonthYearDash = 'dd-mm-yyyy';
			var yearMonthDayForwardSlash = 'yyyy/mm/dd';
			var yearMonthDayDash = 'yyyy-mm-dd';
			var dateBoxId = "#"+textBoxId;
			var rcmDatePicker = {
				destroyDatePicker: function(component){
					$(document).ready(function(){
						$(dateBoxId).datepicker('destroy');
						var textBox = document.getElementById(textBoxId);
						textBox.invalidDate = false;
						if (textBox.dateSelectionListeners) {
							textBox.dateSelectionListeners = null;
						}
					});
				},			
				getDateFormat: function(component){
					var dateFormat = $(dateBoxId).datepicker('option', 'dateFormat');
					var newDateFormat;
					if(dateFormat == 'mm/dd/yy' || dateFormat == 'dd/mm/yy' || dateFormat == 'dd.mm.yy' || dateFormat == 'dd-mm-yy')
					{	
						newDateFormat = dateFormat + 'yy';
					}
					else{
						newDateFormat = 'yy' + dateFormat;
					}
					return newDateFormat;
				},
				clearDateTextBox: function(textbox){
					textbox.focus();
					textbox.select();
				},

				daysInTheMonth: function(monthToCheck, yearToCheck){
					if ((monthToCheck == "01") || (monthToCheck == "03") || (monthToCheck == "05") ||
					(monthToCheck == "07") ||
					(monthToCheck == "08") ||
					(monthToCheck == "10") ||
					(monthToCheck == "12")) {
						return 31;
					}
					
					if (monthToCheck == "02") {
						if ((yearToCheck % 100 === 0) && (yearToCheck % 400 === 0)) {
							return 29;
						}
						
						else {
							if ((yearToCheck % 4) === 0) {
								return 29;
							}
							return 28;
						}
					}
					
					if ((monthToCheck == "04") || (monthToCheck == "06") || (monthToCheck == "09") || (monthToCheck == "11")) {
						return 30;
					}
				},
				isDateValid: function(monthDigits, dayDigits, yearDigits){
					if (dayDigits > this.daysInTheMonth(monthDigits, yearDigits)) {
						return 0;
					}
					return 1;
				},
				checkDate: function(textbox){
					var dateString = textbox.value;
					var dateFormat = rcmDatePicker.getDateFormat(textbox);
					var firstMonthDigit;
					var secondMonthDigit;
					var firstDayDigit;
					var secondDayDigit;
					var monthDigits;
					var dayDigits;
					var yearDigits;
					// Date invalid if it's less than 10
					if (dateString.length < 10)
					{
						return 0;
					}
					if (dateFormat == defaultMonthDayYearForwardSlash) {
						firstMonthDigit = parseInt(dateString.charAt(0));
						secondMonthDigit = parseInt(dateString.charAt(1));
						firstDayDigit = parseInt(dateString.charAt(3));
						secondDayDigit = parseInt(dateString.charAt(4));
						monthDigits = dateString.charAt(0) + dateString.charAt(1);
						dayDigits = dateString.charAt(3) + dateString.charAt(4);
						yearDigits = dateString.charAt(6) + dateString.charAt(7) + dateString.charAt(8) + dateString.charAt(9);
					}
					
					else if(dateFormat == dayMonthYearForwardSlash || dateFormat == dayMonthYearPeriod || dateFormat == dayMonthYearDash){
						firstDayDigit = parseInt(dateString.charAt(0));
						secondDayDigit = parseInt(dateString.charAt(1));
						firstMonthDigit = parseInt(dateString.charAt(3));
						secondMonthDigit = parseInt(dateString.charAt(4));
						dayDigits = dateString.charAt(0) + dateString.charAt(1);
						monthDigits = dateString.charAt(3) + dateString.charAt(4);
						yearDigits = dateString.charAt(6) + dateString.charAt(7) + dateString.charAt(8) + dateString.charAt(9);
					}
					
					else if(dateFormat == yearMonthDayForwardSlash || dateFormat == yearMonthDayDash){
						firstMonthDigit = parseInt(dateString.charAt(5));
						secondMonthDigit = parseInt(dateString.charAt(6));
						firstDayDigit = parseInt(dateString.charAt(8));
						secondDayDigit = parseInt(dateString.charAt(9));
						yearDigits = dateString.charAt(0) + dateString.charAt(1) + dateString.charAt(2) + dateString.charAt(3);
						monthDigits = dateString.charAt(5) + dateString.charAt(6);
						dayDigits = dateString.charAt(8) + dateString.charAt(9);
					}
					
					if ((firstMonthDigit !== 0) && (firstMonthDigit != 1)) {
						return 0;
					}
					
					else 
						if (firstMonthDigit == 1) {
							if ((secondMonthDigit < 0) || (secondMonthDigit > 2)) {
								return 0;
							}
						}
						
						else 
							if (firstMonthDigit === 0) {
								if ((secondMonthDigit < 1) || (secondMonthDigit > 9)) {
									return 0;
								}
							}
							
							else 
								if ((firstDayDigit < 0) || (firstDayDigit > 3)) {
									return 0;
								}
								else 
									if ((firstDayDigit === 0)) {
										if ((dateString.charAt(4) < 1) || (dateString.charAt(4) > 9)) {
											return 0;
										}
									}
									else 
										if ((firstDayDigit == 1) || (firstDayDigit == 2)) {
											if ((secondDayDigit < 0) || (secondDayDigit > 9)) {
												return 0;
											}
										}
										else 
											if (firstDayDigit == 3) {
												if ((secondDayDigit !== 0) || (secondDayDigit != 1)) {
													return 0;
												}
											}
					
					var isDate = this.isDateValid(monthDigits, dayDigits, yearDigits);
					if (isDate === 0) {
						return 0;
					}
					return 1;
				},
				setMaxDate : function(maxDate) {
					this.maxDate = maxDate;
					$(dateBoxId).datepicker("option", "maxDate", maxDate);
				},
				setMinDate : function(minDate) {
					this.minDate = minDate;
					$(dateBoxId).datepicker("option", "minDate", minDate);
				},
				adjustDateForMinMaxRange: function(){
					var date = $(dateBoxId).datepicker("getDate");
					if(date){
						if(this.maxDate && date > this.maxDate){
							RCM_Clinical_Util.setDate(textBoxId, null);
						}
						if(this.minDate && date < this.minDate){
							RCM_Clinical_Util.setDate(textBoxId, null);
						}						
					}
				},
				dateTextBoxLoseFocus: function(textbox){
					var validDate = rcmDatePicker.checkDate(textbox);
					// allow date to be blank out, and default date is null
					if (validDate === 0 && textbox.value.length != 0) {
						textbox.focus();
						textbox.select();
						textbox.style.background = '#FFF380';
						textbox.invalidDate = true;
						alert("Please enter a valid date in the format of " + rcmDatePicker.getDateFormat(textbox));
					}
					else {
						textbox.invalidDate = false;
						textbox.style.background = "#FFFFFF";
					}
				},
				dateTextBoxChange: function(textbox){
					if(textbox.value.length > 0){
						rcmDatePicker.adjustDateForMinMaxRange();
					}
				},
				applyMask: function(textbox){
					var dateText = textbox;
					dateText.value.replace("/", "");
					var length = dateText.value.length;
					var dateFormat = rcmDatePicker.getDateFormat(dateText);
					// ignore all others
					if( !(event.keyCode == 46                                   // delete
							|| (event.keyCode >= 35 && event.keyCode <= 40)     // arrow keys/home/end
						    || (event.keyCode >= 48 && event.keyCode <= 57)     // numbers on keyboard
						    || (event.keyCode >= 96 && event.keyCode <= 105))   // number on keypad
					   ) {
						return;
					}
					if (dateFormat == defaultMonthDayYearForwardSlash || dateFormat == dayMonthYearForwardSlash) {
						if (length == 2) {
							dateText.value = dateText.value + '/';
						}
						
						if (length == 5) {
							dateText.value = dateText.value + '/';
						}
					}
					else if(dateFormat == dayMonthYearPeriod){
						if(length == 2){
							dateText.value = dateText.value + '.';
						}
						if(length == 5){
							dateText.value = dateText.value + '.';
						}
					}
					else if (dateFormat == dayMonthYearDash){
						if(length == 2){
							dateText.value = dateText.value + '-';
						}
						if(length == 5){
							dateText.value = dateText.value + '-';
						}
					}
					
					else if(dateFormat == yearMonthDayForwardSlash){
						if(length == 4){
							dateText.value = dateText.value + '/';
						}
						if(length == 7){
							dateText.value = dateText.value + '/';
						}
					}
					else if(dateFormat == yearMonthDayDash){
						if(length == 4){
							dateText.value = dateText.value + '-';
						}
						if(length == 7){
							dateText.value = dateText.value + "-";
						}
					}
				}
			};			
			// Initialize the date picker
			$(document).ready(function(){
				var dateTextBox = document.getElementById(textBoxId);
				dateTextBox.addDateSelectionListener = function(listener) {
					if (!this.dateSelectionListeners) {
						this.dateSelectionListeners = [];
					}
					this.dateSelectionListeners.push(listener);
				}
				$(function(){
					$.datepicker.setDefaults($.datepicker.regional['']);
					$(dateBoxId).datepicker($.extend({},$.datepicker.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
						showOn: 'button',
                        duration: '',
						buttonImage: component.getCriterion().static_content + '\\images\\4974.png',
						dateFormat: dateFormat.masks.shortDate3,
						buttonImageOnly: true,
						buttonText: i18n.RCM_DATEPICKER_TEXT,
						showOtherMonths: true,
						selectOtherMonths: true,
						showMonthAfterYear: false,
						beforeShow : function() {
							//set maximum z-index on the calendar pop-up.
							$('#ui-datepicker-div').css('z-index',9999999);
						},
						onSelect : function(dateText, inst) {
							if (dateTextBox.dateSelectionListeners) {
								for (var listener = 0, length = dateTextBox.dateSelectionListeners.length; listener < length; listener++) {
									dateTextBox.dateSelectionListeners[listener]();
								}
							}
							dateTextBox.focus();
						}
					}));
					RCM_Clinical_Util.setDate(textBoxId, new Date());
					
				});
				dateTextBox.onfocus = function() {
					rcmDatePicker.clearDateTextBox(dateTextBox);
				};
				dateTextBox.onblur = function() {
					rcmDatePicker.dateTextBoxLoseFocus(dateTextBox);
				};
				dateTextBox.onchange = function() {
					rcmDatePicker.dateTextBoxChange(dateTextBox);
				};
				dateTextBox.onkeypress = function(e) {
					var keynum;
					
					if(window.event){
						keynum = event.keyCode;
					}
					else if(e.which){
						keynum = e.which;
					}
					
					var currentDate = $(dateBoxId).datepicker("getDate");
					if(currentDate == null){
						currentDate = new Date();
					}

					var currentMonth = currentDate.getMonth();
					var currentYear = currentDate.getFullYear();
					
					if(keynum === 116){//t-today's date
						$(dateBoxId).datepicker('setDate', new Date());
					}
					else if(keynum === 119){//w-beginning of week
						var day = currentDate.getDay();
						var diff = currentDate.getDate() - day;
						var beginningOfWeek = new Date(currentDate.setDate(diff));
						$(dateBoxId).datepicker('setDate', beginningOfWeek);
					}
					else if(keynum === 107){//k-end of week
						var day = 6 - currentDate.getDay();
						var diff = currentDate.getDate() + day;
						var endOfWeek = new Date(currentDate.setDate(diff));
						$(dateBoxId).datepicker('setDate', endOfWeek);
					}
					else if(keynum === 121){//y-beginning of year
					  var beginningOfYear = new Date(currentYear, 0, 1);
					  $(dateBoxId).datepicker('setDate', beginningOfYear);
					}
					else if(keynum === 114){//r-end of year
					  var endOfYear = new Date(currentYear, 11, 31);
					   $(dateBoxId).datepicker('setDate', endOfYear);
					}
					else if(keynum === 109){//m-beginning of month
						var beginningOfMonth = new Date(currentYear, currentMonth, 1);
						$(dateBoxId).datepicker('setDate', beginningOfMonth);
					}
					else if(keynum === 104){//h-end of month
						var endOfMonth;
						
						if(currentMonth == 3 || currentMonth == 5  || currentMonth == 8 || currentMonth == 10){
							endOfMonth = new Date(currentYear, currentMonth, 30);
						}
						else if(currentMonth == 1){
							if(currentYear%400== 0 ||(currentYear%100 != 0 && currentYear%4 == 0)){
								endOfMonth = new Date(currentYear, currentMonth, 29);
							}
							else{
								endOfMonth = new Date(currentYear, currentMonth, 28);
							}
						}
						else{
							endOfMonth = new Date(currentYear, currentMonth, 31);
						}
						$(dateBoxId).datepicker('setDate', endOfMonth);
					}
					else if(keynum === 43 || keynum === 61){// + : increment day
						var nextDay = currentDate.getDate() + 1;
						var incrementDay = new Date(currentYear, currentMonth, nextDay);
						$(dateBoxId).datepicker('setDate', incrementDay);
					}
					else if(keynum === 45){// - : decrement day
						var previousDay = currentDate.getDate() - 1;
						var decrementDay = new Date(currentYear, currentMonth, previousDay);
						$(dateBoxId).datepicker('setDate', decrementDay);
					}
					rcmDatePicker.applyMask(dateTextBox);
				};
				dateTextBox.onkeydown = function(e) {// For special characters
					var keynum;
					
					if(window.event){
						keynum = event.keyCode;
					}
					else if(e.which){
						keynum = e.which;
					}
					
					var currentDate = $(dateBoxId).datepicker("getDate");
					if(currentDate == null){
						currentDate = new Date();
					}
					
					var currentMonth = currentDate.getMonth();
					var currentYear = currentDate.getFullYear();
					var currentDay = currentDate.getDate();
					
					if(keynum === 38){// UP ARROW : increment day
						var nextDay = currentDate.getDate() + 1;
						var incrementDay = new Date(currentYear, currentMonth, nextDay);
						$(dateBoxId).datepicker('setDate', incrementDay);
						return false; // Returning false cancels the default action performed by this key
					}
					else if(keynum === 40){// DOWN ARROW : decrement day
						var previousDay = currentDate.getDate() - 1;
						var decrementDay = new Date(currentYear, currentMonth, previousDay);
						$(dateBoxId).datepicker('setDate', decrementDay);
						return false;
					}
					else if(keynum === 33){// PAGE UP : increment month
						var incrementMonth = new Date(currentYear, currentMonth + 1, currentDay);
						$(dateBoxId).datepicker('setDate', incrementMonth);
						return false; // Returning false cancels the default action performed by this key
					}
					else if(keynum === 34){// PAGE DOWN : decrement month
						var decrementMonth = new Date(currentYear, currentMonth - 1, currentDay);
						$(dateBoxId).datepicker('setDate', decrementMonth);
						return false;
					}
					rcmDatePicker.applyMask(dateTextBox);
				};	
			});
			
			return rcmDatePicker;
		},
		//TODO: Is this used anywhere.  Seems outdated duplicate to previous function.
		addDatePickerButton : function(component, textBoxId, updateElementId) {
			$(document).ready(function(){
			var dateTextBox = document.getElementById(textBoxId);
			var dateBoxId = "#"+textBoxId;
			dateTextBox.style.display = "none";
			$(function(){
				var updateElement = document.getElementById(updateElementId);
				$.datepicker.setDefaults($.datepicker.regional['']);
				$(dateBoxId).datepicker($.extend({},$.datepicker.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
					showOn: 'button',
					dateFormat: dateFormat.masks.shortDate3,
					buttonImage: component.getCriterion().static_content + '\\images\\4974.png',
					buttonImageOnly: true,
					buttonText: i18n.RCM_DATEPICKER_TEXT,
					showOtherMonths: true,
					selectOtherMonths: true,
					showMonthAfterYear: false,
					beforeShow : function() {
						dateTextBox.style.display = "inline";
						dateTextBox.style.width = "1px";
						dateTextBox.style.height = "1px";
					},
					onClose : function() {
						var date = $(dateBoxId).datepicker("getDate");
						if (date) {
							updateElement.innerHTML = date.format('shortDate2'); 
						}
						dateTextBox.style.display = "none";
					}
				}));
				RCM_Clinical_Util.setDate(textBoxId, new Date());
			});
			});
		},
		
		showDatePicker : function(updateElement, anchorElementId) {	
			$(document).ready(function(){
			var anchorElement = document.getElementById(anchorElementId);
			if (anchorElement.isDateAttached) {				
				anchorElement.style.display = "inline";				
				$("#"+anchorElementId).datepicker('show');				
			}
			else {	
				$(function(){
					$("#"+anchorElementId).datepicker($.extend({},$.datepicker.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
						showOn: "focus",
						showOtherMonths: true,
						selectOtherMonths: true,
						showMonthAfterYear: false,
						
						onClose: function() { 
							var date = $("#"+anchorElementId).datepicker("getDate");
							if (date) {
								updateElement.innerHTML = date.format('shortDate2'); 
							}
							anchorElement.style.display = "none";
						}
					}));
					anchorElement.isDateAttached = true;
					anchorElement.style.display = "inline";						
					$("#"+anchorElementId).datepicker('show');
				});					
			}
			});
		}, 
		getDate : function(dateElementId) {
			var date;
			$(document).ready(function(){
				date = $("#"+dateElementId).datepicker("getDate");
			});
			return date;
		},
        getTime : function(elementId) {
            var time;
            $(document).ready(function(){
                time = $("#"+elementId).timeEntry('getTime');
            });
            return time;
        },	
        formatLongDate : function(date){
        	if (date) {
        		return date.format("dd-mmm-yyyy HH:MM:ss");
        	}
        	return "";
        },	
		formatDate : function(date) {
			if (date) {
				return date.format('shortDate2');
			}
			return "";
		},
		formatJsonDateString : function(dateString) {
			var formattedString = "";
			if (dateString && dateString !== "") {
				var date = new Date();
				date.setISO8601(dateString);
				formattedString = RCM_Clinical_Util.formatDate(date);
			}
			return formattedString;
		},
		formatJsonTimeString : function(dateString) {
			var formattedString = "";
			if (dateString && dateString !== "") {
				var date = new Date();
				date.setISO8601(dateString);
				if(i18n.SET24HOUR ){
					formattedString = date.format('HH:MM');
				}else{
					formattedString = date.format("hh:MM tt");
				}
			}
			return formattedString;
		},	
		formatJsonDateAndTimeString : function(dateString, format) {
			var formattedString = "";
			if (dateString && dateString !== "") {
				var date = new Date();
				date.setISO8601(dateString);
				if (format && format !== "")
				{	
					formattedString = date.format(format);
				}
				else
				{
					formattedString = date.format("longDateTime2");
				}	
			}
			return formattedString;
		},
		getTodaysDate: function(){
			var tempDay = new Date();
			var date = tempDay.format('shortDate2');
			return date;
		},
		
		getTodaysTime: function(){
			var now = new Date();
			if(i18n.SET24HOUR){
				var date = now.format('HH:MM');
			}else{
				var date = now.format("hh:MM tt");
			}
			return date;			
		},
		
		getDateString : function(dateElementId) {
			return this.formatDate(this.getDate(dateElementId));
		},
		setDateString : function(dateElementId, dateString) {
			var date = new Date();
			if (dateString && dateString.length > 0) {
				date.setISO8601(dateString);
				$(document).ready(function(){
					RCM_Clinical_Util.setDate(dateElementId, date);
				});
			}
			// allow set date to null
			else
			{
				$(document).ready(function(){
					RCM_Clinical_Util.setDate(dateElementId, null);
				});
			}
		},
		/**
		 * This should be used over the setDate function on the datepicker until the following jQuery bug is fixed:
		 * http://bugs.jqueryui.com/ticket/4198
		 * @param dateElementId The date element id.
		 * @param date The date to set.
		 */
		setDate : function(dateElementId, date) {
			var $dateField = $("#" + dateElementId);
			if(date) {
				var dateFormat = $dateField.datepicker('option', 'dateFormat');
				$dateField.val($.datepicker.formatDate(dateFormat, date));
			}
			else {
				$dateField.val("");
			}
		},
		setTimeString : function(elementId, dateString) {
			var date = new Date();
			if (dateString && dateString.length > 0) {
				date.setISO8601(dateString);
				$(document).ready(function(){
					$("#"+elementId).timeEntry("setTime", date);
				});
			}
			// allow set date to null
			else
			{
				$(document).ready(function(){
					$("#"+elementId).timeEntry("setTime", null);
				});
			}
		},		
		
		/**
		 * <p>Formats a date/time string into CCL date/time format. The date/time string must be 
		 * in the following format: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'", which is named "isoUtcDateTime" in 
		 * the date.format.js file. When popluated the date/time string should look similar to this string: 
		 * "2012-03-10T21:42:00Z". The format of the returned string is "dd-mmm-yyyy HH:MM:ss" whose symbols 
		 * are defined in the date.format.js file.</p>
		 *
		 * <p>NOTE: This method always sets the time in the returned string to (00:00:00). To preserve the time
		 * from the passed in date/time string use <code>formatDateAndTimeStringForSave</code> instead.</p> 
		 * 
		 * @param dateTimeString {String} The date/time string to format. 
		 * @returns A date/time string in a CCL date/time format.
		 */
		formatDateStringForSave : function(dateString) {
			var formattedString = [];
			if (dateString && dateString !== "") {
				var date = new Date();
				//TODO: setISO8601 would convert a string '10/19/2010' to '31-Dec-2009 00:00:00'
				date.setISO8601(dateString);
				formattedString.push(date.format("dd-mmm-yyyy"));
				formattedString.push(" 00:00:00");
			}
			return formattedString.join("");
		},	
		
		/**
		 * Formats a date/time string into CCL date/time format. The date/time string must be 
		 * in the following format: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'", which is named "isoUtcDateTime" in 
		 * the date.format.js file. When popluated the date/time string should look similar to this string: 
		 * "2012-03-10T21:42:00Z". The format of the returned string is "dd-mmm-yyyy HH:MM:ss" whose symbols 
		 * are defined in the date.format.js file.
		 * 
		 * @param dateTimeString {String} The date/time string to format. 
		 * @returns A date/time string in a CCL date/time format.
		 */
		formatDateAndTimeStringForSave : function(dateTimeString) {
			var formattedDateTime = "";		
			if (dateTimeString && dateTimeString !== "") {
				var date = new Date();
				date.setISO8601(dateTimeString);
				formattedDateTime = date.format("dd-mmm-yyyy HH:MM:ss");
			}
			return formattedDateTime;			
		},
		
		//turns HTML code and inserts escape codes to make it printable
		loggingHtmlToText : function(str) {
			return String(str).replace(/&/g, '&amp').replace(/</g, '&lt').replace(/>/g, '&gt').replace(/"/g, '&quot');
		},

		loggingFunctionFormatter : function(str){
			str = str.replace(/{/g, "{<br>").replace(/;/g, ";<br>").replace(/}/g, "}<br>");
			for(line in indent = 1, lines = str.split("<br>")) {
				if(lines.hasOwnProperty(line)) {
					if(lines[line].indexOf("}") > -1) indent--;
					lines[line] = new Array(((indent-1)*4)+1).join("&nbsp;") + lines[line];
					if(lines[line].indexOf("{") > -1) indent++;
				}
			}
			return lines.join("<br>");
		},

		loggingJsonFormatter : function(object) {	
			if (object != null){
				return JSON.stringify(object, undefined, 4).replace(/[ ]/g, "&nbsp;").replace(/\n/g, "<br />");
			}
			else{
				return "";
			}
		},
		
		loggingIsValidJsonToParse : function(str){
			try{
				JSON.parse(str);
			}
			catch (err){
				return false;
			}
			return true;
		},
		
		loggingParseParamAr : function(tempParamAr){
			var temp = JSON.stringify (tempParamAr[3]);
			temp = temp.replace(/\^/g, "").replace(/\\\"/g, "\"").replace(/(^[\"])|([\"]$)/g, "");
			if (RCM_Clinical_Util.loggingIsValidJsonToParse(temp)){
				temp = RCM_Clinical_Util.loggingJsonFormatter(JSON.parse(temp));
			}
			else{
				temp = "";
			}
			return tempParamAr[0] + "<br />" +
				tempParamAr[1] + "<br />" +
				tempParamAr[2] + "<br />" + 
				temp;
		},
		
		loggingJqxhrFormatter: function(tempJQXHR){
			var str = "";
			var jsonTemp = JSON.stringify(tempJQXHR.responseText).substring(1,(JSON.stringify(tempJQXHR.responseText).length-1)).replace(/\\\"/g, "\"");
			if(RCM_Clinical_Util.loggingIsValidJsonToParse(jsonTemp)){
				jsonTemp = JSON.parse (jsonTemp);
			}
			else{
				jsonTemp = tempJQXHR.responseText;
			}
			str += "Ready State: " + tempJQXHR.readyState + "<br />" +
			"Response Text: " + RCM_Clinical_Util.loggingJsonFormatter (jsonTemp) + "<br />" +
			"Status: " + tempJQXHR.status + "<br />" +
			"Status Text: " + tempJQXHR.statusText;
			return str;
		},

		makeCCLRequest : function(program, paramAr, async, statusHandler, isDecodeJSON, skipDebug) {
			var info = new XMLCclRequest();
			info.onreadystatechange = function(){
				var tempStatus;
				if (window.log && log.isBlackBirdActive()){
					tempStatus = RCM_Clinical_Util.loggingHtmlToText (statusHandler);
					tempStatus = RCM_Clinical_Util.loggingFunctionFormatter (tempStatus);
				}
				if (info.readyState === 4 && info.status === 200){	
					if (statusHandler) {
						var jsonEval = isDecodeJSON ? RCM_Clinical_Util.parseJSON(info.responseText) : JSON.parse(info.responseText);
						var recordData = jsonEval.RECORD_DATA;
						var jsonParamARTempString = "";
						if (window.log && log.isBlackBirdActive()){
							jsonParamARTempString = RCM_Clinical_Util.loggingParseParamAr(paramAr);
						}
						if (recordData.STATUS_DATA.STATUS === "Z") {
							if (window.log && !skipDebug && log.isBlackBirdActive()){
								log.debug(["Program: ", program,
								"<br />paramAr: ", jsonParamARTempString,
								"<br />Function: ", tempStatus, 
								"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
							}
							statusHandler("Z", recordData);
						}
						else if (recordData.STATUS_DATA.STATUS === "S") {
							if (recordData.STATUS === "STALE_DATA") {							
								statusHandler("STALE_DATA", recordData);
							} 
							else {
								if (window.log && !skipDebug && log.isBlackBirdActive()){
									log.debug(["Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ", tempStatus, 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}
								statusHandler("S", recordData);
							}
						}
						else {
							if (window.log && log.isBlackBirdActive()){
								log.error(["Program: ", program,
								"<br />paramAr: ", jsonParamARTempString,
								"<br />Function: ", tempStatus, 
								"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}
							statusHandler("F", recordData);
						}
					}
				}
				else if (info.readyState === 4 && info.status !== 200) {
					if(window.log && log.isBlackBirdActive()){
						log.error(["Program: ", program, 
						"<br />paramAr: ", paramAr.join(","), 
						"<br />Function: ", tempStatus, 
						"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
					}
					statusHandler("F", recordData);					
				}
			};
            info.open('GET', program, async);
            info.send(paramAr.join(","));
		},
		
		makeTimerCCLRequest : function(component, program, paramAr, async, statusHandler, isDecodeJSON) {
			var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
			var info = new XMLCclRequest();
			info.onreadystatechange = function(){
				if (info.readyState === 4 && info.status === 200){
					try {
						if (statusHandler) {
							var jsonEval = isDecodeJSON ? RCM_Clinical_Util.parseJSON(info.responseText) : JSON.parse(info.responseText);
							var recordData = jsonEval.RECORD_DATA;
							var jsonParamARTempString = ""; 
							if (window.log && log.isBlackBirdActive()){
								jsonParamARTempString = RCM_Clinical_Util.loggingParseParamAr(paramAr);
							}
							if (recordData.STATUS_DATA.STATUS === "Z") {
								statusHandler("Z", recordData);
								if (window.log && log.isBlackBirdActive()){
									log.debug(["Component: ", ( component ? component.getLabel() : ""),
									"<br />ID: ", ( component ? component.getComponentId() : ""),
									"<br />Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ",  RCM_Clinical_Util.loggingFunctionFormatter (statusHandler), 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}
							}
							else if (recordData.STATUS_DATA.STATUS === "S") {
								statusHandler("S", recordData);
								if (window.log && log.isBlackBirdActive()){
									log.debug(["Component: ", ( component ? component.getLabel() : ""),
									"<br />ID: ", ( component ? component.getComponentId() : ""),
									"<br />Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ",  RCM_Clinical_Util.loggingFunctionFormatter (statusHandler), 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}

							}
							else {
								var exceptionInfo = [];
								var debugErrorMessage = recordData.debugErrorMessage;
								var exceptionType = recordData.exceptionType;
								var entityType = recordData.entityType;
								var entityId = recordData.entityId;
								var combinedIntoId = recordData.combinedIntoId;
								exceptionInfo.push(debugErrorMessage, exceptionType, entityType, entityId, combinedIntoId);
								statusHandler("F", recordData, exceptionInfo.join(""));
								if (window.log && log.isBlackBirdActive()){	
									log.error(["Component: ", ( component ? component.getLabel() : ""),
									"<br />ID: ", ( component ? component.getComponentId() : ""),
									"<br />Program: ", program, 
									"<br />paramAr: ", jsonParamARTempString,
									"<br />Function: ",  RCM_Clinical_Util.loggingFunctionFormatter (statusHandler), 
									"<br />RecordData: ",   RCM_Clinical_Util.loggingJsonFormatter(recordData)].join(""));
								}

							}
						}
					}
					catch (err) {
						 if (timerLoadComponent) {
	                         timerLoadComponent.Abort();
	                         timerLoadComponent = null;
	                     }
					}
				    finally {
	                     if (timerLoadComponent) 
	                         timerLoadComponent.Stop();
	                }
				}
				else if (info.readyState === 4 && info.status !== 200) {
					if (window.log && log.isBlackBirdActive()){
						log.error(["Component: ", ( component ? component.getLabel() : ""),
						"<br />ID: ", ( component ? component.getComponentId() : ""),
						"<br />Program: ", program, 
						"<br />paramAr: ", jsonParamARTempString,
						"<br />Function: ", statusHandler, 
						"<br />status: ", recordData.STATUS_DATA.STATUS, 
						"<br />RecordData: ", JSON.stringify(recordData.STATUS_DATA.STATUS)].join(""));
					}
					statusHandler("F", null, "Http status: " + info.status);	
					if (timerLoadComponent) {
						timerLoadComponent.Abort();
					}
				}
				
			};
            info.open('GET', program, async);
            info.send(paramAr.join(","));
		}, 
		
		addColumnVerticalScrolling : function(mPage, column1, column2, minContentHeight) {
			if (column1) {
				column1.style.overflowY = "scroll";			
			}
			if (column2) {
				column2.style.overflowY = "scroll";
			}
			
			document.documentElement.style.overflowY = "hidden";
			window.scrollTo(0,0);
			
			var heightRatio = mPage.isBannerEnabled() ? 85 : 75;
			var resizeFunction = function() {				
				var height = gvs()[0] - heightRatio;
				var styleHeight;
				if (height < minContentHeight) {
					styleHeight = height + "px";
				}
				else {
					styleHeight = height + "px";
				}
				if (column1) {
					column1.style.height = styleHeight;
				}
				if (column2) {
					column2.style.height = styleHeight;
				}
			};
			Util.addEvent(window, "resize", resizeFunction);
			resizeFunction();
			return resizeFunction;
		},
		
		removeColumnVerticalScrolling : function(column1, column2, resizeFunction) {
			if (column1) {
				column1.style.overflowY = "";
				column1.style.height = "";
			}
			if (column2) {
				column2.style.overflowY = "";
				column2.style.height = "";
			}
			
			document.documentElement.style.overflowY = "scroll";
			if(resizeFunction) {
				Util.removeEvent(window, "resize", resizeFunction);
			}
		},
		
		getElementsByClassName : function(parentElement, tagName, className) {
			return Util.Style.g(className, parentElement, tagName);
		},
		/**
		 * The method uses jQuery masked input plugin to mask text box.  
		 * The method takes two arguments: the text box id and the mask string.
		 */
		addMaskToTextBox : function(textBoxId, maskString) {
			jQuery(document).ready(function($) {var setMask = $("#"+textBoxId).mask(maskString, {placeholder : " "});});
		},
		
		/**
		 * The method uses jQuery masked input plugin to unmask text box.  
		 * The method takes one arguments: the text box id.
		 */
		unmaskTextBox : function(textBoxId) {
			jQuery(document).ready(function($) {var setMask = $("#"+textBoxId).unmask();});
		},
		
		addRequiredDecorator : function(element) {
			// Prevent all labels from being decorated when the element doesn't have an id
			if (!element.id) {
				return;
			}			
			var labels = document.getElementsByTagName("label");
			for ( var i = 0, length = labels.length; i < length; i++) {
				if (labels[i].htmlFor === element.id && labels[i].innerHTML.substring(13,27).toLowerCase().search("color: #cc0000") === -1) {
						labels[i].innerHTML = "<span style='color:#cc0000'>*</span>" + labels[i].innerHTML;
				}
			}
		},
		
		removeRequiredDecorator : function(element) {
			var labels = document.getElementsByTagName("label");
			for ( var i = 0, length = labels.length; i < length; i++) {
				if (labels[i].htmlFor === element.id && labels[i].innerHTML.substring(13,27).toLowerCase().search("color: #cc0000") !== -1) {
					labels[i].innerHTML = labels[i].innerHTML.substring(37);
				}
			}
		},
		
		/**
		 * This method masks the required field decoration.  
		 */
		maskRequiredField : function(textBoxId) {
			if (textBoxId) {
				var requiredTextBox = document.getElementById(textBoxId);
			}
			if (requiredTextBox) {
				// Attempt to add the required decorator (red star) in case it hasn't been added yet.
				RCM_Clinical_Util.addRequiredDecorator(requiredTextBox);
				if (requiredTextBox.type === "text" || requiredTextBox.type === "textarea" || requiredTextBox.type === "select-one"
					|| requiredTextBox.type === "select-multiple") {
						requiredTextBox.style.backgroundColor = '#FFFCE1';
				}	
			}
		},

		/**
		 * This method un-masks the required field decoration.
		 */
		umMaskRequiredField : function(textBoxId) {
			if (textBoxId) {
				var requiredTextBox = document.getElementById(textBoxId);
			}
			if (requiredTextBox) {
				if (requiredTextBox.type === "text" || requiredTextBox.type === "textarea" || requiredTextBox.type === "select-one"
					|| requiredTextBox.type == "select-multiple") {
					requiredTextBox.style.backgroundColor = 'transparent';
				}
			}
		},
		
		removeRequiredField : function(formObject, fieldId, fieldType, flexButtonIds) {
			var element = document.getElementById(fieldId);
			if(element && element.requiredCheck) {
				switch(fieldType.toLowerCase()) {
				case "date":
					break;
				case "select":
					Util.removeEvent(element,"change",element.requiredCheck);
					break;
				case "textarea":
				case "text":
				case "maskedtext":
					Util.removeEvent(element, "keydown", element.requiredCheckLater);
					Util.removeEvent(element, "paste", element.requiredCheckLater);
					Util.removeEvent(element, "cut", element.requiredCheckLater);
					Util.removeEvent(element, "drop", element.requiredCheckLater);
					break;
				case "radio":
					// TODO: Add a remove for radio buttons
					return;
					break;				
				}
				element.isRequired = undefined;
				element.requiredCheck = undefined;
				
				// Remove the element from the form object's required elements array.
				if (formObject.requiredElements) {
					for(var i = 0; i < formObject.requiredElements.length; i++) {
						if(formObject.requiredElements[i] === element) {
							formObject.requiredElements.splice(i,1);
							break;
						}
					}
				}
				
				// Update the flex buttons if there are no remaining 
				var disabled = RCM_Clinical_Util.isAnyFieldRequired(formObject);
				if (flexButtonIds && flexButtonIds.length > 0) {
					for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
						var flexButton = document.getElementById(flexButtonIds[id]);
						if (flexButton) {
							flexButton.disabled = disabled;
						}
					}
				}
				
				RCM_Clinical_Util.removeRequiredDecorator(element);
				RCM_Clinical_Util.umMaskRequiredField(fieldId);
			}
		},
		
		/**
		 * Sets a search control's required state.
		 * 
		 * @param isRequired {Boolean} Whether the search control is required or not.
		 * @param formObject {Object} formObject An object for containing a list of required fields. 
		 * @param {String} fieldId The id of the html element for the search control.
		 * @param {Object} searchControl The search control object.
		 * @param {Array} flexButtonIds (Optional) An array of an html button element ids that are disabled when at least one 
		 *   required field is showing its decoration.  Otherwise the buttons are enabled.
		 */
		setSearchControlRequired : function(isRequired, formObject, fieldId, searchControl, flexButtonIds) {
			var searchElement = document.getElementById(fieldId);
			if(searchElement) {
				if(isRequired && !searchElement.requiredCheck) {
					searchElement.isRequired = function() {
						return !searchControl.isVerified();
					};
					searchElement.requiredCheck = function() {
						var flexButtonsCount = flexButtonIds.length;
						if(flexButtonsCount > 0) {
							var disabled = searchElement.isRequired() || RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for(var i = 0; i < flexButtonsCount; i++) {
								var flexButton = document.getElementById(flexButtonIds[i]);
								if(flexButton) {
									flexButton.disabled = disabled;
								}
							}
						}
					};
					searchElement.requiredCheck();
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}
					formObject.requiredElements.push(searchElement);
					
					searchElement.verifyListener = function() {
						searchElement.requiredCheck();
					};
					searchControl.addVerifyStateChangeListener(searchElement.verifyListener);
				}
				else if(!isRequired && searchElement.requiredCheck) {
					searchElement.isRequired = undefined;
					searchElement.requiredCheck = undefined;
					for(var i = 0; i < formObject.requiredElements.length; i++) {
						if(formObject.requiredElements[i] === searchElement) {
							formObject.requiredElements.splice(i,1);
							break;
						}
					}
					searchControl.removeVerifyStateChangeListener(searchElement.verifyListener);
					searchElement.verifyListener = undefined;
					var flexButtonsCount = flexButtonIds.length;
					if(flexButtonsCount > 0) {
						var disabled = RCM_Clinical_Util.isAnyFieldRequired(formObject);
						for(var i = 0; i < flexButtonsCount; i++) {
							var flexButton = document.getElementById(flexButtonIds[i]);
							if(flexButton) {
								flexButton.disabled = disabled;
							}
						}
					}
				}
				searchControl.setRequired(isRequired);
			}
		},
		
		/**
		 * Returns true if any required field is displaying its decoration. Otherwise returns false.
		 * 
		 * @param {Object} formObject An object for containing a list of required fields. 
		 * @param {String} fieldId The id of an html element.
		 * @param {String} fieldType The type of field. The following types are currently supported: "date", "select", "text", "textarea", "radio".
		 * @param {Array} flexButtonIds (Optional) An array of an html button element ids that are disabled when at least one 
		 *   required field is showing its decoration.  Otherwise the buttons are enabled.
		 */
		addRequiredField : function(formObject, fieldId, fieldType, flexButtonIds) {
			var element = document.getElementById(fieldId);
			// If the field doesn't exist or is already required there is nothing to do here.
			if(element && !element.requiredCheck) {
				formObject.ignoreRequiredListeners = false;
				switch(fieldType.toLowerCase()) {
				case "date":
					var dateElement = element; 
					var validateListener = dateElement.onblur;
					var flexButtons = [];					
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					dateElement.isRequired = function() {
						var $dateInput = $("#" + fieldId);
						var dateVal = $dateInput.val();
						var dateFormat = $dateInput.datepicker('option', 'dateFormat');
						//TODO: We need to completely refactor how we handle dates so that I don't
						//      have to know that the date format from jquery is actually shorter than it displays.
						//      For example, mm/dd/yy is returned from jquery when something like 11/11/2010 is displayed.
						return (dateVal.length - 2 < dateFormat.length);
					};
					dateElement.requiredCheck = function() {
						var isRequired = false;
						if (validateListener) {
							validateListener();
							if (this.invalidDate) {
								isRequired = true;
							}
						}
						if(!isRequired) {
							isRequired = dateElement.isRequired();
							if(isRequired) {
								RCM_Clinical_Util.maskRequiredField(fieldId);
							} else {
								RCM_Clinical_Util.umMaskRequiredField(fieldId);	
							}
						}
						if (flexButtons.length > 0) {								
							var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for (var button = 0, length = flexButtons.length; button < length; button++) {
								flexButtons[button].disabled = disabled;	
							}						
						}
					};
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}	
					formObject.requiredElements.push(dateElement);
					dateElement.onblur = dateElement.requiredCheck;		
					if (dateElement.addDateSelectionListener) {
						dateElement.addDateSelectionListener(dateElement.requiredCheck);
					}
					
					RCM_Clinical_Util.addRequiredDecorator(dateElement);
					dateElement.requiredCheck();
					break;
				case "select":
					var selectElement = element;
					var flexButtons = [];
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					selectElement.isRequired = function() {
						var index = selectElement.selectedIndex;
						return index === -1 || selectElement.options[index].text === "";
					};
					selectElement.requiredCheck = function() {
						// Show required decoration when blank option first option is selected
						var isRequired = false;
						if (!selectElement.isRequired()) {
							RCM_Clinical_Util.umMaskRequiredField(fieldId);
						} else {
							RCM_Clinical_Util.maskRequiredField(fieldId);
							isRequired = true;
						}
						if (flexButtons.length > 0) {								
							var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for (var button = 0, length = flexButtons.length; button < length; button++) {
								flexButtons[button].disabled = disabled;	
							}
						}
					};
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}
					formObject.requiredElements.push(selectElement);
					Util.addEvent(selectElement, "change", selectElement.requiredCheck);
	
					RCM_Clinical_Util.addRequiredDecorator(selectElement);
					selectElement.requiredCheck();
					break;
				case "textarea":
				case "text":
				case "maskedtext":
					var textElement = element;
					var flexButtons = [];
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					textElement.isRequired = function() {
						if(fieldType.toLowerCase() === "maskedtext"){
							return $.trim(textElement.value).length === 0;
						}
						return textElement.value.length === 0;
					};
					textElement.requiredCheck = function() {
						var isRequired = textElement.isRequired();
						if (isRequired) {
							RCM_Clinical_Util.maskRequiredField(fieldId);
						} else {
							RCM_Clinical_Util.umMaskRequiredField(fieldId);
						}
						if (flexButtons.length > 0) {								
							var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
							for (var button = 0, length = flexButtons.length; button < length; button++) {
								flexButtons[button].disabled = disabled;	
							}
						}
					};
					if (!formObject.requiredElements) {
						formObject.requiredElements = [];
					}
					formObject.requiredElements.push(textElement);
					
					textElement.requiredCheckLater = function() {setTimeout(textElement.requiredCheck,1);};
					Util.addEvent(textElement, "keydown", textElement.requiredCheckLater);
					Util.addEvent(textElement, "paste", textElement.requiredCheckLater);
					Util.addEvent(textElement, "cut", textElement.requiredCheckLater);
					Util.addEvent(textElement, "drop", textElement.requiredCheckLater);
					
					RCM_Clinical_Util.addRequiredDecorator(textElement);
					textElement.requiredCheck();
					break;
				case "radio":					
					var firstRadioElement = element;
					// Find sibling radio buttons 
					var radioElements = $(firstRadioElement).nextAll("input[name='"+firstRadioElement.name+"']").get();
					radioElements.push(firstRadioElement);
					
					var flexButtons = [];
					if (flexButtonIds && flexButtonIds.length > 0) {
						for (var id = 0, length = flexButtonIds.length; id < length; id++) {							
							var flexButton = document.getElementById(flexButtonIds[id]);
							if (flexButton) {
								flexButtons.push(flexButton);
							}
						}
					}
					// Add listener to each radio button
					$.each(radioElements, function(index, radioElement) {
						// Default to marking the radio buttons as not required if at least one of them 
						// is checked. A custom is required function could easily be passed in if needed. 
						radioElement.isRequired = function() {
							return !(firstRadioElement.checked || $(firstRadioElement).nextAll(
									"input[name='"+firstRadioElement.name+"']:checked").length > 0);
						};
						radioElement.requiredCheck = function() {
							var isRequired = radioElement.isRequired();
							if (isRequired) {
								RCM_Clinical_Util.maskRequiredField(fieldId);
							} else {
								RCM_Clinical_Util.umMaskRequiredField(fieldId);
							}
							if (flexButtons.length > 0) {								
								var disabled = isRequired ? true : RCM_Clinical_Util.isAnyFieldRequired(formObject);
								for (var button = 0, length = flexButtons.length; button < length; button++) {
									flexButtons[button].disabled = disabled;	
								}
							}
						};
						if (!formObject.requiredElements) {
							formObject.requiredElements = [];
						}
						formObject.requiredElements.push(radioElement);					
						Util.addEvent(radioElement, "click", radioElement.requiredCheck);					
						RCM_Clinical_Util.addRequiredDecorator(radioElement);
					});
					firstRadioElement.requiredCheck();					
					break;
				}
			}
		},
		
		/**
		 * Returns true if any required field is displaying its decoration. Otherwise returns false.
		 * 
		 * @param {Object} formObject An object that contains a list of required fields. 
		 * @return {Boolean} Returns true if any required field is displaying its decoration. Otherwise returns false.
		 */
		isAnyFieldRequired : function(formObject) {
			if (!formObject.requiredElements) {
				return false;
			}
			for (var element = 0, length = formObject.requiredElements.length; element < length; element++) {
				if (formObject.requiredElements[element].isRequired()) {
					return true;
				}
			}
			return false;
		},		
		
		/**
		 * Calls the requiredCheck() method on each required field in a form. 
		 * 
		 * @param {Object} formObject An object that contains a list of required fields. 
		 */
		performRequiredFieldChecks : function(formObject) {
			if (formObject.requiredElements) {
				for (var element = 0, length = formObject.requiredElements.length; element < length; element++) {
					formObject.requiredElements[element].requiredCheck();
				}
			}
		},
		
		/**
		 * Sets the mp formatter locale to the default locale, which is English US.
		 */
		setMpFormatterLocale : function() {
			// Sets the locale ($SOURCE_DIR$\js\formatter\locales\js\en_US.js) 
			// for the mp_formatter ($SOURCE_DIR$\formatter\formatter.js)
			if (!window.MPAGE_LOCALE) {
				window.MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC.en_US);
			}
		}, 
		
		/**
		 * Turns a JSON object into a string by calling JSON.stringify(). While doing so encodes the value 
		 * of each string field by calling the global encodeURIComponent(). 
		 *
		 * @param {Object} jsonObject The JSON object to stringify.
		 * @return The string representation of the JSON object.
		 */
		stringifyJSON : function(jsonObject) {
			return JSON.stringify(jsonObject, function(key, value) {
				if (typeof value === "string" && key !== "reviewedDate") {
					return encodeURIComponent(value);
				}
				return value;
			});
		}, 
		
		/**
		 * Turns the string into a JSON object by calling JSON.parse(). While doing so decodes the value 
		 * of each string field by calling the global decodeURIComponent(). 
		 *
		 * @param {Object} jsonObject The string to turn into a JSON object.
		 * @return The constructed JSON object.
		 */
		parseJSON : function(jsonString) {
			return JSON.parse(jsonString, function(key, value) {
				if (typeof value === "string") {
					return decodeURIComponent(value);
				}
				return value;
			});
		},
		
		/**
		 * Decodes the value of each string field in the JSON object by calling the global decodeURIComponent(). 
		 *
		 * @param {Object} jsonObject The string to turn into a JSON object.
		 * @return The decoded JSON object.
		 */
		decodeJSON : function(jsonObject) {
			return RCM_Clinical_Util.parseJSON(JSON.stringify(jsonObject));
		},
		
		/**
		 * Encodes a string by calling the global encodeURIComponent().
		 *
		 * @param {String} value The string to encode.
		 * @param {Array} charactersToEncode (Optional) Limits the encoding to the characters contained 
		 * 	in the array. Each character should be passed as a separate value in the array, for example
		 *  ['^', '#'].
		 * @return The encoded string. 
		 */
		encodeString : function(value, charactersToEncode) {
			var encodedValue = "";
			if (value) {
				if (charactersToEncode) {
					var encodedCharsMap = {};
					for (var index = 0, length = charactersToEncode.length; index < length; index++) {
						var charToEncode = charactersToEncode[index];
						var encodedChar = encodeURIComponent(charToEncode);
						if (charToEncode !== encodedChar) {
							encodedCharsMap[charToEncode] = encodedChar;
						}
					}
					var encodedValueArray = [];
					for (var index = 0, length = value.length; index < length; index++) {
						var currentChar = value.charAt(index);
						var encodedChar = encodedCharsMap[currentChar];
						encodedValueArray.push(encodedChar ? encodedChar : currentChar);
					}
					encodedValue = encodedValueArray.join("");
				} else {
					encodedValue = encodeURIComponent(value);
				}
			}
			return encodedValue;
		}, 
		
		/**
		 * Decodes a string by calling the global decodeURIComponent().
		 *
		 * @param {String} value The string to decode.
		 * @return The decoded string. 
		 */
		decodeString : function(value) {
			return value ? decodeURIComponent(value) : value;
		},
		
		/**
		 * Returns an array of smaller segments of a long text string.
		 * This method will first encode the provided long text string.
		 * 
		 * @param longText The long text string.
		 * @param segmentName The name for each segment inside of the JSON array.
		 * @param maxSegmentLength The maximum length of each segment in the JSON array.  If not specified, 800 is assumed.
		 * @returns The JSON representation of the long text broken apart into segments.
		 */
		getLongTextJSON : function(longText, segmentName, maxSegmentLength) {
			var maxSegmentLength = maxSegmentLength || 800;
			var longTextEncoded = RCM_Clinical_Util.encodeString(longText);
			var segments = [];
			var start = 0;
			while(start < longTextEncoded.length) {
				var end = start + maxSegmentLength;
				var segment = {};
				segment[segmentName] = longTextEncoded.substring(start, end);
				segments.push(segment);
				start = end;
			}
			return segments;
		},

		componentInsertData : function(mPage, excludedComponents, prefix, categoryMeaning){
			excludedComponents = excludedComponents || [];
			var excluded;

            var components = mPage.getComponents();
			for (var pos = 0, componentsLength = components.length; pos < componentsLength; pos++) {
				var component = components[pos];
				if(typeof(DischargePlanningComponent) == "function" && component instanceof DischargePlanningComponent){
            		component.setCategoryMeaning(categoryMeaning);
            		component.setReportMeaning(prefix + "_DC_PLAN");
            		component.setDischargePlan("DCM_DC_PLAN_CE");
            		component.setEncntrTypes("VISIT_TYPE_READMISSION");
            		component.setVisitRelationshipTypes("DISCHARGE_RELTN");
            		component.setMedicareFinacialTypes("MEDICARE_FIN_CLASS");
            		component.setEventSets("DC_PLAN_CE");
            		component.setEventSetsSort("DC_PLAN_CE_SEQ");
            		component.setAdmitMIM("DCM_ADM_MIM_CE");
            		component.setDischargeMIM("DCM_DSCH_MIM_CE");
            		component.setReadmissionLink("READMISSION_LINK");
        		}
				
				if(typeof(UtilizationManagementRetrieveComponent) == "function" && component instanceof UtilizationManagementRetrieveComponent){
            		component.setCategoryMeaning(categoryMeaning);
        		}
				
				excluded = false;
				for(var i = 0, excludedLength = excludedComponents.length; i < excludedLength; i++) {
					if(component === excludedComponents[i]) {
						excluded = true;
						break;
					}
				}
				
				if(!excluded) {
					if (typeof(VitalSignComponent) == "function" && component instanceof VitalSignComponent) {
						var groups = component.getGroups();
						if (groups != null) {
							for (var z = 0, groupsLength = groups.length; z < groupsLength; z++) {
								var group = groups[z];
								switch (group.getGroupName()) {
									case "TEMP_CE":
										group.setGroupName(i18n.TEMPERATURE);
										break;
									case "BP_CE":
										group.setGroupName(i18n.BLOOD_PRESSURE);
										break;
									case "HR_CE":
										group.setGroupName(i18n.HEART_RATE);
										break;
									case "VS_CE":
										group.setGroupName("");
										break;
								};
							}
						}
					}
					else if (typeof(LaboratoryComponent) == "function" && component instanceof LaboratoryComponent) {
						var groups = component.getGroups();
						if (groups != null) {
							for (var z = 0, groupsLength = groups.length; z < groupsLength; z++) {
								var group = groups[z];
								switch (group.getGroupName()) {
									case "LAB_PRIMARY_CE":
										group.setGroupName(i18n.PRIMARY_RESULTS);
										break;
									case "LAB_SECONDARY_ES":
										group.setGroupName(i18n.SECONDARY_RESULTS);
										break;
								}
							}
						}
					}
					
					component.InsertData();
				}
			}
		},
		
		addTimePicker : function(elementId) {
			var timeTextBox = document.getElementById(elementId);
			$(document).ready(function(){
				$(function(){
					$.timeEntry.setDefaults($.timeEntry.regional['']);
					if(i18n.SET24HOUR){
						$(timeTextBox).timeEntry($.extend({},$.timeEntry.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
						ampmPrefix : ' ',
						show24Hours:true
						}));
					}else{
						$(timeTextBox).timeEntry($.extend({},$.timeEntry.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
						ampmPrefix : ' '						
						}));
					}
					$(".timeEntry_control").remove();
					timeTextBox.onkeypress = function(e) {
						var keynum;
					
						if(window.event){
							keynum = event.keyCode;
						}
						else if(e.which){
							keynum = e.which;
						}
						if(keynum === 110) {// n : time for now
							$(timeTextBox).timeEntry('setTime', new Date());
						}
					};
				});
			});
		},
		
		/* Hover Setup */
		hs : function(e, n){
			var priorBgColor;
			var priorBorderColor;
			var colorsSet = false;
			if (n && n.tagName == "DIV") {
				e.onmouseenter = function(evt){
					e.onmouseover = null;
					e.onmouseout = null;
					hmo(evt, n);
				};
				e.onmouseover = function(evt){
					if(!colorsSet) {
						priorBgColor = e.style.backgroundColor;
						priorBorderColor = e.style.borderColor;
						colorsSet = true;
					}
					e.style.backgroundColor = "#FFFFCC";
					e.style.borderColor = "#CCCCCC";
					hmo(evt, n);
				};
				e.onmousemove = function(evt){
					if(!colorsSet) {
						priorBgColor = e.style.backgroundColor;
						priorBorderColor = e.style.borderColor;
						colorsSet = true;
					}
					e.style.backgroundColor = "#FFFFCC";
					e.style.borderColor = "#CCCCCC";
					hmm(evt, n);
				};
				e.onmouseout = function(evt){
					e.style.backgroundColor = priorBgColor;
					e.style.borderColor = priorBorderColor;
					if (n.previousSibling) {
						hmt(evt, n);
					}
				};
				e.onmouseleave = function(evt){
					e.style.backgroundColor = priorBgColor;
					e.style.borderColor = priorBorderColor;
					e.onmouseover = null;
					e.onmouseout = null;
					if (n.previousSibling) {
						hmt(evt, n);
					}
				};
				Util.Style.acss(n, "hover");
			}
		},
		
		hs2 : function(e, n, parentHoverClassName){
			var init = parentHoverClassName;
			var parentPriorClassName;
			
			if (n && n.tagName == "DIV") {
				e.onmouseenter = function(evt){
					e.onmouseover = null;
					e.onmouseout = null;
					hmo(evt, n);
				};
				e.onmouseover = function(evt){
					if(init) {
						parentPriorClassName = e.className;
						init = false;
					}

					if(parentHoverClassName) {
						e.className = parentHoverClassName;
					}
					hmo(evt, n);
				};
				e.onmousemove = function(evt){
					if(init) {
						parentPriorClassName = e.className;
						init = false;
					}
					
					if(parentHoverClassName) {
						e.className = parentHoverClassName;
					}
					hmm(evt, n);
				};
				e.onmouseout = function(evt){
					if(parentPriorClassName) {
						e.className = parentPriorClassName;
					}
					if (n.previousSibling) {
						hmt(evt, n);
					}
				};
				e.onmouseleave = function(evt){
					if(parentPriorClassName) {
						e.className = parentPriorClassName;
					}
					e.onmouseover = null;
					e.onmouseout = null;
					if (n.previousSibling) {
						hmt(evt, n);
					}
				};
				Util.Style.acss(n, "hover");
			}
		},
		
		getCookie : function(key){
			var cookies = document.cookie.split(";");
			var value;
			$.each(cookies, function(i, cookie){
				var name = cookie.substr(0, cookie.indexOf("="));
				name=name.replace(/^\s+|\s+$/g,"");
				if(name==key){
					value = cookie.substr(cookie.indexOf("=") + 1);
					return false;
				}
			});
			return value;
		},
		
		setSessionCookie : function(key, value){
			document.cookie = key + "=" + value;
		},
		
		makeWebServiceCall : function(component, resourceUrl, successHandler, errorHandler, isNewSession) {
			function webServiceCall() {
				var fullUrl = RCM_Clinical_Util.getCookie("rcmBaseUrl") + "patient/"+component.getCriterion().person_id+"/encounter/"+
				  	component.getCriterion().encntr_id + resourceUrl;
				
				ajaxCall = $.ajax({
					contentType : "application/x-www-form-urlencoded",
					async : true,
					global : false,
					type : "GET",
					url : fullUrl,
					cache : false,
					beforeSend : function (xhr) {
						xhr.setRequestHeader("oAuthSession", RCM_Clinical_Util.getCookie("rcmOAuthSession"));
						xhr.setRequestHeader("clientMnemonic", RCM_Clinical_Util.getCookie("rcmClientMnemonic"));
					},
					success : function (data, textStatus, jqXHR) {
						if (jqXHR.readyState === 4){
							// Check for OAuth session refresh
							var refreshedOAuthSession = jqXHR.getResponseHeader("refreshedOAuthSession");
							if (window.log && log.isBlackBirdActive()){
								log.debug("Component: " + component.getLabel() +
								"<br />Text Status: " + textStatus +
								"<br />Data: " + RCM_Clinical_Util.loggingJsonFormatter(data) +
								"<br />jqXHR: " + RCM_Clinical_Util.loggingJqxhrFormatter(jqXHR));
							}
							if (refreshedOAuthSession) {
								RCM_Clinical_Util.setSessionCookie("rcmOAuthSession", refreshedOAuthSession);
							}
							successHandler(data, textStatus, jqXHR);
						} else {
							alert("Timeout");
							if (window.log && log.isBlackBirdActive()){
								log.debug("Component: " + component.getLabel() +
								"<br />Text Status: " + textStatus +
								"<br />Data: " + RCM_Clinical_Util.loggingJsonFormatter(data) +
								"<br />jqXHR: " + RCM_Clinical_Util.loggingJqxhrFormatter(jqXHR));
							}
						}
						
					},
					error : function (jqXHR, textStatus, errorThrown) {
						if (jqXHR.readyState === 4){
							// Try again if not new session since OAuth token may be expired
							if (jqXHR.status === 401 && !isNewSession) {
								RCM_Clinical_Util.makeWebServiceCall(component, resourceUrl, successHandler, errorHandler,true);
							} else {
								// TODO: Should still retry several times or give up after first failure?
								// TODO: Should have a common error dialog for a 401 error
								errorHandler(jqXHR, textStatus, errorThrown);
							}
						} else {
							alert("Timeout");
						}
					},
					timeout : 120000
				});
			}
			
			// old session
			if (RCM_Clinical_Util.getCookie("rcmOAuthSession") && !isNewSession) {
				webServiceCall();
			} 
			// new session
			else {
				function createOAuthSession(oAuthData) {
					var webServiceUrl = oAuthData.baseUrl + "patient/" + component.getCriterion().person_id + "/encounter/" +
						component.getCriterion().encntr_id + "/oauth/createSession";
					ajaxCall = $.ajax({
							contentType : "application/x-www-form-urlencoded",
							async : true,
							global : false,
							type : "GET",
							url : webServiceUrl,
							cache : false,
							beforeSend : function (xhr) {
								xhr.setRequestHeader("openIdFilter", oAuthData.openIdToken);
								xhr.setRequestHeader("clientMnemonic", oAuthData.clientMnemonic);
							},
							success : function (data, textStatus, jqXHR) {
								if (jqXHR.status === 200) {
									if (window.log && log.isBlackBirdActive()){
										log.debug("Component: " + component.getLabel() +
										"<br />Text Status: " + textStatus +
										"<br />Data: " + RCM_Clinical_Util.loggingJsonFormatter(data) +
										"<br />jqXHR: " + RCM_Clinical_Util.loggingJqxhrFormatter(jqXHR));
									}
									RCM_Clinical_Util.setSessionCookie("rcmOAuthSession", data);
									RCM_Clinical_Util.setSessionCookie("rcmBaseUrl", oAuthData.baseUrl);
									RCM_Clinical_Util.setSessionCookie("rcmClientMnemonic", oAuthData.clientMnemonic);
									webServiceCall();
								} else {
									alert("The Session Id call failed");
									if (window.log && log.isBlackBirdActive()){
										log.error("Component: " + component.getLabel() +
										"<br />Text Status: " + textStatus +
										"<br />Data: " + RCM_Clinical_Util.loggingJsonFormatter(data) +
										"<br />jqXHR: " + RCM_Clinical_Util.loggingJqxhrFormatter(jqXHR));
									}
								}
							},
							error : function (jqXHR, textStatus, errorThrown) {
								alert("Cannot create OAuth session: " + textStatus);
							},
							timeout : 120000
						});
				}
				
				var sendAr = [];
				sendAr.push("^MINE^", "0.0", "^GETOPENIDCLIENTMNEMONICURL^");
				sendAr.push("^^");
				RCM_Clinical_Util.makeTimerCCLRequest(component, "RCM_OPENID", sendAr, true,
					function (status, recordData, errorInfo) {
					if (status === "S") {
						var oAuthData = {};
						oAuthData.openIdToken = recordData.OPENIDTOKEN;
						oAuthData.baseUrl = recordData.BASEURL;
						oAuthData.clientMnemonic = recordData.CLIENTMNEMONIC;
						createOAuthSession(oAuthData);
					} else {
						alert("The open id service call failed");
					}
				}, true);
			}
		},
		
		checkNull :  function(value){
			return value ? value : "";
		},
		
		setFocus: function(elementId) {
			var element = document.getElementById(elementId);
			if (element && !element.disabled) {
				try {
					element.focus();
				} catch (ex) {
				}
			}
		},
		
		expandAll : function(){
			$(document.body).find(".section").removeClass("closed");
			$("#cm-collapse-all-components").show();
			$("#cm-expand-all-components").hide();
		},
		
		collapseAll : function(){
			$(document.body).find(".section").addClass("closed");
			$("#cm-expand-all-components").show();
			$("#cm-collapse-all-components").hide();
		},
		createExpandCollapseAll : function(){
			id1 = "#cm-expand-all-components";
			id2 = "#cm-collapse-all-components";
			$(".pg-hd").prepend("<div id='cm-expand-all-components' class='expand-collapse-all' onclick ='RCM_Clinical_Util.expandAll();'>"+rcm_clinical_util_i18n.EXPAND_ALL+"</div>");
			$(".pg-hd").prepend("<div id='cm-collapse-all-components'class='expand-collapse-all' onclick ='RCM_Clinical_Util.collapseAll();'>"+rcm_clinical_util_i18n.COLLAPSE_ALL+"</div>");
			$("#cm-collapse-all-components").hide();
		}
	};
}();
var Rcm_Floating_Header=function(){this.floatingDiv;
this.headerRowYPos=0;
this.table;
this.headerRowYMax;
this.getRealPosition=function(obj){var y=0;
var x=0;
while(obj.offsetParent){obj=obj.offsetParent;
y+=obj.offsetTop;
x+=obj.offsetLeft;
}return{x:x,y:y};
};
this.floatingTableListener=function(){var windowOffsetHeight=window.offsetHeight?window.offsetHeight:0;
var scrollTop=0;
if(document.documentElement.scrollTop){scrollTop=document.documentElement.scrollTop;
}else{if(document.body.scrollTop){scrollTop=document.body.scrollTop;
}else{if(window.pageYOffset){scrollTop=window.pageYOffset;
}}}var curPos=0;
if(scrollTop&&(windowOffsetHeight===0||clientHeight>scrollTop)){curPos=scrollTop;
}else{curPos=windowOffsetHeight;
}if(this.headerRowYPos<curPos){this.floatingDiv.style.top=curPos;
this.floatingDiv.style.display="block";
}else{this.floatingDiv.style.display="none";
}};
this.copyTableHeader=function(tableHeaderRow){this.table=tableHeaderRow.parentNode;
if(!this.floatingDiv){if(!tableHeaderRow){alert("Rcm_floating_header error: can not find table header row when calling Rcm_Floating_Header.addFloatingTableHeader(tableRowId).");
return;
}if(!this.table){alert("Rcm_floating_header error: can not find parent table when calling Rcm_Floating_Header.addFloatingTableHeader(tableRowId).");
return;
}this.headerRowYMax=this.getRealPosition(tableHeaderRow).y+this.table.scrollHeight;
this.headerRowYPos=this.getRealPosition(tableHeaderRow).y;
this.floatingDiv=document.createElement("div");
this.floatingDiv.id="copied"+tableHeaderRow.id;
this.floatingDiv.style.position="absolute";
this.floatingDiv.setAttribute("z-index",1);
this.floatingDiv.style.display="none";
document.body.appendChild(this.floatingDiv);
var tablePosition=getRealPosition(this.table);
this.floatingDiv.style.top=tablePosition.y;
this.floatingDiv.style.left=tablePosition.x;
this.floatingDiv.style.width=this.table.offsetWidth;
}else{var copiedFloatingTable=document.getElementById("copiedFloatingTable");
if(copiedFloatingTable){copiedFloatingTable.parentNode.removeChild(copiedFloatingTable);
}}this.createFloatingChildTable(tableHeaderRow);
};
this.createFloatingChildTable=function(tableHeaderRow){var floatingTable=document.createElement("TABLE");
floatingTable.id="copiedFloatingTable";
floatingTable.className=this.table.className;
this.floatingDiv.appendChild(floatingTable);
var floatingTableThread=document.createElement("THEAD");
floatingTable.appendChild(floatingTableThread);
var floatingTableRow=document.createElement("TR");
floatingTableRow.className=tableHeaderRow.className;
floatingTableThread.appendChild(floatingTableRow);
var fromThs=tableHeaderRow.getElementsByTagName("TH");
for(var x=0;
x<fromThs.length;
x++){var floatingCell=fromThs[x].cloneNode(true);
floatingTableRow.appendChild(floatingCell);
floatingCell.id=fromThs[x].id;
var pl,pr,pt,pb,bl,br,bt,bb,width,height=0;
if(fromThs[x].style.paddingLeft){pl=fromThs[x].style.paddingLeft.replace("px","");
}if(fromThs[x].style.paddingRight){pr=fromThs[x].style.paddingRight.replace("px","");
}if(fromThs[x].style.paddingTop){pt=fromThs[x].style.paddingTop.replace("px","");
}if(fromThs[x].style.paddingBottom){pb=fromThs[x].style.paddingBottom.replace("px","");
}if(fromThs[x].style.borderLeftWidth){bl=fromThs[x].style.borderLeftWidth.replace("px","");
}if(fromThs[x].style.borderRightWidth){br=fromThs[x].style.borderRightWidth.replace("px","");
}if(fromThs[x].style.borderTopWidth){bt=fromThs[x].style.borderTopWidth.replace("px","");
}if(fromThs[x].style.borderBottomWidth){bb=fromThs[x].style.borderBottomWidth.replace("px","");
}if(fromThs[x].currentStyle){for(var y in fromThs[x].currentStyle){if(y=="font"||y=="top"){continue;
}if(floatingCell.style[y]&&fromThs[x].currentStyle[y]){floatingCell.style[y]=fromThs[x].currentStyle[y];
}}pl=fromThs[x].currentStyle.paddingLeft.replace("px","");
pr=fromThs[x].currentStyle.paddingRight.replace("px","");
pt=fromThs[x].currentStyle.paddingTop.replace("px","");
pb=fromThs[x].currentStyle.paddingBottom.replace("px","");
bl=fromThs[x].currentStyle.borderLeftWidth.replace("px","");
br=fromThs[x].currentStyle.borderRightWidth.replace("px","");
bt=fromThs[x].currentStyle.borderTopWidth.replace("px","");
bb=fromThs[x].currentStyle.borderBottomWidth.replace("px","");
var floatingBorder=Math.round((bl+br)/2);
if(fromThs[x].offsetWidth-pl-pr-floatingBorder>0){width=fromThs[x].offsetWidth-pl-pr-floatingBorder;
}else{width=fromThs[x].offsetWidth;
}if(fromThs[x].offsetHeight-pt-pb-bt-bb>0){height=fromThs[x].offsetHeight-pt-pb-bt-bb;
}else{height=fromThs[x].offsetHeight;
}}else{width=document.defaultView.getComputedStyle(fromThs[x],"").getPropertyValue("width");
var floatingBorder=Math.round((bl+br)/2);
if(width-pl-pr-floatingBorder>0){width=width-pl-pr-floatingBorder;
}height=document.defaultView.getComputedStyle(fromThs[x],"").getPropertyValue("height");
if(height-pt-pb-bt-bb>0){height=height-pt-pb-bt-bb;
}}floatingCell.style.width=width;
floatingCell.style.height=height;
var top=fromThs[x].offsetTop;
floatingCell.style.top=top;
var left=fromThs[x].offsetLeft;
floatingCell.style.left=left;
floatingCell.style.position=fromThs[x].style.position;
}};
this.copyDivTableHeader=function(headerDiv,tableHeaderRow){this.table=tableHeaderRow.parentNode;
if(!this.floatingDiv){if(!tableHeaderRow){alert("Rcm_floating_header error: can not find table header row when calling Rcm_Floating_Header.addFloatingDivAndTableHeader(tableRowId, divId , caller, notifyListener).");
return;
}if(!this.table){alert("Rcm_floating_header error: can not find parent table when calling Rcm_Floating_Header.addFloatingDivAndTableHeader(tableRowId, divId , caller, notifyListener).");
return;
}this.headerRowYMax=this.getRealPosition(tableHeaderRow).y+this.table.scrollHeight;
this.headerRowYPos=this.getRealPosition(tableHeaderRow).y;
this.floatingDiv=document.createElement("div");
this.floatingDiv.id="copied"+tableHeaderRow.id;
this.floatingDiv.style.position="absolute";
this.floatingDiv.setAttribute("z-index",1);
this.floatingDiv.style.display="none";
document.body.appendChild(this.floatingDiv);
var tablePosition=getRealPosition(this.table);
this.floatingDiv.style.top=tablePosition.y;
this.floatingDiv.style.left=tablePosition.x;
this.floatingDiv.style.width=this.table.offsetWidth;
}else{while(this.floatingDiv.firstChild){this.floatingDiv.removeChild(this.floatingDiv.firstChild);
}}var floatingChildDiv=headerDiv.cloneNode(true);
floatingChildDiv.className=headerDiv.className;
floatingDiv.appendChild(floatingChildDiv);
this.createFloatingChildTable(tableHeaderRow);
};
this.resizeHeader=function(tableRowId){var tableHeaderRow=document.getElementById(tableRowId);
this.table=tableHeaderRow.parentNode;
var tablePosition=getRealPosition(this.table);
this.floatingDiv.style.top=tablePosition.y;
this.floatingDiv.style.left=tablePosition.x;
this.floatingDiv.style.width=this.table.offsetWidth;
var fromThs=this.table.getElementsByTagName("TH");
var toThs=this.floatingDiv.getElementsByTagName("TH");
for(var x=0;
x<fromThs.length;
x++){var pl,pr,pt,pb,bl,br,bt,bb,width,height=0;
if(fromThs[x].style.paddingLeft){pl=fromThs[x].style.paddingLeft.replace("px","");
}if(fromThs[x].style.paddingRight){pr=fromThs[x].style.paddingRight.replace("px","");
}if(fromThs[x].style.paddingTop){pt=fromThs[x].style.paddingTop.replace("px","");
}if(fromThs[x].style.paddingBottom){pb=fromThs[x].style.paddingBottom.replace("px","");
}if(fromThs[x].style.borderLeftWidth){bl=fromThs[x].style.borderLeftWidth.replace("px","");
}if(fromThs[x].style.borderRightWidth){br=fromThs[x].style.borderRightWidth.replace("px","");
}if(fromThs[x].style.borderTopWidth){bt=fromThs[x].style.borderTopWidth.replace("px","");
}if(fromThs[x].style.borderBottomWidth){bb=fromThs[x].style.borderBottomWidth.replace("px","");
}if(fromThs[x].currentStyle){for(var y in fromThs[x].currentStyle){if(y=="font"||y=="top"){continue;
}if(toThs[x].style[y]&&fromThs[x].currentStyle[y]){toThs[x].style[y]=fromThs[x].currentStyle[y];
}}pl=fromThs[x].currentStyle.paddingLeft.replace("px","");
pr=fromThs[x].currentStyle.paddingRight.replace("px","");
pt=fromThs[x].currentStyle.paddingTop.replace("px","");
pb=fromThs[x].currentStyle.paddingBottom.replace("px","");
bl=fromThs[x].currentStyle.borderLeftWidth.replace("px","");
br=fromThs[x].currentStyle.borderRightWidth.replace("px","");
bt=fromThs[x].currentStyle.borderTopWidth.replace("px","");
bb=fromThs[x].currentStyle.borderBottomWidth.replace("px","");
var floatingBorder=Math.round((bl+br)/2);
if(fromThs[x].offsetWidth-pl-pr-floatingBorder>0){width=fromThs[x].offsetWidth-pl-pr-floatingBorder;
}else{width=fromThs[x].offsetWidth;
}if(fromThs[x].offsetHeight-pt-pb-bt-bb>0){height=fromThs[x].offsetHeight-pt-pb-bt-bb;
}else{height=fromThs[x].offsetHeight;
}}else{width=document.defaultView.getComputedStyle(fromThs[x],"").getPropertyValue("width");
var floatingBorder=Math.round((bl+br)/2);
if(width-pl-pr-floatingBorder>0){width=width-pl-pr-floatingBorder;
}height=document.defaultView.getComputedStyle(fromThs[x],"").getPropertyValue("height");
if(height-pt-pb-bt-bb>0){height=height-pt-pb-bt-bb;
}}toThs[x].style.width=width;
toThs[x].style.height=height;
var top=fromThs[x].offsetTop;
toThs[x].style.top=top;
var left=fromThs[x].offsetLeft;
toThs[x].style.left=left;
toThs[x].style.position=fromThs[x].style.position;
}};
return{addFloatingTableHeader:function(tableRowId){var tableHeaderRow=document.getElementById(tableRowId);
if(tableHeaderRow){copyTableHeader(tableHeaderRow);
window.onscroll=function(){if(!tableHeaderRow||tableHeaderRow.offsetWidth===0&&tableHeaderRow.offsetHeight===0){this.floatingDiv.style.display="none";
}else{floatingTableListener();
}};
window.onresize=function(){if(!tableHeaderRow||tableHeaderRow.offsetWidth===0&&tableHeaderRow.offsetHeight===0){this.floatingDiv.style.display="none";
}else{resizeHeader(tableRowId);
floatingTableListener();
}};
}},addFloatingDivAndTableHeader:function(tableRowId,divId,caller,notifyListener){var headerDiv=document.getElementById(divId);
var tableHeaderRow=document.getElementById(tableRowId);
if(headerDiv&&tableHeaderRow){copyDivTableHeader(headerDiv,tableHeaderRow);
if(caller&&notifyListener){notifyListener.call(caller);
}window.onscroll=function(){if(!tableHeaderRow||tableHeaderRow.offsetWidth===0&&tableHeaderRow.offsetHeight===0){this.floatingDiv.style.display="none";
}else{floatingTableListener();
}};
window.onresize=function(){if(!tableHeaderRow||tableHeaderRow.offsetWidth===0&&tableHeaderRow.offsetHeight===0){this.floatingDiv.style.display="none";
}else{resizeHeader(tableRowId);
floatingTableListener();
}};
}}};
}();
function VIEWLINK(mode,appName,personId,encounterId,tab,viewId,viewpointId){var CK_DATA={};
function addCookieProperty(compId,propName,propValue){var cookie=CK_DATA[compId];
if(!cookie){cookie={};
}cookie[propName]=propValue;
CK_DATA[compId]=cookie;
}function writeCookie(){var cookieJarJSON=JSON.stringify(CK_DATA);
document.cookie="CookieJar="+cookieJarJSON+";";
}function retrieveCookie(){var cookies=document.cookie;
var match=cookies.match(/CookieJar=({[^;]+})(;|\b|$)/);
if(match&&match[1]){CK_DATA=JSON.parse(match[1]);
}}if(viewId&&viewId.length){retrieveCookie();
addCookieProperty("viewpoint","viewCatMean|"+viewpointId+"|"+Number(personId)+"|"+Number(encounterId),viewId);
writeCookie();
if("PCSendMessage" in window.external){window.external.PCSendMessage(1100,{personId:personId,encounterId:encounterId,tab:tab,viewId:viewId,viewpointId:viewpointId});
}}var params="/PERSONID="+personId+" /ENCNTRID="+encounterId+" /FIRSTTAB=^"+tab+"^";
APPLINK(mode,appName,params);
}if("PCRegisterMessage" in window.external){window.external.PCRegisterMessage(1100,"SETVIEW");
}function SETVIEW(messageId,criteria){var criterion=JSON.parse(m_criterionJSON).CRITERION;
if(window.m_viewpointJSON&&criteria.viewpointId===JSON.parse(m_viewpointJSON).VP_INFO.VIEWPOINT_NAME_KEY&&criterion.PERSON_ID===Number(criteria.personId)&&criterion.ENCNTRS.length&&criterion.ENCNTRS[0].ENCNTR_ID===Number(criteria.encounterId)){MP_Viewpoint.activateView(criteria.viewId);
}}var Search_Util=function(){return{makeCCLRequest:function(program,paramAr,async,statusHandler){var info=window.CERN_BrowserDevInd?new XMLHttpRequest():new XMLCclRequest();
info.onreadystatechange=function(){if(info.readyState===4&&info.status===200){if(statusHandler){var jsonEval=JSON.parse(info.responseText);
var recordData=jsonEval.RECORD_DATA;
if(recordData.STATUS_DATA.STATUS==="Z"){statusHandler("Z");
}else{if(recordData.STATUS_DATA.STATUS==="S"){statusHandler("S",recordData);
}else{var errAr=[];
var statusData=recordData.STATUS_DATA;
for(var x=0,xl=statusData.SUBEVENTSTATUS.length;
x<xl;
x++){var ss=statusData.SUBEVENTSTATUS[x];
errAr.push(ss.OPERATIONNAME,ss.OPERATIONSTATUS,ss.TARGETOBJECTNAME,ss.TARGETOBJECTVALUE);
}statusHandler("F",errAr.join(", "));
}}}}else{if(info.readyState===4&&info.status!==200){statusHandler("F");
}}};
if(window.CERN_BrowserDevInd){var joinedParam=paramAr.join(",").replace(/[\^]/g,"~");
var url=program+"?parameters="+joinedParam;
info.open("GET",url,async);
info.send(null);
}else{info.open("GET",program,async);
info.send(paramAr.join(","));
}},createPersonNameSearchTokens:function(searchString){searchString=searchString.replace(/^\s+|\s+$/,"");
var searchTokens=[];
var indexOfComma=searchString.indexOf(",");
var indexOfSpace=searchString.indexOf(" ");
if(indexOfComma>=0){searchTokens=searchString.split(",");
}else{if((indexOfSpace<0)||(indexOfSpace>=0&&indexOfSpace==searchString.length-1)){searchTokens[0]=searchString;
searchTokens[1]="";
}else{var tempSearchTokens=searchString.split(/\s+/g);
searchTokens[0]=tempSearchTokens[1];
searchTokens[1]=tempSearchTokens[0];
}}searchTokens[0]=searchTokens[0].replace(/\s+/g,"");
searchTokens[1]=searchTokens[1].replace(/\s+/g,"");
return searchTokens;
}};
}();
function RcmAuthRibbon(losHours,elosHours,eddHours,authHours,personInfo,settings,contentLoc){this.losHours=losHours;
this.elosHours=elosHours;
this.eddHours=eddHours;
this.authHours=authHours;
this.personInfo=personInfo;
this.settings=settings;
this.RED="#FF0000";
this.GREY="#BCBFC0";
this.YELLOW="#FFD747";
this.imagePath=contentLoc?contentLoc+"\\images\\":RCM_Clinical_Util.getImagePath("");
this.authIcon=this.imagePath+"Auth_End_Icon.png";
this.eddIcon=this.imagePath+"EDD_Icon.png";
this.elosIcon=this.imagePath+"ELOS_Icon.png";
this.popOutTop=this.imagePath+"popOutTop3.gif";
}RcmAuthRibbon.prototype.getLosDaysHtml=function(){var losDays=Math.floor(this.losHours/24);
var losDayHours=this.losHours%24;
var jsHTML=[];
jsHTML.push("<span class='um-ribbon-labels'>",rcm_auth_ribbon_i18n.RCM_LOS,"</span>");
jsHTML.push("<span class='um-los-spacing'>",losDays,"</span><span>",rcm_auth_ribbon_i18n.RCM_DAYS,"</span>");
if(losDayHours){jsHTML.push("<span class='um-los-spacing'>",rcm_auth_ribbon_i18n.RCM_COMMA,"</span>");
jsHTML.push("<span class='um-los-spacing'>",losDayHours,"</span>");
jsHTML.push("<span>",rcm_auth_ribbon_i18n.RCM_HOURS,"</span>");
}return jsHTML.join("");
};
RcmAuthRibbon.prototype.getAuthRibbonHtml=function(){var settings=this.settings;
var hasEnd=false;
var losWidth;
var elosWidth;
var losBackgroundColor=this.getLosBackgroundColor();
var eddMax=settings.isEddOn&&this.eddHours?this.eddHours:0;
var authMax=settings.isAuthOn&&this.authHours?this.authHours:0;
var elosMax=settings.isElosOn&&this.elosHours?this.elosHours:0;
var endHours=Math.max(eddMax,authMax,elosMax);
if(endHours!==0){hasEnd=true;
losWidth=100*this.losHours/endHours;
}var jsHTML=[];
if(hasEnd){if(this.losHours>endHours){jsHTML.push("<div class='um-exceeded-los-div' onclick='RcmAuthRibbonHelper.openPopOut(this,",RcmAuthRibbonHelper.createJSONString(this.personInfo),", ",RcmAuthRibbonHelper.createJSONString(settings),")'><div class='um-exceeded-text-div'>",rcm_auth_ribbon_i18n.RCM_EXCEEDED,"</div></div>");
}else{jsHTML.push("<div class='um-ribbon-outer-div' onclick='RcmAuthRibbonHelper.openPopOut(this,",RcmAuthRibbonHelper.createJSONString(this.personInfo),", ",RcmAuthRibbonHelper.createJSONString(settings),")'>");
jsHTML.push("<div class='um-ribbon-main-div'>");
jsHTML.push("<div class='um-los-div' style='width:",losWidth,"%; background-color:",losBackgroundColor,"'></div>");
jsHTML.push("</div>");
if(settings.isEddOn&&this.eddHours){var eddWidth=this.eddHours/endHours*100-100;
jsHTML.push("<div class='um-ribbon-line-div' style='left:",eddWidth,"%","'>");
jsHTML.push("</div>");
}if(settings.isAuthOn&&this.authHours){var authWidth=this.authHours/endHours*100-100;
jsHTML.push("<div class='um-ribbon-line-div um-ribbon-vertical-line-div' style='left:",authWidth,"%","'>");
jsHTML.push("</div>");
}if(settings.isElosOn&&this.elosHours){var elosWidth=this.elosHours/endHours*100-100;
jsHTML.push("<div class='um-ribbon-line-div um-ribbon-vertical-line-div' style='left:",elosWidth,"%","'>");
jsHTML.push("</div>");
}if(settings.isEddOn&&this.eddHours){var eddWidth=this.eddHours/endHours*100-100;
jsHTML.push("<div class='um-ribbon-line-div um-ribbon-vertical-line-div' style='left:",eddWidth,"%","'>");
jsHTML.push("<img class='um-edd-line-icon' src='",this.eddIcon,"'>");
jsHTML.push("</div>");
}if(settings.isAuthOn&&this.authHours){var authWidth=this.authHours/endHours*100-100;
jsHTML.push("<div class='um-ribbon-line-div' style='left:",authWidth,"%","'>");
jsHTML.push("<img class='um-auth-line-icon' src='",this.authIcon,"'>");
jsHTML.push("</div>");
}if(settings.isElosOn&&this.elosHours){var elosWidth=this.elosHours/endHours*100-100;
jsHTML.push("<div class='um-ribbon-line-div' style='left:",elosWidth,"%","'>");
jsHTML.push("<img class='um-elos-line-icon' src='",this.elosIcon,"'>");
jsHTML.push("</div>");
}jsHTML.push("</div>");
}}else{jsHTML.push("<div class='um-ribbon-main-div um-bottom-spacing'></div>");
}return jsHTML.join("");
};
RcmAuthRibbon.prototype.getDayTypesHtml=function(){var settings=this.settings;
var jsHTML=[];
jsHTML.push("<table class='um-auth-los-table'>");
jsHTML.push("<tr>");
if(settings.isAuthOn){jsHTML.push("<td class='um-ribbon-labels um-day-col'><img class='um-los-spacing' src='",this.authIcon,"'><span>",rcm_auth_ribbon_i18n.RCM_AUTH_END,"</span></td>");
}if(settings.isEddOn){jsHTML.push("<td class='um-ribbon-labels um-day-col'><img class='um-los-spacing' src='",this.eddIcon,"'><span>",rcm_auth_ribbon_i18n.RCM_PDD,"</span></td>");
}if(settings.isElosOn){jsHTML.push("<td class='um-ribbon-labels um-day-col'><img class='um-los-spacing' src='",this.elosIcon,"'><span>",rcm_auth_ribbon_i18n.RCM_ELOS,"</span></td>");
}jsHTML.push("</tr>");
jsHTML.push("<tr>");
if(settings.isAuthOn){jsHTML.push(this.getTypeHtml(this.authHours,settings.authWarnThreshold,settings.authAlertInd));
}if(settings.isEddOn){jsHTML.push(this.getTypeHtml(this.eddHours,settings.eddWarnThreshold,settings.eddAlertInd));
}if(settings.isElosOn){jsHTML.push(this.getTypeHtml(this.elosHours,settings.elosWarnThreshold,settings.elosAlertInd));
}jsHTML.push("</tr>");
jsHTML.push("</table>");
return jsHTML.join("");
};
RcmAuthRibbon.prototype.getAllRibbonHtml=function(){var jsHTML=[];
jsHTML.push("<div class='um-bottom-spacing'>",this.getLosDaysHtml(),"</div>");
jsHTML.push("<div class='um-bottom-spacing'>",this.getAuthRibbonHtml(),"</div>");
jsHTML.push("<div class='um-bottom-spacing'>",this.getDayTypesHtml(),"</div>");
return jsHTML.join("");
};
RcmAuthRibbon.prototype.getTypeHtml=function(typeHours,warnThreshold,alertInd){var jsHTML=[];
if(typeHours){var typeClass;
if(alertInd&&this.losHours>typeHours){typeClass="um-los-bold-red";
}else{var warnHours=warnThreshold===null?null:typeHours-warnThreshold*24;
typeClass=warnHours!==null&&this.losHours>=warnHours?"um-los-bold":"";
}jsHTML.push("<td class='",typeClass,"'><span class='um-los-spacing'>");
if(typeHours<24){jsHTML.push(typeHours,"</span><span>",rcm_auth_ribbon_i18n.RCM_HOURS,"</span></td>");
}else{var typeDays=Math.floor(typeHours/24);
jsHTML.push(typeDays,"</span><span>",rcm_auth_ribbon_i18n.RCM_DAYS,"</span></td>");
}}else{if(typeHours===null){jsHTML.push("<td class='um-los-bold-red'>",rcm_auth_ribbon_i18n.RCM_ERROR,"</td>");
}else{jsHTML.push("<td>",rcm_auth_ribbon_i18n.RCM_DOUBLE_DASH,"</td>");
}}return jsHTML.join("");
};
RcmAuthRibbon.prototype.getLosBackgroundColor=function(){var settings=this.settings;
var useYellow=false;
var useRed=false;
if(settings.isEddOn&&settings.eddAlertInd&&this.eddHours&&this.losHours>this.eddHours){return this.RED;
}if(settings.isAuthOn&&settings.authAlertInd&&this.authHours&&this.losHours>this.authHours){return this.RED;
}if(settings.isElosOn&&settings.elosAlertInd&&this.elosHours&&this.losHours>this.elosHours){return this.RED;
}var warnHours;
if(settings.isEddOn&&this.eddHours&&settings.eddWarnThreshold!==null){warnHours=this.eddHours-settings.eddWarnThreshold*24;
if(this.losHours>=warnHours){return this.YELLOW;
}}if(settings.isAuthOn&&this.authHours&&settings.authWarnThreshold!==null){warnHours=this.authHours-settings.authWarnThreshold*24;
if(this.losHours>=warnHours){return this.YELLOW;
}}if(settings.isElosOn&&this.elosHours&&settings.elosWarnThreshold!==null){warnHours=this.elosHours-settings.elosWarnThreshold*24;
if(this.losHours>=warnHours){return this.YELLOW;
}}return this.GREY;
};
var RcmAuthRibbonHelper=function(){return{MILLISEC_IN_HOUR:3600000,setImagePath:function(imagePath){imagePath=imagePath||RCM_Clinical_Util.getImagePath("");
this.authIcon=imagePath+"Auth_End_Icon.png";
this.eddIcon=imagePath+"EDD_Icon.png";
this.elosIcon=imagePath+"ELOS_Icon.png";
this.popOutTop=imagePath+"popOutTop3.gif";
this.loadingIcon=imagePath+"6439_48.gif";
},createLosDisplay:function(losHours){var losDays=Math.floor(losHours/24);
var losDayHours=losHours%24;
var jsHTML=[];
jsHTML.push("<div class='um-bottom-spacing'>");
jsHTML.push("<span class='um-ribbon-labels'>",rcm_auth_ribbon_i18n.RCM_LOS,"</span>");
jsHTML.push("<span class='um-los-spacing'>",losDays,"</span><span>",rcm_auth_ribbon_i18n.RCM_DAYS,"</span>");
if(losDayHours){jsHTML.push("<span class='um-los-spacing'>",rcm_auth_ribbon_i18n.RCM_COMMA,"</span>");
jsHTML.push("<span class='um-los-spacing'>",losDayHours,"</span>");
jsHTML.push("<span>",rcm_auth_ribbon_i18n.RCM_HOURS,"</span>");
}jsHTML.push("</div>");
return jsHTML.join("");
},createLoadingRibbon:function(){var jsHTML=[];
jsHTML.push("<div class='um-bottom-spacing'>");
jsHTML.push("<div class='um-ribbon-main-div'>");
jsHTML.push("<img class='um-ribbon-load-img' src='",this.loadingIcon,"'>");
jsHTML.push("</div>");
jsHTML.push("</div>");
return jsHTML.join("");
},createEmptyDayTypes:function(settings){var jsHTML=[];
jsHTML.push("<div class='um-bottom-spacing'>");
jsHTML.push("<table class='um-auth-los-table'>");
jsHTML.push("<tr>");
if(settings.isAuthOn){jsHTML.push("<td class='um-ribbon-labels um-day-col'><img class='um-los-spacing' src='",this.authIcon,"'><span>",rcm_auth_ribbon_i18n.RCM_AUTH_END,"</span></td>");
}if(settings.isEddOn){jsHTML.push("<td class='um-ribbon-labels um-day-col'><img class='um-los-spacing' src='",this.eddIcon,"'><span>",rcm_auth_ribbon_i18n.RCM_PDD,"</span></td>");
}if(settings.isElosOn){jsHTML.push("<td class='um-ribbon-labels um-day-col'><img class='um-los-spacing' src='",this.elosIcon,"'><span>",rcm_auth_ribbon_i18n.RCM_ELOS,"</span></td>");
}jsHTML.push("</tr>");
jsHTML.push("<tr>");
if(settings.isAuthOn){jsHTML.push("<td>",rcm_auth_ribbon_i18n.RCM_DOUBLE_DASH,"</td>");
}if(settings.isEddOn){jsHTML.push("<td>",rcm_auth_ribbon_i18n.RCM_DOUBLE_DASH,"</td>");
}if(settings.isElosOn){jsHTML.push("<td>",rcm_auth_ribbon_i18n.RCM_DOUBLE_DASH,"</td>");
}jsHTML.push("</tr>");
jsHTML.push("</table>");
jsHTML.push("</div>");
return jsHTML.join("");
},createPopOutShell:function(componentId){var popOutDiv=document.createElement("div");
popOutDiv.id="umRibbonPopOutDiv"+(componentId||"");
popOutDiv.className="um-pop-out-div um-pop-out-hidden";
return popOutDiv;
},openPopOut:function(name,personInfo,settings){var componentId=settings.componentId||"";
var popOut=$("#umRibbonPopOutDiv"+componentId);
if(popOut.length>0){if(popOut.hasClass("um-pop-out-hidden")){popOut.removeClass("um-pop-out-hidden");
popOut.html(this.getRibbonPopOut(personInfo,settings));
var lineWidth=popOut.find(".um-pop-out-inner").width();
popOut.find(".um-horizontal-line").width(lineWidth);
var ribbonOffset=$(name).offset();
var popOutTop=ribbonOffset.top+$(name).height()-3;
var popOutLeft=ribbonOffset.left+$(name).width()/2-popOut.width()/2;
popOut.offset({top:popOutTop,left:popOutLeft});
this.currentEncounterId=personInfo.ENCOUNTER_ID;
}else{popOut.addClass("um-pop-out-hidden");
if(this.currentEncounterId!==personInfo.ENCOUNTER_ID){this.openPopOut(name,personInfo,settings);
}}}},getRibbonPopOut:function(personInfo,settings){var jsHTML=[];
jsHTML.push("<img class='um-pop-out-top-img' src='",this.popOutTop,"'>");
jsHTML.push("<div class='um-pop-out-outer'>");
jsHTML.push("<div class='um-pop-out-inner'>");
if(settings.isAuthOn){var hasIcon=false;
for(var i=0;
i<personInfo.HEALTH_PLAN_AUTHORIZATIONS.length;
i++){var authorization=personInfo.HEALTH_PLAN_AUTHORIZATIONS[i];
jsHTML.push("<div class='um-los-bold um-bottom-spacing'>");
if(personInfo.AUTHORIZATION_DT_TM&&personInfo.AUTHORIZATION_DT_TM===authorization.AUTHORIZATION_END_DT_TM){jsHTML.push("<img class='um-pop-out-img-space' src='",this.authIcon,"'>");
}jsHTML.push("<span id='ribbonHealthPlan' class='um-los-spacing'>",authorization.HEALTH_PLAN_NAME,"</span>");
jsHTML.push("<span class='um-los-spacing'>",rcm_auth_ribbon_i18n.RCM_DASH,"</span><span>",this.getAuthorizationPriorityLabel(i),"</span>");
jsHTML.push("</div>");
jsHTML.push("<div class='um-bottom-spacing'><span class='um-ribbon-labels'>",rcm_auth_ribbon_i18n.RCM_AUTH_STATUS,"</span><span>",authorization.AUTH_STATUS_DISPLAY,"</span></div>");
jsHTML.push("<div class='um-bottom-spacing'><span class='um-ribbon-labels'>",rcm_auth_ribbon_i18n.RCM_AUTH_END_DATE,"</span><span>",this.getDate(authorization.AUTHORIZATION_END_DT_TM),"</span></div>");
}}if(settings.isAuthOn&&(settings.isEddOn||settings.isElosOn)){jsHTML.push("<div class='um-horizontal-line'></div>");
}if(settings.isEddOn){jsHTML.push("<div><span class='um-ribbon-labels'>",rcm_auth_ribbon_i18n.RCM_PDD,"</span>");
if(personInfo.EDD_DATE){jsHTML.push("<span>",personInfo.EDD_DATE,"</span>");
if(personInfo.EDD_TIME_INTERVAL){jsHTML.push("<span class=um-los-spacing>",rcm_auth_ribbon_i18n.RCM_COMMA,"</span>");
jsHTML.push("<span>",personInfo.EDD_TIME_INTERVAL,"</span>");
}}else{if(personInfo.EDD_TIME_INTERVAL){jsHTML.push("<span>",personInfo.EDD_TIME_INTERVAL,"</span>");
}else{jsHTML.push("<span>",rcm_auth_ribbon_i18n.RCM_DOUBLE_DASH,"</span>");
}}jsHTML.push("</div>");
}if(settings.isElosOn){var dateEntry=personInfo.ELOS_DATE?this.getDate(personInfo.ELOS_DATE):rcm_auth_ribbon_i18n.RCM_DOUBLE_DASH;
jsHTML.push("<div><span class='um-ribbon-labels'>",rcm_auth_ribbon_i18n.RCM_ELOS,"</span><span>",dateEntry,"</span></div>");
}jsHTML.push("</div>");
jsHTML.push("</div>");
return jsHTML.join("");
},getAuthorizationPriorityLabel:function(priority){switch(priority){case 0:return rcm_auth_ribbon_i18n.RCM_PRIMARY;
case 1:return rcm_auth_ribbon_i18n.RCM_SECONDARY;
case 2:return rcm_auth_ribbon_i18n.RCM_TERTIARY;
case 3:return rcm_auth_ribbon_i18n.RCM_QUATERNARY;
default:return priority+1;
}},getDate:function(date){var nrDate;
if(date===""){nrDate="";
}else{var tempDate=new Date();
tempDate.setISO8601(date);
nrDate=new Date(tempDate).format("shortDate2");
}return nrDate;
},calculateDateFromAdmit:function(admitDate,hours){if(admitDate&&hours){var date=new Date();
date.setISO8601(admitDate);
var dateVal=date.valueOf();
var elosMillisec=hours*this.MILLISEC_IN_HOUR;
return(new Date(dateVal+elosMillisec)).toJSON();
}return"";
},createJSONString:function(json){var jsonString=JSON.stringify(json);
return jsonString.replace(/'/g,"&#39");
}};
}();
