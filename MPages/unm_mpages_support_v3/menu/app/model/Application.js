Ext.define("Ostrich.model.Application", {
	extend: "Ext.data.Model",

	fields: [
		{
			name: "params",
			type: "string",
			convert: function(v) {
				return v || "";
			}
		},
		{
			name: "url",
			convert: function(v, r) {
				return v || (new Ext.Template(
					'../{app_name}/index.html?{params}'
				)).apply(r.data);
			}
		},
		{
			name: "title",
			type: "string"
		},
		{
			name: "icon",
			type: "string",
			convert: function(v) {
				return (v || "").replace("jpg", "png").replace("jpeg", "png");
			}
		},
		{
			name: "alias"
		},
		{
			name: "menu_title"
		},
		{
			name: "app_name"
		},
		{
			name: "section_title"
		},
		{
			name: "weight",
			type: "int"
		},
		{
			name: "params",
			type: "string"
		},
		{
			name: "last_used",
			type: "date"
		},
		{
			name: "frequency",
			type: "int"
		}
	]
});