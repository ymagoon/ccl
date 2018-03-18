Ext.define("MPAGE.store.GroupMember", {
	extend: "univnm.ext.QueryStore",
	alias:"store.group_member",
	model: "MPAGE.model.Group",
	sql:[
		"select ",
		"	ro.id, ",
		"	ro.parent_id, ",
		"	ro.model, ",
		"	ro.foreign_key, ",
		"	ro.alias ",
		"from ",
		"	cust_aros ro ",
		"where ",
		"	1=1 ",
		"	and ro.model in ( ",
		"		'CernerRole', ",
		"		'User' ",
		"	) ",
		"	and parent_id = <tpl if=\"pid\"> {pid} <tpl else> -1 </tpl> "
	],
	extraParams:{
		pid:"-1"
	}
})