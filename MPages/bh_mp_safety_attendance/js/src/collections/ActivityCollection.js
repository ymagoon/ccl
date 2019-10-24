/**
 * Collection of ActivityModel
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,ActivityModel
 */
var ActivityCollection = Backbone.Collection.extend({

	/**
	 * ActivityCollection Model
	 */
	model:ActivityModel,

	/**
	 * Initializes Collection
	 */
	initialize: function() {
		_.bindAll(this);
	},

	/**
	 * Finds newest ActivityModel within time interval
	 * @param {Date} start Beginning of interval
	 * @param {Date} end End of interval
	 * @returns {ActivityModel} newest within time interval
	 */
	newestInRange: function(start,end,beginningIndex) {
		if(this.models.length===0) {
			return null;
		}
		var latestDate = this.models[0].getEventDt();
		var earliestDate = this.models[this.length-1].getEventDt();
		latestDate.setSeconds(0,0);
		earliestDate.setSeconds(0,0);
		var activities = [];

		if(end < earliestDate || start > latestDate){
			return null;
		}
		var theseModels = this.models;
		var modelLength = theseModels.length;
		var idx = 0;
		for(idx = beginningIndex; idx < modelLength; idx++){
			var date = theseModels[idx].getEventDt();
			date.setSeconds(0,0);
			if(( date >= start ) && (date <= end)){
				activities.push(theseModels[idx]);
			}
			if(theseModels[idx].get("LIST")[0].TYPE == "" && date <= start){
				break;
			}
		}

		//get newest date from those within range
		return [_.max(activities, function(activity) {
			var date = activity.getEventDt();
			date.setSeconds(0);
			return date.valueOf();
		}), idx ];
	},
	
	/**
	 * Gets all Activities that have not been saved to Millennium
	 * @returns {Array} ActivityModel array
	 */
	getUnsavedActivities:function(){
		return this.select(function(activity){
			return activity.get("STATUS").toUpperCase() == "DRAFT";
		});
	},
	
	/**
	 * Gets all Activities that will be uncharted in Millennium
	 * @returns {Array} ActivityModel array
	 */
	getInErrorActivities:function(){
		return this.select(function(activity){
			return activity.get("STATUS").toUpperCase() == "INERROR";
		});
	}

});
