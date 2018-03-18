/* this doesn't work, don't use it */

Ext.define('univnm.ext.RowModel', {
	extend: 'Ext.data.Model',
	requires:[
		"univnm.ext.SequenceGenerator",
		"univnm.ext.RowProxy"
	],
	proxy:"row"
	
});


