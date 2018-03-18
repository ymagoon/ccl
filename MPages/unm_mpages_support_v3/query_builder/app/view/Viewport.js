Ext.define("MPAGE.view.Viewport", {
	extend: 'Ext.container.Viewport',
	requires: [
		"MPAGE.view.Main"
	],
	defaults: {
		//border:false
		//bodyStyle: "background-color: #ffffff;"
	},
	layout: 'fit',
	items:[{
		xtype: "main"
		
	}]
});