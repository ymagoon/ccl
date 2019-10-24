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
this.layer.className="suggestions";
this.layer.style.visibility="hidden";
this.layer.style.width=this.textbox.offsetWidth;
this.layer.onmousedown=this.layer.onmouseup=this.layer.onmouseover=function(oEvent){oEvent=oEvent||window.event;
oTarget=oEvent.target||oEvent.srcElement;
if(oEvent.type=="mousedown"){var index=that.indexOf(this,oTarget);
if(that.suggestions[index]){that.textbox.value=that.suggestions[index].NAME;
that.selectionHandler(that.suggestions[index].VALUE);
that.hideSuggestions();
that.setVerified(true);
}}else{if(oEvent.type=="mouseover"){var index=that.indexOf(this,oTarget);
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
RCMAutoSuggestControl.prototype.handleKeyDown=function(oEvent){if(this.layer.style.visibility!="hidden"){switch(oEvent.keyCode){case 38:this.previousSuggestion();
break;
case 40:this.nextSuggestion();
break;
case 13:this.textbox.value=this.suggestions[this.cur].NAME;
this.selectionHandler(this.suggestions[this.cur].VALUE);
this.hideSuggestions();
this.setVerified(true);
break;
}}};
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
RCMAutoSuggestControl.prototype.hideSuggestions=function(){this.layer.style.visibility="hidden";
};
RCMAutoSuggestControl.prototype.highlightSuggestion=function(suggestionNode){for(var i=0;
i<this.layer.childNodes.length;
i++){var curNode=this.layer.childNodes[i];
if(curNode==suggestionNode||curNode==suggestionNode.parentNode){curNode.className="current";
}else{if(curNode.className=="current"){curNode.className="";
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
if(i==0){oDiv.className="current";
}this.cur=0;
var itemText=this.emboldenTypeAheadText(suggestions[i].NAME,this.textbox.value);
oDiv.innerHTML=itemText;
this.detailsHandler(suggestions[i].DETAILS,oDiv);
this.layer.appendChild(oDiv);
}this.layer.style.left=this.getLeft()+"px";
this.layer.style.top=(this.getTop()+this.textbox.offsetHeight)+"px";
this.layer.style.visibility="visible";
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
if(isRequired){$("label[for='"+$(this.textbox).attr("id")+"']").prepend("<span style='color:#cc0000'>*</span>");
}else{$("label[for='"+$(this.textbox).attr("id")+"']").children(1).remove();
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
}}
function AutoSuggestControl(oComponent,oQueryHandler,oSelectionHandler,oSuggestionDisplayHandler){this.cur=0;
this.layer=null;
this.component=oComponent;
this.queryHandler=oQueryHandler;
this.selectionHandler=oSelectionHandler;
this.suggestionDisplayHandler=oSuggestionDisplayHandler;
this.textbox=_g(oComponent.getStyles().getNameSpace()+"ContentCtrl"+oComponent.getComponentId());
this.objArray="";
this.init();
}AutoSuggestControl.prototype.autosuggest=function(aSuggestions){this.layer.style.width=this.textbox.offsetWidth;
this.objArray=aSuggestions;
if(aSuggestions&&aSuggestions.length>0){this.showSuggestions(aSuggestions);
}else{this.hideSuggestions();
}};
AutoSuggestControl.prototype.createDropDown=function(){var oThis=this;
this.layer=document.createElement("div");
this.layer.className="suggestions";
this.layer.style.visibility="hidden";
this.layer.style.width=this.textbox.offsetWidth;
this.layer.onmousedown=this.layer.onmouseup=this.layer.onmouseover=function(oEvent){oEvent=oEvent||window.event;
oTarget=oEvent.target||oEvent.srcElement;
if(oEvent.type=="mousedown"){var index=AutoSuggestControl.prototype.indexOf(this,oTarget);
oThis.selectionHandler(oThis.objArray[index],oThis.textbox,oThis.component);
oThis.hideSuggestions();
}else{if(oEvent.type=="mouseover"){var index=AutoSuggestControl.prototype.indexOf(this,oTarget);
oThis.cur=index;
oThis.highlightSuggestion(oTarget);
}else{oThis.textbox.focus();
}}};
document.body.appendChild(this.layer);
};
AutoSuggestControl.prototype.getLeft=function(){var oNode=this.textbox;
var iLeft=0;
while(oNode&&oNode.tagName!="BODY"){iLeft+=oNode.offsetLeft;
oNode=oNode.offsetParent;
}return iLeft;
};
AutoSuggestControl.prototype.getTop=function(){var oNode=this.textbox;
var iTop=0;
while(oNode&&oNode.tagName!="BODY"){iTop+=oNode.offsetTop;
oNode=oNode.offsetParent;
}return iTop;
};
AutoSuggestControl.prototype.handleKeyDown=function(oEvent){if(this.layer.style.visibility!="hidden"){switch(oEvent.keyCode){case 38:this.previousSuggestion();
break;
case 40:this.nextSuggestion();
break;
case 13:this.selectionHandler(this.objArray[this.cur],this.textbox,this.component);
this.hideSuggestions();
break;
}}};
AutoSuggestControl.prototype.handleKeyUp=function(oEvent){var iKeyCode=oEvent.keyCode;
if(iKeyCode==8||iKeyCode==46){if(this.textbox.value.length>0){this.queryHandler(this,this.textbox,this.component);
}else{this.hideSuggestions();
}}else{if(iKeyCode<32||(iKeyCode>=33&&iKeyCode<46)||(iKeyCode>=112&&iKeyCode<=123)){}else{this.queryHandler(this,this.textbox,this.component);
}}};
AutoSuggestControl.prototype.hideSuggestions=function(){this.layer.style.visibility="hidden";
};
AutoSuggestControl.prototype.highlightSuggestion=function(oSuggestionNode){for(var i=0;
i<this.layer.childNodes.length;
i++){var oNode=this.layer.childNodes[i];
if(oNode==oSuggestionNode||oNode==oSuggestionNode.parentNode){oNode.className="current";
}else{if(oNode.className=="current"){oNode.className="";
}}}};
AutoSuggestControl.prototype.init=function(){var oThis=this;
this.textbox.onkeyup=function(oEvent){if(!oEvent){oEvent=window.event;
}oThis.handleKeyUp(oEvent);
};
this.textbox.onkeydown=function(oEvent){if(!oEvent){oEvent=window.event;
}oThis.handleKeyDown(oEvent);
};
this.textbox.onblur=function(){oThis.hideSuggestions();
};
this.createDropDown();
};
AutoSuggestControl.prototype.nextSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur<cSuggestionNodes.length-1){var oNode=cSuggestionNodes[++this.cur];
this.highlightSuggestion(oNode);
}};
AutoSuggestControl.prototype.previousSuggestion=function(){var cSuggestionNodes=this.layer.childNodes;
if(cSuggestionNodes.length>0&&this.cur>0){var oNode=cSuggestionNodes[--this.cur];
this.highlightSuggestion(oNode);
}};
AutoSuggestControl.prototype.showSuggestions=function(aSuggestions){var oDiv=null;
this.layer.innerHTML="";
for(var i=0;
i<aSuggestions.length;
i++){oDiv=document.createElement("div");
if(i==0){oDiv.className="current";
}this.cur=0;
var domText=this.suggestionDisplayHandler(aSuggestions[i],this.textbox.value);
oDiv.innerHTML=domText;
oDiv.appendChild(document.createTextNode(""));
this.layer.appendChild(oDiv);
}this.layer.style.left=this.getLeft()+"px";
this.layer.style.top=(this.getTop()+this.textbox.offsetHeight)+"px";
this.layer.style.visibility="visible";
this.layer.style.position="absolute";
};
AutoSuggestControl.prototype.indexOf=function(parent,el){var nodeList=parent.childNodes;
for(var i=0;
i<nodeList.length;
i++){var oNode=nodeList[i];
if(oNode==el||oNode==el.parentNode){return i;
}}return -1;
};
AutoSuggestControl.prototype.highlight=function(value,term){return"<strong>"+value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1").split(" ").join("|")+")(?![^<>]*>)(?![^&;]+;)","gi"),"</strong>$1<strong>")+"</strong>";
};

function BusinessSearchControl(oTextBox){var selectedId=0;
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
}}
function BusinessServiceDelegate(){this.getResults=function(parentOrgId,orgTypeCds,childOrgAddressTypeMeaning,searchString,callback){var childOrgTypeCdsJson=[];
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
}
function DrgSearchControl(oTextBox){var selectedDRG;
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
}
function DrgServiceDelegate(){this.getResults=function(searchString,callback){var json={drg_search_request:{search_phrase:searchString,term_limit:0}};
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
}
function ProviderSearchControl(textBox){var selectedId=0;
var serviceDelegate=new ProviderServiceDelegate();
var orgSecurityInd=0;
var physicianOnlyInd=0;
var selectionHandler=function(newSelectedId){selectedId=newSelectedId;
};
var queryHandler=function(callback,searchString){serviceDelegate.getResults(searchString,function(results){callback.autosuggest(results);
},orgSecurityInd,physicianOnlyInd);
};
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
this.addVerifyStateChangeListener=function(listener){autoSuggestControl.addVerifyStateChangeListener(listener);
};
this.removeVerifyStateChangeListener=function(listener){autoSuggestControl.removeVerifyStateChangeListener(listener);
};
var addEventHandler=function(element,event,handler){element.addEventListener?element.addEventListener(event,handler,false):element.attachEvent("on"+event,handler);
};
if(textBox.form){addEventHandler(textBox.form,"reset",function(){selectedId=0;
autoSuggestControl.setVerified(false);
});
}}
function ProviderServiceDelegate(){var that=this;
this.getResults=function(searchString,callback,orgSecurityInd,physicianInd){if(searchString.replace(/\s+/g,"").length<3){callback(new Array());
return;
}var searchTokens=Search_Util.createPersonNameSearchTokens(searchString);
var nameLastKey=searchTokens[0]+"*";
var nameFirstKey=((searchTokens.length>1)?searchTokens[1]:"")+"*";
var json={REQUEST:{MAX:10,NAME_LAST_KEY:nameLastKey,NAME_FIRST_KEY:nameFirstKey,PHYSICIAN_IND:physicianInd,INACTIVE_IND:0,FT_IND:0,NON_FT_IND:0,PRIV:[],PRSNL_GROUP_ID:0,LOCATION_CD:0,SEARCH_STR_IND:0,SEARCH_STR:"",TITLE_STR:"",SUFFIX_STR:"",DEGREE_STR:"",USE_ORG_SECURITY_IND:orgSecurityInd,ORGANIZATION_ID:0,ORGANIZATIONS:[],START_NAME:"",START_NAME_FIRST:"",CONTEXT_IND:0,CONTEXT_PERSON_ID:0,RETURN_ALIASES:0,RETURN_ORGS:1,RETURN_SERVICES:1,ALIAS_TYPE_LIST:"",PROVIDER_FILTER:[],AUTH_ONLY_IND:1}};
var requestArgs=[];
requestArgs.push("^MINE^","0.0","1","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",requestArgs,true,function(status,recordData){if("S"===status){var providerResults=[];
for(var i=0,length=recordData.PRSNL.length;
i<length;
i++){var providerResult=recordData.PRSNL[i];
providerResults.push({NAME:providerResult.NAME_FULL_FORMATTED.replace(/\s+$/,""),VALUE:providerResult.PERSON_ID,DETAILS:createProviderAdditionalDetails(providerResult)});
}callback(providerResults);
}else{if("F"===status){callback(new Array());
}}});
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
}}
// TODO: Move these i18n strings to the core i18n file, 
i18n.RCM_COMMUNICATION = "Communication";

var RCM_Clinical_Util = function() {
	return {
		createComponentMappings : function(prefix) {
			var mappings = [];
			// Creates a single component mapping
			function createComponentMapping(fullComponentName, constructorName) {
				var componentConstructor = window[constructorName];
				if (componentConstructor) {
					mappings.push(new MP_Core.MapObject(fullComponentName, componentConstructor));
				} 
			}
			// in order to retrieve the common styles for components, each consumer will have to create
			// a mapping of the potential bedrock component names to a common component name.
			createComponentMapping(prefix+"_"+"allergy", "AllergyComponent");
			createComponentMapping(prefix+"_"+"diagnosis", "DiagnosesComponent");
			createComponentMapping(prefix+"_"+"clin_doc", "DocumentComponent");
			createComponentMapping(prefix+"_"+"anc_doc", "DocumentComponent"),
			createComponentMapping(prefix+"_"+"ins_info", "InsuranceComponent");
			createComponentMapping(prefix+"_"+"lab", "LaboratoryComponent");
			createComponentMapping(prefix+"_"+"meds", "MedicationsComponent");
			createComponentMapping(prefix+"_"+"notes", "NotesRemindersComponent");
			createComponentMapping(prefix+"_"+"incomplete_orders", "OrdersComponent");
			createComponentMapping(prefix+"_"+"path", "PathologyComponent");
			createComponentMapping(prefix+"_"+"pt_info", "PatientInfoComponent");
			createComponentMapping(prefix+"_"+"proc_hx", "ProcedureComponent");
			createComponentMapping(prefix+"_"+"problem", "ProblemsComponent");
			createComponentMapping(prefix+"_"+"social_hx", "SocialHistoryComponent");
			createComponentMapping(prefix+"_"+"visit_info", "VisitInfoComponent");
			createComponentMapping(prefix+"_"+"vs", "VitalSignComponent");
			createComponentMapping(prefix+"_"+"rad", "DiagnosticsComponent");
			createComponentMapping(prefix+"_"+"micro_pathnet", "MicrobiologyComponent");
			createComponentMapping(prefix+"_"+"med_rec", "MedicationReconciliationComponent");
			createComponentMapping(prefix+"_"+"past_med_hx", "PastMedicalHistoryComponent");
			createComponentMapping(prefix+"_"+"dc_plan", "DischargePlanningComponent");
			createComponentMapping(prefix+"_"+"post_acute_place", "RCMPostAcutePlacementListComponent");
			createComponentMapping(prefix+"_"+"post_acute_serv", "RCMPostAcuteServicesListComponent");
			createComponentMapping(prefix+"_"+"care_mgmt", "UtilizationManagementRetrieveComponent");
			createComponentMapping(prefix+"_"+"clin_review", "ClinicalListComponent");
			createComponentMapping(prefix+"_"+"avoid_days", "RCMAvoidableDaysListComponent");
			createComponentMapping(prefix+"_"+"denials", "RCMDeniedDaysListComponent");
			createComponentMapping(prefix+"_"+"disch_orders", "DischargeOrdersComponent");
			createComponentMapping(prefix+"_"+"followup", "FollowUpComponent");
			createComponentMapping(prefix+"_"+"doc_review", "DocumentListComponent");
			createComponentMapping(prefix+"_"+"review_editor", "DocumentationFormComponent");
			createComponentMapping(prefix+"_"+"qm", "QualityMeasuresComponent");
			createComponentMapping(prefix+"_"+"cm_notes", "CareNotesListComponent");
			
			//Unfortunately, discharge summary bedrock setting uses different strings format.
			createComponentMapping("mp_dcm_post_acute_placement", "RCMPostAcutePlacementListComponent");
			createComponentMapping("mp_dcm_post_acute_services", "RCMPostAcuteServicesListComponent");
			createComponentMapping("mp_ur_dcm_care_mgmt", "UtilizationManagementRetrieveComponent");
			createComponentMapping("mp_ur_dcm_clin_review", "ClinicalListComponent");
			createComponentMapping("mp_ur_dcm_avoid_days", "RCMAvoidableDaysListComponent");
			createComponentMapping("mp_ur_dcm_denials", "RCMDeniedDaysListComponent");
			
			return mappings;
		},
		
		/**
		 * Adds a component mapping to an array of component mappings.
		 *
		 * @param {Array} componentMappings The array of component mappings. 
		 * @param {String} name The name of the component mapping.
		 * @param {Function} constructor The component's constructor.
		 */
		addComponentMapping : function(componentMappings, name, constructor) {
			componentMappings.push(new MP_Core.MapObject(name, constructor));
		},
		
		createComponentFunctionMapping : function(prefix){
	     
			var compFuncFilterMapping = [
		 new MP_Core.MapObject(prefix + '_restraints','{"FUNCTIONS":[{"FILTER_MEAN": "NC_EXPIRE_HRS", "NAME":"setExpireHours", "TYPE":"Number", "FIELD": "FREETEXT_DESC"}]}')
		,new MP_Core.MapObject(prefix + '_pt_background','{"FUNCTIONS":['+
			'{"FILTER_MEAN": "NC_PAIN_SCR", "NAME":"setPainScores", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_ASSIST_DEV", "NAME":"setDevices", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_DIET_ORD", "NAME":"setDietOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_PT_ACT_ORD", "NAME":"setPatientActivityOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_RESUS_ORD", "NAME":"setResucitationOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_SEIZURE_ORD", "NAME":"setSeizureOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_ISOLATION_ORD", "NAME":"setIsolationOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_ADV_DIR", "NAME":"setAdvancedDirectives", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_PARA", "NAME":"setParas", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_GRAVIDA", "NAME":"setGravidas", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_FALL_PRECAUTIONS", "NAME":"setFallPrecautions", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'+
			']}')
		,new MP_Core.MapObject(prefix + '_resp','{"FUNCTIONS":['+
			'{"FILTER_MEAN": "NC_VENT_MODE", "NAME":"setVentilatorModeCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_SET_TIDAL_VOL", "NAME":"setTidalVolCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_SET_RATE", "NAME":"setSetRateCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_FIO2", "NAME":"setFIO2Codes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_PEEP", "NAME":"setPEEPCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_FLOW_RATE", "NAME":"setO2FlowRateCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_RESP_RATE", "NAME":"setRespiratoryRateCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_MIN_VOL", "NAME":"setMinVolCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_INSP_SET_TIME", "NAME":"setInspTimeSetCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_INSP_TIME_DEL", "NAME":"setInspTimeDelCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_RESP_OTHER", "NAME":"setABGCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'+
			']}')                                     
		,new MP_Core.MapObject(prefix + '_plan','{"FUNCTIONS":['+
			'{"FILTER_MEAN": "NC_PLAN_STATUS", "NAME":"setPlanStatusCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_PLAN_CLASS", "NAME":"setPlanClassificationCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'+
			']}')
		,new MP_Core.MapObject(prefix + '_lines','{"FUNCTIONS":['+
			'{"FILTER_MEAN": "NC_LINES_ES", "NAME":"setLineCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NC_TUBES_DRAINS_ES", "NAME":"setTubeCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}'+
			']}')
		,new MP_Core.MapObject(prefix + '_pt_info', '{"FUNCTIONS":[' +
			'{"FILTER_MEAN": "CHIEF_COMP_CE", "NAME":"setChiefComplaint", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "RESUS_ORDER", "NAME":"setResusOrders", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "ADV_DIRECTIVE", "NAME":"setAdvancedDirectives", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "MODE_ARRIVAL_CE", "NAME":"setModeofArrival", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "NOTE_ES", "NAME":"setDocumentTypes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "TARGET_DC_DT", "NAME":"setEstimatedDischargeDate", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "ENC_TYPE", "NAME":"setVisitTypeCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},'+
			'{"FILTER_MEAN": "REASON_IND", "NAME":"setRFVDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "PRIMARY_DR_IND", "NAME":"setPrimaryPhysDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "ED_CONTACT_IND", "NAME":"setEmergencyContactsDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "ADMIT_DR_IND", "NAME":"setAdmittingPhysDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "RM_IND", "NAME":"setRoomBedDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "ATTEND_DR_IND", "NAME":"setAttendingPhysDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "ADM_DT_IND", "NAME":"setAdmitDateDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "MED_SVC_IND", "NAME":"setMedicalServiceDisplay", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}]}')
		,new MP_Core.MapObject(prefix + '_meds', '{"FUNCTIONS":[' +
			'{"FILTER_MEAN": "MEDS_PRN", "NAME":"setPRNLookbackDays", "TYPE":"Number", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "MEDS_SCHED", "NAME":"setScheduled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "MEDS_SUS", "NAME":"setSuspended", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "MEDS_DISC_LB_HRS", "NAME":"setDiscontinuedLookBkHr", "TYPE":"Number", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "MEDS_DISC", "NAME":"setDiscontinued", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "MEDS_ADM_LB_HRS", "NAME":"setAdministeredLookBkHrs", "TYPE":"Number", "FIELD": "FREETEXT_DESC"},' +
			'{"FILTER_MEAN": "MEDS_ADM", "NAME":"setAdministered", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
			']}')
		,new MP_Core.MapObject(prefix + '_incomplete_orders', '{"FUNCTIONS":[' +
			'{"FILTER_MEAN": "INCOMPLETE_ORDERS_CAT_TYPE", "NAME":"setCatalogCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}' +
			']}')
		,new MP_Core.MapObject(prefix + '_care_mgmt', '{"FUNCTIONS":[' +
				'{"FILTER_MEAN": "DOC_SPECIAL_IND", "NAME":"setDocumentReviewFields", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
				']}')
		,new MP_Core.MapObject(prefix + '_cm_notes','{"FUNCTIONS":[{"FILTER_MEAN": "CM_NOTE_TYPES", "NAME":"setNoteTypes",' +
				'"TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}]}')

		//Unfortunately, discharge summary bedrock setting uses different strings format.
	    ,new MP_Core.MapObject('mp_ur_dcm_care_mgmt', '{"FUNCTIONS":[' +
    				'{"FILTER_MEAN": "DOC_SPECIAL_IND", "NAME":"setDocumentReviewFields", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
    				']}')
		,new MP_Core.MapObject(prefix + '_qm', '{"FUNCTIONS":[' + 
                    '{"FILTER_MEAN": "PLAN_STATUS", "NAME":"setPlanStatusCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},' + 
                    ']}') 
		,new MP_Core.MapObject(prefix + '_vs', '{"FUNCTIONS":[' + 
                       '{"FILTER_MEAN": "VS_CE_SEQ", "NAME":"setMasterSequence", "TYPE":"Array", "FIELD": "STRING"},' + 
                       '{"FILTER_MEAN": "bp_group", "NAME":"setBPLabels", "TYPE":"Array", "FIELD": "STRING"}' + 
                       ']}') 
		,new MP_Core.MapObject( 
				'mp_ur_diagnosis', 
				'{"FUNCTIONS":[' + '{"FILTER_MEAN": "DIAGNOSIS_TYPE", "NAME":"setDiagnosisType", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"}]}')
		,new MP_Core.MapObject('mp_ur_clin_review_editor','{"FUNCTIONS":[{"FILTER_MEAN": "CLIN_REVIEW_NLP", "NAME":"setShowNLP",' +
			'"TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}]}')
		];	
		return compFuncFilterMapping;
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
						buttonImage: component.getCriterion().static_content + '\\images\\4974.png',
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
		formatDate : function(date) {
			return date.format('shortDate2');
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
				formattedString = date.format("hh:MM tt");
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
					formattedString = date.format("mm/dd/yyyy hh:MM tt");
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
			var date = now.format('hh:MM TT');
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
		
		makeCCLRequest : function(program, paramAr, async, statusHandler, isDecodeJSON) {
			var info = new XMLCclRequest();
			info.onreadystatechange = function(){
				if (info.readyState === 4 && info.status === 200){	
					if (statusHandler) {
						var jsonEval = isDecodeJSON ? RCM_Clinical_Util.parseJSON(info.responseText) : JSON.parse(info.responseText);
						var recordData = jsonEval.RECORD_DATA;
						if (recordData.STATUS_DATA.STATUS === "Z") {
							statusHandler("Z", recordData);
						}
						else if (recordData.STATUS_DATA.STATUS === "S") {
							if (recordData.STATUS === "STALE_DATA") {							
								statusHandler("STALE_DATA", recordData);
							} 
							else {
								statusHandler("S", recordData);
							}
						}
						else {
							statusHandler("F", recordData);
						}
					}
				}
				else if (info.readyState === 4 && info.status !== 200) {
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
							if (recordData.STATUS_DATA.STATUS === "Z") {
								statusHandler("Z", recordData);
							}
							else if (recordData.STATUS_DATA.STATUS === "S") {
								statusHandler("S", recordData);
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
				excluded = false;
				for(var i = 0, excludedLength = excludedComponents.length; i < excludedLength; i++) {
					if(component === excludedComponents[i]) {
						excluded = true;
						break;
					}
				}
				
				if(!excluded) {
					if (typeof(DiagnosticsComponent) == "function" && component instanceof DiagnosticsComponent) {
						var groups = component.getGroups();
						if(groups != null) {
							for (var z = 0, groupsLength = groups.length; z < groupsLength; z++) {
								var group = groups[z];
								switch (group.getGroupName()) {
									case "CXR_ABD_CE":
										group.setGroupName(i18n.CHEST_ABD_XR);
										break;
									case "EKG_CE":
										group.setGroupName(i18n.EKG);
										break;
									case "OTHER_RAD_ES":
										group.setGroupName(i18n.OTHER_DIAGNOSTICS);
										break;
								};
							}
						}
					} 
					else if (typeof(VitalSignComponent) == "function" && component instanceof VitalSignComponent) {
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
					$(timeTextBox).timeEntry($.extend({},$.timeEntry.regional[i18n.RCM_CALENDAR_LOCALIZATION],{
						ampmPrefix : ' '						
						}));				
					$(timeTextBox).timeEntry();		
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
		}
	};
}();

var RCM_DropDownMenu=function(){return{setMenuItemVisible:function(menuId,itemName,isVisible){var menuItem=document.getElementById(menuId+itemName);
if(menuItem){menuItem.style.display=isVisible?"block":"none";
}},isMenuItemVisible:function(menuId,itemName){var menuItem=document.getElementById(menuId+itemName);
return menuItem?menuItem.style.display!=="none":false;
},isMenuItemEnabled:function(menuId,itemName){var menuItem=document.getElementById(menuId+itemName);
return menuItem?!menuItem.disabled:false;
},setMenuItemEnabled:function(menuId,itemName,isEnabled){var menuItem=document.getElementById(menuId+itemName);
if(menuItem){menuItem.disabled=!isEnabled;
}},createMenuItem:function(display,eventHandler,itemName){return{display:display,eventHandler:eventHandler,itemName:itemName,getDisplay:function(){return this.display;
},getEventHandler:function(){return this.eventHandler;
},getItemName:function(){return this.itemName;
}};
},createMenuOptions:function(){return{isLeftAlignedMenu:function(){return this.leftAlignedMenu;
},setLeftAlignedMenu:function(isLeftAlignedMenu){this.leftAlignedMenu=isLeftAlignedMenu;
},getImageName:function(){return this.imageName;
},setImageName:function(imageName){this.imageName=imageName;
}};
},addDropDownMenu:function(component,menuId,menuItems,menuOptions){var menuImageId=menuId+"Image";
this.removeDropDownMenu(menuId);
var menuImage=Util.ce("img");
var imageName="6361_16.gif";
var isLeftMenu=false;
if(menuOptions){isLeftMenu=menuOptions.isLeftAlignedMenu();
if(menuOptions.getImageName()){imageName=menuOptions.getImageName();
}else{if(isLeftMenu){imageName="5323_16.png";
}}}menuImage.src=component.getCriterion().static_content+"\\images\\"+imageName;
menuImage.id=menuImageId;
var componentDiv=document.getElementById(component.getStyles().getId());
var scrollParent;
$.each($(componentDiv).parents(),function(index,value){if(!scrollParent&&value.tagName.toLowerCase()==="div"&&(value.className==="col1"||value.className==="col2"||value.className==="col3")){scrollParent=value;
$(scrollParent).scroll(function(){Util.Style.acss(menu,"menu-hide");
});
}});
if(isLeftMenu){var addPlusButton=Util.Style.g("add-plus",componentDiv,"a")[0];
Util.ia(menuImage,addPlusButton);
}else{menuImage.className="rcm-drop-menu-img";
var componentToggle=Util.Style.g("sec-hd-tgl",componentDiv,"span")[0];
if(componentToggle){Util.ia(menuImage,componentToggle);
}else{var componentHeader=Util.Style.g(component.getStyles().getHeaderClass(),componentDiv,"h2")[0];
componentHeader.insertBefore(menuImage,componentHeader.firstChild);
}}var menu=Util.ce("div");
menu.className="rcm-drop-menu menu-hide";
menu.id=menuId;
var contentsHtml=[];
for(var item=0,length=menuItems.length;
item<length;
item++){var menuItem=menuItems[item];
contentsHtml.push("<div");
if(menuItem.getItemName()){contentsHtml.push(" id='",menuId+menuItem.getItemName(),"' ");
}contentsHtml.push(">",menuItem.getDisplay(),"</div>");
}menu.innerHTML=contentsHtml.join("");
Util.ac(menu,document.body);
var menuRows=_gbt("div",menu);
Util.addEvent(menuImage,"click",function(){if(Util.Style.ccss(menu,"menu-hide")){var isMenuItemVisible=false;
for(var row=0;
row<menuRows.length;
row++){if(menuRows[row].style.display!=="none"){isMenuItemVisible=true;
break;
}}if(!isMenuItemVisible){return;
}Util.preventDefault();
Util.Style.rcss(menu,"menu-hide");
var offset=Util.goff(componentDiv);
if(!isLeftMenu){menu.style.left=(offset[0]+componentDiv.offsetWidth-menu.offsetWidth)+"px";
}else{menu.style.left=offset[0]+"px";
}var scrollTop=scrollParent?scrollParent.scrollTop:0;
menu.style.top=(offset[1]+18-scrollTop)+"px";
}else{Util.Style.acss(menu,"menu-hide");
}});
var handleMouseOver=function(){Util.Style.acss(this,"rcm-drop-menu-hover");
};
var handleMouseOut=function(){Util.Style.rcss(this,"rcm-drop-menu-hover");
};
for(var row=0;
row<menuRows.length;
row++){var menuItem=menuItems[row];
Util.addEvent(menuRows[row],"click",menuItem.getEventHandler());
Util.addEvent(menuRows[row],"mouseover",handleMouseOver);
Util.addEvent(menuRows[row],"mouseout",handleMouseOut);
}if(window.attachEvent){Util.addEvent(menu,"mouseleave",function(){Util.Style.acss(menu,"menu-hide");
});
}else{var closeMenu=function(e){if(!e){var e=window.event;
}var relTarg=e.relatedTarget||e.toElement;
if(relTarg.id==menu.id){Util.Style.acss(menu,"menu-hide");
}e.stopPropagation();
Util.cancelBubble(e);
};
Util.addEvent(menu,"mouseout",closeMenu);
}},removeDropDownMenu:function(menuId){Util.de(document.getElementById(menuId));
Util.de(document.getElementById(menuId+"Image"));
},closeDropDownMenu:function(menuId){var menu=document.getElementById(menuId);
if(menu){Util.Style.acss(menu,"menu-hide");
}}};
}();

var Search_Util=function(){return{makeCCLRequest:function(program,paramAr,async,statusHandler){var info=new XMLCclRequest();
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
info.open("GET",program,async);
info.send(paramAr.join(","));
},createPersonNameSearchTokens:function(searchString){searchString=searchString.replace(/^\s+|\s+$/,"");
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

