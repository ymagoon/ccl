function PregAssessmentBaseStyleWF() {
	this.initByNamespace("pab-wf");
}

var CERN_PREG_ASSESSMENT_BASE_O2 = function() {

	/**
     * An AssessmentTable is a representation of the assessment table that holds all row data, as well as column headers.
     * @param buckets  The buckets (columns) defined for the table.
     */
	var AssessmentTable = function (buckets) {
		var m_rows = [];
        var m_buckets = buckets;
        
        /**
         * Initialize the table with assessments retrieved from the data retrieval script
         * @param recordData  The JSon associated to the data retrieved from the service
         */
        this.initAssessmentData = function (results,events) {
        	var prevEventCode = -1;
            for (var x = 0; x < results.length; x++) {
            	// loop through data results
            	var data = results[x].DATA;
            	for (var y = 0; y < data.length; y++) {
                	var eventCode = data[y].CODE;
                	var new_buckets = null;
                	var eventRow = null;
                	var eventResult = null;
                	var eventSeq = getRowSequence(eventCode,events);
                	
                	// check for double documentation
                	var dups = getDups(eventCode,data);
                	if (data.length > 1) {
                		if (eventCode === prevEventCode){
                			eventResult = new EventResult(results[x],data[y],null,eventCode,false,dups);
                		} else {
                			eventResult = new EventResult(results[x],data[y],null,eventCode,true,dups);	
                		}
                	} else { 
                			eventResult = new EventResult(results[x],data[y],null,eventCode,true,dups);
                	}
                	                	
                	eventRow = m_rows[eventSeq];
                	if (!eventRow) {
                    	new_buckets = createEventRowBuckets(m_buckets);
                    	eventRow = new EventRow(getRowLabel(eventCode,events), new_buckets, false);
                    	if (eventSeq !== -1) {
                    		m_rows[eventSeq] = eventRow;
                    	}
                	}
                	addResultToBucket(eventResult, eventRow);
                	prevEventCode = eventCode;
               }
               
               // loop through dynamic label results
               prevEventCode = -1;
               var labels = results[x].LABELS;
			   for (var z = 0; z < labels.length; z++) {
			   		for (var k = 0; k < labels[z].LABEL_DATA.length; k++) {
			   			var labelData = labels[z].LABEL_DATA[k]; 
			   			var labelEventCode = labelData.CODE;
						var labelNew_buckets = null;
						var labelEventRow = null;
						var labelEventResult = null;
						var labelEventSeq = getRowSequence(labelEventCode,events);
						
						// check for double documentation
						var labelDups = getDups(labelEventCode,labels[z].LABEL_DATA);
						if (labels[z].LABEL_DATA.length > 1) {
							if (labelEventCode === prevEventCode){ // dup
                				labelEventResult = new EventResult(results[x],labelData,labels[z].LABEL,labelEventCode,false,labelDups);
                			} else { // possible dup value, need to check dup count
                				labelEventResult = new EventResult(results[x],labelData,labels[z].LABEL,labelEventCode,true,labelDups);
                			}
                		} else { 
                			labelEventResult = new EventResult(results[x],labelData,labels[z].LABEL,labelEventCode,true,labelDups);
                		}
                		
						labelEventRow = m_rows[labelEventSeq];
						if (!labelEventRow){
							labelNew_buckets = createEventRowBuckets(m_buckets);
							labelEventRow = new EventRow(getRowLabel(labelEventCode,events), labelNew_buckets, true);
                    		if (labelEventSeq !== -1) {
                    			m_rows[labelEventSeq] = labelEventRow;
                    		}
						}
						addResultToBucket(labelEventResult,labelEventRow);
						prevEventCode = labelEventCode;
					}
				}
            }
        };
        
        /**
         * @return Returns the array of elements per bucket
         */
        this.getRows = function () {
            return m_rows;
        };
        
        /**
         * Function will take a given result and determine if the result's end date falls between the bucket's date range.
         * If the result is found to be within the bounds of a bucket, it will be added.
         * @param result  The result to evaluate to which bucket placed.
         * @param eventRow  The row that contains the buckets to evaluate.
         */
        function addResultToBucket(result, eventRow) {
            var rowBuckets = eventRow.getBuckets();
            var resultDate = result.getEventDate();
            for (var x = 0; x < rowBuckets.length; x++) {
                var rowBucket = rowBuckets[x];
                if (AreResultsOnSameDay(resultDate,rowBucket.getEventDate())) {
                    rowBucket.addResult(result);
                    break;
                }
            }
        }
        
        /**
         * Based on the initial bucket templates provided, create a duplicate set of buckets based on the begin and end dates
         * @param bucketsTemplate  An <code>Array</code> of buckets that dictate the bounds in which results are to be divided
         * @return <code>Array<code> of buckets duplicated from the template provided.
         */
        function createEventRowBuckets(bucketsTemplate) {
            var row_buckets = [];
            for (var x = 0; x < bucketsTemplate.length; x++) {
                row_buckets.push(new EventResultBucket(bucketsTemplate[x].getEventDate(),bucketsTemplate[x].getEventDateDisp(),bucketsTemplate[x].getSeq()));
            }
            return row_buckets;
        }                                                                               
    };
    
     /**
     * An EventRow is a representation of a single row to display within the assessment table.
     * @param label  The display that is to be utilized for the row.
     * @param buckets  The buckets associated to the row that will contain the results.
     * @param dynamicLabel  Denotes if this row supports dynamic labels.
     */
    var EventRow = function (label, buckets, dynamicLabelRow) {
        var m_label = label;
        var m_buckets = buckets;
        var m_dynamicLabel = dynamicLabelRow;
      
        /**
         * @return Returns the display to utilize for row
         */
        this.getLabel = function () {
            return m_label;
        };
        
        /**
         * @return Returns the <code>EventResultBucket</code>s associated to the row
         */
        this.getBuckets = function () {
            return m_buckets;
        };
        
        /**
         * @return Returns the <code>EventResultBucket</code>s associated to the row
         */
        this.isDynamicLabelRow = function () {
            return m_dynamicLabel;
        };

    };
    
     /* An EventResultBucket is a representation of a single grouping of results for a given date and time for a given row.
     * @param eventDate  The event date of a grouping of results
     * @param eventDateDisp  The event date display textual string
     * @param eventSeq  The event date order (column sequence order)
     */
    var EventResultBucket = function (eventDate, eventDateDisp, eventSeq) {
        var m_eventDate = eventDate;
        var m_eventDateDisp = eventDateDisp;
        var m_seq = eventSeq;
        var m_results = [];
        
        /**
         * @return Returns the begin date associated to the bucket for the date range qualification
         */
        this.getEventDate = function () {
            return m_eventDate;
        };
        
         /**
         * @return Returns the begin date associated to the bucket for the date range qualification
         */
        this.getEventDateDisp = function () {
            return m_eventDateDisp;
        };
        
        /**
         * Accepts an <code>Assessment</code> and adds the result to the bucket
         */
        this.addResult = function (result) {
           m_results.push(result);
        };
        
        /**
         * @return Returns all assessments added to the bucket
         */
        this.getResults = function () {
            return m_results;
        };
        
        /**
         * @return Returns bucket sequence
         */
        this.getSeq = function () {
            return m_seq;
        }; 
    };
    
	/**
     * The <code>EventResult</code> is an object representation of the documented event
     * @param eventResult  The documented event value
     * @param eventDate  The event date
     * @param eventLabel  The event dynamic label or null
     * @param eventCode  The event code value
     * @param dups  A list of results that have been double documented for this event
     */
    var EventResult = function (eventResult, eventData, eventLabel, eventCode, mostRecentResult, dups) {
    	
        var m_eventDate = eventResult.DATE;
        var m_eventCode = eventCode;
        var m_dynamicLabel = eventLabel;
        var m_uom = eventData.UNIT;
        var m_result = eventData.RESULT;
        var m_dupCount = dups.length;
        var m_dups = dups;
        var m_mostRecent = mostRecentResult;
               
        /**
         * @return the actual event result
         */
        this.getResult = function () {
            return m_result;
        };
        
        /**
         * @return The clinical date and time of the event
         */
        this.getEventDate = function () {
            return m_eventDate;
        };
        
        /**
         * @return The event code identifier tied to the event
         */
        this.getEventCode = function () {
            return m_eventCode;
        };
        
         /**
         * @return Indicator that classifies this results to be tied to a dynamic group label
         */
        this.isDynamicLabel = function () {
        	if (m_dynamicLabel === null) { return false; }
            return true;
        };
        
        /**
         * @return The dynamic group label associate to the event
         */
        this.getDynamicLabel = function () {
            return m_dynamicLabel;
        };
        
        /**
         * @return The event code display of the event
         */
        this.getDisplay = function () {
            return m_eventCode.display;
        };
        
        /**
         * @return The unit of measure code object associated to the event
         */
        this.getUnitOfMeasure = function () {
            return m_uom;
        };  
        
        /**
         * @return Indicator that classifies this results to be tied to a dynamic group label
         */
        this.isMostRecentResult = function () {
            return m_mostRecent;
        };
        
        /**
         * @return The number of double documented results for this event
         */
        this.getDupCount = function () {
            return m_dupCount;
        }; 
        
        /**
         * @return The list of double documented results
         */
        this.getDups = function () {
            return m_dups;
        };              
    };

	/**
	 * AreResultsOnSameDay
	 *	Compares two dates to determine if they occur on the same day
	 *	@param d1  first date to compare
	 *	@param d2  second date to compare
     *	@return boolean - true if and only if dates have same year, month and day, otherwise false
	 */
	function AreResultsOnSameDay(d1, d2) {
		if(d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getDate() === d2.getDate() && d1.getDay() === d2.getDay() && d1.getTime() === d2.getTime()) {
			return true;
		}
		return false;
	}

	/**
	 * FormatNumber
	 *	Checks whether an object should be localized. Prior to calling the format method,
	 *	need to check that the object is a string or number.
	 *	@param num  any object that possibly needs formatting
	 *	@return if a valid number or string is passed, a properly formatted number is returned;
	 *	otherwise, parameter is returned
	 */
	function FormatNumber(num) {
		if( typeof num == "string") {
			num = mp_formatter._trim(num);
		}
		if(!mp_formatter._isNumber(num)) {
			return num;
		}

		return MP_Util.GetNumericFormatter().format(num);
	}

	/**
	 * UnpackReply
	 *	Puts the elements from the reply into a records structure for sorting.  Items are sorted
	 *	by event date (desc).
	 *	@param recordData  data returned from the script
	 *	@return array - reply elements sorted by event date (desc)
	 */
	function UnpackReply(recordData) {
		var i;
		var j;
		var k;
		var events = [];
		var df = MP_Util.GetDateFormatter();
		for( i = 0; i < recordData.QUAL.length; i++) {
			var eventDate = new Date();
			eventDate.setISO8601(recordData.QUAL[i].DATA_DT_TM);

			var data = [];
			for( j = 0; j < recordData.QUAL[i].ASSESSMENT_DATA.length; j++) {
				var rslt;
				if(recordData.QUAL[i].ASSESSMENT_DATA[j].RESULT_TYPE_FLAG === 5) {
					rslt = df.formatISO8601(recordData.QUAL[i].ASSESSMENT_DATA[j].EVENT_RESULT, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
				}
				else {
					rslt = FormatNumber(recordData.QUAL[i].ASSESSMENT_DATA[j].EVENT_RESULT);
				}
				data.push({
					CODE : recordData.QUAL[i].ASSESSMENT_DATA[j].EVENT_CODE,
					RESULT : rslt,
					UNIT : recordData.QUAL[i].ASSESSMENT_DATA[j].EVENT_RESULT_UNITS,
					LABEL_FLAG : recordData.QUAL[i].ASSESSMENT_DATA[j].DYNAMIC_LABEL_FLAG
				});
			}

			var labels = [];
			for( j = 0; j < recordData.QUAL[i].DYNAMIC_LIST.length; j++) {
				var labelData = [];
				for( k = 0; k < recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_DATA.length; k++) {
					var rslt1;
					if(recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_DATA[k].EVENT_RESULT && recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_DATA[k].RESULT_TYPE_FLAG === 5) {
						rslt1 = df.formatISO8601(recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_DATA[k].EVENT_RESULT, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
					}
					else {
						rslt1 = FormatNumber(recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_DATA[k].EVENT_RESULT);
					}
					labelData.push({
						CODE : recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_DATA[k].EVENT_CODE,
						RESULT : rslt1,
						UNIT : recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_DATA[k].EVENT_RESULT_UNITS
					});
				}

				labels.push({
					LABEL : recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_LABEL,
					ID : recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_LABEL_ID,
					LABEL_DATA : labelData
				});
			}

			events.push({
				DATE : eventDate,
				DYNAMIC_LABEL : recordData.QUAL[i].DYNAMIC_LABEL,
				LABEL_ID : recordData.QUAL[i].DYNAMIC_LABEL_ID,
				DATA : data,
				LABELS : labels
			});
		}

		//Sort the events based on time (descending)
		events.sort(function(a, b) {
			return b.DATE.getTime() - a.DATE.getTime();
		});
		return events;
	}
	
	/**
	 *  getDynamicLabels
	 *	Retrieves the list of dynamic labels
	 *	@param recordData  data returned from the script call
	 */
	function getDynamicLabels(recordData){
		var j;
		var i;
		var dynLabels = [];
		var dynKeys = [];

		for(i = 0; i < recordData.QUAL.length; i++) {
			for(j = 0; j < recordData.QUAL[i].DYNAMIC_LIST.length; j++) {
				if(dynKeys.indexOf(recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_LABEL_ID) === -1) {
					dynLabels.push({
						LABEL : recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_LABEL,
						ID : recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_LABEL_ID
					});
				
					dynKeys.push(recordData.QUAL[i].DYNAMIC_LIST[j].DYNAMIC_LABEL_ID);
				}
			}
		}
		
		// Sort the dynamic labels
		dynLabels.sort(function sortDynamicLabelSort(label1, label2) {
			var sortRes = 0;
			if (label1 && label1.LABEL === "") {
				sortRes = 1;
			} else if (label2 && label2.LABEL === "") {
				sortRes = -1;
			} else {
				sortRes = ((label1.LABEL).toUpperCase() < (label2.LABEL).toUpperCase()) ? -1 : 1;
			}
			return sortRes;
		});
		return dynLabels;
	}
	
	/**
	 *  getRowLabels
	 *	Retrieves the list of event labels (event sets).
	 *	@param recordData  data returned from the script call
	 */
	function getRowLabels(recordData){
		var i;
		var rowLabels = [];

		for (i = 0, l = recordData.CODES.length; i < l; i++){
			var event_row=recordData.CODES[i];
			if(!event_row){
				continue;
			}
			var display=event_row.DISPLAY || "";
			rowLabels.push({
				CODE: event_row.CODE,
				DISPLAY: display,
				SEQUENCE: i
			});
		}
		
		return rowLabels;
	}
	
	/**
	 *  getRowLabel
	 *	Retrieves the event label by code value
	 *	@param codeValue  an event code value
	 *  @parma eventlsit  an array of all row labels
	 */
	function getRowLabel(codeValue, eventList){
		var i;
		for (i = 0; i < eventList.length; i++){
			if (eventList[i].CODE === codeValue){
				return eventList[i].DISPLAY;
			}
		}
		
		return "";
	}
	
	/**
	 *  getRowSequence
	 *	Retrieves the event ordering sequence by code value
	 *	@param codeValue  an event code value
	 *  @parma eventlsit  an array of all row labels
	 */
	function getRowSequence(codeValue, eventList){
		var i;
		for (i = 0; i < eventList.length; i++){
			if (eventList[i].CODE === codeValue){
				return eventList[i].SEQUENCE;
			}
		}
		
		return -1;
	}
		
	/**
	 *  getDups
	 *	Retrieves any duplicate results (double documentation)
	 *	@param codeValue  an event code value
	 *  @parma data  an array of data for that date and time
	 */
	function getDups(codeValue, data) {
		var i;
		var dups = [];
		
		for (i = 0; i < data.length; i++){
			if (data[i].CODE === codeValue){
				dups.push(data[i]);
			}
		}
		
		if (dups.length === 1) {
			return [];
		} 
		
		return dups;
	}	
	
	/**
     * Creates the hover text for cells with results
     * @param result  The data object passed from the TableHoverCellExtension. 
     */
    function createResultHover(result) {
        var hoverHTML = [];
	     
	    // Grab result information
	    var row = result.RESULT_DATA;
	    var columnId = result.COLUMN_ID;
	    var columnDateKey = columnId.substring(4,columnId.indexOf("_")); // 4 is the length of "data". which is the prefix of the column name
	    var hoverTxt = row.DATA[columnDateKey].HOVER; 
	    var rowLabel = row.LABEL;
		var hoverLabel = (rowLabel.indexOf("<br/>") >= 0) ? rowLabel.substring(0,rowLabel.indexOf("<br/>"))+"</span>" : rowLabel;
	    var emptyRow = "<span class='fs-new-day'>--</span>";
	    
        // Check to see if hover needs to be displayed
        if (hoverTxt === null || hoverTxt === undefined || hoverTxt === "" || hoverTxt === emptyRow) {
        	return null; // don't display hovers for empty cells
        }
        
        // Create the HTML for the hover
		hoverHTML.push("<span class='pab2-wf-table-data-hover'>");
		hoverHTML.push("<dl><dt>" + hoverLabel + "</dt>");
		hoverHTML.push("<dd>" + hoverTxt + "</dd>");
		hoverHTML.push("</dl></span>");

		return hoverHTML.join("");
    }
    
    /**
     * Helper function: shortens a text string; used mainly because the CSS property text-overflow:ellipsis
     * does not support multi-line truncation in IE. It only supports single line truncation.
     * @param prefix  The label prefix if dynamic label
     * @param text  The text to shorten
     * @param uom  The unit of measure display
     * @param maxLength  the maxLength of the text 
     */
    function shorten(prefix, text, uom, suffix, maxLength) {
    	var ret = "";
    	var format = "<span class='pab2-wf-unit'>";
    	
    	if (prefix.length > maxLength) {
    		ret = format + prefix.substr(0,maxLength-3) + "</span>&hellip;"; // 3 for the ellipsis
    	} else if ((prefix + text).length > maxLength) {
    		ret = format + prefix + "</span>" + text.substr(0,maxLength-prefix.length-3) +"&hellip;";
    	} else if ((prefix + text + uom).length > maxLength) {
    		ret = format + prefix + "</span>" + text + format + uom.substr(0,maxLength-prefix.length-text.length-3) + "</span>&hellip;";
    	} else if ((prefix + text + uom + suffix).length > maxLength) {
    		ret = format + prefix + "</span>" + text + format + uom + suffix.substr(0,maxLength-prefix.length-text.length-uom.length-3) + "</span>&hellip;"; 
    	} else { // do not shorten
			ret = format + prefix + "</span>" + text + format + uom + suffix + "</span>";
		}
      	
    	return ret;
	}
	
	/**
     * Helper function: returns the truncation size for text overflow of multi-line results 
     * Note: used mainly because the CSS property text-overflow:ellipsis
     * does not support multi-line truncation in IE. It only supports single line truncation.
     * @param component  the component object
     * @param columnCnt  the number of columns
     */
	function getTruncationByColumn(component, columnCnt) {
		var labelColumnWidth = 204;
		var pixelBuffer = 2;
		var contentTableVisibleWidth = $(component.getSectionContentNode()).width() - labelColumnWidth - pixelBuffer;

		if (columnCnt === 1) {
			return contentTableVisibleWidth;
		}else if (columnCnt === 2) {
			return 58;
		}else if (columnCnt === 3) {
			return 48;
		}else if (columnCnt === 4) {
			return 36;
		}else if (columnCnt === 5) {
			return 30;
		} else {
			return 24;
		}	
	}
    
    /**
     * Process the data stored in the Assessment table, format to a JSON ready for the Flowsheet table.
     * @param rows  the list of rows
     * @param columns  the list of columns
     * @param events  the list of all possible events mapped to this table
     * @param truncateSize  the truncation size for text overflow (IE only)
     */
	function processFlowsheetData(rows, columns, events, dynamicLabels, truncateSize) {
		var FLOWSHEET_DATA = [];
        var eventRow = null;
        var eventRowBuckets = [];
        var aRow = null;
        var columnObj = [];
        var emptyRow = "<span class='fs-new-day'>--</span>";
        
        // loop through row of events
        if (events.length > 0) {
            for (x = 0; x < events.length; x++) {
                eventRow = rows[x];
                
                var bucketRow = [];
                var rowData = [];
				var rowLabel = null;
				var data = [];
				
                for (b = 0; b < columns.length; b++){
                	var ky = columns[b].DATE_KEY;
                	bucketRow[ky] = {
						"DISPLAY" : emptyRow
					};
                }
                
                // check to see if this row has any data (buckets) associated to it 
                if (eventRow === null || eventRow === undefined) {
            		var noRowLabel = "<span title='" + events[x].DISPLAY + "'>" + events[x].DISPLAY;
            		var noData = bucketRow;
        			FLOWSHEET_DATA.push({LABEL: noRowLabel, DATA: noData});
                } else {
                	rowLabel = "<span title='" + eventRow.getLabel() + "'>" + eventRow.getLabel();
                	rowData = bucketRow;
               	
               		// loop through row of buckets
               		eventRowBuckets = eventRow.getBuckets();
                	if (eventRowBuckets) {
                		for (y = 0; y < eventRowBuckets.length; y++) {
                        	
                        	var labelResultDisplay = [];
                        	var sFullResultDisplay = "";
                        	var sShortenResultDisplay = "";
                        	var sHoverDupDetail = "";
                        	var bucket = eventRowBuckets[y];
                        	var bucketResults = bucket.getResults();
                            
                        	aRow = rowData[eventRowBuckets[y].getSeq()]; 
                        	
                        	// loop through results for that given event (row) and day (bucket)                           
                        	for (z = 0; z < bucketResults.length; z++) {
                        		
                        		// check to see if result is associated with double documentation
                        		var sDupCount = "";
                        		if (bucketResults[z].getDupCount() > 0) {
                        			if (!bucketResults[z].isMostRecentResult()) {
                        				continue;	
                        			} else {
                        				sDupCount = "<span class='pab2-wf-unit'>(" + bucketResults[z].getDupCount() + ")</span>";
                        				var dupList = bucketResults[z].getDups();
                        				for (d = 0; d < dupList.length; d++){
                        					var sDupDynamicLabel = (bucketResults[z].isDynamicLabel()) ? 
                        			   			"<span class='pab2-wf-unit'>["+bucketResults[z].getDynamicLabel()+"]</span>&nbsp;&nbsp;" : ""; 
                        					var sDupUOM = (dupList[d].UNIT) ? "<span class='pab2-wf-unit'>" + dupList[d].UNIT + "</span>" : "";
                        					sHoverDupDetail += sDupDynamicLabel + "<span class='res-normal'>" + dupList[d].RESULT + "&nbsp;&nbsp;" + sDupUOM + "</span><br/>";
                        				}
                        			}	
                        		}
                        			
                        		if (bucketResults[z].getResult()) { 
                        			var sResult = bucketResults[z].getResult();
                            		var uom = bucketResults[z].getUnitOfMeasure();
                            		var sLabel = "";
                            		var sUnit = "";
                            		
                            		sLabel = (bucketResults[z].isDynamicLabel()) ? "<span class='pab2-wf-unit'>["+bucketResults[z].getDynamicLabel()+"]&nbsp;&nbsp;</span>":"";
                    				sUnit = (uom) ? "<span class='pab2-wf-unit'>" + uom + "</span>" : "";
                    				sFullResultDisplay += "<span class='res-normal'>" + sLabel + sResult + "&nbsp;&nbsp;" + sUnit + "&nbsp;&nbsp;" + sDupCount + "</span>";
                            		
                            		 // check for multiple line cells (i.e. dynamic labels) and if we need to truncate each dynamic label's result
                        			if (bucketResults[z].isDynamicLabel()) {
                        			   var shortenText = shorten("["+bucketResults[z].getDynamicLabel()+"]  ", 
                        											sResult,
                        											(uom) ? "  "+ uom + "  " : "",
                        											(sDupCount) ? "("+bucketResults[z].getDupCount()+")" : "" ,truncateSize);
                        											
                        				labelResultDisplay.push({
                        					LABEL: bucketResults[z].getDynamicLabel(),
                        					RESULT: shortenText,
                        					HOVER: (sHoverDupDetail === "") ? 
                        						"<span class='res-normal'>" + sLabel + sResult + "&nbsp;&nbsp;" + sUnit + "</span>" : sHoverDupDetail.substring(0,sHoverDupDetail.lastIndexOf("<br/>"))
                        				});	
                        				
                        				// reset for other possible dynamic labels double documentation
                        				sHoverDupDetail = "";
                        			}
                        		
                            	} else {
                               		sFullResultDisplay = emptyRow;
                      			}
                      		} // end of results for given bucket
                            
                            // format the label event bucket display
                            if (eventRow.isDynamicLabelRow()) {
                            	sShortenResultDisplay = "";
                            	sFullResultDisplay = "";
                            	var noDLData = 0;
                            	for (dl = 0; dl < dynamicLabels.length; dl++) {
                            		var found = false;
                            		for (lr = 0; lr < labelResultDisplay.length; lr++) {
                            			if (dynamicLabels[dl].LABEL.toUpperCase() === labelResultDisplay[lr].LABEL.toUpperCase()) {
                            				sShortenResultDisplay += labelResultDisplay[lr].RESULT;
                            				sFullResultDisplay += labelResultDisplay[lr].HOVER;
                            				found = true;
                            				break;
                            			} 
                            		}
                            	
                            		// if dynamic label has no result, display an empty row place holder 
                            		if (!found) {
                            			sShortenResultDisplay += emptyRow;
                            			sFullResultDisplay += emptyRow;
                            			noDLData += 1;
                            		}
                            	
                            		// add a line break after each dynamic label
                            		if (dl+1 < dynamicLabels.length) {
                            			sShortenResultDisplay += "<br />";
                            			sFullResultDisplay += "<br />";
                            		}
                            	}
                            	
                            	aRow.DISPLAY = sShortenResultDisplay;
                            	if (noDLData === dynamicLabels.length){
                            		aRow.HOVER = emptyRow;
                            	}else {
                            		aRow.HOVER = sFullResultDisplay;  
                            	}
                            	
                            }  else {
                      			aRow.DISPLAY = (sFullResultDisplay === "" ) ? emptyRow : sFullResultDisplay;
                      			aRow.HOVER = (sHoverDupDetail === "") ? sFullResultDisplay : sHoverDupDetail;  
                      		}
                      		
                      		aRow.DATE = eventRowBuckets[y].getEventDateDisp(); 
                      		data.push(aRow);         	
                		} // end of row buckets
                       
                    	// pad row label to accommodate displaying dynamic labels 
                    	var pad = "";
                    	if (eventRow.isDynamicLabelRow()) {	
                   			for (p = 0; p < dynamicLabels.length-1; p++) {
                				pad += "<br/>&nbsp;";
                			}
                		}
                		
                		rowLabel += (pad + "</span>");	
                		FLOWSHEET_DATA.push({LABEL: rowLabel, DATA: data});
                	} 
				} // end of row
            }
        }
        
        columnObj = {
        		"RESULTS" : FLOWSHEET_DATA
        };
             
        return columnObj;
    }

	return {
		/**
		 *  RenderAssessmentSection
		 *	Renders the assessment HTML
		 *	@param component  calling component
		 *	@param recordData  data returned from the script call
		 *	@param sectionNum  2 if second section, otherwise third section
		 */
		RenderAssessmentSection : function(component, recordData, sectionNum) {
			
		  var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var compId = component.getComponentId();
               	
                var buckets = [];
                var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                var criterion = component.getCriterion();
                var data = [];
                var events = [];
                var dynamicLabels = [];
                var columns = [];
                var dateSeq = -1;
                
                data = UnpackReply(recordData);
                events = getRowLabels(recordData);
                dynamicLabels = getDynamicLabels(recordData);
                
                // Buckets of all available event dates
                for( i = 0; i < data.length; i++) {
					var event = data[i];
					var latestDate = "";

					var prevDt = null;
					if(data[i - 1]) {
						prevDt = data[i - 1].DATE;
					}

					//Only add a new bucket if it is not the same day
					if(!AreResultsOnSameDay(prevDt, event.DATE)) {
						latestDate = df.format(event.DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
						
						dateSeq += 1;
						
						var dateDisplay = "<span class='fs-new-day'>" + df.format(event.DATE, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR) + 
							"<br />" + df.format(event.DATE, mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS) + "</span>";
				
						var erb = new EventResultBucket(event.DATE, latestDate, dateSeq);
						buckets.push(erb);
						columns.push({
							"DATE" : event.DATE,
							"COLUMN_DISPLAY" : dateDisplay,
							"DATE_KEY" : dateSeq
						});
					}
				}				
            	// Create the Assessment table and populate all the assessment data
                var assessmentTable = new AssessmentTable(buckets);
				assessmentTable.initAssessmentData(data,events);               
                                    
                // Create Flowsheet table
                var assessmentFlowsheet = null;
				var hoverExtension = new TableCellHoverExtension();
				var column = "";
				var columnCnt = columns.length;
				var flowsheetData = null;
				var columnWidth = 125; // column width always be 125 px
				
				// Since the Flowsheet framework auto adjusts the column size in order to support full screen size
				// We need to determine the truncation size for text overflow of multi-line results which IE does not support 
				var truncateSize = getTruncationByColumn(component, columnCnt);
	
               	assessmentFlowsheet = new FlowsheetTable();
				assessmentFlowsheet.addExtension(hoverExtension);
				assessmentFlowsheet.setNamespace(component.getStyles().getId());
				
				flowsheetData = processFlowsheetData(assessmentTable.getRows(), columns, events, dynamicLabels, truncateSize);
				
				//this will add label and result columns to the assessment table
				assessmentFlowsheet.addLabelColumn(new TableColumn().setColumnDisplay("&nbsp;<br />&nbsp;").setColumnId("EventName").setRenderTemplate('<span>${LABEL}</span>'));
				
						
				//Looping through the results and creating the columns
				for (var j = 0; j < columnCnt; j++) {
					column = new TableColumn().setColumnId("data"+j+ "_" + compId).setColumnDisplay(columns[j].COLUMN_DISPLAY).setCustomClass("pab2-wf-content-column").setRenderTemplate("${DATA['"+columns[j].DATE_KEY+"'].DISPLAY}");
					column.setWidth(columnWidth); // adjust column width
					assessmentFlowsheet.addResultColumn(column);
					// add hover, if applicable
					hoverExtension.addHoverForColumn(column, function(dataObj) {
						return createResultHover(dataObj);
					});
				}
				
				//Binding the results and labels data for display
				assessmentFlowsheet.bindData(flowsheetData.RESULTS);

				//Store off the component table
				component.setFlowsheetTable(assessmentFlowsheet);
				
				//Finalize the component using the assesmentTable.render() method to create the table html
				component.finalizeComponent(assessmentFlowsheet.render());
				
                
            } catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                } throw (err);
            } finally {
                if (timerRenderComponent) {
                    timerRenderComponent.Stop();
                }
                if (component.m_loadTimer){
                	component.m_loadTimer.Stop();
                }
            }
        }
	};

}();
