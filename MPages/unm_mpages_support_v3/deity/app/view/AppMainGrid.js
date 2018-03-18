Ext.define('MPAGE.view.AppMainGrid', {
	extend: 'univnm.ext.SupaGrid',
	alias:'widget.app_main_grid',
	//requires:["MPAGE.store.Application"],
	title:"Applications",
	iconCls:"icon_applications",
	bbar:[{
		text:"Add Application",
		iconCls:"icon_application_add",
		handler:function(b){
			var view =b.up("app_main_grid");
			view.fireEvent("add_app",{src:view})
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
	plugins:[{
		ptype:"rowediting",
		errorSummary:false,
		clicksToMoveEditor:1,
		clicksToEdit:2,
		autoCancel:true
	}],
	store:"Application",
	filterMode:"local",
	filterSuppressTitle:true,
	columns: [{
		xtype:'betteractioncolumn',
		width:25,
		iconCls: 'icon_delete',
		tooltip: 'Delete App',
		handler:function(view,rowIndex,colIndex,item,e){
			var model = view.getStore().getAt(rowIndex)
			if (confirm("Delete Application '{app_name}'?".format(model.data))){
				var v = view.up("app_main_grid");
				v.fireEvent("delete_app",{
					src:v,
					model:model
				})
			}
		}
	}/*,{
		text:"ID",
		width:35,
		dataIndex: 'id'
	}*/,{
		text: 'App Name',
		width:150,
		sortable: true,
		dataIndex: 'app_name',
		editor:{
			allowBlank:false,
			xtype:"textfield"
		},
		filterable:true

	},{
		text: 'Display Name',
		width:150,
		sortable: true,
		editor:{
			allowBlank:false,
			xtype:"textfield"
		},
		dataIndex: 'display_name'

	},{
		text: 'Description',
		editor:{
			xtype:"textfield"
		},
		sortable: true,
		flex:1,
		dataIndex: 'description'

	}],
	initComponent:function(config){

		this.callParent(arguments);
		this.on("activate",function(panel){
			if (this.activated){
				panel.getStore().load()
			}
			this.activated = true;
		})
		this.on("edit",function(editor,e){
			this.fireEvent("save_app",{
				src:this,
				model:e.record
			})
		})

	}
})