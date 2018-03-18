Ext.define("MPAGE.view.Main", {
	extend: 'Ext.panel.Panel',
	alias:"widget.main",
	requires: [
		"MPAGE.view.QueryTab",
		"univnm.ext.BetterActionColumn"
	],
	title: "Query Builder",
	tbar:[{
		xtype:"label",
		hidden:true,
		text:"Domain:"
	},{
		text:"Domain",
		hidden:true,
		iconCls:"icon_domain",
		xtype:"quickdrop",
		values:["p126","b126","c126","t126","m126","s126"],
		value:"p126",
		width:60,
		editable:false,
		listeners:{
			select:function(c,records){
				var v  = c.up("main");
				v.fireEvent("change_domain",{
					src:v,
					value:records.first().get("value")
				});
			}
				
		}
	},{
		text:"New Query Tab",
		iconCls:"icon_add_query",
		handler:function(b){
			var view= b.up("main");
			view.fireEvent("add_query_tab",{src:view});
			
		}
	},/*{
		xtype:"label",
		text:"Generate Audit Trigger for:"
	},*/{
		xtype:"combo",
		store:"CustTableData",
		displayField:"table_name",
		queryMode:"local",
		width:350,
		emptyText:"Generate Audit Trigger",
		editable:false,
		listeners:{
			select:function(combo,selection){
				var view= combo.up("main");
				view.fireEvent("generate_audit_trigger",{
					src:view,
					table_name:selection.first().get("table_name")
				});
				combo.setValue();
			}
		}
	}],
	layout:{
		type:"border"/*,
		align:"stretch"*/
	},
	items:[{
		region:"west",
		resizeable:true,
		collapsible:true,
		title:"Available Tables",
		xtype:"supagrid",
		store:"FlatTableData",
		width:400,
		features: [{
			ftype:'grouping',
			startCollapsed:true
		}],
		viewConfig: {
			plugins: {
				ptype: 'gridviewdragdrop',
				dragText: 'Drag and drop to SQL window',
				ddGroup:'dbName',
				enableDrop:false
			}
		},
		filterMode:"local",
		filterSuppressTitle:true,
		columns:[
			{ dataIndex:"table_name",text:"Table Name", hidden:true,filterable:true},
			{ dataIndex:"column_name",text:"Column Name",flex:1,filterable:true},
			{ dataIndex:"type",text:"Type", filterable:true},
			{ dataIndex:"table_name",text:"",xtype:"betteractioncolumn",
				handler:function(gridView,rowIndex,colIndex,item,e){
					/*var view = gridView.ownerCt.up("main");
					view.fireEvent("insert_options",{
						src:view,
						tableNode:gridView.getStore().getAt(rowIndex),
						xy:e.xy
					});*/
				},
				tooltip:"Insert Options..",
				iconCls:"icon_insert"
			}

		],
		listeners:{
			itemclick:function(gridView,record,element,rowIndex,e){
				var view = gridView.ownerCt.up("main");
					view.fireEvent("insert_options",{
						src:view,
						tableNode:record,
						xy:e.xy
					});
			}
		}
	},/*{
		xtype:"splitter"
	},*/{
		region:"center",
		xtype:"tabpanel",
		itemId:"center_tabs",
		flex:3,
		activeTab:0,
		items:[/*{
			xtype:"query_tab"
		}*/]
	}]
});