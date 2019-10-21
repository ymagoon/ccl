CareTeamSelector=function(){this.m_uniqueId=null;
this.m_criterion=null;
this.m_selectedCareTeamId="0";
this.m_selectedCareTeamDisplay="";
this.m_funcOnSelectorChange=null;
this.m_funcOnCareteamLoad=null;
this.m_careteamCount=0;
this.careTeamMapping={};
};
CareTeamSelector.prototype.getUniqueId=function(){return this.m_uniqueId;
};
CareTeamSelector.prototype.setUniqueId=function(uniqueId){if(!uniqueId||(typeof uniqueId!=="string"&&typeof uniqueId!=="number")){throw new Error("Error setting unique ID. Parameter Unique Id must either be a number or a string for the care team banner.");
}this.m_uniqueId=uniqueId;
return this;
};
CareTeamSelector.prototype.getCriterion=function(){return this.m_criterion;
};
CareTeamSelector.prototype.setCriterion=function(criterion){if(!criterion){throw new Error("Error setting criterion. Parameter criterion must be specified.");
}this.m_criterion=criterion;
return this;
};
CareTeamSelector.prototype.getSelectedCareTeamId=function(){return this.m_selectedCareTeamId;
};
CareTeamSelector.prototype.setSelectedCareTeamId=function(careTeamId){this.m_selectedCareTeamId=careTeamId;
};
CareTeamSelector.prototype.getSelectedCareTeamDisplay=function(){return this.m_selectedCareTeamDisplay;
};
CareTeamSelector.prototype.setSelectedCareTeamDisplay=function(careTeamDisplay){this.m_selectedCareTeamDisplay=careTeamDisplay;
};
CareTeamSelector.prototype.getOnSelectorChangeFunc=function(func){return this.m_funcOnSelectorChange;
};
CareTeamSelector.prototype.setOnSelectorChangeFunc=function(func){if(typeof func!=="function"){throw new Error("Parameter func must be of type function for the CareTeamSelector.setOnSelectorChangeFunc.");
}this.m_funcOnSelectorChange=func;
return this;
};
CareTeamSelector.prototype.getOnCareteamLoadFunc=function(){return this.m_funcOnCareteamLoad;
};
CareTeamSelector.prototype.setOnCareteamLoadFunc=function(func){if(typeof func!=="function"){throw new Error("Parameter func must be of type function for the CareTeamSelector.setOnCareteamLoadFunc.");
}this.m_funcOnCareteamLoad=func;
return this;
};
CareTeamSelector.prototype.selectCareTeamById=function(careteamId){var careteamSelector=$("#ipassCareTeamSelector"+this.getUniqueId());
var careteamDisplay="";
if(careteamId>0){if(!this.careTeamMapping[careteamId]){throw new Error("Paramater integer must corresponding to an existing careteam in dropdown.");
}careteamDisplay=this.careTeamMapping[careteamId].CARETEAM_DISPLAY||"";
}careteamSelector.val(careteamId);
this.setSelectedCareTeamId(careteamId);
this.setSelectedCareTeamDisplay(careteamDisplay);
};
CareTeamSelector.prototype.isMedicalService=function(careteamId){if(!this.careTeamMapping){return false;
}var careTeamMapping=this.careTeamMapping;
var careTeam=careTeamMapping[careteamId];
return careTeam&&careTeam.PCT_MED_SERVICE_CD&&!careTeam.PCT_TEAM_CD;
};
CareTeamSelector.prototype.getCareteamCount=function(){return this.m_careteamCount;
};
CareTeamSelector.prototype.setSelectorDisabledProperty=function(isDisabled){var ipassCareTeamSelector=$("#ipassCareTeamSelector"+this.getUniqueId());
ipassCareTeamSelector.prop("disabled",isDisabled);
};
CareTeamSelector.prototype.renderCareTeamSelector=function(careTeamSelectorTarget){var encounterId=this.m_criterion.encntr_id;
var personId=this.m_criterion.person_id;
var logicalDomainId=this.m_criterion.logical_domain_id;
var providerId=this.m_criterion.provider_id;
var responseStatus=null;
var reply=null;
var self=this;
this.ipassI18N=i18n.discernabu.ipass;
var uniqueId=this.m_uniqueId;
var careTeamAssignRequest=new MP_Core.ScriptRequest();
careTeamAssignRequest.setProgramName("mp_get_provider_teams");
careTeamAssignRequest.setParameters(["^MINE^",providerId+".0",logicalDomainId+".0"]);
careTeamAssignRequest.setAsync(true);
careTeamAssignRequest.setExecCallback(true);
var careTeamBanner=$("<div id='ipassCareTeamBanner"+uniqueId+"' class='ipass-careteam-banner attention'><span id='ipassLoadingCareTeam"+uniqueId+"' class='ipass-careteam-loading'>"+this.ipassI18N.LOADING_CARE_TEAM+"</span><div class='ipass-careteam-preloader'></div></div>");
careTeamSelectorTarget.html(careTeamBanner);
MP_Core.XMLCCLRequestCallBack(null,careTeamAssignRequest,function(careTeamsReply){try{reply=careTeamsReply.getResponse();
responseStatus=reply.STATUS_DATA.STATUS;
if(responseStatus!=="S"&&responseStatus!=="Z"){throw new Error("Script failed to load");
}var careTeamList=reply.CARE_TEAMS;
var numberOfCareTeams=careTeamList.length;
var uniqueCareTeamIDArray=[];
var careTeamOptionsHTML="";
self.m_careteamCount=0;
var careTeamMapping=self.careTeamMapping;
var careTeamDisplay="";
for(var i=0;
i<numberOfCareTeams;
i++){var careTeam=careTeamList[i];
var careTeamId=careTeam.PARENT_CARE_TEAM_ID;
careTeamMapping[careTeamId]=careTeam;
var teamName=careTeam.PCT_TEAM_CD?careTeam.PCT_TEAM_DISPLAY:"";
var medServiceName=careTeam.PCT_MED_SERVICE_DISPLAY;
if(!uniqueCareTeamIDArray[careTeamId]){uniqueCareTeamIDArray[careTeamId]=true;
self.m_careteamCount++;
careTeamDisplay=medServiceName||"";
if(teamName){careTeamDisplay+="&nbsp;&nbsp;|&nbsp;&nbsp;"+teamName;
}if(numberOfCareTeams==1){careTeamOptionsHTML+="<span>"+careTeamDisplay+"</span>";
self.setSelectedCareTeamId(careTeamId);
self.setSelectedCareTeamDisplay(careTeamDisplay);
}else{careTeamOptionsHTML+="<option value='"+careTeamId+"'>"+careTeamDisplay+"</option>";
}}careTeamMapping[careTeamId].CARETEAM_DISPLAY=careTeamDisplay.replace(/&nbsp;/g," ");
self.careTeamMapping=careTeamMapping;
}self.displayCareTeamSelector(careTeamSelectorTarget,careTeamBanner,careTeamOptionsHTML);
var ipassCareTeamSelector=$("#ipassCareTeamSelector"+uniqueId);
var careTeamMsgElement=$("#careTeamMsg"+uniqueId);
ipassCareTeamSelector.change(function(){var careTeamId=$(this).val();
var careTeamDisplay="";
if(careTeamId>0){careTeamDisplay=careTeamMapping[careTeamId].CARETEAM_DISPLAY;
}self.setSelectedCareTeamId(careTeamId);
self.setSelectedCareTeamDisplay(careTeamDisplay);
if(self.getSelectedCareTeamId()!="0"){careTeamBanner.removeClass("attention");
careTeamMsgElement.addClass("hidden");
}else{careTeamBanner.addClass("attention");
careTeamMsgElement.removeClass("hidden");
}if(self.m_funcOnSelectorChange){self.getOnSelectorChangeFunc()();
}});
var onLoadCallback=self.getOnCareteamLoadFunc();
if(onLoadCallback){onLoadCallback();
}}catch(exe){careTeamBanner.html("<span class='ipass-careteam-warning'>&nbsp;</span><span class='ipass-careteam-warning-message'>"+self.ipassI18N.CARE_TEAM_FAILED+"</span>");
}});
};
CareTeamSelector.prototype.displayCareTeamSelector=function(careTeamSelectorTarget,careTeamBanner,careTeamOptionsHTML){var selectorHtml="";
var uniqueId=this.m_uniqueId;
var careTeamText=this.ipassI18N.CARE_TEAM;
var selectCareTeamText=this.ipassI18N.SELECT_A_CARE_TEAM;
var careTeamSelectMsg=this.ipassI18N.CARE_TEAM_MESSAGE;
switch(this.m_careteamCount){case 0:this.setSelectedCareTeamId("0");
this.setSelectedCareTeamDisplay("");
careTeamSelectorTarget.remove();
break;
case 1:selectorHtml="<div class='ipass-careteam-selector'><span>"+careTeamText+": </span>"+careTeamOptionsHTML+"</div>";
careTeamBanner.removeClass("attention");
careTeamBanner.html(selectorHtml);
break;
case 2:var childLevelCareTeamCnt=0;
var childLevelCareTeamIdx=0;
for(var careTeamIdx in this.careTeamMapping){if(this.careTeamMapping[careTeamIdx].PCT_TEAM_CD){childLevelCareTeamCnt++;
childLevelCareTeamIdx=careTeamIdx;
}}if(!childLevelCareTeamCnt||childLevelCareTeamCnt==2){selectorHtml="<div id='careTeamMsg"+uniqueId+"'><span class='filter-label'>"+careTeamSelectMsg+"</span></div><div class='ipass-careteam-selector'><span>"+careTeamText+": </span><select id='ipassCareTeamSelector"+uniqueId+"'><option value='0'>"+selectCareTeamText+"</option>"+careTeamOptionsHTML+"</select></div>";
careTeamBanner.html(selectorHtml);
}else{selectorHtml="<div class='ipass-careteam-selector'><span>"+careTeamText+": </span><select id='ipassCareTeamSelector"+uniqueId+"'>"+careTeamOptionsHTML+"</select></div>";
careTeamBanner.html(selectorHtml);
careTeamBanner.removeClass("attention");
var ipassCareTeamSelector=$("#ipassCareTeamSelector"+uniqueId);
ipassCareTeamSelector.val(childLevelCareTeamIdx);
this.setSelectedCareTeamId(childLevelCareTeamIdx);
this.setSelectedCareTeamDisplay(this.careTeamMapping[childLevelCareTeamIdx].CARETEAM_DISPLAY);
}break;
default:selectorHtml="<div id='careTeamMsg"+uniqueId+"'><span class='filter-label'>"+careTeamSelectMsg+"</span></div><div class='ipass-careteam-selector'><span>"+careTeamText+": </span><select id='ipassCareTeamSelector"+uniqueId+"'><option value='0'>"+selectCareTeamText+"</option>"+careTeamOptionsHTML+"</select></div>";
careTeamBanner.html(selectorHtml);
break;
}};
