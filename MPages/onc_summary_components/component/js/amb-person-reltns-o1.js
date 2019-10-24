/**
 * Create the component style object which will be used to style various aspects of our component
 */
function AmbPersonReltnsComponentStyle() {
	this.initByNamespace("psrl");
}

AmbPersonReltnsComponentStyle.inherits(ComponentStyle);
/**
 * @constructor
 * Initialize the Person Relationships component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function AmbPersonReltnsComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new AmbPersonReltnsComponentStyle());
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.AMBPERSONRELTNS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.AMBPERSONRELTNS.O1 - render component");
	//make my variables and then make getters/setters
	this.psrlI18nObj;
	//do i need the form or result events?
	this.psrl_form_ev_ind = 0;
	this.psrl_ceevent_ev_ind = 0;
	//hovers
	this.tooltip = new MPageTooltip();
	//menu
	this.psrl_menu_id = "psrl_row_form_menu";
	/* default value for setter and getter */
	this.m_patreltnpf = [];
	this.m_patreltnotherce = [];
	this.m_patreltnotherceseq = [];
	this.m_patreltnrelateddisp = 0;
	this.m_patreltnvisitpersdisp = 0;
	this.m_patreltnrelatedlabel = "";
	this.m_patreltnvisitperslabel = "";
	this.m_patreltnotherreltnlabel = "";
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
AmbPersonReltnsComponent.prototype = new MPageComponent();
AmbPersonReltnsComponent.prototype.constructor = MPageComponent;
/* Supporting functions */
/**
 * Sets the Form Event Indicator. If on turn on form event delegate
 * @param {boolean} eventInd : on/off.
 */
AmbPersonReltnsComponent.prototype.setpsrlFormEventInd = function(eventInd) {
	this.psrl_form_ev_ind = eventInd;
};
/**
 * Retrieves the Form Event Indicator. If on turn on form event delegate
 * @param {string} eventInd : on/off.
 */
AmbPersonReltnsComponent.prototype.getpsrlFormEventInd = function() {
	return this.psrl_form_ev_ind;
};
/**
 * Sets the Result Event Indicator. If on turn on result event delegate
 * @param {boolean} eventInd : on/off.
 */
AmbPersonReltnsComponent.prototype.setpsrlCEEventInd = function(eventInd) {
	this.psrl_ceevent_ev_ind = eventInd;
};
/**
 * Retrieves the Result Event Indicator. If on turn on result event delegate
 * @param {string} eventInd : on/off.
 */
AmbPersonReltnsComponent.prototype.getpsrlCEEventInd = function() {
	return this.psrl_ceevent_ev_ind;
};
//for indicator
/*
 * @constructor set lifetime reltn display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbPersonReltnsComponent.prototype.setpatreltnrelateddisp = function(value) {
	this.m_patreltnrelateddisp = (value === true ? 1 : 0);
};
/*
 * @constructor set visit reltn display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbPersonReltnsComponent.prototype.setpatreltnvisitpersdisp = function(value) {
	this.m_patreltnvisitpersdisp = (value === true ? 1 : 0);
};
/*
 * @constructor get lifetime reltn display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbPersonReltnsComponent.prototype.getpatreltnrelateddisp = function() {
	return this.m_patreltnrelateddisp;
};
/*
 * @constructor get visit reltn display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbPersonReltnsComponent.prototype.getpatreltnvisitpersdisp = function() {
	return this.m_patreltnvisitpersdisp;
};
//for label
/*
 * @constructor set lifetime reltn section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbPersonReltnsComponent.prototype.setpatreltnrelatedlabel = function(value) {
	this.m_patreltnrelatedlabel = value;
};
/*
 * @constructor set lifetime reltn section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbPersonReltnsComponent.prototype.setpatreltnvisitperslabel = function(value) {
	this.m_patreltnvisitperslabel = value;
};
/*
 * @constructor set other reltn section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbPersonReltnsComponent.prototype.setpatreltnotherreltnlabel = function(value) {
	this.m_patreltnotherreltnlabel = value;
};
/*
 * @constructor get lifetime reltn section label in the component
 * @return{string} : bedrock setting value.
 */
AmbPersonReltnsComponent.prototype.getpatreltnrelatedlabel = function() {
	return this.m_patreltnrelatedlabel;
};
/*
 * @constructor get visit reltn section label in the component
 * @return{string} : bedrock setting value.
 */
AmbPersonReltnsComponent.prototype.getpatreltnvisitperslabel = function() {
	return this.m_patreltnvisitperslabel;
};
/*
 * @constructor get other reltn section label in the component
 * @return{string} : bedrock setting value.
 */
AmbPersonReltnsComponent.prototype.getpatreltnotherreltnlabel = function() {
	return this.m_patreltnotherreltnlabel;
};
//for type and eventset
/*
 * @constructor set PowerForms Add list for header in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbPersonReltnsComponent.prototype.setpatreltnpf = function(value) {
	this.m_patreltnpf = value;
};
/*
 * @constructor set clinical events types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbPersonReltnsComponent.prototype.setpatreltnotherce = function(value) {
	this.m_patreltnotherce = value;
};
/*
 * @constructor set clinical events sequence types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbPersonReltnsComponent.prototype.setpatreltnotherceseq = function(value) {
	this.m_patreltnotherceseq = value;
};
/*
 * @constructor get PowerForms Add list for header in the component
 * @return{string} : bedrock setting value.
 */
AmbPersonReltnsComponent.prototype.getpatreltnpf = function() {
	return this.m_patreltnpf;
};
/*
 * @constructor set clinical events types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbPersonReltnsComponent.prototype.getpatreltnotherce = function() {
	return this.m_patreltnotherce;
};
/*
 * @constructor get clinical events sequence types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbPersonReltnsComponent.prototype.getpatreltnotherceseq = function() {
	return this.m_patreltnotherceseq;
};
/*
 * @constructor map bedrock settings to variables
 * @return{string} : bedrock setting value.
 */
AmbPersonReltnsComponent.prototype.loadFilterMappings = function() {
	/* get type setting */
	this.addFilterMappingObject("PATRELTN_PF", {
		setFunction : this.setpatreltnpf,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("PATRELTN_OTHER_CE", {
		setFunction : this.setpatreltnotherce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("PATRELTN_OTHER_CE_SEQ", {
		setFunction : this.setpatreltnotherceseq,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	/* get all label setreginfoidentifierslabel*/
	this.addFilterMappingObject("PATRELTN_RELATED_LABEL", {
		setFunction : this.setpatreltnrelatedlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("PATRELTN_VISITPERS_LABEL", {
		setFunction : this.setpatreltnvisitperslabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("PATRELTN_OTHERRELTN_LABEL", {
		setFunction : this.setpatreltnotherreltnlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	/* get display setting */
	this.addFilterMappingObject("PATRELTN_RELATED_DISP", {
		setFunction : this.setpatreltnrelateddisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("PATRELTN_VISITPERS_DISP", {
		setFunction : this.setpatreltnvisitpersdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
};
/*
 * @constructor Handles expanding/collapsing subsections in the component
 * @param {string} subsectionid : The subsectionid string contains id of the row being expanded/collapsed.
 */
AmbPersonReltnsComponent.prototype.expandCollapsePsrlSubSections = function(subsectionid) {
	if ($('#' + subsectionid + '_rows').css('display') === 'block') {
		$('#' + subsectionid + '_rows').css('display', 'none');
		$('#' + subsectionid).attr('title', i18n.SHOW_SECTION);
		$('#' + subsectionid + '_tgl').removeClass().addClass('psrl-sub-sec-hd-tgl-close');
	}
	else {
		$('#' + subsectionid + '_rows').css('display', 'block');
		$('#' + subsectionid).attr('title', i18n.HIDE_SECTION);
		$('#' + subsectionid + '_tgl').removeClass().addClass('psrl-sub-sec-hd-tgl');
	}
};
/*
 * @constructor gets data from CCL
 */
AmbPersonReltnsComponent.prototype.retrieveComponentData = function() {
	var criterion = null;
	var request = null;
	var self = this;
	var sendAr = null;
	criterion = this.getCriterion();
	sendAr = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0",criterion.encntr_id + ".0",  criterion.position_cd + ".0",MP_Util.CreateParamArray(this.getpatreltnpf(), 1), MP_Util.CreateParamArray(this.getpatreltnotherce(), 1), MP_Util.CreateParamArray(this.getpatreltnotherceseq(), 1), this.getpatreltnrelateddisp(), this.getpatreltnvisitpersdisp()];
	MP_Core.XMLCclRequestWrapper(this, "AMB_MP_PERSON_RELTN_COMP", sendAr, true);
};
/*
 * @constructor render component content
 * @param {object} reply : JSON object returned from CCL
 */
AmbPersonReltnsComponent.prototype.renderComponent = function(reply) {
	var thiz = this;
	var numberResults = 0;
	var results = null;
	this.psrlI18nObj = i18n.discernabu.amb_person_reltns_o1;
	var criterion = this.getCriterion();
	var personcompId = this.getComponentId();
	var personcompContentElemID = 'pwx_person_reltn_scroll_div' + personcompId;
	$("#" + personcompContentElemID).off();
	var reltnHTML = [];
	var pprHvrArray = [];
	var eprHvrArray = [];
	var otherrelantionHvrArray = [];
	var otherrelantioneventHvrArray = [];
	//Store result information
	var pid = criterion.person_id;
	var eid = criterion.encntr_id;
	var uid = criterion.provider_id;
	var posid = criterion.position_cd;
	var pprcount = reply.PPR_CNT;
	var eprcount = reply.EPR_CNT;
	var ppr_hover_inex = 0;	
	var epr_hover_inex = 0;	
	
	var pwx_per_adhoc_form = [];
	// check to see if PowerForms selected for Header
	//If one display just the add icon, if multiple create drop down
	if (reply.ADD_PFORM.length > 0) {
		if (reply.ADD_PFORM.length === 1) {
			pwx_per_adhoc_form.push('<a id="'+ personcompId +'_' + reply.ADD_PFORM[0].FORM_ID + '" class="pwx_prsl_no_text_decor pwx_prsl_grey_link pwx_prsl_text pwx_prsl_form_launch" title="' + this.psrlI18nObj.AQFORM + '"> ' + '<span class="pwx-prsl_add-icon pwx_prsl_no_text_decor">&nbsp;</span></a>');
		}
		else {
			var peradhocformmenu = new Menu(this.psrl_menu_id);
			peradhocformmenu.setTypeClass("menu-page-menu");
			peradhocformmenu.setIsRootMenu(false);
			peradhocformmenu.setAnchorElementId(this.psrl_menu_id);
			peradhocformmenu.setAnchorConnectionCorner(["bottom", "right"]);
			peradhocformmenu.setContentConnectionCorner(["top", "left"]);
			peradhocformmenu.setLabel("");
			var peradhocformenuitem = [];
			var formlength = reply.ADD_PFORM.length;
			MP_MenuManager.deleteMenuObject(this.psrl_menu_id, true);
			for (var i = 0; i < formlength; i++) {
				var formid = "";
				formid = reply.ADD_PFORM[i].FORM_ID;
				peradhocformenuitem[i] = new MenuItem(reply.ADD_PFORM[i].FORM_ID);
				peradhocformenuitem[i].setLabel(reply.ADD_PFORM[i].FORM_NAME);
				peradhocformenuitem[i].setCloseOnClick(true);
				peradhocformenuitem[i].setClickFunction(function() {
					var paramString = pid + "|" + eid + "|" + this.getId() + "|" + 0.0 + "|" + 0;
					MPAGES_EVENT("POWERFORM", paramString);
					MP_MenuManager.deleteMenuObject(this.psrl_menu_id, true);
					thiz.retrieveComponentData();
				});
				peradhocformmenu.addMenuItem(peradhocformenuitem[i]);
			}
			peradhocformenuitem[reply.ADD_PFORM.length + 1] = new MenuItem("Allform" + this.psrl_menu_id);
			peradhocformenuitem[reply.ADD_PFORM.length + 1].setLabel(this.psrlI18nObj.ALLFO);
			peradhocformenuitem[reply.ADD_PFORM.length + 1].setCloseOnClick(true);
			peradhocformenuitem[reply.ADD_PFORM.length + 1].setClickFunction(function() {
				var paramString = pid + "|" + eid + "|" + 0.0 + "|" + 0.0 + "|" + 0;
				MPAGES_EVENT("POWERFORM", paramString);
				MP_MenuManager.deleteMenuObject(this.psrl_menu_id, true);
				thiz.retrieveComponentData();
			});
			peradhocformmenu.addMenuItem(peradhocformenuitem[reply.ADD_PFORM.length + 1]);
			MP_MenuManager.addMenuObject(peradhocformmenu);
			pwx_per_adhoc_form.push('<a id="'+ personcompId +'_' + 0.0 + '" class="pwx_prsl_no_text_decor pwx_prsl_grey_link pwx_prsl_text pwx_prsl_form_launch"  title="' + this.psrlI18nObj.ALLFO + '">');
			pwx_per_adhoc_form.push('<span class="pwx-prsl_add-icon-plus pwx_prsl_no_text_decor">&nbsp;</span></a>');
			pwx_per_adhoc_form.push('<a id="'+ personcompId +'_pwx_prsl_chart_menu_id" class="pwx_prsl_no_text_decor pwx_prsl_form_menu_launch" title="' + this.psrlI18nObj.AQFORM + '">');
			pwx_per_adhoc_form.push('<span class="pwx-prsl_add-icon-plus-arrow pwx_prsl_no_text_decor" id="'+ personcompId +'_pwx-prsl-alert-dpdown-id">&nbsp;</span></a>');
		}
	}
	//create the scroll div
	reltnHTML.push('<h3 class="info-hd">', this.psrlI18nObjPROVIDER_RELTN, '</h3><div id="' + personcompContentElemID + '">');
	
	//display lifetime section turned on?
	if (this.getpatreltnrelateddisp() === 1) {
		//create header ids
		var pprsec_title_id = '' + personcompId + 'pprsec';
		var pprsec_row_id = '' + personcompId + 'pprsec_rows';
		var pprsec_tgl_id = '' + personcompId + 'pprsec_tgl';
		var pwxmanagevar = "";

		//create sub section header
		var k = reply.PPR.length;
		reltnHTML.push('<dl class="psrl-nopad-info"><dt class="psrl_single_sub_sec_dt" style="font-size:11px;color:#A0A0A0;"><a id="' + pprsec_title_id + '" class="psrl_sub_sec_link psrl_sub_section_evt" title="' + i18n.HIDE_SECTION + '">', '<h3 class="sub-sec-hd"><span id="' + pprsec_tgl_id + '" class="psrl-sub-sec-hd-tgl">-</span>', '<span class="sub-sec-title">' + this.getpatreltnrelatedlabel() + '<span class="pwx_prsl_text"> (', pprcount, ')</span></span></h3></a></dt></dl>');
		reltnHTML.push('<div id="' + pprsec_row_id + '" style="display:block;">');

		if (pprcount > 0) {
			//iterate through lifetime person reltns for display
		   for (var i = 0; i < k; i++) {
			 if(reply.PPR[i].EPR_IND === 0) {
			  	var person_name_HTML = "";
				var pwx_line_ppr = "";
				var relatedhvr = "";
				var pprbirthdate = "";
				var myHvr = [];
				myHvr.length = 4;
				myHvr[0] = ["", ""];
				myHvr[0][0] = this.psrlI18nObj.TYPE + ':';
				myHvr[0][1] = reply.PPR[i].TYPE;
				myHvr[1] = ["", ""];
				myHvr[1][0] = this.psrlI18nObj.NAME + ':';
				myHvr[1][1] = reply.PPR[i].NAME;
				myHvr[2] = ["", ""];
				myHvr[2][0] = this.psrlI18nObj.DOB + ':';
				if (reply.PPR[i].DOB !== "--") {
			      var pprbirthdateUTCDate = new Date();
			      pprbirthdateUTCDate.setISO8601(reply.PPR[i].DOB);
			      pprbirthdate = pprbirthdateUTCDate.format("shortDate2");
			    } else {
			      pprbirthdate = reply.PPR[i].DOB;
		        }
		        myHvr[2][1] = pprbirthdate;
				myHvr[3] = ["", ""];
				myHvr[3][0] = this.psrlI18nObj.GENDER + ':';
				myHvr[3][1] = reply.PPR[i].GENDER;
				var hvrcnt = 4;
				//iterate through person addresses for display.
				var ppr_add_length = reply.PPR[i].ADDRESS_LIST.length;
				for (var cc = 0; cc < ppr_add_length; cc++) {
					hvrcnt++;
					myHvr.length = hvrcnt;
					myHvr[hvrcnt - 1] = ["", ""];
					myHvr[hvrcnt - 1][0] = reply.PPR[i].ADDRESS_LIST[cc].TYPE + ':';
					if (reply.PPR[i].ADDRESS_LIST[cc].EMAIL_IND === 1) {
						myHvr[hvrcnt - 1][1] = reply.PPR[i].ADDRESS_LIST[cc].LINE1;
					}
					else {
					    if(reply.PPR[i].ADDRESS_LIST[cc].LINE2 !== ","){
							pwx_line_ppr = '<br />' + reply.PPR[i].ADDRESS_LIST[cc].LINE2;
						}else{
						    pwx_line_ppr = "";
						}
						myHvr[hvrcnt - 1][1] = reply.PPR[i].ADDRESS_LIST[cc].LINE1 + pwx_line_ppr;
					}
				}
				//iterate through person phone numbers for display.
				var ppr_phone_length = reply.PPR[i].PHONE_LIST.length;
				for (var cc = 0; cc < ppr_phone_length; cc++) {
					hvrcnt++;
					myHvr.length = hvrcnt;
					myHvr[hvrcnt - 1] = ["", ""];
					myHvr[hvrcnt - 1][0] = reply.PPR[i].PHONE_LIST[cc].TYPE + ':';
					myHvr[hvrcnt - 1][1] = reply.PPR[i].PHONE_LIST[cc].NUMBER;
				}
				//if person has a record (has a person_id and user has access to at least one encounter)
			
				if (reply.PPR[i].REL_PERSON_ID !== "" && reply.PPR[i].REL_ENCOUNTER_ID !== "" && reply.PPR[i].REL_ENCOUNTER_ID !== 0.0 && reply.PPR[i].REL_PERSON_ID !== 0.0) {
				   	if (reply.PPR[i].REL_PERSON_ID !== criterion.person_id) {
					   person_name_HTML += '<a href="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + reply.PPR[i].REL_PERSON_ID + ' /ENCNTRID=' + reply.PPR[i].REL_ENCOUNTER_ID + '\')">' + reply.PPR[i].NAME + '</a>';
					}
					else {
						person_name_HTML += reply.PPR[i].NAME;
					}
				}
				else {

					person_name_HTML += reply.PPR[i].NAME;
				}
				pprHvrArray.push(myHvr);
				reltnHTML.push('<dl id="pprreltn_row_' + ppr_hover_inex + '_'+personcompId+'" class="psrl_grey_no_top_border-info psrl_small_text psrl-provider-info">');
				reltnHTML.push('<dt class="psrl_single_dt_wpad"><span class="disabled">', reply.PPR[i].TYPE + ': </span>' + person_name_HTML + '</dt></dl>');
			    ppr_hover_inex = ppr_hover_inex + 1;
			  }
			}
		}
		else {
			reltnHTML.push('<dl class="psrl_grey_border-info psrl_small_text"><dt class="psrl_single_dt_wpad"><span class="res-none">', i18n.NO_RESULTS_FOUND, '</span></dt></dl>');
		}
		reltnHTML.push('</div>');
	}
	//epr
	//is visit reltn turned on?
	if (this.getpatreltnvisitpersdisp() === 1) {
		//create header ids
		var eprsec_title_id = '' + personcompId + 'eprsec';
		var eprsec_row_id = '' + personcompId + 'eprsec_rows';
		var eprsec_tgl_id = '' + personcompId + 'eprsec_tgl';
		var pwxmanagevar = "";
		
		//create sub section header
		var j = reply.PPR.length;
	    reltnHTML.push('<dl class="psrl-nopad-info"><dt class="psrl_single_sub_sec_dt" style="font-size:11px;color:#A0A0A0;"><a id="' + eprsec_title_id + '" class="psrl_sub_sec_link psrl_sub_section_evt" title="' + i18n.HIDE_SECTION + '">', '<h3 class="sub-sec-hd"><span id="' + eprsec_tgl_id + '" class="psrl-sub-sec-hd-tgl">-</span>', '<span class="sub-sec-title">' + this.getpatreltnvisitperslabel() + '<span class="psrl_small_text"> (', eprcount, ')</span></span></h3></a></dt></dl>');
		reltnHTML.push('<div id="' + eprsec_row_id + '" style="display:block;">');

		if (eprcount > 0) {
			//iterate through visit person reltns for display.
			for (var i = 0; i < j; i++) {			  	
			  if(reply.PPR[i].EPR_IND === 1) {                	  
				var relatedhvr = "";
				var person_name_EPRHTML = "";
				var pwx_line2_epr = "";
				var eprbirthdate = "";
				var myHvr = [];
				myHvr.length = 4;
				myHvr[0] = ["", ""];
				myHvr[0][0] = this.psrlI18nObj.TYPE + ':';
				myHvr[0][1] = reply.PPR[i].TYPE;
				myHvr[1] = ["", ""];
				myHvr[1][0] = this.psrlI18nObj.NAME + ':';
				myHvr[1][1] = reply.PPR[i].NAME;
				myHvr[2] = ["", ""];
				myHvr[2][0] = this.psrlI18nObj.DOB + ':';
				if (reply.PPR[i].DOB !== "--") {
			      var eprbirthdateUTCDate = new Date();
			      eprbirthdateUTCDate.setISO8601(reply.PPR[i].DOB);
			      eprbirthdate = eprbirthdateUTCDate.format("shortDate2");
			    } else {
			      eprbirthdate = reply.PPR[i].DOB;
		        }
		        myHvr[2][1] = eprbirthdate;
				myHvr[3] = ["", ""];
				myHvr[3][0] = this.psrlI18nObj.GENDER + ':';
				myHvr[3][1] = reply.PPR[i].GENDER;
				var hvrcnt = 4;
				//iterate through person addresses for display.
				for (var cc = 0; cc < reply.PPR[i].ADDRESS_LIST.length; cc++) {
					hvrcnt++;
					myHvr.length = hvrcnt;
					myHvr[hvrcnt - 1] = ["", ""];
					myHvr[hvrcnt - 1][0] = reply.PPR[i].ADDRESS_LIST[cc].TYPE + ':';
					if (reply.PPR[i].ADDRESS_LIST[cc].EMAIL_IND === 1) {
						myHvr[hvrcnt - 1][1] = reply.PPR[i].ADDRESS_LIST[cc].LINE1;
					}
					else {
					    if(reply.PPR[i].ADDRESS_LIST[cc].LINE2 !== ","){
							pwx_line2_epr = '<br />' + reply.PPR[i].ADDRESS_LIST[cc].LINE2;
						}else{
						    pwx_line2_epr = "";
						}
						myHvr[hvrcnt - 1][1] = reply.PPR[i].ADDRESS_LIST[cc].LINE1 + pwx_line2_epr;
					}
				}
				//iterate through person phone numbers for display.
				for (var cc = 0; cc < reply.PPR[i].PHONE_LIST.length; cc++) {
					hvrcnt++;
					myHvr.length = hvrcnt;
					myHvr[hvrcnt - 1] = ["", ""];
					myHvr[hvrcnt - 1][0] = reply.PPR[i].PHONE_LIST[cc].TYPE + ':';
					myHvr[hvrcnt - 1][1] = reply.PPR[i].PHONE_LIST[cc].NUMBER;
				}
				//if person has a record (has a person_id and user has access to at least one encounter)
				if (reply.PPR[i].REL_PERSON_ID !== "" && reply.PPR[i].REL_ENCOUNTER_ID !== "" && reply.PPR[i].REL_ENCOUNTER_ID !== 0.0 && reply.PPR[i].REL_PERSON_ID !== 0.0) {
					if (reply.PPR[i].REL_PERSON_ID !== criterion.person_id) {
						person_name_EPRHTML += '<a href="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + reply.PPR[i].REL_PERSON_ID + ' /ENCNTRID=' + reply.PPR[i].REL_ENCOUNTER_ID + '\')">' + reply.PPR[i].NAME + '</a>';
					}
					else {
						person_name_EPRHTML += reply.PPR[i].NAME;
					}
				}
				else {
					person_name_EPRHTML += reply.PPR[i].NAME;
				}
				eprHvrArray.push(myHvr);
				reltnHTML.push('<dl id="eprreltn_row_' + epr_hover_inex + '_'+personcompId+'" class="psrl_grey_no_top_border-info psrl_small_text psrl-provider-info">');
				reltnHTML.push('<dt class="psrl_single_dt_wpad"><span class="disabled">', reply.PPR[i].TYPE + ': </span>' + person_name_EPRHTML + '</dt></dl>');
                epr_hover_inex = epr_hover_inex + 1; 
			  }
			}
		}
		else {
			reltnHTML.push('<dl class="psrl_grey_border-info psrl_small_text"><dt class="psrl_single_dt_wpad"><span class="res-none">', i18n.NO_RESULTS_FOUND, '</span></dt></dl>');
		}
		reltnHTML.push('</div>');
	}
	//display other events
	var clinsec_title_id = '' + personcompId + 'clinsec';
	var clinsec_row_id = '' + personcompId + 'clinsec_rows';
	var clinsec_tgl_id = '' + personcompId + 'clinsec_tgl';
	var m = reply.OTHER_EVENTS.length;
	reltnHTML.push('<dl class="psrl-nopad-info"><dt class="psrl_single_sub_sec_dt"><a id="' + clinsec_title_id + '" class="psrl_sub_sec_link psrl_sub_section_evt" title="' + i18n.HIDE_SECTION + '" >', '<h3 class="sub-sec-hd"><span id="' + clinsec_tgl_id + '" class="psrl-sub-sec-hd-tgl">-</span>', '<span class="sub-sec-title">' + this.getpatreltnotherreltnlabel() + '</span></h3></a></dt></dl><div id="' + clinsec_row_id + '" style="display:block">');

	if (m > 0) {
		//other ce
		//iterate through other clinical events for display.
		for (var cc = 0; cc < m; cc++) {
			var cehvr = "";
			var myHvr = [];
			var othereventprsnlText = "";
			myHvr.length = 4;
			myHvr[0] = ["", ""];
			myHvr[0][0] = this.psrlI18nObj.NAME + ':';
			myHvr[0][1] = reply.OTHER_EVENTS[cc].LBL;
			myHvr[1] = ["", ""];
			myHvr[1][0] = this.psrlI18nObj.RESULT + ':';
			if (reply.OTHER_EVENTS[cc].DATE_IND === 1) {
				var othereventprsnlUTCDate = new Date();
				othereventprsnlUTCDate.setISO8601(reply.OTHER_EVENTS[cc].TEXT);
				othereventprsnlText = othereventprsnlUTCDate.format("shortDate2");
			} else {
				othereventprsnlText = reply.OTHER_EVENTS[cc].TEXT;
			}
			myHvr[1][1] = othereventprsnlText;
			myHvr[2] = ["", ""];
			myHvr[2][0] = this.psrlI18nObj.DATE + ':';
			if (reply.OTHER_EVENTS[cc].RESULTED_DT_UTC.length > 0) {
				var pprbegUTCDate = new Date();
				pprbegUTCDate.setISO8601(reply.OTHER_EVENTS[cc].RESULTED_DT_UTC);
				myHvr[2][1] = pprbegUTCDate.format("shortDate2");
			} else {
				myHvr[2][1] = '--';
			}
			myHvr[3] = ["", ""];
			myHvr[3][0] = this.psrlI18nObj.RESULTED_BY + ':';
			myHvr[3][1] = reply.OTHER_EVENTS[cc].RESULTED_BY;
			otherrelantioneventHvrArray.push(myHvr);
			reltnHTML.push('<dl id="otherrelantionevent_row_' + cc + '_' + personcompId + '" class="psrl_grey_no_top_border-info psrl_small_text psrl-provider-info">');
			//check if there is an id for the result. If so add a link to launch a viewer
			if (reply.OTHER_EVENTS[cc].ID === 0) {
				//build row without events
				reltnHTML.push('<dt class="psrl_single_dt_wpad"><span class="disabled">' + reply.OTHER_EVENTS[cc].LBL + ': </span>', othereventprsnlText + '</dt>');
			} else {
				if (reply.OTHER_EVENTS[cc].FLAG === 1) {
					//build row with form event
					reltnHTML.push('<dt class="psrl_single_dt_wpad"><span class="disabled">' + reply.OTHER_EVENTS[cc].LBL + ': </span>', '<a class="psrl_result_link psrl_res_form_link"  title="', this.psrlI18nObj.VIEW_FORM, '" id="', reply.OTHER_EVENTS[cc].ID, '">', othereventprsnlText + '</a></dt>');
					this.setpsrlFormEventInd(1);
				} else {
					//build row with result event
					reltnHTML.push('<dt class="psrl_single_dt_wpad"><span class="disabled">' + reply.OTHER_EVENTS[cc].LBL + ': </span>', '<a class="psrl_result_link psrl_res_ceevent_link"  title="', this.psrlI18nObj.VIEW_RESULT, '" id="', reply.OTHER_EVENTS[cc].ID, '" >', othereventprsnlText + '</a></dt>');
					this.setpsrlCEEventInd(1);
				}
			}
			reltnHTML.push('</dl>');
		}
	} else {
		reltnHTML.push('<dl class="psrl_grey_border-info psrl_small_text"><dt class="psrl_single_dt_wpad"><span class="res-none">', i18n.NO_RESULTS_FOUND, '</span></dt></dl>');
	}
	reltnHTML.push('</div>');
	
	reltnHTML.push('</div>');

	//finalize Component
	this.finalizeComponent(reltnHTML.join(""), pwx_per_adhoc_form.join(""));
	//set div variables
	var personcompContentDiv = $("#" + personcompContentElemID);
	var personcompContentScrollDiv = document.getElementById(personcompContentElemID);
	//scrolling
	var maxResults = this.getScrollNumber();
	MP_Util.Doc.InitSectionScrolling(personcompContentScrollDiv, maxResults, "1.6");
	//events
	//create event for PowerForm drop down menu
	$(".pwx_prsl_form_menu_launch").unbind("click");
	$(".pwx_prsl_form_menu_launch").click(function() {
		var anchorElemId = $(this).attr("id");
		if (anchorElemId === peradhocformmenu.getAnchorElementId()) {
			peradhocformmenu.setAnchorElementId(thiz.psrl_menu_id);
			MP_MenuManager.closeMenuStack(thiz.psrl_menu_id);
		}
		else {
			peradhocformmenu.setAnchorElementId(anchorElemId);
			MP_MenuManager.showMenu(thiz.psrl_menu_id);
		}
	});
	//create vent for PowerForm launch from drop down menu
	$("a.pwx_prsl_form_launch").unbind("click");
	$("a.pwx_prsl_form_launch").click(function() {
	    var prsnl_form_id = $(this).attr('id').split("_");
		var paramString = pid + "|" + eid + "|" + prsnl_form_id[1] + "|" + 0.0 + "|" + 0;
		MPAGES_EVENT("POWERFORM", paramString);
		thiz.retrieveComponentData();
	});
	//activate subsections
	personcompContentDiv.on("click", "a.psrl_sub_section_evt", function(event) {
		thiz.expandCollapsePsrlSubSections($(this).attr('id'));
	});
	//activate hovers
	var elementMap = {};
	personcompContentDiv.on("mouseenter", "dl.psrl-provider-info", function(event) {
		var anchor = this;
		$(this).css("background-color", "#FFC");
		var anchorId = $(this).attr("id");
		//If there is a hover class specified, add it to the element
		$(this).addClass("mpage-tooltip-hover");
		if (!elementMap[anchorId]) {
			elementMap[anchorId] = {};
		}
		//Store of a flag that we're hovered inside this element
		elementMap[anchorId].TIMEOUT = setTimeout(function() {
			showRelationshipsHover(event, anchor);
		}, 500);
	});
	personcompContentDiv.on("mouseleave", "dl.psrl-provider-info", function(event) {
		$(this).css("background-color", "#FFF");
		$(this).removeClass("mpage-tooltip-hover");
		clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
	});
	/*
	 * @constructor Handles creating and showing hovers in the component
	 * @param {object} event : The jquery event
	 * @param {object} anchor : The element that triggered the hover.
	 */
	function showRelationshipsHover(event, anchor) {
		var jsonId = $(anchor).attr("id").split("_");
		switch (jsonId[0]) {
			case "pprreltn":
				var relantionindexarray = pprHvrArray[jsonId[2]];
				showRelationshipsHoverHTML(event, anchor, relantionindexarray);
				break;
			case "eprreltn":
				var guarantorindexarray = eprHvrArray[jsonId[2]];
				showRelationshipsHoverHTML(event, anchor, guarantorindexarray);
				break;
			case "otherrelantion":
				var otherrelantionindexarray = otherrelantionHvrArray[jsonId[2]];
				showRelationshipsHoverHTML(event, anchor, otherrelantionindexarray);
				break;
			case "otherrelantionevent":
				var otherrelantioneeventindexarray = otherrelantioneventHvrArray[jsonId[2]];
				showRelationshipsHoverHTML(event, anchor, otherrelantioneeventindexarray);
				break;
		}
	}
	/*
	 * @constructor builds hover HTML for the component
	 * @param {object} event : The jquery event
	 * @param {object} anchor : The element that triggered the hover.
	 * @param {array} RelationshipsHoverhoverarray : The Array to use when creating hover details.
	 */
	function showRelationshipsHoverHTML(event, anchor, RelationshipsHoverhoverarray) {
		var Relationshipshvr = [];
		Relationshipshvr.push('<div class="result-details pwx_prsl_result_details">');
		for (var i = 0; i < RelationshipsHoverhoverarray.length; i++) {
			Relationshipshvr.push('<dl class="Relationships-det">', '<dt><span>' + RelationshipsHoverhoverarray[i][0] + '</span></dt><dd><span>' + RelationshipsHoverhoverarray[i][1] + '</span></dd></dl>');
		}
		//Create a new tooltip
		Relationshipshvr.push('</div>');
		var Relationshipshvrhvrtooltip = thiz.tooltip;
		Relationshipshvrhvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(Relationshipshvr.join(""));
		Relationshipshvrhvrtooltip.show();
	}
	//check if form events needed
	if (this.getpsrlFormEventInd() === 1) {
		//launch forms event
		personcompContentDiv.on('click', '.psrl_res_form_link', function() {
			var formID = $(this).attr('id');
			var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + "0" + "|" + formID + "|0";
			MPAGES_EVENT("POWERFORM", paramString);
		});
	}
	//check if result events needed
	if (this.getpsrlCEEventInd() === 1) {
		//launch results detail event
		personcompContentDiv.on('click', '.psrl_res_ceevent_link', function() {
			var eventID = $(this).attr('id');
			var pwxPVViewerMPage = window.external.DiscernObjectFactory('PVVIEWERMPAGE');
			pwxPVViewerMPage.CreateEventViewer(criterion.person_id);
			pwxPVViewerMPage.AppendEvent(eventID);
			pwxPVViewerMPage.LaunchEventViewer();
		});
	}
};
MP_Util.setObjectDefinitionMapping("AMB_PATRELTN", AmbPersonReltnsComponent); 