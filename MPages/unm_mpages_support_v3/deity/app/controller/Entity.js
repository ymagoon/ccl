Ext.define('MPAGE.controller.Entity', {
	extend: 'Ext.app.Controller',
	views:[
		"EntityMainGrid"
	],
	init: function() {
		var controller = this;
		this.control({
			'entity_main_grid': {
				add_entity:function(event){
					var s =event.src.getStore() 
					s.add(new s.model({
						section_id:s.getProxy().extraParams.section_id
					}))
				},
				save_entity: function(event){
					this.saveEntity(event.model)
				},
				delete_entity: function(event){
					this.deleteEntity(event.model)
				},
			}
		});
	},
	saveEntity:function(model,cb){
		console.log("got here");
		model.save({
			callback:function(record){
				if (cb) cb(record);
			}
		})
	},
	deleteEntity:function(model,cb){
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