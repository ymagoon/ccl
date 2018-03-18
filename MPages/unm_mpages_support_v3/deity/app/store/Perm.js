Ext.define("MPAGE.store.Perm", {
	extend: "univnm.ext.QueryStore",
	alias:"store.perm",
	model: "MPAGE.model.Perm",
	autoLoad:true,
	sorters:[
		{
			property: "environment",
			direction: "asc"
		},
		{
			property:"alias",
			direction:"asc"
		}
	],
	groupers: [
		{
			property: "application_name"
		}
	]
});