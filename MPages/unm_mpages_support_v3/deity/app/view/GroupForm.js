/*jshint undef:false*/
Ext.define('MPAGE.view.GroupForm', {
	extend: 'Ext.form.Panel',
	alias:'widget.group_form',
	width:400,
	layout: {
		type: 'vbox',
		align:"stretch"
	},
	frame:true,
	defaults:{
		labelStyle:"font-weight:bold",
		labelWidth:170
	},
	buttons:[{
		text:"Delete",
		hidden:this.appEdit||this.permEdit,
		handler:function(b){
			var view = b.up("group_form")
			view.fireEvent("delete_group",{
				src:view,
				model:view.form.currentRecord
			})

		}
	},{
		text:"Save",
		hidden:this.appEdit||this.permEdit,
		handler:function(b){
			var view = b.up("group_form")
			var form = view.form
			if (form.isValid()){
				form.updateRecord(form.currentRecord);
				view.fireEvent("save_group",{
					src:view,
					model:view.form.currentRecord
				})
			}
		}
	}],
	initComponent:function(){
		Ext.apply(this,{
			items:[
				{
					name:"alias",
					fieldLabel:"Group Name",
					hidden:this.appEdit||this.permEdit,
					xtype:"textfield"
				},
				{
					border:false,
					bodyCls:C.frameClass,
					xtype:"fieldcontainer",
					fieldLabel:"Members",
					items:[
						{
							xtype:"button",
							iconCls:"icon_find",
							text:"Add",
							handler:function(c){
								var view=c.up("group_form");
								C.showWin("Add Members",{
									xtype:"supagrid",
									store:"ROSearch",
									selModel:Ext.create("Ext.selection.CheckboxModel",{}),
									columns:[
										{dataIndex:"alias", text:"Alias", flex:1},
										{dataIndex:"model", text:"Type"},
										{dataIndex:"previously_added", text:"In Group?"},
										{dataIndex:"query", text:"Search", filterable:true, hidden:true}
									].map(function (col) {
										col.renderer = function (val,meta,record) {
											if (record.get("previously_added") == 'Yes'){
												meta.tdCls="added_memeber"
											}
											return val
										}
										return col
									}),
									filterSuppressTitle:true,
									filterButtonText:"Search",
									filterResetButtonText:"Clear Search",
									defaultFocus: "textfield",
									buttons:[{
										text:"Add Selected Members",
										iconCls:"icon_group_add",
										handler:function(c){
											var records = c.up("supagrid").getSelectionModel().getSelection();
											//records.forEach(function (record) {
												view.fireEvent("add_members",{
													view:view,
													grid:c.up("supagrid"),
													group:view.form.currentRecord,
													members:records
												})
											//})
											//c.up("window").close();

											// C.infoMsg("Adding Members...")
											// c.up("supagrid").resetFilter()
										}
									}]
								},false);
								setTimeout(function() {
									Ext.ComponentQuery.query("textfield[name=query]").first().focus();
								}, 100);

							}
						},
						{
							xtype: "button",
							text: "Merge",
							iconCls:"icon_find",
							handler: function(c) {
								// var c = button.up("group_form");
								var w = Ext.create("Ext.window.Window", {
									title: "Merge Members",
									width: 350,
									height: 100,
									items: [
										{
											xtype: 'combobox',
											width:300,
											fieldLabel:"From",
											triggerAction: 'all',
											//allQuery:"__FAIL__",
											store: "Group",
											queryMode:"local",
											displayField:'alias',
											valueField:'id',
											triggerCls:"x-form-search-trigger",
											minChars:1,
											lazyRender: true,
											listClass: 'x-combo-list-small',
											listeners:{
												select:function(d,records){
													var view = c.up("group_form");
													Ext.Msg.confirm("Confirmation", "Are you sure you want to merge members?", function(b, text) {
														debugger;
														if (b == "no") return;
														view.fireEvent("merge_group",{
															src:view,
															from:records.first(),
															to:view.form.currentRecord
														});
														d.getStore().clearFilter();
														d.setValue("");
														w.close();
													});

												}
											},
											height:40
										}
									]
								});
								w.show();
								setTimeout(function() {
									Ext.ComponentQuery.query("window combobox").first().focus();
								}, 100);
							}
						}
					]
				},
				{
					itemId:"ro_member_grid",
					xtype:"supagrid",
					preventHeader:true,
					flex:1,
					labelAlign:"top",
					store:"GroupMember",
					columns: [
						{
							xtype:'betteractioncolumn',
							width:25,
							iconCls: 'icon_delete',
							tooltip: 'Remove Member',
							handler:function(view,rowIndex){
								var model = view.getStore().getAt(rowIndex)
								var v = view.up("group_form");
								v.fireEvent("delete_member",{
									src:v,
									model:model
								})
							}
						},
						{
							text: 'Alias',
							flex: 1,
							sortable: true,
							dataIndex: 'alias'

						},
						{
							text: 'Type',
							sortable: true,
							dataIndex: 'model',
							align: 'center'

						}
					]
				}
			]
		});

		this.callParent(arguments);
	}
})