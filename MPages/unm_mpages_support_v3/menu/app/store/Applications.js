Ext.define("Ostrich.store.Applications", {
	extend: "univnm.ext.QueryStore",
	model: "Ostrich.model.Application",
	autoLoad: true,
	sql: [
		"select ",
		"	ur.alias, ",
		"	m.title menu_title, ",
		"	s.name section_title, ",
		"	s.id section_id, ",
		"	s.id || e.id section_entry, ",
		"	s.weight weight, ",
		"	e.id entry_id, ",
		"	a.display_name title, ",
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
		"ORDER by weight desc,a.display_name asc "
	].join(""),

	groupers: [
		{
			property: "section_title",
			sorterFn: function(a,b) {
				return b.data.weight - a.data.weight;
			}
		}
	],

	listeners: {
		beforeload: function() {
			this.getProxy().extraParams = {
				menu_name:univnm.jslib.getQuerystring('template', false),
				base_dir:$env.baseUrl,
				user_id:univnm.user_id,
				instance:$env.instance?($env.instance+"/"):""
			};
		}
	},

	organize_by_recent: function(store) {
		univnm.db.query([
			"select ",
			"	app_name, ",
			"	max( ",
			"		access_dt_tm ",
			"	) last_dt_tm ",
			"from ",
			"	cust_stats ",
			"where ",
			"	person_id = {user_id} ",
			"	and purpose='{purpose}' ",
			"    and detail='access' ",
			"group by ",
			"	app_name ",
			"order by max( ",
			"		access_dt_tm ",
			"	) desc "

		], {
			purpose: $env.purpose,
			user_id: univnm.user_id
		}, function(results) {
			var stats = results.toStruct(["app_name"]);
			store.each(function(m) {
				if (stats[m.data.app_name]) {
					m.data.last_used = stats[m.data.app_name][0].last_dt_tm;
				}
			});
			store.sort("last_used", "DESC");
		});
	},
	organize_by_most: function(store) {
		univnm.db.query([
			"select app_name, count(app_name) as ct ",
			"from cust_stats ",
			"where detail='access' and person_id='{user_id}' and purpose='{purpose}' ",
			"and access_dt_tm > sysdate - 60 ",
			"group by app_name "
		], {
			purpose: $env.purpose,
			user_id: univnm.user_id
		}, function(results) {
			var stats = results.toStruct(["app_name"]);
			store.each(function(m) {
				if (stats[m.data.app_name]) {
					m.data.frequency = stats[m.data.app_name][0].ct;
				}
			});
			store.sort("frequency", "DESC");
		});
	},
	organize_by_name: function(store) {
		this.group({
			property: "section_title",
			sorterFn: function(a,b) {
				return b.data.weight - a.data.weight;
			}
		});
		this.sort("title", "asc");
	}
});