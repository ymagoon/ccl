/* for testing only */
C.options.dontAcl=true;



// extra paths
//Ext.Loader.setPath("Ext.ux", "../ext/extjs-4.1.0/examples/ux");


// Global requirements. Generally these should be set on the classes that
// actually need them
Ext.require([
	"univnm.ext.RowProxy",
	"univnm.ext.SequenceGenerator"
]);
Ext.application({
	name: "MPAGE",//this can be whatever you want, but watch make sure the setPath above matches
	appFolder: "app",
	requires: [ //app requirements, ideally ONLY for the the app controller
		
	],
	stores:[//global stores
			
	],
	models:[//global models
			
	],
	controllers: C.controllers.concat([
		//put your controllers here, either "APP.controller.NAME" or just "NAME"
	]),
	autoCreateViewport: true,
	launch: function() {
	}
});

