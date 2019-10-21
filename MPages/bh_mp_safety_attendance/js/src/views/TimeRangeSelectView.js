/**
 * Time Range Select View
 * @author Chao Shi - CS024183
 * @requires Backbone,Underscore,jQuery,Mustache
 * File "translation.safety.json"
					Namespaces used: 
						"TimeRange"
 */
var TimeRangeSelectView = Backbone.View.extend({

	/**
	 * Handlebars template for rendering HTML
	 */
	template : TemplateLoader.compileFromFile(template_static_path + "templates/_TimeRangeSelect.handlebar.html"),
	
	/**
	 * Event Handlers
	 */
	events:{
		"change .time-range-select":"setTimeRange"
	},
	
	/**
	 * Initialize View.  Renders View on TimeRangeSelectModel's "change" event.
	 */
	initialize:function() {
		_.bindAll(this);
		//disable view whenever ccl is being queried
		this.model.bind("started-loading",this.disable);
		this.model.bind("finished-loading",this.enable);
		
		this.render();
		//initially disable
		this.disable();
	},

	/**
	 * Render View HTML
	 * @returns {TimeRangeSelectView} this view
	 */
	render:function(){
		var view = {RANGES : this.model.getTimeRangeOptions()};
		$(this.el).html(this.template(view));
		$(this.el).i18n();
		return this;
	},

	/**
	 * Callback function for setting time range.
	 */
	setTimeRange:function(){
		if(_.isEmpty(this.model)){
			return false;
		}
		this.select = this.$(".time-range-select",this.el)[0];
		this.option = parseInt(this.select.options[this.select.selectedIndex].value, 10);
		this.model.resetIntervalValue = false;
		this.model.setTimeRange(this.option);
		this.model.createTimeIntervals(this.model.selectedInterval);
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
	},
	
	/**
	 * Remove View from DOM
	 */
	remove: function() {
		$(this.el).empty().remove();
		this.model.bind("started-loading",this.disable);
		this.model.bind("finished-loading",this.enable);
	}
});
