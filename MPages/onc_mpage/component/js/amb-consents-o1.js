function AmbConsentFormsComponentStyle(){this.initByNamespace("acf");
}AmbConsentFormsComponentStyle.inherits(ComponentStyle);
function AmbConsentFormsComponent(criterion){this.setCriterion(criterion);
this.setStyles(new AmbConsentFormsComponentStyle());
this.setComponentLoadTimerName("USR:MPG.AMBCONSENTFORMS.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.AMBCONSENTFORMS.O1 - render component");
this.resultCount=0;
this.acf_menu_enabled=0;
this.acfI18nObj;
this.tooltip=new MPageTooltip();
this.m_consentspf=[];
this.m_consentspersoninfotype=[];
this.m_consentsencntrinfotype=[];
this.m_consentspprconsenttype=[];
this.m_consentsce=[];
this.m_consentsceseq=[];
this.m_consentsdocce=[];
this.m_consentsallowconsentremove=0;
this.m_consentsdocdisp=0;
this.m_consentsdoclookback=1;
this.m_consentsdoclabel="";
this.cons_adhoc_form_menu_id="cons_adhoc_form_menu";
this.setIncludeLineNumber(true);
}AmbConsentFormsComponent.prototype=new MPageComponent();
AmbConsentFormsComponent.prototype.constructor=MPageComponent;
AmbConsentFormsComponent.prototype.setconsentsallowconsentremove=function(value){this.m_consentsallowconsentremove=(value===true?1:0);
};
AmbConsentFormsComponent.prototype.setconsentsdocdisp=function(value){this.m_consentsdocdisp=(value===true?1:0);
};
AmbConsentFormsComponent.prototype.getconsentsallowconsentremove=function(){return this.m_consentsallowconsentremove;
};
AmbConsentFormsComponent.prototype.getconsentsdocdisp=function(){return this.m_consentsdocdisp;
};
AmbConsentFormsComponent.prototype.setconsentsdoclookback=function(value){this.m_consentsdoclookback=value;
};
AmbConsentFormsComponent.prototype.getconsentsdoclookback=function(){return this.m_consentsdoclookback;
};
AmbConsentFormsComponent.prototype.setconsentsdoclabel=function(value){this.m_consentsdoclabel=value;
};
AmbConsentFormsComponent.prototype.getconsentsdoclabel=function(){return this.m_consentsdoclabel;
};
AmbConsentFormsComponent.prototype.setconsentspf=function(value){this.m_consentspf=value;
};
AmbConsentFormsComponent.prototype.setconsentspersoninfotype=function(value){this.m_consentspersoninfotype=value;
};
AmbConsentFormsComponent.prototype.setconsentsencntrinfotype=function(value){this.m_consentsencntrinfotype=value;
};
AmbConsentFormsComponent.prototype.setconsentspprconsenttype=function(value){this.m_consentspprconsenttype=value;
};
AmbConsentFormsComponent.prototype.setconsentsce=function(value){this.m_consentsce=value;
};
AmbConsentFormsComponent.prototype.setconsentsceseq=function(value){this.m_consentsceseq=value;
};
AmbConsentFormsComponent.prototype.setconsentsdocce=function(value){this.m_consentsdocce=value;
};
AmbConsentFormsComponent.prototype.getconsentspf=function(value){return this.m_consentspf;
};
AmbConsentFormsComponent.prototype.getconsentspersoninfotype=function(){return this.m_consentspersoninfotype;
};
AmbConsentFormsComponent.prototype.getconsentsencntrinfotype=function(){return this.m_consentsencntrinfotype;
};
AmbConsentFormsComponent.prototype.getconsentspprconsenttype=function(){return this.m_consentspprconsenttype;
};
AmbConsentFormsComponent.prototype.getconsentsce=function(){return this.m_consentsce;
};
AmbConsentFormsComponent.prototype.getconsentsceseq=function(){return this.m_consentsceseq;
};
AmbConsentFormsComponent.prototype.getconsentsdocce=function(){return this.m_consentsdocce;
};
AmbConsentFormsComponent.prototype.loadFilterMappings=function(){this.addFilterMappingObject("CONSENTS_PF",{setFunction:this.setconsentspf,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("CONSENTS_PERSON_INFO_TYPE",{setFunction:this.setconsentspersoninfotype,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("CONSENTS_ENCNTR_INFO_TYPE",{setFunction:this.setconsentsencntrinfotype,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("CONSENTS_PPR_CONSENT_TYPE",{setFunction:this.setconsentspprconsenttype,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("CONSENTS_CE",{setFunction:this.setconsentsce,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("CONSENTS_CE_SEQ",{setFunction:this.setconsentsceseq,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("CONSENTS_DOC_CE",{setFunction:this.setconsentsdocce,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("CONSENTS_DOC_LABEL",{setFunction:this.setconsentsdoclabel,type:"STRING",field:"FREETEXT_DESC"});
this.addFilterMappingObject("CONSENTS_DOC_LOOKBACK",{setFunction:this.setconsentsdoclookback,type:"NUMBER",field:"FREETEXT_DESC"});
this.addFilterMappingObject("CONSENTS_ALLOW_CONSENT_REMOVE",{setFunction:this.setconsentsallowconsentremove,type:"Boolean",field:"FREETEXT_DESC"});
this.addFilterMappingObject("CONSENTS_DOC_DISP",{setFunction:this.setconsentsdocdisp,type:"Boolean",field:"FREETEXT_DESC"});
};
AmbConsentFormsComponent.prototype.expandCollapseCFSections=function(subsectionid){if($("#"+subsectionid+"_row").css("display")==="block"){$("#"+subsectionid+"_row").css("display","none");
$("#"+subsectionid).attr("title",i18n.SHOW_SECTION);
$("#"+subsectionid+"_tgl").removeClass().addClass("pwx-cf-sub-sec-hd-tgl-close");
}else{$("#"+subsectionid+"_row").css("display","block");
$("#"+subsectionid).attr("title",i18n.HIDE_SECTION);
$("#"+subsectionid+"_tgl").removeClass().addClass("pwx-cf-sub-sec-hd-tgl");
}};
AmbConsentFormsComponent.prototype.retrieveComponentData=function(){var criterion=null;
var request=null;
var self=this;
var sendAr=null;
criterion=this.getCriterion();
sendAr=["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",MP_Util.CreateParamArray(this.getconsentspf(),1),MP_Util.CreateParamArray(this.getconsentspersoninfotype(),1),MP_Util.CreateParamArray(this.getconsentsencntrinfotype(),1),MP_Util.CreateParamArray(this.getconsentspprconsenttype(),1),MP_Util.CreateParamArray(this.getconsentsce(),1),MP_Util.CreateParamArray(this.getconsentsceseq(),1),MP_Util.CreateParamArray(this.getconsentsdocce(),1),parseInt(this.getconsentsdoclookback(),10),this.getconsentsdocdisp()];
MP_Core.XMLCclRequestWrapper(this,"AMB_MP_CONSENTS_COMP",sendAr,true);
};
AmbConsentFormsComponent.prototype.renderComponent=function(reply){var thiz=this;
var numberActiveResults=0;
var numberInactiveResults=0;
var results=null;
var consentcompId=this.getComponentId();
var criterion=this.getCriterion();
var cfhtml=[];
var pwx_consent_adhoc_form=[];
var preconsentHvrArray=[];
var infoconsentHvrArray=[];
var documentconsentHvrArray=[];
var eventconsentHvrArray=[];
var documentsingleconsentHvrArray=[];
var pwx_consent_form_scroll_div_id="pwx_consent_form_scroll_div_"+consentcompId;
var pwx_consent_sub_title="";
var pid=criterion.person_id;
var eid=criterion.encntr_id;
var uid=criterion.provider_id;
var posid=criterion.position_cd;
this.acfI18nObj=i18n.discernabu.AMBConsentForms_O1;
if(reply.ADD_PFORM.length>0){if(reply.ADD_PFORM.length===1){pwx_consent_adhoc_form.push('<a id="'+consentcompId+"_"+reply.ADD_PFORM[0].FORM_ID+'" class="pwx_cf_no_text_decor pwx_cf_grey_link pwx_cf_small_text pwx_cf_form_launch" title="'+this.acfI18nObj.AQFORM+'"> <span class="pwx-cf_add-icon pwx_cf_no_text_decor">&nbsp;</span></a>');
}else{var consadhocformmenu=new Menu(this.cons_adhoc_form_menu_id);
consadhocformmenu.setTypeClass("menu-page-menu");
consadhocformmenu.setIsRootMenu(false);
consadhocformmenu.setAnchorElementId(this.cons_adhoc_form_menu_id);
consadhocformmenu.setAnchorConnectionCorner(["bottom","right"]);
consadhocformmenu.setContentConnectionCorner(["top","left"]);
consadhocformmenu.setLabel("");
var consadhocformenuitem=[];
var formlength=reply.ADD_PFORM.length;
MP_MenuManager.deleteMenuObject(this.cons_adhoc_form_menu_id,true);
for(var i=0;
i<formlength;
i++){var formid="";
formid=reply.ADD_PFORM[i].FORM_ID;
consadhocformenuitem[i]=new MenuItem(reply.ADD_PFORM[i].FORM_ID);
consadhocformenuitem[i].setLabel(reply.ADD_PFORM[i].FORM_NAME);
consadhocformenuitem[i].setCloseOnClick(true);
consadhocformenuitem[i].setClickFunction(function(){var paramString=pid+"|"+eid+"|"+this.getId()+"|"+0+"|"+0;
MPAGES_EVENT("POWERFORM",paramString);
MP_MenuManager.deleteMenuObject(this.cons_adhoc_form_menu_id,true);
thiz.retrieveComponentData();
});
consadhocformmenu.addMenuItem(consadhocformenuitem[i]);
}consadhocformenuitem[reply.ADD_PFORM.length+1]=new MenuItem("Allform"+this.cons_adhoc_form_menu_id);
consadhocformenuitem[reply.ADD_PFORM.length+1].setLabel(this.acfI18nObj.ALLFO);
consadhocformenuitem[reply.ADD_PFORM.length+1].setCloseOnClick(true);
consadhocformenuitem[reply.ADD_PFORM.length+1].setClickFunction(function(){var paramString=pid+"|"+eid+"|"+0+"|"+0+"|"+0;
MPAGES_EVENT("POWERFORM",paramString);
MP_MenuManager.deleteMenuObject(this.cons_adhoc_form_menu_id,true);
thiz.retrieveComponentData();
});
consadhocformmenu.addMenuItem(consadhocformenuitem[reply.ADD_PFORM.length+1]);
MP_MenuManager.addMenuObject(consadhocformmenu);
pwx_consent_adhoc_form.push('<a id="'+consentcompId+"_"+0+'" class="pwx_cf_no_text_decor pwx_cf_grey_link pwx_cf_small_text pwx_cf_form_launch"  title="'+this.acfI18nObj.ALLFO+'">');
pwx_consent_adhoc_form.push('<span class="pwx-cf_add-icon-plus pwx_cf_no_text_decor">&nbsp;</span></a>');
pwx_consent_adhoc_form.push('<a id="'+consentcompId+'_pwx_cons_chart_menu_id" class="pwx_cf_no_text_decor pwx_cf_form_menu_launch" title="'+this.acfI18nObj.AQFORM+'">');
pwx_consent_adhoc_form.push('<span class="pwx-cf_add-icon-plus-arrow pwx_cf_no_text_decor" id="'+consentcompId+'_pwx-cf-alert-dpdown-id">&nbsp;</span></a>');
}}cfhtml.push('<div class="pwx_cf_div_scroll" id='+pwx_consent_form_scroll_div_id+">");
var border_class="pwx_cf_grey_border_top_nowordwrap-info";
for(var i=0;
i<reply.PPR_CONSENTS.length;
i++){var myHvr=[];
myHvr.length=7;
myHvr[0]=["",""];
myHvr[0][0]=this.acfI18nObj.TYPE+":";
myHvr[0][1]=reply.PPR_CONSENTS[i].TYPE;
myHvr[1]=["",""];
myHvr[1][0]=this.acfI18nObj.STATUS+":";
myHvr[1][1]=reply.PPR_CONSENTS[i].STATUS;
myHvr[2]=["",""];
myHvr[2][0]=this.acfI18nObj.DATE_ENTERED+":";
var preConsentBegDt=new Date();
var preConsentBegDt_text="--";
if(reply.PPR_CONSENTS[i].BEG_DT.length>0){preConsentBegDt.setISO8601(reply.PPR_CONSENTS[i].BEG_DT);
preConsentBegDt_text=preConsentBegDt.format("shortDate2");
}else{preConsentBegDt_text="--";
}myHvr[2][1]=preConsentBegDt_text;
myHvr[3]=["",""];
myHvr[3][0]=this.acfI18nObj.REASON+":";
myHvr[3][1]=reply.PPR_CONSENTS[i].REASON_FOR;
myHvr[4]=["",""];
myHvr[4][0]=this.acfI18nObj.DOC_ON_FILE+":";
if(reply.PPR_CONSENTS[i].DOC_ON_FILE_FLAG===1){myHvr[4][1]=this.acfI18nObj.YES;
}else{if(reply.PPR_CONSENTS[i].DOC_ON_FILE_FLAG===2){myHvr[4][1]=this.acfI18nObj.NO;
}else{myHvr[4][1]="--";
}}myHvr[5]=["",""];
myHvr[5][0]=this.acfI18nObj.COMMENTS+":";
myHvr[5][1]=reply.PPR_CONSENTS[i].COMMENTS;
myHvr[6]=["",""];
myHvr[6][0]=this.acfI18nObj.UPDT_BY+":";
myHvr[6][1]=reply.PPR_CONSENTS[i].UPDATED_BY;
preconsentHvrArray.push(myHvr);
var element_id="preconsent_"+i;
cfhtml.push('<dl id="ambpreconsent_row_'+i+"_"+consentcompId+'" class="'+border_class+' amb_cf_consent-info amb_cf_prov_consent_inactive"><dt class="pwx_cf_prov_consent_text_dt"><span class="disabled">'+reply.PPR_CONSENTS[i].TYPE+": </span>",reply.PPR_CONSENTS[i].STATUS+'</dt><dt class="amb_cf_prov_consent_text_icon_dt" style="display:none;">');
if(reply.PPR_CONSENTS[i].STATUS!=="--"&&this.getconsentsallowconsentremove()===1){cfhtml.push('<a class="pwx_cf_no_text_decor amb_ccl_req_consent_updt" id='+element_id+"_"+consentcompId+">",'<span class="pwx_cf-cancel-icon">&nbsp;</span></a>');
}cfhtml.push("</dt></dl>");
border_class="pwx_cf_grey_border-nowordwrap_info";
}for(var i=0;
i<reply.INFO_CONSENTS.length;
i++){var info_status="";
if(reply.INFO_CONSENTS[i].STATUS==="1"){info_status=this.acfI18nObj.YES;
}else{if(reply.INFO_CONSENTS[i].STATUS==="2"){info_status=this.acfI18nObj.NO;
}else{info_status=reply.INFO_CONSENTS[i].STATUS;
}}var myHvr=[];
myHvr.length=3;
myHvr[0]=["",""];
myHvr[0][0]=this.acfI18nObj.TYPE+":";
myHvr[0][1]=reply.INFO_CONSENTS[i].TYPE;
myHvr[1]=["",""];
myHvr[1][0]=this.acfI18nObj.STATUS+":";
myHvr[1][1]=info_status;
myHvr[2]=["",""];
myHvr[2][0]=this.acfI18nObj.DATE_ENTERED+":";
var infoConsentBegDt=new Date();
var infoConsentBegDt_text="--";
if(reply.INFO_CONSENTS[i].BEG_DT!="--"&&reply.INFO_CONSENTS[i].BEG_DT!=""){infoConsentBegDt.setISO8601(reply.INFO_CONSENTS[i].BEG_DT);
infoConsentBegDt_text=infoConsentBegDt.format("shortDate2");
}myHvr[2][1]=infoConsentBegDt_text;
infoconsentHvrArray.push(myHvr);
var element_id="infoconsent_"+i;
cfhtml.push('<dl id="ambinfoconsent_row_'+i+"_"+consentcompId+'" class="'+border_class+' amb_cf_consent-info amb_cf_prov_consent_inactive"><dt class="pwx_cf_prov_consent_text_dt"><span class="disabled">'+reply.INFO_CONSENTS[i].TYPE+": </span>",info_status+'</dt><dt class="amb_cf_prov_consent_text_icon_dt" style="display:none;">');
if(reply.INFO_CONSENTS[i].CONSENT_ID>0&&this.getconsentsallowconsentremove()===1){cfhtml.push('<a class="pwx_cf_no_text_decor amb_ccl_req_consent_updt" id='+element_id+"_"+consentcompId+">",'<span class="pwx_cf-cancel-icon">&nbsp;</span></a>');
}cfhtml.push("</dt></dl>");
border_class="pwx_cf_grey_border-nowordwrap_info";
}for(var cc=0;
cc<reply.OTHER_EVENTS.length;
cc++){var myHvr=[];
myHvr.length=4;
var othereventconsentText="";
myHvr[0]=["",""];
myHvr[0][0]=this.acfI18nObj.NAME+":";
myHvr[0][1]=reply.OTHER_EVENTS[cc].LBL;
myHvr[1]=["",""];
myHvr[1][0]=this.acfI18nObj.RESULT+":";
if(reply.OTHER_EVENTS[cc].DATE_IND===1){var othereventconsentUTCDate=new Date();
othereventconsentUTCDate.setISO8601(reply.OTHER_EVENTS[cc].TEXT);
othereventconsentText=othereventconsentUTCDate.format("shortDate2");
}else{othereventconsentText=reply.OTHER_EVENTS[cc].TEXT;
}myHvr[1][1]=othereventconsentText;
myHvr[2]=["",""];
myHvr[2][0]=this.acfI18nObj.DT_TM+":";
if(reply.OTHER_EVENTS[cc].RESULTED_DT.length>0){var consentUTCDate=new Date();
consentUTCDate.setISO8601(reply.OTHER_EVENTS[cc].RESULTED_DT);
myHvr[2][1]=consentUTCDate.format("shortDate2");
}else{myHvr[2][1]="--";
}myHvr[3]=["",""];
myHvr[3][0]=this.acfI18nObj.RESULTED_BY+":";
myHvr[3][1]=reply.OTHER_EVENTS[cc].RESULTED_BY;
eventconsentHvrArray.push(myHvr);
cfhtml.push('<dl id="ambeventconsent_row_'+cc+"_"+consentcompId+'" class="'+border_class+' amb_cf_consent-info">');
border_class="pwx_cf_grey_border-info";
if(reply.OTHER_EVENTS[cc].ID===0){cfhtml.push('<dt class="pwx_cf_single_dt_wpad"><span class="disabled">'+reply.OTHER_EVENTS[cc].LBL+": </span>",othereventconsentText+"</dt>");
}else{if(reply.OTHER_EVENTS[cc].FLAG===1){cfhtml.push('<dt class="pwx_cf_single_dt_wpad"><span class="disabled">'+reply.OTHER_EVENTS[cc].LBL+": </span>",'<a class="pwx_cf_result_link amb_other_form_results"  title='+this.acfI18nObj.VIEW_FORM+" id="+reply.OTHER_EVENTS[cc].ID+">",othereventconsentText+"</a></dt>");
}else{cfhtml.push('<dt class="pwx_cf_single_dt_wpad"><span class="disabled">'+reply.OTHER_EVENTS[cc].LBL+": </span>",'<a class="pwx_cf_result_link amb_other_view_results"  title='+this.acfI18nObj.VIEW_RESULT+" id="+reply.OTHER_EVENTS[cc].ID+">",othereventconsentText+"</a></dt>");
}}cfhtml.push("</dl>");
}if(this.getconsentsdocdisp()===1){cfhtml.push('<dl class="pwx_cf_nopad-info"><dt class="pwx_cf_single_sub_sec_dt"><h3 class="sub-sec-hd">');
if(parseInt(this.getconsentsdoclookback(),10)>0){cfhtml.push('<span class="pwx_cf_header_black">'+this.getconsentsdoclabel()+'<span class="pwx_cf_small_text"> ('+this.acfI18nObj.LAST+" "+parseInt(this.getconsentsdoclookback(),10)+" "+this.acfI18nObj.YEARS+")</span></span></h3></dt></dl>");
}else{cfhtml.push('<span class="pwx_cf_header_black">'+this.getconsentsdoclabel()+'<span class="pwx_cf_small_text"> ('+this.acfI18nObj.ALL_DOCS+")</span></span></h3></dt></dl>");
}if(reply.DOC_TYPES.length>0){var consentsindex=0;
var consentssingleindex=0;
for(var cc=0;
cc<reply.DOC_TYPES.length;
cc++){if(reply.DOC_TYPES[cc].DOC_LIST.length>1){for(var i=0;
i<reply.DOC_TYPES[cc].DOC_LIST.length;
i++){var myHvr=[];
myHvr.length=6;
myHvr[0]=["",""];
myHvr[0][0]=this.acfI18nObj.TYPE+":";
myHvr[0][1]=reply.DOC_TYPES[cc].DOC_LIST[i].TYPE;
myHvr[1]=["",""];
myHvr[1][0]=this.acfI18nObj.SUBJECT+":";
myHvr[1][1]=reply.DOC_TYPES[cc].DOC_LIST[i].SUBJECT;
myHvr[2]=["",""];
myHvr[2][0]=this.acfI18nObj.DATE+":";
var docConsentBegDt=new Date();
var docConsentBegDt_text="--";
if(reply.DOC_TYPES[cc].DOC_LIST[i].DOC_DATE.length>0){docConsentBegDt.setISO8601(reply.DOC_TYPES[cc].DOC_LIST[i].DOC_DATE);
docConsentBegDt_text=docConsentBegDt.format("shortDate2");
}myHvr[2][1]=docConsentBegDt_text;
myHvr[3]=["",""];
myHvr[3][0]=this.acfI18nObj.STATUS+":";
myHvr[3][1]=reply.DOC_TYPES[cc].DOC_LIST[i].STATUS;
myHvr[4]=["",""];
myHvr[4][0]=this.acfI18nObj.AUTHOR+":";
myHvr[4][1]=reply.DOC_TYPES[cc].DOC_LIST[i].AUTHOR;
myHvr[5]=["",""];
myHvr[5][0]=this.acfI18nObj.UPDT_DT+":";
var updtConsentBegDt=new Date();
var updtConsentBegDt_text="--";
if(reply.DOC_TYPES[cc].DOC_LIST[i].UPDATE_DT.length>0){updtConsentBegDt.setISO8601(reply.DOC_TYPES[cc].DOC_LIST[i].UPDATE_DT);
updtConsentBegDt_text=updtConsentBegDt.format("shortDate2");
}myHvr[5][1]=updtConsentBegDt_text;
documentconsentHvrArray.push(myHvr);
if(i===0){var condoc_title_id=consentcompId+"_"+cc;
var condoc_row_id=consentcompId+"_"+cc+"_row";
var condoc_tgl_id=consentcompId+"_"+cc+"_tgl";
cfhtml.push('<dl id="ambdocumentconsent_row_'+consentsindex+"_"+consentcompId+'" class="pwx_cf_nopad_enc-info pwx_cf_grey_border-info amb_cf_consent-info"><dt class="pwx_cf_2_col_name_consentdoc">','<a class="pwx_cf_sub_sub_sec_link amb_cf_expand_collapse" id="'+condoc_title_id+'"> ','<span id="'+condoc_tgl_id+'" class="pwx-cf-sub-sec-hd-tgl-close">-</span></a>','<a class="pwx_cf_result_link amb_cf_result_link" title='+this.acfI18nObj.VIEW_DOC+" id="+reply.DOC_TYPES[cc].DOC_LIST[i].EVENT_ID+"> ",reply.DOC_TYPES[cc].DOC_LIST[i].TYPE,'</a></dt><dt class="pwx_cf_2_col_date_consentdoc disabled pwx_cf_small_text">'+docConsentBegDt_text+"</dt></dl>",'<div id="'+condoc_row_id+'" style="display:none">');
}else{cfhtml.push('<dl id="ambdocumentconsent_row_'+consentsindex+"_"+consentcompId+'" class="pwx_cf_grey_border-info pwx_cf_small_text amb_cf_consent-info"><dt class="pwx_cf_2_col_name_consentdoc"><span style="padding-left:20px;">','<a class="pwx_cf_result_link amb_cf_result_link" title='+this.acfI18nObj.VIEW_DOC+" id="+reply.DOC_TYPES[cc].DOC_LIST[i].EVENT_ID+"> ",reply.DOC_TYPES[cc].DOC_LIST[i].TYPE,'</a></span></dt><dt class="pwx_cf_2_col_date_consentdoc disabled pwx_cf_small_text">'+docConsentBegDt_text+"</dt></dl>");
}consentsindex=consentsindex+1;
}cfhtml.push("</div>");
}else{var myHvr=[];
myHvr.length=6;
myHvr[0]=["",""];
myHvr[0][0]=this.acfI18nObj.TYPE+":";
myHvr[0][1]=reply.DOC_TYPES[cc].DOC_LIST[0].TYPE;
myHvr[1]=["",""];
myHvr[1][0]=this.acfI18nObj.SUBJECT+":";
myHvr[1][1]=reply.DOC_TYPES[cc].DOC_LIST[0].SUBJECT;
myHvr[2]=["",""];
myHvr[2][0]=this.acfI18nObj.DATE+":";
var docConsentBegDt=new Date();
var docConsentBegDt_text="--";
if(reply.DOC_TYPES[cc].DOC_LIST[0].DOC_DATE.length>0){docConsentBegDt.setISO8601(reply.DOC_TYPES[cc].DOC_LIST[0].DOC_DATE);
docConsentBegDt_text=docConsentBegDt.format("shortDate2");
}myHvr[2][1]=docConsentBegDt_text;
myHvr[3]=["",""];
myHvr[3][0]=this.acfI18nObj.STATUS+":";
myHvr[3][1]=reply.DOC_TYPES[cc].DOC_LIST[0].STATUS;
myHvr[4]=["",""];
myHvr[4][0]=this.acfI18nObj.AUTHOR+":";
myHvr[4][1]=reply.DOC_TYPES[cc].DOC_LIST[0].AUTHOR;
myHvr[5]=["",""];
myHvr[5][0]=this.acfI18nObj.UPDT_DT+":";
var updtConsentBegDt=new Date();
var updtConsentBegDt_text="--";
if(reply.DOC_TYPES[cc].DOC_LIST[0].UPDATE_DT.length>0){updtConsentBegDt.setISO8601(reply.DOC_TYPES[cc].DOC_LIST[0].UPDATE_DT);
updtConsentBegDt_text=updtConsentBegDt.format("shortDate2");
}myHvr[5][1]=updtConsentBegDt_text;
documentsingleconsentHvrArray.push(myHvr);
cfhtml.push('<dl id="ambdocumentsingleconsent_row_'+consentssingleindex+"_"+consentcompId+'" class="pwx_cf_grey_border-info amb_cf_consent-info"><dt class="pwx_cf_2_col_name_consentdoc">','<a class="pwx_cf_result_link amb_cf_result_link" title='+this.acfI18nObj.VIEW_DOC+" id="+reply.DOC_TYPES[cc].DOC_LIST[0].EVENT_ID+"> ",reply.DOC_TYPES[cc].DOC_LIST[0].TYPE,'</a></dt><dt class="pwx_cf_2_col_date_consentdoc disabled pwx_cf_small_text">'+docConsentBegDt_text+"</dt></dl>");
consentssingleindex=consentssingleindex+1;
}}}else{cfhtml.push('<dl class="pwx_cf_grey_border-info"><dt class="pwx_cf_single_dt_wpad"><span class="res-none">'+i18n.NO_RESULTS_FOUND+"</span></dt></dl>");
}}cfhtml.push("</div>");
this.finalizeComponent(cfhtml.join(""),pwx_consent_adhoc_form.join(""));
var maxResults=this.getScrollNumber();
var containerScrollDiv=document.getElementById(pwx_consent_form_scroll_div_id);
MP_Util.Doc.InitSectionScrolling(containerScrollDiv,maxResults,"1.6");
var concat_cf_scroll_div_id=$("#"+pwx_consent_form_scroll_div_id);
$(".pwx_cf_form_menu_launch").unbind("click");
$(".pwx_cf_form_menu_launch").click(function(){var anchorElemId=$(this).attr("id");
if(anchorElemId===consadhocformmenu.getAnchorElementId()){consadhocformmenu.setAnchorElementId(thiz.cons_adhoc_form_menu_id);
MP_MenuManager.closeMenuStack(thiz.cons_adhoc_form_menu_id);
}else{consadhocformmenu.setAnchorElementId(anchorElemId);
MP_MenuManager.showMenu(thiz.cons_adhoc_form_menu_id);
}});
$("a.pwx_cf_form_launch").unbind("click");
$("a.pwx_cf_form_launch").click(function(){var consent_form_id=$(this).attr("id").split("_");
var paramString=pid+"|"+eid+"|"+consent_form_id[1]+"|"+0+"|"+0;
MPAGES_EVENT("POWERFORM",paramString);
thiz.retrieveComponentData();
});
concat_cf_scroll_div_id.off("click","a.amb_cf_expand_collapse");
concat_cf_scroll_div_id.on("click","a.amb_cf_expand_collapse",function(event){var row_id=$(this).attr("id");
thiz.expandCollapseCFSections(row_id);
});
concat_cf_scroll_div_id.off("click","a.amb_cf_result_link");
concat_cf_scroll_div_id.on("click","a.amb_cf_result_link",function(event){var link_id=$(this).attr("id");
pwx_doc_view_launch(criterion.person_id,link_id);
});
concat_cf_scroll_div_id.off("click","a.amb_other_form_results");
concat_cf_scroll_div_id.on("click","a.amb_other_form_results",function(event){var link_id=$(this).attr("id");
pwx_form_launch(criterion.person_id,criterion.encntr_id,0,link_id,0);
});
concat_cf_scroll_div_id.off("click","a.amb_other_view_results");
concat_cf_scroll_div_id.on("click","a.amb_other_view_results",function(event){var link_id=$(this).attr("id");
pwx_result_view_launch(criterion.person_id,link_id);
});
concat_cf_scroll_div_id.off("click","a.amb_ccl_req_consent_updt");
concat_cf_scroll_div_id.on("click","a.amb_ccl_req_consent_updt",function(event){var type_id=$(this).attr("id");
var itr=type_id.split("_");
var ctr=parseInt(itr[1],10);
if(ctr>=0){if(itr[0]==="infoconsent"||itr[0]==="preconsent"){var html_text=thiz.acfI18nObj.UNCHARTCMNT+"?";
MP_ModalDialog.deleteModalDialogObject("Amb_ConsentinfoModal");
var ConsentinfoModalobj=new ModalDialog("Amb_ConsentinfoModal").setHeaderTitle(thiz.acfI18nObj.UNCHARTCMNT).setTopMarginPercentage(20).setRightMarginPercentage(35).setBottomMarginPercentage(30).setLeftMarginPercentage(35).setIsBodySizeFixed(true).setHasGrayBackground(true).setIsFooterAlwaysShown(true);
ConsentinfoModalobj.setBodyDataFunction(function(modalObj){modalObj.setBodyHTML('<div style="padding-top:10px;"><p class="pwx_cf_small_text">'+html_text+"</p></div>");
});
var closebtn=new ModalButton("addCancel");
closebtn.setText(thiz.acfI18nObj.CANCEL).setCloseOnClick(true);
var removebtn=new ModalButton("addCancel");
removebtn.setText(thiz.acfI18nObj.UNCHART).setCloseOnClick(true).setOnClickFunction(function(){var sendArr=[];
var request=null;
var prgname="";
if(itr[0]==="infoconsent"){sendArr.push("^MINE^",reply.INFO_CONSENTS[ctr].CONSENT_ID+".0",reply.INFO_CONSENTS[ctr].TABLE_TYPE,criterion.provider_id+".0");
prgname="AMB_MP_INACTIVATE_CONSENT_ROW";
}else{sendArr.push("^MINE^",reply.PPR_CONSENTS[ctr].TYPE_CD,criterion.person_id,reply.PPR_CONSENTS[ctr].ORG_ID,criterion.encntr_id,criterion.provider_id);
prgname="AMB_MP_INACTIVATE_CONSENT";
}request=new MP_Core.ScriptRequest(thiz,thiz.getComponentLoadTimerName());
request.setProgramName(prgname);
request.setParameters(sendArr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(thiz,request,function(reply){var pwxdata=reply.getResponse();
if(pwxdata.STATUS_DATA.STATUS!=="S"){var error_text=thiz.acfI18nObj.ERRORMSG+pwxdata.STATUS_DATA.STATUS+thiz.acfI18nObj.REQTEXT+pwxdata.STATUS_DATA.REQUESTTEXT;
MP_ModalDialog.deleteModalDialogObject("Amb_consentinfoFailModal");
var ConsentinfoFailModalobj=new ModalDialog("ConsentinfoFailModal").setHeaderTitle('<span class="pwx_alert">'+thiz.acfI18nObj.ERRORTEXT+"</span>").setTopMarginPercentage(20).setRightMarginPercentage(35).setBottomMarginPercentage(30).setLeftMarginPercentage(35).setIsBodySizeFixed(true).setHasGrayBackground(true).setIsFooterAlwaysShown(true);
ConsentinfoFailModalobj.setBodyDataFunction(function(modalObj){modalObj.setBodyHTML('<div style="padding-top:10px;"><p class="pwx_small_text">'+error_text+"</p></div>");
});
var closebtn=new ModalButton("addCancel");
closebtn.setText(thiz.acfI18nObj.OKTEXT).setCloseOnClick(true);
ConsentinfoFailModalobj.addFooterButton(closebtn);
MP_ModalDialog.addModalDialogObject(ConsentinfoFailModalobj);
MP_ModalDialog.showModalDialog("ConsentinfoFailModal");
}else{setTimeout(function(){thiz.retrieveComponentData();
},500);
}});
});
ConsentinfoModalobj.addFooterButton(removebtn);
ConsentinfoModalobj.addFooterButton(closebtn);
MP_ModalDialog.addModalDialogObject(ConsentinfoModalobj);
MP_ModalDialog.showModalDialog("Amb_ConsentinfoModal");
}}});
var elementMap={};
concat_cf_scroll_div_id.off("mouseenter","dl.amb_cf_consent-info");
concat_cf_scroll_div_id.off("mouseleave","dl.amb_cf_consent-info");
concat_cf_scroll_div_id.on("mouseenter","dl.amb_cf_consent-info",function(event){var anchor=this;
$(this).css("background-color","#FFFCE0");
var anchorId=$(this).attr("id");
$(this).addClass("mpage-tooltip-hover");
if(!elementMap[anchorId]){elementMap[anchorId]={};
}elementMap[anchorId].TIMEOUT=setTimeout(function(){ambShowconsentHover(event,anchor);
},500);
});
concat_cf_scroll_div_id.on("mouseleave","dl.amb_cf_consent-info",function(event){$(this).css("background-color","#FFF");
$(this).removeClass("mpage-tooltip-hover");
clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
});
function pwx_result_view_launch(persId,eventId){var pwxPVViewerMPage=window.external.DiscernObjectFactory("PVVIEWERMPAGE");
pwxPVViewerMPage.CreateEventViewer(persId);
pwxPVViewerMPage.AppendEvent(eventId);
pwxPVViewerMPage.LaunchEventViewer();
}function pwx_doc_view_launch(persId,eventId){var pwxPVViewerMPage=window.external.DiscernObjectFactory("PVVIEWERMPAGE");
pwxPVViewerMPage.CreateDocViewer(persId);
pwxPVViewerMPage.AppendDocEvent(eventId);
pwxPVViewerMPage.LaunchDocViewer();
}function pwx_form_launch(persId,encntrId,formId,activityId,chartMode){var paramString=persId+"|"+encntrId+"|"+formId+"|"+activityId+"|"+chartMode;
MPAGES_EVENT("POWERFORM",paramString);
thiz.retrieveComponentData();
}function ambShowconsentHover(event,anchor){var jsonId=$(anchor).attr("id").split("_");
switch(jsonId[0]){case"ambpreconsent":var preconsentindexarray=preconsentHvrArray[jsonId[2]];
ambShowconsentHoverHTML(event,anchor,preconsentindexarray);
break;
case"ambinfoconsent":var infoconsentindexarray=infoconsentHvrArray[jsonId[2]];
ambShowconsentHoverHTML(event,anchor,infoconsentindexarray);
break;
case"ambeventconsent":var eventconsentindexarray=eventconsentHvrArray[jsonId[2]];
ambShowconsentHoverHTML(event,anchor,eventconsentindexarray);
break;
case"ambdocumentconsent":var documentconsentHvrArrayindexarray=documentconsentHvrArray[jsonId[2]];
ambShowconsentHoverHTML(event,anchor,documentconsentHvrArrayindexarray);
break;
case"ambdocumentsingleconsent":var singleconsentHvrArrayindexarray=documentsingleconsentHvrArray[jsonId[2]];
ambShowconsentHoverHTML(event,anchor,singleconsentHvrArrayindexarray);
break;
}}function ambShowconsentHoverHTML(event,anchor,Consenthoverarray){var Consenthvr=[];
Consenthvr.push('<div class="result-details pwx_cf_result_details">');
for(var i=0;
i<Consenthoverarray.length;
i++){Consenthvr.push('<dl class="Consenthover-det">',"<dt><span>"+Consenthoverarray[i][0]+"</span></dt><dd><span>"+Consenthoverarray[i][1]+"</span></dd></dl>");
}Consenthvr.push("</div>");
var Consenthvrhvrtooltip=thiz.tooltip;
Consenthvrhvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(Consenthvr.join(""));
Consenthvrhvrtooltip.show();
$("html").css("overflow","hidden");
}$(".amb_cf_prov_consent_inactive").bind("mouseover",function(){$(this).children(".amb_cf_prov_consent_text_icon_dt").css("display","block");
});
$(".amb_cf_prov_consent_inactive").bind("mouseout",function(){$(this).children(".amb_cf_prov_consent_text_icon_dt").css("display","none");
});
};
MP_Util.setObjectDefinitionMapping("AMB_CONSENTS",AmbConsentFormsComponent);
