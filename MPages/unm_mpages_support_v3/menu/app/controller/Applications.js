Ext.define("Ostrich.controller.Applications", {
	extend: "Ext.app.Controller",

	refs: [
		{
			ref: "applistings",
			selector: "applistings"
		},
		{
			ref: "appInfo",
			selector: "appinfo"
		}
	],

	init: function() {
		this.control({
			applistings: {
				itemdblclick: this.open_app,
				selectionchange: this.onIconSelect,
				// itemclick: this.onIconSelect,
				filtering: Ext.Function.createBuffered(this.filtering, 120),
				grouper: this.reflowApps
			}
		});

		Ext.StoreManager.map.Applications.getDeferred().then(function() {
			Ext.StoreManager.map.Applications.fireEvent("refresh", Ext.StoreManager.map.Applications);
		});
		this.selection = false;
	},

	open_app: function(view, record) {
		var ccl = false, entry = record.data, url;
		if (entry.url) {
			if (entry.url && entry.url.indexOf("/") == -1) {
				ccl = true;
			}
			url = entry.url;
		} else {
			if (!entry.params) entry.params="";
			url = new Ext.Template(
				'../{app_name}/index.html?{params}'
			).apply(entry);
		}

		if (ccl) {
			C.logStat("access", entry.app_name, function() {
				CCLLINK(url, entry.params, 1);
			});
		} else {
			window.location.href=url;
		}
	},

	onIconSelect: function(dv, selections) {
		var selected, me = this;
		if (selections instanceof Ostrich.model.Application) {
			selections = [selections];
		}
		if (selections.length == 1) {
			selected = selections[0];
		} else {
			return;
		}
		// debugger;
		if (selected == this.selection) {
			this.open_app(null, selected);
		}
		this.getAppInfo().loadRecord(selected);
		this.getAppInfo().expand();
		this.selection = selected;

		var temp = this.onIconSelect;
		this.onIconSelect = Ext.emptyFn;
		setTimeout(function() { me.onIconSelect = temp; }, 1);
	},

	filtering: function(filtertext) {
		var store = Ext.StoreManager.map.Applications;
		var terms = filtertext.toLowerCase().split(/ /);
		store.clearFilter();
		store.filter({
			filterFn: function(v) {
				return terms.every(function(term) {
					return univnm.ObjectLib.getKeys(v.data).some(function(key) {
						return (v.data[key] || "").toString().toLowerCase().indexOf(term) > -1;
					});
				});
			}
		});
	},

	reflowApps: function(a) {
		var store = Ext.StoreManager.map.Applications;
		store["organize_by_" + a].call(store, store);
	}
});