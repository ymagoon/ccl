/*global Ext univnm*/
Ext.define("univnm.ext.QueryProxy",{
	extend:"Ext.data.DataProxy",
	alias: 'proxy.query',
	read: function load(operation,cb,store){
		// debugger;
		var isSenchaTouch = (function() {
			return ("version" in Ext);
		})();
	/* init */
		var my = arguments.callee;
		var $this =this;
		if (!my.modelCounter) my.modelCounter =1;
		if (!my.modelNames) my.modelNames={};

		/* import properties from model, if not locally defined */
			/* if (this.model){
				"sql,map,pivot,post".split(",").forEach(function(p){
					if (!$this[p]) $this[p] = $this.model[p];
				})
				Ext.applyIf(this.model.extraParams, this.extraParams)
			} */

		var
		params=operation.params||{},
			callback=cb||function(){},
			scope=store||this
		;
		Ext.applyIf(params,this.extraParams||{});
		//if (this.debugParams){
		//	console.log(params,"Store Params")	;
		//}
		//console.log(params,"params")
		// console.log(this,"this")

		if (isSenchaTouch) {
			Ext.applyIf(this, this.config);
			Ext.applyIf(operation, operation.config);
		}


		if (! ("sql" in this)){
			throw new Error(
				"'sql' must be defined for QueryProxy, or readSql must be defined in the model"
			);
		}
		var modelClass = this.model;
		var modelDef;
		if (modelClass) {
			modelDef = new modelClass();
		}
	/* find SQL */
		if (!this.sql){ //Check for RowProxy compatible models
			if (modelDef && modelDef.readSql){
				if (modelDef.readSql instanceof Array){
					this.sql =modelDef.readSql.join(" ");
				} else {
					this.sql =modelDef.readSql;
				}
				this.sql =this.sql.format({
					conditions:"1=1"
				});
			} else if (modelDef && modelDef.proxy && modelDef.proxy.readSql){
				if (modelDef.proxy.readSql instanceof Array){
					this.sql =modelDef.proxy.readSql.join(" ");
				} else {
					this.sql =modelDef.proxy.readSql;
				}
				this.sql =this.sql.format({
					conditions:"1=1",
					table:modelDef.table
				});
				//console.log(this.sql)
			} else {
				throw new Error(
					"'sql' must be defined for QueryProxy, or readSql must be defined in the model"
				);
			}
		} else if (!/select/i.test(this.sql)){
			if (document.getElementById(this.sql)){
				this.sql = document.getElementById(this.sql).innerHTML;

			}else {
				var args = Array.parse(arguments);
				var proxy = this;
				Ext.Ajax.request({
					url:this.sql,
					success:function(r){
						proxy.sql = r.responseText;
						load.apply(proxy,args);
					}
				});
				return;
			}
		}


		if(this.sql instanceof Array){
			this.sql = this.sql.join(' ');
		}

	/* sandbox parameters so that Ext doesn't grab them
			from the global scope in tests
		*/

		if (typeof params.tableExtension == "undefined"){
			params.tableExtension = $env.tableExtension
		}
		if (!params.tableExtension) params.tableExtension ="";


		this.sql.replace(/\{(\w+)\}/g,function(str,term){
			if (!(term in params)) params[term] = null;
			return str;
		});
		/* check tpl "if" statements also */
		this.sql.replace(/<tpl if=["'].*?(\w+).*?["']>/g,function(str,term){
			if (!(term in params)) params[term] = undefined;
			return str;
		});
		univnm.ObjectLib.getKeys(params).forEach(function (k) {
			if (params[k] && typeof params[k] == "object" && params[k] instanceof Date){
				params[k] =params[k].format('d-m-Y H:i:s');
			}
		});
	/*apply parameters*/
		var queryParams = params;
		if (this.convertParams){
			var convertParams = this.convertParams;
			if (convertParams instanceof Array){
				queryParams={};
				univnm.ObjectLib.getKeys(params).forEach(function (p) {
					if (convertParams.contains(p)){
						queryParams[p] = univnm.db.toSql(params[p]);
					} else {
						queryParams[p] = params[p];
					}
				})
			} else {
				queryParams = univnm.db.toSql(queryParams);
			}

		}
		params.sql =new Ext.XTemplate(this.sql).apply(queryParams);

	/* find/create model */
		var modelName;

		if (this.sql in my.modelNames){
			modelName	= my.modelNames[this.sql];
		} else {
			modelName ="DynamicQueryModel" +(++my.modelCounter);
			my.modelNames[this.sql] = modelName;
		}
		//console.log(my.modelNames)

		//console.log(reader)

		/* params = ObjectLib.applyTo(params,{
			sort:"rownum",
			dir:""
		},true) */
		//console.log(params)
	/* Fix dates in sorters */
		(operation.sorters || []).forEach(function(sort){
			if (/_date$/.test(sort.property)) sort.property= sort.property.replace(/_date/,"_dt_tm");
		});

		var parsedSql;
		//console.log(params)

	/* apply paging window */
		if ( operation.limit && !this.pivot){
			params.start =(parseInt(operation.start,10)||0) +1;
			params.end = parseInt(operation.start,10) + parseInt(operation.limit,10);
			params.sorters = operation.sorters;
			parsedSql = new Ext.XTemplate([
				/*'SELECT * FROM (',
					'SELECT ',
						'rownum rnum, ',
						'a.*,',
						'(select count(*) from (',
							'{sql}',
						')) total_rows',
					'FROM(',
						'{sql} ',

						'<tpl if="sorters.length">',
							'Order By ',
								'<tpl for="sorters">',
									'{property} {direction}',
									'<tpl if="xindex != parent.sorters.length ">,</tpl>',
								'</tpl>',
						'</tpl>',
					') a ',
					'WHERE rownum <= {end}',
				')',
				'WHERE rnum >={start}'*/
				"select * from ( ",
				"    SELECT ",
				"        \"_data\".*, ",
				"        rownum rnum, ",
				"        count(*) over () total_rows ",
				"    FROM ( ",
				"		{sql} ",
				"        <tpl if='sorters.length'> ",
				"        Order By ",
				"        <tpl for='sorters'> ",
				"            {property} {direction} ",
				"            <tpl if='xindex != parent.sorters.length'>,</tpl> ",
				"        </tpl> ",
				"        </tpl> ",
				"    ) \"_data\" ",
				") ",
				"WHERE rnum BETWEEN {start} and {end} "
			].join(" ")).apply(params);

		} else {
			//console.log("operation", operation)
			parsedSql = new Ext.XTemplate(
				params.sql,
				'<tpl if="typeof sort !==\'undefined\'">Order By {sort} {dir}</tpl>'
			).apply(params);
		}
		//debug_window(params)

		//console.log(parsedSql,"sql")
	/* Run query */
		var pf1 = $profiler.begin("Query: " + store.$className);
		univnm.db.query(parsedSql,function(result){
			pf1();
			var pf2 = $profiler.begin("Post Processing on Query: " + store.$className);
		/* init */
		//console.log(result);
			var total;
			var orig = result;
		/* Function: completeLoad */
			function completeLoad(result){
				try{
					if (result.length) {
						result.columns = univnm.ObjectLib.getKeys(result[0]);
					}
					if (!store.model && !store._model){
						if (typeof window[modelName] === "undefined"	){
							if (isSenchaTouch) {
								Ext.define(modelName , {
									extend: 'Ext.data.Model',
									config: {
										fields:result.columns,
										idField: result.columns[0]
									}
								});
								operation.setModel(window[modelName]);
							} else {
								Ext.define(modelName , {
									extend: 'Ext.data.Model',
									fields:result.columns
								});
							}
						}
						$this.setModel(window[modelName],true);


					} else {
						// console.log($this.getModel().prototype.fields.keys.join(","));
						result.columns.forEach(function(col) {
							if (!(col in this.getModel().prototype.fields.map)) {
								this.getModel().prototype.fields.add(new Ext.data.Field(col));
							}
						}, $this);
					}
											if (window[modelName] && !window[modelName].prototype.fields.getCount()){
							window[modelName].prototype.fields.addAll(
								result.columns.map(function(col){
									return new Ext.data.Field(col);
								})
							);
						}

					//$this.setModel({fields:result.columns})
					var r = new Ext.data.reader.Json({root:"rows"});

					$this.setReader(r);
					//console.log(r)

					//store.recordType = r.recordType;
					//store.reader = r;
					//store.fields = r.recordType.prototype.fields;


					//console.log(result.columns.join(),"columns")
					/* console.log("result",result)
					console.log("total",total) */
					if (isSenchaTouch) {
						operation.process('read', r.readRecords(result));

					} else {
						result = r.read({
							rows:result,
							total:total
						});
						Ext.apply(operation, {
							resultSet: result
						});
						operation.setCompleted();
						operation.setSuccessful();
					}
					Ext.callback(callback, scope || $this, [operation]);
					pf2();
				} catch(e){
					console.log(e.stack);
				}
				/* console.log(records,"records")
				callback.call(scope, records, arg, true); */
			}

		/* map */
			if ($this.map){
				result = result.map($this.map.bind($this));
			}
		/* filter */
			if ($this.filter){
				result = result.filter($this.filter.bind($this));
			}
		/* pivot */
			if ($this.pivot){
				result = result.pivot($this.pivot.keyField,$this.pivot.categoryField,$this.pivot.valueField,$this.pivot.fieldSanitizer);
				if ($this.pivot.map){
					result = result.map($this.pivot.map.bind($this));
				}
				//debug_window(result.toHtmlTable())
				total = result.length;
				//console.log(result,"pivot")
			} else total=result.length?result[0].total_rows:0;

		/* post */
			if ($this.post){
				var retval = $this.post(result,function(result){
					completeLoad(result);
				},params, store);
				if (retval) completeLoad(retval);
			} else {
				completeLoad(result);
			}
		});

	},
	api:{},
	update: function(params, records){}
});

/* Class:	univnm.ext.QueryStore
	Ext DateStore implementation that uses <query.js> to retrieve data

	Config Options:
		sql		-	If this is an SQL select statement, it is used directly. If
					this is an ID of a dom element, then the content of that
					element is used. If this is a URL to a file, then the
					content of that file is used. Regardless, this SQL will be
					treated as an Ext.XTemplate and merged with any the store's
					params and baseParams

		map		-	*Optional, default null*
					*Function*.
					If defined, <DataSet.map> will be called against the value
					returned by the underlying query, passing this function as
					the handler

		filter	-	*Optional, default null*
					*Function*.
					If defined, <DataSet.filter> will be called against the value
					returned by the underlying query, passing this function as
					the handler. Run after _map_

		pivot	-	*Optional, default null*
					*Object*
					If defined, <DataSet.pivot> will be called against the value
					returned by the underlying query, using the options defined
					here. See *Pivot Options* below. Run after _map_ and _filter_

		post	-	*Optional, default null*
					*Function*.
					If defined ,this function will called with with the query result
					and a finisher function. This _post_ function can manipulate the
					result in any way and eitehr return the new result, or call the
					finishing function with the new result. Runs after map,filter,
					and pivot

		convertParams	-	*Optional, default null*
							*Boolean or Array[String]*
							If this is "true" then every params passed to this
							store is passed through <univnm.db.toSql>. If this
							is an array of strings, then only parameters with
							these names will be converted

	Pivot Options:
		keyField		-	The key column in the query
		categoryField	-	The category column in the query
		valueField		-	The value column
		map				-	*Optional, default null*
							*Function*.
							This performs the same function as the _map_
							property in the config, but is run after pivoting

	Special Behaviors:
		*	if "limit" is defined and "pivot" is not, then the query
			will be pagenated
		*	If remoteSort = true, then an "order by" clause
			will be added to the the SQL. If sortInfo is defined, it will set
			the initial sort. If remoteSort=true, then you can put multiple
			columns in the "field" property and set "direction" to space (" ")
		*	"_date" pseudo columns in parameters will be converted to "_dt_tm"


	See Also:
		* <query.js>

	Examples:
	(code)
		...
		store: store=new Ext.data.QueryStore({
			storeId:"sqlstore",
			sql:"vitals",
			remoteSort: true,
			autoLoad:true,
			map:function(row){
				if(/^temperature/i.test(row.code_display)) row.code_display = "Temperature"
				return row
			},
			pivot:{
				keyField:"event_end_date",
				categoryField:"code_display",
				valueField:"value",
				map:function(row,index,result){
					result.columns.forEach(function(col){
						// kinda dumb, but lets 0 out nulls
						if (!row[col]) row[col] =0
					})
					return row
				}
			},
			post:function(result,finish){
				query("some more stuff,function(more){
					result.merge(more)
					finish(result)
				})
			}
			baseParams:{
				person_id:72436989,
				encounter_id:43378087,
				start_date:query.toDate(new Date().add(Date.DAY,-1)),
				end_date:query.toDate(new Date()),
				limit:25
			},
			sortInfo:{
				field:'event_end_data',
				direction:'DESC'
			}
		}),
		...
		<sql id="qryVitals">
			SELECT
				code_display(72, c.EVENT_CD) AS code_display
				,code_display_key(72, c.EVENT_CD) AS code_display_key
				, c.result_val as value
				, c.event_end_dt_tm
				, to_char(c.event_end_dt_tm,'DAY MM-DD HH24:MI') date_label

			FROM clinical_event	c
			WHERE c.person_id = {person_id}
			AND c.event_end_dt_tm BETWEEN {start_date} AND {end_date}
			AND c.encntr_id = {encounter_id}
			AND c.event_cd IN (
				code_lookup(72, 'SPO2'),
				code_lookup(72, 'TEMPERATUREORAL'),
				code_lookup(72, 'TEMPERATURETYMPANIC'),
				code_lookup(72, 'TEMPERATURERECTAL'),
				code_lookup(72, 'TEMPERATURETEMPORAL'),
				code_lookup(72, 'TEMPERATUREAXILLARY'),
				code_lookup(72, 'HEARTRATEMONITORED'),
				code_lookup(72, 'RESPIRATORYRATE'),
				code_lookup(72, 'SYSTOLICBLOODPRESSURE'),
				code_lookup(72, 'DIASTOLICBLOODPRESSURE'),
				code_lookup(72, 'SYSTOLICBLOODPRESSURE'),
				code_lookup(72, 'MEANARTERIALPRESSURE'),
				code_lookup(72, 'MEANARTERIALPRESSURECUFF'),
			0)
		</sql>
	(end)
*/
Ext.define("univnm.ext.QueryStore",{
	extend:"Ext.data.Store",
	alias:"store.query",
	buildConfig: function(config) {
		// each transaction upon a singe record will generate a distinct Direct transaction since Direct queues them into one Ajax request.
		var cb = false;
		var setMeSomeStuff = {
			fn: function($store, operation) {
				var storeKeys = univnm.ObjectLib.getProperties(Ext.data.Store.prototype.config);
				univnm.ObjectLib.getProperties(config).filter(function(key) {
					return !storeKeys.contains(key);
				}).forEach(function(newProperty) {
					if (!$store[newProperty])
						$store[newProperty] = config[newProperty];
				});
				if (cb) {
					if (typeof cb == "function") {
						var i = cb.call($store, $store, operation);
						$store.on("beforeload", cb);
						return i;
					} else if (typeof cb == "object" && cb.fn) {
						var i = cb.fn.call($store, $store, operation);
						$store.on(cb);
						return i;
					}
				}
			},
			single: true
		};
		var c = Ext.apply({
			mergeColumns: this.mergeColumns,
			toDataSet: this.toDataSet,
			getDeferred: this.getDeferred
		},config, {
			batchTransactions: false,
			defaultPageSize:0,
			pageSize:0
		});
		console.log(c);
		var rv =  Ext.apply(c, {
			proxy: {
				type: "query",
				sql:config.sql||this.sql,
				convertParams:config.convertParams,
				pivot:config.pivot||this.pivot,
				map:config.map||this.map,
				filter:config.proxyFilter||this.proxyFilter,
				post:config.post||this.post,
				extraParams:config.extraParams||this.extraParams
			},
			reader: new Ext.data.reader.Json(Ext.copyTo({root:"data"}, c, 'idProperty'), c.fields)
		});
		if (!rv.listeners) {
			rv.listeners = {};
		}
		if (rv.listeners.beforeload) {
			cb = rv.listeners.beforeload;
		}
		rv.listeners.beforeload = setMeSomeStuff;
		return rv;
	},

	constructor: function(config){
		this.callParent([ //rv ]);
			this.buildConfig(config)
		]);
	},

	getDeferred: function getDeferred() {
		var deferred = univnm.jslib.async.marshal(function (done) {
			if (this.isLoading()) this.on("load", done, { single: true }); else setTimeout(done);
		}, this);
		getDeferred = function() { return deferred; };
		return deferred;
	},

	mergeColumns: function(ds, options) {
		var model = this.getProxy().getModel(), changes = 0;
		if (ds.length === 0) return;
		options = options || {};
		options = Ext.apply({
			idProperty: model.prototype._idProperty || model.prototype.idProperty,
			columns: options.columns || ds.columns || univnm.ObjectLib.getKeys(ds[0])
		}, options);
		var store = this;

		if (!(options.idProperty in model.prototype.fields.map)) {
			throw new Error("idProperty " + options.idProperty + " not in source model/store");
		}

		options.columns.forEach(function(col) {
			if (!(col in model.prototype.fields.map)) {
				model.prototype.fields.add(new Ext.data.Field(col));
			}
		});

		store.suspendEvents(false);
		ds.forEach(function(row) {
			var rec = store.getById(row[options.idProperty]);
			if (rec) {
				options.columns.forEach(function(col) {
					rec.set(col, row[col]);
				});
				rec.commit();
				changes++;
			} else {
				console.error("Trying to merge rows");
			}
		});
		store.resumeEvents(true);
		store.fireEvent('refresh', store);
		console.log('Merged rows: '+changes);
		if (changes === 0 && ds.length > 0) {
			console.error("nothing merged");
		}
	},
	/*Function: toDataSet
		returns a DataSet of this store's data

		Example:
		(code)
			var emps = Ext.StoreMgr.get("employees").toDataSet()
				.findAllByCol("manager_id",record.get("employee_id"))
				.valueArray("employee_id")
				.join()
		(end)
	*/
	toDataSet:function(){
		var records = this.snapshot||this.data;
		return new univnm.DataSet({
			columns:this.getProxy().getModel().prototype.fields.keys,
			data:records.items.map(function(record){
				return record.data;
			})
		});
	}
});

