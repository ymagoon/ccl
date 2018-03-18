$env.tableExtensionIgnore.push("cust_menus");
Ext.define('MPAGE.model.Menu', {
	extend: 'Ext.data.Model',
	proxy:"row",
	table:"cust_menus",
	fields:[
		{name:"id"},
		{name:"name",		naturalKey:true},
		{name:"base_dir",	naturalKey:true, defaultValue:"file:/I:/custom/mpages"},
		{name:"title"}
	],
	idgen: {
        type: 'seq',
        sequence:"cust_menus_seq"
    },
	readSql:[
		"Select ",
		"	id, ",
		"	name, ",
		"	title, ",
		"	base_dir ",
		"from ",
		"	cust_menus t",
		"where ",
		"	{conditions} "
	]
});
