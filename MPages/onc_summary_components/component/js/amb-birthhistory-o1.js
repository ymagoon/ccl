/**
 * Create the component style object which will be used to style various aspects of our component
 */
function AmbBirthHistoryComponentStyle() {
	this.initByNamespace("bh");
}
AmbBirthHistoryComponentStyle.inherits(ComponentStyle);
/**
 * @constructor
 * Initialize the Birth History component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function AmbBirthHistoryComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new AmbBirthHistoryComponentStyle());
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.AMBBIRTHHISTORY.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.AMBBIRTHHISTORY.O1 - render component");
	this.bhI18nObj;
	//must keep this data object updated
	this.m_birthgestdetaildisp = 0;
	this.m_birtheventce = [];
	this.m_birtheventceseq = [];
	this.m_birthenceventce = [];
	this.m_birthenceventceseq = [];
	this.m_birthspf = [];
	this.birth_adhoc_form_menu_id = "birth_adhoc_form_menu";
	//hovers
	this.tooltip = new MPageTooltip();
}
/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
AmbBirthHistoryComponent.prototype = new MPageComponent();
AmbBirthHistoryComponent.prototype.constructor = MPageComponent;
//for indicator
/*
 * @constructor set gestational detail display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbBirthHistoryComponent.prototype.setbirthgestdetaildisp = function (value) {
	this.m_birthgestdetaildisp = (value === true ? 1 : 0);
};
/*
 * @constructor get gestational details display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbBirthHistoryComponent.prototype.getbirthgestdetaildisp = function () {
	return this.m_birthgestdetaildisp;
};
/*
 * @constructor set event set types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbBirthHistoryComponent.prototype.setbirtheventce = function (value) {
	this.m_birtheventce = value;
};
/*
 * @constructor set event set seq types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbBirthHistoryComponent.prototype.setbirtheventceseq = function (value) {
	this.m_birtheventceseq = value;
};
/*
 * @constructor set encounter event set types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbBirthHistoryComponent.prototype.setbirthenceventce = function (value) {
	this.m_birthenceventce = value;
};
/*
 * @constructor set encounter event set seq types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbBirthHistoryComponent.prototype.setbirthenceventceseq = function (value) {
	this.m_birthenceventceseq = value;
};
/*
 * @constructor get event set filter in the component
 * @return{integer} : bedrock setting value.
 */
AmbBirthHistoryComponent.prototype.getbirtheventce = function () {
	return this.m_birtheventce;
};
/*
 * @constructor get event set seq filter in the component
 * @return{integer} : bedrock setting value.
 */
AmbBirthHistoryComponent.prototype.getbirtheventceseq = function () {
	return this.m_birtheventceseq;
};
/*
 * @constructor get encounter event set filter in the component
 * @return{integer} : bedrock setting value.
 */
AmbBirthHistoryComponent.prototype.getbirthenceventce = function () {
	return this.m_birthenceventce;
};
/*
 * @constructor get encounter event set seq filter in the component
 * @return{integer} : bedrock setting value.
 */
AmbBirthHistoryComponent.prototype.getbirthenceventceseq = function () {
	return this.m_birthenceventceseq;
};
/*
 * @constructor launch result viewer functionality.
 * @return{float}persId : Person Id from system.
 * @return{float}persId : Event Id from program
 */
AmbBirthHistoryComponent.prototype.launchbirthhistoryresult = function (persId, eventId) {
	var pwxPVViewerMPage = window.external.DiscernObjectFactory('PVVIEWERMPAGE');
	pwxPVViewerMPage.CreateEventViewer(persId);
	pwxPVViewerMPage.AppendEvent(eventId);
	pwxPVViewerMPage.LaunchEventViewer();
}
/*
 * @constructor set PowerForms Add list for header in the component
 * @return{string} : bedrock setting value.
 */
AmbBirthHistoryComponent.prototype.setbirthhisspf = function(value) {
	this.m_birthspf = value;
};
/*
 * @constructor get PowerForms Add list for header in the component
 * @return{string} : bedrock setting value.
 */
AmbBirthHistoryComponent.prototype.getbirthhisspf = function() {
	return this.m_birthspf;
};
// pull out the bedrock setting
/*
 * @constructor map bedrock settings to variables
 * @return{string} : bedrock setting value.
 */
AmbBirthHistoryComponent.prototype.loadFilterMappings = function () {
	/* get type setting */
	this.addFilterMappingObject("BIRTHHIST_EVENTS_CE", {
		setFunction : this.setbirtheventce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("BIRTHHIST_EVENTS_CE_SEQ", {
		setFunction : this.setbirtheventceseq,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("BIRTHHIST_ENC_EVENTS_CE", {
		setFunction : this.setbirthenceventce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("BIRTHHIST_ENC_EVENTS_CE_SEQ", {
		setFunction : this.setbirthenceventceseq,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	/* get indicator setting */
	this.addFilterMappingObject("BIRTHHIST_GEST_DETAILS", {
		setFunction : this.setbirthgestdetaildisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
    this.addFilterMappingObject("BIRTHHIST_PF", {
		setFunction : this.setbirthhisspf,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	}); 
};
/*
 * @constructor gets data from CCL
 */
AmbBirthHistoryComponent.prototype.retrieveComponentData = function () {
	var criterion = null;
	var request = null;
	var self = this;
	var sendAr = null;
	criterion = this.getCriterion();
	//need to look at doing an encounter option/using the standard mpage lookback settings
	sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", MP_Util.CreateParamArray(this.getbirtheventce(), 1), MP_Util.CreateParamArray(this.getbirtheventceseq(), 1), MP_Util.CreateParamArray(this.getbirthenceventce(), 1), MP_Util.CreateParamArray(this.getbirthenceventceseq(), 1), this.getbirthgestdetaildisp(),MP_Util.CreateParamArray(this.getbirthhisspf(), 1)];
	MP_Core.XMLCclRequestWrapper(this, "AMB_MP_BIRTH_HISTORY_COMP", sendAr, true);
};
/*
 * @constructor render component content
 * @param {object} reply : JSON object returned from CCL
 */
AmbBirthHistoryComponent.prototype.renderComponent = function (reply) {
	var thiz = this;
	var numberResults = 0;
	var results = null;
	this.bhI18nObj = i18n.discernabu.birth_history_o1;
	var criterion = this.getCriterion();
	//Store result information
	var birthhscompId = this.getComponentId();
	var birthhscompContentElemID = 'pwx_clinevent_flex_scroll_div' + birthhscompId;
	$("#" + birthhscompContentElemID).off()
	//finish building and display the filter display
	var bp_birthhistory_HTML = [];
	var clinflexHvrArray = [];
    var pwx_birthhis_adhoc_form = [];
	var pid = criterion.person_id;
	var eid = criterion.encntr_id;
	var uid = criterion.provider_id;
	var posid = criterion.position_cd;
	
	if (reply.ADD_PFORM.length > 0) {
		if (reply.ADD_PFORM.length === 1) {
			pwx_birthhis_adhoc_form.push('<a id="'+ birthhscompId +'_' + reply.ADD_PFORM[0].FORM_ID + '" class="pwx_bh_no_text_decor pwx_bh_grey_link pwx_bh_small_text pwx_bh_form_launch" title="' + this.bhI18nObj.AQFORM + '"> ' + '<span class="pwx-bh_add-icon pwx_bh_no_text_decor">&nbsp;</span></a>');
		}
		else {
			var birthhisadhocformmenu = new Menu(this.birth_adhoc_form_menu_id);
			birthhisadhocformmenu.setTypeClass("menu-page-menu");
			birthhisadhocformmenu.setIsRootMenu(false);
			birthhisadhocformmenu.setAnchorElementId(this.birth_adhoc_form_menu_id);
			birthhisadhocformmenu.setAnchorConnectionCorner(["bottom", "right"]);
			birthhisadhocformmenu.setContentConnectionCorner(["top", "left"]);
			birthhisadhocformmenu.setLabel("");
			var birthadhocformenuitem = [];
			var formlength = reply.ADD_PFORM.length;
			MP_MenuManager.deleteMenuObject(this.birth_adhoc_form_menu_id, true);
			for (var i = 0; i < formlength; i++) {
				var formid = "";
				formid = reply.ADD_PFORM[i].FORM_ID;
				birthadhocformenuitem[i] = new MenuItem(reply.ADD_PFORM[i].FORM_ID);
				birthadhocformenuitem[i].setLabel(reply.ADD_PFORM[i].FORM_NAME);
				birthadhocformenuitem[i].setCloseOnClick(true);
				birthadhocformenuitem[i].setClickFunction(function() {
					var paramString = pid + "|" + eid + "|" + this.getId() + "|" + 0.0 + "|" + 0;
					MPAGES_EVENT("POWERFORM", paramString);
					MP_MenuManager.deleteMenuObject(this.birth_adhoc_form_menu_id, true);
					thiz.retrieveComponentData();
				});
				birthhisadhocformmenu.addMenuItem(birthadhocformenuitem[i]);
			}
			birthadhocformenuitem[reply.ADD_PFORM.length + 1] = new MenuItem("Allform" + this.birth_adhoc_form_menu_id);
			birthadhocformenuitem[reply.ADD_PFORM.length + 1].setLabel(this.bhI18nObj.ALLFO);
			birthadhocformenuitem[reply.ADD_PFORM.length + 1].setCloseOnClick(true);
			birthadhocformenuitem[reply.ADD_PFORM.length + 1].setClickFunction(function() {
				var paramString = pid + "|" + eid + "|" + 0.0 + "|" + 0.0 + "|" + 0;
				MPAGES_EVENT("POWERFORM", paramString);
				MP_MenuManager.deleteMenuObject(this.birth_adhoc_form_menu_id, true);
				thiz.retrieveComponentData();
			});
			birthhisadhocformmenu.addMenuItem(birthadhocformenuitem[reply.ADD_PFORM.length + 1]);
			MP_MenuManager.addMenuObject(birthhisadhocformmenu);

			pwx_birthhis_adhoc_form.push('<a id="'+ birthhscompId +'_' + 0.0 + '" class="pwx_bh_no_text_decor pwx_bh_grey_link pwx_bh_small_text pwx_bh_form_launch"  title="' + this.bhI18nObj.ALLFO + '">');
			pwx_birthhis_adhoc_form.push('<span class="pwx-bh_add-icon-plus pwx_bh_no_text_decor">&nbsp;</span></a>');
			pwx_birthhis_adhoc_form.push('<a id="'+ birthhscompId +'_pwx_bh_chart_menu_id" class="pwx_bh_no_text_decor pwx_bh_form_menu_launch" title="' + this.bhI18nObj.AQFORM + '">');
			pwx_birthhis_adhoc_form.push('<span class="pwx-bh_add-icon-plus-arrow pwx_bh_no_text_decor" id="'+ birthhscompId +'_pwx-bh-alert-dpdown-id">&nbsp;</span></a>');
		}
	}
	
	bp_birthhistory_HTML.push('<div class="pwx_bh_div_scroll" id="' + birthhscompContentElemID + '">');
	if (reply.OTHER_EVENTS.length > 0) {
		var border_class = 'pwx_bh_grey_border_top-info';
		var resultDisp = "";
		for (var i = 0; i < reply.OTHER_EVENTS.length; i++) {
			var clinevent_flex_hvr = "";
			var bh_event_text = "";
			if (reply.OTHER_EVENTS[i].DATE_IND === 1) {
				if (reply.OTHER_EVENTS[i].DATE_TEXT != "") {
					var eventUTCDate = new Date();
					eventUTCDate.setISO8601(reply.OTHER_EVENTS[i].DATE_TEXT);
					bh_event_text = eventUTCDate.format("longDateTime2");
				}
			} else {
				bh_event_text = reply.OTHER_EVENTS[i].TEXT;
			}
			if (reply.OTHER_EVENTS[i].UNIT_MEANING === "OZ") {
				var pounds = 0
					var ounces = 0;
				var temppounds = Math.floor(reply.OTHER_EVENTS[i].TEXT / 16)
					pounds = temppounds.toFixed(0)
					if (pounds !== 0) {
						ounces = reply.OTHER_EVENTS[i].TEXT % 16
							resultDisp = pounds + '<span>&nbsp;' + this.bhI18nObj.LBS + '</span> ' + ounces + '<span>&nbsp;' + this.bhI18nObj.OZ + '</span>';
					} else {
						resultDisp = bh_event_text + '<span>&nbsp;' + this.bhI18nObj.OZ + '</span>';
					}
			} else {
				resultDisp = bh_event_text + ' ' + reply.OTHER_EVENTS[i].LBL;
			}
			var myHvr = [];
			var hrvlen = 0;
			hvrlen = myHvr.length;
			myHvr[hvrlen] = ["", ""];
			myHvr[hvrlen][0] = this.bhI18nObj.NAME + ':'
				myHvr[hvrlen][1] = reply.OTHER_EVENTS[i].CD_STR;
			hvrlen = myHvr.length;
			myHvr[hvrlen] = ["", ""]; ;
			myHvr[hvrlen][0] = this.bhI18nObj.RES + ':'
				myHvr[hvrlen][1] = bh_event_text + ' ' + reply.OTHER_EVENTS[i].LBL;
			if (reply.OTHER_EVENTS[i].UNIT_MEANING == "OZ") {
				hvrlen = myHvr.length;
				myHvr[hvrlen] = ["", ""];
				myHvr[hvrlen][0] = this.bhI18nObj.CNVRES + ':';
				myHvr[hvrlen][1] = resultDisp;
			}
			hvrlen = myHvr.length;
			myHvr[hvrlen] = ["", ""];
			myHvr[hvrlen][0] = this.bhI18nObj.RESDATE + ':';
			if (reply.OTHER_EVENTS[i].RESULTED_DT.length > 0) {
				var resultUTCDate = new Date();
				resultUTCDate.setISO8601(reply.OTHER_EVENTS[i].RESULTED_DT);
				myHvr[hvrlen][1] = resultUTCDate.format("shortDate2");
			} else {
				myHvr[hvrlen][1] = "--"
			}
			hvrlen = myHvr.length;
			myHvr[hvrlen] = ["", ""]; ;
			myHvr[hvrlen][0] = this.bhI18nObj.RESBY + ':';
			myHvr[hvrlen][1] = reply.OTHER_EVENTS[i].RESULTED_BY;
			clinflexHvrArray.push(myHvr);
			bp_birthhistory_HTML.push('<dl id="clinicaleventflex_row_' + i + '_' + birthhscompId + '" class="' + border_class + ' clinicaleventflx-info bhscrollrawheight">');
			bp_birthhistory_HTML.push('<dt class="pwx_bh_clinevent_flex_dt_name"><span class="disabled">' + reply.OTHER_EVENTS[i].CD_STR + ': </span></dt>');
			bp_birthhistory_HTML.push('<dt class="pwx_bh_clinevent_flex_dt_result"><span class="pwx_bh_result_link pwx_bh_view_result"  title="' + this.bhI18nObj.VRES + '">', resultDisp + '</span></dt><dt class="bh_event_id_hidden" style="display:none">' + reply.OTHER_EVENTS[i].ID + '</dt>');
			bp_birthhistory_HTML.push('</dl>');
			border_class = 'pwx_bh_grey_border-info';
		}
	} else {
		if (reply.GEST_AGE_AT_BIRTH_GEST === '--' && reply.GEST_AGE_METHOD_CD_GEST === '--' && reply.GEST_AGE_COMMENT_GEST === '--') {
			bp_birthhistory_HTML.push('<dl class="pwx_bh_grey_border_top-info"><dt class="pwx_bh_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
		}
	}
	// display gestational detail if indicator is 1
	if (this.getbirthgestdetaildisp() === 1) {
		if (reply.GEST_AGE_AT_BIRTH_GEST !== '--' || reply.GEST_AGE_METHOD_CD_GEST !== '--' || reply.GEST_AGE_COMMENT_GEST !== '--') {
			var gest_age_at_brith_getst_display = "";
			if (reply.GEST_AGE_AT_BIRTH_GEST_WEEK_IND === 1) {
				gest_age_at_brith_getst_display = Math.floor((reply.GEST_AGE_AT_BIRTH_GEST) / 7) + this.bhI18nObj.WEEKS
			} else if (reply.GEST_AGE_AT_BIRTH_GEST_WEEKDAY_IND == 1) {
				gest_age_at_brith_getst_display = Math.floor((reply.GEST_AGE_AT_BIRTH_GEST) / 7) + this.bhI18nObj.WEEKS + " " + reply.GEST_AGE_AT_BIRTH_MOD + this.bhI18nObj.DAYS
			} else if (reply.GEST_AGE_AT_BIRTH_GEST_IND == 1) {
				gest_age_at_brith_getst_display = Math.floor(reply.GEST_AGE_AT_BIRTH_GEST)
			} else {
				gest_age_at_brith_getst_display = "--";
			}
			bp_birthhistory_HTML.push('<dl id="' + birthhscompId + '_gesdetail" class="pwx_bh_ges_detail">');
			bp_birthhistory_HTML.push('<span> ' + this.bhI18nObj.GESDET + '</span>');
			bp_birthhistory_HTML.push('</dl>');
			bp_birthhistory_HTML.push('<dl id="' + birthhscompId + '_birthges" class="pwx_bh_grey_border_top-info">');
			bp_birthhistory_HTML.push('<dt class="pwx_bh_clinevent_flex_dt_name"><span class="disabled"> ' + this.bhI18nObj.GESAGE + ': </span></dt>');
			bp_birthhistory_HTML.push('<dt class="pwx_bh_clinevent_flex_dt_result"><span>' + gest_age_at_brith_getst_display + '</span></dt>');
			bp_birthhistory_HTML.push('</dl>');
			bp_birthhistory_HTML.push('<dl id="' + birthhscompId + '_methodges" class="pwx_bh_grey_border-info">');
			bp_birthhistory_HTML.push('<dt class="pwx_bh_clinevent_flex_dt_name"><span class="disabled"> ' + this.bhI18nObj.MET + ': </span></dt>');
			bp_birthhistory_HTML.push('<dt class="pwx_bh_clinevent_flex_dt_result"><span>' + reply.GEST_AGE_METHOD_CD_GEST + '</span></dt>');
			bp_birthhistory_HTML.push('</dl>');
			bp_birthhistory_HTML.push('<dl id="' + birthhscompId + '_commentges" class="pwx_bh_grey_border-info">');
			bp_birthhistory_HTML.push('<dt class="pwx_bh_clinevent_flex_dt_name"><span class="disabled"> ' + this.bhI18nObj.COMM + ': </span></dt>');
			bp_birthhistory_HTML.push('<dt class="pwx_bh_clinevent_flex_dt_result"><span>' + reply.GEST_AGE_COMMENT_GEST + '</span></dt>');
			bp_birthhistory_HTML.push('</dl>');
		}
	}
	bp_birthhistory_HTML.push('</div>');
	//send filter html
	this.finalizeComponent(bp_birthhistory_HTML.join(""), pwx_birthhis_adhoc_form.join(""));
	var containerScrollDiv = document.getElementById(birthhscompContentElemID);
	var containerDiv = $("#" + birthhscompContentElemID);
	// cache the variable
	var maxResults = this.getScrollNumber();
	MP_Util.Doc.InitSectionScrolling(containerScrollDiv, maxResults, "1.6");
	$(".pwx_bh_form_menu_launch").unbind("click");
	$(".pwx_bh_form_menu_launch").click(function() {
		var anchorElemId = $(this).attr("id");
		if (anchorElemId === birthhisadhocformmenu.getAnchorElementId()) {
			birthhisadhocformmenu.setAnchorElementId(thiz.birth_adhoc_form_menu_id);
			MP_MenuManager.closeMenuStack(thiz.birth_adhoc_form_menu_id);
		}
		else {
			birthhisadhocformmenu.setAnchorElementId(anchorElemId);
			MP_MenuManager.showMenu(thiz.birth_adhoc_form_menu_id);
		}
	});
	//create event for launching a PowerForm from dropdown
	$("a.pwx_bh_form_launch").unbind("click");
	$("a.pwx_bh_form_launch").click(function() {
	    var bh_form_id = $(this).attr('id').split("_");
		var paramString = pid + "|" + eid + "|" + bh_form_id[1] + "|" + 0.0 + "|" + 0;
		MPAGES_EVENT("POWERFORM", paramString);
		thiz.retrieveComponentData();
	});
	//result viewer api
	containerDiv.off("click", "span.pwx_bh_view_result");
	containerDiv.on("click", "span.pwx_bh_view_result", function (event) {
		var bheventid = $(this).parent('dt.pwx_bh_clinevent_flex_dt_result').siblings('dt.bh_event_id_hidden').text();
		thiz.launchbirthhistoryresult(criterion.person_id, bheventid);
	});
	//hover area
	var elementMap = {};
	//remove event if there is any
	containerDiv.off("mouseenter", 'dl.clinicaleventflx-info');
	containerDiv.off("mouseleave", 'dl.clinicaleventflx-info');
	// attach event
	containerDiv.on("mouseenter", 'dl.clinicaleventflx-info', function (event) {
		var anchor = this;
		$(this).css("background-color", "#FFC")
		var anchorId = $(this).attr("id");
		//If there is a hover class specified, add it to the element
		$(this).addClass("mpage-tooltip-hover");
		if (!elementMap[anchorId]) {
			elementMap[anchorId] = {};
		}
		//Store of a flag that we're hovered inside this element
		elementMap[anchorId].TIMEOUT = setTimeout(function () {
				showclinicaleventflexHover(event, anchor);
			}, 500);
	});
	containerDiv.on("mouseleave", 'dl.clinicaleventflx-info', function (event) {
		$(this).css("background-color", "#FFF")
		$(this).removeClass("mpage-tooltip-hover");
		clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
	});
	/*
	 * @constructor Handles creating and showing hovers in the component
	 * @param {object} event : The jquery event
	 * @param {object} anchor : The element that triggered the hover.
	 */
	function showclinicaleventflexHover(event, anchor) {
		var jsonId = $(anchor).attr("id").split("_");
		switch (jsonId[0]) {
		case "clinicaleventflex":
			var clinflexindexarray = clinflexHvrArray[jsonId[2]];
			showclinicaleventflexHoverHTML(event, anchor, clinflexindexarray)
			break;
		}
	}
	/*
	 * @constructor builds hover HTML for the component
	 * @param {object} event : The jquery event
	 * @param {object} anchor : The element that triggered the hover.
	 * @param {array} RelationshipsHoverhoverarray : The Array to use when creating hover details.
	 */
	function showclinicaleventflexHoverHTML(event, anchor, clinicaleventhoverarray) {
		var clinicaleventflexhvr = [];
		clinicaleventflexhvr.push('<div class="result-details pwx_bh_result_details">');
		for (var i = 0; i < clinicaleventhoverarray.length; i++) {
			clinicaleventflexhvr.push('<dl class="clinicaleventflex-det">', '<dt><span>' + clinicaleventhoverarray[i][0] + '</span></dt><dd><span>' + clinicaleventhoverarray[i][1] + '</span></dd></dl>');
		}
		//Create a new tooltip
		clinicaleventflexhvr.push('</div>');
		var clinicaleventflexhvrtooltip = thiz.tooltip;
		clinicaleventflexhvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(clinicaleventflexhvr.join(""));
		clinicaleventflexhvrtooltip.show();
	}
};
MP_Util.setObjectDefinitionMapping("AMB_BIRTHHIST", AmbBirthHistoryComponent);
