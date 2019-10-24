/**
 * New Patient dialog view to add new patient to patient collection
 * 
 * @author Chao Shi - CS024183
 * @requires Backbone, Underscore, jQuery, jQuery Dialog UI,Mustache
 * File "translation.safety.json"
					Namespaces used: 
						"PatientListsHandlebar",
						"SafetyAttendanceCommon",
						"NewPatientHandlebar",
						"DashboardHeaderHandlebar",
						"PatientInfoHandlebar".
 */
var NewPatientDialogView = Backbone.View.extend({

	/**
	 * Handlebar template for rendering html
	 */
	npTemplate : TemplateLoader
			.compileFromFile(template_static_path + "templates/_NewPatientDialog.handlebar.html"),

	/**
	 * css class name
	 */
	className : "newptient-dialog-view",

	patients : {},

	patientlists : {},

	/**
	 * event
	 */
	events : {
		"change .patient-lists-select" : "ptlistChange",
		"change .fu-lists-select" : "fulistChange",
		"click #nuLink":"setSelectedFacility"
	},

	/**
	 * Initializes View
	 */
	initialize : function() {
		_.bindAll(this);
	},

	/**
	 * Renders html for view
	 * 
	 * @returns {NurseUnitDialogView} this view
	 */
	render : function() {
		var that = this;
		this.model.bind("change", this.fillPatientList);
		this.model.bind("started-loading", function(){$(that.el).attr("disabled", "disabled");});
		this.model.bind("finished-loading", function(){$(that.el).removeAttr("disabled");});
		var $el = $(this.el);
		var dialogView = {
			PTLIST : this.patientlists.getLists(),
			FUQUAL: this.patientlists.getFacilities()
		};

		$(this.el).html(this.npTemplate(dialogView));
		$(this.el).i18n(); 
		

		// create Nurse Unit Dialog UI
		$el.dialog({
			modal : true,
			autoOpen : false,
			minWidth : 900,
			minHeight : 400,
			title : $.i18n.t("NewPatientHandlebar.ADD_NEW_PATIENT"),
			buttons : [
			{
				text: $.i18n.t("SafetyAttendanceCommon.SUBMIT"),
				  click: function() { 
		
					that.close();
					that.submitPatients();
			}
			},
			{
				text: $.i18n.t("SafetyAttendanceCommon.CANCEL"),
				
			        click: function() {
					that.close();
			}
			}
			],
			open : function(event, ui) {
				$(this).dialog("option", "position", []);
			}
		});
		return this;
	},

	/**
	 * Open the view
	 */
	open : function() {
		$(this.el).dialog("open");
	},

	/**
	 * Close the view
	 */
	close : function(){
		$(this.el).dialog("close");
	},

	submitPatients : function(){
		var addedPatientList = new NewPatientModel;
		addedPatientList.patients = this.patients;
		var selectedOptions = this.$(".selection option:selected");
		var pt_cnt = selectedOptions.length;
		var patients = [];
		var that = this;
		_.each(selectedOptions, function(option){
			var patient = _.find(that.model.get("patients"), function(patient){
				return patient.PT_ID===parseInt(option.value, 10);
			});
			patients.push(patient);
		});
		addedPatientList.set({
			pt_cnt: pt_cnt,
			patients : patients
		});
		addedPatientList.getBhInfo(addedPatientList.mode.DUPLICATE_PATIENT_CHECK);
	},

	//patient list select change
	ptlistChange:function(event){
		this.resetFu();
		this.resetPtSelect();
		$target = $(event.target);
		if($target.find("option:selected").val()!=="0"){
			var listId = parseInt($target.find("option:selected").val(), 10);
			var selected = _.find(this.patientlists.PTLISTS.PTLIST, function(ptlist) {
				return ptlist.LISTID === listId;
			});
			selected.NULIST=[];
			try{
				this.close();
				this.model.retrieve(selected);
				this.open();
			}
			catch(err){

			}
		}
	},

	//facility nurse unit select change
	fulistChange : function(event){
		this.resetPtlist();
		this.resetNurseUnitText();
		this.resetPtSelect();
		$target = $(event.target);
	},

	setSelectedFacility : function(event){
		this.resetPtlist();
		this.resetPtSelect();
		var nu  = this.patientlists.getSelectedFacility($(".fu-lists-select option:selected").attr("value"));
		if(nu===undefined){
			
			alert($.i18n.t("PatientListsHandlebar.PLEASE_SELECT_A_VALID_FACILITY"));
			
		}
		else{
			var nurseUnitDialog = NurseUnitDialogViewSingleton.createNurseUnitDialogView(nu, this);
			nurseUnitDialog.open(true, this);
		}
	},

	resetFu : function(){
		this.$(".fu-lists-select").find('option:first').attr('selected','selected');
		this.$("#nuLink").text($.i18n.t("PatientListsHandlebar.NURSE_UNITS"));
		this.$("#nuLink").attr("title", $.i18n.t("PatientListsHandlebar.CLICK_TO_OPEN_NURSE_UNITS"));
	},

	resetPtlist : function(){
		this.$(".patient-lists-select").find('option:first').attr('selected','selected');
	},

	resetPtSelect : function(){
		this.$(".selection").html("");
	},

	resetNurseUnitText : function(){
		this.$("#nuLink").text($.i18n.t("PatientListsHandlebar.NURSE_UNITS"));
		this.$("#nuLink").attr("title", $.i18n.t("PatientListsHandlebar.CLICK_TO_OPEN_NURSE_UNITS"));
	},

	fillPatientList : function(){
		var ptlist = this.model.get("patients");
		var space = "&#160;";
		var optionsHtml = "";
		var maxNameLength = 0,
			maxAgeLength = 0,
			maxGenderLength = 0,
			maxDOBLength = 0,
			maxMRNLength = 0,
			maxFINLength = 0,
			maxLocationLength = 0;
		_.each(ptlist, function(pt){
			if(pt.NAME.length>maxNameLength){
				maxNameLength = pt.NAME.length;
			}
			if(pt.AGE.length>maxAgeLength){
				maxAgeLength = pt.AGE.length;
			}
			if(pt.GENDER.length > maxGenderLength){
				maxGenderLength = pt.GENDER.length;
			}
			if(pt.BIRTHDTJS.length > maxDOBLength){
				maxDOBLength = pt.BIRTHDTJS.length;
			}
			if(pt.FIN.length > maxFINLength){
				maxFINLength = pt.FIN.length;
			}
			if(pt.MRN.length > maxMRNLength){
				maxMRNLength = pt.MRN.length;
			}
			var nurse_unit = pt.NURSE_UNIT;
			var room = pt.ROOM;
			var bed = pt.BED;
			if(room!==""){
				room = "/" + room;
			}
			if(bed!==""){
				bed = "/" + bed;
			}
			var location = nurse_unit+room+bed;
			if(location.length>maxLocationLength){
				maxLocationLength = location.length;
			}
		});

		_.each(ptlist, function(pt){
			optionsHtml += "<option value='" + pt.PT_ID + "'>";
			optionsHtml += pt.NAME + space.repeat(maxNameLength-pt.NAME.length + 5);
			optionsHtml += pt.GENDER + space.repeat(maxGenderLength-pt.GENDER.length+5);
			optionsHtml += $.i18n.t("PatientInfoHandlebar.DOB") + pt.BIRTHDTJS + space.repeat(maxDOBLength-pt.BIRTHDTJS.length+5);
			optionsHtml += $.i18n.t("PatientInfoHandlebar.FIN") + pt.FIN + space.repeat(maxFINLength-pt.FIN.length+5);
			optionsHtml += $.i18n.t("PatientInfoHandlebar.MRN") + pt.MRN + space.repeat(maxMRNLength-pt.MRN.length+5);
			var nurse_unit = pt.NURSE_UNIT;
			var room = pt.ROOM;
			var bed = pt.BED;
			if(room!==""){
				room = "/" + room;
			}
			if(bed!==""){
				bed = "/" + bed;
			}
			var location = nurse_unit+room+bed;
			optionsHtml += $.i18n.t("DashboardHeaderHandlebar.LOCATION") + location + space.repeat(maxLocationLength-location.length+5);
			optionsHtml += "</option>";
		});
		this.$(".selection").append(optionsHtml);
	},

	setSelectedNu : function(facility, nucd, flag) {
		if (nucd.length > 0) {
			var selected = [];
			_.each(facility.LOCQUAL, function(nu) {
				if (_.indexOf(nucd, nu.NULOCATIONCD) != -1) {
					delete nu["OPEN"];
					delete nu["CLOSE"];
					selected.push(nu);
				}
			});
			var fac = _.clone(facility);
			fac.LOCQUAL = selected;
			var select = {
				"PRSNLID" : Criterion.personnel_id,
				"LISTID" : -1,
				"LISTTYPECD" : 0,
				"DEFAULTLOCCD" : 0,
				"NULIST" : [ fac ]
			};
			this.close();
			this.model.retrieve(select);
			this.open();
		}
	},

	//change text of nurse unit link
	changeNurseUnitText:function(selection){
		if(selection.length>0){
			var text="";
			$.each(selection, function(i, e){
				text = text + e + "; ";
			});
			text=text.slice(0, text.length-2);
			this.$("#nuLink").attr("title", text);
			if(text.length>20){
				text=text.slice(0, 20);
				text+="...";
			}
			this.$("#nuLink").text(text);
		}
	},

	/**
	 * Remove dialog from DOM
	 */
	removeDialog : function() {
		$(this.el).empty().remove();
		this.patients = null;
		this.patientlists = null;
	}

});
String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}
