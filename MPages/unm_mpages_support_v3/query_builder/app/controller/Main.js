Ext.define("MPAGE.controller.Main", {
	extend: "Ext.app.Controller",
	init: function() {
		var $this = this;
		this.control({
			'main':{
				add_query_tab:function(){
					this.openQueryTab("-- New Query\n");
				},
				generate_audit_trigger:function(event){
					this.generateAuditTrigger(event.table_name);
				},
				change_domain:function(event){
					$env.serviceUrl = $env.serviceUrl.replace(/[a-z]126/g,event.value);
					
					
				},
				insert_options:function(event){
					var cmPanel =event.src
						.down("*[itemId=center_tabs]")
						.activeTab.down("*[name=sql]");

					this.displayInsertMenu(event.tableNode,cmPanel,event.xy);
				},
				query_table:function(event){
					this.queryTable(event.table);
				},
				audit_table:function(event){
					this.generateAuditTrigger(event.table);
				}
			},
			'query_pane': {
				to_ext:function(event){
					if (!event.sql) return;
					var converted =this.convertSql(event.sql);

					var extPane = event.src
						.up("query_tab")
						.down("ext_pane");
					extPane.ownerCt.setActiveTab(extPane);
					extPane
						.form.findField("code")
						.setValue(converted);
				},
				sql_changed:function(event){
					if (!event.sql) return;
					var variablesGrid = event.src.up("query_tab")
						.down("propertygrid");
						
					var curVariables = variablesGrid.getSource();
					var newVariables = {};
					event.sql.replace(/\{(\w+)\}/g,function(str,p1){
						newVariables[p1] = curVariables[p1]||"";
						return str;
					});
					variablesGrid.setSource(newVariables);
					var firstLine = event.sql.split(/\n/).first("")
						.replace(/\W/g," ")
						.trim()
						.left(20);
					event.src.up("query_tab").setTitle(firstLine||"Query");
					
				},
				
				run_query:function(event){
					
					this.runQuery(
						event.sql,
						false,
						event.src.up("query_tab").down("*[itemId=results]"),
						event.src.up("query_tab").down("propertygrid").getSource()
					);
				},
				beautify:function(event){
					event.src.form.findField("sql")
						.setValue(this.beautifySql(event.sql));
				},
				dbname_drop:function(event){

					var record = event.record;
					var cmPanel = event.cmPanel;
					var xy = event.xy;

					
				}
			},
			'ext_pane': {
				to_sql:function(event){
					if (!event.code) return;
					var converted =this.convertExt(event.code);
					sqlPane = event.src
						.up("query_tab")
						.down("query_pane");
					sqlPane.up("tabpanel").setActiveTab(sqlPane.ownerCt);
					sqlPane
						.form.findField("sql")
						.setValue(converted);
				}
			}
		});
	},
	addCenterTab:function(config){
		var tabPanel = Ext.ComponentQuery.query("main *[itemId=center_tabs]").first();
		Ext.apply(config,{
			closable:true
		});
		tabPanel.show();
		if (config.id && tabPanel.items.containsKey(config.id)){
			tabPanel.setActiveTab(config.id);
		}else {
			// if (ordinal !== undefined){
			//	tabPanel.insert(ordinal,config);
			// } else {
				tabPanel.add(config);
			// }
			tabPanel.setActiveTab(tabPanel.items.getCount()-1);
		}
	},
	beautifySql:function(sql){
		var indent =0;
		var selectIndent =0;
		var parenIndent =0;
		var result=[];
		var line=[];
		var lastCommand="";
		var parens =[];
		var selects =[];
		return sql
			.replace(/[\n\s]+/g," ")
			.replace(/(\W)on\s*\(/ig,"$1 on ( ")
			//.replace(/(\S)\)/ig,"$1 ) ")
			
			.replace(/(\s*)(['\.\w]+|,|\(|\))(\s*)/g,function(match,begin,word,end){
			//console.log(lastCommand +":",word)
			switch(true){
			
			
			case word =="(":
				parens.push(indent);
				
				indent++;
				lastCommand="subquery";
				return word +"\n" + "\t".repeat(indent);
			case word ==")":
				if (lastCommand != "function") {
					if (parens.length == selects.parenDepth) {
						selects.pop();
						selects.parenDepth--;
					}
					indent = parens.pop();
				}
				
				lastCommand="end_subquery";
				//return word + end
				return  "\n" + "\t".repeat(indent) +word + "\n" + "\t".repeat(indent);
			case /^inner|outer|full|join$/i.test(word) && !/_/.test(word):
				if (/^inner|outer|full$/i.test(lastCommand)){
					return match;
				}else{
					//indent++;
				}
				
				lastCommand = word;
				return  "\n" + "\t".repeat(indent) +match;
				
			case /^on$/i.test(word):
				if (!/^inner|outer|full|join$/i.test(lastCommand)){
					//indent++
				}
				
				lastCommand = word;
				return  word  + "\t".repeat(indent);
			case /^and|or$/i.test(word):
				if (lastCommand != word ){
					//indent++
				}
				lastCommand = word;
				return "\n"+"\t".repeat(indent) + word +" ";
					
			case /^union/i.test(word):
				selectIndent=0;
				indent=0;
					
				lastCommand = word;
				return "\n" + word +"\n";
			case /^select/i.test(word):
				selects.push(indent);
				selects.parenDepth = parens.length;
				indent++;
					
				lastCommand = word;
				return "\n" + "\t".repeat(indent-1)   + word +"\n" + "\t".repeat(indent);
				
			case /^from|where|having$/i.test(word):
				if (lastCommand=="text") return match;
				indent = selects.last(0)+1;
				return "\n" +"\t".repeat(indent-1) + word +"\n" + "\t".repeat(indent);
			
			case /^group|order$/i.test(word):
				if (lastCommand=="text") return match;
				indent = selects.last(0)+1;
				lastCommand=word;
				return "\t".repeat(indent-1) +"\n" + word +end;
			case /^by$/i.test(word):
				if (/group|order/.test(lastCommand)) {
					return  /* "\t".repeat(indent-1) +"\n" + */word +"\n" + "\t".repeat(indent);
				} else return match;

			case /,$/.test(word)/* word =="," */:
				//console.log("word==",word)
				if (lastCommand == "function") return word;
				return word +"\n" + "\t".repeat(indent);
			default:
				lastCommand=match;
				return match;
			}
		}).replace(/\n\s*\n/g,"\n").trim();
		
	},
	convertSql:function(sql){
		return sql.split(/\n/)
			.filter(function(line){
				return !!line && !!line.trim();
			})
			.map(function(line){
				return '"{0} "'.format(
					line
						.replace(/\/\*.*?\*\//g,"")
						.replace(/"/g,'\\"')
						.replace(/\s*$/,"")
				);
			}).join(",\n");
	},
	convertExt:function(code){
		var q = code.match(/^\s*(['"])/);
		if (!q) {
			alert("Ext code must one or more lines of quoted text");
			return "";
		}
		q=q[1];
		return code.split(/\n/).map(function(line){
			//if (/<tpl/.test(line)){
			//	line = line.replace(
			//		/<tpl/,
			//		"/* {tpl_vars_here} */<tpl"
			//	)
			//
			//}
			return line
				.replace(new RegExp("\\\\" +q,"g"),"_Q_") //escaped quotes
				.replace(new RegExp("^(\\s*)" + q),"$1") //first quote
				.replace(/,\s*$/,"") //end commas
				.replace(new RegExp(q+"\\s*$" ),"") //last quote
				.replace(new RegExp("_Q_","g"),q); //restore quotes
		
		}).join("\n");
	},
	getKeyInfo:function(record,cb){
		var keyInfo={
			explicit:null,
			implied:null
		};
		univnm.jslib.async.marshal(
			function(done){
				univnm.db.query(
					"select ",
					"	distinct lower(con_cols_local.column_name) local_col, ",
					"   lower(ac.TABLE_NAME) local_table, ",
					"	lower(con_cols_remote.TABLE_NAME) remote_table, ",
					"	lower(con_cols_remote.COLUMN_NAME) remote_col ",
					"from ",
					"	all_CONSTRAINTS ac ",
					"	join all_cons_columns con_cols_remote  on	( ",
					"		ac.R_CONSTRAINT_NAME = con_cols_remote.CONSTRAINT_NAME ",
					"	) ",
					"	join all_cons_columns con_cols_local  on	( ",
					"		ac.CONSTRAINT_NAME = con_cols_local.CONSTRAINT_NAME ",
					"	) ",
					"where ",
					"	ac.table_name = '{table_name}' ",
					"	and con_cols_local.COLUMN_NAME ='{column_name}' ",
					"	and ac.CONSTRAINT_TYPE ='R' ",
					record.data,
					function(result){
						keyInfo.explicit = result.first(null);
						done();
					}
				);
			},
			function(done){
				keyInfo.implied = Ext.StoreManager.get("FlatTableData")
					.toDataSet()
					.findAllByCol("column_name",function(val,index,row){
						return val == record.data.column_name &&
							row.table_name != record.data.table_name;
					});
					
					
				keyInfo.implied.sortByCol("column_id");
				done();
			}
		).then(function(){

			if (cb) cb(keyInfo);
		});
	},
	displayInsertMenu:function(record,cmPanel,xy){
		var $this = this;
		var local_alias = $this.aliasTable(record.data.table_name);
		function insert(text){
			cmPanel.codeMirror.replaceSelection(text+"\n");
			window.setTimeout(function(){
				cmPanel.codeMirror.setSelection(
					cmPanel.codeMirror.getCursor(false),
					cmPanel.codeMirror.getCursor(false)
				);
			});
		}
		var m = Ext.create('Ext.menu.Menu', {
			items: [{
				iconCls:"icon_run_query",
				text: 'Query Table:"{table_name}" in a new tab'.format({
					table_name:record.data.table_name.toLowerCase()
				}),
				handler:function(){
					$this.queryTable(record);
				}
			},{
				iconCls:"icon_insert",
				text: 'Insert Table:"{table_name} {local_alias}"'.format({
					local_alias:local_alias,
					table_name:record.data.table_name.toLowerCase()
				}),
				handler:function(){
					insert(
						record.data.table_name.toLowerCase() +
						" " +$this.aliasTable(record.data.table_name)
					);
				}
			},{
				iconCls:"icon_insert",
				text: 'Insert Column:"{0}"'.format(record.data.column_name.toLowerCase()),
				handler:function(){
					insert(
						record.data.column_name.toLowerCase()
					);
				}
			},{
				iconCls:"icon_insert",
				text: 'Insert Column:"{local_alias}.{column_name}"'.format({
					local_alias:local_alias,
					column_name:record.data.column_name.toLowerCase()
				}),
				handler:function(){
					insert(
						local_alias + "."+record.data.column_name.toLowerCase()
					);
				}
			},{
				iconCls:"icon_insert",
				text: 'Insert all columns, comma separated',
				handler:function(){
					insert(
						Ext.StoreMgr.get("FlatTableData").toDataSet()
							.findAllByCol("table_name",record.get("table_name"))
							.valueArray("column_name")
							.join(",\n").toLowerCase()
					);
				}
			},{iconCls:"icon_insert",
				text: 'Insert all columns with alias, comma separated',
				handler:function(){
					var alias =$this.aliasTable(record.get("table_name"));
					insert(
						Ext.StoreMgr.get("FlatTableData").toDataSet()
							.findAllByCol("table_name",record.get("table_name"))
							.valueArray("column_name")
							.map(function(name){
								return alias + "." + name;
							})
							.join(",\n").toLowerCase()
					);
				}
			},{
				iconCls:"icon_insert",
				text: 'Insert Join on "{local_alias}.{column_name}"'.format({
					local_alias:local_alias,
					column_name:record.data.column_name.toLowerCase()
				}),
				handler:function(){
					cmPanel.up("panel").getEl().mask("analyzing table");
					$this.getKeyInfo(record,function(keyInfo){
						cmPanel.up("panel").getEl().unmask();
						if (keyInfo.explicit){
							var data = keyInfo.explicit;
							data.local_alias = $this.aliasTable(data.local_table);
							data.remote_alias = $this.aliasTable(data.remote_table);
							
							insert(
								[
									"join {remote_table} {remote_alias}  on ( ",
									"\t    {local_alias}.{local_col} = {remote_alias}.{remote_col} ",
									"\t)"
								].join("\n").format(data)
							);
							window.setTimeout(function(){
								cmPanel.codeMirror.setSelection(
									cmPanel.codeMirror.getCursor(false),
									cmPanel.codeMirror.getCursor(false)
								);
							});
							
						} else if(keyInfo.implied){
							var m = Ext.create('Ext.menu.Menu', {
								items: keyInfo.implied.map(function(remote){
									return {
										iconCls:"icon_insert",
										text:"from table " + remote.table_name,
										handler:function(){
											var data={
												remote_table:remote.table_name.toLowerCase(),
												remote_alias:$this.aliasTable(remote.table_name),
												remote_col:remote.column_name.toLowerCase(),
												local_table:record.data.table_name.toLowerCase(),
												local_alias:$this.aliasTable(record.data.table_name),
												local_col:record.data.column_name.toLowerCase()
											};
											insert(
												[
													"join {remote_table} {remote_alias}  on ( ",
													"\t    {local_alias}.{local_col} = {remote_alias}.{remote_col} ",
													"\t)"
												].join("\n").format(data)
											);
										}
									};
								})
							});
							m.showAt(xy);
						} else {
							alert("No matches for column {0}".format(record.data.column_name));
						}
					});
							
				}
			}]
		});
		m.showAt(xy);
	},
	generateAuditTrigger:function (table_name) {
		var $this = this;
		var params={
			table_name:table_name,
			trigger_name:table_name.left(24) + "_AUDTR",
			primary_col:null,
			columns:null
		};
		var triggerText = [
			"CREATE OR REPLACE TRIGGER {trigger_name} ",
			"     AFTER INSERT OR UPDATE OR DELETE ON {table_name} for each row ",
			"DECLARE ",
			"     v_REC_ID         VARCHAR2(100); ",
			"     v_error_message  VARCHAR2(100); ",
			"BEGIN ",
			"     IF INSERTING THEN ",
			"          v_REC_ID := :NEW.{primary_col}; ",
			"     ELSE ",
			"          v_REC_ID := :OLD.{primary_col}; ",
			"     END IF; ",
			"     <tpl for=\"columns\"> ",
			"     IF :OLD.{column_name} != :NEW.{column_name} and UPDATING then ",
			"     insert into cust_change_audit ( ",
			"        id, ",
			"        transaction_id, ",
			"        full_name, ",
			"        person_id, ",
			"        table_name, ",
			"        column_name, ",
			"        old_value, ",
			"        new_value, ",
			"        audit_ts, ",
			"        primary_key ",
			"     ) values ( ",
			"        cust_seq_audit.nextval, ",
			"        univnm_vars.v_trans_id, ",
			"        univnm_vars.v_user_name, ",
			"        univnm_vars.v_person_id, ",
			"        '{table_name}', ",
			"        '{column_name}', ",
			"        to_char(:OLD.{column_name}), ",
			"        to_char(:NEW.{column_name}), ",
			"        sysdate, ",
			"        v_REC_ID ",
			"     ); ",
			"     END IF; ",
			"     IF INSERTING then ",
			"     insert into cust_change_audit ( ",
			"        id, ",
			"        transaction_id, ",
			"        full_name, ",
			"        person_id, ",
			"        table_name, ",
			"        column_name, ",
			"        old_value, ",
			"        new_value, ",
			"        audit_ts, ",
			"        primary_key ",
			"     ) values ( ",
			"        cust_seq_audit.nextval, ",
			"        univnm_vars.v_trans_id, ",
			"        univnm_vars.v_user_name, ",
			"        univnm_vars.v_person_id, ",
			"        '{table_name}', ",
			"        '{column_name}', ",
			"        '<<ROW_INSERT>>', ",
			"        to_char(:NEW.{column_name}), ",
			"        sysdate, ",
			"        v_REC_ID ",
			"     ); ",
			"     END IF; ",
			"     IF DELETING then ",
			"     insert into cust_change_audit ( ",
			"        id, ",
			"        transaction_id, ",
			"        full_name, ",
			"        person_id, ",
			"        table_name, ",
			"        column_name, ",
			"        old_value, ",
			"        new_value, ",
			"        audit_ts, ",
			"        primary_key ",
			"     ) values ( ",
			"        cust_seq_audit.nextval, ",
			"        univnm_vars.v_trans_id, ",
			"        univnm_vars.v_user_name, ",
			"        univnm_vars.v_person_id, ",
			"        '{table_name}', ",
			"        '{column_name}', ",
			"        to_char(:OLD.{column_name}), ",
			"        '<<ROW_DELETE>>', ",
			"        sysdate, ",
			"        v_REC_ID ",
			"     ); ",
			"     END IF; ",
			"     </tpl> ",
			"     EXCEPTION ",
			"        WHEN OTHERS THEN ",
			"        v_error_message := '{trigger_name}: '||SQLERRM;",
			"        insert into cust_log(type,detail) values('error',v_error_message); ",
			"END {trigger_name}; "
		].join("\n");

		univnm.jslib.async.marshal(
			function(done){
				univnm.db.query(
					"/* Get primary key for {table_name} */",
					"SELECT ",
					"	a.COLUMN_NAME ",
					"FROM ",
					"	USER_IND_COLUMNS a, ",
					"	USER_CONSTRAINTS b ",
					"WHERE ",
					"	a.INDEX_NAME=b.INDEX_NAME ",
					"	AND a.TABLE_NAME= '{table_name}' ",
					"	AND b.CONSTRAINT_TYPE='P' ",
					params,
					function(result){
						if (result.length == 1) {
							params.primary_col = result.first().column_name;
						} else{
							params.primary_col = "rowid";
						}
						
						done();
					}
				);
			},
			function(done){
				params.columns=Ext.StoreMgr.get("FlatTableData")
					.toDataSet()
					.findAllByCol("table_name",params.table_name)
					.map(function(col){
						return {
							column_name:col.column_name,
							table_name:params.table_name
						};
					});
				done();
			}
		).then(function(){
			C.showWinText(
				params.trigger_name,
				new Ext.XTemplate(triggerText).apply(params)
			);
		});
		
	},
	queryTable:function(tableNode){
		var ta = this.aliasTable(tableNode.data.table_name);
		this.openQueryTab([
			"-- Query: {1}",
			"select ",
			"{0} ",
			"from ",
			"	{1} {2}",
			"where 1=1 "
		].join("\n").format(
			Ext.StoreMgr.get("FlatTableData")
			.toDataSet()
			.findAllByCol("table_name",tableNode.data.table_name)
			.filter(function(col){
				return "CHAR,VARCHAR2,DATE,NUMBER,FLOAT".listContains(
					col.type.listFirst("(")
				);
			})
			.map(function(col){
				return "\t"+ta+"." +col.column_name.toLowerCase();
			}).join(",\n"),
			tableNode.data.table_name.toLowerCase(),
			ta
		));
	},
	aliasTable:function(name){
		return name.split(/_/).map(function(word){
			return word.left(1).toLowerCase();
		}).join("");
	},
	runQuery:function(sql,full,rp,variables){
		var c = this;
		//var rp = Ext.ComponentQuery.query("*[itemId=results]")[0];

		rp.removeAll();
		var store =new univnm.ext.QueryStore({
			sql:sql,
			pageSize:full?10000:parseInt((rp.getHeight()-75)/21,10),
			extraParams:variables
		});
		var started = new Date().getTime();
		rp.setLoading({
			store:store
		});
		store.loadPage(1,{
			callback:function(records){
				rp.add({
					xtype:"supagrid",
					store:store,
					columns:store.proxy.model.getFields()
						.filter(function(col){
							return !"rnum,total_rows".listContainsNoCase(col.name);
						})
						.map(function(col){
						return {
							dataIndex:col.name,
							text:col.name,
							flex:records.length
								?typeof records.first().data[col.name] == "string"
									?1
									:0
								:0,
							//flex:1,
							renderer:function(val){
								if (val && val instanceof Date){
									return val.format("m/d/Y H:i:s");
								} else {
									return String(val).left(100).escapeHtml();
								}
							}
						};
					}),
					editFormConfig:{
						position:"right",
						xtype:"form",
						width:400,
						//frame:true,
						title:"Values",
						tools:[{
							type:"close",
							handler:function(event,tool,panel){
								panel.ownerCt.form.close();
							}
						}],
						//autoScroll:true,
						layout:"fit",
						/*items:store.proxy.model.getFields()
							.filter(function(col){
								return !"rnum,total_rows".listContainsNoCase(col.name);
							})
							.map(function(col){
								return {
									fieldLabel:col.name,
									labelWidth:150,
									labelAlign:"top",
									labelStyle:"font-weight:bold",
									name:col.name,
									xtype:"displayfield"
								};
							})*/
						items:[{
							xtype:"propertygrid",
							source:{}
						}],
						listeners:{
							beforegridload:function(form,record){
								form.down("propertygrid").setSource(record.data);
							}
						}
						
					},
					dockedItems: [{
						xtype: 'pagingtoolbar',
						store: store,   // same store GridPanel is using
						dock: 'bottom',
						
						displayInfo: true,
						items:[{
							iconCls:"icon_query_full",
							text:"Get Full Results",
							hidden:full,
							handler:function(b){
								c.runQuery(sql,true,b.up("query_tab").down("*[itemId=results]"));
							}
						},{
							xtype:"tbtext",
							
							text:"<b>Queried {1} rows in {0}</b>".format(
								Date.formatInterval(
									new Date().getTime()-started,
									{
										style:"short"
									}
								),
								store.count()
							)
						}]
					}]
					
				});
			}
		});
		
	},
	openQueryTab:function(sql){
		this.addCenterTab({
			xtype:"query_tab",
			sql:sql
		});
	}
});