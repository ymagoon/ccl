/**
 * Patient Lists View
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache
 * File "translation.safety.json"
					Namespaces used: 
						"PatientListsHandlebar".
 
 */
var PatientListsView = Backbone.View.extend({
	
	/**
	 * Handlebars template for rendering HTML
	 */
	template : TemplateLoader.compileFromFile(template_static_path + "templates/_PatientListsSelect.handlebar.html"),
	
	/**
	 * Event handlers
	 */
	events: {
		"click #ptpopSubmit":"setSelectedList",
		"click #nuLink":"setSelectedFacility",
		"change #ptlist":"ptlistChange",
		"change #falist":"fulistChange",
		"click #ptpopReset":"resetPatientList"
	},

	/**
	 * Initializes view.  Renders on PatientListsModel's "change:ptlists" event
	 */
	initialize: function() {
		_.bindAll(this);
		this.model.bind("change:ptlists", this.render);
		this.model.bind("change:selected", this.displaySelected);
		this.model.bind("select:fulist", this.fulistChange);
		this.model.bind("select:ptlist", this.ptlistChange);
		this.model.bind("destroy",this.remove);
		this.render();
		
	},

	/**
	 * Render View HTML
	 * @returns {PatientListsView} this view
	 */
	render: function() {
		var that = this,
				view = {
					PTLIST : this.model.getLists(),
					FUQUAL: this.model.getFacilities()
				};
		$(this.el).html(this.template(view));
		$(this.el).i18n();
		return this;
	},

	/**
	 * callback function for setting patient list.
	 */
	setSelectedList: function() {
		this.select = $(".patient-lists-select",this.el)[0];
		var opt = this.select.options[this.select.selectedIndex].value;
		if(!opt||opt===""){
			alert($.i18n.translate("PatientListsHandlebar.PLEASE_SELECT_A_VALID_PATIENT_LIST"));
		}
		else{
			this.option = parseInt(opt);
			this.model.setSelectedList(this.option);
			this.select = $(".time-range-select")[0];
			this.select.selectedIndex = 0;

		}
	},
	
	/**
	 * callback function for setting facility list
	 */
	setSelectedFacility:function(){
		var nu  = this.model.getSelectedFacility($("#falist option:selected").attr("value"));
		if(nu===undefined){
			alert($.i18n.t("PatientListsHandlebar.PLEASE_SELECT_A_VALID_FACILITY"));
			
		}
		else{
			var nurseUnitDialog = NurseUnitDialogViewSingleton.createNurseUnitDialogView(nu, this);
			nurseUnitDialog.open(false);
		}
	},

	/**
	 * Keeps selected list choice up to date with the model
	 */
	displaySelected : function(){
		var selectedListId = this.model.get("selectedList").LISTID,
				select = $(".patient-lists-select",this.el)[0];
		
		for(var i = 0,l = select.options.length;i<l;i++){
			if(select.options[i].value == selectedListId){
				select.selectedIndex = i;
			}
		}
		$("#ptpopMessage").remove();
	},
	
	//reset text of nurse unit link
	resetNurseUnitText:function(){
		$("#nuLink").text($.i18n.t("PatientListsHandlebar.NURSE_UNITS"));
		$("#nuLink").attr("title", $.i18n.t("PatientListsHandlebar.CLICK_TO_OPEN_NURSE_UNITS"));
	},
	
	//patient list select change
	ptlistChange:function(){
		this.$("#falist").attr("disabled", true);
		this.$("#nuLink").attr("disabled", true);
		this.$("#ptpopSubmit").attr("disabled", false);
		this.$("#falist").attr("selectedIndex", -1);
		this.resetNurseUnitText();
	},
	
	//fu list select change
	fulistChange:function(){
		this.$("#ptlist").attr("disabled", true);
		this.$("#ptlist").attr("selectedIndex", -1);
	},
	
	//reset patient list view
	resetPatientList:function(){
		location.reload();
	},
	
	//Disables all interaction within the view
	disable : function(){
		$(this.el).attr("disabled", true);

	},
	
	//Enables all interaction within the view
	enable : function(){
		$(this.el).attr("disabled", false);
	}

});
