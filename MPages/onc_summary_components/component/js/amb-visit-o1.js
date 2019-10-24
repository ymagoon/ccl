/**
 * Create the component style object which will be used to style various aspects of our component
 */
function AmbVisitComponentStyle() {
	this.initByNamespace("av");
}

AmbVisitComponentStyle.inherits(ComponentStyle);
/**
 * @constructor
 * Initialize the Visit component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function AmbVisitComponent(criterion) {

	this.setCriterion(criterion);
	this.setStyles(new AmbVisitComponentStyle());
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.AMBVISIT.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.AMBVISIT.O1 - render component");

	//make my variables and then make getters/setters
	this.resultCount = 0;
	this.avI18nObj = {};

	//hovers
	this.tooltip = new MPageTooltip();

	//Make sure the architecture includes the result count when creating the count text
	this.setIncludeLineNumber(true);
	//default value for all indicator
	this.m_encntrdetailsind = 0;
	this.m_finind = 0;
	this.m_reasonforvisitind = 0;
	this.m_healthplanind = 0;
	this.m_diagind = 0;
	//default value for all label
	this.m_finlabel = "";
	this.m_visitprovlabel = "";
	this.m_refprovlabel = "";
	this.m_consultprovlabel = "";
	this.m_admitprovlabel = "";
	this.m_attendprovlabel = "";
	this.m_reldischlabel = "";
	this.m_chieflabel = "";
	this.m_reasonforvisitlabel = "";
	this.m_hplabel = "";
	this.m_diaglabel = "";
	this.m_documentlabel = "";
	//default value for all types
	this.m_qualtype = [];
	this.m_visitprovtype = [];
	this.m_refprovtype = [];
	this.m_consulttype = [];
	this.m_admittype = [];
	this.m_attendtype = [];
	this.m_dischtype = [];
	this.m_diagtype = [];
	this.m_chiefeventset = [];
	this.m_documenteventset = [];
	this.m_bedrockparamArray = [];
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
AmbVisitComponent.prototype = new MPageComponent();
AmbVisitComponent.prototype.constructor = MPageComponent;
/* Supporting functions */
/*
 * @constructor Handles expanding/collapsing subsections in the component
 * @param {string} subsectionid : The subsectionid string contains id of the subsection row being expanded/collapsed.
 */
AmbVisitComponent.prototype.expandCollapseVisitSubSections = function(subsectionid) {
	if ($('#' + subsectionid + '_rows').css('display') === 'block') {
		$('#' + subsectionid + '_rows').css('display', 'none');
		$('#' + subsectionid).attr('title', i18n.SHOW_SECTION);
		$('#' + subsectionid + '_tgl').removeClass().addClass('pwx-vi_sub-sec-hd-tgl-close');
	}
	else {
		$('#' + subsectionid + '_rows').css('display', 'block');
		$('#' + subsectionid).attr('title', i18n.HIDE_SECTION);
		$('#' + subsectionid + '_tgl').removeClass().addClass('pwx-vi_sub-sec-hd-tgl');
	}

};
/*
 * @constructor Handles expanding/collapsing visits in the component
 * @param {string} tbody_class : The tbody_class string contains the id for body element of the visit being expanded/collapsed.
 * @param {string} title_class : The title_class string contains the id for the title link element of the visit being expanded/collapsed.
 * @param {string} tgl_class : The tgl_class string contains the id for the tgl btn element of the visit being expanded/collapsed.
 * @param {string} h3_class : The h3_class string contains the id for the h3 element of the visit being expanded/collapsed.
 * @param {string} scroll_div_id : The scroll_div_id string contains the id for the component content scroll element.
 * */
AmbVisitComponent.prototype.expandCollapseVisitMainSections = function(tbody_class, title_class, tgl_class, h3_class, scroll_div_id) {
	//close any opened besides the one clicked
	var pwx_scroll_div_sub_id = $("#" + scroll_div_id + " .sub-sec-hd");
	if (pwx_scroll_div_sub_id.attr("id") !== h3_class) {
		pwx_scroll_div_sub_id.children("span:first").attr('class', 'pwx-vi_sub-sec-hd-tgl-close');
		pwx_scroll_div_sub_id.parent("a:first").attr('title', i18n.SHOW_SECTION);
		if (pwx_scroll_div_sub_id.closest("dl").attr('class') === 'pwx_vi_top_encounter') {
			pwx_scroll_div_sub_id.closest("dl").removeClass('pwx_vi_enc_head_blue_border');
			pwx_scroll_div_sub_id.closest("dl").addClass('pwx_vi_grey_border_all');
		}
		else {
			pwx_scroll_div_sub_id.closest("dl").removeClass('pwx_vi_enc_head_blue_border');
			pwx_scroll_div_sub_id.closest("dl").addClass('pwx_vi_grey_border_no_top');
		}
		pwx_scroll_div_sub_id.closest("dl").nextAll("div[id$='row']:first").css('display', 'none');
		pwx_scroll_div_sub_id.attr('class', 'pwx_vi_white_sub-sec-hd');
	}
	var element;
	if (document.getElementById && ( element = document.getElementById(tbody_class))) {
		var pwx_title_class = $('#' + title_class).closest("dl");
		if (document.getElementById(tbody_class).style.display === 'block') {
			//close the clicked section
			if (pwx_title_class.attr('class') == 'pwx_vi_top_encounter') {
				pwx_title_class.removeClass('pwx_vi_enc_head_blue_border');
				pwx_title_class.addClass('pwx_vi_grey_border_all');
			}
			else {
				pwx_title_class.removeClass('pwx_vi_enc_head_blue_border');
				pwx_title_class.addClass('pwx_vi_grey_border_no_top');
			}
			document.getElementById(tbody_class).style.display = 'none';
			document.getElementById(title_class).title = i18n.SHOW_SECTION;
			document.getElementById(tgl_class).className = 'pwx-vi_sub-sec-hd-tgl-close';
			document.getElementById(h3_class).className = 'pwx_vi_white_sub-sec-hd';
		}
		else {
			//open the clicked section
			if (pwx_title_class.attr('class') === 'pwx_vi_top_encounter') {
				pwx_title_class.removeClass('pwx_vi_grey_border_all');
				pwx_title_class.addClass('pwx_vi_enc_head_blue_border');
			}
			else {
				pwx_title_class.removeClass('pwx_vi_grey_border_no_top');
				pwx_title_class.addClass('pwx_vi_enc_head_blue_border');
			}
			$('#' + title_class).children("h3:first").attr('class', 'sub-sec-hd');
			document.getElementById(tbody_class).style.display = 'block';
			document.getElementById(title_class).title = i18n.HIDE_SECTION;
			document.getElementById(tgl_class).className = 'pwx-vi_sub-sec-hd-tgl';
		}
	}
};
/*        setter and getter for all bedrock setting */
/*
 * @constructor set encounter details display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setencntrdetailsind = function(value) {
	this.m_encntrdetailsind = (value === true ? 1 : 0);
};
/*
 * @constructor get encounter details display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbVisitComponent.prototype.getencntrdetailsind = function() {
	return this.m_encntrdetailsind;
};
/*
 * @constructor set fin class display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setfinind = function(value) {
	this.m_finind = (value === true ? 1 : 0);
};
/*
 * @constructor get fin class display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbVisitComponent.prototype.getfinind = function() {
	return this.m_finind;
};
/*
 * @constructor set reason for visit display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setreasonforvisitind = function(value) {
	this.m_reasonforvisitind = (value === true ? 1 : 0);
};
/*
 * @constructor get reason for visit display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbVisitComponent.prototype.getreasonforvisitind = function() {
	return this.m_reasonforvisitind;
};
/*
 * @constructor set health plan display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.sethealthplanind = function(value) {
	this.m_healthplanind = (value === true ? 1 : 0);
};
/*
 * @constructor get health plan display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbVisitComponent.prototype.gethealthplanind = function() {
	return this.m_healthplanind;
};
/*
 * @constructor set diagnosis display indicator in the component
 * @param {integer} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setdiagind = function(value) {
	this.m_diagind = (value === true ? 1 : 0);
};
/*
 * @constructor get diagnosis display indicator in the component
 * @return{integer} : bedrock setting value.
 */
AmbVisitComponent.prototype.getdiagind = function() {
	return this.m_diagind;
};
//for label
/*
 * @constructor set fin class label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setfinlabel = function(value) {
	this.m_finlabel = value;
};
/*
 * @constructor get fin class label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getfinlabel = function() {
	return this.m_finlabel;
};
/*
 * @constructor set visit provider label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setvisitprovlabel = function(value) {
	this.m_visitprovlabel = value;
};
/*
 * @constructor get visit provider label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getvisitprovlabel = function() {
	return this.m_visitprovlabel;
};
/*
 * @constructor set referring provider label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setrefprovlabel = function(value) {
	this.m_refprovlabel = value;
};
/*
 * @constructor get referring provider label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getrefprovlabel = function() {
	return this.m_refprovlabel;
};
/*
 * @constructor set consulting provider label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setconsultprovlabel = function(value) {
	this.m_consultprovlabel = value;
};
/*
 * @constructor get consulting provider label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getconsultprovlabel = function() {
	return this.m_consultprovlabel;
};
/*
 * @constructor set admit provider label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setadmitprovlabel = function(value) {
	this.m_admitprovlabel = value;
};
/*
 * @constructor get admit provider label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getadmitprovlabel = function() {
	return this.m_admitprovlabel;
};
/*
 * @constructor set attending provider label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setattendprovlabel = function(value) {
	this.m_attendprovlabel = value;
};
/*
 * @constructor get attending provider label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getattendprovlabel = function() {
	return this.m_attendprovlabel;
};
/*
 * @constructor set discharge provider label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setreldischlabel = function(value) {
	this.m_reldischlabel = value;
};
/*
 * @constructor get discharge provider label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getreldischlabel = function() {
	return this.m_reldischlabel;
};
/*
 * @constructor set chief complain label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setchieflabel = function(value) {
	this.m_chieflabel = value;
};
/*
 * @constructor get chief complain label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getchieflabel = function() {
	return this.m_chieflabel;
};
/*
 * @constructor set reason for visit label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setreasonforvisitlabel = function(value) {
	this.m_reasonforvisitlabel = value;
};
/*
 * @constructor get reason for visit label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getreasonforvisitlabel = function() {
	return this.m_reasonforvisitlabel;
};
/*
 * @constructor set health plan section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.sethplabel = function(value) {
	this.m_hplabel = value;
};
/*
 * @constructor get health plan section label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.gethplabel = function() {
	return this.m_hplabel;
};
/*
 * @constructor set diagnosis section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setdiaglabel = function(value) {
	this.m_diaglabel = value;
};
/*
 * @constructor get diagnosis section label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getdiaglabel = function() {
	return this.m_diaglabel;
};
/*
 * @constructor set document section label in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setdocumentlabel = function(value) {
	this.m_documentlabel = value;
};
/*
 * @constructor get document section label in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getdocumentlabel = function() {
	return this.m_documentlabel;
};
//for all types or event codes
/*
 * @constructor set encounter types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setqualtype = function(value) {
	this.m_qualtype = value;
};
/*
 * @constructor get encounter types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getqualtype = function() {
	return this.m_qualtype;
};
/*
 * @constructor set visit provider types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setvisitprovtype = function(value) {
	this.m_visitprovtype = value;
};
/*
 * @constructor get visit provider types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getvisitprovtype = function() {
	return this.m_visitprovtype;
};
/*
 * @constructor set referring provider types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setrefprovtype = function(value) {
	this.m_refprovtype = value;
};
/*
 * @constructor get referring provider types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getrefprovtype = function() {
	return this.m_refprovtype;
};
/*
 * @constructor set consulting provider types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setconsulttype = function(value) {
	this.m_consulttype = value;
};
/*
 * @constructor get consulting provider types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getconsulttype = function() {
	return this.m_consulttype;
};
/*
 * @constructor set admit provider types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setadmittype = function(value) {
	this.m_admittype = value;
};
/*
 * @constructor get admit provider types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getadmittype = function() {
	return this.m_admittype;
};
/*
 * @constructor set attending provider types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setattendtype = function(value) {
	this.m_attendtype = value;
};
/*
 * @constructor get attending provider types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getattendtype = function() {
	return this.m_attendtype;
};
/*
 * @constructor set discharge provider types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setdischtype = function(value) {
	this.m_dischtype = value;
};
/*
 * @constructor get discharge provider types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getdischtype = function() {
	return this.m_dischtype;
};
/*
 * @constructor set diagnosis types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setdiagtype = function(value) {
	this.m_diagtype = value;
};
/*
 * @constructor get diagnosis types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getdiagtype = function() {
	return this.m_diagtype;
};
/*
 * @constructor set chief complaint types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setchiefeventset = function(value) {
	this.m_chiefeventset = value;
};
/*
 * @constructor get chief complaint types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getchiefeventset = function() {
	return this.m_chiefeventset;
};
/*
 * @constructor set document event types filter in the component
 * @param {string} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setdocumenteventset = function(value) {
	this.m_documenteventset = value;
};
/*
 * @constructor get document event types filter in the component
 * @return{string} : bedrock setting value.
 */
AmbVisitComponent.prototype.getdocumenteventset = function() {
	return this.m_documenteventset;
};
/*
 * @constructor set bedrock parameter array for component
 * @param {Array} value : The value contains what value should be set with.
 */
AmbVisitComponent.prototype.setbedrockparamArray = function(value) {
	this.m_bedrockparamArray = value;
};
/*
 * @constructor get bedrock parameter array for component
 * @return{Array} : bedrock setting value.
 */
AmbVisitComponent.prototype.getbedrockparamArray = function() {
	return this.m_bedrockparamArray;
};
// pull out the bedrock setting
/*
 * @constructor get bedrock settings and map to our variables in component
 */
AmbVisitComponent.prototype.loadFilterMappings = function() {
	//Add the filter mapping object for the Catalog Type Codes
	MPageComponent.prototype.loadFilterMappings.call(this);
	/* get all display indicator*/
	this.addFilterMappingObject("ENCNTRS_DETAILS_DISP", {
		setFunction : this.setencntrdetailsind,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_FIN_CLASS_DISP", {
		setFunction : this.setfinind,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_HEALTH_PLANS_DISP", {
		setFunction : this.sethealthplanind,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_RFV_DISP", {
		setFunction : this.setreasonforvisitind,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_DIAG_DISP", {
		setFunction : this.setdiagind,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	/* get all label */
	this.addFilterMappingObject("ENCNTRS_FIN_CLASS_LABEL", {
		setFunction : this.setfinlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_VISITPROV_LABEL", {
		setFunction : this.setvisitprovlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_REF_PROV_LABEL", {
		setFunction : this.setrefprovlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_CONSULT_LABEL", {
		setFunction : this.setconsultprovlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_ADMIT_LABEL", {
		setFunction : this.setadmitprovlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_ATTEND_LABEL", {
		setFunction : this.setattendprovlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_DISCH_LABEL", {
		setFunction : this.setreldischlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_CHIEF_COMP_LABEL", {
		setFunction : this.setchieflabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_RFV_DISP_LABEL", {
		setFunction : this.setreasonforvisitlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_HEALTH_PLANS_LABEL", {
		setFunction : this.sethplabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_DIAG_DISP_LABEL", {
		setFunction : this.setdiaglabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("ENCNTRS_DOCUMENTS_LABEL", {
		setFunction : this.setdocumentlabel,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	/* get type setting */
	this.addFilterMappingObject("ENCNTRS_QUAL_TYPES", {
		setFunction : this.setqualtype,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_VISITPROV_TYPE", {
		setFunction : this.setvisitprovtype,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_REF_PROV_TYPE", {
		setFunction : this.setrefprovtype,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_CONSULT_TYPE", {
		setFunction : this.setconsulttype,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_ADMIT_TYPE", {
		setFunction : this.setadmittype,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_ATTEND_TYPE", {
		setFunction : this.setattendtype,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("ENCNTRS_DIAG_TYPES", {
		setFunction : this.setdiagtype,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("ENCNTRS_RELTN_DISCH_TYPE", {
		setFunction : this.setdischtype,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("ENCNTRS_CHIEF_COMP_CE", {
		setFunction : this.setchiefeventset,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("ENCNTRS_DOCUMENTS_CE", {
		setFunction : this.setdocumenteventset,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
};
/*
 * @constructor retrive component data from ccl
 */
AmbVisitComponent.prototype.retrieveComponentData = function() {
	var criterion = null;
	var request = null;
	var self = this;
	var sendAr = null;
	var paramArray1 = null;
	var paramArray2 = null;
	criterion = this.getCriterion();
	var prsnlInfo=criterion.getPersonnelInfo();
    var encntrs=prsnlInfo.getViewableEncounters();
    var encntrVal=(encntrs)?"value("+encntrs+")":"0.0";
    var encntrValScope=(this.getScope()==2)?"value("+criterion.encntr_id+".0 )":encntrVal;	
	paramArray1 = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0",criterion.encntr_id + ".0", criterion.position_cd + ".0", 0];
	paramArray2 = [this.getencntrdetailsind(), MP_Util.CreateParamArray(this.getchiefeventset(), 1), MP_Util.CreateParamArray(this.getdiagtype(), 1), MP_Util.CreateParamArray(this.getdocumenteventset(), 1), MP_Util.CreateParamArray(this.getqualtype(), 1), MP_Util.CreateParamArray(this.getadmittype(), 1), MP_Util.CreateParamArray(this.getattendtype(), 1), MP_Util.CreateParamArray(this.getconsulttype(), 1), MP_Util.CreateParamArray(this.getdischtype(), 1), MP_Util.CreateParamArray(this.getrefprovtype(), 1), MP_Util.CreateParamArray(this.getvisitprovtype(), 1), this.gethealthplanind(), "^" + this.getvisitprovlabel() + "^", "^" + this.getrefprovlabel() + "^", "^" + this.getconsultprovlabel() + "^", "^" + this.getadmitprovlabel() + "^", "^" + this.getattendprovlabel() + "^", "^" + this.getreldischlabel() + "^",encntrValScope];
	this.setbedrockparamArray(paramArray2);
	sendAr = paramArray1.concat(paramArray2);
	MP_Core.XMLCclRequestWrapper(this, "AMB_MP_ENCOUNTER_COMP", sendAr, true);
};
/*
 * @constructor render content for component
 */
AmbVisitComponent.prototype.renderComponent = function(reply) {
	var thiz = this;
	var numberResults = 0;
	var results = null;
	this.avI18nObj = i18n.discernabu.visit_o1;
	var criterion = this.getCriterion();
	//Store result information
	numberResults = reply.E_LIST.length;
	var visitcompId = this.getComponentId();
	var visitcompContentElemID = 'amb_vi_enc_scroll_div' + visitcompId;
	$("#" + visitcompContentElemID).off();
	var mainvisitHvrArray = [];
	var diagnosisHvrArray = [];
	var documentsHvrArray = [];
	var healthHvrArray = [];
	var pwx_encounter_id_row = "0";
	var pwx_encounter_index_row = "0";
	var pwxencmainobject = reply;
	var pwxdata = {};
	var pid = criterion.person_id;
	var eid = criterion.encntr_id;
	var uid = criterion.provider_id;
	var posid = criterion.position_cd;
	var encdetaildefaultind = 0;
	//set the title
	var selectedUTCDate = new Date();
	if (reply.E_LIST[0].REG_DATE !== '--') {
		selectedUTCDate.setISO8601(reply.E_LIST[0].REG_DATE);
		var selectedDate = selectedUTCDate.format("shortDate2");
	}
	else {
		var selectedDate = "--";
	}
	
	var pwx_prog_sub_title = '&nbsp;'+ this.avI18nObj.VIS +'  ' + selectedDate;
	var encHTML = [];
	var encdetailinfo = [];
	encHTML.push('<div class="pwx_vi_div_scroll " id="' + visitcompContentElemID + '">');
	//iterate through our encounter list and build the header row display and hover
	for (var cc = 0; cc < numberResults; cc++) {
		//create hover
		var pwx_enc_regi_date_time_HTML = "";
		var encUTCDate = new Date();
		if (reply.E_LIST[cc].REG_DATE !== '--') {
			encUTCDate.setISO8601(reply.E_LIST[cc].REG_DATE);
			var visitUTCdate = encUTCDate.format("shortDate2");
			var visitUTCtime = encUTCDate.format("shortTime");
		}
		else {
			var visitUTCdate = "--";
		}
		var dischUTCDate = new Date();
		if (reply.E_LIST[cc].DISCH_DATE !== '--') {
			dischUTCDate.setISO8601(reply.E_LIST[cc].DISCH_DATE);
			var discUTCdate = dischUTCDate.format("shortDate2");
		}
		else {
			var discUTCdate = "--";
		}
		var myHvr = [];
		var row_cnt = 4;
		myHvr.length = row_cnt;
		myHvr[0] = ["", ""];
		myHvr[0][0] = '' + this.avI18nObj.REGDATE + ':';
		myHvr[0][1] = visitUTCdate;
		myHvr[1] = ["", ""];
		myHvr[1][0] = '' + this.avI18nObj.DISDATE + ':';
		myHvr[1][1] = discUTCdate;
		myHvr[2] = ["", ""];
		myHvr[2][0] = '' + this.avI18nObj.LOC + ':';
		myHvr[2][1] = reply.E_LIST[cc].LOCATION;
		myHvr[3] = ["", ""];
		myHvr[3][0] = '' + this.avI18nObj.ORG + ':';
		myHvr[3][1] = reply.E_LIST[cc].ORG_NAME;
		//check to see if encounter details are displayed if so add to hover
		if (thiz.getencntrdetailsind() === 1) {
			row_cnt = row_cnt + 1;
			myHvr.length = row_cnt;
			myHvr[row_cnt - 1] = ["", ""];
			myHvr[row_cnt - 1][0] = '' + this.avI18nObj.ENCTYPE + ':';
			myHvr[row_cnt - 1][1] = reply.E_LIST[cc].TYPE;
			row_cnt = row_cnt + 1;
			myHvr.length = row_cnt;
			myHvr[row_cnt - 1] = ["", ""];
			myHvr[row_cnt - 1][0] = '' + this.avI18nObj.MEDSER + ':';
			myHvr[row_cnt - 1][1] = reply.E_LIST[cc].MED_SERVICE;
		}
		mainvisitHvrArray.push(myHvr);
		//store in array and used in other renderEncounterDetails function
		encdetailinfo[cc] = [];
		encdetailinfo[cc].length = 5;
		encdetailinfo[cc][0] = reply.E_LIST[cc].FIN_CLASS;
		encdetailinfo[cc][1] = reply.E_LIST[cc].REASON_FOR;
		encdetailinfo[cc][2] = reply.E_LIST[cc].ORDER_CNT;
		encdetailinfo[cc][3] = reply.E_LIST[cc].CHARGE_CNT;
		encdetailinfo[cc][4] = reply.E_LIST[cc].RX_CNT;
		var encntr_title_id = '' + visitcompId + '_vi_' + cc + '_title';
		var encntr_row_id = '' + visitcompId + '_vi_' + cc + '_row';
		var encntr_tgl_id = '' + visitcompId + '_vi_' + cc + '_tgl';
		var encntr_h3_id = '' + visitcompId + '_vi_' + cc + '_h3';

		if (reply.E_LIST[cc].REG_DATE !== "--") {
			pwx_enc_regi_date_time_HTML += '<span class="pwx_vi_header_black">' + visitUTCdate + '&nbsp;<span class="disabled" style="font-size:10px;">' + visitUTCtime + '</span>&nbsp;&nbsp;&nbsp;' + reply.E_LIST[cc].LOCATION + '</span>';
		}
		else {
			pwx_enc_regi_date_time_HTML += '<span class="pwx_vi_header_black" style="font-size:12px;">'+ this.avI18nObj.VIS +': </span><span class="pwx_vi_header_black" style="font-size:10px;">' + visitUTCdate + '</span><span class="pwx_vi_header_black">&nbsp;&nbsp;&nbsp;' + reply.E_LIST[cc].LOCATION + '</span>';
		}
		//If its the first record which is the selected encounter display the full details otherwise just build the head row
		if (cc === 0) {
			encHTML.push('<dl id="visit_row_' + cc + '_'+ visitcompId +'" class="visit_class_' + cc + ' visit-click-detail pwx_vi_pwxnopad_enc-info pwx_vi_top_encounter pwx_vi_enc_head_blue_border visit-info"><dt class="pwx_vi_single_sub_sec_white_dt"><a id="' + encntr_title_id + '" class="pwx_vi_sub_sub_sec_link pwx_vi_main_sec_class" title="' + i18n.HIDE_SECTION + '">', '<h3 class="sub-sec-hd" id="' + encntr_h3_id + '"><span id="' + encntr_tgl_id + '" class="pwx-vi_sub-sec-hd-tgl">-</span> ' + pwx_enc_regi_date_time_HTML + '</h3></a></dt><span class="pwx-enc-index' + cc + '" style="display:none">' + cc + '</span><span class="pwx-enc-id' + cc + '" style="display:none">' + reply.E_LIST[cc].ENCNTR_ID + '</span></dl>');
			encHTML.push('<div id="' + encntr_row_id + '" class="pwx_vi_enc_detail_div_'+visitcompId+'_'+cc+' pwx_vi_enc_div_blue_border"style="display:block">');
			renderEncounterDetails(0, pwxencmainobject, encdetaildefaultind, eid);
			encHTML.push('</div>');

		}
		else {
			encHTML.push('<dl id="visit_row_' + cc + '_'+ visitcompId +'" class="visit_class_' + cc + ' visit-click-detail pwx_vi_pwxnopad_enc-info pwx_vi_grey_border_no_top visit-info"><dt class="pwx_vi_single_sub_sec_white_dt"><a id="' + encntr_title_id + '" class="pwx_vi_sub_sub_sec_link pwx_vi_main_sec_class" title="' + i18n.SHOW_SECTION + '">', '<h3 class="pwx_vi_white_sub-sec-hd" id="' + encntr_h3_id + '"><span id="' + encntr_tgl_id + '" class="pwx-vi_sub-sec-hd-tgl-close">-</span>' + pwx_enc_regi_date_time_HTML + '</h3></a></dt><span class="pwx-enc-index' + cc + '" style="display:none">' + cc + '</span><span class="pwx-enc-id' + cc + '" style="display:none">' + reply.E_LIST[cc].ENCNTR_ID + '</span></dl>');
			encHTML.push('<div id="' + encntr_row_id + '" class="pwx_vi_enc_detail_div_'+visitcompId+'_'+cc+' pwx_vi_enc_div_blue_border" style="display:none"></div>');
		}
	}

	this.finalizeComponent(encHTML.join(""), MP_Util.CreateTitleText(this, numberResults, pwx_prog_sub_title));

	//Main scroll area
	var containerScrollDiv = document.getElementById(visitcompContentElemID);
	var maxResults = this.getScrollNumber();
	MP_Util.Doc.InitSectionScrolling(containerScrollDiv, maxResults, "1.6");
	/*
	 * @constructor builds the display for all encounter details
	 * @param {integer} pwx_encounter_index_row : The json index for encounter.
	 * @param {object} pwxdata : Data object for encounter being expanded
	 * @param {integer} encdetaildefaultind : Indicator if visit is default expanded
	 * @param {string} pwx_encounter_id_row : element index for row being expanded
	 * */

	function renderEncounterDetails(pwx_encounter_index_row, pwxdata, encdetaildefaultind, pwx_encounter_id_row) {
		var encdetailHTML = [];
		diagnosisHvrArray = [];
		documentsHvrArray = [];
		healthHvrArray = [];
		var cc = 0;
		var encntr_title_id = '' + visitcompId + '' + pwx_encounter_index_row + '_title';
		var encntr_row_id = '' + visitcompId + '' + pwx_encounter_index_row + '_row';
		var encntr_tgl_id = '' + visitcompId + '' + pwx_encounter_index_row + '_tgl';
		//display link which is responsible for changing chart views skip to display first time else display on all encouter
		if (eid > 0 && eid !== pwx_encounter_id_row) {
			encdetailHTML.push('<dl class="pwx_vi_grey_dash_border_bottom-info"><a class="pwx_vi_blue_link" title="' + thiz.avI18nObj.OPENVI + '"', 'href="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + pid + ' /ENCNTRID=' + pwx_encounter_id_row + ' \')">',thiz.avI18nObj.OPENVI,'</a></dl>');
		}
		//display fin
		encdetailHTML.push('<dl class="pwx_vi_grey_border-info"><dt class="pwx_vi_2_col_enc_lbl">' + thiz.avI18nObj.FIN + ':</dt><dt class="pwx_vi_2_col_enc_value">' + pwxdata.FIN + '</dt></dl>');
		//display details
		if (thiz.getencntrdetailsind() === 1) {
			encdetailHTML.push('<dl class="pwx_vi_grey_border-info"><dt class="pwx_vi_2_col_enc_lbl">' + thiz.avI18nObj.LOC + ':</dt><dt class="pwx_vi_2_col_enc_value">' + mainvisitHvrArray[pwx_encounter_index_row][2][1] + '</dt></dl>');
			encdetailHTML.push('<dl class="pwx_vi_grey_border-info"><dt class="pwx_vi_2_col_enc_lbl">' + thiz.avI18nObj.ORG + ':</dt><dt class="pwx_vi_2_col_enc_value">' + mainvisitHvrArray[pwx_encounter_index_row][3][1] + '</dt></dl>');
			encdetailHTML.push('<dl class="pwx_vi_grey_border-info"><dt class="pwx_vi_2_col_enc_lbl">' + thiz.avI18nObj.ENCTYPE + ':</dt><dt class="pwx_vi_2_col_enc_value">' + mainvisitHvrArray[pwx_encounter_index_row][4][1] + '</dt></dl>');
			encdetailHTML.push('<dl class="pwx_vi_grey_border-info"><dt class="pwx_vi_2_col_enc_lbl">' + thiz.avI18nObj.MEDSER + ':</dt><dt class="pwx_vi_2_col_enc_value">' + mainvisitHvrArray[pwx_encounter_index_row][5][1] + '</dt></dl>');
		}
		//display financial class
		if (thiz.getfinind() === 1) {
			encdetailHTML.push('<dl class="pwx_vi_grey_border-info"><dt class="pwx_vi_2_col_enc_lbl">' + thiz.getfinlabel() + ':</dt><dt class="pwx_vi_2_col_enc_value">' + encdetailinfo[pwx_encounter_index_row][0] + '</dt></dl>');
		}
		//display relationships
		if (pwxdata.RELTNS.length > 0) {
			for (var i = 0; i < pwxdata.RELTNS.length; i++) {
				encdetailHTML.push('<dl class="pwx_vi_grey_border-info"><dt class="pwx_vi_2_col_enc_lbl">' + pwxdata.RELTNS[i].LABEL + ':</dt><dt class="pwx_vi_2_col_enc_value">' + pwxdata.RELTNS[i].TEXT + '</dt></dl>');
			}
		}
		//display the chief complaint
		if (pwxdata.CHIEF_COMP_DISP === 1) {
			if (pwxdata.CHIEF_COMP.length > 0) {
				var amb_chief_length = pwxdata.CHIEF_COMP.length;
				encdetailHTML.push('<dl class="pwx_vi_grey_border-info"><dt class="pwx_vi_2_col_enc_lbl">' + thiz.getchieflabel() + ':</dt><dt class="pwx_vi_2_col_enc_value">');
				for (var i = 0; i < amb_chief_length; i++) {
					if (pwxdata.CHIEF_COMP[i].ID === 0) {
						encdetailHTML.push(pwxdata.CHIEF_COMP[i].TEXT);
					}
					else {
						encdetailHTML.push('<a id="', pwxdata.CHIEF_COMP[i].ID, '_'+ visitcompId +'" class="pwx_vi_result_link visit_cheif_view_link"  title="' + thiz.avI18nObj.VIEWRES + '" >', pwxdata.CHIEF_COMP[i].TEXT + '</a>');
					}
					if ((i + 1) !== pwxdata.CHIEF_COMP.length) {
						encdetailHTML.push('<span class="disabled"> | </span>');
					}
				}
				encdetailHTML.push('</dt></dl>');
			}
			else {
				encdetailHTML.push('<dl class="pwx_vi_grey_border-info"><dt class="pwx_vi_2_col_enc_lbl">' + thiz.getchieflabel() + ':</dt><dt class="pwx_vi_2_col_enc_value">--</dt></dl>');
			}
		}
		//display financial class
		if (thiz.getreasonforvisitind() === 1) {
			encdetailHTML.push('<dl class="pwx_vi_grey_border-info"><dt class="pwx_vi_2_col_enc_lbl">' + thiz.getreasonforvisitlabel() + ':</dt><dt class="pwx_vi_2_col_enc_value">' + encdetailinfo[pwx_encounter_index_row][1] + '</dt></dl>');
		}
		//display diagnosis
		if (pwxdata.ENC_DIAG_DISP === 1) {
			var myHvr = [];
			myHvr.length = 1;
			myHvr[0] = ["", ""];
			encdetailHTML.push('<dl class="pwx_vi_grey_border-info"><dt class="pwx_vi_2_col_enc_lbl">' + thiz.getdiaglabel() + ' (' + pwxdata.DIAG.length + '):</dt><dt id="diagnosis_row_' + cc + '_'+ visitcompId +'" class="pwx_vi_2_col_enc_value pwx_vi_small_text visit-info">');
			if (pwxdata.DIAG.length > 0) {
				myHvr[0][0] = thiz.getdiaglabel() + ' (' + pwxdata.DIAG.length + '):';
				myHvr[0][1] = '';
				myHvr.length = 2;
				myHvr[1] = ["", ""];
				myHvr[1][0] = '';
				myHvr[1][1] = '<span class="pwx_vi_normal_line_height pwx_vi_small_text">';
				//hover displays all diagnosis
				for (var i = 0; i < pwxdata.DIAG.length; i++) {
					if (pwxdata.DIAG[i].CODE !== '') {
						myHvr[1][1] += pwxdata.DIAG[i].TEXT + '<span class="disabled"> (' + pwxdata.DIAG[i].CODE + ')</span><br />';
					}
					else {
						myHvr[1][1] += pwxdata.DIAG[i].TEXT + '<br />';
					}
				}
				myHvr[1][1] += '<br /></span>';
				var diag_limit = 5;
				//limit up front display to 5 diagnosis and add "..." indicator for more.
				if (pwxdata.DIAG.length < 5) {
					diag_limit = pwxdata.DIAG.length;
				}
				for (var i = 0; i < diag_limit; i++) {
					if (pwxdata.DIAG[i].CODE !== '') {
						encdetailHTML.push(pwxdata.DIAG[i].TEXT + '<span class="disabled"> (' + pwxdata.DIAG[i].CODE + ')</span><br />');
					}
					else {
						encdetailHTML.push(pwxdata.DIAG[i].TEXT + '<br />');
					}
				}
				if (pwxdata.DIAG.length > 5) {
					encdetailHTML.push('<span class="disabled pwx_vi_small_text">' + thiz.avI18nObj.MORE + '...</span>');
				}
			}
			else {
				myHvr[0][0] = thiz.getdiaglabel() + ':';
				myHvr[0][1] = '' + thiz.avI18nObj.NOVIDIAG + '';
				encdetailHTML.push('--');
			}
			diagnosisHvrArray.push(myHvr);
			encdetailHTML.push('</dt></dl>');
		}
		//display documents
		if (pwxdata.DOCUMENTS_DISP === 1) {
			var doc_title_id = '' + visitcompId + '_doc' + pwx_encounter_index_row + '_title';
			var doc_row_id = '' + visitcompId + '_doc' + pwx_encounter_index_row + '_title_rows';
			var doc_tgl_id = '' + visitcompId + '_doc' + pwx_encounter_index_row + '_title_tgl';
			encdetailHTML.push('<dl class="pwx_vi_pwxnopad-info pwx_vi_doc_class"><dt class="pwx_vi_single_sub_sub_sec_dt"><a id="' + doc_title_id + '" class="pwx_vi_sub_sec_link visit_sub_section_class" title="' + i18n.HIDE_SECTION + '">', '<span id="' + doc_tgl_id + '" class="pwx-vi_sub-sec-hd-tgl-close">-</span><h3 class="pwx_vi_sub_sub-sec-hd"><span class="pwx-vi-bgc">', '<span class="disabled">' + thiz.getdocumentlabel() + ' (' + pwxdata.DOCS.length, ')&nbsp;</span></h3></span></a></dt></dl>', '<div id="' + doc_row_id + '" style="display:none">');
			if (pwxdata.DOCS.length > 0) {
				var documenthvrindex = 0;
				var amb_doc_length = pwxdata.DOCS.length;
				//iterate and display document rows
				for (var i = 0; i < amb_doc_length; i++) {
					var documentdateUTC = new Date();
					var myHvr = [];
					if (pwxdata.DOCS[i].DATE !== '--') {
						documentdateUTC.setISO8601(pwxdata.DOCS[i].DATE);
						var docUTC = documentdateUTC.format("shortDate2");
					}
					else {
						var docUTC = "--";
					}
					var documentupdateUTC = new Date();
					if (pwxdata.DOCS[i].UPDT_DT !== '--') {
						documentupdateUTC.setISO8601(pwxdata.DOCS[i].UPDT_DT);
						var docupdateUTC = documentupdateUTC.format("shortDate2");
					}
					else {
						var docupdateUTC = "--";
					}
					//build document hover					
					myHvr.length = 6;
					myHvr[0] = ["", ""];
					myHvr[0][0] = '' + thiz.avI18nObj.TYP + ':';
					myHvr[0][1] = pwxdata.DOCS[i].TYPE;
					myHvr[1] = ["", ""];
					myHvr[1][0] = '' + thiz.avI18nObj.SUB + ':';
					myHvr[1][1] = pwxdata.DOCS[i].SUBJECT;
					myHvr[2] = ["", ""];
					myHvr[2][0] = '' + thiz.avI18nObj.AUH + ':';
					myHvr[2][1] = pwxdata.DOCS[i].AUTHOR;
					myHvr[3] = ["", ""];
					myHvr[3][0] = '' + thiz.avI18nObj.STAT + ':';
					myHvr[3][1] = pwxdata.DOCS[i].STATUS;
					myHvr[4] = ["", ""];
					myHvr[4][0] = '' + thiz.avI18nObj.CREDATE + ':';
					myHvr[4][1] = docUTC;
					myHvr[5] = ["", ""];
					myHvr[5][0] = '' + thiz.avI18nObj.UPDATE + ':';
					myHvr[5][1] = docupdateUTC;
					documentsHvrArray.push(myHvr);
					encdetailHTML.push('<dl id="documents_row_' + documenthvrindex + '_'+ visitcompId +'" class="pwx_vi_grey_border-info pwx_vi_small_text visit-info"><dt class="pwx_vi_2_col_enc_doc_text">', '<a id="', pwxdata.DOCS[i].EVENT_ID, '"  class="pwx_vi_result_link visit_doc_view_link"  title="' + thiz.avI18nObj.VIWDOC + '" >');
					if (pwxdata.DOCS[i].SUBJECT === "--") {
						encdetailHTML.push(pwxdata.DOCS[i].TYPE);
					}
					else {
						encdetailHTML.push(pwxdata.DOCS[i].SUBJECT);
					}
					encdetailHTML.push('</a></dt><dt class="pwx_vi_2_col_enc_doc_date disabled"> ' + docUTC + '</dt></dl>');
					documenthvrindex = documenthvrindex + 1;
				}
			}
			else {
				encdetailHTML.push('<dl class="pwx_vi_grey_border-info pwx_vi_small_text"><dt class="pwx_vi_sub_sub_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
			}
			//end the doc div
			encdetailHTML.push('</div>');
		}
		//display All active Health plans
		if (pwxdata.HEALTHPLAN_DISP === 1) {
			var healthplan_title_id = '' + visitcompId + '_hp' + pwx_encounter_index_row + '_title';
			var healthplan_row_id = '' + visitcompId + '_hp' + pwx_encounter_index_row + '_title_rows';
			var healthplan_tgl_id = '' + visitcompId + '_hp' + pwx_encounter_index_row + '_title_tgl';
			encdetailHTML.push('<dl class="pwx_vi_pwxnopad-info pwx_vi_doc_class"><dt class="pwx_vi_single_sub_sub_sec_dt"><a id="' + healthplan_title_id + '" class="pwx_vi_sub_sec_link visit_sub_section_class" title="' + i18n.HIDE_SECTION + '">', '<span id="' + healthplan_tgl_id + '" class="pwx-vi_sub-sec-hd-tgl-close">-</span><h3 class="pwx_vi_sub_sub-sec-hd"><span class="pwx-vi-bgc">', '<span class="disabled">' + thiz.gethplabel() + ' (' + pwxdata.HP_LIST.length, ')&nbsp;</span></h3></span></a></dt></dl>', '<div id="' + healthplan_row_id + '" style="display:none">');
			if (pwxdata.HP_LIST.length > 0) {
				var healthplanindex = 0;
				var amb_hp_length = pwxdata.HP_LIST.length;
				//iterate and display health plan rows
				for (var i = 0; i < amb_hp_length; i++) {
					myHvr = [];
					myHvr.length = 6;
					myHvr[0] = ["", ""];
					myHvr[0][0] = '' + thiz.avI18nObj.HEAPLAN + ':';
					myHvr[0][1] = pwxdata.HP_LIST[i].NAME;
					myHvr[1] = ["", ""];
					myHvr[1][0] = '' + thiz.avI18nObj.MEM + '#:';
					myHvr[1][1] = pwxdata.HP_LIST[i].MEMBER_NUM;
					myHvr[2] = ["", ""];
					myHvr[2][0] = '' + thiz.avI18nObj.GRP + '#:';
					myHvr[2][1] = pwxdata.HP_LIST[i].GROUP_NUM;
					myHvr[3] = ["", ""];
					myHvr[3][0] = '' + thiz.avI18nObj.POL + '#:';
					myHvr[3][1] = pwxdata.HP_LIST[i].POLICY_NUM;
					myHvr[4] = ["", ""];
					myHvr[4][0] = '' + thiz.avI18nObj.TYP + ':';
					myHvr[4][1] = pwxdata.HP_LIST[i].TYPE;
					myHvr[5] = ["", ""];
					myHvr[5][0] = '' + thiz.avI18nObj.FINCLASS + ':';
					myHvr[5][1] = pwxdata.HP_LIST[i].FIN_CLASS;
					healthHvrArray.push(myHvr);
					encdetailHTML.push('<dl id="healthplan_row_' + healthplanindex + '_'+ visitcompId +'" class="pwx_vi_grey_border-nowordwrap_info pwx_vi_small_text visit-info"><dt class="pwx_vi_2_col_enc_healthplan_name">');
					encdetailHTML.push(pwxdata.HP_LIST[i].NAME);
					encdetailHTML.push('</dt><dt class="pwx_vi_2_col_enc_healthplan_fclass disabled"> ' + pwxdata.HP_LIST[i].FIN_CLASS + '</dt></dl>');
					healthplanindex = healthplanindex + 1;
				}
			}
			else {
				encdetailHTML.push('<dl class="pwx_vi_grey_border-info pwx_vi_small_text"><dt class="pwx_vi_sub_sub_single_dt_wpad"><span class="res-none">' + i18n.NO_RESULTS_FOUND + '</span></dt></dl>');
			}
			//end the healthplan div
			encdetailHTML.push('</div>');
		}
		//end the encounter div
		//if this is the default encounter add html to array otherwise replace in html.
		if (encdetaildefaultind === 1) {
			$(".pwx_vi_enc_detail_div_"+visitcompId+'_'+pwx_encounter_index_row).html(encdetailHTML.join(""));
		}
		else {
			encHTML.push(encdetailHTML.join(""));
		}
	}

	var visitcompContentElem = $("#" + visitcompContentElemID);
	//set the visit collapse events
	visitcompContentElem.off("click", "a.pwx_vi_main_sec_class");
	visitcompContentElem.on("click", "a.pwx_vi_main_sec_class", function(event) {
		var encntr_title_fn_id = $(this).attr('id');
		var enctr_array = encntr_title_fn_id.split("_");
		var enctr_join_array = enctr_array[0] + "_" + enctr_array[1] + "_" + enctr_array[2];
		var encntr_fn_row_id = '' + enctr_join_array + '_row';
		var encntr_fn_tgl_id = '' + enctr_join_array + '_tgl';
		var encntr_fn_h3_id = '' + enctr_join_array + '_h3';
		thiz.expandCollapseVisitMainSections(encntr_fn_row_id, encntr_title_fn_id, encntr_fn_tgl_id, encntr_fn_h3_id, visitcompContentElemID);
	});
	visitcompContentElem.off("click", "a.visit_sub_section_class");
	visitcompContentElem.on("click", "a.visit_sub_section_class", function(event) {
		thiz.expandCollapseVisitSubSections($(this).attr('id'));
	});
	//set document viewer events
	visitcompContentElem.off('click', '.visit_doc_view_link');
	visitcompContentElem.on('click', '.visit_doc_view_link', function() {
		var docid = $(this).attr('id');
		var pwxPVViewerMPage = window.external.DiscernObjectFactory('PVVIEWERMPAGE');
		pwxPVViewerMPage.CreateDocViewer(criterion.person_id);
		pwxPVViewerMPage.AppendDocEvent(docid);
		pwxPVViewerMPage.LaunchDocViewer();
	});
	//set chief compliant result viewer events
	visitcompContentElem.off('click', '.visit_cheif_view_link');
	visitcompContentElem.on('click', '.visit_cheif_view_link', function() {
		var resulteventid = $(this).attr('id').split("_");;
		var pwxPVViewerMPage = window.external.DiscernObjectFactory('PVVIEWERMPAGE');
		pwxPVViewerMPage.CreateEventViewer(criterion.person_id);
		pwxPVViewerMPage.AppendEvent(resulteventid[0]);
		pwxPVViewerMPage.LaunchEventViewer();
	});
	//create the result viewer launch function
	function ambvisitresultsview(persId, eventId) {
		var pwxPVViewerMPage = window.external.DiscernObjectFactory('PVVIEWERMPAGE');
		pwxPVViewerMPage.CreateEventViewer(persId);
		pwxPVViewerMPage.AppendEvent(eventId);
		pwxPVViewerMPage.LaunchEventViewer();
	}

	//create the doc viewer launch function
	function ambvisitdocumentview(persId, eventId) {
		var pwxPVViewerMPage = window.external.DiscernObjectFactory('PVVIEWERMPAGE');
		pwxPVViewerMPage.CreateDocViewer(persId);
		pwxPVViewerMPage.AppendDocEvent(eventId);
		pwxPVViewerMPage.LaunchDocViewer();
	}
	
	visitcompContentElem.off('click', '.visit-click-detail');
	visitcompContentElem.on('click', '.visit-click-detail', function(event) {
		var jsonId = $(this).attr("id").split("_");
		var $visitdetailContentElem = $(".pwx_vi_enc_detail_div_"+visitcompId+'_'+jsonId[2]);
		$visitdetailContentElem.html('<div class="pwx_loading_div" id="pwx_vi-loading_text">' + thiz.avI18nObj.LOAD + '...</div>');
		pwx_encounter_id_row = $('.pwx-enc-id' + jsonId[2]).html();
		pwx_encounter_index_row = $('.pwx-enc-index' + jsonId[2]).html();
		if (pwx_encounter_index_row !== 0) {
			$(".visit_class_0").attr("style", "border-top:1px solid #EDEDED");
		}
		else {
			$(".visit_class_0").removeAttr("style", "border-top:1px solid #EDEDED");
		}
		var DefaultParampass = [];
		var BedrockParampass = [];
		var sendAr = null;
		var request = null;
		DefaultParampass = ["^MINE^", pid + ".0", uid + ".0", pwx_encounter_id_row + ".0", posid + ".0", 1];
		BedrockParampass = thiz.getbedrockparamArray();
		sendAr = DefaultParampass.concat(BedrockParampass);
		request = new MP_Core.ScriptRequest(thiz, thiz.getComponentLoadTimerName());
		request.setProgramName("AMB_MP_ENCOUNTER_COMP");
		request.setParameters(sendAr);
		request.setAsync(true);
		MP_Core.XMLCCLRequestCallBack(thiz, request, function(reply) {
			var pwxdata = reply.getResponse();
			encdetaildefaultind = 1;
			renderEncounterDetails(pwx_encounter_index_row, pwxdata, encdetaildefaultind, pwx_encounter_id_row);
		});
	});
	//hovers and check scrolling activate hovers
	var elementMap = {};
	//remove event if there is any
	visitcompContentElem.off("mouseenter", ".visit-info");
	visitcompContentElem.off("mouseleave", ".visit-info");
	// attach hover events
	visitcompContentElem.on("mouseenter", ".visit-info", function(event) {
		var anchor = this;
		$(this).css("background-color", "#FFFCE0");
		var anchorId = $(this).attr("id");
		//If there is a hover class specified, add it to the element
		if (!elementMap[anchorId]) {
			elementMap[anchorId] = {};
		}
		//Store of a flag that we're hovered inside this element
		elementMap[anchorId].TIMEOUT = setTimeout(function() {
			showvisitsHover(event, anchor);
		}, 500);
	});
	visitcompContentElem.on("mouseleave", ".visit-info", function(event) {
		$(this).css("background-color", "#FFF");
		clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
	});
	/*
	 * @constructor Handles creating and showing hovers in the component
	 * @param {object} event : The jquery event 
	 * @param {object} anchor : The element that triggered the hover.
	 */
	function showvisitsHover(event, anchor) {
		var jsonId = $(anchor).attr("id").split("_");
		switch (jsonId[0]) {
			case "visit":
				var mainvisitindexarray = mainvisitHvrArray[jsonId[2]];
				showvisitsHoverHTML(event, anchor, mainvisitindexarray);
				break;
			case "diagnosis":
				var diagnosisindexarray = diagnosisHvrArray[jsonId[2]];
				showvisitsHoverHTML(event, anchor, diagnosisindexarray);
				break;
			case "documents":
				var documentsindexarray = documentsHvrArray[jsonId[2]];
				showvisitsHoverHTML(event, anchor, documentsindexarray);
				break;
			case "healthplan":
				var healthindexarray = healthHvrArray[jsonId[2]];
				showvisitsHoverHTML(event, anchor, healthindexarray);
				break;
		}
	}

	/*
	 * @constructor builds hover HTML for the component
	 * @param {object} event : The jquery event 
	 * @param {object} anchor : The element that triggered the hover.
	 * @param {array} anchor : The Array to use when creating hover details.
	 */
	function showvisitsHoverHTML(event, anchor, visithoverarray) {
		var visithvr = [];
		visithvr.push('<div class="result-details pwx_vi_result_details">');
		for (var i = 0; i < visithoverarray.length; i++) {
			visithvr.push('<dl class="visits-det">', '<dt><span>' + visithoverarray[i][0] + '</span></dt><dd><span>' + visithoverarray[i][1] + '</span></dd></dl>');
		}
		//Create a new tooltip
		visithvr.push('</div>');
		var visithvrtooltip = thiz.tooltip;
		visithvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(visithvr.join(""));
		visithvrtooltip.show();
	}

};
MP_Util.setObjectDefinitionMapping("AMB_VISITS_ENC", AmbVisitComponent);