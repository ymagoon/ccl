function WarfarinComponentStyle(){this.initByNamespace("wm");
}WarfarinComponentStyle.inherits(ComponentStyle);
function WarfarinComponent(criterion){this.setCriterion(criterion);
this.setStyles(new WarfarinComponentStyle());
this.setScope(2);
this.setIncludeLineNumber(true);
this.m_medCodes=[];
this.m_labCodes=[];
}WarfarinComponent.prototype=new MPageComponent();
WarfarinComponent.prototype.constructor=MPageComponent;
MP_Util.setObjectDefinitionMapping("WARFARIN_MGT",WarfarinComponent);
MP_Util.setObjectDefinitionMapping("WF_WARFARIN_MGT",WarfarinComponent);
WarfarinComponent.inherits(MPageComponent);
WarfarinComponent.prototype.setMedCodes=function(medCodes){this.m_medCodes=medCodes;
};
WarfarinComponent.prototype.getMedCodes=function(){return this.m_medCodes;
};
WarfarinComponent.prototype.setlabCodes=function(labCodes){this.m_labCodes=labCodes;
};
WarfarinComponent.prototype.getlabCodes=function(){return this.m_labCodes;
};
WarfarinComponent.prototype.loadFilterMappings=function(){this.addFilterMappingObject("WARFARIN_MGT_MEDS",{setFunction:this.setMedCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("WARFARIN_MGT_LABS",{setFunction:this.setlabCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("WF_WARFARIN_MGT_MEDS",{setFunction:this.setMedCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("WF_WARFARIN_MGT_LABS",{setFunction:this.setlabCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
};
WarfarinComponent.prototype.preProcessing=function(){if(this.isSummaryComponent()){this.setComponentLoadTimerName("USR:MPG.WARFARIN.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.WARFARIN.O1 - render component");
}else{this.setComponentLoadTimerName("USR:MPG.WARFARIN.O2 - load component");
this.setComponentRenderTimerName("ENG:MPG.WARFARIN.O2 - render component");
}};
WarfarinComponent.prototype.isSummaryComponent=function(){return this.getStyles().getComponentType()!==CERN_COMPONENT_TYPE_WORKFLOW;
};
WarfarinComponent.prototype.resizeComponent=function(){var rootNode=$(this.getRootComponentNode());
MPageComponent.prototype.resizeComponent.call(this);
rootNode.find(".wm-hdr").find(".wm-table").width(rootNode.find(".wm-sec").first().width()-1);
};
WarfarinComponent.prototype.retrieveComponentData=function(){var criterion=this.getCriterion();
var loadTimer=new RTMSTimer(this.getComponentLoadTimerName());
var renderTimer=new RTMSTimer(this.getComponentRenderTimerName());
var scriptRequest=new ComponentScriptRequest();
scriptRequest.setProgramName("MP_ANTICOAG_MGT");
scriptRequest.setParameterArray(["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",MP_Util.CreateParamArray(this.getlabCodes(),1),0,MP_Util.CreateParamArray(this.getMedCodes(),1),0,criterion.provider_id+".0",criterion.ppr_cd+".0",criterion.position_cd+".0",0,0,0,0,0,this.getLookbackUnits()||3,this.getLookbackUnitTypeFlag()||4]);
scriptRequest.setComponent(this);
scriptRequest.setLoadTimer(loadTimer);
scriptRequest.setRenderTimer(renderTimer);
scriptRequest.performRequest();
};
WarfarinComponent.prototype.renderComponent=function(recordData){var compHTML=[];
var totalCnt=parseInt(recordData.DATE_QUAL_CNT,10);
var scrollClass=MP_Util.GetContentClass(this,totalCnt);
var compClassType;
var sHTML;
var countText;
var heightEm;
var self=this;
var isSummaryType=this.isSummaryComponent();
try{this.warI18n=i18n.discernabu.warfarin_o1;
this.compType=recordData.ENCNTR_TYPE_FLAG;
compClassType=(this.compType===0)?"content-body wm-in":"content-body wm-out";
compHTML.push('<div class ="',compClassType,'" >');
if(totalCnt>0){compHTML.push('<div class ="wm-hdr hdr" >');
compHTML.push('<table class="wm-table">');
compHTML.push('<tr class="wm-table-hdr hdr">');
compHTML.push('<td class="wm-name-hd"><dl><dd><span>',this.warI18n.INR_LBL,"</span></dd></dl></td>");
compHTML.push('<td class="wm-date-hd"><dl><dd><span>',this.warI18n.DATE_TIME,"</span></dd></dl></td>");
if(this.compType===1){compHTML.push('<td class="wm-med-name-hd"><dl><dd><span>',this.warI18n.RX_LBL," 1","</span></dd></dl></td>");
compHTML.push('<td class="wm-stat-hd"><dl><dd><span>',this.warI18n.UNITS,"</span></dd></dl></td>");
}else{compHTML.push('<td class="wm-stat-hd"><dl><dd><span>',this.warI18n.RX_LBL,"</span></dd></dl></td>");
}compHTML.push("</tr></table>");
compHTML.push("</div>");
compHTML.push('<div class ="',(scrollClass.indexOf("scrollable")>-1&&isSummaryType)?"scrollable":"",'" >');
compHTML.push(this.createSubsection(recordData));
compHTML.push("</div>");
}else{compHTML.push("<div ><span class='res-none'>"+this.warI18n.NO_RESULTS_FOUND+"</span></div>");
}compHTML.push("</div>");
sHTML=compHTML.join("");
countText=MP_Util.CreateTitleText(this,totalCnt);
MP_Util.Doc.FinalizeComponent(sHTML,this,countText);
if(isSummaryType){if(this.compType===1){heightEm="6.5";
}else{heightEm="2.2";
}setTimeout(function(){MP_Util.Doc.InitScrolling(Util.Style.g("scrollable",self.getSectionContentNode(),"div"),self.getScrollNumber(),heightEm);
},1);
}}catch(err){logger.logError(err);
throw err;
}};
WarfarinComponent.prototype.getNormalancyClass=function(rsltVal,normalFlag){var className="res-normal";
switch(normalFlag){case -2:className="res-severe";
break;
case -1:className="res-low";
break;
case 0:className="res-normal";
break;
case 1:className="res-high";
break;
case 2:className="res-severe";
break;
default:className="res-normal";
}return className;
};
WarfarinComponent.prototype.specialInstInfo=function(warSpecInst){var cellHtml=[];
cellHtml.push('<dl class ="wm-info">');
cellHtml.push('<span class="wm-inst-icon">&nbsp;</span>');
cellHtml.push("</dl>");
cellHtml.push("<h4 class='det-hd'>special Instruction</h4>");
cellHtml.push('<div class="hvr wm-hvr">');
cellHtml.push("<dl class=wm-det><dd><span>",warSpecInst,"</span></dd></dl>");
cellHtml.push("</div>");
return cellHtml.join("");
};
WarfarinComponent.prototype.dateCellInfo=function(rsltDate){var cellHtml=[];
var dtObj=new Date();
dtObj.setISO8601(rsltDate);
cellHtml.push('<div class="res-cell-wrap">');
cellHtml.push('<span class="wm-space">&nbsp;</span><span class="wm-val">');
if(this.compType===1){cellHtml.push(dtObj.format("mmm dd"),'</br><span class="wm-space">&nbsp;</span>',dtObj.format("yyyy"));
}else{cellHtml.push(dtObj.format("mmm dd, yyyy"));
}cellHtml.push("</span>");
if(this.compType===1){cellHtml.push("</br>");
}cellHtml.push('<span class="within"><span class="wm-space">&nbsp;</span>',dtObj.format("HH:MM"),"</span>");
cellHtml.push("</div>");
return cellHtml.join("");
};
WarfarinComponent.prototype.warfarinCellInfoEmpty=function(){var cellHtml=[];
cellHtml.push('<div class="res-cell-wrap">');
cellHtml.push('<span class="wm-space">&nbsp;</span>');
cellHtml.push('<span class="res-val"> -- </span>');
cellHtml.push('<span class="wm-inst">&nbsp;</span>');
cellHtml.push("</div>");
return cellHtml.join("");
};
WarfarinComponent.prototype.warfarinMedInfo=function(medName){var cellHtml=[];
cellHtml.push('<div class="res-cell-wrap">');
cellHtml.push('<span class="wm-space">&nbsp;</span>');
cellHtml.push('<span class="res-med" title="',medName,'">',medName,"</span>");
cellHtml.push("</div>");
return cellHtml.join("");
};
WarfarinComponent.prototype.warfarinCellInfo=function(warStrength,warUnit,warSpecInst){var cellHtml=[];
cellHtml.push('<div class="res-cell-wrap">');
cellHtml.push('<span class="wm-space">&nbsp;</span>');
cellHtml.push('<span class="res-val">',warStrength,"</span>");
if(warUnit!==""){cellHtml.push('<span class="within"><span class="wm-space">&nbsp;</span> ',warUnit,"</span>");
}if(warSpecInst!==""){cellHtml.push('<span class="wm-inst">',this.specialInstInfo(warSpecInst),"</span>");
}cellHtml.push("</div>");
return cellHtml.join("");
};
WarfarinComponent.prototype.inrCellInfo=function(rowData){var cellHtml=[];
var nrmlClass="";
var inrVal=parseFloat(rowData.INR_VALUE).toFixed(1);
var inrNormFlag=parseInt(rowData.INR_NORM_FLAG,10);
if(inrVal>0){nrmlClass=this.getNormalancyClass(inrVal,inrNormFlag);
}else{inrVal="--";
nrmlClass="res-normal";
}cellHtml.push('<div class="res-cell-wrap">');
cellHtml.push('<span class="',nrmlClass,'">');
cellHtml.push('<span class="wm-space">&nbsp;</span><span class="res-ind">&nbsp;</span>');
cellHtml.push('<span class="res-val">',inrVal,"</span>");
cellHtml.push("</span>");
cellHtml.push("</div>");
return cellHtml.join("");
};
WarfarinComponent.prototype.createSubsection=function(recData){var subSecHtml=[];
var oddevenClass="";
var warColCnt=(this.compType===0)?1:3;
var recSize=recData.DATE_QUAL_CNT;
var warStrength=0;
var warUnit="";
var warSpecInst="";
var presMedName="";
var warVolStrength=0;
var recCnt=0;
var rec;
var medNameHtml=[];
var medUnitHtml=[];
var heldInd;
var displayVal;
var cnt=0;
var nameFlag;
subSecHtml.push('<div class="sub-sec">');
subSecHtml.push('<div class="sub-sec-content"><div class="',(this.isSummaryComponent())?"content-body":"",'" >');
subSecHtml.push('<table class="wm-table wm-sec">');
for(recCnt=0;
recCnt<recSize;
recCnt++){rec=recData.DATE_QUAL[recCnt];
oddevenClass=((recCnt%2)===0)?"even":"odd";
medNameHtml=[];
medUnitHtml=[];
subSecHtml.push('<tr class="',oddevenClass,'">');
subSecHtml.push('<td class="wm-name"><dl><dd>',this.inrCellInfo(rec),"</dd></dl></td>");
subSecHtml.push('<td class="wm-date"><dl><dd>',this.dateCellInfo(rec.RESULT_DT_TM),"</dd></dl></td>");
if(this.compType===0){warStrength=parseFloat(rec.ADMINMEDSTRENGTH).toFixed(1);
warUnit=rec.ADMINMEDUNIT;
warSpecInst="";
heldInd=rec.ADMINMEDHELD;
if(heldInd===1){warStrength=this.warI18n.HELD;
warUnit="";
warSpecInst=rec.ADMINMEDHELDREASON;
}if(warStrength>0||heldInd===1){subSecHtml.push("<td class='wm-stat'><dl><dd>",this.warfarinCellInfo(warStrength,warUnit,warSpecInst),"</dd></dl></td>");
}else{subSecHtml.push("<td class='wm-stat'><dl><dd>",this.warfarinCellInfoEmpty(),"</dd></dl></td>");
}}else{medNameHtml.push("<td class='wm-med-name'><dl>");
medUnitHtml.push("<td class='wm-stat'><dl>");
displayVal="--";
for(cnt=0;
cnt<warColCnt;
cnt++){nameFlag=true;
if(rec.PRESCRIBEDMEDQUAL[cnt]){warStrength=rec.PRESCRIBEDMEDQUAL[cnt].PRESMED_STRENGTH;
warUnit=rec.PRESCRIBEDMEDQUAL[cnt].PRESMED_UNIT;
warSpecInst=rec.PRESCRIBEDMEDQUAL[cnt].PRESMED_SPEC_INS;
presMedName=rec.PRESCRIBEDMEDQUAL[cnt].PRESMED_LBL;
warVolStrength=rec.PRESCRIBEDMEDQUAL[cnt].PRESMED_VOLUME;
if(presMedName===""){nameFlag=false;
}if(warVolStrength===0&&warStrength===0){displayVal="--";
}else{if(warStrength>0){displayVal=parseFloat(warStrength).toFixed(1);
}else{displayVal=parseFloat(warVolStrength).toFixed(1);
}}}else{warStrength=0;
warUnit="";
warSpecInst="";
warVolStrength=0;
nameFlag=false;
displayVal="--";
}if(nameFlag){medNameHtml.push("<dd>",this.warfarinMedInfo(presMedName),"</dd>");
}else{medNameHtml.push("<dd>",this.warfarinCellInfoEmpty(),"</dd>");
}medUnitHtml.push("<dd>",this.warfarinCellInfo(displayVal,warUnit,warSpecInst),"</dd>");
}medNameHtml.push("</dl></td>");
medUnitHtml.push("</dl></td>");
}subSecHtml.push(medNameHtml.join(""),medUnitHtml.join(""));
subSecHtml.push("</tr>");
}subSecHtml.push("</table>");
subSecHtml.push("</div></div></div>");
return subSecHtml.join("");
};
