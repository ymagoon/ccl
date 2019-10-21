function LinesTubesDrainsComponentStyle(){
    this.initByNamespace("ld");
}
LinesTubesDrainsComponentStyle.inherits(ComponentStyle);


/**
 * The Lines Tubes and Drains component will retrieve Lines Tubes and Drains information of the patient
 *
 * @param {Criterion} criterion
 */
function LinesTubesDrainsComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new LinesTubesDrainsComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.LINES_TUBES.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.LINES_TUBES.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
	this.m_event_arr = [];
    this.m_lines = null;
    this.m_tubes = null;
    
    LinesTubesDrainsComponent.method("InsertData", function(){
        CERN_LINESTUBESDRAINS_O1.GetLinesTubesDrainsTable(this);
    });
    LinesTubesDrainsComponent.method("HandleSuccess", function(recordData){
        CERN_LINESTUBESDRAINS_O1.RenderComponent(this, recordData);
    });
    LinesTubesDrainsComponent.method("getLineCodes", function(){
        return (this.m_lines);
    });
    LinesTubesDrainsComponent.method("setLineCodes", function(value){
        this.m_lines = value;
    });
    LinesTubesDrainsComponent.method("addLineCode", function(value){
        if (this.m_lines == null) {
            this.m_lines = [];
        }
        this.m_lines.push(value);
    });   
    LinesTubesDrainsComponent.method("getTubeCodes", function(){
        return (this.m_tubes);
    });
    LinesTubesDrainsComponent.method("setTubeCodes", function(value){
        this.m_tubes = value;
    });
    LinesTubesDrainsComponent.method("addTubeCode", function(value){
        if (this.m_tubes == null){ 
            this.m_tubes = [];
        }
        this.m_tubes.push(value);
    });
}
LinesTubesDrainsComponent.inherits(MPageComponent);

/**
 * LinesTubesDrains methods
 * @namespace CERN_LINESTUBESDRAINS_O1
 * @static
 * @global
 * @dependencies Script: mp_lines_tubes_drains
 */
var CERN_LINESTUBESDRAINS_O1 = function(){
    var m_df = null;
    return {
        GetLinesTubesDrainsTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            var lineCodes = component.getLineCodes();
            var tubeCodes = component.getTubeCodes();
            var sLines = MP_Util.CreateParamArray(component.getLineCodes(),1);
            var sTubes = MP_Util.CreateParamArray(component.getTubeCodes(),1);
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", sLines, sTubes, criterion.provider_id+".0", criterion.ppr_cd+".0");
            MP_Core.XMLCclRequestWrapper(component, "mp_lines_tubes_drains", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            
            try {
                var i = 0;
                var jsLTDHTML = [];
                var ltdHTML = "", countText = "";
                var headDtTm = component.getDateFormat() == 3 ? i18n.LAST_DOC_WITHIN : i18n.LAST_DOC;
				var criterion = component.getCriterion();
				var rowCnt = 0;
				
                jsLTDHTML.push("<dl class='ld-info-hdr hdr'><dd class='ld-name'>&nbsp;</dd><dd class='ld-dt'>", headDtTm,
                               "</dd></dl><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION,
                               "'>-</span><span class='sub-sec-title'>", i18n.LINES, " (", recordData.LINES.length, ")</span></h3><div class='sub-sec-content'>");
                
                if (recordData.LINES.length > 0) {
                    recordData.LINES.sort(SortLinesTubesDrainsByDate);
                    jsLTDHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.LINES.length), "'>");
                    
                    for (i = 0; i < recordData.LINES.length; i++) {
						rowCnt = rowCnt + 1;
                        jsLTDHTML.push(CreateLTDRow(recordData.LINES[i], component, rowCnt));
                    }
                    jsLTDHTML.push("</div>");
                }
                
                jsLTDHTML.push("</div></div><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION,
                               "'>-</span><span class='sub-sec-title'>", i18n.TUBES_DRAINS, " (", recordData.TUBES_DRAINS.length, ")</span></h3><div class='sub-sec-content'>");
                
                if (recordData.TUBES_DRAINS.length > 0) {
                    recordData.TUBES_DRAINS.sort(SortLinesTubesDrainsByDate);
                    jsLTDHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.TUBES_DRAINS.length), "'>");
                    
                    for (i = 0; i < recordData.TUBES_DRAINS.length; i++) {
						rowCnt = rowCnt + 1;
                        jsLTDHTML.push(CreateLTDRow(recordData.TUBES_DRAINS[i], component, rowCnt));
                    }
                    jsLTDHTML.push("</div>");
                }
                jsLTDHTML.push("</div></div>");
                ltdHTML = jsLTDHTML.join("");
                countText = MP_Util.CreateTitleText(component, recordData.LINES.length + recordData.TUBES_DRAINS.length);
                MP_Util.Doc.FinalizeComponent(ltdHTML, component, countText);
				
				var classArray = Util.Style.g("ld-name");
				for (var k = 0; k < classArray.length; k++) {
					var oListItem = classArray[k];
					oListItem.onclick = (function(value) {
											return function() {
												GetEventViewer(criterion.person_id + ".0", criterion.encntr_id + ".0",component.m_event_arr[value].eventIds,"\"EVENT\"");
											}
					})(k);
					Util.addEvent(classArray[k], "mouseover", function() {
						rowSel(this);
					});
					Util.addEvent(classArray[k], "mouseout", function() {
						rowSel(this);
					});
				}
            } 
            catch (err) {
                
                throw (err);
            }
            finally {
                //do nothing
            }
        }
    };
    function CreateLTDRow(ltd, component, index){
        var ar = [];
		var eventIdAr = [];
        var sDetStart = "<dl class='ld-info'><dd class='ld-name'><span>";
        var sDetMid = "</span></dd><dd class='ld-dt'><span class='date-time'>";
        var sDetEnd = "</span></dd></dl>";
		var sModClass = "";
		var nModInd = 0;
		var objDet = ltd.DETAILS;
        var sLTDTitle = (ltd.DYN_LBL_NAME != "") ? ltd.TYPE + "  (" + ltd.DYN_LBL_NAME + ")" : ltd.TYPE;
        var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
        var sEvntDtTm = "";
        if (ltd.LAST_DT_TM != "") {
            sEvntDtTm = GetHeadsUpDateDisplay(component, ltd.LAST_DT_TM);
        }
        		
		
		for (var x = 0; x < objDet.length; x++) {
			eventIdAr.push(objDet[x].EVENT_ID+".0")
		    if (objDet[x].RESULT_STATUS_FLAG === 1) {
				if (nModInd === 0) {
					nModInd = 1;
					sModClass = "<span class='res-modified'>&nbsp;</span>";
				}
			}
		}        
		
		if(index !== null && !isNaN(index)){
			if(component.m_event_arr[index]){
				component.m_event_arr[index]["eventIds"] = eventIdAr;
			}
			else {
				component.m_event_arr[index] = {};
				component.m_event_arr[index]["eventIds"] = eventIdAr;
			}
		}
		
		ar.push(sDetStart, sLTDTitle, sModClass, sDetMid, sEvntDtTm, sDetEnd);
		
        if (objDet != null && objDet.length > 0) {
            ar.push(CreateHover(objDet, ltd));
        }
        ar.push("</dl>");
        return ar.join("");
    }
    function CreateHover(objDet, ltd){
        var ar = [];
        var sHvrDetStart = "<dt><span>";
        var sHvrDetMid = "</span></dt><dd><span>";
        var sHvrDetEnd = "</span></dd>";
        var sColon = ":";
        var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
        ar.push("<h4 class='det-hd'><span>" + i18n.DETAILS + "</span></h4><div class='hvr'><dl>");
        for (var j = 0; j < objDet.length; j++) {
			var resultDisplay = "";
			var status = "";
			if (objDet[j].RESULT_TYPE_FLAG == 1) {
				resultDisplay = getHoverDateDisplay(objDet[j].RESULT);
			}
			else {
			    var prec = calculatePrecision(objDet[j].RESULT);
				if(!isNaN(objDet[j].RESULT)) {
					resultDisplay = nf.format(objDet[j].RESULT,"."+prec);
			    }
				else {
					resultDisplay = objDet[j].RESULT;
				}
			}
			;status = "</span></dd><dd><span>" + i18n.STATUS + ": " + objDet[j].RESULT_STATUS
            var sChar = objDet[j].NAME.substring(objDet[j].NAME.length - 1);
            if (sChar == ":") {
				ar.push(sHvrDetStart, objDet[j].NAME, sHvrDetMid, resultDisplay, sHvrDetEnd);
            }
            else {
                ar.push(sHvrDetStart, objDet[j].NAME, sColon, sHvrDetMid, resultDisplay, sHvrDetEnd);
            }
            
        }
        
        if (ltd.FIRST_DT_TM != "") {
            var sEvntDtTm = getHoverDateDisplay(ltd.FIRST_DT_TM);
			ar.push("<dt><span>", i18n.INIT_DOC_DT_TM, ":</span></dt><dd><span>", sEvntDtTm, "</span></dd>");
        }
        ar.push("</div>");
        return ar.join("");
    }
    function SortLinesTubesDrainsByDate(a, b){
        var x = a.LAST_DT_TM;
        var y = b.LAST_DT_TM;
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    }
	function GetDateFormatter(){
		if(m_df==null){
			m_df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
		}
		return m_df;
	}
	function calculatePrecision (valRes){		
		 var precision = 0;	
		 var decLoc = valRes.search(/\.(\d)/);  						//locate the decimal point
		 if (decLoc !== -1){
			var strSize = valRes.length;
			precision = strSize - decLoc - 1;
		}	
		return precision;
	}
	function GetHeadsUpDateDisplay(component, resultDate){
	  var dateTime = new Date();
	  dateTime.setISO8601(resultDate);
	  var sEvntDtTm = MP_Util.DisplayDateByOption(component, dateTime);
	  return sEvntDtTm;
	}
	function getHoverDateDisplay(resultDate){
      var df=GetDateFormatter();
	  return df.formatISO8601(resultDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
	}
	function GetEventViewer(patient_id, encntr_id, eventAr, docViewerType) {
		var m_dPersonId = parseFloat(patient_id);
		var m_dEncntrId = parseFloat(encntr_id);
		var m_dEventId = 0.0;
		var viewerObj = window.external.DiscernObjectFactory("PVVIEWERMPAGE");
		MP_Util.LogDiscernInfo(null, "PVVIEWERMPAGE", "linestubesdrains.js", "GetEventViewer");
		
		viewerObj.CreateEventViewer(m_dPersonId);
		
		for (var t = 0; t < eventAr.length; t++) {
		    m_dEventId = parseFloat(eventAr[t]);
			viewerObj.AppendEvent(m_dEventId);
		}
	    viewerObj.LaunchEventViewer();
	}
	function rowSel(row) {
		if (Util.Style.ccss(row, "ld-row-selected")) {
			Util.Style.rcss(row, "ld-row-selected");
		}
		else {
			Util.Style.acss(row, "ld-row-selected");
		}
	}
}();
