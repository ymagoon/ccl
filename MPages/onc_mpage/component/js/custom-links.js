function CustomLinksComponentStyle(){this.initByNamespace("cl");
}CustomLinksComponentStyle.inherits(ComponentStyle);
function CustomLinksComponent(criterion){this.setCriterion(criterion);
this.setStyles(new CustomLinksComponentStyle());
this.setComponentLoadTimerName("USR:MPG.Custom Links- load component");
this.setComponentRenderTimerName("ENG:MPG.Custom Links - render component");
this.setIncludeLineNumber(true);
this.setScope(0);
var cl_i18n=i18n.innov.cl_o1;
this.m_referenceName=cl_i18n.REF_HDR;
this.m_referenceArray=[];
this.m_mPageName=cl_i18n.MP_HDR;
this.m_mPageArray=[];
this.m_formsName=cl_i18n.PF_HDR;
this.m_formsLinks=[];
}CustomLinksComponent.prototype=new MPageComponent();
CustomLinksComponent.prototype.constructor=MPageComponent;
CustomLinksComponent.prototype.getFormsLinks=function(){return(this.m_formsLinks);
};
CustomLinksComponent.prototype.setFormsLinks=function(value){this.m_formsLinks=value;
};
CustomLinksComponent.prototype.getFormsName=function(){return(this.m_formsName);
};
CustomLinksComponent.prototype.setFormsName=function(value){if(value>""){this.m_formsName=value;
}};
CustomLinksComponent.prototype.getMPageLinks=function(){return(this.m_mPageArray);
};
CustomLinksComponent.prototype.setMPageLinks=function(value){var j=0;
for(var i=0,il=value.length;
i<il;
i++){if(i%2!==0){this.m_mPageArray[j].disp=value[i];
j++;
}else{this.m_mPageArray[j]={link:value[i],disp:""};
}}};
CustomLinksComponent.prototype.getMPageName=function(){return(this.m_mPageName);
};
CustomLinksComponent.prototype.setMPageName=function(value){if(value>""){this.m_mPageName=value;
}};
CustomLinksComponent.prototype.getReferenceLinks=function(){return(this.m_referenceArray);
};
CustomLinksComponent.prototype.setReferenceLinks=function(value){var j=0;
for(var i=0,il=value.length;
i<il;
i++){if(i%2!==0){this.m_referenceArray[j].disp=value[i];
j++;
}else{this.m_referenceArray[j]={link:value[i],disp:""};
}}};
CustomLinksComponent.prototype.getReferenceName=function(){return(this.m_referenceName);
};
CustomLinksComponent.prototype.setReferenceName=function(value){if(value>""){this.m_referenceName=value;
}};
CustomLinksComponent.prototype.loadFilterMappings=function(){this.addFilterMappingObject("REFERENCE_NAME",{setFunction:this.setReferenceName,type:"STRING",field:"FREETEXT_DESC"});
this.addFilterMappingObject("REFERENCE_LINK",{setFunction:this.setReferenceLinks,type:"ARRAY",field:"FREETEXT_DESC"});
this.addFilterMappingObject("MPAGE_NAME",{setFunction:this.setMPageName,type:"STRING",field:"FREETEXT_DESC"});
this.addFilterMappingObject("MPAGE_LINK",{setFunction:this.setMPageLinks,type:"ARRAY",field:"FREETEXT_DESC"});
this.addFilterMappingObject("FORMS_NAME",{setFunction:this.setFormsName,type:"STRING",field:"FREETEXT_DESC"});
this.addFilterMappingObject("WF_REFERENCE_NAME",{setFunction:this.setReferenceName,type:"STRING",field:"FREETEXT_DESC"});
this.addFilterMappingObject("WF_REFERENCE_LINK",{setFunction:this.setReferenceLinks,type:"ARRAY",field:"FREETEXT_DESC"});
this.addFilterMappingObject("WF_MPAGE_NAME",{setFunction:this.setMPageName,type:"STRING",field:"FREETEXT_DESC"});
this.addFilterMappingObject("WF_MPAGE_LINK",{setFunction:this.setMPageLinks,type:"ARRAY",field:"FREETEXT_DESC"});
this.addFilterMappingObject("WF_FORMS_NAME",{setFunction:this.setFormsName,type:"STRING",field:"FREETEXT_DESC"});
};
CustomLinksComponent.prototype.retrieveComponentData=function(){this.renderCustomLinks();
};
CustomLinksComponent.prototype.renderCustomLinks=function(){var component=this;
var items=component.getMenuItems();
var formItems=[];
if(items){for(var i=0,il=items.length;
i<il;
i++){formItems[i]={id:items[i].getId(),desc:items[i].getDescription()};
}}component.setFormsLinks(formItems);
var jsHTML=[];
var countText="";
try{jsHTML.push(component.createCustomLinksHTML());
MP_Util.Doc.FinalizeComponent(jsHTML.join(""),component,countText);
}catch(e){MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),"Error in createCustomLinksHTML."),component,countText);
}};
CustomLinksComponent.prototype.createCustomLinksHTML=function(){var component=this;
var cl_i18n=i18n.innov.cl_o1;
var arHTML=[];
var strErrorMessage="";
var nTotalRows=0;
var nRefCnt=0;
var strMPageViewLinkAddressDisp="";
var strChartSplit=[];
var strOrganizerSplit=[];
var strOtherSplit=[];
var nMPageCnt=0;
var nPFormCnt=0;
var criterion=component.getCriterion();
var nNumScroll=component.getScrollNumber();
var referenceAr=component.getReferenceLinks();
var referenceName=component.getReferenceName();
var mpageAr=component.getMPageLinks();
var mpageName=component.getMPageName();
var formsAr=component.getFormsLinks();
var formsName=component.getFormsName();
try{if(nNumScroll>0&&component.isScrollingEnabled()==1){nTotalRows=referenceAr.length+mpageAr.length+formsAr.length;
if(referenceAr){nTotalRows+=1;
}if(mpageAr){nTotalRows+=1;
}if(formsAr){nTotalRows+=1;
}if(nTotalRows>nNumScroll){var totalHeight=(nNumScroll*1.6)+"em;";
arHTML.push('<div style="width:100%;height:',totalHeight,'overflow:auto;overflow-x:hidden;">');
}}else{arHTML.push("<div>");
}arHTML.push('<table class="custom-link-table">');
nRefCnt=referenceAr.length;
if(nRefCnt>0){arHTML.push('<div class="sub-sec"><h3 class="sub-sec-hd"><span class="sub-sec-hd-tgl">-</span><span class="sub-sec-title">',referenceName+" ("+nRefCnt+")","</span></h3>",'<div class="sub-sec-content">');
for(var i=0;
i<nRefCnt;
i++){arHTML.push('<dl class="cl-link">',"<a class='cl-link-text' title='"+cl_i18n.TITLE_LINK+"' onclick='APPLINK(100,\""+referenceAr[i].link+'" , "");\' >',referenceAr[i].disp+"</a></dl>");
}arHTML.push("</div></div>");
}nMPageCnt=mpageAr.length;
if(nMPageCnt>0){arHTML.push('<div class="sub-sec"><h3 class="sub-sec-hd"><span class="sub-sec-hd-tgl">-</span><span class="sub-sec-title">',mpageName+" ("+nMPageCnt+")",'</span></h3><div class="sub-sec-content">');
for(var i=0;
i<nMPageCnt;
i++){strMPageViewLinkAddressDisp="";
strMPageViewLinkAddressDisp="";
strChartSplit.length=0;
strOrganizerSplit.length=0;
strOtherSplit.length=0;
arHTML.push('<dl class="cl-link">');
strMPageViewLinkAddressDisp=mpageAr[i].link;
if(strMPageViewLinkAddressDisp.indexOf("CHART")!=-1){strChartSplit=strMPageViewLinkAddressDisp.split("|");
if(strChartSplit.length>0){arHTML.push("<a href='javascript: APPLINK(0,",'"',criterion.executable,'", "/PERSONID=',criterion.person_id+".0"," /ENCNTRID=",criterion.encntr_id+".0"," /FIRSTTAB=^",strChartSplit[1],'^");',"' title='"+cl_i18n.TITLE_PMP+"' class='cl-link-text'>");
}}else{if(strMPageViewLinkAddressDisp.indexOf("ORGANIZER")!=-1){strOrganizerSplit=strMPageViewLinkAddressDisp.split("|");
if(strOrganizerSplit.length>0){arHTML.push("<a href='javascript: APPLINK(0,",'"',criterion.executable,'", "/ORGANIZERTAB=^',strOrganizerSplit[1],'^");',"' title='"+cl_i18n.TITLE_OMP+"' class='cl-link-text'>");
}}else{strMPageViewLinkAddressDisp=strMPageViewLinkAddressDisp.replace(/&#034;/g,"^");
strMPageViewLinkAddressDisp=strMPageViewLinkAddressDisp.replace(/&#039;/g,"^");
strOtherSplit=strMPageViewLinkAddressDisp.split("|");
if(strOtherSplit.length>0){if(strOtherSplit.length>2&&strOtherSplit[2]==1){if(strOtherSplit.length>3&&strOtherSplit[3]==1){arHTML.push("<a onclick='CustomLinksComponent.prototype.loadInNewWindow(\"",strOtherSplit[0],'","',strOtherSplit[1],"\")'"," title='"+cl_i18n.TITLE_PMP+"' class='cl-link-text'>");
}else{arHTML.push("<a onclick='CustomLinksComponent.prototype.loadCclNewSessionWindow(\"",strOtherSplit[0],'","',strOtherSplit[1],'","1")\''," title='"+cl_i18n.TITLE_PMP+"' class='cl-link-text'>");
}}else{arHTML.push("<a href='javascript: CCLLINK(\"",strOtherSplit[0],'","',strOtherSplit[1],'","1")\''," title='"+cl_i18n.TITLE_PMP+"' class='cl-link-text'>");
}}else{arHTML.push("<a href='javascript: APPLINK(0,",'"',criterion.executable,'", "/PERSONID=',criterion.person_id+".0"," /ENCNTRID=",criterion.encntr_id+".0"," /FIRSTTAB=^",mpageAr[i].link,'^");',"'"," title='"+cl_i18n.TITLE_PMP+"' class='cl-link-text'>");
}}}arHTML.push(mpageAr[i].disp,"</a></dl>");
}arHTML.push("</div></div>");
}nPFormCnt=formsAr.length;
if(nPFormCnt>0){arHTML.push('<div class="sub-sec"><h3 class="sub-sec-hd"><span class="sub-sec-hd-tgl">-</span><span class="sub-sec-title">',formsName+" ("+nPFormCnt+")",'</span></h3><div class="sub-sec-content">');
for(var i=0;
i<nPFormCnt;
i++){arHTML.push('<dl class="cl-link">',"<a href='javascript: MPAGES_EVENT(",'"POWERFORM","',criterion.person_id+".0","|",criterion.encntr_id+".0","|",formsAr[i].id,'|0|0"',");'"," title='"+cl_i18n.TITLE_PF+"' class='cl-link-text'>",formsAr[i].desc,"</a></dl>");
}arHTML.push("</div></div>");
}arHTML.push("</table></div>");
}catch(error){strErrorMessage+=cl_i18n.FUNCTION+": ";
strErrorMessage+="getCustomLinks\n";
strErrorMessage+=cl_i18n.ERROR+": ";
strErrorMessage+=error.message;
arHTML="";
MP_Util.LogError(strErrorMessage);
throw (error);
}return arHTML.join("");
};
CustomLinksComponent.prototype.loadCclNewSessionWindow=function(mPageReportName,mPageReportParam,mPageCclLink){var linkCall="javascript:CCLLINK('"+mPageReportName+"', '"+mPageReportParam+"', "+mPageCclLink+")";
var wParams="left=0,top=0,width=1024,height=768,toolbar=no";
javascript:CCLNEWSESSIONWINDOW(linkCall,"_self",wParams,1,1);
};
CustomLinksComponent.prototype.loadInNewWindow=function(mPageReportName,mPageReportParam){var component=this;
component.setCriterion({category_mean:""});
component.setStyles({getId:function(){return component.getComponentId();
},getComponentType:function(){return CERN_COMPONENT_TYPE_WORKFLOW;
}});
var cclParam=[mPageReportParam];
var request=new MP_Core.ScriptRequest(component,component.getComponentLoadTimerName());
request.setProgramName(mPageReportName);
request.setParameters(cclParam);
request.setName(mPageReportName);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(component,request,this.LaunchNewWindow);
};
CustomLinksComponent.prototype.LaunchNewWindow=function(reply){var response=reply.getResponse();
var newWindow=window.open("","myWindow","height=1024,width=1240,resizable=1");
newWindow.document.write("<iframe id='framIFrame' src='' frameborder='0' style='width:100%;height:100%;'></iframe>");
newWindow.document.getElementById("framIFrame").src=response.HTML;
};
MP_Util.setObjectDefinitionMapping("CUSTOM_LINKS",CustomLinksComponent);
MP_Util.setObjectDefinitionMapping("WF_CUSTOM_LINKS",CustomLinksComponent);
MP_Util.setObjectDefinitionMapping("RPHS_DECISION_SUPPORT",CustomLinksComponent);
