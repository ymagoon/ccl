Ext.define("fix.me.some.radio.buttons", {
	override: "Ext.field.Radio",
	getValue: function() {
		return this._value;
	}
});

Ext.define("fix.me.some.check.boxes", {
	override: "Ext.field.Checkbox",
	getSameGroupFields: function() {
	    return this.up("formpanel").query("field[name=" + this.getName() + "]");
	}
});

Ext.define("give.me.a.pop.to", {
	override: "Ext.NavigationView",

	popTo: function(viewClass) {
		var howManyToPop = 1;
		var kids = this.getInnerItems();
		for (var i = kids.length; i > 0; i--) {
			if (kids[i - 1] instanceof viewClass) {
				howManyToPop = kids.length - i;
				break;
			}
		}

		this.pop(howManyToPop);
	}
});

Ext.ns("univnm.st.Overrides");