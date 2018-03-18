$env.tableExtensionIgnore.push("cust_aros");
Ext.define('MPAGE.model.Group', {
	extend: 'Ext.data.Model',
	proxy:"row",
	table:"cust_aros",
	fields:[
		{name:"id",								sqlDefault:"#cust_aros_seq.nextval"},
		{name:"parent_id",		naturalKey:true,	defaultValue:0},
		{name:"model",			naturalKey:true,	defaultValue:"Role"},
		{name:"foreign_key",	naturalKey:true,	defaultValue:0},
		{name:"alias",			naturalKey:true},
		{name:"previously_added",			meta:true},
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
				}
			}
		},
		{
			name: "application",
			meta:true,
			convert:function(v,r) {
				return r.get("alias").replace("trogdor/", "").replace("build/", "").replace("/admin", "").split("/").first() || "Custom Group";
			}
		}
	]
});
