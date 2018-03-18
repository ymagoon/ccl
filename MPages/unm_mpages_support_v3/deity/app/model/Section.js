$env.tableExtensionIgnore.push("cust_sections");
Ext.define('MPAGE.model.Section', {
	extend: 'Ext.data.Model',
	proxy:"row",
	table:"cust_sections",
	fields:[
		{name:"id",									sqlDefault:"#cust_sections_seq.nextval"},
		{name:"menu_id",	naturalKey:true},
		{name:"name",		naturalKey:true},
		{name:"weight"		} 
	],
	readSql:[
		"Select ",
		"	id, ",
		"	menu_id, ",
		"	name, ",
		"	weight ",
		"From ",
		"	cust_sections t ",
		"where ",
		"	{conditions} "
		
	]
});
