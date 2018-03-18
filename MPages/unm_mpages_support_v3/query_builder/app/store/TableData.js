Ext.define("MPAGE.store.TableData", {
	extend: "Ext.data.TreeStore",
	alias:"store.table_data",
	
	proxy: {
		type: 'query',
		debugParams:true,
		sql:[
			"<tpl if=\"!node || node == 'tables'\"> ",
				"select ",
					"table_name id, ",
					"table_name text , ",
					"table_name qtip ",
				"from ",
					"table_privileges ",
				"where ",
					"grantee='UNMH' ",
				"UNION ",
				"select ",
					"table_name id, ",
					"table_name text , ",
					"table_name qtip ",
				"from ",
					"all_tables ",
				"where ",
					"owner='UNMH' ",
			"</tpl> ",
			"<tpl if=\"node && node != 'tables'\"> ",
				"select ",
					"column_name id, ",
					"column_name text, ",
					"column_name qtip , ",
					"data_type || '(' || data_length ||')' type, ",
					"1 leaf ",
				"from ",
					"all_tab_columns ",
				"where ",
					"table_name='{node}' </tpl> "

		]
	},
	root: {
		text: 'Available Tables',
		id: 'tables',
		expanded: true
	}/*,
	folderSort: true,
		
	sorters:[{
		property:"text",
		direction:"ASC"
	}]*/
	
});