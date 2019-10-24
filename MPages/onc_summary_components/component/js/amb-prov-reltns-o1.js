/**
 * Create the component style object which will be used to style various aspects of our component
 */
function AmbProviderReltnsComponentStyle() {
	this.initByNamespace("pvrl");
}
AmbProviderReltnsComponentStyle.inherits(ComponentStyle);
/**
 * @constructor
 * Initialize the Provider Relationships component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function AmbProviderReltnsComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new AmbProviderReltnsComponentStyle());
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.AMBPROVRELTNS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.AMBPROVRELTNS.O1 - render component");
	//make my variables and then make getters/setters
	this.pvrlI18nObj;
	//do i need the form or result events?
	this.pvrl_form_ev_ind = 0;
	this.pvrl_ceevent_ev_ind = 0;
	//hovers
	this.tooltip = new MPageTooltip();
	//menu
	this.prov_adhoc_form_menu_id = "pvrl_row_form_menu";
	/* default value for setter and getter */
	this.m_provreltnpf = [];
	this.m_provreltnpprtypes = [];
	this.m_provreltneprtypes = [];
	this.m_provreltnotherce = [];
	this.m_provreltnotherceseq = [];
	this.m_provreltnallowinactivate = 0;
	this.m_provreltnpprdisp = 0;
	this.m_provreltneprdisp = 0;
	this.m_provreltnpprlabel = "";
	this.m_provreltneprlabel = "";
	this.m_provreltnothercelabel = "";
}
/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
AmbProviderReltnsComponent.prototype = new MPageComponent();
AmbProviderReltnsComponent.prototype.constructor = MPageComponent;
/* Supporting functions */
//for indicator
/*
 * @constructor set allow relationship removal indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbProviderReltnsComponent.prototype.setprovreltnallowinactivate = function(value) {
	this.m_provreltnallowinactivate = (value === true ? 1 : 0);
};
/*
 * @constructor set lifetime reltn display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbProviderReltnsComponent.prototype.setprovreltnpprdisp = function(value) {
	this.m_provreltnpprdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set encounter reltn display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbProviderReltnsComponent.prototype.setprovreltneprdisp = function(value) {
	this.m_provreltneprdisp = (value === true ? 1 : 0);
};
/*
 * @constructor get allow relationship removal indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.getprovreltnallowinactivate = function() {
	return this.m_provreltnallowinactivate;
};
/*
 * @constructor get lifetime reltn display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.getprovreltnpprdisp = function() {
	return this.m_provreltnpprdisp;
};
/*
 * @constructor get encounter reltn display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.getprovreltneprdisp = function() {
	return this.m_provreltneprdisp;
};
//for label
/*
 * @constructor set lifetime reltn section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbProviderReltnsComponent.prototype.setprovreltnpprlabel = function(value) {
	this.m_provreltnpprlabel = value;
};
/*
 * @constructor set encounter reltn section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbProviderReltnsComponent.prototype.setprovreltneprlabel = function(value) {
	this.m_provreltneprlabel = value;
};
/*
 * @constructor set other reltns clinical event section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbProviderReltnsComponent.prototype.setprovreltnothercelabel = function(value) {
	this.m_provreltnothercelabel = value;
};
/*
 * @constructor get lifetime reltn section label in the component
 * @return{string} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.getprovreltnpprlabel = function() {
	return this.m_provreltnpprlabel;
};
/*
 * @constructor get encounter reltn section label in the component
 * @return{string} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.getprovreltneprlabel = function() {
	return this.m_provreltneprlabel;
};
/*
 * @constructor get other reltns clinical event section label in the component
 * @return{string} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.getprovreltnothercelabel = function() {
	return this.m_provreltnothercelabel;
};
//for type and eventset
/*
 * @constructor set PowerForms Add list for header in the component
 * @return{string} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.setprovreltnpf = function(value) {
	this.m_provreltnpf = value;
};
/*
 * @constructor set lifetime reltns types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbProviderReltnsComponent.prototype.setprovreltnpprtypes = function(value) {
	this.m_provreltnpprtypes = value;
};
/*
 * @constructor set visit reltns types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbProviderReltnsComponent.prototype.setprovreltneprtypes = function(value) {
	this.m_provreltneprtypes = value;
};
/*
 * @constructor set other reltns clinical event types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbProviderReltnsComponent.prototype.setprovreltnotherce = function(value) {
	this.m_provreltnotherce = value;
};
/*
 * @constructor set other reltns clinical event sequence types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbProviderReltnsComponent.prototype.setprovreltnotherceseq = function(value) {
	this.m_provreltnotherceseq = value;
};
/*
 * @constructor get PowerForms Add list for header in the component
 * @return{string} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.getprovreltnpf = function() {
	return this.m_provreltnpf;
};
/*
 * @constructor get lifetime reltns types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.getprovreltnpprtypes = function() {
	return this.m_provreltnpprtypes;
};
/*
 * @constructor get visit reltns types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.getprovreltneprtypes = function() {
	return this.m_provreltneprtypes;
};
/*
 * @constructor get other reltns clinical event types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.getprovreltnotherce = function() {
	return this.m_provreltnotherce;
};
/*
 * @constructor get other reltns clinical event sequence types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbProviderReltnsComponent.prototype.getprovreltnotherceseq = function() {
	return this.m_provreltnotherceseq;
};
/**
 * Sets the Form Event Indicator. If on turn on form event delegate
 * @param {boolean} eventInd : on/off.
 */
AmbProviderReltnsComponent.prototype.setpvrlFormEventInd = function(eventInd) {
	this.pvrl_form_ev_ind = eventInd;
};
/**
 * Retrieves the Form Event Indicator. If on turn on form event delegate
 * @param {string} eventInd : on/off.
 */
AmbProviderReltnsComponent.prototype.getpvrlFormEventInd = function() {
	return this.pvrl_form_ev_ind;
};
/**
 * Sets the Result Event Indicator. If on turn on result event delegate
 * @param {boolean} eventInd : on/off.
 */
AmbProviderReltnsComponent.prototype.setpvrlCEEventInd = function(eventInd) {
	this.pvrl_ceevent_ev_ind = eventInd;
};
/**
 * Retrieves the Result Event Indicator. If on turn on result event delegate
 * @param {string} eventInd : on/off.
 */
AmbProviderReltnsComponent.prototype.getpvrlCEEventInd = function() {
	return this.pvrl_ceevent_ev_ind;
};
/*
 * @constructor Handles expanding/collapsing subsections in the component
 * @param {string} subsectionid : The subsectionid string contains id of the row being expanded/collapsed.
 */
AmbProviderReltnsComponent.prototype.expandCollapsePvrlSubSections = function(subsectionid) {
	if ($('#' + subsectionid + '_rows').css('display') === 'block') {
		$('#' + subsectionid + '_rows').css('display', 'none');
		$('#' + subsectionid).attr('title', i18n.SHOW_SECTION);
		$('#' + subsectionid + '_tgl').removeClass().addClass('pvrl-sub-sec-hd-tgl-close');
	}
	else {
		$('#' + subsectionid + '_rows').css('display', 'block');
		$('#' + subsectionid).attr('title', i18n.HIDE_SECTION);
		$('#' + subsectionid + '_tgl').removeClass().addClass('pvrl-sub-sec-hd-tgl');
	}

};
/* pull out the bedrock setting */
/*
 * @constructor map bedrock settings to variables
 */
AmbProviderReltnsComponent.prototype.loadFilterMappings = function() {
	/* get type setting */
	this.addFilterMappingObject("PROVRELTN_PF", {
		setFunction : this.setprovreltnpf,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("PROVRELTN_PPR_TYPES", {
		setFunction : this.setprovreltnpprtypes,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("PROVRELTN_EPR_TYPES", {
		setFunction : this.setprovreltneprtypes,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("PROVRELTN_PF_GRID_CE", {
		setFunction : this.setprovreltnpfgridce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("PROVRELTN_OTHER_CE", {
		setFunction : this.setprovreltnotherce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("PROVRELTN_OTHER_CE_SEQ", {
		setFunction : this.setprovreltnotherceseq,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	/* get all label setreginfoidentifierslabel*/
	this.addFilterMappingObject("PROVRELTN_PPR_LABEL", {
		setFunction : this.setprovreltnpprlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("PROVRELTN_EPR_LABEL", {
		setFunction : this.setprovreltneprlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});	
	this.addFilterMappingObject("PROVRELTN_OTHER_CE_LABEL", {
		setFunction : this.setprovreltnothercelabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	/* get display setting */
	this.addFilterMappingObject("PROVRELTN_ALLOWINACTIVATE", {
		setFunction : this.setprovreltnallowinactivate,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("PROVRELTN_PPR_DISP", {
		setFunction : this.setprovreltnpprdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("PROVRELTN_EPR_DISP", {
		setFunction : this.setprovreltneprdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
};
/*
 * @constructor retrive data from ccl for component
 */
AmbProviderReltnsComponent.prototype.retrieveComponentData = function() {
	var criterion = null;
	var request = null;
	var self = this;
	var sendAr = null;
	criterion = this.getCriterion();
	sendAr = ["^MINE^", criterion.person_id + ".0",  criterion.provider_id + ".0",criterion.encntr_id + ".0", criterion.position_cd + ".0", MP_Util.CreateParamArray(this.getprovreltnpf(), 1), MP_Util.CreateParamArray(this.getprovreltnpprtypes(), 1), MP_Util.CreateParamArray(this.getprovreltneprtypes(), 1), MP_Util.CreateParamArray(this.getprovreltnotherce(), 1), MP_Util.CreateParamArray(this.getprovreltnotherceseq(), 1), this.getprovreltneprdisp(), this.getprovreltnpprdisp()];
 	MP_Core.XMLCclRequestWrapper(this, "AMB_MP_PROV_RELTN_COMP", sendAr, true);
};
/*
 * @constructor render the component content
 * @param {object} reply : reply is the data JSON that CCL sent us back
 */
AmbProviderReltnsComponent.prototype.renderComponent = function(reply) {
	var thiz = this;
	var numberResults = 0;
	var results = null;
	this.pvrlI18nObj = i18n.discernabu.amb_prov_reltns_o1;
	var criterion = this.getCriterion();
	var provcompId = this.getComponentId();
	var provcompContentElemID = 'pwx_prov_reltn_scroll_div' + provcompId;
	$("#" + provcompContentElemID).off();
	var ppractiveHvrArray = [];
	var pprinactiveHvrArray = [];
	var epractiveHvrArray = [];
	var eprinactiveHvrArray = [];
	var gridproviderHvrArray = [];
	var eventproviderHvrArray = [];
	var provHTML = [];
	var pid = criterion.person_id;
	var eid = criterion.encntr_id;
	var uid = criterion.provider_id;
	var posid = criterion.position_cd;
	var pwx_prov_adhoc_form = [];
	// check to see if PowerForms selected for Header
	//If one display just the add icon, if multiple create drop down
	if (reply.ADD_PFORM.length > 0) {
		if (reply.ADD_PFORM.length === 1) {
			pwx_prov_adhoc_form.push('<a id="'+ provcompId +'_' + reply.ADD_PFORM[0].FORM_ID + '" class="pwx_pr_no_text_decor pwx_pr_grey_link pvrl_small_text pwx_pr_form_launch" title="' + this.pvrlI18nObj.AQFORM + '"> ' + '<span class="pwx-pr_add-icon pwx_pr_no_text_decor">&nbsp;</span></a>');
		}
		else {
			var provadhocformmenu = new Menu(this.prov_adhoc_form_menu_id);
			provadhocformmenu.setTypeClass("menu-page-menu");
			provadhocformmenu.setIsRootMenu(false);
			provadhocformmenu.setAnchorElementId(this.prov_adhoc_form_menu_id);
			provadhocformmenu.setAnchorConnectionCorner(["bottom", "right"]);
			provadhocformmenu.setContentConnectionCorner(["top", "left"]);
			provadhocformmenu.setLabel("");
			var provadhocformenuitem = [];
			var formlength = reply.ADD_PFORM.length;
			MP_MenuManager.deleteMenuObject(this.prov_adhoc_form_menu_id, true);
			for (var i = 0; i < formlength; i++) {
				var formid = "";
				formid = reply.ADD_PFORM[i].FORM_ID;
				provadhocformenuitem[i] = new MenuItem(reply.ADD_PFORM[i].FORM_ID);
				provadhocformenuitem[i].setLabel(reply.ADD_PFORM[i].FORM_NAME);
				provadhocformenuitem[i].setCloseOnClick(true);
				provadhocformenuitem[i].setClickFunction(function() {
					var paramString = pid + "|" + eid + "|" + this.getId() + "|" + 0.0 + "|" + 0;
					MPAGES_EVENT("POWERFORM", paramString);
					MP_MenuManager.deleteMenuObject(this.prov_adhoc_form_menu_id, true);
					thiz.retrieveComponentData();
				});
				provadhocformmenu.addMenuItem(provadhocformenuitem[i]);
			}
			provadhocformenuitem[reply.ADD_PFORM.length + 1] = new MenuItem("Allform" + this.prov_adhoc_form_menu_id);
			provadhocformenuitem[reply.ADD_PFORM.length + 1].setLabel(this.pvrlI18nObj.ALLFO);
			provadhocformenuitem[reply.ADD_PFORM.length + 1].setCloseOnClick(true);
			provadhocformenuitem[reply.ADD_PFORM.length + 1].setClickFunction(function() {
				var paramString = pid + "|" + eid + "|" + 0.0 + "|" + 0.0 + "|" + 0;
				MPAGES_EVENT("POWERFORM", paramString);
				MP_MenuManager.deleteMenuObject(this.prov_adhoc_form_menu_id, true);
				thiz.retrieveComponentData();
			});
			provadhocformmenu.addMenuItem(provadhocformenuitem[reply.ADD_PFORM.length + 1]);
			MP_MenuManager.addMenuObject(provadhocformmenu);

			pwx_prov_adhoc_form.push('<a id="'+ provcompId +'_' + 0.0 + '" class="pwx_pr_no_text_decor pwx_pr_grey_link pvrl_small_text pwx_pr_form_launch"  title="' + this.pvrlI18nObj.ALLFO + '">');
			pwx_prov_adhoc_form.push('<span class="pwx-pr_add-icon-plus pwx_pr_no_text_decor">&nbsp;</span></a>');
			pwx_prov_adhoc_form.push('<a id="'+ provcompId +'_pwx_pr_chart_menu_id" class="pwx_pr_no_text_decor pwx_pr_form_menu_launch" title="' + this.pvrlI18nObj.AQFORM + '">');
			pwx_prov_adhoc_form.push('<span class="pwx-pr_add-icon-plus-arrow pwx_pr_no_text_decor" id="'+ provcompId +'_pwx-pr-alert-dpdown-id">&nbsp;</span></a>');
		}
	}

	//Store result information
	//create the scroll div
	provHTML.push('<h3 class="info-hd">', this.pvrlI18nObjPROVIDER_RELTN, '</h3><div id="' + provcompContentElemID + '">');
	
	//person prsnl relationships ppr
	if (this.getprovreltnpprdisp() === 1) {
		//create header ids
		var pprsec_title_id = '' + provcompId + 'pprsec';
		var pprsec_row_id = '' + provcompId + 'pprsec_rows';
		var pprsec_tgl_id = '' + provcompId + 'pprsec_tgl';
		var pwxmanagevar = "";
		//create sub section header
		provHTML.push('<dl class="pvrl-nopad-info"><dt class="pvrl_single_sub_sec_dt pvrl_small_text disabled"><a id="' + pprsec_title_id + '" class="pvrl_sub_sec_link pvrl_sub_section_evt" title="' + i18n.HIDE_SECTION + '">', '<h3 class="sub-sec-hd"><span id="' + pprsec_tgl_id + '" class="pvrl-sub-sec-hd-tgl">-</span>', '<span class="sub-sec-title">' + this.getprovreltnpprlabel() + '</span></h3></a></dt></dl>');
		//build the active/inactive display change row based on counts
		if (reply.PPR.length === 0 && reply.PPR_IN.length === 0) {
			provHTML.push('<dl class="pvrl-nopad-info pvrl-row-border-notop" id="' + pprsec_row_id + '" style="display:block"><dt class="pvrl_single_dt_wpad"><span class="res-none">', i18n.NO_RESULTS_FOUND, '</span></dt></dl>');
		}
		else {
			provHTML.push('<div id="' + pprsec_row_id + '" style="display:block;">');
			if (reply.PPR_IN.length > 0) {
				provHTML.push('<dl class="pvrl-nopad-info pvrl-row-border-notop" ><dt class="pvrl_single_dt_wpad pvrl_small_text">', '<a id="pwx_prov_ppr_active_link' + provcompId + '" class="pvrl_display_type_link" style="text-decoration:underline;" title="', this.pvrlI18nObj.SHOW_ACTIVE, '" ',
				'>', reply.PPR_CNT + ' ', this.pvrlI18nObj.ACTIVE, '</a> | ', '<a id="pwx_prov_ppr_inactive_link' + provcompId + '" class="pvrl_display_type_link" style="text-decoration:none;margin-right:1%" title="', this.pvrlI18nObj.SHOW_INACTIVE, '" ',
				'>', reply.PPR_IN_CNT + ' ', this.pvrlI18nObj.INACTIVE, '</a></dt></dl>');
			}
			else {
				provHTML.push('<dl class="pvrl-nopad-info pvrl-row-border-notop" ><dt class="pvrl_single_dt_wpad pvrl_small_text"><span style="margin-right:1%;color:#A0A0A0">', reply.PPR_CNT + ' ', this.pvrlI18nObj.ACTIVE, ' | ' + reply.PPR_IN_CNT + ' ', this.pvrlI18nObj.INACTIVE, '</span></dt></dl>');
			}
			//build ppr content
			provHTML.push('<div id="pwx_prov_ppr_reltn_div' + provcompId + '" style="display:block">');
			if (reply.PPR.length > 0) {
				var ppractiveindex = 0;
				var k = reply.PPR.length;
				//iterate through lifetime reltn types to add to display
				for (var i = 0; i < k; i++) {
					//create the relationship type header
					var reltntype_title_id = '' + provcompId + i + 'reltn_type';
					var reltntype_row_id = '' + provcompId + i + 'reltn_type_rows';
					var reltntype_tgl_id = '' + provcompId + i + 'reltn_type_tgl';
					provHTML.push('<dl class="pvrl-nopad-info pvrl-row-border-notop" ><dt class="pvrl_single_sub_sub_sec_dt"><a id="' + reltntype_title_id + '" class="pvrl_sub_sec_link pvrl_sub_section_evt" title="' + i18n.SHOW_SECTION + '" ', '><span id="' + reltntype_tgl_id + '" class="pvrl-sub-sec-hd-tgl-close">-</span><h3 class="pvrl_white_sub-sec-hd"><span style="background: white">', '<span class="disabled">' + reply.PPR[i].TYPE + ' <span class="pvrl_small_text">(' + reply.PPR[i].CUR_LIST.length, ')</span>&nbsp;</span></h3></span></a></dt></dl>', '<div id="' + reltntype_row_id + '" style="display:none;">');
					var cc = reply.PPR[i].CUR_LIST.length;
					//iterate through lifetime reltns of that type to add to display
					for (var y = 0; y < cc; y++) {
						//build hover
						var myHvr = [];
						myHvr.length = 5;
						myHvr[0] = ["",""];
						myHvr[0][0] = this.pvrlI18nObj.TYPE + ':';
						myHvr[0][1] = reply.PPR[i].TYPE;
						myHvr[1] = ["",""];
						myHvr[1][0] = this.pvrlI18nObj.NAME + ':';
						myHvr[1][1] = reply.PPR[i].CUR_LIST[y].NAME;
						myHvr[2] = ["",""];
						myHvr[2][0] = this.pvrlI18nObj.CREATED_DATE + ':';
						if (reply.PPR[i].CUR_LIST[y].BEG_DT_UTC.length > 0) {
							var pprbegUTCDate = new Date();
							pprbegUTCDate.setISO8601(reply.PPR[i].CUR_LIST[y].BEG_DT_UTC);
							myHvr[2][1] = pprbegUTCDate.format("shortDate2");
						}
						else {
							myHvr[2][1] = '--';
						}
						myHvr[3] = ["",""];
						myHvr[3][0] = this.pvrlI18nObj.STATUS + ':';
						myHvr[3][1] = reply.PPR[i].CUR_LIST[y].STATUS;
						myHvr[4] = ["",""];
						myHvr[4][0] = this.pvrlI18nObj.END_DATE + ':';
						if (reply.PPR[i].CUR_LIST[y].END_DT_UTC.length > 0) {
							var pprendUTCDate = new Date();
							pprendUTCDate.setISO8601(reply.PPR[i].CUR_LIST[y].END_DT_UTC);
							myHvr[4][1] = pprbegUTCDate.format("shortDate2");
						}
						else {
							myHvr[4][1] = '--';
						}
						ppractiveHvrArray.push(myHvr);
						//build row with or without inactive icon
						if (this.getprovreltnallowinactivate() === 1 && reply.PPR[i].CUR_LIST[y].ID > 0) {
							provHTML.push('<dl id="ppractive_row_' + ppractiveindex + '_'+ provcompId +'" class="pvrl_grey_no_top_border-info pvrl_small_text pvrl-provider-info pvrl_prov_reltn_inactive"><dt class="pvrl_text_indent_dt">', reply.PPR[i].CUR_LIST[y].NAME, '</dt><dt class="pvrl_text_icon_dt" style="display:none;">', '<a class="pvrl_no_text_decor pvrl_prov_reltn_inactive_link" id="1_', reply.PPR[i].CUR_LIST[y].ID,"_",reply.PPR[i].TYPE_CD, '"', '>', '<span class="pvrl-cancel-icon">&nbsp;</span></a></dt></dl>');
						}
						else {
							provHTML.push('<dl id="ppractive_row_' + ppractiveindex + '_'+ provcompId +'" class="pvrl_grey_no_top_border-info pvrl_small_text pvrl-provider-info"><dt class="pvrl_full_text_indent_dt">', reply.PPR[i].CUR_LIST[y].NAME, '</dt></dl>');
						}
						ppractiveindex = ppractiveindex + 1;
					}
					provHTML.push('</div>');
				}
			}
			else {
				provHTML.push('<dl class="pvrl_grey_no_top_border-info"><dt class="pvrl_single_dt_wpad"><span class="res-none">', i18n.NO_RESULTS_FOUND, '</span></dt></dl>');
			}
			provHTML.push('</div>');

			//inactive ppr
			if (reply.PPR_IN.length > 0) {
				provHTML.push('<div id="pwx_prov_ppr_in_reltn_div' + provcompId + '" style="display:none">');
				var pprinactiveindex = 0;
				var k = reply.PPR_IN.length;
				//iterate through inactive lifetime reltn types to add to display
				for (var i = 0; i < k; i++) {
					//create the relationship type header
					var reltntype_title_id = '' + provcompId + i + 'reltn_in_type';
					var reltntype_row_id = '' + provcompId + i + 'reltn_in_type_rows';
					var reltntype_tgl_id = '' + provcompId + i + 'reltn_in_type_tgl';
					provHTML.push('<dl class="pvrl-nopad-info pvrl-row-border-notop"><dt class="pvrl_single_sub_sub_sec_dt"><a id="' + reltntype_title_id + '" class="pvrl_sub_sec_link  pvrl_sub_section_evt" title="', i18n.SHOW_SECTION, '" ', '><span id="' + reltntype_tgl_id + '" class="pvrl-sub-sec-hd-tgl-close">-</span><h3 class="pvrl_white_sub-sec-hd"><span style="background: white">', '<span class="disabled">' + reply.PPR_IN[i].TYPE + ' <span class="pvrl_small_text">(' + reply.PPR_IN[i].CUR_LIST.length, ')</span>&nbsp;</span></h3></span></a></dt></dl>', '<div id="' + reltntype_row_id + '" style="display:none">');
					var cc = reply.PPR_IN[i].CUR_LIST.length;
					//iterate through inactive lifetime reltns of that type to add to display
					for (var y = 0; y < cc; y++) {
						//build hover
						var myHvr = [];
						myHvr.length = 6;
						myHvr[0] = ["",""];
						myHvr[0][0] = this.pvrlI18nObj.TYPE + ':';
						myHvr[0][1] = reply.PPR_IN[i].TYPE;
						myHvr[1] = ["",""];
						myHvr[1][0] = this.pvrlI18nObj.NAME + ':';
						myHvr[1][1] = reply.PPR_IN[i].CUR_LIST[y].NAME;
						myHvr[2] = ["",""];
						myHvr[2][0] = this.pvrlI18nObj.CREATED_DATE + ':';
						if (reply.PPR_IN[i].CUR_LIST[y].BEG_DT_UTC.length > 0) {
							var pprbegUTCDate = new Date();
							pprbegUTCDate.setISO8601(reply.PPR_IN[i].CUR_LIST[y].BEG_DT_UTC);
							myHvr[2][1] = pprbegUTCDate.format("shortDate2");
						}
						else {
							myHvr[2][1] = '--';
						}
						myHvr[3] = ["",""];
						myHvr[3][0] = this.pvrlI18nObj.STATUS + ':';
						myHvr[3][1] = reply.PPR_IN[i].CUR_LIST[y].STATUS;
						myHvr[4] = ["",""];
						myHvr[4][0] = this.pvrlI18nObj.END_DATE + ':';
						if (reply.PPR_IN[i].CUR_LIST[y].END_DT_UTC.length > 0) {
							var pprendUTCDate = new Date();
							pprendUTCDate.setISO8601(reply.PPR_IN[i].CUR_LIST[y].END_DT_UTC);
							myHvr[4][1] = pprbegUTCDate.format("shortDate2");
						}
						else {
							myHvr[4][1] = '--';
						}
						myHvr[5] = ["",""];
						myHvr[5][0] = this.pvrlI18nObj.UPDT_BY + ':';
						myHvr[5][1] = reply.PPR_IN[i].CUR_LIST[y].UPDT_BY;
						pprinactiveHvrArray.push(myHvr);
						//build row
						provHTML.push('<dl id="pprinactive_row_' + pprinactiveindex + '_'+ provcompId +'" class="pvrl_grey_no_top_border-info pvrl_small_text pvrl-provider-info"><dt class="pvrl_full_text_indent_dt">', reply.PPR_IN[i].CUR_LIST[y].NAME + '</span></dt></dl>');
						pprinactiveindex = pprinactiveindex + 1;
					}
					provHTML.push('</div>');
				}
				provHTML.push('</div>');
			}
			provHTML.push('</div>');
		}
	}

	//encounter prsnl relationships epr
	if (this.getprovreltneprdisp() === 1) {
		var eprsec_title_id = '' + provcompId + 'eprsec';
		var eprsec_row_id = '' + provcompId + 'eprsec_rows';
		var eprsec_tgl_id = '' + provcompId + 'eprsec_tgl';
		//build all the header except for text
		provHTML.push('<dl class="pvrl-nopad-info"><dt class="pvrl_single_sub_sec_dt"><a id="' + eprsec_title_id + '" class="pvrl_sub_sec_link pvrl_sub_section_evt" title="' + i18n.HIDE_SECTION + '" >', '<h3 class="sub-sec-hd"><span id="' + eprsec_tgl_id + '" class="pvrl-sub-sec-hd-tgl">-</span>', '<span class="sub-sec-title">' + this.getprovreltneprlabel() + '</span></h3></a></dt></dl>');
		//build the display change row
		if (reply.EPR.length === 0 && reply.EPR_IN.length === 0) {
			provHTML.push('<dl class="pvrl-nopad-info pvrl_small_text pvrl-row-border-notop" id="' + eprsec_row_id + '" style="display:block"><dt class="pvrl_single_dt_wpad"><span class="res-none">', i18n.NO_RESULTS_FOUND, '</span></dt></dl>');
		}
		else {
			provHTML.push('<div id="' + eprsec_row_id + '" style="display:block">');
			if (reply.EPR_IN.length > 0) {
				provHTML.push('<dl class="pvrl-nopad-info pvrl-row-border-notop" ><dt class="pvrl_single_dt_wpad pvrl_small_text">', '<a id="pwx_prov_epr_active_link' + provcompId + '" class="pvrl_display_type_link" style="text-decoration:underline;" title="', this.pvrlI18nObj.SHOW_ACTIVE, '" >', reply.EPR.length + ' ', this.pvrlI18nObj.ACTIVE, '</a> | ', '<a id="pwx_prov_epr_inactive_link' + provcompId + '" class="pvrl_display_type_link" style="text-decoration:none;" title="', this.pvrlI18nObj.SHOW_INACTIVE, '" >', reply.EPR_IN.length + ' ', this.pvrlI18nObj.INACTIVE, '</a><dt></dl>');
			}
			else {
				provHTML.push('<dl class="pvrl-nopad-info pvrl-row-border-notop" ><dt class="pvrl_single_dt_wpad pvrl_small_text"><span style="color:#A0A0A0">', reply.EPR.length + ' ', this.pvrlI18nObj.ACTIVE, ' | ' + reply.EPR_IN.length + ' ', this.pvrlI18nObj.INACTIVE, '</span><dt></dl>');
			}
			provHTML.push('<dt><dl>');
			provHTML.push('<div id="pwx_prov_epr_reltn_div' + provcompId + '" style="display:block">');
			if (reply.EPR.length > 0) {
				var epractiveindex = 0;
				var k = reply.EPR.length;
				//iterate through encounter reltns to add to display
				for (var i = 0; i < k; i++) {
					var myHvr = [];
					myHvr.length = 5;
					myHvr[0] = ["",""];
					myHvr[0][0] = this.pvrlI18nObj.TYPE + ':';
					myHvr[0][1] = reply.EPR[i].TYPE;
					myHvr[1] = ["",""];
					myHvr[1][0] = this.pvrlI18nObj.NAME + ':';
					myHvr[1][1] = reply.EPR[i].NAME;
					myHvr[2] = ["",""];
					myHvr[2][0] = this.pvrlI18nObj.CREATED_DATE + ':';
					if (reply.EPR[i].BEG_DT_UTC.length > 0) {
						var pprbegUTCDate = new Date();
						pprbegUTCDate.setISO8601(reply.EPR[i].BEG_DT_UTC);
						myHvr[2][1] = pprbegUTCDate.format("shortDate2");
					}
					else {
						myHvr[2][1] = '--';
					}
					myHvr[3] = ["",""];
					myHvr[3][0] = this.pvrlI18nObj.STATUS + ':';
					myHvr[3][1] = reply.EPR[i].STATUS;
					myHvr[4] = ["",""];
					myHvr[4][0] = this.pvrlI18nObj.END_DATE + ':';
					if (reply.EPR[i].END_DT_UTC.length > 0) {
						var pprendUTCDate = new Date();
						pprendUTCDate.setISO8601(reply.EPR[i].END_DT_UTC);
						myHvr[4][1] = pprbegUTCDate.format("shortDate2");
					}
					else {
						myHvr[4][1] = '--';
					}
					myHvr[4][1] = reply.EPR[i].END_DT_UTC;
					epractiveHvrArray.push(myHvr);
					//build row with or without inactive icon
					if (this.getprovreltnallowinactivate() === 1) {
						provHTML.push('<dl id="epractive_row_' + epractiveindex + '_'+ provcompId +'" class="pvrl_grey_no_top_border-info pvrl_small_text pvrl-provider-info pvrl_prov_reltn_inactive"><dt class="pvrl_text_dt"><span class="disabled">' + reply.EPR[i].TYPE + ':</span> ', reply.EPR[i].NAME, '</dt><dt class="pvrl_text_icon_dt" style="display:none;">', '<a class="pvrl_no_text_decor pvrl_prov_reltn_inactive_link"  id= "2_', reply.EPR[i].ID,"_",reply.EPR[i].TYPE_CD, '" >', '<span class="pvrl-cancel-icon">&nbsp;</span></a></dt></dl>');
					}
					else {
						provHTML.push('<dl id="epractive_row_' + epractiveindex + '_'+ provcompId +'" class="pvrl_grey_no_top_border-info pvrl_small_text pvrl-provider-info"><dt class="pvrl_single_dt_wpad"><span class="disabled">' + treply.EPR[i].TYPE + ':</span> ', reply.EPR[i].NAME, '</dt></dl>');
					}
					epractiveindex = epractiveindex + 1;
				}
			}
			else {
				provHTML.push('<dl class="pvrl_grey_no_top_border-info pvrl_small_text"><dt class="pvrl_single_dt_wpad"><span class="res-none">', i18n.NO_RESULTS_FOUND, '</span></dt></dl>');
			}
			provHTML.push('</div>');
			//epr inactive
			if (reply.EPR_IN.length > 0) {
				var eprinactiveindex = 0;
				provHTML.push('<div id="pwx_prov_epr_in_reltn_div' + provcompId + '" style="display:none">');
				var k = reply.EPR_IN.length;
				//iterate through inactive encounter reltns to add to display
				for (var i = 0; i < k; i++) {
					var myHvr = [];
					myHvr.length = 6;
					myHvr[0] = ["",""];
					myHvr[0][0] = this.pvrlI18nObj.TYPE + ':';
					myHvr[0][1] = reply.EPR_IN[i].TYPE;
					myHvr[1] = ["",""];
					myHvr[1][0] = this.pvrlI18nObj.NAME + ':';
					myHvr[1][1] = reply.EPR_IN[i].NAME;
					myHvr[2] = ["",""];
					myHvr[2][0] = this.pvrlI18nObj.CREATED_DATE + ':';
					if (reply.EPR_IN[i].BEG_DT_UTC.length > 0) {
						var pprbegUTCDate = new Date();
						pprbegUTCDate.setISO8601(reply.EPR_IN[i].BEG_DT_UTC);
						myHvr[2][1] = pprbegUTCDate.format("shortDate2");
					}
					else {
						myHvr[2][1] = '--';
					}
					myHvr[3] = ["",""];
					myHvr[3][0] = this.pvrlI18nObj.STATUS + ':';
					myHvr[3][1] = reply.EPR_IN[i].STATUS;
					myHvr[4] = ["",""];
					myHvr[4][0] = this.pvrlI18nObj.END_DATE + ':';
					if (reply.EPR_IN[i].END_DT_UTC.length > 0) {
						var pprendUTCDate = new Date();
						pprendUTCDate.setISO8601(reply.EPR_IN[i].END_DT_UTC);
						myHvr[4][1] = pprbegUTCDate.format("shortDate2");
					}
					else {
						myHvr[4][1] = '--';
					}
					myHvr[5] = ["",""];
					myHvr[5][0] = this.pvrlI18nObj.UPDT_BY + ':';
					myHvr[5][1] = reply.EPR_IN[i].UPDT_BY;
					eprinactiveHvrArray.push(myHvr);
					provHTML.push('<dl id="eprinactive_row_' + eprinactiveindex + '_'+ provcompId +'" class="pvrl_grey_no_top_border-info pvrl_small_text pvrl-provider-info"><dt class="pvrl_single_dt_wpad"><span class="disabled">' + reply.EPR_IN[i].TYPE + ': ', reply.EPR_IN[i].NAME + '</span></dt></dl>');
					eprinactiveindex = eprinactiveindex + 1;
				}
				provHTML.push('</div>');
			}
			provHTML.push('</div>');
		}
	}
	
	//other events providers
	if (reply.OTHER_DISP_IND === 1) {
		//build all the header except for text
		var clinsec_title_id = '' + provcompId + 'clinsec';
		var clinsec_row_id = '' + provcompId + 'clinsec_rows';
		var clinsec_tgl_id = '' + provcompId + 'clinsec_tgl';
		provHTML.push('<dl class="pvrl-nopad-info"><dt class="pvrl_single_sub_sec_dt"><a id="' + clinsec_title_id + '" class="pvrl_sub_sec_link pvrl_sub_section_evt" title="' + i18n.HIDE_SECTION + '" >', '<h3 class="sub-sec-hd"><span id="' + clinsec_tgl_id + '" class="pvrl-sub-sec-hd-tgl">-</span>', '<span class="sub-sec-title">' + this.getprovreltnothercelabel() + '<span class="pvrl_small_text"> (' + reply.OTHER_EVENTS.length, ')</span></span></h3></a></dt></dl><div id="' + clinsec_row_id + '" style="display:block">');
		if (reply.OTHER_EVENTS.length > 0) {
			var k = reply.OTHER_EVENTS.length;
			//iterate through other clinical events to add to display
			for (var cc = 0; cc < k; cc++) {
				//build hover
				var myHvr = [];
				myHvr.length = 4;
				var othereventprovText = "";
				myHvr[0] = ["",""];
				myHvr[0][0] = this.pvrlI18nObj.NAME + ':';
				myHvr[0][1] = reply.OTHER_EVENTS[cc].LBL;
				myHvr[1] = ["",""];
				myHvr[1][0] = this.pvrlI18nObj.RESULT + ':';
				if (reply.OTHER_EVENTS[cc].DATE_IND === 1) {
				   var othereventprovUTCDate = new Date();
				   othereventprovUTCDate.setISO8601(reply.OTHER_EVENTS[cc].TEXT);
				   othereventprovText = othereventprovUTCDate.format("shortDate2");
				}
				else {
				  	othereventprovText = reply.OTHER_EVENTS[cc].TEXT;
				}
			    myHvr[1][1] = othereventprovText;
				myHvr[2] = ["",""];
				myHvr[2][0] = this.pvrlI18nObj.DATE + ':';
				if (reply.OTHER_EVENTS[cc].RESULTED_DT_UTC.length > 0) {
					var pprbegUTCDate = new Date();
					pprbegUTCDate.setISO8601(reply.OTHER_EVENTS[cc].RESULTED_DT_UTC);
					myHvr[2][1] = pprbegUTCDate.format("shortDate2");
				}
				else {
					myHvr[2][1] = '--';
				}
				myHvr[3] = ["",""];
				myHvr[3][0] = this.pvrlI18nObj.RESULTED_BY + ':';
				myHvr[3][1] = reply.OTHER_EVENTS[cc].RESULTED_BY;
				eventproviderHvrArray.push(myHvr);
				provHTML.push('<dl id="eventprovider_row_' + cc + '_'+ provcompId +'" class="pvrl_grey_no_top_border-info pvrl_small_text pvrl-provider-info">');
				//check if there is an id for the result. If so add a link to launch a viewer
				if (reply.OTHER_EVENTS[cc].ID === 0) {
					//build row without events
					provHTML.push('<dt class="pvrl_single_dt_wpad"><span class="disabled">' + reply.OTHER_EVENTS[cc].LBL + ': </span>', othereventprovText + '</dt>');
				}
				else {
					if (reply.OTHER_EVENTS[cc].FLAG === 1) {
						//build row with form event
						provHTML.push('<dt class="pvrl_single_dt_wpad"><span class="disabled">' + reply.OTHER_EVENTS[cc].LBL + ': </span>', '<a class="pvrl_result_link pvrl_res_form_link"  title="', this.pvrlI18nObj.VIEW_FORM, '" id="', reply.OTHER_EVENTS[cc].ID, '">', othereventprovText + '</a></dt>');
						this.setpvrlFormEventInd(1);
					}
					else {
						//build row with result event
						provHTML.push('<dt class="pvrl_single_dt_wpad"><span class="disabled">' + reply.OTHER_EVENTS[cc].LBL + ': </span>', '<a class="pvrl_result_link pvrl_res_ceevent_link"  title="', this.pvrlI18nObj.VIEW_RESULT, '" id="', reply.OTHER_EVENTS[cc].ID, '" >', othereventprovText + '</a></dt>');
						this.setpvrlCEEventInd(1);
					}
				}
				provHTML.push('</dl>');
			}
		}
		else {
			provHTML.push('<dl class="pvrl_grey_no_top_border-info pvrl_small_text"><dt class="pvrl_single_dt_wpad"><span class="res-none">', i18n.NO_RESULTS_FOUND, '</span></dt></dl>');
		}
		provHTML.push('</div>');
	}

	provHTML.push('</div>');
	//finalize Component
	this.finalizeComponent(provHTML.join(""), pwx_prov_adhoc_form.join(""));
	//set div variables
	var provcompContentDiv = $("#" + provcompContentElemID);
	var provcompContentScrollDiv = document.getElementById(provcompContentElemID);
	//get bedrock scrolling number
	var maxResults = this.getScrollNumber();
	MP_Util.Doc.InitSectionScrolling(provcompContentScrollDiv, maxResults, "1.6");
	//create event to launch form menu drop down in header
	$(".pwx_pr_form_menu_launch").unbind("click");
	$(".pwx_pr_form_menu_launch").click(function() {
		var anchorElemId = $(this).attr("id");
		if (anchorElemId === provadhocformmenu.getAnchorElementId()) {
			provadhocformmenu.setAnchorElementId(thiz.prov_adhoc_form_menu_id);
			MP_MenuManager.closeMenuStack(thiz.prov_adhoc_form_menu_id);
		}
		else {
			provadhocformmenu.setAnchorElementId(anchorElemId);
			MP_MenuManager.showMenu(thiz.prov_adhoc_form_menu_id);
		}
	});
	//create event to launch form from drop down
	$("a.pwx_pr_form_launch").unbind("click");
	$("a.pwx_pr_form_launch").click(function() {
	    var prov_form_id = $(this).attr('id').split("_"); 
		var paramString = pid + "|" + eid + "|" + prov_form_id[1] + "|" + 0.0 + "|" + 0;
		MPAGES_EVENT("POWERFORM", paramString);
		thiz.retrieveComponentData();
	});
	//events
	//activate subsections
	provcompContentDiv.on("click", "a.pvrl_sub_section_evt", function(event) {
		thiz.expandCollapsePvrlSubSections($(this).attr('id'));
	});
	//inactive/active display change
	provcompContentDiv.on('click', '.pvrl_display_type_link', function() {
		var elemID = $(this).attr('id');
		if (elemID.indexOf("ppr_inactive_link") !== -1) {
			if ($('#pwx_prov_ppr_in_reltn_div' + provcompId).css('display') === 'none') {
				$('#pwx_prov_ppr_in_reltn_div' + provcompId).css('display', 'block');
				$(this).css('text-decoration', 'underline');
				$('#pwx_prov_ppr_reltn_div' + provcompId).css('display', 'none');
				$('#pwx_prov_ppr_active_link' + provcompId).css('text-decoration', 'none');
			}
		}
		else if (elemID.indexOf("ppr_active_link") !== -1) {
			if ($('#pwx_prov_ppr_reltn_div' + provcompId).css('display') === 'none') {
				$('#pwx_prov_ppr_in_reltn_div' + provcompId).css('display', 'none');
				$('#pwx_prov_ppr_inactive_link' + provcompId).css('text-decoration', 'none');
				$('#pwx_prov_ppr_reltn_div' + provcompId).css('display', 'block');
				$(this).css('text-decoration', 'underline');
			}
		}
		else if (elemID.indexOf("epr_inactive_link") !== -1) {
			if ($('#pwx_prov_epr_in_reltn_div' + provcompId).css('display') === 'none') {
				$('#pwx_prov_epr_in_reltn_div' + provcompId).css('display', 'block');
				$(this).css('text-decoration', 'underline');
				$('#pwx_prov_epr_reltn_div' + provcompId).css('display', 'none');
				$('#pwx_prov_epr_active_link' + provcompId).css('text-decoration', 'none');
			}
		}
		else if (elemID.indexOf("epr_active_link") !== -1) {
			if ($('#pwx_prov_epr_reltn_div' + provcompId).css('display') === 'none') {
				$('#pwx_prov_epr_in_reltn_div' + provcompId).css('display', 'none');
				$('#pwx_prov_epr_inactive_link' + provcompId).css('text-decoration', 'none');
				$('#pwx_prov_epr_reltn_div' + provcompId).css('display', 'block');
				$(this).css('text-decoration', 'underline');
			}
		}
	});
	//activate hovers
	var elementMap = {};
	provcompContentDiv.on("mouseenter", "dl.pvrl-provider-info", function(event) {
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
			showProvidersHover(event, anchor);
		}, 500);
	});
	provcompContentDiv.on("mouseleave", "dl.pvrl-provider-info", function(event) {
		$(this).css("background-color", "#FFF");
		$(this).removeClass("mpage-tooltip-hover");
		clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
	});
	/*
	 * @constructor Handles creating and showing hovers in the component
	 * @param {object} event : The jquery event 
	 * @param {object} anchor : The element that triggered the hover.
	 */
	function showProvidersHover(event, anchor) {
		var jsonId = $(anchor).attr("id").split("_");
		switch (jsonId[0]) {
			case "ppractive":
				var ppractiveindexarray = ppractiveHvrArray[jsonId[2]];
				showProvidersHoverHTML(event, anchor, ppractiveindexarray);
				break;
			case "pprinactive":
				var pprinactiveindexarray = pprinactiveHvrArray[jsonId[2]];
				showProvidersHoverHTML(event, anchor, pprinactiveindexarray);
				break;
			case "epractive":
				var epractiveindexarray = epractiveHvrArray[jsonId[2]];
				showProvidersHoverHTML(event, anchor, epractiveindexarray);
				break;
			case "eprinactive":
				var eprinactiveindexarray = eprinactiveHvrArray[jsonId[2]];
				showProvidersHoverHTML(event, anchor, eprinactiveindexarray);
				break;
			case "gridprovider":
				var gridproviderindexarray = gridproviderHvrArray[jsonId[2]];
				showProvidersHoverHTML(event, anchor, gridproviderindexarray);
				break;
			case "eventprovider":
				var eventproviderindexarray = eventproviderHvrArray[jsonId[2]];
				showProvidersHoverHTML(event, anchor, eventproviderindexarray);
				break;
		}
	}
	/*
	 * @constructor builds hover HTML for the component
	 * @param {object} event : The jquery event 
	 * @param {object} anchor : The element that triggered the hover.
	 * @param {array} Providershoverarray : The Array to use when creating hover details.
	 */
	function showProvidersHoverHTML(event, anchor, Providershoverarray) {
		var Providershvr = [];
		Providershvr.push('<div style="background-color:transparent;word-break: break-all;" class="result-details">');
		for (var i = 0; i < Providershoverarray.length; i++) {
			Providershvr.push('<dl class="Provider-det">', '<dt><span>' + Providershoverarray[i][0] + '</span></dt><dd><span>' + Providershoverarray[i][1] + '</span></dd></dl>');
		}
		//Create a new tooltip
		Providershvr.push('</div>');
		var Providerhvrtooltip = thiz.tooltip;
		Providerhvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(Providershvr.join(""));
		Providerhvrtooltip.show();
	}
	//check if form/result events needed
	if (this.getpvrlFormEventInd() === 1) {
		//launch forms event
		provcompContentDiv.on('click', '.pvrl_res_form_link', function() {
			var formID = $(this).attr('id');
			var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + "0" + "|" + formID + "|0";
			MPAGES_EVENT("POWERFORM", paramString);
		});
	}
	if (this.getpvrlCEEventInd() === 1) {
		//launch results detail event
		provcompContentDiv.on('click', '.pvrl_res_ceevent_link', function() {
			var eventID = $(this).attr('id');
			var pwxPVViewerMPage = window.external.DiscernObjectFactory('PVVIEWERMPAGE');
			pwxPVViewerMPage.CreateEventViewer(criterion.person_id);
			pwxPVViewerMPage.AppendEvent(eventID);
			pwxPVViewerMPage.LaunchEventViewer();
		});
	}
	//check if they are allowed to inactivate before creating events
	if (this.getprovreltnallowinactivate() === 1) {
		//set up the inactivate button hovers
		provcompContentDiv.on('mouseover', '.pvrl_prov_reltn_inactive', function() {
			$(this).children('.pvrl_text_icon_dt').css('display', 'block');
		});
		provcompContentDiv.on('mouseout', '.pvrl_prov_reltn_inactive', function() {
			$(this).children('.pvrl_text_icon_dt').css('display', 'none');
		});
		//inactivate click event
		provcompContentDiv.on('click', '.pvrl_prov_reltn_inactive_link', function() {
			var inactiveID = $(this).attr('id').split("_");
			var html_text = thiz.pvrlI18nObj.UNCHART_THE_RELTN;
			MP_ModalDialog.deleteModalDialogObject("LifeReltnRemoveModal");
			var RemoveRltnModal = new ModalDialog("LifeReltnRemoveModal").setHeaderTitle(thiz.pvrlI18nObj.UNCHART_RELTN).setTopMarginPercentage(20).setRightMarginPercentage(35).setBottomMarginPercentage(30).setLeftMarginPercentage(35).setIsBodySizeFixed(true).setHasGrayBackground(true).setIsFooterAlwaysShown(true);
			RemoveRltnModal.setBodyDataFunction(function(modalObj) {
				modalObj.setBodyHTML('<div style="padding-top:10px;"><p class="pvrl_small_text">' + html_text + '</p></div>');
			});
			var closebtn = new ModalButton("addCancel");
			closebtn.setText(thiz.pvrlI18nObj.CANCEL).setCloseOnClick(true);
			var removebtn = new ModalButton("addCancel");
			removebtn.setText(thiz.pvrlI18nObj.REMOVE).setCloseOnClick(true).setOnClickFunction(function() {
				var sendAr = [];
				sendAr.push("^MINE^", inactiveID[0], inactiveID[1] + ".0", criterion.provider_id + ".0",criterion.person_id + ".0",inactiveID[2] + ".0");
				var request = new MP_Core.ScriptRequest(thiz, thiz.getComponentLoadTimerName());
				request.setProgramName("AMB_MP_INACTIVATE_PRSNL_RELTN");
				request.setParameters(sendAr);
				request.setAsync(true);
				MP_Core.XMLCCLRequestCallBack(thiz, request, function(reply) {
					setTimeout(function() {
						thiz.retrieveComponentData();
					}, 500);
				});
			});
			RemoveRltnModal.addFooterButton(removebtn);
			RemoveRltnModal.addFooterButton(closebtn);
			MP_ModalDialog.addModalDialogObject(RemoveRltnModal);
			MP_ModalDialog.showModalDialog("LifeReltnRemoveModal");
		});
	}
};
MP_Util.setObjectDefinitionMapping("AMB_PROVRELTN", AmbProviderReltnsComponent);
