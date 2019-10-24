/**
 * Represents a Patient Clinical Activity
 * 
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,DateFormatter
 */
var ActivityModel = Backbone.Model.extend({

	/**
	 * Patient owner of ActivityModel
	 */
	patient : {},

	/**
	 * Default values
	 */
	defaults : {
		"CNT" : 0,
		"EVENT_DT" : "",
		"EVENTDTDISP" : "",
		"STATUS" : "NONE",
		"STARTDT": "",
		"ENDDT": "",
		"LIST": [{
			"TYPE" : "",
			"EVENTID" : 0.0,
			"NAME" : "",
			"CLINEVENTID" : 0.0,
			"EVENT_CD" : 0.0,
			"EVENT_DISP" : "",
			"EVENT_RESULT" : "",
			"FREETEXT": "",
			"NOMID": [{
				"NOMID" : ""
			}],
			"INPUTPRT": 0.0
		}]
	},

	/**
	 * Default Constructor
	 * 
	 * @constructor
	 */
	initialize : function() {
		_.bindAll(this);
		this.setInitialActivityStatus();
	},

	/**
	 * Sets Initial Activity Status, based on whether it has been saved to
	 * patient record
	 */
	setInitialActivityStatus : function() {
		if( !this.get("CNT")) {
			this.set({
				"STATUS" : "NONE"
			});
			return;
		}
		this.set({
			"STATUS":this.get("LIST")[0].EVENTID > 0 ? "SAVED" : "DRAFT"
		});
	},

	/**
	 * Get Date object from format 08-02-2011 09:41
	 * 
	 * @returns {Date}
	 */
	getEventDt : function() {
		var date = jQuery.trim(this.get("EVENT_DT"));
		if(this.get("STATUS")==="DRAFT"){
			var dateInString = DateFormatter.getDateFromFormat(date, "dd-NNN-yyyy HH:mm:ss"); 
			var date1 = new Date(dateInString); 
			return new Date(df.format(date1, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_MMM_4YEAR));
		}
		else{
			return new Date(DateFormatter.getDateFromFormat(date, "M-d-y H:m"));
		}
	},

	/**
	 * In Error an Activity. If it's a saved activity, set to INERROR. If it's a
	 * draft, set it to none.
	 */
	inError : function() {
		this.set({
			"STATUS":this.get("STATUS").toUpperCase() === "DRAFT" ? "NONE" : "INERROR"
		});
	},

	/**
	 * Destroys model and any associated view
	 */
	destroyActivity : function() {
		// remove any circular reference
		if(this.view) {
			this.view = null;
		}
		// removes model from collection
		this.destroy();
		// unbind all events for model
		this.unbind();
	}

});
