function CommunicationComponentStyle(){this.initByNamespace("communication");
}CommunicationComponentStyle.inherits(ComponentStyle);
function CommunicationComponent(criterion){this.m_acknow=0;
this.m_code=0;
this.m_comment=0;
this.m_event=[];
this.m_flag=[];
this.m_flagCnt=0;
this.m_link="";
this.m_lookback=48;
this.m_multi=0;
this.m_number=0;
this.m_read=0;
this.m_reply=null;
this.m_unreviewedCnt=0;
this.m_pageLoaded=false;
this.setCriterion(criterion);
this.setStyles(new CommunicationComponentStyle());
this.setComponentLoadTimerName("USR:MPG.COMMUNICATION.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.COMMUNICATION.O1 - render component");
}CommunicationComponent.prototype=new MPageComponent();
CommunicationComponent.prototype.constructor=MPageComponent;
CommunicationComponent.prototype.getAcknow=function(){return this.m_acknow;
};
CommunicationComponent.prototype.getCode=function(){return this.m_code;
};
CommunicationComponent.prototype.getComment=function(){return this.m_comment;
};
CommunicationComponent.prototype.getEvent=function(){return this.m_event;
};
CommunicationComponent.prototype.getFlag=function(){return this.m_flag;
};
CommunicationComponent.prototype.getFlagCnt=function(){return this.m_flagCnt;
};
CommunicationComponent.prototype.getLink=function(){return this.m_link;
};
CommunicationComponent.prototype.getLookback=function(){return this.m_lookback;
};
CommunicationComponent.prototype.getMulti=function(){return this.m_multi;
};
CommunicationComponent.prototype.getNumber=function(){return this.m_number;
};
CommunicationComponent.prototype.getRead=function(){return this.m_read;
};
CommunicationComponent.prototype.getReply=function(){return this.m_reply;
};
CommunicationComponent.prototype.getPageLoaded=function(){return this.m_pageLoaded;
};
CommunicationComponent.prototype.getUnreviewedCnt=function(){return this.m_unreviewedCnt;
};
CommunicationComponent.prototype.setAcknow=function(val){this.m_acknow=val;
};
CommunicationComponent.prototype.setCode=function(val){this.m_code=val;
};
CommunicationComponent.prototype.setComment=function(val){this.m_comment=val;
};
CommunicationComponent.prototype.setEvent=function(val){this.m_event=val;
};
CommunicationComponent.prototype.setFlag=function(val){this.m_flag=val;
};
CommunicationComponent.prototype.setFlagCnt=function(val){this.m_flagCnt=val;
};
CommunicationComponent.prototype.setLink=function(val){this.m_link=val;
};
CommunicationComponent.prototype.setLookback=function(val){this.m_lookback=val;
};
CommunicationComponent.prototype.setMulti=function(val){this.m_multi=val;
};
CommunicationComponent.prototype.setNumber=function(val){this.m_number=val;
};
CommunicationComponent.prototype.setRead=function(val){this.m_read=val;
};
CommunicationComponent.prototype.setReply=function(val){this.m_reply=val;
};
CommunicationComponent.prototype.setPageLoaded=function(val){this.m_pageLoaded=val;
};
CommunicationComponent.prototype.setUnreviewedCnt=function(val){this.m_unreviewedCnt=val;
};
CommunicationComponent.prototype.getFilterMappingsObj=function(){var componentNumber=/[0-9]+$/.exec(this.getReportMean());
var base=componentNumber+"_COMMUNE_";
this.setNumber(componentNumber);
this.addFilterMappingObject(base+"ACKNOW",{setFunction:this.setAcknow,type:"NUMBER",field:"FREETEXT_DESC"});
this.addFilterMappingObject(base+"CODE",{setFunction:this.setCode,type:"NUMBER",field:"FREETEXT_DESC"});
this.addFilterMappingObject(base+"COMMENT",{setFunction:this.setComment,type:"STRING",field:"FREETEXT_DESC"});
this.addFilterMappingObject(base+"EVENT",{setFunction:this.setEvent,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject(base+"FLAG",{setFunction:this.setFlag,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject(base+"LINK",{setFunction:this.setLink,type:"STRING",field:"FREETEXT_DESC"});
this.addFilterMappingObject(base+"LOOK_BACK",{setFunction:this.setLookback,type:"NUMBER",field:"FREETEXT_DESC"});
this.addFilterMappingObject(base+"MULTI",{setFunction:this.setMulti,type:"NUMBER",field:"FREETEXT_DESC"});
this.addFilterMappingObject(base+"READ",{setFunction:this.setRead,type:"NUMBER",field:"FREETEXT_DESC"});
return this.m_filterMappingsObj;
};
CommunicationComponent.prototype.preProcessing=function(){var preferences=this.getPreferencesObj();
var criterion=this.getCriterion();
var defaultLookBack=48;
var lookbackUnits=0;
var lookbackTypeFlag=1;
var savePreferenceInd;
if(!preferences){preferences={};
savePreferenceInd=1;
lookbackUnits=this.getLookback();
if(!lookbackUnits){lookbackUnits=defaultLookBack;
}}else{if(this.getBrLookbackUnits()>0){lookbackUnits=this.getBrLookbackUnits();
lookbackTypeFlag=this.getBrLookbackUnitTypeFlag();
}}if(!preferences.SORT_BY){preferences.SORT_BY="COMMUNICATION_DT_TM";
}if(!preferences.SORT_DIR){preferences.SORT_DIR="ASC";
}if(!preferences.SHOW_REVIEWED){preferences.SHOW_REVIEWED=0;
}if(!preferences.LOOK_BACK_UNITS){if(preferences.LOOK_BACK_UNITS!==0&&lookbackUnits!==0){preferences.LOOK_BACK_UNITS=parseInt(lookbackUnits,10);
}}if(!preferences.LOOK_BACK_UNIT_TYPE){if(preferences.LOOK_BACK_UNIT_TYPE!==0){preferences.LOOK_BACK_UNIT_TYPE=lookbackTypeFlag;
}}if(savePreferenceInd==1){this.setPreferencesObj(preferences);
this.savePreferences(this,false);
}this.setLookbackUnits(preferences.LOOK_BACK_UNITS);
this.setLookbackUnitTypeFlag(preferences.LOOK_BACK_UNIT_TYPE);
this.setGrp1Label("ACCORDION");
};
CommunicationComponent.prototype.createAccordionContent=function(){var content=[];
var preferences=this.getPreferencesObj();
content.push("<div class='commune-accordion'>","<label class='commune-reset-label' onclick='CERN_COMMUNICATION_UTIL.resetAccordion(",this.m_componentId,");'><span class='commune-highlight-text'>",i18n.communication_o1.RESET,"</span>&nbsp;<img src='",this.getCriterion().static_content,"/images/3688_16.png' /></label><br />","<span class='commune-width-fifty commune-top-align'>","<span class='commune-width-five' /><span class='commune-width-twenty-five'>",i18n.communication_o1.SORT_BY,"</span>","<label><input type='radio' class='sortByDtTm' name='sortBy",this.m_componentId,"' value='COMMUNICATION_DT_TM_DISP' ",(preferences.SORT_BY=="COMMUNICATION_DT_TM_DISP"?"checked='checked'":"")," onclick='CERN_COMMUNICATION_UTIL.refreshComponent(",this.m_componentId,");' />",i18n.communication_o1.DATE,"</label><br />","<span class='commune-width-five' /><span class='commune-width-twenty-five' /><label><input type='radio' name='sortBy",this.m_componentId,"' value='FLAG_IND' ",(preferences.SORT_BY=="FLAG_IND"?"checked='checked'":"")," onclick='CERN_COMMUNICATION_UTIL.refreshComponent(",this.m_componentId,");' />",i18n.communication_o1.FLAG,"</label><br /></span>","<span class='commune-width-fifty commune-top-align'>","<span class='commune-width-five' /><span class='commune-width-twenty-five'>",i18n.communication_o1.ORDER_BY,"</span>","<label><input type='radio' class='sortDirAsc' name='sortDir",this.m_componentId,"' value='ASC' ",(preferences.SORT_DIR=="ASC"?"checked='checked'":"")," onclick='CERN_COMMUNICATION_UTIL.refreshComponent(",this.m_componentId,");' />",i18n.communication_o1.ASCENDING,"</label><br />","<span class='commune-width-five' /><span class='commune-width-twenty-five' /><label><input type='radio' name='sortDir",this.m_componentId,"' value='DESC' ",(preferences.SORT_DIR=="DESC"?"checked='checked'":"")," onclick='CERN_COMMUNICATION_UTIL.refreshComponent(",this.m_componentId,");' />",i18n.communication_o1.DESCENDING,"</label></span>","<span style='display:inline-block; width:14.45%;' /><label><input type='radio' name='sortBy",this.m_componentId,"' value='COMMUNICATION_TEXT' ",(preferences.SORT_BY=="COMMUNICATION_TEXT"?"checked='checked'":"")," onclick='CERN_COMMUNICATION_UTIL.refreshComponent(",this.m_componentId,");' />",i18n.communication_o1.COMMUNICATION_TEXT,"</label>","<div><span style='display:inline-block; width:14.45%;' /><label><input type='radio' name='sortBy",this.m_componentId,"' value='COMMUNICATION_TYPE' ",(preferences.SORT_BY=="COMMUNICATION_TYPE"?"checked='checked'":"")," onclick='CERN_COMMUNICATION_UTIL.refreshComponent(",this.m_componentId,");' />",i18n.communication_o1.COMMUNICATION_TYPE,"</label></div>","</div>");
return content.join("");
};
CommunicationComponent.prototype.createAccordionControls=function(){return false;
};
CommunicationComponent.prototype.retrieveComponentData=function(){var self=this;
var preferences=this.getPreferencesObj();
preferences.LOOK_BACK_UNITS=this.getLookbackUnits();
preferences.LOOK_BACK_UNIT_TYPE=this.getLookbackUnitTypeFlag();
this.savePreferences(this,false);
var callBack=function(reply){self.renderComponent(reply);
};
self.requestData(callBack);
};
CommunicationComponent.prototype.requestData=function(callback){var self=this;
var criterion=this.getCriterion();
var sendAr=["^MINE^",criterion.person_id.toFixed(2),this.getScope()==2?criterion.encntr_id.toFixed(2):0,criterion.provider_id.toFixed(2),criterion.ppr_cd.toFixed(2),0,0,"^"+this.getEvent().join(",")+"^","^"+this.getFlag().join(",")+"^",this.getCode()];
var request=new MP_Core.ScriptRequest(this,this.getComponentLoadTimerName());
request.setProgramName("INN_MP_COMMUNICATION_CE:DBA");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(this,request,function(reply){self.setReply(reply);
callback(self.getReply());
});
};
CommunicationComponent.prototype.renderComponent=function(reply){try{var replyStatus=reply.getStatus();
var renderTimer=MP_Util.CreateTimer(this.getComponentRenderTimerName());
if(replyStatus=="S"){if(!this.getPageLoaded()){this.setPageLoaded(true);
}else{CERN_COMMUNICATION_UTIL.resetViewHeader(this);
}var content=[];
var subHeaderText="";
var criterion=this.getCriterion();
var preferences=this.getPreferencesObj();
var recordData=CERN_COMMUNICATION_UTIL.sortComponentData(this.m_componentId);
var curQual={};
var unreviewedRows=0;
var flagUnreviewedRows=0;
for(var i=recordData.QUAL.length;
i--;
){curQual=recordData.QUAL[i];
if(curQual.REVIEW_IND==0){unreviewedRows++;
if(curQual.FLAG_IND==1){flagUnreviewedRows++;
}}}this.setFlagCnt(flagUnreviewedRows);
this.setUnreviewedCnt(unreviewedRows);
if(recordData.CNT>0){var componentLayout=CERN_COMMUNICATION_UTIL.buildComponentLayout(recordData,this.m_componentId).replace(/{{STATIC_CONTENT}}/gm,criterion.static_content);
CERN_COMMUNICATION_UTIL.buildCommentWindow(this.m_componentId,recordData);
if(unreviewedRows>0){if(flagUnreviewedRows>0){subHeaderText="(<img src='"+criterion.static_content+"/images/4948_16.gif' />"+flagUnreviewedRows+"/"+unreviewedRows+")";
}else{subHeaderText="("+unreviewedRows+")";
}}else{subHeaderText="(0)";
}this.finalizeComponent(componentLayout,subHeaderText);
}else{this.finalizeComponent(MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace()),"(0)");
}}else{if(replyStatus=="F"){this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(),reply.getError()),"");
}else{this.finalizeComponent(MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace()),"(0)");
}}CERN_COMMUNICATION_UTIL.toggleShowAllHideAll(this.m_componentId);
CERN_COMMUNICATION_UTIL.updateViewHeader(this);
}catch(e){if(renderTimer){renderTimer.Abort();
renderTimer=null;
}MP_Util.LogJSError(this,e,"communication-o1.js","renderComponent");
throw (e);
}finally{if(renderTimer){renderTimer.Stop();
}}};
MP_Util.setObjectDefinitionMapping("1_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("2_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("3_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("4_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("5_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("6_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("7_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("8_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("9_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("10_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("11_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("12_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("13_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("14_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("15_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("16_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("17_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("18_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("19_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("20_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("21_COMMUNE",CommunicationComponent);
MP_Util.setObjectDefinitionMapping("22_COMMUNE",CommunicationComponent);
var CERN_COMMUNICATION_UTIL=function(){function buildSection(rows,sectionName,componentId){var content=[];
var component=MP_Util.GetCompObjById(componentId);
var preferences=component.getPreferencesObj();
var criterion=component.getCriterion();
var dateDisplay="";
var commDate=new Date();
var getRead=component.getRead();
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var curRow;
var curReview;
var reviewLength;
var flagImg;
content.push("<div class='",sectionName," ",sectionName=="reviewed"?(preferences.SHOW_REVIEWED==1?"":"hidden"):"","'>");
for(var x=0,xl=rows.length;
x<xl;
x++){curRow=rows[x];
commDate.setISO8601(curRow.COMMUNICATION_DT_TM_DISP);
dateDisplay=df.format(commDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
flagImg=(curRow.FLAG_IND==1?"<img src='{{STATIC_CONTENT}}/images/4948_16.gif' />":"");
if(sectionName=="reviewed"&&x==0){content.push("<hr />");
}content.push("<span class='commune-width-eight'></span><span class='commune-width-ninety-two commune-ellipsis'><span class='commune-label-text'>"+curRow.COMMUNICATION_TYPE+"</span></span><div>");
content.push("<div id='",curRow.EVENT_ID,"' class='event-row'><div>","<span class='commune-width-ten'>");
if(sectionName=="unreviewed"){if(getRead==0){content.push("<input type='checkbox' class='chk-review' onclick='CERN_COMMUNICATION_UTIL.toggleReviewButton(",componentId,");' />");
}content.push("<input type='hidden' class='hid-comments' value=''/>");
}else{content.push(flagImg);
}content.push("</span><span class='commune-width-ninety commune-ellipsis'><span class='commune-highlight-text commune-hyperlink' onclick='CERN_COMMUNICATION_UTIL.openForm(",criterion.person_id,",",criterion.encntr_id,',"',curRow.ENTRY_MODE,'",',curRow.ACTIVITY_ID,', "',component.getLink(),"\");' title='",(curRow.EFFECTIVE_DT_TM!=curRow.COMMUNICATION_DT_TM_DISP?"("+i18n.communication_o1.MODIFIED+") ":""),curRow.COMMUNICATION_TEXT.replace("'","&#39;"),"'>",(curRow.EFFECTIVE_DT_TM!=curRow.COMMUNICATION_DT_TM_DISP?"* ":""),curRow.COMMUNICATION_TEXT.replace("'","&#39;"),"</span></span></div>","<div><span class='commune-width-ten'>");
if(sectionName=="unreviewed"){content.push(flagImg);
}content.push("</span><span class='commune-width-ninety'>","<span class='commune-width-fifty commune-left-align commune-gray-text'>",dateDisplay,"</span>","<span class='commune-width-fifty commune-right-align'>","<span class='commune-width-fifty commune-left-align'>");
if(sectionName=="unreviewed"&&getRead==0){content.push("<span class='commune-highlight-text commune-add-comment' onclick='CERN_COMMUNICATION_UTIL.showCommentWindow($(this),",componentId,")'>",i18n.communication_o1.ADD_COMMENT,"</span>");
}content.push("</span><span class='commune-width-fifty commune-right-align'><span class='toggle-reviews'>");
reviewLength=curRow.REVIEW_INFO.length;
if(reviewLength>0){content.push("<span class='commune-highlight-text' onclick='CERN_COMMUNICATION_UTIL.toggleReviews($(this));'><span class='reviews-label'>",i18n.communication_o1.SHOW,"</span> ",i18n.communication_o1.REVIEWS," ("+reviewLength+")</span>");
}else{content.push("<span class='commune-gray-text'>",i18n.communication_o1.NO_REVIEWS,"</span>");
}content.push("</span></span></span></span><div class='reviews hidden'>");
for(y=0,yl=reviewLength;
y<yl;
y++){curReview=curRow.REVIEW_INFO[y];
commDate.setISO8601(curReview.ACTION_DT_TM_DISP);
dateDisplay=df.format(commDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
content.push("<div class='review-row'>","<span class='commune-width-ten'></span>","<span class='commune-width-ninety'><hr /><div>","<span class='commune-width-fifty commune-left-align commune-gray-text'>",curReview.NAME_FULL_FORMATTED,curReview.ACTION_DT_TM_DISP>""?"&nbsp;("+dateDisplay+")":"","</span>","<span class='commune-width-fifty commune-right-align commune-gray-text commune-ellipsis' title='",curReview.ACTION_COMMENT.replace("'","&#39;"),"'>",curReview.ACTION_COMMENT.replace("'","&#39;"),"</span>","</div></span></div>");
}content.push("</div></div></div></div>");
if(x<xl-1){content.push("<hr />");
}}content.push("</div>");
return content.join("");
}function undoComments(componentId){var temp,tempComment,addComment,reviews,reviewsCnt,reviewsLabel,toggleReviews;
var component=MP_Util.GetCompObjById(componentId);
var componentContainer=$(component.getRootComponentNode());
var eventRows=componentContainer.find(".event-row");
var newHtml="";
for(var x=0,xl=eventRows.length;
x<xl;
x++){temp=$(eventRows[x]);
if(temp.find(".chk-review").prop("checked")==false){tempComment=temp.find(".temp-comment");
temp.find(".hid-comments").val("");
addComment=temp.find(".commune-add-comment");
reviews=temp.find(".reviews");
reviewCnt=reviews.find(".review-row").length;
reviewsLabel=temp.find(".reviews-label");
toggleReviews=temp.find(".toggle-reviews");
tempComment.hide().remove();
addComment.show();
if(reviewCnt>0){newHtml="<span class='commune-highlight-text' onclick='CERN_COMMUNICATION_UTIL.toggleReviews($(this));'><span class='reviews-label'>"+reviewsLabel.html()+"</span> "+i18n.communication_o1.REVIEWS+" ("+reviewCnt+")</span>";
}else{newHtml="<span class='commune-gray-text'>"+i18n.communication_o1.NO_REVIEWS+"</span>";
reviews.addClass("hidden");
}toggleReviews.empty().html(newHtml);
}}}return{buildCommentWindow:function(componentId,recordData){var component=MP_Util.GetCompObjById(componentId);
var content=[];
var commentGroup,freetextComment,commentList;
var popupWindow=$("<div id='comment-window"+componentId+"' class='commune-popup-window' style='display:none' onmouseleave='$(this).hide();'></div>");
var windowHead=$("<div class='commune-window-head'></div>");
var windowBody=$("<div class='commune-window-body'></div>");
var commentMode=component.getAcknow();
if(commentMode<1||commentMode>3){commentMode=3;
}if(commentMode==1){freetextComment=$("<input type='text' class='commune-freetext-comment' onfocus='$(this).val(\"\");' value='"+i18n.communication_o1.ADD_FREETEXT_COMMENT+"' maxlength='200'/>");
}else{if(commentMode>=2){commentGroup=$("<div></div>");
for(var x=0;
x<recordData.COMMENT_CNT;
x++){content.push("<div class='commune-comment-item' onclick='CERN_COMMUNICATION_UTIL.selectComment($(this));' value='",recordData.COMMENTS[x].DISPLAY,"'>",recordData.COMMENTS[x].DISPLAY,"</div>");
}if(content.length>0){commentGroup.html(content.join(""));
}else{commentGroup.html(i18n.communication_o1.NO_COMMENTS);
}windowBody.append(commentGroup);
if(commentMode>2){windowBody.append("<div class='commune-comment-group' />");
freetextComment=$("<input type='text' class='commune-freetext-comment' onfocus='$(this).val(\"\");' maxlength='200' value='"+i18n.communication_o1.ADD_FREETEXT_COMMENT+"'/>");
}}}if(freetextComment){freetextComment.bind("keypress",function(e){var code=(e.keyCode?e.keyCode:e.which);
if(code==13){var element=$(this);
if(element.val()!=""){CERN_COMMUNICATION_UTIL.selectComment(element);
}}}).blur(function(){$(this).val(i18n.communication_o1.ADD_FREETEXT_COMMENT);
});
windowBody.append(freetextComment);
}$("body").append(popupWindow.append(windowHead).append("<br />").append(windowBody));
},buildComponentLayout:function(recordData,componentId){try{var component=MP_Util.GetCompObjById(componentId);
var preferences=component.getPreferencesObj();
var multiInd=component.getMulti();
var readInd=component.getRead();
var commentInd=component.getComment();
var content=[];
var unreviewedRowsBool=false;
var unreviewedRows=[];
var reviewedRows=[];
var numReviewedRows=0;
var unreviewedReadInd=false;
var curQual=recordData.QUAL;
for(var i=0,il=curQual.length;
i<il;
i++){if(curQual[i].REVIEW_IND==1){numReviewedRows++;
reviewedRows.push(curQual[i]);
}else{unreviewedRows.push(curQual[i]);
}}if(unreviewedRows.length>0){unreviewedRowsBool=true;
if(readInd==0){unreviewedReadInd=true;
}}content.push("<div class='commune-content-body'>");
if(curQual.length>199){content.push("<div>",i18n.communication_o1.MAX_RECORDS,"</div>");
}if(unreviewedRowsBool===true||numReviewedRows>0){content.push("<div class='commune-mass-commands'>");
content.push("<span class='commune-width-ten'>");
if(multiInd==1&&unreviewedReadInd===true){content.push("<input type='checkbox' id='chkAll' onclick='CERN_COMMUNICATION_UTIL.selectAllRows(",componentId,");' />");
}content.push("</span>");
content.push("<span class='commune-width-ninety'>");
content.push("<span class='commune-width-ten'>");
if(multiInd==1&&unreviewedReadInd===true){content.push("<label for='chkAll'>",i18n.communication_o1.MARK_ALL,"</label>");
}content.push("</span>");
content.push("<span class='commune-width-ninety'>");
content.push("<span class='commune-width-fifty commune-right-align'>");
if(commentInd==1&&unreviewedReadInd===true){content.push("<span class='commune-highlight-text commune-add-comment' onclick='CERN_COMMUNICATION_UTIL.showCommentWindow($(this),",componentId,")'>",i18n.communication_o1.ADD_COMMENT_ALL,"</span>");
}content.push("</span>");
content.push("<span class='commune-width-fifty commune-right-align'><span class='commune-highlight-text' onclick='CERN_COMMUNICATION_UTIL.toggleAllReviews(",componentId,");'><span class='reviews-label'>",i18n.communication_o1.SHOW,"</span> ",i18n.communication_o1.ALL,"</span></span>");
content.push("</span>");
content.push("</span>");
content.push("</div>");
}if(unreviewedRowsBool===true){content.push(buildSection(unreviewedRows,"unreviewed",componentId));
}else{content.push("<div class='unreviewed'><span class='commune-width-ten'></span><span class='commune-width-ninety'>",i18n.communication_o1.NO_NEW_COMMUNICATION,"</span></div>");
}content.push(buildSection(reviewedRows,"reviewed",componentId));
content.push("<div class='commune-footer'>");
content.push("<div class='commune-legend commune-gray-text'>");
content.push("(",i18n.communication_o1.LEGEND,")");
content.push("</div>");
content.push("<span class='commune-width-fifty'>");
if(reviewedRows.length>0){content.push("<span class='commune-highlight-text' onclick='CERN_COMMUNICATION_UTIL.toggleReviewed(",componentId,");'><span class='reviewed-label'>",preferences.SHOW_REVIEWED==0?i18n.communication_o1.DISPLAY:i18n.communication_o1.HIDE,"</span> ",i18n.communication_o1.REVIEWED," (",numReviewedRows,")</span>");
}content.push("</span>");
if(unreviewedReadInd===true){content.push("<span class='commune-width-fifty commune-right-align'><input type='button' class='commune-btn-review' value='",i18n.communication_o1.MARK_AS_REVIEWED,"' disabled='true' onclick='CERN_COMMUNICATION_UTIL.markAsReviewed(",componentId,");'/></span>");
}content.push("<input type='hidden' class='your-name' value='",recordData.YOUR_NAME_FULL_FORMATTED,"' />");
content.push("</div>");
content.push("</div>");
return content.join("");
}catch(err){MP_Util.LogJSError(err,component,"communication-o1.js","buildComponentLayout");
}},convertToHours:function(lookbackUnits,lookbackUnitTypeFlag){var tempLookbackUnits=0;
switch(lookbackUnitTypeFlag){case 1:case"HOURS":tempLookbackUnits=lookbackUnits*1;
break;
case 2:case"DAYS":tempLookbackUnits=lookbackUnits*1*24;
break;
case 3:case"WEEKS":tempLookbackUnits=lookbackUnits*1*24*7;
break;
case 4:case"MONTHS":tempLookbackUnits=lookbackUnits*1*24*30;
break;
case 5:case"YEARS":tempLookbackUnits=lookbackUnits*1*24*365;
break;
}return tempLookbackUnits;
},filterByDate:function(componentId){var component=MP_Util.GetCompObjById(componentId);
var preferences=component.getPreferencesObj();
var recordData=$.extend(true,{},component.getReply().getResponse());
var tempLookbackUnits=CERN_COMMUNICATION_UTIL.convertToHours(preferences.LOOK_BACK_UNITS,preferences.LOOK_BACK_UNIT_TYPE);
if(tempLookbackUnits>0){var d1=new Date();
var d2=new Date();
var d3=new Date();
d2.setHours(d1.getHours()-tempLookbackUnits);
var temp=$.grep(recordData.QUAL,function(obj,cnt){d3=new Date();
d3.setISO8601(obj.COMMUNICATION_DT_TM_DISP);
return d2<=d3;
});
recordData.QUAL=temp;
recordData.CNT=recordData.QUAL.length;
}return recordData;
},insertPageLinks:function(criterion){var meanTypes=["ORD","DOC","RES"];
var mpages=m_bedrockMpage.MPAGE;
var catMean=criterion.category_mean;
var curParams={};
var curValues={};
var tempEl={};
var curFiltersSetMean="";
var curMeanType="";
var curNameMean="";
var curTabMean="";
var link="";
var tab="";
var tempStr="";
var html=[];
var valuesArr=[];
var i=0;
var j=0;
var x=0;
var xl=0;
for(i=mpages.length;
i--;
){if(mpages[i].CATEGORY_MEAN==catMean){for(x=0,xl=meanTypes.length;
x<xl;
x++){curFiltersSetMean="COMMUNE_"+meanTypes[x];
curNameMean=curFiltersSetMean+"_NAME";
curTabMean=curFiltersSetMean+"_TAB";
link="";
tab="";
tempEl=mpages[i];
curParams=tempEl.PARAMS;
for(j=curParams.length;
j--;
){switch(curParams[j].FILTER_MEAN){case curFiltersSetMean:curValues=curParams[j].VALUES;
if(curValues.length>0){if(parseInt(curValues[0].FREETEXT_DESC)==1){curFiltersSet=true;
}}break;
case curNameMean:curValues=curParams[j].VALUES;
if(curValues.length>0){link=curValues[0].FREETEXT_DESC;
}break;
case curTabMean:curValues=curParams[j].VALUES;
if(curValues.length>0){tab=curValues[0].FREETEXT_DESC;
}break;
}}if(curFiltersSet===false){link="";
tab="";
}else{if(link!=""&&tab!=""){html.push("<span class='commune-highlight-text' onclick='APPLINK(0, \"powerchart.exe\", \"/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB=^"+tab+"^\");'>"+link+"</span>","&nbsp;<span class='commune-gray-text'>|</span>&nbsp;");
}}}if(html.length>0){html.pop();
tempStr=html.join("");
}else{tempStr="";
}$("#banner"+criterion.category_mean).html("<div class='commune-center'>"+tempStr+"</div>");
break;
}}},markAsReviewed:function(componentId){var temp;
var component=MP_Util.GetCompObjById(componentId);
var componentContainer=$(component.getRootComponentNode());
var params={ensure_request_info:{cnt:0,qual:[]}};
var checked=componentContainer.find("input[type=checkbox]:checked");
for(var x=0,xl=checked.length;
x<xl;
x++){temp=$(checked[x]);
params.ensure_request_info.cnt++;
params.ensure_request_info.qual.push({event_id:parseInt(temp.parents(".event-row").attr("id")).toFixed(2),action_comment:temp.siblings(".hid-comments").val()});
}var sendAr=["^MINE^","^"+JSON.stringify(params)+"^"];
var request=new MP_Core.ScriptRequest(component,component.getComponentLoadTimerName());
request.setProgramName("INN_MP_COMMUNICATION_CE_REVIEW:DBA");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(component,request,function(reply){component.setReply(null);
component.retrieveComponentData();
});
},openForm:function(personId,encntrId,entryMode,activityId,tabName){if(entryMode=="WORKING_VIEW"){var taskObject=window.external.DiscernObjectFactory("TASKDOC");
taskObject.LaunchIView("","","",personId,encntrId);
}else{if(activityId==0&&tabName!=""){APPLINK(0,"powerchart.exe","/PERSONID="+personId+" /ENCNTRID="+encntrId+"/FIRSTTAB=^"+tabName+"^");
}else{var params=personId+"|"+encntrId+"|0|"+activityId+"|1";
MPAGES_EVENT("POWERFORM",params);
}}},refreshComponent:function(componentId){var component=MP_Util.GetCompObjById(componentId);
var componentContainer=$(component.getRootComponentNode());
var reply=component.getReply();
var preferences=component.getPreferencesObj();
preferences.SORT_BY=componentContainer.find("input:radio[name^=sortBy]:checked").val();
preferences.SORT_DIR=componentContainer.find("input:radio[name^=sortDir]:checked").val();
component.savePreferences(component,false);
component.renderComponent(reply);
},resetAccordion:function(componentId){var component=MP_Util.GetCompObjById(componentId);
var componentContainer=$(component.getRootComponentNode());
componentContainer.find(".sortByDtTm").prop("checked",true);
componentContainer.find(".sortDirAsc").prop("checked",true);
CERN_COMMUNICATION_UTIL.refreshComponent(componentId);
},selectAllRows:function(componentId){var temp;
var component=MP_Util.GetCompObjById(componentId);
var componentContainer=$(component.getRootComponentNode());
var chkAll=componentContainer.find("#chkAll");
var checkboxes=componentContainer.find(".unreviewed input[type=checkbox]");
for(var x=0,xl=checkboxes.length;
x<xl;
x++){temp=$(checkboxes[x]);
temp.prop("checked",chkAll.prop("checked"));
}CERN_COMMUNICATION_UTIL.toggleReviewButton(componentId);
undoComments(componentId);
},selectComment:function(element){var eventRows,temp,content,reviews,toggleReviews;
var parent=element.parents(".commune-popup-window");
var elementValue=element.attr("value");
elementValue=elementValue.replace(/\'/g,"&#39;").replace(/\"/g,"&#34;").replace(/\^/g,"&#94;").replace(/\@/g,"&#64;");
var componentId=parseInt(parent.attr("id").replace("comment-window",""));
var component=MP_Util.GetCompObjById(componentId);
var criterion=component.getCriterion();
var secContentNode=$(component.getSectionContentNode());
if(parent.val()!=""){eventRows=secContentNode.find(".unreviewed #"+parent.val());
}else{eventRows=secContentNode.find(".unreviewed .event-row");
}for(var x=0;
x<eventRows.length;
x++){temp=$(eventRows[x]);
content=[];
temp.find(".commune-add-comment").hide();
reviews=temp.find(".reviews");
toggleReviews=temp.find(".toggle-reviews");
toggleReviews.empty().html("<span class='commune-highlight-text' onclick='CERN_COMMUNICATION_UTIL.toggleReviews($(this));'><span class='reviews-label'>"+i18n.communication_o1.HIDE+"</span> "+i18n.communication_o1.REVIEWS+" ("+(reviews.children(".review-row").length+1)+")</span>");
temp.find(".temp-comment").remove();
temp.find(".hid-comments").val(elementValue);
content.push("<div class='temp-comment'>","<span class='commune-width-ten'></span>","<span class='commune-width-ninety'><hr /><div>","<span class='commune-width-fifty commune-left-align commune-gray-text'>",secContentNode.find(".your-name").val()," (",i18n.communication_o1.NOW,")</span>","<span class='commune-width-fifty commune-right-align commune-gray-text commune-ellipsis' title='",temp.find(".hid-comments").val().replace(/\'/g,"&#39;"),"'>",temp.find(".hid-comments").val().replace(/\'/g,"&#39;"),"</span>","</div></span></div>");
if(reviews.children().length>0){$(content.join("")).insertBefore(reviews.children(":first"));
}else{reviews.append(content.join(""));
}if(!temp.find(".chk-review").is(":checked")){temp.find(".chk-review").click();
}parent.hide();
reviews.removeClass("hidden");
}},showCommentWindow:function(element,componentId){var rowId=element.parents(".event-row").attr("id");
var commentWindow=$("#comment-window"+componentId);
var commentBody=commentWindow.find(".commune-window-body:first");
var commentHead=commentWindow.find(".commune-window-head:first");
commentHead.html(element.html()).height(element.height());
commentWindow.css({top:element.offset().top,left:element.offset().left});
commentBody.css("top",commentWindow.find(".commune-window-head").height());
commentWindow.show().val(rowId);
var commentBodyJS=commentBody.get(0);
commentHead.width(commentBodyJS.clientWidth-commentBodyJS.paddingLeftWidth-commentBodyJS.paddingRightWidth);
},sortComponentData:function(componentId){var component=MP_Util.GetCompObjById(componentId);
var preferences=component.getPreferencesObj();
var sortBy=preferences.SORT_BY;
var sortDir=preferences.SORT_DIR;
var recordData=CERN_COMMUNICATION_UTIL.filterByDate(componentId);
var curQual={};
try{if(sortBy=="FLAG_IND"){if(sortDir!="DESC"){recordData.QUAL.sort(function(a,b){return a[sortBy]-b[sortBy];
});
}else{recordData.QUAL.sort(function(a,b){return b[sortBy]-a[sortBy];
});
}}else{if(sortDir!="DESC"){recordData.QUAL.sort(function(a,b){var valA=a[sortBy].toUpperCase();
var valB=b[sortBy].toUpperCase();
return valA==valB?0:valA>valB?1:-1;
});
}else{recordData.QUAL.sort(function(a,b){var valA=a[sortBy].toUpperCase();
var valB=b[sortBy].toUpperCase();
return valB==valA?0:valB>valA?1:-1;
});
}}for(var x=0,xl=recordData.CNT;
x<xl;
x++){curQual=recordData.QUAL[x];
if(curQual.REVIEW_CNT>1&&sortBy!="FLAG_IND"){if(sortBy=="COMMUNICATION_TEXT"){sortBy="ACTION_COMMENT";
}else{if(sortBy=="COMMUNICATION_DT_TM_DISP"){sortBy="ACTION_DT_TM_DISP";
}}if(sortDir!="DESC"){recordData.QUAL[x].REVIEW_INFO.sort(function(a,b){var valA=a[sortBy].toUpperCase();
var valB=b[sortBy].toUpperCase();
return valA==valB?0:valA>valB?1:-1;
});
}else{recordData.QUAL[x].REVIEW_INFO.sort(function(a,b){var valA=a[sortBy].toUpperCase();
var valB=b[sortBy].toUpperCase();
return valB==valA?0:valB>valA?1:-1;
});
}}}}catch(err){MP_Util.LogJSError(err,component,"sortComponentData","sortComponentData");
}return recordData;
},toggleAllReviews:function(componentId){var temp,reviews;
var component=MP_Util.GetCompObjById(componentId);
var componentContainer=$(component.getRootComponentNode());
var label=componentContainer.find(".reviews-label");
var eventRows=componentContainer.find(".event-row");
var showReviews=(label.html()==i18n.communication_o1.SHOW)?true:false;
for(var x=0;
x<eventRows.length;
x++){temp=$(eventRows[x]);
reviews=temp.find(".reviews");
if(showReviews===true){reviews.removeClass("hidden");
temp.find(".reviews-label").html(i18n.communication_o1.HIDE);
}else{reviews.addClass("hidden");
temp.find(".reviews-label").html(i18n.communication_o1.SHOW);
}}if(showReviews===true){label.html(i18n.communication_o1.HIDE);
componentContainer.find(".reviewed").removeClass("hidden");
componentContainer.find(".reviewed-label").html(i18n.communication_o1.HIDE);
}else{label.html(i18n.communication_o1.SHOW);
componentContainer.find(".reviewed").addClass("hidden");
componentContainer.find(".reviewed-label").html(i18n.communication_o1.DISPLAY);
}},toggleReviewButton:function(componentId){window.setTimeout(function(){var component=MP_Util.GetCompObjById(componentId);
var componentContainer=$(component.getRootComponentNode());
var count=componentContainer.find(".unreviewed input[type=checkbox]:checked").length;
var button=componentContainer.find(".commune-btn-review");
if(count>0){button.prop("disabled",false);
}else{button.prop("disabled",true);
componentContainer.find("#chkAll").prop("checked",false);
}undoComments(componentId);
},1);
},toggleReviewed:function(componentId){var component=MP_Util.GetCompObjById(componentId);
var componentContainer=$(component.getRootComponentNode());
var reviewedSection=componentContainer.find(".reviewed");
var preferences=component.getPreferencesObj();
reviewedSection.toggleClass("hidden");
if(reviewedSection.hasClass("hidden")){preferences.SHOW_REVIEWED=0;
componentContainer.find(".reviewed-label").html(i18n.communication_o1.DISPLAY);
}else{preferences.SHOW_REVIEWED=1;
componentContainer.find(".reviewed-label").html(i18n.communication_o1.HIDE);
}component.savePreferences(component,false);
CERN_COMMUNICATION_UTIL.toggleShowAllHideAll(componentId);
},toggleReviews:function(element){var parent=element.parents(".event-row");
var target=parent.find(".reviews");
target.toggleClass("hidden");
if(target.hasClass("hidden")){parent.find(".reviews-label").html(i18n.communication_o1.SHOW);
}else{parent.find(".reviews-label").html(i18n.communication_o1.HIDE);
}var componentId=/[0-9]+$/.exec(parent.parents(".sec-content").attr("id"));
if(componentId.length>0){CERN_COMMUNICATION_UTIL.toggleShowAllHideAll(parseInt(componentId));
}},toggleShowAllHideAll:function(componentId){var component=MP_Util.GetCompObjById(componentId);
var componentContainer=$(component.getRootComponentNode());
var label=componentContainer.find(".commune-mass-commands .reviews-label");
var cnt=componentContainer.find(".review-row:visible").length+componentContainer.find(".reviewed:visible").length;
if(cnt>0){label.html(i18n.communication_o1.HIDE);
}else{label.html(i18n.communication_o1.SHOW);
}},updateViewHeader:function(component){try{var tabLabel=$("#"+component.getCriterion().category_mean+"tab");
if(tabLabel.length>0){var unreviewedCnt=0;
var flagCnt=0;
var criterion=component.getCriterion();
var html=[];
var communicationsTotalCommentCnt=$("#communicationsTotalCommentCnt");
var communicationsUnreviewedCnt=$("#communicationsUnreviewedCnt");
var communicationsTotalFlagCnt=$("#communicationsTotalFlagCnt");
var communicationsTotalFlagSection=$("#communicationsTotalFlagSection");
if(communicationsUnreviewedCnt.length){unreviewedCnt=parseInt(communicationsUnreviewedCnt.text(),10);
}if(communicationsTotalFlagCnt.length){flagCnt=parseInt(communicationsTotalFlagCnt.text(),10);
}unreviewedCnt+=component.getUnreviewedCnt();
flagCnt+=component.getFlagCnt();
if(communicationsTotalCommentCnt.length==0){html.push("<span class='commune-width-fifty commune-ellipsis' />","<span id='communicationsTotalCommentCnt' class='commune-tab-count");
if(unreviewedCnt==0){html.push(" hidden");
}html.push("'>&nbsp;(<span id='communicationsTotalFlagSection'");
if(flagCnt==0){html.push(" class='hidden'");
}html.push("><span class='commune-flag-class' /><span id='communicationsTotalFlagCnt'>",flagCnt,"</span>/","</span><span id='communicationsUnreviewedCnt'>"+unreviewedCnt+"</span>)</span></span>");
tabLabel.html(html.join(""));
}else{if(unreviewedCnt>0){communicationsTotalCommentCnt.removeClass("hidden");
communicationsUnreviewedCnt.html(unreviewedCnt);
}if(flagCnt>0){communicationsTotalFlagSection.removeClass("hidden");
communicationsTotalFlagCnt.html(flagCnt);
}}tabLabel.find(".commune-ellipsis").html(i18n.communication_o1.COMMUNICATIONS);
}}catch(err){MP_Util.LogJSError(err,component,"updateViewHeader","updateViewHeader");
}},resetViewHeader:function(component){var communicationsTotalCommentCnt=$("#communicationsTotalCommentCnt");
if(communicationsTotalCommentCnt.length>0){var communicationsUnreviewedCnt=$("#communicationsUnreviewedCnt");
var communicationsTotalFlagCnt=$("#communicationsTotalFlagCnt");
var communicationsTotalFlagSection=$("#communicationsTotalFlagSection");
if(communicationsUnreviewedCnt.length>0&&communicationsTotalFlagCnt.length>0&&communicationsTotalFlagSection.length>0){var unreviewedCnt=parseInt(communicationsUnreviewedCnt.text(),10);
var flagCnt=parseInt(communicationsTotalFlagCnt.text(),10);
unreviewedCnt-=component.getUnreviewedCnt();
flagCnt-=component.getFlagCnt();
if(unreviewedCnt==0){communicationsTotalCommentCnt.addClass("hidden");
}if(flagCnt==0){communicationsTotalFlagSection.addClass("hidden");
}communicationsUnreviewedCnt.text(unreviewedCnt);
communicationsTotalFlagCnt.text(flagCnt);
}}}};
}();