Ext.define('MPAGE.view.MenuMainPanel', {
	requires: ["MPAGE.view.MenuDetails"],
	extend: 'Ext.panel.Panel',
	alias:'widget.menu_main_panel',
	title:"Menus",
	iconCls:"icon_menu",
	layout:{
		type:"hbox",
		align:"stretch"
	},
	items:[
		{
			xtype:"menu_main_grid",
			flex:1,
			preventHeader: true

		},
		{
			xtype: "container",
			flex: 3,
			layout: {
				type: "vbox",
				align: "stretch"
			},
			items: [
				{
					xtype: "menu_details",
					flex: 1,
					padding: 20
				}
				// {
				// 	xtype:"section_main_grid",
				// 	flex:1

				// },
				// {
				// 	xtype:"entity_main_grid",
				// 	flex:1

				// }
			]
		}
	],
	listeners:{
		activate:function(panel){
			if (this.activated){
				//TODO: Find stores and reload them
			}
			this.activated = true;
		}
	},
	initComponent:function(config){

		this.callParent(arguments);
	}
})