Ext.define("Ostrich.view.Viewport", {
	extend: "Ext.container.Viewport",
	requires: [
		"Ostrich.view.Listing",
		"Ostrich.view.AppInfo"
	],
	layout: "fit",
	items: [
		{
			xtype: "panel",
			title: "Menu",
			layout: "border",
			items: [
				{
					xtype: "applistings",
					store: "Applications",
					region: "center"
				},
				{
					xtype: 'appinfo',
					region: 'east',
				},

			]
		}

	]
});