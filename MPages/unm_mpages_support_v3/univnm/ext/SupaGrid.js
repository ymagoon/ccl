/*global Ext */
/* Class:  univnm.ext.SupaGrid
	An Ext4 grid implementation with extra features

	Detail:
	This component takes all the normal Grid config options, plus extra options
	that enhance the standard grid.

	Topic: Example
	(code)
		...
		xtype:"supagrid",
		paged:true,// creates paging toolbar
		//infiniteScroll:true, //enable this for infiniteScrolling
		editFormConfig:{ // creates edit form
			xtype:"host.form",//this had best exist somewhere

			position:"right",//create form in right-side dock
			editTriggerCol:"host_name"//open form when host_name" column is clicked"

		},
		filterPosition:"top",//put the filter in the top dock slot

		store:{
			type:"host",//this should already exist
			autoLoad:true,
			remoteSort:true
		},
		tbar:[{
			text:"Add Host",
			handler:function(){
				creates a new "host" entry and opens the edit form
				this.up("grid").showEditForm({host_name:"Wicked"})
			}
		}],

		columns:[
				{dataIndex:"host_name", text:"Host Name", filterable:true},
				{dataIndex:"alias" },
				{dataIndex:"address", text:"Address", filterable:true },
				//assumes 'hostfiltercombo' exists
				{dataIndex:"name", text:"Template Name", filterable:true, filterControl:"hostfiltercombo"}
			]
		})(),
		loadMask: true,
		listeners:{
			//listens to any cellclik in the "address" column
			address_cellclick:function(value,record,col,grid){
				console.log("clicked value " + value)
			}

		}
		...
	(end)

	Property: paged
		*Grid Property* Setting this grid property to "true" will create a
		paging toolbar on the bottom of the grid, and will set the pageSize to
		the number of rows visible in the grid. This should result in each page
		fitting within the grid view, without scrolling

	Property: infiniteScroll
		*Grid Property* Setting this grid property to "true" will create a
		paging toolbar on the bottom of the grid, and will set the pageSize to
		the number of rows visible in the grid. This should result in each page
		fitting within the grid view, without scrolling

	Property: filterPosition
		*Grid Property* sets the dock position for the filter panel

		Only applies when <filterable> is true for at least one column

		Possible Values:
			top		-	displays in the top dock position, with a horizontal layout
			bottom	-	displays in the bottom dock position, with a horizontal layout
			left	-	displays in the left dock position, with a vertical layout
			right	-	displays in the right dock position, with a vertical layout

		See:
			* <filterable>

	Property: editFormConfig
		*Grid Property* An Ext config that describes a panel to display when clicking on a row.

		This panel must either be, or include, a form

		Extra options:
			position		-	*Optional, default "popup"*
								Where to display the edit form. See *Possible Positions* below
			editTriggerCol	-	*Optional, default null* If defined, column which triggers
								a form edit. can be either id, dataIndex, or header
								text, but should be unique. If not defined, selecting
								a row, rather than clicking a cell, triggers a form edit
			hideMode		-	*Optional, default 'hidden'*
								set to 'disabled' to have the form always visable
								but disabled when no reacrod is loaded. This may
								be required by certain layouts. Try this if the
								edit panel is not opening when you click a record

		Possible Positions:
			popup	-	displays in a modal Window
			top		-	displays in the top dock position, panel should have a horizontal layout
			bottom	-	displays in the bottom dock position, panel should have a horizontal layout
			left	-	displays in the left dock position, panel should have a vertical layout
			right	-	displays in the right dock position, panel should have a vertical layout

		Basic Form Properties and Functions added by SupaGrid:
			currentRow	-	Property.
							The row used to populate the form. Set by
							SupaGrid on the Basic Form instance when loading

			close		-	Function.
							A function that will close the form, whether it is
							docked or a modal Window

		Form Panel Events  added by SupaGrid:
			beforegridload	-	Fires before loading a record into the form.
								Passes (formPanel,record). Return false
								from a listener to cancel load

	Property: filterAutoCollapse
		*Grid Property* should the filter form collapse after each apply?

	Property: filterMode
		*Grid Property* local store filtering or remote filtering, *default remote*

		Possible Values:
		* local
		* remote

	Property: filterAutoLoad
		*Grid Property* set to true to immediately fire <applyFilter> after render

	Property: filterButtonText
		*Grid Property* set to text you want the button to display, *default "Filter"*

	Property: filterOnSelect
		*Grid Property* *Default false* set to "true" to suppress filtering on enter/select

	Property: filterResetButtonText
		*Grid Property* set to text you want the button to display, *default "Reset Filter"*

	Property: filterResetButtonHide
		*Grid Property* set to true to hide the Filter Reset Button

	Property: filterSuppressTitle
		*Grid Property* If true, suppresses the title on the filter panel

		See Also:
			<toggleFilter>

	Property: filterTitle
		*Grid Property* set to text you want the panel to display, *default "Filter"*

	Property: filterable
		*Column Property* set to true on columns that should be filtered

		Setting this to true for at least one column will enable filtering. A
		panel is created that contains all the filterable columns and "Filter"
		and "Clear" buttons. Appling the filter will internally call <applyFilter>
		which sets extraParams on the store and reloads it

		See:
		* <filterPosition>
		* <applyFilter>
		* <filterType>
		* <filterLabel>
		* <filterLabelAlign>
		* <filterValue>
		* <filterControl>

	Property: filterType
		*Column Property* filter type to display

		Normally filters are displayed as a textbox, but if "date" is set in
		this property, an field set containing and start and end date field will
		be displayed. The matching fields on the store will be <dataIndex>_start
		and <dataIndex>_end respectively

		See:
			* <filterable>
			* <filterControl>

	Property: filterLabel
		*Column Property* text to display as the columns filter label *Default, column header text*

		See:
			* <filterable>

	Property: filterLabelAlign
		*Column Property* how to align labels in the filter panel *Default, top*


		See:
			* <filterable>


	Property: filterValue
		*Column Property* default value for filter on this column *Default, null*

		See:
			* <filterable>

	Property: filterControl
		*Column Property* control to use for filtering this column *Default, textfield*

		this can be either a string xtype, a component config object, or an instance of an existing control

		See:
			* <filterable>

	Property: eventName
		*Column Property* name of event to fire when this column is clicked

		If defined, SupaGrid will fire an event with this name. See the cellclick event for details

		See:
			* <filterable>
	Function: applyFilter
		recalculates grid pageSize, and reloads this grid's store, applying a filter if available


		Parameters:
			filter	-	*Optional, default null*
						JS Object of field values.
						Ignored if there are no filterable columns. Applies
						these values to the filter form before reloading

	Function: resetFilter
		resets the filter to default values

	Function: showEditForm
		displays the edit form for a given record

		Parameters:
			record	-	*Optional, default {}*
						If record is an instance of This grid's store's Model,
						then it is used directly to load the form. If it is a
						simple JS object or is undefined, a new Model record is
						inserted into the store and the form is loaded from its
						values.

	Function: toggleFilter
		Expands or collapses the filter panel

	Function: expandFilter
		Expands the filter panel

	Function: collapseFilter
		Collapses the filter panel

	Event: <column.dataIndex>_cellclick
		Each column will generate a cellclick event, when a cell in that column is clicked

		Parameters:
			value		-	the value of the cell clicked
			record		-	the record of the row clicked
			col			-	The column definition of the column clicked
			grid		-	The grid that fired this event

	Event: before_filter
		fired before executing a filter. Return false to cancel filtering

		Parameters:
			grid		-	A reference to the SupaGrid that fired this event
			form		-	A reference to the BasicForm for the filter

	Event: filter
		fired when a filter is executed, the filter may or may not be finished applying.

		Parameters:
			grid		-	A reference to the SupaGrid that fired this event
			form		-	A reference to the BasicForm for the filter



*/
Ext.define('univnm.ext.SupaGrid', {
	extend: 'Ext.grid.Panel',
	alias:'widget.supagrid',
	initComponent:function(){
		this.events={
			before_filter:true,
			filter:true
		};
		var config = this;
		var grid = this;
		grid.formId = Ext.id();
		var lineHeight = this.lineHeight || Ext.isChrome?22:21;
		/* infiniteScroll */
			if (this.infiniteScroll){
				if (!this.store.buffered){
					//duck-type an instantiated store
					if ("events" in this.store){
						throw new Error("Stores must be buffered for infiniteScroll");
					} else {
						this.store.buffered = true;
					}
				}
				Ext.apply(this,{
					verticalScrollerType: 'paginggridscroller',
					invalidateScrollerOnRefresh: false
				});
			}
		/* applyFilter function */
			this.applyFilter=Ext.Function.createBuffered(function(extraOptions){

				var store =this.getStore();
				var params = store.proxy.extraParams||{};
				var grid = this;
				var filterDef =[];
				var fp = this.down("form[formId="+grid.formId+"]");
				var form = fp.form;
				if (this.fireEvent("before_filter",this,form) === false) return;

				if (this.filtered){
					if (extraOptions){
						form.setValues(extraOptions);
					}

					var titleText=[];

					filterCols.forEach(function(col){
						switch(col.filterType||"string"){
						case "date":
							var val_start =form.findField(col.dataIndex+"_start").getValue();
							if (val_start){
								params[col.dataIndex+"_start"] = val_start;
								filterDef.push(col.startFilterFn?{startFilterFn:function (r) {return col.filterFn(r,val);}}:{
									filterFn: function(record) {
										var colVal = record.get(col.dataIndex);
										//console.log(colVal.clearTime(), val_start, colVal.clearTime() >= val_start)
										return colVal && colVal.clearTime(true) >= val_start;
									}
								});

								titleText.push((col.text||col.header) + ">='" + val + "'");
							} else {
								delete params[col.dataIndex+"_start"];
							}

							var val_end =form.findField(col.dataIndex+"_end").getValue();
							if (val_end){
								params[col.dataIndex+"_end"] = val_end;
								titleText.push((col.text||col.header) + "<='" + val_end + "'");
								filterDef.push(col.endFilterFn?{endFilterFn:function (r) {return col.filterFn(r,val);}}:{
									filterFn: function(record) {
										var colVal = record.get(col.dataIndex);
										//console.log(colVal.clearTime(), val_end, colVal.clearTime() <= val_end)
										return colVal && colVal.clearTime(true) <= val_end;

									}
								});
							} else {
								delete params[col.dataIndex+"_end"];
							}

							break;
						default:
							//console.log(form)
							var val =form.findField(col.dataIndex).getValue()||"";

							if (val){
							//console.log('here')
								params[col.dataIndex] = val;
								titleText.push((col.text||col.header) + ": '" + val + "'");
								var pattern = params[col.dataIndex];

								switch(true){
									case typeof pattern == "number":
										filterDef.push(col.filterFn?{filterFn:function (r) {return col.filterFn(r,val);}}:{
											property:col.dataIndex,
											value:pattern
										});
										break;
									case typeof pattern == "string":
										filterDef.push(col.filterFn?{filterFn:function (r) {return col.filterFn(r,val);}}:{
											property:col.dataIndex,
											value:new RegExp(params[col.dataIndex].escapeRegex(), 'i')
										});
										break;
									case col.filterControl.xtype == "timefield":
										filterDef.push(col.filterFn?{filterFn:function (r) {return col.filterFn(r,val);}}:{
											filterFn: function(record) {
												if (!params[col.dataIndex]) return true;

												var colVal = record.get(col.dataIndex);
												var searchVal = params[col.dataIndex];
												if (!colVal) return false;

												if (typeof colVal == "string"){
													searchVal = form.findField(col.dataIndex).getRawValue();
													return colVal.toLowerCase() == searchVal.toLowerCase();
												}
												if (colVal instanceof Date){
													colVal = Ext.Date.format(colVal,"H:i:s");
													searchVal =Ext.Date.format(searchVal,"H:i:s");

													return colVal == searchVal;
												}


											}
										});
										break;
									case col.filterControl.xtype == "datefield":
										filterDef.push(col.filterFn?{filterFn:function (r) {return col.filterFn(r,val);}}:{
											filterFn: function(record) {
												if (!params[col.dataIndex]) return true;

												var colVal = record.get(col.dataIndex);
												var searchVal = params[col.dataIndex];
												if (!colVal) return false;

												if (typeof colVal == "string"){
													searchVal = form.findField(col.dataIndex).getRawValue();
													return colVal.toLowerCase() == searchVal.toLowerCase();
												}
												if (colVal instanceof Date){
													colVal = Ext.Date.format(colVal,"m/d/Y");
													searchVal =Ext.Date.format(searchVal,"m/d/Y");

													return colVal == searchVal;
												}


											}
										});
										break;

								}

							} else {
								//delete params[col.dataIndex]
								params[col.dataIndex] = null;
							}
						}
					});

					window.setTimeout(function(){
						var title = "Filter: ";
						if(grid.filterTitle) title = grid.filterTitle;
						fp.setTitle(title+titleText.join("|"));
						if(config.filterAutoCollapse) grid.collapseFilter();
					},100);



				}
				if (config.filterMode == "local"){
					store.clearFilter();
					if (filterDef.length){
						store.filter(filterDef);
					}
				} else{
					this.fireEvent("filter",this,form);
					store.proxy.extraParams = params;
					if (config.paged || config.infiniteScroll){
						window.setTimeout(function(){
							store.pageSize =  parseInt((grid.view.getHeight())/lineHeight,10);
							if (config.paged){
								store.loadPage(1);
							} else {
								store.guaranteeRange(0, store.pageSize);
							}

						},100);
					}else{
						store.load();
					}
				}

			},300,this);

		/* resetFilter function */
			this.resetFilter=function(){
				var fp = this.down("form[formId="+grid.formId+"]");
				fp.form.reset();
				fp.applyFilter();
			};

		/* filter bar */
			if (!this.dockedItems) this.dockedItems = [];
			try{
				var filterCols = this.columns.filter(function(col){
					return col.filterable;
				});
			} catch(e){
				filterCols = [];
			}

			if (filterCols.length){
				config.filtered = true;
				var filterPosition = this.filterPosition||'top';

				var layout ="top,bottom".listContains(filterPosition)?"hbox":"vbox";
				var labelAlign=this.filterLabelAlign||"top";

				var doLayout=function(p){
					//p.up("supagrid").ownerCt.doLayout()
					//p.up("supagrid").doComponentLayout()

				};

				this.dockedItems.push({
					xtype: 'form',
					dock: filterPosition,
					formId:grid.formId,
					collapsible:"top,bottom".listContains(filterPosition),
					width:"left,right".listContains(filterPosition)?200:undefined,
					animCollapse:false,
					listeners:{
						show:doLayout,
						hide:doLayout,
						expand:doLayout,
						collapse:doLayout
					},
					title:config.filterTitle||"Filter",
					preventHeader:config.filterSuppressTitle,
					layout:{
						type:layout,
						defaultMargins:{top: 2, right: 2, bottom: 2, left: 2}

					},
					frame:true,
					applyFilter:function(){
						var g = this.up("supagrid");
						g.applyFilter.apply(g,Array.parse(arguments));
					},
					resetFilter:function(){
						var g = this.up("supagrid");
						g.resetFilter.apply(g,Array.parse(arguments));
					},
					items:filterCols.map(function(col){
						var defaultField = {
							xtype:"textfield",
							fieldLabel:col.filterLabel||col.header||col.text,
							labelAlign:labelAlign,
							name:col.dataIndex,
							value:col.filterValue||"",
							flex:layout=="hbox"?1:0,
							enableKeyEvents:true,
							itemId:"filter_" +col.dataIndex,
							listeners:config.filterOnSelect?{
								keyup:function(text,e){
									if (e.keyCode == 13) {
										this.up("supagrid").applyFilter();
									}
									if(this.up("supagrid").filterMode == "local" ){

										this.up("supagrid").applyFilter();
									}
								},
								select:function(){
									this.up("supagrid").applyFilter();
								}
							}:undefined
						};

						if (col.filterControl){
							if (typeof col.filterControl == "string"){
								col.filterControl = {xtype:col.filterControl};
							}
							//col.filterControl.itemId = "filter_" +col.data_index
							return Ext.applyIf(col.filterControl,defaultField);
						}
						switch(col.filterType||"string"){
						case "date":
							return {
								xtype:"fieldset",
								title:col.header||col.text,
								layout:{
									type:layout
								},
								width:layout=="hbox"?225:undefined,
								height:layout=="vbox"?100:undefined,


								items:[Ext.apply({},{
									xtype:"datefield",
									//fieldLabel:"From",
									hideLabel:true,
									name:col.dataIndex + "_start",
									value:col.filterValueStart||col.filterValue||"",
									//itemId:"filter_" +col.data_index+ "_start",
									//width:100,
									labelAlign:"right"//"layout=="hbox"?"right":"top"
								},defaultField),
								{xtype:"label", text:"To:", width:20, flex:0},
								Ext.applyIf({},{
									xtype:"datefield",
									//fieldLabel:"To",
									hideLabel:true,
									name:col.dataIndex + "_end",
									//itemId:"filter_" +col.data_index+ "_end",
									value:col.filterValueEnd||col.filterValue||"",
									flex:1,
									labelAlign:"left"//"layout=="hbox"?"right":"top"
								},defaultField)]
							};

						default:
							return defaultField;
						}
					}).concat(
						(function(){
							if (layout=="hbox"){
								return [{
									xtype:"button",
									text:config.filterButtonText||"Filter",
									style:"margin-top:20px",
									handler:function(){
										var fp = this.up("form");
										fp.applyFilter();
									}
								},{
									xtype:"button",
									text:config.filterResetButtonText||"Reset Filter",
									style:"margin-top:20px",
									handler:function(){
										var fp = this.up("form");
										fp.form.reset();
										fp.applyFilter();
									},
									hidden: config.filterResetButtonHide||false
								}];
							} else return [];

						})()
					),
					buttons:(function(){
						if (layout=="vbox"){
							return [{
								xtype:"button",
								text:"Filter",
								handler:function(){
									var fp = this.up("form");
									fp.applyFilter();
								}
							},{
								xtype:"button",
								text:config.filterResetButtonText||"Reset Filter",
								handler:function(){
									var fp = this.up("form");
									fp.form.reset();
									fp.applyFilter();
								}
							}];
						} else return undefined;

					})()
				});
				/* filter togle functions */
					this.toggleFilter = function(){
						if (layout != "hbox") return;
						if(config.filterSuppressTitle){
							var p = this.down("form[formId="+grid.formId+"]");
							if (p.isHidden()){
								p.show();
							} else {
								p.hide();
							}
							this.doComponentLayout();
						} else {
							this.down("form[formId="+grid.formId+"]").toggleCollapse();
						}
					};
					this.expandFilter = function(){
						if (layout != "hbox") return;
						if(config.filterSuppressTitle){
							this.down("form[formId="+grid.formId+"]").show();
						} else {
							this.down("form[formId="+grid.formId+"]").expand();
						}
						this.doComponentLayout();
					};
					this.collapseFilter = function collapseFilter(){
						if (layout != "hbox") return;
						var p = this.down("form[formId="+grid.formId+"]");
						if(config.filterSuppressTitle){
							if (p.isVisible()) {
								p.hide();
							}
						} else {
							p.collapse();
						}
						this.doComponentLayout();
					};




			}
		/* Edit form - before init */
			if (this.editFormConfig){
				if (!grid.editFormConfig.position) grid.editFormConfig.position="popup";
				if (grid.editFormConfig.position == "popup"){
					this.showEditForm=function(record){
						grid.el.mask("loading..");
						if (!record || !record.isModel) {
							var model =grid.getStore().proxy.getModel();
							record = new model(record||{});
							grid.getStore().add(record);
						}
						grid.editFormConfig.close=function(){
							win.close();
						};

						var title =grid.editFormConfig.title||"Editing Record " + record.internalId;
						delete grid.editFormConfig.title;
						var win =new Ext.Window({
							title:title,
							iconCls:grid.editFormConfig.iconCls,
							/* frame:true,*/
							constrain:true,
							autoShow:true,
							layout:"fit",
							modal:true,
							items:[Ext.apply(grid.editFormConfig,{
								supagrid:grid,
								setTitle:function(val){
									this.up("window").setTitle(val);
								}
							})],
							listeners:{
								afterrender:function(){
									var panel = this.down("form");
									var form=panel.form;
									grid.el.unmask();
									form.currentRecord = record;
									form.reset();
									panel.addEvents("beforegridload");
									if (panel.fireEvent("beforegridload",panel,record)){
										form.loadRecord(record);
									}
									form.close=function(){
										win.close();
									};

								}
							}

						});
					};
				}else{
					if (!this.dockedItems) this.dockedItems = [];

					grid.editFormConfig.dock=grid.editFormConfig.position;
					if (grid.editFormConfig.hideMode=="disabled"){
						grid.editFormConfig.disabled=true;
					} else {
						grid.editFormConfig.hidden=true;
					}
					//grid.editFormConfig.hidden=true;
					grid.editFormConfig.formPane=true;

					this.dockedItems.push(grid.editFormConfig);

					this.showEditForm=function(record){
						grid.el.mask("loading..");
						window.setTimeout(function(){
							if (!record || !record.isModel) {
								var model =grid.getStore().proxy.getModel();
								record = new model(record||{});
								grid.getStore().add(record);
							}
							var pane = grid.down("panel[formPane=true]");

							pane.setTitle(grid.editFormConfig.title||"Editing Record " + record.internalId);
							pane.show();
							pane.setDisabled(false);
							grid.ownerCt.doLayout();

							var panel = pane.is("form")?pane:pane.down("form");
							panel.supagrid =grid;
							var form = panel.form;
							form.currentRecord = record;
							panel.close = form.close = function(){
								if (grid.editFormConfig.hideMode=="disabled"){
									pane.setDisabled(true);
								} else {

									pane.hide();
									grid.ownerCt.doLayout();
								}
							};
							if (panel.fireEvent("beforegridload",panel,record) !==false){
								form.reset();
								form.loadRecord(record);
								grid.el.unmask();
							}
						},100);



					};
				}
			}

		this.callParent(arguments);
		/* add custom header_name_cellclick events */
			this.addEvents.apply(this,
				this.view.getGridColumns().map(function(col){
					return (col.id||col.dataIndex) + "_cellclick";
				})
			);
		/* fire cellClicks */
			this.addListener("cellclick",function(
				/* Ext.grid.view		*/	view,
				/* HTMLElement			*/	cell,
				/* Number				*/	cellIndex,
				/* Ext.data.Model		*/	record,
				/* HTMLElement			*/	row,
				/* Number				*/	rowIndex,
				/* Ext.EventObject		*/	e
				){

				var grid = view.ownerCt;
				var col =view.getGridColumns()[cellIndex];
				//console.log("click col " + col.text, grid)
				if (grid.editFormConfig && !grid.editFormConfig.editTriggerCol){
					grid.showEditForm(record);
					return false;
				}

				if (!col) return;
				var value = record.get(col.dataIndex);
				var store = grid.getStore();
				if (typeof col.eventName != "undefined"){
					//console.log("fired", col.eventName, value,record,col,grid)
					this.fireEvent(col.eventName, value,record,col,grid,cell);
				}
				this.fireEvent((col.dataIndex) + "_cellclick", value,record,col,grid,cell);
				this.fireEvent((col.id) + "_cellclick", value,record,col,grid,cell);
				this.fireEvent((col.text) + "_cellclick", value,record,col,grid,cell);
				/* console.log("fired", (col.dataIndex) + "_cellclick", value,record,col,grid)
				console.log("fired", (col.id) + "_cellclick", value,record,col,grid)
				console.log("fired", (col.text) + "_cellclick", value,record,col,grid) */

				if (grid.editFormConfig){
					var editTriggerCol = grid.editFormConfig.editTriggerCol;
					if (editTriggerCol){
						if (
							editTriggerCol == col.id
							|| editTriggerCol == col.dataIndex
							|| editTriggerCol == col.header
							|| editTriggerCol == col.text
							|| editTriggerCol == col.itemId
						){
							grid.showEditForm(record);
						}
					}
				}
				//return false;
			});
		/* Edit form - after init */
			if (this.editFormConfig){
				if (!this.editFormConfig.editTriggerCol){
					this.getSelectionModel().addListener("select",function(rowmodel,record){
						grid.showEditForm(record);
					});
				}
			}
		/* paging */
			if (this.paged){
				this.addDocked({
					xtype: 'pagingtoolbar',
					store: this.getStore(),
					dock: 'bottom',
					displayInfo: true
				});
			}

		/* column selector */
		try{
			this.headerCt.on('menucreate', function(ct, menu, eOpts){
				menu.items.items.forEach(function(menuItem, index){
					if(menuItem.itemId == 'columnItem'){
						menuItem.text = 'SHOW/HIDE Columns';
						delete(menuItem.menu);
					}

				});
				menu.on('click', function(menu, item, e, eOpts){
					if(item.itemId == 'columnItem'){
						var displayColumns = [];
						var columns = ct.getGridColumns();
						columns.forEach(function(column){
							if(column.text.length > 0 && column.text != '&#160;'){
								var label = '<b>'+column.text+'</b>';
								if("description" in column && column.description.length > 0){
									label = label+': '+column.description;
								}
								displayColumns.push({
									checked: !column.isHidden(),
									boxLabel: label,
									name: column.dataIndex,
									inputValue: 1,
									listeners: {
										change: function(checkbox, newValue, oldValue, eOpts){
											if(checkbox.getValue()){
												column.show();
											} else {
												column.hide();
											}
										}
									}
								});
							}
						});
						// displayColumns.sort(String.compareNatural);
						displayColumns = displayColumns.sort(function(a,b) {
							return String.compareNatural(a.name, b.name);
						});

						Ext.widget('window', {
							title: 'SHOW/HIDE Columns',
							maxHeight: 600,
							minHeight: 300,
							width: 600,
							layout: 'fit',
							resizable: true,
							modal: true,
							defaults:{
								border: false
							},
							items: [{
								layout: 'fit',
								frame: true,
								autoScroll: true,
								fieldDefaults: {
									labelAlign: 'top',
									labelWidth: 100,
									labelStyle: 'font-weight:bold'
								},
								items: [{
									xtype: 'checkboxgroup',
									columns: 1,
									defaultType: 'checkbox',
									items: displayColumns
								}]
							}],
							buttons: [{
								text: 'Close',
								handler: function() {
									grid.fireEvent('column_selector_closed', {});
									this.up('window').close();
								}
							}]
						}).show();
					}
				});
			});
		} catch(e){

		}
		if (this.filterAutoLoad){
			this.applyFilter();
		}
	}
});