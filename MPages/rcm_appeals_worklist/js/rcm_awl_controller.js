function RCM_AWLControllerStyle(){
    this.initByNamespace("awlcon");
	this.setHeaderClass("awl-sec-hd");
}
RCM_AWLControllerStyle.inherits(ComponentStyle);

function RCM_AWLController(criterion){
	this.setComponentLoadTimerName("USR:MPG.AppealsWorklist");
	this.setCriterion(criterion);
	this.setStyles(new RCM_AWLControllerStyle());
	this.setAlwaysExpanded(true);
	this.criterion = criterion;
    RCM_AWLController.method("initialize", function(){
        var filters = new RCMAWLFilters(criterion);
        var filtersHTML = filters.getFilterBoxHTML();
        var defaultsObj = filters.getDefaultsObj();
        var worklist = new RCMAppealsWorklist(criterion);
        var worklistHTML = worklist.initialize(criterion, defaultsObj);
        
        var htmlArray = [];
        htmlArray.push("<div id='awlfiltersDiv'  class='awlfiltersContainer'>");
        htmlArray.push(filtersHTML);
        htmlArray.push("</div>");
        htmlArray.push("<div id='awlworklistDiv' class='awlworklistContainer'>");
        htmlArray.push(worklistHTML);
        htmlArray.push("</div>");
        var html = htmlArray.join("");
        MP_Util.Doc.FinalizeComponent(html, this, "");
        filters.initialize();
        worklist.setUpHovers();
        
        filters.addFiltersListener(function(defaultsObj){
            worklist.callDelegateReloadTable(defaultsObj);
            worklist.setUpHovers();
			filters.addPatientCountString(worklist.getWorklistItemCount());
	        Rcm_Floating_Header.addFloatingTableHeader('floatingTableHeader');
        });
		filters.addPatientCountString(worklist.getWorklistItemCount());
        Rcm_Floating_Header.addFloatingTableHeader('floatingTableHeader');
    });
}
RCM_AWLController.inherits(MPageComponent);