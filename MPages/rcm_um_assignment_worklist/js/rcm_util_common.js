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
}}function BusinessSearchControl(oTextBox){var selectedId=0;
var orgTypeCds=[];
var childOrgAddressTypeMeaning="";
var parentOrgId=0;
var serviceDelegate=new BusinessServiceDelegate();
var allOrgResults=null;
var getFilteredResults=function(searchString){var filteredResults=new Array();
for(var i=0,length=allOrgResults.length;
i<length;
i++){var result=allOrgResults[i];
if(result.NAME.substr(0,searchString.length).toLowerCase()===searchString.toLowerCase()){filteredResults.push(result);
}}return filteredResults;
};
var selectionHandler=function(newSelectedId){selectedId=newSelectedId;
};
var queryHandler=function(callback,searchString){if(allOrgResults==null){serviceDelegate.getResults(parentOrgId,orgTypeCds,childOrgAddressTypeMeaning,searchString,function(results){allOrgResults=results;
callback.autosuggest(getFilteredResults(searchString));
});
}else{callback.autosuggest(getFilteredResults(searchString));
}};
var autoSuggestControl=new RCMAutoSuggestControl(oTextBox,queryHandler,selectionHandler,ToolTipDetailsHandler);
autoSuggestControl.delay=0;
this.getSelectedOrganizationId=function(){return selectedId;
};
this.setSelectedOrganization=function(organizationId,organizationName){selectedId=organizationId;
oTextBox.value=organizationName;
autoSuggestControl.setVerified(organizationId>0);
};
this.setParentOrgId=function(newParentOrgId){allOrgResults=null;
parentOrgId=newParentOrgId;
};
this.setOrgTypeCds=function(newOrgTypeCds){allOrgResults=null;
orgTypeCds=newOrgTypeCds;
};
this.setChildOrgAddressTypeMeaning=function(newChildOrgAddressTypeMeaning){allOrgResults=null;
childOrgAddressTypeMeaning=newChildOrgAddressTypeMeaning;
};
this.setRequired=function(required){autoSuggestControl.setRequired(required);
};
this.isVerified=function(){return autoSuggestControl.isVerified;
};
this.addVerifyStateChangeListener=function(listener){autoSuggestControl.addVerifyStateChangeListener(listener);
};
this.removeVerifyStateChangeListener=function(listener){autoSuggestControl.removeVerifyStateChangeListener(listener);
};
var addEventHandler=function(element,event,handler){element.addEventListener?element.addEventListener(event,handler,false):element.attachEvent("on"+event,handler);
};
if(oTextBox.form){addEventHandler(oTextBox.form,"reset",function(){selectedId=0;
autoSuggestControl.setVerified(false);
});
}}function BusinessServiceDelegate(){this.getResults=function(parentOrgId,orgTypeCds,childOrgAddressTypeMeaning,searchString,callback){var childOrgTypeCdsJson=[];
for(var i=0;
i<orgTypeCds.length;
i++){childOrgTypeCdsJson.push({ORG_TYPE_CD:orgTypeCds[i].toFixed(1)});
}var json={BUSINESS_SEARCH_REQUEST:{PARENT_ORG_ID:parentOrgId.toFixed(1),CHILD_ORG_ADDRESS_TYPE_MEANING:childOrgAddressTypeMeaning,CHILD_ORG_PHONE_TYPE_MEANING:"",SERVICES_IND:0,CHILD_ORG_TYPES:childOrgTypeCdsJson}};
var sendAr=[];
sendAr.push("^MINE^","0.0","2","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",sendAr,true,function(status,recordData){if("S"===status){var orgResults=new Array();
for(var i=0,length=recordData.CHILD_ORGS.length;
i<length;
i++){var child_org=recordData.CHILD_ORGS[i];
orgResults.push({NAME:child_org.ORG_NAME,VALUE:child_org.ORGANIZATION_ID,DETAILS:child_org.ORG_FORMATTED_ADDRESS});
}callback(orgResults);
}else{if("F"===status){if(recordData){alert(recordData);
}}}});
};
}function DrgSearchControl(oTextBox){var selectedDRG;
var drgResults;
var isSearchByCode=function(searchString){var reg=new RegExp("[0-9]+[.]?[0-9]*$");
return reg.test(searchString);
};
function ArraySortNumberAscending(a,b){if(a&&b){if(a.VALUE.SOURCEIDENTIFIER>b.VALUE.SOURCEIDENTIFIER){return 1;
}else{if(a.VALUE.SOURCEIDENTIFIER<b.VALUE.SOURCEIDENTIFIER){return -1;
}else{return 0;
}}}else{if(!a&&b){return -1;
}else{if(a&&!b){return 1;
}else{return 0;
}}}}function ArraySortStringAscending(a,b){if((!a.NAME||a.NAME.length===0)&&(b.NAME&&b.NAME.length>0)){return -1;
}else{if((!b.NAME||b.NAME.length===0)&&(a.NAME&&a.NAME.length>0)){return 1;
}else{if((a.NAME&&a.NAME.length>0)&&(b.NAME&&b.NAME.length>0)){var aName=a.NAME;
var bName=b.NAME;
if(aName.length>bName.length){aName=aName.substring(0,aName.length);
}else{if(aName.length>bName.length){bName=bName.substring(0,bName.length);
}}if(aName>bName){return 1;
}else{if(aName<bName){return -1;
}else{return 0;
}}}else{return 0;
}}}}var getFilteredResults=function(searchString){var filteredResults=[];
if(isSearchByCode(searchString)){for(var i=0,length=drgResults.length;
i<length;
i++){var result=drgResults[i];
if(result){filteredResults.push(result);
}}filteredResults.sort(ArraySortNumberAscending);
}else{for(var i=0,length=drgResults.length;
i<length;
i++){var result=drgResults[i];
if(result){filteredResults.push(result);
}}filteredResults.sort(ArraySortStringAscending);
}return filteredResults;
};
var selectionHandler=function(newselectedDRG){selectedDRG=newselectedDRG;
};
var queryHandler=function(callback,searchString){if(searchString.replace(/\s+/g,"").length<3&&!isSearchByCode(searchString)){callback.autosuggest(new Array());
}else{new DrgServiceDelegate().getResults(searchString,function(results){drgResults=results;
callback.autosuggest(getFilteredResults(searchString));
});
}};
this.setSelectedDRG=function(selectedDRG,term){selectedDRG=selectedDRG;
oTextBox.value=term;
autoSuggestControl.setVerified(selectedDRG);
};
var addEventHandler=function(element,event,handler){if(element){element.addEventListener?element.addEventListener(event,handler,false):element.attachEvent("on"+event,handler);
}};
addEventHandler(oTextBox.form,"reset",function(){if(oTextBox.form){selectedId=0;
autoSuggestControl.setVerified(false);
}});
this.getSelectedDRG=function(){return selectedDRG;
};
this.setRequired=function(required){autoSuggestControl.setRequired(required);
};
this.isVerified=function(){return autoSuggestControl.isVerified;
};
this.addVerifyStateChangeListener=function(listener){autoSuggestControl.addVerifyStateChangeListener(listener);
};
this.removeVerifyStateChangeListener=function(listener){autoSuggestControl.removeVerifyStateChangeListener(listener);
};
var autoSuggestControl=new RCMAutoSuggestControl(oTextBox,queryHandler,selectionHandler,ToolTipDetailsHandler);
autoSuggestControl.delay=3;
}function DrgServiceDelegate(){this.getResults=function(searchString,callback){var json={drg_search_request:{search_phrase:searchString,term_limit:0}};
var sendAr=[];
sendAr.push("^MINE^","0.0","3","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",sendAr,true,function(status,recordData){if("S"===status){var drgResults=new Array();
for(var i=0,length=recordData.TERMS.length;
i<length;
i++){var drg=recordData.TERMS[i];
drgResults.push({NAME:drg.TERM+" ("+drg.CODE+")",VALUE:{SOURCEIDENTIFIER:drg.CODE,NOMENCLATUREID:drg.NOMENCLATURE_ID},DETAILS:"<strong>Description</strong>: <dfn>"+drg.TERM+"</dfn><br><strong>Code</strong>: <em>"+drg.CODE+"</em>"});
}callback(drgResults);
}else{if("F"===status){if(recordData){alert(recordData);
}}}});
};
}function OrgSearchControl(textBox){var selectedId=0;
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
}}function VIEWLINK(mode,appName,personId,encounterId,tab,viewId,viewpointId){var CK_DATA={};
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
