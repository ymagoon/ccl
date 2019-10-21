var MultiSelectModel = Backbone.Model.extend({
	defaults:{
		"selectedPatient" : []
	},

	initialize : function() {
		_.bindAll(this);
	},

	clean : function(){
		this.set({
			selectedPatient : []
		});
	}
});