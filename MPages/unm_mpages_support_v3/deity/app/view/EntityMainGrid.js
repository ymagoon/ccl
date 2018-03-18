Ext.define('MPAGE.view.EntityMainGrid', {
	extend: 'Ext.grid.Panel',
	alias:'widget.entity_main_grid',
	title:"Entities",
	//iconCls:"icon_menu",
	bbar:[{
		text:"Add Menu Item",
		iconCls:"icon_menu_add",
		handler:function(b){
			var view =b.up("entity_main_grid");
			view.fireEvent("add_entity",{src:view})
		}
	},{
		//xtype:"tbfill"
	},{
		xtype:"tbtext",
		baseCls:"help",
		text:"Double-Click to edit link"
	},{
		xtype:"tbfill"
	}],
	store:"Entity",
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
		tooltip: 'Delete Entity',
		handler:function(view,rowIndex,colIndex,item,e){

			var model = view.getStore().getAt(rowIndex)
			if (confirm("Delete Entity '{app_name}'?".format(model.data))){
				var v = view.up("entity_main_grid");
				v.fireEvent("delete_entity",{
					src:v,
					model:model
				})
			}
		}

	},{
		text: 'Application',
		width:150,
		sortable: true,
		dataIndex: 'application_id',
		editor:{
			xtype:"combobox",
			store:"Application",
			editable:false,
			queryMode:"local",
			displayField:"app_name",
			valueField:"id"
		},
		renderer:function(val,meta,record){
			return record.get("app_name");
		}


	},{
		text: 'Display Name',
		width:150,
		sortable: true,
		dataIndex: 'display_name'
	},{
		text: 'Icon',
		width:32,
		flex:1,
		sortable: true,
		dataIndex: 'icon',
		editor:{
			xtype:"textfield"
		},
		renderer:function(val){
			if (val){
				if (!(val.indexOf(".") === 0 || val.indexOf("file:") === 0 || val.indexOf("/") === 0)) {
					val = ($env.instance == "trogdor"? "../menu3/": "../menu/") + val;
				}
				return "<img width='20' height='20' src='{0}'>".format(val);
			} else return ""
		}

	},{
		text: 'URL / CCL',
		width:100,
		sortable: true,
		editor:{
			xtype:"textfield"
		},
		flex:1,
		dataIndex: 'url'
	},{
		text: 'Params',
		width:100,
		sortable: true,
		editor:{
			xtype:"textfield"
		},
		flex:1,
		dataIndex: 'params'
	}],
	listeners:{
	},
	initComponent:function(config){

		this.callParent(arguments);
		this.on("edit",function(editor,e){
			this.fireEvent("save_entity",{
				src:this,
				model:e.record
			})
		})
	}
})