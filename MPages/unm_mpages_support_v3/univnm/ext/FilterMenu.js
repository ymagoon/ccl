Ext.define('univnm.ext.FilterMenu', {
	extend: 'Ext.menu.Menu',
	alias: 'widget.filtermenu',

	constructor: function(config) {
		var store;
		config.displayField = config.displayField || "friendlyname";
		config.groupField = config.groupField || "sort_order";
		config.recordField = config.recordField || "serviceFilter";
		config.selectedField = config.selectedField || "selectedField";
		config.grouped = typeof config.grouped == "boolean"? config.grouped: true;

		if (config.store) {
			store = Ext.data.StoreManager.get(config.store);
		} else {
			console.log("Be sure to attach a store before this is rendered. Items cannot be directly attached at runtime.");
			throw new Error("Can't pass static items. Make yourself a memory store containing the items, or use an ordinary xtype:menu.");
		}

		this.callParent([config]);
		this.store = store;

		setTimeout((function() {
			if (typeof store != "object") {
				throw new Error("Trouble's afoot: config.store == " + JSON.stringify(store));
			} else {
				if (!this.ownerItem) this.ownerItem = this.up("component");
				var loading = store.isLoading();
				this.ownerItem.setDisabled(loading);
				if (loading) {
					store.on({
						load: (function() {
							this.ownerItem.setDisabled(false);
						}).bind(this),
						single: true
					})
				}
			}
		}).bind(this), 100);
	},

	initComponent: function() {
		var me = this;

		me.callParent(arguments);
	},

	beforeRender: function () {
		var me = this, store = this.store, ctItems = store.count();
		var vp = Ext.ComponentQuery.query("viewport").first();
		var menuItemHeight = me.menuItemHeight? me.menuItemHeight : ((!!me.ownerItem && !!me.ownerItem.el && !!me.ownerItem.getHeight)? me.ownerItem.getHeight(): 28);
		var menuItemWidth = (!!me.menuConfig && !!me.menuConfig.width)? me.menuConfig.width: 200;
		var vspace = Math.floor(vp.height / menuItemHeight) - 2; // N menuitems fit in 1 viewport height
		var cols = Math.ceil(ctItems / vspace);

		this.removeAll();
		this.menuItemCount = 0;

		// if only one column needed, or multiple columns still require scrolling
		if (vp.width / cols < menuItemWidth || cols == 1) {
			// graft menu config
			Ext.apply(me, me.menuConfig);

			if (!me.grouped) {
				store.data.items.forEach(function(menuitem) {
					me.add(me.$menuItem(menuitem));
				});
			} else {
				store.data.items.map(function(service, ixRow) {
					return service.data[this.displayField].substr(0,1).toUpperCase();
				}, this).getUnique().sort().forEach(function(fl) {
					var menu = {
						text: fl,
						menu: {
							xtype: "menu",
							items: []
						}
					};

					store.data.items.filter(function(r) {
						return r.data[this.displayField].substr(0,1).toUpperCase() == fl;
					}, this).forEach(function(service) {
						// me.add(me.$menuItem(service));
						menu.menu.items.push(me.$menuItem(service));
					}, this);

					me.add(menu);
				}, this);
			}
		} else {
			// we embed a container in the visible menu, and then multiple menus in the container's columns
			vspace = Math.floor(ctItems / cols) + 1;
			var container = {
				xtype: "panel",
				width: menuItemWidth * cols,
				height: (vspace + 0.25) *  menuItemHeight, // close enough (space for borders & padding)
				border: 0,
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				items: []
			}, menu, ixRecord, ixCol, service;
			for (ixCol = 0; ixCol < cols; ixCol++) {
				menu = Ext.applyIf({
					xtype: "menu",
					floating: false,
					border: false,
					items: [],
					flex: 1
				}, me.menuConfig); // we apply specified config to real menus, not the placeholder
				for (ixRecord = 1; ixRecord <= vspace; ixRecord++) {
					service = store.getAt(ixCol * vspace + ixRecord - 1);
					if (!service) break; // the last column may have fewer items than the rest
					menu.items.push(me.$menuItem(service));
					me.menuItemCount++;

					var ixNext = ixCol * vspace + ixRecord;
					if (store.getAt(ixNext) && store.getAt(ixNext).get(me.groupField) > service.get(me.groupField) ) {
						// insert menu sep
						menu.items.push({
							xtype: "menuseparator"
						});
					}
				}
				container.items.push(menu);
			}
			me.add(container);
		}
		// debugger;
		// this.ownerCt.doLayout();
	},

	tests: {
		"Has Selectable Items": {
			source: "query",
			query: "filtermenu",
			fn: function(result) {
				this.beforeRender();
				result(this.menuItemCount > 0);
			}
		},
		"Has Source Data": {
			source: "query",
			query: "filtermenu",
			fn: function(success) {
				success(this.store instanceof Ext.data.Store && this.store.data.length > 0);
			}
		}
	},

	$menuItem: function(record) {
		return Ext.apply({
			text: record.get(this.displayField),
			record: record
			// checked: record.get(this.selectedField)
		}, record.data, this.menuItemConfig);
	}
});