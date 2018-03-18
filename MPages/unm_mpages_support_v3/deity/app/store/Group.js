Ext.define("MPAGE.store.Group", {
	extend: "univnm.ext.QueryStore",
	alias:"store.group",
	model: "MPAGE.model.Group",
	autoLoad:true,
	sql:[
		"select",
		"	ro.id,",
		"	ro.parent_id,",
		"	ro.model,",
		"	ro.foreign_key,",
		"	ro.alias ",
		"from",
		"	cust_aros ro ",
		"where",
		"	1=1 ",
		"	and nvl(parent_id,0) =0 ",
		"	and model = 'Role' ",
		"order by lower(alias)"
	],
	sorters: [
		{
			property: "environment",
			direction: "asc"
		},
		{
			property: "group_name",
			direction: "asc"
		}
	],
	groupers: [
		{
			property: "application"
		}
	]
})