/**
 * Activity Dialog View for add/changing patient activity
 * 
 * @author Aaron Nordyke - AN015953
 * @requires Backbone, Underscore, jQuery, jQuery Dialog UI,
 *           PatientModel,ActivityView,Mustache
 
 * File "translation.safety.json"
					Namespaces used: 
						"ModifiableActivityDialogHandlebar",
						"SafetyAttendanceCommon",
*/
var ActivityDialogView = Backbone.View
		.extend({

			/**
			 * Handlebar template for rendering html
			 */
			modifiableTemplate : TemplateLoader
					.compileFromFile(template_static_path + "templates/_ModifiableActivityDialog.handlebar.html"),

			/**
			 * Handlebar template for rendering html
			 */
			nonModifiableTemplate : TemplateLoader
					.compileFromFile(template_static_path + "templates/_NonModifiableActivityDialog.handlebar.html"),

			/**
			 * ActivityView associated with ActivityDialogView
			 */
			activityView : {},

			/**
			 * is Multi Select Mode Indicator
			 */
			isMultiSelect : false,

			/**
			 * is Tab Navigation enabled Indicator
			 */
			isTabNav : false,

			/**
			 * css class name
			 */
			className : "activity-dialog-view",

			/**
			 * Event delegators
			 */
			events : {
				'keyup .activity-freetext-input' : 'freetextActivityKeyPress',
				"click .last-activity-choice" : "changeToLastActivity",
				"click .unchart-activity" : "unchartActivity",
				"keyup .event_min" : "eventMinuteValidation",
				"change .selection" : "responseSelected",
				"click .unchart-event" : "unchartEvent",
				"change .offUCheck" : "toggleSubmit"
			},

			DOC_HEIGHT : document.body.offsetHeight,


			/**
			 * Initializes View. generates PatientModel and ActivityView if none
			 * supplied
			 * 
			 * @example var activityViewDialog = new
			 *          ActivityView({model:PatientModel},{activityView:ActivityView});
			 */
			initialize : function() {
				_.bindAll(this);

				if (this.options.patient) {
					this.patient = this.options.patient;
				}
				if (this.options.activityView) {
					this.activityView = this.options.activityView;
				}
				this.render();
			},

			/**
			 * Renders html for view
			 * 
			 * @returns {ActivityDialogView} this view
			 */
			render : function() {
				var that = this, $el = $(this.el);
				this.resetIsMultiSelect();
				!!this.activityView.modifiable ? this.renderModifiable() : this
						.renderNonModifiable();

				// create Activity Dialog UI
				$el.dialog({
					modal : true,
					autoOpen : false,
					minWidth : 800,
					title : "",
					buttons : [
        			{
			            text: $.i18n.t("SafetyAttendanceCommon.OK"),
			            className: 'submitButton',
			            disabled: true,
			            click: function() {
			            	that.submitActivity();
			            }
			        },
					{
            			text: $.i18n.t("SafetyAttendanceCommon.CANCEL"),
           				className: 'cancelButton',
           				click: function() {
           					$(this).dialog("close");
            			}
       				 }
					],
					open : function(event, ui) {
						var offset = $(that.activityView.el).offset();
						var title = "";
						$(this).dialog("option", "position",
								[ offset.left, offset.top ]);
						if(that.isMultiSelect){
							_.each(that.patient.collection.MultiSelectModel.get("selectedPatient"), function(patient){
								title += patient.get("name")+"; ";
							});
							title = title.slice(0, title.length-2);
						}
						else{
							var gender = that.patient.get("gender_display");
							
							var age = that.patient.get("age_display");
							title = that.patient.get("name")+" =="+age.Count+" "+age.Unit+"==, "+gender;
						}
						$(this).dialog( "option", "title", title);
					}
				});
				this.initSelection();
				return this;
			},

			renderModifiable : function() {
				var that = this, $el = $(this.el);
				
				var location_activities =  this.patient.get("location_activities");
				_.each(location_activities, function(act, i){
					act.INDEX = i;
				});

				var dialogView = {
					location_activities : location_activities,
					modifyMessage : function() {
						var status = that.model.get("STATUS").toUpperCase();
						return status == "SAVED" || status == "DRAFT" ? $.i18n.t("ModifiableActivityDialogHandlebar.CHANGE_TO") 
								: $.i18n.t("ModifiableActivityDialogHandlebar.ADD");
					},

					unchart : function() {
						return that.model.get("CNT") ?  $.i18n.t("ModifiableActivityDialogHandlebar.UNCHART_ALL")
								: "";
					},

					lastActivity : function() {
						return (that.activityView.previousActivityView != null && that.activityView.previousActivityView.model
								.get("CNT")) ? $.i18n.t("ModifiableActivityDialogHandlebar.USE_PREVIOUS_ACTIVITY") 
								: "";
					},

					activityDate : that.model.get("EVENTDTDISP"),

					offUnit : that.patient.get("offunitevent").CECD !== 0 && that.model.get("STATUS")==="NONE",

					isNotMultiSelect : !that.isMultiSelect,

					nomlist : that.patient.get("offunitevent").NOMLIST
				};
				
				$el.html(this.modifiableTemplate(dialogView));
				$el.i18n();
				
				
				this.$('.activity-freetext-button').attr("disabled", true);
				this.$('.tabs').tabs();
				
				//get maxLength of selection
				var maxLength= Math.max.apply(null, this.$('.selection').map(function ()
				{
					return this.options.length;
				}).get());
				//adjust the size of the selection
				this.$('.selection').attr("size", function(){
					if(maxLength>10){
						if(maxLength<that.DOC_HEIGHT/27.2){
							return maxLength;
						}
						else{
							return that.DOC_HEIGHT/27.2;
						}
					}
				});
				this.setDateTimePicker();
			},

			renderNonModifiable : function() {
				var that = this, $el = $(this.el), array = (new Date())
						.toString().split(" "), timezone = array[4];
				var dialogView = {
					location_activities :that.model.get("CNT") ? that.patient.get("location_activities") :[],
					unchart : function() {
						return that.model.get("CNT") ?  $.i18n.t("ModifiableActivityDialogHandlebar.UNCHART_ALL")
								: "";
					},

					activityDate : that.model.get("EVENTDTDISP") + " "
							+ timezone
				};
				$(this.el).html(this.nonModifiableTemplate(dialogView));
				
				this.$('.tabs"').tabs();
             },

             /**
             * Initialize the clinical event selection for status SAVED and DRAFT
             */
             initSelection : function(){
             	var that = this;
             	if(this.model.get("STATUS")==="SAVED"){
             		_.each(this.model.get("LIST"), function(event){
             			if(event.NOMID.length){
	             			var divSelector = "#"+event.EVENT_CD;
	             			var $el = $(that.el);
	             			//nomen event
	             			if(event.NOMID.length>1||event.NOMID[0].NOMID!==0){
	             				var selector = divSelector+" .selection";
	             				var id=[];
	             				_.each(event.NOMID, function(nomenid){
	             					id.push(nomenid.NOMID);
	             				})
	             				$el.find(selector).val(id);
	             			    if($el.find(selector).attr("disabled")){
	             					$el.find(selector).find("option:selected").css("background-color", "#99cbff");
		             			}
	             			}
	             			//free text event
	             			else{
	             				var selector = divSelector+" .activity-freetext-input";
	             				var selector1 = divSelector+" .selection";
	             				$el.find(selector).val(event.FREETEXT);
	             				$el.find(selector1).attr("disabled", true);
	             			}
	             			$el.find(divSelector).find('.unchart-event').attr("disabled", false);
             			}
             		})
             	}
             	else if(this.model.get("STATUS")==="DRAFT"){
              		_.each(this.model.get("LIST"), function(event){
             			var divSelector = "#"+event.EVENT_CD;
             			var $el = $(that.el);
             			//nomen event
             			if(event.NOMID.length>0){
             				var selector = divSelector+" .selection";
             				var id = [];
             				$.each(event.NOMID, function(i, e){
             						id[i] = parseInt(e.NOMID, 10);
             				})
             				$el.find(selector).val(id);
             			    if($el.find(selector).attr("disabled")){
             					$el.find(selector).find("option:selected").css("background-color", "#99cbff");
	             			}
             			}
             			//free text event
             			else{
             				var selector = divSelector+" .activity-freetext-input";
             				var selector1 = divSelector+" .selection";
             				$el.find(selector).val(event.FREETEXT);
             				$el.find(selector1).attr("disabled", true);
             			}
             			$el.find(divSelector).find('.unchart-event').attr("disabled", false);
             		})            		
             	}
             },

			/**
			 * Fill in date and time picker for past time frame
			 */
			setDateTimePicker : function() {
				var event_dt = this.$(".event_dt").get(0), event_tm = this.$(
						".event_tm").get(0), event_min = this.$(".event_min")
						.get(0),

				cur_dt = new Date(), start_dt = this.model.get("STARTDT"), end_dt = this.model
						.get("ENDDT"),

				curr_date = df.format(cur_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), curr_hr = DateFormatter
							.formatDate(cur_dt, "HH"), curr_min = DateFormatter
							.formatDate(cur_dt, "mm"), isCurrentTimeSlot = (cur_dt > start_dt)
							&& (cur_dt < end_dt),
				
				start_date = df.format(start_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), start_hr = DateFormatter
						.formatDate(start_dt, "HH"), start_min = DateFormatter
						.formatDate(start_dt, "mm"),
						
				end_date = df.format(end_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), end_hr = DateFormatter
						.formatDate(end_dt, "HH"), end_min = DateFormatter
						.formatDate(end_dt, "mm"), isExist = this.model
						.get("CNT") ? true : false;

				if (isExist) {
					var dt = this.model.get("EVENTDTDISP");
					var list = dt.split(" ");
					var date = list[0].split("-");
					var time = list[1].split(":");
					var month = DateFormatter.formatEventMonth(date[1]);
					prev_dt = month + "-" + date[0] + "-" + date[2] + " "
							+ time[0] + ":" + time[1];
					var prev_date = date[0];
					var prev_hr = time[0];
					var prev_min = time[1];
				}

				// date drop down
				event_dt.options[0] = new Option(start_date, start_date);
				if (start_date != end_date) {
					event_dt.options[1] = new Option(end_date, end_date);
					if (isExist) {
						prev_date == start_date ? event_dt.selectedIndex = 0
								: event_dt.selectedIndex = 1;
					} else {
						event_dt.selectedIndex = 1;
					}
				} else {
					event_dt.disabled = true;
				}
				
				
				event_dt.options[0] = new Option(start_date, start_date);
				if ((start_date != end_date) && !isCurrentTimeSlot) {
					event_dt.options[1] = new Option(end_date, end_date);
					if (isExist) {
						prev_date == start_date ? event_dt.selectedIndex = 0
								:event_dt.selectedIndex =1;			
					} 
					else {
						event_dt.selectedIndex = 1;
					}	
				}
				
				else if((start_date != end_date) && isCurrentTimeSlot){
					event_dt.options[0] = new Option(curr_date, curr_date);
					event_dt.options[1] = new Option(end_date,end_date);
					if (isExist) {
						prev_date == start_date ? event_dt.selectedIndex = 0
								:event_dt.selectedIndex = 1;
					} 
					else {
						event_dt.selectedIndex = 0;
					}
				
				}
			// For isExist check to chart already charted activities
				else {
					event_dt.disabled = true;
				}
				
				// hour drop down
				if (start_hr != end_hr) {
					var ind = -1, ind2 = 0, ind3 = 0;
					if (start_hr > end_hr) {
						for ( var i = 0, hr = start_hr; hr < 24; i++, hr++) {
							if (isExist) {
								ind3 = hr.toString() == prev_hr ? i : ind3;
							} else if (hr.toString() == curr_hr) {
								ind = i;
							}
							event_tm.options[i] = new Option(hr, hr);
						}
						for (hr = 0; hr <= end_hr; hr++, i++) {
							hr = "0" + hr;
							if (isExist) {
								ind3 = hr.toString() == prev_hr ? i : ind3;
							} else if (hr.toString() == curr_hr) {
								ind = i;
							}
							event_tm.options[i] = new Option(hr, hr);
							ind2 = i;
						}
					} else {
						for ( var i = 0, hr = start_hr; hr <= end_hr; i++, hr++) {
							if (hr < 10 && i > 0) {
								hr = "0" + hr;
							}
							if (isExist) {
								ind3 = hr.toString() == prev_hr ? i : ind3;
							} else if (hr.toString() == curr_hr) {
								ind = i;
							}
							event_tm.options[i] = new Option(hr, hr);
							ind2 = i;
						}
					}
					if (isExist) {
						event_tm.selectedIndex = ind3;
					} else {
						ind != -1 ? event_tm.selectedIndex = ind
								: event_tm.selectedIndex = ind2;
					}
				} else {
					event_tm.options[0] = new Option(end_hr, end_hr);
					event_tm.disabled = true;
				}

				// minute text input
				if (isExist) {
					event_min.value = prev_min;
				} else {
					isCurrentTimeSlot ? event_min.value = curr_min
							: event_min.value = end_min;
				}

				// time zone
				var array = (cur_dt).toString().split(" ");
				var timezone = array[4];
				$(".timezone").text(timezone);
			},

			/**
			 * Open the view
			 */
			open : function() {
				$(this.el).dialog("open");
			},
			
			/**
			 * Submit the activity selection
			 */
			submitActivity: function(){
				if($(this.el).find(".offUCheck").is(':checked')){
					if(this.eventDtValidation()){
						$(this.el).dialog("close");
						var $offOption = $(this.el).find('.off-selection').find("option:selected");
						var ind = 1;
						var dt = this.getActivityTime();
						var nomid = parseFloat($offOption.val());
						var nomdisp = $offOption.text();
						if(this.isMultiSelect){
							_.each(this.patient.collection.MultiSelectModel.get("selectedPatient"), function(patient){
								var id = patient.get("person_id");
								var cecd = patient.get("offunitevent").CECD;
								var nomid = nomid;
								var nomdisp = fixedEncodeURIComponent(nomdisp);
								patient.userPrefModel.savePref(id, ind, dt, cecd, nomid, nomdisp);
							});
							this.patient.collection.MultiSelectModel.clean();
						}
						else{
							var id = this.patient.get("person_id");
							var cecd = this.patient.get("offunitevent").CECD;
							var nomid = nomid;
							var nomdisp = fixedEncodeURIComponent(nomdisp);
							this.patient.userPrefModel.savePref(id, ind, dt, cecd, nomid, nomdisp);		
						}
					}
				}
				else{
					var attr = {
						"CNT" : 0,
						"EVENT_DT" : "",
						"EVENTDTDISP" : "",
						"STATUS" : "DRAFT",
						"LIST": []
					};

					var $el = $(this.el), that = this, ftString = "";
					_.each($el.find(".activity-freetext-input"), function(input){
						ftString+=$(input).val();
					})

					if (this.eventDtValidation()&&this.verifySNCharacters(ftString)) {
						attr.EVENT_DT=this.getActivityTime();
						attr.EVENTDTDISP=this.getActivityTime1();
						_.each($el.find('.tabDiv'), function(div){
							_.each($(div).find(".selection:enabled"), function(select){
								var nomenid=[];
								var nomendisp=[];
								_.each($(select).find("option:selected"), function(option){
									nomenid.push({"NOMID":parseFloat($(option).val())+".0"});
									nomendisp.push(jQuery.trim($(option).text()));
								})
								var item = that.setNomenActivity(select, nomenid, nomendisp.join());
								if(item){
									attr.LIST.push(item);
									attr.CNT++;
								}
							});
							_.each($(div).find(".activity-freetext-input"), function(input){
								if($(input).val()!==""){
									var item = that.setFreetextActivity(input);
									if(item){
										attr.LIST.push(item);
										attr.CNT++;
									}
								}
							});
						})
						if(this.isMultiSelect){
							this.setMultiSelectActivityModel(attr);
							this.patient.collection.MultiSelectModel.clean();
						}
						else{
							this.setActivityModel(attr);							
						}
					}
				$(this.el).dialog("close");			
				}
			},

			/**
			*get activity time of the format of dd-NNN-yyyy HH:mm:ss, use for time interval
			*/
			getActivityTime : function()
			{
				
				var start_event_dt = new Date(this.model.get("STARTDT"));
				var start_date = df.format(start_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				var end_event_dt = new Date(this.model.get("ENDDT"));
				var end_date = df.format(end_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				
				var event_date_dialog = start_event_dt;
				if (start_date == this.$(".event_dt").get(0).value)
				{
					event_date_dialog = start_event_dt;
				}
				else if (end_date == this.$(".event_dt").get(0).value)
				{
					event_date_dialog = end_event_dt;
				}
				
				event_date_dialog.setHours(this.$(".event_tm").get(0).value);
				event_date_dialog.setMinutes(this.$(".event_min").get(0).value);
				var event_date = DateFormatter.formatDate(event_date_dialog, "dd-NNN-yyyy HH:mm:ss").toUpperCase();
				return event_date;
			},

			/**
			*get activity time of the format of MM-dd-yyyy HH:mm, use for charting
			*/
			getActivityTime1 : function()
			{
				var start_event_dt = new Date(this.model.get("STARTDT"));
				var start_date = df.format(start_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				var end_event_dt = new Date(this.model.get("ENDDT"));
				var end_date = df.format(end_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				
				var event_dt = start_event_dt;
				if (start_date == this.$(".event_dt").get(0).value)
				{
					event_dt = start_event_dt;
				}
				else if (end_date == this.$(".event_dt").get(0).value)
				{
					event_dt = end_event_dt;
				}
							
				event_dt.setHours(this.$(".event_tm").get(0).value);
				event_dt.setMinutes(this.$(".event_min").get(0).value);
				var event_date1 = (df.format(event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR));
				return event_date1;
			},

			/**
			*get activity time javascript date object
			*/
			getActivityTime2 : function()
			{
				var start_event_dt = new Date(this.model.get("STARTDT"));
				var start_date = df.format(start_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				var end_event_dt = new Date(this.model.get("ENDDT"));
				var end_date = df.format(end_event_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				
				var event_dt = start_event_dt;
				if (start_date == this.$(".event_dt").get(0).value)
				{
					event_dt = start_event_dt;
				}
				else if (end_date == this.$(".event_dt").get(0).value)
				{
					event_dt = end_event_dt;
				}
				
				event_dt.setHours(this.$(".event_tm").get(0).value);
				event_dt.setMinutes(this.$(".event_min").get(0).value);
				var event_date2 = (event_dt);
				return event_date2;
			},

			/**
			 * Get nomen activity information
			 */
			setNomenActivity : function(event, event_nom_id, event_result) {
				var event_cd = parseInt($(event).closest('.tabDiv').attr('id'), 10);
				if (event_result.length) {
					return {
						"EVENTID" : 0.0,
						"NAME" : event_result,
						"CLINEVENTID" : 0.0,
						"EVENT_CD" : event_cd,
						"EVENT_DISP" : event_result,
						"EVENT_RESULT" : event_result,
						"FREETEXT": "",
						"NOMID": event_nom_id,
						"INPUTPRT": 0.0
					};
				}
				return false;
			},

			/**
			 * Get freetext activity information
			 */
			setFreetextActivity : function(ev) {
				var event_result = jQuery.trim($(ev).val());
				var event_cd = parseInt($(ev).closest('.tabDiv').attr('id'), 10);
				//NOMID structure is created,‘event_cd’ is negated and passed as the default value for the freetext to make it unique
				if (event_result.length) {
					return {
						"EVENTID" : 0.0,
						"NAME" : event_result,
						"CLINEVENTID" : 0.0,
						"EVENT_CD" : event_cd,
						"EVENT_DISP" : event_result,
						"EVENT_RESULT" : event_result,
						"FREETEXT": event_result,
						"NOMID": [
						{"NOMID" : -event_cd+"" }],
						"INPUTPRT": 0.0
					}
				}
				return false;
			},

			setActivityModel : function(attr) {
				// change activity attributes
				var newAttributes = {
					"CNT" : attr.CNT,
					"EVENT_DT" : attr.EVENT_DT,
					"EVENTDTDISP" : attr.EVENTDTDISP,
					"STATUS" : attr.STATUS,
					"LIST": attr.LIST
				};
				this.model.set(newAttributes);
			},

			setMultiSelectActivityModel : function(attr){
				var that = this;
				var timeIntervals = this.patient.collection.timeIntervals;
				var event_date = this.getActivityTime2();
				var timeSlots = _.select(timeIntervals, function(timeslot) {
					return (timeslot.startDate <= event_date && timeslot.endDate >= event_date);
				});
				_.each(timeSlots, function(timeSlot){
					_.each(that.patient.collection.MultiSelectModel.get("selectedPatient"), function(patient){
						// console.log(_.indexOf(timeIntervals, timeSlot));
						var view = that.newActivityView(_.indexOf(timeIntervals, timeSlot), patient);
						view.model.set(attr);					
					});					
				});
			},

			/**
			 * create and attach acitivtyview and model
			 */
			newActivityView : function(index, model){
				//initialize the model and view
				var activityModel = new ActivityModel, activityView;
				//set up model properties
				activityModel.patient = model;
				var timeIntervals = this.patient.collection.timeIntervals;
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
				model.view.activityViews[index]=activityView;
				//replace the DOM element of the table cell with new acitivtyView's DOM
				model.view.el.replaceChild(activityView.el, model.view.el.cells[index+4]);
				//set the previousActivityView if it is not null
				if(model.view.activityViews[index+1]!=null&&index+1<model.view.activityViews.length)
						model.view.activityViews[index].previousActivityView = model.view.activityViews[index + 1];
				return model.view.activityViews[index];
			},

			freetextActivityKeyPress : function(ev) {
				this.enableSubmit(ev);
				this.enableUnchartEvent(ev);
				this.toggleSelection(ev);
				if(ev.keyCode===13){
					this.nextTab();
				}
			},

			responseSelected : function(ev){
				this.enableSubmit(ev);
				this.nextTab();
			},

			nextTab : function(){
				if(this.isTabNav){
					var currentInd = parseInt(this.$('.tabs').find(".ui-tabs-selected a:first-child").attr("rel"), 10);
					if(currentInd === this.patient.get("location_activities").length-1){
						this.submitActivity();
					}
					else{
						this.$('.tabs').tabs('select', currentInd+1);
						this.$('.tabs').find(".ui-tabs-selected a:first-child").focus();
					}
				}
			},

			enableSubmit : function(ev){
				this.enableUnchartEvent(ev);
				$(":button:contains('"+$.i18n.t("SafetyAttendanceCommon.OK")+"')").attr("disabled",false);
			},

			toggleSubmit : function(ev){
				if($(ev.target).is(':checked')){
					$(":button:contains('"+$.i18n.t("SafetyAttendanceCommon.OK")+"')").attr("disabled",false);
					$(this.el).find(".tabs ").attr("disabled",true);
					$(this.el).find(".off-selection").show();
				}
				else{
					$(":button:contains('"+$.i18n.t("SafetyAttendanceCommon.OK")+"')").attr("disabled", true);	
					$(this.el).find(".tabs ").attr("disabled", false);
					$(this.el).find(".off-selection").hide();			
				}
			},

			enableUnchartEvent : function(ev){
				if(ev.target.className==="selection"){
					$(ev.target).closest('.tabDiv').find("h4").attr("disabled",false);
				}
				else if(ev.target.className==="activity-freetext-input"){
					$(ev.target).closest('.tabDiv').find("h4").attr("disabled",false);
				}
			},
			
			toggleSelection : function(ev){
				var $el = $(this.el), val = $(ev.target).val(), 
					$selection = $(ev.target).closest('.tabDiv').find('.selection');
				if (val.length) {
					$selection.attr("disabled", true);
				} else {
					$selection.attr("disabled", false);
				}
			},

			/**
			 * Callback event to change activity to activity in previous
			 * interval. Destroys View.
			 */
			changeToLastActivity : function(event) {
				var $el = $(this.el);
				// no activity from previous interval
				if (this.activityView.previousActivityView == null) {
					$el.dialog("close");
					return this;
				}
				if (this.eventDtValidation()) {
					var previousActivityModel = this.activityView.previousActivityView.model;
					// change activity attributes
					var newAttributes = {
						"CNT" : previousActivityModel.get("CNT"),
						"EVENT_DT" : this.getActivityTime(),
						"EVENTDTDISP" : this.getActivityTime1(),
						"STATUS" : "DRAFT",
						"LIST": []
					};
					_.each(previousActivityModel.get("LIST"), function(event){
						var nomenidList = _.clone(event.NOMID);
						if(previousActivityModel.get("STATUS")==="SAVED"||previousActivityModel.get("STATUS")==="INERROR"){
							var nomenid=[];
							_.each(nomenidList, function(nomen){
								nomenid.push({"NOMID":parseFloat(nomen.NOMID)+".0"});
							})
							if(nomenid.length){
								if(nomenid[0]==="0.0"){
									nomenidList=[];
								}
								else{
									nomenidList = nomenid;
								}
							}
							else{
									nomenidList=[];							
							}
						}
						else{
							nomenidList=event.NOMID;
						}

						newAttributes.LIST.push({
							"EVENTID" : 0.0,
							"NAME" : event.NAME,
							"CLINEVENTID" : 0.0,
							"EVENT_CD" : event.EVENT_CD,
							"EVENT_DISP" : event.EVENT_DISP,
							"EVENT_RESULT" : event.EVENT_RESULT,
							"FREETEXT": fixedEncodeURIComponent(event.FREETEXT),
	
							"NOMID": nomenidList,
							"INPUTPRT": 0.0
						});

					})
					this.model.set(newAttributes);
					// destroy dialog
					$el.dialog("close");
				}
			},

			/**
			 * Callback event to unchart activity. Destroys View.
			 */
			unchartActivity : function(event) {
				var model = this.model;
				var status = model.get("STATUS").toUpperCase();

				if (status === "SAVED" || status === "INERROR") {
					model.inError();
				} else {
					_.each(model.get("LIST"), function(event){
						event.EVENT_RESULT="";
					})
					model.set({
						"CNT" : 0,
						"STATUS" : "NONE"
					});
				}

				// destroy dialog
				$(this.el).dialog("close");
			},

			/**
			* Callback event to unchart event
			*/
			unchartEvent : function(event){
				var $tabDiv = $(event.target).closest('.tabDiv');
				$tabDiv.find('.activity-freetext-input').val("");
				$tabDiv.find('.selection').prop("selectedIndex",-1);
				$tabDiv.find('.selection').attr("disabled", false);
				$tabDiv.find('.unchart-event').attr("disabled", true);
				this.enableSubmit(event);
			},

			/**
			 * Keyup event
			 */
			eventMinuteValidation : function(event) {
				var min = $(".event_min").get(0).value;
				min = min.replace(/[^0-9]/g, '');
				if (min > 59) {
					min= 59;
				}
				$(".event_min").get(0).value =min;
			},
			

			/**
			 * Check validation of event date and time
			 */
			eventDtValidation : function() {
				var start_dt = new Date(this.model.get("STARTDT")), end_dt = new Date(this.model.get("ENDDT")), inputDate = new Date(start_dt);
				var start_dt_disp = df.format(start_dt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR); 
				var end_dt_disp = df.format(end_dt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
				//Check whether the user selected date is start date or end date?
				if( df.format(end_dt, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR) == this.$(".event_dt").get(0).value){
					inputDate = new Date(end_dt);
				}
				else{
					inputDate = new Date(start_dt);
				}
				//Set the user selected time to the input date variable
				inputDate.setHours(this.$(".event_tm").get(0).value);
				inputDate.setMinutes(this.$(".event_min").get(0).value);
				if (inputDate < start_dt)
				{				
					var start_dt = this.model.get("STARTDT");
					var r = confirm($.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE")
							+ start_dt_disp
							+ $.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE_INSTEAD"));
					if (r == true) {
						var start_date = df.format(start_dt,
								mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), start_hr = DateFormatter
								.formatDate(start_dt, "HH"), start_min = DateFormatter
								.formatDate(start_dt, "mm");
						this.$(".event_dt").get(0).value = start_date;
						this.$(".event_tm").get(0).value = start_hr;
						this.$(".event_min").get(0).value = start_min;
						return true;
					} else {
						return false;
					}
				} 
				else if (inputDate > end_dt)				
				{
					var end_dt = this.model.get("ENDDT");
					var r = confirm($.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE")
							+ end_dt_disp
							+ $.i18n.t("ModifiableActivityDialogHandlebar.ENTERED_TIME_RANGE_INSTEAD"));
					if (r == true) {
								var end_date = df.format(end_dt,
								mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR), end_hr = DateFormatter
								.formatDate(end_dt, "HH"), end_min = DateFormatter
								.formatDate(end_dt, "mm");
						this.$(".event_dt").get(0).value = end_date;
						this.$(".event_tm").get(0).value = end_hr;
						this.$(".event_min").get(0).value = end_min;
						return true;
					} else {
						return false;
					}
				}
				return true;
			},

			/**
			 * Verifies if the string contains a special character. Returns true
			 * if the string is valid else it returns false.
			 * 
			 * @param {String}
			 *            strInputString The string that is going to be
			 *            verified.
			 * @return {Boolean}
			 */
			verifySNCharacters : function(strInputString) {
				var blnStatus = true;
				var strChars = "@#$%^&*()+=[]\\\';,{}|\"<>~_\n";
				var strCharacter = "";
				var strErrorMessage = "";

				try {
					// Loop through the characters in the string.
					for ( var intCounter = 0; intCounter < strInputString.length; intCounter++) {
						// Reset variables.
						strCharacter = "";
						strErrorMessage = "";

						if (strChars.indexOf(strInputString.charAt(intCounter)) != -1) {
							strCharacter = strInputString.charAt(intCounter);
							// Build error message.
							strErrorMessage += strCharacter;
							alert($.i18n.t("ModifiableActivityDialogHandlebar.FREE_TEXT_INPUT_IN_CHARTING")  
							+ strErrorMessage);
							return false;
						}
					}
				} catch (error) {
					alert(error.message, "verifySNCharacters", "",
							strInputString);
					blnStatus = false;
				}
				return blnStatus;
			},

			resetIsMultiSelect : function(){
				if(this.model.get("STATUS")!=="NONE"){
					this.isMultiSelect = false;
				}
			},

			/**
			 * Remove dialog from DOM
			 */
			removeDialog : function() {
				$(this.el).empty().remove();
				this.patient = null;
				this.activityView = null;
				this.model = null;
			}

		});
