Ext.define("MPAGE.store.Menu", {
	extend: "univnm.ext.QueryStore",
	alias:"store.group",
	model: "MPAGE.model.Menu",
	autoLoad:true,
	sorters:[{
		property:"base_dir",
		direction:"ASC"
	},{
		property:"name",
		direction:"ASC"
	}]
	
})