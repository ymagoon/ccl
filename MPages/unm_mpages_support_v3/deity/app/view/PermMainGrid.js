Ext.define('MPAGE.view.PermMainGrid', {
	extend: 'univnm.ext.SupaGrid',
	alias:'widget.perm_main_grid',
	title:"Permissions",
	iconCls:"icon_perm",
	bbar:[{
		text:"Add Permission",
		iconCls:"icon_perm_add",
		handler:function(b){
			var view =b.up("perm_main_grid");
			view.fireEvent("add_perm",{src:view})
		}
	},{
		//xtype:"tbfill"
	},{
		xtype:"tbtext",
		baseCls:"help",
		text:"Double-click a row to edit, or click the row to manage the associated group."
	},{
		xtype:"tbfill"
	}],
	editFormConfig:{
		xtype:"group_form",
		permEdit:true,
		position:"right",
		editTriggerCol:"edit_group",
		title:"Edit Group"

	},
	filterMode:"local",
	filterSuppressTitle:true,
	plugins:[{
		ptype:"rowediting",
		errorSummary:false,
		clicksToMoveEditor:1,
		clicksToEdit:2,
		autoCancel:true
	}],
	store:"Perm",
	columns: [/*{
		text: 'ID',
		width:35,
		//hidden:true,
		sortable: true,
		dataIndex: 'id'

	}, */{
		xtype:'betteractioncolumn',
		width:25,
		iconCls: 'icon_delete',
		tooltip: 'Delete Perm',
		handler:function(view,rowIndex,colIndex,item,e){
			var model = view.getStore().getAt(rowIndex)
			if (confirm("Delete Permission '{right_name}' -> '{group_name}'?".format(model.data))){
				var v = view.up("perm_main_grid");
				v.fireEvent("delete_perm",{
					src:v,
					model:model
				})
			}
		}
	},{
		text: 'Right Name',
		width:250,
		sortable: true,
		dataIndex: 'aco_id',
		editor:{
			xtype:"combobox",
			store:"Right",
			editable:false,
			queryMode:"local",
			displayField:"alias",
			valueField:"id"
		},
		renderer:function(val,meta,record){
			return record.get("right_name")
		}

	},{
	// 	xtype:'betteractioncolumn',
	// 	width:25,
	// 	iconCls: 'icon_group_edit',
	// 	tooltip: 'Edit Group',
	// 	itemId:"edit_group"
	// },{
		text: 'Group Name',
		width:250,
		sortable: true,
		dataIndex: 'aro_id',
		editor:{
			xtype:"combobox",
			store:"Group",
			editable:false,
			queryMode:"local",
			displayField:"alias",
			valueField:"id"
		},
		renderer:function(val,meta,record){
			return record.get("group_name");
		}

	},{
		text: 'Application',
		filterable:true,
		hidden:true,
		filterFn:function(record,app_name) {
			var right = record.get("right_name");
			return new RegExp(app_name +"(\/|$)").test(right);
		},
		filterControl:{
			xtype:"combobox",
			queryMode:"local",
			store:"Application",
			displayField:"app_name",
			valuField:"app_name",
			editable:false

		},
		dataIndex: 'right_name'
	},{
		text: 'Group Name',
		filterable:true,
		dataIndex: 'group_name',
		hidden:true,
		filterControl:{
			//fieldLabel:"Application",
			xtype:"combobox",
			store:"Group",
			queryMode:"local",
			displayField:"alias",
			valuField:"alias",
			editable:false
		}
	},
	{
		text: "Application",
		dataIndex: "application_name"
	},
	{
		text: "Environment",
		dataIndex: "environment"
	}],
	features: [{ftype:'grouping'}],
	listeners:{
		activate:function(panel){
			if (this.activated){
				panel.getStore().load()
			}
			this.activated = true;
		},
		sortchange:function(ct,col,dir){
			if (col.dataIndex == 'aro_id'){
				Ext.StoreMgr.get("Perm").sort({
					property:"group_name",
					direction:dir
				})
			} else if (col.dataIndex == 'aco_id') {
				Ext.StoreMgr.get("Perm").sort({
					property:"right_name",
					direction:dir
				})
			}
		}
	},
	initComponent:function(config){

		this.features =[
			Ext.create('Ext.grid.feature.Grouping',{
				groupHeaderTpl: '({rows.length}) "{name}" ',
				//hideGroupedHeader:true,
				startCollapsed:true
			})
		]
		this.callParent(arguments);
		this.on("edit",function(editor,e){
			this.fireEvent("save_perm",{
				src:this,
				model:e.record
			})
		})
	}
})