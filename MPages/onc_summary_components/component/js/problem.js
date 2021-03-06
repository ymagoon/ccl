function ProblemsComponentStyle(){this.initByNamespace("pl");
}ProblemsComponentStyle.inherits(ComponentStyle);
function ProblemsComponent(criterion){this.m_searchTypeFlag=null;
this.m_suggestionLimit=null;
this.m_problemVocab=null;
this.m_problemAddTypeCd=null;
this.m_problemClass=null;
this.m_problemVocabInd=0;
this.curSearchCounter=0;
this.nextSearchCounter=0;
this.replySearchCounter=0;
this.setCriterion(criterion);
this.setStyles(new ProblemsComponentStyle());
this.setComponentLoadTimerName("USR:MPG.PROBLEMS.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.PROBLEMS.O1 - render component");
this.setIncludeLineNumber(true);
this.setScope(1);
ProblemsComponent.method("InsertData",function(){this.setEditMode(true);
CERN_PROBLEMS_O1.GetProblemsTable(this);
});
ProblemsComponent.method("HandleSuccess",function(recordData){CERN_PROBLEMS_O1.RenderComponent(this,recordData);
});
ProblemsComponent.method("getSearchTypeFlag",function(){return this.m_searchTypeFlag;
});
ProblemsComponent.method("setSearchTypeFlag",function(value){this.m_searchTypeFlag=value;
});
ProblemsComponent.method("getSuggestionLimit",function(){return this.m_suggestionLimit;
});
ProblemsComponent.method("setSuggestionLimit",function(value){this.m_suggestionLimit=value;
});
ProblemsComponent.method("getCurSearchCounter",function(){return this.curSearchCounter;
});
ProblemsComponent.method("setCurSearchCounter",function(value){this.curSearchCounter=value;
});
ProblemsComponent.method("incCurSearchCounter",function(){this.curSearchCounter++;
});
ProblemsComponent.method("getNextSearchCounter",function(){return this.nextSearchCounter;
});
ProblemsComponent.method("setNextSearchCounter",function(value){this.nextSearchCounter=value;
});
ProblemsComponent.method("incNextSearchCounter",function(){this.nextSearchCounter++;
});
ProblemsComponent.method("getReplySearchCounter",function(){return this.replySearchCounter;
});
ProblemsComponent.method("setReplySearchCounter",function(value){this.replySearchCounter=value;
});
ProblemsComponent.method("incReplySearchCounter",function(){this.replySearchCounter++;
});
ProblemsComponent.method("setProblemsVocab",function(value){this.m_problemVocab=value;
});
ProblemsComponent.method("getProblemsVocab",function(){return this.m_problemVocab;
});
ProblemsComponent.method("setProblemsAddTypeCd",function(value){this.m_problemAddTypeCd=value;
});
ProblemsComponent.method("getProblemsAddTypeCd",function(){return this.m_problemAddTypeCd;
});
ProblemsComponent.method("setProblemsClassification",function(value){this.m_problemClass=value;
});
ProblemsComponent.method("getProblemsClassification",function(){return this.m_problemClass;
});
ProblemsComponent.method("setProblemsVocabInd",function(value){this.m_problemVocabInd=value;
});
ProblemsComponent.method("getProblemsVocabInd",function(){return this.m_problemVocabInd;
});
}ProblemsComponent.inherits(MPageComponent);
var CERN_PROBLEMS_O1=function(){return{GetProblemsTable:function(component){var sendAr=[];
var criterion=component.getCriterion();
sendAr.push("^MINE^",criterion.person_id+".0","0",criterion.provider_id+".0",criterion.ppr_cd+".0",criterion.position_cd+".0","1",component.getProblemsVocab()+".0",component.getProblemsVocabInd());
var request=new MP_Core.ScriptRequest(component,component.getComponentLoadTimerName());
request.setProgramName("MP_GET_PROBLEMS");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(component,request,CERN_PROBLEMS_O1.RenderComponent);
},RenderComponent:function(reply){var countText="";
var component=reply.getComponent();
try{var recordData=reply.getResponse();
var jsPlHTML=[];
var plHTML="";
if(reply.getStatus()!=="F"){if(recordData.PL_CAN_ADD===1){jsPlHTML.push(MP_Util.CreateAutoSuggestBoxHtml(component));
component.setAutoSuggestAddScript("mp_add_problem");
component.setAutoSuggestAddTimerName("USR:MPG.PROBLEMS.01 - add problem from auto suggest");
component.setSuggestionLimit(10);
}if(reply.getStatus()==="S"){var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
var probLen=(recordData.PROBLEM&&recordData.PROBLEM!==null)?recordData.PROBLEM.length:0;
jsPlHTML.push("<div class='",MP_Util.GetContentClass(component,probLen),"'>");
var problemArray=recordData.PROBLEM;
var codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
for(var i=0,l=problemArray.length;
i<l;
i++){var responsibleProvider="";
var type="";
var onsetDate="";
var onsetCd="";
var onsetDateFormatted=[];
if(problemArray[i].ONSET_DT_TM&&problemArray[i].ONSET_DT_TM!==""){var onsetFlag=problemArray[i].ONSET_DT_FLAG;
onsetDate=problemArray[i].ONSET_DT_TM;
if(problemArray[i].ONSET_DT_CD>0){onsetCd=MP_Util.GetValueFromArray(problemArray[i].ONSET_DT_CD,codeArray);
onsetDateFormatted=onsetCd.display+" ";
}if(onsetFlag==2){onsetDateFormatted+=df.formatISO8601(onsetDate,mp_formatter.DateTimeFormatter.FULL_4YEAR);
}else{if(onsetFlag==1){onsetDateFormatted+=df.formatISO8601(onsetDate,mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE);
}else{onsetDateFormatted+=df.formatISO8601(onsetDate,mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
}}}else{onsetCd="";
if(problemArray[i].ONSET_DT_CD>0){onsetCd=MP_Util.GetValueFromArray(problemArray[i].ONSET_DT_CD,codeArray);
onsetDateFormatted=onsetCd.display;
}}if(problemArray[i].PROVIDER_ID&&problemArray[i].PROVIDER_ID!==0){var provCodeObj=MP_Util.GetValueFromArray(problemArray[i].PROVIDER_ID,personnelArray);
responsibleProvider=provCodeObj.fullName;
}var plCode="";
var plName=problemArray[i].NAME;
var plAnnot=(problemArray[i].DISPLAY_AS&&problemArray[i].DISPLAY_AS!==null)?problemArray[i].DISPLAY_AS:null;
var plFaceUp=plAnnot;
if(plAnnot===null||plAnnot===""){plAnnot="&nbsp;";
plFaceUp=plName;
}if(problemArray[i].CODE&&problemArray[i].CODE!==""){plCode="("+problemArray[i].CODE+")";
}if(problemArray[i].PARENT_PROBLEM_ID===0){type="pl-name";
}else{type="pl-assoc-name";
}jsPlHTML.push("<h3 class='info-hd'><span>",plName,"</span></h3><dl class='pl-info'><dt><span>",i18n.PROBLEMS,":</span></dt><dd class=",type,"><span>",plFaceUp,"</span></dd><dt><span>",i18n.CODE,":</span></dt><dd class='pl-code'><span class='code'>",plCode,"</span></dd></dl><h4 class='det-hd'><span>",i18n.PROBLEMS_DETAILS,":</span></h4><div class='hvr'><dl class='pl-det'><dt><span>",i18n.PROBLEM,":</span></dt><dd class='pl-det-name'><span>",plName,"</span></dd><dt><span>",i18n.ANNOTATED_DISPLAY,":</span></dt><dd class='pl-det-annot'><span>",plAnnot,"</span></dd><dt><span>",i18n.ONSET_DATE,":</span></dt><dd class='pl-det-dt'><span>",onsetDateFormatted,"</span></dd><dt><span>",i18n.RESPONSIBLE_PROVIDER_NAME,":</span></dt><dd class='pl-det-dt'><span>",responsibleProvider,"</span></dd><dt><span>",i18n.COMMENTS,":</span></dt><dd class='pl-det-comment'><span>",MP_Util.Doc.GetComments(problemArray[i],personnelArray),"</span></dd></dl></div>");
}plHTML=jsPlHTML.join("");
countText=MP_Util.CreateTitleText(component,probLen);
jsPlHTML.push("</div>");
}else{if((reply.getStatus()==="Z")){plHTML=jsPlHTML.join("");
plHTML+=MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace());
}}MP_Util.Doc.FinalizeComponent(plHTML,component,countText);
if(recordData.PL_CAN_ADD===1){MP_Util.AddAutoSuggestControl(component,CERN_PROBLEMS_O1.SearchNomenclature,CERN_PROBLEMS_O1.HandleSelection,CERN_PROBLEMS_O1.CreateSuggestionLine);
component.setSearchTypeFlag(recordData.PL_SEARCH_TYPE);
}}else{countText=MP_Util.CreateTitleText(component,0);
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),reply.getError()),component,countText);
}}catch(err){countText=MP_Util.CreateTitleText(component,0);
var errMsg=[];
errMsg.push("<b>",i18n.JS_ERROR,"</b><br><ul><li>",i18n.MESSAGE,": ",err.message,"</li><li>",i18n.NAME,": ",err.name,"</li><li>",i18n.NUMBER,": ",(err.number&65535),"</li><li>",i18n.DESCRIPTION,": ",err.description,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,countText);
throw (err);
}finally{component.setEditMode(false);
}},SearchNomenclature:function(callback,textBox,component){var xhr=(CERN_BrowserDevInd)?new XMLHttpRequest():new XMLCclRequest();
var returnData;
component.incCurSearchCounter();
xhr.onreadystatechange=function(){if(xhr.readyState==4&&xhr.status==200){MP_Util.LogScriptCallInfo(component,this,"problem.js","SearchNomenclature");
var msg=xhr.responseText;
var jsonMsg="";
if(msg){jsonMsg=JSON.parse(msg);
}if(jsonMsg){var nextSearchCounter=component.getNextSearchCounter();
var replySearchCounter=jsonMsg.RECORD_DATA.SEARCHINDEX;
component.setReplySearchCounter(replySearchCounter);
if(replySearchCounter>nextSearchCounter&&textBox.value!==""){component.setNextSearchCounter(replySearchCounter);
returnData=jsonMsg.RECORD_DATA.NOMENCLATURE;
callback.autosuggest(returnData);
}}}};
var sendAr=["^MINE^","^"+textBox.value+"^",component.getSuggestionLimit(),component.getCurSearchCounter(),component.getSearchTypeFlag()];
if(CERN_BrowserDevInd){var url="mp_search_nomenclatures?parameters="+sendAr.join(",");
xhr.open("GET",url);
xhr.send(null);
}else{xhr.open("GET","mp_search_nomenclatures");
xhr.send(sendAr.join(","));
}},HandleSelection:function(suggestionObj,textBox,component){var criterion=component.getCriterion();
var sendAr=[];
sendAr.push("^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0",suggestionObj.VALUE+".0","0.0","1","1",component.getProblemsAddTypeCd()+".0",component.getProblemsClassification()+".0");
var request=new MP_Core.ScriptRequest(component,component.getAutoSuggestAddTimerName());
request.setProgramName(component.getAutoSuggestAddScript());
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(component,request,CERN_PROBLEMS_O1.AddProblemToList);
},AddProblemToList:function(reply){var alertMsg="";
var jsonReply=reply.getResponse();
var component=reply.getComponent();
var componentName="";
var textBox=MP_Util.RetrieveAutoSuggestSearchBox(component);
componentName=i18n.discernabu.PROBLEM;
if(jsonReply&&jsonReply.PRIVILEGE_IND===0){alertMsg=i18n.discernabu.NO_PRIVS;
alertMsg=alertMsg.replace("{name}",componentName);
alert(alertMsg);
textBox.value="";
}else{if(jsonReply&&jsonReply.DUPLICATE_IND==1){alertMsg=i18n.discernabu.DUPLICATE;
alertMsg=alertMsg.replace(/{name}/gi,componentName);
alert(alertMsg);
textBox.value="";
}else{MP_Util.Doc.HideHovers();
component.InsertData();
}}},CreateSuggestionLine:function(suggestionObj,searchVal){return CERN_PROBLEMS_O1.HighlightValue(suggestionObj.NAME,searchVal);
},HighlightValue:function(inString,term){return"<strong class='highlight'>"+inString.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1").split(" ").join("|")+")(?![^<>]*>)(?![^&;]+;)","gi"),"</strong>$1<strong class='highlight'>")+"</strong>";
}};
}();
