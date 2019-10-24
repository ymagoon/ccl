function AnesthesiaRecordsStyle() {
    this.initByNamespace("ar");
}
AnesthesiaRecordsStyle.inherits(ComponentStyle);

function AnesthesiaRecords(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new AnesthesiaRecordsStyle());
    this.setComponentLoadTimerName("USR:MPG.AnesthesiaRecords.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.AnesthesiaRecords.O1 - render component");
    this.zoomValue = 75;
    this.intervalValue = true;
    this.iconValue = true;
    this.setScope(1);
    AnesthesiaRecords.method("setZoomValue", function(values) {
        this.zoomValue = values;
    });
    AnesthesiaRecords.method("setIntervalFlag", function(values) {
        this.intervalValue = values;
    });
    AnesthesiaRecords.method("setIconFlag", function(values) {
        this.iconValue = values;
    });
}
AnesthesiaRecords.prototype = new MPageComponent();
AnesthesiaRecords.prototype.constructor = MPageComponent;
AnesthesiaRecords.prototype.resizeComponent = function() {};
AnesthesiaRecords.prototype.loadFilterMappings = function() {
    this.addFilterMappingObject("ZOOM", {
        setFunction: this.setZoomValue,
        type: "NUMBER",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("INTERVAL", {
        setFunction: this.setIntervalFlag,
        type: "BOOLEAN",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("ICON", {
        setFunction: this.setIconFlag,
        type: "BOOLEAN",
        field: "FREETEXT_DESC"
    });
};
AnesthesiaRecords.prototype.retrieveComponentData = function() {
    var criterion = null;
    var request = null;
    var self = this;
    var sendAr = null;
    criterion = this.getCriterion();
    sendAr = ["^MINE^", criterion.person_id];
    request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
    request.setProgramName("INN_GET_ANESTHESIA_RECORDS");
    request.setParameters(sendAr);
    request.setAsync(true);
    MP_Core.XMLCCLRequestCallBack(this, request, function(reply) {
        self.renderComponent(reply);
    });
};
AnesthesiaRecords.launchGraph = function(link, pid, surg_case, ie, time, icon_value, zoomValue, case_status_flag) {
    var mPageReportName = "inn_mp_open_mpage";
    var mPageReportParam = "^MINE^,^" + link + "^,^person_id:" + pid + "^, ^surg_case_id:" + surg_case + ".00^,^zoom_level:" + zoomValue + "^,^IE_VERSION:" + ie + "^,^interval:" + time + "^,^anesthesia_icon:" + icon_value + "^,^case_status_flag:" + case_status_flag + "^,^GLOBAL_JS:inn_mp_anesthesia_global_js^";
    var mPageCclLink = "1";
    var linkCall = "javascript:CCLLINK('" + mPageReportName + "', '" + mPageReportParam + "', " + mPageCclLink + ")";
    var screenWidth = screen.width;
    var screenHeight = screen.height;
    var wParams = "left=0,top=0,width=" + (screenWidth - 1) + ",height=" + (screenHeight - 5) + ",toolbar=no,resizable=yes, scrollbars = yes";
    javascript: CCLNEWSESSIONWINDOW(linkCall, "_blank", wParams, 0, 0);
};
AnesthesiaRecords.prototype.renderComponent = function(reply) {
    var surgicalCaseResponse = reply.getResponse();
    var criterion = this.getCriterion();
    var arI18n = i18n.innov.anesthesia_records_o1;
    var target = "";
    var timeInterval = 1;
    var iconValue = 1;
    var pid = criterion.person_id;
    var surgCaseId;
    if (this.intervalValue == false) {
        timeInterval = 0;
    }
    if (this.iconValue == false) {
        iconValue = 0;
    }
    var convertToLocalTime = function(time) {
            var d = new Date();
	        d.setISO8601(time);
	        var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	        onsetDate = df.format(d, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
	        return onsetDate;	       
    };
    
    var localPath ="static_content/inn_anesthesia_graph";
    var procedureValueDetails = [];
    var finalizedIdLength = surgicalCaseResponse.SURGICAL_FINALIZED_REPLY.SURG_FINALIZED_ID.length;
    var finalizedId = surgicalCaseResponse.SURGICAL_FINALIZED_REPLY.SURG_FINALIZED_ID;
    var case_status = "";
    for (var i = 0; i < finalizedIdLength; i++) {
        var surgeonName = [];
        var procedureName;
        
        var start = finalizedId[i].CASE_FINALIZED_DATE;
        if(start != "")
        {
        	start = convertToLocalTime(start);
        }
        
        if (finalizedId[i].SURGEON_NAME == " ") {
            surgeonName = arI18n.SURGEON_NOT_KNOWN;
        } else {
            surgeonName = finalizedId[i].SURGEON_NAME;
        } if (finalizedId[i].FINALIZED_SURG_PROC_DISPLAY != "") {
            procedureName = finalizedId[i].FINALIZED_SURG_PROC_DISPLAY;
        } else {
            procedureName = arI18n.PROCEDURE_NOT_KNOWN;
        }
        surgCaseId = finalizedId[i].CASE_FINALIZED_ID;

        if(finalizedId[i].CASE_FINALIZED_STATUS == 0)
        {
        	case_status = arI18n.FINALIZED;
        }
        else
        	if(finalizedId[i].CASE_FINALIZED_STATUS == 1)
	        {
	        	case_status = arI18n.SUSPENDED;
	        }

        procedureValueDetails.push({
            procedure: procedureName,
            surgeon: surgeonName,
            date: start,
            person_id: pid,
            surg_case_id: surgCaseId,
            sort_date: finalizedId[i].CASE_FINALIZED_DATE,
            case_status:case_status,
            case_status_flag: finalizedId[i].CASE_FINALIZED_STATUS
        });
    }
    var anesthesiaTable = new ComponentTable();
    anesthesiaTable.setNamespace(this.getStyles().getId());
    anesthesiaTable.setZebraStripe(true);
    
    var procedureColumn = AnesthesiaRecords.buildTableColumn("PROCEDURE_COLUMN", arI18n.PROCEDURE, "${procedure}", "ar-title-column", "1", localPath, "${person_id}", "${surg_case_id}", "10", timeInterval, iconValue, this.zoomValue, "${case_status_flag}");
    procedureColumn.setPrimarySortField("procedure");
    procedureColumn.setColumnSortDirection(TableColumn.SORT.DESCENDING);
    procedureColumn.setIsSortable(true);
    
    var surgeonColumn = AnesthesiaRecords.buildTableColumn("SURGEON_COLUMN", arI18n.SURGEON, "${surgeon}", "ar-title-column", "0");
    surgeonColumn.setPrimarySortField("surgeon");
    surgeonColumn.setColumnSortDirection(TableColumn.SORT.DESCENDING);
    surgeonColumn.setIsSortable(true);
    
    var dateColumn = AnesthesiaRecords.buildTableColumn("DATE_COLUMN", "", "${date}", "ar-title-column", "0");
    dateColumn.setPrimarySortField("sort_date");
    dateColumn.setColumnSortDirection(TableColumn.SORT.DESCENDING);
    dateColumn.setIsSortable(true);

    var statusColumn = AnesthesiaRecords.buildTableColumn("STATUS_COLUMN", arI18n.CASE_STATUS, "${case_status}", "ar-title-column", "0");
    statusColumn.setPrimarySortField("case_status");
    statusColumn.setColumnSortDirection(TableColumn.SORT.DESCENDING);
    statusColumn.setIsSortable(true);

    anesthesiaTable.addColumn(procedureColumn);
    anesthesiaTable.addColumn(surgeonColumn);
    anesthesiaTable.addColumn(dateColumn);
    anesthesiaTable.addColumn(statusColumn);

    anesthesiaTable.bindData(procedureValueDetails);
    anesthesiaTable.sortByColumnInDirection("DATE_COLUMN", TableColumn.SORT.DESCENDING);
    var html = anesthesiaTable.render();
    this.setComponentTable(anesthesiaTable);
    this.finalizeComponent(html, "(" + surgicalCaseResponse.SURGICAL_FINALIZED_REPLY.SURG_FINALIZED_ID.length + ")");
};
AnesthesiaRecords.buildTableColumn = function(id, display, renderKey, customClass, linkFlag, localPath, personId, surgCaseId, ie, timeInterval, iconValue, zoomValue, case_status_flag) {
    var column = new TableColumn();
    column.setColumnId(id);
    column.setCustomClass(customClass);
    column.setColumnDisplay(display);
    if (linkFlag == "1") {
        column.setRenderTemplate("<span><a onclick=AnesthesiaRecords.launchGraph('" + localPath + "','" + personId + "','" + surgCaseId + "','" + ie + "','" + timeInterval + "','" + iconValue + "','" + zoomValue + "','" + case_status_flag + "');>" + renderKey + "</a></span>");
    } else {
        column.setRenderTemplate("<span>" + renderKey + "</span>");
    }
    return column;
};
MP_Util.setObjectDefinitionMapping("ANESTHESIA", AnesthesiaRecords);
MP_Util.setObjectDefinitionMapping("ANESTHESIA_SUM", AnesthesiaRecords);