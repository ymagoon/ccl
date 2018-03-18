Ext.define('MPAGE.view.MenuMainGrid', {
	extend: 'Ext.grid.Panel',
	alias:'widget.menu_main_grid',
	title:"Top Level Menus",
	//iconCls:"icon_menu",
	bbar:[{
		text:"Add Menu",
		iconCls:"icon_menu_add",
		handler:function(b){
			var view =b.up("menu_main_grid");
			view.fireEvent("add_menu",{src:view})
		}
	},{
		//xtype:"tbfill"
	},{
		xtype:"tbtext",
		baseCls:"help",
		text:"Click a row to view sections, Double-Click to edit menu"
	},{
		xtype:"tbfill"
	}],
	store:"Menu",
	plugins:[{
		ptype:"rowediting",
		errorSummary:false,
		clicksToMoveEditor:1,
		clicksToEdit:2,
		autoCancel:true
	}],
	columns: [ /* {
		text:"ID",
		dataIndex:"id"
	}, */{
		xtype:'betteractioncolumn',
		width:25,
		iconCls: 'icon_delete',
		tooltip: 'Delete Menu',
		handler:function(view,rowIndex,colIndex,item,e){

			var model = view.getStore().getAt(rowIndex)
			if (confirm("Delete Menu '{title}'?".format(model.data))){
				var v = view.up("menu_main_grid");
				v.fireEvent("delete_menu",{
					src:v,
					model:model
				})
			}
		}

	}, {
		text: 'Title',
		width:100,
		sortable: true,
		editor:{
			allowBlank:false,
			xtype:"textfield"
		},
		dataIndex: 'title'

	},{
		text: 'Base Directory',
		flex:1,
		sortable: true,
		editor:{
			allowBlank:false,
			xtype:"textfield"
		},
		dataIndex: 'base_dir'

	},{
		text: 'Menu Name',
		width:100,
		sortable: true,
		editor:{
			allowBlank:false,
			xtype:"textfield"
		},
		dataIndex: 'name'

	},{
		width: 55,
		tooltip: "Edit Menu's Sections",
		renderer: function(val,md,record){
			var id =Ext.id();
			return new Ext.Template(
				'<a id="{id}" href="#" onclick="{onclick}">{val}</a>',
			'').apply({
				onclick:C.genClickFunction(
					id,
					"menu_main_grid",
					"edit_sections",
					record
				),
				val:"Sections",
				id:id
			});
		}
	}],
	listeners:{
	},
	initComponent:function(config){

		this.callParent(arguments);
		this.on("edit",function(editor,e){
			this.fireEvent("save_menu",{
				src:this,
				model:e.record
			})
		})
	}
})