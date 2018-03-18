Ext.define("MPAGE.store.Application", {
	extend: "univnm.ext.QueryStore",
	alias:"store.application",
	model: "MPAGE.model.Application",
	autoLoad:true,
	sorters:[{
		property:"app_name",
		direction:"asc"
	}]
});