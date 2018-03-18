Ext.define("MPAGE.store.Section", {
	extend: "univnm.ext.QueryStore",
	alias:"store.group",
	model: "MPAGE.model.Section",
	extraParams:{
		menu_id:0
	},
	sql:[
		"Select ",
		"	id, ",
		"	menu_id, ",
		"	name, ",
		"	weight ",
		"From ",
		"	cust_sections t ",
		"where ",
		"	1=1 <tpl if='menu_id'> ",
		"		and menu_id={menu_id} ",
		"    <tpl else> ",
		"    	and menu_id=0 ",
		"    </tpl> "
	],
	sorters:[{
		property:"weight",
		direction:"DESC"
	}]
	
})