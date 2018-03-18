$env.tableExtensionIgnore.push("cust_entities");
Ext.define('MPAGE.model.Entity', {
	extend: 'Ext.data.Model',
	proxy:"row",
	table:"cust_entities",
	fields:[
		{name:"id",									sqlDefault:"#cust_entities_seq.nextval"},
		{name:"section_id",			naturalKey:true},
		{name:"application_id",		naturalKey:true},
		{name:"icon"				},
		{name:"params"				},
		{name:"url"					},
		{name:"display_name",			meta:true},
		{name:"app_name",			meta:true}       
		 
	],
	reloadAfterSave:true,
	readSql:[
		"Select ",
		"	t.id, ",
		"	t.section_id, ",
		"	t.application_id, ",
		"	t.icon, ",
		"	t.params, ",
		"	t.url, ",
		"	app.display_name, ",
		"	app.app_name ",
		"From ",
		"	cust_entities t, ",
		"	cust_applications app ",
		"where app.id = t.application_id ",
		"and {conditions} "
	]
});
