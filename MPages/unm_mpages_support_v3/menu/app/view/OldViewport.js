Ext.define("MPAGE.view.Viewport", {
	extend: 'Ext.container.Viewport',
	requires: [
		
	],
	defaults: {
	
	},
	
	layout: 'fit',
	initComponent:function(){
		var tabs;
		this.items=[{
			frame:false,
			layout:"fit",
			border:false,
			
			items:[{//center_tabs
				itemId:"center_tabs",
				//hidden:true,
				xtype:"tabpanel",
				autoDestroy:true,
				activeTab:0,
				items:tabs=[],
				listeners: {
				}
				
			}]
		}]
		
		
		var columns = 1
		
		var menu_name = univnm.jslib.getQuerystring('template', false);
		var menu_type = univnm.jslib.getQuerystring('menu_type', "tabpanel");
		if (!menu_name) {
			throw new Error("URL param 'template' is required");
			return;
		}
		
		
		var entries =univnm.db.query(
			"select ",
				"	ur.alias, ",
				"	m.title menu_title, ",
				"	s.name section_title, ",
				"	s.id section_id, ",
				"	s.id || e.id section_entry, ",
				"	s.weight weight, ",
				"	e.id entry_id, ",
				"	a.display_name entry_title, ",
				"	a.app_name app_name, ",
				"	a.description description, ",
				"	e.icon icon, ",
				"	e.url url, ",
				"	e.params params ",
				"from ",
				"	unmh.cust_menus m ",
				"	join unmh.cust_sections s on ( ",
				"		s.menu_id = m.id ",
				"	) ",
				"	join unmh.cust_entities e on ( ",
				"		e.section_id = s.id ",
				"	) ",
				"	join unmh.cust_applications a on ( ",
				"		a.id =e.application_id ",
				"	) join ( ",
				"		Select ",
				"			distinct alias ",
				"		From ",
				"			cust_aros_acos rc ",
				"				join cust_acos co on( ",
				"					rc.aco_id =co.id ",
				"				) ",
				"		Where ",
				"			rc.aro_id in ( ",
				"				Select ",
				"					parent_id ",
				"				From ",
				"					cust_aros ro ",
				"				Where ",
				"					exists ( ",
				"						Select ",
				"							'x' ",
				"						From ",
				"							code_value cv ",
				"							join prsnl p on	( ",
				"								cv.code_value = p.position_cd ",
				"							) ",
				"						Where ",
				"							cv.code_value = ro.foreign_key ",
				"							and ro.model ='CernerRole' ",
				"							and code_set= 88 ",
				"							and cv.active_ind= 1 ",
				"							and p.person_id = {user_id} ",
				"					) ",
				"					or ( ",
				"						ro.model ='User' ",
				"						and ro.foreign_key = {user_id} ",
				"					) ",
				"			) ",
				"	) ur on ( ",
				"		( ",
				"			case when instr(e.url,'trogdor') >0 then ",
				"				'trogdor/'||a.app_name ",
				"			else ",
				"				'{instance}'||a.app_name ",
				"			end ",
				"		) ",
				"		= ur.alias ",
				"	) ",
				"where 1=1 ",
				"	and m.name ='{menu_name}' ",
				"	and m.base_dir = '{base_dir}' ",
				"ORDER by weight desc,a.display_name asc ",
			{
				menu_name:menu_name,
				base_dir:$env.baseUrl,
				user_id:univnm.user_id,
				instance:$env.instance?($env.instance+"/"):""
			}
		)
	
		
		var menu = {
			sections:entries.toStruct(["section_title","app_name"],"rows",true)
		}
		
		Array.prototype.push.apply(
			tabs,
			univnm.ObjectLib.toArray(menu.sections.section_title)
				.sort(function(a,b){
					return String.compareNumericReverse(a,b)
				})
				.map(function(tuple){
					var section = tuple.value
					$profiler.mark("Section: " + Ext.encode(section))
					var colArray =Array.dim(columns).map(function(){
						return {
							flex:1,
							border:false,
							autoScroll:true,
							bodyCls:C.frameClass,
							layout:"vbox",
							//style:"padding:10px;",
							items:[]
						}
					})
					
					$O(section.app_name)
					.forEach(function(entry,key,index){
						$profiler.mark("has entry " + entry.app_name)
						if (typeof entry.icon == "undefined" || !entry.icon) entry.icon="images/application_view_tile.png";
						$profiler.mark("adding '"+entry.app_name+"'")
						var url;
						if (entry.url) {
							url = entry.url
						} else {
							if (!entry.params) entry.params=""
							url = new Ext.Template(
								'../{app_name}/index.html?{params}'
							).apply(entry)
						}
						if (!entry.description || !entry.description.trim()){
							entry.description = entry.entry_title
						}
						colArray[index % columns].items.push({
								xtype:"button",
								text:entry.entry_title,
								border:false,
								style:"margin:10px;",
								icon:entry.icon,
								entryUrl:url,
								html:url,
								tooltip:entry.description||entry.entry_title,
								handler:function(b){
									location.href=b.entryUrl
								}
						})
						
					})
					$profiler.mark("Finished building menu")
					if (colArray[0].items.length){
						return {
							title:section.section_title,
							//autoHeight:true,
							layout:{
								type:"hbox",
								align:"stretch"
							},
							items:colArray
							
						}
					} else {
						return {}
					}
				})
		)
		
		//console.log(JSON.stringify(tabs.first(),null,"   "))
		
		
		if (!tabs.length) {
			tabs.push({
				bodyStyle:"padding:10px;",
				title:"No Access",
				html:"You do not have access to any Custom MPages"
			})
		}
		
		
			
		this.callParent(arguments)
			
	}
		
});