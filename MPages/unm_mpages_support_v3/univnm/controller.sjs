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
var C ={
/* Property: C.errorUrl
	url to post error reports to.
	*/
	errorUrl:"http://trogdor.health.unm.edu/main/apps/mpages/mpage_error_report.cfm",
/* Property: C.options
	options object for the controller
	
	Properties:
		dontAcl		-	set to true to disable ACL checks
		appname		-	name of the application, defaults to folder name
		version		-	app version, defaults to $env.version or tjhe contents 
						of version.txt
		displayName	-	Human readable name of the application, defaults to  
						displayName from deity for _C.options.appname_, or 
						_C.options.appname_ itself			
		tools		-	Ext tools to add to the global toolbar
		loadValues	-	If true, calls <C.loadValues> at page load
		
	*/	
	options:{
		dontAcl:false,
		appname:String(location.pathname).listBefore("/").listLast("/") 
			|| String(location.pathname).listBefore("\\").listLast("\\")
	},
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
		})
		
	}
}
/* Function: C.console.log
		Displays the "about" screen. This is the same window triggered by 
		clicking the "help" tool
		
		Parameters:
			detail	-	Text of log
			label	-	*Optional, default "log"*
						Log label
			type	-	*Optional, default "debug"*
						Log type
		
		These logs are saved to C.console.data and can be viewed in the "debug" 
		tab of the about window			
						
		Example:
		(code)
			try {
			...
			}catch (e){
				C.console.log(e.message,"Error in call","error")
			}
		(end)
	*/
	C.console = {
		data:[]
	}
	C.console.log = function log(detail,label,type){
		
		
		var row = {
			detail:detail||"",
			label:label,
			type:type||"info",
			ts:new Date()
		}
		row.value = detail
		row.title = label
		var index = this.data.push(row) -1;
		
		
		
		if (row.detail && typeof row.detail === "object" && !(row.detail instanceof Date)){
			row.detail = [
				'<span style="color:blue;cursor:pointer;text-decoration:underline;"',
					'onclick="univnm.jslib.debug_window(',
						'C.console.data[{0}].value,',
						'\'Log row {1}: \' +C.console.data[{0}].title',
						')"',
				'>[ object ]</span>',
			''].join("").format(index,index+1)
		}
		if (!row.label && typeof row.detail != "object") {
			row.label = row.detail
			row.detail =""
		}
		
		try {
			throw new Error("Console Stack")
		}catch(e){
			row.stack = e.stack;
			row.stack_label = [
				'<span =style="color:blue;cursor:pointer;text-decoration:underline;"',
					'onclick="alert(',
						'C.console.data[{0}].stack',
						')"',
				'>[ view ]</span>',
			''].join("").format(index);
		}
		
		if (this.nativeConsole) {
			this.nativeConsole.log((row.title||"")+":" ,row.value||"");
		}
		
		var store = Ext.StoreMgr.get("aboutDebugConsole")
		if (store){
			store.load();
		}
	
	}
	
	C.console.error =function error(detail,label,type){
		return this.log(detail,label,"error")
	}
	C.console.debug =function debug(detail,label,type){
		return this.log(detail,label,"debug")
	}
	 
	/* replace native store */
	if ("console" in this){
		C.console.nativeConsole = this.console
		var console= C.console;
	}else{
		var console= C.console;	
	}
/* Function: C.CCL 
		Executes a CCL callback via univnm.jslib.ccl_callback
		
		Parameters:
			ccl_name		-	name of CCL to execute
			arg1..n			-	*Optional*
								arguments to ccl, not counting "MINE"
			callback		-	*Optional*
								Function. If defined, ccl will  be caled 
								async and _callback_ will be called with the 
								result of the callback. Otherwise CCL 
								executes sync and returns the result directly
								
		Examples:
		(code)
			C.CCL("uh_mp_ro_save",0,alias,model,foreign_key,pid,function(result){
				Ext.StoreMgr.get("ro_member_grid").load()
			})
			
		(end)
	*/
	C.CCL = function(){
		var args = Array.parse(arguments)
		var cb=false
		if (typeof args.last() == "function"){
			cb = args.pop()
		}
		var ccl = args.shift()
		if (!args.length || args[0] !=  "MINE")
		args.unshift("MINE")
		args.compact();
		return univnm.jslib.ccl_callback({
			ccl:ccl,
			eval_result:false,
			onsuccess:function(result){
				if (result) result =univnm.jslib.fixCclJson(result.parseJson());
				if (cb) cb(result);
			},
			parameters:args,
			async:!!cb
		})
	}
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
       }
/* Function: C.hasAccess 
	returns true if the current user has access to the requested item
	
	Parameters:
		co			-	requested object, ex: nbicu, nbicu/admin
						Note that is is not necessary to pass the instance
						prefix e.g. build/nbicu, because this will 
						happen automatically if "instance" is defined in $env   
		prefix		-	*Optional. default null*
						application instance prefix. Set this to override 
						$env.instance
	*/
	C.hasAccess = function(co,prefix){
		var me=my=arguments.callee;
		if (!("perms" in me)) my.perms={};//permissions cache
		var path = co
		if (prefix){
			path ="{0}/{1}".format(prefix,co)
		} else  if ($env.instance){
			path ="{0}/{1}".format($env.instance,co) 	
		}
		if (!(path in my.perms)){
			var result = univnm.db.query([
				'Select',
					'distinct rc.id',
				'From',
					'cust_aros_acos rc ',
					'join cust_acos co on (',
						'rc.aco_id =co.id',
					')',
				'Where',
					'rc.aro_id in (',
						'Select',
							'parent_id',
						'From',
							'cust_aros ro',
						'Where',
							'exists (',
								'Select',
									'\'x\'',
								'From',
									'code_value cv ',
									'join prsnl p on (',
										'cv.code_value = p.position_cd',
									')',
								'Where',
									'cv.code_value = ro.foreign_key',
									'and ro.model =\'CernerRole\'',
									'and code_set= 88',
									'and cv.active_ind= 1',
									'and p.person_id = {person_id} ',
							')',
							'or (',
								'ro.model =\'User\'',
								'and ro.foreign_key = {person_id} ',
							') ',
					')',
					'and alias =\'{path}\'',		
			''], {person_id: univnm.user_id, path:path});
			my.perms[path] =!!result.length 
		}
		return my.perms[path]
	}
/* Function: C.logStat 
	Logs to cust_stats. 
	
	Parameters:
		detail		-	*Optional, default "access"*
		
	Saves session_id, app_name, person_id(user id), detail and purpose to 
	cust_stats
	*/
	C.logStat = function(detail){
		univnm.db.saveRow("stats","insert",{
			id:C.createUuid(),
			session_id:C.session_id,
			app_name:C.options.appname,
			person_id:univnm.user_id,
			detail:detail||"access",
			purpose:$env.purpose||"UNKNOWN"
		},function(){})
	}
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
		univnm.jslib.async.marshal(
			function(done){
				if (C.values) {
					done();
				} else {
					var post = function(values){
						var hasLegacy = false
						C.values ={}
						values.forEach(function(row){
							var key = row.key;
							var value = row.value;
							if (
								key.listLen(".") > 1 
								&& key.listFirst(".") == univnm.user_id
							){
								key =key.listAfter(".")
								// ooooh scary... lets not do this
								// this.saveUserValue(key,value,function(){});
								hasLegacy = true;
							}
							if (value === parseFloat(value)){
								value = parseFloat(value);
							}
							C.values[key] = value ;
						});
						C.defaultValues = C.values
						C.values_mine = C.values
						if (hasLegacy){
							// ooooh scary... lets not do this
							/* univnm.db.saveRow(
								'values',
								'remove',
								{
									application:C.options.appname,
									"key like":univnm.user_id +".%"
								},
								function(){}
							) */	
						}
						
						done();
					}
					var sql =[
						"select ",
						"	v.id, ",
						"	v.application, ",
						"	v.key, ",
						"	v.value, ",
						"	v.title, ",
						"	v.description, ",
						"	v.input_type, ",
						"	v.editable, ",
						"	v.weight, ",
						"	v.params, ",
						"	v.user_id ",
						"FROM ",
						"	UNMH.cust_values v ",
						"WHERE ",
						"	v.application = '{appname}' ",
						"	AND ( ",
						"		v.key LIKE '{person_id}.%' ",
						"		or not REGEXP_LIKE(v.key,'[[:digit:]]+\.') ",
						"		or user_id = {person_id}",
						"	) "
					]
					if (callback){
						univnm.db.query(
							sql,
							{
								appname: C.options.appname,
								person_id: univnm.user_id
							},
							post
						)
					} else {
						post(
							univnm.db.query(sql,{
								appname: C.options.appname,
								person_id: univnm.user_id
							})
						)
					}
					
				}
			}
		).then(function(){
			if (callback) callback(C.values)
		})
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
		//convert legacy calls
		if (key.listLen(".") > 1 && key.listFirst(".") == univnm.user_id){
			return this.saveUserValue(key.listAfter("."),value)	
		}
		if(value || value === 0){
			if(value.length > 4000){
				alert('The text you entered is too long.  The max length is 4000 characters.');
			} else {
			
				univnm.db.saveRow(
					'values', 
					'set', 
					{
						"application = ":C.options.appname, 
						"key = ":key, 
						value:value
					},
					callback
				);
			}
		}
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
		if(value || value === 0){
			if(value.length > 4000){
				alert('The text you entered is too long.  The max length is 4000 characters.');
			} else {
				univnm.db.saveRow(
					'values', 
					'set', 
					{
						"application = ":C.options.appname, 
						"key = ":key,
						"user_id = ":univnm.user_id,
						value:value
					},
					callback
				);
			}
		}
	};
/* Function: C.deleteValue
	Deletes a specific key from cust_values for the current application
	
	Parameters:
		key			-	key to remove
		callback	-	if defined, the delete is async and this function
						is executed when value is removed
	*/
	C.deleteValue=function(key,callback){
		if (!key) {
			if (callback) {
				callback()
			} else return;
		}
		univnm.db.saveRow(
			'values',
			'remove',
			{
				application:C.options.appname,
				key:key
			},
			callback
		)
	}
/* Function: C.deleteUserValue
	Deletes a specific key from cust_values for the current application and user
	
	Parameters:
		key			-	key to remove
		callback	-	if defined, the delete is async and this function
						is executed when value is removed
	*/
	C.deleteUserValue=function(key,callback){
		if (!key) {
			if (callback) {
				callback()
			} else return;
		}
		univnm.db.saveRow(
			'values',
			'remove',
			{
				application:C.options.appname,
				key:key,
				user_id:univnm.user_id
			},
			callback
		)
	}
/* Function: C.deleteUserValues
	Deletes all user values for the current user, normally called by the "reset" 
	button in the "about" window
	
	Parameters:
		callback	-	optional callback function that is executed when values 
						are removed
	*/
	C.deleteUserValues=function(callback){
		univnm.jslib.async.marshal(
			function(done){ // new way
				univnm.db.saveRow(
					'values',
					'remove',
					{
						application:C.options.appname,
						user_id:univnm.user_id
					},
					done
				)
			},	
			function(done){//legacy way
				univnm.db.saveRow(
					'values',
					'remove',
					{
						application:C.options.appname,
						"key like":univnm.user_id +".%"
					},
					done
				)
			}	
		).then(function(){
			//C.infoMsg("User Values reset.")
			if (callback) callback()
		})
				
	}
/* Function: C.createUuid
	returns a Universally Unique IDentifier string.
	*/	
	C.createUuid = function(){
		return Ext.data.IdGenerator.get('uuid').generate();
	}
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
		})
		win.show()
	}
/* Function: showWinText
	Opens a large centered window with the supplied plain text content
	
	Parameters:
		title	-	title of the window
		text	-	plain text to display
		modal	-	Boolean. 
					*Optional, default false*
					Should the window be modal?
	*/	
	C.showWinText=function(title,text){
		C.showWin(title,{
			autoScroll:true,
			title:title,
			width:Math.min(body.getWidth(1)-100,800),
			height:body.getHeight(1)-100,
			closeable:true,
			maximizable:true,
			modal:modal,
			html:"<pre>" + text.escapeHtml() + "</pre>"
		})
		
	}
/* Function: showWinHtml
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
		})
		
	}
/* ---------------- handleError --------------------------------------------- */
	C.handleError = function(options){
		var formatJsError=function(e){
			C.error =e
			console.error(e.stack)	
			
			
			return new Ext.Template([
				'Message:     {message}',
				'{stack}'
			].join("\n")).apply(e)
		}
		var detail=""
		switch(options.type){
			case "decode":
				detail = new Ext.Template([
					'JSON decode Error: ',
					'{error}',
					'JSON: {json}'
				].join("\n")).apply({
					error:formatJsError(options.e),
					json:options.json
				})
				break;
			case "callback_exception":
				detail = new Ext.Template([
					'JS Error in Callback ID {cb_id}:',
					'{error}'
				].join("\n")).apply({
					cb_id:options.options.callback_id,
					error:formatJsError(options.e)
				})
				break;
			case "js":
				detail = new Ext.Template([
					'JS Error:',
					'{error}'
				].join("\n")).apply({
					error:formatJsError(options.e)
				})
				break;
			case "callback":
				detail = new Ext.Template([
					'Callback Failure:',
					'     CB ID:      {cb_id}',
					'     Status:     {status}',
					'     StatusText: {statusText}'
				].join("\n")).apply({
					cb_id:options.options.callback_id,
					status:options.xhr.status,
					statusText:options.xhr.statusText
				})
				break;	
			default:
				//debug_window(options)
				detail = Ext.encode(options)		
		}
		C.about(
			new Ext.Template([
				'An Error Occurred!',
				'{detail} ',
				' ',
				'Please describe what your were doing when this error occurred and click "Send Error Report" below',
				'------------------------------------------------------------------------------------------------'
			].join("\n")).apply({detail:detail})
		)
		
	}
/* ---------------- isEmpty ------------------------------------------------- */
	C.isEmpty=function(obj){
		for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
		}
		return true;		
	}	
/* ---------------- stupid xtype fix ---------------------------------------- */
	Ext.ClassManager.instantiateByAlias=function() {
		var alias = arguments[0],
			args = Array.parse(arguments),
			className = this.getNameByAlias(alias);
	
		if (!className) {
			className = this.maps.aliasToName[alias];
			if (!className) {
				console.log(args[1],"Config Object")
				throw new Error("Unknown xtype: " + alias)
			}
	
	
			Ext.syncRequire(className);
		}
	
		args[0] = className;
	
		return this.instantiate.apply(this, args);
	}
/*  */       
/* Topic: Dependencies
	JS library dependencies
	
	Application Dependencies:
	* <menu>	For application name lookup
	* <diety> 	ACL application (for permissions checks, and masquerading)
	
	
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


/* =================== Classes ============================================== */
	/* ----------- C.ProfilerProxy ------------------------------------------ */
		Ext.define('C.ProfilerProxy', {
			extend: 'Ext.data.proxy.Client',
			alias: 'proxy.profiler',
			constructor: function(config) {
				this.callParent([config]);
		
				//ensures that the reader has been instantiated properly
				this.setReader(this.reader);
			},
			read: function(operation, callback, scope) {
				var me     = this,
					reader = me.getReader(),
					result = reader.read($profiler.getSummaryArray());
		
				Ext.apply(operation, {
					resultSet: result
				});
		
				operation.setCompleted();
				operation.setSuccessful();
				Ext.callback(callback, scope || me, [operation]);
			},
		
			clear: Ext.emptyFn
		});
		
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
							var url =location.href
							this.up("window").close()
							location.href = url.listBefore("?")+"?"
								+(url.listAfter("?").replace(/&?user_id=\d+/g,"")||"d=0")
								+"&user_id=" + user_id
								
						}	
					}
				}],
				buttons:[{
					xtype:"button",
					text:"Launch MPage Permissions...",
					handler:function(){
						this.up("window").close()
						location.href="../deity/index.html"
						
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
				return C.values
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
				C.saveUserValue(name,value)
				C.values[name] = value;
			},
		
			// private
			clearState: function(name){
				var me = this;
				C.deleteUserValue(name,function(){})
			}
		});
	/* ----------- MPAGE.controllers.ControllerInit ------------------------- */
		C.controllers.push("ControllerInit")
		Ext.define('MPAGE.controller.ControllerInit', {
			extend: 'Ext.app.Controller',
			init: function() {
				this.control({
					'viewport':{
						afterrender:function(viewport){
							var mp = viewport.down("panel")
							mp.setTitle(C.options.displayName);
							mp.updateHeader()
							C.tools.forEach(function(tool){
								// if (mp.header.items.length <= 1){
									mp.header.items.add(new Ext.panel.Tool(tool))
								// }
							})
							
							mp.ownerCt.doLayout()
						},
						controller_about:function(event){
							C.about();
						}
					}
				})
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
				C.ControllerAbout.loading=true
				var name=C.options?C.options.displayName||C.options.appname||"":""
				var body = Ext.get(document.body);
				var isDBA = univnm.db.query([
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
				''],univnm).length
				var tb
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
									C.deleteUserValues(function(){
										alert("User settings reset. Click OK to reload MPage.")
										location.href=location.href	
									});
								}
							}]
						}]
					}]
				})
				
				if (isDBA){
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
							activeTab:0,
							xtype:"tabpanel",
							activeTab: 1,
							//stateful: false,
							items:[{//callbacks
								title:"Callbacks",
								xtype:"supagrid",
								filterMode:"local",
								filterSuppressTitle:true,
								//stateful: false,			
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
										return val.status +" " + val.statusText
									}},
									{header: "Started", dataIndex: 'started', renderer:function(v){return v.format("H:i:s")}},
									{header: "Time", dataIndex: 'elapsed', 
										renderer:function(v){
											return Date.formatInterval(v,{
												scale:2,
												sep:" ",
												style:"short"
											})
										} 
									}
								],
								loadMask: true,
								listeners: {
									beforerender:function(){
									
									},
									cellclick:function(
									/* Ext.grid.View	 	*/	view,
									/* HTMLElement	 		*/	cell,
									/* Number 				*/	cellIndex,
									/* Ext.data.Mode	l 	*/	record,
									/* HTMLElement 			*/	row,
									/* Number 				*/	rowIndex,
									/* Ext.EventObject		*/ 	e
									){
										var col =view.headerCt.gridDataColumns[cellIndex];
										var value = record.get(col.dataIndex)
														 
										switch(col.dataIndex){
											default:
												var items=[]
												var table=""
												try{
													var r = JSON.parse(record.get("xhr").responseText)
													r= r[0].data
														? univnm.jslib.fixCclJson(r[0].data)
														: r
													table = r.toDataSet().toHtmlTable()
													if (r.length){
														items.push({
															title:"HTML Response",
															xtype:"panel",
															html:table
														})	
													}
												} catch (e){
													items.push({
														title:"HTML Response",
														xtype:"panel",
														html:record.get("xhr").responseText
													})
												}
												var sql
												
												items.push({
													title:"Raw Response",
													xtype:"textarea",
													value:record.get("xhr").responseText
												})
												items.push({
													title:"XHR",
													html:$O(record.get("xhr")).toArray().toDataSet().toHtmlTable()
												})
												try{
													var options =record.get("options")
													if (!options.sql && /runsql/.test(options.parameters)){
														
														var sql = String(options.parameters)
															.replace(/__CARET__/g,"^")
															.match(/runsql.*~.(.*?).$/)[1]
															.replace(/__DQUOTE__/g,'"')
															.replace(/CCL_DIRECT_PIPE/g,"|")
															.replace(/CCL_DIRECT_TILDE/g,"~")
														items.push({
															title:"SQL",
															xtype:"textarea",
															value:sql
														})
													}
												} catch (e){}
												items.push({
													title:"Request Options",
													html:$O(record.get("options")).toArray().toDataSet().toHtmlTable()
												})
												C.showWin("Callback {0} detail".format(record.get("id")),{
													xtype:"tabpanel",
													defaults:{
														autoScroll:true	
													},
													items:items
												})
												
												
										}
										
										
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
											})
										}
									},
									{header: "Total", width:70,dataIndex:'total', sortable:true, 
										renderer:function(val){
											return Date.formatInterval(val,{
												scale:2,
												sep:" ",
												style:"short"
											})
										}
									}
									
									
								],
								loadMask: true,
								listeners: {
									beforerender:function(){
										Ext.StoreMgr.get("CONTROLLER_PROFILER_GRID").load();
									},
									cellclick:function(
									/* Ext.grid.View	 	*/	view,
									/* HTMLElement	 		*/	cell,
									/* Number 				*/	cellIndex,
									/* Ext.data.Mode	l 	*/	record,
									/* HTMLElement 			*/	row,
									/* Number 				*/	rowIndex,
									/* Ext.EventObject		*/ 	e
									){
										var col =view.headerCt.gridDataColumns[cellIndex];
										var value = record.get(col.dataIndex)
										
										
										switch(col.id){
											default:
												C.showWin("Request",{
													xtype:"textarea",
													
													autoScroll:true,	
													title:"Label",
													value:record.get("label")
													
													
													
												})
										}
										
										
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
										{width:20,  dataIndex:"label", header:"#",renderer:function(v,m,r,i){return i+1}},
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
								bbar:[{
									xtype:"textfield",
									fieldLabel:"Log",
									enableKeyEvents:true,
									flex:1,
									listeners:{
										keydown:function(f,e){
											if (e.getKey() == e.ENTER){
												C.console.debug(eval("(" +f.getValue() + ")"),f.getValue())
												f.up("panel[itemId=consolePanel]").down("grid").getStore().loadData(C.console.data)
											}
										}
									}
								}]
							}]
						}]
					});
				}
				if (C.options && C.options.helpPanel){
					tb.unshift({
						title:"Help",
						layout:"fit",
						items:[C.options.helpPanel]
					})	
				}
				if (config.errorText){
					tb.unshift({
						title:"Report an Error",
						layout:"anchor",
						frame:"true",
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
							value:config.errorText
						},{
							xtype:"panel",
							hidden:true,
							height:1,
							html:[
								'<iframe name="ABOUT_POST_ERROR_REPORT"  style="display:none"></iframe>',
								'<form  id="ABOUT_POST_ERROR_FORM"  action="'+C.errorUrl+'" target="ABOUT_POST_ERROR_REPORT" method="POST" >',
									'<textarea name="env" style="display:none" >',
									Ext.encode({
										env:$env,
										location:location.href,
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
										callbacks:"history" in univnm.jslib.ccl_callback?univnm.jslib.ccl_callback.history.map(function(row){
											return {
												id:row.id,
												ccl:row.ccl,
												params:row.params,
												responseText:row.xhr.responseText
											}
										}):""
									}),
									'</textarea>',
									'<input type="hidden" name="app_name" value="'+C.options.appname+'">',
									'<input type="hidden" name="full_name" value="'+univnm.full_name+'">',
									'<textarea id="ABOUT_POST_ERROR_TA" name="detail" >',
									
									'</textarea>',
								'</form>'
							].join("\n"),
							anchor:"100% 100%"
							
						}],
						buttons:[{
							text:"Send Error Report",
							handler:function(){
								Ext.get("ABOUT_POST_ERROR_TA").dom.value = Ext.getCmp("ABOUT_POST_ERROR_CONTROL").getValue()
								Ext.get("ABOUT_POST_ERROR_FORM").dom.submit();
							}
						}]
					})
				}
				
				C.ControllerAbout.loading=false
				this.callParent(arguments)
			}
			
		})


/* ---------------- Ext.onReady --------------------------------------------- */
	Ext.onReady(function(){
		univnm.jslib.load_mpage_ids();
		/* check dependencies */
		{
			
			[
				"univnm.db.query",
				"univnm.ext.QueryStore",
				"univnm.ext.Notification"
			].forEach(function(cls){
				cls.split(".").reduce(function(obj,prop){
					if(!obj[prop]){
						throw new Error("Missing dependency: " + cls)	
					}
					return obj[prop]
				},window)
			})
		}
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
						curKeys.push(keyCode)
					} else {
						curKeys=[]	
					}
					if (curKeys.length == code.length){
						Ext.get(document.body).mask();
						window.setTimeout(function(){
							/* Must be DBA to ACL */
							var isDBA = univnm.db.query([
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
							''],univnm).length
							
							Ext.get(document.body).unmask();
							if (!isDBA) {
								alert("Only Position 'DBA' can access the admin interface")
								return;
							} 
							Ext.widget("admin_view")
						},100)
							
					}
				}
			});
		var options = C.options
		C.session_id = C.createUuid();
		if (!options.dontAcl && !C.hasAccess(options.appname)){
			alert("You do not have access to this MPage.");
			if (history.length >1) {
				history.back();
				return new Ext.Panel();
			} else {
				throw new Error("You do not have access to this MPage.")
			}
		}
		
		//logs access
		C.logStat()
		univnm.jslib.ccl_callback.defaults.onexception=function (e,xmlhttp,options){			
			C.handleError({
				type:"callback_exception",
				e:e,
				xhr:xmlhttp,
				options:options
			})		
		}
		univnm.jslib.ccl_callback.defaults.onfailure=function (xmlhttp,options){			
			C.handleError({
				type:"callback",
				xhr:xmlhttp,
				options:options
			})		
		}
		C.body = Ext.get(document.body);
		
		//effectively disabled Ext AJAX timeout 
		Ext.Ajax.timeout = 5*60*1000
		
		
		var oldDecode = (Ext.JSON?Ext.JSON:Ext.util.JSON).decode;
		Ext.decode = (Ext.JSON?Ext.JSON:Ext.util.JSON).decode = function(text){
			try{
				if (!text || text.trim().length == 0) return "";
				return univnm.jsonDecode(text);	
			} catch(e){
				C.handleError({
					type:"decode",
					e:e,
					json:text
				})
				//now in global error handler
				//C.body.unmask(); 
				throw e;
			}
		}
		
		//Provides attractive and customizable tooltips for any element.
		Ext.QuickTips.init();
		
		Ext.form.BasicForm.prototype.trackResetOnLoad =true;
		
		Ext.Direct.on('exception',function(e){
			C.handleError({
				type:"direct",
				errorObj:e
			})
		},this);
		
		
		try {
			if (!options.version){
				if ($env.version){
					options.version = $env.version;
				}else {
					univnm.jslib.loadScript("version.js",function(){
						options.version = $env.version;
					})
				}
			}
		} catch(e){
			//we don't care if this doesn't work
			
		}
		var apps=[]

		if (!options.displayName){
			var apps = univnm.db.query(
				[
					"select  ",
					"a.app_name, ",
					"a.display_name, ",
					"a.is_portlet ",
					"from unmh.cust_applications a ",
					"where '{app_name}' = 'ALL' or app_name = '{app_name}'	 "
			
				],
				{
					app_name:options.appname.toLowerCase()
				}
			);
			if (apps && apps.length){
				options.displayName=apps[0].display_name	
			} else 	{
				options.displayName=options.appname
			}
		}

		C.tools=[{
			id:"help",
			tooltip:"Debugging and Error Reporting",
			handler:function(){
				var view = Ext.ComponentQuery.query("viewport")[0]
				view.fireEvent("controller_about",{
					src:view
				})
			}
			
		}]
		if (C.hasAccess(C.options.appname + "/admin")){
			C.tools.push({
				type:"gear",
				id:"deity_edit_users",
				tooltip:"Edit User Access",
				
				handler:function(){
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
					},true)
					/* univnm.jslib.async.sequence(
						[
							function(done){
								try{
								if (univnm.ext && univnm.ext.RowProxy){
									done()	
								}else{
									
									univnm.jslib.loadScript(
										"../univnm/ext/RowProxy.js",
										done
									)	
									
								}
								}catch(e){console.log(e.stack)}
							}
						].concat(
							[
								"model/Group",
								"store/ROSearch",
								"store/Group",
								"store/GroupMember",
								"view/GroupMainGrid",
								"view/GroupMemberGrid",
								"view/GroupForm",
								"controller/Group",
							].map(function(tuple){
								var name = tuple.listLast("/")
								var section = tuple.listFirst("/")
								return function(done){
									try{
									if (MPAGE[section] && MPAGE[section][name]){
										done()	
									}else{
										
										univnm.jslib.loadScript(
											"../deity/app/{0}/{1}.js".format(section,name),
											function(){
												
												if (section == "store"){
													Ext.create("MPAGE." +section+"."+name,{
														storeId:name
													})
														
												}
												done()
											}
											
										)	
										
									}
									}catch(e){console.log(e.stack)}
								}
									
							})
						)
					).then(function(){
						C.showWin(
							"Edit users for this application",
							{
								xtype:"group_member_grid"
							}	
						)
					}) */
					
					
				}
			});
		}
		if(C.options.tools){
			C.tools = C.options.tools.concat(C.tools);
		}
		
		if ($env.mpageType =="external"){
			C.tools.push({
				id:"close",
				qtip:"Log out of this MPage",
				handler:function(){
					location.href="../proxy_router/logout.cfm"
				}
				
			})	
		}
		if(C.options.loadValues || C.options.enableStateManagement) {
			C.loadValues();
			//should make state management optional
			//if (C.options.loadValues.enableStateManagement){
				Ext.state.Manager.setProvider(new univnm.ext.CCLProvider({
					app_name: C.options.appname 
				}));
			//}
		}
	});	

	
	

