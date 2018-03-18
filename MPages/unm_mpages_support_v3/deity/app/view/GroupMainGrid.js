Ext.define('MPAGE.view.GroupMainGrid', {
	extend: 'univnm.ext.SupaGrid',
	alias:'widget.group_main_grid',
	title:"User Groups",
	iconCls:"icon_group",
	bbar:[{
		text:"Add Group",
		iconCls:"icon_group_add",
		handler:function(b){
			var view = b.up("group_main_grid");
			view.fireEvent("add_group",{src:view})
		}
	},{
		//xtype:"tbfill"
	},{
		xtype:"tbtext",
		baseCls:"help",
		text:"Click a row to edit"
	},{
		xtype:"tbfill"
	}],
	store:"Group",
	filterMode:"local",
	filterSuppressTitle:true,
	editFormConfig:{
		xtype:"group_form",
		position:"right",
		title:"Edit Group"
	},
	columns: [/* {
		xtype:'betteractioncolumn',
		width:25,
		iconCls: 'icon_group_edit',
		tooltip: 'Manage Group',
		handler:function(view,rowIndex,colIndex,item,e){
			var model = view.getStore().getAt(rowIndex)
			var v = view.up("group_main_grid");
			v.fireEvent("edit_group",{
				src:v,
				model:model
			})
		}
	}, */{
		text: 'Group Name',
		filterable:true,
		flex: 5,
		sortable: true,
		dataIndex: 'alias'

	}, {
		text: "Application",
		dataIndex: "application",
		flex: 2
	}, {
		text: "Environment",
		dataIndex: "environment",
		flex: 1
	}],
	features: [{ftype:'grouping'}],
	initComponent:function(config){
		this.callParent(arguments);
		this.on("activate",function(panel){
			if (this.activated){
				panel.getStore().load()
			}
			this.activated = true;
		})
	}
})