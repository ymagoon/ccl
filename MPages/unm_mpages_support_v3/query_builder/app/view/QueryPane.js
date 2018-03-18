Ext.define("MPAGE.view.QueryPane", {
	extend: 'Ext.form.Panel',
	alias:"widget.query_pane",
	requires: [
		"MPAGE.ux.CodeMirror",
		"univnm.ext.QuickDrop"
	],
	title:"SQL Code",
	layout:"fit",
	bbar:[{
		text:"Beautify",
		iconCls:"icon_beautify",
		handler:function(b){
			var v  = b.up("query_pane");
			v.fireEvent("beautify",{
				src:v,
				sql:v.form.findField("sql").getValue()
			});
		}
	},{
		text:"Run Query",
		iconCls:"icon_run_query",
		handler:function(b){
			var v  = b.up("query_pane");
			v.fireEvent("run_query",{
				src:v,
				sql:v.form.findField("sql").getValue()
			});
		}
	},{
		xtype:"tbfill"
	},{
		text:"to Template",
		iconCls:"icon_to_ext",
		handler:function(b){
			var v  = b.up("query_pane");
			v.fireEvent("to_ext",{
				src:v,
				sql:v.form.findField("sql").getValue()
			});
		}
	}],
	items:[{
		xtype: "codemirror",
		
		flex:1,
		name:"sql",
		options:{
			lineNumbers: true,
			matchBrackets: true,
			theme:"rubyblue",
			indentUnit: 4,
			mode: "text/x-plsql"
		},
		listeners:{
			change:Ext.Function.createBuffered(function(c,sql){
				var v =c.up("query_pane");
				v.fireEvent("sql_changed",{
					src:v,
					sql:sql
				});
			},1000),
			afterrender:function(ta){
				if (ta.value) ta.codeMirror.setValue(ta.value);
			}

		},
		value:""
			
	}]
});