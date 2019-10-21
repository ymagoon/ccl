/**
 * Post To Chart View
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache
 */
var PostToChartView = Backbone.View.extend({
	
	/**
	 * DOM element that contains view
	 */
	el:$("#chart-activities"),
	
	/**
	 * Event Handlers
	 */
	events:{
		"click	.save-to-chart" : "saveToChart"
	},
	
	/**
	 * Initializes View.
	 */
	initialize:function(){
		_.bindAll(this,"saveToChart","disable","enable");
		this.patientCollection = this.options.patientCollection;
		this.patientCollection.bind("started-loading",this.disable);
		this.patientCollection.bind("finished-loading",this.enable);
	},
	
	/**
	 * Save changed or new activities to Millennium
	 */
	saveToChart:function(){
		this.disable();
		var unsavedActivities = this.patientCollection.getUnsavedActivities();
		var inErrorActivities = this.patientCollection.getInErrorActivities();
		var activities = unsavedActivities.concat(inErrorActivities);
		var postActBatchsize = this.patientCollection.BhInfoModel.get("APP_PREF").POST_ACT_BATCHSIZE;
		// condition to check the activities , if there is no activities no need to save and enable the sign to chart button. 
		if(activities.length > 0) {
			this.model.chartAllActivities(activities , postActBatchsize);
		}else{
			this.enable();
		}
	},
	
	//Disables all interaction within the view
	disable : function(){
		this.$('select').attr("disabled",true);
		this.$('button').attr("disabled",true);
	},
	
	//Enables all interaction within the view
	enable : function(){
		this.$('select').attr("disabled",false);
		this.$('button').attr("disabled",false);
	}
});
