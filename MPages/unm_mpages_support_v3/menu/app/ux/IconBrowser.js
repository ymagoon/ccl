/**
 * @class Ext.chooser.IconBrowser
 * @extends Ext.view.View
 * @author Ed Spencer
 *
 * This is a really basic subclass of Ext.view.View. All we're really doing here is providing the template that dataview
 * should use (the tpl property below), and a Store to get the data from. In this case we're loading data from a JSON
 * file over AJAX.
 */
Ext.define('Ostrich.ux.IconBrowserView', {
	extend: 'Ext.view.View',
	alias: 'widget.iconbrowserview',
	cls: "iconbrowser",

	uses: 'Ext.data.Store',

	singleSelect: true,
	overItemCls: 'x-view-over',
	itemSelector: 'div.thumb-wrap',
	tpl: [
		'<div class="details">',
			'<tpl for=".">',
				'<div class="thumb-wrap">',
					'<div class="thumb">',
					(!Ext.isIE6? '<img src="{icon}" />' :
					'<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{icon}\')"></div>'),
					'</div>',
					'<span>{title}</span>',
				'</div>',
			'</tpl>',
		'</div>'
	]
});
Ext.define('Ostrich.ux.IconBrowser', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.iconbrowser',
	autoScroll: true,
	// layout: "vbox",

	uses: 'Ext.data.Store',
	border: 0,

	constructor: function(config) {
		this.callParent([config]);
		var store, me = this;

		if (config.store) {
			store = Ext.StoreManager.get(config.store);
			store.on({
				refresh: this.setStore,
				scope: this
			});
		}
		this.selected = false;
	},

	setStore: function(store) {
		var v;
		this.items.each(function(p) { p.destroy(); });
		if (store.groupers.length) {
			store.getGroups().forEach(function(group) {
				v = Ext.create("Ostrich.ux.IconBrowserView", {
					height: "auto",
					store: Ext.create("Ext.data.Store", {
						model: "Ostrich.model.Application",
						data: group.children
					})
				});
				v.on({
					selectionchange: function(dv, selected) {
						if (this.selected && this.selected != dv) {
							this.selected.deselectAll();
						}
						this.selected = dv;
					},
					scope: this
				});
				this.relayEvents(v, [
					"activate", "added", "afterrender", "beforeactivate", "beforecontainerclick",
					"beforecontainercontextmenu", "beforecontainerdblclick",
					"beforecontainerkeydown", "beforecontainermousedown", "beforecontainermouseout",
					"beforecontainermouseover", "beforecontainermouseup", "beforedeactivate",
					"beforedeselect", "beforedestroy", "beforehide", "beforeitemclick",
					"beforeitemcontextmenu", "beforeitemdblclick", "beforeitemkeydown",
					"beforeitemmousedown", "beforeitemmouseenter", "beforeitemmouseleave",
					"beforeitemmouseup", "beforerefresh", "beforerender", "beforeselect",
					"beforeshow", "beforestaterestore", "beforestatesave", "blur", "boxready",
					"containerclick", "containercontextmenu", "containerdblclick", "containerkeydown",
					"containermouseout", "containermouseover", "containermouseup", "deactivate",
					"deselect", "destroy", "disable", "enable", "focus", "focuschange", "hide",
					"highlightitem", "itemadd", "itemclick", "itemcontextmenu", "itemdblclick",
					"itemkeydown", "itemmousedown", "itemmouseenter", "itemmouseleave", "itemmouseup",
					"itemremove", "itemupdate", "move", "refresh", "removed", "render", "resize",
					"select", "selectionchange", "show", "staterestore", "statesave", "unhighlightitem",
					"viewready"
				]);
				var columns = Math.max(1, Math.floor(this.getWidth() / 120));
				var rows = Math.ceil(group.children.length / columns);
				this.add({
					xtype: "panel",
					title: group.name,
					border: 0,
					height: 30 + (rows * 123),
					items: [v]
				});
			}, this);
		} else {
			v = Ext.create("Ostrich.ux.IconBrowserView", {
				store: store
			});
			this.relayEvents(v, [
				"activate", "added", "afterrender", "beforeactivate", "beforecontainerclick",
				"beforecontainercontextmenu", "beforecontainerdblclick",
				"beforecontainerkeydown", "beforecontainermousedown", "beforecontainermouseout",
				"beforecontainermouseover", "beforecontainermouseup", "beforedeactivate",
				"beforedeselect", "beforedestroy", "beforehide", "beforeitemclick",
				"beforeitemcontextmenu", "beforeitemdblclick", "beforeitemkeydown",
				"beforeitemmousedown", "beforeitemmouseenter", "beforeitemmouseleave",
				"beforeitemmouseup", "beforerefresh", "beforerender", "beforeselect",
				"beforeshow", "beforestaterestore", "beforestatesave", "blur", "boxready",
				"containerclick", "containercontextmenu", "containerdblclick", "containerkeydown",
				"containermouseout", "containermouseover", "containermouseup", "deactivate",
				"deselect", "destroy", "disable", "enable", "focus", "focuschange", "hide",
				"highlightitem", "itemadd", "itemclick", "itemcontextmenu", "itemdblclick",
				"itemkeydown", "itemmousedown", "itemmouseenter", "itemmouseleave", "itemmouseup",
				"itemremove", "itemupdate", "move", "refresh", "removed", "render", "resize",
				"select", "selectionchange", "show", "staterestore", "statesave", "unhighlightitem",
				"viewready"
			]);
			this.add({
				xtype: "panel",
				border: 0,
				autoScroll: true,
				flex: 1,
				items: [v]
			});
		}
	}
});