/**
 * Patient View
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache,ActivityModel,ActivityView
 
 * File "translation.safety.json"
					Namespaces used: 
						"LocationAndImageHandlebar",
						"PatientInfoHandlebar",
						"Charting".
 */
var PatientView = Backbone.View.extend({

	/**
	 * HTML Tag
	 */
	tagName : "tr",

	/**
	 * CSS class name
	 */
	className : "patient-row",

	/**
	 * Array of time intervals
	 */
	timeIntervals : [],

	/**
	 * Array of ActivityView(s)
	 */
	activityViews : [],
	
	/**
	 * Handlebar template for rendering html
	 */
	locationAndImgTemplate : TemplateLoader.compileFromFile(template_static_path + "templates/_LocationAndImage.handlebar.html"),
	/**
	 * multi select view
	 */
	selectView : null,
	/**
	 * image column view
	 */
	imageView : null,

	/**
	 * Handlebar template for rendering html
	 */
	selectTemplate : TemplateLoader.compileFromFile(template_static_path + "templates/_MultiSelect.handlebar.html"),

	/**
	 * Handlebar template for rendering html
	 */
	basicInfoTemplate : TemplateLoader.compileFromFile(template_static_path + "templates/_PatientInfo.handlebar.html"),
	
	/**
	 * Basic Info Column View
	 */
	basicInfoView : null,
	
	/**
	 * Handlebar template for rendering html
	 */
	riskTemplate : TemplateLoader.compileFromFile(template_static_path + "templates/_PatientRisk.handlebar.html"),
	
	/**
	 * Risk column view
	 */
	riskView : null,
	
	/**
	 * Event handlers
	 */
	events:{
		"click .activity-view-new" : "newActivityView",
		"change .offUCheck" : "unCheckOffU",
		"click .patient-select" : "selectActivity",
		"click .addedRemove" : "removeAddedPatient"
	},

	/**
	 * Initialize View.  Creates subviews.  Renders on PatientCollection's "change:timeInterval" event.
	 */
	initialize : function() {
		_.bindAll(this);

		this.collection.bind("change:timeIntervals", this.render);
		this.model.bind("change:image_data",this.renderImageView);
		this.model.userPrefModel.bind("change:offunitstatus", this.reRender);
		this.model.bind("changePatientActivities",this.render);
		this.collection.MultiSelectModel.bind("change", this.reRenderSelect);
	
		this.registerHandlebarPartials();
		
		this.selectView = this.createSelectView();
		this.imageView = this.createImageView();
		this.basicInfoView = this.createBasicInfoView();
		this.riskView = this.createRiskView();
		
		//one-to-one model-view relationship
		this.model.view = this;
		
		this.model.bind("destroy",this.removeView,this);

		this.render();
	},

	/**
	 * Render View HTML
	 * @returns {PatientRiskView} this view
	 */
	render : function() {
		var $el = $(this.el);
		
		//remove all cells from row
		this.$("td").detach();
		//attach each patient info table cell to main view
		$el.append(this.selectView);
		$el.append(this.imageView);
		$el.append(this.basicInfoView);
		$el.append(this.riskView);

		//add activities to time interval slots
		if(!_.isEmpty(this.collection.timeIntervals)) {
			this.createActivityViews();
			this.attachActivityViews();
		}
		if(this.model.userPrefModel.get("offunitstatus").isoffunit){
			$el.find("[class^=activity-view]").attr("disabled", true);
			$el.find("[class^=patient-select]").attr("disabled", true);
			this.reRenderSelect();
		}
		else{
			$el.find("[class^=activity-view]").attr("disabled", false);
			$el.find("[class^=patient-select]").attr("disabled", false);
			this.reRenderSelect();
		}
		return this;
	},

	reRender : function(){
		var $el = $(this.el);
		this.imageView = this.createImageView();
		this.$(".patient-image").replaceWith(this.imageView);
		if(this.model.userPrefModel.get("offunitstatus").isoffunit){
			$el.find("[class^=activity-view]").attr("disabled", true);
			$el.find("[class^=patient-select]").attr("disabled", true);
			this.reRenderSelect();
		}
		else{
			$el.find("[class^=activity-view]").attr("disabled", false);
			$el.find("[class^=patient-select]").attr("disabled", false);
			this.reRenderSelect();
		}
	},

	reRenderSelect : function(){
		var $el = $(this.el);
		this.selectView = this.createSelectView();
		this.$(".multi-select").replaceWith(this.selectView);		
	},
	
	/**
	 * Register Handlebar Partials for view
	 */
	registerHandlebarPartials : function(){
		var that = this;
		Handlebars.registerPartial('fallRisk',that.fallRiskTemplate());
		Handlebars.registerPartial('suicideRisk',that.suicideRiskTemplate());
		Handlebars.registerPartial('suicideImg',that.suicideImgTemplate());
		Handlebars.registerPartial('noRisk',that.noRiskTemplate());
	},
	
	/**
	 * creates multi select view
	 */
	 createSelectView : function(){
		var el = $("<td class='multi-select'></td>"),
				that = this,
				model = this.model,
				userPrefModel = this.model.userPrefModel,
				view;
		var isSelected = _.some(this.collection.MultiSelectModel.get("selectedPatient"), function(patient){
			if(!patient.userPrefModel.get("offunitstatus").isoffunit)
				return patient.get("person_id") === that.model.get("person_id");
			});
		
		view = {
			selected : isSelected,
			isAdded : model.get("isAdded")===undefined?false:true,
			isoffunit : userPrefModel.get("offunitstatus").isoffunit
		};
		
		$(el).html(this.selectTemplate(view));
		$(el).i18n();
		return el;
	 },
	
	/**
	 *constructs patient image view
	 */
	constructImageView : function(){
		var that = this,
				model = this.model,
				el = $("<td class='patient-image'></td>"),
				userPrefModel = this.model.userPrefModel,
				offunitstartdt = (userPrefModel.get("offunitstatus").offunitstartdt === undefined || userPrefModel.get("offunitstatus").offunitstartdt == "") ? "" : df.format(userPrefModel.get("offunitstatus").offunitstartdt, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_MMM_4YEAR),
				view;
				view = {
					src : that.getImageViewSrc(),
					nurse_unit : model.get("nurse_unit"),
					room: model.get("room"),
					bed: model.get("bed"),
					isoffunit : userPrefModel.get("offunitstatus").isoffunit,
					offunitdisp : userPrefModel.get("offunitstatus").nomdisp,
					
					offunitstartdt : offunitstartdt,
					isAdded : model.get("isAdded")===undefined?false:true
				};
		if(model.get("room")!="")
			view.room = "/ "+view.room;
		if(model.get("bed")!="")
			view.bed = "/ "+view.bed;
		$(el).html(this.locationAndImgTemplate(view));
		$(el).i18n();
		
		return el;
	},
	
	/**
	 * creates patient image view
	 */
	createImageView : function(){
		return this.constructImageView();
	},
	
	/**
	 * Render image view and replace old view with new view
	 */
	renderImageView : function(){
		var el = this.constructImageView();
		$(this.imageView).replaceWith(el);
		this.imageView = el;
		return el;
	},
	
	/**
	 * Get image source using 64-bit jpeg data string
	 * @return {String} image src
	 */
	getImageViewSrc : function(){
		//return patient image if available, if not, return default image
		return this.model.get("image_data");
	},
	
	/**
	 * creates basic patient info view
	 * @return {Node} basic info view element
	 */
	createBasicInfoView : function(){
		var bhinfo = this.collection.BhInfoModel.get("APP_PREF");
		var el = $("<td class='patient-basic-info'></td>");
		var model = this.model;
		var birth_dt_js = model.get("birth_dt_js");
		birth_dt_js = birth_dt_js.length > 1 ? 
								birth_dt_js.substring(0, 6) + birth_dt_js.substring(8, 10)
								: birth_dt_js;
		var partials = {
			tabName:bhinfo.PCTABNM.length ? " /FIRSTTAB=^" + bhinfo.PCTABNM + "^" : "",
			gender:model.get("gender_display"),
			age:model.get("age_display"),
			birth_dt_js:birth_dt_js,
			observation_level:model.get("observation_level").length ? model.get("observation_level") : "--"
		};
		var context = model.toJSON();
		jQuery.extend(context,partials);
		$(el).html(this.basicInfoTemplate(context));
		$(el).i18n();
		return el;
	},
	
	/**
	 * creates risk view
	 */
	createRiskView : function(){
		var el = $("<td class='patient-risk'></td>");		
		$(el).html(this.riskTemplate(this.model.toJSON()));
		return el;
	},
	
	/**
	 * Generate Fall Risk Partial for template
	 */
	fallRiskTemplate:function(){
		if(this.model.get("fall_risk").length){
			return "<p class='fallRisk'><span class='field'>Fall Risk</span></p>";
		}
		else{
			return "";
		}
	},
	
	/**
	 * Generate Suicide Risk Partial for template
	 */
	suicideRiskTemplate:function(){
		if(this.model.get("suicide_risk").length){
			return "<p class='suicideRisk'>{{>suicideImg}}<span class='field'>Suicide Risk: </span><span class='risk-value'>{{suicide_risk}}</span></p>";
		}
		else{
			return "";
		}
	},
	
	/**
	 * Generate Suicide Image partial for template
	 */
	suicideImgTemplate:function(){
		var suicide_risk = this.model.get("suicide_risk_disp");
		if(suicide_risk === "2"){
			return "<img class='high-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.HIGH-RISK-ICON") + "'>";//leftout
		}
		else if(suicide_risk === "1"){
			return "<img class='medium-risk-icon' src= '" + $.i18n.t("SuicideImgTemplate.MEDIUM-RISK-ICON") + "'>";
		}
		else{
			return "";
		}
	},

	/**
	 * Generate No Risk partial for template
	 */
	noRiskTemplate:function(){
		if(!this.model.get("fall_risk").length && !this.model.get("suicide_risk").length){
			return "<p class='field'>--</p>";
		}
		else{
			return "";
		}
	},

	/**
	 * Creates ActivityView(s). Should only be called on initialization and if time intervals change.
	 */
	createActivityViews : function() {
		var returnAr = [];
		var activity = {},
				start,
				end;
		var index = 0;
		this.activityViews = [];
		this.timeIntervals = this.collection.timeIntervals;
		var timeIntervals = this.timeIntervals;
		for(var i = 0, l = timeIntervals.length; i < l; i++) {
			start = timeIntervals[i].startDate;
			end = timeIntervals[i].endDate;
			
			returnAr = this.model.activities.newestInRange(start, end, index);
			if(returnAr){
				activity = returnAr[0];
				index = returnAr[1];
			}
			else{
				activity = null;
			}
			//most recent time and no activity
			if(i === 0 && _.isEmpty(activity)) {
				this.activityViews.push(null);
			}
			else {
				//no activity
				if(_.isEmpty(activity)) {
					this.activityViews.push(null);
				}
				//view already exists for model
				else if(activity.view){
					this.activityViews[this.activityViews.length] = activity.view;
				}
				//create new view for model
				else {
					var activityView = new ActivityView({
						model : activity,
						modifiable : false,
						patient : this.model
					});
					this.activityViews.push(activityView);
				}
			}
		}

		//link previous activity to each activity
		for(i = 0, l = this.activityViews.length; i < l; i++) {
			if(this.activityViews[i] !== null && i + 1 < l) {
				this.activityViews[i].previousActivityView = this.activityViews[i + 1];
			}
		}
	},

	activityViewExistsForModel : function(activityModel){
		return _.any(this.activityViews,function(activityView){
			return activityView.model.cid == activityModel.cid;
		});
	},

	/**
	 * Attach all ActivityView(s) to PatientView.
	 */
	attachActivityViews : function() {
		//grab each activity node and attach it patient node
		for(var i = 0, l = this.activityViews.length; i < l; i++) {
			if(this.activityViews[i] == null) {
				var html = "<td class='activity-view-new'><div class='activity-view-wrap-new' id=\""+i+"\"> " + $.i18n.t("Charting.CLICK_TO_ADD") + "</div></td>"
			
				$(html).appendTo(this.el);
			}
			else {
				$(this.activityViews[i].el).appendTo(this.el);
			}
		}
	},
	
	/**
	 * create and attach acitivtyview and model
	 */
	newActivityView : function(event){
		var index;
		//if clicked area is td, get the id if its child div
		if(event.target.nodeName=="TD")
			index = parseInt(event.target.firstChild.id);
		//else if clicked area is the div, get its id directly
		else
			index = parseInt(event.target.id);
		//initialize the model and view
		var model = this.model, activityModel = new ActivityModel, activityView;
		//set up model properties
		activityModel.patient = model;
		var timeIntervals = this.collection.timeIntervals;
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
		this.activityViews[index]=activityView;
		//replace the DOM element of the table cell with new acitivtyView's DOM
		this.el.replaceChild(activityView.el, this.el.cells[index+4]);
		//set the previousActivityView if it is not null
		if(this.activityViews[index+1]!=null&&index+1<this.activityViews.length)
				this.activityViews[index].previousActivityView = this.activityViews[index + 1];
		//launch the dialog
		this.activityViews[index].launchDialog();
	},

	unCheckOffU : function(event){
		var dateTimeDialog = DateTimeDialogViewSingleton.createDateTimeDialogView(this.model);
		dateTimeDialog.open(event.target);
	},

	selectActivity : function(event){
		var $target = $(event.target);
		var that = this;
		if($target.hasClass("selected")){
			var list = _.filter(this.collection.MultiSelectModel.get("selectedPatient"), function(patient){
				return patient.get("person_id") !== that.model.get("person_id");
			});
			this.collection.MultiSelectModel.set({selectedPatient: list});
		}
		else{
			var list = this.collection.MultiSelectModel.get("selectedPatient");
			list.push(this.model);
			this.collection.MultiSelectModel.trigger("change");
		}
	},

	removeAddedPatient : function(){
		var r = confirm($.i18n.t("LocationAndImageHandlebar.DO_YOU_WANT_TO_REMOVE") + this.model.get("name") + $.i18n.t("LocationAndImageHandlebar.FROM_THE_LIST"));//leftout
		if (r === true) {
			var that = this;
			// console.log(this.collection);
			// console.log(this.collection.patientListsModel.get("addedPatients"));
			this.collection.patientListsModel.set({
				addedPatients : _.without(that.collection.patientListsModel.get("addedPatients"), that.model)
				}
			);
			//console.log(this.collection.patientListsModel.get("addedPatients"));
			this.removeView();
			this.collection.remove(this.model, {
				silent : true
			}); 
			//console.log(this.collection);
			this.updateWindowStorage();
			return true;
		} else {
			return false;
		}
	},

	updateWindowStorage : function(){
		try{
			var that = this;
			var addedPatient = WindowStorage.get("AddedPatients");
			if(addedPatient!=="undefined"){
				addedPatient = jQuery.parseJSON(addedPatient);
				var ptListModel = this.collection.patientListsModel;
				// console.log("addedPatient");
				// console.log(addedPatient);
				var foundPtlist = _.detect(addedPatient, function(ptlist){
					// console.log("ptlist.selectedList");
					// console.log(ptlist.selectedList);
					// console.log('ptListModel');
					// console.log(ptListModel);
					return _.isEqual(ptlist.selectedList, ptListModel.get("selectedList"));
				});
				// console.log("foundPtlist");
				// console.log(foundPtlist);
				if(foundPtlist){
					addedPatient = _.without(addedPatient, foundPtlist);
					// console.log("_.without");
					// console.log(addedPatient);
					addedPatient.push(ptListModel);
					// console.log("push");
					// console.log(addedPatient);
					WindowStorage.set("AddedPatients", JSON.stringify(addedPatient));
				}
			}
			// console.log("finally");
			// console.log(jQuery.parseJSON(WindowStorage.get("AddedPatients")));
			// console.log("_________________________________________________");
			// console.log(WindowStorage.get("AddedPatients"));
		}
		catch(err){
			alert(err.message);
		}
	},
	/**
	 * removes view and any associated views from DOM
	 */
	removeView : function(){
		this.collection.unbind("change:timeIntervals", this.render);
		this.model.unbind("change:image_data",this.renderImageView);
		this.model.userPrefModel.unbind("change:offunitstatus", this.reRender);
		this.collection.MultiSelectModel.unbind("change", this.reRenderSelect);
		this.model.unbind("destroy",this.removeView,this);
		this.selectView = null;
		this.imageView = null;
		this.basicInfoView = null;
		this.riskView = null;
		this.activityViews = [];
		$(this.el).empty().remove();
	}

});
