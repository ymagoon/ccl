Ext.define("MPAGE.store.Right", {
	extend: "univnm.ext.QueryStore",
	alias:"store.right",
	model: "MPAGE.model.Right",
	autoLoad:true,
	sql:"select * from cust_acos where model = 'Right'",
	sorters:[{
		property:"alias",
		direction:"asc"
	}],
	groupers: [
		{
			property: "environment"
		}
	]
});