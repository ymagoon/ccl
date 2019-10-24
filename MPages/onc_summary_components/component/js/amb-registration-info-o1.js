/**
 * Create the component style object which will be used to style various aspects of our component
 */
function AmbRegistrationComponentStyle() {
	this.initByNamespace("areg");
}

AmbRegistrationComponentStyle.inherits(ComponentStyle);

/**
 * @constructor
 * Initialize the Registration Information O1 component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function AmbRegistrationComponent(criterion) {
	//This is your component's constructor.
	this.setStyles(new AmbRegistrationComponentStyle());
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.AMBREGISTRATION.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.AMBREGISTRATION.O1 - render component");

	//make my variables and then make getters/setters
	this.aregI18nObj = {};
	//hovers
	this.tooltip = new MPageTooltip();
	/*setter and getter for all bedrock setting */
	this.adhoc_form_menu_id = "adhoc_form_menu";
	this.m_reginfoaddform = [];
	this.m_reginfomedhomece = [];
	this.m_reginforacedispce = [];
	this.m_reginfoethnicitydispce = [];
	this.m_reginfolanguagedispce = [];
	this.m_reginforeligiondispce = [];
	this.m_reginfootherce = [];
	this.m_reginfootherceseq = [];
	this.m_reginfoaddresstypes = [];
	this.m_reginfophonetypes = [];
	this.m_reginfoidentifierstypes = [];
	this.m_reginfodisp = 0;
	this.m_reginforesultsfyidisp = 0;
	this.m_reginfomedicalhomedisp = 0;
	this.m_reginforacedisp = 0;
	this.m_reginfoethnicitydisp = 0;
	this.m_reginfomaritalstatdisp = 0;
	this.m_reginfolanguagedisp = 0;
	this.m_reginforeligiondisp = 0;
	this.m_reginfonicknamedisp = 0;
	this.m_reginfomothermaidendisp = 0;
	this.m_reginfomilitarydisp = 0;
	this.m_reginfocitizenshipdisp = 0;
	this.m_reginfoemploydisp = 0;
	this.m_reginfoemploysochx = 0;
	this.m_reginfomaritalstatsochx = "";
	this.m_reginfoaddresslabel = "";
	this.m_reginfophonelabel = "";
	this.m_reginfoidentifierslabel = "";
	this.m_reginfoemploylabel = "";
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
AmbRegistrationComponent.prototype = new MPageComponent();
AmbRegistrationComponent.prototype.constructor = MPageComponent;
/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 */
//for indicator
/*
 * @constructor set person/visit details display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfodisp = function(value) {
	this.m_reginfodisp = (value === true ? 1 : 0);
};
/*
 * @constructor set results fyi display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginforesultsfyidisp = function(value) {
	this.m_reginforesultsfyidisp = (value === true ? 1 : 0);
};
/*
 * @constructor set medical home display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfomedicalhomedisp = function(value) {
	this.m_reginfomedicalhomedisp = (value === true ? 1 : 0);
};
/*
 * @constructor set race display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginforacedisp = function(value) {
	this.m_reginforacedisp = (value === true ? 1 : 0);
};
/*
 * @constructor set ethnicity display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfoethnicitydisp = function(value) {
	this.m_reginfoethnicitydisp = (value === true ? 1 : 0);
};
/*
 * @constructor set marital status display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfomaritalstatdisp = function(value) {
	this.m_reginfomaritalstatdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set language display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfolanguagedisp = function(value) {
	this.m_reginfolanguagedisp = (value === true ? 1 : 0);
};
/*
 * @constructor set religion display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginforeligiondisp = function(value) {
	this.m_reginforeligiondisp = (value === true ? 1 : 0);
};
/*
 * @constructor set nickname display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfonicknamedisp = function(value) {
	this.m_reginfonicknamedisp = (value === true ? 1 : 0);
};
/*
 * @constructor set mothers maiden name display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfomothermaidendisp = function(value) {
	this.m_reginfomothermaidendisp = (value === true ? 1 : 0);
};
/*
 * @constructor set military status display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfomilitarydisp = function(value) {
	this.m_reginfomilitarydisp = (value === true ? 1 : 0);
};
/*
 * @constructor set citizenship display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfocitizenshipdisp = function(value) {
	this.m_reginfocitizenshipdisp = (value === true ? 1 : 0);
};
/*
 * @constructor set employment status display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfoemploydisp = function(value) {
	this.m_reginfoemploydisp = (value === true ? 1 : 0);
};
/*
 * @constructor set employment status from PowerChart social history display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfoemploysochx = function(value) {
	this.m_reginfoemploysochx = (value === true ? 1 : 0);
};
/*
 * @constructor get person/visit details display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfodisp = function() {
	return this.m_reginfodisp;
};
/*
 * @constructor get results fyi display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginforesultsfyidisp = function() {
	return this.m_reginforesultsfyidisp;
};
/*
 * @constructor set medical home display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfomedicalhomedisp = function() {
	return this.m_reginfomedicalhomedisp;
};
/*
 * @constructor set race display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginforacedisp = function() {
	return this.m_reginforacedisp;
};
/*
 * @constructor set ethnicity display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfoethnicitydisp = function() {
	return this.m_reginfoethnicitydisp;
};
/*
 * @constructor set marital status display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfomaritalstatdisp = function() {
	return this.m_reginfomaritalstatdisp;
};
/*
 * @constructor set language display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfolanguagedisp = function() {
	return this.m_reginfolanguagedisp;
};
/*
 * @constructor set religion display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginforeligiondisp = function() {
	return this.m_reginforeligiondisp;
};
/*
 * @constructor set nickname display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfonicknamedisp = function() {
	return this.m_reginfonicknamedisp;
};
/*
 * @constructor set mothers maiden name display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfomothermaidendisp = function() {
	return this.m_reginfomothermaidendisp;
};
/*
 * @constructor set military status display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfomilitarydisp = function() {
	return this.m_reginfomilitarydisp;
};
/*
 * @constructor set citizenship display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfocitizenshipdisp = function() {
	return this.m_reginfocitizenshipdisp;
};
/*
 * @constructor set employment status display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfoemploydisp = function() {
	return this.m_reginfoemploydisp;
};
/*
 * @constructor set employment status from PowerChart Social History display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfoemploysochx = function() {
	return this.m_reginfoemploysochx;
};
//for label
/*
 * @constructor set address section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfoaddresslabel = function(value) {
	this.m_reginfoaddresslabel = value;
};
/*
 * @constructor set phone section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfophonelabel = function(value) {
	this.m_reginfophonelabel = value;
};
/*
 * @constructor set employment status section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfoemploylabel = function(value) {
	this.m_reginfoemploylabel = value;
};
/*
 * @constructor set identifiers section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfoidentifierslabel = function(value) {
	this.m_reginfoidentifierslabel = value;
};
/*
 * @constructor set marital status Social History DTA in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfomaritalstatsochx = function(value) {
	this.m_reginfomaritalstatsochx = value;
};
/*
 * @constructor get address section label in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfoaddresslabel = function() {
	return this.m_reginfoaddresslabel;
};
/*
 * @constructor get phone section label in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfophonelabel = function() {
	return this.m_reginfophonelabel;
};
/*
 * @constructor get employment status section label in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfoemploylabel = function() {
	return this.m_reginfoemploylabel;
};
/*
 * @constructor get identifiers section label in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfoidentifierslabel = function() {
	return this.m_reginfoidentifierslabel;
};
/*
 * @constructor get marital status Social History DTA label in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfomaritalstatsochx = function(value) {
	return this.m_reginfomaritalstatsochx;
};
//for type and eventset
/*
 * @constructor set PowerForms Add list for header in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfoaddform = function(value) {
	this.m_reginfoaddform = value;
};
/*
 * @constructor set medical home filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfomedhomece = function(value) {
	this.m_reginfomedhomece = value;
};
/*
 * @constructor set race clinical events filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginforacedispce = function(value) {
	this.m_reginforacedispce = value;
};
/*
 * @constructor set ethnicity clinical events filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfoethnicitydispce = function(value) {
	this.m_reginfoethnicitydispce = value;
};
/*
 * @constructor set language clinical events filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfolanguagedispce = function(value) {
	this.m_reginfolanguagedispce = value;
};
/*
 * @constructor set religion clinical events filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginforeligiondispce = function(value) {
	this.m_reginforeligiondispce = value;
};
/*
 * @constructor set other clinical events filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfootherce = function(value) {
	this.m_reginfootherce = value;
};
/*
 * @constructor set other clinical events sequence filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfootherceseq = function(value) {
	this.m_reginfootherceseq = value;
};
/*
 * @constructor set address types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfoaddresstypes = function(value) {
	this.m_reginfoaddresstypes = value;
};
/*
 * @constructor set phone types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfophonetypes = function(value) {
	this.m_reginfophonetypes = value;
};
/*
 * @constructor set identifiers types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbRegistrationComponent.prototype.setreginfoidentifierstypes = function(value) {
	this.m_reginfoidentifierstypes = value;
};
/*
 * @constructor set PowerForms Add list for header in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfoaddform = function() {
	return this.m_reginfoaddform;
};
/*
 * @constructor get medical home clinical events filter in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfomedhomece = function() {
	return this.m_reginfomedhomece;
};
/*
 * @constructor get race clinical events filter in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginforacedispce = function() {
	return this.m_reginforacedispce;
};
/*
 * @constructor get ethnicity clinical events filter in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfoethnicitydispce = function() {
	return this.m_reginfoethnicitydispce;
};
/*
 * @constructor get language clinical events filter in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfolanguagedispce = function() {
	return this.m_reginfolanguagedispce;
};
/*
 * @constructor get religion clinical events filter in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginforeligiondispce = function() {
	return this.m_reginforeligiondispce;
};
/*
 * @constructor get other clinical events filter in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfootherce = function() {
	return this.m_reginfootherce;
};
/*
 * @constructor get other clinical events seq filter in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfootherceseq = function() {
	return this.m_reginfootherceseq;
};
/*
 * @constructor get address types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfoaddresstypes = function() {
	return this.m_reginfoaddresstypes;
};
/*
 * @constructor get phone types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfophonetypes = function() {
	return this.m_reginfophonetypes;
};
/*
 * @constructor get identifier types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbRegistrationComponent.prototype.getreginfoidentifierstypes = function() {
	return this.m_reginfoidentifierstypes;
};
/*
 * @constructor Handles expanding/collapsing subsections in the component
 * @param {string} subsectionid : The subsectionid string contains id of the row being expanded/collapsed.
 */
AmbRegistrationComponent.prototype.expandCollapseRegInfoSubSections = function (subsectionid) {
    if ($('#' + subsectionid + '_rows').css('display') === 'block') {
		$('#' + subsectionid + '_rows').css('display', 'none')
		$('#' + subsectionid).attr('title', i18n.SHOW_SECTION)
		$('#' + subsectionid + '_tgl').removeClass().addClass('pwx-areg_sub-sec-hd-tgl-close')
	} else {
		$('#' + subsectionid + '_rows').css('display', 'block')
		$('#' + subsectionid).attr('title', i18n.HIDE_SECTION)
		$('#' + subsectionid + '_tgl').removeClass().addClass('pwx-areg_sub-sec-hd-tgl')
	}
};
/*
 * @constructor get bedrock settings and map to our variables in component
 */
AmbRegistrationComponent.prototype.loadFilterMappings = function() {
	//Add the filter mapping object for the Catalog Type Codes
	MPageComponent.prototype.loadFilterMappings.call(this);
	/* get all display indicator*/
	this.addFilterMappingObject("REGINFO_INFO_DISP", {
		setFunction : this.setreginfodisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_RESULTS_FYI_DISP", {
		setFunction : this.setreginforesultsfyidisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_MEDICAL_HOME_DISP", {
		setFunction : this.setreginfomedicalhomedisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_RACE_DISP", {
		setFunction : this.setreginforacedisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_ETHNICITY_DISP", {
		setFunction : this.setreginfoethnicitydisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_MARITALSTAT_DISP", {
		setFunction : this.setreginfomaritalstatdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_LANGUAGE_DISP", {
		setFunction : this.setreginfolanguagedisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_RELIGION_DISP", {
		setFunction : this.setreginforeligiondisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_NICKNAME_DISP", {
		setFunction : this.setreginfonicknamedisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_MOTHERMAIDEN_DISP", {
		setFunction : this.setreginfomothermaidendisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_MILITARY_DISP", {
		setFunction : this.setreginfomilitarydisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_CITIZENSHIP_DISP", {
		setFunction : this.setreginfocitizenshipdisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_EMPLOY_DISPL", {
		setFunction : this.setreginfoemploydisp,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_EMPLOY_SOCHX", {
		setFunction : this.setreginfoemploysochx,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	/* get all label setreginfoidentifierslabel*/
	this.addFilterMappingObject("REGINFO_MARITALSTAT_SOCHX", {
		setFunction : this.setreginfomaritalstatsochx,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_ADDRESS_LABEL", {
		setFunction : this.setreginfoaddresslabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_PHONE_LABEL", {
		setFunction : this.setreginfophonelabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_EMPLOY_LABEL", {
		setFunction : this.setreginfoemploylabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("REGINFO_IDENTIFIERS_LABEL", {
		setFunction : this.setreginfoidentifierslabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	/* get type setting */
	this.addFilterMappingObject("REGINFO_ADD_FORM", {
		setFunction : this.setreginfoaddform,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("REGINFO_MEDHOME_CE", {
		setFunction : this.setreginfomedhomece,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("REGINFO_RACE_DISP_CE", {
		setFunction : this.setreginforacedispce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("REGINFO_ETHNICITY_DISP_CE", {
		setFunction : this.setreginfoethnicitydispce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("REGINFO_LANGUAGE_DISP_CE", {
		setFunction : this.setreginfolanguagedispce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("REGINFO_RELIGION_DISP_CE", {
		setFunction : this.setreginforeligiondispce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("REGINFO_OTHER_CE", {
		setFunction : this.setreginfootherce,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("REGINFO_OTHER_CE_SEQ", {
		setFunction : this.setreginfootherceseq,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("REGINFO_ADDRESS_TYPES", {
		setFunction : this.setreginfoaddresstypes,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("REGINFO_PHONE_TYPES", {
		setFunction : this.setreginfophonetypes,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("REGINFO_IDENTIFIERS_TYPES", {
		setFunction : this.setreginfoidentifierstypes,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
};
/* Main rendering functions */
/**
 * This is the AmbRegistrationComponent implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 */
AmbRegistrationComponent.prototype.retrieveComponentData = function() {
	var criterion = null;
	var request = null;
	var self = this;
	var sendAr = null;
	criterion = this.getCriterion();
	sendAr = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0", criterion.position_cd + ".0", MP_Util.CreateParamArray(this.getreginfomedhomece(), 1), MP_Util.CreateParamArray(this.getreginforacedispce(), 1), MP_Util.CreateParamArray(this.getreginfoethnicitydispce(), 1), MP_Util.CreateParamArray(this.getreginfolanguagedispce(), 1), MP_Util.CreateParamArray(this.getreginforeligiondispce(), 1), MP_Util.CreateParamArray(this.getreginfootherce(), 1), MP_Util.CreateParamArray(this.getreginfootherceseq(), 1), MP_Util.CreateParamArray(this.getreginfoaddresstypes(), 1), MP_Util.CreateParamArray(this.getreginfophonetypes(), 1), MP_Util.CreateParamArray(this.getreginfoidentifierstypes(), 1), this.getreginfomedicalhomedisp(), this.getreginforacedisp(), this.getreginfoethnicitydisp(), this.getreginfolanguagedisp(), this.getreginforeligiondisp(), this.getreginfoemploydisp(), this.getreginfoemploysochx(), this.getreginfomaritalstatdisp(), this.getreginfonicknamedisp(), this.getreginforesultsfyidisp(), "^" + this.getreginfomaritalstatsochx() + "^", MP_Util.CreateParamArray(this.getreginfoaddform(), 1)];
	MP_Core.XMLCclRequestWrapper(this, "AMB_MP_REG_INFO_COMP", sendAr, true);
};
/**
 * This is the AmbRegistrationComponent implementation of the renderComponent function.  It takes the information retrieved from the
 * script
 * call and renders the component's visuals.
 * @param {MP_Core.ScriptReply} The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the
 * retrieveComponentData function of this object.
 */
AmbRegistrationComponent.prototype.renderComponent = function(reply) {
	var thiz = this;
	var results = null;
	this.aregI18nObj = i18n.discernabu.registration_o1;
	var criterion = this.getCriterion();
	var regcompId = this.getComponentId();
	var regcompContentElemID = 'amb_reg_reg_scroll_div' + regcompId;
	$("#" + regcompContentElemID).off();
	var deceasedhvrarray = [];
	var iqhealthhvrarray = [];
	var resultfyihvrarray = [];
	var merhomehvrarray = [];
	var racehvrarray = [];
	var ethnictyhvrarray = [];
	var langhvrarray = [];
	var religionhvr = [];
	var cehvrarray = [];
	var empsochxhvrarray = [];
	var idhvrarray = [];
	var pid = criterion.person_id;
	var eid = criterion.encntr_id;
	var uid = criterion.provider_id;
	var posid = criterion.position_cd;
	var pwx_reg_adhoc_form = [];
	var ptinfo = "";
	var regUTC = "";
	var expUTC = "";
	var medUTC = "";
	var rel_event_text = "";
	var race_event_text = "";
	var ethnicity_event_text = "";
	// check to see if PowerForms selected for Header
	//If one display just the add icon, if multiple create drop down
	if (reply.ADD_PFORM.length > 0) {
		if (reply.ADD_PFORM.length === 1) {
			pwx_reg_adhoc_form.push('<a id="'+ regcompId +'_' + reply.ADD_PFORM[0].FORM_ID + '" class="pwx_areg_no_text_decor pwx_areg_grey_link pwx_areg_small_text pwx_areg_form_launch" title="' + this.aregI18nObj.AQFORM + '"> ' + '<span class="pwx-areg_add-icon pwx_areg_no_text_decor">&nbsp;</span></a>');
		}
		else {
			var adhocformmenu = new Menu(this.adhoc_form_menu_id);
			adhocformmenu.setTypeClass("menu-page-menu");
			adhocformmenu.setIsRootMenu(false);
			adhocformmenu.setAnchorElementId(this.adhoc_form_menu_id);
			adhocformmenu.setAnchorConnectionCorner(["bottom", "right"]);
			adhocformmenu.setContentConnectionCorner(["top", "left"]);
			adhocformmenu.setLabel("");
			var adhocformenuitem = [];
			var formlength = reply.ADD_PFORM.length;
			MP_MenuManager.deleteMenuObject(this.adhoc_form_menu_id, true);
			for (var i = 0; i < formlength; i++) {
				var formid = "";
				formid = reply.ADD_PFORM[i].FORM_ID;
				adhocformenuitem[i] = new MenuItem(reply.ADD_PFORM[i].FORM_ID);
				adhocformenuitem[i].setLabel(reply.ADD_PFORM[i].FORM_NAME);
				adhocformenuitem[i].setCloseOnClick(true);
				adhocformenuitem[i].setClickFunction(function() {
					var paramString = pid + "|" + eid + "|" + this.getId() + "|" + 0.0 + "|" + 0;
					MPAGES_EVENT("POWERFORM", paramString);
					MP_MenuManager.deleteMenuObject(this.adhoc_form_menu_id, true);
					thiz.retrieveComponentData();
				});
				adhocformmenu.addMenuItem(adhocformenuitem[i]);
			}
			adhocformenuitem[formlength + 1] = new MenuItem("Allform" + this.adhoc_form_menu_id);
			adhocformenuitem[formlength + 1].setLabel(this.aregI18nObj.ALLFO);
			adhocformenuitem[formlength + 1].setCloseOnClick(true);
			adhocformenuitem[formlength + 1].setClickFunction(function() {
				var paramString = pid + "|" + eid + "|" + 0.0 + "|" + 0.0 + "|" + 0;
				MPAGES_EVENT("POWERFORM", paramString);
				MP_MenuManager.deleteMenuObject(this.adhoc_form_menu_id, true);
				thiz.retrieveComponentData();
			});
			adhocformmenu.addMenuItem(adhocformenuitem[formlength + 1]);
			MP_MenuManager.addMenuObject(adhocformmenu);

			pwx_reg_adhoc_form.push('<a id="'+ regcompId +'_' + 0.0 + '" class="pwx_areg_no_text_decor pwx_areg_grey_link pwx_areg_small_text pwx_areg_form_launch"  title="' + this.aregI18nObj.ALLFO + '">');
			pwx_reg_adhoc_form.push('<span class="pwx-areg_add-icon-plus pwx_areg_no_text_decor">&nbsp;</span></a>');
			pwx_reg_adhoc_form.push('<a id="'+ regcompId +'_pwx_chart_menu_id" class="pwx_areg_no_text_decor pwx_areg_form_menu_launch" title="' + this.aregI18nObj.AQFORM + '">');
			pwx_reg_adhoc_form.push('<span class="pwx-areg_add-icon-plus-arrow pwx_areg_no_text_decor" id="'+ regcompId +'_pwx-areg-alert-dpdown-id">&nbsp;</span></a>');
		}
	}

	var reginfoHTML = [];
	reginfoHTML.push('<div class="pwx_div_scroll" id="' + regcompContentElemID + '">');
	//key info is used for the person notifications row
	var keyinfo = '';
	var myHvr = [];
	//is patient diceased? if so add additional details
	if (reply.DECEASED_IND === 1) {
		var myHvr = [];
		myHvr.length = 1;
		myHvr[0] = ["", ""];
		myHvr[0][0] = '' + this.aregI18nObj.DEC + ':';
		if (reply.DECEASED_STR === "2") {
			var dec_areg_Str = this.aregI18nObj.DECSTR;
		}
		else {
			var dec_areg_Str = reply.DECEASED_STR;
		}
		myHvr[0][1] = dec_areg_Str;
		deceasedhvrarray.push(myHvr);
		var ptinfo = '<dl id="dec_row_'+ regcompId +'" class="pwx_areg_single_dt_wpad reg-info">' + '<span class="pwx_areg_big_text">' + reply.PERSON_NAME + '</span>&nbsp;<span class="pwx_areg_alert">(' + this.aregI18nObj.DEC + ')</span></dl>';
	}
	else {
		var ptinfo = '<dt class="pwx_areg_single_dt_wpad">' + '<span class="pwx_areg_big_text">' + reply.PERSON_NAME + '</span></dt>';
	}
	//create person demographics row
	var regbirthdate = "";
	if (reply.DOB !== "") {
	    var regbirthdateUTCDate = new Date();
	    regbirthdateUTCDate.setISO8601(reply.DOB);
	    regbirthdate = regbirthdateUTCDate.format("shortDate2");
	 } else {
	    regbirthdate = reply.DOB;
	}
	ptinfo += '<dt class="pwx_areg_single_dt_wpad">' + reply.PT_AGE + ' ' + reply.GENDER_CHAR + '<span class="disabled">&nbsp;&nbsp;&nbsp;' + this.aregI18nObj.DOB + ': </span>' + regbirthdate + '</dt>';
	//look at key info/vip statuses
	if (this.getreginfodisp() === 1) {
		//look for data and build a string
		if (reply.VIP !== '') {
			if (keyinfo === '') {
				keyinfo += '' + this.aregI18nObj.VIP + '';
			}
			else {
				keyinfo += ', ' + this.aregI18nObj.VIP + '';
			}
		}
		if (reply.ISOLATION_CD !== "") {
			if (keyinfo === '') {
				keyinfo += reply.ISOLATION_CD;
			}
			else {
				keyinfo += ', ' + reply.ISOLATION_CD;
			}
		}
	}
	//iqhealth indicator
	var notificationlineHTML = [];
	notificationlineHTML.push('<dt class="pwx_areg_single_dt_wpad">');
	//build the iqhealth details
	if (reply.PHR_MESSAGING === "1") {
		myHvr = [];
		myHvr.length = 4;
		myHvr[0] = ["", ""];
		myHvr[0][0] = '' + this.aregI18nObj.INVDATE + ':';
		myHvr[0][1] = reply.PHR_DATE;
		myHvr[1] = ["", ""];
		myHvr[1][0] = '' + this.aregI18nObj.SYS + ':';
		myHvr[1][1] = reply.PHR_SYSTEM;
		myHvr[2] = ["", ""];
		myHvr[2][0] = '' + this.aregI18nObj.APOOL + ':';
		myHvr[2][1] = reply.PHR_ALIAS_POOL;
		myHvr[3] = ["", ""];
		myHvr[3][0] = '' + this.aregI18nObj.ALI + ':';
		myHvr[3][1] = reply.PHR_ALIAS;
		iqhealthhvrarray.push(myHvr);
		notificationlineHTML.push('<span id="iqhealth_'+ regcompId +'" class="reg-info"><span class="disabled">' + this.aregI18nObj.PPOR + ' </span>' + this.aregI18nObj.YES + '</span>');
	}
	else {
		notificationlineHTML.push('<span class="disabled">' + this.aregI18nObj.PPOR + ': </span>' + this.aregI18nObj.NO + '');
	}
	//results fyi details
	if (this.getreginforesultsfyidisp() === 1) {
		if (reply.RESULTS_FYI_TYPE === "1") {
			myHvr = [];
			myHvr.length = 2;
			myHvr[0] = ["", ""];
			var resultFYIUTCDate = new Date();
			if (reply.RESULTS_FYI_DT !== '--') {
				resultFYIUTCDate.setISO8601(reply.RESULTS_FYI_DT);
				var refyiUTC = resultFYIUTCDate.format("shortDate2");
			}
			else {
				var refyiUTC = "--";
			}
			myHvr[0][0] = '' + this.aregI18nObj.SDATE + ':';
			myHvr[0][1] = refyiUTC;
			myHvr[1] = ["", ""];
			myHvr[1][0] = '' + this.aregI18nObj.STYPE + ':';
			var expUTCDate = new Date();
			if (reply.RESULTS_EXP_DATE !== '--') {
				expUTCDate.setISO8601(reply.RESULTS_EXP_DATE);
				var expUTC = expUTCDate.format("shortDate2");
			}
			else {
				var expUTC = "--";
			}
			var regUTCDate = new Date();
			if (reply.RESULTS_REG_ENC_DATE !== '--') {
				regUTCDate.setISO8601(reply.RESULTS_REG_ENC_DATE);
				var regUTC = regUTCDate.format("shortDate2");
			}
			else {
				var regUTC = "--";
			}
			//display the correct details for the type
			if (reply.RESULTS_FYI_FLAG_TYPE === 1) {
				myHvr[1][1] = this.aregI18nObj.ACTREL;
			}//active relationship
			else if (reply.RESULTS_FYI_FLAG_TYPE === 3 && reply.RESULTS_FYI_ENC_ID !== 0) {
				myHvr[1][1] = this.aregI18nObj.VIS + " " + regUTC;
			}//visit only
			else if (reply.RESULTS_FYI_FLAG_TYPE === 3 && reply.RESULTS_FYI_ENC_ID === 0 && expUTC !== "12/30/2100") {
				myHvr[1][1] = this.aregI18nObj.EXPI + " " + expUTC;
			}//expires on date
			else if (reply.RESULTS_FYI_FLAG_TYPE === 3 && reply.RESULTS_FYI_ENC_ID === 0 && expUTC === "12/30/2100") {
				myHvr[1][1] = this.aregI18nObj.INDEFI;
			}
			//infinitely
			//display list of others with results fyi on patient
			if (reply.RESULTSUB.length > 0) {
				myHvr.length = 4;
				myHvr[2] = ["", ""];
				myHvr[2][0] = '' + this.aregI18nObj.PSUB + ':';
				myHvr[2][1] = '';
				myHvr[3] = ["", ""];
				myHvr[3][0] = '';
				var fyiuserHTML = '<span class="pwx_areg_normal_line_height pwx_areg_small_text">';
				var resultsublength = reply.RESULTSUB.length;
				for (var i = 0; i < resultsublength; i++) {
					var subUTC = "";
					var subscribeUTCDate = new Date();
					if (reply.RESULTSUB[i].SUBSCRIB_DATE !== '--') {
						subscribeUTCDate.setISO8601(reply.RESULTSUB[i].SUBSCRIB_DATE);
						subUTC = subscribeUTCDate.format("shortDate2");
					}
					else {
						subUTC = "--";
					}
					fyiuserHTML += reply.RESULTSUB[i].NAME + ' <span class="disabled">(' + subUTC + ')</span><br/>';
				}
				myHvr[3][1] = fyiuserHTML;
			}
			else {
				myHvr.length = 3;
				myHvr[2] = ["", ""];
				myHvr[2][0] = '' + this.aregI18nObj.PSUB + ':';
				myHvr[2][1] = '--';
			}
			resultfyihvrarray.push(myHvr);
			notificationlineHTML.push('<span class="disabled">&nbsp;| </span><span id="resultfyi_'+ regcompId +'" class="reg-info"><span class="disabled">' + this.aregI18nObj.RFYI + ': </span>' + this.aregI18nObj.YES + '</span>');
		}
		else {
			notificationlineHTML.push('<span class="disabled">&nbsp;| ' + this.aregI18nObj.RFYI + ': </span>' + this.aregI18nObj.NO + '</span>');
		}
	}
	else {
		notificationlineHTML.push('');
	}
	//create medical home details
	var med_event_text;
	if (this.getreginfomedicalhomedisp() === 1 && reply.MED_HOME_VALUE !== "") {
		if (reply.MEDHOME_DATE_IND === 1) {
			var medhomeUTCDate = new Date();
			medhomeUTCDate.setISO8601(reply.MED_HOME_VALUE);
			med_event_text = medhomeUTCDate.format("shortDate2");
		}
		else {
			med_event_text = reply.MED_HOME_VALUE;
		}
		myHvr = [];
		myHvr.length = 2;
		myHvr[0] = ["", ""];
		myHvr[0][0] = '' + this.aregI18nObj.MHOME + ':';
		myHvr[0][1] = med_event_text;
		myHvr[1] = ["", ""];
		myHvr[1][0] = '' + this.aregI18nObj.DATE + ':';
		var medicalHOMEUTCDate = new Date();
		if (reply.MED_HOME_DT !== '--') {
			medicalHOMEUTCDate.setISO8601(reply.MED_HOME_DT);
			var medUTC = medicalHOMEUTCDate.format("shortDate2");
		}
		else {
			var medUTC = "--";
		}
		myHvr[1][1] = medUTC;
		merhomehvrarray.push(myHvr);
		notificationlineHTML.push('<span class="disabled">&nbsp;|</span> <span id="medhome_'+regcompId+'" class="reg-info"><span class="disabled">' + this.aregI18nObj.PCMH + ': </span>' + med_event_text + '</span>');
	}
	notificationlineHTML.push('<dt>');
	//check if string still empty and if not build the row
	if (keyinfo !== '') {
		reginfoHTML.push('<dl class="pwx_reg_pad-info pwx_areg_blue2_border">' + ptinfo + '<dt class="pwx_areg_single_dt_wpad"><span class="pwx-areg_warning-icon">&nbsp;</span>' + keyinfo + '</dt>' + notificationlineHTML.join("") + '</dl>');
	}
	else {
		reginfoHTML.push('<dl class="pwx_reg_pad-info pwx_areg_blue2_border">' + ptinfo + notificationlineHTML.join("") + '</dl>');
	}
	//create the top var and indicator
	var border_type = 'pwx_areg_grey_border_top-info';
	//display race details if on
	var race_event_text;
	if (this.getreginforacedisp() === 1) {
		border_type = 'pwx_areg_grey_border-info';
		if (reply.RACE_DATE_IND === 1) {
			var raceeventUTCDate = new Date();
			raceeventUTCDate.setISO8601(reply.RACE);
			race_event_text = raceeventUTCDate.format("shortDate2");
		}
		else {
			race_event_text = reply.RACE;
		}
		//if race_id > 0 it's a clinical event add link
		if (reply.RACE_ID > 0) {
			//build hover
			var myHvr = [];
			myHvr.length = 4;
			myHvr[0] = ["", ""];
			myHvr[0][0] = '' + this.aregI18nObj.NAME + ':';
			myHvr[0][1] = reply.RACE_CD;
			myHvr[1] = ["", ""];
			myHvr[1][0] = '' + this.aregI18nObj.RES + ':';
			myHvr[1][1] = race_event_text;
			myHvr[2] = ["", ""];
			myHvr[2][0] = '' + this.aregI18nObj.DAT + ':';
			var raceUTCDate = new Date();
			if (reply.RACE_RESULTED_DT !== '--') {
				raceUTCDate.setISO8601(reply.RACE_RESULTED_DT);
				var raceUTC = raceUTCDate.format("shortDate2");
			}
			else {
				var raceUTC = "--";
			}
			myHvr[2][1] = raceUTC;
			myHvr[3] = ["", ""];
			myHvr[3][0] = '' + this.aregI18nObj.RESBY + ':';
			myHvr[3][1] = reply.RACE_RESULTED_BY;
			racehvrarray.push(myHvr);
			if (reply.RACE_FLAG === 0) {
				// result
				reginfoHTML.push('<dl id="race_'+regcompId+'" class="' + border_type + ' reg-info"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.RACE + ':</dt><dd class="pwx_areg_2_col_value_reg">', '<a id="pwx_areg_result_' + reply.RACE_ID + '" class="pwx_areg_result_link pwx_areg_api_class"  title="' + this.aregI18nObj.VRESULT + '">', race_event_text + '</a></dd>');
			}
			else {
				//form
				reginfoHTML.push('<dl id="race_'+regcompId+'" class="' + border_type + ' reg-info"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.RACE + ':</dt><dd class="pwx_areg_2_col_value_reg">', '<a id="pwx_areg_form_' + reply.RACE_ID + '" class="pwx_areg_result_link pwx_areg_api_class"  title="' + this.aregI18nObj.VFORM + '">', race_event_text + '</a></dd>');
			}
			//end dl and create hover
			reginfoHTML.push('</dl>');
		}
		else {
			reginfoHTML.push('<dl class="' + border_type + '"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.RACE + ':</dt><dd class="pwx_areg_2_col_value_reg">', race_event_text + '</dd></dl>');
		}
	}
	//display ethnicity details if on
	if (this.getreginfoethnicitydisp() === 1) {
		border_type = 'pwx_areg_grey_border-info';
		var ethnicity_event_text;
		if (reply.ETHNICITY_DATE_IND === 1) {
			var ethnicityeventUTCDate = new Date();
			ethnicityeventUTCDate.setISO8601(reply.ETHNICITY);
			ethnicity_event_text = ethnicityeventUTCDate.format("shortDate2");
		}
		else {
			ethnicity_event_text = reply.ETHNICITY;
		}
		//if id > 0 it's a clinical event add link
		if (reply.ETHNIC_ID > 0) {
			//build hover
			var myHvr = [];
			myHvr.length = 4;
			myHvr[0] = ["", ""];
			myHvr[0][0] = '' + this.aregI18nObj.NAME + ':';
			myHvr[0][1] = reply.ETHNIC_CD;
			myHvr[1] = ["", ""];
			myHvr[1][0] = '' + this.aregI18nObj.RES + ':';
			myHvr[1][1] = ethnicity_event_text;
			myHvr[2] = ["", ""];
			myHvr[2][0] = '' + this.aregI18nObj.DAT + ':';
			var ethnicUTCDate = new Date();
			if (reply.ETHNIC_RESULTED_DT !== '--') {
				ethnicUTCDate.setISO8601(reply.ETHNIC_RESULTED_DT);
				var ethnicUTC = ethnicUTCDate.format("shortDate2");
			}
			else {
				var ethnicUTC = "--";
			}
			myHvr[2][1] = ethnicUTC;
			myHvr[3] = ["", ""];
			myHvr[3][0] = '' + this.aregI18nObj.RESBY + ':';
			myHvr[3][1] = reply.ETHNIC_RESULTED_BY;
			ethnictyhvrarray.push(myHvr);
			if (reply.ETHNIC_FLAG === 0) {
				//result
				reginfoHTML.push('<dl id="ethnicty_'+regcompId+'" class="' + border_type + ' reg-info"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.ETHIN + ':</dt><dd class="pwx_areg_2_col_value_reg">', '<a id="pwx_areg_result_' + reply.ETHNIC_ID + '" class="pwx_areg_result_link pwx_areg_api_class"  title="' + this.aregI18nObj.VRESULT + '">', ethnicity_event_text + '</a></dd>');
			}
			else {
				//form
				reginfoHTML.push('<dl id="ethnicty_'+regcompId+'" class="' + border_type + ' reg-info"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.ETHIN + ':</dt><dd class="pwx_areg_2_col_value_reg">', '<a id="pwx_areg_form_' + reply.ETHNIC_ID + '" class="pwx_areg_result_link pwx_areg_api_class"  title="' + this.aregI18nObj.VFORM + '">', ethnicity_event_text + '</a></dd>');
			}
			//end dl and create hover
			reginfoHTML.push('</dl>');
		}
		else {
			reginfoHTML.push('<dl class="' + border_type + '"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.ETHIN + ':</dt><dd class="pwx_areg_2_col_value_reg">', ethnicity_event_text + '</dd></dl>');
		}
	}
	//marital status on or off?
	if (this.getreginfomaritalstatdisp() === 1) {
		reginfoHTML.push('<dl class="' + border_type + '">');
		border_type = 'pwx_areg_grey_border-info';
		reginfoHTML.push('<dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.MARISTA + ':</dt><dd class="pwx_areg_2_col_value_reg">', reply.MARITAL_STATUS + '</dd></dl>');
	}
	//language on or off?
	if (this.getreginfolanguagedisp() === 1) {
		border_type = 'pwx_areg_grey_border-info';
		var lang_event_text;
		if (reply.LANGUAGE_DATE_IND === 1) {
			var langeventUTCDate = new Date();
			langeventUTCDate.setISO8601(reply.LANGUAGE);
			lang_event_text = langeventUTCDate.format("shortDate2");
		}
		else {
			lang_event_text = reply.LANGUAGE;
		}
		//if id > 0 it's a clinical event add link
		if (reply.LANG_ID > 0) {
			//build hover
			var myHvr = [];
			myHvr.length = 4;
			myHvr[0] = ["", ""];
			myHvr[0][0] = '' + this.aregI18nObj.NAME + ':';
			myHvr[0][1] = reply.LANG_CD;
			myHvr[1] = ["", ""];
			myHvr[1][0] = '' + this.aregI18nObj.RES + ':';
			myHvr[1][1] = lang_event_text;
			myHvr[2] = ["", ""];
			myHvr[2][0] = '' + this.aregI18nObj.DAT + ':';
			var langUTCDate = new Date();
			if (reply.LANG_RESULTED_DT !== '--') {
				langUTCDate.setISO8601(reply.LANG_RESULTED_DT);
				var langUTC = langUTCDate.format("shortDate2");
			}
			else {
				var langUTC = "--";
			}
			myHvr[2][1] = langUTC;
			myHvr[3] = ["", ""];
			myHvr[3][0] = '' + this.aregI18nObj.RESBY + ':';
			myHvr[3][1] = reply.LANG_RESULTED_BY;
			langhvrarray.push(myHvr);
			if (reply.LANG_FLAG === 0) {
				//result
				reginfoHTML.push('<dl id="lang_'+regcompId+'" class="' + border_type + ' reg-info"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.PRELANG + ':</dt><dd class="pwx_areg_2_col_value_reg">', '<a id="pwx_areg_result_' + reply.LANG_ID + '" class="pwx_areg_result_link pwx_areg_api_class"  title="' + this.aregI18nObj.VRESULT + '">', lang_event_text + '</a></dd>');
			}
			else {
				//form
				reginfoHTML.push('<dl id="lang_'+regcompId+'" class="' + border_type + ' reg-info"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.PRELANG + ':</dt><dd class="pwx_areg_2_col_value_reg">', '<a id="pwx_areg_form_' + reply.LANG_ID + '" class="pwx_areg_result_link pwx_areg_api_class"  title="' + this.aregI18nObj.VFORM + '">', lang_event_text + '</a></dd>');
			}
			//end dl and create hover
			reginfoHTML.push('</dl>');
		}
		else {
			reginfoHTML.push('<dl class="' + border_type + '"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.PRELANG + ':</dt><dd class="pwx_areg_2_col_value_reg">', lang_event_text + '</dd></dl>');
		}
	}
	//religion on or off?
	if (this.getreginforeligiondisp() === 1) {
		border_type = 'pwx_areg_grey_border-info';
		var rel_event_text;
		if (reply.RELIGION_DATE_IND === 1) {
			var religioneventUTCDate = new Date();
			religioneventUTCDate.setISO8601(reply.RELIGION);
			rel_event_text = religioneventUTCDate.format("shortDate2");
		}
		else {
			rel_event_text = reply.RELIGION;
		}
		//if id > 0 it's a clinical event add link
		if (reply.RELIGION_ID > 0) {
			//build hover
			var myHvr = [];
			myHvr.length = 4;
			myHvr[0] = ["", ""];
			myHvr[0][0] = '' + this.aregI18nObj.NAME + ':';
			myHvr[0][1] = reply.RELIGION_CD;
			myHvr[1] = ["", ""];
			myHvr[1][0] = '' + this.aregI18nObj.RES + ':';
			myHvr[1][1] = rel_event_text;
			myHvr[2] = ["", ""];
			myHvr[2][0] = '' + this.aregI18nObj.DAT + ':';
			var religionUTCDate = new Date();
			var religionUTC = "";
			if (reply.RELIGION_RESULTED_DT !== '--') {
				religionUTCDate.setISO8601(reply.RELIGION_RESULTED_DT);
				religionUTC = religionUTCDate.format("shortDate2");
			}
			else {
				religionUTC = "--";
			}
			myHvr[2][1] = religionUTC;
			myHvr[3] = ["", ""];
			myHvr[3][0] = '' + this.aregI18nObj.RESBY + ':';
			myHvr[3][1] = reply.RELIGION_RESULTED_BY;
			religionhvr.push(myHvr);
			if (reply.RELIGION_FLAG === 0) {
				//result
				reginfoHTML.push('<dl id="religion_'+regcompId+'" class="' + border_type + ' reg-info"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.RELI + ':</dt><dd class="pwx_areg_2_col_value_reg">', '<a id="pwx_areg_result_' + reply.RELIGION_ID + '" class="pwx_areg_result_link pwx_areg_api_class"  title="' + this.aregI18nObj.VRESULT + '">', rel_event_text + '</a></dd>');
			}
			else {
				//form
				reginfoHTML.push('<dl id="religion_'+regcompId+'" class="' + border_type + ' reg-info"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.RELI + ':</dt><dd class="pwx_areg_2_col_value_reg">', '<a id="pwx_areg_form_' + reply.RELIGION_ID + '" class="pwx_areg_result_link pwx_areg_api_class"  title="' + this.aregI18nObj.VFORM + '">', rel_event_text + '</a></dd>');
			}
			//end dl and create hover
			reginfoHTML.push('</dl>');
		}
		else {
			reginfoHTML.push('<dl class="' + border_type + '"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.RELI + ':</dt><dd class="pwx_areg_2_col_value_reg">', rel_event_text + '</dd></dl>');
		}
	}
	//nickname on and present?
	if (this.getreginfonicknamedisp() === 1 && reply.NICKNAME !== '') {
		reginfoHTML.push('<dl class="' + border_type + '"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.NINAME + ':</dt><dd class="pwx_areg_2_col_value_reg">' + reply.NICKNAME + '</dd></dl>');
		border_type = 'pwx_areg_grey_border-info';
	}
	//mothers maiden name on and present?
	if (this.getreginfomothermaidendisp() === 1 && reply.MAIDEN_NAME !== '') {
		reginfoHTML.push('<dl class="' + border_type + '"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.MNAME + ':</dt><dd class="pwx_areg_2_col_value_reg">' + reply.MAIDEN_NAME + '</dd></dl>');
		border_type = 'pwx_areg_grey_border-info';
	}
	//military status on and present?
	if (this.getreginfomilitarydisp() === 1 && reply.MILITARY_STATUS !== '') {
		reginfoHTML.push('<dl class="' + border_type + '"><dt class="pwx_areg_2_col_lbl_reg disabled"' + this.aregI18nObj.MSTATUS + ':</dt><dd class="pwx_areg_2_col_value_reg">' + reply.MILITARY_STATUS + '</dd></dl>');
		border_type = 'pwx_areg_grey_border-info';
	}
	//citizenship on and present?
	if (this.getreginfocitizenshipdisp() === 1 && reply.CITIZENSHIP !== '') {
		reginfoHTML.push('<dl class="' + border_type + '"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.CITIZEN + ':</dt><dd class="pwx_areg_2_col_value_reg">' + reply.CITIZENSHIP + '</dd></dl>');
		border_type = 'pwx_areg_grey_border-info';
	}
	// other clinical events present?
	if (reply.OTHER_EVENTS.length > 0) {
		var othereventlength = reply.OTHER_EVENTS.length;
		var clinical_event_index = 0;
		for (var cc = 0; cc < othereventlength; cc++) {
		   if(reply.OTHER_EVENTS[cc].OTHER_IND === 1){
			var clinical_event_text = "";
			if (reply.OTHER_EVENTS[cc].DATE_IND === 1) {
				var clinicaleventUTCDate = new Date();
				clinicaleventUTCDate.setISO8601(reply.OTHER_EVENTS[cc].DATE_TEXT);
				clinical_event_text = clinicaleventUTCDate.format("shortDate2");
			}
			else {
				clinical_event_text = reply.OTHER_EVENTS[cc].TEXT;
			}
			var myHvr = [];
			myHvr.length = 4;
			myHvr[0] = ["", ""];
			myHvr[0][0] = '' + this.aregI18nObj.NAME + ':';
			myHvr[0][1] = reply.OTHER_EVENTS[cc].LBL;
			myHvr[1] = ["", ""];
			myHvr[1][0] = '' + this.aregI18nObj.RES + ':';
			myHvr[1][1] = clinical_event_text;
			myHvr[2] = ["", ""];
			myHvr[2][0] = '' + this.aregI18nObj.DAT + ':';
			var eventUTCDate = new Date();
			var eventUTC = "";
			if (reply.OTHER_EVENTS[cc].RESULTED_DT !== '--') {
				eventUTCDate.setISO8601(reply.OTHER_EVENTS[cc].RESULTED_DT);
				eventUTC = eventUTCDate.format("shortDate2");
			}
			else {
				eventUTC = "--";
			}
			myHvr[2][1] = eventUTC;
			myHvr[3] = ["", ""];
			myHvr[3][0] = '' + this.aregI18nObj.RESBY + ':';
			myHvr[3][1] = reply.OTHER_EVENTS[cc].RESULTED_BY;
			cehvrarray.push(myHvr);
			reginfoHTML.push('<dl id="clinicalevent_row_' + clinical_event_index + '_'+regcompId+'" class="' + border_type + ' reg-info">');
			border_type = 'pwx_areg_grey_border-info';
            
			if(reply.OTHER_EVENTS[cc].ID !== 0 && reply.OTHER_EVENTS[cc].FLAG === 1){
            //form
			reginfoHTML.push('<dt class="pwx_areg_2_col_lbl_reg disabled">' + reply.OTHER_EVENTS[cc].LBL + ':</dt><dd class="pwx_areg_2_col_value_reg">', '<a id="pwx_areg_form_' + reply.OTHER_EVENTS[cc].ID + '_'+regcompId+'" class="pwx_areg_result_link pwx_areg_api_class"  title="' + this.aregI18nObj.VFORM + '">', clinical_event_text + '</a></dd>'); }
            else if(reply.OTHER_EVENTS[cc].ID !== 0){
            //result
			reginfoHTML.push('<dt class="pwx_areg_2_col_lbl_reg disabled">' + reply.OTHER_EVENTS[cc].LBL + ':</dt><dd class="pwx_areg_2_col_value_reg">', '<a id="pwx_areg_result_' + reply.OTHER_EVENTS[cc].ID + '_'+regcompId+'" class="pwx_areg_result_link pwx_areg_api_class"  title="' + this.aregI18nObj.VRESULT + '">', clinical_event_text + '</a></dd>');} 
            else{
            //no id
	        reginfoHTML.push('<dt class="pwx_areg_2_col_lbl_reg disabled">' + reply.OTHER_EVENTS[cc].LBL + ':</dt><dd class="pwx_areg_2_col_value_reg">', clinical_event_text + '</dd>');
			}		
			reginfoHTML.push('</dl>');
			clinical_event_index = clinical_event_index + 1;
		  }	
		}
	}
	//build addresses
	if (reply.ADDY_SEC_DISP === 1) {
		//build all the header except for text
		var add_title_id = '' + regcompId + 'add';
		var add_row_id = '' + regcompId + 'add_rows';
		var add_tgl_id = '' + regcompId + 'add_tgl';
		reginfoHTML.push('<dl class="pwx_reg_pad-info"><dt class="pwx_areg_single_sub_sec_dt"><a id="' + add_title_id + '" class="pwx_areg_sub_sec_link reginfo_main_section_evt" title="' + i18n.HIDE_SECTION + '">', '<h3 class="sub-sec-hd"><span id="' + add_tgl_id + '" class="pwx-areg_sub-sec-hd-tgl">-</span>');
		//is addresses empty?
		if (reply.ADDY_LIST.length !== 0) {
			//build the header and div
			reginfoHTML.push('<span class="sub-sec-title">' + this.getreginfoaddresslabel() + '<span class="pwx_areg_small_text"> (' + reply.ADDY_LIST.length, ')</span></span></h3></a></dt></dl>', '<div id="' + add_row_id + '" style="display:block">');
			//output results
			var addlength = reply.ADDY_LIST.length;
			for (var cc = 0; cc < addlength; cc++) {
				reginfoHTML.push('<dl class="pwx_areg_grey_border-info pwx_areg_small_text"><dt class="pwx_areg_2_col_lbl_reg disabled">' + reply.ADDY_LIST[cc].ADDY_TYPE, ':</dt><dd class="pwx_areg_2_col_value_reg">' + reply.ADDY_LIST[cc].ADDY_LINE1 + '<br />' + reply.ADDY_LIST[cc].ADDY_LINE2 + '</dd></dl>');
			}
			//check for email
			if (reply.EMAIL !== '') {
				reginfoHTML.push('<dl class="pwx_areg_grey_border-info pwx_areg_small_text"><dt class="pwx_areg_2_col_lbl_reg disabled">' + this.aregI18nObj.EMAIL + ':', '</dt><dd class="pwx_areg_2_col_value_reg">' + reply.EMAIL + '</dd></dl>');
			}
			//end div
			reginfoHTML.push('</div>');
		}
		else {
			reginfoHTML.push('<span class="sub-sec-title">' + this.getreginfoaddresslabel() + '<span class="pwx_areg_small_text"> (0)</span></span></h3></a></dt></dl>', '<dl class="pwx_areg_grey_border-info pwx_areg_small_text" id="' + add_row_id + '" style="display:block"><dt class="pwx_areg_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
		}
	}
	//build phones
	if (reply.PHONE_SEC_DISP === 1) {
		//build all the header except for text
		var phone_title_id = '' + regcompId + 'phone';
		var phone_row_id = '' + regcompId + 'phone_rows';
		var phone_tgl_id = '' + regcompId + 'phone_tgl';
		reginfoHTML.push('<dl class="pwx_reg_pad-info"><dt class="pwx_areg_single_sub_sec_dt"><a id="' + phone_title_id + '" class="pwx_areg_sub_sec_link reginfo_main_section_evt" title="' + i18n.HIDE_SECTION + '">', '<h3 class="sub-sec-hd"><span id="' + phone_tgl_id + '" class="pwx-areg_sub-sec-hd-tgl">-</span>');
		//is phones empty?
		if (reply.PHONE_LIST.length !== 0) {
			//build the header and div
			reginfoHTML.push('<span class="sub-sec-title">' + this.getreginfophonelabel() + '<span class="pwx_areg_small_text"> (' + reply.PHONE_LIST.length, ')</span></span></h3></a></dt></dl>', '<div id="' + phone_row_id + '" style="display:block">');
			//output results
			var phonelength = reply.PHONE_LIST.length;
			for (var cc = 0; cc < phonelength; cc++) {
				reginfoHTML.push('<dl class="pwx_areg_grey_border-info pwx_areg_small_text"><dt class="pwx_areg_2_col_lbl_reg disabled">' + reply.PHONE_LIST[cc].PHONE_TYPE, ':</dt><dd class="pwx_areg_2_col_value_reg">' + reply.PHONE_LIST[cc].PHONE_NUM + '</dd></dl>');
			}
			//end div
			reginfoHTML.push('</div>');
		}
		else {
			reginfoHTML.push('<span class="sub-sec-title">' + this.getreginfophonelabel() + '<span class="pwx_areg_small_text"> (0)</span></span></h3></a></dt></dl>', '<dl class="pwx_areg_grey_border-info pwx_areg_small_text" id="' + phone_row_id + '" style="display:block"><dt class="pwx_areg_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
		}
	}
	//build employment
	if (this.getreginfoemploydisp() === 1) {
		//build all the header except for text
		var employ_title_id = '' + regcompId + 'employ';
		var employ_row_id = '' + regcompId + 'employ_rows';
		var employ_tgl_id = '' + regcompId + 'employ_tgl';
		reginfoHTML.push('<dl class="pwx_reg_pad-info"><dt class="pwx_areg_single_sub_sec_dt"><a id="' + employ_title_id + '" class="pwx_areg_sub_sec_link reginfo_main_section_evt" title="' + i18n.HIDE_SECTION + '">', '<h3 class="sub-sec-hd"><span id="' + employ_tgl_id + '" class="pwx-areg_sub-sec-hd-tgl">-</span>', '<span class="sub-sec-title">' + this.getreginfoemploylabel() + '</span></h3></a></dt></dl>', '<div id="' + employ_row_id + '" style="display:block">');
		//is employment or employment social hx empty?
		if (reply.EMPLOY_LIST.length > 0 || reply.EMP_SOCHX.length > 0) {
			//output employment results
			var emplolength = reply.EMPLOY_LIST.length;
			for (var cc = 0; cc < emplolength; cc++) {
				reginfoHTML.push('<dl class="pwx_areg_grey_border-info pwx_areg_small_text"><dt class="pwx_areg_single_dt_wpad">' + reply.EMPLOY_LIST[cc].EMPLOYER + '&nbsp;&nbsp;&nbsp;<span class="disabled">');
				var emp_spacer = '';
				if (reply.EMPLOY_LIST[cc].OCCUPATION !== '') {
					reginfoHTML.push(emp_spacer + reply.EMPLOY_LIST[cc].OCCUPATION);
					emp_spacer = ', ';
				}
				if (reply.EMPLOY_LIST[cc].STATUS !== '') {
					reginfoHTML.push(emp_spacer + reply.EMPLOY_LIST[cc].STATUS);
					emp_spacer = ', ';
				}
				if (reply.EMPLOY_LIST[cc].HIRE_DATE !== '') {
					reginfoHTML.push(emp_spacer + reply.EMPLOY_LIST[cc].HIRE_DATE);
					if (reply.EMPLOY_LIST[cc].END_DATE !== '') {
						reginfoHTML.push(' - ' + reply.EMPLOY_LIST[cc].END_DATE);
					}
					else {
						reginfoHTML.push(' - ' + this.aregI18nObj.CURR + '');
					}
				}
				reginfoHTML.push('</span></dt></dl>');
			}
			//output employment social history results
			var empsociallength = reply.EMP_SOCHX.length;
			for (var cc = 0; cc < empsociallength; cc++) {
				var myHvr = [];
				myHvr.length = 2;
				myHvr[0] = ["", ""];
				myHvr[0][0] = '' + this.aregI18nObj.SOHISTORY + ':';
				myHvr[0][1] = '';
				myHvr[1] = ["", ""];
				myHvr[1][0] = '';
				myHvr[1][1] = reply.EMP_SOCHX[cc].TEXT;
				empsochxhvrarray.push(myHvr);
				reginfoHTML.push('<dl id="employ_row_' + cc + '_'+regcompId+'" class="pwx_areg_grey_border-info pwx_areg_small_text reg-info"><dt class="pwx_areg_single_dt_wpad">');
				if (reply.EMP_SOCHX[cc].TEXT.length > 100) {
					reginfoHTML.push(reply.EMP_SOCHX[cc].TEXT.substr(0, 100) + ' ...');
				}
				else {
					reginfoHTML.push(reply.EMP_SOCHX[cc].TEXT);
				}
				reginfoHTML.push('</dt></dl>');
			}
		}
		else {
			reginfoHTML.push('<dl class="pwx_areg_grey_border-info pwx_areg_small_text"><dt class="pwx_areg_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
		}
		//end div
		reginfoHTML.push('</div>');
	}
	//build identifiers
	if (reply.ID_SEC_DISP === 1) {
		//build all the header except for text
		var identifier_title_id = '' + regcompId + 'identifier';
		var identifier_row_id = '' + regcompId + 'identifier_rows';
		var identifier_tgl_id = '' + regcompId + 'identifier_tgl';
		reginfoHTML.push('<dl class="pwx_reg_pad-info"><dt class="pwx_areg_single_sub_sec_dt"><a id="' + identifier_title_id + '" class="pwx_areg_sub_sec_link reginfo_main_section_evt" title="' + i18n.HIDE_SECTION + '">', '<h3 class="sub-sec-hd"><span id="' + identifier_tgl_id + '" class="pwx-areg_sub-sec-hd-tgl">-</span>');
		//is id list empty?
		if (reply.ID_LIST.length !== 0) {
			//build the header and div
			reginfoHTML.push('<span class="sub-sec-title">' + this.getreginfoidentifierslabel() + '<span class="pwx_areg_small_text"> (' + reply.ID_LIST.length, ')</span></span></h3></a></dt></dl>', '<div id="' + identifier_row_id + '" style="display:block">');
			//output results
			var identilength = reply.ID_LIST.length;
			for (var cc = 0; cc < identilength; cc++) {
				var myHvr = [];
				myHvr.length = 2;
				myHvr[0] = ["", ""];
				myHvr[0][0] = '' + this.aregI18nObj.SYS + ':';
				myHvr[0][1] = reply.ID_LIST[cc].ID_CONTRIB_SYS;
				myHvr[1] = ["", ""];
				myHvr[1][0] = '' + this.aregI18nObj.APOOL + ':';
				myHvr[1][1] = reply.ID_LIST[cc].ID_ALIAS_POOL;
				idhvrarray.push(myHvr);
				reginfoHTML.push('<dl id="identifier_row_' + cc + '_'+regcompId+'" class="pwx_areg_grey_border-info pwx_areg_small_text reg-info"><dt class="pwx_areg_2_col_lbl_reg disabled">' + reply.ID_LIST[cc].ID_TYPE, ':</dt><dd class="pwx_areg_2_col_value_reg">' + reply.ID_LIST[cc].ID_VALUE + '</dd></dl>');
			}
			//end div
			reginfoHTML.push('</div>');
		}
		else {
			reginfoHTML.push('<span class="sub-sec-title">' + this.getreginfoidentifierslabel() + '<span class="pwx_areg_small_text"> (0)</span></span></h3></a></dt></dl>', '<dl class="pwx_areg_grey_border-info pwx_areg_small_text" id="' + identifier_row_id + '" style="display:block"><dt class="pwx_areg_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
		}
	}
	reginfoHTML.push('<span class="pwx_areg_identifier_class">person_id:  ' + pid + ' , encntr_id:  ' + eid + '</span>');
	reginfoHTML.push('</div>');
	this.finalizeComponent(reginfoHTML.join(""), pwx_reg_adhoc_form.join(""));

	var regcompContentDiv = $("#" + regcompContentElemID);
    var areg_dp_form_launch = $(".pwx_areg_form_menu_launch");
	var areg_form_launch  = $("a.pwx_areg_form_launch")
	//create PowerForm drop down menu events
	areg_dp_form_launch.unbind("click");
	areg_dp_form_launch.click(function() {
		var anchorElemId = $(this).attr("id");
		if (anchorElemId === adhocformmenu.getAnchorElementId()) {
			adhocformmenu.setAnchorElementId(thiz.adhoc_form_menu_id);
			MP_MenuManager.closeMenuStack(thiz.adhoc_form_menu_id);
		}
		else {
			adhocformmenu.setAnchorElementId(anchorElemId);
			MP_MenuManager.showMenu(thiz.adhoc_form_menu_id);
		}
	});
	//create PowerForm launch events
	areg_form_launch.unbind("click");
	areg_form_launch.click(function() {
	    var reg_form_id = $(this).attr('id').split("_"); 
		var paramString = pid + "|" + eid + "|" + reg_form_id[1] + "|" + 0.0 + "|" + 0;
		MPAGES_EVENT("POWERFORM", paramString);
		thiz.retrieveComponentData();
	});
	//create subsection expand/collapse events
	regcompContentDiv.off("click", "a.reginfo_main_section_evt");
	regcompContentDiv.on("click", "a.reginfo_main_section_evt", function(event) {
		thiz.expandCollapseRegInfoSubSections($(this).attr('id'));
	});
	//create clinical event viewer link events
	regcompContentDiv.off("click", "a.pwx_areg_api_class");
	regcompContentDiv.on("click", "a.pwx_areg_api_class", function(event) {
		var reg_array = $(this).attr('id').split("_");
		if (reg_array[2] === "result") {
			ambRegistrationInfoResultsView(pid, reg_array[3]);
		}
		else {
			ambRegistrationInfoFormLaunch(pid, eid, 0.0, reg_array[3], 0);
		}
	});
	//hovers and check scrolling activate hovers
	var elementMap = {};
	// remove event if there is any
	regcompContentDiv.off("mouseenter", ".reg-info");
	regcompContentDiv.off("mouseleave", ".reg-info");
	//attach event
	regcompContentDiv.on("mouseenter", ".reg-info", function(event) {
		var anchor = this;
		$(this).css("background-color", "#FFFCE0");
		var anchorId = $(this).attr("id");
		//If there is a hover class specified, add it to the element
		$(this).addClass("mpage-tooltip-hover");
		if (!elementMap[anchorId]) {
			elementMap[anchorId] = {};
		}
		//Store of a flag that we're hovered inside this element
		elementMap[anchorId].TIMEOUT = setTimeout(function() {
			showRegHover(event, anchor);
		}, 500);
	});
	//mouse leave event
	regcompContentDiv.on("mouseleave", ".reg-info", function(event) {
		$(this).css("background-color", "#FFF");
		$(this).removeClass("mpage-tooltip-hover");
		clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
	});
	/*
	 * @constructor Handles creating and showing hovers in the component
	 * @param {object} event : The jquery event
	 * @param {object} anchor : The element that triggered the hover.
	 */
	function showRegHover(event, anchor) {
		var jsonId = $(anchor).attr("id").split("_");
		switch (jsonId[0]) {
			case "dec":
				showregHoverHTML(event, anchor, deceasedhvrarray[0]);
				break;
			case "iqhealth":
				showregHoverHTML(event, anchor, iqhealthhvrarray[0]);
				break;
			case "resultfyi":
				showregHoverHTML(event, anchor, resultfyihvrarray[0]);
				break;
			case "medhome":
				showregHoverHTML(event, anchor, merhomehvrarray[0]);
				break;
			case "race":
				showregHoverHTML(event, anchor, racehvrarray[0]);
				break;
			case "ethnicty":
				showregHoverHTML(event, anchor, ethnictyhvrarray[0]);
				break;
			case "lang":
				showregHoverHTML(event, anchor, langhvrarray[0]);
				break;
			case "religion":
				showregHoverHTML(event, anchor, religionhvr[0]);
				break;
			case "clinicalevent":			    
				showregHoverHTML(event, anchor, cehvrarray[jsonId[2]]);
				break;
			case "employ":
				showregHoverHTML(event, anchor, empsochxhvrarray[jsonId[2]]);
				break;
			case "identifier":
				showregHoverHTML(event, anchor, idhvrarray[jsonId[2]]);
				break;
		}
	}
	/*
	 * @constructor builds hover HTML for the component
	 * @param {object} event : The jquery event
	 * @param {object} anchor : The element that triggered the hover.
	 * @param {array} anchor : The Array to use when creating hover details.
	 */
	function showregHoverHTML(event, anchor, reghoverarray) {
		var reghvr = [];
		reghvr.push('<div class="result-details pwx_areg_result_details">');
		for (var i = 0; i < reghoverarray.length; i++) {
			reghvr.push('<dl class="reg-det">', '<dt><span>' + reghoverarray[i][0] + '</span></dt><dd><span>' + reghoverarray[i][1] + '</span></dd></dl>');
		}
		//Create a new tooltip
		reghvr.push('</div>');
		var reghvrtooltip = thiz.tooltip;
		reghvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(reghvr.join(""));
		reghvrtooltip.show();
	}
	/*
	 * @constructor Handles launching results viewer for the component
	 * @param {float} persId : The person in context's personid
	 * @param {float} eventId : The clinical event for the result
	 */
	function ambRegistrationInfoResultsView(persId, eventId) {
		var pwxPVViewerMPage = window.external.DiscernObjectFactory('PVVIEWERMPAGE');
		pwxPVViewerMPage.CreateEventViewer(persId);
		pwxPVViewerMPage.AppendEvent(eventId);
		pwxPVViewerMPage.LaunchEventViewer();
	}
	/*
	 * @constructor Handles launching Powerforms viewer for the component
	 * @param {float} persId : The person in context's person_id
	 * @param {float} encntrId : The persons encounter in context's encntr_id
	 * @param {float} formId : The PowerForm's ID
	 * @param {float} activityId : The charted PowerForms instance activity ID
	 * @param {float} activityId : PowerForm viwer chart mode 0 for read only/ 1 for modify
	 */
	function ambRegistrationInfoFormLaunch(persId, encntrId, formId, activityId, chartMode) {
		var paramString = persId + "|" + encntrId + "|" + formId + "|" + activityId + "|" + chartMode;
		MPAGES_EVENT("POWERFORM", paramString);
	}
};
/**
 * Map the Registration Information O1 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "AMB_REG_INFO" filter
 */
MP_Util.setObjectDefinitionMapping("AMB_REG_INFO", AmbRegistrationComponent);