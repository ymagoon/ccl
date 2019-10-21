function RCM_DDWControllerStyle(){
    this.initByNamespace("ddwcon");
	this.setHeaderClass("ddw-sec-hd");
}
RCM_DDWControllerStyle.inherits(ComponentStyle);

function RCM_DDWController(criterion){
	this.setComponentLoadTimerName("USR:MPG.DeniedDaysWorklist");
	this.setCriterion(criterion);
	this.setStyles(new RCM_DDWControllerStyle());
	this.setAlwaysExpanded(true);
	this.criterion = criterion;
	RCM_DDWController.method("initialize", function(){	
		
		var filters = new RCMDDWFilters(criterion);
		var filtersHTML = filters.getFilterBoxHTML();
		var defaultsObj = filters.getDefaultsObj();
		var worklist = new RCMDeniedDaysWorklist(criterion);
		var worklistHTML = worklist.initialize(criterion, defaultsObj);
			
		var htmlArray = [];
		htmlArray.push("<div id='ddwfiltersDiv'  class='ddwfiltersContainer'>");
		htmlArray.push(filtersHTML);
		htmlArray.push("</div>");
		htmlArray.push("<div id='ddwworklistDiv' class='ddwworklistContainer'>");
		htmlArray.push(worklistHTML);
		htmlArray.push("</div>");
		var html = htmlArray.join("");
		MP_Util.Doc.FinalizeComponent(html, this, "");
		filters.initialize();
		worklist.setUpHovers();
		worklist.setUpManagerModify();
	
		filters.addFiltersListener(function(defaultsObj){
			worklist.callDelegateReloadTable(defaultsObj);
			worklist.setUpHovers();
			worklist.setUpManagerModify();
			filters.addPatientCountString(worklist.getWorklistItemCount());	
			Rcm_Floating_Header.addFloatingTableHeader('floatingTableHeader');
		});
		filters.addPatientCountString(worklist.getWorklistItemCount());
		Rcm_Floating_Header.addFloatingTableHeader('floatingTableHeader');
	});
}
RCM_DDWController.inherits(MPageComponent);