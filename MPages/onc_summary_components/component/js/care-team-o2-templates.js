CareteamO2ComponentTemplates = {
		popup: 
			"<div id='${compId}_care_team_popup' class='cto2-care-team-popup'>" +
			"	<div class='cto2-care-team-phys-data'>" +
			"		<div class='popup-label'>${contactLabel}</div>" +
			"		<div>${nameFormatted}</div>" +
			"	</div>" +
			"	<div class='popup-label'>${replacePhysLabel}</div>" +
			"	<input type='button' id='${compId}_popup_provider_yes' class='cto2-popup-provider-yes' value='${txtAssign}' />" +
			"	<div class='popup-label'>${replaceWithSomeoneElseLabel}</div>" +
			"	<input type='text' id='${compId}_popup_provider_search' value='${txtSearch}' class='cto2-popup-provider-search unfocused' />" +
			"	<div id='${compId}_popup_provider_search_results' class='cto2-popup-provider-search-results'></div>" +
			"	<input type='button' id='${compId}_popup_provider_assign' class='cto2-popup-provider-assign' value='${txtAssign}' />" +
			"</div>"
};

var CERN_CARE_TEAM_TEMPLATES = function() {

	var te = TemplateEngine;
	var table = te.tag("table");
	var th = te.tag("th");
	var div = te.tag("div");
	var td = te.tag("td");
	var tr = te.tag("tr");
	var button = te.button;
	var textbox = te.textbox;

	return {

		providerList: function(context) {
			return table(tr(th(context.i18n.PROVIDER)), context.items);
		},

		providerListItem: function(context) {
			return tr({"class":"care-team-search-item"}, td(context.nameFormatted));
		},

		loading: function(context) {
			return div(context.i18n.LOADING);
		}
	};
};