$env.tableExtensionIgnore.push("cust_applications");
Ext.define('MPAGE.model.Application', {
	extend: 'Ext.data.Model',
	proxy:"row",
	table:"cust_applications",
	fields:[
		{name:"id"}, 
		{name:"display_name"}, 
		{name:"app_name", naturalKey:true}, 
		{name:"is_portlet", sqlDefault:"0"}, 
		{name:"description", sqlDefault:"#null"}
	],
	idgen: {
		type: 'seq',
		sequence:"cust_applications_seq"
	}
});
