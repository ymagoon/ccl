//everyone can use the menu
C.options.dontAcl=true;


// Global requirements. Generally these should be set on the classes that
// actually need them
/*
Ext.Loader.setPath("MPAGE", "app");
Ext.require([

])
*/


// extra paths
//Ext.Loader.setPath("Ext.ux", "../ext/extjs-4.1.0/examples/ux");

Ext.application({
	name: "Ostrich",//this can be whatever you want, but watch make sure the setPath above matches
	appFolder: "app",
	requires: [ //app requirements, ideally ONLY for the the app controller

	],
	stores:[//global stores
		"Applications"
	],
	models:[//global models
		"Application"
	],
	controllers: C.controllers.concat([
		//put your controllers here, either "APP.controller.NAME" or just "NAME"
		"Applications"
	]),
	autoCreateViewport: true,
	launch: function() {
	}
})




