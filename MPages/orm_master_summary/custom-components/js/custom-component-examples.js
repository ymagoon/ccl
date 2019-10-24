/*Custom Component source code*/
MPage.namespace("cerner");

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
			linksHTML.push('<div class="cerner_ql_links"><a onclick="javascript:cerner.quick_links.openLink(\'', links[x].url,'\')">', links[x].label,'</a></div>');
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
	params.push("mine");
	params.push(this.getProperty("personId"));
	this.cclParams = params;
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

MPage.namespace("cerner");
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
	
	this.cclProgram = this.options['cclProgram'];
	this.cclDataType = "TEXT";
	paramList = this.options['cclParams'];
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