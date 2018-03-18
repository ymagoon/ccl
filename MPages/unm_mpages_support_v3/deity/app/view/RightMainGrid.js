Ext.define('MPAGE.view.RightMainGrid', {
	extend: 'univnm.ext.SupaGrid',
	alias:'widget.right_main_grid',
	title:"Rights",
	iconCls:"icon_right",
	bbar:[{
		text:"Add Right",
		iconCls:"icon_right_add",
		handler:function(b){
			var view =b.up("right_main_grid");
			view.fireEvent("add_right",{src:view})
		}
	},{
		//xtype:"tbfill"
	},{
		xtype:"tbtext",
		baseCls:"help",
		text:"Double-click a row to edit"
	},{
		xtype:"tbfill"
	}],
	filterSuppressTitle:true,
	filterMode:'local',
	store:"Right",
	plugins:[{
		ptype:"rowediting",
		errorSummary:false,
		clicksToMoveEditor:1,
		clicksToEdit:2,
		autoCancel:true
	}],
	columns: [{
		xtype:'betteractioncolumn',
		width:25,
		iconCls: 'icon_delete',
		tooltip: 'Delete Right',
		handler:function(view,rowIndex,colIndex,item,e){

			var model = view.getStore().getAt(rowIndex)
			if (confirm("Delete Right '{alias}'?".format(model.data))){
				var v = view.up("right_main_grid");
				v.fireEvent("delete_right",{
					src:v,
					model:model
				})
			}
		}

	},{
		text: 'Right Name',
		filterable:true,
		editor:{
			allowBlank:false,
			xtype:"textfield"
		},
		flex:1,
		sortable: true,
		dataIndex: 'alias'

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
		}
	},
	initComponent:function(config){


		this.callParent(arguments);
		this.on("edit",function(editor,e){
			this.fireEvent("save_right",{
				src:this,
				model:e.record
			})
		})
	}
})