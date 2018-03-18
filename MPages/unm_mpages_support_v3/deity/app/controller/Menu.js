Ext.define('MPAGE.controller.Menu', {
	extend: 'Ext.app.Controller',
	views:[
		"MenuMainPanel",
		"MenuMainGrid"
	],
	init: function() {
		var controller = this;
		this.control({
			'viewport': {
				menu_menu: this.menuClick
			},
			'menu_main_grid': {
				add_menu:function(event){
					var s =event.src.getStore()
					s.add(new s.model())
				},
				save_menu: function(event){
					this.saveMenu(event.model)
				},
				delete_menu: function(event){
					this.deleteMenu(event.model)
				},
				select:function(selModel, record, rowIndex,eOpts){
					this.loadRelated(record)
				},
				edit_sections: function(event) {
					this.editSections(event.value);
				}
			}

		})
	},
	loadRelated:function(model){
		var id = model?model.get("id"):0;
		var s =Ext.StoreMgr.get("Section")
		s.getProxy().extraParams.menu_id = id
		s.load();
	},
	saveMenu:function(model,cb){
		var $this = this;
		model.save({
			callback:function(record){
				$this.loadRelated(record);
				if (cb) cb(record);
			}
		})
	},
	deleteMenu:function(model,cb){
		var $this = this;
		model.destroy({
			callback:function(record){
				$this.loadRelated(null);//clear selection
				record.stores.forEach(function(store){
					store.remove(record);
				})
				if (cb) cb(record);
			}
		})

	},

	menuClick:function(){
		Ext.ComponentQuery.query("viewport")[0].addCenterTab({
			id:"menu_main",
			xtype:"menu_main_panel"
		})
	},

	editSections: function(record) {
		this.loadRelated(record);
		var w = Ext.create("Ext.window.Window", {
			title: "Edit Sections",
			modal: true,
			width: 500,
			height: 300,
			layout: "fit",
			items: [
				{
					xtype: "section_main_grid",
					flex: 1,
					preventHeader: true
				}
			]
		});
		w.on({
			"destroy": function() {
				this.loadRelated(record);
			},
			scope: this
		})
		w.show();
	}
});