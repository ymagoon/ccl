function CareTeamo1ComponentStyle(){this.initByNamespace("care-team-o1");
}CareTeamo1ComponentStyle.prototype=new ComponentStyle();
CareTeamo1ComponentStyle.prototype.constructor=ComponentStyle;
function CareTeamo1Component(criterion){this.setCriterion(criterion);
this.setStyles(new CareTeamo1ComponentStyle());
this.setComponentLoadTimerName("USR:MPG.CARETEAM.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.CARETEAM.O1 - render component");
this.m_providerRowId="";
this.m_renderTimer=null;
}CareTeamo1Component.prototype=new MPageComponent();
CareTeamo1Component.prototype.constructor=MPageComponent;
MP_Util.setObjectDefinitionMapping("CARE_TEAM",CareTeamo1Component);
CareTeamo1Component.prototype.retrieveComponentData=function(){function cclNumber(number){return(parseInt(number,10)||0)+".0";
}var criterion=this.getCriterion();
var personId=criterion.person_id;
var encntrId=criterion.encntr_id;
var domainId=criterion.logical_domain_id;
var self=this;
try{if(domainId===null){throw new Error("Logical Domain is null.");
}if(!encntrId){this.finalizeComponent('<p class="disabled">'+i18n.discernabu.careteam_o1.NO_ENCNTR+"</p>","");
return;
}var cclParams=["^MINE^",cclNumber(personId),cclNumber(encntrId),"0.0",cclNumber(domainId)];
var request=new ScriptRequest();
request.setProgramName("MP_GET_CARE_TEAM_ASSIGN");
request.setParameterArray(cclParams);
request.setLoadTimer(new RTMSTimer(self.getComponentLoadTimerName()));
request.setResponseHandler(function(reply){switch(reply.getStatus()){case"S":self.renderComponent(reply.getResponse());
break;
case"F":self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(),reply.getError()),"");
break;
default:self.renderNoCareTeam();
}});
request.performRequest();
}catch(err){MP_Util.LogJSError(err,self,"care-team-o1.js","retrieveComponentData");
self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(),err.message),"");
}};
CareTeamo1Component.prototype.processResultsForRender=function(results,primaryContact){var ctI18n=i18n.discernabu.careteam_o1;
var resultLength=results.length;
var phoneHoverHTML;
var phoneHTML;
var roleHTML;
var contactHTML;
var careTeamResult;
var primaryContactTeamId=(primaryContact)?primaryContact.PCT_CARE_TEAM_ID:0;
for(var i=0;
i<resultLength;
i++){careTeamResult=results[i];
phoneHoverHTML=[];
if(careTeamResult.MEMBER_TYPE==="SHIFT_ASSIGNMENTS"){roleHTML=careTeamResult.ASSIGN_TYPE;
}else{if(careTeamResult.MEMBER_TYPE==="LIFETIME_RELATIONSHIP"||careTeamResult.MEMBER_TYPE==="NONPROVIDER_LIFETIME_RELATION"||careTeamResult.MEMBER_TYPE==="PROVIDER_RELATION"){roleHTML=careTeamResult.RELTN_TYPE;
}else{var medServiceDisp=careTeamResult.PCT_MED_SERVICE_DISPLAY;
if(careTeamResult.PCT_TEAM_DISPLAY){medServiceDisp+=" | "+careTeamResult.PCT_TEAM_DISPLAY;
}if(!careTeamResult.FACILITY_CD){medServiceDisp+=' <span class="secondary-text">('+ctI18n.ALL_FACILITIES+")</span>";
}if(careTeamResult.PRSNL_ID&&careTeamResult.RELTN_TYPE){roleHTML=[careTeamResult.RELTN_TYPE,'<div class="secondary-line secondary-text">',medServiceDisp,"</div>"].join("");
}else{roleHTML=medServiceDisp;
}}}careTeamResult.ROLE_DISPLAY=roleHTML;
if(careTeamResult.PRSNL_ID){if(careTeamResult.PCT_CARE_TEAM_ID==primaryContactTeamId){this.m_providerRowId="care-team-o1"+this.getComponentId()+":THIS_VISIT:row"+i;
contactHTML=['<span class="care-team-o1-team">','<span class="care-team-o1-contact-spacer">',"&nbsp;","</span>",'<span class="care-team-o1-contact-name">',careTeamResult.PRSNL_NAME+" ("+ctI18n.PRIMARY+")","</span>","</span>",].join("");
}else{contactHTML=['<span class="care-team-o1-contact">','<span class="care-team-o1-contact-spacer">',"&nbsp;","</span>",'<span class="care-team-o1-contact-name">',careTeamResult.PRSNL_NAME,"</span>","</span>"].join("");
}}else{if(careTeamResult.PCT_TEAM_DISPLAY){contactHTML=['<span class="care-team-o1-team">','<span class="care-team-o1-contact-spacer care-team-o1-contact-icon">',"&nbsp;","</span>",'<span class="care-team-o1-contact-name">',careTeamResult.PCT_TEAM_DISPLAY,"</span>","</span>"].join("");
}else{if(careTeamResult.PCT_MED_SERVICE_DISPLAY){contactHTML=['<span class="care-team-o1-team">','<span class="care-team-o1-contact-spacer care-team-o1-contact-icon">',"&nbsp;","</span>",'<span class="care-team-o1-contact-name">',careTeamResult.PCT_MED_SERVICE_DISPLAY,"</span>","</span>"].join("");
}else{contactHTML=['<span class="care-team-o1-contact">','<span class="care-team-o1-contact-spacer">',"&nbsp;","</span>","--","</span>"].join("");
}}}careTeamResult.CONTACT_DISPLAY=contactHTML;
if(careTeamResult.PHONES&&careTeamResult.PHONES.length){var phoneLength=careTeamResult.PHONES.length;
phoneHTML=careTeamResult.PHONES[0].PHONE_NUM;
for(var phoneIndex=0;
phoneIndex<phoneLength;
phoneIndex++){var phone=careTeamResult.PHONES[phoneIndex];
phoneHoverHTML.push(["<dt>",'<span class="pull-left secondary-text">',phone.PHONE_TYPE+":","</span>","</dt>","<dd>","<span>",phone.PHONE_NUM,"</span>","</dd>"].join(""));
}}else{phoneHTML="--";
phoneHoverHTML.push(["<dt>",ctI18n.NO_PHONE,"</dt>"].join(""));
}careTeamResult.PHONE_DISPLAY=phoneHTML;
careTeamResult.PHONE_HOVER=['<div class="care-team-o1-hover">',"<dl>",phoneHoverHTML.join(""),"</dl>","</div>"].join("");
}};
CareTeamo1Component.prototype.renderComponent=function(recordData){var ctI18n=i18n.discernabu.careteam_o1;
var providers=recordData.CARE_TEAMS;
var shiftAssignment=recordData.SHIFT_ASSIGNMENTS;
var lifetimeReltn=recordData.LIFETIME_RELTN;
var providerReltn=recordData.PROVIDER_RELTN;
var nonProviders=recordData.NONPROVIDER_LIFETIME_RELTN;
var primaryContact=recordData.PRIMARY_CONTACT;
var numberResult=0;
var self=this;
var thisVisit=providers.concat(shiftAssignment);
var crossVisit=lifetimeReltn.concat(providerReltn);
numberResult=thisVisit.length+crossVisit.length+nonProviders.length;
try{this.m_renderTimer=MP_Util.CreateTimer(this.getComponentRenderTimerName());
var careTeamTable=(new ComponentTable()).setNamespace(this.getStyles().getId()).setIsHeaderEnabled(true).setCustomClass("care-team-o1-result-table");
var roleColumn=(new TableColumn()).setColumnId("ROLE").setCustomClass("care-team-o1-role-column").setColumnDisplay(ctI18n.ROLE_RELATIONSHIP).setPrimarySortField("ROLE_DISPLAY").setIsSortable(true).setRenderTemplate("${ROLE_DISPLAY}");
var contactColumn=(new TableColumn()).setColumnId("CONTACT").setCustomClass("care-team-o1-contact-column").setColumnDisplay('<span class="care-team-o1-contact-spacer">&nbsp;</span>'+ctI18n.CONTACT).setPrimarySortField("CONTACT_DISPLAY").setIsSortable(true).setRenderTemplate("${CONTACT_DISPLAY}");
var phoneColumn=(new TableColumn()).setColumnId("PHONE").setCustomClass("care-team-o1-phone-column").setColumnDisplay(ctI18n.PHONE).setRenderTemplate("${PHONE_DISPLAY}");
careTeamTable.addColumn(roleColumn);
careTeamTable.addColumn(contactColumn);
careTeamTable.addColumn(phoneColumn);
if(thisVisit.length){this.processResultsForRender(thisVisit,primaryContact);
var thisVisitGroup=(new TableGroup()).bindData(thisVisit).setDisplay(ctI18n.THIS_VISIT).setGroupId("THIS_VISIT").setCanCollapse(false);
careTeamTable.addGroup(thisVisitGroup);
}if(crossVisit.length){this.processResultsForRender(crossVisit);
var crossVisitsGroup=(new TableGroup()).bindData(crossVisit).setDisplay(ctI18n.CROSS_VISITS).setGroupId("CROSS_VISITS").setCanCollapse(false);
careTeamTable.addGroup(crossVisitsGroup);
}if(nonProviders.length){this.processResultsForRender(nonProviders);
var nonProvidersGroup=(new TableGroup()).bindData(nonProviders).setDisplay(ctI18n.NON_PROVIDERS).setGroupId("NON_PROVIDERS").setCanCollapse(false);
careTeamTable.addGroup(nonProvidersGroup);
}careTeamTable.sortByColumnInDirection("ROLE",TableColumn.SORT.ASCENDING);
var hoverExtension=(new TableRowHoverExtension()).setHoverRenderer("${RESULT_DATA.PHONE_HOVER}");
careTeamTable.addExtension(hoverExtension);
this.setComponentTable(careTeamTable);
this.finalizeComponent(careTeamTable.render());
careTeamTable.toggleColumnSort=function(columnId){ComponentTable.prototype.toggleColumnSort.call(this,columnId);
self.movePrimaryToTop();
};
var node=this.getSectionContentNode();
if(this.isScrollingEnabled()&&this.getScrollNumber()){if(numberResult>this.getScrollNumber()){$("#care-team-o1"+this.getComponentId()+"tableBody").addClass("scrollable");
}MP_Util.Doc.InitScrolling(Util.Style.g("scrollable",node,"div"),this.getScrollNumber(),"1.6");
careTeamTable.refresh();
}this.movePrimaryToTop();
}catch(err){if(this.m_renderTimer){this.m_renderTimer.Abort();
this.m_renderTimer=null;
}MP_Util.LogJSError(err,self,"care-team-o1.js","renderComponent");
throw (err);
}finally{if(this.m_renderTimer){this.m_renderTimer.Stop();
}}};
CareTeamo1Component.prototype.movePrimaryToTop=function(){var component=this;
var primaryRow=document.getElementById(this.m_providerRowId);
if(primaryRow){$("#care-team-o1"+this.getComponentId()+"\\:THIS_VISIT\\:content").prepend(primaryRow);
this.fixZebraStripes();
}};
CareTeamo1Component.prototype.fixZebraStripes=function(){var tableBodyArr=$("#care-team-o1"+this.getComponentId()+"\\:THIS_VISIT\\:content").children();
for(var i=0;
i<tableBodyArr.length;
i++){tableBodyArr[i].className="result-info "+((i%2===0)?"odd":"even");
}};
CareTeamo1Component.prototype.renderNoCareTeam=function(){var compId=this.getComponentId();
try{this.finalizeComponent(['<div id="'+compId+'mainContainer">','<div id="'+compId+'tableView">','<span class="disabled">',i18n.discernabu.careteam_o1.NO_RESULTS,"</span>","</div>","</div>"].join(""));
}catch(err){MP_Util.LogJSError(err,this,"care-team-o1.js","renderNoCareTeam");
throw (err);
}};
MP_Util.setObjectDefinitionMapping("care-team-o1",CareTeamo1Component);