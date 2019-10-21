/**
 * Nurse Unit Dialog to select nurse unit for facility
 * 
 * @author Chao Shi - CS024183
 * @requires Backbone, Underscore, jQuery, jQuery Dialog UI,Mustache
 
 * File "translation.safety.json"
					Namespaces used: 
						"NurseUnitDialogHandlebar",
						"SafetyAttendanceCommon".
 
 */
var NurseUnitDialogView = Backbone.View.extend({

	/**
	 * Handlebar template for rendering html
	 */
	nuTemplate : TemplateLoader
			.compileFromFile(template_static_path + "templates/_NurseUnitDialog.handlebar.html"),

	/**
	 * css class name
	 */
	className : "nurseunit-dialog-view",

	/**
	 * Event delegators
	 */
	events : {
		
	},

	isNewPatient : false,

	/**
	 * Initializes View
	 */
	initialize : function() {
		this.render();
	},

	/**
	 * Renders html for view
	 * 
	 * @returns {NurseUnitDialogView} this view
	 */
	render : function() {
		var that = this, $el = $(this.el);

		this.setLineIndex();

		var dialogView = {
			LOCQUAL : this.model.LOCQUAL
		};

		$(this.el).html(this.nuTemplate(dialogView));
		
		$(this.el).i18n();

		// create Nurse Unit Dialog UI
		$el.dialog({
			modal : true,
			autoOpen : false,
			minWidth : 600,
			buttons : [
			
				{
				text: $.i18n.t("SafetyAttendanceCommon.SUBMIT"),
				className: 'submitButton',
			        click: function() { 
					that.submitDialog();
				}
				},
				{
				text: $.i18n.t("SafetyAttendanceCommon.CANCEL"),
				className: 'CancelButton',
			        click : function() {  
					$(this).dialog("close");
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
	open : function(isNewPatient, newPatientDialogView) {
		this.isNewPatient = isNewPatient;
		if(newPatientDialogView){
			this.newPatientDialogView = newPatientDialogView;
		}
		$(this.el).dialog("open");
	},

	/**
	 * Set Line Index for table rows
	 */
	setLineIndex : function() {
		var length = this.model.LOCQUAL.length;
		$.each(this.model.LOCQUAL, function(i, e) {
			if (i % 3 === 0) {
				e["OPEN"] = true;
				e["CLOSE"] = false;
			} else if (i % 3 === 2 || i === length - 1) {
				e["OPEN"] = false;
				e["CLOSE"] = true;
			} else {
				e["OPEN"] = false;
				e["CLOSE"] = false;
			}
		});
	},
	
	/**
	 * Submit button click event
	 */
	submitDialog:function(){
		var selection = [];
		var code_value = [];
		$.each($("input:checked", this.el), function(i, e){
			code_value.push(parseInt($(e).attr("value"), 10));
			selection.push($(e).siblings("label").text());
		});
		if(this.isNewPatient){
			$(this.el).dialog("close");
			if(selection.length && code_value.length){
				this.newPatientDialogView.setSelectedNu(this.model, code_value);
				this.newPatientDialogView.changeNurseUnitText(selection);
			}
		}
		else{
			this.options.listView.model.changeNurseUnitText(selection);
			$(this.el).dialog("close");
			this.options.listView.model.setSelectedNu(this.model, code_value, true);
		}
	},

	/**
	 * Remove dialog from DOM
	 */
	removeDialog : function() {
		$(this.el).empty().remove();
		this.model = null;
	}

});
