Ext.define("MPAGE.store.CustTableData", {
	extend: "univnm.ext.QueryStore",
	alias:"store.flat_table_data",
	sql:[
		"select ",
		"	table_name ",
		"from ",
		"	all_tables allt ",
		"where ",
		"	allt.owner = 'UNMH' ",
		"	and instr( ",
		"		allt.table_name, ",
		"		'CUST_' ",
		"	) = 1 ",
		"order by ",
		"	TABLE_NAME "
	],
	groupField: 'table_name',
	autoLoad:true
	
});