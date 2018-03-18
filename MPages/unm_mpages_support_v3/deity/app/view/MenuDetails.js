Ext.define("MPAGE.view.MenuDetails", {
	extend: "Ext.tab.Panel",
	alias: "widget.menu_details",
	tabPosition: "top",
	removePanelHeader: true,
	requires: ["MPAGE.store.Section"],

	constructor: function(config) {
		this.store = Ext.StoreManager.get("Section");
		this.tabItems = [];
		this.callParent([config]);

		this.store.on({
			load: this.onMenuChange,
			scope: this
		});
	},

	onMenuChange: function(store) {
		this.tabItems.forEach(function(p) {
			this.remove(p);
		}, this);
		this.tabItems = [];
		store.data.items.forEach(function(section) {
			this.addMenuSection(section);
		}, this);
		this.setActiveTab(this.tabItems[0]);
	},

	addMenuSection: function(section) {
		this.tabItems.push(this.add({
			title: section.data.name,
			xtype: "entity_main_grid",
			record: section,
			preventHeader: true
		}));
	}
});