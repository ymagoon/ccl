function PartoTableBaseStyleWF() {
    this.initByNamespace("parto-tb-wf");
}
var PARTO_TABLE_BASE = function() {
    function PartoTableBase() {
        // window of data in hours to be displayed
        this.HOUR_WINDOW = 12;
        this.tableComponentsMap = {};
        var ONE_HOUR_MS = 1 * 60 * 60 * 1000;
        this.HOUR_WINDOW_IN_MS = this.HOUR_WINDOW * ONE_HOUR_MS;
        this.TABLE_START_TIME = null;
        this.TABLE_END_TIME = null;
        var STATIC_CONTENT_PATH;
        this.scrollLeft = 0;
        this.prevEdgeTruncatedColumns = {};
        //save the widths of certain dom elements so that 
        //they can be reused
        this.legendColumnWidth = 0;
        this.tableBodyWidth = 0;
        // the table will draw 24 extra hours than the graph since Partogram end time can be in future when
        //alert/action line is in future or when there is not enough hour_window (in other words, the 
        //the last refreshed time bar is floating)
        this.extraHoursToBeDrawn = 24;

        /**
         * Sets the height/width and other properties of the tables inside flowsheet container. The logic has been adopted from
         * FlowSheetTable.updateAfterResize() and modified to suit the Partogram table custom needs
         * This method should be called on every component resize
         */
        this.setFlowSheetTableDimensions = function(uniqueCompId) {
            var compDOMObj = $("#" + uniqueCompId);
            if (!compDOMObj.length) {
                return;
            }
            var labelTableDiv = $(compDOMObj).find(".fs-label-table");
            var resultsTableDiv = $("#" + uniqueCompId + "resultsTabletable");
            var resultsTableBodyDiv = $("#" + uniqueCompId + "resultsTabletableBody");
            var resultsTableBodyDivTableId = document.getElementById(uniqueCompId + "resultsTabletableBodyId");
            var percentageWidthAllocatedForLegendContainer = 0.12;
            var graphAxisWidth = 25;

            // the label table should be the same width as partogram legend container - 12% of the total width
            this.legendColumnWidth = this.legendColumnWidth || percentageWidthAllocatedForLegendContainer * compDOMObj.width();
            // adjust to include the graph's Y-axis width
            var graphCol1containerWidth = this.legendColumnWidth + graphAxisWidth;
            var plotWidth = PARTO_GRAPH_BASE.getComponentWidth();

            labelTableDiv.css({
                "width": graphCol1containerWidth
            });

            //result table width should be set prior for proper calculation of tablebodywidth  
            resultsTableDiv.css({
                "width": plotWidth
            });

            this.tableBodyWidth = this.tableBodyWidth || resultsTableBodyDivTableId.scrollWidth;

            // scroll table to the graph's end date
            var scrollLeft = this.getScrollLeftForTable(this.tableBodyWidth);

            $(resultsTableBodyDiv).css({
                "width": this.tableBodyWidth + "px"
            });

            //does not have to be called for all 3 tables
            $("#" + uniqueCompId + " .partoTopBarContainer.table").css({
                "margin-left": graphCol1containerWidth
            });
            resultsTableDiv.scrollLeft(scrollLeft);

        };

        /**
         * This method will take care of adding partogram specific UI elements 
         * like current time bar, Timescale, cursor hand and also prevents truncated results
         * from being shown 
         */
        this.addPartogramTableAttributes = function(uniqueCompId) {
            var resultsTableDiv = $("#" + uniqueCompId + "resultsTabletable");
            var currentTimeDiv = "<div class = 'parto-table-currentTimeOverlay' id='" + uniqueCompId + "currentTimeOverlay'></div>";
            var resultsTableBodyDiv = $("#" + uniqueCompId + "resultsTabletableBody");

            // add a class the results table div
            $("#" + uniqueCompId).addClass("partogramTableDiv");

            // add a table id for the table inside the results table div so we can set the width later
            $("#" + uniqueCompId + "resultsTabletableBody table").prop("id", uniqueCompId + "resultsTabletableBodyId");
            this.setFlowSheetTableDimensions(uniqueCompId);

            // draw timeline bar
            if (!PARTO_GRAPH_BASE.topBarTableHTML) {
                PARTO_GRAPH_BASE.refreshTopbar(uniqueCompId);
            }

            // cursor hand on table
            this.setCursorHand("OPEN", uniqueCompId);

            // a common results table body div for all table components
            resultsTableBodyDiv.addClass("partogramTableBodyDiv");

            // display current time bar 
            resultsTableDiv.prepend(currentTimeDiv);

            this.displayCurrentTimeBar(uniqueCompId);

            this.truncateEdgeColumnCells(uniqueCompId);
        };


        /**
         * This method truncates the table cell values of the edge columns, the left and the right one.
         * The truncation happens only if the text is not completely redeable by the user. It will add ellipses
         * and the user will have to hover over the cell to view the result
         */
        this.truncateEdgeColumnCells = function(uniqueCompId) {
            var tableObj = $("#" + uniqueCompId + "resultsTabletableBodyId").get(0);
            var tableBodyWidth = $("#" + uniqueCompId + "resultsTabletable").outerWidth();
            var edgeColumns = this.getEdgeColumns(tableObj);
            var rowCnt = tableObj.rows.length;
            this.resetPreviousEdgeTruncation(uniqueCompId);
            var ELLIPSES = "...";
            var EMPTY_CELL = "&nbsp;";
            var EMPTY_STRING = "";
            var leftEdgeData = [];
            var rightEdgeData = [];
            var leftEdgeCutpoint = this.scrollLeft;
            var rightEdgeCutpoint = leftEdgeCutpoint + tableBodyWidth;
            var newCellHTML;
            for (var i = 0; i < rowCnt; i++) {
                var tableRowsCell = tableObj.rows[i].cells;
                var leftTableCell = tableRowsCell[edgeColumns.LEFT_INDEX];
                var rightTableCell = tableRowsCell[edgeColumns.RIGHT_INDEX];
                if (!leftTableCell || !rightTableCell) {
                    continue;
                }
                var leftTableSpan = $(leftTableCell).find("span");
                var rightTableSpan = $(rightTableCell).find("span");
                if (leftTableSpan.length > 0 && leftTableSpan[0].innerHTML !== EMPTY_STRING && leftTableSpan[0].innerHTML !== EMPTY_CELL) {
                    leftTableSpan = $(leftTableSpan).get(0);
                    var leftCellLeft = leftTableCell.offsetLeft;
                    var leftSpanLeft = leftTableSpan.offsetLeft;
                    var leftSpanWidth = $(leftTableSpan).outerWidth();
                    var leftSpanStart = leftCellLeft + leftSpanLeft;
                    var leftSpanEnd = leftSpanStart + leftSpanWidth;
                    var leftCellHTML = leftTableCell.innerHTML;
                    newCellHTML = leftCellHTML;
                    if (leftSpanStart < leftEdgeCutpoint &&
                        leftSpanEnd > leftEdgeCutpoint) {
                        //save the current html along with row and the column number to restore it once the
                        //cell is completely visible or goes out of view.
                        leftEdgeData.push({
                            ROW: i,
                            COL: edgeColumns.LEFT_INDEX,
                            HTML: leftCellHTML
                        });
                        newCellHTML = ELLIPSES;
                    }
                    leftTableCell.innerHTML = newCellHTML;
                }

                if (rightTableSpan.length > 0 && rightTableSpan[0].innerHTML !== EMPTY_STRING && rightTableSpan[0].innerHTML !== EMPTY_CELL) {
                    rightTableSpan = $(rightTableSpan).get(0);
                    var rightCellLeft = rightTableCell.offsetLeft;
                    var rightSpanLeft = rightTableSpan.offsetLeft;
                    var rightSpanWidth = $(rightTableSpan).outerWidth();
                    var rightSpanStart = rightCellLeft + rightSpanLeft;
                    var rightSpanEnd = rightSpanStart + rightSpanWidth;
                    var rightCellHTML = rightTableCell.innerHTML;
                    newCellHTML = rightCellHTML;
                    if (rightSpanStart < rightEdgeCutpoint &&
                        rightSpanEnd > rightEdgeCutpoint) {
                        rightEdgeData.push({
                            ROW: i,
                            COL: edgeColumns.RIGHT_INDEX,
                            HTML: rightCellHTML
                        });
                        newCellHTML = ELLIPSES;
                    }
                    rightTableCell.innerHTML = newCellHTML;
                }
            }
            //store the left and right edge data to restore it later
            this.prevEdgeTruncatedColumns[uniqueCompId].LEFT_EDGE = leftEdgeData;
            this.prevEdgeTruncatedColumns[uniqueCompId].RIGHT_EDGE = rightEdgeData;
        };

        /**
         * This method restores the previous values of the table cells which were replaced by ellipses 
         * as they were not completely visible
         */
        this.resetPreviousEdgeTruncation = function(uniqueCompId) {
            var cellData, i;
            if (typeof(this.prevEdgeTruncatedColumns[uniqueCompId]) === "undefined") {
                this.prevEdgeTruncatedColumns[uniqueCompId] = {};
                return;
            }
            if ($.isEmptyObject(this.prevEdgeTruncatedColumns[uniqueCompId])) {
                return;
            }
            var tableObj = $("#" + uniqueCompId + "resultsTabletableBodyId").get(0);
            var leftEdgeData = this.prevEdgeTruncatedColumns[uniqueCompId].LEFT_EDGE;
            var rightEdgeData = this.prevEdgeTruncatedColumns[uniqueCompId].RIGHT_EDGE;
            var leftRowCnt = leftEdgeData.length;
            var rightRowCnt = rightEdgeData.length;
            for (i = 0; i < leftRowCnt; i++) {
                cellData = leftEdgeData[i];
                tableObj.rows[cellData.ROW].cells[cellData.COL].innerHTML = cellData.HTML;
            }
            for (i = 0; i < rightRowCnt; i++) {
                cellData = rightEdgeData[i];
                tableObj.rows[cellData.ROW].cells[cellData.COL].innerHTML = cellData.HTML;
            }
            this.prevEdgeTruncatedColumns[uniqueCompId] = {};
        };

        /**
         * This method finds the left and right column number of the current view.
         */
        this.getEdgeColumns = function() {
            var startTime = PARTO_GRAPH_BASE.getStartDate();
            var timeForOneColumn = this.getColumnsinHours() * ONE_HOUR_MS;
            var leftCol = Math.floor((startTime - this.TABLE_START_TIME) / timeForOneColumn);
            var rightCol = leftCol + this.HOUR_WINDOW / this.getColumnsinHours();
            return {
                LEFT_INDEX: leftCol,
                RIGHT_INDEX: rightCol
            };
        };

        /**
         * Adds the hand cursor action on all the table components. Need to give full relative URL as I.E. doesn't support relative URL from the CSS
         * file(which will be "../images/<FILENAME>") Giving full relative URL works for all browsers.
         * if uniqueCompID is not provided, the cursor is set on all tables else only on that particular component
         */
        this.setCursorHand = function(type, uniqueCompID) {
            var cursorPath = STATIC_CONTENT_PATH + "/images";
            switch (type) {
                case "OPEN":
                    cursorPath += "/partoOpenHand.cur";
                    break;
                case "CLOSE":
                    cursorPath += "/partoClosedHand.cur";
                    break;
            }
            if (uniqueCompID) {
                $("#" + uniqueCompID + "resultsTabletable").css("cursor", "url(" + cursorPath + "), default");
            } else {
                $(".partogramTableBodyDiv").css("cursor", "url(" + cursorPath + "), default");
            }
        };

        /**
         * This function will calculate the scrollLeft position of the table. The body of the table is moved by X pixels where X represents the start
         * date/time of the component in pixels.
         * 
         * @param tableBodyWidth -
         *            the entire width of table body which includes all the columns
         */
        this.getScrollLeftForTable = function(tableBodyWidth) {
            var startDate = PARTO_GRAPH_BASE.getStartDate();
            var totalTableTime = this.TABLE_END_TIME - this.TABLE_START_TIME;
            var amountOfTimePassedSinceStartDate = this.TABLE_END_TIME - startDate;
            var amountOfTimePassedSinceStartDateInPixels = tableBodyWidth * (amountOfTimePassedSinceStartDate / totalTableTime);
            this.scrollLeft = tableBodyWidth - amountOfTimePassedSinceStartDateInPixels;
            return this.scrollLeft;
        };

        /**
         * Returns the number of hours a column represents the number of hours. Note: The value set be a divisor of 24 Ex: 1,2,3,4,6,8 are all
         * acceptable values, whereas 5,7,9 are not
         */
        this.getColumnsinHours = function() {
            switch (this.HOUR_WINDOW) {
                case 1:
                    return 0.25;
                case 4:
                    return 1;
                case 8:
                    return 1;
                case 12:
                    return 2;
                case 24:
                    return 3;
            }
        };
        /*
         * An EventResultBucket is a representation of a single grouping of results for a given date and time for a given row. @param eventDate
         *  The event date of a grouping of results @param eventDateDisp  The event date display textual string @param eventSeq
         *  The event date order (column sequence order)
         */
        this.EventResultBucket = function(eventDate, eventDateDisp, eventSeq) {
            var mEventData = eventDate;
            var mEventDateDisp = eventDateDisp;
            var mSeq = eventSeq;
            var mResults = [];

            /**
             * @return Returns the begin date associated to the bucket for the date range qualification
             */
            this.getEventDate = function() {
                return mEventData;
            };

            /**
             * @return Returns the begin date associated to the bucket for the date range qualification
             */
            this.getEventDateDisp = function() {
                return mEventDateDisp;
            };

            /**
             * Accepts an <code>Assessment</code> and adds the result to the bucket
             */
            this.addResult = function(result) {
                mResults.push(result);
            };

            /**
             * @return Returns all assessments added to the bucket
             */
            this.getResults = function() {
                return mResults;
            };

            /**
             * @return Returns bucket sequence
             */
            this.getSeq = function() {
                return mSeq;
            };
        };
        /**
         * The <code>EventResult</code> is an object representation of the documented event
         * 
         * @param eventResult
         *             The documented event value
         * @param eventDate
         *             The event date
         * @param eventLabel
         *             The event dynamic label or null
         * @param eventCode
         *             The event code value
         */
        this.EventResult = function(eventResult, eventData, eventLabel, eventCode) {
            var mEventData = eventResult.DATE;
            var mEventCode = eventCode;
            var mDynamicLabel = eventLabel;
            var mUom = eventData.UNIT;
            var mResult = eventData.RESULT;
            var mNormalcy = eventData.NORMALCY;
            var mModifiedIndicator = eventData.MODIFIED_IND;


            /**
             * @return the actual event result
             */
            this.getResult = function() {
                return mResult;
            };

            /**
             * @return The clinical date and time of the event
             */
            this.getEventDate = function() {
                return mEventData;
            };

            /**
             * @return The event code identifier tied to the event
             */
            this.getEventCode = function() {
                return mEventCode;
            };

            /**
             * @return Indicator that classifies this results to be tied to a dynamic group label
             */
            this.isDynamicLabel = function() {
                if (mDynamicLabel === null) {
                    return false;
                }
                return true;
            };

            /**
             * @return The dynamic group label associate to the event
             */
            this.getDynamicLabel = function() {
                return mDynamicLabel;
            };

            /**
             * @return The event code display of the event
             */
            this.getDisplay = function() {
                return mEventCode.display;
            };

            /**
             * @return The unit of measure code object associated to the event
             */
            this.getUnitOfMeasure = function() {
                return mUom;
            };

            /**
             * @return states whether the result is normal,high or low. 
             */
            this.getNormalcy = function() {
                return mNormalcy;
            };

            /**
             * @return Returns whether the result was modified
             */
            this.getModifiedIndicator = function() {
                return mModifiedIndicator;
            };
        };

        /**
         * An EventRow is a representation of a single row to display within the assessment table.
         * 
         * @param label
         *             The display that is to be utilized for the row.
         * @param buckets
         *             The buckets associated to the row that will contain the results.
         * @param dynamicLabel
         *             Denotes if this row supports dynamic labels.
         * @param unit
         *             Unit corresponding to the row
         */
        this.EventRow = function(label, buckets, dynamicLabelRow, unit) {
            var mLabel = label;
            var mBuckets = buckets;
            var mDynamicLabel = dynamicLabelRow;
            var mUnit = unit;
            /**
             * @return Returns the display to utilize for row
             */
            this.getLabel = function() {
                return mLabel;
            };

            /**
             * @return Returns the <code>EventResultBucket</code>s associated to the row
             */
            this.getBuckets = function() {
                return mBuckets;
            };

            /**
             * @return Returns the <code>EventResultBucket</code>s associated to the row
             */
            this.isDynamicLabelRow = function() {
                return mDynamicLabel;
            };

            /**
             * @return Returns the unit associated to the row
             */
            this.getRowUnit = function() {
                return mUnit;
            };

        };

        /**
         * An AssessmentTable is a representation of the assessment table that holds all row data, as well as column headers.
         * 
         * @param buckets
         *             The buckets (columns) defined for the table.
         */
        this.AssessmentTable = function(buckets) {
            var mRows = [];
            var mBuckets = buckets;

            /**
             * Initialize the table with assessments retrieved from the data retrieval script
             * 
             * @param recordData
             *             The JSon associated to the data retrieved from the service
             */
            this.initAssessmentData = function(results, events) {
                var resultsLength = results.length;
                for (var x = 0; x < resultsLength; x++) {
                    // loop through data results
                    var data = results[x].DATA;
                    var dataLength = data.length;
                    for (var y = 0; y < dataLength; y++) {
                        var unitData = data[y];
                        var eventCode = unitData.CODE;
                        var unit = unitData.UNIT;
                        var newBuckets = null;
                        var eventRow = null;
                        var eventResult = null;
                        var eventSeq = PARTO_TABLE_BASE.getRowSequence(eventCode, events);
                        eventResult = new PARTO_TABLE_BASE.EventResult(results[x], unitData, null, eventCode);

                        eventRow = mRows[eventSeq];
                        if (!eventRow) {
                            newBuckets = this.createEventRowBuckets(mBuckets);
                            eventRow = new PARTO_TABLE_BASE.EventRow(PARTO_TABLE_BASE.getRowLabel(eventCode, events), newBuckets, false, unit);
                            if (eventSeq !== -1) {
                                mRows[eventSeq] = eventRow;
                            }
                        }
                        this.addResultToBucket(eventResult, eventRow);
                    }

                    // loop through dynamic label results
                    var labels = results[x].LABELS;
                    var labelsLength = labels.length;
                    for (var z = 0; z < labelsLength; z++) {
                        var lablesDataLength = labels[z].LABEL_DATA.length;
                        for (var k = 0; k < lablesDataLength; k++) {
                            var labelData = labels[z].LABEL_DATA[k];
                            var labelEventCode = labelData.CODE;
                            var labelNewBuckets = null;
                            var labelEventRow = null;
                            var labelEventResult = null;
                            var labelEventSeq = PARTO_TABLE_BASE.getRowSequence(labelEventCode, events);
                            var rowUnit = labelData.UNIT;

                            labelEventResult = new PARTO_TABLE_BASE.EventResult(results[x], labelData, labels[z].LABEL, labelEventCode);

                            labelEventRow = mRows[labelEventSeq];
                            if (!labelEventRow) {
                                labelNewBuckets = this.createEventRowBuckets(mBuckets);
                                labelEventRow = new PARTO_TABLE_BASE.EventRow(PARTO_TABLE_BASE.getRowLabel(labelEventCode, events), labelNewBuckets,
                                    true, rowUnit);
                                if (labelEventSeq !== -1) {
                                    mRows[labelEventSeq] = labelEventRow;
                                }
                            }
                            this.addResultToBucket(labelEventResult, labelEventRow);
                        }
                    }
                }
            };

            /**
             * @return Returns the array of elements per bucket
             */
            this.getRows = function() {
                return mRows;
            };

            /**
             * Function will take a given result and determine if the result's end date falls between the bucket's date range. If the result is found
             * to be within the bounds of a bucket, it will be added.
             * 
             * @param result
             *             The result to evaluate to which bucket placed.
             * @param eventRow
             *             The row that contains the buckets to evaluate.
             */
            this.addResultToBucket = function(result, eventRow) {
                var resultDate = result.getEventDate();
                var eventTime = resultDate.getTime();

                var rowBuckets = eventRow.getBuckets();
                var rowBucketsLength = rowBuckets.length;
                var stepHrs = PARTO_TABLE_BASE.getColumnsinHours() * ONE_HOUR_MS;
                for (var x = 0; x < rowBucketsLength; x++) {
                    var rowBucket = rowBuckets[x];
                    var bucketMinLimit = rowBucket.getEventDate().getTime();
                    var bucketMaxLimit = bucketMinLimit + stepHrs;
                    if (eventTime >= bucketMinLimit && eventTime <= bucketMaxLimit) {
                        rowBucket.addResult(result);
                        break;
                    }
                }

            };

            /**
             * Based on the initial bucket templates provided, create a duplicate set of buckets based on the begin and end dates
             * 
             * @param bucketsTemplate
             *             An <code>Array</code> of buckets that dictate the bounds in which results are to be divided
             * @return <code>Array<code> of buckets duplicated from the template provided.
             */
            this.createEventRowBuckets = function(bucketsTemplate) {
                var rowBuckets = [];
                var bucketsTemplateLength = bucketsTemplate.length;
                for (var x = 0; x < bucketsTemplateLength; x++) {
                    rowBuckets.push(new PARTO_TABLE_BASE.EventResultBucket(bucketsTemplate[x].getEventDate(), bucketsTemplate[x].getEventDateDisp(),
                        bucketsTemplate[x].getSeq()));
                }
                return rowBuckets;
            };
        };

        /**
         * formatNumber Checks whether an object should be localized. Prior to calling the format method, need to check that the object is a string or
         * number.
         * 
         * @param num
         *             any object that possibly needs formatting
         * @return if a valid number or string is passed, a properly formatted number is returned; otherwise, parameter is returned
         */
        this.formatNumber = function(num) {
            if (typeof num === "string") {
                num = mp_formatter._trim(num);
            }
            if (!mp_formatter._isNumber(num)) {
                return num;
            }

            return MP_Util.GetNumericFormatter().format(num);
        };

        /**
         * unpackReply Puts the elements from the reply into a records structure for sorting. Items are sorted by event date (desc).
         * 
         * @param recordData
         *             data returned from the script
         * @return array - reply elements sorted by event date (desc)
         */
        this.unpackReply = function(recordData) {
            var i, j, k;
            var events = [];
            var eventDate;
            var recordDataLength = recordData.QUAL.length;

            for (i = 0; i < recordDataLength; i++) {
                var data = [];
                var tableDataLength = recordData.QUAL[i].TABLE_DATA.length;
                var qual = recordData.QUAL[i];
                var dynamicListLength = recordData.QUAL[i].DYNAMIC_LIST.length;
                var labels = [];

                eventDate = new Date();
                eventDate.setISO8601(recordData.QUAL[i].DATA_DT_TM);

                for (j = 0; j < tableDataLength; j++) {
                    var rslt;
                    var tableDataUnit = qual.TABLE_DATA[j];
                    if (tableDataUnit.RESULT_TYPE_FLAG === 5) {
                        rslt = PARTO_GRAPH_BASE.getFormattedLocalDateTime(tableDataUnit.EVENT_RESULT, "FULL_DATE_TIME");
                    } else {
                        rslt = this.formatNumber(tableDataUnit.EVENT_RESULT);
                    }
                    data.push({
                        CODE: tableDataUnit.EVENT_CODE,
                        RESULT: rslt,
                        UNIT: tableDataUnit.EVENT_RESULT_UNITS,
                        LABEL_FLAG: tableDataUnit.DYNAMIC_LABEL_FLAG,
                        NORMALCY: tableDataUnit.RESULT_NORMALCY,
                        MODIFIED_IND: tableDataUnit.RESULT_MODIFIED_IND
                    });
                }

                for (j = 0; j < dynamicListLength; j++) {
                    var labelData = [];
                    var dynamicData = qual.DYNAMIC_LIST[j];
                    var dynamicDataLength = dynamicData.DYNAMIC_DATA.length;

                    for (k = 0; k < dynamicDataLength; k++) {
                        var rslt1;
                        var dynamicDataUnit = dynamicData.DYNAMIC_DATA[k];
                        if (dynamicDataUnit.EVENT_RESULT && dynamicDataUnit.RESULT_TYPE_FLAG === 5) {
                            rslt1 = PARTO_GRAPH_BASE.getFormattedLocalDateTime(dynamicDataUnit.EVENT_RESULT, "FULL_DATE_TIME");
                        } else {
                            rslt1 = this.formatNumber(dynamicDataUnit.EVENT_RESULT);
                        }
                        labelData.push({
                            CODE: dynamicDataUnit.EVENT_CODE,
                            RESULT: rslt1,
                            UNIT: dynamicDataUnit.EVENT_RESULT_UNITS,
                            NORMALCY: dynamicDataUnit.RESULT_NORMALCY,
                            MODIFIED_IND: dynamicDataUnit.RESULT_MODIFIED_IND
                        });
                    }

                    labels.push({
                        LABEL: PARTO_GRAPH_BASE.removeColonEndOfString(dynamicData.DYNAMIC_LABEL),
                        ID: dynamicData.DYNAMIC_LABEL_ID,
                        LABEL_DATA: labelData
                    });
                }

                events.push({
                    DATE: eventDate,
                    DYNAMIC_LABEL: qual.DYNAMIC_LABEL,
                    LABEL_ID: qual.DYNAMIC_LABEL_ID,
                    DATA: data,
                    LABELS: labels
                });
            }

            // Sort the events based on time (descending)
            events.sort(function(a, b) {
                return b.DATE.getTime() - a.DATE.getTime();
            });
            return events;
        };

        /**
         * getDynamicLabels Retrieves the list of dynamic labels
         * 
         * @param recordData
         *             data returned from the script call
         * @param maxDynamicLabelsCnt
         *             maximum number of dynamic lables to be returned if not provided, all results will be returned.
         */
        this.getDynamicLabels = function(recordData, maxDynamicLabelsCnt) {
            var j;
            var i;
            var dynLabels = [];
            var dynKeys = [];
            var qual = recordData.QUAL;
            var qualLength = qual.length;

            for (i = 0; i < qualLength; i++) {
                var qualunit = qual[i];
                var qualunitDynLabel = qualunit.DYNAMIC_LIST;
                var qualunitDynLabelLen = qualunitDynLabel.length;
                for (j = 0; j < qualunitDynLabelLen; j++) {
                    var dynLabelunit = qualunitDynLabel[j];
                    if (dynKeys.indexOf(dynLabelunit.DYNAMIC_LABEL_ID) === -1) {
                        dynLabels.push({
                            LABEL: dynLabelunit.DYNAMIC_LABEL,
                            ID: dynLabelunit.DYNAMIC_LABEL_ID
                        });

                        dynKeys.push(dynLabelunit.DYNAMIC_LABEL_ID);
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
            return (maxDynamicLabelsCnt) ? dynLabels.slice(0, maxDynamicLabelsCnt) : dynLabels;
        };

        /**
         * getRowLabels Retrieves the list of event labels (event sets).
         * 
         * @param recordData
         *             data returned from the script call
         */
        this.getRowLabels = function(recordData) {
            var i, l;
            var rowLabels = [];
            var codeLength = recordData.CODES.length;

            for (i = 0, l = codeLength; i < l; i++) {
                var eventRow = recordData.CODES[i];
                if (!eventRow) {
                    continue;
                }
                var display = PARTO_GRAPH_BASE.removeColonEndOfString(eventRow.DISPLAY);
                rowLabels.push({
                    CODE: eventRow.CODE,
                    DISPLAY: display,
                    SEQUENCE: i
                });
            }

            return rowLabels;
        };

        /**
         * getRowLabel Retrieves the event label by code value
         * 
         * @param codeValue
         *             an event code value
         * @parma eventlsit  an array of all row labels
         */
        this.getRowLabel = function(codeValue, eventList) {
            var i;
            var eventListLength = eventList.length;
            for (i = 0; i < eventListLength; i++) {
                if (eventList[i].CODE === codeValue) {
                    return eventList[i].DISPLAY;
                }
            }

            return "";
        };

        /**
         * getRowSequence Retrieves the event ordering sequence by code value
         * 
         * @param codeValue
         *             an event code value
         * @parma eventlsit  an array of all row labels
         */
        this.getRowSequence = function(codeValue, eventList) {
            var i;
            var eventListLength = eventList.length;
            for (i = 0; i < eventListLength; i++) {
                if (eventList[i].CODE === codeValue) {
                    return eventList[i].SEQUENCE;
                }
            }

            return -1;
        };

        /**
         * Creates the hover text for cells with results
         * 
         * @param result
         *             The data object passed from the TableHoverCellExtension.
         */
        this.createResultHover = function(result) {
            var hoverHTML = [];

            // Grab result information
            var row = result.RESULT_DATA;
            var columnId = result.COLUMN_ID;
            var columnDateKey = columnId.substring(4, columnId.indexOf("_")); // 4 is the length of "data". which is the prefix of the column name
            var hoverTxt = row.DATA[columnDateKey].HOVER;
            var rowLabel = row.LABEL;
            var hoverLabel = (rowLabel.indexOf("<br/>") >= 0) ? rowLabel.substring(0, rowLabel.indexOf("<br/>")) + "</span>" : rowLabel;
            var partoTablebasei18n = i18n.discernabu.partogramtablebase_o2;

            // Check to see if hover needs to be displayed
            if (hoverTxt === null || hoverTxt === undefined || hoverTxt === "") {
                return null; // don't display hovers for empty cells
            }

            // Create the HTML for the hover
            hoverHTML.push("<table class= 'partogram-table-tooltip'><th class = 'partogram-table-tooltip-th'>" + hoverLabel + "</th>");
            hoverHTML.push("<th class = 'partogram-table-tooltip-th'><span title='time'>" + partoTablebasei18n.TOOLTIP_TIME + "</th>");
            hoverHTML.push(hoverTxt);
            hoverHTML.push("</table>");

            return hoverHTML.join("");
        };

        /**
         * Helper function: shortens a text string; used mainly because the CSS property text-overflow:ellipsis does not support multi-line truncation
         * in IE. It only supports single line truncation.
         * 
         * @param prefix
         *             The label prefix if dynamic label
         * @param text
         *             The text to shorten
         * @param uom
         *             The unit of measure display
         * @param maxLength
         *             the maxLength of the text
         */
        this.shorten = function(prefix, text, maxLength) {
            var ret = "";
            text = "<span>" + text + "</span>";
            var secondaryTextFormat = "<span class='parto-tb1-wf-unit'>";
            if (prefix) {
                if (prefix.length > maxLength) {
                    ret = secondaryTextFormat + prefix.substr(0, maxLength - 3) + "</span>&hellip;"; // 3 for the ellipsis
                } else if ((prefix + text).length > maxLength) {
                    ret = secondaryTextFormat + prefix + "</span>" + text.substr(0, maxLength - prefix.length - 3) + "&hellip;";
                } else { // do not shorten
                    ret = secondaryTextFormat + prefix + "</span>" + text;
                }
            } else {
                if (text.length > maxLength) {
                    ret = text.substr(0, maxLength - 3) + "&hellip;";
                } else { // do not shorten
                    ret = text;
                }
            }
            return ret;
        };

        /**
         * Helper function: returns the truncation size for text overflow of multi-line results Note: used mainly because the CSS property
         * text-overflow:ellipsis does not support multi-line truncation in IE. It only supports single line truncation.
         * 
         * @param component
         *             the component object
         * @param columnCnt
         *             the number of columns
         */
        this.getTruncationByColumn = function(component, columnCnt) {
            var labelColumnWidth = 204;
            var pixelBuffer = 2;
            var contentTableVisibleWidth = $(component.getSectionContentNode()).width() - labelColumnWidth - pixelBuffer;

            switch (columnCnt) {
                case 1:
                    return contentTableVisibleWidth;
                case 2:
                    return 58;
                case 3:
                    return 48;
                case 4:
                    return 36;
                case 5:
                    return 30;
                default:
                    return 24;
            }
        };

        /**
         * Helper function: creates hover for the columns in flowsheet table
         * 
         * @param datObj
         *             the content required to form the text of hover
         */
        this.createResultHoverForColumn = function(dataObj) {
            return PARTO_TABLE_BASE.createResultHover(dataObj);
        };

        /**
         * Calculates Table's start and end time
         */

        this.setPartogramTableStartEndRange = function() {
            var colHourRatioInMs = this.getColumnsinHours() * ONE_HOUR_MS;
            // calculate end time
            var partogramEndDate = new Date(PARTO_GRAPH_BASE.getPartogramLastLoadTime());

            partogramEndDate.setHours(partogramEndDate.getHours() + this.extraHoursToBeDrawn);
            // adjusting UTC time to match local time
            // getTimezoneOffset returns the difference between UTC and localtime
            // If your time zone is GMT+2, -120 will be returned.
            // Therefore, localTime = UTC - offset
            var offset = -1 * partogramEndDate.getTimezoneOffset() * 60 * 1000;
            var partogramEndDateAdjusted = partogramEndDate.getTime() + offset;
            // get the nearest hour that is multiple of step and convert back to local time
            var endTime = Math.floor(partogramEndDateAdjusted / colHourRatioInMs) * colHourRatioInMs + colHourRatioInMs - offset;

            // calculate start time
            var partogramStartDate = new Date(PARTO_GRAPH_BASE.finalStartTime);
            // adjusting UTC time to match local time
            var partogramStartDateAdjusted = partogramStartDate.getTime() + offset;
            // get the nearest hour that is multiple of step and convert back to local time
            var startTime = Math.floor(partogramStartDateAdjusted / colHourRatioInMs) * colHourRatioInMs - offset;
            this.TABLE_START_TIME = startTime;
            this.TABLE_END_TIME = endTime;

        };

        /**
         * Scroll table components when other components are scrolled
         */

        this.refreshTable = function() {
            var scrollLeft = null;
            var tableBodyWidth = this.tableBodyWidth;
            for (var uniqueCompId in this.tableComponentsMap) {
                if (this.tableComponentsMap.hasOwnProperty(uniqueCompId)) {
                    tableBodyWidth = tableBodyWidth || $("#" + uniqueCompId + "resultsTabletableBody").outerWidth();
                    scrollLeft = scrollLeft || this.getScrollLeftForTable(tableBodyWidth);
                    $("#" + uniqueCompId + "resultsTabletable").scrollLeft(scrollLeft);
                    this.displayCurrentTimeBar(uniqueCompId);
                    this.truncateEdgeColumnCells(uniqueCompId);
                }
            }
            this.setCursorHand("OPEN");
        };

        /**
         * redraw table components when time scales are switched
         * 
         * @param hourWindow
         */

        this.redrawTable = function(hourWindow) {
            this.setHourWindow(hourWindow);
            this.tableBodyWidth = 0;
            for (var uniqueCompId in this.tableComponentsMap) {
                if (this.tableComponentsMap.hasOwnProperty(uniqueCompId)) {
                    //call reset truncation before rendering since the number of columns can change due to time scale switch
                    this.resetPreviousEdgeTruncation(uniqueCompId);
                    PARTO_TABLE_BASE.renderTableSection(this.tableComponentsMap[uniqueCompId]);
                    PARTO_TABLE_BASE.addPartogramTableAttributes(uniqueCompId);
                    this.truncateEdgeColumnCells(uniqueCompId);
                }
            }
        };

        /**
         * Set hour window
         * 
         * @param hourWindow
         */
        this.setHourWindow = function(hourWindow) {
            this.HOUR_WINDOW = hourWindow;
            this.HOUR_WINDOW_IN_MS = this.HOUR_WINDOW * ONE_HOUR_MS;
        };

        /**
         * Displays the current time bar if it is within start/end range
         */
        this.displayCurrentTimeBar = function(uniqueCompId) {
            var partogramLastLoadTime = PARTO_GRAPH_BASE.getPartogramLastLoadTime();
            var endDt = PARTO_GRAPH_BASE.getEndDate();
            var startDt = PARTO_GRAPH_BASE.getStartDate();
            var adjustedEnddt = endDt + 60000; // 60 seconds - a safe adjustment we don't miss plotting the current time if it is close
            var currentTimeBarOverLayDiv = $("#" + uniqueCompId + "currentTimeOverlay");
            if (startDt <= partogramLastLoadTime && partogramLastLoadTime <= adjustedEnddt) {
                //the 50 is to exclude the empty cell on top of the lable table
                var resultsTableBodyDivHeight = $("#" + uniqueCompId + "labelTabletable").height() - 50;
                var plotWidth = PARTO_GRAPH_BASE.getComponentWidth();
                //8 is the padding around the table and 25 is axis width
                var posResultsTable = this.legendColumnWidth + 25 + 8; //resultsTablePos.left;
                var difference = partogramLastLoadTime - startDt;
                var PixelPerMsRatio = plotWidth / this.HOUR_WINDOW_IN_MS;
                var overLayDivWidth = currentTimeBarOverLayDiv.width();
                var left = (PixelPerMsRatio * difference) + posResultsTable;
                if (left >= plotWidth + posResultsTable) {
                    left = plotWidth + posResultsTable - overLayDivWidth;
                } else if (left < posResultsTable) {
                    left = posResultsTable;
                } else {
                    left = left - overLayDivWidth;
                }
                var currentTimecss = {
                    "left": left,
                    "height": resultsTableBodyDivHeight
                };

                currentTimeBarOverLayDiv.css(currentTimecss);
                currentTimeBarOverLayDiv.show();
            } else {
                currentTimeBarOverLayDiv.hide();
            }

        };

        /**
         * Process the data stored in the Assessment table, format to a JSON ready for the Flowsheet table.
         * 
         * @param rows
         *             the list of rows
         * @param columns
         *             the list of columns
         * @param events
         *             the list of all possible events mapped to this table
         * @param truncateSize
         *             the truncation size for text overflow (IE only)
         */
        this.processFlowsheetData = function(rows, columns, events, dynamicLabels, truncateSize) {

            var FLOWSHEET_DATA = [];
            var eventRow = null;
            var eventRowBuckets = [];
            var aRow = null;
            var columnObj = [];
            var emptyRow = "";
            var x, b, y;
            var eventsLength = events.length;
            // loop through row of events
            if (eventsLength > 0) {
                for (x = 0; x < eventsLength; x++) {
                    eventRow = rows[x];
                    var bucketRow = [];
                    var rowData = [];
                    var rowLabel = "";
                    var data = [];
                    var pad = "",
                        paddingCount;
                    // initializing the values in the column
                    for (b = 0; b < columns.length; b++) {
                        var ky = columns[b].DATE_KEY;
                        bucketRow[ky] = {
                            "DISPLAY": emptyRow
                        };
                    }

                    // check to see if this row has any data (buckets) associated to it
                    if (eventRow === null || eventRow === undefined) {
                        var noRowLabel = "<span title='" + events[x].DISPLAY + "'>" + events[x].DISPLAY;
                        var noData = bucketRow;
                        FLOWSHEET_DATA.push({
                            LABEL: noRowLabel,
                            DATA: noData
                        });
                    } else {
                        rowData = bucketRow;

                        // loop through row of buckets
                        eventRowBuckets = eventRow.getBuckets();
                        if (eventRowBuckets) {
                            var eventRowBucketsLen = eventRowBuckets.length;
                            for (y = 0; y < eventRowBucketsLen; y++) {

                                var sFullResultDisplay = "";
                                var sShortenResultDisplay = "";
                                var sHoverResultDisplay = "";
                                var sResult = "",
                                    shortenText = "";
                                var bucket = eventRowBuckets[y];
                                var bucketResults = bucket.getResults();
                                aRow = rowData[eventRowBuckets[y].getSeq()]; // why init here?
                                var dl, z, count = 0;
                                var normalcyClass, modInd, formattedDate, uom, eventDate;

                                // eventrow that is a dynamiclabelrow will contain only dynamic lable results
                                if (eventRow.isDynamicLabelRow()) {
                                    // clearing any previous values
                                    sShortenResultDisplay = "";
                                    sHoverResultDisplay = "";
                                    var noDLData = 0;
                                    var dynLabelLength = dynamicLabels.length;

                                    // only display the max no.of dynamic label results allowed
                                    for (dl = 0; dl < dynLabelLength; dl++) {
                                        count = 0;
                                        var bucketResLength = bucketResults.length;
                                        for (z = 0; z < bucketResLength; z++) {
                                            if (dynamicLabels[dl].LABEL.toUpperCase() === bucketResults[z].getDynamicLabel().toUpperCase()) {
                                                sResult = bucketResults[z].getResult();
                                                var dynamicLabelName = bucketResults[z].getDynamicLabel();
                                                eventDate = new Date(bucketResults[z].getEventDate());
                                                formattedDate = PARTO_GRAPH_BASE.getFormattedLocalDateTime(eventDate, "FULL_DATE_TIME");
                                                normalcyClass = PARTO_GRAPH_BASE.getNormalcyClass(bucketResults[z].getNormalcy());
                                                modInd = bucketResults[z].getModifiedIndicator();

                                                uom = bucketResults[z].getUnitOfMeasure() ? "<span class='parto-tb1-wf-unit'>" + bucketResults[z].getUnitOfMeasure() + "</span>" : "";
                                                if (sResult) {
                                                    if (count === 0) {
                                                        shortenText = this.shorten("[" + dynamicLabelName + "]  ", sResult, truncateSize);
                                                        // the table cell will display only the latest result
                                                        sShortenResultDisplay += this.getModifiedCriticalityHTMLFaceUp(shortenText, normalcyClass, modInd, null);
                                                    }
                                                    // the hover must display all results in the bucket
                                                    sHoverResultDisplay += this.getModifiedCriticalityHTMLHover(dynamicLabelName, sResult, uom, formattedDate, normalcyClass, modInd);
                                                    count++;
                                                } else {
                                                    sFullResultDisplay = emptyRow;
                                                }
                                            }
                                        }

                                        // if dynamic label has no result, display an empty row place holder
                                        if (count === 0) {
                                            sShortenResultDisplay += emptyRow;
                                            noDLData += 1;
                                        }
                                        // Display total number of results for the time period for a particular dynamic label in braces.
                                        if (count > 1) {
                                            sShortenResultDisplay += "<span class='parto-tb1-wf-unit'>&nbsp;&nbsp;(" + count + ")</span>";
                                        }
                                        // add a line break after each dynamic label
                                        sShortenResultDisplay += "<br />";
                                    }

                                    //WHPARTO-428 to fix a bug where if length of dynamic label is 1, we need two BR to get a line break. Since browsers ignore trailing BR tags                                        
                                    if (dynLabelLength === 1) {
                                        sShortenResultDisplay += "<br />";
                                    }
                                    //Wrap with a container span, to get the correct width for truncation
                                    //this class is important so that offsetLeft is calculated correctly for the container span during trucation of partially visible table cell
                                    sShortenResultDisplay = "<span class='parto-table-container-cell-span'>" + sShortenResultDisplay + "</span>";

                                    // populate row data
                                    aRow.DISPLAY = sShortenResultDisplay;
                                    if (noDLData === dynamicLabels.length) {
                                        aRow.HOVER = emptyRow;
                                    } else {
                                        aRow.HOVER = sHoverResultDisplay;
                                    }

                                    // pad the row label so that the label row width has the same width as the results table width
                                    pad = "";
                                    // check if unit needs to be displayed -since unit will already take a separate line, adjust accordingly
                                    paddingCount = (eventRow.getRowUnit()) ? dynamicLabels.length - 2 : dynamicLabels.length - 1;
                                    for (var p = 0; p < paddingCount; p++) {
                                        pad += "<br/>&nbsp;";
                                    }

                                } // if not a dynamic label row
                                else {
                                    count = 0;
                                    for (z = 0; z < bucketResults.length; z++) {
                                        sResult = bucketResults[z].getResult();
                                        if (sResult) {
                                            normalcyClass = PARTO_GRAPH_BASE.getNormalcyClass(bucketResults[z].getNormalcy());
                                            modInd = bucketResults[z].getModifiedIndicator();
                                            uom = bucketResults[z].getUnitOfMeasure() ? "<span class='parto-tb1-wf-unit'>" + bucketResults[z].getUnitOfMeasure() + "</span>" : "";
                                            eventDate = new Date(bucketResults[z].getEventDate());
                                            formattedDate = PARTO_GRAPH_BASE.getFormattedLocalDateTime(eventDate, "FULL_DATE_TIME");
                                            if (count === 0) {
                                                var sLength = (bucketResults.length > 1) ? "<span class='parto-tb1-wf-unit'>(" + bucketResults.length + ")</span>" : "";
                                                shortenText = this.shorten("", sResult, truncateSize);
                                                sFullResultDisplay = this.getModifiedCriticalityHTMLFaceUp(shortenText, normalcyClass, modInd, sLength);
                                            }
                                            sHoverResultDisplay += this.getModifiedCriticalityHTMLHover(null, sResult, uom, formattedDate, normalcyClass, modInd);
                                            count++;
                                        } else { // if no result
                                            sFullResultDisplay = emptyRow;
                                        }
                                    }
                                    //this class is important so that offsetLeft is calculated correctly for the container span during trucation of partially visible table cell
                                    aRow.DISPLAY = (sFullResultDisplay === "") ? emptyRow : "<span class='parto-table-container-cell-span'>" + sFullResultDisplay + "</span>";
                                    //add a break if row has unit
                                    if (eventRow.getRowUnit()) {
                                        aRow.DISPLAY = aRow.DISPLAY + "<br/><br/>";
                                    }
                                    aRow.HOVER = (sHoverResultDisplay === "") ? emptyRow : sHoverResultDisplay;
                                }

                                // loop through results for that given event (row) and day (bucket)

                                aRow.DATE = eventRowBuckets[y].getEventDateDisp();
                                data.push(aRow);
                            } // end of row buckets

                            rowLabel += "<span title='" + eventRow.getLabel() + "'>" + eventRow.getLabel();
                            rowLabel += (eventRow.getRowUnit()) ? "<br/><span title='" + eventRow.getRowUnit() + "' class   ='parto-tb1-wf-unit'>" + eventRow.getRowUnit() : "";

                            rowLabel += (pad + "</span></span>");
                            FLOWSHEET_DATA.push({
                                LABEL: rowLabel,
                                DATA: data
                            });
                        }
                    } // end of row
                }
            }

            columnObj = {
                "RESULTS": FLOWSHEET_DATA
            };

            return columnObj;

        };

        /**
         * Returns the HTML for the values that are displayed face up on table cell.
         * 
         * @param value
         *            value to be displayed
         * @param normalcyClass
         *            The class denoting whether the result is normal, high or low
         * @param modifiedInd
         *            The indicator for a modified result
         * @param count
         *            The number of results that were charted during the same time range
         *            This will be displayed in braces
         */
        this.getModifiedCriticalityHTMLFaceUp = function(value, normalcyClass, modifiedInd, count) {
            value = value || "";
            normalcyClass = normalcyClass || "";
            modifiedInd = modifiedInd || 0;
            var critHTML;

            critHTML = "<span class='" + normalcyClass + "'>";
            critHTML += "<span class='res-ind'></span>" + value;
            critHTML += "</span>";
            if (modifiedInd > 0) {
                critHTML += "<span class='res-modified'></span>";
            }

            if (count) {
                critHTML += count;
            }
            return critHTML;
        };

        /**
         * Returns the HTML for the values that are displayed on the hover of table cell.
         * 
         * @param dynamicLabelName
         *            the name of the dynamic label (optional field)
         * @param value
         *            value to be displayed
         * @param normalcyClass
         *            The class denoting whether the result is normal, high or low
         * @param modifiedInd
         *            The indicator for a modified result
         * @param unit
         *            Unit of measure of the result if any.
         */
        this.getModifiedCriticalityHTMLHover = function(dynamicLabelName, value, unit, date, normalcyClass, modifiedInd) {
            value = value || "";
            normalcyClass = normalcyClass || "";
            modifiedInd = modifiedInd || 0;
            var critHTML = "<TR> <TD class='partogram-table-tooltip-td'>";

            if (dynamicLabelName) {
                critHTML += "<span class='parto-tb1-wf-unit'>[" + dynamicLabelName + "] </span> ";
            }

            critHTML += "<span class='" + normalcyClass + "'>";
            critHTML += "<span class='res-ind'></span>" + value + "</span>";
            critHTML += unit;

            if (modifiedInd > 0) {
                critHTML += "<span class='res-modified'></span>";
            }
            critHTML += "</TD>";
            critHTML += "<TD class='partogram-table-tooltip-td'>" + date + "</TD></TR>";
            return critHTML;
        };
        /**
         * renderTableSection Renders the table HTML
         * 
         * @param component
         *             calling component
         */
        this.renderTableSection = function(component) {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var compId = component.getComponentId();
                var MAX_DYNAMIC_LABELS_CNT = 3;
                var buckets = [];
                var componentUniqueKey = component.getStyles().getId();
                var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                var data = [];
                var events = [];
                var dynamicLabels = [];
                var columns = [];
                var dateSeq = -1;
                var erb, j;
                var recordData = component.recordData;

                data = this.unpackReply(recordData);
                events = this.getRowLabels(recordData);
                dynamicLabels = this.getDynamicLabels(recordData, MAX_DYNAMIC_LABELS_CNT);

                var step = this.getColumnsinHours();
                var stepHrs = step * ONE_HOUR_MS;
                this.setPartogramTableStartEndRange();
                var hours_difference = (this.TABLE_END_TIME - this.TABLE_START_TIME) / ONE_HOUR_MS;
                var columnCount = hours_difference / step;
                var initColTime = this.TABLE_START_TIME;

                while (initColTime <= this.TABLE_END_TIME - stepHrs) {
                    var latestDate = "";
                    var eventDate = new Date(initColTime);
                    latestDate = df.format(eventDate, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
                    dateSeq += 1;

                    var dateDisplay = "<span class='fs-new-day'>" + df.format(eventDate, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR) + "<br />" + df.format(eventDate, mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS) + "</span>";
                    erb = new this.EventResultBucket(eventDate, latestDate, dateSeq);
                    buckets.push(erb);
                    columns.push({
                        "DATE": eventDate,
                        "COLUMN_DISPLAY": dateDisplay,
                        "DATE_KEY": dateSeq
                    });
                    initColTime += stepHrs;
                }

                /* add component to the list */
                if (typeof this.tableComponentsMap[componentUniqueKey] === "undefined") {
                    this.tableComponentsMap[componentUniqueKey] = component;
                    STATIC_CONTENT_PATH = component.getCriterion().static_content;
                }

                // Create the Assessment table and populate all the assessment data
                var assessmentTable = new this.AssessmentTable(buckets);
                assessmentTable.initAssessmentData(data, events);
                // Create Flowsheet table
                var partogramTableFlowSheet = null;
                var hoverExtension = new TableCellHoverExtension();
                var column = "";
                var flowsheetData = null;
                var topBarHtml = [];
                //calculate the width of each column based on the current component width
                //and hour window
                var plotWidth = PARTO_GRAPH_BASE.getComponentWidth();
                var pixelToTimeRatio = plotWidth / this.HOUR_WINDOW_IN_MS;
                var columnWidth = ONE_HOUR_MS * pixelToTimeRatio * this.getColumnsinHours();

                // Since the Flowsheet framework auto adjusts the column size in order to support full screen size
                // We need to determine the truncation size for text overflow of multi-line results which IE does not support
                var truncateSize = this.getTruncationByColumn(component, columnCount);

                partogramTableFlowSheet = new FlowsheetTable();
                partogramTableFlowSheet.addExtension(hoverExtension);
                partogramTableFlowSheet.setNamespace(component.getStyles().getId());
                flowsheetData = this.processFlowsheetData(assessmentTable.getRows(), columns, events, dynamicLabels, truncateSize);
                //set the header row of the results table hidden
                partogramTableFlowSheet.resultsTable.setIsHeaderEnabled(false);
                // this will add label and result columns to the assessment table
                partogramTableFlowSheet.addLabelColumn(new TableColumn().setColumnId("EventName").setRenderTemplate("<span>${LABEL}</span>"));
                // Looping through the results and creating the columns - we want the last X columns of hours

                for (j = 0; j < columnCount; j++) {
                    column = new TableColumn().setColumnId("data" + j + "_" + compId).setColumnDisplay(columns[j].COLUMN_DISPLAY).setCustomClass(
                        "parto-tb1-wf-content-column").setRenderTemplate("${DATA['" + columns[j].DATE_KEY + "'].DISPLAY}");
                    column.setWidth(columnWidth); // adjust column width
                    partogramTableFlowSheet.addResultColumn(column);
                    // add hover, if applicable
                    hoverExtension.addHoverForColumn(column, this.createResultHoverForColumn);
                }

                // Binding the results and labels data for display
                partogramTableFlowSheet.bindData(flowsheetData.RESULTS);
                // Store off the component table
                component.setFlowsheetTable(partogramTableFlowSheet);
                component.finalizeComponent(partogramTableFlowSheet.render());

                /* The timeline bar */
                topBarHtml.push(PARTO_GRAPH_BASE.createTopBar(component.getImageFolderPath(), "TABLE"));
                $("#" + componentUniqueKey + "flowsheetContainer").prepend(topBarHtml.join(""));
            } catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            } finally {
                if (timerRenderComponent) {
                    timerRenderComponent.Stop();
                }
                if (component.m_loadTimer) {
                    component.m_loadTimer.Stop();
                }
            }
        };

    }

    var partoTableBaseObj = new PartoTableBase();
    return partoTableBaseObj;
}();
