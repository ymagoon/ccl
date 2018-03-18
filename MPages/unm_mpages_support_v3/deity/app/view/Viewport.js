Ext.define("MPAGE.view.Viewport", {
	extend: 'Ext.container.Viewport',
	requires: [
		
	],
	defaults: {
		//border:false
		//bodyStyle: "background-color: #ffffff;"
	},
	addCenterTab:function(config,ordinal){
		Ext.apply(config,{
			closable:true
		})
		var tabPanel = this.down("*[itemId=center_tabs]");
		tabPanel.show();
		if (tabPanel.items.containsKey(config.id)){
			tabPanel.setActiveTab(config.id)
		}else {
			if (ordinal != undefined){
				tabPanel.insert(ordinal,config);	
			} else {
				tabPanel.add(config);
			}
			tabPanel.setActiveTab(config.id)
		}
		
	},
	layout: 'fit',
	items:[{
		frame:false,
		layout:"fit",
		border:false,
		
		items:[{//center_tabs
			itemId:"center_tabs",
			//hidden:true,
			xtype:"tabpanel",
			autoDestroy:true,
			activeTab:0,
			items:[
				"app_main_grid",
				"right_main_grid",
				"group_main_grid",
				"perm_main_grid",
				"menu_main_panel"
			].map(function(xtype){
				return {
					xtype:xtype,
					closable:false
				}
			}),
			listeners: {
				afterrender:function(p){
					
					
				}
			}
			
		}]
	}]
		
});