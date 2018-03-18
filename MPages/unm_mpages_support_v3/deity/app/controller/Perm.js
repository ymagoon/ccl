Ext.define('MPAGE.controller.Perm', {
	extend: 'Ext.app.Controller',
	requires:[
		"MPAGE.view.PermMainGrid"
	],

	refs: [
		{
			selector: "perm_main_grid",
			ref: "grid"
		}
	],

	init: function() {
		var controller = this;
		this.control({
			'viewport': {
				menu_perm: this.menuClick
			},

			'perm_main_grid > group_form':{
				beforegridload:function(fp,record){
					if (record.data.aro_id) {
						MPAGE.model.Group.load(record.data.aro_id,{
							callback:function(group){
								Ext.StoreMgr.get("ROSearch").getProxy().extraParams.pid =record.data.aro_id
								var ms = Ext.StoreMgr.get("GroupMember");
								ms.getProxy().extraParams.pid =record.data.aro_id
								ms.load()
								fp.form.currentRecord = group;
								fp.form.loadRecord(group)
							}
						})
					} else {
						// return false;
						this.getGrid().down("panel[formPane=true]").hide();
					}
					/*  */

					return true;
				}
			},
			'perm_main_grid': {
				add_perm:function(event){
					var s =event.src.getStore()
					s.insert(0,new s.model())
				},
				save_perm: function(event){
					this.savePerm(event.model)
				},
				delete_perm: function(event){
					this.deletePerm(event.model)
				},
				select:function(selModel, record, rowIndex,eOpts){
					this.showEditForm(record);
					// this.loadRelated(record)
				}
			}
		});
	},
	savePerm:function(model,cb){
		model.save({
			callback:function(record){
				//TODO: create perm group and permissions entries
				if (cb) cb(record);
			}
		})
	},
	deletePerm:function(model,cb){
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
			id:"perm_main",
			xtype:"perm_main_grid"
		})
	},

	showEditForm: function(record) {
		this.getGrid().showEditForm(record);
	}

});