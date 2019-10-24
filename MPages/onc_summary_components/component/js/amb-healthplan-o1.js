// /**
// * Create the component style object which will be used to style various aspects of our component
// */
function AmbHealthPlansComponentStyle() {
	this.initByNamespace("ahp");
}

AmbHealthPlansComponentStyle.inherits(ComponentStyle);
/**
 * @constructor
 * Initialize the Charted Forms component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function AmbHealthPlansComponent(criterion) {

	this.setCriterion(criterion);
	this.setStyles(new AmbHealthPlansComponentStyle());
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.AMBHEALTHPLANS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.AMBHEALTHPLANS.O1 - render component");

	//make my variables and then make getters/setters
	this.ahpI18nObj;

	//hovers
	this.tooltip = new MPageTooltip();
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
AmbHealthPlansComponent.prototype = new MPageComponent();
AmbHealthPlansComponent.prototype.constructor = MPageComponent;

/* Supporting functions */
/*
 * @constructor Handles expanding/collapsing subsections in the component
 * @param {string} subsectionid : The subsectionid string contains id of the row being expanded/collapsed.
 */
AmbHealthPlansComponent.prototype.expandCollapseHPSections = function(subsectionid) {
	if ($('#' + subsectionid + '_row').css('display') === 'block') {
		$('#' + subsectionid + '_row').css('display', 'none');
		$('#' + subsectionid).attr('title', i18n.SHOW_SECTION);
		$('#' + subsectionid + '_tgl').removeClass().addClass('pwx-hp-sub-sec-hd-tgl-close');
	}
	else {
		$('#' + subsectionid + '_row').css('display', 'block');
		$('#' + subsectionid).attr('title', i18n.HIDE_SECTION);
		$('#' + subsectionid + '_tgl').removeClass().addClass('pwx-hp-sub-sec-hd-tgl');
	}
};
/*
 * @constructor retrieve data from ccl
 */
AmbHealthPlansComponent.prototype.retrieveComponentData = function() {
	var criterion = null;
	var request = null;
	var self = this;
	var sendAr = null;
	criterion = this.getCriterion();
	sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0"];
	MP_Core.XMLCclRequestWrapper(this, "AMB_MP_HEALTH_PLAN", sendAr, true);
};
/*
 * @constructor renders the component details
 * @param {object} reply: The data JSON ccl returns
 */
AmbHealthPlansComponent.prototype.renderComponent = function(reply) {
	var thiz = this;
	var numberActiveResults = 0;
	var numberInactiveResults = 0;
	var numberTotalResults = reply.HP_LIST.length;
	var results = null;
	var hp_compId = this.getComponentId();
	var criterion = this.getCriterion();
	var hp_active_scroll_id = "pwx_hp_active_scroll_div_" + hp_compId;
	var hp_inactive_scroll_id = "pwx_hp_inactive_scroll_div_" + hp_compId;
	var hp_active_link_id = "pwx_hp_tabs_active_" + hp_compId;
	var hp_inactive_link_id = "pwx_hp_tabs_inactive_" + hp_compId;
	
	//making any associated events off for the main scrolls
	$("#" + hp_active_scroll_id).off();
	$("#" + hp_inactive_scroll_id).off();

	//Store result information
	numberActiveResults = reply.HP_CNT;
	numberInactiveResults = reply.INACTIVE_HP_CNT;
	this.ahpI18nObj = i18n.discernabu.health_plan_o1;
	//finish building and display the filter display
	var hhtml = [];
	var activehealthHvrArray = [];
	var inactivehealthHvrArray = [];
	var activehealthphoneHvrArray = [];
	var inactivehealthphoneHvrArray = [];
	var inactivehealthHvrArray = [];
	//build tabs
	hhtml.push('<div class="pwx_hp_tabs" id="pwx_hp_tabs' + hp_compId + '">');
	hhtml.push('<a id="',hp_active_link_id,'" class="pwx_hp_tabs_active pwx_hp_tabs_current">' + this.ahpI18nObj.ACTIVE);
	//add active count in tab header
	if (numberActiveResults > 0) {
		hhtml.push('<span class="disabled pwx_hp_small_text">&nbsp;' + numberActiveResults + '</span>');
	}
	hhtml.push('</a>');
	hhtml.push('<a class="pwx_hp_tabs_inactive pwx_hp_tabs_noncurrent" id="',hp_inactive_link_id,'">' + this.ahpI18nObj.INACTIVE);
	//inactive count in tab header
	if (numberInactiveResults > 0) {
		hhtml.push('<span class="disabled pwx_hp_small_text">&nbsp;' + numberInactiveResults + '</span>');
	}
	hhtml.push('</a>');
	hhtml.push('</div>');
	hhtml.push('<div class="pwx_hp_tabs_data" id="pwx_hp_tabs_data' + hp_compId + '">');
	hhtml.push('<div class="pwx_hp_div_scroll" id="' + hp_active_scroll_id + '">');
	//is there active health plans
	if (numberActiveResults > 0) {
		//iterate through active health plans for display
		for (var cc = 0; cc < numberTotalResults; cc++) {
			if(reply.HP_LIST[cc].INACTIVE_IND === 0 && reply.HP_LIST[cc].HEALTH_PLAN_ID !== 0.0) {
				var hp_title_id = hp_compId + '_' + cc;
				var hp_row_id = hp_compId + '_' + cc + '_row';
				var hp_tgl_id = hp_compId + '_' + cc + '_tgl';

				var level_name = "";
				//display health plan priority if available
				switch(reply.HP_LIST[cc].LEVEL) {
					case 1:
						level_name = i18n.PRIMARY;
						break;
					case 2:
						level_name = i18n.SECONDARY;
						break;
					case 3:
						level_name = i18n.TERTIARY;
						break;
					case 4:
						level_name = i18n.OTHER;
						break;	
				}
				//default the first health plan expanded. others collapsed
				if (cc === 0) {
					hhtml.push('<dl class="pwx_hp_dl"><dt class="pwx_hp_dt"><a id="' + hp_title_id + '" class="pwx_hp_sub_sec_link pwx_hp_main_sec">', '<h3 class="sub-sec-hd"><span id="' + hp_tgl_id + '" class="pwx-hp-sub-sec-hd-tgl">-</span>', '<span class="pwx_hp_header_black">' + level_name + ': <span class="pwx_hp_semi_bold">', reply.HP_LIST[cc].NAME + '</span></span></h3></a></dt></dl><div id="' + hp_row_id + '" style="display:block">');
				}
				else {
					hhtml.push('<dl class="pwx_hp_dl"><dt class="pwx_hp_dt"><a id="' + hp_title_id + '" class="pwx_hp_sub_sec_link pwx_hp_main_sec"> ', '<h3 class="sub-sec-hd"><span id="' + hp_tgl_id + '" class="pwx-hp-sub-sec-hd-tgl-close">-</span>', '<span class="pwx_hp_header_black">' + level_name + ': <span class="pwx_hp_semi_bold">', reply.HP_LIST[cc].NAME + '</span></span></h3></a></dt></dl><div id="' + hp_row_id + '" style="display:none">');
				}

				hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.MEMBER + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].MEMBER_NUM + '</dd></dl>');
				hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.GRP + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].GROUP_NUM + '</dd></dl>');
				hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.POLICY + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].POLICY_NUM + '</dd></dl>');
				hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.TYPE + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].TYPE + '</dd></dl>');
				hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.FIN + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].FIN_CLASS + '</dd></dl>');

				if (reply.HP_LIST[cc].EMPLOYER_NAME !== '') {
					hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.EMP + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].EMPLOYER_NAME + '</dd></dl>');
				}
				if (reply.HP_LIST[cc].ADDRESS_LIST.length > 0) {
					var myHvr = [];
					//iterate through addresses for display
					for (var i = 0; i < reply.HP_LIST[cc].ADDRESS_LIST.length; i++) {
						myHvr.length = (i + 1);
						myHvr[i] = ["",""];
						myHvr[i][0] = reply.HP_LIST[cc].ADDRESS_LIST[i].TYPE + ':';
						myHvr[i][1] = reply.HP_LIST[cc].ADDRESS_LIST[i].LINE1 + ', ' + reply.HP_LIST[cc].ADDRESS_LIST[i].LINE2;
					}
					activehealthHvrArray.push(myHvr);
					hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text pwx_hp_hover_info activehealthplan_row"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.ADDRESS + '(' + reply.HP_LIST[cc].ADDRESS_LIST.length + '):</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].ADDRESS_LIST[0].LINE1 + ', ' + reply.HP_LIST[cc].ADDRESS_LIST[0].LINE2 + ' <span class="disabled pwx_hp_small_text">(' + reply.HP_LIST[cc].ADDRESS_LIST[0].TYPE, ')</span></dd></dl>');
				}
				if (reply.HP_LIST[cc].PHONE_LIST.length > 0) {
					var myHvr = [];
					//iterate through phone numbers for display
					for (var i = 0; i < reply.HP_LIST[cc].PHONE_LIST.length; i++) {
						myHvr.length = (i + 1);
						myHvr[i] = ["",""];
						myHvr[i][0] = reply.HP_LIST[cc].PHONE_LIST[i].TYPE + ':';
						myHvr[i][1] = reply.HP_LIST[cc].PHONE_LIST[i].NUMBER;
					}
					activehealthphoneHvrArray.push(myHvr);
					hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text pwx_hp_hover_info activephonehealthplan_row"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.PHONE + '(' + reply.HP_LIST[cc].PHONE_LIST.length + '):</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].PHONE_LIST[0].NUMBER + ' <span class="disabled pwx_hp_small_text">(' + reply.HP_LIST[cc].PHONE_LIST[0].TYPE + ')</span>');
					if (reply.HP_LIST[cc].PHONE_LIST.length > 1) {
						hhtml.push('<br />' + reply.HP_LIST[cc].PHONE_LIST[1].NUMBER + ' <span class="disabled pwx_hp_small_text">(' + reply.HP_LIST[cc].PHONE_LIST[1].TYPE + ')</span>');
					}
					if (reply.HP_LIST[cc].PHONE_LIST.length > 2) {
						hhtml.push('<br />' + reply.HP_LIST[cc].PHONE_LIST[2].NUMBER + ' <span class="disabled pwx_hp_small_text">(' + reply.HP_LIST[cc].PHONE_LIST[2].TYPE + ')</span>');
					}
					hhtml.push('</dd></dl>');
				}
				hhtml.push('</div>');
			}
		}
	}
	else {
		hhtml.push('<dl class="pwx_hp_grey_border_top-info"><dt class="pwx_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
	}
	hhtml.push('</div>');
	hhtml.push('<div class="pwx_hp_div_scroll" style="display:none" id="pwx_hp_inactive_scroll_div_' + hp_compId + '">');

	if (numberInactiveResults > 0) {
		//iterate through inactive health plans for display
		var first_displayed = 0;
		for (var cc = 0; cc < numberTotalResults; cc++) {
			if(reply.HP_LIST[cc].INACTIVE_IND === 1 && reply.HP_LIST[cc].HEALTH_PLAN_ID !== 0.0) {
				var hp_title_id = hp_compId + '_inactive_' + cc;
				var hp_row_id = hp_compId + '_inactive_' + cc + '_row';
				var hp_tgl_id = hp_compId + '_inactive_' + cc + '_tgl';

				var level_name = "";
				//add priority display if available
				switch(reply.HP_LIST[cc].LEVEL) {
					case 1:
						level_name = i18n.PRIMARY;
						break;
					case 2:
						level_name = i18n.SECONDARY;
						break;
					case 3:
						level_name = i18n.TERTIARY;
						break;
					case 4:
						level_name = i18n.OTHER;
						break;		
				}
				//first health plan is default expanded the others closed
				if (first_displayed === 0) {
					hhtml.push('<dl class="pwx_hp_dl"><dt class="pwx_hp_dt"><a id="' + hp_title_id + '" class="pwx_hp_sub_sec_link pwx_hp_main_sec_inactive"> ', '<h3 class="sub-sec-hd"><span id="' + hp_tgl_id + '" class="pwx-hp-sub-sec-hd-tgl">-</span>', '<span class="pwx_hp_header_black">' + level_name + ': <span class="pwx_hp_semi_bold">', reply.HP_LIST[cc].NAME + '</span></span></h3></a></dt></dl><div id="' + hp_row_id + '" style="display:block">');
					first_displayed = 1;
				}
				else {
					hhtml.push('<dl class="pwx_hp_dl"><dt class="pwx_hp_dt"><a id="' + hp_title_id + '" class="pwx_hp_sub_sec_link pwx_hp_main_sec_inactive"> ', '<h3 class="sub-sec-hd"><span id="' + hp_tgl_id + '" class="pwx-hp-sub-sec-hd-tgl-close">-</span>', '<span class="pwx_hp_header_black">' + level_name + ': <span class="pwx_hp_semi_bold">', reply.HP_LIST[cc].NAME + '</span></span></h3></a></dt></dl><div id="' + hp_row_id + '" style="display:none">');
				}

				var eventEndUTCDate = new Date();
				var eventEndUTCDate_text = "--";

				if (reply.HP_LIST[cc].ENDDATE.length > 0) {
					eventEndUTCDate.setISO8601(reply.HP_LIST[cc].ENDDATE);
					eventEndUTCDate_text = eventEndUTCDate.format("shortDate2");
				}
				hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.ENDDATE + ':</dt><dd class="pwx_hp_col_value">', eventEndUTCDate_text + '</dd></dl>');
				hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.MEMBER + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].MEMBER_NUM + '</dd></dl>');
				hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.GRP + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].GROUP_NUM + '</dd></dl>');
				hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.POLICY + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].POLICY_NUM + '</dd></dl>');
				hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.TYPE + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].TYPE + '</dd></dl>');
				hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.FIN + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].FIN_CLASS + '</dd></dl>');

				if (reply.HP_LIST[cc].EMPLOYER_NAME !== '') {
					hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.EMP + ':</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].EMPLOYER_NAME + '</dd></dl>');
				}

				if (reply.HP_LIST[cc].ADDRESS_LIST.length > 0) {
					var myHvr = [];
					//iterate through addresses for display
					for (var i = 0; i < reply.HP_LIST[cc].ADDRESS_LIST.length; i++) {
						myHvr.length = (i + 1);
						myHvr[i] = ["",""];
						myHvr[i][0] = reply.HP_LIST[cc].ADDRESS_LIST[i].TYPE + ':';
						myHvr[i][1] = reply.HP_LIST[cc].ADDRESS_LIST[i].LINE1 + ', ' + reply.HP_LIST[cc].ADDRESS_LIST[i].LINE2;
					}                    
					inactivehealthHvrArray.push(myHvr);
					hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text healthplan-info pwx_hp_hover_info inactivehealthplan_row"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.ADDRESS + '(' + reply.HP_LIST[cc].ADDRESS_LIST.length + '):</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].ADDRESS_LIST[0].LINE1 + ', ' + reply.HP_LIST[cc].ADDRESS_LIST[0].LINE2 + ' <span class="disabled pwx_hp_small_text">(' + reply.HP_LIST[cc].ADDRESS_LIST[0].TYPE, ')</span></dd></dl>');
				}
				if (reply.HP_LIST[cc].PHONE_LIST.length > 0) {
					var myHvr = [];
					//iterate through phone numbers for display
					for (var i = 0; i < reply.HP_LIST[cc].PHONE_LIST.length; i++) {
						myHvr.length = (i + 1);
						myHvr[i] = ["",""];
						myHvr[i][0] = reply.HP_LIST[cc].PHONE_LIST[i].TYPE + ':';
						myHvr[i][1] = reply.HP_LIST[cc].PHONE_LIST[i].NUMBER;
					}

					inactivehealthphoneHvrArray.push(myHvr);
					hhtml.push('<dl class="pwx_hp_grey_border-info pwx_hp_small_text healthplan-info pwx_hp_hover_info inactivephonehealthplan_row"><dt class="pwx_hp_col_lbl disabled">' + this.ahpI18nObj.PHONE + '(' + reply.HP_LIST[cc].PHONE_LIST.length + '):</dt><dd class="pwx_hp_col_value">', reply.HP_LIST[cc].PHONE_LIST[0].NUMBER + ' <span class="disabled pwx_hp_small_text">(' + reply.HP_LIST[cc].PHONE_LIST[0].TYPE + ')</span>');

					if (reply.HP_LIST[cc].PHONE_LIST.length > 1) {
						hhtml.push('<br />' + reply.HP_LIST[cc].PHONE_LIST[1].NUMBER + ' <span class="disabled pwx_hp_small_text">(' + reply.HP_LIST[cc].PHONE_LIST[1].TYPE + ')</span>');
					}

					if (reply.HP_LIST[cc].PHONE_LIST.length > 2) {
						hhtml.push('<br />' + reply.HP_LIST[cc].PHONE_LIST[2].NUMBER + ' <span class="disabled pwx_hp_small_text">(' + reply.HP_LIST[cc].PHONE_LIST[2].TYPE + ')</span>');
					}
					hhtml.push('</dd></dl>');
				}
				hhtml.push('</div>');
			}
		}
	}
	else {
		hhtml.push('<dl class="pwx_hp_grey_border_top-info"><dt class="pwx_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
	}
	hhtml.push('</div></div>');
	var maxResults = this.getScrollNumber();

	//send filter html
	this.finalizeComponent(hhtml.join(""));
	var containerScrollDiv_active = document.getElementById(hp_active_scroll_id);
	var containerScrollDiv_inactive = document.getElementById(hp_inactive_scroll_id);
	var containerDiv = $("#pwx_hp_tabs" + hp_compId);
	// cache the variable
	MP_Util.Doc.InitSectionScrolling(containerScrollDiv_active, maxResults, "1.6");
	//create tab noncurrent header click events
	containerDiv.off("click", "a.pwx_hp_tabs_noncurrent");
	containerDiv.on("click", "a.pwx_hp_tabs_noncurrent", function(event) {
		var type_id = $(this).attr('id');
		$("#" + type_id).removeClass('pwx_hp_tabs_noncurrent').addClass('pwx_hp_tabs_current');
		$("#" + type_id).blur();
		var other_class = "";
		if (type_id === hp_active_link_id) {
			containerScrollDiv_active.style.display = 'block';
			containerScrollDiv_inactive.style.display = 'none';
			other_class = "a.pwx_hp_tabs_inactive";
		}
		else {
			containerScrollDiv_active.style.display = 'none';
			containerScrollDiv_inactive.style.display = 'block';
			other_class = "a.pwx_hp_tabs_active";
		}
		$(other_class).removeClass('pwx_hp_tabs_current').addClass('pwx_hp_tabs_noncurrent');
	});
	//create active sections expand collapse events
	$("#" + "pwx_hp_active_scroll_div_" + hp_compId).off("click", "a.pwx_hp_main_sec");
	$("#" + "pwx_hp_active_scroll_div_" + hp_compId).on("click", "a.pwx_hp_main_sec", function(event) {
		var row_id = $(this).attr('id');
		thiz.expandCollapseHPSections(row_id);
	});
	//create inactive sections expand collapse events
	$("#" + "pwx_hp_inactive_scroll_div_" + hp_compId).off("click", "a.pwx_hp_main_sec_inactive");
	$("#" + "pwx_hp_inactive_scroll_div_" + hp_compId).on("click", "a.pwx_hp_main_sec_inactive", function(event) {
		var row_id = $(this).attr('id');		
		thiz.expandCollapseHPSections(row_id);
	});
	//hovers and check scrolling activate hovers
	var elementMap = {};
	// remove hover event if there is any
	var scroll_id = 'pwx_hp_tabs_data' + hp_compId;
	$('#' + scroll_id).off("mouseenter", "dl.pwx_hp_hover_info");
	$('#' + scroll_id).off("mouseleave", "dl.pwx_hp_hover_info");
	// attach hover event
	$('#' + scroll_id).on("mouseenter", "dl.pwx_hp_hover_info", function(event) {
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
			amb_hp_showHover(event, anchor);
		}, 500);
	});
	//Added timeout for component loading
	setTimeout(function() {
		$('#' + scroll_id).on("mouseleave", "dl.pwx_hp_hover_info", function(event) {
			$(this).css("background-color", "#FFF");
			$(this).removeClass("mpage-tooltip-hover");
			clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
		});
	}, 0);
	/*
	 * @constructor Handles creating and showing hovers in the component
	 * @param {object} event : The jquery event
	 * @param {object} anchor : The element that triggered the hover.
	 */
	function amb_hp_showHover(event, anchor) {

		if($(anchor).hasClass("activehealthplan_row") === true) {
			amb_hp_showHoverHTML(event, anchor, activehealthHvrArray[0]);
		}
		else if($(anchor).hasClass("activephonehealthplan_row") === true) {
			amb_hp_showHoverHTML(event, anchor, activehealthphoneHvrArray[0]);
		}
		else if($(anchor).hasClass("inactivehealthplan_row") === true) {
			amb_hp_showHoverHTML(event, anchor, inactivehealthHvrArray[0]);
		}
		else if($(anchor).hasClass("inactivephonehealthplan_row") === true) {
			amb_hp_showHoverHTML(event, anchor, inactivehealthphoneHvrArray[0]);
		}
	}


	/*
	 * @constructor builds hover HTML for the component
	 * @param {object} event : The jquery event
	 * @param {object} anchor : The element that triggered the hover.
	 * @param {array} healthplanhoverarray : The Array to use when creating hover details.
	 */
	function amb_hp_showHoverHTML(event, anchor, healthplanhoverarray) {
		var healthplanhvr = [];
		healthplanhvr.push('<div class="result-details pwx_hp_result_details">');
		for (var i = 0; i < healthplanhoverarray.length; i++) {
			healthplanhvr.push('<dl class="healthplan-det">', '<dt><span>' + healthplanhoverarray[i][0] + '</span></dt><dd><span>' + healthplanhoverarray[i][1] + '</span></dd></dl>');
		}
		//Create a new tooltip
		healthplanhvr.push('</div>');
		var healthplanhoverarrayhvrtooltip = new MPageTooltip();
		healthplanhoverarrayhvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(healthplanhvr.join(""));
		healthplanhoverarrayhvrtooltip.show();
	}

};
MP_Util.setObjectDefinitionMapping("AMB_HEALTHPLAN", AmbHealthPlansComponent);
