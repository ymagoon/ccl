Ext.define("MPAGE.store.Entity", {
	extend: "univnm.ext.QueryStore",
	alias:"store.group",
	model: "MPAGE.model.Entity",
	extraParams:{
		section_id:0
		
	},
	sql:[
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
		"    <tpl if='section_id'> ",
		"	and section_id={section_id} ",
		"    <tpl else> ",
		"	and section_id=0 ",
		"    </tpl> "
		
	],
	sorters:[{
		property:"app_name",
		direction:"ASC"
	}]
	
})