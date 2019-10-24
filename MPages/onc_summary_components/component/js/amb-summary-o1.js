/**
 * Create the component style object which will be used to style various aspects of our component
 */
function AmbSummaryComponentStyle() {
	this.initByNamespace("asumm");
}

AmbSummaryComponentStyle.inherits(ComponentStyle);
/**
 * @constructor
 * Initialize the Summary component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */

function AmbSummaryComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new AmbSummaryComponentStyle());
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.AMBSUMMARY.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.AMBSUMMARY.O1 - render component");
	this.summ_expand_collapse_label = i18n.SHOW_SECTION;
	this.summ_expand_collapse_icon = "pwx-asumm_sub-sec-hd-tgl-close";
	this.summ_expand_collapse_style = "display:none";
	this.summ_pc_report_menu_id = "summ_pc_report_menu";
	this.summ_preg_menu_id = "summ_preg_menu";
	this.summ_alert_menu_id = "summ_form_alert_menu";
	//make my variables and then make getters/setters
	this.resultCount = 0;
	this.asummI18nObj;
	//hovers
	this.tooltip = new MPageTooltip();
	this.m_summsummarycntdisp = 0;
	this.m_summresultsfyidisp = 0;
	this.m_summmedicalhomedisp = 0;
	this.m_summpateddisp = 0;
	this.m_summdepartdisp = 0;
	this.m_summmedrecdisp = 0;
	this.m_summhiedisp = 0;
	this.m_summdocexchangedisp = 0;
	this.m_summpregnancydisp = 0;
	this.m_summchiefcompdisp = 0;
	this.m_summaddinfodisp = 0;
	this.m_summaddinfonoresult = 0;
	this.m_summreltnpcpdisp = 0;
	this.m_summadvdirdisp = 0;
	this.m_summlmpdisp = 0;
	this.m_summalertsdisp = 0;
	this.m_summalertgbsdisp = 0;
	this.m_summalertadmindisp = 0;
	this.m_summalertclindisp = 0;
	this.m_summremindersdisp = 0;
	this.m_summstickynotesdisp = 0;
	this.m_summstickynotesadd = 0;
	this.m_summstickynotesmodify = 0;
	this.m_summstickynotesdelete = 0;
	this.m_summfutureapptdisp = 0;
	this.m_summpastvisitsdisp = 0;
	this.m_summaddressphonedisp = 0;
	this.m_summhealthplandisp = 0;
	this.m_summpatedlabel = "";
	this.m_summdepartlabel = "";
	this.m_summdepartsummtab = "";
	this.m_summmedreclabel = "";
	this.m_summhielabel = "";
	this.m_summhietab = "";
	this.m_summdocexchangelabel = "";
	this.m_summdocexchangetab = "";
	this.m_summpregnancyprg = "";
	this.m_summpregnancycomplink = "";
	this.m_summchiefcomplabel = "";
	this.m_summaddinfolabel = "";
	this.m_summreltnpcplabel = "";
	this.m_summadvdirlabel = "";
	this.m_summlmplabel = "";
	this.m_summalertslabel = "";
	this.m_summalertgbslabel = "";
	this.m_summalertadminlabel = "";
	this.m_summalertclinlabel = "";
	this.m_summreminderslabel = "";
	this.m_summstickynoteslabel = "";
	this.m_summfutureapptlabel = "";
	this.m_summpastvisitslabel = "";
	this.m_summaddressphonelabel = "";
	this.m_summhealthplanlabel = "";
	this.m_summsummarycntorders = [];
	this.m_summmedhomece = [];
	this.m_summdepartce = [];
	this.m_summchiefcompce = [];
	this.m_summaddinfoce = [];
	this.m_summadvdirdocumentce = [];
	this.m_summadvdirformce = [];
	this.m_summlmpce = [];
	this.m_summothereventsce = [];
	this.m_summotherenceventsce = [];
	this.m_summalertgbsce = [];
	this.m_summalertadmince = [];
	this.m_summalertclince = [];
	this.m_summalertotherce = [];
	this.m_summothereventsceseq = [];
	this.m_summotherenceventsceseq = [];
	this.m_summalertotherceseq = [];
	this.m_summpcreports = [];
	this.m_summpregnancypf = [];
	this.m_summalertspf = [];
	this.m_summreltnpcptype = [];
	this.m_summstickynotestypes = [];
	this.m_summchiefcomppf = 0.0;
	this.m_summaddinfopf = 0.0;
	this.m_summadvdirpf = 0.0;
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
AmbSummaryComponent.prototype = new MPageComponent();
AmbSummaryComponent.prototype.constructor = MPageComponent;
/* Supporting functions */
/*
 * @constructor Handles expanding/collapsing subsections in the component
 * @param {string} subsectionid : The subsectionid string contains id of the subsection row being expanded/collapsed.
 */
AmbSummaryComponent.prototype.expandCollapseSummarySubSections = function(subsectionid) {
	if ($('#' + subsectionid + '_rows').css('display') === 'block') {
		$('#' + subsectionid + '_rows').css('display', 'none');
		$('#' + subsectionid).attr('title', i18n.SHOW_SECTION);
		$('#' + subsectionid + '_tgl').removeClass().addClass('pwx-asumm_sub-sec-hd-tgl-close');
	}
	else {
		$('#' + subsectionid + '_rows').css('display', 'block');
		$('#' + subsectionid).attr('title', i18n.HIDE_SECTION);
		$('#' + subsectionid + '_tgl').removeClass().addClass('pwx-asumm_sub-sec-hd-tgl');
	}
};
/*
 * @constructor set expand collapse label name in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setexpandcollapselabelname = function(summ_label) {
	this.summ_expand_collapse_label = summ_label;
};
/*
 * @constructor get expand collapse label name in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getexpandcollapselabelname = function() {
	return this.summ_expand_collapse_label;
};
/*
 * @constructor set expand collapse icon name in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setexpandcollapseicon = function(summ_icon) {
	this.summ_expand_collapse_icon = summ_icon;
};
/*
 * @constructor get expand collapse icon name in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getexpandcollapseicon = function() {
	return this.summ_expand_collapse_icon;
};
/*
 * @constructor set expand collapse style name in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setexpandcollapsestyle = function(summ_style) {
	this.summ_expand_collapse_style = summ_style;
};
/*
 * @constructor get expand collapse style name in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getexpandcollapsestyle = function() {
	return this.summ_expand_collapse_style;
};
//for indicator
/*
 * @constructor set summary count display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummsummarycntdisp = function(value) {
	this.m_summsummarycntdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set result FYI display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummresultsfyidisp = function(value) {
	this.m_summresultsfyidisp = (value === true ? 1 : 0);
};
/*
 * @constructor set medical home display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummmedicalhomedisp = function(value) {
	this.m_summmedicalhomedisp = (value === true ? 1 : 0);
};
/*
 * @constructor set patient education display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummpateddisp = function(value) {
	this.m_summpateddisp = (value === true ? 1 : 0);
};
/*
 * @constructor set Depart display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummdepartdisp = function(value) {
	this.m_summdepartdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set medical reconcilliation display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummmedrecdisp = function(value) {
	this.m_summmedrecdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set HIE display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummhiedisp = function(value) {
	this.m_summhiedisp = (value === true ? 1 : 0);
};
/*
 * @constructor set Doc exchange display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummdocexchangedisp = function(value) {
	this.m_summdocexchangedisp = (value === true ? 1 : 0);
};
/*
 * @constructor set pregnancy display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummpregnancydisp = function(value) {
	this.m_summpregnancydisp = (value === true ? 1 : 0);
};
/*
 * @constructor set Cheif Complaint display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummchiefcompdisp = function(value) {
	this.m_summchiefcompdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set Additional info display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummaddinfodisp = function(value) {
	this.m_summaddinfodisp = (value === true ? 1 : 0);
};
/*
 * @constructor set Additional info result display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummaddinfonoresult = function(value) {
	this.m_summaddinfonoresult = (value === true ? 1 : 0);
};
/*
 * @constructor set PCP display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummreltnpcpdisp = function(value) {
	this.m_summreltnpcpdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set advance directive display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummadvdirdisp = function(value) {
	this.m_summadvdirdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set LMP display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummlmpdisp = function(value) {
	this.m_summlmpdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set alert display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertsdisp = function(value) {
	this.m_summalertsdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set alert gbs display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertgbsdisp = function(value) {
	this.m_summalertgbsdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set alert admin display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertadmindisp = function(value) {
	this.m_summalertadmindisp = (value === true ? 1 : 0);
};
/*
 * @constructor set alert clinical display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertclindisp = function(value) {
	this.m_summalertclindisp = (value === true ? 1 : 0);
};
/*
 * @constructor set reminder display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummremindersdisp = function(value) {
	this.m_summremindersdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set sticky note display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummstickynotesdisp = function(value) {
	this.m_summstickynotesdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set sticky note add indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummstickynotesadd = function(value) {
	this.m_summstickynotesadd = (value === true ? 1 : 0);
};
/*
 * @constructor set sticky note modify display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummstickynotesmodify = function(value) {
	this.m_summstickynotesmodify = (value === true ? 1 : 0);
};
/*
 * @constructor set sticky note delete display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummstickynotesdelete = function(value) {
	this.m_summstickynotesdelete = (value === true ? 1 : 0);
};
/*
 * @constructor set future appointment display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummfutureapptdisp = function(value) {
	this.m_summfutureapptdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set past visit display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummpastvisitsdisp = function(value) {
	this.m_summpastvisitsdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set addressphone display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummaddressphonedisp = function(value) {
	this.m_summaddressphonedisp = (value === true ? 1 : 0);
};
/*
 * @constructor set health display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummhealthplandisp = function(value) {
	this.m_summhealthplandisp = (value === true ? 1 : 0);
};
/*
 * @constructor get summary count display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummsummarycntdisp = function() {
	return this.m_summsummarycntdisp;
};
/*
 * @constructor get result FYI display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummresultsfyidisp = function() {
	return this.m_summresultsfyidisp;
};
/*
 * @constructor get medical home display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummmedicalhomedisp = function() {
	return this.m_summmedicalhomedisp;
};
/*
 * @constructor get patient education display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummpateddisp = function() {
	return this.m_summpateddisp;
};
/*
 * @constructor get Depart display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummdepartdisp = function() {
	return this.m_summdepartdisp;
};
/*
 * @constructor get medical reconcilliation display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummmedrecdisp = function() {
	return this.m_summmedrecdisp;
};
/*
 * @constructor get HIE display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummhiedisp = function() {
	return this.m_summhiedisp;
};
/*
 * @constructor get Doc exchange display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummdocexchangedisp = function() {
	return this.m_summdocexchangedisp;
};
/*
 * @constructor get pregnancy  display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummpregnancydisp = function() {
	return this.m_summpregnancydisp;
};
/*
 * @constructor get Cheif Complaint display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummchiefcompdisp = function() {
	return this.m_summchiefcompdisp;
};
/*
 * @constructor get Additional info indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummaddinfodisp = function() {
	return this.m_summaddinfodisp;
};
/*
 * @constructor get Additional info result display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummaddinfonoresult = function() {
	return this.m_summaddinfonoresult;
};
/*
 * @constructor get PCP  display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummreltnpcpdisp = function() {
	return this.m_summreltnpcpdisp;
};
/*
 * @constructor get advance directive  display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummadvdirdisp = function() {
	return this.m_summadvdirdisp;
};
/*
 * @constructor get LMP display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummlmpdisp = function() {
	return this.m_summlmpdisp;
};
/*
 * @constructor get alert display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertsdisp = function() {
	return this.m_summalertsdisp;
};
/*
 * @constructor get alert GBS display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertgbsdisp = function() {
	return this.m_summalertgbsdisp;
};
/*
 * @constructor get alert admin display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertadmindisp = function() {
	return this.m_summalertadmindisp;
};
/*
 * @constructor get alert clin indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertclindisp = function() {
	return this.m_summalertclindisp;
};
/*
 * @constructor get reminder indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummremindersdisp = function() {
	return this.m_summremindersdisp;
};
/*
 * @constructor get sticky note indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummstickynotesdisp = function() {
	return this.m_summstickynotesdisp;
};
/*
 * @constructor get sticky note add display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummstickynotesadd = function() {
	return this.m_summstickynotesadd;
};
/*
 * @constructor get sticky note modify  display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummstickynotesmodify = function() {
	return this.m_summstickynotesmodify;
};
/*
 * @constructor get sticky note delete display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummstickynotesdelete = function() {
	return this.m_summstickynotesdelete;
};
/*
 * @constructor get future appointment display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummfutureapptdisp = function() {
	return this.m_summfutureapptdisp;
};
/*
 * @constructor get past visit display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummpastvisitsdisp = function() {
	return this.m_summpastvisitsdisp;
};
/*
 * @constructor get addressphone display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummaddressphonedisp = function() {
	return this.m_summaddressphonedisp;
};
/*
 * @constructor get healthplan display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummhealthplandisp = function() {
	return this.m_summhealthplandisp;
};
// setter and getter for label or API link
/*
 * @constructor set patient education label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummpatedlabel = function(value) {
	this.m_summpatedlabel = value;
};
/*
 * @constructor set visit summary label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummdepartlabel = function(value) {
	this.m_summdepartlabel = value;
};
/*
 * @constructor set med reconcilliation tab name in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummdepartsummtab = function(value) {
	this.m_summdepartsummtab = value;
};
/*
 * @constructor set med reconcilliation label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummmedreclabel = function(value) {
	this.m_summmedreclabel = value;
};
/*
 * @constructor set HIE label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummhielabel = function(value) {
	this.m_summhielabel = value;
};
/*
 * @constructor set HIE tab name in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummhietab = function(value) {
	this.m_summhietab = value;
};
/*
 * @constructor set DOC exchange label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummdocexchangelabel = function(value) {
	this.m_summdocexchangelabel = value;
};
/*
 * @constructor set DOC exchange tab name in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummdocexchangetab = function(value) {
	this.m_summdocexchangetab = value;
};
/*
 * @constructor set pregnancy prg name in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummpregnancyprg = function(value) {
	this.m_summpregnancyprg = value;
};
/*
 * @constructor set pregnancy tab label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummpregnancycomplink = function(value) {
	this.m_summpregnancycomplink = value;
};
/*
 * @constructor set chief Complaint label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummchiefcomplabel = function(value) {
	this.m_summchiefcomplabel = value;
};
/*
 * @constructor set additional information label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummaddinfolabel = function(value) {
	this.m_summaddinfolabel = value;
};
/*
 * @constructor set PCP label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummreltnpcplabel = function(value) {
	this.m_summreltnpcplabel = value;
};
/*
 * @constructor set advance directive label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummadvdirlabel = function(value) {
	this.m_summadvdirlabel = value;
};
/*
 * @constructor set lmp label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummlmplabel = function(value) {
	this.m_summlmplabel = value;
};
/*
 * @constructor set alert label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertslabel = function(value) {
	this.m_summalertslabel = value;
};
/*
 * @constructor set alert gbs label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertgbslabel = function(value) {
	this.m_summalertgbslabel = value;
};
/*
 * @constructor set alert admin label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertadminlabel = function(value) {
	this.m_summalertadminlabel = value;
};
/*
 * @constructor set alert clinical label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertclinlabel = function(value) {
	this.m_summalertclinlabel = value;
};
/*
 * @constructor set reminder label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummreminderslabel = function(value) {
	this.m_summreminderslabel = value;
};
/*
 * @constructor set sticky note label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummstickynoteslabel = function(value) {
	this.m_summstickynoteslabel = value;
};
/*
 * @constructor set future appointment label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummfutureapptlabel = function(value) {
	this.m_summfutureapptlabel = value;
};
/*
 * @constructor set past visit label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummpastvisitslabel = function(value) {
	this.m_summpastvisitslabel = value;
};
/*
 * @constructor set addressphone label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummaddressphonelabel = function(value) {
	this.m_summaddressphonelabel = value;
};
/*
 * @constructor set health plan label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummhealthplanlabel = function(value) {
	this.m_summhealthplanlabel = value;
};
//getter for all label
/*
 * @constructor get patient education label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummpatedlabel = function() {
	return this.m_summpatedlabel;
};
/*
 * @constructor get visit summary label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummdepartlabel = function() {
	return this.m_summdepartlabel;
};
/*
 * @constructor get med reconcilliation tab name in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummdepartsummtab = function() {
	return this.m_summdepartsummtab;
};
/*
 * @constructor get med reconcilliation label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummmedreclabel = function() {
	return this.m_summmedreclabel;
};
/*
 * @constructor get HIE label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummhielabel = function() {
	return this.m_summhielabel;
};
/*
 * @constructor get HIE tab name in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummhietab = function() {
	return this.m_summhietab;
};
/*
 * @constructor get DOC exchange label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummdocexchangelabel = function() {
	return this.m_summdocexchangelabel;
};
/*
 * @constructor get DOC exchange tab name in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummdocexchangetab = function() {
	return this.m_summdocexchangetab;
};
/*
 * @constructor get pregnancy prg name label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummpregnancyprg = function() {
	return this.m_summpregnancyprg;
};
/*
 * @constructor get pregnancy tab label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummpregnancycomplink = function() {
	return this.m_summpregnancycomplink;
};
/*
 * @constructor get chief Complaint label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummchiefcomplabel = function() {
	return this.m_summchiefcomplabel;
};
/*
 * @constructor get additional information label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummaddinfolabel = function() {
	return this.m_summaddinfolabel;
};
/*
 * @constructor get PCP label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummreltnpcplabel = function() {
	return this.m_summreltnpcplabel;
};
/*
 * @constructor get advance directive label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummadvdirlabel = function() {
	return this.m_summadvdirlabel;
};
/*
 * @constructor get LMP label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummlmplabel = function() {
	return this.m_summlmplabel;
};
/*
 * @constructor get alert label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertslabel = function() {
	return this.m_summalertslabel;
};
/*
 * @constructor get alert gps label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertgbslabel = function() {
	return this.m_summalertgbslabel;
};
/*
 * @constructor get alert admin label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertadminlabel = function() {
	return this.m_summalertadminlabel;
};
/*
 * @constructor get alert clinical label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertclinlabel = function() {
	return this.m_summalertclinlabel;
};
/*
 * @constructor get reminder label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummreminderslabel = function() {
	return this.m_summreminderslabel;
};
/*
 * @constructor get sticky note label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummstickynoteslabel = function() {
	return this.m_summstickynoteslabel;
};
/*
 * @constructor get future appointment label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummfutureapptlabel = function() {
	return this.m_summfutureapptlabel;
};
/*
 * @constructor get past visit label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummpastvisitslabel = function() {
	return this.m_summpastvisitslabel;
};
/*
 * @constructor get addressphone label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummaddressphonelabel = function() {
	return this.m_summaddressphonelabel;
};
/*
 * @constructor get health plan label in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummhealthplanlabel = function() {
	return this.m_summhealthplanlabel;
};
//for type,eventset and mutilselect

/*
 * @constructor set Summary count order types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummsummarycntorders = function(value) {
	this.m_summsummarycntorders = value;
};
/*
 * @constructor set medical Home eventset filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummmedhomece = function(value) {
	this.m_summmedhomece = value;
};
/*
 * @constructor set summary depart types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummdepartce = function(value) {
	this.m_summdepartce = value;
};
/*
 * @constructor set Chief Complaint types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummchiefcompce = function(value) {
	this.m_summchiefcompce = value;
};
/*
 * @constructor set additional Information types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummaddinfoce = function(value) {
	this.m_summaddinfoce = value;
};
/*
 * @constructor set advance directive document eventset filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummadvdirdocumentce = function(value) {
	this.m_summadvdirdocumentce = value;
};
/*
 * @constructor set advance directive form filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummadvdirformce = function(value) {
	this.m_summadvdirformce = value;
};
/*
 * @constructor set LMP types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummlmpce = function(value) {
	this.m_summlmpce = value;
};
/*
 * @constructor set other eventset types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummothereventsce = function(value) {
	this.m_summothereventsce = value;
};
/*
 * @constructor set other encounter type eventset filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummotherenceventsce = function(value) {
	this.m_summotherenceventsce = value;
};
/*
 * @constructor set alert gbs type in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertgbsce = function(value) {
	this.m_summalertgbsce = value;
};
/*
 * @constructor set alert admin types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertadmince = function(value) {
	this.m_summalertadmince = value;
};
/*
 * @constructor set alert clinical types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertclince = function(value) {
	this.m_summalertclince = value;
};
/*
 * @constructor set alert other eventset filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertotherce = function(value) {
	this.m_summalertotherce = value;
};
/*
 * @constructor set alertother eventset sequence filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummothereventsceseq = function(value) {
	this.m_summothereventsceseq = value;
};
/*
 * @constructor set encounter eventset sequence types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummotherenceventsceseq = function(value) {
	this.m_summotherenceventsceseq = value;
};
/*
 * @constructor set alert other sequence types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertotherceseq = function(value) {
	this.m_summalertotherceseq = value;
};
/*
 * @constructor set PC report types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummpcreports = function(value) {
	this.m_summpcreports = value;
};
/*
 * @constructor set pregnancy powerform filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummpregnancypf = function(value) {
	this.m_summpregnancypf = value;
};
/*
 * @constructor set alert powerform types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummalertspf = function(value) {
	this.m_summalertspf = value;
};
/*
 * @constructor set PCP types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummreltnpcptype = function(value) {
	this.m_summreltnpcptype = value;
};
/*
 * @constructor set sticky note types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummstickynotestypes = function(value) {
	this.m_summstickynotestypes = value;
};
// getter for all type value
/*
 * @constructor get Summary count order types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummsummarycntorders = function() {
	return this.m_summsummarycntorders;
};
/*
 * @constructor get medical Home eventset filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummmedhomece = function() {
	return this.m_summmedhomece;
};
/*
 * @constructor get depart types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummdepartce = function() {
	return this.m_summdepartce;
};
/*
 * @constructor get Chief Complaint types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummchiefcompce = function() {
	return this.m_summchiefcompce;
};
/*
 * @constructor get additional Information types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummaddinfoce = function() {
	return this.m_summaddinfoce;
};
/*
 * @constructor get advance directive document eventset filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummadvdirdocumentce = function() {
	return this.m_summadvdirdocumentce;
};
/*
 * @constructor get advance directive form filter filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummadvdirformce = function() {
	return this.m_summadvdirformce;
};
/*
 * @constructor get LMP types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummlmpce = function() {
	return this.m_summlmpce;
};
/*
 * @constructor get other eventset types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummothereventsce = function() {
	return this.m_summothereventsce;
};
/*
 * @constructor get other encounter type eventset filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummotherenceventsce = function() {
	return this.m_summotherenceventsce;
};
/*
 * @constructor get alert gbs type  in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertgbsce = function() {
	return this.m_summalertgbsce;
};
/*
 * @constructor get alert admin types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertadmince = function() {
	return this.m_summalertadmince;
};
/*
 * @constructor get alert clinical types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertclince = function() {
	return this.m_summalertclince;
};
/*
 * @constructor get alert other eventset filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertotherce = function() {
	return this.m_summalertotherce;
};
/*
 * @constructor get alertother eventset sequence filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummothereventsceseq = function() {
	return this.m_summothereventsceseq;
};
/*
 * @constructor get encounter eventset sequence types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummotherenceventsceseq = function() {
	return this.m_summotherenceventsceseq;
};
/*
 * @constructor get alert other sequence types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertotherceseq = function() {
	return this.m_summalertotherceseq;
};
/*
 * @constructor get PC report types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummpcreports = function() {
	return this.m_summpcreports;
};
/*
 * @constructor get pregnancy powerform filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummpregnancypf = function() {
	return this.m_summpregnancypf;
};
/*
 * @constructor get alert powerform filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummalertspf = function() {
	return this.m_summalertspf;
};
/*
 * @constructor PCP types types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummreltnpcptype = function() {
	return this.m_summreltnpcptype;
};
/*
 * @constructor get sticky note types types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummstickynotestypes = function() {
	return this.m_summstickynotestypes;
};

//for single form
/*
 * @constructor set chief Complaint single powerform in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummchiefcomppf = function(value) {
	this.m_summchiefcomppf = value;
};
/*
 * @constructor set additional Information single powerform  in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummaddinfopf = function(value) {
	this.m_summaddinfopf = value;
};
/*
 * @constructor set Advance advance directive single powerform in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbSummaryComponent.prototype.setsummadvdirpf = function(value) {
	this.m_summadvdirpf = value;
};
/*
 * @constructor get chief Complaint single powerform in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummchiefcomppf = function() {
	return this.m_summchiefcomppf;
};
/*
 * @constructor get additional Information single powerform in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummaddinfopf = function() {
	return this.m_summaddinfopf;
};
/*
 * @constructor get Advance advance directive single powerform in the component
 * @return{string} : bedrock setting value.
 */
AmbSummaryComponent.prototype.getsummadvdirpf = function() {
	return this.m_summadvdirpf;
};
// pull out the bedrock setting
/*
 * @constructor map bedrock settings to variables
 */
AmbSummaryComponent.prototype.loadFilterMappings = function() {
	/* get type setting */
	this.addFilterMappingObject("SUMM_SUMMARY_CNT_ORDERS", {
		setFunction : this.setsummsummarycntorders,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_MEDHOME_CE", {
		setFunction : this.setsummmedhomece,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_DEPART_CE", {
		setFunction : this.setsummdepartce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_CHIEF_COMP_CE", {
		setFunction : this.setsummchiefcompce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_ADD_INFO_CE", {
		setFunction : this.setsummaddinfoce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_ADV_DIR_DOCUMENT_CE", {
		setFunction : this.setsummadvdirdocumentce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_ADV_DIR_FORM_CE", {
		setFunction : this.setsummadvdirformce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_LMP_CE", {
		setFunction : this.setsummlmpce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_OTHER_EVENTS_CE", {
		setFunction : this.setsummothereventsce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_OTHER_ENC_EVENTS_CE", {
		setFunction : this.setsummotherenceventsce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_ALERT_GBS_CE", {
		setFunction : this.setsummalertgbsce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_ALERT_ADMIN_CE", {
		setFunction : this.setsummalertadmince,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_ALERT_CLIN_CE", {
		setFunction : this.setsummalertclince,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_ALERT_OTHER_CE", {
		setFunction : this.setsummalertotherce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_OTHER_EVENTS_CE_SEQ", {
		setFunction : this.setsummothereventsceseq,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_OTHER_ENC_EVENTS_CE_SEQ", {
		setFunction : this.setsummotherenceventsceseq,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_ALERT_OTHER_CE_SEQ", {
		setFunction : this.setsummalertotherceseq,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_PC_REPORTS", {
		setFunction : this.setsummpcreports,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_PREGNANCY_PF", {
		setFunction : this.setsummpregnancypf,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_ALERTS_PF", {
		setFunction : this.setsummalertspf,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_RELTN_PCP_TYPE", {
		setFunction : this.setsummreltnpcptype,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_STICKY_NOTES_TYPES", {
		setFunction : this.setsummstickynotestypes,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	/*get single eventset setting */
	this.addFilterMappingObject("SUMM_CHIEF_COMP_PF", {
		setFunction : this.setsummchiefcomppf,
		type : "NUMBER",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_ADD_INFO_PF", {
		setFunction : this.setsummaddinfopf,
		type : "NUMBER",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("SUMM_ADV_DIR_PF", {
		setFunction : this.setsummadvdirpf,
		type : "NUMBER",
		field : "PARENT_ENTITY_ID"
	});
	/*get all label setreginfoidentifierslabel*/
	this.addFilterMappingObject("SUMM_PAT_ED_LABEL", {
		setFunction : this.setsummpatedlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_DEPART_LABEL", {
		setFunction : this.setsummdepartlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_DEPART_SUMM_TAB", {
		setFunction : this.setsummdepartsummtab,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_MEDREC_LABEL", {
		setFunction : this.setsummmedreclabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_HIE_LABEL", {
		setFunction : this.setsummhielabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_HIE_TAB", {
		setFunction : this.setsummhietab,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_DOCEXCHANGE_LABEL", {
		setFunction : this.setsummdocexchangelabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_DOCEXCHANGE_TAB", {
		setFunction : this.setsummdocexchangetab,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_PREGNANCY_PRG", {
		setFunction : this.setsummpregnancyprg,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_PREGNANCY_COMP_LINK", {
		setFunction : this.setsummpregnancycomplink,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_CHIEF_COMP_LABEL", {
		setFunction : this.setsummchiefcomplabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ADD_INFO_LABEL", {
		setFunction : this.setsummaddinfolabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_RELTN_PCP_LABEL", {
		setFunction : this.setsummreltnpcplabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ADV_DIR_LABEL", {
		setFunction : this.setsummadvdirlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_LMP_LABEL", {
		setFunction : this.setsummlmplabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ALERTS_LABEL", {
		setFunction : this.setsummalertslabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ALERT_GBS_LABEL", {
		setFunction : this.setsummalertgbslabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ALERT_ADMIN_LABEL", {
		setFunction : this.setsummalertadminlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ALERT_CLIN_LABEL", {
		setFunction : this.setsummalertclinlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_REMINDERS_LABEL", {
		setFunction : this.setsummreminderslabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_STICKY_NOTES_LABEL", {
		setFunction : this.setsummstickynoteslabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_FUTURE_APPT_LABEL", {
		setFunction : this.setsummfutureapptlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_PAST_VISITS_LABEL", {
		setFunction : this.setsummpastvisitslabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ADDRESS_PHONE_LABEL", {
		setFunction : this.setsummaddressphonelabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_HEALTH_PLAN_LABEL", {
		setFunction : this.setsummhealthplanlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	/*get display setting */
	this.addFilterMappingObject("SUMM_SUMMARY_CNT_DISP", {
		setFunction : this.setsummsummarycntdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_RESULTS_FYI_DISP", {
		setFunction : this.setsummresultsfyidisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_MEDICAL_HOME_DISP", {
		setFunction : this.setsummmedicalhomedisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_PAT_ED_DISP", {
		setFunction : this.setsummpateddisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_DEPART_DISP", {
		setFunction : this.setsummdepartdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_MEDREC_DISP", {
		setFunction : this.setsummmedrecdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_HIE_DISP", {
		setFunction : this.setsummhiedisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_DOCEXCHANGE_DISP", {
		setFunction : this.setsummdocexchangedisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_PREGNANCY_DISP", {
		setFunction : this.setsummpregnancydisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_CHIEF_COMP_DISP", {
		setFunction : this.setsummchiefcompdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ADD_INFO_DISP", {
		setFunction : this.setsummaddinfodisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ADD_INFO_NORESULT", {
		setFunction : this.setsummaddinfonoresult,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_RELTN_PCP_DISP", {
		setFunction : this.setsummreltnpcpdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ADV_DIR_DISP", {
		setFunction : this.setsummadvdirdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_LMP_DISP", {
		setFunction : this.setsummlmpdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ALERTS_DISP", {
		setFunction : this.setsummalertsdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ALERT_GBS_DISP", {
		setFunction : this.setsummalertgbsdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ALERT_ADMIN_DISP", {
		setFunction : this.setsummalertadmindisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ALERT_CLIN_DISP", {
		setFunction : this.setsummalertclindisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_REMINDERS_DISP", {
		setFunction : this.setsummremindersdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_STICKY_NOTES_DISP", {
		setFunction : this.setsummstickynotesdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_STICKY_NOTES_ADD", {
		setFunction : this.setsummstickynotesadd,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_STICKY_NOTES_MODIFY", {
		setFunction : this.setsummstickynotesmodify,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_STICKY_NOTES_DELETE", {
		setFunction : this.setsummstickynotesdelete,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_FUTURE_APPT_DISP", {
		setFunction : this.setsummfutureapptdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_PAST_VISITS_DISP", {
		setFunction : this.setsummpastvisitsdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_ADDRESS_PHONE_DISP", {
		setFunction : this.setsummaddressphonedisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("SUMM_HEALTH_PLAN_DISP", {
		setFunction : this.setsummhealthplandisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
};
/*
 * @constructor retrive data from ccl for component
 */
AmbSummaryComponent.prototype.retrieveComponentData = function() {
	var criterion = null;
	var request = null;
	var self = this;
	var sendAr = null;
	criterion = this.getCriterion();
	var prsnlInfo=criterion.getPersonnelInfo();
    var encntrs=prsnlInfo.getViewableEncounters();
    var encntrVal=(encntrs)?"value("+encntrs+")":"0.0";
    var encntrValScope=(this.getScope()==2)?"value("+criterion.encntr_id+".0 )":encntrVal;	
	sendAr = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0", criterion.position_cd + ".0", this.getsummsummarycntdisp(), this.getsummresultsfyidisp(), this.getsummmedicalhomedisp(), this.getsummdepartdisp(), this.getsummmedrecdisp(), this.getsummdocexchangedisp(), this.getsummpregnancydisp(), this.getsummchiefcompdisp(), this.getsummaddinfonoresult(), this.getsummreltnpcpdisp(), this.getsummadvdirdisp(), this.getsummlmpdisp(), this.getsummalertsdisp(), this.getsummalertclindisp(), this.getsummalertadmindisp(), this.getsummremindersdisp(), this.getsummstickynotesdisp(), this.getsummfutureapptdisp(), this.getsummpastvisitsdisp(), this.getsummaddressphonedisp(), this.getsummhealthplandisp(), MP_Util.CreateParamArray(this.getsummalertspf(), 1), MP_Util.CreateParamArray(this.getsummalertadmince(), 1), MP_Util.CreateParamArray(this.getsummalertclince(), 1), MP_Util.CreateParamArray(this.getsummalertotherce(), 1), MP_Util.CreateParamArray(this.getsummalertotherceseq(), 1), MP_Util.CreateParamArray(this.getsummothereventsce(), 1), MP_Util.CreateParamArray(this.getsummothereventsceseq(), 1), MP_Util.CreateParamArray(this.getsummotherenceventsce(), 1), MP_Util.CreateParamArray(this.getsummotherenceventsceseq(), 1), MP_Util.CreateParamArray(this.getsummpregnancypf(), 1), MP_Util.CreateParamArray(this.getsummaddinfoce(), 1), MP_Util.CreateParamArray(this.getsummadvdirdocumentce(), 1), MP_Util.CreateParamArray(this.getsummadvdirformce(), 1), MP_Util.CreateParamArray(this.getsummpcreports(), 1), MP_Util.CreateParamArray(this.getsummchiefcompce(), 1), MP_Util.CreateParamArray(this.getsummdepartce(), 1), MP_Util.CreateParamArray(this.getsummlmpce(), 1), MP_Util.CreateParamArray(this.getsummreltnpcptype(), 1), MP_Util.CreateParamArray(this.getsummsummarycntorders(), 1), MP_Util.CreateParamArray(this.getsummstickynotestypes(), 1), MP_Util.CreateParamArray(this.getsummmedhomece(), 1),encntrValScope];
	MP_Core.XMLCclRequestWrapper(this, "AMB_MP_PATIENT_SUMM_COMP", sendAr, true);
};
/*
 * @constructor render the component content
 * @param {object} reply : reply is the data JSON that CCL sent us back
 */
AmbSummaryComponent.prototype.renderComponent = function(reply) {
	var thiz = this;
	var results = null;
	this.asumI18nObj = i18n.discernabu.summary_o1;
	var criterion = this.getCriterion();
	var summcompId = this.getComponentId();
	var summcompIdContentElemID = 'pwx_summary_scroll_div' + summcompId;
	$("#" + summcompIdContentElemID).off();
	var pid = criterion.person_id;
	var eid = criterion.encntr_id;
	var uid = criterion.provider_id;
	var posid = criterion.position_cd;
	var i18npregexpand = this.asumI18nObj.EEGADET;
	var i18npregcollapse = this.asumI18nObj.COLLEGADET;
	var expUTC = "";
	var regUTC = "";
	var visitHTML = "";
	var visitdiagtext = "";
	var cnt = 0;
	var pwxhvron = ' ';
	var pwx_summ_border_type = "";
	var pwx_dec_str_val = "";
	var pwx_reminder_indicator = 0;
	var success_ind = false;
	//.....set the table and the name,age,gender,db row.................
	var pwx_summary_main_HTML = [];
	pwx_summary_main_HTML.push('<div class="pwx_asumm_div_scroll" id="' + summcompIdContentElemID + '">');

	var pwx_pc_reports_HTML = [];
	// Build header for printing the pc reports directly from mpages
	if (reply.DECEASED === 1) {
		var decHvrarray = [];
		var myHvr = [];
		myHvr.length = 1;
		myHvr[0] = ["",""];
		myHvr[0][0] = '' + this.asumI18nObj.DEC + ':';
		if (reply.DECEASED_STR === "1") {
			var decesed_str_summ = this.asumI18nObj.UNKNDATE;
			myHvr[0][1] = "--"
		}
		else {
		     var split_dec_String = "";
		     if (reply.DECEASED_STR_IND === 1) {
		     split_dec_String = reply.DECEASED_STR.split('_');}else{
			 split_dec_String = reply.DECEASED_STR.split('|');
			 }
			 var decUTCDate = new Date();
	         var deccUDate = "";
		     if (split_dec_String[0] !== '') {
		     	decUTCDate.setISO8601(split_dec_String[0]);
		     	deccUDate = decUTCDate.format("shortDate2");
		     } else {
		     	deccUDate = "--";
		     }
			 if (reply.DECEASED_STR_IND === 1) {
			    myHvr[0][1] = deccUDate + ' (' + this.asumI18nObj.AGE + '' + split_dec_String[1];
			 }
			 else {
				myHvr[0][1] = deccUDate + ' (' + this.asumI18nObj.FROM + '' + split_dec_String[1];
			 } 
		}
		pwx_dec_str_val = myHvr[0][1];
		decHvrarray.push(myHvr);
		pwx_pc_reports_HTML.push('<dl class="pwx-asumm_info pwx_asumm_blue2_border_top" id="pwx_summ_first_row" ><dt id="deceased_row" class="pwx_asumm_float_left_dt_wpad summ-info">', '<span class="pwx_asumm_semi_bold pwx_asumm_big_text">' + reply.PERSON_NAME + '</span>&nbsp;<span class="pwx_asumm_alert">(' + this.asumI18nObj.DEC + ')</span></dt>');
	}
	else {
		pwx_pc_reports_HTML.push('<dl class="pwx-asumm_info pwx_asumm_blue2_border_top" id="pwx_summ_first_row" ><dt class="pwx_asumm_float_left_dt_wpad">', '<span class="pwx_asumm_semi_bold pwx_asumm_big_text">' + reply.PERSON_NAME + '</span></dt>');
	}
	//if there are pcreports create the dropdown
	if (reply.PCREPORTS_LIST.length > 0) {
		var pcreportmenu = new Menu(this.summ_pc_report_menu_id);
		pcreportmenu.setTypeClass("menu-page-menu");
		pcreportmenu.setIsRootMenu(false);
		pcreportmenu.setAnchorElementId(this.summ_pc_report_menu_id);
		pcreportmenu.setAnchorConnectionCorner(["bottom", "right"]);
		pcreportmenu.setContentConnectionCorner(["top", "right"]);
		pcreportmenu.setLabel("");
		var summreportmenuitem = [];
		var pcreportlength = reply.PCREPORTS_LIST.length;
		MP_MenuManager.deleteMenuObject(this.summ_pc_report_menu_id, true);
		for (var i = 0; i < pcreportlength; i++) {
			summreportmenuitem[i] = new MenuItem(reply.PCREPORTS_LIST[i].PCREPORTS_TYPE + "|" + reply.PCREPORTS_LIST[i].PCREPORTS_PRG_NAME);
			summreportmenuitem[i].setLabel(reply.PCREPORTS_LIST[i].PCREPORTS_NAME);
			summreportmenuitem[i].setCloseOnClick(true);
			summreportmenuitem[i].setClickFunction(function() {
				var reportsplitarray = this.getId().split("|");
				var pcreportccllinkparams = '^MINE^,^' + reportsplitarray[0] + '^,^' + reportsplitarray[1] + '^,' + eid + ',' + pid;
				CCLLINK("amb_print_pc_reports", pcreportccllinkparams, 0);
				MP_MenuManager.deleteMenuObject(this.summ_pc_report_menu_id, true);
				thiz.retrieveComponentData();
			});
			pcreportmenu.addMenuItem(summreportmenuitem[i]);
		}
		MP_MenuManager.addMenuObject(pcreportmenu);
		pwx_pc_reports_HTML.push('<dt class="pwx_asumm_float_right_dt_wpad" style="padding-right:5px;"><a id="pwx_summ_report_menu_id_'+ summcompId +'" class="pwx_asumm_no_text_decor pwx_summ_report_menu" title="' + this.asumI18nObj.PPCREPORT + '"> ', '<span class="pwx-asumm_print-menu-icon pwx_asumm_no_text_decor" ></span></a></dt>');
	}
	pwx_pc_reports_HTML.push('</dl>');
	pwx_summary_main_HTML.push(pwx_pc_reports_HTML.join(""));
	var pwx_person_summ_HTML = [];
	var pt_age_summ = "";
	if (reply.PT_AGE === "2") {
		pt_age_summ = this.asumI18nObj.UNKN;
	}
	else {
		pt_age_summ = reply.PT_AGE;
	}
	var regbirthdate = "";
	if (reply.DOB !== "") {
	    var regbirthdateUTCDate = new Date();
	    regbirthdateUTCDate.setISO8601(reply.DOB);
	    regbirthdate = regbirthdateUTCDate.format("shortDate2");
	 } else {
	    regbirthdate = reply.DOB;
	}
	var personHTML = '<dt class="pwx_asumm_single_dt_wpad">' + pt_age_summ + ' ' + reply.GENDER_CHAR + '<span class="disabled">&nbsp;&nbsp;&nbsp;' + this.asumI18nObj.DOB + ': </span>' + regbirthdate + '</dt>';
	//is the visit for today?
	//create hover
	var visitdetailhvr = [];
	var visitUTCtime = "";
	var visitUTCdate = "";
	var encUTCDate = new Date();
	if (reply.VISIT_DATE !== '--') {
		encUTCDate.setISO8601(reply.VISIT_DATE);
		visitUTCdate = encUTCDate.format("shortDate2");
		visitUTCtime = encUTCDate.format("shortTime");
	}
	else {
		visitUTCdate = "--";
	}
	var discUTCDate = new Date();
	var discUDate = "";
	if (reply.DISCHARGE_DATE !== '--') {
		discUTCDate.setISO8601(reply.DISCHARGE_DATE);
		discUDate = discUTCDate.format("shortDate2");
	}
	else {
		discUDate = "--";
	}
	var myHvr = [];
	myHvr.length = 8;
	var row_cnt = 4;
	myHvr[0] = ["",""];
	myHvr[0][0] = 'FIN:';
	myHvr[0][1] = '' + this.asumI18nObj.FIN + '';
	myHvr[1] = ["",""];
	myHvr[1][0] = '' + this.asumI18nObj.REGDATE + ':';
	myHvr[1][1] = visitUTCdate + ' ' + visitUTCtime;
	myHvr[2] = ["",""];
	myHvr[2][0] = '' + this.asumI18nObj.DISDATE + ':';
	myHvr[2][1] = discUDate;
	myHvr[3] = ["",""];
	myHvr[3][0] = '' + this.asumI18nObj.LOC + ':';
	myHvr[3][1] = reply.VISIT_LOC;
	myHvr[4] = ["",""];
	myHvr[4][0] = '' + this.asumI18nObj.ORG + ':';
	myHvr[4][1] = reply.ORG_NAME;
	myHvr[5] = ["",""];
	myHvr[5][0] = '' + this.asumI18nObj.ENCTYPE + ':';
	myHvr[5][1] = reply.ENCNTR_TYPE;
	myHvr[6] = ["",""];
	myHvr[6][0] = '' + this.asumI18nObj.MEDSER + ':';
	myHvr[6][1] = reply.MEDICAL_SERVICE;
	myHvr[7] = ["",""];
	if (reply.VISIT_DIAG.length > 0) {
		myHvr[7][0] = '' + this.asumI18nObj.VISDIAG + '';
		myHvr[7][1] = reply.VISIT_DIAG.length;
		var cosantdiaglength = 15;
		diagcnt = myHvr.length;
		myHvr.length = diagcnt + 1;
		myHvr[diagcnt] = ["",""];
		myHvr[diagcnt][0] = '';
		visitdiagtext = '<span class="pwx_asumm_normal_line_height pwx_asumm_small_text">';
		if (reply.VISIT_DIAG.length > cosantdiaglength) {
			myHvr[7][1] = '('+cosantdiaglength+' ' + this.asumI18nObj.OF + ' ' + reply.VISIT_DIAG.length + ')';
			cnt = cosantdiaglength;
		}
		else {
			myHvr[7][1] = '(' + reply.VISIT_DIAG.length + ')';
			cnt = reply.VISIT_DIAG.length;
		}
		for (var i = 0; i < cnt; i++) {
			if (i !== 0) {
				visitdiagtext += '<br />';
			}
			visitdiagtext += '' + reply.VISIT_DIAG[i].DIAG_TEXT + ' <span class="disabled">(' + reply.VISIT_DIAG[i].CODE + ')</span>';
		}
		visitdiagtext += '<br />&nbsp;</span>';
		myHvr[diagcnt][1] = visitdiagtext;
	}
	else {
		myHvr[7][0] = '' + this.asumI18nObj.VISDIAG + ':';
		myHvr[7][1] = '' + this.asumI18nObj.NOVISDIAG + '';
	}
	visitdetailhvr.push(myHvr);
	//if visit is today then do not add exclamation point icon
	if (reply.VISIT_DATEDIFF === 0) {
		visitHTML = '<dt id="enc_row" class="pwx_asumm_visit_dt_wpad summ-info"><span class="disabled">' + this.asumI18nObj.VISI + ': </span>' + visitUTCdate + ' ' + visitUTCtime + ', <span class="disabled">' + reply.VISIT_LOC + '</span></dt>';
	}
	else {
		visitHTML = '<dt id="enc_row" class="pwx_asumm_visit_dt_wpad summ-info"><span class="disabled">' + this.asumI18nObj.VISI + ': </span>' + '<span title="' + this.asumI18nObj.VISITIT + '"><span class="pwx-asumm_highprio-icon" style="padding-right: 2px;">&nbsp;</span>' + visitUTCdate + ' ' + visitUTCtime + ',</span> <span class="disabled">' + reply.VISIT_LOC + '</span></dt>';
	}
	//set the summ html if it's on
	//add summary counts
	var cntHTML = "";
	if (this.getsummsummarycntdisp() === 1) {
		cntHTML = '<dt class="pwx_asumm_single_dt_wpad"><span class="disabled">' + this.asumI18nObj.NOTE + ' </span>' + reply.DOC_CNT + '<span class="disabled"> | ' + this.asumI18nObj.ORD + ' </span>' + reply.ORDER_CNT + '<span class="disabled"> | ' + this.asumI18nObj.CHARG + ' </span>' + reply.CHARGE_CNT + '<span class="disabled"> | ' + this.asumI18nObj.RX + ' </span>' + reply.RX_CNT + '</dt>';
	}
	else {
		cntHTML = '';
	}
	var notificationlineHTML = '';
	notificationlineHTML += '<dt class="pwx_asumm_single_dt_wpad">';
	//build the iqhealth cell
	var iqhvrarray = [];
	var phrUDate = "";
	if (reply.PHR_MESSAGING === "1") {
		var phrUTCDate = new Date();
		if (reply.PHR_DATE !== '--') {
			phrUTCDate.setISO8601(reply.PHR_DATE);
			phrUDate = phrUTCDate.format("shortDate2");
		}
		else {
			phrUDate = "--";
		}
		myHvr = [];
		myHvr.length = 4;
		myHvr[0] = ["",""];
		myHvr[0][0] = '' + this.asumI18nObj.INVDATE + ':';
		myHvr[0][1] = phrUDate;
		myHvr[1] = ["",""];
		myHvr[1][0] = '' + this.asumI18nObj.SYS + ':';
		myHvr[1][1] = reply.PHR_SYSTEM;
		myHvr[2] = ["",""];
		myHvr[2][0] = '' + this.asumI18nObj.APOOL + ':';
		myHvr[2][1] = reply.PHR_ALIAS_POOL;
		myHvr[3] = ["",""];
		myHvr[3][0] = '' + this.asumI18nObj.ALI + ':';
		myHvr[3][1] = reply.PHR_ALIAS;
		iqhvrarray.push(myHvr);
		notificationlineHTML += '<span id="iq_row" class="summ-info"><span class="disabled">' + this.asumI18nObj.PPOR + ' </span>' + this.asumI18nObj.YES + '</span>';
	}
	else {
		notificationlineHTML += '<span class="disabled">' + this.asumI18nObj.PPOR + ': </span>' + this.asumI18nObj.NO + '';
	}
	if (this.getsummresultsfyidisp() === 1) {
		var resulthvrarray = [];
		if (reply.RESULTS_FYI_TYPE !== "") {
			var resultfyiUTCDate = new Date();
			var resultfyiUDate = "";
			if (reply.RESULTS_FYI_DT !== '--') {
				resultfyiUTCDate.setISO8601(reply.RESULTS_FYI_DT);
				resultfyiUDate = resultfyiUTCDate.format("shortDate2");
			}
			else {
				resultfyiUDate = "--";
			}
			myHvr = ["",""];
			myHvr.length = 2;
			myHvr[0] = ["",""];
			myHvr[0][0] = '' + this.asumI18nObj.SDATE + ':';
			myHvr[0][1] = resultfyiUDate;
			myHvr[1] = ["",""];
			myHvr[1][0] = '' + this.asumI18nObj.STYPE + ':';
			//myHvr[1][1] = reply.RESULTS_FYI_TYPE;
			var expUTCDate = new Date();
			if (reply.RESULTS_EXP_DATE !== '--') {
				expUTCDate.setISO8601(reply.RESULTS_EXP_DATE);
				expUTC = expUTCDate.format("shortDate2");
			}
			else {
				expUTC = "--";
			}
			var regUTCDate = new Date();
			if (reply.RESULTS_REG_ENC_DATE !== '--') {
				regUTCDate.setISO8601(reply.RESULTS_REG_ENC_DATE);
				regUTC = regUTCDate.format("shortDate2");
			}
			else {
				regUTC = "--";
			}
			if (reply.RESULTS_FYI_FLAG_TYPE === 1) {
				myHvr[1][1] = this.asumI18nObj.ACTREL;
			}
			else if (reply.RESULTS_FYI_FLAG_TYPE === 3 && reply.RESULTS_FYI_ENC_ID !== 0) {
				myHvr[1][1] = this.asumI18nObj.VIS + " " + regUTC;
			}
			else if (reply.RESULTS_FYI_FLAG_TYPE === 3 && reply.RESULTS_FYI_ENC_ID === 0 && expUTC !== "12/30/2100") {
				myHvr[1][1] = this.asumI18nObj.EXPI + " " + expUTC;
			}
			else if (reply.RESULTS_FYI_FLAG_TYPE === 3 && reply.RESULTS_FYI_ENC_ID === 0 && expUTC === "12/30/2100") {
				myHvr[1][1] = this.asumI18nObj.INDEFI;
			}

			if (reply.RESULTSUB.length > 0) {
				myHvr.length = 4;
				myHvr[2] = ["",""];
				myHvr[2][0] = '' + this.asumI18nObj.PSUB + ':';
				myHvr[2][1] = '';
				myHvr[3] = ["",""];
				myHvr[3][0] = '';
				var fyiuserHTML = '<span class="pwx_asumm_normal_line_height pwx_asumm_small_text">';
				//iterate through others subscribed to patient results
				for (var i = 0; i < reply.RESULTSUB.length; i++) {
					var subscribUTCDate = new Date();
					var subscribUDate = "";
					if (reply.RESULTSUB[i].SUBSCRIB_DATE !== '--') {
						subscribUTCDate.setISO8601(reply.RESULTSUB[i].SUBSCRIB_DATE);
						subscribUDate = subscribUTCDate.format("shortDate2");
					}
					else {
						subscribUDate = "--";
					}
					fyiuserHTML += reply.RESULTSUB[i].NAME + ' <span class="disabled">(' + subscribUDate + ')</span></br>';
				}
				myHvr[3][1] = fyiuserHTML + '</span>';
			}
			else {
				myHvr.length = 3;
				myHvr[2] = ["",""];
				myHvr[2][0] = '' + this.asumI18nObj.PSUB + ':';
				myHvr[2][1] = '--';
			}
			resulthvrarray.push(myHvr);
			notificationlineHTML += '<span class="disabled">&nbsp;| </span><span id="fyi_row" class="summ-info"><span class="disabled">' + this.asumI18nObj.RFYI + ': </span>' + this.asumI18nObj.YES + '</span>';
		}
		else {
			notificationlineHTML += '<span class="disabled">&nbsp;| ' + this.asumI18nObj.RFYI + ': </span>' + this.asumI18nObj.NO + '</span>';
		}
	}
	else {
		notificationlineHTML += '';
	}
	//patient medical home display on and result found?
	if (this.getsummmedicalhomedisp() === 1 && reply.MED_HOME_VALUE !== "") {
		var medhvrarray = [];
		myHvr = [];
		myHvr.length = 2;
		myHvr[0] = ["",""];
		myHvr[0][0] = '' + this.asumI18nObj.MHOME + ':';
		myHvr[0][1] = reply.MED_HOME_VALUE;
		myHvr[1] = ["",""];
		myHvr[1][0] = '' + this.asumI18nObj.DAT + ':';
		if (reply.MED_HOME_DT === "") {
			myHvr[1][1] = "--";
		}
		else {
			var medHOMEUTCDate = new Date();
			medHOMEUTCDate.setISO8601(reply.MED_HOME_DT);
			var medHOMEUDate = medHOMEUTCDate.format("shortDate2");
			myHvr[1][1] = medHOMEUDate;
		}
		medhvrarray.push(myHvr);
		notificationlineHTML += '<span class="disabled">&nbsp;|</span> <span id="med_row" class="summ-info"><span class="disabled">' + this.asumI18nObj.PCMH + ': </span>' + reply.MED_HOME_VALUE + '</span>';
	}
	notificationlineHTML += '<dt>';
	pwx_person_summ_HTML.push('<dl class="pwx-asumm_info pwx_asumm_blue2_border_bottom">' + personHTML + visitHTML + cntHTML + notificationlineHTML + '</dl>');
	pwx_summary_main_HTML.push(pwx_person_summ_HTML.join(""));
	
	
	//.....set the buttons.....................
	var btnHTML = '';
	
	// nursing location there if not dither?
	if (reply.PATED_IND > 0) {
		//patient education button on?
		if (this.getsummpateddisp() === 1) {
			btnHTML += '<div class="pwx_asumm_btn-seg-cntrl pwx_pat_summ_btn pwx_pat_ed_launch" title="' + this.asumI18nObj.LPEDU + '">' + '<div class="pwx_asumm_btnLeft"></div><div class="pwx_asumm_btnCenter">' + this.getsummpatedlabel() + ' <span class="disabled">(' + reply.PATED_CNT + ')</span></div><div class="pwx_asumm_btnRight"></div></div>';
		}
		//visit summary button on?
		var visit_sum_btn_icon = "";
		if (this.getsummdepartdisp() === 1) {
			//set icon depending on if a visit summary is found already
			if (reply.VISITSUM_IND === 1) {
				visit_sum_btn_icon = '<span class="pwx-asumm_full_circle-note-icon pwx_asumm_button_st" title="' + this.asumI18nObj.COMP + '"></span>';
			}
			else {
				visit_sum_btn_icon = '<span class="pwx-asumm_empty_circle-icon pwx_asumm_button_st" title="' + this.asumI18nObj.INCOMP + '"></span>';
			}
			//launch to visit summary tab is configured otherwise use depart process
			if (this.getsummdepartsummtab() === "") {
				btnHTML += '<div class="pwx_asumm_btn-seg-cntrl pwx_pat_summ_btn pwx_visit_sum_launch" title="' + this.asumI18nObj.LVISDEPSUMM + '">' + '<div class="pwx_asumm_btnLeft"></div><div class="pwx_asumm_btnCenter">' + visit_sum_btn_icon + '&nbsp;' + this.getsummdepartlabel() + '</div><div class="pwx_asumm_btnRight"></div></div>';
			}
			else {
				btnHTML += '<div class="pwx_asumm_btn-seg-cntrl pwx_pat_summ_btn" title="' + this.asumI18nObj.LVISSUMM + '" ' + 'onClick="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + pid + ' /ENCNTRID=' + eid + ' /FIRSTTAB=^' + this.getsummdepartsummtab() + '^\')">' + '<div class="pwx_asumm_btnLeft"></div><div class="pwx_asumm_btnCenter">' + visit_sum_btn_icon + '&nbsp;' + this.getsummdepartlabel() + '</div><div class="pwx_asumm_btnRight"></div></div>';
			}
		}
	}
	else {
		//patient education button on?
		if (this.getsummpateddisp() === 1) {
			btnHTML += '<div class="pwx_asumm_btn-seg-cntrl pwx_pat_summ_btn pwx_asumm_dithered_button" title="' + this.asumI18nObj.NAVAILEDU + '">' + '<div class="pwx_asumm_btnLeft"></div><div class="pwx_asumm_btnCenter">' + this.getsummpatedlabel() + '</div><div class="pwx_asumm_btnRight"></div></div>';
		}
		//visit summary button on?
		if (this.getsummdepartdisp() === 1) {
			btnHTML += '<div class="pwx_asumm_btn-seg-cntrl pwx_pat_summ_btn pwx_asumm_dithered_button" title="' + this.asumI18nObj.NAVAILDEPA + '" >' + '<div class="pwx_asumm_btnLeft"></div><div class="pwx_asumm_btnCenter">' + this.getsummdepartlabel() + '</div><div class="pwx_asumm_btnRight"></div></div>';
		}
	}//(reply.PATED_IND > 0)
	//is med rec button on or off?
	var med_rec_btn_icon = "";
	if (this.getsummmedrecdisp() === 1) {
		//set icon and text depending on med rec completion
		if (reply.MED_REC_IND === 1) {
			med_rec_btn_icon = '<span class="pwx-asumm_full_circle-note-icon pwx_asumm_button_st" title="' + this.asumI18nObj.COMP + '"></span>';
		}
		else if (reply.MED_REC_IND === 2) {
			med_rec_btn_icon = '<span class="pwx-asumm_half_circle-note-icon pwx_asumm_button_st" title="' + this.asumI18nObj.PARTIAL + '"></span>';
		}
		else {
			med_rec_btn_icon = '<span class="pwx-asumm_empty_circle-icon pwx_asumm_button_st" title="' + this.asumI18nObj.COMP + '"></span>';
		}
		btnHTML += '<div class="pwx_asumm_btn-seg-cntrl pwx_pat_summ_btn pwx_med_rec_launch" title="' + this.asumI18nObj.LDISMED + '">' + '<div class="pwx_asumm_btnLeft"></div><div class="pwx_asumm_btnCenter">' + med_rec_btn_icon + '&nbsp;' + this.getsummmedreclabel() + '</div><div class="pwx_asumm_btnRight"></div></div>';
	}//(reply.MED_REC_BTN_IND === 1)
	if (btnHTML !== '') {
		pwx_summary_main_HTML.push('<dl class="pwx_asumm_pat_summ_btn_row">' + btnHTML + '</dl>');
	}

	var btnHTML2 = '';
	if (this.getsummdocexchangedisp() === 1) {
		btnHTML2 += '<div class="pwx_asumm_btn-seg-cntrl pwx_pat_summ_btn" title="' + this.asumI18nObj.DOCEXC + '" ' + 'onClick="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + pid + ' /ENCNTRID=' + eid + ' /FIRSTTAB=^' + this.getsummdocexchangetab() + '^\')">' + '<div class="pwx_asumm_btnLeft"></div><div class="pwx_asumm_btnCenter">' + this.getsummdocexchangelabel() + ' <span class="disabled">(' + reply.DOCXCHG_NEW_CNT + '/' + reply.DOCXCHG_CNT + ')</span></div><div class="pwx_asumm_btnRight"></div></div>';
	}//(reply.DOCXCHG_BTN_IND === 1)
	if (this.getsummhiedisp() === 1) {
		btnHTML2 += '<div class="pwx_asumm_btn-seg-cntrl pwx_pat_summ_btn" title="' + this.asumI18nObj.HIE + '"' + 'onClick="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + pid + ' /ENCNTRID=' + eid + ' /FIRSTTAB=^' + this.getsummhietab() + '^\')">' + '<div class="pwx_asumm_btnLeft"></div><div class="pwx_asumm_btnCenter">' + this.getsummhielabel() + '</div><div class="pwx_asumm_btnRight"></div></div>';
	}//(reply.HIE_BTN_IND === 1)
	if (btnHTML2 !== '') {
		pwx_summary_main_HTML.push('<dl class="pwx_pat_summ_btn_row2">' + btnHTML2 + '</dl>');
	}
	// end of buttons
	//build pregnancy section to add later if preg indicator equals one
	
	var preghvrarray = [];
	if (reply.PREG_IND === 1) {
		var pregonsetUTCDate = new Date();
		var pregonsetUDate = "";
		if (reply.PREG_ONSET_DATE !== '--') {
			pregonsetUTCDate.setISO8601(reply.PREG_ONSET_DATE);
			pregonsetUDate = pregonsetUTCDate.format("shortDate2");
		}
		else {
			pregonsetUDate = "--";
		}
		var pregopendateUTCDate = new Date();
		var pregopendateUDate = "";
		if (reply.PREG_OPENED_DT !== '--') {
			pregopendateUTCDate.setISO8601(reply.PREG_OPENED_DT);
			pregopendateUDate = pregopendateUTCDate.format("shortDate2");
		}
		else {
			pregopendateUDate = "--";
		}
		var myHvr = [];
		myHvr.length = 4;
		myHvr[0] = ["",""];
		myHvr[0][0] = '' + this.asumI18nObj.ONSET + ':';
		myHvr[0][1] = pregonsetUDate;
		myHvr[1] = ["",""];
		myHvr[1][0] = '' + this.asumI18nObj.METH + ':';
		myHvr[1][1] = reply.PREG_CONFIRM_METHOD;
		myHvr[2] = ["",""];
		myHvr[2][0] = '' + this.asumI18nObj.OPENDATE + ':';
		myHvr[2][1] = pregopendateUDate;
		myHvr[3] = ["",""];
		myHvr[3][0] = '' + this.asumI18nObj.OPENBY + ':';
		myHvr[3][1] = reply.PREG_OPENED_BY;
		preghvrarray.push(myHvr);
		pwx_summary_main_HTML.push('<dl id="preg_row" class="pwx-asumm_info pwx_asumm_grey_dash_border_top pwx_preg_icon_hvr" style="padding-top: 3px;">');
		//add pregnancy summary link if available.
		pwx_summary_main_HTML.push('<dt id="preg_row" class="pwx_asumm_float_left_dt_wpad summ-info"><span class="pwx_asumm_semi_bold">', '' + this.asumI18nObj.PREGNT + '</span></dt>');
		if (this.getsummpregnancyprg() !== "") {
			var ccllinkparams = '^MINE^,^' + this.getsummpregnancyprg() + '^,' + pid + ',' + eid;
			pwx_summary_main_HTML.push('<dt class="pwx_asumm_float_mid_dt_wpad"><a href="javascript:CCLLINK(\'pwx_rpt_driver_to_mpage\',\'' + ccllinkparams + '\',0)" ', 'title="' + this.asumI18nObj.PSUMM + '"><span class="pwx_asumm_small_text">' + this.asumI18nObj.VSUMM + '</span></a></dt>');
		}
		//add the pregnancy buttons
		if (reply.CLOSE_PREG_ALLOW === 1) {
			pwx_summary_main_HTML.push('<dt id="close_' + reply.PREG_ID + '_'+ summcompId +'" class="pwx_asumm_float_right_dt_wpad pwx_asumm_pointer pwx_preg_launch" title="' + this.asumI18nObj.CSUMM + '"> ', '<span class="pwx-asumm_complete-icon">&nbsp;</span></dt>');
		}
		if (reply.ADD_PREG_ALLOW === 1) {
			pwx_summary_main_HTML.push('<dt id="modify_' + reply.PREG_ID + '_'+ summcompId +'" class="pwx_asumm_float_right_dt_wpad pwx_asumm_pointer pwx_preg_icon pwx_preg_launch" style="display:none;" title="' + this.asumI18nObj.MSUMM + '">', '<span class="pwx-asumm_modify-icon">&nbsp;</span></dt>');
		}
		pwx_summary_main_HTML.push('<dt id="' + reply.PREG_ID + '_'+ summcompId +'" class="pwx_asumm_float_right_dt_wpad pwx_asumm_pointer pwx_preg_icon pwx_fundalgraph_launch" style="display:none;" title="' + this.asumI18nObj.LFUNDA + '"> ', '<span class="pwx-asumm_graph-icon">&nbsp;</span></dt>');
		if (reply.ADD_PREG_ALLOW === 1) {
			pwx_summary_main_HTML.push('<dt id="cancel_' + reply.PREG_ID + '_'+ summcompId +'" class="pwx_asumm_float_right_dt_wpad pwx_asumm_pointer pwx_preg_icon pwx_preg_launch" style="display:none;" title="' + this.asumI18nObj.CASUMM + '"> ', '<span class="pwx-asumm_cancel-icon">&nbsp;</span></dt>');
		}
		pwx_summary_main_HTML.push('</dl>');
		pwx_summary_main_HTML.push('<dl class="pwx-asumm_info pwx_asumm_grey_dash_border_side">');
		pwx_summary_main_HTML.push('<dt class="pwx_asumm_float_left_dt_wpad">');
		if (reply.EDD_OVERDUE === 1) {
			pwx_summary_main_HTML.push('<span class="disabled"> <span class="pwx-asumm_highprio-icon">&nbsp;</span>&nbsp;' + this.asumI18nObj.EDD + ' </span>');
		}
		else {
			pwx_summary_main_HTML.push('<span class="disabled">' + this.asumI18nObj.EDD + ' </span>');
		}
		if (reply.EDD === "1") {
			if (reply.ADD_PREG_ALLOW === 1) {
				pwx_summary_main_HTML.push('<a  id="addedd_' + reply.PREG_ID + '_'+ summcompId +'" class="pwx_preg_launch" title="' + this.asumI18nObj.AEGA + '"> ', this.asumI18nObj.SAD + '&nbsp;&nbsp;</a>');
			}
			else {
				pwx_summary_main_HTML.push('--');
			}
		}
		else {
			if (reply.ADD_PREG_ALLOW === 1) {
				pwx_summary_main_HTML.push('<a  id="modifyedd_' + reply.EDD_ID + '_'+ summcompId +'" title="' + this.asumI18nObj.MEGA + '" class="pwx_asumm_result_link pwx_preg_launch"> ', reply.EDD + '</a>');
			}
			else {
				pwx_summary_main_HTML.push(reply.EDD);
			}
		}
		pwx_summary_main_HTML.push('<span class="disabled">&nbsp;&nbsp;' + this.asumI18nObj.EGA + ' </span>' + reply.EGA + '</dt>');
		if (this.getsummpregnancycomplink() !== "") {
			pwx_summary_main_HTML.push('<dt class="pwx_asumm_float_right_dt_wpad"><a class="pwx_asumm_result_link" title="' + this.asumI18nObj.GPHIST + '" ', 'href="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + pid + ' /ENCNTRID=' + eid + ' /FIRSTTAB=^' + this.getsummpregnancycomplink() + '^\')">' + reply.GRAVIDA_PARA + '</a></dt>');
		}
		else {
			pwx_summary_main_HTML.push('<dt class="pwx_asumm_float_right_dt_wpad">', reply.GRAVIDA_PARA, '</dt>');
		}
		pwx_summary_main_HTML.push('</dl>');
		pwx_summary_main_HTML.push('<dl class="pwx-asumm_info pwx_asumm_grey_dash_border_bottom" id="pwx_preg_sec_btm_'+ summcompId +'" ><dt class="pwx_asumm_float_left_dt_wpad">', '<span class="disabled pwx_asumm_pointer pwx_preg_sec_expand_collapse" title="' + this.asumI18nObj.EXEGA + '"><span class="pwx-asumm_sub-sec-hd-tgl-close" id="pwx_ega_tgl_btn_'+ summcompId +'">&nbsp;</span>', '' + this.asumI18nObj.EDDDE + ' (' + reply.OTHER_EGA.length + ')  </span>', '</dt>');
		//build the charted form menu if there is some found
		if (reply.PREG_FORMS.length > 0) {
			if (reply.PREG_FORMS.length === 1) {
				pwx_summary_main_HTML.push('<dt class="pwx_asumm_float_right_dt_wpad"><a id="' + reply.PREG_FORMS[0].FORM_ID + '" class="pwx_asumm_no_text_decor pwx_form_launch" title="' + this.asumI18nObj.LFORM + '"> ', '<span class="pwx-asumm_add-icon pwx_asumm_no_text_decor">&nbsp;</span></a></dt>');
			}
			else {
				var eddchartmenu = new Menu(this.summ_preg_menu_id);
				eddchartmenu.setTypeClass("menu-page-menu");
				eddchartmenu.setIsRootMenu(false);
				eddchartmenu.setAnchorElementId(this.summ_preg_menu_id);
				eddchartmenu.setAnchorConnectionCorner(["bottom", "right"]);
				eddchartmenu.setContentConnectionCorner(["top", "right"]);
				eddchartmenu.setLabel("");
				var eddchartmenuitem = [];
				var pregformlength = reply.PREG_FORMS.length;
				MP_MenuManager.deleteMenuObject(this.summ_preg_menu_id, true);
				for (var i = 0; i < pregformlength; i++) {
					var formid = "";
					formid = reply.PREG_FORMS[i].FORM_ID;
					eddchartmenuitem[i] = new MenuItem(reply.PREG_FORMS[i].FORM_ID);
					eddchartmenuitem[i].setLabel(reply.PREG_FORMS[i].FORM_NAME);
					eddchartmenuitem[i].setCloseOnClick(true);
					eddchartmenuitem[i].setClickFunction(function() {
						var paramString = pid + "|" + eid + "|" + this.getId() + "|" + 0.0 + "|" + 0;
						MPAGES_EVENT("POWERFORM", paramString);
						MP_MenuManager.deleteMenuObject(this.summ_preg_menu_id, true);
						thiz.retrieveComponentData();
					});
					eddchartmenu.addMenuItem(eddchartmenuitem[i]);
				}
				eddchartmenuitem[reply.PREG_FORMS.length + 1] = new MenuItem("Allform" + this.summ_preg_menu_id);
				eddchartmenuitem[reply.PREG_FORMS.length + 1].setLabel(this.asumI18nObj.ALLFO + '...');
				eddchartmenuitem[reply.PREG_FORMS.length + 1].setCloseOnClick(true);
				eddchartmenuitem[reply.PREG_FORMS.length + 1].setClickFunction(function() {
					var paramString = pid + "|" + eid + "|" + 0.0 + "|" + 0.0 + "|" + 0;
					MPAGES_EVENT("POWERFORM", paramString);
					MP_MenuManager.deleteMenuObject(this.summ_preg_menu_id, true);
					thiz.retrieveComponentData();
				});
				eddchartmenu.addMenuItem(eddchartmenuitem[reply.PREG_FORMS.length + 1]);
				MP_MenuManager.addMenuObject(eddchartmenu);

				pwx_summary_main_HTML.push('<dt class="pwx_asumm_float_right_dt_wpad"><a id="pwx_preg_chart_down_menu_'+ summcompId +'" class="pwx_asumm_no_text_decor pwx_preg_dp_menu" title="' + this.asumI18nObj.LFMENU + '"> ' + '<span class="pwx-asumm_add-icon-plus pwx_asumm_no_text_decor">&nbsp;</span><span class="pwx-asumm_add-icon-plus-arrow pwx_asumm_no_text_decor">&nbsp;</span></a></dt>');
			}
		}

		pwx_summary_main_HTML.push('</dl>');
		//build the ega details
		pwx_summary_main_HTML.push('<div class="pwx_asumm_small_text" id="pwx_preg_sec_ega_rows_'+ summcompId +'" style="display:none;">');
		if (reply.ADD_PREG_ALLOW === 1) {
			pwx_summary_main_HTML.push('<dl class="pwx-asumm_info pwx_asumm_grey_dash_border_side" style="padding-top:3px;"><dt class="pwx_asumm_single_dt_wpad"><a id="addedd_' + reply.PREG_ID + '_'+ summcompId +'" class="pwx_asumm_no_text_decor pwx_preg_launch" title="' + this.asumI18nObj.AEGA + '"> ', '<span class="pwx-asumm_add-icon pwx_asumm_no_text_decor">&nbsp;</span></a></dt></dl>');
		}
		if (reply.OTHER_EGA.length > 0) {
			var egahvrarray = [];
			var otheregalength = reply.OTHER_EGA.length;
			for (var i = 0; i < otheregalength; i++) {
				var egatypelabel = "";
				var egadetailUTCdate = new Date();
				var egadetailUdate = "";
				if (reply.OTHER_EGA[i].EGA_METHOD_DT !== '--') {
					egadetailUTCdate.setISO8601(reply.OTHER_EGA[i].EGA_METHOD_DT);
					egadetailUdate = egadetailUTCdate.format("shortDate2");
				}
				else {
					egadetailUdate = "--";
				}
				var egaresultUTCdate = new Date();
				var egaresultUdate = "";
				if (reply.OTHER_EGA[i].EGA_RESULT_DT !== '--') {
					egaresultUTCdate.setISO8601(reply.OTHER_EGA[i].EGA_RESULT_DT);
					egaresultUdate = egaresultUTCdate.format("shortDate2");
				}
				else {
					egaresultUdate = "--";
				}
				var myHvr = [];
				myHvr.length = 8;
				myHvr[0] = ["",""];
				myHvr[0][0] = '' + this.asumI18nObj.EGA + ':';
				myHvr[0][1] = reply.OTHER_EGA[i].EGA;
				myHvr[1] = ["",""];
				myHvr[1][0] = '' + this.asumI18nObj.EDD + ':';
				myHvr[1][1] = reply.OTHER_EGA[i].EDD;
				myHvr[2] = ["",""];
				myHvr[2][0] = '' + this.asumI18nObj.TYPE + ':';
				if (reply.OTHER_EGA[i].EGA_TYPE === 0) {
					egatypelabel = this.asumI18nObj.NAUTH;
				}
				else if (reply.OTHER_EGA[i].EGA_TYPE === 1) {
					egatypelabel = this.asumI18nObj.INTIAL;
				}
				else if (reply.OTHER_EGA[i].EGA_TYPE === 2) {
					egatypelabel = this.asumI18nObj.AUTH;
				}
				else if (reply.OTHER_EGA[i].EGA_TYPE === 3 || reply.OTHER_EGA[i].EGA_TYPE === 4) {
					egatypelabel = this.asumI18nObj.FINAL;
				}
				myHvr[2][1] = egatypelabel;
				myHvr[3] = ["",""];
				myHvr[3][0] = '' + this.asumI18nObj.METHDATE + ':';
				myHvr[3][1] = egadetailUdate;
				myHvr[4] = ["",""];
				myHvr[4][0] = '' + this.asumI18nObj.METH + ':';
				myHvr[4][1] = reply.OTHER_EGA[i].EGA_METHOD;
				myHvr[5] = ["",""];
				myHvr[5][0] = '' + this.asumI18nObj.CONFIRM + ':';
				myHvr[5][1] = reply.OTHER_EGA[i].EGA_CONFIRM;
				myHvr[6] = ["",""];
				myHvr[6][0] = '' + this.asumI18nObj.ENTDATE + ':';
				myHvr[6][1] = egaresultUdate;
				myHvr[7] = ["",""];
				myHvr[7][0] = '' + this.asumI18nObj.ENTBY + ':';
				myHvr[7][1] = reply.OTHER_EGA[i].EGA_RESULT_BY;
				egahvrarray.push(myHvr);
				var border_type = "";
				if ((i + 1) === reply.OTHER_EGA.length) {
					border_type = 'pwx_asumm_grey_dash_border_bottom';
				}
				else {
					border_type = 'pwx_asumm_grey_dash_border_side';
				}
				pwx_summary_main_HTML.push('<dl id="ega_row_' + i + '_'+ summcompId +'" class="pwx-asumm_info ' + border_type + ' summ-info"><dt class="pwx_asumm_3_col_left"><span class="disabled">' + this.asumI18nObj.EDD + ' </span>');
				if (reply.ADD_PREG_ALLOW === 1) {
					pwx_summary_main_HTML.push('<a  id="modifyedd_' + reply.OTHER_EGA[i].EDD_ID + '_'+ summcompId +'" title="' + this.asumI18nObj.MEGA + '" class="pwx_asumm_result_link pwx_preg_launch">', reply.OTHER_EGA[i].EDD + '</a>');
				}
				else {
					pwx_summary_main_HTML.push(reply.OTHER_EGA[i].EDD);
				}
				pwx_summary_main_HTML.push('</dt><dt class="pwx_asumm_3_col_mid">', egatypelabel + '</dt><dt class="pwx_asumm_3_col_right">' + reply.OTHER_EGA[i].EGA_METHOD);
				pwx_summary_main_HTML.push('</dt></dl>');
			}
		}
		else {
			pwx_summary_main_HTML.push('<dl class="pwx-asumm_info pwx_asumm_grey_dash_border_bottom"><dt class="pwx_asumm_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
		}
		pwx_summary_main_HTML.push('</div>');
	}
	//start of clinical events section
	pwx_summary_main_HTML.push('</dl>');
	
	var patsumm_clin_border_class = 'pwx_asumm_grey_border_top-info';
	
	//chief complaint on or off?
	var pwx_main_chief_HTML = [];
	if (this.getsummchiefcompdisp() === 1) {
		pwx_main_chief_HTML.push('<dl class="' + patsumm_clin_border_class + '">');
		patsumm_clin_border_class = 'pwx_asumm_grey_border-info';
		if (reply.CHIEF_COMP.length > 0) {
			pwx_main_chief_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummchiefcomplabel(), ':</dt><dd class="pwx_summ_2_col_value">');
			var chiefcomplength = reply.CHIEF_COMP.length;
			for (var cc = 0; cc < chiefcomplength; cc++) {
				var chief_text = '';
				if (cc === 0) {
					if (reply.CHIEF_COMP[cc].TEXT.length > 150) {
						chief_text = reply.CHIEF_COMP[cc].TEXT.substring(0, 150) + '...';
					}
					else {
						chief_text = reply.CHIEF_COMP[cc].TEXT;
					}

				}
				else {
					if (reply.CHIEF_COMP[cc].TEXT.length > 50) {
						chief_text = reply.CHIEF_COMP[cc].TEXT.substring(0, 50) + '...';
					}
					else {
						chief_text = reply.CHIEF_COMP[cc].TEXT;
					}
				}
				if (reply.CHIEF_COMP[cc].ID === 0) {
					pwx_main_chief_HTML.push(chief_text);
				}
				else {
					pwx_main_chief_HTML.push('<a id="' + reply.CHIEF_COMP[cc].ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_result_view_launch"  title="' + this.asumI18nObj.VRESULT + '"> ', chief_text + '</a>');
				}
				if ((cc + 1) !== reply.CHIEF_COMP.length) {
					pwx_main_chief_HTML.push('<span class="disabled"> | </span>');
				}
			}
			pwx_main_chief_HTML.push('</dd>');
		}
		else {
			if (this.getsummchiefcomppf() === 0.0) {
				pwx_main_chief_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled">' + this.getsummchiefcomplabel(), ':</dt><dd class="pwx_summ_2_col_value">--</dd>');
			}
			else {
				pwx_main_chief_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled">' + this.getsummchiefcomplabel() + ':</dt><dd class="pwx_summ_2_col_value"><a  id="' + this.getsummchiefcomppf() + '_'+ summcompId +'" class="pwx_form_launch" title="' + this.asumI18nObj.ADD + '"> ', '' + this.asumI18nObj.SAD + '</a></dd>');
			}
		}
		pwx_main_chief_HTML.push('</dl>');
	}
	pwx_summary_main_HTML.push(pwx_main_chief_HTML.join(""));
	//additional information on or off?
	var pwx_main_addit_info_HTML = [];
	if (this.getsummaddinfodisp() === 1) {
		if (reply.ADDIT_INFO.length > 0) {
			pwx_main_addit_info_HTML.push('<dl class="' + patsumm_clin_border_class + '">');
			patsumm_clin_border_class = 'pwx_asumm_grey_border-info';
			pwx_main_addit_info_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummaddinfolabel() + ':</dt><dd class="pwx_summ_2_col_value">');
			var additionalinfolength = reply.ADDIT_INFO.length;
			for (var cc = 0; cc < additionalinfolength; cc++) {
				var addinfo_text = '';
				if (cc === 0) {
					if (reply.ADDIT_INFO[cc].TEXT.length > 150) {
						addinfo_text = reply.ADDIT_INFO[cc].TEXT.substring(0, 150) + '...';
					}
					else {
						addinfo_text = reply.ADDIT_INFO[cc].TEXT;
					}

				}
				else {
					if (reply.ADDIT_INFO[cc].TEXT.length > 50) {
						addinfo_text = reply.ADDIT_INFO[cc].TEXT.substring(0, 50) + '...';
					}
					else {
						addinfo_text = reply.ADDIT_INFO[cc].TEXT;
					}
				}
				if (reply.ADDIT_INFO[cc].ID === 0) {
					pwx_main_addit_info_HTML.push(addinfo_text);
				}
				else {
					pwx_main_addit_info_HTML.push('<a id="' + reply.ADDIT_INFO[cc].ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_result_view_launch"  title="' + this.asumI18nObj.VRESULT + '"> ', addinfo_text + '</a>');
				}
				if ((cc + 1) !== reply.ADDIT_INFO.length) {
					pwx_main_addit_info_HTML.push('<span class="disabled"> | </span>');
				}
			}
			pwx_main_addit_info_HTML.push('</dd></dl>');
		}
		else {
			if (this.getsummaddinfonoresult() === 1) {
				if (this.getsummaddinfopf() === 0.0) {
					pwx_main_addit_info_HTML.push('<dl class="pwx_asumm_grey_border-info">');
					pwx_main_addit_info_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled">' + this.getsummaddinfolabel() + ':</dt><dd class="pwx_summ_2_col_value">', '--</dd></dl>');
				}
				else {
					pwx_main_addit_info_HTML.push('<dl class="pwx_asumm_grey_border-info">');
					pwx_main_addit_info_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled">' + this.getsummaddinfolabel() + '</dt><dd class="pwx_summ_2_col_value"><a  id="' + this.getsummaddinfopf() + '_'+ summcompId +'" class="pwx_form_launch" title="' + this.asumI18nObj.ADD + '"> ', '' + this.asumI18nObj.SAD + '</a></dd></dl>');
				}
			}
		}
	}
	pwx_summary_main_HTML.push(pwx_main_addit_info_HTML.join(""));
	//PCP on or off?
	var pwx_main_pcp_HTML = [];
	if (this.getsummreltnpcpdisp() === 1) {
		pwx_main_pcp_HTML.push('<dl class="' + patsumm_clin_border_class + '">');
		patsumm_clin_border_class = 'pwx_asumm_grey_border-info';
		if (reply.PCP !== "") {
			pwx_main_pcp_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummreltnpcplabel() + ':</dt><dd class="pwx_summ_2_col_value">', reply.PCP + '</dd>');
		}
		else {
			pwx_main_pcp_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummreltnpcplabel() + ':</dt><dd class="pwx_summ_2_col_value">', '--</dd>');
		}
		pwx_main_pcp_HTML.push('</dl>');
	}
	pwx_summary_main_HTML.push(pwx_main_pcp_HTML.join(""));
	//Advanced Directive on or off?
	var pwx_main_adv_dir_HTML = [];
	if (this.getsummadvdirdisp() === 1) {
		var adv_dir_value = "";
		var advdirhvrarray = [];
		patsumm_clin_border_class = 'pwx_asumm_grey_border-info';
		if (reply.ADV_DIR_ID !== 0.0) {
			var advUTCDate = new Date();
			var advUdate = "";
			if (reply.ADV_DIR_DT !== '--') {
				advUTCDate.setISO8601(reply.ADV_DIR_DT);
				advUDate = advUTCDate.format("shortDate2");
			}
			else {
				advUDate = "--";
			}
			pwx_main_adv_dir_HTML.push('<dl id="adv_row" class="' + patsumm_clin_border_class + ' summ-info">');
			var myHvr = [];
			myHvr.length = 4;
			myHvr[0] = ["",""];
			myHvr[0][0] = '' + this.asumI18nObj.NAME + ':';
			myHvr[0][1] = reply.ADV_DIR_CD_STR;
			myHvr[1] = ["",""];
			myHvr[1][0] = '' + this.asumI18nObj.RES + ':';
			if(reply.ADV_DIR_FLAG === 2 && reply.ADV_DIR_EVENT !== ""){
			adv_dir_value = reply.ADV_DIR + " (" + this.asumI18nObj.ONFILE + ")";}
			else if(reply.ADV_DIR_FLAG === 2 ){
			adv_dir_value = this.asumI18nObj.ONFILE;
			}else{
			adv_dir_value = reply.ADV_DIR;
			}
			myHvr[1][1] = adv_dir_value;  
			myHvr[2] = ["",""];
			myHvr[2][0] = '' + this.asumI18nObj.DAT + ':';
			myHvr[2][1] = advUDate;
			myHvr[3] = ["",""];
			myHvr[3][0] = '' + this.asumI18nObj.RESBY + ':';
			myHvr[3][1] = reply.ADV_DIR_BY;
			advdirhvrarray.push(myHvr);
			if (reply.ADV_DIR_FLAG === 2) {
				pwx_main_adv_dir_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummadvdirlabel() + ':</dt><dd class="pwx_summ_2_col_value">', '<a id="' + reply.ADV_DIR_ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_doc_view_launch"  title="' + this.asumI18nObj.VDOC + '"> ', adv_dir_value + '</a></dd>');
			}
			else if (reply.ADV_DIR_FLAG === 1) {
				pwx_main_adv_dir_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummadvdirlabel() + ':</dt><dd class="pwx_summ_2_col_value">', '<a id="' + reply.ADV_DIR_ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_lmp_launch"  title="' + this.asumI18nObj.VFORM + '"> ', adv_dir_value + '</a></dd>');
			}
			else {
				pwx_main_adv_dir_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummadvdirlabel() + ':</dt><dd class="pwx_summ_2_col_value">', '<a id="' + reply.ADV_DIR_ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_result_view_launch"  title="' + this.asumI18nObj.VRESULT + '"> ', adv_dir_value + '</a></dd>');
			}
		}
		else {
			pwx_main_adv_dir_HTML.push('<dl class="' + patsumm_clin_border_class + '">');
			if (this.getsummadvdirpf() === 0.0) {
				pwx_main_adv_dir_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummadvdirlabel() + ':</dt><dd class="pwx_summ_2_col_value">', '--</dd>');
			}
			else {
				pwx_main_adv_dir_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummadvdirlabel() +':</dt><dd class="pwx_summ_2_col_value"><a  id="' + this.getsummadvdirpf() + '_'+ summcompId +'" class="pwx_form_launch" title="' + this.asumI18nObj.ADD + '"> ', '' + this.asumI18nObj.SAD + '</a></dd>');
			}
		}
		//end dl and create hover
		pwx_main_adv_dir_HTML.push('</dl>');
	}
	
	
	pwx_summary_main_HTML.push(pwx_main_adv_dir_HTML.join(""));
	//LMP on or off?
	var pwx_main_lmp_HTML = [];
	if (this.getsummlmpdisp() === 1) {
		var lmphvrarray = [];
		if (reply.LMP !== "") {
			var LMPUTCDate = new Date();
			var LMPUDate = "";
			if (reply.LMP_DATE_IND === 1) {
				LMPUTCDate.setISO8601(reply.LMP);
				LMPUDate = LMPUTCDate.format("shortDate2");
			}
			else {
				LMPUDate = reply.LMP;
			}
			var myHvr = [];
			myHvr.length = 4;
			myHvr[0] = ["",""];
			myHvr[0][0] = '' + this.asumI18nObj.NAME + ':';
			myHvr[0][1] = reply.LMP_CD_STR;
			myHvr[1] = ["",""];
			myHvr[1][0] = '' + this.asumI18nObj.RES + ':';
			myHvr[1][1] = LMPUDate;
			myHvr[2] = ["",""];
			myHvr[2][0] = '' + this.asumI18nObj.DAT + ':';
			myHvr[2][1] = LMPUDate;
			myHvr[3] = ["",""];
			myHvr[3][0] = '' + this.asumI18nObj.RESBY + ':';
			myHvr[3][1] = reply.LMP_BY;
			lmphvrarray.push(myHvr);
			pwx_main_lmp_HTML.push('<dl id="lmp_row" class="' + patsumm_clin_border_class + ' summ-info">');
			patsumm_clin_border_class = 'pwx_asumm_grey_border-info';
			if (reply.LMP_INFO === 0) {
				pwx_main_lmp_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummlmplabel() + ':</dt><dd class="pwx_summ_2_col_value">', LMPUDate + '</dd>');
			}
			else {
				if (reply.LMP_FLAG === 1) {
					pwx_main_lmp_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummlmplabel() + ':</dt><dd class="pwx_summ_2_col_value">', '<a id="' + reply.LMP_ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_lmp_launch"  title="' + this.asumI18nObj.VFORM + '"> ', LMPUDate + '</a></dd>');
				}
				else {
					pwx_main_lmp_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + this.getsummlmplabel() + ':</dt><dd class="pwx_summ_2_col_value">', '<a id="' + reply.LMP_ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_result_view_launch"  title="' + this.asumI18nObj.VRESULT + '"> ', LMPUDate + '</a></dd>');
				}
			}
			//end dl and create hover
			pwx_main_lmp_HTML.push('</dl>');
		}
	}
	pwx_summary_main_HTML.push(pwx_main_lmp_HTML.join(""));
	// other clinical events present?
	var pwx_main_other_events_HTML = [];
	if (reply.OTHER_EVENTS.length > 0) {
		var clinicaleventhvrarray = [];
		var otherhvrindex = 0;
		var othereventclinlength = reply.OTHER_EVENTS.length;
		for (var cc = 0; cc < othereventclinlength; cc++) {
		    if(reply.OTHER_EVENTS[cc].OTHER_IND === 1){
			var SummothereventUTCDate = new Date();
			var SummothereventUDate = "";
			if (reply.OTHER_EVENTS[cc].RESULTED_DT !== '--') {
				SummothereventUTCDate.setISO8601(reply.OTHER_EVENTS[cc].RESULTED_DT);
				SummothereventUDate = SummothereventUTCDate.format("shortDate2");
			}
			else {
				SummothereventUDate = "--";
			}
			var SummothereventTextUTCDate = new Date();
			var SummothereventTextUDate = "--";
			if (reply.OTHER_EVENTS[cc].DATE_IND === 1) {
				SummothereventTextUTCDate.setISO8601(reply.OTHER_EVENTS[cc].DATE_TEXT);
				SummothereventTextUDate = SummothereventTextUTCDate.format("shortDate2");
			}
			else {
				SummothereventTextUDate = reply.OTHER_EVENTS[cc].TEXT;
			}
			var myHvr = [];
			myHvr.length = 4;
			myHvr[0] = ["",""];
			myHvr[0][0] = '' + this.asumI18nObj.NAME + ':';
			myHvr[0][1] = reply.OTHER_EVENTS[cc].LBL;
			myHvr[1] = ["",""];
			myHvr[1][0] = '' + this.asumI18nObj.RES + ':';
			myHvr[1][1] = SummothereventTextUDate;
			myHvr[2] = ["",""];
			myHvr[2][0] = '' + this.asumI18nObj.DAT + ':';
			myHvr[2][1] = SummothereventUDate;
			myHvr[3] = ["",""];
			myHvr[3][0] = '' + this.asumI18nObj.RESBY + ':';
			myHvr[3][1] = reply.OTHER_EVENTS[cc].RESULTED_BY;
			clinicaleventhvrarray.push(myHvr);
			pwx_main_other_events_HTML.push('<dl id="cevent_row_' + otherhvrindex + '" class="pwx_asumm_grey_border-info summ-info">');
			if (reply.OTHER_EVENTS[cc].ID === 0) {
				pwx_main_other_events_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + reply.OTHER_EVENTS[cc].LBL + ':</dt><dd class="pwx_summ_2_col_value">', SummothereventTextUDate + '</dd>');
			}
			else {
				if (reply.OTHER_EVENTS[cc].FLAG === 1) {
					pwx_main_other_events_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + reply.OTHER_EVENTS[cc].LBL + ':</dt><dd class="pwx_summ_2_col_value">', '<a id="' + reply.OTHER_EVENTS[cc].ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_lmp_launch"  title="' + this.asumI18nObj.VFORM + '"> ', SummothereventTextUDate + '</a></dd>');
				}
				else {
					pwx_main_other_events_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled ">' + reply.OTHER_EVENTS[cc].LBL + ':</dt><dd class="pwx_summ_2_col_value">', '<a id="' + reply.OTHER_EVENTS[cc].ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_result_view_launch"  title="' + this.asumI18nObj.VRESULT + '"> ', SummothereventTextUDate + '</a></dd>');
				}
			}
			pwx_main_other_events_HTML.push('</dl>');
			otherhvrindex = otherhvrindex + 1
		}
		}
	}
	pwx_summary_main_HTML.push(pwx_main_other_events_HTML.join(""));
	//add pregnancy history/add section?
	var pwx_main_preg_HTML = [];
	var pregclosedateUTCDate = new Date();
	var pregcloseUDate = "";
	if (reply.PREG_HIST_CLOSE_DT !== '--') {
		pregcloseUDate = reply.PREG_HIST_CLOSE_DT;
	}
	else {
		pregcloseUDate = "--";
	}
	var agecalc = Math.floor(getAge(reply.DOB));
	if (agecalc >= 10 && agecalc <= 65 && reply.PREG_IND !== 1 && reply.ADD_PREG_ALLOW === 1) {
		pwx_main_preg_HTML.push('<dl class="pwx_asumm_grey_dash_border-info"><dt class="pwx_asumm_float_left_dt_wpad"><a href = "#" class="pwx_addpreg_launch" title="' + this.asumI18nObj.APREG + '">', '<span class="pwx-asumm_add-icon pwx_asumm_no_text_decor">&nbsp;</span>' + this.asumI18nObj.PREG + '  </a></dt>');
		if (reply.PREG_HIST_FOUND === 1) {
			if (reply.PREG_HIST_REOPEN_IND === 1) {
				pwx_main_preg_HTML.push('<dt class="pwx_asumm_float_right_dt_wpad"><a  title="' + this.asumI18nObj.REOPEN + '" class="pwx_reopenpreg_launch" class="pwx_asumm_grey_link">', '<span class="disabled pwx_asumm_small_text">' + this.asumI18nObj.REOPEN_PREGNANCY + ' (' + pregcloseUDate + ')</span></a>');
			}
			else {
				pwx_main_preg_HTML.push('<dt class="pwx_asumm_float_right_dt_wpad"><span class="disabled pwx_asumm_small_text">' + this.asumI18nObj.LPREG + ' (' + pregcloseUDate + ')</span>');
			}
		}
		pwx_main_preg_HTML.push('</dt></dl>');
	}
	pwx_summary_main_HTML.push(pwx_main_preg_HTML.join(""));
	//end clin events
	//start alerts section
	var pwx_main_alert_HTML = [];
	if (this.getsummalertsdisp() === 1) {
		//build all the header except for text
		var pwxsummalertmenuHTML = "";
		var alert_title_id = '' + summcompId + 'alert';
		var alert_row_id = '' + summcompId + 'alert_rows';
		var alert_tgl_id = '' + summcompId + 'alert_tgl';
		pwx_main_alert_HTML.push('<div class="pwx-summ_user_pref_enable_disable"><dl class="pwxnopad_asumm-info" id="pwx-summ-alert-id"><dt class="pwx_asumm_single_sub_sec_dt"><a id="' + alert_title_id + '" class="pwx_asumm_sub_sec_link summinfo_main_section_evt" title="' + i18n.SHOW_SECTION + '"> ', '<h3 class="sub-sec-hd"><span id="' + alert_tgl_id + '" class="pwx-asumm_sub-sec-hd-tgl-close">-</span>');
		if (reply.ALERTS.length !== 0) {
			pwx_main_alert_HTML.push('<span class="pwx_asumm_alert">' + this.getsummalertslabel() + '<span class="pwx_asumm_small_text"> (' + reply.ALERTS.length + ')</span></span></h3></a></dt></dl></div>');
		}
		else {
			pwx_main_alert_HTML.push('<span class="sub-sec-title">' + this.getsummalertslabel() + '<span class="pwx_asumm_small_text"> (0)</span></span></h3></a></dt></dl></div>');
		}
		if (reply.ADD_PFORM.length > 0) {
			if (reply.ADD_PFORM.length === 1) {
				pwxsummalertmenuHTML += '<a id="' + reply.ADD_PFORM[0].FORM_ID + '_'+ summcompId +'" class="pwx_asumm_no_text_decor pwx_asumm_grey_link pwx_asumm_small_text pwx_form_launch" title="' + this.asumI18nObj.ALLFO + '"> ' + '<span class="pwx-asumm_add-icon pwx_asumm_no_text_decor">&nbsp;</span> ' + this.asumI18nObj.CFORM + ' </a>';
			}
			else {
				var alertchartmenu = new Menu(this.summ_alert_menu_id);
				alertchartmenu.setTypeClass("menu-page-menu");
				alertchartmenu.setIsRootMenu(false);
				alertchartmenu.setAnchorElementId(this.summ_alert_menu_id);
				alertchartmenu.setAnchorConnectionCorner(["bottom", "right"]);
				alertchartmenu.setContentConnectionCorner(["top", "right"]);
				alertchartmenu.setLabel("");
				var alertchartmenuitem = [];
				var addformlength = reply.ADD_PFORM.length;
				MP_MenuManager.deleteMenuObject(this.summ_alert_menu_id, true);
				for (var i = 0; i < addformlength; i++) {
					alertchartmenuitem[i] = new MenuItem(reply.ADD_PFORM[i].FORM_ID);
					alertchartmenuitem[i].setLabel(reply.ADD_PFORM[i].FORM_NAME);
					alertchartmenuitem[i].setCloseOnClick(true);
					alertchartmenuitem[i].setClickFunction(function() {
						var paramString = pid + "|" + eid + "|" + this.getId() + "|" + 0.0 + "|" + 0;
						MPAGES_EVENT("POWERFORM", paramString);
						MP_MenuManager.deleteMenuObject(this.summ_alert_menu_id, true);
						thiz.retrieveComponentData();
					});
					alertchartmenu.addMenuItem(alertchartmenuitem[i]);
				}
				alertchartmenuitem[reply.ADD_PFORM.length + 1] = new MenuItem("Allform" + this.summ_alert_menu_id);
				alertchartmenuitem[reply.ADD_PFORM.length + 1].setLabel(this.asumI18nObj.ALLFO + '...');
				alertchartmenuitem[reply.ADD_PFORM.length + 1].setCloseOnClick(true);
				alertchartmenuitem[reply.ADD_PFORM.length + 1].setClickFunction(function() {
					var paramString = pid + "|" + eid + "|" + 0.0 + "|" + 0.0 + "|" + 0;
					MPAGES_EVENT("POWERFORM", paramString);
					MP_MenuManager.deleteMenuObject(this.summ_alert_menu_id, true);
					thiz.retrieveComponentData();
				});
				alertchartmenu.addMenuItem(alertchartmenuitem[reply.ADD_PFORM.length + 1]);
				MP_MenuManager.addMenuObject(alertchartmenu);
				pwxsummalertmenuHTML += '<a id="' + 0.0 + '_'+ summcompId +'" class="pwx_asumm_no_text_decor pwx_asumm_grey_link pwx_asumm_small_text pwx_form_launch"  title="' + this.asumI18nObj.ALLFO + '"> ' + '<span class="pwx-asumm_add-icon-plus pwx_asumm_no_text_decor">&nbsp;</span> ' + this.asumI18nObj.CFORM + ' </a>' + '<a id="pwx_chart_menu_id_'+ summcompId +'" class="pwx_asumm_no_text_decor pwx_alert_chart_menu_launch" title="' + this.asumI18nObj.AQFORM + '"> ' + '<span class="pwx-asumm_add-icon-plus-arrow pwx_asumm_no_text_decor" id="pwx-summ-alert-dpdown-id">&nbsp;</span></a>';
			}
		}
		var alertHvrArray = [];
		//is alerts empty?
		if (reply.ALERTS.length !== 0) {
			//build the header and tbody
			pwx_main_alert_HTML.push('<div id="' + alert_row_id + '" style="display:none" class="pwx_asumm_white_background">');
			pwx_summ_border_type = 'pwx_asumm_grey_border_top-info';
			//call function to get drop down list
			pwx_main_alert_HTML.push('<dl class="pwx_asumm_grey_border_sides-info">' + pwxsummalertmenuHTML + '</dl>');
			//output results
			var alertindex = 0;
			var alertobjlength = reply.ALERTS.length;
            var alert_text_value = "";			
			for (var cc = 0; cc < alertobjlength; cc++) {
				var alert_static_label = "";
				alert_text_value = "--";	
			    var alertvalueUTCDate = new Date();
				if (reply.ALERTS[cc].ALERT_DATE_IND === 1) {
					alertvalueUTCDate.setISO8601(reply.ALERTS[cc].TEXT);
					alert_text_value = alertvalueUTCDate.format("shortDate2");
				}
				else {
					alert_text_value = reply.ALERTS[cc].TEXT;;
				}							
				if (reply.ALERTS[cc].ID === 0) {
					if (reply.ALERTS[cc].LABEL === "1") {
						alert_static_label = this.asumI18nObj.DEC;
					}
					else {
						alert_static_label = reply.ALERTS[cc].LABEL;
					}
					pwx_main_alert_HTML.push('<dl class="' + pwx_summ_border_type + ' pwx_asumm_small_text"><dt class="pwx_asumm_2_col_lbl disabled"> ' + alert_static_label + ':</dt><dd class="pwx_summ_2_col_value">', pwx_dec_str_val + '</dd></dl>');
				}
				else {
				   	var alerteventUTCDate = new Date();
					var alerteventUDate = "";
					if (reply.ALERTS[cc].RESULTED_DT !== '--') {
						alerteventUTCDate.setISO8601(reply.ALERTS[cc].RESULTED_DT);
						alerteventUDate = alerteventUTCDate.format("shortDate2");
					}
					else {
						alerteventUDate = "--";
					}
					var alertLabel = "";
					if (reply.ALERTS[cc].LABEL === "2") {
						alertLabel = this.getsummalertclinlabel();
					}
					else if(reply.ALERTS[cc].LABEL === "3") {
						alertLabel = this.getsummalertadminlabel();
					}else{
					    alertLabel = reply.ALERTS[cc].LABEL;
					}
					pwx_main_alert_HTML.push('<dl id="alert_row_' + alertindex + '" class="' + pwx_summ_border_type + ' pwx_asumm_small_text summ-info">');
					var myHvr = [];
					myHvr.length = 4;
					myHvr[0] = ["",""];
					myHvr[0][0] = '' + this.asumI18nObj.NAME + ':';
					myHvr[0][1] = alertLabel;
					myHvr[1] = ["",""];
					myHvr[1][0] = '' + this.asumI18nObj.RES + ':';
					myHvr[1][1] = alert_text_value;
					myHvr[2] = ["",""];
					myHvr[2][0] = '' + this.asumI18nObj.DAT + ':';
					myHvr[2][1] = alerteventUDate;
					myHvr[3] = ["",""];
					myHvr[3][0] = '' + this.asumI18nObj.RESBY + ':';
					myHvr[3][1] = reply.ALERTS[cc].RESULTED_BY;
					alertHvrArray.push(myHvr);
					if (reply.ALERTS[cc].FORM_IND === 1) {
						pwx_main_alert_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled">' + alertLabel + ':</dt><dd class="pwx_summ_2_col_value">', '<a id="' + reply.ALERTS[cc].ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_lmp_launch"  title="' + this.asumI18nObj.VFORM + '"> ', alert_text_value + '</a></dd>');
					}
					else if (reply.ALERTS[cc].FORM_IND === 2) {
						pwx_main_alert_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled">' + alertLabel + ':</dt><dd class="pwx_summ_2_col_value">', '<a id="' + reply.ALERTS[cc].ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_doc_view_launch"  title="' + this.asumI18nObj.VDOC + '"> ', alert_text_value + '</a></dd>');
					}
					else {
						pwx_main_alert_HTML.push('<dt class="pwx_asumm_2_col_lbl disabled">' + alertLabel + ':</dt><dd class="pwx_summ_2_col_value">', '<a id="' + reply.ALERTS[cc].ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_result_view_launch"  title="' + this.asumI18nObj.VRESULT + '"> ', alert_text_value + '</a></dd>');
					}
					alertindex = alertindex + 1;
					pwx_main_alert_HTML.push('</dl>');
				}
				pwx_summ_border_type = 'pwx_asumm_grey_border-info'; 
			}
			pwx_main_alert_HTML.push('</div>');
		}
		else {
			pwx_main_alert_HTML.push('<div id="' + alert_row_id + '" style="display:none" class="pwx_asumm_white_background">');
			pwx_main_alert_HTML.push('<dl class="pwx_asumm_grey_border_sides-info">' + pwxsummalertmenuHTML + '</dl>');
			pwx_main_alert_HTML.push('<dl class="pwx_asumm_grey_border_top-info pwx_asumm_small_text" id="' + alert_row_id + '"><dt class="pwx_asumm_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
			pwx_main_alert_HTML.push('</div>');
		}
	}
	pwx_summary_main_HTML.push(pwx_main_alert_HTML.join(""));
	//start reminders section
	var pwx_main_reminder_HTML = [];
	if (this.getsummremindersdisp() === 1) {
		var remindhvrarray = [];
		//build all the header except for text
		var remind_title_id = '' + summcompId + 'remind';
		var remind_row_id = '' + summcompId + 'remind_rows';
		var remind_tgl_id = '' + summcompId + 'remind_tgl';
		pwx_main_reminder_HTML.push('<div class="pwx-summ_user_pref_enable_disable"><dl class="pwxnopad_asumm-info"><dt class="pwx_asumm_single_sub_sec_dt"><a id="' + remind_title_id + '" class="pwx_asumm_sub_sec_link summinfo_main_section_evt" title="' + i18n.SHOW_SECTION + '"> ', '<h3 class="sub-sec-hd"><span id="' + remind_tgl_id + '" class="pwx-asumm_sub-sec-hd-tgl-close">-</span>');
		//is alerts empty?
		if (reply.REMINDERS.length !== 0) {
			//build the header and tbody
			pwx_reminder_indicator = 1;
			pwx_main_reminder_HTML.push('<span class="sub-sec-title">' + this.getsummreminderslabel() + '<span class="pwx_asumm_small_text"> (');
			if (reply.OVERDUE_CNT > 0) {
				pwx_main_reminder_HTML.push('<span class="pwx_asumm_alert">' + reply.OVERDUE_CNT + ' ' + this.asumI18nObj.OVERDUE + ' </span>');
			}
			else {
				pwx_main_reminder_HTML.push(reply.OVERDUE_CNT + ' ' + this.asumI18nObj.OVERDUE + ' ');
			}
			pwx_main_reminder_HTML.push('| ' + reply.CURRENT_CNT + ' ' + this.asumI18nObj.SDUE + ' | ' + reply.FUTURE_CNT + ' ' + this.asumI18nObj.FUTURE + ')</span></span></h3></a></dt></dl></div>', '<div id="' + remind_row_id + '" class="amb_reminder_div" style="display:none;overflow-y: auto">');
			//output results
			var reminderlength = reply.REMINDERS.length;
			for (var cc = 0; cc < reminderlength; cc++) {
				//create hover
				var duedateUTCDate = new Date();
				var duedateUDate = "";
				if (reply.REMINDERS[cc].DUE_DATE !== '--') {
					duedateUTCDate.setISO8601(reply.REMINDERS[cc].DUE_DATE);
					duedateUDate = duedateUTCDate.format("shortDate2");
				}
				else {
					duedateUDate = "--";
				}
				var createdateUTCDate = new Date();
				var createdateUDate = "";
				if (reply.REMINDERS[cc].CREATED_DT !== '--') {
					createdateUTCDate.setISO8601(reply.REMINDERS[cc].CREATED_DT);
					createdateUDate = createdateUTCDate.format("shortDate2");
				}
				else {
					createdateUDate = "--";
				}
				var updatedateUTCDate = new Date();
				var updatedateUDate = "";
				if (reply.REMINDERS[cc].UPDATED_DT !== '--') {
					updatedateUTCDate.setISO8601(reply.REMINDERS[cc].UPDATED_DT);
					updatedateUDate = updatedateUTCDate.format("shortDate2");
				}
				else {
					updatedateUDate = "--";
				}
				var showdateUTCDate = new Date();
				var showdateUDate = "";
				if (reply.REMINDERS[cc].SHOW_DATE !== '--') {
					showdateUTCDate.setISO8601(reply.REMINDERS[cc].SHOW_DATE);
					showdateUDate = showdateUTCDate.format("shortDate2");
				}
				else {
					showdateUDate = "--";
				}
				var myHvr = [];
				myHvr.length = 7;
				myHvr[0] = ["",""];
				myHvr[0][0] = '' + this.asumI18nObj.SUB + ':';
				myHvr[0][1] = reply.REMINDERS[cc].SUBJECT;
				myHvr[1] = ["",""];
				myHvr[1][0] = '' + this.asumI18nObj.DDATE + ':';
				myHvr[1][1] = duedateUDate;
				myHvr[2] = ["",""];
				myHvr[2][0] = '' + this.asumI18nObj.SCHART + ':';
				if (reply.REMINDERS[cc].DOC_YES_IND === "1") {
					myHvr[2][1] = this.asumI18nObj.YES + '(' + reply.REMINDERS[cc].DOC_TYPE + ')';
				}
				else {
					myHvr[2][1] = this.asumI18nObj.NO;
				}
				myHvr[3] = ["",""];
				myHvr[3][0] = '' + this.asumI18nObj.CREDATE + ':';
				myHvr[3][1] = createdateUDate;
				myHvr[4] = ["",""];
				myHvr[4][0] = '' + this.asumI18nObj.CREBY + ':';
				myHvr[4][1] = reply.REMINDERS[cc].CREATED_BY;
				myHvr[5] = ["",""];
				myHvr[5][0] = '' + this.asumI18nObj.UPDATE + ':';
				myHvr[5][1] = updatedateUDate;
				myHvr[6] = ["",""];
				myHvr[6][0] = '' + this.asumI18nObj.UPBY + ':';
				myHvr[6][1] = reply.REMINDERS[cc].UPDATED_BY;
				remindhvrarray.push(myHvr);
				//set priority cell string
				var priority_str = "";
				if (reply.REMINDERS[cc].PRIORITY_IND === 1) {
					priority_str = '<span class="pwx-asumm_highprio-icon">&nbsp;</span>';
				}
				else {
					priority_str = '';
				}
				//set the reminder type icon
				var remind_icon = "";
				if (reply.REMINDERS[cc].REMINDER_TYPE === 1) {
					remind_icon = '<span class="pwx-asumm_mail-icon">&nbsp;</span>';
				}
				else {
					remind_icon = '<span class="pwx-asumm_chart-icon">&nbsp;</span>';
				}
				var row_icon = '<dl id="remind_row_' + cc + '" class="pwx_asumm_grey_border-info pwx_asumm_small_text summ-info" style="overflow-y:hidden;"><dt class="pwx_asumm_remind_icon">' + priority_str + remind_icon + '</dt>';
				//future or not and display?
				if (reply.REMINDERS[cc].FUTURE_IND === 1) {
					pwx_main_reminder_HTML.push(row_icon + '<dt class="pwx_asumm_remind_subject"><a  id="' + reply.REMINDERS[cc].TASK_ID + '_'+ summcompId +'" class="pwx_asumm_grey_link pwx_reminder_launch" title="' + this.asumI18nObj.VREMINDER + '">', reply.REMINDERS[cc].SUBJECT + '</a></dt><dt class="pwx_asumm_remind_date"><span class="disabled">' + this.asumI18nObj.SHOW + ' ', showdateUDate + '</span></dt></dl>');
				}
				else {
					pwx_main_reminder_HTML.push(row_icon + '<dt class="pwx_asumm_remind_subject"><a id="' + reply.REMINDERS[cc].TASK_ID + '_'+ summcompId +'" class="pwx_asumm_result_link pwx_reminder_launch" title="' + this.asumI18nObj.VREMINDER + '">', reply.REMINDERS[cc].SUBJECT + '</a></dt>');
					// set due date if there and check for overdue:
					if (duedateUDate === "--") {
						pwx_main_reminder_HTML.push('<dt class="pwx_asumm_remind_date">&nbsp;</dt></dl>');
					}
					else {
						if (reply.REMINDERS[cc].OVERDUE_IND === 1) {
							pwx_main_reminder_HTML.push('<dt class="pwx_asumm_remind_date"><span class="pwx_asumm_alert">' + this.asumI18nObj.DUE + ' ', duedateUDate + '</span></dt></dl>');
						}
						else {
							pwx_main_reminder_HTML.push('<dt class="pwx_asumm_remind_date">' + this.asumI18nObj.DUE + ' ', duedateUDate + '</dt></dl>');
						}
					}
				}
			}
			pwx_main_reminder_HTML.push('</div>');
		}
		else {
			pwx_main_reminder_HTML.push('<span class="sub-sec-title">' + this.getsummreminderslabel() + '<span class="pwx_asumm_small_text"> (0 ' + this.asumI18nObj.OVERDUE + ' | 0 ' + this.asumI18nObj.SDUE + ' | 0 ' + this.asumI18nObj.FUTURE + ')</span></span></h3></a></dt></dl>', '<dl class="pwx_asumm_grey_border-info pwx_asumm_small_text" id="' + remind_row_id + '" style="display:none"><dt class="pwx_asumm_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
		}
	}
	pwx_summary_main_HTML.push(pwx_main_reminder_HTML.join(""));
	//start sticky notes section
	var pwx_main_sticky_note_HTML = [];
	if (this.getexpandcollapselabelname() === i18n.HIDE_SECTION) {
		this.setexpandcollapselabelname(i18n.HIDE_SECTION);
		this.setexpandcollapseicon("pwx-asumm_sub-sec-hd-tgl");
		this.setexpandcollapsestyle("display:block");
	}
	var pwx_summ_title_expand_collapse = this.getexpandcollapselabelname();
	var pwx_summ_icon_class_expand_collapse = this.getexpandcollapseicon();
	var pwx_summ_div_id_expand_collapse = this.getexpandcollapsestyle();
	if (this.getsummstickynotesdisp() === 1) {
		// array to hold string
		//build all the header except for text
		var stext = "";
		var snotehvrarray = [];
		var sid = 0;
		pwx_summ_border_type = 'pwx_asumm_grey_border_top-info';
		var sticky_title_id = '' + summcompId + 'sticky';
		var sticky_row_id = '' + summcompId + 'sticky_rows';
		var sticky_tgl_id = '' + summcompId + 'sticky_tgl';
		pwx_main_sticky_note_HTML.push('<div class="pwx-summ_user_pref_enable_disable"><dl class="pwxnopad_asumm-info"><dt class="pwx_asumm_single_sub_sec_dt"><a id="' + sticky_title_id + '" class="pwx_asumm_sub_sec_link summinfo_main_section_evt" title="' + pwx_summ_title_expand_collapse + '">', '<h3 class="sub-sec-hd"><span id="' + sticky_tgl_id + '" class="' + pwx_summ_icon_class_expand_collapse + '">-</span>');
		pwx_main_sticky_note_HTML.push('<span class="sub-sec-title">' + this.getsummstickynoteslabel() + '<span class="pwx_asumm_small_text"> (' + reply.S_NOTES.length + ')</span></span></h3></a></dt></dl></div>');
		//is sticky notes empty?
		if (reply.S_NOTES.length !== 0) {
			pwx_main_sticky_note_HTML.push('<div id="' + sticky_row_id + '" style="' + pwx_summ_div_id_expand_collapse + '" class="pwx_asumm_white_background">');
			if (this.getsummstickynotesadd() === 1) {
				pwx_main_sticky_note_HTML.push('<dl class="pwx_asumm_grey_border_sides-info"><a class="pwx_asumm_no_text_decor  pwx_asumm_grey_link pwx_asumm_small_text pwx_add_sticky_launch" title="' + this.asumI18nObj.ADDSTICKY + '"', '><span class="pwx-asumm_add-icon pwx_asumm_no_text_decor">&nbsp;</span> ' + this.asumI18nObj.NSTICKY + '</a></dl>');
			}
			//output results
			var stickynotelength = reply.S_NOTES.length;
			for (var cc = 0; cc < stickynotelength; cc++) {
				var noteUTCDate = new Date();
				var notUDate = "";
				var noteUTCtime = "";
				if (reply.S_NOTES[cc].NOTE_DATE !== '--') {
					noteUTCDate.setISO8601(reply.S_NOTES[cc].NOTE_DATE);
					notUDate = noteUTCDate.format("shortDate2");
					noteUTCtime = noteUTCDate.format("shortTime");
				}
				else {
					notUDate = "--";
				}
				myHvr = [];
				myHvr.length = 3;
				myHvr[0] = ["",""];
				myHvr[0][0] = '' + this.asumI18nObj.STICKYNO + ':';
				if (reply.S_NOTES[cc].LONG_NOTE_TEXT < 255) {
					myHvr[0][1] = reply.S_NOTES[cc].NOTE_TEXT;
				}
				else {
					myHvr[0][1] = reply.S_NOTES[cc].LONG_NOTE_TEXT;
				}
				myHvr[1] = ["",""];
				myHvr[1][0] = '' + this.asumI18nObj.AUH + ':';
				myHvr[1][1] = reply.S_NOTES[cc].NOTE_AUTHOR;
				myHvr[2] = ["",""];
				myHvr[2][0] = '' + this.asumI18nObj.DAT + ':';
				myHvr[2][1] = notUDate + ' ' + noteUTCtime;
				snotehvrarray.push(myHvr);
				if (reply.S_NOTES[cc].LONG_NOTE_TEXT < 255) {
					var displayStr = reply.S_NOTES[cc].NOTE_TEXT.replace(/\n/g, "");
					displayStr = reply.S_NOTES[cc].NOTE_TEXT.replace(/\r/g, "; ");
					pwx_main_sticky_note_HTML.push('<dl id="snote_row_' + cc + '_'+summcompId+'" class="' + pwx_summ_border_type + '  pwx_asumm_small_text summ-info">', '<dt class="pwx_asumm_single_dt_wpad"><a class="pwx_summ_sticky_note_anchor_id pwx_asumm_result_link" title="' + this.asumI18nObj.VSTICKY + '">' + displayStr + '<span class="disabled unit"> (', notUDate + ')</span><span class="pwx_summ_sticky_note_hidden_id" style="display:none">' + cc + '</span><span class="pwx_summ_sticky_note_hidden__long_id" style="display:none">0</span></a></dt></dl>');
					pwx_summ_border_type = 'pwx_asumm_grey_border-info';
				}
				else {
					var sticky_long_text_display_line = "";
					sticky_long_text_display_line += reply.S_NOTES[cc].LONG_NOTE_TEXT.substring(0, 200);
					sticky_long_text_display_line = sticky_long_text_display_line.replace(/\n/g, "");
					sticky_long_text_display_line = sticky_long_text_display_line.replace(/\r/g, "; ");
					sticky_long_text_display_line += '...';
					pwx_main_sticky_note_HTML.push('<dl id="snote_row_' + cc + '_'+summcompId+'" class="' + pwx_summ_border_type + '  pwx_asumm_small_text summ-info">', '<dt id="pwx_long_text_id_ind" class="pwx_asumm_single_dt_wpad"><a class="pwx_summ_sticky_note_anchor_id pwx_asumm_result_link" title="' + this.asumI18nObj.VSTICKY + '">' + sticky_long_text_display_line + '<span class="disabled unit"> (', notUDate + ')</span><span class="pwx_summ_sticky_note_hidden_id" style="display:none">' + cc + '</span><span class="pwx_summ_sticky_note_hidden__long_id" style="display:none">1</span></a></dt></dl>');
					pwx_summ_border_type = 'pwx_asumm_grey_border-info';
				}
			}
			//end div
			pwx_main_sticky_note_HTML.push('</div>');
		}
		else {
			if (this.getsummstickynotesadd() === 1) {
				pwx_main_sticky_note_HTML.push('<div id="' + sticky_row_id + '" style="' + pwx_summ_div_id_expand_collapse + '" class="pwx_asumm_white_background">');
				pwx_main_sticky_note_HTML.push('<dl class="pwx_asumm_grey_border_sides-info"><a class="pwx_asumm_no_text_decor  pwx_asumm_grey_link pwx_asumm_small_text pwx_add_sticky_launch" title="' + this.asumI18nObj.ADDSTICKY + '" ', '><span class="pwx-asumm_add-icon pwx_asumm_no_text_decor">&nbsp;</span> ' + this.asumI18nObj.NSTICKY + '</a></dl>');
				pwx_main_sticky_note_HTML.push('<dl class="pwx_asumm_grey_border_top-info pwx_asumm_small_text" id="' + sticky_row_id + '"><dt class="pwx_asumm_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
				pwx_main_sticky_note_HTML.push('</div>');
			}
			else {
				pwx_main_sticky_note_HTML.push('<div id="' + sticky_row_id + '" style="' + pwx_summ_div_id_expand_collapse + '" class="pwx_asumm_white_background">');
				pwx_main_sticky_note_HTML.push('<dl class="pwx_asumm_grey_border_top-info pwx_asumm_small_text" id="' + sticky_row_id + '"><dt class="pwx_asumm_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
				pwx_main_sticky_note_HTML.push('</div>');
			}
		}
	}
	pwx_summary_main_HTML.push(pwx_main_sticky_note_HTML.join(""));
	//start future appointments section
	var pwx_main_future_note_HTML = [];
	if (this.getsummfutureapptdisp() === 1) {
		//build all the header except for text
		var futureUTCDate = new Date();
		var futureUDate = "";
		if (reply.FUTURE_VISITS.length > 0) {
			if (reply.FUTURE_VISITS[0].FUTURE_DATE !== '--') {
				futureUTCDate.setISO8601(reply.FUTURE_VISITS[0].FUTURE_DATE);
				futureUDate = futureUTCDate.format("shortDate2");
			}
			else {
				futureUDate = "--";
			}
		}
		var future_title_id = '' + summcompId + 'future';
		var future_row_id = '' + summcompId + 'future_rows';
		var future_tgl_id = '' + summcompId + 'future_tgl';
		pwx_main_future_note_HTML.push('<div class="pwx-summ_user_pref_enable_disable"><dl class="pwxnopad_asumm-info"><dt class="pwx_asumm_single_sub_sec_dt"><a id="' + future_title_id + '" class="pwx_asumm_sub_sec_link summinfo_main_section_evt" title="' + i18n.SHOW_SECTION + '"> ', '<h3 class="sub-sec-hd"><span id="' + future_tgl_id + '" class="pwx-asumm_sub-sec-hd-tgl-close">-</span>');
		//is future appts empty?
		if (reply.FUTURE_VISITS.length !== 0) {
			//build the header and tbody
			pwx_main_future_note_HTML.push('<span class="sub-sec-title">' + this.getsummfutureapptlabel() + '<span class="pwx_asumm_small_text"> (' + reply.FUTURE_VISITS.length, ') ' + this.asumI18nObj.NEXT_VISITS + ' ' + futureUDate + '</span></span></h3></a></dt></dl></div>', '<div id="' + future_row_id + '" style="display:none">');
			//output results
			var futurelength = reply.FUTURE_VISITS.length;
			for (var cc = 0; cc < futurelength; cc++) {
				var futuresUTCDate = new Date();
				var futuresUDate = "";
				var futureUTCtime = "";
				if (reply.FUTURE_VISITS[cc].FUTURE_DATE !== '--') {
					futuresUTCDate.setISO8601(reply.FUTURE_VISITS[cc].FUTURE_DATE);
					futuresUDate = futuresUTCDate.format("shortDate2");
					futureUTCtime = futuresUTCDate.format("shortTime");
				}
				else {
					futuresUDate = "--";
				}
				pwx_main_future_note_HTML.push('<dl class="pwx_asumm_grey_border-info pwx_asumm_small_text"><dt class="pwx_asumm_single_dt_wpad">' + futuresUDate + ' ' + futureUTCtime, '<span class="disabled"> | ' + reply.FUTURE_VISITS[cc].DURATION + ' min | ' + reply.FUTURE_VISITS[cc].APPT_TYPE);
				if (reply.FUTURE_VISITS[cc].FUTURE_LOC !== '') {
					pwx_main_future_note_HTML.push(' | ' + reply.FUTURE_VISITS[cc].FUTURE_LOC);
				}
				pwx_main_future_note_HTML.push('</span></dt></dl>');
			}
			//end div
			pwx_main_future_note_HTML.push('</div>');
		}
		else {
			pwx_main_future_note_HTML.push('<span class="sub-sec-title">' + this.getsummfutureapptlabel() + '<span class="pwx_asumm_small_text"> (0)</span></span></h3></a></dt></dl>', '<dl class="pwx_asumm_grey_border-info pwx_asumm_small_text" id="' + future_row_id + '" style="display:none"><dt class="pwx_asumm_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
		}
	}
	pwx_summary_main_HTML.push(pwx_main_future_note_HTML.join(""));
	//start past appointments section
	var pwx_main_appointments_note_HTML = [];
	if (this.getsummpastvisitsdisp() === 1) {
		//build all the header except for text
		var pasthvrarray = [];
		var past_title_id = '' + summcompId + 'past';
		var past_row_id = '' + summcompId + 'past_rows';
		var past_tgl_id = '' + summcompId + 'past_tgl';
		pwx_main_appointments_note_HTML.push('<div class="pwx-summ_user_pref_enable_disable"><dl class="pwxnopad_asumm-info"><dt class="pwx_asumm_single_sub_sec_dt"><a id="' + past_title_id + '" class="pwx_asumm_sub_sec_link summinfo_main_section_evt" title="' + i18n.SHOW_SECTION + '"> ', '<h3 class="sub-sec-hd"><span id="' + past_tgl_id + '" class="pwx-asumm_sub-sec-hd-tgl-close">-</span>');
		//is past appointments empty?
		if (reply.PAST_VISITS.length !== 0) {
			//build the header and tbody
			pwx_main_appointments_note_HTML.push('<span class="sub-sec-title">' + this.getsummpastvisitslabel() + '<span class="pwx_asumm_small_text"> (' + reply.PAST_VISITS.length, ')</span></span></h3></a></dt></dl></div>', '<div id="' + past_row_id + '" style="display:none">');
			//output results
			var pastvisitlength = reply.PAST_VISITS.length;
			for (var cc = 0; cc < pastvisitlength; cc++) {
				//create hover
				var pastUTCDate = new Date();
				var pastUDate = "";
				if (reply.PAST_VISITS[cc].PAST_DATE !== '--') {
					pastUTCDate.setISO8601(reply.PAST_VISITS[cc].PAST_DATE);
					pastUDate = pastUTCDate.format("shortDate2");
				}
				else {
					pastUDate = "--";
				}
				var myHvr = [];
				myHvr.length = 5;
				myHvr[0] = ["",""];
				myHvr[0][0] = '' + this.asumI18nObj.DATE + ':';
				myHvr[0][1] = pastUDate;
				myHvr[1] = ["",""];
				myHvr[1][0] = '' + this.asumI18nObj.LOC + ':';
				myHvr[1][1] = reply.PAST_VISITS[cc].PAST_LOC;
				myHvr[2] = ["",""];
				myHvr[2][0] = '' + this.asumI18nObj.TYPE + ':';
				myHvr[2][1] = reply.PAST_VISITS[cc].ENCNTR_TYPE;
				myHvr[3] = ["",""];
				myHvr[3][0] = '' + this.asumI18nObj.MEDSER + ':';
				myHvr[3][1] = reply.PAST_VISITS[cc].MED_SERVICE;
				myHvr[4] = ["",""];
				if (reply.PAST_VISITS[cc].VISIT_DIAG.length > 0) {
					myHvr[4][0] = '' + this.asumI18nObj.VISDIAG + '';
					myHvr[4][1] = reply.PAST_VISITS[cc].VISIT_DIAG.length;
					diagcnt = myHvr.length;
					myHvr.length = diagcnt + 1;
					myHvr[diagcnt] = ["",""];
					myHvr[diagcnt][0] = '';
					visitdiagtext = '<span class="pwx_asumm_normal_line_height pwx_asumm_small_text">';
					if (reply.PAST_VISITS[cc].VISIT_DIAG.length > 15) {
						myHvr[4][1] = '(15 ' + this.asumI18nObj.OF + ' ' + reply.PAST_VISITS[cc].VISIT_DIAG.length + ')';
						cnt = 15;
					}
					else {
						myHvr[4][1] = '(' + reply.PAST_VISITS[cc].VISIT_DIAG.length + ')';
						cnt = reply.PAST_VISITS[cc].VISIT_DIAG.length;
					}
					for (var i = 0; i < cnt; i++) {
						if (i !== 0) {
							visitdiagtext += '<br />';
						}
						visitdiagtext += '' + reply.PAST_VISITS[cc].VISIT_DIAG[i].DIAG_TEXT + ' <span class="disabled">(' + reply.PAST_VISITS[cc].VISIT_DIAG[i].CODE + ')</span>';
					}
					visitdiagtext += '<br />&nbsp;</span>';
					myHvr[diagcnt][1] = visitdiagtext;
				}
				else {
					myHvr[4][0] = '' + this.asumI18nObj.VISDIAG + ':';
					myHvr[4][1] = '' + this.asumI18nObj.NOVISDIAG + '';
				}
				pasthvrarray.push(myHvr);
				pwx_main_appointments_note_HTML.push('<dl id="past_row_' + cc + '_'+ summcompId +'" class="pwx_asumm_grey_border-info pwx_asumm_small_text summ-info"><dt class="pwx_asumm_single_dt_wpad">' + pastUDate, '<span class="disabled"> | ' + reply.PAST_VISITS[cc].PAST_LOC + ' | ' + reply.PAST_VISITS[cc].ENCNTR_TYPE + '</span></dt></dl>');
			}
			//end div
			pwx_main_appointments_note_HTML.push('</div>');
		}
		else {
			pwx_main_appointments_note_HTML.push('<span class="sub-sec-title">' + this.getsummpastvisitslabel() + '<span class="pwx_asumm_small_text"> (0)</span></span></h3></a></dt></d>', '<dl class="pwx_asumm_grey_border-info pwx_asumm_small_text" id="' + past_row_id + '" style="display:none"><dt class="pwx_asumm_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
		}
	}
	pwx_summary_main_HTML.push(pwx_main_appointments_note_HTML.join(""));
	//start address/phone section
	var pwx_main_addy_sec_note_HTML = [];
	if (this.getsummaddressphonedisp() === 1) {
		//build all the header
		var addy_title_id = '' + summcompId + 'addy';
		var addy_row_id = '' + summcompId + 'addy_rows';
		var addy_tgl_id = '' + summcompId + 'addy_tgl';
		pwx_main_addy_sec_note_HTML.push('<div class="pwx-summ_user_pref_enable_disable"><dl class="pwxnopad_asumm-info"><dt class="pwx_asumm_single_sub_sec_dt"><a id="' + addy_title_id + '" class="pwx_asumm_sub_sec_link summinfo_main_section_evt" title="' + i18n.SHOW_SECTION + '"> ', '<h3 class="sub-sec-hd"><span id="' + addy_tgl_id + '" class="pwx-asumm_sub-sec-hd-tgl-close">-</span>', '<span class="sub-sec-title">' + this.getsummaddressphonelabel() + '</span></h3></a></dt></dl></div>', '<div id="' + addy_row_id + '" style="display:none">');
		pwxhvron = ' ';
		var addyhvrarray = [];
		//build hover for address
		if (reply.ADDRESS.length !== 0) {
			pwxhvron = ' summ-info ';
			var myHvr = [];
			for (var i = 0; i < reply.ADDRESS.length; i++) {
				myHvr[i] = ["",""];
				myHvr[i][0] = reply.ADDRESS[i].ADDY_TYPE + ':';
				myHvr[i][1] = reply.ADDRESS[i].ADDY1;
			}
			addyhvrarray.push(myHvr);
		}
		//build home addy row
		var noaddress = 0;
		if (reply.HOME_ADDY1 === '' && reply.ADDRESS.length === 0) {
			noaddress = 1;
		}
		else if (reply.HOME_ADDY1 === '') {
			pwx_main_addy_sec_note_HTML.push('<dl id="add_row" class="pwx_asumm_grey_border-info' + pwxhvron + 'pwx_asumm_small_text"><dt class="pwx_asumm_single_dt_wpad"><span class="disabled">' + this.asumI18nObj.ADDRE + ' (' + reply.ADDRESS.length, '):</span><span class="disabled">' + this.asumI18nObj.NHOMEADDR + '</span></dt></dl>');
		}
		else {
			pwx_main_addy_sec_note_HTML.push('<dl id="add_row" class="pwx_asumm_grey_border-info' + pwxhvron + 'pwx_asumm_small_text"><dt class="pwx_asumm_single_dt_wpad"><span class="disabled">' + this.asumI18nObj.ADDRE + ' (' + (reply.ADDRESS.length + 1), '):</span> ' + reply.HOME_ADDY1 + ' <span class="disabled">' + this.asumI18nObj.HOME + '</span></dt></dl>');
		}
		//build home and mobile phones
		var ph_cnt = 0;
		if (reply.HOME_PH !== "--") {
			ph_cnt = ph_cnt + 1;
		}
		if (reply.MOBILE_PH !== "--") {
			ph_cnt = ph_cnt + 1;
		}
		//build phone hover
		pwxhvron = ' ';
		var phonehvrarray = [];
		var myHvr = [];
		if (reply.PHONE.length !== 0) {
			pwxhvron = ' summ-info ';
			for (var i = 0; i < reply.PHONE.length; i++) {
				myHvr[i] = ["",""];
				myHvr[i][0] = reply.PHONE[i].PHONE_TYPE + ':';
				myHvr[i][1] = reply.PHONE[i].PHONE_NUM;
			}
		}
		if (reply.EMAIL !== '') {
			pwxhvron = ' summ-info ';
			cnt = myHvr.length;
			myHvr.length = cnt + 1;
			myHvr[cnt] = ["",""];
			myHvr[cnt][0] = '' + this.asumI18nObj.EMAIL + ':';
			myHvr[cnt][1] = reply.EMAIL;
		}
		if (pwxhvron === ' summ-info ') {
			phonehvrarray.push(myHvr);
		}
		var ph_total_cnt = ph_cnt + reply.PHONE.length;
		if ((reply.PHONE.length + ph_cnt) === 0) {
			if (noaddress === 1) {
				pwx_main_addy_sec_note_HTML.push('<dl class="pwx_asumm_grey_border-info pwx_asumm_small_text"><dt class="pwx_asumm_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
			}
		}
		else {
			if ( ph_cnt === 0) {
				pwx_main_addy_sec_note_HTML.push('<dl id="phone_row" class="pwx_asumm_grey_border-info' + pwxhvron + 'pwx_asumm_small_text"><dt class="pwx_asumm_single_dt_wpad"><span class="disabled">' + this.asumI18nObj.PHONE + ' (' + ph_total_cnt, '): ' + this.asumI18nObj.HOVPHONE + '</span></dt></dl>');
			}
			else {
				pwx_main_addy_sec_note_HTML.push('<dl id="phone_row" class="pwx_asumm_grey_border-info' + pwxhvron + 'pwx_asumm_small_text"><dt class="pwx_asumm_single_dt_wpad"><span class="disabled">' + this.asumI18nObj.PHONE + ' (' + ph_total_cnt + '):</span>');
				if (reply.HOME_PH !== '--') {
					pwx_main_addy_sec_note_HTML.push(' ' + reply.HOME_PH + ' <span class="disabled">' + this.asumI18nObj.HOME + '</span>');
				}
				if (reply.MOBILE_PH !== '--') {
					pwx_main_addy_sec_note_HTML.push(' ' + reply.MOBILE_PH + ' <span class="disabled">' + this.asumI18nObj.MOBILE + '</span>');
				}
				pwx_main_addy_sec_note_HTML.push('</dt></dl>');
			}
		}

		pwx_main_addy_sec_note_HTML.push('</div>');
	}
	pwx_summary_main_HTML.push(pwx_main_addy_sec_note_HTML.join(""));
	//start health plans section
	var pwx_main_hp_sec_note_HTML = [];
	if (this.getsummhealthplandisp() === 1) {
		//build all the header except for text
		var hp_title_id = '' + summcompId + 'hp';
		var hp_row_id = '' + summcompId + 'hp_rows';
		var hp_tgl_id = '' + summcompId + 'hp_tgl';
		pwx_main_hp_sec_note_HTML.push('<div class="pwx-summ_user_pref_enable_disable"><dl class="pwxnopad_asumm-info"><dt class="pwx_asumm_single_sub_sec_dt"><a id="' + hp_title_id + '" class="pwx_asumm_sub_sec_link summinfo_main_section_evt" title="' + i18n.SHOW_SECTION + '"> ', '<h3 class="sub-sec-hd"><span id="' + hp_tgl_id + '" class="pwx-asumm_sub-sec-hd-tgl-close">-</span>');
		//is health plans empty?
		if (reply.HP.length !== 0) {
			//build the header and tbody
			pwx_main_hp_sec_note_HTML.push('<span class="sub-sec-title">' + this.getsummhealthplanlabel() + '<span class="pwx_asumm_small_text"> (' + reply.HP.length, ')</span></span></h3></a></dt></dl></div>', '<div id="' + hp_row_id + '" style="display:none">');
			//output results
			var healthplanlength = reply.HP.length;
			var hp_level = "";
			for (var cc = 0; cc < healthplanlength; cc++) {
				switch (reply.HP[cc].HP_LEVEL) {
					case 1:
						hp_level = '' + this.asumI18nObj.PRIMARY + ': ';
						break;
					case 2:
						hp_level = '' + this.asumI18nObj.SECONDARY + ': ';
						break;
					case 3:
						hp_level = '' + this.asumI18nObj.TERTIARY + ': ';
						break;
					case 4:
						hp_level = i18n.OTHER+ ': ';
						break;		
				}
				pwx_main_hp_sec_note_HTML.push('<dl class="pwx_asumm_grey_border-info pwx_asumm_small_text"><dt class="pwx_asumm_single_dt_wpad"><span class="disabled">' + hp_level + '</span>' + reply.HP[cc].HP_NAME);
				if (reply.HP[cc].HP_NBR !== '') {
					pwx_main_hp_sec_note_HTML.push('<span class="disabled"> | </span># ' + reply.HP[cc].HP_NBR);
				}
				pwx_main_hp_sec_note_HTML.push('</dt></dl>');
			}
			//end div

			pwx_main_hp_sec_note_HTML.push('</div>');
		}
		else {
			pwx_main_hp_sec_note_HTML.push('<span class="sub-sec-title">' + this.getsummhealthplanlabel() + '<span class="pwx_asumm_small_text"> (0)</span></span></h3></a></dt></dl>', '<dl class="pwx_asumm_grey_border-info pwx_asumm_small_text" id="' + hp_row_id + '" style="display:none"><dt class="pwx_asumm_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
		}
	}
	pwx_summary_main_HTML.push(pwx_main_hp_sec_note_HTML.join(""));
	
	
	
	
	pwx_summary_main_HTML.push('</div>');
	
	
	
	this.finalizeComponent(pwx_summary_main_HTML.join(""));
	var summcompContentDiv = $("#" + summcompIdContentElemID);
	//hovers and check scrolling activate hovers
	var elementMap = {};
	// remove event if there is any
	summcompContentDiv.off("mouseenter", ".summ-info");
	summcompContentDiv.off("mouseleave", ".summ-info");
	// attach event
	summcompContentDiv.on("mouseenter", ".summ-info", function(event) {
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
			showsummaryHover(event, anchor);
		}, 500);
	});
	summcompContentDiv.on("mouseleave", ".summ-info", function(event) {
		$(this).css("background-color", "#FFF");
		$(this).removeClass("mpage-tooltip-hover");
		clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
	});
	/*
	 * @constructor Handles creating and showing hovers in the component
	 * @param {object} event : The jquery event
	 * @param {object} anchor : The element that triggered the hover.
	 */
	function showsummaryHover(event, anchor) {
		var jsonId = $(anchor).attr("id").split("_");
		switch (jsonId[0]) {
			case "deceased":
				showsummaryHoverHTML(event, anchor, decHvrarray[0]);
				break;
			case "enc":
				showsummaryHoverHTML(event, anchor, visitdetailhvr[0]);
				break;
			case "fyi":
				showsummaryHoverHTML(event, anchor, resulthvrarray[0]);
				break;
			case "iq":
				showsummaryHoverHTML(event, anchor, iqhvrarray[0]);
				break;
			case "med":
				showsummaryHoverHTML(event, anchor, medhvrarray[0]);
				break;
			case "ega":
				var egaindexarray = egahvrarray[jsonId[2]];
				showsummaryHoverHTML(event, anchor, egaindexarray);
				break;
			case "preg":
				showsummaryHoverHTML(event, anchor, preghvrarray[0]);
				break;
			case "res":
				showsummaryHoverHTML(event, anchor, respHvrarray[0]);
				break;
			case "adv":
				showsummaryHoverHTML(event, anchor, advdirhvrarray[0]);
				break;
			case "lmp":
				showsummaryHoverHTML(event, anchor, lmphvrarray[0]);
				break;
			case "cevent":
				var ceventindexarray = clinicaleventhvrarray[jsonId[2]];
				showsummaryHoverHTML(event, anchor, ceventindexarray);
				break;
			case "alert":
				var alertindexarray = alertHvrArray[jsonId[2]];
				showsummaryHoverHTML(event, anchor, alertindexarray);
				break;
			case "remind":
				var remindindexarray = remindhvrarray[jsonId[2]];
				showsummaryHoverHTML(event, anchor, remindindexarray);
				break;
			case "snote":
				var snoteindexarray = snotehvrarray[jsonId[2]];
				showsummaryHoverHTML(event, anchor, snoteindexarray);
				break;
			case "past":
				var pastindexarray = pasthvrarray[jsonId[2]];
				showsummaryHoverHTML(event, anchor, pastindexarray);
				break;
			case "add":
				showsummaryHoverHTML(event, anchor, addyhvrarray[0]);
				break;
			case "phone":
				showsummaryHoverHTML(event, anchor, phonehvrarray[0]);
				break;
		}
	}

	/*
	 * @constructor builds hover HTML for the component
	 * @param {object} event : The jquery event
	 * @param {object} anchor : The element that triggered the hover.
	 * @param {array} Providershoverarray : The Array to use when creating hover details.
	 */
	function showsummaryHoverHTML(event, anchor, summaryhoverarray) {
		var summaryhvr = [];
		summaryhvr.push('<div class="result-details pwx_asumm_result_details">');
		for (var i = 0; i < summaryhoverarray.length; i++) {
			summaryhvr.push('<dl class="summary-det">', '<dt><span>' + summaryhoverarray[i][0] + '</span></dt><dd><span>' + summaryhoverarray[i][1] + '</span></dd></dl>');
		}
		//Create a new tooltip
		summaryhvr.push('</div>');
		var summaryhvrtooltip = new MPageTooltip();
		summaryhvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(summaryhvr.join(""));
		summaryhvrtooltip.show();
	}

	//create button sizing events
	var btncnt = $('.pwx_asumm_pat_summ_btn_row').children('.pwx_pat_summ_btn').children('.pwx_asumm_btnCenter').length;
	var row_width = $('.pwx_asumm_pat_summ_btn_row').innerWidth();
	var btnwidth = 0;
	if (btncnt === 2) {
		btnwidth = (row_width / btncnt) - 13;
	}
	else if (btncnt === 1) {
		btnwidth = (row_width / btncnt) - 13;
	}
	else {
		btnwidth = (row_width / btncnt) - 13;
	}
	$('.pwx_asumm_pat_summ_btn_row').children('.pwx_pat_summ_btn').children('.pwx_asumm_btnCenter').width(btnwidth);
	btncnt = $('.pwx_pat_summ_btn_row2').children('.pwx_pat_summ_btn').children('.pwx_asumm_btnCenter').length;
	if (btncnt === 2) {
		btnwidth = (row_width / btncnt) - 13;
	}
	else if (btncnt === 1) {
		btnwidth = (row_width / btncnt) - 13;
	}
	else {
		btnwidth = (row_width / btncnt) - 13;
	}
	$('.pwx_pat_summ_btn_row2').children('.pwx_pat_summ_btn').children('.pwx_asumm_btnCenter').width(btnwidth);
	var TO = false;
	//button screen resize events
	$(window).bind('resize', function() {
		if (TO !== false) {
			clearTimeout(TO);
		}
		TO = setTimeout(pwx_summ_amb_patient_resize, 200);
		//200 is time in miliseconds
	});

	//pregnancy icon show/hide events
	$('.pwx_preg_icon_hvr').bind('mouseover', function() {
		$(this).children('.pwx_preg_icon').css('display', 'block');
	});
	$('.pwx_preg_icon_hvr').bind('mouseout', function() {
		$(this).children('.pwx_preg_icon').css('display', 'none');
	});
	//sticky note text click events
	summcompContentDiv.off("click", "a.pwx_summ_sticky_note_anchor_id");
	summcompContentDiv.on("click", "a.pwx_summ_sticky_note_anchor_id", function(event) {
		var pwx_summ_sticky_note_anchor_id = jQuery(this);
		var index = pwx_summ_sticky_note_anchor_id.find('span.pwx_summ_sticky_note_hidden_id').text();
		var pwx_long_text_ind = pwx_summ_sticky_note_anchor_id.find('span.pwx_summ_sticky_note_hidden__long_id').text();
		var sid = reply.S_NOTES[index].S_ID;
		var stext = "";
		if (pwx_long_text_ind === 1) {
			stext = reply.S_NOTES[index].LONG_NOTE_TEXT;
		}
		else {
			stext = reply.S_NOTES[index].NOTE_TEXT;
		}
		stext = stext.replace(/\n/g, "");
		stext = stext.replace(/\r/g, "\; ");
		var sticky_del_ind = thiz.getsummstickynotesdelete();
		var sticky_update_ind = thiz.getsummstickynotesmodify();
		// update and delete the sticky note
		var newtext = stext.replace(/\; /g, '\r');
		pwx_summary_sticky_note_text = [];
		pwx_summary_sticky_note_text.push('<div id="pwx-create-sticky-dialog-confirm"><p class="pwx_asumm_small_text"><label for="pwx_create_sticky_note">' + thiz.asumI18nObj.STNOTEENTRY + ': <br/><textarea  class="text ui-widget-content ui-corner-all" rows="5" cols="35" id="pwx_create_sticky_note" name="pwx_create_sticky_note">' + newtext + '</textarea></label></p></div>');
		MP_ModalDialog.deleteModalDialogObject("UpdatedeleteStickyNoteModal");
		var updatedelstickymodal = new ModalDialog("UpdatedeleteStickyNoteModal").setHeaderTitle('' + thiz.asumI18nObj.STNOTEENTRY + '').setTopMarginPercentage(20).setRightMarginPercentage(28).setBottomMarginPercentage(30).setLeftMarginPercentage(28).setIsBodySizeFixed(true).setHasGrayBackground(true).setIsFooterAlwaysShown(true);
		updatedelstickymodal.setBodyDataFunction(function(modalObj) {
			modalObj.setBodyHTML(pwx_summary_sticky_note_text.join(""));
		});
		var closebtn = new ModalButton("addCancel");
		closebtn.setText(thiz.asumI18nObj.CANCELBUT).setCloseOnClick(true);
		if (sticky_del_ind !== 1) {
			var removestickybtn = new ModalButton("addCancel");
			removestickybtn.setText(thiz.asumI18nObj.REMOVEBUT).setCloseOnClick(true).setIsDithered(true);
		}
		else {
			var removestickybtn = new ModalButton("addCancel");
			removestickybtn.setText(thiz.asumI18nObj.REMOVEBUT).setCloseOnClick(true).setOnClickFunction(function() {
				pwx_CCL_Request_Sticky_maintain('amb_maintain_sticky_note', sid, pid, "", "delete", false);
			});
		}
		if (sticky_update_ind !== 1) {
			var updatestickybtn = new ModalButton("addCancel");
			updatestickybtn.setText(thiz.asumI18nObj.UPDATE).setCloseOnClick(true).setIsDithered(true);
		}
		else {
			var updatestickybtn = new ModalButton("addCancel");
			updatestickybtn.setText(thiz.asumI18nObj.UPDATE).setCloseOnClick(true).setOnClickFunction(function() {
				var sticky_text = $('#pwx_create_sticky_note').text();
				sticky_text = sticky_text.replace(/\^/g, "");
				pwx_CCL_Request_Sticky_maintain('amb_maintain_sticky_note', sid, pid, sticky_text, "update", false);
			});
		}
		updatedelstickymodal.addFooterButton(removestickybtn);
		updatedelstickymodal.addFooterButton(updatestickybtn);
		updatedelstickymodal.addFooterButton(closebtn);
		MP_ModalDialog.addModalDialogObject(updatedelstickymodal);
		MP_ModalDialog.showModalDialog("UpdatedeleteStickyNoteModal");
	});
	//pregnancy menu
	summcompContentDiv.off("click", ".pwx_preg_dp_menu");
	summcompContentDiv.on("click", ".pwx_preg_dp_menu", function(event) {
		var anchorElemId = $(this).attr("id");
		if (anchorElemId === eddchartmenu.getAnchorElementId()) {
			eddchartmenu.setAnchorElementId(thiz.summ_preg_menu_id);
			MP_MenuManager.closeMenuStack(thiz.summ_preg_menu_id);
		}
		else {
			eddchartmenu.setAnchorElementId(anchorElemId);
			MP_MenuManager.showMenu(thiz.summ_preg_menu_id);
		}
	});
	summcompContentDiv.off("click", ".pwx_alert_chart_menu_launch");
	//alert menu
	summcompContentDiv.on("click", ".pwx_alert_chart_menu_launch", function(event) {
		var anchorElemId = $(this).attr("id");
		if (anchorElemId === alertchartmenu.getAnchorElementId()) {
			alertchartmenu.setAnchorElementId(thiz.summ_alert_menu_id);
			MP_MenuManager.closeMenuStack(thiz.summ_alert_menu_id);
		}
		else {
			alertchartmenu.setAnchorElementId(anchorElemId);
			MP_MenuManager.showMenu(thiz.summ_alert_menu_id);
		}
	});
	summcompContentDiv.off("click", ".pwx_summ_report_menu");
	//pc report menu
	summcompContentDiv.on("click", ".pwx_summ_report_menu", function(event) {
		var anchorElemId = $(this).attr("id");		
		if (anchorElemId === pcreportmenu.getAnchorElementId()) {
			pcreportmenu.setAnchorElementId(thiz.summ_pc_report_menu_id);
			MP_MenuManager.closeMenuStack(thiz.summ_pc_report_menu_id);
		}
		else {
			pcreportmenu.setAnchorElementId(anchorElemId);
			MP_MenuManager.showMenu(thiz.summ_pc_report_menu_id);
		}
	});
	//global function goes here for standard component
	//main subsection expand collapse events
	summcompContentDiv.off("click", "a.summinfo_main_section_evt");
	summcompContentDiv.on("click", "a.summinfo_main_section_evt", function(event) {
	   	thiz.expandCollapseSummarySubSections($(this).attr('id'));	
        if(pwx_reminder_indicator === 1){		
		var pwxdivh = $(".amb_reminder_div").height();
		if (pwxdivh > 160) {
			var div_height = 160 + 'px';
			$(".amb_reminder_div").height(div_height)
		}}		
	});
	//expand collapse pregnancy sections events
	summcompContentDiv.off("click", ".pwx_preg_sec_expand_collapse");
	summcompContentDiv.on("click", ".pwx_preg_sec_expand_collapse", function(event) {
		if ($('#pwx_preg_sec_ega_rows_'+summcompId).css('display') === 'block') {
			$('#pwx_preg_sec_ega_rows_'+summcompId).css('display', 'none');
			$('#pwx_ega_tgl_btn_'+summcompId).attr('title', i18npregexpand);
			$('#pwx_ega_tgl_btn_'+summcompId).removeClass().addClass('pwx-asumm_sub-sec-hd-tgl-close');
		}
		else {
			$('#pwx_preg_sec_ega_rows_'+summcompId).css('display', 'block');
			$('#pwx_ega_tgl_btn_'+summcompId).attr('title', i18npregcollapse);
			$('#pwx_ega_tgl_btn_'+summcompId).removeClass().addClass('pwx-asumm_sub-sec-hd-tgl');
		}
	});
	//create the patient education launch function
	summcompContentDiv.off("click", "div.pwx_pat_ed_launch");
	summcompContentDiv.on("click", "div.pwx_pat_ed_launch", function(event) {
		var pwxPatEdObject = new Object();
		pwxPatEdObject = window.external.DiscernObjectFactory('PATIENTEDUCATION');
		pwxPatEdObject.SetPatient(pid, eid);
		pwxPatEdObject.SetDefaultTab(0);
		pwxPatEdObject.DoModal();
	});
	//create the discharge med rec launch function
	summcompContentDiv.off("click", "div.pwx_med_rec_launch");
	summcompContentDiv.on("click", "div.pwx_med_rec_launch", function(event) {
		var pwxMedRecObject = new Object();
		pwxMedRecObject = window.external.DiscernObjectFactory('ORDERS');
		pwxMedRecObject.PersonId = pid;
		pwxMedRecObject.EncntrId = eid;
		pwxMedRecObject.reconciliationMode = 3;
		pwxMedRecObject.LaunchOrdersMode(2, 0, 0);
	});
	//create the visit summary launch function
	summcompContentDiv.off("click", "div.pwx_visit_sum_launch");
	summcompContentDiv.on("click", "div.pwx_visit_sum_launch", function(event) {
		var pwxDepartObject = new Object();
		pwxDepartObject = window.external.DiscernObjectFactory('DISCHARGEPROCESS');
		pwxDepartObject.person_id = pid;
		pwxDepartObject.encounter_id = eid;
		pwxDepartObject.user_id = uid;
		pwxDepartObject.LaunchDischargeDialog();
	});
	//create the Reopen Pregnancy launch function
	summcompContentDiv.off("click", "a.pwx_reopenpreg_launch");
	summcompContentDiv.on("click", "a.pwx_reopenpreg_launch", function(event) {
		var objPVViewerMPage = window.external.DiscernObjectFactory('PREGNANCY');
		success_ind = objPVViewerMPage.ReopenPregnancy(window, pid, eid);
		if ( success_ind === true) {
			thiz.retrieveComponentData();
		}
	});
	//create the Add Pregnancy launch function
	summcompContentDiv.off("click", "a.pwx_addpreg_launch");
	summcompContentDiv.on("click", "a.pwx_addpreg_launch", function(event) {
		var objPVViewerMPage = window.external.DiscernObjectFactory('PREGNANCY');
		success_ind = objPVViewerMPage.AddPregnancy(window, pid, eid);
		if ( success_ind === true) {
			thiz.retrieveComponentData();
		}
	});
	//create the reminder launch function
	summcompContentDiv.off("click", "a.pwx_reminder_launch");
	summcompContentDiv.on("click", "a.pwx_reminder_launch", function(event) {
	    var reminderid = $(this).attr('id').split("_");
		var objPVViewerMPage = window.external.DiscernObjectFactory('PVVIEWERMPAGE');
		objPVViewerMPage.LaunchRemindersViewer(reminderid[0]);
	});
	//create the result viewer launch function
	summcompContentDiv.off("click", "a.pwx_result_view_launch");
	summcompContentDiv.on("click", "a.pwx_result_view_launch", function(event) {
	    var resultid = $(this).attr('id').split("_");
		var pwxPVViewerMPage = window.external.DiscernObjectFactory('PVVIEWERMPAGE');
		pwxPVViewerMPage.CreateEventViewer(pid);
		pwxPVViewerMPage.AppendEvent(resultid[0]);
		pwxPVViewerMPage.LaunchEventViewer();
	});
	//create the doc viewer launch function
	summcompContentDiv.off("click", "a.pwx_doc_view_launch");
	summcompContentDiv.on("click", "a.pwx_doc_view_launch", function(event) {
	    var docviewid = $(this).attr('id').split("_");
		var pwxPVViewerMPage = window.external.DiscernObjectFactory('PVVIEWERMPAGE');
		pwxPVViewerMPage.CreateDocViewer(pid);
		pwxPVViewerMPage.AppendDocEvent(docviewid[0]);
		pwxPVViewerMPage.LaunchDocViewer();
	});
	// create form launch event
	summcompContentDiv.off("click", "a.pwx_form_launch");
	summcompContentDiv.on("click", "a.pwx_form_launch", function(event) {
	    var formid = $(this).attr('id').split("_");
		var paramString = pid + "|" + eid + "|" + formid[0] + "|" + 0.0 + "|" + 0;
		MPAGES_EVENT("POWERFORM", paramString);
		thiz.retrieveComponentData();
	});
	//create lmp add form launch
	summcompContentDiv.off("click", "a.pwx_lmp_launch");
	summcompContentDiv.on("click", "a.pwx_lmp_launch", function(event) {
	    var lmpid = $(this).attr('id').split("_");
		var paramString = pid + "|" + eid + "|" + 0.0 + "|" + lmpid[0] + "|" + 0;
		MPAGES_EVENT("POWERFORM", paramString);
		thiz.retrieveComponentData();
	});
	//create the Close/modify/cancel/Modify Edd/Add Edd Pregnancy launch function
	summcompContentDiv.off("click", ".pwx_preg_launch");
	summcompContentDiv.on("click", ".pwx_preg_launch", function(event) {
		var preg_id_name = $(this).attr('id').split("_");
		var objPVViewerMPage = window.external.DiscernObjectFactory('PREGNANCY');
		if (preg_id_name[0] === "close") {
			success_ind = objPVViewerMPage.ClosePregnancy(window, pid, eid, preg_id_name[1]);
		}
		else if (preg_id_name[0] === "modify") {
			success_ind = objPVViewerMPage.ModifyPregnancy(window, pid, eid, preg_id_name[1]);
		}
		else if (preg_id_name[0] === "cancel") {
			success_ind = objPVViewerMPage.CancelPregnancy(window, pid, eid, preg_id_name[1]);
		}
		else if (preg_id_name[0] === "modifyedd") {
			success_ind = objPVViewerMPage.ModifyEdd(window, pid, eid, preg_id_name[1]);
		}
		else if (preg_id_name[0] === "addedd") {
			vsuccess_ind = objPVViewerMPage.AddEdd(window, pid, eid, preg_id_name[1]);
		}
		if ( success_ind === true) {
			thiz.retrieveComponentData();
		}
	});
	//create the Fundal Height launch function
	summcompContentDiv.off("click", "dt.pwx_fundalgraph_launch");
	summcompContentDiv.on("click", "dt.pwx_fundalgraph_launch", function(event) {
	    var fundalid = $(this).attr('id').split("_");
		var objPVViewerMPage = window.external.DiscernObjectFactory('PREGNANCY');
		objPVViewerMPage.LaunchFundalHeightGraph(window, pid, fundalid[0]);
	});
	// Add the new sticky note
	summcompContentDiv.off("click", ".pwx_add_sticky_launch");
	summcompContentDiv.on("click", ".pwx_add_sticky_launch", function(event) {
		pwx_summary_sticky_note_text = [];
		pwx_summary_sticky_note_text.push('<div id="pwx-create-sticky-dialog-confirm"><p class="pwx_asumm_small_text"><label for="pwx_create_sticky_note">' + thiz.asumI18nObj.STNOTEENTRY + ': <br/><textarea  class="text ui-widget-content ui-corner-all" rows="5" cols="35" id="pwx_create_sticky_note" name="pwx_create_sticky_note" /></textarea></label></p></div>');
		MP_ModalDialog.deleteModalDialogObject("AddStickyNoteModal");
		var addstickymodal = new ModalDialog("AddStickyNoteModal").setHeaderTitle(thiz.asumI18nObj.STNOTEENTRY).setTopMarginPercentage(20).setRightMarginPercentage(28).setBottomMarginPercentage(30).setLeftMarginPercentage(28).setIsBodySizeFixed(true).setHasGrayBackground(true).setIsFooterAlwaysShown(true);
		addstickymodal.setBodyDataFunction(function(modalObj) {
			modalObj.setBodyHTML(pwx_summary_sticky_note_text.join(""));
		});
		var closebtn = new ModalButton("addCancel");
		closebtn.setText(thiz.asumI18nObj.CANCELBUT).setCloseOnClick(true);
		var addbtn = new ModalButton("addstickybutton");
		addbtn.setText(thiz.asumI18nObj.ADD).setCloseOnClick(true).setIsDithered(true).setOnClickFunction(function() {
			var sticky_text = $('#pwx_create_sticky_note').text();
			sticky_text = sticky_text.replace(/\^/g, "");
			if (sticky_text !== "") {
				pwx_CCL_Request_Sticky_maintain('amb_maintain_sticky_note', 0, pid, sticky_text, "add", false);
			}
		});
		addstickymodal.addFooterButton(addbtn);
		addstickymodal.addFooterButton(closebtn);
		MP_ModalDialog.addModalDialogObject(addstickymodal);
		MP_ModalDialog.showModalDialog("AddStickyNoteModal");

		$('#pwx_create_sticky_note').keyup(function(event) {
			if ($('#pwx_create_sticky_note').text() !== "") {
				addstickymodal.setFooterButtonDither("addstickybutton", false);
			}
			else {
				addstickymodal.setFooterButtonDither("addstickybutton", true);
			}
		});

	});
	/*
	 * @constructor Handles call the program to do apporitment when end user update,delete and add sticky note.
	 * @param {String} Program : The Program Name
	 * @param {float} param1 : The person Id which need to pass into program.
	 * @param {float} param2 : The USER ID which need to pass into program
	 * @param {float} param3 : The Encounter ID which need to pass into program.
	 * @param {float} param4 : The Position Code which need to pass into program.
	 * @param {Boolean} async : The ajax call should be synchronous and asynchronous.
	 */
	function pwx_CCL_Request_Sticky_maintain(program, param1, param2, param3, param4, async) {
		var sendAr = [];
		var request = null;
		sendAr.push("^MINE^", param1 + ".0", param2 + ".0", "^" + param3 + "^", "^" + param4 + "^");
		request = new MP_Core.ScriptRequest(thiz, thiz.getComponentLoadTimerName());
		request.setProgramName(program);
		request.setParameters(sendAr);
		request.setAsync(true);
		MP_Core.XMLCCLRequestCallBack(thiz, request, function(reply) {
			setTimeout(function() {
				thiz.retrieveComponentData();
			}, 500);
			thiz.setexpandcollapselabelname(i18n.HIDE_SECTION);
			thiz.setexpandcollapseicon("pwx-asumm_sub-sec-hd-tgl");
			thiz.setexpandcollapsestyle("display:block");
		});
	}

	/*
	 * @constructor resize the component's button
	 */
	function pwx_summ_amb_patient_resize() {
		//button sizing
		var btncnt = $('.pwx_asumm_pat_summ_btn_row').children('.pwx_pat_summ_btn').children('.pwx_asumm_btnCenter').length;
		var row_width = $('.pwx_asumm_pat_summ_btn_row').innerWidth();
		var btnwidth = 0;
		if (btncnt === 2) {
			btnwidth = (row_width / btncnt) - 13;
		}
		else if (btncnt === 1) {
			btnwidth = (row_width / btncnt) - 13;
		}
		else {
			btnwidth = (row_width / btncnt) - 13;
		}
		$('.pwx_asumm_pat_summ_btn_row').children('.pwx_pat_summ_btn').children('.pwx_asumm_btnCenter').width(btnwidth);
		btncnt = $('.pwx_pat_summ_btn_row2').children('.pwx_pat_summ_btn').children('.pwx_asumm_btnCenter').length;
		if (btncnt === 2) {
			btnwidth = (row_width / btncnt) - 13;
		}
		else if (btncnt === 1) {
			btnwidth = (row_width / btncnt) - 13;
		}
		else {
			btnwidth = (row_width / btncnt) - 13;
		}
		$('.pwx_pat_summ_btn_row2').children('.pwx_pat_summ_btn').children('.pwx_asumm_btnCenter').width(btnwidth);
	}

	/*
	 * @constructor Handles to check leap year
	 * @param {string} year : Year
	 */
	function isLeapYear(year) {
		var d = new Date(year, 1, 28);
		d.setDate(d.getDate() + 1);
		return d.getMonth() === 1;
	}

	/*
	 * @constructor Handles to calculate age
	 * @param {date} date : date should be pass
	 */
	function getAge(date) {
		var d = new Date(date), now = new Date();
		var years = now.getFullYear() - d.getFullYear();
		d.setFullYear(d.getFullYear() + years);
		if (d > now) {
			years--;
			d.setFullYear(d.getFullYear() - 1);
		}
		var days = (now.getTime() - d.getTime()) / (3600 * 24 * 1000);
		return years + days / (isLeapYear(now.getFullYear()) ? 366 : 365);
	}

	
	  
};
MP_Util.setObjectDefinitionMapping("AMB_PAT_SUMM", AmbSummaryComponent); 