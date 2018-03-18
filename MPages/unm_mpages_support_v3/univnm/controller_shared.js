
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

	*/
	C.options={
		dontAcl:false,
		appname:String(location.pathname).listBefore("/").listLast("/") ||
			String(location.pathname).listBefore("\\").listLast("\\")
	};
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
	};
	C.console.log = function log(detail,label,type){


		var row = {
			detail:detail||"",
			label:label,
			type:type||"info",
			ts:new Date()
		};
		row.value = detail;
		row.title = label;
		var index = this.data.push(row) -1;



		if (row.detail && typeof row.detail === "object" && !(row.detail instanceof Date)){
			row.detail = [
				'<span style="color:blue;cursor:pointer;text-decoration:underline;"',
					'onclick="univnm.jslib.debug_window(',
						'C.console.data[{0}].value,',
						'\'Log row {1}: \' +C.console.data[{0}].title',
						')"',
				'>[ object ]</span>',
			''].join("").format(index,index+1);
		}
		if (!row.label && typeof row.detail != "object") {
			row.label = row.detail;
			row.detail ="";
		}

		try {
			throw new Error("Console Stack");
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

		var store = Ext.StoreMgr.get("aboutDebugConsole");
		if (store){
			store.load();
		}

	};

	C.console.error =function error(detail,label,type){
		return this.log(detail,label,"error");
	};
	C.console.debug =function debug(detail,label,type){
		return this.log(detail,label,"debug");
	};

	/* copy to native console */
	if ("console" in this){
		C.console.nativeConsole = this.console;
		//var console= C.console;
	}else{
		window.console= C.console;
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
		var args = Array.parse(arguments);
		var cb=false;
		if (typeof args.last() == "function"){
			cb = args.pop();
		}
		var ccl = args.shift();
		if (!args.length || args[0] !=  "MINE")
		args.unshift("MINE");
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
		});
	};
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
		if (C.localMode) return true;
		var me,my;
		me=my=arguments.callee;
		if (!("perms" in me)) my.perms={};//permissions cache
		var path = co;
		if (prefix){
			path ="{0}/{1}".format(prefix,co);
		} else  if ($env.instance){
			path ="{0}/{1}".format($env.instance,co);
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
			my.perms[path] =!!result.length;
		}
		return my.perms[path];
	};


/* Function: C.logStat
	Logs to cust_stats.

	Parameters:
		detail		-	*Optional, default "access"*

	Saves session_id, app_name, person_id(user id), detail and purpose to
	cust_stats
	*/
	C.logStat = function(detail, appname, callback){
		if (C.localMode) return;
		univnm.db.saveRow("stats","insert",{
			id:C.createUuid(),
			session_id:C.session_id,
			app_name:appname || C.options.appname,
			person_id:univnm.user_id,
			detail:detail||"access",
			purpose:$env.purpose||"UNKNOWN"
		}, callback? callback: function(){});
	};
/* Function: C.createUuid
	returns a Universally Unique IDentifier string.
	*/
	Ext.require("Ext.data.UuidGenerator");
	C.createUuid = function(){

		return Ext.data.IdGenerator.get('uuid').generate();
	};

/* Function: C.genClickFunction
	generates a script for use in an text event hander that fires an Ext event

	Parameters:
		id			-	Id of the element that this handler will be attached to. It
						is important that this is unique and accurate to prevent
						memory leaks
		viewQuery	-	Ext.ComponentQuery query of the component that should
						fire this event
		eventName	-	Event name to fire
		value		-	Value to attach to this event. This will be the "value"
						property of the event data when fired

	Event Data:
		src		-	the Ext Component firing the event
		element	-	The DOM element the firing the event
		value	-	the value registered for this event

	Example:
	(code)
		//in a grid ..
		id:"main_grid",
		columns:[{
			dataIndex:"id",
			text:"ID"
		},{
			text:"Display",
			flex:1,
			dataIndex:"display_name",
			renderer:function(val,md,record){
				var id =Ext.id();
				return new Ext.Template(
					'<a id="{id}" href="#" onclick="{onclick}">{val}</a>',
				'').apply({
					onclick:C.genClickFunction(
						id,
						"#main_grid",
						"click_display",
						record
					),
					val:val,
					id:id
				})
			}
		}],
		listeners:{
			click_display:function(data){
				console.log(data.src,"Ext source component")
				console.log(data.element,"DOM element")
				console.log(data.value,"Event Value")
			}
		}
	(end)
	*/
	C.genClickFunction = function(id,viewQuery,eventName,value){
		C.valueCache[id] =function(){
			var view = Ext.ComponentQuery.query(viewQuery)[0];
			view.fireEvent(eventName,{
				src:view,
				element:document.getElementById(id),
				value:value
			});
		};
		//clean up cache
		C.cleanValueCache();
		var fn ="C.valueCache['{0}']()".format(id);
		//console.log(fn,"fn")
		return fn;
	};
	C.cleanValueCache = Ext.Function.createBuffered(function(){
		for (var id in C.valueCache){
			if (!document.getElementById(id)) {
				delete C.valueCache[id];
				//console.log("removed " + id)
			}
		}
	},1000);
	C.valueCache={};
/* ---------------- handleError --------------------------------------------- */
	C.handleError = function(options){
		var formatJsError=function(e){
			C.error =e;
			C.console.error(e.stack||e);


			return new Ext.Template([
				'Message:     {message}',
				'{stack}'
			].join("\n")).apply(e);
		};
		var detail="";
		switch(options.type){
			case "decode":
				detail = new Ext.Template([
					'JSON decode Error: ',
					'{error}',
					'JSON: {json}'
				].join("\n")).apply({
					error:formatJsError(options.e),
					json:options.json
				});
				break;
			case "callback_exception":
				var error="";
				if (options.e instanceof SyntaxError){
					error = "\n"+options.xhr.responseText.replace(/\[/,"\n[");
				} else {
					error = formatJsError(options.e);
				}
				detail = new Ext.Template([
					'Error in Callback ID {cb_id}:',
					'{error}',
					'\nParameters:',
					'{params}'
				].join("\n")).apply({
					cb_id:options.options.callback_id,
					error:error,
					params:options.options.parameters
				});
				break;
			case "js":
				detail = new Ext.Template([
					'JS Error:',
					'{error}'
				].join("\n")).apply({
					error:formatJsError(options.e)
				});
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
				});
				break;
			default:
				//debug_window(options)
				detail = Ext.encode(options);
		}
		C.logStat('error');
		C.about(
			new Ext.Template([
				'An Error Occurred!',
				'{detail} ',
				' ',
				'Please describe what your were doing when this error occurred and click "Send Error Report" below',
				'------------------------------------------------------------------------------------------------'
			].join("\n")).apply({
				detail:detail
			})
		);

	};
/* =================== Classes ============================================== */
	/* ----------- C.Settings ----------------------------------------------- */
	console.log("Defining C.Settings");
		Ext.define("C.Settings", {
			mixins: {
				observable: "Ext.util.Observable"
			},
			requires: ["univnm.db"],
			singleton: true,
			queueEvents: true,
			eventQueue: [],
			app: (function() {
				var x = new Ext.util.HashMap({ });
				x.on({
					add: function(hm, key, val) { C.Settings.setGlobal(key, val, undefined); },
					remove: function(hm, key, val) { C.Settings.removeApp(key, val); },
					replace: function(hm, key, val, old) { C.Settings.setGlobal(key, val, old); }
				});
				return x;
			})(),
			user: (function() {
				var x = new Ext.util.HashMap({
					resetAll: function(callback) {
						univnm.jslib.async.marshal(
							function(done){ // new way
								univnm.db.saveRow(
									'values',
									'remove',
									{
										application:C.options.appname,
										user_id:univnm.user_id,
										instance:$env.instance||"prod"
									},
									done
								);
							},
							function(done){//legacy way
								univnm.db.saveRow(
									'values',
									'remove',
									{
										application:C.options.appname,
										"key like":univnm.user_id +".%",
										instance:$env.instance||"prod"
									},
									done
								);
							}
						).then(function(){
							for (var k in C.Settings.user.getKeys()) {
								C.Settings.mergedValues[k] = C.Settings.page.get(k) || C.Settings.app.get(k);
								C.Settings.fireEvent("deletedsetting",k);
								C.Settings.getViewport().fireEvent("deletedsetting", k);
							}
							C.Settings.user.clear();
							//C.infoMsg("User Values reset.")
							if (callback) callback();
						});
					}
				});
				x.on({
					add: function(hm, key, val) { C.Settings.setUser(key, val, undefined); },
					remove: function(hm, key, val) { C.Settings.removeUser(key, val); },
					replace: function(hm, key, val, old) { C.Settings.setUser(key, val, old); }
				});
				return x;
			})(),
			page: (function() {
				var x = Ext.create("Ext.util.HashMap", { });
				x.on({
					add: function(hm, key, val) { C.Settings.setTemp(key, val, undefined); },
					remove: function(hm, key, val) { C.Settings.removePage(key, val); },
					replace: function(hm, key, val, old) { C.Settings.setTemp(key, val, old); }
				});
				return x;
			})(),
			getViewport: function() {
				return Ext.ComponentQuery.query("viewport").first();
			},
			loaded: false,
			mergedValues:{},
			constructor: function(config) {
				var $this = this, db = univnm.db;
				this.callParent(arguments);
				this.mixins.observable.constructor.call(this, config);
				//this.getViewport().addEvents('settingchanged', 'settingdeleted');
				this.app.set = this.app.replace; // syntactic sugar
				this.page.set = this.page.replace;
				this.user.set = this.user.replace;
				C.values = this.mergedValues; // compatability
				C.defaultValues = this.mergedValues; // compatability
			},

			load: function() {
				var $this=this;
				if (this.loaded) {
					return this;
				}

				univnm.jslib.load_mpage_ids();
				records = univnm.db.query([
					"select ",
					"	v.key, ",
					"	v.value, ",
					"	1 perm, ",
					"	v.user_id ",
					"FROM ",
					"	UNMH.cust_values{tableExtension} v ",
					"WHERE ",
					"	v.application = '{appname}' ",
					"	AND ( ",
					"		user_id IS NULL or user_id = {user_id} ",
					"	) ",
					"	AND  not REGEXP_LIKE(v.key,'[[:digit:]]+\\.') ",
					"	AND instance ='{instance}' "
				], {
					appname: C.options.appname,
					instance: $env.instance || "prod",
					user_id: univnm.user_id
				});

				this.loaded = true;
				records.forEach(function(setting) {
					if (setting.user_id) {
						$this.user.set(setting.key, setting.value);
					} else {
						$this.app.set(setting.key, setting.value);
					}
				});
				Ext.apply($this.mergedValues, $this.app.map);
				Ext.apply($this.mergedValues, $this.user.map);
			},

			setGlobal: function(key, val, old) {
				if (!(this.user.containsKey(key) || this.page.containsKey(key))) this.mergedValues[key] = val;
				this.$persistValue(key, val, true, null);
				this.enqueueEvent(key, val, old, 'app');
			},

			fireQueuedEvents: function() {
				var ev;
				while (( ev = this.eventQueue.shift() )) {
					ev();
				}
				this.queueEvents = false;
				this.fireEvent("settingsloaded");
				this.getViewport().fireEvent("settingsloaded");
			},

			enqueueEvent: function(key, val, old, target) {
				var full = {
					type: target,
					key: key,
					value: val,
					oldvalue: old
				}, $this = this;

				var fireEvents = function() {
					if (old != val) {
						C.Settings.getViewport().fireEvent(key + "$changed", val, full);
						C.Settings.fireEvent(key + "$changed", val, full);
						C.Settings.getViewport().fireEvent("settingchanged", key, val, full);
						return C.Settings.fireEvent("settingchanged", key, val, full);
					}
				};
				if (this.queueEvents) {
					this.eventQueue.push(fireEvents);
				} else {
					fireEvents();
				}
			},

			setUser: function(key, val, old) {
				if (!this.page.containsKey(key)) this.mergedValues[key] = val;
				this.$persistValue(key, val, true, univnm.user_id);

				this.enqueueEvent(key, val, old, 'user');
			},

			setTemp: function(key, val, old) {
				this.mergedValues[key] = val;

				this.enqueueEvent(key, val, old, 'page');
			},

			$persistValue: function(key, val, perm, user_id) {
				var $this = this, m;
				if (perm && !this.queueEvents) {
					var dp = {
						"application = ":C.options.appname,
						"key = ": key,
						value: val,
						"instance =":$env.instance||"prod"
					};
					if (user_id) {
						dp["user_id ="] = user_id;
					}
					univnm.db.saveRow(
						'values',
						'set',
						dp,
						function() {

						}
					);
				}
				return true;
			},

			removeUser: function(key) {
				this.mergedValues[key] = this.page.get(key) || this.app.get(key);
				this.$removeValue(key, univnm.user_id);
			},

			removeApp: function(key) {
				this.mergedValues[key] = this.page.get(key) || this.user.get(key);
				this.$removeValue(key, null);
			},

			removePage: function(key) {
				this.mergedValues[key] = this.user.get(key) || this.app.get(key);
				this.getViewport().fireEvent("settingdeleted", key);
			},

			$removeValue: function (key, user_id) {
				var $this = this;

				univnm.db.saveRow(
					'values',
					'remove',
					{
						application:C.options.appname,
						key:key,
						instance:$env.instance||"prod",
						user_id: user_id === null? "#NULL": user_id
					},
					function() {
						$this.fireEvent("settingdeleted", key);
						$this.getViewport().fireEvent("settingdeleted", key);
					}
				);
			}


		});
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


