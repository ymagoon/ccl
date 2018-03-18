Ext.define('MPAGE.controller.Section', {
	extend: 'Ext.app.Controller',
	views:[
		"SectionMainGrid"
	],
	init: function() {
		var controller = this;
		this.control({
			'section_main_grid': {
				add_section:function(event){
					var s =event.src.getStore()
					s.add(new s.model({
						menu_id:s.getProxy().extraParams.menu_id
					}))
				},
				save_section: function(event){
					this.saveSection(event.model)
				},
				delete_section: function(event){
					this.deleteSection(event.model)
				},
				select:function(selModel, record, rowIndex,eOpts){
					this.loadRelated(record)
				}
			},
			'menu_details': {
				tabchange: function(tabpanel, newcard, oldcard) {
					this.loadRelated(newcard.record);
				}
			}
		});
	},
	loadRelated:function(model){
		var id = model?model.get("id"):0;
		var s =Ext.StoreMgr.get("Entity")
		s.getProxy().extraParams.section_id = id
		s.load();
	},
	saveSection:function(model,cb){
		model.save({
			callback:function(record){
				if (cb) cb(record);
			}
		})
	},
	deleteSection:function(model,cb){
		model.destroy({
			callback:function(record){
				record.stores.forEach(function(store){
					store.remove(record)
				})
				if (cb) cb(record);
			}
		})

	}

});