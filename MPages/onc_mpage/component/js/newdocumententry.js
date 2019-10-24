function NewDocumentEntryComponentStyle(){this.initByNamespace("nde");
}NewDocumentEntryComponentStyle.prototype=new ComponentStyle();
NewDocumentEntryComponentStyle.prototype.constructor=ComponentStyle;
function NewDocumentEntryComponent(criterion){this.m_docTitle="";
this.m_labelOne="";
this.m_labelTwo="";
this.m_labelThree="";
this.m_labelFour="";
this.m_textArea1=null;
this.m_textArea2=null;
this.m_textArea3=null;
this.m_textArea4=null;
this.m_canAddDoc=false;
this.m_isCompAddable=true;
this.m_isCompSignable=true;
this.m_docEventCode=0;
this.setCriterion(criterion);
this.setStyles(new NewDocumentEntryComponentStyle());
this.setComponentLoadTimerName("USR:MPG.NEW_DOCUMENT_ENTRY.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.NEW_DOCUMENT_ENTRY.O1 - render component");
NewDocumentEntryComponent.method("setDocTitle",function(value){this.m_docTitle=value;
});
NewDocumentEntryComponent.method("getDocTitle",function(){return this.m_docTitle;
});
NewDocumentEntryComponent.method("setLabelOne",function(value){this.m_labelOne=value;
});
NewDocumentEntryComponent.method("getLabelOne",function(){return this.m_labelOne;
});
NewDocumentEntryComponent.method("setLabelTwo",function(value){this.m_labelTwo=value;
});
NewDocumentEntryComponent.method("getLabelTwo",function(){return this.m_labelTwo;
});
NewDocumentEntryComponent.method("setLabelThree",function(value){this.m_labelThree=value;
});
NewDocumentEntryComponent.method("getLabelThree",function(){return this.m_labelThree;
});
NewDocumentEntryComponent.method("setLabelFour",function(value){this.m_labelFour=value;
});
NewDocumentEntryComponent.method("getLabelFour",function(){return this.m_labelFour;
});
NewDocumentEntryComponent.method("setDocEventCode",function(value){this.m_docEventCode=value;
});
NewDocumentEntryComponent.method("getDocEventCode",function(){return this.m_docEventCode;
});
NewDocumentEntryComponent.method("setAddDocPriv",function(value){this.m_canAddDoc=value;
});
NewDocumentEntryComponent.method("canAddDoc",function(){return this.m_canAddDoc;
});
NewDocumentEntryComponent.method("getTextArea",function(textAreaNum){switch(textAreaNum){case 1:return this.m_textArea1;
case 2:return this.m_textArea2;
case 3:return this.m_textArea3;
case 4:return this.m_textArea4;
default:return null;
}});
NewDocumentEntryComponent.method("setTextArea",function(textAreaNum,element){switch(textAreaNum){case 1:this.m_textArea1=element;
break;
case 2:this.m_textArea2=element;
break;
case 3:this.m_textArea3=element;
break;
case 4:this.m_textArea4=element;
break;
default:return null;
}});
NewDocumentEntryComponent.method("InsertData",function(){CERN_NEW_DOCUMENT_ENTRY_O1.GetNewDocEntryPrivs(this);
this.HandleSuccess();
});
NewDocumentEntryComponent.method("HandleSuccess",function(recordData){CERN_NEW_DOCUMENT_ENTRY_O1.RenderComponent(this,recordData);
});
NewDocumentEntryComponent.method("openTab",function(){this.InsertData();
});
}NewDocumentEntryComponent.prototype=new MPageComponentInteractive();
NewDocumentEntryComponent.prototype.constructor=MPageComponentInteractive;
var CERN_NEW_DOCUMENT_ENTRY_O1=function(){var rtfFormat={rhead:"{\\rtf1\\ansi \\deff0{\\fonttbl{\\f0\\fswiss MS Sans Serif;}{\\colortbl; \\red255\\green0\\blue0; \\red0\\green0\\blue255; \\red0\\green255\\blue0; \\red255\\green0\\blue0; \\red85\\green26\\blue139;}}\\plain \\f0 \\fs18 ",wbr:" \\plain \\f0 \\cf1 \\fs18 \\b ",wr:" \\plain \\f0 \\fs18 ",Reol:" \\par ",Rtab:" \\tab "};
return{GetNewDocEntryPrivs:function(component){var nde_eventCode=component.getDocEventCode();
var docECArr=[nde_eventCode];
component.getEventCdPrivs(component,docECArr);
var docPrivObj=component.getDocPrivObj();
if(docPrivObj.getStatus()==="F"){MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),docPrivObj.getError()),component,"");
}else{if(component.isResultEventCodeAddable(nde_eventCode)===true&&component.isResultEventCodeSignable(nde_eventCode)===true){component.setAddDocPriv(true);
}}},RenderComponent:function(component,recordData){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
var newDocEntryi18n=i18n.discernabu.nde_o1;
try{var criterion=component.getCriterion();
var docTitle=component.getDocTitle();
var docEventCode=component.getDocEventCode();
var compId=component.getComponentId();
var ndeHTML="";
var ndeJsHTML=[];
var paramString='"'+criterion.person_id+"|"+criterion.encntr_id+'|0|0|0"';
ndeJsHTML.push("<div class='nde-container odd'><div class='nde-section text-center'><h1 class='nde-doc-label x-small-heading'>",component.getLabelOne(),"</h1><textarea rows='3' id='ndeDocTextarea1",compId,"' class='nde-doc-textarea' disabled='true'></textarea></div><div class='nde-section text-center'><h1 class = 'nde-doc-label x-small-heading'>",component.getLabelTwo(),"</h1><textarea rows='3' id='ndeDocTextarea2",compId,"' class='nde-doc-textarea' disabled='true'></textarea></div></div>");
ndeJsHTML.push("<div class='nde-container even'><div class='nde-section text-center'><h1 class='nde-doc-label x-small-heading'>",component.getLabelThree(),"</h1><textarea rows='3' id='ndeDocTextarea3",compId,"' class='nde-doc-textarea' disabled='true'></textarea></div><div class='nde-section text-center'><h1 class = 'nde-doc-label x-small-heading'>",component.getLabelFour(),"</h1><textarea rows='3' id='ndeDocTextarea4",compId,"' class='nde-doc-textarea' disabled='true'></textarea></div></div>");
ndeJsHTML.push("<div class='text-right'><input id = 'ndeButtonSign",compId,"' class='nde-doc-btn' type='button' disabled='true' value='",newDocEntryi18n.SIGN,"' /><input id = 'ndeButtonClear",compId,"' class='nde-doc-btn' type='button' disabled='true' value='",newDocEntryi18n.CLEAR,"' /></div>");
ndeHTML=ndeJsHTML.join("");
MP_Util.Doc.FinalizeComponent(ndeHTML,component,"");
var textAreaOne=_g("ndeDocTextarea1"+compId);
Util.addEvent(textAreaOne,"blur",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaOne,"focus",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaOne,"keyup",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaOne,"mousemove",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
component.setTextArea(1,textAreaOne);
var textAreaTwo=_g("ndeDocTextarea2"+compId);
Util.addEvent(textAreaTwo,"blur",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaTwo,"focus",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaTwo,"keyup",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaTwo,"mousemove",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
component.setTextArea(2,textAreaTwo);
var textAreaThree=_g("ndeDocTextarea3"+compId);
Util.addEvent(textAreaThree,"blur",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaThree,"focus",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaThree,"keyup",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaThree,"mousemove",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
component.setTextArea(3,textAreaThree);
var textAreaFour=_g("ndeDocTextarea4"+compId);
Util.addEvent(textAreaFour,"blur",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaFour,"focus",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaFour,"keyup",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
Util.addEvent(textAreaFour,"mousemove",function(){CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
});
component.setTextArea(4,textAreaFour);
var buttonSign=_g("ndeButtonSign"+compId);
Util.addEvent(buttonSign,"click",function(){CERN_NEW_DOCUMENT_ENTRY_O1.saveData(this,component);
});
var buttonClear=_g("ndeButtonClear"+compId);
Util.addEvent(buttonClear,"click",function(){CERN_NEW_DOCUMENT_ENTRY_O1.clearData(component);
CERN_NEW_DOCUMENT_ENTRY_O1.disableButtons(compId);
});
if(component.canAddDoc()){CERN_NEW_DOCUMENT_ENTRY_O1.enableTextAreas(component);
}else{var ndeCompContentElement=_g(component.getStyles().getContentId());
var ndeCompElement=Util.gp(ndeCompContentElement);
if(Util.Style.ccss(ndeCompElement,"closed")===false){Util.Style.tcss(ndeCompElement,"closed");
}var ndeCompId=component.getComponentId();
var ndeModRootId="nde"+ndeCompId;
var ndeCompSec=_g(ndeModRootId);
var titleFrag=Util.ce("span");
var innerHTMLArr=[];
innerHTMLArr.push('<span id="ndeNoPrivs',+ndeCompId,'" class="nde-sec-hd-no-privs">',newDocEntryi18n.NO_PRIVS,"</span>");
titleFrag.innerHTML=innerHTMLArr.join("");
var secTitle=Util.Style.g("sec-title",ndeCompSec,"span")[0];
Util.ia(titleFrag,secTitle);
textAreaOne.style.background="#C0C0C0";
textAreaTwo.style.background="#C0C0C0";
textAreaThree.style.background="#C0C0C0";
textAreaFour.style.background="#C0C0C0";
}}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}},saveData:function(btn,component){var criterion=component.getCriterion();
var newDocEntryi18n=i18n.discernabu.nde_o1;
var totalCharCount=CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreaCount(component);
var charLimit=20000;
if(totalCharCount<=charLimit){var ndeCompId=component.getComponentId();
var ndeModRootId="nde"+ndeCompId;
var ndeCompSec=_g(ndeModRootId);
var titleFrag=Util.ce("span");
var innerHTMLArr=[];
innerHTMLArr.push('<span id="ndeProcessing',+ndeCompId,'" class="nde-sec-hd-processing">',newDocEntryi18n.PROCESSING,"</span>");
titleFrag.innerHTML=innerHTMLArr.join("");
var secTitle=Util.Style.g("sec-title",ndeCompSec,"span")[0];
Util.ia(titleFrag,secTitle);
CERN_NEW_DOCUMENT_ENTRY_O1.disableButtons(component.getComponentId());
CERN_NEW_DOCUMENT_ENTRY_O1.disableTextAreas(component);
var textAreaOneText=component.getTextArea(1).value;
var textAreaTwoText=component.getTextArea(2).value;
var textAreaThreeText=component.getTextArea(3).value;
var textAreaFourText=component.getTextArea(4).value;
textAreaOneText=textAreaOneText.replace(/\\/g,"\\'5c").replace(/\^/g,"\\'5e").replace(/\{/g,"\\'7b").replace(/\}/g,"\\'7d").replace(/[\n]/g,rtfFormat.Reol+rtfFormat.Rtab);
textAreaTwoText=textAreaTwoText.replace(/\\/g,"\\'5c").replace(/\^/g,"\\'5e").replace(/\{/g,"\\'7b").replace(/\}/g,"\\'7d").replace(/[\n]/g,rtfFormat.Reol+rtfFormat.Rtab);
textAreaThreeText=textAreaThreeText.replace(/\\/g,"\\'5c").replace(/\^/g,"\\'5e").replace(/\{/g,"\\'7b").replace(/\}/g,"\\'7d").replace(/[\n]/g,rtfFormat.Reol+rtfFormat.Rtab);
textAreaFourText=textAreaFourText.replace(/\\/g,"\\'5c").replace(/\^/g,"\\'5e").replace(/\{/g,"\\'7b").replace(/\}/g,"\\'7d").replace(/[\n]/g,rtfFormat.Reol+rtfFormat.Rtab);
var labelOne=component.getLabelOne().replace(/\\/g,"\\'5c").replace(/\^/g,"\\'5e").replace(/\{/g,"\\'7b").replace(/\}/g,"\\'7d");
var labelTwo=component.getLabelTwo().replace(/\\/g,"\\'5c").replace(/\^/g,"\\'5e").replace(/\{/g,"\\'7b").replace(/\}/g,"\\'7d");
var labelThree=component.getLabelThree().replace(/\\/g,"\\'5c").replace(/\^/g,"\\'5e").replace(/\{/g,"\\'7b").replace(/\}/g,"\\'7d");
var labelFour=component.getLabelFour().replace(/\\/g,"\\'5c").replace(/\^/g,"\\'5e").replace(/\{/g,"\\'7b").replace(/\}/g,"\\'7d");
var docText=[];
docText.push(rtfFormat.rhead);
docText.push(rtfFormat.wbr," ",labelOne,": ",rtfFormat.wr);
docText.push(rtfFormat.Reol,rtfFormat.Rtab,textAreaOneText,rtfFormat.Reol,rtfFormat.Reol);
docText.push(rtfFormat.wbr," ",labelTwo,": ",rtfFormat.wr);
docText.push(rtfFormat.Reol,rtfFormat.Rtab,textAreaTwoText,rtfFormat.Reol,rtfFormat.Reol);
docText.push(rtfFormat.wbr," ",labelThree,": ",rtfFormat.wr);
docText.push(rtfFormat.Reol,rtfFormat.Rtab,textAreaThreeText,rtfFormat.Reol,rtfFormat.Reol);
docText.push(rtfFormat.wbr," ",labelFour,": ",rtfFormat.wr);
docText.push(rtfFormat.Reol,rtfFormat.Rtab,textAreaFourText,rtfFormat.Reol,rtfFormat.Reol);
docText.push("}");
var sendAr=[];
var request=null;
sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",criterion.encntr_id+".0",component.getDocEventCode()+".0","^"+component.getDocTitle()+"^","^"+docText.join("")+"^",criterion.ppr_cd+".0");
request=new MP_Core.ScriptRequest(component,"ENG:MPG.NEW_DOCUMENT_ENTRY.O1");
request.setProgramName("MP_ADD_DOCUMENT");
request.setParameters(sendAr);
request.setAsync(true);
var saveFunc=function(){CERN_NEW_DOCUMENT_ENTRY_O1.handleSave(component);
};
MP_Core.XMLCCLRequestCallBack(component,request,function(reply){var getJsonResponce=reply.getResponse();
if(getJsonResponce.STATUS_DATA.STATUS=="S"){saveFunc();
var mpEventAudit=new MP_EventAudit();
var dEventId=getJsonResponce.REP[0].RB_LIST[1].EVENT_ID;
var updateDateTime=getJsonResponce.REP[0].RB_LIST[1].VALID_FROM_DT_TM;
var regDate=/\((.*)\)/;
var updDateTime=updateDateTime.match(regDate)[1];
mpEventAudit.setAuditMode(0);
mpEventAudit.setAuditEventName("Document Creation");
mpEventAudit.setAuditEventType("Add");
mpEventAudit.setAuditParticipantType("Person");
mpEventAudit.setAuditParticipantIDType("Patient");
mpEventAudit.setAuditDataLifeCycle("Origin/Creation");
mpEventAudit.setAuditParticipantRoleCd("Patient");
mpEventAudit.setAuditParticipantID(criterion.person_id);
mpEventAudit.setAuditParticipantName("STATUS=2 EVENT_ID="+dEventId+": UPDT_DT_TM="+updDateTime+" UTC (VALID_FROM_DT_TM)");
mpEventAudit.addAuditEvent();
mpEventAudit.submit();
}});
}else{var exceededCharCount=totalCharCount-charLimit;
var alertText=newDocEntryi18n.EXCEEDED_CHAR;
alertText=alertText.replace(/\{x\}/g,exceededCharCount);
alert(alertText+"\n\n"+newDocEntryi18n.THANK_YOU+".");
}},clearData:function(component){component.getTextArea(1).value="";
component.getTextArea(2).value="";
component.getTextArea(3).value="";
component.getTextArea(4).value="";
},handleSave:function(component){var newDocEntryi18n=i18n.discernabu.nde_o1;
var ndeCompId=component.getComponentId();
var ndeModRootId="nde"+ndeCompId;
var ndeCompSec=_g(ndeModRootId);
var titleFrag=_g("ndeProcessing"+ndeCompId);
Util.de(titleFrag);
var titleFragSaved=Util.ce("span");
var innerHTMLArrSaved=[];
innerHTMLArrSaved.push('<span id="ndeSaved',+ndeCompId,'" class="nde-sec-hd-saved">',newDocEntryi18n.DOC_SAVED,"</span>");
titleFragSaved.innerHTML=innerHTMLArrSaved.join("");
var secTitleSaved=Util.Style.g("sec-title",ndeCompSec,"span")[0];
Util.ia(titleFragSaved,secTitleSaved);
var refreshFunc=function(){CERN_NEW_DOCUMENT_ENTRY_O1.refresh(component);
};
setTimeout(refreshFunc,4000);
},refresh:function(component){var titleFragSaved=_g("ndeSaved"+component.getComponentId());
Util.de(titleFragSaved);
try{CERN_EventListener.fireEvent(null,component,EventListener.EVENT_ADD_DOC,"New Document Entry");
}catch(err){logger.logJSError(err,this,"newdocumententry.js","New Document Entry o1");
}CERN_NEW_DOCUMENT_ENTRY_O1.clearData(component);
CERN_NEW_DOCUMENT_ENTRY_O1.enableTextAreas(component);
CERN_NEW_DOCUMENT_ENTRY_O1.enableButtons(component.getComponentId());
CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreas(component);
},disableButtons:function(compId){_g("ndeButtonSign"+compId).disabled=true;
_g("ndeButtonClear"+compId).disabled=true;
},disableTextAreas:function(component){component.getTextArea(1).disabled=true;
component.getTextArea(2).disabled=true;
component.getTextArea(3).disabled=true;
component.getTextArea(4).disabled=true;
},enableButtons:function(compId){_g("ndeButtonSign"+compId).disabled=false;
_g("ndeButtonClear"+compId).disabled=false;
},enableTextAreas:function(component){component.getTextArea(1).disabled=false;
component.getTextArea(2).disabled=false;
component.getTextArea(3).disabled=false;
component.getTextArea(4).disabled=false;
},checkTextAreas:function(component){if(CERN_NEW_DOCUMENT_ENTRY_O1.checkTextAreaCount(component)===0){CERN_NEW_DOCUMENT_ENTRY_O1.disableButtons(component.getComponentId());
}else{CERN_NEW_DOCUMENT_ENTRY_O1.enableButtons(component.getComponentId());
}},checkTextAreaCount:function(component){var textAreaOneText=component.getTextArea(1).value;
var textAreaTwoText=component.getTextArea(2).value;
var textAreaThreeText=component.getTextArea(3).value;
var textAreaFourText=component.getTextArea(4).value;
var totalCharacterCount=textAreaOneText.length+textAreaTwoText.length+textAreaThreeText.length+textAreaFourText.length;
return totalCharacterCount;
}};
}();
