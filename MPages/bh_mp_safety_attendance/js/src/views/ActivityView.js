/**
 * Activity View
 * @author Aaron Nordyke - AN015953
 * @requires Backbone, Underscore, jQuery, ActivityModel,PatientModel,Mustache
 */
var ActivityView = Backbone.View.extend({
	
	tagName:"td",
	
	/**
	 * CSS class name
	 */
	className : "activity-view active-activity-view",
	
	/**
	 * Handlebar template for rendering html
	 */
	template : TemplateLoader.compileFromFile(template_static_path + "templates/_Activity.handlebar.html"),
	/**
	 * Event handlers
	 */
	events:{
		"click" : "launchDialog"
	},
	
	previousActivityView:null,
	
	/**
	 * Initializes View
	 */
	initialize:function(){
		_.bindAll(this);
				
		this.model.bind("change",this.render);
		//one-to-one relationship
		this.model.view = this;
		
		//determines whether or not model activity can be modified
		this.modifiable = this.options.modifiable ? this.options.modifiable : false;

		//PatientModel is a required param
		if(this.options.patient){
			this.patient = this.options.patient;
		}
		else{
			throw Error("Patient Model missing from ActivityView");
		}
		
		//destroy view if model is destroyed
		this.model.bind("destroy",this.removeView);

		this.render();
	},
	
	/**
	 * Renders View HTML
	 * @returns {ActivityView} this view
	 */
	render:function(){
		var that = this,
				$el = $(this.el),
				view = {
					activity:function(){
						var event_result = that.model.get("CNT");
						if(event_result){
							var result="";
							_.each(that.model.get("LIST"), function(event){
								result+=event.EVENT_RESULT+"; ";
							})
							result=result.slice(0, result.length-2);
							return result;
						}
						else if(!!that.modifiable){
							return $.i18n.t("Charting.CLICK_TO_ADD");					
						}
						else{
							return "--";					
						}
					}
				};
		
		$el.html(this.template(view));		
		
		$el.removeClass();
		$el.addClass(this.className);
		$el.addClass(that.model.get("STATUS").toLowerCase() + "-status");
		var modifiability = !!this.modifiable ? "modifiable" : "not-modifiable";
		$el.addClass(modifiability);
		
		return this;
	},
	
	/**
	 * Launches ActivityDialogView for changing activity
	 */
	launchDialog:function(){
		var activityDialog = {};
		var selectedPatient = this.patient.collection.MultiSelectModel.get("selectedPatient");
		if(selectedPatient.length){
			activityDialog = ActivityDialogViewSingleton.createActivityDialogView(this.model,this.patient,this, true);
		}
		else{
			activityDialog = ActivityDialogViewSingleton.createActivityDialogView(this.model,this.patient,this, false);
		}
		activityDialog.open();
	},
	
	/**
	 * Remove view from DOM.
	 */
	removeView : function(){
		$(this.el).empty().remove();
		this.model.unbind("change",this.render);
		this.model.unbind("destroy",this.removeView);
		this.previousActivityView = null;
	}
});
