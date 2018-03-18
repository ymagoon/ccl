Ext.define('MPAGE.controller.Application', {
	extend: 'Ext.app.Controller',
	views:[
		"AppMainGrid"
	],
	init: function() {
		var controller = this;
		this.control({
			'viewport': {
				menu_app: this.menuClick
			},
			'app_main_grid': {
				add_app:function(event){
					var s =event.src.getStore() 
					s.add(new s.model())
				},
				save_app: function(event){
					this.saveApp(event.model)
				},
				delete_app: function(event){
					this.deleteApp(event.model)
				}
				
			} 
			
			
			
		});
	},
	buildMatchingRights:function(model){
		
		var rightStore = Ext.StoreMgr.get("Right")
		var c = this.getController("Right")
		//this is defined in app.js
		baseRights.forEach(function(pattern){
			var alias = pattern.format(model.data);
			var rightIndex = rightStore.find("alias",alias);
			
			if (rightIndex == -1){
				var right = new MPAGE.model.Right({
					alias:alias
				})
				right.dirty = true;
				rightStore.add(right);
				c.saveRight(right,function(){
					C.infoMsg("Right {0} created.".format(alias))
				})
			} else {
				c.saveRight(rightStore.getAt(rightIndex));	
			}
		})
		
	},
	saveApp:function(model,cb){
		model.save({
			callback:function(record){
				if (cb) cb(record);
			}
		})
		this.buildMatchingRights(model)
	},
	deleteApp:function(model,cb){
		model.destroy({
			callback:function(record){
				if (cb) cb(record);
			}
		})
		
	},
	
	
	menuClick:function(item, EventObject, eOpts){
		
		Ext.ComponentQuery.query("viewport")[0].addCenterTab({
			id:"app_main",
			xtype:"app_main_grid"
		})
	}
	
});