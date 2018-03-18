$env.tableExtensionIgnore.push("cust_acos");
Ext.define('MPAGE.model.Right', {
	extend: 'Ext.data.Model',
	proxy:"row",
	table:"cust_acos",
	fields:[
		{name:"id", sqlDefault:"#cust_acos_seq.nextval"},
		{name:"parent_id", sqlDefault:"#0"},
		{name:"model", sqlDefault:"Right"},
		{name:"foreign_key", sqlDefault:"#0"},
		{name:"alias", naturalKey:true},
		{name:"lft", sqlDefault:"#NULL"},
		{name:"rght", sqlDefault:"#NULL"},
		{name:"path", sqlDefault:"#NULL"},
		{
			name: "is_trogdor",
			meta:true,
			convert: function(v, r) {
				return r.data.alias.indexOf("trogdor/") == 0;
			}
		},
		{
			name: "is_build",
			meta:true,
			convert: function(v, r) {
				return r.data.alias.indexOf("build/") == 0;
			}
		},
		{
			name: "is_prod",
			meta:true,
			convert: function(v,r) {
				return !(r.data.alias.indexOf("build/") == 0 || r.data.alias.indexOf("trogdor/") == 0);
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
		}

	]
});
