Ext.define("MPAGE.view.QueryTab", {
	extend: 'Ext.panel.Panel',
	alias:"widget.query_tab",
	requires: [
		"MPAGE.view.ExtPane",
		"MPAGE.view.QueryPane",
		"MPAGE.view.Results"
	],
	title: "Query",
	iconCls:"icon_run_query",
	closable:true,
	layout:{
		type:'vbox',
		align:'stretch'
	},
	sql:"-- New Query",
	initComponent:function() {
		var sql = this.sql;
		this.items = [{
			flex:2,
			xtype:"tabpanel",
			items:[{
				layout:{
					type:'vbox',
					align:'stretch'
				},
				title:"SQL",
				items:[{
					xtype: "query_pane",
					flex:2,
					listeners:{
						afterrender:function(panel){
							panel.form.setValues({sql:sql});
						}
					}
				},{
					xtype:"splitter"
				},{//results
					flex:1,
					layout:{
						type:'border'/*,
						align:'stretch'*/
					},
					items:[{
						xtype:"propertygrid",
						region:"west",
						collapsible:true,
						title:"Variables",
						source:{},
						width:250
					},{
						region:"center",
						itemId:"results",
						layout:"fit",
						flex:1
					}]
					
				}]
					
				
			},{
				xtype: "ext_pane",
				title:"Template",
				flex:2
			}]
		}];
		this.callParent(arguments);
	}
		
	
	
});