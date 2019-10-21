if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
    var ieVersion = new Number(RegExp.$1) // capture x.x portion and store as a number
}
else {
    var ieVersion = 0;
}

var qsParm = [];

function ConfigurePage(){
    qsParm['personnelId'] = 0;
    qsParm['positionCd'] = 0;
    qsParm['categoryMean'] = "";
	qsParm['reportIds'] = ""
	qsParm['title'] = i18n.discernabu.USER_CUSTOMIZATION;
    qs();
	var ar = qsParm['reportIds'].split(",");
    
    var criterion = new MP_Core.Criterion(0,0,qsParm['personnelId'],null,null,qsParm['positionCd'],0,0,0,qsParm['categoryMean'],null)
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(false);
	loadingPolicy.setLoadComponentBasics(true);
	loadingPolicy.setCategoryMean(criterion.category_mean)
	loadingPolicy.setCriterion(criterion);
	loadingPolicy.setCustomizeView(true)
	
	var prefManager = MP_Core.AppUserPreferenceManager;
	prefManager.Initialize(criterion, qsParm['categoryMean']);
	prefManager.LoadPreferences();

	var components = MP_Bedrock.MPage.Component.LoadBedrockComponents(loadingPolicy,ar,null,null)
	
	MP_Util.Doc.CustomizeLayout(qsParm['title'], components)
	
	//JQuery sortable set up
	$(".cust-col").sortable({connectWith: '.cust-col'},{zIndex: 1005}, {appendTo: 'body'});
}

function qs(){
    var query = window.location.search.substring(1);
	if (ieVersion > 6) {  // handle ie6 url delimiters
		var parms = query.split('&');
	}else{
		var parms = query.split('%26');
	}
    for (var i = 0; i < parms.length; i++) {
        var pos = parms[i].indexOf('=');
        if (pos > 0) {
            var key = parms[i].substring(0, pos);
            var val = parms[i].substring(pos + 1);
            qsParm[key] = val;
        }
    }
}
