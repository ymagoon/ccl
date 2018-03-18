Ext.define("Ostrich.view.Listing", {
	requires: ["Ostrich.ux.IconBrowser"],
	extend: "Ext.panel.Panel",
	layout: {
		type: "vbox",
		align: "stretch"
	},

	alias: "widget.applistings",

	items: [
		{
			id:"up-to-date",
			icon:"../shared/img/icons/famfamfam/zoom.png",
			xtype:"mpagecomponent",
			// docked: "top",
			cls: "uptodate",
			border: 0,
			height: 25,
			componentName:"univnm.UpToDate",
			componentProperties:{
				assignedSystemId:'CERN43685',
				protocolVersion: '2.1.0'
			}
		},
		{
			xtype: "iconbrowser",
			store: "Applications",
			flex: 1
		}
	],
	bbar: [
		{
			xtype: 'textfield',
			name : 'filter',
			fieldLabel: 'Filter',
			labelAlign: 'right',
			labelWidth: 35,
			flex:  1,
			listeners: {
				change: function(tb, v) {
					tb.up("applistings").fireEvent("filtering", v);
				}
			}
		},
		' ',
		{
			xtype: 'combo',
			fieldLabel: 'Sort By',
			labelAlign: 'right',
			labelWidth: 45,
			valueField: 'field',
			displayField: 'label',
			value: 'Name',
			editable: false,
			store: Ext.create('Ext.data.Store', {
				fields: ['field', 'label'],
				sorters: 'type',
				proxy : {
					type: 'memory',
					data  : [
						{
							label: 'Name',
							field: 'name'
						},
						{
							label: 'Recently Used',
							field: 'recent'
						},
						{
							label: "Most Used",
							field: "most"
						}
					]
				}
			}),
			listeners: {
				change: function(cb, v) {
					cb.up("applistings").fireEvent("grouper", v);
				}
			}
		}
	],

	initComponent: function() {
		this.callParent([]);
		this.relayEvents(this.down("iconbrowser"), [
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
	}
});