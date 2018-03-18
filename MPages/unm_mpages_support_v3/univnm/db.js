/*global univnm Ext console $O*/
univnm.db ={}

/* Topic: Dependencies
	The univnm.db.query and univnm.db.saveRow functions have certain Oracle, CCL,
	and JS library dependencies

	Oracle Dependencies:
	* A custom schema, in your domain's Oracle DB called unmh
	* univnm/cust_tables.sql run in unmh schema
	* V500 must grant select to your custom schema for any tables you want to
		access with univnm.db.query()

	CCL Dependencies:
	* univnm_query_to_json.prg	(included in the univnm folder of this distribution)
	* univnm_row_manager.prg	(included in the univnm folder of this distribution)


	JS Dependencies:
	* <jslib.js>


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


/* Class: univnm.db */
/* Function: univnm.db.query
	Queries the server and returns a <univnm.DataSet> object of the results

	Parameters:
	sql			-		SQL to execute. Can be an SQL string, an array of strings,
						or a series of string arguments. See examples below
	params		-		*Optional, default null*
						if this is a function, it is assumed to be _callback_.
						If this an object, it is assumed to be the parameters to
						be merged into _sql_
	callback	-		*Optional, default null*
						If defined, then this will be an asynchronous callback
						with the result returned as the first param to _callback_.
						If not defined, a synchronous callback is made and the
						result is returned from this function
	Note:
		any column that ends with "dt_tm" will added as a new column ending in
		"date" that has an actual JS date value. For example, a univnm.db.query
		that contains "updt_dt_tm" will have a resultset that contains a
		"updt_dt_tm" that is a string value and "updt_date" that is a Date()
		object

	SQL and Params:
		The SQL string passed into query is expected to be either a template to
		be used with <String.format> or, if ExtJS is available and Ext.XTemplate.

		if _params_ is passed, then this object will be merged with _sql_ before
		executing

	Code Lookups:
		Code lookups for where clauses can be performed efficiently by using a
		special comment in your code: /* CODESET 72 WBC HGB HCT * / Note that
		there is no space between * and /. The result will be pasted in as a
		comma-separated list of code values. If a given display key has more
		than one code value in the selected code set, all values will be
		inserted. <univnm.db.cacheCodes> will be called internally to cache code
		values

	See Also:
		* <univnm.db.codeLookup>
		* <univnm.db.cacheCodes>
		* <String.format>
		* <http://docs.sencha.com/ext-js/4-1/#!/api/Ext.XTemplate>

	Examples:

	Single SQL string:
	(code)
		//callback can be passed as the second argument
		univnm.db.query(
		"SELECT univnm_code.display(o.CATALOG_CD) display, O.ORIG_ORDER_DT_TM, o.CATALOG_CD FROM ORDERS O where o.active_ind = 1 AND o.encntr_id = 41416065 ORDER BY O.ORIG_ORDER_DT_TM DESC",
		function(result){
			univnm.jslib.debug_window(result.toHtmlTable())
		})
	(end)

	SQL string array param:
	(code)
		univnm.db.query(
			[
				'SELECT',
					'univnm_code.display(o.CATALOG_CD) display,',
					'O.ORIG_ORDER_DT_TM,',
					'o.CATALOG_CD',
				'FROM',
				'ORDERS O',
				'where',
					'o.active_ind = 1',
					'AND o.encntr_id = 41416065 ',
				'ORDER BY',
					'O.ORIG_ORDER_DT_TM   DESC '
			],
			function(result){ //if last param is a function, it assumed to be the callback function
				univnm.jslib.debug_window(result.toHtmlTable())
			}
		)
	(end)

	Using a template:
	(code)
		<script>
		univnm.db.query(
			[
				'SELECT  ',
					'univnm_code.display(c.EVENT_CD) AS code_display ',
					',univnm_code.display_key(c.EVENT_CD) AS code_display_key ',
					', c.result_val as value ',
					', c.event_end_dt_tm',

				'FROM clinical_event   c ',
				'WHERE c.person_id = {person_id} ',
				'AND c.event_end_dt_tm BETWEEN {start_date} AND {end_date} ',
				'AND c.encntr_id = {encounter_id} ',
				'AND c.event_cd IN ( /* CODESET 72 ',
					' SPO2 ',
					' TEMPERATUREORAL ',
					' TEMPERATURETYMPANIC ',
					' TEMPERATURERECTAL ',
					' TEMPERATURETEMPORAL ',
					' TEMPERATUREAXILLARY ',
					' HEARTRATEMONITORED ',
					' RESPIRATORYRATE ',
					' SYSTOLICBLOODPRESSURE ',
					' DIASTOLICBLOODPRESSURE ',
					' SYSTOLICBLOODPRESSURE ',
					' MEANARTERIALPRESSURE ',
					' MEANARTERIALPRESSURECUFF * /',
				'0)'
			],
			{
				person_id:1111111111,
				encounter_id:22222222222,
				start_date:univnm.db.toDate(new Date().add(Date.DAY,-1)),
				end_date:univnm.db.toDate(new Date())
			},
			function(result){ //if last param is a function, it assumed to be the callback function
				debug_window(result.toHtmlTable())
			}
		)
		</script>

	(end)


	*/
	univnm.db.query = function query(){
		var sql,params,cb;
		var args = Array.parse(arguments);
		var $this = this;
		var queryResult;

		if (typeof args.last() == "function"){
			cb = args.pop();
		}
		if (args.length > 1 && typeof args.last() == "object"){
			params = args.pop();
		}
		if (args.first() instanceof Array){
			args[0] = args[0].join(" ");
		}

		sql = args.join(" ");

		var codes =null;
		var missingCodes=false;
		sql = sql
			//fix single line comments
			.replace(/--(.*)$/mg,"/* $1 */")
			.replace(/\s/g," ")
			//optimize out code lookups
			/*.replace(/code_lookup\(\s*(\d+)\s*,\s*'(\w+)'\)/ig,function(str,code_set,display_key){
				return univnm.db.codeLookup(code_set,display_key);
			})*/
			.replace(/\/\*\s*CODESET\s*(\d+)\s*((?:\w+\s*)+)\*\//ig,function(str,code_set,display_keys){
				display_keys.split(/\s+/).forEach(function(display_key){
					if (!display_key) return;
					if (!codes) codes={};
					if (!codes[code_set]) codes[code_set] =[];
					//console.log(codes)
					codes[code_set].appendUnique(display_key);
					if (
						!$this.codeCache[code_set] ||
						!$this.codeCache[code_set][display_key]
					) {
						missingCodes =true;
					}
				});
				return str;
			});

		// we might need to do an async code lookup, so we're marshaling here
		univnm.jslib.async.marshal(function(done){
			// do we need to lookup codes?
			if(missingCodes){
				if (cb){
					return $this.cacheCodes(codes,function(){
						done();
					});
				}else{
					$this.cacheCodes(codes);
					done();
				}
			} else done();
		}).then(function(){
			//do we need to substitute codes?
			if (codes){
				sql =sql.replace(/\/\*\s*CODESET\s*(\d+)\s*((?:\w+\s*)+)\*\//ig,function(str,code_set,display_keys){
					return display_keys.split(/\s+/)
					.filter(function(display_key){
						return display_key;
					})
					.map(function(display_key){
						return $this.codeCache[code_set][display_key];
					});
				});
			}

			if (!params) params = {};

			if (typeof params.tableExtension == "undefined"){
				params.tableExtension = $env.tableExtension
			}
			if (!params.tableExtension) params.tableExtension ="";

			if (typeof Ext == "undefined"){
				sql = sql.format(params);
			} else {
				sql = new Ext.XTemplate(sql).apply(params);
			}


			function formatResult(result){
				if (typeof result == "string") throw new Error(result);

				result = new univnm.DataSet(result);
				result.columns.forEach(function(colName){
					if (/dt_tm$/.test(colName) ){
						var dateCol = colName.replace(/dt_tm$/,"date");
						result.columns.push(dateCol);
					}
				});
				result.forEach(function(row){
					result.columns.forEach(function(colName){
						if (
							typeof row[colName] == "string" &&
							row[colName].length &&
							/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/.test(row[colName])
						){
							try{
								row[colName] =Date.parseDate(row[colName],"Y-m-d H:i:s");
							} catch(e){}
						}
					});
				});

				return result;
			}

			var o = {
				ccl:"univnm_query_to_json",
				async:false,
				parameters:[sql],
				eval_result:true
			};
			if (cb){
				o.onsuccess = function(result){
					cb(formatResult(result));
				};
				o.async=true;
				univnm.jslib.ccl_callback(o);
			} else{
				queryResult = formatResult(univnm.jslib.ccl_callback(o));
			}
		});



		return queryResult;
	};
/* Property: univnm.db.codeCache
	contains a chacke of code values by code set and display key

	See:
		* <univnm.db.codeLookup>
		* <univnm.db.cacheCodes>

	*/
	univnm.db.codeCache = {};
/* Function: univnm.db.codeLookup
	looks up a code from the code_value table.

	Parameters:
		code_set		-	code set to search
		display_key		-	display key to search


	Throws and exception if the code is not found

	Example:
	(code)
		var ADMIN = uninvnm.db.codeLookup(88,'ADMIN');
	(end)

	See:
		* <univnm.db.codeCache>
		* <univnm.db.cacheCodes>
		* <univnm.db.query>
	*/
	univnm.db.codeLookup = function(code_set,display_key){
		if (!this.codeCache[code_set]) this.codeCache[code_set] ={};
		if (!this.codeCache[code_set][display_key]){
			var work ={};
			work[code_set]=[display_key];
			this.cacheCodes(work);
		}
		return this.codeCache[code_set][display_key];
	};
/* Function: univnm.db.cacheCodes
	preCaches code values so that calls to <codeLookup> run faster

	Parameters:
		codes	-	JS object
					Keyed by codeset, each value containing an array of
					display keys
		cb		-	*Optional, default null*
					Function
					If defined, cacheCodes will be run async and _cb_ will
					be called when codes are ready

	Example:
	(code)
		//background load code values
		univnm.db.cacheCodes(
			{
				88:['ADMIN','BEDROCK'],
				72:['WBC','HBC','DIFFIS']
			},
			function(){}
		)
	(end)
	*/
	univnm.db.cacheCodes = function(codes,cb){
		var values = {
			code_sets:[],
			display_keys:[]
		};
		var $this = this;


		for (var code_set in codes){
			codes[code_set].forEach(function(display_key){
				if (
					!$this.codeCache[code_set] ||
					!$this.codeCache[code_set][display_key]
				){
					values.code_sets.appendUnique(code_set);
					values.display_keys.appendUnique("'"+display_key+"'");
				}
			});
		}

		var sql = [
			"select ",
			"	code_value, code_set, display_key ",
			"from ",
			"	code_value ",
			"where ",
			"	code_set in ({code_sets}) ",
			"	and display_key  in ({display_keys}) "
		];
		var data;
		if (values.code_sets.length){
			univnm.jslib.async.marshal(function(done){
				if (cb){
					$this.query(sql,values,function(result){
						data = result;
						done();
					});
				}else{
					data =$this.query(sql,values);
					done();
				}
			}).then(function(){
				data.forEach(function(row){
					if (!$this.codeCache[row.code_set]){
						$this.codeCache[row.code_set]={};
					}
					if (!$this.codeCache[row.code_set][row.display_key]){
						$this.codeCache[row.code_set][row.display_key]=[];
					}

					$this.codeCache
						[row.code_set]
						[row.display_key]
						.appendUnique(row.code_value);
				});
				//validate that all the codes were found
				var missingCodes =[];
				for (var code_set in codes){
					codes[code_set].forEach(function(display_key){
						if (
							!$this.codeCache[code_set] ||
							!$this.codeCache[code_set][display_key]
						){
							missingCodes.push(code_set+":"+display_key);
						}
					});
				}
				if(missingCodes.length){
					throw new Error("Unable to fins these code values: " + missingCodes)
				}
				if (cb) cb();
			});
		} else if (cb) cb();

	};
/* Function: univnm.db.toDate
	converts a JS date into a Oracle to_date function string

	Parameters:
		date		-	JS Date object

	Example:
	(code)
		var result =univnm.db.query([
			'SELECT  ',
			'		code_display(72, c.EVENT_CD) AS code_display ',
			'		,code_display_key(72, c.EVENT_CD) AS code_display_key ',
			'		, c.result_val as value ',
			' FROM clinical_event   c ',
			' WHERE c.person_id = {person_id} ',
			' AND c.updt_dt_tm BETWEEN {start_date} AND {end_date} ',
			' AND c.encntr_id = {encounter_id} ',
			' AND c.event_cd IN ( ',
			'     code_lookup(72, \'DIRECTCOOMBSIGG\'), ',
			'     code_lookup(72, \'TBILIRUBIN\') ',
			' ) '
		],
		{
			person_id:patient_id,
			encounter_id:encounter_id,
			start_date:univnm.db.toDate(C.range_start),
			end_date:univnm.db.toDate(C.range_end)
		});
	(end)

	*/
	univnm.db.toDate = function(date){
		if (!(date instanceof Date)){
			throw new Error("univnm.db.toDate only works for native Date objects");
		}
		return "to_date('" +date.format('d-m-Y H:i:s') +"', 'DD-MM-YYYY HH24:MI:SS')";

	};
/* Function: univnm.db.toSql
	converts a native JS value into an SQL string

	Parameters:
		value			-	JS Number,string,null,date, JS Object or array. See
							*Conversions"* below
		encodeObjects	-	Boolean, default false.
							if true, Arrays and JS Objects are encoded as JSON
							with the "#JSON" header for storage in custom tables

	Conversions:
		Number		-	converted to raw string

		String		-	If the value starts with '#' then the # is removed and
						the value is returned. If the value is a date string in
						the form of "d-m-Y H:i:s" it is treated like a date
						(see below). Otherwise the value is wrapped in
						single ticks('), with any internal ticks doubled. Hard
						returns are replaced with ' || chr(10) || '

		Date		-	converted to a to_date() string via <univnnm.db.toDate>

		Null		-	converted to "NULL"

		Array		-	(if !encodeObjects)
						returns an "in" list "(items1,item2,...itemN)" where
						each item is formatted via the above rules

		JS Object	-	(if !encodeObjects)
						returns a new object where each of the values are
						converted via toSql(value)



	Example:
	(code)
		var result =univnm.db.query([
			'SELECT  c.result_val as value ',
			' FROM clinical_event   c ',
			' WHERE c.person_id = {person_id} ',
			' AND c.updt_dt_tm BETWEEN {start_date} AND {end_date} ',
			' AND c.encntr_id = {encounter_id} ',
			' AND c.event_cd IN {codes}'
		],
		univnm.db.toSql({
			person_id:patient_id,
			encounter_id:encounter_id,
			start_date:new Date().clearTime().add(Date.DAY,-1),
			end_date:new Date().clearTime(),
			codes:[
				"#code_lookup(72, 'DIRECTCOOMBSIGG')",
				"#code_lookup(72, 'TBILIRUBIN')"
			]
		})
		);
	(end)

	*/
	univnm.db.toSql = function toSql(value,encodeObjects){
		// convert null/undefined/emptystring/NaN etc
		// do this first to prevent matching "" as a string
		if (!value && value !== 0) value ="#NULL";

		//Convert string
		if (typeof value === "string"){
			if (value.charAt(0) == "#"){
				value = value.substring(1);
			} else {
				var d;
				if ( (d=Date.parseDate(value,"d-m-Y")) ||  (d=Date.parseDate(value,"d-m-Y H:i:s")) ){
					value = d;
				} else value = "'{0}'".format(value.replace(/'/g,"''"));
			}

		}



		//convert date
		if (value instanceof Date) {
			value = univnm.db.toDate(value);
		}
		//convert boolean
		if (!!value === value) value = value?"'#JSONtrue'":"'#JSONfalse'";

		if (encodeObjects){
			//json encode
			if (typeof value == "object"){
				value = "'#JSON{0}'".format(
					univnm.jslib.jsonEncode(value).replace(/'/g,"''")
				);
			}
		} else {
			if (value instanceof Array){
				value = "({0})".format(
					value.map(function(v){
						return toSql(v);
					}).join()
				);

			} else if (typeof value == "object"){
				var newObj = {};
				for (var p in value){
					newObj[p] = toSql(value[p]);
				}
				return newObj;
			}
		}

		//fix hard returns
		value = String(value).replace(/\n+/g,function (str) {
			return "' || {0} ||'".format(
				Array.dim(str.length).map(function (argument) {
					return " CHR(10) "
				}).join(" || ")
			)
		}).replace(/~+/g,function (str) {
			return "' || {0} ||'".format(
				Array.dim(str.length).map(function (argument) {
					return " CHR(126) "
				}).join(" || ")
			)
		}).replace(/[\u0000-\u001F]+/g,"")


		return value;
	};


/* Function: univnm.db.saveRow
	Saves a row of data to a custom table

	Parameters:
		table	-	name of tablet to modify. Only tables in unmh beginning with
					"cust_" can be modified. The "cust_" is implied, so
					"cust_values" and "values" would both refer to the same table
		type	-	One of "insert,update,remove,set".
					See *Insert Type, Update Type, etc* below
		data	-	Either a row or an array of rows to save. If this is an array,
					then each row will be handled separately on th eback-endA row
					is a JS object where the properties are column names and the
					values are the values for those columns. Some save types
					support a space and an operator in the property(column) name
					to indicate that the column should be used in the where clause,
					using that operator. values are interpreted by type. See *Value parsing* below
		cb		-	*Optional, default null*
					Function. If defined, this call will be made asynchronously
					and _cb_ will be called when finished. Other wise this call
					will be made synchronously and will return when finished.

	Value Parsing:
		Values in rows are translated via the following rules:

		* Null values are converted to "#NULL"
		* String values that start with a # are passed through as raw SQL values
		* Other String values are wrapped in single quotes and any internal
			single quotes are escaped
		* Dates are converted to to_date strings (See univnm.db.toDate)
		* booleans are converted to either 1 or 0
		* Final string value will have all hard-returns converted to ' || chr(10) || '

	Insert Type:
		The "insert" type is used for inserting rows in to the table. Operators
		in the column names are ignored, and all values in the row are inserted

		(code)
			var data =[{
				id:"#Null",//pull from sequence trigger
				application:C.options.appname,
				key:"refreshDate",
				value:new Date()
			}]
			univnm.db.saveRow("values","insert",data,function(){})
		(end)

	Update Type:
		The "update" type is used for updating rows in the table. Operators
		in the column names indicate the where expression. All values in the row
		are updated.

		(code)
			var data =[{
				"application = ":C.options.appname,
				"key =":"refreshDate",
				value:new Date()
			}]
			univnm.db.saveRow("values","update",data,function(){})
		(end)

	Remove Type:
		The "remove" type is used for removing rows from the table. All columns
		are used in the where expression. The assumed operator is "="

		(code)
			//remove values like 'refresh%' older than 7 days
			var data =[{
				application:C.options.appname,
				"key like":"refresh%",
				"value <":"#sysdate -7"

			}]
			univnm.db.saveRow("values","remove",data,function(){})
		(end)

	Set Type:
		The "set" type is used for updating or inserting rows based on a natural
		key. Operators in the column names indicate the where expression, however
		the only valid operator is "=". if a row exists matching the where
		expression it is updated, otherwise inserted.

		(code)
			var data =[{
				"application =":C.options.appname,
				"key =":"refreshDate",
				value:"#sysdate"
			}]
			univnm.db.saveRow("values","set",data,function(){})
		(end)

	*/
	univnm.db.saveRow = function saveRow(table,type,data,cb){
		var result=[];


		if (!cb) cb = function(){};
		if (!data) return cb();
		if (!(data instanceof Array)){
			data = [data];
		}
		if (data.length === 0) {
			return cb();
		}
		var workArray = [];
		var batchArray =[];
		var length=0;
		table = table.replace(/^cust_/i,"");

		var te = $env.tableExtension;
		var ignored = ($env.tableExtensionIgnore||[]).map(function (name) {
			return name.replace(/^cust_/i,"");
		})
		if (te && !ignored.contains(table) && table.right(te.length) != te){
			table+=te;
		}

		if (this.debug) {
			data.forEach(function(row) {
				console.log("univnm_row_manager DRY RUN", ["MINE",table,type,row]);
				result.push(row);
			});
			if (cb) {
				cb(result);
			}
			return result;
		}

		data.forEach(function(data){
			//console.log("saveRow data = " ,data)
			var row = $O(data).toArray().map(function(tuple){
				//convert to SQL and escape magic characters used by row_manager
				var value = univnm.db.toSql(tuple.value,true)
					.replace(/~/g,"_TILDE_")
					.replace(/\|/g,"_PIPE_")
					.replace(/\^/g, "_CARET_")
					.replace(/\$/g, "_DOLLA_");
				if (value.toUpperCase() == '#NULL'){
					tuple.key =tuple.key.listFirst(" ") + " is";
				}
				return tuple.key+":"+String(value);
			}).join("|");

			if (length + row.length > 30000){
				if (!length) {
					throw new Error(
						"data too large for saveRow ({0}k > 50k)"
						.format(row.length/1024)
					);
				}

				batchArray.push(workArray.join("~"));
				workArray =[];
				length=0;
			}
			length += row.length;
			workArray.push(row);
		});
		batchArray.push(workArray.join("~"));

		if (cb){
			univnm.jslib.async.marshal(
				batchArray.map(function(col_values){
					return function(done){
						var o = {
							ccl:"univnm_row_manager",
							parameters:["MINE",table,type,col_values],
							eval_result:true,
							onsuccess:function(data){
								result = result.concat(data);
								done();
							},
							async:true
						};

						univnm.jslib.ccl_callback(o);
					};

				})
			).then(function(){
				cb(result);
			});
		} else {
			batchArray.forEach(function(col_values){
				var o = {
					ccl:"univnm_row_manager",
					parameters:["MINE",table,type,col_values],
					eval_result:true,
					async:false
				};

				var data =univnm.jslib.ccl_callback(o);
				result = result.concat(data);
			});
			return result;
		}
	};
