Ext.define('MPAGE.view.GroupMemberGrid', {
	extend: 'Ext.panel.Panel',
	alias:'widget.group_member_grid',
	initComponent:function(){
		Ext.apply(this,{
			layout: {
				type: 'vbox',
				align:"stretch"
			},
			bodyCls:"x-panel-body-default-framed",
			//frame:true,
			defaults:{
				labelStyle:"font-weight:bold"
			},
			items:[{
				xtype: 'combobox',
				width:300,
				fieldLabel:"Add User or Cerner Group",
				triggerAction: 'all',
				allQuery:"__FAIL__",
				store: "ROSearch",
				displayField:'alias',
				triggerCls:"x-form-search-trigger",
				minChars:3,
				multiSelect:true,
				lazyRender: true,
				listClass: 'x-combo-list-small',
				listeners:{
					select:function(c,records){
						var view = c.up("group_form");
						view.fireEvent("add_member",{
							view:view,
							group:view.form.currentRecord,
							member:records.first()
						})
						c.setValue("")
					}	
				},
				height:40
			},{
				itemId:"ro_member_grid",
				xtype:"supagrid",
				preventHeader:true,
				flex:1,
				tbar:[{
					xtype:"label",
					text:"Members:",
					style:"font-weight:bold"
				},{
					xtype:"tbfill"
				},{
					xtype:"label",
					text:"Add User or Cerner Group:"
				
				}],
				store:"GroupMember",
				columns: [{
					xtype:'betteractioncolumn',
					width:25,
					iconCls: 'icon_delete',
					tooltip: 'Remove Member',
					handler:function(view,rowIndex,colIndex,item,e){
						var model = view.getStore().getAt(rowIndex)
						//if (confirm("Delete Application '{app_name}'?".format(model.data))){
							var v = view.up("group_form");
							v.fireEvent("delete_member",{
								src:v,
								model:model
							})
						//}
					}
				},{
					text: 'Alias',
					flex: 1,
					sortable: true,
					dataIndex: 'alias'
					
				},{
					text: 'Type',
					//flex: 1,
					sortable: true,
					dataIndex: 'model',
					align: 'center'
					
				}]
			}]
		
		})	
		
		this.callParent(arguments);
		/* if (this.current_record){
			this.loadRecord(this.current_record)
		} */
	}
})