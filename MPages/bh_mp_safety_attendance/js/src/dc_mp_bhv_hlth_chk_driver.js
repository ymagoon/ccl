/**
 * Entry point for MPage.
 */
function init() {
	Criterion.unloadParams();
	mConsole.init();
	//parent UtilJsonXML, which will be passed along to all Models that require it
	var json_handler = new UtilJsonXml({
		"debug_mode_ind" : Criterion.debug_mode_ind,
		"disable_firebug" : true
	});
	if(Criterion.debug_mode_ind != 0){
		$(document).bind("keypress",  
			 function(evt)
			 {
				if(!evt){
					evt = window.evt;
				}
				if(evt.ctrlKey==1 && evt.keyCode == 28)
				{
					if(log && log.activateLogging){
						log.activateLogging();
					}
				}
			 }
		);
	}
	$("#save-to-chart").i18n();
	$('#save-to-chart').css("visibility","visible");

	PatientImageRetriever.setJsonHandler(json_handler);

	//patient lists
	var patientListsModel = new PatientListsModel({
		json_handler : json_handler
	});

	var patientListsView = new PatientListsView({
		model : patientListsModel
	});

	//attach the patient lists view to the DOM
	$(patientListsView.el).appendTo($("#patient-lists"));

	//query CCL for patient lists
	patientListsModel.retrieve();


	//patient collection, which will hold all Patient Models
	var patientCollection = new PatientCollection();
	patientCollection.patientListsModel = patientListsModel;
	patientCollection.json_handler = json_handler;
	patientCollection.trigger("change:json_handler");

	//disable patient lists view when querying ccl
	patientCollection.bind("started-loading",function(){
		patientListsView.disable();
	});
	patientCollection.bind("finished-loading",function(){
		patientListsView.enable();
	});

	//if the selected list changes, query the CCL for that list
	patientListsModel.bind("change:selectedList", function() {
		patientCollection.retrieve(patientListsModel.get("selectedList"));
		
		patientCollection.resetInterval();
		
		$("#ptpopMessage").remove();
	});

	//time intervals
	var timeIntervalSelectView = new TimeIntervalSelectView({
		model : patientCollection
	});

	//attach the Time Interval Select View to the DOM
	$(timeIntervalSelectView.el).appendTo($("#time-intervals"));

	//time intervals
	var timeRangeSelectView = new TimeRangeSelectView({
		model : patientCollection
	});

	//attach the Time Interval Select View to the DOM
	$(timeRangeSelectView.el).appendTo($("#time-ranges"));

	//Create Patient Dashboard View and attach it to the DOM
	dashboardView = new DashboardView({
		collection : patientCollection
	});
	$(dashboardView.el).appendTo($("#patient-dashboard-wrap"));

	//Post to Chart Model handles all Activity event posts to Millennium
	var postToChartModel = new PostToChartModel({
		json_handler : json_handler,
		collection : patientCollection
	});

	//When post to chart triggers a "posted", the mpage is reloaded with the current patient list
	postToChartModel.bind("posted", function() {
		if(patientListsModel.get("selectedList").LISTID===-1){
			WindowStorage.set("StoredFnu",JSON.stringify(patientListsModel.get("selectedList").NULIST));
		}
		else{
			WindowStorage.set("StoredIndex",patientListsModel.get("selectedList").LISTID);
		}
		window.location.reload();
	});

	//creates Post To Chart view, already attached to DOM
	var postToChartView = new PostToChartView({
		model : postToChartModel,
		patientCollection : patientCollection
	});

	//disable view on mpage launch
	postToChartView.disable();

	//Garbage collection on unload
	$(window).unload(function(){
		patientCollection.destroyCollection();
		patientListsModel.destroyPatientListsModel();
		postToChartModel.destroy();
	});

}

/*
getNurseUnitList() function
Accepts a JSON object
returns NURSEUNIT only with ORGID, NULOCCD.
*/

var getNurseUnitList = function(NULIST) {
	var NURSEUNITS = [];
		 if(NULIST.length > 0)
		 {
			 for (var i=0; i < NULIST.length; i++)
			 {
				var NULocation = {
					ORGID: NULIST[i].ORGID,
					LOCQUAL : []
				};
				
				if((NULIST[i].LOCQUAL) && NULIST[i].LOCQUAL.length > 0){
					for(var j= 0;x=NULIST[i].LOCQUAL.length,j<x;j++){
						NULocation.LOCQUAL.push({"NULOCATIONCD" :  NULIST[i].LOCQUAL[j].NULOCATIONCD});
					}
				}
				NURSEUNITS.push(NULocation);
			}
		}
	return NURSEUNITS;
};
/* 
fixedEncodeURIComponent function
Accepts a string
returns an encoded string
*/

var fixedEncodeURIComponent = function (str) {
	try{
		return encodeURIComponent(str).replace(/[!'()*\-_.~]/g, function(c) {
			return '%' + c.charCodeAt(0).toString(16);
		});
	}
	catch( err ){
		alert(JSON.stringify( err ));
	}
};

/* 
fixedDecodeURIComponent function
Accepts a string
returns a decoded string
*/

var fixedDecodeURIComponent = function (str) {
	try{
		return decodeURIComponent(str.replace(/%21|%27|%28|%29|%2A|%2D|%5F|%2E|%7E/g, function(encoding) {
			return String.fromCharCode(encoding.replace(/[%]/g, "0x"));
		}));
	}
	catch( err ){
		alert(JSON.stringify( err ));
	}
};

$(document).ready(function() {
	init();
});
