/*Custom Component source code*/
MPage.namespace("cerner");

/*Component refresh use*/

refreshOptions = {
	stringOption: "Original String",
	numericOption: 1234.0,
	objectOption: {
		objectName: "objectOption"
	},
	functionOption: function(){
		alert("Original function");
	}
};

cerner.refresh_example = function(){};
cerner.refresh_example.prototype = new MPage.Component();
cerner.refresh_example.prototype.constructor = MPage.Component;
cerner.refresh_example.prototype.base = MPage.Component.prototype;
cerner.refresh_example.prototype.name = "cerner.quick_links";
cerner.refresh_example.prototype.cclProgram = "mp_custom_example";
cerner.refresh_example.prototype.cclParams = ["mine", "personId", "userId", "encounterId", "pprCd", 12345.6789, 12345.0, 'value(12345.0,4567.0)', 'value("Hello", "World")'];
cerner.refresh_example.prototype.init = function(){
	//This is where we will initialize the headerTitle and the headerSubTitle
	if(!this.getProperty("headerSubTitle")){
		this.setProperty("headerSubTitle", "Original Sub Title");
	}

	var params = [];
	var paramList;
	var tempProp;
	var x, x1;
	
	this.cclDataType = "TEXT";
	paramList = this.cclParams;
	for(x = 0, x1 = paramList.length; x < x1; x++){
		tempProp = this.getProperty(paramList[x]);
		if(tempProp != 'undefined'){
			params.push(tempProp);
		}
		else{
			params.push(paramList[x]);
		}
	}
	this.cclParams = params;
	this.data = "";
};
cerner.refresh_example.prototype.render = function(){
	var compId = "";
	var displayHTML = [];
	var now = null;
	var target = null;
	var that = this;
	var userPrefs = this.getProperty("userPreferences");
	var count = 0;
	
	//
	// if getProperty("userPreferences") does not return an object,
	// it returns the string "undefined"
	//
	if (userPrefs !== null && userPrefs != "undefined" && userPrefs.hasOwnProperty("count")) {
		count = userPrefs.count;
	}
	
	target = this.getTarget();
	if(target){
		//Get the unique component id
		compId = this.getOption("id");
		
		//Create the display for each option
		$(target).append($("<div>").attr("id", 'strOpt' + compId).html("<b>String Option:</b> " + this.getOption("stringOption")));
		$(target).append($("<div>").attr("id", 'numOpt' + compId).html("<b>Numeric Option:</b> " + this.getOption("numericOption")));
		$(target).append($("<div>").attr("id", 'objectOpt' + compId).html("<b>Object Option:</b> " + JSON.stringify(this.getOption("objectOption"))));
		$(target).append($("<div>").attr("id", 'funcOpt' + compId).html("<b>Function Option:</b> " + this.getOption("functionOption")));
		$(target).append($("<div>").attr("id", 'maxHeight' + compId).html("<b>maxHeight Property:</b> " + this.getProperty("maxHeight")));
		$(target).append($("<div>").attr("id", 'refreshCount' + compId).html("<b>refresh count Property:</b> " + count));
		$(target).append($("<div>").attr("id", 'renderedDimensions' + compId).html("&nbsp;"));
		$(target).append($("<button>").attr("id","updateOpts"+ compId).html("Update").click(function(){
			that.setOption("stringOption", "Updated String");
			that.setOption("numericOption", 4567.0);
			that.setOption("objectOption", {
				objectName: "newObjectOption"
			});
			that.setOption("functionOption",function(){
				alert("Updated function");
			});
			
			that.setProperty("headerTitle", "Updated Title");
			that.setProperty("headerSubTitle", "Updated Sub Title");
			
			$("#strOpt" + compId).html("<b>String Option:</b> " + that.getOption("stringOption"));	
			$("#numOpt" + compId).html("<b>Numeric Option:</b> " + that.getOption("numericOption"));
			$("#objectOpt" + compId).html("<b>Object Option:</b> " + JSON.stringify(that.getOption("objectOption")));
			$("#funcOpt" + compId).html("<b>Function Option:</b> " + that.getOption("functionOption"));
			$("#maxHeight" + compId).html("<b>maxHeight Property:</b> " + that.getProperty("maxHeight"));
			$("#renderedDimensions" + compId).html("<b>Rendered Height:</b> " + $(target).height() + " <b>Rendered Width:</b> " + $(target).width());			
		}));
		$(target).append($("<div>").html(new Date().toString()));
		$(target).append($("<button>").attr("id","refresh"+ compId).html("Refresh").click(function(){
			that.refresh();
		}));
		
		//Update the rendered height after everything has been added to the target
		$("#renderedDimensions" + compId).html("<b>Rendered Height updated:</b> " + $(target).height() + " <b>Rendered Width:</b> " + $(target).width());

		//To verify that loadCcl works and verify compSourceLocation is correct
		this.loadCcl("MP_ALLERGIES_EXAMPLE", ["MINE", this.getProperty("personId")], function(data){
			var displayInfo = "<div>Got reply via loadCcl function: Found "+data.ALLERGIES.ALLERGY.length+" allergies. Please refer to allergies component for details</div>";
			displayInfo += "<div>compSourceLocation="+that.getProperty("compSourceLocation") + "</div>";
			$(target).append(displayInfo);
		}, "JSON");
		
		this.setProperty("userPreferences", { "count": count + 1 });
	}
};

cerner.refresh_example.prototype.resize = function(width, maxHeight){
	var target = this.getTarget();
	var compId = this.getOption("id");
	//Update the maxHeight field
	$("#maxHeight" + compId).html("<b>maxHeight Property:</b> " + this.getProperty("maxHeight") + " <span style='color:red;'><b>Updated</b></span>");
	//Update the rendered dimensions
	$("#renderedDimensions" + compId).html("<b>Rendered Height:</b> " + $(target).height() + " <b>Rendered Width:</b> " + $(target).width() + " <span style='color:red;'><b>Resized</b></span>");
};

/*Quick Links example*/
cernerLinksOptions1 = {
	searchLabel: "Customizable Search Label",
	searchLinks:[
		{
			label: "Google",
			url: "http://www.google.com/search?btnG=1&pws=0&q={0}"
		},
		{
			label: "Bing",
			url: "http://www.bing.com/search?q={0}&go="
		}
	],
	linksLabel: "Customizable Links Label",
	links:[
		{
			label: "CDC",
			url: "http://www.cdc.gov"
		},
		{
			label: "Wikipedia",
			url: "http://www.wikipedia.org"
		}
	]
};

cernerLinksOptions2 = {
	searchLabel: "Quick Searches",
	searchLinks:[
		{
			label: "Google",
			url: "http://www.google.com/search?btnG=1&pws=0&q={0}"
		},
		{
			label: "Bing",
			url: "http://www.bing.com/search?q={0}&go="
		}
	],
	linksLabel: "Quick Links",
	links:[
		{
			label: "Google",
			url: "http://www.google.com"
		},
		{
			label: "Yahoo",
			url: "http://www.yahoo.com"
		},
		{
			label: "Bing",
			url: "http://www.bing.com"
		}
	]
};

cerner.quick_links = function(){};
cerner.quick_links.prototype = new MPage.Component();
cerner.quick_links.prototype.constructor = MPage.Component;
cerner.quick_links.prototype.base = MPage.Component.prototype;
cerner.quick_links.prototype.name = "cerner.quick_links";
cerner.quick_links.prototype.render = function(){
	var options;
	var searchLabel;
	var searches;
	var linksLabel;
	var links;
	var x;
	var searchHTML = [];
	var linksHTML = [];
	var compId;
	var target = this.getTarget();
	
	if(this.options){
		options = this.options;
		compId = options.id;
	}
	else{
		throw(new Error("No options object defined for this component"));
	}
	
	if(options.searchLinks && options.searchLinks.length){
		searchLabel = options.searchLabel || "Search";
		searches = options.searchLinks;
		//Create the container
		searchHTML.push('<div><div class="cerner_ql_heading">', searchLabel, '</div><div><select id="quick_links_ComboBox', compId,'" class="cerner_ql_search_combo">');
		for(x = 0; x < searches.length; x++){
			searchHTML.push('<option value="', searches[x].url,'">', searches[x].label,'</option>');
		}
		searchHTML.push('</select><input type="text" id="quick_links_SearchBox', compId, '" class="cerner_ql_search_box"/><button id="quick_links_Search', compId,'"type="button" class="cerner_ql_search_button">Go</button></div></div>');
	}
	
	if(options.links && options.links.length){
		linksLabel = options.linksLabel || "Links";
		links = options.links;
		linksHTML.push('<div><div class="cerner_ql_heading">', linksLabel,'</div>');
		for(x = 0; x < links.length; x++){
			linksHTML.push('<div class="cerner_ql_links"><a onclick="cerner.quick_links.openLink(\'', links[x].url,'\')">', links[x].label,'</a></div>');
		}		
		linksHTML.push('</div>');
	}
	target.innerHTML = searchHTML.join("") + "" + linksHTML.join("");
	
	/*Add the functionality to the textbox and search button*/
	var searchBox = document.getElementById('quick_links_Search' + compId);
	searchBox.onclick = function(evt){
		var searchBox = document.getElementById('quick_links_SearchBox' + compId);
		if(searchBox.value !== ""){
			var combo = document.getElementById('quick_links_ComboBox' + compId);
			var url = combo.value;
			url = url.replace("{0}", searchBox.value);
			cerner.quick_links.openLink(url);
		}
	};
};
cerner.quick_links.openLink = function(url){
	if(APPLINK){
		APPLINK(100, url, "");
	}
};

/*Allergies example*/
cerner.allergies_example = function(){};
cerner.allergies_example.prototype = new MPage.Component();
cerner.allergies_example.prototype.constructor = MPage.Component;
cerner.allergies_example.prototype.base = MPage.Component.prototype;
cerner.allergies_example.prototype.name = "Cerner.allergies_example";
cerner.allergies_example.prototype.cclProgram = "MP_ALLERGIES_EXAMPLE";
cerner.allergies_example.prototype.cclParams = "";
cerner.allergies_example.prototype.cclDataType = "JSON";
cerner.allergies_example.prototype.init = function(options){
    var params = [];
    var self = this;
    var mainMenu = this.getMenu();

    params.push("mine");
    params.push(this.getProperty("personId"));
    this.cclParams = params;
	var compId;
	
	if(this.options){
		options = this.options;
		compId = options.id;
	}
	else{
		throw(new Error("No options object defined for this component"));
	}

    var showCritSelection = new MenuSelection("cernerallergies_exampleshowCrit" + compId);
    showCritSelection.setLabel("Show Critical");
    showCritSelection.setCloseOnClick(false);
    showCritSelection.setIsSelected(true);
    showCritSelection.setClickFunction(function(menuItem, menuDOMEle) {
        if (this.isSelected()) {
            alert('self.showOnlyCriticalResults()');
        }
        else {
            alert('self.showAllResults()');
        }
    });
    mainMenu.addMenuItem(showCritSelection);

    var separator = new MenuSeparator("cernerallergies_exampleseperator" + compId);
    mainMenu.addMenuItem(separator);

    var subMenu1 = new Menu("cernerallergies_examplesubMenu1" + compId);
    subMenu1.setLabel("Sub Menu 1");
    subMenu1.setAnchorConnectionCorner(["top", "left"]);
    subMenu1.setContentConnectionCorner(["top", "right"]);

    var subOption1 = new MenuSelection("cernerallergies_examplesubOption1" + compId);
    subOption1.setLabel("Sub Menu Option 1");
    subMenu1.addMenuItem(subOption1);

    var subMenu2 = new Menu("cernerallergies_examplesubMenu2" + compId);
    subMenu2.setLabel("Sub Menu 2");
    subMenu2.setAnchorConnectionCorner(["top", "left"]);
    subMenu2.setContentConnectionCorner(["top", "right"]);

    var subOption2 = new MenuSelection("cernerallergies_examplesubOption2" + compId);
    subOption2.setLabel("Sub Menu Option 2");
    subMenu2.addMenuItem(subOption2);

    var subMenuSeparator = new MenuSeparator("cernerallergies_examplesubMenuSeparator" + compId);
    subMenu2.addMenuItem(subMenuSeparator);

    var subOption3 = new MenuSelection("cernerallergies_examplesubOption3" + compId);
    subOption3.setLabel("Sub Menu Option 3");
    subMenu2.addMenuItem(subOption3);

    subMenu1.addMenuItem(subMenu2);
    mainMenu.addMenuItem(subMenu1);

};

cerner.allergies_example.prototype.render = function(){
	//Takes the data in this.data and loads it into target
	var element = this.getTarget();
	var alHTML = [];
	var alJSON = this.data.ALLERGIES;
	var alCnt = alJSON.ALLERGY.length;
	var tableHTML = [];
	var reacHTML = [];
	var onsetHTML = [];
	var severityHTML = [];
	var tdClass;
	var onset;
	var allergyObj;
	var reaction;
	var x;
	var y;
	var severeClass;
	
	tableHTML.push("<table class='cerner_all_table'><th>Allergy</th><th>Reaction</th>");
	//tableHTML.push("<table class='cerner_all'>");
	for(x = 0; x < alCnt; x++){
		alHTML = [];
		reacHTML = [];
		onsetHTML = [];
		severityHTML = [];
		tableHTML.push("<tr>");
		tdClass = (x % 2 === 1)? "cerner_all_even": "";
		
		allergyObj = alJSON.ALLERGY[x];
		severeClass = (allergyObj.SEVERE_IND)? "cerner_all_severe":"";
		//Allergy HTML creation
		alHTML.push("<td class='", tdClass," cerner_all ", severeClass, "'><span>"+allergyObj.ALLERGY_NAME+"</span></td>");
		
		//Reaction HTMl creation
		reacHTML.push("<td class='", tdClass," cerner_all_reac ", severeClass, "'><span>");
		if(allergyObj.REACTION_CNT > 0){
			for(y = 0; y < allergyObj.REACTION_CNT; y++){
				reactionObj = allergyObj.REACTIONS[y];
				reacHTML.push(reactionObj.REACTION, ", ");
			}
			reacHTML.pop();
		}
		else{
			reacHTML.push("--");
		}
		reacHTML.push("</span></td>");
		
		//Onset date time
		onsetHTML.push("<td class='", tdClass," cerner_all_onset ", severeClass, "'><span>Onset: " + allergyObj.ONSET_DATE + "</span></td>");
		
		//Severity
		severityHTML.push("<td class='", tdClass," cerner_all_severity ", severeClass, "'><span>Severity: " + allergyObj.SEVERITY + "</span></td>");
		
		tableHTML.push("<tr>");
		tableHTML.push(alHTML.join("") + reacHTML.join(""));
		tableHTML.push("</tr><tr>");
		tableHTML.push(onsetHTML.join("") + severityHTML.join(""));
		tableHTML.push("</tr>");
	}
	
	if(alCnt === 0){
		tableHTML.pop();
		tableHTML.push("<table class='cerner_all_table'><th>No allergies recorded</th></table>");
	}
	else{
		tableHTML.push("</table>");
	}
	element.innerHTML = tableHTML.join("");
};


/*Custom Component Harness for Component Standard 1.0*/
var customCompOptions1 = {
	cclProgram: "mp_custom_example",
	cclParams: ["mine", "personId", "userId", "encounterId", "pprCd"]
};

var customCompOptions2 = {
	cclProgram: "mp_pe_get_immunizations",
	cclParams: ["mine", "personId", "userId", "encounterId", "pprCd"]
};


cerner.custom_component = function(){};
cerner.custom_component.prototype = new MPage.Component();
cerner.custom_component.prototype.constructor = MPage.Component;
cerner.custom_component.prototype.base = MPage.Component.prototype;
cerner.custom_component.name = "Cerner.custom_component";
cerner.custom_component.prototype.init = function(options){
	var params = [];
	var paramList;
	var tempProp;
	var x, x1;
	
	this.cclProgram = this.getOption('cclProgram');
	this.cclDataType = "TEXT";
	paramList = this.getOption('cclParams');
	for(x = 0, x1 = paramList.length; x < x1; x++){
		tempProp = this.getProperty(paramList[x]);
		if(tempProp != 'undefined'){
			params.push(tempProp);
		}
		else{
			alert("property " + paramList[x] + " is not currently available");
		}
	}
	this.cclParams = params;
	this.data = "";
};
cerner.custom_component.prototype.render = function(){
	//Takes the data in this.data and loads it into target
	var element = this.getTarget();
	element.innerHTML = this.data;
};
