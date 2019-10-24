/**
 * View for Table Header of Dashboard
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache
 
 * File "translation.safety.json"
					Namespaces used: 
						"DashboardHeaderHandlebar"
 
 */
var DashboardHeaderView = Backbone.View.extend({
	
	tagName:"thead",
	
	/**
	 * CSS class name
	 */
	className:"patient-dashboard-header",
	
	/**
	 * Handlebar template for rendering HTML
	 */
	template : TemplateLoader.compileFromFile(template_static_path + "templates/_DashboardHeader.handlebar.html"),
	/**
	 * Event handlers
	 */
	events:{
		"click .location-sort":"sortByLocation",
		"click .patient-sort":"sortByPatient",
		"click .suicide-sort":"sortBySuicide",
		"click .fall-sort":"sortByFall",
		"click .select-header" :"selectAll",
		"mouseover .select-header" : "enterSelectAll",
		"mouseout .select-header" : "leaveSelectAll"
	},
	
	/**
	 * Initializes View.  Renders on "change:timeIntervals".
	 */
	initialize:function(){
		_.bindAll(this,"render");
		this.model.bind("change:timeIntervals",this.render);
		this.render();
	},
	
	/** 
	 * Renders View HTML
	 * @returns {DashboardHeaderView} this view
	 */
	render:function(){
		var url = $(".patient-sort").attr("src");
		var timeIntervals = this.model.timeIntervals;
		var context = {
			intervals:this.model.timeIntervals,
			suicide_label:this.model.patientListsModel.get("suicideLabel"),
			fall_label:this.model.patientListsModel.get("fallLabel")
		};
		$(this.el).html(this.template(context));
		$(this.el).i18n();
		$(".patient-sort").attr("src", url);

		return this;
	},
	/**
	 * Callback function for sorting patients by location
	 */	
	sortByLocation:function(){
		this.model.sortPatientsByLocation();
	},
	/**
	 * Callback function for sorting patients by name
	 */
	sortByPatient:function(){
		this.model.sortPatientsByName();
	},
	
	/**
	 * Callback function for sorting patients by suicide risk
	 */
	sortBySuicide:function(){
		this.model.sortPatientsBySuicideRisk();
	},
	
	/**
	 * Callback function for sorting patients by fall risk
	 */
	sortByFall:function(){
		this.model.sortPatientsByFallRisk();
	},

	selectAll : function(){
		var multiSelectModel = this.model.MultiSelectModel;
		if(multiSelectModel.get("selectedPatient").length){
			multiSelectModel.clean();
		}
		else{
			var patientList = [];
			_.each(this.model.models, function(patient){
				if(!patient.userPrefModel.get("offunitstatus").isoffunit){
					patientList.push(patient);
				}
			});
			multiSelectModel.set({selectedPatient: patientList});
		}
	},
	
	enterSelectAll : function(){
		$(".multi-select-wraper").addClass("hover");
		$(".multi-select-wraper.off-unit").removeClass("hover");
		$(".multi-select-wraper.selected").removeClass("hover");
	},
	
	leaveSelectAll : function(){
		$(".multi-select-wraper").removeClass("hover");
	}
});
