Ext.define('Ostrich.view.AppInfo', {
	extend: 'Ext.panel.Panel',
	alias : 'widget.appinfo',
	cls: "application-information",

	width: 150,
	minWidth: 150,

	tpl: [
		'<div class="details">',
			'<tpl for=".">',
					'<a href="#"><img src="{icon}" width="90%" /></a>',
				'<div class="details-info">',
					'<b>{title}</b>',
					'<span>{description}</span><br />',
					'<tpl if="!!frequency"><b>Usage</b><span>{frequency} times in 60 days</span></tpl>',
					'<tpl if="!!last_used"><b>Last Used</b><span>{[values.last_used.format("m/d/Y h:ia")]}</span></tpl>',
					'<br/><hr/><span><ul><li style="list-style:disc inside;">Click an icon to view details here.</li><li style="list-style:disc inside;">Double click an icon to open that application.</li></ul></span><br />',
				'</div>',
			'</tpl>',
		'</div>'
	],

	html: [
		'<div class="details">',
			'<div class="details-info">',
				'<b>Getting Started</b>',
				'<span><ul><li style="list-style:disc inside;">Click an icon to view details here.</li><li style="list-style:disc inside;">Double click an icon to open that application.</li></ul></span><br />',
			'</div>',
		'</div>'
	].join(""),

	afterRender: function(){
		this.callParent();
	},

	/**
	 * Loads a given image record into the panel. Animates the newly-updated panel in from the left over 250ms.
	 */
	loadRecord: function(image) {
		this.body.hide();
		this.tpl.overwrite(this.body, image.data);
		// this.body
		Ext.DomQuery.selectNode("a", this.body.dom).onclick = function() { //on("click", function(e) {
			var a = Ext.ComponentQuery.query("applistings").first();
			a.fireEvent("itemdblclick", a, image);
			return false;
		};
		// this.body.slideIn('r', {
			// duration: 250
		// });
		this.body.show();
	},

	clear: function(){
		this.body.update('');
	}
});