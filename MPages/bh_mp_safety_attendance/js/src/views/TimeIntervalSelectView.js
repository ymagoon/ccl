/**
 * Time Interval Select View
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache
 * File "translation.safety.json"
					Namespaces used: 
						"TimeIntervalSelectHandlebar".
 
 */
var TimeIntervalSelectView = Backbone.View.extend({

	/**
	 * Handlebars template for rendering HTML
	 */
	template : TemplateLoader.compileFromFile(template_static_path + "templates/_TimeIntervalSelect.handlebar.html"),
	
	/**
	 * Event Handlers
	 */
	events:{
		"change .time-interval-select":"setTimeInterval"
	},
	
	/**
	 * Initialize View.  Renders View on TimeIntervalSelectModel's "change" event.
	 */
	initialize:function() {
		_.bindAll(this);
		
		this.model.bind("change:timeIntervalOptions", this.render);
		this.model.bind("change:timeIntervals",this.displaySelected);
		//disable view whenever ccl is being queried
		this.model.bind("started-loading",this.disable);
		this.model.bind("finished-loading",this.enable);
		
		this.render();
		//initially disable
		this.disable();
	},

	/**
	 * Render View HTML
	 * @returns {TimeIntervalSelectView} this view
	 */
	render:function(){
		var view = {INTERVALS : this.model.getTimeIntervalOptions()};
		$(this.el).html(this.template(view));
		$(this.el).i18n();
		for(var i=0; i< this.model.getTimeIntervalOptions().length; i++){
			var option = $(".time-interval-select option")[i];
			if(option.value>60){
				option.text=(option.value/60).toString()+ $.i18n.t("TimeIntervalSelectHandlebar.HOURS");
			}
			else if(option.value==60){
				option.text=(option.value/60).toString()+ $.i18n.t("TimeIntervalSelectHandlebar.HOUR");
			}
			else{
				option.text=option.value.toString()+ $.i18n.t("TimeIntervalSelectHandlebar.MIN");
			}
		}
		return this;
	},

	/**
	 * Callback function for setting time interval.
	 */
	setTimeInterval:function(){
		if(_.isEmpty(this.model)){
			return false;
		}
		this.select = this.$(".time-interval-select",this.el)[0];
		this.option = parseInt(this.select.options[this.select.selectedIndex].value);
		this.model.createTimeIntervals(this.option);
	},

	/**
	 * Keeps selected list choice up to date with the model
	 */
	displaySelected : function(){
		var selectedInterval = this.model.selectedInterval;
		var select = this.$(".time-interval-select",this.el)[0];		
		for(var i = 0,l = select.options.length;i<l;i++){
			if(select.options[i].value == selectedInterval){
				select.selectedIndex = i;
			}
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
