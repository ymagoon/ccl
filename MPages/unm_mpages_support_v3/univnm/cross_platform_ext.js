Ext.ns("C");

C.define = C.isSenchaTouch? function(classpath, config) {
	var classProperties = [
		"extend",
		"requires",
		"alias",
		"uses",
		"statics"
	];
	var definition = { };
	Ext.require(config.requires || [], function() {
		delete config.requires;
		classProperties.forEach(function(key) {
			if (config[key]) {
				definition[key] = config[key];
				delete config[key];
			}
		});
		univnm.ObjectLib.getProperties(config).forEach(function(property) {
			if (typeof config[property] === "function") {
				definition[property] = config[property];
				delete config[property];
			}
		});
		definition.config = Ext.clone(config);
		Ext.define(classpath, definition);
	});
}: Ext.define;
