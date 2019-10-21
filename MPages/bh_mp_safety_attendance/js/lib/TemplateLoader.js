/**
 * Load templates synchronously into html from external files
 */
var TemplateLoader = (function() {

	var templates = [],
			toLoad = 0,
			finishedCallback;
			
	/**
	 * stage multiple templates to all be loaded at once
	 * @param [String] path of template file
	 * @param [function] callback function on success
	 */
	function stage(path,parent,callback){
		toLoad++;

		templates[templates.length] = ({
			path:path,
			callback:callback,
			parent:parent
		});
	}
	
	/**
	 * Load template using $.ajax
	 * @param [String] path of template file
	 * @param [Node] parent element to attach template to
	 * @param [function] callback function on success
	 */
	function load(path, parent, callback) {
		var html;
		$.ajax({
			url : path,
			dataType : "text",
			async : false,
			success : function(template) {
				//insert returned template directly into head
				$(template).appendTo(parent);
				toLoad--;
				//execute the callback if passed
				if(callback) {
					callback(template);
				}
				//notify that all templates have loaded
				if(toLoad <= 0 && finishedCallback != null){
					toLoad = 0;
					finishedCallback();
				}
			},
			error : function(template){
				throw "Template path of " + path + " not found.";
				toLoad--;
			},
			isLocal:true
		});
	}

	/**
	 * Load all staged templates.  Templates will first need to be added via <code>TemplateLoader.stage(...)</code>
	 * @param {function} callback for when all templates have loaded.
	 */
	function loadAll(callback){
		finishedCallback = callback;
		for(var i = 0,l = templates.length;i < l;i++){
			load(templates[i].path,templates[i].parent,templates[i].callback);
		}
		templates = [];
	}
	
	/**
	 * Load handlebar template from external file and compile it.  Does attach
	 * template to the html
	 * @param {String} path of external file containing template
	 * @param {String} id of template
	 * @param {Node} parent element in which to insert template
	 * @return {Object} Compiled Handlebars Template
	 */
	function compile(path,id,parent){
		var template,
				complete = false;
		load(path,parent,function(){
			template = Handlebars.compile($("#"+id).html());
			complete = true;
		});

		return template;
	}
	
	/**
	 * Get handlebars template string from specified path and return
	 * compiled template.  Does NOT attach template to the html.
	 * @param {String} path of external file containing template
	 * @param {function} callback when finished
	 * @return {Object} Compiled Handlebars Template
	 */
	function compileFromFile(path,callback){
		var html
				,template
				,complete = false;
		$.ajax({
			url : path,
			dataType:"text",
			async:false,
			success : function(data) {				
				template = Handlebars.compile(data);
				complete = true;
				//execute the callback if passed
				if(callback) {
					callback(template);
				}
			},
			error : function(data){
				throw "Template path of " + path + " not found.";
				return Handlebars.compile("");
			},
			isLocal:true
		});

		return template;
	}
	
	return{
		stage : stage,
		load : load,
		loadAll : loadAll,
		compile : compile,
		compileFromFile : compileFromFile
	};
	
})();
