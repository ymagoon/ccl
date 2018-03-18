Ext.define('MPAGE.view.SectionMainGrid', {
	extend: 'Ext.grid.Panel',
	alias:'widget.section_main_grid',
	title:"Sections",
	//iconCls:"icon_menu",
	tbar:[{
		text:"Add Section",
		iconCls:"icon_menu_add",
		handler:function(b){
			var view =b.up("section_main_grid");
			view.fireEvent("add_section",{src:view})
		}
	},{
		//xtype:"tbfill"
	},{
		xtype:"tbtext",
		baseCls:"help",
		text:"Click a row to view Links, Double-Click to edit section"
	},{
		xtype:"tbfill"
	}],
	store:"Section",
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
		tooltip: 'Delete Section',
		handler:function(view,rowIndex,colIndex,item,e){
			
			var model = view.getStore().getAt(rowIndex)
			if (confirm("Delete Section '{name}'?".format(model.data))){
				var v = view.up("section_main_grid");
				v.fireEvent("delete_section",{
					src:v,
					model:model
				})
			}
		}
			
	},{
		text: 'Section Name',
		width:100,
		sortable: true,
		flex:1,
		editor:{
			allowBlank:false,
			xtype:"textfield"
		},
		dataIndex: 'name'
		
	},{
		text: 'weight',
		width:100,
		editor:{
			allowBlank:false,
			xtype:"numberfield"
		},
		sortable: true,
		dataIndex: 'weight'
		
	}],
	listeners:{
	},
	initComponent:function(config){
		
		this.callParent(arguments);
		this.on("edit",function(editor,e){
			this.fireEvent("save_section",{
				src:this,
				model:e.record
			})
		})
	}
})