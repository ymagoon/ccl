/*global
	Ext:true,
	C:true
	univnm:true
	$env:true
	MPAGE:true
*/
Ext.Loader.setPath("MPAGE", "app");

//univnm.jslib.ccl_callback.defaults.historySize = 20;
C.options.dontAcl=true;
var sections=[
	"Application",
	"Right",
	"Group",
	"Perm",
	"Menu",
	"Section",
	"Entity"
];
var baseRights =[
	"{app_name}",
	"{app_name}/admin",
	"trogdor/{app_name}",
	"trogdor/{app_name}/admin",
	"build/{app_name}",
	"build/{app_name}/admin"
];
Ext.require([
		"univnm.ext.BetterActionColumn",
		"univnm.ext.RowProxy",
		"univnm.ext.SequenceGenerator",
		"univnm.db",
		"univnm.ext.SupaGrid"
],function () {
	univnm.ext.SupaGrid.prototype.filterOnSelect =true;	
});

var edit_app =univnm.jslib.getQuerystring("edit_app",false);
var edit_group_id =0;
univnm.jslib.load_mpage_ids();
if (edit_app && C.hasAccess(edit_app + "/admin")){
	if ($env.instance) edit_app = $env.instance +"/" +edit_app;
	
	C.options.dontAcl=true;
	Ext.define("MPAGE.view.Viewport", {
		extend: 'Ext.container.Viewport',
		requires:["MPAGE.view.GroupMemberGrid"],
		layout: 'fit',
		items:[{
				hidden:true
		},{
			xtype:"group_form",
			appEdit:true,
			preventHeader:true
		}],
		listeners:{
			render:function(p){
				var edit_group_id = univnm.db.query([
					'select id',
					'from cust_aros',
					'where alias=\'{edit_app}\' ',
					
				''],window)[0].id;
				MPAGE.model.Group.load(edit_group_id,{
					callback:function(record){
						var form =p.down("group_form").form;
						form.currentRecord =record;
						form.loadRecord(record);
						Ext.StoreMgr.get("ROSearch").getProxy().extraParams.pid =record.data.id;
						var ms = Ext.StoreMgr.get("GroupMember");
						ms.getProxy().extraParams.pid =record.data.id;
						ms.load();
					}
				});
			}
		}
			
	});
}

Ext.application({
	name: "MPAGE",
	appFolder: "app",
	requires: [
	],
	stores:sections.concat([
		"ROSearch",
		"GroupMember"
	]),
	models:sections.concat([
			
	]),
	controllers: C.controllers.concat(sections),
	autoCreateViewport: true,
	launch: function() {
	}
});


//hack for loadMasks
Ext.override(Ext.view.AbstractView, {
    onRender: function()
    {
        var me = this;
        this.callOverridden();

        if (me.loadMask && Ext.isObject(me.store)) {
            me.setMaskBind(me.store);
        }
    }
});

