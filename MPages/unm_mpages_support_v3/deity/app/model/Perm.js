$env.tableExtensionIgnore.push("cust_aros_acos");
Ext.define('MPAGE.model.Perm', {
	extend: 'Ext.data.Model',
	proxy:"row",
	table:"cust_aros_acos",
	fields:[
		{name:"id",				sqlDefault:"#cust_aros_acos_seq.nextval"},

		{name:"aro_id",			naturalKey:true},
		{name:"aco_id",			naturalKey:true},

		{name:"app_id",			meta:true},
		{name:"right_name",		meta:true},

		{name:"group_name",		meta:true} ,
		{
			name: "is_trogdor",
			meta:true,
			convert: function(v, r) {
				return r.data.right_name.indexOf("trogdor/") == 0;
			}
		},
		{
			name: "is_build",
			meta:true,
			convert: function(v, r) {
				return r.data.right_name.indexOf("build/") == 0;
			}
		},
		{
			name: "is_prod",
			meta:true,
			convert: function(v,r) {
				return !(r.data.right_name.indexOf("build/") == 0 || r.data.right_name.indexOf("trogdor/") == 0);
			}
		},
		{
			name: "environment",
			meta:true,
			convert: function(v,r) {
				switch(true) {
					case r.data.is_trogdor:
						return "Trogdor";
					case r.data.is_prod:
						return "Production";
					case r.data.is_build:
						return "Build";
					default: return "lolwhat";
				}
			}
		},
		{
			name: "application_name",
			meta:true,
			convert:function(v,r) {
				return r.get("right_name").replace("trogdor/", "").replace("build/", "").replace("/admin", "").split("/").first() || "Custom Group";
			}
		}
	],
	reloadAfterSave:true,
	readSql:[
		"Select ",
		"	t.id, ",
		"	t.aro_id, ",
		"	t.aco_id, ",
		"	co.foreign_key app_id, ",
		"	co.alias right_name, ",
		"	ro.alias ",
		"group_name ",
		"From ",
		"	cust_aros_acos t ",
		"		join cust_acos co on( co.id = t.aco_id ",
		") ",
		"	join cust_aros ro on( ro.id = t.aro_id ",
		") ",

		"Where ",
		"	1=1 ",
		"	and ro.model = 'Role' ",
		"	and co.model='Right' ",
		"   and {conditions} "
	]
});
