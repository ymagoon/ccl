univnm.controller_shared=true;
Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath("univnm", "../univnm");
/*  */
/* Topic: Dependencies
	JS library dependencies

	Application Dependencies:
	* <menu>	For application name lookup
	* <deity>	ACL application (for permissions checks, and masquerading)


	JS Dependencies:
	* <univnm.jslib>
	* <univnm.ext.Notification>
	* <univnm.db>
	* <univnm.ext.QueryStore> and dependencies


*/

/* Topic: License
	The MIT License

	Copyright (c) 2012 University of New Mexico Hospitals

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
/* Class: C
	Global Object that holds information about this application and useful functions

	This is the base UI frame for all mpages.

	Features:
	* error console
	* debug console
	* automatic ACL(permissions) access test
	* stats access logging
	* runtime ACL checks
	* Profiler log
	* ccl callback log
	* PowerChart compatible console.log/error/debug
	* Display of current user, patient id, encounter id, server node, and server number
	* keyboard code to masquerade as another user or launch the permissions
		editor (controlled by ACL)

	Detail:

	This should be loaded before any controllers, views, stores, etc
	To properly init your application, you app name must be MPAGE and you must
	include C.controllers in your controllers definition:

	(code)
		Ext.application({
			name: 'MPAGE',
			controllers:C.controllers.concat([
				"MyExtraController",
				"MyOtherController"
			])
		});

	(end)

	See <C.controllers> for an example of using C.controllers in you controller
	definitions

*/
Ext.ns("C");
Ext.apply(C, {
/* Property: C.errorUrl
	url to post error reports to.
	*/
	errorUrl:"http://trogdor.health.unm.edu/main/apps/mpages/mpage_error_report.cfm",
/* Property: C.controllers
	Array of controller names to add to the application definition.

	example:
	(code)
		C.controllers.push("Perm")
		Ext.define('MPAGE.controller.Perm', {
			extend: 'Ext.app.Controller',
			...
		})
		...
		Ext.application({
			name: 'MPAGE',
			controllers:C.controllers,
			...
		})
	(end)



	*/
	controllers:[],

/* Property: C.frameClass
	Class used by Ext for frame backgrounds

	This is useful for nested panels to have a matching background to
	framed parents

	Example:
	(code)
		frame:true,
		items:[{
			region:"north",
			height:125,
			bodyCls:C.frameClass,
		...
	(end)

	*/
	frameClass:"x-panel-body-default-framed",

/* Function: C.about
		Displays the "about" screen. This is the same window triggered by
		clicking the "help" tool

		Parameters:
			errorText		-	*Optional*
								If defined, this text will be displayed in an
								"error" tab

	*/
	about:function(errorText){
		Ext.widget("controller_about",{
			errorText:errorText
		});

	}
});

/* Function: C.infoMsg
	displays an informational message in a "growl" like pop-up window

	Parameters:
		template	-	Text to display. Numbered replacement variables
						"{0},{1}...{n}" will be replaced with any following
						parameters

	Example:
	(code)
		C.infoMsg("Comment Saved");
		C.infoMsg("User '{0}' not found in system",input.value);

	(end)
	*/
	C.infoMsg= function(template/*,replacement 1,replacement 2,... */){
		var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
		Ext.create('widget.uxNotification', {
			title: 'Notification',
			corner: 'tr',
			//stickOnClick: false,
			manager: 'center_tabs',
			iconCls: 'ux-notification-icon-information',
			slideInDuration: 800,
			//closable:false,
			slideBackDuration: 1500,
			slideInAnimation: 'elasticIn',
			slideBackAnimation: 'elasticIn',
			cls: 'ux-notification-light',
			html: s
		}).show();
	};
/* Function: C.loadValues
	loads values fro this applicaiton from cust_values

	Parameters:
		callback	-	Function.
						*Optional, default null*
						if defined, causes this load to be asynchronous, and
						this callback will be called when C.values is populated

	Detail:
		loads values associated with this application and the current user into
		C.values. Normally a synchronous call, if _callback_ is passed
		loadValues is called asynchronously and _callback_ is called when values
		are loaded.

		If values have already been loaded, this function will return immediately

	See:
		* <C.options.loadValues>
		* <C.saveValue>
		* <C.deleteValues>


	*/
	C.loadValues=function(callback){
		console.error("Deprecated - call C.Settings.load() instead");
		C.Settings.load();
		if (typeof callback == "function") return callback();
	};
/* Function: C.saveValue
	Saves a value to cust_values
		Parameters:
			key			-	String key
			value		-	value (Object, Array, Number, Date or String) to save.
							Complex objects will be JSON encoded in the database
			callback	-	Function. If set, the save is async and this
							function is called when complete.
	*/
	C.saveValue = function(key, value, callback){
		console.error("Deprecated - call C.Settings.app.set() instead");
		if (key.listLen(".") > 1 && key.listFirst(".") == univnm.user_id){
			return C.saveUserValue(key.listAfter("."),value,callback);
		}
		C.Settings.app.set(key,value);
		if (typeof callback == "function") return callback();
	};
/* Function: C.saveUserValue
	Saves a value to cust_values, specific to the current user, these values
	will only be loaded again for this user.

		Parameters:
			key			-	String key
			value		-	value (Object, Array, Number, Date or String) to save.
							Complex objects will be JSON encoded in the database
			callback	-	Function. If set, the save is async and this
							function is called when complete.
	*/
	C.saveUserValue = function(key, value, callback){
		console.error("Deprecated - call C.Settings.user.set() instead");
		C.Settings.user.set(key,value);
		if (typeof callback == "function") return callback();
	};
/* Function: C.deleteValue
	Deletes a specific key from cust_values for the current application

	Parameters:
		key			-	key to remove
		callback	-	if defined, the delete is async and this function
						is executed when value is removed
	*/
	C.deleteValue=function(key,callback){
		console.error("Deprecated - call C.Settings.app.remove() instead");
		C.Settings.app.remove(key);
		if (typeof callback == "function") return callback();
	};
/* Function: C.deleteUserValue
	Deletes a specific key from cust_values for the current application and user

	Parameters:
		key			-	key to remove
		callback	-	if defined, the delete is async and this function
						is executed when value is removed
	*/
	C.deleteUserValue=function(key,callback){
		console.error("Deprecated - call C.Settings.user.remove() instead");
		C.Settings.app.remove(key);
		if (typeof callback == "function") return callback();
	};
/* Function: C.deleteUserValues
	Deletes all user values for the current user, normally called by the "reset"
	button in the "about" window

	Parameters:
		callback	-	optional callback function that is executed when values
						are removed
	*/
	C.deleteUserValues=function(callback){
		console.error("Deprecated - call C.Settings.user.resetAll() instead");
		return C.Settings.user.resetAll(callback);
	};
/* Function: C.showWin
	Opens a large centered window with the supplied config

	Parameters:
		title	-	title of the window
		config	-	Ext config object for window content
		modal	-	Boolean.
					*Optional, default false*
					Should the window be modal?
	*/
	C.showWin=function(title,config,modal){
		var body = Ext.get(document.body);
		var win=new Ext.Window({
			title:title,
			width:Math.min(body.getWidth(1)-100,800),
			height:body.getHeight(1)-100,
			closeable:true,
			maximizable:true,
			modal:modal,
			layout:"fit",

			items:[config]
		});
		win.show();
	};
/* Function: C.showWinText
	Opens a large centered window with the supplied plain text content

	Parameters:
		title	-	title of the window
		text	-	plain text to display
		modal	-	Boolean.
					*Optional, default false*
					Should the window be modal?
	*/
	C.showWinText=function(title,text,modal){
		var body = Ext.get(document.body);
		C.showWin(title,{
			autoScroll:true,
			width:Math.min(body.getWidth(1)-100,800),
			height:body.getHeight(1)-100,
			closeable:true,
			maximizable:true,
			modal:modal,
			xtype:"textarea",
			value:text
		});

	};
/* Function: C.showWinHtml
	Opens a large centered window with the supplied html content

	Parameters:
		title	-	title of the window
		html	-	html to display
		modal	-	Boolean.
					*Optional, default false*
					Should the window be modal?
	*/
	C.showWinHtml=function(title,html){
		C.showWin(title,{
			autoScroll:true,
			title:title,
			width:Math.min(body.getWidth(1)-100,800),
			height:body.getHeight(1)-100,
			closeable:true,
			maximizable:true,
			modal:modal,
			html:html
		});

	};
/* ---------------- isEmpty ------------------------------------------------- */
	C.isEmpty=function(obj){
		for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
		}
		return true;
	};
/* ---------------- stupid xtype fix ---------------------------------------- */
	Ext.ClassManager.instantiateByAlias=function() {
		var alias = arguments[0],
			args = Array.parse(arguments),
			className = this.getNameByAlias(alias);

		if (!className) {
			className = this.maps.aliasToName[alias];
			if (!className) {
				C.console.log(args[1],"Config Object");
				throw new Error("Unknown xtype: " + alias);
			}


			Ext.syncRequire(className);
		}

		args[0] = className;

		return this.instantiate.apply(this, args);
	};
/* ---------------- hack for loadMasks -------------------------------------- */
	if ((Ext.versions.core.major == 4 && Ext.versions.core.minor > 0) || (Ext.versions.core.major > 4)) {
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
	}
/* ---------------- redirect to external login is configured ---------------- */
	if (
		$env.mpageType == "external" &&
			$env.loginUrl &&
			!jaaulde.utils.cookies.get("CAC_"+$env.domain)
	){
	var url = $env.loginUrl + "?domain={0}&callback={1}&appname={2}".format(
			$env.domain,
			encodeURIComponent(location.href)
		);

		//debugger;
		location.href=url;
	}

/* =================== Classes ============================================== */
	/* ----------- C.AdminView ---------------------------------------------- */
		Ext.define('C.AdminView' ,{
			extend: 'Ext.window.Window',
			alias: 'widget.admin_view',

			title:"Admin View",
			modal:true,
			autoShow:true,

			items:[{
				frame:true,
				items:[{
					xtype: 'combobox',
					width:300,
					triggerAction: 'all',
					allQuery:"__FAIL__",
					fieldLabel:"Re-login as",
					store: {
						//storeId:"admin_view_masq",
						//autoLoad:true,
						proxy:{
							type:"query",
							sql:[
								'select ',
									'person_id user_id,',
									'name_full_formatted alias',
								'from prsnl p',
								'where 1=1',
									'<tpl if="query"> ',
										'and (',
											'p.name_last_key like upper(\'{query}%\')',
											'or ',
											'p.name_first_key like upper(\'{query}%\')',
										')',
									'</tpl>',
									'and active_ind = 1',
								'order by 2',
							''].join("\n")
						},
						pageSize:10000,
						remoteSort:false
					},
					displayField:'alias',
					valueField:'user_id',
					triggerCls:"x-form-search-trigger",
					minChars:1,
					lazyRender: true,
					listClass: 'x-combo-list-small',
					listeners:{
						select:function(combo,recArray){
							var user_id = recArray.first().get("user_id");
							var url =location.href;
							this.up("window").close();
							location.href = url.listBefore("?")+"?" +
								(url.listAfter("?").replace(/&?user_id=\d+/g,"")||"d=0") +
								"&user_id=" + user_id;

						}
					}
				}],
				buttons:[{
					xtype:"button",
					text:"Launch MPage Permissions...",
					handler:function(){
						this.up("window").close();
						location.href="../deity/index.html";

					}
				}]
			}],
			listeners:{

			},
			initComponent:function(){
				this.callParent(arguments);
			}
		});
	/* ----------- univnm.ext.CCLProvider ----------------------------------- */
		Ext.define('univnm.ext.CCLProvider', {
			extend: 'Ext.state.Provider',

			constructor: function(config){
				var me = this;
				me.app_name = 'general';
				me.callParent(arguments);
				me.state = me.readState();
			},

			// private
			set: function(name, value){
				var me = this;
				if(typeof value == "undefined" || value === null){
					me.clear(name);
					return;
				}
				me.setState(name, value);
				me.callParent(arguments);
			},

			// private
			clear: function(name){
				this.clearState(name);
				this.callParent(arguments);
			},

			// private
			readState: function(){
				return C.values;
				//return(C.values_mine);
				/* var me = this;
				var values = C.values;

				var my_id = ''+univnm.user_id+'.';
				var defaultValues = {};
				var values_mine = values.filter(function(element, index, array){
					if(element.key.match(my_id) !== -1){
						var key_cleaned = element.key.replace(my_id, '');

						defaultValues[key_cleaned] = element.value;
						return(true);
					}
					return(false);
				});
				return defaultValues; */
			},

			// private
			setState: function(name, value){
				C.Settings.user.set(name, value);
			},

			// private
			clearState: function(name){
				C.Settings.user.remove(name);
			}
		});
	/* ----------- MPAGE.controllers.ControllerInit ------------------------- */
		C.controllers.push("MPAGE.controller.ControllerInit");
		Ext.define('MPAGE.controller.ControllerInit', {
			extend: 'Ext.app.Controller',
			requires:[
				"univnm.db",
				"univnm.ext.QueryStore",
				"univnm.ext.SupaGrid",
				"univnm.ext.Notification"

			],
			init: function() {
				this.control({
					'viewport':{
						afterrender:function(viewport){
							var mp = viewport.down("panel");
							var title = C.options.displayName;
							if (!C.options.suppressTitle){
								if ($env.purpose.toUpperCase() != 'PROD'){
									title += ' <span style="width:97%;font-size:1.3em;background-color:red;margin-left:10px; color:white; text-align:center; font-weight:bold;padding:4px;">TESTING: This information for non-clinical use ONLY</span>';
								}
								mp.setTitle(title);
								mp.updateHeader();

								C.tools.forEach(function(tool){
									// if (mp.header.items.length <= 1){
										mp.header.items.add(new Ext.panel.Tool(tool));
									// }
								});


								mp.ownerCt.doLayout();
							}
							if (Ext.Loader && Ext.Loader.history.length && $env.compilerUrl){
								window.setTimeout(function(){
									var url = $env.compilerUrl +
									"/main/build_dependencies/{name}?list={list}&paths={paths}&projectRoot={projectRoot}".format({
										name:C.options.appname,
										list:Ext.Loader.history.join(),
										projectRoot:$env.projectRoot,
										paths:univnm.jslib.jsonEncode(Ext.Loader.config.paths)
									});
									univnm.jslib.loadScript(url);
								});

							}
							C.Settings.fireQueuedEvents();
						},
						controller_about:function(event){
							C.about();
						}
					}
				});
			}



		});
	/* ----------- MPAGE.controllers.Test ----------------------------------- */
		C.controllers.push("MPAGE.controller.Test");
		Ext.define("MPAGE.controller.Test", {
			extend: "Ext.app.Controller",
			firstRun: true,

			init: function(app) {
				var $this = this;
				app.on("test", function() {
					$this.testApp(app.name);
				});
				this.control({
					"controller_about": {
						run_tests: this.runtests_click
					}
				});

			},

			runtests_click: function(b) {
				this.application.fireEvent("test");
			},

			defineInsanity: function() {

				this.firstRun = true;
			},

			testApp: function(appName) {
				var ctModules = 0, completeModules = 0;
				var app_total = 0, app_passed = 0;
				var failed = false;
				var me = this;

				if (!this.firstRun) return this.defineInsanity();
				this.firstRun = false;

				var store = Ext.create("Ext.data.Store", {
					fields: [
						"class",
						"name",
						"passed",
						"message",
						"stack"
					],
					groupField: "class"
				});
				var handler = function(controller) {
					var done = $profiler.status("Testing " + controller.$className);
					var callback = function(className, total, passed, results) {
						completeModules++;
						app_total += total;
						app_passed += passed;

						for (var r in results) {
							store.add({
								"class": className,
								name: r,
								passed: results[r].ok,
								message: results[r].message,
								stack: results[r].stack
							});
						}
						if (completeModules == ctModules) {
							/* show results */
								var failures = store.data.items.reduce(function(outV, record) {
									if (!record.data.passed) {
										outV.push(record.get("class"));
									}
									return outV;
								}, []).getUnique();
								var testPane = Ext.ComponentQuery.query("controller_about  *[itemId=test_pane]").first();
								testPane.removeAll();
								testPane.add({
									xtype: "grid",
									features: [{ftype:'grouping'}],
									left: 0,
									top: 0,
									tbar: [{
										xtype: "toolbar",
										items: [{
											xtype: "tbtext",
											text: app_passed + " passed of " + app_total + " attempted"
										}]
									}],
									columns: [
										{
											header: "Test Name",
											dataIndex: "name",
											flex: 2
										},
										{
											header: "Passed",
											dataIndex: "passed",
											flex: 1
										},
										{
											header: "Message",
											dataIndex: "message",
											flex: 3
										}
									],
									store: store,
									listeners: {
										itemdblclick: function (grid, record) {
											if (record.get("stack"))
												Ext.Msg.alert(record.get("message"), record.get("stack"));
										}
									}
								});


								setTimeout(function() {
									var grouping = testPane.down("grid").view.features.reduce(function(expectedFeature, feature) {
										if (feature.ftype == "grouping") return feature; else return expectedFeature;
									}, null);
									if (!grouping) return;
									grouping.collapseAll();
									failures.forEach(function(group) {
										grouping.expand(group);
									});
								});

						}
						done();
					};

					me.doUnitTests(controller, callback);
				};

				var modules = univnm.ObjectLib.getProperties(Ext.ClassManager.classes);
				ctModules = modules.length;
				modules.forEach(function(klass) {
					var c = klass.split(".").reduce(function(object, property) {
						return object[property];
					}, window);
					if (c && c.prototype && c.prototype.$className && c.prototype.tests) {
						handler.call(this, c.prototype);
					} else {
						ctModules--;
					}
				}, this);
			},

			doUnitTests: function(classdef, callback) {
				var totalTests = ("tests" in classdef)? Object.keys(classdef.tests).length: 1,
					completedTests = 0,
					results = {},
					passedTests = 0,
					subject = "",
					recorder = function(key, unitOk, message, stack) {
						completedTests++;
						results[key] = { ok: unitOk, message: message, stack: stack };
						passedTests += unitOk? 1: 0;
						if (completedTests == totalTests) {
							callback(classdef.$className, totalTests, passedTests, results);
						}
					},
					tester = function(obj, method, key) {
						try {
							var caution = setTimeout(function() {
								if (obj.id) {
									C.infoMsg("I've flipped the hourglass of truth more than once since " + key + " has been running on " + obj.id);
								} else {
									C.infoMsg("I've flipped the hourglass of truth more than once since " + key + " started running on " + obj.$className);
								}
							}, 30000);
							var f = method.call(obj, function(unitOk, message) {
								recorder(key, unitOk, message);
								clearTimeout(caution);
							});
							if (typeof f != "undefined") {
								clearTimeout(caution);
								recorder(key, f, "Callback to pass message");
							}
						} catch (e) {
							recorder(key, false, e.message, e.stack);
						}
					},
					instances = [];

				if (!("tests" in classdef) || Object.keys(classdef.tests).length === 0) {
					return callback(classdef.$className, 0, 0, {});
				}
				var tests = classdef.tests, key;
				for (key in tests) {
					subject = tests[key];
					if (typeof subject == "function") {
						tester(Ext.create(classdef.$className, {}), tests[key], key);
					} else if (typeof subject == "object") {
						if (!("fn" in subject)) {
							recorder(key, false, "`fn` must be defined in complex unit tests");
							continue;
						}
						switch (subject.source) {
							case "query":
								instances = Ext.ComponentQuery.query(subject.query);
								if (instances.length === 0) {
									// if no matching elements, result is defined by the emptyOk setting
									recorder(key, "emptyOk" in subject);
								} else {
									// increase totalTests by the matching number of elements minus the
									// automatic test we got by counting # of tests above
									totalTests += (instances.length-1);
									instances.forEach(function(el) {
										tester(el, subject.fn, key + ": " + el.id);
									});
								}
								break;
							case "singleton":
								if (!("alias" in subject)) {
									recorder(key, false, "`alias` must be defined for singleton tests");
									continue;
								}
								if (classdef instanceof Ext.data.Store) {
									instances = Ext.data.StoreManager.get(subject.alias);
								} else if (classdef instanceof Ext.data.Model) {
									instances = Ext.data.ModelManager.get(subject.alias);
								} else if (classdef instanceof Ext.app.Controller) {
									instances = this.get(subject.alias);
								} else {
									throw("Don't know how to get a singleton for `" + obj.$className + "` object ");
								}
								tester(instances, subject.fn, key);
								break;
							case "this":
								tester(Ext.create(classdef.$className, {}), subject.fn, key);
								break;
						}
					}
				}
			}
		});
	/* ----------- C.ControllerAbout ---------------------------------------- */
		Ext.define('C.ControllerAbout', {
			extend: 'Ext.window.Window',
			alias:'widget.controller_about',
			statics:{
				loading:false
			},
			constructor:function(config){
				if (C.ControllerAbout.loading) return;
				C.ControllerAbout.loading=true;
				var name=C.options?C.options.displayName||C.options.appname||"":"";
				var body = Ext.get(document.body);
				var isDBA = !!C.localMode||univnm.db.query([
					'Select',
						'code_value,',
						'display',
					'From',
						'code_value cv join prsnl p on (',
							'p.position_cd = cv.code_value',
						')',
					'Where',
						'1=1',
						'and code_set= 88',
						'and cv.active_ind= 1',
						'and display=\'DBA\'',
						'and p.person_id = {user_id} ',
				''],univnm).length;
				var tb;
				Ext.applyIf(config,{
					title:name +", version " + ($env.version||""),
					autoShow:true,
					layout:"fit",
					modal:true,
					width:Math.min(body.getWidth(1)-100,800),
					height:body.getHeight(1)-100,
					closeable:true,
					maximizable:true,
					items:[{
						xtype:"tabpanel",
						activeTab:0,
						//stateful: false,
						items:tb=[{//tab "reset"
							title:"Reset",
							layout:"anchor",
							frame:"true",
							items:[{
								xtype:"button",
								text:"RESET all of my CUSTOM SETTINGS for this Application ",
								handler: function(){
									C.Settings.user.resetAll(function(){
										alert("User settings reset. Click OK to reload MPage.");
										location.href=location.href;
									});
								}
							}]
						}]
					}]
				});


				tb.unshift({//tab Debugging
					title:"Debugging",
					//xtype:"form",
					frame:"true",
					layout:"border",
					//stateful: false,
					items:[{//north - variables
						region:"north",
						height:125,
						//bodyStyle:"padding:10px;",
						bodyCls:C.frameClass,
						layout:{
							type:"hbox",
							align:"stretch",
							defaultMargins:{left:2,right:2,top:2,bottom:2}
						},
						defaults:{
							//layout:"form",
							frame:true,

							//bodyCls:C.frameClass,
							border:false,
							autoScroll:true,
							defaults:{

								labelStyle:"font-weight:bold"
							},
							flex:1
							//columnWidth:.333
						},

						items:[{
							items:[{
								xtype:"displayfield",
								fieldLabel:"User",
								//labelAlign:"top",
								width:240,
								value:univnm.full_name + " (" +univnm.user_id+")"
							},{
								xtype:"displayfield",
								fieldLabel:"Patient ID",
								value:univnm.patient_id
							},{
								xtype:"displayfield",
								fieldLabel:"Encounter ID",
								value:univnm.encounter_id
							}]
						},{
							items:[{
								xtype:"displayfield",
								fieldLabel:"Script User",
								value:univnm.cur_user
							},{
								xtype:"displayfield",
								fieldLabel:"Script Node",
								value:univnm.cur_node
							},{
								xtype:"displayfield",
								fieldLabel:"Server Number",
								value:univnm.cur_server
							}]
						},{
							items:[{
								xtype:"displayfield",
								fieldLabel:"$env.purpose",
								value:$env.purpose
							},{
								xtype:"displayfield",
								fieldLabel:"$env.baseUrl",
								value:$env.baseUrl
							},{
								xtype:"displayfield",
								fieldLabel:"$env.cclMask",
								value:$env.cclMask
							}]
						}],
						tbar:[{
							xtype:"label",
							text:"URL: " +window.location.pathname + window.location.search
						}]
					},{//center - grid tabs
						region:"center",
						border:true,
						plain:true,
						xtype:"tabpanel",
						activeTab: 1,
						//stateful: false,
						items:[{//callbacks
							title:"Callbacks",
							xtype:"supagrid",
							filterMode:"local",
							filterSuppressTitle:true,
							stripeRows:true,
							store: Ext.create('Ext.data.Store',{
								storeId:"CONTROLLER_CALLBACK_GRID",
								data:univnm.jslib.ccl_callback.history,
								aurtoLoad:true,
								proxy:{
									type:"memory",
									reader: {
										type:"json",
										id: "id"
									}
								},
								fields:[
									{name:"id"},
									{name:"ccl"},
									{name:"params"},
									{name:"responseText"},
									{name:"xhr"},
									{name:"options"},
									{name:"started"},
									{name:"ended"},
									{name:"elapsed"}

								],
								remoteSort: false
							}),
							columns:[
								{header: "ID", width:30,  dataIndex: 'id', sortable: true, filterable:true},
								{header: "Script", width:150,  dataIndex: 'ccl', sortable: false, flex:1, filterable:true},
								{header: "Parameters", width:200,dataIndex: 'params', sortable: false, flex:2,filterable:true},
								{header: "Status", width:100, dataIndex: 'xhr', sortable: false,renderer:function(val){
									return val.status +" " + val.statusText;
								}},
								{header: "Started", dataIndex: 'started', renderer:function(v){return v.format("H:i:s");}},
								{header: "Time", dataIndex: 'elapsed',
									renderer:function(v){
										return Date.formatInterval(v,{
											scale:2,
											sep:" ",
											style:"short"
										});
									}
								}
							],
							loadMask: true,
							listeners: {
								beforerender:function(){

								},
								cellclick:function(
								/* Ext.grid.View		*/	view,
								/* HTMLElement			*/	cell,
								/* Number				*/	cellIndex,
								/* Ext.data.Mode		*/	record,
								/* HTMLElement			*/	row,
								/* Number				*/	rowIndex,
								/* Ext.EventObject		*/	e
								){
									var col =view.headerCt.gridDataColumns[cellIndex];
									var value = record.get(col.dataIndex);
									var items=[];
									var table="";
									try{
										var r = JSON.parse(record.get("xhr").responseText);
										r= r[0].data?
											univnm.jslib.fixCclJson(r[0].data)
											: r;
										table = r.toDataSet().toHtmlTable();
										if (r.length){
											items.push({
												title:"HTML Response",
												xtype:"panel",
												html:table
											});
										}
									} catch (e){
										items.push({
											title:"HTML Response",
											xtype:"panel",
											html:record.get("xhr").responseText
										});
									}
									var sql;

									items.push({
										title:"Raw Response",
										xtype:"textarea",
										value:record.get("xhr").responseText
									});
									items.push({
										title:"Params",
										xtype:"textarea",
										value:record.get("params")
									});
									items.push({
										title:"XHR",
										html:(function(){
											try{
											return $O(record.get("xhr")).toArray().toDataSet().toHtmlTable();
											}catch(e){
												return "Error reading XHR";
											}
										})()
									});
									try{
										var options =record.get("options");
										if (!options.sql && /runsql/.test(options.parameters)){

											sql = String(options.parameters)
												.replace(/__CARET__/g,"^")
												.match(/runsql.*~.(.*?).$/)[1]
												.replace(/__DQUOTE__/g,'"')
												.replace(/CCL_DIRECT_PIPE/g,"|")
												.replace(/CCL_DIRECT_TILDE/g,"~");
											items.push({
												title:"SQL",
												xtype:"textarea",
												value:sql
											});
										}
									} catch (e){}
									items.push({
										title:"Request Options",
										html:$O(record.get("options")).toArray().toDataSet().toHtmlTable()
									});
									C.showWin("Callback {0} detail".format(record.get("id")),{
										xtype:"tabpanel",
										defaults:{
											autoScroll:true
										},
										items:items
									});




								},
								rowclick:function(grid,rowIndex,e){
									var record = grid.getStore().getAt(rowIndex);
								},
								rowdblclick:function(grid,rowIndex,e){

								}
							}
						},{// tab2 profiler
							title:"Profiler",
							xtype:"grid",
							stateId:"profiler_tab",
							stripeRows:true,
							stateful: true,
							store: Ext.create('Ext.data.Store',{
								storeId:"CONTROLLER_PROFILER_GRID",
								data:univnm.jslib.ccl_callback.history,
								aurtoLoad:true,
								proxy:{
									type:"profiler",
									reader: {
										type:"json",
										id: "id"
									}
								},
								fields:[
									{name:"type"},
									{name:"label"},
									{name:"elapsed"},
									{name:"total"}
								],
								remoteSort: false
							}),
							columns:[
								{header: "Type", width:65,  dataIndex:'type', sortable:false},
								{header: "Label", flex:1, width:60,  dataIndex:'label', sortable:true},
								{header: "Elapsed", width:70,  dataIndex:'elapsed', sortable:true,
									renderer:function(val){
										return Date.formatInterval(val,{
											scale:2,
											sep:" ",
											style:"short"
										});
									}
								},
								{header: "Total", width:70,dataIndex:'total', sortable:true,
									renderer:function(val){
										return Date.formatInterval(val,{
											scale:2,
											sep:" ",
											style:"short"
										});
									}
								}


							],
							loadMask: true,
							listeners: {
								beforerender:function(){
									Ext.StoreMgr.get("CONTROLLER_PROFILER_GRID").load();
								},
								cellclick:function(
								/*Ext.grid.View		*/	view,
								/*HTMLElement			*/	cell,
								/*Number				*/	cellIndex,
								/*Ext.data.Mode	l	*/	record,
								/*HTMLElement			*/	row,
								/*Number				*/	rowIndex,
								/*Ext.EventObject		*/	e
								){
									var col =view.headerCt.gridDataColumns[cellIndex];
									var value = record.get(col.dataIndex);

									C.showWin("Request",{
										xtype:"textarea",
										autoScroll:true,
										title:"Label",
										value:record.get("label")
									});
								}

							}
						},{//tab 3 "Console"
							title:"Console",
							layout:"fit",
							frame:"true",
							//stateful: false,
							itemId:"consolePanel",
							items:[{
								xtype:"grid",
								stateful:false,
								store:new Ext.data.Store({
									storeId:"aboutDebugConsole",
									proxy: {
										type: 'memory',
										reader: {
											type: 'json'
											//root: 'data'
										}
									},
									fields:[
										{//label
											name:"label"
										},
										{//type
											name:"type"
										},
										{//detail
											name:"detail"
										},
										{//stack
											name:"stack_label"
										},
										{//ts
											name:"ts",
											type:"date"
										}
									],
									data: C.console.data
								}),
								stripeRows:true,
								columns:[
									{width:20,  dataIndex:"label", header:"#",renderer:function(v,m,r,i){return i+1;}},
									{flex:1,  dataIndex:"label", header:"Label"},
									{dataIndex:"type", header:"Type"},
									{dataIndex:"stack_label", header:"Log Stack", hidden:Ext.isIE},
									{dataIndex:"ts", header:"TS"}
								],
								features:[
									Ext.create('Ext.grid.feature.RowBody', {
										getAdditionalData : function(data, rowIndex, record, orig) {
											var headerCt = this.view.headerCt,
												colspan = headerCt.getColumnCount()
											;
											return {
												rowBody : '<div style="-webkit-user-select: text !important;-o-user-select: text !important; -khtml-user-select: all !important; -ms-user-select: text !important; user-select: text !important; -moz-user-select: text !important;padding-left:10px;border-bottom:1px solid gray;">' + record.get("detail") +'</div>',
												rowBodyCls : this.rowBodyCls,
												rowBodyColspan : colspan
											};
										}
									})
								]

							}],
							bbar:isDBA?[{
								xtype:"textfield",
								fieldLabel:"Log",
								enableKeyEvents:true,
								flex:1,
								listeners:{
									keydown:function(f,e){
										if (e.getKey() == e.ENTER){
											C.console.debug(eval("(" +f.getValue() + ")"),f.getValue());
											f.up("panel[itemId=consolePanel]").down("grid").getStore().loadData(C.console.data);
										}
									}
								}
							}]:undefined
						},{//tab 4 Tests
							title:"Tests",
							layout:"fit",
							frame:true,
							itemId:"test_pane",
							buttons:isDBA?[{
								text:"Run Tests",
								handler:function(b){
									var view = b.up("controller_about");
									view.fireEvent("run_tests",{src:view});
								}
							}]:undefined
						}]
					}]
				});
				if (C.options && C.options.helpPanel){
					tb.unshift({
						title:"Help",
						layout:"fit",
						items:[C.options.helpPanel]
					});
				}
				if (config.errorText){
					var errorId = C.createUuid().replace(/-/g,"");
					config.errorText = "ID: " + errorId + "\n" + config.errorText;
					var data={
						iframe_id:Ext.id(),
						form_id:Ext.id(),
						detail_id:Ext.id(),
						env:univnm.jslib.jsonEncode({
							$env:$env,
							error_id:errorId,
							location:window.location.pathname + window.location.search,
							ids:{
								user_id:univnm.user_id,
								patient_id:univnm.patient_id,
								encounter_id:univnm.encounter_id,
								cur_node:univnm.cur_node,
								cur_user:univnm.cur_user,
								cur_server:univnm.cur_server,
								app_name:C.options.appname,
								full_name:univnm.full_name
							},
							profiler:$profiler.getSummaryArray(),
							console:C.console.data,
							appname:C.options.appname,
							full_name:univnm.full_name,
							callbacks:"history" in univnm.jslib.ccl_callback?univnm.jslib.ccl_callback.history.map(function(row){
								return {
									id:row.id,
									ccl:row.ccl,
									xhr:(function(){
										try{
											return {
												status:row.xhr.status,
												statusText:row.xhr.statusText,
												responseText:row.xhr.responseText
											};
										}catch(e){
											return {
												status:"",
												statusText:"",
												responseText:""
											};
										}
									})(),
									params:row.params,
									options:row.options,
									responseText:(function(){
										try{
											return row.xhr.responseText;
										}catch(e){
											return e;
										}
									})()
								};
							}):""
						}),

						detail:config.errorText,
						errorUrl:$env.errorUrl

					};

					tb.unshift({
						title:"Report an Error",
						layout:"anchor",
						frame:"true",
						itemId:"errorWin",
						items:[{
							xtype:"displayfield",
							value:"Report a problem: ",
							style:"font-weight:bold"
						},{
							xtype:"textarea",
							//stateful: false,
							anchor:"100% 97%",
							style:{
								"font-family":"monospace",
								"font-size":"8pt"
							},
							itemId:"errorText",
							value:config.errorText
						},{
							xtype:"panel",
							hidden:true,
							height:1,
							html:[
								'<iframe name="{iframe_id}"  style="display:none"></iframe>',
								'<form  id="{form_id}"  action="{errorUrl}" target="{iframe_id}" method="POST" >',
									'<textarea name="env" style="display:none" >{env}</textarea>',
									'<textarea id="{detail_id}" name="detail" >{detail}</textarea>',
								'</form>'
							].join("\n").format(data),
							anchor:"100% 100%"

						}],
						buttons:[{
							hidden:!$env.errorUrl,
							text:"Send Error Report",
							handler:function(b){
								var text = b
									.up("*[itemId=errorWin]")
									.down("*[itemId=errorText]")
									.getValue();
								Ext.get(data.detail_id).dom.value = text;
								Ext.get(data.form_id).dom.submit();
							}
						}],
						listeners:{
							afterrender:function(){
								if ($env.errorUrl){
									window.setTimeout(function(){
										Ext.get(data.form_id).dom.submit();
									},1000);
								}
							}
						}
					});
				}

				C.ControllerAbout.loading=false;
				this.callParent(arguments);
			}

		});


/* ---------------- Ext.onReady --------------------------------------------- */
	Ext.onReady(function(){


		univnm.jslib.load_mpage_ids();
		/* setup konami code */
			var code=[1,1,2,2,3,4,3,4,5,6,0];
			var curKeys=[];
			var keys=[
				Ext.EventObject.ENTER,
				Ext.EventObject.UP,
				Ext.EventObject.DOWN,
				Ext.EventObject.LEFT,
				Ext.EventObject.RIGHT,
				Ext.EventObject.B,
				Ext.EventObject.A

			];

			var map = new Ext.util.KeyMap(document, {
				key: keys,
				fn: function(keyCode){
					if (keyCode==keys[code[curKeys.length]]){
						curKeys.push(keyCode);
					} else {
						curKeys=[];
					}
					if (curKeys.length == code.length){
						Ext.get(document.body).mask();
						window.setTimeout(function(){
							/* Must be DBA to ACL */
							var isDBA = !!C.localMode||univnm.db.query([
								'Select',
									'code_value,',
									'display',
								'From',
									'code_value cv join prsnl p on (',
										'p.position_cd = cv.code_value',
									')',
								'Where',
									'1=1',
									'and code_set= 88',
									'and cv.active_ind= 1',
									'and display=\'DBA\'',
									'and p.person_id = {user_id} ',
							''],univnm).length;

							Ext.get(document.body).unmask();
							if (!isDBA) {
								alert("Only Position 'DBA' can access the admin interface");
								return;
							}
							Ext.widget("admin_view");
						},100);

					}
				}
			});
		var options = C.options;
		C.session_id = C.createUuid();
		if (!options.dontAcl && !C.hasAccess(options.appname)){

			alert("You do not have access to this MPage.");
			if (history.length >1) {
				history.back();
				return new Ext.Panel();
			} else {
				throw new Error("You do not have access to this MPage.");
			}
		}

		//logs access
		C.logStat();
		univnm.jslib.ccl_callback.defaults.onexception=function (e,xmlhttp,options){
			C.handleError({
				type:"callback_exception",
				e:e,
				xhr:xmlhttp,
				options:options
			});
		};
		univnm.jslib.ccl_callback.defaults.onfailure=function (xmlhttp,options){
			C.handleError({
				type:"callback",
				xhr:xmlhttp,
				options:options
			});
		};
		C.body = Ext.get(document.body);

		//effectively disabled Ext AJAX timeout
		Ext.Ajax.timeout = 5*60*1000;


		var oldDecode = (Ext.JSON?Ext.JSON:Ext.util.JSON).decode;
		Ext.decode = (Ext.JSON?Ext.JSON:Ext.util.JSON).decode = function(text){
			try{
				if (!text || text.trim().length === 0) return "";
				return univnm.jsonDecode(text);
			} catch(e){
				C.handleError({
					type:"decode",
					e:e,
					json:text
				});
				//now in global error handler
				//C.body.unmask();
				throw e;
			}
		};

		//Provides attractive and customizable tooltips for any element.
		Ext.QuickTips.init();

		//Ext.form.BasicForm.prototype.trackResetOnLoad =true;

		/* Ext.Direct.on('exception',function(e){
			C.handleError({
				type:"direct",
				errorObj:e
			})
		},this); */


		try {
			if (!options.version){
				if ($env.version){
					options.version = $env.version;
				}else {
					univnm.jslib.loadScript("version.js",function(){
						options.version = $env.version;
					});
				}
			}
		} catch(e){
			//we don't care if this doesn't work

		}
		var apps=[];

		if (!options.displayName && !C.localMode){
			apps = univnm.db.query([
					"select  ",
					"a.app_name, ",
					"a.display_name, ",
					"a.is_portlet ",
					"from unmh.cust_applications a ",
					"where '{app_name}' = 'ALL' or app_name = '{app_name}'"

				],
				{
					app_name:options.appname.toLowerCase()
				}
			);
			if (apps && apps.length){
				options.displayName=apps[0].display_name;
			} else {
				options.displayName=options.appname;
			}
		}

		C.tools=[{
			id:"help",
			tooltip:"Debugging and Error Reporting",
			handler:function(){
				var view = Ext.ComponentQuery.query("viewport")[0];
				view.fireEvent("controller_about",{
					src:view
				});
			}

		}];
		if (C.hasAccess(C.options.appname + "/admin")){
			C.tools.push({
				type:"gear",
				id:"deity_edit_users",
				tooltip:"Edit User Access",

				handler:function(){
					/*location.href="../deity/index.html?edit_app={appname}".format(C.options);*/
					C.showWin("Edit users for this application",{
						html:[
							'<iframe ',
								'src="../deity/index.html?edit_app={appname}"',
								'scrollbars="no"',
								'frameborder="no"',
								'width="100%"',
								'height="100%"',
							'></iframe>',
						''].join(" ").format(C.options)
					},true);
				}
			});
		}
		if(C.options.tools){
			C.tools = C.options.tools.concat(C.tools);
		}

		if ($env.mpageType =="external" && $env.logoutUrl){
			C.tools.push({
				id:"close",
				qtip:"Log out of this MPage",
				handler:function(){
					location.href=$env.logoutUrl;
				}

			});
		}

		// C.loadValues();
		C.Settings.load();
		//should make state management optional
		//if (C.options.loadValues.enableStateManagement){
			Ext.state.Manager.setProvider(new univnm.ext.CCLProvider({
				app_name: C.options.appname
			}));
		//}

	});




