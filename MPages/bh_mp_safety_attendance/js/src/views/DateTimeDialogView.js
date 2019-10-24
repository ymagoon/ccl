/**
 * Date time Dialog to select end date time of off unit period
 * 
 * @author Chao Shi - CS024183
 * @requires Backbone, Underscore, jQuery, jQuery Dialog UI,Mustache
 * File "translation.safety.json"
					Namespaces used: 
						"DateTimeDialogHandlebar",
						"SafetyAttendanceCommon",
						"ModifiableActivityDialogHandlebar".
 
 */
var DateTimeDialogView = Backbone.View.extend({

	/**
	 * Handlebar template for rendering html
	 */
	dtTemplate : TemplateLoader
			.compileFromFile(template_static_path + "templates/_DateTimeDialog.handlebar.html"),

	/**
	 * is Multi Select Mode Indicator
	 */
	isMultiSelect : false,

	/**
	 * css class name
	 */
	className : "datetime-dialog-view",

	/**
	 * event
	 */
	 events : {
	 	"keyup .off_tm" : "checkHour",
	 	"keyup .off_min" : "checkMin"
	 },

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
		var array = (new Date()).toString().split(" ");
		var timezone = array[4];
		var dialogView = {
			timezone: timezone
		};

		$(this.el).html(this.dtTemplate(dialogView));

		// create Nurse Unit Dialog UI
		$el.dialog({
			modal : true,
			autoOpen : false,
			minWidth : 400,
			title : $.i18n.t("DateTimeDialogHandlebar.SELECT_END_DATE_TIME_FOR_OFF_UNIT_PERIOD"),//leftout
			buttons : [
			{
				text: $.i18n.t("SafetyAttendanceCommon.SUBMIT"),
				    click: function() {
					if(that.dtValidation()){
						$(this).dialog("close");
						var input_dt = new Date(that.model.userPrefModel.get("offunitstatus").offunitstartdt);
						input_dt.setHours(that.$(".off_tm").val());
						input_dt.setMinutes(that.$(".off_min").val());											
						
						that.submitDialog(input_dt);
						
					}
				}
			},
			{
				text: $.i18n.t("SafetyAttendanceCommon.CANCEL"),
				    click: function()
				{
					$(that.checkbox).attr('checked','checked');
					$(this).dialog("close");
				}
			}
			],
			open : function(event, ui) {
				$(this).dialog("option", "position", []); 
				var gender=that.model.get("gender_display");
				var age= that.model.get("age_display");
				var title = that.model.get("name")+" "+age.Count+" "+age.Unit+", "+gender;
				$(this).dialog( "option", "title", title);
			}
		});
		return this;
	},

	/**
	 * Open the view
	 */
	open : function(checkbox) {
		this.checkbox = checkbox;
		$(this.el).dialog("open");
		this.setDateTimePicker();
	},
	
	/**
	 * Submit button click event
	 */
	submitDialog:function(input_dt){
		var that = this;
		var interval = this.model.collection.selectedInterval;
		var hours = Math.ceil(Math.abs(this.startdt - input_dt)/(60 * 60 * 1000));
		var _timeIntervals = this.model.collection.timeIntervals;
		var intervalGenerator = timeIntervalGenerator(interval, _timeIntervals?input_dt:new Date(), hours);
		var timeIntervals = intervalGenerator.getIntervals();
		// console.log(timeIntervals);
		// console.log(_timeIntervals);
		var timeSlots = _.select(timeIntervals, function(timeslot) {
			return (timeslot.startDate <= input_dt && timeslot.startDate >= that.startdt)||(timeslot.endDate <= input_dt && timeslot.endDate >= that.startdt);
		});
		//console.log(timeSlots);
		_.each(timeSlots, function(timeSlot){
			var disp = that.model.userPrefModel.get("offunitstatus").nomdisp;
			var event_date = "";
			if(timeSlot.startDate<=input_dt && input_dt<=timeSlot.endDate){
				event_date = input_dt;
			}
			else if(timeSlot.startDate<=that.startdt && that.startdt<= timeSlot.endDate){
				event_date = that.startdt;
			}
			else{
				event_date = timeSlot.endDate;
			}
			var activityData = {
				"CNT" : 1,
				"EVENT_DT" : that.getEventDt(event_date),
				"EVENTDTDISP" : that.getEventDtDisp(event_date),
				"STATUS" : "DRAFT",
				"LIST": [{
					"EVENTID" : 0.0,
					"NAME" : disp,
					"CLINEVENTID" : 0.0,
					"EVENT_CD" : that.model.userPrefModel.get("offunitstatus").cecd,
					"EVENT_DISP" : disp,
					"EVENT_RESULT" : disp,
					"FREETEXT": "",
					"NOMID": [{
						"NOMID" : that.model.userPrefModel.get("offunitstatus").nomid.toString()
					}],
					"INPUTPRT": 0.0
				}]
			};
			
		//Loop through for user specified time interval
				var index = -1;
			for (var i = 0; i < _timeIntervals.length; i++) {
				if( ( _timeIntervals[i].startDate.getTime() == timeSlot.startDate.getTime() )&& ( _timeIntervals[i].endDate.getTime() == timeSlot.endDate.getTime() ) ){
					index = i;
					break;
				}
			}
			
			if(index<_timeIntervals.length && index >= 0){
				var view = that.newActivityView(index);
				view.model.set(activityData);
			}
			else{
				var activityModel = new ActivityModel(activityData);
				activityModel.patient = that.model;
				that.model.activities.add(activityModel);
			}
		});
		this.model.userPrefModel.removePref(this.model.get("person_id"));
	},

	/**
	 * create and attach acitivtyview and model
	 */
	newActivityView : function(index){
		//initialize the model and view
		var model = this.model, activityModel = new ActivityModel, activityView;
		//set up model properties
		activityModel.patient = model;
		var timeIntervals = this.model.collection.timeIntervals;
		activityModel.set({
			"STARTDT" : timeIntervals[index].startDate,
			"ENDDT" : timeIntervals[index].endDate
		});
		//add activityModel to activities list
		model.activities.add(activityModel);
		//set up view properties
		activityView = new ActivityView({
			modifiable : true,
			model : activityModel,
			patient : model
		});
		//replace the null activityView with the new activityView
		this.model.view.activityViews[index]=activityView;
		//replace the DOM element of the table cell with new acitivtyView's DOM
		this.model.view.el.replaceChild(activityView.el, this.model.view.el.cells[index+4]);
		//set the previousActivityView if it is not null
		if(this.model.view.activityViews[index+1]!=null&&index+1<this.model.view.activityViews.length)
				this.model.view.activityViews[index].previousActivityView = this.model.view.activityViews[index + 1];
		return this.model.view.activityViews[index];
	},

	/**
	 *set date time picker
	 */
	setDateTimePicker : function(){
		var startdt = new Date(this.model.userPrefModel.get("offunitstatus").offunitstartdt);		
		var timeintervals = this.model.view.timeIntervals;
		var enddt = (timeintervals) ? timeintervals[0].endDate:new Date();
		this.startdt = new Date(startdt);
		this.enddt = enddt;
		if(startdt.getFullYear()===enddt.getFullYear() && startdt.getMonth()===enddt.getMonth() && startdt.getDate() === enddt.getDate()){
			var dateString = df.format(startdt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
			
			this.$(".off_dt").append("<option value='"+dateString+"'>"+dateString+"</option>");
			this.$(".off_dt").attr("disabled", true);
		}
		else{
			var dates = this.getDates(startdt, enddt);
			var dropdownHtml = "";
			_.each(dates, function(date){
					
				var dateString = df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				
				dropdownHtml += "<option value='"+dateString+"'>"+dateString+"</option>";
			});
			this.$(".off_dt").append(dropdownHtml);
			this.$(".off_dt option:last").attr("selected","selected");
		}
		this.$(".off_tm").val(enddt.getHours());
		this.$(".off_min").val(enddt.getMinutes());
	},

	/**
	 *get start date time in javascript date object format
	 */

	getStartDt : function(dtString){
	    var dateSeparator = "/";
		if (dtString.indexOf("-") != -1) { dateSeparator = "-"; } 
		var list = dtString.split(" ");
		var date = list[0].split("-");
		var time = list[1].split(":");
		var year = date[2];
		var month = DateFormatter.formatEventMonth(date[1]);
		month = parseInt(month, 10)-1;
		var day = date[0];
		var hour = time[0];
		var minute = time[1];
		var second = time[2];
		var milli = time[3];
		return new Date(dtString);
		
	},

	getDates : function(startDate, stopDate) {
		var dateArray = [];
		var currentDate = startDate;
		var endDate = stopDate;
		if(endDate.getHours()<currentDate.getHours()){
			endDate = endDate.addDays(1);
		}
		while (currentDate <= endDate) {
			dateArray.push( new Date (currentDate));
			currentDate = currentDate.addDays(1);
		}
		return dateArray;
	},

	checkHour : function(event){
		var hour = this.$(".off_tm").val();
		hour = hour.replace(/[^0-9]/g, '');
		if (hour > 23) {
			hour= 23;
		}
		this.$(".off_tm").val(hour);
	},

	checkMin : function(event){
		var min = this.$(".off_min").val();
		min = min.replace(/[^0-9]/g, '');
		if (min > 59) {
			min= 59;
		}
		this.$(".off_min").val(min);
	},

	dtValidation : function(event){
			var input_dt = new Date(this.model.userPrefModel.get("offunitstatus").offunitstartdt);
		input_dt.setHours(this.$(".off_tm").val());
		input_dt.setMinutes(this.$(".off_min").val());
		if (input_dt < this.startdt) {
			var start_dt = new Date(this.startdt);
			var r = confirm($.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE")
							+ start_dt
							+ $.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE_INSTEAD"));
			if (r === true) {
									
				var start_date = df.format(start_dt,
						mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), start_hr = DateFormatter
						.formatDate(start_dt, "HH"), start_min = DateFormatter
						.formatDate(start_dt, "mm");
				this.$(".off_dt").val(start_date);
				this.$(".off_tm").val(start_hr);
				this.$(".off_min").val(start_min);
				return true;
			} else {
				return false;
			}
		} else if (input_dt > this.enddt) {
			var end_dt = this.enddt;
			var r = confirm($.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE")
							+ end_dt
							+ $.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE_INSTEAD"));
			if (r === true) {
				
				var end_date = df.format(end_dt,
						mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), end_hr = DateFormatter
						.formatDate(end_dt, "HH"), end_min = DateFormatter
						.formatDate(end_dt, "mm");
				this.$(".off_dt").val(end_date);
				this.$(".off_tm").val(end_hr);
				this.$(".off_min").val(end_min);
				return true;
			} else {
				return false;
			}
		}
		return true;
	},

	/**
	*get activity time of the format of dd-NNN-yyyy HH:mm:ss, use for time interval
	*/
	getEventDt : function(dt){
		var event_date = df.format(dt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_MMM_4YEAR);
	
		return event_date;
	},

	/**
	*get activity time of the format of MM-dd-yyyy HH:mm, use for charting
	*/
	getEventDtDisp : function(dt){
		var event_date_disp = (df.format(dt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR))	
		
		return event_date_disp;
	},

	/**
	 * Remove dialog from DOM
	 */
	removeDialog : function() {
		$(this.el).empty().remove();
		this.model = null;
	}

});
Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf())
	dat.setDate(dat.getDate() + days);
	return dat;
}
