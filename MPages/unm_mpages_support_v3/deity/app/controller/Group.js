/*jshint undef:false*/
Ext.define('MPAGE.controller.Group', {
	extend: 'Ext.app.Controller',
	requires:[
		"MPAGE.view.GroupMainGrid",
		"MPAGE.view.GroupForm"
	],
	init: function() {
		//var controller = this;
		this.control({
			'viewport': {
				menu_group: this.menuClick
			},
			'group_main_grid':{
				add_group:function(event){
					event.src.showEditForm()
				}
			},
			'group_main_grid > group_form':{
				beforegridload:function(fp,record){
					Ext.StoreMgr.get("ROSearch").getProxy().extraParams.pid =record.data.id
					var ms = Ext.StoreMgr.get("GroupMember");
					ms.getProxy().extraParams.pid =record.data.id
					ms.load()
				}
			},
			'group_form':{
				
				save_group: function(event){
					this.saveGroup(event.model,function(){
						C.infoMsg("Group '{alias}' saved".format(event.model.data))
					})
				},
				merge_group: function(event){
					event.src.el.mask("Merging members")
					this.mergeGroup(event.from,event.to,function(){
						event.src.down("*[itemId=ro_member_grid]").getStore().load({
							callback:function(){
								event.src.el.unmask();
							}
						})
					})
				},
				delete_group:function(event){
					event.src.form.close()
					this.deleteGroup(event.model,function(){
						C.infoMsg("Group '{alias}' removed".format(event.model.data))
					})
				},
				add_member:function(event){
					var store = Ext.StoreMgr.get("GroupMember")
					if (store.find("id",event.member.get("id") == -1)) {
						this.addMember(event.group,event.member,function(){
							store.add(event.member)
						})
					}
				},
				add_members:function(event){
					var store = Ext.StoreMgr.get("GroupMember")
					//if (store.find("id",event.member.get("id") == -1)) {
						C.infoMsg("Adding Group Members")
						this.addMembers(event.group,event.members,function(){
							
							store.load()
							event.grid.resetFilter();
						})
					//}
				},
				delete_member: function(event){
					this.deleteMember(event.model)
				}
			}
			
		});
	},
	buildMatchingPerm:function(model){
		var alias = model.get("alias");
		var permStore = Ext.StoreMgr.get("Perm");
		var rightStore = Ext.StoreMgr.get("Right");
		var rightIndex = rightStore.find("alias",alias);
		var c = this.getController("Perm")
		
		if (rightIndex != -1){
			var right = rightStore.getAt(rightIndex)
			var permIndex = permStore.findBy(function(r){
				return r.data.aro_id == model.data.id  && r.data.aco_id == right.data.id
			});
			if (permIndex == -1){
				var perm = new MPAGE.model.Perm({
					aro_id:model.data.id,
					aco_id:right.data.id
				})
			
				perm.dirty = true;
				c.savePerm(perm,function(){
					permStore.add(perm);
				})
				
			}	
		} 
	},
	mergeGroup:function(from,to,cb){
		var $this =  this;
		
		var sourceMembers = Ext.create("MPAGE.store.GroupMember",{
			extraParams:{
				pid:from.get("id")
			}
		})
		sourceMembers.load({
			callback:function(){
				univnm.jslib.async.marshal(
					//transform array of members into array of marshal functions
					sourceMembers.data.items.map(function(member){
						//transform "from" member into a new insert of this 
						//member under "to" group
						member.set({
							id:null,//will trigger lookup via natural key
							parent_id:to.get("id")//re-parent
						});
						//return marshal function that will add/update this member
						return function(done){
							member.save({
								callback:done//let marshal know this callback is complete
							})
						} 
					})
				).then(cb)//all saves are done now, call mergeGroup callback 
			}
		})
	},
	saveGroup:function(model,cb){
		var $this =  this;
		model.save({
			callback:function(record){
				$this.buildMatchingPerm(model);
				if (cb) cb(record);
			}
		})
		
	},
	deleteGroup:function(model,cb){
		model.destroy({
			callback:function(record){
				if (cb) cb(record);
			}
		})
	},
	addMember:function(group,member,cb){
		univnm.jslib.async.marshal(function(done){
			if(!group.get("id")){
				group.save({
					callback:done
				})	
			} else done();
		}).then(function(){
			member.set("parent_id",group.get("id"))
			member.save({
				callback:cb
			})
		})
		
	},
	addMembers:function(group,members,cb){
		univnm.jslib.async.sequence(
			function(done){
				if(!group.get("id")){
					group.save({
						callback:done
					})	
				} else done();
			},
			univnm.jslib.async.marshal(members.map(function (member) {
				return function (done) {
					member.set("parent_id",group.get("id"))
					member.save({callback:done})
				}
			}))
		).then(cb)
		
	},
	deleteMember:function(model,cb){
		model.destroy({
			callback:function(record){
				record.stores.forEach(function(store){
					store.remove(record)
				})
				if (cb) cb(record);
			}
		})
		
	},
	
	menuClick:function(item, EventObject, eOpts){
		Ext.ComponentQuery.query("viewport")[0].addCenterTab({
			id:"group_main",
			xtype:"group_main_grid"
		})
	}
	
});