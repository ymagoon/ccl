Ext.define('MPAGE.controller.Right', {
	extend: 'Ext.app.Controller',
	views:[
		"RightMainGrid"
	],
	init: function() {
		var controller = this;
		this.control({
			'viewport': {
				menu_right: this.menuClick
			},
			'right_main_grid': {
				add_right:function(event){
					var s =event.src.getStore() 
					s.add(new s.model())
				},
				save_right: function(event){
					this.saveRight(event.model)
				},
				delete_right: function(event){
					this.deleteRight(event.model)
				}
				
			}
		});
	},
	buildMatchingGroup:function(model){
		var groupStore = Ext.StoreMgr.get("Group")
		//this is defined in app.js
		var alias = model.get("alias");
		var groupIndex = groupStore.find("alias",alias);
		var c = this.getController("Group")
		if (groupIndex == -1){
			var group = new MPAGE.model.Group({
				alias:alias
			})
			group.dirty = true;
			c.saveGroup(group,function(){
				groupStore.add(group);
				C.infoMsg("Group {0} created.".format(alias))
			})
			
		} else {
			c.saveGroup(groupStore.getAt(groupIndex));
		}
		
	},
	saveRight:function(model,cb){
		var $this =this;
		model.save({
			callback:function(record){
				$this.buildMatchingGroup(model)
				if (cb) cb(record);
				
			}
		})
		
	},
	deleteRight:function(model,cb){
		model.destroy({
			callback:function(record){
				record.stores.forEach(function(store){
					store.remove(record)
				})
				if (cb) cb(record);
			}
		})
		
	},
	menuClick:function(){
		Ext.ComponentQuery.query("viewport")[0].addCenterTab({
			id:"right_main",
			xtype:"right_main_grid"
		})
	}
	
});